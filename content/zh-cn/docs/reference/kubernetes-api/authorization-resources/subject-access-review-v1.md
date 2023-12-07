---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectAccessReview"
content_type: "api_reference"
description: "SubjectAccessReview 检查用户或组是否可以执行某操作。"
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
SubjectAccessReview 检查用户或组是否可以执行某操作。

<hr>

- **apiVersion**: authorization.k8s.io/v1

- **kind**: SubjectAccessReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>), required
  Spec holds information about the request being evaluated
- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)
  Status is filled in by the server and indicates whether the request is allowed or not
-->  
- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>)，必需
  
  spec 包含有关正在评估的请求的信息。

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)
  
  status 由服务器填写，表示请求是否被允许。

## SubjectAccessReviewSpec {#SubjectAccessReviewSpec}

<!--
SubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set
-->
SubjectAccessReviewSpec 是访问请求的描述。
resourceAuthorizationAttributes 和 nonResourceAuthorizationAttributes 二者必须设置其一，并且只能设置其一。

<hr>

<!--
- **extra** (map[string][]string)
  Extra corresponds to the user.Info.GetExtra() method from the authenticator.  Since that is input to the authorizer it needs a reflection here.
- **groups** ([]string)
  Groups is the groups you're testing for.
-->
- **extra** (map[string][]string)
  
  extra 对应于来自鉴权器的 user.Info.GetExtra() 方法。
  由于这是针对 Authorizer 的输入，所以它需要在此处反映。

- **groups** ([]string)
  
  groups 是你正在测试的组。

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
  
  nonResourceAttributes 描述非资源访问请求的信息。
  
  <a name="NonResourceAttributes"></a> 
  **nonResourceAttributes 包括提供给 Authorizer 接口进行非资源请求鉴权时所用的属性。**
  
  - **nonResourceAttributes.path** (string)
    
    path 是请求的 URL 路径。
  
  - **nonResourceAttributes.verb** (string)
    
    verb 是标准的 HTTP 动作。

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
  
  resourceAuthorizationAttributes 描述资源访问请求的信息。
  
  <a name="ResourceAttributes"></a> 
  **resourceAttributes 包括提供给 Authorizer 接口进行资源请求鉴权时所用的属性。**
  
  - **resourceAttributes.group** (string)
    
    group 是资源的 API 组。
    "*" 表示所有资源。
  
  - **resourceAttributes.name** (string)
    
    name 是 "get" 正在请求或 "delete" 已删除的资源。
    ""（空字符串）表示所有资源。

  <!--
  - **resourceAttributes.namespace** (string)
    Namespace is the namespace of the action being requested.  Currently, there is no distinction between no namespace and all namespaces "" (empty) is defaulted for LocalSubjectAccessReviews "" (empty) is empty for cluster-scoped resources "" (empty) means "all" for namespace scoped resources from a SubjectAccessReview or SelfSubjectAccessReview

  - **resourceAttributes.resource** (string)
    Resource is one of the existing resource types.  "*" means all.

  - **resourceAttributes.subresource** (string)
    Subresource is one of the existing resource types.  "" means none.
  -->  

  - **resourceAttributes.namespace** (string)
    
    namespace 是正在请求的操作的命名空间。
    目前，无命名空间和所有命名空间之间没有区别。
    对于 LocalSubjectAccessReviews，默认为 ""（空字符串）。
    对于集群范围的资源，默认为 ""（空字符串）。
    对于来自 SubjectAccessReview 或 SelfSubjectAccessReview 的命名空间范围的资源，
    ""（空字符串）表示 "all"（所有资源）。
  
  - **resourceAttributes.resource** (string)
    
    resource 是现有的资源类别之一。
    "*" 表示所有资源类别。
  
  - **resourceAttributes.subresource** (string)
    
    subresource 是现有的资源类别之一。
    "" 表示无子资源。

  <!--
  - **resourceAttributes.verb** (string)
    Verb is a kubernetes resource API verb, like: get, list, watch, create, update, delete, proxy.  "*" means all.

  - **resourceAttributes.version** (string)
    Version is the API Version of the Resource.  "*" means all.
  -->

  - **resourceAttributes.verb** (string)
    
    verb 是 kubernetes 资源的 API 动作，例如 get、list、watch、create、update、delete、proxy。
    "*" 表示所有动作。
  
  - **resourceAttributes.version** (string)
    
    version 是资源的 API 版本。
    "*" 表示所有版本。

<!--
- **uid** (string)
  UID information about the requesting user.

- **user** (string)
  User is the user you're testing for. If you specify "User" but not "Groups", then is it interpreted as "What if User were not a member of any groups
-->  

- **uid** (string)
  
  有关正在请求的用户的 UID 信息。

- **user** (string)
  
  user 是你正在测试的用户。
  如果你指定 “user” 而不是 “groups”，它将被解读为“如果 user 不是任何组的成员，将会怎样”。

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
  如果允许该操作，则为 true，否则为 false。

- **denied** (boolean)
  
  denied 是可选的。
  如果拒绝该操作，则为 true，否则为 false。
  如果 allowed 和 denied 均为 false，则 Authorizer 对是否鉴权操作没有意见。
  如果 allowed 为 true，则 denied 不能为 true。

<!--
- **evaluationError** (string)
  EvaluationError is an indication that some error occurred during the authorization check. It is entirely possible to get an error and be able to continue determine authorization status in spite of it. For instance, RBAC can be missing a role, but enough roles are still present and bound to reason about the request.

- **reason** (string)
  Reason is optional.  It indicates why a request was allowed or denied.
-->
- **evaluationError** (string)
  
  evaluationError 表示鉴权检查期间发生一些错误。
  出现错误的情况下完全有可能继续确定鉴权状态。
  例如，RBAC 可能缺少一个角色，但仍存在足够多的角色进行绑定，进而了解请求有关的原因。

- **reason** (string)
  
  reason 是可选的。
  它表示为什么允许或拒绝请求。

<!--
## Operations {#Operations}

<hr>

### `create` create a SubjectAccessReview

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `create` 创建 SubjectAccessReview

#### HTTP 请求

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
#### 参数

- **body**: <a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>，必需

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Accepted

401: Unauthorized
