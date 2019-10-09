---
title: 知名标签、注解和污点
content_template: templates/concept
weight: 10
---
<!--
---
title: Well-Known Labels, Annotations and Taints
content_template: templates/concept
weight: 10
---
-->

{{% capture overview %}}
<!--
Kubernetes reserves all labels and annotations in the kubernetes.io namespace.
-->
Kubernetes 保留 kubernetes.io 命名空间中的所有标签和注解。
  
<!--
This document serves both as a reference to the values, and as a coordination point for assigning values.
-->
本文档既可以作为值的参考，也可以作为分配值的协调点。

{{% /capture %}}

{{% capture body %}}

## beta.kubernetes.io/arch

<!--
Example: `beta.kubernetes.io/arch=amd64`
-->
例子：`beta.kubernetes.io/arch=amd64`

<!--
Used on: Node
-->
用于：节点

<!--
Kubelet populates this with `runtime.GOARCH` as defined by Go.  This can be handy if you are mixing arm and x86 nodes,
for example.
-->
Kubelet 用 Go 定义的 `runtime.GOARCH` 填充它。例如，如果您混合使用 arm 和 x86 节点，这可能会很方便。

## beta.kubernetes.io/os

<!--
Example: `beta.kubernetes.io/os=linux`
-->
例如：`beta.kubernetes.io/os=linux`

<!--
Used on: Node
-->
用于：节点

<!--
Kubelet populates this with `runtime.GOOS` as defined by Go.  This can be handy if you are mixing operating systems
in your cluster (although currently Linux is the only OS supported by Kubernetes).
-->
Kubelet 用 Go 定义的 `runtime.GOOS` 填充它。如果您在您的集群中（尽管目前 Linux 是 Kubernetes 支持的唯一操作系统）混合使用操作系统，这可能会很方便。

## kubernetes.io/hostname

<!--
Example: `kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`
-->
例如：`kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

<!--
Used on: Node
-->
用于：节点

<!--
Kubelet populates this with the hostname.  Note that the hostname can be changed from the "actual" hostname
by passing the `--hostname-override` flag to kubelet.
-->
Kubelet 使用主机名填充它。请注意，可以通过将 `--hostname-override` 参数传递给 kubelet，以便使其根据“实际”主机名对主机名进行变更。

<!--
## beta.kubernetes.io/instance-type
-->
## beta.kubernetes.io/instance-type

<!--
Example: `beta.kubernetes.io/instance-type=m3.medium`
-->
例子：`beta.kubernetes.io/instance-type=m3.medium`

<!--
Used on: Node
-->
用于：节点

<!--
Kubelet populates this with the instance type as defined by the `cloudprovider`.  It will not be set if
not using a cloudprovider.  This can be handy if you want to target certain workloads to certain instance
types, but typically you want to rely on the Kubernetes scheduler to perform resource-based scheduling,
and you should aim to schedule based on properties rather than on instance types (e.g. require a GPU, instead
of requiring a `g2.2xlarge`)
-->
Kubelet 使用 `cloudprovider` 定义的实例类型填充它。如果不使用 cloudprovider，则不会对它进行设置。
如果您想将某些工作负载定位到某个实例类型，这可能很方便。
但通常您希望依靠 Kubernetes 调度程序来执行基于资源的调度，您应该根据属性而不是实例类型来安排计划（例如，需要一个 GPU，而不是 `g2.2xlarge`）

## failure-domain.beta.kubernetes.io/region

<!--
See [failure-domain.beta.kubernetes.io/zone](#failure-domainbetakubernetesiozone).
-->
见 [failure-domain.beta.kubernetes.io/zone](#failure-domainbetakubernetesiozone）。

## failure-domain.beta.kubernetes.io/zone {#failure-domainbetakubernetesiozone}

<!--
Example:
-->
例如：

`failure-domain.beta.kubernetes.io/region=us-east-1`

`failure-domain.beta.kubernetes.io/zone=us-east-1c`

<!--
Used on: Node, PersistentVolume
-->
用于：节点，持久卷

<!--
On the Node: Kubelet populates this with the zone information as defined by the `cloudprovider`.  It will not be set if
not using a `cloudprovider`, but you should consider setting it on the nodes if it makes sense in your topology.
-->
在节点上：Kubelet 使用 `cloudprovider` 定义的区域信息填充它。如果不使用 `cloudprovider`，则不会设置它。
但如果在拓扑中有意义，则应考虑在节点上设置它。

<!--
On the PersistentVolume: The `PersistentVolumeLabel` admission controller will automatically add zone labels to PersistentVolumes,
on GCE and AWS.
-->
在持久卷上：基于 GCE 和 AWS 环境，`PersistentVolumeLabel` 准入控制器会自动将区域标签添加到持久卷。

<!--
Kubernetes will automatically spread the pods in a replication controller or service across nodes in a single-zone
cluster (to reduce the impact of failures).
-->
Kubernetes 将自动把 pod 分布在跨越单个区域中的集群节点的副本控制器或服务中（以减少故障的影响）。
<!--
With multiple-zone clusters, this spreading behaviour is extended across zones (to reduce the impact of zone failures).
-->
对于多区域集群，可以跨区域实现这种扩展行为(以减少区域故障的影响)。
<!--
This is achieved via SelectorSpreadPriority.
-->
这是通过 SelectorSpreadPriority 实现的。

<!--
This is a best-effort placement, and so if the zones in your cluster are heterogeneous (e.g. different numbers of nodes,
different types of nodes, or different pod resource requirements), this might prevent equal spreading of
your pods across zones. 
-->
这是一个最佳的布局。但是，如果集群中的区域是异构的（例如，不同数量的节点、不同类型的节点或不同的 pod 资源需求），这些都可能会阻止您的 pod 在不同的区域中做到均匀分布。

<!--
If desired, you can use homogenous zones (same number and types of nodes) to reduce
the probability of unequal spreading.
-->
如果需要，可以使用同质区域（相同数量和类型的节点）来减少不均匀分布的概率。

<!--
The scheduler (via the VolumeZonePredicate predicate) will also ensure that pods that claim a given volume
are only placed into the same zone as that volume, as volumes cannot be attached across zones.
-->
调度器（通过 VolumeZonePredicate）还将确保声明给定卷的 pod 只放置在与该卷相同的区域中，因为卷不能跨区域挂载。

<!--
The actual values of zone and region don't matter, and nor is the meaning of the hierarchy rigidly defined.  The expectation
is that failures of nodes in different zones should be uncorrelated unless the entire region has failed. 
-->
区域和区域的实际值无关紧要，层次结构的含义也没有严格定义。期望不同区域节点的故障应该是不相关的，除非整个区域都发生故障。
<!--
 For example,
-->
例如，
<!--
zones should typically avoid sharing a single network switch.  The exact mapping depends on your particular
infrastructure - a three-rack installation will choose a very different setup to a multi-datacenter configuration.
-->
区域通常应该避免共享一个网络交换机。确切的映射取决于特定的基础设施，三机架安装将选择与多数据中心配置非常不同的设置。

<!--
If `PersistentVolumeLabel` does not support automatic labeling of your PersistentVolumes, you should consider
adding the labels manually (or adding support to `PersistentVolumeLabel`), if you want the scheduler to prevent
pods from mounting volumes in a different zone. 
-->
如果 `PersistentVolumeLabel` 不支持自动标记您的持久卷，您又希望调度程序能防止 pod 在不同的区域挂载卷，则您应该考虑手动添加标签（或添加对 `PersistentVolumeLabel` 的支持）。
<!--
 If your infrastructure doesn't have this constraint, you don't
 need to add the zone labels to the volumes at all.
-->
如果您的基础设施没有此约束，则根本不需要将区域标签添加到卷中。
{{% /capture %}}
