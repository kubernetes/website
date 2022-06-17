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
## 術語  {#terminology}

為了表達更加清晰，本指南定義了以下術語：

<!-- 
* Node: A worker machine in Kubernetes, part of a cluster.
* Cluster: A set of Nodes that run containerized applications managed by Kubernetes. For this example, and in most common Kubernetes deployments, nodes in the cluster are not part of the public internet.
* Edge router: A router that enforces the firewall policy for your cluster. This could be a gateway managed by a cloud provider or a physical piece of hardware.
* Cluster network: A set of links, logical or physical, that facilitate communication within a cluster according to the Kubernetes [networking model](/docs/concepts/cluster-administration/networking/).
* Service: A Kubernetes {{< glossary_tooltip term_id="service" >}} that identifies a set of Pods using {{< glossary_tooltip text="label" term_id="label" >}} selectors. Unless mentioned otherwise, Services are assumed to have virtual IPs only routable within the cluster network.
 -->
* 節點（Node）: Kubernetes 叢集中的一臺工作機器，是叢集的一部分。
* 叢集（Cluster）: 一組執行由 Kubernetes 管理的容器化應用程式的節點。
  在此示例和在大多數常見的 Kubernetes 部署環境中，叢集中的節點都不在公共網路中。
* 邊緣路由器（Edge Router）: 在叢集中強制執行防火牆策略的路由器。可以是由雲提供商管理的閘道器，也可以是物理硬體。
* 叢集網路（Cluster Network）: 一組邏輯的或物理的連線，根據 Kubernetes
  [網路模型](/zh-cn/docs/concepts/cluster-administration/networking/)在叢集內實現通訊。
* 服務（Service）：Kubernetes {{< glossary_tooltip term_id="service" >}}，
  使用{{< glossary_tooltip text="標籤" term_id="label" >}}選擇器（selectors）辨認一組 Pod。
  除非另有說明，否則假定服務只具有在叢集網路中可路由的虛擬 IP。

<!--
## What is Ingress?

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1beta1-networking-k8s-io) exposes HTTP and HTTPS routes from outside the cluster to
{{< link text="services" url="/docs/concepts/services-networking/service/" >}} within the cluster.
Traffic routing is controlled by rules defined on the Ingress resource.
-->
## Ingress 是什麼？  {#what-is-ingress}

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1beta1-networking-k8s-io)
公開從叢集外部到叢集內[服務](/zh-cn/docs/concepts/services-networking/service/)的
HTTP 和 HTTPS 路由。
流量路由由 Ingress 資源上定義的規則控制。

<!--
Here is a simple example where an Ingress sends all its traffic to one Service:
-->
下面是一個將所有流量都發送到同一 Service 的簡單 Ingress 示例：

{{< figure src="/zh-cn/docs/images/ingress.svg" alt="ingress-diagram" class="diagram-large" caption="圖. Ingress" link="https://mermaid.live/edit#pako:eNqNkstuwyAQRX8F4U0r2VHqPlSRKqt0UamLqlnaWWAYJygYLB59KMm_Fxcix-qmGwbuXA7DwAEzzQETXKutof0Ovb4vaoUQkwKUu6pi3FwXM_QSHGBt0VFFt8DRU2OWSGrKUUMlVQwMmhVLEV1Vcm9-aUksiuXRaO_CEhkv4WjBfAgG1TrGaLa-iaUw6a0DcwGI-WgOsF7zm-pN881fvRx1UDzeiFq7ghb1kgqFWiElyTjnuXVG74FkbdumefEpuNuRu_4rZ1pqQ7L5fL6YQPaPNiFuywcG9_-ihNyUkm6YSONWkjVNM8WUIyaeOJLO3clTB_KhL8NQDmVe-OJjxgZM5FhFiiFTK5zjDkxHBQ9_4zB4a-x20EGNSZhyaKmXrg7f5hSsvufUwTMXThtMWiot5Jh6p9ffimHijIezaSVoeN0uiqcfMJvf7w" >}}

<!-- 
An Ingress may be configured to give Services externally-reachable URLs, load balance traffic, terminate SSL / TLS, and offer name based virtual hosting. An [Ingress controller](/docs/concepts/services-networking/ingress-controllers) is responsible for fulfilling the Ingress, usually with a load balancer, though it may also configure your edge router or additional frontends to help handle the traffic.
-->
Ingress 可為 Service 提供外部可訪問的 URL、負載均衡流量、終止 SSL/TLS，以及基於名稱的虛擬託管。
[Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)
通常負責透過負載均衡器來實現 Ingress，儘管它也可以配置邊緣路由器或其他前端來幫助處理流量。

<!-- 
An Ingress does not expose arbitrary ports or protocols. Exposing services other than HTTP and HTTPS to the internet typically
uses a service of type [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport) or
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).
-->
Ingress 不會公開任意埠或協議。
將 HTTP 和 HTTPS 以外的服務公開到 Internet 時，通常使用
[Service.Type=NodePort](/zh-cn/docs/concepts/services-networking/service/#type-nodeport)
或 [Service.Type=LoadBalancer](/zh-cn/docs/concepts/services-networking/service/#loadbalancer)
型別的 Service。

<!--
## Prerequisites

You must have an [ingress controller](/docs/concepts/services-networking/ingress-controllers) to satisfy an Ingress. Only creating an Ingress resource has no effect.
-->
## 環境準備

你必須擁有一個 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers) 才能滿足 Ingress 的要求。
僅建立 Ingress 資源本身沒有任何效果。

<!-- 
You may need to deploy an Ingress controller such as [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/). You can choose from a number of
[Ingress controllers](/docs/concepts/services-networking/ingress-controllers).
-->
你可能需要部署 Ingress 控制器，例如 [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/)。
你可以從許多 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers) 中進行選擇。

<!-- 
Ideally, all Ingress controllers should fit the reference specification. In reality, the various Ingress
controllers operate slightly differently.
 -->
理想情況下，所有 Ingress 控制器都應符合參考規範。但實際上，不同的 Ingress 控制器操作略有不同。

<!--
Make sure you review your Ingress controller's documentation to understand the caveats of choosing it.
-->
{{< note >}}
確保你查看了 Ingress 控制器的文件，以瞭解選擇它的注意事項。
{{< /note >}}

<!--
## The Ingress Resource

A minimal Ingress resource example:
-->
## Ingress 資源  {#the-ingress-resource}

一個最小的 Ingress 資源示例：


{{< codenew file="service/networking/minimal-ingress.yaml" >}}

<!-- 
An Ingress needs `apiVersion`, `kind`, `metadata` and `spec` fields.
The name of an Ingress object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
For general information about working with config files, see [deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/), [configuring containers](/docs/tasks/configure-pod-container/configure-pod-configmap/), [managing resources](/docs/concepts/cluster-administration/manage-deployment/).
 Ingress frequently uses annotations to configure some options depending on the Ingress controller, an example of which
 is the [rewrite-target annotation](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md).
Different [Ingress controllers](/docs/concepts/services-networking/ingress-controllers) support different annotations. Review the documentation for
 your choice of Ingress controller to learn which annotations are supported.
-->
Ingress 需要指定 `apiVersion`、`kind`、 `metadata`和 `spec` 欄位。
Ingress 物件的命名必須是合法的 [DNS 子域名名稱](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
關於如何使用配置檔案，請參見[部署應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)、
[配置容器](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)、
[管理資源](/zh-cn/docs/concepts/cluster-administration/manage-deployment/)。
Ingress 經常使用註解（annotations）來配置一些選項，具體取決於 Ingress
控制器，例如[重寫目標註解](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md)。
不同的 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)支援不同的註解。
檢視你所選的 Ingress 控制器的文件，以瞭解其支援哪些註解。

<!-- 
The Ingress [spec](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
has all the information needed to configure a load balancer or proxy server. Most importantly, it
contains a list of rules matched against all incoming requests. Ingress resource only supports rules
for directing HTTP(S) traffic.
-->
Ingress [規約](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
提供了配置負載均衡器或者代理伺服器所需的所有資訊。
最重要的是，其中包含與所有傳入請求匹配的規則列表。
Ingress 資源僅支援用於轉發 HTTP(S) 流量的規則。

<!--
If the `ingressClassName` is omitted, a [default Ingress class](#default-ingress-class)
should be defined.

There are some ingress controllers, that work without the definition of a
default `IngressClass`. For example, the Ingress-NGINX controller can be
configured with a [flag](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class`. It is [recommended](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)  though, to specify the
default `IngressClass` as shown [below](#default-ingress-class).
-->
如果 `ingressClassName` 被省略，那麼你應該定義一個[預設 Ingress 類](#default-ingress-class)。

有一些 Ingress 控制器不需要定義預設的 `IngressClass`。比如：Ingress-NGINX
控制器可以透過[引數](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class` 來配置。
不過仍然[推薦](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)
按[下文](#default-ingress-class)所示來設定預設的 `IngressClass`。

<!-- 
### Ingress rules

Each HTTP rule contains the following information:
-->
### Ingress 規則  {#ingress-rules}

每個 HTTP 規則都包含以下資訊：

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
* 可選的 `host`。在此示例中，未指定 `host`，因此該規則適用於透過指定 IP 地址的所有入站 HTTP 通訊。
  如果提供了 `host`（例如 foo.bar.com），則 `rules` 適用於該 `host`。
* 路徑列表 paths（例如，`/testpath`）,每個路徑都有一個由 `serviceName` 和 `servicePort` 定義的關聯後端。
  在負載均衡器將流量定向到引用的服務之前，主機和路徑都必須匹配傳入請求的內容。
* `backend`（後端）是 [Service 文件](/zh-cn/docs/concepts/services-networking/service/)中所述的服務和埠名稱的組合。
  與規則的 `host` 和 `path` 匹配的對 Ingress 的 HTTP（和 HTTPS ）請求將傳送到列出的 `backend`。

<!-- 
A `defaultBackend` is often configured in an Ingress controller to service any requests that do not
match a path in the spec. 
-->
通常在 Ingress 控制器中會配置 `defaultBackend`（預設後端），以服務於無法與規約中 `path` 匹配的所有請求。

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
### 預設後端  {#default-backend}

沒有設定規則的 Ingress 將所有流量傳送到同一個預設後端，而
`.spec.defaultBackend` 則是在這種情況下處理請求的那個預設後端。
`defaultBackend` 通常是
[Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)的配置選項，而非在
Ingress 資源中指定。
如果未設定任何的 `.spec.rules`，那麼必須指定 `.spec.defaultBackend`。
如果未設定 `defaultBackend`，那麼如何處理所有與規則不匹配的流量將交由
Ingress 控制器決定（請參考你的 Ingress 控制器的文件以瞭解它是如何處理那些流量的）。

如果沒有 `hosts` 或 `paths` 與 Ingress 物件中的 HTTP 請求匹配，則流量將被路由到預設後端。

<!--
### Resource backends {#resource-backend}

A `Resource` backend is an ObjectRef to another Kubernetes resource within the
same namespace as the Ingress object. A `Resource` is a mutually exclusive
setting with Service, and will fail validation if both are specified. A common
usage for a `Resource` backend is to ingress data to an object storage backend
with static assets.
-->
### 資源後端  {#resource-backend}

`Resource` 後端是一個引用，指向同一名稱空間中的另一個 Kubernetes 資源，將其作為 Ingress 物件。
`Resource` 後端與 Service 後端是互斥的，在二者均被設定時會無法透過合法性檢查。
`Resource` 後端的一種常見用法是將所有入站資料導向帶有靜態資產的物件儲存後端。

{{< codenew file="service/networking/ingress-resource-backend.yaml" >}}

<!--
After creating the Ingress above, you can view it with the following command:
-->
建立瞭如上的 Ingress 之後，你可以使用下面的命令檢視它：

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
### 路徑型別  {#path-types}

Ingress 中的每個路徑都需要有對應的路徑型別（Path Type）。未明確設定 `pathType`
的路徑無法透過合法性檢查。當前支援的路徑型別有三種：

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
* `ImplementationSpecific`：對於這種路徑型別，匹配方法取決於 IngressClass。
  具體實現可以將其作為單獨的 `pathType` 處理或者與 `Prefix` 或 `Exact` 型別作相同處理。

* `Exact`：精確匹配 URL 路徑，且區分大小寫。

* `Prefix`：基於以 `/` 分隔的 URL 路徑字首匹配。匹配區分大小寫，並且對路徑中的元素逐個完成。
  路徑元素指的是由 `/` 分隔符分隔的路徑中的標籤列表。
  如果每個 _p_ 都是請求路徑 _p_ 的元素字首，則請求與路徑 _p_ 匹配。

  {{< note >}}
  如果路徑的最後一個元素是請求路徑中最後一個元素的子字串，則不會匹配
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

| 型別   | 路徑                            | 請求路徑        | 匹配與否？               |
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
| Prefix | `/aaa/bbb`                      | `/aaa/bbbxyz`   | 否，字串字首不匹配     |
| Prefix | `/`, `/aaa`                     | `/aaa/ccc`      | 是，匹配 `/aaa` 字首     |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/aaa/bbb`      | 是，匹配 `/aaa/bbb` 字首 |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/ccc`          | 是，匹配 `/` 字首        |
| Prefix | `/aaa`                          | `/ccc`          | 否，使用預設後端         |
| 混合   | `/foo` (Prefix), `/foo` (Exact) | `/foo`          | 是，優選 Exact 型別      |

<!-- 
#### Multiple Matches

In some cases, multiple paths within an Ingress will match a request. In those
cases precedence will be given first to the longest matching path. If two paths
are still equally matched, precedence will be given to paths with an exact path
type over prefix path type.
 -->
#### 多重匹配  {#multiple-matches}

在某些情況下，Ingress 中的多條路徑會匹配同一個請求。
這種情況下最長的匹配路徑優先。
如果仍然有兩條同等的匹配路徑，則精確路徑型別優先於字首路徑型別。

<!--
## Hostname wildcards

Hosts can be precise matches (for example “`foo.bar.com`”) or a wildcard (for
example “`*.foo.com`”). Precise matches require that the HTTP `host` header
matches the `host` field. Wildcard matches require the HTTP `host` header is
equal to the suffix of the wildcard rule.
-->
## 主機名萬用字元   {#hostname-wildcards}

主機名可以是精確匹配（例如“`foo.bar.com`”）或者使用萬用字元來匹配
（例如“`*.foo.com`”）。
精確匹配要求 HTTP `host` 頭部欄位與 `host` 欄位值完全匹配。
萬用字元匹配則要求 HTTP `host` 頭部欄位與萬用字元規則中的字尾部分相同。

<!--
| Host         | Host header        | Match?                                              |
| ------------ |--------------------| ----------------------------------------------------|
| `*.foo.com`  | `bar.foo.com`      | Matches based on shared suffix                      |
| `*.foo.com`  | `baz.bar.foo.com`  | No match, wildcard only covers a single DNS label   |
| `*.foo.com`  | `foo.com`          | No match, wildcard only covers a single DNS label   |
-->
| 主機         | host 頭部          | 匹配與否？                          |
| ------------ |--------------------| ------------------------------------|
| `*.foo.com`  | `bar.foo.com`      | 基於相同的字尾匹配                  |
| `*.foo.com`  | `baz.bar.foo.com`  | 不匹配，萬用字元僅覆蓋了一個 DNS 標籤 |
| `*.foo.com`  | `foo.com`          | 不匹配，萬用字元僅覆蓋了一個 DNS 標籤 |

{{< codenew file="service/networking/ingress-wildcard-host.yaml" >}}

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

{{< codenew file="service/networking/external-lb.yaml" >}}

<!-- 
The `.spec.parameters` field of an IngressClass lets you reference another
resource that provides configuration related to that IngressClass.

The specific type of parameters to use depends on the ingress controller
that you specify in the `.spec.controller` field of the IngressClass.
 -->
IngressClass 中的 `.spec.parameters` 欄位可用於引用其他資源以提供額外的相關配置。

引數（`parameters`）的具體型別取決於你在 `.spec.controller` 欄位中指定的 Ingress 控制器。

<!--
### IngressClass scope

Depending on your ingress controller, you may be able to use parameters
that you set cluster-wide, or just for one namespace.
-->
### IngressClass 的作用域

取決於你的 Ingress 控制器，你可能可以使用叢集範圍設定的引數或某個名字空間範圍的引數。

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="叢集作用域" %}}
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
IngressClass 的引數預設是叢集範圍的。

如果你設定了 `.spec.parameters` 欄位且未設定 `.spec.parameters.scope`
欄位，或是將 `.spec.parameters.scope` 欄位設為了 `Cluster`，那麼該
IngressClass 所指代的即是一個叢集作用域的資源。
引數的 `kind`（和 `apiGroup` 一起）指向一個叢集作用域的
API（可能是一個定製資源（Custom Resource）），而它的
`name` 則為此 API 確定了一個具體的叢集作用域的資源。

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
    # 此 IngressClass 的配置定義在一個名為 “external-config-1” 的
    # ClusterIngressParameter（API 組為 k8s.example.net）資源中。
    # 這項定義告訴 Kubernetes 去尋找一個叢集作用域的引數資源。
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```
{{% /tab %}}
{{% tab name="名稱空間作用域" %}}
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
如果你設定了 `.spec.parameters` 欄位且將 `.spec.parameters.scope`
欄位設為了 `Namespace`，那麼該 IngressClass 將會引用一個名稱空間作用域的資源。
`.spec.parameters.namespace` 必須和此資源所處的名稱空間相同。

引數的 `kind`（和 `apiGroup`
一起）指向一個名稱空間作用域的 API（例如：ConfigMap），而它的
`name` 則確定了一個位於你指定的名稱空間中的具體的資源。

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
名稱空間作用域的引數幫助叢集操作者將控制細分到用於工作負載的各種配置中（比如：負載均衡設定、API
閘道器定義）。如果你使用叢集作用域的引數，那麼你必須從以下兩項中選擇一項執行：

- 每次修改配置，叢集操作團隊需要批准其他團隊的修改。
- 叢集操作團隊定義具體的准入控制，比如 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)
  角色與角色繫結，以使得應用程式團隊可以修改叢集作用域的配置引數資源。

<!--
The IngressClass API itself is always cluster-scoped.

Here is an example of an IngressClass that refers to parameters that are
namespaced:
-->
IngressClass API 本身是叢集作用域的。

這裡是一個引用名稱空間作用域的配置引數的 IngressClass 的示例：
```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # 此 IngressClass 的配置定義在一個名為 “external-config” 的
    # IngressParameter（API 組為 k8s.example.com）資源中，
    # 該資源位於 “external-configuration” 名稱空間中。
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{< /tabs >}}

<!-- 
### Deprecated Annotation

Before the IngressClass resource and `ingressClassName` field were added in
Kubernetes 1.18, Ingress classes were specified with a
`kubernetes.io/ingress.class` annotation on the Ingress. This annotation was
never formally defined, but was widely supported by Ingress controllers.
-->
### 廢棄的註解  {#deprecated-annotation}

在 Kubernetes 1.18 版本引入 IngressClass 資源和 `ingressClassName` 欄位之前，Ingress
類是透過 Ingress 中的一個 `kubernetes.io/ingress.class` 註解來指定的。
這個註解從未被正式定義過，但是得到了 Ingress 控制器的廣泛支援。

<!-- 
The newer `ingressClassName` field on Ingresses is a replacement for that
annotation, but is not a direct equivalent. While the annotation was generally
used to reference the name of the Ingress controller that should implement the
Ingress, the field is a reference to an IngressClass resource that contains
additional Ingress configuration, including the name of the Ingress controller.
-->
Ingress 中新的 `ingressClassName` 欄位是該註解的替代品，但並非完全等價。
該註解通常用於引用實現該 Ingress 的控制器的名稱，而這個新的欄位則是對一個包含額外
Ingress 配置的 IngressClass 資源的引用，包括 Ingress 控制器的名稱。

<!-- 
### Default IngressClass {#default-ingress-class}

You can mark a particular IngressClass as default for your cluster. Setting the
`ingressclass.kubernetes.io/is-default-class` annotation to `true` on an
IngressClass resource will ensure that new Ingresses without an
`ingressClassName` field specified will be assigned this default IngressClass.
-->
### 預設 Ingress 類  {#default-ingress-class}

你可以將一個特定的 IngressClass 標記為叢集預設 Ingress 類。
將一個 IngressClass 資源的 `ingressclass.kubernetes.io/is-default-class` 註解設定為
`true` 將確保新的未指定 `ingressClassName` 欄位的 Ingress 能夠分配為這個預設的
IngressClass.

<!-- 
If you have more than one IngressClass marked as the default for your cluster,
the admission controller prevents creating new Ingress objects that don't have
an `ingressClassName` specified. You can resolve this by ensuring that at most 1
IngressClasess are marked as default in your cluster.
 -->
{{< caution >}}
如果叢集中有多個 IngressClass 被標記為預設，准入控制器將阻止建立新的未指定
`ingressClassName` 的 Ingress 物件。
解決這個問題只需確保叢集中最多隻能有一個 IngressClass 被標記為預設。
{{< /caution >}}

<!--
There are some ingress controllers, that work without the definition of a
default `IngressClass`. For example, the Ingress-NGINX controller can be
configured with a [flag](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class`. It is [recommended](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)  though, to specify the
default `IngressClass`:
-->
有一些 Ingress 控制器不需要定義預設的 `IngressClass`。比如：Ingress-NGINX
控制器可以透過[引數](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class` 來配置。
不過仍然[推薦](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)
設定預設的 `IngressClass`。

{{< codenew file="service/networking/default-ingressclass.yaml" >}}

<!--
## Types of Ingress

### Ingress backed by a single Service {#single-service-ingress}

There are existing Kubernetes concepts that allow you to expose a single Service
(see [alternatives](#alternatives)). You can also do this with an Ingress by specifying a
*default backend* with no rules.
-->
## Ingress 型別  {#types-of-ingress}

### 由單個 Service 來完成的 Ingress   {#single-service-ingress}

現有的 Kubernetes 概念允許你暴露單個 Service (參見[替代方案](#alternatives))。
你也可以透過指定無規則的 *預設後端* 來對 Ingress 進行此操作。

{{< codenew file="service/networking/test-ingress.yaml" >}}

<!-- 
If you create it using `kubectl apply -f` you should be able to view the state
of the Ingress you added:
-->
如果使用 `kubectl apply -f` 建立此 Ingress，則應該能夠檢視剛剛新增的 Ingress 的狀態：

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
其中 `203.0.113.123` 是由 Ingress 控制器分配以滿足該 Ingress 的 IP。

<!--
Ingress controllers and load balancers may take a minute or two to allocate an IP address.
Until that time, you often see the address listed as `<pending>`.
-->
{{< note >}}
入口控制器和負載平衡器可能需要一兩分鐘才能分配 IP 地址。
在此之前，你通常會看到地址欄位的值被設定為 `<pending>`。
{{< /note >}}

<!--
### Simple fanout

A fanout configuration routes traffic from a single IP address to more than one Service,
based on the HTTP URI being requested. An Ingress allows you to keep the number of load balancers
down to a minimum. For example, a setup like:
-->
### 簡單扇出  {#simple-fanout}

一個扇出（fanout）配置根據請求的 HTTP URI 將來自同一 IP 地址的流量路由到多個 Service。
Ingress 允許你將負載均衡器的數量降至最低。例如，這樣的設定：

{{< figure src="/zh-cn/docs/images/ingressFanOut.svg" alt="ingress-fanout-diagram" class="diagram-large" caption="圖. Ingress 扇出" link="https://mermaid.live/edit#pako:eNqNUslOwzAQ_RXLvYCUhMQpUFzUUzkgcUBwbHpw4klr4diR7bCo8O8k2FFbFomLPZq3jP00O1xpDpjijWHtFt09zAuFUCUFKHey8vf6NE7QrdoYsDZumGIb4Oi6NAskNeOoZJKpCgxK4oXwrFVgRyi7nCVXWZKRPMlysv5yD6Q4Xryf1Vq_WzDPooJs9egLNDbolKTpT03JzKgh3zWEztJZ0Niu9L-qZGcdmAMfj4cxvWmreba613z9C0B-AMQD-V_AdA-A4j5QZu0SatRKJhSqhZR0wjmPrDP6CeikrutQxy-Cuy2dtq9RpaU2dJKm6fzI5Glmg0VOLio4_5dLjx27hFSC015KJ2VZHtuQvY2fuHcaE43G0MaCREOow_FV5cMxHZ5-oPX75UM5avuXhXuOI9yAaZjg_aLuBl6B3RYaKDDtSw4166QrcKE-emrXcubghgunDaY1kxYizDqnH99UhakzHYykpWD9hjS--fEJoIELqQ" >}}


<!--
would require an Ingress such as:
-->
將需要一個如下所示的 Ingress：

{{< codenew file="service/networking/simple-fanout-example.yaml" >}}

<!--
When you create the Ingress with `kubectl apply -f`:
-->
當你使用 `kubectl apply -f` 建立 Ingress 時：

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
Ingress 控制器將提供實現特定的負載均衡器來滿足 Ingress，
只要 Service (`service1`，`service2`) 存在。
當它這樣做時，你會在 Address 欄位看到負載均衡器的地址。

<!--
Depending on the [Ingress controller](/docs/concepts/services-networking/ingress-controllers)
you are using, you may need to create a default-http-backend
[Service](/docs/concepts/services-networking/service/).
-->
{{< note >}}
取決於你所使用的 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)，
你可能需要建立預設 HTTP 後端[服務](/zh-cn/docs/concepts/services-networking/service/)。
{{< /note >}}

<!--
### Name based virtual hosting

Name-based virtual hosts support routing HTTP traffic to multiple host names at the same IP address.
-->
### 基於名稱的虛擬託管   {#name-based-virtual-hosting}

基於名稱的虛擬主機支援將針對多個主機名的 HTTP 流量路由到同一 IP 地址上。

{{< figure src="/zh-cn/docs/images/ingressNameBased.svg" alt="ingress-namebase-diagram" class="diagram-large" caption="圖. 基於名稱實現虛擬託管的 Ingress" link="https://mermaid.live/edit#pako:eNqNkl9PwyAUxb8KYS-atM1Kp05m9qSJJj4Y97jugcLtRqTQAPVPdN_dVlq3qUt8gZt7zvkBN7xjbgRgiteW1Rt0_zjLNUJcSdD-ZBn21WmcoDu9tuBcXDHN1iDQVWHnSBkmUMEU0xwsSuK5DK5l745QejFNLtMkJVmSZmT1Re9NcTz_uDXOU1QakxTMJtxUHw7ss-SQLhehQEODTsdH4l20Q-zFyc84-Y67pghv5apxHuweMuj9eS2_NiJdPhix-kMgvwQShOyYMNkJoEUYM3PuGkpUKyY1KqVSdCSEiJy35gnoqCzLvo5fpPAbOqlfI26UsXQ0Ho9nB5CnqesRGTnncPYvSqsdUvqp9KRdlI6KojjEkB0mnLgjDRONhqENBYm6oXbLV5V1y6S7-l42_LowlIN2uFm_twqOcAW2YlK0H_i9c-bYb6CCHNO2FFCyRvkc53rbWptaMA83QnpjMS2ZchBh1nizeNMcU28bGEzXkrV_pArN7Sc0rBTu" >}}

<!--
The following Ingress tells the backing load balancer to route requests based on
the [Host header](https://tools.ietf.org/html/rfc7230#section-5.4).
-->
以下 Ingress 讓後臺負載均衡器基於[host 頭部欄位](https://tools.ietf.org/html/rfc7230#section-5.4)
來路由請求。

{{< codenew file="service/networking/name-virtual-host-ingress.yaml" >}}

<!-- 
If you create an Ingress resource without any hosts defined in the rules, then any
web traffic to the IP address of your Ingress controller can be matched without a name based
virtual host being required.
-->
如果你建立的 Ingress 資源沒有在 `rules` 中定義的任何 `hosts`，則可以匹配指向
Ingress 控制器 IP 地址的任何網路流量，而無需基於名稱的虛擬主機。

<!-- 
For example, the following Ingress routes traffic
requested for `first.bar.com` to `service1`, `second.bar.com` to `service2`, and any traffic whose request host header doesn't match `first.bar.com` and `second.bar.com` to `service3`.
-->
例如，以下 Ingress 會將請求 `first.bar.com` 的流量路由到 `service1`，將請求
`second.bar.com` 的流量路由到 `service2`，而所有其他流量都會被路由到 `service3`。

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

你可以透過設定包含 TLS 私鑰和證書的{{< glossary_tooltip text="Secret" term_id="secret" >}}
來保護 Ingress。
Ingress 只支援單個 TLS 埠 443，並假定 TLS 連線終止於
Ingress 節點（與 Service 及其 Pod 之間的流量都以明文傳輸）。
如果 Ingress 中的 TLS 配置部分指定了不同的主機，那麼它們將根據透過
SNI TLS 擴充套件指定的主機名（如果 Ingress 控制器支援 SNI）在同一埠上進行復用。
TLS Secret 的資料中必須包含用於 TLS 的以鍵名 `tls.crt` 儲存的證書和以鍵名 `tls.key` 儲存的私鑰。
例如：

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
你需要確保建立的 TLS Secret 建立自包含 `https-example.foo.com` 的公用名稱（CN）的證書。
這裡的公共名稱也被稱為全限定域名（FQDN）。

{{< note >}}
<!--
Keep in mind that TLS will not work on the default rule because the
certificates would have to be issued for all the possible sub-domains. Therefore,
`hosts` in the `tls` section need to explicitly match the `host` in the `rules`
section.
-->
注意，預設規則上無法使用 TLS，因為需要為所有可能的子域名發放證書。
因此，`tls` 欄位中的 `hosts` 的取值需要與 `rules` 欄位中的 `host` 完全匹配。
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
各種 Ingress 控制器所支援的 TLS 功能之間存在差異。請參閱有關
[nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/)、
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https)
或者任何其他平臺特定的 Ingress 控制器的文件，以瞭解 TLS 如何在你的環境中工作。
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
### 負載均衡  {#load-balancing}

Ingress 控制器啟動引導時使用一些適用於所有 Ingress
的負載均衡策略設定，例如負載均衡演算法、後端權重方案等。
更高階的負載均衡概念（例如持久會話、動態權重）尚未透過 Ingress 公開。
你可以透過用於服務的負載均衡器來獲取這些功能。

<!--
It's also worth noting that even though health checks are not exposed directly
through the Ingress, there exist parallel concepts in Kubernetes such as
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
that allow you to achieve the same end result. Please review the controller
specific documentation to see how they handle health checks (
[nginx](https://git.k8s.io/ingress-nginx/README.md),
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).
-->
值得注意的是，儘管健康檢查不是透過 Ingress 直接暴露的，在 Kubernetes
中存在並行的概念，比如
[就緒檢查](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)，
允許你實現相同的目的。
請檢查特定控制器的說明文件（[nginx](https://git.k8s.io/ingress-nginx/README.md)、
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)）以瞭解它們是怎樣處理健康檢查的。

<!--
## Updating an Ingress

To update an existing Ingress to add a new Host, you can update it by editing the resource:
-->
## 更新 Ingress   {#updating-an-ingress}

要更新現有的 Ingress 以新增新的 Host，可以透過編輯資源來對其進行更新：

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
這一命令將開啟編輯器，允許你以 YAML 格式編輯現有配置。
修改它來增加新的主機：

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
儲存更改後，kubectl 將更新 API 伺服器中的資源，該資源將告訴 Ingress 控制器重新配置負載均衡器。

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
你也可以透過 `kubectl replace -f` 命令呼叫修改後的 Ingress yaml 檔案來獲得同樣的結果。

<!--
## Failing across availability zones

Techniques for spreading traffic across failure domains differs between cloud providers.
Please check the documentation of the relevant [Ingress controller](/docs/concepts/services-networking/ingress-controllers) for details.
-->
## 跨可用區失敗  {#failing-across-availability-zones}

不同的雲廠商使用不同的技術來實現跨故障域的流量分佈。詳情請查閱相關 Ingress 控制器的文件。
請檢視相關 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers)的文件以瞭解詳細資訊。

<!--
## Alternatives

You can expose a Service in multiple ways that don't directly involve the Ingress resource:
-->
## 替代方案    {#alternatives}

不直接使用 Ingress 資源，也有多種方法暴露 Service：

<!--
* Use [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* Use [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport)
-->
* 使用 [Service.Type=LoadBalancer](/zh-cn/docs/concepts/services-networking/service/#loadbalancer)
* 使用 [Service.Type=NodePort](/zh-cn/docs/concepts/services-networking/service/#nodeport)

## {{% heading "whatsnext" %}}

<!--
* Learn about the [Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/) API
* Learn about [Ingress Controllers](/docs/concepts/services-networking/ingress-controllers/)
* [Set up Ingress on Minikube with the NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube/)
-->
* 進一步瞭解 [Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/) API
* 進一步瞭解 [Ingress 控制器](/zh-cn/docs/concepts/services-networking/ingress-controllers/)
* [使用 NGINX 控制器在 Minikube 上安裝 Ingress](/zh-cn/docs/tasks/access-application-cluster/ingress-minikube/)

