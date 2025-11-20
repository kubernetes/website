---
title: Gateway API
content_type: concept
description: >-
  網關（Gateway）API 是一組 API 類別，可提供動態基礎設施設定和高級流量路由。
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
[Gateway API](https://gateway-api.sigs.k8s.io/) 通過使用可擴展的、角色導向的、
協議感知的設定機制來提供網路服務。它是一個{{<glossary_tooltip text="附加組件" term_id="addons">}}，
包含可提供動態基礎設施設定和高級流量路由的
API [類別](https://gateway-api.sigs.k8s.io/references/spec/)。

<!-- body -->

<!-- 
## Design principles

The following principles shaped the design and architecture of Gateway API:
-->
## 設計原則 {#design-principles}

Gateway API 的設計和架構遵從以下原則：

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
* **角色導向：** Gateway API 類別是基於負責管理 Kubernetes 服務網路的組織角色建模的：
  * **基礎設施提供者：** 管理使用多個獨立叢集爲多個租戶提供服務的基礎設施，例如，雲提供商。
  * **叢集操作員：** 管理叢集，通常關注策略、網路訪問、應用程式權限等。
  * **應用程式開發人員：** 管理在叢集中運行的應用程式，通常關注應用程式級設定和 [Service](/zh-cn/docs/concepts/services-networking/service/) 組合。

<!-- 
* __Portable:__ Gateway API specifications are defined as [custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources)
  and are supported by many [implementations](https://gateway-api.sigs.k8s.io/implementations/).
* __Expressive:__ Gateway API kinds support functionality for common traffic routing use cases
  such as header-based matching, traffic weighting, and others that were only possible in
  [Ingress](/docs/concepts/services-networking/ingress/) by using custom annotations.
* __Extensible:__ Gateway allows for custom resources to be linked at various layers of the API.
  This makes granular customization possible at the appropriate places within the API structure.
-->
* **可移植：** Gateway API 規範用[自定義資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources)來定義，
  並受到許多[實現](https://gateway-api.sigs.k8s.io/implementations/)的支持。
* **表達能力強：** Gateway API 類別支持常見流量路由場景的功能，例如基於標頭的匹配、流量加權以及其他只能在
  [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 中使用自定義註解才能實現的功能。
* **可擴展的：** Gateway 允許在 API 的各個層鏈接自定義資源。這使得在 API 結構內的適當位置進行精細定製成爲可能。

<!-- 
## Resource model

Gateway API has three stable API kinds:
-->
## 資源模型 {#resource-model}

Gateway API 具有三種穩定的 API 類別：

<!-- 
* __GatewayClass:__ Defines a set of gateways with common configuration and managed by a controller
  that implements the class.

* __Gateway:__ Defines an instance of traffic handling infrastructure, such as cloud load balancer.

* __HTTPRoute:__ Defines HTTP-specific rules for mapping traffic from a Gateway listener to a
  representation of backend network endpoints. These endpoints are often represented as a
  {{<glossary_tooltip text="Service" term_id="service">}}.
-->
* **GatewayClass：** 定義一組具有設定相同的網關，由實現該類的控制器管理。

* **Gateway：** 定義流量處理基礎設施（例如雲負載均衡器）的一個實例。

* **HTTPRoute：** 定義特定於 HTTP 的規則，用於將流量從網關監聽器映射到後端網路端點的表示。
  這些端點通常表示爲 {{<glossary_tooltip text="Service" term_id="service">}}。

<!-- 
Gateway API is organized into different API kinds that have interdependent relationships to support
the role-oriented nature of organizations. A Gateway object is associated with exactly one GatewayClass;
the GatewayClass describes the gateway controller responsible for managing Gateways of this class.
One or more route kinds such as HTTPRoute, are then associated to Gateways. A Gateway can filter the routes
that may be attached to its `listeners`, forming a bidirectional trust model with routes.
-->
Gateway API 被組織成不同的 API 類別，這些 API 類別具有相互依賴的關係，以支持組織中角色導向的特點。
一個 Gateway 對象只能與一個 GatewayClass 相關聯；GatewayClass 描述負責管理此類 Gateway 的網關控制器。
各個（可以是多個）路由類別（例如 HTTPRoute）可以關聯到此 Gateway 對象。
Gateway 可以對能夠掛接到其 `listeners` 的路由進行過濾，從而與路由形成雙向信任模型。


<!-- 
The following figure illustrates the relationships of the three stable Gateway API kinds:

{{< figure src="/docs/images/gateway-kind-relationships.svg" alt="A figure illustrating the relationships of the three stable Gateway API kinds" class="diagram-medium" >}}
-->
下圖說明這三個穩定的 Gateway API 類別之間的關係：

{{< figure src="/docs/images/gateway-kind-relationships.svg" alt="此圖呈現的是三個穩定的 Gateway API 類別之間的關係" class="diagram-medium" >}}

<!-- 
### GatewayClass {#api-kind-gateway-class}

Gateways can be implemented by different controllers, often with different configurations. A Gateway
must reference a GatewayClass that contains the name of the controller that implements the
class.

A minimal GatewayClass example:
-->
### GatewayClass {#api-kind-gateway-class}

Gateway 可以由不同的控制器實現，通常具有不同的設定。
Gateway 必須引用某 GatewayClass，而後者中包含實現該類的控制器的名稱。

下面是一個最精簡的 GatewayClass 示例：

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
在此示例中，一個實現了 Gateway API 的控制器被設定爲管理某些 GatewayClass 對象，
這些對象的控制器名爲 `example.com/gateway-controller`。
歸屬於此類的 Gateway 對象將由此實現的控制器來管理。

有關此 API 類別的完整定義，請參閱
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

Gateway 用來描述流量處理基礎設施的一個實例。Gateway 定義了一個網路端點，該端點可用於處理流量，
即對 Service 等後端進行過濾、平衡、拆分等。
例如，Gateway 可以代表某個雲負載均衡器，或設定爲接受 HTTP 流量的叢集內代理伺服器。

下面是一個精簡的 Gateway 資源示例：

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
在此示例中，流量處理基礎設施的實例被編程爲監聽 80 端口上的 HTTP 流量。
由於未指定 `addresses` 字段，因此對應實現的控制器負責將地址或主機名設置到 Gateway 之上。
該地址用作網路端點，用於處理路由中定義的後端網路端點的流量。

有關此類 API 的完整定義，請參閱 [Gateway](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.Gateway)。

<!-- 
### HTTPRoute {#api-kind-httproute}

The HTTPRoute kind specifies routing behavior of HTTP requests from a Gateway listener to backend network
endpoints. For a Service backend, an implementation may represent the backend network endpoint as a Service
IP or the backing EndpointSlices of the Service. An HTTPRoute represents configuration that is applied to the
underlying Gateway implementation. For example, defining a new HTTPRoute may result in configuring additional
traffic routes in a cloud load balancer or in-cluster proxy server.

A minimal HTTPRoute example:
-->
### HTTPRoute {#api-kind-httproute}

HTTPRoute 類別指定從 Gateway 監聽器到後端網路端點的 HTTP 請求的路由行爲。
對於服務後端，實現可以將後端網路端點表示爲服務 IP 或服務的支持 EndpointSlices。
HTTPRoute 表示將被應用到下層 Gateway 實現的設定。
例如，定義新的 HTTPRoute 可能會導致在雲負載均衡器或叢集內代理伺服器中設定額外的流量路由。

下面是一個最精簡的 HTTPRoute 示例：

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
在此示例中，來自 Gateway `example-gateway` 的 HTTP 流量，
如果 Host 的標頭設置爲 `www.example.com` 且請求路徑指定爲 `/login`，
將被路由到 Service `example-svc` 的 `8080` 端口。

有關此類 API 的完整定義，請參閱
[HTTPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.HTTPRoute)。

<!-- 
## Request flow

Here is a simple example of HTTP traffic being routed to a Service by using a Gateway and an HTTPRoute:

{{< figure src="/docs/images/gateway-request-flow.svg" alt="A diagram that provides an example of HTTP traffic being routed to a Service by using a Gateway and an HTTPRoute" class="diagram-medium" >}}

In this example, the request flow for a Gateway implemented as a reverse proxy is:
-->
## 請求資料流 {#request-flow}

以下是使用 Gateway 和 HTTPRoute 將 HTTP 流量路由到服務的簡單示例：

{{< figure src="/docs/images/gateway-request-flow.svg" alt="此圖爲使用 Gateway 和 HTTPRoute 將 HTTP 流量路由到服務的示例" class="diagram-medium" >}}

在此示例中，實現爲反向代理的 Gateway 的請求資料流如下：

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
1. 客戶端開始準備 URL 爲 `http://www.example.com` 的 HTTP 請求
2. 客戶端的 DNS 解析器查詢目標名稱並瞭解與 Gateway 關聯的一個或多個 IP 地址的映射。
3. 客戶端向 Gateway IP 地址發送請求；反向代理接收 HTTP 請求並使用 Host: 
   標頭來匹配基於 Gateway 和附加的 HTTPRoute 所獲得的設定。
4. 可選的，反向代理可以根據 HTTPRoute 的匹配規則進行請求頭和（或）路徑匹配。
5. 可選地，反向代理可以修改請求；例如，根據 HTTPRoute 的過濾規則添加或刪除標頭。
6. 最後，反向代理將請求轉發到一個或多個後端。

<!-- 
## Conformance

Gateway API covers a broad set of features and is widely implemented. This combination requires
clear conformance definitions and tests to ensure that the API provides a consistent experience
wherever it is used.

See the [conformance](https://gateway-api.sigs.k8s.io/concepts/conformance/) documentation to
understand details such as release channels, support levels, and running conformance tests.
-->
## 標準合規性 {#conformance}

Gateway API 涵蓋廣泛的功能並得到廣泛實現。
這種組合需要明確的標準合規性定義和測試，以確保 API 在任何地方使用時都能提供一致的體驗。

請參閱[合規性](https://gateway-api.sigs.k8s.io/concepts/conformance/)相關的文檔，
以瞭解發佈渠道、支持級別和運行合規性測試等詳細資訊。

<!-- 
## Migrating from Ingress

Gateway API is the successor to the [Ingress](/docs/concepts/services-networking/ingress/) API.
However, it does not include the Ingress kind. As a result, a one-time conversion from your existing
Ingress resources to Gateway API resources is necessary.

Refer to the [ingress migration](https://gateway-api.sigs.k8s.io/guides/migrating-from-ingress/#migrating-from-ingress)
guide for details on migrating Ingress resources to Gateway API resources.
-->
## 從 Ingress 遷移 {#migrating-from-ingress}

Gateway API 是 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) API 的後繼者。
但是其中不包括 Ingress 類型。因此，需要將現有 Ingress 資源一次性轉換爲 Gateway API 資源。

有關將 Ingress 資源遷移到 Gateway API 資源的詳細資訊，請參閱
[Ingress 遷移](https://gateway-api.sigs.k8s.io/guides/migrating-from-ingress/#migrating-from-ingress)指南。

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
Gateway API 資源不是由 Kubernetes 原生實現的，
而是被定義爲受廣泛[實現](https://gateway-api.sigs.k8s.io/implementations/)支持的[自定義資源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。
使用者需要[安裝](https://gateway-api.sigs.k8s.io/guides/#installing-gateway-api) Gateway API CRD
或按照所選實現的安裝說明進行操作。
安裝完成後，使用[入門](https://gateway-api.sigs.k8s.io/guides/)指南來幫助你快速開始使用 Gateway API。

{{< note >}}
<!-- 
Make sure to review the documentation of your selected implementation to understand any caveats.
-->
請務必查看所選實現的文檔以瞭解可能存在的注意事項。
{{< /note >}}

<!-- 
Refer to the [API specification](https://gateway-api.sigs.k8s.io/reference/spec/) for additional
details of all Gateway API kinds.
-->
有關所有 Gateway API 類型的其他詳細資訊，請參閱 [API 規範](https://gateway-api.sigs.k8s.io/reference/spec/)。
