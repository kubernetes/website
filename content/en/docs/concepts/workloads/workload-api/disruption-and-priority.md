---
title: Pod Group Disruption and Priority
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

PodGroup can declare a disruption mode. This mode dictates how
the scheduler can disrupt a running PodGroup, for example to accommodate
a higher priority PodGroup. A PodGroup also has a priority and preemption policy,
which must be matched by those of the individual Pods in the group and are used for scheduling queue
ordering and [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) events.

<!-- body -->

## Disruption mode types

{{< note >}}
In v1.36, the `priority` or `disruptionMode` fields of the PodGroup are only respected
by [workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
During the pod scheduling phase, the scheduler does not take into account
the `priority` or `disruptionMode` fields of the PodGroup. This limitation no longer
applies in v1.37.
{{< /note >}}

The API supports two disruption modes: `single` and `all`.
The default one is `single`.

### Single

The `single` mode instructs the scheduler to treat all Pods in the group as separate entities,
allowing independent disruption of a single pod from a PodGroup.

### All

The `all` mode emphasizes "all-or-nothing" semantics for disruption.
It instructs the scheduler that all pods from the PodGroup have to be disrupted together.

{{< note >}}
The `all` disruption mode is only supported with the `gang` scheduling policy; `kube-apiserver`
rejects any `PodGroup`, `CompositePodGroup`, or group template with the `basic` scheduling policy
that specifies the `all` disruption mode.
{{< /note >}}

## CompositePodGroup

{{< feature-state feature_gate_name="CompositePodGroup" >}}

A `CompositePodGroup` can also declare a `disruptionMode` in its specification, which controls
how the scheduler disrupts child groups within the composite group during preemption events.

The API supports two disruption modes for `CompositePodGroups`:

- **`single`**: Allows individual child groups within the `CompositePodGroup` to be disrupted
  independently during preemption.
- **`all`**: Enforces all-or-nothing disruption semantics across the `CompositePodGroup` hierarchy.
  If any Pod contained in the hierarchy below this `CompositePodGroup` has to be preempted, all of
  the Pods from the entire hierarchy must be preempted.

If not specified, the mode defaults to `single`.

{{< note >}}
A group with the disruption mode set to `all` must only have child groups that have a mode set to
`all` as well. If a `Workload` object does not satisfy this condition, `kube-apiserver` rejects it
at creation time. Similarly, `kube-scheduler` does not proceed to scheduling `CompositePodGroup`
hierarchies not adhering to this constraint.
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
All Pods in the PodGroup must have the same `priority` as the PodGroup; otherwise, the scheduler
does not schedule the PodGroup and sets `PodGroupInitiallyScheduled` to `False` with reason
`PodGroupError`.

A PodGroup also has a `preemptionPolicy` field.

- When `spec.preemptionPolicy` is omitted on a
PodGroup, the priority admission controller resolves it from the referenced PriorityClass, the
`globalDefault` PriorityClass when `priorityClassName` is unset, or `PreemptLowerPriority` when
no `globalDefault` PriorityClass exists.
- If `spec.preemptionPolicy` is explicitly set on the
PodGroup to a value that differs from that resolved policy, the priority admission controller
rejects the PodGroup.
- If the PriorityClass itself omits `preemptionPolicy`, the priority admission
controller leaves `spec.preemptionPolicy` unset and `kube-scheduler` falls back to
`PreemptLowerPriority` (unless the Pods specify `Never`).

This field is the authoritative preemption policy for the group and decides whether the PodGroup
can preempt lower-priority Pods and PodGroups to make room for itself:

- `PreemptLowerPriority` allows preempting lower-priority victims.
- `Never` disables workload-aware preemption for the PodGroup.

All Pods in the PodGroup must have the same `preemptionPolicy` as the PodGroup; otherwise, the
scheduler does not schedule the PodGroup and sets `PodGroupInitiallyScheduled` to `False` with
reason `PodGroupError`.

When creating a `Workload`, all `PodGroupTemplates` and `CompositePodGroupTemplates` in the
`Workload` must share the same `priorityClassName`, `priority`, and `preemptionPolicy` values;
`kube-apiserver` rejects newly created `Workload` objects whose templates specify differing
values.

{{< note >}}
In v1.37, the `preemptionPolicy` field on PodGroups, CompositePodGroups, and Workload templates
was gated by the alpha
[`PodGroupPreemptionPolicy`](/docs/reference/command-line-tools-reference/feature-gates-removed/#PodGroupPreemptionPolicy)
feature gate. In v1.38, this feature gate was removed and merged into
[`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
(and [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
for CompositePodGroups). For existing PodGroups created in v1.37 without `preemptionPolicy` set,
the scheduler falls back to requiring all Pods in the group to share the same `preemptionPolicy`
and uses that value as the group's preemption policy.
{{< /note >}}

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
All Pods and all groups within a single group hierarchy must share the exact same priority.

The value of priority is also used for the ordering of root `CompositePodGroups` in the scheduling
active queue.

### PreemptionPolicy in CompositePodGroup

{{< feature-state feature_gate_name="CompositePodGroup" >}}

The `CompositePodGroup` API has the `preemptionPolicy` field as well and its resolution is performed
in the exact same way as for the `PodGroup` API.

The value of `preemptionPolicy` of the root `CompositePodGroup` determines whether
[workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) can be
invoked to fit its Pods during scheduling if needed:

- `PreemptLowerPriority` policy allows preempting victims with lower priority,
- `Never` policy disables workload-aware preemption for that root `CompositePodGroup`.

All Pods and all groups within a single group hierarchy must share the exact same preemption policy.

{{< note >}}
In v1.37, the `preemptionPolicy` field on `CompositePodGroup` was gated by the alpha
[`PodGroupPreemptionPolicy`](/docs/reference/command-line-tools-reference/feature-gates-removed/#PodGroupPreemptionPolicy)
feature gate, which was removed in v1.38 and merged into
[`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup).
For existing root `CompositePodGroup` objects created in v1.37 without `preemptionPolicy` set, the
scheduler falls back to requiring all Pods (and any child groups with `preemptionPolicy` set) in
the hierarchy to share the same preemption policy and uses that value for the hierarchy.
{{< /note >}}

## {{% heading "whatsnext" %}}

* Read about [Workload-Aware Preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/) algorithm.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* Learn about the [scheduling building blocks and the workloadbuilder library](/docs/concepts/workloads/workload-api/workloadbuilder/), including the disruption mode building block.
