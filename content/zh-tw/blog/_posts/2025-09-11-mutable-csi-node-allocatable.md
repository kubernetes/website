---
layout: blog
title: "Kubernetes v1.34：可變 CSI 節點可分配數進階至 Beta"
date: 2025-09-11T10:30:00-08:00
slug: kubernetes-v1-34-mutable-csi-node-allocatable-count
author: Eddie Torres (Amazon Web Services)
translator: Michael Yao (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.34: Mutable CSI Node Allocatable Graduates to Beta"
date: 2025-09-11T10:30:00-08:00
slug: kubernetes-v1-34-mutable-csi-node-allocatable-count
author: Eddie Torres (Amazon Web Services)
-->

<!--
The [functionality for CSI drivers to update information about attachable volume count on the nodes](https://kep.k8s.io/4876), first introduced as Alpha in Kubernetes v1.33, has graduated to **Beta** in the Kubernetes v1.34 release! This marks a significant milestone in enhancing the accuracy of stateful pod scheduling by reducing failures due to outdated attachable volume capacity information.
-->
[CSI 驅動更新節點上可掛接卷數量信息的這一功能](https://kep.k8s.io/4876)在 Kubernetes v1.33
中首次以 Alpha 引入，如今在 Kubernetes v1.34 中進階爲 **Beta**！
這是提升有狀態 Pod 調度準確性的重要里程碑，可減少因可掛接卷容量信息過時所導致的調度失敗問題。

<!--
## Background

Traditionally, Kubernetes [CSI drivers](https://kubernetes-csi.github.io/docs/introduction.html) report a static maximum volume attachment limit when initializing. However, actual attachment capacities can change during a node's lifecycle for various reasons, such as:
-->
## 背景 {#background}

傳統上，Kubernetes 的
[CSI 驅動](https://kubernetes-csi.github.io/docs/introduction.html)在初始化時會報告一個靜態的最大卷掛接限制。
然而，在節點的生命週期中，實際的掛接數量可能因各種原因發生變化，例如：

<!--
- Manual or external operations attaching/detaching volumes outside of Kubernetes control.
- Dynamically attached network interfaces or specialized hardware (GPUs, NICs, etc.) consuming available slots.
- Multi-driver scenarios, where one CSI driver’s operations affect available capacity reported by another.

Static reporting can cause Kubernetes to schedule pods onto nodes that appear to have capacity but don't, leading to pods stuck in a `ContainerCreating` state.
-->
- 在 Kubernetes 控制之外的手動或外部卷掛接/解除掛接操作。
- 動態掛接的網絡接口或專用硬件（GPU、NIC 等）消耗可用的插槽。
- 在多驅動場景中，一個 CSI 驅動的操作影響另一個驅動所報告的可用容量。

靜態報告可能導致 Kubernetes 將 Pod 調度到看似有容量但實際上沒有容量的節點上，
從而導致 Pod 卡在 `ContainerCreating` 狀態。

<!--
## Dynamically adapting CSI volume limits

With this new feature, Kubernetes enables CSI drivers to dynamically adjust and report node attachment capacities at runtime. This ensures that the scheduler, as well as other components relying on this information, have the most accurate, up-to-date view of node capacity.
-->
## 動態調整 CSI 卷限制 {#dynamically-adapting-csi-volume-limits}

藉助這一新特性，Kubernetes 允許 CSI 驅動在運行時動態調整並報告節點的卷掛接數量。
這一特性可確保調度器以及依賴此信息的其他組件能夠獲得最準確、最新的節點容量信息。

<!--
### How it works

Kubernetes supports two mechanisms for updating the reported node volume limits:

- **Periodic Updates:** CSI drivers specify an interval to periodically refresh the node's allocatable capacity.
- **Reactive Updates:** An immediate update triggered when a volume attachment fails due to exhausted resources (`ResourceExhausted` error).
-->
### 工作原理 {#how-it-works}

Kubernetes 支持兩種機制來更新所報告的節點卷限制：

- **週期性更新：** CSI 驅動指定一個時間間隔，定期刷新節點的可分配容量。
- **觸發式更新：** 當卷掛接因資源耗盡（`ResourceExhausted` 錯誤）而失敗時觸發立即更新。

<!--
### Enabling the feature

To use this beta feature, the `MutableCSINodeAllocatableCount` feature gate must be enabled in these components:
-->
### 啓用特性 {#enabling-the-feature}

要使用此 Beta 特性，必須在以下組件中啓用 `MutableCSINodeAllocatableCount` 特性門控：

- `kube-apiserver`
- `kubelet`

<!--
### Example CSI driver configuration

Below is an example of configuring a CSI driver to enable periodic updates every 60 seconds:
-->
### 示例 CSI 驅動配置

以下是配置 CSI 驅動以啓用每 60 秒週期性更新一次的示例：

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: example.csi.k8s.io
spec:
  nodeAllocatableUpdatePeriodSeconds: 60
```

<!--
This configuration directs kubelet to periodically call the CSI driver's `NodeGetInfo` method every 60 seconds, updating the node’s allocatable volume count. Kubernetes enforces a minimum update interval of 10 seconds to balance accuracy and resource usage.

### Immediate updates on attachment failures

When a volume attachment operation fails due to a `ResourceExhausted` error (gRPC code `8`), Kubernetes immediately updates the allocatable count instead of waiting for the next periodic update. The Kubelet then marks the affected pods as Failed, enabling their controllers to recreate them. This prevents pods from getting permanently stuck in the `ContainerCreating` state.
-->
此配置指示 kubelet 每隔 60 秒調用一次 CSI 驅動的 `NodeGetInfo` 方法，以更新節點的可分配卷數。
Kubernetes 強制要求更新時間間隔最小爲 10 秒，目的是在準確性與資源消耗間達成平衡。

### 掛接失敗時立即更新

當卷掛接操作因 `ResourceExhausted` 錯誤（gRPC 代碼 `8`）而失敗時，Kubernetes 會立即更新可分配數量，
而不是等待下一次週期性更新。隨後 kubelet 會將受影響的 Pod 標記爲 Failed，使其控制器能夠重新創建這些 Pod。
這樣可以防止 Pod 永久卡在 `ContainerCreating` 狀態。

<!--
## Getting started

To enable this feature in your Kubernetes v1.34 cluster:

1. Enable the feature gate `MutableCSINodeAllocatableCount` on the `kube-apiserver` and `kubelet` components.
2. Update your CSI driver configuration by setting `nodeAllocatableUpdatePeriodSeconds`.
3. Monitor and observe improvements in scheduling accuracy and pod placement reliability.
-->
## 快速入門 {#getting-started}

要在 Kubernetes v1.34 集羣中啓用此特性：

1. 在 `kube-apiserver` 和 `kubelet` 組件上啓用特性門控 `MutableCSINodeAllocatableCount`。
2. 通過設置 `nodeAllocatableUpdatePeriodSeconds`，更新你的 CSI 驅動配置。
3. 監控並觀察調度準確性和 Pod 調度可靠性的提升。

<!--
## Next steps

This feature is currently in beta and the Kubernetes community welcomes your feedback. Test it, share your experiences, and help guide its evolution to GA stability.

Join discussions in the [Kubernetes Storage Special Interest Group (SIG-Storage)](https://github.com/kubernetes/community/tree/master/sig-storage) to shape the future of Kubernetes storage capabilities.
-->
## 下一步 {#next-steps}

此特性目前處於 Beta，Kubernetes 社區歡迎你的反饋。請測試、分享你的經驗，並幫助推動其發展至 GA（正式發佈）穩定版。

歡迎加入 [Kubernetes SIG-Storage](https://github.com/kubernetes/community/tree/master/sig-storage)
參與討論，共同塑造 Kubernetes 存儲能力的未來。
