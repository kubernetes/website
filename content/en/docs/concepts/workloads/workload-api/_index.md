---
title: "Workload API"
weight: 20
simple_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

The `Workload` API resource defines the scheduling requirements and structure of a multi-Pod
application. While workload controllers such as [Job](/docs/concepts/workloads/controllers/job/)
provide runtime behavior, the `Workload` specifies how groups of `Pods` should be scheduled.
Controllers use the `Workload`'s `PodGroupTemplates` to create
[PodGroup](/docs/concepts/workloads/podgroup-api/) objects at runtime.

<!-- body -->

## What is a Workload?

The Workload API resource is part of the `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API group" term_id="api-group" >}}
(and your cluster must have that API group enabled, as well as the `GenericWorkload`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
before you can use this API).

A `Workload` is a static, long-lived policy template. It defines what scheduling
policies should be applied to groups of Pods, but does not track runtime state itself.
Runtime scheduling state is maintained by [PodGroup](/docs/concepts/workloads/podgroup-api/)
objects, which controllers create from the `Workload`'s `PodGroupTemplates`.

## API structure

A `Workload` consists of two fields: a list of `PodGroupTemplates` and an optional controller
reference. All fields are immutable after creation.

### PodGroupTemplates

The `spec.podGroupTemplates` list defines the distinct components of your workload.
For example, a machine learning job might have a `driver` template and a `worker` template.

Each entry in `podGroupTemplates` must have:
1. A unique `name` that will be used to reference the template in the `PodGroup`'s `spec.podGroupTemplateRef`.
2. A [scheduling policy](/docs/concepts/workloads/workload-api/policies/) (`basic` or `gang`).

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
```

When a workload controller creates a `PodGroup` from one of these templates, it copies the
`schedulingPolicy` into the `PodGroup`'s own spec. Changes to the `Workload` only affect
newly created `PodGroups`, not existing ones.

### Referencing a workload controlling object

The optional `spec.controllerRef` field links the `Workload` back to the higher-level controlling object defining the application,
such as a [Job](/docs/concepts/workloads/controllers/job/) or a custom CRD.
This is useful for observability, tooling, and garbage collection. The scheduler does not use this field.

## {{% heading "whatsnext" %}}

* Learn about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/) (`basic` and `gang`).
* See how PodGroups are created from Workloads in the [PodGroup API](/docs/concepts/workloads/podgroup-api/) overview.
* Read about how Pods reference their PodGroup via the [scheduling group](/docs/concepts/workloads/pods/scheduling-group/) field.
* Understand the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
