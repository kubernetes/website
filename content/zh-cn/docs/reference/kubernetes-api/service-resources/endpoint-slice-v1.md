---
api_metadata:
  apiVersion: "discovery.k8s.io/v1"
  import: "k8s.io/api/discovery/v1"
  kind: "EndpointSlice"
content_type: "api_reference"
description: "EndpointSlice 是实现某 Service 的端点的子集."
title: "EndpointSlice"
weight: 3
---

<!--
description: "EndpointSlice represents a subset of the endpoints that implement a service."
-->

`apiVersion: discovery.k8s.io/v1`

`import "k8s.io/api/discovery/v1"`

## EndpointSlice {#EndpointSlice}

<!--
EndpointSlice represents a subset of the endpoints that implement a service. For a given service there may be multiple EndpointSlice objects, selected by labels, which must be joined to produce the full set of endpoints.
-->
EndpointSlice 是实现某 Service 的端点的子集。一个 Service 可以有多个 EndpointSlice 对象与之对应，
必须将所有的 EndpointSlice 拼接起来才能形成一套完整的端点集合。Service 通过标签来选择 EndpointSlice。

<hr>

- **apiVersion**：discovery.k8s.io/v1

- **kind**：EndpointSlice

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata.
  -->
  标准的对象元数据。

- **addressType** (string), <!--required-->必需
  
  <!--
  addressType specifies the type of address carried by this EndpointSlice. All addresses in this slice must be the same type. This field is immutable after creation. The following address types are currently supported: * IPv4: Represents an IPv4 Address. * IPv6: Represents an IPv6 Address. * FQDN: Represents a Fully Qualified Domain Name.
  -->
  addressType 指定当前 EndpointSlice 携带的地址类型。一个 EndpointSlice 只能携带同一类型的地址。
  EndpointSlice 对象创建完成后不可以再更改 addressType 字段。
  目前支持的地址类型为：

  * IPv4：表示 IPv4 地址。
  * IPv6：表示 IPv6 地址。
  * FQDN：表示完全限定域名。

- **endpoints** ([]Endpoint), <!--required-->必需

  <!--
  *Atomic: will be replaced during a merge*
  -->
  **原子性：合并期间将被替换**

  <!--
  endpoints is a list of unique endpoints in this slice. Each slice may include a maximum of 1000 endpoints.
  -->
  endpoints 是当前 EndpointSlice 中一组唯一的端点。每个 EndpointSlice 最多可以包含 1000 个端点。

  <a name="Endpoint"></a>

  <!--
  *Endpoint represents a single logical "backend" implementing a service.*
  -->
  **端点是实现某 Service 的一个逻辑“后端”。**

  - **endpoints.addresses** ([]string), <!--required-->必需
    
    <!--
    *Set: unique values will be kept during a merge*
    -->
    
    **集合：不重复的值在合并期间会被保留**

    <!--
    addresses of this endpoint. The contents of this field are interpreted according to the corresponding EndpointSlice addressType field. Consumers must handle different types of addresses in the context of their own capabilities. This must contain at least one address but no more than 100. These are all assumed to be fungible and clients may choose to only use the first element. Refer to: https://issue.k8s.io/106267
    -->
    
    本端点的地址。此字段的内容会根据对应的 EndpointSlice addressType 字段的值进行解释。
    消费者必须根据自身能力处理不同类型的地址。此字段必须至少包含 1 个地址，最多不超过 100 个地址。
    假定这些地址都是可替换的，而且客户端也可能选择只用第一个元素。参阅： https://issue.k8s.io/106267

  - **endpoints.conditions** (EndpointConditions)

    <!--
    conditions contains information about the current status of the endpoint.
    -->
    
    conditions 包含和本端点当前状态有关的信息。

    <a name="EndpointConditions"></a>

    <!--
    *EndpointConditions represents the current condition of an endpoint.*
    -->
    
    **EndpointConditions 是端点的当前状况。**

    - **endpoints.conditions.ready** (boolean)  
      
      <!--
      ready indicates that this endpoint is prepared to receive traffic, according to whatever system is managing the endpoint. A nil value indicates an unknown state. In most cases consumers should interpret this unknown state as ready. For compatibility reasons, ready should never be "true" for terminating endpoints, except when the normal readiness behavior is being explicitly overridden, for example when the associated Service has set the publishNotReadyAddresses flag.
      -->
      
      ready 说明此端点已经准备好根据相关的系统映射接收流量。nil 值表示状态未知。
      在大多数情况下，消费者应将这种未知状态视为就绪（ready）。
      考虑到兼容性，对于正在结束状态下的端点，永远不能将 ready 设置为“true”，
      除非正常的就绪行为被显式覆盖，例如当关联的服务设置了 publishNotReadyAddresses 标志时。

    - **endpoints.conditions.serving** (boolean)
      
      <!--
      serving is identical to ready except that it is set regardless of the terminating state of endpoints. This condition should be set to true for a ready endpoint that is terminating. If nil, consumers should defer to the ready condition.
      -->
      
      serving 和 ready 非常相似。唯一的不同在于,
      即便某端点的状态为 Terminating 也可以设置 serving。
      对于处在终止过程中的就绪端点，此状况应被设置为 “true”。
      如果设置为 nil，则消费者应该以 ready 值为准。

    - **endpoints.conditions.terminating** (boolean)
      
      <!--
      terminating indicates that this endpoint is terminating. A nil value indicates an unknown state. Consumers should interpret this unknown state to mean that the endpoint is not terminating.
      -->
      
      terminating 说明当前端点正在终止过程中。nil 值表示状态未知。
      消费者应将这种未知状态视为端点并不处于终止过程中。

  - **endpoints.deprecatedTopology** (map[string]string)
    
    <!--
    deprecatedTopology contains topology information part of the v1beta1 API. This field is deprecated, and will be removed when the v1beta1 API is removed (no sooner than kubernetes v1.24).  While this field can hold values, it is not writable through the v1 API, and any attempts to write to it will be silently ignored. Topology information can be found in the zone and nodeName fields instead.
    -->
    
    deprecatedTopology 包含 v1beta1 API 的拓扑信息部分。目前已经弃用了此字段，
    移除 v1beta1 API 时（不早于 Kubernetes v1.24）会一起移除此字段。
    此字段目前仍然可以存储值，但是不能通过 v1 API 写入数据。
    向此字段写入数据的任何尝试都会被忽略，并且不会通知用户。
    移除此字段后，可以在 zone 和 nodeName 字段中查看拓扑信息。

  - **endpoints.hints** (EndpointHints)

    <!--
    hints contains information associated with how an endpoint should be consumed.
    -->
    
    hints 是关于应该如何使用某端点的提示信息。

    <a name="EndpointHints"></a>

    <!--
    *EndpointHints provides hints describing how an endpoint should be consumed.*
    -->
    
    **EndpointHints 提供应该如何使用某端点的提示信息。**

    - **endpoints.hints.forZones** ([]ForZone)

      <!--
      *Atomic: will be replaced during a merge*
      -->
      
      **原子性：合并期间将被替换**

      <!--
      forZones indicates the zone(s) this endpoint should be consumed by to enable topology aware routing.
      -->
      
      forZones 表示应该由哪个可用区调用此端点从才能激活拓扑感知路由。

      <a name="ForZone"></a>

      <!--
      *ForZone provides information about which zones should consume this endpoint.*
      -->
      
      **ForZone 指示应该由哪些可用区调度此端点。**

      - **endpoints.hints.forZones.name** (string), <!--required-->必需

        <!--
        name represents the name of the zone.
        -->
        
        name 代表可用区的名称。

  - **endpoints.hostname** (string)

    <!--
    hostname of this endpoint. This field may be used by consumers of endpoints to distinguish endpoints from each other (e.g. in DNS names). Multiple endpoints which use the same hostname should be considered fungible (e.g. multiple A values in DNS). Must be lowercase and pass DNS Label (RFC 1123) validation.
    -->
    
    此端点的主机名称。端点的使用者可以通过此字段区分各个端点（例如，通过 DNS 域名）。
    使用同一主机名称的多个端点应被视为可替换（例如，DNS 中的多个 A 记录）。
    必须为小写字母，并且需要通过 DNS Label (RFC 1123) 验证。

  - **endpoints.nodeName** (string)

    <!--
    nodeName represents the name of the Node hosting this endpoint. This can be used to determine endpoints local to a Node.
    -->
    
    nodeName 是托管此端点的 Node 的名称，使用 nodeName 可以决定 Node 本地有哪些端点。

  - **endpoints.targetRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

    <!--
    targetRef is a reference to a Kubernetes object that represents this endpoint.
    -->
    
    targetRef 是对代表此端点的 Kubernetes 对象的引用。

  - **endpoints.zone** (string)

    <!--
    zone is the name of the Zone this endpoint exists in.
    -->
    
    zone 是此端点所在的可用区（Zone）的名称。

- **ports** ([]EndpointPort)

  <!--
  *Atomic: will be replaced during a merge*
  -->
  
  **原子性：合并期间会被替代**
  
  <!--
  ports specifies the list of network ports exposed by each endpoint in this slice. Each port must have a unique name. When ports is empty, it indicates that there are no defined ports. When a port is defined with a nil port value, it indicates "all ports". Each slice may include a maximum of 100 ports.
  -->
  
  ports 列出了当前 EndpointSlice 中各个端点所暴露的网络端口。每个端口的名称不得重复。
  当 ports 列表为空时，表示没有已经指定暴露哪些端口。如果端口值被定义为 nil，表示暴露“所有端口”。
  每个 EndpointSlice 最多可以包含 100 个端口。

  <a name="EndpointPort"></a>

  <!--
  *EndpointPort represents a Port used by an EndpointSlice*
  -->
  
  **EndpointPort 是 EndpointSlice 使用的端口。**

  - **ports.port** (int32)

    <!--
    port represents the port number of the endpoint. If this is not specified, ports are not restricted and must be interpreted in the context of the specific consumer.
    -->
    
    port 表示端点的端口号。如果未指定，就不限制端口，且必须根据消费者的具体环境进行解释。

  - **ports.protocol** (string)

    <!--
    protocol represents the IP protocol for this port. Must be UDP, TCP, or SCTP. Default is TCP.
    -->
    
    protocol 表示此端口的 IP 协议。必须为 UDP、TCP 或 SCTP。默认为 TCP。

  - **ports.name** (string)

    <!--
    name represents the name of this port. All ports in an EndpointSlice must have a unique name. If the EndpointSlice is dervied from a Kubernetes service, this corresponds to the Service.ports[].name. Name must either be an empty string or pass DNS_LABEL validation: * must be no more than 63 characters long. * must consist of lower case alphanumeric characters or '-'. * must start and end with an alphanumeric character. Default is empty string.
    -->
    
    name 表示此端口的名称。EndpointSlice 中所有端口的名称都不得重复。
    如果 EndpointSlice 是基于 Kubernetes Service 创建的，
    那么此端口的名称和 Service.ports[].name 字段的值一致。默认为空字符串。
    名称必须是空字符串，或者必须通过 DNS_LABEL 验证：
    
    * 最多包含 63 个字符。
    * 必须包含英文小写字母或'-'。
    * 必须以字母开头并以字母结尾。

  - **ports.appProtocol** (string)

    <!--
    The application protocol for this port. This is used as a hint for implementations to offer richer behavior for protocols that they understand. This field follows standard Kubernetes label syntax. Valid values are either:
    
    * Un-prefixed protocol names - reserved for IANA standard service names (as per RFC-6335 and https://www.iana.org/assignments/service-names).
    
    * Kubernetes-defined prefixed names:
      * 'kubernetes.io/h2c' - HTTP/2 over cleartext as described in https://www.rfc-editor.org/rfc/rfc7540
      * 'kubernetes.io/ws'  - WebSocket over cleartext as described in https://www.rfc-editor.org/rfc/rfc6455
      * 'kubernetes.io/wss' - WebSocket over TLS as described in https://www.rfc-editor.org/rfc/rfc6455    
    
    * Other protocols should use implementation-defined prefixed names such as mycompany.com/my-custom-protocol.
    -->

    此端口的应用层协议。字段值被用作提示，允许协议实现为其所理解的协议提供更丰富的行为。
    此字段遵循标准的 Kubernetes 标签句法。有效的取值是：

    * 不带前缀的协议名 - 是 IANA 标准服务的保留名称（参见 RFC-6335 和 https://www.iana.org/assignments/service-names）。

    * Kubernetes 定义的前缀名称：
      * 'kubernetes.io/h2c' - 使用明文的 HTTP/2 协议，详见 https://www.rfc-editor.org/rfc/rfc7540
      * 'kubernetes.io/ws' - 通过明文传输的 WebSocket，详见 https://www.rfc-editor.org/rfc/rfc6455
      * 'kubernetes.io/wss' - 通过 TLS 传输的 WebSocket，详见 https://www.rfc-editor.org/rfc/rfc6455

    * 其他协议应该使用带前缀的名称，例如 mycompany.com/my-custom-protocol。

## EndpointSliceList {#EndpointSliceList}

<!--
EndpointSliceList represents a list of endpoint slices
-->
EndpointSliceList 是 EndpointSlice 的列表。

<hr>

- **apiVersion**：discovery.k8s.io/v1

- **kind**：EndpointSliceList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata.
  -->
  标准的列表元数据

- **items** ([]<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>), <!--required-->必需

  <!--
  items is the list of endpoint slices
  -->
  items 是 EndpointSlice 列表

<!--
## Operations {#Operations}
-->
## 操作 {#操作}

<hr>

<!--
### `get` read the specified EndpointSlice
-->
### `get` 读取指定的 EndpointSlice

<!--
#### HTTP Request
-->
#### HTTP 请求

GET /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required
-->
- **name** (**路径参数**)：string, 必需

  <!--
  name of the EndpointSlice
  -->
  EndpointSlice 的名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>)：OK

401：Unauthorized

<!--
### `list` list or watch objects of kind EndpointSlice
-->
### `list` 列举或监测 EndpointSlice 类别的对象

<!--
#### HTTP Request
-->
#### HTTP 请求

GET /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSliceList" >}}">EndpointSliceList</a>): OK

401：Unauthorized

<!--
### `list` list or watch objects of kind EndpointSlice
-->
### `list` 列举或监测 EndpointSlice 类别的对象

<!--
#### HTTP Request
-->
#### HTTP 请求

GET /apis/discovery.k8s.io/v1/endpointslices

<!--
#### Parameters
-->
#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查询参数**)：integer
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (*查询参数*)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSliceList" >}}">EndpointSliceList</a>)：OK

401：Unauthorized

<!--
### `create` create an EndpointSlice
-->
### `create` 创建 EndpointSlice

<!--
#### HTTP Request
-->
#### HTTP 请求

POST /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>, <!--required-->必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>)：OK

201 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>)：Created

202 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>)：Accepted

401：Unauthorized

<!--
### `update` replace the specified EndpointSlice
-->
### `update` 替换指定的 EndpointSlice

<!--
#### HTTP Request
-->
#### HTTP 请求

PUT /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required
-->
- **name** (**路径参数**)：string, 必需

  <!--
  name of the EndpointSlice
  -->
  EndpointSlice 的名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>，<!-- required-->必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询参数**)：string-

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>)：OK

201 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>)：Created

401：Unauthorized

<!--
### `patch` partially update the specified EndpointSlice
-->
### `patch` 部分更新指定的 EndpointSlice

<!--
#### HTTP Request
-->
#### HTTP 请求

PATCH /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required
-->
- **name** (**路径参数**): string, 必需

  <!--name of the EndpointSlice-->
  EndpointSlice 的名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, <!--required-->必需

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string
-->
- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean
-->
- **force** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>)：OK

201 (<a href="{{< ref "../service-resources/endpoint-slice-v1#EndpointSlice" >}}">EndpointSlice</a>)：Created

401：Unauthorized

<!--
### `delete` delete an EndpointSlice
-->
### `delete` 删除 EndpointSlice

<!--
#### HTTP Request
-->
#### HTTP 请求

DELETE /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required
-->
- **name** (**路径参数**)：string, 必需

  <!--
  name of the EndpointSlice
  -->
  EndpointSlice 的名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>)：OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>)：Accepted

401：Unauthorized

<!--
### `deletecollection` delete collection of EndpointSlice
-->
### `deletecollection` 删除 EndpointSlice 的集合

<!--
#### HTTP Request
-->
#### HTTP 请求

DELETE /apis/discovery.k8s.io/v1/namespaces/{namespace}/endpointslices

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer
-->
- **gracePeriodSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string
-->
- **propagationPolicy** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*)：string
-->
- **resourceVersion** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>)：OK

401：Unauthorized

