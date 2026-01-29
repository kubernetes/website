---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSIStorageCapacity"
content_type: "api_reference"
description: "CSIStorageCapacity 儲存一個 CSI GetCapacity 調用的結果。"
title: "CSIStorageCapacity"
weight: 5
---
<!--
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSIStorageCapacity"
content_type: "api_reference"
description: "CSIStorageCapacity stores the result of one CSI GetCapacity call."
title: "CSIStorageCapacity"
weight: 5
-->

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## CSIStorageCapacity {#CSIStorageCapacity}

<!--
CSIStorageCapacity stores the result of one CSI GetCapacity call. For a given StorageClass, this describes the available capacity in a particular topology segment.  This can be used when considering where to instantiate new PersistentVolumes.

For example this can express things like: - StorageClass "standard" has "1234 GiB" available in "topology.kubernetes.io/zone=us-east1" - StorageClass "localssd" has "10 GiB" available in "kubernetes.io/hostname=knode-abc123"

The following three cases all imply that no capacity is available for a certain combination: - no object exists with suitable topology and storage class name - such an object exists, but the capacity is unset - such an object exists, but the capacity is zero
-->
CSIStorageCapacity 儲存一個 CSI GetCapacity 調用的結果。
對於給定的 StorageClass，此結構描述了特定拓撲段中可用的容量。
當考慮在哪裏實例化新的 PersistentVolume 時可以使用此項。

例如，此結構可以描述如下內容：

- “standard” 的 StorageClass 容量爲 “1234 GiB”，可用於 “topology.kubernetes.io/zone=us-east1”
- “localssd” 的 StorageClass 容量爲 “10 GiB”，可用於 “kubernetes.io/hostname=knode-abc123”

以下三種情況均暗示了某些組合沒有可用的容量：

- 不存在拓撲和儲存類名稱合適的對象
- 這種對象存在，但容量未設置
- 這種對象存在，但容量爲零

<!--
The producer of these objects can decide which approach is more suitable.

They are consumed by the kube-scheduler when a CSI driver opts into capacity-aware scheduling with CSIDriverSpec.StorageCapacity. The scheduler compares the MaximumVolumeSize against the requested size of pending volumes to filter out unsuitable nodes. If MaximumVolumeSize is unset, it falls back to a comparison against the less precise Capacity. If that is also unset, the scheduler assumes that capacity is insufficient and tries some other node.
-->
這些對象的製作方可以決定哪種方法更合適。

當 CSI 驅動選擇使用 CSIDriverSpec.StorageCapacity 進行容量感知調度時，kube-scheduler 會使用這些對象。
該調度器將 MaximumVolumeSize 與 pending 卷的請求大小進行比較，以過濾掉不合適的節點。
如果未設置 MaximumVolumeSize，則回退爲與不太精確的容量（Capacity）進行比較。
如果還是未設置，則該調度器假定容量不足並嘗試某些其他節點。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSIStorageCapacity

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. The name has no particular meaning. It must be a DNS subdomain (dots allowed, 253 characters). To ensure that there are no conflicts with other CSI drivers on the cluster, the recommendation is to use csisc-\<uuid>, a generated name, or a reverse-domain name which ends with the unique CSI driver name.

  Objects are namespaced.

  More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元資料。
  此名稱沒有特定的含義。
  它必須是 DNS 子域名（允許英文句點，最多 253 個字符）。
  爲了確保與叢集上的其他 CSI 驅動沒有衝突，建議使用一個生成的名稱 csisc-\<uuid>，
  或使用以唯一 CSI 驅動名稱結尾的反向域名。

  這些對象是有命名空間的。

  更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **storageClassName** (string), required

  storageClassName represents the name of the StorageClass that the reported capacity applies to. It must meet the same requirements as the name of a StorageClass object (non-empty, DNS subdomain). If that object no longer exists, the CSIStorageCapacity object is obsolete and should be removed by its creator. This field is immutable.

- **capacity** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity is the value reported by the CSI driver in its GetCapacityResponse for a GetCapacityRequest with topology and parameters that match the previous fields.

  The semantic is currently (CSI spec 1.2) defined as: The available capacity, in bytes, of the storage that can be used to provision volumes. If not set, that information is currently unavailable.
-->
- **storageClassName** (string)，必需

  storageClassName 是已報告容量所對應的 StorageClass 的名稱。
  它必須滿足與 StorageClass 對象名稱相同的要求（非空，DNS 子域名）。
  如果該對象不再存在，則 CSIStorageCapacity 對象將被廢棄且應由創建者移除。
  此字段不可變更。

- **capacity** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity 是 CSI 驅動在其 GetCapacityResponse 中爲 GetCapacityRequest 報告的值，其拓撲和參數與之前的字段匹配。

  該語義目前（CSI 規範 1.2）定義爲：可用於製備卷的可用儲存容量（單位爲字節）。
  如果未設置，則該資訊目前不可用。

<!--
- **maximumVolumeSize** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  maximumVolumeSize is the value reported by the CSI driver in its GetCapacityResponse for a GetCapacityRequest with topology and parameters that match the previous fields.

  This is defined since CSI spec 1.4.0 as the largest size that may be used in a CreateVolumeRequest.capacity_range.required_bytes field to create a volume with the same parameters as those in GetCapacityRequest. The corresponding value in the Kubernetes API is ResourceRequirements.Requests in a volume claim.
-->
- **maximumVolumeSize** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  maximumVolumeSize 是 CSI 驅動在其 GetCapacityResponse 中爲 GetCapacityRequest 報告的值，其拓撲和參數與之前的字段匹配。

  自從 CSI 規範 1.4.0 起，這定義爲 `CreateVolumeRequest.capacity_range.required_bytes` 字段中可以使用的最大值，
  以便用 GetCapacityRequest 中相同的參數創建一個卷。
  Kubernetes API 中的相應值是卷聲明中的 ResourceRequirements.Requests。

<!--
- **nodeTopology** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  nodeTopology defines which nodes have access to the storage for which capacity was reported. If not set, the storage is not accessible from any node in the cluster. If empty, the storage is accessible from all nodes. This field is immutable.
-->
- **nodeTopology** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  nodeTopology 定義了哪些節點有權訪問已報告容量的儲存。
  如果未設置，則不能從叢集中的任意節點訪問此儲存。
  如果留空，則可以從所有節點訪問此儲存。此字段不可變更。

## CSIStorageCapacityList {#CSIStorageCapacityList}

<!--
CSIStorageCapacityList is a collection of CSIStorageCapacity objects.
-->
CSIStorageCapacityList 是 CSIStorageCapacity 對象的集合。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSIStorageCapacityList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>), required

  items is the list of CSIStorageCapacity objects.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>)，必需

  items 是 CSIStorageCapacity 對象的列表。

<!--
## Operations {#Operations}
<hr>
### `get` read the specified CSIStorageCapacity
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 CSIStorageCapacity

#### HTTP 請求

GET /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSIStorageCapacity
- **namespace** (*in path*): string, required
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CSIStorageCapacity 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind CSIStorageCapacity
#### HTTP Request
-->
### `list` 列出或觀測類別爲 CSIStorageCapacity 的對象

#### HTTP 請求

GET /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacityList" >}}">CSIStorageCapacityList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind CSIStorageCapacity
#### HTTP Request
-->
### `list` 列出或觀測類別爲 CSIStorageCapacity 的對象

#### HTTP 請求

GET /apis/storage.k8s.io/v1/csistoragecapacities

<!--
#### Parameters
- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
#### 參數

- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacityList" >}}">CSIStorageCapacityList</a>): OK

401: Unauthorized

<!--
### `create` create a CSIStorageCapacity
#### HTTP Request
-->
### `create` 創建 CSIStorageCapacity

#### HTTP 請求

POST /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified CSIStorageCapacity
#### HTTP Request
-->
### `update` 替換指定的 CSIStorageCapacity

#### HTTP 請求

PUT /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSIStorageCapacity
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CSIStorageCapacity 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified CSIStorageCapacity
#### HTTP Request
-->
### `patch` 部分更新指定的 CSIStorageCapacity

#### HTTP 請求

PATCH /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSIStorageCapacity
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CSIStorageCapacity 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-storage-capacity-v1#CSIStorageCapacity" >}}">CSIStorageCapacity</a>): Created

401: Unauthorized

<!--
### `delete` delete a CSIStorageCapacity
#### HTTP Request
-->
### `delete` 刪除 CSIStorageCapacity

#### HTTP 請求

DELETE /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSIStorageCapacity
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CSIStorageCapacity 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of CSIStorageCapacity
#### HTTP Request
-->
### `deletecollection` 刪除 CSIStorageCapacity 的集合

#### HTTP 請求

DELETE /apis/storage.k8s.io/v1/namespaces/{namespace}/csistoragecapacities

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
-->
#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
