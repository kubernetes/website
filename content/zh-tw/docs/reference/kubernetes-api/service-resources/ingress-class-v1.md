---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "IngressClass"
content_type: "api_reference"
description: "IngressClass 代表 Ingress 的類，被 Ingress 的規約引用。"
title: "IngressClass"
weight: 5
---

<!--
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "IngressClass"
content_type: "api_reference"
description: "IngressClass represents the class of the Ingress, referenced by the Ingress Spec."
title: "IngressClass"
weight: 5
auto_generated: true
-->

`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`

<!--
## IngressClass {#IngressClass}

IngressClass represents the class of the Ingress, referenced by the Ingress Spec. The `ingressclass.kubernetes.io/is-default-class` annotation can be used to indicate that an IngressClass should be considered default. When a single IngressClass resource has this annotation set to true, new Ingress resources without a class specified will be assigned this default class.
-->
## IngressClass {#IngressClass}

IngressClass 代表 Ingress 的類，被 Ingress 的規約引用。
`ingressclass.kubernetes.io/is-default-class`
註解可以用來標明一個 IngressClass 應該被視爲預設的 Ingress 類。
當某個 IngressClass 資源將此註解設置爲 true 時，
沒有指定類的新 Ingress 資源將被分配到此預設類。

<hr>

- **apiVersion**: networking.k8s.io/v1

- **kind**: IngressClass

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的列表元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClassSpec" >}}">IngressClassSpec</a>)

  <!--
  Spec is the desired state of the IngressClass. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->
  spec 是 IngressClass 的期望狀態。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## IngressClassSpec {#IngressClassSpec}

<!--
IngressClassSpec provides information about the class of an Ingress.
-->
IngressClassSpec 提供有關 Ingress 類的資訊。

<hr>

- **controller** (string)

  <!--
  controller refers to the name of the controller that should handle this class. This allows for different "flavors" that are controlled by the same controller. For example, you may have different Parameters for the same implementing controller. This should be specified as a domain-prefixed path no more than 250 characters in length, e.g. "acme.io/ingress-controller". This field is immutable.
  -->
  
  controller 是指應該處理此類的控制器名稱。
  這允許由同一控制器控制不同“口味”。例如，對於同一個實現的控制器你可能有不同的參數。
  此字段應該指定爲長度不超過 250 個字符的域前綴路徑，例如 “acme.io/ingress-controller”。
  該字段是不可變的。

- **parameters** (IngressClassParametersReference)

  <!--
  parameters is a link to a custom resource containing additional configuration for the controller. This is optional if the controller does not require extra parameters.
  -->
  
  parameters 是指向控制器中包含額外設定的自定義資源的鏈接。
  如果控制器不需要額外的屬性，這是可選的。

  <a name="IngressClassParametersReference"></a>
  <!--
  *IngressClassParametersReference identifies an API object. This can be used to specify a cluster or namespace-scoped resource.*
  -->
  **IngressClassParametersReference 標識一個 API 對象。這可以用來指定一個叢集或者命名空間範圍的資源**

  <!--
  - **parameters.kind** (string), required

    kind is the type of resource being referenced.
  -->

  - **parameters.kind** (string)，必需
    
    kind 是被引用資源的類型。

  <!--
  - **parameters.name** (string), required

    name is the name of resource being referenced.
  -->

  - **parameters.name** (string)，必需

    name 是被引用資源的名稱。

  - **parameters.apiGroup** (string)
    <!--
    apiGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.
    -->

    apiGroup 是被引用資源的組。
    如果未指定 apiGroup，則被指定的 kind 必須在覈心 API 組中。
    對於任何其他第三方類型，apiGroup 是必需的。

  - **parameters.namespace** (string)
    <!--
    namespace is the namespace of the resource being referenced. This field is required when scope is set to "Namespace" and must be unset when scope is set to "Cluster".
    -->

    namespace 是被引用資源的命名空間。
    當範圍被設置爲 “namespace” 時，此字段是必需的；
    當範圍被設置爲 “Cluster” 時，此字段必須不設置。

  - **parameters.scope** (string)
    <!--
    scope represents if this refers to a cluster or namespace scoped resource. This may be set to "Cluster" (default) or "Namespace".
    -->

    scope 表示是否引用叢集或者命名空間範圍的資源。
    這可以設置爲“叢集”（預設）或者“命名空間”。

## IngressClassList {#IngressClassList}

<!--
IngressClassList is a collection of IngressClasses.
-->
IngressClassList 是 IngressClasses 的集合。

<hr>

- **apiVersion**: networking.k8s.io/v1

- **kind**: IngressClassList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata.
  -->
  標準的列表元資料。

<!--
- **items** ([]<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>), required

  items is the list of IngressClasses.
-->
- **items** ([]<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>)，必需

  items 是 IngressClasses 的列表。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified IngressClass

#### HTTP Request
-->
### `get` 讀取指定的 IngressClass

#### HTTP 請求

GET /apis/networking.k8s.io/v1/ingressclasses/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the IngressClass
-->
- **name** （**路徑參數**）：string，必需

  IngressClass 的名稱

<!--
- **pretty** (*in query*): string
-->
- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind IngressClass
#### HTTP Request
-->
### `list` 列出或監視 IngressClass 類型的對象

#### HTTP 請求

GET /apis/networking.k8s.io/v1/ingressclasses

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

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClassList" >}}">IngressClassList</a>): OK

401: Unauthorized

<!--
### `create` create an IngressClass

#### HTTP Request
-->
### `create` 創建一個 IngressClass

#### HTTP 請求

POST /apis/networking.k8s.io/v1/ingressclasses

<!--
#### Parameters
-->
#### 參數

<!--
- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>, required
-->
- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>，必需

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

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

202 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified IngressClass

#### HTTP Request
-->
### `update` 替換指定的 IngressClass

#### HTTP 請求

PUT /apis/networking.k8s.io/v1/ingressclasses/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the IngressClass
-->
- **name** （**路徑參數**）：string，必需

  IngressClass 的名稱

<!--
- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>, required
-->
- **body**: <a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>，必需

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

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified IngressClass

#### HTTP Request
-->
### `patch` 部分更新指定的 IngressClass

#### HTTP 請求

PATCH /apis/networking.k8s.io/v1/ingressclasses/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the IngressClass
-->
- **name** （**路徑參數**）：string，必需

  IngressClass 的名稱

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

200 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-class-v1#IngressClass" >}}">IngressClass</a>): Created

401: Unauthorized

<!--
### `delete` delete an IngressClass

#### HTTP Request
-->
### `delete` 刪除一個 IngressClass

#### HTTP 請求

DELETE /apis/networking.k8s.io/v1/ingressclasses/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the IngressClass
-->
- **name** （**路徑參數**）：string，必需

  IngressClass 的名稱

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** （**查詢字符串**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）：boolean

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of IngressClass

#### HTTP Request
-->
### `deletecollection` 刪除 IngressClass 的集合

DELETE /apis/networking.k8s.io/v1/ingressclasses

<!--
#### Parameters
-->
#### 參數

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
- **gracePeriodSeconds** （**查詢字符串**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）：boolean

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
