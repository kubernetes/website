---
title: CompositePodGroup API
weight: 25
no_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="CompositePodGroup" >}}

A `CompositePodGroup` is a runtime object that represents a non-leaf node in a multi-level workload
hierarchy. While the [Workload API](/docs/concepts/workloads/workload-api/) defines static scheduling
policy templates, `CompositePodGroup` and `PodGroup` objects are the runtime counterparts that
carry policies and hierarchy references for a specific workload instance.

<!-- body -->

## What is a CompositePodGroup?

The `CompositePodGroup` API resource is part of the `scheduling.k8s.io/v1alpha3`
{{< glossary_tooltip text="API group" term_id="api-group" >}}. Your cluster must have that API
group enabled, as well as the `CompositePodGroup`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
before you can use this API.

A `CompositePodGroup` represents a grouping of child groups (which can be `CompositePodGroup` or
`PodGroup` objects). It carries scheduling policies, disruption modes, priority
settings, and optional topology constraints that apply collectively across its child groups.

## API structure

A `CompositePodGroup` consists of a `spec` that defines the desired scheduling behavior
for its child groups, and a `status` subresource.

### Scheduling policy

Each `CompositePodGroup` carries a [scheduling policy](/docs/concepts/workloads/workload-api/policies/)
(`basic` or `gang`) in `spec.schedulingPolicy`. When a workload controller creates a
`CompositePodGroup`, this policy is copied from the `Workload`'s `CompositePodGroupTemplate`
at creation time.

For a `gang` policy on a `CompositePodGroup`, the `minGroupCount` field specifies the
minimum number of child groups that must be schedulable simultaneously:

```yaml
spec:
  schedulingPolicy:
    gang:
      minGroupCount: 2
```

### Parent group reference

Non-root `CompositePodGroup` resources specify their parent group using
`spec.parentCompositePodGroupName`. Root `CompositePodGroup` objects leave this field unset.

```yaml
spec:
  parentCompositePodGroupName: root-group-0
```

### Workload reference

The `spec.workloadRef` field links the `CompositePodGroup` back to the
`CompositePodGroupTemplate` in the `Workload` object it was derived from.

```yaml
spec:
  workloadRef:
    workloadName: hierarchical-workload
    templateName: replica-group
```

### Status

The `CompositePodGroup` API schema includes a `status` subresource. In the alpha release,
the `status` field is present in the API type, but `kube-scheduler` does not update or
populate status conditions for `CompositePodGroup` objects. Status tracking for composite
groups will be implemented in future releases.

## Creating a CompositePodGroup

Workload controllers create `CompositePodGroup` objects automatically from `Workload`
templates at runtime.

The following manifest creates a root `CompositePodGroup` with a gang scheduling policy
that requires at least 2 child groups to be schedulable simultaneously:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: CompositePodGroup
metadata:
  name: root-group-0
  namespace: default
spec:
  workloadRef:
    workloadName: hierarchical-workload
    templateName: root
  schedulingPolicy:
    gang:
      minGroupCount: 2
```

You can inspect `CompositePodGroup` resources in your cluster:

```shell
kubectl get compositepodgroups
```

To view details for a specific composite group:

```shell
kubectl describe compositepodgroup root-group-0
```

## How it fits together

The relationship between controllers, Workloads, CompositePodGroups, PodGroups, and
Pods follows this pattern:

1. The workload controller creates a `Workload` defining a tree of
   `CompositePodGroupTemplates` and leaf `PodGroupTemplates`.
2. For each runtime instance, the controller creates a root `CompositePodGroup`,
   descendant `CompositePodGroup` objects, and leaf `PodGroup` objects in a top-down manner.
3. The controller creates `Pods` that reference their leaf `PodGroup` via
   `spec.schedulingGroup.podGroupName`.

The following example illustrates a complete manifest hierarchy for a two-level workload:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: Workload
metadata:
  name: hierarchical-workload
  namespace: default
spec:
  compositePodGroupTemplates:
  - name: root
    schedulingPolicy:
      gang:
        minGroupCount: 2
    podGroupTemplates:
    - name: workers-a
      schedulingPolicy:
        gang:
          minCount: 4
    - name: workers-b
      schedulingPolicy:
        gang:
          minCount: 4
---
apiVersion: scheduling.k8s.io/v1alpha3
kind: CompositePodGroup
metadata:
  name: root-group-0
  namespace: default
spec:
  workloadRef:
    workloadName: hierarchical-workload
    templateName: root
  schedulingPolicy:
    gang:
      minGroupCount: 2
---
apiVersion: scheduling.k8s.io/v1alpha3
kind: PodGroup
metadata:
  name: workers-a-0
  namespace: default
spec:
  parentCompositePodGroupName: root-group-0
  workloadRef:
    workloadName: hierarchical-workload
    templateName: workers-a
  schedulingPolicy:
    gang:
      minCount: 4
---
apiVersion: scheduling.k8s.io/v1alpha3
kind: PodGroup
metadata:
  name: workers-b-0
  namespace: default
spec:
  parentCompositePodGroupName: root-group-0
  workloadRef:
    workloadName: hierarchical-workload
    templateName: workers-b
  schedulingPolicy:
    gang:
      minCount: 4
---
apiVersion: v1
kind: Pod
metadata:
  name: worker-a-0
  namespace: default
spec:
  schedulingGroup:
    podGroupName: workers-a-0
  containers:
  - name: worker
    image: registry.k8s.io/pause:3.9
```

The `Workload` acts as a long-lived policy template, while `CompositePodGroup` and
`PodGroup` resources handle per-instance runtime scheduling state.

## {{% heading "whatsnext" %}}

* Read about the [CompositePodGroup lifecycle](/docs/concepts/workloads/compositepodgroup-api/lifecycle/).
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/) and template definitions.
* See how leaf groups are structured in the [PodGroup API](/docs/concepts/workloads/podgroup-api/).
* Read about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* Learn about [Workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
