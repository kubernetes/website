---
layout: blog
title: 'Kubernetes 1.29 中的移除、弃用和主要变更'
date: 2023-11-16
slug: kubernetes-1-29-upcoming-changes
---
<!--
layout: blog
title: 'Kubernetes Removals, Deprecations, and Major Changes in Kubernetes 1.29'
date: 2023-11-16
slug: kubernetes-1-29-upcoming-changes
-->

<!--
**Authors:** Carol Valencia, Kristin Martin, Abigail McCarthy, James Quigley, Hosam Kamel
-->
**作者:** Carol Valencia, Kristin Martin, Abigail McCarthy, James Quigley, Hosam Kamel

**译者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
As with every release, Kubernetes v1.29 will introduce feature deprecations and removals. Our continued ability to produce high-quality releases is a testament to our robust development cycle and healthy community. The following are some of the deprecations and removals coming in the Kubernetes 1.29 release.
-->
和其他每次发布一样，Kubernetes v1.29 将弃用和移除一些特性。
一贯以来生成高质量发布版本的能力是开发周期稳健和社区健康的证明。
下文列举即将发布的 Kubernetes 1.29 中的一些弃用和移除事项。

<!--
## The Kubernetes API removal and deprecation process

The Kubernetes project has a well-documented deprecation policy for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API is one that has been marked for removal in a future Kubernetes release; it will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.
-->
## Kubernetes API 移除和弃用流程

Kubernetes 项目对特性有一个文档完备的弃用策略。此策略规定，只有当同一 API 有了较新的、稳定的版本可用时，
原有的稳定 API 才可以被弃用，各个不同稳定级别的 API 都有一个最短的生命周期。
弃用的 API 指的是已标记为将在后续某个 Kubernetes 发行版本中被移除的 API；
移除之前该 API 将继续发挥作用（从被弃用起至少一年时间），但使用时会显示一条警告。
被移除的 API 将在当前版本中不再可用，此时你必须转为使用替代的 API。

<!--
* Generally available (GA) or stable API versions may be marked as deprecated, but must not be removed within a major version of Kubernetes.
* Beta or pre-release API versions must be supported for 3 releases after deprecation.
* Alpha or experimental API versions may be removed in any release without prior deprecation notice.
-->
- 正式发布（GA）或稳定的 API 版本可能被标记为已弃用，但只有在 Kubernetes 主版本变化时才会被移除。
- 测试版（Beta）或预发布 API 版本在弃用后必须在后续 3 个版本中继续支持。
- Alpha 或实验性 API 版本可以在任何版本中被移除，不另行通知。

<!--
Whether an API is removed as a result of a feature graduating from beta to stable or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the documentation.
-->
无论一个 API 是因为某特性从 Beta 进阶至稳定阶段而被移除，还是因为该 API 根本没有成功，
所有移除均遵从上述弃用策略。无论何时移除一个 API，文档中都会列出迁移选项。

<!--
## A note about the k8s.gcr.io redirect to registry.k8s.io

To host its container images, the Kubernetes project uses a community-owned image registry called registry.k8s.io. Starting last March traffic to the old k8s.gcr.io registry began being redirected to registry.k8s.io. The deprecated k8s.gcr.io registry will eventually be phased out. For more details on this change or to see if you are impacted, please read [k8s.gcr.io Redirect to registry.k8s.io - What You Need to Know](/blog/2023/03/10/image-registry-redirect/).
-->
## k8s.gcr.io 重定向到 registry.k8s.io 相关说明

Kubernetes 项目为了托管其容器镜像，使用社区自治的一个名为 registry.k8s.io 的镜像仓库。
从最近的 3 月份起，所有流向 k8s.gcr.io 旧仓库的请求开始被重定向到 registry.k8s.io。
已弃用的 k8s.gcr.io 仓库最终将被淘汰。有关这一变更的细节或若想查看你是否受到影响，参阅
[k8s.gcr.io 重定向到 registry.k8s.io - 用户须知](/zh-cn/blog/2023/03/10/image-registry-redirect/)。

<!--
## A note about the Kubernetes community-owned package repositories

Earlier in 2023, the Kubernetes project [introduced](/blog/2023/08/15/pkgs-k8s-io-introduction/) `pkgs.k8s.io`, community-owned software repositories for Debian and RPM packages. The community-owned repositories replaced the legacy Google-owned repositories (`apt.kubernetes.io` and `yum.kubernetes.io`).
On September 13, 2023, those legacy repositories were formally deprecated and their contents frozen.
-->
## Kubernetes 社区自治软件包仓库相关说明

在 2023 年年初，Kubernetes 项目[引入了](/zh-cn/blog/2023/08/15/pkgs-k8s-io-introduction/) `pkgs.k8s.io`,
这是 Debian 和 RPM 软件包所用的社区自治软件包仓库。这些社区自治的软件包仓库取代了先前由 Google 管理的仓库
（`apt.kubernetes.io` 和 `yum.kubernetes.io`）。在 2023 年 9 月 13 日，这些老旧的仓库被正式弃用，其内容被冻结。

<!--
For more information on this change or to see if you are impacted, please read the [deprecation announcement](/blog/2023/08/31/legacy-package-repository-deprecation/).
-->
有关这一变更的细节或你若想查看是否受到影响，
请参阅[弃用公告](/zh-cn/blog/2023/08/31/legacy-package-repository-deprecation/)。

<!--
## Deprecations and removals for Kubernetes v1.29

See the official list of [API removals](/docs/reference/using-api/deprecation-guide/#v1-29) for a full list of planned deprecations for Kubernetes v1.29.
-->
## Kubernetes v1.29 的弃用和移除说明

有关 Kubernetes v1.29 计划弃用的完整列表，
参见官方 [API 移除](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-29)列表。

<!--
### Removal of in-tree integrations with cloud providers ([KEP-2395](https://kep.k8s.io/2395))

The [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) `DisableCloudProviders` and `DisableKubeletCloudCredentialProviders` will both be set to `true` by default for Kubernetes v1.29. This change will require that users who are currently using in-tree cloud provider integrations (Azure, GCE, or vSphere) enable external cloud controller managers, or opt in to the legacy integration by setting the associated feature gates to `false`.
-->
### 移除与云驱动的内部集成（[KEP-2395](https://kep.k8s.io/2395)）

对于 Kubernetes v1.29，默认特性门控 `DisableCloudProviders` 和 `DisableKubeletCloudCredentialProviders`
都将被设置为 `true`。这个变更将要求当前正在使用内部云驱动集成（Azure、GCE 或 vSphere）的用户启用外部云控制器管理器，
或者将关联的特性门控设置为 `false` 以选择传统的集成方式。

<!--
Enabling external cloud controller managers means you must run a suitable cloud controller manager within your cluster's control plane; it also requires setting the command line argument `--cloud-provider=external` for the kubelet (on every relevant node), and across the control plane (kube-apiserver and kube-controller-manager).
-->
启用外部云控制器管理器意味着你必须在集群的控制平面中运行一个合适的云控制器管理器；
同时还需要为 kubelet（在每个相关节点上）及整个控制平面（kube-apiserver 和 kube-controller-manager）
设置命令行参数 `--cloud-provider=external`。

<!--
For more information about how to enable and run external cloud controller managers, read [Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/) and [Migrate Replicated Control Plane To Use Cloud Controller Manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/).

For general information about cloud controller managers, please see
[Cloud Controller Manager](/docs/concepts/architecture/cloud-controller/) in the Kubernetes documentation.
-->
有关如何启用和运行外部云控制器管理器的细节，
参阅[管理云控制器管理器](/zh-cn/docs/tasks/administer-cluster/running-cloud-controller/)和
[迁移多副本的控制面以使用云控制器管理器](/zh-cn/docs/tasks/administer-cluster/controller-manager-leader-migration/)。

有关云控制器管理器的常规信息，请参阅 Kubernetes
文档中的[云控制器管理器](/zh-cn/docs/concepts/architecture/cloud-controller/)。

<!--
### Removal of the `v1beta2` flow control API group

The _flowcontrol.apiserver.k8s.io/v1beta2_ API version of FlowSchema and PriorityLevelConfiguration will [no longer be served](/docs/reference/using-api/deprecation-guide/#v1-29) in Kubernetes v1.29. 

To prepare for this, you can edit your existing manifests and rewrite client software to use the `flowcontrol.apiserver.k8s.io/v1beta3` API version, available since v1.26. All existing persisted objects are accessible via the new API. Notable changes in `flowcontrol.apiserver.k8s.io/v1beta3` include
that the PriorityLevelConfiguration `spec.limited.assuredConcurrencyShares` field was renamed to `spec.limited.nominalConcurrencyShares`.
-->
### 移除 `v1beta2` 流量控制 API 组

在 Kubernetes v1.29 中，将[不再提供](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-29)
FlowSchema 和 PriorityLevelConfiguration 的 **flowcontrol.apiserver.k8s.io/v1beta2** API 版本。

为了做好准备，你可以编辑现有的清单（Manifest）并重写客户端软件，以使用自 v1.26 起可用的
`flowcontrol.apiserver.k8s.io/v1beta3` API 版本。所有现有的持久化对象都可以通过新的 API 访问。
`flowcontrol.apiserver.k8s.io/v1beta3` 中的显著变化包括将 PriorityLevelConfiguration 的
`spec.limited.assuredConcurrencyShares` 字段更名为 `spec.limited.nominalConcurrencyShares`。

<!--
### Deprecation of the `status.nodeInfo.kubeProxyVersion` field for Node

The `.status.kubeProxyVersion` field for Node objects will be [marked as deprecated](https://github.com/kubernetes/enhancements/issues/4004) in v1.29 in preparation for its removal in a future release. This field is not accurate and is set by kubelet, which does not actually know the kube-proxy version, or even if kube-proxy is running.
-->
### 弃用针对 Node 的 `status.nodeInfo.kubeProxyVersion` 字段

在 v1.29 中，针对 Node 对象的 `.status.kubeProxyVersion` 字段将被
[标记为弃用](https://github.com/kubernetes/enhancements/issues/4004)，
准备在未来某个发行版本中移除。这是因为此字段并不准确，它由 kubelet 设置，
而 kubelet 实际上并不知道 kube-proxy 版本，甚至不知道 kube-proxy 是否在运行。

<!--
## Want to know more?

Deprecations are announced in the Kubernetes release notes. You can see the announcements of pending deprecations in the release notes for:
-->
## 了解更多

弃用信息是在 Kubernetes 发布说明（Release Notes）中公布的。你可以在以下版本的发布说明中看到待弃用的公告：

* [Kubernetes v1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation)
* [Kubernetes v1.26](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.26.md#deprecation)
* [Kubernetes v1.27](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md#deprecation)
* [Kubernetes v1.28](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.28.md#deprecation)

<!--
We will formally announce the deprecations that come with [Kubernetes v1.29](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md#deprecation) as part of the CHANGELOG for that release.

For information on the deprecation and removal process, refer to the official Kubernetes [deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) document.
-->
我们将在
[Kubernetes v1.29](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md#deprecation)
的 CHANGELOG 中正式宣布与该版本相关的弃用信息。

有关弃用和移除流程的细节，参阅 Kubernetes
官方[弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api)文档。
