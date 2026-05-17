---
layout: blog
title: 'Kubernetes v1.35 抢先一览'
date: 2025-11-26
slug: kubernetes-v1-35-sneak-peek
author: >
  Aakanksha Bhende,
  Arujjwal Negi,
  Chad M. Crowell,
  Graziano Casto,
  Swathi Rao
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
layout: blog
title: 'Kubernetes v1.35 Sneak Peek'
date: 2025-11-26
slug: kubernetes-v1-35-sneak-peek
author: >
  Aakanksha Bhende,
  Arujjwal Negi,
  Chad M. Crowell,
  Graziano Casto,
  Swathi Rao
-->

<!--
As the release of Kubernetes v1.35 approaches, the Kubernetes project continues to evolve.
Features may be deprecated, removed, or replaced to improve the project's overall health.
This blog post outlines planned changes for the v1.35 release that the release team believes
you should be aware of to ensure the continued smooth operation of your Kubernetes cluster(s),
and to keep you up to date with the latest developments.
The information below is based on the current status of the v1.35 release
and is subject to change before the final release date.
-->
随着 Kubernetes v1.35 发布的临近，Kubernetes 项目持续演进。
为了改善项目的整体健康状况，某些功能可能会被弃用、移除或替换。
本博客文章概述了 v1.35 版本的计划变更，
发布团队认为你应该了解这些变更，以确保 Kubernetes 集群的持续平稳运行，
并让你了解最新进展。
以下信息基于 v1.35 版本的当前状态，在最终发布日期之前可能会发生变化。

<!--
## Deprecations and removals for Kubernetes v1.35
-->
## Kubernetes v1.35 的弃用和移除 {#deprecations-and-removals-for-kubernetes-v1-35}

<!--
### cgroup v1 support
-->
### cgroup v1 支持 {#cgroup-v1-support}

<!--
On Linux nodes, container runtimes typically rely on cgroups (short for "control groups").
Support for using cgroup v2 has been stable in Kubernetes since v1.25,
providing an alternative to the original v1 cgroup support.
While cgroup v1 provided the initial resource control mechanism,
it suffered from well-known inconsistencies and limitations.
Adding support for cgroup v2 allowed use of a unified control group hierarchy,
improved resource isolation, and served as the foundation for modern features,
making legacy cgroup v1 support ready for removal.
The removal of cgroup v1 support will only impact cluster administrators
running nodes on older Linux distributions that do not support cgroup v2;
on those nodes, the `kubelet` will fail to start.
Administrators must migrate their nodes to systems with cgroup v2 enabled.
More details on compatibility requirements will be available in a blog post
soon after the v1.35 release.
-->
在 Linux 节点上，容器运行时通常依赖于 cgroups（"control groups" 的缩写）。
自 v1.25 以来，Kubernetes 中对 cgroup v2 的支持已经稳定，
为原有的 v1 cgroup 支持提供了替代方案。
虽然 cgroup v1 提供了初始的资源控制机制，
但它存在众所周知的不一致性和局限性。
添加对 cgroup v2 的支持允许使用统一的控制组层次结构，
改善了资源隔离，并为现代功能奠定了基础，
使得传统的 cgroup v1 支持可以准备移除。
移除 cgroup v1 支持只会影响在不支持 cgroup v2 的旧版 Linux 发行版上运行节点的集群管理员；
在这些节点上，`kubelet` 将无法启动。
管理员必须将其节点迁移到启用了 cgroup v2 的系统。
关于兼容性要求的更多详细信息将在 v1.35 发布后不久在博客文章中提供。

<!--
To learn more, read [about cgroup v2](/docs/concepts/architecture/cgroups/);
you can also track the switchover work via [KEP-5573: Remove cgroup v1 support](https://kep.k8s.io/5573).
-->
要了解更多信息，请阅读[关于 cgroup v2](/zh-cn/docs/concepts/architecture/cgroups/)；
你也可以通过 [KEP-5573：移除 cgroup v1 支持](https://kep.k8s.io/5573) 跟踪切换工作。

<!--
### Deprecation of ipvs mode in kube-proxy
-->
### kube-proxy 中 ipvs 模式的弃用 {#deprecation-of-ipvs-mode-in-kube-proxy}

<!--
Many releases ago, the Kubernetes project implemented an [ipvs](/docs/reference/networking/virtual-ips/#proxy-mode-ipvs)
mode in `kube-proxy`.
It was adopted as a way to provide high-performance service load balancing,
with better performance than the existing `iptables` mode.
However, maintaining feature parity between ipvs and other kube-proxy modes
became difficult, due to technical complexity and diverging requirements.
This created significant technical debt and made the ipvs backend impractical
to support alongside newer networking capabilities.
-->
许多版本之前，Kubernetes 项目在 `kube-proxy` 中实现了
[ipvs](/zh-cn/docs/reference/networking/virtual-ips/#proxy-mode-ipvs) 模式。
它被采用作为一种提供高性能服务负载均衡的方式，
性能优于现有的 `iptables` 模式。
然而，由于技术复杂性和需求分歧，
在 ipvs 和其他 kube-proxy 模式之间保持功能对等变得困难。
这造成了重大的技术债务，并使 ipvs 后端难以与更新的网络功能一起支持。

<!--
The Kubernetes project intends to deprecate kube-proxy `ipvs` mode in the v1.35 release,
to streamline the `kube-proxy` codebase.
For Linux nodes, the recommended `kube-proxy` mode is already [nftables](/docs/reference/networking/virtual-ips/#proxy-mode-nftables).
-->
Kubernetes 项目计划在 v1.35 版本中弃用 kube-proxy `ipvs` 模式，
以简化 `kube-proxy` 代码库。
对于 Linux 节点，推荐的 `kube-proxy` 模式已经是
[nftables](/zh-cn/docs/reference/networking/virtual-ips/#proxy-mode-nftables)。

<!--
You can find more in [KEP-5495: Deprecate ipvs mode in kube-proxy](https://kep.k8s.io/5495)
-->
你可以在 [KEP-5495：弃用 kube-proxy 中的 ipvs 模式](https://kep.k8s.io/5495) 中找到更多信息。

<!--
### Kubernetes is deprecating containerd v1.y support
-->
### Kubernetes 正在弃用 containerd v1.y 支持 {#kubernetes-is-deprecating-containerd-v1-y-support}

<!--
While Kubernetes v1.35 still supports containerd 1.7 and other LTS releases of containerd,
as a consequence of automated cgroup driver detection,
the Kubernetes SIG Node community has formally agreed upon a final support timeline
for containerd v1.X.
Kubernetes v1.35 is the last release to offer this support (aligned with containerd 1.7 EOL).
-->
虽然 Kubernetes v1.35 仍然支持 containerd 1.7 和其他 containerd LTS 版本，
但由于自动化的 cgroup 驱动程序检测，
Kubernetes SIG Node 社区已正式商定了 containerd v1.X 的最终支持时间表。
Kubernetes v1.35 是提供此支持的最后一个版本（与 containerd 1.7 EOL 对齐）。

<!--
This is a final warning that if you are using containerd 1.X,
you must switch to 2.0 or later before upgrading Kubernetes to the next version.
You are able to monitor the `kubelet_cri_losing_support` metric to determine
if any nodes in your cluster are using a containerd version that will soon be unsupported.
-->
这是最终警告：如果你正在使用 containerd 1.X，
必须在将 Kubernetes 升级到下一个版本之前切换到 2.0 或更高版本。
你可以监控 `kubelet_cri_losing_support` 指标来确定
集群中的任何节点是否正在使用即将不受支持的 containerd 版本。

<!--
You can find more in the [official blog post](/blog/2025/09/12/kubernetes-v1-34-cri-cgroup-driver-lookup-now-ga/#announcement-kubernetes-is-deprecating-containerd-v1-y-support)
or in [KEP-4033: Discover cgroup driver from CRI](https://kep.k8s.io/4033)
-->
你可以在[官方博客文章](/blog/2025/09/12/kubernetes-v1-34-cri-cgroup-driver-lookup-now-ga/#announcement-kubernetes-is-deprecating-containerd-v1-y-support)
或 [KEP-4033：从 CRI 发现 cgroup 驱动程序](https://kep.k8s.io/4033) 中找到更多信息。

<!--
## Featured enhancements of Kubernetes v1.35
-->
## Kubernetes v1.35 的重点增强功能 {#featured-enhancements-of-kubernetes-v1-35}

<!--
The following enhancements are some of those likely to be included in the v1.35 release.
This is not a commitment, and the release content is subject to change.
-->
以下增强功能是可能包含在 v1.35 版本中的部分功能。
这不是承诺，发布内容可能会发生变化。

<!--
### Node declared features
-->
### 节点声明式特性 {#node-declared-features}

<!--
When scheduling Pods, Kubernetes uses node labels, taints, and tolerations
to match workload requirements with node capabilities.
However, managing feature compatibility becomes challenging during cluster upgrades
due to version skew between the control plane and nodes.
This can lead to Pods being scheduled on nodes that lack required features,
resulting in runtime failures.
-->
在调度 Pod 时，Kubernetes 使用节点标签、污点和容忍度
来匹配工作负载需求与节点能力。
然而，由于控制平面和节点之间的版本偏移，
在集群升级期间管理功能兼容性变得具有挑战性。
这可能导致 Pod 被调度到缺少所需功能的节点上，从而导致运行时失败。

<!--
The _node declared features_ framework will introduce a standard mechanism
for nodes to declare their supported Kubernetes features.
With the new alpha feature enabled, a Node reports the features it can support,
publishing this information to the control plane through a new `.status.declaredFeatures` field.
Then, the `kube-scheduler`, admission controllers and third-party components
can use these declarations.
For example, you can enforce scheduling and API validation constraints,
ensuring that Pods run only on compatible nodes.
-->
**节点声明式特性（Node Declared Features）**框架将引入一种标准机制，
让节点声明其所支持的 Kubernetes 特性。
启用这一新的 Alpha 特性后，节点会报告其可以支持的特性，
通过新的 `.status.declaredFeatures` 字段将此信息发布到控制平面。
然后，`kube-scheduler`、准入控制器和第三方组件可以使用这些声明。
例如，你可以强制执行调度和 API 验证约束，
确保 Pod 仅在兼容的节点上运行。

<!--
This approach reduces manual node labeling, improves scheduling accuracy,
and prevents incompatible pod placements proactively.
It also integrates with the Cluster Autoscaler for informed scale-up decisions.
Feature declarations are temporary and tied to Kubernetes feature gates,
enabling safe rollout and cleanup.
-->
这种方法可以减少手动为节点打标签的操作，提高调度准确性，
并主动防止不兼容的 Pod 放置。
它还与集群自动扩缩器（Cluster Autoscaler）集成，以便做出明智的扩容决策。
特性声明是临时性的，并与 Kubernetes 特性门控绑定，
从而实现安全的推出和清理。

<!--
Targeting alpha in v1.35, _node declared features_ aims to solve version skew
scheduling issues by making node capabilities explicit,
enhancing reliability and cluster stability in heterogeneous version environments.
-->
目标是在 v1.35 中达到 Alpha 阶段，**节点声明式特性**旨在通过明确节点能力
来解决版本偏移调度问题，在异构版本环境中增强可靠性和集群稳定性。

<!--
To learn more about this before the official documentation is published,
you can read [KEP-5328](https://kep.k8s.io/5328).
-->
在官方文档发布之前了解更多信息，你可以阅读 [KEP-5328](https://kep.k8s.io/5328)。

<!--
### In-place update of Pod resources
-->
### Pod 资源的原地更新 {#in-place-update-of-pod-resources}

<!--
Kubernetes is graduating in-place updates for Pod resources to General Availability (GA).
This feature allows users to adjust `cpu` and `memory` resources
without restarting Pods or Containers.
Previously, such modifications required recreating Pods,
which could disrupt workloads, particularly for stateful or batch applications.
-->
Kubernetes 正在将 Pod 资源的原地更新提升到正式发布（GA）状态。
此特性允许用户在不重启 Pod 或容器的情况下调整 `cpu` 和 `memory` 资源。
以前，此类修改需要重新创建 Pod，这可能会中断工作负载，
特别是对于有状态或批处理应用程序。

<!--
Previous Kubernetes releases already allowed you to change infrastructure resources settings
(requests and limits) for existing Pods.
This allows for smoother [vertical scaling](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/),
improves efficiency, and can also simplify solution development.
-->
之前的 Kubernetes 版本已经允许你更改现有 Pod 的基础设施资源设置（requests 和 limits）。
这允许更平滑的[垂直扩缩容](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/)，
提高效率，还可以简化解决方案开发。

<!--
The Container Runtime Interface (CRI) has also been improved,
extending the `UpdateContainerResources` API for Windows and future runtimes
while allowing `ContainerStatus` to report real-time resource configurations.
Together, these changes make scaling in Kubernetes faster, more flexible, and disruption-free.
The feature was introduced as alpha in v1.27, graduated to beta in v1.33,
and is targeting graduation to stable in v1.35.
-->
容器运行时接口（CRI）也得到了改进，
为 Windows 和未来的运行时扩展了 `UpdateContainerResources` API，
同时允许 `ContainerStatus` 报告实时的资源配置情况。
这些更改一起使 Kubernetes 中的扩缩容更快、更灵活且无中断。
此特性在 v1.27 中作为 Alpha 特性引入，在 v1.33 中升级到 Beta，
并且计划在 v1.35 中升级到稳定状态。

<!--
You can find more in [KEP-1287: In-place Update of Pod Resources](https://kep.k8s.io/1287)
-->
你可以在 [KEP-1287：Pod 资源的原地更新](https://kep.k8s.io/1287) 中找到更多信息。

<!--
### Pod certificates
-->
### Pod 证书 {#pod-certificates}

<!--
When running microservices, Pods often require a strong cryptographic identity
to authenticate with each other using mutual TLS (mTLS).
While Kubernetes provides Service Account tokens,
these are designed for authenticating to the API server,
not for general-purpose workload identity.
-->
在运行微服务时，Pod 通常需要强加密身份，
以便使用双向 TLS（mTLS）相互进行身份认证。
虽然 Kubernetes 提供服务账号令牌，
但这些令牌设计用于向 API 服务器进行身份认证，
而不是用于通用工作负载身份。

<!--
Before this enhancement, operators had to rely on complex, external projects
like SPIFFE/SPIRE or cert-manager to provision and rotate certificates for their workloads.
But what if you could issue a unique, short-lived certificate to your Pods natively and automatically?
KEP-4317 is designed to enable such native workload identity.
It opens up various possibilities for securing pod-to-pod communication
by allowing the `kubelet` to request and mount certificates for a Pod via a projected volume.
-->
在此增强之前，操作员必须依赖复杂的外部项目（如 SPIFFE/SPIRE 或 cert-manager）
来为其工作负载提供和轮换证书。
但是，如果你可以原生且自动地为 Pod 颁发唯一的短期证书呢？
KEP-4317 旨在启用这种原生工作负载身份。
它通过允许 `kubelet` 通过投影卷为 Pod 请求和挂载证书，
为保护 Pod 到 Pod 的通信开辟了多种可能性。

<!--
This provides a built-in mechanism for workload identity,
complete with automated certificate rotation,
significantly simplifying the setup of service meshes and other zero-trust network policies.
This feature was introduced as alpha in v1.34 and is targeting beta in v1.35.
-->
Pod 证书为工作负载身份提供了一种内置的机制，包括自动证书轮换，
显著简化了服务网格和其他零信任网络策略的设置。
该特性在 v1.34 中作为 Alpha 特性引入，目标是在 v1.35 中达到 Beta 阶段。

<!--
You can find more in [KEP-4317: Pod Certificates](https://kep.k8s.io/4317)
-->
你可以在 [KEP-4317：Pod 证书](https://kep.k8s.io/4317) 中找到更多信息。

<!--
### Numeric values for taints
-->
### 数值形式的污点 {#numeric-values-for-taints}

<!--
Kubernetes is enhancing [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)
by adding numeric comparison operators, such as `Gt` (Greater Than) and `Lt` (Less Than).
-->
Kubernetes 正在通过添加数值比较运算符（如 `Gt`（大于）和 `Lt`（小于））
来增强[污点和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。

<!--
Previously, tolerations supported only exact (`Equal`) or existence (`Exists`) matches,
which were not suitable for numeric properties such as reliability SLAs.
-->
以前，容忍度仅支持精确（`Equal`）或存在（`Exists`）匹配，
这不适用于可靠性 SLA 等数值属性。

<!--
With this change, a Pod can use a toleration to "opt-in" to nodes
that meet a specific numeric threshold.
For example, a Pod can require a Node with an SLA taint value greater than 950
(`operator: Gt`, `value: "950"`).
-->
通过此更改，Pod 可以使用容忍度来"选择"满足特定数值阈值的节点。
例如，Pod 可以要求 SLA 污点值大于 950 的节点（`operator: Gt`，`value: "950"`）。

<!--
This approach is more powerful than Node Affinity because it supports the NoExecute effect,
allowing Pods to be automatically evicted if a node's numeric value
drops below the tolerated threshold.
-->
这种方法比节点亲和性更强大，因为它支持 NoExecute 效果，
如果节点的数值降至容忍阈值以下，允许自动驱逐 Pod。

<!--
You can find more in [KEP-5471: Enable SLA-based Scheduling](https://kep.k8s.io/5471)
-->
你可以在 [KEP-5471：启用基于 SLA 的调度](https://kep.k8s.io/5471) 中找到更多信息。

<!--
### User namespaces
-->
### 用户名字空间 {#user-namespaces}

<!--
When running Pods, you can use `securityContext` to drop privileges,
but containers inside the pod often still run as root (UID 0).
This simplicity poses a significant challenge,
as that container UID 0 maps directly to the host's root user.
-->
在运行 Pod 时，你可以使用 `securityContext` 来去除特权，
但 Pod 内的容器通常仍以 root（UID 0）运行。
这种简单性带来了重大挑战，因为容器 UID 0 直接映射到主机的 root 用户。

<!--
Before this enhancement, a container breakout vulnerability
could grant an attacker full root access to the node.
But what if you could dynamically remap the container's root user
to a safe, unprivileged user on the host?
KEP-127 specifically allows such native support for Linux User Namespaces.
It opens up various possibilities for pod security
by isolating container and host user/group IDs.
This allows a process to have root privileges (UID 0) within its namespace,
while running as a non-privileged, high-numbered UID on the host.
-->
在此增强之前，容器逃逸漏洞可能授予攻击者对节点的完全 root 访问权限。
但是，如果你可以将容器的 root 用户动态重新映射到主机上的安全、无特权用户呢？
KEP-127 专门为 Linux 用户名字空间提供原生支持。
它通过隔离容器和主机用户/组 ID 为 Pod 安全开辟了各种可能性。
这允许进程在其名字空间内拥有 root 权限（UID 0），
同时在主机上以非特权的高编号 UID 运行。

<!--
Released as alpha in v1.25 and beta in v1.30,
this feature continues to progress through beta maturity,
paving the way for truly "rootless" containers
that drastically reduce the attack surface for a whole class of security vulnerabilities.
-->
该特性在 v1.25 中作为 Alpha 特性发布，并在 v1.30 中进阶到 Beta 阶段，
在 Beta 成熟度级别，此特性仍在进一步演化，
为真正的"无 root"容器铺平道路，
这些改进大大减少了一整类安全漏洞的攻击面。

<!--
You can find more in [KEP-127: User Namespaces](https://kep.k8s.io/127)
-->
你可以在 [KEP-127：用户名字空间](https://kep.k8s.io/127) 中找到更多信息。

<!--
### Support for mounting OCI images as volumes
-->
### 支持将 OCI 镜像挂载为卷 {#support-for-mounting-oci-images-as-volumes}

<!--
When provisioning a Pod, you often need to bundle data, binaries,
or configuration files for your containers.
Before this enhancement, people often included that kind of data
directly into the main container image,
or required a custom init container to download and unpack files into an `emptyDir`.
You can still take either of those approaches, of course.
-->
在配置 Pod 时，你经常需要为容器打包数据、二进制文件或配置文件。
在此增强之前，人们通常将此类数据直接包含在主容器镜像中，
或需要自定义 Init 容器将文件下载并解压到 `emptyDir` 中。
当然，你仍然可以采用这两种方法中的任何一种。

<!--
But what if you could populate a volume directly from a data-only artifact
in an OCI registry, just like pulling a container image?
Kubernetes v1.31 added support for the `image` volume type,
allowing Pods to pull and unpack OCI container image artifacts into a volume declaratively.
-->
但是，如果你可以直接使用 OCI 镜像库中的纯数据工件填充卷，
就像拉取容器镜像一样呢？
Kubernetes v1.31 添加了对 `image` 卷类型的支持，
允许 Pod 以声明的方式将 OCI 容器镜像工件拉取并解压到卷中。

<!--
This allows for seamless distribution of data, binaries, or ML models
using standard registry tooling,
completely decoupling data from the container image
and eliminating the need for complex init containers or startup scripts.
This volume type has been in beta since v1.33
and will likely be enabled by default in v1.35.
-->
这一特性使我们能够使用标准镜像库工具无缝分发数据、二进制文件或 ML 模型，
完全将数据与容器镜像解耦，并消除对复杂 Init 容器或启动脚本的需求。
此卷类型自 v1.33 以来一直处于 Beta 状态，并可能在 v1.35 中默认启用。

<!--
You can try out the beta version of [`image` volumes](/docs/concepts/storage/volumes/#image),
or you can learn more about the plans from [KEP-4639: OCI Volume Source](https://kep.k8s.io/4639).
-->
你可以试用 [`image` 卷](/zh-cn/docs/concepts/storage/volumes/#image) 的 Beta 版本，
或者你可以从 [KEP-4639：OCI 卷源](https://kep.k8s.io/4639) 了解更多计划。

<!--
## Want to know more?
-->
## 想了解更多？ {#want-to-know-more}

<!--
New features and deprecations are also announced in the Kubernetes release notes.
We will formally announce what's new in [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md)
as part of the CHANGELOG for that release.
-->
新特性和弃用也在 Kubernetes 发布说明中宣布。
我们将正式宣布 [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md) 的新内容，
作为该版本 CHANGELOG 的一部分。

<!--
The Kubernetes v1.35 release is planned for **December 17, 2025**. Stay tuned for updates!
-->
Kubernetes v1.35 版本计划于 **2025 年 12 月 17 日**发布。请关注更新！

<!--
You can also see the announcements of changes in the release notes for:
-->
你还可以在以下版本的发布说明中查看变更公告：
- [Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md)
- [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md)
- [Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)
- [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)
- [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md)

<!--
## Get involved
-->
## 参与进来 {#get-involved}

<!--
The simplest way to get involved with Kubernetes is by joining one of the many
[Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs)
that align with your interests.
Have something you'd like to broadcast to the Kubernetes community?
Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication),
and through the channels below.
Thank you for your continued feedback and support.
-->
参与 Kubernetes 最简单的方法是加入众多[特别兴趣小组](https://github.com/kubernetes/community/blob/master/sig-list.md)（SIG）
中与你兴趣相符的一个。有什么想向 Kubernetes 社区广播的内容吗？
在我们的每周[社区会议](https://github.com/kubernetes/community/tree/master/communication)上
以及通过下面的渠道分享你的声音。感谢你持续的反馈和支持。

<!--
- Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes) or [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what's happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
- 在 Bluesky 上关注我们 [@kubernetes.io](https://bsky.app/profile/kubernetes.io) 获取最新动态
- 在 [Discuss](https://discuss.kubernetes.io/) 上加入社区讨论
- 在 [Slack](http://slack.k8s.io/) 上加入社区
- 在 [Server Fault](https://serverfault.com/questions/tagged/kubernetes) 或
  [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes) 上发布问题（或回答问题）
- 分享你的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- 在[博客](https://kubernetes.io/zh-cn/blog/)上阅读更多关于 Kubernetes 正在发生的事情
- 了解更多关于 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team) 的信息
