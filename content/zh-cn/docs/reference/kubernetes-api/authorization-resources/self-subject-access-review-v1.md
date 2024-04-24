---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SelfSubjectAccessReview"
content_type: "api_reference"
description: "SelfSubjectAccessReview 检查当前用户是否可以执行某操作。"
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
SelfSubjectAccessReview 检查当前用户是否可以执行某操作。
不填写 spec.namespace 表示 “在所有命名空间中”。
Self 是一个特殊情况，因为用户应始终能够检查自己是否可以执行某操作。

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

  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReviewSpec" >}}">SelfSubjectAccessReviewSpec</a>)，必需
  
  spec 包含有关正在评估的请求的信息。
  user 和 group 必须为空。

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)

  status 由服务器填写，表示请求是否被允许。

## SelfSubjectAccessReviewSpec {#SelfSubjectAccessReviewSpec}

<!--
SelfSubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set
-->
SelfSubjectAccessReviewSpec 是访问请求的描述。
resourceAuthorizationAttributes 和 nonResourceAuthorizationAttributes 二者必须设置其一，并且只能设置其一。

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
    "*" 表示所有组。
  
  - **resourceAttributes.name** (string)
    
    name 是 "get" 正在请求或 "delete" 已删除的资源的名称。
    ""（空字符串）表示所有资源。

  <!--
  - **resourceAttributes.namespace** (string)
    Namespace is the namespace of the action being requested.  Currently, there is no distinction between no namespace and all namespaces "" (empty) is defaulted for LocalSubjectAccessReviews "" (empty) is empty for cluster-scoped resources "" (empty) means "all" for namespace scoped resources from a SubjectAccessReview or SelfSubjectAccessReview

  - **resourceAttributes.resource** (string)
    Resource is one of the existing resource types.  "*" means all.
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

  <!--
  - **resourceAttributes.subresource** (string)
    Subresource is one of the existing resource types.  "" means none.

  - **resourceAttributes.verb** (string)
    Verb is a kubernetes resource API verb, like: get, list, watch, create, update, delete, proxy.  "*" means all.

  - **resourceAttributes.version** (string)
    Version is the API Version of the Resource.  "*" means all.
  -->  

  - **resourceAttributes.subresource** (string)
    
    subresource 是现有的资源类型之一。
    "" 表示无。

  - **resourceAttributes.verb** (string)
    
    verb 是 kubernetes 资源 API 动作，例如 get、list、watch、create、update、delete、proxy。
    "*" 表示所有动作。
  
  - **resourceAttributes.version** (string)
    
    version 是资源的 API 版本。
    "*" 表示所有版本。

<!--
## Operations {#Operations}

<hr>

### `create` create a SelfSubjectAccessReview

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `create` 创建 SelfSubjectAccessReview

#### HTTP 请求

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
#### 参数

- **body**: <a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>): Accepted

401: Unauthorized

