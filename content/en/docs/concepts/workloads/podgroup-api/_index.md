---
title: "PodGroup API"
weight: 25
no_list: true
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
and your cluster must have that API group enabled, as well as the `GenericWorkload`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
before you can use this API.

A PodGroup is a self-contained scheduling unit. It defines the group of Pods that should be scheduled together, carries the
scheduling policy that governs placement, and records the runtime status of that
scheduling decision.

## API structure

A PodGroup consists of a `spec` that defines the desired scheduling behavior and
a `status` that reflects the current scheduling state.

### Scheduling policy

Each PodGroup carries a [scheduling policy](/docs/concepts/workloads/workload-api/policies/)
(`basic` or `gang`) in `spec.schedulingPolicy`. When a workload controller creates
the PodGroup, this policy is copied from the Workload's PodGroupTemplate at creation time.
For standalone PodGroups, you set the policy directly.

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
associated with PodGroups can be shared by all Pods belonging to the group. With
only a reference to the PodGroup in the ResourceClaim's `status.reservedFor`
instead of each individual Pod, any number of Pods in the same PodGroup can
share a ResourceClaim. ResourceClaims can also be generated from
{{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}
for each PodGroup, allowing the devices allocated to each generated
ResourceClaim to be shared by the Pods in each PodGroup.

For more details and a more complete example, see the
[DRA documentation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#workload-resource-claims).

### Status

The scheduler updates `status.conditions` to report whether the group has been
successfully scheduled. The primary condition is `PodGroupScheduled`, which is `True`
when all required Pods have been placed and `False` when scheduling fails.

{{< note >}}
The `PodGroupScheduled` condition reflects the initial scheduling decision only.
The scheduler does not update it if Pods later fail or are evicted. See
[Limitations](/docs/concepts/workloads/podgroup-api/lifecycle/#limitations)
for details.
{{< /note >}}

See the [PodGroup lifecycle](/docs/concepts/workloads/podgroup-api/lifecycle/#podgroup-status)
page for the full list of conditions and reasons.

## Creating a PodGroup

A PodGroup API resource is part of the `scheduling.k8s.io/v1alpha2`
{{< glossary_tooltip text="API group" term_id="api-group" >}}.
(and your cluster must have that API group enabled, as well as the `GenericWorkload`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
before you can use this API).

The following manifest creates a PodGroup with a gang scheduling policy that requires
at least 4 Pods to be schedulable simultaneously:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-worker-0
  namespace: default
spec:
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

The [Job](/docs/concepts/workloads/controllers/job/) controller is the only built-in
workload controller that follows this pattern for now.
Custom controllers can implement the same flow for their own workload types.

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
