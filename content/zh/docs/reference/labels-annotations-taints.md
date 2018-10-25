---
title: 知名标签（Label）、注解（Annotation）和 Taints
---

Kubernetes 保留了 kubernetes.io 名字空间下的所有标签和注解。 本文描述了知名的
kubernetes.io 标签和注解。

本文既作为这些标签和注解值的参考，也就这些标签和注解的赋值进行了说明。

**目录：**
<!-- BEGIN MUNGE: GENERATED_TOC -->

- [知名标签、注解和 Taints](#well-known-labels-annotations-and-taints)
  - [beta.kubernetes.io/arch](#betakubernetesioarch)
  - [beta.kubernetes.io/os](#betakubernetesioos)
  - [kubernetes.io/hostname](#kubernetesiohostname)
  - [beta.kubernetes.io/instance-type](#betakubernetesioinstance-type)
  - [failure-domain.beta.kubernetes.io/region](#failure-domainbetakubernetesioregion)
  - [failure-domain.beta.kubernetes.io/zone](#failure-domainbetakubernetesiozone)

<!-- END MUNGE: GENERATED_TOC -->


## beta.kubernetes.io/arch

示例：`beta.kubernetes.io/arch=amd64`

用于：节点

Kubelet 用 Go 中定义的 `runtime.GOARCH` 值来填充该标签。 这在诸如混用 arm 和 x86 节点的情况下很有用。

## beta.kubernetes.io/os

示例：`beta.kubernetes.io/os=linux`

用于：节点

Kubelet 用该 Go 中定义的 `runtime.GOOS` 值来填充该标签。 这在集群中存在不同操作系统的节点时很有用（尽管当前 Kubernetes 只支持 Linux 操作系统）。

## kubernetes.io/hostname

示例：`kubernetes.io/hostname=ip-172-20-114-199.ec2.internal`

用于：节点

Kubelet 用 hostname 值来填充该标签。 注意：可以通过向 kubelet 传入 `--hostname-override`
参数对 “真正的” hostname 进行修改。

## beta.kubernetes.io/instance-type

示例：`beta.kubernetes.io/instance-type=m3.medium`

用于：节点

Kubelet 用 `cloudprovider` 中定义的实例类型来填充该标签。 未使用 `cloudprovider` 时不会设置该标签。
该标签在想要将某些负载定向到特定实例类型的节点上时会很有用，但通常用户更希望依赖 Kubernetes 调度器来执行基于资源的调度，所以用户应该致力于基于属性而不是实例类型来进行调度(例如：需要一个 CPU，而不是 `g2.2xlarge`)。


## failure-domain.beta.kubernetes.io/region

参考 [failure-domain.beta.kubernetes.io/zone](#failure-domainbetakubernetesiozone).

## failure-domain.beta.kubernetes.io/zone

示例：

`failure-domain.beta.kubernetes.io/region=us-east-1`

`failure-domain.beta.kubernetes.io/zone=us-east-1c`

用于：节点、PersistentVolume

用于节点： Kubelet 用 `cloudprovider` 中定义的区域（zone）信息来填充该标签。 未使用 `cloudprovider` 
时不会设置该标签，但如果该标签在你的拓扑中有意义的话，应该考虑设置。

用于 PersistentVolume：在 GCE 和 AWS 中，`PersistentVolumeLabel` 准入控制器会自动添加区域标签。

在单区的集群中，Kubernetes 会自动将同一副本控制器或服务下的 pod 分散到不同的节点上 (以降低故障的影响)。 
在多区的集群中，这种分散的行为扩展到跨区的层面 (以降低区域故障的影响)。 跨区分散通过 SelectorSpreadPriority 
来实现。

这是一种尽力而为（best-effort）的处置方式， 如果集群中的区域是异构的 (例如：不同区域之间的节点数量、
节点类型或 pod 资源需求不同），可能使得 pod 在各区域间无法均匀分布。 如有需要，用户可以使用同质的区域 
(节点数量和类型相同) 来减小 pod 分布不均的可能性。

由于卷不能跨区域挂载（attach），调度器 (通过 VolumeZonePredicate 断言) 也会保证需要特定卷的 pod 
被调度到卷所在的区域中。


区域和地域（region）的实际值无关紧要，两者的层次含义也没有严格的定义。 最终期望是，除非整个地域故障，
否则某一区域节点的故障不应该影响到其他区域的节点。 例如，通常区域间应该避免共用同一个网络交换机。 
具体的规划取决于特定的基础设备—— three-rack 设备所选择的设置与多数据中心截然不同。

如果 `PersistentVolumeLabel` 准入控制器不支持自动为 PersistentVolume 打标签，且用户希望防止 pod
跨区域进行卷的挂载，应考虑手动打标签 (或对 `PersistentVolumeLabel` 增加支持）。 如果用户的基础设施没有这种约束，则不需要为卷添加区域标签。






<!-- BEGIN MUNGE: GENERATED_ANALYTICS -->
[![分析](https://kubernetes-site.appspot.com/UA-36037335-10/GitHub/docs/api-reference/labels-annotations-taints.md?pixel)]()
<!-- END MUNGE: GENERATED_ANALYTICS -->
