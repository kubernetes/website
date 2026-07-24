---
title: Gang Scheduling
content_type: concept
weight: 70
---

<!-- overview -->
{{< feature-state feature_gate_name="GangScheduling" >}}

Gang scheduling ensures that a group of Pods are scheduled on an "all-or-nothing" basis.
If the cluster cannot accommodate the entire group (or a defined minimum number of Pods),
none of the Pods are bound to a node.

This feature depends on the [PodGroup API](/docs/concepts/workloads/podgroup-api/).
Ensure the  [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
feature gate and the `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API group" term_id="api-group" >}} are enabled in the cluster.

<!-- body -->

## How it works

When the `GangScheduling` plugin is enabled, the scheduler alters the lifecycle for Pods belonging
to a [PodGroup](/docs/concepts/workloads/podgroup-api/) that has a `gang`
[scheduling policy](/docs/concepts/workloads/workload-api/policies/).
The process follows these steps for each PodGroup:

1. The scheduler holds Pods in the `PreEnqueue` phase until:
   * The referenced PodGroup object exists.
   * The number of `Pods` created for the `PodGroup` is at least equal to `minCount`.

   `Pods` do not enter the active scheduling queue until both conditions are met.

2. Once the quorum is met, the scheduler attempts to find placements for all Pods in the group.
   It utilizes the [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/) cycle to make a single,
   atomic scheduling decision. `GangScheduling` plugin implements a `Permit` extension point that is evaluated for each
   schedulable Pod during the cycle. This is used to determine whether the `minCount` constraint is satisfied,
   by comparing the number of successfully placed pods against the `minCount` value.

3. If the scheduler finds valid placements for at least the `minCount` number of Pods,
   it allows those successfully placed Pods to be bound to their assigned nodes.
   If it cannot find enough placements to satisfy the `minCount` requirement, none of the Pods are scheduled.
   Instead, they are moved to the unschedulable queue to wait for cluster resources to free up,
   allowing other workloads to be scheduled in the meantime.

## Hierarchical gang scheduling with CompositePodGroups

{{< feature-state feature_gate_name="CompositePodGroup" >}}

When the [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
feature gate and the `scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled, gang scheduling extends to multi-level group hierarchies.

While single-level gang scheduling enforces all-or-nothing semantics across Pods in a single
`PodGroup`, hierarchical gang scheduling treats entire child groups as members of a gang.

### How multi-level gang scheduling works

1. **Composite gang policy**: A parent `CompositePodGroup` defines a `gang` policy with a
   `minGroupCount` field, specifying the minimum number of child groups (either `CompositePodGroup`
   or `PodGroup` objects) that must be schedulable simultaneously.

2. **Hierarchical quorum evaluation**:
   - The scheduler holds Pods in `PreEnqueue` until the entire group hierarchy exists and
     each `PodGroup` meets its `minCount` Pod requirement.
   - During the scheduling cycle, the scheduler recursively evaluates feasibility across the group
     tree. A parent `CompositePodGroup` is admitted only if at least `minGroupCount` of its child
     groups satisfy their respective scheduling policies and placement constraints.

3. **Atomic group admission**: If the `minGroupCount` constraint is met at the composite level
   and all underlying leaf `PodGroups` satisfy their `minCount` requirements, all placed Pods
   across the admitted sub-groups are bound to nodes together. Otherwise, none of the Pods in the
   composite hierarchy are bound.

## {{% heading "whatsnext" %}}

* Learn about the [PodGroup API](/docs/concepts/workloads/podgroup-api/) and its [lifecycle](/docs/concepts/workloads/podgroup-api/lifecycle/).
* Read about the [CompositePodGroup API](/docs/concepts/workloads/compositepodgroup-api/).
* Read about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* Read about [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
