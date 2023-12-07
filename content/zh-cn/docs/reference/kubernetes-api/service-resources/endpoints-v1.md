---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Endpoints"
content_type: "api_reference"
description: "Endpoints 是实现实际服务的端点的集合。"
title: "Endpoints"
weight: 2
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Endpoints"
content_type: "api_reference"
description: "Endpoints is a collection of endpoints that implement the actual service."
title: "Endpoints"
weight: 2
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Endpoints {#Endpoints}

<!--
Endpoints is a collection of endpoints that implement the actual service. Example:
-->
Endpoints 是实现实际服务的端点的集合。举例:

	 Name: "mysvc",
	 Subsets: [
	   {
	     Addresses: [{"ip": "10.10.1.1"}, {"ip": "10.10.2.2"}],
	     Ports: [{"name": "a", "port": 8675}, {"name": "b", "port": 309}]
	   },
	   {
	     Addresses: [{"ip": "10.10.3.3"}],
	     Ports: [{"name": "a", "port": 93}, {"name": "b", "port": 76}]
	   },
	]

<hr>

- **apiVersion**: v1

- **kind**: Endpoints

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **subsets** ([]EndpointSubset)

  <!--
  The set of all endpoints is the union of all subsets. Addresses are placed into subsets according to the IPs they share. A single address with multiple ports, some of which are ready and some of which are not (because they come from different containers) will result in the address being displayed in different subsets for the different ports. No address will appear in both Addresses and NotReadyAddresses in the same subset. Sets of addresses and ports that comprise a service.
  -->
  所有端点的集合是所有 subsets 的并集。不同地址会根据其 IP 地址被放入不同子集。
  对于具有多个端口的单个地址，如果其中一些端口已就绪，而另一些端口未就绪（因为它们来自不同的容器），
  将导致地址显示在不同端口的不同子集中。
  任何地址都不可以同时出现在 addresses 和 notReadyAddress 中的相同子集内。

  <!--
  <a name="EndpointSubset"></a>
  *EndpointSubset is a group of addresses with a common set of ports. The expanded set of endpoints is the Cartesian product of Addresses x Ports. For example, given:
  -->
  <a name="EndpointSubset"></a>
  **EndpointSubset 是一组具有公共端口集的地址。扩展的端点集是 addresses 和 ports 的笛卡尔乘积。例如假设：**

  	{
  	  Addresses: [{"ip": "10.10.1.1"}, {"ip": "10.10.2.2"}],
  	  Ports:     [{"name": "a", "port": 8675}, {"name": "b", "port": 309}]
  	}

  <!--
  The resulting set of endpoints can be viewed as:
  -->
  则最终的端点集可以看作:


  	a: [ 10.10.1.1:8675, 10.10.2.2:8675 ],
  	b: [ 10.10.1.1:309, 10.10.2.2:309 ]*


  - **subsets.addresses** ([]EndpointAddress)
  
    <!--
    IP addresses which offer the related ports that are marked as ready. These endpoints should be considered safe for load balancers and clients to utilize.
    -->

    提供标记为就绪的相关端口的 IP 地址。
    这些端点应该被认为是负载均衡器和客户端可以安全使用的。

    <!--
    <a name="EndpointAddress"></a>
    *EndpointAddress is a tuple that describes single IP address.*
    -->

    <a name="EndpointAddress"></a>
    **EndpointAddress 是描述单个 IP 地址的元组。**

    <!--
    - **subsets.addresses.ip** (string), required
  
      The IP of this endpoint. May not be loopback (127.0.0.0/8 or ::1), link-local (169.254.0.0/16 or fe80::/10), or link-local multicast ((224.0.0.0/24).
    -->

    - **subsets.addresses.ip** (string), 必需

      端点的 IP。不可以是本地回路（127.0.0.0/8 或 ::1）、
      链路本地（169.254.0.0/16 或 fe80::/10）或链路本地多播（224.0.0.0/24
      或 ff02::/16)）地址。

    - **subsets.addresses.hostname** (string)
      
      <!--
      The Hostname of this endpoint
      -->

      端点主机名称。

    - **subsets.addresses.nodeName** (string)
      
      <!--
      Optional: Node hosting this endpoint. This can be used to determine endpoints local to a node.
      -->

      可选：承载此端点的节点。此字段可用于确定一个节点的本地端点。

    - **subsets.addresses.targetRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

      <!--
      Reference to object providing the endpoint.
      -->

      对提供端点的对象的引用。
            
  - **subsets.notReadyAddresses** ([]EndpointAddress)

    <!--
    IP addresses which offer the related ports but are not currently marked as ready because they have not yet finished starting, have recently failed a readiness check, or have recently failed a liveness check.

    <a name="EndpointAddress"></a>
    *EndpointAddress is a tuple that describes single IP address.*
    -->

    提供相关端口但由于尚未完成启动、最近未通过就绪态检查或最近未通过活跃性检查而被标记为当前未就绪的 IP 地址。
    <a name="EndpointAddress"></a>
    **EndpointAddress 是描述单个 IP 地址的元组。**

    <!--
    - **subsets.notReadyAddresses.ip** (string), required

      The IP of this endpoint. May not be loopback (127.0.0.0/8 or ::1), link-local (169.254.0.0/16 or fe80::/10), or link-local multicast (224.0.0.0/24 or ff02::/16).
    -->

    - **subsets.notReadyAddresses.ip** (string), 必需

      端点的 IP。不可以是本地环路（127.0.0.0/8 或 ::1）、
      链路本地（169.254.0.0/16 或 fe80::/10）或链路本地多播（224.0.0.0/24
      或 ff02::/16）地址。

    - **subsets.notReadyAddresses.hostname** (string)

      <!--
      The Hostname of this endpoint
      -->

      端点主机名称。

    - **subsets.notReadyAddresses.nodeName** (string)
    
      <!--
      Optional: Node hosting this endpoint. This can be used to determine endpoints local to a node.
      -->

      可选：承载此端点的节点。此字段可用于确定节点的本地端点。

    - **subsets.notReadyAddresses.targetRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

      <!--
      Reference to object providing the endpoint.
      -->

      对提供端点的对象的引用。

  - **subsets.ports** ([]EndpointPort)

    <!--
    Port numbers available on the related IP addresses.
    -->

    相关 IP 地址上可用的端口号。
    
    <!--
    <a name="EndpointPort"></a>
    *EndpointPort is a tuple that describes a single port.*
    -->

    <a name="EndpointPort"></a>
    **EndpointPort 是描述单个端口的元组。**

    <!--    
    - **subsets.ports.port** (int32), required

      The port number of the endpoint.
    -->

    - **subsets.ports.port** (int32), 必需

      端点的端口号。

    - **subsets.ports.protocol** (string)

      <!--
      The IP protocol for this port. Must be UDP, TCP, or SCTP. Default is TCP.
      -->

      此端口的 IP 协议。必须是 UDP、TCP 或 SCTP。默认值为 TCP。
      
    - **subsets.ports.name** (string)
    
      <!--
      The name of this port.  This must match the 'name' field in the corresponding ServicePort. Must be a DNS_LABEL. Optional only if one port is defined.
      -->

      端口的名称。此字段必须与相应 ServicePort 中的 `name` 字段匹配。必须是 DNS_LABEL。
      仅当定义了一个端口时才可选。

    - **subsets.ports.appProtocol** (string)
      
      <!--
      The application protocol for this port. This is used as a hint for implementations to offer richer behavior for protocols that they understand. This field follows standard Kubernetes label syntax. Valid values are either:
      -->

      端口的应用程序协议。这被用作实现的提示，为他们理解的协议提供更丰富的行为。
      此字段遵循标准的 Kubernetes 标签语法。有效值为：

      <!--
      * Un-prefixed protocol names - reserved for IANA standard service names (as per RFC-6335 and https://www.iana.org/assignments/service-names).
     
      * Kubernetes-defined prefixed names:
        * 'kubernetes.io/h2c' - HTTP/2 over cleartext as described in https://www.rfc-editor.org/rfc/rfc7540
        * 'kubernetes.io/ws'  - WebSocket over cleartext as described in https://www.rfc-editor.org/rfc/rfc6455
        * 'kubernetes.io/wss' - WebSocket over TLS as described in https://www.rfc-editor.org/rfc/rfc6455
     
      * Other protocols should use implementation-defined prefixed names such as mycompany.com/my-custom-protocol.
      -->
      
      * 未加前缀的名称保留给 IANA 标准服务名称（遵循 RFC-6335 和 https://www.iana.org/assignments/service-names)。
      
      * Kubernetes 定义的前缀名称
        * 'kubernetes.io/h2c' - HTTP/2 明文，如 https://www.rfc-editor.org/rfc/rfc7540 中所述
        * 'kubernetes.io/ws'  - WebSocket 明文，如 https://www.rfc-editor.org/rfc/rfc6455 中所述
        * 'kubernetes.io/wss' - WebSocket TLS 传输方式，如 https://www.rfc-editor.org/rfc/rfc6455 中所述
    
      * 其他协议应使用实现定义的前缀名称，如 mycompany.com/my-custom-protocol。

## EndpointsList {#EndpointsList}

<!--
EndpointsList is a list of endpoints.
-->
EndpointsList 是端点列表。

<hr>

- **apiVersion**: v1

- **kind**: EndpointsList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->
  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **items** ([]<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>), required

  List of endpoints.

## Operations {#Operations}
-->
- **items** ([]<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>), 必需

  端点列表。 

## 操作 {#Operations}

<hr>

<!--
### `get` read the specified Endpoints

#### HTTP Request

GET /api/v1/namespaces/{namespace}/endpoints/{name}

#### Parameters
-->
### `get` 读取指定的 Endpoints

#### HTTP 请求

GET /api/v1/namespaces/{namespace}/endpoints/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Endpoints
-->
- **name** (**路径参数**)：string，必需

  Endpoints 的名称。

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string，必需

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

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Endpoints

#### HTTP Request

GET /api/v1/namespaces/{namespace}/endpoints

#### Parameters
-->
### `list` 列出或监测 Endpoints 类型的对象

#### HTTP 请求

GET /api/v1/namespaces/{namespace}/endpoints

#### 参数

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string，必需

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

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
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

200 (<a href="{{< ref "../service-resources/endpoints-v1#EndpointsList" >}}">EndpointsList</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../service-resources/endpoints-v1#EndpointsList" >}}">EndpointsList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Endpoints

#### HTTP Request

GET /api/v1/endpoints

#### Parameters
-->
### `list` 列出或监测 Endpoints 类型的对象

#### HTTP 请求

GET /api/v1/endpoints

#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **allowWatchBookmarks** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **fieldSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **limit** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersion** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **timeoutSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/endpoints-v1#EndpointsList" >}}">EndpointsList</a>): OK

401: Unauthorized

<!--
### `create` create Endpoints

#### HTTP Request

POST /api/v1/namespaces/{namespace}/endpoints

#### Parameters
-->
### `create` 创建 Endpoints

#### HTTP 请求

POST /api/v1/namespaces/{namespace}/endpoints

#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>, required
-->
- **namespace** (**路径参数**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>, 必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

202 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified Endpoints

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/endpoints/{name}

#### Parameters
-->
### `update` 替换指定的 Endpoints

#### HTTP 请求

PUT /api/v1/namespaces/{namespace}/endpoints/{name}

#### 参数

<!--
- **name** (*in path*): string, required
 
  name of the Endpoints
-->
- **name** (**路径参数**)：string，必需
 
  Endpoints 名称

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路径参数**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>, required

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified Endpoints

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/endpoints/{name}

#### Parameters
-->
### `patch` 部分更新指定的 Endpoints

#### HTTP 请求

PATCH /api/v1/namespaces/{namespace}/endpoints/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Endpoints
-->
- **name** (**路径参数**)：string，必需

  Endpoints 名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **namespace** (**路径参数**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必需
  
<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **fieldValidation** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

401: Unauthorized

<!--
### `delete` delete Endpoints

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/endpoints/{name}

#### Parameters
-->
### `delete` 删除 Endpoints

#### HTTP 请求

DELETE /api/v1/namespaces/{namespace}/endpoints/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Endpoints
-->
- **name** (**路径参数**)：string，必需

  Endpoints 名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路径参数**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of Endpoints

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/endpoints

#### Parameters
-->
### `deletecollection` 删除 Endpoints 组

#### HTTP 请求

DELETE /api/v1/namespaces/{namespace}/endpoints

#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **namespace** (**路径参数**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
  
<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
