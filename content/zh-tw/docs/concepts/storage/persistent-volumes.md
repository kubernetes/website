---
title: 持久卷
api_metadata:
- apiVersion: "v1"
  kind: "PersistentVolume"
- apiVersion: "v1"
  kind: "PersistentVolumeClaim"
feature:
  title: 存儲編排
  description: >
    自動掛載所選存儲系統，包括本地存儲、公有云提供商所提供的存儲或者諸如 iSCSI 或 NFS 這類網絡存儲系統。
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
api_metadata:
- apiVersion: "v1"
  kind: "PersistentVolume"
- apiVersion: "v1"
  kind: "PersistentVolumeClaim"
feature:
  title: Storage orchestration
  description: >
    Automatically mount the storage system of your choice, whether from local storage, a public cloud provider, or a network storage system such as iSCSI or NFS.
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
This document describes _persistent volumes_ in Kubernetes. Familiarity with
[volumes](/docs/concepts/storage/volumes/), [StorageClasses](/docs/concepts/storage/storage-classes/)
and [VolumeAttributesClasses](/docs/concepts/storage/volume-attributes-classes/) is suggested.
-->
本文描述 Kubernetes 中的**持久卷（Persistent Volumes）**。
建議先熟悉[卷（Volume）](/zh-cn/docs/concepts/storage/volumes/)、
[存儲類（StorageClass）](/zh-cn/docs/concepts/storage/storage-classes/)和
[卷屬性類（VolumeAttributesClass）](/zh-cn/docs/concepts/storage/volume-attributes-classes/)。

<!-- body -->

<!--
## Introduction

Managing storage is a distinct problem from managing compute instances.
The PersistentVolume subsystem provides an API for users and administrators
that abstracts details of how storage is provided from how it is consumed.
To do this, we introduce two new API resources: PersistentVolume and PersistentVolumeClaim.
-->
## 介紹  {#introduction}

存儲的管理是一個與計算實例的管理完全不同的問題。
PersistentVolume 子系統爲用戶和管理員提供了一組 API，
將存儲如何製備的細節從其如何被使用中抽象出來。
爲了實現這點，我們引入了兩個新的 API 資源：PersistentVolume 和
PersistentVolumeClaim。

<!--
A _PersistentVolume_ (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using [Storage Classes](/docs/concepts/storage/storage-classes/). It is a resource in the cluster just like a node is a cluster resource. PVs are volume plugins like Volumes, but have a lifecycle independent of any individual Pod that uses the PV. This API object captures the details of the implementation of the storage, be that NFS, iSCSI, or a cloud-provider-specific storage system.
-->
**持久卷（PersistentVolume，PV）** 是集羣中的一塊存儲，可以由管理員事先製備，
或者使用[存儲類（Storage Class）](/zh-cn/docs/concepts/storage/storage-classes/)來動態製備。
持久卷是集羣資源，就像節點也是集羣資源一樣。PV 持久卷和普通的 Volume 一樣，
也是使用卷插件來實現的，只是它們擁有獨立於任何使用 PV 的 Pod 的生命週期。
此 API 對象中記述了存儲的實現細節，無論其背後是 NFS、iSCSI 還是特定於雲平臺的存儲系統。

<!--
A _PersistentVolumeClaim_ (PVC) is a request for storage by a user. It is similar
to a Pod. Pods consume node resources and PVCs consume PV resources. Pods can
request specific levels of resources (CPU and Memory). Claims can request specific
size and access modes (e.g., they can be mounted ReadWriteOnce, ReadOnlyMany,
ReadWriteMany, or ReadWriteOncePod, see [AccessModes](#access-modes)).
-->
**持久卷申領（PersistentVolumeClaim，PVC）** 表達的是用戶對存儲的請求，概念上與 Pod 類似。
Pod 會耗用節點資源，而 PVC 申領會耗用 PV 資源。Pod 可以請求特定數量的資源（CPU
和內存）。同樣 PVC 申領也可以請求特定的大小和訪問模式
（例如，可以掛載爲 ReadWriteOnce、ReadOnlyMany、ReadWriteMany 或 ReadWriteOncePod，
請參閱[訪問模式](#access-modes)）。

<!--
While PersistentVolumeClaims allow a user to consume abstract storage resources,
it is common that users need PersistentVolumes with varying properties, such as
performance, for different problems. Cluster administrators need to be able to
offer a variety of PersistentVolumes that differ in more ways than size and access
modes, without exposing users to the details of how those volumes are implemented.
For these needs, there is the _StorageClass_ resource.

See the [detailed walkthrough with working examples](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).
-->
儘管 PersistentVolumeClaim 允許用戶消耗抽象的存儲資源，
常見的情況是針對不同的問題用戶需要的是具有不同屬性（如，性能）的 PersistentVolume 卷。
集羣管理員需要能夠提供不同性質的 PersistentVolume，
並且這些 PV 卷之間的差別不僅限於卷大小和訪問模式，同時又不能將卷是如何實現的這些細節暴露給用戶。
爲了滿足這類需求，就有了**存儲類（StorageClass）** 資源。

參見[基於運行示例的詳細演練](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)。

<!--
## Lifecycle of a volume and claim

PVs are resources in the cluster. PVCs are requests for those resources and also act
as claim checks to the resource. The interaction between PVs and PVCs follows this lifecycle:

### Provisioning

There are two ways PVs may be provisioned: statically or dynamically.
-->
## 卷和申領的生命週期   {#lifecycle-of-a-volume-and-claim}

PV 卷是集羣中的資源。PVC 申領是對這些資源的請求，也被用來執行對資源的申領檢查。
PV 卷和 PVC 申領之間的互動遵循如下生命週期：

### 製備   {#provisioning}

PV 卷的製備有兩種方式：靜態製備或動態製備。

<!--
#### Static

A cluster administrator creates a number of PVs. They carry the details of the
real storage, which is available for use by cluster users. They exist in the
Kubernetes API and are available for consumption.
-->
#### 靜態製備  {#static}

集羣管理員創建若干 PV 卷。這些卷對象帶有真實存儲的細節信息，
並且對集羣用戶可用（可見）。PV 卷對象存在於 Kubernetes API 中，可供用戶消費（使用）。

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
#### 動態製備     {#dynamic}

如果管理員所創建的所有靜態 PV 卷都無法與用戶的 PersistentVolumeClaim 匹配，
集羣可以嘗試爲該 PVC 申領動態製備一個存儲卷。
這一製備操作是基於 StorageClass 來實現的：PVC 申領必須請求某個
[存儲類](/zh-cn/docs/concepts/storage/storage-classes/)，
同時集羣管理員必須已經創建並配置了該類，這樣動態製備卷的動作纔會發生。
如果 PVC 申領指定存儲類爲 `""`，則相當於爲自身禁止使用動態製備的卷。

<!--
To enable dynamic storage provisioning based on storage class, the cluster administrator
needs to enable the `DefaultStorageClass`
[admission controller](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
on the API server. This can be done, for example, by ensuring that `DefaultStorageClass` is
among the comma-delimited, ordered list of values for the `--enable-admission-plugins` flag of
the API server component. For more information on API server command-line flags,
check [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) documentation.
-->
爲了基於存儲類完成動態的存儲製備，集羣管理員需要在 API 服務器上啓用 `DefaultStorageClass`
[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)。
舉例而言，可以通過保證 `DefaultStorageClass` 出現在 API 服務器組件的
`--enable-admission-plugins` 標誌值中實現這點；該標誌的值可以是逗號分隔的有序列表。
關於 API 服務器標誌的更多信息，可以參考
[kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)
文檔。

<!--
### Binding

A user creates, or in the case of dynamic provisioning, has already created,
a PersistentVolumeClaim with a specific amount of storage requested and with
certain access modes. A control loop in the control plane watches for new PVCs, finds
a matching PV (if possible), and binds them together. If a PV was dynamically
provisioned for a new PVC, the loop will always bind that PV to the PVC. Otherwise,
the user will always get at least what they asked for, but the volume may be in
excess of what was requested. Once bound, PersistentVolumeClaim binds are exclusive,
regardless of how they were bound. A PVC to PV binding is a one-to-one mapping,
using a ClaimRef which is a bi-directional binding between the PersistentVolume
and the PersistentVolumeClaim.
-->
### 綁定     {#binding}

用戶創建一個帶有特定存儲容量和特定訪問模式需求的 PersistentVolumeClaim 對象；
在動態製備場景下，這個 PVC 對象可能已經創建完畢。
控制平面中的控制迴路監測新的 PVC 對象，尋找與之匹配的 PV 卷（如果可能的話），
並將二者綁定到一起。
如果爲了新的 PVC 申領動態製備了 PV 卷，則控制迴路總是將該 PV 卷綁定到這一 PVC 申領。
否則，用戶總是能夠獲得他們所請求的資源，只是所獲得的 PV 卷可能會超出所請求的配置。
一旦綁定關係建立，則 PersistentVolumeClaim 綁定就是排他性的，
無論該 PVC 申領是如何與 PV 卷建立的綁定關係。
PVC 申領與 PV 卷之間的綁定是一種一對一的映射，實現上使用 ClaimRef 來記述
PV 卷與 PVC 申領間的雙向綁定關係。

<!--
Claims will remain unbound indefinitely if a matching volume does not exist.
Claims will be bound as matching volumes become available. For example, a
cluster provisioned with many 50Gi PVs would not match a PVC requesting 100Gi.
The PVC can be bound when a 100Gi PV is added to the cluster.
-->
如果找不到匹配的 PV 卷，PVC 申領會無限期地處於未綁定狀態。
當與之匹配的 PV 卷可用時，PVC 申領會被綁定。
例如，即使某集羣上製備了很多 50 Gi 大小的 PV 卷，也無法與請求
100 Gi 大小的存儲的 PVC 匹配。當新的 100 Gi PV 卷被加入到集羣時，
該 PVC 纔有可能被綁定。

<!--
### Using

Pods use claims as volumes. The cluster inspects the claim to find the bound
volume and mounts that volume for a Pod. For volumes that support multiple
access modes, the user specifies which mode is desired when using their claim
as a volume in a Pod.
-->
### 使用    {#using}

Pod 將 PVC 申領當做存儲捲來使用。集羣會檢視 PVC 申領，找到所綁定的卷，
併爲 Pod 掛載該卷。對於支持多種訪問模式的卷，
用戶要在 Pod 中以卷的形式使用申領時指定期望的訪問模式。

<!--
Once a user has a claim and that claim is bound, the bound PV belongs to the
user for as long as they need it. Users schedule Pods and access their claimed
PVs by including a `persistentVolumeClaim` section in a Pod's `volumes` block.
See [Claims As Volumes](#claims-as-volumes) for more details on this.
-->
一旦用戶有了申領對象並且該申領已經被綁定，
則所綁定的 PV 卷在用戶仍然需要它期間一直屬於該用戶。
用戶通過在 Pod 的 `volumes` 塊中包含 `persistentVolumeClaim`
節區來調度 Pod，訪問所申領的 PV 卷。
相關細節可參閱[使用申領作爲卷](#claims-as-volumes)。

<!--
### Storage Object in Use Protection

The purpose of the Storage Object in Use Protection feature is to ensure that
PersistentVolumeClaims (PVCs) in active use by a Pod and PersistentVolume (PVs)
that are bound to PVCs are not removed from the system, as this may result in data loss.
-->
### 保護使用中的存儲對象   {#storage-object-in-use-protection}

保護使用中的存儲對象（Storage Object in Use Protection）
這一功能特性的目的是確保仍被 Pod 使用的 PersistentVolumeClaim（PVC）
對象及其所綁定的 PersistentVolume（PV）對象在系統中不會被刪除，因爲這樣做可能會引起數據丟失。

{{< note >}}
<!--
PVC is in active use by a Pod when a Pod object exists that is using the PVC.
-->
當使用某 PVC 的 Pod 對象仍然存在時，認爲該 PVC 仍被此 Pod 使用。
{{< /note >}}

<!--
If a user deletes a PVC in active use by a Pod, the PVC is not removed immediately.
PVC removal is postponed until the PVC is no longer actively used by any Pods. Also,
if an admin deletes a PV that is bound to a PVC, the PV is not removed immediately.
PV removal is postponed until the PV is no longer bound to a PVC.

You can see that a PVC is protected when the PVC's status is `Terminating` and the
`Finalizers` list includes `kubernetes.io/pvc-protection`:
-->
如果用戶刪除被某 Pod 使用的 PVC 對象，該 PVC 申領不會被立即移除。
PVC 對象的移除會被推遲，直至其不再被任何 Pod 使用。
此外，如果管理員刪除已綁定到某 PVC 申領的 PV 卷，該 PV 卷也不會被立即移除。
PV 對象的移除也要推遲到該 PV 不再綁定到 PVC。

你可以看到當 PVC 的狀態爲 `Terminating` 且其 `Finalizers` 列表中包含
`kubernetes.io/pvc-protection` 時，PVC 對象是處於被保護狀態的。

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
You can see that a PV is protected when the PV's status is `Terminating` and
the `Finalizers` list includes `kubernetes.io/pv-protection` too:
-->
你也可以看到當 PV 對象的狀態爲 `Terminating` 且其 `Finalizers` 列表中包含
`kubernetes.io/pv-protection` 時，PV 對象是處於被保護狀態的。

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

When a user is done with their volume, they can delete the PVC objects from the
API that allows reclamation of the resource. The reclaim policy for a PersistentVolume
tells the cluster what to do with the volume after it has been released of its claim.
Currently, volumes can either be Retained, Recycled, or Deleted.
-->
### 回收（Reclaiming）   {#reclaiming}

當用戶不再使用其存儲卷時，他們可以從 API 中將 PVC 對象刪除，
從而允許該資源被回收再利用。PersistentVolume 對象的回收策略告訴集羣，
當其被從申領中釋放時如何處理該數據卷。
目前，數據卷可以被 Retained（保留）、Recycled（回收）或 Deleted（刪除）。

<!--
#### Retain

The `Retain` reclaim policy allows for manual reclamation of the resource.
When the PersistentVolumeClaim is deleted, the PersistentVolume still exists
and the volume is considered "released". But it is not yet available for
another claim because the previous claimant's data remains on the volume.
An administrator can manually reclaim the volume with the following steps.
-->
#### 保留（Retain）    {#retain}

回收策略 `Retain` 使得用戶可以手動回收資源。當 PersistentVolumeClaim
對象被刪除時，PersistentVolume 卷仍然存在，對應的數據卷被視爲"已釋放（released）"。
由於捲上仍然存在這前一申領人的數據，該卷還不能用於其他申領。
管理員可以通過下面的步驟來手動回收該卷：

<!--
1. Delete the PersistentVolume. The associated storage asset in external infrastructure
   still exists after the PV is deleted.
1. Manually clean up the data on the associated storage asset accordingly.
1. Manually delete the associated storage asset.

If you want to reuse the same storage asset, create a new PersistentVolume with
the same storage asset definition.
-->
1. 刪除 PersistentVolume 對象。與之相關的、位於外部基礎設施中的存儲資產在
   PV 刪除之後仍然存在。
1. 根據情況，手動清除所關聯的存儲資產上的數據。
1. 手動刪除所關聯的存儲資產。

如果你希望重用該存儲資產，可以基於存儲資產的定義創建新的 PersistentVolume 卷對象。

<!--
#### Delete

For volume plugins that support the `Delete` reclaim policy, deletion removes
both the PersistentVolume object from Kubernetes, as well as the associated
storage asset in the external infrastructure. Volumes that were dynamically provisioned
inherit the [reclaim policy of their StorageClass](#reclaim-policy), which
defaults to `Delete`. The administrator should configure the StorageClass
according to users' expectations; otherwise, the PV must be edited or
patched after it is created. See
[Change the Reclaim Policy of a PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).
-->
#### 刪除（Delete）    {#delete}

對於支持 `Delete` 回收策略的卷插件，刪除動作會將 PersistentVolume 對象從
Kubernetes 中移除，同時也會從外部基礎設施中移除所關聯的存儲資產。
動態製備的卷會繼承[其 StorageClass 中設置的回收策略](#reclaim-policy)，
該策略默認爲 `Delete`。管理員需要根據用戶的期望來配置 StorageClass；
否則 PV 卷被創建之後必須要被編輯或者修補。
參閱[更改 PV 卷的回收策略](/zh-cn/docs/tasks/administer-cluster/change-pv-reclaim-policy/)。

<!--
#### Recycle
-->
#### 回收（Recycle）     {#recycle}

{{< warning >}}
<!--
The `Recycle` reclaim policy is deprecated. Instead, the recommended approach
is to use dynamic provisioning.
-->
回收策略 `Recycle` 已被廢棄。取而代之的建議方案是使用動態製備。
{{< /warning >}}

<!--
If supported by the underlying volume plugin, the `Recycle` reclaim policy performs
a basic scrub (`rm -rf /thevolume/*`) on the volume and makes it available again for a new claim.
-->
如果下層的卷插件支持，回收策略 `Recycle` 會在捲上執行一些基本的擦除
（`rm -rf /thevolume/*`）操作，之後允許該卷用於新的 PVC 申領。

<!--
However, an administrator can configure a custom recycler Pod template using
the Kubernetes controller manager command line arguments as described in the
[reference](/docs/reference/command-line-tools-reference/kube-controller-manager/).
The custom recycler Pod template must contain a `volumes` specification, as
shown in the example below:
-->
不過，管理員可以按[參考資料](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)中所述，
使用 Kubernetes 控制器管理器命令行參數來配置一個定製的回收器（Recycler）
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
    image: "registry.k8s.io/busybox"
    command: ["/bin/sh", "-c", "test -e /scrub && rm -rf /scrub/..?* /scrub/.[!.]* /scrub/*  && test -z \"$(ls -A /scrub)\" || exit 1"]
    volumeMounts:
    - name: vol
      mountPath: /scrub
```

<!--
However, the particular path specified in the custom recycler Pod template in the
`volumes` part is replaced with the particular path of the volume that is being recycled.
-->
定製回收器 Pod 模板中在 `volumes` 部分所指定的特定路徑要替換爲正被回收的卷的路徑。

<!--
### PersistentVolume deletion protection finalizer
-->
### PersistentVolume 刪除保護 finalizer  {#persistentvolume-deletion-protection-finalizer}

{{< feature-state feature_gate_name="HonorPVReclaimPolicy" >}}

<!--
Finalizers can be added on a PersistentVolume to ensure that PersistentVolumes
having `Delete` reclaim policy are deleted only after the backing storage are deleted.
-->
可以在 PersistentVolume 上添加終結器（Finalizer），
以確保只有在刪除對應的存儲後才刪除具有 `Delete` 回收策略的 PersistentVolume。

<!--
The finalizer `external-provisioner.volume.kubernetes.io/finalizer`(introduced
in  v1.31) is added to both dynamically provisioned and statically provisioned
CSI volumes.

The finalizer `kubernetes.io/pv-controller`(introduced in v1.31) is added to 
dynamically provisioned in-tree plugin volumes and skipped for statically 
provisioned in-tree plugin volumes.

The following is an example of dynamically provisioned in-tree plugin volume:
-->
（在 v1.31 中引入的）終結器 `external-provisioner.volume.kubernetes.io/finalizer`
被同時添加到動態製備和靜態製備的 CSI 捲上。

（在 v1.31 中引入的）終結器 `kubernetes.io/pv-controller`
被添加到動態製備的樹內插件捲上，而對於靜態製備的樹內插件卷，此終結器將被忽略。

以下是動態製備的樹內插件卷的示例：

```shell
kubectl describe pv pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
```

```none
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
終結器 `external-provisioner.volume.kubernetes.io/finalizer`
會被添加到 CSI 捲上。下面是一個例子：

```none
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
When the `CSIMigration{provider}` feature flag is enabled for a specific in-tree volume plugin,
the `kubernetes.io/pv-controller` finalizer is replaced by the
`external-provisioner.volume.kubernetes.io/finalizer` finalizer.
-->
當爲特定的樹內卷插件啓用了 `CSIMigration{provider}` 特性標誌時，`kubernetes.io/pv-controller`
終結器將被替換爲 `external-provisioner.volume.kubernetes.io/finalizer` 終結器。

<!--
The finalizers ensure that the PV object is removed only after the volume is deleted
from the storage backend provided the reclaim policy of the PV is `Delete`. This
also ensures that the volume is deleted from storage backend irrespective of the
order of deletion of PV and PVC.
-->
這些終結器確保只有在從存儲後端刪除卷後，PV 對象纔會被移除，
前提是 PV 的回收策略爲 `Delete`。
這也確保了無論 PV 和 PVC 的刪除順序如何，此卷都會從存儲後端被刪除。

<!--
### Reserving a PersistentVolume

The control plane can [bind PersistentVolumeClaims to matching PersistentVolumes](#binding)
in the cluster. However, if you want a PVC to bind to a specific PV, you need to pre-bind them.
-->
### 預留 PersistentVolume  {#reserving-a-persistentvolume}

控制平面可以在集羣中[將 PersistentVolumeClaim 綁定到匹配的 PersistentVolume](#binding)。
但是，如果你希望 PVC 綁定到特定 PV，則需要預先綁定它們。

<!--
By specifying a PersistentVolume in a PersistentVolumeClaim, you declare a binding
between that specific PV and PVC. If the PersistentVolume exists and has not reserved
PersistentVolumeClaims through its `claimRef` field, then the PersistentVolume and
PersistentVolumeClaim will be bound.
-->
通過在 PersistentVolumeClaim 中指定 PersistentVolume，你可以聲明該特定
PV 與 PVC 之間的綁定關係。如果該 PersistentVolume 存在且未被通過其
`claimRef` 字段預留給 PersistentVolumeClaim，則該 PersistentVolume
會和該 PersistentVolumeClaim 綁定到一起。

<!--
The binding happens regardless of some volume matching criteria, including node affinity.
The control plane still checks that [storage class](/docs/concepts/storage/storage-classes/),
access modes, and requested storage size are valid.
-->
綁定操作不會考慮某些卷匹配條件是否滿足，包括節點親和性等等。
控制面仍然會檢查[存儲類](/zh-cn/docs/concepts/storage/storage-classes/)、
訪問模式和所請求的存儲尺寸都是合法的。

<!--
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: foo
spec:
  storageClassName: "" # Empty string must be explicitly set otherwise default StorageClass will be set
  volumeName: foo-pv
  ...
```
-->
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: foo
spec:
  storageClassName: "" # 此處須顯式設置空字符串，否則會被設置爲默認的 StorageClass
  volumeName: foo-pv
  ...
```

<!--
This method does not guarantee any binding privileges to the PersistentVolume.
If other PersistentVolumeClaims could use the PV that you specify, you first
need to reserve that storage volume. Specify the relevant PersistentVolumeClaim
in the `claimRef` field of the PV so that other PVCs can not bind to it.
-->
此方法無法對 PersistentVolume 的綁定特權做出任何形式的保證。
如果有其他 PersistentVolumeClaim 可以使用你所指定的 PV，
則你應該首先預留該存儲卷。你可以將 PV 的 `claimRef` 字段設置爲相關的
PersistentVolumeClaim 以確保其他 PVC 不會綁定到該 PV 卷。

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
This is useful if you want to consume PersistentVolumes that have their `persistentVolumeReclaimPolicy` set
to `Retain`, including cases where you are reusing an existing PV.
-->
如果你想要使用 `persistentVolumeReclaimPolicy` 屬性設置爲 `Retain` 的 PersistentVolume 卷時，
包括你希望複用現有的 PV 卷時，這點是很有用的。

<!--
### Expanding Persistent Volumes Claims
-->
### 擴充 PVC 申領   {#expanding-persistent-volumes-claims}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
Support for expanding PersistentVolumeClaims (PVCs) is enabled by default. You can expand
the following types of volumes:
-->
現在，對擴充 PVC 申領的支持默認處於被啓用狀態。你可以擴充以下類型的卷：

<!--
* {{< glossary_tooltip text="csi" term_id="csi" >}} (including some CSI migrated
volme types)
* flexVolume (deprecated)
* portworxVolume (deprecated)
-->
* {{< glossary_tooltip text="csi" term_id="csi" >}}（包含一些 CSI 遷移的卷類型）
* flexVolume（已棄用）
* portworxVolume（已棄用）

<!--
You can only expand a PVC if its storage class's `allowVolumeExpansion` field is set to true.
-->
只有當 PVC 的存儲類中將 `allowVolumeExpansion` 設置爲 true 時，你纔可以擴充該 PVC。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: example-vol-default
provisioner: vendor-name.example/magicstorage
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
如果要爲某 PVC 請求較大的存儲卷，可以編輯 PVC 對象，設置一個更大的尺寸值。
這一編輯操作會觸發爲下層 PersistentVolume 提供存儲的卷的擴充。
Kubernetes 不會創建新的 PV 捲來滿足此申領的請求。
與之相反，現有的卷會被調整大小。

{{< warning >}}
<!--
Directly editing the size of a PersistentVolume can prevent an automatic resize of that volume.
If you edit the capacity of a PersistentVolume, and then edit the `.spec` of a matching
PersistentVolumeClaim to make the size of the PersistentVolumeClaim match the PersistentVolume,
then no storage resize happens.
The Kubernetes control plane will see that the desired state of both resources matches,
conclude that the backing volume size has been manually
increased and that no resize is necessary.
-->
直接編輯 PersistentVolume 的大小可以阻止該卷自動調整大小。
如果對 PersistentVolume 的容量進行編輯，然後又將其所對應的
PersistentVolumeClaim 的 `.spec` 進行編輯，使該 PersistentVolumeClaim
的大小匹配 PersistentVolume 的話，則不會發生存儲大小的調整。
Kubernetes 控制平面將看到兩個資源的所需狀態匹配，
並認爲其後備卷的大小已被手動增加，無需調整。
{{< /warning >}}

<!--
#### CSI Volume expansion
-->
#### CSI 卷的擴充     {#csi-volume-expansion}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
Support for expanding CSI volumes is enabled by default but it also requires a
specific CSI driver to support volume expansion. Refer to documentation of the
specific CSI driver for more information.
-->
對 CSI 卷的擴充能力默認是被啓用的，不過擴充 CSI 卷要求 CSI
驅動支持卷擴充操作。可參閱特定 CSI 驅動的文檔瞭解更多信息。

<!--
#### Resizing a volume containing a file system

You can only resize volumes containing a file system if the file system is XFS, Ext3, or Ext4.
-->
#### 重設包含文件系統的卷的大小 {#resizing-a-volume-containing-a-file-system}

只有卷中包含的文件系統是 XFS、Ext3 或者 Ext4 時，你纔可以重設卷的大小。

<!--
When a volume contains a file system, the file system is only resized when a new Pod is using
the PersistentVolumeClaim in `ReadWrite` mode. File system expansion is either done when a Pod is starting up
or when a Pod is running and the underlying file system supports online expansion.

FlexVolumes (deprecated since Kubernetes v1.23) allow resize if the driver is configured with the
`RequiresFSResize` capability to `true`. The FlexVolume can be resized on Pod restart.
-->
當卷中包含文件系統時，只有在 Pod 使用 `ReadWrite` 模式來使用 PVC
申領的情況下才能重設其文件系統的大小。文件系統擴充的操作或者是在 Pod
啓動期間完成，或者在下層文件系統支持在線擴充的前提下在 Pod 運行期間完成。

如果 FlexVolumes 的驅動將 `RequiresFSResize` 能力設置爲 `true`，
則該 FlexVolume 卷（於 Kubernetes v1.23 棄用）可以在 Pod 重啓期間調整大小。

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
所有使用中的 PVC 在其文件系統被擴充之後，立即可供其 Pod 使用。
此功能特性對於沒有被 Pod 或 Deployment 使用的 PVC 而言沒有效果。
你必須在執行擴展操作之前創建一個使用該 PVC 的 Pod。

<!--
Similar to other volume types - FlexVolume volumes can also be expanded when in-use by a Pod.
-->
與其他卷類型類似，FlexVolume 卷也可以在被 Pod 使用期間執行擴充操作。

{{< note >}}
<!--
FlexVolume resize is possible only when the underlying driver supports resize.
-->
FlexVolume 卷的重設大小只能在下層驅動支持重設大小的時候纔可進行。
{{< /note >}}

<!--
#### Recovering from Failure when Expanding Volumes

If a user specifies a new size that is too big to be satisfied by underlying
storage system, expansion of PVC will be continuously retried until user or
cluster administrator takes some action. This can be undesirable and hence
Kubernetes provides following methods of recovering from such failures.
-->
#### 處理擴充捲過程中的失敗      {#recovering-from-failure-when-expanding-volumes}

如果用戶指定的新大小過大，底層存儲系統無法滿足，PVC 的擴展將不斷重試，
直到用戶或集羣管理員採取一些措施。這種情況是不希望發生的，因此 Kubernetes
提供了以下從此類故障中恢復的方法。

<!--
tabs name="recovery_methods"
-->
{{< tabs name="恢復方法" >}}

<!--
tab name="Manually with Cluster Administrator access"
-->
{{% tab name="集羣管理員手動處理" %}}

<!--
If expanding underlying storage fails, the cluster administrator can manually
recover the Persistent Volume Claim (PVC) state and cancel the resize requests.
Otherwise, the resize requests are continuously retried by the controller without
administrator intervention.
-->
如果擴充下層存儲的操作失敗，集羣管理員可以手動地恢復 PVC
申領的狀態並取消重設大小的請求。否則，在沒有管理員干預的情況下，
控制器會反覆重試重設大小的操作。

<!--
1. Mark the PersistentVolume(PV) that is bound to the PersistentVolumeClaim(PVC)
   with `Retain` reclaim policy.
2. Delete the PVC. Since PV has `Retain` reclaim policy - we will not lose any data
   when we recreate the PVC.
3. Delete the `claimRef` entry from PV specs, so as new PVC can bind to it.
   This should make the PV `Available`.
4. Re-create the PVC with smaller size than PV and set `volumeName` field of the
   PVC to the name of the PV. This should bind new PVC to existing PV.
5. Don't forget to restore the reclaim policy of the PV.
-->
1. 將綁定到 PVC 申領的 PV 卷標記爲 `Retain` 回收策略。
2. 刪除 PVC 對象。由於 PV 的回收策略爲 `Retain`，我們不會在重建 PVC 時丟失數據。
3. 刪除 PV 規約中的 `claimRef` 項，這樣新的 PVC 可以綁定到該卷。
   這一操作會使得 PV 卷變爲"可用（Available）"。
4. 使用小於 PV 卷大小的尺寸重建 PVC，設置 PVC 的 `volumeName` 字段爲 PV 卷的名稱。
   這一操作將把新的 PVC 對象綁定到現有的 PV 卷。
5. 不要忘記恢復 PV 捲上設置的回收策略。

{{% /tab %}}

<!--
tab name="By requesting expansion to smaller size"
-->
{{% tab name="通過請求擴展爲更小尺寸" %}}

<!--
If expansion has failed for a PVC, you can retry expansion with a
smaller size than the previously requested value. To request a new expansion attempt with a
smaller proposed size, edit `.spec.resources` for that PVC and choose a value that is less than the
value you previously tried.
This is useful if expansion to a higher value did not succeed because of capacity constraint.
If that has happened, or you suspect that it might have, you can retry expansion by specifying a
size that is within the capacity limits of underlying storage provider. You can monitor status of
resize operation by watching `.status.allocatedResourceStatuses` and events on the PVC.
-->
如果 PVC 擴展失敗，你可以使用比先前請求值更小的值來重試擴展。
要使用一個更小的尺寸嘗試請求新的擴展，請編輯該 PVC 的 `.spec.resources`
並選擇一個比你之前所嘗試的值更小的值。
如果由於容量限制而無法成功擴展至更高的值，這將很有用。
如果發生了這種情況，或者你懷疑可能發生了這種情況，
你可以通過指定一個在底層存儲製備容量限制內的尺寸來重試擴展。
你可以通過查看 `.status.allocatedResourceStatuses` 以及 PVC 上的事件來監控調整大小操作的狀態。

<!--
Note that,
although you can specify a lower amount of storage than what was requested previously,
the new value must still be higher than `.status.capacity`.
Kubernetes does not support shrinking a PVC to less than its current size.
-->
請注意，儘管你可以指定比之前的請求更低的存儲量，新值必須仍然高於
`.status.capacity`。Kubernetes 不支持將 PVC 縮容到小於其當前值。

{{% /tab %}}
{{% /tabs %}}

<!--
## Types of Persistent Volumes

PersistentVolume types are implemented as plugins. Kubernetes currently supports the following plugins:
-->

## 持久卷的類型     {#types-of-persistent-volumes}

PV 持久卷是用插件的形式來實現的。Kubernetes 目前支持以下插件：

<!--
* [`csi`](/docs/concepts/storage/volumes/#csi) - Container Storage Interface (CSI)
* [`fc`](/docs/concepts/storage/volumes/#fc) - Fibre Channel (FC) storage
* [`hostPath`](/docs/concepts/storage/volumes/#hostpath) - HostPath volume
  (for single node testing only; WILL NOT WORK in a multi-node cluster;
  consider using `local` volume instead)
* [`iscsi`](/docs/concepts/storage/volumes/#iscsi) - iSCSI (SCSI over IP) storage
* [`local`](/docs/concepts/storage/volumes/#local) - local storage devices
  mounted on nodes.
* [`nfs`](/docs/concepts/storage/volumes/#nfs) - Network File System (NFS) storage
-->
* [`csi`](/zh-cn/docs/concepts/storage/volumes/#csi) - 容器存儲接口（CSI）
* [`fc`](/zh-cn/docs/concepts/storage/volumes/#fc) - Fibre Channel（FC）存儲
* [`hostPath`](/zh-cn/docs/concepts/storage/volumes/#hostpath) - HostPath 卷
  （僅供單節點測試使用；不適用於多節點集羣；請嘗試使用 `local` 卷作爲替代）
* [`iscsi`](/zh-cn/docs/concepts/storage/volumes/#iscsi) - iSCSI（IP 上的 SCSI）存儲
* [`local`](/zh-cn/docs/concepts/storage/volumes/#local) - 節點上掛載的本地存儲設備
* [`nfs`](/zh-cn/docs/concepts/storage/volumes/#nfs) - 網絡文件系統（NFS）存儲

<!-- 
The following types of PersistentVolume are deprecated but still available.
If you are using these volume types except for `flexVolume`, `cephfs` and `rbd`,
please install corresponding CSI drivers.
-->
以下的持久卷已被棄用但仍然可用。
如果你使用除 `flexVolume`、`cephfs` 和 `rbd` 之外的卷類型，請安裝相應的 CSI 驅動程序。

<!--
* [`awsElasticBlockStore`](/docs/concepts/storage/volumes/#awselasticblockstore) - AWS Elastic Block Store (EBS)
  (**migration on by default** starting v1.23)
* [`azureDisk`](/docs/concepts/storage/volumes/#azuredisk) - Azure Disk
  (**migration on by default** starting v1.23)
* [`azureFile`](/docs/concepts/storage/volumes/#azurefile) - Azure File
  (**migration on by default** starting v1.24)
* [`cinder`](/docs/concepts/storage/volumes/#cinder) - Cinder (OpenStack block storage)
  (**migration on by default** starting v1.21)
* [`flexVolume`](/docs/concepts/storage/volumes/#flexvolume) - FlexVolume
  (**deprecated** starting v1.23, no migration plan and no plan to remove support)
* [`gcePersistentDisk`](/docs/concepts/storage/volumes/#gcePersistentDisk) - GCE Persistent Disk
  (**migration on by default** starting v1.23)
* [`portworxVolume`](/docs/concepts/storage/volumes/#portworxvolume) - Portworx volume
  (**migration on by default** starting v1.31)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume) - vSphere VMDK volume
  (**migration on by default** starting v1.25)
-->
* [`awsElasticBlockStore`](/zh-cn/docs/concepts/storage/volumes/#awselasticblockstore) - AWS Elastic 塊存儲（EBS）
  （從 v1.23 開始**默認啓用遷移**）
* [`azureDisk`](/zh-cn/docs/concepts/storage/volumes/#azuredisk) - Azure 磁盤
  （從 v1.23 開始**默認啓用遷移**）
* [`azureFile`](/zh-cn/docs/concepts/storage/volumes/#azurefile) - Azure 文件
  （從 v1.24 開始**默認啓用遷移**）
* [`cinder`](/zh-cn/docs/concepts/storage/volumes/#cinder) - Cinder（OpenStack 塊存儲）
  （從 v1.21 開始**默認啓用遷移**）
* [`flexVolume`](/zh-cn/docs/concepts/storage/volumes/#flexVolume) - FlexVolume
  （從 v1.23 開始**棄用**，沒有遷移計劃，沒有移除支持的計劃）
* [`gcePersistentDisk`](/zh-cn/docs/concepts/storage/volumes/#gcePersistentDisk) - GCE 持久磁盤
  （從 v1.23 開始**默認啓用遷移**）
* [`portworxVolume`](/zh-cn/docs/concepts/storage/volumes/#portworxvolume) - Portworx 卷
  （從 v1.31 開始**默認啓用遷移**）
* [`vsphereVolume`](/zh-cn/docs/concepts/storage/volumes/#vspherevolume) - vSphere VMDK 卷
 （從 v1.25 開始**默認啓用遷移**）

<!-- 
Older versions of Kubernetes also supported the following in-tree PersistentVolume types:

* [`cephfs`](/docs/concepts/storage/volumes/#cephfs)
  (**not available** starting v1.31)
* `flocker` - Flocker storage.
  (**not available** starting v1.25)
* `glusterfs` - GlusterFS storage.
  (**not available** starting v1.26)
* `photonPersistentDisk` - Photon controller persistent disk.
  (**not available** starting v1.15)
* `quobyte` - Quobyte volume.
  (**not available** starting v1.25)
* [`rbd`](/docs/concepts/storage/volumes/#rbd) - Rados Block Device (RBD) volume 
  (**not available** starting v1.31)
* `scaleIO` - ScaleIO volume.
  (**not available** starting v1.21)
* `storageos` - StorageOS volume.
  (**not available** starting v1.25)
-->
舊版本的 Kubernetes 仍支持這些“樹內（In-Tree）”持久卷類型：

* [`cephfs`](/zh-cn/docs/concepts/storage/volumes/#cephfs)
  （v1.31 之後**不可用**）
* `flocker` - Flocker 存儲。
  （v1.25 之後**不可用**）
* `glusterfs` - GlusterFS 存儲。
  （v1.26 之後**不可用**）
* `photonPersistentDisk` - Photon 控制器持久化盤
  （v1.15 之後**不可用**）
* `quobyte` - Quobyte 卷。
  （v1.25 之後**不可用**）
* [`rbd`](/zh-cn/docs/concepts/storage/volumes/#rbd) - Rados 塊設備 (RBD) 卷
  （v1.31 之後**不可用**）
* `scaleIO` - ScaleIO 卷
  （v1.21 之後**不可用**）
* `storageos` - StorageOS 卷
  （v1.25 之後**不可用**）

<!--
## Persistent Volumes

Each PV contains a spec and status, which is the specification and status of the volume.
The name of a PersistentVolume object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
## 持久卷    {#persistent-volumes}

每個 PV 對象都包含 `spec` 部分和 `status` 部分，分別對應卷的規約和狀態。
PersistentVolume 對象的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

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

{{< note >}}
<!--
Helper programs relating to the volume type may be required for consumption of
a PersistentVolume within a cluster.  In this example, the PersistentVolume is
of type NFS and the helper program /sbin/mount.nfs is required to support the
mounting of NFS filesystems.
-->
在集羣中使用持久卷存儲通常需要一些特定於具體卷類型的輔助程序。
在這個例子中，PersistentVolume 是 NFS 類型的，因此需要輔助程序 `/sbin/mount.nfs`
來支持掛載 NFS 文件系統。
{{< /note >}}

<!--
### Capacity

Generally, a PV will have a specific storage capacity. This is set using the PV's
`capacity` attribute which is a {{< glossary_tooltip term_id="quantity" >}} value.

Currently, storage size is the only resource that can be set or requested.
Future attributes may include IOPS, throughput, etc.
-->
### 容量    {#capacity}

一般而言，每個 PV 卷都有確定的存儲容量。
這是通過 PV 的 `capacity` 屬性設置的，
該屬性是一個{{< glossary_tooltip text="量綱（Quantity）" term_id="quantity" >}}。

目前存儲大小是可以設置和請求的唯一資源，
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
支持兩種卷模式（`volumeModes`）：`Filesystem（文件系統）` 和 `Block（塊）`。
`volumeMode` 是一個可選的 API 參數。
如果該參數被省略，默認的卷模式是 `Filesystem`。

`volumeMode` 屬性設置爲 `Filesystem` 的卷會被 Pod **掛載（Mount）** 到某個目錄。
如果卷的存儲來自某塊設備而該設備目前爲空，Kuberneretes 會在第一次掛載卷之前在設備上創建文件系統。

<!--
You can set the value of `volumeMode` to `Block` to use a volume as a raw block device.
Such volume is presented into a Pod as a block device, without any filesystem on it.
This mode is useful to provide a Pod the fastest possible way to access a volume, without
any filesystem layer between the Pod and the volume. On the other hand, the application
running in the Pod must know how to handle a raw block device.
See [Raw Block Volume Support](#raw-block-volume-support)
for an example on how to use a volume with `volumeMode: Block` in a Pod.
-->
你可以將 `volumeMode` 設置爲 `Block`，以便將卷作爲原始塊設備來使用。
這類卷以塊設備的方式交給 Pod 使用，其上沒有任何文件系統。
這種模式對於爲 Pod 提供一種使用最快可能方式來訪問卷而言很有幫助，
Pod 和卷之間不存在文件系統層。另外，Pod 中運行的應用必須知道如何處理原始塊設備。
關於如何在 Pod 中使用 `volumeMode: Block` 的卷，
可參閱[原始塊卷支持](#raw-block-volume-support)。

<!--
### Access Modes

A PersistentVolume can be mounted on a host in any way supported by the resource
provider. As shown in the table below, providers will have different capabilities
and each PV's access modes are set to the specific modes supported by that particular
volume. For example, NFS can support multiple read/write clients, but a specific
NFS PV might be exported on the server as read-only. Each PV gets its own set of
access modes describing that specific PV's capabilities.
-->
### 訪問模式   {#access-modes}

PersistentVolume 卷可以用資源提供者所支持的任何方式掛載到宿主系統上。
如下表所示，提供者（驅動）的能力不同，每個 PV 卷的訪問模式都會設置爲對應卷所支持的模式值。
例如，NFS 可以支持多個讀寫客戶，但是某個特定的 NFS PV 卷可能在服務器上以只讀的方式導出。
每個 PV 卷都會獲得自身的訪問模式集合，描述的是特定 PV 卷的能力。

<!--
The access modes are:

`ReadWriteOnce`
: the volume can be mounted as read-write by a single node. ReadWriteOnce access
  mode still can allow multiple pods to access (read from or write to) that volume when the pods are
  running on the same node. For single pod access, please see ReadWriteOncePod.

`ReadOnlyMany`
: the volume can be mounted as read-only by many nodes.
-->
訪問模式有：

`ReadWriteOnce`
: 卷可以被一個節點以讀寫方式掛載。
  ReadWriteOnce 訪問模式仍然可以在同一節點上運行的多個 Pod 訪問（讀取或寫入）該卷。
  對於單個 Pod 的訪問，請參考 ReadWriteOncePod 訪問模式。

`ReadOnlyMany`
: 卷可以被多個節點以只讀方式掛載。

<!--
`ReadWriteMany`
: the volume can be mounted as read-write by many nodes.

 `ReadWriteOncePod`
: {{< feature-state for_k8s_version="v1.29" state="stable" >}}
  the volume can be mounted as read-write by a single Pod. Use ReadWriteOncePod
  access mode if you want to ensure that only one pod across the whole cluster can
  read that PVC or write to it.
-->
`ReadWriteMany`
: 卷可以被多個節點以讀寫方式掛載。

`ReadWriteOncePod`
: {{< feature-state for_k8s_version="v1.29" state="stable" >}}
  卷可以被單個 Pod 以讀寫方式掛載。
  如果你想確保整個集羣中只有一個 Pod 可以讀取或寫入該 PVC，
  請使用 ReadWriteOncePod 訪問模式。

{{< note >}}
<!--
The `ReadWriteOncePod` access mode is only supported for
{{< glossary_tooltip text="CSI" term_id="csi" >}} volumes and Kubernetes version
1.22+. To use this feature you will need to update the following
[CSI sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html)
to these versions or greater:
-->
`ReadWriteOncePod` 訪問模式僅適用於 {{< glossary_tooltip text="CSI" term_id="csi" >}}
卷和 Kubernetes v1.22+。要使用此特性，你需要將以下
[CSI 邊車](https://kubernetes-csi.github.io/docs/sidecar-containers.html)更新爲下列或更高版本：

- [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
- [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
- [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
{{< /note >}}

<!--
In the CLI, the access modes are abbreviated to:
-->
在命令行接口（CLI）中，訪問模式也使用以下縮寫形式：

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany
* RWOP - ReadWriteOncePod

{{< note >}}
<!--
Kubernetes uses volume access modes to match PersistentVolumeClaims and PersistentVolumes.
In some cases, the volume access modes also constrain where the PersistentVolume can be mounted.
Volume access modes do **not** enforce write protection once the storage has been mounted.
Even if the access modes are specified as ReadWriteOnce, ReadOnlyMany, or ReadWriteMany,
they don't set any constraints on the volume. For example, even if a PersistentVolume is
created as ReadOnlyMany, it is no guarantee that it will be read-only. If the access modes
are specified as ReadWriteOncePod, the volume is constrained and can be mounted on only a single Pod.
-->
Kubernetes 使用卷訪問模式來匹配 PersistentVolumeClaim 和 PersistentVolume。
在某些場合下，卷訪問模式也會限制 PersistentVolume 可以掛載的位置。
卷訪問模式並**不會**在存儲已經被掛載的情況下爲其實施寫保護。
即使訪問模式設置爲 ReadWriteOnce、ReadOnlyMany 或 ReadWriteMany，它們也不會對卷形成限制。
例如，即使某個卷創建時設置爲 ReadOnlyMany，也無法保證該卷是隻讀的。
如果訪問模式設置爲 ReadWriteOncePod，則卷會被限制起來並且只能掛載到一個 Pod 上。
{{< /note >}}

<!--
> __Important!__ A volume can only be mounted using one access mode at a time,
> even if it supports many.
-->
> **重要提醒！** 每個卷同一時刻只能以一種訪問模式掛載，即使該卷能夠支持多種訪問模式。

<!--
| Volume Plugin        | ReadWriteOnce          | ReadOnlyMany          | ReadWriteMany | ReadWriteOncePod       |
| :---                 | :---:                  | :---:                 | :---:         | -                      |
| AzureFile            | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CephFS               | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CSI                  | depends on the driver  | depends on the driver | depends on the driver | depends on the driver |
| FC                   | &#x2713;               | &#x2713;              | -             | -                      |
| FlexVolume           | &#x2713;               | &#x2713;              | depends on the driver | -              |
| HostPath             | &#x2713;               | -                     | -             | -                      |
| iSCSI                | &#x2713;               | &#x2713;              | -             | -                      |
| NFS                  | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| RBD                  | &#x2713;               | &#x2713;              | -             | -                      |
| VsphereVolume        | &#x2713;               | -                     | - (works when Pods are collocated) | - |
| PortworxVolume       | &#x2713;               | -                     | &#x2713;      | -                  | - |
-->
| 卷插件               | ReadWriteOnce          | ReadOnlyMany          | ReadWriteMany | ReadWriteOncePod       |
| :---                 | :---:                  | :---:                 | :---:         | -                      |
| AzureFile            | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CephFS               | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CSI                  | 取決於驅動              | 取決於驅動            | 取決於驅動      | 取決於驅動    |
| FC                   | &#x2713;               | &#x2713;              | -             | -                      |
| FlexVolume           | &#x2713;               | &#x2713;              | 取決於驅動   | -              |
| GCEPersistentDisk    | &#x2713;               | &#x2713;              | -             | -                      |
| Glusterfs            | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| HostPath             | &#x2713;               | -                     | -             | -                      |
| iSCSI                | &#x2713;               | &#x2713;              | -             | -                      |
| NFS                  | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| RBD                  | &#x2713;               | &#x2713;              | -             | -                      |
| VsphereVolume        | &#x2713;               | -                     | -（Pod 運行於同一節點上時可行） | - |
| PortworxVolume       | &#x2713;               | -                     | &#x2713;      | -                  | - |

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

每個 PV 可以屬於某個類（Class），通過將其 `storageClassName` 屬性設置爲某個
[StorageClass](/zh-cn/docs/concepts/storage/storage-classes/) 的名稱來指定。
特定類的 PV 卷只能綁定到請求該類存儲卷的 PVC 申領。
未設置 `storageClassName` 的 PV 卷沒有類設定，只能綁定到那些沒有指定特定存儲類的 PVC 上。

<!--
In the past, the annotation `volume.beta.kubernetes.io/storage-class` was used instead
of the `storageClassName` attribute. This annotation is still working; however,
it will become fully deprecated in a future Kubernetes release.
-->
早前，Kubernetes 使用註解 `volume.beta.kubernetes.io/storage-class` 而不是
`storageClassName` 屬性。這一註解目前仍然起作用，不過在將來的 Kubernetes
發佈版本中該註解會被徹底廢棄。

<!--
### Reclaim Policy

Current reclaim policies are:

* Retain -- manual reclamation
* Recycle -- basic scrub (`rm -rf /thevolume/*`)
* Delete -- delete the volume

For Kubernetes {{< skew currentVersion >}}, only `nfs` and `hostPath` volume types support recycling.
-->
### 回收策略   {#reclaim-policy}

目前的回收策略有：

* Retain -- 手動回收
* Recycle -- 簡單擦除（`rm -rf /thevolume/*`）
* Delete -- 刪除存儲卷

對於 Kubernetes {{< skew currentVersion >}} 來說，只有
`nfs` 和 `hostPath` 卷類型支持回收（Recycle）。

<!--
### Mount Options

A Kubernetes administrator can specify additional mount options for when a
Persistent Volume is mounted on a node.
-->
### 掛載選項    {#mount-options}

Kubernetes 管理員可以指定持久卷被掛載到節點上時使用的附加掛載選項。

{{< note >}}
<!--
Not all Persistent Volume types support mount options.
-->
並非所有持久卷類型都支持掛載選項。
{{< /note >}}

<!--
The following volume types support mount options:

* `csi` (including CSI migrated volume types)
* `iscsi`
* `nfs`
-->
以下卷類型支持掛載選項：

* `csi`（包含 CSI 遷移的卷類型）
* `iscsi`
* `nfs`

<!--
Mount options are not validated. If a mount option is invalid, the mount fails.
-->
Kubernetes 不對掛載選項執行合法性檢查。如果掛載選項是非法的，掛載就會失敗。

<!--
In the past, the annotation `volume.beta.kubernetes.io/mount-options` was used instead
of the `mountOptions` attribute. This annotation is still working; however,
it will become fully deprecated in a future Kubernetes release.
-->
早前，Kubernetes 使用註解 `volume.beta.kubernetes.io/mount-options` 而不是
`mountOptions` 屬性。這一註解目前仍然起作用，不過在將來的 Kubernetes
發佈版本中該註解會被徹底廢棄。

<!--
### Node Affinity
-->
### 節點親和性   {#node-affinity}

{{< note >}}
<!--
For most volume types, you do not need to set this field.
You need to explicitly set this for [local](/docs/concepts/storage/volumes/#local) volumes.
-->
對大多數卷類型而言，你不需要設置節點親和性字段。
你需要爲 [local](/zh-cn/docs/concepts/storage/volumes/#local)
卷顯式地設置此屬性。
{{< /note >}}

<!--
A PV can specify node affinity to define constraints that limit what nodes this
volume can be accessed from. Pods that use a PV will only be scheduled to nodes
that are selected by the node affinity. To specify node affinity, set
`nodeAffinity` in the `.spec` of a PV. The
[PersistentVolume](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)
API reference has more details on this field.
-->
每個 PV 卷可以通過設置節點親和性來定義一些約束，進而限制從哪些節點上可以訪問此卷。
使用這些卷的 Pod 只會被調度到節點親和性規則所選擇的節點上執行。
要設置節點親和性，配置 PV 卷 `.spec` 中的 `nodeAffinity`。
[持久卷](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)
API 參考關於該字段的更多細節。

<!--
### Phase

A PersistentVolume will be in one of the following phases:

`Available`
: a free resource that is not yet bound to a claim

`Bound`
: the volume is bound to a claim

`Released`
: the claim has been deleted, but the associated storage resource is not yet reclaimed by the cluster

`Failed`
: the volume has failed its (automated) reclamation
-->
### 階段   {#phase}

每個持久卷會處於以下階段（Phase）之一：

`Available`
: 卷是一個空閒資源，尚未綁定到任何申領

`Bound`
: 該卷已經綁定到某申領

`Released`
: 所綁定的申領已被刪除，但是關聯存儲資源尚未被集羣回收

`Failed`
: 卷的自動回收操作失敗

<!--
You can see the name of the PVC bound to the PV using `kubectl describe persistentvolume <name>`.
-->
你可以使用 `kubectl describe persistentvolume <name>` 查看已綁定到
PV 的 PVC 的名稱。

<!--
#### Phase transition timestamp
-->
#### 階段轉換時間戳   {#phase-transition-timestamp}

{{< feature-state feature_gate_name="PersistentVolumeLastPhaseTransitionTime" >}}

<!--
The `.status` field for a PersistentVolume can include an alpha `lastPhaseTransitionTime` field. This field records
the timestamp of when the volume last transitioned its phase. For newly created
volumes the phase is set to `Pending` and `lastPhaseTransitionTime` is set to
the current time.
-->
持久卷的 `.status` 字段可以包含 Alpha 狀態的 `lastPhaseTransitionTime` 字段。
該字段保存的是捲上次轉換階段的時間戳。
對於新創建的卷，階段被設置爲 `Pending`，`lastPhaseTransitionTime` 被設置爲當前時間。

## PersistentVolumeClaim

<!--
Each PVC contains a spec and status, which is the specification and status of the claim.
The name of a PersistentVolumeClaim object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
每個 PVC 對象都有 `spec` 和 `status` 部分，分別對應申領的規約和狀態。
PersistentVolumeClaim 對象的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

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

Claims use [the same conventions as volumes](#access-modes) when requesting
storage with specific access modes.
-->
### 訪問模式 {#access-modes}

申領在請求具有特定訪問模式的存儲時，使用與卷相同的[訪問模式約定](#access-modes)。

<!--
### Volume Modes

Claims use [the same convention as volumes](#volume-mode) to indicate the
consumption of the volume as either a filesystem or block device.
-->
### 卷模式 {#volume-modes}

申領使用[與卷相同的約定](#volume-mode)來表明是將卷作爲文件系統還是塊設備來使用。

<!--
### Volume Name

Claims can use the `volumeName` field to explicitly bind to a specific PersistentVolume. You can also leave
`volumeName` unset, indicating that you'd like Kubernetes to set up a new PersistentVolume
that matches the claim.
If the specified PV is already bound to another PVC, the binding will be stuck
in a pending state.
-->

### 卷名稱    {#volume-name}

申領可以使用 `volumeName` 字段顯式綁定到特定的 PersistentVolume。
你也可以不設置 `volumeName` 字段，這表示你希望 Kubernetes 設置一個與申領匹配的新 PersistentVolume。
如果指定的 PV 已經綁定到另一個 PVC，則綁定操作將卡在 Pending 狀態。

<!--
### Resources

Claims, like Pods, can request specific quantities of a resource. In this case,
the request is for storage. The same
[resource model](https://git.k8s.io/design-proposals-archive/scheduling/resources.md)
applies to both volumes and claims.
-->
### 資源    {#resources}

申領和 Pod 一樣，也可以請求特定數量的資源。在這個上下文中，請求的資源是存儲。
卷和申領都使用相同的[資源模型](https://git.k8s.io/design-proposals-archive/scheduling/resources.md)。

{{< note >}}
<!--
For `Filesystem` volumes, the storage request refers to the "outer" volume size
(i.e. the allocated size from the storage backend).
This means that the writeable size may be slightly lower for providers that
build a filesystem on top of a block device, due to filesystem overhead.
This is especially visible with XFS, where many metadata features are enabled by default.
-->
對於 `Filesystem` 類型的卷，存儲請求指的是“外部”卷的大小（即從存儲後端分配的大小）。  
這意味着，對於在塊設備之上構建文件系統的提供商來說，由於文件系統開銷，可寫入的大小可能會略小。  
這種情況在 XFS 文件系統中尤爲明顯，因爲默認啓用了許多元數據功能。
{{< /note >}}

<!--
### Selector

Claims can specify a
[label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
to further filter the set of volumes.
Only the volumes whose labels match the selector can be bound to the claim.
The selector can consist of two fields:
-->
### 選擇算符    {#selector}

申領可以設置[標籤選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)
來進一步過濾卷集合。只有標籤與選擇算符相匹配的卷能夠綁定到申領上。
選擇算符包含兩個字段：

<!--
* `matchLabels` - the volume must have a label with this value
* `matchExpressions` - a list of requirements made by specifying key, list of values,
  and operator that relates the key and values.
  Valid operators include `In`, `NotIn`, `Exists`, and `DoesNotExist`.

All of the requirements, from both `matchLabels` and `matchExpressions`, are
ANDed together – they must all be satisfied in order to match.
-->
* `matchLabels` - 卷必須包含帶有此值的標籤
* `matchExpressions` - 通過設定鍵（key）、值列表和操作符（operator）
  來構造的需求。合法的操作符有 `In`、`NotIn`、`Exists` 和 `DoesNotExist`。

來自 `matchLabels` 和 `matchExpressions` 的所有需求都按邏輯與的方式組合在一起。
這些需求都必須被滿足才被視爲匹配。

<!--
### Class

A claim can request a particular class by specifying the name of a
[StorageClass](/docs/concepts/storage/storage-classes/)
using the attribute `storageClassName`.
Only PVs of the requested class, ones with the same `storageClassName` as the PVC,
can be bound to the PVC.
-->
### 類      {#class}

申領可以通過爲 `storageClassName` 屬性設置
[StorageClass](/zh-cn/docs/concepts/storage/storage-classes/) 的名稱來請求特定的存儲類。
只有所請求的類的 PV 卷，即 `storageClassName` 值與 PVC 設置相同的 PV 卷，
才能綁定到 PVC 申領。

<!--
PVCs don't necessarily have to request a class. A PVC with its `storageClassName` set
equal to `""` is always interpreted to be requesting a PV with no class, so it
can only be bound to PVs with no class (no annotation or one set equal to `""`).
A PVC with no `storageClassName` is not quite the same and is treated differently
by the cluster, depending on whether the
[`DefaultStorageClass` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
is turned on.
-->
PVC 申領不必一定要請求某個類。如果 PVC 的 `storageClassName` 屬性值設置爲 `""`，
則被視爲要請求的是沒有設置存儲類的 PV 卷，因此這一 PVC 申領只能綁定到未設置存儲類的
PV 卷（未設置註解或者註解值爲 `""` 的 PersistentVolume（PV）對象在系統中不會被刪除，
因爲這樣做可能會引起數據丟失）。未設置 `storageClassName` 的 PVC 與此大不相同，
也會被集羣作不同處理。具體篩查方式取決於
[`DefaultStorageClass` 准入控制器插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)是否被啓用。

<!--
* If the admission plugin is turned on, the administrator may specify a default StorageClass.
  All PVCs that have no `storageClassName` can be bound only to PVs of that default.
  Specifying a default StorageClass is done by setting the annotation
  `storageclass.kubernetes.io/is-default-class` equal to `true` in a StorageClass object.
  If the administrator does not specify a default, the cluster responds to PVC creation
  as if the admission plugin were turned off.
  If more than one default StorageClass is specified, the newest default is used when
  the PVC is dynamically provisioned.
* If the admission plugin is turned off, there is no notion of a default StorageClass.
  All PVCs that have `storageClassName` set to `""` can be bound only to PVs
  that have `storageClassName` also set to `""`.
  However, PVCs with missing `storageClassName` can be updated later once default StorageClass becomes available.
  If the PVC gets updated it will no longer bind to PVs that have `storageClassName` also set to `""`.
-->
* 如果准入控制器插件被啓用，則管理員可以設置一個默認的 StorageClass。
  所有未設置 `storageClassName` 的 PVC 都只能綁定到隸屬於默認存儲類的 PV 卷。
  設置默認 StorageClass 的工作是通過將對應 StorageClass 對象的註解
  `storageclass.kubernetes.io/is-default-class` 賦值爲 `true` 來完成的。
  如果管理員未設置默認存儲類，集羣對 PVC 創建的處理方式與未啓用准入控制器插件時相同。
  如果設定的默認存儲類不止一個，當 PVC 被動態製備時將使用最新的默認存儲類。
* 如果准入控制器插件被關閉，則不存在默認 StorageClass 的說法。
  所有將 `storageClassName` 設爲 `""` 的 PVC 只能被綁定到也將 `storageClassName` 設爲 `""` 的 PV。
  不過，只要默認的 StorageClass 可用，就可以稍後更新缺少 `storageClassName` 的 PVC。
  如果這個 PVC 更新了，它將不再綁定到也將 `storageClassName` 設爲 `""` 的 PV。

<!--
See [retroactive default StorageClass assignment](#retroactive-default-storageclass-assignment) for more details.
-->
參閱[可追溯的默認 StorageClass 賦值](#retroactive-default-storageclass-assignment)瞭解更多詳細信息。

<!--
Depending on installation method, a default StorageClass may be deployed
to a Kubernetes cluster by addon manager during installation.

When a PVC specifies a `selector` in addition to requesting a StorageClass,
the requirements are ANDed together: only a PV of the requested class and with
the requested labels may be bound to the PVC.
-->
取決於安裝方法，默認的 StorageClass 可能在集羣安裝期間由插件管理器（Addon
Manager）部署到集羣中。

當某 PVC 除了請求 StorageClass 之外還設置了 `selector`，則這兩種需求會按邏輯與關係處理：
只有隸屬於所請求類且帶有所請求標籤的 PV 才能綁定到 PVC。

{{< note >}}
<!--
Currently, a PVC with a non-empty `selector` can't have a PV dynamically provisioned for it.
-->
目前，設置了非空 `selector` 的 PVC 對象無法讓集羣爲其動態製備 PV 卷。
{{< /note >}}

<!--
In the past, the annotation `volume.beta.kubernetes.io/storage-class` was used instead
of `storageClassName` attribute. This annotation is still working; however,
it won't be supported in a future Kubernetes release.
-->
早前，Kubernetes 使用註解 `volume.beta.kubernetes.io/storage-class` 而不是
`storageClassName` 屬性。這一註解目前仍然起作用，不過在將來的 Kubernetes
發佈版本中該註解會被徹底廢棄。

<!--
#### Retroactive default StorageClass assignment
-->
#### 可追溯的默認 StorageClass 賦值   {#retroactive-default-storageclass-assignment}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

<!--
You can create a PersistentVolumeClaim without specifying a `storageClassName`
for the new PVC, and you can do so even when no default StorageClass exists
in your cluster. In this case, the new PVC creates as you defined it, and the
`storageClassName` of that PVC remains unset until default becomes available.
-->
你可以創建 PersistentVolumeClaim，而無需爲新 PVC 指定 `storageClassName`。
即使你的集羣中不存在默認 StorageClass，你也可以這樣做。
在這種情況下，新的 PVC 會按照你的定義進行創建，並且在默認值可用之前，該 PVC 的
`storageClassName` 保持不設置。

<!--
When a default StorageClass becomes available, the control plane identifies any
existing PVCs without `storageClassName`. For the PVCs that either have an empty
value for `storageClassName` or do not have this key, the control plane then
updates those PVCs to set `storageClassName` to match the new default StorageClass.
If you have an existing PVC where the `storageClassName` is `""`, and you configure
a default StorageClass, then this PVC will not get updated.
-->
當一個默認的 StorageClass 變得可用時，控制平面會識別所有未設置 `storageClassName`
的現有 PVC。對於 `storageClassName` 爲空值或沒有此主鍵的 PVC，
控制平面會更新這些 PVC 以設置其 `storageClassName` 與新的默認 StorageClass 匹配。
如果你有一個現有的 PVC，其中 `storageClassName` 是 `""`，
並且你配置了默認 StorageClass，則此 PVC 將不會得到更新。

<!--
In order to keep binding to PVs with `storageClassName` set to `""`
(while a default StorageClass is present), you need to set the `storageClassName`
of the associated PVC to `""`.

This behavior helps administrators change default StorageClass by removing the
old one first and then creating or setting another one. This brief window while
there is no default causes PVCs without `storageClassName` created at that time
to not have any default, but due to the retroactive default StorageClass
assignment this way of changing defaults is safe.
-->
爲了保持綁定到 `storageClassName` 設爲 `""` 的 PV（當存在默認 StorageClass 時），
你需要將關聯 PVC 的 `storageClassName` 設置爲 `""`。

此行爲可幫助管理員更改默認 StorageClass，方法是先移除舊的 PVC，然後再創建或設置另一個 PVC。
這一時間窗口內因爲沒有指定默認值，會導致所創建的未設置 `storageClassName` 的 PVC 也沒有默認值設置，
但由於默認 StorageClass 賦值是可追溯的，這種更改默認值的方式是安全的。

<!--
## Claims As Volumes

Pods access storage by using the claim as a volume. Claims must exist in the
same namespace as the Pod using the claim. The cluster finds the claim in the
Pod's namespace and uses it to get the PersistentVolume backing the claim.
The volume is then mounted to the host and into the Pod.
-->
## 使用申領作爲卷     {#claims-as-volumes}

Pod 將申領作爲捲來使用，並藉此訪問存儲資源。
申領必須位於使用它的 Pod 所在的同一名字空間內。
集羣在 Pod 的名字空間中查找申領，並使用它來獲得申領所使用的 PV 卷。
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

PersistentVolumes binds are exclusive, and since PersistentVolumeClaims are
namespaced objects, mounting claims with "Many" modes (`ROX`, `RWX`) is only
possible within one namespace.
-->
### 關於名字空間的說明    {#a-note-on-namespaces}

PersistentVolume 卷的綁定是排他性的。
由於 PersistentVolumeClaim 是名字空間作用域的對象，使用
"Many" 模式（`ROX`、`RWX`）來掛載申領的操作只能在同一名字空間內進行。

<!--
### PersistentVolumes typed `hostPath`

A `hostPath` PersistentVolume uses a file or directory on the Node to emulate
network-attached storage. See
[an example of `hostPath` typed volume](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume).
-->
### 類型爲 `hostpath` 的 PersistentVolume  {#persistentvolumes-typed-hostpath}

`hostPath` PersistentVolume 使用節點上的文件或目錄來模擬網絡附加（network-attached）存儲。
相關細節可參閱 [`hostPath` 卷示例](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume)。

<!--
## Raw Block Volume Support
-->
## 原始塊卷支持   {#raw-block-volume-support}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
The following volume plugins support raw block volumes, including dynamic provisioning where
applicable:
-->
以下卷插件支持原始塊卷，包括其動態製備（如果支持的話）的卷：

<!--
* CSI (including some CSI migrated volume types)
* FC (Fibre Channel)
* iSCSI
* Local volume
-->
* CSI（包含一些 CSI 遷移的卷類型）
* FC（光纖通道）
* iSCSI
* Local 卷

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
### Pod specification adding Raw Block Device path in container
-->
### 在容器中添加原始塊設備路徑的 Pod 規約  {#pod-spec-adding-raw-block-device-path-in-container}

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

{{< note >}}
<!--
When adding a raw block device for a Pod, you specify the device path in the
container instead of a mount path.
-->
向 Pod 中添加原始塊設備時，你要在容器內設置設備路徑而不是掛載路徑。
{{< /note >}}

<!--
### Binding Block Volumes

If a user requests a raw block volume by indicating this using the `volumeMode`
field in the PersistentVolumeClaim spec, the binding rules differ slightly from
previous releases that didn't consider this mode as part of the spec.
Listed is a table of possible combinations the user and admin might specify for
requesting a raw block device. The table indicates if the volume will be bound or
not given the combinations: Volume binding matrix for statically provisioned volumes:
-->
### 綁定塊卷     {#binding-block-volumes}

如果用戶通過 PersistentVolumeClaim 規約的 `volumeMode` 字段來表明對原始塊設備的請求，
綁定規則與之前版本中未在規約中考慮此模式的實現略有不同。
下面列舉的表格是用戶和管理員可以爲請求原始塊設備所作設置的組合。
此表格表明在不同的組合下卷是否會被綁定。

靜態製備卷的卷綁定矩陣：

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
| PV volumeMode | PVC volumeMode  | 結果           |
| --------------|:---------------:| ----------------:|
|   未指定      | 未指定          | 綁定             |
|   未指定      | Block           | 不綁定           |
|   未指定      | Filesystem      | 綁定             |
|   Block       | 未指定          | 不綁定           |
|   Block       | Block           | 綁定             |
|   Block       | Filesystem      | 不綁定           |
|   Filesystem  | Filesystem      | 綁定             |
|   Filesystem  | Block           | 不綁定           |
|   Filesystem  | 未指定          | 綁定             |

{{< note >}}
<!--
Only statically provisioned volumes are supported for alpha release. Administrators
should take care to consider these values when working with raw block devices.
-->
Alpha 發行版本中僅支持靜態製備的卷。
管理員需要在處理原始塊設備時小心處理這些值。
{{< /note >}}

<!--
## Volume Snapshot and Restore Volume from Snapshot Support
-->
## 對卷快照及從卷快照中恢復卷的支持   {#volume-snapshot-and-restore-volume-from-snapshot-support}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

<!--
Volume snapshots only support the out-of-tree CSI volume plugins.
For details, see [Volume Snapshots](/docs/concepts/storage/volume-snapshots/).
In-tree volume plugins are deprecated. You can read about the deprecated volume
plugins in the
[Volume Plugin FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).
-->
卷快照（Volume Snapshot）僅支持樹外 CSI 卷插件。
有關細節可參閱[卷快照](/zh-cn/docs/concepts/storage/volume-snapshots/)文檔。
樹內卷插件被棄用。你可以查閱[卷插件 FAQ](https://git.k8s.io/community/sig-storage/volume-plugin-faq.md)
瞭解已棄用的卷插件。

<!--
### Create a PersistentVolumeClaim from a Volume Snapshot {#create-persistent-volume-claim-from-volume-snapshot}
-->
### 基於卷快照創建 PVC 申領     {#create-persistent-volume-claim-from-volume-snapshot}

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

[Volume Cloning](/docs/concepts/storage/volume-pvc-datasource/)
only available for CSI volume plugins.
-->
## 卷克隆     {#volume-cloning}

[卷克隆](/zh-cn/docs/concepts/storage/volume-pvc-datasource/)功能特性僅適用於
CSI 卷插件。

<!--
### Create PersistentVolumeClaim from an existing PVC {#create-persistent-volume-claim-from-an-existing-pvc}
-->
### 基於現有 PVC 創建新的 PVC 申領    {#create-persistent-volume-claim-from-an-existing-pvc}

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
## Volume populators and data sources
-->
## 卷填充器（Populator）與數據源      {#volume-populators-and-data-sources}

{{< feature-state for_k8s_version="v1.24" state="beta" >}}

<!--
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
Kubernetes 支持自定義的卷填充器。要使用自定義的卷填充器，你必須爲
kube-apiserver 和 kube-controller-manager 啓用 `AnyVolumeDataSource`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

卷填充器利用了 PVC 規約字段 `dataSourceRef`。
不像 `dataSource` 字段只能包含對另一個持久卷申領或卷快照的引用，
`dataSourceRef` 字段可以包含對同一名字空間中任何對象的引用（不包含除 PVC 以外的核心資源）。
對於啓用了特性門控的集羣，使用 `dataSourceRef` 比 `dataSource` 更好。

<!--
## Cross namespace data sources
-->
## 跨名字空間數據源   {#cross-namespace-data-sources}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

<!--
Kubernetes supports cross namespace volume data sources.
To use cross namespace volume data sources, you must enable the `AnyVolumeDataSource`
and `CrossNamespaceVolumeDataSource`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) for
the kube-apiserver, kube-controller-manager.
Also, you must enable the `CrossNamespaceVolumeDataSource` feature gate for the csi-provisioner.

Enabling the `CrossNamespaceVolumeDataSource` feature gate allows you to specify
a namespace in the dataSourceRef field.
-->
Kubernetes 支持跨名字空間卷數據源。
要使用跨名字空間卷數據源，你必須爲 kube-apiserver、kube-controller 管理器啓用
`AnyVolumeDataSource` 和 `CrossNamespaceVolumeDataSource`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
此外，你必須爲 csi-provisioner 啓用 `CrossNamespaceVolumeDataSource` 特性門控。

啓用 `CrossNamespaceVolumeDataSource` 特性門控允許你在 dataSourceRef 字段中指定名字空間。

{{< note >}}
<!--
When you specify a namespace for a volume data source, Kubernetes checks for a
ReferenceGrant in the other namespace before accepting the reference.
ReferenceGrant is part of the `gateway.networking.k8s.io` extension APIs.
See [ReferenceGrant](https://gateway-api.sigs.k8s.io/api-types/referencegrant/)
in the Gateway API documentation for details.
This means that you must extend your Kubernetes cluster with at least ReferenceGrant from the
Gateway API before you can use this mechanism.
-->
當你爲卷數據源指定名字空間時，Kubernetes 在接受此引用之前在另一個名字空間中檢查 ReferenceGrant。
ReferenceGrant 是 `gateway.networking.k8s.io` 擴展 API 的一部分。更多細節請參見 Gateway API 文檔中的
[ReferenceGrant](https://gateway-api.sigs.k8s.io/api-types/referencegrant/)。
這意味着你必須在使用此機制之前至少使用 Gateway API 的 ReferenceGrant 來擴展 Kubernetes 集羣。
{{< /note >}}

<!--
## Data source references

The `dataSourceRef` field behaves almost the same as the `dataSource` field. If one is
specified while the other is not, the API server will give both fields the same value. Neither
field can be changed after creation, and attempting to specify different values for the two
fields will result in a validation error. Therefore the two fields will always have the same
contents.
-->
## 數據源引用   {#data-source-references}

`dataSourceRef` 字段的行爲與 `dataSource` 字段幾乎相同。
如果其中一個字段被指定而另一個字段沒有被指定，API 服務器將給兩個字段相同的值。
這兩個字段都不能在創建後改變，如果試圖爲這兩個字段指定不同的值，將導致驗證錯誤。
因此，這兩個字段將總是有相同的內容。

<!--
There are two differences between the `dataSourceRef` field and the `dataSource` field that
users should be aware of:

* The `dataSource` field ignores invalid values (as if the field was blank) while the
  `dataSourceRef` field never ignores values and will cause an error if an invalid value is
  used. Invalid values are any core object (objects with no apiGroup) except for PVCs.
* The `dataSourceRef` field may contain different types of objects, while the `dataSource` field
  only allows PVCs and VolumeSnapshots.
-->
在 `dataSourceRef` 字段和 `dataSource` 字段之間有兩個用戶應該注意的區別：

* `dataSource` 字段會忽略無效的值（如同是空值），
   而 `dataSourceRef` 字段永遠不會忽略值，並且若填入一個無效的值，會導致錯誤。
   無效值指的是 PVC 之外的核心對象（沒有 apiGroup 的對象）。
* `dataSourceRef` 字段可以包含不同類型的對象，而 `dataSource` 字段只允許 PVC 和卷快照。

<!--
When the `CrossNamespaceVolumeDataSource` feature is enabled, there are additional differences:

* The `dataSource` field only allows local objects, while the `dataSourceRef` field allows
  objects in any namespaces.  
* When namespace is specified, `dataSource` and `dataSourceRef` are not synced.
-->
當 `CrossNamespaceVolumeDataSource` 特性被啓用時，存在其他區別：

* `dataSource` 字段僅允許本地對象，而 `dataSourceRef` 字段允許任何名字空間中的對象。
* 若指定了 namespace，則 `dataSource` 和 `dataSourceRef` 不會被同步。

<!--
Users should always use `dataSourceRef` on clusters that have the feature gate enabled, and
fall back to `dataSource` on clusters that do not. It is not necessary to look at both fields
under any circumstance. The duplicated values with slightly different semantics exist only for
backwards compatibility. In particular, a mixture of older and newer controllers are able to
interoperate because the fields are the same.
-->
用戶始終應該在啓用了此特性門控的集羣上使用 `dataSourceRef`，
在沒有啓用該特性門控的集羣上使用 `dataSource`。
在任何情況下都沒有必要查看這兩個字段。
這兩個字段的值看似相同但是語義稍微不一樣，是爲了向後兼容。
特別是混用舊版本和新版本的控制器時，它們能夠互通。

<!--
### Using volume populators

Volume populators are {{< glossary_tooltip text="controllers" term_id="controller" >}} that can
create non-empty volumes, where the contents of the volume are determined by a Custom Resource.
Users create a populated volume by referring to a Custom Resource using the `dataSourceRef` field:
-->
## 使用卷填充器   {#using-volume-populators}

卷填充器是能創建非空卷的{{< glossary_tooltip text="控制器" term_id="controller" >}}，
其卷的內容通過一個自定義資源決定。
用戶通過使用 `dataSourceRef` 字段引用自定義資源來創建一個被填充的卷：

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
因爲卷填充器是外部組件，如果沒有安裝所有正確的組件，試圖創建一個使用卷填充器的 PVC 就會失敗。
外部控制器應該在 PVC 上產生事件，以提供創建狀態的反饋，包括在由於缺少某些組件而無法創建 PVC 的情況下發出警告。

你可以把 alpha 版本的[卷數據源驗證器](https://github.com/kubernetes-csi/volume-data-source-validator)
控制器安裝到你的集羣中。
如果沒有填充器處理該數據源的情況下，該控制器會在 PVC 上產生警告事件。
當一個合適的填充器被安裝到 PVC 上時，該控制器的職責是上報與卷創建有關的事件，以及在該過程中發生的問題。

<!--
### Using a cross-namespace volume data source
-->
### 使用跨名字空間的卷數據源   {#using-a-cross-namespace-volume-data-source}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

<!--
Create a ReferenceGrant to allow the namespace owner to accept the reference.
You define a populated volume by specifying a cross namespace volume data source
using the `dataSourceRef` field. You must already have a valid ReferenceGrant
in the source namespace:
-->
創建 ReferenceGrant 以允許名字空間屬主接受引用。
你通過使用 `dataSourceRef` 字段指定跨名字空間卷數據源，定義填充的卷。
你必須在源名字空間中已經有一個有效的 ReferenceGrant：

```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: allow-ns1-pvc
  namespace: default
spec:
  from:
  - group: ""
    kind: PersistentVolumeClaim
    namespace: ns1
  to:
  - group: snapshot.storage.k8s.io
    kind: VolumeSnapshot
    name: new-snapshot-demo
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: ns1
spec:
  storageClassName: example
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  dataSourceRef:
    apiGroup: snapshot.storage.k8s.io
    kind: VolumeSnapshot
    name: new-snapshot-demo
    namespace: default
  volumeMode: Filesystem
```

<!--
## Writing Portable Configuration

If you're writing configuration templates or examples that run on a wide range of clusters
and need persistent storage, it is recommended that you use the following pattern:
-->
## 編寫可移植的配置   {#writing-portable-configuration}

如果你要編寫配置模板和示例用來在很多集羣上運行並且需要持久性存儲，建議你使用以下模式：

<!--
- Include PersistentVolumeClaim objects in your bundle of config (alongside
  Deployments, ConfigMaps, etc).
- Do not include PersistentVolume objects in the config, since the user instantiating
  the config may not have permission to create PersistentVolumes.
-->
- 將 PersistentVolumeClaim 對象包含到你的配置包（Bundle）中，和 Deployment
  以及 ConfigMap 等放在一起。
- 不要在配置中包含 PersistentVolume 對象，因爲對配置進行實例化的用戶很可能
  沒有創建 PersistentVolume 的權限。

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
- 爲用戶提供在實例化模板時指定存儲類名稱的能力。
  - 仍按用戶提供存儲類名稱，將該名稱放到 `persistentVolumeClaim.storageClassName` 字段中。
    這樣會使得 PVC 在集羣被管理員啓用了存儲類支持時能夠匹配到正確的存儲類，
  - 如果用戶未指定存儲類名稱，將 `persistentVolumeClaim.storageClassName` 留空（nil）。
    這樣，集羣會使用默認 `StorageClass` 爲用戶自動製備一個存儲卷。
    很多集羣環境都配置了默認的 `StorageClass`，或者管理員也可以自行創建默認的
    `StorageClass`。

<!--
- In your tooling, watch for PVCs that are not getting bound after some time
  and surface this to the user, as this may indicate that the cluster has no
  dynamic storage support (in which case the user should create a matching PV)
  or the cluster has no storage system (in which case the user cannot deploy
  config requiring PVCs).
-->
- 在你的工具鏈中，監測經過一段時間後仍未被綁定的 PVC 對象，要讓用戶知道這些對象，
  因爲這可能意味着集羣不支持動態存儲（因而用戶必須先創建一個匹配的 PV），或者
  集羣沒有配置存儲系統（因而用戶無法配置需要 PVC 的工作負載配置）。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Creating a PersistentVolume](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume).
* Learn more about [Creating a PersistentVolumeClaim](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolumeclaim).
* Read the [Persistent Storage design document](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).
-->
* 進一步瞭解[創建持久卷](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume)。
* 進一步學習[創建 PVC 申領](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolumeclaim)。
* 閱讀[持久存儲的設計文檔](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md)。

<!--
### API references {#reference}

Read about the APIs described in this page:

* [`PersistentVolume`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/)
* [`PersistentVolumeClaim`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/)
-->
### API 參考    {#reference}

閱讀以下頁面中描述的 API：

* [`PersistentVolume`](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/)
* [`PersistentVolumeClaim`](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/)
