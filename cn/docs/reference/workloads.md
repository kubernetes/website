---
title: 在版本 1.8 和 1.9 中工作负载（Workloads） API 的变化
cn-approvers:
- tianshapjq
approvers:
- steveperry-53
- kow3ns
---
<!--
---
title: Workloads API changes in versions 1.8 and 1.9
approvers:
- steveperry-53
- kow3ns
---
-->

<!--
## Overview
-->
## 概述

<!--
The Kubernetes core Workloads API includes the Deployment, DaemonSet, ReplicaSet, and StatefulSet kinds. To provide a stable API for users to orchestrate their workloads, we are prioritizing promoting these kinds to GA. The batch Workloads API (Job and CronJob), while also important, is not part of this effort, and it will have a separate path to GA stability.
-->
Kubernetes 核心工作负载（Workloads） API 类型包括 Deployment、DaemonSet、ReplicaSet 和 StatefulSet。为了给用户提供一个稳定的 API 来编排他们的工作负载，我们优先把这些类型升级到 GA 版本。而对于批处理工作负载 API （Job 和 CronJob），虽然它们也很重要，却并不在此次的计划中，它们将有其它独立的路径升级到 GA 稳定版。

<!--
- In the 1.8 release, we introduce the apps/v1beta2 API group and version. This beta version of the core Workloads API contains the Deployment, DaemonSet,  ReplicaSet, and  StatefulSet kinds, and it is the version we plan to promote to GA in the 1.9 release provided the feedback is positive.
-->
- 在 1.8 版本中，我们引入了 apps/v1beta2 API 组和版本。 核心工作负载 API 的测试版本包含 Deployment、DaemonSet、ReplicaSet 和 StatefulSet 类型，如果各项反馈都不错的话，那么我们计划在 1.9 版本中升级到 GA 版本。

<!--
- In the 1.9 release, we plan to introduce the apps/v1 group version. We intend to promote the apps/v1beta2 group version in its entirety to apps/v1 and to deprecate apps/v1beta2 at that time.
-->
- 在 1.9 版本中，我们计划引入 apps/v1 组版本。我们打算将 apps/v1beta2 组版本完全升级到 apps/v1，同时弃用 apps/v1beta2。

<!--
- We realize that even after the release of apps/v1, users will need time to migrate their code from extensions/v1beta1, apps/v1beta1, and apps/v1beta2. It is important to remember that the minimum support durations listed in the deprecations guidelines are minimums. We will continue to support conversion between groups and versions until users have had sufficient time to migrate.
-->
- 我们意识到，即使在 apps/v1 发布后，用户也需要时间从 extensions/v1beta1、apps/v1beta1 和 apps/v1beta2 迁移代码。 请务必记住，弃用指南中列出的最低支持期限是最低限度。我们将继续支持组和版本之间的转换，直到用户有足够的时间进行迁移。

<!--
## Migration
-->
## 迁移

<!--
This section contains information to assist users in migrating core Workloads API kinds between group versions.
-->
本节内容帮助用户在不同的工作负载 API 组版本间进行迁移。

<!--
### General
-->
### 概述

<!--
- If you are using kinds from the extensions/v1beta1 or apps/v1beta1 group versions, you can wait to migrate existing code until after the release of the apps/v1 group version.
-->
- 如果您正在使用 extensions/v1beta1 或 apps/v1beta1 组版本中的类型，则可以等到 apps/v1 组版本发布后再进行代码迁移。

<!--
- If your deployment requires features that are available in the apps/v1beta2 group version, you can migrate to this group version before the apps/v1 release.
-->
- 如果您的 Deployment 需要 apps/v1beta2 组版本中提供的功能，那么可以在 apps/v1 版本发布前迁移到 apps/v1beta2 组版本。

<!--
- You should develop all new code against the latest stable release.
-->
- 您需要针对最新的稳定版本编写新的代码。

<!--
- You can run `kubectl convert` to convert manifests between group versions.
-->
- 您可以通过运行 `kubectl convert` 命令来转换版本间的 manifest 文件。

<!--
### Migrating to apps/v1beta2
-->
### 迁移到 apps/v1beta2

<!--
This section provides information on migrating to the apps/v1beta2 group version. It covers general changes to the core Workloads API kinds. For changes that affect a specific kind (for example, default values), consult the reference documentation for the kind.
-->
本节提供有关迁移到 apps/v1beta2 组版本的信息。它涵盖了对核心工作负载 API 类型的通用修改。对于影响特定类型的更改（例如，默认值），请参考该类型的参考文档。

<!--
#### Default selectors are deprecated
-->
#### 默认 selector 被弃用

<!--
In earlier versions of the apps and extensions groups, the spec.selectors of the core Workloads API kinds were, when left unspecified, defaulted to a LabelSelector generated from the spec.template.metadata.labels.
-->
在较早的 apps 和 extensions 组中，当核心工作负载 API 类型中的 spec.selectors 没有指定值时，将默认使用从 spec.template.metadata.labels 生成的 LabelSelector。

<!--
User feedback led us to determine that, as it is incompatible with strategic merge patch and kubectl apply, defaulting the value of a field from the value of another field of the same object is an anti-pattern.
-->
用户的反馈使我们确定，由于它与 strategic merge patch 和 kubectl apply 不兼容，并且一个字段的默认值从同一对象的其它字段获取，这是不符合模式的。

<!--
#### Immutable selectors
-->
#### 不可变的选择器（Immutable selectors）

<!--
We have always cautioned users against selector mutation. The core Workloads API controller does not, in the general case, handle selector mutation gracefully.
-->
我们一直提醒用户注意选择器（selector）的突变。在一般情况下，核心工作负载 API 控制器并没有很好的处理选择器突变的情况。

<!--
To provide a consistent, usable, and stable API, selectors are immutable for all kinds in the apps/v1beta2 group and version.
-->
为了提供一个一致、可用并且稳定的 API，选择器对于 apps/v1beta2 组和版本中的所有类型是不可变的。

<!--
We believe that there are better ways to support features like promotable canaries and orchestrated Pod relabeling, but if restricted selector mutation is a necessary feature for our users, we can relax immutability before GA without breaking backward compatibility.
-->
我们相信有更好的方法来支持类似可升级的 canaries（promotable canaries） 和 精心设计的 Pod 重新标签（orchestrated Pod relabeling）等功能，但是如果受限制的选择器突变是用户必须的一个功能，那么在 GA 版本之前，我们可以在不破坏向后兼容的情况下放宽对不可变的限制。

<!--
The development of features like promotable canaries, orchestrated Pod relabeling, and restricted selector mutability is driven by demand signals from our users. If you are currently modifying the selectors of your core Workloads API objects, please tell us about your use case in a GitHub issue or by participating in SIG-apps.
-->
可升级的 canaries（promotable canaries）、精心设计的 Pod 重新标签（orchestrated Pod relabeling）和受限制的选择器突变（restricted selector mutability）等功能的开发都是由用户需求驱动的。如果您需要修改核心工作负载 API 对象的选择器，请在 GitHub 的 issue 中告诉我们或者参与 SIG-apps 的讨论。

<!--
#### Default rolling updates
-->
#### 默认滚动升级

<!--
Before apps/v1beta2, some kinds defaulted the spec.updateStrategy to a strategy other than RollingUpdate. For example, apps/v1beta1 StatefulSet specifies OnDelete by default. In apps/v1beta2 the spec.updateStrategy for all kinds defaults to RollingUpdate.
-->
在 apps/v1beta2 版本之前，有些类型将 spec.updateStrategy 默认为 RollingUpdate 以外的策略。例如，apps/v1beta1 的 StatefulSet 默认指定 OnDelete。在 apps/v1beta2 中，所有类型的 spec.updateStrategy 默认为 RollingUpdate。

<!--
#### Created-by annotation is deprecated
-->
#### 弃用 Created-by 注解

<!--
"kubernetes.io/created-by" is deprecated in version 1.8. Instead, you should specify an object’s ControllerRef from its ownerReferences to determine object ownership.
-->
在 1.8 版本中弃用了 "kubernetes.io/created-by"。相反，您应该从一个对象的 ownerReferences 中指定它的 ControllerRef 来确定对象的拥有者。

<!--
## Timeline
-->
## 时间表

<!--
This section details the timeline for promotion and deprecation of kinds in the core Workloads API.
-->
本节详细描述核心工作负载 API 中升级和弃用类型的时间表。

<!--
### Release 1.8
-->
### 1.8 发布版本

<!--
In Kubernetes 1.8, we unify the core Workloads API kinds in a single group and version. We address consistency, usability, and stability issues across the API surface. We have deprecated portions of the apps/v1beta1 group version and the extension/v1beta1 group version and replaced them with the apps/v1beta2 group version. The table below shows the kinds that are deprecated and the kinds that replace them.
-->
在 Kubernetes 1.8 版本中，我们将核心工作负载 API 类型统一在一个组和版本中。我们解决了整个 API 层面的一致性、可用性和稳定性问题。我们已经弃用了部分 apps/v1beta1 组版本和部分 extension/v1beta1 组版本，并将其替换为 apps/v1beta2 组版本。下表显示了弃用并用以替换的类型。

<table style="width:100%">
  <tr>
<!--
    <th colspan="3">Deprecated</th>
    <th colspan="3">Replaced By</th>
-->
    <th colspan="3">已弃用</th>
    <th colspan="3">替换</th>
  </tr>
  <tr>
<!--
    <td>Group</td>
    <td>Version</td>
    <td>Kind</td>
    <td>Group</td>
    <td>Version</td>
    <td>Kind</td>
-->
	<td>组（Group）</td>
    <td>版本（Version）</td>
    <td>类型（Kind）</td>
    <td>组（Group）</td>
    <td>版本（Version）</td>
    <td>类型（Kind）</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta1</td>
    <td>Deployment</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>Deployment</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta1</td>
    <td>ReplicaSet</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>ReplicaSet</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta1</td>
    <td>StatefulSet</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>StatefulSet</td>
  </tr>
  <tr>
    <td>extensions</td>
    <td>v1beta1</td>
    <td>Deployment</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>Deployment</td>
  </tr>
  <tr>
    <td>extensions</td>
    <td>v1beta1</td>
    <td>DaemonSet</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>DaemonSet</td>
  </tr>
  <tr>
    <td>extensions</td>
    <td>v1beta1</td>
    <td>StatefulSet</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>StatefulSet</td>
  </tr>
</table>

<!--
### Release 1.9
-->
### 1.9 发布版本

<!--
In Kubernetes 1.9, our goal is to address any feedback on the apps/v1beta2 group version and to promote the group version to GA. The table below shows the kinds that we plan to deprecate and the kinds that will replace them.
-->
在 Kubernetes 1.9 版本中，我们的目标是解决有关 apps/v1beta2 组版本的任何反馈问题，并将组版本升级到 GA 版本。下表显示了我们计划弃用以及将取代它们的类型。

<table style="width:100%">
  <tr>
<!--
    <th colspan="3">Deprecated</th>
    <th colspan="3">Replaced By</th>
-->
    <th colspan="3">已弃用</th>
    <th colspan="3">替换</th>
  </tr>
  <tr>
<!--
    <td>Group</td>
    <td>Version</td>
    <td>Kind</td>
    <td>Group</td>
    <td>Version</td>
    <td>Kind</td>
-->
	<td>组（Group）</td>
    <td>版本（Version）</td>
    <td>类型（Kind）</td>
    <td>组（Group）</td>
    <td>版本（Version）</td>
    <td>类型（Kind）</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>Deployment</td>
    <td>apps</td>
    <td>v1</td>
    <td>Deployment</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>DaemonSet</td>
    <td>apps</td>
    <td>v1</td>
    <td>DaemonSet</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>ReplicaSet</td>
    <td>apps</td>
    <td>v1</td>
    <td>ReplicaSet</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>StatefulSet</td>
    <td>apps</td>
    <td>v1</td>
    <td>StatefulSet</td>
  </tr>
</table>

<!--
### Post 1.9
-->
### 1.9 版本之后

<!--
Because users will continue to depend on extensions/v1beta1, apps/v1beta1, and apps/v1beta2, we will not completely remove deprecated kinds in these group versions upon GA promotion. Instead, we will provide auto-conversion between the deprecated portions of the API surface and the GA version. The table below shows the bidirectional conversion that we will support.
-->
因为用户将继续依赖 extensions/v1beta1、apps/v1beta1 和 apps/v1beta2 版本，所以在升级到 GA 后，我们也不会完全删除这些组版本中已弃用的类型。相反，我们将提供部分已弃用 API 层面和 GA 版本之间的自动转换功能。下表显示了我们将支持的双向转换。

<table style="width:100%">
 <tr>
    <th colspan="3">GA</th>
    <th colspan="3">Previous</th>
  </tr>
  <tr>
    <td>Group</td>
    <td>Version</td>
    <td>Kind</td>
    <td>Group</td>
    <td>Version</td>
    <td>Kind</td>
  </tr>
  <tr>
    <td rowspan="3">apps</td>
    <td rowspan="3">v1</td>
    <td rowspan="3">Deployment</td>
    <td>apps</td>
    <td>v1beta1</td>
    <td>Deployment</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>Deployment</td>
  </tr>
  <tr>
    <td>extensions</td>
    <td>v1beta1</td>
    <td>Deployment</td>
  </tr>
   <tr>
    <td rowspan="2">apps</td>
    <td rowspan="2">v1</td>
    <td rowspan="2">Daemonset</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>DaemonSet</td>
  </tr>
  <tr>
    <td>extensions</td>
    <td>v1beta1</td>
    <td>DaemonSet</td>
  </tr>
   <tr>
    <td rowspan="3">apps</td>
    <td rowspan="3">v1</td>
    <td rowspan="3">ReplicaSet</td>
    <td>apps</td>
    <td>v1beta1</td>
    <td>ReplicaSet</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>ReplicaSet</td>
  </tr>
  <tr>
    <td>extensions</td>
    <td>v1beta1</td>
    <td>ReplicaSet</td>
  </tr>
   <tr>
    <td rowspan="2">apps</td>
    <td rowspan="2">v1</td>
    <td rowspan="2">StatefulSet</td>
    <td>apps</td>
    <td>v1beta1</td>
    <td>StatefulSet</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>StatefulSet</td>
  </tr>
</table>
