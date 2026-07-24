---
title: "Workload API"
weight: 20
simple_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

The `Workload` API resource defines the scheduling requirements and structure of a multi-Pod
application. While workload controllers such as [Job](/docs/concepts/workloads/controllers/job/)
manage the application's runtime state, the `Workload` specifies how groups of `Pods`
should be scheduled. The Job controller is the only built-in controller that creates
[PodGroup](/docs/concepts/workloads/podgroup-api/) objects from the `Workload`'s
`PodGroupTemplates` at runtime.

<!-- body -->

## What is a Workload?

The Workload API resource is part of the `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API group" term_id="api-group" >}}
and your cluster must have that API group enabled, as well as the `GenericWorkload`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
before you can use this API.

A `Workload` is a static, long-lived policy template. It defines what scheduling
policies should be applied to groups of Pods, but does not track runtime state itself.
Runtime scheduling state is maintained by [PodGroup](/docs/concepts/workloads/podgroup-api/)
objects, which controllers create from the `Workload`'s `PodGroupTemplates`.

## API structure

A `Workload` consists of two fields: a list of `PodGroupTemplates` and an optional controller
reference. The entire `Workload` spec is immutable after creation: you cannot modify
existing templates, add new templates, or remove templates from `podGroupTemplates`.

### PodGroupTemplates

The `spec.podGroupTemplates` list defines the distinct components of your workload.
For example, a machine learning job might have a `driver` template and a `worker` template.

Each entry in `podGroupTemplates` must have:
1. A unique `name` that will be used to reference the template in the `PodGroup`'s `spec.podGroupTemplateRef`.
2. A [scheduling policy](/docs/concepts/workloads/workload-api/policies/) (`basic` or `gang`).

If the [`WorkloadAwarePreemption`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadAwarePreemption) [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled each entry in `podGroups` can also have [priority and disruption mode](/docs/concepts/workloads/workload-api/disruption-and-priority/).

The maximum number of PodGroupTemplates in a single Workload is 8.

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  controllerRef:
    apiGroup: batch
    kind: Job
    name: training-job
  podGroupTemplates:
  - name: workers
    schedulingPolicy:
      gang:
        # The gang is schedulable only if 4 pods can run at once
        minCount: 4
    priorityClassName: high-priority # Only applicable with WorkloadAwarePreemption feature gate
    disruptionMode: PodGroup # Only applicable with WorkloadAwarePreemption feature gate
```

When a workload controller creates a `PodGroup` from one of these templates, it copies the
`schedulingPolicy` into the `PodGroup`'s own spec. Changes to the `Workload` only affect
newly created `PodGroups`, not existing ones.

### Referencing a workload controlling object

The `controllerRef` field links the Workload back to the specific high-level object defining the application,
such as a [Job](/docs/concepts/workloads/controllers/job/) or a custom CRD. This is useful for observability and tooling.
This data is not used to schedule or manage the Workload.

### CompositePodGroupTemplates

{{< feature-state feature_gate_name="CompositePodGroup" >}}

When the [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
feature gate and the `scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled, you can use `CompositePodGroupTemplates` to define multi-level, hierarchical scheduling
requirements in a `Workload`. These requirements can include enforcing nested topology constraints
across different layers of cluster infrastructure (multi-level topology-aware scheduling),
all-or-nothing scheduling across child groups (multi-level gang scheduling), or group-level
disruption policies.

`CompositePodGroupTemplates` can be defined using the `spec.compositePodGroupTemplates` field in the
`Workload` API. At runtime, workload controllers create [CompositePodGroup](/docs/concepts/workloads/compositepodgroup-api/)
and [PodGroup](/docs/concepts/workloads/podgroup-api/) objects from these templates to maintain the runtime
scheduling state of the hierarchy. While `PodGroup` objects manage groups of Pods at the leaves,
`CompositePodGroup` objects represent non-leaf groups that enforce scheduling policies across child groups.

{{< note >}}
In a `Workload` specification, `spec.compositePodGroupTemplates` and `spec.podGroupTemplates`
fields form a union: a `Workload` must define either `spec.podGroupTemplates` (for flat
workloads) or `spec.compositePodGroupTemplates` (for hierarchical workloads), but cannot
specify both.
{{< /note >}}

#### Structure and constraints

The `spec.compositePodGroupTemplates` field defines non-leaf templates in a group-template
hierarchy tree. Each entry represents a template for a `CompositePodGroup` and can contain:

- **Child templates**: Nested `CompositePodGroupTemplates` (for intermediate non-leaf
  groups) or `PodGroupTemplates` (for leaf groups containing Pods).
- **Scheduling policy**: Specifies how child groups within this composite group are
  scheduled:
  - `basic`: Child groups are admitted and scheduled independently.
  - `gang`: Enforces multi-level all-or-nothing scheduling across child groups.
    Requires `minGroupCount`, which specifies the minimum number of child groups
    that must be schedulable simultaneously for the composite group to be feasible.
- **Scheduling constraints**: Optional
  [topology constraints](/docs/concepts/workloads/workload-api/topology-aware-scheduling/)
  for multi-level topology-aware scheduling.
- **Priority and disruption mode**: Optional `priorityClassName` and `disruptionMode`
  (`Single` or `All`) for
  [workload-aware preemption](/docs/concepts/workloads/workload-api/disruption-and-priority/).

To ensure cluster stability and control-plane efficiency, the group-template hierarchy
enforces the following limits:

- **Maximum nesting depth**: The group-template hierarchy supports a maximum depth of
  4 levels.
- **List limit**: Every `compositePodGroupTemplates` and `podGroupTemplates` list is strictly
  capped at a maximum of 8 items.

{{< note >}}
Right now, you cannot add new or remove existing `CompositePodGroupTemplates`. You can only change
the `minCount` value in the gang scheduling policy defined in the leaf `PodGroupTemplates`.
{{< /note >}}

#### Example

The following example defines a hierarchical `Workload` with a `CompositePodGroup` template
that enforces gang scheduling across two child `PodGroup` templates (`minGroupCount: 2`),
each specifying its own gang scheduling policy:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: Workload
metadata:
  name: gang-of-gangs-workload
  namespace: default
spec:
  compositePodGroupTemplates:
  - name: root
    schedulingPolicy:
      gang:
        # Requires both child PodGroups to be schedulable together
        minGroupCount: 2
    podGroupTemplates:
    - name: workers-a
      schedulingPolicy:
        gang:
          # Requires 4 Pods in this group to be schedulable
          minCount: 4
    - name: workers-b
      schedulingPolicy:
        gang:
          # Requires 4 Pods in this group to be schedulable
          minCount: 4
```

## Gang scheduling with Jobs

{{< feature-state feature_gate_name="WorkloadWithJob" >}}

When the
[`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/)
feature gate is enabled, the
[Job](/docs/concepts/workloads/controllers/job/) controller automatically
creates Workload and PodGroup objects for parallel indexed Jobs where
`.spec.parallelism` equals `.spec.completions`. The gang policy's `minCount`
is set to the Job's parallelism, so all Pods must be schedulable together
before any of them are bound to nodes.

This is the built-in path for using gang scheduling with Jobs.
You do not need to create Workload or PodGroup objects yourself as the Job
controller handles it automatically. Other workload controllers (such as
JobSet) may manage their own Workload and PodGroup objects independently.

## {{% heading "whatsnext" %}}

* Learn about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* See how PodGroups are created from Workloads in the [PodGroup API](/docs/concepts/workloads/podgroup-api/) overview.
* Read about how Pods reference their PodGroup via the [scheduling group](/docs/concepts/workloads/pods/scheduling-group/) field.
* Learn about [Topology-aware workload scheduling](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* Understand the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
