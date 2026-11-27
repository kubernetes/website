---
layout: blog
title: "Kubernetes v1.38 抢先看"
date: 2026-11-23T08:00:00-08:00
slug: kubernetes-v1-38-sneak-peek
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.38 Sneak Peek'
date: 2026-11-23T08:00:00-08:00
slug: kubernetes-v1-38-sneak-peek
author: >
  Aaron Braundmeier,
  Arsh Sharma,
  Kirti Goyal,
  Omar Nasser,
  Sayan Chowdhury,
  Urvashi Choubey
-->

<!--
As we get closer to the release date for Kubernetes v1.38, the project develops and matures,
features may be deprecated, removed, or replaced with better ones for the project's overall health.
This blog post outlines some of the planned changes for the Kubernetes v1.38 release that the
release team feels you should be aware of for the continued maintenance of your Kubernetes
environment and keeping up to date with the latest changes. The information listed below is based
on the current status of the v1.38 release and may change before the actual release date.
-->
随着 Kubernetes v1.38 发布日期的临近，项目不断发展和成熟，
为了项目的整体健康，某些特性可能会被弃用、移除或被更好的特性替代。
本文概述了 Kubernetes v1.38 版本中的一些计划内变更，
发布团队认为你应该了解这些变更，以便持续维护你的 Kubernetes 环境，
并跟上最新的变化。以下信息基于 v1.38 版本的当前状态，
在实际发布日期之前可能会发生变化。

<!--
## Deprecations and removals for Kubernetes v1.38

### kubectl: WebSocket opt-out environment variables removed
-->
## Kubernetes v1.38 的弃用和移除   {#deprecations-and-removals-for-kubernetes-v138}

### kubectl：用于关闭 WebSocket 的环境变量被移除

<!--
`kubectl` has used WebSockets instead of SPDY by default for `kubectl exec`, `attach` and `cp` since
v1.30, and for `kubectl port-forward` since v1.31. The `KUBECTL_REMOTE_COMMAND_WEBSOCKETS` and
`KUBECTL_PORT_FORWARD_WEBSOCKETS` environment variables let you turn that behavior off. These
variables are going to be removed in v1.38. `kubectl` will then always try WebSockets first and fall
back to SPDY when it needs to (the same as the current default behavior). If your scripts or CI
environments set either of these environment variables, you can remove them since they will no
longer have any effect.
-->
自 v1.30 起，`kubectl exec`、`attach` 和 `cp` 默认使用 WebSocket 而非 SPDY；
自 v1.31 起，`kubectl port-forward` 也是如此。
`KUBECTL_REMOTE_COMMAND_WEBSOCKETS` 和 `KUBECTL_PORT_FORWARD_WEBSOCKETS`
环境变量可以让你关闭这一行为。这些变量将在 v1.38 中被移除。
届时 `kubectl` 将始终优先尝试 WebSocket，并在需要时回退到 SPDY
（与当前的默认行为相同）。如果你的脚本或 CI 环境设置了这两个环境变量中的任意一个，
可以将其移除，因为它们将不再有任何作用。

<!--
To learn more, refer to
[KEP-4006: Transition from SPDY to WebSockets](https://kubernetes.dev/resources/keps/4006).
-->
要了解更多信息，参阅
[KEP-4006：从 SPDY 过渡到 WebSocket](https://kubernetes.dev/resources/keps/4006)。

<!--
### kubectl: `name` dropped from kuberc credential plugin allowlist entries

The `kuberc` file keeps kubectl user preferences separate from cluster credentials in the
kubeconfig, including an allowlist of the credential plugins `kubectl` is allowed to run. In the
beta `kubectl.config.k8s.io/v1beta1` API, an allowlist entry can use `name` as an alias for
`command`. The `name` field (not `command`) has been deprecated since v1.36.
-->
### kubectl：kuberc 凭证插件允许列表条目中的 `name` 字段被移除

`kuberc` 文件将 kubectl 用户偏好与 kubeconfig 中的集群凭证分开存放，
其中包括一份允许列表，用于指定 `kubectl` 可以运行哪些凭证插件。
在 Beta 阶段的 `kubectl.config.k8s.io/v1beta1` API 中，
允许列表条目可以使用 `name` 作为 `command` 的别名。
自 v1.36 起，`name` 字段（而非 `command`）已被弃用。

<!--
With `kuberc` expected to graduate to stable in v1.38, the new `kubectl.config.k8s.io/v1` API will
not include `name`. If any of your allowlist entries use `name`, change them to `command` now.

To learn more, refer to
[KEP-3104: Separate kubectl user preferences from cluster configs](https://kubernetes.dev/resources/keps/3104).
-->
`kuberc` 预计将在 v1.38 中进阶到稳定版，新的 `kubectl.config.k8s.io/v1` API 将不再包含 `name`。
如果你的任何允许列表条目使用了 `name`，请立即改为 `command`。

要了解更多信息，参阅
[KEP-3104：将 kubectl 用户偏好与集群配置分开](https://kubernetes.dev/resources/keps/3104)。

<!--
## Ongoing major changes

### Future removal of cgroup v1 support {#cgroup-v1-support}
-->
## 持续进行中的重大变更   {#ongoing-major-changes}

### 未来将移除对 cgroup v1 的支持   {#cgroup-v1-support}

<!--
Support for cgroup v1 is being phased out. Since v1.35, the kubelet fails to start on nodes that use
cgroup v1 unless you set `failCgroupV1: false` in the kubelet configuration. This option remains
available in v1.38, but it should be treated as a short-term fix as support for cgroup v1 is planned
to be removed in a future release. If you haven't already, please plan your migration to
[cgroup v2](/docs/concepts/architecture/cgroups/).

To learn more, refer to
[KEP-5573: Remove cgroup v1 support](https://kubernetes.dev/resources/keps/5573).
-->
对 cgroup v1 的支持正被逐步淘汰。自 v1.35 起，
对于使用 cgroup v1 的节点，除非你在 kubelet 配置中设置 `failCgroupV1: false`，
否则 kubelet 将无法启动。此选项在 v1.38 中仍然可用，但应将其视为一种短期修复方案，
因为对 cgroup v1 的支持计划在未来的某个版本中被移除。
如果你尚未开始，请规划迁移到 [cgroup v2](/zh-cn/docs/concepts/architecture/cgroups/)。

要了解更多信息，参阅
[KEP-5573：移除 cgroup v1 支持](https://kubernetes.dev/resources/keps/5573)。

<!--
### Admission webhooks no longer receive authentication and authorization review requests {#webhook-virtual-resources}

Since v1.37, the `ExcludeAdmissionWebhookVirtualResources` feature gate has been enabled by default.
With it on, validating and mutating admission webhooks no longer receive requests for (virtual)
writes to TokenReview, SelfSubjectReview, SubjectAccessReview, SelfSubjectAccessReview,
LocalSubjectAccessReview or SelfSubjectRulesReview. Creating or updating a webhook configuration
whose rules name one of these resources returns a deprecation warning, and the API server logs any
existing configurations that are affected when it starts.
-->
### 准入 Webhook 不再接收身份验证和鉴权审查请求   {#webhook-virtual-resources}

自 v1.37 起，`ExcludeAdmissionWebhookVirtualResources` 特性门控已默认启用。
启用后，验证和变更准入 Webhook 不再接收对 TokenReview、SelfSubjectReview、
SubjectAccessReview、SelfSubjectAccessReview、LocalSubjectAccessReview
或 SelfSubjectRulesReview 的（虚拟）写入请求。
如果创建或更新 Webhook 配置时，其规则指定了这些资源之一，操作会返回一条弃用警告；
API 服务器在启动时也会记录受影响的现有配置。

<!--
If you rely on a webhook to see these requests, you can turn the feature gate off for now, but note
that the gate is planned to be locked on when the feature graduates to stable.

To learn more, refer to
[KEP-5793: Manifest Based Admission Control Config](https://kubernetes.dev/resources/keps/5793).
-->
如果你依赖某个 Webhook 来查看这些请求，可以暂时关闭该特性门控，
但请注意，当此特性进阶到稳定版时，该门控计划锁定为启用状态。

要了解更多信息，参阅
[KEP-5793：基于清单的准入控制配置](https://kubernetes.dev/resources/keps/5793)。

<!--
## Breaking changes in Kubernetes v1.38

### Container runtimes must report the cgroup driver {#cgroup-driver-from-cri}
-->
## Kubernetes v1.38 中的破坏性变更   {#breaking-changes-in-kubernetes-v138}

### 容器运行时必须报告 cgroup 驱动   {#cgroup-driver-from-cri}

<!--
The kubelet in v1.37 and older supported releases provides a legacy mechanism to configure the
cgroup driver. The modern way to do that is via the CRI `RuntimeConfig` RPC, which reports the
cgroup driver that the container runtime recommends using. In v1.38, the kubelet defaults to not
allowing the legacy configuration mechanism: it will be both deprecated and unavailable unless
explicitly re-activated. As a result, v1.38 nodes will essentially require that your container
runtime is running **before** the kubelet starts (to look up the expected cgroup driver); if the
kubelet can't get the cgroup driver from the runtime even after retrying, it will exit with an error
before even registering the node.
-->
v1.37 及更早的受支持版本中的 kubelet 提供了一种用于配置 cgroup 驱动的传统机制。
现代的做法是通过 CRI `RuntimeConfig` RPC，由容器运行时报告其建议使用的 cgroup 驱动。
在 v1.38 中，kubelet 默认不再允许使用这种传统的配置机制：
除非显式重新启用，否则该机制既被弃用又不可用。
因此，v1.38 节点实际上要求你的容器运行时在 kubelet 启动**之前**就已运行
（以便查询预期的 cgroup 驱动）；如果 kubelet 即使重试后仍无法从运行时获取 cgroup 驱动，
它将在注册节点之前就以错误状态退出。

<!--
As part of this upcoming release, the `cgroupDriver` field in the kubelet configuration file will be
deprecated. Not only is specifying that field going to be deprecated, the kubelet will actually
reject it unless you reactivate the legacy mechanism by enabling the (temporary)
`LegacyCgroupDriverFallback` feature gate. The kubeadm tool will also no longer set `cgroupDriver`
to `systemd` by default, and its preflight checks will report an error if the runtime doesn't
support the RPC. If any of your nodes run an older, incompatible container runtime, you should
follow the instructions in the official v1.38 release notes about how to upgrade.
-->
作为本次即将发布的版本的一部分，kubelet 配置文件中的 `cgroupDriver` 字段将被弃用。
不仅指定该字段会被弃用，而且除非你通过启用（临时的）`LegacyCgroupDriverFallback`
特性门控重新激活传统机制，否则 kubelet 实际上会拒绝该字段。
kubeadm 工具也不再默认将 `cgroupDriver` 设置为 `systemd`；
如果运行时不支持该 RPC，kubeadm 的预检将报告错误。
如果你的任何节点运行的是较旧的、不兼容的容器运行时，
请遵照 v1.38 官方发布说明中关于如何升级的指示操作。

<!--
To learn more, refer to
[KEP-4033: Discover cgroup driver from CRI](https://kubernetes.dev/resources/keps/4033) and
[kubernetes/kubernetes#136731](https://github.com/kubernetes/kubernetes/pull/136731).
-->
要了解更多信息，参阅
[KEP-4033：从 CRI 发现 cgroup 驱动](https://kubernetes.dev/resources/keps/4033)和
[kubernetes/kubernetes#136731](https://github.com/kubernetes/kubernetes/pull/136731)。

<!--
### Pod-level resources: swap behavior changes on `LimitedSwap` nodes {#pod-level-resources-swap}

If you use pod-level resources on Linux nodes that use cgroup v2 and are configured with
`LimitedSwap`, the kubelet in v1.38 will start applying swap limits based on the Pod's pod-level
memory settings. This means that Pods whose pod-level memory request equals their memory limit will
get no swap at all (both for the Pod and for every container in it), even if a container sets a
memory request lower than its limit. Check any workloads that rely on swap before you upgrade, and
be sure to read the official release notes for v1.38 for detailed advice.

To learn more, refer to
[KEP-2837: Pod Level Resource Specifications](https://kubernetes.dev/resources/keps/2837).
-->
### Pod 级别资源：`LimitedSwap` 节点上的交换行为发生变化   {#pod-level-resources-swap}

如果你在使用 cgroup v2 且配置了 `LimitedSwap` 的 Linux 节点上使用 Pod 级别资源，
那么 v1.38 中的 kubelet 将开始根据 Pod 的 Pod 级别内存设置来施加交换内存限制。
这意味着，Pod 级别内存请求等于其内存限制的 Pod
将完全得不到交换内存（无论对 Pod 本身还是对其中的每个容器都是如此），
即使某个容器将其内存请求设置得低于其限制。
升级之前，请检查所有依赖交换内存的工作负载，
并务必阅读 v1.38 的官方发布说明以获取详细建议。

要了解更多信息，参阅
[KEP-2837：Pod 级别资源规约](https://kubernetes.dev/resources/keps/2837)。

<!--
## Featured enhancements of Kubernetes v1.38

The following list of enhancements is likely to be included in the upcoming v1.38 release. This is
not a commitment and the release content is subject to change.
-->
## Kubernetes v1.38 的重点增强   {#featured-enhancements-of-kubernetes-v138}

以下增强特性列表很可能会包含在即将发布的 v1.38 版本中。
这不是一种承诺，发布内容可能会发生变化。

<!--
### kubectl user preferences (kuberc) graduating to stable {#kuberc}

kuberc, the separate kubectl configuration file for user preferences such as aliases, default
options and a credential plugin policy, is expected to graduate to stable in v1.38.

To learn more, read [Kubectl user preferences (kuberc)](/docs/reference/kubectl/kuberc/) or refer to
[KEP-3104: Separate kubectl user preferences from cluster configs](https://kubernetes.dev/resources/keps/3104).
-->
### kubectl 用户偏好设置（kuberc）进阶到稳定版   {#kuberc}

kuberc 是一个独立的 kubectl 配置文件，用于存放别名、默认选项和凭证插件策略等用户偏好设置，
预计将在 v1.38 中进阶到稳定版。

要了解更多信息，参阅
[kubectl 用户偏好设置（kuberc）](/zh-cn/docs/reference/kubectl/kuberc/)或参阅
[KEP-3104：将 kubectl 用户偏好与集群配置分开](https://kubernetes.dev/resources/keps/3104)。

<!--
### Pod-level resources graduating to stable {#pod-level-resources}

Pod-level resources, which let you set CPU, memory and hugepages requests and limits for a Pod as a
whole, are expected to graduate to stable in v1.38. If you run Linux nodes with `LimitedSwap`, see
the [swap behavior change](#pod-level-resources-swap) above before you upgrade.
-->
### Pod 级别资源进阶到稳定版   {#pod-level-resources}

Pod 级别资源允许你为整个 Pod 设置 CPU、内存和巨页的请求与限制，
预计将在 v1.38 中进阶到稳定版。
如果你运行的是配置了 `LimitedSwap` 的 Linux 节点，
请在升级前参阅上文的[交换行为变更](#pod-level-resources-swap)。

<!--
To learn more, read
[Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
or refer to
[KEP-2837: Pod Level Resource Specifications](https://kubernetes.dev/resources/keps/2837).
-->
要了解更多信息，参阅[分配 Pod 级别 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)，
或参阅 [KEP-2837：Pod 级别资源规约](https://kubernetes.dev/resources/keps/2837)。

<!--
### DRA support for partitionable devices graduating to stable {#dra-partitionable-devices}

Partitionable devices let a
[Dynamic Resource Allocation](/docs/concepts/resource-management/dynamic-resource-allocation/) (DRA)
driver advertise a device such as a GPU both as a whole and as smaller partitions, and the scheduler
allocates only combinations that fit within the physical device. The feature is expected to
graduate to stable in v1.38, and the `DRAPartitionableDevices` feature gate will then be locked on.
-->
### DRA 对可分区设备的支持进阶到稳定版   {#dra-partitionable-devices}

可分区设备允许[动态资源分配](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/)（DRA）
驱动将 GPU 等设备既作为整体、也作为更小的分区来公布，调度器只会分配能容纳于该物理设备之内的组合。
此特性预计将在 v1.38 中进阶到稳定版，届时 `DRAPartitionableDevices` 特性门控将被锁定为启用状态。

<!--
To learn more, read
[Partitionable devices](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)
or refer to
[KEP-4815: DRA: Add support for partitionable devices](https://kubernetes.dev/resources/keps/4815).
-->
要了解更多信息，
参阅[可分区设备](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices)，
或参阅 [KEP-4815：DRA：增加对可分区设备的支持](https://kubernetes.dev/resources/keps/4815)。

<!--
### EvictionRequest API (alpha) {#eviction-request-api}

Evicting a Pod isn’t always as simple as terminating it. Some applications may be in the middle of
important work, such as data migration or cleanup, and terminating them without giving them time to
prepare can cause disruptions.
-->
### EvictionRequest API（Alpha）   {#eviction-request-api}

驱逐 Pod 并不总是像终止它那么简单。有些应用可能正在进行重要的工作，
例如数据迁移或清理，如果不给它们留出准备时间就终止，可能会造成中断。

<!--
The EvictionRequest API introduces a more coordinated way to evict Pods. It gives applications and
controllers time to prepare before a Pod is evicted. For example, when a node needs to be drained or
a Pod needs to be moved to another node, a controller can create an EvictionRequest to signal that
this Pod needs to be evicted.

The eviction request controller coordinates with the responders configured for the Pod. These
responders can perform application-specific tasks such as completing ongoing work, cleaning up
resources, or migrating data before the Pod is terminated.
-->
EvictionRequest API 引入了一种更协调的 Pod 驱逐方式，
它在 Pod 被驱逐之前给应用和控制器留出准备时间。
例如，当需要排空某个节点或将某个 Pod 迁移到另一个节点时，
控制器可以创建一个 EvictionRequest，以表明该 Pod 需要被驱逐。

驱逐请求控制器会与为 Pod 配置的响应方协调。
这些响应方可以在 Pod 被终止之前执行特定于应用的任务，
例如完成正在进行的工作、清理资源或迁移数据。

<!--
If no custom responder is available or responders don't complete the process, Kubernetes can fall
back to the existing API-initiated eviction mechanism, which continues to respect
PodDisruptionBudgets (PDBs). The EvictionRequest API does not replace PDBs. It gives applications a
chance to participate in the eviction process.

As this is an alpha feature, you will need to enable the `EvictionRequestAPI` feature gate **and**
the relevant alpha API group. Check the v1.38 release notes and documentation, once they're
available, to confirm exactly what's required.

To learn more, refer to [KEP-4563: EvictionRequest API](https://kubernetes.dev/resources/keps/4563).
-->
如果没有可用的自定义响应方，或者响应方未能完成该过程，
Kubernetes 可以回退到现有的 API 发起的驱逐机制，该机制仍然遵循
PodDisruptionBudget（PDB）。EvictionRequest API 并不取代 PDB，
它为应用提供了参与驱逐过程的机会。

由于这是 Alpha 特性，你需要启用 `EvictionRequestAPI` 特性门控**以及**相关的 Alpha API 组。
待 v1.38 的发布说明和文档可用后，请查看它们以确认具体要求。

要了解更多信息，参阅
[KEP-4563：EvictionRequest API](https://kubernetes.dev/resources/keps/4563)。

<!--
## Want to know more?

New features and deprecations are also announced in the Kubernetes release notes. We will formally
announce what's new in [Kubernetes v1.38](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.38.md)
as part of the CHANGELOG for that release.

The Kubernetes v1.38 release is planned for **Wednesday, December 16th, 2026**. Stay tuned for updates!

You can see the announcements of changes in the release notes for:
-->
## 想了解更多？   {#want-to-know-more}

新特性和弃用也会在 Kubernetes 发布说明中公布。
我们将作为该版本 CHANGELOG 的一部分，正式公布
[Kubernetes v1.38](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.38.md) 中的新内容。

Kubernetes v1.38 版本计划于 **2026 年 12 月 16 日（星期三）** 发布。敬请关注更新！

你可以在以下版本的发布说明中查看变更公告：

- [Kubernetes v1.37](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.37.md)
- [Kubernetes v1.36](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md)
- [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md)

<!--
## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many
[Special Interest Groups](https://kubernetes.dev/community/community-groups/sigs/) (SIGs) that align
with your interests.
-->
## 参与其中   {#get-involved}

参与 Kubernetes 最简单的方式是加入众多与你兴趣相符的[特别兴趣小组](https://kubernetes.dev/community/community-groups/sigs/)
（SIG）之一。

<!--
If you don't know where to start, join our monthly
[New Contributor Orientations](https://www.kubernetes.dev/docs/orientation/) where we teach the
community how the project is structured, and we'll guide you on how to make your first contribution
to the project.
-->
如果你不知道从哪里开始，请加入我们每月的[新贡献者入门介绍](https://www.kubernetes.dev/docs/orientation/)，
在活动中我们会向社区介绍项目的结构，并指导你如何为项目做出首次贡献。

<!--
- Read more on how to become a [Kubernetes Contributor](https://www.kubernetes.dev/docs/guide/)
- Read more about what’s happening with Kubernetes on our [blog](https://kubernetes.io/blog/)
- Join us on [Slack](https://slack.k8s.io/)
- Follow us on [X](https://x.com/kubernetesio)
- Follow us on [LinkedIn](https://www.linkedin.com/company/kubernetes/)
- Follow us on [Bluesky](https://bsky.app/profile/kubernetes.io) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Post questions (or answer questions) on
  [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
- Share your [Kubernetes End User Story](https://www.cncf.io/case-studies/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
- 阅读更多关于如何成为 [Kubernetes 贡献者](https://www.kubernetes.dev/docs/guide/)的信息
- 在我们的[博客](https://kubernetes.io/zh-cn/blog/)上阅读更多关于 Kubernetes 的最新动态
- 在 [Slack](https://slack.k8s.io/) 上加入我们
- 在 [X](https://x.com/kubernetesio) 上关注我们
- 在 [LinkedIn](https://www.linkedin.com/company/kubernetes/) 上关注我们
- 在 [Bluesky](https://bsky.app/profile/kubernetes.io) 上关注我们以获取最新更新
- 在 [Discuss](https://discuss.kubernetes.io/) 上参与社区讨论
- 在 [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes) 上提问（或回答问题）
- 分享你的 [Kubernetes 最终用户故事](https://www.cncf.io/case-studies/)
- 了解更多关于 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team)的信息
