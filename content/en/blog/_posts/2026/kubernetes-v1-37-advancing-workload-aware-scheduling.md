---
layout: blog
title: "Kubernetes v1.37: Advancing Workload-Aware Scheduling"
draft: true
slug: kubernetes-v1-37-advancing-workload-aware-scheduling
author: >
  Antoni Zawodny (Google),
  Bartosz Rejman (Google),
  Heba Elayoty (Microsoft),
  Jon Huhn (Microsoft),
  Maciej Skoczeń (Google),
  Maciej Wyrzuc (Google),
  Matt Matejczyk (Google)
---

AI/ML and complex batch workloads continue to push the boundaries of Kubernetes scheduling. Following the foundational workload-centric enhancements introduced in previous releases, Kubernetes v1.37 delivers the next major milestone in the Workload-Aware Scheduling (WAS) journey. In this release, the core Workload and PodGroup APIs—enabling gang scheduling—along with Workload-Aware Preemption (WAP) and Dynamic Resource Allocation (DRA) ResourceClaim support, all graduate to Beta, solidifying their role in the Kubernetes ecosystem.

To address the hierarchical scheduling requirements of modern high-performance distributed workloads, v1.37 introduces the new `CompositePodGroup` API. This new core API allows expressing multi-level topology constraints, gang scheduling, and preemption policies for complex, heterogeneous groups of Pods. Crucially, this architectural expansion unlocks native scheduling support for advanced workload structures commonly managed by higher-order APIs like JobSet and LeaderWorkerSet (LWS).

Alongside these API additions, v1.37 focuses on streamlining adoption by introducing a new set of Controller Integration APIs and the `workloadbuilder` library. These provide standardized building blocks that significantly simplify how out-of-tree controllers can integrate with WAS capabilities. Utilizing these new tools, the native Job controller integration has been upgraded to fully consume the expanded WAS APIs—enabling advanced scheduling policies, flexible disruption modes, and topology-aware scheduling for standard batch workloads.

## Gang Scheduling and Workload/PodGroup APIs

Kubernetes v1.37 delivers a major milestone: Workload/PodGroup APIs and Gang Scheduling
are officially graduating to Beta. This graduation signals that native, "all-or-nothing"
scheduling for workloads is solidifying for wider adoption.

Key updates to the API and gang scheduling algorithm in this release include:

1. Beta graduation and API versioning changes

The core Workload and PodGroup APIs have been promoted to v1beta1, meaning they are now one step away from
General Availability (GA). For early adopters who have been testing these features,
take note of the alpha versioning transition: v1alpha2 has been entirely replaced by v1alpha3.
This transition introduces breaking changes designed to clean up the API structure around `disruptionMode`.

2. Native PodGroup queueing

A significant under-the-hood improvement in v1.37 makes the PodGroup a first-class citizen in the scheduling queue.
Previously, even if belonging to a PodGroup, all member Pods were queued individually. Now, only the top-level PodGroup
object is queued. This ensures all Pods share the same queueing behavior and lays the groundwork
for more advanced PodGroup queueing strategies in the future.

3. Dynamic elasticity with minCount mutability

In earlier iterations, the `minCount` field, which dictates the minimum number of Pods required
to successfully schedule a PodGroup, was strictly immutable. In v1.37, minCount is now mutable.
This API change unlocks flexibility for elastic workloads. Controllers can now dynamically
adjust the minimum required size of a gang on the fly, allowing workloads to gracefully degrade
or expand without interrupting already-scheduled Pods.

## Workload-Aware Preemption

In Kubernetes v1.37 the separate
`WorkloadAwarePreemption` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
for Workload-aware preemption was merged into the `GenericWorkload` feature gate,
becoming a core part of the gang scheduling effort.

While the core concepts of workload-aware preemption stays the same, there are some
differences between the v1.36 and v1.37 releases:

1. Performance and optimality

To check whether a preemptor can fit in the cluster thanks to preemption, the scheduler
simulates the removal of all potential victims and re-runs the scheduling algorithm. After
that it tries to reprieve as many victims as possible. In the v1.36 release, the scheduling
algorithm was run for each victim reprieval, verifying whether with the victim reprieved, the algorithm
can still find a valid placement for the preemptor. In v1.37, the scheduling algorithm is run only once
and the preemptor pods are assumed based on its output. Later, the reprieval checks
whether a victim can still run in its place with the preemptor assumed.

2. PodGroup as a victim

One of the limitations of v1.36 was the fact that the default preemption for single pods
was not aware of PodGroups and was not respecting their `disruptionMode` fields, allowing
for disruption of single pods even when the PodGroup had `disruptionMode: PodGroup` set.
Kubernetes v1.37 removes this limitation; the default preemption will now respect the PodGroup
`disruptionMode` field.

3. Rename of the `disruptionMode` fields

During the promotion of the API to beta, the `disruptionMode` field was changed to decouple 
its naming from the PodGroup object, allowing consistent naming across PodGroups and CompositePodGroups.
The modes changed as follows: `PodGroup` -> `All`, `Pod` -> `Single`.

4. Support for preemptionPolicy

In v1.36, the PodGroup does not have a `preemptionPolicy` field. The PodGroup can perform
preemption as long as none of the pods forming it has `preemptionPolicy: Never` set. In v1.37,
when [PodGroupPreemptionPolicy](/docs/reference/command-line-tools-reference/feature-gates/podgroup-preemption-policy/)
feature gate is enabled, a PodGroup also has a `preemptionPolicy` field. It serves as an authoritative field for whether
a PodGroup can perform preemption.

## CompositePodGroup API

In Kubernetes v1.36, workload-aware scheduling established a clean separation between static workload templates (`Workload`) and runtime group state (`PodGroup`), but the supported scheduling policies were limited to a single, flat group. The `CompositePodGroup` API, introduced in Kubernetes v1.37, extends this model to support hierarchical scheduling requirements.

This API allows its consumers to express multi-level scheduling requirements by organizing a workload in a tree-shaped hierarchy consisting of `CompositePodGroup` and `PodGroup` objects. Each `CompositePodGroup` carries policies and constraints that apply to other groups (`CompositePodGroups` and/or `PodGroups`), similar to how `PodGroups` govern scheduling behavior for a flat group of Pods. The scheduler treats such a hierarchy as a single scheduling unit and aims to satisfy the requirements specified by every group within that hierarchy.

### Defining a workload hierarchy

To express multi-level scheduling requirements, you define a hierarchy of templates in a `Workload` object based on which controllers create corresponding `CompositePodGroup` and `PodGroup` objects.

To support this, the `Workload` API is extended with the `spec.compositePodGroupTemplates` field. Each `CompositePodGroupTemplate` defines a template for a parent `CompositePodGroup` and directly nests the templates (`podGroupTemplates` and/or `compositePodGroupTemplates`) from which its child groups derive.

Below is a sample `Workload` object that defines a two-level template hierarchy:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: Workload
metadata:
  name: example-workload
spec:
  compositePodGroupTemplates:
    - name: workload-root
      schedulingPolicy:
        gang:
          minGroupCount: 2
      podGroupTemplates:
        - name: workers
          schedulingPolicy:
            gang:
              minCount: 4
        - name: driver
          schedulingPolicy:
            gang:
              minCount: 1
```

After creating `example-workload`, a controller can stamp out the corresponding runtime group objects from these templates:

1. A root `CompositePodGroup` that references the `workload-root` template in `example-workload` and carries its group-level scheduling policy (gang scheduling with `minGroupCount: 2`):

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: CompositePodGroup
metadata:
  name: example-root-group
spec:
  workloadRef:
    workloadName: example-workload
    templateName: workload-root
  schedulingPolicy:
    gang:
      minGroupCount: 2
```

2. Two child `PodGroup` objects (`example-workload-workers` and `example-workload-driver`) that reference their respective leaf templates in `example-workload` and link to the root group via `parentCompositePodGroupName`:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: PodGroup
metadata:
  name: example-workload-workers
spec:
  parentCompositePodGroupName: example-root-group
  workloadRef:
    workloadName: example-workload
    templateName: workers
  schedulingPolicy:
    gang:
      minCount: 4
---
apiVersion: scheduling.k8s.io/v1alpha3
kind: PodGroup
metadata:
  name: example-workload-driver
spec:
  parentCompositePodGroupName: example-root-group
  workloadRef:
    workloadName: example-workload
    templateName: driver
  schedulingPolicy:
    gang:
      minCount: 1
```

### How multi-level gang scheduling works

To schedule a hierarchical workload, `kube-scheduler` evaluates the entire group tree as a unified scheduling unit:

* **Recursive evaluation**: The scheduler traverses the hierarchy from the root `CompositePodGroup` down to the leaf `PodGroup` objects. At each level, a parent `CompositePodGroup` is considered schedulable only when its child groups satisfy its scheduling policy (for example, placing at least `minGroupCount` of child groups when using the gang policy), while each leaf `PodGroup` must satisfy its own pod-level policy (for example, placing at least `minCount` of member Pods when using the gang policy).
* **All-or-nothing scheduling**: Once a valid combination of child groups is found that satisfies the requirements of the root `CompositePodGroup`, the Pods across the entire hierarchy are scheduled and bound atomically. If the root group cannot satisfy its policy constraints, the entire hierarchy remains unschedulable and no Pods are bound, preventing partial deployments and deadlocks.

### Workload-aware preemption for CompositePodGroup API

Kubernetes v1.37 extends workload-aware preemption to support `CompositePodGroup` hierarchies as well. Specifically, if a `CompositePodGroup` cannot be scheduled due to insufficient capacity in the cluster, the scheduler can invoke preemption to evict lower-priority workloads in order to fit the Pods belonging to that `CompositePodGroup`.

`CompositePodGroup` can be selected for preemption as well. To specify the desired behavior during preemption, workload owners can specify an appropriate `disruptionMode` in the `CompositePodGroup` spec:

* **`Single` (Default)**: Allows individual child groups within the `CompositePodGroup` to be preempted and disrupted independently.
* **`All`**: Enforces "all-or-nothing" disruption semantics across the entire `CompositePodGroup` hierarchy. If any Pod within the descendant subtree must be preempted, the scheduler evicts all Pods across the entire hierarchy together.

## Topology-aware scheduling

In Kubernetes v1.37, topology-aware scheduling expands to support complex, multi-level workload hierarchies and delivers performance improvements for existing single-level deployments.

### Multi-level topology-aware scheduling

In Kubernetes v1.36, we introduced foundational topology-aware scheduling, allowing you to define co-location constraints directly on a PodGroup. While effective for single-level groupings, complex distributed workloads—such as large-scale AI/ML training, JobSet deployments, or disaggregated inference via LeaderWorkerSet (LWS)—often require co-location across multiple levels of cluster infrastructure simultaneously.

For example, an entire workload may need to run within a single availability zone, while different parts of that workload (such as specific worker groups or driver processes) require strict co-location within specific server racks.

In Kubernetes v1.37, alongside the new `CompositePodGroup` API (`scheduling.k8s.io/v1alpha3`), topology-aware scheduling expands to support **multi-level topology-aware scheduling**. You can now express complex co-location requirements by specifying topology constraints at different levels of a group hierarchy.

### Top-down topology constraint resolution

During hierarchical scheduling, the `kube-scheduler` resolves multi-level topology constraints in a **top-down** manner. Specifically, topology domains that are considered during the scheduling of a child group are confined within a topology domain that corresponds to the placement assumed by the parent group.

### Configuration and runtime execution

Using the updated Workload API (`scheduling.k8s.io/v1alpha3`), you can configure multi-level topology constraints directly within `CompositePodGroupTemplates`. In the example below, the parent template constrains the overall workload to a single availability zone (`topology.kubernetes.io/zone`), while child templates for `workers` and `driver` constrain their respective Pods to server racks (`topology.example.com/rack`) within that selected zone:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: Workload
metadata:
  name: multi-level-tas-workload
  namespace: job-ns
spec:
  compositePodGroupTemplates:
  - name: root
    schedulingPolicy:
      gang:
        minGroupCount: 2
    schedulingConstraints:
      topology:
      - key: topology.kubernetes.io/zone
    podGroupTemplates:
    - name: workers
      schedulingPolicy:
        gang:
          minCount: 8
      schedulingConstraints:
        topology:
        - key: topology.example.com/rack
    - name: driver
      schedulingPolicy:
        gang:
          minCount: 1
      schedulingConstraints:
        topology:
        - key: topology.example.com/rack
```

When a controller creates an instance of this workload at runtime, it spawns the corresponding runtime objects from these templates:

1. The root `CompositePodGroup` referencing the `root` template, carrying the availability zone topology constraint and the hierarchical gang scheduling policy.
2. The two child `PodGroup` objects (`tas-workload-workers` and `tas-workload-driver`), each referencing the root `CompositePodGroup` as their parent group via the `parentCompositePodGroupName` spec field:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: CompositePodGroup
metadata:
  name: tas-workload-root
  namespace: job-ns
spec:
  workloadRef:
    workloadName: multi-level-tas-workload
    templateName: root
  schedulingPolicy:
    gang:
      minGroupCount: 2
  schedulingConstraints:
    topology:
    - key: topology.kubernetes.io/zone
---
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: tas-workload-workers
  namespace: job-ns
spec:
  parentCompositePodGroupName: tas-workload-root
  workloadRef:
    workloadName: multi-level-tas-workload
    templateName: workers
  schedulingPolicy:
    gang:
      minCount: 8
  schedulingConstraints:
    topology:
    - key: topology.example.com/rack
---
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: tas-workload-driver
  namespace: job-ns
spec:
  parentCompositePodGroupName: tas-workload-root
  workloadRef:
    workloadName: multi-level-tas-workload
    templateName: driver
  schedulingPolicy:
    gang:
      minCount: 1
  schedulingConstraints:
    topology:
    - key: topology.example.com/rack
```

During scheduling, the scheduler evaluates multiple candidate availability zones across the cluster for tas-workload-root. For each candidate zone, it subdivides the nodes by rack topology to explore feasible rack placements for tas-workload-workers and tas-workload-driver strictly within that zone, systematically evaluating multiple combinations across available zones and racks before making a scheduling decision.

By allowing topology constraints to be modeled hierarchically, Kubernetes v1.37 provides a structured way to express multi-level co-location requirements across complex cluster infrastructures.

### Performance improvements for single-level TAS

Alongside the alpha introduction of multi-level hierarchies, Kubernetes v1.37 brings noticeable performance improvements to existing single-level topology-aware scheduling. We are continuously working to optimize the efficiency of placement evaluation algorithms in kube-scheduler and plan to deliver further performance improvements in future releases.


## Controller Integration APIs

Kubernetes v1.37 introduces new standard building blocks that allow controllers to embed Workload-Aware Scheduling (WAS) primitives in their own APIs. These primitives express specific scheduling behaviors — such as policies or disruption logic — while leaving the field naming flexible for each controller. A prime example of this is the native Job controller, which we detail in the next section.

Furthermore, this release debuts the `workloadbuilder` library. Designed for both in-tree and out-of-tree controllers, it handles creating a `WorkloadItem` tree, manages the builder flow, enables declarative validation, provides scheduling-option allow-lists, and generates PodGroups from existing Workloads. This standardizes and accelerates WAS integration across the ecosystem.

## Integration with the Job Controller

Building upon the new Controller Integration APIs, the native Job controller integration has advanced to v1.37 alpha2. The Job API now features an explicit `.spec.scheduling` field that allows Jobs to leverage the expanded Workload-Aware Scheduling capabilities, expanding support well beyond static, indexed, and fully-parallel Jobs.

For example, a Job can now be configured with specific Workload-Aware Scheduling policies directly within the new API structure:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: distributed-training-job
spec:
  parallelism: 8
  completions: 8
  scheduling:
    schedulingPolicy:
      gang: {}                # minCount omitted -> defaults to parallelism (8)
    schedulingConstraints:
      key:
      - level: topology.kubernetes.io/zone
    disruptionMode:
      all: {}
  template:
    spec:
      containers:
      ...
```

## DRA ResourceClaim Support for Workloads

As the core WAS APIs mature, so do their integrations with {{< glossary_tooltip text="Dynamic Resource Allocation" term_id="dra" >}}
(DRA). Kubernetes v1.36 introduced the [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
feature, allowing {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}
to be replicated and reserved for entire PodGroups and shared by all their
member Pods:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
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
  name: topology-aware-workers-pg-pod
spec:
  ...
  schedulingGroup:
    podGroupName: training-job-workers-pg
  resourceClaims:
    - name: pg-claim
      resourceClaimTemplateName: my-claim-template
```

In Kubernetes v1.37, the `DRAWorkloadResourceClaims` feature graduated to Beta.
While the API and core functionality of the feature remain unchanged, one change
eliminates some potentially surprising behavior when disabling the feature.
Previously when one of a Pod's `spec.resourceClaims` referenced a
ResourceClaimTemplate and matched one of its PodGroup's `spec.resourceClaims`
and the feature was _disabled_, a ResourceClaim was created for the Pod instead
of the PodGroup. In that scenario in v1.37, no ResourceClaim is created at all.
This change prevents Kubernetes from creating a flood of ResourceClaims from a
ResourceClaimTemplate and potentially exhausting DRA resources when a
claim intended to be shared by a whole PodGroup is replicated for each and every
Pod in the group.

For more information, see the [feature documentation](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api#workload-resource-claims).

## What's next?

The Workload-Aware Scheduling Working Group (WG-WAS) is currently finalizing plans for the Kubernetes v1.38 release cycle. While the roadmap is still taking shape (stay tuned!), the following key initiatives are already planned:

* **Graduation of Workload and PodGroup APIs to GA:** Solidifying the core foundation of workload-aware scheduling as a stable Kubernetes API.
* **Graduation of Topology-Aware Scheduling (TAS) and CompositePodGroup (CPG) to Beta:** Bringing these advanced placement and hierarchical scheduling features to Beta stability.
* **Graduation of Controller Integration Building Blocks to Beta:** Further refining the integration APIs to ensure a robust developer experience.
* **Increased adoption and integration:** Expanding the ecosystem by integrating workload-aware scheduling with other controllers, with a particular focus on hierarchical orchestrators such as [JobSet](https://github.com/kubernetes-sigs/jobset).
* **Kueue Integration:** Fostering closer alignment between WAS and [Kueue](https://kueue.sigs.k8s.io/). In the near term, we aim to ensure Kueue is fully aware of WAS features for seamless interoperability. In the long term, we envision Kueue leveraging WAS as its underlying engine for capabilities like gang-scheduling and topology-aware placement.

## Getting started

Many of the workload-aware scheduling improvements are now available as Beta features in v1.37, while new advanced capabilities are introduced in Alpha. Note that both Beta and Alpha features are disabled by default and require manual enablement.

* **Workload API, Gang Scheduling, and Preemption:** The
  [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
  feature gate (which now integrates Gang scheduling and Workload-aware preemption) is Beta and disabled by default on the `kube-apiserver` and `kube-scheduler`. Ensure your manifests are updated to use the `scheduling.k8s.io/v1beta1`
  {{< glossary_tooltip text="API group" term_id="api-group" >}}.

**Beta features:**
* **DRA ResourceClaim support for workloads:** The
  [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
  feature gate on the `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` and `kubelet`.

**Alpha features:**

* **Topology-aware scheduling:** Enable the
  [`TopologyAwareWorkloadScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#TopologyAwareWorkloadScheduling)
  feature gate on the `kube-scheduler`.

* **CompositePodGroup API:** Enable the
  [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
  feature gate on both the `kube-apiserver` and `kube-scheduler`, and ensure the `scheduling.k8s.io/v1alpha3` API group is enabled.
* **Workload API integration with the Job controller:** Enable the
  [`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadWithJob)
  feature gate on the `kube-apiserver` and `kube-controller-manager`.

**Controller Integration APIs:**

The new `workloadbuilder` library is available to developers building both out-of-tree and in-tree controllers who want to integrate with WAS. It does not require a feature gate. You can explore the library and find usage examples directly in the [`kubernetes/component-helpers`](https://github.com/kubernetes/component-helpers/tree/master/scheduling/schedulingv1/workloadbuilder) repository.

We encourage you to try out workload-aware scheduling in your test clusters
and share your experiences to help shape the future of Kubernetes scheduling.
You can send your feedback by:

* Reaching out via [Slack (#wg-workload-aware-scheduling)](https://kubernetes.slack.com/archives/C0AHLJ0EAEL).
* Joining the [WG Workload-Aware Scheduling](https://www.kubernetes.dev/community/community-groups/wg/workload-aware-scheduling/) or [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/#meetings) meetings.
* Filing a new [issue](https://github.com/kubernetes/kubernetes/issues) in the Kubernetes repository.

## Learn more

To dive deeper into the architecture and design of these features, read the KEPs:

* [KEP-4671: Gang Scheduling Support in Kubernetes](https://kep.k8s.io/4671)
* [KEP-5710: Workload-aware preemption](https://kep.k8s.io/5710)
* [KEP-5732: Topology-aware workload scheduling](https://kep.k8s.io/5732)
* [KEP-6012: CompositePodGroup API](https://kep.k8s.io/6012)
* [KEP-6089: WAS: Controller Integration APIs](https://kep.k8s.io/6089)
* [KEP-5547: WAS: Integrate Workload APIs with Job controller](https://kep.k8s.io/5547)
* [KEP-5729: DRA: ResourceClaim Support for Workloads](https://kep.k8s.io/5729)
