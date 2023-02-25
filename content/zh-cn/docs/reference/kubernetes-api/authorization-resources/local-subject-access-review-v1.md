---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "LocalSubjectAccessReview"
content_type: "api_reference"
description: "LocalSubjectAccessReview 检查用户或组是否可以在给定的命名空间内执行某操作。"
title: "LocalSubjectAccessReview"
weight: 1
---
<!--
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "LocalSubjectAccessReview"
content_type: "api_reference"
description: "LocalSubjectAccessReview checks whether or not a user or group can perform an action in a given namespace."
title: "LocalSubjectAccessReview"
weight: 1
-->

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## LocalSubjectAccessReview {#LocalSubjectAccessReview}
<!--
LocalSubjectAccessReview checks whether or not a user or group can perform an action in a given namespace. Having a namespace scoped resource makes it much easier to grant namespace scoped policy that includes permissions checking.

<hr>

- **apiVersion**: authorization.k8s.io/v1

- **kind**: LocalSubjectAccessReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
LocalSubjectAccessReview 检查用户或组是否可以在给定的命名空间内执行某操作。
划分命名空间范围的资源简化了命名空间范围的策略设置，例如权限检查。

<hr>

- **apiVersion**: authorization.k8s.io/v1

- **kind**: LocalSubjectAccessReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  
  标准的列表元数据。
  更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>), required

  Spec holds information about the request being evaluated.  spec.namespace must be equal to the namespace you made the request against.  If empty, it is defaulted.

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)

  Status is filled in by the server and indicates whether the request is allowed or not
-->
- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>)，必需
  
  spec 包含有关正在评估的请求的信息。
  spec.namespace 必须是你的请求所针对的命名空间。
  如果留空，则会被设置默认值。

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)
  
  status 由服务器填写，表示请求是否被允许。

<!--
## Operations {#Operations}

<hr>

### `create` create a LocalSubjectAccessReview

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `create` 创建 LocalSubjectAccessReview

#### HTTP 请求

POST /apis/authorization.k8s.io/v1/namespaces/{namespace}/localsubjectaccessreviews
<!--
#### Parameters

- **namespace** (*in path*): string, required
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authorization-resources/local-subject-access-review-v1#LocalSubjectAccessReview" >}}">LocalSubjectAccessReview</a>, required

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

- **namespace** (**路径参数**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authorization-resources/local-subject-access-review-v1#LocalSubjectAccessReview" >}}">LocalSubjectAccessReview</a>，必需

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

200 (<a href="{{< ref "../authorization-resources/local-subject-access-review-v1#LocalSubjectAccessReview" >}}">LocalSubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/local-subject-access-review-v1#LocalSubjectAccessReview" >}}">LocalSubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/local-subject-access-review-v1#LocalSubjectAccessReview" >}}">LocalSubjectAccessReview</a>): Accepted

401: Unauthorized
