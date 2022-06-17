---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectAccessReview"
content_type: "api_reference"
description: "SubjectAccessReview 檢查使用者或組是否可以執行某操作。"
title: "SubjectAccessReview"
weight: 4
---
<!--
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectAccessReview"
content_type: "api_reference"
description: "SubjectAccessReview checks whether or not a user or group can perform an action."
title: "SubjectAccessReview"
weight: 4
-->

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## SubjectAccessReview {#SubjectAccessReview}
<!--
SubjectAccessReview checks whether or not a user or group can perform an action.
-->
SubjectAccessReview 檢查使用者或組是否可以執行某操作。

<hr>

- **apiVersion**: authorization.k8s.io/v1

- **kind**: SubjectAccessReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
<!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>), required
  Spec holds information about the request being evaluated
- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)
  Status is filled in by the server and indicates whether the request is allowed or not
-->  
  標準的列表元資料。
  更多資訊：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>)，必需
  
  spec 包含有關正在評估的請求的資訊。

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)
  
  status 由伺服器填寫，表示請求是否被允許。

## SubjectAccessReviewSpec {#SubjectAccessReviewSpec}
<!--
SubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set
-->
SubjectAccessReviewSpec 是訪問請求的描述。
resourceAuthorizationAttributes 和 nonResourceAuthorizationAttributes 二者必須設定其一，並且只能設定其一。

<hr>

<!--
- **extra** (map[string][]string)
  Extra corresponds to the user.Info.GetExtra() method from the authenticator.  Since that is input to the authorizer it needs a reflection here.
- **groups** ([]string)
  Groups is the groups you're testing for.
-->
- **extra** (map[string][]string)
  
  extra 對應於來自鑑權器的 user.Info.GetExtra() 方法。
  由於這是針對 Authorizer 的輸入，所以它需要在此處反映。

- **groups** ([]string)
  
  groups 是你正在測試的組。
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
    "*" 表示所有資源。
  
  - **resourceAttributes.name** (string)
    
    name 是 "get" 正在請求或 "delete" 已刪除的資源。
    ""（空字串）表示所有資源。
<!--
  - **resourceAttributes.namespace** (string)
    Namespace is the namespace of the action being requested.  Currently, there is no distinction between no namespace and all namespaces "" (empty) is defaulted for LocalSubjectAccessReviews "" (empty) is empty for cluster-scoped resources "" (empty) means "all" for namespace scoped resources from a SubjectAccessReview or SelfSubjectAccessReview

  - **resourceAttributes.resource** (string)
    Resource is one of the existing resource types.  "*" means all.

  - **resourceAttributes.subresource** (string)
    Subresource is one of the existing resource types.  "" means none.
-->  
  - **resourceAttributes.namespace** (string)
    
    namespace 是正在請求的操作的名稱空間。
    目前，無名稱空間和所有名稱空間之間沒有區別。
    對於 LocalSubjectAccessReviews，預設為 ""（空字串）。
    對於叢集範圍的資源，預設為 ""（空字串）。
    對於來自 SubjectAccessReview 或 SelfSubjectAccessReview 的名稱空間範圍的資源，
    ""（空字串）表示 "all"（所有資源）。
  
  - **resourceAttributes.resource** (string)
    
    resource 是現有的資源類別之一。
    "*" 表示所有資源類別。
  
  - **resourceAttributes.subresource** (string)
    
    subresource 是現有的資源類別之一。
    "" 表示無子資源。
<!--
  - **resourceAttributes.verb** (string)
    Verb is a kubernetes resource API verb, like: get, list, watch, create, update, delete, proxy.  "*" means all.

  - **resourceAttributes.version** (string)
    Version is the API Version of the Resource.  "*" means all.

- **uid** (string)
  UID information about the requesting user.

- **user** (string)
  User is the user you're testing for. If you specify "User" but not "Groups", then is it interpreted as "What if User were not a member of any groups
-->  
  - **resourceAttributes.verb** (string)
    
    verb 是 kubernetes 資源的 API 動作，例如 get、list、watch、create、update、delete、proxy。
    "*" 表示所有動作。
  
  - **resourceAttributes.version** (string)
    
    version 是資源的 API 版本。
    "*" 表示所有版本。

- **uid** (string)
  
  有關正在請求的使用者的 UID 資訊。

- **user** (string)
  
  user 是你正在測試的使用者。
  如果你指定 “user” 而不是 “groups”，它將被解讀為“如果 user 不是任何組的成員，將會怎樣”。

## SubjectAccessReviewStatus {#SubjectAccessReviewStatus}

SubjectAccessReviewStatus

<hr>

<!--
- **allowed** (boolean), required
  Allowed is required. True if the action would be allowed, false otherwise.

- **denied** (boolean)
  Denied is optional. True if the action would be denied, otherwise false. If both allowed is false and denied is false, then the authorizer has no opinion on whether to authorize the action. Denied may not be true if Allowed is true.
-->
- **allowed** (boolean)，必需
  
  allowed 是必需的。
  如果允許該操作，則為 true，否則為 false。

- **denied** (boolean)
  
  denied 是可選的。
  如果拒絕該操作，則為 true，否則為 false。
  如果 allowed 和 denied 均為 false，則 Authorizer 對是否鑑權操作沒有意見。
  如果 allowed 為 true，則 denied 不能為 true。
<!--
- **evaluationError** (string)
  EvaluationError is an indication that some error occurred during the authorization check. It is entirely possible to get an error and be able to continue determine authorization status in spite of it. For instance, RBAC can be missing a role, but enough roles are still present and bound to reason about the request.

- **reason** (string)
  Reason is optional.  It indicates why a request was allowed or denied.
-->
- **evaluationError** (string)
  
  evaluationError 表示鑑權檢查期間發生一些錯誤。
  出現錯誤的情況下完全有可能繼續確定鑑權狀態。
  例如，RBAC 可能缺少一個角色，但仍存在足夠多的角色進行繫結，進而瞭解請求有關的原因。

- **reason** (string)
  
  reason 是可選的。
  它表示為什麼允許或拒絕請求。
<!--
## Operations {#Operations}

<hr>

### `create` create a SubjectAccessReview

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `create` 建立 SubjectAccessReview

#### HTTP 請求

POST /apis/authorization.k8s.io/v1/subjectaccessreviews
<!--
#### Parameters
- **body**: <a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>, required
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

- **body**: <a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Accepted

401: Unauthorized
