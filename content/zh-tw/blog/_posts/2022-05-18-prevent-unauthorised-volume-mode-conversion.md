---
layout: blog
title: 'Kubernetes 1.24: 防止未經授權的卷模式轉換'
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
Kubernetes v1.24 引入了一個新的 alpha 級特性，可以防止未經授權的使用者修改基於 Kubernetes
叢集中已有的 [`VolumeSnapshot`](/zh-cn/docs/concepts/storage/volume-snapshots/)
創建的 [`PersistentVolumeClaim`](/zh-cn/docs/concepts/storage/persistent-volumes/) 的卷模式。

<!--
### The problem
-->
### 問題

<!--
The [Volume Mode](/docs/concepts/storage/persistent-volumes/#volume-mode) determines whether a volume 
is formatted into a filesystem or presented as a raw block device.   
-->
[卷模式](/zh-cn/docs/concepts/storage/persistent-volumes/#volume-mode)確定卷是格式化爲檔案系統還是顯示爲原始塊設備。

<!--
Users can leverage the `VolumeSnapshot` feature, which has been stable since Kubernetes v1.20, 
to create a `PersistentVolumeClaim` (shortened as PVC) from an existing `VolumeSnapshot` in
the Kubernetes cluster. The PVC spec includes a `dataSource` field, which can point to an 
existing `VolumeSnapshot` instance.
Visit [Create a PersistentVolumeClaim from a Volume Snapshot](/docs/concepts/storage/persistent-volumes/#create-persistent-volume-claim-from-volume-snapshot) for more details.
-->
使用者可以使用自 Kubernetes v1.20 以來就穩定的 `VolumeSnapshot` 功能，
基於 Kubernetes 叢集中的已有的 `VolumeSnapshot` 創建一個 `PersistentVolumeClaim` (簡稱 PVC )。
PVC 規約包括一個 `dataSource` 字段，它可以指向一個已有的 `VolumeSnapshot` 實例。
查閱[基於卷快照創建 PVC](/zh-cn/docs/concepts/storage/persistent-volumes/#create-persistent-volume-claim-from-volume-snapshot)
獲取更多詳細資訊。

<!--
When leveraging the above capability, there is no logic that validates whether the mode of the
original volume, whose snapshot was taken, matches the mode of the newly created volume.
-->
當使用上述功能時，沒有邏輯來驗證快照所在的原始卷的模式是否與新創建的卷的模式匹配。

<!--
This presents a security gap that allows malicious users to potentially exploit an 
as-yet-unknown vulnerability in the host operating system.
-->
這引起了一個安全漏洞，允許惡意使用者潛在地利用主機操作系統中的未知漏洞。

<!--
Many popular storage backup vendors convert the volume mode during the course of a 
backup operation, for efficiency purposes, which prevents Kubernetes from blocking
the operation completely and presents a challenge in distinguishing trusted
users from malicious ones.
-->
爲了提高效率，許多流行的儲存備份供應商在備份操作過程中轉換卷模式，
這使得 Kubernetes 無法完全阻止該操作，並在區分受信任使用者和惡意使用者方面帶來挑戰。

<!--
### Preventing unauthorised users from converting the volume mode
-->
### 防止未經授權的使用者轉換卷模式

<!--
In this context, an authorised user is one who has access rights to perform `Update` 
or `Patch` operations on `VolumeSnapshotContents`, which is a cluster-level resource.  
It is upto the cluster administrator to provide these rights only to trusted users
or applications, like backup vendors.
-->
在這種情況下，授權使用者是指有權對 `VolumeSnapshotContents`（叢集級資源）執行 `Update`
或 `Patch` 操作的使用者。叢集管理員只能向受信任的使用者或應用程式（如備份供應商）提供這些權限。

<!--
If the alpha feature is [enabled](https://kubernetes-csi.github.io/docs/) in 
`snapshot-controller`, `snapshot-validation-webhook` and `external-provisioner`,
then unauthorised users will not be allowed to modify the volume mode of a PVC
when it is being created from a `VolumeSnapshot`.
-->
如果在 `snapshot-controller`、`snapshot-validation-webhook` 和
`external-provisioner` 中[啓用](https://kubernetes-csi.github.io/docs/)了這個 alpha
特性，則基於 `VolumeSnapshot` 創建 PVC 時，將不允許未經授權的使用者修改其卷模式。

<!--
To convert the volume mode, an authorised user must do the following:
-->
如要轉換卷模式，授權使用者必須執行以下操作：

<!--
1. Identify the `VolumeSnapshot` that is to be used as the data source for a newly 
created PVC in the given namespace. 
2. Identify the `VolumeSnapshotContent` bound to the above `VolumeSnapshot`.
-->
1. 確定要用作給定命名空間中新創建 PVC 的資料源的 `VolumeSnapshot`。
2. 確定綁定到上面 `VolumeSnapshot` 的 `VolumeSnapshotContent`。

   ```
      kubectl get volumesnapshot -n <namespace>
   ```
<!--
3. Add the annotation [`snapshot.storage.kubernetes.io/allowVolumeModeChange`](/docs/reference/labels-annotations-taints/#snapshot-storage-kubernetes-io-allowvolumemodechange)
to the `VolumeSnapshotContent`. 
-->
3. 給 `VolumeSnapshotContent` 添加
   [`snapshot.storage.kubernetes.io/allowVolumeModeChange`](/zh-cn/docs/reference/labels-annotations-taints/#snapshot-storage-kubernetes-io-allowvolumemodechange)
   註解。

<!--
4.This annotation can be added either via software or manually by the authorised 
user. The `VolumeSnapshotContent` annotation must look like following manifest fragment:
-->
4. 此註解可通過軟體添加或由授權使用者手動添加。`VolumeSnapshotContent` 註解必須類似於以下清單片段：

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
**注意**：對於預先製備的 `VolumeSnapshotContents`，你必須採取額外的步驟設置 `spec.sourceVolumeMode`
字段爲 `Filesystem` 或 `Block`，這取決於快照所在卷的模式。

<!--
An example is shown below:
-->
如下爲一個示例：

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
對於在備份或恢復操作期間需要轉換卷模式的所有 `VolumeSnapshotContents`，重複步驟 1 到 3。

<!--
If the annotation shown in step 4 above is present on a `VolumeSnapshotContent`
object, Kubernetes will not prevent the volume mode from being converted.
Users should keep this in mind before they attempt to add the annotation 
to any `VolumeSnapshotContent`. 
-->
如果 `VolumeSnapshotContent` 對象上存在上面步驟 4 中顯示的註解，Kubernetes 將不會阻止轉換卷模式。
使用者在嘗試將註解添加到任何 `VolumeSnapshotContent` 之前，應該記住這一點。

<!--
### What's next
-->
### 接下來

<!--
[Enable this feature](https://kubernetes-csi.github.io/docs/) and let us know 
what you think!
-->
[啓用此特性](https://kubernetes-csi.github.io/docs/)並讓我們知道你的想法!

<!--
We hope this feature causes no disruption to existing workflows while preventing
malicious users from exploiting security vulnerabilities in their clusters. 
-->
我們希望此功能不會中斷現有工作流程，同時防止惡意使用者利用叢集中的安全漏洞。

<!--
For any issues, create a thread in the #sig-storage slack channel or an issue
in the CSI external-snapshotter [repository](https://github.com/kubernetes-csi/external-snapshotter).
-->
若有任何問題，請在 #sig-storage slack 頻道中創建一個會話，
或在 CSI 外部快照儲存[倉庫](https://github.com/kubernetes-csi/external-snapshotter)中報告一個 issue。