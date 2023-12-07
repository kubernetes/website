---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "TokenRequest"
content_type: "api_reference"
description: "TokenRequest 为给定的服务账号请求一个令牌。"
title: "TokenRequest"
weight: 2
---
<!--
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "TokenRequest"
content_type: "api_reference"
description: "TokenRequest requests a token for a given service account."
title: "TokenRequest"
weight: 2
auto_generated: true
-->

`apiVersion: authentication.k8s.io/v1`

`import "k8s.io/api/authentication/v1"`

## TokenRequest {#TokenRequest}
<!--
TokenRequest requests a token for a given service account.
-->
TokenRequest 为给定的服务账号请求一个令牌。

<hr>

- **apiVersion**: authentication.k8s.io/v1

- **kind**: TokenRequest

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequestSpec" >}}">TokenRequestSpec</a>), required
  Spec holds information about the request being evaluated
- **status** (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequestStatus" >}}">TokenRequestStatus</a>)

  Status is filled in by the server and indicates whether the token can be authenticated.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequestSpec" >}}">TokenRequestSpec</a>)，必需

  spec 包含与正被评估的请求相关的信息。

- **status** (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequestStatus" >}}">TokenRequestStatus</a>)

  status 由服务器填充，表示该令牌是否可用于身份认证。

## TokenRequestSpec {#TokenRequestSpec}
<!--
TokenRequestSpec contains client provided parameters of a token request.
-->
TokenRequestSpec 包含客户端提供的令牌请求参数。

<hr>

<!--
- **audiences** ([]string), required

  Audiences are the intendend audiences of the token. A recipient of a token must identify themself with an identifier in the list of audiences of the token, and otherwise should reject the token. A token issued for multiple audiences may be used to authenticate against any of the audiences listed but implies a high degree of trust between the target audiences.
-->
- **audiences** ([]string)，必需
  
  audiences 是令牌预期的受众。
  令牌的接收方必须在令牌的受众列表中用一个标识符来标识自己，否则应拒绝该令牌。
  为多个受众签发的令牌可用于认证所列举的任意受众的身份，但这意味着目标受众彼此之间的信任程度较高。

- **boundObjectRef** (BoundObjectReference)
  
  <!--
  BoundObjectRef is a reference to an object that the token will be bound to. The token will only be valid for as long as the bound object exists. NOTE: The API server's TokenReview endpoint will validate the BoundObjectRef, but other audiences may not. Keep ExpirationSeconds small if you want prompt revocation.

  <a name="BoundObjectReference"></a>
  *BoundObjectReference is a reference to an object that a token is bound to.*
  -->
  boundObjectRef 是对令牌所绑定的一个对象的引用。该令牌只有在绑定对象存在时才有效。
  注：API 服务器的 TokenReview 端点将校验 boundObjectRef，但其他受众可能不用这样。
  如果你想要快速撤销，请为 expirationSeconds 设一个较小的值。

  <a name="BoundObjectReference"></a>
  **BoundObjectReference 是对令牌所绑定的一个对象的引用。**

  <!--
  - **boundObjectRef.apiVersion** (string)
    API version of the referent.

  - **boundObjectRef.kind** (string)
    Kind of the referent. Valid kinds are 'Pod' and 'Secret'.

  - **boundObjectRef.name** (string)
    Name of the referent.
  
  - **boundObjectRef.uid** (string)
    UID of the referent.
  -->
  - **boundObjectRef.apiVersion** (string)

    引用对象的 API 版本。

  - **boundObjectRef.kind** (string)

    引用对象的类别。有效的类别为 “Pod” 和 “Secret”。

  - **boundObjectRef.name** (string)

    引用对象的名称。

  - **boundObjectRef.uid** (string)
    引用对象的 UID。

<!--
- **expirationSeconds** (int64)

  ExpirationSeconds is the requested duration of validity of the request. The token issuer may return a token with a different validity duration so a client needs to check the 'expiration' field in a response.
-->
- **expirationSeconds** (int64)

  expirationSeconds 是请求生效的持续时间。
  令牌签发方可能返回一个生效期不同的令牌，因此客户端需要检查响应中的 “expiration” 字段。

## TokenRequestStatus {#TokenRequestStatus}
<!--
TokenRequestStatus is the result of a token request.
-->
TokenRequestStatus 是一个令牌请求的结果。

<hr>

<!--
- **expirationTimestamp** (Time), required
  ExpirationTimestamp is the time of expiration of the returned token.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

- **token** (string), required
  Token is the opaque bearer token.
-->
- **expirationTimestamp** (Time)，必需

  expirationTimestamp 是已返回令牌的到期时间。

  <a name="Time"></a>
  **Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。**

- **token** (string)，必需

  token 是不透明的持有者令牌（Bearer Token）。

<!--
## Operations {#Operations}
<hr>
### `create` create token of a ServiceAccount
#### HTTP Request
-->
## 操作 {#Operations}
<hr>

### `create` 创建 ServiceAccount 的令牌
#### HTTP 请求
POST /api/v1/namespaces/{namespace}/serviceaccounts/{name}/token

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the TokenRequest
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数
- **name** (**路径参数**): string，必需

  TokenRequest 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>，必需

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
200 (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>): Created

202 (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>): Accepted

401: Unauthorized

