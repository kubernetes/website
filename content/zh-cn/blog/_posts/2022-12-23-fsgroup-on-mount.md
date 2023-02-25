---
layout: blog
title: "Kubernetes 1.26: 支持在挂载时将 Pod fsGroup 传递给 CSI 驱动程序"
date: 2022-12-23
slug: kubernetes-12-06-fsgroup-on-mount
---

<!--
layout: blog
title: "Kubernetes 1.26: Support for Passing Pod fsGroup to CSI Drivers At Mount Time"
date: 2022-12-23
slug: kubernetes-12-06-fsgroup-on-mount
-->

<!--
**Authors:** Fabio Bertinatto (Red Hat), Hemant Kumar (Red Hat)
-->
**作者：** Fabio Bertinatto (Red Hat), Hemant Kumar (Red Hat)

**译者：** Xin Li (DaoCloud)

<!--
Delegation of `fsGroup` to CSI drivers was first introduced as alpha in Kubernetes 1.22,
and graduated to beta in Kubernetes 1.25.
For Kubernetes 1.26, we are happy to announce that this feature has graduated to
General Availability (GA). 

In this release, if you specify a `fsGroup` in the
[security context](/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod),
for a (Linux) Pod, all processes in the pod's containers are part of the additional group
that you specified.
-->
将 `fsGroup` 委托给 CSI 驱动程序管理首先在 Kubernetes 1.22 中作为 Alpha 特性引入，
并在 Kubernetes 1.25 中进阶至 Beta 状态。
对于 Kubernetes 1.26，我们很高兴地宣布此特性已进阶至正式发布（GA）状态。

在此版本中，如果你在 Pod（Linux）
的[安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod)中指定一个 `fsGroup`，
则该 Pod 容器中的所有进程都是该附加组的一部分。

<!--
In previous Kubernetes releases, the kubelet would *always* apply the
`fsGroup` ownership and permission changes to files in the volume according to the policy
you specified in the Pod's `.spec.securityContext.fsGroupChangePolicy` field.

Starting with Kubernetes 1.26, CSI drivers have the option to apply the `fsGroup` settings during 
volume mount time, which frees the kubelet from changing the permissions of files and directories
in those volumes.
-->
在以前的 Kubernetes 版本中，kubelet **总是**根据 Pod 的
`.spec.securityContext.fsGroupChangePolicy` 字段中指定的策略，
将 `fsGroup` 属主关系和权限的更改应用于卷中的文件。

从 Kubernetes 1.26 开始，CSI 驱动程序可以选择在卷挂载期间应用 `fsGroup` 设置，
这使 kubelet 无需更改这些卷中文件和目录的权限。

<!--
## How does it work?

CSI drivers that support this feature should advertise the
[`VOLUME_MOUNT_GROUP`](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetcapabilities) node capability.
-->
## 它是如何工作的？

支持此功能的 CSI 驱动程序应通告其 `VOLUME_MOUNT_GROUP` 节点能力。

<!--
After recognizing this information, the kubelet passes the `fsGroup` information to
the CSI driver during pod startup. This is done through the
[`NodeStageVolumeRequest`](https://github.com/container-storage-interface/spec/blob/v1.7.0/spec.md#nodestagevolume) and
[`NodePublishVolumeRequest`](https://github.com/container-storage-interface/spec/blob/v1.7.0/spec.md#nodepublishvolume)
CSI calls.

Consequently, the CSI driver is expected to apply the `fsGroup` to the files in the volume using a
_mount option_. As an example, [Azure File CSIDriver](https://github.com/kubernetes-sigs/azurefile-csi-driver) utilizes the `gid` mount option to map
the `fsGroup` information to all the files in the volume.
-->
kubelet 识别此信息后，在 Pod 启动期间将 fsGroup 信息传递给 CSI 驱动程序。
这个过程是通过 [`NodeStageVolumeRequest`](https://github.com/container-storage-interface/spec/blob/v1.7.0/spec.md#nodestagevolume)
和 [`NodePublishVolumeRequest`](https://github.com/container-storage-interface/spec/blob/v1.7.0/spec.md#nodepublishvolume)
CSI 调用完成的。

因此，CSI 驱动程序应使用**挂载选项**将 `fsGroup` 应用到卷中的文件上。
例如，[Azure File CSIDriver](https://github.com/kubernetes-sigs/azurefile-csi-driver)
利用 `gid` 挂载选项将 `fsGroup` 信息映射到卷中的所有文件。

<!--
It should be noted that in the example above the kubelet refrains from directly
applying the permission changes into the files and directories in that volume files. 
Additionally, two policy definitions no longer have an effect: neither
`.spec.fsGroupPolicy` for the CSIDriver object, nor
`.spec.securityContext.fsGroupChangePolicy` for the Pod.

For more details about the inner workings of this feature, check out the
[enhancement proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/2317-fsgroup-on-mount/)
and the [CSI Driver `fsGroup` Support](https://kubernetes-csi.github.io/docs/support-fsgroup.html)
in the CSI developer documentation.
-->
应该注意的是，在上面的示例中，kubelet 避免直接将权限更改应用于该卷文件中的文件和目录。
此外，有两个策略定义不再有效：CSIDriver 对象的 `.spec.fsGroupPolicy` 和
Pod 的 `.spec.securityContext.fsGroupChangePolicy` 都不再起作用。

有关此功能内部工作原理的更多详细信息，请查看 CSI
开发人员文档中的[增强建议](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/2317-fsgroup-on-mount/)和
[CSI 驱动程序 `fsGroup` 支持](https://kubernetes-csi.github.io/docs/support-fsgroup.html)。

<!--
## Why is it important?

Without this feature, applying the fsGroup information to files is not possible in certain storage environments.

For instance, Azure File does not support a concept of POSIX-style ownership and permissions
of files. The CSI driver is only able to set the file permissions at the volume level.
-->
## 这一特性为何重要？

如果没有此功能，则无法在某些存储环境中将 fsGroup 信息应用于文件。

例如，Azure 文件不支持 POSIX 风格的文件所有权和权限概念，CSI 驱动程序只能在卷级别设置文件权限。

<!--
## How do I use it?

This feature should be mostly transparent to users. If you maintain a CSI driver that should
support this feature, read
[CSI Driver `fsGroup` Support](https://kubernetes-csi.github.io/docs/support-fsgroup.html)
for more information on how to support this feature in your CSI driver.

Existing CSI drivers that do not support this feature will continue to work as usual:
they will not receive any `fsGroup` information from the kubelet. In addition to that,
the kubelet will continue to perform the ownership and permissions changes to files
for those volumes, according to the policies specified in `.spec.fsGroupPolicy` for the
CSIDriver and `.spec.securityContext.fsGroupChangePolicy` for the relevant Pod.
-->
## 我该如何使用它？

此功能应该对用户基本透明。如果你维护应支持此功能的 CSI 驱动程序，
请阅读 [CSI 驱动程序 `fsGroup` 支持](https://kubernetes-csi.github.io/docs/support-fsgroup.html)
以获取有关如何在你的 CSI 驱动程序中支持此功能的更多信息。

不支持此功能的现有 CSI 驱动程序将继续照常工作：他们不会从 kubelet 收到任何
`fsGroup` 信息。除此之外，kubelet 将根据 CSIDriver 的
`.spec.fsGroupPolicy` 和相关 Pod 的 `.spec.securityContext.fsGroupChangePolicy`
中指定的策略，继续对这些卷中文件的属主关系和权限进行更改。