---
title: PodGroup Scheduling Policies
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Every PodGroupTemplate defined in a [Workload](/docs/concepts/workloads/workload-api/)
must declare a scheduling policy. This policy dictates how the scheduler treats the
collection of Pods in a [PodGroup](/docs/concepts/workloads/podgroup-api/).

<!-- body -->

## Policy types

The `schedulingPolicy` field supports two policy types: `basic` and `gang`.
You must specify exactly one policy for each PodGroupTemplate.

### Basic policy

The `basic` policy instructs the scheduler to treat all Pods in the group as independent entities, 
scheduling them using the standard Kubernetes behavior.

The main reason to use the `basic` policy is to organize the Pods within your Workload
for better observability and management.

This policy can be used for groups of a Workload that do not require simultaneous startup
but logically belong to the application, or to open the way for future group-level constraints
that do not imply "all-or-nothing" placement.

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
schedulable simultaneously for the group to be admitted:

```yaml
schedulingPolicy:
  gang:
    # The number of Pods that must be schedulable simultaneously
    # for the group to be admitted.
    minCount: 4
```

## {{% heading "whatsnext" %}}

* Learn about the [Workload API](/docs/concepts/workloads/workload-api/) that defines PodGroupTemplates.
* See the [PodGroup API](/docs/concepts/workloads/podgroup-api/) for how policies are carried at runtime.
* Read about the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
