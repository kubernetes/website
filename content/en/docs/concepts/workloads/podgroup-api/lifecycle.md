---
title: PodGroup Lifecycle
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

A [PodGroup](/docs/concepts/workloads/podgroup-api/) is scheduled as a unit and protected
from premature deletion while its Pods are still running.

<!-- body -->

## Ownership and lifecycle

`PodGroups` are owned by the workload controller that created them (for example, a Job)
via standard `ownerReferences`. When the owning object is deleted, `PodGroups` are
automatically garbage collected.

`PodGroup` names must be unique within a namespace and must be valid
[DNS subdomains](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

## Creation ordering

Controllers must create objects in this order:

1. `Workload` — the scheduling policy template.
2. `PodGroup` — the runtime instance.
3. `Pods` — with `spec.schedulingGroup.podGroupName` pointing to the `PodGroup`.

If a `PodGroup` includes a `podGroupTemplateRef` that points to a `Workload` that does
not exist (or is being deleted), the API server rejects the `PodGroup` creation request.
The referenced `Workload` must exist before the `PodGroup` can be created.

If a `Pod` references a `PodGroup` that does not yet exist, the `Pod` remains pending.
The scheduler automatically queues the `Pod` for scheduling once the `PodGroup` is created.

## Deletion protection

A `PodGroup` cannot be fully deleted while any of its Pods are still running.
A dedicated finalizer ensures that deletion is blocked until all `Pods` referencing the
`PodGroup` have reached a terminal phase (`Succeeded` or `Failed`).

## Controller-managed and user-managed PodGroups

In most cases, workload controllers (for example, Job) create `PodGroups` automatically
(controller-managed). The controller determines the `podGroupName` for each Pod
at creation time, similar to how a `DaemonSet` sets node affinity per Pod.

If you need more control over naming and lifecycle, you can create `PodGroup` objects directly and set
`spec.schedulingGroup.podGroupName` in your Pod templates yourself
(user-managed). This gives you full control over `PodGroup` creation and naming.

## Limitations

* All Pods in a `PodGroup` must use the same `.spec.schedulerName`.
  If a mismatch is detected, the scheduler rejects all Pods in the group as unschedulable.
* The `spec.schedulingPolicy.gang.minCount` field on a PodGroup is immutable.
  Once created, you cannot change the minimum number of Pods that must be schedulable for the group to be admitted.
* The `spec.schedulingGroup` field on a Pod is immutable.
  Once set, a Pod cannot move to a different PodGroup.
* The maximum number of `PodGroupTemplates` in a single `Workload` is 8.
* The `PodGroupScheduled` condition reflects the outcome of the initial scheduling
  attempt only. Once the condition is set to `True`, the scheduler does not update it
  if Pods later fail, are evicted, or stop running.

## {{% heading "whatsnext" %}}

* Learn about the [PodGroup API](/docs/concepts/workloads/podgroup-api/) overview and structure.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/) that provides `PodGroupTemplates`.
* See how Pods reference their PodGroup via the [scheduling group](/docs/concepts/workloads/pods/scheduling-group/) field.
* Understand the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
* Read [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/) for details on `basic` and `gang`.
