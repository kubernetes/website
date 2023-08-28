---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "LimitRange"
content_type: "api_reference"
description: "LimitRange 设置名字空间中每个资源类别的资源用量限制。"
title: "LimitRange"
weight: 1
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "LimitRange"
content_type: "api_reference"
description: "LimitRange sets resource usage limits for each kind of resource in a Namespace."
title: "LimitRange"
weight: 1
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## LimitRange {#LimitRange}
<!--
LimitRange sets resource usage limits for each kind of resource in a Namespace.
-->
LimitRange 设置名字空间中每个资源类别的资源用量限制。

<hr>

- **apiVersion**: v1

- **kind**: LimitRange

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRangeSpec" >}}">LimitRangeSpec</a>)
  Spec defines the limits enforced. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRangeSpec" >}}">LimitRangeSpec</a>)

  spec 定义强制执行的限制。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## LimitRangeSpec {#LimitRangeSpec}

<!--
LimitRangeSpec defines a min/max usage limit for resources that match on kind.
-->
LimitRangeSpec 定义与类别匹配的资源的最小/最大使用限制。

<hr>

<!--
- **limits** ([]LimitRangeItem), required
  Limits is the list of LimitRangeItem objects that are enforced.

  <a name="LimitRangeItem"></a>
  *LimitRangeItem defines a min/max usage limit for any resource that matches on kind.*

  - **limits.type** (string), required
    Type of resource that this limit applies to.
-->
- **limits** ([]LimitRangeItem)，必需

  limits 是强制执行的 LimitRangeItem 对象的列表。

  <a name="LimitRangeItem"></a>
  **LimitRangeItem 定义与类别匹配的任意资源的最小/最大使用限制。**

  - **limits.type** (string)，必需

    此限制应用到的资源的类型。

  <!--
  - **limits.default** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)
    Default resource requirement limit value by resource name if resource limit is omitted.

  - **limits.defaultRequest** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)
    DefaultRequest is the default resource requirement request value by resource name if resource request is omitted.

  - **limits.max** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)
    Max usage constraints on this kind by resource name.
  -->

  - **limits.default** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    资源限制被省略时按资源名称设定的默认资源要求限制值。

  - **limits.defaultRequest** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    defaultRequest 是资源请求被省略时按资源名称设定的默认资源要求请求值。

  - **limits.max** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    按资源名称针对这种类别的最大使用约束。

  <!--
  - **limits.maxLimitRequestRatio** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)
    MaxLimitRequestRatio if specified, the named resource must have a request and limit that are both non-zero where limit divided by request is less than or equal to the enumerated value; this represents the max burst for the named resource.

  - **limits.min** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)
    Min usage constraints on this kind by resource name.
  -->

  - **limits.maxLimitRequestRatio** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    如果指定 maxLimitRequestRatio，则所指定的资源必须设置非零的请求和限制值，
    且限制除以请求小于或等于这里列举的值；此属性用来表示所指定资源的最大突发用量。

  - **limits.min** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    按资源名称区分的，针对这种类别对象的最小用量约束。

## LimitRangeList {#LimitRangeList}

<!--
LimitRangeList is a list of LimitRange items.
-->
LimitRangeList 是 LimitRange 项的列表。

<hr>

- **apiVersion**: v1

- **kind**: LimitRangeList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>), required
  Items is a list of LimitRange objects. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>)，必需

  items 是 LimitRange 对象的列表。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

<!--
## Operations {#Operations}
<hr>
### `get` read the specified LimitRange
#### HTTP Request
-->
## 操作 {#Operations}
<hr>

### `get` 读取指定的 LimitRange
#### HTTP 请求
GET /api/v1/namespaces/{namespace}/limitranges/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the LimitRange
- **namespace** (*in path*): string, required
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  LimitRange 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应
200 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind LimitRange
#### HTTP Request
-->
### `list` 列出或监视 LimitRange 类别的对象
#### HTTP 请求
GET /api/v1/namespaces/{namespace}/limitranges

<!--
#### Parameters
- **namespace** (*in path*): string, required
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
#### 参数

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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
200 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRangeList" >}}">LimitRangeList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind LimitRange
#### HTTP Request
-->
### `list` 列出或监视 LimitRange 类别的对象
#### HTTP 请求
GET /api/v1/limitranges

<!--
#### Parameters
- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
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

200 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRangeList" >}}">LimitRangeList</a>): OK

401: Unauthorized

<!--
### `create` create a LimitRange
#### HTTP Request
-->
### `create` 创建 LimitRange
#### HTTP 请求
POST /api/v1/namespaces/{namespace}/limitranges

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>，必需

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
200 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): OK

201 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): Created

202 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified LimitRange
#### HTTP Request
-->
### `update` 替换指定的 LimitRange
#### HTTP 请求
PUT /api/v1/namespaces/{namespace}/limitranges/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the LimitRange
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  LimitRange 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>，必需

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
200 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): OK

201 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified LimitRange
#### HTTP Request
-->
### `patch` 部分更新指定的 LimitRange
#### HTTP 请求
PATCH /api/v1/namespaces/{namespace}/limitranges/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the LimitRange
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  LimitRange 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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
200 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): OK

201 (<a href="{{< ref "../policy-resources/limit-range-v1#LimitRange" >}}">LimitRange</a>): Created

401: Unauthorized

<!--
### `delete` delete a LimitRange
#### HTTP Request
-->
### `delete` 删除 LimitRange
#### HTTP 请求
DELETE /api/v1/namespaces/{namespace}/limitranges/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the LimitRange
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需

  LimitRange 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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
### `deletecollection` delete collection of LimitRange
#### HTTP Request
-->
### `deletecollection` 删除 LimitRange 的集合
#### HTTP 请求
DELETE /api/v1/namespaces/{namespace}/limitranges

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
-->
#### 参数

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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
