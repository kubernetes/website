---
layout: blog
title: "Kubernetes 1.26: 支持在掛載時將 Pod fsGroup 傳遞給 CSI 驅動程序"
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

**譯者：** Xin Li (DaoCloud)

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
將 `fsGroup` 委託給 CSI 驅動程序管理首先在 Kubernetes 1.22 中作爲 Alpha 特性引入，
並在 Kubernetes 1.25 中進階至 Beta 狀態。
對於 Kubernetes 1.26，我們很高興地宣佈此特性已進階至正式發佈（GA）狀態。

在此版本中，如果你在 Pod（Linux）
的[安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod)中指定一個 `fsGroup`，
則該 Pod 容器中的所有進程都是該附加組的一部分。

<!--
In previous Kubernetes releases, the kubelet would *always* apply the
`fsGroup` ownership and permission changes to files in the volume according to the policy
you specified in the Pod's `.spec.securityContext.fsGroupChangePolicy` field.

Starting with Kubernetes 1.26, CSI drivers have the option to apply the `fsGroup` settings during 
volume mount time, which frees the kubelet from changing the permissions of files and directories
in those volumes.
-->
在以前的 Kubernetes 版本中，kubelet **總是**根據 Pod 的
`.spec.securityContext.fsGroupChangePolicy` 字段中指定的策略，
將 `fsGroup` 屬主關係和權限的更改應用於卷中的文件。

從 Kubernetes 1.26 開始，CSI 驅動程序可以選擇在卷掛載期間應用 `fsGroup` 設置，
這使 kubelet 無需更改這些卷中文件和目錄的權限。

<!--
## How does it work?

CSI drivers that support this feature should advertise the
[`VOLUME_MOUNT_GROUP`](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetcapabilities) node capability.
-->
## 它是如何工作的？

支持此功能的 CSI 驅動程序應通告其 `VOLUME_MOUNT_GROUP` 節點能力。

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
kubelet 識別此信息後，在 Pod 啓動期間將 fsGroup 信息傳遞給 CSI 驅動程序。
這個過程是通過 [`NodeStageVolumeRequest`](https://github.com/container-storage-interface/spec/blob/v1.7.0/spec.md#nodestagevolume)
和 [`NodePublishVolumeRequest`](https://github.com/container-storage-interface/spec/blob/v1.7.0/spec.md#nodepublishvolume)
CSI 調用完成的。

因此，CSI 驅動程序應使用**掛載選項**將 `fsGroup` 應用到卷中的文件上。
例如，[Azure File CSIDriver](https://github.com/kubernetes-sigs/azurefile-csi-driver)
利用 `gid` 掛載選項將 `fsGroup` 信息映射到卷中的所有文件。

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
應該注意的是，在上面的示例中，kubelet 避免直接將權限更改應用於該卷文件中的文件和目錄。
此外，有兩個策略定義不再有效：CSIDriver 對象的 `.spec.fsGroupPolicy` 和
Pod 的 `.spec.securityContext.fsGroupChangePolicy` 都不再起作用。

有關此功能內部工作原理的更多詳細信息，請查看 CSI
開發人員文檔中的[增強建議](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/2317-fsgroup-on-mount/)和
[CSI 驅動程序 `fsGroup` 支持](https://kubernetes-csi.github.io/docs/support-fsgroup.html)。

<!--
## Why is it important?

Without this feature, applying the fsGroup information to files is not possible in certain storage environments.

For instance, Azure File does not support a concept of POSIX-style ownership and permissions
of files. The CSI driver is only able to set the file permissions at the volume level.
-->
## 這一特性爲何重要？

如果沒有此功能，則無法在某些存儲環境中將 fsGroup 信息應用於文件。

例如，Azure 文件不支持 POSIX 風格的文件所有權和權限概念，CSI 驅動程序只能在卷級別設置文件權限。

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
## 我該如何使用它？

此功能應該對使用者基本透明。如果你維護應支持此功能的 CSI 驅動程序，
請閱讀 [CSI 驅動程序 `fsGroup` 支持](https://kubernetes-csi.github.io/docs/support-fsgroup.html)
以獲取有關如何在你的 CSI 驅動程序中支持此功能的更多信息。

不支持此功能的現有 CSI 驅動程序將繼續照常工作：他們不會從 kubelet 收到任何
`fsGroup` 信息。除此之外，kubelet 將根據 CSIDriver 的
`.spec.fsGroupPolicy` 和相關 Pod 的 `.spec.securityContext.fsGroupChangePolicy`
中指定的策略，繼續對這些卷中文件的屬主關係和權限進行更改。