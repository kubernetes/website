---
layout: blog
title: "Kubernetes 1.30：防止未经授权的卷模式转换进阶到 GA"
date: 2024-04-30
slug: prevent-unauthorized-volume-mode-conversion-ga
---
<!--
layout: blog
title: "Kubernetes 1.30: Preventing unauthorized volume mode conversion moves to GA"
date: 2024-04-30
slug: prevent-unauthorized-volume-mode-conversion-ga
author: >
  Raunak Pradip Shah (Mirantis)
-->

**作者:** Raunak Pradip Shah (Mirantis)

**译者:** Xin Li (DaoCloud)

<!--
With the release of Kubernetes 1.30, the feature to prevent the modification of the volume mode
of a [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/) that was created from
an existing VolumeSnapshot in a Kubernetes cluster, has moved to GA!
-->
随着 Kubernetes 1.30 的发布，防止修改从 Kubernetes 集群中现有
VolumeSnapshot 创建的 [PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/)
的卷模式的特性已被升级至 GA！

<!--
## The problem

The [Volume Mode](/docs/concepts/storage/persistent-volumes/#volume-mode) of a PersistentVolumeClaim 
refers to whether the underlying volume on the storage device is formatted into a filesystem or
presented as a raw block device to the Pod that uses it.

Users can leverage the VolumeSnapshot feature, which has been stable since Kubernetes v1.20,
to create a PersistentVolumeClaim (shortened as PVC) from an existing VolumeSnapshot in
the Kubernetes cluster. The PVC spec includes a dataSource field, which can point to an
existing VolumeSnapshot instance.
Visit [Create a PersistentVolumeClaim from a Volume Snapshot](/docs/concepts/storage/persistent-volumes/#create-persistent-volume-claim-from-volume-snapshot) 
for more details on how to create a PVC from an existing VolumeSnapshot in a Kubernetes cluster.
-->
## 问题

PersistentVolumeClaim 的[卷模式](/zh-cn/docs/concepts/storage/persistent-volumes/#volume-mode)
是指存储设备上的底层卷是被格式化为某文件系统还是作为原始块设备呈现给使用它的 Pod。

用户可以利用自 Kubernetes v1.20 以来一直稳定的 VolumeSnapshot 特性，基于
Kubernetes 集群中现有的 VolumeSnapshot 创建 PersistentVolumeClaim（简称 PVC）。
PVC 规约中包括一个 `dataSource` 字段，它可以指向现有的 VolumeSnapshot 实例。
有关如何基于 Kubernetes 集群中现有 VolumeSnapshot 创建 PVC 的更多详细信息，
请访问[使用卷快照创建 PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#create-persistent-volume-claim-from-volume-snapshot)。

<!--
When leveraging the above capability, there is no logic that validates whether the mode of the
original volume, whose snapshot was taken, matches the mode of the newly created volume.

This presents a security gap that allows malicious users to potentially exploit an
as-yet-unknown vulnerability in the host operating system.

There is a valid use case to allow some users to perform such conversions. Typically, storage backup
vendors convert the volume mode during the course of a backup operation, to retrieve changed blocks 
for greater efficiency of operations. This prevents Kubernetes from blocking the operation completely
and presents a challenge in distinguishing trusted users from malicious ones.
-->
当利用上述特性时，没有逻辑来验证制作快照的原始卷的模式是否与新创建的卷的模式匹配。

这带来了一个安全漏洞，允许恶意用户潜在地利用主机操作系统中未知的漏洞。

有一个合法的场景允许某些用户执行此类转换。
通常，存储备份供应商会在备份操作过程中转换卷模式，通过检索已被更改的块来提高操作效率。
这使得 Kubernetes 无法完全阻止此类操作，但给区分可信用户和恶意用户带来了挑战。

<!--
## Preventing unauthorized users from converting the volume mode

In this context, an authorized user is one who has access rights to perform **update**
or **patch** operations on VolumeSnapshotContents, which is a cluster-level resource.  
It is up to the cluster administrator to provide these rights only to trusted users
or applications, like backup vendors.
Users apart from such authorized ones will never be allowed to modify the volume mode
of a PVC when it is being created from a VolumeSnapshot.
-->
## 防止未经授权的用户转换卷模式

在此上下文中，授权用户是有权对 VolumeSnapshotContents（集群级资源）执行
**update** 或 **patch** 操作的用户。
集群管理员应仅向受信任的用户或应用程序（例如备份供应商）赋予这些权限。
当从 VolumeSnapshot 创建 PVC 时，除了此类授权用户之外的用户将永远不会被允许修改 PVC 的卷模式。

<!--
To convert the volume mode, an authorized user must do the following:

1. Identify the VolumeSnapshot that is to be used as the data source for a newly
   created PVC in the given namespace.
2. Identify the VolumeSnapshotContent bound to the above VolumeSnapshot.
-->
要转换卷模式，授权用户必须执行以下操作：

1. 标识要用作给定命名空间中新创建的 PVC 的数据源的 VolumeSnapshot。
2. 识别与上述 VolumeSnapshot 绑定的 VolumeSnapshotContent。

   ```shell
   kubectl describe volumesnapshot -n <namespace> <name>
   ```

<!--
3. Add the annotation [`snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`](/docs/reference/labels-annotations-taints/#snapshot-storage-kubernetes-io-allowvolumemodechange)
   to the above VolumeSnapshotContent. The VolumeSnapshotContent annotations must include one similar to the following manifest fragment:
-->
3. 在 VolumeSnapshotContent 上添加 [`snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`](/zh-cn/docs/reference/labels-annotations-taints/#snapshot-storage-kubernetes-io-allowvolumemodechange)
   注解，VolumeSnapshotContent 注解必须包含类似于以下清单片段：

   ```yaml
   kind: VolumeSnapshotContent
   metadata:
     annotations:
       - snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"
   ...
   ```

<!--
**Note**: For pre-provisioned VolumeSnapshotContents, you must take an extra
step of setting `spec.sourceVolumeMode` field to either `Filesystem` or `Block`,
depending on the mode of the volume from which this snapshot was taken.

An example is shown below:
-->
**注意**：对于预配置的 VolumeSnapshotContents，你必须执行额外的步骤，将
`spec.sourceVolumeMode` 字段设置为 `Filesystem` 或 `Block`，
具体取决于用来制作此快照的卷的模式。

一个例子如下所示：

   ```yaml
   apiVersion: snapshot.storage.k8s.io/v1
   kind: VolumeSnapshotContent
   metadata:
     annotations:
     - snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"
     name: <volume-snapshot-content-name>
   spec:
     deletionPolicy: Delete
     driver: hostpath.csi.k8s.io
     source:
       snapshotHandle: <snapshot-handle>
     sourceVolumeMode: Filesystem
     volumeSnapshotRef:
       name: <volume-snapshot-name>
       namespace: <namespace>
   ```

<!--
Repeat steps 1 to 3 for all VolumeSnapshotContents whose volume mode needs to be
converted during a backup or restore operation. This can be done either via software
with credentials of an authorized user or manually by the authorized user(s).

If the annotation shown above is present on a VolumeSnapshotContent object,
Kubernetes will not prevent the volume mode from being converted.
Users should keep this in mind before they attempt to add the annotation
to any VolumeSnapshotContent.
-->
对备份或恢复操作期间需要转换卷模式的所有 VolumeSnapshotContent 重复步骤 1 至 3。
这可以通过具有授权用户凭据的软件来完成，也可以由授权用户手动完成。

如果 VolumeSnapshotContent 对象上存在上面显示的注解，Kubernetes 将不会阻止卷模式转换。
用户在尝试将注解添加到任何 VolumeSnapshotContent 之前应记住这一点。

<!--
## Action required

The `prevent-volume-mode-conversion` feature flag is enabled by default in the 
external-provisioner `v4.0.0` and external-snapshotter `v7.0.0`. Volume mode change
will be rejected when creating a PVC from a VolumeSnapshot unless the steps
described above have been performed.
-->
## 需要采取的行动

默认情况下，在 external-provisioner `v4.0.0` 和 external-snapshotter `v7.0.0`
中启用 `prevent-volume-mode-conversion` 特性标志。
基于 VolumeSnapshot 来创建 PVC 时，卷模式更改将被拒绝，除非已执行上述步骤。

<!--
## What's next

To determine which CSI external sidecar versions support this feature, please head
over to the [CSI docs page](https://kubernetes-csi.github.io/docs/).
For any queries or issues, join [Kubernetes on Slack](https://slack.k8s.io/) and
create a thread in the #csi or #sig-storage channel. Alternately, create an issue in the
CSI external-snapshotter [repository](https://github.com/kubernetes-csi/external-snapshotter).
-->
## 接下来

要确定哪些 CSI 外部 sidecar 版本支持此功能，请前往 [CSI 文档页面](https://kubernetes-csi.github.io/docs/)。
对于任何疑问或问题，请加入 [Slack 上的 Kubernetes](https://slack.k8s.io/) 并在 #csi 或 #sig-storage 频道中发起讨论。
或者，在 CSI 外部快照[仓库](https://github.com/kubernetes-csi/external-snapshotter)中登记问题。
