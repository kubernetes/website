---
layout: blog
title: "Server Side Apply Is Great And You Should Be Using It"
date: 2022-10-20
slug: advanced-server-side-apply
author: >
  Daniel Smith (Google)
---

[Server-side apply](/docs/reference/using-api/server-side-apply/) (SSA) has now
been [GA for a few releases](/blog/2021/08/06/server-side-apply-ga/), and I
have found myself in a number of conversations, recommending that people / teams
in various situations use it.  So I’d like to write down some of those reasons.

## Obvious (and not-so-obvious) benefits of SSA {#benefits}

A list of improvements / niceties you get from switching from various things to
Server-side apply!

* Versus client-side-apply (that is, plain `kubectl apply`):
  * The system gives you conflicts when you accidentally fight with another
    actor over the value of a field!
  * When combined with `--dry-run`, there’s no chance of accidentally running a
    client-side dry run instead of a server side dry run.
* Versus hand-rolling patches:
  * The SSA patch format is extremely natural to write, with no weird syntax.
    It’s just a regular object, but you can (and should) omit any field you
    don’t care about.
  * The old patch format (“strategic merge patch”) was ad-hoc and still has some
    bugs; JSON-patch and JSON merge-patch fail to handle some cases that are
    common in the Kubernetes API, namely lists with items that should be
    recursively merged based on a “name” or other identifying field.
  * There’s also now great [go-language library support](https://kubernetes.io/blog/2021/08/06/server-side-apply-ga/#using-server-side-apply-in-a-controller)
    for building apply calls programmatically!
  * You can use SSA to explicitly delete fields you don’t “own” by setting them
    to `null`, which makes it a feature-complete replacement for all of the old
    patch formats.
* Versus shelling out to kubectl:
  * You can use the **apply** API call from any language without shelling out to
    kubectl!
  * As stated above, the [Go library has dedicated mechanisms](/blog/2021/08/06/server-side-apply-ga/#server-side-apply-support-in-client-go)
    to make this easy now.
* Versus GET-modify-PUT:
  * (This one is more complicated and you can skip it if you've never written a
    controller!)
  * To use GET-modify-PUT correctly, you have to handle and retry a write
    failure in the case that someone else has modified the object in any way
    between your GET and PUT. This is an “optimistic concurrency failure” when
    it happens.
  * SSA offloads this task to the server– you only have to retry if there’s a
    conflict, and the conflicts you can get are all meaningful, like when you’re
    actually trying to take a field away from another actor in the system.
  * To put it another way, if 10 actors do a GET-modify-PUT cycle at the same
    time, 9 will get an optimistic concurrency failure and have to retry, then
    8, etc, for up to 50 total GET-PUT attempts in the worst case (that’s .5N^2
    GET and PUT calls for N actors making simultaneous changes). If the actors
    are using SSA instead, and the changes don’t actually conflict over specific
    fields, then all the changes can go in in any order. Additionally, SSA
    changes can often be done without a GET call at all. That’s only N **apply**
    requests for N actors, which is a drastic improvement!

## How can I use SSA?

### Users

Use `kubectl apply --server-side`! Soon we (SIG API Machinery) hope to make this
the default and remove the “client side” apply completely!

### Controller authors

There’s two main categories here, but for both of them, **you should probably
_force conflicts_ when using SSA**. This is because your controller probably
doesn’t know what to do when some other entity in the system has a different
desire than your controller about a particular field. (See the [CI/CD
section](#ci-cd-systems), though!)

#### Controllers that use either a GET-modify-PUT sequence or a PATCH {#get-modify-put-patch-controllers}

This kind of controller GETs an object (possibly from a
[**watch**](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)),
modifies it, and then PUTs it back to write its changes. Sometimes it constructs
a custom PATCH, but the semantics are the same. Most existing controllers
(especially those in-tree) work like this.

If your controller is perfect, great! You don’t need to change it. But if you do
want to change it, you can take advantage of the new client library’s _extract_
workflow– that is, **get** the existing object, extract your existing desires,
make modifications, and re-**apply**. For many controllers that were computing
the smallest API changes possible, this will be a minor update to the existing
implementation.

This workflow avoids the failure mode of accidentally trying to own every field
in the object, which is what happens if you just GET the object, make changes,
and then **apply**. (Note that the server will notice you did this and reject
your change!)

#### Reconstructive controllers

This kind of controller wasn't really possible prior to SSA. The idea here is to
(whenever something changes etc) reconstruct from scratch the fields of the
object as the controller wishes them to be, and then **apply** the change to the
server, letting it figure out the result. I now recommend that new controllers
start out this way–it's less fiddly to say what you want an object to look like
than it is to say how you want it to change.

The client library supports this method of operation by default.

The only downside is that you may end up sending unneeded **apply** requests to
the API server, even if actually the object already matches your controller’s
desires. This doesn't matter if it happens once in a while, but for extremely
high-throughput controllers, it might cause a performance problem for the
cluster–specifically, the API server. No-op writes are not written to storage
(etcd) or broadcast to any watchers, so it’s not really that big of a deal. If
you’re worried about this anyway, today you could use the method explained in
the previous section, or you could still do it this way for now, and wait for an
additional client-side mechanism to suppress zero-change applies.

To get around this downside, why not GET the object and only send your **apply**
if the object needs it? Surprisingly, it doesn't help much – a no-op **apply** is
not very much more work for the API server than an extra GET; and an **apply**
that changes things is cheaper than that same **apply** with a preceding GET.
Worse, since it is a distributed system, something could change between your GET
and **apply**, invalidating your computation. Instead, you can use this
optimization on an object retrieved from a cache–then it legitimately will
reduce load on the system (at the cost of a delay when a change is needed and
the cache is a bit behind).

#### CI/CD systems {#ci-cd-systems}

Continuous integration (CI) and/or continuous deployment (CD) systems are a
special kind of controller which is doing something like reading manifests from
source control (such as a Git repo) and automatically pushing them into the
cluster. Perhaps the CI / CD process first generates manifests from a template,
then runs some tests, and then deploys a change. Typically, users are the
entities pushing changes into source control, although that’s not necessarily
always the case.

Some systems like this continuously reconcile with the cluster, others may only
operate when a change is pushed to the source control system. The following
considerations are important for both, but more so for the continuously
reconciling kind.

CI/CD systems are literally controllers, but for the purpose of **apply**, they
are more like users, and unlike other controllers, they need to pay attention to
conflicts. Reasoning:
* Abstractly, CI/CD systems can change anything, which means they could conflict
  with **any** controller out there. The recommendation that controllers force
  conflicts is assuming that controllers change a limited number of things and
  you can be reasonably sure that they won’t fight with other controllers about
  those things; that’s clearly not the case for CI/CD controllers.
* Concrete example: imagine the CI/CD system wants `.spec.replicas` for some
  Deployment to be 3, because that is the value that is checked into source
  code; however there is also a HorizontalPodAutoscaler (HPA) that targets the
  same deployment. The HPA computes a target scale and decides that there should
  be 10 replicas. Which should win? I just said that most controllers–including
  the HPA–should ignore conflicts. The HPA has no idea if it has been enabled
  incorrectly, and the HPA has no convenient way of informing users of errors.
* The other common cause of a CI/CD system getting a conflict is probably when
  it is trying to overwrite a hot-fix (hand-rolled patch) placed there by a
  system admin / SRE / dev-on-call. You almost certainly don’t want to override
  that automatically.
* Of course, sometimes SRE makes an accidental change, or a dev makes an
  unauthorized change – those you do want to notice and overwrite; however, the
  CI/CD system can’t tell the difference between these last two cases.

Hopefully this convinces you that CI/CD systems need error paths–a way to
back-propagate these conflict errors to humans; in fact, they should have this
already, certainly continuous integration systems need some way to report that
tests are failing. But maybe I can also say something about how _humans_ can
deal with errors:

* Reject the hotfix: the (human) administrator of the CI/CD system observes the
  error, and manually force-applies the manifest in question. Then the CI/CD
  system will be able to apply the manifest successfully and become a co-owner.

  Optional: then the administrator applies a blank manifest (just the object
  type / namespace / name) to relinquish any fields they became a manager for.
  if this step is omitted, there's some chance the administrator will end up
  owning fields and causing an unwanted future conflict.

  **Note**: why an administrator? I'm assuming that developers which ordinarily
  push to the CI/CD system and / or its source control system may not have
  permissions to push directly to the cluster.
* Accept the hotfix: the author of the change in question sees the conflict, and
  edits their change to accept the value running in production.
* Accept then reject: as in the accept option, but after that manifest is
  applied, and the CI/CD queue owns everything again (so no conflicts), re-apply
  the original manifest.
* I can also imagine the CI/CD system permitting you to mark a manifest as
  “force conflicts” somehow– if there’s demand for this we could consider making
  a more standardized way to do this. A rigorous version of this which lets you
  declare exactly which conflicts you intend to force would require support from
  the API server; in lieu of that, you can make a second manifest with only that
  subset of fields.
* Future work: we could imagine an especially advanced CI/CD system that could
  parse `metadata.managedFields` data to see who or what they are conflicting
  with, over what fields, and decide whether or not to ignore the conflict. In
  fact, this information is also presented in any conflict errors, though
  perhaps not in an easily machine-parseable format. We (SIG API Machinery)
  mostly didn't expect that people would want to take this approach — so we
  would love to know if in fact people want/need the features implied by this
  approach, such as the ability, when **apply**ing to request to override
  certain conflicts but not others.

  If this sounds like an approach you'd want to take for your own controller,
  come talk to SIG API Machinery!

Happy **apply**ing!

