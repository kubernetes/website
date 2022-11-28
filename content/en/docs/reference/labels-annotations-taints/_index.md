---
title: Well-Known Labels, Annotations and Taints
content_type: concept
weight: 40
no_list: true
---

<!-- overview -->

Kubernetes reserves all labels and annotations in the kubernetes.io and k8s.io namespaces.

This document serves both as a reference to the values and as a coordination point for assigning values.

<!-- body -->

## Labels, annotations and taints used on API objects

### app.kubernetes.io/component

Example: `app.kubernetes.io/component: "database"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The component within the architecture.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/created-by (deprecated)

Example: `app.kubernetes.io/created-by: "controller-manager"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The controller/user who created this resource.

{{< note >}}
Starting from v1.9, this label is deprecated.
{{< /note >}}

### app.kubernetes.io/instance

Example: `app.kubernetes.io/instance: "mysql-abcxzy"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

A unique name identifying the instance of an application. To assign a non-unique name, use [app.kubernetes.io/name](#app-kubernetes-io-name).

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/managed-by

Example: `app.kubernetes.io/managed-by: "helm"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The tool being used to manage the operation of an application.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/name

Example: `app.kubernetes.io/name: "mysql"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The name of the application.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/part-of

Example: `app.kubernetes.io/part-of: "wordpress"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The name of a higher-level application this one is part of.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/version

Example: `app.kubernetes.io/version: "5.7.21"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The current version of the application.

Common forms of values include:

- [semantic version](https://semver.org/spec/v1.0.0.html)
- the Git [revision hash](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#_single_revisions) for the source code.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### cluster-autoscaler.kubernetes.io/safe-to-evict

Example: `cluster-autoscaler.kubernetes.io/safe-to-evict: "true"`

Used on: Pod

When this annotation is set to `"true"`, the cluster autoscaler is allowed to evict a Pod
even if other rules would normally prevent that.
The cluster autoscaler never evicts Pods that have this annotation explicitly set to
`"false"`; you could set that on an important Pod that you want to keep running.
If this annotation is not set then the cluster autoscaler follows its Pod-level behavior.

### kubernetes.io/arch

Example: `kubernetes.io/arch: "amd64"`

Used on: Node

The Kubelet populates this with `runtime.GOARCH` as defined by Go. This can be handy if you are mixing arm and x86 nodes.

### kubernetes.io/os

Example: `kubernetes.io/os: "linux"`

Used on: Node

The Kubelet populates this with `runtime.GOOS` as defined by Go. This can be handy if you are mixing operating systems in your cluster (for example: mixing Linux and Windows nodes).

### kubernetes.io/metadata.name

Example: `kubernetes.io/metadata.name: "mynamespace"`

Used on: Namespaces

The Kubernetes API server (part of the {{< glossary_tooltip text="control plane" term_id="control-plane" >}})
sets this label on all namespaces. The label value is set
to the name of the namespace. You can't change this label's value.

This is useful if you want to target a specific namespace with a label
{{< glossary_tooltip text="selector" term_id="selector" >}}.

### kubernetes.io/limit-ranger

Example: `kubernetes.io/limit-ranger: "LimitRanger plugin set: cpu, memory request for container nginx; cpu, memory limit for container nginx"`

Used on: Pod

Kubernetes by default doesn't provide any resource limit, that means unless you explicitly define limits,
your container can consume unlimited CPU and memory.
You can define a default request or default limit for pods. You do this by creating a LimitRange in the relevant namespace.
Pods deployed after you define a LimitRange will have these limits applied to them.
The annotation `kubernetes.io/limit-ranger` records that resource defaults were specified for the Pod,
and they were applied successfully.
For more details, read about [LimitRanges](/docs/concepts/policy/limit-range).

### beta.kubernetes.io/arch (deprecated)

This label has been deprecated. Please use `kubernetes.io/arch` instead.

### beta.kubernetes.io/os (deprecated)

This label has been deprecated. Please use `kubernetes.io/os` instead.

### kube-aggregator.kubernetes.io/automanaged {#kube-aggregator-kubernetesio-automanaged}

Example: `kube-aggregator.kubernetes.io/automanaged: "onstart"`

Used on: APIService

The `kube-apiserver` sets this label on any APIService object that the API server has created automatically. The label marks how the control plane should manage that APIService. You should not add, modify, or remove this label by yourself.

{{< note >}}
Automanaged APIService objects are deleted by kube-apiserver when it has no built-in or custom resource API corresponding to the API group/version of the APIService.
{{< /note >}}

There are two possible values:
- `onstart`: The APIService should be reconciled when an API server starts up, but not otherwise.
- `true`: The API server should reconcile this APIService continuously.

### kubernetes.io/hostname {#kubernetesiohostname}

Example: `kubernetes.io/hostname: "ip-172-20-114-199.ec2.internal"`

Used on: Node

The Kubelet populates this label with the hostname. Note that the hostname can be changed from the "actual" hostname by passing the `--hostname-override` flag to the `kubelet`.

This label is also used as part of the topology hierarchy.  See [topology.kubernetes.io/zone](#topologykubernetesiozone) for more information.


### kubernetes.io/change-cause {#change-cause}

Example: `kubernetes.io/change-cause: "kubectl edit --record deployment foo"`

Used on: All Objects

This annotation is a best guess at why something was changed.

It is populated when adding `--record` to a `kubectl` command that may change an object.

### kubernetes.io/description {#description}

Example: `kubernetes.io/description: "Description of K8s object."`

Used on: All Objects

This annotation is used for describing specific behaviour of given object.

### kubernetes.io/enforce-mountable-secrets {#enforce-mountable-secrets}

Example: `kubernetes.io/enforce-mountable-secrets: "true"`

Used on: ServiceAccount

The value for this annotation must be **true** to take effect. This annotation indicates that pods running as this service account may only reference Secret API objects specified in the service account's `secrets` field.

### node.kubernetes.io/exclude-from-external-load-balancer

Example: `node.kubernetes.io/exclude-from-external-load-balancer`

Used on: Node

Kubernetes automatically enables the `ServiceNodeExclusion` feature gate on the clusters it creates. With this feature gate enabled on a cluster,
you can add labels to particular worker nodes to exclude them from the list of backend servers.
The following command can be used to exclude a worker node from the list of backend servers in a backend set-
`kubectl label nodes <node-name> node.kubernetes.io/exclude-from-external-load-balancers=true`

### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

Example: `controller.kubernetes.io/pod-deletion-cost: "10"`

Used on: Pod

This annotation is used to set [Pod Deletion Cost](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)
which allows users to influence ReplicaSet downscaling order. The annotation parses into an `int32` type.

### cluster-autoscaler.kubernetes.io/enable-ds-eviction

Example: `cluster-autoscaler.kubernetes.io/enable-ds-eviction: "true"`

Used on: Pod

This annotation controls whether a DaemonSet pod should be evicted by a ClusterAutoscaler.
This annotation needs to be specified on DaemonSet pods in a DaemonSet manifest.
When this annotation is set to `"true"`, the ClusterAutoscaler is allowed to evict a DaemonSet Pod,
even if other rules would normally prevent that. To disallow the ClusterAutoscaler from evicting DaemonSet pods,
you can set this annotation to `"false"` for important DaemonSet pods.
If this annotation is not set, then the Cluster Autoscaler follows its overall behaviour (i.e evict the DaemonSets based on its configuration).

{{< note >}}
This annotation only impacts DaemonSet pods.
{{< /note >}}

### kubernetes.io/ingress-bandwidth

{{< note >}}
Ingress traffic shaping annotation is an experimental feature.
If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI configuration file (default `/etc/cni/net.d`) and
ensure that the binary is included in your CNI bin dir (default `/opt/cni/bin`).
{{< /note >}}

Example: `kubernetes.io/ingress-bandwidth: 10M`

Used on: Pod

You can apply quality-of-service traffic shaping to a pod and effectively limit its available bandwidth.
Ingress traffic (to the pod) is handled by shaping queued packets to effectively handle data.
To limit the bandwidth on a pod, write an object definition JSON file and specify the data traffic
speed using `kubernetes.io/ingress-bandwidth` annotation. The unit used for specifying ingress
rate is bits per second, as a [Quantity](/docs/reference/kubernetes-api/common-definitions/quantity/).
For example, `10M` means 10 megabits per second.

### kubernetes.io/egress-bandwidth

{{< note >}}
Egress traffic shaping annotation is an experimental feature.
If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI configuration file (default `/etc/cni/net.d`) and
ensure that the binary is included in your CNI bin dir (default `/opt/cni/bin`).
{{< /note >}}

Example: `kubernetes.io/egress-bandwidth: 10M`

Used on: Pod

Egress traffic (from the pod) is handled by policing, which simply drops packets in excess of the configured rate.
The limits you place on a pod do not affect the bandwidth of other pods.
To limit the bandwidth on a pod, write an object definition JSON file and specify the data traffic
speed using `kubernetes.io/egress-bandwidth` annotation. The unit used for specifying egress
rate is bits per second, as a [Quantity](/docs/reference/kubernetes-api/common-definitions/quantity/).
For example, `10M` means 10 megabits per second.

### beta.kubernetes.io/instance-type (deprecated)

{{< note >}} Starting in v1.17, this label is deprecated in favor of [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type). {{< /note >}}

### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

Example: `node.kubernetes.io/instance-type: "m3.medium"`

Used on: Node

The Kubelet populates this with the instance type as defined by the `cloudprovider`.
This will be set only if you are using a `cloudprovider`. This setting is handy
if you want to target certain workloads to certain instance types, but typically you want
to rely on the Kubernetes scheduler to perform resource-based scheduling. You should aim to schedule based on properties rather than on instance types (for example: require a GPU, instead of requiring a `g2.2xlarge`).

### failure-domain.beta.kubernetes.io/region (deprecated) {#failure-domainbetakubernetesioregion}

See [topology.kubernetes.io/region](#topologykubernetesioregion).

{{< note >}} Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/region](#topologykubernetesioregion). {{< /note >}}

### failure-domain.beta.kubernetes.io/zone (deprecated) {#failure-domainbetakubernetesiozone}

See [topology.kubernetes.io/zone](#topologykubernetesiozone).

{{< note >}} Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/zone](#topologykubernetesiozone). {{< /note >}}

### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

Example:

`statefulset.kubernetes.io/pod-name: "mystatefulset-7"`

When a StatefulSet controller creates a Pod for the StatefulSet, the control plane
sets this label on that Pod. The value of the label is the name of the Pod being created.

See [Pod Name Label](/docs/concepts/workloads/controllers/statefulset/#pod-name-label) in the
StatefulSet topic for more details.

### scheduler.alpha.kubernetes.io/node-selector {#schedulerkubernetesnode-selector}

Example: `scheduler.alpha.kubernetes.io/node-selector: "name-of-node-selector"`

Used on: Namespace

The [PodNodeSelector](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector) uses this annotation key to assign node selectors to pods in namespaces.

### topology.kubernetes.io/region {#topologykubernetesioregion}

Example:

`topology.kubernetes.io/region: "us-east-1"`

See [topology.kubernetes.io/zone](#topologykubernetesiozone).

### topology.kubernetes.io/zone {#topologykubernetesiozone}

Example:

`topology.kubernetes.io/zone: "us-east-1c"`

Used on: Node, PersistentVolume

On Node: The `kubelet` or the external `cloud-controller-manager` populates this with the information as provided by the `cloudprovider`.  This will be set only if you are using a `cloudprovider`. However, you should consider setting this on nodes if it makes sense in your topology.

On PersistentVolume: topology-aware volume provisioners will automatically set node affinity constraints on `PersistentVolumes`.

A zone represents a logical failure domain.  It is common for Kubernetes clusters to span multiple zones for increased availability.  While the exact definition of a zone is left to infrastructure implementations, common properties of a zone include very low network latency within a zone, no-cost network traffic within a zone, and failure independence from other zones.  For example, nodes within a zone might share a network switch, but nodes in different zones should not.

A region represents a larger domain, made up of one or more zones.  It is uncommon for Kubernetes clusters to span multiple regions,  While the exact definition of a zone or region is left to infrastructure implementations, common properties of a region include higher network latency between them than within them, non-zero cost for network traffic between them, and failure independence from other zones or regions.  For example, nodes within a region might share power infrastructure (e.g. a UPS or generator), but nodes in different regions typically would not.

Kubernetes makes a few assumptions about the structure of zones and regions:
1) regions and zones are hierarchical: zones are strict subsets of regions and no zone can be in 2 regions
2) zone names are unique across regions; for example region "africa-east-1" might be comprised of zones "africa-east-1a" and "africa-east-1b"

It should be safe to assume that topology labels do not change.  Even though labels are strictly mutable, consumers of them can assume that a given node is not going to be moved between zones without being destroyed and recreated.

Kubernetes can use this information in various ways.  For example, the scheduler automatically tries to spread the Pods in a ReplicaSet across nodes in a single-zone cluster (to reduce the impact of node failures, see [kubernetes.io/hostname](#kubernetesiohostname)). With multiple-zone clusters, this spreading behavior also applies to zones (to reduce the impact of zone failures). This is achieved via _SelectorSpreadPriority_.

_SelectorSpreadPriority_ is a best effort placement. If the zones in your cluster are heterogeneous (for example: different numbers of nodes, different types of nodes, or different pod resource requirements), this placement might prevent equal spreading of your Pods across zones. If desired, you can use homogenous zones (same number and types of nodes) to reduce the probability of unequal spreading.

The scheduler (through the _VolumeZonePredicate_ predicate) also will ensure that Pods, that claim a given volume, are only placed into the same zone as that volume. Volumes cannot be attached across zones.

If `PersistentVolumeLabel` does not support automatic labeling of your PersistentVolumes, you should consider
adding the labels manually (or adding support for `PersistentVolumeLabel`). With `PersistentVolumeLabel`, the scheduler prevents Pods from mounting volumes in a different zone. If your infrastructure doesn't have this constraint, you don't need to add the zone labels to the volumes at all.

### volume.beta.kubernetes.io/storage-provisioner (deprecated)

Example: `volume.beta.kubernetes.io/storage-provisioner: "k8s.io/minikube-hostpath"`

Used on: PersistentVolumeClaim

This annotation has been deprecated.

### volume.beta.kubernetes.io/mount-options (deprecated) {#mount-options}

Example : `volume.beta.kubernetes.io/mount-options: "ro,soft"`

Used on: PersistentVolume

A Kubernetes administrator can specify additional [mount options](/docs/concepts/storage/persistent-volumes/#mount-options) for when a PersistentVolume is mounted on a node.

This annotation has been deprecated.

### volume.kubernetes.io/storage-provisioner

Used on: PersistentVolumeClaim

This annotation will be added to dynamic provisioning required PVC.

### volumes.kubernetes.io/controller-managed-attach-detach

Used on: Node

If a node has set the annotation `volumes.kubernetes.io/controller-managed-attach-detach`
on itself, then its storage attach and detach operations are being managed
by the attach/detach controller running in kube-controller-manager.

The value of the annotation isn't important; if this annotation exists on a node,
then storage attaches and detaches are controller managed.

### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

Example: `node.kubernetes.io/windows-build: "10.0.17763"`

Used on: Node

When the kubelet is running on Microsoft Windows, it automatically labels its node to record the version of Windows Server in use.

The label's value is in the format "MajorVersion.MinorVersion.BuildNumber".

### service.kubernetes.io/headless {#servicekubernetesioheadless}

Example: `service.kubernetes.io/headless: ""`

Used on: Service

The control plane adds this label to an Endpoints object when the owning Service is headless.

### kubernetes.io/service-name {#kubernetesioservice-name}

Example: `kubernetes.io/service-name: "my-website"`

Used on: EndpointSlice

Kubernetes associates [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) with
[Services](/docs/concepts/services-networking/service/) using this label.

This label records the {{< glossary_tooltip term_id="name" text="name">}} of the
Service that the EndpointSlice is backing. All EndpointSlices should have this label set to
the name of their associated Service.

### kubernetes.io/service-account.name

Example: `kubernetes.io/service-account.name: "sa-name"`

Used on: Secret

This annotation records the {{< glossary_tooltip term_id="name" text="name">}} of the
ServiceAccount that the token (stored in the Secret of type `kubernetes.io/service-account-token`) represents.

### kubernetes.io/service-account.uid

Example: `kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da`

Used on: Secret

This annotation records the {{< glossary_tooltip term_id="uid" text="unique ID" >}} of the
ServiceAccount that the token (stored in the Secret of type `kubernetes.io/service-account-token`) represents.

### kubernetes.io/legacy-token-last-used

Example: `kubernetes.io/legacy-token-last-used: 2022-10-24`

Used on: Secret

The control plane only adds this label for Secrets that have the type `kubernetes.io/service-account-token`.
The value of this label records the date (ISO 8601 format, UTC time zone) when the control plane last saw
a request where the client authenticated using the service account token.

If a legacy token was last used before the cluster gained the feature (added in Kubernetes v1.26), then
the label isn't set.


### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

Example: `endpointslice.kubernetes.io/managed-by: "controller"`

Used on: EndpointSlices

The label is used to indicate the controller or entity that manages an EndpointSlice. This label aims to enable different EndpointSlice objects to be managed by different controllers or entities within the same cluster.

### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

Example: `endpointslice.kubernetes.io/skip-mirror: "true"`

Used on: Endpoints

The label can be set to `"true"` on an Endpoints resource to indicate that the EndpointSliceMirroring controller should not mirror this resource with EndpointSlices.

### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

Example: `service.kubernetes.io/service-proxy-name: "foo-bar"`

Used on: Service

The kube-proxy has this label for custom proxy, which delegates service control to custom proxy.

### experimental.windows.kubernetes.io/isolation-type (deprecated) {#experimental-windows-kubernetes-io-isolation-type}

Example: `experimental.windows.kubernetes.io/isolation-type: "hyperv"`

Used on: Pod

The annotation is used to run Windows containers with Hyper-V isolation. To use Hyper-V isolation feature and create a Hyper-V isolated container, the kubelet should be started with feature gates HyperVContainer=true and the Pod should include the annotation `experimental.windows.kubernetes.io/isolation-type: hyperv`.

{{< note >}}
You can only set this annotation on Pods that have a single container.
Starting from v1.20, this annotation is deprecated. Experimental Hyper-V support was removed in 1.21.
{{< /note >}}

### ingressclass.kubernetes.io/is-default-class

Example: `ingressclass.kubernetes.io/is-default-class: "true"`

Used on: IngressClass

When a single IngressClass resource has this annotation set to `"true"`, new Ingress resource without a class specified will be assigned this default class.

### kubernetes.io/ingress.class (deprecated)

{{< note >}}
Starting in v1.18, this annotation is deprecated in favor of `spec.ingressClassName`.
{{< /note >}}

### storageclass.kubernetes.io/is-default-class

Example: `storageclass.kubernetes.io/is-default-class: "true"`

Used on: StorageClass

When a single StorageClass resource has this annotation set to `"true"`, new PersistentVolumeClaim
resource without a class specified will be assigned this default class.

### alpha.kubernetes.io/provided-node-ip

Example: `alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

Used on: Node

The kubelet can set this annotation on a Node to denote its configured IPv4 address.

When kubelet is started with the `--cloud-provider` flag set to any value (includes both external and legacy in-tree cloud providers), it sets this annotation on the Node to denote an IP address set from the command line flag (`--node-ip`). This IP is verified with the cloud provider as valid by the cloud-controller-manager.

### batch.kubernetes.io/job-completion-index

Example: `batch.kubernetes.io/job-completion-index: "3"`

Used on: Pod

The Job controller in the kube-controller-manager sets this annotation for Pods
created with Indexed [completion mode](/docs/concepts/workloads/controllers/job/#completion-mode).

### kubectl.kubernetes.io/default-container

Example: `kubectl.kubernetes.io/default-container: "front-end-app"`

The value of the annotation is the container name that is default for this Pod. For example, `kubectl logs` or `kubectl exec` without `-c` or `--container` flag will use this default container.

### endpoints.kubernetes.io/over-capacity

Example: `endpoints.kubernetes.io/over-capacity:truncated`

Used on: Endpoints

The {{< glossary_tooltip text="control plane" term_id="control-plane" >}} adds this annotation to an [Endpoints](/docs/concepts/services-networking/service/#endpoints) object if the associated {{< glossary_tooltip term_id="service" >}} has more than 1000 backing endpoints. The annotation indicates that the Endpoints object is over capacity and the number of endpoints has been truncated to 1000.

If the number of backend endpoints falls below 1000, the control plane removes this annotation.

### batch.kubernetes.io/job-tracking (deprecated) {#batch-kubernetes-io-job-tracking}

Example: `batch.kubernetes.io/job-tracking: ""`

Used on: Jobs

The presence of this annotation on a Job indicates that the control plane is
[tracking the Job status using finalizers](/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers).
The control plane uses this annotation to safely transition to tracking Jobs
using finalizers, while the feature is in development.
You should **not** manually add or remove this annotation. 

{{< note >}}
Starting from Kubernetes 1.26, this annotation is deprecated.
Kubernetes 1.27 and newer will ignore this annotation and always track Jobs
using finalizers.
{{< /note >}}

### scheduler.alpha.kubernetes.io/defaultTolerations {#scheduleralphakubernetesio-defaulttolerations}

Example: `scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Equal", "value": "value1", "effect": "NoSchedule", "key": "dedicated-node"}]'`

Used on: Namespace

This annotation requires the [PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction) admission controller to be enabled. This annotation key allows assigning tolerations to a namespace and any new pods created in this namespace would get these tolerations added.

### scheduler.alpha.kubernetes.io/preferAvoidPods (deprecated) {#scheduleralphakubernetesio-preferavoidpods}

Used on: Nodes

This annotation requires the [NodePreferAvoidPods scheduling plugin](/docs/reference/scheduling/config/#scheduling-plugins)
to be enabled. The plugin is deprecated since Kubernetes 1.22.
Use [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) instead.

**The taints listed below are always used on Nodes**

### node.kubernetes.io/not-ready

Example: `node.kubernetes.io/not-ready: "NoExecute"`

The node controller detects whether a node is ready by monitoring its health and adds or removes this taint accordingly.

### node.kubernetes.io/unreachable

Example: `node.kubernetes.io/unreachable: "NoExecute"`

The node controller adds the taint to a node corresponding to the [NodeCondition](/docs/concepts/architecture/nodes/#condition) `Ready` being `Unknown`.

### node.kubernetes.io/unschedulable

Example: `node.kubernetes.io/unschedulable: "NoSchedule"`

The taint will be added to a node when initializing the node to avoid race condition.

### node.kubernetes.io/memory-pressure

Example: `node.kubernetes.io/memory-pressure: "NoSchedule"`

The kubelet detects memory pressure based on `memory.available` and `allocatableMemory.available` observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.

### node.kubernetes.io/disk-pressure

Example: `node.kubernetes.io/disk-pressure :"NoSchedule"`

The kubelet detects disk pressure based on `imagefs.available`, `imagefs.inodesFree`, `nodefs.available` and `nodefs.inodesFree`(Linux only) observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.

### node.kubernetes.io/network-unavailable

Example: `node.kubernetes.io/network-unavailable: "NoSchedule"`

This is initially set by the kubelet when the cloud provider used indicates a requirement for additional network configuration. Only when the route on the cloud is configured properly will the taint be removed by the cloud provider.

### node.kubernetes.io/pid-pressure

Example: `node.kubernetes.io/pid-pressure: "NoSchedule"`

The kubelet checks D-value of the size of `/proc/sys/kernel/pid_max` and the PIDs consumed by Kubernetes on a node to get the number of available PIDs that referred to as the `pid.available` metric. The metric is then compared to the corresponding threshold that can be set on the kubelet to determine if the node condition and taint should be added/removed.

### node.kubernetes.io/out-of-service

Example: `node.kubernetes.io/out-of-service:NoExecute`

A user can manually add the taint to a Node marking it out-of-service. If the `NodeOutOfServiceVolumeDetach`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled on
`kube-controller-manager`, and a Node is marked out-of-service with this taint, the pods on the node will be forcefully deleted if there are no matching tolerations on it and volume detach operations for the pods terminating on the node will happen immediately. This allows the Pods on the out-of-service node to recover quickly on a different node.

{{< caution >}}
Refer to
[Non-graceful node shutdown](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)
for further details about when and how to use this taint.
{{< /caution >}}


### node.cloudprovider.kubernetes.io/uninitialized

Example: `node.cloudprovider.kubernetes.io/uninitialized: "NoSchedule"`

Sets this taint on a node to mark it as unusable, when kubelet is started with the "external" cloud provider, until a controller from the cloud-controller-manager initializes this node, and then removes the taint.

### node.cloudprovider.kubernetes.io/shutdown

Example: `node.cloudprovider.kubernetes.io/shutdown: "NoSchedule"`

If a Node is in a cloud provider specified shutdown state, the Node gets tainted accordingly with `node.cloudprovider.kubernetes.io/shutdown` and the taint effect of `NoSchedule`.

### pod-security.kubernetes.io/enforce

Example: `pod-security.kubernetes.io/enforce: "baseline"`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `enforce` label _prohibits_ the creation of any Pod in the labeled Namespace which does not meet
the requirements outlined in the indicated level.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.

### pod-security.kubernetes.io/enforce-version

Example: `pod-security.kubernetes.io/enforce-version: "{{< skew currentVersion >}}"`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.

### pod-security.kubernetes.io/audit

Example: `pod-security.kubernetes.io/audit: "baseline"`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `audit` label does not prevent the creation of a Pod in the labeled Namespace which does not meet
the requirements outlined in the indicated level, but adds an audit annotation to that Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.

### pod-security.kubernetes.io/audit-version

Example: `pod-security.kubernetes.io/audit-version: "{{< skew currentVersion >}}"`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.

### pod-security.kubernetes.io/warn

Example: `pod-security.kubernetes.io/warn: "baseline"`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `warn` label does not prevent the creation of a Pod in the labeled Namespace which does not meet the
requirements outlined in the indicated level, but returns a warning to the user after doing so.
Note that warnings are also displayed when creating or updating objects that contain Pod templates,
such as Deployments, Jobs, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.

### pod-security.kubernetes.io/warn-version

Example: `pod-security.kubernetes.io/warn-version: "{{< skew currentVersion >}}"`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod. Note that warnings are also displayed when creating
or updating objects that contain Pod templates, such as Deployments, Jobs, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.

### kubernetes.io/psp (deprecated) {#kubernetes-io-psp}

Example: `kubernetes.io/psp: restricted`

Used on: Pod

This annotation was only relevant if you were using [PodSecurityPolicies](/docs/concepts/security/pod-security-policy/).
Kubernetes v{{< skew currentVersion >}} does not support the PodSecurityPolicy API.

When the PodSecurityPolicy admission controller admitted a Pod, the admission controller
modified the Pod to have this annotation.
The value of the annotation was the name of the PodSecurityPolicy that was used for validation.

### seccomp.security.alpha.kubernetes.io/pod (non-functional) {#seccomp-security-alpha-kubernetes-io-pod}

Older versions of Kubernetes allowed you to configure seccomp
behavior using this {{< glossary_tooltip text="annotation" term_id="annotation" >}}.
See [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) to
learn the supported way to specify seccomp restrictions for a Pod.

### container.seccomp.security.alpha.kubernetes.io/[NAME] (non-functional) {#container-seccomp-security-alpha-kubernetes-io}

Older versions of Kubernetes allowed you to configure seccomp
behavior using this {{< glossary_tooltip text="annotation" term_id="annotation" >}}.
See [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) to
learn the supported way to specify seccomp restrictions for a Pod.

### snapshot.storage.kubernetes.io/allowVolumeModeChange

Example: `snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"`

Used on: VolumeSnapshotContent

Value can either be `true` or `false`.
This determines whether a user can modify the mode of the source volume when a
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} is being
created from a VolumeSnapshot.

Refer to [Converting the volume mode of a Snapshot](/docs/concepts/storage/volume-snapshots/#convert-volume-mode)
and the [Kubernetes CSI Developer Documentation](https://kubernetes-csi.github.io/docs/) for more information.

### scheduler.alpha.kubernetes.io/critical-pod (deprecated)

Example: `scheduler.alpha.kubernetes.io/critical-pod: ""`

Used on: Pod

This annotation lets Kubernetes control plane know about a pod being a critical pod so that the descheduler will not remove this pod.

{{< note >}} Starting in v1.16, this annotation was removed in favor of [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/). {{< /note >}}

## Annotations used for audit

<!-- sorted by annotation -->
- [`authorization.k8s.io/decision`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-decision)
- [`authorization.k8s.io/reason`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-reason)
- [`insecure-sha1.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#insecure-sha1-invalid-cert-kubernetes-io-hostname)
- [`missing-san.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#missing-san-invalid-cert-kubernetes-io-hostname)
- [`pod-security.kubernetes.io/audit-violations`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)
- [`pod-security.kubernetes.io/enforce-policy`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/exempt`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)

See more details on the [Audit Annotations](/docs/reference/labels-annotations-taints/audit-annotations/) page.

## kubeadm

### kubeadm.alpha.kubernetes.io/cri-socket

Example: `kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`

Used on: Node

Annotation that kubeadm uses to preserve the CRI socket information given to kubeadm at `init`/`join` time for later use.
kubeadm annotates the Node object with this information. The annotation remains "alpha", since ideally this should
be a field in KubeletConfiguration instead.

### kubeadm.kubernetes.io/etcd.advertise-client-urls

Example: `kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`

Used on: Pod

Annotation that kubeadm places on locally managed etcd pods to keep track of a list of URLs where etcd clients
should connect to. This is used mainly for etcd cluster health check purposes.

### kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint

Example: `kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https://172.17.0.18:6443`

Used on: Pod

Annotation that kubeadm places on locally managed kube-apiserver pods to keep track of the exposed advertise
address/port endpoint for that API server instance.

### kubeadm.kubernetes.io/component-config.hash

Used on: ConfigMap

Example: `kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`

Annotation that kubeadm places on ConfigMaps that it manages for configuring components. It contains a hash (SHA-256)
used to determine if the user has applied settings different from the kubeadm defaults for a particular component.

### node-role.kubernetes.io/control-plane

Used on: Node

Label that kubeadm applies on the control plane nodes that it manages.

### node-role.kubernetes.io/control-plane {#node-role-kubernetes-io-control-plane-taint}

Used on: Node

Example: `node-role.kubernetes.io/control-plane:NoSchedule`

Taint that kubeadm applies on control plane nodes to allow only critical workloads to schedule on them.

### node-role.kubernetes.io/master (deprecated) {#node-role-kubernetes-io-master-taint}

Used on: Node

Example: `node-role.kubernetes.io/master:NoSchedule`

Taint that kubeadm previously applied on control plane nodes to allow only critical workloads to schedule on them.
Replaced by [`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane-taint); kubeadm
no longer sets or uses this deprecated taint.
