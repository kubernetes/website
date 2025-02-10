---
api_metadata:
  apiVersion: "networking.k8s.io/v1beta1"
  import: "k8s.io/api/networking/v1beta1"
  kind: "ServiceCIDR"
content_type: "api_reference"
description: "ServiceCIDR 使用 CIDR 格式定义 IP 地址的范围"
title: "ServiceCIDR v1beta1"
weight: 10
---
<!--
api_metadata:
  apiVersion: "networking.k8s.io/v1beta1"
  import: "k8s.io/api/networking/v1beta1"
  kind: "ServiceCIDR"
content_type: "api_reference"
description: "ServiceCIDR defines a range of IP addresses using CIDR format (e."
title: "ServiceCIDR v1beta1"
weight: 10
auto_generated: true
-->

`apiVersion: networking.k8s.io/v1beta1`

`import "k8s.io/api/networking/v1beta1"`

## ServiceCIDR {#ServiceCIDR}

<!--
ServiceCIDR defines a range of IP addresses using CIDR format (e.g. 192.168.0.0/24 or 2001:db2::/64). This range is used to allocate ClusterIPs to Service objects.
-->
ServiceCIDR 使用 CIDR 格式定义 IP 地址的范围（例如 192.168.0.0/24 或 2001:db2::/64）。
此范围用于向 Service 对象分配 ClusterIP。

<hr>

- **apiVersion**: networking.k8s.io/v1beta1

- **kind**: ServiceCIDR

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDRSpec" >}}">ServiceCIDRSpec</a>)

  spec is the desired state of the ServiceCIDR. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDRStatus" >}}">ServiceCIDRStatus</a>)

  status represents the current state of the ServiceCIDR. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDRSpec" >}}">ServiceCIDRSpec</a>)

  spec 是 ServiceCIDR 的期望状态。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDRStatus" >}}">ServiceCIDRStatus</a>)

  status 表示 ServiceCIDR 的当前状态。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## ServiceCIDRSpec {#ServiceCIDRSpec}

<!--
ServiceCIDRSpec define the CIDRs the user wants to use for allocating ClusterIPs for Services.
-->
ServiceCIDRSpec 定义用户想要为 Service 分配 ClusterIP 所用的 CIDR。

<hr>

<!--
- **cidrs** ([]string)

  *Atomic: will be replaced during a merge*
  
  CIDRs defines the IP blocks in CIDR notation (e.g. "192.168.0.0/24" or "2001:db8::/64") from which to assign service cluster IPs. Max of two CIDRs is allowed, one of each IP family. This field is immutable.
-->
- **cidrs** ([]string)

  **原子：将在合并期间被替换**
  
  cidrs 以 CIDR 表示法定义 IP 块（例如 "192.168.0.0/24" 或 "2001:db8::/64"），
  从此 IP 块中为服务分配集群 IP。允许最多两个 CIDR，每个 IP 簇一个 CIDR。此字段是不可变更的。

## ServiceCIDRStatus {#ServiceCIDRStatus}

<!--
ServiceCIDRStatus describes the current state of the ServiceCIDR.
-->
ServiceCIDRStatus 描述 ServiceCIDR 的当前状态。

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

  **补丁策略：基于键 `type` 合并**
  
  **Map：合并时将保留 type 键的唯一值**
  
  conditions 包含一个 metav1.Condition 数组，描述 ServiceCIDR 的状态。

  <a name="Condition"></a>
  **condition 包含此 API 资源某一方面当前状态的详细信息。**

  <!--
  - **conditions.lastTransitionTime** (Time), required

    lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)，必需

    lastTransitionTime 是状况最近一次状态转化的时间。
    变化应该发生在下层状况发生变化的时候。如果不知道下层状况发生变化的时间，
    那么使用 API 字段更改的时间是可以接受的。

    <a name="Time"></a>
    **Time 是 time.Time 的包装类，支持正确地序列化为 YAML 和 JSON。
    为 time 包提供的许多工厂方法提供了包装类。**

  <!--
  - **conditions.message** (string), required

    message is a human readable message indicating details about the transition. This may be an empty string.

  - **conditions.reason** (string), required

    reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.
  -->

  - **conditions.message** (string)，必需

    message 是人类可读的消息，有关转换的详细信息，可以是空字符串。

  - **conditions.reason** (string)，必需

    reason 包含一个程序标识符，指示 condition 最后一次转换的原因。
    特定状况类型的生产者可以定义该字段的预期值和含义，以及这些值是否被视为有保证的 API。
    此值应该是 CamelCase 字符串且不能为空。

  <!--
  - **conditions.status** (string), required

    status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    type of condition in CamelCase or in foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.
  -->

  - **conditions.status** (string)，必需

    condition 的状态，可选值为 True、False、Unknown 之一。

  - **conditions.type** (string)，必需

    CamelCase 或 foo.example.com/CamelCase 中的条件类型。

  - **conditions.observedGeneration** (int64)

    observedGeneration 表示设置 condition 基于的 .metadata.generation 的过期次数。
    例如，如果 .metadata.generation 当前为 12，但 .status.conditions[x].observedGeneration 为 9，
    则 condition 相对于实例的当前状态已过期。

## ServiceCIDRList {#ServiceCIDRList}

<!--
ServiceCIDRList contains a list of ServiceCIDR objects.
-->
ServiceCIDRList 包含 ServiceCIDR 对象的列表。

<hr>

- **apiVersion**: networking.k8s.io/v1beta1

- **kind**: ServiceCIDRList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>), required

  items is the list of ServiceCIDRs.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>)，必需

  items 是 ServiceCIDR 的列表。

<!--
## Operations {#Operations}

### `get` read the specified ServiceCIDR

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 ServiceCIDR

#### HTTP

GET /apis/networking.k8s.io/v1beta1/servicecidrs/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ServiceCIDR

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  ServiceCIDR 的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified ServiceCIDR

#### HTTP Request
-->
### `get` 读取指定的 ServiceCIDR 的状态

#### HTTP 请求

GET /apis/networking.k8s.io/v1beta1/servicecidrs/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ServiceCIDR

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  ServiceCIDR 的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ServiceCIDR

#### HTTP Request
-->
### `list` 列举或监视 ServiceCIDR 类别的对象

#### HTTP 请求

GET /apis/networking.k8s.io/v1beta1/servicecidrs

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
#### 参数

- **allowWatchBookmarks** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDRList" >}}">ServiceCIDRList</a>): OK

401: Unauthorized

<!--
### `create` create a ServiceCIDR

#### HTTP Request
-->
### `create` 创建 ServiceCIDR

#### HTTP 请求

POST /apis/networking.k8s.io/v1beta1/servicecidrs

<!--
#### Parameters

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>, required

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

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>，必需

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

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

202 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ServiceCIDR

#### HTTP Request
-->
### `update` 替换指定的 ServiceCIDR

#### HTTP 请求

PUT /apis/networking.k8s.io/v1beta1/servicecidrs/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ServiceCIDR

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>, required

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

- **name** (**路径参数**): string，必需

  ServiceCIDR 的名称。

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>，必需

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

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified ServiceCIDR

#### HTTP Request
-->
### `update` 替换指定的 ServiceCIDR 的状态

#### HTTP 请求

PUT /apis/networking.k8s.io/v1beta1/servicecidrs/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ServiceCIDR

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>, required

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

- **name** (**路径参数**): string，必需

  ServiceCIDR 的名称。

- **body**: <a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>，必需

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

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ServiceCIDR

#### HTTP Request
-->
### `patch` 部分更新指定的 ServiceCIDR

#### HTTP 请求

PATCH /apis/networking.k8s.io/v1beta1/servicecidrs/{name}

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
#### 参数

- **name** (**路径参数**): string，必需

  ServiceCIDR 的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified ServiceCIDR

#### HTTP Request
-->
### `patch` 部分更新指定的 ServiceCIDR 的状态

#### HTTP 请求

PATCH /apis/networking.k8s.io/v1beta1/servicecidrs/{name}/status

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
#### 参数

- **name** (**路径参数**): string，必需

  ServiceCIDR 的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): OK

201 (<a href="{{< ref "../cluster-resources/service-cidr-v1beta1#ServiceCIDR" >}}">ServiceCIDR</a>): Created

401: Unauthorized

<!--
### `delete` delete a ServiceCIDR

#### HTTP Request
-->
### `delete` 删除 ServiceCIDR

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1beta1/servicecidrs/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ServiceCIDR

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  ServiceCIDR 的名称。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ServiceCIDR

#### HTTP Request
-->
### `deletecollection` 删除 ServiceCIDR 的集合

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1beta1/servicecidrs

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
#### 参数

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
