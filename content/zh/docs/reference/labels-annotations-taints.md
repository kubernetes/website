<!--
title: Well-Known Labels, Annotations and Taints
content_type: concept
weight: 20
-->

---
title: 知名的标签、注解和污点
content_type: concept
weight: 20
---

<!-- overview -->
<!--
Kubernetes reserves all labels and annotations in the kubernetes.io namespace.

This document serves both as a reference to the values and as a coordination point for assigning values.
-->
Kubernetes 保留了 kubernetes.io 命名空间下的所有标签和注解。

本文档提供这些标签、注解和污点的参考，也可用来协调对这类标签、注解和污点的设置。

<!-- body -->

<!-->
## kubernetes.io/arch

Example: `kubernetes.io/arch=amd64`

Used on: Node

The Kubelet populates this with `runtime.GOARCH` as defined by Go. This can be handy if you are mixing arm and x86 nodes.
-->
## kubernetes.io/arch

示例：`kubernetes.io/arch=amd64`

用于：Node

Kubelet 用 Go 中定义的 `runtime.GOARCH` 值来填充该标签。当你在混用 arm 和 x86 节点的情况下很有用。

<!--
## kubernetes.io/os

Example: `kubernetes.io/os=linux`

Used on: Node

The Kubelet populates this with `runtime.GOOS` as defined by Go. This can be handy if you are mixing operating systems in your cluster (for example: mixing Linux and Windows nodes).
-->
## kubernetes.io/os

示例：`kubernetes.io/os=linux`

用于：Node

Kubelet Go 中定义的 `runtime.GOOS` 值来填充该标签。这在集群中存在不同操作系统的节点时很有用（例如：混合 Linux 和 Windows 操作系统的节点）。

<!--
## beta.kubernetes.io/arch (deprecated)

This label has been deprecated. Please use `kubernetes.io/arch` instead.
-->
## beta.kubernetes.io/arch (已弃用)

该标签已被弃用。请使用  `kubernetes.io/arch`。

<!--
## beta.kubernetes.io/os (deprecated)

This label has been deprecated. Please use `kubernetes.io/os` instead.
-->
## beta.kubernetes.io/os (已弃用)

该标签已被弃用。请使用 `kubernetes.io/os`。

<!--
## kubernetes.io/hostname {#kubernetesiohostname}

Example: `kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

Used on: Node

The Kubelet populates this label with the hostname. Note that the hostname can be changed from the "actual" hostname by passing the `--hostname-override` flag to the `kubelet`.

This label is also used as part of the topology hierarchy.  See [topology.kubernetes.io/zone](#topologykubernetesiozone) for more information.
-->
## kubernetes.io/hostname {#kubernetesiohostname}

示例：`kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

用于：节点

Kubelet 用 hostname 值来填充该标签。注意：可以通过向 `kubelet` 传入 `--hostname-override`
参数对 “真正的” hostname 进行修改。

此标签还用作拓扑层次结构的一部分。有关更多信息，请参见 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
## beta.kubernetes.io/instance-type (deprecated)

{{< note >}} Starting in v1.17, this label is deprecated in favor of [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type). {{< /note >}}
-->
## beta.kubernetes.io/instance-type (已弃用)

{{< note >}}
从 kubernetes 1.17 版本开始，不推荐使用此标签，而推荐使用 [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type)。
{{< /note >}}

<!--
## node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

Example: `node.kubernetes.io/instance-type=m3.medium`

Used on: Node
-->
## node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

示例：`node.kubernetes.io/instance-type=m3.medium`

用于：节点

<!--
The Kubelet populates this with the instance type as defined by the `cloudprovider`.
This will be set only if you are using a `cloudprovider`. This setting is handy
if you want to target certain workloads to certain instance types, but typically you want
to rely on the Kubernetes scheduler to perform resource-based scheduling. You should aim to schedule based on properties rather than on instance types (for example: require a GPU, instead of requiring a `g2.2xlarge`).
-->
Kubelet 用 `cloudprovider` 中定义的实例类型来填充该标签。
未使用 `cloudprovider` 时不会设置该标签。
该标签在想要将某些负载定向到特定实例类型的节点上时会很有用，
但通常用户更希望依赖 Kubernetes 调度器来执行基于资源的调度，
所以用户应该致力于基于属性而不是实例类型来进行调度
（例如：需要一个 GPU，而不是 `g2.2xlarge`）。

<!--
## failure-domain.beta.kubernetes.io/region (deprecated) {#failure-domainbetakubernetesioregion}

See [topology.kubernetes.io/region](#topologykubernetesioregion).

{{< note >}} Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/region](#topologykubernetesioregion). {{< /note >}}
-->
## failure-domain.beta.kubernetes.io/region (已弃用) {#failure-domainbetakubernetesioregion}

参考 [topology.kubernetes.io/region](#topologykubernetesioregion)。

{{< note >}}
从 kubernetes 1.17 版本开始，不推荐使用此标签，而推荐使用 [topology.kubernetes.io/region](#topologykubernetesioregion)。
{{< /note >}}

<!--
## failure-domain.beta.kubernetes.io/zone (deprecated) {#failure-domainbetakubernetesiozone}

See [topology.kubernetes.io/zone](#topologykubernetesiozone).

{{< note >}} Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/zone](#topologykubernetesiozone). {{< /note >}}
-->
## failure-domain.beta.kubernetes.io/zone (已弃用) {#failure-domainbetakubernetesiozone}

参考 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

{{< note >}}
从 kubernetes 1.17 版本开始，不推荐使用此标签，而推荐使用 [topology.kubernetes.io/zone](#topologykubernetesiozone)。
{{< /note >}}

<!--
## topology.kubernetes.io/region {#topologykubernetesioregion}

Example:

`topology.kubernetes.io/region=us-east-1`

See [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
## topology.kubernetes.io/region {#topologykubernetesioregion}

示例：`topology.kubernetes.io/region=us-east-1`

参考 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
## topology.kubernetes.io/zone {#topologykubernetesiozone}

Example:

`topology.kubernetes.io/zone=us-east-1c`

Used on: Node, PersistentVolume
-->
## topology.kubernetes.io/zone {#topologykubernetesiozone}

示例：

`topology.kubernetes.io/zone=us-east-1c`

用于：Node、PersistentVolume

<!--
On Node: The `kubelet` or the external `cloud-controller-manager` populates this with the information as provided by the `cloudprovider`.  This will be set only if you are using a `cloudprovider`. However, you should consider setting this on nodes if it makes sense in your topology.

On PersistentVolume: topology-aware volume provisioners will automatically set node affinity constraints on `PersistentVolumes`.
-->
对于 Node： `Kubelet` 或外部 `cloud-controller-manager` 用 `cloudprovider` 中定义的区域信息来填充该标签。
未使用 `cloudprovider` 时不会设置该标签，但如果该标签在你的拓扑中有意义的话，应该考虑设置。

对于 PersistentVolume：可感知拓扑的卷制备程序将自动在 `PersistentVolumes` 上设置节点亲和性约束。

<!--
A zone represents a logical failure domain.  It is common for Kubernetes clusters to span multiple zones for increased availability.  While the exact definition of a zone is left to infrastructure implementations, common properties of a zone include very low network latency within a zone, no-cost network traffic within a zone, and failure independence from other zones.  For example, nodes within a zone might share a network switch, but nodes in different zones should not.
-->
区域代表逻辑故障域。Kubernetes 集群通常跨越多个区域以提高可用性。
虽然区域的确切定义留给基础架构实现，但是区域的常见属性包括区域内的网络延迟非常低，
区域内的免费网络流量以及与其他区域的故障独立性。
例如，一个区域内的节点可能共享一个网络交换机，但不同区域内的节点则不应共享。

<!--
A region represents a larger domain, made up of one or more zones.  It is uncommon for Kubernetes clusters to span multiple regions,  While the exact definition of a zone or region is left to infrastructure implementations, common properties of a region include higher network latency between them than within them, non-zero cost for network traffic between them, and failure independence from other zones or regions.  For example, nodes within a region might share power infrastructure (e.g. a UPS or generator), but nodes in different regions typically would not.
-->
地区代表一个更大的域，由一个或多个区域组成。Kubernetes 集群跨越多个地域是不常见的，
而地域或区域的确切定义则留给基础设施实现，地域的共同属性包括它们之间的网络延迟比它们内部更高，
它们之间的网络流量成本不为零，故障独立于其他区域或域。
例如，一个地域内的节点可能共享电力基础设施（例如 UPS 或发电机），但不同地域的节点通常不会共享。

<!--
Kubernetes makes a few assumptions about the structure of zones and regions:
1) regions and zones are hierarchical: zones are strict subsets of regions and no zone can be in 2 regions
2) zone names are unique across regions; for example region "africa-east-1" might be comprised of zones "africa-east-1a" and "africa-east-1b"
-->
Kubernetes 对区域和区域的结构做了一些假设:
1) 地域和区域是分层的:区域是地域的严格子集，任何区域都不能位于两个地域中。
2) 区域名称在地域之间是唯一的；例如，地域 “africa-east-1” 
   可能包含区域“africa-east-1a” 和 “africa-east-1b”。

<!--
It should be safe to assume that topology labels do not change.  Even though labels are strictly mutable, consumers of them can assume that a given node is not going to be moved between zones without being destroyed and recreated.

Kubernetes can use this information in various ways.  For example, the scheduler automatically tries to spread the Pods in a ReplicaSet across nodes in a single-zone cluster (to reduce the impact of node failures, see [kubernetes.io/hostname](#kubernetesiohostname)). With multiple-zone clusters, this spreading behavior also applies to zones (to reduce the impact of zone failures). This is achieved via _SelectorSpreadPriority_.
-->
标签的使用者可以安全地假设拓扑标签不变。即使标签是严格可变的，
标签的使用者也可以认为节点只能通过被销毁并重建才能从一个区域迁移到另一个区域。

Kubernetes 可以以各种方式使用这些信息。例如，调度器自动尝试将 ReplicaSet 中的
多个 Pods 分布到单区域集群中的多个节点上（为了减少节点故障的影响，
请参阅 [kubernetesiohostname](#kubernetesiohostname)）。
对于多区域集群，这种分布行为也被应用到区域上（以减少区域故障的影响）。
这是通过 _SelectorSpreadPriority_ 实现的。

<!--
_SelectorSpreadPriority_ is a best effort placement. If the zones in your cluster are heterogeneous (for example: different numbers of nodes, different types of nodes, or different pod resource requirements), this placement might prevent equal spreading of your Pods across zones. If desired, you can use homogenous zones (same number and types of nodes) to reduce the probability of unequal spreading.
-->
_SelectorSpreadPriority_ 是一种尽力而为（best-effort）的处理方式，如果集群中的区域是异构的 
(例如：不同区域之间的节点数量、节点类型或 Pod 资源需求不同），可能使得 Pod 在各区域间无法均匀分布。
如有需要，用户可以使用同质的区域(节点数量和类型相同) 来减小 Pod 分布不均的可能性。

<!--
The scheduler (through the _VolumeZonePredicate_ predicate) also will ensure that Pods, that claim a given volume, are only placed into the same zone as that volume. Volumes cannot be attached across zones.
-->
由于卷不能跨区域挂载（Attach），调度器（通过 _VolumeZonePredicate_ 预选）也会保证需要特定卷的 Pod 被调度到卷所在的区域中。

<!--
If `PersistentVolumeLabel` does not support automatic labeling of your PersistentVolumes, you should consider
adding the labels manually (or adding support for `PersistentVolumeLabel`). With `PersistentVolumeLabel`, the scheduler prevents Pods from mounting volumes in a different zone. If your infrastructure doesn't have this constraint, you don't need to add the zone labels to the volumes at all.
-->
如果 `PersistentVolumeLabel` 准入控制器不支持自动为 PersistentVolume 打标签，
且用户希望防止 pod 跨区域进行卷的挂载，应考虑手动打标签 (或增加对 `PersistentVolumeLabel` 的支持）。
如果用户的基础设施没有这种约束，则不需要为卷添加区域标签。

<!--
## node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

Example: `node.kubernetes.io/windows-build=10.0.17763`

Used on: Node

When the kubelet is running on Microsoft Windows, it automatically labels its node to record the version of Windows Server in use.

The label's value is in the format "MajorVersion.MinorVersion.BuildNumber".
-->
## node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

示例： `node.kubernetes.io/windows-build=10.0.17763`

用于：节点

当 kubelet 运行在微软的 Windows 系统上，会自动将系统使用的版本标记到该标签上。

标签的值的格式为“MajorVersion.MinorVersion.BuildNumber”

<!--
## service.kubernetes.io/headless {#servicekubernetesioheadless}

Example: `service.kubernetes.io/headless=""`

Used on: Service

The control plane adds this label to an Endpoints object when the owning Service is headless.
-->
## service.kubernetes.io/headless {#servicekubernetesioheadless}

示例：`service.kubernetes.io/headless=""`

用于：Service

当拥有的 Service 没有头时，控制平面将此标签添加到 Endpoints 对象上。

<!--
## kubernetes.io/service-name {#kubernetesioservice-name}

Example: `kubernetes.io/service-name="nginx"`

Used on: Service

Kubernetes uses this label to differentiate multiple Services. Used currently for `ELB`(Elastic Load Balancer) only.
-->
## kubernetes.io/service-name {#kubernetesioservice-name}

示例：`kubernetes.io/service-name="nginx"`

用于：Service

Kubernetes 使用此标签来区分多个服务。当前仅用于 “ELB”（弹性负载平衡器）。

<!--
## endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

Example: `endpointslice.kubernetes.io/managed-by="controller"`

Used on: EndpointSlices
-->
## endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

示例：`endpointslice.kubernetes.io/managed-by="controller"`

用于：EndpointSlices

<!--
The label is used to indicate the controller or entity that manages an EndpointSlice. This label aims to enable different EndpointSlice objects to be managed by different controllers or entities within the same cluster.
-->
该标签用于指示管理 EndpointSlice 的控制器或实体。该标签旨在使不同的 EndpointSlice 对象可以由同一集群中的不同控制器或实体管理。

<!--
## endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

Example: `endpointslice.kubernetes.io/skip-mirror="true"`

Used on: Endpoints

The label can be set to `"true"` on an Endpoints resource to indicate that the EndpointSliceMirroring controller should not mirror this resource with EndpointSlices.
-->
## endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

示例：`endpointslice.kubernetes.io/skip-mirror="true"`

用于：Endpoints

可以在 Endpoints 资源上将标签设置为 “true”，以指示 EndpointSliceMirroring 控制器不应将此资源与 EndpointSlices 进行反射。

<!--
## service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

Example: `service.kubernetes.io/service-proxy-name="foo-bar"`

Used on: Service

The kube-proxy has this label for custom proxy, which delegates service control to custom proxy.
-->
## service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

示例：`service.kubernetes.io/service-proxy-name="foo-bar"`

用于：Service

kube-proxy 具有用于自定义代理的标签，该标签将服务控制委托给自定义代理。

<!--
## experimental.windows.kubernetes.io/isolation-type

Example: `experimental.windows.kubernetes.io/isolation-type: "hyperv"`

Used on: Pod

The annotation is used to run Windows containers with Hyper-V isolation. To use Hyper-V isolation feature and create a Hyper-V isolated container, the kubelet should be started with feature gates HyperVContainer=true and the Pod should include the annotation experimental.windows.kubernetes.io/isolation-type=hyperv.
-->
## experimental.windows.kubernetes.io/isolation-type

示例：`experimental.windows.kubernetes.io/isolation-type: "hyperv"`

用于：Pod

该注解用于运行具有 Hyper-V 隔离的 Windows 容器。要使用 Hyper-V 隔离功能
并创建 Hyper-V 隔离的容器，kubelet 应该先开启特性门控 HyperVContainer=true，
并且 Pod 应当包含注解 experimental.windows.kubernetes.io/isolation-type=hyperv。

{{< note >}}
<!--
You can only set this annotation on Pods that have a single container.
-->
你只能在具有单个容器的 Pod 上添加该注解。
{{< /note >}}

<!--
## ingressclass.kubernetes.io/is-default-class

Example: `ingressclass.kubernetes.io/is-default-class: "true"`

Used on: IngressClass

When a single IngressClass resource has this annotation set to `"true"`, new Ingress resource without a class specified will be assigned this default class.
-->
## ingressclass.kubernetes.io/is-default-class

示例：`ingressclass.kubernetes.io/is-default-class: "true"`

用于：IngressClass

当单个 IngressClass 资源的注解设置为 “true” 时，将为未指定类的新 Ingress 资源分配此默认类。

<!--
## kubernetes.io/ingress.class (deprecated)

{{< note >}} Starting in v1.18, this annotation is deprecated in favor of `spec.ingressClassName`. {{< /note >}}
-->
## kubernetes.io/ingress.class (已弃用)

{{< note >}}
从 v1.18 版本开始，不推荐使用这个注解，推荐在 `spec.ingressClassName` 中定义。
{{< /note >}}

<!--
## alpha.kubernetes.io/provided-node-ip

Example: `alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

Used on: Node
-->
## alpha.kubernetes.io/provided-node-ip

示例：`alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

用于：节点

<!--
The kubelet can set this annotation on a Node to denote its configured IPv4 address.

When kubelet is started with the "external" cloud provider, it sets this annotation on the Node to denote an IP address set from the command line flag (`--node-ip`). This IP is verified with the cloud provider as valid by the cloud-controller-manager.

**The taints listed below are always used on Nodes**
-->
kubelet 可以在节点上设置此注解表示其已配置的 IPv4 地址。

当使用“外部”云提供商的程序启动 kubelet 时，它将在节点上设置此注解，
以表示从命令行标志（`--node-ip`）设置的IP地址。
该 IP 已由云控制器管理员验证为与云提供商一起有效。

**下面列出的污点始终在节点上使用**

<!--
## node.kubernetes.io/not-ready

Example: `node.kubernetes.io/not-ready:NoExecute`

The node controller detects whether a node is ready by monitoring its health and adds or removes this taint accordingly.
-->
## node.kubernetes.io/not-ready

示例：`node.kubernetes.io/not-ready:NoExecute`

节点控制器通过监视其运行状况来检测节点是否准备就绪，并相应地添加或删除此污点。

<!--
## node.kubernetes.io/unreachable

Example: `node.kubernetes.io/unreachable:NoExecute`

The node controller adds the taint to a node corresponding to the [NodeCondition](/docs/concepts/architecture/nodes/#condition) `Ready` being `Unknown`.
-->
## node.kubernetes.io/unreachable

示例：`node.kubernetes.io/unreachable:NoExecute`

节点控制器会将该污点添加到 [NodeCondition](/docs/concepts/architecture/nodes/#condition) 
由 `Ready` 变为 `Unknown` 的节点上。

<!--
## node.kubernetes.io/unschedulable

Example: `node.kubernetes.io/unschedulable:NoSchedule`

The taint will be added to a node when initializing the node to avoid race condition.
-->
## node.kubernetes.io/unschedulable

示例：`node.kubernetes.io/unschedulable:NoSchedule`

初始化节点时，该污点将添加到节点上，以避免出现竞争状况。

<!--
## node.kubernetes.io/memory-pressure

Example: `node.kubernetes.io/memory-pressure:NoSchedule`

The kubelet detects memory pressure based on `memory.available` and `allocatableMemory.available` observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
## node.kubernetes.io/memory-pressure

示例：`node.kubernetes.io/memory-pressure:NoSchedule`

kubelet 根据在节点上观察到的 `memory.available` 和 `allocatableMemory.available` 来检测内存压力。
然后将观测值与 kubelet 上设置的相应阈值进行比较，以确定是否应添加/删除节点的状况和污点。

<!--
## node.kubernetes.io/disk-pressure

Example: `node.kubernetes.io/disk-pressure:NoSchedule`

The kubelet detects disk pressure based on `imagefs.available`, `imagefs.inodesFree`, `nodefs.available` and `nodefs.inodesFree`(Linux only) observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
## node.kubernetes.io/disk-pressure

示例：`node.kubernetes.io/disk-pressure:NoSchedule`

kubelet 根据在节点上观察到的 `imagefs.available`、`imagefs.inodesFree`、
`nodefs.available` 和 `nodefs.inodesFree`（仅 Linux）来检测磁盘压力。
然后将观测值与 kubelet 上设置的相应阈值进行比较，
以确定是否应添加/删除节点的状况和污点。

<!--
## node.kubernetes.io/network-unavailable

Example: `node.kubernetes.io/network-unavailable:NoSchedule`

This is initially set by the kubelet when the cloud provider used indicates a requirement for additional network configuration. Only when the route on the cloud is configured properly will the taint be removed by the cloud provider.
-->
## node.kubernetes.io/network-unavailable

示例：`node.kubernetes.io/network-unavailable:NoSchedule`

当使用的云提供商指示需要其他网络配置时，此设置最初由 kubelet 设置。
仅当云上的路由配置正确时，云提供商才会删除污点。

<!--
## node.kubernetes.io/pid-pressure

Example: `node.kubernetes.io/pid-pressure:NoSchedule`

The kubelet checks D-value of the size of `/proc/sys/kernel/pid_max` and the PIDs consumed by Kubernetes on a node to get the number of available PIDs that referred to as the `pid.available` metric. The metric is then compared to the corresponding threshold that can be set on the kubelet to determine if the node condition and taint should be added/removed.
-->
## node.kubernetes.io/pid-pressure

示例：`node.kubernetes.io/pid-pressure:NoSchedule`

Kubelet 会检查 `/proc/sys/kernel/pid_max` 大小的 D 值以及节点上 Kubernetes 消耗的PID，
以获得称为 `pid.available` 度量的可用PID数量。然后将度量标准与 kubelet 上设置的相应阈值进行比较，
以确定是否应添加/删除节点的状况和污点。

<!--
## node.cloudprovider.kubernetes.io/uninitialized

Example: `node.cloudprovider.kubernetes.io/uninitialized:NoSchedule`

Sets this taint on a node to mark it as unusable, when kubelet is started with the "external" cloud provider, until a controller from the cloud-controller-manager initializes this node, and then removes the taint.
-->
## node.cloudprovider.kubernetes.io/uninitialized

示例：`node.cloudprovider.kubernetes.io/uninitialized:NoSchedule`

当使用 “外部” 云提供商程序启动 kubelet 时，在节点上设置此污点以将其标记为不可用，
直到有云控制器管理员的控制器初始化此节点，然后删除该污点。

<!--
## node.cloudprovider.kubernetes.io/shutdown

Example: `node.cloudprovider.kubernetes.io/shutdown:NoSchedule`

If a Node is in a cloud provider specified shutdown state, the Node gets tainted accordingly with `node.cloudprovider.kubernetes.io/shutdown` and the taint effect of `NoSchedule`.
-->
## node.cloudprovider.kubernetes.io/shutdown

示例：`node.cloudprovider.kubernetes.io/shutdown:NoSchedule`

如果某个节点处于云提供商指定的关闭状态，则该节点会相应地受到 
`node.cloudprovider.kubernetes.io/shutdown` 和`NoSchedule` 的污点影响。
