---
layout: blog
title: "Kubernetes 1.26 中的移除、弃用和主要变更"
date: 2022-11-18
slug: upcoming-changes-in-kubernetes-1-26
---
<!--
layout: blog
title: "Kubernetes Removals, Deprecations, and Major Changes in 1.26"
date: 2022-11-18
slug: upcoming-changes-in-kubernetes-1-26
-->

<!--
**Author**: Frederico Muñoz (SAS)
-->
**作者** ：Frederico Muñoz (SAS)

<!--
Change is an integral part of the Kubernetes life-cycle: as Kubernetes grows and matures, features may be deprecated, removed, or replaced with improvements for the health of the project. For Kubernetes v1.26 there are several planned: this article identifies and describes some of them, based on the information available at this mid-cycle point in the v1.26 release process, which is still ongoing and can introduce additional changes.
-->
变化是 Kubernetes 生命周期不可分割的一部分：随着 Kubernetes 成长和日趋成熟，
为了此项目的健康发展，某些功能特性可能会被弃用、移除或替换为优化过的功能特性。
Kubernetes v1.26 也做了若干规划：根据 v1.26 发布流程中期获得的信息，
本文将列举并描述其中一些变更，这些变更目前仍在进行中，可能会引入更多变更。

<!--
## The Kubernetes API Removal and Deprecation process {#k8s-api-deprecation-process}

The Kubernetes project has a [well-documented deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API is one that has been marked for removal in a future Kubernetes release; it will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.
-->
## Kubernetes API 移除和弃用流程 {#k8s-api-deprecation-process}

Kubernetes 项目对功能特性有一个[文档完备的弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
该策略规定，只有当较新的、稳定的相同 API 可用时，原有的稳定 API 才可以被弃用，
每个稳定级别的 API 都有一个最短的生命周期。弃用的 API 指的是已标记为将在后续发行某个
Kubernetes 版本时移除的 API；移除之前该 API 将继续发挥作用（从弃用起至少一年时间），
但使用时会显示一条警告。被移除的 API 将在当前版本中不再可用，此时你必须迁移以使用替换的 API。

<!--
* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.
* Beta or pre-release API versions must be supported for 3 releases after deprecation.
* Alpha or experimental API versions may be removed in any release without prior deprecation notice.
-->
* 正式发布（GA）或稳定的 API 版本可能被标记为已弃用，但只有在 Kubernetes 大版本更新时才会被移除。
* 测试版（Beta）或预发布 API 版本在弃用后必须在后续 3 个版本中继续支持。
* Alpha 或实验性 API 版本可以在任何版本中被移除，不另行通知。

<!--
Whether an API is removed as a result of a feature graduating from beta to stable or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the documentation.
-->
无论一个 API 是因为某功能特性从 Beta 进入稳定阶段而被移除，还是因为该 API 根本没有成功，
所有移除均遵从上述弃用策略。无论何时移除一个 API，文档中都会列出迁移选项。

<!--
## A note about the removal of the CRI `v1alpha2` API and containerd 1.5 support {#cri-api-removal}

Following the adoption of the [Container Runtime Interface](/docs/concepts/architecture/cri/) (CRI) and the [removal of dockershim] in v1.24 , the CRI is the supported and documented way through which Kubernetes interacts with different container runtimes. Each kubelet negotiates which version of CRI to use with the container runtime on that node.
-->
## 有关移除 CRI `v1alpha2` API 和 containerd 1.5 支持的说明 {#cri-api-removal}

在 v1.24 中采用[容器运行时接口](/zh-cn/docs/concepts/architecture/cri/) (CRI)
并[移除 dockershim] 之后，CRI 是 Kubernetes 与不同容器运行时交互所支持和记录的方式。
每个 kubelet 会协商使用哪个版本的 CRI 来配合该节点上的容器运行时。

<!--
The Kubernetes project recommends using CRI version `v1`; in Kubernetes v1.25 the kubelet can also negotiate the use of CRI `v1alpha2` (which was deprecated along at the same time as adding support for the stable `v1` interface).

Kubernetes v1.26 will not support CRI `v1alpha2`. That [removal](https://github.com/kubernetes/kubernetes/pull/110618) will result in the kubelet not registering the node if the container runtime doesn't support CRI `v1`. This means that containerd minor version 1.5 and older will not be supported in Kubernetes 1.26; if you use containerd, you will need to upgrade to containerd version 1.6.0 or later **before** you upgrade that node to Kubernetes v1.26. Other container runtimes that only support the `v1alpha2` are equally affected: if that affects you, you should contact the container runtime vendor for advice or check their website for additional instructions in how to move forward.
-->
Kubernetes 项目推荐使用 CRI `v1` 版本；在 Kubernetes v1.25 中，kubelet 也可以协商使用
CRI `v1alpha2`（在添加对稳定的 `v1` 接口的支持同时此项被弃用）。

Kubernetes v1.26 将不支持 CRI `v1alpha2`。如果容器运行时不支持 CRI `v1`，
则本次[移除](https://github.com/kubernetes/kubernetes/pull/110618)将导致 kubelet 不注册节点。
这意味着 Kubernetes 1.26 将不支持 containerd 1.5 小版本及更早的版本；如果你使用 containerd，
则需要升级到 containerd v1.6.0 或更高版本，然后才能将该节点升级到 Kubernetes v1.26。其他仅支持
`v1alpha2` 的容器运行时同样受到影响。如果此项移除影响到你，
你应该联系容器运行时供应商寻求建议或查阅他们的网站以获取有关如何继续使用的更多说明。

<!--
If you want to benefit from v1.26 features and still use an older container runtime, you can run an older kubelet. The [supported skew](/releases/version-skew-policy/#kubelet) for the kubelet allows you to run a v1.25 kubelet, which still is still compatible with `v1alpha2` CRI support, even if you upgrade the control plane to the 1.26 minor release of Kubernetes.

As well as container runtimes themselves, that there are tools like [stargz-snapshotter](https://github.com/containerd/stargz-snapshotter) that act as a proxy between kubelet and container runtime and those also might be affected.
-->
如果你既想从 v1.26 特性中获益又想保持使用较旧的容器运行时，你可以运行较旧的 kubelet。
kubelet [支持的版本偏差](/zh-cn/releases/version-skew-policy/#kubelet)允许你运行
v1.25 的 kubelet，即使你将控制平面升级到了 Kubernetes 1.26 的某个次要版本，kubelet
仍然能兼容 `v1alpha2` CRI。

除了容器运行时本身，还有像 [stargz-snapshotter](https://github.com/containerd/stargz-snapshotter)
这样的工具充当 kubelet 和容器运行时之间的代理，这些工具也可能会受到影响。

<!--
## Deprecations and removals in Kubernetes v1.26 {#deprecations-removals}

In addition to the above, Kubernetes v1.26 is targeted to include several additional removals and deprecations.
-->
## Kubernetes v1.26 中的弃用和移除 {#deprecations-removals}

除了上述移除外，Kubernetes v1.26 还准备包含更多移除和弃用。

<!--
### Removal of the `v1beta1` flow control API group

The `flowcontrol.apiserver.k8s.io/v1beta1` API version of FlowSchema and PriorityLevelConfiguration [will no longer be served in v1.26](/docs/reference/using-api/deprecation-guide/#flowcontrol-resources-v126). Users should migrate manifests and API clients to use the `flowcontrol.apiserver.k8s.io/v1beta2` API version, available since v1.23.
-->
### 移除 `v1beta1` 流量控制 API 组  {#removal-of-v1beta1-flow-control-api-group}

FlowSchema 和 PriorityLevelConfiguration 的 `flowcontrol.apiserver.k8s.io/v1beta1` API
版本[将不再在 v1.26 中提供](/zh-cn/docs/reference/using-api/deprecation-guide/#flowcontrol-resources-v126)。
用户应迁移清单和 API 客户端才能使用自 v1.23 起可用的 `flowcontrol.apiserver.k8s.io/v1beta2` API 版本。

<!--
### Removal of the `v2beta2` HorizontalPodAutoscaler API

The `autoscaling/v2beta2` API version of HorizontalPodAutoscaler [will no longer be served in v1.26](/docs/reference/using-api/deprecation-guide/#horizontalpodautoscaler-v126). Users should migrate manifests and API clients to use the `autoscaling/v2` API version, available since v1.23.
-->
### 移除 `v2beta2` HorizontalPodAutoscaler API  {#removal-of-v2beta2-hpa-api}

HorizontalPodAutoscaler 的 `autoscaling/v2beta2` API
版本[将不再在 v1.26 中提供](/zh-cn/docs/reference/using-api/deprecation-guide/#horizontalpodautoscaler-v126)。
用户应迁移清单和 API 客户端以使用自 v1.23 起可用的 `autoscaling/v2` API 版本。

<!--
### Removal of in-tree credential management code

In this upcoming release, legacy vendor-specific authentication code that is part of Kubernetes
will be [removed](https://github.com/kubernetes/kubernetes/pull/112341) from both
`client-go` and `kubectl`.
The existing mechanism supports authentication for two specific cloud providers:
Azure and Google Cloud.
In its place, Kubernetes already offers a vendor-neutral
[authentication plugin mechanism](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins) -
you can switch over right now, before the v1.26 release happens.
If you're affected, you can find additional guidance on how to proceed for
[Azure](https://github.com/Azure/kubelogin#readme) and for
[Google Cloud](https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke).
-->
### 移除树内凭证管理代码   {#removal-of-in-tree-credential-management-code}

在即将发布的版本中，原来作为 Kubernetes 一部分的、特定于供应商的身份验证代码将从 `client-go` 和 `kubectl`
中[移除](https://github.com/kubernetes/kubernetes/pull/112341)。
现有机制为两个特定云供应商提供身份验证支持：Azure 和 Google Cloud。
作为替代方案，Kubernetes 在发布 v1.26
之前已提供了供应商中立的[身份验证插件机制](/zh-cn/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)，
你现在就可以切换身份验证机制。如果你受到影响，你可以查阅有关如何继续使用
[Azure](https://github.com/Azure/kubelogin#readme) 和
[Google Cloud](https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke)
的更多指导信息。

<!--
### Removal of `kube-proxy` userspace modes

The `userspace` proxy mode, deprecated for over a year, is [no longer supported on either Linux or Windows](https://github.com/kubernetes/kubernetes/pull/112133) and will be removed in this release. Users should use `iptables` or `ipvs` on Linux, or `kernelspace` on Windows: using `--mode userspace` will now fail.
-->
### 移除 `kube-proxy` userspace 模式   {#removal-of-kube-proxy-userspace-modes}

已弃用一年多的 `userspace` 代理模式[不再受 Linux 或 Windows 支持](https://github.com/kubernetes/kubernetes/pull/112133)，
并将在 v1.26 中被移除。Linux 用户应使用 `iptables` 或 `ipvs`，Windows 用户应使用 `kernelspace`：
现在使用 `--mode userspace` 会失败。

<!--
### Removal of in-tree OpenStack cloud provider

Kubernetes is switching from in-tree code for storage integrations, in favor of the Container Storage Interface (CSI).
As part of this, Kubernetes v1.26 will remove the deprecated in-tree storage integration for OpenStack
(the `cinder` volume type). You should migrate to external cloud provider and CSI driver from
https://github.com/kubernetes/cloud-provider-openstack instead.
For more information, visit [Cinder in-tree to CSI driver migration](https://github.com/kubernetes/enhancements/issues/1489).
-->
### 移除树内 OpenStack 云驱动   {#removal-of-in-treee-openstack-cloud-provider}

针对存储集成，Kubernetes 正在从使用树内代码转向使用容器存储接口 (CSI)。
作为这个转变的一部分，Kubernetes v1.26 将移除已弃用的 OpenStack 树内存储集成（`cinder` 卷类型）。
你应该迁移到外部云驱动或者位于 https://github.com/kubernetes/cloud-provider-openstack 的 CSI 驱动。
有关详细信息，请访问
[Cinder in-tree to CSI driver migration](https://github.com/kubernetes/enhancements/issues/1489)。

<!--
### Removal of the GlusterFS in-tree driver

The in-tree GlusterFS driver was [deprecated in v1.25](/blog/2022/08/23/kubernetes-v1-25-release/#deprecations-and-removals), and will be removed from Kubernetes v1.26.
-->
### 移除 GlusterFS 树内驱动  {#removal-of-glusterfs-in-tree-driver}

树内 GlusterFS 驱动在 [v1.25 中被弃用](/zh-cn/blog/2022/08/23/kubernetes-v1-25-release/#deprecations-and-removals)，
且从 Kubernetes v1.26 起将被移除。

<!--
### Deprecation of non-inclusive `kubectl` flag

As part of the implementation effort of the [Inclusive Naming Initiative](https://www.cncf.io/announcements/2021/10/13/inclusive-naming-initiative-announces-new-community-resources-for-a-more-inclusive-future/),
the `--prune-whitelist` flag will be [deprecated](https://github.com/kubernetes/kubernetes/pull/113116), and replaced with `--prune-allowlist`.
Users that use this flag are strongly advised to make the necessary changes prior to the final removal of the flag, in a future release.
-->
### 弃用非包容性的 `kubectl` 标志   {#deprecation-of-non-inclusive-kubectl-flag}

作为[包容性命名倡议（Inclusive Naming Initiative）](https://www.cncf.io/announcements/2021/10/13/inclusive-naming-initiative-announces-new-community-resources-for-a-more-inclusive-future/)的实现工作的一部分，
`--prune-whitelist` 标志将被[弃用](https://github.com/kubernetes/kubernetes/pull/113116)，并替换为 `--prune-allowlist`。
强烈建议使用此标志的用户在未来某个版本中最终移除该标志之前进行必要的变更。

<!--
### Removal of dynamic kubelet configuration

_Dynamic kubelet configuration_ allowed [new kubelet configurations to be rolled out via the Kubernetes API](https://github.com/kubernetes/enhancements/tree/2cd758cc6ab617a93f578b40e97728261ab886ed/keps/sig-node/281-dynamic-kubelet-configuration), even in a live cluster.
A cluster operator could reconfigure the kubelet on a Node by specifying a ConfigMap
that contained the configuration data that the kubelet should use.
Dynamic kubelet configuration was removed from the kubelet in v1.24, and will be
[removed from the API server](https://github.com/kubernetes/kubernetes/pull/112643) in the v1.26 release.
-->
### 移除动态 kubelet 配置   {#removal-of-dynamic-kubelet-config}

**动态 kubelet 配置**
允许[通过 Kubernetes API 推出新的 kubelet 配置](https://github.com/kubernetes/enhancements/tree/2cd758cc6ab617a93f578b40e97728261ab886ed/keps/sig-node/281-dynamic-kubelet-configuration)，
甚至能在运作中集群上完成此操作。集群操作员可以通过指定包含 kubelet 应使用的配置数据的 ConfigMap
来重新配置节点上的 kubelet。动态 kubelet 配置已在 v1.24 中从 kubelet 中移除，并将在 v1.26
版本中[从 API 服务器中移除](https://github.com/kubernetes/kubernetes/pull/112643)。

<!--
### Deprecations for `kube-apiserver` command line arguments

The `--master-service-namespace` command line argument to the kube-apiserver doesn't have
any effect, and was already informally [deprecated](https://github.com/kubernetes/kubernetes/pull/38186).
That command line argument will be formally marked as deprecated in v1.26, preparing for its
removal in a future release.
The Kubernetes project does not expect any impact from this deprecation and removal.
-->
### 弃用 `kube-apiserver` 命令行参数   {#deprecations-for-kube-apiserver-command-line-arg}

`--master-service-namespace` 命令行参数对 kube-apiserver 没有任何效果，
并且已经被非正式地[被弃用](https://github.com/kubernetes/kubernetes/pull/38186)。
该命令行参数将在 v1.26 中正式标记为弃用，准备在未来某个版本中移除。
Kubernetes 项目预期不会因此项弃用和移除受到任何影响。

<!--
### Deprecations for `kubectl run` command line arguments

Several unused option arguments for the `kubectl run` subcommand will be [marked as deprecated](https://github.com/kubernetes/kubernetes/pull/112261), including:
-->
### 弃用 `kubectl run` 命令行参数   {#deprecations-for-kubectl-run-command-line-arg}

针对 `kubectl run`
子命令若干未使用的选项参数将[被标记为弃用](https://github.com/kubernetes/kubernetes/pull/112261)，这包括：

* `--cascade`
* `--filename`
* `--force`
* `--grace-period`
* `--kustomize`
* `--recursive`
* `--timeout`
* `--wait`

<!--
These arguments are already ignored so no impact is expected: the explicit deprecation sets a warning message and prepares the removal of the arguments in a future release.
-->
这些参数已被忽略，因此预计不会产生任何影响：显式的弃用会设置一条警告消息并准备在未来的某个版本中移除这些参数。

<!--
### Removal of legacy command line arguments relating to logging

Kubernetes v1.26 will [remove](https://github.com/kubernetes/kubernetes/pull/112120) some
command line arguments relating to logging. These command line arguments were
already deprecated.
For more information, see [Deprecate klog specific flags in Kubernetes Components](https://github.com/kubernetes/enhancements/tree/3cb66bd0a1ef973ebcc974f935f0ac5cba9db4b2/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components).
-->
### 移除与日志相关的原有命令行参数   {#removal-of-legacy-command-line-arg-relating-to-logging}

Kubernetes v1.26 将[移除](https://github.com/kubernetes/kubernetes/pull/112120)一些与日志相关的命令行参数。
这些命令行参数之前已被弃用。有关详细信息，
请参阅[弃用 Kubernetes 组件中的 klog 特定标志](https://github.com/kubernetes/enhancements/tree/3cb66bd0a1ef973ebcc974f935f0ac5cba9db4b2/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)。

<!--
## Looking ahead {#looking-ahead}

The official list of [API removals](/docs/reference/using-api/deprecation-guide/#v1-27) planned for Kubernetes 1.27 includes:

* All beta versions of the CSIStorageCapacity API; specifically: `storage.k8s.io/v1beta1`
-->
## 展望未来 {#looking-ahead}

Kubernetes 1.27 计划[移除的 API 官方列表](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-27)包括：

* 所有 Beta 版的 CSIStorageCapacity API；特别是 `storage.k8s.io/v1beta1`

<!--
### Want to know more?

Deprecations are announced in the Kubernetes release notes. You can see the announcements of pending deprecations in the release notes for:
-->
### 了解更多   {#want-to-know-more}

Kubernetes 发行说明中宣告了弃用信息。你可以在以下版本的发行说明中看到待弃用的公告：

* [Kubernetes 1.21](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md#deprecation)
* [Kubernetes 1.22](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md#deprecation)
* [Kubernetes 1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)
* [Kubernetes 1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation)
* [Kubernetes 1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation)

<!--
We will formally announce the deprecations that come with [Kubernetes 1.26](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.26.md#deprecation) as part of the CHANGELOG for that release.
-->
我们将在
[Kubernetes 1.26](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.26.md#deprecation)
的 CHANGELOG 中正式宣布该版本的弃用信息。
