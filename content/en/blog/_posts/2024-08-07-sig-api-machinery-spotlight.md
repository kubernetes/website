---
layout: blog
title: "Spotlight on SIG API Machinery"
slug: sig-api-machinery-spotlight-2024
canonicalUrl: https://www.kubernetes.dev/blog/2024/08/07/sig-api-machinery-spotlight-2024
date: 2024-08-07
author: "Frederico Muñoz (SAS Institute)"
---

We recently talked with [Federico Bongiovanni](https://github.com/fedebongio) (Google) and [David
Eads](https://github.com/deads2k) (Red Hat), Chairs of SIG API Machinery, to know a bit more about
this Kubernetes Special Interest Group.

## Introductions

**Frederico (FSM): Hello, and thank your for your time. To start with, could you tell us about
yourselves and how you got involved in Kubernetes?**

**David**: I started working on
[OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift) (the Red Hat
distribution of Kubernetes) in the fall of 2014 and got involved pretty quickly in API Machinery. My
first PRs were fixing kube-apiserver error messages and from there I branched out to `kubectl`
(_kubeconfigs_ are my fault!), `auth` ([RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) and `*Review` APIs are ports
from OpenShift), `apps` (_workqueues_ and _sharedinformers_ for example). Don’t tell the others,
but API Machinery is still my favorite :)

**Federico**: I was not as early in Kubernetes as David, but now it's been more than six years. At
my previous company we were starting to use Kubernetes for our own products, and when I came across
the opportunity to work directly with Kubernetes I left everything and boarded the ship (no pun
intended). I joined Google and Kubernetes in early 2018, and have been involved since.

## SIG Machinery's scope

**FSM: It only takes a quick look at the SIG API Machinery charter to see that it has quite a
significant scope, nothing less than the Kubernetes control plane. Could you describe this scope in
your own words?**

**David**: We own the `kube-apiserver` and how to efficiently use it. On the backend, that includes
its contract with backend storage and how it allows API schema evolution over time.  On the
frontend, that includes schema best practices, serialization, client patterns, and controller
patterns on top of all of it.

**Federico**: Kubernetes has a lot of different components, but the control plane has a really
critical mission: it's your communication layer with the cluster and also owns all the extensibility
mechanisms that make Kubernetes so powerful. We can't make mistakes like a regression, or an
incompatible change, because the blast radius is huge.

**FSM: Given this breadth, how do you manage the different aspects of it?**

**Federico**: We try to organize the large amount of work into smaller areas. The working groups and
subprojects are part of it. Different people on the SIG have their own areas of expertise, and if
everything fails, we are really lucky to have people like David, Joe, and Stefan who really are "all
terrain", in a way that keeps impressing me even after all these years.  But on the other hand this
is the reason why we need more people to help us carry the quality and excellence of Kubernetes from
release to release.

## An evolving collaboration model

**FSM: Was the existing model always like this, or did it evolve with time - and if so, what would
you consider the main changes and the reason behind them?**

**David**: API Machinery has evolved over time both growing and contracting in scope.  When trying
to satisfy client access patterns it’s very easy to add scope both in terms of features and applying
them.

A good example of growing scope is the way that we identified a need to reduce memory utilization by
clients writing controllers and developed shared informers.  In developing shared informers and the
controller patterns use them (workqueues, error handling, and listers), we greatly reduced memory
utilization and eliminated many expensive lists.  The downside: we grew a new set of capability to
support and effectively took ownership of that area from sig-apps.

For an example of more shared ownership: building out cooperative resource management (the goal of
server-side apply), `kubectl` expanded to take ownership of leveraging the server-side apply
capability.  The transition isn’t yet complete, but [SIG
CLI](https://github.com/kubernetes/community/tree/master/sig-cli) manages that usage and owns it.

**FSM: And for the boundary between approaches, do you have any guidelines?**

**David**: I think much depends on the impact. If the impact is local in immediate effect, we advise
other SIGs and let them move at their own pace.  If the impact is global in immediate effect without
a natural incentive, we’ve found a need to press for adoption directly.

**FSM: Still on that note, SIG Architecture has an API Governance subproject, is it mostly
independent from SIG API Machinery or are there important connection points?**

**David**: The projects have similar sounding names and carry some impacts on each other, but have
different missions and scopes.  API Machinery owns the how and API Governance owns the what.  API
conventions, the API approval process, and the final say on individual k8s.io APIs belong to API
Governance.  API Machinery owns the REST semantics and non-API specific behaviors.

**Federico**: I really like how David put it: *"API Machinery owns the how and API Governance owns
the what"*: we don't own the actual APIs, but the actual APIs live through us.

## The challenges of Kubernetes popularity

**FSM: With the growth in Kubernetes adoption we have certainly seen increased demands from the
Control Plane: how is this felt and how does it influence the work of the SIG?**

**David**: It’s had a massive influence on API Machinery.  Over the years we have often responded to
and many times enabled the evolutionary stages of Kubernetes.  As the central orchestration hub of
nearly all capability on Kubernetes clusters, we both lead and follow the community.  In broad
strokes I see a few evolution stages for API Machinery over the years, with constantly high
activity.

1. **Finding purpose**: `pre-1.0` up until `v1.3` (up to our first 1000+ nodes/namespaces) or
   so. This time was characterized by rapid change.  We went through five different versions of our
   schemas and rose to meet the need.  We optimized for quick, in-tree API evolution (sometimes to
   the detriment of longer term goals), and defined patterns for the first time.

2. **Scaling to meet the need**: `v1.3-1.9` (up to shared informers in controllers) or so.  When we
   started trying to meet customer needs as we gained adoption, we found severe scale limitations in
   terms of CPU and memory. This was where we broadened API machinery to include access patterns, but
   were still heavily focused on in-tree types.  We built the watch cache, protobuf serialization,
   and shared caches.

3. **Fostering the ecosystem**: `v1.8-1.21` (up to CRD v1) or so.  This was when we designed and wrote
   CRDs (the considered replacement for third-party-resources), the immediate needs we knew were
   coming (admission webhooks), and evolution to best practices we knew we needed (API schemas).
   This enabled an explosion of early adopters willing to work very carefully within the constraints
   to enable their use-cases for servicing pods.  The adoption was very fast, sometimes outpacing
   our capability, and creating new problems.

4. **Simplifying deployments**: `v1.22+`.  In the relatively recent past, we’ve been responding to
   pressures or running kube clusters at scale with large numbers of sometimes-conflicting ecosystem
   projects using our extensions mechanisms.  Lots of effort is now going into making platform
   extensions easier to write and safer to manage by people who don't hold PhDs in kubernetes.  This
   started with things like server-side-apply and continues today with features like webhook match
   conditions and validating admission policies.

Work in API Machinery has a broad impact across the project and the ecosystem.  It’s an exciting
area to work for those able to make a significant time investment on a long time horizon.

## The road ahead

**FSM: With those different evolutionary stages in mind, what would you pinpoint as the top
priorities for the SIG at this time?**

**David:** **Reliability, efficiency, and capability** in roughly that order.

With the increased usage of our `kube-apiserver` and extensions mechanisms, we find that our first
set of extensions mechanisms, while fairly complete in terms of capability, carry significant risks
in terms of potential mis-use with large blast radius.  To mitigate these risks, we’re investing in
features that reduce the blast radius for accidents (webhook match conditions) and which provide
alternative mechanisms with lower risk profiles for most actions (validating admission policy).

At the same time, the increased usage has made us more aware of scaling limitations that we can
improve both server and client-side.  Efforts here include more efficient serialization (CBOR),
reduced etcd load (consistent reads from cache), and reduced peak memory usage (streaming lists).

And finally, the increased usage has highlighted some long existing
gaps that we’re closing.  Things like field selectors for CRDs which
the [Batch Working Group](https://github.com/kubernetes/community/blob/master/wg-batch/README.md)
is eager to leverage and will eventually form the basis for a new way
to prevent trampoline pod attacks from exploited nodes.

## Joining the fun

**FSM: For anyone wanting to start contributing, what's your suggestions?**

**Federico**: SIG API Machinery is not an exception to the Kubernetes motto: **Chop Wood and Carry
Water**. There are multiple weekly meetings that are open to everybody, and there is always more
work to be done than people to do it.

I acknowledge that API Machinery is not easy, and the ramp up will be steep. The bar is high,
because of the reasons we've been discussing: we carry a huge responsibility. But of course with
passion and perseverance many people has ramped up through the years, and we hope more will come.

In terms of concrete opportunities, there is the SIG meeting every two weeks. Everyone is welcome to
attend and listen, see what the group talks about, see what's going on in this release, etc.

Also two times a week, Tuesday and Thursday, we have the public Bug Triage, where we go through
everything new from the last meeting. We've been keeping this practice for more than 7 years
now. It's a great opportunity to volunteer to review code, fix bugs, improve documentation,
etc. Tuesday's it's at 1 PM (PST) and Thursday is on an EMEA friendly time (9:30 AM PST).  We are
always looking to improve, and we hope to be able to provide more concrete opportunities to join and
participate in the future.

**FSM: Excellent, thank you! Any final comments you would like to share with our readers?**

**Federico**: As I mentioned, the first steps might be hard, but the reward is also larger. Working
on API Machinery is working on an area of huge impact (millions of users?), and your contributions
will have a direct outcome in the way that Kubernetes works and the way that it's used. For me
that's enough reward and motivation!
