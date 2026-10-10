---
title: Gang Scheduling
content_type: concept
weight: 70
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Gang scheduling ensures that a group of Pods are scheduled on an "all-or-nothing" basis.
If the cluster cannot accommodate the entire group (or a defined minimum number of Pods, specified by `minCount`),
none of the Pods are bound to a node.

{{< note >}}
While the scheduler never admits fewer Pods than the configured `minCount` during initial placement, the actual runtime
count of scheduled Pods can drop below this threshold if running Pods are later deleted or evicted, or if the
`minCount` requirement increases. When this happens, the scheduler will only place additional Pods if the
combined total of already scheduled Pods and newly feasible unscheduled Pods reaches or exceeds `minCount`.
{{< /note >}}

This feature depends on the [PodGroup API](/docs/concepts/workloads/podgroup-api/).
Ensure the [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
feature gate and the `scheduling.k8s.io/v1beta1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} are enabled in the cluster.

<!-- body -->

## How it works

When the `GangScheduling` plugin is enabled, the scheduler alters the lifecycle for Pods belonging
to a [PodGroup](/docs/concepts/workloads/podgroup-api/) that has a `gang`
[scheduling policy](/docs/concepts/workloads/workload-api/policies/).
The process follows these steps for each PodGroup:

1. The scheduler holds Pods in the `PreEnqueue` phase until:
   * The referenced PodGroup object exists.
   * The number of Pods created for the PodGroup (both already scheduled and unscheduled) is at least equal to `minCount`.

   The PodGroup does not enter the active scheduling queue until both conditions are met.

2. Once the quorum is met, the scheduler attempts to find placements for all unscheduled Pods in the group.
   It utilizes the [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/) cycle to make a single,
   atomic scheduling decision. The `GangScheduling` plugin implements a `PlacementFeasible` extension point that is invoked for each
   evaluated Pod during the cycle. This is used to determine whether the `minCount` constraint is satisfied
   by comparing the number of successfully placed Pods (including those already scheduled in previous cycles) against the `minCount` value.

3. If the scheduler finds valid placements for at least the `minCount` number of Pods,
   it allows those successfully placed Pods to be bound to their assigned nodes.
   If it cannot find enough placements to satisfy the `minCount` requirement, none of the Pods are scheduled.
   Instead, they are moved to the unschedulable queue to wait for cluster resources to free up,
   allowing other workloads to be scheduled in the meantime.

## Hierarchical gang scheduling with CompositePodGroups

{{< feature-state feature_gate_name="CompositePodGroup" >}}

When the [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
feature gate and the `scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled, gang scheduling extends its support to `CompositePodGroups`.

Contrary to `PodGroups` that group Pods, `CompositePodGroups` group child groups together - either
`PodGroups` or other `CompositePodGroups`. `CompositePodGroup` specifies a scheduling policy that
applies to its child groups during scheduling:

* `gang` policy with a `minGroupCount` field, specifying the minimum number of child groups (either
  `CompositePodGroup` or `PodGroup` objects) that must be scheduled together as a single unit
  atomically.
* `basic` policy which indicates that child groups can be scheduled independently.

`gang` policy is useful for multi-component workloads that require all-or-nothing scheduling across
multiple child groups, ensuring that a minimum number of child groups are scheduled together. An
example workload with such needs is replicated AI training.

`basic` policy can be used for workloads that comprise multiple groups of Pods each of which can be
scheduled as an independent gang, e.g. for AI inference workloads.

### Hierarchical quorum

The `GangScheduling` plugin holds the root `CompositePodGroup` from entering the active scheduling
queue in the `PreEnqueue` phase until it satisfies the **hierarchical quorum**. This quorum is
evaluated bottom-up, from leaf `PodGroup` objects up to the root `CompositePodGroup`:

- A leaf `PodGroup` **satisfies quorum** if and only if the `PodGroup` object exists and can
  potentially meet its scheduling policy criteria:
  - For a `gang` policy: at least `minCount` of its constituent Pods have been created.
  - For a `basic` policy: at least one of its constituent Pods has been created.
- A `CompositePodGroup` **satisfies quorum** if and only if the `CompositePodGroup` object exists
  and can potentially meet its scheduling policy criteria:
  - For a `gang` policy: at least `minGroupCount` of its direct child groups satisfy quorum.
  - For a `basic` policy: at least one of its direct child groups satisfies quorum.
- The overall **hierarchical quorum** is satisfied if and only if the root `CompositePodGroup`
  satisfies the quorum.

Ultimately, a root `CompositePodGroup` is admitted into the active scheduling queue if and only if
it satisfies the hierarchical quorum and there is at least one pending Pod that belongs to one of
its descendant `PodGroups`.

### Placement feasibility

The `GangScheduling` plugin's `PlacementFeasible` method supports evaluation for both
`PodGroups` and `CompositePodGroups`. It is invoked by the scheduling cycle before starting child
evaluation and after evaluating each child group of a `CompositePodGroup`.

By taking into account the number of child groups that were successfully scheduled and the child
groups that were not evaluated in the scheduling cycle just yet, `PlacementFeasible` determines
whether the group's policy constraint is still achievable, allowing the scheduling cycle to abort
the evaluation of the `CompositePodGroup` early if its underlying scheduling policy cannot be
satisfied anymore.

## {{% heading "whatsnext" %}}

* Learn about the [PodGroup API](/docs/concepts/workloads/podgroup-api/) and its [lifecycle](/docs/concepts/workloads/podgroup-api/lifecycle/).
* Read about the [CompositePodGroup API](/docs/concepts/workloads/compositepodgroup-api/).
* Read about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* Read about [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
