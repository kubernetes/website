---
title: 持久卷
feature:
  title: 儲存編排
  description: >
    自動掛載所選儲存系統，包括本地儲存、諸如 <a href="https://cloud.google.com/storage/">GCP</a>
    或 <a href="https://aws.amazon.com/products/storage/">AWS</a>
    之類公有云提供商所提供的儲存或者諸如 NFS、iSCSI、Gluster、Ceph、Cinder
    或 Flocker 這類網路儲存系統。
content_type: concept
weight: 20
---
<!--
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
- xing-yang
title: Persistent Volumes
feature:
  title: Storage orchestration
  description: >
    Automatically mount the storage system of your choice, whether from local storage, a public cloud provider such as <a href="https://cloud.google.com/storage/">GCP</a> or <a href="https://aws.amazon.com/products/storage/">AWS</a>, or a network storage system such as NFS, iSCSI, Gluster, Ceph, Cinder, or Flocker.
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
This document describes _persistent volumes_ in Kubernetes. Familiarity with [volumes](/docs/concepts/storage/volumes/) is suggested.
-->
本文描述 Kubernetes 中的 _持久卷（Persistent Volume）_ 。
建議先熟悉[卷（Volume）](/zh-cn/docs/concepts/storage/volumes/)的概念。

<!-- body -->

<!--
## Introduction

Managing storage is a distinct problem from managing compute instances. The PersistentVolume subsystem provides an API for users and administrators that abstracts details of how storage is provided from how it is consumed. To do this, we introduce two new API resources:  PersistentVolume and PersistentVolumeClaim.
-->
## 介紹  {#introduction}

儲存的管理是一個與計算例項的管理完全不同的問題。PersistentVolume 子系統為使用者
和管理員提供了一組 API，將儲存如何供應的細節從其如何被使用中抽象出來。
為了實現這點，我們引入了兩個新的 API 資源：PersistentVolume 和
PersistentVolumeClaim。

<!--
A _PersistentVolume_ (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using [Storage Classes](/docs/concepts/storage/storage-classes/). It is a resource in the cluster just like a node is a cluster resource. PVs are volume plugins like Volumes, but have a lifecycle independent of any individual Pod that uses the PV. This API object captures the details of the implementation of the storage, be that NFS, iSCSI, or a cloud-provider-specific storage system.
-->
持久卷（PersistentVolume，PV）是叢集中的一塊儲存，可以由管理員事先供應，或者
使用[儲存類（Storage Class）](/zh-cn/docs/concepts/storage/storage-classes/)來動態供應。
持久卷是叢集資源，就像節點也是叢集資源一樣。PV 持久卷和普通的 Volume 一樣，也是使用
卷外掛來實現的，只是它們擁有獨立於任何使用 PV 的 Pod 的生命週期。
此 API 物件中記述了儲存的實現細節，無論其背後是 NFS、iSCSI 還是特定於雲平臺的儲存系統。

<!--
A _PersistentVolumeClaim_ (PVC) is a request for storage by a user. It is similar to a Pod. Pods consume node resources and PVCs consume PV resources. Pods can request specific levels of resources (CPU and Memory).  Claims can request specific size and access modes (e.g., they can be mounted ReadWriteOnce, ReadOnlyMany or ReadWriteMany, see [AccessModes](#access-modes)).
-->
持久卷申領（PersistentVolumeClaim，PVC）表達的是使用者對儲存的請求。概念上與 Pod 類似。
Pod 會耗用節點資源，而 PVC 申領會耗用 PV 資源。Pod 可以請求特定數量的資源（CPU
和記憶體）；同樣 PVC 申領也可以請求特定的大小和訪問模式
（例如，可以要求 PV 卷能夠以 ReadWriteOnce、ReadOnlyMany 或 ReadWriteMany
模式之一來掛載，參見[訪問模式](#access-modes)）。

<!--
While PersistentVolumeClaims allow a user to consume abstract storage resources, it is common that users need PersistentVolumes with varying properties, such as performance, for different problems. Cluster administrators need to be able to offer a variety of PersistentVolumes that differ in more ways than size and access modes, without exposing users to the details of how those volumes are implemented. For these needs, there is the _StorageClass_ resource.

See the [detailed walkthrough with working examples](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).
-->
儘管 PersistentVolumeClaim 允許使用者消耗抽象的儲存資源，常見的情況是針對不同的
問題使用者需要的是具有不同屬性（如，效能）的 PersistentVolume 卷。
叢集管理員需要能夠提供不同性質的 PersistentVolume，並且這些 PV 卷之間的差別不
僅限於卷大小和訪問模式，同時又不能將卷是如何實現的這些細節暴露給使用者。
為了滿足這類需求，就有了 _儲存類（StorageClass）_ 資源。

參見[基於執行示例的詳細演練](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)。

<!--
## Lifecycle of a volume and claim

PVs are resources in the cluster. PVCs are requests for those resources and also act as claim checks to the resource. The interaction between PVs and PVCs follows this lifecycle:

### Provisioning

There are two ways PVs may be provisioned: statically or dynamically.
-->
## 卷和申領的生命週期   {#lifecycle-of-a-volume-and-claim}

PV 卷是叢集中的資源。PVC 申領是對這些資源的請求，也被用來執行對資源的申領檢查。
PV 卷和 PVC 申領之間的互動遵循如下生命週期：

### 供應   {#provisioning}

PV 卷的供應有兩種方式：靜態供應或動態供應。

<!--
#### Static

A cluster administrator creates a number of PVs. They carry the details of the real storage, which is available for use by cluster users. They exist in the Kubernetes API and are available for consumption.
-->
#### 靜態供應  {#static}

叢集管理員建立若干 PV 卷。這些卷物件帶有真實儲存的細節資訊，並且對叢集
使用者可用（可見）。PV 卷物件存在於 Kubernetes  API 中，可供使用者消費（使用）。

<!--
#### Dynamic

When none of the static PVs the administrator created match a user's PersistentVolumeClaim,
the cluster may try to dynamically provision a volume specially for the PVC.
This provisioning is based on StorageClasses: the PVC must request a
[storage class](/docs/concepts/storage/storage-classes/) and
the administrator must have created and configured that class for dynamic
provisioning to occur. Claims that request the class `""` effectively disable
dynamic provisioning for themselves.
-->
#### 動態供應     {#dynamic}

如果管理員所建立的所有靜態 PV 卷都無法與使用者的 PersistentVolumeClaim 匹配，
叢集可以嘗試為該 PVC 申領動態供應一個儲存卷。
這一供應操作是基於 StorageClass 來實現的：PVC 申領必須請求某個
[儲存類](/zh-cn/docs/concepts/storage/storage-classes/)，同時叢集管理員必須
已經建立並配置了該類，這樣動態供應卷的動作才會發生。
如果 PVC 申領指定儲存類為 `""`，則相當於為自身禁止使用動態供應的卷。

<!--
To enable dynamic storage provisioning based on storage class, the cluster administrator
needs to enable the `DefaultStorageClass` [admission controller](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
on the API server. This can be done, for example, by ensuring that `DefaultStorageClass` is
among the comma-delimited, ordered list of values for the `-enable-admission-plugins` flag of
the API server component. For more information on API server command-line flags,
check [kube-apiserver](/docs/admin/kube-apiserver/) documentation.
-->
為了基於儲存類完成動態的儲存供應，叢集管理員需要在 API 伺服器上啟用
`DefaultStorageClass` [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)。
舉例而言，可以透過保證 `DefaultStorageClass` 出現在 API 伺服器元件的
`--enable-admission-plugins` 標誌值中實現這點；該標誌的值可以是逗號
分隔的有序列表。關於 API 伺服器標誌的更多資訊，可以參考
[kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)
文件。

<!--
### Binding

A user creates, or in the case of dynamic provisioning, has already created, a PersistentVolumeClaim with a specific amount of storage requested and with certain access modes. A control loop in the master watches for new PVCs, finds a matching PV (if possible), and binds them together. If a PV was dynamically provisioned for a new PVC, the loop will always bind that PV to the PVC. Otherwise, the user will always get at least what they asked for, but the volume may be in excess of what was requested. Once bound, PersistentVolumeClaim binds are exclusive, regardless of how they were bound. A PVC to PV binding is a one-to-one mapping, using a ClaimRef which is a bi-directional binding between the PersistentVolume and the PersistentVolumeClaim.

Claims will remain unbound indefinitely if a matching volume does not exist. Claims will be bound as matching volumes become available. For example, a cluster provisioned with many 50Gi PVs would not match a PVC requesting 100Gi. The PVC can be bound when a 100Gi PV is added to the cluster.
-->
### 繫結     {#binding}

使用者建立一個帶有特定儲存容量和特定訪問模式需求的 PersistentVolumeClaim 物件；
在動態供應場景下，這個 PVC 物件可能已經建立完畢。
主控節點中的控制迴路監測新的 PVC 物件，尋找與之匹配的 PV 卷（如果可能的話），
並將二者繫結到一起。
如果為了新的 PVC 申領動態供應了 PV 卷，則控制迴路總是將該 PV 卷繫結到這一 PVC 申領。
否則，使用者總是能夠獲得他們所請求的資源，只是所獲得的 PV 卷可能會超出所請求的配置。
一旦繫結關係建立，則 PersistentVolumeClaim 繫結就是排他性的，無論該 PVC 申領是
如何與 PV 卷建立的繫結關係。
PVC 申領與 PV 卷之間的繫結是一種一對一的對映，實現上使用 ClaimRef 來記述 PV 卷
與 PVC 申領間的雙向繫結關係。

<!--
Claims will remain unbound indefinitely if a matching volume does not exist. Claims will be bound as matching volumes become available. For example, a cluster provisioned with many 50Gi PVs would not match a PVC requesting 100Gi. The PVC can be bound when a 100Gi PV is added to the cluster.
-->
如果找不到匹配的 PV 卷，PVC 申領會無限期地處於未繫結狀態。
當與之匹配的 PV 卷可用時，PVC 申領會被繫結。
例如，即使某叢集上供應了很多 50 Gi 大小的 PV 卷，也無法與請求
100 Gi 大小的儲存的 PVC 匹配。當新的 100 Gi PV 卷被加入到叢集時，該
PVC 才有可能被繫結。

<!--
### Using

Pods use claims as volumes. The cluster inspects the claim to find the bound volume and mounts that volume for a Pod. For volumes that support multiple access modes, the user specifies which mode is desired when using their claim as a volume in a Pod.
-->
### 使用    {#using}

Pod 將 PVC 申領當做儲存捲來使用。叢集會檢視 PVC 申領，找到所繫結的卷，並
為 Pod 掛載該卷。對於支援多種訪問模式的卷，使用者要在 Pod 中以卷的形式使用申領
時指定期望的訪問模式。

<!--
Once a user has a claim and that claim is bound, the bound PV belongs to the user for as long as they need it. Users schedule Pods and access their claimed PVs by including a `persistentVolumeClaim` section in a Pod's `volumes` block. See [Claims As Volumes](#claims-as-volumes) for more details on this.
-->
一旦使用者有了申領物件並且該申領已經被繫結，則所繫結的 PV 卷在使用者仍然需要它期間
一直屬於該使用者。使用者透過在 Pod 的 `volumes` 塊中包含 `persistentVolumeClaim`
節區來排程 Pod，訪問所申領的 PV 卷。
相關細節可參閱[使用申領作為卷](#claims-as-volumes)。

<!--
### Storage Object in Use Protection

The purpose of the Storage Object in Use Protection feature is to ensure that PersistentVolumeClaims (PVCs) in active use by a Pod and PersistentVolume (PVs) that are bound to PVCs are not removed from the system, as this may result in data loss.
-->
### 保護使用中的儲存物件   {#storage-object-in-use-protection}

保護使用中的儲存物件（Storage Object in Use Protection）這一功能特性的目的
是確保仍被 Pod 使用的 PersistentVolumeClaim（PVC）物件及其所繫結的
PersistentVolume（PV）物件在系統中不會被刪除，因為這樣做可能會引起資料丟失。

<!--
PVC is in active use by a Pod when a Pod object exists that is using the PVC.
-->
{{< note >}}
當使用某 PVC 的 Pod 物件仍然存在時，認為該 PVC 仍被此 Pod 使用。
{{< /note >}}

<!--
If a user deletes a PVC in active use by a Pod, the PVC is not removed immediately. PVC removal is postponed until the PVC is no longer actively used by any Pods. Also, if an admin deletes a PV that is bound to a PVC, the PV is not removed immediately. PV removal is postponed until the PV is no longer bound to a PVC.

You can see that a PVC is protected when the PVC's status is `Terminating` and the `Finalizers` list includes `kubernetes.io/pvc-protection`:
-->
如果使用者刪除被某 Pod 使用的 PVC 物件，該 PVC 申領不會被立即移除。
PVC 物件的移除會被推遲，直至其不再被任何 Pod 使用。
此外，如果管理員刪除已繫結到某 PVC 申領的 PV 卷，該 PV 卷也不會被立即移除。
PV 物件的移除也要推遲到該 PV 不再繫結到 PVC。

你可以看到當 PVC 的狀態為 `Terminating` 且其 `Finalizers` 列表中包含
`kubernetes.io/pvc-protection` 時，PVC 物件是處於被保護狀態的。

```shell
kubectl describe pvc hostpath
```
```
Name:          hostpath
Namespace:     default
StorageClass:  example-hostpath
Status:        Terminating
Volume:
Labels:        <none>
Annotations:   volume.beta.kubernetes.io/storage-class=example-hostpath
               volume.beta.kubernetes.io/storage-provisioner=example.com/hostpath
Finalizers:    [kubernetes.io/pvc-protection]
...
```

<!--
You can see that a PV is protected when the PV's status is `Terminating` and the `Finalizers` list includes `kubernetes.io/pv-protection` too:
-->
你也可以看到當 PV 物件的狀態為 `Terminating` 且其 `Finalizers` 列表中包含
`kubernetes.io/pv-protection` 時，PV 物件是處於被保護狀態的。

```shell
kubectl describe pv task-pv-volume
```
```
Name:            task-pv-volume
Labels:          type=local
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    standard
Status:          Terminating
Claim:
Reclaim Policy:  Delete
Access Modes:    RWO
Capacity:        1Gi
Message:
Source:
    Type:          HostPath (bare host directory volume)
    Path:          /tmp/data
    HostPathType:
Events:            <none>
```

<!--
### Reclaiming

When a user is done with their volume, they can delete the PVC objects from the API that allows reclamation of the resource. The reclaim policy for a PersistentVolume tells the cluster what to do with the volume after it has been released of its claim. Currently, volumes can either be Retained, Recycled, or Deleted.
-->
### 回收   {#reclaiming}

當用戶不再使用其儲存卷時，他們可以從 API 中將 PVC 物件刪除，從而允許
該資源被回收再利用。PersistentVolume 物件的回收策略告訴叢集，當其被
從申領中釋放時如何處理該資料卷。
目前，資料卷可以被 Retained（保留）、Recycled（回收）或 Deleted（刪除）。

<!--
#### Retain

The `Retain` reclaim policy allows for manual reclamation of the resource. When the PersistentVolumeClaim is deleted, the PersistentVolume still exists and the volume is considered "released". But it is not yet available for another claim because the previous claimant's data remains on the volume. An administrator can manually reclaim the volume with the following steps.
-->
#### 保留（Retain）    {#retain}

回收策略 `Retain` 使得使用者可以手動回收資源。當 PersistentVolumeClaim 物件
被刪除時，PersistentVolume 卷仍然存在，對應的資料卷被視為"已釋放（released）"。
由於捲上仍然存在這前一申領人的資料，該卷還不能用於其他申領。
管理員可以透過下面的步驟來手動回收該卷：

<!--
1. Delete the PersistentVolume. The associated storage asset in external infrastructure (such as an AWS EBS, GCE PD, Azure Disk, or Cinder volume) still exists after the PV is deleted.
1. Manually clean up the data on the associated storage asset accordingly.
1. Manually delete the associated storage asset.

If you want to reuse the same storage asset, create a new PersistentVolume with the same storage asset definition.
-->
1. 刪除 PersistentVolume 物件。與之相關的、位於外部基礎設施中的儲存資產
   （例如 AWS EBS、GCE PD、Azure Disk 或 Cinder 卷）在 PV 刪除之後仍然存在。
1. 根據情況，手動清除所關聯的儲存資產上的資料。
1. 手動刪除所關聯的儲存資產。

如果你希望重用該儲存資產，可以基於儲存資產的定義建立新的 PersistentVolume 卷物件。

<!--
#### Delete

For volume plugins that support the `Delete` reclaim policy, deletion removes both the PersistentVolume object from Kubernetes, as well as the associated storage asset in the external infrastructure, such as an AWS EBS, GCE PD, Azure Disk, or Cinder volume. Volumes that were dynamically provisioned inherit the [reclaim policy of their StorageClass](#reclaim-policy), which defaults to `Delete`. The administrator should configure the StorageClass according to users' expectations; otherwise, the PV must be edited or patched after it is created. See [Change the Reclaim Policy of a PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).
-->
#### 刪除（Delete）    {#delete}

對於支援 `Delete` 回收策略的卷外掛，刪除動作會將 PersistentVolume 物件從
Kubernetes 中移除，同時也會從外部基礎設施（如 AWS EBS、GCE PD、Azure Disk 或
Cinder 卷）中移除所關聯的儲存資產。
動態供應的卷會繼承[其 StorageClass 中設定的回收策略](#reclaim-policy)，該策略預設
為 `Delete`。
管理員需要根據使用者的期望來配置 StorageClass；否則 PV 卷被建立之後必須要被
編輯或者修補。參閱[更改 PV 卷的回收策略](/zh-cn/docs/tasks/administer-cluster/change-pv-reclaim-policy/).

<!--
#### Recycle

The `Recycle` reclaim policy is deprecated. Instead, the recommended approach is to use dynamic provisioning.

If supported by the underlying volume plugin, the `Recycle` reclaim policy performs a basic scrub (`rm -rf /thevolume/*`) on the volume and makes it available again for a new claim.
-->
#### 回收（Recycle）     {#recycle}

{{< warning >}}
回收策略 `Recycle` 已被廢棄。取而代之的建議方案是使用動態供應。
{{< /warning >}}

如果下層的卷外掛支援，回收策略 `Recycle` 會在捲上執行一些基本的
擦除（`rm -rf /thevolume/*`）操作，之後允許該卷用於新的 PVC 申領。

<!--
However, an administrator can configure a custom recycler Pod template using
the Kubernetes controller manager command line arguments as described in the
[reference](/docs/reference/command-line-tools-reference/kube-controller-manager/).
The custom recycler Pod template must contain a `volumes` specification, as
shown in the example below:
-->
不過，管理員可以按
[參考資料](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)
中所述，使用 Kubernetes 控制器管理器命令列引數來配置一個定製的回收器（Recycler）
Pod 模板。此定製的回收器 Pod 模板必須包含一個 `volumes` 規約，如下例所示：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pv-recycler
  namespace: default
spec:
  restartPolicy: Never
  volumes:
  - name: vol
    hostPath:
      path: /any/path/it/will/be/replaced
  containers:
  - name: pv-recycler
    image: "k8s.gcr.io/busybox"
    command: ["/bin/sh", "-c", "test -e /scrub && rm -rf /scrub/..?* /scrub/.[!.]* /scrub/*  && test -z \"$(ls -A /scrub)\" || exit 1"]
    volumeMounts:
    - name: vol
      mountPath: /scrub
```

<!--
However, the particular path specified in the custom recycler Pod template in the `volumes` part is replaced with the particular path of the volume that is being recycled.
-->
定製回收器 Pod 模板中在 `volumes` 部分所指定的特定路徑要替換為
正被回收的卷的路徑。

<!--
### PersistentVolume deletion protection finalizer

Finalizers can be added on a PersistentVolume to ensure that PersistentVolumes
having `Delete` reclaim policy are deleted only after the backing storage are deleted.
-->
### PersistentVolume 刪除保護 finalizer  {#persistentvolume-deletion-protection-finalizer}
{{< feature-state for_k8s_version="v1.23" state="alpha" >}}

可以在 PersistentVolume 上新增終結器（Finalizers），以確保只有在刪除對應的儲存後才刪除具有
`Delete` 回收策略的 PersistentVolume。

<!--
The newly introduced finalizers `kubernetes.io/pv-controller` and `external-provisioner.volume.kubernetes.io/finalizer`
are only added to dynamically provisioned volumes.

The finalizer `kubernetes.io/pv-controller` is added to in-tree plugin volumes. The following is an example
-->
新引入的 `kubernetes.io/pv-controller` 和 `external-provisioner.volume.kubernetes.io/finalizer`
終結器僅會被新增到動態製備的捲上。

終結器 `kubernetes.io/pv-controller` 會被新增到樹內外掛捲上。
下面是一個例子：

```shell
kubectl describe pv pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
Name:            pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
Labels:          <none>
Annotations:     kubernetes.io/createdby: vsphere-volume-dynamic-provisioner
                 pv.kubernetes.io/bound-by-controller: yes
                 pv.kubernetes.io/provisioned-by: kubernetes.io/vsphere-volume
Finalizers:      [kubernetes.io/pv-protection kubernetes.io/pv-controller]
StorageClass:    vcp-sc
Status:          Bound
Claim:           default/vcp-pvc-1
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        1Gi
Node Affinity:   <none>
Message:         
Source:
    Type:               vSphereVolume (a Persistent Disk resource in vSphere)
    VolumePath:         [vsanDatastore] d49c4a62-166f-ce12-c464-020077ba5d46/kubernetes-dynamic-pvc-74a498d6-3929-47e8-8c02-078c1ece4d78.vmdk
    FSType:             ext4
    StoragePolicyName:  vSAN Default Storage Policy
Events:                 <none>
```

<!--
The finalizer `external-provisioner.volume.kubernetes.io/finalizer` is added for CSI volumes.
The following is an example:
-->
終結器 `external-provisioner.volume.kubernetes.io/finalizer` 會被新增到 CSI 捲上。下面是一個例子：

```shell
Name:            pvc-2f0bab97-85a8-4552-8044-eb8be45cf48d
Labels:          <none>
Annotations:     pv.kubernetes.io/provisioned-by: csi.vsphere.vmware.com
Finalizers:      [kubernetes.io/pv-protection external-provisioner.volume.kubernetes.io/finalizer]
StorageClass:    fast
Status:          Bound
Claim:           demo-app/nginx-logs
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        200Mi
Node Affinity:   <none>
Message:         
Source:
    Type:              CSI (a Container Storage Interface (CSI) volume source)
    Driver:            csi.vsphere.vmware.com
    FSType:            ext4
    VolumeHandle:      44830fa8-79b4-406b-8b58-621ba25353fd
    ReadOnly:          false
    VolumeAttributes:      storage.kubernetes.io/csiProvisionerIdentity=1648442357185-8081-csi.vsphere.vmware.com
                           type=vSphere CNS Block Volume
Events:                <none>
```

<!--
Enabling the `CSIMigration` feature for a specific in-tree volume plugin will remove
the `kubernetes.io/pv-controller` finalizer, while adding the `external-provisioner.volume.kubernetes.io/finalizer`
finalizer. Similarly, disabling `CSIMigration` will remove the `external-provisioner.volume.kubernetes.io/finalizer`
finalizer, while adding the `kubernetes.io/pv-controller` finalizer.
-->
為特定的樹內卷外掛啟用 `CSIMigration` 特性將刪除 `kubernetes.io/pv-controller` 終結器，
同時新增 `external-provisioner.volume.kubernetes.io/finalizer` 終結器。
同樣，禁用 `CSIMigration` 將刪除 `external-provisioner.volume.kubernetes.io/finalizer` 終結器，
同時新增 `kubernetes.io/pv-controller` 終結器。

<!--
### Reserving a PersistentVolume

The control plane can [bind PersistentVolumeClaims to matching PersistentVolumes](#binding) in the
cluster. However, if you want a PVC to bind to a specific PV, you need to pre-bind them.
-->
### 預留 PersistentVolume  {#reserving-a-persistentvolume}

透過在 PersistentVolumeClaim 中指定 PersistentVolume，你可以宣告該特定
PV 與 PVC 之間的繫結關係。如果該 PersistentVolume 存在且未被透過其
`claimRef` 欄位預留給 PersistentVolumeClaim，則該 PersistentVolume
會和該 PersistentVolumeClaim 繫結到一起。

<!--
The binding happens regardless of some volume matching criteria, including node affinity.
The control plane still checks that [storage class](/docs/concepts/storage/storage-classes/), access modes, and requested storage size are valid.
-->
繫結操作不會考慮某些卷匹配條件是否滿足，包括節點親和性等等。
控制面仍然會檢查
[儲存類](/zh-cn/docs/concepts/storage/storage-classes/)、訪問模式和所請求的
儲存尺寸都是合法的。

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: foo
spec:
  storageClassName: "" # 此處須顯式設定空字串，否則會被設定為預設的 StorageClass
  volumeName: foo-pv
  ...
```

<!--
This method does not guarantee any binding privileges to the PersistentVolume. If other PersistentVolumeClaims could use the PV that you specify, you first need to reserve that storage volume. Specify the relevant PersistentVolumeClaim in the `claimRef` field of the PV so that other PVCs can not bind to it.
-->
此方法無法對 PersistentVolume 的繫結特權做出任何形式的保證。
如果有其他 PersistentVolumeClaim 可以使用你所指定的 PV，則你應該首先預留
該儲存卷。你可以將 PV 的 `claimRef` 欄位設定為相關的 PersistentVolumeClaim
以確保其他 PVC 不會繫結到該 PV 卷。

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: foo-pv
spec:
  storageClassName: ""
  claimRef:
    name: foo-pvc
    namespace: foo
  ...
```

<!--
This is useful if you want to consume PersistentVolumes that have their `claimPolicy` set
to `Retain`, including cases where you are reusing an existing PV.
-->
如果你想要使用 `claimPolicy` 屬性設定為 `Retain` 的 PersistentVolume 卷
時，包括你希望複用現有的 PV 卷時，這點是很有用的

<!--
### Expanding Persistent Volumes Claims
-->
### 擴充 PVC 申領   {#expanding-persistent-volumes-claims}

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

<!--
Support for expanding PersistentVolumeClaims (PVCs) is enabled by default. You can expand
the following types of volumes:
-->
現在，對擴充 PVC 申領的支援預設處於被啟用狀態。你可以擴充以下型別的卷：

* azureDisk
* azureFile
* awsElasticBlockStore
* cinder (deprecated)
* {{< glossary_tooltip text="csi" term_id="csi" >}}
* flexVolume (deprecated)
* gcePersistentDisk
* glusterfs
* rbd
* portworxVolume

<!--
You can only expand a PVC if its storage class's `allowVolumeExpansion` field is set to true.
-->
只有當 PVC 的儲存類中將 `allowVolumeExpansion` 設定為 true 時，你才可以擴充該 PVC 申領。

``` yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gluster-vol-default
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

<!--
To request a larger volume for a PVC, edit the PVC object and specify a larger
size. This triggers expansion of the volume that backs the underlying PersistentVolume. A
new PersistentVolume is never created to satisfy the claim. Instead, an existing volume is resized.
-->
如果要為某 PVC 請求較大的儲存卷，可以編輯 PVC 物件，設定一個更大的尺寸值。
這一編輯操作會觸發為下層 PersistentVolume 提供儲存的卷的擴充。
Kubernetes 不會建立新的 PV 捲來滿足此申領的請求。
與之相反，現有的卷會被調整大小。

<!--
Directly editing the size of a PersistentVolume can prevent an automatic resize of that volume.
If you edit the capacity of a PersistentVolume, and then edit the `.spec` of a matching
PersistentVolumeClaim to make the size of the PersistentVolumeClaim match the PersistentVolume,
then no storage resize happens.
The Kubernetes control plane will see that the desired state of both resources matches,
conclude that the backing volume size has been manually
increased and that no resize is necessary.
-->
{{< warning >}}
直接編輯 PersistentVolume 的大小可以阻止該卷自動調整大小。
如果對 PersistentVolume 的容量進行編輯，然後又將其所對應的
PersistentVolumeClaim 的 `.spec` 進行編輯，使該 PersistentVolumeClaim
的大小匹配 PersistentVolume 的話，則不會發生儲存大小的調整。
Kubernetes 控制平面將看到兩個資源的所需狀態匹配，並認為其後備卷的大小
已被手動增加，無需調整。
{{< /warning >}}

<!--
#### CSI Volume expansion
-->
#### CSI 卷的擴充     {#csi-volume-expansion}

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

<!--
Support for expanding CSI volumes is enabled by default but it also requires a specific CSI driver to support volume expansion. Refer to documentation of the specific CSI driver for more information.
-->
對 CSI 卷的擴充能力預設是被啟用的，不過擴充 CSI 卷要求 CSI 驅動支援
卷擴充操作。可參閱特定 CSI 驅動的文件瞭解更多資訊。

<!--
#### Resizing a volume containing a file system

You can only resize volumes containing a file system if the file system is XFS, Ext3, or Ext4.
-->
#### 重設包含檔案系統的卷的大小 {#resizing-a-volume-containing-a-file-system}

只有卷中包含的檔案系統是 XFS、Ext3 或者 Ext4 時，你才可以重設卷的大小。

<!--
When a volume contains a file system, the file system is only resized when a new Pod is using
the PersistentVolumeClaim in `ReadWrite` mode. File system expansion is either done when a Pod is starting up
or when a Pod is running and the underlying file system supports online expansion.

FlexVolumes (deprecated since Kubernetes v1.23) allow resize if the driver is configured with the
`RequiresFSResize` capability to `true`. The FlexVolume can be resized on Pod restart.
-->
當卷中包含檔案系統時，只有在 Pod 使用 `ReadWrite` 模式來使用 PVC 申領的
情況下才能重設其檔案系統的大小。
檔案系統擴充的操作或者是在 Pod 啟動期間完成，或者在下層檔案系統支援線上
擴充的前提下在 Pod 執行期間完成。

如果 FlexVolumes 的驅動將 `RequiresFSResize` 能力設定為 `true`，則該
FlexVolume 卷（於 Kubernetes v1.23 棄用）可以在 Pod 重啟期間調整大小。

<!--
#### Resizing an in-use PersistentVolumeClaim
-->
#### 重設使用中 PVC 申領的大小    {#resizing-an-in-use-persistentvolumevlaim}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
In this case, you don't need to delete and recreate a Pod or deployment that is using an existing PVC.
Any in-use PVC automatically becomes available to its Pod as soon as its file system has been expanded.
This feature has no effect on PVCs that are not in use by a Pod or deployment. You must create a Pod that
uses the PVC before the expansion can complete.
-->
在這種情況下，你不需要刪除和重建正在使用某現有 PVC 的 Pod 或 Deployment。
所有使用中的 PVC 在其檔案系統被擴充之後，立即可供其 Pod 使用。
此功能特性對於沒有被 Pod 或 Deployment 使用的 PVC 而言沒有效果。
你必須在執行擴充套件操作之前建立一個使用該 PVC 的 Pod。

<!--
Similar to other volume types - FlexVolume volumes can also be expanded when in-use by a Pod.
-->
與其他卷型別類似，FlexVolume 卷也可以在被 Pod 使用期間執行擴充操作。

<!--
FlexVolume resize is possible only when the underlying driver supports resize.
-->
{{< note >}}
FlexVolume 卷的重設大小隻能在下層驅動支援重設大小的時候才可進行。
{{< /note >}}

<!--
Expanding EBS volumes is a time-consuming operation. Also, there is a per-volume quota of one modification every 6 hours.
-->
{{< note >}}
擴充 EBS 卷的操作非常耗時。同時還存在另一個配額限制：
每 6 小時只能執行一次（尺寸）修改操作。
{{< /note >}}

<!--
#### Recovering from Failure when Expanding Volumes

If a user specifies a new size that is too big to be satisfied by underlying storage system, expansion of PVC will be continuously retried until user or cluster administrator takes some action. This can be undesirable and hence Kubernetes provides following methods of recovering from such failures.
-->
#### 處理擴充捲過程中的失敗      {#recovering-from-failure-when-expanding-volumes}

如果使用者指定的新大小過大，底層儲存系統無法滿足，PVC 的擴充套件將不斷重試，
直到使用者或叢集管理員採取一些措施。這種情況是不希望發生的，因此 Kubernetes
提供了以下從此類故障中恢復的方法。

{{< tabs name="recovery_methods" >}}
{{% tab name="叢集管理員手動處理" %}}

<!--
If expanding underlying storage fails, the cluster administrator can manually recover the Persistent Volume Claim (PVC) state and cancel the resize requests. Otherwise, the resize requests are continuously retried by the controller without administrator intervention.
-->
如果擴充下層儲存的操作失敗，叢集管理員可以手動地恢復 PVC 申領的狀態並
取消重設大小的請求。否則，在沒有管理員干預的情況下，控制器會反覆重試
重設大小的操作。

<!--
1. Mark the PersistentVolume(PV) that is bound to the PersistentVolumeClaim(PVC) with `Retain` reclaim policy.
2. Delete the PVC. Since PV has `Retain` reclaim policy - we will not lose any data when we recreate the PVC.
3. Delete the `claimRef` entry from PV specs, so as new PVC can bind to it. This should make the PV `Available`.
4. Re-create the PVC with smaller size than PV and set `volumeName` field of the PVC to the name of the PV. This should bind new PVC to existing PV.
5. Don't forget to restore the reclaim policy of the PV.
-->
1. 將繫結到 PVC 申領的 PV 卷標記為 `Retain` 回收策略；
2. 刪除 PVC 物件。由於 PV 的回收策略為 `Retain`，我們不會在重建 PVC 時丟失資料。
3. 刪除 PV 規約中的 `claimRef` 項，這樣新的 PVC 可以繫結到該卷。
   這一操作會使得 PV 卷變為 "可用（Available）"。
4. 使用小於 PV 卷大小的尺寸重建 PVC，設定 PVC 的 `volumeName` 欄位為 PV 卷的名稱。
   這一操作將把新的 PVC 物件繫結到現有的 PV 卷。
5. 不要忘記恢復 PV 捲上設定的回收策略。

{{% /tab %}}
{{% tab name="透過請求擴充套件為更小尺寸" %}}
{{% feature-state for_k8s_version="v1.23" state="alpha" %}}

<!--
Recovery from failing PVC expansion by users is available as an alpha feature since Kubernetes 1.23. The `RecoverVolumeExpansionFailure` feature must be enabled for this feature to work. Refer to the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) documentation for more information.
-->
{{< note >}}
Kubernetes 從 1.23 版本開始將允許使用者恢復失敗的 PVC 擴充套件這一能力作為
alpha 特性支援。 `RecoverVolumeExpansionFailure` 必須被啟用以允許使用此特性。
可參考[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
文件瞭解更多資訊。
{{< /note >}}

<!--
If the feature gates `RecoverVolumeExpansionFailure` is
enabled in your cluster, and expansion has failed for a PVC, you can retry expansion with a
smaller size than the previously requested value. To request a new expansion attempt with a
smaller proposed size, edit `.spec.resources` for that PVC and choose a value that is less than the
value you previously tried.
This is useful if expansion to a higher value did not succeed because of capacity constraint.
If that has happened, or you suspect that it might have, you can retry expansion by specifying a
size that is within the capacity limits of underlying storage provider. You can monitor status of resize operation by watching `.status.resizeStatus` and events on the PVC.
-->
如果叢集中的特性門控 `RecoverVolumeExpansionFailure`
已啟用，在 PVC 的擴充套件發生失敗時，你可以使用比先前請求的值更小的尺寸來重試擴充套件。
要使用一個更小的尺寸嘗試請求新的擴充套件，請編輯該 PVC 的 `.spec.resources` 並選擇
一個比你之前所嘗試的值更小的值。
如果由於容量限制而無法成功擴充套件至更高的值，這將很有用。
如果發生了這種情況，或者你懷疑可能發生了這種情況，你可以透過指定一個在底層儲存供應容量
限制內的尺寸來重試擴充套件。你可以透過檢視 `.status.resizeStatus` 以及 PVC 上的事件
來監控調整大小操作的狀態。

<!--
Note that,
although you can specify a lower amount of storage than what was requested previously,
the new value must still be higher than `.status.capacity`.
Kubernetes does not support shrinking a PVC to less than its current size.
-->
請注意，
儘管你可以指定比之前的請求更低的儲存量，新值必須仍然高於 `.status.capacity`。
Kubernetes 不支援將 PVC 縮小到小於其當前的尺寸。

{{% /tab %}}
{{% /tabs %}}


<!--
## Types of Persistent Volumes

PersistentVolume types are implemented as plugins.  Kubernetes currently supports the following plugins:
-->

## 持久卷的型別     {#types-of-persistent-volumes}

PV 持久卷是用外掛的形式來實現的。Kubernetes 目前支援以下外掛：

<!--
* [`awsElasticBlockStore`](/docs/concepts/storage/volumes/#awselasticblockstore) - AWS Elastic Block Store (EBS)
* [`azureDisk`](/docs/concepts/storage/volumes/#azuredisk) - Azure Disk
* [`azureFile`](/docs/concepts/storage/volumes/#azurefile) - Azure File
* [`cephfs`](/docs/concepts/storage/volumes/#cephfs) - CephFS volume
* [`csi`](/docs/concepts/storage/volumes/#csi) - Container Storage Interface (CSI)
* [`fc`](/docs/concepts/storage/volumes/#fc) - Fibre Channel (FC) storage
* [`gcePersistentDisk`](/docs/concepts/storage/volumes/#gcepersistentdisk) - GCE Persistent Disk
* [`glusterfs`](/docs/concepts/storage/volumes/#glusterfs) - Glusterfs volume
* [`hostPath`](/docs/concepts/storage/volumes/#hostpath) - HostPath volume
  (for single node testing only; WILL NOT WORK in a multi-node cluster;
  consider using `local` volume instead)
* [`iscsi`](/docs/concepts/storage/volumes/#iscsi) - iSCSI (SCSI over IP) storage
* [`local`](/docs/concepts/storage/volumes/#local) - local storage devices
  mounted on nodes.
* [`nfs`](/docs/concepts/storage/volumes/#nfs) - Network File System (NFS) storage
* [`portworxVolume`](/docs/concepts/storage/volumes/#portworxvolume) - Portworx volume
* [`rbd`](/docs/concepts/storage/volumes/#rbd) - Rados Block Device (RBD) volume
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume) - vSphere VMDK volume
-->
* [`awsElasticBlockStore`](/zh-cn/docs/concepts/storage/volumes/#awselasticblockstore) - AWS 彈性塊儲存（EBS）
* [`azureDisk`](/zh-cn/docs/concepts/storage/volumes/#azuredisk) - Azure Disk
* [`azureFile`](/zh-cn/docs/concepts/storage/volumes/#azurefile) - Azure File
* [`cephfs`](/zh-cn/docs/concepts/storage/volumes/#cephfs) - CephFS volume
* [`csi`](/zh-cn/docs/concepts/storage/volumes/#csi) - 容器儲存介面 (CSI)
* [`fc`](/zh-cn/docs/concepts/storage/volumes/#fc) - Fibre Channel (FC) 儲存
* [`gcePersistentDisk`](/zh-cn/docs/concepts/storage/volumes/#gcepersistentdisk) - GCE 持久化盤
* [`glusterfs`](/zh-cn/docs/concepts/storage/volumes/#glusterfs) - Glusterfs 卷
* [`hostPath`](/zh-cn/docs/concepts/storage/volumes/#hostpath) - HostPath 卷
  （僅供單節點測試使用；不適用於多節點叢集；
  請嘗試使用 `local` 卷作為替代）
* [`iscsi`](/zh-cn/docs/concepts/storage/volumes/#iscsi) - iSCSI (SCSI over IP) 儲存
* [`local`](/zh-cn/docs/concepts/storage/volumes/#local) - 節點上掛載的本地儲存裝置
* [`nfs`](/zh-cn/docs/concepts/storage/volumes/#nfs) - 網路檔案系統 (NFS) 儲存
* [`portworxVolume`](/zh-cn/docs/concepts/storage/volumes/#portworxvolume) - Portworx 卷
* [`rbd`](/zh-cn/docs/concepts/storage/volumes/#rbd) - Rados 塊裝置 (RBD) 卷
* [`vsphereVolume`](/zh-cn/docs/concepts/storage/volumes/#vspherevolume) - vSphere VMDK 卷

<!-- 
The following types of PersistentVolume are deprecated. This means that support is still available but will be removed in a future Kubernetes release.

* [`cinder`](/docs/concepts/storage/volumes/#cinder) - Cinder (OpenStack block storage)
  (**deprecated** in v1.18)
* [`flexVolume`](/docs/concepts/storage/volumes/#flexvolume) - FlexVolume
  (**deprecated** in v1.23)
* [`flocker`](/docs/concepts/storage/volumes/#flocker) - Flocker storage
  (**deprecated** in v1.22)
* [`quobyte`](/docs/concepts/storage/volumes/#quobyte) - Quobyte volume
  (**deprecated** in v1.22)
* [`storageos`](/docs/concepts/storage/volumes/#storageos) - StorageOS volume
  (**deprecated** in v1.22)
-->

以下的持久卷已被棄用。這意味著當前仍是支援的，但是 Kubernetes 將來的發行版會將其移除。

* [`cinder`](/docs/concepts/storage/volumes/#cinder) - Cinder（OpenStack 塊儲存）（於 v1.18 **棄用**）
* [`flexVolume`](/zh-cn/docs/concepts/storage/volumes/#flexVolume) - FlexVolume （於 v1.23 **棄用**）
* [`flocker`](/docs/concepts/storage/volumes/#flocker) - Flocker 儲存（於 v1.22 **棄用**）
* [`quobyte`](/docs/concepts/storage/volumes/#quobyte) - Quobyte 卷
（於 v1.22 **棄用**）
* [`storageos`](/docs/concepts/storage/volumes/#storageos) - StorageOS 卷（於 v1.22 **棄用**）

<!-- 
Older versions of Kubernetes also supported the following in-tree PersistentVolume types:

* `photonPersistentDisk` - Photon controller persistent disk.
  (**not available** after v1.15)
* [`scaleIO`](/docs/concepts/storage/volumes/#scaleio) - ScaleIO volume
  (**not available** after v1.21)
-->

舊版本的 Kubernetes 仍支援這些“樹內（In-Tree）”持久卷型別：

* `photonPersistentDisk` - Photon 控制器持久化盤。（v1.15 之後 **不可用**）
* [`scaleIO`](/docs/concepts/storage/volumes/#scaleio) - ScaleIO 卷（v1.21 之後 **不可用**）

<!--
## Persistent Volumes

Each PV contains a spec and status, which is the specification and status of the volume.
The name of a PersistentVolume object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
## 持久卷    {#persistent-volumes}

每個 PV 物件都包含 `spec` 部分和 `status` 部分，分別對應卷的規約和狀態。
PersistentVolume 物件的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 172.17.0.2
```

<!--
Helper programs relating to the volume type may be required for consumption of a PersistentVolume within a cluster.  In this example, the PersistentVolume is of type NFS and the helper program /sbin/mount.nfs is required to support the mounting of NFS filesystems.
-->
{{< note >}}
在叢集中使用持久卷儲存通常需要一些特定於具體卷型別的輔助程式。
在這個例子中，PersistentVolume 是 NFS 型別的，因此需要輔助程式 `/sbin/mount.nfs`
來支援掛載 NFS 檔案系統。
{{< /note >}}

<!--
### Capacity

Generally, a PV will have a specific storage capacity. This is set using the PV's `capacity` attribute. Read the glossary term [Quantity](/docs/reference/glossary/?all=true#term-quantity) to understand the units expected by `capacity`.

Currently, storage size is the only resource that can be set or requested.  Future attributes may include IOPS, throughput, etc.
-->
### 容量    {#capacity}

一般而言，每個 PV 卷都有確定的儲存容量。
容量屬性是使用 PV 物件的 `capacity` 屬性來設定的。
參考詞彙表中的
[量綱（Quantity）](/zh-cn/docs/reference/glossary/?all=true#term-quantity)
詞條，瞭解 `capacity` 欄位可以接受的單位。

目前，儲存大小是可以設定和請求的唯一資源。
未來可能會包含 IOPS、吞吐量等屬性。

<!--
### Volume Mode
-->
### 卷模式     {#volume-mode}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
Kubernetes supports two `volumeModes` of PersistentVolumes: `Filesystem` and `Block`.

`volumeMode` is an optional API parameter.
`Filesystem` is the default mode used when `volumeMode` parameter is omitted.

A volume with `volumeMode: Filesystem` is *mounted* into Pods into a directory. If the volume
is backed by a block device and the device is empty, Kubernetes creates a filesystem
on the device before mounting it for the first time.
-->
針對 PV 持久卷，Kubernetes
支援兩種卷模式（`volumeModes`）：`Filesystem（檔案系統）` 和 `Block（塊）`。
`volumeMode` 是一個可選的 API 引數。
如果該引數被省略，預設的卷模式是 `Filesystem`。

`volumeMode` 屬性設定為 `Filesystem` 的卷會被 Pod *掛載（Mount）* 到某個目錄。
如果卷的儲存來自某塊裝置而該裝置目前為空，Kuberneretes 會在第一次掛載卷之前
在裝置上建立檔案系統。

<!--
You can set the value of `volumeMode` to `Block` to use a volume as a raw block device.
Such volume is presented into a Pod as a block device, without any filesystem on it.
This mode is useful to provide a Pod the fastest possible way to access a volume, without
any filesystem layer between the Pod and the volume. On the other hand, the application
running in the Pod must know how to handle a raw block device.
See [Raw Block Volume Support](#raw-block-volume-support)
for an example on how to use a volume with `volumeMode: Block` in a Pod.
-->
你可以將 `volumeMode` 設定為 `Block`，以便將卷作為原始塊裝置來使用。
這類卷以塊裝置的方式交給 Pod 使用，其上沒有任何檔案系統。
這種模式對於為 Pod 提供一種使用最快可能方式來訪問卷而言很有幫助，Pod 和
卷之間不存在檔案系統層。另外，Pod 中執行的應用必須知道如何處理原始塊裝置。
關於如何在 Pod 中使用 `volumeMode: Block` 的卷，可參閱
[原始塊卷支援](#raw-block-volume-support)。

<!--
### Access Modes

A PersistentVolume can be mounted on a host in any way supported by the resource provider. As shown in the table below, providers will have different capabilities and each PV's access modes are set to the specific modes supported by that particular volume.  For example, NFS can support multiple read/write clients, but a specific NFS PV might be exported on the server as read-only. Each PV gets its own set of access modes describing that specific PV's capabilities.
-->
### 訪問模式   {#access-modes}

PersistentVolume 卷可以用資源提供者所支援的任何方式掛載到宿主系統上。
如下表所示，提供者（驅動）的能力不同，每個 PV 卷的訪問模式都會設定為
對應卷所支援的模式值。
例如，NFS 可以支援多個讀寫客戶，但是某個特定的 NFS PV 卷可能在伺服器
上以只讀的方式匯出。每個 PV 卷都會獲得自身的訪問模式集合，描述的是
特定 PV 卷的能力。

<!--
The access modes are:

`ReadWriteOnce` 
: the volume can be mounted as read-write by a single node. ReadWriteOnce access mode still can allow multiple pods to access the volume when the pods are running on the same node.

`ReadOnlyMany`
: the volume can be mounted as read-only by many nodes.

`ReadWriteMany`
: the volume can be mounted as read-write by many nodes.

 `ReadWriteOncePod`
: the volume can be mounted as read-write by a single Pod. Use ReadWriteOncePod access mode if you want to ensure that only one pod across whole cluster can read that PVC or write to it. This is only supported for CSI volumes and Kubernetes version 1.22+.

The blog article [Introducing Single Pod Access Mode for PersistentVolumes](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/) covers this in more detail.
-->
訪問模式有：

`ReadWriteOnce` 
: 卷可以被一個節點以讀寫方式掛載。
ReadWriteOnce 訪問模式也允許執行在同一節點上的多個 Pod 訪問卷。 

`ReadOnlyMany`
: 卷可以被多個節點以只讀方式掛載。

`ReadWriteMany`
: 卷可以被多個節點以讀寫方式掛載。

`ReadWriteOncePod`
: 卷可以被單個 Pod 以讀寫方式掛載。
如果你想確保整個叢集中只有一個 Pod 可以讀取或寫入該 PVC，
請使用ReadWriteOncePod 訪問模式。這隻支援 CSI 卷以及需要 Kubernetes 1.22 以上版本。

這篇部落格文章 [Introducing Single Pod Access Mode for PersistentVolumes](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/)
描述了更詳細的內容。

<!--
In the CLI, the access modes are abbreviated to:

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany
* RWOP - ReadWriteOncePod
-->
在命令列介面（CLI）中，訪問模式也使用以下縮寫形式：

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany
* RWOP - ReadWriteOncePod

{{< note >}}
<!--
Kubernetes uses volume access modes to match PersistentVolumeClaims and PersistentVolumes.
In some cases, the volume access modes also constrain where the PersistentVolume can be mounted.
Volume access modes do **not** enforce write protection once the storage has been mounted.
Even if the access modes are specified as ReadWriteOnce, ReadOnlyMany, or ReadWriteMany, they don't set any constraints on the volume.
For example, even if a PersistentVolume is created as ReadOnlyMany, it is no guarantee that it will be read-only.
If the access modes are specified as ReadWriteOncePod, the volume is constrained and can be mounted on only a single Pod.
-->
Kubernetes 使用卷訪問模式來匹配 PersistentVolumeClaim 和 PersistentVolume。
在某些場合下，卷訪問模式也會限制 PersistentVolume 可以掛載的位置。
卷訪問模式並**不會**在儲存已經被掛載的情況下為其實施防寫。
即使訪問模式設定為 ReadWriteOnce、ReadOnlyMany 或 ReadWriteMany，它們也不會對卷形成限制。
例如，即使某個卷建立時設定為 ReadOnlyMany，也無法保證該卷是隻讀的。
如果訪問模式設定為 ReadWriteOncePod，則卷會被限制起來並且只能掛載到一個 Pod 上。
{{< /note >}}

<!--
> __Important!__ A volume can only be mounted using one access mode at a time, even if it supports many.  For example, a GCEPersistentDisk can be mounted as ReadWriteOnce by a single node or ReadOnlyMany by many nodes, but not at the same time.
-->
> __重要提醒！__ 每個卷同一時刻只能以一種訪問模式掛載，即使該卷能夠支援
> 多種訪問模式。例如，一個 GCEPersistentDisk 卷可以被某節點以 ReadWriteOnce
> 模式掛載，或者被多個節點以 ReadOnlyMany 模式掛載，但不可以同時以兩種模式
> 掛載。

<!--
| Volume Plugin        | ReadWriteOnce          | ReadOnlyMany          | ReadWriteMany|
-->

| 卷外掛                | ReadWriteOnce          | ReadOnlyMany          | ReadWriteMany | ReadWriteOncePod       |
| :---                 | :---:                  | :---:                 | :---:         | -                      |
| AWSElasticBlockStore | &#x2713;               | -                     | -             | -                      |
| AzureFile            | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| AzureDisk            | &#x2713;               | -                     | -             | -                      |
| CephFS               | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| Cinder               | &#x2713;               | -                     | -             | -                      |
| CSI                  | 取決於驅動               | 取決於驅動             | 取決於驅動      | 取決於驅動               |
| FC                   | &#x2713;               | &#x2713;              | -             | -                      |
| FlexVolume           | &#x2713;               | &#x2713;              | 取決於驅動      | -                      |
| Flocker              | &#x2713;               | -                     | -             | -                      |
| GCEPersistentDisk    | &#x2713;               | &#x2713;              | -             | -                      |
| Glusterfs            | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| HostPath             | &#x2713;               | -                     | -             | -                      |
| iSCSI                | &#x2713;               | &#x2713;              | -             | -                      |
| Quobyte              | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| NFS                  | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| RBD                  | &#x2713;               | &#x2713;              | -             | -                      |
| VsphereVolume        | &#x2713;               | -                     | - （Pod 運行於同一節點上時可行） | -       |
| PortworxVolume       | &#x2713;               | -                     | &#x2713;      | -                  | - |
| StorageOS            | &#x2713;               | -                     | -             | -                      |

<!--
### Class

A PV can have a class, which is specified by setting the
`storageClassName` attribute to the name of a
[StorageClass](/docs/concepts/storage/storage-classes/).
A PV of a particular class can only be bound to PVCs requesting
that class. A PV with no `storageClassName` has no class and can only be bound
to PVCs that request no particular class.
-->
### 類    {#class}

每個 PV 可以屬於某個類（Class），透過將其 `storageClassName` 屬性設定為某個
[StorageClass](/zh-cn/docs/concepts/storage/storage-classes/) 的名稱來指定。
特定類的 PV 卷只能繫結到請求該類儲存卷的 PVC 申領。
未設定 `storageClassName` 的 PV 卷沒有類設定，只能繫結到那些沒有指定特定
儲存類的 PVC 申領。

<!--
In the past, the annotation `volume.beta.kubernetes.io/storage-class` was used instead
of the `storageClassName` attribute. This annotation is still working; however,
it will become fully deprecated in a future Kubernetes release.
-->
早前，Kubernetes 使用註解 `volume.beta.kubernetes.io/storage-class` 而不是
`storageClassName` 屬性。這一註解目前仍然起作用，不過在將來的 Kubernetes
釋出版本中該註解會被徹底廢棄。


<!--
### Reclaim Policy

Current reclaim policies are:

* Retain -- manual reclamation
* Recycle -- basic scrub (`rm -rf /thevolume/*`)
* Delete -- associated storage asset such as AWS EBS, GCE PD, Azure Disk, or OpenStack Cinder volume is deleted

Currently, only NFS and HostPath support recycling. AWS EBS, GCE PD, Azure Disk, and Cinder volumes support deletion.
-->
### 回收策略   {#reclaim-policy}

目前的回收策略有：

* Retain -- 手動回收
* Recycle -- 基本擦除   (`rm -rf /thevolume/*`)
* Delete -- 諸如 AWS EBS、GCE PD、Azure Disk 或 OpenStack Cinder 卷這類關聯儲存資產也被刪除

目前，僅 NFS 和 HostPath 支援回收（Recycle）。
AWS EBS、GCE PD、Azure Disk 和 Cinder 卷都支援刪除（Delete）。

<!--
### Mount Options

A Kubernetes administrator can specify additional mount options for when a Persistent Volume is mounted on a node.
-->
### 掛載選項    {#mount-options}

Kubernetes 管理員可以指定持久卷被掛載到節點上時使用的附加掛載選項。

<!--
Not all Persistent Volume types support mount options.
-->
{{< note >}}
並非所有持久卷型別都支援掛載選項。
{{< /note >}}

<!--
The following volume types support mount options:
-->
以下卷型別支援掛載選項：

* `awsElasticBlockStore`
* `azureDisk`
* `azureFile`
* `cephfs`
* `cinder` (**已棄用**於 v1.18)
* `gcePersistentDisk`
* `glusterfs`
* `iscsi`
* `nfs`
* `quobyte` (**已棄用**於 v1.22)
* `rbd`
* `storageos` (**已棄用**於 v1.22)
* `vsphereVolume`

<!--
Mount options are not validated, If a mount option is invalid, the mount fails.
-->
Kubernetes 不對掛載選項執行合法性檢查。如果掛載選項是非法的，掛載就會失敗。

<!--
In the past, the annotation `volume.beta.kubernetes.io/mount-options` was used instead
of the `mountOptions` attribute. This annotation is still working; however,
it will become fully deprecated in a future Kubernetes release.
-->
早前，Kubernetes 使用註解 `volume.beta.kubernetes.io/mount-options` 而不是
`mountOptions` 屬性。這一註解目前仍然起作用，不過在將來的 Kubernetes
釋出版本中該註解會被徹底廢棄。

<!--
### Node Affinity
-->
### 節點親和性   {#node-affinity}

<!--
A PV can specify node affinity to define constraints that limit what nodes this volume can be accessed from. Pods that use a PV will only be scheduled to nodes that are selected by the node affinity. To specify node affinity, set `nodeAffinity` in the `.spec` of a PV. The [PersistentVolume](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec) API reference has more details on this field.
-->
每個 PV 卷可以透過設定節點親和性來定義一些約束，進而限制從哪些節點上可以訪問此卷。
使用這些卷的 Pod 只會被排程到節點親和性規則所選擇的節點上執行。
要設定節點親和性，配置 PV 卷 `.spec` 中的 `nodeAffinity`。 
[持久卷](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)
API 參考關於該欄位的更多細節。

<!--
For most volume types, you do not need to set this field. It is automatically populated for [AWS EBS](/docs/concepts/storage/volumes/#awselasticblockstore), [GCE PD](/docs/concepts/storage/volumes/#gcepersistentdisk) and [Azure Disk](/docs/concepts/storage/volumes/#azuredisk) volume block types. You need to explicitly set this for [local](/docs/concepts/storage/volumes/#local) volumes.
-->
{{< note >}}
對大多數型別的卷而言，你不需要設定節點親和性欄位。
[AWS EBS](/zh-cn/docs/concepts/storage/volumes/#awselasticblockstore)、
[GCE PD](/zh-cn/docs/concepts/storage/volumes/#gcepersistentdisk) 和
[Azure Disk](/zh-cn/docs/concepts/storage/volumes/#azuredisk) 卷型別都能
自動設定相關欄位。
你需要為 [local](/zh-cn/docs/concepts/storage/volumes/#local) 卷顯式地設定
此屬性。
{{< /note >}}

<!--
### Phase

A volume will be in one of the following phases:

* Available -- a free resource that is not yet bound to a claim
* Bound -- the volume is bound to a claim
* Released -- the claim has been deleted, but the resource is not yet reclaimed by the cluster
* Failed -- the volume has failed its automatic reclamation

The CLI will show the name of the PVC bound to the PV.
-->
### 階段   {#phase}

每個卷會處於以下階段（Phase）之一：

* Available（可用）-- 卷是一個空閒資源，尚未繫結到任何申領；
* Bound（已繫結）-- 該卷已經繫結到某申領；
* Released（已釋放）-- 所繫結的申領已被刪除，但是資源尚未被叢集回收；
* Failed（失敗）-- 卷的自動回收操作失敗。

命令列介面能夠顯示繫結到某 PV 卷的 PVC 物件。

## PersistentVolumeClaims

<!--
Each PVC contains a spec and status, which is the specification and status of the claim.
The name of a PersistentVolumeClaim object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
每個 PVC 物件都有 `spec` 和 `status` 部分，分別對應申領的規約和狀態。
PersistentVolumeClaim 物件的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).


```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 8Gi
  storageClassName: slow
  selector:
    matchLabels:
      release: "stable"
    matchExpressions:
      - {key: environment, operator: In, values: [dev]}
```

<!--
### Access Modes

Claims use [the same conventions as volumes](#access-modes) when requesting storage with specific access modes.
-->
### 訪問模式 {#access-modes}

申領在請求具有特定訪問模式的儲存時，使用與卷相同的[訪問模式約定](#access-modes)。

<!--
### Volume Modes

Claims use [the same convention as volumes](#volume-mode) to indicate the consumption of the volume as either a filesystem or block device.
-->
### 卷模式 {#volume-modes}

申領使用[與卷相同的約定](#access-modes)來表明是將卷作為檔案系統還是塊裝置來使用。

<!--
### Resources

Claims, like Pods, can request specific quantities of a resource. In this case, the request is for storage. The same [resource model](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) applies to both volumes and claims.
-->
### 資源    {#resources}

申領和 Pod 一樣，也可以請求特定數量的資源。在這個上下文中，請求的資源是儲存。
卷和申領都使用相同的
[資源模型](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md)。

<!--
### Selector

Claims can specify a [label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors) to further filter the set of volumes. Only the volumes whose labels match the selector can be bound to the claim. The selector can consist of two fields:
-->
### 選擇算符    {#selector}

申領可以設定[標籤選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)
來進一步過濾卷集合。只有標籤與選擇算符相匹配的卷能夠繫結到申領上。
選擇算符包含兩個欄位：

<!--
* `matchLabels` - the volume must have a label with this value
* `matchExpressions` - a list of requirements made by specifying key, list of values, and operator that relates the key and values. Valid operators include In, NotIn, Exists, and DoesNotExist.

All of the requirements, from both `matchLabels` and `matchExpressions`, are ANDed together – they must all be satisfied in order to match.
-->
* `matchLabels` - 卷必須包含帶有此值的標籤
* `matchExpressions` - 透過設定鍵（key）、值列表和運算子（operator）
  來構造的需求。合法的運算子有 In、NotIn、Exists 和 DoesNotExist。

來自 `matchLabels` 和 `matchExpressions` 的所有需求都按邏輯與的方式組合在一起。
這些需求都必須被滿足才被視為匹配。

<!--
### Class

A claim can request a particular class by specifying the name of a
[StorageClass](/docs/concepts/storage/storage-classes/)
using the attribute `storageClassName`.
Only PVs of the requested class, ones with the same `storageClassName` as the PVC, can
be bound to the PVC.
-->
### 類      {#class}

申領可以透過為 `storageClassName` 屬性設定
[StorageClass](/zh-cn/docs/concepts/storage/storage-classes/) 的名稱來請求特定的儲存類。
只有所請求的類的 PV 卷，即 `storageClassName` 值與 PVC 設定相同的 PV 卷，
才能繫結到 PVC 申領。

<!--
PVCs don't necessarily have to request a class. A PVC with its `storageClassName` set
equal to `""` is always interpreted to be requesting a PV with no class, so it
can only be bound to PVs with no class (no annotation or one set equal to
`""`). A PVC with no `storageClassName` is not quite the same and is treated differently
by the cluster, depending on whether the
[`DefaultStorageClass` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
is turned on.
-->
PVC 申領不必一定要請求某個類。如果 PVC 的 `storageClassName` 屬性值設定為 `""`，
則被視為要請求的是沒有設定儲存類的 PV 卷，因此這一 PVC 申領只能繫結到未設定
儲存類的 PV 卷（未設定註解或者註解值為 `""` 的 PersistentVolume（PV）物件在系統中不會被刪除，因為這樣做可能會引起資料丟失。
未設定 `storageClassName` 的 PVC 與此大不相同，也會被叢集作不同處理。
具體篩查方式取決於
[`DefaultStorageClass` 准入控制器外掛](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
是否被啟用。

<!--
* If the admission plugin is turned on, the administrator may specify a
  default StorageClass. All PVCs that have no `storageClassName` can be bound only to
  PVs of that default. Specifying a default StorageClass is done by setting the
  annotation `storageclass.kubernetes.io/is-default-class` equal to `true` in
  a StorageClass object. If the administrator does not specify a default, the
  cluster responds to PVC creation as if the admission plugin were turned off. If
  more than one default is specified, the admission plugin forbids the creation of
  all PVCs.
* If the admission plugin is turned off, there is no notion of a default
  StorageClass. All PVCs that have no `storageClassName` can be bound only to PVs that
  have no class. In this case, the PVCs that have no `storageClassName` are treated the
  same way as PVCs that have their `storageClassName` set to `""`.
-->
* 如果准入控制器外掛被啟用，則管理員可以設定一個預設的 StorageClass。
  所有未設定 `storageClassName` 的 PVC 都只能繫結到隸屬於預設儲存類的 PV 卷。
  設定預設 StorageClass 的工作是透過將對應 StorageClass 物件的註解
  `storageclass.kubernetes.io/is-default-class` 賦值為 `true` 來完成的。
  如果管理員未設定預設儲存類，叢集對 PVC 建立的處理方式與未啟用准入控制器外掛
  時相同。如果設定的預設儲存類不止一個，准入控制外掛會禁止所有建立 PVC 操作。
* 如果准入控制器外掛被關閉，則不存在預設 StorageClass 的說法。
  所有未設定 `storageClassName` 的 PVC 都只能繫結到未設定儲存類的 PV 卷。
  在這種情況下，未設定 `storageClassName` 的 PVC 與 `storageClassName` 設定未
  `""` 的 PVC 的處理方式相同。

<!--
Depending on installation method, a default StorageClass may be deployed
to a Kubernetes cluster by addon manager during installation.

When a PVC specifies a `selector` in addition to requesting a StorageClass,
the requirements are ANDed together: only a PV of the requested class and with
the requested labels may be bound to the PVC.
-->
取決於安裝方法，預設的 StorageClass 可能在叢集安裝期間由外掛管理器（Addon
Manager）部署到叢集中。

當某 PVC 除了請求 StorageClass 之外還設定了 `selector`，則這兩種需求會按
邏輯與關係處理：只有隸屬於所請求類且帶有所請求標籤的 PV 才能繫結到 PVC。

<!--
Currently, a PVC with a non-empty `selector` can't have a PV dynamically provisioned for it.
-->
{{< note >}}
目前，設定了非空 `selector` 的 PVC 物件無法讓叢集為其動態供應 PV 卷。
{{< /note >}}

<!--
In the past, the annotation `volume.beta.kubernetes.io/storage-class` was used instead
of `storageClassName` attribute. This annotation is still working; however,
it won't be supported in a future Kubernetes release.
-->
早前，Kubernetes 使用註解 `volume.beta.kubernetes.io/storage-class` 而不是
`storageClassName` 屬性。這一註解目前仍然起作用，不過在將來的 Kubernetes
釋出版本中該註解會被徹底廢棄。

<!--
## Claims As Volumes

Pods access storage by using the claim as a volume. Claims must exist in the same namespace as the Pod using the claim. The cluster finds the claim in the Pod's namespace and uses it to get the PersistentVolume backing the claim. The volume is then mounted to the host and into the Pod.
-->
## 使用申領作為卷     {#claims-as-volumes}

Pod 將申領作為捲來使用，並藉此訪問儲存資源。
申領必須位於使用它的 Pod 所在的同一名字空間內。
叢集在 Pod 的名字空間中查詢申領，並使用它來獲得申領所使用的 PV 卷。
之後，卷會被掛載到宿主上並掛載到 Pod 中。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myclaim
```

<!--
### A Note on Namespaces

PersistentVolumes binds are exclusive, and since PersistentVolumeClaims are namespaced objects, mounting claims with "Many" modes (`ROX`, `RWX`) is only possible within one namespace.
-->
### 關於名字空間的說明    {#a-note-on-namespaces}

PersistentVolume 卷的繫結是排他性的。
由於 PersistentVolumeClaim 是名字空間作用域的物件，使用
"Many" 模式（`ROX`、`RWX`）來掛載申領的操作只能在同一名字空間內進行。

<!--
### PersistentVolumes typed `hostPath`

A `hostPath` PersistentVolume uses a file or directory on the Node to emulate network-attached storage.
See [an example of `hostPath` typed volume](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume).
-->
### 型別為 `hostpath` 的 PersistentVolume  {#persistentvolumes-typed-hostpath}

`hostPath` PersistentVolume 使用節點上的檔案或目錄來模擬網路附加（network-attached）儲存。
相關細節可參閱[`hostPath` 卷示例](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume)。

<!--
## Raw Block Volume Support
-->
## 原始塊卷支援   {#raw-block-volume-support}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
The following volume plugins support raw block volumes, including dynamic provisioning where
applicable:
-->
以下卷外掛支援原始塊卷，包括其動態供應（如果支援的話）的卷：

* AWSElasticBlockStore
* AzureDisk
* CSI
* FC （光纖通道）
* GCEPersistentDisk
* iSCSI
* Local 卷
* OpenStack Cinder
* RBD （Ceph 塊裝置）
* VsphereVolume

<!--
### PersistentVolume using a Raw Block Volume {#persistent-volume-using-a-raw-block-volume}
-->
### 使用原始塊卷的持久卷      {#persistent-volume-using-a-raw-block-volume}

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: block-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  persistentVolumeReclaimPolicy: Retain
  fc:
    targetWWNs: ["50060e801049cfd1"]
    lun: 0
    readOnly: false
```

<!--
### PersistentVolumeClaim requesting a Raw Block Volume {#persistent-volume-claim-requesting-a-raw-block-volume}
-->
### 申請原始塊卷的 PVC 申領      {#persistent-volume-claim-requesting-a-raw-block-volume}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: block-pvc
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  resources:
    requests:
      storage: 10Gi
```

<!--

## Volume populators and data sources

Kubernetes supports custom volume populators.
To use custom volume populators, you must enable the `AnyVolumeDataSource`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for
the kube-apiserver and kube-controller-manager.

Volume populators take advantage of a PVC spec field called `dataSourceRef`. Unlike the
`dataSource` field, which can only contain either a reference to another PersistentVolumeClaim
or to a VolumeSnapshot, the `dataSourceRef` field can contain a reference to any object in the
same namespace, except for core objects other than PVCs. For clusters that have the feature
gate enabled, use of the `dataSourceRef` is preferred over `dataSource`.
-->

## 卷填充器（Populator）與資料來源      {#volume-populators-and-data-sources}

{{< feature-state for_k8s_version="v1.24" state="beta" >}}

{{< note >}}
Kubernetes 支援自定義的卷填充器；要使用自定義的卷填充器，你必須為
kube-apiserver 和 kube-controller-manager 啟用 `AnyVolumeDataSource`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
{{< /note >}}

卷填充器利用了 PVC 規約欄位 `dataSourceRef`。
不像 `dataSource` 欄位只能包含對另一個持久卷申領或卷快照的引用，
`dataSourceRef` 欄位可以包含對同一名稱空間中任何物件的引用（不包含除 PVC 以外的核心資源）。
對於啟用了特性門控的叢集，使用 `dataSourceRef` 比 `dataSource` 更好。

<!--
## Data source references

The `dataSourceRef` field behaves almost the same as the `dataSource` field. If either one is
specified while the other is not, the API server will give both fields the same value. Neither
field can be changed after creation, and attempting to specify different values for the two
fields will result in a validation error. Therefore the two fields will always have the same
contents.
-->

## 資料來源引用   {#data-source-references}

`dataSourceRef` 欄位的行為與 `dataSource` 欄位幾乎相同。
如果其中一個欄位被指定而另一個欄位沒有被指定，API 伺服器將給兩個欄位相同的值。
這兩個欄位都不能在建立後改變，如果試圖為這兩個欄位指定不同的值，將導致驗證錯誤。
因此，這兩個欄位將總是有相同的內容。

<!--
There are two differences between the `dataSourceRef` field and the `dataSource` field that
users should be aware of:
* The `dataSource` field ignores invalid values (as if the field was blank) while the
  `dataSourceRef` field never ignores values and will cause an error if an invalid value is
  used. Invalid values are any core object (objects with no apiGroup) except for PVCs.
* The `dataSourceRef` field may contain different types of objects, while the `dataSource` field
  only allows PVCs and VolumeSnapshots.

Users should always use `dataSourceRef` on clusters that have the feature gate enabled, and
fall back to `dataSource` on clusters that do not. It is not necessary to look at both fields
under any circumstance. The duplicated values with slightly different semantics exist only for
backwards compatibility. In particular, a mixture of older and newer controllers are able to
interoperate because the fields are the same.
-->
在 `dataSourceRef` 欄位和 `dataSource` 欄位之間有兩個使用者應該注意的區別：
* `dataSource` 欄位會忽略無效的值（如同是空值），
   而 `dataSourceRef` 欄位永遠不會忽略值，並且若填入一個無效的值，會導致錯誤。
   無效值指的是 PVC 之外的核心物件（沒有 apiGroup 的物件）。
* `dataSourceRef` 欄位可以包含不同型別的物件，而 `dataSource` 欄位只允許 PVC 和卷快照。

使用者應該始終在啟用了特性門控的叢集上使用 `dataSourceRef`，而在沒有啟用特性門控的叢集上使用 `dataSource`。
在任何情況下都沒有必要檢視這兩個欄位。
這兩個欄位的值看似相同但是語義稍微不一樣，是為了向後相容。
特別是混用舊版本和新版本的控制器時，它們能夠互通。

<!--
### Using volume populators

Volume populators are {{< glossary_tooltip text="controllers" term_id="controller" >}} that can
create non-empty volumes, where the contents of the volume are determined by a Custom Resource.
Users create a populated volume by referring to a Custom Resource using the `dataSourceRef` field:
-->
## 使用卷填充器   {#using-volume-populators}

卷填充器是能建立非空卷的{{< glossary_tooltip text="控制器" term_id="controller" >}}，
其卷的內容透過一個自定義資源決定。
使用者透過使用 `dataSourceRef` 欄位引用自定義資源來建立一個被填充的卷：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: populated-pvc
spec:
  dataSourceRef:
    name: example-name
    kind: ExampleDataSource
    apiGroup: example.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

<!--
Because volume populators are external components, attempts to create a PVC that uses one
can fail if not all the correct components are installed. External controllers should generate
events on the PVC to provide feedback on the status of the creation, including warnings if
the PVC cannot be created due to some missing component.

You can install the alpha [volume data source validator](https://github.com/kubernetes-csi/volume-data-source-validator)
controller into your cluster. That controller generates warning Events on a PVC in the case that no populator
is registered to handle that kind of data source. When a suitable populator is installed for a PVC, it's the
responsibility of that populator controller to report Events that relate to volume creation and issues during
the process.
-->
因為卷填充器是外部元件，如果沒有安裝所有正確的元件，試圖建立一個使用卷填充器的 PVC 就會失敗。
外部控制器應該在 PVC 上產生事件，以提供建立狀態的反饋，包括在由於缺少某些元件而無法建立 PVC 的情況下發出警告。

你可以把 alpha 版本的[卷資料來源驗證器](https://github.com/kubernetes-csi/volume-data-source-validator)
控制器安裝到你的叢集中。
如果沒有填充器處理該資料來源的情況下，該控制器會在 PVC 上產生警告事件。
當一個合適的填充器被安裝到 PVC 上時，該控制器的職責是上報與卷建立有關的事件，以及在該過程中發生的問題。

<!--
### Pod specification adding Raw Block Device path in container
-->
### 在容器中新增原始塊裝置路徑的 Pod 規約

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-block-volume
spec:
  containers:
    - name: fc-container
      image: fedora:26
      command: ["/bin/sh", "-c"]
      args: [ "tail -f /dev/null" ]
      volumeDevices:
        - name: data
          devicePath: /dev/xvda
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: block-pvc
```

<!--
When adding a raw block device for a Pod, you specify the device path in the container instead of a mount path.
-->
{{< note >}}
向 Pod 中新增原始塊裝置時，你要在容器內設定裝置路徑而不是掛載路徑。
{{< /note >}}

<!--
### Binding Block Volumes

If a user requests a raw block volume by indicating this using the `volumeMode` field in the PersistentVolumeClaim spec, the binding rules differ slightly from previous releases that didn't consider this mode as part of the spec.
Listed is a table of possible combinations the user and admin might specify for requesting a raw block device. The table indicates if the volume will be bound or not given the combinations:
Volume binding matrix for statically provisioned volumes:
-->
### 繫結塊卷     {#binding-block-volumes}

如果使用者透過 PersistentVolumeClaim 規約的 `volumeMode` 欄位來表明對原始
塊裝置的請求，繫結規則與之前版本中未在規約中考慮此模式的實現略有不同。
下面列舉的表格是使用者和管理員可以為請求原始塊裝置所作設定的組合。
此表格表明在不同的組合下卷是否會被繫結。

靜態供應卷的卷繫結矩陣：

<!--
| PV volumeMode | PVC volumeMode  | Result           |
| --------------|:---------------:| ----------------:|
|   unspecified | unspecified     | BIND             |
|   unspecified | Block           | NO BIND          |
|   unspecified | Filesystem      | BIND             |
|   Block       | unspecified     | NO BIND          |
|   Block       | Block           | BIND             |
|   Block       | Filesystem      | NO BIND          |
|   Filesystem  | Filesystem      | BIND             |
|   Filesystem  | Block           | NO BIND          |
|   Filesystem  | unspecified     | BIND             |
-->
| PV volumeMode | PVC volumeMode  | Result           |
| --------------|:---------------:| ----------------:|
|   未指定      | 未指定          | 繫結             |
|   未指定      | Block           | 不繫結           |
|   未指定      | Filesystem      | 繫結             |
|   Block       | 未指定          | 不繫結           |
|   Block       | Block           | 繫結             |
|   Block       | Filesystem      | 不繫結           |
|   Filesystem  | Filesystem      | 繫結             |
|   Filesystem  | Block           | 不繫結           |
|   Filesystem  | 未指定          | 繫結             |

<!--
Only statically provisioned volumes are supported for alpha release. Administrators should take care to consider these values when working with raw block devices.
-->
{{< note >}}
Alpha 發行版本中僅支援靜態供應的卷。
管理員需要在處理原始塊裝置時小心處理這些值。
{{< /note >}}

<!--
## Volume Snapshot and Restore Volume from Snapshot Support
-->
## 對卷快照及從卷快照中恢復卷的支援

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

<!--
Volume snapshot feature was added to support CSI Volume Plugins only. For details, see [volume snapshots](/docs/concepts/storage/volume-snapshots/).

To enable support for restoring a volume from a volume snapshot data source, enable the
`VolumeSnapshotDataSource` feature gate on the apiserver and controller-manager.
-->
卷快照（Volume Snapshot）特性的新增僅是為了支援 CSI 卷外掛。
有關細節可參閱[卷快照](/zh-cn/docs/concepts/storage/volume-snapshots/)文件。

要啟用從卷快照資料來源恢復資料卷的支援，可在 API 伺服器和控制器管理器上啟用
`VolumeSnapshotDataSource` 特性門控。

<!--
### Create a PersistentVolumeClaim from a Volume Snapshot {#create-persistent-volume-claim-from-volume-snapshot}
-->
### 基於卷快照建立 PVC 申領     {#create-persistent-volume-claim-from-volume-snapshot}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restore-pvc
spec:
  storageClassName: csi-hostpath-sc
  dataSource:
    name: new-snapshot-test
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

<!--
## Volume Cloning

[Volume Cloning](/docs/concepts/storage/volume-pvc-datasource/) only available for CSI volume plugins.
-->
## 卷克隆     {#volume-cloning}

[卷克隆](/zh-cn/docs/concepts/storage/volume-pvc-datasource/)功能特性僅適用於
CSI 卷外掛。

<!--
### Create PersistentVolumeClaim from an existing PVC {#create-persistent-volume-claim-from-an-existing-pvc}
-->
### 基於現有 PVC 建立新的 PVC 申領    {#create-persistent-volume-claim-from-an-existing-pvc}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cloned-pvc
spec:
  storageClassName: my-csi-plugin
  dataSource:
    name: existing-src-pvc-name
    kind: PersistentVolumeClaim
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

<!--
## Writing Portable Configuration

If you're writing configuration templates or examples that run on a wide range of clusters
and need persistent storage, it is recommended that you use the following pattern:
-->
## 編寫可移植的配置   {#writing-portable-configuration}

如果你要編寫配置模板和示例用來在很多叢集上執行並且需要永續性儲存，建議你使用以下模式：

<!--
- Include PersistentVolumeClaim objects in your bundle of config (alongside
  Deployments, ConfigMaps, etc).
- Do not include PersistentVolume objects in the config, since the user instantiating
  the config may not have permission to create PersistentVolumes.
-->
- 將 PersistentVolumeClaim 物件包含到你的配置包（Bundle）中，和 Deployment
  以及 ConfigMap 等放在一起。
- 不要在配置中包含 PersistentVolume 物件，因為對配置進行例項化的使用者很可能
  沒有建立 PersistentVolume 的許可權。
<!--
- Give the user the option of providing a storage class name when instantiating
  the template.
  - If the user provides a storage class name, put that value into the
    `persistentVolumeClaim.storageClassName` field.
    This will cause the PVC to match the right storage
    class if the cluster has StorageClasses enabled by the admin.
  - If the user does not provide a storage class name, leave the
    `persistentVolumeClaim.storageClassName` field as nil. This will cause a
    PV to be automatically provisioned for the user with the default StorageClass
    in the cluster. Many cluster environments have a default StorageClass installed,
    or administrators can create their own default StorageClass.
-->
- 為使用者提供在例項化模板時指定儲存類名稱的能力。
  - 仍按使用者提供儲存類名稱，將該名稱放到 `persistentVolumeClaim.storageClassName` 欄位中。
    這樣會使得 PVC 在叢集被管理員啟用了儲存類支援時能夠匹配到正確的儲存類，
  - 如果使用者未指定儲存類名稱，將 `persistentVolumeClaim.storageClassName` 留空（nil）。
    這樣，叢集會使用預設 `StorageClass` 為使用者自動供應一個儲存卷。
    很多叢集環境都配置了預設的 `StorageClass`，或者管理員也可以自行建立預設的
    `StorageClass`。
<!--
- In your tooling, watch for PVCs that are not getting bound after some time
  and surface this to the user, as this may indicate that the cluster has no
  dynamic storage support (in which case the user should create a matching PV)
  or the cluster has no storage system (in which case the user cannot deploy
  config requiring PVCs).
-->
- 在你的工具鏈中，監測經過一段時間後仍未被繫結的 PVC 物件，要讓使用者知道這些物件，
  因為這可能意味著叢集不支援動態儲存（因而使用者必須先建立一個匹配的 PV），或者
  叢集沒有配置儲存系統（因而使用者無法配置需要 PVC 的工作負載配置）。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Creating a PersistentVolume](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume).
* Learn more about [Creating a PersistentVolumeClaim](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolumeclaim).
* Read the [Persistent Storage design document](https://github.com/kubernetes/design-proposals-archive/blob/main/storage/persistent-storage.md).
-->
* 進一步瞭解[建立持久卷](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume).
* 進一步學習[建立 PVC 申領](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolumeclaim).
* 閱讀[持久儲存的設計文件](https://github.com/kubernetes/design-proposals-archive/blob/main/storage/persistent-storage.md).

<!--
### API references {#reference}

Read about the APIs described in this page:

* [`PersistentVolume`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/)
* [`PersistentVolumeClaim`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/)
-->
### API 參考    {#reference}

閱讀以下頁面中描述的 API：

* [`PersistentVolume`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/)
* [`PersistentVolumeClaim`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/)

