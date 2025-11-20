---
title: 特定於節點的卷數限制
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
此頁面描述了各個雲供應商可掛接至一個節點的最大卷數。

<!--
Cloud providers like Google, Amazon, and Microsoft typically have a limit on
how many volumes can be attached to a Node. It is important for Kubernetes to
respect those limits. Otherwise, Pods scheduled on a Node could get stuck
waiting for volumes to attach.
-->
谷歌、亞馬遜和微軟等雲供應商通常對可以掛接到節點的卷數量進行限制。
Kubernetes 需要尊重這些限制。否則，在節點上調度的 Pod 可能會卡住去等待卷的掛接。

<!-- body -->

<!--
## Kubernetes default limits

The Kubernetes scheduler has default limits on the number of volumes
that can be attached to a Node:
-->
## Kubernetes 的預設限制   {#kubernetes-default-limits}

Kubernetes 調度器對掛接到一個節點的卷數有預設限制：

<!--
<table>
  <tr><th>Cloud service</th><th>Maximum volumes per Node</th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/en-us/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
</table>
-->
<table>
  <tr><th>雲服務</th><th>每節點最大卷數</th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/en-us/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
</table>

<!--
## Dynamic volume limits
-->
## 動態卷限制   {#dynamic-volume-limits}

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

<!--
Dynamic volume limits are supported for following volume types.
-->
以下卷類型支持動態卷限制。

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI

<!--
For volumes managed by in-tree volume plugins, Kubernetes automatically determines the Node
type and enforces the appropriate maximum number of volumes for the node. For example:
-->
對於由樹內插件管理的卷，Kubernetes 會自動確定節點類型並確保節點上可掛接的卷數目合規。例如：

<!--
* On
<a href="https://cloud.google.com/compute/">Google Compute Engine</a>,
up to 127 volumes can be attached to a node, [depending on the node
type](https://cloud.google.com/compute/docs/disks/#pdnumberlimits).
-->
* 在 <a href="https://cloud.google.com/compute/">Google Compute Engine</a> 環境中，
  [根據節點類型](https://cloud.google.com/compute/docs/disks/#pdnumberlimits)最多可以將 127 個卷掛接到節點。

<!--
* For Amazon EBS disks on M5,C5,R5,T3 and Z1D instance types, Kubernetes allows only 25
volumes to be attached to a Node. For other instance types on
<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>,
Kubernetes allows 39 volumes to be attached to a Node.

* On Azure, up to 64 disks can be attached to a node, depending on the node type. For more details, refer to [Sizes for virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes).
-->
* 對於 M5、C5、R5、T3 和 Z1D 實例類型的 Amazon EBS 磁盤，Kubernetes 僅允許 25 個卷掛接到節點。
  對於 <a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a> 上的其他實例類型，
  Kubernetes 允許 39 個卷掛接至節點。

* 在 Azure 環境中，根據節點類型，最多 64 個磁盤可以掛接至一個節點。
  更多詳細資訊，請參閱 [Azure 虛擬機的數量大小](https://docs.microsoft.com/zh-cn/azure/virtual-machines/windows/sizes)。

<!--
* If a CSI storage driver advertises a maximum number of volumes for a Node (using `NodeGetInfo`), the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} honors that limit.
Refer to the [CSI specifications](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo) for details.

* For volumes managed by in-tree plugins that have been migrated to a CSI driver, the maximum number of volumes will be the one reported by the CSI driver.
-->
* 如果 CSI 儲存驅動（使用 `NodeGetInfo`）爲節點通告卷數上限，則
  {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} 將遵守該限制值。
  參考 [CSI 規範](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo)獲取更多詳細資訊。

* 對於由已遷移到 CSI 驅動的樹內插件管理的卷，最大卷數將是 CSI 驅動報告的卷數。

<!--
### Mutable CSI Node Allocatable Count
-->
### 可變的 CSI 節點可分配數   {#mutable-csi-node-allocatable-count}

{{< feature-state feature_gate_name="MutableCSINodeAllocatableCount" >}}

<!--
CSI drivers can dynamically adjust the maximum number of volumes that can be attached to a Node at runtime. This enhances scheduling accuracy and reduces pod scheduling failures due to changes in resource availability.

To use this feature, you must enable the `MutableCSINodeAllocatableCount` feature gate on the following components:
-->
CSI 驅動可以在運行時動態調整可以掛載到 Node 的最大卷數量。
這提高了調度準確性，並減少了由於資源可用性變化導致的 Pod 調度失敗。

要使用此特性，你必須在以下組件上啓用 `MutableCSINodeAllocatableCount`
特性門控：

- `kube-apiserver`
- `kubelet`

<!--
#### Periodic Updates

When enabled, CSI drivers can request periodic updates to their volume limits by setting the `nodeAllocatableUpdatePeriodSeconds` field in the `CSIDriver` specification. For example:
-->
#### 定期更新

當啓用時，CSI 驅動可以通過在 `CSIDriver` 規約中設置
`nodeAllocatableUpdatePeriodSeconds` 字段來請求定期更新其卷限制。
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
kubelet 將使用 `nodeAllocatableUpdatePeriodSeconds`
中指定的時間間隔，定期調用相應的 CSI 驅動的 `NodeGetInfo`
端點來刷新可掛接卷的最大數量。此字段允許的最小值爲 10 秒。

<!--
If a volume attachment operation fails with a `ResourceExhausted` error (gRPC code 8),
Kubernetes triggers an immediate update to the allocatable volume count for that Node.
Additionally, kubelet marks affected pods as Failed, allowing their controllers to
handle recreation. This prevents pods from getting stuck indefinitely in the
`ContainerCreating` state.
-->
如果卷掛載操作失敗並返回 `ResourceExhausted` 錯誤（gRPC 代碼 8），
Kubernetes 會立即觸發對此節點可分配卷數量的更新。此外，kubelet
會將受影響的 Pod 標記爲 Failed，從而使它們的控制器處理重新創建。
這防止了 Pod 無限期地停留在 `ContainerCreating` 狀態。
