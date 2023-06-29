---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "TokenReview"
content_type: "api_reference"
description: "TokenReview 尝试通过验证令牌来确认已知用户。"
title: "TokenReview"
weight: 3
auto_generated: true
---

<!--
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "TokenReview"
content_type: "api_reference"
description: "TokenReview attempts to authenticate a token to a known user."
title: "TokenReview"
weight: 3
auto_generated: true
-->

`apiVersion: authentication.k8s.io/v1`

`import "k8s.io/api/authentication/v1"`

<!--
## TokenReview {#TokenReview}
TokenReview attempts to authenticate a token to a known user. Note: TokenReview requests may be cached by the webhook token authenticator plugin in the kube-apiserver.
-->
## TokenReview {#TokenReview}

TokenReview 尝试通过验证令牌来确认已知用户。
注意：TokenReview 请求可能会被 kube-apiserver 中的 webhook 令牌验证器插件缓存。

<hr>

- **apiVersion**: authentication.k8s.io/v1


- **kind**: TokenReview


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准对象的元数据，更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authentication-resources/token-review-v1#TokenReviewSpec" >}}">TokenReviewSpec</a>), required

  <!--
  Spec holds information about the request being evaluated
  -->
  spec 保存有关正在评估的请求的信息

- **status** (<a href="{{< ref "../authentication-resources/token-review-v1#TokenReviewStatus" >}}">TokenReviewStatus</a>)

  <!--
  Status is filled in by the server and indicates whether the request can be authenticated.
  -->
  status 由服务器填写，指示请求是否可以通过身份验证。


## TokenReviewSpec {#TokenReviewSpec}

<!--
TokenReviewSpec is a description of the token authentication request.
-->
TokenReviewPec 是对令牌身份验证请求的描述。

<hr>

- **audiences** ([]string)

  <!--
  Audiences is a list of the identifiers that the resource server presented with the token identifies as. Audience-aware token authenticators will verify that the token was intended for at least one of the audiences in this list. If no audiences are provided, the audience will default to the audience of the Kubernetes apiserver.
  -->
  audiences 是带有令牌的资源服务器标识为受众的标识符列表。
  受众感知令牌身份验证器将验证令牌是否适用于此列表中的至少一个受众。
  如果未提供受众，受众将默认为 Kubernetes API 服务器的受众。

- **token** (string)

  <!--
  Token is the opaque bearer token.
  -->
  token 是不透明的持有者令牌（Bearer Token）。

## TokenReviewStatus {#TokenReviewStatus}

<!--
TokenReviewStatus is the result of the token authentication request.
-->
TokenReviewStatus 是令牌认证请求的结果。

<hr>

- **audiences** ([]string)

  <!--
  Audiences are audience identifiers chosen by the authenticator that are compatible with both the TokenReview and token. An identifier is any identifier in the intersection of the TokenReviewSpec audiences and the token's audiences. A client of the TokenReview API that sets the spec.audiences field should validate that a compatible audience identifier is returned in the status.audiences field to ensure that the TokenReview server is audience aware. If a TokenReview returns an empty status.audience field where status.authenticated is "true", the token is valid against the audience of the Kubernetes API server.
  -->
  audiences 是身份验证者选择的与 TokenReview 和令牌兼容的受众标识符。标识符是
  TokenReviewSpec 受众和令牌受众的交集中的任何标识符。设置 spec.audiences
  字段的 TokenReview API 的客户端应验证在 status.audiences 字段中返回了兼容的受众标识符，
  以确保 TokenReview 服务器能够识别受众。如果 TokenReview
  返回一个空的 status.audience 字段，其中 status.authenticated 为 “true”，
  则该令牌对 Kubernetes API 服务器的受众有效。

- **authenticated** (boolean)
  <!--
  Authenticated indicates that the token was associated with a known user.
  -->
  authenticated 表示令牌与已知用户相关联。

- **error** (string)

  <!--
  Error indicates that the token couldn't be checked
  -->
  error 表示无法检查令牌

- **user** (UserInfo)

  <!--
  User is the UserInfo associated with the provided token.
  -->
  user 是与提供的令牌关联的 UserInfo。

  <a name="UserInfo"></a>
  <!--
  *UserInfo holds the information about the user needed to implement the user.Info interface.*
  -->
  **UserInfo 保存实现 user.Info 接口所需的用户信息**

  - **user.extra** (map[string][]string)

    <!--
    Any additional information provided by the authenticator.
    -->
   验证者提供的任何附加信息。

  - **user.groups** ([]string)

    <!--
    The names of groups this user is a part of.
    -->
   此用户所属的组的名称。

  - **user.uid** (string)

    <!--
    A unique value that identifies this user across time. If this user is deleted and another user by the same name is added, they will have different UIDs.
    -->
   跨时间标识此用户的唯一值。如果删除此用户并添加另一个同名用户，他们将拥有不同的 UID。

  - **user.username** (string)

    <!--
    The name that uniquely identifies this user among all active users.
    -->
   在所有活跃用户中唯一标识此用户的名称。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `create` create a TokenReview

#### HTTP Request
-->
### `create` 创建一个TokenReview

#### HTTP 请求

POST /apis/authentication.k8s.io/v1/tokenreviews

<!--
#### Parameters
- **body**: <a href="{{< ref "../authentication-resources/token-review-v1#TokenReview" >}}">TokenReview</a>, required
-->
#### 参数

- **body**: <a href="{{< ref "../authentication-resources/token-review-v1#TokenReview" >}}">TokenReview</a>, 必需

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
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/token-review-v1#TokenReview" >}}">TokenReview</a>): OK

201 (<a href="{{< ref "../authentication-resources/token-review-v1#TokenReview" >}}">TokenReview</a>): Created

202 (<a href="{{< ref "../authentication-resources/token-review-v1#TokenReview" >}}">TokenReview</a>): Accepted

401: Unauthorized

