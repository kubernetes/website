---
title: Gateway API
content_type: concept
description: >-
  网关（Gateway）API 是一组 API 类别，可提供动态基础设施配置和高级流量路由。
weight: 55
---

<!-- 
title: Gateway API
content_type: concept
description: >-
  Gateway API is a family of API kinds that provide dynamic infrastructure provisioning
  and advanced traffic routing.
weight: 55
 -->

<!-- overview -->

<!-- 
Make network services available by using an extensible, role-oriented, protocol-aware configuration
mechanism. [Gateway API](https://gateway-api.sigs.k8s.io/) is an {{<glossary_tooltip text="add-on" term_id="addons">}}
containing API [kinds](https://gateway-api.sigs.k8s.io/references/spec/) that provide dynamic infrastructure
provisioning and advanced traffic routing.
-->
[Gateway API](https://gateway-api.sigs.k8s.io/) 通过使用可扩展的、角色导向的、
协议感知的配置机制来提供网络服务。它是一个{{<glossary_tooltip text="附加组件" term_id="addons">}}，
包含可提供动态基础设施配置和高级流量路由的
API [类别](https://gateway-api.sigs.k8s.io/references/spec/)。

<!-- body -->

<!-- 
## Design principles

The following principles shaped the design and architecture of Gateway API:
-->
## 设计原则 {#design-principles}

Gateway API 的设计和架构遵从以下原则：

<!-- 
* __Role-oriented:__ Gateway API kinds are modeled after organizational roles that are
  responsible for managing Kubernetes service networking:
  * __Infrastructure Provider:__ Manages infrastructure that allows multiple isolated clusters
    to serve multiple tenants, e.g. a cloud provider.
  * __Cluster Operator:__ Manages clusters and is typically concerned with policies, network
    access, application permissions, etc.
  * __Application Developer:__ Manages an application running in a cluster and is typically
    concerned with application-level configuration and [Service](/docs/concepts/services-networking/service/)
    composition.
-->
* **角色导向：** Gateway API 类别是基于负责管理 Kubernetes 服务网络的组织角色建模的：
  * **基础设施提供者：** 管理使用多个独立集群为多个租户提供服务的基础设施，例如，云提供商。
  * **集群操作员：** 管理集群，通常关注策略、网络访问、应用程序权限等。
  * **应用程序开发人员：** 管理在集群中运行的应用程序，通常关注应用程序级配置和 [Service](/zh-cn/docs/concepts/services-networking/service/) 组合。

<!-- 
* __Portable:__ Gateway API specifications are defined as [custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources)
  and are supported by many [implementations](https://gateway-api.sigs.k8s.io/implementations/).
* __Expressive:__ Gateway API kinds support functionality for common traffic routing use cases
  such as header-based matching, traffic weighting, and others that were only possible in
  [Ingress](/docs/concepts/services-networking/ingress/) by using custom annotations.
* __Extensible:__ Gateway allows for custom resources to be linked at various layers of the API.
  This makes granular customization possible at the appropriate places within the API structure.
-->
* **可移植：** Gateway API 规范用[自定义资源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources)来定义，
  并受到许多[实现](https://gateway-api.sigs.k8s.io/implementations/)的支持。
* **表达能力强：** Gateway API 类别支持常见流量路由场景的功能，例如基于标头的匹配、流量加权以及其他只能在
  [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 中使用自定义注解才能实现的功能。
* **可扩展的：** Gateway 允许在 API 的各个层链接自定义资源。这使得在 API 结构内的适当位置进行精细定制成为可能。

<!-- 
## Resource model

Gateway API has three stable API kinds:
-->
## 资源模型 {#resource-model}

Gateway API 具有三种稳定的 API 类别：

<!-- 
* __GatewayClass:__ Defines a set of gateways with common configuration and managed by a controller
  that implements the class.

* __Gateway:__ Defines an instance of traffic handling infrastructure, such as cloud load balancer.

* __HTTPRoute:__ Defines HTTP-specific rules for mapping traffic from a Gateway listener to a
  representation of backend network endpoints. These endpoints are often represented as a
  {{<glossary_tooltip text="Service" term_id="service">}}.
-->
* **GatewayClass：** 定义一组具有配置相同的网关，由实现该类的控制器管理。

* **Gateway：** 定义流量处理基础设施（例如云负载均衡器）的一个实例。

* **HTTPRoute：** 定义特定于 HTTP 的规则，用于将流量从网关监听器映射到后端网络端点的表示。
  这些端点通常表示为 {{<glossary_tooltip text="Service" term_id="service">}}。

<!-- 
Gateway API is organized into different API kinds that have interdependent relationships to support
the role-oriented nature of organizations. A Gateway object is associated with exactly one GatewayClass;
the GatewayClass describes the gateway controller responsible for managing Gateways of this class.
One or more route kinds such as HTTPRoute, are then associated to Gateways. A Gateway can filter the routes
that may be attached to its `listeners`, forming a bidirectional trust model with routes.
-->
Gateway API 被组织成不同的 API 类别，这些 API 类别具有相互依赖的关系，以支持组织中角色导向的特点。
一个 Gateway 对象只能与一个 GatewayClass 相关联；GatewayClass 描述负责管理此类 Gateway 的网关控制器。
各个（可以是多个）路由类别（例如 HTTPRoute）可以关联到此 Gateway 对象。
Gateway 可以对能够挂接到其 `listeners` 的路由进行过滤，从而与路由形成双向信任模型。


<!-- 
The following figure illustrates the relationships of the three stable Gateway API kinds:

{{< figure src="/docs/images/gateway-kind-relationships.svg" alt="A figure illustrating the relationships of the three stable Gateway API kinds" class="diagram-medium" >}}
-->
下图说明这三个稳定的 Gateway API 类别之间的关系：

{{< figure src="/docs/images/gateway-kind-relationships.svg" alt="此图呈现的是三个稳定的 Gateway API 类别之间的关系" class="diagram-medium" >}}

<!-- 
### GatewayClass {#api-kind-gateway-class}

Gateways can be implemented by different controllers, often with different configurations. A Gateway
must reference a GatewayClass that contains the name of the controller that implements the
class.

A minimal GatewayClass example:
-->
### GatewayClass {#api-kind-gateway-class}

Gateway 可以由不同的控制器实现，通常具有不同的配置。
Gateway 必须引用某 GatewayClass，而后者中包含实现该类的控制器的名称。

下面是一个最精简的 GatewayClass 示例：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: example-class
spec:
  controllerName: example.com/gateway-controller
```

<!-- 
In this example, a controller that has implemented Gateway API is configured to manage GatewayClasses
with the controller name `example.com/gateway-controller`. Gateways of this class will be managed by
the implementation's controller.

See the [GatewayClass](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.GatewayClass)
reference for a full definition of this API kind.
-->
在此示例中，一个实现了 Gateway API 的控制器被配置为管理某些 GatewayClass 对象，
这些对象的控制器名为 `example.com/gateway-controller`。
归属于此类的 Gateway 对象将由此实现的控制器来管理。

有关此 API 类别的完整定义，请参阅
[GatewayClass](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.GatewayClass)。

<!-- 
### Gateway {#api-kind-gateway}

A Gateway describes an instance of traffic handling infrastructure. It defines a network endpoint
that can be used for processing traffic, i.e. filtering, balancing, splitting, etc. for backends
such as a Service. For example, a Gateway may represent a cloud load balancer or an in-cluster proxy
server that is configured to accept HTTP traffic.

A minimal Gateway resource example:
-->
### Gateway {#api-kind-gateway}

Gateway 用来描述流量处理基础设施的一个实例。Gateway 定义了一个网络端点，该端点可用于处理流量，
即对 Service 等后端进行过滤、平衡、拆分等。
例如，Gateway 可以代表某个云负载均衡器，或配置为接受 HTTP 流量的集群内代理服务器。

下面是一个精简的 Gateway 资源示例：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-class
  listeners:
  - name: http
    protocol: HTTP
    port: 80
```

<!-- 
In this example, an instance of traffic handling infrastructure is programmed to listen for HTTP
traffic on port 80. Since the `addresses` field is unspecified, an address or hostname is assigned
to the Gateway by the implementation's controller. This address is used as a network endpoint for
processing traffic of backend network endpoints defined in routes.

See the [Gateway](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.Gateway)
reference for a full definition of this API kind.
-->
在此示例中，流量处理基础设施的实例被编程为监听 80 端口上的 HTTP 流量。
由于未指定 `addresses` 字段，因此对应实现的控制器负责将地址或主机名设置到 Gateway 之上。
该地址用作网络端点，用于处理路由中定义的后端网络端点的流量。

有关此类 API 的完整定义，请参阅 [Gateway](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.Gateway)。

<!-- 
### HTTPRoute {#api-kind-httproute}

The HTTPRoute kind specifies routing behavior of HTTP requests from a Gateway listener to backend network
endpoints. For a Service backend, an implementation may represent the backend network endpoint as a Service
IP or the backing Endpoints of the Service. An HTTPRoute represents configuration that is applied to the
underlying Gateway implementation. For example, defining a new HTTPRoute may result in configuring additional
traffic routes in a cloud load balancer or in-cluster proxy server.

A minimal HTTPRoute example:
-->
### HTTPRoute {#api-kind-httproute}

HTTPRoute 类别指定从 Gateway 监听器到后端网络端点的 HTTP 请求的路由行为。
对于服务后端，实现可以将后端网络端点表示为服务 IP 或服务的支持端点。
HTTPRoute 表示将被应用到下层 Gateway 实现的配置。
例如，定义新的 HTTPRoute 可能会导致在云负载均衡器或集群内代理服务器中配置额外的流量路由。

下面是一个最精简的 HTTPRoute 示例：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-httproute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "www.example.com"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /login
    backendRefs:
    - name: example-svc
      port: 8080
```

<!-- 
In this example, HTTP traffic from Gateway `example-gateway` with the Host: header set to `www.example.com`
and the request path specified as `/login` will be routed to Service `example-svc` on port `8080`.

See the [HTTPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.HTTPRoute)
reference for a full definition of this API kind.
-->
在此示例中，来自 Gateway `example-gateway` 的 HTTP 流量，
如果 Host 的标头设置为 `www.example.com` 且请求路径指定为 `/login`，
将被路由到 Service `example-svc` 的 `8080` 端口。

有关此类 API 的完整定义，请参阅 [HTTPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.HTTPRoute)。

<!-- 
## Request flow

Here is a simple example of HTTP traffic being routed to a Service by using a Gateway and an HTTPRoute:

{{< figure src="/docs/images/gateway-request-flow.svg" alt="A diagram that provides an example of HTTP traffic being routed to a Service by using a Gateway and an HTTPRoute" class="diagram-medium" >}}

In this example, the request flow for a Gateway implemented as a reverse proxy is:
-->
## 请求数据流 {#request-flow}

以下是使用 Gateway 和 HTTPRoute 将 HTTP 流量路由到服务的简单示例：

{{< figure src="/docs/images/gateway-request-flow.svg" alt="此图为使用 Gateway 和 HTTPRoute 将 HTTP 流量路由到服务的示例" class="diagram-medium" >}}

在此示例中，实现为反向代理的 Gateway 的请求数据流如下：

<!--
1. The client starts to prepare an HTTP request for the URL `http://www.example.com`
2. The client's DNS resolver queries for the destination name and learns a mapping to
   one or more IP addresses associated with the Gateway.
3. The client sends a request to the Gateway IP address; the reverse proxy receives the HTTP
   request and uses the Host: header to match a configuration that was derived from the Gateway
   and attached HTTPRoute.
4. Optionally, the reverse proxy can perform request header and/or path matching based
   on match rules of the HTTPRoute.
5. Optionally, the reverse proxy can modify the request; for example, to add or remove headers,
   based on filter rules of the HTTPRoute.
6. Lastly, the reverse proxy forwards the request to one or more backends.
-->
1. 客户端开始准备 URL 为 `http://www.example.com` 的 HTTP 请求
2. 客户端的 DNS 解析器查询目标名称并了解与 Gateway 关联的一个或多个 IP 地址的映射。
3. 客户端向 Gateway IP 地址发送请求；反向代理接收 HTTP 请求并使用 Host: 
   标头来匹配基于 Gateway 和附加的 HTTPRoute 所获得的配置。
4. 可选的，反向代理可以根据 HTTPRoute 的匹配规则进行请求头和（或）路径匹配。
5. 可选地，反向代理可以修改请求；例如，根据 HTTPRoute 的过滤规则添加或删除标头。
6. 最后，反向代理将请求转发到一个或多个后端。

<!-- 
## Conformance

Gateway API covers a broad set of features and is widely implemented. This combination requires
clear conformance definitions and tests to ensure that the API provides a consistent experience
wherever it is used.

See the [conformance](https://gateway-api.sigs.k8s.io/concepts/conformance/) documentation to
understand details such as release channels, support levels, and running conformance tests.
-->
## 标准合规性 {#conformance}

Gateway API 涵盖广泛的功能并得到广泛实现。
这种组合需要明确的标准合规性定义和测试，以确保 API 在任何地方使用时都能提供一致的体验。

请参阅[合规性](https://gateway-api.sigs.k8s.io/concepts/conformance/)相关的文档，
以了解发布渠道、支持级别和运行合规性测试等详细信息。

<!-- 
## Migrating from Ingress

Gateway API is the successor to the [Ingress](/docs/concepts/services-networking/ingress/) API.
However, it does not include the Ingress kind. As a result, a one-time conversion from your existing
Ingress resources to Gateway API resources is necessary.

Refer to the [ingress migration](https://gateway-api.sigs.k8s.io/guides/migrating-from-ingress/#migrating-from-ingress)
guide for details on migrating Ingress resources to Gateway API resources.
-->
## 从 Ingress 迁移 {#migrating-from-ingress}

Gateway API 是 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) API 的后继者。
但是其中不包括 Ingress 类型。因此，需要将现有 Ingress 资源一次性转换为 Gateway API 资源。

有关将 Ingress 资源迁移到 Gateway API 资源的详细信息，请参阅
[Ingress 迁移](https://gateway-api.sigs.k8s.io/guides/migrating-from-ingress/#migrating-from-ingress)指南。

## {{% heading "whatsnext" %}}

<!-- 
Instead of Gateway API resources being natively implemented by Kubernetes, the specifications
are defined as [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
supported by a wide range of [implementations](https://gateway-api.sigs.k8s.io/implementations/).
[Install](https://gateway-api.sigs.k8s.io/guides/#installing-gateway-api) the Gateway API CRDs or
follow the installation instructions of your selected implementation. After installing an
implementation, use the [Getting Started](https://gateway-api.sigs.k8s.io/guides/) guide to help
you quickly start working with Gateway API. 
-->
Gateway API 资源不是由 Kubernetes 原生实现的，
而是被定义为受广泛[实现](https://gateway-api.sigs.k8s.io/implementations/)支持的[自定义资源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。
用户需要[安装](https://gateway-api.sigs.k8s.io/guides/#installing-gateway-api) Gateway API CRD
或按照所选实现的安装说明进行操作。
安装完成后，使用[入门](https://gateway-api.sigs.k8s.io/guides/)指南来帮助你快速开始使用 Gateway API。

{{< note >}}
<!-- 
Make sure to review the documentation of your selected implementation to understand any caveats.
-->
请务必查看所选实现的文档以了解可能存在的注意事项。
{{< /note >}}

<!-- 
Refer to the [API specification](https://gateway-api.sigs.k8s.io/reference/spec/) for additional
details of all Gateway API kinds.
-->
有关所有 Gateway API 类型的其他详细信息，请参阅 [API 规范](https://gateway-api.sigs.k8s.io/reference/spec/)。
