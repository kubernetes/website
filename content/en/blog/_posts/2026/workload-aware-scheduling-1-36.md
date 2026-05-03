---
layout: blog
title: "Kubernetes v1.36: Advancing Workload-Aware Scheduling"
draft: true
date: 2026-XX-XX
slug: kubernetes-v1-36-advancing-workload-aware-scheduling
author: >
  Maciej Skoczeń (Google),
  Antoni Zawodny (Google),
  Matt Matejczyk (Google),
  Bartosz Rejman (Google),
  Jon Huhn (Microsoft),
  Maciej Wyrzuc (Google),
  Heba Elayoty (Microsoft)
---

AI/ML and batch workloads introduce unique scheduling challenges that go beyond simple Pod-by-Pod scheduling.
In Kubernetes v1.35, we introduced the first tranche of *workload-aware scheduling* improvements,
featuring the foundational Workload API alongside basic *gang scheduling* support built on a Pod-based framework,
and an *opportunistic batching* feature to efficiently process identical Pods.

Kubernetes v1.36 introduces a significant architectural evolution by cleanly separating API concerns:
the Workload API acts as a static template, while the new PodGroup API handles the runtime state.
To support this, the `kube-scheduler` features a new *PodGroup scheduling cycle* that enables atomic workload processing
and paves the way for future enhancements. This release also debuts the first iterations of *topology-aware scheduling*
and *workload-aware preemption* to advance scheduling capabilities. Additionally,
*ResourceClaim support for workloads* unlocks *Dynamic Resource Allocation
([DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/))* for PodGroups. Finally,
to demonstrate real-world readiness, v1.36 delivers the first phase of integration between the Job controller and the new API.

## Workload and PodGroup API updates

The Workload API now serves as a static template, while the new PodGroup API describes the runtime object.
Kubernetes v1.36 introduces the Workload and PodGroup APIs as part of the
`scheduling.k8s.io/v1alpha2` {{< glossary_tooltip text="API group" term_id="api-group" >}},
completely replacing the previous `v1alpha1` API version.

In v1.35, Pod groups and their runtime states were embedded within the Workload resource.
The new model decouples these concepts: the Workload now serves as a static template object,
while the PodGroup manages the runtime state. This separation also improves performance and scalability
as the PodGroup API allows per-replica sharding of status updates.

Because the Workload API acts merely as a template, the `kube-scheduler`'s logic is streamlined.
The scheduler can directly read the PodGroup, which contains all the information required by the scheduler,
without needing to watch or parse the Workload object itself.

Here is what the updated configuration looks like. Workload controllers (such as the Job controller)
define the Workload object, which now acts as a static template for your Pod groups:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  # Pod groups are now defined as templates,
  # which contains the PodGroup objects' spec fields.
  podGroupTemplates:
  - name: workers
    schedulingPolicy:
      gang:
        # The gang is schedulable only if 4 pods can run at once
        minCount: 4
```

Controllers then stamp out runtime PodGroup instances based on those templates.
The PodGroup runtime object holds the actual scheduling policy and references the template from which it was created.
It also has a status containing conditions that mirror the states of individual Pods,
reflecting the overall scheduling state of the group:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-job-workers-pg
  namespace: some-ns
spec:
  # The PodGroup references the Workload template it originated from.
  # In comparison, .metadata.ownerReferences points to the "true" workload object,
  # e.g., a Job. 
  podGroupTemplateRef:
    workload:
      workloadName: training-job-workload
      podGroupTemplateName: workers
  # The actual scheduling policy is placed inside the runtime PodGroup
  schedulingPolicy:
    gang:
      minCount: 4
status:
  # The status contains conditions mirroring individual Pod conditions.
  conditions:
  - type: PodGroupScheduled
    status: "True"
    lastTransitionTime: 2026-04-03T00:00:00Z
```

Finally, to bridge this new architecture with individual Pods, the `workloadRef` field in the Pod API has been replaced
with the `schedulingGroup` field. When creating Pods, you link them directly to the runtime PodGroup:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
  namespace: some-ns
spec:
  # The workloadRef field has been replaced by schedulingGroup
  schedulingGroup:
    podGroupName: training-job-workers-pg
  ...
```

By keeping the Workload as a static template and elevating the PodGroup to a first-class, standalone API,
we establish a robust foundation for building advanced workload scheduling capabilities in future Kubernetes releases.

## PodGroup scheduling cycle and gang scheduling

To efficiently manage these workloads, the kube-scheduler now features a dedicated *PodGroup scheduling cycle*.
Instead of evaluating and reserving resources sequentially Pod-by-Pod, which risks scheduling deadlocks,
the scheduler evaluates the group as a unified operation.

When the scheduler pops a PodGroup member from the scheduling queue, regardless of the group's specific policy,
it fetches the rest of the queued Pods for that group, sorts them deterministically,
and executes an atomic scheduling cycle as follows:

1. The scheduler takes a single snapshot of the cluster state to prevent race conditions and ensure consistency
   while evaluating the entire group.

2. It then attempts to find valid Node placements for all Pods in the group using a PodGroup scheduling algorithm,
   which leverages the standard Pod-based filtering and scoring phases.

3. Based on the algorithm's outcome, the scheduling decision is applied atomically for the entire PodGroup.

   * Success: If the placement is found and group constraints are met, the schedulable member Pods
     are moved directly to the binding phase together. Any remaining unschedulable Pods are returned
     to the scheduling queue to wait for available resources so they can join the already scheduled Pods.

     (Note: If new Pods are added to a PodGroup after others are already scheduled,
     the cycle evaluates the new Pods while accounting for the existing ones.
     Crucially, Pods already assigned to Nodes remain running. The scheduler will not unassign
     or evict them, even if the group fails to meet its requirements in subsequent cycles.)
     
   * Failure: If the group fails to meet its requirements, the entire group is considered unschedulable.
     None of the Pods are bound, and they are returned to the scheduling queue to retry later after a backoff period.

This cycle acts as the foundation for *gang scheduling*. When your workload requires strict *all-or-nothing* placement,
the `gang` policy leverages this cycle to prevent partial deployments that lead to resource wastage and potential deadlocks.

While the scheduler still holds the Pods in the `PreEnqueue` until the `minCount` requirement is met, the actual scheduling phase now relies entirely
on the new PodGroup cycle. Specifically, during the algorithm's execution, the scheduler verifies
that the number of schedulable Pods satisfies the `minCount`. If the cluster cannot accommodate the required minimum,
none of the pods are bound. The group fails and waits for sufficient resources to free up.

### Limitations

The first version of the PodGroup scheduling cycle comes with certain limitations:

* For basic *homogeneous* Pod groups (i.e., those where all Pods have identical scheduling requirements
  and lack inter-Pod dependencies like affinity, anti-affinity, or topology spread constraints),
  the algorithm is expected to find a placement if one exists.

* For *heterogeneous* Pod groups, finding a valid placement if one exists is not guaranteed,
  even when the solution might seem trivial.

* For Pod groups with *inter-Pod dependencies*, finding a valid placement if one exists is not guaranteed.

In addition to the above, for cases involving *intra-group dependencies*
(e.g., when the schedulability of one Pod depends on another group member via inter-Pod affinity),
this algorithm may fail to find a placement regardless of cluster state due to its deterministic processing order.

## Topology-aware scheduling

For complex distributed workloads like AI/ML training or batch processing, placing Pods randomly across a cluster
can introduce significant network latency and bottleneck overall performance.

Topology-aware scheduling addresses this problem by allowing you to define topology constraints directly on a PodGroup,
ensuring its Pods are co-located within specific physical or logical domains:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: topology-aware-workers-pg
spec:
  schedulingPolicy:
    gang:
      minCount: 4
  # Enforce that the pods are co-located based on the rack topology
  schedulingConstraints:
    topology:
      - key: topology.kubernetes.io/rack
```

In this example, the `kube-scheduler` attempts to schedule the Pods across various combinations of Nodes
that match the `rack` topology constraint. It then selects the optimal placement based on how efficiently
the PodGroup utilizes resources and how many Pods can successfully be scheduled within that domain.

To achieve this, the scheduler extends the PodGroup scheduling cycle with a dedicated placement-based algorithm
consisting of three phases:

1. Generate candidate placements (subsets of Nodes that are theoretically feasible for the PodGroup's assignment)
   based on the group's scheduling constraints. The topology-aware scheduling plugin uses the new `PlacementGenerate`
   extension point to create these placements.

2. Evaluate each proposed placement to confirm whether the entire PodGroup can actually fit there.

3. Score all feasible placements to select the best fit for the PodGroup. The topology-aware scheduling plugins
   use the new `PlacementScore` extension point to score these placements.

Currently, topology-aware scheduling does not trigger Pod preemption to satisfy constraints.
However, we plan to integrate workload-aware preemption with topology constraints in the upcoming release.

While Kubernetes v1.36 delivers this foundational topology-aware scheduling, the Kubernetes project is planning
expand its capabilities soon. Future updates will introduce support for multiple topology levels,
soft constraints (preferences), deeper integration with Dynamic Resource Allocation (DRA),
and more robust behavior when paired with the `basic` scheduling policy.

## Workload-aware preemption

To support the new PodGroup scheduling cycle, Kubernetes v1.36 introduces a new type of preemption mechanism
called *workload-aware preemption*. When a PodGroup cannot be scheduled, the scheduler utilizes this mechanism
to try making a scheduling of this PodGroup possible.

Compared to the default preemption used in the standard Pod-by-Pod scheduling cycle, this new mechanism
treats the entire PodGroup as a single preemptor unit. Instead of evaluating preemption victims on each Node separately,
it searches across the entire cluster. This allows the scheduler to preempt Pods from multiple Nodes simultaneously,
making enough space to schedule the whole PodGroup afterwards.

Workload-aware preemption also introduces two additional concepts directly to the PodGroup API:

* PodGroup `priority` that overrides the priority of the individual Pods forming the PodGroup.

* PodGroup `disruptionMode` that dictates whether the Pods within a PodGroup can be preempted independently,
  or if they have to be preempted together in an *all-or-nothing* fashion.

In Kubernetes v1.36, these fields are only respected by the workload-aware preemption mechanism.
The people working on this set of features are hoping to extend support for these fields
to other disruption sources, including default preemption used in the Pod-by-Pod scheduling cycle, in future releases.

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: victim-pg
spec:
  priorityClassName: high-priority
  priority: 1000
  disruptionMode: PodGroup
```

In this example, when the scheduler evaluates `victim-pg` as a potential preemption victim
during a workload-aware preemption cycle, it will use 1000 as its priority and preempt the PodGroup
in a strictly *all-or-nothing* fashion.

## DRA ResourceClaim support for workloads

Since its general availability in Kubernetes v1.34, {{< glossary_tooltip text="DRA" term_id="dra" >}}
has enabled Pods to make detailed requests for {{<glossary_tooltip text="devices" term_id="device" >}}
like GPUs, TPUs, and NICs. Requested devices can be shared by multiple Pods
requesting the same {{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}}
by name. Other requests can be replicated through a {{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}},
in which Kubernetes generates one ResourceClaim with a non-deterministic name
for each Pod referencing the template. However, large-scale workloads that require
certain Pods to share certain devices are currently left to manage creating
individual ResourceClaims themselves.

Now, in addition to Pods, PodGroups can represent the replicable unit for a
ResourceClaimTemplate. For ResourceClaimTemplates referenced by one of a
PodGroup's `spec.resourceClaims`, Kubernetes generates one ResourceClaim for the
entire PodGroup, no matter how many Pods are in the group. When one of a Pod's
`spec.resourceClaims` for a ResourceClaimTemplate matches one of its PodGroup's
`spec.resourceClaims`, the Pod's claim resolves to the ResourceClaim generated
for the PodGroup and a ResourceClaim will not be generated for that individual
Pod. A single PodGroupTemplate in a Workload object can express resource
requests which are both copied for each distinct PodGroup and shareable by the
Pods within each group.

The following example shows two Pods requesting the same ResourceClaim generated
from a ResourceClaimTemplate for their PodGroup:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-job-workers-pg
spec:
  ...
  resourceClaims:
    - name: pg-claim
      resourceClaimTemplateName: my-claim-template
---
apiVersion: v1
kind: Pod
metadata:
  name: topology-aware-workers-pg-pod-1
spec:
  ...
  schedulingGroup:
    podGroupName: training-job-workers-pg
  resourceClaims:
    - name: pg-claim
      resourceClaimTemplateName: my-claim-template
---
apiVersion: v1
kind: Pod
metadata:
  name: topology-aware-workers-pg-pod-2
spec:
  ...
  schedulingGroup:
    podGroupName: training-job-workers-pg
  resourceClaims:
    - name: pg-claim
      resourceClaimTemplateName: my-claim-template
```

In addition, ResourceClaims referenced by PodGroups, either through
`resourceClaimName` or the claim generated from `resourceClaimTemplateName`,
become reserved for the entire PodGroup. Previously, kube-scheduler could only
list individual Pods in a ResourceClaim's `status.reservedFor` field which is
limited to 256 items. Now, a single PodGroup reference in `status.reservedFor`
can represent many more than 256 Pods, allowing high-cardinality sharing of
devices.

Together, these changes enable massive workloads with complex topologies to
utilize DRA for scalable device management.

## Integration with the Job controller

In Kubernetes v1.36, the Job controller can create and manage Workload and PodGroup objects on your behalf,
so that Jobs representing a tightly coupled parallel application, such as distributed AI training,
are gang-scheduled without any additional tooling. Without this integration, you would have to
create the Workload and PodGroup yourself and wire their references into the Pod template.
Now, the Job controller automates this process natively.

When the [`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadWithJob)
feature gate is enabled, the Job controller automatically:

* creates a Workload and a corresponding runtime PodGroup for each qualifying Job,

* sets `.spec.schedulingGroup` onto every Pod the Job creates
  so the scheduler treats them as a single gang, and

* sets the Job as the owner of the generated objects,
  so they are garbage-collected when the Job is deleted.

### When does the integration kick in?

To keep the first feature iteration predictable, the Job controller only creates a
Workload and PodGroup when the Job has a well-defined, fixed shape:

* `.spec.parallelism` is greater than 1

* [`.spec.completionMode`](/docs/concepts/workloads/controllers/job/#completion-mode) is set to `Indexed`

* `.spec.completions` is equal to `.spec.parallelism`

* The `schedulingGroup` is not already set on the Pod template.

These conditions describe the class of Jobs that gang scheduling can reason about:
each Pod has a stable identity (`Indexed`), the gang size is known and fixed at admission time
(`parallelism` == `completions`), and no other controller has already claimed scheduling responsibility
(`schedulingGroup` field is unset). Jobs that do not meet these conditions are scheduled Pod-by-Pod,
exactly as before.

If you set `schedulingGroup` on the Pod template yourself (for example,
because a higher-level controller is managing the workload), the Job controller leaves
the Pod template alone and does not create its own Workload or PodGroup. This makes the feature
safe to enable in clusters that already use an external batch system. 

Here is an example of a Job that qualifies for gang scheduling:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: training-job
  namespace: job-ns
spec:
  completionMode: Indexed
  parallelism: 4
  completions: 4
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: worker
        image: registry.example/trainer:latest
```

The Job controller creates a Workload and a PodGroup owned by this Job,
and every Pod it creates carries a `.spec.schedulingGroup` that points at the generated PodGroup.
The Pods are then scheduled together once all four can be placed at the same time using
the PodGroup scheduling cycle described earlier in this post.

### What's not covered yet

The current constraints limit this integration to static, indexed, fully-parallel Jobs.
Support for additional workload shapes, including elastic Jobs and other built-in controllers,
is tracked in [KEP-5547](https://kep.k8s.io/5547).

In future Kubernetes releases, this integration will expand to support additional workload controllers,
and the current constraints for Jobs may be relaxed.

## What's next?

The journey for workload-aware scheduling doesn't stop here.
For v1.37, the community is actively working on:

* **Graduating Workload and PodGroup APIs to Beta:** Our primary goal is to mature the Workload and PodGroup APIs to the Beta stage,
  solidifying their foundational role in the Kubernetes ecosystem. As part of this graduation process, we also plan to introduce `minCount` mutability
  to unlock elastic jobs and allow dynamic workloads to scale efficiently.

* **Multi-level Workload hierarchies:** To support complex modern AI workloads like JobSet or Disaggregated Inference via LeaderWorkerSet (LWS),
  we are working on expanding the architecture to support multi-level hierarchies. We aim to introduce a new API
  that allows grouping multiple PodGroups into hierarchical structures, directly reflecting the organization of real-world workload controllers.

* **Graduating advanced scheduling features:** We are focused on driving the maturity of the broader workload-aware scheduling ecosystem.
  This includes bringing existing features, such as topology-aware scheduling and workload-aware preemption, to the Beta stage.

* **Unified controller integration API:** To streamline adoption, we’re working on a controller integration API.
  This will provide real-world workload controllers with a unified, standardized method for consuming workload-aware scheduling capabilities.

The priority and implementation order of these focus areas are subject to change. Stay tuned for further updates.

## Getting started

All below workload-aware scheduling improvements are available as Alpha features in v1.36.
To try them out, you must configure the following:

* Prerequisite: Workload and PodGroup API support: Enable the
  [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
  feature gate on both the `kube-apiserver` and `kube-scheduler`, and ensure the `scheduling.k8s.io/v1alpha2`
  {{< glossary_tooltip text="API group" term_id="api-group" >}} is enabled.

Once the prerequisite is met, you can enable specific features:

* Gang scheduling: Enable the
  [`GangScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling)
  feature gate on the `kube-scheduler`.
* Topology-aware scheduling: Enable the
  [`TopologyAwareWorkloadScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#TopologyAwareWorkloadScheduling)
  feature gate on the `kube-scheduler`.
* Workload-aware preemption: Enable the
  [`WorkloadAwarePreemption`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadAwarePreemption)
  feature gate on the `kube-scheduler` (requires `GangScheduling` to also be enabled).
* DRA ResourceClaim support for workloads: Enable the
  [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
  feature gate on the `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` and `kubelet`.
* Workload API integration with the Job controller: Enable the
  [`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/#EnableWorkloadWithJob)
  feature gate on the `kube-apiserver` and `kube-controller-manager`.

We encourage you to try out workload-aware scheduling in your test clusters
and share your experiences to help shape the future of Kubernetes scheduling.
You can send your feedback by:

* Reaching out via [Slack (#workload-aware-scheduling)](https://kubernetes.slack.com/archives/C0AHLJ0EAEL).
* Joining the [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/#meetings) meetings.
* Filing a new [issue](https://github.com/kubernetes/kubernetes/issues) in the Kubernetes repository.

## Learn more

To dive deeper into the architecture and design of these features, read the KEPs:

* [Workload API and gang scheduling](https://kep.k8s.io/4671)
* [Topology-aware scheduling](https://kep.k8s.io/5732)
* [Workload-aware preemption](https://kep.k8s.io/5710)
* [DRA ResourceClaim support for workloads](https://kep.k8s.io/5729)
* [Workload API support in Job controller](https://kep.k8s.io/5547)
