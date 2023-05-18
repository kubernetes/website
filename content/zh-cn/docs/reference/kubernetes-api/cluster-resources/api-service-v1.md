---
api_metadata:
  apiVersion: "apiregistration.k8s.io/v1"
  import: "k8s.io/kube-aggregator/pkg/apis/apiregistration/v1"
  kind: "APIService"
content_type: "api_reference"
description: "APIService 是用来表示一个特定的 GroupVersion 的服务器"
title: "APIService"
weight: 4
---

<!--
api_metadata:
  apiVersion: "apiregistration.k8s.io/v1"
  import: "k8s.io/kube-aggregator/pkg/apis/apiregistration/v1"
  kind: "APIService"
content_type: "api_reference"
description: "APIService represents a server for a particular GroupVersion."
title: "APIService"
weight: 4
auto_generated: true
-->

`apiVersion: apiregistration.k8s.io/v1`

`import "k8s.io/kube-aggregator/pkg/apis/apiregistration/v1"`


## APIService {#APIService}

<!--
APIService represents a server for a particular GroupVersion. Name must be "version.group".
-->
APIService 是用来表示一个特定的 GroupVersion 的服务器。名称必须为 "version.group"。

<hr>

- **apiVersion**: apiregistration.k8s.io/v1

- **kind**: APIService

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的对象元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/api-service-v1#APIServiceSpec" >}}">APIServiceSpec</a>)
  <!--
  Spec contains information for locating and communicating with a server
  -->
  spec 包含用于定位和与服务器通信的信息

- **status** (<a href="{{< ref "../cluster-resources/api-service-v1#APIServiceStatus" >}}">APIServiceStatus</a>)
  <!--
  Status contains derived information about an API server
  -->
  status 包含某 API 服务器的派生信息


## APIServiceSpec {#APIServiceSpec}
<!--
APIServiceSpec contains information for locating and communicating with a server. Only https is supported, though you are able to disable certificate verification.
-->
APIServiceSpec 包含用于定位和与服务器通信的信息。仅支持 HTTPS 协议，但是你可以禁用证书验证。

<hr>

- **groupPriorityMinimum** (int32)， <!--required-->必需
  <!--
  GroupPriorityMininum is the priority this group should have at least. Higher priority means that the group is preferred by clients over lower priority ones. Note that other versions of this group might specify even higher GroupPriorityMininum values such that the whole group gets a higher priority. The primary sort is based on GroupPriorityMinimum, ordered highest number to lowest (20 before 10). The secondary sort is based on the alphabetical comparison of the name of the object.  (v1.bar before v1.foo) We'd recommend something like: *.k8s.io (except extensions) at 18000 and PaaSes (OpenShift, Deis) are recommended to be in the 2000s
  -->
  groupPriorityMininum 是这个组至少应该具有的优先级。优先级高表示客户端优先选择该组。
  请注意，该组的其他版本可能会指定更高的 groupPriorityMininum 值，使得整个组获得更高的优先级。
  主排序基于 groupPriorityMinimum 值，从高到低排序（20 在 10 之前）。
  次要排序基于对象名称的字母顺序（v1.bar 在 v1.foo 之前）。
  我们建议这样配置：`*.k8s.io`（扩展除外）值设置为 18000，PaaS（OpenShift、Deis）建议值为 2000 左右。

- **versionPriority** (int32)， <!--required-->必需
  <!--
  VersionPriority controls the ordering of this API version inside of its group.  Must be greater than zero. The primary sort is based on VersionPriority, ordered highest to lowest (20 before 10). Since it's inside of a group, the number can be small, probably in the 10s. In case of equal version priorities, the version string will be used to compute the order inside a group. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10.
  -->
  versionPriority 控制该 API 版本在其组中的排序，必须大于零。主排序基于 versionPriority，
  从高到低排序（20 在 10 之前）。因为在同一个组里，这个数字可以很小，可能是几十。
  在版本优先级相等的情况下，版本字符串将被用来计算组内的顺序。如果版本字符串是与 Kubernetes 的版本号形式类似，
  则它将排序在 Kubernetes 形式版本字符串之前。Kubernetes 的版本号字符串按字典顺序排列。
  Kubernetes 版本号以 “v” 字符开头，后面是一个数字（主版本），然后是可选字符串 “alpha” 或 “beta” 和另一个数字（次要版本）。
  它们首先按 GA > beta > alpha 排序（其中 GA 是没有 beta 或 alpha 等后缀的版本），然后比较主要版本，
  最后是比较次要版本。版本排序列表示例：v10、v2、v1、v11beta2、v10beta3、v3beta1、v12alpha1、v11alpha2、foo1、foo10。

- **caBundle** ([]byte)
  <!--
  *Atomic: will be replaced during a merge*
  
  CABundle is a PEM encoded CA bundle which will be used to validate an API server's serving certificate. If unspecified, system trust roots on the apiserver are used.
  -->
  **原子性：将在合并期间被替换**

  caBundle 是一个 PEM 编码的 CA 包，用于验证 API 服务器的服务证书。如果未指定，
  则使用 API 服务器上的系统根证书。

- **group** (string)
  <!--
  Group is the API group name this server hosts
  -->
  group 是此服务器主机的 API 组名称。

- **insecureSkipTLSVerify** (boolean)
  <!--
  InsecureSkipTLSVerify disables TLS certificate verification when communicating with this server. This is strongly discouraged.  You should use the CABundle instead.
  -->
  insecureSkipTLSVerify 代表在与此服务器通信时禁用 TLS 证书验证。强烈建议不要这样做。你应该使用 caBundle。  

- **service** (ServiceReference)
  <!--
  Service is a reference to the service for this API server.  It must communicate on port 443. If the Service is nil, that means the handling for the API groupversion is handled locally on this server. The call will simply delegate to the normal handler chain to be fulfilled.
  -->
  service 是对该 API 服务器的服务的引用。它只能在端口 443 上通信。如果 service 是 nil，
  则意味着 API groupversion 的处理是在当前服务器上本地处理的。服务调用被直接委托给正常的处理程序链来完成。

  <a name="ServiceReference"></a>
  <!--
  *ServiceReference holds a reference to Service.legacy.k8s.io*
  -->
  **ServiceReference 保存对 Service.legacy.k8s.io 的一个引用。**

  - **service.name** (string)
    <!--
    Name is the name of the service
    -->
    name 是服务的名称
  
  - **service.namespace** (string)
    <!--
    namespace is the namespace of the service
    -->
    namespace 是服务的命名空间
  
  - **service.port** (int32)
    <!--
    If specified, the port on the service that hosting webhook. Default to 443 for backward compatibility. `port` should be a valid port number (1-65535, inclusive).
    -->
    如果指定，则为托管 Webhook 的服务上的端口。为实现向后兼容，默认端口号为 443。
    `port` 应该是一个有效的端口号（1-65535，包含）。

- **version** (string)
  <!--
  Version is the API version this server hosts.  For example, "v1"
  -->
  version 是此服务器的 API 版本。例如：“v1”。

## APIServiceStatus {#APIServiceStatus}

<!--
APIServiceStatus contains derived information about an API server
-->
APIServiceStatus 包含有关 API 服务器的派生信息

<hr>

- **conditions** ([]APIServiceCondition)
  <!--
  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  Current service state of apiService.
  -->
  **补丁策略：基于键 `type` 合并**

  **Map：合并时将保留 type 键的唯一值**

  APIService 的当前服务状态。

  <a name="APIServiceCondition"></a>
  <!--
  *APIServiceCondition describes the state of an APIService at a particular point*
  -->
  **APIServiceCondition 描述 APIService 在特定点的状态** 

  - **conditions.status** (string)， <!--required-->必需
    <!--
    Status is the status of the condition. Can be True, False, Unknown.
    -->
    status 表示状况（Condition）的状态，取值为 True、False 或 Unknown 之一。
  
  - **conditions.type** (string)， <!--required-->必需
    <!--
    Type is the type of the condition.
    -->
    type 是状况的类型。

  - **conditions.lastTransitionTime** (Time)
    <!--
    Last time the condition transitioned from one status to another.
    -->
    上一次发生状况状态转换的时间。
  
    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->
    Time 是对 time.Time 的封装。Time 支持对 YAML 和 JSON 进行正确封包。为 time 包的许多函数方法提供了封装器。
  
  - **conditions.message** (string)
    <!--
    Human-readable message indicating details about last transition.
    -->
    指示上次转换的详细可读信息。  
  
  - **conditions.reason** (string)
    <!--
    Unique, one-word, CamelCase reason for the condition's last transition.
    -->
    表述状况上次转换原因的、驼峰格式命名的、唯一的一个词。
  

## APIServiceList {#APIServiceList}
<!--
APIServiceList is a list of APIService objects.
-->
APIServiceList 是 APIService 对象的列表。

<hr>

- **apiVersion**: apiregistration.k8s.io/v1

- **kind**: APIServiceList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  <!--
  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的列表元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>)， <!--required-->必需
  <!--
  Items is the list of APIService
  -->
  items 是 APIService 的列表


## Operations {#Operations}

<hr>

<!--
### `get` read the specified APIService

#### HTTP Request
-->
### `get` 读取指定的 APIService

#### HTTP 请求

GET /apis/apiregistration.k8s.io/v1/apiservices/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the APIService


- **pretty** (*in query*): string
-->
#### 参数

- **name** （**路径参数**）：string，必需

  APIService 名称

- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified APIService

#### HTTP Request
-->
### `get` 读取指定 APIService 的状态

#### HTTP 请求

GET /apis/apiregistration.k8s.io/v1/apiservices/{name}/status

<!--
#### Parameters


- **name** (*in path*): string, required

  name of the APIService


- **pretty** (*in query*): string
-->
#### 参数

- **name** （**路径参数**）：string，必需

  APIService 名称

- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind APIService

#### HTTP Request
-->
### `list` 列出或观察 APIService 类的对象

#### HTTP 请求

GET /apis/apiregistration.k8s.io/v1/apiservices

<!--
#### Parameters


- **allowWatchBookmarks** (*in query*): boolean
-->
#### 参数

- **allowWatchBookmarks** （**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*):-->（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*):-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*):-->（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** <!--(*in query*):-->（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIServiceList" >}}">APIServiceList</a>): OK

401: Unauthorized

<!--
### `create` create an APIService

#### HTTP Request
-->
### `create` 创建一个 APIService

#### HTTP 请求

POST /apis/apiregistration.k8s.io/v1/apiservices

<!--
#### Parameters
-->
#### 参数

- **body**：<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>， <!--required-->必需

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

202 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified APIService

#### HTTP Request
-->
### `update` 替换指定的 APIService

#### HTTP 请求

PUT /apis/apiregistration.k8s.io/v1/apiservices/{name}

<!--
#### Parameters
-->
#### 参数

- **name** <!-- (*in path*): -->（**路径参数**）：string， <!--required-->必需
  <!--
  name of the APIService
  -->
  APIService 名称

- **body**：<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>， <!--required-->必需

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified APIService

#### HTTP Request
-->
### `update` 替换指定 APIService 的 status

#### HTTP 请求

PUT /apis/apiregistration.k8s.io/v1/apiservices/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the APIService
-->
#### 参数
- **name**（**路径参数**）：string， 必需

  APIService 名称

- **body**：<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>， <!--required-->必需

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified APIService

#### HTTP Request
-->
### `patch` 部分更新指定的 APIService

#### HTTP 请求

PATCH /apis/apiregistration.k8s.io/v1/apiservices/{name}

<!--
#### Parameters


- **name** (*in path*): string, required

  name of the APIService
-->
#### 参数

- **name**（**路径参数**）：string， 必需

  APIService 名称

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>， <!--required-->必需

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** <!--(*in query*):-->（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified APIService

#### HTTP Request
-->
### `patch` 部分更新指定 APIService 的 status

#### HTTP 请求

PATCH /apis/apiregistration.k8s.io/v1/apiservices/{name}/status

<!--
#### Parameters


- **name** (*in path*): string, required

  name of the APIService
-->
#### 参数

- **name**（**路径参数**）：string， 必需

  APIService 名称

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>， <!--required-->必需

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** <!--(*in query*):-->（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

401: Unauthorized

<!--
### `delete` delete an APIService

#### HTTP Request
-->
### `delete` 删除一个 APIService

#### HTTP 请求

DELETE /apis/apiregistration.k8s.io/v1/apiservices/{name}

<!--
#### Parameters


- **name** (*in path*): string, required

  name of the APIService
-->
#### 参数

- **name**（**路径参数**）：string， 必需

  APIService 名称

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** <!--(*in query*):-->（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of APIService

#### HTTP Request
-->
### `deletecollection` 删除 APIService 集合

#### HTTP 请求

DELETE /apis/apiregistration.k8s.io/v1/apiservices

<!--
#### Parameters
-->
#### 参数

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** <!--(*in query*):-->（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*):-->（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*):-->（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*):-->（**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*):-->（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
