---
api_metadata:
  apiVersion: "networking.k8s.io/v1beta1"
  import: "k8s.io/api/networking/v1beta1"
  kind: "IPAddress"
content_type: "api_reference"
description: "IPAddress 表示单个 IP 族的单个 IP。"
title: "IPAddress v1beta1"
weight: 4
---
<!--
api_metadata:
  apiVersion: "networking.k8s.io/v1beta1"
  import: "k8s.io/api/networking/v1beta1"
  kind: "IPAddress"
content_type: "api_reference"
description: "IPAddress represents a single IP of a single IP Family."
title: "IPAddress v1beta1"
weight: 4
auto_generated: true
-->

`apiVersion: networking.k8s.io/v1beta1`

`import "k8s.io/api/networking/v1beta1"`

## IPAddress {#IPAddress}

<!--
IPAddress represents a single IP of a single IP Family. The object is designed to be used by APIs that operate on IP addresses. The object is used by the Service core API for allocation of IP addresses. An IP address can be represented in different formats, to guarantee the uniqueness of the IP, the name of the object is the IP address in canonical format, four decimal digits separated by dots suppressing leading zeros for IPv4 and the representation defined by RFC 5952 for IPv6. Valid: 192.168.1.5 or 2001:db8::1 or 2001:db8:aaaa:bbbb:cccc:dddd:eeee:1 Invalid: 10.01.2.3 or 2001:db8:0:0:0::1
-->
IPAddress 表示单个 IP 族的单个 IP。此对象旨在供操作 IP 地址的 API 使用。
此对象由 Service 核心 API 用于分配 IP 地址。
IP 地址可以用不同的格式表示，为了保证 IP 地址的唯一性，此对象的名称是格式规范的 IP 地址。
IPv4 地址由点分隔的四个十进制数字组成，前导零可省略；IPv6 地址按照 RFC 5952 的定义来表示。
有效值：192.168.1.5、2001:db8::1 或 2001:db8:aaaa:bbbb:cccc:dddd:eeee:1。
无效值：10.01.2.3 或 2001:db8:0:0:0::1。

<hr>

- **apiVersion**: networking.k8s.io/v1beta1

- **kind**: IPAddress

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddressSpec" >}}">IPAddressSpec</a>)

  spec is the desired state of the IPAddress. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddressSpec" >}}">IPAddressSpec</a>)

  spec 是 IPAddress 的预期状态。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## IPAddressSpec {#IPAddressSpec}

<!--
IPAddressSpec describe the attributes in an IP Address.
-->
IPAddressSpec 描述 IP 地址中的属性。

<hr>

<!--
- **parentRef** (ParentReference), required

  ParentRef references the resource that an IPAddress is attached to. An IPAddress must reference a parent object.

  <a name="ParentReference"></a>
  *ParentReference describes a reference to a parent object.*
-->
- **parentRef** (ParentReference)，必需

  parentRef 引用挂接 IPAddress 的资源。IPAddress 必须引用一个父对象。

  <a name="ParentReference"></a>
  **ParentReference 描述指向父对象的引用。**

  <!--
  - **parentRef.name** (string), required

    Name is the name of the object being referenced.

  - **parentRef.resource** (string), required

    Resource is the resource of the object being referenced.
  -->

  - **parentRef.name** (string)，必需

    name 是被引用的对象的名称。

  - **parentRef.resource** (string)，必需

    resource 是被引用的对象的资源。

  <!--
  - **parentRef.group** (string)

    Group is the group of the object being referenced.

  - **parentRef.namespace** (string)

    Namespace is the namespace of the object being referenced.
  -->

  - **parentRef.group** (string)

    group 是被引用的对象的组。

  - **parentRef.namespace** (string)

    namespace 是被引用的对象的名字空间。

## IPAddressList {#IPAddressList}

<!--
IPAddressList contains a list of IPAddress.
-->
IPAddressList 包含 IPAddress 的列表。

<hr>

- **apiVersion**: networking.k8s.io/v1beta1

- **kind**: IPAddressList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>), required

  items is the list of IPAddresses.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>)，必需

  items 是 IPAddresses 的列表。

<!--
## Operations {#Operations}

### `get` read the specified IPAddress

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 IPAddress

#### HTTP 请求

GET /apis/networking.k8s.io/v1beta1/ipaddresses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the IPAddress

- **pretty** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需

  IPAddress 的名称。

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind IPAddress

#### HTTP Request
-->
### `list` 列举或监视类别为 IPAddress 的对象

#### HTTP 请求

GET /apis/networking.k8s.io/v1beta1/ipaddresses

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
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
#### 参数

- **allowWatchBookmarks**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddressList" >}}">IPAddressList</a>): OK

401: Unauthorized

<!--
### `create` create an IPAddress

#### HTTP Request
-->
### `create` 创建 IPAddress

#### HTTP 请求

POST /apis/networking.k8s.io/v1beta1/ipaddresses

<!--
#### Parameters
- **body**: <a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **body**: <a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): OK

201 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): Created

202 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified IPAddress

#### HTTP Request
-->
### `update` 替换指定的 IPAddress

#### HTTP 请求

PUT /apis/networking.k8s.io/v1beta1/ipaddresses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the IPAddress

- **body**: <a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>, required

- **dryRun** (*in query*): string

- **fieldManager** (*in query*): string

- **fieldValidation** (*in query*): string

- **pretty** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需

  IPAddress 的名称。

- **body**: <a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): OK

201 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified IPAddress

#### HTTP Request
-->
### `patch` 部分更新指定的 IPAddress

#### HTTP 请求

PATCH /apis/networking.k8s.io/v1beta1/ipaddresses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the IPAddress

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

- **dryRun** (*in query*): string

- **fieldManager** (*in query*): string

- **fieldValidation** (*in query*): string

- **force** (*in query*): boolean

- **pretty** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需

  IPAddress 的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): OK

201 (<a href="{{< ref "../cluster-resources/ip-address-v1beta1#IPAddress" >}}">IPAddress</a>): Created

401: Unauthorized

<!--
### `delete` delete an IPAddress

#### HTTP Request
-->
### `delete` 删除 IPAddress

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1beta1/ipaddresses/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the IPAddress

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

- **gracePeriodSeconds** (*in query*): integer

- **pretty** (*in query*): string

- **propagationPolicy** (*in query*): string
-->
#### 参数

- **name**（**路径参数**）：string，必需

  IPAddress 的名称。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of IPAddress

#### HTTP Request
-->
### `deletecollection` 删除 IPAddress 的集合

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1beta1/ipaddresses

<!--
#### Parameters

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
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
-->
#### 参数

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents**（**查询参数**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查询参数**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
