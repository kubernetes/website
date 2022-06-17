---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SelfSubjectAccessReview"
content_type: "api_reference"
description: "SelfSubjectAccessReview 檢查當前使用者是否可以執行某操作。"
title: "SelfSubjectAccessReview"
weight: 2
---
<!--
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SelfSubjectAccessReview"
content_type: "api_reference"
description: "SelfSubjectAccessReview checks whether or the current user can perform an action."
title: "SelfSubjectAccessReview"
weight: 2
-->
`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## SelfSubjectAccessReview {#SelfSubjectAccessReview}
<!--
SelfSubjectAccessReview checks whether or the current user can perform an action.  Not filling in a spec.namespace means "in all namespaces".  Self is a special case, because users should always be able to check whether they can perform an action
-->
SelfSubjectAccessReview 檢查當前使用者是否可以執行某操作。
不填寫 spec.namespace 表示 “在所有名稱空間中”。
Self 是一個特殊情況，因為使用者應始終能夠檢查自己是否可以執行某操作。

<hr>

- **apiVersion**: authorization.k8s.io/v1

- **kind**: SelfSubjectAccessReview

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
- **spec** (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReviewSpec" >}}">SelfSubjectAccessReviewSpec</a>), required
  Spec holds information about the request being evaluated.  user and groups must be empty
  Status is filled in by the server and indicates whether the request is allowed or not
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的列表元資料。
  更多資訊：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReviewSpec" >}}">SelfSubjectAccessReviewSpec</a>)，必需
  
  spec 包含有關正在評估的請求的資訊。
  user 和 group 必須為空。

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)

  status 由伺服器填寫，表示請求是否被允許。

## SelfSubjectAccessReviewSpec {#SelfSubjectAccessReviewSpec}
<!--
SelfSubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set
-->
SelfSubjectAccessReviewSpec 是訪問請求的描述。
resourceAuthorizationAttributes 和 nonResourceAuthorizationAttributes 二者必須設定其一，並且只能設定其一。

<hr>
<!--
- **nonResourceAttributes** (NonResourceAttributes)
  NonResourceAttributes describes information for a non-resource access request
  <a name="NonResourceAttributes"></a>
  *NonResourceAttributes includes the authorization attributes available for non-resource requests to the Authorizer interface*
  - **nonResourceAttributes.path** (string)
    Path is the URL path of the request
  - **nonResourceAttributes.verb** (string)
    Verb is the standard HTTP verb
-->

- **nonResourceAttributes** (NonResourceAttributes)
  
  nonResourceAttributes 描述非資源訪問請求的資訊。
  
  <a name="NonResourceAttributes"></a>
  **nonResourceAttributes 包括提供給 Authorizer 介面進行非資源請求鑑權時所用的屬性。**
  
  - **nonResourceAttributes.path** (string)
    
    path 是請求的 URL 路徑。
  
  - **nonResourceAttributes.verb** (string)
    
    verb 是標準的 HTTP 動作。
<!--
- **resourceAttributes** (ResourceAttributes)
  ResourceAuthorizationAttributes describes information for a resource access request

  <a name="ResourceAttributes"></a>
  *ResourceAttributes includes the authorization attributes available for resource requests to the Authorizer interface*

  - **resourceAttributes.group** (string)
    Group is the API Group of the Resource.  "*" means all.

  - **resourceAttributes.name** (string)
    Name is the name of the resource being requested for a "get" or deleted for a "delete". "" (empty) means all.
-->
- **resourceAttributes** (ResourceAttributes)
  
  resourceAuthorizationAttributes 描述資源訪問請求的資訊。
  
  <a name="ResourceAttributes"></a>
  **resourceAttributes 包括提供給 Authorizer 介面進行資源請求鑑權時所用的屬性。**
  
  - **resourceAttributes.group** (string)
    
    group 是資源的 API 組。
    "*" 表示所有組。
  
  - **resourceAttributes.name** (string)
    
    name 是 "get" 正在請求或 "delete" 已刪除的資源的名稱。
    ""（空字串）表示所有資源。
<!--
  - **resourceAttributes.namespace** (string)
    Namespace is the namespace of the action being requested.  Currently, there is no distinction between no namespace and all namespaces "" (empty) is defaulted for LocalSubjectAccessReviews "" (empty) is empty for cluster-scoped resources "" (empty) means "all" for namespace scoped resources from a SubjectAccessReview or SelfSubjectAccessReview

  - **resourceAttributes.resource** (string)
    Resource is one of the existing resource types.  "*" means all.
-->  
  - **resourceAttributes.namespace** (string)
    
    namespace 是正在請求的操作的名稱空間。
    目前，無名稱空間和所有名稱空間之間沒有區別。
    對於 LocalSubjectAccessReviews，預設為 ""（空字串）。
    對於叢集範圍的資源，預設為 ""（空字串）。
    對於來自 SubjectAccessReview 或 SelfSubjectAccessReview 的名稱空間範圍的資源，""（空字串）表示 "all"（所有資源）。
  
  - **resourceAttributes.resource** (string)
    
    resource 是現有的資源類別之一。
    "*" 表示所有資源類別。
<!--
  - **resourceAttributes.subresource** (string)
    Subresource is one of the existing resource types.  "" means none.

  - **resourceAttributes.verb** (string)
    Verb is a kubernetes resource API verb, like: get, list, watch, create, update, delete, proxy.  "*" means all.

  - **resourceAttributes.version** (string)
    Version is the API Version of the Resource.  "*" means all.
-->  
  - **resourceAttributes.subresource** (string)
    
    subresource 是現有的資源型別之一。
    "" 表示無。

  - **resourceAttributes.verb** (string)
    
    verb 是 kubernetes 資源 API 動作，例如 get、list、watch、create、update、delete、proxy。
    "*" 表示所有動作。
  
  - **resourceAttributes.version** (string)
    
    version 是資源的 API 版本。
    "*" 表示所有版本。
<!--
## Operations {#Operations}

<hr>

### `create` create a SelfSubjectAccessReview

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `create` 建立 SelfSubjectAccessReview

#### HTTP 請求

POST /apis/authorization.k8s.io/v1/selfsubjectaccessreviews
<!--
#### Parameters

- **body**: <a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>, required

- **dryRun** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 引數

- **body**: <a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>): Accepted

401: Unauthorized
