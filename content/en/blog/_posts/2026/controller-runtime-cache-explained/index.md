---
layout: blog
title: "How the controller-runtime Cache Actually Works, and Why Your Controller Does Not Crash the API Server"
draft: true
slug: controller-runtime-cache-explained
author: >
  Andrei Kvapil (Ænix),
  Timofei Larkin (Ænix)
---

Kubernetes has long been the default platform for distributed workloads, and writing your own
operator for it is now a matter of a few hours. The standard path — `kubebuilder` on top of
`controller-runtime` — gives you a project scaffold, types, and a reconciler. For typical
scenarios that is more than enough. But as soon as load grows or the operator starts behaving
in ways you did not expect, a whole class of edge cases shows up. Most of them trace back to
the same root cause: a fuzzy mental model of how `controller-runtime` works inside. If you
write Kubernetes controllers in Go, this article should help you build a coherent picture and
avoid expensive surprises in production.

This article walks through the internals of `controller-runtime` and, along the way, shows which
architectural decisions are baked into Kubernetes itself. The starting point is how
controllers actually read objects from the Kubernetes API.

A common misconception goes like this: `r.Get()` inside `Reconcile` queries `kube-apiserver`
directly; `r.List()` returns a fresh, live view of the world; and after `r.Update()` you can
re-read the object and immediately see the new state. In practice the model is the opposite:
`controller-runtime` operates against a local copy of the data populated through **list** + **watch**.
Reads inside a reconciler cost almost nothing and do not load the control plane even at
hundreds of calls per second — but the price of this design is that an operator can quietly
consume gigabytes of memory, perform hidden `O(n)` scans, and regularly trip over stale reads.

This post is aimed at engineers who already write operators in Go with `controller-runtime`
but want to consolidate the pieces into a single mental model rather than carry around a bag
of isolated observations. The focus is the practical impact on production clusters: memory,
network traffic, read consistency, and reconciler behavior.

## TL;DR

If you take only one idea from this article, take this:

`r.Get()` and `r.List()` inside a reconciler typically do not read from the API server. They
read from a local in-memory cache, which the manager warms up with **list** and then keeps
current through **watch**.

Almost every other property of the system follows from that one fact:

- Reads are cheap, but not strongly consistent immediately after a write.
- Writes go straight to the API server, not through the cache.
- The size of the local cache and the set of indexes directly drive memory consumption.
- An incorrectly written `List()` can silently turn into a linear scan over tens of thousands
  of objects.
- `APIReader` is rarely needed — but in some places you really cannot do without it.

The rest of the article unpacks why this is so and how the model is wired underneath.

## A bit of context: what a reconciliation loop is

To avoid arguments about terminology, start with the basic model.

A controller in Kubernetes lives inside a reconciliation loop: it continuously compares the
desired state of an object with the actual state and tries to bring one in line with the
other. The idea is described in the original
[architectural notes](https://github.com/kubernetes/design-proposals-archive/blob/main/architecture/principles.md)
on Kubernetes. In practice it looks like this:

- A user or another controller mutates an object.
- An event lands in a queue.
- `Reconcile` reads the current state.
- The controller decides what to create, update, or delete.
- The system produces a new event and the loop repeats.

What matters here is not that the controller "does something" — it is **where it learns about
changes from** and **where it reads state from**. That is exactly where the cache comes in.

On a live cluster, the easiest way to see this in action is:

```bash
kubectl get pods --watch
```

In watch mode, `kubectl` subscribes to the same event stream that controllers consume.
You create or delete a Pod and you see not a single "final" object but a chain of states: the
scheduler assigns a node, the kubelet updates status, other controllers contribute their
changes. Kubernetes controllers do not poll continuously — they consume an event stream and
maintain a local state that is kept current.

For a visual walkthrough, see [Reconciliation loop pattern in visual representation](https://www.youtube.com/watch?v=P50otWVh7w4),
a talk that shows how the reconciliation loop plays out on a real Pod and the states it
passes through.

## Why the cache exists in `controller-runtime` at all

Imagine the simplest possible controller:

```go
func (r *Reconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    var pod corev1.Pod
    if err := r.Get(ctx, req.NamespacedName, &pod); err != nil {
        return ctrl.Result{}, err
    }
    // ... meaningful logic ...
}
```

Looks straightforward. But what happens when you call `r.Get`? Does it fire an HTTP request at
the API server? If it did, picture the scene: a dozen operators, each running a few
controllers, each issuing a **get** and a **list** per reconcile, with hundreds of reconciles per
second. The API server and `etcd` would be writing each other farewell letters within minutes.

To prevent that, Kubernetes was built around a _watch model_ rather than polling from the
very beginning. The standard mechanism works like this: a client issues **list** once, gets a
snapshot of the slice of the world it cares about, then subscribes to a stream of changes via
**watch** and keeps a local copy current. Everything happens over a single long-lived HTTP
connection, with no "what is in the world right now?" loop.

This idea has lived in `client-go` since the very first controllers in
`kube-controller-manager`. `controller-runtime` wraps it in a friendly framework so
that you do not have to glue `Reflector`, `DeltaFIFO`, and `Indexer` together yourself (more
on those below).

So when people talk about "the controller-runtime cache", they are not talking about a clever
optimization. They are describing the foundation of the entire model: you read from memory,
you write to the API server, and you receive feedback through a watch.

The rest of this article walks through how each piece is wired up.

## Glossary

A few terms collected up front, so you do not have to jump back and forth later. Skim or skip
if any of them are already familiar.

- **GVK (GroupVersionKind)** — the triple that uniquely identifies a resource type in
  Kubernetes: group, version, and kind, for example `apps/v1/Deployment`. Almost every API in
  `controller-runtime` works in terms of GVK rather than the name you would type in `kubectl`
  (such as `deployments`).

- **resourceVersion** — a [monotonic counter](/docs/reference/using-api/api-concepts/#resource-versions)
  that the API server tracks automatically, and that gets increased every time an object gets updated.
  Although it's a decimal number, the field is represented as a string.
  Resource versions serve two main purposes. The first one, you can use them for
  *optimistic concurrency control* (for example: on **update**, the API server checks
  that the `resourceVersion` you provide matches the one in `etcd`, otherwise it
  returns `409 Conflict`). The second place you are going to see resource versions
  in your controller is to resume a **watch**. Read
  [watch bookmarks](/docs/reference/using-api/api-concepts/#watch-bookmarks) to learn
  more.

- **Manager** — the `ctrl.Manager` object in `controller-runtime`. This is what your operator
  constructs in `main.go` and runs through `mgr.Start(ctx)`. It orchestrates everything: it
  owns the shared cache, builds the client, starts controllers, webhooks, the healthz
  endpoint, and other runnables. A single process usually has exactly one manager, with many
  controllers living inside it.

- **Informer** — an entity from `client-go` that maintains a watch on a single GVK, keeps an
  indexed local store, and dispatches events to subscribers. In `controller-runtime` an
  informer is created automatically when you register `Watches(...)` or perform the first
  `Get`/`List` on a given type.

- **Store** — the in-memory backing store of an informer, where the objects themselves live.
  Each informer in `controller-runtime` has its own store.

- **ResourceEventHandler** — an interface with three methods: `OnAdd`, `OnUpdate`, `OnDelete`.
  The informer calls them for every event delivered through DeltaFIFO. The store is updated
  in lockstep with the handler invocation, so a handler already sees the latest version of
  the object in the indexer. Subscribers (your controllers) register handlers like this and
  learn about changes through them.

- **workqueue** — a queue of object keys (`namespace/name`) with deduplication and rate
  limiting. On every event the controller enqueues a key; workers pop keys one at a time and
  hand them to `Reconcile` as a `ctrl.Request`.

- **Predicate** — a controller-side filter. A predicate decides whether an event should be
  enqueued at all (for example, "react only to changes in `spec`, ignore `status`").

With those in hand, you can dive in.

## Anatomy: what lives under the cache package

If you peek into `sigs.k8s.io/controller-runtime/pkg/cache`, you will see that it is a thin
wrapper over `k8s.io/client-go/tools/cache`. The same primitives that power the rest of
Kubernetes live underneath:

- **Reflector** — keeps a **watch** open against the API server and writes incoming changes
  into a queue as _deltas_. A delta is a record of the form "object X received an `Added` /
  `Updated` / `Deleted` event, and here is its new version". Effectively a single line in a
  change log.

- **DeltaFIFO** — the queue that holds those deltas. Per `namespace/name` key it accumulates
  the list of things that happened to that object, in order.

- **Indexer (Store)** — the in-memory object store, plus the indexes built over it.

- **SharedIndexInformer** — the conductor that ties everything together and dispatches events
  to subscribers — your controllers and any other observers.

At a glance the pipeline looks like this:

{{< figure src="pipeline.svg" caption="Pipeline diagram: API server to Reflector to DeltaFIFO to Indexer to Event handlers" alt="A vertical flow chart with seven labeled boxes connected by arrows, from API server at the top to Reconcile at the bottom." >}}

Now walk through each link.

### Reflector and resourceVersion

The Reflector is the only component that talks to the API server directly. It has exactly two
jobs: do a single **list** at startup, then keep a **watch** open from there on.

This is where the `resourceVersion` earns its keep. Along with the list of objects, the API
server returns the version at which the snapshot was produced. The Reflector then says to the
API server, "open a **watch** from version X", and receives a stream of events for everything
that happened after that version. That is the basis of consistency: there is no risk of
missing an event between **list** and **watch**, because **watch** resumes exactly at the point
where **list** ended.

If the connection drops, the Reflector reconnects with the last known `resourceVersion`. If
the API server replies with `410 Gone` ("that version is no longer in the history, you are
too far behind"), the Reflector performs a fresh **list** and starts over. This is called a
_relist_, and it does not happen on a schedule — only in those failure scenarios.

### DeltaFIFO: a queue of deltas

This piece is worth pausing on. `DeltaFIFO` is the buffer between the Reflector and the rest of
the informer. Its input is a stream of events from the API server; its output is the same
events, but _grouped by key_ and in strict order.

More precisely, DeltaFIFO solves three problems:

1. **It preserves order.** Whatever stream of changes flows in for `default/my-deploy`, the
   consumer sees the same ordering the API server delivered.
2. **It groups by key.** All deltas for a single `namespace/name` accumulate in one slot.
   `Pop()` returns not a single delta but a **slice** of every delta accumulated under that
   key — the consumer sees, in one shot, everything that has happened to the object since the
   last call.
3. **It deduplicates selectively.** The built-in `dedupDeltas` function collapses
   **consecutive `Deleted` deltas** for the same key, so two delete events do not turn into
   two separate processing rounds.

An important caveat: **DeltaFIFO does not merge consecutive `Added` or consecutive `Updated`
deltas.** Collapsing every intermediate state into a single final one is, in general, not its
job.

A worked example. Suppose three events for object `default/my-deploy` arrive in quick
succession:

1. `Added` — the Deployment is created (say, with `spec.replicas=1`).
2. `Updated` — somebody bumps `spec.replicas` to `2`.
3. `Updated` — and immediately to `3`.

DeltaFIFO places all three deltas into the slot keyed by `default/my-deploy`. `Pop()` returns
them as a single slice, and `sharedIndexInformer.HandleDeltas` walks through them in order:
first `OnAdd`, then two `OnUpdate` calls (one for the intermediate `1→2` transition and one
for the final `2→3`). The event handler runs three times, no shortcuts.

There **is** per-object deduplication, but not in DeltaFIFO — it lives one layer up, in the
controller's workqueue. The mechanic is straightforward: for each delta from DeltaFIFO, the
controller's event handler extracts the `namespace/name` _key_ from the object and enqueues
it. Re-inserting the same key silently coalesces with the existing entry; the workqueue does
not care about the object itself.

A concrete picture: you create a Pod. Within a second or two a flurry of `Updated` deltas
arrives — the scheduler assigns a node, the kubelet sets `Pending`, then `ContainerCreating`,
`Running`, `Ready`. Five deltas in a row, and the event handler fires on every one of them —
but throughout this window the workqueue holds a single entry with the key `default/my-pod`.
By the time `Reconcile` pops it, the cache already holds the final state, and `Reconcile`
runs once.

So you get two layers with cleanly separated responsibilities:

- **DeltaFIFO** — an ordered queue of deltas, grouped by key, with deduplication only for
  consecutive `Deleted` events. Its job is to deliver change facts to consumers in the right
  order.
- **workqueue** — a queue of **keys** with proper deduplication and rate limiting. This is
  the layer that collapses "ten updates in a row → one reconcile".

If you keep that two-layer picture in your head, it becomes clear why a flood of events
against a single object barely affects controller throughput — the workqueue absorbs them.

### Indexer: the local copy of the cluster

The Indexer (also known as `ThreadSafeStore`) is the local copy of the cluster. Underneath
it is a plain `map[string]interface{}` keyed by `namespace/name`, plus a mutex, plus a
dictionary of registered indexes (covered in their own section below).

Yes — at heart it is a map in memory. No B-trees, no LSMs. That is precisely why a cache-hit
`r.Get` costs microseconds: it is a map lookup followed by a copy of a Go struct.

### SharedIndexInformer and subscriptions

A SharedIndexInformer fuses Reflector, DeltaFIFO, and Indexer together and exposes two
interfaces to the rest of the world:

- Read objects directly from the indexer.
- Register a `ResourceEventHandler` and receive notifications for every event coming out of
  DeltaFIFO — `OnAdd`, `OnUpdate`, `OnDelete`. The store is updated in lockstep with the
  handler call, so by the time your handler runs, the indexer already reflects the new state.

"Outside" here means your controllers. When a controller registers `Watches(...)`, under the
hood it asks the informer: "add a handler that, on every change, enqueues the key into my
workqueue". The controller's workers then pop keys one at a time and call your
`Reconcile(ctx, ctrl.Request{NamespacedName: ...})`.

The keyword in the name is **Shared**. The manager creates **one** informer per GVK, and
every controller, webhook, and event source within that manager subscribes to it:

{{< figure src="shared-informer.svg" caption="Shared informer diagram: a single list / watch per GVK, feeding multiple subscribers" alt="A single Pod informer at the top with three arrows fanning out to two controllers and a webhook, all inside a ctrl.Manager box." >}}

In other words: an informer is the thing that subscribed to Pods once, holds them locally,
and serves every interested party in the process. From the API server's perspective, that is
one **list** and one **watch** per GVK, regardless of how many reconcilers live inside your
process.

## What happens at startup and on the very first `r.Get`

Step by step, here is what happens between the moment the manager starts and the first
`r.Get` inside your reconciler:

1. The manager's `mgr.Start(ctx)` brings up every registered informer.
2. For each GVK, the Reflector performs a full **list** of every object that falls within your
   scope.
3. The **list** response is loaded into the informer's store, registered indexes are rebuilt,
   and the informer's `HasSynced()` flag flips to `true`.
4. After that, a **watch** is opened starting from the `resourceVersion` returned by **list**.
5. **Only then** does the controller start invoking `Reconcile` — specifically, once
   `cache.WaitForCacheSync` has returned `true` for every source it owns. Until that point,
   workers do not drain the workqueue, even if events have already started piling up.

So in `controller-runtime`, "the reconciler is running but the cache is still empty" is
**not a state you can ever observe** by construction. The warm-up always happens up front,
never lazily.

What happens during the first `r.Get`? Suppose your reconciler contains:

```go
var obj appsv1.Deployment
err := r.Get(ctx, req.NamespacedName, &obj)
```

Under the hood it boils down to roughly this:

```go
item, exists, err := indexer.GetByKey("default/my-deploy")
if !exists {
    return apierrors.NewNotFound(...)
}
// DeepCopy into obj
```

No HTTP, no TLS, no protobuf serialization, no `etcd`. A map lookup, a struct copy, return.
Microseconds.

To repeat, because it matters: even the very first `Get` in the controller's lifetime reads
from a fully warmed-up, fully indexed snapshot. There is no "first time slow, then fast".

**Note:** This applies specifically to `mgr.GetClient()`. If for some reason you need to
read objects **before** `mgr.Start()` (for example, during initialization), use
`mgr.GetAPIReader()`, which goes straight to the API server. More on this later.

## Client ≠ Cache: read from memory, write to the API server

Another point that often gets lost. `client.Client` in `controller-runtime` is a composite
object:

- **Reads** (`Get`, `List`) go through the cache.
- **Writes** (`Create`, `Update`, `Patch`, `Delete`, `DeleteAllOf`) go straight to the API
  server.

This is not a hack — it is a deliberate design choice:

- Reads are frequent; they should be cheap.
- Writes are rare; they should be exact.
- Writing through the cache would invite split-brain — the local copy thinks the change went
  through, while the API server has already rejected it.

It is worth dwelling on "should be exact". This is where `resourceVersion` shows up again.

When you read an object from the cache, you do not get its current state in `etcd` — you get
the state as the Reflector last observed it. That state carries a `resourceVersion`. You then
mutate the object and call `r.Update(ctx, &obj)`. The request goes to the API server right
now, and the API server checks:

- Does the `resourceVersion` in your PUT match the `resourceVersion` in `etcd`? Yes — write
  it.
- No, `etcd` already has a newer one? Reply with `409 Conflict` — somebody beat you to it.

This is _optimistic concurrency control_. No real locks are taken; everybody writes in
parallel; but only one of the racing `Update` calls wins — the one that arrives with the
current version. Everyone else gets a `409` and is expected to re-read and try again.

Why does this matter for the cache? If you naively send a PUT with "your" `resourceVersion`
from the cache and somebody has updated the object since you read it, you will get `409`.
That is **not a bug**. It is exactly the protection the system is supposed to give you.
Writing without the `resourceVersion` check (via `Patch` without an optimistic lock, or via
[Server-Side Apply](/docs/reference/using-api/server-side-apply/)) is also possible, but that
is a separate conversation.

The "write → visibility" cycle now looks like this:

{{< figure src="update-visibility.svg" caption="Write visibility diagram: client.Update to API server to watch event to cache" alt="A vertical diagram showing how a write travels from user code through the API server and back into the controller's cache via a watch event." >}}

Between "you executed `Update`" and "the cache reflects the new state" there is a
microscopic window, on the order of milliseconds. Inside that window, an `r.Get` for the
same object returns the previous version. The next section is essentially a list of mistakes
that grow out of that window.

## Common mistakes that everyone makes

### Mistake 1: expecting read-after-write

A familiar pattern:

```go
obj.Spec.Replicas = ptr.To(int32(5))
if err := r.Update(ctx, &obj); err != nil {
    return ctrl.Result{}, err
}

// re-read and confirm it is now 5
var fresh appsv1.Deployment
_ = r.Get(ctx, key, &fresh)
fmt.Println(*fresh.Spec.Replicas) // surprise: 3
```

This is not a `controller-runtime` bug. It is a property of an eventually consistent system:
the cache catches up asynchronously, through the watch.

The right pattern is to never rely on instant freshness. `Reconcile` must be idempotent and
must always look at the current state. If it does not match the desired state, the next
reconcile fixes it. You do not need to "wait 100ms" or "re-trigger". You need to write the
logic so that one or two extra invocations break nothing.

If you genuinely need guaranteed freshness — for example, in a validating webhook where you
cannot afford to act on stale state — that is what `APIReader` is for. More on this
shortly.

### Mistake 2: `DeepCopy` and who owns the memory

To make sense of this, a quick word on event mechanics inside a controller. When you register
a source via `Watches(...)`, two layers sit between the indexer and your `Reconcile`:

- **Predicate** — the filter. It looks at an event (`CreateEvent`, `UpdateEvent`,
  `DeleteEvent`, `GenericEvent`) and decides whether to pass it through.
- **EventHandler** — the transformer. It receives the object and turns it into one or more
  `ctrl.Request` values that go into the workqueue. The classic
  `EnqueueRequestForObject` enqueues the `namespace/name` of the current object.

Here is the critical part. Predicates and handlers receive **the same objects that live in
the informer's shared store**. The same `*corev1.Pod` is seen by every controller subscribed
to Pods.

Because Go has no immutable structs, nothing prevents you from doing
`pod.Labels["foo"] = "bar"` directly inside a handler. Historically, `Get` and `List`
returned a pointer into the store as well, with predictable consequences: somebody patched a
status "for convenience" in one controller and broke the world view of an unrelated
controller next door.

Today, `controller-runtime` performs a `DeepCopy` on `Get` and `List` by default. The simple
rule:

- Anything you receive from `r.Get` / `r.List` is yours; mutate freely.
- Anything you receive in a `Predicate` or an `EventHandler` is shared, not yours. If you
  must mutate it, call `obj.DeepCopy()` first; otherwise you are silently corrupting the
  cache for every other controller subscribed to the same type.

A concrete review heuristic: if `predicate.Funcs{UpdateFunc: ...}` or
`handler.EnqueueRequestsFromMapFunc(...)` contains expressions like
`e.ObjectNew.SetLabels(...)` or `obj.Status.X = Y`, stop and ask whether a `DeepCopy` is
missing before that mutation.

### Mistake 3: resync is not relist

An informer has a `resyncPeriod` parameter (10 hours by default in `controller-runtime`), and
many people read it as "rebuild the cache from the API server every N hours".

It does not. A resync does **not** perform a **list**. It _re-emits_ everything currently in the
indexer back through DeltaFIFO as `Sync` deltas, and the informer processes them as usual,
calling `OnUpdate(old, old)` for each object. This gives a controller that has somehow
missed its reconcile window (a stuck worker, a dropped handler) a chance to see the world
again. It generates no traffic to the API server.

A real `relist` happens only in two cases: when the **watch** died with `410 Gone`, and when
you explicitly recreate the informer.

### Mistake 4: do not confuse `RequeueAfter` with a timer

A small note that often saves time. Sometimes you want to wait inside a reconciler — "we
just called the provider's API; if it is not ready yet, retry in a minute". The temptation is
to spin up `time.Sleep` or your own goroutine.

Resist it. `controller-runtime` already provides a built-in mechanism:

```go
return ctrl.Result{RequeueAfter: 30 * time.Second}, nil
```

The controller puts your `req` back into the workqueue with a delayed trigger 30 seconds out.
If a real event for the same object arrives within that window, the reconcile fires
immediately, without waiting for the timer (the key is deduplicated in the queue). This is
both cheaper and more correct than a hand-rolled timer: you do not hold a worker, and you do
not risk missing a real event.

There is also `ctrl.Result{Requeue: true}` — enqueue immediately, subject to the rate
limiter.

## cache + index = almost SQL

Now you get to what is, arguably, the most useful capability of the cache — and the one most
operators leave unused.

By default, a `List` from the cache looks like this:

```go
var pods corev1.PodList
_ = r.List(ctx, &pods)
for _, p := range pods.Items {
    if p.Spec.NodeName == "node-1" {
        // do something
    }
}
```

It works — until the cluster has 50,000 Pods and reconciles run hundreds of times per
second, at which point the controller is shuffling the same half-gigabyte of pointers back
and forth on every trigger. `O(n)` per reconcile.

The Indexer in `client-go` can do much better. You declare up front which field you want to
index on:

```go
// Index by spec.nodeName for Pods
if err := mgr.GetFieldIndexer().IndexField(
    ctx,
    &corev1.Pod{},
    "spec.nodeName",
    func(obj client.Object) []string {
        pod := obj.(*corev1.Pod)
        if pod.Spec.NodeName == "" {
            return nil
        }
        return []string{pod.Spec.NodeName}
    },
); err != nil {
    return err
}
```

Two things about that call are worth making explicit, because the tidy example hides
them behind a convention.

**The index name is arbitrary.** That second argument, `"spec.nodeName"`, is only a
string key the index is registered under. `controller-runtime` does not parse it as
JSONPath and does not check it against the object's schema — you could write `"by-node"`
or `"xyzzy"` and it would behave identically. The only rule is that the *exact same
string* comes back in `MatchingFields` at query time. Naming the index after the field it
happens to read is a readability convention, nothing more.

**The indexed value is computed, not read.** The function returns whatever strings you
build; they need not be the verbatim contents of any single field. You can lowercase a
value, join several fields into one composite key, bucket a timestamp (the _time-bucket_
trick below does exactly this), or emit a string that appears nowhere in the object
literally. Whatever the function returns becomes a key in the inverted dictionary, and a
`MatchingFields` lookup for that exact key is what finds the objects again. The only
constraint is that the value has to be *derivable from the object you are indexing*.

What is an _inverted index_? The term comes from search engines. Normally you have
documents and each document has a list of words in it. "Inverted" means the relationship is
flipped: a dictionary in which the key is a word and the value is the list of documents that
contain it. Same idea here: the key is the value of a field (for example, `node-1`), and the
value is the list of object keys whose field has that value:

```
map["node-1"] = {"default/pod-a", "kube-system/pod-b", ...}
map["node-2"] = {"default/pod-c", ...}
```

What the indexer does:

- On every incoming event (`ADDED`, `MODIFIED`, `DELETED`), the indexer runs the object
  through your indexing function, gets back the set of index keys, and updates the inverted
  dictionary. If a Pod migrates from `node-1` to `node-2`, the `node-1` key loses its
  reference to it and the `node-2` key gains one.
- By the time you call `List`, the index is **already current**. You do not pay for a
  rebuild at query time — no scan over all objects, no dictionary reconstruction. All the
  work was done up front, at the moment the object changed.

And now you can write:

```go
var pods corev1.PodList
_ = r.List(ctx, &pods,
    client.MatchingFields{"spec.nodeName": "node-1"},
)
```

This is not "fetch the full list, then filter". It is a lookup in the inverted index → a
ready set of keys → a fetch of the corresponding objects. A different code path entirely.

The comparison to SQL is more accurate than it might look at first:

| SQL | controller-runtime |
|---|---|
| `CREATE INDEX idx_node ON pods(node_name)` | `IndexField(&Pod{}, "spec.nodeName", fn)` |
| `SELECT * FROM pods WHERE node_name = 'node-1'` | `List(&pods, MatchingFields{"spec.nodeName": "node-1"})` |
| `SELECT * FROM obj WHERE owner_uid = $1` | `List(&list, MatchingFields{"metadata.ownerReferences.uid": uid})` (requires an `IndexField` for that field) |

Note the last row: `MatchingFields` does **not** make magic out of thin air. For every field
you want to look up via `MatchingFields` you need a corresponding `IndexField` registered
during manager setup. Without one, `controller-runtime` rejects the query and returns
an error.

A few things worth keeping in mind:

- **Equality only.** No range queries, no `LIKE`, no sorts, no aggregates. If you need
  "everything older than five minutes", either do a regular `List` and filter in code, or
  use a _time-bucket_ trick: instead of indexing the precise `time.Time`, index a rounded
  value (for example, `now.Truncate(5*time.Minute).Format(...)`). You can then select objects
  by a specific window.
- **`MatchingLabels` is not an index.** Many people assume that since label-based lookups are
  so common, there must be an optimization for them. There is not — `ThreadSafeStore` keeps
  no separate label dictionary.

  When you call `List(..., MatchingLabels{...})`, the controller honestly walks **every**
  cached object of the given type and checks each one against the selector. That is `O(n)`,
  exactly what `IndexField` is supposed to save you from.

  The API server itself supports filtering the event stream by a specific label selector. To
  make that effective in your controller, you have to optimize at the **cache population**
  stage, via `cache.ByObject{Label: ...}`, not at the **read** stage. This is covered in the
  next section on selective caches.

  And if you need a fast lookup by a specific label across already cached objects, register
  an `IndexField` for that label by hand. That works.
- **An index costs memory.** Every index is an extra dictionary keyed by every object. Do
  not index everything in sight speculatively.
- **You can only index data that is in the object itself.** You cannot index a Pod by "has a
  related PVC with such-and-such flag". Either store that bit in the Pod itself, or index
  the PVC, not the Pod.

**Note:** An index is built at registration time and is populated as part of the initial
**list**. By the time the first `Reconcile` runs, both `Get` and `List` with `MatchingFields`
work correctly — the index is not built lazily.

## Selective cache: do not pull the whole cluster into your operator

By default, an informer pulls every object of its type from every namespace. For Pod,
Secret, ConfigMap, and Event in a large cluster, that is a multi-gigabyte surprise
delivered on the first **list** at startup.

It hurts especially with:

- **Secrets**, because Helm stores release state in them (`helm.sh/release.v1.*`), and those
  secrets are often a hundred kilobytes each.
- **`v1.Node`** objects, whose `status.images` field carries a list of every image that has
  ever landed on the node — tens of kilobytes per node in busy clusters.
- **Events**, which can be very numerous and which you almost certainly do not need cached at
  all.

In `controller-runtime`, caching policy lives in `cache.Options`, passed when constructing
the manager:

```go
mgr, err := ctrl.NewManager(cfg, ctrl.Options{
    Cache: cache.Options{
        ByObject: map[client.Object]cache.ByObject{
            // Cache Secrets only from your own namespace, and only by label
            &corev1.Secret{}: {
                Namespaces: map[string]cache.Config{
                    "my-operator": {},
                },
                Label: labels.SelectorFromSet(labels.Set{
                    "app.kubernetes.io/managed-by": "my-operator",
                }),
            },
            // Cache all Pods, but trim noise on the way into the store
            &corev1.Pod{}: {
                Transform: func(obj any) (any, error) {
                    pod := obj.(*corev1.Pod)
                    pod.ManagedFields = nil
                    return pod, nil
                },
            },
        },
    },
})
```

A subtle point: this is a **manager-level** setting and it affects **every controller in the
process** that reads the corresponding type. If you narrow the cache for Secrets to a single
namespace and another controller in the same binary needs all secrets in the cluster, that
controller will not see them. Before you tighten the scope, audit who else is reading
the type.

A short tour of the options:

- **`Namespaces`** restricts the visible scope. If your operator only manages its own
  namespace, there is no reason to keep other people's objects in memory.
- **`Label` / `Field`** become parameters of the **watch** itself. The API server only sends
  matching objects, saving network and memory.
- **`Transform`** is invoked before the object lands in the store. It is the perfect place to
  drop `managedFields`, oversized `annotations`, or the binary `data` of ConfigMaps that
  you do not need.
- **`DefaultLabelSelector` / `DefaultNamespaces`** apply the same restriction globally, when
  every type needs the same scope.

**Caveat:** A selector limits what is **cached**, not what **exists**. If an object does
not match your selector, then as far as your operator is concerned, it does not exist in
either `Get` or `List`. This bites people: somebody mislabels a single Secret and then
spends half a day figuring out why their controller "cannot see it".

## Metadata-only: when `spec` and `data` are not needed

A separate pattern: you need to know that an object exists, but you do not need its `spec` or
`data`. Typical examples: a controller that waits for a Secret with a particular name to
appear but never reads it; one that counts PersistentVolume objects by the
`topology.kubernetes.io/zone` label; one that reacts to ConfigMap objects in a namespace
by name and does not care about contents.

**Caveat:** `PartialObjectMetadata` by definition gives you nothing from `spec` or
`status` — only `ObjectMeta`. So you **cannot** filter through it on `spec` fields (such as
a PersistentVolume's `storageClassName` or a Pod's `nodeName`); those fields do not
exist in the local copy. Everything covered by metadata-only is `labels`, `annotations`,
`ownerReferences`, `finalizers`, `creationTimestamp`, and the rest of `metadata`.

For this case there is `PartialObjectMetadata`:

```go
var list metav1.PartialObjectMetadataList
// Note: Kind is the singular ("Secret"), not "SecretList".
// controller-runtime infers the list shape from the variable type.
list.SetGroupVersionKind(schema.GroupVersionKind{
    Group:   "",
    Version: "v1",
    Kind:    "Secret",
})
if err := r.List(ctx, &list, client.InNamespace("my-ns")); err != nil {
    return err
}
```

Under the hood this is a separate watch that asks the API server for metadata only. The
store keeps such objects without `Data`, `Spec`, or `Status` — only `ObjectMeta`. For
Secrets the memory difference can reach an order of magnitude.

## APIReader: when the cache is not enough

`mgr.GetAPIReader()` returns a `client.Reader` that goes straight to the API server, around
the cache. When you actually need it:

- **Validating webhooks**, where the freshness of the object is critical. The cache in
  another process may be lagging at that very moment, and you would block a legitimate
  `Update`.
- A one-off read of a resource for which you do not maintain an informer. Spinning up a watch
  for a single operation is expensive.
- Reads **before `mgr.Start()`**, for instance during initialization. The regular
  `mgr.GetClient()` returns nothing useful at that point.
- **Paginated traversal of large result sets** through `client.Limit` / `client.Continue`.
  The cache-backed client ignores those parameters and always returns the full result set
  from the in-memory store; to actually page through the API server, you need `APIReader` (or
  a direct client of your own).

The price is a real network request. One thing to avoid: do not build "look in the cache, and
if missing, fall back to the API" logic. That is exactly the split-brain pattern the cache
is meant to protect you from.

### Disabling the cache for a type entirely

If you do not need a local cache for a given type at all — say, the type is "fat", read
rarely, and the **list** + **watch** overhead is not worth paying — you can tell the manager not to
cache it. This is configured through `client.Options.Cache.DisableFor`:

```go
mgr, err := ctrl.NewManager(cfg, ctrl.Options{
    Client: client.Options{
        Cache: &client.CacheOptions{
            DisableFor: []client.Object{
                &corev1.Secret{},
            },
        },
    },
})
```

With this configuration, `mgr.GetClient().Get(...)` and `List(...)` for Secret go straight
to the API server, bypassing the cache. No informer is started for that type, which means no
**list** at startup and no permanent memory pressure from a store. This is a more radical
alternative to `APIReader`: where `APIReader` is reached for ad hoc, individual requests,
`DisableFor` turns the cache off for the type wholesale.

Real-world projects use this. Several established CNCF operators disable caching on Secrets,
both to save memory and to avoid hammering the API server with a large **list** at startup.

**Aside:** If you want to avoid a watch on the API server entirely, you can feed the
controller events from a source of your own design, bypassing **list** + **watch**. In
`controller-runtime` this is done with `WatchesRawSource` / `source.Channel`: you can wire
the controller to events from any place — an internal queue, a kubelet, a custom watch.
Niche, but a perfectly valid pattern when the API server should not be touched.

## Good practices

A short checklist worth running through before you ship an operator into a live cluster:

- **Constrain cache scope** (`Namespaces`, `Label`, `Field` selectors), especially for "fat"
  types: Secret, ConfigMap, Event, Pod, Node.
- **Add a `Transform`** for objects whose heavy fields you do not need —
  `ManagedFields` alone consume a noticeable share of memory.
- **Add an `IndexField`** for every `List` that uses `MatchingFields`. No index means a
  hidden `O(n)` scan on every reconcile.
- **Do not mutate** objects you receive in an `EventHandler` or a `Predicate` without a prior
  `DeepCopy`. Mutations to the store break neighboring controllers silently and persistently.
- **Make `Reconcile` idempotent.** It must behave correctly even if it is invoked five times
  in a row with no real change.
- **Do not expect read-after-write** from the cache immediately after `Update`. The cache
  lags during that window.
- **When you need freshness** (webhooks, initialization, one-off reads), use `APIReader`,
  not the regular client.
- **Use `PartialObjectMetadata`** for types where you only need metadata. It can save
  gigabytes.
- **Do not call `mgr.GetClient()` before `mgr.Start()`.** The informer is not yet warm, the
  store is empty, and you will get either `NotFound` or an empty `List` and then spend half
  a day investigating why an object "disappeared".
- **For deferred actions, use `RequeueAfter`,** not `time.Sleep` and not your own goroutines.

## Wrapping up

In one breath:

- The cache in `controller-runtime` is not an optimization, it is the operating model. Under
  the hood it is `Reflector` + `DeltaFIFO` + `Indexer` — exactly the same primitives that
  power Kubernetes itself.
- `r.Get` and `r.List` go to memory; `Create`, `Update`, `Patch`, and `Delete` go straight
  to the API server. Feedback flows in through the watch.
- `IndexField` plus `MatchingFields` turn the cache into a near-complete query engine with
  inverted indexes.
- `Namespaces`, selectors, `PartialObjectMetadata`, and `Transform` are the levers that
  control how much memory and traffic you actually consume.
- `APIReader` is the emergency exit for cases where you genuinely need the freshest version
  of an object.

And the single sentence to remember: `r.Get` inside a reconciler does not call the API
server. Ever. Not even the first time. Once that becomes a reflex, half the questions on
controller code reviews answer themselves.
