---
layout: blog
title: "Kubernetes 1.24 中的移除和弃用"
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

随着 Kubernetes 的发展，一些特性和 API 会被定期重检和移除。
新特性可能会提供替代或改进的方法，来解决现有的问题，从而激励团队移除旧的方法。

<!--
We want to make sure you are aware of the changes coming in the Kubernetes 1.24 release. The release will 
**deprecate** several (beta) APIs in favor of stable versions of the same APIs. The major change coming 
in the Kubernetes 1.24 release is the 
[removal of Dockershim](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim). 
This is discussed below and will be explored in more depth at release time. For an early look at the 
changes coming in Kubernetes 1.24, take a look at the in-progress 
[CHANGELOG](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md).
-->
我们希望确保你了解 Kubernetes 1.24 版本的变化。该版本将 **弃用** 一些（测试版/beta）API，
转而支持相同 API 的稳定版本。Kubernetes 1.24
版本的主要变化是[移除 Dockershim](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim)。
这将在下面讨论，并将在发布时更深入地探讨。
要提前了解 Kubernetes 1.24 中的更改，请查看正在更新中的
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
## 关于 Dockershim  {#a-note-about-dockershim}

可以肯定地说，随着 Kubernetes 1.24 的发布，最受关注的是移除 Dockershim。
Dockershim 在 1.20 版本中已被弃用。如
[Kubernetes 1.20 变更日志](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md#deprecation)中所述：
"Docker support in the kubelet is now deprecated and will be removed in a future release. The kubelet
uses a module called "dockershim" which implements CRI support for Docker and it has seen maintenance
issues in the Kubernetes community."
随着即将发布的 Kubernetes 1.24，Dockershim 将最终被移除。

<!--
In the article [Don't Panic: Kubernetes and Docker](/blog/2020/12/02/dont-panic-kubernetes-and-docker/),
the authors succinctly captured the change's impact and encouraged users to remain calm: 
> Docker as an underlying runtime is being deprecated in favor of runtimes that use the
> Container Runtime Interface (CRI) created for Kubernetes. Docker-produced images
> will continue to work in your cluster with all runtimes, as they always have.
-->
在文章[别慌: Kubernetes 和 Docker](/zh-cn/blog/2020/12/02/dont-panic-kubernetes-and-docker/) 中，
作者简洁地记述了变化的影响，并鼓励用户保持冷静：
> 弃用 Docker 这个底层运行时，转而支持符合为 Kubernetes 创建的容器运行接口
> Container Runtime Interface (CRI) 的运行时。
> Docker 构建的镜像，将在你的集群的所有运行时中继续工作，一如既往。

<!--
Several guides have been created with helpful information about migrating from dockershim
to container runtimes that are directly compatible with Kubernetes. You can find them on the
[Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/)
page in the Kubernetes documentation.
-->
已经有一些文档指南，提供了关于从 dockershim 迁移到与 Kubernetes 直接兼容的容器运行时的有用信息。
你可以在 Kubernetes 文档中的[从 dockershim 迁移](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/)
页面上找到它们。

<!--
For more information about why Kubernetes is moving away from dockershim, check out the aptly 
named: [Kubernetes is Moving on From Dockershim](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/) 
and the [updated dockershim removal FAQ](/blog/2022/02/17/dockershim-faq/).

Take a look at the [Is Your Cluster Ready for v1.24?](/blog/2022/03/31/ready-for-dockershim-removal/) post to learn about how to ensure your cluster continues to work after upgrading from v1.23 to v1.24. 
-->
有关 Kubernetes 为何不再使用 dockershim 的更多信息，
请参见：[Kubernetes 即将移除 Dockershim](/zh-cn/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/)
和[最新的弃用 Dockershim 的常见问题](/zh-cn/blog/2022/02/17/dockershim-faq/)。

查看[你的集群准备好使用 v1.24 版本了吗？](/zh-cn/blog/2022/03/31/ready-for-dockershim-removal/)一文，
了解如何确保你的集群在从 1.23 版本升级到 1.24 版本后继续工作。

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
## Kubernetes API 移除和弃用流程  {#the-Kubernetes-api-removal-and-deprecation-process}

Kubernetes 包含大量随时间演变的组件。在某些情况下，这种演变会导致 API、标志或整个特性被移除。
为了防止用户面对重大变化，Kubernetes 贡献者采用了一项特性[弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
此策略确保仅当同一 API 的较新稳定版本可用并且
API 具有以下稳定性级别所指示的最短生命周期时，才可能弃用稳定版本 API：

* 正式发布 (GA) 或稳定的 API 版本可能被标记为已弃用，但不得在 Kubernetes 的主版本中移除。
* 测试版（beta）或预发布 API 版本在弃用后必须支持 3 个版本。
* Alpha 或实验性 API 版本可能会在任何版本中被移除，恕不另行通知。

<!--
Removals follow the same deprecation policy regardless of whether an API is removed due to a beta feature 
graduating to stable or because that API was not proven to be successful. Kubernetes will continue to make 
sure migration options are documented whenever APIs are removed. 
-->
移除遵循相同的弃用政策，无论 API 是由于 测试版（beta）功能逐渐稳定还是因为该
API 未被证明是成功的而被移除。
Kubernetes 将继续确保在移除 API 时提供用来迁移的文档。

<!--
**Deprecated** APIs are those that have been marked for removal in a future Kubernetes release. **Removed** 
APIs are those that are no longer available for use in current, supported Kubernetes versions after having 
been deprecated. These removals have been superseded by newer, stable/generally available (GA) APIs. 
-->
**弃用的** API 是指那些已标记为在未来 Kubernetes 版本中移除的 API。
**移除的** API 是指那些在被弃用后不再可用于当前受支持的 Kubernetes 版本的 API。
这些移除的 API 已被更新的、稳定的/普遍可用的 (GA) API 所取代。

<!--
## API removals, deprecations, and other changes for Kubernetes 1.24

* [Dynamic kubelet configuration](https://github.com/kubernetes/enhancements/issues/281): `DynamicKubeletConfig` is used to enable the dynamic configuration of the kubelet. The `DynamicKubeletConfig` flag was deprecated in Kubernetes 1.22. In v1.24, this feature gate will be removed from the kubelet. Refer to the ["Dynamic kubelet config is removed" KEP](https://github.com/kubernetes/enhancements/issues/281) for more information.
-->
## Kubernetes 1.24 的 API 移除、弃用和其他更改  {#api-removals-deprecations-and-other-changes-for-kubernetes-1.24}

* [动态 kubelet 配置](https://github.com/kubernetes/enhancements/issues/281): `DynamicKubeletConfig`
  用于启用 kubelet 的动态配置。Kubernetes 1.22 中弃用 `DynamicKubeletConfig` 标志。
  在 1.24 版本中，此特性门控将从 kubelet 中移除。
  更多详细信息，请参阅[“移除动态 kubelet 配置” 的 KEP](https://github.com/kubernetes/enhancements/issues/281)。
<!--
* [Dynamic log sanitization](https://github.com/kubernetes/kubernetes/pull/107207): The experimental dynamic log sanitization feature is deprecated and will be removed in v1.24. This feature introduced a logging filter that could be applied to all Kubernetes system components logs to prevent various types of sensitive information from leaking via logs. Refer to [KEP-1753: Kubernetes system components logs sanitization](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1753-logs-sanitization#deprecation) for more information and an [alternative approach](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1753-logs-sanitization#alternatives=).
-->
* [动态日志清洗](https://github.com/kubernetes/kubernetes/pull/107207)：实验性的动态日志清洗功能已被弃用，
  将在 1.24 版本中被移除。该功能引入了一个日志过滤器，可以应用于所有 Kubernetes 系统组件的日志，
  以防止各种类型的敏感信息通过日志泄漏。有关更多信息和替代方法，请参阅
  [KEP-1753: Kubernetes 系统组件日志清洗](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1753-logs-sanitization#deprecation)。
<!--
* [Removing Dockershim from kubelet](https://github.com/kubernetes/enhancements/issues/2221): the Container Runtime Interface (CRI) for Docker (i.e. Dockershim) is currently a built-in container runtime in the kubelet code base. It was deprecated in v1.20. As of v1.24, the kubelet will no longer have dockershim. Check out this blog on [what you need to do be ready for v1.24](/blog/2022/03/31/ready-for-dockershim-removal/). 
-->
* [从 kubelet 中移除 Dockershim](https://github.com/kubernetes/enhancements/issues/2221)：Docker
  的容器运行时接口(CRI)（即 Dockershim）目前是 kubelet 代码中内置的容器运行时。它在 1.20 版本中已被弃用。
  从 1.24 版本开始，kubelet 已经移除 dockershim。查看这篇博客，
  [了解你需要为 1.24 版本做些什么](/blog/2022/03/31/ready-for-dockershim-removal/)。
<!--
* [Storage capacity tracking for pod scheduling](https://github.com/kubernetes/enhancements/issues/1472): The CSIStorageCapacity API supports exposing currently available storage capacity via CSIStorageCapacity objects and enhances scheduling of pods that use CSI volumes with late binding. In v1.24, the CSIStorageCapacity API will be stable. The API graduating to stable initates the deprecation of the v1beta1 CSIStorageCapacity API. Refer to the [Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1472-storage-capacity-tracking) for more information.
-->
* [Pod 调度的存储容量追踪](https://github.com/kubernetes/enhancements/issues/1472)：CSIStorageCapacity API
  支持通过 CSIStorageCapacity 对象暴露当前可用的存储容量，并增强了使用带有延迟绑定的 CSI 卷的 Pod 的调度。
  CSIStorageCapacity API 自 1.24 版本起提供稳定版本。升级到稳定版的 API 将弃用 v1beta1 CSIStorageCapacity API。
  更多信息请参见 [Pod 调度存储容量约束 KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1472-storage-capacity-tracking)。
<!--
* [The `master` label is no longer present on kubeadm control plane nodes](https://github.com/kubernetes/kubernetes/pull/107533). For new clusters, the label 'node-role.kubernetes.io/master' will no longer be added to control plane nodes, only the label 'node-role.kubernetes.io/control-plane' will be added. For more information, refer to [KEP-2067: Rename the kubeadm "master" label and taint](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cluster-lifecycle/kubeadm/2067-rename-master-label-taint).
-->
* [kubeadm 控制面节点上不再存在 `master` 标签](https://github.com/kubernetes/kubernetes/pull/107533)。
  对于新集群，控制平面节点将不再添加 'node-role.kubernetes.io/master' 标签，
  只会添加 'node-role.kubernetes.io/control-plane' 标签。更多信息请参考
  [KEP-2067：重命名 kubeadm “master” 标签和污点](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cluster-lifecycle/kubeadm/2067-rename-master-label-taint)。
<!--
* [VolumeSnapshot v1beta1 CRD will be removed](https://github.com/kubernetes/enhancements/issues/177). Volume snapshot and restore functionality for Kubernetes and the [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI), which provides standardized APIs design (CRDs) and adds PV snapshot/restore support for CSI volume drivers, entered beta in v1.20. VolumeSnapshot v1beta1 was deprecated in v1.21 and is now unsupported. Refer to [KEP-177: CSI Snapshot](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/177-volume-snapshot#kep-177-csi-snapshot) and [kubernetes-csi/external-snapshotter](https://github.com/kubernetes-csi/external-snapshotter/releases/tag/v4.1.0) for more information.
-->
* [VolumeSnapshot v1beta1 CRD 在 1.24 版本中将被移除](https://github.com/kubernetes/enhancements/issues/177)。
  Kubernetes 和 [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI)
  的卷快照和恢复功能，在 1.20 版本中进入测试版。该功能提供标准化 API 设计 (CRD ) 并为 CSI 卷驱动程序添加了 PV 快照/恢复支持，
  VolumeSnapshot v1beta1 在 1.21 版本中已被弃用，现在不受支持。更多信息请参考
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
## 需要做什么  {#what-to-do}

### 移除 Dockershim  {#dockershim-removal}

如前所述，有一些关于从 [dockershim 迁移](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/)的指南。
你可以[从查明节点上所使用的容器运行时](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/)开始。
如果你的节点使用 dockershim，则还有其他可能的 Docker Engine 依赖项，
例如 Pod 或执行 Docker 命令的第三方工具或 Docker 配置文件中的私有镜像库。
你可以按照[检查移除 Dockershim 是否对你有影响](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
的指南来查看可能的 Docker 引擎依赖项。在升级到 1.24 版本之前，你决定要么继续使用 Docker Engine 并
[将 Docker Engine 节点从 dockershim 迁移到 cri-dockerd](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)，
要么迁移到与 CRI 兼容的运行时。这是[将节点上的容器运行时从 Docker Engine 更改为 containerd](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/) 的指南。

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
插件有助于解决弃用 API 的迁移问题。该插件方便了不同 API 版本之间清单的转换，
例如，从弃用的 API 版本到非弃用的 API 版本。
关于 API 迁移过程的更多信息可以在[已弃用 API 的迁移指南](/zh-cn/docs/reference/using-api/deprecation-guide/)中找到。
按照[安装 `kubectl convert` 插件](/zh-cn/docs/tasks/tools/install-kubectl-linux/#install-kubectl-convert-plugin)
文档下载并安装 `kubectl-convert` 二进制文件。

<!--
### Looking ahead

The Kubernetes 1.25 and 1.26 releases planned for later this year will stop serving beta versions 
of several currently stable Kubernetes APIs. The v1.25 release will also remove PodSecurityPolicy, 
which was deprecated with Kubernetes 1.21 and will not graduate to stable. See [PodSecurityPolicy 
Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/) for more information.
-->  
### 展望未来  {#looking-ahead}

计划在今年晚些时候发布的 Kubernetes 1.25 和 1.26 版本，将停止提供一些
Kubernetes API 的 Beta 版本，这些 API 当前为稳定版。1.25 版本还将移除 PodSecurityPolicy，
它已在 Kubernetes 1.21 版本中被弃用，并且不会升级到稳定版。有关详细信息，请参阅
[PodSecurityPolicy 弃用：过去、现在和未来](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)。

<!--
The official [list of API removals planned for Kubernetes 1.25](/docs/reference/using-api/deprecation-guide/#v1-25) is:
-->
[Kubernetes 1.25 计划移除的 API 的官方列表](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-25)是：

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
[Kubernetes 1.26 计划移除的 API 的官方列表](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-26)是：

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
### 了解更多 {#want-to-know-more}

Kubernetes 发行说明中宣告了弃用信息。你可以在以下版本的发行说明中看到待弃用的公告：

* [Kubernetes 1.21](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md#deprecation)
* [Kubernetes 1.22](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md#deprecation)
* [Kubernetes 1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)
* 我们将正式宣布 [Kubernetes 1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation) 的弃用信息，
  作为该版本 CHANGELOG 的一部分。

有关弃用和移除过程的信息，请查看 Kubernetes 官方[弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api)文档。
