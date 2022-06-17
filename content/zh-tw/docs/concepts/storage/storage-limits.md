---
title: 特定於節點的卷數限制
content_type: concept
---

<!-- ---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Node-specific Volume Limits
content_type: concept
---
 -->

<!-- overview -->

<!-- 
This page describes the maximum number of volumes that can be attached
to a Node for various cloud providers. 
-->
此頁面描述了各個雲供應商可關聯至一個節點的最大卷數。

<!-- 
Cloud providers like Google, Amazon, and Microsoft typically have a limit on
how many volumes can be attached to a Node. It is important for Kubernetes to
respect those limits. Otherwise, Pods scheduled on a Node could get stuck
waiting for volumes to attach. 
-->
谷歌、亞馬遜和微軟等雲供應商通常對可以關聯到節點的卷數量進行限制。
Kubernetes 需要尊重這些限制。 否則，在節點上排程的 Pod 可能會卡住去等待卷的關聯。

<!-- body -->

<!--
## Kubernetes default limits

The Kubernetes scheduler has default limits on the number of volumes
that can be attached to a Node:
-->
## Kubernetes 的預設限制

The Kubernetes 排程器對關聯於一個節點的卷數有預設限制：
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
## 自定義限制

你可以透過設定 `KUBE_MAX_PD_VOLS` 環境變數的值來設定這些限制，然後再啟動排程器。
CSI 驅動程式可能具有不同的過程，關於如何自定義其限制請參閱相關文件。

如果設定的限制高於預設限制，請謹慎使用。請參閱雲提供商的文件以確保節點可支援你設定的限制。

此限制應用於整個叢集，所以它會影響所有節點。

<!--
## Dynamic volume limits
-->
## 動態卷限制

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

<!--
Dynamic volume limits are supported for following volume types.

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI
-->
以下卷型別支援動態卷限制。

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI

<!--
For volumes managed by in-tree volume plugins, Kubernetes automatically determines the Node
type and enforces the appropriate maximum number of volumes for the node. For example:
-->
對於由內建外掛管理的卷，Kubernetes 會自動確定節點型別並確保節點上可關聯的卷數目合規。 例如：

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

* If a CSI storage driver advertises a maximum number of volumes for a Node (using `NodeGetInfo`), the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} honors that limit.
Refer to the [CSI specifications](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo) for details.

* For volumes managed by in-tree plugins that have been migrated to a CSI driver, the maximum number of volumes will be the one reported by the CSI driver.
-->
* 在
<a href="https://cloud.google.com/compute/">Google Compute Engine</a>環境中,
[根據節點型別](https://cloud.google.com/compute/docs/disks/#pdnumberlimits)最多可以將127個卷關聯到節點。

* 對於 M5、C5、R5、T3 和 Z1D 型別例項的 Amazon EBS 磁碟，Kubernetes 僅允許 25 個卷關聯到節點。
對於 ec2 上的其他例項型別
<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>,
Kubernetes 允許 39 個卷關聯至節點。

* 在 Azure 環境中, 根據節點型別，最多 64 個磁碟可以關聯至一個節點。
更多詳細資訊，請參閱[Azure 虛擬機器的數量大小](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes)。

* 如果 CSI 儲存驅動程式（使用 `NodeGetInfo` ）為節點通告卷數上限，則 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} 將遵守該限制值。
參考 [CSI 規範](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo) 獲取更多詳細資訊。

* 對於由已遷移到 CSI 驅動程式的樹內外掛管理的卷，最大卷數將是 CSI 驅動程式報告的卷數。


