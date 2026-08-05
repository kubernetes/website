---
title: Pod Group Policies
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Every pod group defined in a [Workload](/docs/concepts/workloads/workload-api/)
must declare a scheduling policy. This policy dictates how the scheduler treats the collection of Pods.

<!-- body -->

## Policy types

The API currently supports two policy types: `basic` and `gang`.
You must specify exactly one policy for each group.

### Basic policy

The `basic` policy instructs the scheduler to treat all Pods in the group as independent entities,
scheduling them using the standard Kubernetes behavior.

The main reason to use the `basic` policy is to organize the Pods within your Workload
for better observability and management.

This policy can be used for groups of a Workload that do not require simultaneous startup
but logically belong to the application, or to open the way for future group constraints
that do not imply "all-or-nothing" placement.

```yaml
policy:
  basic: {}
```

### Gang policy

The `gang` policy enforces "all-or-nothing" scheduling. This is essential for tightly-coupled workloads
where partial startup results in deadlocks or wasted resources.

This can be used for [Jobs](/docs/concepts/workloads/controllers/job/)
or any other batch process where all workers must run concurrently to make progress.

The `gang` policy requires a `minCount` parameter:

```yaml
policy:
  gang:
    # The number of Pods that must be schedulable simultaneously
    # for the group to be admitted.
    minCount: 4
```

## {{% heading "whatsnext" %}}

* Read about [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
