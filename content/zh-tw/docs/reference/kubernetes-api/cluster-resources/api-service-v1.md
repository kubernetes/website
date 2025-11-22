---
api_metadata:
  apiVersion: "apiregistration.k8s.io/v1"
  import: "k8s.io/kube-aggregator/pkg/apis/apiregistration/v1"
  kind: "APIService"
content_type: "api_reference"
description: "APIService 是用來表示一個特定的 GroupVersion 的伺服器"
title: "APIService"
weight: 1
---

<!--
api_metadata:
  apiVersion: "apiregistration.k8s.io/v1"
  import: "k8s.io/kube-aggregator/pkg/apis/apiregistration/v1"
  kind: "APIService"
content_type: "api_reference"
description: "APIService represents a server for a particular GroupVersion."
title: "APIService"
weight: 1
auto_generated: true
-->

`apiVersion: apiregistration.k8s.io/v1`

`import "k8s.io/kube-aggregator/pkg/apis/apiregistration/v1"`


## APIService {#APIService}

<!--
APIService represents a server for a particular GroupVersion. Name must be "version.group".
-->
APIService 是用來表示一個特定的 GroupVersion 的伺服器。名稱必須爲 "version.group"。

<hr>

- **apiVersion**: apiregistration.k8s.io/v1

- **kind**: APIService

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的對象元資料。更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/api-service-v1#APIServiceSpec" >}}">APIServiceSpec</a>)
  <!--
  Spec contains information for locating and communicating with a server
  -->
  spec 包含用於定位和與伺服器通信的資訊

- **status** (<a href="{{< ref "../cluster-resources/api-service-v1#APIServiceStatus" >}}">APIServiceStatus</a>)
  <!--
  Status contains derived information about an API server
  -->
  status 包含某 API 伺服器的派生資訊


## APIServiceSpec {#APIServiceSpec}
<!--
APIServiceSpec contains information for locating and communicating with a server. Only https is supported, though you are able to disable certificate verification.
-->
APIServiceSpec 包含用於定位和與伺服器通信的資訊。僅支持 HTTPS 協議，但是你可以禁用證書驗證。

<hr>

- **groupPriorityMinimum** (int32)， <!--required-->必需
  <!--
  GroupPriorityMinimum is the priority this group should have at least. Higher priority means that the group is preferred by clients over lower priority ones. Note that other versions of this group might specify even higher GroupPriorityMinimum values such that the whole group gets a higher priority. The primary sort is based on GroupPriorityMinimum, ordered highest number to lowest (20 before 10). The secondary sort is based on the alphabetical comparison of the name of the object.  (v1.bar before v1.foo) We'd recommend something like: *.k8s.io (except extensions) at 18000 and PaaSes (OpenShift, Deis) are recommended to be in the 2000s
  -->
  groupPriorityMinimum 是這個組至少應該具有的優先級。優先級高表示客戶端優先選擇該組。
  請注意，該組的其他版本可能會指定更高的 groupPriorityMinimum 值，使得整個組獲得更高的優先級。
  主排序基於 groupPriorityMinimum 值，從高到低排序（20 在 10 之前）。
  次要排序基於對象名稱的字母順序（v1.bar 在 v1.foo 之前）。
  我們建議這樣設定：`*.k8s.io`（擴展除外）值設置爲 18000，PaaS（OpenShift、Deis）建議值爲 2000 左右。

- **versionPriority** (int32)， <!--required-->必需
  <!--
  VersionPriority controls the ordering of this API version inside of its group.  Must be greater than zero. The primary sort is based on VersionPriority, ordered highest to lowest (20 before 10). Since it's inside of a group, the number can be small, probably in the 10s. In case of equal version priorities, the version string will be used to compute the order inside a group. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10.
  -->
  versionPriority 控制該 API 版本在其組中的排序，必須大於零。主排序基於 versionPriority，
  從高到低排序（20 在 10 之前）。因爲在同一個組裏，這個數字可以很小，可能是幾十。
  在版本優先級相等的情況下，版本字符串將被用來計算組內的順序。如果版本字符串是與 Kubernetes 的版本號形式類似，
  則它將排序在 Kubernetes 形式版本字符串之前。Kubernetes 的版本號字符串按字典順序排列。
  Kubernetes 版本號以 “v” 字符開頭，後面是一個數字（主版本），然後是可選字符串 “alpha” 或 “beta” 和另一個數字（次要版本）。
  它們首先按 GA > beta > alpha 排序（其中 GA 是沒有 beta 或 alpha 等後綴的版本），然後比較主要版本，
  最後是比較次要版本。版本排序列表示例：v10、v2、v1、v11beta2、v10beta3、v3beta1、v12alpha1、v11alpha2、foo1、foo10。

- **caBundle** ([]byte)
  <!--
  *Atomic: will be replaced during a merge*
  
  CABundle is a PEM encoded CA bundle which will be used to validate an API server's serving certificate. If unspecified, system trust roots on the apiserver are used.
  -->
  **原子性：將在合併期間被替換**

  caBundle 是一個 PEM 編碼的 CA 包，用於驗證 API 伺服器的服務證書。如果未指定，
  則使用 API 伺服器上的系統根證書。

- **group** (string)
  <!--
  Group is the API group name this server hosts
  -->
  group 是此伺服器主機的 API 組名稱。

- **insecureSkipTLSVerify** (boolean)
  <!--
  InsecureSkipTLSVerify disables TLS certificate verification when communicating with this server. This is strongly discouraged.  You should use the CABundle instead.
  -->
  insecureSkipTLSVerify 代表在與此伺服器通信時禁用 TLS 證書驗證。強烈建議不要這樣做。你應該使用 caBundle。  

- **service** (ServiceReference)
  <!--
  Service is a reference to the service for this API server.  It must communicate on port 443. If the Service is nil, that means the handling for the API groupversion is handled locally on this server. The call will simply delegate to the normal handler chain to be fulfilled.
  -->
  service 是對該 API 伺服器的服務的引用。它只能在端口 443 上通信。如果 service 是 nil，
  則意味着 API groupversion 的處理是在當前伺服器上本地處理的。服務調用被直接委託給正常的處理程式鏈來完成。

  <a name="ServiceReference"></a>
  <!--
  *ServiceReference holds a reference to Service.legacy.k8s.io*
  -->
  **ServiceReference 保存對 Service.legacy.k8s.io 的一個引用。**

  - **service.name** (string)
    <!--
    Name is the name of the service
    -->
    name 是服務的名稱
  
  - **service.namespace** (string)
    <!--
    namespace is the namespace of the service
    -->
    namespace 是服務的命名空間
  
  - **service.port** (int32)
    <!--
    If specified, the port on the service that hosting webhook. Default to 443 for backward compatibility. `port` should be a valid port number (1-65535, inclusive).
    -->
    如果指定，則爲託管 Webhook 的服務上的端口。爲實現向後兼容，預設端口號爲 443。
    `port` 應該是一個有效的端口號（1-65535，包含）。

- **version** (string)
  <!--
  Version is the API version this server hosts.  For example, "v1"
  -->
  version 是此伺服器的 API 版本。例如：“v1”。

## APIServiceStatus {#APIServiceStatus}

<!--
APIServiceStatus contains derived information about an API server
-->
APIServiceStatus 包含有關 API 伺服器的派生資訊

<hr>

- **conditions** ([]APIServiceCondition)
  <!--
  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  Current service state of apiService.
  -->
  **補丁策略：基於鍵 `type` 合併**

  **Map：合併時將保留 type 鍵的唯一值**

  APIService 的當前服務狀態。

  <a name="APIServiceCondition"></a>
  <!--
  *APIServiceCondition describes the state of an APIService at a particular point*
  -->
  **APIServiceCondition 描述 APIService 在特定點的狀態** 

  - **conditions.status** (string)， <!--required-->必需
    <!--
    Status is the status of the condition. Can be True, False, Unknown.
    -->
    status 表示狀況（Condition）的狀態，取值爲 True、False 或 Unknown 之一。
  
  - **conditions.type** (string)， <!--required-->必需
    <!--
    Type is the type of the condition.
    -->
    type 是狀況的類型。

  - **conditions.lastTransitionTime** (Time)
    <!--
    Last time the condition transitioned from one status to another.
    -->
    上一次發生狀況狀態轉換的時間。
  
    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->
    Time 是對 time.Time 的封裝。Time 支持對 YAML 和 JSON 進行正確封包。爲 time 包的許多函數方法提供了封裝器。
  
  - **conditions.message** (string)
    <!--
    Human-readable message indicating details about last transition.
    -->
    指示上次轉換的詳細可讀資訊。  
  
  - **conditions.reason** (string)
    <!--
    Unique, one-word, CamelCase reason for the condition's last transition.
    -->
    表述狀況上次轉換原因的、駝峯格式命名的、唯一的一個詞。
  

## APIServiceList {#APIServiceList}
<!--
APIServiceList is a list of APIService objects.
-->
APIServiceList 是 APIService 對象的列表。

<hr>

- **apiVersion**: apiregistration.k8s.io/v1

- **kind**: APIServiceList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  <!--
  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的列表元資料。更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

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
### `get` 讀取指定的 APIService

#### HTTP 請求

GET /apis/apiregistration.k8s.io/v1/apiservices/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the APIService


- **pretty** (*in query*): string
-->
#### 參數

- **name** （**路徑參數**）：string，必需

  APIService 名稱

- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified APIService

#### HTTP Request
-->
### `get` 讀取指定 APIService 的狀態

#### HTTP 請求

GET /apis/apiregistration.k8s.io/v1/apiservices/{name}/status

<!--
#### Parameters


- **name** (*in path*): string, required

  name of the APIService


- **pretty** (*in query*): string
-->
#### 參數

- **name** （**路徑參數**）：string，必需

  APIService 名稱

- **pretty** （**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind APIService

#### HTTP Request
-->
### `list` 列出或觀察 APIService 類的對象

#### HTTP 請求

GET /apis/apiregistration.k8s.io/v1/apiservices

<!--
#### Parameters


- **allowWatchBookmarks** (*in query*): boolean
-->
#### 參數

- **allowWatchBookmarks** （**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*):-->（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*):-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*):-->（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** <!--(*in query*):-->（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIServiceList" >}}">APIServiceList</a>): OK

401: Unauthorized

<!--
### `create` create an APIService

#### HTTP Request
-->
### `create` 創建一個 APIService

#### HTTP 請求

POST /apis/apiregistration.k8s.io/v1/apiservices

<!--
#### Parameters
-->
#### 參數

- **body**：<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>， <!--required-->必需

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

202 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified APIService

#### HTTP Request
-->
### `update` 替換指定的 APIService

#### HTTP 請求

PUT /apis/apiregistration.k8s.io/v1/apiservices/{name}

<!--
#### Parameters
-->
#### 參數

- **name** <!-- (*in path*): -->（**路徑參數**）：string， <!--required-->必需
  <!--
  name of the APIService
  -->
  APIService 名稱

- **body**：<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>， <!--required-->必需

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified APIService

#### HTTP Request
-->
### `update` 替換指定 APIService 的 status

#### HTTP 請求

PUT /apis/apiregistration.k8s.io/v1/apiservices/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the APIService
-->
#### 參數
- **name**（**路徑參數**）：string， 必需

  APIService 名稱

- **body**：<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>， <!--required-->必需

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified APIService

#### HTTP Request
-->
### `patch` 部分更新指定的 APIService

#### HTTP 請求

PATCH /apis/apiregistration.k8s.io/v1/apiservices/{name}

<!--
#### Parameters


- **name** (*in path*): string, required

  name of the APIService
-->
#### 參數

- **name**（**路徑參數**）：string， 必需

  APIService 名稱

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>， <!--required-->必需

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** <!--(*in query*):-->（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified APIService

#### HTTP Request
-->
### `patch` 部分更新指定 APIService 的 status

#### HTTP 請求

PATCH /apis/apiregistration.k8s.io/v1/apiservices/{name}/status

<!--
#### Parameters


- **name** (*in path*): string, required

  name of the APIService
-->
#### 參數

- **name**（**路徑參數**）：string， 必需

  APIService 名稱

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>， <!--required-->必需

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** <!--(*in query*):-->（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): OK

201 (<a href="{{< ref "../cluster-resources/api-service-v1#APIService" >}}">APIService</a>): Created

401: Unauthorized

<!--
### `delete` delete an APIService

#### HTTP Request
-->
### `delete` 刪除一個 APIService

#### HTTP 請求

DELETE /apis/apiregistration.k8s.io/v1/apiservices/{name}

<!--
#### Parameters


- **name** (*in path*): string, required

  name of the APIService
-->
#### 參數

- **name**（**路徑參數**）：string， 必需

  APIService 名稱

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** <!--(*in query*):-->（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of APIService

#### HTTP Request
-->
### `deletecollection` 刪除 APIService 集合

#### HTTP 請求

DELETE /apis/apiregistration.k8s.io/v1/apiservices

<!--
#### Parameters
-->
#### 參數

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** <!--(*in query*):-->（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** <!--(*in query*):-->（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** <!--(*in query*):-->（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** <!--(*in query*):-->（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** <!--(*in query*):-->（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
