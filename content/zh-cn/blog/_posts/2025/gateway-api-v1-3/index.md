---
layout: blog
title: "Gateway API v1.3.0：流量复制、CORS、Gateway 合并和重试预算的改进"
date: 2025-06-02T09:00:00-08:00
draft: false
slug: gateway-api-v1-3
author: >
  [Candace Holman](https://github.com/candita) (Red Hat)
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
layout: blog
title: "Gateway API v1.3.0: Advancements in Request Mirroring, CORS, Gateway Merging, and Retry Budgets"
date: 2025-06-02T09:00:00-08:00
draft: false
slug: gateway-api-v1-3
author: >
  [Candace Holman](https://github.com/candita) (Red Hat)
-->

![Gateway API logo](gateway-api-logo.svg)

<!--
Join us in the Kubernetes SIG Network community in celebrating the general
availability of [Gateway API](https://gateway-api.sigs.k8s.io/) v1.3.0! We are
also pleased to announce that there are already a number of conformant
implementations to try, made possible by postponing this blog
announcement. Version 1.3.0 of the API was released about a month ago on
April 24, 2025.
-->
加入 Kubernetes SIG Network 社区，共同庆祝 [Gateway API](https://gateway-api.sigs.k8s.io/) v1.3.0 正式发布！
我们很高兴地宣布，通过推迟这篇博客的发布，现在已经有了多个符合规范的实现可供试用。
API 1.3.0 版本已于 2025 年 4 月 24 日发布。

<!--
Gateway API v1.3.0 brings a new feature to the _Standard_ channel
(Gateway API's GA release channel): _percentage-based request mirroring_, and
introduces three new experimental features: cross-origin resource sharing (CORS)
filters, a standardized mechanism for listener and gateway merging, and retry
budgets.
-->
Gateway API v1.3.0 为 **Standard** 渠道（Gateway API 的正式发布渠道）带来了一个新功能：**基于百分比的流量复制**，
并引入了三个新的实验性功能：

- 跨源资源共享（CORS）过滤器
- Listener 和 Gateway 合并的标准化机制
- 重试预算（Retry Budgets）

<!--
Also see the full
[release notes](https://github.com/kubernetes-sigs/gateway-api/blob/54df0a899c1c5c845dd3a80f05dcfdf65576f03c/CHANGELOG/1.3-CHANGELOG.md)
and applaud the
[v1.3.0 release team](https://github.com/kubernetes-sigs/gateway-api/blob/54df0a899c1c5c845dd3a80f05dcfdf65576f03c/CHANGELOG/1.3-TEAM.md)
next time you see them.
-->
另请查看完整的[发布说明](https://github.com/kubernetes-sigs/gateway-api/blob/54df0a899c1c5c845dd3a80f05dcfdf65576f03c/CHANGELOG/1.3-CHANGELOG.md)，
下次见到 [v1.3.0 发布团队](https://github.com/kubernetes-sigs/gateway-api/blob/54df0a899c1c5c845dd3a80f05dcfdf65576f03c/CHANGELOG/1.3-TEAM.md) 时请为他们鼓掌。

<!--
## Graduation to Standard channel
-->
## 升级至 Standard 渠道 {#graduation-to-standard-channel}

<!--
Graduation to the Standard channel is a notable achievement for Gateway API
features, as inclusion in the Standard release channel denotes a high level of
confidence in the API surface and provides guarantees of backward compatibility.
Of course, as with any other Kubernetes API, Standard channel features can continue
to evolve with backward-compatible additions over time, and we (SIG Network)
certainly expect
further refinements and improvements in the future. For more information on how
all of this works, refer to the [Gateway API Versioning Policy](https://gateway-api.sigs.k8s.io/concepts/versioning/).
-->
对于 Gateway API 的功能来说，升级到 Standard 渠道是一个重要的里程碑。
被纳入 Standard 发布渠道表明我们对该 API 接口的稳定性具有高度信心，并且承诺向后兼容。
当然，与任何其他 Kubernetes API 一样， Standard 渠道中的功能仍可通过向后兼容的方式不断演进。
我们（SIG Network）也确实预计未来会有进一步的优化和改进。
有关这一切如何运作的更多信息，请参阅 [Gateway API 版本控制策略](https://gateway-api.sigs.k8s.io/concepts/versioning/)。

<!--
### Percentage-based request mirroring

Leads: [Lior Lieberman](https://github.com/LiorLieberman),[Jake Bennert](https://github.com/jakebennert)
GEP-3171: [Percentage-Based Request Mirroring](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-3171/index.md)
-->
### 基于百分比的流量复制 {#percentage-based-request-mirroring}

负责人：[Lior Lieberman](https://github.com/LiorLieberman)、[Jake Bennert](https://github.com/jakebennert)
GEP-3171：[基于百分比的流量复制](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-3171/index.md)

<!--
_Percentage-based request mirroring_ is an enhancement to the
existing support for [HTTP request mirroring](https://gateway-api.sigs.k8s.io/guides/http-request-mirroring/), which allows HTTP requests to be duplicated to another backend using the
RequestMirror filter type.  Request mirroring is particularly useful in
blue-green deployment. It can be used to assess the impact of request scaling on
application performance without impacting responses to clients.
-->
**基于百分比的流量复制**是对现有 [HTTP 流量复制](https://gateway-api.sigs.k8s.io/guides/http-request-mirroring/) 支持的增强，
它允许使用 RequestMirror 过滤器类型将 HTTP 请求复制到另一个后端。流量复制在蓝绿部署中特别有用。
它可用于评估流量波动对应用程序性能的影响，而不会影响对客户端的响应。

<!--
The previous mirroring capability worked on all the requests to a `backendRef`.
Percentage-based request mirroring allows users to specify a subset of requests
they want to be mirrored, either by percentage or fraction. This can be
particularly useful when services are receiving a large volume of requests.
Instead of mirroring all of those requests, this new feature can be used to
mirror a smaller subset of them.
-->
之前的流量复制功能适用于对 `backendRef` 的所有请求。基于百分比的流量复制允许用户指定他们想要复制的请求子集，
可以通过百分比或分数来指定。当服务接收大量请求时，这特别有用。这个新功能可以用来复制这些请求中的一小部分，
而不是复制所有请求。

<!--
Here's an example with 42% of the requests to "foo-v1" being mirrored to "foo-v2":
-->
以下是一个示例，将发送到 "foo-v1" 的流量的  42% 复制到 "foo-v2"：

<!--
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: http-filter-mirror
  labels:
    gateway: mirror-gateway
spec:
  parentRefs:
  - name: mirror-gateway
  hostnames:
  - mirror.example
  rules:
  - backendRefs:
    - name: foo-v1
      port: 8080
    filters:
    - type: RequestMirror
      requestMirror:
        backendRef:
          name: foo-v2
          port: 8080
        percent: 42 # This value must be an integer.
```
-->
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: http-filter-mirror
  labels:
    gateway: mirror-gateway
spec:
  parentRefs:
  - name: mirror-gateway
  hostnames:
  - mirror.example
  rules:
  - backendRefs:
    - name: foo-v1
      port: 8080
    filters:
    - type: RequestMirror
      requestMirror:
        backendRef:
          name: foo-v2
          port: 8080
        percent: 42 # 此值必须为整数。
```

<!--
You can also configure the partial mirroring using a fraction. Here is an example
with 5 out of every 1000 requests to "foo-v1" being mirrored to "foo-v2".
-->
你也可以通过调整分数来实现部分流量复制。
以下是一个示例，在发送到 "foo-v1" 的请求中，将每 1000 个中的 5 个复制到 "foo-v2"。

```yaml
  rules:
  - backendRefs:
    - name: foo-v1
      port: 8080
    filters:
    - type: RequestMirror
      requestMirror:
        backendRef:
          name: foo-v2
          port: 8080
        fraction:
          numerator: 5
          denominator: 1000
```

<!--
## Additions to Experimental channel
-->
## 实验渠道的新特性 {#additions-to-Experimental-channel}

<!--
The Experimental channel is Gateway API's channel for experimenting with new
features and gaining confidence with them before allowing them to graduate to
standard.  Please note: the experimental channel may include features that are
changed or removed later.
-->
实验渠道（Experimental channel）是 Gateway API 用于试验新功能的渠道，以便在功能成熟之前积累足够信心，
再将其升级为 Standard 渠道功能。
请注意：实验渠道可能包含后续会被更改或移除的功能。

<!--
Starting in release v1.3.0, in an effort to distinguish Experimental channel
resources from Standard channel resources, any new experimental API kinds have the
prefix "**X**".  For the same reason, experimental resources are now added to the
API group `gateway.networking.x-k8s.io` instead of `gateway.networking.k8s.io`.
Bear in mind that using new experimental channel resources means they can coexist
with standard channel resources, but migrating these resources to the standard
channel will require recreating them with the standard channel names and API
group (both of which lack the "x-k8s" designator or "X" prefix).
-->
从 v1.3.0 版本开始，为了区分实验渠道资源和 Standard 渠道资源，
所有新的实验性 API 类型都带有 "**X**" 前缀。
出于同样的原因，实验性资源现在被添加到 API 组 `gateway.networking.x-k8s.io`，
而不是 `gateway.networking.k8s.io`。
请注意，使用新的实验渠道资源意味着它们可以与 Standard 渠道资源共存，
若要将这些资源迁移到 Standard 渠道，则需要使用 Standard 渠道的名称和 API 组
（两者都不包含 "x-k8s" 标识或 "X" 前缀）来重新创建它们。

<!--
The v1.3 release introduces two new experimental API kinds: XBackendTrafficPolicy
and XListenerSet.  To be able to use experimental API kinds, you need to install
the Experimental channel Gateway API YAMLs from the locations listed below.
-->
v1.3 版本引入了两个新的实验性 API 类型：XBackendTrafficPolicy 和 XListenerSet。
要使用实验性 API 类型，你需要从下面列出的位置安装实验渠道 Gateway API YAML 文件。

<!--
### CORS filtering
-->
### CORS 过滤 {#cors-filtering}

<!--
Leads: [Liang Li](https://github.com/liangli), [Eyal Pazz](https://github.com/EyalPazz), [Rob Scott](https://github.com/robscott)

GEP-1767: [CORS Filter](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-1767/index.md)
-->
负责人：[Liang Li](https://github.com/liangli)、[Eyal Pazz](https://github.com/EyalPazz)、[Rob Scott](https://github.com/robscott)

GEP-1767：[CORS 过滤器](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-1767/index.md)

<!--
Cross-origin resource sharing (CORS) is an HTTP-header based mechanism that allows
a web page to access restricted resources from a server on an origin (domain,
scheme, or port) different from the domain that served the web page. This feature
adds a new HTTPRoute `filter` type, called "CORS", to configure the handling of
cross-origin requests before the response is sent back to the client.
-->
跨源资源共享（CORS）是一种基于 HTTP Header 的机制，
允许网页从与提供网页的域不同的源（域名、协议或端口）访问受限资源。
此功能添加了一个新的 HTTPRoute `filter` 类型，
称为 "CORS"，用于在响应发送回客户端之前配置跨源请求的处理。

<!--
To be able to use experimental CORS filtering, you need to install the
[Experimental channel Gateway API HTTPRoute yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.k8s.io_httproutes.yaml).
-->
要使用实验性 CORS 过滤，你需要安装[实验渠道 Gateway API HTTPRoute yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.k8s.io_httproutes.yaml)。

<!--
Here's an example of a simple cross-origin configuration:
-->
以下是一个简单的跨源配置示例：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: http-route-cors
spec:
  parentRefs:
  - name: http-gateway
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /resource/foo
    filters:
    - cors:
      - type: CORS
        allowOrigins:
        - *
        allowMethods:
        - GET
        - HEAD
        - POST
        allowHeaders:
        - Accept
        - Accept-Language
        - Content-Language
        - Content-Type
        - Range
    backendRefs:
    - kind: Service
      name: http-route-cors
      port: 80
```

<!--
In this case, the Gateway returns an _origin header_ of "*", which means that the
requested resource can be referenced from any origin, a _methods header_
(`Access-Control-Allow-Methods`) that permits the `GET`, `HEAD`, and `POST`
verbs, and a _headers header_ allowing `Accept`, `Accept-Language`,
`Content-Language`, `Content-Type`, and `Range`.
-->
在这种情况下，Gateway 返回一个 **origin header** 为 "*"，这意味着请求的资源可以从任何源引用；
一个 **methods header** （`Access-Control-Allow-Methods`）允许 `GET`、`HEAD` 和 `POST` 方法；
此外，还会返回一个 **headers header** ，允许的字段包括 `Accept`、`Accept-Language`、
`Content-Language`、`Content-Type` 和 `Range`。

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, POST
Access-Control-Allow-Headers: Accept,Accept-Language,Content-Language,Content-Type,Range
```

<!--
The complete list of fields in the new CORS filter:
* `allowOrigins`
* `allowMethods`
* `allowHeaders`
* `allowCredentials`
* `exposeHeaders`
* `maxAge`

See [CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol) for details.
-->
新的 CORS 过滤器中的完整字段列表如下：

* `allowOrigins`：允许的请求来源列表。
* `allowMethods`：允许的 HTTP 方法（如 `GET`、`POST` 等）。
* `allowHeaders`：允许携带的请求头字段。
* `allowCredentials`：是否允许携带凭据（如 Cookie、Authorization 头等）。
* `exposeHeaders`：允许客户端访问的响应头字段。
* `maxAge`：预检请求的缓存持续时间（单位：秒）。

有关详细信息，请参阅 [CORS 协议](https://fetch.spec.whatwg.org/#http-cors-protocol)。

<!--
### XListenerSets (standardized mechanism for Listener and Gateway merging){#XListenerSet}
-->
### XListenerSets（Listener 和 Gateway 合并的标准化机制）{#XListenerSet}

<!--
Lead: [Dave Protasowski](https://github.com/dprotaso)
-->
负责人：[Dave Protasowski](https://github.com/dprotaso)

<!--
GEP-1713: [ListenerSets - Standard Mechanism to Merge Multiple Gateways](https://github.com/kubernetes-sigs/gateway-api/pull/3213)
-->
GEP-1713：[ListenerSets - 合并多个 Gateway 的标准机制](https://github.com/kubernetes-sigs/gateway-api/pull/3213)

<!--
This release adds a new experimental API kind, XListenerSet, that allows a
shared list of _listeners_ to be attached to one or more parent Gateway(s).  In
addition, it expands upon the existing suggestion that Gateway API implementations
may merge configuration from multiple Gateway objects.  It also:
-->
此版本添加了一个新的实验性 API 类型 XListenerSet，它允许将 **listeners** 的共享列表附加到一个或多个父 Gateway。
此外，它还扩展了现有的建议，即 Gateway API 实现可以合并来自多个 Gateway 对象的配置。它还包括：

<!--
- adds a new field `allowedListeners` to the `.spec` of a Gateway. The
`allowedListeners` field defines from which Namespaces to select XListenerSets
that are allowed to attach to that Gateway: Same, All, None, or Selector based.
-->
- 向 Gateway 的 `.spec` 添加了一个新字段 `allowedListeners`。
  `allowedListeners` 字段定义了从哪些命名空间选择允许附加到该 Gateway 的 XListenerSets：
  Same（同一命名空间）、All（所有命名空间）、None（不允许）、或基于选择器（Selector）的方式。

<!--
- increases the previous maximum number (64) of listeners with the addition of
XListenerSets.
-->
- 通过添加 XListenerSets 增加了之前的监听器最大数量（64）。

<!--
- allows the delegation of listener configuration, such as TLS, to applications in
other namespaces.
-->
- 允许将监听器配置（如 TLS）委托给其他命名空间中的应用程序。

<!--
To be able to use experimental XListenerSet, you need to install the
[Experimental channel Gateway API XListenerSet yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.x-k8s.io_xlistenersets.yaml).
-->
要使用实验性 XListenerSet，你需要安装[实验渠道 Gateway API XListenerSet yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.x-k8s.io_xlistenersets.yaml)。

<!--
The following example shows a Gateway with an HTTP listener and two child HTTPS
XListenerSets with unique hostnames and certificates.  The combined set of listeners
attached to the Gateway includes the two additional HTTPS listeners in the
XListenerSets that attach to the Gateway.  This example illustrates the
delegation of listener TLS config to application owners in different namespaces
("store" and "app").  The HTTPRoute has both the Gateway listener named "foo" and
one XListenerSet listener named "second" as `parentRefs`.
-->
以下示例展示了一个带有 HTTP 监听器和两个子 HTTPS XListenerSets 的 Gateway，
每个 XListenerSet 都有唯一的主机名和证书。
最终附加到该 Gateway 的监听器集合包含这两个附加的 HTTPS `XListenerSet` 监听器。
此示例说明了将监听器 TLS 配置委托给不同命名空间（"store" 和 "app"）中的应用程序所有者。
HTTPRoute 同时将名为 `"foo"` 的 Gateway 监听器和一个名为 `"second"` 的 `XListenerSet`
监听器设置为其 `parentRefs`。

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: prod-external
  namespace: infra
spec:
  gatewayClassName: example
  allowedListeners:
  - from: All
  listeners:
  - name: foo
    hostname: foo.com
    protocol: HTTP
    port: 80
---
apiVersion: gateway.networking.x-k8s.io/v1alpha1
kind: XListenerSet
metadata:
  name: store
  namespace: store
spec:
  parentRef:
    name: prod-external
  listeners:
  - name: first
    hostname: first.foo.com
    protocol: HTTPS
    port: 443
    tls:
      mode: Terminate
      certificateRefs:
      - kind: Secret
        group: ""
        name: first-workload-cert
---
apiVersion: gateway.networking.x-k8s.io/v1alpha1
kind: XListenerSet
metadata:
  name: app
  namespace: app
spec:
  parentRef:
    name: prod-external
  listeners:
  - name: second
    hostname: second.foo.com
    protocol: HTTPS
    port: 443
    tls:
      mode: Terminate
      certificateRefs:
      - kind: Secret
        group: ""
        name: second-workload-cert
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: httproute-example
spec:
  parentRefs:
  - name: app
    kind: XListenerSet
    sectionName: second
  - name: parent-gateway
    kind: Gateway
    sectionName: foo
    ...
```

<!--
Each listener in a Gateway must have a unique combination of `port`, `protocol`,
(and `hostname` if supported by the protocol) in order for all listeners to be
**compatible** and not conflicted over which traffic they should receive.
-->
Gateway 中的每个监听器必须具有唯一的 `port`、`protocol` 组合
（如果协议支持，还包括 `hostname`），
以便所有监听器都**兼容**，并且不会在它们应该接收的流量上发生冲突。

<!--
Furthermore, implementations can _merge_ separate Gateways into a single set of
listener addresses if all listeners across those Gateways are compatible.  The
management of merged listeners was under-specified in releases prior to v1.3.0.
-->
此外，如果这些 Gateway 上的所有监听器都兼容，实现可以将单独的 Gateway **合并**为单个监听器地址集。
在 v1.3.0 之前的版本中，合并监听器的管理规范不足。

<!--
With the new feature, the specification on merging is expanded.  Implementations
must treat the parent Gateways as having the merged list of all listeners from
itself and from attached XListenerSets, and validation of this list of listeners
must behave the same as if the list were part of a single Gateway. Within a single
Gateway, listeners are ordered using the following precedence:
-->
通过新功能，合并规范得到了扩展。实现必须将父 Gateway 视为具有来自自身和附加的 XListenerSets
的所有监听器的合并列表，
并且对该监听器列表的验证行为应与其作为单个 Gateway 的一部分。
在单个 Gateway 内，监听器使用以下优先级排序：

<!--
1. Single Listeners (not a part of an XListenerSet) first,
-->
1. 首先是单个监听器（而不是 XListenerSet 的一部分），

<!--
2. Remaining listeners ordered by:
   - object creation time (oldest first), and if two listeners are defined in
   objects that have the same timestamp, then
   - alphabetically based on "{namespace}/{name of listener}"
-->
2. 其余监听器按以下顺序排序：

   - 按对象创建时间排序（最早创建的优先）；
   - 如果两个监听器所在的对象具有相同的时间戳，
     则按照 `{namespace}/{监听器名称}` 的字母顺序排序

<!--
### Retry budgets (XBackendTrafficPolicy) {#XBackendTrafficPolicy}
-->
### 重试预算（Retry budgets）（XBackendTrafficPolicy）{#XBackendTrafficPolicy}

<!--
Leads: [Eric Bishop](https://github.com/ericdbishop), [Mike Morris](https://github.com/mikemorris)
-->
负责人：[Eric Bishop](https://github.com/ericdbishop)、[Mike Morris](https://github.com/mikemorris)

<!--
GEP-3388: [Retry Budgets](https://gateway-api.sigs.k8s.io/geps/gep-3388)
-->
GEP-3388：[重试预算（Retry budgets）](https://gateway-api.sigs.k8s.io/geps/gep-3388)

<!--
This feature allows you to configure a _retry budget_ across all endpoints
of a destination Service.  This is used to limit additional client-side retries
after reaching a configured threshold. When configuring the budget, the maximum
percentage of active requests that may consist of retries may be specified, as well as
the interval over which requests will be considered when calculating the threshold
for retries. The development of this specification changed the existing
experimental API kind BackendLBPolicy into a new experimental API kind,
XBackendTrafficPolicy, in the interest of reducing the proliferation of policy
resources that had commonalities.
-->
此功能允许你为目标服务的所有端点配置**重试预算（Retry budgets）**。
用于在达到配置的阈值后限制额外的客户端重试。
配置预算时，可以指定可能包含重试在内的活动请求的最大百分比，
以及在计算重试阈值时考虑请求的时间间隔。
此规范的开发将现有的实验性 API 类型 BackendLBPolicy 更改为新的实验性 API 类型 XBackendTrafficPolicy，
以减少具有共同点的策略资源的扩散。

<!--
To be able to use experimental retry budgets, you need to install the
[Experimental channel Gateway API XBackendTrafficPolicy yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.x-k8s.io_xbackendtrafficpolicies.yaml).
-->
要使用实验性重试预算（Retry budgets），你需要安装[实验渠道 Gateway API XBackendTrafficPolicy yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.x-k8s.io_xbackendtrafficpolicies.yaml)。

<!--
The following example shows an XBackendTrafficPolicy that applies a
`retryConstraint` that represents a budget that limits the retries to a maximum
of 20% of requests, over a duration of 10 seconds, and to a minimum of 3 retries
over 1 second.
-->
以下示例显示了一个 XBackendTrafficPolicy，它应用了一个 `retryConstraint` （重试约束），
表示一个 重试预算（Retry budgets） ，将重试限制为最多 20% 的请求，持续时间为 10 秒，
并且在 1 秒内最少重试 3 次。

```yaml
apiVersion: gateway.networking.x-k8s.io/v1alpha1
kind: XBackendTrafficPolicy
metadata:
  name: traffic-policy-example
spec:
  retryConstraint:
    budget:
      percent: 20
      interval: 10s
    minRetryRate:
      count: 3
      interval: 1s
    ...
```

<!--
## Try it out
-->
## 试用   {#try-it-out}

<!--
Unlike other Kubernetes APIs, you don't need to upgrade to the latest version of
Kubernetes to get the latest version of Gateway API. As long as you're running
Kubernetes 1.26 or later, you'll be able to get up and running with this version
of Gateway API.
-->
与其他 Kubernetes API 不同，你不需要升级到最新版本的 Kubernetes 来获取最新版本的 Gateway API。
只要你运行的是 Kubernetes 1.26 或更高版本，你就可以使用此版本的 Gateway API 启动和运行。

<!--
To try out the API, follow the [Getting Started Guide](https://gateway-api.sigs.k8s.io/guides/).
As of this writing, four implementations are already conformant with Gateway API
v1.3 experimental channel features. In alphabetical order:
-->
要试用 API，请按照[入门指南](https://gateway-api.sigs.k8s.io/guides/)操作。
截至本文撰写时，已有四个实现符合 Gateway API v1.3 实验渠道功能。按字母顺序排列：

- [Airlock Microgateway 4.6](https://github.com/airlock/microgateway/releases/tag/4.6.0)
- [Cilium main](https://github.com/cilium/cilium)
- [Envoy Gateway v1.4.0](https://github.com/envoyproxy/gateway/releases/tag/v1.4.0)
- [Istio 1.27-dev](https://istio.io)

<!--
## Get involved
-->
## 参与其中   {#get-involved}

<!--
Wondering when a feature will be added?  There are lots of opportunities to get
involved and help define the future of Kubernetes routing APIs for both ingress
and service mesh.
-->
想知道何时会添加功能？有很多机会参与并帮助定义 Kubernetes API 路由的未来，包括 Ingress 和服务网格。

<!--
* Check out the [user guides](https://gateway-api.sigs.k8s.io/guides) to see what use-cases can be addressed.
* Try out one of the [existing Gateway controllers](https://gateway-api.sigs.k8s.io/implementations/).
* Or [join us in the community](https://gateway-api.sigs.k8s.io/contributing/)
and help us build the future of Gateway API together!
-->
* 查看[用户指南](https://gateway-api.sigs.k8s.io/guides)了解可以解决哪些用例。
* 试用[现有的 Gateway 控制器](https://gateway-api.sigs.k8s.io/implementations/)之一。
* 或者[加入我们的社区](https://gateway-api.sigs.k8s.io/contributing/)，
  帮助我们共同构建 Gateway API 的未来！

<!--
The maintainers would like to thank _everyone_ who's contributed to Gateway
API, whether in the form of commits to the repo, discussion, ideas, or general
support. We could never have made this kind of progress without the support of
this dedicated and active community.
-->
维护者衷心感谢**所有**为 Gateway API 做出贡献的人，无论是通过提交代码、讨论、想法还是提供其他支持。
没有这个充满热情和活力的社区，我们永远无法取得如此进展。

<!--
## Related Kubernetes blog articles
-->
## 相关 Kubernetes 博客文章   {#related-kubernetes-blog-articles}

<!--
* [Gateway API v1.2: WebSockets, Timeouts, Retries, and More](/blog/2024/11/21/gateway-api-v1-2/)
  (November 2024)
* [Gateway API v1.1: Service mesh, GRPCRoute, and a whole lot more](/blog/2024/05/09/gateway-api-v1-1/)
  (May 2024)
* [New Experimental Features in Gateway API v1.0](/blog/2023/11/28/gateway-api-ga/)
  (November 2023)
* [Gateway API v1.0: GA Release](/blog/2023/10/31/gateway-api-ga/)
  (October 2023)
-->
* [Gateway API v1.2：WebSockets、超时、重试等](/blog/2024/11/21/gateway-api-v1-2/)
  （2024 年 11 月）
* [Gateway API v1.1：服务网格、GRPCRoute 和更多变化](/zh-cn/blog/2024/05/09/gateway-api-v1-1/)
  （2024 年 5 月）
* [Gateway API v1.0 中的新实验功能](/blog/2023/11/28/gateway-api-ga/)
  （2023 年 11 月）
* [Gateway API v1.0：正式发布（GA）](/zh-cn/blog/2023/10/31/gateway-api-ga/)
  （2023 年 10 月）
