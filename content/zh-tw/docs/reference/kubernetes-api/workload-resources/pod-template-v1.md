---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PodTemplate"
content_type: "api_reference"
description: "PodTemplate 描述一種模板，用來爲預定義的 Pod 生成副本。"
title: "PodTemplate"
weight: 3
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PodTemplate"
content_type: "api_reference"
description: "PodTemplate describes a template for creating copies of a predefined pod."
title: "PodTemplate"
weight: 3
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## PodTemplate {#PodTemplate}

<!--
PodTemplate describes a template for creating copies of a predefined pod.
-->
PodTemplate 描述一種模板，用來爲預定義的 Pod 生成副本。

<hr>

- **apiVersion**: v1

- **kind**: PodTemplate

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)

  <!--
  Template defines the pods that will be created from this pod template. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->
  template 定義將基於此 Pod 模板所創建的 Pod。
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## PodTemplateSpec {#PodTemplateSpec}

<!--
PodTemplateSpec describes the data a pod should have when created from a template
-->
PodTemplateSpec 描述基於某模板所創建的 Pod 所應具有的數據。

<hr>

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/pod-v1#PodSpec" >}}">PodSpec</a>)

  <!--
  Specification of the desired behavior of the pod. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->
  Pod 預期行爲的規約。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## PodTemplateList {#PodTemplateList}

<!--
PodTemplateList is a list of PodTemplates.
-->
PodTemplateList 是 PodTemplate 對象的列表。

<hr>

- **apiVersion**: v1

- **kind**: PodTemplateList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->
  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **items** ([]<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>), required
-->
- **items** ([]<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>)，必需

  <!--
  List of pod templates
  -->
  PodTemplate 對象列表。

<!--
## Operations {#Operations}

<hr>
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified PodTemplate

#### HTTP Request
-->
### `get` 讀取指定的 PodTemplate

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/podtemplates/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PodTemplate
-->
- **name** （**路徑參數**）：string，必需

  PodTemplate 的名稱。

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PodTemplate

#### HTTP Request
-->
### `list` 列出或監視 PodTemplate 類型的對象

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/podtemplates

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** （**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** （**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** （**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** （**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateList" >}}">PodTemplateList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PodTemplate

#### HTTP Request
-->
### `list` 列出或監視 PodTemplate 類型的對象

#### HTTP 請求

GET /api/v1/podtemplates

<!--
#### Parameters
-->
#### 參數

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** （**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** （**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
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
-->
- **timeoutSeconds** （**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** （**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateList" >}}">PodTemplateList</a>): OK

401: Unauthorized

<!--
### `create` create a PodTemplate

#### HTTP Request
-->
### `create` 創建一個 PodTemplate

#### HTTP 請求

POST /api/v1/namespaces/{namespace}/podtemplates

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified PodTemplate

#### HTTP Request
-->
### `update` 替換指定的 PodTemplate

#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/podtemplates/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PodTemplate
-->
- **name** （**路徑參數**）：string，必需

  PodTemplate 的名稱。

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified PodTemplate

#### HTTP Request
-->
### `patch` 部分更新指定的 PodTemplate

#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/podtemplates/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PodTemplate
-->
- **name** （**路徑參數**）：string，必需

  PodTemplate 的名稱。

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean
-->
- **force** （**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Created

401: Unauthorized

<!--
### `delete` delete a PodTemplate

#### HTTP Request
-->
### `delete` 刪除一個 PodTemplate

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/podtemplates/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PodTemplate
-->
- **name** （**路徑參數**）：string，必需

  PodTemplate 的名稱。

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
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
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): OK

202 (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplate" >}}">PodTemplate</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of PodTemplate

#### HTTP Request
-->
### `deletecollection` 刪除 PodTemplate 的集合

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/podtemplates

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** （**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string
-->
- **continue** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
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
-->
- **labelSelector** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** （**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
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
-->
- **timeoutSeconds** （**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
