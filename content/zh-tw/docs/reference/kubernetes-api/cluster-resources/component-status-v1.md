---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ComponentStatus"
content_type: "api_reference"
description: "ComponentStatus（和 ComponentStatusList）保存叢集檢驗資訊。"
title: "ComponentStatus"
weight: 2
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ComponentStatus"
content_type: "api_reference"
description: "ComponentStatus (and ComponentStatusList) holds the cluster validation info."
title: "ComponentStatus"
weight: 2
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## ComponentStatus {#ComponentStatus}
<!--
ComponentStatus (and ComponentStatusList) holds the cluster validation info. Deprecated: This API is deprecated in v1.19+
-->
ComponentStatus（和 ComponentStatusList）保存叢集檢驗資訊。
已廢棄：該 API 在 v1.19 及更高版本中廢棄。

<hr>

- **apiVersion**: v1

- **kind**: ComponentStatus

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的對象元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **conditions** ([]ComponentCondition)

  <!--
  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  List of component conditions observed

  <a name="ComponentCondition"></a>
  *Information about the condition of a component.*

  - **conditions.status** (string), required

    Status of the condition for a component. Valid values for "Healthy": "True", "False", or "Unknown".
  -->
  **補丁策略：基於鍵 `type` 合併**

  **Map：合併期間根據鍵 type 保留其唯一值**
  
  觀測到的組件狀況的列表。

  <a name="ComponentCondition"></a>
  **組件狀況相關資訊。**

  - **conditions.status** (string)，必需

    組件狀況的狀態。“Healthy” 的有效值爲：“True”、“False” 或 “Unknown”。

  <!--
  - **conditions.type** (string), required
    Type of condition for a component. Valid value: "Healthy"

  - **conditions.error** (string)
    Condition error code for a component. For example, a health check error code.

  - **conditions.message** (string)
    Message about the condition for a component. For example, information about a health check.
  -->
  - **conditions.type** (string)，必需

    組件狀況的類型。有效值：“Healthy”

  - **conditions.error** (string)

    組件狀況的錯誤碼。例如，一個健康檢查錯誤碼。

  - **conditions.message** (string)

    組件狀況相關消息。例如，有關健康檢查的資訊。

## ComponentStatusList {#ComponentStatusList}

<!--
Status of all the conditions for the component as a list of ComponentStatus objects. Deprecated: This API is deprecated in v1.19+
-->
作爲 ComponentStatus 對象列表，所有組件狀況的狀態。
已廢棄：該 API 在 v1.19 及更高版本中廢棄。

<hr>

- **apiVersion**: v1

- **kind**: ComponentStatusList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatus" >}}">ComponentStatus</a>), required
  List of ComponentStatus objects.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的對象元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatus" >}}">ComponentStatus</a>)，必需

  ComponentStatus 對象的列表。

<!--
## Operations {#Operations}
<hr>
### `get` read the specified ComponentStatus
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 ComponentStatus

#### HTTP 請求

GET /api/v1/componentstatuses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ComponentStatus

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name**（**路徑參數**）：string，必需

  ComponentStatus 的名稱。

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatus" >}}">ComponentStatus</a>): OK

401: Unauthorized

<!--
### `list` list objects of kind ComponentStatus
#### HTTP Request
-->
### `list` 列出 ComponentStatus 類別的對象

#### HTTP 請求

GET /api/v1/componentstatuses

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
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
#### 參數

- **allowWatchBookmarks**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/component-status-v1#ComponentStatusList" >}}">ComponentStatusList</a>): OK

401: Unauthorized
