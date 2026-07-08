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

## {{% heading "whatsnext" %}}

* See the [PodGroup API](/docs/concepts/workloads/podgroup-api/) for how policies are carried at runtime.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/) that defines PodGroupTemplates.
* Read about [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
* Read about the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
