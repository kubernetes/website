---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ResourceQuota"
content_type: "api_reference"
description: "ResourceQuota 設置每個命名空間強制執行的聚合配額限制。"
title: "ResourceQuota"
weight: 3
---

<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ResourceQuota"
content_type: "api_reference"
description: "ResourceQuota sets aggregate quota restrictions enforced per namespace."
title: "ResourceQuota"
weight: 3
auto_generated: true 
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## ResourceQuota {#ResourceQuota}

<!-- 
ResourceQuota sets aggregate quota restrictions enforced per namespace 
-->
ResourceQuota 設置每個命名空間強制執行的聚合配額限制。

<hr>

- **apiVersion**: v1

- **kind**: ResourceQuota

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!-- 
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->

  標準的對象元資料。
  更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuotaSpec" >}}">ResourceQuotaSpec</a>)

  <!-- 
  Spec defines the desired quota. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->

  spec 定義所需的配額。
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuotaStatus" >}}">ResourceQuotaStatus</a>)

  <!-- 
  Status defines the actual enforced quota and its current usage. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->

  status 定義實際執行的配額及其當前使用情況。
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## ResourceQuotaSpec {#ResourceQuotaSpec}

ResourceQuotaSpec 定義爲 Quota 強制執行所需的硬限制。

<hr>

- **hard** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  <!-- 
  hard is the set of desired hard limits for each named resource. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/
  -->

  hard 是每種指定資源所需的硬性限制集合。
  更多資訊： https://kubernetes.io/docs/concepts/policy/resource-quotas/

- **scopeSelector** (ScopeSelector)

  <!-- 
  scopeSelector is also a collection of filters like scopes that must match each object tracked by a quota but expressed using ScopeSelectorOperator in combination with possible values. For a resource to match, both scopes AND scopeSelector (if specified in spec), must be matched. 
  -->

  scopeSelector 也是一組過濾器的集合，和 scopes 類似，
  必須匹配配額所跟蹤的每個對象，但使用 ScopeSelectorOperator 結合可能的值來表示。
  對於要匹配的資源，必須同時匹配 scopes 和 scopeSelector（如果在 spec 中設置了的話）。

  <a name="ScopeSelector"></a>
  <!-- 
  *A scope selector represents the AND of the selectors represented by the scoped-resource selector requirements.* 
  -->

  scope 選擇算符表示的是由限定範圍的資源選擇算符進行**邏輯與**運算得出的結果。

  - **scopeSelector.matchExpressions** ([]ScopedResourceSelectorRequirement)

    <!--
    *Atomic: will be replaced during a merge*
    
    A list of scope selector requirements by scope of the resources. 
    -->
    **原子：將在合併期間被替換**

    按資源範圍劃分的範圍選擇算符需求列表。

    <a name="ScopedResourceSelectorRequirement"></a>
    <!-- 
    *A scoped-resource selector requirement is a selector that contains values, a scope name, and an operator that relates the scope name and values.* 
    -->

    限定範圍的資源選擇算符需求是一種選擇算符，包含值、範圍名稱和將二者關聯起來的運算符。

    - **scopeSelector.matchExpressions.operator** (string)，必需

      <!-- 
      Represents a scope's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist. 
      -->

      表示範圍與一組值之間的關係。有效的運算符爲 In、NotIn、Exists、DoesNotExist。

    - **scopeSelector.matchExpressions.scopeName** (string)，必需

      <!-- 
      The name of the scope that the selector applies to. 
      -->

      選擇器所適用的範圍的名稱。

    - **scopeSelector.matchExpressions.values** ([]string)

      <!--
      *Atomic: will be replaced during a merge*

      An array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch. 
      -->
      **原子：將在合併期間被替換**

      字符串值數組。
      如果操作符是 In 或 NotIn，values 數組必須是非空的。
      如果操作符是 Exists 或 DoesNotExist，values 數組必須爲空。
      該數組將在策略性合併補丁操作期間被替換。

- **scopes** ([]string)

  <!--
  *Atomic: will be replaced during a merge*
  
  A collection of filters that must match each object tracked by a quota. If not specified, the quota matches all objects. 
  -->

  **原子：將在合併期間被替換**

  一個匹配被配額跟蹤的所有對象的過濾器集合。
  如果沒有指定，則預設匹配所有對象。

## ResourceQuotaStatus {#ResourceQuotaStatus}

<!-- 
ResourceQuotaStatus defines the enforced hard limits and observed use. 
-->
ResourceQuotaStatus 定義硬性限制和觀測到的用量。

<hr>

- **hard** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  <!-- 
  Hard is the set of enforced hard limits for each named resource. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/ 
  -->

  hard 是每種指定資源所強制實施的硬性限制集合。
  更多資訊： https://kubernetes.io/docs/concepts/policy/resource-quotas/

- **used** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  <!-- 
  Used is the current observed total usage of the resource in the namespace. 
  -->

  used 是當前命名空間中所觀察到的資源總用量。

## ResourceQuotaList {#ResourceQuotaList}

<!-- 
ResourceQuotaList is a list of ResourceQuota items. 
-->
ResourceQuotaList 是 ResourceQuota 列表。

<hr>

- **apiVersion**：v1

- **kind**：ResourceQuotaList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!-- 
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds 
  -->

  標準列表元資料。
  更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>)，必需

  <!-- 
  Items is a list of ResourceQuota objects. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/ 
  -->

  items 是 ResourceQuota 對象的列表。
  更多資訊： https://kubernetes.io/docs/concepts/policy/resource-quotas/

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!-- 
### `get` read the specified ResourceQuota 
-->
### `get` 讀取指定的 ResourceQuota

<!-- 
#### HTTP Request 
-->
#### HTTP 請求

GET /api/v1/namespaces/{namespace}/resourcequotas/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceQuota

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** （**路徑參數**）: string, 必需

  ResourceQuota 的名稱。

- **namespace** （**路徑參數**）: string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

401: Unauthorized

<!-- 
### `get` read status of the specified ResourceQuota 
-->
### `get` 讀取指定的 ResourceQuota 的狀態

<!-- 
#### HTTP Request 
-->
#### HTTP 請求

GET /api/v1/namespaces/{namespace}/resourcequotas/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceQuota

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** （**路徑參數**）: string, 必需

  ResourceQuota 的名稱。

- **namespace** （**路徑參數**）: string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

401: Unauthorized

<!-- 
### `list` list or watch objects of kind ResourceQuota 
-->
### `list` 列出或監視 ResourceQuota 類別的對象

<!-- 
#### HTTP Request 
-->
#### HTTP 請求

GET /api/v1/namespaces/{namespace}/resourcequotas

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

- **namespace** （**路徑參數**）: string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuotaList" >}}">ResourceQuotaList</a>): OK

401: Unauthorized

<!-- 
### `list` list or watch objects of kind ResourceQuota 
-->
### `list` 列出或監視 ResourceQuota 類別的對象

<!-- 
#### HTTP Request 
-->
#### HTTP 請求

GET /api/v1/resourcequotas

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

- **allowWatchBookmarks** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuotaList" >}}">ResourceQuotaList</a>): OK

401: Unauthorized

<!-- 
### `create` create a ResourceQuota 
-->
### `create` 創建一個 ResourceQuota

<!-- 
#### HTTP Request 
-->
#### HTTP 請求

POST /api/v1/namespaces/{namespace}/resourcequotas

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>, required

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

- **namespace** （**路徑參數**）: string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>, 必需

- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

202 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Accepted

401: Unauthorized

<!-- 
### `update` replace the specified ResourceQuota 
-->
### `update` 更新指定的 ResourceQuota

<!-- 
#### HTTP Request 
-->
#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/resourcequotas/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceQuota

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>, required

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

- **name** （**路徑參數**）: string, 必需

  ResourceQuota 的名稱。

- **namespace** （**路徑參數**）: string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>, 必需

- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

401: Unauthorized

<!-- 
### `update` replace status of the specified ResourceQuota 
-->
### `update` 更新指定 ResourceQuota 的狀態

<!-- 
#### HTTP Request 
-->
#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/resourcequotas/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceQuota

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>, required

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

- **name** （**路徑參數**）: string, 必需

  ResourceQuota 的名稱。

- **namespace** （**路徑參數**）: string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>, 必需

- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

401: Unauthorized

<!-- 
### `patch` partially update the specified ResourceQuota 
-->
### `patch` 部分更新指定的 ResourceQuota

<!-- 
#### HTTP Request 
-->
#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/resourcequotas/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceQuota

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

- **name** （**路徑參數**）: string, 必需

  ResourceQuota 的名稱。

- **namespace** （**路徑參數**）: string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必需

- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

401: Unauthorized

<!-- 
### `patch` partially update status of the specified ResourceQuota 
-->
### `patch` 部分更新指定 ResourceQuota 的狀態

<!-- 
#### HTTP Request 
-->
#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/resourcequotas/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceQuota

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

- **name** （**路徑參數**）: string, 必需

  ResourceQuota 的名稱。

- **namespace** （**路徑參數**）: string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必需

- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

201 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Created

401: Unauthorized

<!-- 
### `delete` delete a ResourceQuota 
-->
### `delete` 刪除 ResourceQuota

<!-- 
#### HTTP Request 
-->
#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/resourcequotas/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceQuota

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

- **name** （**路徑參數**）: string, 必需

  ResourceQuota 的名稱。

- **namespace** （**路徑參數**）: string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): OK

202 (<a href="{{< ref "../policy-resources/resource-quota-v1#ResourceQuota" >}}">ResourceQuota</a>): Accepted

401: Unauthorized

<!-- 
### `deletecollection` delete collection of ResourceQuota 
-->
### `deletecollection` 刪除 ResourceQuota 的集合

<!-- 
#### HTTP Request 
-->
#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/resourcequotas

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

- **namespace** （**路徑參數**）: string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*查詢參數*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
