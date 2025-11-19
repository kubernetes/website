---
layout: blog
title: '使用 Kubernetes 調整 PersistentVolume 的大小'
date: 2018-07-12
slug: resize-pv-using-k8s
---
<!--
layout: blog
title: 'Resizing Persistent Volumes using Kubernetes'
date: 2018-07-12
-->

<!--
**Author**: Hemant Kumar (Red Hat)
-->
**作者**: Hemant Kumar (Red Hat)

<!--
**Editor’s note: this post is part of a [series of in-depth articles](https://kubernetes.io/blog/2018/06/27/kubernetes-1.11-release-announcement/) on what’s new in Kubernetes 1.11**

In Kubernetes v1.11 the persistent volume expansion feature is being promoted to beta. This feature allows users to easily resize an existing volume by editing the `PersistentVolumeClaim` (PVC) object. Users no longer have to manually interact with the storage backend or delete and recreate PV and PVC objects to increase the size of a volume. Shrinking persistent volumes is not supported.

Volume expansion was introduced in v1.8 as an Alpha feature, and versions prior to v1.11 required enabling the feature gate, `ExpandPersistentVolumes`, as well as the admission controller, `PersistentVolumeClaimResize` (which prevents expansion of PVCs whose underlying storage provider does not support resizing). In Kubernetes v1.11+, both the feature gate and admission controller are enabled by default.

Although the feature is enabled by default, a cluster admin must opt-in to allow users to resize their volumes. Kubernetes v1.11 ships with volume expansion support for the following in-tree volume plugins: AWS-EBS, GCE-PD, Azure Disk, Azure File, Glusterfs, Cinder, Portworx, and Ceph RBD. Once the admin has determined that volume expansion is supported for the underlying provider, they can make the feature available to users by setting the `allowVolumeExpansion` field to `true` in their `StorageClass` object(s). Only PVCs created from that `StorageClass` will be allowed to trigger volume expansion.
-->
**編者注：這篇博客是[深度文章系列](https://kubernetes.io/blog/2018/06/27/kubernetes-1.11-release-announcement/)的一部分，這個系列介紹了 Kubernetes 1.11 中的新增特性**

在 Kubernetes v1.11 中，持久化卷擴展功能升級爲 Beta。
該功能允許用戶通過編輯 `PersistentVolumeClaim`（PVC）對象，輕鬆調整已存在數據卷的大小。
用戶不再需要手動與存儲後端交互，或者刪除再重建 PV 和 PVC 對象來增加捲的大小。縮減持久化卷暫不支持。

卷擴展是在 v1.8 版本中作爲 Alpha 功能引入的，
在 v1.11 之前的版本都需要開啓特性門控 `ExpandPersistentVolumes` 以及准入控制器 `PersistentVolumeClaimResize`（防止擴展底層存儲供應商不支持調整大小的 PVC）。
在 Kubernetes v1.11+ 中，特性門控和准入控制器都是默認啓用的。

雖然該功能默認是啓用的，但集羣管理員必須選擇允許用戶調整數據卷的大小。
Kubernetes v1.11 爲以下樹內卷插件提供了卷擴展支持：
AWS-EBS、GCE-PD、Azure Disk、Azure File、Glusterfs、Cinder、Portworx 和 Ceph RBD。
一旦管理員確定底層供應商支持卷擴展，
就可以通過在 `StorageClass` 對象中設置  `allowVolumeExpansion` 字段爲  `true`，讓用戶可以使用該功能。
只有由這個 `StorageClass` 創建的 PVC 才能觸發卷擴展。

```
~> cat standard.yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
parameters:
  type: pd-standard
provisioner: kubernetes.io/gce-pd
allowVolumeExpansion: true
reclaimPolicy: Delete
```
<!--
Any PVC created from this `StorageClass` can be edited (as illustrated below) to request more space. Kubernetes will interpret a change to the storage field as a request for more space, and will trigger automatic volume resizing.

![PVC StorageClass](/images/blog/2018-07-12-resizing-persistent-volumes-using-kubernetes/pvc-storageclass.png)
-->
從這個 `StorageClass` 創建的任何 PVC 都可以被編輯（如下圖所示）以請求更多的空間。
Kubernetes 會將存儲字段的變化解釋爲對更多空間的請求，並觸發卷大小的自動調整。

![PVC StorageClass](/images/blog/2018-07-12-resizing-persistent-volumes-using-kubernetes/pvc-storageclass.png)

<!--
## File System Expansion

Block storage volume types such as GCE-PD, AWS-EBS, Azure Disk, Cinder, and Ceph RBD typically require a file system expansion before the additional space of an expanded volume is usable by pods. Kubernetes takes care of this automatically whenever the pod(s) referencing your volume are restarted.

Network attached file systems (like Glusterfs and Azure File) can be expanded without having to restart the referencing Pod, because these systems do not require special file system expansion.

File system expansion must be triggered by terminating the pod using the volume. More specifically:

* Edit the PVC to request more space.
* Once underlying volume has been expanded by the storage provider, then the PersistentVolume object will reflect the updated size and the PVC will have the `FileSystemResizePending` condition.

You can verify this by running `kubectl get pvc <pvc_name> -o yaml`
-->
## 文件系統擴展 {#file-system-expansion}

如 GCE-PD、AWS-EBS、Azure Disk、Cinder 和 Ceph RBD 這類的塊存儲卷類型，
通常需要在擴展卷的額外空間被 Pod 使用之前進行文件系統擴展。
Kubernetes 會在引用數據卷的 Pod 重新啓動時自動處理這個問題。

網絡附加文件系統（如 Glusterfs 和 Azure File）可以被擴展，而不需要重新啓動引用的 Pod，
因爲這些系統不需要特殊的文件系統擴展。

文件系統擴展必須通過終止使用該卷的 Pod 來觸發。更具體地說：

* 編輯 PVC 以請求更多的空間。
* 一旦底層卷被存儲提供商擴展後， PersistentVolume 對象將反映更新的大小，PVC 會有 `FileSystemResizePending`  狀態。

你可以通過運行 `kubectl get pvc <pvc_name> -o yaml` 來驗證這一點。

```
~> kubectl get pvc myclaim -o yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
  namespace: default
  uid: 02d4aa83-83cd-11e8-909d-42010af00004
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 14Gi
  storageClassName: standard
  volumeName: pvc-xxx
status:
  capacity:
    storage: 9G
  conditions:
  - lastProbeTime: null
    lastTransitionTime: 2018-07-11T14:51:10Z
    message: Waiting for user to (re-)start a pod to finish file system resize of
      volume on node.
    status: "True"
    type: FileSystemResizePending
  phase: Bound
```
<!--
* Once the PVC has the condition `FileSystemResizePending` then pod that uses the PVC can be restarted to finish file system resizing on the node. Restart can be achieved by deleting and recreating the pod or by scaling down the deployment and then scaling it up again.
* Once file system resizing is done, the PVC will automatically be updated to reflect new size.

Any errors encountered while expanding file system should be available as events on pod.
-->
* 一旦 PVC 具有 `FileSystemResizePending` 狀態 ，就可以重啓使用該 PVC 的 Pod 以完成節點上的文件系統大小調整。
重新啓動可以通過刪除並重新創建 Pod，或者通過 Deployment 縮容後再擴容來實現。
* 一旦文件系統的大小調整完成，PVC 將自動更新以展現新的大小。

在擴展文件系統時遇到的任何錯誤都應作爲 Pod 的事件而存在。

<!--
## Online File System Expansion

Kubernetes v1.11 also introduces an alpha feature called online file system expansion. This feature enables file system expansion while a volume is still in-use by a pod. Because this feature is alpha, it requires enabling the feature gate, `ExpandInUsePersistentVolumes`. It is supported by the in-tree volume plugins GCE-PD, AWS-EBS, Cinder, and Ceph RBD. When this feature is enabled, pod referencing the resized volume do not need to be restarted. Instead, the file system will automatically be resized while in use as part of volume expansion. File system expansion does not happen until a pod references the resized volume, so if no pods referencing the volume are running file system expansion will not happen.
-->
## 在線文件系統擴展 {#online-file-system-expansion}

Kubernetes v1.11 裏還引入了一個名爲在線文件系統擴展的 Alpha 功能。
該功能可以讓一個正在被 Pod 使用的捲進行文件系統擴展。
因爲這個功能是 Alpha 階段，所以它需要啓用特性門控 `ExpandInUsePersistentVolumes`。
樹內卷插件 GCE-PD、AWS-EBS、Cinder 和 Ceph RBD 都支持該功能。
當這個功能被啓用時，引用調整後的卷的 Pod 不需要被重新啓動。
相反，在使用中文件系統將作爲卷擴展的一部分自動調整大小。
文件系統的擴展是在一個 Pod 引用調整後的卷時才發生的，所以如果沒有引用卷的 Pod 在運行，文件系統的擴展就不會發生。

<!--
## How can I learn more?

Check out additional documentation on this feature here: http://k8s.io/docs/concepts/storage/persistent-volumes.
-->
## 更多信息 {#how-can-i-learn-more}

在這裏查看有關這一特性的其他文檔：
https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes/