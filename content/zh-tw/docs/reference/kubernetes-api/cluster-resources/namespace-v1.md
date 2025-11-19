---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Namespace"
content_type: "api_reference"
description: "Namespace 爲名字提供作用域。"
title: "Namespace"
weight: 7
---

<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Namespace"
content_type: "api_reference"
description: "Namespace provides a scope for Names."
title: "Namespace"
weight: 7
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Namespace {#Namespace}

<!--
Namespace provides a scope for Names. Use of multiple namespaces is optional.
-->
Namespace 爲名字提供作用域。使用多個命名空間是可選的。

<hr>

- **apiVersion**: v1

- **kind**: Namespace

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  
  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/namespace-v1#NamespaceSpec" >}}">NamespaceSpec</a>)

  <!--
  Spec defines the behavior of the Namespace. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->
  
  `spec` 定義了 Namespace 的行爲。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../cluster-resources/namespace-v1#NamespaceStatus" >}}">NamespaceStatus</a>)

  <!--
  Status describes the current status of a Namespace. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->
  
  `status` 描述了當前 Namespace 的狀態。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## NamespaceSpec {#NamespaceSpec}

<!--
NamespaceSpec describes the attributes on a Namespace.
-->
NamespaceSpec 用於描述 Namespace 的屬性。

<hr>

- **finalizers** ([]string)

  <!--
  Finalizers is an opaque list of values that must be empty to permanently remove object from storage. More info: https://kubernetes.io/docs/tasks/administer-cluster/namespaces/
  -->

  `finalizers` 是一個不透明的值列表，只有此列表爲空時才能從存儲中永久刪除對象。
  更多信息： https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/namespaces/

  <!--
  *Atomic: will be replaced during a merge*
  -->

  **原子性：將在合併期間被替換**

## NamespaceStatus {#NamespaceStatus}

<!--
NamespaceStatus is information about the current status of a Namespace.
-->
NamespaceStatus 表示 Namespace 的當前狀態信息。

<hr>

- **conditions** ([]NamespaceCondition)

  <!--
  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*
  
  Represents the latest available observations of a namespace's current state.
  -->
  
  **補丁策略：基於 `type` 健合併**

  **Map：鍵 `type` 的唯一值將在合併期間保留**

  表示命名空間當前狀態的最新可用狀況。

  <a name="NamespaceCondition"></a>
  <!--
  *NamespaceCondition contains details about state of namespace.*

  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.
  -->
  
  **NamespaceCondition 包含命名空間狀態的詳細信息。**

  - **conditions.status** (string)，必需

    狀況（condition）的狀態，取值爲 `True`、`False` 或 `Unknown` 之一。

  <!--
  - **conditions.type** (string), required

    Type of namespace controller condition.
    
  - **conditions.lastTransitionTime** (Time)
  
    Last time the condition transitioned from one status to another.
  -->
  
  - **conditions.type** (string), 必需

    命名空間控制器狀況的類型。
    
  - **conditions.lastTransitionTime** (Time)

    最後一次狀況狀態轉換的時間。

    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->
    
    **`Time` 是對 `time.Time` 的封裝。`Time` 支持對 YAML 和 JSON 進行正確封包。
    爲 `time` 包的許多函數方法提供了封裝器。**

  - **conditions.message** (string)

    <!--
    Human-readable message indicating details about last transition.
    -->

    人類可讀的消息，指示上次轉換的詳細信息。

  - **conditions.reason** (string)

    <!--
    Unique, one-word, CamelCase reason for the condition's last transition.
    -->

    唯一、一個單詞、駝峯命名的 Condition 轉換原因。

- **phase** (string)

  <!--
  Phase is the current lifecycle phase of the namespace. More info: https://kubernetes.io/docs/tasks/administer-cluster/namespaces/

  Possible enum values:
   - `"Active"` means the namespace is available for use in the system
   - `"Terminating"` means the namespace is undergoing graceful termination
  -->
  
  `phase` 是命名空間的當前生命週期階段。更多信息：
  https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/namespaces/

  可能的枚舉值：
   - `"Active"` 表示命名空間在系統中可用
   - `"Terminating"` 表示命名空間正在被體面終止

## NamespaceList {#NamespaceList}

<!--
NamespaceList is a list of Namespaces.
-->
NamespaceList 是一個命名空間列表。

<hr>

- **apiVersion**: v1

- **kind**: NamespaceList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
 
  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->
  
  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **items** ([]<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>), required
-->

- **items** ([]<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)，必需

  <!--
  Items is the list of Namespace objects in the list. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
  -->
  
  `items` 是列表中的 Namespace 對象列表。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/namespaces/

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified Namespace

#### HTTP Request

GET /api/v1/namespaces/{name}

#### Parameters
-->
### `get` 讀取指定的 Namespace

#### HTTP 請求

GET /api/v1/namespaces/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Namespace

- **pretty** (*in query*): string
-->
- **name** (**路徑參數**)：string，必需

  Namespace 的名稱。

- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

401：Unauthorized

<!--
### `get` read status of the specified Namespace

#### HTTP Request

GET /api/v1/namespaces/{name}/status

#### Parameters
-->
### `get` 讀取指定 Namespace 的狀態

#### HTTP 請求

GET /api/v1/namespaces/{name}/status

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Namespace
-->
- **name** (**路徑參數**)：string，必需

  Namespace 的名稱。
<!--
- **pretty** (*in query*): string
-->

- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

401：Unauthorized

<!--
### `list` list or watch objects of kind Namespace

#### HTTP Request

GET /api/v1/namespaces

#### Parameters
-->
### `list` 列出或者檢查類別爲 Namespace 的對象

#### HTTP 請求

GET /api/v1/namespaces

#### 參數

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean
-->
- **resourceVersionMatch** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/namespace-v1#NamespaceList" >}}">NamespaceList</a>)：OK

401：Unauthorized

<!--
### `create` create a Namespace

#### HTTP Request

POST /api/v1/namespaces

#### Parameters
-->
### `create` 創建一個 Namespace

#### HTTP 請求

POST /api/v1/namespaces

#### 參數

<!--
- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>, required
-->
- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*):string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Created

202 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Accepted

401：Unauthorized

<!--
### `update` replace the specified Namespace

#### HTTP Request

PUT /api/v1/namespaces/{name}

#### Parameters
-->
### `update` 替換指定的 Namespace

#### HTTP 請求

PUT /api/v1/namespaces/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Namespace

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>, required
-->
- **name** (**路徑參數**)：string，必需

  Namespace 的名稱

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Created

401：Unauthorized

<!--
### `update` replace finalize of the specified Namespace

#### HTTP Request

PUT /api/v1/namespaces/{name}/finalize

#### Parameters
-->
### `update` 替換指定 Namespace 的終結器

#### HTTP 請求

PUT /api/v1/namespaces/{name}/finalize

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Namespace

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>, required
-->
- **name** (**路徑參數**)：string，必需

  Namespace 的名稱

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Created

401：Unauthorized

<!--
### `update` replace status of the specified Namespace

#### HTTP Request

PUT /api/v1/namespaces/{name}/status

#### Parameters
-->
### `update` 替換指定 Namespace 的狀態

#### HTTP 請求

PUT /api/v1/namespaces/{name}/status

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Namespace

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>, required
-->
- **name** (**路徑闡述**)：string，必需

  Namespace 的名稱

- **body**: <a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Created

401: Unauthorized

<!--
### `patch` partially update the specified Namespace

#### HTTP Request

PATCH /api/v1/namespaces/{name}

#### Parameters
-->
### `patch` 部分更新指定的 Namespace

#### HTTP 請求

PATCH /api/v1/namespaces/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Namespace
-->
- **name** (**路徑參數**)：string，必需

  Namespace 的名稱

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需
  
<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean
-->
- **force** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Created

401: Unauthorized

<!--
### `patch` partially update status of the specified Namespace

#### HTTP Request

PATCH /api/v1/namespaces/{name}/status

#### Parameters
-->
### `patch` 部分更新指定 Namespace 的狀態

#### HTTP 請求

PATCH /api/v1/namespaces/{name}/status

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Namespace
-->
- **name** (**路徑參數**)：string，必需

  Namespace 的名稱

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean
-->
- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：OK

201 (<a href="{{< ref "../cluster-resources/namespace-v1#Namespace" >}}">Namespace</a>)：Created

401：Unauthorized

<!--
### `delete` delete a Namespace

#### HTTP Request

DELETE /api/v1/namespaces/{name}

#### Parameters
-->
### `delete` 刪除一個 Namespace

#### HTTP 請求

DELETE /api/v1/namespaces/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Namespace
-->
- **name** (**路徑參數**)：string，必需

  Namespace 的名稱

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** (*查詢參數*)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*查詢參數*)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>)：OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>)：Accepted

401：Unauthorized
