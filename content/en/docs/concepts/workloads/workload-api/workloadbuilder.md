---
title: Scheduling Building Block APIs and the workloadbuilder Library
content_type: concept
description: >-
  Reusable scheduling API primitives that in-tree and out-of-tree workload controllers embed
  in their own APIs, and the shared workloadbuilder library that compiles them into Workload,
  PodGroup, and CompositePodGroup objects.
weight: 40
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Workload-aware Scheduling defines a set of reusable API *building blocks* under the
`scheduling.k8s.io` {{< glossary_tooltip text="API group" term_id="api-group" >}}.
Controller authors embed these primitives into their own APIs so that users express
scheduling intent (gang scheduling, topology, disruption behavior) with a consistent
schema across the ecosystem, and the shared `workloadbuilder` library compiles that
intent into the scheduler-facing [Workload](/docs/concepts/workloads/workload-api/),
[PodGroup](/docs/concepts/workloads/podgroup-api/), and [CompositePodGroup](/docs/concepts/workloads/workload-api/compositepodgroup-api/) objects.

The built-in consumer of these building blocks today is the
[Job](/docs/concepts/workloads/controllers/job/) controller, gated by the
`WorkloadWithJob` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

<!-- body -->

## Reusable building blocks

The building blocks are strongly-typed Go structs in the `scheduling.k8s.io/v1alpha3`
API group. They are meant for *controller authors*: a controller embeds these structs into
its own API type as fields, and the `workloadbuilder` library compiles them. The type names
follow two conventions: leaf-level types are prefixed `WorkloadPodGroup...` (for example,
`WorkloadPodGroupSchedulingPolicy`) and the multi-level variants - `WorkloadCompositePodGroup...`.

Each controller chooses the field names and structure that are idiomatic for its own API, so
these blocks impose no fixed top-level shape. Although not strictly enforced, reusing the 
standard field names and structure is recommended, so that a user who has configured gang 
scheduling on one controller's resource recognizes the same options on another's.

To adopt the building blocks, a controller adds the ones it wants to support as fields on
its own types. For example, the [Job](/docs/concepts/workloads/controllers/job/) API groups
all four of them into a single type reachable at `spec.scheduling`:

```go
type JobSchedulingConfiguration struct {
    SchedulingPolicy      *schedulingv1alpha3.WorkloadPodGroupSchedulingPolicy
    SchedulingConstraints *schedulingv1alpha3.WorkloadPodGroupSchedulingConstraints
    DisruptionMode        *schedulingv1alpha3.WorkloadPodGroupDisruptionMode
    ResourceClaims        []schedulingv1alpha3.WorkloadPodGroupResourceClaim
}
```

A different controller might nest the same blocks per component of a multi-part workload,
or support only a subset of them.

### Scheduling policy

The scheduling policy block carries the same `basic` and `gang` policies as a PodGroup's
`spec.schedulingPolicy`. See 
[PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/)
for what each policy means and how the scheduler applies it.

The one difference is that the block's `gang` minimum count is optional. Users may leave
`minCount` unset, in which case the controller supplies a default that makes sense for its
own domain; the Job controller, for example, uses the Job's parallelism.

### Scheduling constraints

The scheduling constraints block carries the topology constraints documented in
[Topology-aware workload scheduling](/docs/concepts/workloads/workload-api/topology-aware-scheduling/):
a node label key naming the domain (such as a rack or a zone) that every Pod in the group
must share, with at most one topology constraint per group. Controllers should freeze the
field after creation, since constraints are immutable in the compiled Workload.

### Disruption mode

The disruption mode block selects whether the group's Pods may be disrupted individually
(`single`) or only as a unit (`all`), corresponding to the `Pod` and `PodGroup` disruption
modes documented in
[Pod group disruption and priority](/docs/concepts/workloads/workload-api/disruption-and-priority/).

The library rejects combinations that are not meaningful. For example, prevent `all` disruption mode 
for PodGroups with BasicSchedulingPolicy, because the preemption unit must not be larger than the 
scheduling unit - a group scheduled pod-by-pod has no group-level unit to preempt or disrupt.

### Resource claims

The resource claims block expresses which
[dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
claims are shared by every Pod in the group rather than allocated per Pod. Each entry names
the claim within the group and points at either an existing
{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}} or a
{{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}
from which one is generated. A group may declare at most four claims.

Pods consume the devices allocated to the group by declaring a matching claim in their own
spec, using the same name and referring to the same object.

### Composite building blocks

Multi-level controllers that orchestrate other controllers (for example, JobSet
creating Jobs) coordinate a *group of groups*. For that layer, the API provides an
analogous set of primitives prefixed with `WorkloadCompositePodGroup...`
(for example `WorkloadCompositePodGroupSchedulingPolicy`). They follow the same shapes as
the leaf-level blocks, except the composite gang policy uses `minGroupCount` (the minimum
number of child groups that must be schedulable together) in place of the leaf's
`minCount`. Keeping leaf and composite types distinct lets each hierarchy level evolve
independently.

### Example: the Job integration

The Job controller is the built-in example of these blocks in use. A user fills in a Job's
`spec.scheduling`, and the controller compiles it into a Workload and PodGroup. See
[Integrate with Workload APIs](/docs/concepts/workloads/controllers/job/#integrate-with-workload-apis)
for a complete Job manifest, the defaults that apply when `spec.scheduling` is omitted, and
which fields you can change after creation.

## The workloadbuilder library

`workloadbuilder` is a shared Go library that turns a controller's scheduling intent into
the scheduler-facing Workload and its runtime PodGroup/CompositePodGroup objects, so each
controller does not reimplement defaulting, validation, and template compilation. It is designed for both
in-tree controllers (such as the Job controller) and out-of-tree controllers (such as
JobSet or Kubeflow TrainJob), which vendor it like any other Go dependency. It ships from
`k8s.io/component-helpers/scheduling/schedulingv1/workloadbuilder`.

The library consumes the `scheduling.k8s.io/v1alpha3` building blocks and compiles them into
`scheduling.k8s.io/v1beta1` Workload and PodGroup objects, while CompositePodGroup
objects remain `scheduling.k8s.io/v1alpha3`.

### How a controller uses it

A controller describes its workload as a tree of `WorkloadItem` nodes, one per logical
component. A node with no children becomes a single `PodGroupTemplate`, while a node with
children becomes a `CompositePodGroupTemplate` over them, which is how a multi-level
controller represents a group of groups. Each node carries:

* a *default config*, the controller's own defaults for anything the user leaves unset. This
  is where a controller decides, for example, that an unconfigured Job stays on `basic`
  scheduling.
* an *input*, the user's intent taken from the controller's API. The controller records each
  building block together with the field path it lives at, so validation errors point at the
  exact field the user set.
* optional *callbacks*, which adjust the merged configuration. This is how a controller
  supplies a context-specific default, such as filling in an unset gang minimum count from
  the Job's parallelism.

The controller then hands that tree to a `Builder` and works through four calls:

1. `NewBuilder` constructs the builder from the tree, along with the name, namespace, and
   owner reference for the object to be produced. The owner becomes the Workload's
   controller reference, which is used for discovery and garbage collection.
1. `Validate` resolves the tree and reports any problems as a list of field errors, which a
   controller returns from its own API validation.
1. `BuildWorkload` compiles the tree into a Workload. The result is cached, so several
   PodGroups can be created from one compiled result.
1. `NewPodGroup` creates a runtime PodGroup from one of the compiled templates, naming the
   template it should be built from.

```go
builder := workloadbuilder.NewBuilder(item, opts)
if errs := builder.Validate(ctx, workloadbuilder.ValidationInput{}); len(errs) > 0 {
    // reject the request
}
workload, err := builder.BuildWorkload()
podGroup, err := builder.NewPodGroup("trainer-pg", item.Name)
```

For complete, runnable versions of this flow, including how the Job controller wires it up,
see the examples in the
[package reference](https://pkg.go.dev/k8s.io/component-helpers/scheduling/schedulingv1/workloadbuilder).

### Validating a scheduling configuration

`Validate` checks a configuration in two layers:

* **Structural validation** of the building blocks themselves: required fields, value ranges,
  the rule that exactly one member of a union is set, and immutability. These checks come from
  [declarative validation](/docs/reference/using-api/declarative-validation/) rules generated
  from the API types.
* **Controller-policy checks** that declarative validation cannot express: the allow-lists
  described below, and cross-field rules such as rejecting the `all` disruption mode alongside
  the `basic` policy.

Validation also differs between creating and updating an object. On an update, the library
additionally enforces the fields that are frozen after creation, which means the controller
has to supply the previously stored configuration along with the new one. On a create there is
nothing to compare against, so those checks do not apply.

#### Opting out of declarative validation

Whether you want the first layer depends on where your controller runs, and one option
controls it:

* **Out-of-tree controllers** leave declarative validation enabled, which is the default.
  Nothing else applies those structural rules to a custom resource, so a single `Validate`
  call covers both layers.
* **In-tree controllers** set `DisableDeclarativeValidation`, because the API server already
  runs declarative validation on the embedded blocks while validating the parent object.
  Skipping the first layer avoids checking the same fields twice, leaving `Validate` to run
  only the controller-policy checks.

#### Opting in to scheduling options

Because the building-block types are shared across controllers, future releases may add
scheduling options that do not make sense for every controller. To keep new options from
silently leaking in, `workloadbuilder` uses an allow-list model: a controller declares the
policies and disruption modes it supports, and `Validate` rejects anything outside that set,
reporting the error at the offending block's field path.

Options are therefore denied by default. When a new policy is introduced, an existing
controller keeps rejecting it until its maintainers extend the allow-list, which for an
out-of-tree controller means updating its vendored copy of the library as well.

```go
builder := workloadbuilder.NewBuilder(item, workloadbuilder.BuildOptions{
    Owner:                  owner,
    AllowedPolicies:        []workloadbuilder.SchedulingPolicyOption{workloadbuilder.BasicPolicy, workloadbuilder.GangPolicy},
    AllowedDisruptionModes: []workloadbuilder.DisruptionModeOption{workloadbuilder.SingleMode, workloadbuilder.AllMode},
})
allErrs := builder.Validate(ctx, workloadbuilder.ValidationInput{})
```

### Generating PodGroups from an existing Workload

When the Workload already exists, whether compiled by a parent controller or created manually,
a child controller that only manages the runtime PodGroup uses `NewBuilderFromExistingWorkload`
instead. That builder creates PodGroup objects from the supplied Workload using its own owner
reference. It does not validate or compile anything, so the existing Workload is never
recompiled.

```go
builder := workloadbuilder.NewBuilderFromExistingWorkload(parentWorkload, workloadbuilder.BuildOptions{Owner: owner})
podGroup, err := builder.NewPodGroup("trainer-pg", "trainer-pgt-0")
```

## {{% heading "whatsnext" %}}

* Learn about [PodGroup scheduling policies](/docs/concepts/workloads/workload-api/policies/).
* Learn about [Pod group disruption and priority](/docs/concepts/workloads/workload-api/disruption-and-priority/).
* Learn about [Topology-aware workload scheduling](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* See the [Workload API](/docs/concepts/workloads/workload-api/) overview.
* See how the Job controller [integrates with the Workload APIs](/docs/concepts/workloads/controllers/job/#integrate-with-workload-apis).
* Read the [`workloadbuilder` package reference](https://pkg.go.dev/k8s.io/component-helpers/scheduling/schedulingv1/workloadbuilder).
