---
title: CompositePodGroup Lifecycle
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="CompositePodGroup" >}}

A [CompositePodGroup](/docs/concepts/workloads/compositepodgroup-api/) represents a non-leaf node
in a multi-level `PodGroup` hierarchy. Unlike `PodGroup` resources, `CompositePodGroup` resources do
not directly contain Pods. Instead, they maintain a hierarchy of descendant `CompositePodGroup` and
`PodGroup` objects and carry scheduling policies that apply to its children groups.

<!-- body -->

## Ownership and garbage collection

A `CompositePodGroup` object, together with its descendant `CompositePodGroup` and `PodGroup`
resources, is owned by the workload controller that created it via Kubernetes `ownerReferences`.
When the owning workload object gets deleted, cascading garbage collection automatically deletes the
associated group hierarchy.

`CompositePodGroup` names must be unique within a namespace and must be valid
[DNS subdomains](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

## Creation ordering

To ensure proper hierarchy resolution and scheduling, workload controllers create resources in a
top-down order:

1. **`Workload`**: Defines static templates (`CompositePodGroupTemplates` and `PodGroupTemplates`).
2. **Root `CompositePodGroup`**: Created with `spec.workloadRef` pointing to the root template in
   the `Workload`.
3. **Descendant `CompositePodGroups` and `PodGroups`**: Created top-down. Each child group specifies
   its parent by using `spec.parentCompositePodGroupName` and its template using `spec.workloadRef`.
4. **`Pods`**: Created with `spec.schedulingGroup.podGroupName` pointing to their leaf `PodGroup`.

If a group references a parent `CompositePodGroup` that does not exist, or if a Pod references
a `PodGroup` that has not yet been created, the scheduler holds off scheduling until all parent
resources in the hierarchy exist.

## Deletion protection

A `CompositePodGroup` cannot be fully deleted while any of its child groups still exist. A dedicated
finalizer ensures that deletion is blocked until all groups referencing the `CompositePodGroup` have
been deleted.

## Limitations and validation rules

### API validation and limits

`kube-apiserver` enforces the following constraints at creation or update time:

- **List item limit**: Each `compositePodGroupTemplates` and `podGroupTemplates` list at any level
  of a `Workload` is capped at a maximum of 8 items.
- **Required Workload reference**: Every `CompositePodGroup`, as well as any `PodGroup` that sets
  `spec.parentCompositePodGroupName`, must specify `spec.workloadRef`.
- **Immutable hierarchy references**: `spec.parentCompositePodGroupName` and `spec.workloadRef` on
  groups, as well as `spec.schedulingGroup` on Pods, are immutable after creation.
- **Compatibility of disruption mode and scheduling policy**: A `CompositePodGroup`, `PodGroup`
  or a group template with the `basic` scheduling policy cannot specify the `all` disruption mode.

`kube-apiserver` also validates priority consistency, preemption policy consistency, parent-child
configuration constraints, and the maximum nesting depth of 5 levels (up to 4 levels of
`CompositePodGroupTemplate` plus the leaf `PodGroupTemplate` level) on `Workload` templates at
creation time.

### Runtime hierarchy validation

Before scheduling a `CompositePodGroup` hierarchy, `kube-scheduler` validates the following rules
across all runtime objects in the hierarchy:

- **Consistent scheduler name**: All Pods across an entire `CompositePodGroup` hierarchy must use
  the same `spec.schedulerName`.
- **Consistent priority**: All Pods and all groups across an entire `CompositePodGroup` hierarchy
  must specify the same value of `spec.priority`.
- **Parent-child configuration constraints**: Child groups of a `CompositePodGroup` with the `gang`
  scheduling policy must have the `gang` scheduling policy as well. Similarly, child groups of a
  `CompositePodGroup` with the `all` disruption mode must have the `all` disruption mode as well.
- **Consistent Workload references**: All groups in a group hierarchy must refer to the same
  `Workload` object in the `spec.workloadRef.workloadName` field.
- **Consistent preemption policy**: All Pods and all groups across an entire `CompositePodGroup`
  hierarchy must specify the same `spec.preemptionPolicy`.
- **Maximum nesting depth**: Runtime group hierarchies support a maximum depth of 5 levels (up to 4
  levels of `CompositePodGroup` plus the leaf `PodGroup` level).

If `kube-scheduler` detects any of these runtime validation violations, it refrains from scheduling
the hierarchy. It sets the
[`CompositePodGroupInitiallyScheduled`](/docs/concepts/scheduling-eviction/podgroup-scheduling/#compositepodgroup-conditions)
condition to `False` with reason `CompositePodGroupError` on `CompositePodGroup` objects and the
[`PodGroupInitiallyScheduled`](/docs/concepts/scheduling-eviction/podgroup-scheduling/#podgroup-conditions)
condition to `False` with reason `PodGroupError` on `PodGroup` objects in the hierarchy.

## {{% heading "whatsnext" %}}

* Read the [CompositePodGroup API](/docs/concepts/workloads/compositepodgroup-api/) overview.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/) and template definitions.
* See how leaf groups are structured in the [PodGroup API](/docs/concepts/workloads/podgroup-api/).
* Read about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* Learn about [Workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
