---
title: "Workload API"
weight: 20
simple_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

The Workload API resource allows you to describe the scheduling requirements and structure of a multi-Pod application.
While workload controllers provide runtime behavior for the workloads,
the Workload API is supposed to provide scheduling constraints for the "true" workloads, such as Job and others.

<!-- body -->

## What is a Workload?

The Workload API resource is part of the `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}}
(and your cluster must have that API group enabled, as well as the `GenericWorkload`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
before you can benefit from this API).
This resource acts as a structured, machine-readable definition of the scheduling requirements
of a multi-Pod application. While user-facing workloads like [Jobs](/docs/concepts/workloads/controllers/job/)
define what to run, the Workload resource determines how a group of Pods should be scheduled
and how its placement should be managed throughout its lifecycle.

## API structure

A Workload allows you to define a group of Pods and apply a scheduling policy to them.
It consists of two sections: a list of pod groups and a reference to a controller.

### Pod groups

The `podGroups` list defines the distinct components of your workload.
For example, a machine learning job might have a `driver` group and a `worker` group.

Each entry in `podGroups` must have:
1. A unique `name` that can be used in the Pod's [Workload reference](/docs/concepts/workloads/pods/workload-reference/).
2. A [scheduling policy](/docs/concepts/workloads/workload-api/policies/) (`basic` or `gang`).

```yaml
apiVersion: scheduling.k8s.io/v1alpha1
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  controllerRef:
    apiGroup: batch
    kind: Job
    name: training-job
  podGroups:
  - name: workers
    policy:
      gang:
        # The gang is schedulable only if 4 pods can run at once
        minCount: 4
```

### Referencing a workload controlling object

The `controllerRef` field links the Workload back to the specific high-level object defining the application,
such as a [Job](/docs/concepts/workloads/controllers/job/) or a custom CRD. This is useful for observability and tooling.
This data is not used to schedule or manage the Workload.

### Requesting DRA devices for a PodGroup

{{< feature-state feature_gate_name="DRAWorkloadResourceClaims" >}}

{{< glossary_tooltip text="Devices" term_id="device" >}} available through
{{< glossary_tooltip text="Dynamic Resource Allocation (DRA)" term_id="dra" >}}
can be requested by a PodGroup through its `spec.resourceClaims` field:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}
associated with PodGroups can be shared by more than 256 Pods.
ResourceClaims can also be generated from
{{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}
for each PodGroup, allowing the devices allocated to each generated
ResourceClaim to be shared by the Pods in each PodGroup.

For more details and a more complete example, see the
[DRA documentation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#workload-resource-claims).

## {{% heading "whatsnext" %}}

* See how to [reference a Workload](/docs/concepts/workloads/pods/workload-reference/) in a Pod.
* Learn about [pod group policies](/docs/concepts/workloads/workload-api/policies/).
* Read about [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
