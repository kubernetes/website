---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "SelfSubjectReview"
content_type: "api_reference"
description: "SelfSubjectReview 包含 kube-apiserver 所擁有的與發出此請求的用戶有關的用戶信息。"
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
SelfSubjectReview 包含 kube-apiserver 所擁有的與發出此請求的用戶有關的用戶信息。
使用僞裝時，用戶將收到被僞裝用戶的用戶信息。
如果使用僞裝或請求頭部進行身份驗證，則所有額外的鍵都將被忽略大小寫並以小寫形式返回結果。

<hr>

- **apiVersion**: authentication.k8s.io/v1

- **kind**: SelfSubjectReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **status** (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReviewStatus" >}}">SelfSubjectReviewStatus</a>)

  <!--
  Status is filled in by the server with the user attributes.
  -->
  status 由服務器以用戶屬性進行填充。

## SelfSubjectReviewStatus {#SelfSubjectReviewStatus}

<!--
SelfSubjectReviewStatus is filled by the kube-apiserver and sent back to a user.
-->
SelfSubjectReviewStatus 由 kube-apiserver 進行填充併發送回用戶。

<hr>

- **userInfo** (UserInfo)

  <!--
  User attributes of the user making this request.
  -->
  發出此請求的用戶的用戶屬性。

  <a name="UserInfo"></a>
  <!--
  *UserInfo holds the information about the user needed to implement the user.Info interface.*
  -->
  **userInfo 包含實現 user.Info 接口所需的用戶相關信息。**

  - **userInfo.extra** (map[string][]string)

    <!--
    Any additional information provided by the authenticator.
    -->

    由身份認證組件提供的所有附加信息。

  - **userInfo.groups** ([]string)

    <!--
    *Atomic: will be replaced during a merge*
    
    The names of groups this user is a part of.
    -->
    
    **原子性：合併期間將被替換**

    此用戶所屬的用戶組的名稱。

  - **userInfo.uid** (string)

    <!--
    A unique value that identifies this user across time. If this user is deleted and another user by the same name is added, they will have different UIDs.
    -->

    跨時間標識此用戶的唯一值。如果此用戶被刪除且另一個同名用戶被添加，他們將具有不同的 UID。

  - **userInfo.username** (string)

    <!--
    The name that uniquely identifies this user among all active users.
    -->

    在所有活躍用戶中標識此用戶的名稱。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `create` create a SelfSubjectReview

#### HTTP Request
-->
### `create` 創建 SelfSubjectReview

#### HTTP 請求

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
#### 參數

- **body**: <a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>, 必需

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

200 (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>): OK

201 (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>): Created

202 (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>): Accepted

401: Unauthorized
