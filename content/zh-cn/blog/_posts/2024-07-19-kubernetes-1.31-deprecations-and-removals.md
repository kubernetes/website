---
layout: blog
title: 'Kubernetes v1.31 中的移除和主要变更'
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
随着 Kubernetes 的发展和成熟，为了项目的整体健康，某些特性可能会被弃用、删除或替换为更好的特性。
本文阐述了 Kubernetes v1.31 版本的一些更改计划，发行团队认为你应当了解这些更改，
以便持续维护 Kubernetes 环境。
下面列出的信息基于 v1.31 版本的当前状态；这些状态可能会在实际发布日期之前发生变化。

<!--
## The Kubernetes API removal and deprecation process
The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. 
This policy states that stable APIs may only be deprecated when a newer, stable version of that API is available and that APIs have a minimum lifetime for each stability level.
A deprecated API has been marked for removal in a future Kubernetes release. 
It will continue to function until removal (at least one year from the deprecation), but usage will display a warning. 
Removed APIs are no longer available in the current version, so you must migrate to using the replacement.
-->
## Kubernetes API 删除和弃用流程

Kubernetes 项目针对其功能特性有一个详细说明的[弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
此策略规定，只有当某稳定 API 的更新、稳定版本可用时，才可以弃用该 API，并且 API
的各个稳定性级别都有对应的生命周期下限。
已弃用的 API 标记为在未来的 Kubernetes 版本中删除，
这类 API 将继续发挥作用，直至被删除（从弃用起至少一年），但使用时会显示警告。
已删除的 API 在当前版本中不再可用，因此你必须将其迁移到替换版本。

<!--
* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.

* Beta or pre-release API versions must be supported for 3 releases after the deprecation.

* Alpha or experimental API versions may be removed in any release without prior deprecation notice.
-->
* 正式发布的（GA）或稳定的 API 版本可被标记为已弃用，但不得在 Kubernetes 主要版本未变时删除。

* Beta 或预发布 API 版本在被弃用后，必须保持 3 个发布版本中仍然可用。

* Alpha 或实验性 API 版本可以在任何版本中删除，不必提前通知。

<!--
Whether an API is removed because a feature graduated from beta to stable or because that API did not succeed, all removals comply with this deprecation policy. 
Whenever an API is removed, migration options are communicated in the [documentation](/docs/reference/using-api/deprecation-guide/).
-->
无论 API 是因为某个特性从 Beta 版升级到稳定版，还是因为此 API 未成功而被删除，所有删除都将符合此弃用策略。
每当删除 API 时，迁移选项都会在[文档](/zh-cn/docs/reference/using-api/deprecation-guide/)中传达。

<!--
## A note about SHA-1 signature support

In [go1.18](https://go.dev/doc/go1.18#sha1) (released in March 2022), the crypto/x509 library started to reject certificates signed with a SHA-1 hash function. 
While SHA-1 is established to be unsafe and publicly trusted Certificate Authorities have not issued SHA-1 certificates since 2015, there might still be cases in the context of Kubernetes where user-provided certificates are signed using a SHA-1 hash function through private authorities with them being used for Aggregated API Servers or webhooks. 
If you have relied on SHA-1 based certificates, you must explicitly opt back into its support by setting `GODEBUG=x509sha1=1` in your environment.
-->
## 关于 SHA-1 签名支持的说明

在 [go1.18](https://go.dev/doc/go1.18#sha1)（2022 年 3 月发布）中，crypto/x509
库开始拒绝使用 SHA-1 哈希函数签名的证书。
虽然 SHA-1 被确定为不安全，并且公众信任的证书颁发机构自 2015 年以来就没有颁发过 SHA-1 证书，
但在 Kubernetes 环境中，仍可能存在用户提供的证书通过私人颁发机构使用 SHA-1 哈希函数签名的情况，
这些证书用于聚合 API 服务器或 Webhook。
如果你依赖基于 SHA-1 的证书，则必须通过在环境中设置 `GODEBUG=x509sha1=1` 以明确选择重新支持这种证书。

<!--
Given Go's [compatibility policy for GODEBUGs](https://go.dev/blog/compat), the `x509sha1` GODEBUG and the support for SHA-1 certificates will [fully go away in go1.24](https://tip.golang.org/doc/go1.23) which will be released in the first half of 2025. 
If you rely on SHA-1 certificates, please start moving off them.

Please see [Kubernetes issue #125689](https://github.com/kubernetes/kubernetes/issues/125689) to get a better idea of timelines around the support for SHA-1 going away, when Kubernetes releases plans to adopt go1.24, and for more details on how to detect usage of SHA-1 certificates via metrics and audit logging. 
-->
鉴于 Go 的 [GODEBUG 兼容性策略](https://go.dev/blog/compat)，`x509sha1` GODEBUG
和对 SHA-1 证书的支持将 [在 2025 年上半年发布的 go1.24](https://tip.golang.org/doc/go1.23)
中完全消失。
如果你依赖 SHA-1 证书，请开始放弃使用它们。

请参阅 [Kubernetes 问题 #125689](https://github.com/kubernetes/kubernetes/issues/125689)，
以更好地了解对 SHA-1 支持的时间表，以及 Kubernetes 发布采用 go1.24
的计划时间、如何通过指标和审计日志检测 SHA-1 证书使用情况的更多详细信息。

<!--
## Deprecations and removals in Kubernetes 1.31

### Deprecation of `status.nodeInfo.kubeProxyVersion` field for Nodes ([KEP 4004](https://github.com/kubernetes/enhancements/issues/4004))
-->
## Kubernetes 1.31 中的弃用和删除

### 弃用节点的 `status.nodeInfo.kubeProxyVersion` 字段（[KEP 4004](https://github.com/kubernetes/enhancements/issues/4004)）

<!--
The `.status.nodeInfo.kubeProxyVersion` field of Nodes is being deprecated in Kubernetes v1.31,and will be removed in a later release.
It's being deprecated because the value of this field wasn't (and isn't) accurate.
This field is set by the kubelet, which does not have reliable information about the kube-proxy version or whether kube-proxy is running.

The `DisableNodeKubeProxyVersion` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) will be set to `true` in by default in v1.31 and the kubelet will no longer attempt to set the `.status.kubeProxyVersion` field for its associated Node.
-->
Node 的 `.status.nodeInfo.kubeProxyVersion` 字段在 Kubernetes v1.31 中将被弃用，
并将在后续版本中删除。该字段被弃用是因为其取值原来不准确，并且现在也不准确。
该字段由 kubelet 设置，而 kubelet 没有关于 kube-proxy 版本或 kube-proxy 是否正在运行的可靠信息。

在 v1.31 中，`DisableNodeKubeProxyVersion`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)将默认设置为 `true`，
并且 kubelet 将不再尝试为其关联的 Node 设置 `.status.kubeProxyVersion` 字段。

<!--
### Removal of all in-tree integrations with cloud providers

As highlighted in a [previous article](/blog/2024/05/20/completing-cloud-provider-migration/), the last remaining in-tree support for cloud provider integration will be removed as part of the v1.31 release.
This doesn't mean you can't integrate with a cloud provider, however you now **must** use the
recommended approach using an external integration. Some integrations are part of the Kubernetes
project and others are third party software.
-->
### 删除所有云驱动的树内集成组件

正如[之前一篇文章](/blog/2024/05/20/completing-cloud-provider-migration/)中所强调的，
v1.31 版本将删除云驱动集成的树内支持的最后剩余部分。
这并不意味着你无法与某云驱动集成，只是你现在**必须**使用推荐的外部集成方法。
一些集成组件是 Kubernetes 项目的一部分，其余集成组件则是第三方软件。

<!--
This milestone marks the completion of the externalization process for all cloud providers' integrations from the Kubernetes core ([KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)), a process started with Kubernetes v1.26. 
This change helps Kubernetes to get closer to being a truly vendor-neutral platform.

For further details on the cloud provider integrations, read our [v1.29 Cloud Provider Integrations feature blog](/blog/2023/12/14/cloud-provider-integration-changes/). 
For additional context about the in-tree code removal, we invite you to check the ([v1.29 deprecation blog](/blog/2023/11/16/kubernetes-1-29-upcoming-changes/#removal-of-in-tree-integrations-with-cloud-providers-kep-2395-https-kep-k8s-io-2395)).

The latter blog also contains useful information for users who need to migrate to version v1.29 and later.
-->
这一里程碑标志着将所有云驱动集成组件从 Kubernetes 核心外部化的过程已经完成
（[KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)），
该过程从 Kubernetes v1.26 开始。
这一变化有助于 Kubernetes 进一步成为真正的供应商中立平台。

有关云驱动集成的更多详细信息，请阅读我们的 [v1.29 云驱动集成特性的博客](/zh-cn/blog/2023/12/14/cloud-provider-integration-changes/)。
有关树内代码删除的更多背景信息，请阅读
（[v1.29 弃用博客](/blog/2023/11/16/kubernetes-1-29-upcoming-changes/#removal-of-in-tree-integrations-with-cloud-providers-kep-2395-https-kep-k8s-io-2395)）。

后一个博客还包含对需要迁移到 v1.29 及更高版本的用户有用的信息。

<!--
### Removal of kubelet `--keep-terminated-pod-volumes` command line flag

The kubelet flag `--keep-terminated-pod-volumes`, which was deprecated in 2017, will be removed as
part of the v1.31 release.

You can find more details in the pull request [#122082](https://github.com/kubernetes/kubernetes/pull/122082).
-->
### 删除 kubelet `--keep-terminated-pod-volumes` 命令行标志

kubelet 标志 `--keep-terminated-pod-volumes` 已于 2017 年弃用，将在 v1.31 版本中被删除。

你可以在拉取请求 [#122082](https://github.com/kubernetes/kubernetes/pull/122082)
中找到更多详细信息。

<!--
### Removal of CephFS volume plugin 

[CephFS volume plugin](/docs/concepts/storage/volumes/#cephfs) was removed in this release and the `cephfs` volume type became non-functional. 

It is recommended that you use the [CephFS CSI driver](https://github.com/ceph/ceph-csi/) as a third-party storage driver instead. If you were using the CephFS volume plugin before upgrading the cluster version to v1.31, you must re-deploy your application to use the new driver.

CephFS volume plugin was formally marked as deprecated in v1.28.
-->
### 删除 CephFS 卷插件

[CephFS 卷插件](/zh-cn/docs/concepts/storage/volumes/#cephfs)已在此版本中删除，
并且 `cephfs` 卷类型已无法使用。

建议你改用 [CephFS CSI 驱动程序](https://github.com/ceph/ceph-csi/) 作为第三方存储驱动程序。
如果你在将集群版本升级到 v1.31 之前在使用 CephFS 卷插件，则必须重新部署应用才能使用新驱动。

CephFS 卷插件在 v1.28 中正式标记为已弃用。

<!--
### Removal of Ceph RBD volume plugin

The v1.31 release will remove the [Ceph RBD volume plugin](/docs/concepts/storage/volumes/#rbd) and its CSI migration support, making the `rbd` volume type non-functional.

It's recommended that you use the [RBD CSI driver](https://github.com/ceph/ceph-csi/) in your clusters instead. 
If you were using Ceph RBD volume plugin before upgrading the cluster version to v1.31, you must re-deploy your application to use the new driver.

The Ceph RBD volume plugin was formally marked as deprecated in v1.28.
-->
### 删除 Ceph RBD 卷插件

v1.31 版本将删除 [Ceph RBD 卷插件](/zh-cn/docs/concepts/storage/volumes/#rbd)及其 CSI 迁移支持，
`rbd` 卷类型将无法继续使用。

建议你在集群中使用 [RBD CSI 驱动](https://github.com/ceph/ceph-csi/)。
如果你在将集群版本升级到 v1.31 之前在使用 Ceph RBD 卷插件，则必须重新部署应用以使用新驱动。

Ceph RBD 卷插件在 v1.28 中正式标记为已弃用。

<!--
### Deprecation of non-CSI volume limit plugins in kube-scheduler

The v1.31 release will deprecate all non-CSI volume limit scheduler plugins, and will remove some
already deprected plugins from the [default plugins](/docs/reference/scheduling/config/), including:
-->
### kube-scheduler 中非 CSI 卷限制插件的弃用

v1.31 版本将弃用所有非 CSI 卷限制调度程序插件，
并将从[默认插件](/zh-cn/docs/reference/scheduling/config/)中删除一些已弃用的插件，包括：

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
建议你改用 `NodeVolumeLimits` 插件，因为它可以处理与已删除插件相同的功能，因为这些卷类型已迁移到 CSI。
如果你在[调度器配置](/zh-cn/docs/reference/scheduling/config/)中显式使用已弃用的插件，
请用 `NodeVolumeLimits` 插件替换它们。
`AzureDiskLimits`、`CinderLimits`、`EBSLimits` 和 `GCEPDLimits` 插件将在未来的版本中被删除。

这些插件将从默认调度程序插件列表中删除，因为它们自 Kubernetes v1.14 以来已被弃用。

<!--
## Looking ahead
The official list of API removals planned for [Kubernetes v1.32](/docs/reference/using-api/deprecation-guide/#v1-32) include:

* The `flowcontrol.apiserver.k8s.io/v1beta3` API version of FlowSchema and PriorityLevelConfiguration will be removed. 
To prepare for this, you can edit your existing manifests and rewrite client software to use the `flowcontrol.apiserver.k8s.io/v1 API` version, available since v1.29. 
All existing persisted objects are accessible via the new API. Notable changes in flowcontrol.apiserver.k8s.io/v1beta3 include that the PriorityLevelConfiguration `spec.limited.nominalConcurrencyShares` field only defaults to 30 when unspecified, and an explicit value of 0 is not changed to 30.

For more information, please refer to the [API deprecation guide](/docs/reference/using-api/deprecation-guide/#v1-32).
-->
## 展望未来

[Kubernetes v1.32](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-32) 计划删除的官方 API 包括：

* 将删除 `flowcontrol.apiserver.k8s.io/v1beta3` API 版本的 FlowSchema 和 PriorityLevelConfiguration。
  为了做好准备，你可以编辑现有清单并重写客户端软件以使用自 v1.29 起可用的 `flowcontrol.apiserver.k8s.io/v1 API` 版本。
  所有现有的持久化对象都可以通过新 API 访问。`flowcontrol.apiserver.k8s.io/v1beta3` 中需要注意的变化包括优先级配置
  `spec.limited.nominalConcurrencyShares` 字段仅在未指定时默认为 30，并且显式设置为 0 的话不会被更改为 30。

有关更多信息，请参阅 [API 弃用指南](/docs/reference/using-api/deprecation-guide/#v1-32)。

<!--
## Want to know more?
The Kubernetes release notes announce deprecations. 
We will formally announce the deprecations in [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md#deprecation) as part of the CHANGELOG for that release.

You can see the announcements of pending deprecations in the release notes for:
-->
## 想要了解更多？

Kubernetes 发行说明中会宣布弃用信息。
我们将在 [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md#deprecation)
中正式宣布弃用信息，作为该版本的 CHANGELOG 的一部分。

你可以在发行说明中看到待弃用的公告：

* [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md#deprecation)

* [Kubernetes v1.29](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md#deprecation)

* [Kubernetes v1.28](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.28.md#deprecation)

* [Kubernetes v1.27](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md#deprecation)
