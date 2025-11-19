---
title: Ingress
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "Ingress"
- apiVersion: "networking.k8s.io/v1"
  kind: "IngressClass"
content_type: concept
description: >-
  使用一種能感知協議配置的機制來解析 URI、主機名稱、路徑等 Web 概念，
  讓你的 HTTP（或 HTTPS）網絡服務可被訪問。
  Ingress 概念允許你通過 Kubernetes API 定義的規則將流量映射到不同後端。
weight: 30
---
<!--
reviewers:
- bprashanthluster: A set of Nodes that run containerized app
title: Ingress
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "Ingress"
- apiVersion: "networking.k8s.io/v1"
  kind: "IngressClass"
content_type: concept
description: >-
  Make your HTTP (or HTTPS) network service available using a protocol-aware configuration
  mechanism, that understands web concepts like URIs, hostnames, paths, and more.
  The Ingress concept lets you map traffic to different backends based on rules you define
  via the Kubernetes API.
weight: 30
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

{{< glossary_definition term_id="ingress" length="all" >}}

{{< note >}}
<!--
Ingress is frozen. New features are being added to the [Gateway API](/docs/concepts/services-networking/gateway/).
-->
入口（Ingress）目前已停止更新。新的功能正在集成至[網關 API](/zh-cn/docs/concepts/services-networking/gateway/) 中。
{{< /note >}}

<!-- body -->

<!--
## Terminology

For clarity, this guide defines the following terms:
-->
## 術語  {#terminology}

爲了表達更加清晰，本指南定義以下術語：

<!-- 
* Node: A worker machine in Kubernetes, part of a cluster.
* Cluster: A set of Nodes that run containerized applications managed by Kubernetes.
  For this example, and in most common Kubernetes deployments, nodes in the cluster
  are not part of the public internet.
* Edge router: A router that enforces the firewall policy for your cluster. This
  could be a gateway managed by a cloud provider or a physical piece of hardware.
* Cluster network: A set of links, logical or physical, that facilitate communication
  within a cluster according to the Kubernetes [networking model](/docs/concepts/cluster-administration/networking/).
* Service: A Kubernetes {{< glossary_tooltip term_id="service" >}} that identifies
  a set of Pods using {{< glossary_tooltip text="label" term_id="label" >}} selectors.
  Unless mentioned otherwise, Services are assumed to have virtual IPs only routable within the cluster network.
 -->
* 節點（Node）: Kubernetes 集羣中的一臺工作機器，是集羣的一部分。
* 集羣（Cluster）: 一組運行容器化應用程序的 Node，這些應用由 Kubernetes 管理。
  在此示例和在大多數常見的 Kubernetes 部署環境中，集羣中的節點都不在公共網絡中。
* 邊緣路由器（Edge Router）: 在集羣中強制執行防火牆策略的路由器。
  可以是由雲提供商管理的網關，也可以是物理硬件。
* 集羣網絡（Cluster Network）: 一組邏輯的或物理的連接，基於 Kubernetes
  [網絡模型](/zh-cn/docs/concepts/cluster-administration/networking/)實現集羣內的通信。
* 服務（Service）：Kubernetes {{< glossary_tooltip term_id="service" >}}，
  使用{{< glossary_tooltip text="標籤" term_id="label" >}}選擇算符（Selectors）
  來選擇一組 Pod。除非另作說明，否則假定 Service 具有只能在集羣網絡內路由的虛擬 IP。

<!--
## What is Ingress?

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)
exposes HTTP and HTTPS routes from outside the cluster to
{{< link text="services" url="/docs/concepts/services-networking/service/" >}} within the cluster.
Traffic routing is controlled by rules defined on the Ingress resource.
-->
## Ingress 是什麼？  {#what-is-ingress}

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)
提供從集羣外部到集羣內[服務](/zh-cn/docs/concepts/services-networking/service/)的
HTTP 和 HTTPS 路由。
流量路由由 Ingress 資源所定義的規則來控制。

<!--
Here is a simple example where an Ingress sends all its traffic to one Service:
-->
下面是 Ingress 的一個簡單示例，可將所有流量都發送到同一 Service：

{{< figure src="/zh-cn/docs/images/ingress.svg" alt="ingress-diagram" class="diagram-large" caption="圖. Ingress" link="https://mermaid.live/edit#pako:eNqNkktLAzEQgP9KSC8Ku6XWBxKlJz0IHsQeuz1kN7M2uC-SrA9sb6X26MFLFZGKoCC0CIIn_Td1139halZq8eJlE2a--TI7yRn2YgaYYCc6EDRpod39DSdCyAs4RGqhMRndffRfs6dxc9Euox0NgZR2NhpmF73sqos2XVFD-ctt_vY2uTnPh8PJ4BGV7Ro3ZKOoaH5Li6Bt19r56zi7fM4fupP-oC1BHHEPGnWzGlimruno87qXvd__qjdpw2pXErOlxl7Mmn_j1VkcImb-i0q5BT5KAsoj5PMgICXGmCWViA-BlHzfL_b2MWeqRVaSE8uLg1iQUqVS2ZiTHK7LQrFcXfNg9V8WnZu3eEEqFYjCNCslJdd15zXVmcacODP9TMcqJmBN5zL9VKdt_uLM1ZoBzIVNF8WqM06ELRyCCCln-oWcTVkHqxaE4GCitwx8mgbK0Y-no9E0YVTBNuMqFpj4NJBgYZqquH4aeZgokcIPtMWpvtywoDpfU3_yww" >}}

<!-- 
An Ingress may be configured to give Services externally-reachable URLs,
load balance traffic, terminate SSL / TLS, and offer name-based virtual hosting.
An [Ingress controller](/docs/concepts/services-networking/ingress-controllers)
is responsible for fulfilling the Ingress, usually with a load balancer, though
it may also configure your edge router or additional frontends to help handle the traffic.
-->
通過配置，Ingress 可爲 Service 提供外部可訪問的 URL、對其流量作負載均衡、
終止 SSL/TLS，以及基於名稱的虛擬託管等能力。
[Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)
負責完成 Ingress 的工作，具體實現上通常會使用某個負載均衡器，
不過也可以配置邊緣路由器或其他前端來幫助處理流量。

<!-- 
An Ingress does not expose arbitrary ports or protocols. Exposing services other than HTTP and HTTPS to the internet typically
uses a service of type [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport) or
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).
-->
Ingress 不會隨意公開端口或協議。
將 HTTP 和 HTTPS 以外的服務開放到 Internet 時，通常使用
[Service.Type=NodePort](/zh-cn/docs/concepts/services-networking/service/#type-nodeport)
或 [Service.Type=LoadBalancer](/zh-cn/docs/concepts/services-networking/service/#loadbalancer)
類型的 Service。

<!--
## Prerequisites

You must have an [Ingress controller](/docs/concepts/services-networking/ingress-controllers)
to satisfy an Ingress. Only creating an Ingress resource has no effect.
-->
## 環境準備  {#prerequisites}

你必須擁有一個 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers) 才能滿足
Ingress 的要求。僅創建 Ingress 資源本身沒有任何效果。

<!-- 
You may need to deploy an Ingress controller such as [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/).
You can choose from a number of [Ingress controllers](/docs/concepts/services-networking/ingress-controllers).
-->
你可能需要部署一個 Ingress 控制器，例如 [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/)。
你可以從許多 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)中進行選擇。

<!-- 
Ideally, all Ingress controllers should fit the reference specification. In reality, the various Ingress
controllers operate slightly differently.
 -->
理想情況下，所有 Ingress 控制器都應遵從參考規範。
但實際上，各個 Ingress 控制器操作略有不同。

{{< note >}}
<!--
Make sure you review your Ingress controller's documentation to understand the caveats of choosing it.
-->
確保你查看了 Ingress 控制器的文檔，以瞭解選擇它的注意事項。
{{< /note >}}

<!--
## The Ingress resource

A minimal Ingress resource example:
-->
## Ingress 資源  {#the-ingress-resource}

一個最小的 Ingress 資源示例：

{{% code_sample file="service/networking/minimal-ingress.yaml" %}}

<!-- 
An Ingress needs `apiVersion`, `kind`, `metadata` and `spec` fields.
The name of an Ingress object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
For general information about working with config files, see
[deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/),
[configuring containers](/docs/tasks/configure-pod-container/configure-pod-configmap/),
[managing resources](/docs/concepts/cluster-administration/manage-deployment/).
Ingress frequently uses annotations to configure some options depending on the Ingress controller, an example of which
is the [rewrite-target annotation](https://github.com/kubernetes/ingress-nginx/blob/main/docs/examples/rewrite/README.md).
Different [Ingress controllers](/docs/concepts/services-networking/ingress-controllers) support different annotations.
Review the documentation for your choice of Ingress controller to learn which annotations are supported.
-->
Ingress 需要指定 `apiVersion`、`kind`、 `metadata`和 `spec` 字段。
Ingress 對象的命名必須是合法的 [DNS 子域名名稱](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
關於如何使用配置文件的一般性信息，請參見[部署應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)、
[配置容器](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)、
[管理資源](/zh-cn/docs/concepts/cluster-administration/manage-deployment/)。
Ingress 經常使用註解（Annotations）來配置一些選項，具體取決於 Ingress 控制器，
例如 [rewrite-target 註解](https://github.com/kubernetes/ingress-nginx/blob/main/docs/examples/rewrite/README.md)。
不同的 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)支持不同的註解。
查看你所選的 Ingress 控制器的文檔，以瞭解其所支持的註解。

<!-- 
The [Ingress spec](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)
has all the information needed to configure a load balancer or proxy server. Most importantly, it
contains a list of rules matched against all incoming requests. Ingress resource only supports rules
for directing HTTP(S) traffic.
-->
[Ingress 規約](/zh-cn/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)
提供了配置負載均衡器或者代理服務器所需要的所有信息。
最重要的是，其中包含對所有入站請求進行匹配的規則列表。
Ingress 資源僅支持用於轉發 HTTP(S) 流量的規則。

<!--
If the `ingressClassName` is omitted, a [default Ingress class](#default-ingress-class)
should be defined.

There are some ingress controllers, that work without the definition of a
default `IngressClass`. For example, the Ingress-NGINX controller can be
configured with a [flag](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class`. It is [recommended](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#i-have-only-one-ingress-controller-in-my-cluster-what-should-i-do) though, to specify the
default `IngressClass` as shown [below](#default-ingress-class).
-->
如果 `ingressClassName` 被省略，那麼你應該定義一個[默認的 Ingress 類](#default-ingress-class)。

有些 Ingress 控制器不需要定義默認的 `IngressClass`。比如：Ingress-NGINX
控制器可以通過[參數](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class` 來配置。
不過仍然[推薦](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#i-have-only-one-ingress-controller-in-my-cluster-what-should-i-do)
按[下文](#default-ingress-class)所示來設置默認的 `IngressClass`。

<!-- 
### Ingress rules

Each HTTP rule contains the following information:
-->
### Ingress 規則  {#ingress-rules}

每個 HTTP 規則都包含以下信息：

<!-- 
* An optional host. In this example, no host is specified, so the rule applies to all inbound
  HTTP traffic through the IP address specified. If a host is provided (for example,
  foo.bar.com), the rules apply to that host.
* A list of paths (for example, `/testpath`), each of which has an associated
  backend defined with a `service.name` and a `service.port.name` or
  `service.port.number`. Both the host and path must match the content of an
  incoming request before the load balancer directs traffic to the referenced
  Service.
* A backend is a combination of Service and port names as described in the
  [Service doc](/docs/concepts/services-networking/service/) or a [custom resource backend](#resource-backend)
  by way of a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}. HTTP (and HTTPS) requests to the
  Ingress that match the host and path of the rule are sent to the listed backend.
-->
* 可選的 `host`。在此示例中，未指定 `host`，因此該規則基於所指定 IP 地址來匹配所有入站 HTTP 流量。
  如果提供了 `host`（例如 `foo.bar.com`），則 `rules` 適用於所指定的主機。
* 路徑列表（例如 `/testpath`）。每個路徑都有一個由 `service.name` 和 `service.port.name`
  或 `service.port.number` 確定的關聯後端。
  主機和路徑都必須與入站請求的內容相匹配，負載均衡器纔會將流量引導到所引用的 Service，
* `backend`（後端）是 [Service 文檔](/zh-cn/docs/concepts/services-networking/service/)中所述的 Service 和端口名稱的組合，
  或者是通過 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}
  方式來實現的[自定義資源後端](#resource-backend)。
  對於發往 Ingress 的 HTTP（和 HTTPS）請求，如果與規則中的主機和路徑匹配，
  則會被髮送到所列出的後端。

<!-- 
A `defaultBackend` is often configured in an Ingress controller to service any requests that do not
match a path in the spec. 
-->
通常會在 Ingress 控制器中配置 `defaultBackend`（默認後端），
以便爲無法與規約中任何路徑匹配的所有請求提供服務。

<!-- 
### DefaultBackend {#default-backend}

An Ingress with no rules sends all traffic to a single default backend and `.spec.defaultBackend`
is the backend that should handle requests in that case.
The `defaultBackend` is conventionally a configuration option of the
[Ingress controller](/docs/concepts/services-networking/ingress-controllers) and
is not specified in your Ingress resources.
If no `.spec.rules` are specified, `.spec.defaultBackend` must be specified.
If `defaultBackend` is not set, the handling of requests that do not match any of the rules will be up to the
ingress controller (consult the documentation for your ingress controller to find out how it handles this case). 

If none of the hosts or paths match the HTTP request in the Ingress objects, the traffic is
routed to your default backend.
-->
### 默認後端  {#default-backend}

沒有設置規則的 Ingress 將所有流量發送到同一個默認後端，而在這種情況下
`.spec.defaultBackend` 則是負責處理請求的那個默認後端。
`defaultBackend` 通常是
[Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)的配置選項，
而非在 Ingress 資源中設置。
如果未設置 `.spec.rules`，則必須設置 `.spec.defaultBackend`。
如果未設置 `defaultBackend`，那麼如何處理與所有規則都不匹配的流量將交由
Ingress 控制器決定（請參考你的 Ingress 控制器的文檔以瞭解它是如何處理這種情況的）。

如果 Ingress 對象中主機和路徑都沒有與 HTTP 請求匹配，則流量將被路由到默認後端。

<!--
### Resource backends {#resource-backend}

A `Resource` backend is an ObjectRef to another Kubernetes resource within the
same namespace as the Ingress object. A `Resource` is a mutually exclusive
setting with Service, and will fail validation if both are specified. A common
usage for a `Resource` backend is to ingress data to an object storage backend
with static assets.
-->
### 資源後端  {#resource-backend}

`Resource` 後端是一個 ObjectRef 對象，指向同一名字空間中的另一個 Kubernetes 資源，
將其視爲 Ingress 對象。
`Resource` 後端與 Service 後端是互斥的，在二者均被設置時會無法通過合法性檢查。
`Resource` 後端的一種常見用法是將所有入站數據導向保存靜態資產的對象存儲後端。

{{% code_sample file="service/networking/ingress-resource-backend.yaml" %}}

<!--
After creating the Ingress above, you can view it with the following command:
-->
創建瞭如上的 Ingress 之後，你可以使用下面的命令查看它：

```bash
kubectl describe ingress ingress-resource-backend
```

```
Name:             ingress-resource-backend
Namespace:        default
Address:
Default backend:  APIGroup: k8s.example.com, Kind: StorageBucket, Name: static-assets
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /icons   APIGroup: k8s.example.com, Kind: StorageBucket, Name: icon-assets
Annotations:  <none>
Events:       <none>
```

<!-- 
### Path types

Each path in an Ingress is required to have a corresponding path type. Paths
that do not include an explicit `pathType` will fail validation. There are three
supported path types:
-->
### 路徑類型  {#path-types}

Ingress 中的每個路徑都需要有對應的路徑類型（Path Type）。未明確設置 `pathType`
的路徑無法通過合法性檢查。當前支持的路徑類型有三種：

<!-- 
* `ImplementationSpecific`: With this path type, matching is up to
  the IngressClass. Implementations can treat this as a separate `pathType` or
  treat it identically to `Prefix` or `Exact` path types.

* `Exact`: Matches the URL path exactly and with case sensitivity.

* `Prefix`: Matches based on a URL path prefix split by `/`. Matching is case
  sensitive and done on a path element by element basis. A path element refers
  to the list of labels in the path split by the `/` separator. A request is a
  match for path _p_ if every _p_ is an element-wise prefix of _p_ of the
  request path.

  If the last element of the path is a substring of the last
  element in request path, it is not a match (for example: `/foo/bar`
  matches `/foo/bar/baz`, but does not match `/foo/barbaz`).
 -->
* `ImplementationSpecific`：對於這種路徑類型，匹配方法取決於 IngressClass。
  具體實現可以將其作爲單獨的 `pathType` 處理或者作與 `Prefix` 或 `Exact`
  類型相同的處理。

* `Exact`：精確匹配 URL 路徑，且區分大小寫。

* `Prefix`：基於以 `/` 分隔的 URL 路徑前綴匹配。匹配區分大小寫，
  並且對路徑中各個元素逐個執行匹配操作。
  路徑元素指的是由 `/` 分隔符分隔的路徑中的標籤列表。
  如果每個 _p_ 都是請求路徑 _p_ 的元素前綴，則請求與路徑 _p_ 匹配。

  {{< note >}}
  如果路徑的最後一個元素是請求路徑中最後一個元素的子字符串，則不會被視爲匹配
  （例如：`/foo/bar` 匹配 `/foo/bar/baz`, 但不匹配 `/foo/barbaz`）。
  {{< /note >}}

<!--
### Examples

| Kind   | Path(s)                         | Request path(s)             | Matches?                           |
|--------|---------------------------------|-----------------------------|------------------------------------|
| Prefix | `/`                             | (all paths)                 | Yes                                |
| Exact  | `/foo`                          | `/foo`                      | Yes                                |
| Exact  | `/foo`                          | `/bar`                      | No                                 |
| Exact  | `/foo`                          | `/foo/`                     | No                                 |
| Exact  | `/foo/`                         | `/foo`                      | No                                 |
| Prefix | `/foo`                          | `/foo`, `/foo/`             | Yes                                |
| Prefix | `/foo/`                         | `/foo`, `/foo/`             | Yes                                |
| Prefix | `/aaa/bb`                       | `/aaa/bbb`                  | No                                 |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb`                  | Yes                                |
| Prefix | `/aaa/bbb/`                     | `/aaa/bbb`                  | Yes, ignores trailing slash        |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/`                 | Yes,  matches trailing slash       |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/ccc`              | Yes, matches subpath               |
| Prefix | `/aaa/bbb`                      | `/aaa/bbbxyz`               | No, does not match string prefix   |
| Prefix | `/`, `/aaa`                     | `/aaa/ccc`                  | Yes, matches `/aaa` prefix         |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/aaa/bbb`                  | Yes, matches `/aaa/bbb` prefix     |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/ccc`                      | Yes, matches `/` prefix            |
| Prefix | `/aaa`                          | `/ccc`                      | No, uses default backend           |
| Mixed  | `/foo` (Prefix), `/foo` (Exact) | `/foo`                      | Yes, prefers Exact                 |
-->
### 示例

| 類型   | 路徑                            | 請求路徑        | 匹配與否？               |
|--------|---------------------------------|-----------------|--------------------------|
| Prefix | `/`                             | （所有路徑）    | 是                       |
| Exact  | `/foo`                          | `/foo`          | 是                       |
| Exact  | `/foo`                          | `/bar`          | 否                       |
| Exact  | `/foo`                          | `/foo/`         | 否                       |
| Exact  | `/foo/`                         | `/foo`          | 否                       |
| Prefix | `/foo`                          | `/foo`, `/foo/` | 是                       |
| Prefix | `/foo/`                         | `/foo`, `/foo/` | 是                       |
| Prefix | `/aaa/bb`                       | `/aaa/bbb`      | 否                       |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb`      | 是                       |
| Prefix | `/aaa/bbb/`                     | `/aaa/bbb`      | 是，忽略尾部斜線         |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/`     | 是，匹配尾部斜線         |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/ccc`  | 是，匹配子路徑           |
| Prefix | `/aaa/bbb`                      | `/aaa/bbbxyz`   | 否，字符串前綴不匹配     |
| Prefix | `/`, `/aaa`                     | `/aaa/ccc`      | 是，匹配 `/aaa` 前綴     |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/aaa/bbb`      | 是，匹配 `/aaa/bbb` 前綴 |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/ccc`          | 是，匹配 `/` 前綴        |
| Prefix | `/aaa`                          | `/ccc`          | 否，使用默認後端         |
| 混合   | `/foo` (Prefix), `/foo` (Exact) | `/foo`          | 是，優選 Exact 類型      |

<!-- 
#### Multiple matches

In some cases, multiple paths within an Ingress will match a request. In those
cases precedence will be given first to the longest matching path. If two paths
are still equally matched, precedence will be given to paths with an exact path
type over prefix path type.
 -->
#### 多重匹配  {#multiple-matches}

在某些情況下，Ingress 中會有多條路徑與同一個請求匹配。這時匹配路徑最長者優先。
如果仍然有兩條同等的匹配路徑，則精確路徑類型優先於前綴路徑類型。

<!--
## Hostname wildcards

Hosts can be precise matches (for example “`foo.bar.com`”) or a wildcard (for
example “`*.foo.com`”). Precise matches require that the HTTP `host` header
matches the `host` field. Wildcard matches require the HTTP `host` header is
equal to the suffix of the wildcard rule.
-->
## 主機名通配符   {#hostname-wildcards}

主機名可以是精確匹配（例如 “`foo.bar.com`”）或者使用通配符來匹配
（例如 “`*.foo.com`”）。
精確匹配要求 HTTP `host` 頭部字段與 `host` 字段值完全匹配。
通配符匹配則要求 HTTP `host` 頭部字段與通配符規則中的後綴部分相同。

<!--
| Host         | Host header        | Match?                                              |
| ------------ |--------------------| ----------------------------------------------------|
| `*.foo.com`  | `bar.foo.com`      | Matches based on shared suffix                      |
| `*.foo.com`  | `baz.bar.foo.com`  | No match, wildcard only covers a single DNS label   |
| `*.foo.com`  | `foo.com`          | No match, wildcard only covers a single DNS label   |
-->
| 主機         | host 頭部          | 匹配與否？                          |
| ------------ |--------------------| ------------------------------------|
| `*.foo.com`  | `bar.foo.com`      | 基於相同的後綴匹配                  |
| `*.foo.com`  | `baz.bar.foo.com`  | 不匹配，通配符僅覆蓋了一個 DNS 標籤 |
| `*.foo.com`  | `foo.com`          | 不匹配，通配符僅覆蓋了一個 DNS 標籤 |

{{% code_sample file="service/networking/ingress-wildcard-host.yaml" %}}

<!-- 
## Ingress class

Ingresses can be implemented by different controllers, often with different
configuration. Each Ingress should specify a class, a reference to an
IngressClass resource that contains additional configuration including the name
of the controller that should implement the class.
-->
## Ingress 類  {#ingress-class}

Ingress 可以由不同的控制器實現，通常使用不同的配置。
每個 Ingress 應當指定一個類，也就是一個對 IngressClass 資源的引用。
IngressClass 資源包含額外的配置，其中包括應當實現該類的控制器名稱。

{{% code_sample file="service/networking/external-lb.yaml" %}}

<!-- 
The `.spec.parameters` field of an IngressClass lets you reference another
resource that provides configuration related to that IngressClass.

The specific type of parameters to use depends on the ingress controller
that you specify in the `.spec.controller` field of the IngressClass.
 -->
IngressClass 中的 `.spec.parameters` 字段可用於引用其他資源以提供與該
IngressClass 相關的配置。

參數（`parameters`）的具體類型取決於你在 IngressClass 的 `.spec.controller`
字段中指定的 Ingress 控制器。

<!--
### IngressClass scope

Depending on your ingress controller, you may be able to use parameters
that you set cluster-wide, or just for one namespace.
-->
### IngressClass 的作用域  {#ingressclass-scope}

取決於你所使用的 Ingress 控制器，你可能可以使用集羣作用域的參數或某個名字空間作用域的參數。

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="集羣作用域" %}}

<!--
The default scope for IngressClass parameters is cluster-wide.

If you set the `.spec.parameters` field and don't set
`.spec.parameters.scope`, or if you set `.spec.parameters.scope` to
`Cluster`, then the IngressClass refers to a cluster-scoped resource.
The `kind` (in combination the `apiGroup`) of the parameters
refers to a cluster-scoped API (possibly a custom resource), and
the `name` of the parameters identifies a specific cluster scoped
resource for that API.

For example:
-->
IngressClass 參數的默認作用域是集羣範圍。

如果你設置了 `.spec.parameters` 字段且未設置 `.spec.parameters.scope`
字段，或是將 `.spec.parameters.scope` 字段設爲了 `Cluster`，
那麼該 IngressClass 所引用的即是一個集羣作用域的資源。
參數的 `kind`（和 `apiGroup` 一起）指向一個集羣作用域的 API 類型
（可能是一個定製資源（Custom Resource）），而其 `name` 字段則進一步確定
該 API 類型的一個具體的、集羣作用域的資源。

示例：

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-1
spec:
  controller: example.com/ingress-controller
  parameters:
    # 此 IngressClass 的配置定義在一個名爲 “external-config-1” 的
    # ClusterIngressParameter（API 組爲 k8s.example.net）資源中。
    # 這項定義告訴 Kubernetes 去尋找一個集羣作用域的參數資源。
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```

{{% /tab %}}
{{% tab name="命名空間作用域" %}}
{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
If you set the `.spec.parameters` field and set
`.spec.parameters.scope` to `Namespace`, then the IngressClass refers
to a namespaced-scoped resource. You must also set the `namespace`
field within `.spec.parameters` to the namespace that contains
the parameters you want to use.

The `kind` (in combination the `apiGroup`) of the parameters
refers to a namespaced API (for example: ConfigMap), and
the `name` of the parameters identifies a specific resource
in the namespace you specified in `namespace`.
-->
如果你設置了 `.spec.parameters` 字段且將 `.spec.parameters.scope`
字段設爲了 `Namespace`，那麼該 IngressClass 將會引用一個名字空間作用域的資源。
`.spec.parameters.namespace` 必須和此資源所處的名字空間相同。

參數的 `kind`（和 `apiGroup` 一起）指向一個命名空間作用域的 API 類型
（例如：ConfigMap），而其 `name` 則進一步確定指定 API 類型的、
位於你指定的命名空間中的具體資源。

<!--
Namespace-scoped parameters help the cluster operator delegate control over the
configuration (for example: load balancer settings, API gateway definition)
that is used for a workload. If you used a cluster-scoped parameter then either:

- the cluster operator team needs to approve a different team's changes every
  time there's a new configuration change being applied.
- the cluster operator must define specific access controls, such as
  [RBAC](/docs/reference/access-authn-authz/rbac/) roles and bindings, that let
  the application team make changes to the cluster-scoped parameters resource.
-->
名字空間作用域的參數幫助集羣操作者將對工作負載所需的配置數據（比如：負載均衡設置、
API 網關定義）的控制權力委派出去。如果你使用集羣作用域的參數，那麼你將面臨以下情況之一：

- 每次應用一項新的配置變更時，集羣操作團隊需要批准其他團隊所作的修改。
- 集羣操作團隊必須定義具體的准入控制規則，比如 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)
  角色與角色綁定，以使得應用程序團隊可以修改集羣作用域的配置參數資源。

<!--
The IngressClass API itself is always cluster-scoped.

Here is an example of an IngressClass that refers to parameters that are
namespaced:
-->
IngressClass API 本身是集羣作用域的。

這裏是一個引用名字空間作用域配置參數的 IngressClass 的示例：

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # 此 IngressClass 的配置定義在一個名爲 “external-config” 的
    # IngressParameter（API 組爲 k8s.example.com）資源中，
    # 該資源位於 “external-configuration” 名字空間中。
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{< /tabs >}}

<!-- 
### Deprecated annotation

Before the IngressClass resource and `ingressClassName` field were added in
Kubernetes 1.18, Ingress classes were specified with a
`kubernetes.io/ingress.class` annotation on the Ingress. This annotation was
never formally defined, but was widely supported by Ingress controllers.
-->
### 已廢棄的註解  {#deprecated-annotation}

在 Kubernetes 1.18 版本引入 IngressClass 資源和 `ingressClassName` 字段之前，
Ingress 類是通過 Ingress 中的一個 `kubernetes.io/ingress.class` 註解來指定的。
這個註解從未被正式定義過，但是得到了 Ingress 控制器的廣泛支持。

<!-- 
The newer `ingressClassName` field on Ingresses is a replacement for that
annotation, but is not a direct equivalent. While the annotation was generally
used to reference the name of the Ingress controller that should implement the
Ingress, the field is a reference to an IngressClass resource that contains
additional Ingress configuration, including the name of the Ingress controller.
-->
Ingress 中新的 `ingressClassName` 字段用來替代該註解，但並非完全等價。
註解通常用於引用實現該 Ingress 的控制器的名稱，而這個新的字段則是對一個包含額外
Ingress 配置的 IngressClass 資源的引用，其中包括了 Ingress 控制器的名稱。

<!-- 
### Default IngressClass {#default-ingress-class}

You can mark a particular IngressClass as default for your cluster. Setting the
`ingressclass.kubernetes.io/is-default-class` annotation to `true` on an
IngressClass resource will ensure that new Ingresses without an
`ingressClassName` field specified will be assigned this default IngressClass.
-->
### 默認 Ingress 類  {#default-ingress-class}

你可以將一個特定的 IngressClass 標記爲集羣默認 Ingress 類。
將某個 IngressClass 資源的 `ingressclass.kubernetes.io/is-default-class` 註解設置爲
`true` 將確保新的未指定 `ingressClassName` 字段的 Ingress 能夠被賦予這一默認
IngressClass.

{{< caution >}}
<!-- 
If you have more than one IngressClass marked as the default for your cluster,
the admission controller prevents creating new Ingress objects that don't have
an `ingressClassName` specified. You can resolve this by ensuring that at most 1
IngressClass is marked as default in your cluster.
 -->
如果集羣中有多個 IngressClass 被標記爲默認，准入控制器將阻止創建新的未指定
`ingressClassName` 的 Ingress 對象。
解決這個問題需要確保集羣中最多只能有一個 IngressClass 被標記爲默認。
{{< /caution >}}

<!--
There are some ingress controllers, that work without the definition of a
default `IngressClass`. For example, the Ingress-NGINX controller can be
configured with a [flag](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class`. It is [recommended](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)  though, to specify the
default `IngressClass`:
-->
有一些 Ingress 控制器不需要定義默認的 `IngressClass`。比如：Ingress-NGINX
控制器可以通過[參數](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class` 來配置。
不過仍然[推薦](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)
設置默認的 `IngressClass`。

{{% code_sample file="service/networking/default-ingressclass.yaml" %}}

<!--
## Types of Ingress

### Ingress backed by a single Service {#single-service-ingress}

There are existing Kubernetes concepts that allow you to expose a single Service
(see [alternatives](#alternatives)). You can also do this with an Ingress by specifying a
*default backend* with no rules.
-->
## Ingress 類型  {#types-of-ingress}

### 由單個 Service 來支持的 Ingress   {#single-service-ingress}

現有的 Kubernetes 概念允許你暴露單個 Service（參見[替代方案](#alternatives)）。
你也可以使用 Ingress 並設置無規則的**默認後端**來完成這類操作。

{{% code_sample file="service/networking/test-ingress.yaml" %}}

<!-- 
If you create it using `kubectl apply -f` you should be able to view the state
of the Ingress you added:
-->
如果使用 `kubectl apply -f` 創建此 Ingress，則應該能夠查看剛剛添加的 Ingress 的狀態：

```shell
kubectl get ingress test-ingress
```

```
NAME           CLASS         HOSTS   ADDRESS         PORTS   AGE
test-ingress   external-lb   *       203.0.113.123   80      59s
```

<!-- 
Where `203.0.113.123` is the IP allocated by the Ingress controller to satisfy
this Ingress.
-->
其中 `203.0.113.123` 是由 Ingress 控制器分配的 IP，用以服務於此 Ingress。

{{< note >}}
<!--
Ingress controllers and load balancers may take a minute or two to allocate an IP address.
Until that time, you often see the address listed as `<pending>`.
-->
Ingress 控制器和負載平衡器的 IP 地址分配操作可能需要一兩分鐘。
在此之前，你通常會看到地址字段的取值爲 `<pending>`。
{{< /note >}}

<!--
### Simple fanout

A fanout configuration routes traffic from a single IP address to more than one Service,
based on the HTTP URI being requested. An Ingress allows you to keep the number of load balancers
down to a minimum. For example, a setup like:
-->
### 簡單扇出  {#simple-fanout}

一個扇出（Fanout）配置根據請求的 HTTP URI 將來自同一 IP 地址的流量路由到多個 Service。
Ingress 允許你將負載均衡器的數量降至最低。例如，這樣的設置：

{{< figure src="/zh-cn/docs/images/ingressFanOut.svg" alt="ingress-fanout-diagram" class="diagram-large" caption="圖. Ingress 扇出" link="https://mermaid.live/edit#pako:eNqNUk1v0zAY_iuWewEpyRKnjM5FPY0DEgfEjk0PTvxmtZbGke3woW03NDjuChNCRRyQkMYFidP4NyXlX5DMjroykLg4j_x8vM6j9xhnkgOm-FCxao4ePx0nJUJZIaA0d6ary48_33xvvnyd3fUD9Kg8VKC131wum_Oz5t0r9CBVE7T-9mF9dbV6_3q9XK7efkaBPxFWOXUOD0X3R8FeFEQkDqKYzK6HOJHvT052cilPNKhnIoNoemAB6i_okIThbU_KVO8hf3oIHYUj59F1an_u18VZ8-PTjRhLuyltZiV5NH0i-ewvBLlFEEvE_yKGGwJKbmtlWu9DjqqCiRLloijogHPuaaPkEdBBnucO-88FN3M6rF54mSykooMwDMdbIUcj7SJispvBvf9KabntlKyotQHlkjZWOkjTdDuGbGLsxE1S36jXl9YD4nWldsc1irtj2D39htdumy1l69q-zH3H2MMLUAsmeLuux50uwWYOC0gwbSGHnNWFSXBSnrbSuuLMwEMujFSY5qzQ4GFWG3nwsswwNaqGXrQvWLsgC6c6_Q0zxBrK" >}}

<!--
It would require an Ingress such as:
-->
這將需要一個如下所示的 Ingress：

{{% code_sample file="service/networking/simple-fanout-example.yaml" %}}

<!--
When you create the Ingress with `kubectl apply -f`:
-->
當你使用 `kubectl apply -f` 創建 Ingress 時：

```shell
kubectl describe ingress simple-fanout-example
```

```
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

<!--
The Ingress controller provisions an implementation-specific load balancer
that satisfies the Ingress, as long as the Services (`service1`, `service2`) exist.
When it has done so, you can see the address of the load balancer at the
Address field.
-->
此 Ingress 控制器構造一個特定於實現的負載均衡器來供 Ingress 使用，
前提是 Service （`service1`、`service2`）存在。
當它完成負載均衡器的創建時，你會在 Address 字段看到負載均衡器的地址。

{{< note >}}
<!--
Depending on the [Ingress controller](/docs/concepts/services-networking/ingress-controllers/)
you are using, you may need to create a default-http-backend
[Service](/docs/concepts/services-networking/service/).
-->
取決於你所使用的 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers/)，
你可能需要創建默認 HTTP 後端[服務](/zh-cn/docs/concepts/services-networking/service/)。
{{< /note >}}

<!--
### Name based virtual hosting

Name-based virtual hosts support routing HTTP traffic to multiple host names at the same IP address.
-->
### 基於名稱的虛擬主機服務   {#name-based-virtual-hosting}

基於名稱的虛擬主機支持將針對多個主機名的 HTTP 流量路由到同一 IP 地址上。

{{< figure src="/zh-cn/docs/images/ingressNameBased.svg" alt="ingress-namebase-diagram" class="diagram-large" caption="圖. 基於名稱實現虛擬託管的 Ingress" link="https://mermaid.live/edit#pako:eNqNkk9v0zAYxr-K5V6GlESNU6B4qKdxQOKA2LHpwYnfrNaSOLId_mjbDQ2OXAdMUxEHJKRxQWLaND4NXcq3IJkT2gKTuDiv_Dzv73UevXs4lhwwxTuKFVP06MlmmCMUpwJyszGen364ev2t-vxlcsv10MN8R4HWbnU6q94cVm9fovuRGqHF15PF5eX8-NViNpsffUKeOxLWOW47HOTfHXr3fM8ngecHZHI9pDW57mj_x9nF1ftzihIpvYgpL5bZvgb1VMTgj7dtgboLOuzfCGiaG8gKgPwJIL8Buozsb_98d1h9_7jCtHI7sB5QSO6PH0s--YdA_hKIFYKbhMFSgJzbwJnWW5CgImUiR4lIU9rjnDvaKLkLtJckSVu7zwQ3UzoonjuxTKWivX6_v7kG2R3qFhGQOzHc_i9Kra1T4rTUBlRLWrbSXhRF6xiyxNiJS1KXqNOF1hXEaUJtjusqaI5B8_SVXruHNpS1a_uy9lsr2MEZqIwJXq_yXuMMsZlCBiGmdckhYWVqQhzmB7W1LDgz8IALIxWmCUs1OJiVRm6_yGNMjSqhM20JVq9I1roOfgEKNyn5" >}}

<!--
The following Ingress tells the backing load balancer to route requests based on
the [Host header](https://tools.ietf.org/html/rfc7230#section-5.4).
-->
以下 Ingress 讓後臺負載均衡器基於
[host 頭部字段](https://tools.ietf.org/html/rfc7230#section-5.4)來路由請求。

{{% code_sample file="service/networking/name-virtual-host-ingress.yaml" %}}

<!-- 
If you create an Ingress resource without any hosts defined in the rules, then any
web traffic to the IP address of your Ingress controller can be matched without a name based
virtual host being required.
-->
如果你所創建的 Ingress 資源沒有在 `rules` 中定義主機，則規則可以匹配指向
Ingress 控制器 IP 地址的所有網絡流量，而無需基於名稱的虛擬主機。

<!-- 
For example, the following Ingress routes traffic
requested for `first.bar.com` to `service1`, `second.bar.com` to `service2`,
and any traffic whose request host header doesn't match `first.bar.com`
and `second.bar.com` to `service3`.
-->
例如，下面的 Ingress 對象會將請求 `first.bar.com` 的流量路由到 `service1`，將請求
`second.bar.com` 的流量路由到 `service2`，而將所有其他流量路由到 `service3`。

{{% code_sample file="service/networking/name-virtual-host-ingress-no-third-host.yaml" %}}

<!--
### TLS

You can secure an Ingress by specifying a {{< glossary_tooltip term_id="secret" >}}
that contains a TLS private key and certificate. The Ingress resource only
supports a single TLS port, 443, and assumes TLS termination at the ingress point
(traffic to the Service and its Pods is in plaintext).
If the TLS configuration section in an Ingress specifies different hosts, they are
multiplexed on the same port according to the hostname specified through the
SNI TLS extension (provided the Ingress controller supports SNI). The TLS secret
must contain keys named `tls.crt` and `tls.key` that contain the certificate
and private key to use for TLS. For example:
-->
### TLS

你可以通過設定包含 TLS 私鑰和證書的{{< glossary_tooltip text="Secret" term_id="secret" >}}
來保護 Ingress。
Ingress 資源只支持一個 TLS 端口 443，並假定 TLS 連接終止於 Ingress 節點
（與 Service 及其 Pod 間的流量都以明文傳輸）。
如果 Ingress 中的 TLS 配置部分指定了不同主機，那麼它們將通過
SNI TLS 擴展指定的主機名（如果 Ingress 控制器支持 SNI）在同一端口上進行復用。
TLS Secret 的數據中必須包含鍵名爲 `tls.crt` 的證書和鍵名爲 `tls.key` 的私鑰，
才能用於 TLS 目的。例如：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 編碼的證書
  tls.key: base64 編碼的私鑰
type: kubernetes.io/tls
```

<!--
Referencing this secret in an Ingress tells the Ingress controller to
secure the channel from the client to the load balancer using TLS. You need to make
sure the TLS secret you created came from a certificate that contains a Common
Name (CN), also known as a Fully Qualified Domain Name (FQDN) for `https-example.foo.com`.
-->
在 Ingress 中引用此 Secret 將會告訴 Ingress 控制器使用 TLS 加密從客戶端到負載均衡器的通道。
你要確保所創建的 TLS Secret 創建自包含 `https-example.foo.com` 的公共名稱
（Common Name，CN）的證書。這裏的公共名稱也被稱爲全限定域名（Fully Qualified Domain Name，FQDN）。

{{< note >}}
<!--
Keep in mind that TLS will not work on the default rule because the
certificates would have to be issued for all the possible sub-domains. Therefore,
`hosts` in the `tls` section need to explicitly match the `host` in the `rules`
section.
-->
注意，不能針對默認規則使用 TLS，因爲這樣做需要爲所有可能的子域名簽發證書。
因此，`tls` 字段中的 `hosts` 的取值需要與 `rules` 字段中的 `host` 完全匹配。
{{< /note >}}

{{% code_sample file="service/networking/tls-example-ingress.yaml" %}}

{{< note >}}
<!-- 
There is a gap between TLS features supported by various Ingress
controllers. Please refer to documentation on
[nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/),
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https), or any other
platform specific Ingress controller to understand how TLS works in your environment.
-->
各種 Ingress 控制器在所支持的 TLS 特性上參差不齊。請參閱與
[nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/)、
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https)
或者任何其他平臺特定的 Ingress 控制器有關的文檔，以瞭解 TLS 如何在你的環境中工作。
{{< /note >}}

<!--
### Load balancing {#load-balancing}

An Ingress controller is bootstrapped with some load balancing policy settings
that it applies to all Ingress, such as the load balancing algorithm, backend
weight scheme, and others. More advanced load balancing concepts
(e.g. persistent sessions, dynamic weights) are not yet exposed through the
Ingress. You can instead get these features through the load balancer used for
a Service.
-->
### 負載均衡  {#load-balancing}

Ingress 控制器啓動引導時使用一些適用於所有 Ingress 的負載均衡策略設置，
例如負載均衡算法、後端權重方案等。
更高級的負載均衡概念（例如持久會話、動態權重）尚未通過 Ingress 公開。
你可以通過用於 Service 的負載均衡器來獲取這些功能。

<!--
It's also worth noting that even though health checks are not exposed directly
through the Ingress, there exist parallel concepts in Kubernetes such as
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
that allow you to achieve the same end result. Please review the controller
specific documentation to see how they handle health checks (for example:
[nginx](https://git.k8s.io/ingress-nginx/README.md), or
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).
-->
值得注意的是，儘管健康檢查不是通過 Ingress 直接暴露的，在 Kubernetes
中存在[就緒態探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
這類等價的概念，供你實現相同的目的。
請查閱特定控制器的說明文檔（例如：[nginx](https://git.k8s.io/ingress-nginx/README.md)、
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)）
以瞭解它們是怎樣處理健康檢查的。

<!--
## Updating an Ingress

To update an existing Ingress to add a new Host, you can update it by editing the resource:
-->
## 更新 Ingress   {#updating-an-ingress}

要更新現有的 Ingress 以添加新的 Host，可以通過編輯資源來更新它：

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

<!--
This pops up an editor with the existing configuration in YAML format.
Modify it to include the new Host:
-->
這一命令將打開編輯器，允許你以 YAML 格式編輯現有配置。
修改它來增加新的主機：

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          service:
            name: service1
            port:
              number: 80
        path: /foo
        pathType: Prefix
  - host: bar.baz.com
    http:
      paths:
      - backend:
          service:
            name: service2
            port:
              number: 80
        path: /foo
        pathType: Prefix
..
```

<!--
After you save your changes, kubectl updates the resource in the API server, which tells the
Ingress controller to reconfigure the load balancer.
-->
保存更改後，kubectl 將更新 API 服務器上的資源，該資源將告訴 Ingress 控制器重新配置負載均衡器。

<!--
Verify this:
-->
驗證：

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   service2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```


<!--
You can achieve the same outcome by invoking `kubectl replace -f` on a modified Ingress YAML file.
-->
你也可以針對修改後的 Ingress YAML 文件，通過 `kubectl replace -f` 命令獲得同樣結果。

<!--
## Failing across availability zones

Techniques for spreading traffic across failure domains differ between cloud providers.
Please check the documentation of the relevant [Ingress controller](/docs/concepts/services-networking/ingress-controllers) for details.
-->
## 跨可用區的失效  {#failing-across-availability-zones}

不同的雲廠商使用不同的技術來實現跨故障域的流量分佈。
請查看相關 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)的文檔以瞭解詳細信息。

<!--
## Alternatives

You can expose a Service in multiple ways that don't directly involve the Ingress resource:
-->
## 替代方案    {#alternatives}

不直接使用 Ingress 資源，也有多種方法暴露 Service：

<!--
* Use [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Use [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport)
-->
* 使用 [Service.Type=LoadBalancer](/zh-cn/docs/concepts/services-networking/service/#loadbalancer)
* 使用 [Service.Type=NodePort](/zh-cn/docs/concepts/services-networking/service/#type-nodeport)

## {{% heading "whatsnext" %}}

<!--
* Learn about the [Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/) API
* Learn about [Ingress controllers](/docs/concepts/services-networking/ingress-controllers/)
-->
* 進一步瞭解 [Ingress](/zh-cn/docs/reference/kubernetes-api/service-resources/ingress-v1/) API
* 進一步瞭解 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers/)
