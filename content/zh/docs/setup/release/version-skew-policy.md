---
reviewers:
- sig-api-machinery
- sig-architecture
- sig-cli
- sig-cluster-lifecycle
- sig-node
- sig-release
title: Kubernetes 版本及版本倾斜支持策略
content_template: templates/concept
weight: 30
---

{{% capture overview %}}
<!--
This document describes the maximum version skew supported between various Kubernetes components.
Specific cluster deployment tools may place additional restrictions on version skew.
-->
本文描述 Kubernetes 各组件之间版本倾斜支持策略。
特定的集群部署工具可能会有额外的限制。
{{% /capture %}}

{{% capture body %}}

## Supported versions

<!--
Kubernetes versions are expressed as **x.y.z**,
where **x** is the major version, **y** is the minor version, and **z** is the patch version, following [Semantic Versioning](http://semver.org/) terminology.
For more information, see [Kubernetes Release Versioning](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/release/versioning.md#kubernetes-release-versioning).
-->
Kubernetes 版本号格式为 **x.y.z**，其中 **x** 为大版本号，**y** 为小版本号，**z** 为补丁版本号。
版本号格式遵循 [Semantic Versioning](http://semver.org/) 规则。
更多信息，请参阅 [Kubernetes Release Versioning](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/release/versioning.md#kubernetes-release-versioning)。

<!--
The Kubernetes project maintains release branches for the most recent three minor releases.
-->
Kubernetes 项目会维护最近的三个小版本分支。

<!--
Applicable fixes, including security fixes, may be backported to those three release branches, depending on severity and feasibility.
Patch releases are cut from those branches at a regular cadence, or as needed.
This decision is owned by the [patch release manager](https://github.com/kubernetes/sig-release/blob/master/release-engineering/role-handbooks/patch-release-manager.md#release-timing).
The patch release manager is a member of the [release team for each release](https://github.com/kubernetes/sig-release/tree/master/release-team).
-->
一些 bug 修复，包括安全修复，根据其安全性和可用性，有可能会回合到这些分支。
补丁版本会定期或根据需要从这些分支中发布。
最终是否发布是由[patch release team](https://github.com/kubernetes/sig-release/blob/master/release-engineering/role-handbooks/patch-release-manager.md#release-timing)
来决定的。Patch release team同时也是[release managers](https://github.com/kubernetes/sig-release/blob/master/release-managers.md). 如需了解更多信息，请查看 [Kubernetes Patch releases](https://github.com/kubernetes/sig-release/blob/master/releases/patch-releases.md).

<!--
Minor releases occur approximately every 3 months, so each minor release branch is maintained for approximately 9 months.
-->
小版本大约每3个月发布一个，所以每个小版本分支会维护9个月。

## Supported version skew

### kube-apiserver

In [highly-available (HA) clusters](/docs/setup/production-environment/tools/kubeadm/high-availability/), the newest and oldest `kube-apiserver` instances must be within one minor version.
在 [高可用（HA）集群](/docs/setup/production-environment/tools/kubeadm/high-availability/) 中，
多个 `kube-apiserver` 实例小版本号最多差1。

<!--
Example:
-->
例如：

<!--
* newest `kube-apiserver` is at **1.13**
* other `kube-apiserver` instances are supported at **1.13** and **1.12**
-->
* 最新的 `kube-apiserver` 版本号如果是 **1.13**
* 其他 `kube-apiserver` 版本号只能是 **1.13** 或 **1.12**

### kubelet

<!--
`kubelet` must not be newer than `kube-apiserver`, and may be up to two minor versions older.
-->
`kubelet` 版本号不能高于 `kube-apiserver`，最多可以比 `kube-apiserver` 低两个小版本。

<!--
Example:

* `kube-apiserver` is at **1.13**
* `kubelet` is supported at **1.13**, **1.12**, and **1.11**
-->
例如：

* `kube-apiserver` 版本号如果是 **1.13**
* `kubelet` 只能是 **1.13** 、 **1.12** 和 **1.11**

{{< note >}}
<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, this narrows the allowed `kubelet` versions.-->如果
HA集群中多个 `kube-apiserver` 实例版本号不一致，相应的 `kubelet` 版本号可选范围也要减小。
{{</ note >}}

<!--
Example:

* `kube-apiserver` instances are at **1.13** and **1.12**
* `kubelet` is supported at **1.12**, and **1.11** (**1.13** is not supported because that would be newer than the `kube-apiserver` instance at version **1.12**)
-->
例如：

* 如果 `kube-apiserver` 的多个实例同时存在 **1.13** 和 **1.12**
* `kubelet` 只能是 **1.12** 或 **1.11**（**1.13** 不再支持，因为它比**1.12**版本的 `kube-apiserver` 更新）

### kube-controller-manager, kube-scheduler, and cloud-controller-manager

<!--
`kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` must not be newer than the `kube-apiserver` instances they communicate with. They are expected to match the `kube-apiserver` minor version, but may be up to one minor version older (to allow live upgrades).
-->
`kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager` 版本不能高于 `kube-apiserver` 版本号。
最好它们的版本号与 `kube-apiserver` 保持一致，但允许比 `kube-apiserver` 低一个小版本（为了支持在线升级）。

<!--
Example:

* `kube-apiserver` is at **1.13**
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` are supported at **1.13** and **1.12**
-->
例如：

* 如果 `kube-apiserver` 版本号为 **1.13**
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager` 版本支持 **1.13** 和 **1.12**

{{< note >}}
<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, and these components can communicate with any `kube-apiserver` instance in the cluster (for example, via a load balancer), this narrows the allowed versions of these components.-->如果在 HA 集群中，多个 `kube-apiserver` 实例版本号不一致，他们也可以跟任意一个 `kube-apiserver` 实例通信（例如，通过 load balancer），
但 `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager` 版本可用范围会相应的减小。
{{< /note >}}

<!--
Example:

* `kube-apiserver` instances are at **1.13** and **1.12**
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` communicate with a load balancer that can route to any `kube-apiserver` instance
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` are supported at **1.12** (**1.13** is not supported because that would be newer than the `kube-apiserver` instance at version **1.12**)
-->
例如：

* `kube-apiserver` 实例同时存在 **1.13** 和 **1.12** 版本
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager` 可以通过 load balancer 与所有的 `kube-apiserver` 通信
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager` 可选版本为 **1.12**（**1.13** 不再支持，因为它比 **1.12** 版本的 `kube-apiserver` 更新）

### kubectl

<!--
`kubectl` is supported within one minor version (older or newer) of `kube-apiserver`.
-->
`kubectl` 可以比 `kube-apiserver` 高一个小版本，也可以低一个小版本。

<!--
Example:

* `kube-apiserver` is at **1.13**
* `kubectl` is supported at **1.14**, **1.13**, and **1.12**
-->
例如：

* 如果 `kube-apiserver` 当前是 **1.13** 版本
* `kubectl` 则支持 **1.14** 、**1.13** 和 **1.12**

{{< note >}}
<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, this narrows the supported `kubectl` versions.-->
如果 HA 集群中的多个 `kube-apiserver` 实例版本号不一致，相应的 `kubectl` 可用版本范围也会减小。
{{< /note >}}

<!--
Example:

* `kube-apiserver` instances are at **1.13** and **1.12**
* `kubectl` is supported at **1.13** and **1.12** (other versions would be more than one minor version skewed from one of the `kube-apiserver` components)
-->
例如：

* `kube-apiserver` 多个实例同时存在 **1.13** 和 **1.12**
* `kubectl` 可选的版本为 **1.13** 和 **1.12**（其他版本不再支持，因为它会比其中某个 `kube-apiserver` 实例高或低一个小版本）

<!--
## Supported component upgrade order
-->
## 支持的组件升级次序

<!--
The supported version skew between components has implications on the order in which components must be upgraded.
This section describes the order in which components must be upgraded to transition an existing cluster from version **1.n** to version **1.(n+1)**.
-->
组件之间支持的版本倾斜会影响组件升级的顺序。
本节描述组件从版本 **1.n** 到 **1.(n+1)** 的升级次序。

### kube-apiserver

<!--
Pre-requisites:
-->
前提条件：

<!--
* In a single-instance cluster, the existing `kube-apiserver` instance is **1.n**
* In an HA cluster, all `kube-apiserver` instances are at **1.n** or **1.(n+1)** (this ensures maximum skew of 1 minor version between the oldest and newest `kube-apiserver` instance)
* The `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` instances that communicate with this server are at version **1.n** (this ensures they are not newer than the existing API server version, and are within 1 minor version of the new API server version)
* `kubelet` instances on all nodes are at version **1.n** or **1.(n-1)** (this ensures they are not newer than the existing API server version, and are within 2 minor versions of the new API server version)
* Registered admission webhooks are able to handle the data the new `kube-apiserver` instance will send them:
  * `ValidatingWebhookConfiguration` and `MutatingWebhookConfiguration` objects are updated to include any new versions of REST resources added in **1.(n+1)** (or use the [`matchPolicy: Equivalent` option](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy) available in v1.15+)
  * The webhooks are able to handle any new versions of REST resources that will be sent to them, and any new fields added to existing versions in **1.(n+1)**
-->
* 单实例集群时，`kube-apiserver` 实例版本号须是 **1.n**
* HA 集群时，所有的 `kube-apiserver` 实例版本号必须是 **1.n** 或 **1.(n+1)**（确保满足最新和最旧的实例小版本号相差不大于1）
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager` 版本号必须为 **1.n**（确保不高于 API server 的版本，且版本号相差不大于1）
* `kubelet` 实例版本号必须是 **1.n** 或 **1.(n-1)**（确保版本号不高于 API server，且版本号相差不大于2）
* 注册的 admission 插件必须能够处理新的 `kube-apiserver` 实例发送过来的数据：
  * `ValidatingWebhookConfiguration` 和 `MutatingWebhookConfiguration` 对象必须升级到可以处理 **1.(n+1)** 版本新加的 REST 资源(或使用1.15版本提供的 [`matchPolicy: Equivalent` 选项](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy))
  * 插件可以处理任何 **1.(n+1)** 版本新的 REST 资源数据和新加的字段

<!--
Upgrade `kube-apiserver` to **1.(n+1)**
-->
升级 `kube-apiserver` 到 **1.(n+1)**

{{< note >}}
<!--
Project policies for [API deprecation](/docs/reference/using-api/deprecation-policy/) and
[API change guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
require `kube-apiserver` to not skip minor versions when upgrading, even in single-instance clusters.-->跟据 [API deprecation](/docs/reference/using-api/deprecation-policy/) 和 [API change guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md) 规则，
`kube-apiserver` 不能跨小版本号升级，即使是单实例集群也不可以。

{{< /note >}}

### kube-controller-manager, kube-scheduler, and cloud-controller-manager

<!--
Pre-requisites:

* The `kube-apiserver` instances these components communicate with are at **1.(n+1)** (in HA clusters in which these control plane components can communicate with any `kube-apiserver` instance in the cluster, all `kube-apiserver` instances must be upgraded before upgrading these components)
-->
前提条件：

* `kube-apiserver` 实例必须为 **1.(n+1)** （HA 集群中，所有的`kube-apiserver` 实例必须在组件升级前完成升级）

<!--
Upgrade `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` to **1.(n+1)**
-->
升级 `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager` 到 **1.(n+1)**

### kubelet

<!--
Pre-requisites:

* The `kube-apiserver` instances the `kubelet` communicates with are at **1.(n+1)**

Optionally upgrade `kubelet` instances to **1.(n+1)** (or they can be left at **1.n** or **1.(n-1)**)
-->
前提条件：

* `kube-apiserver` 实例必须为 **1.(n+1)** 版本

`kubelet` 可以升级到 **1.(n+1)**（或者停留在 **1.n** 或 **1.(n-1)**）

{{< warning >}}
<!--
Running a cluster with `kubelet` instances that are persistently two minor versions behind `kube-apiserver` is not recommended:
-->集群中 `kubelet` 版本号不建议比 `kube-apiserver` 低两个版本号：

<!--
* they must be upgraded within one minor version of `kube-apiserver` before the control plane can be upgraded
* it increases the likelihood of running `kubelet` versions older than the three maintained minor releases
-->
* 他们必须升级到与 `kube-apiserver` 相差不超过1个小版本，才可以升级其他控制面组件
* 有可能使用低于3个在维护的小版本
{{</ warning >}}
