---
title: PodGroup Scheduling
content_type: concept
weight: 80
---

{{< feature-state feature_gate_name="GenericWorkload" >}}

The standard Kubernetes scheduler evaluates Pods sequentially. When multiple workloads, such as machine learning training jobs,
are submitted concurrently, this sequential evaluation can lead to resource deadlocks.
For example, two competing workloads might each schedule a subset of their Pods,
consuming cluster capacity but leaving neither workload with enough resources to fully start.

The PodGroup scheduling cycle evaluates a group of Pods as a single unit.
The scheduler attempts to find placements for all Pods in the group simultaneously.
If it cannot find sufficient resources to satisfy the entire group's requirements, none of the Pods are bound.

Additionally, treating the group as a unified entity establishes a foundational architecture
that simplifies the implementation of other group-based scheduling features.

This feature depends on the [Workload API](/docs/concepts/workloads/workload-api/).
Ensure the [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
feature gate and the `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} are enabled in the cluster.

<!-- body -->

## PodGroup scheduling cycle

To support scheduling a group of Pods together, the kube-scheduler uses the **PodGroup scheduling cycle**.
Instead of processing Pods individually and holding them at a `WaitOnPermit` gate,
the scheduler evaluates the entire group of pending Pods belonging to a specific PodGroup collectively.
Rather than executing separate scheduling cycles for each Pod,
it evaluates feasibility for the entire group and moves directly to the binding phase afterwards.

When the scheduler pops a Pod belonging to a PodGroup, it retrieves all other queued Pods in that group.
It then sorts them deterministically based on priority and the time they were initially observed by the scheduler,
and initiates the PodGroup scheduling cycle as follows:

1. **Snapshotting the cluster state:** When the scheduler begins evaluating a PodGroup,
   it takes a single snapshot of the cluster state that lasts for the entire duration of the cycle.
   This ensures the evaluation remains consistent for the whole group and prevents race conditions with other events.

2. **Finding feasible placements:** The scheduler runs the [PodGroup scheduling algorithm](#podgroup-scheduling-algorithm)
   to find valid Node placements for the Pods in the group.

3. **Atomic decision:** Depending on the algorithm's outcome, the scheduling decision
   is applied atomically for the entire PodGroup.

   * **Success:** If the scheduler finds sufficient resources and valid placements for the Pods
     (e.g., satisfying the `minCount` constraint for [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)),
     those Pods proceed directly to the binding cycle with their selected nodes.
     Any remaining unschedulable Pods are returned to the scheduling queue to wait for available resources
     so they can join the already scheduled Pods. 
     
     Furthermore, if new Pods are added to a PodGroup after others have already been scheduled,
     the cycle evaluates the new Pods while accounting for the existing ones.

   * **Failure:** If the scheduler cannot find enough resources to make the PodGroup feasible
     (e.g., failing to meet the `minCount` constraint), the entire PodGroup is considered unschedulable.
     No Pods are bound, but instead, all are returned to the scheduling queue.
     Standard scheduling backoff logic applies, allowing the PodGroup to be retried later.

By using this single-cycle approach, the scheduler avoids inefficient bottlenecks
where partially scheduled groups reserve cluster capacity while waiting indefinitely for the rest of their group to fit.

## PodGroup scheduling algorithm

The default PodGroup scheduling algorithm relies heavily on the baseline Pod-based scheduling algorithm.
It iterates over the Pods and performs the following for each:

1. Finds a feasible node using the standard per-Pod filtering and scoring phases.
   
   * If the Pod fits, it is temporarily assumed and reserved on the selected node until the end of the scheduling algorithm.
   * If the Pod cannot fit, the scheduler attempts preemption by running the `PostFilter` extension point.

2. Checks whether the schedulable Pods meet the group's scheduling criteria
   (e.g., the `minCount` for [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)) using the `Permit` extension point.
   If it returns a `Success` status for any Pod, the PodGroup is deemed feasible.
   If the algorithm processes all Pods without achieving a `Success` status, the PodGroup is considered unschedulable.

## Placement scheduling algorithm
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

Placement scheduling algorithm is an alternative PodGroup scheduling algorithm, which uses
[scheduling plugins](/docs/reference/scheduling/config/#scheduling-plugins) to find the optimal
placement for the considered PodGroup. Users can accomodate the algorithm to their specific needs
by using and configuring plugins.

The algorithm proceeds in three main phases for a given PodGroup:

### Phase 1: Candidate placement generation

Generates candidate *placements* (subsets of nodes, that are theoretically feasible for PodGroup
assignment), for example based on the PodGroup's scheduling constraints (which can be defined
in the PodGroup object).

This phase executes as extension point: `PlacementGeneratePlugin`.

### Phase 2: Pod-level filtering and feasibility check

Validates each proposed placement, by running a default PodGroup scheduling algorithm, to see if
the required number of Pods from the PodGroup can fit. If they can, the placement is marked as feasible.

### Phase 3:  Placement scoring and selection

Scores all feasible placements to select the optimal domain for the PodGroup.

This phase executes as extension point: `PlacementScorePlugin`.

### Limitations

The PodGroup scheduling algorithm relies on specific Pod sorting and may fail to find a valid placement
that could have been discovered by processing the group's Pods in a different order. In particular:

* For basic **homogeneous** Pod groups (i.e., those where all Pods have identical scheduling requirements
  and lack inter-Pod dependencies like affinity, anti-affinity, or topology spread constraints),
  the algorithm is expected to find a placement if one exists.

* For **heterogeneous** Pod groups, finding a valid placement is not guaranteed.

* For Pod groups with **inter-Pod dependencies**, finding a valid placement is not guaranteed.

In addition to the above, for cases involving **intra-group dependencies**
(e.g., when the schedulability of one Pod depends on another group member via inter-Pod affinity),
this algorithm may fail to find a placement regardless of cluster state due to its deterministic processing order.

For consistent behavior throughout the entire cycle, the algorithm requires that all Pods belonging to a single PodGroup
share the same `.spec.schedulerName`. This requirement is validated before the cycle starts,
and the PodGroup is rejected if the constraint is not met.

## PodGroup conditions

After a PodGroup scheduling cycle completes, the scheduler updates conditions on the
PodGroup's `status.conditions`:

* `PodGroupScheduled`: reports whether the PodGroup has been successfully scheduled.
* `DisruptionTarget`: indicates the PodGroup is about to be terminated due to a
  disruption such as preemption.

### `PodGroupScheduled`

When the scheduling cycle succeeds, the condition is set to `True` with reason
`Scheduled`. For `gang` policy PodGroups, this means at least `minCount` Pods were
placed.

When scheduling fails, the condition is set to `False` with one of the following
reasons:

* `Unschedulable` — the group could not be placed due to resource constraints,
  affinity or anti-affinity rules, or insufficient capacity for the gang.
* `SchedulerError` — scheduling failed because of an internal scheduler error
  (for example, while parsing scheduling constraints such as `nodeAffinity`).

### `DisruptionTarget`

When the scheduler preempts a PodGroup to make room for higher-priority PodGroups or
Pods, it sets this condition to `True` with reason `PreemptionByScheduler`.

You can check conditions with:

```shell
kubectl get podgroup <name> -o jsonpath='{.status.conditions}'
```

## {{% heading "whatsnext" %}}

* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* See how to [reference a Workload](/docs/concepts/workloads/pods/workload-reference/) in a Pod.
* Read about [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/).
