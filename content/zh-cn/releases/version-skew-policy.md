---
title: 版本偏差策略
type: docs
description: >
  Kubernetes 各个组件之间所支持的最大版本偏差。
---
<!-- 
reviewers:
- sig-api-machinery
- sig-architecture
- sig-cli
- sig-cluster-lifecycle
- sig-node
- sig-release
title: Version Skew Policy
type: docs
description: >
  The maximum version skew supported between various Kubernetes components.
-->

<!-- overview -->
<!-- 
This document describes the maximum version skew supported between various Kubernetes components.
Specific cluster deployment tools may place additional restrictions on version skew.
-->
本文档描述了 Kubernetes 各个组件之间所支持的最大版本偏差。
特定的集群部署工具可能会对版本偏差添加额外的限制。

<!-- body -->

<!-- 
## Supported versions

Kubernetes versions are expressed as **x.y.z**, where **x** is the major version,
**y** is the minor version, and **z** is the patch version, following
[Semantic Versioning](https://semver.org/) terminology. For more information, see
[Kubernetes Release Versioning](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning).

The Kubernetes project maintains release branches for the most recent three minor releases
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes 1.19 and newer receive [approximately 1 year of patch support](/releases/patch-releases/#support-period).
Kubernetes 1.18 and older received approximately 9 months of patch support.
-->
## 支持的版本  {#supported-versions}

Kubernetes 版本以 **x.y.z** 表示，其中 **x** 是主要版本，
**y** 是次要版本，**z** 是补丁版本，遵循[语义版本控制](https://semver.org/)术语。
更多信息请参见
[Kubernetes 版本发布控制](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning)。

Kubernetes 项目维护最近的三个次要版本（{{< skew latestVersion >}}、{{< skew prevMinorVersion >}}、{{< skew oldestMinorVersion >}}）的发布分支。
Kubernetes 1.19 和更新的版本获得[大约 1 年的补丁支持](/zh-cn/releases/patch-releases/#support-period)。
Kubernetes 1.18 及更早的版本获得了大约 9 个月的补丁支持。

<!-- 
Applicable fixes, including security fixes, may be backported to those three release branches,
depending on severity and feasibility. Patch releases are cut from those branches at a
[regular cadence](/releases/patch-releases/#cadence), plus additional urgent releases, when required.

The [Release Managers](/releases/release-managers/) group owns this decision.

For more information, see the Kubernetes [patch releases](/releases/patch-releases/) page.
-->
适当的修复，包括安全问题修复，可能会被后沿三个发布分支，具体取决于问题的严重性和可行性。
补丁版本按[常规节奏](/zh-cn/releases/patch-releases/#cadence)从这些分支中删除，并在需要时增加额外的紧急版本。

[发布管理员](/zh-cn/releases/release-managers/)小组拥有这件事的决定权。

有关更多信息，请参阅 Kubernetes [补丁发布](/zh-cn/releases/patch-releases/)页面。

<!-- 
## Supported version skew

### kube-apiserver

In [highly-available (HA) clusters](/docs/setup/production-environment/tools/kubeadm/high-availability/),
the newest and oldest `kube-apiserver` instances must be within one minor version.

Example:

* newest `kube-apiserver` is at **{{< skew currentVersion >}}**
* other `kube-apiserver` instances are supported at **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
-->
## 支持的版本偏差  {#supported-version-skew}

### kube-apiserver  {#kube-apiserver}

在[高可用性（HA）集群](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)中，
最新版和最老版的 `kube-apiserver` 实例版本偏差最多为一个次要版本。

例如：

* 最新的 `kube-apiserver` 实例处于 **{{< skew currentVersion >}}** 版本
* 其他 `kube-apiserver` 实例支持 **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}** 版本

<!-- 
### kubelet

* `kubelet` must not be newer than `kube-apiserver`.
* `kubelet` may be up to three minor versions older than `kube-apiserver` (`kubelet` < 1.25 may only be up to two minor versions older than `kube-apiserver`).

Example:

* `kube-apiserver` is at **{{< skew currentVersion >}}**
* `kubelet` is supported at **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
**{{< skew currentVersionAddMinor -2 >}}**, and **{{< skew currentVersionAddMinor -3 >}}**
-->
### kubelet  {#kubelet}

* `kubelet` 版本不能比 `kube-apiserver` 版本新。
* `kubelet` 可以比 `kube-apiserver` 低三个次要版本（如果 `kubelet` < 1.25，则只能比 `kube-apiserver` 低两个次要版本）。

例如：

* `kube-apiserver` 处于 **{{< skew currentVersion >}}** 版本
* `kubelet` 支持 **{{< skew currentVersion >}}**、**{{< skew currentVersionAddMinor -1 >}}**、**{{< skew currentVersionAddMinor -2 >}}** 和 **{{< skew currentVersionAddMinor -3 >}}** 版本

{{< note >}}
<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, this narrows the allowed `kubelet` versions.
-->
如果 HA 集群中的 `kube-apiserver` 实例之间存在版本偏差，这会缩小允许的 `kubelet` 版本范围。
{{</ note >}}

<!-- 
Example:

* `kube-apiserver` instances are at **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
* `kubelet` is supported at **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**,
  and **{{< skew currentVersionAddMinor -3 >}}** (**{{< skew currentVersion >}}** is not supported because that
  would be newer than the `kube-apiserver` instance at version **{{< skew currentVersionAddMinor -1 >}}**)
-->
例如：

* `kube-apiserver` 实例处于 **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}** 版本
* `kubelet` 支持 **{{< skew currentVersionAddMinor -1 >}}**、**{{< skew currentVersionAddMinor -2 >}}** 和 **{{< skew currentVersionAddMinor -3 >}}** 版本，
  （不支持 **{{< skew currentVersion >}}** 版本，因为这将比
  `kube-apiserver` **{{< skew currentVersionAddMinor -1 >}}** 版本的实例新）

<!--
### kube-proxy

* `kube-proxy` must not be newer than `kube-apiserver`.
* `kube-proxy` may be up to three minor versions older than `kube-apiserver`
  (`kube-proxy` < 1.25 may only be up to two minor versions older than `kube-apiserver`).
* `kube-proxy` may be up to three minor versions older or newer than the `kubelet` instance
  it runs alongside (`kube-proxy` < 1.25 may only be up to two minor versions older or newer
  than the `kubelet` instance it runs alongside).

Example:

* `kube-apiserver` is at **{{< skew currentVersion >}}**
* `kube-proxy` is supported at **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}**, and **{{< skew currentVersionAddMinor -3 >}}**
-->
### kube-proxy  {#kube-proxy}

* `kube-proxy` 不能比 `kube-apiserver` 新。
* `kube-proxy` 最多可以比 `kube-apiserver` 旧三个小版本（`kube-proxy` < 1.25 最多只能比 `kube-apiserver` 旧两个小版本）。
* `kube-proxy` 可能比它旁边运行的 `kubelet` 实例旧或新最多三个次要版本（`kube-proxy` < 1.25 最多只能是比它并行运行的 `kubelet` 实例旧或新的两个次要版本）。


例如：

* `kube-apiserver` 的版本是 **{{< skew currentVersion >}}**
* `kube-proxy` 支持的版本是 **{{< skew currentVersion >}}**、
  **{{< skew currentVersionAddMinor -1 >}}** 、**{{< skew currentVersionAddMinor -2 >}}** 和
  **{{< skew currentVersionAddMinor -3 >}}**

{{< note >}}
<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, this narrows the allowed `kube-proxy` versions.
-->
如果在 HA 集群中的 `kube-apiserver` 实例之间存在版本偏差，
所允许的 `kube-proxy` 版本范围会被缩小。
{{</ note >}}

<!--
Example:

* `kube-apiserver` instances are at **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
* `kube-proxy` is supported at **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**,
  and  **{{< skew currentVersionAddMinor -3 >}}** (**{{< skew currentVersion >}}** is not supported because that would be newer than the `kube-apiserver` instance at version **{{< skew currentVersionAddMinor -1 >}}**)
-->
例如：

* `kube-apiserver` 实例的版本是 **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}**
* `kube-proxy` 版本为 **{{< skew currentVersionAddMinor -1 >}}**、
  **{{< skew currentVersionAddMinor -2 >}}** 和 {{< skew currentVersionAddMinor -3 >}}。（**{{< skew currentVersion >}}** 将不被支持，
  因为该版本将比 **{{< skew currentVersionAddMinor -1 >}}** 的 kube-apiserver 实例更新）

<!-- 
### kube-controller-manager, kube-scheduler, and cloud-controller-manager

`kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` must not be newer than the
`kube-apiserver` instances they communicate with. They are expected to match the `kube-apiserver` minor version,
but may be up to one minor version older (to allow live upgrades).

Example:

* `kube-apiserver` is at **{{< skew currentVersion >}}**
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` are supported
at **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
-->
### kube-controller-manager、kube-scheduler 和 cloud-controller-manager  {#kube-controller-manager-kube-scheduler-and-cloud-controller-manager}

`kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
不能比与它们通信的 `kube-apiserver` 实例新。
它们应该与 `kube-apiserver` 次要版本相匹配，但可能最多旧一个次要版本（允许实时升级）。

例如：

* `kube-apiserver` 处于 **{{< skew currentVersion >}}** 版本
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  支持 **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}** 版本

{{< note >}}
<!-- 
If version skew exists between `kube-apiserver` instances in an HA cluster, and these components
can communicate with any `kube-apiserver` instance in the cluster (for example, via a load balancer),
this narrows the allowed versions of these components.
-->
如果 HA 集群中的 `kube-apiserver` 实例之间存在版本偏差，
并且这些组件可以与集群中的任何 `kube-apiserver`
实例通信（例如，通过负载均衡器），这会缩小这些组件所允许的版本范围。
{{< /note >}}

<!-- 
Example:

* `kube-apiserver` instances are at **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` communicate with a load balancer
   that can route to any `kube-apiserver` instance
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` are supported at
  **{{< skew currentVersionAddMinor -1 >}}** (**{{< skew currentVersion >}}** is not supported
  because that would be newer than the `kube-apiserver` instance at version **{{< skew currentVersionAddMinor -1 >}}**)
-->
例如：

* `kube-apiserver` 实例处于
  **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}** 版本
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  与可以路由到任何 `kube-apiserver` 实例的负载均衡器通信
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  支持 **{{< skew currentVersionAddMinor -1 >}}** 版本（不支持 **{{< skew currentVersion >}}**
  版本，因为它比 **{{< skew currentVersionAddMinor -1 >}}** 版本的 `kube-apiserver` 实例新）

<!-- 
### kubectl

`kubectl` is supported within one minor version (older or newer) of `kube-apiserver`.

Example:

* `kube-apiserver` is at **{{< skew currentVersion >}}**
* `kubectl` is supported at **{{< skew nextMinorVersion >}}**, **{{< skew currentVersion >}}**,
  and **{{< skew currentVersionAddMinor -1 >}}**
-->
### kubectl  {#kubectl}

`kubectl` 在 `kube-apiserver` 的一个次要版本（较旧或较新）中支持。

例如：

* `kube-apiserver` 处于 **{{< skew currentVersion >}}** 版本
* `kubectl` 支持 **{{< skew nextMinorVersion >}}**、**{{< skew currentVersion >}}**
  和 **{{< skew currentVersionAddMinor -1 >}}** 版本 

{{< note >}}
<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, this narrows the supported `kubectl` versions.
-->
如果 HA 集群中的 `kube-apiserver` 实例之间存在版本偏差，这会缩小支持的 `kubectl` 版本范围。
{{< /note >}}

<!-- 
Example:

* `kube-apiserver` instances are at **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
* `kubectl` is supported at **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
  (other versions would be more than one minor version skewed from one of the `kube-apiserver` components)
-->
例如：

* `kube-apiserver` 实例处于
  **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}** 版本
* `kubectl` 支持 **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}**
  版本（其他版本将与 `kube-apiserver` 组件之一相差不止一个的次要版本）

<!-- 
## Supported component upgrade order

The supported version skew between components has implications on the order
in which components must be upgraded. This section describes the order in
which components must be upgraded to transition an existing cluster from version
**{{< skew currentVersionAddMinor -1 >}}** to version **{{< skew currentVersion >}}**.
-->
## 支持的组件升级顺序  {#supported-component-upgrade-order}

组件之间支持的版本偏差会影响必须升级组件的顺序。
本节介绍了将现有集群从 **{{< skew currentVersionAddMinor -1 >}}**
版本转换到 **{{< skew currentVersion >}}** 版本时必须升级组件的顺序。

<!--
Optionally, when preparing to upgrade, the Kubernetes project recommends that
you do the following to benefit from as many regression and bug fixes as
possible during your upgrade:

* Ensure that components are on the most recent patch version of your current
  minor version.
* Upgrade components to the most recent patch version of the target minor
  version.

For example, if you're running version {{<skew currentVersionAddMinor -1>}},
ensure that you're on the most recent patch version. Then, upgrade to the most
recent patch version of {{<skew currentVersion>}}.
-->
作为一种可选方案，在准备升级时，Kubernetes 项目建议你执行以下操作，
有利于升级时包含尽可能多的回归和错误修复：

* 确保组件是当前次要版本的最新补丁版本。
* 将组件升级到目标次要版本的最新补丁版本。

例如，如果你正在运行版本 {{<skew currentVersionAddMinor -1>}}，
请确保你使用的是最新的补丁版本。
然后，升级到 {{<skew currentVersion>}} 的最新补丁版本。

<!-- 
### kube-apiserver

Pre-requisites:

* In a single-instance cluster, the existing `kube-apiserver` instance is **{{< skew currentVersionAddMinor -1 >}}**
* In an HA cluster, all `kube-apiserver` instances are at **{{< skew currentVersionAddMinor -1 >}}** or
  **{{< skew currentVersion >}}** (this ensures maximum skew of 1 minor version between the oldest and newest `kube-apiserver` instance)
* The `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` instances that
  communicate with this server are at version **{{< skew currentVersionAddMinor -1 >}}**
  (this ensures they are not newer than the existing API server version, and are within 1 minor version of the new API server version)
* `kubelet` instances on all nodes are at version **{{< skew currentVersionAddMinor -1 >}}** or **{{< skew currentVersionAddMinor -2 >}}**
  (this ensures they are not newer than the existing API server version, and are within 2 minor versions of the new API server version)
* Registered admission webhooks are able to handle the data the new `kube-apiserver` instance will send them:
  * `ValidatingWebhookConfiguration` and `MutatingWebhookConfiguration` objects are updated to include
    any new versions of REST resources added in **{{< skew currentVersion >}}**
    (or use the [`matchPolicy: Equivalent` option](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy) available in v1.15+)
  * The webhooks are able to handle any new versions of REST resources that will be sent to them,
    and any new fields added to existing versions in **{{< skew currentVersion >}}**
-->
### kube-apiserver  {#kube-apiserver-1}

先决条件：

* 在单实例集群中，现有的 `kube-apiserver` 实例处于 **{{< skew currentVersionAddMinor -1 >}}** 版本
* 在 HA 集群中，所有 `kube-apiserver` 实例都处于
  **{{< skew currentVersionAddMinor -1 >}}** 或 **{{< skew currentVersion >}}** 版本
  （这确保了最老和最新的 `kube-apiserver` 实例之间的 1 个次要版本的最大偏差）
* 与此服务器通信的 `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  实例的版本为 **{{< skew currentVersionAddMinor -1 >}}**
  （这确保它们是不比现有 API 服务器版本还要新，并且在新 API 服务器版本的 1 个次要版本内）
* 所有节点上的 `kubelet` 实例都是
  **{{< skew currentVersionAddMinor -1 >}}** 或 **{{< skew currentVersionAddMinor -2 >}}**
  版本（这确保它们不比现有 API 服务器版本新，并且在新 API 服务器版本的 2 个次要版本内）
* 已注册的 admission webhook 能够处理新的 `kube-apiserver` 实例将发送给他们的数据：
  * `ValidatingWebhookConfiguration` 和 `MutatingWebhookConfiguration`
    对象已更新以包含 **{{< skew currentVersion >}}** 中添加的任何新版本的 REST 资源
    （或使用 v1.15+ 中可用的 [`matchPolicy: Equivalent` 选项](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy)）
  * webhook 能够处理将发送给它们的任何新版本的 REST 资源，
    以及添加到 **{{< skew currentVersion >}}** 中现有版本的任何新字段

<!-- 
Upgrade `kube-apiserver` to **{{< skew currentVersion >}}**
-->
将 `kube-apiserver` 升级到 **{{< skew currentVersion >}}** 版本

{{< note >}}
<!-- 
Project policies for [API deprecation](/docs/reference/using-api/deprecation-policy/) and
[API change guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
require `kube-apiserver` to not skip minor versions when upgrading, even in single-instance clusters.
-->
[API 弃用](/zh-cn/docs/reference/using-api/deprecation-policy/)和
[API 变更指南](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
的项目策略要求 `kube-apiserver` 在升级时不跳过次要版本，即使在单实例集群中也是如此。
{{< /note >}}

<!-- 
### kube-controller-manager, kube-scheduler, and cloud-controller-manager

Pre-requisites:

* The `kube-apiserver` instances these components communicate with are at **{{< skew currentVersion >}}**
  (in HA clusters in which these control plane components can communicate with any `kube-apiserver`
  instance in the cluster, all `kube-apiserver` instances must be upgraded before upgrading these components)

Upgrade `kube-controller-manager`, `kube-scheduler`, and
`cloud-controller-manager` to **{{< skew currentVersion >}}**. There is no
required upgrade order between `kube-controller-manager`, `kube-scheduler`, and
`cloud-controller-manager`. You can upgrade these components in any order, or
even simultaneously.
-->
### kube-controller-manager、kube-scheduler 和 cloud-controller-manager  {#kube-controller-manager-kube-scheduler-and-cloud-controller-manager-1}

先决条件：

* 与这些组件通信的 `kube-apiserver` 实例处于 **{{< skew currentVersion >}}** 版本
  （在 HA 集群中，这些控制平面组件可以与集群中的任何 `kube-apiserver` 实例通信，
  所有 `kube-apiserver` 实例必须在升级这些组件之前升级）

将 `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
升级到 **{{< skew currentVersion >}}** 版本。
`kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager` 的升级顺序没有要求。
你可以按任意顺序升级这些组件，甚至可以同时升级这些组件。

<!-- 
### kubelet

Pre-requisites:

* The `kube-apiserver` instances the `kubelet` communicates with are at **{{< skew currentVersion >}}**

Optionally upgrade `kubelet` instances to **{{< skew currentVersion >}}** (or they can be left at
**{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**, or **{{< skew currentVersionAddMinor -3 >}}**)
-->
### kubelet  {#kubelet-1}

先决条件：

* 与 `kubelet` 通信的 `kube-apiserver` 实例处于 **{{< skew currentVersion >}}** 版本

可选择将 `kubelet` 实例升级到 **{{< skew latestMinorVersion >}}** 版本
（或者它们可以留在 **{{< skew currentVersionAddMinor -1 >}}** 或 **{{< skew currentVersionAddMinor -2 >}}** 或 **{{< skew currentVersionAddMinor -3 >}}** 版本）

{{< note >}}
<!--
Before performing a minor version `kubelet` upgrade, [drain](/docs/tasks/administer-cluster/safely-drain-node/) pods from that node.
In-place minor version `kubelet` upgrades are not supported.
-->
在执行次要版本 `kubelet` 升级之前，[排空](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)该节点的 Pod。
`kubelet` 不支持原地次要版本升级。
{{</ note >}}

{{< warning >}}
<!-- 
Running a cluster with `kubelet` instances that are persistently two minor versions behind
`kube-apiserver` means they must be upgraded before the control plane can be upgraded.
-->
在一个集群中运行持续比 `kube-apiserver` 落后两个次版本的 `kubelet` 实例意味着在升级控制平面之前必须先升级它们。
{{</ warning >}}

<!-- 
### kube-proxy

Pre-requisites:

* The `kube-apiserver` instances `kube-proxy` communicates with are at **{{< skew currentVersion >}}**

Optionally upgrade `kube-proxy` instances to **{{< skew currentVersion >}}**
(or they can be left at **{{< skew currentVersionAddMinor -1 >}}**
or **{{< skew currentVersionAddMinor -2 >}}**)
-->
### kube-proxy  {#kube-proxy}

前提条件：

* 与 kube-proxy 通信的 kube-apiserver 实例的版本是 **{{< skew currentVersion >}}**。
  可以选择升级 kube-proxy 实例到 **{{< skew currentVersion >}}** 
  （或者它们可以保持在 **{{< skew currentVersionAddMinor -1 >}}** 或 **{{< skew currentVersionAddMinor -2 >}}**）

{{< warning >}}
<!--
Running a cluster with `kube-proxy` instances that are persistently three minor versions behind
`kube-apiserver` means they must be upgraded before the control plane can be upgraded.
-->
在一个集群中运行持续比 `kube-apiserver` 落后三个次版本的 `kube-proxy` 实例意味着在升级控制平面之前必须先升级它们。
{{</ warning >}}
