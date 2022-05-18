---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ServiceAccount"
content_type: "api_reference"
description: "ServiceAccount 将以下内容绑定在一起：1. 用户可以理解的名称，也可能是外围系统理解的身份标识 2. 可以验证和授权的主体 3. 一组 secret 。"
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
ServiceAccount 将以下内容绑定在一起：
* 用户可以理解的名称，也可能是外围系统理解的身份标识
* 可以验证和授权的主体
* 一组 secret

<hr>

- **apiVersion**: v1


- **kind**: ServiceAccount


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准对象的元数据，更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **automountServiceAccountToken** (boolean)

  <!--
  AutomountServiceAccountToken indicates whether pods running as this service account should have an API token automatically mounted. Can be overridden at the pod level.
  -->
  AutomountServiceAccountToken 指示作为此服务帐户运行的 pod 是否应自动挂载 API 令牌，
  可以在 pod 级别覆盖。

- **imagePullSecrets** ([]<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

  <!--
  ImagePullSecrets is a list of references to secrets in the same namespace to use for pulling any images in pods that reference this ServiceAccount. ImagePullSecrets are distinct from Secrets because Secrets can be mounted in the pod, but ImagePullSecrets are only accessed by the kubelet. More info: https://kubernetes.io/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod
  -->
  imagePullSecrets 是对同一命名空间中 Secret 的引用列表，用于拉取引用此 ServiceAccount 的 Pod 中的任何镜像。 
  imagePullSecrets 与 Secrets 不同，因为 Secrets 可以挂载在 Pod 中，但 imagePullSecrets 只能由 kubelet 访问。 
  更多信息：https://kubernetes.io/zh/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod

- **secrets** ([]<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)
  
  <!--
  *Patch strategy: merge on key `name`*
  
  Secrets is the list of secrets allowed to be used by pods running using this ServiceAccount. More info: https://kubernetes.io/docs/concepts/configuration/secret
  -->
  **补丁策略：基于键 `name` 合并**
  Secrets 是允许使用此 ServiceAccount 运行的 Pod 使用的 Secret 列表。 
  更多信息：https://kubernetes.io/zh/docs/concepts/configuration/secret

## ServiceAccountList {#ServiceAccountList}

<!--
ServiceAccountList is a list of ServiceAccount objects
-->
ServiceAccountList 是 ServiceAccount 对象的列表

<hr>

- **apiVersion**: v1


- **kind**: ServiceAccountList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  
  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->
  标准列表元数据, 更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--  
- **items** ([]<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>), required
-->
- **items** ([]<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>), 必需

  <!--
  List of ServiceAccounts. More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
  -->
  ServiceAccount 列表，更多信息：https://kubernetes.io/zh/docs/tasks/configure-pod-container/configure-service-account/

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified ServiceAccount

#### HTTP Request
-->
### `get` 读取指定的 ServiceAccount

#### HTTP 请求

GET /api/v1/namespaces/{namespace}/serviceaccounts/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required
-->
- **name** (**位于路径中**): string, 必需

  <!--
  name of the ServiceAccount
  -->
  ServiceAccount 的名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**位于路径中**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ServiceAccount

#### HTTP Request
-->
### `list` 列出或监控 ServiceAccount 类型的对象

#### HTTP 请求

GET /api/v1/namespaces/{namespace}/serviceaccounts

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**位于路径中**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查询字符串**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


<!--
- **limit** (*in query*): integer
-->
- **limit** (*查询字符串*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查询字符串**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查询字符串**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应


200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccountList" >}}">ServiceAccountList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ServiceAccount

#### HTTP Request
-->
### `list` 列出或监控 ServiceAccount 类型的对象

#### HTTP 请求

GET /api/v1/serviceaccounts

<!--
#### Parameters
-->
#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查询字符串**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查询字符串**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查询字符串**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查询字符串**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>


<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccountList" >}}">ServiceAccountList</a>): OK

401: Unauthorized

<!--
### `create` create a ServiceAccount

#### HTTP Request
-->
### `create` 创建一个 ServiceAccount

#### HTTP 请求

POST /api/v1/namespaces/{namespace}/serviceaccounts

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**位于路径中**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>, required
-->
- **body**: <a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): OK

201 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): Created

202 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ServiceAccount

#### HTTP Request
-->
`update` 替换指定的ServiceAccount

#### HTTP 请求

PUT /api/v1/namespaces/{namespace}/serviceaccounts/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required
-->
- **name** (**位于路径中**): string, required

  name of the ServiceAccount


<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**位于路径中**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>, required
-->
- **body**: <a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>，必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): OK

201 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ServiceAccount

#### HTTP Request
-->
`patch` 部分更新指定的 ServiceAccount

#### HTTP 请求

PATCH /api/v1/namespaces/{namespace}/serviceaccounts/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required
-->
- **name** (**位于路径中**): string, 必需

  <!--
  name of the ServiceAccount
  -->
  ServiceAccount 的名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**位于路径中**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required


<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean
-->
- **force** (**查询字符串**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response
-->
#### 响应


200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): OK

201 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): Created

401: Unauthorized

<!--
### `delete` delete a ServiceAccount

#### HTTP Request
-->
### `delete` 删除一个 ServiceAccount
#### HTTP 请求


DELETE /api/v1/namespaces/{namespace}/serviceaccounts/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required
-->
- **name** (**位于路径中**): string, 必需

  <!--
  name of the ServiceAccount
  -->
  ServiceAccount 的名称


<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**位于路径中**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** (*查询字符串*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>


<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): OK

202 (<a href="{{< ref "../authentication-resources/service-account-v1#ServiceAccount" >}}">ServiceAccount</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ServiceAccount

#### HTTP Request
-->
### `deletecollection` 删除 ServiceAccount 的集合

#### HTTP 请求

DELETE /api/v1/namespaces/{namespace}/serviceaccounts

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**位于路径中**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** (*查询字符串*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (*查询字符串*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (*查询字符串*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查询字符串**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查询字符串**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

