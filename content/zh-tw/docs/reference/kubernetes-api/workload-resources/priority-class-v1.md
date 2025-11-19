---
api_metadata:
  apiVersion: "scheduling.k8s.io/v1"
  import: "k8s.io/api/scheduling/v1"
  kind: "PriorityClass"
content_type: "api_reference"
description: "PriorityClass 定義了從優先級類名到優先級數值的映射。"
title: "PriorityClass"
weight: 14
auto_generated: false
---
<!--
api_metadata:
  apiVersion: "scheduling.k8s.io/v1"
  import: "k8s.io/api/scheduling/v1"
  kind: "PriorityClass"
content_type: "api_reference"
description: "PriorityClass defines mapping from a priority class name to the priority integer value."
title: "PriorityClass"
weight: 14
auto_generated: true
-->

`apiVersion: scheduling.k8s.io/v1`

`import "k8s.io/api/scheduling/v1"`

## PriorityClass {#PriorityClass}

<!-- 
PriorityClass defines mapping from a priority class name to the priority integer value. The value can be any valid integer.
-->
PriorityClass 定義了從優先級類名到優先級數值的映射。
該值可以是任何有效的整數。

<hr>

- **apiVersion**: scheduling.k8s.io/v1

- **kind**: PriorityClass

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準對象的元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **value** (int32), required

  value represents the integer value of this priority class. This is the actual priority that pods receive when they have the name of this class in their pod spec.
-->
- **value** （int32），必需

  value 表示此優先級的整數值。這是 Pod 在其 Pod 規約中有此類名稱時收到的實際優先級。

<!--
- **description** (string)

  description is an arbitrary string that usually provides guidelines on when this priority class should be used.
-->
- **description** (string)

  description 是一個任意字符串，通常提供有關何時應使用此優先級的指南。

<!--
- **globalDefault** (boolean)

  globalDefault specifies whether this PriorityClass should be considered as the default priority for pods that do not have any priority class. Only one PriorityClass can be marked as `globalDefault`. However, if more than one PriorityClasses exists with their `globalDefault` field set to true, the smallest value of such global default PriorityClasses will be used as the default priority.
-->
- **globalDefault** (boolean)

  globalDefault 指定是否應將此 PriorityClass 視爲沒有任何優先級類的 Pod 的默認優先級。
  只有一個 PriorityClass 可以標記爲 `globalDefault`。
  但是，如果存在多個 PriorityClasses 且其 `globalDefault` 字段設置爲 true，
  則將使用此類全局默認 PriorityClasses 的最小值作爲默認優先級。
  
<!--
- **preemptionPolicy** (string)

  preemptionPolicy is the Policy for preempting pods with lower priority. One of Never, PreemptLowerPriority. Defaults to PreemptLowerPriority if unset.
-->  
- **preemptionPolicy** (string)

  PreemptionPolicy 是搶佔優先級較低的 Pod 的策略。
  可選值：Never、PreemptLowerPriority。
  如果未設置，則默認爲 PreemptLowerPriority。

<!--
## PriorityClassList {#PriorityClassList}

PriorityClassList is a collection of priority classes.
-->
## PriorityClassList {#PriorityClassList}

PriorityClassList 是優先級類的集合。

<hr>

- **apiVersion**: scheduling.k8s.io/v1

- **kind**: PriorityClassList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **items** ([]<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>), required

  items is the list of PriorityClasses
-->
- **items** ([]<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>)，必需

  items 是 PriorityClasses 的列表。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!-- 
### `get` read the specified PriorityClass 
-->
### `get` 讀取特定的 PriorityClass

<!-- 
#### HTTP Request

GET /apis/scheduling.k8s.io/v1/priorityclasses/{name}
-->
#### HTTP 請求

GET /apis/scheduling.k8s.io/v1/priorityclasses/{name}

<!-- 
#### Parameters 
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PriorityClass
-->
- **name** （**路徑參數**）: string，必需

  PriorityClass 的名稱。

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): OK

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): OK

401: Unauthorized

<!-- 
### `list` list or watch objects of kind PriorityClass
 -->
### `list` 列出或觀察 PriorityClass類的對象

<!-- 
#### HTTP Request

GET /apis/scheduling.k8s.io/v1/priorityclasses
-->
#### HTTP 請求

GET /apis/scheduling.k8s.io/v1/priorityclasses

<!-- 
#### Parameters 
-->
#### 參數

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** （**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** （**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** （**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** （**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClassList" >}}">PriorityClassList</a>): OK

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClassList" >}}">PriorityClassList</a>): OK

401: Unauthorized

<!-- 
### `create` create a PriorityClass 
-->
### `create` 創建一個 PriorityClass

<!--
#### HTTP Request

POST /apis/scheduling.k8s.io/v1/priorityclasses
-->
#### HTTP 請求

POST /apis/scheduling.k8s.io/v1/priorityclasses

<!-- 
#### Parameters 
-->
#### 參數

<!--
- **body**: <a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>，必需
  
<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): OK

201 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): Created

202 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): Accepted

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): OK

201 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): Created

202 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): Accepted

401: Unauthorized

<!-- 
### `update` replace the specified PriorityClass
-->
### `update` 替換指定的 PriorityClass

<!--
#### HTTP Request

PUT /apis/scheduling.k8s.io/v1/priorityclasses/{name}
-->
#### HTTP 請求

PUT /apis/scheduling.k8s.io/v1/priorityclasses/{name}

<!--  
#### Parameters 
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PriorityClass
-->
- **name** （**路徑參數**）: string，必需

  PriorityClass 的名稱。

<!--
- **body**: <a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>，必需
 
<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): OK

201 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): OK

201 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): Created

401: Unauthorized


<!-- 
### `patch` partially update the specified PriorityClass  
-->
### `patch` 部分更新特定的 PriorityClass

<!--
#### HTTP Request

PATCH /apis/scheduling.k8s.io/v1/priorityclasses/{name}
-->
#### HTTP 請求

PATCH /apis/scheduling.k8s.io/v1/priorityclasses/{name}

<!-- 
#### Parameters 
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PriorityClass
-->
- **name** （**路徑參數**）: string，必需

  PriorityClass 的名稱。

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **force** （**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): OK

201 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): OK

201 (<a href="{{< ref "../workload-resources/priority-class-v1#PriorityClass" >}}">PriorityClass</a>): Created

401: Unauthorized

<!-- 
### `delete` delete a PriorityClass 
-->
### `delete` 刪除一個 PriorityClass

<!--
#### HTTP Request

DELETE /apis/scheduling.k8s.io/v1/priorityclasses/{name}
-->
#### HTTP 請求

DELETE /apis/scheduling.k8s.io/v1/priorityclasses/{name}

<!-- #### 
Parameters 
--->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PriorityClass
-->
- **name** （**路徑參數**）: string，必需

  PriorityClass 名稱。

<!--
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** （**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!-- 
### `deletecollection` delete collection of PriorityClass 
-->
### `deletecollection` 刪除 PriorityClass 集合

<!--
#### HTTP Request

DELETE /apis/scheduling.k8s.io/v1/priorityclasses
-->
#### HTTP 請求

DELETE /apis/scheduling.k8s.io/v1/priorityclasses

<!-- 
#### Parameters 
-->
#### 參數

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** （**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** （**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** （**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
