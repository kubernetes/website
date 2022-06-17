---
title: 版本偏差策略
type: docs
description: >
  Kubernetes 各個元件之間所支援的最大版本偏差。
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
本文件描述了 Kubernetes 各個元件之間所支援的最大版本偏差。
特定的叢集部署工具可能會對版本偏差新增額外的限制。

<!-- body -->

<!-- 
## Supported versions

Kubernetes versions are expressed as **x.y.z**, where **x** is the major version, **y** is the minor version, and **z** is the patch version, following [Semantic Versioning](https://semver.org/) terminology.
For more information, see [Kubernetes Release Versioning](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/release/versioning.md#kubernetes-release-versioning).

The Kubernetes project maintains release branches for the most recent three minor releases ({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).  Kubernetes 1.19 and newer receive approximately 1 year of patch support. Kubernetes 1.18 and older received approximately 9 months of patch support.
-->
## 支援的版本  {#supported-versions}

Kubernetes 版本以 **x.y.z** 表示，其中 **x** 是主要版本，
**y** 是次要版本，**z** 是補丁版本，遵循[語義版本控制](https://semver.org/)術語。
更多資訊請參見
[Kubernetes 版本釋出控制](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/release/versioning.md#kubernetes-release-versioning)。

Kubernetes 專案維護最近的三個次要版本（{{< skew latestVersion >}}、{{< skew prevMinorVersion >}}、{{< skew oldMinorVersion >}}）的釋出分支。
Kubernetes 1.19 和更新的版本獲得大約 1 年的補丁支援。
Kubernetes 1.18 及更早的版本獲得了大約 9 個月的補丁支援。

<!-- 
Applicable fixes, including security fixes, may be backported to those three release branches, depending on severity and feasibility.
Patch releases are cut from those branches at a [regular cadence](https://kubernetes.io/releases/patch-releases/#cadence), plus additional urgent releases, when required.

The [Release Managers](/releases/release-managers/) group owns this decision.

For more information, see the Kubernetes [patch releases](/releases/patch-releases/) page.
-->
適當的修復，包括安全問題修復，可能會被後沿三個釋出分支，具體取決於問題的嚴重性和可行性。
補丁版本按[常規節奏](https://kubernetes.io/releases/patch-releases/#cadence)從這些分支中刪除，並在需要時增加額外的緊急版本。

[釋出管理員](/zh-cn/releases/release-managers/)小組擁有這件事的決定權。

有關更多資訊，請參閱 Kubernetes [補丁釋出](/zh-cn/releases/patch-releases/)頁面。

<!-- 
## Supported version skew

### kube-apiserver

In [highly-available (HA) clusters](/docs/setup/production-environment/tools/kubeadm/high-availability/), the newest and oldest `kube-apiserver` instances must be within one minor version.

Example:

* newest `kube-apiserver` is at **{{< skew latestVersion >}}**
* other `kube-apiserver` instances are supported at **{{< skew latestVersion >}}** and **{{< skew prevMinorVersion >}}**
-->
## 支援的版本偏差  {#supported-version-skew}

### kube-apiserver  {#kube-apiserver}

在[高可用性（HA）叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)中，
最新版和最老版的 `kube-apiserver` 例項版本偏差最多為一個次要版本。

例如：

* 最新的 `kube-apiserver` 例項處於 **{{< skew latestVersion >}}** 版本
* 其他 `kube-apiserver` 例項支援 **{{< skew latestVersion >}}** 和 **{{< skew prevMinorVersion >}}** 版本

<!-- 
### kubelet

`kubelet` must not be newer than `kube-apiserver`, and may be up to two minor versions older.

Example:

* `kube-apiserver` is at **{{< skew latestVersion >}}**
* `kubelet` is supported at **{{< skew latestVersion >}}**, **{{< skew prevMinorVersion >}}**, and **{{< skew oldestMinorVersion >}}**
-->
### kubelet  {#kubelet}

`kubelet` 版本不能比 `kube-apiserver` 版本新，並且最多隻可落後兩個次要版本。

例如：

* `kube-apiserver` 處於 **{{< skew latestVersion >}}** 版本
* `kubelet` 支援 **{{< skew latestVersion >}}**、**{{< skew prevMinorVersion >}}** 和 **{{< skew oldMinorVersion >}}** 版本

{{< note >}}
<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, this narrows the allowed `kubelet` versions.
-->
如果 HA 叢集中的 `kube-apiserver` 例項之間存在版本偏差，這會縮小允許的 `kubelet` 版本範圍。
{{</ note >}}

<!-- 
Example:

* `kube-apiserver` instances are at **{{< skew latestVersion >}}** and **{{< skew prevMinorVersion >}}**
* `kubelet` is supported at **{{< skew prevMinorVersion >}}**, and **{{< skew oldestMinorVersion >}}** (**{{< skew latestVersion >}}** is not supported because that would be newer than the `kube-apiserver` instance at version **{{< skew prevMinorVersion >}}**)
-->
例如：

* `kube-apiserver` 例項處於 **{{< skew latestVersion >}}** 和 **{{< skew prevMinorVersion >}}** 版本
* `kubelet` 支援 **{{< skew prevMinorVersion >}}** 和 **{{< skew oldMinorVersion >}}** 版本，
  （不支援 **{{< skew latestVersion >}}** 版本，因為這將比
  `kube-apiserver` **{{< skew prevMinorVersion >}}** 版本的例項新）

<!-- 
### kube-controller-manager, kube-scheduler, and cloud-controller-manager

`kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` must not be newer than the `kube-apiserver` instances they communicate with. They are expected to match the `kube-apiserver` minor version, but may be up to one minor version older (to allow live upgrades).

Example:

* `kube-apiserver` is at **{{< skew latestVersion >}}**
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` are supported at **{{< skew latestVersion >}}** and **{{< skew prevMinorVersion >}}**
-->
### kube-controller-manager、kube-scheduler 和 cloud-controller-manager  {#kube-controller-manager-kube-scheduler-and-cloud-controller-manager}

`kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
不能比與它們通訊的 `kube-apiserver` 例項新。
它們應該與 `kube-apiserver` 次要版本相匹配，但可能最多舊一個次要版本（允許實時升級）。

例如：

* `kube-apiserver` 處於 **{{< skew latestVersion >}}** 版本
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  支援 **{{< skew latestVersion >}}** 和 **{{< skew prevMinorVersion >}}** 版本

{{< note >}}
<!-- 
If version skew exists between `kube-apiserver` instances in an HA cluster, and these components can communicate with any `kube-apiserver` instance in the cluster (for example, via a load balancer), this narrows the allowed versions of these components.
-->
如果 HA 叢集中的 `kube-apiserver` 例項之間存在版本偏差，
並且這些元件可以與叢集中的任何 `kube-apiserver`
例項通訊（例如，透過負載均衡器），這會縮小這些元件所允許的版本範圍。
{{< /note >}}

<!-- 
Example:

* `kube-apiserver` instances are at **{{< skew latestVersion >}}** and **{{< skew prevMinorVersion >}}**
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` communicate with a load balancer that can route to any `kube-apiserver` instance
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` are supported at **{{< skew prevMinorVersion >}}** (**{{< skew latestVersion >}}** is not supported because that would be newer than the `kube-apiserver` instance at version **{{< skew prevMinorVersion >}}**)
-->
例如：

* `kube-apiserver` 例項處於
  **{{< skew latestVersion >}}** 和 **{{< skew prevMinorVersion >}}** 版本
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  與可以路由到任何 `kube-apiserver` 例項的負載均衡器通訊
* `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  支援 **{{< skew prevMinorVersion >}}** 版本（不支援 **{{< skew latestVersion >}}**
  版本，因為它比 **{{< skew prevMinorVersion >}}** 版本的 `kube-apiserver` 例項新）

<!-- 
### kubectl

`kubectl` is supported within one minor version (older or newer) of `kube-apiserver`.

Example:

* `kube-apiserver` is at **{{< skew latestVersion >}}**
* `kubectl` is supported at **{{< skew nextMinorVersion >}}**, **{{< skew latestVersion >}}**, and **{{< skew prevMinorVersion >}}**
-->
### kubectl  {#kubectl}

`kubectl` 在 `kube-apiserver` 的一個次要版本（較舊或較新）中支援。

例如：

* `kube-apiserver` 處於 **{{< skew latestVersion >}}** 版本
* `kubectl` 支援 **{{< skew nextMinorVersion >}}**、**{{< skew latestVersion >}}**
  和 **{{< skew prevMinorVersion >}}** 版本 

{{< note >}}
<!--
If version skew exists between `kube-apiserver` instances in an HA cluster, this narrows the supported `kubectl` versions.
-->
如果 HA 叢集中的 `kube-apiserver` 例項之間存在版本偏差，這會縮小支援的 `kubectl` 版本範圍。
{{< /note >}}

<!-- 
Example:

* `kube-apiserver` instances are at **{{< skew latestVersion >}}** and **{{< skew prevMinorVersion >}}**
* `kubectl` is supported at **{{< skew latestVersion >}}** and **{{< skew prevMinorVersion >}}** (other versions would be more than one minor version skewed from one of the `kube-apiserver` components)
-->
例如：

* `kube-apiserver` 例項處於
  **{{< skew latestVersion >}}** 和 **{{< skew prevMinorVersion >}}** 版本
* `kubectl` 支援 **{{< skew latestVersion >}}** 和 **{{< skew prevMinorVersion >}}**
  版本（其他版本將與 `kube-apiserver` 元件之一相差不止一個的次要版本）

<!-- 
## Supported component upgrade order

The supported version skew between components has implications on the order in which components must be upgraded.
This section describes the order in which components must be upgraded to transition an existing cluster from version **{{< skew prevMinorVersion >}}** to version **{{< skew latestVersion >}}**.
-->
## 支援的元件升級順序  {#supported-component-upgrade-order}

元件之間支援的版本偏差會影響必須升級元件的順序。
本節介紹了將現有叢集從 **{{< skew prevMinorVersion >}}**
版本轉換到 **{{< skew latestVersion >}}** 版本時必須升級元件的順序。

<!-- 
### kube-apiserver

Pre-requisites:

* In a single-instance cluster, the existing `kube-apiserver` instance is **{{< skew prevMinorVersion >}}**
* In an HA cluster, all `kube-apiserver` instances are at **{{< skew prevMinorVersion >}}** or **{{< skew latestVersion >}}** (this ensures maximum skew of 1 minor version between the oldest and newest `kube-apiserver` instance)
* The `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` instances that communicate with this server are at version **{{< skew prevMinorVersion >}}** (this ensures they are not newer than the existing API server version, and are within 1 minor version of the new API server version)
* `kubelet` instances on all nodes are at version **{{< skew prevMinorVersion >}}** or **{{< skew oldestMinorVersion >}}** (this ensures they are not newer than the existing API server version, and are within 2 minor versions of the new API server version)
* Registered admission webhooks are able to handle the data the new `kube-apiserver` instance will send them:
  * `ValidatingWebhookConfiguration` and `MutatingWebhookConfiguration` objects are updated to include any new versions of REST resources added in **{{< skew latestVersion >}}** (or use the [`matchPolicy: Equivalent` option](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy) available in v1.15+)
  * The webhooks are able to handle any new versions of REST resources that will be sent to them, and any new fields added to existing versions in **{{< skew latestVersion >}}**
-->
### kube-apiserver  {#kube-apiserver-1}

先決條件：

* 在單例項叢集中，現有的 `kube-apiserver` 例項處於 **{{< skew prevMinorVersion >}}** 版本
* 在 HA 叢集中，所有 `kube-apiserver` 例項都處於
  **{{< skew prevMinorVersion >}}** 或 **{{< skew latestVersion >}}** 版本
  （這確保了最老和最新的 `kube-apiserver` 例項之間的 1 個次要版本的最大偏差）
* 與此伺服器通訊的 `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
  例項的版本為 **{{< skew prevMinorVersion >}}**
  （這確保它們是不比現有 API 伺服器版本還要新，並且在新 API 伺服器版本的 1 個次要版本內）
* 所有節點上的 `kubelet` 例項都是
  **{{< skew prevMinorVersion >}}** 或 **{{< skew oldMinorVersion >}}**
  版本（這確保它們不比現有 API 伺服器版本新，並且在新 API 伺服器版本的 2 個次要版本內）
* 已註冊的 admission webhook 能夠處理新的 `kube-apiserver` 例項將傳送給他們的資料：
  * `ValidatingWebhookConfiguration` 和 `MutatingWebhookConfiguration`
    物件已更新以包含 **{{< skew latestVersion >}}** 中新增的任何新版本的 REST 資源
    （或使用 v1.15+ 中可用的 [`matchPolicy: Equivalent` 選項](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy)）
  * webhook 能夠處理將傳送給它們的任何新版本的 REST 資源，
    以及新增到 **{{< skew latestVersion >}}** 中現有版本的任何新欄位

<!-- 
Upgrade `kube-apiserver` to **{{< skew latestVersion >}}**
-->
將 `kube-apiserver` 升級到 **{{< skew latestVersion >}}** 版本

{{< note >}}
<!-- 
Project policies for [API deprecation](/docs/reference/using-api/deprecation-policy/) and
[API change guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
require `kube-apiserver` to not skip minor versions when upgrading, even in single-instance clusters.
-->
[API 棄用](/zh-cn/docs/reference/using-api/deprecation-policy/)和
[API 變更指南](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
的專案策略要求 `kube-apiserver` 在升級時不跳過次要版本，即使在單例項叢集中也是如此。
{{< /note >}}

<!-- 
### kube-controller-manager, kube-scheduler, and cloud-controller-manager

Pre-requisites:

* The `kube-apiserver` instances these components communicate with are at **{{< skew latestVersion >}}** (in HA clusters in which these control plane components can communicate with any `kube-apiserver` instance in the cluster, all `kube-apiserver` instances must be upgraded before upgrading these components)

Upgrade `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` to **{{< skew latestVersion >}}**
-->
### kube-controller-manager、kube-scheduler 和 cloud-controller-manager  {#kube-controller-manager-kube-scheduler-and-cloud-controller-manager-1}

先決條件：

* 與這些元件通訊的 `kube-apiserver` 例項處於 **{{< skew latestVersion >}}** 版本
  （在 HA 叢集中，這些控制平面元件可以與叢集中的任何 `kube-apiserver` 例項通訊，
  所有 `kube-apiserver` 例項必須在升級這些元件之前升級）

將 `kube-controller-manager`、`kube-scheduler` 和 `cloud-controller-manager`
升級到 **{{< skew latestVersion >}}** 版本

<!-- 
### kubelet

Pre-requisites:

* The `kube-apiserver` instances the `kubelet` communicates with are at **{{< skew latestVersion >}}**

Optionally upgrade `kubelet` instances to **{{< skew latestVersion >}}** (or they can be left at **{{< skew prevMinorVersion >}}** or **{{< skew oldestMinorVersion >}}**)
-->
### kubelet  {#kubelet-1}

先決條件：

* 與 `kubelet` 通訊的 `kube-apiserver` 例項處於 **{{< skew latestVersion >}}** 版本

可選擇將 `kubelet` 例項升級到 **{{< skew latestMinorVersion >}}** 版本
（或者它們可以留在 **{{< skew prevMinorVersion >}}** 或 **{{< skew oldMinorVersion >}}** 版本）

{{< note >}}
<!--
Before performing a minor version `kubelet` upgrade, [drain](/docs/tasks/administer-cluster/safely-drain-node/) pods from that node.
In-place minor version `kubelet` upgrades are not supported.
-->
在執行次要版本 `kubelet` 升級之前，[排空](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)該節點的 Pod。
`kubelet` 不支援原地次要版本升級。
{{</ note >}}

{{< warning >}}
<!-- 
Running a cluster with `kubelet` instances that are persistently two minor versions behind `kube-apiserver` is not recommended:

* they must be upgraded within one minor version of `kube-apiserver` before the control plane can be upgraded
* it increases the likelihood of running `kubelet` versions older than the three maintained minor releases
-->
不建議執行 `kubelet` 例項始終落後 `kube-apiserver` 兩個次要版本的叢集：

* 它們必須在 `kube-apiserver` 的一個次要版本中升級，然後才能升級控制平面
* 它增加了執行早於三個處於維護狀態的次要版本的 `kubelet` 的可能性
{{</ warning >}}

<!-- 
### kube-proxy

* `kube-proxy` must be the same minor version as `kubelet` on the node.
* `kube-proxy` must not be newer than `kube-apiserver`.
* `kube-proxy` must be at most two minor versions older than `kube-apiserver.`

Example:

If `kube-proxy` version is **{{< skew oldestMinorVersion >}}**:

* `kubelet` version must be at the same minor version as **{{< skew oldestMinorVersion >}}**.
* `kube-apiserver` version must be between **{{< skew oldestMinorVersion >}}** and **{{< skew latestVersion >}}**, inclusive.
-->
### kube-proxy  {#kube-proxy}

* `kube-proxy` 和節點上的 `kubelet` 必須是相同的次要版本。
* `kube-proxy` 版本不能比 `kube-apiserver` 版本新。
* `kube-proxy` 最多隻能比 `kube-apiserver` 落後兩個次要版本。

例如：

如果 `kube-proxy` 版本處於 **{{< skew oldMinorVersion >}}** 版本：

* `kubelet` 必須處於相同的次要版本 **{{< skew oldMinorVersion >}}**。
* `kube-apiserver` 版本必須介於 **{{< skew oldMinorVersion >}}** 和 **{{< skew latestVersion >}}** 之間，包括兩者。
