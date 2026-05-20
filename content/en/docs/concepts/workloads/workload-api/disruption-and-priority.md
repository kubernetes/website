---
title: Pod Group Disruption and Priority
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="WorkloadAwarePreemption" >}}

PodGroup can declare a disruption mode. This mode dictates how
the scheduler can disrupt a running PodGroup, for example to accommodate
a higher priority PodGroup. A PodGroup also has a priority,
which overrides the priority of the individual pods from the group
for [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) events.

<!-- body -->

## Disruption mode types

{{< note >}}
As of 1.36, the `priority` or `disruptionMode` fields of the PodGroup are only respected
by [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
During the pod scheduling phase, the scheduler does not take into account
the `priority` or `disruptionMode` fields of the PodGroup.
{{< /note >}}

The API supports two disruption modes: `Pod` and `PodGroup`.
The default one is `Pod`.

### Pod

The `Pod` mode instructs the scheduler to treat all Pods in the group as separate entities,
allowing independent disruption of a single pod from a PodGroup.

### PodGroup

The `PodGroup` mode emphasizes "all-or-nothing" semantics for disruption.
It instructs the scheduler that all pods from the PodGroup have to be disrupted together.

## Pod group priority

PodGroup uses the same concept of [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) as single Pods.
Once you have created one or more PriorityClasses,
you can create a PodGroup that specifies one of those PriorityClass names in its specification.
The priority admission controller uses the `priorityClassName` field and populates the integer value of the priority.
If the priority class is not found, the PodGroup is rejected.
When `priorityClassName` is not set for a PodGroup, Kubernetes looks for a default (a PriorityClass with `globalDefault` set true)
If there is no PriorityClass with `globalDefault` set true, a PodGroup with no `priorityClassName` has priority zero.

The priority of the PodGroup is an authorative priority for all pods in the group during [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) events, even when priorities of individual pods forming this PodGroup differ.

The following YAML is an example of a PodGroup configuration that uses the `high-priority` PriorityClass,
which maps to the integer priority value of 1000000.
The priority admission controller checks the specification and resolves the priority of the PodGroup to 1000000.

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  namespace: ns-1
  name: job-1
spec:
  priorityClassName: high-priority
```

## {{% heading "whatsnext" %}}

* Read about [Workload-Aware Preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) algorithm.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
