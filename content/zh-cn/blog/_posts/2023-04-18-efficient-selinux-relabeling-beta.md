---
layout: blog
title: "Kubernetes 1.27：高效的 SELinux 卷重新标记（Beta 版）"
date: 2023-04-18T10:00:00-08:00
slug: kubernetes-1-27-efficient-selinux-relabeling-beta
---

<!--
layout: blog
title: "Kubernetes 1.27: Efficient SELinux volume relabeling (Beta)"
date: 2023-04-18T10:00:00-08:00
slug: kubernetes-1-27-efficient-selinux-relabeling-beta
-->

**作者**：Jan Šafránek (Red Hat)
<!--
**Author:** Jan Šafránek (Red Hat)
-->

**译者**：Wilson Wu (DaoCloud)

<!--
## The problem
-->
## 问题 {#the-problem}

<!--
On Linux with Security-Enhanced Linux (SELinux) enabled, it's traditionally the container runtime that applies SELinux labels to a Pod and all its volumes. Kubernetes only passes the SELinux label from a Pod's `securityContext` fields to the container runtime.
-->
在启用了 Security-Enhancled Linux（SELinux）系统上，传统做法是让容器运行时负责为
Pod 及所有卷应用 SELinux 标签。
Kubernetes 仅将 SELinux 标签从 Pod 的 `securityContext` 字段传递给容器运行时。

<!--
The container runtime then recursively changes SELinux label on all files that are visible to the Pod's containers. This can be time-consuming if there are many files on the volume, especially when the volume is on a remote filesystem.
-->
然后，容器运行时以递归的方式更改 Pod 容器可见的所有文件上的 SELinux 标签。
如果卷上有许多文件，这一过程可能会非常耗时，尤其是当卷位于远程文件系统上时。

{{% alert title="Note" color="info" %}}
<!--
If a container uses `subPath` of a volume, only that `subPath` of the whole volume is relabeled. This allows two pods that have two different SELinux labels to use the same volume, as long as they use different subpaths of it.
-->
如果容器使用卷的 `subPath`，则系统仅重新标记整个卷的 `subPath`。
这样，使用不同 SELinux 标签的两个 Pod 可以使用同一卷，只要它们使用该卷的不同子路径即可。
{{% /alert %}}

<!--
If a Pod does not have any SELinux label assigned in Kubernetes API, the container runtime assigns a unique random one, so a process that potentially escapes the container boundary cannot access data of any other container on the host. The container runtime still recursively relabels all pod volumes with this random SELinux label.
-->
如果 Pod 没有从 Kubernetes API 中获得任何 SELinux 标签，则容器运行时会分配一个唯一的随机标签，
因此可能逃离容器边界的进程将无法访问主机上任何其他容器的数据。
容器运行时仍然使用此随机 SELinux 标签递归地重新标记所有 Pod 卷。

<!--
## Improvement using mount options
-->
## 使用挂载选项进行改进 {#improvement-using-mount-options}

<!--
If a Pod and its volume meet **all** of the following conditions, Kubernetes will _mount_ the volume directly with the right SELinux label. Such mount will happen in a constant time and the container runtime will not need to recursively relabel any files on it.
-->
如果 Pod 及其卷满足以下所有条件，Kubernetes 将直接使用正确的 SELinux 标签挂载该卷。
这种挂载将在确定时间内完成，容器运行时不需要递归地重新标记其上的任何文件。

<!--
1. The operating system must support SELinux.

   Without SELinux support detected, kubelet and the container runtime do not do anything with regard to SELinux.
-->
1. 操作系统必须支持 SELinux。

   如果没有检测到 SELinux 支持，kubelet 和容器运行时不会对 SELinux 执行任何操作。

<!--
1. The [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) `ReadWriteOncePod` and `SELinuxMountReadWriteOncePod` must be enabled. These feature gates are Beta in Kubernetes 1.27 and Alpha in 1.25.

   With any of these feature gates disabled, SELinux labels will be always applied by the container runtime by a recursive walk through the volume (or its subPaths).
-->
2. 必须启用[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
   `ReadWriteOncePod` 和 `SELinuxMountReadWriteOncePod`。这些特性门控在 Kubernetes 1.27 中是 Beta 版，在 1.25 中是 Alpha 版。

   禁用这些功能中任何一个后，SELinux 标签将始终由容器运行时通过递归遍历卷（或其 subPath）来应用。

<!--
1. The Pod must have at least `seLinuxOptions.level` assigned in its [Pod Security Context](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) or all Pod containers must have it set in their [Security Contexts](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1). Kubernetes will read the default `user`, `role` and `type` from the operating system defaults (typically `system_u`, `system_r` and `container_t`).

   Without Kubernetes knowing at least the SELinux `level`, the container runtime will assign a random one _after_ the volumes are mounted. The container runtime will still relabel the volumes recursively in that case.
-->
3. Pod 必须在其 [Pod 安全上下文](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)中至少设置
   `seLinuxOptions.level`，或者所有 Pod 容器必须在[安全上下文](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)中对其进行设置。
   否则 Kubernetes 将从操作系统默认值（通常是 `system_u`、`system_r` 和 `container_t`）中读取默认的 `user`、`role` 和 `type`。

   如果 Kubernetes 不了解任何 SELinux `level`，容器运行时将在卷挂载**后**为其分配一个随机级别。
   在这种情况下，容器运行时仍会递归地对卷进行重新标记。

<!--
1. The volume must be a Persistent Volume with [Access Mode](/docs/concepts/storage/persistent-volumes/#access-modes) `ReadWriteOncePod`.

   This is a limitation of the initial implementation. As described above, two Pods can have a different SELinux label and still use the same volume, as long as they use a different `subPath` of it. This use case is not possible when the volumes are _mounted_ with the SELinux label, because the whole volume is mounted and most filesystems don't support mounting a single volume multiple times with multiple SELinux labels.

   If running two Pods with two different SELinux contexts and using different `subPaths` of the same volume is necessary in your deployments, please comment in the [KEP](https://github.com/kubernetes/enhancements/issues/1710) issue (or upvote any existing comment - it's best not to duplicate). Such pods may not run when the feature is extended to cover all volume access modes.
-->
4. 存储卷必须是[访问模式](/zh-cn/docs/concepts/storage/persistent-volumes/#access-modes) 
   为 `ReadWriteOncePod` 的持久卷。

   这是最初的实现的限制。如上所述，两个 Pod 可以具有不同的 SELinux 标签，但仍然使用相同的卷，
   只要它们使用不同的 `subPath` 即可。对于**已挂载的**带有 SELinux 标签的卷，此场景是无法支持的，
   因为整个卷已挂载，并且大多数文件系统不支持使用不同的 SELinux 标签多次挂载同一个卷。

   如果在你的环境中需要使用两个不同的 SELinux 上下文运行两个 Pod 并使用同一卷的不同 `subPath`，
   请在 [KEP](https://github.com/kubernetes/enhancements/issues/1710) 问题中发表评论（或对任何现有评论进行投票 - 最好不要重复）。
   当此特性扩展到覆盖所有卷访问模式时，这类 Pod 可能无法运行。

<!--
1. The volume plugin or the CSI driver responsible for the volume supports mounting with SELinux mount options.

   These in-tree volume plugins support mounting with SELinux mount options: `fc`, `iscsi`, and `rbd`.

   CSI drivers that support mounting with SELinux mount options must announce that in their [CSIDriver](/docs/reference/kubernetes-api/config-and-storage-resources/csi-driver-v1/) instance by setting `seLinuxMount` field.

   Volumes managed by other volume plugins or CSI drivers that don't set `seLinuxMount: true` will be recursively relabelled by the container runtime.
-->
5. 卷插件或负责卷的 CSI 驱动程序支持使用 SELinux 挂载选项进行挂载。

   这些树内卷插件支持使用 SELinux 挂载选项进行挂载：`fc`、`iscsi` 和 `rbd`。

   支持使用 SELinux 挂载选项挂载的 CSI 驱动程序必须通过设置 `seLinuxMount`
   字段在其 [CSIDriver](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/csi-driver-v1/) 实例中声明这一点。

   由其他未设置 `seLinuxMount: true` 的卷插件或 CSI 驱动程序管理的卷将由容器运行时递归地重新标记。

<!--
### Mounting with SELinux context
-->
### 使用 SELinux 上下文挂载 {#mounting-with-selinux-context}

<!--
When all aforementioned conditions are met, kubelet will pass `-o context=<SELinux label>` mount option to the volume plugin or CSI driver. CSI driver vendors must ensure that this mount option is supported by their CSI driver and, if necessary, the CSI driver appends other mount options that are needed for `-o context` to work.
-->
当满足所有上述条件时，kubelet 会将 `-o context=<SELinux label>` 挂载选项传递给卷插件或 CSI 驱动程序。
CSI 驱动程序提供者必须确保其 CSI 驱动程序支持此安装选项，并且如有必要，CSI 驱动程序要附加
`-o context` 所需的其他安装选项。

<!--
For example, NFS may need `-o context=<SELinux label>,nosharecache`, so each volume mounted from the same NFS server can have a different SELinux label value. Similarly, CIFS may need `-o context=<SELinux label>,nosharesock`.
-->
例如，NFS 可能需要 `-o context=<SELinux label>,nosharecache`，这样来自同一
NFS 服务器的多个卷被挂载时可以具有不同的 SELinux 标签值。
类似地，CIFS 可能需要 `-o context=<SELinux label>,nosharesock`。

<!--
It's up to the CSI driver vendor to test their CSI driver in a SELinux enabled environment before setting `seLinuxMount: true` in the CSIDriver instance.
-->
在 CSIDriver 实例中设置 `seLinuxMount: true` 之前，CSI 驱动程序提供者需要在启用 SELinux
的环境中测试其 CSI 驱动程序。

<!--
## How can I learn more?
-->
## 如何了解更多？ {#how-can-i-learn-more}

<!--
SELinux in containers: see excellent [visual SELinux guide](https://opensource.com/business/13/11/selinux-policy-guide) by Daniel J Walsh. Note that the guide is older than Kubernetes, it describes *Multi-Category Security* (MCS) mode using virtual machines as an example, however, a similar concept is used for containers.
-->
容器中的 SELinux：请参阅 Daniel J Walsh 撰写的[可视化 SELinux 指南（英文）](https://opensource.com/business/13/11/selinux-policy-guide)。
请注意，该指南早于 Kubernetes，它以虚拟机为例描述了**多类别安全**（MCS）模式，但是，类似的概念也适用于容器。

<!--
See a series of blog posts for details how exactly SELinux is applied to containers by container runtimes:
-->
请参阅以下系列博客文章，详细了解容器运行时如何将 SELinux 应用于容器：

<!--
* [How SELinux separates containers using Multi-Level Security](https://www.redhat.com/en/blog/how-selinux-separates-containers-using-multi-level-security)
* [Why you should be using Multi-Category Security for your Linux containers](https://www.redhat.com/en/blog/why-you-should-be-using-multi-category-security-your-linux-containers)
-->
* [SELinux 如何使用多级安全性分离容器](https://www.redhat.com/en/blog/how-selinux-separates-containers-using-multi-level-security)
* [为什么应该为 Linux 容器使用多类别安全性](https://www.redhat.com/en/blog/why-you-should-be-using-multi-category-security-your-linux-containers)

<!--
Read the KEP: [Speed up SELinux volume relabeling using mounts](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1710-selinux-relabeling)
-->
阅读 KEP：[使用挂载加速 SELinux 卷重新标记](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1710-selinux-relabeling)
