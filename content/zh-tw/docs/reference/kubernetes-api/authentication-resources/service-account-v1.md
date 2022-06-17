---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ServiceAccount"
content_type: "api_reference"
description: "ServiceAccount 將以下內容繫結在一起：1. 使用者可以理解的名稱，也可能是外圍系統理解的身份標識 2. 可以驗證和授權的主體 3. 一組 secret。"
title: "ServiceAccount"
weight: 1
auto_generated: true
---

<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ServiceAccount"
content_type: "api_reference"
description: "ServiceAccount binds together: * a name, understood by users, and perhaps by peripheral systems, for an identity * a principal that can be authenticated and authorized * a set of secrets."
title: "ServiceAccount"
weight: 1
auto_generated: true
-->

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`


## ServiceAccount {#ServiceAccount}

<!--
ServiceAccount binds together: * a name, understood by users, and perhaps by peripheral systems, for an identity * a principal that can be authenticated and authorized * a set of secrets
-->
ServiceAccount 將以下內容繫結在一起：
* 使用者可以理解的名稱，也可能是外圍系統理解的身份標識
* 可以驗證和授權的主體
* 一組 secret

<hr>

- **apiVersion**: v1


- **kind**: ServiceAccount


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準物件的元資料，更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **automountServiceAccountToken** (boolean)

  <!--
  AutomountServiceAccountToken indicates whether pods running as this service account should have an API token automatically mounted. Can be overridden at the pod level.
  -->
  AutomountServiceAccountToken 指示作為此服務帳戶執行的 pod 是否應自動掛載 API 令牌，
  可以在 pod 級別覆蓋。

- **imagePullSecrets** ([]<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

  <!--
  ImagePullSecrets is a list of references to secrets in the same namespace to use for pulling any images in pods that reference this ServiceAccount. ImagePullSecrets are distinct from Secrets because Secrets can be mounted in the pod, but ImagePullSecrets are only accessed by the kubelet. More info: https://kubernetes.io/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod
  -->
  imagePullSecrets 是對同一名稱空間中 Secret 的引用列表，用於拉取引用此 ServiceAccount 的 Pod 中的任何映象。
  imagePullSecrets 與 Secrets 不同，因為 Secrets 可以掛載在 Pod 中，但 imagePullSecrets 只能由 kubelet 訪問。
  更多資訊： https://kubernetes.io/zh-cn/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod

- **secrets** ([]<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  <!--
  *Patch strategy: merge on key `name`*

  Secrets is a list of the secrets in the same namespace that pods running using this ServiceAccount are allowed to use. Pods are only limited to this list if this service account has a "kubernetes.io/enforce-mountable-secrets" annotation set to "true". This field should not be used to find auto-generated service account token secrets for use outside of pods. Instead, tokens can be requested directly using the TokenRequest API, or service account token secrets can be manually created. More info: https://kubernetes.io/docs/concepts/configuration/secret
  Secrets is a list of the secrets in the same namespace that pods running using this ServiceAccount are allowed to use
  Pods are only limited to this list if this service account has a "kubernetes.io/enforce-mountabl
  -secrets" annotation set to "true". This field should not be used to find auto-generated service accoun
  token secrets for use outside of pods. Instead, tokens can be requested directly using the TokenRequest API, or servic
  account token secrets can be manually created. More info: https://kubernetes.io/docs/concepts/configuration/secret
  -->
  **補丁策略：基於鍵 `name` 合併**

  Secrets 是允許使用此 ServiceAccount 執行的 pod 使用的同一名稱空間中的秘密列表。
  僅當此服務帳戶的 “kubernetes.io/enforce-mountable-secrets” 註釋設定為 “true” 時，Pod 才限於此列表。
  此欄位不應用於查詢自動生成的服務帳戶令牌機密以在 pod 之外使用。
  相反，可以使用 TokenRequest API 直接請求令牌，或者可以手動建立服務帳戶令牌 secret。
  更多資訊： https://kubernetes.io/docs/concepts/configuration/secret

## ServiceAccountList {#ServiceAccountList}

<!--
ServiceAccountList is a list of ServiceAccount objects
-->
ServiceAccountList 是 ServiceAccount 物件的列表

<hr>

- **apiVersion**: v1


- **kind**: ServiceAccountList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->
  標準列表元資料, 更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **items** ([]<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>), required
-->
- **items** ([]<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>), 必需

  <!--
  List of ServiceAccounts. More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
  -->
  ServiceAccount 列表，更多資訊： https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/configure-service-account/

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified ServiceAccount

#### HTTP Request
-->
### `get` 讀取指定的 ServiceAccount

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/serviceaccounts/{name}

<!--
#### Parameters
-->
#### 引數

<!--
- **name** (*in path*): string, required
-->
- **name** (**路徑引數**): string, 必需

  <!--
  name of the ServiceAccount
  -->
  ServiceAccount 的名稱

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑引數**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ServiceAccount

#### HTTP Request
-->
### `list` 列出或監控 ServiceAccount 型別的物件

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/serviceaccounts

<!--
#### Parameters
-->
#### 引數

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑引數**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查詢引數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


<!--
- **limit** (*in query*): integer
-->
- **limit** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查詢引數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應


200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccountList" >}}">ServiceAccountList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ServiceAccount

#### HTTP Request
-->
### `list` 列出或監控 ServiceAccount 型別的物件

#### HTTP 請求

GET /api/v1/serviceaccounts

<!--
#### Parameters
-->
#### 引數

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查詢引數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查詢引數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>


<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccountList" >}}">ServiceAccountList</a>): OK

401: Unauthorized

<!--
### `create` create a ServiceAccount

#### HTTP Request
-->
### `create` 建立一個 ServiceAccount

#### HTTP 請求

POST /api/v1/namespaces/{namespace}/serviceaccounts

<!--
#### Parameters
-->
#### 引數

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑引數**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>, required
-->
- **body**: <a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): OK

201 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): Created

202 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ServiceAccount

#### HTTP Request
-->
`update` 替換指定的ServiceAccount

#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/serviceaccounts/{name}

<!--
#### Parameters
-->
#### 引數

<!--
- **name** (*in path*): string, required
-->
- **name** (**路徑引數**): string, required

  name of the ServiceAccount


<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑引數**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>, required
-->
- **body**: <a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): OK

201 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ServiceAccount

#### HTTP Request
-->
`patch` 部分更新指定的 ServiceAccount

#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/serviceaccounts/{name}

<!--
#### Parameters
-->
#### 引數

<!--
- **name** (*in path*): string, required
-->
- **name** (**路徑引數**): string, 必需

  <!--
  name of the ServiceAccount
  -->
  ServiceAccount 的名稱

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑引數**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required


<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean
-->
- **force** (**查詢引數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response
-->
#### 響應


200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): OK

201 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): Created

401: Unauthorized

<!--
### `delete` delete a ServiceAccount

#### HTTP Request
-->
### `delete` 刪除一個 ServiceAccount
#### HTTP 請求


DELETE /api/v1/namespaces/{namespace}/serviceaccounts/{name}

<!--
#### Parameters
-->
#### 引數

<!--
- **name** (*in path*): string, required
-->
- **name** (**路徑引數**): string, 必需

  <!--
  name of the ServiceAccount
  -->
  ServiceAccount 的名稱


<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑引數**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>


<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): OK

202 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ServiceAccount

#### HTTP Request
-->
### `deletecollection` 刪除 ServiceAccount 的集合

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/serviceaccounts

<!--
#### Parameters
-->
#### 引數

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑引數**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查詢引數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查詢引數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
