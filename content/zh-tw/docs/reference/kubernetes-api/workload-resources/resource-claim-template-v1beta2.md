---
api_metadata:
  apiVersion: "resource.k8s.io/v1beta2"
  import: "k8s.io/api/resource/v1beta2"
  kind: "ResourceClaimTemplate"
content_type: "api_reference"
description: "ResourceClaimTemplate 用於生成 ResourceClaim 對象。"
title: "ResourceClaimTemplate v1beta2"
weight: 17
---
<!--
api_metadata:
  apiVersion: "resource.k8s.io/v1beta2"
  import: "k8s.io/api/resource/v1beta2"
  kind: "ResourceClaimTemplate"
content_type: "api_reference"
description: "ResourceClaimTemplate is used to produce ResourceClaim objects."
title: "ResourceClaimTemplate v1beta2"
weight: 17
auto_generated: true
-->

`apiVersion: resource.k8s.io/v1beta2`

`import "k8s.io/api/resource/v1beta2"`

## ResourceClaimTemplate {#ResourceClaimTemplate}

<!--
ResourceClaimTemplate is used to produce ResourceClaim objects.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.
-->
ResourceClaimTemplate 用於生成 ResourceClaim 對象。

這是一個 Alpha 類型的特性，需要啓用 DynamicResourceAllocation 特性門控。

<hr>

- **apiVersion**: resource.k8s.io/v1beta2

- **kind**: ResourceClaimTemplate

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object metadata
  -->
  標準的對象元資料。

<!--
- **spec** (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplateSpec" >}}">ResourceClaimTemplateSpec</a>), required

  Describes the ResourceClaim that is to be generated.
  
  This field is immutable. A ResourceClaim will get created by the control plane for a Pod when needed and then not get updated anymore.
-->
- **spec** (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplateSpec" >}}">ResourceClaimTemplateSpec</a>)，必需

  描述要生成的 ResourceClaim。

  該字段是不可變的。當需要時，控制平面將爲 Pod 創建一個 ResourceClaim，然後不再對其進行更新。

## ResourceClaimTemplateSpec {#ResourceClaimTemplateSpec}

<!--
ResourceClaimTemplateSpec contains the metadata and fields for a ResourceClaim.
-->
ResourceClaimTemplateSpec 包含針對 ResourceClaim 的元資料和字段。

<hr>

<!--
- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimSpec" >}}">ResourceClaimSpec</a>), required

  Spec for the ResourceClaim. The entire content is copied unchanged into the ResourceClaim that gets created from this template. The same fields as in a ResourceClaim are also valid here.
-->
- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1beta2#ResourceClaimSpec" >}}">ResourceClaimSpec</a>)，必需

  ResourceClaim 的規約。整個內容將不加修改地複製到從模板創建的 ResourceClaim 中。
  與 ResourceClaim 中相同的字段在此處也是有效的。

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  ObjectMeta may contain labels and annotations that will be copied into the PVC when creating it. No other fields are allowed and will be rejected during validation.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  ObjectMeta 可以包含創建 PVC 時將要複製到其中的標籤和註解。
  不允許設置其他字段，並且即便設置了也會在驗證期間被拒絕。

## ResourceClaimTemplateList {#ResourceClaimTemplateList}

<!--
ResourceClaimTemplateList is a collection of claim templates.
-->
ResourceClaimTemplateList 是申領模板的集合。

<hr>

- **apiVersion**: resource.k8s.io/v1beta2

- **kind**: ResourceClaimTemplateList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata
  -->
  標準的列表元資料。

<!--
- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>), required

  Items is the list of resource claim templates.
-->
- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>)，必需

  items 是資源申領模板的列表。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified ResourceClaimTemplate

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 ResourceClaimTemplate

#### HTTP 請求

GET /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaimtemplates/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceClaimTemplate

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ResourceClaimTemplate 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ResourceClaimTemplate

#### HTTP Request
-->
### `list` 列舉或監視 ResourceClaimTemplate 類別的對象

#### HTTP 請求

GET /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaimtemplates

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

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplateList" >}}">ResourceClaimTemplateList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ResourceClaimTemplate

#### HTTP Request
-->
### `list` 列舉或監視 ResourceClaimTemplate 類別的對象

#### HTTP 請求

GET /apis/resource.k8s.io/v1beta2/resourceclaimtemplates

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

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplateList" >}}">ResourceClaimTemplateList</a>): OK

401: Unauthorized

<!--
### `create` create a ResourceClaimTemplate

#### HTTP Request
-->
### `create` 創建 ResourceClaimTemplate

#### HTTP 請求

POST /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaimtemplates

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>, required

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

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>，必需

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

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ResourceClaimTemplate

#### HTTP Request
-->
### `update` 替換指定的 ResourceClaimTemplate

#### HTTP 請求

PUT /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaimtemplates/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceClaimTemplate

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>, required

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

  ResourceClaimTemplate 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>，必需

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

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ResourceClaimTemplate

#### HTTP Request
-->
### `patch` 部分更新指定的 ResourceClaimTemplate

#### HTTP 請求

PATCH /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaimtemplates/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceClaimTemplate

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

- **name** (**路徑參數**): string，必需

  ResourceClaimTemplate 的名稱。

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

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Created

401: Unauthorized

<!--
### `delete` delete a ResourceClaimTemplate

#### HTTP Request
-->
### `delete` 刪除 ResourceClaimTemplate

#### HTTP 請求

DELETE /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaimtemplates/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceClaimTemplate

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

- **name** (**路徑參數**): string，必需

  ResourceClaimTemplate 的名稱。

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

200 (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-claim-template-v1beta2#ResourceClaimTemplate" >}}">ResourceClaimTemplate</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ResourceClaimTemplate

#### HTTP Request
-->
### `deletecollection` 刪除 ResourceClaimTemplate 的集合

#### HTTP 請求

DELETE /apis/resource.k8s.io/v1beta2/namespaces/{namespace}/resourceclaimtemplates

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
