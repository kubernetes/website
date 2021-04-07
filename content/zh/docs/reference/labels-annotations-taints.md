---
title: 常见的标签、注解和污点
content_type: concept
weight: 20
---
<!-- 
---
title: Well-Known Labels, Annotations and Taints
content_type: concept
weight: 20
---
-->

<!-- overview -->

<!-- 
Kubernetes reserves all labels and annotations in the kubernetes.io namespace.

This document serves both as a reference to the values and as a coordination point for assigning values.
-->
Kubernetes 预留命名空间 kubernetes.io 用于所有的标签和注解。

本文档有两个作用，一是作为可用值的参考，二是作为赋值的协调点。

<!-- body -->

## kubernetes.io/arch

示例：`kubernetes.io/arch=amd64`

用于：Node

<!-- 
The Kubelet populates this with `runtime.GOARCH` as defined by Go. This can be handy if you are mixing arm and x86 nodes.
-->
Kubelet 用 Go 定义的 `runtime.GOARCH` 生成该标签的键值。在混合使用 arm 和 x86 节点的场景中，此键值可以带来极大便利。

## kubernetes.io/os

示例：`kubernetes.io/os=linux`

用于：Node

<!-- 
The Kubelet populates this with `runtime.GOOS` as defined by Go. This can be handy if you are mixing operating systems in your cluster (for example: mixing Linux and Windows nodes).
-->
Kubelet 用 Go 定义的 `runtime.GOOS` 生成该标签的键值。在混合使用异构操作系统场景下（例如：混合使用 Linux 和 Windows 节点），此键值可以带来极大便利。

## beta.kubernetes.io/arch (deprecated)

<!-- 
This label has been deprecated. Please use `kubernetes.io/arch` instead.
-->
此标签已被弃用，取而代之的是 `kubernetes.io/arch`.

## beta.kubernetes.io/os (deprecated)

<!-- 
This label has been deprecated. Please use `kubernetes.io/os` instead.
-->
此标签已被弃用，取而代之的是 `kubernetes.io/os`.

## kubernetes.io/hostname {#kubernetesiohostname}

示例：`kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

用于：Node

<!-- 
The Kubelet populates this label with the hostname. Note that the hostname can be changed from the "actual" hostname by passing the `--hostname-override` flag to the `kubelet`.

This label is also used as part of the topology hierarchy.  See [topology.kubernetes.io/zone](#topologykubernetesiozone) for more information.
-->
Kubelet 用主机名生成此标签。需要注意的是主机名可修改，这是把“实际的”主机名通过参数 `--hostname-override` 传给 `kubelet` 实现的。

此标签也可用做拓扑层次的一个部分。更多信息参见[topology.kubernetes.io/zone](#topologykubernetesiozone)。

## beta.kubernetes.io/instance-type (deprecated)

{{< note >}} 
<!-- 
Starting in v1.17, this label is deprecated in favor of [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type).
-->
从 v1.17 起，此标签被弃用，取而代之的是 [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type). 
{{< /note >}}


## node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

示例：`node.kubernetes.io/instance-type=m3.medium`

用于：Node

<!-- 
The Kubelet populates this with the instance type as defined by the `cloudprovider`.
This will be set only if you are using a `cloudprovider`. This setting is handy
if you want to target certain workloads to certain instance types, but typically you want
to rely on the Kubernetes scheduler to perform resource-based scheduling. You should aim to schedule based on properties rather than on instance types (for example: require a GPU, instead of requiring a `g2.2xlarge`).
-->
Kubelet 用 `cloudprovider` 定义的实例类型生成此标签。
所以只有用到 `cloudprovider` 的场合，才会设置此标签。
此标签非常有用，特别是在你希望把特定工作负载打到特定实例类型的时候，但更常见的调度方法是基于 Kubernetes 调度器来执行基于资源的调度。
你应该聚焦于使用基于属性的调度方式，而尽量不要依赖实例类型（例如：应该申请一个 GPU，而不是 `g2.2xlarge`）。

## failure-domain.beta.kubernetes.io/region (deprecated) {#failure-domainbetakubernetesioregion}

参见 [topology.kubernetes.io/region](#topologykubernetesioregion).

{{< note >}} 
<!-- 
Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/region](#topologykubernetesioregion). 
-->
从 v1.17 开始，此标签被弃用，取而代之的是 [topology.kubernetes.io/region](#topologykubernetesioregion). 
{{< /note >}}

## failure-domain.beta.kubernetes.io/zone (deprecated) {#failure-domainbetakubernetesiozone}

参见 [topology.kubernetes.io/zone](#topologykubernetesiozone).

{{< note >}} 
<!-- 
Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/zone](#topologykubernetesiozone). 
-->
从 v1.17 开始，此标签被弃用，取而代之的是 [topology.kubernetes.io/zone](#topologykubernetesiozone). 
{{< /note >}}

## topology.kubernetes.io/region {#topologykubernetesioregion}

示例

`topology.kubernetes.io/region=us-east-1`

参见 [topology.kubernetes.io/zone](#topologykubernetesiozone).

## topology.kubernetes.io/zone {#topologykubernetesiozone}

示例:

`topology.kubernetes.io/zone=us-east-1c`

用于：Node, PersistentVolume

<!-- 
On Node: The `kubelet` or the external `cloud-controller-manager` populates this with the information as provided by the `cloudprovider`.  This will be set only if you are using a `cloudprovider`. However, you should consider setting this on nodes if it makes sense in your topology.

On PersistentVolume: topology-aware volume provisioners will automatically set node affinity constraints on `PersistentVolumes`.
-->
Node 场景：`kubelet` 或外部的 `cloud-controller-manager` 用 `cloudprovider` 提供的信息生成此标签。
所以只有在用到 `cloudprovider` 的场景下，此标签才会被设置。
但如果此标签在你的拓扑中有意义，你也可以考虑在 node 上设置它。

PersistentVolume 场景：拓扑自感知的卷制备程序将在 `PersistentVolumes` 上自动设置节点亲和性限制。

<!-- 
A zone represents a logical failure domain.  It is common for Kubernetes clusters to span multiple zones for increased availability.  While the exact definition of a zone is left to infrastructure implementations, common properties of a zone include very low network latency within a zone, no-cost network traffic within a zone, and failure independence from other zones.  For example, nodes within a zone might share a network switch, but nodes in different zones should not.
-->
一个可用区（zone）表示一个逻辑故障域。Kubernetes 集群通常会跨越多个可用区以提高可用性。
虽然可用区的确切定义留给基础设施来决定，但可用区常见的属性包括：可用区内的网络延迟非常低，可用区内的网络通讯没成本，独立于其他可用区的故障域。
例如，一个可用区中的节点可以共享交换机，但不同可用区则不会。

<!-- 
A region represents a larger domain, made up of one or more zones.  It is uncommon for Kubernetes clusters to span multiple regions,  While the exact definition of a zone or region is left to infrastructure implementations, common properties of a region include higher network latency between them than within them, non-zero cost for network traffic between them, and failure independence from other zones or regions.  For example, nodes within a region might share power infrastructure (e.g. a UPS or generator), but nodes in different regions typically would not.
-->
一个地区（region）表示一个更大的域，由一个到多个可用区组成。对于 Kubernetes 来说，跨越多个地区的集群很罕见。
虽然可用区和地区的确切定义留给基础设施来决定，但地区的常见属性包括：地区间比地区内更高的网络延迟，地区间网络流量更高的成本，独立于其他可用区或是地区的故障域。例如，一个地区内的节点可以共享电力基础设施（例如 UPS 或发电机），但不同地区内的节点显然不会。

<!-- 
Kubernetes makes a few assumptions about the structure of zones and regions:
1) regions and zones are hierarchical: zones are strict subsets of regions and no zone can be in 2 regions
2) zone names are unique across regions; for example region "africa-east-1" might be comprised of zones "africa-east-1a" and "africa-east-1b"
-->
Kubernetes 对可用区和地区的结构做出一些假设：
1）地区和可用区是层次化的：可用区是地区的严格子集，任何可用区都不能再 2 个地区中出现。
2）可用区名字在地区中独一无二：例如地区 "africa-east-1" 可由可用区 "africa-east-1a" 和 "africa-east-1b" 构成。

<!-- 
It should be safe to assume that topology labels do not change.  Even though labels are strictly mutable, consumers of them can assume that a given node is not going to be moved between zones without being destroyed and recreated.
-->
你可以安全的假定拓扑类的标签是固定不变的。即使标签严格来说是可变的，但使用者依然可以假定一个节点只有通过销毁、重建的方式，才能在可用区间移动。

<!-- 
Kubernetes can use this information in various ways.  For example, the scheduler automatically tries to spread the Pods in a ReplicaSet across nodes in a single-zone cluster (to reduce the impact of node failures, see [kubernetes.io/hostname](#kubernetesiohostname)). With multiple-zone clusters, this spreading behavior also applies to zones (to reduce the impact of zone failures). This is achieved via _SelectorSpreadPriority_.
-->
Kubernetes 能以多种方式使用这些信息。
例如，调度器自动地尝试将 ReplicaSet 中的 Pod 打散在单可用区集群的不同节点上（以减少节点故障的影响，参见[kubernetes.io/hostname](#kubernetesiohostname)）。
在多可用区的集群中，这类打散分布的行为也会应用到可用区（以减少可用区故障的影响）。
做到这一点靠的是 _SelectorSpreadPriority_。

<!-- 
_SelectorSpreadPriority_ is a best effort placement. If the zones in your cluster are heterogeneous (for example: different numbers of nodes, different types of nodes, or different pod resource requirements), this placement might prevent equal spreading of your Pods across zones. If desired, you can use homogenous zones (same number and types of nodes) to reduce the probability of unequal spreading.
-->
_SelectorSpreadPriority_ 是一种最大能力分配方法（best effort）。如果集群中的可用区是异构的（例如：不同数量的节点，不同类型的节点，或不同的 Pod 资源需求），这种分配方法可以防止平均分配 Pod 到可用区。如果需要，你可以用同构的可用区（相同数量和类型的节点）来减少潜在的不平衡分布。

<!-- 
The scheduler (through the _VolumeZonePredicate_ predicate) also will ensure that Pods, that claim a given volume, are only placed into the same zone as that volume. Volumes cannot be attached across zones.
-->
调度器（通过 _VolumeZonePredicate_ 的预测）也会保障声明了某卷的 Pod 只能分配到该卷相同的可用区。
卷不支持跨可用区挂载。

<!-- 
If `PersistentVolumeLabel` does not support automatic labeling of your PersistentVolumes, you should consider
adding the labels manually (or adding support for `PersistentVolumeLabel`). With `PersistentVolumeLabel`, the scheduler prevents Pods from mounting volumes in a different zone. If your infrastructure doesn't have this constraint, you don't need to add the zone labels to the volumes at all.
-->
如果 `PersistentVolumeLabel` 不支持给 PersistentVolume 自动打标签，你可以考虑手动加标签（或增加 `PersistentVolumeLabel` 支持）。
有了 `PersistentVolumeLabel`，调度器可以防止 Pod 挂载不同可用区中的卷。
如果你的基础架构没有此限制，那你根本就没有必要给卷增加 zone 标签。

## node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

示例: `node.kubernetes.io/windows-build=10.0.17763`

用于：Node

<!-- 
When the kubelet is running on Microsoft Windows, it automatically labels its node to record the version of Windows Server in use.

The label's value is in the format "MajorVersion.MinorVersion.BuildNumber".
-->
当 kubelet 运行于 Microsoft Windows，它给节点自动打标签，以记录 Windows Server 的版本。

标签值的格式为 "主版本.次版本.构建号"

## service.kubernetes.io/headless {#servicekubernetesioheadless}

示例：`service.kubernetes.io/headless=""`

用于：Service

<!-- 
The control plane adds this label to an Endpoints object when the owning Service is headless.
-->
在无头（headless）服务的场景下，控制平面为 Endpoint 对象添加此标签。

## kubernetes.io/service-name {#kubernetesioservice-name}

示例：`kubernetes.io/service-name="nginx"`

用于：Service

<!-- 
Kubernetes uses this label to differentiate multiple Services. Used currently for `ELB`(Elastic Load Balancer) only.
-->
Kubernetes 用此标签区分多个服务。当前仅用于 `ELB`(Elastic Load Balancer)。

## endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

示例：`endpointslice.kubernetes.io/managed-by="controller"`

用于：EndpointSlices

<!-- 
The label is used to indicate the controller or entity that manages an EndpointSlice. This label aims to enable different EndpointSlice objects to be managed by different controllers or entities within the same cluster.
-->
此标签用来指向管理 EndpointSlice 的控制器或实体。
此标签的目的是用集群中不同的控制器或实体来管理不同的 EndpointSlice。

## endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

示例：`endpointslice.kubernetes.io/skip-mirror="true"`

用于：Endpoints

<!-- 
The label can be set to `"true"` on an Endpoints resource to indicate that the EndpointSliceMirroring controller should not mirror this resource with EndpointSlices.
-->
此标签在 Endpoints 资源上设为 `"true"` 指示 EndpointSliceMirroring 控制器不要镜像此 EndpointSlices 资源。

## service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

示例：`service.kubernetes.io/service-proxy-name="foo-bar"`

用于：Service

<!-- 
The kube-proxy has this label for custom proxy, which delegates service control to custom proxy.
-->
kube-proxy 把此标签用于客户代理，将服务控制委托给客户代理。

## experimental.windows.kubernetes.io/isolation-type

示例：`experimental.windows.kubernetes.io/isolation-type: "hyperv"`

用于：Pod

<!-- 
The annotation is used to run Windows containers with Hyper-V isolation. To use Hyper-V isolation feature and create a Hyper-V isolated container, the kubelet should be started with feature gates HyperVContainer=true and the Pod should include the annotation experimental.windows.kubernetes.io/isolation-type=hyperv.

< note >
You can only set this annotation on Pods that have a single container.
< /note >
-->
此注解用于运行 Hyper-V 隔离的 Windows 容器。
要使用 Hyper-V 隔离特性，并创建  Hyper-V 隔离容器，kubelet 应该用特性门控 HyperVContainer=true 来启动，并且 Pod 应该包含注解 `experimental.windows.kubernetes.io/isolation-type=hyperv`。

{{< note >}}
你只能在单容器 Pod 上设置此注解。
{{< /note >}}

## ingressclass.kubernetes.io/is-default-class

示例：`ingressclass.kubernetes.io/is-default-class: "true"`

用于：IngressClass

<!-- 
When a single IngressClass resource has this annotation set to `"true"`, new Ingress resource without a class specified will be assigned this default class.
-->
当唯一的 IngressClass 资源将此注解的值设为 "true"，没有指定类型的新 Ingress 资源将使用此默认类型。

## kubernetes.io/ingress.class (deprecated)

{{< note >}} 
<!-- 
Starting in v1.18, this annotation is deprecated in favor of `spec.ingressClassName`.
-->
从 v1.18 开始，此注解被弃用，取而代之的是 `spec.ingressClassName`。
{{< /note >}}


## alpha.kubernetes.io/provided-node-ip

示例：`alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

用于：Node

<!-- 
The kubelet can set this annotation on a Node to denote its configured IPv4 address.

When kubelet is started with the "external" cloud provider, it sets this annotation on the Node to denote an IP address set from the command line flag (`--node-ip`). This IP is verified with the cloud provider as valid by the cloud-controller-manager.

**The taints listed below are always used on Nodes**
-->
kubectl 在 Node 上设置此注解，表示它的 IPv4 地址。

当 kubectl 由外部的云供应商启动时，在 Node 上设置此注解，表示由命令行标记(`--node-ip`)设置的 IP 地址。
cloud-controller-manager 向云供应商验证此 IP 是否有效。

**以下列出的污点只能用于 Node**

## node.kubernetes.io/not-ready

示例：`node.kubernetes.io/not-ready:NoExecute`

<!-- 
The node controller detects whether a node is ready by monitoring its health and adds or removes this taint accordingly.
-->
节点控制器通过健康监控来检测节点是否就绪，并据此添加/删除此污点。

## node.kubernetes.io/unreachable

示例：`node.kubernetes.io/unreachable:NoExecute`

<!-- 
The node controller adds the taint to a node corresponding to the [NodeCondition](/docs/concepts/architecture/nodes/#condition) `Ready` being `Unknown`.
-->
如果 [NodeCondition](/docs/concepts/architecture/nodes/#condition) 的 `Ready` 键值为 `Unknown`，节点控制器将添加污点到 node。

## node.kubernetes.io/unschedulable

示例：`node.kubernetes.io/unschedulable:NoSchedule`

<!-- 
The taint will be added to a node when initializing the node to avoid race condition.
-->
当初始化节点时，添加此污点，来避免竟态的发生。

## node.kubernetes.io/memory-pressure

示例：`node.kubernetes.io/memory-pressure:NoSchedule`

<!-- 
The kubelet detects memory pressure based on `memory.available` and `allocatableMemory.available` observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
kubelet 依据节点上观测到的 `memory.available` 和 `allocatableMemory.available` 来检测内存压力。
用观测值对比 kubelet 设置的阈值，以判断节点状态和污点是否可以被添加/移除。

## node.kubernetes.io/disk-pressure

示例：`node.kubernetes.io/disk-pressure:NoSchedule`

<!-- 
The kubelet detects disk pressure based on `imagefs.available`, `imagefs.inodesFree`, `nodefs.available` and `nodefs.inodesFree`(Linux only) observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
kubelet 依据节点上观测到的 `imagefs.available`、`imagefs.inodesFree`、`nodefs.available` 和 `nodefs.inodesFree`(仅 Linux) 来判断磁盘压力。 
用观测值对比 kubelet 设置的阈值，以确定节点状态和污点是否可以被添加/移除。

## node.kubernetes.io/network-unavailable

示例：`node.kubernetes.io/network-unavailable:NoSchedule`

<!-- 
This is initially set by the kubelet when the cloud provider used indicates a requirement for additional network configuration. Only when the route on the cloud is configured properly will the taint be removed by the cloud provider.
-->
它初始由 kubectl 设置，云供应商用它来指示对额外网络配置的需求。
仅当云中的路由器配置妥当后，云供应商才会移除此污点。

## node.kubernetes.io/pid-pressure

示例：`node.kubernetes.io/pid-pressure:NoSchedule`

<!-- 
The kubelet checks D-value of the size of `/proc/sys/kernel/pid_max` and the PIDs consumed by Kubernetes on a node to get the number of available PIDs that referred to as the `pid.available` metric. The metric is then compared to the corresponding threshold that can be set on the kubelet to determine if the node condition and taint should be added/removed.
-->
kubelet 检查 `/proc/sys/kernel/pid_max` 尺寸的 D 值（D-value），以及节点上 Kubernetes 消耗掉的 PID，以获取可用的 PID 数量，此数量可通过指标 `pid.available` 得到。
然后用此指标对比 kubelet 设置的阈值，以确定节点状态和污点是否可以被添加/移除。

## node.cloudprovider.kubernetes.io/uninitialized

示例：`node.cloudprovider.kubernetes.io/uninitialized:NoSchedule`

<!-- 
Sets this taint on a node to mark it as unusable, when kubelet is started with the "external" cloud provider, until a controller from the cloud-controller-manager initializes this node, and then removes the taint.
-->
当 kubelet 由外部云供应商启动时，在节点上设置此污点以标记节点不可用，直到一个 cloud-controller-manager 控制器初始化此节点之后，才会移除此污点。

## node.cloudprovider.kubernetes.io/shutdown

示例：`node.cloudprovider.kubernetes.io/shutdown:NoSchedule`

<!-- 
If a Node is in a cloud provider specified shutdown state, the Node gets tainted accordingly with `node.cloudprovider.kubernetes.io/shutdown` and the taint effect of `NoSchedule`.
-->
如果一个云供应商的节点被指定为关机状态，节点被打上污点 `node.cloudprovider.kubernetes.io/shutdown`，污点的影响为 `NoSchedule`。
