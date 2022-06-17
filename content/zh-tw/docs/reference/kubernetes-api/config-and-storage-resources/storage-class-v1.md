---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "StorageClass"
content_type: "api_reference"
description: "StorageClass 為可以動態製備 PersistentVolume 的儲存類描述引數。"
title: "StorageClass"
weight: 6
---
<!--
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "StorageClass"
content_type: "api_reference"
description: "StorageClass describes the parameters for a class of storage for which PersistentVolumes can be dynamically provisioned."
title: "StorageClass"
weight: 6
-->

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## StorageClass {#StorageClass}
<!--
StorageClass describes the parameters for a class of storage for which PersistentVolumes can be dynamically provisioned.

StorageClasses are non-namespaced; the name of the storage class according to etcd is in ObjectMeta.Name.
-->
StorageClass 為可以動態製備 PersistentVolume 的儲存類描述引數。

StorageClass 是不受名字空間作用域限制的；按照 etcd 設定的儲存類的名稱位於 ObjectMeta.Name 中。

<hr>

- **apiVersion**: storage.k8s.io/v1
- **kind**: StorageClass

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **provisioner** (string), required
  Provisioner indicates the type of the provisioner.

- **allowVolumeExpansion** (boolean)
  AllowVolumeExpansion shows whether the storage class allow volume expand
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  標準的物件元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **provisioner** (string)，必需
  provisioner 表示製備器的類別。

- **allowVolumeExpansion** (boolean)
  allowVolumeExpansion 顯示儲存類是否允許卷擴充。

<!--
- **allowedTopologies** ([]TopologySelectorTerm)
  *Atomic: will be replaced during a merge*

  Restrict the node topologies where volumes can be dynamically provisioned. Each volume plugin defines its own supported topology specifications. An empty TopologySelectorTerm list means there is no topology restriction. This field is only honored by servers that enable the VolumeScheduling feature.
  
  <a name="TopologySelectorTerm"></a>
  *A topology selector term represents the result of label queries. A null or empty topology selector term matches no objects. The requirements of them are ANDed. It provides a subset of functionality as NodeSelectorTerm. This is an alpha feature and may change in the future.*
-->
- **allowedTopologies** ([]TopologySelectorTerm)
  **原子性：將在合併期間被替換**
  
  限制可以動態製備卷的節點拓撲。每個卷外掛定義其自己支援的拓撲規約。
  空的 TopologySelectorTerm 列表意味著沒有拓撲限制。
  只有啟用 VolumeScheduling 功能特性的伺服器才能使用此欄位。
  
  <a name="TopologySelectorTerm"></a> 
  **拓撲選擇器條件表示標籤查詢的結果。
  一個 null 或空的拓撲選擇器條件不會匹配任何物件。各個條件的要求按邏輯與的關係來計算。
  此選擇器作為 NodeSelectorTerm 所提供功能的子集。此功能為 Alpha 特性，將來可能會變更。**

<!--
  - **allowedTopologies.matchLabelExpressions** ([]TopologySelectorLabelRequirement)
    A list of topology selector requirements by labels.
    <a name="TopologySelectorLabelRequirement"></a>
    *A topology selector requirement is a selector that matches given label. This is an alpha feature and may change in the future.*

    - **allowedTopologies.matchLabelExpressions.key** (string), required
      The label key that the selector applies to.
    - **allowedTopologies.matchLabelExpressions.values** ([]string), required
      An array of string values. One value must match the label to be selected. Each entry in Values is ORed.
-->  
  - **allowedTopologies.matchLabelExpressions** ([]TopologySelectorLabelRequirement)
    按標籤設定的拓撲選擇器要求的列表。
    
    <a name="TopologySelectorLabelRequirement"></a> 
    **拓撲選擇器要求是與給定標籤匹配的一個選擇器。此功能為 Alpha 特性，將來可能會變更。**
    
    - **allowedTopologies.matchLabelExpressions.key** (string)，必需
      選擇器所針對的標籤鍵。
    
    - **allowedTopologies.matchLabelExpressions.values** ([]string)，必需
      字串陣列。一個值必須與要選擇的標籤匹配。values 中的每個條目按邏輯或的關係來計算。

<!--
- **mountOptions** ([]string)
  Dynamically provisioned PersistentVolumes of this storage class are created with these mountOptions, e.g. ["ro", "soft"]. Not validated - mount of the PVs will simply fail if one is invalid.

- **parameters** (map[string]string)
  Parameters holds the parameters for the provisioner that should create volumes of this storage class.
-->
- **mountOptions** ([]string)
  此儲存類動態製備的 PersistentVolume 用這些 mountOptions（例如 ["ro", "soft"]）進行建立。
  系統對選項作檢查——如果有一個選項無效，則這些 PV 的掛載將失敗。

- **parameters** (map[string]string)
  parameters 包含應建立此儲存類卷的製備器的引數。

<!--
- **reclaimPolicy** (string)
  Dynamically provisioned PersistentVolumes of this storage class are created with this reclaimPolicy. Defaults to Delete.

- **volumeBindingMode** (string)
  VolumeBindingMode indicates how PersistentVolumeClaims should be provisioned and bound.  When unset, VolumeBindingImmediate is used. This field is only honored by servers that enable the VolumeScheduling feature.
-->
- **reclaimPolicy** (string)
  此儲存類動態製備的 PersistentVolume 用這個 reclaimPolicy 進行建立。預設為 Delete。

- **volumeBindingMode** (string)
  volumeBindingMode 指示應該如何製備和繫結 PersistentVolumeClaim。
  未設定時，將使用 VolumeBindingImmediate。
  只有啟用 VolumeScheduling 功能特性的伺服器才能使用此欄位。

## StorageClassList {#StorageClassList}
<!--
StorageClassList is a collection of storage classes.
-->
StorageClassList 是儲存類的集合。

<hr>

- **apiVersion**: storage.k8s.io/v1
- **kind**: StorageClassList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>), required
  Items is the list of StorageClasses
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  標準的列表元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>)，必需
  items 是 StorageClass 的列表。

<!--
## Operations {#Operations}
### `get` read the specified StorageClass
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 StorageClass
#### HTTP 請求
GET /apis/storage.k8s.io/v1/storageclasses/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the StorageClass
- **pretty** (*in query*): string
-->
#### 引數
- **name** (**路徑引數**): string，必需
  StorageClass 的名稱

- **pretty** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應
200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind StorageClass
#### HTTP Request
-->
### `list` 列出或觀測類別為 StorageClass 的物件
#### HTTP 請求
GET /apis/storage.k8s.io/v1/storageclasses

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
#### 引數
- **allowWatchBookmarks** (**查詢引數**): boolean
  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢引數**): integer
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **timeoutSeconds** (**查詢引數**): integer
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢引數**): boolean
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應
200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClassList" >}}">StorageClassList</a>): OK

401: Unauthorized

<!--
### `create` create a StorageClass
#### HTTP Request
-->
### `create` 建立 StorageClass
#### HTTP 請求
POST /apis/storage.k8s.io/v1/storageclasses

<!--
#### Parameters
- **body**: <a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 引數
- **body**: <a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>，必需
- **dryRun** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應
200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified StorageClass
#### HTTP Request
-->
### `update` 替換指定的 StorageClass
#### HTTP 請求
PUT /apis/storage.k8s.io/v1/storageclasses/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the StorageClass
- **body**: <a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 引數
- **name** (**路徑引數**): string，必需
  StorageClass 的名稱

- **body**: <a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>，必需
- **dryRun** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應
200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified StorageClass
#### HTTP Request
-->
### `patch` 部分更新指定的 StorageClass
#### HTTP 請求
PATCH /apis/storage.k8s.io/v1/storageclasses/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the StorageClass
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 引數
- **name** (**路徑引數**): string，必需
  StorageClass 的名稱

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需
- **dryRun** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢引數**): boolean
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應
200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Created

401: Unauthorized

<!--
### `delete` delete a StorageClass
#### HTTP Request
-->
### `delete` 刪除 StorageClass
#### HTTP 請求
DELETE /apis/storage.k8s.io/v1/storageclasses/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the StorageClass
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 引數
- **name** (**路徑引數**): string，必需
  StorageClass 的名稱

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢引數**): integer
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應
200 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/storage-class-v1#StorageClass" >}}">StorageClass</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of StorageClass
#### HTTP Request
-->
### `deletecollection` 刪除 StorageClass 的集合
#### HTTP 請求
DELETE /apis/storage.k8s.io/v1/storageclasses

<!--
#### Parameters
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
-->
#### 引數
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢引數**): integer
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢引數**): integer
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢引數**): string
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **timeoutSeconds** (**查詢引數**): integer
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應
200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
