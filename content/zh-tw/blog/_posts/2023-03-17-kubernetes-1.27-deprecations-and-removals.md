---
layout: blog
title: "Kubernetes 在 v1.27 中移除的特性和主要變更"
date: 2023-03-17T14:00:00+0000
slug: upcoming-changes-in-kubernetes-v1-27
---
<!--
layout: blog
title: "Kubernetes Removals and Major Changes In v1.27"
date: 2023-03-17T14:00:00+0000
slug: upcoming-changes-in-kubernetes-v1-27
-->

<!--
**Author**: Harshita Sao
-->
**作者**：Harshita Sao

**譯者**：Michael Yao (DaoCloud)

<!--
As Kubernetes develops and matures, features may be deprecated, removed, or replaced
with better ones for the project's overall health. Based on the information available
at this point in the v1.27 release process, which is still ongoing and can introduce
additional changes, this article identifies and describes some of the planned changes
for the Kubernetes v1.27 release.
-->
隨着 Kubernetes 發展和成熟，爲了此項目的整體健康，某些特性可能會被棄用、移除或替換爲優化過的特性。
基於目前在 v1.27 發佈流程中獲得的資訊，本文將列舉並描述一些計劃在 Kubernetes v1.27 發佈中的變更，
發佈工作目前仍在進行中，可能會引入更多變更。

<!--
## A note about the k8s.gcr.io redirect to registry.k8s.io

To host its container images, the Kubernetes project uses a community-owned image
registry called registry.k8s.io. **On March 20th, all traffic from the out-of-date
[k8s.gcr.io](https://cloud.google.com/container-registry/) registry will be redirected
to [registry.k8s.io](https://github.com/kubernetes/registry.k8s.io)**. The deprecated
k8s.gcr.io registry will eventually be phased out.
-->
## k8s.gcr.io 重定向到 registry.k8s.io 相關說明   {#note-about-redirect}

Kubernetes 項目爲了託管其容器映像檔，使用社區擁有的一個名爲 registry.k8s.io. 的映像檔倉庫。
**從 3 月 20 日起，所有來自過期 [k8s.gcr.io](https://cloud.google.com/container-registry/)
倉庫的流量將被重定向到 [registry.k8s.io](https://github.com/kubernetes/registry.k8s.io)**。
已棄用的 k8s.gcr.io 倉庫最終將被淘汰。

<!--
### What does this change mean?

- If you are a subproject maintainer, you must update your manifests and Helm
  charts to use the new registry.
- The v1.27 Kubernetes release will not be published to the old registry.
- From April, patch releases for v1.24, v1.25, and v1.26 will no longer be
  published to the old registry.
-->
### 這次變更意味着什麼？   {#what-does-this-change-mean}

- 如果你是一個子項目的 Maintainer，你必須更新自己的清單和 Helm Chart 來使用新的倉庫。
- Kubernetes v1.27 版本不會發布到舊的倉庫。
- 從 4 月份起，針對 v1.24、v1.25 和 v1.26 的補丁版本將不再發布到舊的倉庫。

<!--
We have a [blog post](/blog/2023/03/10/image-registry-redirect/) with all
the information about this change and what to do if it impacts you.
-->
我們曾發佈了一篇[博文](/blog/2023/03/10/image-registry-redirect/)，
講述了此次變更有關的所有資訊，以及影響到你時應該採取的措施。

<!--
## The Kubernetes API Removal and Deprecation process

The Kubernetes project has a well-documented
[deprecation policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)
for features. This policy states that stable APIs may only be deprecated when
a newer, stable version of that same API is available and that APIs have a
minimum lifetime for each stability level. A deprecated API has been marked
for removal in a future Kubernetes release, it will continue to function until
removal (at least one year from the deprecation), but usage will result in a
warning being displayed. Removed APIs are no longer available in the current
version, at which point you must migrate to using the replacement.
-->
## Kubernetes API 移除和棄用流程 {#k8s-api-deprecation-process}

Kubernetes 項目對特性有一個[文檔完備的棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
該策略規定，只有當較新的、穩定的相同 API 可用時，原有的穩定 API 纔可以被棄用，
每個穩定級別的 API 都有一個最短的生命週期。棄用的 API 指的是已標記爲將在後續發行某個
Kubernetes 版本時移除的 API；移除之前該 API 將繼續發揮作用（從棄用起至少一年時間），
但使用時會顯示一條警告。被移除的 API 將在當前版本中不再可用，此時你必須遷移以使用替換的 API。

<!--
- Generally available (GA) or stable API versions may be marked as deprecated
  but must not be removed within a major version of Kubernetes.
- Beta or pre-release API versions must be supported for 3 releases after the deprecation.
- Alpha or experimental API versions may be removed in any release without prior deprecation notice.
-->
- 正式發佈（GA）或穩定的 API 版本可能被標記爲已棄用，但只有在 Kubernetes 大版本更新時纔會被移除。
- 測試版（Beta）或預發佈 API 版本在棄用後必須在後續 3 個版本中繼續支持。
- Alpha 或實驗性 API 版本可以在任何版本中被移除，不另行通知。

<!--
Whether an API is removed as a result of a feature graduating from beta to stable
or because that API simply did not succeed, all removals comply with this
deprecation policy. Whenever an API is removed, migration options are communicated
in the documentation.
-->
無論一個 API 是因爲某特性從 Beta 進階至穩定階段而被移除，還是因爲該 API 根本沒有成功，
所有移除均遵從上述棄用策略。無論何時移除一個 API，文檔中都會列出遷移選項。

<!--
## API removals, and other changes for Kubernetes v1.27

### Removal of `storage.k8s.io/v1beta1` from `CSIStorageCapacity`
-->
## 針對 Kubernetes v1.27 移除的 API 和其他變更   {#api-removals-and-other-changes-in-1.27}

### 從 `CSIStorageCapacity` 移除 `storage.k8s.io/v1beta1`

<!--
The [CSIStorageCapacity](/docs/reference/kubernetes-api/config-and-storage-resources/csi-storage-capacity-v1/)
API supports exposing currently available storage capacity via CSIStorageCapacity
objects and enhances the scheduling of pods that use CSI volumes with late binding.
The `storage.k8s.io/v1beta1` API version of CSIStorageCapacity was deprecated in v1.24,
and it will no longer be served in v1.27.
-->
[CSIStorageCapacity](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/csi-storage-capacity-v1/)
API 支持通過 CSIStorageCapacity 對象來暴露當前可用的儲存容量，並增強在後續綁定時使用 CSI 卷的 Pod 的調度。
CSIStorageCapacity 的 `storage.k8s.io/v1beta1` API 版本在 v1.24 中已被棄用，將在 v1.27 中被移除。

<!--
Migrate manifests and API clients to use the `storage.k8s.io/v1` API version,
available since v1.24. All existing persisted objects are accessible via the new API.

Refer to the
[Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1472-storage-capacity-tracking)
for more information.
-->
遷移清單和 API 客戶端以使用自 v1.24 起可用的 `storage.k8s.io/v1` API 版本。
所有現有的已持久保存的對象都可以通過這個新的 API 進行訪問。

更多資訊可以參閱
[Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1472-storage-capacity-tracking)。

<!--
Kubernetes v1.27 is not removing any other APIs; however several other aspects are going
to be removed. Read on for details.
-->
Kubernetes v1.27 沒有移除任何其他 API；但還有其他若干特性將被移除。請繼續閱讀下文。

<!--
### Support for deprecated seccomp annotations

In Kubernetes v1.19, the
[seccomp](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/135-seccomp)
(secure computing mode) support graduated to General Availability (GA).
This feature can be used to increase the workload security by restricting
the system calls for a Pod (applies to all containers) or single containers.
-->
### 對棄用的 seccomp 註解的支持

在 Kubernetes v1.19 中，
[seccomp](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/135-seccomp)
（安全計算模式）支持進階至正式發佈 (GA)。
此特性通過限制 Pod（應用到所有容器）或單個容器可執行的系統調用可以提高工作負載安全性。

<!--
The support for the alpha seccomp annotations `seccomp.security.alpha.kubernetes.io/pod`
and `container.seccomp.security.alpha.kubernetes.io` were deprecated since v1.19, now
have been completely removed. The seccomp fields are no longer auto-populated when pods
with seccomp annotations are created. Pods should use the corresponding pod or container
`securityContext.seccompProfile` field instead.
-->
對 Alpha 狀態的 seccomp 註解 `seccomp.security.alpha.kubernetes.io/pod` 和
`container.seccomp.security.alpha.kubernetes.io` 的支持自 v1.19 起被棄用，
現在已完全移除。當創建具有 seccomp 註解的 Pod 時 seccomp 字段將不再被自動填充。
Pod 應轉爲使用相應的 Pod 或容器 `securityContext.seccompProfile` 字段。

<!--
### Removal of several feature gates for volume expansion

The following feature gates for
[volume expansion](https://github.com/kubernetes/enhancements/issues/284) GA features
will be removed and must no longer be referenced in `--feature-gates` flags:
-->
### 移除針對卷擴展的若干特性門控

針對[卷擴展](https://github.com/kubernetes/enhancements/issues/284)
GA 特性的以下特性門控將被移除，且不得再在 `--feature-gates` 標誌中引用：

<!--
`ExpandCSIVolumes`
: Enable expanding of CSI volumes.

`ExpandInUsePersistentVolumes`
: Enable expanding in-use PVCs.

`ExpandPersistentVolumes`
: Enable expanding of persistent volumes.
-->
`ExpandCSIVolumes`
: 啓用 CSI 卷的擴展。

`ExpandInUsePersistentVolumes`
: 啓用擴展正使用的 PVC。

`ExpandPersistentVolumes`
: 啓用持久卷的擴展。

<!--
### Removal of `--master-service-namespace` command line argument

The kube-apiserver accepts a deprecated command line argument, `--master-service-namespace`,
that specified where to create the Service named `kubernetes` to represent the API server.
Kubernetes v1.27 will remove that argument, which has been deprecated since the v1.26 release.
-->
### 移除 `--master-service-namespace` 命令列參數

kube-apiserver 接受一個已棄用的命令列參數 `--master-service-namespace`，
該參數指定在何處創建名爲 `kubernetes` 的 Service 來表示 API 伺服器。
Kubernetes v1.27 將移除自 v1.26 版本已被棄用的該參數。

<!--
### Removal of the `ControllerManagerLeaderMigration` feature gate

[Leader Migration](https://github.com/kubernetes/enhancements/issues/2436) provides
a mechanism in which HA clusters can safely migrate "cloud-specific" controllers
between the `kube-controller-manager` and the `cloud-controller-manager` via a shared
resource lock between the two components while upgrading the replicated control plane.
-->
### 移除 `ControllerManagerLeaderMigration` 特性門控

[Leader Migration](https://github.com/kubernetes/enhancements/issues/2436)
提供了一種機制，讓 HA 叢集在升級多副本的控制平面時通過在 `kube-controller-manager` 和
`cloud-controller-manager` 這兩個組件之間共享的資源鎖，安全地遷移“特定於雲平臺”的控制器。

<!--
The `ControllerManagerLeaderMigration` feature, GA since v1.24, is unconditionally
enabled and for the v1.27 release the feature gate option will be removed. If you're
setting this feature gate explicitly, you'll need to remove that from command line
arguments or configuration files.
-->
`ControllerManagerLeaderMigration` 特性自 v1.24 正式發佈，被無條件啓用，
在 v1.27 版本中此特性門控選項將被移除。
如果你顯式設置此特性門控，你將需要從命令列參數或設定檔案中將其移除。

<!--
### Removal of `--enable-taint-manager` command line argument

The kube-controller-manager command line argument `--enable-taint-manager` is
deprecated, and will be removed in Kubernetes v1.27. The feature that it supports,
[taint based eviction](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions),
is already enabled by default and will continue to be implicitly enabled when the flag is removed.
-->
### 移除 `--enable-taint-manager` 命令列參數

kube-controller-manager 命令列參數 `--enable-taint-manager` 已被棄用，
將在 Kubernetes v1.27 中被移除。
該參數支持的特性[基於污點的驅逐](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions)已被預設啓用，
且在標誌被移除時也將繼續被隱式啓用。

<!--
### Removal of `--pod-eviction-timeout` command line argument

The deprecated command line argument `--pod-eviction-timeout` will be removed from the
kube-controller-manager.

-->
### 移除 `--pod-eviction-timeout` 命令列參數

棄用的命令列參數 `--pod-eviction-timeout` 將被從 kube-controller-manager 中移除。

<!--
### Removal of the `CSI Migration` feature gate

The [CSI migration](https://github.com/kubernetes/enhancements/issues/625)
programme allows moving from in-tree volume plugins to out-of-tree CSI drivers.
CSI migration is generally available since Kubernetes v1.16, and the associated
`CSIMigration` feature gate will be removed in v1.27.
-->
### 移除 `CSI Migration` 特性門控

[CSI migration](https://github.com/kubernetes/enhancements/issues/625)
程式允許從樹內卷插件移動到樹外 CSI 驅動程式。
CSI 遷移自 Kubernetes v1.16 起正式發佈，關聯的 `CSIMigration` 特性門控將在 v1.27 中被移除。

<!--
### Removal of `CSIInlineVolume` feature gate

The [CSI Ephemeral Volume](https://github.com/kubernetes/kubernetes/pull/111258)
feature allows CSI volumes to be specified directly in the pod specification for
ephemeral use cases. They can be used to inject arbitrary states, such as
configuration, secrets, identity, variables or similar information, directly
inside pods using a mounted volume. This feature graduated to GA in v1.25.
Hence, the feature gate `CSIInlineVolume` will be removed in the v1.27 release.
-->
### 移除 `CSIInlineVolume` 特性門控

[CSI Ephemeral Volume](https://github.com/kubernetes/kubernetes/pull/111258)
特性允許在 Pod 規約中直接指定 CSI 卷作爲臨時使用場景。這些 CSI 卷可用於使用掛載的卷直接在
Pod 內注入任意狀態，例如設定、Secret、身份、變量或類似資訊。
此特性在 v1.25 中進階至正式發佈。因此，此特性門控 `CSIInlineVolume` 將在 v1.27 版本中移除。

<!--
### Removal of `EphemeralContainers` feature gate

[Ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/)
graduated to GA in v1.25. These are containers with a temporary duration that
executes within namespaces of an existing pod. Ephemeral containers are
typically initiated by a user in order to observe the state of other pods
and containers for troubleshooting and debugging purposes. For Kubernetes v1.27,
API support for ephemeral containers is unconditionally enabled; the
`EphemeralContainers` feature gate will be removed.
-->
### 移除 `EphemeralContainers` 特性門控

[臨時容器](/zh-cn/docs/concepts/workloads/pods/ephemeral-containers/)在 v1.25 中進階至正式發佈。
這些是具有臨時持續週期的容器，在現有 Pod 的命名空間內執行。
臨時容器通常由使用者發起，以觀察其他 Pod 和容器的狀態進行故障排查和調試。
對於 Kubernetes v1.27，對臨時容器的 API 支持被無條件啓用；`EphemeralContainers` 特性門控將被移除。

<!--
### Removal of `LocalStorageCapacityIsolation` feature gate

The [Local Ephemeral Storage Capacity Isolation](https://github.com/kubernetes/kubernetes/pull/111513)
feature moved to GA in v1.25. The feature provides support for capacity isolation
of local ephemeral storage between pods, such as `emptyDir` volumes, so that a pod
can be hard limited in its consumption of shared resources. The kubelet will
evicting Pods if consumption of local ephemeral storage exceeds the configured limit.
The feature gate, `LocalStorageCapacityIsolation`, will be removed in the v1.27 release.
-->
### 移除 `LocalStorageCapacityIsolation` 特性門控

[Local Ephemeral Storage Capacity Isolation](https://github.com/kubernetes/kubernetes/pull/111513)
特性在 v1.25 中進階至正式發佈。此特性支持 `emptyDir` 卷這類 Pod 之間本地臨時儲存的容量隔離，
因此可以硬性限制 Pod 對共享資源的消耗。如果本地臨時儲存的消耗超過了設定的限制，kubelet 將驅逐 Pod。
特性門控 `LocalStorageCapacityIsolation` 將在 v1.27 版本中被移除。

<!--
### Removal of `NetworkPolicyEndPort` feature gate

The v1.25 release of Kubernetes promoted `endPort` in NetworkPolicy to GA.
NetworkPolicy providers that support the `endPort` field that can be used to
specify a range of ports to apply a NetworkPolicy. Previously, each NetworkPolicy
could only target a single port. So the feature gate `NetworkPolicyEndPort`
will be removed in this release.
-->
### 移除 `NetworkPolicyEndPort` 特性門控

Kubernetes v1.25 版本將 NetworkPolicy 中的 `endPort` 進階至正式發佈。
支持 `endPort` 字段的 NetworkPolicy 提供程式可用於指定一系列端口以應用 NetworkPolicy。
以前每個 NetworkPolicy 只能針對一個端口。因此，此特性門控 `NetworkPolicyEndPort` 將在此版本中被移除。

<!--
Please be aware that `endPort` field must be supported by the Network Policy
provider. If your provider does not support `endPort`, and this field is
specified in a Network Policy, the Network Policy will be created covering
only the port field (single port).
-->
請注意，`endPort` 字段必須得到 NetworkPolicy 提供程式的支持。
如果你的提供程式不支持 `endPort`，並且此字段在 NetworkPolicy 中指定，
則將創建僅涵蓋端口字段（單個端口）的 NetworkPolicy。

<!--
### Removal of `StatefulSetMinReadySeconds` feature gate

For a pod that is part of a StatefulSet, Kubernetes can mark the Pod ready only
if Pod is available (and passing checks) for at least the period you specify in
[`minReadySeconds`](/docs/concepts/workloads/controllers/statefulset/#minimum-ready-seconds).
The feature became generally available in Kubernetes v1.25, and the `StatefulSetMinReadySeconds`
feature gate will be locked to true and removed in the v1.27 release.
-->
### 移除 `StatefulSetMinReadySeconds` 特性門控

對於作爲 StatefulSet 一部分的 Pod，只有當 Pod 至少在
[`minReadySeconds`](/zh-cn/docs/concepts/workloads/controllers/statefulset/#minimum-ready-seconds)
中指定的持續期內可用（並通過檢查）時，Kubernetes 纔會將此 Pod 標記爲只讀。
該特性在 Kubernetes v1.25 中正式發佈，`StatefulSetMinReadySeconds`
特性門控將鎖定爲 true，並在 v1.27 版本中被移除。

<!--
### Removal of `IdentifyPodOS` feature gate

You can specify the operating system for a Pod, and the feature support for that
is stable since the v1.25 release. The `IdentifyPodOS` feature gate will be
removed for Kubernetes v1.27.
-->
### 移除 `IdentifyPodOS` 特性門控

你可以爲 Pod 指定操作系統，此項特性支持自 v1.25 版本進入穩定。
`IdentifyPodOS` 特性門控將在 Kubernetes v1.27 中被移除。

<!--
### Removal of `DaemonSetUpdateSurge` feature gate

The v1.25 release of Kubernetes also stabilised surge support for DaemonSet pods,
implemented in order to minimize DaemonSet downtime during rollouts.
The `DaemonSetUpdateSurge` feature gate will be removed in Kubernetes v1.27.
-->
### 移除 `DaemonSetUpdateSurge` 特性門控

Kubernetes v1.25 版本還穩定了對 DaemonSet Pod 的浪湧支持，
其實現是爲了最大限度地減少部署期間 DaemonSet 的停機時間。
`DaemonSetUpdateSurge` 特性門控將在 Kubernetes v1.27 中被移除。

<!--
### Removal of `--container-runtime` command line argument
-->
### 移除 `--container-runtime` 命令列參數

<!--
The kubelet accepts a deprecated command line argument, `--container-runtime`, and the only
valid value would be `remote` after dockershim code is removed. Kubernetes v1.27 will remove
that argument, which has been deprecated since the v1.24 release.
-->
kubelet 接受一個已棄用的命令列參數 `--container-runtime`，
並且在移除 dockershim 代碼後，唯一有效的值將是 `remote`。
Kubernetes v1.27 將移除該參數，該參數自 v1.24 版本以來已被棄用。

<!--
## Looking ahead

The official list of
[API removals](https://kubernetes.io/docs/reference/using-api/deprecation-guide/#v1-29)
planned for Kubernetes v1.29 includes:
-->
## 前瞻   {#looking-ahead}

Kubernetes 1.29 計劃[移除的 API 官方列表](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-29)包括：

<!--
- The `flowcontrol.apiserver.k8s.io/v1beta2` API version of FlowSchema and
  PriorityLevelConfiguration will no longer be served in v1.29.
-->
- FlowSchema 和 PriorityLevelConfiguration 的 `flowcontrol.apiserver.k8s.io/v1beta2`
  API 版本將不再在 v1.29 中提供。

<!--
## Want to know more?

Deprecations are announced in the Kubernetes release notes. You can see the
announcements of pending deprecations in the release notes for:
-->
## 瞭解更多   {#want-to-know-more}

Kubernetes 發行說明中宣告了棄用資訊。你可以在以下版本的發行說明中看到待棄用的公告：

- [Kubernetes v1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)

- [Kubernetes v1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation)

- [Kubernetes v1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation)

- [Kubernetes v1.26](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.26.md#deprecation)

<!--
We will formally announce the deprecations that come with
[Kubernetes v1.27](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md#deprecation)
as part of the CHANGELOG for that release.
-->
我們將在
[Kubernetes v1.27](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md#deprecation)
的 CHANGELOG 中正式宣佈該版本的棄用資訊。

<!--
For information on the process of deprecation and removal, check out the official Kubernetes
[deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) document.
-->
有關棄用和移除流程資訊，請查閱正式的
[Kubernetes 棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api)文檔。
