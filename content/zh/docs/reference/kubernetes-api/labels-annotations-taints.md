---
title: 知名标签（Label）、注解（Annotation）和 污点（Taint）
content_type: concept
weight: 60
---

<!-- overview -->

<!--
Kubernetes reserves all labels and annotations in the kubernetes.io namespace.

This document serves both as a reference to the values and as a coordination point for assigning values.
-->

Kubernetes 保留了 kubernetes.io 命名空间下的所有标签和注解。

本文档提供这些标签、注解和污点的参考，也可用来协调对这类标签、注解和污点的设置。



<!-- body -->

## kubernetes.io/arch

<!--
Example: `kubernetes.io/arch=amd64`

Used on: Node

The Kubelet populates this with `runtime.GOARCH` as defined by Go. This can be handy if you are mixing arm and x86 nodes.
-->

示例：`kubernetes.io/arch=amd64`

用于：Node

Kubelet 用 Go 中定义的 `runtime.GOARCH` 值来填充该标签。这在诸如混用 arm 和 x86 节点的情况下很有用。

## kubernetes.io/os

<!--
Example: `kubernetes.io/os=linux`

Used on: Node

The Kubelet populates this with `runtime.GOOS` as defined by Go. This can be handy if you are mixing operating systems in your cluster (for example: mixing Linux and Windows nodes).
-->

示例：`kubernetes.io/os=linux`

用于：Node

Kubelet 用该 Go 中定义的 `runtime.GOOS` 值来填充该标签。这在集群中存在不同操作系统的节点时很有用（例如：混合 Linux 和 Windows 操作系统的节点）。

<!--
## beta.kubernetes.io/arch (deprecated)
-->
## beta.kubernetes.io/arch (已弃用)

<!--
This label has been deprecated. Please use `kubernetes.io/arch` instead.
-->
该标签已被弃用。请使用  `kubernetes.io/arch`。

<!--
## beta.kubernetes.io/os (deprecated)
-->
## beta.kubernetes.io/os (已弃用)

<!--
This label has been deprecated. Please use `kubernetes.io/os` instead.
-->
该标签已被弃用。请使用 `kubernetes.io/os`。

## kubernetes.io/hostname

<!--
Example: `kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

Used on: Node

The Kubelet populates this label with the hostname. Note that the hostname can be changed from the "actual" hostname by passing the `--hostname-override` flag to the `kubelet`.
-->

示例：`kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

用于：Node

Kubelet 用 hostname 值来填充该标签。注意：可以通过向 `kubelet` 传入 `--hostname-override`
参数对 “真正的” hostname 进行修改。

<!--
This label is also used as part of the topology hierarchy.  See [topology.kubernetes.io/zone](#topologykubernetesiozone) for more information.
-->
此标签还用作拓扑层次结构的一部分。有关更多信息，请参见 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
## beta.kubernetes.io/instance-type (deprecated)
-->
## beta.kubernetes.io/instance-type (已弃用)

{{< note >}} 
<!--
Starting in v1.17, this label is deprecated in favor of [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type).
-->
从 kubernetes 1.17 版本开始，不推荐使用此标签，而推荐使用 [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type)。
{{< /note >}}

## node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

<!--
Example: `node.kubernetes.io/instance-type=m3.medium`

Used on: Node

The Kubelet populates this with the instance type as defined by the `cloudprovider`.
This will be set only if you are using a `cloudprovider`. This setting is handy
if you want to target certain workloads to certain instance types, but typically you want
to rely on the Kubernetes scheduler to perform resource-based scheduling. You should aim to schedule based on properties rather than on instance types (for example: require a GPU, instead of requiring a `g2.2xlarge`).
-->

示例：`node.kubernetes.io/instance-type=m3.medium`

用于：Node

Kubelet 用 `cloudprovider` 中定义的实例类型来填充该标签。未使用 `cloudprovider` 时不会设置该标签。
该标签在想要将某些负载定向到特定实例类型的节点上时会很有用，但通常用户更希望依赖 Kubernetes 调度器来执行基于资源的调度，
所以用户应该致力于基于属性而不是实例类型来进行调度（例如：需要一个 GPU，而不是 `g2.2xlarge`）。

## failure-domain.beta.kubernetes.io/region (已弃用) {#failure-domainbetakubernetesioregion}

<!--
See [topology.kubernetes.io/region](#topologykubernetesioregion).
-->
参考 [topology.kubernetes.io/region](#topologykubernetesioregion)。

{{< note >}}
<!--
Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/region](#topologykubernetesioregion).
-->
从 kubernetes 1.17 版本开始，不推荐使用此标签，而推荐使用 [topology.kubernetes.io/region](#topologykubernetesioregion)。
{{< /note >}}

## failure-domain.beta.kubernetes.io/zone (已弃用) {#failure-domainbetakubernetesiozone}

<!--
See [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
参考 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

{{< note >}}
<!--
Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
从 kubernetes 1.17 版本开始，不推荐使用此标签，而推荐使用 [topology.kubernetes.io/zone](#topologykubernetesiozone)。
{{< /note >}}

## topology.kubernetes.io/region {#topologykubernetesioregion}
<!--
Example:

`topology.kubernetes.io/region=us-east-1`
-->
示例：

`topology.kubernetes.io/region=us-east-1`

<!--
See [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
参考 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

## topology.kubernetes.io/zone {#topologykubernetesiozone}

<!--
Example:

`topology.kubernetes.io/zone=us-east-1c`

On Node: The `kubelet` or the external `cloud-controller-manager` populates this with the information as provided by the `cloudprovider`.  This will be set only if you are using a `cloudprovider`. However, you should consider setting this on nodes if it makes sense in your topology.
-->
示例：

`topology.kubernetes.io/zone=us-east-1c`

用于：Node、PersistentVolume

对于 Node： `Kubelet` 或外部 `cloud-controller-manager` 用 `cloudprovider` 中定义的区域信息来填充该标签。
未使用 `cloudprovider` 时不会设置该标签，但如果该标签在你的拓扑中有意义的话，应该考虑设置。

<!--
On PersistentVolume: topology-aware volume provisioners will automatically set node affinity constraints on `PersistentVolumes`.
-->
对于 PersistentVolume：可感知拓扑的卷制备程序将自动在 `PersistentVolumes` 上设置节点亲和性约束。

<!--
A zone represents a logical failure domain.  It is common for Kubernetes clusters to span multiple zones for increased availability.  While the exact definition of a zone is left to infrastructure implementations, common properties of a zone include very low network latency within a zone, no-cost network traffic within a zone, and failure independence from other zones.  For example, nodes within a zone might share a network switch, but nodes in different zones should not.
-->
区域代表逻辑故障域。Kubernetes 集群通常跨越多个区域以提高可用性。
虽然区域的确切定义留给基础架构实现，但是区域的常见属性包括区域内的网络延迟非常低，区域内的免费网络流量以及与其他区域的故障独立性。
例如，一个区域内的节点可能共享一个网络交换机，但不同区域内的节点则不应共享。

<!--
A region represents a larger domain, made up of one or more zones.  It is uncommon for Kubernetes clusters to span multiple regions,  While the exact definition of a zone or region is left to infrastructure implementations, common properties of a region include higher network latency between them than within them, non-zero cost for network traffic between them, and failure independence from other zones or regions.  For example, nodes within a region might share power infrastructure (e.g. a UPS or generator), but nodes in different regions typically would not.
-->
地区代表一个更大的域，由一个或多个区域组成。
Kubernetes 集群跨越多个地域是不常见的，而地域或区域的确切定义则留给基础设施实现，
地域的共同属性包括它们之间的网络延迟比它们内部更高，它们之间的网络流量成本不为零，故障独立于其他区域或域。
例如，一个地域内的节点可能共享电力基础设施（例如 UPS 或发电机），但不同地域的节点通常不会共享。

<!--
Kubernetes makes a few assumptions about the structure of zones and regions:
1) regions and zones are hierarchical: zones are strict subsets of regions and no zone can be in 2 regions
2) zone names are unique across regions; for example region "africa-east-1" might be comprised of zones "africa-east-1a" and "africa-east-1b"
-->
Kubernetes 对区域和区域的结构做了一些假设:
1) 地域和区域是分层的:区域是地域的严格子集，任何区域都不能位于两个地域中。
2) 区域名称在地域之间是唯一的；例如，地域 “africa-east-1” 可能包含区域 “africa-east-1a” 和 “africa-east-1b”。

<!--
It should be safe to assume that topology labels do not change. 
Even though labels are strictly mutable,
 consumers of them can assume that a given node is not going to be moved between zones without being destroyed and recreated.
-->
标签的使用者可以安全地假设拓扑标签不变。
即使标签是严格可变的，标签的使用者也可以认为节点只能通过被销毁并重建才能从一个区域迁移到另一个区域。

<!--
Kubernetes can use this information in various ways.
For example,
the scheduler automatically tries to spread the Pods in a ReplicaSet across nodes in a single-zone cluster (to reduce the impact of node failures,
see [kubernetes.io/hostname](#kubernetesiohostname)). With multiple-zone clusters, this spreading behavior also applies to zones (to reduce the impact of zone failures).
This is achieved via _SelectorSpreadPriority_.
-->
Kubernetes 可以以各种方式使用这些信息。
例如，调度器自动尝试将 ReplicaSet 中的多个 Pods 分布到单区域集群中的多个节点上（为了减少节点故障的影响，
请参阅 [kubernetesiohostname](#kubernetesiohostname)）。
对于多区域集群，这种分布行为也被应用到区域上（以减少区域故障的影响）。
这是通过 _SelectorSpreadPriority_ 实现的。

<!--
_SelectorSpreadPriority_ is a best effort placement.
 If the zones in your cluster are heterogeneous (for example: different numbers of nodes, different types of nodes, or different pod resource requirements),
 this placement might prevent equal spreading of your Pods across zones.
 If desired, you can use homogenous zones (same number and types of nodes) to reduce the probability of unequal spreading.
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
adding the labels manually (or adding support for `PersistentVolumeLabel`). With `PersistentVolumeLabel`,
the scheduler prevents Pods from mounting volumes in a different zone.
If your infrastructure doesn't have this constraint, you don't need to add the zone labels to the volumes at all.
-->
如果 `PersistentVolumeLabel` 准入控制器不支持自动为 PersistentVolume 打标签，且用户希望防止 pod 跨区域进行卷的挂载，
应考虑手动打标签 (或增加对 `PersistentVolumeLabel` 的支持）。如果用户的基础设施没有这种约束，则不需要为卷添加区域标签。
