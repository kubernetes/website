---
title: Pod Group Disruption and Priority
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

PodGroup can declare a disruption mode. This mode dictates how
the scheduler can disrupt a running PodGroup, for example to accommodate
a higher priority PodGroup. A PodGroup also has a priority,
which overrides the priority of the individual pods from the group
for [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) events.

<!-- body -->

## Disruption mode types

{{< note >}}
In v1.36, the `priority` or `disruptionMode` fields of the PodGroup are only respected
by [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
During the pod scheduling phase, the scheduler does not take into account
the `priority` or `disruptionMode` fields of the PodGroup. This limitation no longer
applies in v1.37.
{{< /note >}}

The API supports two disruption modes: `Single` and `All`.
The default one is `Single`.

### Single

The `Single` mode instructs the scheduler to treat all Pods in the group as separate entities,
allowing independent disruption of a single pod from a PodGroup.

### All

The `All` mode emphasizes "all-or-nothing" semantics for disruption.
It instructs the scheduler that all pods from the PodGroup have to be disrupted together.

## CompositePodGroup

{{< feature-state feature_gate_name="CompositePodGroup" >}}

A `CompositePodGroup` can also declare a `disruptionMode` in its specification, which controls
how the scheduler disrupts child groups within the composite group during preemption events.

The API supports two disruption modes for `CompositePodGroups`:

- **`Single`**: Allows individual child groups within the `CompositePodGroup` to be disrupted
  independently during preemption.
- **`All`**: Enforces all-or-nothing disruption semantics across the `CompositePodGroup` hierarchy.
  If any Pod contained in the hierarchy below this `CompositePodGroup` has to be preempted, all of
  the Pods from the entire hierarchy must be preempted.

If not specified, the mode defaults to `Single`.

{{< note >}}
In v1.37, a group can set its disruption mode to `All` and have child groups that have a mode set to
`Single`. In such case, the top-level `All` mode overrides the descendant `Single` modes.

This configuration is discouraged due to unclear semantics.
{{< /note >}}

## Pod group priority

PodGroup uses the same concept of [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) as single Pods.
Once you have created one or more PriorityClasses,
you can create a PodGroup that specifies one of those PriorityClass names in its specification.
The priority admission controller uses the `priorityClassName` field and populates the integer value of the priority.
If the priority class is not found, the PodGroup is rejected.
When `priorityClassName` is not set for a PodGroup, Kubernetes looks for a default (a PriorityClass with `globalDefault` set true)
If there is no PriorityClass with `globalDefault` set true, a PodGroup with no `priorityClassName` has priority zero.

The priority of the PodGroup is an authoritative priority for all pods in the group during [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) events.
This value is also used for the ordering of PodGroups in the scheduling queue.
When the priorities of individual pods forming this PodGroup differ from PodGroup priority
the PodGroup will not be scheduled with `all pods in a single pod group should have the same priority as the pod group` error.

When the [PodGroupPreemptionPolicy](/docs/reference/command-line-tools-reference/feature-gates/podgroup-preemption-policy/)
feature gate is enabled, PodGroup has also `preemptionPolicy` field. This field is also taken from the PriorirtyClass.
It is an authoratitive field for all pods in the group and it decides whether the PodGroup can perform a preemption of
lower priority pods and pod groups to accomodate a place for itself.  When the feature gate is enabled all pods in the PodGroup
must have the same `preemptionPolicy` as PodGroup. Otherwise the PodGroup will not be scheduled with
`all pods in a single pod group should have the same preemption policy as the pod group's preemption policy` error.
When PodGroup has `preemptionPolicy: Never` it will not perform workload aware preemption.
If the feature flag is disabled, all pods forming PodGroup must have the same `preemptionPolicy`.
Otherwise the PodGroup will not be scheduled with
`all pods in a single pod group should have the same preemption policy` error.

The following YAML is an example of a PodGroup configuration that uses the `high-priority` PriorityClass,
which maps to the integer priority value of 1000000.
The priority admission controller checks the specification and resolves the priority of the PodGroup to 1000000.

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  namespace: ns-1
  name: job-1
spec:
  priorityClassName: high-priority
```

### CompositePodGroup priority

{{< feature-state feature_gate_name="CompositePodGroup" >}}

`CompositePodGroup` API has `priorityClassName` and `priority` fields as well and their resolution
is performed in the same way as for the `PodGroups`, through the priority admission controller.

The priority of a root `CompositePodGroup` acts as the authoritative priority for all child groups
and Pods within its hierarchy during
[workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) events.
All Pods within a single group hierarchy must share the exact same priority and must be equal to the
priority of the root `CompositePodGroup`.

The value of priority is also used for the ordering of root `CompositePodGroups` in the scheduling
active queue.

{{< note >}}
In v1.37, the scheduler doesn't validate if the non-root groups have priority value that is equal to
the priority of the root `CompositePodGroup`.
{{< /note >}}

### PreemptionPolicy in CompositePodGroup

{{< feature-state feature_gate_name="PodGroupPreemptionPolicy" >}}

The `CompositePodGroup` API has the `preemptionPolicy` field as well and its resolution is performed
in the exact same way as for the `PodGroup` API.

The value of `preemptionPolicy` of the root `CompositePodGroup` determines whether
[workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) can be
invoked to fit its Pods during scheduling if needed:

- `PreemptLowerPriority` policy allows preempting victims with lower priority,
- `Never` policy disables workload-aware preemption for that root `CompositePodGroup`.

All Pods within a single group hierarchy must share the exact same preemption policy which must be
equal to the preemption policy of the root `CompositePodGroup`.

If the feature flag is disabled, the root `CompositePodGroup` will be allowed to perform preemption
unless one of the Pods that belongs to the group hierarchy has `preemptionPolicy` set to `Never`.

{{< note >}}
In v1.37, when the feature gate is enabled, the scheduler doesn't validate if the non-root groups
have preemption policy that is equal to the preemption policy of the root `CompositePodGroup`.
{{< /note >}}

## {{% heading "whatsnext" %}}

* Read about [Workload-Aware Preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) algorithm.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* Learn about the [scheduling building blocks and the workloadbuilder library](/docs/concepts/workloads/workload-api/workloadbuilder/), including the disruption mode building block.
