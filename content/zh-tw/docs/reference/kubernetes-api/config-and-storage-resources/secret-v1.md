---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Secret"
content_type: "api_reference"
description: "Secret 包含某些類別的祕密數據。"
title: "Secret"
weight: 2
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Secret"
content_type: "api_reference"
description: "Secret holds secret data of a certain type."
title: "Secret"
weight: 2
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Secret {#Secret}
<!--
Secret holds secret data of a certain type. The total bytes of the values in the Data field must be less than MaxSecretSize bytes.
-->
Secret 包含某些類別的祕密數據。
data 字段值的總字節必須小於 MaxSecretSize 字節。

<hr>

- **apiVersion**: v1

- **kind**: Secret

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **data** (map[string][]byte)

  Data contains the secret data. Each key must consist of alphanumeric characters, '-', '_' or '.'. The serialized form of the secret data is a base64 encoded string, representing the arbitrary (possibly non-string) data value here. Described in https://tools.ietf.org/html/rfc4648#section-4
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **data** (map[string][]byte)

  data 包含祕密數據。
  每個鍵必須由字母、數字、“-”、“_” 或 “.” 組成。
  祕密數據的序列化格式是 base64 編碼的字符串，表示此處的任意（可能是非字符串）數據值。
  請參閱 https://tools.ietf.org/html/rfc4648#section-4

<!--
- **immutable** (boolean)

  Immutable, if set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified). If not set to true, the field can be modified at any time. Defaulted to nil.

- **stringData** (map[string]string)

  stringData allows specifying non-binary secret data in string form. It is provided as a write-only input field for convenience. All keys and values are merged into the data field on write, overwriting any existing values. The stringData field is never output when reading from the API.

- **type** (string)

  Used to facilitate programmatic handling of secret data. More info: https://kubernetes.io/docs/concepts/configuration/secret/#secret-types
-->
- **immutable** (boolean)

  如果 immutable 設爲 true，則確保不會更新 Secret 中存儲的數據（只能修改對象元數據）。
  如果未設爲 true，則可以隨時修改此字段。
  默認爲 nil。

- **stringData** (map[string]string)

  stringData 允許指定字符串格式的非二進制祕密數據。
  爲了方便起見，它作爲只寫輸入字段提供。
  寫入時將所有鍵和值合併到 data 字段，且覆蓋任何現有的值。
  從 API 讀取時絕不會輸出 stringData 字段。

- **type** (string)

  用於滿足程序化方式處理祕密數據。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/configuration/secret/#secret-types

## SecretList {#SecretList}

<!--
SecretList is a list of Secret.
-->
SecretList 是 Secret 的列表。

<hr>

- **apiVersion**: v1

- **kind**: SecretList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>), required

  Items is a list of secret objects. More info: https://kubernetes.io/docs/concepts/configuration/secret
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>)，必需

  items 是 Secret 對象的列表。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/configuration/secret

<!--
## Operations {#Operations}

<hr>

### `get` read the specified Secret

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 Secret

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/secrets/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Secret
- **namespace** (*in path*): string, required
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  Secret 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Secret

#### HTTP Request
-->
### `list` 列舉或觀測類別爲 Secret 的對象

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/secrets

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

200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#SecretList" >}}">SecretList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Secret

#### HTTP Request
-->
### `list` 列舉或觀測類別爲 Secret 的對象

#### HTTP 請求

GET /api/v1/secrets

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

200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#SecretList" >}}">SecretList</a>): OK

401: Unauthorized

<!--
### `create` create a Secret

#### HTTP Request
-->
### `create` 創建 Secret

#### HTTP 請求

POST /api/v1/namespaces/{namespace}/secrets

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified Secret

#### HTTP Request
-->
### `update` 替換指定的 Secret

#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/secrets/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Secret
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需
  
  Secret 的名稱。

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified Secret

#### HTTP Request
-->
### `patch` 部分更新指定的 Secret

#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/secrets/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Secret
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
  
  Secret 的名稱。

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

200 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/secret-v1#Secret" >}}">Secret</a>): Created

401: Unauthorized

<!--
### `delete` delete a Secret

#### HTTP Request
-->
### `delete` 刪除 Secret

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/secrets/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Secret
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
  
  Secret 的名稱。

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
### `deletecollection` delete collection of Secret

#### HTTP Request
-->
### `deletecollection` 刪除 Secret 的集合

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/secrets

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
