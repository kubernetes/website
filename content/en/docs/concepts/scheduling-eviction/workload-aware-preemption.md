---
title: Workload-Aware Preemption
content_type: concept
weight: 80
---

<!-- overview -->
{{< feature-state feature_gate_name="WorkloadAwarePreemption">}}

Workload-aware preemption introduces a preemption mechanism specifically designed for PodGroups.
When a PodGroup cannot be scheduled, the scheduler utilizes a preemption logic that tries to
make scheduling of this PodGroup possible. This approach is used exclusively during PodGroup scheduling
and replaces the default preemption mechanism for pods from a given PodGroup.

When this feature is enabled, the scheduler treats the PodGroup as a single preemptor unit,
rather than evaluating individual pods from a PodGroup in isolation. To make room for the pending pods in the group,
it searches for victims across the entire cluster,
and knows how to treat and preempt other PodGroups as victims according to their disruption modes.

This feature depends on the [Gang Scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)
and the [Workload API](/docs/concepts/workloads/workload-api/).
Ensure the [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
and [`GangScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling) feature gates
and the `scheduling.k8s.io/v1alpha2` {{< glossary_tooltip text="API group" term_id="api-group" >}} are enabled in the cluster.

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

{{< note >}}
When scheduling a single Pod, the default pod preemption applies.
As of 1.36, when the scheduler performs a default preemption for a single Pod
and it attempts to preempt a Pod belonging to a PodGroup, it does **not**
respect the `priority` or `disruptionMode` fields of that PodGroup.
{{< /note >}}

## {{% heading "whatsnext" %}}

* Learn more about [PodGroup Priority and Disruption](/docs/concepts/workloads/workload-api/disruption-and-priority/).
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/).
* Read more about [Gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/).
