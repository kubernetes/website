---
title: 動態卷供應
content_type: concept
weight: 40
---
<!--
title: Dynamic Volume Provisioning
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
Dynamic volume provisioning allows storage volumes to be created on-demand.
Without dynamic provisioning, cluster administrators have to manually make
calls to their cloud or storage provider to create new storage volumes, and
then create [`PersistentVolume` objects](/docs/concepts/storage/persistent-volumes/)
to represent them in Kubernetes. The dynamic provisioning feature eliminates
the need for cluster administrators to pre-provision storage. Instead, it
automatically provisions storage when it is requested by users.
-->
動態卷供應允許按需建立儲存卷。
如果沒有動態供應，叢集管理員必須手動地聯絡他們的雲或儲存提供商來建立新的儲存卷，
然後在 Kubernetes 叢集建立
[`PersistentVolume` 物件](/zh-cn/docs/concepts/storage/persistent-volumes/)來表示這些卷。
動態供應功能消除了叢集管理員預先配置儲存的需要。 相反，它在使用者請求時自動供應儲存。

<!-- body -->

<!--
## Background
-->
## 背景

<!--
The implementation of dynamic volume provisioning is based on the API object `StorageClass`
from the API group `storage.k8s.io`. A cluster administrator can define as many
`StorageClass` objects as needed, each specifying a *volume plugin* (aka
*provisioner*) that provisions a volume and the set of parameters to pass to
that provisioner when provisioning.
-->
動態卷供應的實現基於 `storage.k8s.io` API 組中的 `StorageClass` API 物件。
叢集管理員可以根據需要定義多個 `StorageClass` 物件，每個物件指定一個*卷外掛*（又名 *provisioner*），
卷外掛向卷供應商提供在建立卷時需要的資料卷資訊及相關引數。

<!--
A cluster administrator can define and expose multiple flavors of storage (from
the same or different storage systems) within a cluster, each with a custom set
of parameters. This design also ensures that end users don't have to worry
about the complexity and nuances of how storage is provisioned, but still
have the ability to select from multiple storage options.
-->
叢集管理員可以在叢集中定義和公開多種儲存（來自相同或不同的儲存系統），每種都具有自定義引數集。
該設計也確保終端使用者不必擔心儲存供應的複雜性和細微差別，但仍然能夠從多個儲存選項中進行選擇。

<!--
More information on storage classes can be found
[here](/docs/concepts/storage/storage-classes/).
-->
點選[這裡](/zh-cn/docs/concepts/storage/storage-classes/)查閱有關儲存類的更多資訊。

<!--
## Enabling Dynamic Provisioning
-->
## 啟用動態卷供應  {#enabling-dynamic-provisioning}

<!--
To enable dynamic provisioning, a cluster administrator needs to pre-create
one or more StorageClass objects for users.
StorageClass objects define which provisioner should be used and what parameters
should be passed to that provisioner when dynamic provisioning is invoked.
The name of a StorageClass object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

The following manifest creates a storage class "slow" which provisions standard
disk-like persistent disks.
-->
要啟用動態供應功能，叢集管理員需要為使用者預先建立一個或多個 `StorageClass` 物件。
`StorageClass` 物件定義當動態供應被呼叫時，哪一個驅動將被使用和哪些引數將被傳遞給驅動。
StorageClass 物件的名字必須是一個合法的 [DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
以下清單建立了一個 `StorageClass` 儲存類 "slow"，它提供類似標準磁碟的永久磁碟。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
```

<!--
The following manifest creates a storage class "fast" which provisions
SSD-like persistent disks.
-->
以下清單建立了一個 "fast" 儲存類，它提供類似 SSD 的永久磁碟。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
```

<!--
## Using Dynamic Provisioning
-->
## 使用動態卷供應

<!--
Users request dynamically provisioned storage by including a storage class in
their `PersistentVolumeClaim`. Before Kubernetes v1.6, this was done via the
`volume.beta.kubernetes.io/storage-class` annotation. However, this annotation
is deprecated since v1.9. Users now can and should instead use the
`storageClassName` field of the `PersistentVolumeClaim` object. The value of
this field must match the name of a `StorageClass` configured by the
administrator (see [below](#enabling-dynamic-provisioning)).
-->
使用者透過在 `PersistentVolumeClaim` 中包含儲存類來請求動態供應的儲存。
在 Kubernetes v1.9 之前，這透過 `volume.beta.kubernetes.io/storage-class` 註解實現。然而，這個註解自 v1.6 起就不被推薦使用了。
使用者現在能夠而且應該使用 `PersistentVolumeClaim` 物件的 `storageClassName` 欄位。
這個欄位的值必須能夠匹配到叢集管理員配置的 `StorageClass` 名稱（見[下面](#enabling-dynamic-provisioning)）。

<!--
To select the "fast" storage class, for example, a user would create the
following PersistentVolumeClaim:
-->
例如，要選擇 “fast” 儲存類，使用者將建立如下的 PersistentVolumeClaim：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: claim1
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast
  resources:
    requests:
      storage: 30Gi
```

<!--
This claim results in an SSD-like Persistent Disk being automatically
provisioned. When the claim is deleted, the volume is destroyed.
-->
該宣告會自動供應一塊類似 SSD 的永久磁碟。
在刪除該聲明後，這個卷也會被銷燬。

<!--
## Defaulting Behavior
-->
## 設定預設值的行為

<!--
Dynamic provisioning can be enabled on a cluster such that all claims are
dynamically provisioned if no storage class is specified. A cluster administrator
can enable this behavior by:
-->
可以在叢集上啟用動態卷供應，以便在未指定儲存類的情況下動態設定所有宣告。
叢集管理員可以透過以下方式啟用此行為：

<!--
- Marking one `StorageClass` object as *default*;
- Making sure that the [`DefaultStorageClass` admission controller](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
  is enabled on the API server.
-->
- 標記一個 `StorageClass` 為 *預設*；
- 確保 [`DefaultStorageClass` 准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)在 API 服務端被啟用。

<!--
An administrator can mark a specific `StorageClass` as default by adding the
`storageclass.kubernetes.io/is-default-class` annotation to it.
When a default `StorageClass` exists in a cluster and a user creates a
`PersistentVolumeClaim` with `storageClassName` unspecified, the
`DefaultStorageClass` admission controller automatically adds the
`storageClassName` field pointing to the default storage class.
-->
管理員可以透過向其新增 `storageclass.kubernetes.io/is-default-class` 註解來將特定的 `StorageClass` 標記為預設。
當叢集中存在預設的 `StorageClass` 並且使用者建立了一個未指定 `storageClassName` 的 `PersistentVolumeClaim` 時，
`DefaultStorageClass` 准入控制器會自動向其中新增指向預設儲存類的 `storageClassName` 欄位。

<!--
Note that there can be at most one *default* storage class on a cluster, or
a `PersistentVolumeClaim` without `storageClassName` explicitly specified cannot
be created.
-->
請注意，叢集上最多隻能有一個 *預設* 儲存類，否則無法建立沒有明確指定
`storageClassName` 的 `PersistentVolumeClaim`。

<!--
## Topology Awareness
-->
## 拓撲感知

<!--
In [Multi-Zone](/docs/setup/multiple-zones) clusters, Pods can be spread across
Zones in a Region. Single-Zone storage backends should be provisioned in the Zones where
Pods are scheduled. This can be accomplished by setting the [Volume Binding
Mode](/docs/concepts/storage/storage-classes/#volume-binding-mode).
-->
在[多區域](/zh-cn/docs/setup/best-practices/multiple-zones/)叢集中，Pod 可以被分散到多個區域。
單區域儲存後端應該被供應到 Pod 被排程到的區域。
這可以透過設定[卷繫結模式](/zh-cn/docs/concepts/storage/storage-classes/#volume-binding-mode)來實現。

