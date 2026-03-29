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

This feature depends on the [PodGroup API](/docs/concepts/workloads/podgroup-api/) and the
[Workload API](/docs/concepts/workloads/workload-api/).
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
   * The referenced `PodGroup` object exists.
   * The number of `Pods` created for the `PodGroup` is at least equal to `minCount`.

   `Pods` do not enter the active scheduling queue until both conditions are met.

2. Once the quorum is met, the scheduler attempts to find placements for all Pods in the group.
 All assigned `Pods` wait at the `WaitOnPermit` gate during this process.

3. If the scheduler finds valid placements for at least `minCount` Pods,
 it allows all `Pods` of them to bind to their assigned nodes. If it cannot place the minimum number within
   a fixed timeout of 5 minutes, none of the Pods are scheduled. Instead, they are moved
   to the unschedulable queue to wait for cluster resources to free up, allowing other
   workloads to be scheduled in the meantime.

## PodGroupScheduled condition

After the gang scheduling attempt completes, the scheduler updates the
`PodGroupScheduled` condition on the PodGroup:

* `True` — at least `minCount` Pods were successfully placed.
* `False` with reason Unschedulable — the group could not be placed due to
  resource constraints or scheduling rules.

You can check the condition with:

```shell
kubectl get podgroup <name> -o jsonpath='{.status.conditions}'
```

## {{% heading "whatsnext" %}}

* Learn about the [PodGroup API](/docs/concepts/workloads/podgroup-api/) and its [lifecycle](/docs/concepts/workloads/podgroup-api/lifecycle/).
* See how Pods reference their PodGroup via the [scheduling group](/docs/concepts/workloads/pods/scheduling-group/) field.
* Read about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/) (`basic` and `gang`).
