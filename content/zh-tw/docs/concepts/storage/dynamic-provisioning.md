---
title: 動態卷製備
content_type: concept
weight: 50
---
<!--
reviewers:
- saad-ali
- jsafrane
- thockin
- msau42
title: Dynamic Volume Provisioning
content_type: concept
weight: 50
-->

<!-- overview -->

<!--
Dynamic volume provisioning allows storage volumes to be created on-demand.
Without dynamic provisioning, cluster administrators have to manually make
calls to their cloud or storage provider to create new storage volumes, and
then create [`PersistentVolume` objects](/docs/concepts/storage/persistent-volumes/)
to represent them in Kubernetes. The dynamic provisioning feature eliminates
the need for cluster administrators to pre-provision storage. Instead, it
automatically provisions storage when users create
[`PersistentVolumeClaim` objects](/docs/concepts/storage/persistent-volumes/).
-->
動態卷製備允許按需創建存儲卷。
如果沒有動態製備，集羣管理員必須手動地聯繫他們的雲或存儲提供商來創建新的存儲卷，
然後在 Kubernetes 集羣創建
[`PersistentVolume` 對象](/zh-cn/docs/concepts/storage/persistent-volumes/)來表示這些卷。
動態製備功能消除了集羣管理員預先配置存儲的需要。相反，它在用戶創建
[`PersistentVolumeClaim` 對象](/zh-cn/docs/concepts/storage/persistent-volumes/)時自動製備存儲。

<!-- body -->

<!--
## Background
-->
## 背景    {#background}

<!--
The implementation of dynamic volume provisioning is based on the API object `StorageClass`
from the API group `storage.k8s.io`. A cluster administrator can define as many
`StorageClass` objects as needed, each specifying a *volume plugin* (aka
*provisioner*) that provisions a volume and the set of parameters to pass to
that provisioner when provisioning.
-->
動態卷製備的實現基於 `storage.k8s.io` API 組中的 `StorageClass` API 對象。
集羣管理員可以根據需要定義多個 `StorageClass` 對象，每個對象指定一個**卷插件**（又名 **provisioner**），
卷插件向卷製備商提供在創建卷時需要的數據卷信息及相關參數。

<!--
A cluster administrator can define and expose multiple flavors of storage (from
the same or different storage systems) within a cluster, each with a custom set
of parameters. This design also ensures that end users don't have to worry
about the complexity and nuances of how storage is provisioned, but still
have the ability to select from multiple storage options.
-->
集羣管理員可以在集羣中定義和公開多種存儲（來自相同或不同的存儲系統），每種都具有自定義參數集。
該設計也確保終端用戶不必擔心存儲製備的複雜性和細微差別，但仍然能夠從多個存儲選項中進行選擇。

<!--
For more details, see the [Storage Classes](/docs/concepts/storage/storage-classes/) concept.
-->
有關更多詳細信息，請參閱[存儲類](/zh-cn/docs/concepts/storage/storage-classes/)概念。

<!--
## Enabling Dynamic Provisioning
-->
## 啓用動態卷製備  {#enabling-dynamic-provisioning}

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
要啓用動態製備功能，集羣管理員需要爲用戶預先創建一個或多個 `StorageClass` 對象。
`StorageClass` 對象定義當動態製備被調用時，哪一個驅動將被使用和哪些參數將被傳遞給驅動。
StorageClass 對象的名字必須是一個合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
以下清單創建了一個 `StorageClass` 存儲類 "slow"，它提供類似標準磁盤的永久磁盤。

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
以下清單創建了一個 "fast" 存儲類，它提供類似 SSD 的永久磁盤。

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
## 使用動態卷製備 {#using-dynamic-provisioning}

<!--
Users request dynamically provisioned storage by including a storage class in
their `PersistentVolumeClaim`. Before Kubernetes v1.6, this was done via the
`volume.beta.kubernetes.io/storage-class` annotation. However, this annotation
is deprecated since v1.9. Users now can and should instead use the
`storageClassName` field of the `PersistentVolumeClaim` object. The value of
this field must match the name of a `StorageClass` configured by the
administrator (see [Enabling Dynamic Provisioning](#enabling-dynamic-provisioning)).
-->
用戶通過在 `PersistentVolumeClaim` 中包含存儲類來請求動態製備的存儲。
在 Kubernetes v1.9 之前，這通過 `volume.beta.kubernetes.io/storage-class` 註解實現。
然而，這個註解自 v1.6 起就不被推薦使用了。
用戶現在能夠而且應該使用 `PersistentVolumeClaim` 對象的 `storageClassName` 字段。
這個字段的值必須能夠匹配到集羣管理員配置的 `StorageClass` 名稱（見[啓用動態卷製備](#enabling-dynamic-provisioning)）。

<!--
To select the "fast" storage class, for example, a user would create the
following PersistentVolumeClaim:
-->
例如，要選擇 “fast” 存儲類，用戶將創建如下的 PersistentVolumeClaim：

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
該聲明會自動製備一塊類似 SSD 的永久磁盤。
在刪除該聲明後，這個卷也會被銷燬。

<!--
## Defaulting Behavior
-->
## 設置默認值的行爲    {#defaulting-behavior}

<!--
Dynamic provisioning can be enabled on a cluster such that all claims are
dynamically provisioned if no storage class is specified. A cluster administrator
can enable this behavior by:
-->
可以在集羣上啓用動態卷製備，以便在未指定存儲類的情況下動態設置所有聲明。
集羣管理員可以通過以下方式啓用此行爲：

<!--
- Marking one `StorageClass` object as *default*,
- Making sure that the [`DefaultStorageClass` admission controller](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
  is enabled on the API server.
-->
- 標記一個 `StorageClass` 爲 **默認**，
- 確保 [`DefaultStorageClass` 准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)在
  API 服務器端被啓用。

<!--
An administrator can mark a specific `StorageClass` as default by adding the
[`storageclass.kubernetes.io/is-default-class` annotation](/docs/reference/labels-annotations-taints/#storageclass-kubernetes-io-is-default-class) to it.
When a default `StorageClass` exists in a cluster and a user creates a
`PersistentVolumeClaim` with `storageClassName` unspecified, the
`DefaultStorageClass` admission controller automatically adds the
`storageClassName` field pointing to the default storage class.
-->
管理員可以通過向其添加
[`storageclass.kubernetes.io/is-default-class` 註解](/zh-cn/docs/reference/labels-annotations-taints/#storageclass-kubernetes-io-is-default-class)
來將特定的 `StorageClass` 標記爲默認。
當集羣中存在默認的 `StorageClass` 並且用戶創建了一個未指定 `storageClassName` 的 `PersistentVolumeClaim` 時，
`DefaultStorageClass` 准入控制器會自動向其中添加指向默認存儲類的 `storageClassName` 字段。

<!--
Note that if you set the `storageclass.kubernetes.io/is-default-class`
annotation to true on more than one StorageClass in your cluster, and you then
create a `PersistentVolumeClaim` with no `storageClassName` set, Kubernetes
uses the most recently created default StorageClass.
-->
請注意，如果你在集羣的多個 StorageClass 設置 `storageclass.kubernetes.io/is-default-class` 註解爲 true，
並之後創建了未指定 `storageClassName` 的 `PersistentVolumeClaim`，
Kubernetes 會使用最新創建的默認 StorageClass。

<!--
## Topology Awareness
-->
## 拓撲感知 {#topology-awareness}

<!--
In [Multi-Zone](/docs/setup/best-practices/multiple-zones/) clusters, Pods can be spread across
Zones in a Region. Single-Zone storage backends should be provisioned in the Zones where
Pods are scheduled. This can be accomplished by setting the
[Volume Binding Mode](/docs/concepts/storage/storage-classes/#volume-binding-mode).
-->
在[多可用區](/zh-cn/docs/setup/best-practices/multiple-zones/)集羣中，Pod 可以被分散到某個區域的多個可用區。
單可用區存儲後端應該被製備到 Pod 被調度到的可用區。
這可以通過設置[卷綁定模式](/zh-cn/docs/concepts/storage/storage-classes/#volume-binding-mode)來實現。


