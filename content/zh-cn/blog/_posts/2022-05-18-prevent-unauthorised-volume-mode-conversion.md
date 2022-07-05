---
layout: blog
title: 'Kubernetes 1.24: 防止未经授权的卷模式转换'
date: 2022-05-18
slug: prevent-unauthorised-volume-mode-conversion-alpha
---

<!--
layout: blog
title: 'Kubernetes 1.24: Prevent unauthorised volume mode conversion'
date: 2022-05-18
slug: prevent-unauthorised-volume-mode-conversion-alpha
-->

<!--
**Author:** Raunak Pradip Shah (Mirantis)
-->
**作者：** Raunak Pradip Shah (Mirantis)

<!--
Kubernetes v1.24 introduces a new alpha-level feature that prevents unauthorised users 
from modifying the volume mode of a [`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/) created from an 
existing [`VolumeSnapshot`](/docs/concepts/storage/volume-snapshots/) in the Kubernetes cluster.  
-->
Kubernetes v1.24 引入了一个新的 alpha 级特性，可以防止未经授权的用户修改基于 Kubernetes
集群中已有的 [`VolumeSnapshot`](/zh-cn/docs/concepts/storage/volume-snapshots/)
创建的 [`PersistentVolumeClaim`](/zh-cn/docs/concepts/storage/persistent-volumes/) 的卷模式。

<!--
### The problem
-->
### 问题

<!--
The [Volume Mode](/docs/concepts/storage/persistent-volumes/#volume-mode) determines whether a volume 
is formatted into a filesystem or presented as a raw block device.   
-->
[卷模式](/zh-cn/docs/concepts/storage/persistent-volumes/#volume-mode)确定卷是格式化为文件系统还是显示为原始块设备。

<!--
Users can leverage the `VolumeSnapshot` feature, which has been stable since Kubernetes v1.20, 
to create a `PersistentVolumeClaim` (shortened as PVC) from an existing `VolumeSnapshot` in
the Kubernetes cluster. The PVC spec includes a `dataSource` field, which can point to an 
existing `VolumeSnapshot` instance.
Visit [Create a PersistentVolumeClaim from a Volume Snapshot](/docs/concepts/storage/persistent-volumes/#create-persistent-volume-claim-from-volume-snapshot) for more details.
-->
用户可以使用自 Kubernetes v1.20 以来就稳定的 `VolumeSnapshot` 功能，
基于 Kubernetes 集群中的已有的 `VolumeSnapshot` 创建一个 `PersistentVolumeClaim` (简称 PVC )。
PVC 规约包括一个 `dataSource` 字段，它可以指向一个已有的 `VolumeSnapshot` 实例。
查阅[基于卷快照创建 PVC](/zh-cn/docs/concepts/storage/persistent-volumes/#create-persistent-volume-claim-from-volume-snapshot)
获取更多详细信息。

<!--
When leveraging the above capability, there is no logic that validates whether the mode of the
original volume, whose snapshot was taken, matches the mode of the newly created volume.
-->
当使用上述功能时，没有逻辑来验证快照所在的原始卷的模式是否与新创建的卷的模式匹配。

<!--
This presents a security gap that allows malicious users to potentially exploit an 
as-yet-unknown vulnerability in the host operating system.
-->
这引起了一个安全漏洞，允许恶意用户潜在地利用主机操作系统中的未知漏洞。

<!--
Many popular storage backup vendors convert the volume mode during the course of a 
backup operation, for efficiency purposes, which prevents Kubernetes from blocking
the operation completely and presents a challenge in distinguishing trusted
users from malicious ones.
-->
为了提高效率，许多流行的存储备份供应商在备份操作过程中转换卷模式，
这使得 Kubernetes 无法完全阻止该操作，并在区分受信任用户和恶意用户方面带来挑战。

<!--
### Preventing unauthorised users from converting the volume mode
-->
### 防止未经授权的用户转换卷模式

<!--
In this context, an authorised user is one who has access rights to perform `Update` 
or `Patch` operations on `VolumeSnapshotContents`, which is a cluster-level resource.  
It is upto the cluster administrator to provide these rights only to trusted users
or applications, like backup vendors.
-->
在这种情况下，授权用户是指有权对 `VolumeSnapshotContents`（集群级资源）执行 `Update`
或 `Patch` 操作的用户。集群管理员只能向受信任的用户或应用程序（如备份供应商）提供这些权限。

<!--
If the alpha feature is [enabled](https://kubernetes-csi.github.io/docs/) in 
`snapshot-controller`, `snapshot-validation-webhook` and `external-provisioner`,
then unauthorised users will not be allowed to modify the volume mode of a PVC
when it is being created from a `VolumeSnapshot`.
-->
如果在 `snapshot-controller`、`snapshot-validation-webhook` 和
`external-provisioner` 中[启用](https://kubernetes-csi.github.io/docs/)了这个 alpha
特性，则基于 `VolumeSnapshot` 创建 PVC 时，将不允许未经授权的用户修改其卷模式。

<!--
To convert the volume mode, an authorised user must do the following:
-->
如要转换卷模式，授权用户必须执行以下操作：

<!--
1. Identify the `VolumeSnapshot` that is to be used as the data source for a newly 
created PVC in the given namespace. 
2. Identify the `VolumeSnapshotContent` bound to the above `VolumeSnapshot`.
-->
1. 确定要用作给定命名空间中新创建 PVC 的数据源的 `VolumeSnapshot`。
2. 确定绑定到上面 `VolumeSnapshot` 的 `VolumeSnapshotContent`。

   ```
      kubectl get volumesnapshot -n <namespace>
   ```
<!--
3. Add the annotation [`snapshot.storage.kubernetes.io/allowVolumeModeChange`](/docs/reference/labels-annotations-taints/#snapshot-storage-kubernetes-io-allowvolumemodechange)
to the `VolumeSnapshotContent`. 
-->
3. 给 `VolumeSnapshotContent` 添加
   [`snapshot.storage.kubernetes.io/allowVolumeModeChange`](/zh-cn/docs/reference/labels-annotations-taints/#snapshot-storage-kubernetes-io-allowvolumemodechange)
   注解。

<!--
4.This annotation can be added either via software or manually by the authorised 
user. The `VolumeSnapshotContent` annotation must look like following manifest fragment:
-->
4. 此注解可通过软件添加或由授权用户手动添加。`VolumeSnapshotContent` 注解必须类似于以下清单片段：

    ```yaml
       kind: VolumeSnapshotContent
       metadata:
         annotations:
           - snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"
       ...
    ```
<!--
**Note**: For pre-provisioned `VolumeSnapshotContents`, you must take an extra
step of setting `spec.sourceVolumeMode` field to either `Filesystem` or `Block`,
depending on the mode of the volume from which this snapshot was taken.
-->
**注意**：对于预先制备的 `VolumeSnapshotContents`，你必须采取额外的步骤设置 `spec.sourceVolumeMode`
字段为 `Filesystem` 或 `Block`，这取决于快照所在卷的模式。

<!--
An example is shown below:
-->
如下为一个示例：

```yaml
   apiVersion: snapshot.storage.k8s.io/v1
   kind: VolumeSnapshotContent
   metadata:
     annotations:
     - snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"
     name: new-snapshot-content-test
   spec:
     deletionPolicy: Delete
     driver: hostpath.csi.k8s.io
     source:
       snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
     sourceVolumeMode: Filesystem
     volumeSnapshotRef:
       name: new-snapshot-test
       namespace: default
```

<!--
Repeat steps 1 to 3 for all `VolumeSnapshotContents` whose volume mode needs to be 
converted during a backup or restore operation.
-->
对于在备份或恢复操作期间需要转换卷模式的所有 `VolumeSnapshotContents`，重复步骤 1 到 3。

<!--
If the annotation shown in step 4 above is present on a `VolumeSnapshotContent`
object, Kubernetes will not prevent the volume mode from being converted.
Users should keep this in mind before they attempt to add the annotation 
to any `VolumeSnapshotContent`. 
-->
如果 `VolumeSnapshotContent` 对象上存在上面步骤 4 中显示的注解，Kubernetes 将不会阻止转换卷模式。
用户在尝试将注解添加到任何 `VolumeSnapshotContent` 之前，应该记住这一点。

<!--
### What's next
-->
### 接下来

<!--
[Enable this feature](https://kubernetes-csi.github.io/docs/) and let us know 
what you think!
-->
[启用此特性](https://kubernetes-csi.github.io/docs/)并让我们知道你的想法!

<!--
We hope this feature causes no disruption to existing workflows while preventing
malicious users from exploiting security vulnerabilities in their clusters. 
-->
我们希望此功能不会中断现有工作流程，同时防止恶意用户利用集群中的安全漏洞。

<!--
For any issues, create a thread in the #sig-storage slack channel or an issue
in the CSI external-snapshotter [repository](https://github.com/kubernetes-csi/external-snapshotter).
-->
若有任何问题，请在 #sig-storage slack 频道中创建一个会话，
或在 CSI 外部快照存储[仓库](https://github.com/kubernetes-csi/external-snapshotter)中报告一个 issue。