---
layout: blog
title: 'Kubernetes v1.31 中的移除和主要變更'
date: 2024-07-19
slug: kubernetes-1-31-upcoming-changes
author: >
  Abigail McCarthy,
  Edith Puclla,
  Matteo Bianchi,
  Rashan Smith,
  Yigit Demirbas 
translator: >
  Xin Li (DaoCloud)
---

<!--
layout: blog
title: 'Kubernetes Removals and Major Changes In v1.31'
date: 2024-07-19
slug: kubernetes-1-31-upcoming-changes
author: >
  Abigail McCarthy,
  Edith Puclla,
  Matteo Bianchi,
  Rashan Smith,
  Yigit Demirbas 
-->

<!--
As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better ones for the project's overall health. 
This article outlines some planned changes for the Kubernetes v1.31 release that the release team feels you should be aware of for the continued maintenance of your Kubernetes environment. 
The information listed below is based on the current status of the v1.31 release. 
It may change before the actual release date. 
-->
隨着 Kubernetes 的發展和成熟，爲了項目的整體健康，某些特性可能會被棄用、刪除或替換爲更好的特性。
本文闡述了 Kubernetes v1.31 版本的一些更改計劃，發行團隊認爲你應當瞭解這些更改，
以便持續維護 Kubernetes 環境。
下面列出的資訊基於 v1.31 版本的當前狀態；這些狀態可能會在實際發佈日期之前發生變化。

<!--
## The Kubernetes API removal and deprecation process
The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. 
This policy states that stable APIs may only be deprecated when a newer, stable version of that API is available and that APIs have a minimum lifetime for each stability level.
A deprecated API has been marked for removal in a future Kubernetes release. 
It will continue to function until removal (at least one year from the deprecation), but usage will display a warning. 
Removed APIs are no longer available in the current version, so you must migrate to using the replacement.
-->
## Kubernetes API 刪除和棄用流程

Kubernetes 項目針對其功能特性有一個詳細說明的[棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
此策略規定，只有當某穩定 API 的更新、穩定版本可用時，纔可以棄用該 API，並且 API
的各個穩定性級別都有對應的生命週期下限。
已棄用的 API 標記爲在未來的 Kubernetes 版本中刪除，
這類 API 將繼續發揮作用，直至被刪除（從棄用起至少一年），但使用時會顯示警告。
已刪除的 API 在當前版本中不再可用，因此你必須將其遷移到替換版本。

<!--
* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.

* Beta or pre-release API versions must be supported for 3 releases after the deprecation.

* Alpha or experimental API versions may be removed in any release without prior deprecation notice.
-->
* 正式發佈的（GA）或穩定的 API 版本可被標記爲已棄用，但不得在 Kubernetes 主要版本未變時刪除。

* Beta 或預發佈 API 版本在被棄用後，必須保持 3 個發佈版本中仍然可用。

* Alpha 或實驗性 API 版本可以在任何版本中刪除，不必提前通知。

<!--
Whether an API is removed because a feature graduated from beta to stable or because that API did not succeed, all removals comply with this deprecation policy. 
Whenever an API is removed, migration options are communicated in the [documentation](/docs/reference/using-api/deprecation-guide/).
-->
無論 API 是因爲某個特性從 Beta 版升級到穩定版，還是因爲此 API 未成功而被刪除，所有刪除都將符合此棄用策略。
每當刪除 API 時，遷移選項都會在[文檔](/zh-cn/docs/reference/using-api/deprecation-guide/)中傳達。

<!--
## A note about SHA-1 signature support

In [go1.18](https://go.dev/doc/go1.18#sha1) (released in March 2022), the crypto/x509 library started to reject certificates signed with a SHA-1 hash function. 
While SHA-1 is established to be unsafe and publicly trusted Certificate Authorities have not issued SHA-1 certificates since 2015, there might still be cases in the context of Kubernetes where user-provided certificates are signed using a SHA-1 hash function through private authorities with them being used for Aggregated API Servers or webhooks. 
If you have relied on SHA-1 based certificates, you must explicitly opt back into its support by setting `GODEBUG=x509sha1=1` in your environment.
-->
## 關於 SHA-1 簽名支持的說明

在 [go1.18](https://go.dev/doc/go1.18#sha1)（2022 年 3 月發佈）中，crypto/x509
庫開始拒絕使用 SHA-1 哈希函數簽名的證書。
雖然 SHA-1 被確定爲不安全，並且公衆信任的證書頒發機構自 2015 年以來就沒有頒發過 SHA-1 證書，
但在 Kubernetes 環境中，仍可能存在使用者提供的證書通過私人頒發機構使用 SHA-1 哈希函數簽名的情況，
這些證書用於聚合 API 伺服器或 Webhook。
如果你依賴基於 SHA-1 的證書，則必須通過在環境中設置 `GODEBUG=x509sha1=1` 以明確選擇重新支持這種證書。

<!--
Given Go's [compatibility policy for GODEBUGs](https://go.dev/blog/compat), the `x509sha1` GODEBUG and the support for SHA-1 certificates will [fully go away in go1.24](https://tip.golang.org/doc/go1.23) which will be released in the first half of 2025. 
If you rely on SHA-1 certificates, please start moving off them.

Please see [Kubernetes issue #125689](https://github.com/kubernetes/kubernetes/issues/125689) to get a better idea of timelines around the support for SHA-1 going away, when Kubernetes releases plans to adopt go1.24, and for more details on how to detect usage of SHA-1 certificates via metrics and audit logging. 
-->
鑑於 Go 的 [GODEBUG 兼容性策略](https://go.dev/blog/compat)，`x509sha1` GODEBUG
和對 SHA-1 證書的支持將 [在 2025 年上半年發佈的 go1.24](https://tip.golang.org/doc/go1.23)
中完全消失。
如果你依賴 SHA-1 證書，請開始放棄使用它們。

請參閱 [Kubernetes 問題 #125689](https://github.com/kubernetes/kubernetes/issues/125689)，
以更好地瞭解對 SHA-1 支持的時間表，以及 Kubernetes 發佈採用 go1.24
的計劃時間、如何通過指標和審計日誌檢測 SHA-1 證書使用情況的更多詳細資訊。

<!--
## Deprecations and removals in Kubernetes 1.31

### Deprecation of `status.nodeInfo.kubeProxyVersion` field for Nodes ([KEP 4004](https://github.com/kubernetes/enhancements/issues/4004))
-->
## Kubernetes 1.31 中的棄用和刪除

### 棄用節點的 `status.nodeInfo.kubeProxyVersion` 字段（[KEP 4004](https://github.com/kubernetes/enhancements/issues/4004)）

<!--
The `.status.nodeInfo.kubeProxyVersion` field of Nodes is being deprecated in Kubernetes v1.31,and will be removed in a later release.
It's being deprecated because the value of this field wasn't (and isn't) accurate.
This field is set by the kubelet, which does not have reliable information about the kube-proxy version or whether kube-proxy is running.

The `DisableNodeKubeProxyVersion` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) will be set to `true` in by default in v1.31 and the kubelet will no longer attempt to set the `.status.kubeProxyVersion` field for its associated Node.
-->
Node 的 `.status.nodeInfo.kubeProxyVersion` 字段在 Kubernetes v1.31 中將被棄用，
並將在後續版本中刪除。該字段被棄用是因爲其取值原來不準確，並且現在也不準確。
該字段由 kubelet 設置，而 kubelet 沒有關於 kube-proxy 版本或 kube-proxy 是否正在運行的可靠資訊。

在 v1.31 中，`DisableNodeKubeProxyVersion`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)將預設設置爲 `true`，
並且 kubelet 將不再嘗試爲其關聯的 Node 設置 `.status.kubeProxyVersion` 字段。

<!--
### Removal of all in-tree integrations with cloud providers

As highlighted in a [previous article](/blog/2024/05/20/completing-cloud-provider-migration/), the last remaining in-tree support for cloud provider integration will be removed as part of the v1.31 release.
This doesn't mean you can't integrate with a cloud provider, however you now **must** use the
recommended approach using an external integration. Some integrations are part of the Kubernetes
project and others are third party software.
-->
### 刪除所有云驅動的樹內集成組件

正如[之前一篇文章](/blog/2024/05/20/completing-cloud-provider-migration/)中所強調的，
v1.31 版本將刪除雲驅動集成的樹內支持的最後剩餘部分。
這並不意味着你無法與某雲驅動集成，只是你現在**必須**使用推薦的外部集成方法。
一些集成組件是 Kubernetes 項目的一部分，其餘集成組件則是第三方軟體。

<!--
This milestone marks the completion of the externalization process for all cloud providers' integrations from the Kubernetes core ([KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)), a process started with Kubernetes v1.26. 
This change helps Kubernetes to get closer to being a truly vendor-neutral platform.

For further details on the cloud provider integrations, read our [v1.29 Cloud Provider Integrations feature blog](/blog/2023/12/14/cloud-provider-integration-changes/). 
For additional context about the in-tree code removal, we invite you to check the ([v1.29 deprecation blog](/blog/2023/11/16/kubernetes-1-29-upcoming-changes/#removal-of-in-tree-integrations-with-cloud-providers-kep-2395-https-kep-k8s-io-2395)).

The latter blog also contains useful information for users who need to migrate to version v1.29 and later.
-->
這一里程碑標誌着將所有云驅動集成組件從 Kubernetes 核心外部化的過程已經完成
（[KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)），
該過程從 Kubernetes v1.26 開始。
這一變化有助於 Kubernetes 進一步成爲真正的供應商中立平臺。

有關雲驅動集成的更多詳細資訊，請閱讀我們的 [v1.29 雲驅動集成特性的博客](/zh-cn/blog/2023/12/14/cloud-provider-integration-changes/)。
有關樹內代碼刪除的更多背景資訊，請閱讀
（[v1.29 棄用博客](/blog/2023/11/16/kubernetes-1-29-upcoming-changes/#removal-of-in-tree-integrations-with-cloud-providers-kep-2395-https-kep-k8s-io-2395)）。

後一個博客還包含對需要遷移到 v1.29 及更高版本的使用者有用的資訊。

<!--
### Removal of kubelet `--keep-terminated-pod-volumes` command line flag

The kubelet flag `--keep-terminated-pod-volumes`, which was deprecated in 2017, will be removed as
part of the v1.31 release.

You can find more details in the pull request [#122082](https://github.com/kubernetes/kubernetes/pull/122082).
-->
### 刪除 kubelet `--keep-terminated-pod-volumes` 命令列標誌

kubelet 標誌 `--keep-terminated-pod-volumes` 已於 2017 年棄用，將在 v1.31 版本中被刪除。

你可以在拉取請求 [#122082](https://github.com/kubernetes/kubernetes/pull/122082)
中找到更多詳細資訊。

<!--
### Removal of CephFS volume plugin 

[CephFS volume plugin](/docs/concepts/storage/volumes/#cephfs) was removed in this release and the `cephfs` volume type became non-functional. 

It is recommended that you use the [CephFS CSI driver](https://github.com/ceph/ceph-csi/) as a third-party storage driver instead. If you were using the CephFS volume plugin before upgrading the cluster version to v1.31, you must re-deploy your application to use the new driver.

CephFS volume plugin was formally marked as deprecated in v1.28.
-->
### 刪除 CephFS 卷插件

[CephFS 卷插件](/zh-cn/docs/concepts/storage/volumes/#cephfs)已在此版本中刪除，
並且 `cephfs` 卷類型已無法使用。

建議你改用 [CephFS CSI 驅動程式](https://github.com/ceph/ceph-csi/) 作爲第三方儲存驅動程式。
如果你在將叢集版本升級到 v1.31 之前在使用 CephFS 卷插件，則必須重新部署應用才能使用新驅動。

CephFS 卷插件在 v1.28 中正式標記爲已棄用。

<!--
### Removal of Ceph RBD volume plugin

The v1.31 release will remove the [Ceph RBD volume plugin](/docs/concepts/storage/volumes/#rbd) and its CSI migration support, making the `rbd` volume type non-functional.

It's recommended that you use the [RBD CSI driver](https://github.com/ceph/ceph-csi/) in your clusters instead. 
If you were using Ceph RBD volume plugin before upgrading the cluster version to v1.31, you must re-deploy your application to use the new driver.

The Ceph RBD volume plugin was formally marked as deprecated in v1.28.
-->
### 刪除 Ceph RBD 卷插件

v1.31 版本將刪除 [Ceph RBD 卷插件](/zh-cn/docs/concepts/storage/volumes/#rbd)及其 CSI 遷移支持，
`rbd` 卷類型將無法繼續使用。

建議你在叢集中使用 [RBD CSI 驅動](https://github.com/ceph/ceph-csi/)。
如果你在將叢集版本升級到 v1.31 之前在使用 Ceph RBD 卷插件，則必須重新部署應用以使用新驅動。

Ceph RBD 卷插件在 v1.28 中正式標記爲已棄用。

<!--
### Deprecation of non-CSI volume limit plugins in kube-scheduler

The v1.31 release will deprecate all non-CSI volume limit scheduler plugins, and will remove some
already deprected plugins from the [default plugins](/docs/reference/scheduling/config/), including:
-->
### kube-scheduler 中非 CSI 卷限制插件的棄用

v1.31 版本將棄用所有非 CSI 卷限制調度程式插件，
並將從[預設插件](/zh-cn/docs/reference/scheduling/config/)中刪除一些已棄用的插件，包括：

- `AzureDiskLimits`
- `CinderLimits`
- `EBSLimits`
- `GCEPDLimits`

<!--
It's recommended that you use the `NodeVolumeLimits` plugin instead because it can handle the same functionality as the removed plugins since those volume types have been migrated to CSI. 
Please replace the deprecated plugins with the `NodeVolumeLimits` plugin if you explicitly use them in the [scheduler config](/docs/reference/scheduling/config/). 
The `AzureDiskLimits`, `CinderLimits`, `EBSLimits`, and `GCEPDLimits` plugins will be removed in a future release.

These plugins will be removed from the default scheduler plugins list as they have been deprecated since Kubernetes v1.14.
-->
建議你改用 `NodeVolumeLimits` 插件，因爲它可以處理與已刪除插件相同的功能，因爲這些卷類型已遷移到 CSI。
如果你在[調度器設定](/zh-cn/docs/reference/scheduling/config/)中顯式使用已棄用的插件，
請用 `NodeVolumeLimits` 插件替換它們。
`AzureDiskLimits`、`CinderLimits`、`EBSLimits` 和 `GCEPDLimits` 插件將在未來的版本中被刪除。

這些插件將從預設調度程式插件列表中刪除，因爲它們自 Kubernetes v1.14 以來已被棄用。

<!--
## Looking ahead
The official list of API removals planned for [Kubernetes v1.32](/docs/reference/using-api/deprecation-guide/#v1-32) include:

* The `flowcontrol.apiserver.k8s.io/v1beta3` API version of FlowSchema and PriorityLevelConfiguration will be removed. 
To prepare for this, you can edit your existing manifests and rewrite client software to use the `flowcontrol.apiserver.k8s.io/v1 API` version, available since v1.29. 
All existing persisted objects are accessible via the new API. Notable changes in flowcontrol.apiserver.k8s.io/v1beta3 include that the PriorityLevelConfiguration `spec.limited.nominalConcurrencyShares` field only defaults to 30 when unspecified, and an explicit value of 0 is not changed to 30.

For more information, please refer to the [API deprecation guide](/docs/reference/using-api/deprecation-guide/#v1-32).
-->
## 展望未來

[Kubernetes v1.32](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-32) 計劃刪除的官方 API 包括：

* 將刪除 `flowcontrol.apiserver.k8s.io/v1beta3` API 版本的 FlowSchema 和 PriorityLevelConfiguration。
  爲了做好準備，你可以編輯現有清單並重寫客戶端軟體以使用自 v1.29 起可用的 `flowcontrol.apiserver.k8s.io/v1 API` 版本。
  所有現有的持久化對象都可以通過新 API 訪問。`flowcontrol.apiserver.k8s.io/v1beta3` 中需要注意的變化包括優先級設定
  `spec.limited.nominalConcurrencyShares` 字段僅在未指定時預設爲 30，並且顯式設置爲 0 的話不會被更改爲 30。

有關更多資訊，請參閱 [API 棄用指南](/docs/reference/using-api/deprecation-guide/#v1-32)。

<!--
## Want to know more?
The Kubernetes release notes announce deprecations. 
We will formally announce the deprecations in [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md#deprecation) as part of the CHANGELOG for that release.

You can see the announcements of pending deprecations in the release notes for:
-->
## 想要了解更多？

Kubernetes 發行說明中會宣佈棄用資訊。
我們將在 [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md#deprecation)
中正式宣佈棄用資訊，作爲該版本的 CHANGELOG 的一部分。

你可以在發行說明中看到待棄用的公告：

* [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md#deprecation)

* [Kubernetes v1.29](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md#deprecation)

* [Kubernetes v1.28](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.28.md#deprecation)

* [Kubernetes v1.27](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md#deprecation)
