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

This feature depends on the [Workload API](/docs/concepts/workloads/workload-api/).
Ensure the [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
feature gate and the `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} are enabled in the cluster.

<!-- body -->

## How it works

When the `GangScheduling` plugin is enabled, the scheduler alters the lifecycle for Pods belonging
to a `gang` [pod group policy](/docs/concepts/workloads/workload-api/policies/) within
a [Workload](/docs/concepts/workloads/workload-api/).
The process follows these steps independently for each pod group and its replica key:

1. The scheduler holds Pods in the `PreEnqueue` phase until:
   * The referenced Workload object is created.
   * The referenced pod group exists in a Workload.
   * The number of Pods that have been created for the specific group
     is at least equal to the `minCount`.

   Pods do not enter the active scheduling queue until all of these conditions are met.

2. Once the quorum is met, the scheduler attempts to find placements for all Pods in the group.
   All assigned Pods wait at the `WaitOnPermit` gate during this process.
   Note that in the Alpha phase of this feature, finding a placement is based on pod-by-pod scheduling,
   rather than a single-cycle approach.

3. If the scheduler finds valid placements for at least `minCount` Pods,
   it allows all of them to be bound to their assigned nodes. If it cannot find placements for the entire group
   within a fixed timeout of 5 minutes, none of the Pods are scheduled.
   Instead, they are moved to the unschedulable queue to wait for cluster resources to free up,
   allowing other workloads to be scheduled in the meantime.

## {{% heading "whatsnext" %}}

* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* See how to [reference a Workload](/docs/concepts/workloads/pods/workload-reference/) in a Pod.
