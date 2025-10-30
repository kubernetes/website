---
layout: blog
draft: true
title: "Kubernetes v1.35: Introducing Workload Aware Scheduling"
date: 2025-XX-XX
slug: introducing-workload-aware-scheduling
author: >
  Maciej Skoczeń (Google)
  Dominik Marciński (Google)
---

Scheduling large workloads is a much more complex and fragile operation than scheduling a single Pod,
as it requires repeating the same process dozens of times for each Pod independently,
even when the Pods that are part of such a workload are identical.

There are many custom schedulers adapted to perform workload scheduling efficiently,
but considering how common and important workload scheduling is to Kubernetes users,
it's high time to make workloads a first-class citizen for kube-scheduler and support them natively.

## Workload Aware Scheduling

We are happy to announce the kickoff of the Workload Aware Scheduling effort that is aiming
to improve scheduling and management of workloads. The effort will span over many SIGs and releases,
and is supposed to gradually expand capabilities of the system toward reaching the North Star goal.

In Kubernetes v1.35 we introduce the **Workload API** that will be used to describe the desired shape
as well as scheduling and runtime behavior of the workload. It comes with an initial implementation
of **Gang Scheduling** that instructs the kube-scheduler to schedule gang Pods in the "all-or-nothing" fashion.
Finally, we improved scheduling of identical Pods (that typically make a gang) to speed up the process
thanks to the **Opportunistic Batching** feature.

## Workload API

The new Workload API resource is part of the `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}}.
This resource acts as a structured manifest for the scheduling requirements of a multi-Pod application.
While user-facing workloads like Jobs define what to run, the Workload resource
determines how a group of Pods should be scheduled.

A Workload allows you to define a group of Pods and apply a scheduling policy to them.
Here is what a Gang Scheduling configuration looks like. You can define a `podGroup` named `workers`
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

When you create your Pods, you simply link them to this Workload using the new `workloadRef` field:

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

## How Gang Scheduling Works

The `gang` policy enforces "all-or-nothing" placement. Without gang scheduling,
a job might be partially scheduled, consuming resources without being able to run,
leading to resource wastage and potential deadlocks.

When you create Pods that are part of a gang-scheduled `PodGroup`, the scheduler's `GangScheduling`
plugin manages the lifecycle independently for each `PodGroup` (or replica key):

1. When you create your Pods, the scheduler blocks them from scheduling,
   until the number of pending Pods meets your `minCount`.

2. Once enough Pods arrive, the scheduler tries to place them. However,
   instead of binding them to nodes immediately, the Pods wait at a `Permit` gate.

3. The scheduler checks if it has found valid nodes for the entire gang (at least the `minCount`).
   * If there is room for the gang, the gate opens, and all Pods are bound to nodes.
   * If only a subset of the gang pods was successfully scheduled within a timeout (set to 5 minutes),
     the scheduler rejects *all* of them. They go back to the queue,
     freeing up resources for other jobs that *can* run.

## Opportunistic Batching

In addition to explicit gang scheduling, v1.35 introduces **Opportunistic Batching**.
This is a Beta feature that improves scheduling latency for identical Pods.

Unlike Gang Scheduling, this feature does not require the Workload API
or any explicit opt-in on the user's part. It works opportunistically within the scheduler
by identifying Pods that have identical scheduling requirements (container images, resource requests,
affinities, etc.). When the scheduler processes a Pod, it can reuse the feasibility calculations
for subsequent identical Pods in the queue, significantly speeding up the process.

### Restrictions

Opportunistic Batching works under specific conditions. All fields used by the kube-scheduler
to find a placement must be identical between Pods. Additionally, using
[topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/),
[DRA ResourceClaims](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
or having [DRAExtendedResource](/docs/reference/command-line-tools-reference/feature-gates/DRAExtendedResource)
feature gate enabled, disables the batching mechanism for those Pods to ensure correctness.

Note that you may need to review your kube-scheduler configuration
to ensure default topology spread constraints are not implicitly disabling batching for your workloads.

See the [docs](TODO) for more details about restrictions.

## The North Star Vision

The scope of Workload Aware Scheduling is broad. These features are just the first steps.
In the near future, the effort aims to tackle:

* Single-cycle Gang Scheduling
* Topology Aware Scheduling
* Improved integration between scheduling and autoscaling
* Workload-level preemption

And more. Stay tuned for further updates.

## Getting Started

You can enable the following features to try Workload Aware Scheduling:

* Workload API: Enable the `GenericWorkload` feature gate on both `kube-apiserver` and `kube-scheduler`,
  and ensure the `scheduling.k8s.io/v1alpha1`
  {{< glossary_tooltip text="API group" term_id="api-group" >}} is enabled.
* Gang Scheduling: Enable the `GangScheduling` feature gate on `kube-scheduler`
  (requires the Workload API to be enabled).
* Opportunistic Batching: As a Beta feature, it is enabled by default in v1.35.
  You can disable it using the `OpportunisticBatching` feature gate on `kube-scheduler` if needed.

We encourage you to try out Workload Aware Scheduling in your test clusters
and share your experiences to help shape the future of Kubernetes scheduling.

## Learn more

* Read the KEPs for
  [Workload API and Gang Scheduling](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/4671-gang-scheduling) and
  [Opportunistic Batching](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/5598-opportunistic-batching).
* Track the [Workload Aware Scheduling issue](https://github.com/kubernetes/kubernetes/issues/132192)
  for recent updates.
