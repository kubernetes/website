---
layout: blog
title: "Gateway API v1.3.0：流量複製、CORS、Gateway 合併和重試預算的改進"
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
加入 Kubernetes SIG Network 社區，共同慶祝 [Gateway API](https://gateway-api.sigs.k8s.io/) v1.3.0 正式發佈！
我們很高興地宣佈，通過推遲這篇博客的發佈，現在已經有了多個符合規範的實現可供試用。
API 1.3.0 版本已於 2025 年 4 月 24 日發佈。

<!--
Gateway API v1.3.0 brings a new feature to the _Standard_ channel
(Gateway API's GA release channel): _percentage-based request mirroring_, and
introduces three new experimental features: cross-origin resource sharing (CORS)
filters, a standardized mechanism for listener and gateway merging, and retry
budgets.
-->
Gateway API v1.3.0 爲 **Standard** 渠道（Gateway API 的正式發佈渠道）帶來了一個新功能：**基於百分比的流量複製**，
並引入了三個新的實驗性功能：

- 跨源資源共享（CORS）過濾器
- Listener 和 Gateway 合併的標準化機制
- 重試預算（Retry Budgets）

<!--
Also see the full
[release notes](https://github.com/kubernetes-sigs/gateway-api/blob/54df0a899c1c5c845dd3a80f05dcfdf65576f03c/CHANGELOG/1.3-CHANGELOG.md)
and applaud the
[v1.3.0 release team](https://github.com/kubernetes-sigs/gateway-api/blob/54df0a899c1c5c845dd3a80f05dcfdf65576f03c/CHANGELOG/1.3-TEAM.md)
next time you see them.
-->
另請查看完整的[發佈說明](https://github.com/kubernetes-sigs/gateway-api/blob/54df0a899c1c5c845dd3a80f05dcfdf65576f03c/CHANGELOG/1.3-CHANGELOG.md)，
下次見到 [v1.3.0 發佈團隊](https://github.com/kubernetes-sigs/gateway-api/blob/54df0a899c1c5c845dd3a80f05dcfdf65576f03c/CHANGELOG/1.3-TEAM.md) 時請爲他們鼓掌。

<!--
## Graduation to Standard channel
-->
## 升級至 Standard 渠道 {#graduation-to-standard-channel}

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
對於 Gateway API 的功能來說，升級到 Standard 渠道是一個重要的里程碑。
被納入 Standard 發佈渠道表明我們對該 API 接口的穩定性具有高度信心，並且承諾向後兼容。
當然，與任何其他 Kubernetes API 一樣， Standard 渠道中的功能仍可通過向後兼容的方式不斷演進。
我們（SIG Network）也確實預計未來會有進一步的優化和改進。
有關這一切如何運作的更多信息，請參閱 [Gateway API 版本控制策略](https://gateway-api.sigs.k8s.io/concepts/versioning/)。

<!--
### Percentage-based request mirroring

Leads: [Lior Lieberman](https://github.com/LiorLieberman),[Jake Bennert](https://github.com/jakebennert)
GEP-3171: [Percentage-Based Request Mirroring](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-3171/index.md)
-->
### 基於百分比的流量複製 {#percentage-based-request-mirroring}

負責人：[Lior Lieberman](https://github.com/LiorLieberman)、[Jake Bennert](https://github.com/jakebennert)
GEP-3171：[基於百分比的流量複製](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-3171/index.md)

<!--
_Percentage-based request mirroring_ is an enhancement to the
existing support for [HTTP request mirroring](https://gateway-api.sigs.k8s.io/guides/http-request-mirroring/), which allows HTTP requests to be duplicated to another backend using the
RequestMirror filter type.  Request mirroring is particularly useful in
blue-green deployment. It can be used to assess the impact of request scaling on
application performance without impacting responses to clients.
-->
**基於百分比的流量複製**是對現有 [HTTP 流量複製](https://gateway-api.sigs.k8s.io/guides/http-request-mirroring/) 支持的增強，
它允許使用 RequestMirror 過濾器類型將 HTTP 請求複製到另一個後端。流量複製在藍綠部署中特別有用。
它可用於評估流量波動對應用程序性能的影響，而不會影響對客戶端的響應。

<!--
The previous mirroring capability worked on all the requests to a `backendRef`.
Percentage-based request mirroring allows users to specify a subset of requests
they want to be mirrored, either by percentage or fraction. This can be
particularly useful when services are receiving a large volume of requests.
Instead of mirroring all of those requests, this new feature can be used to
mirror a smaller subset of them.
-->
之前的流量複製功能適用於對 `backendRef` 的所有請求。基於百分比的流量複製允許用戶指定他們想要複製的請求子集，
可以通過百分比或分數來指定。當服務接收大量請求時，這特別有用。這個新功能可以用來複制這些請求中的一小部分，
而不是複製所有請求。

<!--
Here's an example with 42% of the requests to "foo-v1" being mirrored to "foo-v2":
-->
以下是一個示例，將發送到 "foo-v1" 的流量的  42% 複製到 "foo-v2"：

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
        percent: 42 # 此值必須爲整數。
```

<!--
You can also configure the partial mirroring using a fraction. Here is an example
with 5 out of every 1000 requests to "foo-v1" being mirrored to "foo-v2".
-->
你也可以通過調整分數來實現部分流量複製。
以下是一個示例，在發送到 "foo-v1" 的請求中，將每 1000 箇中的 5 個複製到 "foo-v2"。

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
## 實驗渠道的新特性 {#additions-to-Experimental-channel}

<!--
The Experimental channel is Gateway API's channel for experimenting with new
features and gaining confidence with them before allowing them to graduate to
standard.  Please note: the experimental channel may include features that are
changed or removed later.
-->
實驗渠道（Experimental channel）是 Gateway API 用於試驗新功能的渠道，以便在功能成熟之前積累足夠信心，
再將其升級爲 Standard 渠道功能。
請注意：實驗渠道可能包含後續會被更改或移除的功能。

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
從 v1.3.0 版本開始，爲了區分實驗渠道資源和 Standard 渠道資源，
所有新的實驗性 API 類型都帶有 "**X**" 前綴。
出於同樣的原因，實驗性資源現在被添加到 API 組 `gateway.networking.x-k8s.io`，
而不是 `gateway.networking.k8s.io`。
請注意，使用新的實驗渠道資源意味着它們可以與 Standard 渠道資源共存，
若要將這些資源遷移到 Standard 渠道，則需要使用 Standard 渠道的名稱和 API 組
（兩者都不包含 "x-k8s" 標識或 "X" 前綴）來重新創建它們。

<!--
The v1.3 release introduces two new experimental API kinds: XBackendTrafficPolicy
and XListenerSet.  To be able to use experimental API kinds, you need to install
the Experimental channel Gateway API YAMLs from the locations listed below.
-->
v1.3 版本引入了兩個新的實驗性 API 類型：XBackendTrafficPolicy 和 XListenerSet。
要使用實驗性 API 類型，你需要從下面列出的位置安裝實驗渠道 Gateway API YAML 文件。

<!--
### CORS filtering
-->
### CORS 過濾 {#cors-filtering}

<!--
Leads: [Liang Li](https://github.com/liangli), [Eyal Pazz](https://github.com/EyalPazz), [Rob Scott](https://github.com/robscott)

GEP-1767: [CORS Filter](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-1767/index.md)
-->
負責人：[Liang Li](https://github.com/liangli)、[Eyal Pazz](https://github.com/EyalPazz)、[Rob Scott](https://github.com/robscott)

GEP-1767：[CORS 過濾器](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-1767/index.md)

<!--
Cross-origin resource sharing (CORS) is an HTTP-header based mechanism that allows
a web page to access restricted resources from a server on an origin (domain,
scheme, or port) different from the domain that served the web page. This feature
adds a new HTTPRoute `filter` type, called "CORS", to configure the handling of
cross-origin requests before the response is sent back to the client.
-->
跨源資源共享（CORS）是一種基於 HTTP Header 的機制，
允許網頁從與提供網頁的域不同的源（域名、協議或端口）訪問受限資源。
此功能添加了一個新的 HTTPRoute `filter` 類型，
稱爲 "CORS"，用於在響應發送回客戶端之前配置跨源請求的處理。

<!--
To be able to use experimental CORS filtering, you need to install the
[Experimental channel Gateway API HTTPRoute yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.k8s.io_httproutes.yaml).
-->
要使用實驗性 CORS 過濾，你需要安裝[實驗渠道 Gateway API HTTPRoute yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.k8s.io_httproutes.yaml)。

<!--
Here's an example of a simple cross-origin configuration:
-->
以下是一個簡單的跨源配置示例：

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
在這種情況下，Gateway 返回一個 **origin header** 爲 "*"，這意味着請求的資源可以從任何源引用；
一個 **methods header** （`Access-Control-Allow-Methods`）允許 `GET`、`HEAD` 和 `POST` 方法；
此外，還會返回一個 **headers header** ，允許的字段包括 `Accept`、`Accept-Language`、
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
新的 CORS 過濾器中的完整字段列表如下：

* `allowOrigins`：允許的請求來源列表。
* `allowMethods`：允許的 HTTP 方法（如 `GET`、`POST` 等）。
* `allowHeaders`：允許攜帶的請求頭字段。
* `allowCredentials`：是否允許攜帶憑據（如 Cookie、Authorization 頭等）。
* `exposeHeaders`：允許客戶端訪問的響應頭字段。
* `maxAge`：預檢請求的緩存持續時間（單位：秒）。

有關詳細信息，請參閱 [CORS 協議](https://fetch.spec.whatwg.org/#http-cors-protocol)。

<!--
### XListenerSets (standardized mechanism for Listener and Gateway merging){#XListenerSet}
-->
### XListenerSets（Listener 和 Gateway 合併的標準化機制）{#XListenerSet}

<!--
Lead: [Dave Protasowski](https://github.com/dprotaso)
-->
負責人：[Dave Protasowski](https://github.com/dprotaso)

<!--
GEP-1713: [ListenerSets - Standard Mechanism to Merge Multiple Gateways](https://github.com/kubernetes-sigs/gateway-api/pull/3213)
-->
GEP-1713：[ListenerSets - 合併多個 Gateway 的標準機制](https://github.com/kubernetes-sigs/gateway-api/pull/3213)

<!--
This release adds a new experimental API kind, XListenerSet, that allows a
shared list of _listeners_ to be attached to one or more parent Gateway(s).  In
addition, it expands upon the existing suggestion that Gateway API implementations
may merge configuration from multiple Gateway objects.  It also:
-->
此版本添加了一個新的實驗性 API 類型 XListenerSet，它允許將 **listeners** 的共享列表附加到一個或多個父 Gateway。
此外，它還擴展了現有的建議，即 Gateway API 實現可以合併來自多個 Gateway 對象的配置。它還包括：

<!--
- adds a new field `allowedListeners` to the `.spec` of a Gateway. The
`allowedListeners` field defines from which Namespaces to select XListenerSets
that are allowed to attach to that Gateway: Same, All, None, or Selector based.
-->
- 向 Gateway 的 `.spec` 添加了一個新字段 `allowedListeners`。
  `allowedListeners` 字段定義了從哪些命名空間選擇允許附加到該 Gateway 的 XListenerSets：
  Same（同一命名空間）、All（所有命名空間）、None（不允許）、或基於選擇器（Selector）的方式。

<!--
- increases the previous maximum number (64) of listeners with the addition of
XListenerSets.
-->
- 通過添加 XListenerSets 增加了之前的監聽器最大數量（64）。

<!--
- allows the delegation of listener configuration, such as TLS, to applications in
other namespaces.
-->
- 允許將監聽器配置（如 TLS）委託給其他命名空間中的應用程序。

<!--
To be able to use experimental XListenerSet, you need to install the
[Experimental channel Gateway API XListenerSet yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.x-k8s.io_xlistenersets.yaml).
-->
要使用實驗性 XListenerSet，你需要安裝[實驗渠道 Gateway API XListenerSet yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.x-k8s.io_xlistenersets.yaml)。

<!--
The following example shows a Gateway with an HTTP listener and two child HTTPS
XListenerSets with unique hostnames and certificates.  The combined set of listeners
attached to the Gateway includes the two additional HTTPS listeners in the
XListenerSets that attach to the Gateway.  This example illustrates the
delegation of listener TLS config to application owners in different namespaces
("store" and "app").  The HTTPRoute has both the Gateway listener named "foo" and
one XListenerSet listener named "second" as `parentRefs`.
-->
以下示例展示了一個帶有 HTTP 監聽器和兩個子 HTTPS XListenerSets 的 Gateway，
每個 XListenerSet 都有唯一的主機名和證書。
最終附加到該 Gateway 的監聽器集合包含這兩個附加的 HTTPS `XListenerSet` 監聽器。
此示例說明了將監聽器 TLS 配置委託給不同命名空間（"store" 和 "app"）中的應用程序所有者。
HTTPRoute 同時將名爲 `"foo"` 的 Gateway 監聽器和一個名爲 `"second"` 的 `XListenerSet`
監聽器設置爲其 `parentRefs`。

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
Gateway 中的每個監聽器必須具有唯一的 `port`、`protocol` 組合
（如果協議支持，還包括 `hostname`），
以便所有監聽器都**兼容**，並且不會在它們應該接收的流量上發生衝突。

<!--
Furthermore, implementations can _merge_ separate Gateways into a single set of
listener addresses if all listeners across those Gateways are compatible.  The
management of merged listeners was under-specified in releases prior to v1.3.0.
-->
此外，如果這些 Gateway 上的所有監聽器都兼容，實現可以將單獨的 Gateway **合併**爲單個監聽器地址集。
在 v1.3.0 之前的版本中，合併監聽器的管理規範不足。

<!--
With the new feature, the specification on merging is expanded.  Implementations
must treat the parent Gateways as having the merged list of all listeners from
itself and from attached XListenerSets, and validation of this list of listeners
must behave the same as if the list were part of a single Gateway. Within a single
Gateway, listeners are ordered using the following precedence:
-->
通過新功能，合並規範得到了擴展。實現必須將父 Gateway 視爲具有來自自身和附加的 XListenerSets
的所有監聽器的合併列表，
並且對該監聽器列表的驗證行爲應與其作爲單個 Gateway 的一部分。
在單個 Gateway 內，監聽器使用以下優先級排序：

<!--
1. Single Listeners (not a part of an XListenerSet) first,
-->
1. 首先是單個監聽器（而不是 XListenerSet 的一部分），

<!--
2. Remaining listeners ordered by:
   - object creation time (oldest first), and if two listeners are defined in
   objects that have the same timestamp, then
   - alphabetically based on "{namespace}/{name of listener}"
-->
2. 其餘監聽器按以下順序排序：

   - 按對象創建時間排序（最早創建的優先）；
   - 如果兩個監聽器所在的對象具有相同的時間戳，
     則按照 `{namespace}/{監聽器名稱}` 的字母順序排序

<!--
### Retry budgets (XBackendTrafficPolicy) {#XBackendTrafficPolicy}
-->
### 重試預算（Retry budgets）（XBackendTrafficPolicy）{#XBackendTrafficPolicy}

<!--
Leads: [Eric Bishop](https://github.com/ericdbishop), [Mike Morris](https://github.com/mikemorris)
-->
負責人：[Eric Bishop](https://github.com/ericdbishop)、[Mike Morris](https://github.com/mikemorris)

<!--
GEP-3388: [Retry Budgets](https://gateway-api.sigs.k8s.io/geps/gep-3388)
-->
GEP-3388：[重試預算（Retry budgets）](https://gateway-api.sigs.k8s.io/geps/gep-3388)

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
此功能允許你爲目標服務的所有端點配置**重試預算（Retry budgets）**。
用於在達到配置的閾值後限制額外的客戶端重試。
配置預算時，可以指定可能包含重試在內的活動請求的最大百分比，
以及在計算重試閾值時考慮請求的時間間隔。
此規範的開發將現有的實驗性 API 類型 BackendLBPolicy 更改爲新的實驗性 API 類型 XBackendTrafficPolicy，
以減少具有共同點的策略資源的擴散。

<!--
To be able to use experimental retry budgets, you need to install the
[Experimental channel Gateway API XBackendTrafficPolicy yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.x-k8s.io_xbackendtrafficpolicies.yaml).
-->
要使用實驗性重試預算（Retry budgets），你需要安裝[實驗渠道 Gateway API XBackendTrafficPolicy yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.x-k8s.io_xbackendtrafficpolicies.yaml)。

<!--
The following example shows an XBackendTrafficPolicy that applies a
`retryConstraint` that represents a budget that limits the retries to a maximum
of 20% of requests, over a duration of 10 seconds, and to a minimum of 3 retries
over 1 second.
-->
以下示例顯示了一個 XBackendTrafficPolicy，它應用了一個 `retryConstraint` （重試約束），
表示一個 重試預算（Retry budgets） ，將重試限制爲最多 20% 的請求，持續時間爲 10 秒，
並且在 1 秒內最少重試 3 次。

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
## 試用   {#try-it-out}

<!--
Unlike other Kubernetes APIs, you don't need to upgrade to the latest version of
Kubernetes to get the latest version of Gateway API. As long as you're running
Kubernetes 1.26 or later, you'll be able to get up and running with this version
of Gateway API.
-->
與其他 Kubernetes API 不同，你不需要升級到最新版本的 Kubernetes 來獲取最新版本的 Gateway API。
只要你運行的是 Kubernetes 1.26 或更高版本，你就可以使用此版本的 Gateway API 啓動和運行。

<!--
To try out the API, follow the [Getting Started Guide](https://gateway-api.sigs.k8s.io/guides/).
As of this writing, four implementations are already conformant with Gateway API
v1.3 experimental channel features. In alphabetical order:
-->
要試用 API，請按照[入門指南](https://gateway-api.sigs.k8s.io/guides/)操作。
截至本文撰寫時，已有四個實現符合 Gateway API v1.3 實驗渠道功能。按字母順序排列：

- [Airlock Microgateway 4.6](https://github.com/airlock/microgateway/releases/tag/4.6.0)
- [Cilium main](https://github.com/cilium/cilium)
- [Envoy Gateway v1.4.0](https://github.com/envoyproxy/gateway/releases/tag/v1.4.0)
- [Istio 1.27-dev](https://istio.io)

<!--
## Get involved
-->
## 參與其中   {#get-involved}

<!--
Wondering when a feature will be added?  There are lots of opportunities to get
involved and help define the future of Kubernetes routing APIs for both ingress
and service mesh.
-->
想知道何時會添加功能？有很多機會參與並幫助定義 Kubernetes API 路由的未來，包括 Ingress 和服務網格。

<!--
* Check out the [user guides](https://gateway-api.sigs.k8s.io/guides) to see what use-cases can be addressed.
* Try out one of the [existing Gateway controllers](https://gateway-api.sigs.k8s.io/implementations/).
* Or [join us in the community](https://gateway-api.sigs.k8s.io/contributing/)
and help us build the future of Gateway API together!
-->
* 查看[用戶指南](https://gateway-api.sigs.k8s.io/guides)瞭解可以解決哪些用例。
* 試用[現有的 Gateway 控制器](https://gateway-api.sigs.k8s.io/implementations/)之一。
* 或者[加入我們的社區](https://gateway-api.sigs.k8s.io/contributing/)，
  幫助我們共同構建 Gateway API 的未來！

<!--
The maintainers would like to thank _everyone_ who's contributed to Gateway
API, whether in the form of commits to the repo, discussion, ideas, or general
support. We could never have made this kind of progress without the support of
this dedicated and active community.
-->
維護者衷心感謝**所有**爲 Gateway API 做出貢獻的人，無論是通過提交代碼、討論、想法還是提供其他支持。
沒有這個充滿熱情和活力的社區，我們永遠無法取得如此進展。

<!--
## Related Kubernetes blog articles
-->
## 相關 Kubernetes 博客文章   {#related-kubernetes-blog-articles}

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
* [Gateway API v1.2：WebSockets、超時、重試等](/blog/2024/11/21/gateway-api-v1-2/)
  （2024 年 11 月）
* [Gateway API v1.1：服務網格、GRPCRoute 和更多變化](/zh-cn/blog/2024/05/09/gateway-api-v1-1/)
  （2024 年 5 月）
* [Gateway API v1.0 中的新實驗功能](/blog/2023/11/28/gateway-api-ga/)
  （2023 年 11 月）
* [Gateway API v1.0：正式發佈（GA）](/zh-cn/blog/2023/10/31/gateway-api-ga/)
  （2023 年 10 月）
