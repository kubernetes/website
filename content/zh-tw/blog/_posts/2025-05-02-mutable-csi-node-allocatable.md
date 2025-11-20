---
layout: blog
title: "Kubernetes v1.33：可變的 CSI 節點可分配數"
date: 2025-05-02T10:30:00-08:00
slug: kubernetes-1-33-mutable-csi-node-allocatable-count
author: Eddie Torres (Amazon Web Services)
translator: Michael Yao (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.33: Mutable CSI Node Allocatable Count"
date: 2025-05-02T10:30:00-08:00
slug: kubernetes-1-33-mutable-csi-node-allocatable-count
author: Eddie Torres (Amazon Web Services)
-->

<!--
Scheduling stateful applications reliably depends heavily on accurate information about resource availability on nodes.
Kubernetes v1.33 introduces an alpha feature called *mutable CSI node allocatable count*, allowing Container Storage Interface (CSI) drivers to dynamically update the reported maximum number of volumes that a node can handle.
This capability significantly enhances the accuracy of pod scheduling decisions and reduces scheduling failures caused by outdated volume capacity information.
-->
可靠調度有狀態應用極度依賴於節點上資源可用性的準確資訊。  
Kubernetes v1.33 引入一個名爲**可變的 CSI 節點可分配計數**的 Alpha 特性，允許
CSI（容器儲存介面）驅動動態更新節點可以處理的最大卷數量。  
這一能力顯著提升 Pod 調度決策的準確性，並減少因卷容量資訊過時而導致的調度失敗。

<!--
## Background

Traditionally, Kubernetes CSI drivers report a static maximum volume attachment limit when initializing. However, actual attachment capacities can change during a node's lifecycle for various reasons, such as:

- Manual or external operations attaching/detaching volumes outside of Kubernetes control.
- Dynamically attached network interfaces or specialized hardware (GPUs, NICs, etc.) consuming available slots.
- Multi-driver scenarios, where one CSI driver’s operations affect available capacity reported by another.
-->

## 背景   {#background}

傳統上，Kubernetes 中的 CSI 驅動在初始化時會報告一個靜態的最大卷掛接限制。
然而，在節點生命週期內，實際的掛接容量可能會由於多種原因發生變化，例如：

- 在 Kubernetes 控制之外的手動或外部操作掛接/解除掛接卷。
- 動態掛接的網路介面或專用硬件（如 GPU、NIC 等）佔用可用的插槽。
- 在多驅動場景中，一個 CSI 驅動的操作會影響另一個驅動所報告的可用容量。

<!--
Static reporting can cause Kubernetes to schedule pods onto nodes that appear to have capacity but don't, leading to pods stuck in a `ContainerCreating` state.

## Dynamically adapting CSI volume limits

With the new feature gate `MutableCSINodeAllocatableCount`, Kubernetes enables CSI drivers to dynamically adjust and report node attachment capacities at runtime. This ensures that the scheduler has the most accurate, up-to-date view of node capacity.
-->
靜態報告可能導致 Kubernetes 將 Pod 調度到看似有容量但實際沒有的節點上，進而造成
Pod 長時間卡在 `ContainerCreating` 狀態。

## 動態適應 CSI 卷限制   {#dynamically-adapting-csi-volume-limits}

藉助新的特性門控 `MutableCSINodeAllocatableCount`，Kubernetes 允許 CSI
驅動在運行時動態調整並報告節點的掛接容量。如此確保調度器能獲取到最準確、最新的節點容量資訊。

<!--
### How it works

When this feature is enabled, Kubernetes supports two mechanisms for updating the reported node volume limits:

- **Periodic Updates:** CSI drivers specify an interval to periodically refresh the node's allocatable capacity.
- **Reactive Updates:** An immediate update triggered when a volume attachment fails due to exhausted resources (`ResourceExhausted` error).
-->
### 工作原理   {#how-it-works}

啓用此特性後，Kubernetes 支持通過以下兩種機制來更新節點卷限制的報告值：

- **週期性更新：** CSI 驅動指定一個間隔時間，來定期刷新節點的可分配容量。
- **響應式更新：** 當因資源耗盡（`ResourceExhausted` 錯誤）導致卷掛接失敗時，立即觸發更新。

<!--
### Enabling the feature

To use this alpha feature, you must enable the `MutableCSINodeAllocatableCount` feature gate in these components:
-->
### 啓用此特性   {#enabling-the-feature}

要使用此 Alpha 特性，你必須在以下組件中啓用 `MutableCSINodeAllocatableCount` 特性門控：

- `kube-apiserver`
- `kubelet`

<!--
### Example CSI driver configuration

Below is an example of configuring a CSI driver to enable periodic updates every 60 seconds:
-->
### CSI 驅動設定示例   {#example-csi-driver-configuration}

以下是設定 CSI 驅動以每 60 秒進行一次週期性更新的示例：

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: example.csi.k8s.io
spec:
  nodeAllocatableUpdatePeriodSeconds: 60
```

<!--
This configuration directs Kubelet to periodically call the CSI driver's `NodeGetInfo` method every 60 seconds, updating the node’s allocatable volume count. Kubernetes enforces a minimum update interval of 10 seconds to balance accuracy and resource usage.
-->
此設定會指示 Kubelet 每 60 秒調用一次 CSI 驅動的 `NodeGetInfo` 方法，從而更新節點的可分配卷數量。  
Kubernetes 強制要求最小更新間隔時間爲 10 秒，以平衡準確性和資源使用量。

<!--
### Immediate updates on attachment failures

In addition to periodic updates, Kubernetes now reacts to attachment failures. Specifically, if a volume attachment fails with a `ResourceExhausted` error (gRPC code `8`), an immediate update is triggered to correct the allocatable count promptly.

This proactive correction prevents repeated scheduling errors and helps maintain cluster health.
-->
### 掛接失敗時的即時更新   {#immediate-updates-on-attachment-failures}

除了週期性更新外，Kubernetes 現在也能對掛接失敗做出響應。  
具體來說，如果卷掛接由於 `ResourceExhausted` 錯誤（gRPC 錯誤碼 `8`）而失敗，將立即觸發更新，以快速糾正可分配數量。

這種主動糾正可以防止重複的調度錯誤，有助於保持叢集的健康狀態。

<!--
## Getting started

To experiment with mutable CSI node allocatable count in your Kubernetes v1.33 cluster:

1. Enable the feature gate `MutableCSINodeAllocatableCount` on the `kube-apiserver` and `kubelet` components.
2. Update your CSI driver configuration by setting `nodeAllocatableUpdatePeriodSeconds`.
3. Monitor and observe improvements in scheduling accuracy and pod placement reliability.
-->
## 快速開始    {#getting-started}

要在 Kubernetes v1.33 叢集中試用可變的 CSI 節點可分配數：

1. 在 `kube-apiserver` 和 `kubelet` 組件上啓用特性門控 `MutableCSINodeAllocatableCount`。
2. 在 CSI 驅動設定中設置 `nodeAllocatableUpdatePeriodSeconds`。
3. 監控並觀察調度準確性和 Pod 放置可靠性的提升程度。

<!--
## Next steps

This feature is currently in alpha and the Kubernetes community welcomes your feedback. Test it, share your experiences, and help guide its evolution toward beta and GA stability.

Join discussions in the [Kubernetes Storage Special Interest Group (SIG-Storage)](https://github.com/kubernetes/community/tree/master/sig-storage) to shape the future of Kubernetes storage capabilities.
-->
## 後續計劃   {#next-steps}

此特性目前處於 Alpha 階段，Kubernetes 社區歡迎你的反饋。
無論是參與測試、分享你的經驗，都有助於推動此特性向 Beta 和 GA（正式發佈）穩定版邁進。

歡迎加入 [Kubernetes SIG-Storage](https://github.com/kubernetes/community/tree/master/sig-storage)
的討論，共同塑造 Kubernetes 儲存能力的未來。
