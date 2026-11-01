---
layout: blog
title: "SELinux 卷标签变更进入 GA 阶段（以及 v1.37 中可能的影响）"
date: 2026-04-22T10:35:00-08:00
slug: breaking-changes-in-selinux-volume-labeling
author: >
  [Jan Šafránek](https://github.com/jsafrane) (Red Hat)、
  [Swathi Rao](https://github.com/SwathiR03) (Independent)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "SELinux Volume Label Changes goes GA (and likely implications in v1.37)"
date: 2026-04-22T10:35:00-08:00
slug: breaking-changes-in-selinux-volume-labeling
author: >
  [Jan Šafránek](https://github.com/jsafrane) (Red Hat)
  [Swathi Rao](https://github.com/SwathiR03) (Independent)
-->

<!--
If you run Kubernetes on Linux with SELinux in enforcing mode, plan ahead: a future release (anticipated to be v1.37) is
expected to turn the `SELinuxMount` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) on by default. This makes volume setup faster
for most workloads, but **it can break applications** that still depend on the older recursive relabeling
model in subtle ways (for example, sharing one volume between privileged and unprivileged Pods on the same node).
Kubernetes v1.36 is the right release to audit your cluster and fix or opt out of this change.
-->
如果你在 Linux 上运行带有 SELinux 强制模式的 Kubernetes，
请提前规划：未来某个版本（预计为 v1.37）预计将默认启用 `SELinuxMount`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
这会使大多数工作负载的卷设置更快，但**它可能会破坏**以微妙方式仍依赖于旧版递归重新标记模型的应用程序
（例如，在同一节点上的特权和非特权 Pod 之间共享一个卷）。
Kubernetes v1.36 是审计集群、修复或选择退出此更改的正确版本。

<!--
If your nodes do not use SELinux, nothing changes for you: the kubelet skips the whole
SELinux logic when SELinux is unavailable or disabled in the Linux kernel. You can skip this article completely.
-->
如果你的节点不使用 SELinux，则没有任何变化：
当 SELinux 在 Linux 内核中不可用或被禁用时，
kubelet 会跳过整个 SELinux 逻辑。你可以完全跳过本文。

<!--
This blog builds on the earlier work described in the
[Kubernetes 1.27: Efficient SELinux Relabeling (Beta)](https://kubernetes.io/blog/2023/04/18/kubernetes-1-27-efficient-selinux-relabeling-beta/)
post, where the `SELinuxMountReadWriteOncePod` feature gate was described. The problem to be addressed remains
the same, however, this blog extends that same approach to all volumes.
-->
本文建立在
[Kubernetes 1.27：高效的 SELinux 重新标记（Beta）](https://kubernetes.io/blog/2023/04/18/kubernetes-1-27-efficient-selinux-relabeling-beta/)
一文中描述的早期工作基础上，该文介绍了 `SELinuxMountReadWriteOncePod` 特性门控。
需要解决的问题保持不变，但是本文将相同的方法扩展到所有卷。

<!--
## The problem
-->
## 问题描述

<!--
Linux systems with Security Enhanced Linux (SELinux) enabled use labels attached to objects
(for example, files and network sockets) to make access control decisions.
Historically, the container runtime applies SELinux labels to a Pod and all its volumes. Kubernetes only passes the SELinux label from a Pod's `securityContext` fields
to the container runtime.
-->
启用了安全增强 Linux（SELinux）的 Linux 系统使用附加到对象（例如文件和网络套接字）
上的标签来进行访问控制决策。
历史上，容器运行时将 SELinux 标签应用到 Pod 及其所有卷。
Kubernetes 仅将 Pod 的 `securityContext` 字段中的 SELinux 标签传递给容器运行时。

<!--
The container runtime then recursively changes the SELinux label on all files that
are visible to the Pod's containers. This can be time-consuming if there are
many files on the volume, especially when the volume is on a remote filesystem.
-->
然后容器运行时递归地更改对 Pod 容器可见的所有文件上的 SELinux 标签。
如果卷上有许多文件，这可能非常耗时，尤其是当卷位于远程文件系统上时。

{{< caution >}}
<!--
If a container uses `subPath` of a volume, only that `subPath` of the whole
volume is relabeled. This allows two Pods that have two different SELinux labels
to use the same volume, as long as they use different subpaths of it.
-->
如果容器使用卷的 `subPath`，则只重新标记整个卷的该 `subPath`。
这允许具有两个不同 SELinux 标签的两个 Pod 使用同一个卷，只要它们使用不同的 `subpath`。
{{< /caution >}}

<!--
If a Pod does not have any SELinux label assigned in the Kubernetes API, the
container runtime assigns a unique random label, so a process that potentially
escapes the container boundary cannot access data of any other container on the
host. The container runtime still recursively relabels all Pod volumes with this
random SELinux label.
-->
如果 Pod 在 Kubernetes API 中没有分配任何 SELinux 标签，
容器运行时会分配一个唯一的随机标签，
这样可能逃逸容器边界的进程无法访问主机上任何其他容器中的数据。
容器运行时仍会用此随机 SELinux 标签递归地重新标记所有 Pod 卷。

<!--
## What Kubernetes is improving
-->
## Kubernetes 的改进

<!--
Where the stack supports it, the kubelet can mount the volume with `-o context=<label>` so the kernel
applies the correct label for all inodes on that mount without a recursive inode traversal. That path is
gated by feature flags and requires, among other things, that the Pod expose enough of an SELinux
label (for example `spec.securityContext.seLinuxOptions.level`) and that the volume driver opts in (for CSI,
CSIDriver field `spec.seLinuxMount: true`).
-->
在堆栈支持的情况下，kubelet 可以使用 `-o context=<label>` 挂载卷，
以便内核为该挂载上的所有 inode 应用正确的标签，而无需递归遍历 inode。
该路径受特性门控限制，并且需要（除其他外）Pod 暴露足够的 SELinux
标签（例如 `spec.securityContext.seLinuxOptions.level`），
并且卷驱动程序选择加入（对于 CSI，设置 CSIDriver 字段 `spec.seLinuxMount: true`）。

<!--
The project rolled this out in phases:
-->
项目分阶段推出此功能：

<!--
- ReadWriteOncePod volumes were handled under the `SELinuxMountReadWriteOncePod` feature gate, on by default since v1.28 and GA in v1.36.
- Broader coverage was handled under the `SELinuxMount` flag, paired with the `spec.securityContext.seLinuxChangePolicy` field on Pods.
-->
- ReadWriteOncePod 卷在 `SELinuxMountReadWriteOncePod` 特性门控下处理，
  自 v1.28 起默认启用，在 v1.36 中达到 GA。
- 更广泛的覆盖范围在 `SELinuxMount` 标志下处理，与 Pod 上的
  `spec.securityContext.seLinuxChangePolicy` 字段配合使用。

<!-- a heavily edited copy from the previous blog + docs in https://kubernetes.io/docs/tasks/configure-pod-container/security-context/ -->

<!--
If a Pod and its volume meet **all** of the following conditions, Kubernetes will
mount the volume directly with the right SELinux label. Such a mount will happen
in a constant time and the container runtime will not need to recursively
relabel any files on it. For such a mount to happen:
-->
如果 Pod 及其卷满足**所有**以下条件，Kubernetes 将直接以正确的 SELinux 标签挂载卷。
这种挂载将在恒定时间内完成，容器运行时无需递归地重新标记其上的任何文件。
要进行此类挂载，需要满足以下条件：

<!--
1. The operating system must support SELinux. Without SELinux support detected, the kubelet and the container runtime do not
   do anything with regard to SELinux.
-->
1. 操作系统必须支持 SELinux。在未检测到 SELinux 支持的情况下，
   kubelet 和容器运行时不会对 SELinux 执行任何操作。

<!--
1. The [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
   `SELinuxMountReadWriteOncePod` must be enabled.
   If you're running Kubernetes v1.36, the feature is enabled unconditionally.
-->
1. [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
   `SELinuxMountReadWriteOncePod` 必须启用。
   如果你运行的是 Kubernetes v1.36，则该特性无条件启用。

<!--
1. The Pod must use a PersistentVolumeClaim with applicable `accessModes`:
   * Either the volume has `accessModes: ["ReadWriteOncePod"]`
   * or the volume can use any other access mode(s), provided that the feature gates
     `SELinuxChangePolicy` and `SELinuxMount` are both enabled
     **and** the Pod has `spec.securityContext.seLinuxChangePolicy` set to nil (default) or as `MountOption`.

   The feature gate `SELinuxMount` is Beta and disabled by default in Kubernetes 1.36.
   All other SELinux-related feature gates are now General Availability (GA).

   With any of these feature gates disabled, SELinux labels will always be
   applied by the container runtime via recursively traversing through the volume
   (or its subPaths).
-->
1. Pod 必须使用具有适用 `accessModes` 的 PersistentVolumeClaim：
   * 要么卷具有 `accessModes: ["ReadWriteOncePod"]`
   * 要么卷可以使用任何其他访问模式，但需要满足以下条件：
     特性门控 `SELinuxChangePolicy` 和 `SELinuxMount` 都已启用，
     **并且** Pod 的 `spec.securityContext.seLinuxChangePolicy` 设置为 nil（默认）或 `MountOption`。

   特性门控 `SELinuxMount` 在 Kubernetes 1.36 中为 Beta 阶段且默认禁用。
   所有其他 SELinux 相关的特性门控现在都已达到正式发布（GA）。

   如果其中任何特性门控被禁用，SELinux 标签将始终通过递归遍历卷（或其 `subPath`）由容器运行时应用。

<!--
1. The Pod must have at least `seLinuxOptions.level` assigned in its
   [security context](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
   or all containers in that Pod must have it set in their container-level [security contexts](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1).
   Kubernetes will read the default `user`, `role` and `type` from the operating
   system defaults (typically `system_u`, `system_r` and `container_t`).

   Without Kubernetes knowing at least the SELinux `level`, the container
   runtime will assign a random level after the volumes are mounted. The
   container runtime will still relabel the volumes recursively in that case.
-->
1. Pod 必须在其
   [安全上下文](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
   中至少分配了 `seLinuxOptions.level`，或者该 Pod
   中的所有容器都必须在容器级别的[安全上下文](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)中设置它。
   Kubernetes 将从操作系统默认值（通常为 `system_u`、`system_r` 和 `container_t`）
   中读取默认的 `user`、`role` 和 `type`。

   如果 Kubernetes 不知道 SELinux 的“级别”，容器运行时将在卷挂载后分配一个随机级别。
   在这种情况下，容器运行时仍会递归地重新标记卷。

<!--
1. The volume plugin or the CSI driver responsible for the volume supports
   mounting with SELinux mount options.

   These in-tree volume plugins support mounting with SELinux mount options:
   `fc` and `iscsi`.

   CSI drivers that support mounting with SELinux mount options must declare this capability in their
   [CSIDriver](/docs/reference/kubernetes-api/config-and-storage-resources/csi-driver-v1/)
   instance by setting the `seLinuxMount` field.

   Volumes managed by other volume plugins or CSI drivers that do not
   set `seLinuxMount: true` will be recursively relabeled by the container
   runtime.
-->
1. 负责该卷的卷插件或 CSI 驱动程序支持使用 SELinux 挂载选项进行挂载。

   这些树内卷插件支持使用 SELinux 挂载选项进行挂载：`fc` 和 `iscsi`。

   支持使用 SELinux 挂载选项进行挂载的 CSI 驱动程序必须通过设置 `seLinuxMount` 字段在其
   [CSIDriver](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/csi-driver-v1/)
   实例中声明此功能。

   由其他卷插件或未设置 `seLinuxMount: true` 的 CSI
   驱动程序管理的卷将由容器运行时递归地重新标记。

<!--
## The breaking change
-->
## 破坏性变更

<!--
The `SELinuxMount` feature gate changes what volumes can be shared among multiple Pods in a subtle way.
-->
`SELinuxMount` 特性门控以微妙的方式改变了多个 Pod 之间可以共享的卷。

<!--
Both of these cases work with recursive relabeling:
-->
以下两种情况在递归重新标记下都能正常工作：

<!--
1. Two Pods with different SELinux labels share the same volume, but each of them uses a different `subPath` to the volume.
-->
1. 具有不同 SELinux 标签的两个 Pod 共享同一个卷，
   但它们各自使用不同的 `subPath` 访问该卷。

<!--
1. A privileged Pod and an unprivileged Pod share the same volume.
-->
1. 特权 Pod 和非特权 Pod 共享同一个卷。

<!--
The above scenarios will not work with modern, target behavior for Kubernetes mounting when SELinux is active. Instead, one of these Pods will be stuck in `ContainerCreating` until the other Pod is terminated.
-->
当 SELinux 处于活动状态时，上述场景将不适用于 Kubernetes 挂载的现代目标行为。
相反，其中一个 Pod 将停留在 `ContainerCreating` 状态，直到另一个 Pod 被终止。

<!--
The first case is very niche and hasn't been seen in practice.
Although the second case is still quite rare, this setup has been observed in applications.
Kubernetes v1.36 offers metrics and events to identify these Pods and allows cluster administrators to opt out of the
mount option through the Pod field `spec.securityContext.seLinuxChangePolicy`.
-->
第一种情况非常小众，在实践中从未见过。
虽然第二种情况仍然相当罕见，但已在应用程序中观察到这种设置。
Kubernetes v1.36 提供了指标和事件来识别这些 Pod，并允许集群管理员通过
Pod 字段 `spec.securityContext.seLinuxChangePolicy` 选择退出挂载选项。

### `seLinuxChangePolicy`

<!--
The new Pod field `spec.securityContext.seLinuxChangePolicy` specifies how the SELinux label is applied to all Pod volumes.
In Kubernetes v1.36, this field is part of the stable Pod API.
-->
新的 Pod 字段 `spec.securityContext.seLinuxChangePolicy`
指定如何将 SELinux 标签应用到所有 Pod 卷。
在 Kubernetes v1.36 中，此字段是稳定 Pod API 的一部分。

<!--
There are three choices available:
-->
有三个可用的选项：

<!--
_field not set_ (default)
: In Kubernetes v1.36, the behavior depends on whether the `SELinuxMount` feature gate is enabled. By default that feature gate is not enabled, and the SELinux label is applied recursively. If you enable that feature gate in your cluster, and [all other conditions](#what-kubernetes-is-improving) are met, labelling will be applied using the mount option.
-->
**字段未设置**（默认）
: 在 Kubernetes v1.36 中，行为取决于 `SELinuxMount` 特性门控是否启用。
  默认情况下，该特性门控未启用，SELinux 标签递归应用。
  如果你在集群中启用了该特性门控，并且满足[所有其他条件](#what-kubernetes-is-improving)，
  则将使用挂载选项应用标签。

<!--
`Recursive`
: the SELinux label is applied recursively. This opts out from using the mount option.
-->
`Recursive`
: SELinux 标签递归应用。这选择退出使用挂载选项。

<!--
`MountOption`
: the SELinux label is applied using the mount option, if [all other conditions](#what-kubernetes-is-improving) are met.
  This choice is available only when the `SELinuxMount` feature gate is enabled.
-->
`MountOption`
: 如果满足[所有其他条件](#what-kubernetes-is-improving)，则使用挂载选项应用 SELinux 标签。
  此选项仅在 `SELinuxMount` 特性门控启用时可用。

<!--
## SELinux warning controller (optional) {#selinux-warning-controller}
-->
## SELinux 警告控制器（可选） {#selinux-warning-controller}

<!--
Kubernetes v1.36 provides a new controller within the control plane, `selinux-warning-controller`.
This controller runs within the kube-controller-manager controller.
To use it, you pass `--controllers=*,selinux-warning-controller` on the kube-controller-manager command line;
you also must not have explicitly overridden the `SELinuxChangePolicy` feature gate to be disabled.
-->
Kubernetes v1.36 在控制平面中提供了一个新的控制器 `selinux-warning-controller`。
此控制器在 kube-controller-manager 控制器内运行。
要使用它，你需要在 kube-controller-manager 命令行上传递 `--controllers=*,selinux-warning-controller`；
你还不能明确地将 `SELinuxChangePolicy` 特性门控覆盖为禁用。

<!--
The controller watches all Pods in the cluster and emits an Event when it finds two Pods that share the same
volume in a way that is not compatible with the `SELinuxMount` feature gate.
All such conflicting Pods will receive an event, such as:
-->
控制器监视集群中的所有 Pod，当发现两个 Pod 以与 `SELinuxMount`
特性门控不兼容的方式共享同一卷时会发出事件。
所有此类冲突的 Pod 将收到一个事件，例如：

```console
SELinuxLabel "system_u:system_r:container_t:s0:c98,c99" conflicts with pod my-other-pod that uses the same volume as this pod with SELinuxLabel "system_u:system_r:container_t:s0:c0,c1". If both pods land on the same node, only one of them may access the volume.
```

当冲突的 Pod 运行在不同名字空间时，实际的 Pod 名称可能会被隐藏，
以防止跨名字空间边界泄露信息。

<!--
The controller reports such an event even when these Pods don't run on the same node, to make sure all Pods work
regardless of the Kubernetes scheduler decision. They could run on the same node next time.
-->
即使这些 Pod 不在同一节点上运行，控制器也会报告此类事件，
以确保所有 Pod 都能正常工作，而不考虑 Kubernetes 调度器的决定。
它们下次可能会在同一节点上运行。

<!--
In addition, the controller emits the metric `selinux_warning_controller_selinux_volume_conflict` that lists all current conflicts among Pods.
The metric has labels that identify the conflicting Pods and their SELinux labels, such as:
-->
此外，控制器发出指标 `selinux_warning_controller_selinux_volume_conflict`，
列出 Pod 之间所有当前的冲突。
该指标具有用于识别冲突 Pod 及其 SELinux 标签的标签，例如：

```
selinux_warning_controller_selinux_volume_conflict{pod1_name="my-other-pod",pod1_namespace="default",pod1_value="system_u:object_r:container_file_t:s0:c0,c1",pod2_name="my-pod",pod2_namespace="default",pod2_value="system_u:object_r:container_file_t:s0:c0,c2",property="SELinuxLabel"} 1
```

<!--
There is a security consequence from enabling this opt-in controller: it may reveal namespace names, which are always present in the metric.
The Kubernetes project assumes only cluster administrators can access kube-controller-manager metrics.
-->
启用此选择性加入控制器存在安全后果：它可能泄露名字空间名称，这些名称始终存在于指标中。
Kubernetes 项目假定只有集群管理员可以访问 kube-controller-manager 指标。

<!--
## Suggested upgrade path
-->
## 建议的升级路径

<!--
To ensure a smooth upgrade path from v1.36 to a release with `SELinuxMount` enabled (anticipated to be v1.37), we suggest you follow these steps:
-->
为确保从 v1.36 平滑升级到启用 `SELinuxMount` 的版本（预计为 v1.37），
我们建议你按照以下步骤操作：

<!--
1. Enable selinux-warning-controller in the kube-controller-manager.
-->
1. 在 kube-controller-manager 中启用 selinux-warning-controller。

<!--
1. Check the `selinux_warning_controller_selinux_volume_conflict` metric. It shows all *potential* conflicts between Pods.
   For each conflicting Pod (Deployment, StatefulSet, etc.), either apply the opt-out (set Pod's `spec.securityContext.seLinuxChangePolicy: Recursive`)
   or re-architect the application to remove such a conflict. For example, do your Pods really need to run as privileged?
-->
1. 检查 `selinux_warning_controller_selinux_volume_conflict` 指标。
   它显示 Pod 之间的所有**潜在**冲突。
   对于每个冲突的 Pod（Deployment、StatefulSet 等），
   要么应用选择退出（设置 Pod 的 `spec.securityContext.seLinuxChangePolicy: Recursive`），
   要么重新设计应用程序以消除此类冲突。例如，你的 Pod 真的需要以特权身份运行吗？

<!--
1. Check the `volume_manager_selinux_volume_context_mismatch_warnings_total` metric. This metric is emitted by the kubelet when it actually
   starts a Pod that runs when `SELinuxMount` is disabled, but such a Pod won't start when `SELinuxMount` is enabled.
   This metric lists the number of Pods that will experience a true conflict. Unfortunately, this metric does not expose the exact Pod name as a label.
   The full Pod name is available only in the `selinux_warning_controller_selinux_volume_conflict` metric.
-->
1. 检查 `volume_manager_selinux_volume_context_mismatch_warnings_total` 指标。
   当实际启动在 `SELinuxMount` 被禁用时运行的 Pod 时，此指标由 kubelet 发出，
   但此类 Pod 在 `SELinuxMount` 启用时将无法启动。
   此指标列出了将经历真正冲突的 Pod 数量。不幸的是，此指标不会将确切的 Pod 名称公开为标签。
   完整的 Pod 名称仅在 `selinux_warning_controller_selinux_volume_conflict` 指标中可用。

<!--
1. Once both metrics have been accounted for, upgrade to a Kubernetes version that has `SELinuxMount` enabled.
-->
1. 一旦两个指标都被考虑在内，升级到启用了 `SELinuxMount` 的 Kubernetes 版本。

<!--
Consider using a [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/),
a [mutating webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks_),
or a policy engine like [Kyverno](https://github.com/kyverno/kyverno/) or [Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
to apply the opt-out to all Pods in a namespace or across the entire cluster.
-->
考虑使用 [MutatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/mutating-admission-policy/)、
[变更性 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks_)
或策略引擎如 [Kyverno](https://github.com/kyverno/kyverno/)
或 [Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
来将选择退出应用到名字空间或整个集群中的所有 Pod。

<!--
When `SELinuxMount` is enabled, the kubelet will emit the metric `volume_manager_selinux_volume_context_mismatch_errors_total` with the number of
Pods that could not start because their SELinux label conflicts with an existing Pod that uses the same volume.
The exact Pod names should still be available in the `selinux_warning_controller_selinux_volume_conflict` metric,
if the selinux-warning-controller is enabled.
-->
当 `SELinuxMount` 启用时，kubelet 将发出指标
`volume_manager_selinux_volume_context_mismatch_errors_total`，
其中包含因 SELinux 标签与使用同一卷的现有 Pod 冲突而无法启动的 Pod 数量。
如果 selinux-warning-controller 被启用，确切的 Pod 名称仍应在
`selinux_warning_controller_selinux_volume_conflict` 指标中可用。

<!--
## Further reading
-->
## 进一步阅读

<!--
- KEP: [Speed up SELinux volume relabeling using mounts](https://kep.k8s.io/1710)
- [SELinux Volume Relabeling Feature Gates](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#feature-gates)
- [Story 3: cluster upgrade](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1710-selinux-relabeling#story-3-cluster-upgrade)
- [Configure a security context for a Pod](/docs/tasks/configure-pod-container/security-context/) — Efficient SELinux volume relabeling and selinux-warning-controller
-->
- KEP：[使用挂载加速 SELinux 卷重新标记](https://kep.k8s.io/1710)
- [SELinux 卷重新标记特性门控](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#feature-gates)
- [故事 3：集群升级](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1710-selinux-relabeling#story-3-cluster-upgrade)
- [为 Pod 配置安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/) — 高效的 SELinux 卷重新标记和 selinux-warning-controller

<!--
## Acknowledgements
-->
## 致谢

<!--
If you run into issues, have feedback, or want to contribute, find us
on the Kubernetes Slack in `#sig-node` and `#sig-storage` or join a
[SIG Node](https://github.com/kubernetes/community/tree/main/sig-node) or [SIG Storage](https://github.com/kubernetes/community/tree/main/sig-storage) meetings.
-->
如果你遇到问题、有反馈或想要贡献，请在 Kubernetes Slack 的
`#sig-node` 和 `#sig-storage` 中找到我们，或加入
[SIG Node](https://github.com/kubernetes/community/tree/main/sig-node) 或
[SIG Storage](https://github.com/kubernetes/community/tree/main/sig-storage) 会议。
