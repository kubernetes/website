---
layout: blog
title: "Kubernetes 1.26 中的移除、棄用和主要變更"
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
變化是 Kubernetes 生命週期不可分割的一部分：隨着 Kubernetes 成長和日趨成熟，
爲了此項目的健康發展，某些功能特性可能會被棄用、移除或替換爲優化過的功能特性。
Kubernetes v1.26 也做了若干規劃：根據 v1.26 發佈流程中期獲得的資訊，
本文將列舉並描述其中一些變更，這些變更目前仍在進行中，可能會引入更多變更。

<!--
## The Kubernetes API Removal and Deprecation process {#k8s-api-deprecation-process}

The Kubernetes project has a [well-documented deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API is one that has been marked for removal in a future Kubernetes release; it will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.
-->
## Kubernetes API 移除和棄用流程 {#k8s-api-deprecation-process}

Kubernetes 項目對功能特性有一個[文檔完備的棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
該策略規定，只有當較新的、穩定的相同 API 可用時，原有的穩定 API 纔可以被棄用，
每個穩定級別的 API 都有一個最短的生命週期。棄用的 API 指的是已標記爲將在後續發行某個
Kubernetes 版本時移除的 API；移除之前該 API 將繼續發揮作用（從棄用起至少一年時間），
但使用時會顯示一條警告。被移除的 API 將在當前版本中不再可用，此時你必須遷移以使用替換的 API。

<!--
* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.
* Beta or pre-release API versions must be supported for 3 releases after deprecation.
* Alpha or experimental API versions may be removed in any release without prior deprecation notice.
-->
* 正式發佈（GA）或穩定的 API 版本可能被標記爲已棄用，但只有在 Kubernetes 大版本更新時纔會被移除。
* 測試版（Beta）或預發佈 API 版本在棄用後必須在後續 3 個版本中繼續支持。
* Alpha 或實驗性 API 版本可以在任何版本中被移除，不另行通知。

<!--
Whether an API is removed as a result of a feature graduating from beta to stable or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the documentation.
-->
無論一個 API 是因爲某功能特性從 Beta 進入穩定階段而被移除，還是因爲該 API 根本沒有成功，
所有移除均遵從上述棄用策略。無論何時移除一個 API，文檔中都會列出遷移選項。

<!--
## A note about the removal of the CRI `v1alpha2` API and containerd 1.5 support {#cri-api-removal}

Following the adoption of the [Container Runtime Interface](/docs/concepts/architecture/cri/) (CRI) and the [removal of dockershim] in v1.24 , the CRI is the supported and documented way through which Kubernetes interacts with different container runtimes. Each kubelet negotiates which version of CRI to use with the container runtime on that node.
-->
## 有關移除 CRI `v1alpha2` API 和 containerd 1.5 支持的說明 {#cri-api-removal}

在 v1.24 中採用[容器運行時介面](/zh-cn/docs/concepts/architecture/cri/) (CRI)
並[移除 dockershim] 之後，CRI 是 Kubernetes 與不同容器運行時交互所支持和記錄的方式。
每個 kubelet 會協商使用哪個版本的 CRI 來配合該節點上的容器運行時。

<!--
The Kubernetes project recommends using CRI version `v1`; in Kubernetes v1.25 the kubelet can also negotiate the use of CRI `v1alpha2` (which was deprecated along at the same time as adding support for the stable `v1` interface).

Kubernetes v1.26 will not support CRI `v1alpha2`. That [removal](https://github.com/kubernetes/kubernetes/pull/110618) will result in the kubelet not registering the node if the container runtime doesn't support CRI `v1`. This means that containerd minor version 1.5 and older will not be supported in Kubernetes 1.26; if you use containerd, you will need to upgrade to containerd version 1.6.0 or later **before** you upgrade that node to Kubernetes v1.26. Other container runtimes that only support the `v1alpha2` are equally affected: if that affects you, you should contact the container runtime vendor for advice or check their website for additional instructions in how to move forward.
-->
Kubernetes 項目推薦使用 CRI `v1` 版本；在 Kubernetes v1.25 中，kubelet 也可以協商使用
CRI `v1alpha2`（在添加對穩定的 `v1` 介面的支持同時此項被棄用）。

Kubernetes v1.26 將不支持 CRI `v1alpha2`。如果容器運行時不支持 CRI `v1`，
則本次[移除](https://github.com/kubernetes/kubernetes/pull/110618)將導致 kubelet 不註冊節點。
這意味着 Kubernetes 1.26 將不支持 containerd 1.5 小版本及更早的版本；如果你使用 containerd，
則需要升級到 containerd v1.6.0 或更高版本，然後才能將該節點升級到 Kubernetes v1.26。其他僅支持
`v1alpha2` 的容器運行時同樣受到影響。如果此項移除影響到你，
你應該聯繫容器運行時供應商尋求建議或查閱他們的網站以獲取有關如何繼續使用的更多說明。

<!--
If you want to benefit from v1.26 features and still use an older container runtime, you can run an older kubelet. The [supported skew](/releases/version-skew-policy/#kubelet) for the kubelet allows you to run a v1.25 kubelet, which still is still compatible with `v1alpha2` CRI support, even if you upgrade the control plane to the 1.26 minor release of Kubernetes.

As well as container runtimes themselves, that there are tools like [stargz-snapshotter](https://github.com/containerd/stargz-snapshotter) that act as a proxy between kubelet and container runtime and those also might be affected.
-->
如果你既想從 v1.26 特性中獲益又想保持使用較舊的容器運行時，你可以運行較舊的 kubelet。
kubelet [支持的版本偏差](/zh-cn/releases/version-skew-policy/#kubelet)允許你運行
v1.25 的 kubelet，即使你將控制平面升級到了 Kubernetes 1.26 的某個次要版本，kubelet
仍然能兼容 `v1alpha2` CRI。

除了容器運行時本身，還有像 [stargz-snapshotter](https://github.com/containerd/stargz-snapshotter)
這樣的工具充當 kubelet 和容器運行時之間的代理，這些工具也可能會受到影響。

<!--
## Deprecations and removals in Kubernetes v1.26 {#deprecations-removals}

In addition to the above, Kubernetes v1.26 is targeted to include several additional removals and deprecations.
-->
## Kubernetes v1.26 中的棄用和移除 {#deprecations-removals}

除了上述移除外，Kubernetes v1.26 還準備包含更多移除和棄用。

<!--
### Removal of the `v1beta1` flow control API group

The `flowcontrol.apiserver.k8s.io/v1beta1` API version of FlowSchema and PriorityLevelConfiguration [will no longer be served in v1.26](/docs/reference/using-api/deprecation-guide/#flowcontrol-resources-v126). Users should migrate manifests and API clients to use the `flowcontrol.apiserver.k8s.io/v1beta2` API version, available since v1.23.
-->
### 移除 `v1beta1` 流量控制 API 組  {#removal-of-v1beta1-flow-control-api-group}

FlowSchema 和 PriorityLevelConfiguration 的 `flowcontrol.apiserver.k8s.io/v1beta1` API
版本[將不再在 v1.26 中提供](/zh-cn/docs/reference/using-api/deprecation-guide/#flowcontrol-resources-v126)。
使用者應遷移清單和 API 客戶端才能使用自 v1.23 起可用的 `flowcontrol.apiserver.k8s.io/v1beta2` API 版本。

<!--
### Removal of the `v2beta2` HorizontalPodAutoscaler API

The `autoscaling/v2beta2` API version of HorizontalPodAutoscaler [will no longer be served in v1.26](/docs/reference/using-api/deprecation-guide/#horizontalpodautoscaler-v126). Users should migrate manifests and API clients to use the `autoscaling/v2` API version, available since v1.23.
-->
### 移除 `v2beta2` HorizontalPodAutoscaler API  {#removal-of-v2beta2-hpa-api}

HorizontalPodAutoscaler 的 `autoscaling/v2beta2` API
版本[將不再在 v1.26 中提供](/zh-cn/docs/reference/using-api/deprecation-guide/#horizontalpodautoscaler-v126)。
使用者應遷移清單和 API 客戶端以使用自 v1.23 起可用的 `autoscaling/v2` API 版本。

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
### 移除樹內憑證管理代碼   {#removal-of-in-tree-credential-management-code}

在即將發佈的版本中，原來作爲 Kubernetes 一部分的、特定於供應商的身份驗證代碼將從 `client-go` 和 `kubectl`
中[移除](https://github.com/kubernetes/kubernetes/pull/112341)。
現有機制爲兩個特定雲供應商提供身份驗證支持：Azure 和 Google Cloud。
作爲替代方案，Kubernetes 在發佈 v1.26
之前已提供了供應商中立的[身份驗證插件機制](/zh-cn/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)，
你現在就可以切換身份驗證機制。如果你受到影響，你可以查閱有關如何繼續使用
[Azure](https://github.com/Azure/kubelogin#readme) 和
[Google Cloud](https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke)
的更多指導資訊。

<!--
### Removal of `kube-proxy` userspace modes

The `userspace` proxy mode, deprecated for over a year, is [no longer supported on either Linux or Windows](https://github.com/kubernetes/kubernetes/pull/112133) and will be removed in this release. Users should use `iptables` or `ipvs` on Linux, or `kernelspace` on Windows: using `--mode userspace` will now fail.
-->
### 移除 `kube-proxy` userspace 模式   {#removal-of-kube-proxy-userspace-modes}

已棄用一年多的 `userspace` 代理模式[不再受 Linux 或 Windows 支持](https://github.com/kubernetes/kubernetes/pull/112133)，
並將在 v1.26 中被移除。Linux 使用者應使用 `iptables` 或 `ipvs`，Windows 使用者應使用 `kernelspace`：
現在使用 `--mode userspace` 會失敗。

<!--
### Removal of in-tree OpenStack cloud provider

Kubernetes is switching from in-tree code for storage integrations, in favor of the Container Storage Interface (CSI).
As part of this, Kubernetes v1.26 will remove the deprecated in-tree storage integration for OpenStack
(the `cinder` volume type). You should migrate to external cloud provider and CSI driver from
https://github.com/kubernetes/cloud-provider-openstack instead.
For more information, visit [Cinder in-tree to CSI driver migration](https://github.com/kubernetes/enhancements/issues/1489).
-->
### 移除樹內 OpenStack 雲驅動   {#removal-of-in-treee-openstack-cloud-provider}

針對儲存集成，Kubernetes 正在從使用樹內代碼轉向使用容器儲存介面 (CSI)。
作爲這個轉變的一部分，Kubernetes v1.26 將移除已棄用的 OpenStack 樹內儲存集成（`cinder` 卷類型）。
你應該遷移到外部雲驅動或者位於 https://github.com/kubernetes/cloud-provider-openstack 的 CSI 驅動。
有關詳細資訊，請訪問
[Cinder in-tree to CSI driver migration](https://github.com/kubernetes/enhancements/issues/1489)。

<!--
### Removal of the GlusterFS in-tree driver

The in-tree GlusterFS driver was [deprecated in v1.25](/blog/2022/08/23/kubernetes-v1-25-release/#deprecations-and-removals), and will be removed from Kubernetes v1.26.
-->
### 移除 GlusterFS 樹內驅動  {#removal-of-glusterfs-in-tree-driver}

樹內 GlusterFS 驅動在 [v1.25 中被棄用](/zh-cn/blog/2022/08/23/kubernetes-v1-25-release/#deprecations-and-removals)，
且從 Kubernetes v1.26 起將被移除。

<!--
### Deprecation of non-inclusive `kubectl` flag

As part of the implementation effort of the [Inclusive Naming Initiative](https://www.cncf.io/announcements/2021/10/13/inclusive-naming-initiative-announces-new-community-resources-for-a-more-inclusive-future/),
the `--prune-whitelist` flag will be [deprecated](https://github.com/kubernetes/kubernetes/pull/113116), and replaced with `--prune-allowlist`.
Users that use this flag are strongly advised to make the necessary changes prior to the final removal of the flag, in a future release.
-->
### 棄用非包容性的 `kubectl` 標誌   {#deprecation-of-non-inclusive-kubectl-flag}

作爲[包容性命名倡議（Inclusive Naming Initiative）](https://www.cncf.io/announcements/2021/10/13/inclusive-naming-initiative-announces-new-community-resources-for-a-more-inclusive-future/)的實現工作的一部分，
`--prune-whitelist` 標誌將被[棄用](https://github.com/kubernetes/kubernetes/pull/113116)，並替換爲 `--prune-allowlist`。
強烈建議使用此標誌的使用者在未來某個版本中最終移除該標誌之前進行必要的變更。

<!--
### Removal of dynamic kubelet configuration

_Dynamic kubelet configuration_ allowed [new kubelet configurations to be rolled out via the Kubernetes API](https://github.com/kubernetes/enhancements/tree/2cd758cc6ab617a93f578b40e97728261ab886ed/keps/sig-node/281-dynamic-kubelet-configuration), even in a live cluster.
A cluster operator could reconfigure the kubelet on a Node by specifying a ConfigMap
that contained the configuration data that the kubelet should use.
Dynamic kubelet configuration was removed from the kubelet in v1.24, and will be
[removed from the API server](https://github.com/kubernetes/kubernetes/pull/112643) in the v1.26 release.
-->
### 移除動態 kubelet 設定   {#removal-of-dynamic-kubelet-config}

**動態 kubelet 設定**
允許[通過 Kubernetes API 推出新的 kubelet 設定](https://github.com/kubernetes/enhancements/tree/2cd758cc6ab617a93f578b40e97728261ab886ed/keps/sig-node/281-dynamic-kubelet-configuration)，
甚至能在運作中叢集上完成此操作。叢集操作員可以通過指定包含 kubelet 應使用的設定資料的 ConfigMap
來重新設定節點上的 kubelet。動態 kubelet 設定已在 v1.24 中從 kubelet 中移除，並將在 v1.26
版本中[從 API 伺服器中移除](https://github.com/kubernetes/kubernetes/pull/112643)。

<!--
### Deprecations for `kube-apiserver` command line arguments

The `--master-service-namespace` command line argument to the kube-apiserver doesn't have
any effect, and was already informally [deprecated](https://github.com/kubernetes/kubernetes/pull/38186).
That command line argument will be formally marked as deprecated in v1.26, preparing for its
removal in a future release.
The Kubernetes project does not expect any impact from this deprecation and removal.
-->
### 棄用 `kube-apiserver` 命令列參數   {#deprecations-for-kube-apiserver-command-line-arg}

`--master-service-namespace` 命令列參數對 kube-apiserver 沒有任何效果，
並且已經被非正式地[被棄用](https://github.com/kubernetes/kubernetes/pull/38186)。
該命令列參數將在 v1.26 中正式標記爲棄用，準備在未來某個版本中移除。
Kubernetes 項目預期不會因此項棄用和移除受到任何影響。

<!--
### Deprecations for `kubectl run` command line arguments

Several unused option arguments for the `kubectl run` subcommand will be [marked as deprecated](https://github.com/kubernetes/kubernetes/pull/112261), including:
-->
### 棄用 `kubectl run` 命令列參數   {#deprecations-for-kubectl-run-command-line-arg}

針對 `kubectl run`
子命令若干未使用的選項參數將[被標記爲棄用](https://github.com/kubernetes/kubernetes/pull/112261)，這包括：

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
這些參數已被忽略，因此預計不會產生任何影響：顯式的棄用會設置一條警告消息並準備在未來的某個版本中移除這些參數。

<!--
### Removal of legacy command line arguments relating to logging

Kubernetes v1.26 will [remove](https://github.com/kubernetes/kubernetes/pull/112120) some
command line arguments relating to logging. These command line arguments were
already deprecated.
For more information, see [Deprecate klog specific flags in Kubernetes Components](https://github.com/kubernetes/enhancements/tree/3cb66bd0a1ef973ebcc974f935f0ac5cba9db4b2/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components).
-->
### 移除與日誌相關的原有命令列參數   {#removal-of-legacy-command-line-arg-relating-to-logging}

Kubernetes v1.26 將[移除](https://github.com/kubernetes/kubernetes/pull/112120)一些與日誌相關的命令列參數。
這些命令列參數之前已被棄用。有關詳細資訊，
請參閱[棄用 Kubernetes 組件中的 klog 特定標誌](https://github.com/kubernetes/enhancements/tree/3cb66bd0a1ef973ebcc974f935f0ac5cba9db4b2/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)。

<!--
## Looking ahead {#looking-ahead}

The official list of [API removals](/docs/reference/using-api/deprecation-guide/#v1-27) planned for Kubernetes 1.27 includes:

* All beta versions of the CSIStorageCapacity API; specifically: `storage.k8s.io/v1beta1`
-->
## 展望未來 {#looking-ahead}

Kubernetes 1.27 計劃[移除的 API 官方列表](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-27)包括：

* 所有 Beta 版的 CSIStorageCapacity API；特別是 `storage.k8s.io/v1beta1`

<!--
### Want to know more?

Deprecations are announced in the Kubernetes release notes. You can see the announcements of pending deprecations in the release notes for:
-->
### 瞭解更多   {#want-to-know-more}

Kubernetes 發行說明中宣告了棄用資訊。你可以在以下版本的發行說明中看到待棄用的公告：

* [Kubernetes 1.21](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md#deprecation)
* [Kubernetes 1.22](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md#deprecation)
* [Kubernetes 1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)
* [Kubernetes 1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation)
* [Kubernetes 1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation)

<!--
We will formally announce the deprecations that come with [Kubernetes 1.26](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.26.md#deprecation) as part of the CHANGELOG for that release.
-->
我們將在
[Kubernetes 1.26](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.26.md#deprecation)
的 CHANGELOG 中正式宣佈該版本的棄用資訊。
