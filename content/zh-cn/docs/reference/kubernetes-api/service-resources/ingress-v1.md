---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "Ingress"
content_type: "api_reference"
description: "Ingress 是允许入站连接到达后端定义的端点的规则集合。"
title: "Ingress"
weight: 4
auto_generated: true
---
<!--
---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "Ingress"
content_type: "api_reference"
description: "Ingress is a collection of rules that allow inbound connections to reach the endpoints defined by a backend."
title: "Ingress"
weight: 4
auto_generated: true
---
-->



`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`


<!--
## Ingress {#Ingress}

Ingress is a collection of rules that allow inbound connections to reach the endpoints defined by a backend. An Ingress can be configured to give services externally-reachable urls, load balance traffic, terminate SSL, offer name based virtual hosting etc.

<hr>

- **apiVersion**: networking.k8s.io/v1


- **kind**: Ingress


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../service-resources/ingress-v1#IngressSpec" >}}">IngressSpec</a>)

  Spec is the desired state of the Ingress. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../service-resources/ingress-v1#IngressStatus" >}}">IngressStatus</a>)

  Status is the current state of the Ingress. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
## Ingress {#Ingress}

Ingress 是允许入站连接到达后端定义的端点的规则集合。
Ingress 可以配置为向服务提供外部可访问的URL、负载平衡流量、终止SSL、提供基于名称的虚拟主机等。

<hr>

- **apiVersion**: networking.k8s.io/v1


- **kind**: Ingress


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准对象的元数据。 
  更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../service-resources/ingress-v1#IngressSpec" >}}">IngressSpec</a>)

  Spec 是 Ingress 的所需状态。
  更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../service-resources/ingress-v1#IngressStatus" >}}">IngressStatus</a>)

  Status是 Ingress 的当前状态。
  更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status




<!--
## IngressSpec {#IngressSpec}

IngressSpec describes the Ingress the user wishes to exist.

<hr>

- **defaultBackend** (<a href="{{< ref "../service-resources/ingress-v1#IngressBackend" >}}">IngressBackend</a>)

  DefaultBackend is the backend that should handle requests that don't match any rule. If Rules are not specified, DefaultBackend must be specified. If DefaultBackend is not set, the handling of requests that do not match any of the rules will be up to the Ingress controller.

- **ingressClassName** (string)

  IngressClassName is the name of the IngressClass cluster resource. The associated IngressClass defines which controller will implement the resource. This replaces the deprecated `kubernetes.io/ingress.class` annotation. For backwards compatibility, when that annotation is set, it must be given precedence over this field. The controller may emit a warning if the field and annotation have different values. Implementations of this API should ignore Ingresses without a class specified. An IngressClass resource may be marked as default, which can be used to set a default value for this field. For more information, refer to the IngressClass documentation.
-->
## IngressSpec {#IngressSpec}

IngressSpec 描述用户希望存在的 Ingress。

<hr>

- **defaultBackend** (<a href="{{< ref "../service-resources/ingress-v1#IngressBackend" >}}">IngressBackend</a>)

  DefaultBackend 是应该处理与任何规则都不匹配的请求的后端。
  如果未指定规则，则必须指定 DefaultBackend。
  如果未设置 DefaultBackend，则不符合任何规则的请求的处理将由 Ingress 控制器决定。

- **ingressClassName** (string)

  IngressClassName 是 IngressClass 群集资源的名称。
  关联的 Ingress 类定义了将实现资源的控制器。
  这将取代不推荐使用的 `kubernetes.io/ingress.class` 注释。
  为了向后兼容，当设置该注释时，它必须优先于此字段。
  如果字段和注释具有不同的值，控制器可能会发出警告。
  此 API 的实现应忽略未指定类的入口。
  IngressClass 资源可标记为default，可用于设置此字段的默认值。
  有关更多信息，请参阅 IngressClass 文档。

<!--
- **rules** ([]IngressRule)

  *Atomic: will be replaced during a merge*
  
  A list of host rules used to configure the Ingress. If unspecified, or no rule matches, all traffic is sent to the default backend.

  <a name="IngressRule"></a>
  *IngressRule represents the rules mapping the paths under a specified host to the related backend services. Incoming requests are first evaluated for a host match, then routed to the backend associated with the matching IngressRuleValue.*

  - **rules.host** (string)

    Host is the fully qualified domain name of a network host, as defined by RFC 3986. Note the following deviations from the "host" part of the URI as defined in RFC 3986: 1. IPs are not allowed. Currently an IngressRuleValue can only apply to
       the IP in the Spec of the parent Ingress.
    2. The `:` delimiter is not respected because ports are not allowed.
    	  Currently the port of an Ingress is implicitly :80 for http and
    	  :443 for https.
    Both these may change in the future. Incoming requests are matched against the host before the IngressRuleValue. If the host is unspecified, the Ingress routes all traffic based on the specified IngressRuleValue.
    
    Host can be "precise" which is a domain name without the terminating dot of a network host (e.g. "foo.bar.com") or "wildcard", which is a domain name prefixed with a single wildcard label (e.g. "*.foo.com"). The wildcard character '*' must appear by itself as the first DNS label and matches only a single label. You cannot have a wildcard label by itself (e.g. Host == "*"). Requests will be matched against the Host field in the following way: 1. If Host is precise, the request matches this rule if the http host header is equal to Host. 2. If Host is a wildcard, then the request matches this rule if the http host header is to equal to the suffix (removing the first label) of the wildcard rule.
-->
- **rules** ([]IngressRule)

  *Atomic: 将在合并期间被替换*
  
  用于配置入口的主机规则列表。
  如果未指定或没有规则匹配，则所有流量都将发送到默认后端。

  <a name="IngressRule"></a>
  *IngressRule表示将指定主机下的路径映射到相关后端服务的规则。传入请求首先评估主机匹配，然后路由到与匹配的 IngressRuleValue 关联的后端。*

  - **rules.host** (string)

    主机是RFC 3986 定义的网络主机的完全限定域名。请注意以下与 RFC 3986 中定义的 URI 的“主机”部分的偏差：
    1.不允许 IP。当前 IngressRuleValue 只能应用于父 Ingress Spec 中的 IP。
    2. 由于不允许使用端口，因此不遵守“：”分隔符。
    当前 Ingress 的端口隐式为：
    :80用于 http
    :443 用于 https。
    这两种情况在未来都可能发生变化。
    传入请求在 IngressRuleValue 之前与主机匹配。
    如果主机未指定， Ingress 将根据指定的 IngressRuleValue 规则路由所有流量。
    
    主机可以是“精确“的，它是一个没有网络主机终止点的域名（例如 “foo.bar.com” ）或“通配符”，它是一个以单个通配符标签为前缀的域名（例如 “*.foo.com”）。
    通配符 “*” 必须单独显示为第一个 DNS 标签，并且仅与单个标签匹配。
    您不能单独拥有通配符标签（例如，Host=“*”）。
    请求将按以下方式与主机字段匹配：1.如果主机是精确的，则如果 http 主机标头等于主机，则请求与此规则匹配。
    2、如果主机是通配符，那么如果 http 主机头等于通配符规则的后缀（删除第一个标签），则请求与此规则匹配。

<!-->
  - **rules.http** (HTTPIngressRuleValue)


    <a name="HTTPIngressRuleValue"></a>
    *HTTPIngressRuleValue is a list of http selectors pointing to backends. In the example: http://<host>/<path>?<searchpart> -> backend where where parts of the url correspond to RFC 3986, this resource will be used to match against everything after the last '/' and before the first '?' or '#'.*
-->
- **rules.http** (HTTPIngressRuleValue)


    <a name="HTTPIngressRuleValue"></a>
    *HTTPIngressRuleValue 是指向后端的 http 选择器列表。在示例中 http://<host>/<path>?<searchpart> -> 其中url的部分对应 于RFC 3986，此资源将用于匹配最后一个 “/” 之后和第一个“ ？”之前的所有内容或 “#”。*
<!--
    - **rules.http.paths** ([]HTTPIngressPath), required

      *Atomic: will be replaced during a merge*
      
      A collection of paths that map requests to backends.

      <a name="HTTPIngressPath"></a>
      *HTTPIngressPath associates a path with a backend. Incoming urls matching the path are forwarded to the backend.*

      - **rules.http.paths.backend** (<a href="{{< ref "../service-resources/ingress-v1#IngressBackend" >}}">IngressBackend</a>), required

        Backend defines the referenced service endpoint to which the traffic will be forwarded to.
-->
    - **rules.http.paths** ([]HTTPIngressPath), 必选

      *Atomic: 将在合并期间被替换*
      
      将请求映射到后端的路径集合。.

      <a name="HTTPIngressPath"></a>
      *HTTPIngressPath 将路径与后端关联。与路径匹配的传入 URL 将转发到后端。*

      - **rules.http.paths.backend** (<a href="{{< ref "../service-resources/ingress-v1#IngressBackend" >}}">IngressBackend</a>), 必选

        后端定义将流量转发到的引用服务端点。

<!--
      - **rules.http.paths.pathType** (string), required

        PathType determines the interpretation of the Path matching. PathType can be one of the following values: * Exact: Matches the URL path exactly. * Prefix: Matches based on a URL path prefix split by '/'. Matching is
          done on a path element by element basis. A path element refers is the
          list of labels in the path split by the '/' separator. A request is a
          match for path p if every p is an element-wise prefix of p of the
          request path. Note that if the last element of the path is a substring
          of the last element in request path, it is not a match (e.g. /foo/bar
          matches /foo/bar/baz, but does not match /foo/barbaz).
        * ImplementationSpecific: Interpretation of the Path matching is up to
          the IngressClass. Implementations can treat this as a separate PathType
          or treat it identically to Prefix or Exact path types.
        Implementations are required to support all path types.
-->
      - **rules.http.paths.pathType** (string), 必选

       路径类型决定路径匹配的解释。路径类型可以是以下值之一：*精确：与URL路径完全匹配。*前缀：根据按“/”拆分的URL路径前缀进行匹配。
       匹配是按路径元素逐个元素完成。
       路径元素引用的是路径中由“/”分隔符拆分的标签列表。
       如果每个p都是请求路径p的元素前缀，则请求与路径p匹配。
       请注意，如果路径的最后一个元素是子字符串对于请求路径中的最后一个元素，它不匹配（例如/foo/bar匹配/foo/bar/baz，但不匹配/foo/barbaz）。
        * 具体实现：路径匹配的解释取决于 IngressClass。
        实现可以将其视为单独的路径类型，也可以将其视为前缀或确切的路径类型。
        实现需要支持所有路径类型。

<!--
      - **rules.http.paths.path** (string)

        Path is matched against the path of an incoming request. Currently it can contain characters disallowed from the conventional "path" part of a URL as defined by RFC 3986. Paths must begin with a '/' and must be present when using PathType with value "Exact" or "Prefix".
-->
      - **rules.http.paths.path** (string)

        路径与传入请求的路径匹配。
        目前，它可以包含 RFC 3986 定义的 URL 的常规“路径”部分不允许的字符。
        路径必须以“/”开头，并且在使用值为 “Exact” 或 “Prefix” 的路径类型时必须存在。

<!--
- **tls** ([]IngressTLS)

  *Atomic: will be replaced during a merge*
  
  TLS configuration. Currently the Ingress only supports a single TLS port, 443. If multiple members of this list specify different hosts, they will be multiplexed on the same port according to the hostname specified through the SNI TLS extension, if the ingress controller fulfilling the ingress supports SNI.
-->
  - **tls** ([]IngressTLS)

  *Atomic: 将在合并期间被替换*
  
  TLS配置。
  目前，入口仅支持一个TLS端口443。 
  如果此列表的多个成员指定了不同的主机，如果实现 ingress 的 ingress 控制器支持SNI，则它们将根据通过 SNI TLS 扩展指定的主机名在同一端口上多路复用。

<!--
  <a name="IngressTLS"></a>
  *IngressTLS describes the transport layer security associated with an Ingress.*

  - **tls.hosts** ([]string)

    *Atomic: will be replaced during a merge*
    
    Hosts are a list of hosts included in the TLS certificate. The values in this list must match the name/s used in the tlsSecret. Defaults to the wildcard host setting for the loadbalancer controller fulfilling this Ingress, if left unspecified.
-->
<a name="IngressTLS"></a>
  *IngressTLS 描述与 Ingress 相关的传输层安全性。*

  - **tls.hosts** ([]string)

    *Atomic: 将在合并期间被替换*
    
    主机是TLS证书中包含的主机列表。
    此列表中的值必须与 tlsSecret 中使用的名称匹配。
    默认为实现此 Ingress 的负载均衡控制器的通配符主机设置（如果未指定）。

<!--
  - **tls.secretName** (string)

    SecretName is the name of the secret used to terminate TLS traffic on port 443. Field is left optional to allow TLS routing based on SNI hostname alone. If the SNI host in a listener conflicts with the "Host" header field used by an IngressRule, the SNI host is used for termination and value of the Host header is used for routing.
-->
  - **tls.secretName** (string)

    SecretName 是用于终止端口 443 上 TLS 通信的密码的名称。
    字段是可选的，以允许仅基于SNI主机名的 TLS 路由。
    如果侦听器中的SNI主机与入口规则使用的“主机”标头字段冲突，则 SNI 主机用于终止，主机标头的值用于路由。


<!--
## IngressBackend {#IngressBackend}

IngressBackend describes all endpoints for a given service and port.
-->
## IngressBackend {#IngressBackend}

IngressBackend 描述给定服务和端口的所有端点。

<!-->
<hr>

- **resource** (<a href="{{< ref "../common-definitions/typed-local-object-reference#TypedLocalObjectReference" >}}">TypedLocalObjectReference</a>)

  Resource is an ObjectRef to another Kubernetes resource in the namespace of the Ingress object. If resource is specified, a service.Name and service.Port must not be specified. This is a mutually exclusive setting with "Service".
-->
<hr>

- **resource** (<a href="{{< ref "../common-definitions/typed-local-object-reference#TypedLocalObjectReference" >}}">TypedLocalObjectReference</a>)

  Resource 是 Ingress 对象命名空间中另一个 Kubernetes 资源的 ObjectRef。
  如果指定了资源，则 service.Name 和 service.Port不能指定。
  这是一个与“服务”互斥的设置。

<!--
- **service** (IngressServiceBackend)

  Service references a Service as a Backend. This is a mutually exclusive setting with "Resource".

  <a name="IngressServiceBackend"></a>
  *IngressServiceBackend references a Kubernetes Service as a Backend.*
-->
- **service** (IngressServiceBackend)

  Service 引用一个 Service 作为后端。
  这是一个与 “Resource” 互斥的设置。

<!--
  <a name="IngressServiceBackend"></a>
  *IngressServiceBackend references a Kubernetes Service as a Backend.*

  - **service.name** (string), required

    Name is the referenced service. The service must exist in the same namespace as the Ingress object.
-->
   <a name="IngressServiceBackend"></a>
  *IngressServiceBackend 引用一个 Kubernetes Service 作为后端。*

  - **service.name** (string), 必选

   Name 是引用的 service。service 必须与 Ingress 对象位于同一命名空间中。

<!--
  - **service.port** (ServiceBackendPort)

    Port of the referenced service. A port name or port number is required for a IngressServiceBackend.

    <a name="ServiceBackendPort"></a>
    *ServiceBackendPort is the service port being referenced.*
-->
  - **service.port** (ServiceBackendPort)

    引用 service 的端口。IngressServiceBackend 需要端口名或端口号。

    <a name="ServiceBackendPort"></a>
    *ServiceBackendPort 是被引用的 service 的端口。*

<!--
    - **service.port.name** (string)

      Name is the name of the port on the Service. This is a mutually exclusive setting with "Number".

    - **service.port.number** (int32)

      Number is the numerical port number (e.g. 80) on the Service. This is a mutually exclusive setting with "Name".
-->
    - **service.port.name** (string)

      Name 是 service 上端口的名称。
      这是一个与 “Number” 互斥的设置。

    - **service.port.number** (int32)

      Number是 service 上的数字端口号（例如80）。
      这是一个与 “Name” 的互斥设置。



<!--
## IngressStatus {#IngressStatus}

IngressStatus describe the current state of the Ingress.

<hr>
-->
## IngressStatus {#IngressStatus}

IngressStatus 描述 Ingress 当前状态。

<hr>

<!--
- **loadBalancer** (LoadBalancerStatus)

  LoadBalancer contains the current status of the load-balancer.

  <a name="LoadBalancerStatus"></a>
  *LoadBalancerStatus represents the status of a load-balancer.*
-->
- **loadBalancer** (LoadBalancerStatus)

  LoadBalancer 包含负载平衡器的当前状态。

  <a name="LoadBalancerStatus"></a>
  *LoadBalancerStatus 表示负载平衡器的状态。*

<!-->
  - **loadBalancer.ingress** ([]LoadBalancerIngress)

    Ingress is a list containing ingress points for the load-balancer. Traffic intended for the service should be sent to these ingress points.

    <a name="LoadBalancerIngress"></a>
    *LoadBalancerIngress represents the status of a load-balancer ingress point: traffic intended for the service should be sent to an ingress point.*
-->
  - **loadBalancer.ingress** ([]LoadBalancerIngress)

   Ingress 是一个包含负载平衡器入口点的列表。
   用于服务的流量应发送到这些入口点。

    <a name="LoadBalancerIngress"></a>
    *LoadBalancerIngress 表示负载平衡器入口点的状态：用于服务的流量应发送到入口点。*

<!--
    - **loadBalancer.ingress.hostname** (string)

      Hostname is set for load-balancer ingress points that are DNS based (typically AWS load-balancers)

    - **loadBalancer.ingress.ip** (string)

      IP is set for load-balancer ingress points that are IP based (typically GCE or OpenStack load-balancers)
-->
    - **loadBalancer.ingress.hostname** (string)

      为基于 DNS 的负载平衡器入口点设置主机名（通常为 AWS 负载平衡器）

    - **loadBalancer.ingress.ip** (string)

      为基于 IP 的负载平衡器入口点设置 IP（通常为 GCE 或 OpenStack 负载平衡器）

<!--
    - **loadBalancer.ingress.ports** ([]PortStatus)

      *Atomic: will be replaced during a merge*
      
      Ports is a list of records of service ports If used, every port defined in the service should have an entry in it

      <a name="PortStatus"></a>
      **
-->
    - **loadBalancer.ingress.ports** ([]PortStatus)

      *Atomic: 将在合并期间被替换*
      
      Ports 是服务端口的记录列表（如果使用），服务中定义的每个端口中都应该有一个条目

      <a name="PortStatus"></a>
      **

<!--
      - **loadBalancer.ingress.ports.port** (int32), required

        Port is the port number of the service port of which status is recorded here

      - **loadBalancer.ingress.ports.protocol** (string), required

        Protocol is the protocol of the service port of which status is recorded here The supported values are: "TCP", "UDP", "SCTP"
-->        
   - **loadBalancer.ingress.ports.port** (int32), 必选

        Port 是此处记录其状态的服务端口的端口号

      - **loadBalancer.ingress.ports.protocol** (string), 必选

        Protocol 是服务端口的协议，其状态记录在此。
        支持的值为：“TCP”、“UDP”、“SCTP”     

<!--
      - **loadBalancer.ingress.ports.error** (string)

        Error is to record the problem with the service port The format of the error shall comply with the following rules: - built-in error values shall be specified in this file and those shall use
          CamelCase names
        - cloud provider specific error values must have names that comply with the
          format foo.example.com/CamelCase.
-->
- **loadBalancer.ingress.ports.error** (string)

       错误是记录服务端口的问题。
       错误的格式应符合以下规则：
        -应在此文件中指定内置错误值，这些值应使用 CamelCase 名称
        - 云提供程序特定的错误值的名称必须符合 foo.example.com/CamelCase 格式。


<!--
## IngressList {#IngressList}

IngressList is a collection of Ingress.

-->
## IngressList {#IngressList}

IngressList 是 Ingress 的集合。

<!--
- **items** ([]<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>), required

  Items is the list of Ingress.
  
-->

<hr>


- **items** ([]<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>), 必选

  Items 是 Ingress 列表。

<!--
- **apiVersion** (string)

  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
-->
- **apiVersion** (string)

  APIVersion定义对象表示的版本化架构。
  服务器应将已识别的架构转换为最新的内部值，并且可能会拒绝未识别的值。
  更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

<!-->
- **kind** (string)

  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **kind** (string)

  Kind 是一个字符串值，表示此对象表示的REST资源。
  服务器可以从客户端向其提交请求的端点推断出这一点。
  不能被更新。
  在CamelCase。
  更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准对象的元数据。更多信息: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata




## Operations {#Operations}



<hr>





<!--
### `get` read the specified Ingress

#### HTTP Request

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}

#### Parameters
-->
### `get` 读取指定的 Ingress

#### HTTP 请求

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Ingress


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (*in path*): string, 必选

  Ingress名称


- **namespace** (*in path*): string, 必选

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response


200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

401: 未授权

<!--
### `get` read status of the specified Ingress

#### HTTP Request

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}/status

#### Parameters
-->
### `get`读取指定 Ingress 状态

#### HTTP 请求

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Ingress


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (*in path*): string, 必选

  Ingress名称


- **namespace** (*in path*): string, 必选

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response


200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

401: Unauthorized
-->

<!--
### `list` list or watch objects of kind Ingress

#### HTTP Request

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses

#### Parameters
-->
### `list` 列出或查看 Ingress 类型对象

#### HTTP 请求

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses

#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
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


<!-->
#### Response


200 (<a href="{{< ref "../service-resources/ingress-v1#IngressList" >}}">IngressList</a>): OK

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/ingress-v1#IngressList" >}}">IngressList</a>): OK

401: 未授权

<!--
### `list` list or watch objects of kind Ingress

#### HTTP Request

GET /apis/networking.k8s.io/v1/ingresses

#### Parameters
-->
### `list` 列出或查看 Ingress 类型对象

#### HTTP 请求

GET /apis/networking.k8s.io/v1/ingresses

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


200 (<a href="{{< ref "../service-resources/ingress-v1#IngressList" >}}">IngressList</a>): OK

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/ingress-v1#IngressList" >}}">IngressList</a>): OK

401: 未授权

200 (<a href="{{< ref "../service-resources/ingress-v1#IngressList" >}}">IngressList</a>): OK

401: Unauthorized

<!--
### `create` create an Ingress

#### HTTP Request

POST /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses

#### Parameters
-->
### `create` 创建一个 Ingress

#### HTTP 请求

POST /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses

#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, required
-->
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, 必选
  


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


200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

202 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Accepted

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

202 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Accepted

401: 未授权

<!--
### `update` replace the specified Ingress

#### HTTP Request

PUT /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}

#### Parameters
-->
### `update` 替换指定的 Ingress

#### HTTP 请求

PUT /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Ingress


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, required
-->
- **name** (*in path*): string, 必选

  Ingress名称


- **namespace** (*in path*): string, 必选

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, 必选
 


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


200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

401: Unauthorized
-->

<!--
### `update` replace status of the specified Ingress

#### HTTP Request

PUT /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}/status

#### Parameters
-->
### `update` 替换指定 Ingress 的状态

#### HTTP 请求

PUT /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Ingress


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, required
-->
- **name** (*in path*): string, 必选

  Ingress名称


- **namespace** (*in path*): string, 必选

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>, 必选



- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!-->
#### Response


200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

401: 未授权

<!--
### `patch` partially update the specified Ingress

#### HTTP Request

PATCH /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}

#### Parameters
-->
### `patch` 部分更新指定的 Ingress

#### HTTP 请求

PATCH /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Ingress


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **name** (*in path*): string, 必选

  Ingress名称


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


200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

401: 未授权

<!--
### `patch` partially update status of the specified Ingress

#### HTTP Request

PATCH /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}/status

#### Parameters
-->
### `patch` 部分更新指定 Ingress 的状态

#### HTTP 请求

PATCH /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Ingress


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **name** (*in path*): string, required

  Ingress名称


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


200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

401: Unauthorized
-->
#### 应答


200 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): OK

201 (<a href="{{< ref "../service-resources/ingress-v1#Ingress" >}}">Ingress</a>): Created

401: 未授权

<!--
### `delete` delete an Ingress

#### HTTP Request

DELETE /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}

#### Parameters
-->
### `delete` 删除一个 Ingress

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the Ingress


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **name** (*in path*): string, 必选

  Ingress名称


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
### `deletecollection` delete collection of Ingress

#### HTTP Request

DELETE /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses

#### Parameters
-->
### `deletecollection` 删除 Ingress 集合

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1/namespaces/{namespace}/ingresses

#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
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
