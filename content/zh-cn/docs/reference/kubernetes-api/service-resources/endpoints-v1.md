---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Endpoints"
content_type: "api_reference"
description: "Endpoints 是实现实际服务的端点的集合。"
title: "Endpoints"
weight: 2
auto_generated: true
---
<!--
---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Endpoints"
content_type: "api_reference"
description: "Endpoints is a collection of endpoints that implement the actual service."
title: "Endpoints"
weight: 2
auto_generated: true
---
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`


## Endpoints {#Endpoints}

<!--
Endpoints is a collection of endpoints that implement the actual service. Example:
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
-->
Endpoints 是实现实际服务的端点的集合。 举例:
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

<!--
- **apiVersion**: v1


- **kind**: Endpoints


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **apiVersion**: v1


- **kind**: Endpoints


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准对象的元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **subsets** ([]EndpointSubset)

  The set of all endpoints is the union of all subsets. Addresses are placed into subsets according to the IPs they share. A single address with multiple ports, some of which are ready and some of which are not (because they come from different containers) will result in the address being displayed in different subsets for the different ports. No address will appear in both Addresses and NotReadyAddresses in the same subset. Sets of addresses and ports that comprise a service.

  <a name="EndpointSubset"></a>
  *EndpointSubset is a group of addresses with a common set of ports. The expanded set of endpoints is the Cartesian product of Addresses x Ports. For example, given:
    {
      Addresses: [{"ip": "10.10.1.1"}, {"ip": "10.10.2.2"}],
      Ports:     [{"name": "a", "port": 8675}, {"name": "b", "port": 309}]
    }
  The resulting set of endpoints can be viewed as:
      a: [ 10.10.1.1:8675, 10.10.2.2:8675 ],
      b: [ 10.10.1.1:309, 10.10.2.2:309 ]*
-->
- **subsets** ([]EndpointSubset)

  所有端点的集合是所有子集的并集。
  地址根据它们共享的IP被放入子集。
  具有多个端口的单个地址，其中一些端口已就绪，而另一些端口未就绪（因为它们来自不同的容器），将导致地址显示在不同端口的不同子集中。同一子集中的地址和NotReadyAddress中都不会显示任何地址。
  组成服务的地址和端口集。

  <a name="EndpointSubset"></a>
  *EndpointSubset 是一组具有公共端口集的地址。扩展的端点集是地址x端口的笛卡尔乘积。例如，给定:
    {
      Addresses: [{"ip": "10.10.1.1"}, {"ip": "10.10.2.2"}],
      Ports:     [{"name": "a", "port": 8675}, {"name": "b", "port": 309}]
    }
  最终的端点集可以看作:
      a: [ 10.10.1.1:8675, 10.10.2.2:8675 ],
      b: [ 10.10.1.1:309, 10.10.2.2:309 ]*

<!--
  - **subsets.addresses** ([]EndpointAddress)

    IP addresses which offer the related ports that are marked as ready. These endpoints should be considered safe for load balancers and clients to utilize.

    <a name="EndpointAddress"></a>
    *EndpointAddress is a tuple that describes single IP address.*

    - **subsets.addresses.ip** (string), required

      The IP of this endpoint. May not be loopback (127.0.0.0/8), link-local (169.254.0.0/16), or link-local multicast ((224.0.0.0/24). IPv6 is also accepted but not fully supported on all platforms. Also, certain kubernetes components, like kube-proxy, are not IPv6 ready.

    - **subsets.addresses.hostname** (string)

      The Hostname of this endpoint

    - **subsets.addresses.nodeName** (string)

      Optional: Node hosting this endpoint. This can be used to determine endpoints local to a node.

    - **subsets.addresses.targetRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

      Reference to object providing the endpoint.
-->
  - **subsets.addresses** ([]EndpointAddress)

    提供标记为就绪的相关端口的 IP 地址。
    这些端点应该被认为是负载平衡器和客户端可以安全使用的。

    <a name="EndpointAddress"></a>
    *EndpointAddress 是描述单个IP地址的元组。*

    - **subsets.addresses.ip** (string), 必选

      端点的 IP。可能不是环回（127.0.0.0/8）、链路本地（169.254.0.0/16）或链路本地多播（224.0.0.0/24）。
      IPv6 也被接受，但并非在所有平台上都完全支持。
      此外，某些 kubernetes 组件，如 kube proxy，还没有准备好支持 IPv6。

    - **subsets.addresses.hostname** (string)

      端点主机名称。

    - **subsets.addresses.nodeName** (string)

      可选：承载此端点的节点。
      这可用于确定节点的本地端点。

    - **subsets.addresses.targetRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

      对提供端点的对象的引用。

<!--
  - **subsets.notReadyAddresses** ([]EndpointAddress)

    IP addresses which offer the related ports but are not currently marked as ready because they have not yet finished starting, have recently failed a readiness check, or have recently failed a liveness check.

    <a name="EndpointAddress"></a>
    *EndpointAddress is a tuple that describes single IP address.*

    - **subsets.notReadyAddresses.ip** (string), required

      The IP of this endpoint. May not be loopback (127.0.0.0/8), link-local (169.254.0.0/16), or link-local multicast ((224.0.0.0/24). IPv6 is also accepted but not fully supported on all platforms. Also, certain kubernetes components, like kube-proxy, are not IPv6 ready.

    - **subsets.notReadyAddresses.hostname** (string)

      The Hostname of this endpoint

    - **subsets.notReadyAddresses.nodeName** (string)

      Optional: Node hosting this endpoint. This can be used to determine endpoints local to a node.

    - **subsets.notReadyAddresses.targetRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

      Reference to object providing the endpoint.
-->
  - **subsets.notReadyAddresses** ([]EndpointAddress)

    提供相关端口但由于尚未完成启动、最近未通过就绪性检查或最近未通过活动性检查而当前未标记为就绪的IP地址。

    <a name="EndpointAddress"></a>
    *EndpointAddress 是描述单个 IP 地址的元组。*

    - **subsets.notReadyAddresses.ip** (string), 必选

      端点的 IP。可能不是环回（127.0.0.0/8）、链路本地（169.254.0.0/16）或链路本地多播（224.0.0.0/24）。
      IPv6 也被接受，但并非在所有平台上都完全支持。
      此外，某些 kubernetes 组件，如 kube proxy，还没有准备好支持 IPv6。

    - **subsets.notReadyAddresses.hostname** (string)

      端点主机名称。

    - **subsets.notReadyAddresses.nodeName** (string)

      可选：承载此端点的节点。
      这可用于确定节点的本地端点。

    - **subsets.notReadyAddresses.targetRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

      对提供端点的对象的引用。

<!--
  - **subsets.ports** ([]EndpointPort)

    Port numbers available on the related IP addresses.

    <a name="EndpointPort"></a>
    *EndpointPort is a tuple that describes a single port.*

    - **subsets.ports.port** (int32), required

      The port number of the endpoint.

    - **subsets.ports.protocol** (string)

      The IP protocol for this port. Must be UDP, TCP, or SCTP. Default is TCP.
      
      

    - **subsets.ports.name** (string)

      The name of this port.  This must match the 'name' field in the corresponding ServicePort. Must be a DNS_LABEL. Optional only if one port is defined.

    - **subsets.ports.appProtocol** (string)

      The application protocol for this port. This field follows standard Kubernetes label syntax. Un-prefixed names are reserved for IANA standard service names (as per RFC-6335 and https://www.iana.org/assignments/service-names). Non-standard protocols should use prefixed names such as mycompany.com/my-custom-protocol.
-->
- **subsets.ports** ([]EndpointPort)

    相关IP地址上可用的端口号。

    <a name="EndpointPort"></a>
    *EndpointAddress 是描述单个 IP 地址的元组。*

    - **subsets.ports.port** (int32), 必选

      端点的端口号。

    - **subsets.ports.protocol** (string)

      此端口的IP协议。必须是UDP、TCP或SCTP。默认值为TCP。
      
      

    - **subsets.ports.name** (string)

      端口的名称。
      这必须与相应 ServicePort 中的 “name” 字段匹配。必须是 DNS_LABEL 。
      仅当定义了一个端口时才可选。

    - **subsets.ports.appProtocol** (string)

      端口的应用程序协议。
      此字段遵循标准的 Kubernetes 标签语法。
      未加前缀的名称保留给 IANA 标准服务名称（根据 RFC-6335 和 https://www.iana.org/assignments/service-names)。
      非标准协议应使用前缀名称，如 mycompany.com/my-custom-protocol。





<!--
## EndpointsList {#EndpointsList}

EndpointsList is a list of endpoints.

<hr>

- **apiVersion**: v1


- **kind**: EndpointsList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>), required

  List of endpoints.
-->
## EndpointsList {#EndpointsList}

EndpointsList 是端点列表。

<hr>

- **apiVersion**: v1


- **kind**: EndpointsList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准列表元数据。更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>), 必选

  端点列表。




## Operations {#Operations}



<hr>






<!--
### `get` read the specified Endpoints

#### HTTP Request

GET /api/v1/namespaces/{namespace}/endpoints/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Endpoints


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
### `get` 读取指定的端点

#### HTTP 请求

GET /api/v1/namespaces/{namespace}/endpoints/{name}

#### 参数


- **name** (*in path*): string, 必选

  端点名称


- **namespace** (*in path*): string, 必选

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response


200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

401: Unauthorized


### `list` list or watch objects of kind Endpoints

#### HTTP Request

GET /api/v1/namespaces/{namespace}/endpoints
-->
#### 应答


200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

401: 未授权


<!--
### `list` list or watch objects of kind Endpoints

#### HTTP Request

GET /api/v1/namespaces/{namespace}/endpoints

#### Parameters
-->
### `list` 列出或监视端点类型的对象

#### HTTP 请求

GET /api/v1/namespaces/{namespace}/endpoints

#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


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


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **namespace** (*in path*): string, 必选

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


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


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



<!--
#### Response


200 (<a href="{{< ref "../service-resources/endpoints-v1#EndpointsList" >}}">EndpointsList</a>): OK

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/endpoints-v1#EndpointsList" >}}">EndpointsList</a>): OK

401: 未授权


<!--
### `list` list or watch objects of kind Endpoints

#### HTTP Request

GET /api/v1/endpoints

#### Parameters
-->
### `list` 列出或查看端点类型的对象

#### HTTP 请求

GET /api/v1/endpoints

#### 参数


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


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



<!--
#### Response


200 (<a href="{{< ref "../service-resources/endpoints-v1#EndpointsList" >}}">EndpointsList</a>): OK

401: Unauthorized


### `create` create Endpoints

#### HTTP Request

POST /api/v1/namespaces/{namespace}/endpoints

#### Parameters
-->
#### 应答


200 (<a href="{{< ref "../service-resources/endpoints-v1#EndpointsList" >}}">EndpointsList</a>): OK

401: 未授权


### `create` 创建端点

#### HTTP 请求

POST /api/v1/namespaces/{namespace}/endpoints

#### 参数



<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **namespace** (*in path*): string, 必选

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>, 必选

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response


200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

202 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Accepted

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

202 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Accepted

401: 未授权


<!--
### `update` replace the specified Endpoints

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/endpoints/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Endpoints


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>, required
-->
### `update` 替换指定端点

#### HTTP 请求

PUT /api/v1/namespaces/{namespace}/endpoints/{name}

#### 参数


- **name** (*in path*): string, 必选

  端点名称


- **namespace** (*in path*): string, 必选

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>, 必选
  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response


200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

401: 未授权


<!--
### `patch` partially update the specified Endpoints

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/endpoints/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Endpoints


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
### `patch` 部分更新指定的端点

#### HTTP 请求

PATCH /api/v1/namespaces/{namespace}/endpoints/{name}

#### 参数


- **name** (*in path*): string, 必选

  name of the Endpoints


- **namespace** (*in path*): string, 必选

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必选



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



<!--
#### Response


200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

401: 未授权


<!-->
### `delete` delete Endpoints

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/endpoints/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the Endpoints


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
### `delete` 删除端点

#### HTTP 请求

DELETE /api/v1/namespaces/{namespace}/endpoints/{name}

#### 参数


- **name** (*in path*): string, 必选

  端点名称


- **namespace** (*in path*): string, 必选

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>



<!--
#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: 未授权


<!--
### `deletecollection` delete collection of Endpoints

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/endpoints

#### Parameters


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
### `deletecollection` 删除端点集合

#### HTTP 请求

DELETE /api/v1/namespaces/{namespace}/endpoints

#### 参数


- **namespace** (*in path*): string, 必选

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


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


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>



<!--
#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: 未授权