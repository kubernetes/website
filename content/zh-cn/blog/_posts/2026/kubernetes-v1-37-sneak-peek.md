---
layout: blog
title: "Kubernetes v1.37 抢先看"
date: 2026-07-31T08:00:00-08:00
slug: kubernetes-v1-37-sneak-peek
author: >
  Arsh Sharma、
  Christopher Tineo、
  Kirti Goyal、
  Sophia Ugochukwu、
  Swathi Rao、
  Troy Connor
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.37 Sneak Peek'
date: 2026-07-31T08:00:00-08:00
slug: kubernetes-v1-37-sneak-peek
author: >
  Arsh Sharma,
  Christopher Tineo,
  Kirti Goyal,
  Sophia Ugochukwu,
  Swathi Rao,
  Troy Connor
-->

<!--
As we get closer to the release date for Kubernetes v1.37, the project develops and matures,
features may be deprecated, removed, or replaced with better ones for the project's overall
health. This blog outlines some of the planned changes for the Kubernetes v1.37 release that the
release team feels you should be aware of for the continued maintenance of your Kubernetes
environment and keeping up to date with the latest changes. The information below reflects the
current status of the v1.37 release and may change before the actual release date.
-->
随着 Kubernetes v1.37 发布日期的临近，项目不断发展和成熟，
为了项目的整体健康，某些特性可能会被弃用、移除或被更好的特性替代。
本文概述了 Kubernetes v1.37 版本中的一些计划内变更，
发布团队认为你应该了解这些变更，以便持续维护你的 Kubernetes 环境，
并跟上最新的变化。以下信息反映了 v1.37 版本的当前状态，
在实际发布日期之前可能会发生变化。

<!--
## Deprecations and removals for Kubernetes v1.37

### Kubectl: `kubectl run --filename/-f` to be deprecated
-->
## Kubernetes v1.37 的弃用和移除

### kubectl：`kubectl run --filename/-f` 将被弃用

<!--
The `--filename` (or `-f`) flag for `kubectl run` is being deprecated as the generated pod is always built purely from CLI arguments like `NAME` and `--image`.
-->
`kubectl run` 的 `--filename`（或 `-f`）参数将被弃用，
因为生成的 Pod 始终纯粹由 `NAME` 和 `--image` 等 CLI 参数构建。

<!--
See [kubernetes/kubernetes#138671](https://github.com/kubernetes/kubernetes/issues/138671) for the original issue and discussion.
-->
原始 Issue 和讨论请参见
[kubernetes/kubernetes#138671](https://github.com/kubernetes/kubernetes/issues/138671)。

<!--
### Kubelet: Static Pods can no longer reference Secrets or ConfigMaps
-->
### kubelet：静态 Pod 不再能引用 Secret 或 ConfigMap

<!--
Static Pods were never meant to read API resources directly, since they aren't created through the API server — but a bug let them reference Secrets or ConfigMaps via fields like `configMapRef` or `secretRef`. That bug is now fixed: as of v1.37 these references are strictly prohibited, and the `PreventStaticPodAPIReferences` feature gate that previously let you opt out of the restriction has been removed.
-->
静态 Pod 从未打算直接读取 API 资源，因为它们不是通过 API 服务器创建的 ——
但一个缺陷曾允许它们通过 `configMapRef` 或 `secretRef` 等字段引用 Secret 或 ConfigMap。
该缺陷现已修复：从 v1.37 起，这些引用被严格禁止，
并且先前用于绕过此限制的 `PreventStaticPodAPIReferences` 特性门控已被移除。

<!--
See [kubernetes/kubernetes#140226](https://github.com/kubernetes/kubernetes/issues/140226) for the original issue and discussion.
-->
原始 Issue 和讨论请参见
[kubernetes/kubernetes#140226](https://github.com/kubernetes/kubernetes/issues/140226)。

<!--
### Deprecating kube-proxy's support for `ipvs` mode
-->
### 弃用 kube-proxy 对 `ipvs` 模式的支持

<!--
`kube-proxy` support for `ipvs` mode was introduced in v1.8 to resolve `iptables` performance bottlenecks. However, since the kernel `ipvs` API alone cannot fully implement Kubernetes Services, `ipvs` mode continues to use `iptables` underneath ([KEP-3866, "The ipvs mode of kube-proxy will not save us"](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/3866-nftables-proxy/README.md#the-ipvs-mode-of-kube-proxy-will-not-save-us)).
-->
`kube-proxy` 对 `ipvs` 模式的支持是在 v1.8 中引入的，旨在解决 `iptables` 性能瓶颈。
然而，由于内核 `ipvs` API 单独无法完全实现 Kubernetes Service，
`ipvs` 模式在底层仍继续使用 `iptables`
（[KEP-3866，“kube-proxy 的 ipvs 模式救不了我们”](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/3866-nftables-proxy/README.md#the-ipvs-mode-of-kube-proxy-will-not-save-us)）。

<!--
Clusters running `kube-proxy` in ipvs mode (or mode: ipvs in KubeProxyConfiguration) would now be logging a deprecation warning on startup. The deprecation timeline looks like this:
- By v1.40, `ipvs` mode for `kube-proxy` is expected to be disabled by default (still selectable via the feature gate)
- By v1.43, support for `ipvs` mode would be removed entirely [KEP-5495, Graduation Criteria](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/5495-deprecate-ipvs-mode-in-kube-proxy/README.md#graduation-criteria).
To confirm which mode you're currently running, use:
-->
在 ipvs 模式下（或在 KubeProxyConfiguration 中设置 `mode: ipvs`）运行 `kube-proxy` 的集群，
现在会在启动时记录一条弃用警告。弃用时间表如下：

- 到 v1.40，`kube-proxy` 的 `ipvs` 模式预计将默认禁用（仍可通过特性门控选择）
- 到 v1.43，对 `ipvs` 模式的支持将被完全移除
  [KEP-5495，毕业标准](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/5495-deprecate-ipvs-mode-in-kube-proxy/README.md#graduation-criteria)。

要确认你当前运行的是哪种模式，请使用：

```bash
kubectl -n kube-system get configmap kube-proxy -o jsonpath='{.data.config\.conf}' | grep 'mode:'
```

<!--
To understand the rationale behind this deprecation, see [KEP-5495: Deprecate ipvs mode in kube-proxy](https://kubernetes.dev/resources/keps/5495).
-->
要了解此次弃用背后的基本原理，请参见
[KEP-5495：弃用 kube-proxy 中的 ipvs 模式](https://kubernetes.dev/resources/keps/5495)。

<!--
## Ongoing major changes

### Future removal of cgroup v1 support {#cgroup-v1-support}
-->
## 持续进行中的重大变更

### 未来将移除对 CGroup v1 的支持   {#cgroup-v1-support}

<!--
As modern Linux distributions and container runtimes use [cgroup v2](/docs/concepts/architecture/cgroups/) as the default, support for the legacy cgroup v1 is officially being phased out. Since the v1.35 release, the `failCgroupV1` setting has defaulted to true. Consequently, the `kubelet` will fail to initialize on any nodes that still rely on cgroup v1 unless an explicit configuration override is applied.
-->
随着现代 Linux 发行版和容器运行时使用
[CGroup v2](/zh-cn/docs/concepts/architecture/cgroups/) 作为默认值，
对旧版 CGroup v1 的支持正被正式逐步淘汰。
自 v1.35 版本起，`failCgroupV1` 设置默认为 true。
因此，`kubelet` 将在任何仍依赖 CGroup v1 的节点上初始化失败，
除非应用显式的配置覆写。

<!--
# temporary override
-->
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
failCgroupV1: false # 临时覆写
```

<!--
Using this override should be considered a short-term fix. Advanced resource management capabilities, such as In-Place Pod Resizing and Tiered Memory Protection, depend entirely on cgroup v2. While the override remains available in Kubernetes v1.37, users are encouraged to migrate to cgroup v2, as support for cgroup v1 is planned to be removed in a future release.
-->
使用此覆写应被视为一种短期修复。
高级资源管理能力，例如就地 Pod 调整大小（In-Place Pod Resizing）和
分层内存保护（Tiered Memory Protection），完全依赖于 CGroup v2。
虽然该覆写在 Kubernetes v1.37 中仍然可用，但鼓励用户迁移到 CGroup v2，
因为对 CGroup v1 的支持计划在未来的某个版本中被移除。

<!--
To learn more about this deprecation, refer to [KEP-5573: Remove CGroup v1 support](https://kubernetes.dev/resources/keps/5573).
-->
要了解有关此弃用的更多信息，请参阅
[KEP-5573：移除 CGroup v1 支持](https://kubernetes.dev/resources/keps/5573)。

<!--
## Breaking changes in Kubernetes v1.37

### SELinux volume relabeling ("SELinuxMount") graduates to GA {#SELinuxMount-GA}
-->
## Kubernetes v1.37 中的破坏性变更

### SELinux 卷重新标记（"SELinuxMount"）进入 GA  {#SELinuxMount-GA}

<!--
SELinuxMount is expected to reach GA and be enabled by default in v1.37. Volumes would then be
mounted with `-o context=<label>` (the mount option default) instead of being recursively
relabeled, but **only** when the volume's CSI driver opts in via a CSIDriver that sets `.spec
seLinuxMount: true`.
-->
SELinuxMount 预计将在 v1.37 中达到 GA 并默认启用。
届时卷将使用 `-o context=<label>`（挂载选项默认值）挂载，
而不是被递归地重新标记，但**仅当**卷的 CSI 驱动通过设置
`.spec.seLinuxMount: true` 的 CSIDriver 选择加入时才如此。

<!--
Because a single mount can only hold one SELinux context, pods with different SELinux labels sharing a volume on the same node (which previously coexisted under recursive relabeling) may now fail to start. To retain the previous recursive behavior for a specific workload, set `seLinuxChangePolicy: Recursive` in the Pod spec.
-->
由于单个挂载只能持有一个 SELinux 上下文，
在同一节点上共享一个卷、具有不同 SELinux 标签的 Pod
（先前在递归重新标记下可以共存）现在可能无法启动。
要为特定工作负载保留先前的递归行为，请在 Pod 规约中设置
`seLinuxChangePolicy: Recursive`。

<!--
Clusters without SELinux enabled see no effect at all. To learn more, check [SELinux Volume Label Changes goes GA (and likely implications in v1.37)](/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/)
-->
未启用 SELinux 的集群完全不受影响。
要了解更多信息，请查看
[SELinux 卷标签变更进入 GA 阶段（以及 v1.37 中可能的影响）](/zh-cn/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/)

<!--
## Featured enhancements of Kubernetes v1.37

### Metrics API goes GA {#metrics-api-ga}
-->
## Kubernetes v1.37 的重点增强

### Metrics API 进入 GA {#metrics-api-ga}

<!--
The `metrics.k8s.io` API is expected to graduate to Stable (GA) in Kubernetes v1.37 after spending nearly nine years in Beta. The API provides a standard way to retrieve CPU and memory usage for pods and nodes, powering widely used Kubernetes features such as the Horizontal Pod Autoscaler (HPA) and commands like `kubectl top`.
-->
`metrics.k8s.io` API 在 Beta 阶段停留近九年后，
预计将在 Kubernetes v1.37 中毕业至稳定版（GA）。
该 API 提供了一种标准方式来检索 Pod 和节点的 CPU 和内存使用情况，
为广泛使用的 Kubernetes 特性（例如水平 Pod 自动扩缩器（HPA））
以及 `kubectl top` 等命令提供支持。

<!--
This graduation recognizes the API's stability and widespread adoption, with no functional changes expected. Both `v1` and `v1beta1` will remain usable during the transition, enabling developers to adopt the stable API at their own pace without breaking existing workflows.
-->
此次毕业认可了该 API 的稳定性和广泛采用，预计不会有功能性变更。
在过渡期间，`v1` 和 `v1beta1` 都将继续可用，
使开发者能够按自己的节奏采用稳定版 API，而不会破坏现有工作流。

<!--
To learn more about this enhancement, refer to [KEP-5207: metrics.k8s.io API definition](https://www.kubernetes.dev/resources/keps/5207/).
-->
要了解有关此增强的更多信息，请参阅
[KEP-5207：metrics.k8s.io API 定义](https://www.kubernetes.dev/resources/keps/5207/)。

<!--
### Kubelet in UserNS a.k.a. Rootless Mode
-->
### UserNS 中的 kubelet，即 Rootless 模式

<!--
Traditionally, Kubernetes node components such as the `kubelet` run with root privileges on the host. While necessary for many deployments, this also means that a vulnerability in one of these components could potentially have a greater impact on the underlying system.
-->
传统上，Kubernetes 节点组件（例如 `kubelet`）在主机上以 root 特权运行。
虽然这对许多部署是必要的，但这也意味着这些组件中某个组件的漏洞可能会对底层系统产生更大的影响。

<!--
With Kubernetes v1.37, kubelet in User Namespace (Rootless Mode) is expected to graduate to
Beta. This enhancement allows Kubernetes node components to run inside a Linux user namespace as an unprivileged user on the host while still behaving as root within the namespace. By reducing the need for host-level root privileges, it adds an extra layer of isolation and helps limit the impact of potential vulnerabilities affecting node components.
-->
在 Kubernetes v1.37 中，用户命名空间中的 kubelet
（即 Rootless 模式）预计将毕业至 Beta。
此增强允许 Kubernetes 节点组件在 Linux 用户命名空间内以主机上的非特权用户身份运行，
同时在命名空间内仍表现为 root。
通过减少对主机级 root 特权的需求，它增加了一层额外的隔离，
并有助于限制影响节点组件的潜在漏洞的影响范围。

<!--
To learn more about this enhancement, refer to [KEP-2033: Kubelet in UserNS(aka Rootless Mode)](https://kubernetes.dev/resources/keps/4960).
-->
要了解有关此增强的更多信息，请参阅
[KEP-2033：UserNS 中的 Kubelet（即 Rootless 模式）](https://kubernetes.dev/resources/keps/4960)。

<!--
### Volume health monitor
-->
### 卷健康监控

<!--
Historically, Kubernetes has lacked an API for CSI drivers to report storage failures, which become evident only through
failed mounts or hung I/O. Since remediation controllers had nothing machine-readable to act upon, the only way to figure out the root cause behind this failure was to cross-reference Kubernetes objects alongside external vendor dashboards.
-->
历史上，Kubernetes 一直缺乏一个供 CSI 驱动报告存储故障的 API，
这些故障仅通过挂载失败或 I/O 挂起才变得明显。
由于修复控制器没有机器可读的内容可供处理，
找出此类故障背后根本原因的唯一方法是将 Kubernetes
对象与外部供应商仪表板进行交叉比对。

<!--
In Kubernetes v1.37, this KEP resets graduation to Alpha after an initial implementation in v1.21 and introduces four new CSI
RPCs. The controller plugin reports the health of storage volumes using `ControllerListVolumeHealth` (lists unhealthy volumes) and `ControllerGetVolumeHealth` (checks a specific volume). A controller-side health monitor polls these CSI controllers and stores the results in
`PersistentVolumeClaim.status.healthStatus`.
-->
在 Kubernetes v1.37 中，此 KEP 在 v1.21 初步实现后将毕业状态重置为 Alpha，
并引入了四个新的 CSI RPC。控制器插件使用
`ControllerListVolumeHealth`（列出不健康的卷）和
`ControllerGetVolumeHealth`（检查特定卷）来报告存储卷的健康状况。
控制器侧的健康监控器轮询这些 CSI 控制器，并将结果存储在
`PersistentVolumeClaim.status.healthStatus` 中。

<!--
On the node side, the kubelet calls `NodeGetVolumeHealth` to obtain the health of individual volumes on that node and records
it in `Pod.status.volumeHealth`, while `NodeGetStorageHealth` reports the health of the drivers registered to a node in
`CSINode.status.storageHealth`.
-->
在节点侧，kubelet 调用 `NodeGetVolumeHealth` 来获取该节点上各个卷的健康状况，
并将其记录在 `Pod.status.volumeHealth` 中；
而 `NodeGetStorageHealth` 将注册到节点的驱动的健康状况报告在
`CSINode.status.storageHealth` 中。

<!--
The error vocabulary is kept simple, extensible, and machine-parsable (`Inaccessible`, `Degraded`, etc.), with further driver-specific elaboration available via `reason` and `message`. Finally, the controller-side and node-side reports are kept independent and are hence displayed separately, providing a more holistic view of storage health to consumers.
-->
错误词汇表保持简单、可扩展且机器可解析（`Inaccessible`、`Degraded` 等），
并可通过 `reason` 和 `message` 提供更多特定于驱动的详细说明。
最后，控制器侧和节点侧的报告保持独立，因此分开显示，
从而为使用者提供更全面的存储健康状况视图。

<!--
To learn more about this enhancement, refer to [KEP-1432: Volume Health Monitor](https://kubernetes.dev/resources/keps/1432).
-->
要了解有关此增强的更多信息，请参阅
[KEP-1432：卷健康监控](https://kubernetes.dev/resources/keps/1432)。

<!--
## Want to know more?
-->
## 想了解更多？

<!--
New features and deprecations are also announced in the Kubernetes release notes. We will formally announce what's new in [Kubernetes v1.37](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.37.md) as part of the CHANGELOG for that release.
-->
新特性和弃用也会在 Kubernetes 发布说明中公布。
我们将作为该版本 CHANGELOG 的一部分，正式公布
[Kubernetes v1.37](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.37.md) 中的新内容。

<!--
Kubernetes v1.37 release is planned for **Wednesday, August 26th, 2026**. Stay tuned for updates!
-->
Kubernetes v1.37 版本计划于 **2026 年 8 月 26 日（星期三）** 发布。敬请关注更新！

<!--
You can see the announcements of changes in the release notes for:
-->
你可以在以下版本的发布说明中查看变更公告：

* [Kubernetes v1.36](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md)

* [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md)

* [Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md)

* [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md)

<!--
## Get involved
-->
## 参与其中

<!--
The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://kubernetes.dev/community/community-groups/sigs/) (SIGs) that align with your interests.
-->
参与 Kubernetes 最简单的方式是加入众多与你兴趣相符的
[特别兴趣小组](https://kubernetes.dev/community/community-groups/sigs/)（SIG）之一。

<!--
If you don't know where to start, join our monthly [New Contributor Orientations](https://www.kubernetes.dev/docs/orientation/)
where we teach the community how the project is structured, and we'll guide you on how to make your first contribution to the project.

- Read more on how to become a [Kubernetes Contributor](https://www.kubernetes.dev/docs/guide/)
- Read more about what’s happening with Kubernetes on our [blog](https://kubernetes.io/blog/)
- Join us on [Slack](http://slack.k8s.io/)
- Follow us on [X](https://x.com/kubernetesio)
- Follow us on [LinkedIn](https://www.linkedin.com/company/kubernetes/)
- Follow us on [Bluesky](https://bsky.app/profile/kubernetes.io) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your [Kubernetes End User Story](https://www.cncf.io/case-studies/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
如果你不知道从哪里开始，请加入我们每月的[新贡献者入门介绍](https://www.kubernetes.dev/docs/orientation/)，
在活动中我们会向社区介绍项目的结构，并指导你如何为项目做出首次贡献。

- 阅读更多关于如何成为 [Kubernetes 贡献者](https://www.kubernetes.dev/docs/guide/)的信息
- 在我们的[博客](https://kubernetes.io/blog/)上阅读更多关于 Kubernetes 的最新动态
- 在 [Slack](http://slack.k8s.io/) 上加入我们
- 在 [X](https://x.com/kubernetesio) 上关注我们
- 在 [LinkedIn](https://www.linkedin.com/company/kubernetes/) 上关注我们
- 在 [Bluesky](https://bsky.app/profile/kubernetes.io) 上关注我们以获取最新更新
- 在 [Discuss](https://discuss.kubernetes.io/) 上参与社区讨论
- 在 [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes) 上提问（或回答问题）
- 分享你的 [Kubernetes 最终用户故事](https://www.cncf.io/case-studies/)
- 了解更多关于 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team)的信息
