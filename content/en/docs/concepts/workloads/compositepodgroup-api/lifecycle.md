---
title: CompositePodGroup Lifecycle
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="CompositePodGroup" >}}

A [CompositePodGroup](/docs/concepts/workloads/compositepodgroup-api/) represents a non-leaf node
in a multi-level workload hierarchy. It carries scheduling policies for its child groups and is
protected from premature deletion while its constituent Pods are running.

<!-- body -->

## Ownership and garbage collection

`CompositePodGroup` objects, together with their descendant `CompositePodGroup` and `PodGroup`
objects, are owned by the workload controller that created them via Kubernetes `ownerReferences`.
When the parent workload object is deleted, cascading garbage collection automatically deletes the
associated `CompositePodGroup` and `PodGroup` resources.

`CompositePodGroup` names must be unique within a namespace and must be valid
[DNS subdomains](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

## Creation ordering

To ensure proper hierarchy resolution and scheduling, workload controllers create resources in a
top-down order:

1. **`Workload`**: Defines static templates (`CompositePodGroupTemplates` and `PodGroupTemplates`).
2. **Root `CompositePodGroup`**: Created with `spec.workloadRef` pointing to the root template in
   the `Workload`.
3. **Descendant `CompositePodGroups` and `PodGroups`**: Created top-down. Each child specifies its
   parent by using `spec.parentCompositePodGroupName` and its template using `spec.workloadRef`.
4. **`Pods`**: Created with `spec.schedulingGroup.podGroupName` pointing to their leaf `PodGroup`.

If a group references a parent `CompositePodGroup` that does not exist, or if a Pod references
a `PodGroup` that has not yet been created, the scheduler holds off scheduling until all parent
resources in the hierarchy exist.

## Deletion protection

Like leaf `PodGroups`, a `CompositePodGroup` cannot be fully garbage collected while any of its
descendant Pods are still active. Kubernetes finalizers ensure that groups remain in the cluster
until all Pods within the subtree reach a terminal phase (`Succeeded` or `Failed`).

## Controller-managed and user-managed groups

In most cases, workload controllers manage the lifecycle of `CompositePodGroup` and `PodGroup`
objects automatically (**controller-managed**). The controller establishes the group hierarchy
by setting `spec.parentCompositePodGroupName` on child groups and
`spec.schedulingGroup.podGroupName` on Pods at creation.

If you need explicit control over naming, hierarchy depth, or group creation timing, you can create
`CompositePodGroup` and `PodGroup` resources directly (**user-managed**) and populate the parent
and group references in your Pod manifests manually.

## Limitations and validation rules

- **Consistent scheduler name**: All Pods across an entire `CompositePodGroup` hierarchy must use the same
  `spec.schedulerName`. If a mismatch is detected, the scheduler rejects the hierarchy as
  unschedulable.
- **Maximum nesting depth**: The group-template hierarchy supports a maximum depth of 4 levels.
- **List item limit**: The maximum number of `CompositePodGroupTemplates` or `PodGroupTemplates` at any
  level of a `Workload` is 8.
- **Immutable gang group count**: The `spec.schedulingPolicy.gang.minGroupCount` field on a
  `CompositePodGroup` is immutable after creation.
- **Immutable hierarchy references**: `spec.parentCompositePodGroupName` on groups and
  `spec.schedulingGroup` on Pods are immutable once set.

## {{% heading "whatsnext" %}}

* Read the [CompositePodGroup API](/docs/concepts/workloads/compositepodgroup-api/) overview.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/) and template definitions.
* See how leaf groups are structured in the [PodGroup API](/docs/concepts/workloads/podgroup-api/).
* Read about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* Learn about [Workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
