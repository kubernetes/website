---
layout: blog
title: 'Kubernetes v1.33 预览'
date: 2025-03-26T10:30:00-08:00
slug: kubernetes-v1-33-upcoming-changes
author: >
  Agustina Barbetta,
  Aakanksha Bhende,
  Udi Hofesh,
  Ryota Sawada,
  Sneha Yadav
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.33 sneak peek'
date: 2025-03-26T10:30:00-08:00
slug: kubernetes-v1-33-upcoming-changes
author: >
  Agustina Barbetta,
  Aakanksha Bhende,
  Udi Hofesh,
  Ryota Sawada,
  Sneha Yadav
-->

<!--
As the release of Kubernetes v1.33 approaches, the Kubernetes project continues to evolve. Features may be deprecated, removed, or replaced to improve the overall health of the project. This blog post outlines some planned changes for the v1.33 release, which the release team believes you should be aware of to ensure the continued smooth operation of your Kubernetes environment and to keep you up-to-date with the latest developments.  The information below is based on the current status of the v1.33 release and is subject to change before the final release date.
-->
随着 Kubernetes v1.33 版本的发布临近，Kubernetes 项目仍在不断发展。
为了提升项目的整体健康状况，某些特性可能会被弃用、移除或替换。
这篇博客文章概述了 v1.33 版本的一些计划变更，发布团队认为你有必要了解这些内容，
以确保 Kubernetes 环境的持续平稳运行，并让你掌握最新的发展动态。
以下信息基于 v1.33 版本的当前状态，在最终发布日期之前可能会有所变化。

<!--
## The Kubernetes API removal and deprecation process

The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API has been marked for removal in a future Kubernetes release. It will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.
-->
## Kubernetes API 的移除与弃用流程

Kubernetes 项目针对特性的弃用有一套完善的[弃用政策](/zh-cn/docs/reference/using-api/deprecation-policy/)。
该政策规定，只有在有更新的、稳定的同名 API 可用时，才能弃用稳定的 API，
并且每个稳定性级别的 API 都有最低的生命周期要求。被弃用的 API 已被标记为将在未来的
Kubernetes 版本中移除。在移除之前（自弃用起至少一年内），它仍然可以继续使用，
但使用时会显示警告信息。已被移除的 API 在当前版本中不再可用，届时你必须迁移到使用替代方案。

<!--
* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.

* Beta or pre-release API versions must be supported for 3 releases after the deprecation.

* Alpha or experimental API versions may be removed in any release without prior deprecation notice; this process can become a withdrawal in cases where a different implementation for the same feature is already in place.
-->
* 一般可用（GA）或稳定 API 版本可以被标记为已弃用，但在 Kubernetes
  的一个主要版本内不得移除。

* 测试版或预发布 API 版本在弃用后必须支持至少三个发行版本。

* Alpha 或实验性 API 版本可以在任何版本中被移除，且无需事先发出弃用通知；
  如果同一特性已经有了不同的实现，这个过程可能会变为撤回。

<!--
Whether an API is removed as a result of a feature graduating from beta to stable, or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the [deprecation guide](/docs/reference/using-api/deprecation-guide/).
-->
无论是由于某个特性从测试阶段升级为稳定阶段而导致 API 被移除，还是因为该
API 未能成功，所有的移除操作都遵循此弃用政策。每当一个 API 被移除时，
迁移选项都会在[弃用指南](/zh-cn/docs/reference/using-api/deprecation-guide/)中进行说明。

<!--
## Deprecations and removals for Kubernetes v1.33

### Deprecation of the stable Endpoints API

The [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) API has been stable since v1.21, which effectively replaced the original Endpoints API. While the original Endpoints API was simple and straightforward, it also posed some challenges when scaling to large numbers of network endpoints. The EndpointSlices API has introduced new features such as dual-stack networking, making the original Endpoints API ready for deprecation.
-->
## Kubernetes v1.33 的弃用与移除

### 稳定版 Endpoints API 的弃用

[EndpointSlices](/zh-cn/docs/concepts/services-networking/endpoint-slices/) API
自 v1.21 起已稳定，实际上取代了原有的 Endpoints API。虽然原有的 Endpoints API 简单直接，
但在扩展到大量网络端点时也带来了一些挑战。EndpointSlices API 引入了诸如双栈网络等新特性，
使得原有的 Endpoints API 已准备好被弃用。

<!--
This deprecation only impacts those who use the Endpoints API directly from workloads or scripts; these users should migrate to use EndpointSlices instead. There will be a dedicated blog post with more details on the deprecation implications and migration plans in the coming weeks.

You can find more in [KEP-4974: Deprecate v1.Endpoints](https://kep.k8s.io/4974).
-->
此弃用仅影响那些直接在工作负载或脚本中使用 Endpoints API 的用户；
这些用户应迁移到使用 EndpointSlices。未来几周内将发布一篇专门的博客文章，
详细介绍弃用的影响和迁移计划。

你可以在 [KEP-4974: Deprecate v1.Endpoints](https://kep.k8s.io/4974)
中找到更多信息。

<!--
### Removal of kube-proxy version information in node status

Following its deprecation in v1.31, as highlighted in the [release announcement](/blog/2024/07/19/kubernetes-1-31-upcoming-changes/#deprecation-of-status-nodeinfo-kubeproxyversion-field-for-nodes-kep-4004-https-github-com-kubernetes-enhancements-issues-4004), the `status.nodeInfo.kubeProxyVersion` field will be removed in v1.33. This field was set by kubelet, but its value was not consistently accurate. As it has been disabled by default since v1.31, the v1.33 release will remove this field entirely.
-->
### 节点状态中 kube-proxy 版本信息的移除

继在 v1.31 中被弃用，并在[发布说明](/blog/2024/07/19/kubernetes-1-31-upcoming-changes/#deprecation-of-status-nodeinfo-kubeproxyversion-field-for-nodes-kep-4004-https-github-com-kubernetes-enhancements-issues-4004)中强调后，
`status.nodeInfo.kubeProxyVersion` 字段将在 v1.33 中被移除。
此字段由 kubelet 设置，但其值并不总是准确的。由于自 v1.31
起该字段默认已被禁用，v1.33 发行版将完全移除此字段。

<!--
You can find more in [KEP-4004: Deprecate status.nodeInfo.kubeProxyVersion field](https://kep.k8s.io/4004).

### Removal of host network support for Windows pods
-->
你可以在 [KEP-4004: Deprecate status.nodeInfo.kubeProxyVersion field](https://kep.k8s.io/4004)
中找到更多信息。

### 移除对 Windows Pod 的主机网络支持

<!--
Windows Pod networking aimed to achieve feature parity with Linux and provide better cluster density by allowing containers to use the Node’s networking namespace.
The original implementation landed as alpha with v1.26, but as it faced unexpected containerd behaviours,
and alternative solutions were available, the Kubernetes project has decided to withdraw the associated
KEP. We're expecting to see support fully removed in v1.33.
-->
Windows Pod 网络旨在通过允许容器使用节点的网络命名空间来实现与 Linux 的特性对等，
并提供更高的集群密度。最初的实现作为 Alpha 版本在 v1.26 中引入，但由于遇到了未预期的
containerd 行为，且存在替代方案，Kubernetes 项目决定撤回相关的 KEP。
我们预计在 v1.33 中完全移除对该特性的支持。

<!--
You can find more in [KEP-3503: Host network support for Windows pods](https://kep.k8s.io/3503).

## Featured improvement of Kubernetes v1.33

As authors of this article, we picked one improvement as the most significant change to call out!
-->
你可以在 [KEP-3503: Host network support for Windows pods](https://kep.k8s.io/3503)
中找到更多信息。

## Kubernetes v1.33 的特色改进

作为本文的作者，我们挑选了一项改进作为最重要的变更来特别提及！

<!--
### Support for user namespaces within Linux Pods

One of the oldest open KEPs today is [KEP-127](https://kep.k8s.io/127), Pod security improvement by using Linux [User namespaces](/docs/concepts/workloads/pods/user-namespaces/) for Pods. This KEP was first opened in late 2016, and after multiple iterations, had its alpha release in v1.25, initial beta in v1.30 (where it was disabled by default), and now is set to be a part of v1.33, where the feature is available by default.
-->
### Linux Pods 中用户命名空间的支持

当前最古老的开放 KEP 之一是 [KEP-127](https://kep.k8s.io/127)，
通过使用 Linux [用户命名空间](/zh-cn/docs/concepts/workloads/pods/user-namespaces/)为
Pod 提供安全性改进。该 KEP 最初在 2016 年末提出，经过多次迭代，在 v1.25 中发布了 Alpha 版本，
在 v1.30 中首次进入 Beta 阶段（在此版本中默认禁用），现在它将成为 v1.33 的一部分，
默认情况下即可使用该特性。

<!--
This support will not impact existing Pods unless you manually specify `pod.spec.hostUsers` to opt in. As highlighted in the [v1.30 sneak peek blog](/blog/2024/03/12/kubernetes-1-30-upcoming-changes/), this is an important milestone for mitigating vulnerabilities.

You can find more in [KEP-127: Support User Namespaces in pods](https://kep.k8s.io/127).
-->
除非你手动指定 `pod.spec.hostUsers` 以选择使用此特性，否则此支持不会影响现有的 Pod。
正如在 [v1.30 预览博客](/blog/2024/03/12/kubernetes-1-30-upcoming-changes/)中强调的那样，
就缓解漏洞的影响而言，这是一个重要里程碑。

你可以在 [KEP-127: Support User Namespaces in pods](https://kep.k8s.io/127)
中找到更多信息。

<!--
## Selected other Kubernetes v1.33 improvements

The following list of enhancements is likely to be included in the upcoming v1.33 release. This is not a commitment and the release content is subject to change.
-->
## 精选的其他 Kubernetes v1.33 改进

以下列出的改进很可能会包含在即将到来的 v1.33 发行版中。
这些改进尚无法承诺，发行内容仍有可能发生变化。

<!--
### In-place resource resize for vertical scaling of Pods

When provisioning a Pod, you can use various resources such as Deployment, StatefulSet, etc. Scalability requirements may need horizontal scaling by updating the Pod replica count, or vertical scaling by updating resources allocated to Pod’s container(s). Before this enhancement, container resources defined in a Pod's `spec` were immutable, and updating any of these details within a Pod template would trigger Pod replacement.
-->
### Pod 垂直扩展的就地资源调整

在制备某个 Pod 时，你可以使用诸如 Deployment、StatefulSet 等多种资源。
为了满足可扩缩性需求，可能需要通过更新 Pod 副本数量进行水平扩缩，或通过更新分配给
Pod 容器的资源进行垂直扩缩。在此增强特性之前，Pod 的 `spec`
中定义的容器资源是不可变的，更新 Pod 模板中的这类细节会触发 Pod 的替换。

<!--
But what if you could dynamically update the resource configuration for your existing Pods without restarting them?

The [KEP-1287](https://kep.k8s.io/1287) is precisely to allow such in-place Pod updates. It opens up various possibilities of vertical scale-up for stateful processes without any downtime, seamless scale-down when the traffic is low, and even allocating larger resources during startup that is eventually reduced once the initial setup is complete. This was released as alpha in v1.27, and is expected to land as beta in v1.33.
-->
但是如果可以在不重启的情况下动态更新现有 Pod 的资源配置，那会怎样呢？

[KEP-1287](https://kep.k8s.io/1287) 正是为了实现这种就地 Pod 更新而设计的。
它为无状态进程的垂直扩缩开辟了多种可能性，例如在不停机的情况下进行扩容、
在流量较低时无缝缩容，甚至在启动时分配更多资源，待初始设置完成后减少资源分配。
该特性在 v1.27 中以 Alpha 版本发布，并预计在 v1.33 中进入 beta 阶段。

<!--
You can find more in [KEP-1287: In-Place Update of Pod Resources](https://kep.k8s.io/1287).

### DRA’s ResourceClaim Device Status graduates to beta
-->
你可以在 [KEP-1287：Pod 资源的就地更新](https://kep.k8s.io/1287)中找到更多信息。

### DRA 的 ResourceClaim 设备状态升级为 Beta

<!--
The `devices` field in ResourceClaim `status`, originally introduced in the v1.32 release, is likely to graduate to beta in v1.33. This field allows drivers to report device status data, improving both observability and troubleshooting capabilities.
-->
在 v1.32 版本中首次引入的 ResourceClaim `status` 中的 `devices` 字段，
预计将在 v1.33 中升级为 beta 阶段。此字段允许驱动程序报告设备状态数据，
从而提升可观测性和故障排查能力。

<!--
For example, reporting the interface name, MAC address, and IP addresses of network interfaces in the status of a ResourceClaim can significantly help in configuring and managing network services, as well as in debugging network related issues. You can read more about ResourceClaim Device Status in [Dynamic Resource Allocation: ResourceClaim Device Status](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status) document.
-->
例如，在 ResourceClaim 的状态中报告网络接口的接口名称、MAC 地址和 IP 地址，
可以显著帮助配置和管理网络服务，并且在调试网络相关问题时也非常有用。
你可以在[动态资源分配：ResourceClaim 设备状态](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status)
文档中阅读关于 ResourceClaim 设备状态的更多信息。

<!--
Also, you can find more about the planned enhancement in [KEP-4817: DRA: Resource Claim Status with possible standardized network interface data](https://kep.k8s.io/4817).
-->
此外，你可以在
[KEP-4817: DRA: Resource Claim Status with possible standardized network interface data](https://kep.k8s.io/4817)
中找到更多关于此计划增强特性的信息。

<!--
### Ordered namespace deletion

This KEP introduces a more structured deletion process for Kubernetes namespaces to ensure secure and deterministic resource removal. The current semi-random deletion order can create security gaps or unintended behaviour, such as Pods persisting after their associated NetworkPolicies are deleted. By enforcing a structured deletion sequence that respects logical and security dependencies, this approach ensures Pods are removed before other resources. The design improves Kubernetes’s security and reliability by mitigating risks associated with non-deterministic deletions.
-->
### 有序的命名空间删除

此 KEP 为 Kubernetes 命名空间引入了一种更为结构化的删除流程，
以确保更为安全且更为确定的资源移除。当前半随机的删除顺序可能会导致安全漏洞或意外行为，
例如在相关的 NetworkPolicy 被删除后，Pod 仍然存在。
通过强制执行尊重逻辑和安全依赖关系的结构化删除顺序，此方法确保在删除其他资源之前先删除 Pod。
这种设计通过减少与非确定性删除相关的风险，提升了 Kubernetes 的安全性和可靠性。

<!--
You can find more in [KEP-5080: Ordered namespace deletion](https://kep.k8s.io/5080).
-->
你可以在 [KEP-5080: Ordered namespace deletion](https://kep.k8s.io/5080)
中找到更多信息。

<!--
### Enhancements for indexed job management

These two KEPs are both set to graduate to GA to provide better reliability for job handling, specifically for indexed jobs. [KEP-3850](https://kep.k8s.io/3850) provides per-index backoff limits for indexed jobs, which allows each index to be fully independent of other indexes. Also, [KEP-3998](https://kep.k8s.io/3998) extends Job API to define conditions for making an indexed job as successfully completed when not all indexes are succeeded.
-->
### 针对带索引作业（Indexed Job）管理的增强

这两个 KEP 都计划升级为 GA，以提供更好的作业处理可靠性，特别是针对索引作业。
[KEP-3850](https://kep.k8s.io/3850) 为索引作业中的不同索引分别支持独立的回退限制，
这使得每个索引可以完全独立于其他索引。此外，[KEP-3998](https://kep.k8s.io/3998)
扩展了 Job API，定义了在并非所有索引都成功的情况下将索引作业标记为成功完成的条件。

<!--
You can find more in [KEP-3850: Backoff Limit Per Index For Indexed Jobs](https://kep.k8s.io/3850) and [KEP-3998: Job success/completion policy](https://kep.k8s.io/3998).
-->
你可以在 [KEP-3850: Backoff Limit Per Index For Indexed Jobs](https://kep.k8s.io/3850) 和
[KEP-3998: Job success/completion policy](https://kep.k8s.io/3998) 中找到更多信息。

<!--
## Want to know more?

New features and deprecations are also announced in the Kubernetes release notes. We will formally announce what's new in [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md) as part of the CHANGELOG for that release.
-->
## 想了解更多？

新特性和弃用也会在 Kubernetes 发行说明中宣布。我们将在该版本的
CHANGELOG 中正式宣布 [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md)
的新内容。

<!--
Kubernetes v1.33 release is planned for **Wednesday, 23rd April, 2025**. Stay tuned for updates!

You can also see the announcements of changes in the release notes for:
-->
Kubernetes v1.33 版本计划于 **2025年4月23日星期三**发布。请持续关注以获取更新！

你也可以在以下版本的发行说明中查看变更公告：

* [Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)

* [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)

* [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md)


<!--
## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.
-->
## 参与进来

参与 Kubernetes 最简单的方式是加入与你兴趣相符的众多[特别兴趣小组](https://github.com/kubernetes/community/blob/master/sig-list.md)（SIG）
之一。你有什么想向 Kubernetes 社区广播的内容吗？
通过我们每周的[社区会议](https://github.com/kubernetes/community/tree/master/communication)和以下渠道分享你的声音。
感谢你持续的反馈和支持。

<!--
- Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes) or [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
- 在 Bluesky 上关注我们 [@kubernetes.io](https://bsky.app/profile/kubernetes.io) 以获取最新更新
- 在 [Discuss](https://discuss.kubernetes.io/) 上参与社区讨论
- 在 [Slack](http://slack.k8s.io/) 上加入社区
- 在 [Server Fault](https://serverfault.com/questions/tagged/kubernetes) 或
  [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes) 上提问（或回答问题）
- 分享你的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- 在[博客](https://kubernetes.io/zh-cn/blog/)上阅读更多关于 Kubernetes 最新动态的内容
- 了解更多关于 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team)的信息
