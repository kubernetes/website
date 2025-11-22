---
title: Workload Aware Scheduling
content_type: concept
weight: 120
---

This page provides an overview of Workload Aware Scheduling (WAS), a Kubernetes feature
that enables the kube-scheduler to manage groups of related Pods as a single unit.

## What is Workload Aware Scheduling?

The default Kubernetes scheduler makes decisions for one Pod at a time. This model works sufficiently good for stateless applications,
but can be inefficient for tightly-coupled workloads like those found in machine learning, scientific computing, or big data analytics.
These applications often require that a group of Pods must run concurrently to make any progress.

When the scheduler places these Pods individually, it can lead to resource deadlocks or placement inefficiencies.
For example, half of a job's Pods might be scheduled, consuming cluster resources, while the other half remains pending
because no single node has enough capacity for them. The job cannot run,
but the scheduled Pods waste expensive resources that other applications could use.

Workload Aware Scheduling introduces a mechanism for the scheduler to identify and manage a group of Pods as a single, atomic workload.
This allows for more intelligent placement decisions and is the foundation for features like gang scheduling.

The `Workload` API is used to express these group scheduling requirements.

## Workload API

{{< feature-state feature_gate_name="GenericWorkload" >}}

The `Workload` API resource, available from the `scheduling.k8s.io/v1alpha1` API group, allows you to logically group a set of Pods.
You then link Pods to a `Workload` to inform the scheduler that they should be considered together.
Controllers for high-level resources, such as the Job controller, can create `Workload` objects to communicate placement requirements to the scheduler.

A `Workload` resource defines one or more `PodGroup`s. Each `PodGroup` specifies a set of Pods and the scheduling policy that applies to them.

Here is an example manifest for a `Workload` that defines a gang of three Pods:

```yaml
apiVersion: scheduling.k8s.io/v1alpha1
kind: Workload
metadata:
  name: training-job-workload
spec:
  # controllerRef provides a link to the object that manages this Workload,
  # such as a Kubernetes Job. This is for tooling and observability.
  controllerRef:
    apiGroup: batch
    kind: Job
    name: training-job

  podGroups:
  - name: workers
    policy:
      gang:
        # The minimum number of Pods from this group that must be schedulable
        # at the same time for any of them to be scheduled.
        minCount: 3
```

To associate a Pod with this `Workload`, you add a `spec.workloadRef` field to the Pod's manifest.
This field creates a link to a specific `PodGroup` within the `Workload`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: training-pod-1
spec:
  # This reference links the Pod to the 'workers' PodGroup
  # inside the 'training-job-workload' Workload.
  workloadRef:
    name: training-job-workload
    podGroup: workers
  # ...
```

### Pod Group Replicas

For more complex scenarios, you can partition a single `PodGroup` into replicated, independent gangs.
You achieve this using the `podGroupReplicaKey` field within a Pod's `workloadRef`. This key acts as a label
to create logical subgroups. The scheduling algorithm is then applied to each subgroup separately.

For example, if you have a `PodGroup` with `minCount: 2` and you create four Pods: two with `podGroupReplicaKey: "0"`
and two with `podGroupReplicaKey: "1"`, the scheduler will treat them as two independent gangs of two Pods.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: training-pod-1
spec:
  workloadRef:
    name: training-job-workload
    podGroup: workers
    # All workers with the replica key "0" will be scheduled together as one gang.
    podGroupReplicaKey: "0"
  # ...
```

## Scheduling Policies

For each `PodGroup`, you must specify exactly one scheduling policy. The two available policies are `basic` and `gang`.

### Basic Scheduling

The `basic` policy instructs the scheduler to treat all Pods in a `PodGroup` as independent entities,
scheduling them using the standard Kubernetes behavior.

Currently, the main reason to use the `basic` policy is to organize the Pods within your `Workload`
for better observability and management.

While this policy does not add any special group-level scheduling constraints today,
it provides a foundation for future enhancements. For example, future versions of Kubernetes
might introduce group-level constraints that apply to a `PodGroup` without requiring
the all-or-nothing semantics of gang scheduling.

### Gang Scheduling

{{< feature-state feature_gate_name="GangScheduling" >}}

The `gang` policy enforces gang scheduling placement, which ensures a group of Pods are scheduled on an "all-or-nothing" basis.
Without gang scheduling, a job might be partially scheduled, leading to resource wastage and potential deadlocks.

The `GangScheduling` plugin uses the `Workload` API to implement its logic.
When you create Pods that are part of a gang-scheduled `PodGroup`, the scheduler follows this process,
independently per each `PodGroup` and its replica key:

1. The scheduler waits on `PreEnqueue` until the number of Pods that have been created for the specific `PodGroup`
   is at least equal to the `minCount`. Pods do not enter the active scheduling queue until this condition is met.

2. Once the quorum is met, the scheduler attempts to find node placements for all Pods in the group by taking them pod-by-pod.
   All assigned Pods wait at a `WaitOnPermit` gate during this process. Future versions will introduce a new,
   single cycle scheduling phase to find the placement for the entire group at once.

3. If the scheduler finds valid placements for at least `minCount` Pods, it allows all of them to be bound to their assigned nodes.
   If it cannot find placements for the entire group within a fixed, 5 minutes timeout, none of the Pods are scheduled.
   Instead, they are moved to the unschedulable queue to wait for cluster resources to free up.

## Enabling the Features

To use the Workload API in your cluster, you must enable the `GenericWorkload` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on both the `kube-apiserver` and `kube-scheduler`.

To use Gang Scheduling, you must also enable the `GangScheduling` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
on the `kube-scheduler`. When this feature gate is enabled, the `GangScheduling` plugin is enabled by default in the scheduler's profiles.
