---
layout: blog
title: "Kubernetes 1.33：卷填充器進階至 GA"
date: 2025-05-08T10:30:00-08:00
slug: kubernetes-v1-33-volume-populators-ga
author: >
  Danna Wang (Google)
  Sunny Song (Google)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes 1.33: Volume Populators Graduate to GA"
date: 2025-05-08T10:30:00-08:00
slug: kubernetes-v1-33-volume-populators-ga
author: >
  Danna Wang (Google)
  Sunny Song (Google)
-->

<!--
Kubernetes _volume populators_ are now  generally available (GA)! The `AnyVolumeDataSource` feature
gate is treated as always enabled for Kubernetes v1.33, which means that users can specify any appropriate
[custom resource](/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources)
as the data source of a PersistentVolumeClaim (PVC).

An example of how to use dataSourceRef in PVC:
-->
Kubernetes 的**卷填充器**現已進階至 GA（正式發佈）！
`AnyVolumeDataSource` 特性門控在 Kubernetes v1.33 中設爲始終啓用，
這意味着使用者可以將任何合適的[自定義資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources)作爲
PersistentVolumeClaim（PVC）的數據源。

以下是如何在 PVC 中使用 dataSourceRef 的示例：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc1
spec:
  ...
  dataSourceRef:
    apiGroup: provider.example.com
    kind: Provider
    name: provider1
```

<!--
## What is new

There are four major enhancements from beta.

### Populator Pod is optional

During the beta phase, contributors to Kubernetes identified potential resource leaks with PersistentVolumeClaim (PVC) deletion while volume population was in progress; these leaks happened due to limitations in finalizer handling.
Ahead of the graduation to general availability, the Kubernetes project added support to delete temporary resources (PVC prime, etc.) if the original PVC is deleted.
-->
## 新變化   {#what-is-new}

從 Beta 進階到 GA 後，主要有四個增強。

### 填充器 Pod 成爲可選   {#populator-pod-is-optional}

在 Beta 階段，Kubernetes 的貢獻者們發現當正在進行卷填充時刪除
PersistentVolumeClaim（PVC）可能導致資源泄露問題，這些泄漏是由於 Finalizer 處理機制的侷限性所致。
在進階至 GA 之前，Kubernetes 項目增加了在原始 PVC 被刪除時對刪除臨時資源（PVC 派生體等）的支持。

<!--
To accommodate this, we've introduced three new plugin-based functions:
* `PopulateFn()`: Executes the provider-specific data population logic.
* `PopulateCompleteFn()`: Checks if the data population operation has finished successfully.
* `PopulateCleanupFn()`: Cleans up temporary resources created by the provider-specific functions after data population is completed

A provider example is added in [lib-volume-populator/example](https://github.com/kubernetes-csi/lib-volume-populator/tree/master/example).
-->
爲支持此能力，我們引入了三個基於插件的新函數：

* `PopulateFn()`：執行特定於提供程序的數據填充邏輯。
* `PopulateCompleteFn()`：檢查數據填充操作是否成功完成。
* `PopulateCleanupFn()`：在數據填充完成後，清理由提供程序特定函數創建的臨時資源。

有關提供程序的例子，參見
[lib-volume-populator/example](https://github.com/kubernetes-csi/lib-volume-populator/tree/master/example)。

<!--
### Mutator functions to modify the Kubernetes resources

For GA, the CSI volume populator controller code gained a `MutatorConfig`, allowing the specification of mutator functions to modify Kubernetes resources.
For example, if the PVC prime is not an exact copy of the PVC and you need provider-specific information for the driver, you can include this information in the optional `MutatorConfig`. 
This allows you to customize the Kubernetes objects in the volume populator.
-->
### 支持修改 Kubernetes 資源的 Mutator 函數

在 GA 版本中，CSI 卷填充器控制器代碼新增了 `MutatorConfig`，允許指定 Mutator 函數用於修改 Kubernetes 資源。
例如，如果 PVC 派生體不是 PVC 的完美副本，並且你需要爲驅動提供一些特定於提供程序的信息，
你可以通過可選的 `MutatorConfig` 將這些信息加入。這使你能夠自定義卷填充器中的 Kubernetes 對象。

<!--
### Flexible metric handling for providers

Our beta phase highlighted a new requirement: the need to aggregate metrics not just from lib-volume-populator, but also from other components within the provider's codebase.
-->
### 靈活處理提供程序的指標

在 Beta 階段，我們發現一個新需求：不僅需要從 lib-volume-populator
聚合指標，還要能夠從提供程序代碼庫中的其他組件聚合指標。

<!--
To address this, SIG Storage introduced a [provider metric manager](https://github.com/kubernetes-csi/lib-volume-populator/blob/8a922a5302fdba13a6c27328ee50e5396940214b/populator-machinery/controller.go#L122).
This enhancement delegates the implementation of metrics logic to the provider itself, rather than relying solely on lib-volume-populator.
This shift provides greater flexibility and control over metrics collection and aggregation, enabling a more comprehensive view of provider performance.
-->
爲此，SIG Storage 引入了一個[提供程序指標管理器](https://github.com/kubernetes-csi/lib-volume-populator/blob/8a922a5302fdba13a6c27328ee50e5396940214b/populator-machinery/controller.go#L122)。
此增強特性將指標邏輯的實現委託給提供程序自身，而不再僅僅依賴於 lib-volume-populator。
這種轉變使指標收集與聚合更靈活、更好控制，有助於更好地觀察提供程序的總體性能。

<!--
### Clean up for temporary resources

During the beta phase, we identified potential resource leaks with PersistentVolumeClaim (PVC) deletion while volume population was in progress, due to limitations in finalizer handling. We have improved the populator to support the deletion of temporary resources (PVC prime, etc.) if the original PVC is deleted in this GA release.
-->
### 清理臨時資源

在 Beta 階段，我們發現當卷填充過程尚未完成時刪除 PVC 會導致資源泄露問題，這是由於
Finalizer 的侷限性引起的。在 GA 版本中，我們改善了填充器特性，在原始 PVC 被刪除時支持刪除臨時資源（如 PVC 派生體等）。

<!--
## How to use it

To try it out, please follow the [steps](/blog/2022/05/16/volume-populators-beta/#trying-it-out) in the previous beta blog.

## Future directions and potential feature requests

For next step, there are several potential feature requests for volume populator:
-->
## 如何使用   {#how-to-use-it}

如需試用，請參考之前 Beta 版本博客中的[操作步驟](/zh-cn/blog/2022/05/16/volume-populators-beta/#trying-it-out)。

## 後續方向與潛在特性請求   {#future-directions-and-potential-feature-requests}

下一階段，卷填充器可能會引入以下特性請求：

<!--
* Multi sync: the current implementation is a one-time unidirectional sync from source to destination. This can be extended to support multiple syncs, enabling periodic syncs or allowing users to sync on demand
* Bidirectional sync: an extension of multi sync above, but making it bidirectional between source and destination
* Populate data with priorities: with a list of different dataSourceRef, populate based on priorities
* Populate data from multiple sources of the same provider: populate multiple different sources to one destination
* Populate data from multiple sources of the different providers: populate multiple different sources to one destination, pipelining different resources’ population
-->
* 多次同步：當前實現是從源到目的地的一次性單向同步，可以擴展爲支持週期性同步或允許使用者按需同步。
* 雙向同步：多次同步的擴展版本，實現源與目的地之間的雙向同步。
* 基於優先級的數據填充：提供多個 dataSourceRef，並按優先級進行數據填充。
* 從同一提供程序的多個源填充數據：將多個不同源填充到同一個目的地。
* 從不同提供程序的多個源填充數據：將多個不同源填充到一個目的地，支持流水線式的不同資源的填充。

<!--
To ensure we're building something truly valuable, Kubernetes SIG Storage would love to hear about any specific use cases you have in mind for this feature.
For any inquiries or specific questions related to volume populator, please reach out to the [SIG Storage community](https://github.com/kubernetes/community/tree/master/sig-storage).
-->
爲了確保我們構建的特性真正有價值，Kubernetes SIG Storage 非常希望瞭解你所知道的與此特性有關的任何具體使用場景。
如有任何關於卷填充器的疑問或特定問題，請聯繫
[SIG Storage 社區](https://github.com/kubernetes/community/tree/master/sig-storage)。
