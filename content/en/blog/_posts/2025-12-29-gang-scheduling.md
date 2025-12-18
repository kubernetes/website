---
layout: blog
title: "Kubernetes v1.35: Introducing Workload Aware Scheduling"
date: 2025-12-29T10:30:00-08:00
slug: kubernetes-v1-35-introducing-workload-aware-scheduling
author: >
  Maciej Skoczeń (Google),
  Dominik Marciński (Google)
---

Scheduling large workloads is a much more complex and fragile operation than scheduling a single Pod,
as it often requires considering all Pods together instead of scheduling each one independently.
For example, when scheduling a machine learning batch job, you often need to place each worker strategically,
such as on the same rack, to make the entire process as efficient as possible.
At the same time, the Pods that are part of such a workload are very often identical
from the scheduling perspective, which fundamentally changes how this process should look.

There are many custom schedulers adapted to perform workload scheduling efficiently,
but considering how common and important workload scheduling is to Kubernetes users,
especially in the AI era with the growing number of use cases,
it is high time to make workloads a first-class citizen for `kube-scheduler` and support them natively.

## Workload aware scheduling

The recent 1.35 release of Kubernetes delivered the first tranche of *workload aware scheduling* improvements.
These are part of a wider effort that is aiming to improve scheduling and management of workloads.
The effort will span over many SIGs and releases, and is supposed to gradually expand
capabilities of the system toward reaching the north star goal,
which is seamless workload scheduling and management in Kubernetes including,
but not limited to, preemption and autoscaling.

Kubernetes v1.35 introduces the Workload API that you can use to describe the desired shape
as well as scheduling-oriented requirements of the workload. It comes with an initial implementation
of *gang scheduling* that instructs the `kube-scheduler` to schedule gang Pods in the *all-or-nothing* fashion.
Finally, we improved scheduling of identical Pods (that typically make a gang) to speed up the process
thanks to the *opportunistic batching* feature.

## Workload API

The new Workload API resource is part of the `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}}.
This resource acts as a structured, machine-readable definition of the scheduling requirements
of a multi-Pod application. While user-facing workloads like Jobs define what to run, the Workload resource
determines how a group of Pods should be scheduled and how its placement should be managed
throughout its lifecycle.

A Workload allows you to define a group of Pods and apply a scheduling policy to them.
Here is what a gang scheduling configuration looks like. You can define a `podGroup` named `workers`
and apply the `gang` policy with a `minCount` of 4.

```yaml
apiVersion: scheduling.k8s.io/v1alpha1
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  podGroups:
  - name: workers
    policy:
      gang:
        # The gang is schedulable only if 4 pods can run at once
        minCount: 4
```

When you create your Pods, you link them to this Workload using the new `workloadRef` field:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
  namespace: some-ns
spec:
  workloadRef:
    name: training-job-workload
    podGroup: workers
  ...
```

## How gang scheduling works

The `gang` policy enforces *all-or-nothing* placement. Without gang scheduling,
a Job might be partially scheduled, consuming resources without being able to run,
leading to resource wastage and potential deadlocks.

When you create Pods that are part of a gang-scheduled pod group, the scheduler's `GangScheduling`
plugin manages the lifecycle independently for each pod group (or replica key):

1. When you create your Pods (or a controller makes them for you),
   the scheduler blocks them from scheduling, until:
   * The referenced Workload object is created.
   * The referenced pod group exists in a Workload.
   * The number of pending Pods in that group meets your `minCount`.

2. Once enough Pods arrive, the scheduler tries to place them. However,
   instead of binding them to nodes immediately, the Pods wait at a `Permit` gate.

3. The scheduler checks if it has found valid assignments for the entire group (at least the `minCount`).
   * If there is room for the group, the gate opens, and all Pods are bound to nodes.
   * If only a subset of the group pods was successfully scheduled within a timeout (set to 5 minutes),
     the scheduler rejects **all** of the Pods in the group.
     They go back to the queue, freeing up the reserved resources for other workloads.

We'd like to point out that that while this is a first implementation, the Kubernetes project firmly
intends to improve and expand the gang scheduling algorithm in future releases.
Benefits we hope to deliver include a single-cycle scheduling phase for a whole gang,
workload-level preemption, and more, moving towards the north star goal.

## Opportunistic batching

In addition to explicit gang scheduling, v1.35 introduces *opportunistic batching*.
This is a Beta feature that improves scheduling latency for identical Pods.

Unlike gang scheduling, this feature does not require the Workload API
or any explicit opt-in on the user's part. It works opportunistically within the scheduler
by identifying Pods that have identical scheduling requirements (container images, resource requests,
affinities, etc.). When the scheduler processes a Pod, it can reuse the feasibility calculations
for subsequent identical Pods in the queue, significantly speeding up the process.

Most users will benefit from this optimization automatically, without taking any special steps,
provided their Pods meet the following criteria.

### Restrictions

Opportunistic batching works under specific conditions. All fields used by the `kube-scheduler`
to find a placement must be identical between Pods. Additionally, using some features
disables the batching mechanism for those Pods to ensure correctness.

Note that you may need to review your `kube-scheduler` configuration
to ensure it is not implicitly disabling batching for your workloads.

See the [docs](TODO) for more details about restrictions.

## The north star vision

The project has a broad ambition to deliver workload aware scheduling.
These new APIs and scheduling enhancements are just the first steps.
In the near future, the effort aims to tackle:

* Introducing a workload scheduling phase
* Improved support for multi-node [DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
  and topology aware scheduling
* Workload-level preemption
* Improved integration between scheduling and autoscaling
* Improved interaction with external workload schedulers
* Managing placement of workloads throughout their entire lifecycle
* Multi-workload scheduling simulations

And more. The priority and implementation order of these focus areas
are subject to change. Stay tuned for further updates.

## Getting started

To try the workload aware scheduling improvements:

* Workload API: Enable the
  [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
  feature gate on both `kube-apiserver` and `kube-scheduler`, and ensure the `scheduling.k8s.io/v1alpha1`
  {{< glossary_tooltip text="API group" term_id="api-group" >}} is enabled.
* Gang scheduling: Enable the 
  [`GangScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling)
  feature gate on `kube-scheduler` (requires the Workload API to be enabled).
* Opportunistic batching: As a Beta feature, it is enabled by default in v1.35.
  You can disable it using the
  [`OpportunisticBatching`](/docs/reference/command-line-tools-reference/feature-gates/#OpportunisticBatching)
  feature gate on `kube-scheduler` if needed.

We encourage you to try out workload aware scheduling in your test clusters
and share your experiences to help shape the future of Kubernetes scheduling.
You can send your feedback by:

* Reaching out via [Slack (#sig-scheduling)](https://kubernetes.slack.com/archives/C09TP78DV).
* Commenting on the [workload aware scheduling tracking issue](https://github.com/kubernetes/kubernetes/issues/132192)
* Filing a new [issue](https://github.com/kubernetes/enhancements/issues) in the Kubernetes repository.

## Learn more

* Read the KEPs for
  [Workload API and gang scheduling](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/4671-gang-scheduling) and
  [Opportunistic batching](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/5598-opportunistic-batching).
* Track the [Workload aware scheduling issue](https://github.com/kubernetes/kubernetes/issues/132192)
  for recent updates.
