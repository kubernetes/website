---
title: 特定于节点的卷数限制
content_template: templates/concept
---

{{% capture overview %}}

<!-- 
This page describes the maximum number of volumes that can be attached
to a Node for various cloud providers.
-->

此页面描述了各个云供应商可关联至一个节点的最大卷数。

<!-- 
Cloud providers like Google, Amazon, and Microsoft typically have a limit on
how many volumes can be attached to a Node. It is important for Kubernetes to
respect those limits. Otherwise, Pods scheduled on a Node could get stuck
waiting for volumes to attach.
-->

谷歌、亚马逊和微软等云供应商通常对可以关联到节点的卷数量进行限制。 
Kubernetes 需要尊重这些限制。 否则，在节点上调度的 Pod 可能会卡住去等待卷的关联。

{{% /capture %}}

{{% capture body %}}

<!-- 
## Kubernetes default limits

The Kubernetes scheduler has default limits on the number of volumes
that can be attached to a Node:
-->

## Kubernetes 的默认限制

The Kubernetes 调度器对关联于一个节点的卷数有默认限制：
<!-- 
<table>
  <tr><th>Cloud service</th><th>Maximum volumes per Node</th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/en-us/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
</table>
 -->
<table>
  <tr><th>云服务</th><th>每节点最大卷数</th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/en-us/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
</table>

<!-- 
## Custom limits

You can change these limits by setting the value of the
`KUBE_MAX_PD_VOLS` environment variable, and then starting the scheduler.

Use caution if you set a limit that is higher than the default limit. Consult
the cloud provider's documentation to make sure that Nodes can actually support
the limit you set.

The limit applies to the entire cluster, so it affects all Nodes.
-->

## 自定义限制

您可以通过设置 `KUBE_MAX_PD_VOLS` 环境变量的值来设置这些限制，然后再启动调度器。

如果设置的限制高于默认限制，请谨慎使用。请参阅云提供商的文档以确保节点可支持您设置的限制。

此限制应用于整个集群，所以它会影响所有节点。

<!-- 
## Dynamic volume limits
-->

## 动态卷限制

{{< feature-state state="beta" for_k8s_version="v1.12" >}}

<!-- 
Kubernetes 1.11 introduced support for dynamic volume limits based on Node type as an Alpha feature.
In Kubernetes 1.12 this feature is graduating to Beta and will be enabled by default.

Dynamic volume limits are supported for following volume types.

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI
-->

Kubernetes 1.11 引入了基于节点类型的动态卷限制的支持作为 Alpha 功能。
在 Kubernetes 1.12 中，此功能升级到 Beta 版，将默认开启。

以下卷类型支持动态卷限制。

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI

<!-- 
When the dynamic volume limits feature is enabled, Kubernetes automatically
determines the Node type and enforces the appropriate number of attachable
volumes for the node. For example:
-->

启用动态卷限制功能后，Kubernetes 会自动确定节点类型并确保节点上可关联的卷数目合规。 例如：

<!-- 
* On
<a href="https://cloud.google.com/compute/">Google Compute Engine</a>,
up to 128 volumes can be attached to a node, [depending on the node
type](https://cloud.google.com/compute/docs/disks/#pdnumberlimits).

* For Amazon EBS disks on M5,C5,R5,T3 and Z1D instance types, Kubernetes allows only 25
volumes to be attached to a Node. For other instance types on
<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>,
Kubernetes allows 39 volumes to be attached to a Node.

* On Azure, up to 64 disks can be attached to a node, depending on the node type. For more details, refer to [Sizes for virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes).

* For CSI, any driver that advertises volume attach limits via CSI specs will have those limits available as the Node's allocatable property
  and the Scheduler will not schedule Pods with volumes on any Node that is already at its capacity. Refer to the [CSI specs](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo) for more details.
-->

* 在
<a href="https://cloud.google.com/compute/">Google Compute Engine</a>环境中,
[根据节点类型](https://cloud.google.com/compute/docs/disks/#pdnumberlimits)最多可以将128个卷关联到节点。

* 对于 M5、C5、R5、T3 和 Z1D 类型实例的 Amazon EBS 磁盘，Kubernetes 仅允许 25 个卷关联到节点。
对于 ec2 上的其他实例类型
<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>,
Kubernetes 允许 39 个卷关联至节点。

* 在 Azure 环境中, 根据节点类型，最多 64 个磁盘可以关联至一个节点。
更多详细信息，请参阅[Azure 虚拟机的数量大小](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes)。

* 对于 CSI，任何符合 CSI 规范中卷关联限制的驱动都将这些限制作为 Node 的 allocatable 属性。调度器不会往已经达到其容量限制的任何节点上调度具有卷的Pod。 参考 [CSI 规范](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo) 获取更多详细信息。

{{% /capture %}}
