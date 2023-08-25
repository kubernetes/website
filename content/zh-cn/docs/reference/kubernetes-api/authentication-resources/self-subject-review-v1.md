---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "SelfSubjectReview"
content_type: "api_reference"
description: "SelfSubjectReview 包含 kube-apiserver 所拥有的与发出此请求的用户有关的用户信息。"
title: "SelfSubjectReview"
weight: 6
---
<!--
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "SelfSubjectReview"
content_type: "api_reference"
description: "SelfSubjectReview contains the user information that the kube-apiserver has about the user making this request."
title: "SelfSubjectReview"
weight: 6
auto_generated: true
-->

`apiVersion: authentication.k8s.io/v1`

`import "k8s.io/api/authentication/v1"`

## SelfSubjectReview {#SelfSubjectReview}

<!--
SelfSubjectReview contains the user information that the kube-apiserver has about the user making this request. When using impersonation, users will receive the user info of the user being impersonated.  If impersonation or request header authentication is used, any extra keys will have their case ignored and returned as lowercase.
-->
SelfSubjectReview 包含 kube-apiserver 所拥有的与发出此请求的用户有关的用户信息。
使用伪装时，用户将收到被伪装用户的用户信息。
如果使用伪装或请求头部进行身份验证，则所有额外的键都将被忽略大小写并以小写形式返回结果。

<hr>

- **apiVersion**: authentication.k8s.io/v1

- **kind**: SelfSubjectReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **status** (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReviewStatus" >}}">SelfSubjectReviewStatus</a>)

  <!--
  Status is filled in by the server with the user attributes.
  -->
  status 由服务器以用户属性进行填充。

## SelfSubjectReviewStatus {#SelfSubjectReviewStatus}

<!--
SelfSubjectReviewStatus is filled by the kube-apiserver and sent back to a user.
-->
SelfSubjectReviewStatus 由 kube-apiserver 进行填充并发送回用户。

<hr>

- **userInfo** (UserInfo)

  <!--
  User attributes of the user making this request.
  -->
  发出此请求的用户的用户属性。

  <a name="UserInfo"></a>
  <!--
  *UserInfo holds the information about the user needed to implement the user.Info interface.*
  -->
  **userInfo 包含实现 user.Info 接口所需的用户相关信息。**

  - **userInfo.extra** (map[string][]string)

    <!--
    Any additional information provided by the authenticator.
    -->

    由身份认证组件提供的所有附加信息。

  - **userInfo.groups** ([]string)

    <!--
    The names of groups this user is a part of.
    -->

    此用户所属的用户组的名称。

  - **userInfo.uid** (string)

    <!--
    A unique value that identifies this user across time. If this user is deleted and another user by the same name is added, they will have different UIDs.
    -->

    跨时间标识此用户的唯一值。如果此用户被删除且另一个同名用户被添加，他们将具有不同的 UID。

  - **userInfo.username** (string)

    <!--
    The name that uniquely identifies this user among all active users.
    -->

    在所有活跃用户中标识此用户的名称。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `create` create a SelfSubjectReview

#### HTTP Request
-->
### `create` 创建 SelfSubjectReview

#### HTTP 请求

POST /apis/authentication.k8s.io/v1/selfsubjectreviews

<!--
#### Parameters

- **body**: <a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>, required

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

- **body**: <a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>, 必需

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

200 (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>): OK

201 (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>): Created

202 (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>): Accepted

401: Unauthorized
