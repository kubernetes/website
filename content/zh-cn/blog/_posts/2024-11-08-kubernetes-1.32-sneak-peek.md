---
layout: blog
title: 'Kubernetes v1.32 预览'
date: 2024-11-08
slug: kubernetes-1-32-upcoming-changes
---
<!--
layout: blog
title: 'Kubernetes v1.32 sneak peek'
date: 2024-11-08
slug: kubernetes-1-32-upcoming-changes
author: >
  Matteo Bianchi,
  Edith Puclla,
  William Rizzo,
  Ryota Sawada,
  Rashan Smith
-->

<!--
As we get closer to the release date for Kubernetes v1.32, the project develops and matures.
Features may be deprecated, removed, or replaced with better ones for the project's overall health. 

This blog outlines some of the planned changes for the Kubernetes v1.32 release,
that the release team feels you should be aware of, for the continued maintenance
of your Kubernetes environment and keeping up to date with the latest changes.
Information listed below is based on the current status of the v1.32 release
and may change before the actual release date. 
-->
随着 Kubernetes v1.32 发布日期的临近，Kubernetes 项目继续发展和成熟。
在这个过程中，某些特性可能会被弃用、移除或被更好的特性取代，以确保项目的整体健康与发展。

本文概述了 Kubernetes v1.32 发布的一些计划变更，发布团队认为你应该了解这些变更，
以确保你的 Kubernetes 环境得以持续维护并跟上最新的变化。以下信息基于 v1.32
发布的当前状态，实际发布日期前可能会有所变动。

<!--
### The Kubernetes API removal and deprecation process

The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/)
for features. This policy states that stable APIs may only be deprecated when a newer,
stable version of that API is available and that APIs have a minimum lifetime for each stability level.
A deprecated API has been marked for removal in a future Kubernetes release will continue to function until
removal (at least one year from the deprecation). Its usage will result in a warning being displayed.
Removed APIs are no longer available in the current version, so you must migrate to use the replacement instead.
-->
### Kubernetes API 的移除和弃用流程

Kubernetes 项目对功能特性有一个文档完备的[弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
该策略规定，只有当较新的、稳定的相同 API 可用时，原有的稳定 API 才可能被弃用，每个稳定级别的 API 都有一个最短的生命周期。
弃用的 API 指的是已标记为将在后续发行某个 Kubernetes 版本时移除的 API；
移除之前该 API 将继续发挥作用（从弃用起至少一年时间），但使用时会显示一条警告。
移除的 API 将在当前版本中不再可用，此时你必须迁移以使用替换的 API。

<!--
* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.

* Beta or pre-release API versions must be supported for 3 releases after the deprecation.

* Alpha or experimental API versions may be removed in any release without prior deprecation notice;
  this process can become a withdrawal in cases where a different implementation for the same feature is already in place.
-->
* 正式发布的（GA）或稳定的 API 版本可被标记为已弃用，但不得在 Kubernetes 主要版本未变时删除。

* Beta 或预发布 API 版本，必须保持在被弃用后 3 个发布版本中仍然可用。

* Alpha 或实验性 API 版本可以在任何版本中删除，不必提前通知；
  如果同一特性已有不同实施方案，则此过程可能会成为撤销。

<!--
Whether an API is removed due to a feature graduating from beta to stable or because that API did not succeed,
all removals comply with this deprecation policy. Whenever an API is removed,
migration options are communicated in the [deprecation guide](/docs/reference/using-api/deprecation-guide/).
-->
无论 API 是因为特性从 Beta 升级到稳定状态还是因为未能成功而被移除，
所有移除操作都遵守此弃用策略。每当 API 被移除时，
迁移选项都会在[弃用指南](/zh-cn/docs/reference/using-api/deprecation-guide/)中进行说明。

<!--
## Note on the withdrawal of the old DRA implementation

The enhancement [#3063](https://github.com/kubernetes/enhancements/issues/3063)
introduced Dynamic Resource Allocation (DRA) in Kubernetes 1.26.
-->
## 关于撤回 DRA 的旧的实现的说明

增强特性 [#3063](https://github.com/kubernetes/enhancements/issues/3063) 在 Kubernetes 1.26
中引入了动态资源分配（DRA）。

<!--
However, in Kubernetes v1.32, this approach to DRA will be significantly changed.
Code related to the original implementation will be removed, leaving KEP
[#4381](https://github.com/kubernetes/enhancements/issues/4381) as the "new" base functionality. 
-->
然而，在 Kubernetes v1.32 中，这种 DRA 的实现方法将发生重大变化。与原来实现相关的代码将被删除，
只留下 KEP [#4381](https://github.com/kubernetes/enhancements/issues/4381) 作为"新"的基础特性。

<!--
The decision to change the existing approach originated from its incompatibility with cluster autoscaling
as resource availability was non-transparent, complicating decision-making for both Cluster Autoscaler and controllers. 
The newly added Structured Parameter model substitutes the functionality.
-->
改变现有方法的决定源于其与集群自动伸缩的不兼容性，因为资源可用性是不透明的，
这使得 Cluster Autoscaler 和控制器的决策变得复杂。
新增的结构化参数模型替换了原有特性。

<!--
This removal will allow Kubernetes to handle new hardware requirements and resource claims more predictably,
bypassing the complexities of back and forth API calls to the kube-apiserver.

Please also see the enhancement issue [#3063](https://github.com/kubernetes/enhancements/issues/3063) to find out more.
-->
这次移除将使 Kubernetes 能够更可预测地处理新的硬件需求和资源声明，
避免了与 kube-apiserver 之间复杂的来回 API 调用。

请参阅增强问题 [#3063](https://github.com/kubernetes/enhancements/issues/3063) 以了解更多信息。

<!--
## API removal

There is only a single API removal planned for [Kubernetes v1.32](/docs/reference/using-api/deprecation-guide/#v1-32):
-->
## API 移除

在 [Kubernetes v1.32](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-32) 中，计划仅移除一个 API：

<!--
* The `flowcontrol.apiserver.k8s.io/v1beta3` API version of FlowSchema and PriorityLevelConfiguration has been removed. 
  To prepare for this, you can edit your existing manifests and rewrite client software to use the
  `flowcontrol.apiserver.k8s.io/v1 API` version, available since v1.29. 
  All existing persisted objects are accessible via the new API. Notable changes in `flowcontrol.apiserver.k8s.io/v1beta3`
  include that the PriorityLevelConfiguration `spec.limited.nominalConcurrencyShares` field only defaults to 30 when unspecified,
  and an explicit value of 0 is not changed to 30.

For more information, please refer to the [API deprecation guide](/docs/reference/using-api/deprecation-guide/#v1-32).
-->
* `flowcontrol.apiserver.k8s.io/v1beta3` 版本的 FlowSchema 和 PriorityLevelConfiguration 已被移除。
  为了对此做好准备，你可以编辑现有的清单文件并重写客户端软件，使用自 v1.29 起可用的 `flowcontrol.apiserver.k8s.io/v1` API 版本。
  所有现有的持久化对象都可以通过新 API 访问。`flowcontrol.apiserver.k8s.io/v1beta3` 中的重要变化包括：
  当未指定时，PriorityLevelConfiguration 的 `spec.limited.nominalConcurrencyShares`
  字段仅默认为 30，而显式设置的 0 值不会被更改为此默认值。

  有关更多信息，请参阅 [API 弃用指南](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-32)。

<!--
## Sneak peek of Kubernetes v1.32

The following list of enhancements is likely to be included in the v1.32 release.
This is not a commitment and the release content is subject to change.
-->
## Kubernetes v1.32 的抢先预览

以下增强特性有可能会被包含在 v1.32 发布版本中。请注意，这并不是最终承诺，发布内容可能会发生变化。

<!--
### Even more DRA enhancements!

In this release, like the previous one, the Kubernetes project continues proposing a number
of enhancements to the Dynamic Resource Allocation (DRA), a key component of the Kubernetes resource management system.
These enhancements aim to improve the flexibility and efficiency of resource allocation for workloads that require specialized hardware,
such as GPUs, FPGAs and network adapters. This release introduces improvements,
including the addition of resource health status in the Pod status, as outlined in
KEP [#4680](https://github.com/kubernetes/enhancements/issues/4680).
-->
### 更多 DRA 增强特性！

在此次发布中，就像上一次一样，Kubernetes 项目继续提出多项对动态资源分配（DRA）的增强。
DRA 是 Kubernetes 资源管理系统的关键组件，这些增强旨在提高对需要专用硬件（如 GPU、FPGA 和网络适配器）
的工作负载进行资源分配的灵活性和效率。此次发布引入了多项改进，包括在 Pod 状态中添加资源健康状态，
具体内容详见 KEP [#4680](https://github.com/kubernetes/enhancements/issues/4680)。

<!--
#### Add resource health status to the Pod status

It isn't easy to know when a Pod uses a device that has failed or is temporarily unhealthy.
KEP [#4680](https://github.com/kubernetes/enhancements/issues/4680) proposes exposing device
health via Pod `status`, making troubleshooting of Pod crashes easier.
-->
#### 在 Pod 状态中添加资源健康状态

当 Pod 使用的设备出现故障或暂时不健康时，很难及时发现。
KEP [#4680](https://github.com/kubernetes/enhancements/issues/4680)
提议通过 Pod 的 `status` 暴露设备健康状态，从而使 Pod 崩溃的故障排除更加容易。

<!--
### Windows strikes back!

KEP [#4802](https://github.com/kubernetes/enhancements/issues/4802) adds support
for graceful shutdowns of Windows nodes in Kubernetes clusters.
Before this release, Kubernetes provided graceful node shutdown functionality for
Linux nodes but lacked equivalent support for Windows.
This enhancement enables the kubelet on Windows nodes to handle system shutdown events properly.
Doing so, it ensures that Pods running on Windows nodes are gracefully terminated,
allowing workloads to be rescheduled without disruption.
This improvement enhances the reliability and stability of clusters that include Windows nodes,
especially during a planned maintenance or any system updates.
-->
### Windows 工作继续

KEP [#4802](https://github.com/kubernetes/enhancements/issues/4802) 为
Kubernetes 集群中的 Windows 节点添加了体面关机支持。
在此之前，Kubernetes 为 Linux 节点提供了体面关机特性，但缺乏对 Windows 节点的同等支持。
这一增强特性使 Windows 节点上的 kubelet 能够正确处理系统关机事件，确保在 Windows 节点上运行的 Pod 能够体面终止，
从而允许工作负载在不受干扰的情况下重新调度。这一改进提高了包含 Windows 节点的集群的可靠性和稳定性，
特别是在计划维护或系统更新期间。

<!--
### Allow special characters in environment variables

With the graduation of this [enhancement](https://github.com/kubernetes/enhancements/issues/4369) to beta,
Kubernetes now allows almost all printable ASCII characters (excluding "=") to be used as environment variable names.
This change addresses the limitations previously imposed on variable naming, facilitating a broader adoption of
Kubernetes by accommodating various application needs. The relaxed validation will be enabled by default via the
`RelaxedEnvironmentVariableValidation` feature gate, ensuring that users can easily utilize environment
variables without strict constraints, enhancing flexibility for developers working with applications like
.NET Core that require special characters in their configurations.
-->
### 允许环境变量中使用特殊字符

随着这一[增强特性](https://github.com/kubernetes/enhancements/issues/4369)升级到 Beta 阶段，
Kubernetes 现在允许几乎所有的可打印 ASCII 字符（不包括 `=`）作为环境变量名称。
这一变化解决了此前对变量命名的限制，通过适应各种应用需求，促进了 Kubernetes 的更广泛采用。
放宽的验证将通过 `RelaxedEnvironmentVariableValidation` 特性门控默认启用，
确保用户可以轻松使用环境变量而不受严格限制，增强了开发者在处理需要特殊字符配置的应用（如 .NET Core）时的灵活性。

<!--
### Make Kubernetes aware of the LoadBalancer behavior

KEP [#1860](https://github.com/kubernetes/enhancements/issues/1860) graduates to GA,
introducing the `ipMode` field for a Service of `type: LoadBalancer`, which can be set to either
`"VIP"` or `"Proxy"`. This enhancement is aimed at improving how cloud providers load balancers
interact with kube-proxy and it is a change transparent to the end user.
The existing behavior of kube-proxy is preserved when using `"VIP"`, where kube-proxy handles the load balancing.
Using `"Proxy"` results in traffic sent directly to the load balancer,
providing cloud providers greater control over relying on kube-proxy;
this means that you could see an improvement in the performance of your load balancer for some cloud providers.
-->
### 使 Kubernetes 感知到 LoadBalancer 的行为

KEP [#1860](https://github.com/kubernetes/enhancements/issues/1860) 升级到 GA 阶段，
为 `type: LoadBalancer` 类型的 Service 引入了 `ipMode` 字段，该字段可以设置为 `"VIP"` 或 `"Proxy"`。
这一增强旨在改善云提供商负载均衡器与 kube-proxy 的交互方式，对最终用户来说是透明的。
使用 `"VIP"` 时，kube-proxy 会继续处理负载均衡，保持现有的行为。使用 `"Proxy"` 时，
流量将直接发送到负载均衡器，提供云提供商对依赖 kube-proxy 的更大控制权；
这意味着对于某些云提供商，你可能会看到负载均衡器性能的提升。

<!--
### Retry generate name for resources

This [enhancement](https://github.com/kubernetes/enhancements/issues/4420)
improves how name conflicts are handled for Kubernetes resources created with the `generateName` field.
Previously, if a name conflict occurred, the API server returned a 409 HTTP Conflict error and clients
had to manually retry the request. With this update, the API server automatically retries generating
a new name up to seven times in case of a conflict. This significantly reduces the chances of collision,
ensuring smooth generation of up to 1 million names with less than a 0.1% probability of a conflict,
providing more resilience for large-scale workloads.
-->
### 为资源生成名称时重试

这一[增强特性](https://github.com/kubernetes/enhancements/issues/4420)改进了使用
`generateName` 字段创建 Kubernetes 资源时的名称冲突处理。此前，如果发生名称冲突，
API 服务器会返回 409 HTTP 冲突错误，客户端需要手动重试请求。通过此次更新，
API 服务器在发生冲突时会自动重试生成新名称，最多重试七次。这显著降低了冲突的可能性，
确保生成多达 100 万个名称时冲突的概率低于 0.1%，为大规模工作负载提供了更高的弹性。

<!--
## Want to know more?
New features and deprecations are also announced in the Kubernetes release notes.
We will formally announce what's new in
[Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)
as part of the CHANGELOG for this release.

You can see the announcements of changes in the release notes for:
-->
## 想了解更多？

新特性和弃用特性也会在 Kubernetes 发布说明中宣布。我们将在此次发布的
[Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)
的 CHANGELOG 中正式宣布新内容。

你可以在以下版本的发布说明中查看变更公告：

* [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)

* [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md)

* [Kubernetes v1.29](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md)

* [Kubernetes v1.28](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.28.md)
