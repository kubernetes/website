---
layout: blog
title: "controller-runtime 缓存的实际工作原理，以及为什么你的控制器不会使 API Server 崩溃"
draft: true
slug: controller-runtime-cache-explained
author: >
  Andrei Kvapil (Ænix),
  Timofei Larkin (Ænix)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "How the controller-runtime Cache Actually Works, and Why Your Controller Does Not Crash the API Server"
draft: true
slug: controller-runtime-cache-explained
author: >
  Andrei Kvapil (Ænix),
  Timofei Larkin (Ænix)
-->

<!--
Kubernetes has long been the default platform for distributed workloads, and writing your own
operator for it is now a matter of a few hours. The standard path — `kubebuilder` on top of
`controller-runtime` — gives you a project scaffold, types, and a reconciler. For typical
scenarios that is more than enough. But as soon as load grows or the operator starts behaving
in ways you did not expect, a whole class of edge cases shows up. Most of them trace back to
the same root cause: a fuzzy mental model of how `controller-runtime` works inside. If you
write Kubernetes controllers in Go, this article should help you build a coherent picture and
avoid expensive surprises in production.
-->
Kubernetes 长期以来一直是分布式工作负载的默认平台，现在编写自己的 Operator
只需几个小时。标准路径 — 在 `controller-runtime` 之上使用 `kubebuilder` —
为你提供项目脚手架、类型和协调器（reconciler）。对于典型场景来说，这已经绰绰有余。
但一旦负载增加或 Operator 开始以你意想不到的方式运行，一类边缘情况就会出现。
它们中的大多数都可以追溯到同一个根本原因：对 `controller-runtime` 内部工作原理的模糊理解。
如果你用 Go 编写 Kubernetes 控制器，本文应该能帮助你建立一个清晰的图景，
并避免在生产环境中遇到代价高昂的意外。

<!--
This article walks through the internals of `controller-runtime` and, along the way, shows which
architectural decisions are baked into Kubernetes itself. The starting point is how
controllers actually read objects from the Kubernetes API.
-->
本文将深入探讨 `controller-runtime` 的内部机制，并在此过程中展示哪些架构决策被内置到
Kubernetes 本身中。起点是控制器如何从 Kubernetes API 实际读取对象。

<!--
A common misconception goes like this: `r.Get()` inside `Reconcile` queries `kube-apiserver`
directly; `r.List()` returns a fresh, live view of the world; and after `r.Update()` you can
re-read the object and immediately see the new state. In practice the model is the opposite:
`controller-runtime` operates against a local copy of the data populated through **list** + **watch**.
Reads inside a reconciler cost almost nothing and do not load the control plane even at
hundreds of calls per second — but the price of this design is that an operator can quietly
consume gigabytes of memory, perform hidden `O(n)` scans, and regularly trip over stale reads.
-->
一个常见的误解是：`Reconcile` 中的 `r.Get()` 直接查询 `kube-apiserver`；
`r.List()` 返回最新实时视图；并且在 `r.Update()` 之后你可以重新读取对象并立即看到新状态。
实际上，模型恰恰相反：`controller-runtime` 操作的是通过 **list** + **watch**
填充的数据的本地副本。协调器中的读取几乎不消耗任何成本，即使每秒调用数百次也不会加载控制平面 ——
但这种设计的代价是，Operator 可能会悄悄消耗数 GB 的内存，执行隐藏的 `O(n)` 扫描，
并经常遇到陈旧读取问题。

<!--
This post is aimed at engineers who already write operators in Go with `controller-runtime`
but want to consolidate the pieces into a single mental model rather than carry around a bag
of isolated observations. The focus is the practical impact on production clusters: memory,
network traffic, read consistency, and reconciler behavior.
-->
本文面向那些已经使用 `controller-runtime` 用 Go 语言编写 Operator 的工程师，
旨在帮助他们将零散的认知整合为一个统一的思维模型，而不再仅仅是掌握一堆孤立的知识点。
重点在于对生产集群的实际影响：内存、网络流量、读取一致性以及协调器（reconciler）的行为。

<!--
## 摘要

If you take only one idea from this article, take this:
-->
## TL;DR

如果你只从本文中记住一个概念，请记住：

`Reconcile` 中的 `r.Get()` 和 `r.List()` 通常不会从 API server 读取。它们
从本地内存缓存中读取，管理器通过 **list** 预热缓存，然后通过 **watch** 保持缓存最新。

<!--
Almost every other property of the system follows from that one fact:

- Reads are cheap, but not strongly consistent immediately after a write.
- Writes go straight to the API server, not through the cache.
- The size of the local cache and the set of indexes directly drive memory consumption.
- An incorrectly written `List()` can silently turn into a linear scan over tens of thousands
  of objects.
- `APIReader` is rarely needed — but in some places you really cannot do without it.
-->
几乎系统的所有其他属性都源于这一事实：

- 读取成本低，但写入后不会立即强一致。
- 写入直接发送到 API server，不通过缓存。
- 本地缓存的大小和索引集直接决定内存消耗。
- 一个编写不当的 `List()` 可能会悄无声息地变成对数万个对象的线性扫描。
- `APIReader` 很少需要 —— 但在某些地方确实离不开它。

<!--
The rest of the article unpacks why this is so and how the model is wired underneath.
-->
本文的其余部分将解释为什么会这样，以及该模型在底层是如何构建的。

<!--
## A bit of context: what a reconciliation loop is

To avoid arguments about terminology, start with the basic model.
-->
## 一点背景：什么是协调循环

为了避免术语争论，从基本模型开始。

<!--
A controller in Kubernetes lives inside a reconciliation loop: it continuously compares the
desired state of an object with the actual state and tries to bring one in line with the
other. The idea is described in the original
[architectural notes](https://github.com/kubernetes/design-proposals-archive/blob/main/architecture/principles.md)
on Kubernetes. In practice it looks like this:
-->
Kubernetes 中的控制器生活在一个协调循环中：它不断比较对象的期望状态与实际状态，
并试图使两者一致。这个想法在 Kubernetes
的原始[架构笔记](https://github.com/kubernetes/design-proposals-archive/blob/main/architecture/principles.md)中有描述。
实际上它看起来像这样：

<!--
- A user or another controller mutates an object.
- An event lands in a queue.
- `Reconcile` reads the current state.
- The controller decides what to create, update, or delete.
- The system produces a new event and the loop repeats.
-->
- 用户或另一个控制器修改一个对象。
- 事件进入队列。
- `Reconcile` 读取当前状态。
- 控制器决定创建、更新或删除什么。
- 系统产生一个新事件，循环重复。

<!--
What matters here is not that the controller "does something" — it is **where it learns about
changes from** and **where it reads state from**. That is exactly where the cache comes in.
-->
这里重要的不是控制器"做了什么"——而是它**从哪里了解变化**以及**从哪里读取状态**。
这正是缓存发挥作用的地方。

<!--
On a live cluster, the easiest way to see this in action is:
-->
在真实集群上，最简单的观察方式是：

```bash
kubectl get pods --watch
```

<!--
In watch mode, `kubectl` subscribes to the same event stream that controllers consume.
You create or delete a Pod and you see not a single "final" object but a chain of states: the
scheduler assigns a node, the kubelet updates status, other controllers contribute their
changes. Kubernetes controllers do not poll continuously — they consume an event stream and
maintain a local state that is kept current.
-->
在 watch 模式下，`kubectl` 订阅控制器消费的相同事件流。你创建或删除一个 Pod，
看到的不是单个"最终"对象，而是一系列状态：调度器分配节点，kubelet 更新状态，
其他控制器做出他们的更改。
Kubernetes 控制器不会持续轮询 —— 它们消费事件流并维护一个保持最新的本地状态。

<!--
For a visual walkthrough, see [Reconciliation loop pattern in visual representation](https://www.youtube.com/watch?v=P50otWVh7w4),
a talk that shows how the reconciliation loop plays out on a real Pod and the states it
passes through.
-->
有关可视化演示，请参阅
[Reconciliation loop pattern in visual representation](https://www.youtube.com/watch?v=P50otWVh7w4)，
这个演讲展示了协调循环如何在真实 Pod 上运行以及它经过的状态。

<!--
## Why the cache exists in `controller-runtime` at all

Imagine the simplest possible controller:
-->
## 为什么 `controller-runtime` 中存在缓存

想象一个最简单的控制器：

```go
func (r *Reconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    var pod corev1.Pod
    if err := r.Get(ctx, req.NamespacedName, &pod); err != nil {
        return ctrl.Result{}, err
    }
    // ... meaningful logic ...
}
```

<!--
Looks straightforward. But what happens when you call `r.Get`? Does it fire an HTTP request at
the API server? If it did, picture the scene: a dozen operators, each running a few
controllers, each issuing a **get** and a **list** per reconcile, with hundreds of reconciles per
second. The API server and `etcd` would be writing each other farewell letters within minutes.
-->
看起来很简单。但当你调用 `r.Get` 时会发生什么？它会向 API server 发起 HTTP 请求吗？
如果是这样，想象一下场景：十几个 Operator，每个运行几个控制器，每个协调发出一个 **get**
和一个 **list**，每秒有数百次协调。API 服务器和 `etcd` 恐怕不出几分钟就要互致“诀别信”了。

<!--
To prevent that, Kubernetes was built around a _watch model_ rather than polling from the
very beginning. The standard mechanism works like this: a client issues **list** once, gets a
snapshot of the slice of the world it cares about, then subscribes to a stream of changes via
**watch** and keeps a local copy current. Everything happens over a single long-lived HTTP
connection, with no "what is in the world right now?" loop.
-->
为了避免这种情况，Kubernetes 从一开始就围绕“监听（watch）模型”而非轮询机制构建。
其标准运作流程如下：客户端首先发起一次 **list**（列举）请求，
获取其关注的那部分系统状态的快照；随后通过 **watch**（监听）机制订阅变更数据流，
并实时更新本地副本。整个过程仅需一条长效 HTTP 连接，无需反复执行“查询当前系统状态”的循环操作。

<!--
This idea has lived in `client-go` since the very first controllers in
`kube-controller-manager`. `controller-runtime` wraps it in a friendly framework so
that you do not have to glue `Reflector`, `DeltaFIFO`, and `Indexer` together yourself (more
on those below).
-->
这个想法从 `kube-controller-manager` 中的第一个控制器开始就存在于 `client-go` 中。
`controller-runtime` 将其包装在一个友好的框架中，这样你不必自己将
`Reflector`、`DeltaFIFO` 和 `Indexer` 粘合在一起（下面会详细介绍）。

<!--
So when people talk about "the controller-runtime cache", they are not talking about a clever
optimization. They are describing the foundation of the entire model: you read from memory,
you write to the API server, and you receive feedback through a watch.
-->
所以当人们谈论 "controller-runtime 缓存"时，他们不是在谈论一个聪明的优化。
他们是在描述整个模型的基础：从内存读取，写入 API server，并通过 watch 接收反馈。

<!--
The rest of this article walks through how each piece is wired up.
-->
本文的其余部分将介绍每个组件是如何连接的。

<!--
## Glossary

A few terms collected up front, so you do not have to jump back and forth later. Skim or skip
if any of them are already familiar.
-->
## 术语表

预先收集了一些术语，以便你以后不必来回跳转。如果其中任何一个已经熟悉，可以略读或跳过。

<!--
- **GVK (GroupVersionKind)** — the triple that uniquely identifies a resource type in
  Kubernetes: group, version, and kind, for example `apps/v1/Deployment`. Almost every API in
  `controller-runtime` works in terms of GVK rather than the name you would type in `kubectl`
  (such as `deployments`).
-->
- **GVK (GroupVersionKind)** — 唯一标识 Kubernetes 中资源类型的三元组：Group、Version 和 Kind，
  例如 `apps/v1/Deployment`。`controller-runtime` 中的几乎每个 API 都以 GVK 为单位工作，
  而不是你在 `kubectl` 中输入的名称（例如 `deployments`）。

<!--
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
-->
- **resourceVersion** — API server 自动跟踪的[单调计数器](/docs/reference/using-api/api-concepts/#resource-versions)，
  每次对象更新时都会增加。虽然它是一个十进制数字，但该字段表示为字符串。
  资源版本有两个主要用途。第一个，你可以将它们用于**乐观并发控制**（例如：在 **update** 时，
  API server 检查你提供的 `resourceVersion` 是否与 `etcd` 中的匹配，否则返回 `409 Conflict`）。
  在控制器中看到资源版本的第二个地方是恢复 **watch**。阅读
  [watch bookmarks](/zh-cn/docs/reference/using-api/api-concepts/#watch-bookmarks) 了解更多信息。

<!--
- **Manager** — the `ctrl.Manager` object in `controller-runtime`. This is what your operator
  constructs in `main.go` and runs through `mgr.Start(ctx)`. It orchestrates everything: it
  owns the shared cache, builds the client, starts controllers, webhooks, the healthz
  endpoint, and other runnables. A single process usually has exactly one manager, with many
  controllers living inside it.
-->
- **Manager** — `controller-runtime` 中的 `ctrl.Manager` 对象。这是你的 Operator 在 `main.go`
  中构建并通过 `mgr.Start(ctx)` 运行的对象。它协调一切：拥有共享缓存，构建客户端，
  启动控制器、Webhook、healthz 端点和其他可运行项。单个进程通常恰好有一个 Manager，其中包含许多控制器。

<!--
- **Informer** — an entity from `client-go` that maintains a watch on a single GVK, keeps an
  indexed local store, and dispatches events to subscribers. In `controller-runtime` an
  informer is created automatically when you register `Watches(...)` or perform the first
  `Get`/`List` on a given type.
-->
- **Informer** — 来自 `client-go` 的实体，维护对单个 GVK 的 watch，保持索引本地存储，
  并向订阅者分发事件。在 `controller-runtime` 中，当你注册 `Watches(...)`
  或对给定类型执行第一次 `Get`/`List` 时，会自动创建一个 informer。

<!--
- **Store** — the in-memory backing store of an informer, where the objects themselves live.
  Each informer in `controller-runtime` has its own store.
-->
- **Store** — informer 的内存后备存储，对象本身存储在那里。`controller-runtime` 中的每个 informer
  都有自己的 store。

<!--
- **ResourceEventHandler** — an interface with three methods: `OnAdd`, `OnUpdate`, `OnDelete`.
  The informer calls them for every event delivered through DeltaFIFO. The store is updated
  in lockstep with the handler invocation, so a handler already sees the latest version of
  the object in the indexer. Subscribers (your controllers) register handlers like this and
  learn about changes through them.
-->
- **ResourceEventHandler** — 一个具有三个方法的接口：`OnAdd`、`OnUpdate`、`OnDelete`。
  informer 对通过 DeltaFIFO 传递的每个事件调用它们。store 与处理程序调用同步更新，
  因此处理程序已经在索引器中看到对象的最新版本。订阅者（你的控制器）注册这样的处理程序，
  并通过它们了解更改。

<!--
- **workqueue** — a queue of object keys (`namespace/name`) with deduplication and rate
  limiting. On every event the controller enqueues a key; workers pop keys one at a time and
  hand them to `Reconcile` as a `ctrl.Request`.
-->
- **workqueue** — 具有去重和速率限制的对象键（`namespace/name`）队列。在每个事件上，
  控制器将一个键入队；工作线程一次弹出一个键，并将它们作为 `ctrl.Request` 交给 `Reconcile`。

<!--
- **Predicate** — a controller-side filter. A predicate decides whether an event should be
  enqueued at all (for example, "react only to changes in `spec`, ignore `status`").
-->
- **Predicate** — 控制器端过滤器。predicate 决定事件是否应该入队（例如，"只对 `spec`
  的变化做出反应，忽略 `status`"）。

<!--
With those in hand, you can dive in.
-->
有了这些，你可以深入了解了。

<!--
## Anatomy: what lives under the cache package

If you peek into `sigs.k8s.io/controller-runtime/pkg/cache`, you will see that it is a thin
wrapper over `k8s.io/client-go/tools/cache`. The same primitives that power the rest of
Kubernetes live underneath:
-->
## 剖析：cache 包下有什么

如果你查看 `sigs.k8s.io/controller-runtime/pkg/cache`，你会发现它是 `k8s.io/client-go/tools/cache`
之上的一个薄薄的包装层。驱动 Kubernetes 其他部分的相同原语也在下面：

<!--
- **Reflector** — keeps a **watch** open against the API server and writes incoming changes
  into a queue as _deltas_. A delta is a record of the form "object X received an `Added` /
  `Updated` / `Deleted` event, and here is its new version". Effectively a single line in a
  change log.
-->
- **Reflector** — 保持对 API server 的 **watch** 打开，并将传入的更改作为 _deltas_
  写入队列。delta 是一种形式为"对象 X 收到 `Added` / `Updated` / `Deleted` 事件，这是它的新版本"的记录。
  实际上是变更日志中的一行。

<!--
- **DeltaFIFO** — the queue that holds those deltas. Per `namespace/name` key it accumulates
  the list of things that happened to that object, in order.
-->
- **DeltaFIFO** — 保存这些 deltas 的队列。每个 `namespace/name` 键按顺序累积发生在该对象上的事件列表。

<!--
- **Indexer (Store)** — the in-memory object store, plus the indexes built over it.
-->
- **Indexer (Store)** — 内存对象存储，加上在其上构建的索引。

<!--
- **SharedIndexInformer** — the conductor that ties everything together and dispatches events
  to subscribers — your controllers and any other observers.
-->
- **SharedIndexInformer** — 将所有内容连接在一起并向订阅者（你的控制器和任何其他观察者）分发事件的指挥者。

<!--
At a glance the pipeline looks like this:
-->
一眼看去，管道是这样的：

{{< figure src="pipeline.svg" caption="Pipeline diagram: API server to Reflector to DeltaFIFO to Indexer to Event handlers" alt="垂直流程图，包含七个标签框，通过箭头连接，从顶部的 API server 到底部的 Reconcile。" >}}

<!--
Now walk through each link.
-->
现在逐个环节介绍。

<!--
### Reflector and resourceVersion

The Reflector is the only component that talks to the API server directly. It has exactly two
jobs: do a single **list** at startup, then keep a **watch** open from there on.
-->
### Reflector 和 resourceVersion

Reflector 是唯一直接与 API server 通信的组件。它恰好有两个任务：启动时执行一次 **list**，
然后从那里开始保持 **watch** 打开。

<!--
This is where the `resourceVersion` earns its keep. Along with the list of objects, the API
server returns the version at which the snapshot was produced. The Reflector then says to the
API server, "open a **watch** from version X", and receives a stream of events for everything
that happened after that version. That is the basis of consistency: there is no risk of
missing an event between **list** and **watch**, because **watch** resumes exactly at the point
where **list** ended.
-->
这就是 `resourceVersion` 发挥作用的地方。API server 返回对象列表的同时，还返回生成快照的版本。
然后 Reflector 告诉 API server："从版本 X 开始打开 **watch**"，并接收该版本之后发生的所有事件流。
这就是一致性的基础：**list** 和 **watch** 之间没有丢失事件的风险，因为 **watch**
恰好从 **list** 结束的地方恢复。

<!--
If the connection drops, the Reflector reconnects with the last known `resourceVersion`. If
the API server replies with `410 Gone` ("that version is no longer in the history, you are
too far behind"), the Reflector performs a fresh **list** and starts over. This is called a
_relist_, and it does not happen on a schedule — only in those failure scenarios.
-->
如果连接断开，Reflector 使用最后已知的 `resourceVersion` 重新连接。如果 API server
回复 `410 Gone`（"该版本不在历史记录中，你落后太多了"），Reflector 执行一次新的 **list**
并重新开始。这称为 _relist_，它不会按计划发生 —— 只在那些失败场景中发生。

<!--
### DeltaFIFO: a queue of deltas

This piece is worth pausing on. `DeltaFIFO` is the buffer between the Reflector and the rest of
the informer. Its input is a stream of events from the API server; its output is the same
events, but _grouped by key_ and in strict order.
-->
### DeltaFIFO：delta 队列

这部分值得停下来仔细看。`DeltaFIFO` 是 Reflector 和 informer 其余部分之间的缓冲区。
它的输入是来自 API server 的事件流；它的输出是相同的事件，但按键分组并严格有序。

<!--
More precisely, DeltaFIFO solves three problems:

1. **It preserves order.** Whatever stream of changes flows in for `default/my-deploy`, the
   consumer sees the same ordering the API server delivered.
-->
更准确地说，DeltaFIFO 解决了三个问题：

1. **它保持顺序。** 无论 `default/my-deploy` 流入什么样的变更流，消费者看到的顺序都与 API server
   传递的顺序相同。

<!--
2. **It groups by key.** All deltas for a single `namespace/name` accumulate in one slot.
   `Pop()` returns not a single delta but a **slice** of every delta accumulated under that
   key — the consumer sees, in one shot, everything that has happened to the object since the
   last call.
-->
2. **它按键分组。** 单个 `namespace/name` 的所有 deltas 累积在一个槽位中。
   `Pop()` 返回的不是单个 delta，而是该键下累积的每个 delta 的**切片** —— 消费者一次就能看到
   自上次调用以来发生在该对象上的所有事情。

<!--
3. **It deduplicates selectively.** The built-in `dedupDeltas` function collapses
   **consecutive `Deleted` deltas** for the same key, so two delete events do not turn into
   two separate processing rounds.
-->
3. **它选择性去重。** 内置的 `dedupDeltas` 函数会合并同一键的**连续 `Deleted` deltas**，
   因此两个删除事件不会变成两个独立的处理轮次。

<!--
An important caveat: **DeltaFIFO does not merge consecutive `Added` or consecutive `Updated`
deltas.** Collapsing every intermediate state into a single final one is, in general, not its
job.
-->
一个重要的警告：**DeltaFIFO 不会合并连续的 `Added` 或连续的 `Updated` deltas。**
将每个中间状态折叠成单个最终状态通常不是它的职责。

<!--
A worked example. Suppose three events for object `default/my-deploy` arrive in quick
succession:

1. `Added` — the Deployment is created (say, with `spec.replicas=1`).
2. `Updated` — somebody bumps `spec.replicas` to `2`.
3. `Updated` — and immediately to `3`.

DeltaFIFO places all three deltas into the slot keyed by `default/my-deploy`. `Pop()` returns
them as a single slice, and `sharedIndexInformer.HandleDeltas` walks through them in order:
first `OnAdd`, then two `OnUpdate` calls (one for the intermediate `1→2` transition and one
for the final `2→3`). The event handler runs three times, no shortcuts.
-->
一个实际例子。假设对象 `default/my-deploy` 的三个事件快速连续到达：

1. `Added` — Deployment 被创建（假设 `spec.replicas=1`）。
2. `Updated` — 有人将 `spec.replicas` 增加到 `2`。
3. `Updated` — 立即增加到 `3`。

DeltaFIFO 将所有三个 delta 放入键为 `default/my-deploy` 的槽位中。`Pop()` 将它们作为单个切片返回，
`sharedIndexInformer.HandleDeltas` 按顺序遍历它们：首先是 `OnAdd`，然后是两次 `OnUpdate`
调用（一次用于中间的 `1→2` 转换，一次用于最终的 `2→3`）。事件处理程序运行三次，没有捷径。

<!--
There **is** per-object deduplication, but not in DeltaFIFO — it lives one layer up, in the
controller's workqueue. The mechanic is straightforward: for each delta from DeltaFIFO, the
controller's event handler extracts the `namespace/name` _key_ from the object and enqueues
it. Re-inserting the same key silently coalesces with the existing entry; the workqueue does
not care about the object itself.
-->
确实存在每个对象的去重，但不是在 DeltaFIFO 中 —— 它在控制器的 workqueue 的上一层。
机制很简单：对于来自 DeltaFIFO 的每个 delta，控制器的事件处理程序从对象中提取 `namespace/name`
**key** 并将其入队。重新插入相同的键会与现有条目静默合并；workqueue 不关心对象本身。

<!--
A concrete picture: you create a Pod. Within a second or two a flurry of `Updated` deltas
arrives — the scheduler assigns a node, the kubelet sets `Pending`, then `ContainerCreating`,
`Running`, `Ready`. Five deltas in a row, and the event handler fires on every one of them —
but throughout this window the workqueue holds a single entry with the key `default/my-pod`.
By the time `Reconcile` pops it, the cache already holds the final state, and `Reconcile`
runs once.
-->
一个具体场景：你创建一个 Pod。在一两秒内，一系列 `Updated` deltas 到达 ——
调度器分配节点，kubelet 设置 `Pending`，然后是 `ContainerCreating`、`Running`、`Ready`。
连续五个 deltas，事件处理程序在每个上触发 —— 但在此期间，workqueue 只保留一个键为
`default/my-pod` 的条目。当 `Reconcile` 弹出它时，缓存已经保存了最终状态，`Reconcile`
运行一次。

<!--
So you get two layers with cleanly separated responsibilities:

- **DeltaFIFO** — an ordered queue of deltas, grouped by key, with deduplication only for
  consecutive `Deleted` events. Its job is to deliver change facts to consumers in the right
  order.
- **workqueue** — a queue of **keys** with proper deduplication and rate limiting. This is
  the layer that collapses "ten updates in a row → one reconcile".
-->
所以你有两个职责清晰分离的层：

- **DeltaFIFO** — 按键分组的有序 delta 队列，仅对连续的 `Deleted` 事件去重。
  它的职责是以正确的顺序向消费者传递变更事实。
- **workqueue** — 具有适当去重和速率限制的**键**队列。这是将"连续十次更新 → 一次协调"
  折叠的层。

<!--
If you keep that two-layer picture in your head, it becomes clear why a flood of events
against a single object barely affects controller throughput — the workqueue absorbs them.
-->
如果你在脑海中保持这个两层图景，就会清楚为什么针对单个对象的大量事件几乎不会影响控制器吞吐量 ——
workqueue 吸收了它们。

<!--
### Indexer: the local copy of the cluster
-->
### Indexer：集群的本地副本

<!--
The Indexer (also known as `ThreadSafeStore`) is the local copy of the cluster. Underneath
it is a plain `map[string]interface{}` keyed by `namespace/name`, plus a mutex, plus a
dictionary of registered indexes (covered in their own section below).
-->
Indexer（也称为 `ThreadSafeStore`）是集群的本地副本。它底层是一个以 `namespace/name`
为键的普通 `map[string]interface{}`，加上一个互斥锁，加上一个已注册索引的字典（在下面单独的部分介绍）。

<!--
Yes — at heart it is a map in memory. No B-trees, no LSMs. That is precisely why a cache-hit
`r.Get` costs microseconds: it is a map lookup followed by a copy of a Go struct.
-->
是的 —— 本质上它是内存中的一个 map。没有 B 树，没有 LSM。这正是为什么缓存命中的 `r.Get`
成本只有微秒级：它只是一次 map 查找，然后复制一个 Go 结构体。

<!--
### SharedIndexInformer and subscriptions

A SharedIndexInformer fuses Reflector, DeltaFIFO, and Indexer together and exposes two
interfaces to the rest of the world:
-->
### SharedIndexInformer 和订阅

SharedIndexInformer 将 Reflector、DeltaFIFO 和 Indexer 融合在一起，并向世界公开两个接口：

<!--
- Read objects directly from the indexer.
- Register a `ResourceEventHandler` and receive notifications for every event coming out of
  DeltaFIFO — `OnAdd`, `OnUpdate`, `OnDelete`. The store is updated in lockstep with the
  handler call, so by the time your handler runs, the indexer already reflects the new state.
-->
- 直接从索引器读取对象。
- 注册 `ResourceEventHandler` 并接收来自 DeltaFIFO 的每个事件的通知 ——
  `OnAdd`、`OnUpdate`、`OnDelete`。store 与处理程序调用同步更新，
  因此当你的处理程序运行时，索引器已经反映了新状态。

<!--
"Outside" here means your controllers. When a controller registers `Watches(...)`, under the
hood it asks the informer: "add a handler that, on every change, enqueues the key into my
workqueue". The controller's workers then pop keys one at a time and call your
`Reconcile(ctx, ctrl.Request{NamespacedName: ...})`.
-->
"外部"在这里指的是你的控制器。当控制器注册 `Watches(...)` 时，它在底层向 informer 请求：
"添加一个处理程序，在每次变更时将键入队到我的 workqueue 中"。然后控制器的工作线程一次弹出一个键，
并调用你的 `Reconcile(ctx, ctrl.Request{NamespacedName: ...})`。

<!--
The keyword in the name is **Shared**. The manager creates **one** informer per GVK, and
every controller, webhook, and event source within that manager subscribes to it:
-->
名称中的关键字是 **Shared**。manager 为每个 GVK 创建**一个** informer，
该 manager 中的每个控制器、webhook 和事件源都订阅它：

{{< figure src="shared-informer.svg" caption="Shared informer diagram: a single list / watch per GVK, feeding multiple subscribers" alt="顶部是单个 Pod informer，有三个箭头向下指向两个控制器和一个 webhook，全部在 ctrl.Manager 框内。" >}}

<!--
In other words: an informer is the thing that subscribed to Pods once, holds them locally,
and serves every interested party in the process. From the API server's perspective, that is
one **list** and one **watch** per GVK, regardless of how many reconcilers live inside your
process.
-->
换句话说：informer 是那个订阅一次 Pods、在本地保存它们、并为进程中每个感兴趣的方服务的东西。
从 API server 的角度来看，每个 GVK 只有一个 **list** 和一个 **watch**，无论你的进程中有多少个协调器。

<!--
## What happens at startup and on the very first `r.Get`

Step by step, here is what happens between the moment the manager starts and the first
`r.Get` inside your reconciler:
-->
## 启动时和第一次 `r.Get` 时会发生什么

一步一步地，这里是 manager 启动时刻到你的协调器中第一次 `r.Get` 之间发生的事情：

<!--
1. The manager's `mgr.Start(ctx)` brings up every registered informer.
-->
1. manager 的 `mgr.Start(ctx)` 启动每个注册的 informer。

<!--
2. For each GVK, the Reflector performs a full **list** of every object that falls within your
   scope.
-->
2. 对于每个 GVK，Reflector 执行一次完整的 **list**，获取范围内的每个对象。

<!--
3. The **list** response is loaded into the informer's store, registered indexes are rebuilt,
   and the informer's `HasSynced()` flag flips to `true`.
-->
3. **list** 响应被加载到 informer 的 store 中，已注册的索引被重建，informer 的 `HasSynced()`
   标志翻转为 `true`。

<!--
4. After that, a **watch** is opened starting from the `resourceVersion` returned by **list**.
-->
4. 之后，从 **list** 返回的 `resourceVersion` 开始打开 **watch**。

<!--
5. **Only then** does the controller start invoking `Reconcile` — specifically, once
   `cache.WaitForCacheSync` has returned `true` for every source it owns. Until that point,
   workers do not drain the workqueue, even if events have already started piling up.
-->
5. **只有在那之后**控制器才开始调用 `Reconcile` —— 具体来说，一旦 `cache.WaitForCacheSync`
   对其拥有的每个源都返回 `true`。在此之前，即使事件已经开始堆积，工作线程也不会排空 workqueue。

<!--
So in `controller-runtime`, "the reconciler is running but the cache is still empty" is
**not a state you can ever observe** by construction. The warm-up always happens up front,
never lazily.
-->
所以在 `controller-runtime` 中，"协调器正在运行但缓存仍然为空"是**你永远无法观察到的状态**。
预热总是预先发生，从不延迟。

<!--
What happens during the first `r.Get`? Suppose your reconciler contains:
-->
第一次 `r.Get` 期间发生了什么？假设你的协调器包含：

```go
var obj appsv1.Deployment
err := r.Get(ctx, req.NamespacedName, &obj)
```

<!--
Under the hood it boils down to roughly this:
-->
在底层，它大致归结为：

```go
item, exists, err := indexer.GetByKey("default/my-deploy")
if !exists {
    return apierrors.NewNotFound(...)
}
// DeepCopy into obj
```

<!--
No HTTP, no TLS, no protobuf serialization, no `etcd`. A map lookup, a struct copy, return.
Microseconds.
-->
没有 HTTP，没有 TLS，没有 protobuf 序列化，没有 `etcd`。
一次 Map 查找，一次结构体复制，返回。微秒级。

<!--
To repeat, because it matters: even the very first `Get` in the controller's lifetime reads
from a fully warmed-up, fully indexed snapshot. There is no "first time slow, then fast".
-->
重复一遍，因为这很重要：即使是控制器生命周期中的第一次 `Get`，也是从完全预热、完全索引的快照中读取。
不存在"第一次慢，然后快"的情况。

<!--
**Note:** This applies specifically to `mgr.GetClient()`. If for some reason you need to
read objects **before** `mgr.Start()` (for example, during initialization), use
`mgr.GetAPIReader()`, which goes straight to the API server. More on this later.
-->
**注意：** 这特别适用于 `mgr.GetClient()`。如果由于某种原因你需要在 `mgr.Start()`
**之前**读取对象（例如，在初始化期间），请使用 `mgr.GetAPIReader()`，它直接访问 API server。
稍后会详细介绍。

<!--
## Client ≠ Cache: read from memory, write to the API server
-->
## Client ≠ Cache：从内存读取，写入 API server

<!--
Another point that often gets lost. `client.Client` in `controller-runtime` is a composite
object:

- **Reads** (`Get`, `List`) go through the cache.
- **Writes** (`Create`, `Update`, `Patch`, `Delete`, `DeleteAllOf`) go straight to the API
  server.
-->
另一个经常被忽略的点。`controller-runtime` 中的 `client.Client` 是一个复合对象：

- **读取**（`Get`、`List`）通过缓存。
- **写入**（`Create`、`Update`、`Patch`、`Delete`、`DeleteAllOf`）直接发送到 API server。

<!--
This is not a hack — it is a deliberate design choice:

- Reads are frequent; they should be cheap.
- Writes are rare; they should be exact.
- Writing through the cache would invite split-brain — the local copy thinks the change went
  through, while the API server has already rejected it.
-->
这不是一个 hack —— 这是一个深思熟虑的设计选择：

- 读取频繁；它们应该便宜。
- 写入很少；它们应该准确。
- 通过缓存写入会导致脑裂 —— 本地副本认为更改已通过，而 API server 已拒绝它。

<!--
It is worth dwelling on "should be exact". This is where `resourceVersion` shows up again.

When you read an object from the cache, you do not get its current state in `etcd` — you get
the state as the Reflector last observed it. That state carries a `resourceVersion`. You then
mutate the object and call `r.Update(ctx, &obj)`. The request goes to the API server right
now, and the API server checks:

- Does the `resourceVersion` in your PUT match the `resourceVersion` in `etcd`? Yes — write
  it.
- No, `etcd` already has a newer one? Reply with `409 Conflict` — somebody beat you to it.
-->
值得深入探讨"应该准确"。这就是 `resourceVersion` 再次出现的地方。

当你从缓存中读取对象时，你得到的不是它在 `etcd` 中的当前状态 —— 你得到的是 Reflector
最后观察到的状态。该状态带有 `resourceVersion`。然后你修改对象并调用 `r.Update(ctx, &obj)`。
请求立即发送到 API server，API server 检查：

- 你的 PUT 中的 `resourceVersion` 是否与 `etcd` 中的 `resourceVersion` 匹配？是 —— 写入它。
- 不，`etcd` 已经有一个更新的版本？回复 `409 Conflict` —— 有人抢先一步。

<!--
This is _optimistic concurrency control_. No real locks are taken; everybody writes in
parallel; but only one of the racing `Update` calls wins — the one that arrives with the
current version. Everyone else gets a `409` and is expected to re-read and try again.
-->
这是_乐观并发控制_。不获取真正的锁；每个人都并行写入；但只有一个竞争的 `Update`
调用获胜 —— 携带当前版本到达的那个。其他人都得到 `409`，并被期望重新读取并重试。

<!--
Why does this matter for the cache? If you naively send a PUT with "your" `resourceVersion`
from the cache and somebody has updated the object since you read it, you will get `409`.
That is **not a bug**. It is exactly the protection the system is supposed to give you.
Writing without the `resourceVersion` check (via `Patch` without an optimistic lock, or via
[Server-Side Apply](/docs/reference/using-api/server-side-apply/)) is also possible, but that
is a separate conversation.
-->
为什么这对缓存很重要？如果你天真地发送一个带有缓存中"你的" `resourceVersion` 的 PUT，
而有人在你读取后更新了该对象，你会得到 `409`。这**不是 bug**。这正是系统应该为你提供的保护。
不进行 `resourceVersion` 检查的写入（通过不带乐观锁的 `Patch`，或通过
[Server-Side Apply](/docs/reference/using-api/server-side-apply/)）也是可能的，但那是另一个话题。

<!--
The "write → visibility" cycle now looks like this:
-->
"写入 → 可见性"循环现在看起来像这样：

{{< figure src="update-visibility.svg" caption="Write visibility diagram: client.Update to API server to watch event to cache" alt="垂直图表，显示写入如何从用户代码通过 API server 并通过 watch 事件返回到控制器的缓存中。" >}}

<!--
Between "you executed `Update`" and "the cache reflects the new state" there is a
microscopic window, on the order of milliseconds. Inside that window, an `r.Get` for the
same object returns the previous version. The next section is essentially a list of mistakes
that grow out of that window.
-->
在"你执行了 `Update` "和"缓存反映新状态"之间有一个微小的窗口，大约毫秒级。
在该窗口内，对同一对象的 `r.Get` 返回以前的版本。下一节本质上是一个从该窗口中产生的错误列表。

<!--
## Common mistakes that everyone makes

### Mistake 1: expecting read-after-write

A familiar pattern:
-->
## 每个人都会犯的常见错误

### 错误 1：期望写后读一致性

一个熟悉的模式：

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

<!--
This is not a `controller-runtime` bug. It is a property of an eventually consistent system:
the cache catches up asynchronously, through the watch.
-->
这不是 `controller-runtime` 的 Bug。这是一个最终一致系统的特性：缓存通过 watch 异步追赶。

<!--
The right pattern is to never rely on instant freshness. `Reconcile` must be idempotent and
must always look at the current state. If it does not match the desired state, the next
reconcile fixes it. You do not need to "wait 100ms" or "re-trigger". You need to write the
logic so that one or two extra invocations break nothing.
-->
正确的模式是永远不要依赖即时新鲜度。`Reconcile` 必须是幂等的，并且必须始终查看当前状态。
如果它与期望状态不匹配，下一次协调会修复它。你不需要"等待 100ms" 或"重新触发"。
你需要编写逻辑，使一两次额外调用不会破坏任何东西。

<!--
If you genuinely need guaranteed freshness — for example, in a validating webhook where you
cannot afford to act on stale state — that is what `APIReader` is for. More on this
shortly.
-->
如果你确实需要保证新鲜度 —— 例如，在验证 webhook 中，你不能承受对陈旧状态采取行动 ——
那就是 `APIReader` 的用途。稍后会详细介绍。

<!--
### Mistake 2: `DeepCopy` and who owns the memory

To make sense of this, a quick word on event mechanics inside a controller. When you register
a source via `Watches(...)`, two layers sit between the indexer and your `Reconcile`:

- **Predicate** — the filter. It looks at an event (`CreateEvent`, `UpdateEvent`,
  `DeleteEvent`, `GenericEvent`) and decides whether to pass it through.
- **EventHandler** — the transformer. It receives the object and turns it into one or more
  `ctrl.Request` values that go into the workqueue. The classic
  `EnqueueRequestForObject` enqueues the `namespace/name` of the current object.
-->
### 错误 2：`DeepCopy` 和谁拥有内存

要理解这一点，快速说明一下控制器内部的事件机制。当你通过 `Watches(...)` 注册一个源时，
索引器和你的 `Reconcile` 之间有两层：

- **Predicate** — 过滤器。它查看事件（`CreateEvent`、`UpdateEvent`、`DeleteEvent`、`GenericEvent`）
  并决定是否通过它。
- **EventHandler** — 转换器。它接收对象并将其转换为一个或多个 `ctrl.Request` 值，
  这些值进入 workqueue。经典的 `EnqueueRequestForObject` 将当前对象的 `namespace/name` 入队。

<!--
Here is the critical part. Predicates and handlers receive **the same objects that live in
the informer's shared store**. The same `*corev1.Pod` is seen by every controller subscribed
to Pods.

Because Go has no immutable structs, nothing prevents you from doing
`pod.Labels["foo"] = "bar"` directly inside a handler. Historically, `Get` and `List`
returned a pointer into the store as well, with predictable consequences: somebody patched a
status "for convenience" in one controller and broke the world view of an unrelated
controller next door.
-->
这是关键部分。Predicates 和 handlers 接收**与 informer 的共享 store 中相同的对象**。
订阅 Pods 的每个控制器都会看到相同的 `*corev1.Pod`。

因为 Go 没有不可变结构体，没有什么能阻止你直接在 handler 中执行
`pod.Labels["foo"] = "bar"`。历史上，`Get` 和 `List` 也返回指向 store 的指针，
后果可想而知：有人在一个控制器中"为了方便"修改了状态，却破坏了隔壁无关控制器的视图。

<!--
Today, `controller-runtime` performs a `DeepCopy` on `Get` and `List` by default. The simple
rule:

- Anything you receive from `r.Get` / `r.List` is yours; mutate freely.
- Anything you receive in a `Predicate` or an `EventHandler` is shared, not yours. If you
  must mutate it, call `obj.DeepCopy()` first; otherwise you are silently corrupting the
  cache for every other controller subscribed to the same type.
-->
如今，`controller-runtime` 默认在 `Get` 和 `List` 上执行 `DeepCopy`。简单规则：

- 你从 `r.Get` / `r.List` 收到的任何东西都是你的；可以自由修改。
- 你在 `Predicate` 或 `EventHandler` 中收到的任何东西都是共享的，不是你的。
  如果你必须修改它，先调用 `obj.DeepCopy()`；否则你会静默地破坏订阅同一类型的其他所有控制器的缓存。

<!--
A concrete review heuristic: if `predicate.Funcs{UpdateFunc: ...}` or
`handler.EnqueueRequestsFromMapFunc(...)` contains expressions like
`e.ObjectNew.SetLabels(...)` or `obj.Status.X = Y`, stop and ask whether a `DeepCopy` is
missing before that mutation.
-->
一个具体的审查启发式方法：如果 `predicate.Funcs{UpdateFunc: ...}` 或
`handler.EnqueueRequestsFromMapFunc(...)` 包含 `e.ObjectNew.SetLabels(...)` 或
`obj.Status.X = Y` 这样的表达式，停下来问问在那个修改之前是否缺少 `DeepCopy`。

<!--
### Mistake 3: resync is not relist
-->
### 错误 3：resync 不是 relist

<!--
An informer has a `resyncPeriod` parameter (10 hours by default in `controller-runtime`), and
many people read it as "rebuild the cache from the API server every N hours".

It does not. A resync does **not** perform a **list**. It _re-emits_ everything currently in the
indexer back through DeltaFIFO as `Sync` deltas, and the informer processes them as usual,
calling `OnUpdate(old, old)` for each object. This gives a controller that has somehow
missed its reconcile window (a stuck worker, a dropped handler) a chance to see the world
again. It generates no traffic to the API server.
-->
Informer 有一个 `resyncPeriod` 参数（`controller-runtime` 中默认为 10 小时），
许多人将其理解为"每 N 小时从 API server 重建缓存"。

它不是。`resync` **不**执行 **list**。它将索引器中当前的所有内容作为 `Sync` deltas
重新发出回 DeltaFIFO，informer 像往常一样处理它们，为每个对象调用 `OnUpdate(old, old)`。
这给了一个不知何故错过了协调窗口的控制器（卡住的工作线程、丢弃的 handler）一个再次看到世界的机会。
它不会生成到 API server 的流量。

<!--
A real `relist` happens only in two cases: when the **watch** died with `410 Gone`, and when
you explicitly recreate the informer.
-->
真正的 `relist` 只在两种情况下发生：当 **watch** 因 `410 Gone`
而死亡时，以及当你显式重新创建 informer 时。

<!--
### Mistake 4: do not confuse `RequeueAfter` with a timer

A small note that often saves time. Sometimes you want to wait inside a reconciler — "we
just called the provider's API; if it is not ready yet, retry in a minute". The temptation is
to spin up `time.Sleep` or your own goroutine.

Resist it. `controller-runtime` already provides a built-in mechanism:
-->
### 错误 4：不要将 `RequeueAfter` 与计时器混淆

一个经常节省时间的小提示。有时你想在协调器内等待 —— "我们刚刚调用了提供商的 API；
如果还没准备好，一分钟后重试"。诱惑是启动 `time.Sleep` 或你自己的 goroutine。

抵制它。`controller-runtime` 已经提供了内置机制：

```go
return ctrl.Result{RequeueAfter: 30 * time.Second}, nil
```

<!--
The controller puts your `req` back into the workqueue with a delayed trigger 30 seconds out.
If a real event for the same object arrives within that window, the reconcile fires
immediately, without waiting for the timer (the key is deduplicated in the queue). This is
both cheaper and more correct than a hand-rolled timer: you do not hold a worker, and you do
not risk missing a real event.
-->
控制器将你的 `req` 放回 workqueue，设置 30 秒后的延迟触发。如果同一对象的真实事件在该窗口内到达，
协调会立即触发，无需等待计时器（键在队列中去重）。这比手动编写的计时器既便宜又正确：
你不会占用工作线程，也不会有错过真实事件的风险。

<!--
There is also `ctrl.Result{Requeue: true}` — enqueue immediately, subject to the rate
limiter.
-->
还有 `ctrl.Result{Requeue: true}` —— 立即入队，受速率限制器约束。

<!--
## cache + index = almost SQL

Now you get to what is, arguably, the most useful capability of the cache — and the one most
operators leave unused.

By default, a `List` from the cache looks like this:
-->
## cache + index = 几乎是 SQL

现在你了解了可以说是缓存最有用的功能 —— 也是大多数 operators 未使用的功能。

默认情况下，从缓存进行的 `List` 看起来像这样：

```go
var pods corev1.PodList
_ = r.List(ctx, &pods)
for _, p := range pods.Items {
    if p.Spec.NodeName == "node-1" {
        // do something
    }
}
```

<!--
It works — until the cluster has 50,000 Pods and reconciles run hundreds of times per
second, at which point the controller is shuffling the same half-gigabyte of pointers back
and forth on every trigger. `O(n)` per reconcile.
-->
它可以工作 —— 直到集群有 50,000 个 Pod，协调每秒运行数百次，此时控制器在每次触发时来回移动
相同的半 GB 指针。每次协调 `O(n)`。

<!--
The Indexer in `client-go` can do much better. You declare up front which field you want to
index on:
-->
`client-go` 中的 Indexer 可以做得更好。你预先声明要索引哪个字段：

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

<!--
Two things about that call are worth making explicit, because the tidy example hides
them behind a convention.

**The index name is arbitrary.** That second argument, `"spec.nodeName"`, is only a
string key the index is registered under. `controller-runtime` does not parse it as
JSONPath and does not check it against the object's schema — you could write `"by-node"`
or `"xyzzy"` and it would behave identically. The only rule is that the *exact same
string* comes back in `MatchingFields` at query time. Naming the index after the field it
happens to read is a readability convention, nothing more.
-->
关于那个调用有两点值得明确指出，因为简洁的示例将它们隐藏在约定后面。

**索引名称是任意的。** 第二个参数 `"spec.nodeName"` 只是索引注册的字符串键。
`controller-runtime` 不会将其解析为 JSONPath，也不会根据对象的 schema 检查它 ——
你可以写 `"by-node"` 或 `"xyzzy"`，它的行为完全相同。唯一的规则是在查询时，
`MatchingFields` 中返回*完全相同的字符串*。以它碰巧读取的字段命名索引是一个可读性约定，仅此而已。

<!--
**The indexed value is computed, not read.** The function returns whatever strings you
build; they need not be the verbatim contents of any single field. You can lowercase a
value, join several fields into one composite key, bucket a timestamp (the _time-bucket_
trick below does exactly this), or emit a string that appears nowhere in the object
literally. Whatever the function returns becomes a key in the inverted dictionary, and a
`MatchingFields` lookup for that exact key is what finds the objects again. The only
constraint is that the value has to be *derivable from the object you are indexing*.
-->
**索引值是计算的，不是读取的。**函数返回你构建的任何字符串；它们不必是任何单个字段的逐字内容。
你可以将值转换为小写，将多个字段连接成一个复合键，对时间戳进行分桶（下面的 _time-bucket_
技巧正是这样做的），或者发出一个字面上在对象中任何地方都不存在的字符串。函数返回的任何内容都会成为
倒排字典中的键，而对该精确键的 `MatchingFields` 查找就是再次找到对象的方式。唯一的约束是，
值必须是*可从你正在索引的对象派生的*。

<!--
What is an _inverted index_? The term comes from search engines. Normally you have
documents and each document has a list of words in it. "Inverted" means the relationship is
flipped: a dictionary in which the key is a word and the value is the list of documents that
contain it. Same idea here: the key is the value of a field (for example, `node-1`), and the
value is the list of object keys whose field has that value:
-->
什么是_倒排索引_？这个术语来自搜索引擎。通常你有文档，每个文档中有一个单词列表。
"倒排"意味着关系被翻转：一个字典，其中键是单词，值是包含该单词的文档列表。
这里的想法相同：键是字段的值（例如，`node-1`），值是该字段具有该值的对象键列表：

```
map["node-1"] = {"default/pod-a", "kube-system/pod-b", ...}
map["node-2"] = {"default/pod-c", ...}
```

<!--
What the indexer does:

- On every incoming event (`ADDED`, `MODIFIED`, `DELETED`), the indexer runs the object
  through your indexing function, gets back the set of index keys, and updates the inverted
  dictionary. If a Pod migrates from `node-1` to `node-2`, the `node-1` key loses its
  reference to it and the `node-2` key gains one.
- By the time you call `List`, the index is **already current**. You do not pay for a
  rebuild at query time — no scan over all objects, no dictionary reconstruction. All the
  work was done up front, at the moment the object changed.
-->
索引器做什么：

- 在每个传入事件（`ADDED`、`MODIFIED`、`DELETED`）上，索引器通过你的索引函数运行对象，
  获取索引键集，并更新倒排字典。如果 Pod 从 `node-1` 迁移到 `node-2`，`node-1` 键失去对它的引用，
  `node-2` 键获得一个引用。
- 当你调用 `List` 时，索引**已经是最新的**。你不必在查询时支付重建成本 ——
  不需要扫描所有对象，不需要重建字典。所有工作都预先完成，在对象变更的那一刻。

<!--
And now you can write:
-->
现在你可以这样写：

```go
var pods corev1.PodList
_ = r.List(ctx, &pods,
    client.MatchingFields{"spec.nodeName": "node-1"},
)
```

<!--
This is not "fetch the full list, then filter". It is a lookup in the inverted index → a
ready set of keys → a fetch of the corresponding objects. A different code path entirely.
-->
这不是"获取完整列表，然后过滤"。这是在倒排索引中查找 → 一组准备好的键 → 获取相应的对象。
完全不同的代码路径。

<!--
The comparison to SQL is more accurate than it might look at first:

| SQL | controller-runtime |
|---|---|
| `CREATE INDEX idx_node ON pods(node_name)` | `IndexField(&Pod{}, "spec.nodeName", fn)` |
| `SELECT * FROM pods WHERE node_name = 'node-1'` | `List(&pods, MatchingFields{"spec.nodeName": "node-1"})` |
| `SELECT * FROM obj WHERE owner_uid = $1` | `List(&list, MatchingFields{"metadata.ownerReferences.uid": uid})` (requires an `IndexField` for that field) |
-->
与 SQL 的比较比乍一看更准确：

| SQL | controller-runtime |
|---|---|
| `CREATE INDEX idx_node ON pods(node_name)` | `IndexField(&Pod{}, "spec.nodeName", fn)` |
| `SELECT * FROM pods WHERE node_name = 'node-1'` | `List(&pods, MatchingFields{"spec.nodeName": "node-1"})` |
| `SELECT * FROM obj WHERE owner_uid = $1` | `List(&list, MatchingFields{"metadata.ownerReferences.uid": uid})`（需要 `IndexField`）|

<!--
Note the last row: `MatchingFields` does **not** make magic out of thin air. For every field
you want to look up via `MatchingFields` you need a corresponding `IndexField` registered
during manager setup. Without one, `controller-runtime` rejects the query and returns
an error.
-->
注意最后一行：`MatchingFields` **不会**凭空变出魔法。对于你想通过 `MatchingFields`
查找的每个字段，你需要在 manager 设置期间注册相应的 `IndexField`。没有它，
`controller-runtime` 会拒绝查询并返回错误。

<!--
A few things worth keeping in mind:

- **Equality only.** No range queries, no `LIKE`, no sorts, no aggregates. If you need
  "everything older than five minutes", either do a regular `List` and filter in code, or
  use a _time-bucket_ trick: instead of indexing the precise `time.Time`, index a rounded
  value (for example, `now.Truncate(5*time.Minute).Format(...)`). You can then select objects
  by a specific window.
-->
有几点值得记住：

- **仅相等性查询。** 没有范围查询，没有 `LIKE`，没有排序，没有聚合。如果你需要
  "所有超过五分钟的东西"，要么做常规的 `List` 并在代码中过滤，要么使用 _time-bucket_
  技巧：不要索引精确的 `time.Time`，而是索引一个四舍五入的值（例如，`now.Truncate(5*time.Minute).Format(...)`）。
  然后你可以按特定窗口选择对象。

<!--
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
-->
- **`MatchingLabels` 不是索引。** 许多人认为，既然基于标签的查找如此常见，一定有针对它们的优化。
  实际上没有 —— `ThreadSafeStore` 不维护单独的标签字典。

  当你调用 `List(..., MatchingLabels{...})` 时，控制器诚实地遍历该类型的**每一个**缓存对象，
  并针对选择器检查每个对象。那是 `O(n)`，正是 `IndexField` 应该为你避免的。

  API server 本身支持通过特定的标签选择器过滤事件流。要在你的控制器中使其有效，
  你必须在**缓存填充**阶段通过 `cache.ByObject{Label: ...}` 进行优化，而不是在**读取**阶段。
  这在下一节关于选择性缓存中介绍。

  如果你需要在已缓存的对象中按特定标签快速查找，手动为该标签注册一个 `IndexField`。这是有效的。

<!--
- **An index costs memory.** Every index is an extra dictionary keyed by every object. Do
  not index everything in sight speculatively.
-->
- **索引消耗内存。** 每个索引都是一个额外的字典，以每个对象为键。不要推测性地索引看到的一切。

<!--
- **You can only index data that is in the object itself.** You cannot index a Pod by "has a
  related PVC with such-and-such flag". Either store that bit in the Pod itself, or index
  the PVC, not the Pod.
-->
- **你只能索引对象本身中的数据。** 你不能通过"有一个带有这样那样标志的相关 PVC" 来索引 Pod。
  要么将该位存储在 Pod 本身中，要么索引 PVC，而不是 Pod。

<!--
**Note:** An index is built at registration time and is populated as part of the initial
**list**. By the time the first `Reconcile` runs, both `Get` and `List` with `MatchingFields`
work correctly — the index is not built lazily.
-->
**注意：** 索引在注册时构建，并作为初始 **list** 的一部分填充。当第一次 `Reconcile` 运行时，
`Get` 和带有 `MatchingFields` 的 `List` 都能正常工作 —— 索引不是延迟构建的。

<!--
## Selective cache: do not pull the whole cluster into your operator

By default, an informer pulls every object of its type from every namespace. For Pod,
Secret, ConfigMap, and Event in a large cluster, that is a multi-gigabyte surprise
delivered on the first **list** at startup.
-->
## 选择性缓存：不要将整个集群拉到你的 operator 中

默认情况下，informer 会从每个命名空间拉取其类型的每个对象。对于大型集群中的 Pod、
Secret、ConfigMap 和 Event，这在启动时的第一次 **list** 时会带来数 GB 的惊喜。

<!--
It hurts especially with:

- **Secrets**, because Helm stores release state in them (`helm.sh/release.v1.*`), and those
  secrets are often a hundred kilobytes each.
- **`v1.Node`** objects, whose `status.images` field carries a list of every image that has
  ever landed on the node — tens of kilobytes per node in busy clusters.
- **Events**, which can be very numerous and which you almost certainly do not need cached at
  all.
-->
尤其受影响的是：

- **Secrets**，因为 Helm 将发布状态存储在其中（`helm.sh/release.v1.*`），这些 secret 通常每个有几十 KB。
- **`v1.Node`** 对象，其 `status.images` 字段携带曾在该节点上运行的每个镜像的列表 ——
  在繁忙的集群中每个节点几十 KB。
- **Events**，数量可能非常多，而且你几乎肯定不需要缓存它们。

<!--
In `controller-runtime`, caching policy lives in `cache.Options`, passed when constructing
the manager:
-->
在 `controller-runtime` 中，缓存策略位于 `cache.Options` 中，在构建 `manager` 时传递：

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

<!--
A subtle point: this is a **manager-level** setting and it affects **every controller in the
process** that reads the corresponding type. If you narrow the cache for Secrets to a single
namespace and another controller in the same binary needs all secrets in the cluster, that
controller will not see them. Before you tighten the scope, audit who else is reading
the type.
-->
一个微妙的点：这是一个 **manager 级别的**设置，它影响进程中读取相应类型的**每个控制器**。
如果你将 Secret 的缓存范围缩小到单个命名空间，而同一二进制文件中的另一个控制器需要集群中的所有 Secret，
该控制器将看不到它们。在缩小范围之前，审核谁还在读取该类型。

<!--
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
-->
选项简介：

- **`Namespaces`** 限制可见范围。如果你的 operator 只管理自己的命名空间，没有理由将其他人的对象保存在内存中。
- **`Label` / `Field`** 成为 **watch** 本身的参数。API server 只发送匹配的对象，节省网络和内存。
- **`Transform`** 在对象进入 store 之前调用。这是删除 `managedFields`、过大的 `annotations`
  或你不需要的 ConfigMap 的二进制 `data` 的完美位置。
- **`DefaultLabelSelector` / `DefaultNamespaces`** 在每个类型都需要相同范围时全局应用相同的限制。

<!--
**Caveat:** A selector limits what is **cached**, not what **exists**. If an object does
not match your selector, then as far as your operator is concerned, it does not exist in
either `Get` or `List`. This bites people: somebody mislabels a single Secret and then
spends half a day figuring out why their controller "cannot see it".
-->
**警告：** 选择器限制的是**缓存的内容**，而不是**存在的内容**。如果对象不匹配你的选择器，
那么就你的 Operator 而言，它在 `Get` 或 `List` 中都不存在。这会坑人：有人给单个 Secret
贴错标签，然后花半天时间弄清楚为什么他们的控制器"看不到它"。

<!--
## Metadata-only: when `spec` and `data` are not needed

A separate pattern: you need to know that an object exists, but you do not need its `spec` or
`data`. Typical examples: a controller that waits for a Secret with a particular name to
appear but never reads it; one that counts PersistentVolume objects by the
`topology.kubernetes.io/zone` label; one that reacts to ConfigMap objects in a namespace
by name and does not care about contents.
-->
## 仅元数据：当不需要 `spec` 和 `data` 时

一种独立模式：你需要知道对象存在，但不需要其 `spec` 或 `data`。典型示例：等待特定名称的 Secret
出现但从不读取它的控制器；按 `topology.kubernetes.io/zone` 标签计数 PersistentVolume 对象的控制器；
按名称对命名空间中的 ConfigMap 对象做出反应但不关心内容的控制器。

<!--
**Caveat:** `PartialObjectMetadata` by definition gives you nothing from `spec` or
`status` — only `ObjectMeta`. So you **cannot** filter through it on `spec` fields (such as
a PersistentVolume's `storageClassName` or a Pod's `nodeName`); those fields do not
exist in the local copy. Everything covered by metadata-only is `labels`, `annotations`,
`ownerReferences`, `finalizers`, `creationTimestamp`, and the rest of `metadata`.
-->
**警告：** 根据定义，`PartialObjectMetadata` 不给你 `spec` 或 `status` 中的任何内容 ——
只有 `ObjectMeta`。因此你**不能**通过它过滤 `spec` 字段（例如 PersistentVolume 的 `storageClassName`
或 Pod 的 `nodeName`）；这些字段在本地副本中不存在。仅元数据涵盖的内容包括 `labels`、
`annotations`、`ownerReferences`、`finalizers`、`creationTimestamp` 和 `metadata` 的其余部分。

<!--
For this case there is `PartialObjectMetadata`:
-->
对于这种情况，有 `PartialObjectMetadata`：

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

<!--
Under the hood this is a separate watch that asks the API server for metadata only. The
store keeps such objects without `Data`, `Spec`, or `Status` — only `ObjectMeta`. For
Secrets the memory difference can reach an order of magnitude.
-->
在底层，这是一个单独的 watch，只向 API server 请求元数据。store 保存此类对象时不包含
`Data`、`Spec` 或 `Status` —— 只有 `ObjectMeta`。对于 Secret，内存差异可能达到一个数量级。

<!--
## APIReader: when the cache is not enough
-->
## APIReader：当缓存不够时

<!--
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
-->
`mgr.GetAPIReader()` 返回一个直接绕过缓存访问 API server 的 `client.Reader`。当你确实需要它时：

- **验证 Webhook**，对象的新鲜度至关重要。另一个进程中的缓存可能在那一刻滞后，
  你会阻止合法的 `Update`。
- 一次性读取你不维护 Informer 的资源。为单个操作启动 watch 成本很高。
- 在 `mgr.Start()` **之前**读取，例如在初始化期间。常规的 `mgr.GetClient()` 在那时返回无用内容。
- 通过 `client.Limit` / `client.Continue` **分页遍历大型结果集**。
  缓存支持的客户端忽略这些参数，始终从内存存储返回完整结果集；要实际通过 API server 分页，
  你需要 `APIReader`（或你自己的直接客户端）。

<!--
The price is a real network request. One thing to avoid: do not build "look in the cache, and
if missing, fall back to the API" logic. That is exactly the split-brain pattern the cache
is meant to protect you from.
-->
代价是真实的网络请求。要避免的一件事：不要构建"先在缓存中查找，如果找不到，回退到 API"
的逻辑。这正是缓存旨在保护你免受的脑裂模式。

<!--
### Disabling the cache for a type entirely

If you do not need a local cache for a given type at all — say, the type is "fat", read
rarely, and the **list** + **watch** overhead is not worth paying — you can tell the manager not to
cache it. This is configured through `client.Options.Cache.DisableFor`:
-->
### 完全禁用某个类型的缓存

如果你根本不需要给定类型的本地缓存 —— 例如，该类型很"胖"，很少读取，且 **list** + **watch**
的开销不值得付出 —— 你可以告诉 manager 不要缓存它。这通过 `client.Options.Cache.DisableFor` 配置：

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

<!--
With this configuration, `mgr.GetClient().Get(...)` and `List(...)` for Secret go straight
to the API server, bypassing the cache. No informer is started for that type, which means no
**list** at startup and no permanent memory pressure from a store. This is a more radical
alternative to `APIReader`: where `APIReader` is reached for ad hoc, individual requests,
`DisableFor` turns the cache off for the type wholesale.
-->
使用此配置，Secret 的 `mgr.GetClient().Get(...)` 和 `List(...)` 直接发送到 API server，
绕过缓存。不会为该类型启动 Informer，这意味着启动时没有 **list**，也没有来自 store 的永久内存压力。
这是 `APIReader` 的更激进替代方案：`APIReader` 用于临时的单个请求，
`DisableFor` 则完全关闭该类型的缓存。

<!--
Real-world projects use this. Several established CNCF operators disable caching on Secrets,
both to save memory and to avoid hammering the API server with a large **list** at startup.
-->
实际项目中使用了这一点。几个成熟的 CNCF Operator 禁用了 Secret 的缓存，
既节省内存，又避免在启动时用大量 **list** 冲击 API server。

<!--
**Aside:** If you want to avoid a watch on the API server entirely, you can feed the
controller events from a source of your own design, bypassing **list** + **watch**. In
`controller-runtime` this is done with `WatchesRawSource` / `source.Channel`: you can wire
the controller to events from any place — an internal queue, a kubelet, a custom watch.
Niche, but a perfectly valid pattern when the API server should not be touched.
-->
**题外话：** 如果你想完全避免在 API server 上进行 watch，你可以从自己设计的源向控制器提供事件，
绕过 **list** + **watch**。在 `controller-runtime` 中，这通过 `WatchesRawSource` / `source.Channel` 完成：
你可以将控制器连接到任何地方的事件 —— 内部队列、kubelet、自定义 watch。小众，但当不应触及 API server 时，
这是一个完全有效的模式。

<!--
## Good practices
-->
## 最佳实践

<!--
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
-->
在将 Operator 部署到生产集群之前，值得运行的简短检查清单：

- **限制缓存范围**（`Namespaces`、`Label`、`Field` 选择器），特别是对于"胖"类型：Secret、
  ConfigMap、Event、Pod、Node。
- **为不需要的重量级字段添加 `Transform`** —— `ManagedFields` 本身就消耗相当大的内存份额。
- **为每个使用 `MatchingFields` 的 `List` 添加 `IndexField`**。没有索引意味着每次协调都有隐藏的 `O(n)` 扫描。
- **不要在没有先调用 `DeepCopy` 的情况下修改**你在 `EventHandler` 或 `Predicate` 中收到的对象。
  对 store 的修改会静默且持久地破坏相邻的控制器。
- **使 `Reconcile` 幂等。** 即使连续调用五次而没有实际更改，它也必须正确行为。
- **不要期望在 `Update` 后立即从缓存中进行写后读。** 在该窗口期间，缓存会滞后。
- **当你需要新鲜度时**（webhooks、初始化、一次性读取），使用 `APIReader`，而不是常规客户端。
- **对只需要元数据的类型使用 `PartialObjectMetadata`**。它可以节省数 GB。
- **不要在 `mgr.Start()` 之前调用 `mgr.GetClient()`。** Informer 尚未预热，store 为空，
  你会得到 `NotFound` 或空的 `List`，然后花半天时间调查为什么对象"消失"了。
- **对于延迟操作，使用 `RequeueAfter`，**而不是 `time.Sleep` 和你自己的 goroutine。

<!--
## Wrapping up
-->
## 总结

<!--
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
-->
一口气总结：

- `controller-runtime` 中的缓存不是优化，而是操作模型。它底层是 `Reflector` + `DeltaFIFO` + `Indexer` ——
  正是驱动 Kubernetes 本身的相同原语。
- `r.Get` 和 `r.List` 访问内存；`Create`、`Update`、`Patch` 和 `Delete` 直接发送到 API server。
  反馈通过 watch 流入。
- `IndexField` 加上 `MatchingFields` 将缓存变成一个带有倒排索引的近乎完整的查询引擎。
- `Namespaces`、选择器、`PartialObjectMetadata` 和 `Transform` 是控制实际消耗多少内存和流量的杠杆。
- `APIReader` 是在你确实需要对象最新版本时的紧急出口。

<!--
And the single sentence to remember: `r.Get` inside a reconciler does not call the API
server. Ever. Not even the first time. Once that becomes a reflex, half the questions on
controller code reviews answer themselves.
-->
需要记住的一句话：协调器中的 `r.Get` 不会调用 API server。永远不会。甚至第一次也不会。
一旦这成为一种本能，控制器代码审查中的一半问题就会自行解答。
