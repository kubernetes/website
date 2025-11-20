---
layout: blog
title: "Kubernetes 1.30：防止未經授權的卷模式轉換進階到 GA"
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

**譯者:** Xin Li (DaoCloud)

<!--
With the release of Kubernetes 1.30, the feature to prevent the modification of the volume mode
of a [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/) that was created from
an existing VolumeSnapshot in a Kubernetes cluster, has moved to GA!
-->
隨着 Kubernetes 1.30 的發佈，防止修改從 Kubernetes 叢集中現有
VolumeSnapshot 創建的 [PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/)
的卷模式的特性已被升級至 GA！

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
## 問題

PersistentVolumeClaim 的[卷模式](/zh-cn/docs/concepts/storage/persistent-volumes/#volume-mode)
是指儲存設備上的底層卷是被格式化爲某檔案系統還是作爲原始塊設備呈現給使用它的 Pod。

使用者可以利用自 Kubernetes v1.20 以來一直穩定的 VolumeSnapshot 特性，基於
Kubernetes 叢集中現有的 VolumeSnapshot 創建 PersistentVolumeClaim（簡稱 PVC）。
PVC 規約中包括一個 `dataSource` 字段，它可以指向現有的 VolumeSnapshot 實例。
有關如何基於 Kubernetes 叢集中現有 VolumeSnapshot 創建 PVC 的更多詳細資訊，
請訪問[使用卷快照創建 PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#create-persistent-volume-claim-from-volume-snapshot)。

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
當利用上述特性時，沒有邏輯來驗證製作快照的原始卷的模式是否與新創建的卷的模式匹配。

這帶來了一個安全漏洞，允許惡意使用者潛在地利用主機操作系統中未知的漏洞。

有一個合法的場景允許某些使用者執行此類轉換。
通常，儲存備份供應商會在備份操作過程中轉換卷模式，通過檢索已被更改的塊來提高操作效率。
這使得 Kubernetes 無法完全阻止此類操作，但給區分可信使用者和惡意使用者帶來了挑戰。

<!--
## Preventing unauthorized users from converting the volume mode

In this context, an authorized user is one who has access rights to perform **update**
or **patch** operations on VolumeSnapshotContents, which is a cluster-level resource.  
It is up to the cluster administrator to provide these rights only to trusted users
or applications, like backup vendors.
Users apart from such authorized ones will never be allowed to modify the volume mode
of a PVC when it is being created from a VolumeSnapshot.
-->
## 防止未經授權的使用者轉換卷模式

在此上下文中，授權使用者是有權對 VolumeSnapshotContents（叢集級資源）執行
**update** 或 **patch** 操作的使用者。
叢集管理員應僅向受信任的使用者或應用程式（例如備份供應商）賦予這些權限。
當從 VolumeSnapshot 創建 PVC 時，除了此類授權使用者之外的使用者將永遠不會被允許修改 PVC 的卷模式。

<!--
To convert the volume mode, an authorized user must do the following:

1. Identify the VolumeSnapshot that is to be used as the data source for a newly
   created PVC in the given namespace.
2. Identify the VolumeSnapshotContent bound to the above VolumeSnapshot.
-->
要轉換卷模式，授權使用者必須執行以下操作：

1. 標識要用作給定命名空間中新創建的 PVC 的資料源的 VolumeSnapshot。
2. 識別與上述 VolumeSnapshot 綁定的 VolumeSnapshotContent。

   ```shell
   kubectl describe volumesnapshot -n <namespace> <name>
   ```

<!--
3. Add the annotation [`snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`](/docs/reference/labels-annotations-taints/#snapshot-storage-kubernetes-io-allowvolumemodechange)
   to the above VolumeSnapshotContent. The VolumeSnapshotContent annotations must include one similar to the following manifest fragment:
-->
3. 在 VolumeSnapshotContent 上添加 [`snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`](/zh-cn/docs/reference/labels-annotations-taints/#snapshot-storage-kubernetes-io-allowvolumemodechange)
   註解，VolumeSnapshotContent 註解必須包含類似於以下清單片段：

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
**注意**：對於預設定的 VolumeSnapshotContents，你必須執行額外的步驟，將
`spec.sourceVolumeMode` 字段設置爲 `Filesystem` 或 `Block`，
具體取決於用來製作此快照的卷的模式。

一個例子如下所示：

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
對備份或恢復操作期間需要轉換卷模式的所有 VolumeSnapshotContent 重複步驟 1 至 3。
這可以通過具有授權使用者憑據的軟體來完成，也可以由授權使用者手動完成。

如果 VolumeSnapshotContent 對象上存在上面顯示的註解，Kubernetes 將不會阻止卷模式轉換。
使用者在嘗試將註解添加到任何 VolumeSnapshotContent 之前應記住這一點。

<!--
## Action required

The `prevent-volume-mode-conversion` feature flag is enabled by default in the 
external-provisioner `v4.0.0` and external-snapshotter `v7.0.0`. Volume mode change
will be rejected when creating a PVC from a VolumeSnapshot unless the steps
described above have been performed.
-->
## 需要採取的行動

預設情況下，在 external-provisioner `v4.0.0` 和 external-snapshotter `v7.0.0`
中啓用 `prevent-volume-mode-conversion` 特性標誌。
基於 VolumeSnapshot 來創建 PVC 時，卷模式更改將被拒絕，除非已執行上述步驟。

<!--
## What's next

To determine which CSI external sidecar versions support this feature, please head
over to the [CSI docs page](https://kubernetes-csi.github.io/docs/).
For any queries or issues, join [Kubernetes on Slack](https://slack.k8s.io/) and
create a thread in the #csi or #sig-storage channel. Alternately, create an issue in the
CSI external-snapshotter [repository](https://github.com/kubernetes-csi/external-snapshotter).
-->
## 接下來

要確定哪些 CSI 外部 sidecar 版本支持此功能，請前往 [CSI 文檔頁面](https://kubernetes-csi.github.io/docs/)。
對於任何疑問或問題，請加入 [Slack 上的 Kubernetes](https://slack.k8s.io/) 並在 #csi 或 #sig-storage 頻道中發起討論。
或者，在 CSI 外部快照[倉庫](https://github.com/kubernetes-csi/external-snapshotter)中登記問題。
