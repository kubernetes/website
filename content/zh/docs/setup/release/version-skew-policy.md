---
title: Kubernetes 版本及版本偏差支持策略
content_type: concept
weight: 30
---

<!-- overview -->
<!--
This document describes the maximum version skew supported between various Kubernetes components.
Specific cluster deployment tools may place additional restrictions on version skew.
-->
本文描述 Kubernetes 各组件之间版本偏差支持策略。
特定的集群部署工具可能会有额外的限制。


<!-- body -->

<!--
## Supported versions
-->
## 版本支持策略

<!--
Kubernetes versions are expressed as **x.y.z**,
where **x** is the major version, **y** is the minor version, and **z** is the patch version, following [Semantic Versioning](http://semver.org/) terminology.
For more information, see [Kubernetes Release Versioning](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/release/versioning.md#kubernetes-release-versioning).
-->
Kubernetes 版本号格式为 **x.y.z**，其中 **x** 为大版本号，**y** 为小版本号，**z** 为补丁版本号。
版本号格式遵循 [Semantic Versioning](https://semver.org/) 规则。
更多信息，请参阅
[Kubernetes 发布版本](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/release/versioning.md#kubernetes-release-versioning)。

<!--
The Kubernetes project maintains release branches for the most recent three minor releases ({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).  Kubernetes 1.19 and newer receive approximately 1 year of patch support. Kubernetes 1.18 and older received approximately 9 months of patch support.
-->
Kubernetes 项目会维护最近的三个小版本分支（{{< skew latestVersion >}}, 
{{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}）。
Kubernetes 1.19 及更高的版本将获得大约1年的补丁支持。
Kubernetes 1.18 及更早的版本获得大约9个月的补丁支持。

<!--
Applicable fixes, including security fixes, may be backported to those three release branches, depending on severity and feasibility.
Patch releases are cut from those branches at a [regular cadence](https://git.k8s.io/sig-release/releases/patch-releases.md#cadence), plus additional urgent releases, when required.

The [Release Managers](https://git.k8s.io/sig-release/release-managers.md) group owns this decision.

For more information, see the Kubernetes [patch releases](https://git.k8s.io/sig-release/releases/patch-releases.md) page.
-->
一些 bug 修复，包括安全修复，取决于其严重性和可行性，有可能会反向合并到这三个发布分支。
补丁版本会[定期](https://git.k8s.io/sig-release/releases/patch-releases.md#cadence)
或根据需要从这些分支中发布。 
最终是否发布是由
[发布管理者](https://github.com/kubernetes/sig-release/blob/master/release-managers.md)
来决定的。
如需了解更多信息，请查看 Kubernetes
[补丁发布](https://github.com/kubernetes/sig-release/blob/master/releases/patch-releases.md)。

<!--
## Supported version skew
-->
## 版本偏差策略

### kube-apiserver

<!--
In [highly-available (HA) clusters](/docs/setup/production-environment/tools/kubeadm/high-availability/), the newest and oldest `kube-apiserver` instances must be within one minor version.
-->
在 [高可用（HA）集群](/zh/docs/setup/production-environment/tools/kubeadm/high-availability/) 中，
多个 `kube-apiserver` 实例小版本号最多差1。

<!--
Example:
-->
例如：

<!--
* newest `kube-apiserver` is at **{{< skew latestVersion >}}**
* other `kube-apiserver` instances are supported at **{{< skew latestVersion >}}** and **{{< skew prevMinorVersion >}}**
-->
* 最新的 `kube-apiserver` 版本号如果是 **{{< skew latestVersion >}}**
* 其他受支持的 `kube-apiserver` 版本号包括 **{{< skew latestVersion >}}** 和
  **{{< skew prevMinorVersion >}}**

### kubelet

<!--
`kubelet` must not be newer than `kube-apiserver`, and may be up to two minor versions older.
-->
`kubelet` 版本号不能高于 `kube-apiserver`，最多可以比 `kube-apiserver` 低两个小版本。

<!--
Example:

* `kube-apiserver` is at **{{< skew latestVersion >}}**
* `kubelet` is supported at **{{< skew latestVersion >}}**, **{{< skew prevMinorVersion >}}**, and **{{< skew oldestMinorVersion >}}**
-->
例如：

* `kube-apiserver` 版本号如果是 **{{< skew latestVersion >}}**
* 受支持的的 `kubelet` 版本将包括 **{{< skew latestVersion >}}**、
  **{{< skew prevMinorVersion >}}** 和 **{{< skew oldestMinorVersion >}}**

<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, this narrows the allowed `kubelet` versions.
-->
{{< note >}}
如果 HA 集群中多个 `kube-apiserver` 实例版本号不一致，相应的 `kubelet` 版本号可选范围也要减小。
{{</ note >}}

<!--
Example:

* `kube-apiserver` instances are at **{{< skew latestVersion >}}** and **{{< skew prevMinorVersion >}}**
* `kubelet` is supported at **{{< skew prevMinorVersion >}}**, and **{{< skew oldestMinorVersion >}}** (**{{< skew latestVersion >}}** is not supported because that would be newer than the `kube-apiserver` instance at version **{{< skew prevMinorVersion >}}**)
-->
例如：

* 如果 `kube-apiserver` 实例同时存在 **{{< skew latestVersion >}}** 和
  **{{< skew prevMinorVersion >}}**
* `kubelet` 的受支持版本将是 **{{< skew prevMinorVersion >}}** 和
  **{{< skew oldestMinorVersion >}}**
  （**{{< skew latestVersion >}}** 不再支持，因为它比
  **{{< skew prevMinorVersion >}}** 版本的 `kube-apiserver` 更新）

<!--
### kube-controller-manager, kube-scheduler, and cloud-controller-manager
-->
### kube-controller-manager、 kube-scheduler 和 cloud-controller-manager

<!--
`kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` must not be newer than the `kube-apiserver` instances they communicate with. They are expected to match the `kube-apiserver` minor version, but may be up to one minor version older (to allow live upgrades).
-->
`kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
版本不能高于 `kube-apiserver` 版本号。
最好它们的版本号与 `kube-apiserver` 保持一致，但允许比 `kube-apiserver`
低一个小版本（为了支持在线升级）。

<!--
Example:

* `kube-apiserver` is at **{{< skew latestVersion >}}**
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` are supported at **{{< skew latestVersion >}}** and **{{< skew prevMinorVersion >}}**
-->
例如：

* 如果 `kube-apiserver` 版本号为 **{{< skew latestVersion >}}**
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  版本支持 **{{< skew latestVersion >}}** 和 **{{< skew prevMinorVersion >}}**

<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, and these components can communicate with any `kube-apiserver` instance in the cluster (for example, via a load balancer), this narrows the allowed versions of these components.
-->
{{< note >}}
如果在 HA 集群中，多个 `kube-apiserver` 实例版本号不一致，他们也可以跟
任意一个 `kube-apiserver` 实例通信（例如，通过 load balancer），
但 `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
版本可用范围会相应的减小。
{{< /note >}}

<!--
Example:

* `kube-apiserver` instances are at **{{< skew latestVersion >}}** and **{{< skew prevMinorVersion >}}**
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` communicate with a load balancer that can route to any `kube-apiserver` instance
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` are supported at **{{< skew prevMinorVersion >}}** (**{{< skew latestVersion >}}** is not supported because that would be newer than the `kube-apiserver` instance at version **{{< skew prevMinorVersion >}}**)
-->
例如：

* `kube-apiserver` 实例同时存在 **{{< skew latestVersion >}}** 和
  **{{< skew prevMinorVersion >}}** 版本
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  可以通过 load balancer 与所有的 `kube-apiserver` 通信
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  可选版本为 **{{< skew prevMinorVersion >}}**
  （**{{< skew latestVersion >}}** 不再支持，因为它比 **{{< skew prevMinorVersion >}}**
  版本的 `kube-apiserver` 更新）

### kubectl

<!--
`kubectl` is supported within one minor version (older or newer) of `kube-apiserver`.
-->
`kubectl` 可以比 `kube-apiserver` 高一个小版本，也可以低一个小版本。

<!--
Example:

* `kube-apiserver` is at **{{< skew latestVersion >}}**
* `kubectl` is supported at **{{< skew nextMinorVersion >}}**, **{{< skew latestVersion >}}**, and **{{< skew prevMinorVersion >}}**
-->
例如：

* 如果 `kube-apiserver` 当前是 **{{< skew latestVersion >}}** 版本
* `kubectl` 则支持 **{{< skew nextMinorVersion >}}**、**{{< skew latestVersion >}}**
  和 **{{< skew prevMinorVersion >}}**

<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, this narrows the supported `kubectl` versions.
-->
{{< note >}}
如果 HA 集群中的多个 `kube-apiserver` 实例版本号不一致，相应的 `kubectl` 可用版本范围也会减小。
{{< /note >}}

<!--
Example:

* `kube-apiserver` instances are at **{{< skew latestVersion >}}** and **{{< skew prevMinorVersion >}}**
* `kubectl` is supported at **{{< skew latestVersion >}}** and **{{< skew prevMinorVersion >}}** (other versions would be more than one minor version skewed from one of the `kube-apiserver` components)
-->
例如：

* `kube-apiserver` 多个实例同时存在 **{{< skew latestVersion >}}** 和
  **{{< skew prevMinorVersion >}}**
* `kubectl` 可选的版本为 **{{< skew latestVersion >}}** 和
  **{{< skew prevMinorVersion >}}**（其他版本不再支持，
  因为它会比其中某个 `kube-apiserver` 实例高或低一个小版本）

<!--
## Supported component upgrade order
-->
## 支持的组件升级次序

<!--
The supported version skew between components has implications on the order in which components must be upgraded.
This section describes the order in which components must be upgraded to transition an existing cluster from version **{{< skew prevMinorVersion >}}** to version **{{< skew latestVersion >}}**.
-->
组件之间支持的版本偏差会影响组件升级的顺序。
本节描述组件从版本 **{{< skew prevMinorVersion >}}** 到 **{{< skew latestVersion >}}**
的升级次序。

### kube-apiserver

<!--
Pre-requisites:
-->
前提条件：

<!--
* In a single-instance cluster, the existing `kube-apiserver` instance is **{{< skew prevMinorVersion >}}**
* In an HA cluster, all `kube-apiserver` instances are at **{{< skew prevMinorVersion >}}** or **{{< skew latestVersion >}}** (this ensures maximum skew of 1 minor version between the oldest and newest `kube-apiserver` instance)
* The `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` instances that communicate with this server are at version **{{< skew prevMinorVersion >}}** (this ensures they are not newer than the existing API server version, and are within 1 minor version of the new API server version)
* `kubelet` instances on all nodes are at version **{{< skew prevMinorVersion >}}** or **{{< skew oldestMinorVersion >}}** (this ensures they are not newer than the existing API server version, and are within 2 minor versions of the new API server version)
* Registered admission webhooks are able to handle the data the new `kube-apiserver` instance will send them:
  * `ValidatingWebhookConfiguration` and `MutatingWebhookConfiguration` objects are updated to include any new versions of REST resources added in **{{< skew latestVersion >}}** (or use the [`matchPolicy: Equivalent` option](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy) available in v1.15+)
  * The webhooks are able to handle any new versions of REST resources that will be sent to them, and any new fields added to existing versions in **{{< skew latestVersion >}}**
-->
* 单实例集群中，`kube-apiserver` 实例版本号须是 **{{< skew prevMinorVersion >}}**
* 高可用（HA）集群中，所有的 `kube-apiserver` 实例版本号必须是
  **{{< skew prevMinorVersion >}}** 或 **{{< skew latestVersion >}}**
  （确保满足最新和最旧的实例小版本号相差不大于1）
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  版本号必须为 **{{< skew prevMinorVersion >}}**
  （确保不高于 API server 的版本，且版本号相差不大于1）
* `kubelet` 实例版本号必须是 **{{< skew prevMinorVersion >}}** 或
  **{{< skew oldestMinorVersion >}}**（确保版本号不高于 API server，且版本号相差不大于2）
* 注册的 admission 插件必须能够处理新的 `kube-apiserver` 实例发送过来的数据：
  * `ValidatingWebhookConfiguration` 和 `MutatingWebhookConfiguration` 对象必须升级到可以处理
    **{{< skew latestVersion >}}** 版本新加的 REST 资源（或使用 1.15 版本提供的
    [`matchPolicy: Equivalent` 选项](/zh/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy)）
  * 插件可以处理任何 **{{< skew latestVersion >}}** 版本新的 REST 资源数据和新加的字段

<!--
Upgrade `kube-apiserver` to **{{< skew latestVersion >}}**
-->
升级 `kube-apiserver` 到 **{{< skew latestVersion >}}**

{{< note >}}
<!--
Project policies for [API deprecation](/docs/reference/using-api/deprecation-policy/) and
[API change guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
require `kube-apiserver` to not skip minor versions when upgrading, even in single-instance clusters.
-->
根据 [API 弃用策略](/zh/docs/reference/using-api/deprecation-policy/) 和
[API 变更指南](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)，
`kube-apiserver` 不能跨小版本号升级，即使是单实例集群也不可以。

{{< /note >}}

<!--
### kube-controller-manager, kube-scheduler, and cloud-controller-manager
-->
### kube-controller-manager、kube-scheduler 和 cloud-controller-manager

<!--
Pre-requisites:

* The `kube-apiserver` instances these components communicate with are at **{{< skew latestVersion >}}** (in HA clusters in which these control plane components can communicate with any `kube-apiserver` instance in the cluster, all `kube-apiserver` instances must be upgraded before upgrading these components)
-->
前提条件：

* `kube-apiserver` 实例必须为 **{{< skew latestVersion >}}** 
  （HA 集群中，所有的`kube-apiserver` 实例必须在组件升级前完成升级）

<!--
Upgrade `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` to **{{< skew latestVersion >}}**
-->
升级 `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
到 **{{< skew latestVersion >}}**

### kubelet

<!--
Pre-requisites:

* The `kube-apiserver` instances the `kubelet` communicates with are at **{{< skew latestVersion >}}**

Optionally upgrade `kubelet` instances to **{{< skew latestVersion >}}** (or they can be left at **{{< skew prevMinorVersion >}}** or **{{< skew oldestMinorVersion >}}**)
-->
前提条件：

* `kube-apiserver` 实例必须为 **{{< skew latestVersion >}}** 版本

`kubelet` 可以升级到 **{{< skew latestVersion >}}**（或者停留在
**{{< skew prevMinorVersion >}}** 或 **{{< skew oldestMinorVersion >}}**）

{{< note >}}
<!--
Before performing a minor version `kubelet` upgrade, [drain](/docs/tasks/administer-cluster/safely-drain-node/) pods from that node.
In-place minor version `kubelet` upgrades are not supported.
-->
在对 `kubelet` 执行次版本升级时，先[腾空](/zh/docs/tasks/administer-cluster/safely-drain-node/)
节点上的 Pods。
目前不支持原地升级 `kubelet` 的次版本。
{{</ note >}}

{{< warning >}}
<!--
Running a cluster with `kubelet` instances that are persistently two minor versions behind `kube-apiserver` is not recommended:

* they must be upgraded within one minor version of `kube-apiserver` before the control plane can be upgraded
* it increases the likelihood of running `kubelet` versions older than the three maintained minor releases
-->
集群中 `kubelet` 版本号不建议比 `kube-apiserver` 低两个版本号：

* 它们必须升级到与 `kube-apiserver` 相差不超过 1 个小版本，才可以升级其他控制面组件
* 有可能使用低于 3 个在维护的小版本
{{</ warning >}}

<!-- ### kube-proxy -->
### kube-proxy

<!--  
* `kube-proxy` must be the same minor version as `kubelet` on the node.
* `kube-proxy` must not be newer than `kube-apiserver`.
* `kube-proxy` must be at most two minor versions older than `kube-apiserver.`
-->
* `kube-proxy` 必须与节点上的 `kubelet` 的小版本相同
* `kube-proxy` 一定不能比 `kube-apiserver` 小版本更新
* `kube-proxy` 最多只能比 `kube-apiserver` 早两个小版本

<!--  
Example:

If `kube-proxy` version is **{{< skew oldestMinorVersion >}}**:

* `kubelet` version must be at the same minor version as **{{< skew oldestMinorVersion >}}**.
* `kube-apiserver` version must be between **{{< skew oldestMinorVersion >}}** and **{{< skew latestVersion >}}**, inclusive.
-->
例如：

如果 `kube-proxy` 的版本是 **{{< skew oldestMinorVersion >}}**：

* `kubelet` 版本必须相同，也是 **{{< skew oldestMinorVersion >}}**
* `kube-apiserver` 版本必须在 **{{< skew oldestMinorVersion >}}** 到
  **{{< skew latestVersion >}}** 之间（闭区间）
