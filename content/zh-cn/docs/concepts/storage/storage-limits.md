---
title: 特定于节点的卷数限制
content_type: concept
weight: 90
---
<!--
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Node-specific Volume Limits
content_type: concept
weight: 90
-->

<!-- overview -->

<!--
This page describes the maximum number of volumes that can be attached
to a Node for various cloud providers.
-->
此页面描述了各个云供应商可挂接至一个节点的最大卷数。

<!--
Cloud providers like Google, Amazon, and Microsoft typically have a limit on
how many volumes can be attached to a Node. It is important for Kubernetes to
respect those limits. Otherwise, Pods scheduled on a Node could get stuck
waiting for volumes to attach.
-->
谷歌、亚马逊和微软等云供应商通常对可以挂接到节点的卷数量进行限制。
Kubernetes 需要尊重这些限制。否则，在节点上调度的 Pod 可能会卡住去等待卷的挂接。

<!-- body -->

<!--
## Kubernetes default limits

The Kubernetes scheduler has default limits on the number of volumes
that can be attached to a Node:
-->
## Kubernetes 的默认限制   {#kubernetes-default-limits}

Kubernetes 调度器对挂接到一个节点的卷数有默认限制：

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
CSI drivers might have a different procedure, see their documentation
on how to customize their limits.

Use caution if you set a limit that is higher than the default limit. Consult
the cloud provider's documentation to make sure that Nodes can actually support
the limit you set.

The limit applies to the entire cluster, so it affects all Nodes.
-->
## 自定义限制   {#custom-limits}

你可以通过设置 `KUBE_MAX_PD_VOLS` 环境变量的值来设置这些限制，然后再启动调度器。
各个 CSI 驱动可能采用不同的步骤，关于如何自定义其限制请参阅相关文档。

如果设置的限制高于默认限制，请谨慎使用。请参阅云提供商的文档以确保节点可支持你设置的限制。

此限制应用于整个集群，所以它会影响所有节点。

<!--
## Dynamic volume limits
-->
## 动态卷限制   {#dynamic-volume-limits}

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

<!--
Dynamic volume limits are supported for following volume types.

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI
-->
以下卷类型支持动态卷限制。

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI

<!--
For volumes managed by in-tree volume plugins, Kubernetes automatically determines the Node
type and enforces the appropriate maximum number of volumes for the node. For example:
-->
对于由树内插件管理的卷，Kubernetes 会自动确定节点类型并确保节点上可挂接的卷数目合规。例如：

<!--
* On
<a href="https://cloud.google.com/compute/">Google Compute Engine</a>,
up to 127 volumes can be attached to a node, [depending on the node
type](https://cloud.google.com/compute/docs/disks/#pdnumberlimits).

* For Amazon EBS disks on M5,C5,R5,T3 and Z1D instance types, Kubernetes allows only 25
volumes to be attached to a Node. For other instance types on
<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>,
Kubernetes allows 39 volumes to be attached to a Node.

* On Azure, up to 64 disks can be attached to a node, depending on the node type. For more details, refer to [Sizes for virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes).
-->
* 在 <a href="https://cloud.google.com/compute/">Google Compute Engine</a> 环境中，
  [根据节点类型](https://cloud.google.com/compute/docs/disks/#pdnumberlimits)最多可以将 127 个卷挂接到节点。

* 对于 M5、C5、R5、T3 和 Z1D 实例类型的 Amazon EBS 磁盘，Kubernetes 仅允许 25 个卷挂接到节点。
  对于 <a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a> 上的其他实例类型，
  Kubernetes 允许 39 个卷挂接至节点。

* 在 Azure 环境中，根据节点类型，最多 64 个磁盘可以挂接至一个节点。
  更多详细信息，请参阅 [Azure 虚拟机的数量大小](https://docs.microsoft.com/zh-cn/azure/virtual-machines/windows/sizes)。

<!--
* If a CSI storage driver advertises a maximum number of volumes for a Node (using `NodeGetInfo`), the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} honors that limit.
Refer to the [CSI specifications](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo) for details.

* For volumes managed by in-tree plugins that have been migrated to a CSI driver, the maximum number of volumes will be the one reported by the CSI driver.
-->
* 如果 CSI 存储驱动（使用 `NodeGetInfo`）为节点通告卷数上限，则
  {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} 将遵守该限制值。
  参考 [CSI 规范](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo)获取更多详细信息。

* 对于由已迁移到 CSI 驱动的树内插件管理的卷，最大卷数将是 CSI 驱动报告的卷数。

<!--
### Mutable CSI Node Allocatable Count
-->
### 可变的 CSI 节点可分配数   {#mutable-csi-node-allocatable-count}

{{< feature-state state="alpha" for_k8s_version="v1.33" >}}

<!--
CSI drivers can dynamically adjust the maximum number of volumes that can be attached to a Node at runtime. This enhances scheduling accuracy and reduces pod scheduling failures due to changes in resource availability.
-->
CSI 驱动可以在运行时动态调整可以挂载到 Node 的最大卷数量。
这提高了调度准确性，并减少了由于资源可用性变化导致的 Pod 调度失败。

<!--
This is an alpha feature and is disabled by default.

To use this feature, you must enable the `MutableCSINodeAllocatableCount` feature gate on the following components:
-->
这是一个 Alpha 级别特性，默认情况下是禁用的。

要使用此特性，你必须在以下组件上启用 `MutableCSINodeAllocatableCount`
特性门控：

- `kube-apiserver`
- `kubelet`

<!--
#### Periodic Updates

When enabled, CSI drivers can request periodic updates to their volume limits by setting the `nodeAllocatableUpdatePeriodSeconds` field in the `CSIDriver` specification. For example:
-->
#### 定期更新

当启用时，CSI 驱动可以通过在 `CSIDriver` 规约中设置
`nodeAllocatableUpdatePeriodSeconds` 字段来请求定期更新其卷限制。
例如：

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: hostpath.csi.k8s.io
spec:
  nodeAllocatableUpdatePeriodSeconds: 60
```

<!--
Kubelet will periodically call the corresponding CSI driver’s `NodeGetInfo` endpoint to refresh the maximum number of attachable volumes, using the interval specified in `nodeAllocatableUpdatePeriodSeconds`. The minimum allowed value for this field is 10 seconds.
-->
kubelet 将使用 `nodeAllocatableUpdatePeriodSeconds`
中指定的时间间隔，定期调用相应的 CSI 驱动的 `NodeGetInfo`
端点来刷新可挂接卷的最大数量。此字段允许的最小值为 10 秒。

<!--
Additionally, if a volume attachment operation fails with a `ResourceExhausted` error (gRPC code 8), Kubernetes triggers an immediate update to the allocatable volume count for that Node.
-->
此外，如果卷挂接操作失败并返回 `ResourceExhausted` 错误（gRPC 代码 8），
Kubernetes 会立即触发对该 Node 的可分配卷数量的更新。
