---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "VolumeAttributesClass"
content_type: "api_reference"
description: "VolumeAttributesClass 表示由 CSI 驅動所定義的可變更卷屬性的規約。"
title: "VolumeAttributesClass"
weight: 12
---
<!--
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "VolumeAttributesClass"
content_type: "api_reference"
description: "VolumeAttributesClass represents a specification of mutable volume attributes defined by the CSI driver."
title: "VolumeAttributesClass"
weight: 12
auto_generated: true
-->

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## VolumeAttributesClass {#VolumeAttributesClass}

<!--
VolumeAttributesClass represents a specification of mutable volume attributes defined by the CSI driver. The class can be specified during dynamic provisioning of PersistentVolumeClaims, and changed in the PersistentVolumeClaim spec after provisioning.
-->
VolumeAttributesClass 表示由 CSI 驅動所定義的可變更卷屬性的規約。
此類可以在動態製備 PersistentVolumeClaim 期間被指定，
並且可以在製備之後在 PersistentVolumeClaim 規約中更改。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: VolumeAttributesClass

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **driverName** (string), required

  Name of the CSI driver This field is immutable.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **driverName** (string)，必需

  CSI 驅動的名稱。此字段是不可變更的。

<!--
- **parameters** (map[string]string)

  parameters hold volume attributes defined by the CSI driver. These values are opaque to the Kubernetes and are passed directly to the CSI driver. The underlying storage provider supports changing these attributes on an existing volume, however the parameters field itself is immutable. To invoke a volume update, a new VolumeAttributesClass should be created with new parameters, and the PersistentVolumeClaim should be updated to reference the new VolumeAttributesClass.
  
  This field is required and must contain at least one key/value pair. The keys cannot be empty, and the maximum number of parameters is 512, with a cumulative max size of 256K. If the CSI driver rejects invalid parameters, the target PersistentVolumeClaim will be set to an "Infeasible" state in the modifyVolumeStatus field.
-->
- **parameters** (map[string]string)

  parameters 保存由 CSI 驅動所定義的卷屬性。這些值對 Kubernetes 是不透明的，被直接傳遞給 CSI 驅動。
  下層存儲驅動支持更改現有卷的這些屬性，但 parameters 字段本身是不可變更的。
  要觸發一次卷更新，應該使用新的參數創建新的 VolumeAttributesClass，
  並且應更新 PersistentVolumeClaim，使之引用新的 VolumeAttributesClass。

  此字段是必需的，必須至少包含一個鍵/值對。鍵不能爲空，參數最多 512 個，累計最大尺寸爲 256K。
  如果 CSI 驅動拒絕無效參數，則目標 PersistentVolumeClaim
  的狀態中 modifyVolumeStatus 字段將被設置爲 “Infeasible”。

## VolumeAttributesClassList {#VolumeAttributesClassList}

<!--
VolumeAttributesClassList is a collection of VolumeAttributesClass objects.
-->
VolumeAttributesClassList 是 VolumeAttributesClass 對象的集合。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: VolumeAttributesClassList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>), required

  items is the list of VolumeAttributesClass objects.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>)，必需

  items 是 VolumeAttributesClass 對象的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified VolumeAttributesClass

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 VolumeAttributesClass

#### HTTP 請求

GET /apis/storage.k8s.io/v1/volumeattributesclasses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the VolumeAttributesClass

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  VolumeAttributesClass 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind VolumeAttributesClass

#### HTTP Request
-->
### `list` 列舉或監視類別爲 VolumeAttributesClass 的對象

#### HTTP 請求

GET /apis/storage.k8s.io/v1/volumeattributesclasses

<!--
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClassList" >}}">VolumeAttributesClassList</a>): OK

401: Unauthorized

<!--
### `create` create a VolumeAttributesClass

#### HTTP Request
-->
### `create` 創建 VolumeAttributesClass

#### HTTP 請求

POST /apis/storage.k8s.io/v1/volumeattributesclasses

<!--
#### Parameters

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified VolumeAttributesClass

#### HTTP Request
-->
### `update` 替換指定的 VolumeAttributesClass

#### HTTP 請求

PUT /apis/storage.k8s.io/v1/volumeattributesclasses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the VolumeAttributesClass

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  VolumeAttributesClass 的名稱。

- **body**: <a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified VolumeAttributesClass

#### HTTP Request
-->
### `patch` 部分更新指定的 VolumeAttributesClass

#### HTTP 請求

PATCH /apis/storage.k8s.io/v1/volumeattributesclasses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the VolumeAttributesClass

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  VolumeAttributesClass 的名稱。

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Created

401: Unauthorized

<!--
### `delete` delete a VolumeAttributesClass

#### HTTP Request
-->
### `delete` 刪除 VolumeAttributesClass

#### HTTP 請求

DELETE /apis/storage.k8s.io/v1/volumeattributesclasses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the VolumeAttributesClass

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  VolumeAttributesClass 的名稱。

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

200 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/volume-attributes-class-v1#VolumeAttributesClass" >}}">VolumeAttributesClass</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of VolumeAttributesClass

#### HTTP Request
-->
### `deletecollection` 刪除 VolumeAttributesClass 的集合

#### HTTP 請求

DELETE /apis/storage.k8s.io/v1/volumeattributesclasses

<!--
#### Parameters

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
#### 參數

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
