---
layout: blog
title: "Kubernetes v1.32: QueueingHint Brings a New Possibility to Optimize Pod Scheduling"
date: 2024-12-12
slug: scheduler-queueinghint
Author: >
  [Kensei Nakada](https://github.com/sanposhiho) (Tetrate.io)
---

The Kubernetes [scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/) is the core
component that selects the nodes on which new Pods run. The scheduler processes
these new Pods **one by one**. Therefore, the larger your clusters, the more important
the throughput of the scheduler becomes.

Over the years, Kubernetes SIG Scheduling has improved the throughput
of the scheduler in multiple enhancements. This blog post describes a major improvement to the
scheduler in Kubernetes v1.32: a 
[scheduling context element](/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points)
named _QueueingHint_. This page provides background knowledge of the scheduler and explains how
QueueingHint improves scheduling throughput.

## Scheduling queue

The scheduler stores all unscheduled Pods in an internal component called the _scheduling queue_. 

The scheduling queue consists of the following data structures:
- **ActiveQ**: holds newly created Pods or Pods that are ready to be retried for scheduling.
- **BackoffQ**: holds Pods that are ready to be retried but are waiting for a backoff period to end. The
   backoff period depends on the number of unsuccessful scheduling attempts performed by the scheduler on that Pod.
- **Unschedulable Pod Pool**: holds Pods that the scheduler won't attempt to schedule for one of the
   following reasons:
   - The scheduler previously attempted and was unable to schedule the Pods. Since that attempt, the cluster
      hasn't changed in a way that could make those Pods schedulable.
   - The Pods are blocked from entering the scheduling cycles by PreEnqueue Plugins, 
for example, they have a [scheduling gate](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/#configuring-pod-schedulinggates),
and get blocked by the scheduling gate plugin.

## Scheduling framework and plugins

The Kubernetes scheduler is implemented following the Kubernetes
[scheduling framework](/docs/concepts/scheduling-eviction/scheduling-framework/).

And, all scheduling features are implemented as plugins
(e.g., [Pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
is implemented in the `InterPodAffinity` plugin.)

The scheduler processes pending Pods in phases called _cycles_ as follows:
1. **Scheduling cycle**: the scheduler takes pending Pods from the activeQ component of the scheduling
    queue  _one by one_. For each Pod, the scheduler runs the filtering/scoring logic from every scheduling plugin. The
    scheduler then decides on the best node for the Pod, or decides that the Pod can't be scheduled at that time.
    
    If the scheduler decides that a Pod can't be scheduled, that Pod enters the Unschedulable Pod Pool
    component of the scheduling queue. However, if the scheduler decides to place the Pod on a node, 
    the Pod goes to the binding cycle.
    
1. **Binding cycle**: the scheduler communicates the node placement decision to the Kubernetes API
    server. This operation bounds the Pod to the selected node. 
    
Aside from some exceptions, most unscheduled Pods enter the unschedulable pod pool after each scheduling
cycle. The Unschedulable Pod Pool component is crucial because of how the scheduling cycle processes Pods one by one. If the scheduler had to constantly retry placing unschedulable Pods, instead of offloading those
Pods to the Unschedulable Pod Pool, multiple scheduling cycles would be wasted on those Pods.

## Improvements to retrying Pod scheduling with QueuingHint

Unschedulable Pods only move back into the ActiveQ or BackoffQ components of the scheduling
queue if changes in the cluster might allow the scheduler to place those Pods on nodes. 

Prior to v1.32, each plugin registered which cluster changes could solve their failures, an object creation, update, or deletion in the cluster (called _cluster events_),
with `EnqueueExtensions` (`EventsToRegister`),
and the scheduling queue retries a pod with an event that is registered by a plugin that rejected the pod in a previous scheduling cycle.

Additionally, we had an internal feature called `preCheck`, which helped further filtering of events for efficiency, based on Kubernetes core scheduling constraints;
For example, `preCheck` could filter out node-related events when the node status is `NotReady`. 

However, we had two issues for those approaches:
- Requeueing with events was too broad, could lead to scheduling retries for no reason.
   - A new scheduled Pod _might_ solve the `InterPodAffinity`'s failure, but not all of them do.
For example, if a new Pod is created, but without a label matching `InterPodAffinity` of the unschedulable pod, the pod wouldn't be schedulable.
- `preCheck` relied on the logic of in-tree plugins and was not extensible to custom plugins,
like in issue [#110175](https://github.com/kubernetes/kubernetes/issues/110175). 

Here QueueingHints come into play; 
a QueueingHint subscribes to a particular kind of cluster event, and make a decision about whether each incoming event could make the Pod schedulable.

For example, consider a Pod named `pod-a` that has a required Pod affinity. `pod-a` was rejected in
the scheduling cycle by the `InterPodAffinity` plugin because no node had an existing Pod that matched
the Pod affinity specification for `pod-a`.

{{< figure src="queueinghint1.svg" alt="A diagram showing the scheduling queue and pod-a rejected by InterPodAffinity plugin" caption="A diagram showing the scheduling queue and pod-a rejected by InterPodAffinity plugin" >}}

`pod-a` moves into the Unschedulable Pod Pool. The scheduling queue records which plugin caused
the scheduling failure for the Pod. For `pod-a`, the scheduling queue records that the `InterPodAffinity`
plugin rejected the Pod.

`pod-a` will never be schedulable until the InterPodAffinity failure is resolved. 
There're some scenarios that the failure could be resolved, one example is an existing running pod gets a label update and becomes matching a Pod affinity.
For this scenario, the `InterPodAffinity` plugin's `QueuingHint` callback function checks every Pod label update that occurs in the cluster. 
Then, if a Pod gets a label update that matches the Pod affinity requirement of `pod-a`, the `InterPodAffinity`,
plugin's `QueuingHint` prompts the scheduling queue to move `pod-a` back into the ActiveQ or
the BackoffQ component.

{{< figure src="queueinghint2.svg" alt="A diagram showing the scheduling queue and pod-a being moved by InterPodAffinity QueueingHint" caption="A diagram showing the scheduling queue and pod-a being moved by InterPodAffinity QueueingHint" >}}

## QueueingHint's history and what's new in v1.32

At SIG Scheduling, we have been working on the development of QueueingHint since
Kubernetes v1.28.

While QueuingHint isn't user-facing, we implemented the `SchedulerQueueingHints` feature gate as a
safety measure when we originally added this feature. In v1.28, we implemented QueueingHints with a
few in-tree plugins experimentally, and made the feature gate enabled by default.

However, users reported a memory leak, and consequently we disabled the feature gate in a
patch release of v1.28.  From v1.28 until v1.31, we kept working on the QueueingHint implementation
within the rest of the in-tree plugins and fixing bugs.

In v1.32, we made this feature enabled by default again. We finished implementing QueueingHints
in all plugins and also identified the cause of the memory leak!

We thank all the contributors who participated in the development of this feature and those who reported and investigated the earlier issues.

## Getting involved

These features are managed by Kubernetes [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

Please join us and share your feedback. 

## How can I learn more?

- [KEP-4247: Per-plugin callback functions for efficient requeueing in the scheduling queue](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/4247-queueinghint/README.md)
