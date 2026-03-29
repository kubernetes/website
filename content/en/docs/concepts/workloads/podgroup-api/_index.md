---
title: "PodGroup API"
weight: 25
simple_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

A PodGroup is a runtime object that represents a group of Pods scheduled together as a single unit.
While the [Workload API](/docs/concepts/workloads/workload-api/) defines scheduling policy
templates, PodGroups are the runtime counterparts that carry both the policy and the scheduling status
for a specific instance of that group.

<!-- body -->

## What is a PodGroup?

The PodGroup API resource is part of the `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API group" term_id="api-group" >}}
(and your cluster must have that API group enabled, as well as the `GenericWorkload`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
before you can use this API).

Workload controllers such as [Job](/docs/concepts/workloads/controllers/job/), JobSet,
or LeaderWorkerSet create PodGroup objects from the
[PodGroupTemplates](/docs/concepts/workloads/workload-api/) defined in a Workload.
Each PodGroup is a self-contained scheduling unit: it carries its own copy of the
scheduling policy and tracks its own status independently.

## API structure

A PodGroup consists of a `spec` that defines the desired scheduling behavior and
a `status` that reflects the current scheduling state.

### Scheduling policy

Each PodGroup carries a [scheduling policy](/docs/concepts/workloads/workload-api/policies/)
(`basic` or `gang`) in `spec.schedulingPolicy`. This policy is copied from the Workload's
PodGroupTemplate at creation time, making each PodGroup self-contained.

```yaml
spec:
  schedulingPolicy:
    gang:
      minCount: 4
```

### Template reference

The optional `spec.podGroupTemplateRef` links the PodGroup back to the PodGroupTemplate
in the Workload it was created from. This is useful for observability and tooling.

```yaml
spec:
  podGroupTemplateRef:
    workload:
      workloadName: training-policy
      podGroupTemplateName: worker
```

### Status

The scheduler updates `status.conditions` to report whether the group has been
successfully scheduled. The primary condition is `PodGroupScheduled`, which is `True`
when all required Pods have been placed and `False` when scheduling fails.

See the [PodGroup lifecycle](/docs/concepts/workloads/podgroup-api/lifecycle/#podgroup-status)
page for the full list of conditions and reasons.

## Creating a PodGroup

A PodGroup belongs to the `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API group" term_id="api-group" >}}.
The following manifest creates a PodGroup with a gang scheduling policy that requires
at least 4 Pods to be schedulable simultaneously:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-worker-0
  namespace: default
spec:
  podGroupTemplateRef:
    workload:
      workloadName: training-policy
      podGroupTemplateName: worker
  schedulingPolicy:
    gang:
      minCount: 4
```

You can inspect PodGroups in your cluster:

```shell
kubectl get podgroups
```

To see the full status including scheduling conditions:

```shell
kubectl describe podgroup training-worker-0
```

## How it fits together

The relationship between controllers, Workloads, PodGroups, and Pods follows this pattern:

1. The workload controller creates a Workload that defines PodGroupTemplates with scheduling policies.
2. For each runtime instance, the controller creates a PodGroup from one of the Workload's PodGroupTemplates.
3. The controller creates Pods that reference the PodGroup
   via the `spec.schedulingGroup.podGroupName` field.

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: Workload
metadata:
  name: training-policy
spec:
  podGroupTemplates:
  - name: worker
    schedulingPolicy:
      gang:
        minCount: 4
---
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-worker-0
spec:
  podGroupTemplateRef:
    workload:
      workloadName: training-policy
      podGroupTemplateName: worker
  schedulingPolicy:
    gang:
      minCount: 4
---
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
spec:
  schedulingGroup:
    podGroupName: training-worker-0
  containers:
  - name: ml-worker
    image: training:v1
```

The Workload acts as a long-lived policy definition, while PodGroups handle the 
transient, per-instance runtime state. This separation means that status updates for
individual PodGroups do not contend on the shared Workload object.

## {{% heading "whatsnext" %}}

* Learn about the [PodGroup lifecycle](/docs/concepts/workloads/podgroup-api/lifecycle/) in detail.
* Read about the [Workload API](/docs/concepts/workloads/workload-api/) that provides PodGroupTemplates.
* See how Pods reference their PodGroup via the [scheduling group](/docs/concepts/workloads/pods/scheduling-group/) field.
* Understand the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
