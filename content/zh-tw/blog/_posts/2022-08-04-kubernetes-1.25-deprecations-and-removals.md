---
layout: blog
title: "Kubernetes 1.25 的移除說明和主要變更"
date: 2022-08-04
slug: upcoming-changes-in-kubernetes-1-25
---
<!-- 
layout: blog
title: "Kubernetes Removals and Major Changes In 1.25"
date: 2022-08-04
slug: upcoming-changes-in-kubernetes-1-25
-->

<!--
**Authors**: Kat Cosgrove, Frederico Muñoz, Debabrata Panigrahi
-->
**作者**：Kat Cosgrove、Frederico Muñoz、Debabrata Panigrahi

<!--
As Kubernetes grows and matures, features may be deprecated, removed, or replaced with improvements
for the health of the project. Kubernetes v1.25 includes several major changes and one major removal.
-->
隨着 Kubernetes 成長和日趨成熟，爲了此項目的健康發展，某些功能特性可能會被棄用、移除或替換爲優化過的功能特性。
Kubernetes v1.25 包括幾個主要變更和一個主要移除。

<!--
## The Kubernetes API Removal and Deprecation process

The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API is one that has been marked for removal in a future Kubernetes release; it will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.
-->
## Kubernetes API 移除和棄用流程 {#the-kubernetes-api-removal-and-deprecation-process}

Kubernetes 項目對功能特性有一個文檔完備的[棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
該策略規定，只有當較新的、穩定的相同 API 可用時，原有的穩定 API 纔可能被棄用，每個穩定級別的 API 都有一個最短的生命週期。
棄用的 API 指的是已標記爲將在後續發行某個 Kubernetes 版本時移除的 API；
移除之前該 API 將繼續發揮作用（從棄用起至少一年時間），但使用時會顯示一條警告。
移除的 API 將在當前版本中不再可用，此時你必須遷移以使用替換的 API。

<!--
* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes. 
* Beta or pre-release API versions must be supported for 3 releases after deprecation. 
* Alpha or experimental API versions may be removed in any release without prior deprecation notice.
-->
* 正式發佈（GA）或穩定的 API 版本可能被標記爲已棄用，但只有在 Kubernetes 大版本更新時纔會移除。
* 測試版（Beta）或預發佈 API 版本在棄用後必須支持 3 個版本。
* Alpha 或實驗性 API 版本可能會在任何版本中被移除，恕不另行通知。

<!--
Whether an API is removed as a result of a feature graduating from beta to stable or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the documentation.
-->
無論一個 API 是因爲某功能特性從 Beta 進入穩定階段而被移除，還是因爲該 API 根本沒有成功，
所有移除均遵從上述棄用策略。無論何時移除一個 API，文檔中都會列出遷移選項。

<!--
## A Note About PodSecurityPolicy

In Kubernetes v1.25, we will be removing PodSecurityPolicy [after its deprecation in v1.21](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/). PodSecurityPolicy has served us honorably, but its complex and often confusing usage necessitated changes, which unfortunately would have been breaking changes. To address this, it is being removed in favor of a replacement, Pod Security Admission, which is graduating to stable in this release as well. If you are currently relying on PodSecurityPolicy, follow the instructions for [migration to Pod Security Admission](/docs/tasks/configure-pod-container/migrate-from-psp/).
-->
## 有關 PodSecurityPolicy 的說明 {#a-note-about-podsecuritypolicy}

[繼 PodSecurityPolicy 在 v1.21 棄用後](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)，
Kubernetes v1.25 將移除 PodSecurityPolicy。PodSecurityPolicy 曾光榮地爲我們服務，
但由於其複雜和經常令人困惑的使用方式，讓大家覺得有必要進行修改，但很遺憾這種修改將會是破壞性的。
爲此我們移除了 PodSecurityPolicy，取而代之的是 Pod Security Admission（即 PodSecurity 安全准入控制器），
後者在本次發行中也進入了穩定階段。
如果你目前正依賴 PodSecurityPolicy，請遵循指示說明[遷移到 PodSecurity 准入控制器](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)。

<!--
## Major Changes for Kubernetes v1.25

Kubernetes v1.25 will include several major changes, in addition to the removal of PodSecurityPolicy.

### [CSI Migration](https://github.com/kubernetes/enhancements/issues/625)

The effort to  move the in-tree volume plugins to out-of-tree CSI drivers continues, with the core CSI Migration feature going GA in v1.25. This is an important step towards removing the in-tree volume plugins entirely.
-->
## Kubernetes v1.25 的主要變更 {#major-changes-for-kubernetes-v1.25}

Kubernetes v1.25 除了移除 PodSecurityPolicy 之外，還將包括以下幾個主要變更。

### [CSI Migration](https://github.com/kubernetes/enhancements/issues/625)

將樹內卷插件遷移到樹外 CSI 驅動的努力還在繼續，核心的 CSI Migration 特性在 v1.25 進入 GA 階段。
對於全面移除樹內卷插件而言，這是重要的一步。

<!--
### Deprecations and removals for storage drivers

Several volume plugins are being deprecated or removed.

[GlusterFS will be deprecated in v1.25](https://github.com/kubernetes/enhancements/issues/3446). While a CSI driver was built for it, it has not been maintained. The possibility of migration to a compatible CSI driver [was discussed](https://github.com/kubernetes/kubernetes/issues/100897), but a decision was ultimately made to begin the deprecation of the GlusterFS plugin from in-tree drivers. The [Portworx in-tree volume plugin](https://github.com/kubernetes/enhancements/issues/2589) is also being deprecated with this release. The Flocker, Quobyte, and StorageOS in-tree volume plugins are being removed.
-->
### 存儲驅動的棄用和移除 {#deprecations-and-removals-for-storage-drivers}

若干卷插件將被棄用或移除。

[GlusterFS 將在 v1.25](https://github.com/kubernetes/enhancements/issues/3446) 中被棄用。
雖然爲其構建了 CSI 驅動，但未曾得到維護。
社區[曾討論](https://github.com/kubernetes/kubernetes/issues/100897)遷移到一個兼容 CSI 驅動的可能性，
但最終決定開始從樹內驅動中棄用 GlusterFS 插件。
本次發行還會棄用 [Portworx 樹內卷插件](https://github.com/kubernetes/enhancements/issues/2589)。
Flocker、Quobyte 和 StorageOS 樹內卷插件將被移除。

<!--
[Flocker](https://github.com/kubernetes/kubernetes/pull/111618), [Quobyte](https://github.com/kubernetes/kubernetes/pull/111619), and [StorageOS](https://github.com/kubernetes/kubernetes/pull/111620) in-tree volume plugins will be removed in v1.25 as part of the [CSI Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration).
-->
[Flocker](https://github.com/kubernetes/kubernetes/pull/111618)、
[Quobyte](https://github.com/kubernetes/kubernetes/pull/111619) 和
[StorageOS](https://github.com/kubernetes/kubernetes/pull/111620) 樹內卷插件將作爲
[CSI Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration)
的一部分在 v1.25 中移除。

<!--
### [Change to vSphere version support](https://github.com/kubernetes/kubernetes/pull/111255)

From Kubernetes v1.25, the in-tree vSphere volume driver will not support any vSphere release before 7.0u2. Check the v1.25 detailed release notes for more advice on how to handle this.
-->
### [對 vSphere 版本支持的變更](https://github.com/kubernetes/kubernetes/pull/111255)

從 Kubernetes v1.25 開始，樹內 vSphere 卷驅動將不支持任何早於 7.0u2 的 vSphere 版本。
查閱 v1.25 詳細發行說明，瞭解如何處理這種狀況的更多建議。

<!--
### [Cleaning up IPTables Chain Ownership](https://github.com/kubernetes/enhancements/issues/3178)

On Linux, Kubernetes (usually) creates iptables chains to ensure that network packets reach
Although these chains and their names have been an internal implementation detail, some tooling
has relied upon that behavior.
will only support for internal Kubernetes use cases. Starting with v1.25, the Kubelet will gradually move towards not creating the following iptables chains in the `nat` table:
-->
### [清理 IPTables 鏈的所有權](https://github.com/kubernetes/enhancements/issues/3178)

在 Linux 上，Kubernetes（通常）創建 iptables 鏈來確保這些網絡數據包到達，
儘管這些鏈及其名稱已成爲內部實現的細節，但某些工具已依賴於此行爲。
將僅支持內部 Kubernetes 使用場景。
從 v1.25 開始，Kubelet 將逐漸遷移爲不在 `nat` 表中創建以下 iptables 鏈：

- `KUBE-MARK-DROP`
- `KUBE-MARK-MASQ`
- `KUBE-POSTROUTING`

<!--
This change will be phased in via the `IPTablesCleanup` feature gate. Although this is not formally a deprecation, some end users have come to rely on specific internal behavior of `kube-proxy`. The Kubernetes project overall wants to make it clear that depending on these internal details is not supported, and that future implementations will change their behavior here.
-->
此項變更將通過 `IPTablesCleanup` 特性門控分階段完成。
儘管這不是正式的棄用，但某些最終用戶已開始依賴 `kube-proxy` 特定的內部行爲。
Kubernetes 項目總體上希望明確表示不支持依賴這些內部細節，並且未來的實現將更改它們在此處的行爲。

<!--
## Looking ahead

The official [list of API removals planned for Kubernetes 1.26](/docs/reference/using-api/deprecation-guide/#v1-26) is:

* The beta FlowSchema and PriorityLevelConfiguration APIs (flowcontrol.apiserver.k8s.io/v1beta1)
* The beta HorizontalPodAutoscaler API (autoscaling/v2beta2)
-->
## 展望未來 {#looking-ahead}

[Kubernetes 1.26 計劃移除的 API 的正式列表](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-26)爲：

* Beta 版 FlowSchema 和 PriorityLevelConfiguration API（flowcontrol.apiserver.k8s.io/v1beta1）
* Beta 版 HorizontalPodAutoscaler API（autoscaling/v2beta2）

<!--
### Want to know more?
Deprecations are announced in the Kubernetes release notes. You can see the announcements of pending deprecations in the release notes for:
-->
### 瞭解更多 {#want-to-know-more}

Kubernetes 發行說明公佈了棄用信息。你可以在以下版本的發行說明中查看待棄用特性的公告：

<!--
* [Kubernetes 1.21](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md#deprecation)
* [Kubernetes 1.22](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md#deprecation)
* [Kubernetes 1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)
* [Kubernetes 1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation)
* We will formally announce the deprecations that come with [Kubernetes 1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation) as part of the CHANGELOG for that release.
-->
* [Kubernetes 1.21](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md#deprecation)
* [Kubernetes 1.22](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md#deprecation)
* [Kubernetes 1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)
* [Kubernetes 1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation)
* 我們將正式宣佈 [Kubernetes 1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation)
  的棄用信息，作爲該版本 CHANGELOG 的一部分。

<!--
For information on the process of deprecation and removal, check out the official Kubernetes [deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) document.
-->
有關棄用和移除流程的信息，請查閱 Kubernetes
官方[棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api)文檔。
