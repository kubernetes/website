---
layout: blog
title: "Kubernetes 1.24 中的移除和棄用"
date: 2022-04-07
slug: upcoming-changes-in-kubernetes-1-24
---
<!--
layout: blog
title: "Kubernetes Removals and Deprecations In 1.24"
date: 2022-04-07
slug: upcoming-changes-in-kubernetes-1-24
-->

<!--
**Author**: Mickey Boxell (Oracle)

As Kubernetes evolves, features and APIs are regularly revisited and removed. New features may offer
an alternative or improved approach to solving existing problems, motivating the team to remove the
old approach. 
-->
**作者**：Mickey Boxell (Oracle)

隨着 Kubernetes 的發展，一些特性和 API 會被定期重檢和移除。
新特性可能會提供替代或改進的方法，來解決現有的問題，從而激勵團隊移除舊的方法。

<!--
We want to make sure you are aware of the changes coming in the Kubernetes 1.24 release. The release will 
**deprecate** several (beta) APIs in favor of stable versions of the same APIs. The major change coming 
in the Kubernetes 1.24 release is the 
[removal of Dockershim](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim). 
This is discussed below and will be explored in more depth at release time. For an early look at the 
changes coming in Kubernetes 1.24, take a look at the in-progress 
[CHANGELOG](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md).
-->
我們希望確保你瞭解 Kubernetes 1.24 版本的變化。該版本將 **棄用** 一些（測試版/beta）API，
轉而支持相同 API 的穩定版本。Kubernetes 1.24
版本的主要變化是[移除 Dockershim](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim)。
這將在下面討論，並將在發佈時更深入地探討。
要提前瞭解 Kubernetes 1.24 中的更改，請查看正在更新中的
[CHANGELOG](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md)。

<!--
## A note about Dockershim

It's safe to say that the removal receiving the most attention with the release of Kubernetes 1.24 
is Dockershim. Dockershim was deprecated in v1.20. As noted in the [Kubernetes 1.20 changelog](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md#deprecation): 
"Docker support in the kubelet is now deprecated and will be removed in a future release. The kubelet 
uses a module called "dockershim" which implements CRI support for Docker and it has seen maintenance 
issues in the Kubernetes community." With the upcoming release of Kubernetes 1.24, the Dockershim will 
finally be removed. 
-->
## 關於 Dockershim  {#a-note-about-dockershim}

可以肯定地說，隨着 Kubernetes 1.24 的發佈，最受關注的是移除 Dockershim。
Dockershim 在 1.20 版本中已被棄用。如
[Kubernetes 1.20 變更日誌](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md#deprecation)中所述：
"Docker support in the kubelet is now deprecated and will be removed in a future release. The kubelet
uses a module called "dockershim" which implements CRI support for Docker and it has seen maintenance
issues in the Kubernetes community."
隨着即將發佈的 Kubernetes 1.24，Dockershim 將最終被移除。

<!--
In the article [Don't Panic: Kubernetes and Docker](/blog/2020/12/02/dont-panic-kubernetes-and-docker/),
the authors succinctly captured the change's impact and encouraged users to remain calm: 
> Docker as an underlying runtime is being deprecated in favor of runtimes that use the
> Container Runtime Interface (CRI) created for Kubernetes. Docker-produced images
> will continue to work in your cluster with all runtimes, as they always have.
-->
在文章[別慌: Kubernetes 和 Docker](/zh-cn/blog/2020/12/02/dont-panic-kubernetes-and-docker/) 中，
作者簡潔地記述了變化的影響，並鼓勵使用者保持冷靜：
> 棄用 Docker 這個底層運行時，轉而支持符合爲 Kubernetes 創建的容器運行接口
> Container Runtime Interface (CRI) 的運行時。
> Docker 構建的映像檔，將在你的叢集的所有運行時中繼續工作，一如既往。

<!--
Several guides have been created with helpful information about migrating from dockershim
to container runtimes that are directly compatible with Kubernetes. You can find them on the
[Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/)
page in the Kubernetes documentation.
-->
已經有一些文檔指南，提供了關於從 dockershim 遷移到與 Kubernetes 直接兼容的容器運行時的有用信息。
你可以在 Kubernetes 文檔中的[從 dockershim 遷移](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/)
頁面上找到它們。

<!--
For more information about why Kubernetes is moving away from dockershim, check out the aptly 
named: [Kubernetes is Moving on From Dockershim](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/) 
and the [updated dockershim removal FAQ](/blog/2022/02/17/dockershim-faq/).

Take a look at the [Is Your Cluster Ready for v1.24?](/blog/2022/03/31/ready-for-dockershim-removal/) post to learn about how to ensure your cluster continues to work after upgrading from v1.23 to v1.24. 
-->
有關 Kubernetes 爲何不再使用 dockershim 的更多信息，
請參見：[Kubernetes 即將移除 Dockershim](/zh-cn/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/)
和[最新的棄用 Dockershim 的常見問題](/zh-cn/blog/2022/02/17/dockershim-faq/)。

查看[你的叢集準備好使用 v1.24 版本了嗎？](/zh-cn/blog/2022/03/31/ready-for-dockershim-removal/)一文，
瞭解如何確保你的叢集在從 1.23 版本升級到 1.24 版本後繼續工作。

<!--
## The Kubernetes API removal and deprecation process

Kubernetes contains a large number of components that evolve over time. In some cases, this 
evolution results in APIs, flags, or entire features, being removed. To prevent users from facing 
breaking changes, Kubernetes contributors adopted a feature [deprecation policy](/docs/reference/using-api/deprecation-policy/). 
This policy ensures that stable APIs may only be deprecated when a newer stable version of that 
same API is available and that APIs have a minimum lifetime as indicated by the following stability levels: 

* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes. 
* Beta or pre-release API versions must be supported for 3 releases after deprecation. 
* Alpha or experimental API versions may be removed in any release without prior deprecation notice. 
-->
## Kubernetes API 移除和棄用流程  {#the-Kubernetes-api-removal-and-deprecation-process}

Kubernetes 包含大量隨時間演變的組件。在某些情況下，這種演變會導致 API、標誌或整個特性被移除。
爲了防止使用者面對重大變化，Kubernetes 貢獻者採用了一項特性[棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
此策略確保僅當同一 API 的較新穩定版本可用並且
API 具有以下穩定性級別所指示的最短生命週期時，纔可能棄用穩定版本 API：

* 正式發佈 (GA) 或穩定的 API 版本可能被標記爲已棄用，但不得在 Kubernetes 的主版本中移除。
* 測試版（beta）或預發佈 API 版本在棄用後必須支持 3 個版本。
* Alpha 或實驗性 API 版本可能會在任何版本中被移除，恕不另行通知。

<!--
Removals follow the same deprecation policy regardless of whether an API is removed due to a beta feature 
graduating to stable or because that API was not proven to be successful. Kubernetes will continue to make 
sure migration options are documented whenever APIs are removed. 
-->
移除遵循相同的棄用政策，無論 API 是由於 測試版（beta）功能逐漸穩定還是因爲該
API 未被證明是成功的而被移除。
Kubernetes 將繼續確保在移除 API 時提供用來遷移的文檔。

<!--
**Deprecated** APIs are those that have been marked for removal in a future Kubernetes release. **Removed** 
APIs are those that are no longer available for use in current, supported Kubernetes versions after having 
been deprecated. These removals have been superseded by newer, stable/generally available (GA) APIs. 
-->
**棄用的** API 是指那些已標記爲在未來 Kubernetes 版本中移除的 API。
**移除的** API 是指那些在被棄用後不再可用於當前受支持的 Kubernetes 版本的 API。
這些移除的 API 已被更新的、穩定的/普遍可用的 (GA) API 所取代。

<!--
## API removals, deprecations, and other changes for Kubernetes 1.24

* [Dynamic kubelet configuration](https://github.com/kubernetes/enhancements/issues/281): `DynamicKubeletConfig` is used to enable the dynamic configuration of the kubelet. The `DynamicKubeletConfig` flag was deprecated in Kubernetes 1.22. In v1.24, this feature gate will be removed from the kubelet. Refer to the ["Dynamic kubelet config is removed" KEP](https://github.com/kubernetes/enhancements/issues/281) for more information.
-->
## Kubernetes 1.24 的 API 移除、棄用和其他更改  {#api-removals-deprecations-and-other-changes-for-kubernetes-1.24}

* [動態 kubelet 設定](https://github.com/kubernetes/enhancements/issues/281): `DynamicKubeletConfig`
  用於啓用 kubelet 的動態設定。Kubernetes 1.22 中棄用 `DynamicKubeletConfig` 標誌。
  在 1.24 版本中，此特性門控將從 kubelet 中移除。
  更多詳細信息，請參閱[“移除動態 kubelet 設定” 的 KEP](https://github.com/kubernetes/enhancements/issues/281)。
<!--
* [Dynamic log sanitization](https://github.com/kubernetes/kubernetes/pull/107207): The experimental dynamic log sanitization feature is deprecated and will be removed in v1.24. This feature introduced a logging filter that could be applied to all Kubernetes system components logs to prevent various types of sensitive information from leaking via logs. Refer to [KEP-1753: Kubernetes system components logs sanitization](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1753-logs-sanitization#deprecation) for more information and an [alternative approach](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1753-logs-sanitization#alternatives=).
-->
* [動態日誌清洗](https://github.com/kubernetes/kubernetes/pull/107207)：實驗性的動態日誌清洗功能已被棄用，
  將在 1.24 版本中被移除。該功能引入了一個日誌過濾器，可以應用於所有 Kubernetes 系統組件的日誌，
  以防止各種類型的敏感信息通過日誌泄漏。有關更多信息和替代方法，請參閱
  [KEP-1753: Kubernetes 系統組件日誌清洗](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1753-logs-sanitization#deprecation)。
<!--
* [Removing Dockershim from kubelet](https://github.com/kubernetes/enhancements/issues/2221): the Container Runtime Interface (CRI) for Docker (i.e. Dockershim) is currently a built-in container runtime in the kubelet code base. It was deprecated in v1.20. As of v1.24, the kubelet will no longer have dockershim. Check out this blog on [what you need to do be ready for v1.24](/blog/2022/03/31/ready-for-dockershim-removal/). 
-->
* [從 kubelet 中移除 Dockershim](https://github.com/kubernetes/enhancements/issues/2221)：Docker
  的容器運行時接口(CRI)（即 Dockershim）目前是 kubelet 代碼中內置的容器運行時。它在 1.20 版本中已被棄用。
  從 1.24 版本開始，kubelet 已經移除 dockershim。查看這篇博客，
  [瞭解你需要爲 1.24 版本做些什麼](/blog/2022/03/31/ready-for-dockershim-removal/)。
<!--
* [Storage capacity tracking for pod scheduling](https://github.com/kubernetes/enhancements/issues/1472): The CSIStorageCapacity API supports exposing currently available storage capacity via CSIStorageCapacity objects and enhances scheduling of pods that use CSI volumes with late binding. In v1.24, the CSIStorageCapacity API will be stable. The API graduating to stable initates the deprecation of the v1beta1 CSIStorageCapacity API. Refer to the [Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1472-storage-capacity-tracking) for more information.
-->
* [Pod 調度的存儲容量追蹤](https://github.com/kubernetes/enhancements/issues/1472)：CSIStorageCapacity API
  支持通過 CSIStorageCapacity 對象暴露當前可用的存儲容量，並增強了使用帶有延遲綁定的 CSI 卷的 Pod 的調度。
  CSIStorageCapacity API 自 1.24 版本起提供穩定版本。升級到穩定版的 API 將棄用 v1beta1 CSIStorageCapacity API。
  更多信息請參見 [Pod 調度存儲容量約束 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1472-storage-capacity-tracking)。
<!--
* [The `master` label is no longer present on kubeadm control plane nodes](https://github.com/kubernetes/kubernetes/pull/107533). For new clusters, the label 'node-role.kubernetes.io/master' will no longer be added to control plane nodes, only the label 'node-role.kubernetes.io/control-plane' will be added. For more information, refer to [KEP-2067: Rename the kubeadm "master" label and taint](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cluster-lifecycle/kubeadm/2067-rename-master-label-taint).
-->
* [kubeadm 控制面節點上不再存在 `master` 標籤](https://github.com/kubernetes/kubernetes/pull/107533)。
  對於新叢集，控制平面節點將不再添加 'node-role.kubernetes.io/master' 標籤，
  只會添加 'node-role.kubernetes.io/control-plane' 標籤。更多信息請參考
  [KEP-2067：重命名 kubeadm “master” 標籤和污點](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cluster-lifecycle/kubeadm/2067-rename-master-label-taint)。
<!--
* [VolumeSnapshot v1beta1 CRD will be removed](https://github.com/kubernetes/enhancements/issues/177). Volume snapshot and restore functionality for Kubernetes and the [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI), which provides standardized APIs design (CRDs) and adds PV snapshot/restore support for CSI volume drivers, entered beta in v1.20. VolumeSnapshot v1beta1 was deprecated in v1.21 and is now unsupported. Refer to [KEP-177: CSI Snapshot](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/177-volume-snapshot#kep-177-csi-snapshot) and [kubernetes-csi/external-snapshotter](https://github.com/kubernetes-csi/external-snapshotter/releases/tag/v4.1.0) for more information.
-->
* [VolumeSnapshot v1beta1 CRD 在 1.24 版本中將被移除](https://github.com/kubernetes/enhancements/issues/177)。
  Kubernetes 和 [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI)
  的卷快照和恢復功能，在 1.20 版本中進入測試版。該功能提供標準化 API 設計 (CRD ) 併爲 CSI 卷驅動程序添加了 PV 快照/恢復支持，
  VolumeSnapshot v1beta1 在 1.21 版本中已被棄用，現在不受支持。更多信息請參考
  [KEP-177：CSI 快照](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/177-volume-snapshot#kep-177-csi-snapshot)和
  [kubernetes-csi/external-snapshotter](https://github.com/kubernetes-csi/external-snapshotter/releases/tag/v4.1.0)。
<!--
## What to do

### Dockershim removal

As stated earlier, there are several guides about 
[Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/). 
You can start with [Finding what container runtime are on your nodes](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).
If your nodes are using dockershim, there are other possible Docker Engine dependencies such as 
Pods or third-party tools executing Docker commands or private registries in the Docker configuration file. You can follow the 
[Check whether Dockershim removal affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/) guide to review possible 
Docker Engine dependencies. Before upgrading to v1.24, you decide to either remain using Docker Engine and 
[Migrate Docker Engine nodes from dockershim to cri-dockerd](/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/) or migrate to a CRI-compatible runtime. Here's a guide to 
[change the container runtime on a node from Docker Engine to containerd](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/).
-->
## 需要做什麼  {#what-to-do}

### 移除 Dockershim  {#dockershim-removal}

如前所述，有一些關於從 [dockershim 遷移](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/)的指南。
你可以[從查明節點上所使用的容器運行時](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/)開始。
如果你的節點使用 dockershim，則還有其他可能的 Docker Engine 依賴項，
例如 Pod 或執行 Docker 命令的第三方工具或 Docker 設定文件中的私有映像檔庫。
你可以按照[檢查移除 Dockershim 是否對你有影響](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
的指南來查看可能的 Docker 引擎依賴項。在升級到 1.24 版本之前，你決定要麼繼續使用 Docker Engine 並
[將 Docker Engine 節點從 dockershim 遷移到 cri-dockerd](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)，
要麼遷移到與 CRI 兼容的運行時。這是[將節點上的容器運行時從 Docker Engine 更改爲 containerd](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/) 的指南。

<!--
### `kubectl convert`

The [`kubectl convert`](/docs/tasks/tools/included/kubectl-convert-overview/) plugin for `kubectl` 
can be helpful to address migrating off deprecated APIs. The plugin facilitates the conversion of 
manifests between different API versions, for example, from a deprecated to a non-deprecated API 
version. More general information about the API migration process can be found in the [Deprecated API Migration Guide](/docs/reference/using-api/deprecation-guide/). 
Follow the [install `kubectl convert` plugin](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-kubectl-convert-plugin) 
documentation to download and install the `kubectl-convert` binary. 
-->
### `kubectl convert`  {#kubectl-convert}

kubectl 的 [`kubectl convert`](/zh-cn/docs/tasks/tools/included/kubectl-convert-overview/)
插件有助於解決棄用 API 的遷移問題。該插件方便了不同 API 版本之間清單的轉換，
例如，從棄用的 API 版本到非棄用的 API 版本。
關於 API 遷移過程的更多信息可以在[已棄用 API 的遷移指南](/zh-cn/docs/reference/using-api/deprecation-guide/)中找到。
按照[安裝 `kubectl convert` 插件](/zh-cn/docs/tasks/tools/install-kubectl-linux/#install-kubectl-convert-plugin)
文檔下載並安裝 `kubectl-convert` 二進制文件。

<!--
### Looking ahead

The Kubernetes 1.25 and 1.26 releases planned for later this year will stop serving beta versions 
of several currently stable Kubernetes APIs. The v1.25 release will also remove PodSecurityPolicy, 
which was deprecated with Kubernetes 1.21 and will not graduate to stable. See [PodSecurityPolicy 
Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/) for more information.
-->  
### 展望未來  {#looking-ahead}

計劃在今年晚些時候發佈的 Kubernetes 1.25 和 1.26 版本，將停止提供一些
Kubernetes API 的 Beta 版本，這些 API 當前爲穩定版。1.25 版本還將移除 PodSecurityPolicy，
它已在 Kubernetes 1.21 版本中被棄用，並且不會升級到穩定版。有關詳細信息，請參閱
[PodSecurityPolicy 棄用：過去、現在和未來](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)。

<!--
The official [list of API removals planned for Kubernetes 1.25](/docs/reference/using-api/deprecation-guide/#v1-25) is:
-->
[Kubernetes 1.25 計劃移除的 API 的官方列表](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-25)是：

* Beta CronJob API (batch/v1beta1)
* Beta EndpointSlice API (discovery.k8s.io/v1beta1)
* Beta Event API (events.k8s.io/v1beta1)
* Beta HorizontalPodAutoscaler API (autoscaling/v2beta1)
* Beta PodDisruptionBudget API (policy/v1beta1)
* Beta PodSecurityPolicy API (policy/v1beta1)
* Beta RuntimeClass API (node.k8s.io/v1beta1)

<!--
The official [list of API removals planned for Kubernetes 1.26](/docs/reference/using-api/deprecation-guide/#v1-26) is:

* The beta FlowSchema and PriorityLevelConfiguration APIs (flowcontrol.apiserver.k8s.io/v1beta1)
* The beta HorizontalPodAutoscaler API (autoscaling/v2beta2)
-->
[Kubernetes 1.26 計劃移除的 API 的官方列表](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-26)是：

* Beta FlowSchema 和 PriorityLevelConfiguration API (flowcontrol.apiserver.k8s.io/v1beta1)
* Beta HorizontalPodAutoscaler API (autoscaling/v2beta2)

<!--
### Want to know more?
Deprecations are announced in the Kubernetes release notes. You can see the announcements of pending deprecations in the release notes for:
* [Kubernetes 1.21](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md#deprecation)
* [Kubernetes 1.22](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md#deprecation)
* [Kubernetes 1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)
* We will formally announce the deprecations that come with [Kubernetes 1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation) as part of the CHANGELOG for that release.

For information on the process of deprecation and removal, check out the official Kubernetes [deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) document.
-->
### 瞭解更多 {#want-to-know-more}

Kubernetes 發行說明中宣告了棄用信息。你可以在以下版本的發行說明中看到待棄用的公告：

* [Kubernetes 1.21](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md#deprecation)
* [Kubernetes 1.22](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md#deprecation)
* [Kubernetes 1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)
* 我們將正式宣佈 [Kubernetes 1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation) 的棄用信息，
  作爲該版本 CHANGELOG 的一部分。

有關棄用和移除過程的信息，請查看 Kubernetes 官方[棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api)文檔。
