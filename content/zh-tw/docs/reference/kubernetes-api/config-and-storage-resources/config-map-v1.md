---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ConfigMap"
content_type: "api_reference"
description: "ConfigMap 包含供 Pod 使用的配置資料。"
title: "ConfigMap"
weight: 1
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ConfigMap"
content_type: "api_reference"
description: "ConfigMap holds configuration data for pods to consume."
title: "ConfigMap"
weight: 1
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## ConfigMap {#ConfigMap}

<!--
ConfigMap holds configuration data for pods to consume.
-->
ConfigMap 包含供 Pod 使用的配置資料。

<hr>

- **apiVersion**: v1

- **kind**: ConfigMap

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  
  標準的物件元資料。
  更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **binaryData** (map[string][]byte)

  BinaryData contains the binary data. Each key must consist of alphanumeric characters, '-', '_' or '.'. BinaryData can contain byte sequences that are not in the UTF-8 range. The keys stored in BinaryData must not overlap with the ones in the Data field, this is enforced during validation process. Using this field will require 1.10+ apiserver and kubelet.
-->
- **binaryData** (map[string][]byte)
  
  binaryData 包含二進位制資料。
  每個鍵必須由字母、數字、“-”、“_” 或 “.” 組成。
  binaryData 可以包含不在 UTF-8 範圍中的位元組序列。
  binaryData 中儲存的鍵不得與 data 欄位中的鍵重疊，這在驗證過程中是強制要求。
  使用此欄位需要 apiserver 和 kubelet 的版本高於 1.10。

<!--
- **data** (map[string]string)

  Data contains the configuration data. Each key must consist of alphanumeric characters, '-', '_' or '.'. Values with non-UTF-8 byte sequences must use the BinaryData field. The keys stored in Data must not overlap with the keys in the BinaryData field, this is enforced during validation process.

- **immutable** (boolean)

  Immutable, if set to true, ensures that data stored in the ConfigMap cannot be updated (only object metadata can be modified). If not set to true, the field can be modified at any time. Defaulted to nil.
-->
- **data** (map[string]string)
  
  data 包含配置資料。
  每個鍵必須由字母、數字、“-”、“_” 或 “.” 組成。
  如果值包含非 UTF-8 位元組序列，則必須使用 binaryData 欄位。
  data 中儲存的鍵不得與 binaryData 欄位中的鍵重疊，這在驗證過程中是強制要求。

- **immutable** (boolean)
  
  如果 immutable 設為 true，
  則確保不會更新 ConfigMap 中儲存的資料（只能修改物件元資料）。
  如果未設為 true，則可以隨時修改此欄位。
  預設為 nil。

## ConfigMapList {#ConfigMapList}

<!--
ConfigMapList is a resource containing a list of ConfigMap objects.
-->
ConfigMapList 是包含 ConfigMap 物件列表的資源。

<hr>

- **apiVersion**: v1

- **kind**: ConfigMapList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>), required
  Items is the list of ConfigMaps.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  
  更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>)，必需
  
  items 是 ConfigMap 的列表。

<!--
## Operations {#Operations}
<hr>
### `get` read the specified ConfigMap

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 ConfigMap

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/configmaps/{name}

<!--
#### Parameters

- **name** (*in path*): string, required
  name of the ConfigMap

- **namespace** (*in path*): string, required
-->
#### 引數

- **name** (**路徑引數**): string，必需
  
  ConfigMap 的名稱

- **namespace** (**路徑引數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢引數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ConfigMap

#### HTTP Request
-->
### `list` 列出或觀測類別為 ConfigMap 的物件

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/configmaps

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
#### 引數

- **namespace** (**路徑引數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

200 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMapList" >}}">ConfigMapList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ConfigMap

#### HTTP Request
-->
### `list` 列出或觀測類別為 ConfigMap 的物件

#### HTTP 請求

GET /api/v1/configmaps

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

200 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMapList" >}}">ConfigMapList</a>): OK

401: Unauthorized

<!--
### `create` create a ConfigMap

#### HTTP Request
-->
### `create` 建立 ConfigMap

#### HTTP 請求

POST /api/v1/namespaces/{namespace}/configmaps

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 引數

- **namespace** (**路徑引數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ConfigMap

#### HTTP Request
-->
### `update` 替換指定的 ConfigMap

#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/configmaps/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ConfigMap
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 引數

- **name** (**路徑引數**): string，必需
  
  ConfigMap 的名稱

- **namespace** (**路徑引數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ConfigMap

#### HTTP Request
-->
### `patch` 部分更新指定的 ConfigMap

#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/configmaps/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ConfigMap
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 引數

- **name** (**路徑引數**): string，必需
  
  ConfigMap 的名稱

- **namespace** (**路徑引數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

200 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/config-map-v1#ConfigMap" >}}">ConfigMap</a>): Created

401: Unauthorized

<!--
### `delete` delete a ConfigMap

#### HTTP Request
-->
### `delete` 刪除 ConfigMap

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/configmaps/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ConfigMap
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 引數

- **name** (**路徑引數**): string，必需
  
  ConfigMap 的名稱

- **namespace** (**路徑引數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ConfigMap

#### HTTP Request
-->
### `deletecollection` 刪除 ConfigMap 的集合

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/configmaps

<!--
#### Parameters
- **namespace** (*in path*): string, required
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

- **namespace** (**路徑引數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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
