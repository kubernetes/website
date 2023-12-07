---
layout: blog
title: "Kubernetes 在 v1.27 中移除的特性和主要变更"
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

**译者**：Michael Yao (DaoCloud)

<!--
As Kubernetes develops and matures, features may be deprecated, removed, or replaced
with better ones for the project's overall health. Based on the information available
at this point in the v1.27 release process, which is still ongoing and can introduce
additional changes, this article identifies and describes some of the planned changes
for the Kubernetes v1.27 release.
-->
随着 Kubernetes 发展和成熟，为了此项目的整体健康，某些特性可能会被弃用、移除或替换为优化过的特性。
基于目前在 v1.27 发布流程中获得的信息，本文将列举并描述一些计划在 Kubernetes v1.27 发布中的变更，
发布工作目前仍在进行中，可能会引入更多变更。

<!--
## A note about the k8s.gcr.io redirect to registry.k8s.io

To host its container images, the Kubernetes project uses a community-owned image
registry called registry.k8s.io. **On March 20th, all traffic from the out-of-date
[k8s.gcr.io](https://cloud.google.com/container-registry/) registry will be redirected
to [registry.k8s.io](https://github.com/kubernetes/registry.k8s.io)**. The deprecated
k8s.gcr.io registry will eventually be phased out.
-->
## k8s.gcr.io 重定向到 registry.k8s.io 相关说明   {#note-about-redirect}

Kubernetes 项目为了托管其容器镜像，使用社区拥有的一个名为 registry.k8s.io. 的镜像仓库。
**从 3 月 20 日起，所有来自过期 [k8s.gcr.io](https://cloud.google.com/container-registry/)
仓库的流量将被重定向到 [registry.k8s.io](https://github.com/kubernetes/registry.k8s.io)**。
已弃用的 k8s.gcr.io 仓库最终将被淘汰。

<!--
### What does this change mean?

- If you are a subproject maintainer, you must update your manifests and Helm
  charts to use the new registry.
- The v1.27 Kubernetes release will not be published to the old registry.
- From April, patch releases for v1.24, v1.25, and v1.26 will no longer be
  published to the old registry.
-->
### 这次变更意味着什么？   {#what-does-this-change-mean}

- 如果你是一个子项目的 Maintainer，你必须更新自己的清单和 Helm Chart 来使用新的仓库。
- Kubernetes v1.27 版本不会发布到旧的仓库。
- 从 4 月份起，针对 v1.24、v1.25 和 v1.26 的补丁版本将不再发布到旧的仓库。

<!--
We have a [blog post](/blog/2023/03/10/image-registry-redirect/) with all
the information about this change and what to do if it impacts you.
-->
我们曾发布了一篇[博文](/blog/2023/03/10/image-registry-redirect/)，
讲述了此次变更有关的所有信息，以及影响到你时应该采取的措施。

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
## Kubernetes API 移除和弃用流程 {#k8s-api-deprecation-process}

Kubernetes 项目对特性有一个[文档完备的弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
该策略规定，只有当较新的、稳定的相同 API 可用时，原有的稳定 API 才可以被弃用，
每个稳定级别的 API 都有一个最短的生命周期。弃用的 API 指的是已标记为将在后续发行某个
Kubernetes 版本时移除的 API；移除之前该 API 将继续发挥作用（从弃用起至少一年时间），
但使用时会显示一条警告。被移除的 API 将在当前版本中不再可用，此时你必须迁移以使用替换的 API。

<!--
- Generally available (GA) or stable API versions may be marked as deprecated
  but must not be removed within a major version of Kubernetes.
- Beta or pre-release API versions must be supported for 3 releases after the deprecation.
- Alpha or experimental API versions may be removed in any release without prior deprecation notice.
-->
- 正式发布（GA）或稳定的 API 版本可能被标记为已弃用，但只有在 Kubernetes 大版本更新时才会被移除。
- 测试版（Beta）或预发布 API 版本在弃用后必须在后续 3 个版本中继续支持。
- Alpha 或实验性 API 版本可以在任何版本中被移除，不另行通知。

<!--
Whether an API is removed as a result of a feature graduating from beta to stable
or because that API simply did not succeed, all removals comply with this
deprecation policy. Whenever an API is removed, migration options are communicated
in the documentation.
-->
无论一个 API 是因为某特性从 Beta 进阶至稳定阶段而被移除，还是因为该 API 根本没有成功，
所有移除均遵从上述弃用策略。无论何时移除一个 API，文档中都会列出迁移选项。

<!--
## API removals, and other changes for Kubernetes v1.27

### Removal of `storage.k8s.io/v1beta1` from `CSIStorageCapacity`
-->
## 针对 Kubernetes v1.27 移除的 API 和其他变更   {#api-removals-and-other-changes-in-1.27}

### 从 `CSIStorageCapacity` 移除 `storage.k8s.io/v1beta1`

<!--
The [CSIStorageCapacity](/docs/reference/kubernetes-api/config-and-storage-resources/csi-storage-capacity-v1/)
API supports exposing currently available storage capacity via CSIStorageCapacity
objects and enhances the scheduling of pods that use CSI volumes with late binding.
The `storage.k8s.io/v1beta1` API version of CSIStorageCapacity was deprecated in v1.24,
and it will no longer be served in v1.27.
-->
[CSIStorageCapacity](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/csi-storage-capacity-v1/)
API 支持通过 CSIStorageCapacity 对象来暴露当前可用的存储容量，并增强在后续绑定时使用 CSI 卷的 Pod 的调度。
CSIStorageCapacity 的 `storage.k8s.io/v1beta1` API 版本在 v1.24 中已被弃用，将在 v1.27 中被移除。

<!--
Migrate manifests and API clients to use the `storage.k8s.io/v1` API version,
available since v1.24. All existing persisted objects are accessible via the new API.

Refer to the
[Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1472-storage-capacity-tracking)
for more information.
-->
迁移清单和 API 客户端以使用自 v1.24 起可用的 `storage.k8s.io/v1` API 版本。
所有现有的已持久保存的对象都可以通过这个新的 API 进行访问。

更多信息可以参阅
[Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1472-storage-capacity-tracking)。

<!--
Kubernetes v1.27 is not removing any other APIs; however several other aspects are going
to be removed. Read on for details.
-->
Kubernetes v1.27 没有移除任何其他 API；但还有其他若干特性将被移除。请继续阅读下文。

<!--
### Support for deprecated seccomp annotations

In Kubernetes v1.19, the
[seccomp](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/135-seccomp)
(secure computing mode) support graduated to General Availability (GA).
This feature can be used to increase the workload security by restricting
the system calls for a Pod (applies to all containers) or single containers.
-->
### 对弃用的 seccomp 注解的支持

在 Kubernetes v1.19 中，
[seccomp](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/135-seccomp)
（安全计算模式）支持进阶至正式发布 (GA)。
此特性通过限制 Pod（应用到所有容器）或单个容器可执行的系统调用可以提高工作负载安全性。

<!--
The support for the alpha seccomp annotations `seccomp.security.alpha.kubernetes.io/pod`
and `container.seccomp.security.alpha.kubernetes.io` were deprecated since v1.19, now
have been completely removed. The seccomp fields are no longer auto-populated when pods
with seccomp annotations are created. Pods should use the corresponding pod or container
`securityContext.seccompProfile` field instead.
-->
对 Alpha 状态的 seccomp 注解 `seccomp.security.alpha.kubernetes.io/pod` 和
`container.seccomp.security.alpha.kubernetes.io` 的支持自 v1.19 起被弃用，
现在已完全移除。当创建具有 seccomp 注解的 Pod 时 seccomp 字段将不再被自动填充。
Pod 应转为使用相应的 Pod 或容器 `securityContext.seccompProfile` 字段。

<!--
### Removal of several feature gates for volume expansion

The following feature gates for
[volume expansion](https://github.com/kubernetes/enhancements/issues/284) GA features
will be removed and must no longer be referenced in `--feature-gates` flags:
-->
### 移除针对卷扩展的若干特性门控

针对[卷扩展](https://github.com/kubernetes/enhancements/issues/284)
GA 特性的以下特性门控将被移除，且不得再在 `--feature-gates` 标志中引用：

<!--
`ExpandCSIVolumes`
: Enable expanding of CSI volumes.

`ExpandInUsePersistentVolumes`
: Enable expanding in-use PVCs.

`ExpandPersistentVolumes`
: Enable expanding of persistent volumes.
-->
`ExpandCSIVolumes`
: 启用 CSI 卷的扩展。

`ExpandInUsePersistentVolumes`
: 启用扩展正使用的 PVC。

`ExpandPersistentVolumes`
: 启用持久卷的扩展。

<!--
### Removal of `--master-service-namespace` command line argument

The kube-apiserver accepts a deprecated command line argument, `--master-service-namespace`,
that specified where to create the Service named `kubernetes` to represent the API server.
Kubernetes v1.27 will remove that argument, which has been deprecated since the v1.26 release.
-->
### 移除 `--master-service-namespace` 命令行参数

kube-apiserver 接受一个已弃用的命令行参数 `--master-service-namespace`，
该参数指定在何处创建名为 `kubernetes` 的 Service 来表示 API 服务器。
Kubernetes v1.27 将移除自 v1.26 版本已被弃用的该参数。

<!--
### Removal of the `ControllerManagerLeaderMigration` feature gate

[Leader Migration](https://github.com/kubernetes/enhancements/issues/2436) provides
a mechanism in which HA clusters can safely migrate "cloud-specific" controllers
between the `kube-controller-manager` and the `cloud-controller-manager` via a shared
resource lock between the two components while upgrading the replicated control plane.
-->
### 移除 `ControllerManagerLeaderMigration` 特性门控

[Leader Migration](https://github.com/kubernetes/enhancements/issues/2436)
提供了一种机制，让 HA 集群在升级多副本的控制平面时通过在 `kube-controller-manager` 和
`cloud-controller-manager` 这两个组件之间共享的资源锁，安全地迁移“特定于云平台”的控制器。

<!--
The `ControllerManagerLeaderMigration` feature, GA since v1.24, is unconditionally
enabled and for the v1.27 release the feature gate option will be removed. If you're
setting this feature gate explicitly, you'll need to remove that from command line
arguments or configuration files.
-->
`ControllerManagerLeaderMigration` 特性自 v1.24 正式发布，被无条件启用，
在 v1.27 版本中此特性门控选项将被移除。
如果你显式设置此特性门控，你将需要从命令行参数或配置文件中将其移除。

<!--
### Removal of `--enable-taint-manager` command line argument

The kube-controller-manager command line argument `--enable-taint-manager` is
deprecated, and will be removed in Kubernetes v1.27. The feature that it supports,
[taint based eviction](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions),
is already enabled by default and will continue to be implicitly enabled when the flag is removed.
-->
### 移除 `--enable-taint-manager` 命令行参数

kube-controller-manager 命令行参数 `--enable-taint-manager` 已被弃用，
将在 Kubernetes v1.27 中被移除。
该参数支持的特性[基于污点的驱逐](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions)已被默认启用，
且在标志被移除时也将继续被隐式启用。

<!--
### Removal of `--pod-eviction-timeout` command line argument

The deprecated command line argument `--pod-eviction-timeout` will be removed from the
kube-controller-manager.

-->
### 移除 `--pod-eviction-timeout` 命令行参数

弃用的命令行参数 `--pod-eviction-timeout` 将被从 kube-controller-manager 中移除。

<!--
### Removal of the `CSI Migration` feature gate

The [CSI migration](https://github.com/kubernetes/enhancements/issues/625)
programme allows moving from in-tree volume plugins to out-of-tree CSI drivers.
CSI migration is generally available since Kubernetes v1.16, and the associated
`CSIMigration` feature gate will be removed in v1.27.
-->
### 移除 `CSI Migration` 特性门控

[CSI migration](https://github.com/kubernetes/enhancements/issues/625)
程序允许从树内卷插件移动到树外 CSI 驱动程序。
CSI 迁移自 Kubernetes v1.16 起正式发布，关联的 `CSIMigration` 特性门控将在 v1.27 中被移除。

<!--
### Removal of `CSIInlineVolume` feature gate

The [CSI Ephemeral Volume](https://github.com/kubernetes/kubernetes/pull/111258)
feature allows CSI volumes to be specified directly in the pod specification for
ephemeral use cases. They can be used to inject arbitrary states, such as
configuration, secrets, identity, variables or similar information, directly
inside pods using a mounted volume. This feature graduated to GA in v1.25.
Hence, the feature gate `CSIInlineVolume` will be removed in the v1.27 release.
-->
### 移除 `CSIInlineVolume` 特性门控

[CSI Ephemeral Volume](https://github.com/kubernetes/kubernetes/pull/111258)
特性允许在 Pod 规约中直接指定 CSI 卷作为临时使用场景。这些 CSI 卷可用于使用挂载的卷直接在
Pod 内注入任意状态，例如配置、Secret、身份、变量或类似信息。
此特性在 v1.25 中进阶至正式发布。因此，此特性门控 `CSIInlineVolume` 将在 v1.27 版本中移除。

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
### 移除 `EphemeralContainers` 特性门控

[临时容器](/zh-cn/docs/concepts/workloads/pods/ephemeral-containers/)在 v1.25 中进阶至正式发布。
这些是具有临时持续周期的容器，在现有 Pod 的命名空间内执行。
临时容器通常由用户发起，以观察其他 Pod 和容器的状态进行故障排查和调试。
对于 Kubernetes v1.27，对临时容器的 API 支持被无条件启用；`EphemeralContainers` 特性门控将被移除。

<!--
### Removal of `LocalStorageCapacityIsolation` feature gate

The [Local Ephemeral Storage Capacity Isolation](https://github.com/kubernetes/kubernetes/pull/111513)
feature moved to GA in v1.25. The feature provides support for capacity isolation
of local ephemeral storage between pods, such as `emptyDir` volumes, so that a pod
can be hard limited in its consumption of shared resources. The kubelet will
evicting Pods if consumption of local ephemeral storage exceeds the configured limit.
The feature gate, `LocalStorageCapacityIsolation`, will be removed in the v1.27 release.
-->
### 移除 `LocalStorageCapacityIsolation` 特性门控

[Local Ephemeral Storage Capacity Isolation](https://github.com/kubernetes/kubernetes/pull/111513)
特性在 v1.25 中进阶至正式发布。此特性支持 `emptyDir` 卷这类 Pod 之间本地临时存储的容量隔离，
因此可以硬性限制 Pod 对共享资源的消耗。如果本地临时存储的消耗超过了配置的限制，kubelet 将驱逐 Pod。
特性门控 `LocalStorageCapacityIsolation` 将在 v1.27 版本中被移除。

<!--
### Removal of `NetworkPolicyEndPort` feature gate

The v1.25 release of Kubernetes promoted `endPort` in NetworkPolicy to GA.
NetworkPolicy providers that support the `endPort` field that can be used to
specify a range of ports to apply a NetworkPolicy. Previously, each NetworkPolicy
could only target a single port. So the feature gate `NetworkPolicyEndPort`
will be removed in this release.
-->
### 移除 `NetworkPolicyEndPort` 特性门控

Kubernetes v1.25 版本将 NetworkPolicy 中的 `endPort` 进阶至正式发布。
支持 `endPort` 字段的 NetworkPolicy 提供程序可用于指定一系列端口以应用 NetworkPolicy。
以前每个 NetworkPolicy 只能针对一个端口。因此，此特性门控 `NetworkPolicyEndPort` 将在此版本中被移除。

<!--
Please be aware that `endPort` field must be supported by the Network Policy
provider. If your provider does not support `endPort`, and this field is
specified in a Network Policy, the Network Policy will be created covering
only the port field (single port).
-->
请注意，`endPort` 字段必须得到 NetworkPolicy 提供程序的支持。
如果你的提供程序不支持 `endPort`，并且此字段在 NetworkPolicy 中指定，
则将创建仅涵盖端口字段（单个端口）的 NetworkPolicy。

<!--
### Removal of `StatefulSetMinReadySeconds` feature gate

For a pod that is part of a StatefulSet, Kubernetes can mark the Pod ready only
if Pod is available (and passing checks) for at least the period you specify in
[`minReadySeconds`](/docs/concepts/workloads/controllers/statefulset/#minimum-ready-seconds).
The feature became generally available in Kubernetes v1.25, and the `StatefulSetMinReadySeconds`
feature gate will be locked to true and removed in the v1.27 release.
-->
### 移除 `StatefulSetMinReadySeconds` 特性门控

对于作为 StatefulSet 一部分的 Pod，只有当 Pod 至少在
[`minReadySeconds`](/zh-cn/docs/concepts/workloads/controllers/statefulset/#minimum-ready-seconds)
中指定的持续期内可用（并通过检查）时，Kubernetes 才会将此 Pod 标记为只读。
该特性在 Kubernetes v1.25 中正式发布，`StatefulSetMinReadySeconds`
特性门控将锁定为 true，并在 v1.27 版本中被移除。

<!--
### Removal of `IdentifyPodOS` feature gate

You can specify the operating system for a Pod, and the feature support for that
is stable since the v1.25 release. The `IdentifyPodOS` feature gate will be
removed for Kubernetes v1.27.
-->
### 移除 `IdentifyPodOS` 特性门控

你可以为 Pod 指定操作系统，此项特性支持自 v1.25 版本进入稳定。
`IdentifyPodOS` 特性门控将在 Kubernetes v1.27 中被移除。

<!--
### Removal of `DaemonSetUpdateSurge` feature gate

The v1.25 release of Kubernetes also stabilised surge support for DaemonSet pods,
implemented in order to minimize DaemonSet downtime during rollouts.
The `DaemonSetUpdateSurge` feature gate will be removed in Kubernetes v1.27.
-->
### 移除 `DaemonSetUpdateSurge` 特性门控

Kubernetes v1.25 版本还稳定了对 DaemonSet Pod 的浪涌支持，
其实现是为了最大限度地减少部署期间 DaemonSet 的停机时间。
`DaemonSetUpdateSurge` 特性门控将在 Kubernetes v1.27 中被移除。

<!--
### Removal of `--container-runtime` command line argument
-->
### 移除 `--container-runtime` 命令行参数

<!--
The kubelet accepts a deprecated command line argument, `--container-runtime`, and the only
valid value would be `remote` after dockershim code is removed. Kubernetes v1.27 will remove
that argument, which has been deprecated since the v1.24 release.
-->
kubelet 接受一个已弃用的命令行参数 `--container-runtime`，
并且在移除 dockershim 代码后，唯一有效的值将是 `remote`。
Kubernetes v1.27 将移除该参数，该参数自 v1.24 版本以来已被弃用。

<!--
## Looking ahead

The official list of
[API removals](https://kubernetes.io/docs/reference/using-api/deprecation-guide/#v1-29)
planned for Kubernetes v1.29 includes:
-->
## 前瞻   {#looking-ahead}

Kubernetes 1.29 计划[移除的 API 官方列表](/zh-cn/docs/reference/using-api/deprecation-guide/#v1-29)包括：

<!--
- The `flowcontrol.apiserver.k8s.io/v1beta2` API version of FlowSchema and
  PriorityLevelConfiguration will no longer be served in v1.29.
-->
- FlowSchema 和 PriorityLevelConfiguration 的 `flowcontrol.apiserver.k8s.io/v1beta2`
  API 版本将不再在 v1.29 中提供。

<!--
## Want to know more?

Deprecations are announced in the Kubernetes release notes. You can see the
announcements of pending deprecations in the release notes for:
-->
## 了解更多   {#want-to-know-more}

Kubernetes 发行说明中宣告了弃用信息。你可以在以下版本的发行说明中看到待弃用的公告：

- [Kubernetes v1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)

- [Kubernetes v1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation)

- [Kubernetes v1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation)

- [Kubernetes v1.26](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.26.md#deprecation)

<!--
We will formally announce the deprecations that come with
[Kubernetes v1.27](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md#deprecation)
as part of the CHANGELOG for that release.
-->
我们将在
[Kubernetes v1.27](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md#deprecation)
的 CHANGELOG 中正式宣布该版本的弃用信息。

<!--
For information on the process of deprecation and removal, check out the official Kubernetes
[deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) document.
-->
有关弃用和移除流程信息，请查阅正式的
[Kubernetes 弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api)文档。
