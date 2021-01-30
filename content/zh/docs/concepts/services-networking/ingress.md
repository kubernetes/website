---
title: Ingress
content_type: concept
weight: 40
---
<!--
title: Ingress
content_type: concept
weight: 40
-->

<!-- overview -->
{{< feature-state for_k8s_version="v1.19" state="stable" >}}
{{< glossary_definition term_id="ingress" length="all" >}}

<!-- body -->

<!--
## Terminology

For clarity, this guide defines the following terms:
-->
## 术语

为了表达更加清晰，本指南定义了以下术语：

<!-- 
* Node: A worker machine in Kubernetes, part of a cluster.
* Cluster: A set of Nodes that run containerized applications managed by Kubernetes. For this example, and in most common Kubernetes deployments, nodes in the cluster are not part of the public internet.
* Edge router: A router that enforces the firewall policy for your cluster. This could be a gateway managed by a cloud provider or a physical piece of hardware.
* Cluster network: A set of links, logical or physical, that facilitate communication within a cluster according to the Kubernetes [networking model](/docs/concepts/cluster-administration/networking/).
* Service: A Kubernetes {{< glossary_tooltip term_id="service" >}} that identifies a set of Pods using {{< glossary_tooltip text="label" term_id="label" >}} selectors. Unless mentioned otherwise, Services are assumed to have virtual IPs only routable within the cluster network.
 -->
* 节点（Node）: Kubernetes 集群中其中一台工作机器，是集群的一部分。
* 集群（Cluster）: 一组运行由 Kubernetes 管理的容器化应用程序的节点。
  在此示例和在大多数常见的 Kubernetes 部署环境中，集群中的节点都不在公共网络中。
* 边缘路由器（Edge router）: 在集群中强制执行防火墙策略的路由器（router）。
  可以是由云提供商管理的网关，也可以是物理硬件。
* 集群网络（Cluster network）: 一组逻辑的或物理的连接，根据 Kubernetes
  [网络模型](/zh/docs/concepts/cluster-administration/networking/) 在集群内实现通信。
* 服务（Service）：Kubernetes {{< glossary_tooltip text="服务" term_id="service" >}}使用
  {{< glossary_tooltip text="标签" term_id="label" >}}选择算符（selectors）标识的一组 Pod。
  除非另有说明，否则假定服务只具有在集群网络中可路由的虚拟 IP。

<!--
## What is Ingress?

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1beta1-networking-k8s-io) exposes HTTP and HTTPS routes from outside the cluster to
{{< link text="services" url="/docs/concepts/services-networking/service/" >}} within the cluster.
Traffic routing is controlled by rules defined on the Ingress resource.
-->
## Ingress 是什么？

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1beta1-networking-k8s-io)
公开了从集群外部到集群内[服务](/zh/docs/concepts/services-networking/service/)的 HTTP 和 HTTPS 路由。
流量路由由 Ingress 资源上定义的规则控制。

<!--
Here is a simple example where an Ingress sends all its traffic to one Service:
-->
下面是一个将所有流量都发送到同一 Service 的简单 Ingress 示例：

{{< mermaid >}}
graph LR;
  client([客户端])-. Ingress-管理的 <br> 负载均衡器 .->ingress[Ingress];
  ingress-->|路由规则|service[Service];
  subgraph cluster
  ingress;
  service-->pod1[Pod];
  service-->pod2[Pod];
  end
  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service,pod1,pod2 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}

<!-- 
An Ingress may be configured to give Services externally-reachable URLs, load balance traffic, terminate SSL / TLS, and offer name based virtual hosting. An [Ingress controller](/docs/concepts/services-networking/ingress-controllers) is responsible for fulfilling the Ingress, usually with a load balancer, though it may also configure your edge router or additional frontends to help handle the traffic.
-->
可以将 Ingress 配置为服务提供外部可访问的 URL、负载均衡流量、终止 SSL/TLS，以及提供基于名称的虚拟主机等能力。
[Ingress 控制器](/zh/docs/concepts/services-networking/ingress-controllers)
通常负责通过负载均衡器来实现 Ingress，尽管它也可以配置边缘路由器或其他前端来帮助处理流量。

<!-- 
An Ingress does not expose arbitrary ports or protocols. Exposing services other than HTTP and HTTPS to the internet typically
uses a service of type [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport) or
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).
-->
Ingress 不会公开任意端口或协议。
将 HTTP 和 HTTPS 以外的服务公开到 Internet 时，通常使用
[Service.Type=NodePort](/zh/docs/concepts/services-networking/service/#nodeport)
或 [Service.Type=LoadBalancer](/zh/docs/concepts/services-networking/service/#loadbalancer)
类型的服务。

<!--
## Prerequisites

You must have an [ingress controller](/docs/concepts/services-networking/ingress-controllers) to satisfy an Ingress. Only creating an Ingress resource has no effect.
-->
## 环境准备

你必须具有 [Ingress 控制器](/zh/docs/concepts/services-networking/ingress-controllers) 才能满足 Ingress 的要求。
仅创建 Ingress 资源本身没有任何效果。

<!-- 
You may need to deploy an Ingress controller such as [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/). You can choose from a number of
[Ingress controllers](/docs/concepts/services-networking/ingress-controllers).
-->
你可能需要部署 Ingress 控制器，例如 [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/)。
你可以从许多 [Ingress 控制器](/zh/docs/concepts/services-networking/ingress-controllers) 中进行选择。

<!-- 
Ideally, all Ingress controllers should fit the reference specification. In reality, the various Ingress
controllers operate slightly differently.
 -->
理想情况下，所有 Ingress 控制器都应符合参考规范。但实际上，不同的 Ingress 控制器操作略有不同。

<!--
Make sure you review your Ingress controller's documentation to understand the caveats of choosing it.
-->
{{< note >}}
确保你查看了 Ingress 控制器的文档，以了解选择它的注意事项。
{{< /note >}}

<!--
## The Ingress Resource

A minimal Ingress resource example:
-->
## Ingress 资源  {#the-ingress-resource}

一个最小的 Ingress 资源示例：


{{< codenew file="service/networking/minimal-ingress.yaml" >}}

<!-- 
As with all other Kubernetes resources, an Ingress needs `apiVersion`, `kind`, and `metadata` fields.
The name of an Ingress object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
For general information about working with config files, see [deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/), [configuring containers](/docs/tasks/configure-pod-container/configure-pod-configmap/), [managing resources](/docs/concepts/cluster-administration/manage-deployment/).
 Ingress frequently uses annotations to configure some options depending on the Ingress controller, an example of which
 is the [rewrite-target annotation](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md).
Different [Ingress controller](/docs/concepts/services-networking/ingress-controllers) support different annotations. Review the documentation for
 your choice of Ingress controller to learn which annotations are supported.
-->
 与所有其他 Kubernetes 资源一样，Ingress 需要使用 `apiVersion`、`kind` 和 `metadata` 字段。
 Ingress 对象的命名必须是合法的 [DNS 子域名名称](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
 有关使用配置文件的一般信息，请参见[部署应用](/zh/docs/tasks/run-application/run-stateless-application-deployment/)、
[配置容器](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/)、
[管理资源](/zh/docs/concepts/cluster-administration/manage-deployment/)。
 Ingress 经常使用注解（annotations）来配置一些选项，具体取决于 Ingress 控制器，例如
[重写目标注解](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md)。
 不同的 [Ingress 控制器](/zh/docs/concepts/services-networking/ingress-controllers)
支持不同的注解。查看文档以供你选择 Ingress 控制器，以了解支持哪些注解。

<!-- 
The Ingress [spec](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
has all the information needed to configure a load balancer or proxy server. Most importantly, it
contains a list of rules matched against all incoming requests. Ingress resource only supports rules
for directing HTTP traffic.
-->
Ingress [规约](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
提供了配置负载均衡器或者代理服务器所需的所有信息。
最重要的是，其中包含与所有传入请求匹配的规则列表。
Ingress 资源仅支持用于转发 HTTP 流量的规则。

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
* A list of paths (for example, `/testpath`), each of which has an associated backend defined with a `serviceName`
  and `servicePort`. Both the host and path must match the content of an incoming request before the
  load balancer directs traffic to the referenced Service.
* A backend is a combination of Service and port names as described in the
  [Service doc](/docs/concepts/services-networking/service/). HTTP (and HTTPS) requests to the
  Ingress that matches the host and path of the rule are sent to the listed backend.
-->
* 可选的 `host`。在此示例中，未指定 `host`，因此该规则适用于通过指定 IP 地址的所有入站 HTTP 通信。
  如果提供了 `host`（例如 foo.bar.com），则 `rules` 适用于该 `host`。
* 路径列表 paths（例如，`/testpath`）,每个路径都有一个由 `serviceName` 和 `servicePort` 定义的关联后端。
  在负载均衡器将流量定向到引用的服务之前，主机和路径都必须匹配传入请求的内容。
* `backend`（后端）是 [Service 文档](/zh/docs/concepts/services-networking/service/)中所述的服务和端口名称的组合。
  与规则的 `host` 和 `path` 匹配的对 Ingress 的 HTTP（和 HTTPS ）请求将发送到列出的 `backend`。

<!-- 
A `defaultBackend` is often configured in an Ingress controller to service any requests that do not
match a path in the spec. 
-->
通常在 Ingress 控制器中会配置 `defaultBackend`（默认后端），以服务于任何不符合规约中 `path` 的请求。

<!-- 
### DefaultBackend {#default-backend}

An Ingress with no rules sends all traffic to a single default backend. The `defaultBackend` is conventionally a configuration option of the [Ingress controller](/docs/concepts/services-networking/ingress-controllers) and is not specified in your Ingress resources.
-->
### DefaultBackend  {#default-backend}

没有 `rules` 的 Ingress 将所有流量发送到同一个默认后端。
`defaultBackend` 通常是 [Ingress 控制器](/zh/docs/concepts/services-networking/ingress-controllers)
的配置选项，而非在 Ingress 资源中指定。

<!--
If none of the hosts or paths match the HTTP request in the Ingress objects, the traffic is
routed to your default backend.
-->
如果 `hosts` 或 `paths` 都没有与 Ingress 对象中的 HTTP 请求匹配，则流量将路由到默认后端。

<!--
### Resource backends {#resource-backend}

A `Resource` backend is an ObjectRef to another Kubernetes resource within the
same namespace as the Ingress object. A `Resource` is a mutually exclusive
setting with Service, and will fail validation if both are specified. A common
usage for a `Resource` backend is to ingress data to an object storage backend
with static assets.
-->
### 资源后端  {#resource-backend}

`Resource` 后端是一个 `ObjectRef`，指向同一名字空间中的另一个
Kubernetes，将其作为 Ingress 对象。`Resource` 与 `Service` 配置是互斥的，在
二者均被设置时会无法通过合法性检查。
`Resource` 后端的一种常见用法是将所有入站数据导向带有静态资产的对象存储后端。

{{< codenew file="service/networking/ingress-resource-backend.yaml" >}}

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
### Path Types

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
  matches`/foo/bar/baz`, but does not match `/foo/barbaz`).
 -->
* `ImplementationSpecific`：对于这种路径类型，匹配方法取决于 IngressClass。
  具体实现可以将其作为单独的 `pathType` 处理或者与 `Prefix` 或 `Exact` 类型作相同处理。

* `Exact`：精确匹配 URL 路径，且区分大小写。

* `Prefix`：基于以 `/` 分隔的 URL 路径前缀匹配。匹配区分大小写，并且对路径中的元素逐个完成。
  路径元素指的是由 `/` 分隔符分隔的路径中的标签列表。
  如果每个 _p_ 都是请求路径 _p_ 的元素前缀，则请求与路径 _p_ 匹配。

  {{< note >}}
  如果路径的最后一个元素是请求路径中最后一个元素的子字符串，则不会匹配
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
#### Multiple Matches

In some cases, multiple paths within an Ingress will match a request. In those
cases precedence will be given first to the longest matching path. If two paths
are still equally matched, precedence will be given to paths with an exact path
type over prefix path type.
 -->
#### 多重匹配  {#multiple-matches}

在某些情况下，Ingress 中的多条路径会匹配同一个请求。
这种情况下最长的匹配路径优先。
如果仍然有两条同等的匹配路径，则精确路径类型优先于前缀路径类型。

<!--
## Hostname wildcards

Hosts can be precise matches (for example “`foo.bar.com`”) or a wildcard (for
example “`*.foo.com`”). Precise matches require that the HTTP `host` header
matches the `host` field. Wildcard matches require the HTTP `host` header is
equal to the suffix of the wildcard rule.
-->
## 主机名通配符   {#hostname-wildcards}

主机名可以是精确匹配（例如“`foo.bar.com`”）或者使用通配符来匹配
（例如“`*.foo.com`”）。
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

{{< codenew file="service/networking/ingress-wildcard-host.yaml" >}}

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

{{< codenew file="service/networking/external-lb.yaml" >}}

<!-- 
IngressClass resources contain an optional parameters field. This can be used to
reference additional configuration for this class.
 -->
IngressClass 资源包含一个可选的 `parameters` 字段，可用于为该类引用额外配置。

<!-- 
### Deprecated Annotation

Before the IngressClass resource and `ingressClassName` field were added in
Kubernetes 1.18, Ingress classes were specified with a
`kubernetes.io/ingress.class` annotation on the Ingress. This annotation was
never formally defined, but was widely supported by Ingress controllers.
-->
### 废弃的注解  {#deprecated-annotation}

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
Ingress 中新的 `ingressClassName` 字段是该注解的替代品，但并非完全等价。
该注解通常用于引用实现该 Ingress 的控制器的名称，
而这个新的字段则是对一个包含额外 Ingress 配置的 IngressClass 资源的引用，
包括 Ingress 控制器的名称。

<!-- 
### Default IngressClass {#default-ingress-class}

You can mark a particular IngressClass as default for your cluster. Setting the
`ingressclass.kubernetes.io/is-default-class` annotation to `true` on an
IngressClass resource will ensure that new Ingresses without an
`ingressClassName` field specified will be assigned this default IngressClass.
-->
### 默认 Ingress 类  {#default-ingress-class}

你可以将一个特定的 IngressClass 标记为集群默认 Ingress 类。
将一个 IngressClass 资源的 `ingressclass.kubernetes.io/is-default-class` 注解设置为
`true` 将确保新的未指定 `ingressClassName` 字段的 Ingress 能够分配为这个默认的
IngressClass.

<!-- 
If you have more than one IngressClass marked as the default for your cluster,
the admission controller prevents creating new Ingress objects that don't have
an `ingressClassName` specified. You can resolve this by ensuring that at most 1
IngressClasess are marked as default in your cluster.
 -->
{{< caution >}}
如果集群中有多个 IngressClass 被标记为默认，准入控制器将阻止创建新的未指定
`ingressClassName` 的 Ingress 对象。
解决这个问题只需确保集群中最多只能有一个 IngressClass 被标记为默认。
{{< /caution >}}

<!--
## Types of Ingress

### Ingress backed by a single Service {#single-service-ingress}

There are existing Kubernetes concepts that allow you to expose a single Service
(see [alternatives](#alternatives)). You can also do this with an Ingress by specifying a
*default backend* with no rules.
-->
## Ingress 类型  {#types-of-ingress}

### 由单个 Service 来完成的 Ingress   {#single-service-ingress}

现有的 Kubernetes 概念允许你暴露单个 Service (参见[替代方案](#alternatives))。
你也可以通过指定无规则的 *默认后端* 来对 Ingress 进行此操作。

{{< codenew file="service/networking/test-ingress.yaml" >}}

<!-- 
If you create it using `kubectl apply -f` you should be able to view the state
of the Ingress you just added:
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
其中 `203.0.113.123` 是由 Ingress 控制器分配以满足该 Ingress 的 IP。

<!--
Ingress controllers and load balancers may take a minute or two to allocate an IP address.
Until that time, you often see the address listed as `<pending>`.
-->
{{< note >}}
入口控制器和负载平衡器可能需要一两分钟才能分配 IP 地址。
在此之前，你通常会看到地址字段的值被设定为 `<pending>`。
{{< /note >}}

<!--
### Simple fanout

A fanout configuration routes traffic from a single IP address to more than one Service,
based on the HTTP URI being requested. An Ingress allows you to keep the number of load balancers
down to a minimum. For example, a setup like:
-->
### 简单扇出  {#simple-fanout}

一个扇出（fanout）配置根据请求的 HTTP URI 将来自同一 IP 地址的流量路由到多个 Service。
Ingress 允许你将负载均衡器的数量降至最低。例如，这样的设置：

{{< mermaid >}}
graph LR;
  client([客户端])-. Ingress-管理的 <br> 负载均衡器 .->ingress[Ingress, 178.91.123.132];
  ingress-->|/foo|service1[Service service1:4200];
  ingress-->|/bar|service2[Service service2:8080];
  subgraph cluster
  ingress;
  service1-->pod1[Pod];
  service1-->pod2[Pod];
  service2-->pod3[Pod];
  service2-->pod4[Pod];
  end
  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service1,service2,pod1,pod2,pod3,pod4 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}

<!--
would require an Ingress such as:
-->
将需要一个如下所示的 Ingress：

{{< codenew file="service/networking/simple-fanout-example.yaml" >}}

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
Ingress 控制器将提供实现特定的负载均衡器来满足 Ingress，
只要 Service (`service1`，`service2`) 存在。
当它这样做时，你会在 Address 字段看到负载均衡器的地址。

<!--
Depending on the [Ingress controller](/docs/concepts/services-networking/ingress-controllers)
you are using, you may need to create a default-http-backend
[Service](/docs/concepts/services-networking/service/).
-->
{{< note >}}
取决于你所使用的 [Ingress 控制器](/zh/docs/concepts/services-networking/ingress-controllers)，
你可能需要创建默认 HTTP 后端[服务](/zh/docs/concepts/services-networking/service/)。
{{< /note >}}

<!--
### Name based virtual hosting

Name-based virtual hosts support routing HTTP traffic to multiple host names at the same IP address.
-->
### 基于名称的虚拟托管   {#name-based-virtual-hosting}

基于名称的虚拟主机支持将针对多个主机名的 HTTP 流量路由到同一 IP 地址上。

{{< mermaid >}}
graph LR;
  client([客户端])-. Ingress-管理的 <br> 负载均衡器 .->ingress[Ingress, 178.91.123.132];
  ingress-->|Host: foo.bar.com|service1[Service service1:80];
  ingress-->|Host: bar.foo.com|service2[Service service2:80];
  subgraph cluster
  ingress;
  service1-->pod1[Pod];
  service1-->pod2[Pod];
  service2-->pod3[Pod];
  service2-->pod4[Pod];
  end
  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service1,service2,pod1,pod2,pod3,pod4 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}

<!--
The following Ingress tells the backing load balancer to route requests based on
the [Host header](https://tools.ietf.org/html/rfc7230#section-5.4).
-->
以下 Ingress 让后台负载均衡器基于[host 头部字段](https://tools.ietf.org/html/rfc7230#section-5.4)
来路由请求。

{{< codenew file="service/networking/name-virtual-host-ingress.yaml" >}}

<!-- 
If you create an Ingress resource without any hosts defined in the rules, then any
web traffic to the IP address of your Ingress controller can be matched without a name based
virtual host being required.
-->
如果你创建的 Ingress 资源没有在 `rules` 中定义的任何 `hosts`，则可以匹配指向
Ingress 控制器 IP 地址的任何网络流量，而无需基于名称的虚拟主机。

<!-- 
For example, the following Ingress routes traffic
requested for `first.bar.com` to `service1`, `second.bar.com` to `service2`, and any traffic
to the IP address without a hostname defined in request (that is, without a request header being
presented) to `service3`.
-->
例如，以下 Ingress 会将针对 `first.bar.com` 的请求流量路由到 `service1`，
将针对 `second.bar.com` 的请求流量路由到 `service2`，
而针对该 IP 地址的、没有在请求中定义主机名的请求流量会被路由（即，不提供请求标头）
到 `service3`。

{{< codenew file="service/networking/name-virtual-host-ingress-no-third-host.yaml" >}}

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
Ingress 只支持单个 TLS 端口 443，并假定 TLS 连接终止于 Ingress 节点
（与 Service 及其 Pod 之间的流量都以明文传输）。
如果 Ingress 中的 TLS 配置部分指定了不同的主机，那么它们将根据通过 SNI TLS 扩展指定的主机名
（如果 Ingress 控制器支持 SNI）在同一端口上进行复用。
TLS Secret 必须包含名为 `tls.crt` 和 `tls.key` 的键名。
这些数据包含用于 TLS 的证书和私钥。例如：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 编码的 cert
  tls.key: base64 编码的 key
type: kubernetes.io/tls
```

<!--
Referencing this secret in an Ingress tells the Ingress controller to
secure the channel from the client to the load balancer using TLS. You need to make
sure the TLS secret you created came from a certificate that contains a Common
Name (CN), also known as a Fully Qualified Domain Name (FQDN) for `https-example.foo.com`.
-->
在 Ingress 中引用此 Secret 将会告诉 Ingress 控制器使用 TLS 加密从客户端到负载均衡器的通道。
你需要确保创建的 TLS Secret 创建自包含 `sslexample.foo.com` 的公用名称（CN）的证书。
这里的公共名称也被称为全限定域名（FQDN）。

{{< note >}}
<!--
Keep in mind that TLS will not work on the default rule because the
certificates would have to be issued for all the possible sub-domains. Therefore,
`hosts` in the `tls` section need to explicitly match the `host` in the `rules`
section.
-->
注意，默认规则上无法使用 TLS，因为需要为所有可能的子域名发放证书。
因此，`tls` 节区的 `hosts` 的取值需要域 `rules` 节区的 `host`
完全匹配。
{{< /note >}}

{{< codenew file="service/networking/tls-example-ingress.yaml" >}}

<!-- 
There is a gap between TLS features supported by various Ingress
controllers. Please refer to documentation on
[nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/),
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https), or any other
platform specific Ingress controller to understand how TLS works in your environment.
-->
{{< note >}}
各种 Ingress 控制器所支持的 TLS 功能之间存在差异。请参阅有关
[nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/)、
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https)
或者任何其他平台特定的 Ingress 控制器的文档，以了解 TLS 如何在你的环境中工作。
{{< /note >}}

<!--
### Load Balancing   {#load-balancing}

An Ingress controller is bootstrapped with some load balancing policy settings
that it applies to all Ingress, such as the load balancing algorithm, backend
weight scheme, and others. More advanced load balancing concepts
(e.g. persistent sessions, dynamic weights) are not yet exposed through the
Ingress. You can instead get these features through the load balancer used for
a Service.
-->
### 负载均衡  {#load-balancing}

Ingress 控制器启动引导时使用一些适用于所有 Ingress 的负载均衡策略设置，
例如负载均衡算法、后端权重方案和其他等。
更高级的负载均衡概念（例如持久会话、动态权重）尚未通过 Ingress 公开。
你可以通过用于服务的负载均衡器来获取这些功能。

<!--
It's also worth noting that even though health checks are not exposed directly
through the Ingress, there exist parallel concepts in Kubernetes such as
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
that allow you to achieve the same end result. Please review the controller
specific documentation to see how they handle health checks (
[nginx](https://git.k8s.io/ingress-nginx/README.md),
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).
-->
值得注意的是，尽管健康检查不是通过 Ingress 直接暴露的，在 Kubernetes
中存在并行的概念，比如
[就绪检查](/zh/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)，
允许你实现相同的目的。
请检查特定控制器的说明文档（
[nginx](https://git.k8s.io/ingress-nginx/README.md)，
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)）
以了解它们是怎样处理健康检查的。

<!--
## Updating an Ingress

To update an existing Ingress to add a new Host, you can update it by editing the resource:
-->
## 更新 Ingress   {#updating-an-ingress}

要更新现有的 Ingress 以添加新的 Host，可以通过编辑资源来对其进行更新：

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
          serviceName: service1
          servicePort: 80
        path: /foo
        pathType: Prefix
  - host: bar.baz.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
        path: /foo
        pathType: Prefix
..
```

<!--
After you save your changes, kubectl updates the resource in the API server, which tells the
Ingress controller to reconfigure the load balancer.
-->
保存更改后，kubectl 将更新 API 服务器中的资源，该资源将告诉 Ingress 控制器重新配置负载均衡器。

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
你也可以通过 `kubectl replace -f` 命令调用修改后的 Ingress yaml 文件来获得同样的结果。

<!--
## Failing across availability zones

Techniques for spreading traffic across failure domains differs between cloud providers.
Please check the documentation of the relevant [Ingress controller](/docs/concepts/services-networking/ingress-controllers) for details.
-->
## 跨可用区失败  {#failing-across-availability-zones}

不同的云厂商使用不同的技术来实现跨故障域的流量分布。详情请查阅相关 Ingress 控制器的文档。
请查看相关 [Ingress 控制器](/zh/docs/concepts/services-networking/ingress-controllers)
的文档以了解详细信息。

<!--
## Alternatives

You can expose a Service in multiple ways that don't directly involve the Ingress resource:
-->
## 替代方案    {#alternatives}

不直接使用 Ingress 资源，也有多种方法暴露 Service：

<!--
* Use [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Use [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport)
-->
* 使用 [Service.Type=LoadBalancer](/zh/docs/concepts/services-networking/service/#loadbalancer)
* 使用 [Service.Type=NodePort](/zh/docs/concepts/services-networking/service/#nodeport)

## {{% heading "whatsnext" %}}

<!--
* Learn about the [Ingress API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)
* Learn about [Ingress Controllers](/docs/concepts/services-networking/ingress-controllers/)
* [Set up Ingress on Minikube with the NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube/)
-->
* 进一步了解 [Ingress API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1beta1-networking-k8s-io)
* 进一步了解 [Ingress 控制器](/zh/docs/concepts/services-networking/ingress-controllers/)
* [使用 NGINX 控制器在 Minikube 上安装 Ingress](/zh/docs/tasks/access-application-cluster/ingress-minikube/)

