---
layout: blog
title: "Kubernetes v1.37: <Release Name>"
draft: true
evergreen: true
slug: kubernetes-v1-37-release
author: >
  [Kubernetes v1.37 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.37/release-team.md)
release_announcement:
  minor_version: "1.37"
  themes:
    - "Release CodeName 1"
---
**Editors:** Arsh Sharma, Christopher Tineo, Kirti Goyal, Sophia Ugochukwu, Swathi Rao, Troy Connor

Similar to previous releases, the release of [Kubernetes v1.37](/releases/1.37/) introduces new Stable, Beta, and Alpha features. The consistent delivery of high-quality releases underscores the strength of our development cycle and the vibrant support from our community.

This release consists of 67 enhancements.
Of those enhancements, 16 have graduated to Stable, 23 have graduated to Beta,
27 are entering Alpha, and 1 is a deprecation/removal.

## Release theme and logo

<!-- Logo image size is recommended to be no more than 2160px -->

{{< figure src="k8s-1.37.svg" alt="Kubernetes v1.37 <release theme> logo" class="release-logo" >}}

## Spotlight on key updates

Kubernetes v1.37 is packed with new features and improvements. Here are a few select updates the [Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.37/release-team.md) would like to highlight!

### Stable: Resilient watchcache initialization

Kubernetes v1.37 completes the work on _resilient watch cache initialization_: the
`ResilientWatchCacheInitialization` feature gate reached Stable back in v1.34, and in v1.37 the remaining
`WatchCacheInitializationPostStartHook` gate graduates to Stable and is locked on. It has defaulted to
enabled since v1.36, hardening the API server at startup and during
recovery.  Watchcache initialization and reinitialization no longer create a traffic spike of requests against `etcd`, and
requests are handled gracefully instead of piling up while the cache warms. 

Instead of allowing expensive list and watch requests to overload `etcd` or exhaust API Priority and Fairness capacity, `kube-apiserver` now safely delegates bounded requests and rejects others with HTTP 429 responses. This reduces the risk of control
plane outages in large clusters.  Clients (including custom controllers and operators) should be designed to handle HTTP `429 Too Many Requests` responses gracefully by respecting `Retry-After` headers and implementing exponential backoff. 

This work was done as part of [KEP #4568](https://www.kubernetes.dev/resources/keps/4568/) led by [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/).

### Beta: HorizontalPodAutoscaler scale to zero

In Kubernetes v1.37, HorizontalPodAutoscaler _scale to zero_ support is graduating to Beta. First introduced in
Kubernetes v1.16, it is now **enabled by default**.
For workloads that are using object or external metrics, this feature allows HorizontalPodAutoscalers to scale down to
zero Pods when idle, then restore them when demand returns. Doing that can reduce costs for queue consumers, batch jobs,
and GPU workloads. Setting `spec.minReplicas: 0` applies this functionality for workloads.

Scaling to zero based on CPU and memory metrics is **not** supported because those metrics depend on active Pods.
Instead, this feature is for situations such as leaving the replica count at zero until there is queued work to process.

While the HorizontalPodAutoscaler is holding a
workload at zero replicas, it records a `ScaledToZero` condition with `True` in the HorizontalPodAutoscaler's status. The
`HorizontalPodAutoscaler` controller then uses this condition to distinguish a workload that it scaled to zero (and will
scale back up when the metric returns) from one that was manually deactivated by setting its replica count to 0. Once the
workload is scaled back up, the condition is set to `False` with the reason `NotScaledToZero`.

This work was done as part of [KEP #2021](https://www.kubernetes.dev/resources/keps/2021/) led by [SIG Autoscaling](https://www.kubernetes.dev/community/community-groups/sigs/autoscaling/).

### Beta: Manifest-based admission control configuration

Kubernetes v1.37 graduates [manifest-based admission control](/docs/reference/access-authn-authz/manifest-admission-control/)
configuration to Beta. Admission webhooks and CEL-based policies can now be loaded from manifest files on disk, via the
`staticManifestsDir` field in `AdmissionConfiguration`, instead of living only in the Kubernetes API. Policies loaded this
way are enforced from API server startup, keep working while `etcd` is unavailable, and can protect the API-based admission
resources themselves from modification.

This work was done as part of [KEP #5793](https://www.kubernetes.dev/resources/keps/5793/) led by [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/).

### Alpha: Pod-level checkpoint and restore

Kubernetes v1.37 introduces Alpha support for **Pod-level** checkpoint and restore,
extending the CRI with `CheckpointPod` and `RestorePod` RPCs, which allow the kubelet and compatible container runtimes to create a Pod checkpoint and restore a Pod from it.
To use this feature, your container runtime(s) must also implement these new RPCs.

This work was done as part of [KEP #5823](https://www.kubernetes.dev/resources/keps/5823/) led by
[SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).

## Features graduating to Stable

This lists all the features that graduated to Stable (also known as _General Availability_). For a full list of updates
including new features and graduations from Alpha to Beta, see the release notes.

This release includes a total of 16 enhancements promoted to Stable:

### KYAML

_KYAML_ is a safer and less ambiguous subset of YAML designed specifically for Kubernetes, **not a replacement for it**. Every
KYAML file is valid YAML, so KYAML is a valid input for any version of `kubectl`, and spec files do not need to be written in
KYAML for the input to be parsed. Your existing manifests, tooling, and pipelines don't need to change.
Introduced as an Alpha feature in v1.34 and graduating to Beta in v1.35, KYAML graduates to Stable in v1.37 with conformance
testing complete, and `kubectl get -o kyaml` is now Stable.

To learn more about KYAML, check out [How to Pretty-Print Your Kubernetes YAML as KYAML and Why You'd Want To](/blog/2026/08/11/how-to-pretty-print-kubernetes-yaml-as-kyaml/).

This work was done as part of [KEP #5295](https://www.kubernetes.dev/resources/keps/5295/) led by [SIG CLI](https://www.kubernetes.dev/community/community-groups/sigs/cli/).

### The metrics.k8s.io API

The _metrics.k8s.io_ API graduates to Stable in Kubernetes v1.37 after spending nearly nine years in Beta. The API provides a
standard way to retrieve CPU and memory usage for pods and nodes, powering widely used Kubernetes features such as the
HorizontalPodAutoscaler (HPA) and commands like `kubectl top`.

The graduation follows the Kubernetes project’s goal of avoiding permanent Beta APIs. Now that `v1` exists, future
Kubernetes releases will move over to it; `v1beta1` remains usable throughout the transition, in line with the API
deprecation policy, so you can adopt the Stable API without breaking existing workflows.

This work was done as part of [KEP #5207](https://www.kubernetes.dev/resources/keps/5207/) led
by [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/).

### `SELinuxMount` and `SELinuxChangePolicy`

In Kubernetes v1.37, `SELinuxMount` and `SELinuxChangePolicy` flags reach Stable and are enabled by default: this means that
volumes get mounted with `-o context=<label>` (the MountOption default) instead of being recursively relabeled, but only when
the volume's CSI driver opts in via `.spec.seLinuxMount: true` for the CSIDriver object.

A mount can only carry one SELinux context, so [Pods with different SELinux labels sharing a volume on the same node, which
used to coexist under recursive relabeling, can now fail to start](https://www.kubernetes.dev/resources/keps/1710/#story-3-cluster-upgrade).
To retain the old behavior for a workload, it is advised to set the `.spec.seLinuxChangePolicy` to `Recursive` on a Pod.

This behavior itself also isn't locked until v1.38, so disabling it cluster-wide remains an option for one more release.

Clusters without SELinux enabled see no effect at all. To learn more, check [SELinux Volume Label Changes goes GA (and likely
implications in v1.37)](/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/).

This work was done as part of [KEP #1710](https://www.kubernetes.dev/resources/keps/1710/) led by [SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/).

### DRA features graduating to Stable

#### DRA: ResourceClaim status with possible standardized network interface data

The ResourceClaim `.status.devices` reaches Stable in Kubernetes v1.37, which allows drivers to report device-specific device
status data for each allocated device in a resource claim. This makes it easier to see how a device is configured,
troubleshoot problems, and use the device with other services.

This is particularly useful for network devices; before this field was added, if a Pod requested a network device via DRA,
there was no way for any other component in the system to learn the IP address that was assigned to that network device.
The new status field provides a standardized way for the DRA driver to export that information to components that need it,
making DRA fully usable for attaching secondary network interfaces to Pods.

This work was done as part of [KEP #4817](https://www.kubernetes.dev/resources/keps/4817/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) and [SIG Network](https://www.kubernetes.dev/community/community-groups/sigs/network/).


#### DRA: handle extended resource requests via DRA Driver

DRA Extended Resource support reaches Stable in Kubernetes v1.37. This feature allows DRA drivers to fulfill requests made
through the traditional _extended resource_ mechanism, such as `abc.example/gpu: 3` in a Pod spec, without requiring a
separate [device plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/).

With this mechanism, an extended resource name can be assigned directly to a DeviceClass. Pods requesting that resource can then have a device allocated through DRA without needing to define a ResourceClaim in the workload.

This work was done as part of [KEP #5004](https://www.kubernetes.dev/resources/keps/5004/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).

#### DRA: device taints and tolerations

Support for _taints and tolerations_ for physical devices managed through DRA is now Stable in Kubernetes v1.37. By default, any available device can be considered for scheduling. This enhancement provides greater control over device scheduling by allowing DRA drivers to mark specific devices as tainted, preventing them from being selected for workloads. Alternatively, cluster administrators can create a DeviceTaintRule to taint devices based on specific selection criteria, such as all devices managed by a particular driver. 

This work was done as part of [KEP #5055](https://www.kubernetes.dev/resources/keps/5055/)
led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).

#### DRA: standard numaNode device attribute {#dra-standard-numanode-device-attribute}

Kubernetes v1.37 defines a new standard _NUMA node device attribute_. It standardizes
`resource.kubernetes.io/numaNode` as a shared attribute name for device NUMA node information, allowing devices managed by
different DRA drivers to be compared based on the same NUMA node. This avoids each driver defining its own attribute name and
provides a consistent way to identify NUMA placement across devices. The enhancement lands directly as Stable because it is a
naming and registration KEP with no feature gate or in-tree behavior changes.

This work was done as part of [KEP #6072](https://www.kubernetes.dev/resources/keps/6072/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node).

### Node declared features {#node-declared-features}

_Node declared features_ graduate to Stable in Kubernetes v1.37, providing a framework to declare the availability of specific, feature-gated Kubernetes features for Nodes.
This would then be used by control plane components (such as the `kube-scheduler`, admission controllers, or the API server itself) to manage version skew.

The feature introduces a new `.status.declaredFeatures` field for Nodes, which is used to declare a feature graduating
through the Alpha → Beta → Stable stages. The control plane can use this to adopt
the correct behavior even in a cluster running a mixture of different node versions.

Once features graduate to Stable and the control plane can assume all nodes support them across the supported version skew
window, nodes stop reporting them.

The `kubelet` determines its declared features when it starts, based only on feature gates and the node’s static
configuration (so any changes require a `kubelet` restart).

This work was done as part of [KEP #5328](https://www.kubernetes.dev/resources/keps/5328/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).

### Storage version migrator {#storage-version-migrator}

Kubernetes v1.37 sees the _StorageVersionMigration API_ (`storagemigration.k8s.io/v1`) graduate to Stable and become enabled by
default. It helps migrate existing resources, both built-in and custom, from an older storage version to the new storage
version after an API upgrade, such as when the preferred storage version changes from `v1beta1` to `v1`. It can also be used to rewrite existing
data after a change to encryption at rest, so that stale data is stored using the new encryption settings.

Historically, cluster administrators and CustomResourceDefinition authors had to use manual `kubectl get` or
`kubectl replace` scripts, or deploy the out-of-tree `kube-storage-version-migrator` component to rewrite existing resources. These
approaches were often tedious, error-prone, and difficult to monitor.

To start a storage version migration, users would need to create a declarative StorageVersionMigration object. The built-in
`StorageVersionMigrator` controller in the Kubernetes control plane watches for these objects and automatically migrates
existing resources to the default storage version for that API. Since StorageVersionMigration is a standard Kubernetes API,
CRD authors can trigger migrations as part of a CRD upgrade instead of managing the migration separately.

This work was done as part of [KEP #4192](https://www.kubernetes.dev/resources/keps/4192/) led by [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/).

### Stable: Pod certificates and Cluster Trust Bundles {#pod-certificates-and-clustertrustbundles} 

[Pod certificates](/docs/reference/access-authn-authz/certificate-signing-requests/#pod-certificate-requests) and the closely related [ClusterTrustBundles](/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles)
both graduate to Stable in Kubernetes v1.37, providing first-class support for distributing private keys, X.509
certificates, and trust bundles to Pods.

To use this, the developer or administrator chooses a signer name and deploys a _signer controller_ that
watches PodCertificateRequest objects, issues and refreshes certificates for eligible Pods, and maintains the corresponding ClusterTrustBundle objects containing the trust anchors needed to verify those certificates.
A workload then opts into this identity by defining a `podCertificate` projected volume with the chosen signer name. Workloads can also mount a ClusterTrustBundle projected volume to load the trust anchor information.

This work was done as part of two KEPs - [KEP #4317](https://www.kubernetes.dev/resources/keps/4317/) and [KEP #3257](https://www.kubernetes.dev/resources/keps/3257/) led by [SIG Auth](https://www.kubernetes.dev/community/community-groups/sigs/auth/).

## Features graduating to Beta

### Gang scheduling support in Kubernetes

As Kubernetes becomes the de facto standard for managing AI/ML workloads at scale, scheduling workloads such as AI/ML training jobs and HPC simulations becomes more important than ever. However, scheduling becomes challenging because the default Kubernetes scheduler schedules Pods individually, which can result in some Pods being scheduled while others remain pending due to insufficient resources. This partial scheduling can lead to deadlocks and inefficient use of cluster resources.

_Gang scheduling_ graduates to Beta in Kubernetes v1.37, improving upon native support for gang scheduling through the  Workload API and PodGroup concept.
This feature implements an _all-or-nothing_ scheduling strategy, ensuring that a defined group of Pods is scheduled only when the cluster has sufficient resources to accommodate the entire group. The Beta graduation of this enhancement also introduces workload-aware preemption to avoid premature preemptions that do not help a workload make progress, along with PodGroup queueing to better coordinate competing workloads.

Importantly, it addresses livelock scenarios that can occur when multiple workloads are being scheduled simultaneously by the `kube-scheduler`, preventing them from repeatedly interfering with one another without making progress.

This work was done as part of [KEP #4671](https://www.kubernetes.dev/resources/keps/4671/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).


### Native histogram support for Kubernetes metrics

Kubernetes exposes hundreds of histogram metrics in [Prometheus format](https://prometheus.io/docs/instrumenting/exposition_formats/) across its control plane components, which are essential to
monitor cluster health and debug performance issues. However, classical Prometheus histograms relied on static, pre-defined
buckets that forced a compromise between data accuracy and memory usage. To mitigate this, Prometheus introduced _native
histograms_ that use dynamic exponential bucket boundaries instead of fixed boundaries, providing significant storage efficiency,
improved query performance, and finer-grained visibility into distributions while maintaining full backward compatibility
with existing monitoring infrastructure. 

Kubernetes v1.37 graduates native histogram support for Kubernetes metrics to Beta. Building on the Alpha implementation,
which introduced the `NativeHistograms` feature gate, the Beta phase improves the implementation and rollout experience. When
enabled, Kubernetes components expose histograms in both classic and native formats when the requested scrape protocol supports Native
Histograms, (specifically `PrometheusProto`), allowing existing dashboards and alerts to continue working while users migrate at
their own pace. The implementation also refactored histograms created in `init()` functions to use lazy initialization,
ensuring native histogram options are correctly applied after feature gates are parsed. These changes provide a more reliable
implementation while retaining safe rollout and rollback through the feature gate or Prometheus-side configuration for
Prometheus 3.x users.

This work was done as part of [KEP #5808](https://www.kubernetes.dev/resources/keps/5808/) led by [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/).

### WAS: Features graduating to Beta

#### Workload-aware preemption

Kubernetes traditionally performs preemption at the Pod level, which can be inefficient for workloads made up of multiple
tightly coupled Pods. In Kubernetes v1.37, workload-aware preemption graduates to Beta, allowing the scheduler to consider a
PodGroup when making preemption decisions. This helps the scheduler consider the workload as a whole when preempting lower
priority workloads, reducing cases where individual Pods are disrupted without providing enough capacity for the workload to
make progress.

This work was done as part of [KEP #5710](https://www.kubernetes.dev/resources/keps/5710/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).

#### DRA: ResourceClaim support for workloads

Dynamic Resource Allocation (DRA) allows Pods to request specialized resources through ResourceClaims. In Kubernetes v1.37,
DRA ResourceClaims support for workloads graduates to Beta, allowing Workload and PodGroup APIs to associate
ResourceClaims and ResourceClaimTemplates with the groups of Pods. This allows ResourceClaims to be shared across a
workload rather than reserved individually for each Pod, while ResourceClaimTemplates can create claims for PodGroups
automatically.

This work was done as part of [KEP #5729](https://www.kubernetes.dev/resources/keps/5729/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).

### cAdvisor-less, CRI-full container and Pod stats {#cadvisor-less-cri-full-stats}

The `kubelet` has historically obtained container and Pod statistics from `cAdvisor`, while the Container Runtime
Interface (CRI) exposes statistics of its own. Having two sources for the same metrics makes it harder to tell where a
particular value came from.

In Kubernetes v1.37, the cAdvisor-less, CRI-full Container and Pod Stats enhancement graduates to Beta. The enhancement
expands the CRI to provide the container and pod statistics needed by Kubernetes, allowing the `kubelet` to get these metrics
directly from the container runtime instead of relying on `cAdvisor` for them.

This moves container and pod metrics toward a single source of truth, while reducing duplicated metric collection and
simplifying how the `kubelet` gathers and exposes these statistics.

This feature is Beta in v1.37 but **off** by default; enable the `PodAndContainerStatsFromCRI` feature gate to try it.

This work was done as part of [KEP #2371](https://www.kubernetes.dev/resources/keps/2371/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).

### Support memory QoS with cgroups v2

Kubernetes is improving its quality of service mechanisms to cover memory protection and isolation for Kubernetes workloads. For nodes running Linux, the _memory
QoS_ feature uses memory requests and limits to configure cgroup controls that can protect requested memory from reclamation and throttle memory usage before
workloads reach their hard limits. This can help reduce the impact of memory pressure on memory-sensitive workloads and improve node stability.

In Kubernetes v1.37, memory QoS support is graduating to Beta. The feature uses cgroups v2 memory controls such as `memory.min`,
`memory.low` and `memory.high` to provide different levels of memory protection and throttling. For example, memory requests
can be used to protect memory from reclamation, while `memory.high` can be used to throttle workloads that exceed their
configured threshold. 

The `MemoryQoS` feature gate is enabled by default in v1.37. Cluster operators can control memory protection through the `kubelet`’s
`memoryReservationPolicy` setting and configure memory throttling with `memoryThrottlingFactor`. The defaults are designed to
avoid introducing unexpected memory throttling for existing workloads when upgrading to v1.37, while allowing operators to
opt into the additional memory protection capabilities. 

This work was done as part of [KEP #2570](https://www.kubernetes.dev/resources/keps/2570/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).

### Pod-level resource managers

In Kubernetes v1.37, _Pod-level resource managers_ graduate to Beta behind the `PodLevelResourceManagers` feature gate,

which stays **disabled by default**. Enabling it allows the topology, CPU, and memory resource

managers to use the resources defined for an entire Pod when making

allocation and NUMA alignment decisions. This makes it possible to manage a Pod as a single resource unit while still
supporting different resource requirements between the containers within it.

With pod-level resource management, a Pod can reserve a NUMA-aligned pool of CPU and memory based on its overall resource budget. Containers that require dedicated resources can receive exclusive portions of that pool, while other containers, such as sidecars or supporting workloads, can share the remaining resources. This is particularly useful for performance-sensitive workloads such as AI/ML and high-performance computing, where keeping resources close to each other on the same NUMA node can improve performance without requiring every container in the Pod to have dedicated resources. 

The feature also supports a container scope, where containers can continue to receive independent NUMA-aligned allocations. This provides more flexibility for workloads that combine a performance-sensitive container with other containers that have different resource requirements. 

This work was done as part of [KEP #5526](https://www.kubernetes.dev/resources/keps/5526/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).

### Watch-based route controller reconciliation

The route controller in the cloud-controller-manager library previously reconciled routes on a fixed interval, by default every 10 seconds. This could result in unnecessary requests to infrastructure providers, even when nothing had changed and could also delay route updates when a new Node is added. 

_Watch-based route controller reconciliation_ graduated to beta in Kubernetes v1.37. This release also adds observability for this work: the route controller's Alpha `route_sync_total` metric gains two labels, `trigger` (`periodic` or `node_change`) and `outcome` (`changed`, `noop`, or `error`), so operators can see whether periodic reconciliation is actually correcting route drift or just running as a no-op, and can track failed reconciles.

With watch-based route controller reconciliation, the route controller can reconcile routes from watch events instead of waiting for the next fixed interval: a reconciliation can start as soon as relevant Node changes occur, such as a Node being added or removed or when its addresses or assigned Pod CIDRs change. A less frequent periodic reconciliation still runs to catch outdated routes and keep the state consistent. This behavior sits behind the `CloudControllerManagerWatchBasedRoutesReconciliation` feature gate and is disabled by default, so the transition has not changed default behavior.

This reduces unnecessary requests to infrastructure providers while allowing routes for newly added Nodes to be reconciled sooner. The change does not alter the route reconciliation logic itself; it changes when reconciliation is triggered.

This work was done as part of [KEP #5237](https://www.kubernetes.dev/resources/keps/5237/) led by [SIG Cloud Provider](https://www.kubernetes.dev/community/community-groups/sigs/cloud-provider/).

### Storage capacity scoring of Nodes

The `VolumeBinding` scheduler plugin has always been able to score nodes for statically bound PVs based on free capacity, but that scoring never extended to dynamic provisioning.

When a CSI driver provisions a new volume on demand, the scheduler had no way to prefer a node with more or less free space.

This was a gap for local storage, as an admin might want pods landing on the node with the most free capacity to leave room for a later volume expansion or on the node with the least (but still sufficient) free capacity to bin-pack workloads and cut down on the number of nodes a cloud cluster needs to run.

Kubernetes v1.37 graduates storage capacity scoring for dynamic provisioning to Beta behind the `StorageCapacityScoring`
feature gate. First introduced in Alpha in v1.33, this feature consolidates (and deprecates) the older
`VolumeCapacityPriority` gate from [KEP #1845](https://www.kubernetes.dev/resources/keps/1845/). When enabled, the
VolumeBinding plugin's `Score` extension point reads `CSIStorageCapacity` objects published by a driver's external
provisioner sidecar and scores nodes for dynamic provisioning the same way it already does for static bindings. Admins choose
the strategy via the `Shape` setting in `VolumeBindingArgs`, defaulting to "prefer the node with the maximum allocatable" so
there is room for expansion later. 

The feature depends solely on the `StorageCapacityScoring` gate: scoring for statically
bound PVs runs as soon as it's enabled, independent of any CSI driver. A driver only needs `StorageCapacity: true` on its
`CSIDriver` object so that its dynamically-provisioned volumes also get capacity-aware scoring. The feature is fully
reversible, and disabling the gate stops all VolumeBinding capacity scoring — static and dynamic alike — without affecting
already scheduled pods.

This work was done as part of [KEP #4049](https://www.kubernetes.dev/resources/keps/4049/) led by [SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/).

### Integrate CSI volume attach limits with Cluster Autoscaler

Kubernetes v1.37 improves Cluster Autoscaler's integration with CSI volume attach limits, so that when it creates new
nodes for pending Pods, Cluster Autoscaler can more accurately determine how many new nodes are required to attach all
pending Pods that use CSI volumes. Cluster Autoscaler already had visibility into CSI volume attach limits for existing
nodes, but not for the nodes it was about to create, which means it could undershoot scale-ups and leave volume-backed
Pods pending even after adding capacity. The problem compounds on the scheduling side: the `NodeVolumeLimits` plugin treats a node with no published CSI driver info as having no limits at all, so a freshly created node that hasn't yet reported its `CSINode` object can get crowded with more volume-backed pods than it can actually mount, which is a race condition that, until now, cluster admins had no way to close.

Kubernetes v1.37 graduates CSI-aware autoscaling to Beta behind the `VolumeLimitScaling` feature gate, first introduced in Alpha in v1.35. Cluster autoscaler now runs its scale-up simulations against templated `CSINode` objects, so it correctly accounts for attach limits whether it's scaling an existing node group or scaling one from zero. On the scheduler side, admins can opt in per `CSIDriver`, via a new `PreventPodSchedulingIfMissing` field, to block pod placement on nodes that haven't reported their driver yet, with dedicated `CSIDriverMissingOnNode` and `CSINodeMissing` errors making those scheduling failures easier to debug. The Beta phase adds e2e coverage for scale-down behavior and CSI opt-in scenarios, and updates the `failed_scale_ups_total` and `scaled_up_nodes_total` metrics to include CSI driver information. Both the autoscaler and scheduler changes stay strictly opt-in: disabling the feature gate restores today's default of unlimited pod placement on nodes without `CSINode` data, so distros and admins running autoscalers that aren't CSI-aware yet (e.g. Karpenter) aren't forced into the new behavior.

This work was done as part of [KEP #5030](https://www.kubernetes.dev/resources/keps/5030/) led by [SIG Autoscaling](https://www.kubernetes.dev/community/community-groups/sigs/autoscaling/).

### Report last used time on a PVC

`PersistentVolumeClaims` tend to outlive the workloads that created them. When an app gets deleted or migrated, its PVC remains behind, consuming storage and increasing costs. 

Kubernetes v1.37 graduates PVC "last used" tracking to Beta behind the `PersistentVolumeClaimUnusedSinceTime` feature gate, which shipped disabled by default in Alpha (v1.36) and is now enabled by default. The feature adds a new `Unused` condition to `PersistentVolumeClaimStatus`, managed by the existing PVC protection controller: `Status=True (Reason=NoPodsUsingPVC)` once the last non-terminal Pod referencing the PVC goes away, and back to `Status=False (Reason=PodUsingPVC)` as soon as a Pod starts referencing it again. The condition's `lastTransitionTime` doubles as an "unused since" timestamp, so admins can query how long a PVC has actually been idle without Kubernetes tracking which Pod used it last or making any deletion decision itself; that's left entirely to the admin. One thing worth noting is that the timestamp reflects when the controller observed no Pods using the PVC, not the exact moment the volume unmounted at the infrastructure level, so the reported idle time may run a little short of the true figure but should never overstate it.

This work was done as part of [KEP #5541](https://www.kubernetes.dev/resources/keps/5541/) led by [SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/).

### etcd RangeStream support

`etcd`'s unary `Range` RPC builds an entire response in memory before sending it back, which becomes a problem at scale. On a large list, say kube-apiserver's watch cache warming up on a big cluster, the raw key-value slice, its serialized protobuf form, and the gRPC send buffer all have to coexist in memory at once, and the resulting spikes ripple through kube-apiserver too. Pagination doesn't really fix the underlying cost either because each paginated page still walks the entire B-tree index to recompute the total result count, turning what should be an `O(limit)` operation into an `O(total_keys)` one on every single page.

Kubernetes v1.37 ships `etcd` `RangeStream` support directly at Beta, behind the `EtcdRangeStream` feature gate (`kube-apiserver` only, **on** by default).
This release adds a new server-streaming `RangeStream` RPC that reuses the existing `RangeRequest` but returns chunks instead of one buffered blob: the server paginates internally with adaptive chunk sizing (each chunk's target size adjusts based on `MaxRequestBytes` and the value sizes observed so far), pins a single MVCC revision so the merged stream stays snapshot-consistent, and derives the total key count from the running tally it builds while streaming, rather than a separate index walk.
`kube-apiserver`'s watch cache initialization is the primary consumer, and it now decodes each chunk into synthetic _created_ events inline as they arrive instead of assembling the full list in memory first, with the same treatment applied to direct `GetList` calls when `WatchList` is disabled. 

The feature requires `etcd` 3.7+; against older `etcd`, `kube-apiserver` detects the Unimplemented response and falls back to unary `Range` automatically, with zero behavior change. If the pinned revision gets compacted mid-stream, `kube-apiserver` treats it the same as any other watch cache init failure and retries, which is no worse than the compaction races a paginated List call can already hit today. Beta graduation criteria include a scalability test measuring large-list latency on a 5000-node cluster, and `etcdctl get --stream` ships alongside it for anyone who wants to poke at the new RPC directly.

This work was done as part of [KEP #5966](https://www.kubernetes.dev/resources/keps/5966/) led by [SIG etcd](https://www.kubernetes.dev/community/community-groups/sigs/etcd/).

### Concurrent watch object decode

`kube-apiserver` decodes and transforms every watch event from `etcd` one at a time on a single goroutine, so one slow per-event transform, most notably a CRD conversion webhook call, blocks every event queued behind it. That's mostly a nuisance for built-in resources, but for a CRD whose served version differs from its stored version, converting a cold cache serially can take minutes. If that exceeds `etcd`'s default 5-minute compaction interval, the revision the cache started reading from gets compacted before initialization finishes, the watch can't resume, and init just restarts and never converges for a large enough resource, with every client trying to list or watch it getting errors in the meantime.

The `ConcurrentWatchObjectDecode` gate has actually been in Beta, off by default, since v1.31, and Kubernetes v1.37 flips it on by default. Enabling it moves the decode/transform step onto a bounded pool of worker goroutines (10 by default, tuned from a sweep that showed gains flattening out around 8–12) instead of a single one, with a collector reassembling events back into their original order before delivery, so event ordering is preserved exactly. In benchmarks over 150k pods, concurrent decode alone cuts cache initialization about 40%, and about 55% combined with the new `EtcdRangeStream` feature also landing this release (see KEP 5966). The main tradeoff to watch is conversion webhook load. With the feature on, up to 10 conversions can now run concurrently against a webhook during cache init instead of one at a time. The total call volume is unchanged, only how many run at once, so this mainly matters for webhooks that cap their own concurrency below 10.

This work was done as part of [KEP #6178](https://www.kubernetes.dev/resources/keps/6178/) led by [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/).

### Stale controller mitigation {#stale-controller-mitigation}

Every controller in `kube-controller-manager` works off a local cache built from watching the `kube-apiserver`, and that watch
stream is only eventually consistent. A change can show up in milliseconds, or it can take seconds or even minutes under
load. Today operators have no visibility into that lag and no way to tell a normal delay from a controller that's fallen
dangerously out of sync, so a controller can keep reconciling against a view of the world that's already stale.

Stale controller mitigation has been Beta since v1.36, enabled by default per controller behind a `StaleControllerConsistency<Controller>`
feature gate; Kubernetes v1.37 extends it to the HorizontalPodAutoscaler controller and adds the circuit-breaking variant and
extra metrics described below. The core mechanism
is a _read your writes_ guarantee: client-go's `ResourceEventHandlerFuncs` gets a new `BookmarkFunc` callback so a controller
can reliably track the resource version of objects it cares about, even through edge cases the existing add/update/delete
callbacks miss. A controller records the resource version of its own writes and, on its next reconcile, skips and requeues
until its informer cache has actually caught up to that write. The DaemonSet controller is a good example of this. It tracks
DaemonSet → Pod resource versions so it won't re-reconcile against its own stale pod cache. A second, circuit-breaking
variant targets latency-sensitive controllers like node-lifecycle, which can otherwise read a stale node lease from cache and
wrongly decide it's expired; instead, it does a live GET on the disruptive decision and marks its cache "not ready" until
it's caught up, rather than acting on a stale read. `StaleControllerConsistency` gates the mitigation itself (scoped
initially to controllers KCM has flagged as high-scale), `MonitorInformerStaleness` is a separate, observation-only gate that
polls the apiserver directly every 5 seconds purely to surface how far behind an informer's cache actually is, and
`AtomicFIFO` / `UnlockWhileProcessingFIFO` are the underlying client-go workqueue plumbing the mitigation depends on. None of
this changes default reconciler behavior; a paused-and-requeued controller can look stuck when it's really just waiting on
its cache, and it rolls back cleanly since nothing it does is irreversible.

This work was done as part of [KEP #5647](https://www.kubernetes.dev/resources/keps/5647) led by [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/).

### Manifest-based admission control config

In Kubernetes, admission control is responsible for enforcing policies on resources before they are accepted by the API
server. However, admission webhooks and policies configured through the Kubernetes API are dependent on the API server and
etcd during cluster startup and cannot protect the admission configuration resources themselves. This creates a gap during
cluster bootstrap and allows critical admission policies to be modified or removed by users with sufficient privileged access.

In Kubernetes v1.37, [manifest-based admission control](/docs/reference/access-authn-authz/manifest-admission-control/) configuration graduates to Beta, allowing admission webhooks and CEL-based

policies to be loaded from manifest files on disk and enforced from API server startup. Because the configuration is managed
independently of the Kubernetes API, it can also protect API-based admission resources from modification. Manifest files are
watched for changes and valid updates are reloaded automatically, while invalid updates leave the previously loaded
configuration in place. 

This work was done as part of [KEP #5793](https://www.kubernetes.dev/resources/keps/5793/) led by [SIG API Machinery](https://www.kubernetes.dev/community/community-groups/sigs/api-machinery/) 


### Improved handling for undecryptable resources 

Kubernetes stores resources in etcd, where encryption at rest can be used to protect sensitive data. However, when encrypted
resources can no longer be decrypted, for example because the encryption key is unavailable, the API server cannot read or
manage those resources normally. This can leave resources in the cluster that cannot be accessed through the Kubernetes API,
requiring administrators to manually modify the underlying etcd data to recover them.

Kubernetes v1.37 includes Beta support for cluster administrators to identify and remove resources that cannot be decrypted by the API server.

Previously Alpha, and introduced in Kubernetes v1.32, this support allows problem API resources to be removed via

the Kubernetes API rather than directly manipulating the etcd file. This feature also provides safeguards for administrators
to verify affected resources before deletion. 

This work was done as part of [KEP #3926](https://www.kubernetes.dev/resources/keps/3926/) led by [SIG Auth](https://www.kubernetes.dev/community/community-groups/sigs/auth/). 

## New features in Alpha

### New `Recreate` strategy for StatefulSet rollouts

Kubernetes v1.37 introduces the `Recreate` strategy for StatefulSet rollouts. The StatefulSet API previously only offered two update
strategies: OnDelete (manual) and RollingUpdate (automatic, default). Similar to Deployments, the `Recreate` update strategy
deletes all of the StatefulSet's Pods before creating new Pods that reflect modifications made to a StatefulSet's
`.spec.template`. Using this strategy requires the `StatefulSetRecreateStrategy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/#StatefulSetRecreateStrategy) to be enabled. 

This work was done as part of [KEP #3541](https://www.kubernetes.dev/resources/keps/3541/) led by [SIG Apps](https://www.kubernetes.dev/community/community-groups/sigs/apps/).

### DRA: Alpha features to look out for 

#### DRA: Node allocatable resource request

Kubernetes v1.37 improves Alpha support for managing node resources such as CPU, memory, and huge pages through DRA. It
unifies standard and DRA resource accounting, helping prevent the same node capacity from being counted twice.

This update introduces distinct API fields for `mapping` (for devices directly modeling core resources, like CPU/memory DRA drivers) and `overhead` (like auxiliary host memory for accelerator devices). The kubelet now enforces these allocations across pod and container cgroups, integrates them with Memory QoS, OOM score calculations, and in-place pod resizing.

This work was done as part of [KEP #5517](https://www.kubernetes.dev/resources/keps/5517/),
led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) with participation from [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).

#### DRA: derived attributes

Kubernetes v1.37 introduces Alpha support for [derived attributes in DRA](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#derived-attributes). Workloads can use CEL expressions to create virtual
attributes from device information and use them when selecting related devices.

This makes it easier to co-locate devices such as GPUs and network interfaces, even when their drivers use different
attribute names or formats. For example, a workload can derive a shared NUMA identifier and use it to select devices with
matching topology.

This work was done as part of [KEP #6080](https://www.kubernetes.dev/resources/keps/6080/), led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/) with participation from [SIG Network](https://www.kubernetes.dev/community/community-groups/sigs/network/).

#### DRA: device compatibility groups {#dra-device-compatibility-groups}

DRA can be used to manage devices that support different partitioning or virtualization schemes. However, some of these
configurations cannot be used together on the same physical device, such as MIG and vGPU on a GPU. Previously, these
incompatibilities could only be detected during device preparation, after the scheduler had already made its decision.

In Kubernetes v1.37, DRA  adds device compatibility groups, allowing resource drivers to describe which devices can be
allocated together. The scheduler can use this information when making allocation decisions, preventing incomplete devices
from being assigned together and avoiding Pod startup failures caused by incomplete device configurations. 

This work was done as part of [KEP #5963](https://www.kubernetes.dev/resources/keps/5963/), led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/). 

### Scheduler preemption for in-place Pod resize {#scheduler-preemption-in-place-pod-resize}

Kubernetes v1.37 introduces _scheduler preemption for in-place pod resize_, behind  the (opt-in, Alpha) `InPlacePodVerticalScalingSchedulerPreemption` feature gate. This change addresses an important feature gap that remained after the core [pn-place Pod vertical scaling](/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize-inplace) feature graduated to Stable: if a running pod requested additional resources that exceeded the node's available capacity, `kubelet` marked the
request as `Deferred`, leaving the pod waiting until sufficient resources became available on the node. With this
enhancement, the Kubernetes control plane can actively free up capacity on a fully-utilized node and preempt lower-priority
workloads, enabling the pending in-place resizes of critical, higher-priority applications to succeed.

This work was done as part of [KEP #5836](https://www.kubernetes.dev/resources/keps/5836/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).

### Dynamic resize of memory-backed volumes

Also building upon in-place Pod vertical scaling, the Alpha _in-place scaling for memory backed volumes_ feature extends the pod

`/resize` subresource, which previously only enabled dynamic CPU and memory adjustments without restarting containers, to
support updating the `sizeLimit` of memory-backed (medium: Memory) `emptyDir` volumes on running pods. When a volume's `sizeLimit`
is explicitly adjusted via the /resize subresource, Kubelet dynamically updates the underlying tmpfs mount without container
disruption while safely preventing out-of-memory errors or false-positive eviction triggers. This is particularly useful for
stateful and memory-intensive workloads that rely on in-memory ephemeral storage, allowing them to dynamically scale storage
limits alongside container memory capacity without incurring Pod restarts or application downtime. 


This is an opt-in, off-by-default Alpha feature. To try it out, enable the

`InPlacePodVerticalScalingMemoryBackedVolumes` feature gate.

This work was done as part of [KEP #6030](https://www.kubernetes.dev/resources/keps/6030/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/) and [SIG Storage](https://www.kubernetes.dev/community/community-groups/sigs/storage/).

### Specialized lifecycle management for Nodes

Several Kubernetes components need to understand a Node's lifecycle state, and today each one infers it from a different mix
of Node readiness, taints, Pod state, labels, annotations, and provider APIs. This enhancement introduces well-known
lifecycle conditions on Nodes, giving administrators a single Kubernetes-owned place to publish lifecycle state that core
controllers and ecosystem tooling can consume. These new Node Conditions are: `DrainInProgress`, `Drained`, `MaintenancePlanned`, `MaintenanceInProgress`, and `GracefulNodeShutdownInProgress` 

This work was done as part of [KEP #5683](https://www.kubernetes.dev/resources/keps/5683/) led by [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/).

### WAS: Alpha features to look out for 

#### CompositePodGroup API

While previous releases introduced support for gang scheduling of workloads with
a flat structure, modern AI/ML workloads are complex and have more sophisticated
scheduling requirements. In Kubernetes v1.37, the new Alpha `CompositePodGroup`
API allows Kubernetes to describe complex workloads as a hierarchy of groups
instead of a flat set of Pods. This enables multi-level gang scheduling,
workload-aware preemption and topology-aware scheduling.

This work was done as part of [KEP #6012](https://www.kubernetes.dev/resources/keps/6012/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/)

#### Workload Aware Scheduling Controller APIs

As an Alpha feature Kubernetes v1.37 provides common framework for integrating workload controllers (such as JobSet, TrainJob, LWS, and RayJob, along with core workloads such as `Job`) with _Workload-aware Scheduling_ (WAS). The framework provides reusable `scheduling.k8s.io` API primitives, such as _topology constraints_ and _disruption policies_, along with shared libraries that handle the creation of scheduling resources. This allows controllers to expose WAS features natively within their APIs in a consistent way without implementing the same scheduling logic separately.

The framework provides reusable `scheduling.k8s.io` API primitives, such as _topology constraints_ and _disruption policies_,
along with shared libraries that handle the creation of scheduling resources. This allows controllers to expose WAS features
natively within their APIs in a consistent way without implementing the same scheduling logic separately.

This work was done as part of [KEP #6089](https://www.kubernetes.dev/resources/keps/6089/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/).

#### Integrate workload APIs with the Job controller {#workload-apis-job-controller}

Initially introduced in Kubernetes v1.36 with limited functionality, this feature builds on top of the [Workload Aware Scheduling Controller APIs](#workload-aware-scheduling-controller-apis) adding a new user-facing `spec.scheduling` field to the `batch/v1` Job in Kubernetes v1.37, allowing users
to explicitly configure scheduling policies, topology constraints, disruption modes, and resource claims. If
`spec.scheduling` is omitted, the Job defaults to Basic scheduling, preserving existing behavior while still creating a Basic
Workload/PodGroup for workload-aware scheduling, without enforcing a minCount gate. Users can explicitly opt into Gang
scheduling, where `minCount` defaults to the Job’s parallelism, and the controller uses the shared `workloadbuilder` library
to translate the scheduling configuration into the corresponding Workload and PodGroup objects instead of implementing custom
translation logic.

This work was done as part of [KEP #5547](https://www.kubernetes.dev/resources/keps/5547/) led by [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/). 

### localhost NodePort userspace proxy for `nftables`

Kubernetes v1.37 adds an opt-in userspace proxy to the `nftables` `kube-proxy` backend, allowing NodePort services to be accessed
through `localhost` over IPv4 and IPv6. This closes a gap between the `nftables` and `iptables` backends, as `nftables` could not
previously serve localhost NodePorts. 

The proxy is enabled when `localhost` or a loopback address is included in the `kube-proxy` `--nodeport-addresses`
configuration. This can be useful for workloads such as local container registries that rely on `localhost:<NodePort>`
connections. The existing behavior of the `iptables` and `ipvs` backends is unchanged. 

This work was done as part of [KEP #6032](https://www.kubernetes.dev/resources/keps/6032/) led by [SIG Network](https://www.kubernetes.dev/community/community-groups/sigs/network/).

## Other notable changes

### `maxUnavailable` for StatefulSets back on by default

The `maxUnavailable` field for StatefulSets has been re-enabled by default in Kubernetes v1.37 (after a bug was observed
in v1.36).

The bug occurred where a faulty initial StatefulSet revision created a Pod that never became ready, and with
`MaxUnavailableStatefulSet` enabled, the StatefulSet controller failed to update that Pod to the newer, corrected
revision. When the bug triggered, the affected Pod could end up stuck in a CrashLoopBackOff state indefinitely (see [kubernetes#137409](https://github.com/kubernetes/kubernetes/issues/137409)).


### Improved `nftables` performance

kube-proxy now uses the kernel’s netlink interface for nftables rule operations, bypassing the `nft` command-line tool. This makes kube-proxy more efficient when inspecting and managing its nftables rules, improving rule-management performance.

### Context handling and contextual logging in client-go

Support for context propagation and contextual logging in client-go is complete, with the exception of a small number of
authentication plugin log calls that still rely on the global klog logger because the underlying APIs do not support context
passing.

## Graduations, deprecations, and removals in v1.37

### Graduations to Stable

This lists all the features that graduated to Stable (also known as general availability). For a full list of updates
including new features and graduations from Alpha to Beta, see the release notes.

This release includes a total of 16 enhancements promoted to Stable:

* [Speed up recursive SELinux label change](https://www.kubernetes.dev/resources/keps/1710/)
* [ClusterTrustBundles](https://www.kubernetes.dev/resources/keps/3257/)
* [Pod Certificates](https://www.kubernetes.dev/resources/keps/4317/)
* [Allow setting arbitrary FQDN as the pod's hostname](https://www.kubernetes.dev/resources/keps/4762/) 
* [DRA: Resource Claim Status with possible standardized network interface data](https://www.kubernetes.dev/resources/keps/4817/) 
* [Configurable tolerance for HorizontalPodAutoscalers](https://www.kubernetes.dev/resources/keps/4951/)
* [Relaxed validation for Services names](https://www.kubernetes.dev/resources/keps/5311/) 
* [Add Resource Health Status to the Pod Status for Device Plugin and DRA](https://www.kubernetes.dev/resources/keps/4680/) 
* [DRA: device taints and tolerations](https://www.kubernetes.dev/resources/keps/5055/)
* [DRA: Handle extended resource requests via DRA Driver](https://www.kubernetes.dev/resources/keps/5004/) 
* [Node Declared Features](https://www.kubernetes.dev/resources/keps/5328/)
* [Add condition for sandbox creation](https://www.kubernetes.dev/resources/keps/3085/)
* [Move Storage Version Migrator in-tree](https://www.kubernetes.dev/resources/keps/4192/)
* [Resilient Watchcache Initialization](https://www.kubernetes.dev/resources/keps/4568/)
* [DRA: Standard numaNode Device Attribute](https://www.kubernetes.dev/resources/keps/6072/)
* [metrics.k8s.io API definition](https://www.kubernetes.dev/resources/keps/5207/)
* [KYAML](https://www.kubernetes.dev/resources/keps/5295/) 

## Deprecations, removals and community updates

As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better ones for the project's
overall health. 
See the Kubernetes [deprecation and removal policy](/docs/reference/using-api/deprecation-policy/) for more details on this process.
Many of these deprecations and removals were announced in the [Deprecations and Removals blog](/blog/2026/07/31/kubernetes-v1-37-sneak-peek/)

### Deprecation of `kube-dns`

CoreDNS has been the default cluster DNS add-on since Kubernetes v1.13, and `kube-dns` has not kept pace since then; features like EndpointSlices and dual-stack Services aren't available in it.

Kubernetes has already retired the kube-dns subproject and has split node-local-dns out into its own [repository](https://github.com/kubernetes-sigs/node-local-dns), where it continues to be maintained and works with CoreDNS. It is expected that no new packages will be built for kube-dns after v1.40. 

If you still run `kube-dns`, [start planning to migrate your clusters to CoreDNS](/docs/tasks/administer-cluster/coredns/).

### Deprecating `kube-proxy`'s support for `ipvs` mode

`kube-proxy` support for `ipvs` mode was introduced in v1.8 to resolve `iptables` performance bottlenecks. However, since the
kernel `ipvs` API alone cannot fully implement Kubernetes Services, `ipvs` mode continues to use `iptables` underneath 
([KEP-3866, "The ipvs mode of kube-proxy will not save us"](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/3866-nftables-proxy/README.md#the-ipvs-mode-of-kube-proxy-will-not-save-us)).

Clusters running `kube-proxy` in `ipvs` mode (or mode: `ipvs` in KubeProxyConfiguration) now log a deprecation warning on startup. The deprecation timeline looks like this:
- By v1.40, `ipvs` mode for `kube-proxy` is expected to be disabled by default (still selectable via the feature gate)
- By v1.43, support for `ipvs` mode would be removed entirely [KEP #5495, Graduation Criteria](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/5495-deprecate-ipvs-mode-in-kube-proxy/README.md#graduation-criteria).
To confirm which mode you’re currently running, use:

```bash
kubectl -n kube-system get configmap kube-proxy -o jsonpath='{.data.config\.conf}' | grep 'mode:'
```

To understand the rationale behind this deprecation, see [KEP #5495](https://www.kubernetes.dev/resources/keps/5495/).

### `kubectl`: `kubectl run --filename/-f` to be deprecated

The `--filename` (or `-f`) flag for `kubectl run` is being deprecated as the generated pod is always built purely from CLI arguments like `NAME` and `--image`.

See [kubernetes/kubernetes#138671](https://github.com/kubernetes/kubernetes/issues/138671) for the original issue and discussion.

### `kubelet`: static Pods can no longer reference Secrets or ConfigMaps

Static Pods were never meant to read API resources directly, since they aren't created through the API server — but a bug let them reference Secrets or ConfigMaps via fields like `configMapRef` or `secretRef`. That bug is now fixed: as of v1.37 these references are strictly prohibited, and the `PreventStaticPodAPIReferences` feature gate that previously let you opt out of the restriction has been removed.

See [kubernetes/kubernetes#140226](https://github.com/kubernetes/kubernetes/issues/140226) for the original issue and discussion.

### Ongoing major change: Future removal of cgroup v1 support

As modern Linux distributions and container runtimes use [cgroup v2](/docs/concepts/architecture/cgroups/) as the default,
support for the legacy cgroup v1 is officially being phased out. Since the v1.35 release, the `failCgroupV1` setting has
defaulted to true. Consequently, the `kubelet` will fail to initialize on any nodes that still rely on cgroup v1 unless an
explicit configuration override is applied.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
failCgroupV1: false # temporary override
```

Using this override should be considered a short-term fix. Advanced resource management capabilities, such as memory QoS and in-place scaling for memory-backed volumes, work only on cgroups v2. While the override remains available in Kubernetes
v1.37, users are encouraged to migrate to cgroups v2, as support for cgroups v1 is planned to be removed in a future release.

To learn more about this deprecation, refer to [KEP #5573](https://www.kubernetes.dev/resources/keps/5573/).

### Release notes

Check out the full details of the Kubernetes v1.37 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.37.md).

### Availability

[Kubernetes v1.37](/releases/1.37/) is available for download from
the [Kubernetes download page](/releases/download/) or direct from on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.37.0).

To get started with Kubernetes, check out [these tutorials](/docs/tutorials/) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). 
You can also easily install v1.37 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/). 

### Release team

Kubernetes is only possible with the support, commitment, and hard work of its community. 
Each release team is made up of dedicated community volunteers who work together to build the many pieces that make up the
Kubernetes releases you rely on. 

This requires the specialized skills of people from all corners of our community, from the code itself to its documentation
and project management.

We would like to thank the entire [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.37/release-team.md) for the hours spent hard at work to deliver the Kubernetes v1.37 release to our community. 

The Release Team's membership ranges from first-time shadows to returning team leads with experience forged over several
release cycles. 

A very special thanks goes out to our release lead, [Dipesh Rawat](https://github.com/dipesh-rawat), for supporting us
through a successful release cycle, advocating for us, making sure that we could all contribute in the best way possible, and
challenging us to improve the release process.

### Project velocity

The CNCF K8s [DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. 

This includes everything from individual contributions to the number of companies that are contributing and is an
illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.37 release cycle, which ran for 15 weeks from May 18th, 2026, to August 26th, 2026, contributions to Kubernetes reached a maximum of 212 different companies and 1,754 individuals.

Source for this data: 

- [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1779058800000&to=1787781600000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)
- [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1779055200000&to=1787781600000%20&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

By contribution we mean when someone makes a commit, code review, comment, creates an issue or PR, reviews a PR (including
blogs and documentation), or comments on issues and PRs.

If you are interested in contributing, check out our [getting started](https://www.kubernetes.dev/docs/guide/#getting-started)
page. 

### Event update

Explore the upcoming KubeCons worldwide:

- [KubeCon + CloudNativeCon China](https://www.lfopensource.cn/kubecon-cloudnativecon-openinfra-summit-pytorch-conference-china/):
  September 7–9, 2026, in Shanghai, China
- [KubeCon + CloudNativeCon North America](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/):
  November 9–12, 2026, in Salt Lake City, United States

Explore the upcoming Kubernetes Community Days (KCDs) taking place for the rest of 2026:

#### September 2026

- [KCD x Ceph x OpenInfra Day Korea](https://community2.cncf.io/events/details/cncf-kcd-south-korea-presents-kcd-x-ceph-x-openinfra-day-korea-2026/):
  September 1, 2026, in Seoul, South Korea
- [KCD San Francisco Bay Area](https://community2.cncf.io/events/details/cncf-kcd-sf-bay-area-presents-kcd-san-francisco-bay-area-2026/):
  September 1, 2026, in Mountain View, United States
- [KCD Washington DC](https://community2.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2026/):
  September 15, 2026, in Washington, DC, United States
- [KCD Gujarat](https://community2.cncf.io/events/details/cncf-kcd-gujarat-presents-kcd-gujarat-2026/):
  September 19, 2026, in Ahmedabad, India
- [KCD São Paulo](https://community2.cncf.io/events/details/cncf-kcd-brasil-presents-kcd-sao-paulo-2026/):
  September 26, 2026, in São Paulo, Brazil
- [KCD Sofia](https://community2.cncf.io/events/details/cncf-kcd-sofia-presents-kubernetes-community-days-sofia-2026/):
  September 29, 2026, in Sofia, Bulgaria

#### October 2026

- [KCD UK – Edinburgh](https://community2.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-edinburgh-2026/):
  October 19–20, 2026, in Edinburgh, United Kingdom
- [KCD Nigeria](https://community2.cncf.io/events/details/cncf-kcd-nigeria-presents-kcd-nigeria-2026-telling-the-african-cloud-native-story/):
  October 24, 2026, in Lagos, Nigeria

#### November 2026

- [KCD Porto](https://community2.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2026-collab-with-devops-days-portugal/):
  November 19–20, 2026, in Porto, Portugal
- [KCD Suisse Romande](https://community2.cncf.io/events/details/cncf-kcd-suisse-romande-presents-kcd-suisse-romande-2026/):
  December 9–10, 2026, in Meyrin, Switzerland
- [KCD Provence](https://community2.cncf.io/events/details/cncf-kcd-provence-presents-kcd-provence-2026/):
  December 10, 2026, in Aix-en-Provence, France

#### December 2026

- [KCD Suisse Romande](https://community2.cncf.io/events/details/cncf-kcd-suisse-romande-presents-kcd-suisse-romande-2026/):
 December 9–10, 2026, in Meyrin, Switzerland
- [KCD Provence](https://community2.cncf.io/events/details/cncf-kcd-provence-presents-kcd-provence-2026/):
 December 10, 2026, in Aix-en-Provence, France
- [KCD Florida – Miami](https://community2.cncf.io/events/details/cncf-kcd-florida-presents-kcd-florida-2026-miami/):
  December 11, 2026, in Miami, United States

You can find the latest event details at the [CNCF Events Page](https://community2.cncf.io/events/#/list). 

### Upcoming release webinar

Join members of the Kubernetes v1.37 Release Team on Wednesday, September 23rd, 2026 at 4:00 PM (UTC) to learn about the release highlights of this release. For more information and registration, visit the [event page on the CNCF Online Programs site](https://community2.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v137-webinar/).


## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://kubernetes.dev/community/community-groups/sigs/) (SIGs) that align with your interests.

If you don't know where to start, join our monthly [New Contributor Orientations](https://www.kubernetes.dev/docs/orientation/)
where we teach the community how the project is structured, and we'll guide you on how to make your first contribution to the project.

- Read more on how to become a [Kubernetes Contributor](https://www.kubernetes.dev/docs/guide/)
- Read more about what’s happening with Kubernetes on our [blog](https://kubernetes.io/blog/)
- Join us on [Slack](http://slack.k8s.io/)
- Follow us on [Bluesky](https://bsky.app/profile/kubernetes.io) for the latest updates 
- Follow us on [LinkedIn](https://www.linkedin.com/company/kubernetes/)
- Follow us on [X](https://x.com/kubernetesio)
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your [Kubernetes End User Story](https://www.cncf.io/case-studies/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
