---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "TokenRequest"
content_type: "api_reference"
description: "TokenRequest 爲給定的服務賬號請求一個令牌。"
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
TokenRequest 爲給定的服務賬號請求一個令牌。

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

  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequestSpec" >}}">TokenRequestSpec</a>)，必需

  spec 包含與正被評估的請求相關的信息。

- **status** (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequestStatus" >}}">TokenRequestStatus</a>)

  status 由服務器填充，表示該令牌是否可用於身份認證。

## TokenRequestSpec {#TokenRequestSpec}

<!--
TokenRequestSpec contains client provided parameters of a token request.
-->
TokenRequestSpec 包含客戶端提供的令牌請求參數。

<hr>

<!--
- **audiences** ([]string), required

  *Atomic: will be replaced during a merge*

  Audiences are the intended audiences of the token. A recipient of a token must identify themself with an identifier in the list of audiences of the token, and otherwise should reject the token. A token issued for multiple audiences may be used to authenticate against any of the audiences listed but implies a high degree of trust between the target audiences.
-->
- **audiences** ([]string)，必需

  **原子：將在合併期間被替換**

  audiences 是令牌預期的受衆。
  令牌的接收方必須在令牌的受衆列表中用一個標識符來標識自己，否則應拒絕該令牌。
  爲多個受衆簽發的令牌可用於認證所列舉的任意受衆的身份，但這意味着目標受衆彼此之間的信任程度較高。

- **boundObjectRef** (BoundObjectReference)

  <!--
  BoundObjectRef is a reference to an object that the token will be bound to. The token will only be valid for as long as the bound object exists. NOTE: The API server's TokenReview endpoint will validate the BoundObjectRef, but other audiences may not. Keep ExpirationSeconds small if you want prompt revocation.

  <a name="BoundObjectReference"></a>
  *BoundObjectReference is a reference to an object that a token is bound to.*
  -->
  boundObjectRef 是對令牌所綁定的一個對象的引用。該令牌只有在綁定對象存在時纔有效。
  注：API 服務器的 TokenReview 端點將校驗 boundObjectRef，但其他受衆可能不用這樣。
  如果你想要快速撤銷，請爲 expirationSeconds 設一個較小的值。

  <a name="BoundObjectReference"></a>
  **BoundObjectReference 是對令牌所綁定的一個對象的引用。**

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

    引用對象的 API 版本。

  - **boundObjectRef.kind** (string)

    引用對象的類別。有效的類別爲 “Pod” 和 “Secret”。

  - **boundObjectRef.name** (string)

    引用對象的名稱。

  - **boundObjectRef.uid** (string)
    引用對象的 UID。

<!--
- **expirationSeconds** (int64)

  ExpirationSeconds is the requested duration of validity of the request. The token issuer may return a token with a different validity duration so a client needs to check the 'expiration' field in a response.
-->
- **expirationSeconds** (int64)

  expirationSeconds 是請求生效的持續時間。
  令牌簽發方可能返回一個生效期不同的令牌，因此客戶端需要檢查響應中的 “expiration” 字段。

## TokenRequestStatus {#TokenRequestStatus}

<!--
TokenRequestStatus is the result of a token request.
-->
TokenRequestStatus 是一個令牌請求的結果。

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

  expirationTimestamp 是已返回令牌的到期時間。

  <a name="Time"></a>
  **Time 是 time.Time 的包裝器，支持正確編組爲 YAML 和 JSON。爲 time 包提供的許多工廠方法提供了包裝器。**

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

### `create` 創建 ServiceAccount 的令牌

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  TokenRequest 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>): Created

202 (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>): Accepted

401: Unauthorized
