---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectAccessReview"
content_type: "api_reference"
description: "SubjectAccessReview 检查用户或组是否可以执行操作。"
title: "SubjectAccessReview"
weight: 4
auto_generated: true
---

<!--
---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SubjectAccessReview"
content_type: "api_reference"
description: "SubjectAccessReview checks whether or not a user or group can perform an action."
title: "SubjectAccessReview"
weight: 4
auto_generated: true
---
-->

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`


## SubjectAccessReview {#SubjectAccessReview}
<!--
SubjectAccessReview checks whether or not a user or group can perform an action.
-->
SubjectAccessReview 检查用户或组是否可以执行操作。

<hr>

<!--
- **apiVersion**: authorization.k8s.io/v1


- **kind**: SubjectAccessReview


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>), required

  Spec holds information about the request being evaluated

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)

  Status is filled in by the server and indicates whether the request is allowed or not
-->
- **apiVersion**: authorization.k8s.io/v1


- **kind**: SubjectAccessReview


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准列表元数据。更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>), 必选

  Spec保存有关正在评估的请求的信息

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)

  状态由服务器填写，并指示请求是否被允许



## SubjectAccessReviewSpec {#SubjectAccessReviewSpec}

<!--
SubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set
-->
SubjectAccessReviewSpec 是对访问请求的描述。   
必须设置 ResourceAuthorizationAttributes 和 NonResourceAuthorizationAttributes 中的一个

<hr>

<!--
- **extra** (map[string][]string)

  Extra corresponds to the user.Info.GetExtra() method from the authenticator.  Since that is input to the authorizer it needs a reflection here.

- **groups** ([]string)

  Groups is the groups you're testing for.

- **nonResourceAttributes** (NonResourceAttributes)

  NonResourceAttributes describes information for a non-resource access request

  <a name="NonResourceAttributes"></a>
  *NonResourceAttributes includes the authorization attributes available for non-resource requests to the Authorizer interface*

    - **nonResourceAttributes.path** (string)

    Path is the URL path of the request

  - **nonResourceAttributes.verb** (string)

    Verb is the standard HTTP verb
-->
- **extra** (map[string][]string)

  Extra 对应于验证器中的 user.Info.GetExtra()方法。   
  由于这是授权人的输入，因此需要在此进行显示。

- **groups** ([]string)

  Groups是指你要测试的组。

- **nonResourceAttributes** (NonResourceAttributes)

  NonResourceAttributes 描述非资源请求信息

  <a name="NonResourceAttributes"></a>
  *NonResourceAttributes 包括可用于向授权者接口发出非资源请求的授权属性*

  - **nonResourceAttributes.path** (string)

    Path 是请求的URL路径

  - **nonResourceAttributes.verb** (string)

    Verb 是标准的 HTTP verb

<!--
- **resourceAttributes** (ResourceAttributes)

  ResourceAuthorizationAttributes describes information for a resource access request

  <a name="ResourceAttributes"></a>
  *ResourceAttributes includes the authorization attributes available for resource requests to the Authorizer interface*

  - **resourceAttributes.group** (string)

    Group is the API Group of the Resource.  "*" means all.

  - **resourceAttributes.name** (string)

    Name is the name of the resource being requested for a "get" or deleted for a "delete". "" (empty) means all.

  - **resourceAttributes.namespace** (string)

    Namespace is the namespace of the action being requested.  Currently, there is no distinction between no namespace and all namespaces "" (empty) is defaulted for LocalSubjectAccessReviews "" (empty) is empty for cluster-scoped resources "" (empty) means "all" for namespace scoped resources from a SubjectAccessReview or SelfSubjectAccessReview
-->
- **resourceAttributes** (ResourceAttributes)

  ResourceAuthorizationAttributes 描述资源请求信息

  <a name="ResourceAttributes"></a>
  *ResourceAttributes 包括可用于向授权者接口发出资源请求的授权属性*

  - **resourceAttributes.group** (string)

    Group 是资源的API组。   
    "*" 表示全部。

  - **resourceAttributes.name** (string)

    Name 是请求 “get” 或删除 “delete” 的资源的名称。   
    "" (空) 表示全部。

  - **resourceAttributes.namespace** (string)

    Namespace是被请求的操作的命名空间。   
    目前，没有命名空间和所有命名空间之间没有区别。   
    LocalSubjectAccessReviews的默认名称空间为“”（空）。   
    集群范围的资源的默认名称空间为“”（空）。   
    SubjectAccessReview或SelfSubjectAccessReview的名称空间范围的资源的默认名称空间为“”（空）。

<!--
  - **resourceAttributes.resource** (string)

    Resource is one of the existing resource types.  "*" means all.

  - **resourceAttributes.subresource** (string)

    Subresource is one of the existing resource types.  "" means none.

  - **resourceAttributes.verb** (string)

    Verb is a kubernetes resource API verb, like: get, list, watch, create, update, delete, proxy.  "*" means all.

  - **resourceAttributes.version** (string)

    Version is the API Version of the Resource.  "*" means all.

- **uid** (string)

  UID information about the requesting user.

- **user** (string)

  User is the user you're testing for. If you specify "User" but not "Groups", then is it interpreted as "What if User were not a member of any groups
-->
  - **resourceAttributes.resource** (string)

    Resource 是现有的资源类型之一。  
    "*" 表示全部。

  - **resourceAttributes.subresource** (string)

    Subresource 是现有的资源类型之一。     
    "" 表示无。

  - **resourceAttributes.verb** (string)

    Verb 是kubernetes资源API verb, 比如: get, list, watch, create, update, delete, proxy。  
    "*" 表示全部。

  - **resourceAttributes.version** (string)

    Version 是资源的API版本。     
    "*" 表示全部。

- **uid** (string)

  有关请求用户的UID信息。

- **user** (string)

  用户是您要测试的用户。   
  如果指定 “User” 而不是 “group”，那么它被解释为 “用户不是任何组的成员”



## SubjectAccessReviewStatus {#SubjectAccessReviewStatus}

SubjectAccessReviewStatus

<hr>

<!--
- **allowed** (boolean), required

  Allowed is required. True if the action would be allowed, false otherwise.

- **denied** (boolean)

  Denied is optional. True if the action would be denied, otherwise false. If both allowed is false and denied is false, then the authorizer has no opinion on whether to authorize the action. Denied may not be true if Allowed is true.

- **evaluationError** (string)

  EvaluationError is an indication that some error occurred during the authorization check. It is entirely possible to get an error and be able to continue determine authorization status in spite of it. For instance, RBAC can be missing a role, but enough roles are still present and bound to reason about the request.

- **reason** (string)

  Reason is optional.  It indicates why a request was allowed or denied.
-->
- **allowed** (boolean), 必选

  Allowed 是必选项。   
  如果允许该操作，则为 True，否则为 false。

- **denied** (boolean)

  Denied 是可选的。   
  如果行为被拒绝，则为True，否则为false。   
  如果 allowed 和 denied 都是false，那么授权人对是否授权该行为没有意见。   
  如果Allowed为true，则Denied可能不为true。   

- **evaluationError** (string)

  EvaluationError表示在授权检查期间发生了一些错误。   
  即使出现错误，也完全有可能继续确定授权状态。   
  例如，RBAC可能缺少一个角色，但仍有足够多的角色存在，并且必须对请求进行推理。

- **reason** (string)

  Reason 是可选的。   
  它表明了请求被允许或拒绝的原因。



## Operations {#Operations}



<hr>






<!--
### `create` create a SubjectAccessReview

#### HTTP Request

POST /apis/authorization.k8s.io/v1/subjectaccessreviews

#### Parameters


- **body**: <a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>, required
-->
### `create` 创建 SubjectAccessReview

#### HTTP 请求

POST /apis/authorization.k8s.io/v1/subjectaccessreviews

#### 参数


<!--
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
- **body**: <a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>, 必选


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response


200 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Accepted

401: Unauthorized
-->
#### 返回值


200 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReview" >}}">SubjectAccessReview</a>): Accepted

401: 未授权
