---
title: PodGroup Scheduling Policies
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Every [PodGroup](/docs/concepts/workloads/podgroup-api/) must declare a scheduling policy
in its `spec.schedulingPolicy` field. This policy dictates how the scheduler treats the
collection of Pods in the group.

<!-- body -->

## Policy types

The `schedulingPolicy` field supports two policy types: `basic` and `gang`.
You must specify exactly one.

### Basic policy

The `basic` policy instructs the scheduler to evaluate all Pods on a best-effort basis.
Unlike the `gang` policy, a PodGroup using the `basic` policy is considered feasible
regardless of how many of its Pods are currently schedulable.

The primary reason to use the `basic` policy is to organize Pods into a group for better
observability and management, while still evaluating them together within a single, atomic
[PodGroup scheduling cycle](/docs/concepts/scheduling-eviction/podgroup-scheduling/#podgroup-scheduling-cycle).

This policy is suited for groups that do not require simultaneous startup but logically
belong together, or to open the way for group-level constraints that do not imply
"all-or-nothing" placement.

```yaml
schedulingPolicy:
  basic: {}
```

### Gang policy

The `gang` policy enforces "all-or-nothing" scheduling. This is essential for tightly-coupled
workloads where partial startup results in deadlocks or wasted resources.

This can be used for [Jobs](/docs/concepts/workloads/controllers/job/)
or any other batch process where all workers must run concurrently to make progress.

The `gang` policy requires a `minCount` field, which is the minimum number of Pods that must be
schedulable simultaneously for the group to be feasible:

```yaml
schedulingPolicy:
  gang:
    # The number of Pods that must be schedulable simultaneously
    # for the group to be admitted.
    minCount: 4
```

## Setting policies via PodGroupTemplates

When using the [Workload API](/docs/concepts/workloads/workload-api/), you define scheduling
policies inside `PodGroupTemplates`. The workload controller copies the policy from the
template into each PodGroup it creates, making the PodGroup self-contained. Changes to the
Workload's templates only affect newly created PodGroups, not existing ones.

For standalone PodGroups (created without a Workload), you set `spec.schedulingPolicy`
directly on the PodGroup itself.

## Policies in CompositePodGroups

{{< feature-state feature_gate_name="CompositePodGroup" >}}

When the [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
feature gate and the `scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled, `CompositePodGroupTemplates` in a Workload and the `CompositePodGroup` objects also
declare a scheduling policy.

While a scheduling policy in a `PodGroup` governs a collection of individual Pods, a
`CompositePodGroup` scheduling policy governs its direct **child groups** (which can be both
`CompositePodGroup` and `PodGroup` objects).

### Policy types for CompositePodGroups

Similar to `PodGroups`, the `spec.schedulingPolicy` field of a `CompositePodGroup` supports two
types:

- **`basic`**: Child groups within the `CompositePodGroup` are evaluated and admitted independently.
- **`gang`**: Enforces multi-level all-or-nothing scheduling across child groups. The
  `CompositePodGroup` is schedulable only if at least `minGroupCount` child groups can be scheduled
  simultaneously.

```yaml
schedulingPolicy:
  gang:
    # The minimum number of child groups that must be schedulable
    # simultaneously for this composite group to be admitted.
    minGroupCount: 2
```

### Setting composite policies via templates

When using the [Workload API](/docs/concepts/workloads/workload-api/), scheduling policies for
`CompositePodGroups` are defined inside `CompositePodGroupTemplates`. Workload controllers copy the
`schedulingPolicy` specified in the templates into each `CompositePodGroup` created at runtime.
Unlike leaf `PodGroupTemplates` where `minCount` can be updated, `minGroupCount` in a
`CompositePodGroupTemplate` is immutable.

## {{% heading "whatsnext" %}}

* See the [PodGroup API](/docs/concepts/workloads/podgroup-api/) for how policies are carried at runtime.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/) that defines PodGroupTemplates.
* Read about [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
* Read about the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
