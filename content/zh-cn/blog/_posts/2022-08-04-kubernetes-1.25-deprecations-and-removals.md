---
layout: blog
title: "Kubernetes 1.25 的移除说明和主要变更"
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
随着 Kubernetes 成长和日趋成熟，为了此项目的健康发展，某些功能特性可能会被弃用、移除或替换为优化过的功能特性。
Kubernetes v1.25 包括几个主要变更和一个主要移除。

<!--
## The Kubernetes API Removal and Deprecation process

The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API is one that has been marked for removal in a future Kubernetes release; it will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.
-->
## Kubernetes API 移除和弃用流程 {#the-kubernetes-api-removal-and-deprecation-process}

Kubernetes 项目对功能特性有一个文档完备的[弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
该策略规定，只有当较新的、稳定的相同 API 可用时，原有的稳定 API 才可能被弃用，每个稳定级别的 API 都有一个最短的生命周期。
弃用的 API 指的是已标记为将在后续发行某个 Kubernetes 版本时移除的 API；
移除之前该 API 将继续发挥作用（从弃用起至少一年时间），但使用时会显示一条警告。
移除的 API 将在当前版本中不再可用，此时你必须迁移以使用替换的 API。

<!--
* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes. 
* Beta or pre-release API versions must be supported for 3 releases after deprecation. 
* Alpha or experimental API versions may be removed in any release without prior deprecation notice.
-->
* 正式发布（GA）或稳定的 API 版本可能被标记为已弃用，但只有在 Kubernetes 大版本更新时才会移除。
* 测试版（Beta）或预发布 API 版本在弃用后必须支持 3 个版本。
* Alpha 或实验性 API 版本可能会在任何版本中被移除，恕不另行通知。

<!--
Whether an API is removed as a result of a feature graduating from beta to stable or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the documentation.
-->
无论一个 API 是因为某功能特性从 Beta 进入稳定阶段而被移除，还是因为该 API 根本没有成功，
所有移除均遵从上述弃用策略。无论何时移除一个 API，文档中都会列出迁移选项。

<!--
## A Note About PodSecurityPolicy

In Kubernetes v1.25, we will be removing PodSecurityPolicy [after its deprecation in v1.21](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/). PodSecurityPolicy has served us honorably, but its complex and often confusing usage necessitated changes, which unfortunately would have been breaking changes. To address this, it is being removed in favor of a replacement, Pod Security Admission, which is graduating to stable in this release as well. If you are currently relying on PodSecurityPolicy, follow the instructions for [migration to Pod Security Admission](/docs/tasks/configure-pod-container/migrate-from-psp/).
-->
## 有关 PodSecurityPolicy 的说明 {#a-note-about-podsecuritypolicy}

[继 PodSecurityPolicy 在 v1.21 弃用后](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)，
Kubernetes v1.25 将移除 PodSecurityPolicy。PodSecurityPolicy 曾光荣地为我们服务，
但由于其复杂和经常令人困惑的使用方式，让大家觉得有必要进行修改，但很遗憾这种修改将会是破坏性的。
为此我们移除了 PodSecurityPolicy，取而代之的是 Pod Security Admission（即 PodSecurity 安全准入控制器），
后者在本次发行中也进入了稳定阶段。
如果你目前正依赖 PodSecurityPolicy，请遵循指示说明[迁移到 PodSecurity 准入控制器](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)。

<!--
## Major Changes for Kubernetes v1.25

Kubernetes v1.25 will include several major changes, in addition to the removal of PodSecurityPolicy.

### [CSI Migration](https://github.com/kubernetes/enhancements/issues/625)

The effort to  move the in-tree volume plugins to out-of-tree CSI drivers continues, with the core CSI Migration feature going GA in v1.25. This is an important step towards removing the in-tree volume plugins entirely.
-->
## Kubernetes v1.25 的主要变更 {#major-changes-for-kubernetes-v1.25}

Kubernetes v1.25 除了移除 PodSecurityPolicy 之外，还将包括以下几个主要变更。

### [CSI Migration](https://github.com/kubernetes/enhancements/issues/625)

将树内卷插件迁移到树外 CSI 驱动的努力还在继续，核心的 CSI Migration 特性在 v1.25 进入 GA 阶段。
对于全面移除树内卷插件而言，这是重要的一步。

<!--
### Deprecations and removals for storage drivers

Several volume plugins are being deprecated or removed.

[GlusterFS will be deprecated in v1.25](https://github.com/kubernetes/enhancements/issues/3446). While a CSI driver was built for it, it has not been maintained. The possibility of migration to a compatible CSI driver [was discussed](https://github.com/kubernetes/kubernetes/issues/100897), but a decision was ultimately made to begin the deprecation of the GlusterFS plugin from in-tree drivers. The [Portworx in-tree volume plugin](https://github.com/kubernetes/enhancements/issues/2589) is also being deprecated with this release. The Flocker, Quobyte, and StorageOS in-tree volume plugins are being removed.
-->
### 存储驱动的弃用和移除 {#deprecations-and-removals-for-storage-drivers}

若干卷插件将被弃用或移除。

[GlusterFS 将在 v1.25](https://github.com/kubernetes/enhancements/issues/3446) 中被弃用。
虽然为其构建了 CSI 驱动，但未曾得到维护。
社区[曾讨论](https://github.com/kubernetes/kubernetes/issues/100897)迁移到一个兼容 CSI 驱动的可能性，
但最终决定开始从树内驱动中弃用 GlusterFS 插件。
本次发行还会弃用 [Portworx 树内卷插件](https://github.com/kubernetes/enhancements/issues/2589)。
Flocker、Quobyte 和 StorageOS 树内卷插件将被移除。

<!--
[Flocker](https://github.com/kubernetes/kubernetes/pull/111618), [Quobyte](https://github.com/kubernetes/kubernetes/pull/111619), and [StorageOS](https://github.com/kubernetes/kubernetes/pull/111620) in-tree volume plugins will be removed in v1.25 as part of the [CSI Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration).
-->
[Flocker](https://github.com/kubernetes/kubernetes/pull/111618)、
[Quobyte](https://github.com/kubernetes/kubernetes/pull/111619) 和
[StorageOS](https://github.com/kubernetes/kubernetes/pull/111620) 树内卷插件将作为
[CSI Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration)
的一部分在 v1.25 中移除。

<!--
### [Change to vSphere version support](https://github.com/kubernetes/kubernetes/pull/111255)

From Kubernetes v1.25, the in-tree vSphere volume driver will not support any vSphere release before 7.0u2. Check the v1.25 detailed release notes for more advice on how to handle this.
-->
### [对 vSphere 版本支持的变更](https://github.com/kubernetes/kubernetes/pull/111255)

从 Kubernetes v1.25 开始，树内 vSphere 卷驱动将不支持任何早于 7.0u2 的 vSphere 版本。
查阅 v1.25 详细发行说明，了解如何处理这种状况的更多建议。

<!--
### [Cleaning up IPTables Chain Ownership](https://github.com/kubernetes/enhancements/issues/3178)

On Linux, Kubernetes (usually) creates iptables chains to ensure that network packets reach
Although these chains and their names have been an internal implementation detail, some tooling
has relied upon that behavior.
will only support for internal Kubernetes use cases. Starting with v1.25, the Kubelet will gradually move towards not creating the following iptables chains in the `nat` table:
-->
### [清理 IPTables 链的所有权](https://github.com/kubernetes/enhancements/issues/3178)

在 Linux 上，Kubernetes（通常）创建 iptables 链来确保这些网络数据包到达，
尽管这些链及其名称已成为内部实现的细节，但某些工具已依赖于此行为。
将仅支持内部 Kubernetes 使用场景。
从 v1.25 开始，Kubelet 将逐渐迁移为不在 `nat` 表中创建以下 iptables 链：

- `KUBE-MARK-DROP`
- `KUBE-MARK-MASQ`
- `KUBE-POSTROUTING`

<!--
This change will be phased in via the `IPTablesCleanup` feature gate. Although this is not formally a deprecation, some end users have come to rely on specific internal behavior of `kube-proxy`. The Kubernetes project overall wants to make it clear that depending on these internal details is not supported, and that future implementations will change their behavior here.
-->
此项变更将通过 `IPTablesCleanup` 特性门控分阶段完成。
尽管这不是正式的弃用，但某些最终用户已开始依赖 `kube-proxy` 特定的内部行为。
Kubernetes 项目总体上希望明确表示不支持依赖这些内部细节，并且未来的实现将更改它们在此处的行为。

<!--
## Looking ahead

The official [list of API removals planned for Kubernetes 1.26](/docs/reference/using-api/deprecation-guide/#v1-26) is:

* The beta FlowSchema and PriorityLevelConfiguration APIs (flowcontrol.apiserver.k8s.io/v1beta1)
* The beta HorizontalPodAutoscaler API (autoscaling/v2beta2)
-->
## 展望未来 {#looking-ahead}

[Kubernetes 1.26 计划移除的 API 的正式列表](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-26)为：

* Beta 版 FlowSchema 和 PriorityLevelConfiguration API（flowcontrol.apiserver.k8s.io/v1beta1）
* Beta 版 HorizontalPodAutoscaler API（autoscaling/v2beta2）

<!--
### Want to know more?
Deprecations are announced in the Kubernetes release notes. You can see the announcements of pending deprecations in the release notes for:
-->
### 了解更多 {#want-to-know-more}

Kubernetes 发行说明公布了弃用信息。你可以在以下版本的发行说明中查看待弃用特性的公告：

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
* 我们将正式宣布 [Kubernetes 1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation)
  的弃用信息，作为该版本 CHANGELOG 的一部分。

<!--
For information on the process of deprecation and removal, check out the official Kubernetes [deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) document.
-->
有关弃用和移除流程的信息，请查阅 Kubernetes
官方[弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api)文档。
