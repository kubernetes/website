---
title: Ingress
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "Ingress"
- apiVersion: "networking.k8s.io/v1"
  kind: "IngressClass"
content_type: concept
description: >-
  使用一种能感知协议配置的机制来解析 URI、主机名称、路径等 Web 概念，
  让你的 HTTP（或 HTTPS）网络服务可被访问。
  Ingress 概念允许你通过 Kubernetes API 定义的规则将流量映射到不同后端。
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
入口（Ingress）目前已停止更新。新的功能正在集成至[网关 API](/zh-cn/docs/concepts/services-networking/gateway/) 中。
{{< /note >}}

<!-- body -->

<!--
## Terminology

For clarity, this guide defines the following terms:
-->
## 术语  {#terminology}

为了表达更加清晰，本指南定义以下术语：

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
* 节点（Node）: Kubernetes 集群中的一台工作机器，是集群的一部分。
* 集群（Cluster）: 一组运行容器化应用程序的 Node，这些应用由 Kubernetes 管理。
  在此示例和在大多数常见的 Kubernetes 部署环境中，集群中的节点都不在公共网络中。
* 边缘路由器（Edge Router）: 在集群中强制执行防火墙策略的路由器。
  可以是由云提供商管理的网关，也可以是物理硬件。
* 集群网络（Cluster Network）: 一组逻辑的或物理的连接，基于 Kubernetes
  [网络模型](/zh-cn/docs/concepts/cluster-administration/networking/)实现集群内的通信。
* 服务（Service）：Kubernetes {{< glossary_tooltip term_id="service" >}}，
  使用{{< glossary_tooltip text="标签" term_id="label" >}}选择算符（Selectors）
  来选择一组 Pod。除非另作说明，否则假定 Service 具有只能在集群网络内路由的虚拟 IP。

<!--
## What is Ingress?

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)
exposes HTTP and HTTPS routes from outside the cluster to
{{< link text="services" url="/docs/concepts/services-networking/service/" >}} within the cluster.
Traffic routing is controlled by rules defined on the Ingress resource.
-->
## Ingress 是什么？  {#what-is-ingress}

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)
提供从集群外部到集群内[服务](/zh-cn/docs/concepts/services-networking/service/)的
HTTP 和 HTTPS 路由。
流量路由由 Ingress 资源所定义的规则来控制。

<!--
Here is a simple example where an Ingress sends all its traffic to one Service:
-->
下面是 Ingress 的一个简单示例，可将所有流量都发送到同一 Service：

{{< figure src="/zh-cn/docs/images/ingress.svg" alt="ingress-diagram" class="diagram-large" caption="图. Ingress" link="https://mermaid.live/edit#pako:eNqNkktLAzEQgP9KSC8Ku6XWBxKlJz0IHsQeuz1kN7M2uC-SrA9sb6X26MFLFZGKoCC0CIIn_Td1139halZq8eJlE2a--TI7yRn2YgaYYCc6EDRpod39DSdCyAs4RGqhMRndffRfs6dxc9Euox0NgZR2NhpmF73sqos2XVFD-ctt_vY2uTnPh8PJ4BGV7Ro3ZKOoaH5Li6Bt19r56zi7fM4fupP-oC1BHHEPGnWzGlimruno87qXvd__qjdpw2pXErOlxl7Mmn_j1VkcImb-i0q5BT5KAsoj5PMgICXGmCWViA-BlHzfL_b2MWeqRVaSE8uLg1iQUqVS2ZiTHK7LQrFcXfNg9V8WnZu3eEEqFYjCNCslJdd15zXVmcacODP9TMcqJmBN5zL9VKdt_uLM1ZoBzIVNF8WqM06ELRyCCCln-oWcTVkHqxaE4GCitwx8mgbK0Y-no9E0YVTBNuMqFpj4NJBgYZqquH4aeZgokcIPtMWpvtywoDpfU3_yww" >}}

<!-- 
An Ingress may be configured to give Services externally-reachable URLs,
load balance traffic, terminate SSL / TLS, and offer name-based virtual hosting.
An [Ingress controller](/docs/concepts/services-networking/ingress-controllers)
is responsible for fulfilling the Ingress, usually with a load balancer, though
it may also configure your edge router or additional frontends to help handle the traffic.
-->
通过配置，Ingress 可为 Service 提供外部可访问的 URL、对其流量作负载均衡、
终止 SSL/TLS，以及基于名称的虚拟托管等能力。
[Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)
负责完成 Ingress 的工作，具体实现上通常会使用某个负载均衡器，
不过也可以配置边缘路由器或其他前端来帮助处理流量。

<!-- 
An Ingress does not expose arbitrary ports or protocols. Exposing services other than HTTP and HTTPS to the internet typically
uses a service of type [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport) or
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).
-->
Ingress 不会随意公开端口或协议。
将 HTTP 和 HTTPS 以外的服务开放到 Internet 时，通常使用
[Service.Type=NodePort](/zh-cn/docs/concepts/services-networking/service/#type-nodeport)
或 [Service.Type=LoadBalancer](/zh-cn/docs/concepts/services-networking/service/#loadbalancer)
类型的 Service。

<!--
## Prerequisites

You must have an [Ingress controller](/docs/concepts/services-networking/ingress-controllers)
to satisfy an Ingress. Only creating an Ingress resource has no effect.
-->
## 环境准备  {#prerequisites}

你必须拥有一个 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers) 才能满足
Ingress 的要求。仅创建 Ingress 资源本身没有任何效果。

<!-- 
You may need to deploy an Ingress controller such as [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/).
You can choose from a number of [Ingress controllers](/docs/concepts/services-networking/ingress-controllers).
-->
你可能需要部署一个 Ingress 控制器，例如 [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/)。
你可以从许多 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)中进行选择。

<!-- 
Ideally, all Ingress controllers should fit the reference specification. In reality, the various Ingress
controllers operate slightly differently.
 -->
理想情况下，所有 Ingress 控制器都应遵从参考规范。
但实际上，各个 Ingress 控制器操作略有不同。

{{< note >}}
<!--
Make sure you review your Ingress controller's documentation to understand the caveats of choosing it.
-->
确保你查看了 Ingress 控制器的文档，以了解选择它的注意事项。
{{< /note >}}

<!--
## The Ingress resource

A minimal Ingress resource example:
-->
## Ingress 资源  {#the-ingress-resource}

一个最小的 Ingress 资源示例：

{{% code_sample file="service/networking/minimal-ingress.yaml" %}}

<!-- 
An Ingress needs `apiVersion`, `kind`, `metadata` and `spec` fields.
The name of an Ingress object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
For general information about working with config files, see [deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/), [configuring containers](/docs/tasks/configure-pod-container/configure-pod-configmap/), [managing resources](/docs/concepts/cluster-administration/manage-deployment/).
Ingress frequently uses annotations to configure some options depending on the Ingress controller, an example of which
is the [rewrite-target annotation](https://github.com/kubernetes/ingress-nginx/blob/main/docs/examples/rewrite/README.md).
Different [Ingress controllers](/docs/concepts/services-networking/ingress-controllers) support different annotations.
Review the documentation for your choice of Ingress controller to learn which annotations are supported.
-->
Ingress 需要指定 `apiVersion`、`kind`、 `metadata`和 `spec` 字段。
Ingress 对象的命名必须是合法的 [DNS 子域名名称](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
关于如何使用配置文件的一般性信息，请参见[部署应用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)、
[配置容器](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)、
[管理资源](/zh-cn/docs/concepts/cluster-administration/manage-deployment/)。
Ingress 经常使用注解（Annotations）来配置一些选项，具体取决于 Ingress 控制器，
例如 [rewrite-target 注解](https://github.com/kubernetes/ingress-nginx/blob/main/docs/examples/rewrite/README.md)。
不同的 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)支持不同的注解。
查看你所选的 Ingress 控制器的文档，以了解其所支持的注解。

<!-- 
The [Ingress spec](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)
has all the information needed to configure a load balancer or proxy server. Most importantly, it
contains a list of rules matched against all incoming requests. Ingress resource only supports rules
for directing HTTP(S) traffic.
-->
[Ingress 规约](/zh-cn/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)
提供了配置负载均衡器或者代理服务器所需要的所有信息。
最重要的是，其中包含对所有入站请求进行匹配的规则列表。
Ingress 资源仅支持用于转发 HTTP(S) 流量的规则。

<!--
If the `ingressClassName` is omitted, a [default Ingress class](#default-ingress-class)
should be defined.

There are some ingress controllers, that work without the definition of a
default `IngressClass`. For example, the Ingress-NGINX controller can be
configured with a [flag](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class`. It is [recommended](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#i-have-only-one-ingress-controller-in-my-cluster-what-should-i-do) though, to specify the
default `IngressClass` as shown [below](#default-ingress-class).
-->
如果 `ingressClassName` 被省略，那么你应该定义一个[默认的 Ingress 类](#default-ingress-class)。

有些 Ingress 控制器不需要定义默认的 `IngressClass`。比如：Ingress-NGINX
控制器可以通过[参数](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class` 来配置。
不过仍然[推荐](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#i-have-only-one-ingress-controller-in-my-cluster-what-should-i-do)
按[下文](#default-ingress-class)所示来设置默认的 `IngressClass`。

<!-- 
### Ingress rules

Each HTTP rule contains the following information:
-->
### Ingress 规则  {#ingress-rules}

每个 HTTP 规则都包含以下信息：

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
* 可选的 `host`。在此示例中，未指定 `host`，因此该规则基于所指定 IP 地址来匹配所有入站 HTTP 流量。
  如果提供了 `host`（例如 `foo.bar.com`），则 `rules` 适用于所指定的主机。
* 路径列表（例如 `/testpath`）。每个路径都有一个由 `service.name` 和 `service.port.name`
  或 `service.port.number` 确定的关联后端。
  主机和路径都必须与入站请求的内容相匹配，负载均衡器才会将流量引导到所引用的 Service，
* `backend`（后端）是 [Service 文档](/zh-cn/docs/concepts/services-networking/service/)中所述的 Service 和端口名称的组合，
  或者是通过 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}
  方式来实现的[自定义资源后端](#resource-backend)。
  对于发往 Ingress 的 HTTP（和 HTTPS）请求，如果与规则中的主机和路径匹配，
  则会被发送到所列出的后端。

<!-- 
A `defaultBackend` is often configured in an Ingress controller to service any requests that do not
match a path in the spec. 
-->
通常会在 Ingress 控制器中配置 `defaultBackend`（默认后端），
以便为无法与规约中任何路径匹配的所有请求提供服务。

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
### 默认后端  {#default-backend}

没有设置规则的 Ingress 将所有流量发送到同一个默认后端，而在这种情况下
`.spec.defaultBackend` 则是负责处理请求的那个默认后端。
`defaultBackend` 通常是
[Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)的配置选项，
而非在 Ingress 资源中设置。
如果未设置 `.spec.rules`，则必须设置 `.spec.defaultBackend`。
如果未设置 `defaultBackend`，那么如何处理与所有规则都不匹配的流量将交由
Ingress 控制器决定（请参考你的 Ingress 控制器的文档以了解它是如何处理这种情况的）。

如果 Ingress 对象中主机和路径都没有与 HTTP 请求匹配，则流量将被路由到默认后端。

<!--
### Resource backends {#resource-backend}

A `Resource` backend is an ObjectRef to another Kubernetes resource within the
same namespace as the Ingress object. A `Resource` is a mutually exclusive
setting with Service, and will fail validation if both are specified. A common
usage for a `Resource` backend is to ingress data to an object storage backend
with static assets.
-->
### 资源后端  {#resource-backend}

`Resource` 后端是一个 ObjectRef 对象，指向同一名字空间中的另一个 Kubernetes 资源，
将其视为 Ingress 对象。
`Resource` 后端与 Service 后端是互斥的，在二者均被设置时会无法通过合法性检查。
`Resource` 后端的一种常见用法是将所有入站数据导向保存静态资产的对象存储后端。

{{% code_sample file="service/networking/ingress-resource-backend.yaml" %}}

<!--
After creating the Ingress above, you can view it with the following command:
-->
创建了如上的 Ingress 之后，你可以使用下面的命令查看它：

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
### 路径类型  {#path-types}

Ingress 中的每个路径都需要有对应的路径类型（Path Type）。未明确设置 `pathType`
的路径无法通过合法性检查。当前支持的路径类型有三种：

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
* `ImplementationSpecific`：对于这种路径类型，匹配方法取决于 IngressClass。
  具体实现可以将其作为单独的 `pathType` 处理或者作与 `Prefix` 或 `Exact`
  类型相同的处理。

* `Exact`：精确匹配 URL 路径，且区分大小写。

* `Prefix`：基于以 `/` 分隔的 URL 路径前缀匹配。匹配区分大小写，
  并且对路径中各个元素逐个执行匹配操作。
  路径元素指的是由 `/` 分隔符分隔的路径中的标签列表。
  如果每个 _p_ 都是请求路径 _p_ 的元素前缀，则请求与路径 _p_ 匹配。

  {{< note >}}
  如果路径的最后一个元素是请求路径中最后一个元素的子字符串，则不会被视为匹配
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

| 类型   | 路径                            | 请求路径        | 匹配与否？               |
|--------|---------------------------------|-----------------|--------------------------|
| Prefix | `/`                             | （所有路径）    | 是                       |
| Exact  | `/foo`                          | `/foo`          | 是                       |
| Exact  | `/foo`                          | `/bar`          | 否                       |
| Exact  | `/foo`                          | `/foo/`         | 否                       |
| Exact  | `/foo/`                         | `/foo`          | 否                       |
| Prefix | `/foo`                          | `/foo`, `/foo/` | 是                       |
| Prefix | `/foo/`                         | `/foo`, `/foo/` | 是                       |
| Prefix | `/aaa/bb`                       | `/aaa/bbb`      | 否                       |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb`      | 是                       |
| Prefix | `/aaa/bbb/`                     | `/aaa/bbb`      | 是，忽略尾部斜线         |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/`     | 是，匹配尾部斜线         |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/ccc`  | 是，匹配子路径           |
| Prefix | `/aaa/bbb`                      | `/aaa/bbbxyz`   | 否，字符串前缀不匹配     |
| Prefix | `/`, `/aaa`                     | `/aaa/ccc`      | 是，匹配 `/aaa` 前缀     |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/aaa/bbb`      | 是，匹配 `/aaa/bbb` 前缀 |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/ccc`          | 是，匹配 `/` 前缀        |
| Prefix | `/aaa`                          | `/ccc`          | 否，使用默认后端         |
| 混合   | `/foo` (Prefix), `/foo` (Exact) | `/foo`          | 是，优选 Exact 类型      |

<!-- 
#### Multiple matches

In some cases, multiple paths within an Ingress will match a request. In those
cases precedence will be given first to the longest matching path. If two paths
are still equally matched, precedence will be given to paths with an exact path
type over prefix path type.
 -->
#### 多重匹配  {#multiple-matches}

在某些情况下，Ingress 中会有多条路径与同一个请求匹配。这时匹配路径最长者优先。
如果仍然有两条同等的匹配路径，则精确路径类型优先于前缀路径类型。

<!--
## Hostname wildcards

Hosts can be precise matches (for example “`foo.bar.com`”) or a wildcard (for
example “`*.foo.com`”). Precise matches require that the HTTP `host` header
matches the `host` field. Wildcard matches require the HTTP `host` header is
equal to the suffix of the wildcard rule.
-->
## 主机名通配符   {#hostname-wildcards}

主机名可以是精确匹配（例如 “`foo.bar.com`”）或者使用通配符来匹配
（例如 “`*.foo.com`”）。
精确匹配要求 HTTP `host` 头部字段与 `host` 字段值完全匹配。
通配符匹配则要求 HTTP `host` 头部字段与通配符规则中的后缀部分相同。

<!--
| Host         | Host header        | Match?                                              |
| ------------ |--------------------| ----------------------------------------------------|
| `*.foo.com`  | `bar.foo.com`      | Matches based on shared suffix                      |
| `*.foo.com`  | `baz.bar.foo.com`  | No match, wildcard only covers a single DNS label   |
| `*.foo.com`  | `foo.com`          | No match, wildcard only covers a single DNS label   |
-->
| 主机         | host 头部          | 匹配与否？                          |
| ------------ |--------------------| ------------------------------------|
| `*.foo.com`  | `bar.foo.com`      | 基于相同的后缀匹配                  |
| `*.foo.com`  | `baz.bar.foo.com`  | 不匹配，通配符仅覆盖了一个 DNS 标签 |
| `*.foo.com`  | `foo.com`          | 不匹配，通配符仅覆盖了一个 DNS 标签 |

{{% code_sample file="service/networking/ingress-wildcard-host.yaml" %}}

<!-- 
## Ingress class

Ingresses can be implemented by different controllers, often with different
configuration. Each Ingress should specify a class, a reference to an
IngressClass resource that contains additional configuration including the name
of the controller that should implement the class.
-->
## Ingress 类  {#ingress-class}

Ingress 可以由不同的控制器实现，通常使用不同的配置。
每个 Ingress 应当指定一个类，也就是一个对 IngressClass 资源的引用。
IngressClass 资源包含额外的配置，其中包括应当实现该类的控制器名称。

{{% code_sample file="service/networking/external-lb.yaml" %}}

<!-- 
The `.spec.parameters` field of an IngressClass lets you reference another
resource that provides configuration related to that IngressClass.

The specific type of parameters to use depends on the ingress controller
that you specify in the `.spec.controller` field of the IngressClass.
 -->
IngressClass 中的 `.spec.parameters` 字段可用于引用其他资源以提供与该
IngressClass 相关的配置。

参数（`parameters`）的具体类型取决于你在 IngressClass 的 `.spec.controller`
字段中指定的 Ingress 控制器。

<!--
### IngressClass scope

Depending on your ingress controller, you may be able to use parameters
that you set cluster-wide, or just for one namespace.
-->
### IngressClass 的作用域  {#ingressclass-scope}

取决于你所使用的 Ingress 控制器，你可能可以使用集群作用域的参数或某个名字空间作用域的参数。

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="集群作用域" %}}

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
IngressClass 参数的默认作用域是集群范围。

如果你设置了 `.spec.parameters` 字段且未设置 `.spec.parameters.scope`
字段，或是将 `.spec.parameters.scope` 字段设为了 `Cluster`，
那么该 IngressClass 所引用的即是一个集群作用域的资源。
参数的 `kind`（和 `apiGroup` 一起）指向一个集群作用域的 API 类型
（可能是一个定制资源（Custom Resource）），而其 `name` 字段则进一步确定
该 API 类型的一个具体的、集群作用域的资源。

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
    # 此 IngressClass 的配置定义在一个名为 “external-config-1” 的
    # ClusterIngressParameter（API 组为 k8s.example.net）资源中。
    # 这项定义告诉 Kubernetes 去寻找一个集群作用域的参数资源。
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```

{{% /tab %}}
{{% tab name="命名空间作用域" %}}
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
如果你设置了 `.spec.parameters` 字段且将 `.spec.parameters.scope`
字段设为了 `Namespace`，那么该 IngressClass 将会引用一个名字空间作用域的资源。
`.spec.parameters.namespace` 必须和此资源所处的名字空间相同。

参数的 `kind`（和 `apiGroup` 一起）指向一个命名空间作用域的 API 类型
（例如：ConfigMap），而其 `name` 则进一步确定指定 API 类型的、
位于你指定的命名空间中的具体资源。

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
名字空间作用域的参数帮助集群操作者将对工作负载所需的配置数据（比如：负载均衡设置、
API 网关定义）的控制权力委派出去。如果你使用集群作用域的参数，那么你将面临以下情况之一：

- 每次应用一项新的配置变更时，集群操作团队需要批准其他团队所作的修改。
- 集群操作团队必须定义具体的准入控制规则，比如 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)
  角色与角色绑定，以使得应用程序团队可以修改集群作用域的配置参数资源。

<!--
The IngressClass API itself is always cluster-scoped.

Here is an example of an IngressClass that refers to parameters that are
namespaced:
-->
IngressClass API 本身是集群作用域的。

这里是一个引用名字空间作用域配置参数的 IngressClass 的示例：

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # 此 IngressClass 的配置定义在一个名为 “external-config” 的
    # IngressParameter（API 组为 k8s.example.com）资源中，
    # 该资源位于 “external-configuration” 名字空间中。
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
### 已废弃的注解  {#deprecated-annotation}

在 Kubernetes 1.18 版本引入 IngressClass 资源和 `ingressClassName` 字段之前，
Ingress 类是通过 Ingress 中的一个 `kubernetes.io/ingress.class` 注解来指定的。
这个注解从未被正式定义过，但是得到了 Ingress 控制器的广泛支持。

<!-- 
The newer `ingressClassName` field on Ingresses is a replacement for that
annotation, but is not a direct equivalent. While the annotation was generally
used to reference the name of the Ingress controller that should implement the
Ingress, the field is a reference to an IngressClass resource that contains
additional Ingress configuration, including the name of the Ingress controller.
-->
Ingress 中新的 `ingressClassName` 字段用来替代该注解，但并非完全等价。
注解通常用于引用实现该 Ingress 的控制器的名称，而这个新的字段则是对一个包含额外
Ingress 配置的 IngressClass 资源的引用，其中包括了 Ingress 控制器的名称。

<!-- 
### Default IngressClass {#default-ingress-class}

You can mark a particular IngressClass as default for your cluster. Setting the
`ingressclass.kubernetes.io/is-default-class` annotation to `true` on an
IngressClass resource will ensure that new Ingresses without an
`ingressClassName` field specified will be assigned this default IngressClass.
-->
### 默认 Ingress 类  {#default-ingress-class}

你可以将一个特定的 IngressClass 标记为集群默认 Ingress 类。
将某个 IngressClass 资源的 `ingressclass.kubernetes.io/is-default-class` 注解设置为
`true` 将确保新的未指定 `ingressClassName` 字段的 Ingress 能够被赋予这一默认
IngressClass.

{{< caution >}}
<!-- 
If you have more than one IngressClass marked as the default for your cluster,
the admission controller prevents creating new Ingress objects that don't have
an `ingressClassName` specified. You can resolve this by ensuring that at most 1
IngressClass is marked as default in your cluster.
 -->
如果集群中有多个 IngressClass 被标记为默认，准入控制器将阻止创建新的未指定
`ingressClassName` 的 Ingress 对象。
解决这个问题需要确保集群中最多只能有一个 IngressClass 被标记为默认。
{{< /caution >}}

<!--
There are some ingress controllers, that work without the definition of a
default `IngressClass`. For example, the Ingress-NGINX controller can be
configured with a [flag](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class`. It is [recommended](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)  though, to specify the
default `IngressClass`:
-->
有一些 Ingress 控制器不需要定义默认的 `IngressClass`。比如：Ingress-NGINX
控制器可以通过[参数](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class` 来配置。
不过仍然[推荐](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)
设置默认的 `IngressClass`。

{{% code_sample file="service/networking/default-ingressclass.yaml" %}}

<!--
## Types of Ingress

### Ingress backed by a single Service {#single-service-ingress}

There are existing Kubernetes concepts that allow you to expose a single Service
(see [alternatives](#alternatives)). You can also do this with an Ingress by specifying a
*default backend* with no rules.
-->
## Ingress 类型  {#types-of-ingress}

### 由单个 Service 来支持的 Ingress   {#single-service-ingress}

现有的 Kubernetes 概念允许你暴露单个 Service（参见[替代方案](#alternatives)）。
你也可以使用 Ingress 并设置无规则的**默认后端**来完成这类操作。

{{% code_sample file="service/networking/test-ingress.yaml" %}}

<!-- 
If you create it using `kubectl apply -f` you should be able to view the state
of the Ingress you added:
-->
如果使用 `kubectl apply -f` 创建此 Ingress，则应该能够查看刚刚添加的 Ingress 的状态：

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
其中 `203.0.113.123` 是由 Ingress 控制器分配的 IP，用以服务于此 Ingress。

{{< note >}}
<!--
Ingress controllers and load balancers may take a minute or two to allocate an IP address.
Until that time, you often see the address listed as `<pending>`.
-->
Ingress 控制器和负载平衡器的 IP 地址分配操作可能需要一两分钟。
在此之前，你通常会看到地址字段的取值为 `<pending>`。
{{< /note >}}

<!--
### Simple fanout

A fanout configuration routes traffic from a single IP address to more than one Service,
based on the HTTP URI being requested. An Ingress allows you to keep the number of load balancers
down to a minimum. For example, a setup like:
-->
### 简单扇出  {#simple-fanout}

一个扇出（Fanout）配置根据请求的 HTTP URI 将来自同一 IP 地址的流量路由到多个 Service。
Ingress 允许你将负载均衡器的数量降至最低。例如，这样的设置：

{{< figure src="/zh-cn/docs/images/ingressFanOut.svg" alt="ingress-fanout-diagram" class="diagram-large" caption="图. Ingress 扇出" link="https://mermaid.live/edit#pako:eNqNUk1v0zAY_iuWewEpyRKnjM5FPY0DEgfEjk0PTvxmtZbGke3woW03NDjuChNCRRyQkMYFidP4NyXlX5DMjroykLg4j_x8vM6j9xhnkgOm-FCxao4ePx0nJUJZIaA0d6ary48_33xvvnyd3fUD9Kg8VKC131wum_Oz5t0r9CBVE7T-9mF9dbV6_3q9XK7efkaBPxFWOXUOD0X3R8FeFEQkDqKYzK6HOJHvT052cilPNKhnIoNoemAB6i_okIThbU_KVO8hf3oIHYUj59F1an_u18VZ8-PTjRhLuyltZiV5NH0i-ewvBLlFEEvE_yKGGwJKbmtlWu9DjqqCiRLloijogHPuaaPkEdBBnucO-88FN3M6rF54mSykooMwDMdbIUcj7SJispvBvf9KabntlKyotQHlkjZWOkjTdDuGbGLsxE1S36jXl9YD4nWldsc1irtj2D39htdumy1l69q-zH3H2MMLUAsmeLuux50uwWYOC0gwbSGHnNWFSXBSnrbSuuLMwEMujFSY5qzQ4GFWG3nwsswwNaqGXrQvWLsgC6c6_Q0zxBrK" >}}

<!--
It would require an Ingress such as:
-->
这将需要一个如下所示的 Ingress：

{{% code_sample file="service/networking/simple-fanout-example.yaml" %}}

<!--
When you create the Ingress with `kubectl apply -f`:
-->
当你使用 `kubectl apply -f` 创建 Ingress 时：

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
此 Ingress 控制器构造一个特定于实现的负载均衡器来供 Ingress 使用，
前提是 Service （`service1`、`service2`）存在。
当它完成负载均衡器的创建时，你会在 Address 字段看到负载均衡器的地址。

{{< note >}}
<!--
Depending on the [Ingress controller](/docs/concepts/services-networking/ingress-controllers/)
you are using, you may need to create a default-http-backend
[Service](/docs/concepts/services-networking/service/).
-->
取决于你所使用的 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers/)，
你可能需要创建默认 HTTP 后端[服务](/zh-cn/docs/concepts/services-networking/service/)。
{{< /note >}}

<!--
### Name based virtual hosting

Name-based virtual hosts support routing HTTP traffic to multiple host names at the same IP address.
-->
### 基于名称的虚拟主机服务   {#name-based-virtual-hosting}

基于名称的虚拟主机支持将针对多个主机名的 HTTP 流量路由到同一 IP 地址上。

{{< figure src="/zh-cn/docs/images/ingressNameBased.svg" alt="ingress-namebase-diagram" class="diagram-large" caption="图. 基于名称实现虚拟托管的 Ingress" link="https://mermaid.live/edit#pako:eNqNkk9v0zAYxr-K5V6GlESNU6B4qKdxQOKA2LHpwYnfrNaSOLId_mjbDQ2OXAdMUxEHJKRxQWLaND4NXcq3IJkT2gKTuDiv_Dzv73UevXs4lhwwxTuKFVP06MlmmCMUpwJyszGen364ev2t-vxlcsv10MN8R4HWbnU6q94cVm9fovuRGqHF15PF5eX8-NViNpsffUKeOxLWOW47HOTfHXr3fM8ngecHZHI9pDW57mj_x9nF1ftzihIpvYgpL5bZvgb1VMTgj7dtgboLOuzfCGiaG8gKgPwJIL8Buozsb_98d1h9_7jCtHI7sB5QSO6PH0s--YdA_hKIFYKbhMFSgJzbwJnWW5CgImUiR4lIU9rjnDvaKLkLtJckSVu7zwQ3UzoonjuxTKWivX6_v7kG2R3qFhGQOzHc_i9Kra1T4rTUBlRLWrbSXhRF6xiyxNiJS1KXqNOF1hXEaUJtjusqaI5B8_SVXruHNpS1a_uy9lsr2MEZqIwJXq_yXuMMsZlCBiGmdckhYWVqQhzmB7W1LDgz8IALIxWmCUs1OJiVRm6_yGNMjSqhM20JVq9I1roOfgEKNyn5" >}}

<!--
The following Ingress tells the backing load balancer to route requests based on
the [Host header](https://tools.ietf.org/html/rfc7230#section-5.4).
-->
以下 Ingress 让后台负载均衡器基于
[host 头部字段](https://tools.ietf.org/html/rfc7230#section-5.4)来路由请求。

{{% code_sample file="service/networking/name-virtual-host-ingress.yaml" %}}

<!-- 
If you create an Ingress resource without any hosts defined in the rules, then any
web traffic to the IP address of your Ingress controller can be matched without a name based
virtual host being required.
-->
如果你所创建的 Ingress 资源没有在 `rules` 中定义主机，则规则可以匹配指向
Ingress 控制器 IP 地址的所有网络流量，而无需基于名称的虚拟主机。

<!-- 
For example, the following Ingress routes traffic
requested for `first.bar.com` to `service1`, `second.bar.com` to `service2`,
and any traffic whose request host header doesn't match `first.bar.com`
and `second.bar.com` to `service3`.
-->
例如，下面的 Ingress 对象会将请求 `first.bar.com` 的流量路由到 `service1`，将请求
`second.bar.com` 的流量路由到 `service2`，而将所有其他流量路由到 `service3`。

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

你可以通过设定包含 TLS 私钥和证书的{{< glossary_tooltip text="Secret" term_id="secret" >}}
来保护 Ingress。
Ingress 资源只支持一个 TLS 端口 443，并假定 TLS 连接终止于 Ingress 节点
（与 Service 及其 Pod 间的流量都以明文传输）。
如果 Ingress 中的 TLS 配置部分指定了不同主机，那么它们将通过
SNI TLS 扩展指定的主机名（如果 Ingress 控制器支持 SNI）在同一端口上进行复用。
TLS Secret 的数据中必须包含键名为 `tls.crt` 的证书和键名为 `tls.key` 的私钥，
才能用于 TLS 目的。例如：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 编码的证书
  tls.key: base64 编码的私钥
type: kubernetes.io/tls
```

<!--
Referencing this secret in an Ingress tells the Ingress controller to
secure the channel from the client to the load balancer using TLS. You need to make
sure the TLS secret you created came from a certificate that contains a Common
Name (CN), also known as a Fully Qualified Domain Name (FQDN) for `https-example.foo.com`.
-->
在 Ingress 中引用此 Secret 将会告诉 Ingress 控制器使用 TLS 加密从客户端到负载均衡器的通道。
你要确保所创建的 TLS Secret 创建自包含 `https-example.foo.com` 的公共名称
（Common Name，CN）的证书。这里的公共名称也被称为全限定域名（Fully Qualified Domain Name，FQDN）。

{{< note >}}
<!--
Keep in mind that TLS will not work on the default rule because the
certificates would have to be issued for all the possible sub-domains. Therefore,
`hosts` in the `tls` section need to explicitly match the `host` in the `rules`
section.
-->
注意，不能针对默认规则使用 TLS，因为这样做需要为所有可能的子域名签发证书。
因此，`tls` 字段中的 `hosts` 的取值需要与 `rules` 字段中的 `host` 完全匹配。
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
各种 Ingress 控制器在所支持的 TLS 特性上参差不齐。请参阅与
[nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/)、
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https)
或者任何其他平台特定的 Ingress 控制器有关的文档，以了解 TLS 如何在你的环境中工作。
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
### 负载均衡  {#load-balancing}

Ingress 控制器启动引导时使用一些适用于所有 Ingress 的负载均衡策略设置，
例如负载均衡算法、后端权重方案等。
更高级的负载均衡概念（例如持久会话、动态权重）尚未通过 Ingress 公开。
你可以通过用于 Service 的负载均衡器来获取这些功能。

<!--
It's also worth noting that even though health checks are not exposed directly
through the Ingress, there exist parallel concepts in Kubernetes such as
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
that allow you to achieve the same end result. Please review the controller
specific documentation to see how they handle health checks (for example:
[nginx](https://git.k8s.io/ingress-nginx/README.md), or
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).
-->
值得注意的是，尽管健康检查不是通过 Ingress 直接暴露的，在 Kubernetes
中存在[就绪态探针](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
这类等价的概念，供你实现相同的目的。
请查阅特定控制器的说明文档（例如：[nginx](https://git.k8s.io/ingress-nginx/README.md)、
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)）
以了解它们是怎样处理健康检查的。

<!--
## Updating an Ingress

To update an existing Ingress to add a new Host, you can update it by editing the resource:
-->
## 更新 Ingress   {#updating-an-ingress}

要更新现有的 Ingress 以添加新的 Host，可以通过编辑资源来更新它：

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
这一命令将打开编辑器，允许你以 YAML 格式编辑现有配置。
修改它来增加新的主机：

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
保存更改后，kubectl 将更新 API 服务器上的资源，该资源将告诉 Ingress 控制器重新配置负载均衡器。

<!--
Verify this:
-->
验证：

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
你也可以针对修改后的 Ingress YAML 文件，通过 `kubectl replace -f` 命令获得同样结果。

<!--
## Failing across availability zones

Techniques for spreading traffic across failure domains differ between cloud providers.
Please check the documentation of the relevant [Ingress controller](/docs/concepts/services-networking/ingress-controllers) for details.
-->
## 跨可用区的失效  {#failing-across-availability-zones}

不同的云厂商使用不同的技术来实现跨故障域的流量分布。
请查看相关 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)的文档以了解详细信息。

<!--
## Alternatives

You can expose a Service in multiple ways that don't directly involve the Ingress resource:
-->
## 替代方案    {#alternatives}

不直接使用 Ingress 资源，也有多种方法暴露 Service：

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
* [Set up Ingress on Minikube with the NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube/)
-->
* 进一步了解 [Ingress](/zh-cn/docs/reference/kubernetes-api/service-resources/ingress-v1/) API
* 进一步了解 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers/)
* [使用 NGINX 控制器在 Minikube 上安装 Ingress](/zh-cn/docs/tasks/access-application-cluster/ingress-minikube/)
