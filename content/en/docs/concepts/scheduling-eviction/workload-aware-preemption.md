---
title: Workload-Aware Preemption
content_type: concept
weight: 80
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload">}}


{{< note >}}
In v1.36, the workload-aware preemption logic was gated by
`WorkloadAwarePreemption` feature gate. This feature gate was merged into
`GenericWorkload` feature gate in v1.37.
{{< /note >}}


Workload-aware preemption introduces a preemption mechanism specifically designed for PodGroups.
When a PodGroup cannot be scheduled, the scheduler utilizes a preemption logic that tries to
make scheduling of this PodGroup possible. This approach is used exclusively during PodGroup scheduling
and replaces the default preemption mechanism for pods from a given PodGroup.

When this feature is enabled, the scheduler treats the PodGroup as a single preemptor unit,
rather than evaluating individual pods from a PodGroup in isolation. To make room for the pending pods in the group,
it searches for victims across the entire cluster,
and knows how to treat and preempt other PodGroups as victims according to their disruption modes.

This feature is coupled with [Gang Scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)
and depends on the [Workload API](/docs/concepts/workloads/workload-api/).
Ensure the [`scheduling.k8s.io/v1beta1`]{{< glossary_tooltip text="API group" term_id="api-group" >}} is enabled in the cluster.

<!-- body -->

## How it works

The workload-aware preemption process follows the same principles
as [default preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)
with a few differences:

1. Cluster-wide domain: Instead of evaluating preemption node by node,
   the scheduler evaluates the entire cluster as a single domain.
   It selects a set of victims across multiple nodes that can be removed
   to make enough room for the preemptor PodGroup to be scheduled.

2. Victim importance hierarchy: The scheduler decides which preemption units
   (individual pods or PodGroups) are more critical and should be spared from preemption
   using a strict hierarchy:
   * Priority: Higher priority units are always more important.
   * Workload type: PodGroups are considered more important than individual Pods of the same priority.
   * Group size (PodGroups): If both units are PodGroups,
     the one with more members (larger size) is considered more important.
   * Start time: Units that started earlier are more important.

3. Pod group priority and disruption: The scheduler considers the specific
   [priority and disruption mode](/docs/concepts/workloads/workload-api/disruption-and-priority/) of a PodGroup
   to evaluate if and how its pods can be preempted during preemption events.

4. Performance and optimality considerations: For the performance reasons,
   the workload-aware preemption first simulates removal all potential victims and 
   runs the scheduling once. It then tries to reprieve as many victims as possible
   for selected placement. This trade off means that there may exists an alternative placement
   causing less preemptions, but it is not selected by the scheduler due to performance reasons.

{{< note >}}
When scheduling a single Pod, the default pod preemption applies.
In v1.36, when the scheduler performs a default preemption for a single Pod
and it attempts to preempt a Pod belonging to a PodGroup, it does **not**
respect the `priority` or `disruptionMode` fields of that PodGroup. 
This limitation no longer applies in v1.37.
{{< /note >}}

### Reprieval algorithm

When running workload-aware preemption, the scheduler runs the simulation where it removes potential preemption victims
and runs the pod group scheduling algorithm. It then tries to reprieve as many victims as possible for returned placement.
To do that, the scheduler reuses the CycleStates from pod group scheduling. For each of the potential victims,
sorted by their importance, the scheduler:
1. Adds victim pods back to their nodes and CycleStates of preemptor pods.
2. For each pod in the PodGroup (in the same order as in scheduling algorithm):
   * Runs Filter plugins for the pod on its proposed node
   * Adds the pod to its proposed node
   * Runs Reserve plugins for the pod on its proposed node

If for each pod, the Filtering passes, the victim pods are kept on their nodes.

If filtering fails for at least one pod, victim pods are removed from CycleStates and node.

In both cases the scheduler preemptor pods are removed from their nodes and their Unreserve is called,
so the next reprieval attempt can validate scheduling of PodGroup. The scheduler then proceeds with
another potential victim until all victims are processed.

### Preemption for CompositePodGroups

{{< feature-state feature_gate_name="CompositePodGroup" >}}

When the [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
feature gate and the `scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled, workload-aware preemption provides support for `CompositePodGroups` as well.

The underlying preemption mechanism is the same as for `PodGroups` - if the scheduler needs to free
up capacity to place the root `CompositePodGroup`, it evaluates preemption for the entire group
hierarchy, rather than for individual pods.

`CompositePodGroups` can be selected as preemption victims as well. The victim selection process is
adjusted to take `CompositePodGroups` into account in the following way:

1. Victim importance hierarchy:
   - `CompositePodGroups` are considered more important than standalone `PodGroups` of the same
     priority.
   - For two `CompositePodGroups` of the same priority, the one with more members (larger size) is
     considered more important.

2. Disruption mode: Similar to `PodGroups`, `CompositePodGroups` specify
   [disruption mode](/docs/concepts/workloads/workload-api/disruption-and-priority/) that determines
   how its child groups should be treated during preemption.

Besides workload-aware preemption, `CompositePodGroups` can be selected as preemption victims by
default Pod preemption during Pod scheduling cycle, alongside `PodGroups` and Pods. Default Pod
preemption shares the victim importance hierarchy logic with the workload-aware preemption and
respects the `disruptionMode` field of `CompositePodGroups`.

## {{% heading "whatsnext" %}}

* Learn more about [PodGroup Priority and Disruption](/docs/concepts/workloads/workload-api/disruption-and-priority/).
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* Read more about [Gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/).
