---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "ServiceCIDR"
content_type: "api_reference"
description: "ServiceCIDR 使用 CIDR 格式定義 IP 地址的範圍"
title: "ServiceCIDR"
weight: 10
---
<!--
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "ServiceCIDR"
content_type: "api_reference"
description: "ServiceCIDR defines a range of IP addresses using CIDR format (e."
title: "ServiceCIDR"
weight: 10
auto_generated: true
-->

`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`

## ServiceCIDR {#ServiceCIDR}

<!--
ServiceCIDR defines a range of IP addresses using CIDR format (e.g. 192.168.0.0/24 or 2001:db2::/64). This range is used to allocate ClusterIPs to Service objects.
-->
ServiceCIDR 使用 CIDR 格式定義 IP 地址的範圍（例如 192.168.0.0/24 或 2001:db2::/64）。
此範圍用於向 Service 對象分配 ClusterIP。

<hr>

- **apiVersion**: networking.k8s.io/v1

- **kind**: ServiceCIDR

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDRSpec" >}}">ServiceCIDRSpec</a>)

  spec is the desired state of the ServiceCIDR. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDRStatus" >}}">ServiceCIDRStatus</a>)

  status represents the current state of the ServiceCIDR. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDRSpec" >}}">ServiceCIDRSpec</a>)

  spec 是 ServiceCIDR 的期望狀態。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDRStatus" >}}">ServiceCIDRStatus</a>)

  status 表示 ServiceCIDR 的當前狀態。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## ServiceCIDRSpec {#ServiceCIDRSpec}

<!--
ServiceCIDRSpec define the CIDRs the user wants to use for allocating ClusterIPs for Services.
-->
ServiceCIDRSpec 定義使用者想要爲 Service 分配 ClusterIP 所用的 CIDR。

<hr>

<!--
- **cidrs** ([]string)

  *Atomic: will be replaced during a merge*
  
  CIDRs defines the IP blocks in CIDR notation (e.g. "192.168.0.0/24" or "2001:db8::/64") from which to assign service cluster IPs. Max of two CIDRs is allowed, one of each IP family. This field is immutable.
-->
- **cidrs** ([]string)

  **原子：將在合併期間被替換**
  
  cidrs 以 CIDR 表示法定義 IP 塊（例如 "192.168.0.0/24" 或 "2001:db8::/64"），
  從此 IP 塊中爲 Service 分配叢集 IP。允許最多兩個 CIDR，每個 IP 簇一個 CIDR。此字段是不可變更的。

## ServiceCIDRStatus {#ServiceCIDRStatus}

<!--
ServiceCIDRStatus describes the current state of the ServiceCIDR.
-->
ServiceCIDRStatus 描述 ServiceCIDR 的當前狀態。

<hr>

<!--
- **conditions** ([]Condition)

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  conditions holds an array of metav1.Condition that describe the state of the ServiceCIDR. Current service state

  <a name="Condition"></a>
  *Condition contains details for one aspect of the current state of this API Resource.*
-->
- **conditions** ([]Condition)

  **補丁策略：基於鍵 `type` 合併**
  
  **Map：合併時將保留 type 鍵的唯一值**
  
  conditions 包含一個 metav1.Condition 數組，描述 ServiceCIDR 的狀態。

  <a name="Condition"></a>
  **condition 包含此 API 資源某一方面當前狀態的詳細資訊。**

  <!--
  - **conditions.lastTransitionTime** (Time), required

    lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)，必需

    lastTransitionTime 是狀況最近一次狀態轉化的時間。
    變化應該發生在下層狀況發生變化的時候。如果不知道下層狀況發生變化的時間，
    那麼使用 API 字段更改的時間是可以接受的。

    <a name="Time"></a>
    **Time 是 time.Time 的包裝類，支持正確地序列化爲 YAML 和 JSON。
    爲 time 包提供的許多工廠方法提供了包裝類。**

  <!--
  - **conditions.message** (string), required

    message is a human readable message indicating details about the transition. This may be an empty string.

  - **conditions.reason** (string), required

    reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.
  -->

  - **conditions.message** (string)，必需

    message 是人類可讀的消息，有關轉換的詳細資訊，可以是空字符串。

  - **conditions.reason** (string)，必需

    reason 包含一個程式標識符，指示 condition 最後一次轉換的原因。
    特定狀況類型的生產者可以定義該字段的預期值和含義，以及這些值是否被視爲有保證的 API。
    此值應該是 CamelCase 字符串且不能爲空。

  <!--
  - **conditions.status** (string), required

    status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    type of condition in CamelCase or in foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.
  -->

  - **conditions.status** (string)，必需

    condition 的狀態，可選值爲 True、False、Unknown 之一。

  - **conditions.type** (string)，必需

    CamelCase 或 foo.example.com/CamelCase 中的條件類型。

  - **conditions.observedGeneration** (int64)

    observedGeneration 表示設置 condition 基於的 .metadata.generation 的過期次數。
    例如，如果 .metadata.generation 當前爲 12，但 .status.conditions[x].observedGeneration 爲 9，
    則 condition 相對於實例的當前狀態已過期。

## ServiceCIDRList {#ServiceCIDRList}

<!--
ServiceCIDRList contains a list of ServiceCIDR objects.
-->
ServiceCIDRList 包含 ServiceCIDR 對象的列表。

<hr>

- **apiVersion**: networking.k8s.io/v1

- **kind**: ServiceCIDRList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>), required

  items is the list of ServiceCIDRs.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的對象元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>)，必需

  items 是 ServiceCIDR 的列表。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified ServiceCIDR

#### HTTP Request
-->
### `get` 讀取指定的 ServiceCIDR

#### HTTP

GET /apis/networking.k8s.io/v1/servicecidrs/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ServiceCIDR

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ServiceCIDR 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified ServiceCIDR

#### HTTP Request
-->
### `get` 讀取指定的 ServiceCIDR 的狀態

#### HTTP 請求

GET /apis/networking.k8s.io/v1/servicecidrs/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ServiceCIDR

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ServiceCIDR 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ServiceCIDR

#### HTTP Request
-->
### `list` 列舉或監視 ServiceCIDR 類別的對象

#### HTTP 請求

GET /apis/networking.k8s.io/v1/servicecidrs

<!--
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 參數

- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDRList" >}}">ServiceCIDRList</a>): OK

401: Unauthorized

<!--
### `create` create a ServiceCIDR

#### HTTP Request
-->
### `create` 創建 ServiceCIDR

#### HTTP 請求

POST /apis/networking.k8s.io/v1/servicecidrs

<!--
#### Parameters

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>, required

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

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>，必需

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

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

202 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ServiceCIDR

#### HTTP Request
-->
### `update` 替換指定的 ServiceCIDR

#### HTTP 請求

PUT /apis/networking.k8s.io/v1/servicecidrs/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ServiceCIDR

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>, required

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

- **name** (**路徑參數**): string，必需

  ServiceCIDR 的名稱。

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>，必需

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

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified ServiceCIDR

#### HTTP Request
-->
### `update` 替換指定的 ServiceCIDR 的狀態

#### HTTP 請求

PUT /apis/networking.k8s.io/v1/servicecidrs/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ServiceCIDR

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>, required

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

- **name** (**路徑參數**): string，必需

  ServiceCIDR 的名稱。

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>，必需

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

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ServiceCIDR

#### HTTP Request
-->
### `patch` 部分更新指定的 ServiceCIDR

#### HTTP 請求

PATCH /apis/networking.k8s.io/v1/servicecidrs/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ServiceCIDR

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ServiceCIDR 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified ServiceCIDR

#### HTTP Request
-->
### `patch` 部分更新指定的 ServiceCIDR 的狀態

#### HTTP 請求

PATCH /apis/networking.k8s.io/v1/servicecidrs/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ServiceCIDR

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ServiceCIDR 的名稱。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized

<!--
### `delete` delete a ServiceCIDR

#### HTTP Request
-->
### `delete` 刪除 ServiceCIDR

#### HTTP 請求

DELETE /apis/networking.k8s.io/v1/servicecidrs/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ServiceCIDR

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ServiceCIDR 的名稱。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ServiceCIDR

#### HTTP Request
-->
### `deletecollection` 刪除 ServiceCIDR 的集合

#### HTTP 請求

DELETE /apis/networking.k8s.io/v1/servicecidrs

<!--
#### Parameters

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
#### 參數

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
