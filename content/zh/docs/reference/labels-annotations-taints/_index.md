---
title: 众所周知的标签、注解和污点
content_type: concept
weight: 20
no_list: true
---

<!--
title: Well-Known Labels, Annotations and Taints
content_type: concept
weight: 20
no_list: true
-->

<!-- overview -->
<!--
Kubernetes reserves all labels and annotations in the kubernetes.io namespace.

This document serves both as a reference to the values and as a coordination point for assigning values.
-->
Kubernetes 将所有标签和注解保留在 kubernetes.io Namespace中。

本文档既可作为值的参考，也可作为分配值的协调点。

<!-- body -->
<!--
## Labels, annotations and taints used on API objects

### kubernetes.io/arch

Example: `kubernetes.io/arch=amd64`

Used on: Node

The Kubelet populates this with `runtime.GOARCH` as defined by Go. This can be handy if you are mixing arm and x86 nodes.
-->
## API 对象上使用的标签、注解和污点

### kubernetes.io/arch {#kubernetes-io-arch}

例子：`kubernetes.io/arch=amd64`

用于：Node

Kubelet 使用 Go 定义的 `runtime.GOARCH` 填充它。 如果你混合使用 ARM 和 X86 节点，这会很方便。
<!--
### kubernetes.io/os

Example: `kubernetes.io/os=linux`

Used on: Node

The Kubelet populates this with `runtime.GOOS` as defined by Go. This can be handy if you are mixing operating systems in your cluster (for example: mixing Linux and Windows nodes).
-->
### kubernetes.io/os {#kubernetes-io-os}

例子：`kubernetes.io/os=linux`

用于：Node

Kubelet 使用 Go 定义的 `runtime.GOOS` 填充它。如果你在集群中混合使用操作系统（例如：混合 Linux 和 Windows 节点），这会很方便。
<!--
### kubernetes.io/metadata.name

Example: `kubernetes.io/metadata.name=mynamespace`

Used on: Namespaces

The Kubernetes API server (part of the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}) 
sets this label on all namespaces. The label value is set
to the name of the namespace. You can't change this label's value. 

This is useful if you want to target a specific namespace with a label
{{< glossary_tooltip text="selector" term_id="selector" >}}.
-->
### kubernetes.io/metadata.name {#kubernetes-io-metadata-name}

例子：`kubernetes.io/metadata.name=mynamespace`

用于：Namespace

Kubernetes API 服务器（{{<glossary_tooltip text="控制平面" term_id="control-plane" >}} 的一部分）在所有 Namespace 上设置此标签。
标签值被设置 Namespace 的名称。你无法更改此标签的值。

如果你想使用标签{{<glossary_tooltip text="选择器" term_id="selector" >}}定位特定 Namespace，这很有用。
<!--
### beta.kubernetes.io/arch (deprecated)

This label has been deprecated. Please use `kubernetes.io/arch` instead.

### beta.kubernetes.io/os (deprecated)

This label has been deprecated. Please use `kubernetes.io/os` instead.
-->
### beta.kubernetes.io/arch (已弃用) {#beta-kubernetes-io-arch}

此标签已被弃用。请改用`kubernetes.io/arch`。

### beta.kubernetes.io/os (已弃用) {#beta-kubernetes-io-os}

此标签已被弃用。请改用`kubernetes.io/os`。

<!--
### kubernetes.io/hostname {#kubernetesiohostname}

Example: `kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

Used on: Node

The Kubelet populates this label with the hostname. Note that the hostname can be changed from the "actual" hostname by passing the `--hostname-override` flag to the `kubelet`.

This label is also used as part of the topology hierarchy.  See [topology.kubernetes.io/zone](#topologykubernetesiozone) for more information.
-->
### kubernetes.io/hostname {#kubernetesiohostname}

例子：`kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

用于：Node

Kubelet 使用主机名填充此标签。请注意，可以通过将 `--hostname-override` 标志传递给 `kubelet` 来替代“实际”主机名。

此标签也用作拓扑层次结构的一部分。 有关详细信息，请参阅 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
### kubernetes.io/change-cause {#change-cause}

Example: `kubernetes.io/change-cause=kubectl edit --record deployment foo`

Used on: All Objects

This annotation is a best guess at why something was changed. 

It is populated when adding `--record` to a `kubectl` command that may change an object.
-->
### kubernetes.io/change-cause {#change-cause}

例子：`kubernetes.io/change-cause=kubectl edit --record deployment foo`

用于：所有对象

此注解是对某些事物发生变更的原因的最佳猜测。

将 `--record` 添加到可能会更改对象的 `kubectl` 命令时会填充它。

<!--
### kubernetes.io/description {#description}

Example: `kubernetes.io/description: "Description of K8s object."`

Used on: All Objects

This annotation is used for describing specific behaviour of given object.
-->
### kubernetes.io/description {#description}

例子：`kubernetes.io/description: "Description of K8s object."`

用于：所有对象

此注解用于描述给定对象的特定行为。

<!--
### kubernetes.io/enforce-mountable-secrets {#enforce-mountable-secrets}

Example: `kubernetes.io/enforce-mountable-secrets: "true"`

Used on: ServiceAccount

The value for this annotation must be **true** to take effect. This annotation indicates that pods running as this service account may only reference Secret API objects specified in the service account's `secrets` field.
-->
### kubernetes.io/enforce-mountable-secrets {#enforce-mountable-secrets}

例子：`kubernetes.io/enforce-mountable-secrets: "true"`

用于：ServiceAccount

此注解的值必须为 **true** 才能生效。此注解表示作为此服务帐户运行的 Pod 只能引用在服务帐户的 `secrets` 字段中指定的 Secret API 对象。

<!--
### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

Example: `controller.kubernetes.io/pod-deletion-cost=10`

Used on: Pod

This annotation is used to set [Pod Deletion Cost](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)
which allows users to influence ReplicaSet downscaling order. The annotation parses into an `int32` type.

### beta.kubernetes.io/instance-type (deprecated)
-->
### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

例子：`controller.kubernetes.io/pod-deletion-cost=10`

用于：Pod

该注解用于设置 [Pod 删除成本](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost) 允许用户影响 ReplicaSet 缩减顺序。注解解析为 `int32` 类型。

### beta.kubernetes.io/instance-type (已弃用) {#beta-kubernetes-io-instance-type}

<!--
Starting in v1.17, this label is deprecated in favor of [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type).
-->
{{< note >}} 从 v1.17 开始，此标签已弃用，取而代之的是 [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type)。 {{< /note >}}

<!--
### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

Example: `node.kubernetes.io/instance-type=m3.medium`

Used on: Node

The Kubelet populates this with the instance type as defined by the `cloudprovider`.
This will be set only if you are using a `cloudprovider`. This setting is handy
if you want to target certain workloads to certain instance types, but typically you want
to rely on the Kubernetes scheduler to perform resource-based scheduling. You should aim to schedule based on properties rather than on instance types (for example: require a GPU, instead of requiring a `g2.2xlarge`).
-->
### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

例子：`node.kubernetes.io/instance-type=m3.medium`

用于：Node

Kubelet 使用 `cloudprovider` 定义的实例类型填充它。
仅当你使用 `cloudprovider` 时才会设置此项。如果你希望将某些工作负载定位到某些实例类型，则此设置非常方便，但通常你希望依靠 Kubernetes 调度程序来执行基于资源的调度。
你应该基于属性而不是实例类型来调度（例如：需要 GPU，而不是需要 `g2.2xlarge`）。

<!--
### failure-domain.beta.kubernetes.io/region (deprecated) {#failure-domainbetakubernetesioregion}

See [topology.kubernetes.io/region](#topologykubernetesioregion).
-->
### failure-domain.beta.kubernetes.io/region (已弃用) {#failure-domainbetakubernetesioregion}

请参阅 [topology.kubernetes.io/region](#topologykubernetesioregion)。

<!--
Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/region](#topologykubernetesioregion).
-->
{{< note >}} 从 v1.17 开始，此标签已弃用，取而代之的是 [topology.kubernetes.io/region](#topologykubernetesioregion)。 {{</note>}}

<!--
### failure-domain.beta.kubernetes.io/zone (deprecated) {#failure-domainbetakubernetesiozone}

See [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
### failure-domain.beta.kubernetes.io/zone (已弃用) {#failure-domainbetakubernetesiozone}

请参阅 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/zone](#topologykubernetesiozone). 
-->
{{< note >}} 从 v1.17 开始，此标签已弃用，取而代之的是 [topology.kubernetes.io/zone](#topologykubernetesiozone)。 {{</note>}}

<!--
### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

Example:

`statefulset.kubernetes.io/pod-name=mystatefulset-7`

When a StatefulSet controller creates a Pod for the StatefulSet, the control plane
sets this label on that Pod. The value of the label is the name of the Pod being created.

See [Pod Name Label](/docs/concepts/workloads/controllers/statefulset/#pod-name-label) in the
StatefulSet topic for more details.
-->
### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

例子：`statefulset.kubernetes.io/pod-name=mystatefulset-7`

当 StatefulSet 控制器为 StatefulSet 创建 Pod 时，控制平面会在该 Pod 上设置此标签。标签的值是正在创建的 Pod 的名称。

有关详细信息，请参阅 StatefulSet 主题中的 [Pod 名称标签](/docs/concepts/workloads/controllers/statefulset/#pod-name-label)。

<!--
### topology.kubernetes.io/region {#topologykubernetesioregion}

Example:

`topology.kubernetes.io/region=us-east-1`

See [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
### topology.kubernetes.io/region {#topologykubernetesioregion}

例子：`topology.kubernetes.io/region=us-east-1`

请参阅 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
### topology.kubernetes.io/zone {#topologykubernetesiozone}

Example:

`topology.kubernetes.io/zone=us-east-1c`

Used on: Node、PersistentVolume

On Node: The `kubelet` or the external `cloud-controller-manager` populates this with the information as provided by the `cloudprovider`.  This will be set only if you are using a `cloudprovider`. However, you should consider setting this on nodes if it makes sense in your topology.

On PersistentVolume: topology-aware volume provisioners will automatically set node affinity constraints on `PersistentVolumes`.

A zone represents a logical failure domain.  It is common for Kubernetes clusters to span multiple zones for increased availability.  While the exact definition of a zone is left to infrastructure implementations, common properties of a zone include very low network latency within a zone, no-cost network traffic within a zone, and failure independence from other zones.  For example, nodes within a zone might share a network switch, but nodes in different zones should not.

A region represents a larger domain, made up of one or more zones.  It is uncommon for Kubernetes clusters to span multiple regions,  While the exact definition of a zone or region is left to infrastructure implementations, common properties of a region include higher network latency between them than within them, non-zero cost for network traffic between them, and failure independence from other zones or regions.  For example, nodes within a region might share power infrastructure (e.g. a UPS or generator), but nodes in different regions typically would not.

-->
### topology.kubernetes.io/zone {#topologykubernetesiozone}

例子：`topology.kubernetes.io/zone=us-east-1c`

用于：Node、PersistentVolume

在 Node 上：`kubelet` 或外部 `cloud-controller-manager` 使用 `cloudprovider` 提供的信息填充它。仅当你使用 `cloudprovider` 时才会设置此项。
但是，如果它在你的拓扑中有意义，你应该考虑在 Node 上设置它。

在 PersistentVolume 上：拓扑感知卷配置器将自动在 `PersistentVolume` 上设置 Node 亲和性约束。

一个 Zone 代表一个逻辑故障域。 Kubernetes 集群通常跨越多个 Zone 以提高可用性。虽然 Zone 的确切定义留给基础设施实现，
但 Zone 的常见属性包括 Zone 内非常低的网络延迟、 Zone 内的免费网络流量以及与其他 Zone 的故障独立性。
例如，一个 Zone 内的 Node 可能共享一个网络交换机，但不同 Zone 中的 Node 无法共享交换机。

一个 Region 代表一个更大的域，由一个或多个 Zone 组成。Kubernetes 集群跨多个 Region 并不常见，虽然 Zone 或 Region 的确切定义留给基础设施实现，
但 Region 的共同属性包括它们之间的网络延迟比它们内部更高，它们之间的网络流量成本非零，以及与其他 Zone 或 Region 的故障独立性。
例如，一个 Region 内的 Node 可能共享电力基础设施（例如 UPS 或发电机），但不同 Region 的 Node 通常不会共享电力基础设施。

<!--
Kubernetes makes a few assumptions about the structure of zones and regions:
1) regions and zones are hierarchical: zones are strict subsets of regions and no zone can be in 2 regions
2) zone names are unique across regions; for example region "africa-east-1" might be comprised of zones "africa-east-1a" and "africa-east-1b"
-->
Kubernetes 对 Zone 和 Region 的结构做了一些假设：

1. Zone 和 Region 是分层的： Zone 是 Region 的严格子集，没有 Zone 可以在两个 Region 中；

2. Zone 名称跨 Region 是唯一的；例如， Region “africa-east-1” 可能由 Zone “africa-east-1a” 和 “africa-east-1b” 组成。

<!--
It should be safe to assume that topology labels do not change.  Even though labels are strictly mutable, consumers of them can assume that a given node is not going to be moved between zones without being destroyed and recreated.
-->
你可以大胆假设拓扑标签不会改变。尽管严格地讲标签是可变的，但节点的用户可以假设给定
节点只能通过销毁和重新创建才能完成 Zone 间移动。

<!--
Kubernetes can use this information in various ways.  For example, the scheduler automatically tries to spread the Pods in a ReplicaSet across nodes in a single-zone cluster (to reduce the impact of node failures, see [kubernetes.io/hostname](#kubernetesiohostname)). With multiple-zone clusters, this spreading behavior also applies to zones (to reduce the impact of zone failures). This is achieved via _SelectorSpreadPriority_.
-->
Kubernetes 可以通过多种方式使用这些信息。例如，调度程序会自动尝试将 ReplicaSet 中的 Pod
分布在单 Zone 集群中的多个节点上（以便减少节点故障的影响，请参阅 [kubernetes.io/hostname](#kubernetesiohostname)）。
对于多 Zone 集群，这种分布行为也适用于 Zone（以减少 Zone 故障的影响）。
Zone 级别的 Pod 分布是通过 _SelectorSpreadPriority_ 实现的。

<!--
_SelectorSpreadPriority_ is a best effort placement. If the zones in your cluster are heterogeneous (for example: different numbers of nodes, different types of nodes, or different pod resource requirements), this placement might prevent equal spreading of your Pods across zones. If desired, you can use homogenous zones (same number and types of nodes) to reduce the probability of unequal spreading.
-->
_SelectorSpreadPriority_ 是一个尽力而为的放置机制。如果集群中的 Zone 是异构的
（例如：节点数量不同、节点类型不同或 Pod 资源需求有别等），这种放置机制可能会让你的
Pod 无法实现跨 Zone 均匀分布。
如果需要，你可以使用同质 Zone（节点数量和类型均相同）来减少不均匀分布的可能性。

<!--
The scheduler (through the _VolumeZonePredicate_ predicate) also will ensure that Pods, that claim a given volume, are only placed into the same zone as that volume. Volumes cannot be attached across zones.
-->
调度程序还将（通过 _VolumeZonePredicate_ 条件）确保申领给定卷的 Pod 仅被放置在与该卷相同的 Zone 中。
卷不能跨 Zone 挂接。

<!--
If `PersistentVolumeLabel` does not support automatic labeling of your PersistentVolumes, you should consider
adding the labels manually (or adding support for `PersistentVolumeLabel`). With `PersistentVolumeLabel`, the scheduler prevents Pods from mounting volumes in a different zone. If your infrastructure doesn't have this constraint, you don't need to add the zone labels to the volumes at all.
-->
你应该考虑手动添加标签（或添加对 `PersistentVolumeLabel` 的支持）。
基于 `PersistentVolumeLabel` ，调度程序可以防止 Pod 挂载来自其他 Zone 的卷。如果你的基础架构没有此限制，则不需要将 Zone 标签添加到卷上。

<!--
### volume.beta.kubernetes.io/storage-provisioner (deprecated)

Example: `volume.beta.kubernetes.io/storage-provisioner: k8s.io/minikube-hostpath`

Used on: PersistentVolumeClaim

This annotation has been deprecated.
-->
### volume.beta.kubernetes.io/storage-provisioner (已弃用) {#volume-beta-kubernetes-io-storage-provisioner}

例子：`volume.beta.kubernetes.io/storage-provisioner: k8s.io/minikube-hostpath`

用于：PersistentVolumeClaim

此注解已被弃用。

<!--
### volume.kubernetes.io/storage-provisioner

Used on: PersistentVolumeClaim

This annotation will be added to dynamic provisioning required PVC.
-->
### volume.kubernetes.io/storage-provisioner {#volume-kubernetes-io-storage-provisioner}

用于：PersistentVolumeClaim

此注解将被添加到根据需要动态制备的 PVC 上。

<!--
### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

Example: `node.kubernetes.io/windows-build=10.0.17763`

Used on: Node

When the kubelet is running on Microsoft Windows, it automatically labels its node to record the version of Windows Server in use.

The label's value is in the format "MajorVersion.MinorVersion.BuildNumber".
-->
### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

例子：`node.kubernetes.io/windows-build=10.0.17763`

用于：Node

当 kubelet 在 Microsoft Windows 上运行时，它会自动标记其所在节点以记录所使用的 Windows Server 的版本。

标签的值采用 “MajorVersion.MinorVersion.BuildNumber” 格式。

<!--
### service.kubernetes.io/headless {#servicekubernetesioheadless}

Example: `service.kubernetes.io/headless=""`

Used on: Service

The control plane adds this label to an Endpoints object when the owning Service is headless.
-->
### service.kubernetes.io/headless {#servicekubernetesioheadless}

例子：`service.kubernetes.io/headless=""`

用于：Service

当拥有的 Service 是无头类型时，控制平面将此标签添加到 Endpoints 对象。

<!--
### kubernetes.io/service-name {#kubernetesioservice-name}

Example: `kubernetes.io/service-name="nginx"`

Used on: Service

Kubernetes uses this label to differentiate multiple Services. Used currently for `ELB`(Elastic Load Balancer) only.
-->
### kubernetes.io/service-name {#kubernetesioservice-name}

例子：`kubernetes.io/service-name="nginx"`

用于：Service

Kubernetes 使用这个标签来区分多个服务。目前仅用于 `ELB` （弹性负载均衡器）。

<!--
### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

Example: `endpointslice.kubernetes.io/managed-by="controller"`

Used on: EndpointSlices

The label is used to indicate the controller or entity that manages an EndpointSlice. This label aims to enable different EndpointSlice objects to be managed by different controllers or entities within the same cluster.
-->
### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

例子：`endpointslice.kubernetes.io/managed-by="controller"`

用于：EndpointSlice

用于标示管理 EndpointSlice 的控制器或实体。该标签旨在使不同的 EndpointSlice
对象能够由同一集群内的不同控制器或实体管理。

<!--
### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

Example: `endpointslice.kubernetes.io/skip-mirror="true"`

Used on: Endpoints

The label can be set to `"true"` on an Endpoints resource to indicate that the EndpointSliceMirroring controller should not mirror this resource with EndpointSlices.
-->
### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

例子：`endpointslice.kubernetes.io/skip-mirror="true"`

用于：Endpoints

可以在 Endpoints 资源上将此标签设置为 `"true"`，以指示 EndpointSliceMirroring
控制器不应使用 EndpointSlice 镜像此 Endpoints 资源。

<!--
### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

Example: `service.kubernetes.io/service-proxy-name="foo-bar"`

Used on: Service

The kube-proxy has this label for custom proxy, which delegates service control to custom proxy.
-->
### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

例子：`service.kubernetes.io/service-proxy-name="foo-bar"`

用于：Service

kube-proxy 自定义代理会使用这个标签，它将服务控制委托给自定义代理。

<!--
### experimental.windows.kubernetes.io/isolation-type (deprecated) {#experimental-windows-kubernetes-io-isolation-type}

Example: `experimental.windows.kubernetes.io/isolation-type: "hyperv"`

Used on: Pod

The annotation is used to run Windows containers with Hyper-V isolation. To use Hyper-V isolation feature and create a Hyper-V isolated container, the kubelet should be started with feature gates HyperVContainer=true and the Pod should include the annotation experimental.windows.kubernetes.io/isolation-type=hyperv.
-->
### experimental.windows.kubernetes.io/isolation-type (已弃用) {#experimental-windows-kubernetes-io-isolation-type}

例子：`experimental.windows.kubernetes.io/isolation-type: "hyperv"`

用于：Pod

注解用于运行具有 Hyper-V 隔离的 Windows 容器。要使用 Hyper-V 隔离功能并创建 Hyper-V
隔离容器，kubelet 启动时应该需要设置特性门控 HyperVContainer=true。

<!--
You can only set this annotation on Pods that have a single container.
Starting from v1.20, this annotation is deprecated. Experimental Hyper-V support was removed in 1.21.
-->
{{< note >}}
你只能在具有单个容器的 Pod 上设置此注解。
从 v1.20 开始，此注解已弃用。1.21 中删除了实验性 Hyper-V 支持。
{{</note>}}

<!--
### ingressclass.kubernetes.io/is-default-class

Example: `ingressclass.kubernetes.io/is-default-class: "true"`

Used on: IngressClass

When a single IngressClass resource has this annotation set to `"true"`, new Ingress resource without a class specified will be assigned this default class.
-->
### ingressclass.kubernetes.io/is-default-class {#ingressclass-kubernetes-io-is-default-class}

例子：`ingressclass.kubernetes.io/is-default-class: "true"`

用于：IngressClass

当单个 IngressClass 资源将此注解设置为 `"true"`时，新的未指定 Ingress 类的 Ingress
资源将被设置为此默认类。

<!--
### kubernetes.io/ingress.class (deprecated)

Starting in v1.18, this annotation is deprecated in favor of `spec.ingressClassName`.
-->
### kubernetes.io/ingress.class (已弃用) {#kubernetes-io-ingress-class}

{{< note >}}
从 v1.18 开始，不推荐使用此注解以鼓励使用 `spec.ingressClassName`。
{{</note>}}

<!--
### storageclass.kubernetes.io/is-default-class

Example: `storageclass.kubernetes.io/is-default-class=true`

Used on: StorageClass

When a single StorageClass resource has this annotation set to `"true"`, new PersistentVolumeClaim
resource without a class specified will be assigned this default class.
-->
### storageclass.kubernetes.io/is-default-class {#storageclass-kubernetes-io-is-default-class}

例子：`storageclass.kubernetes.io/is-default-class=true`

用于：StorageClass

当单个 StorageClass 资源将此注解设置为 `"true"` 时，新的未指定存储类的 PersistentVolumeClaim
资源将被设置为此默认类。

<!--
### alpha.kubernetes.io/provided-node-ip

Example: `alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

Used on: Node

The kubelet can set this annotation on a Node to denote its configured IPv4 address.

When kubelet is started with the "external" cloud provider, it sets this annotation on the Node to denote an IP address set from the command line flag (`--node-ip`). This IP is verified with the cloud provider as valid by the cloud-controller-manager.
-->
### alpha.kubernetes.io/provided-node-ip {#alpha-kubernetes-io-provided-node-ip}

例子：`alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

用于：Node

kubelet 可以在 Node 上设置此注解来表示其配置的 IPv4 地址。

当使用“外部”云驱动启动时，kubelet 会在 Node 上设置此注解以表示从命令行标志 ( `--node-ip` ) 设置的 IP 地址。
云控制器管理器通过云驱动验证此 IP 是否有效。

<!--
### batch.kubernetes.io/job-completion-index

Example: `batch.kubernetes.io/job-completion-index: "3"`

Used on: Pod

The Job controller in the kube-controller-manager sets this annotation for Pods
created with Indexed [completion mode](/docs/concepts/workloads/controllers/job/#completion-mode).
-->
### batch.kubernetes.io/job-completion-index {#batch-kubernetes-io-job-completion-index}

例子：`batch.kubernetes.io/job-completion-index: "3"`

用于：Pod

kube-controller-manager 中的 Job 控制器为使用 Indexed
[完成模式](/zh/docs/concepts/workloads/controllers/job/#completion-mode)创建的 Pod
设置此注解。

<!--
### kubectl.kubernetes.io/default-container

Example: `kubectl.kubernetes.io/default-container: "front-end-app"`

The value of the annotation is the container name that is default for this Pod. For example, `kubectl logs` or `kubectl exec` without `-c` or `--container` flag will use this default container.
-->
### kubectl.kubernetes.io/default-container {#kubectl-kubernetes-io-default-container}

例子：`kubectl.kubernetes.io/default-container: "front-end-app"`

此注解的值是此 Pod 的默认容器名称。例如，未指定 `-c` 或 `--container` 标志时执行
`kubectl logs` 或 `kubectl exec` 命令将使用此默认容器。

<!--
### endpoints.kubernetes.io/over-capacity

Example: `endpoints.kubernetes.io/over-capacity:truncated`

Used on: Endpoints

In Kubernetes clusters v1.22 (or later), the Endpoints controller adds this annotation to an Endpoints resource if it has more than 1000 endpoints. The annotation indicates that the Endpoints resource is over capacity and the number of endpoints has been truncated to 1000.
-->
### endpoints.kubernetes.io/over-capacity {#endpoints-kubernetes-io-over-capacity}

例子：`endpoints.kubernetes.io/over-capacity:truncated`

用于：Endpoints

在 Kubernetes 集群 v1.22（或更高版本）中，如果 Endpoints 资源超过 1000 个，Endpoints
控制器会将此注解添加到 Endpoints 资源。
注解表示 Endpoints 资源已超出容量，并且已将 Endpoints 数截断为 1000。

<!--
### batch.kubernetes.io/job-tracking

Example: `batch.kubernetes.io/job-tracking: ""`

Used on: Jobs

The presence of this annotation on a Job indicates that the control plane is
[tracking the Job status using finalizers](/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers).
You should **not** manually add or remove this annotation.
-->
### batch.kubernetes.io/job-tracking {#batch-kubernetes-io-job-tracking}

例子：`batch.kubernetes.io/job-tracking: ""`

用于：Job

Job 上存在此注解表明控制平面正在[使用 Finalizer 追踪 Job](/zh/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers)。
你 **不** 可以手动添加或删除此注解。

<!--
### scheduler.alpha.kubernetes.io/preferAvoidPods (deprecated) {#scheduleralphakubernetesio-preferavoidpods}

Used on: Nodes

This annotation requires the [NodePreferAvoidPods scheduling plugin](/docs/reference/scheduling/config/#scheduling-plugins)
to be enabled. The plugin is deprecated since Kubernetes 1.22.
Use [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) instead.

**The taints listed below are always used on Nodes**
-->
### scheduler.alpha.kubernetes.io/preferAvoidPods (deprecated) {#scheduleralphakubernetesio-preferavoidpods}

用于：Node

此注解需要启用 [NodePreferAvoidPods 调度插件](/zh/docs/reference/scheduling/config/#scheduling-plugins)。
该插件自 Kubernetes 1.22 起已被弃用。
请改用[污点和容忍度](/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)。

**下面列出的污点总是在 Node 上使用**

<!--
### node.kubernetes.io/not-ready

Example: `node.kubernetes.io/not-ready:NoExecute`

The node controller detects whether a node is ready by monitoring its health and adds or removes this taint accordingly.

### node.kubernetes.io/unreachable

Example: `node.kubernetes.io/unreachable:NoExecute`

The node controller adds the taint to a node corresponding to the [NodeCondition](/docs/concepts/architecture/nodes/#condition) `Ready` being `Unknown`.
-->
### node.kubernetes.io/not-ready {#node-kubernetes-io-not-ready}

例子：`node.kubernetes.io/not-ready:NoExecute`

Node 控制器通过监控 Node 的健康状况来检测 Node 是否准备就绪，并相应地添加或删除此污点。

### node.kubernetes.io/unreachable {#node-kubernetes-io-unreachable}

例子：`node.kubernetes.io/unreachable:NoExecute`

Node 控制器将此污点添加到对应[节点状况](/zh/docs/concepts/architecture/nodes/#condition) `Ready`
为 `Unknown` 的 Node 上。

<!--
### node.kubernetes.io/unschedulable

Example: `node.kubernetes.io/unschedulable:NoSchedule`

The taint will be added to a node when initializing the node to avoid race condition.
-->
### node.kubernetes.io/unschedulable {#node-kubernetes-io-unschedulable}

例子：`node.kubernetes.io/unschedulable:NoSchedule`

在初始化 Node 期间，为避免竞争条件，此污点将被添加到 Node 上。

<!--
### node.kubernetes.io/memory-pressure

Example: `node.kubernetes.io/memory-pressure:NoSchedule`

The kubelet detects memory pressure based on `memory.available` and `allocatableMemory.available` observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
### node.kubernetes.io/memory-pressure {#node-kubernetes-io-memory-pressure}

例子：`node.kubernetes.io/memory-pressure:NoSchedule`

kubelet 根据在 Node 上观察到的 `memory.available` 和 `allocatableMemory.available` 检测内存压力。
然后将观察到的值与可以在 kubelet 上设置的相应阈值进行比较，以确定是否应添加/删除 Node 状况和污点。

<!--
### node.kubernetes.io/disk-pressure

Example: `node.kubernetes.io/disk-pressure:NoSchedule`

The kubelet detects disk pressure based on `imagefs.available`, `imagefs.inodesFree`, `nodefs.available` and `nodefs.inodesFree`(Linux only) observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
### node.kubernetes.io/disk-pressure {#node-kubernetes-io-disk-pressure}

例子：`node.kubernetes.io/disk-pressure:NoSchedule`

kubelet 根据在 Node 上观察到的 `imagefs.available`、`imagefs.inodesFree`、`nodefs.available` 和 `nodefs.inodesFree`（仅限 Linux ）检测磁盘压力。
然后将观察到的值与可以在 kubelet 上设置的相应阈值进行比较，以确定是否应添加/删除 Node 状况和污点。

<!--
### node.kubernetes.io/network-unavailable

Example: `node.kubernetes.io/network-unavailable:NoSchedule`

This is initially set by the kubelet when the cloud provider used indicates a requirement for additional network configuration. Only when the route on the cloud is configured properly will the taint be removed by the cloud provider.
-->
### node.kubernetes.io/network-unavailable {#node-kubernetes-io-network-unavailable}

例子：`node.kubernetes.io/network-unavailable:NoSchedule`

当使用的云驱动指示需要额外的网络配置时，此注解最初由 kubelet 设置。
只有云上的路由被正确地配置了，此污点才会被云驱动移除

<!--
### node.kubernetes.io/pid-pressure

Example: `node.kubernetes.io/pid-pressure:NoSchedule`

The kubelet checks D-value of the size of `/proc/sys/kernel/pid_max` and the PIDs consumed by Kubernetes on a node to get the number of available PIDs that referred to as the `pid.available` metric. The metric is then compared to the corresponding threshold that can be set on the kubelet to determine if the node condition and taint should be added/removed.
-->
### node.kubernetes.io/pid-pressure {#node-kubernetes-io-pid-pressure}

例子：`node.kubernetes.io/pid-pressure:NoSchedule`

kubelet 检查 `/proc/sys/kernel/pid_max` 大小的 D 值和 Kubernetes 在 Node 上消耗的 PID，
以获取可用 PID 数量，并将其作为 `pid.available` 指标值。
然后该指标与在 kubelet 上设置的相应阈值进行比较，以确定是否应该添加/删除 Node 状况和污点。

<!--
### node.cloudprovider.kubernetes.io/uninitialized

Example: `node.cloudprovider.kubernetes.io/uninitialized:NoSchedule`

Sets this taint on a node to mark it as unusable, when kubelet is started with the "external" cloud provider, until a controller from the cloud-controller-manager initializes this node, and then removes the taint.
-->
### node.cloudprovider.kubernetes.io/uninitialized {#node-cloudprovider-kubernetes-io-shutdown}

例子：`node.cloudprovider.kubernetes.io/uninitialized:NoSchedule`

在使用“外部”云驱动启动 kubelet 时，在 Node 上设置此污点以将其标记为不可用，直到来自
cloud-controller-manager 的控制器初始化此 Node，然后移除污点。

<!--
### node.cloudprovider.kubernetes.io/shutdown

Example: `node.cloudprovider.kubernetes.io/shutdown:NoSchedule`

If a Node is in a cloud provider specified shutdown state, the Node gets tainted accordingly with `node.cloudprovider.kubernetes.io/shutdown` and the taint effect of `NoSchedule`.
-->
### node.cloudprovider.kubernetes.io/shutdown {#node-cloudprovider-kubernetes-io-shutdown}

例子：`node.cloudprovider.kubernetes.io/shutdown:NoSchedule`

如果 Node 处于云驱动所指定的关闭状态，则 Node 会相应地被设置污点，对应的污点和效果为
`node.cloudprovider.kubernetes.io/shutdown` 和 `NoSchedule`。

<!--
### pod-security.kubernetes.io/enforce

Example: `pod-security.kubernetes.io/enforce: baseline`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `enforce` label _prohibits_ the creation of any Pod in the labeled Namespace which does not meet
the requirements outlined in the indicated level.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/enforce {#pod-security-kubernetes-io-enforce}

例子：`pod-security.kubernetes.io/enforce: baseline`

用于：Namespace

值**必须**是 `privileged`、`baseline` 或 `restricted` 之一，它们对应于
[Pod 安全标准](/zh/docs/concepts/security/pod-security-standards) 级别。
特别地，`enforce` 标签 **禁止** 在带标签的 Namespace 中创建任何不符合指示级别要求的 Pod。

请请参阅[在名字空间级别实施 Pod 安全性](/zh/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/enforce-version

Example: `pod-security.kubernetes.io/enforce-version: {{< skew latestVersion >}}`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards) 
policies to apply when validating a submitted Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/enforce-version {#pod-security-kubernetes-io-enforce-version}

例子：`pod-security.kubernetes.io/enforce-version: {{< skew latestVersion >}}`

用于：Namespace

值**必须**是 `latest` 或格式为 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此注解决定了在验证提交的 Pod 时要应用的 [Pod 安全标准](/zh/docs/concepts/security/pod-security-standards)策略的版本。

请参阅[在名字空间级别实施 Pod 安全性](/zh/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/audit

Example: `pod-security.kubernetes.io/audit: baseline`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `audit` label does not prevent the creation of a Pod in the labeled Namespace which does not meet
the requirements outlined in the indicated level, but adds an audit annotation to that Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/audit {#pod-security-kubernetes-io-audit}

例子：`pod-security.kubernetes.io/audit: baseline`

用于：Namespace

值**必须**是与 [Pod 安全标准](/zh/docs/concepts/security/pod-security-standards) 级别相对应的
`privileged`、`baseline` 或 `restricted` 之一。
具体来说，`audit` 标签不会阻止在带标签的 Namespace 中创建不符合指示级别要求的 Pod，
但会向该 Pod 添加审计注解。

请参阅[在名字空间级别实施 Pod 安全性](/zh/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/audit-version

Example: `pod-security.kubernetes.io/audit-version: {{< skew latestVersion >}}`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards) 
policies to apply when validating a submitted Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/audit-version {#pod-security-kubernetes-io-audit-version}

例子：`pod-security.kubernetes.io/audit-version: {{< skew latestVersion >}}`

用于：Namespace

值**必须**是 `latest` 或格式为 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此注解决定了在验证提交的 Pod 时要应用的  [Pod 安全标准](/zh/docs/concepts/security/pod-security-standards)策略的版本。

请参阅[在名字空间级别实施 Pod 安全性](/zh/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/warn

Example: `pod-security.kubernetes.io/warn: baseline`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `warn` label does not prevent the creation of a Pod in the labeled Namespace which does not meet the 
requirements outlined in the indicated level, but returns a warning to the user after doing so.
Note that warnings are also displayed when creating or updating objects that contain Pod templates,
such as Deployments, Jobs, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/warn {#pod-security-kubernetes-io-warn}

例子：`pod-security.kubernetes.io/warn: baseline`

用于：Namespace

值**必须**是与 [Pod 安全标准](/zh/docs/concepts/security/pod-security-standards)级别相对应的
`privileged`、`baseline` 或 `restricted` 之一。特别地，
`warn` 标签不会阻止在带标签的 Namespace 中创建不符合指示级别概述要求的 Pod，但会在这样做后向用户返回警告。
请注意，在创建或更新包含 Pod 模板的对象时也会显示警告，例如 Deployment、Jobs、StatefulSets 等。

请参阅[在名字空间级别实施 Pod 安全性](/zh/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/warn-version

Example: `pod-security.kubernetes.io/warn-version: {{< skew latestVersion >}}`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod. Note that warnings are also displayed when creating
or updating objects that contain Pod templates, such as Deployments, Jobs, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/warn-version {#pod-security-kubernetes-io-warn-version}

例子：`pod-security.kubernetes.io/warn-version: {{< skew latestVersion >}}`

用于：Namespace

值**必须**是 `latest` 或格式为 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此注解决定了在验证提交的 Pod 时要应用的 [Pod 安全标准](/zh/docs/concepts/security/pod-security-standards)策略的版本。
请注意，在创建或更新包含 Pod 模板的对象时也会显示警告，
例如 Deployment、Jobs、StatefulSets 等。

请参阅[在名字空间级别实施 Pod 安全性](/zh/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### seccomp.security.alpha.kubernetes.io/pod (deprecated) {#seccomp-security-alpha-kubernetes-io-pod}

This annotation has been deprecated since Kubernetes v1.19 and will become non-functional in v1.25.
To specify security settings for a Pod, include the `securityContext` field in the Pod specification.
The [`securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) field within a Pod's `.spec` defines pod-level security attributes.
When you [specify the security context for a Pod](/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod),
the settings you specify apply to all containers in that Pod.
-->
### seccomp.security.alpha.kubernetes.io/pod (已弃用) {#seccomp-security-alpha-kubernetes-io-pod}

此注解自 Kubernetes v1.19 起已被弃用，将在 v1.25 中失效。
要为 Pod 指定安全设置，请在 Pod 规范中包含 `securityContext` 字段。
Pod 的 `.spec` 中的 [`securityContext`](/zh/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
字段定义了 Pod 级别的安全属性。
你[为 Pod 设置安全上下文](/zh/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod) 时，
你所给出的设置适用于该 Pod 中的所有容器。

<!--
### container.seccomp.security.alpha.kubernetes.io/[NAME] {#container-seccomp-security-alpha-kubernetes-io}

This annotation has been deprecated since Kubernetes v1.19 and will become non-functional in v1.25.
The tutorial [Restrict a Container's Syscalls with seccomp](/docs/tutorials/clusters/seccomp/) takes
you through the steps you follow to apply a seccomp profile to a Pod or to one of
its containers. That tutorial covers the supported mechanism for configuring seccomp in Kubernetes,
based on setting `securityContext` within the Pod's `.spec`.
-->
### container.seccomp.security.alpha.kubernetes.io/[NAME] {#container-seccomp-security-alpha-kubernetes-io}

此注解自 Kubernetes v1.19 起已被弃用，将在 v1.25 中失效。
教程[使用 seccomp 限制容器的系统调用](/zh/docs/tutorials/clusters/seccomp/)将引导你完成将
seccomp 配置文件应用于 Pod 或其容器的步骤。
该教程介绍了在 Kubernetes 中配置 seccomp 的支持机制，基于在 Pod 的 `.spec` 中设置 `securityContext`。

<!--
## Annotations used for audit

- [`pod-security.kubernetes.io/exempt`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)
- [`pod-security.kubernetes.io/enforce-policy`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/audit-violations`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)

See more details on the [Audit Annotations](/docs/reference/labels-annotations-taints/audit-annotations/) page.
-->
## 用于审计的注解    {#annonations-used-for-audit}

- [`pod-security.kubernetes.io/exempt`](/zh/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)
- [`pod-security.kubernetes.io/enforce-policy`](/zh/zh/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/audit-violations`](/zh/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)

在[审计注解](/zh/docs/reference/labels-annotations-taints/audit-annotations/)页面上查看更多详细信息。