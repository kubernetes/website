---
title: 版本偏差策略
type: docs
description: >
  Kubernetes 各個組件之間所支持的最大版本偏差。
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
本文檔描述了 Kubernetes 各個組件之間所支持的最大版本偏差。
特定的叢集部署工具可能會對版本偏差添加額外的限制。

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
**y** 是次要版本，**z** 是補丁版本，遵循[語義版本控制](https://semver.org/)術語。
更多信息請參見
[Kubernetes 版本發佈控制](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning)。

Kubernetes 項目維護最近的三個次要版本（{{< skew latestVersion >}}、{{< skew prevMinorVersion >}}、{{< skew oldestMinorVersion >}}）的發佈分支。
Kubernetes 1.19 和更新的版本獲得[大約 1 年的補丁支持](/zh-cn/releases/patch-releases/#support-period)。
Kubernetes 1.18 及更早的版本獲得了大約 9 個月的補丁支持。

<!-- 
Applicable fixes, including security fixes, may be backported to those three release branches,
depending on severity and feasibility. Patch releases are cut from those branches at a
[regular cadence](/releases/patch-releases/#cadence), plus additional urgent releases, when required.

The [Release Managers](/releases/release-managers/) group owns this decision.

For more information, see the Kubernetes [patch releases](/releases/patch-releases/) page.
-->
適當的修復，包括安全問題修復，可能會被後沿三個發佈分支，具體取決於問題的嚴重性和可行性。
補丁版本按[常規節奏](/zh-cn/releases/patch-releases/#cadence)從這些分支中刪除，並在需要時增加額外的緊急版本。

[發佈管理員](/zh-cn/releases/release-managers/)小組擁有這件事的決定權。

有關更多信息，請參閱 Kubernetes [補丁發佈](/zh-cn/releases/patch-releases/)頁面。

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

在[高可用性（HA）叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)中，
最新版和最老版的 `kube-apiserver` 實例版本偏差最多爲一個次要版本。

例如：

* 最新的 `kube-apiserver` 實例處於 **{{< skew currentVersion >}}** 版本
* 其他 `kube-apiserver` 實例支持 **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}** 版本

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
* `kubelet` 可以比 `kube-apiserver` 低三個次要版本（如果 `kubelet` < 1.25，則只能比 `kube-apiserver` 低兩個次要版本）。

例如：

* `kube-apiserver` 處於 **{{< skew currentVersion >}}** 版本
* `kubelet` 支持 **{{< skew currentVersion >}}**、**{{< skew currentVersionAddMinor -1 >}}**、**{{< skew currentVersionAddMinor -2 >}}** 和 **{{< skew currentVersionAddMinor -3 >}}** 版本

{{< note >}}
<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, this narrows the allowed `kubelet` versions.
-->
如果 HA 叢集中的 `kube-apiserver` 實例之間存在版本偏差，這會縮小允許的 `kubelet` 版本範圍。
{{</ note >}}

<!-- 
Example:

* `kube-apiserver` instances are at **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
* `kubelet` is supported at **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**,
  and **{{< skew currentVersionAddMinor -3 >}}** (**{{< skew currentVersion >}}** is not supported because that
  would be newer than the `kube-apiserver` instance at version **{{< skew currentVersionAddMinor -1 >}}**)
-->
例如：

* `kube-apiserver` 實例處於 **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}** 版本
* `kubelet` 支持 **{{< skew currentVersionAddMinor -1 >}}**、**{{< skew currentVersionAddMinor -2 >}}** 和 **{{< skew currentVersionAddMinor -3 >}}** 版本，
  （不支持 **{{< skew currentVersion >}}** 版本，因爲這將比
  `kube-apiserver` **{{< skew currentVersionAddMinor -1 >}}** 版本的實例新）

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
* `kube-proxy` 最多可以比 `kube-apiserver` 舊三個小版本（`kube-proxy` < 1.25 最多隻能比 `kube-apiserver` 舊兩個小版本）。
* `kube-proxy` 可能比它旁邊運行的 `kubelet` 實例舊或新最多三個次要版本（`kube-proxy` < 1.25 最多隻能是比它並行運行的 `kubelet` 實例舊或新的兩個次要版本）。


例如：

* `kube-apiserver` 的版本是 **{{< skew currentVersion >}}**
* `kube-proxy` 支持的版本是 **{{< skew currentVersion >}}**、
  **{{< skew currentVersionAddMinor -1 >}}** 、**{{< skew currentVersionAddMinor -2 >}}** 和
  **{{< skew currentVersionAddMinor -3 >}}**

{{< note >}}
<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, this narrows the allowed `kube-proxy` versions.
-->
如果在 HA 叢集中的 `kube-apiserver` 實例之間存在版本偏差，
所允許的 `kube-proxy` 版本範圍會被縮小。
{{</ note >}}

<!--
Example:

* `kube-apiserver` instances are at **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
* `kube-proxy` is supported at **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**,
  and  **{{< skew currentVersionAddMinor -3 >}}** (**{{< skew currentVersion >}}** is not supported because that would be newer than the `kube-apiserver` instance at version **{{< skew currentVersionAddMinor -1 >}}**)
-->
例如：

* `kube-apiserver` 實例的版本是 **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}**
* `kube-proxy` 版本爲 **{{< skew currentVersionAddMinor -1 >}}**、
  **{{< skew currentVersionAddMinor -2 >}}** 和 {{< skew currentVersionAddMinor -3 >}}。（**{{< skew currentVersion >}}** 將不被支持，
  因爲該版本將比 **{{< skew currentVersionAddMinor -1 >}}** 的 kube-apiserver 實例更新）

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
不能比與它們通信的 `kube-apiserver` 實例新。
它們應該與 `kube-apiserver` 次要版本相匹配，但可能最多舊一個次要版本（允許實時升級）。

例如：

* `kube-apiserver` 處於 **{{< skew currentVersion >}}** 版本
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  支持 **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}** 版本

{{< note >}}
<!-- 
If version skew exists between `kube-apiserver` instances in an HA cluster, and these components
can communicate with any `kube-apiserver` instance in the cluster (for example, via a load balancer),
this narrows the allowed versions of these components.
-->
如果 HA 叢集中的 `kube-apiserver` 實例之間存在版本偏差，
並且這些組件可以與叢集中的任何 `kube-apiserver`
實例通信（例如，通過負載均衡器），這會縮小這些組件所允許的版本範圍。
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

* `kube-apiserver` 實例處於
  **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}** 版本
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  與可以路由到任何 `kube-apiserver` 實例的負載均衡器通信
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  支持 **{{< skew currentVersionAddMinor -1 >}}** 版本（不支持 **{{< skew currentVersion >}}**
  版本，因爲它比 **{{< skew currentVersionAddMinor -1 >}}** 版本的 `kube-apiserver` 實例新）

<!-- 
### kubectl

`kubectl` is supported within one minor version (older or newer) of `kube-apiserver`.

Example:

* `kube-apiserver` is at **{{< skew currentVersion >}}**
* `kubectl` is supported at **{{< skew nextMinorVersion >}}**, **{{< skew currentVersion >}}**,
  and **{{< skew currentVersionAddMinor -1 >}}**
-->
### kubectl  {#kubectl}

`kubectl` 在 `kube-apiserver` 的一個次要版本（較舊或較新）中支持。

例如：

* `kube-apiserver` 處於 **{{< skew currentVersion >}}** 版本
* `kubectl` 支持 **{{< skew nextMinorVersion >}}**、**{{< skew currentVersion >}}**
  和 **{{< skew currentVersionAddMinor -1 >}}** 版本 

{{< note >}}
<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, this narrows the supported `kubectl` versions.
-->
如果 HA 叢集中的 `kube-apiserver` 實例之間存在版本偏差，這會縮小支持的 `kubectl` 版本範圍。
{{< /note >}}

<!-- 
Example:

* `kube-apiserver` instances are at **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
* `kubectl` is supported at **{{< skew currentVersion >}}** and **{{< skew currentVersionAddMinor -1 >}}**
  (other versions would be more than one minor version skewed from one of the `kube-apiserver` components)
-->
例如：

* `kube-apiserver` 實例處於
  **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}** 版本
* `kubectl` 支持 **{{< skew currentVersion >}}** 和 **{{< skew currentVersionAddMinor -1 >}}**
  版本（其他版本將與 `kube-apiserver` 組件之一相差不止一個的次要版本）

<!-- 
## Supported component upgrade order

The supported version skew between components has implications on the order
in which components must be upgraded. This section describes the order in
which components must be upgraded to transition an existing cluster from version
**{{< skew currentVersionAddMinor -1 >}}** to version **{{< skew currentVersion >}}**.
-->
## 支持的組件升級順序  {#supported-component-upgrade-order}

組件之間支持的版本偏差會影響必須升級組件的順序。
本節介紹了將現有叢集從 **{{< skew currentVersionAddMinor -1 >}}**
版本轉換到 **{{< skew currentVersion >}}** 版本時必須升級組件的順序。

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
作爲一種可選方案，在準備升級時，Kubernetes 項目建議你執行以下操作，
有利於升級時包含儘可能多的迴歸和錯誤修復：

* 確保組件是當前次要版本的最新補丁版本。
* 將組件升級到目標次要版本的最新補丁版本。

例如，如果你正在運行版本 {{<skew currentVersionAddMinor -1>}}，
請確保你使用的是最新的補丁版本。
然後，升級到 {{<skew currentVersion>}} 的最新補丁版本。

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

先決條件：

* 在單實例叢集中，現有的 `kube-apiserver` 實例處於 **{{< skew currentVersionAddMinor -1 >}}** 版本
* 在 HA 叢集中，所有 `kube-apiserver` 實例都處於
  **{{< skew currentVersionAddMinor -1 >}}** 或 **{{< skew currentVersion >}}** 版本
  （這確保了最老和最新的 `kube-apiserver` 實例之間的 1 個次要版本的最大偏差）
* 與此伺服器通信的 `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  實例的版本爲 **{{< skew currentVersionAddMinor -1 >}}**
  （這確保它們是不比現有 API 伺服器版本還要新，並且在新 API 伺服器版本的 1 個次要版本內）
* 所有節點上的 `kubelet` 實例都是
  **{{< skew currentVersionAddMinor -1 >}}** 或 **{{< skew currentVersionAddMinor -2 >}}**
  版本（這確保它們不比現有 API 伺服器版本新，並且在新 API 伺服器版本的 2 個次要版本內）
* 已註冊的 admission webhook 能夠處理新的 `kube-apiserver` 實例將發送給他們的數據：
  * `ValidatingWebhookConfiguration` 和 `MutatingWebhookConfiguration`
    對象已更新以包含 **{{< skew currentVersion >}}** 中添加的任何新版本的 REST 資源
    （或使用 v1.15+ 中可用的 [`matchPolicy: Equivalent` 選項](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy)）
  * webhook 能夠處理將發送給它們的任何新版本的 REST 資源，
    以及添加到 **{{< skew currentVersion >}}** 中現有版本的任何新字段

<!-- 
Upgrade `kube-apiserver` to **{{< skew currentVersion >}}**
-->
將 `kube-apiserver` 升級到 **{{< skew currentVersion >}}** 版本

{{< note >}}
<!-- 
Project policies for [API deprecation](/docs/reference/using-api/deprecation-policy/) and
[API change guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
require `kube-apiserver` to not skip minor versions when upgrading, even in single-instance clusters.
-->
[API 棄用](/zh-cn/docs/reference/using-api/deprecation-policy/)和
[API 變更指南](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
的項目策略要求 `kube-apiserver` 在升級時不跳過次要版本，即使在單實例叢集中也是如此。
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

先決條件：

* 與這些組件通信的 `kube-apiserver` 實例處於 **{{< skew currentVersion >}}** 版本
  （在 HA 叢集中，這些控制平面組件可以與叢集中的任何 `kube-apiserver` 實例通信，
  所有 `kube-apiserver` 實例必須在升級這些組件之前升級）

將 `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
升級到 **{{< skew currentVersion >}}** 版本。
`kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager` 的升級順序沒有要求。
你可以按任意順序升級這些組件，甚至可以同時升級這些組件。

<!-- 
### kubelet

Pre-requisites:

* The `kube-apiserver` instances the `kubelet` communicates with are at **{{< skew currentVersion >}}**

Optionally upgrade `kubelet` instances to **{{< skew currentVersion >}}** (or they can be left at
**{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**, or **{{< skew currentVersionAddMinor -3 >}}**)
-->
### kubelet  {#kubelet-1}

先決條件：

* 與 `kubelet` 通信的 `kube-apiserver` 實例處於 **{{< skew currentVersion >}}** 版本

可選擇將 `kubelet` 實例升級到 **{{< skew latestMinorVersion >}}** 版本
（或者它們可以留在 **{{< skew currentVersionAddMinor -1 >}}** 或 **{{< skew currentVersionAddMinor -2 >}}** 或 **{{< skew currentVersionAddMinor -3 >}}** 版本）

{{< note >}}
<!--
Before performing a minor version `kubelet` upgrade, [drain](/docs/tasks/administer-cluster/safely-drain-node/) pods from that node.
In-place minor version `kubelet` upgrades are not supported.
-->
在執行次要版本 `kubelet` 升級之前，[排空](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)該節點的 Pod。
`kubelet` 不支持原地次要版本升級。
{{</ note >}}

{{< warning >}}
<!-- 
Running a cluster with `kubelet` instances that are persistently two minor versions behind
`kube-apiserver` means they must be upgraded before the control plane can be upgraded.
-->
在一個叢集中運行持續比 `kube-apiserver` 落後兩個次版本的 `kubelet` 實例意味着在升級控制平面之前必須先升級它們。
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

前提條件：

* 與 kube-proxy 通信的 kube-apiserver 實例的版本是 **{{< skew currentVersion >}}**。
  可以選擇升級 kube-proxy 實例到 **{{< skew currentVersion >}}** 
  （或者它們可以保持在 **{{< skew currentVersionAddMinor -1 >}}** 或 **{{< skew currentVersionAddMinor -2 >}}**）

{{< warning >}}
<!--
Running a cluster with `kube-proxy` instances that are persistently three minor versions behind
`kube-apiserver` means they must be upgraded before the control plane can be upgraded.
-->
在一個叢集中運行持續比 `kube-apiserver` 落後三個次版本的 `kube-proxy` 實例意味着在升級控制平面之前必須先升級它們。
{{</ warning >}}
