---
layout: blog
title: "Kubernetes v1.38: Workload-Aware Scheduling Core Is Now Beta"
draft: true
slug: kubernetes-v1-38-workload-aware-scheduling
author: >
  TBD
# TODO: list the PR author and the area section owners as "Name (Organization)".
---

<!--
  Notes for reviewers (remove before publication):
  * Shared sections: the introduction, "Workload-aware scheduling in v1.38 at a glance",
    "What's next?", "Getting started" and "Learn more".
  * Area sections are self-contained and owned by the respective KEP owners:
    gang scheduling (KEP-4671), workload-aware preemption (KEP-5710),
    topology-aware scheduling (KEP-5732), the CompositePodGroup API (KEP-6012)
    and the controller integration APIs (KEP-6089).
    Please propose changes to your area in dedicated commits.
  * Shared sections link to the area sections only through the explicit heading IDs
    {#gang-scheduling}, {#workload-aware-preemption}, {#topology-aware-scheduling},
    {#compositepodgroup-api} and {#controller-integration-apis}.
    Keep those IDs if you rename a heading.
-->

AI/ML training, batch processing and other distributed workloads need the scheduler
to treat a group of Pods as one unit:
place all of it or none of it, keep it close together on the network,
and preempt it as a whole rather than Pod by Pod.
Since Kubernetes v1.35, the Workload-Aware Scheduling (WAS) effort has been building
these capabilities into `kube-scheduler`, one release at a time.

In Kubernetes v1.38, [topology-aware scheduling](#topology-aware-scheduling) and the
[CompositePodGroup API](#compositepodgroup-api) graduate to Beta.
They join the Workload and PodGroup APIs, [gang scheduling](#gang-scheduling) and
[workload-aware preemption](#workload-aware-preemption), which reached Beta in v1.37.
For the first time, the entire WAS core is Beta,
and all of its APIs are served from `scheduling.k8s.io/v1beta1`.
The [controller integration APIs](#controller-integration-apis), which let workload controllers
expose these capabilities in their own APIs, graduate to Beta as well.

This release is less about new concepts and more about making the existing ones dependable.
`kube-apiserver` and `kube-scheduler` now enforce the same consistency rules at every level of a workload,
scheduling failures are reported on the objects you would check first,
preemption prefers cheaper victims,
and the cost of topology-aware placement stays bounded in large clusters.

## Workload-aware scheduling in v1.38 at a glance {#was-core}

| Area | KEP | Stage in v1.38 | Feature gate | Change since v1.37 |
| --- | --- | --- | --- | --- |
| [Gang scheduling, Workload and PodGroup APIs](#gang-scheduling) | [KEP-4671](https://www.kubernetes.dev/resources/keps/4671/) | Beta | `GenericWorkload` | Stays in Beta |
| [Workload-aware preemption](#workload-aware-preemption) | [KEP-5710](https://www.kubernetes.dev/resources/keps/5710/) | Beta | `GenericWorkload` | Stays in Beta; the PodGroup `preemptionPolicy` field joins the Beta |
| [Topology-aware scheduling](#topology-aware-scheduling) | [KEP-5732](https://www.kubernetes.dev/resources/keps/5732/) | Beta | `TopologyAwareWorkloadScheduling` | Graduates from Alpha |
| [CompositePodGroup API](#compositepodgroup-api) | [KEP-6012](https://www.kubernetes.dev/resources/keps/6012/) | Beta | `CompositePodGroup` | Graduates from Alpha; moves from `v1alpha3` to `v1beta1` |
| [Controller integration APIs](#controller-integration-apis) | [KEP-6089](https://www.kubernetes.dev/resources/keps/6089/) | Beta | None of its own | Graduates from Alpha; building blocks move to `scheduling.k8s.io/v1` |

All of these feature gates are disabled by default, and so is the `scheduling.k8s.io/v1beta1` API group;
[Getting started](#getting-started) lists what to enable.

The plan for this release originally included graduating the Workload and PodGroup APIs,
gang scheduling and workload-aware preemption to General Availability (GA).
With work on preemption still in progress, they stay in Beta for one more release,
and GA is now targeted for v1.39.

If you tried any of these features in v1.37, each area section below ends with
the behavior changes to check before you upgrade.

## Gang scheduling and the Workload and PodGroup APIs {#gang-scheduling}

<!-- Area section owned by the KEP-4671 owners. -->

The Workload and PodGroup APIs, together with gang scheduling, remain in Beta in v1.38.
Most of the work in this release went into the extension point that gang scheduling is built on,
and into making it obvious why a group is not being scheduled.

### `PlacementFeasible` is now a configurable extension point

During a [PodGroup scheduling cycle](/docs/concepts/scheduling-eviction/podgroup-scheduling/),
`kube-scheduler` evaluates the Pods of a group one by one against a single snapshot of the cluster.
After each Pod, `PlacementFeasible` plugins decide whether the placement found so far
already satisfies the group's requirements, could still satisfy them once the remaining Pods are evaluated,
or can no longer satisfy them, in which case the scheduler stops evaluating the group early.
The `GangScheduling` plugin uses this to enforce `minCount` for PodGroups
and `minGroupCount` for CompositePodGroups.

Starting with v1.38, `placementFeasible` is an extension point that you can configure in
[`KubeSchedulerConfiguration`](/docs/reference/scheduling/config/#extension-points),
so out-of-tree plugins can implement their own feasibility rules for groups:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
- schedulerName: default-scheduler
  plugins:
    placementFeasible:
      enabled:
      - name: ExampleGroupFeasibility # an out-of-tree plugin
```

Because `PlacementFeasible` now covers what gang scheduling previously used `Permit` for,
the `GangScheduling` plugin no longer implements the `Permit` extension point;
it works exclusively through `PreEnqueue` and `PlacementFeasible`.

### Clearer reasons when a group cannot be scheduled

When a Pod cannot be scheduled because its PodGroup failed as a whole,
the Pod's `PodScheduled` condition now points at the group
instead of repeating the group's failure details in every Pod:

```
parent pod group "training-workers" is unschedulable
```

The details are reported once, in the `PodGroupInitiallyScheduled` condition of the PodGroup,
and they are more precise than before.
For a gang that cannot reach its `minCount`, the message tells you how far it got
(trimmed output of `kubectl get podgroup training-workers -o yaml`):

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: training-workers
spec:
  schedulingPolicy:
    gang:
      minCount: 8
status:
  conditions:
  - type: PodGroupInitiallyScheduled
    status: "False"
    reason: Unschedulable
    message: "scheduling policy's minimum threshold (8) cannot be satisfied: 5 scheduled, 1 unschedulable, 2 not-evaluated"
```

A new `PodGroupError` reason separates configuration problems from capacity problems.
If the Pods of a group don't all use the same `schedulerName`,
or don't match the group's `priority` or `preemptionPolicy`,
the scheduler doesn't attempt to schedule the group and reports `PodGroupError` on the PodGroup,
rather than just marking each of its Pods as unschedulable.
Also, a race that could flip an already `True` `PodGroupInitiallyScheduled` condition back to `False` has been fixed.

### A note for controller authors

`kube-scheduler` identifies a PodGroup by its namespace and name.
If a controller replaces a PodGroup with a new one that has the same name but a different scheduling policy,
Pods can be placed according to the wrong policy.
Use a new name for every runtime PodGroup instance, for example by deriving it from the UID of the owning object.
The [`workloadbuilder`](/docs/concepts/workloads/workload-api/workloadbuilder/) library provides
`GenerateWorkloadName` and `GeneratePodGroupName` helpers that do exactly that.

**Upgrading from v1.37:**

* If a custom `KubeSchedulerConfiguration` lists `GangScheduling` under `plugins.permit.enabled`,
  remove that entry before upgrading; otherwise `kube-scheduler` fails to start.

## Workload-aware preemption {#workload-aware-preemption}

<!-- Area section owned by the KEP-5710 owners. -->

Workload-aware preemption lets `kube-scheduler` evict lower-priority Pods and groups
across many nodes at once to make room for a whole PodGroup,
while honoring the `disruptionMode` of the groups it preempts.
It remains in Beta in v1.38 as part of the `GenericWorkload` feature gate,
and it got considerably better at choosing what to preempt.

### Victim-aware node ranking

To find room for a preemptor PodGroup, the scheduler simulates removing all potential victims,
runs the PodGroup scheduling algorithm once, and then reprieves as many victims as it can.
Until now, all nodes looked equally empty during that simulated pass,
so the Pods of the preemptor could scatter across nodes with expensive victims
even when free nodes, or nodes already being cleared for the same group, were available.

In v1.38, the `DefaultPreemption` plugin ranks candidate nodes by preemption cost during that pass,
before each Pod of the group is filtered and scored:

1. Nodes that need no additional evictions rank best.
   These are nodes without potential victims, and nodes whose victims were already condemned
   by earlier Pods of the same group (for example, the remaining nodes of a multi-node victim group
   with the `all` disruption mode).
2. Other nodes are ordered by preemption cost: fewer PodDisruptionBudget violations first,
   then lower-priority victims and fewer of them,
   and finally less important victim types (standalone Pods before PodGroups,
   PodGroups before CompositePodGroups, smaller groups before larger ones).
3. Score plugins only break ties between feasible nodes within the best available rank.
4. Once a Pod of the group is tentatively placed on a node, the victims on that node are marked as condemned,
   so the remaining Pods of the group see updated ranks.

In a benchmark used during development, where a high-priority PodGroup needed half of a 1,000-node cluster,
this reduced the number of evicted Pods from 600 to 100, which is the minimum needed to fit the group.
To track condemned victims, `DefaultPreemption` now also implements the `Reserve` extension point,
which is enabled by default when the `GenericWorkload` feature gate is enabled.

### Group-level preemption policy joins the Beta

In v1.37, PodGroups, CompositePodGroups and Workload templates gained a `preemptionPolicy` field,
gated by the separate Alpha `PodGroupPreemptionPolicy` feature gate.
In v1.38 that feature gate is removed, and the field is part of the Beta API,
gated by `GenericWorkload` (and by `CompositePodGroup` for CompositePodGroups).

The field works like `preemptionPolicy` on Pods: if you omit it,
the priority admission controller fills it in from the group's PriorityClass.
It is authoritative for the whole group.
A PodGroup with `preemptionPolicy: Never` never triggers workload-aware preemption,
and every Pod in the group must use the same policy as the group:

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority-nonpreempting
value: 1000000
preemptionPolicy: Never
---
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: analytics-workers
spec:
  priorityClassName: high-priority-nonpreempting
  # preemptionPolicy: Never is filled in from the PriorityClass.
  schedulingPolicy:
    gang:
      minCount: 8
```

Two consistency rules come with it:

* `kube-apiserver` rejects newly created Workloads whose templates don't all share
  the same `preemptionPolicy`, as it already did for `priorityClassName` and `priority`.
* `kube-scheduler` doesn't schedule a PodGroup whose Pods don't match its `preemptionPolicy`,
  and reports the mismatch with the `PodGroupError` reason.

PodGroups created in v1.37 without `preemptionPolicy` keep working:
for them, the scheduler falls back to the previous behavior,
which requires all Pods in the group to share the same `preemptionPolicy` and uses it for the group.

**Other improvements:**

* The `all` disruption mode now requires the `gang` scheduling policy:
  `kube-apiserver` rejects new PodGroups, CompositePodGroups and Workload templates
  that combine `all` with the `basic` policy. Existing objects can still be updated.
* When choosing victims, Pods of groups with the `single` disruption mode now rank as individual Pods,
  instead of above standalone Pods of the same priority.
* Nominations are cleaned up more reliably: the scheduler clears stale `nominatedNodeName` values
  of PodGroup Pods that failed or were left unplaced, and clears the nominations of lower-priority Pods
  on every node nominated for a preempting PodGroup.
* At startup, `kube-scheduler` logs an error for every enabled `PostFilter` plugin
  that is not also enabled at `PodGroupPostFilter`, because such plugins never run for Pods of a PodGroup.
* Preemption metrics now distinguish PodGroup and CompositePodGroup preemptors,
  and `scheduler_preemption_workload_disruptions` has a new `victim` label
  (`pod`, `podgroup` or `compositepodgroup`).

**Upgrading from v1.37:**

* Remove `PodGroupPreemptionPolicy` from the `--feature-gates` flags;
  Kubernetes components refuse to start when they are given an unrecognized feature gate.
* New Workloads must use the same `preemptionPolicy` in all templates;
  a mix of set and unset values is rejected as well.
* New PodGroups, CompositePodGroups and Workload templates can no longer combine
  the `all` disruption mode with the `basic` scheduling policy.
* If a custom `KubeSchedulerConfiguration` disables `DefaultPreemption` at the `Reserve` extension point,
  workload-aware preemption falls back to unranked node selection.

## Topology-aware scheduling {#topology-aware-scheduling}

<!-- Area section owned by the KEP-5732 owners. -->

Topology-aware scheduling (TAS) keeps the Pods of a group within a single topology domain,
such as a rack or a zone, which matters for distributed training
and other workloads that are sensitive to network latency between their Pods.
You request it with a topology constraint on a PodGroup, or on its template in a Workload:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: training-workers
spec:
  schedulingPolicy:
    gang:
      minCount: 8
  schedulingConstraints:
    topology:
    - key: topology.example.com/rack
```

For such a group, `kube-scheduler` generates candidate placements, one for each value of the node label,
checks whether the group fits into each of them, and picks the best feasible one.
In v1.38, TAS graduates to Beta, behind the `TopologyAwareWorkloadScheduling` feature gate.
The Beta focuses on predictable performance in large clusters
and on working well with the rest of the WAS core.

### Bounded placement evaluation

Checking a placement means simulating the whole group on that placement's nodes,
so in large clusters with fine-grained topology keys, checking every candidate placement gets expensive.
Similar to how `percentageOfNodesToScore` limits node scoring for individual Pods,
the new `percentageOfPlacementsToScore` setting limits how many feasible placements the scheduler looks for
before it stops searching and scores the ones it found.
For example, if 500 placements are generated and the value is 30,
the scheduler stops after finding 150 feasible placements.
You can set it globally or per scheduling profile:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
percentageOfPlacementsToScore: 30
profiles:
- schedulerName: default-scheduler
```

When the setting is unset or `0`, the scheduler adapts the percentage to the size of the problem.
It decreases linearly from 100% when the generated placements contain few nodes in total,
to 10% when they contain 5,000 nodes, and keeps decreasing beyond that, down to a minimum of 5%.
The scheduler always tries to find at least one feasible placement.

### Preemption and nominated nodes

TAS works together with workload-aware preemption:
if no topology domain has enough free capacity,
the scheduler can preempt lower-priority workloads to make room for the group within a single domain.
After a preemption, the Pods of the group are nominated to the nodes being freed up.
Placement selection now respects these nominations and evaluates the placement
that contains the nominated nodes first,
so the group doesn't end up in a different domain than the one where victims were just evicted.
This also applies within CompositePodGroup hierarchies.

### Composable placement generation

You can now configure more than one `PlacementGenerate` plugin.
The scheduler runs them independently and intersects their results,
so you can combine topology-based placements with placements produced by another plugin,
for example an out-of-tree one.

**Other improvements:**

* Nodes whose topology label value is an empty string are no longer treated as a topology domain.
* Placement metrics (`scheduler_generated_placements_total`, `scheduler_placement_evaluations_total`
  and `scheduler_placement_evaluation_duration_seconds`) now distinguish PodGroups from CompositePodGroups.
* As in v1.37, each group can specify a single topology constraint.

**Upgrading from v1.37:**

* With `TopologyAwareWorkloadScheduling` enabled, the scheduler now evaluates an adaptive subset
  of placements by default. To keep evaluating all placements as in v1.37,
  set `percentageOfPlacementsToScore: 100`.

## CompositePodGroup API {#compositepodgroup-api}

<!-- Area section owned by the KEP-6012 owners. -->

The CompositePodGroup API, introduced in v1.37, describes a workload made of several groups as a tree:
CompositePodGroups group other groups, and PodGroups at the leaves group Pods.
Typical examples are the replicated jobs of a JobSet,
or the leader and worker groups of a disaggregated inference deployment.
`kube-scheduler` schedules such a tree as a single unit,
with gang scheduling, topology constraints and preemption rules at every level.

In v1.38, the CompositePodGroup API graduates to Beta and moves to `scheduling.k8s.io/v1beta1`,
behind the `CompositePodGroup` feature gate.
The Beta makes hierarchies observable, elastic, and harder to get wrong.

### Status at every level of the hierarchy

In v1.37, the scheduler didn't populate the `status` of CompositePodGroups.
Now it sets a `CompositePodGroupInitiallyScheduled` condition on every CompositePodGroup in a hierarchy,
with one of the `Scheduled`, `Unschedulable`, `CompositePodGroupError` or `SchedulerError` reasons:

```shell
kubectl get compositepodgroup training-root -o jsonpath='{.status.conditions}'
```

Failures are also propagated down the tree.
A child group can fit on its own and still not be scheduled, because a requirement of its parent wasn't met.
In that case, the scheduler marks the affected descendant groups and Pods as `Unschedulable`,
with a message that names the failed ancestor,
so you don't have to walk up the tree to find the cause.

### Elastic hierarchies with a mutable `minGroupCount`

`minGroupCount` in the `gang` policy of a CompositePodGroup, and of a `CompositePodGroupTemplate` in a Workload,
is now mutable, matching `minCount` on PodGroups.
A controller can lower it to let a smaller part of a multi-level workload start,
or raise it as the workload grows.
Changes apply to future scheduling cycles and don't affect Pods that are already scheduled;
when `minGroupCount` decreases, the scheduler re-queues the pending hierarchy for another attempt.

### Stricter validation and deletion protection

* At creation time, `kube-apiserver` rejects Workloads whose templates break the parent-child rules:
  children of a `CompositePodGroupTemplate` with the `gang` policy must use the `gang` policy too,
  and children of a template with the `all` disruption mode must use `all` as well.
* Before scheduling, `kube-scheduler` validates the runtime hierarchy:
  all groups must refer to the same Workload, all groups and Pods must share the same
  `schedulerName`, `priority` and `preemptionPolicy`, and policies, disruption modes and depth must be valid.
  It reports violations with the `CompositePodGroupError` and `PodGroupError` reasons
  instead of trying to schedule the hierarchy.
* The maximum depth of a hierarchy increases from 4 to 5 levels
  (up to 4 levels of CompositePodGroups above the leaf PodGroups),
  and each template list still holds up to 8 entries.
* The `scheduling.k8s.io/compositepodgroup-protection` finalizer keeps a CompositePodGroup from being deleted
  while child groups still refer to it, so hierarchies are always cleaned up bottom-up.

### Designing hierarchies that schedule well

Finding an optimal placement for a multi-level workload is NP-hard,
so `kube-scheduler` evaluates sibling groups greedily, in a single pass, without backtracking.
When heterogeneous siblings compete for the same capacity,
the order of evaluation can decide whether a placement is found.
The documentation now includes
[workload design recommendations](/docs/concepts/scheduling-eviction/podgroup-scheduling/#workload-design-recommendations)
that make such failures much less likely:

* Keep each PodGroup homogeneous, and split distinct roles, such as a driver and its workers,
  into separate PodGroups under a common parent.
* Steer heterogeneous groups that don't need the same hardware onto disjoint sets of nodes,
  using node selectors, node affinity, or taints and tolerations.
* Attach topology constraints only to the subtrees that need co-location,
  rather than to the root of the hierarchy by default.

**Upgrading from v1.37:**

* Switch CompositePodGroup manifests and clients from `scheduling.k8s.io/v1alpha3`
  to `scheduling.k8s.io/v1beta1`.
* Existing hierarchies that combine a `gang` parent with `basic` children,
  or an `all` parent with `single` children, are no longer scheduled;
  `kube-scheduler` reports `CompositePodGroupError` for them.

## Controller integration APIs {#controller-integration-apis}

<!-- Area section owned by the KEP-6089 owners. -->

Most people won't create Workloads and PodGroups by hand:
they expect the controllers they already use, such as Job, JobSet or a training operator,
to do it for them.
The controller integration APIs, introduced in v1.37, give controller authors two tools for that:

* reusable API _building blocks_ for the scheduling policy, scheduling constraints, disruption mode
  and shared ResourceClaims, which a controller embeds in its own API,
  so that users configure workload-aware scheduling the same way across controllers;
* the `workloadbuilder` Go library, which validates that configuration
  and compiles it into Workload, PodGroup and CompositePodGroup objects.

In v1.38, the controller integration APIs graduate to Beta.

### Building blocks move to `scheduling.k8s.io/v1`

The building blocks are meant to be embedded in stable APIs,
such as the `spec.scheduling` field of a Job in `batch/v1`.
Changing the Go import path of an embedded type would break client libraries,
and fields of `v1` resources are expected to keep their wire format.
So instead of passing through a `v1beta1` package, the building blocks graduate directly
into the `k8s.io/api/scheduling/v1` package.
This is how the Job API composes them:

```go
import schedulingv1 "k8s.io/api/scheduling/v1"

// JobSchedulingConfiguration is the type of the spec.scheduling field of a Job.
type JobSchedulingConfiguration struct {
    SchedulingPolicy      *schedulingv1.WorkloadPodGroupSchedulingPolicy
    SchedulingConstraints *schedulingv1.WorkloadPodGroupSchedulingConstraints
    DisruptionMode        *schedulingv1.WorkloadPodGroupDisruptionMode
    ResourceClaims        []schedulingv1.WorkloadPodGroupResourceClaim
}
```

The types in `k8s.io/api/scheduling/v1alpha3` remain as Go type aliases of the new ones,
so existing controllers keep compiling while they update their imports.
The leaf (`WorkloadPodGroup...`) and composite (`WorkloadCompositePodGroup...`) constraint blocks
now share a single `WorkloadTopologyConstraint` type.
The building blocks are not API resources and have no feature gate of their own;
users see them through the controllers that embed them.

### A stricter, more helpful `workloadbuilder`

In v1.38, the library:

* compiles all objects to `scheduling.k8s.io/v1beta1`, CompositePodGroups included;
* validates the hierarchy rules that `kube-apiserver` enforces for Workloads:
  depth and size limits, `gang` children under `gang` parents, `all` children under `all` parents,
  and a single priority class name across the whole tree.
  Errors point at the fields of the controller's own API,
  so the controller can reject invalid input before it creates any scheduling objects;
* copies the `preemptionPolicy` of a template to the PodGroups and CompositePodGroups created from it;
* provides `GenerateWorkloadName` and `GeneratePodGroupName`, which derive deterministic names
  from the owner's UID, so a re-created owner doesn't collide with objects left over by its predecessor,
  and sibling owners that use the same template get separate PodGroups.

One thing to keep in mind: `kube-apiserver` silently drops compiled fields whose feature gates are disabled,
for example `schedulingConstraints` when `TopologyAwareWorkloadScheduling` is off,
so a successful create doesn't mean that every field was stored.

### Delegating group creation across controllers

Some controllers create objects that other controllers turn into Pods.
For example, a Kubeflow TrainJob creates a JobSet, which in turn creates Jobs.
The TrainJob controller can compile the Workload for the whole training run,
but it can't give each of those Jobs its own PodGroup, because it doesn't create the Jobs.
In such chains, the parent controller passes the details down
as well-known annotations on the object it creates,
and the lower-level controller creates the groups:

* `scheduling.k8s.io/workload-name`, new in v1.38, names the Workload that holds the template,
  so a controller at any depth can fetch it directly instead of walking owner references;
* `scheduling.k8s.io/group-template-name` names the template to create the groups from;
* `scheduling.k8s.io/parent-compositepodgroup` names the CompositePodGroup that the new groups attach to.

The lower-level controller reads these annotations, fetches the Workload,
and calls `NewBuilderFromExistingWorkload` to create PodGroups or CompositePodGroups
from the named template, without recompiling the Workload.
The built-in Job, Deployment and ReplicaSet controllers honor the Workload and template annotations,
and the Job controller also honors the parent annotation.

### Adoption

Since the Alpha release, controllers across the ecosystem, including JobSet, LeaderWorkerSet,
Kubeflow Trainer and the Spark Operator, have designed or started implementing integrations
based on the building blocks.
Inside Kubernetes, the
[Job controller integration](/docs/concepts/workloads/controllers/job/#integrate-with-workload-apis)
graduates to Beta in v1.38, behind the `WorkloadWithJob` feature gate,
and the Deployment and ReplicaSet controllers gain an
[Alpha integration](/docs/concepts/workloads/controllers/deployment/#automatic-podgroup-management),
behind the `WorkloadWithDeployment` feature gate.

**Upgrading from v1.37 (for controller authors):**

* Import the building blocks from `k8s.io/api/scheduling/v1`.
  The `v1alpha3` aliases keep existing code compiling, but new code should use `v1`.
* The constraint blocks now hold `WorkloadTopologyConstraint` values
  instead of `v1alpha3.TopologyConstraint`; update code that builds them.
* `NewCompositePodGroup` now returns a `scheduling.k8s.io/v1beta1` CompositePodGroup.
* `Validate` now rejects trees that `kube-apiserver` would reject anyway,
  such as `basic` children under a `gang` parent or mixed priority class names.

## What's next? {#whats-next}

With the entire core in Beta, the focus of the
[Workload-Aware Scheduling Working Group](https://www.kubernetes.dev/community/community-groups/wg/workload-aware-scheduling/)
shifts to maturity and adoption:

* **GA for the foundation:** the Workload and PodGroup APIs, gang scheduling, workload-aware preemption
  and the controller integration APIs are targeted to graduate to GA in v1.39,
  with topology-aware scheduling and the CompositePodGroup API following as they mature.
* **Ecosystem integration:** helping controllers such as
  [JobSet](https://github.com/kubernetes-sigs/jobset) and
  [LeaderWorkerSet](https://github.com/kubernetes-sigs/lws) complete their integrations
  based on the controller integration APIs, and aligning queueing systems such as
  [Kueue](https://kueue.sigs.k8s.io/) with workload-aware scheduling,
  so that none of them has to implement gang scheduling and topology-aware placement on its own.
* **Your feedback:** Beta is the best time to tell us what doesn't work for your workloads,
  while the APIs can still change.

The priority and order of this work are subject to change.

## Getting started {#getting-started}

The scheduling features in this article are Beta and disabled by default.
To try them out in a test cluster:

1. Enable the `scheduling.k8s.io/v1beta1`
   {{< glossary_tooltip text="API group" term_id="api-group" >}} on `kube-apiserver`
   with `--runtime-config=scheduling.k8s.io/v1beta1=true`.
2. Enable the feature gates for the features you want to use:
   * [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
     on `kube-apiserver`, `kube-controller-manager` and `kube-scheduler`
     enables the Workload and PodGroup APIs, gang scheduling and workload-aware preemption.
   * [`TopologyAwareWorkloadScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#TopologyAwareWorkloadScheduling)
     on `kube-apiserver` and `kube-scheduler` enables topology-aware scheduling.
     It requires `GenericWorkload`.
   * [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
     on `kube-apiserver`, `kube-controller-manager` and `kube-scheduler` enables the CompositePodGroup API.
     It requires both `GenericWorkload` and `TopologyAwareWorkloadScheduling`
     on every component where you enable it.
   * [`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadWithJob)
     on `kube-apiserver` and `kube-controller-manager` lets Jobs request these features
     through `spec.scheduling`. It requires `GenericWorkload`.

For example, to enable all of them:

```shell
# kube-apiserver
--runtime-config=scheduling.k8s.io/v1beta1=true
--feature-gates=GenericWorkload=true,TopologyAwareWorkloadScheduling=true,CompositePodGroup=true,WorkloadWithJob=true

# kube-controller-manager
--feature-gates=GenericWorkload=true,TopologyAwareWorkloadScheduling=true,CompositePodGroup=true,WorkloadWithJob=true

# kube-scheduler
--feature-gates=GenericWorkload=true,TopologyAwareWorkloadScheduling=true,CompositePodGroup=true
```

If you maintain a workload controller, the building blocks are in the `k8s.io/api/scheduling/v1` package,
and the `workloadbuilder` library, together with usage examples, is in
[`k8s.io/component-helpers`](https://github.com/kubernetes/component-helpers/tree/master/scheduling/schedulingv1/workloadbuilder).
Neither needs a feature gate of its own, but the objects that the library compiles
are only served when the API group and feature gates above are enabled.

We encourage you to try out workload-aware scheduling in your test clusters
and share your experiences to help shape the future of Kubernetes scheduling.
You can send your feedback by:

* Reaching out via [Slack (#wg-workload-aware-scheduling)](https://kubernetes.slack.com/archives/C0AHLJ0EAEL).
* Joining the [WG Workload-Aware Scheduling](https://www.kubernetes.dev/community/community-groups/wg/workload-aware-scheduling/)
  or [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/#meetings) meetings.
* Filing a new [issue](https://github.com/kubernetes/kubernetes/issues) in the Kubernetes repository.

## Learn more {#learn-more}

To learn how to use these features, read the documentation:

* [Workload API](/docs/concepts/workloads/workload-api/),
  [PodGroup API](/docs/concepts/workloads/podgroup-api/) and
  [CompositePodGroup API](/docs/concepts/workloads/compositepodgroup-api/)
* [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/) and
  [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)
* [Workload-aware preemption](/docs/concepts/scheduling-eviction/workload-aware-preemption/)
* [Topology-aware workload scheduling](/docs/concepts/workloads/workload-api/topology-aware-scheduling/)
* [Scheduling building block APIs and the `workloadbuilder` library](/docs/concepts/workloads/workload-api/workloadbuilder/)

To dive deeper into the architecture and design of these features, read the KEPs:

* [KEP-4671: Gang Scheduling Support in Kubernetes](https://www.kubernetes.dev/resources/keps/4671/)
* [KEP-5710: Workload-aware preemption](https://www.kubernetes.dev/resources/keps/5710/)
* [KEP-5732: Topology-aware workload scheduling](https://www.kubernetes.dev/resources/keps/5732/)
* [KEP-6012: CompositePodGroup API](https://www.kubernetes.dev/resources/keps/6012/)
* [KEP-6089: WAS: Controller Integration APIs](https://www.kubernetes.dev/resources/keps/6089/)
