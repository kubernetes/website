---
layout: blog
title: 'Kubernetes v1.36 抢先一览'
date: 2026-03-30
slug: kubernetes-v1-36-sneak-peek
author: >
  Chad Crowell,
  Kirti Goyal,
  Sophia Ugochukwu,
  Swathi Rao,
  Utkarsh Umre
translator: >
  [Paco Xu](https://github.com/pacoxu)(DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.36 Sneak Peek'
date: 2026-03-30
slug: kubernetes-v1-36-sneak-peek
author: >
  Chad Crowell,
  Kirti Goyal,
  Sophia Ugochukwu,
  Swathi Rao,
  Utkarsh Umre
-->

<!--
Kubernetes v1.36 is coming at the end of April 2026. This release will include removals and deprecations, and it is packed with an impressive number of
enhancements. Here are some of the features we are most excited about in this cycle!

Please note that this information reflects the current state of v1.36 development and may change before release.
-->
Kubernetes v1.36 将于 2026 年 4 月底发布。
本次发布将包含移除和弃用项，并带来数量可观的增强功能。
以下是我们在这个发布周期中最期待的一些特性。

请注意，本文信息反映的是 v1.36 开发的当前状态，发布前仍可能发生变化。

<!--
## The Kubernetes API removal and deprecation process
-->
## Kubernetes API 的移除与弃用流程 {#the-kubernetes-api-removal-and-deprecation-process}

<!--
The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs
may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API
has been marked for removal in a future Kubernetes release. It will continue to function until removal (at least one year from the deprecation), but usage will
result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.
-->
Kubernetes 项目针对功能有一套文档完善的[弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
该策略规定，稳定版 API 只有在有新的稳定替代版本时才会被弃用，并且 API 在每个稳定级别都有最短生命周期。
被弃用的 API 会被标记为将在未来 Kubernetes 版本中移除。
它在移除前会继续工作（自弃用起至少一年），但使用时会显示告警。
被移除的 API 在当前版本中将不再可用，此时你必须迁移到替代方案。

<!--
- Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.
- Beta or pre-release API versions must be supported for 3 releases after the deprecation.
- Alpha or experimental API versions may be removed in any release without prior deprecation notice; this process can become a withdrawal in cases where a different implementation for the same feature is already in place.
-->
- 正式可用（GA）或稳定版 API 可以标记为弃用，但不得在 Kubernetes 的一个主版本内被移除。
- Beta 或预发布 API 版本在弃用后必须继续支持 3 个版本。
- Alpha 或实验性 API 版本可以在任何版本中移除，无需提前发出弃用通知；在同一功能已有不同实现时，此过程也可能变为撤回。

<!--
Whether an API is removed as a result of a feature graduating from beta to stable, or because that API simply did not succeed, all removals comply with this
deprecation policy. Whenever an API is removed, migration options are communicated in the [deprecation guide](/docs/reference/using-api/deprecation-guide/).
-->
无论 API 被移除是因为某功能从 beta 晋升到稳定，还是因为该 API 本身未能成功升级，所有移除都遵循这一弃用策略。
每当 API 被移除时，[弃用指南](/zh-cn/docs/reference/using-api/deprecation-guide/)都会提供迁移选项。

<!--
A recent example of this principle in action is the retirement of the ingress-nginx project, announced
by SIG-Security on March 24, 2026. As stewardship shifts away from the project, the community has been
encouraged to evaluate alternative ingress controllers that align with current security and maintenance
best practices. This transition reflects the same lifecycle discipline that underpins Kubernetes itself,
ensuring continued evolution without abrupt disruption.
-->
这一原则近期的一个实践案例是 ingress-nginx 项目的退役，该消息由 SIG-Security 于 2026 年 3 月 24 日宣布。
随着项目维护权发生变化，社区被鼓励评估符合当前安全与维护最佳实践的替代的 Ingress 控制器实现。
这一过渡体现了支撑 Kubernetes 本身的同一生命周期原则，
确保持续演进且不造成突发中断。

<!--
## Ingress NGINX retirement
-->
## Ingress NGINX 退役 {#ingress-nginx-retirement}

<!--
To prioritize the safety and security of the ecosystem, Kubernetes SIG Network and the Security Response Committee have retired Ingress NGINX on March 24, 2026.
Since that date, there have been no further releases, no bugfixes, and no updates to resolve any security vulnerabilities discovered. Existing deployments of
Ingress NGINX will continue to function, and installation artifacts like Helm charts and container images will remain available.

For full details, see the [official retirement announcement](/blog/2025/11/11/ingress-nginx-retirement/).
-->
为优先保障生态系统的安全，Kubernetes SIG Network 和安全响应委员会（Security Response Committee）
已于 2026 年 3 月 24 日退役 Ingress NGINX。
自该日期起，不再发布后续版本、不再修复缺陷，也不再更新以修复新发现的安全漏洞。
现有 Ingress NGINX 部署将继续运行，Helm Chart 和容器镜像等安装制品也将继续可用。

完整详情请参阅[官方退役公告](/blog/2025/11/11/ingress-nginx-retirement/)。

<!--
## Deprecations and removals for Kubernetes v1.36
-->
## Kubernetes v1.36 的弃用和移除 {#deprecations-and-removals-for-kubernetes-v136}

<!--
### Deprecation of `.spec.externalIPs` in Service
-->
### Service 中 `.spec.externalIPs` 的弃用 {#deprecation-of-specexternalips-in-service}

<!--
The `externalIPs` field in Service `spec` is being deprecated, which means you’ll soon lose a quick way to route arbitrary externalIPs to your Services. This
field has been a known security headache for years, enabling man-in-the-middle attacks on your cluster traffic, as documented in [CVE-2020-8554](https://github.com/kubernetes/kubernetes/issues/970760). From Kubernetes v1.36 and onwards, you will see deprecation warnings when using it, with full removal
planned for v1.43.

If your Services still lean on `externalIPs`, consider using LoadBalancer services for cloud-managed ingress, NodePort for simple port exposure, or Gateway API
for a more flexible and secure way to handle external traffic.

For more details on this enhancement, refer to [KEP-5707: Deprecate service.spec.externalIPs](https://kep.k8s.io/5707)
-->
Service `spec` 中的 `externalIPs` 字段正在被弃用，这意味着你很快将失去把任意 externalIPs 路由到 Service 的快捷方式。
这个字段多年来一直是已知的安全隐患，会让集群流量面临中间人攻击风险，如 [CVE-2020-8554](https://github.com/kubernetes/kubernetes/issues/970760) 所述。
Kubernetes v1.36 起该字段会触发弃用告警，并计划在 v1.43 移除。

如果你的 Service 仍依赖 `externalIPs`，可考虑使用 LoadBalancer 服务处理云托管入口、使用 NodePort 做简单端口暴露，
或使用 Gateway API 以更灵活且更安全的方式处理外部流量。

关于此增强功能的更多细节，请参阅 [KEP-5707：弃用 service.spec.externalIPs](https://kep.k8s.io/5707)

<!--
### Removal of `gitRepo` volume driver
-->
### `gitRepo` 卷驱动的移除 {#removal-of-gitrepo-volume-driver}

<!--
The gitRepo volume type has been deprecated since v1.11. Starting Kubernetes v1.36, the `gitRepo` volume plugin is permanently disabled and cannot be turned back
on. This change protects clusters from a critical security issue where using `gitRepo` could let an attacker run code as root on the node.

Although `gitRepo` has been deprecated for years and better alternatives have been recommended, it was still technically possible to use it in previous releases.
From v1.36 onward, that path is closed for good, so any existing workloads depending on `gitRepo` will need to migrate to supported approaches such as init
containers or external git-sync style tools.

For more details on this enhancement, refer to [KEP-5040: Remove gitRepo volume driver](https://kep.k8s.io/5040)
-->
`gitRepo` 卷类型自 v1.11 起已被弃用。
从 Kubernetes v1.36 开始，`gitRepo` 卷插件将被永久禁用，且无法重新启用。
此变更可保护集群免受关键安全问题影响，因为使用 `gitRepo` 可能让攻击者以 root 身份在节点上运行代码。

尽管 `gitRepo` 多年来一直处于弃用状态，且已有更好的替代方案被推荐，但在此前版本中它在技术上仍可使用。
从 v1.36 开始，这条路径将被永久关闭，因此任何依赖 `gitRepo` 的现有工作负载都需要迁移到受支持方案，例如 init 容器或外部 git-sync 风格工具。

关于此增强功能的更多细节，请参阅 [KEP-5040：移除 gitRepo 卷驱动](https://kep.k8s.io/5040)

<!--
## Featured enhancements of Kubernetes v1.36

The following list of enhancements is likely to be included in the upcoming v1.36 release. This is not a commitment and the release content is subject to change.
-->
## Kubernetes v1.36 的重点增强功能 {#featured-enhancements-of-kubernetes-v136}

以下增强功能很可能包含在即将发布的 v1.36 中。
这不是承诺，发布内容仍可能发生变化。

<!--
### Faster SELinux labelling for volumes (GA) {#volume-selinux-labelling}

Kubernetes v1.36 makes the SELinux volume mounting improvement generally available. This change replaced recursive file relabeling with `mount -o context=XYZ` option, applying the correct SELinux label to the entire volume at mount time. It brings more consistent performance and reduces Pod startup delays on SELinux-enforcing systems.

This feature was introduced as beta in v1.28 for `ReadWriteOncePod` volumes. In v1.32, it gained metrics and an opt-out option
(`securityContext.seLinuxChangePolicy: Recursive`) to help catch conflicts. Now in v1.36, it reaches stable and defaults to all volumes, with Pods or
CSIDrivers opting in via `spec.SELinuxMount`.

However, we expect this feature to create the risk of breaking changes in the future Kubernetes releases, due to the potential for mixing of privileged and unprivileged pods.
Setting the `seLinuxChangePolicy` field and
SELinux volume labels on Pods, correctly, is the responsibility of the Pod author
Developers have that responsibility whether they are writing a Deployment, StatefulSet, DaemonSet or even a custom resource that includes a Pod template.
Being careless
with these settings can lead to a range of problems when Pods share volumes.

For more details on this enhancement, refer to  [KEP-1710: Speed up recursive SELinux label change](https://kep.k8s.io/1710)
-->
### 卷的 SELinux 标签提速（GA） {#volume-selinux-labelling}

Kubernetes v1.36 将 SELinux 卷挂载改进提升为正式可用。
此变更用 `mount -o context=XYZ` 选项替代了递归文件重标记，在挂载时为整个卷应用正确的 SELinux 标签。
它带来更一致的性能，并减少启用 SELinux 强制模式系统上的 Pod 启动延迟。

该功能在 v1.28 作为 beta 引入，适用于 `ReadWriteOncePod` 卷。
在 v1.32，它新增了指标和退出选项
（`securityContext.seLinuxChangePolicy: Recursive`）以帮助发现冲突。
现在在 v1.36 进入稳定阶段，并将该机制扩展为默认面向所有卷；
Pod 或 CSIDriver 可通过 `spec.SELinuxMount` 显式启用。

不过，我们预计该功能在未来 Kubernetes 版本中可能带来破坏性变更风险，原因是可能混用特权和非特权 Pod。
正确设置 Pod 上的 `seLinuxChangePolicy` 字段和 SELinux 卷标签，是 Pod 作者的责任。
无论开发者是在编写 Deployment、StatefulSet、DaemonSet，还是包含 Pod 模板的自定义资源，都需要承担这一责任。
对这些设置不够谨慎会在 Pod 共享卷时导致一系列问题。

关于此增强功能的更多细节，请参阅 [KEP-1710：加快递归 SELinux 标签变更](https://kep.k8s.io/1710)

<!--
### External signing of ServiceAccount tokens

As a beta feature, Kubernetes already supports external signing of ServiceAccount tokens. This allows clusters to integrate with external key management systems
or signing services instead of relying only on internally managed keys.

With this enhancement, the `kube-apiserver` can delegate token signing to external systems such as cloud key management services or hardware security modules. This
improves security and simplifies key management services for clusters that rely on centralized signing infrastructure.
We expect that this will graduate to stable (GA) in Kubernetes v1.36.

For more details on this enhancement, refer to [KEP-740: Support external signing of service account tokens](https://kep.k8s.io/740)
-->
### ServiceAccount Token 的外部签名 {#external-signing-of-serviceaccount-tokens}

作为 beta 功能，Kubernetes 已支持 ServiceAccount Token 的外部签名。
这使集群可以集成外部密钥管理系统或签名服务，而不只依赖内部管理密钥。

通过这一增强，`kube-apiserver` 可以将令牌签名委托给外部系统，例如云密钥管理服务或硬件安全模块。
这提升了安全性，并简化了依赖集中式签名基础设施的集群的密钥管理。
我们预计它将在 Kubernetes v1.36 升级为稳定（GA）。

关于此增强功能的更多细节，请参阅 [KEP-740：支持服务账户令牌的外部签名](https://kep.k8s.io/740)

<!--
### DRA Driver support for Device taints and tolerations

Kubernetes v1.33 introduced support for taints and tolerations for physical devices managed through [Dynamic Resource Allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/). Normally, any device can be
used for scheduling. However, this enhancement allows DRA drivers to mark devices as tainted, which ensures that they will not be used for scheduling purposes.
Alternatively, cluster administrators can create a `DeviceTaintRule` to mark devices that match a certain selection criteria(such as all devices of a certain
driver) as tainted. This improves scheduling control and helps ensure that specialized hardware resources are only used by workloads that explicitly request them.

In Kubernetes v1.36, this feature graduates to beta with more comprehensive testing complete, making it accessible by default without the need for a feature
flag and open to user feedback.

To learn about taints and tolerations, see [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
For more details on this enhancement, refer to [KEP-5055: DRA: device taints and tolerations](https://kep.k8s.io/5055).
-->
### DRA 驱动对设备污点和容忍的支持 {#dra-driver-support-for-device-taints-and-tolerations}

Kubernetes v1.33 引入了对通过[动态资源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)管理的物理设备的污点和容忍支持。
通常，任何设备都可用于调度。
但这一增强允许 DRA 驱动将设备标记为污点，从而确保这些设备不会用于调度。
或者，集群管理员可创建 `DeviceTaintRule`，将符合特定选择条件（例如某个驱动的所有设备）的设备标记为污点。
这改进了调度控制，并有助于确保专用硬件资源仅被显式请求它们的工作负载使用。

在 Kubernetes v1.36 中，该功能在完成更全面测试后升级为 beta，默认可用，无需功能开关，并向用户反馈开放。

要了解污点和容忍，请参阅[污点和容忍](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
关于此增强功能的更多细节，请参阅 [KEP-5055：DRA：设备污点和容忍](https://kep.k8s.io/5055)。

<!--
### DRA support for partitionable devices

Kubernetes v1.36 expands Dynamic Resource Allocation (DRA) by introducing support for partitionable devices, allowing a single hardware accelerator to be split
into multiple logical units that can be shared across workloads.  This is especially useful for high-cost resources like GPUs, where dedicating an entire device
to a single workload can lead to underutilization.

With this enhancement, platform teams can improve overall cluster efficiency by allocating only the required portion of a device to each workload, rather than
reserving it entirely. This makes it easier to run multiple workloads on the same hardware while maintaining isolation and control, helping organizations get more
value out of their infrastructure.

To learn more about this enhancement, refer to [KEP-4815: DRA Partitionable Devices](https://kep.k8s.io/4815)
-->
### DRA 对可分区设备的支持 {#dra-support-for-partitionable-devices}

Kubernetes v1.36 通过引入对可分区设备的支持扩展了动态资源分配（DRA），
允许将单个硬件加速器拆分为多个可在工作负载之间共享的逻辑单元。
这对 GPU 等高成本资源尤其有用，因为将整个设备独占给单个工作负载可能导致利用不足。

通过这一增强，平台团队可以通过仅为每个工作负载分配所需设备份额来提升整体集群效率，而不是完整预留设备。
这使得在保持隔离和控制的同时，更容易在同一硬件上运行多个工作负载，
帮助组织从其基础设施中获得更多价值。

要了解更多信息，请参阅 [KEP-4815：DRA 可分区设备](https://kep.k8s.io/4815)

<!--
## Want to know more?

New features and deprecations are also announced in the Kubernetes release notes. We will formally announce what's new in [Kubernetes v1.36](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md) as part of the CHANGELOG for that release.

Kubernetes v1.36 release is planned for Wednesday, April 22, 2026. Stay tuned for updates!

You can also see the announcements of changes in the release notes for:
-->
## 想了解更多？ {#want-to-know-more}

Kubernetes 发布说明也会发布新功能和弃用信息。
我们将在该版本的 CHANGELOG 中正式公布 [Kubernetes v1.36](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md) 的更新内容。

Kubernetes v1.36 计划于 2026 年 4 月 22 日（周三）发布。请持续关注后续更新。

你也可以在以下版本的发布说明中查看变更公告：

<!--
- [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md)
- [Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md)
- [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md)
- [Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)
- [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)
- [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md)
-->
- [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md)
- [Kubernetes v1.34](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md)
- [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md)
- [Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)
- [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)
- [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md)

<!--
## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/siglist.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly
[community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

- Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes) or [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
## 参与其中 {#get-involved}

参与 Kubernetes 最简单的方式是加入与你兴趣匹配的众多[特别兴趣小组](https://github.com/kubernetes/community/blob/master/siglist.md)（SIG）之一。
如果你有想向 Kubernetes 社区分享的内容，欢迎在我们的每周[社区会议](https://github.com/kubernetes/community/tree/master/communication)
以及下列渠道中发声。感谢你持续的反馈与支持。

- 在 Bluesky 关注我们 [@kubernetes.io](https://bsky.app/profile/kubernetes.io) 获取最新动态
- 在 [Discuss](https://discuss.kubernetes.io/) 加入社区讨论
- 在 [Slack](http://slack.k8s.io/) 加入社区
- 在 [Server Fault](https://serverfault.com/questions/tagged/kubernetes) 或 [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes) 提问（或回答问题）
- 分享你的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- 在[博客](https://kubernetes.io/blog/)阅读更多 Kubernetes 最新动态
- 进一步了解 [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
