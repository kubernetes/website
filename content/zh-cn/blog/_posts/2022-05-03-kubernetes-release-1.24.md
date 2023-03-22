---
layout: blog
title: "Kubernetes 1.24: 观星者"
date: 2022-05-03
slug: kubernetes-1-24-release-announcement
---

<!--
layout: blog
title: "Kubernetes 1.24: Stargazer"
date: 2022-05-03
slug: kubernetes-1-24-release-announcement
-->

<!--
**Authors**: [Kubernetes 1.24 Release Team](https://git.k8s.io/sig-release/releases/release-1.24/release-team.md)

We are excited to announce the release of Kubernetes 1.24, the first release of 2022!

This release consists of 46 enhancements: fourteen enhancements have graduated to stable,
fifteen enhancements are moving to beta, and thirteen enhancements are entering alpha.
Also, two features have been deprecated, and two features have been removed.
-->
**作者**: [Kubernetes 1.24 发布团队](https://git.k8s.io/sig-release/releases/release-1.24/release-team.md)

我们很高兴地宣布 Kubernetes 1.24 的发布，这是 2022 年的第一个版本！

这个版本包括 46 个增强功能：14 个增强功能已经升级到稳定版，15 个增强功能正在进入 Beta 版，
13 个增强功能正在进入 Alpha 阶段。另外，有两个功能被废弃了，还有两个功能被删除了。

<!--
## Major Themes

### Dockershim Removed from kubelet

After its deprecation in v1.20, the dockershim component has been removed from the kubelet in Kubernetes v1.24.
From v1.24 onwards, you will need to either use one of the other [supported runtimes](/docs/setup/production-environment/container-runtimes/) (such as containerd or CRI-O)
or use cri-dockerd if you are relying on Docker Engine as your container runtime.
For more information about ensuring your cluster is ready for this removal, please
see [this guide](/blog/2022/03/31/ready-for-dockershim-removal/).
-->
## 主要议题

### 从 kubelet 中删除 Dockershim

在 v1.20 版本中被废弃后，dockershim 组件已被从 Kubernetes v1.24 版本的 kubelet 中移除。
从 v1.24 开始，如果你依赖 Docker Engine 作为容器运行时，
则需要使用其他[受支持的运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)之一
（如 containerd 或 CRI-O）或使用 CRI dockerd。
有关确保集群已准备好进行此删除的更多信息，请参阅[本指南](/zh-cn/blog/2022/03/31/ready-for-dockershim-removal/)。

<!--
### Beta APIs Off by Default

[New beta APIs will not be enabled in clusters by default](https://github.com/kubernetes/enhancements/issues/3136).
Existing beta APIs and new versions of existing beta APIs will continue to be enabled by default.
-->
### 默认情况下关闭 Beta API

[新的 beta API 默认不会在集群中启用](https://github.com/kubernetes/enhancements/issues/3136)。
默认情况下，现有 Beta API 和及其更新版本将继续被启用。

<!--
### Signing Release Artifacts

Release artifacts are [signed](https://github.com/kubernetes/enhancements/issues/3031) using [cosign](https://github.com/sigstore/cosign)
signatures,
and there is experimental support for [verifying image signatures](/docs/tasks/administer-cluster/verify-signed-images/).
Signing and verification of release artifacts is part of [increasing software supply chain security for the Kubernetes release process](https://github.com/kubernetes/enhancements/issues/3027).
-->
### 签署发布工件

发布工件使用 [cosign](https://github.com/sigstore/cosign) 签名进行[签名](https://github.com/kubernetes/enhancements/issues/3031)，
并且有[验证图像签名](/zh-cn/docs/tasks/administer-cluster/verify-signed-images/)的实验性支持。
发布工件的签名和验证是[提高 Kubernetes 发布过程的软件供应链安全性](https://github.com/kubernetes/enhancements/issues/3027)
的一部分。

<!--
### OpenAPI v3

Kubernetes 1.24 offers beta support for publishing its APIs in the [OpenAPI v3 format](https://github.com/kubernetes/enhancements/issues/2896).
-->
### OpenAPI v3

Kubernetes 1.24 提供了以 [OpenAPI v3 格式](https://github.com/kubernetes/enhancements/issues/2896)发布其 API 的 Beta 支持。

<!--
### Storage Capacity and Volume Expansion Are Generally Available

[Storage capacity tracking](https://github.com/kubernetes/enhancements/issues/1472)
supports exposing currently available storage capacity via [CSIStorageCapacity objects](/docs/concepts/storage/storage-capacity/#api)
and enhances scheduling of pods that use CSI volumes with late binding.

[Volume expansion](https://github.com/kubernetes/enhancements/issues/284) adds support 
for resizing existing persistent volumes. 
-->
### 存储容量和卷扩展普遍可用

[存储容量跟踪](https://github.com/kubernetes/enhancements/issues/1472)支持通过
[CSIStorageCapacity 对象](/zh-cn/docs/concepts/storage/storage-capacity/#api)公开当前可用的存储容量，
并增强使用具有后期绑定的 CSI 卷的 Pod 的调度。

[卷的扩展](https://github.com/kubernetes/enhancements/issues/284)增加了对调整现有持久性卷大小的支持。

<!--
### NonPreemptingPriority to Stable

This feature adds [a new option to PriorityClasses](https://github.com/kubernetes/enhancements/issues/902),
which can enable or disable pod preemption.
-->
### NonPreemptingPriority 到稳定

此功能[为 PriorityClasses 添加了一个新选项](https://github.com/kubernetes/enhancements/issues/902)，可以启用或禁用 Pod 抢占。

<!--
### Storage Plugin Migration

Work is underway to [migrate the internals of in-tree storage plugins](https://github.com/kubernetes/enhancements/issues/625) to call out to CSI Plugins
while maintaining the original API.
The [Azure Disk](https://github.com/kubernetes/enhancements/issues/1490)
and [OpenStack Cinder](https://github.com/kubernetes/enhancements/issues/1489) plugins
have both been migrated.
-->
### 存储插件迁移

目前正在进行[迁移树内存储插件的内部组件](https://github.com/kubernetes/enhancements/issues/625)工作，
以便在保持原有 API 的同时调用 CSI 插件。[Azure Disk](https://github.com/kubernetes/enhancements/issues/1490)
和 [OpenStack Cinder](https://github.com/kubernetes/enhancements/issues/1489) 插件都已迁移。

<!--
### gRPC Probes Graduate to Beta

With Kubernetes 1.24, the [gRPC probes functionality](https://github.com/kubernetes/enhancements/issues/2727)
has entered beta and is available by default. You can now [configure startup, liveness, and readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes) for your gRPC app
natively within Kubernetes without exposing an HTTP endpoint or
using an extra executable.
-->
### gRPC 探针升级到 Beta

在 Kubernetes 1.24 中，[gRPC 探测功能](https://github.com/kubernetes/enhancements/issues/2727)
已进入测试版，默认可用。现在，你可以在 Kubernetes 中为你的 gRPC
应用程序原生地[配置启动、存活和就绪性探测](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes)，
而无需暴露 HTTP 端点或使用额外的可执行文件。

<!--
### Kubelet Credential Provider Graduates to Beta

Originally released as Alpha in Kubernetes 1.20, the kubelet's support for
[image credential providers](/docs/tasks/kubelet-credential-provider/kubelet-credential-provider/)
has now graduated to Beta.
This allows the kubelet to dynamically retrieve credentials for a container image registry
using exec plugins rather than storing credentials on the node's filesystem.
-->
### Kubelet 凭证提供者毕业至 Beta

kubelet 最初在 Kubernetes 1.20 中作为 Alpha 发布，现在它对[镜像凭证提供者](/zh-cn/docs/tasks/kubelet-credential-provider/kubelet-credential-provider/)
的支持已升级到 Beta。这允许 kubelet 使用 exec 插件动态检索容器镜像仓库的凭据，而不是将凭据存储在节点的文件系统上。

<!--
### Contextual Logging in Alpha

Kubernetes 1.24 has introduced [contextual logging](https://github.com/kubernetes/enhancements/issues/3077)
that enables the caller of a function to control all aspects of logging (output formatting, verbosity, additional values, and names).
-->
### Alpha 中的上下文日志记录

Kubernetes 1.24 引入了[上下文日志](https://github.com/kubernetes/enhancements/issues/3077)
这使函数的调用者能够控制日志记录的所有方面（输出格式、详细程度、附加值和名称）。

<!--
### Avoiding Collisions in IP allocation to Services

Kubernetes 1.24 introduces a new opt-in feature that allows you to
[soft-reserve a range for static IP address assignments](/docs/concepts/services-networking/service/#service-ip-static-sub-range)
to Services.
With the manual enablement of this feature, the cluster will prefer automatic assignment from
the pool of  Service IP addresses, thereby reducing the risk of collision.
-->
### 避免 IP 分配给服务的冲突

Kubernetes 1.24 引入了一项新的选择加入功能，
允许你[为服务的静态 IP 地址分配软保留范围](/zh-cn/docs/concepts/services-networking/service/#service-ip-static-sub-range)。
通过手动启用此功能，集群将更喜欢从服务 IP 地址池中自动分配，从而降低冲突风险。

<!--
A Service `ClusterIP` can be assigned:

* dynamically, which means the cluster will automatically pick a free IP within the configured Service IP range.
* statically, which means the user will set one IP within the configured Service IP range.

Service `ClusterIP` are unique; hence, trying to create a Service with a `ClusterIP` that has already been allocated will return an error.
-->
服务的 `ClusterIP` 可以按照以下两种方式分配：

* 动态，这意味着集群将自动在配置的服务 IP 范围内选择一个空闲 IP。
* 静态，这意味着用户将在配置的服务 IP 范围内设置一个 IP。

服务 `ClusterIP` 是唯一的；因此，尝试使用已分配的 `ClusterIP` 创建服务将返回错误。

<!--
### Dynamic Kubelet Configuration is Removed from the Kubelet

After being deprecated in Kubernetes 1.22, Dynamic Kubelet Configuration has been removed from the kubelet. The feature will be removed from the API server in Kubernetes 1.26.
-->
### 从 Kubelet 中移除动态 Kubelet 配置

在 Kubernetes 1.22 中被弃用后，动态 Kubelet 配置已从 kubelet 中移除。
该功能将从 Kubernetes 1.26 的 API 服务器中移除。

<!--
## CNI Version-Related Breaking Change

Before you upgrade to Kubernetes 1.24, please verify that you are using/upgrading to a container
runtime that has been tested to work correctly with this release.

For example, the following container runtimes are being prepared, or have already been prepared, for Kubernetes:

* containerd v1.6.4 and later, v1.5.11 and later
* CRI-O 1.24 and later
-->
## CNI 版本相关的重大更改

在升级到 Kubernetes 1.24 之前，请确认你正在使用/升级到经过测试可以在此版本中正常工作的容器运行时。

例如，以下容器运行时正在为 Kubernetes 准备，或者已经准备好了。

* containerd v1.6.4 及更高版本，v1.5.11 及更高版本
* CRI-O 1.24 及更高版本

<!--
Service issues exist for pod CNI network setup and tear down in containerd
v1.6.0–v1.6.3 when the CNI plugins have not been upgraded and/or the CNI config
version is not declared in the CNI config files. The containerd team reports, "these issues are resolved in containerd v1.6.4."

With containerd v1.6.0–v1.6.3, if you do not upgrade the CNI plugins and/or
declare the CNI config version, you might encounter the following "Incompatible
CNI versions" or "Failed to destroy network for sandbox" error conditions.
-->
当 CNI 插件尚未升级和/或 CNI 配置版本未在 CNI 配置文件中声明时，在 containerd v1.6.0–v1.6.3
中存在 Pod CNI 网络设置和拆除的服务问题。containerd 团队报告说，“这些问题在 containerd v1.6.4 中得到解决。”

在 containerd v1.6.0-v1.6.3 版本中，如果你不升级 CNI 插件和/或声明 CNI 配置版本，
你可能会遇到以下 “Incompatible CNI versions” 或 “Failed to destroy network for sandbox” 的错误情况。

<!--
## CSI Snapshot

_This information was added after initial publication._

[VolumeSnapshot v1beta1 CRD has been removed](https://github.com/kubernetes/enhancements/issues/177). 
Volume snapshot and restore functionality for Kubernetes and the Container Storage Interface (CSI), which provides standardized APIs design (CRDs) and adds PV snapshot/restore support for CSI volume drivers, moved to GA in v1.20. VolumeSnapshot v1beta1 was deprecated in v1.20 and is now unsupported. Refer to [KEP-177: CSI Snapshot](https://git.k8s.io/enhancements/keps/sig-storage/177-volume-snapshot#kep-177-csi-snapshot) and [Volume Snapshot GA blog](/blog/2020/12/10/kubernetes-1.20-volume-snapshot-moves-to-ga/) for more information.
-->
## CSI 快照

**此信息是在首次发布后添加的。**

[VolumeSnapshot v1beta1 CRD 已被移除](https://github.com/kubernetes/enhancements/issues/177)。
Kubernetes 和容器存储接口 (CSI) 的卷快照和恢复功能，提供标准化的 API 设计 (CRD) 并添加了对 CSI 卷驱动程序的
PV 快照/恢复支持，在 v1.20 中升级至 GA。VolumeSnapshot v1beta1 在 v1.20 中被弃用，现在不受支持。
有关详细信息，请参阅 [KEP-177: CSI 快照](https://git.k8s.io/enhancements/keps/sig-storage/177-volume-snapshot#kep-177-csi-snapshot)
和[卷快照 GA 博客](/blog/2020/12/10/kubernetes-1.20-volume-snapshot-moves-to-ga/)。

<!--
## Other Updates

### Graduations to Stable

This release saw fourteen enhancements promoted to stable:
-->
## 其他更新

### 毕业到稳定版

在此版本中，有 14 项增强功能升级为稳定版：

<!--
* [Container Storage Interface (CSI) Volume Expansion](https://github.com/kubernetes/enhancements/issues/284)
* [Pod Overhead](https://github.com/kubernetes/enhancements/issues/688): Account for resources tied to the pod sandbox but not specific containers.
* [Add non-preempting option to PriorityClasses](https://github.com/kubernetes/enhancements/issues/902)
* [Storage Capacity Tracking](https://github.com/kubernetes/enhancements/issues/1472)
* [OpenStack Cinder In-Tree to CSI Driver Migration](https://github.com/kubernetes/enhancements/issues/1489)
* [Azure Disk In-Tree to CSI Driver Migration](https://github.com/kubernetes/enhancements/issues/1490)
* [Efficient Watch Resumption](https://github.com/kubernetes/enhancements/issues/1904): Watch can be efficiently resumed after kube-apiserver reboot.
* [Service Type=LoadBalancer Class Field](https://github.com/kubernetes/enhancements/issues/1959): Introduce a new Service annotation `service.kubernetes.io/load-balancer-class` that allows multiple implementations of `type: LoadBalancer` Services in the same cluster.
* [Indexed Job](https://github.com/kubernetes/enhancements/issues/2214): Add a completion index to Pods of Jobs with a fixed completion count.
* [Add Suspend Field to Jobs API](https://github.com/kubernetes/enhancements/issues/2232): Add a suspend field to the Jobs API to allow orchestrators to create jobs with more control over when pods are created.
* [Pod Affinity NamespaceSelector](https://github.com/kubernetes/enhancements/issues/2249): Add a `namespaceSelector` field for to pod affinity/anti-affinity spec.
* [Leader Migration for Controller Managers](https://github.com/kubernetes/enhancements/issues/2436): kube-controller-manager and cloud-controller-manager can apply new controller-to-controller-manager assignment in HA control plane without downtime.
* [CSR Duration](https://github.com/kubernetes/enhancements/issues/2784): Extend the CertificateSigningRequest API with a mechanism to allow clients to request a specific duration for the issued certificate.
-->
* [容器存储接口（CSI）卷扩展](https://github.com/kubernetes/enhancements/issues/284)
* [Pod 开销](https://github.com/kubernetes/enhancements/issues/688): 核算与 Pod 沙箱绑定的资源，但不包括特定的容器。
* [向 PriorityClass 添加非抢占选项](https://github.com/kubernetes/enhancements/issues/902)
* [存储容量跟踪](https://github.com/kubernetes/enhancements/issues/1472)
* [OpenStack Cinder In-Tree 到 CSI 驱动程序迁移](https://github.com/kubernetes/enhancements/issues/1489)
* [Azure 磁盘树到 CSI 驱动程序迁移](https://github.com/kubernetes/enhancements/issues/1490)
* [高效的监视恢复](https://github.com/kubernetes/enhancements/issues/1904)：
  kube-apiserver 重新启动后，可以高效地恢复监视。
* [Service Type=LoadBalancer 类字段](https://github.com/kubernetes/enhancements/issues/1959)：
  引入新的服务注解 `service.kubernetes.io/load-balancer-class`，
  允许在同一个集群中提供 `type: LoadBalancer` 服务的多个实现。
* [带索引的 Job](https://github.com/kubernetes/enhancements/issues/2214)：为带有固定完成计数的 Job 的 Pod 添加完成索引。
* [在 Job API 中增加 suspend 字段](https://github.com/kubernetes/enhancements/issues/2232)：
  在 Job API 中增加一个 suspend 字段，允许协调者在创建作业时对 Pod 的创建进行更多控制。
* [Pod 亲和性 NamespaceSelector](https://github.com/kubernetes/enhancements/issues/2249)：
  为 Pod 亲和性/反亲和性规约添加一个 `namespaceSelector` 字段。
* [控制器管理器的领导者迁移](https://github.com/kubernetes/enhancements/issues/2436)：
  kube-controller-manager 和 cloud-controller-manager 可以在 HA 控制平面中重新分配新的控制器到控制器管理器，而无需停机。
* [CSR 期限](https://github.com/kubernetes/enhancements/issues/2784)：
  用一种机制来扩展证书签名请求 API，允许客户为签发的证书请求一个特定的期限。

<!--
### Major Changes

This release saw two major changes:

* [Dockershim Removal](https://github.com/kubernetes/enhancements/issues/2221)
* [Beta APIs are off by Default](https://github.com/kubernetes/enhancements/issues/3136)
-->
### 主要变更

此版本有两个主要变更：

* [移除 Dockershim](https://github.com/kubernetes/enhancements/issues/2221)
* [默认关闭 Beta API](https://github.com/kubernetes/enhancements/issues/3136)

<!--
### Release Notes

Check out the full details of the Kubernetes 1.24 release in our [release notes](https://git.k8s.io/kubernetes/CHANGELOG/CHANGELOG-1.24.md).
-->
### 发行说明

在我们的[发行说明](https://git.k8s.io/kubernetes/CHANGELOG/CHANGELOG-1.24.md) 中查看 Kubernetes 1.24 版本的完整详细信息。

<!--
### Availability

Kubernetes 1.24 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.24.0).
To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local
Kubernetes clusters using containers as “nodes”, with [kind](https://kind.sigs.k8s.io/).
You can also easily install 1.24 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/).
-->
### 可用性

Kubernetes 1.24 可在 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.24.0) 上下载。
要开始使用 Kubernetes，请查看这些[交互式教程](/zh-cn/docs/tutorials/)或在本地运行。
使用 [kind](https://kind.sigs.k8s.io/)，可以将容器作为 Kubernetes 集群的 “节点”。
你还可以使用 [kubeadm](/zh-cn/docs/setup/independent/create-cluster-kubeadm/) 轻松安装 1.24。

<!--
### Release Team

This release would not have been possible without the combined efforts of committed individuals
comprising the Kubernetes 1.24 release team. This team came together to deliver all of the components
that go into each Kubernetes release, including code, documentation, release notes, and more.

Special thanks to James Laverack, our release lead, for guiding us through a successful release cycle,
and to all of the release team members for the time and effort they put in to deliver the v1.24
release for the Kubernetes community.
-->
### 发布团队

如果没有 Kubernetes 1.24 发布团队每个人做出的共同努力，这个版本是不可能实现的。
该团队齐心协力交付每个 Kubernetes 版本中的所有组件，包括代码、文档、发行说明等。

特别感谢我们的发布负责人 James Laverack 指导我们完成了一个成功的发布周期，
并感谢所有发布团队成员投入时间和精力为 Kubernetes 社区提供 v1.24 版本。

<!--
### Release Theme and Logo

**Kubernetes 1.24: Stargazer**

{{< figure src="/images/blog/2022-05-03-kubernetes-release-1.24/kubernetes-1.24.png" alt="" class="release-logo" >}}

The theme for Kubernetes 1.24 is _Stargazer_.
-->
### 发布主题和徽标

**Kubernetes 1.24: 观星者**

{{< figure src="/images/blog/2022-05-03-kubernetes-release-1.24/kubernetes-1.24.png" alt="" class="release-logo" >}}

Kubernetes 1.24 的主题是**观星者（Stargazer）**。

<!--
Generations of people have looked to the stars in awe and wonder, from ancient astronomers to the
scientists who built the James Webb Space Telescope. The stars have inspired us, set our imagination
alight, and guided us through long nights on difficult seas.

With this release we gaze upwards, to what is possible when our community comes together. Kubernetes
is the work of hundreds of contributors across the globe and thousands of end-users supporting
applications that serve millions. Every one is a star in our sky, helping us chart our course.
-->
古代天文学家到建造 James Webb 太空望远镜的科学家，几代人都怀着敬畏和惊奇的心情仰望星空。
是这些星辰启发了我们，点燃了我们的想象力，引导我们在艰难的海上度过了漫长的夜晚。

通过此版本，我们向上凝视，当我们的社区聚集在一起时可能发生的事情。
Kubernetes 是全球数百名贡献者和数千名最终用户支持的成果，
是一款为数百万人服务的应用程序。每个人都是我们天空中的一颗星星，帮助我们规划路线。
<!--
The release logo is made by [Britnee Laverack](https://www.instagram.com/artsyfie/), and depicts a telescope set upon starry skies and the
[Pleiades](https://en.wikipedia.org/wiki/Pleiades), often known in mythology as the “Seven Sisters”. The number seven is especially auspicious
for the Kubernetes project, and is a reference back to our original “Project Seven” name.

This release of Kubernetes is named for those that would look towards the night sky and wonder — for
all the stargazers out there. ✨
-->
发布标志由 [Britnee Laverack](https://www.instagram.com/artsyfie/) 制作，
描绘了一架位于星空和[昴星团](https://en.wikipedia.org/wiki/Pleiades)的望远镜，在神话中通常被称为“七姐妹”。
数字 7 对于 Kubernetes 项目特别吉祥，是对我们最初的“项目七”名称的引用。

这个版本的 Kubernetes 为那些仰望夜空的人命名——为所有的观星者命名。 ✨

<!--
### User Highlights

* Check out how leading retail e-commerce company [La Redoute used Kubernetes, alongside other CNCF projects, to transform and streamline its software delivery lifecycle](https://www.cncf.io/case-studies/la-redoute/) - from development to operations.
* Trying to ensure no change to an API call would cause any breaks, [Salt Security built its microservices entirely on Kubernetes, and it communicates via gRPC while Linkerd ensures messages are encrypted](https://www.cncf.io/case-studies/salt-security/).
* In their effort to migrate from private to public cloud, [Allainz Direct engineers redesigned its CI/CD pipeline in just three months while managing to condense 200 workflows down to 10-15](https://www.cncf.io/case-studies/allianz/).
* Check out how [Bink, a UK based fintech company, updated its in-house Kubernetes distribution with Linkerd to build a cloud-agnostic platform that scales as needed whilst allowing them to keep a close eye on performance and stability](https://www.cncf.io/case-studies/bink/).
* Using Kubernetes, the Dutch organization [Stichting Open Nederland](http://www.stichtingopennederland.nl/) created a testing portal in just one-and-a-half months to help safely reopen events in the Netherlands. The [Testing for Entry (Testen voor Toegang)](https://www.testenvoortoegang.org/) platform [leveraged the performance and scalability of Kubernetes to help individuals book over 400,000 COVID-19 testing appointments per day. ](https://www.cncf.io/case-studies/true/)
* Working alongside SparkFabrik and utilizing Backstage, [Santagostino created the developer platform Samaritan to centralize services and documentation, manage the entire lifecycle of services, and simplify the work of Santagostino developers](https://www.cncf.io/case-studies/santagostino/).
-->
### 用户亮点

* 了解领先的零售电子商务公司
  [La Redoute 如何使用 Kubernetes 以及其他 CNCF 项目来转变和简化](https://www.cncf.io/case-studies/la-redoute/)
  其从开发到运营的软件交付生命周期。
* 为了确保对 API 调用的更改不会导致任何中断，[Salt Security 完全在 Kubernetes 上构建了它的微服务，
  它通过 gRPC 进行通信，而 Linkerd 确保消息是加密的](https://www.cncf.io/case-studies/salt-security/)。
* 为了从私有云迁移到公共云，[Alllainz Direct 工程师在短短三个月内重新设计了其 CI/CD 管道，
  同时设法将 200 个工作流压缩到 10-15 个](https://www.cncf.io/case-studies/allianz/)。
* 看看[英国金融科技公司 Bink 是如何用 Linkerd 更新其内部的 Kubernetes 分布，以建立一个云端的平台，
  根据需要进行扩展，同时允许他们密切关注性能和稳定性](https://www.cncf.io/case-studies/bink/)。
* 利用Kubernetes，荷兰组织 [Stichting Open Nederland](http://www.stichtingopennederland.nl/)
  在短短一个半月内创建了一个测试门户网站，以帮助安全地重新开放荷兰的活动。
  [入门测试 (Testen voor Toegang)](https://www.testenvoortoegang.org/)
  平台[利用 Kubernetes 的性能和可扩展性来帮助个人每天预订超过 400,000 个 COVID-19 测试预约](https://www.cncf.io/case-studies/true/)。
* 与 SparkFabrik 合作并利用 Backstage，[Santagostino 创建了开发人员平台 Samaritan 来集中服务和文档，
  管理服务的整个生命周期，并简化 Santagostino 开发人员的工作](https://www.cncf.io/case-studies/santagostino/)。

<!--
### Ecosystem Updates

* KubeCon + CloudNativeCon Europe 2022 will take place in Valencia, Spain, from 16 – 20 May 2022! You can find more information about the conference and registration on the [event site](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/).
* In the [2021 Cloud Native Survey](https://www.cncf.io/announcements/2022/02/10/cncf-sees-record-kubernetes-and-container-adoption-in-2021-cloud-native-survey/), the CNCF saw record Kubernetes and container adoption. Take a look at the [results of the survey](https://www.cncf.io/reports/cncf-annual-survey-2021/).
* The [Linux Foundation](https://www.linuxfoundation.org/) and [The Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) announced the availability of a new [Cloud Native Developer Bootcamp](https://training.linuxfoundation.org/training/cloudnativedev-bootcamp/?utm_source=lftraining&utm_medium=pr&utm_campaign=clouddevbc0322) to provide participants with the knowledge and skills to design, build, and deploy cloud native applications. Check out the [announcement](https://www.cncf.io/announcements/2022/03/15/new-cloud-native-developer-bootcamp-provides-a-clear-path-to-cloud-native-careers/) to learn more.
-->
### 生态系统更新

* KubeCon + CloudNativeCon Europe 2022 于 2022 年 5 月 16 日至 20 日在西班牙巴伦西亚举行！
  你可以在[活动网站](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/)上找到有关会议和注册的更多信息。
* 在 [2021 年云原生调查](https://www.cncf.io/announcements/2022/02/10/cncf-sees-record-kubernetes-and-container-adoption-in-2021-cloud-native-survey/)
  中，CNCF 看到了创纪录的 Kubernetes 和容器采用。参阅[调查结果](https://www.cncf.io/reports/cncf-annual-survey-2021/)。
* [Linux 基金会](https://www.linuxfoundation.org/)和[云原生计算基金会](https://www.cncf.io/) (CNCF)
  宣布推出新的 [云原生开发者训练营](https://training.linuxfoundation.org/training/cloudnativedev-bootcamp/?utm_source=lftraining&utm_medium=pr&utm_campaign=clouddevbc0322)
  为参与者提供设计、构建和部署云原生应用程序的知识和技能。查看[公告](https://www.cncf.io/announcements/2022/03/15/new-cloud-native-developer-bootcamp-provides-a-clear-path-to-cloud-native-careers/)以了解更多信息。

<!--
### Project Velocity

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) project
aggregates a number of interesting data points related to the velocity of Kubernetes and various
sub-projects. This includes everything from individual contributions to the number of companies that
are contributing, and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.24 release cycle, which [ran for 17 weeks](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.24) (January 10 to May 3), we saw contributions from [1029 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.23.0%20-%20v1.24.0&var-metric=contributions) and [1179 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.23.0%20-%20v1.24.0&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes).
-->
### 项目速度

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) 项目
汇总了许多与 Kubernetes 和各种子项目的速度相关的有趣数据点。这包括从个人贡献到做出贡献的公司数量的所有内容，
并且说明了为发展这个生态系统而付出的努力的深度和广度。

在[运行 17 周](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.24)
（ 1 月 10 日至 5 月 3 日）的 v1.24 发布周期中，我们看到 [1029 家公司](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.23.0%20-%20v1.24.0&var-metric=contributions)
和 [1179 人](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.23.0%20-%20v1.24.0&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes) 的贡献。

<!--
## Upcoming Release Webinar

Join members of the Kubernetes 1.24 release team on Tue May 24, 2022 9:45am – 11am PT to learn about
the major features of this release, as well as deprecations and removals to help plan for upgrades.
For more information and registration, visit the [event page](https://community.cncf.io/e/mck3kd/)
on the CNCF Online Programs site.
-->
## 即将发布的网络研讨会

在太平洋时间 2022 年 5 月 24 日星期二上午 9:45 至上午 11 点加入 Kubernetes 1.24 发布团队的成员，
了解此版本的主要功能以及弃用和删除，以帮助规划升级。有关更多信息和注册，
请访问 CNCF 在线计划网站上的[活动页面](https://community.cncf.io/e/mck3kd/)。

<!--
## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://git.k8s.io/community/sig-list.md) (SIGs) that align with your interests. 
Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://git.k8s.io/community/communication), and through the channels below:

* Find out more about contributing to Kubernetes at the [Kubernetes Contributors](https://www.kubernetes.dev/) website
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes).
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://git.k8s.io/sig-release/release-team)
-->
## 参与进来

参与 Kubernetes 的最简单方法是加入符合你兴趣的众多[特别兴趣组](https://git.k8s.io/community/sig-list.md)（SIG）之一。
你有什么想向 Kubernetes 社区广播的内容吗？
在我们的每周的[社区会议](https://git.k8s.io/community/communication)上分享你的声音，并通过以下渠道：

* 在 [Kubernetes Contributors](https://www.kubernetes.dev/) 网站上了解有关为 Kubernetes 做出贡献的更多信息
* 在 Twitter 上关注我们 [@Kubernetesio](https://twitter.com/kubernetesio) 以获取最新更新
* 加入社区讨论 [Discuss](https://discuss.kubernetes.io/)
* 加入 [Slack](http://slack.k8s.io/) 社区
* 在 [Server Fault](https://serverfault.com/questions/tagged/kubernetes) 上发布问题（或回答问题）。
* 分享你的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* 在[博客](/zh-cn/blog/)上阅读有关 Kubernetes 正在发生的事情的更多信息
* 详细了解 [Kubernetes 发布团队](https://git.k8s.io/sig-release/release-team)
