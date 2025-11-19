---
layout: blog
title: 'Kubernetes v1.32 預覽'
date: 2024-11-08
slug: kubernetes-1-32-upcoming-changes
---
<!--
layout: blog
title: 'Kubernetes v1.32 sneak peek'
date: 2024-11-08
slug: kubernetes-1-32-upcoming-changes
author: >
  Matteo Bianchi,
  Edith Puclla,
  William Rizzo,
  Ryota Sawada,
  Rashan Smith
-->

<!--
As we get closer to the release date for Kubernetes v1.32, the project develops and matures.
Features may be deprecated, removed, or replaced with better ones for the project's overall health. 

This blog outlines some of the planned changes for the Kubernetes v1.32 release,
that the release team feels you should be aware of, for the continued maintenance
of your Kubernetes environment and keeping up to date with the latest changes.
Information listed below is based on the current status of the v1.32 release
and may change before the actual release date. 
-->
隨着 Kubernetes v1.32 發佈日期的臨近，Kubernetes 項目繼續發展和成熟。
在這個過程中，某些特性可能會被棄用、移除或被更好的特性取代，以確保項目的整體健康與發展。

本文概述了 Kubernetes v1.32 發佈的一些計劃變更，發佈團隊認爲你應該瞭解這些變更，
以確保你的 Kubernetes 環境得以持續維護並跟上最新的變化。以下信息基於 v1.32
發佈的當前狀態，實際發佈日期前可能會有所變動。

<!--
### The Kubernetes API removal and deprecation process

The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/)
for features. This policy states that stable APIs may only be deprecated when a newer,
stable version of that API is available and that APIs have a minimum lifetime for each stability level.
A deprecated API has been marked for removal in a future Kubernetes release will continue to function until
removal (at least one year from the deprecation). Its usage will result in a warning being displayed.
Removed APIs are no longer available in the current version, so you must migrate to use the replacement instead.
-->
### Kubernetes API 的移除和棄用流程

Kubernetes 項目對功能特性有一個文檔完備的[棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
該策略規定，只有當較新的、穩定的相同 API 可用時，原有的穩定 API 纔可能被棄用，每個穩定級別的 API 都有一個最短的生命週期。
棄用的 API 指的是已標記爲將在後續發行某個 Kubernetes 版本時移除的 API；
移除之前該 API 將繼續發揮作用（從棄用起至少一年時間），但使用時會顯示一條警告。
移除的 API 將在當前版本中不再可用，此時你必須遷移以使用替換的 API。

<!--
* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.

* Beta or pre-release API versions must be supported for 3 releases after the deprecation.

* Alpha or experimental API versions may be removed in any release without prior deprecation notice;
  this process can become a withdrawal in cases where a different implementation for the same feature is already in place.
-->
* 正式發佈的（GA）或穩定的 API 版本可被標記爲已棄用，但不得在 Kubernetes 主要版本未變時刪除。

* Beta 或預發佈 API 版本，必須保持在被棄用後 3 個發佈版本中仍然可用。

* Alpha 或實驗性 API 版本可以在任何版本中刪除，不必提前通知；
  如果同一特性已有不同實施方案，則此過程可能會成爲撤銷。

<!--
Whether an API is removed due to a feature graduating from beta to stable or because that API did not succeed,
all removals comply with this deprecation policy. Whenever an API is removed,
migration options are communicated in the [deprecation guide](/docs/reference/using-api/deprecation-guide/).
-->
無論 API 是因爲特性從 Beta 升級到穩定狀態還是因爲未能成功而被移除，
所有移除操作都遵守此棄用策略。每當 API 被移除時，
遷移選項都會在[棄用指南](/zh-cn/docs/reference/using-api/deprecation-guide/)中進行說明。

<!--
## Note on the withdrawal of the old DRA implementation

The enhancement [#3063](https://github.com/kubernetes/enhancements/issues/3063)
introduced Dynamic Resource Allocation (DRA) in Kubernetes 1.26.
-->
## 關於撤回 DRA 的舊的實現的說明

增強特性 [#3063](https://github.com/kubernetes/enhancements/issues/3063) 在 Kubernetes 1.26
中引入了動態資源分配（DRA）。

<!--
However, in Kubernetes v1.32, this approach to DRA will be significantly changed.
Code related to the original implementation will be removed, leaving KEP
[#4381](https://github.com/kubernetes/enhancements/issues/4381) as the "new" base functionality. 
-->
然而，在 Kubernetes v1.32 中，這種 DRA 的實現方法將發生重大變化。與原來實現相關的代碼將被刪除，
只留下 KEP [#4381](https://github.com/kubernetes/enhancements/issues/4381) 作爲"新"的基礎特性。

<!--
The decision to change the existing approach originated from its incompatibility with cluster autoscaling
as resource availability was non-transparent, complicating decision-making for both Cluster Autoscaler and controllers. 
The newly added Structured Parameter model substitutes the functionality.
-->
改變現有方法的決定源於其與叢集自動伸縮的不兼容性，因爲資源可用性是不透明的，
這使得 Cluster Autoscaler 和控制器的決策變得複雜。
新增的結構化參數模型替換了原有特性。

<!--
This removal will allow Kubernetes to handle new hardware requirements and resource claims more predictably,
bypassing the complexities of back and forth API calls to the kube-apiserver.

Please also see the enhancement issue [#3063](https://github.com/kubernetes/enhancements/issues/3063) to find out more.
-->
這次移除將使 Kubernetes 能夠更可預測地處理新的硬件需求和資源聲明，
避免了與 kube-apiserver 之間複雜的來回 API 調用。

請參閱增強問題 [#3063](https://github.com/kubernetes/enhancements/issues/3063) 以瞭解更多信息。

<!--
## API removal

There is only a single API removal planned for [Kubernetes v1.32](/docs/reference/using-api/deprecation-guide/#v1-32):
-->
## API 移除

在 [Kubernetes v1.32](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-32) 中，計劃僅移除一個 API：

<!--
* The `flowcontrol.apiserver.k8s.io/v1beta3` API version of FlowSchema and PriorityLevelConfiguration has been removed. 
  To prepare for this, you can edit your existing manifests and rewrite client software to use the
  `flowcontrol.apiserver.k8s.io/v1 API` version, available since v1.29. 
  All existing persisted objects are accessible via the new API. Notable changes in `flowcontrol.apiserver.k8s.io/v1beta3`
  include that the PriorityLevelConfiguration `spec.limited.nominalConcurrencyShares` field only defaults to 30 when unspecified,
  and an explicit value of 0 is not changed to 30.

For more information, please refer to the [API deprecation guide](/docs/reference/using-api/deprecation-guide/#v1-32).
-->
* `flowcontrol.apiserver.k8s.io/v1beta3` 版本的 FlowSchema 和 PriorityLevelConfiguration 已被移除。
  爲了對此做好準備，你可以編輯現有的清單文件並重寫客戶端軟件，使用自 v1.29 起可用的 `flowcontrol.apiserver.k8s.io/v1` API 版本。
  所有現有的持久化對象都可以通過新 API 訪問。`flowcontrol.apiserver.k8s.io/v1beta3` 中的重要變化包括：
  當未指定時，PriorityLevelConfiguration 的 `spec.limited.nominalConcurrencyShares`
  字段僅默認爲 30，而顯式設置的 0 值不會被更改爲此默認值。

  有關更多信息，請參閱 [API 棄用指南](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-32)。

<!--
## Sneak peek of Kubernetes v1.32

The following list of enhancements is likely to be included in the v1.32 release.
This is not a commitment and the release content is subject to change.
-->
## Kubernetes v1.32 的搶先預覽

以下增強特性有可能會被包含在 v1.32 發佈版本中。請注意，這並不是最終承諾，發佈內容可能會發生變化。

<!--
### Even more DRA enhancements!

In this release, like the previous one, the Kubernetes project continues proposing a number
of enhancements to the Dynamic Resource Allocation (DRA), a key component of the Kubernetes resource management system.
These enhancements aim to improve the flexibility and efficiency of resource allocation for workloads that require specialized hardware,
such as GPUs, FPGAs and network adapters. This release introduces improvements,
including the addition of resource health status in the Pod status, as outlined in
KEP [#4680](https://github.com/kubernetes/enhancements/issues/4680).
-->
### 更多 DRA 增強特性！

在此次發佈中，就像上一次一樣，Kubernetes 項目繼續提出多項對動態資源分配（DRA）的增強。
DRA 是 Kubernetes 資源管理系統的關鍵組件，這些增強旨在提高對需要專用硬件（如 GPU、FPGA 和網路適配器）
的工作負載進行資源分配的靈活性和效率。此次發佈引入了多項改進，包括在 Pod 狀態中添加資源健康狀態，
具體內容詳見 KEP [#4680](https://github.com/kubernetes/enhancements/issues/4680)。

<!--
#### Add resource health status to the Pod status

It isn't easy to know when a Pod uses a device that has failed or is temporarily unhealthy.
KEP [#4680](https://github.com/kubernetes/enhancements/issues/4680) proposes exposing device
health via Pod `status`, making troubleshooting of Pod crashes easier.
-->
#### 在 Pod 狀態中添加資源健康狀態

當 Pod 使用的設備出現故障或暫時不健康時，很難及時發現。
KEP [#4680](https://github.com/kubernetes/enhancements/issues/4680)
提議通過 Pod 的 `status` 暴露設備健康狀態，從而使 Pod 崩潰的故障排除更加容易。

<!--
### Windows strikes back!

KEP [#4802](https://github.com/kubernetes/enhancements/issues/4802) adds support
for graceful shutdowns of Windows nodes in Kubernetes clusters.
Before this release, Kubernetes provided graceful node shutdown functionality for
Linux nodes but lacked equivalent support for Windows.
This enhancement enables the kubelet on Windows nodes to handle system shutdown events properly.
Doing so, it ensures that Pods running on Windows nodes are gracefully terminated,
allowing workloads to be rescheduled without disruption.
This improvement enhances the reliability and stability of clusters that include Windows nodes,
especially during a planned maintenance or any system updates.
-->
### Windows 工作繼續

KEP [#4802](https://github.com/kubernetes/enhancements/issues/4802) 爲
Kubernetes 叢集中的 Windows 節點添加了體面關機支持。
在此之前，Kubernetes 爲 Linux 節點提供了體面關機特性，但缺乏對 Windows 節點的同等支持。
這一增強特性使 Windows 節點上的 kubelet 能夠正確處理系統關機事件，確保在 Windows 節點上運行的 Pod 能夠體面終止，
從而允許工作負載在不受干擾的情況下重新調度。這一改進提高了包含 Windows 節點的叢集的可靠性和穩定性，
特別是在計劃維護或系統更新期間。

<!--
### Allow special characters in environment variables

With the graduation of this [enhancement](https://github.com/kubernetes/enhancements/issues/4369) to beta,
Kubernetes now allows almost all printable ASCII characters (excluding "=") to be used as environment variable names.
This change addresses the limitations previously imposed on variable naming, facilitating a broader adoption of
Kubernetes by accommodating various application needs. The relaxed validation will be enabled by default via the
`RelaxedEnvironmentVariableValidation` feature gate, ensuring that users can easily utilize environment
variables without strict constraints, enhancing flexibility for developers working with applications like
.NET Core that require special characters in their configurations.
-->
### 允許環境變量中使用特殊字符

隨着這一[增強特性](https://github.com/kubernetes/enhancements/issues/4369)升級到 Beta 階段，
Kubernetes 現在允許幾乎所有的可打印 ASCII 字符（不包括 `=`）作爲環境變量名稱。
這一變化解決了此前對變量命名的限制，通過適應各種應用需求，促進了 Kubernetes 的更廣泛採用。
放寬的驗證將通過 `RelaxedEnvironmentVariableValidation` 特性門控默認啓用，
確保使用者可以輕鬆使用環境變量而不受嚴格限制，增強了開發者在處理需要特殊字符設定的應用（如 .NET Core）時的靈活性。

<!--
### Make Kubernetes aware of the LoadBalancer behavior

KEP [#1860](https://github.com/kubernetes/enhancements/issues/1860) graduates to GA,
introducing the `ipMode` field for a Service of `type: LoadBalancer`, which can be set to either
`"VIP"` or `"Proxy"`. This enhancement is aimed at improving how cloud providers load balancers
interact with kube-proxy and it is a change transparent to the end user.
The existing behavior of kube-proxy is preserved when using `"VIP"`, where kube-proxy handles the load balancing.
Using `"Proxy"` results in traffic sent directly to the load balancer,
providing cloud providers greater control over relying on kube-proxy;
this means that you could see an improvement in the performance of your load balancer for some cloud providers.
-->
### 使 Kubernetes 感知到 LoadBalancer 的行爲

KEP [#1860](https://github.com/kubernetes/enhancements/issues/1860) 升級到 GA 階段，
爲 `type: LoadBalancer` 類型的 Service 引入了 `ipMode` 字段，該字段可以設置爲 `"VIP"` 或 `"Proxy"`。
這一增強旨在改善雲提供商負載均衡器與 kube-proxy 的交互方式，對最終使用者來說是透明的。
使用 `"VIP"` 時，kube-proxy 會繼續處理負載均衡，保持現有的行爲。使用 `"Proxy"` 時，
流量將直接發送到負載均衡器，提供雲提供商對依賴 kube-proxy 的更大控制權；
這意味着對於某些雲提供商，你可能會看到負載均衡器性能的提升。

<!--
### Retry generate name for resources

This [enhancement](https://github.com/kubernetes/enhancements/issues/4420)
improves how name conflicts are handled for Kubernetes resources created with the `generateName` field.
Previously, if a name conflict occurred, the API server returned a 409 HTTP Conflict error and clients
had to manually retry the request. With this update, the API server automatically retries generating
a new name up to seven times in case of a conflict. This significantly reduces the chances of collision,
ensuring smooth generation of up to 1 million names with less than a 0.1% probability of a conflict,
providing more resilience for large-scale workloads.
-->
### 爲資源生成名稱時重試

這一[增強特性](https://github.com/kubernetes/enhancements/issues/4420)改進了使用
`generateName` 字段創建 Kubernetes 資源時的名稱衝突處理。此前，如果發生名稱衝突，
API 伺服器會返回 409 HTTP 衝突錯誤，客戶端需要手動重試請求。通過此次更新，
API 伺服器在發生衝突時會自動重試生成新名稱，最多重試七次。這顯著降低了衝突的可能性，
確保生成多達 100 萬個名稱時衝突的概率低於 0.1%，爲大規模工作負載提供了更高的彈性。

<!--
## Want to know more?
New features and deprecations are also announced in the Kubernetes release notes.
We will formally announce what's new in
[Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)
as part of the CHANGELOG for this release.

You can see the announcements of changes in the release notes for:
-->
## 想了解更多？

新特性和棄用特性也會在 Kubernetes 發佈說明中宣佈。我們將在此次發佈的
[Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)
的 CHANGELOG 中正式宣佈新內容。

你可以在以下版本的發佈說明中查看變更公告：

* [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)

* [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md)

* [Kubernetes v1.29](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md)

* [Kubernetes v1.28](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.28.md)
