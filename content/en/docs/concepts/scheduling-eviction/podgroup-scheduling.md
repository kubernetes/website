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
Ensure the `scheduling.k8s.io/v1beta1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} is enabled in the cluster.

<!-- body -->

## PodGroup scheduling cycle

To support scheduling a group of Pods together, the kube-scheduler uses the **PodGroup scheduling cycle**.
Instead of processing Pods individually and holding them at a `WaitOnPermit` gate,
the scheduler evaluates the entire group of pending Pods belonging to a specific PodGroup collectively.
Rather than executing separate scheduling cycles for each Pod,
it evaluates feasibility for the entire group and moves directly to the binding phase afterwards.

When observing a Pod belonging to a PodGroup, the scheduler associates the Pod with that PodGroup rather than adding it directly to the scheduling queue.
A PodGroup does not enter the scheduling queue until the scheduler observes both the PodGroup object and at least one Pod belonging to it.
When the scheduler pops a PodGroup, it retrieves all observed unscheduled Pods in that group.
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
     Any remaining unschedulable Pods in the group are requeued directly into the active scheduling queue without backoff, retaining their previous timestamp so they are re-evaluated immediately to attempt preemption.
     
     Furthermore, if new Pods are added to a PodGroup after others have already been scheduled,
     the cycle evaluates the new Pods while accounting for the existing ones.

   * **Failure:** If the scheduler cannot find enough resources to make the PodGroup feasible
     (e.g., failing to meet the `minCount` constraint), the entire PodGroup is considered unschedulable.
     
     The scheduler attempts to make a PodGroup schedulable by running the `PodGroupPostFilter` extension point.
     The `DefaultPreemption` plugin's `PodGroupPostFilter` extenion point runs
     [workload aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
     If any plugin implementing `PodGroupPostFilter`extension point returns `Success`, no more
     plugins for `PodGroupPostFilter` extension point are run.
     
     Even when `PodGroupPostFilter` plugin returns a `Success`, no Pods are bound, but instead,
     all are returned to the scheduling queue, hoping that the actions taken by `PodGroupPostFilter`
     make a PodGroup schedulable in the next scheduling cycle. Standard scheduling backoff logic applies,
     allowing the PodGroup to be retried later.

By using this single-cycle approach, the scheduler avoids inefficient bottlenecks
where partially scheduled groups reserve cluster capacity while waiting indefinitely for the rest of their group to fit.

## PodGroup scheduling algorithm

The default PodGroup scheduling algorithm relies heavily on the baseline Pod-based scheduling algorithm.
It iterates over the Pods and performs the following for each:

1. Finds a feasible node using the standard per-Pod filtering and scoring phases.

   * If the Pod fits, it is temporarily assumed and reserved on the selected node until the end of the scheduling algorithm.
   * If the Pod cannot fit, the scheduler does not run the `PostFilter` extension point.
     Instead it relies on `PodGroupPostFilter` extension point executed for the whole PodGroup.

2. Checks whether the schedulable Pods meet the group's scheduling criteria
   (e.g., the `minCount` for [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)) by invoking the `PlacementFeasible` extension point after evaluating each Pod in the group against the cumulative scheduling results.
   If it returns a `Success` status for any Pod, the PodGroup is deemed feasible.
   If the algorithm processes all Pods without achieving a `Success` status, or if no Pods are scheduled during this cycle, the PodGroup is considered unschedulable.

## Placement scheduling algorithm
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

Placement scheduling algorithm is an alternative PodGroup scheduling algorithm, which uses
[scheduling plugins](/docs/reference/scheduling/config/#scheduling-plugins) to find the optimal
placement for the considered PodGroup. Users can accommodate the algorithm to their specific needs
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

## Hierarchical scheduling with CompositePodGroups

{{< feature-state feature_gate_name="CompositePodGroup" >}}

When the [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
feature gate and the `scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled, the scheduler extends the PodGroup scheduling cycle to support multi-level group
hierarchies.

In a hierarchical workload, Pods belong to leaf `PodGroup` objects, which in turn specify parent
`CompositePodGroup` resources up to the root `CompositePodGroup`. The scheduler evaluates the entire
hierarchy of groups as a single, unified scheduling unit.

### Hierarchical scheduling cycle execution

After observing a root `CompositePodGroup`, the scheduler places it in the scheduling queue as long
as there is at least one pending Pod that belongs to that root's group hierarchy.

Once the root `CompositePodGroup` satisfies the
[hierarchical quorum](/docs/concepts/scheduling-eviction/gang-scheduling/#Hierarchical-quorum), it
enters the active scheduling queue from which it can be popped by the scheduling cycle. The flow of
the scheduling cycle for `CompositePodGroups` is as follows:

1. **Unified cluster snapshot and validation**: The scheduler takes a snapshot of cluster resources
   to mirror the latest observed cluster state. It verifies that the shape of the group hierarchy
   popped from the queue matches the snapshotted hierarchy and validates the configuration
   consistency of the hierarchy (such as identical `.spec.schedulerName` and priority across member
   Pods).
   
   If the hierarchy shape changed concurrently or fails the validation, the cycle halts and requeues
   the root `CompositePodGroup`.

2. **Top-down candidate placement generation**: At each level of the hierarchy, before evaluating
   child groups, the scheduler invokes `PlacementGeneratePlugin` plugins to generate candidate
   placements (subsets of nodes) for the group being evaluated.
   
   Candidate placements for a child `CompositePodGroup` or leaf `PodGroup` are generated exclusively
   from the subset of nodes belonging to the parent group's currently evaluated placement. For the
   root `CompositePodGroup`, candidate placements are generated across all available cluster nodes.

3. **Recursive subtree simulation and feasibility check**: The scheduler evaluates each candidate
   placement for a `CompositePodGroup` by temporarily assuming that placement in the cluster
   snapshot and recursively scheduling its child groups:
   * **Recursive traversal**: The scheduler traverses child groups in a pre-sorted order, invoking
     itself recursively from the `CompositePodGroup` down to leaf `PodGroup` objects. For each leaf
     `PodGroup`, the scheduler runs the placement scheduling algorithm scoped to the parent's
     candidate placement to make tentative Pod assignments in memory.
   * **Feasibility checks**: After evaluating each child group, the scheduler invokes
     `PlacementFeasible` plugins to determine whether the parent group's scheduling policy can
     still be met:
     * If the policy constraints remain achievable (or are already satisfied), the scheduler continues
       evaluating subsequent sibling groups.
     * If the policy constraints can no longer be satisfied, the scheduler immediately aborts the evaluation
       of that `CompositePodGroup` and reverts all tentative in-memory Pod assignments made for that group.
   * **Simulation rollback**: After simulating a candidate placement (regardless of success or failure),
     the scheduler reverts the tentative node reservations made during that simulation before
     evaluating the next candidate placement.

4. **Placement scoring and subtree commitment**: Once all candidate placements for a
   `CompositePodGroup` have been evaluated:
   * **Scoring**: If one or more candidate placements are feasible, the scheduler invokes
     `PlacementScorePlugin` plugins to score all feasible candidate placements. The scoring plugins
     evaluate the combined proposed Pod assignments across all descendant leaf `PodGroup` objects in
     the subtree and select the placement with the highest overall score.
   * **Commitment**: After selecting the winning placement, the scheduler commits (assumes) the
     tentative Pod assignments corresponding to that optimal placement in memory. This ensures that
     subsequent sibling group evaluations or parent-level evaluations observe consistent, optimal
     scheduling decisions for that subtree.
     
     If no feasible placement is found among all generated candidates, the entire `CompositePodGroup`
     is considered unschedulable.

5. **Atomic binding**: If the root-level recursive evaluation succeeds and at least one Pod was
   successfully scheduled, the scheduler commits the Pod assignments by proceeding to the binding
   cycle.

   Otherwise, the entire `CompositePodGroup` is considered unschedulable.

### Limitations

Similar to how the PodGroup scheduling algorithm relies on specific Pod sorting, the hierarchical
scheduling algorithm relies on a specific sorting of child groups within every `CompositePodGroup`
hierarchy. As a result, it may fail to find a valid placement that could have been discovered by
processing the child groups in a different order.

In addition, because the scheduler evaluates group hierarchies using a greedy approach:

* Finding a valid placement is not guaranteed in all cases, even if one exists in the cluster.
* Even when the scheduler successfully finds a valid placement for a `CompositePodGroup` hierarchy,
  that placement is not guaranteed to be optimal across the cluster.

## PodGroup conditions

After a PodGroup scheduling cycle completes, the scheduler updates conditions on the
PodGroup's `status.conditions`:

* `PodGroupInitiallyScheduled`: reports whether the PodGroup has been successfully scheduled for the first time.

### `PodGroupInitiallyScheduled`

When the scheduling cycle succeeds, the condition is set to `True` with reason
`Scheduled`. For `gang` policy PodGroups, this means at least `minCount` Pods were
placed.

When scheduling fails, the condition is set to `False` with one of the following
reasons:

* `Unschedulable` — the group could not be placed due to resource constraints,
  affinity or anti-affinity rules, or insufficient capacity for the gang.
* `SchedulerError` — scheduling failed because of an internal scheduler error
  (for example, while parsing scheduling constraints such as `nodeAffinity`).

Once this condition is set to `True`, it never changes.

You can check conditions with:

```shell
kubectl get podgroup <name> -o jsonpath='{.status.conditions}'
```

## CompositePodGroup conditions

{{< feature-state feature_gate_name="CompositePodGroup" >}}

CompositePodGroup API exposes the `status.conditions` field as well.

In v1.37, the scheduler does not populate this field, however.

## {{% heading "whatsnext" %}}

* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* Read about the [CompositePodGroup API](/docs/concepts/workloads/compositepodgroup-api/) and its [lifecycle](/docs/concepts/workloads/compositepodgroup-api/lifecycle/).
* Learn about [Topology-aware workload scheduling](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* See how to [reference a Workload](/docs/concepts/workloads/pods/workload-reference/) in a Pod.
* Read about [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/).
