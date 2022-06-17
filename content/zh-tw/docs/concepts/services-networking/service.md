---
title: 服務（Service）
feature:
  title: 服務發現與負載均衡
  description: >
    無需修改你的應用程式即可使用陌生的服務發現機制。Kubernetes 為容器提供了自己的 IP 地址和一個 DNS 名稱，並且可以在它們之間實現負載均衡。

content_type: concept
weight: 10
---

<!--
title: Service
feature:
  title: Service discovery and load balancing
  description: >
    No need to modify your application to use an unfamiliar service discovery mechanism. Kubernetes gives Pods their own IP addresses and a single DNS name for a set of Pods, and can load-balance across them.

content_type: concept
weight: 10
-->

<!-- overview -->

{{< glossary_definition term_id="service" length="short" >}}

<!--
With Kubernetes you don't need to modify your application to use an unfamiliar service discovery mechanism.
Kubernetes gives Pods their own IP addresses and a single DNS name for a set of Pods,
and can load-balance across them.
-->
使用 Kubernetes，你無需修改應用程式即可使用不熟悉的服務發現機制。
Kubernetes 為 Pods 提供自己的 IP 地址，併為一組 Pod 提供相同的 DNS 名，
並且可以在它們之間進行負載均衡。

<!-- body -->

<!--
## Motivation

Kubernetes {{< glossary_tooltip term_id="pod" text="Pods" >}} are created and destroyed
to match the desired state of your cluster. Pods are nonpermanent resources.
If you use a {{< glossary_tooltip term_id="deployment" >}} to run your app,
it can create and destroy Pods dynamically.

Each Pod gets its own IP address, however in a Deployment, the set of Pods
running in one moment in time could be different from
the set of Pods running that application a moment later.

This leads to a problem: if some set of Pods (call them "backends") provides
functionality to other Pods (call them "frontends") inside your cluster,
how do the frontends find out and keep track of which IP address to connect
to, so that the frontend can use the backend part of the workload?

Enter _Services_.
-->

## 動機

建立和銷燬 Kubernetes {{< glossary_tooltip term_id="pod" text="Pod" >}} 以匹配叢集的期望狀態。
Pod 是非永久性資源。
如果你使用 {{< glossary_tooltip term_id="deployment">}}
來執行你的應用程式，則它可以動態建立和銷燬 Pod。

每個 Pod 都有自己的 IP 地址，但是在 Deployment 中，在同一時刻執行的 Pod 集合可能與稍後執行該應用程式的 Pod 集合不同。

這導致了一個問題： 如果一組 Pod（稱為“後端”）為叢集內的其他 Pod（稱為“前端”）提供功能，
那麼前端如何找出並跟蹤要連線的 IP 地址，以便前端可以使用提供工作負載的後端部分？

進入 _Services_。

<!--
## Service resources {#service-resource}
-->
## Service 資源 {#service-resource}

<!--
In Kubernetes, a Service is an abstraction which defines a logical set of Pods
and a policy by which to access them (sometimes this pattern is called
a micro-service). The set of Pods targeted by a Service is usually determined
by a {{< glossary_tooltip text="selector" term_id="selector" >}}.
To learn about other ways to define Service endpoints,
see [Services _without_ selectors](#services-without-selectors).
-->
Kubernetes Service 定義了這樣一種抽象：邏輯上的一組 Pod，一種可以訪問它們的策略 —— 通常稱為微服務。
Service 所針對的 Pods 集合通常是透過{{< glossary_tooltip text="選擇算符" term_id="selector" >}}來確定的。
要了解定義服務端點的其他方法，請參閱[不帶選擇算符的服務](#services-without-selectors)。

<!--
For example, consider a stateless image-processing backend which is running with
3 replicas.  Those replicas are fungible&mdash;frontends do not care which backend
they use.  While the actual Pods that compose the backend set may change, the
frontend clients should not need to be aware of that, nor should they need to keep
track of the set of backends themselves.

The Service abstraction enables this decoupling.
-->
舉個例子，考慮一個圖片處理後端，它運行了 3 個副本。這些副本是可互換的 —— 
前端不需要關心它們呼叫了哪個後端副本。
然而組成這一組後端程式的 Pod 實際上可能會發生變化，
前端客戶端不應該也沒必要知道，而且也不需要跟蹤這一組後端的狀態。

Service 定義的抽象能夠解耦這種關聯。

<!--
### Cloud-native service discovery

If you're able to use Kubernetes APIs for service discovery in your application,
you can query the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
for Endpoints, that get updated whenever the set of Pods in a Service changes.

For non-native applications, Kubernetes offers ways to place a network port or load
balancer in between your application and the backend Pods.
-->
### 雲原生服務發現

如果你想要在應用程式中使用 Kubernetes API 進行服務發現，則可以查詢
{{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}
的 Endpoints 資源，只要服務中的 Pod 集合發生更改，Endpoints 就會被更新。

對於非本機應用程式，Kubernetes 提供了在應用程式和後端 Pod 之間放置網路埠或負載均衡器的方法。

<!--
## Defining a Service

A Service in Kubernetes is a REST object, similar to a Pod.  Like all of the
REST objects, you can `POST` a Service definition to the API server to create
a new instance.
The name of a Service object must be a valid
[RFC 1035 label name](/docs/concepts/overview/working-with-objects/names#rfc-1035-label-names).

For example, suppose you have a set of Pods where each listens on TCP port 9376
and contains a label `app=MyApp`:
-->

## 定義 Service

Service 在 Kubernetes 中是一個 REST 物件，和 Pod 類似。
像所有的 REST 物件一樣，Service 定義可以基於 `POST` 方式，請求 API server 建立新的例項。
Service 物件的名稱必須是合法的
[RFC 1035 標籤名稱](/docs/concepts/overview/working-with-objects/names#rfc-1035-label-names).。

例如，假定有一組 Pod，它們對外暴露了 9376 埠，同時還被打上 `app=MyApp` 標籤：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

<!--
This specification creates a new Service object named “my-service”, which
targets TCP port 9376 on any Pod with the `app=MyApp` label.

Kubernetes assigns this Service an IP address (sometimes called the "cluster IP"),
which is used by the Service proxies
(see [Virtual IPs and service proxies](#virtual-ips-and-service-proxies) below).

The controller for the Service selector continuously scans for Pods that
match its selector, and then POSTs any updates to an Endpoint object
also named "my-service".
-->
上述配置建立一個名稱為 "my-service" 的 Service 物件，它會將請求代理到使用
TCP 埠 9376，並且具有標籤 `"app=MyApp"` 的 Pod 上。

Kubernetes 為該服務分配一個 IP 地址（有時稱為 "叢集IP"），該 IP 地址由服務代理使用。
(請參見下面的 [VIP 和 Service 代理](#virtual-ips-and-service-proxies)).

服務選擇算符的控制器不斷掃描與其選擇器匹配的 Pod，然後將所有更新發布到也稱為
“my-service” 的 Endpoint 物件。

<!--
A Service can map _any_ incoming `port` to a `targetPort`. By default and
for convenience, the `targetPort` is set to the same value as the `port`
field.
-->
{{< note >}}
需要注意的是，Service 能夠將一個接收 `port` 對映到任意的 `targetPort`。
預設情況下，`targetPort` 將被設定為與 `port` 欄位相同的值。
{{< /note >}}

<!--
Port definitions in Pods have names, and you can reference these names in the
`targetPort` attribute of a Service. For example, we can bind the `targetPort`
of the Service to the Pod port in the following way:
-->
Pod 中的埠定義是有名字的，你可以在 Service 的 `targetPort` 屬性中引用這些名稱。
例如，我們可以透過以下方式將 Service 的 `targetPort` 繫結到 Pod 埠：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app.kubernetes.io/name: proxy
spec:
  containers:
  - name: nginx
    image: nginx:stable
    ports:
      - containerPort: 80
        name: http-web-svc
        
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app.kubernetes.io/name: proxy
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 80
    targetPort: http-web-svc
```

<!--
This works even if there is a mixture of Pods in the Service using a single
configured name, with the same network protocol available via different
port numbers. This offers a lot of flexibility for deploying and evolving
your Services. For example, you can change the port numbers that Pods expose
in the next version of your backend software, without breaking clients.
-->
即使 Service 中使用同一配置名稱混合使用多個 Pod，各 Pod 透過不同的埠號支援相同的網路協議，
此功能也可以使用。這為 Service 的部署和演化提供了很大的靈活性。
例如，你可以在新版本中更改 Pod 中後端軟體公開的埠號，而不會破壞客戶端。


<!--
The default protocol for Services is TCP; you can also use any other
[supported protocol](#protocol-support).

As many Services need to expose more than one port, Kubernetes supports multiple
port definitions on a Service object.
Each port definition can have the same `protocol`, or a different one.
-->


服務的預設協議是 TCP；你還可以使用任何其他[受支援的協議](#protocol-support)。

由於許多服務需要公開多個埠，因此 Kubernetes 在服務物件上支援多個埠定義。
每個埠定義可以具有相同的 `protocol`，也可以具有不同的協議。

<!--
### Services without selectors

Services most commonly abstract access to Kubernetes Pods thanks to the selector,
but when used with a corresponding Endpoints object and without a selector, the Service can abstract other kinds of backends, 
including ones that run outside the cluster. For example:

  * You want to have an external database cluster in production, but in your
    test environment you use your own databases.
  * You want to point your Service to a Service in a different
    {{< glossary_tooltip term_id="namespace" >}} or on another cluster.
* You are migrating a workload to Kubernetes. While evaluating the approach,
    you run only a portion of your backends in Kubernetes.

In any of these scenarios you can define a Service _without_ a Pod selector.
For example:
-->
### 沒有選擇算符的 Service   {#services-without-selectors}

由於選擇器的存在，服務最常見的用法是為 Kubernetes Pod 的訪問提供抽象，
但是當與相應的 Endpoints 物件一起使用且沒有選擇器時，
服務也可以為其他型別的後端提供抽象，包括在叢集外執行的後端。
例如：

  * 希望在生產環境中使用外部的資料庫叢集，但測試環境使用自己的資料庫。
  * 希望服務指向另一個 {{< glossary_tooltip term_id="namespace" >}} 中或其它叢集中的服務。
  * 你正在將工作負載遷移到 Kubernetes。 在評估該方法時，你僅在 Kubernetes 中執行一部分後端。

在任何這些場景中，都能夠定義沒有選擇算符的 Service。
例項:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

<!--
Because this Service has no selector, the corresponding Endpoints object is not
created automatically. You can manually map the Service to the network address and port
where it's running, by adding an Endpoints object manually:
-->
由於此服務沒有選擇算符，因此不會自動建立相應的 Endpoint 物件。
你可以透過手動新增 Endpoint 物件，將服務手動對映到執行該服務的網路地址和埠：

```yaml
apiVersion: v1
kind: Endpoints
metadata:
  # 這裡的 name 要與 Service 的名字相同
  name: my-service
subsets:
  - addresses:
      - ip: 192.0.2.42
    ports:
      - port: 9376
```
<!--
The name of the Endpoints object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
Endpoints 物件的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
When you create an [Endpoints](docs/reference/kubernetes-api/service-resources/endpoints-v1/)
object for a Service, you set the name of the new object to be the same as that
of the Service.
-->
當你為某個 Service 建立一個 [Endpoints](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
物件時，你要將新物件的名稱設定為與 Service 的名稱相同。

{{< note >}}
<!--
The endpoint IPs _must not_ be: loopback (127.0.0.0/8 for IPv4, ::1/128 for IPv6), or
link-local (169.254.0.0/16 and 224.0.0.0/24 for IPv4, fe80::/64 for IPv6).

Endpoint IP addresses cannot be the cluster IPs of other Kubernetes Services,
because {{< glossary_tooltip term_id="kube-proxy" >}} doesn't support virtual IPs
as a destination.
-->
端點 IPs _必須不可以_ 是：本地迴路（IPv4 的 127.0.0.0/8, IPv6 的 ::1/128）或
本地連結（IPv4 的 169.254.0.0/16 和 224.0.0.0/24，IPv6 的 fe80::/64)。

端點 IP 地址不能是其他 Kubernetes 服務的叢集 IP，因為
{{< glossary_tooltip term_id ="kube-proxy">}} 不支援將虛擬 IP 作為目標。
{{< /note >}}

<!--
Accessing a Service without a selector works the same as if it had a selector.
In the example above, traffic is routed to the single endpoint defined in
the YAML: `192.0.2.42:9376` (TCP).
-->
訪問沒有選擇算符的 Service，與有選擇算符的 Service 的原理相同。
請求將被路由到使用者定義的 Endpoint，YAML 中為：`192.0.2.42:9376`（TCP）。

<!--
An ExternalName Service is a special case of Service that does not have
selectors and uses DNS names instead. For more information, see the
[ExternalName](#externalname) section later in this document.
-->
ExternalName Service 是 Service 的特例，它沒有選擇算符，但是使用 DNS 名稱。
有關更多資訊，請參閱本文件後面的[ExternalName](#externalname)。

<!--
### Over Capacity Endpoints

If an Endpoints resource has more than 1000 endpoints then a Kubernetes v1.22 (or later)
cluster annotates that Endpoints with `endpoints.kubernetes.io/over-capacity: truncated`.
This annotation indicates that the affected Endpoints object is over capacity and that
the endpoints controller has truncated the number of endpoints to 1000.
-->
### 超出容量的 Endpoints    {#over-capacity-endpoints}

如果某個 Endpoints 資源中包含的端點個數超過 1000，則 Kubernetes v1.22 版本
（及更新版本）的叢集會將為該 Endpoints 添加註解
`endpoints.kubernetes.io/over-capacity: truncated`。
這一註解表明所影響到的 Endpoints 物件已經超出容量，此外 Endpoints 控制器還會將 Endpoints 物件數量截斷到 1000。

<!--
### EndpointSlices
-->
### EndpointSlices

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
Endpoint Slices are an API resource that can provide a more scalable alternative
to Endpoints. Although conceptually quite similar to Endpoints, Endpoint Slices
allow for distributing network endpoints across multiple resources. By default,
an Endpoint Slice is considered "full" once it reaches 100 endpoints, at which
point additional Endpoint Slices will be created to store any additional
endpoints.

Endpoint Slices provide additional attributes and functionality which is
described in detail in [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/).
-->
EndpointSlices 是一種 API 資源，可以為 Endpoints 提供更可擴充套件的替代方案。
儘管從概念上講與 Endpoints 非常相似，但 EndpointSlices 允許跨多個資源分佈網路端點。
預設情況下，一旦到達 100 個 Endpoint，該 EndpointSlice 將被視為“已滿”，
屆時將建立其他 EndpointSlices 來儲存任何其他 Endpoints。

EndpointSlices 提供了附加的屬性和功能，這些屬性和功能在
[EndpointSlices](/zh-cn/docs/concepts/services-networking/endpoint-slices/)
中有詳細描述。

<!-- 
### Application protocol

{{< feature-state for_k8s_version="v1.20" state="stable" >}}
The `appProtocol` field provides a way to specify an application protocol for
each Service port. The value of this field is mirrored by the corresponding
Endpoints and EndpointSlice objects.

This field follows standard Kubernetes label syntax. Values should either be
[IANA standard service names](https://www.iana.org/assignments/service-names) or
domain prefixed names such as `mycompany.com/my-custom-protocol`.
-->
### 應用協議   {#application-protocol}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

`appProtocol` 欄位提供了一種為每個 Service 埠指定應用協議的方式。
此欄位的取值會被對映到對應的 Endpoints 和 EndpointSlices 物件。

該欄位遵循標準的 Kubernetes 標籤語法。
其值可以是 [IANA 標準服務名稱](https://www.iana.org/assignments/service-names)
或以域名為字首的名稱，如 `mycompany.com/my-custom-protocol`。 
<!--
## Virtual IPs and service proxies

Every node in a Kubernetes cluster runs a `kube-proxy`. `kube-proxy` is
responsible for implementing a form of virtual IP for `Services` of type other
than [`ExternalName`](#externalname).
-->
## 虛擬 IP 和 Service 代理 {#virtual-ips-and-service-proxies}

在 Kubernetes 叢集中，每個 Node 執行一個 `kube-proxy` 程序。
`kube-proxy` 負責為 Service 實現了一種 VIP（虛擬 IP）的形式，而不是
[`ExternalName`](#externalname) 的形式。

<!--
### Why not use round-robin DNS?

A question that pops up every now and then is why Kubernetes relies on
proxying to forward inbound traffic to backends. What about other
approaches? For example, would it be possible to configure DNS records that
have multiple A values (or AAAA for IPv6), and rely on round-robin name
resolution?

There are a few reasons for using proxying for Services:

 * There is a long history of DNS implementations not respecting record TTLs,
   and caching the results of name lookups after they should have expired.
 * Some apps do DNS lookups only once and cache the results indefinitely.
 * Even if apps and libraries did proper re-resolution, the low or zero TTLs
   on the DNS records could impose a high load on DNS that then becomes
   difficult to manage.
-->
### 為什麼不使用 DNS 輪詢？

時不時會有人問到為什麼 Kubernetes 依賴代理將入站流量轉發到後端。那其他方法呢？
例如，是否可以配置具有多個 A 值（或 IPv6 為 AAAA）的 DNS 記錄，並依靠輪詢名稱解析？

使用服務代理有以下幾個原因：

* DNS 實現的歷史由來已久，它不遵守記錄 TTL，並且在名稱查詢結果到期後對其進行快取。
* 有些應用程式僅執行一次 DNS 查詢，並無限期地快取結果。
* 即使應用和庫進行了適當的重新解析，DNS 記錄上的 TTL 值低或為零也可能會給
  DNS 帶來高負載，從而使管理變得困難。

<!--
### User space proxy mode {#proxy-mode-userspace}

In this mode, kube-proxy watches the Kubernetes control plane for the addition and
removal of Service and Endpoint objects. For each Service it opens a
port (randomly chosen) on the local node.  Any connections to this "proxy port"
are proxied to one of the Service's backend Pods (as reported via
Endpoints). kube-proxy takes the `SessionAffinity` setting of the Service into
account when deciding which backend Pod to use.

Lastly, the user-space proxy installs iptables rules which capture traffic to
the Service's `clusterIP` (which is virtual) and `port`. The rules
redirect that traffic to the proxy port which proxies the backend Pod.

By default, kube-proxy in userspace mode chooses a backend via a round-robin algorithm.

![Services overview diagram for userspace proxy](/images/docs/services-userspace-overview.svg)
-->
### userspace 代理模式 {#proxy-mode-userspace}

這種模式，kube-proxy 會監視 Kubernetes 控制平面對 Service 物件和 Endpoints 物件的新增和移除操作。
對每個 Service，它會在本地 Node 上開啟一個埠（隨機選擇）。
任何連線到“代理埠”的請求，都會被代理到 Service 的後端 `Pods` 中的某個上面（如 `Endpoints` 所報告的一樣）。
使用哪個後端 Pod，是 kube-proxy 基於 `SessionAffinity` 來確定的。

最後，它配置 iptables 規則，捕獲到達該 Service 的 `clusterIP`（是虛擬 IP）
和 `Port` 的請求，並重定向到代理埠，代理埠再代理請求到後端Pod。

預設情況下，使用者空間模式下的 kube-proxy 透過輪轉演算法選擇後端。

![userspace 代理模式下 Service 概覽圖](/images/docs/services-userspace-overview.svg)

<!--
### `iptables` proxy mode {#proxy-mode-iptables}

In this mode, kube-proxy watches the Kubernetes control plane for the addition and
removal of Service and Endpoint objects. For each Service, it installs
iptables rules, which capture traffic to the Service's `clusterIP` and `port`,
and redirect that traffic to one of the Service's
backend sets.  For each Endpoint object, it installs iptables rules which
select a backend Pod.

By default, kube-proxy in iptables mode chooses a backend at random.

Using iptables to handle traffic has a lower system overhead, because traffic
is handled by Linux netfilter without the need to switch between userspace and the
kernel space. This approach is also likely to be more reliable.

If kube-proxy is running in iptables mode and the first Pod that's selected
does not respond, the connection fails. This is different from userspace
mode: in that scenario, kube-proxy would detect that the connection to the first
Pod had failed and would automatically retry with a different backend Pod.

You can use Pod [readiness probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)
to verify that backend Pods are working OK, so that kube-proxy in iptables mode
only sees backends that test out as healthy. Doing this means you avoid
having traffic sent via kube-proxy to a Pod that's known to have failed.

![Services overview diagram for iptables proxy](/images/docs/services-iptables-overview.svg)
-->
### iptables 代理模式 {#proxy-mode-iptables}

這種模式，`kube-proxy` 會監視 Kubernetes 控制節點對 Service 物件和 Endpoints 物件的新增和移除。
對每個 Service，它會配置 iptables 規則，從而捕獲到達該 Service 的 `clusterIP` 
和埠的請求，進而將請求重定向到 Service 的一組後端中的某個 Pod 上面。
對於每個 Endpoints 物件，它也會配置 iptables 規則，這個規則會選擇一個後端組合。

預設的策略是，kube-proxy 在 iptables 模式下隨機選擇一個後端。

使用 iptables 處理流量具有較低的系統開銷，因為流量由 Linux netfilter 處理，
而無需在使用者空間和核心空間之間切換。 這種方法也可能更可靠。

如果 kube-proxy 在 iptables 模式下執行，並且所選的第一個 Pod 沒有響應，
則連線失敗。
這與使用者空間模式不同：在這種情況下，kube-proxy 將檢測到與第一個 Pod 的連線已失敗，
並會自動使用其他後端 Pod 重試。

你可以使用 Pod [就緒探測器](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)
驗證後端 Pod 可以正常工作，以便 iptables 模式下的 kube-proxy 僅看到測試正常的後端。
這樣做意味著你避免將流量透過 kube-proxy 傳送到已知已失敗的 Pod。

![iptables代理模式下Service概覽圖](/images/docs/services-iptables-overview.svg)

<!--
### IPVS proxy mode {#proxy-mode-ipvs}
-->
### IPVS 代理模式 {#proxy-mode-ipvs}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

<!--
In `ipvs` mode, kube-proxy watches Kubernetes Services and Endpoints,
calls `netlink` interface to create IPVS rules accordingly and synchronizes
IPVS rules with Kubernetes Services and Endpoints periodically.
This control loop ensures that IPVS status matches the desired
state.
When accessing a Service, IPVS directs traffic to one of the backend Pods.

The IPVS proxy mode is based on netfilter hook function that is similar to
iptables mode, but uses a hash table as the underlying data structure and works
in the kernel space.
That means kube-proxy in IPVS mode redirects traffic with lower latency than
kube-proxy in iptables mode, with much better performance when synchronising
proxy rules. Compared to the other proxy modes, IPVS mode also supports a
higher throughput of network traffic.

IPVS provides more options for balancing traffic to backend Pods;
these are:
-->
在 `ipvs` 模式下，kube-proxy 監視 Kubernetes 服務和端點，呼叫 `netlink` 介面相應地建立 IPVS 規則，
並定期將 IPVS 規則與 Kubernetes 服務和端點同步。 該控制迴圈可確保IPVS 
狀態與所需狀態匹配。訪問服務時，IPVS 將流量定向到後端Pod之一。

IPVS代理模式基於類似於 iptables 模式的 netfilter 掛鉤函式，
但是使用雜湊表作為基礎資料結構，並且在核心空間中工作。
這意味著，與 iptables 模式下的 kube-proxy 相比，IPVS 模式下的 kube-proxy
重定向通訊的延遲要短，並且在同步代理規則時具有更好的效能。
與其他代理模式相比，IPVS 模式還支援更高的網路流量吞吐量。

IPVS 提供了更多選項來平衡後端 Pod 的流量。 這些是：

* `rr`：輪替（Round-Robin）
* `lc`：最少連結（Least Connection），即開啟連結數量最少者優先
* `dh`：目標地址雜湊（Destination Hashing）
* `sh`：源地址雜湊（Source Hashing）
* `sed`：最短預期延遲（Shortest Expected Delay）
* `nq`：從不排隊（Never Queue）

<!--
To run kube-proxy in IPVS mode, you must make IPVS available on
the node before starting kube-proxy.

When kube-proxy starts in IPVS proxy mode, it verifies whether IPVS
kernel modules are available. If the IPVS kernel modules are not detected, then kube-proxy
falls back to running in iptables proxy mode.
-->
{{< note >}}
要在 IPVS 模式下執行 kube-proxy，必須在啟動 kube-proxy 之前使 IPVS 在節點上可用。

當 kube-proxy 以 IPVS 代理模式啟動時，它將驗證 IPVS 核心模組是否可用。
如果未檢測到 IPVS 核心模組，則 kube-proxy 將退回到以 iptables 代理模式執行。
{{< /note >}}

<!--
![Services overview diagram for IPVS proxy](/images/docs/services-ipvs-overview.svg)

In these proxy models, the traffic bound for the Service's IP:Port is
proxied to an appropriate backend without the clients knowing anything
about Kubernetes or Services or Pods.

If you want to make sure that connections from a particular client
are passed to the same Pod each time, you can select the session affinity based
on the client's IP addresses by setting `service.spec.sessionAffinity` to "ClientIP"
(the default is "None").
You can also set the maximum session sticky time by setting
`service.spec.sessionAffinityConfig.clientIP.timeoutSeconds` appropriately.
(the default value is 10800, which works out to be 3 hours).
-->

![IPVS代理的 Services 概述圖](/images/docs/services-ipvs-overview.svg)

在這些代理模型中，繫結到服務 IP 的流量：
在客戶端不瞭解 Kubernetes 或服務或 Pod 的任何資訊的情況下，將 Port 代理到適當的後端。

如果要確保每次都將來自特定客戶端的連線傳遞到同一 Pod，
則可以透過將 `service.spec.sessionAffinity` 設定為 "ClientIP" 
（預設值是 "None"），來基於客戶端的 IP 地址選擇會話關聯。
你還可以透過適當設定 `service.spec.sessionAffinityConfig.clientIP.timeoutSeconds` 
來設定最大會話停留時間。
（預設值為 10800 秒，即 3 小時）。

<!--
On Windows, setting the maximum session sticky time for Services is not supported.
-->
{{< note >}}
在 Windows 上，不支援為服務設定最大會話停留時間。
{{< /note >}}


<!--
## Multi-Port Services

For some Services, you need to expose more than one port.
Kubernetes lets you configure multiple port definitions on a Service object.
When using multiple ports for a Service, you must give all of your ports names
so that these are unambiguous.
For example:
-->
## 多埠 Service   {#multi-port-services}

對於某些服務，你需要公開多個埠。
Kubernetes 允許你在 Service 物件上配置多個埠定義。
為服務使用多個埠時，必須提供所有埠名稱，以使它們無歧義。
例如：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
    - name: https
      protocol: TCP
      port: 443
      targetPort: 9377
```

<!--
As with Kubernetes {{< glossary_tooltip term_id="name" text="names">}} in general, names for ports
must only contain lowercase alphanumeric characters and `-`. Port names must
also start and end with an alphanumeric character.

For example, the names `123-abc` and `web` are valid, but `123_abc` and `-web` are not.
-->
{{< note >}}
與一般的Kubernetes名稱一樣，埠名稱只能包含小寫字母數字字元 和 `-`。 
埠名稱還必須以字母數字字元開頭和結尾。

例如，名稱 `123-abc` 和 `web` 有效，但是 `123_abc` 和 `-web` 無效。
{{< /note >}}

<!--
## Choosing your own IP address

You can specify your own cluster IP address as part of a `Service` creation
request.  To do this, set the `.spec.clusterIP` field. For example, if you
already have an existing DNS entry that you wish to reuse, or legacy systems
that are configured for a specific IP address and difficult to re-configure.

The IP address that you choose must be a valid IPv4 or IPv6 address from within the
`service-cluster-ip-range` CIDR range that is configured for the API server.
If you try to create a Service with an invalid clusterIP address value, the API
server will return a 422 HTTP status code to indicate that there's a problem.
-->
## 選擇自己的 IP 地址

在 `Service` 建立的請求中，可以透過設定 `spec.clusterIP` 欄位來指定自己的叢集 IP 地址。
比如，希望替換一個已經已存在的 DNS 條目，或者遺留系統已經配置了一個固定的 IP 且很難重新配置。

使用者選擇的 IP 地址必須合法，並且這個 IP 地址在 `service-cluster-ip-range` CIDR 範圍內，
這對 API 伺服器來說是透過一個標識來指定的。
如果 IP 地址不合法，API 伺服器會返回 HTTP 狀態碼 422，表示值不合法。

<!--
## Traffic policies
-->
## 流量策略  {#traffic-policies}

<!--
### External traffic policy
-->
### 外部流量策略    {#external-traffic-policy}

<!--
You can set the `spec.externalTrafficPolicy` field to control how traffic from external sources is routed.
Valid values are `Cluster` and `Local`. Set the field to `Cluster` to route external traffic to all ready endpoints
and `Local` to only route to ready node-local endpoints. If the traffic policy is `Local` and there are no node-local
endpoints, the kube-proxy does not forward any traffic for the relevant Service.
-->

你可以透過設定 `spec.externalTrafficPolicy` 欄位來控制來自於外部的流量是如何路由的。
可選值有 `Cluster` 和 `Local`。欄位設為 `Cluster` 會將外部流量路由到所有就緒的端點，
設為 `Local` 會只路由到當前節點上就緒的端點。
如果流量策略設定為 `Local`，而且當前節點上沒有就緒的端點，kube-proxy 不會轉發請求相關服務的任何流量。

{{< note >}}
{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

<!--
If you enable the `ProxyTerminatingEndpoints`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`ProxyTerminatingEndpoints` for the kube-proxy, the kube-proxy checks if the node
has local endpoints and whether or not all the local endpoints are marked as terminating.
-->

如果你啟用了 kube-proxy 的 `ProxyTerminatingEndpoints`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
kube-proxy 會檢查節點是否有本地的端點，以及是否所有的本地端點都被標記為終止中。

<!--
If there are local endpoints and **all** of those are terminating, then the kube-proxy ignores
any external traffic policy of `Local`. Instead, whilst the node-local endpoints remain as all
terminating, the kube-proxy forwards traffic for that Service to healthy endpoints elsewhere,
as if the external traffic policy were set to `Cluster`.
-->

如果本地有端點，而且所有端點處於終止中的狀態，那麼 kube-proxy 會忽略任何設為 `Local` 的外部流量策略。
在所有本地端點處於終止中的狀態的同時，kube-proxy 將請求指定服務的流量轉發到位於其它節點的
狀態健康的端點，如同外部流量策略設為 `Cluster`。

<!--
This forwarding behavior for terminating endpoints exists to allow external load balancers to
gracefully drain connections that are backed by `NodePort` Services, even when the health check
node port starts to fail. Otherwise, traffic can be lost between the time a node is still in the node pool of a load
balancer and traffic is being dropped during the termination period of a pod.
-->
針對處於正被終止狀態的端點這一轉發行為使得外部負載均衡器可以優雅地排出由
`NodePort` 服務支援的連線，就算是健康檢查節點埠開始失敗也是如此。
否則，當節點還在負載均衡器的節點池內，在 Pod 終止過程中的流量會被丟掉，這些流量可能會丟失。

{{< /note >}}

<!--
### Internal traffic policy
-->
### 內部流量策略    {#internal-traffic-policy}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

<!--
You can set the `spec.internalTrafficPolicy` field to control how traffic from internal sources is routed.
Valid values are `Cluster` and `Local`. Set the field to `Cluster` to route internal traffic to all ready endpoints
and `Local` to only route to ready node-local endpoints. If the traffic policy is `Local` and there are no node-local
endpoints, traffic is dropped by kube-proxy.
-->
你可以設定 `spec.internalTrafficPolicy` 欄位來控制內部來源的流量是如何轉發的。可設定的值有 `Cluster` 和 `Local`。
將欄位設定為 `Cluster` 會將內部流量路由到所有就緒端點，設定為 `Local` 只會路由到當前節點上就緒的端點。
如果流量策略是 `Local`，而且當前節點上沒有就緒的端點，那麼 kube-proxy 會丟棄流量。

<!--
## Discovering services

Kubernetes supports 2 primary modes of finding a Service - environment
variables and DNS.
-->
## 服務發現  {#discovering-services}

Kubernetes 支援兩種基本的服務發現模式 —— 環境變數和 DNS。

<!--
### Environment variables

When a Pod is run on a Node, the kubelet adds a set of environment variables
for each active Service. It adds `{SVCNAME}_SERVICE_HOST` and `{SVCNAME}_SERVICE_PORT` variables, where the Service name is upper-cased and dashes are converted to underscores. It also supports variables (see [makeLinkVariables](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)) that are compatible with Docker Engine's "_[legacy container links](https://docs.docker.com/network/links/)_" feature.

For example, the Service `redis-master` which exposes TCP port 6379 and has been
allocated cluster IP address 10.0.0.11, produces the following environment
variables:
-->
### 環境變數   {#environment-variables}

當 Pod 執行在 `Node` 上，kubelet 會為每個活躍的 Service 新增一組環境變數。
kubelet 為 Pod 新增環境變數 `{SVCNAME}_SERVICE_HOST` 和 `{SVCNAME}_SERVICE_PORT`。
這裡 Service 的名稱需大寫，橫線被轉換成下劃線。
它還支援與 Docker Engine 的 "_[legacy container links](https://docs.docker.com/network/links/)_" 特性相容的變數
（參閱 [makeLinkVariables](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)) 。

舉個例子，一個名稱為 `redis-master` 的 Service 暴露了 TCP 埠 6379，
同時給它分配了 Cluster IP 地址 10.0.0.11，這個 Service 生成了如下環境變數：

```shell
REDIS_MASTER_SERVICE_HOST=10.0.0.11
REDIS_MASTER_SERVICE_PORT=6379
REDIS_MASTER_PORT=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP_PROTO=tcp
REDIS_MASTER_PORT_6379_TCP_PORT=6379
REDIS_MASTER_PORT_6379_TCP_ADDR=10.0.0.11
```

<!--
When you have a Pod that needs to access a Service, and you are using
the environment variable method to publish the port and cluster IP to the client
Pods, you must create the Service *before* the client Pods come into existence.
Otherwise, those client Pods won't have their environment variables populated.

If you only use DNS to discover the cluster IP for a Service, you don't need to
worry about this ordering issue.
-->
{{< note >}}
當你具有需要訪問服務的 Pod 時，並且你正在使用環境變數方法將埠和叢集 IP 釋出到客戶端
Pod 時，必須在客戶端 Pod 出現 *之前* 建立服務。
否則，這些客戶端 Pod 將不會設定其環境變數。

如果僅使用 DNS 查詢服務的叢集 IP，則無需擔心此設定問題。
{{< /note >}}

### DNS

<!--
You can (and almost always should) set up a DNS service for your Kubernetes
cluster using an [add-on](/docs/concepts/cluster-administration/addons/).

A cluster-aware DNS server, such as CoreDNS, watches the Kubernetes API for new
Services and creates a set of DNS records for each one.  If DNS has been enabled
throughout your cluster then all Pods should automatically be able to resolve
Services by their DNS name.
-->
你可以（幾乎總是應該）使用[附加元件](/zh-cn/docs/concepts/cluster-administration/addons/)
為 Kubernetes 叢集設定 DNS 服務。

支援叢集的 DNS 伺服器（例如 CoreDNS）監視 Kubernetes API 中的新服務，併為每個服務建立一組 DNS 記錄。
如果在整個叢集中都啟用了 DNS，則所有 Pod 都應該能夠透過其 DNS 名稱自動解析服務。

<!--
For example, if you have a Service called `my-service` in a Kubernetes
namespace `my-ns`, the control plane and the DNS Service acting together
create a DNS record for `my-service.my-ns`. Pods in the `my-ns` namespace
should be able to find the service by doing a name lookup for `my-service`
(`my-service.my-ns` would also work).

Pods in other Namespaces must qualify the name as `my-service.my-ns`. These names
will resolve to the cluster IP assigned for the Service.
-->
例如，如果你在 Kubernetes 名稱空間 `my-ns` 中有一個名為 `my-service` 的服務，
則控制平面和 DNS 服務共同為 `my-service.my-ns` 建立 DNS 記錄。
`my-ns` 名稱空間中的 Pod 應該能夠透過按名檢索 `my-service` 來找到服務
（`my-service.my-ns` 也可以工作）。

其他名稱空間中的 Pod 必須將名稱限定為 `my-service.my-ns`。
這些名稱將解析為為服務分配的叢集 IP。

<!--
Kubernetes also supports DNS SRV (Service) records for named ports.  If the
`my-service.my-ns` Service has a port named `http` with the protocol set to
`TCP`, you can do a DNS SRV query for `_http._tcp.my-service.my-ns` to discover
the port number for `http`, as well as the IP address.

The Kubernetes DNS server is the only way to access `ExternalName` Services.
You can find more information about `ExternalName` resolution in
[DNS Pods and Services](/docs/concepts/services-networking/dns-pod-service/).
-->
Kubernetes 還支援命名埠的 DNS SRV（服務）記錄。
如果 `my-service.my-ns` 服務具有名為 `http` 的埠，且協議設定為 TCP，
則可以對 `_http._tcp.my-service.my-ns` 執行 DNS SRV 查詢查詢以發現該埠號, 
`"http"` 以及 IP 地址。

Kubernetes DNS 伺服器是唯一的一種能夠訪問 `ExternalName` 型別的 Service 的方式。
更多關於 `ExternalName` 資訊可以檢視
[DNS Pod 和 Service](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。

<!--
## Headless Services  {#headless-services}

Sometimes you don't need load-balancing and a single Service IP.  In
this case, you can create what are termed "headless" Services, by explicitly
specifying `"None"` for the cluster IP (`.spec.clusterIP`).

You can use a headless Service to interface with other service discovery mechanisms,
without being tied to Kubernetes' implementation.

For headless `Services`, a cluster IP is not allocated, kube-proxy does not handle
these Services, and there is no load balancing or proxying done by the platform
for them. How DNS is automatically configured depends on whether the Service has
selectors defined:
-->
## 無頭服務（Headless Services）  {#headless-services}

有時不需要或不想要負載均衡，以及單獨的 Service IP。
遇到這種情況，可以透過指定 Cluster IP（`spec.clusterIP`）的值為 `"None"`
來建立 `Headless` Service。

你可以使用無頭 Service 與其他服務發現機制進行介面，而不必與 Kubernetes
的實現捆綁在一起。

對這無頭 Service 並不會分配 Cluster IP，kube-proxy 不會處理它們，
而且平臺也不會為它們進行負載均衡和路由。
DNS 如何實現自動配置，依賴於 Service 是否定義了選擇算符。

<!--
### With selectors

For headless Services that define selectors, the endpoints controller creates
`Endpoints` records in the API, and modifies the DNS configuration to return
A records (IP addresses) that point directly to the `Pods` backing the `Service`.
-->
### 帶選擇算符的服務 {#with-selectors}

對定義了選擇算符的無頭服務，Endpoint 控制器在 API 中建立了 Endpoints 記錄，
並且修改 DNS 配置返回 A 記錄（IP 地址），透過這個地址直接到達 `Service` 的後端 Pod 上。

<!--
### Without selectors

For headless Services that do not define selectors, the endpoints controller does
not create `Endpoints` records. However, the DNS system looks for and configures
either:

* CNAME records for [`ExternalName`](#externalname)-type Services.
* A records for any `Endpoints` that share a name with the Service, for all
  other types.
-->
### 無選擇算符的服務  {#without-selectors}

對沒有定義選擇算符的無頭服務，Endpoint 控制器不會建立 `Endpoints` 記錄。
然而 DNS 系統會查詢和配置，無論是：

* 對於 [`ExternalName`](#external-name) 型別的服務，查詢其 CNAME 記錄
* 對所有其他型別的服務，查詢與 Service 名稱相同的任何 `Endpoints` 的記錄

<!--
## Publishing Services (ServiceTypes) {#publishing-services-service-types}

For some parts of your application (for example, frontends) you may want to expose a
Service onto an external IP address, that's outside of your cluster.

Kubernetes `ServiceTypes` allow you to specify what kind of Service you want.
The default is `ClusterIP`.

`Type` values and their behaviors are:
-->
## 釋出服務（服務型別)      {#publishing-services-service-types}

對一些應用的某些部分（如前端），可能希望將其暴露給 Kubernetes 叢集外部
的 IP 地址。

Kubernetes `ServiceTypes` 允許指定你所需要的 Service 型別，預設是 `ClusterIP`。

`Type` 的取值以及行為如下：

<!--
* `ClusterIP`: Exposes the Service on a cluster-internal IP. Choosing this value
  makes the Service only reachable from within the cluster. This is the
  default `ServiceType`.
* [`NodePort`](#type-nodeport): Exposes the Service on each Node's IP at a static port
  (the `NodePort`). A `ClusterIP` Service, to which the `NodePort` Service
  routes, is automatically created.  You'll be able to contact the `NodePort` Service,
  from outside the cluster,
  by requesting `<NodeIP>:<NodePort>`.
* [`LoadBalancer`](#loadbalancer): Exposes the Service externally using a cloud
  provider's load balancer. `NodePort` and `ClusterIP` Services, to which the external
  load balancer routes, are automatically created.
* [`ExternalName`](#externalname): Maps the Service to the contents of the
  `externalName` field (e.g. `foo.bar.example.com`), by returning a `CNAME` record
  with its value. No proxying of any kind is set up.
  {{< note >}}
  You need either kube-dns version 1.7 or CoreDNS version 0.0.8 or higher to use the `ExternalName` type.
  {{< /note >}}
-->
* `ClusterIP`：透過叢集的內部 IP 暴露服務，選擇該值時服務只能夠在叢集內部訪問。
  這也是預設的 `ServiceType`。
* [`NodePort`](#type-nodeport)：透過每個節點上的 IP 和靜態埠（`NodePort`）暴露服務。
  `NodePort` 服務會路由到自動建立的 `ClusterIP` 服務。
  透過請求 `<節點 IP>:<節點埠>`，你可以從叢集的外部訪問一個 `NodePort` 服務。
* [`LoadBalancer`](#loadbalancer)：使用雲提供商的負載均衡器向外部暴露服務。
  外部負載均衡器可以將流量路由到自動建立的 `NodePort` 服務和 `ClusterIP` 服務上。
* [`ExternalName`](#externalname)：透過返回 `CNAME` 和對應值，可以將服務對映到
  `externalName` 欄位的內容（例如，`foo.bar.example.com`）。
  無需建立任何型別代理。

  {{< note >}}
  你需要使用 kube-dns 1.7 及以上版本或者 CoreDNS 0.0.8 及以上版本才能使用 `ExternalName` 型別。
  {{< /note >}}

<!--
You can also use [Ingress](/docs/concepts/services-networking/ingress/) to expose your Service. Ingress is not a Service type, but it acts as the entry point for your cluster. It lets you consolidate your routing rules into a single resource as it can expose multiple services under the same IP address.
-->
你也可以使用 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 來暴露自己的服務。
Ingress 不是一種服務型別，但它充當叢集的入口點。
它可以將路由規則整合到一個資源中，因為它可以在同一IP地址下公開多個服務。

<!--
### Type NodePort {#type-nodeport}

If you set the `type` field to `NodePort`, the Kubernetes control plane
allocates a port from a range specified by `--service-node-port-range` flag (default: 30000-32767).
Each node proxies that port (the same port number on every Node) into your Service.
Your Service reports the allocated port in its `.spec.ports[*].nodePort` field.

If you want to specify particular IP(s) to proxy the port, you can set the
`--nodeport-addresses` flag for kube-proxy or the equivalent `nodePortAddresses`
field of the
[kube-proxy configuration file](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
to particular IP block(s).

This flag takes a comma-delimited list of IP blocks (e.g. `10.0.0.0/8`, `192.0.2.0/25`) to specify IP address ranges that kube-proxy should consider as local to this node.
-->
### NodePort 型別  {#type-nodeport}

如果你將 `type` 欄位設定為 `NodePort`，則 Kubernetes 控制平面將在
`--service-node-port-range` 標誌指定的範圍內分配埠（預設值：30000-32767）。
每個節點將那個埠（每個節點上的相同埠號）代理到你的服務中。
你的服務在其 `.spec.ports[*].nodePort` 欄位中要求分配的埠。

如果你想指定特定的 IP 代理埠，則可以設定 kube-proxy 中的 `--nodeport-addresses` 引數
或者將[kube-proxy 配置檔案](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
中的等效 `nodePortAddresses` 欄位設定為特定的 IP 塊。
該標誌採用逗號分隔的 IP 塊列表（例如，`10.0.0.0/8`、`192.0.2.0/25`）來指定
kube-proxy 應該認為是此節點本地的 IP 地址範圍。

<!--
For example, if you start kube-proxy with the `--nodeport-addresses=127.0.0.0/8` flag, kube-proxy only selects the loopback interface for NodePort Services. The default for `--nodeport-addresses` is an empty list. This means that kube-proxy should consider all available network interfaces for NodePort. (That's also compatible with earlier Kubernetes releases).

If you want a specific port number, you can specify a value in the `nodePort`
field. The control plane will either allocate you that port or report that
the API transaction failed.
This means that you need to take care of possible port collisions yourself.
You also have to use a valid port number, one that's inside the range configured
for NodePort use.
-->
例如，如果你使用 `--nodeport-addresses=127.0.0.0/8` 標誌啟動 kube-proxy，
則 kube-proxy 僅選擇 NodePort Services 的本地迴路介面。
`--nodeport-addresses` 的預設值是一個空列表。
這意味著 kube-proxy 應該考慮 NodePort 的所有可用網路介面。
（這也與早期的 Kubernetes 版本相容）。

如果需要特定的埠號，你可以在 `nodePort` 欄位中指定一個值。
控制平面將為你分配該埠或報告 API 事務失敗。
這意味著你需要自己注意可能發生的埠衝突。
你還必須使用有效的埠號，該埠號在配置用於 NodePort 的範圍內。

<!--
Using a NodePort gives you the freedom to set up your own load balancing solution,
to configure environments that are not fully supported by Kubernetes, or even
to expose one or more nodes' IPs directly.

Note that this Service is visible as `<NodeIP>:spec.ports[*].nodePort`
and `.spec.clusterIP:spec.ports[*].port`.
If the `--nodeport-addresses` flag for kube-proxy or the equivalent field
in the kube-proxy configuration file is set, `<NodeIP>` would be filtered node IP(s).

For example:
-->
使用 NodePort 可以讓你自由設定自己的負載均衡解決方案，
配置 Kubernetes 不完全支援的環境，
甚至直接暴露一個或多個節點的 IP。

需要注意的是，Service 能夠透過 `<NodeIP>:spec.ports[*].nodePort` 和
`spec.clusterIp:spec.ports[*].port` 而對外可見。
如果設定了 kube-proxy 的 `--nodeport-addresses` 引數或 kube-proxy 配置檔案中的等效欄位，
 `<NodeIP>` 將被過濾 NodeIP。

例如：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app: MyApp
  ports:
      # 預設情況下，為了方便起見，`targetPort` 被設定為與 `port` 欄位相同的值。
    - port: 80
      targetPort: 80
      # 可選欄位
      # 預設情況下，為了方便起見，Kubernetes 控制平面會從某個範圍內分配一個埠號（預設：30000-32767）
      nodePort: 30007
```

<!--
### Type LoadBalancer {#loadbalancer}

On cloud providers which support external load balancers, setting the `type`
field to `LoadBalancer` provisions a load balancer for your Service.
The actual creation of the load balancer happens asynchronously, and
information about the provisioned balancer is published in the Service's
`.status.loadBalancer` field.
For example:
-->
### LoadBalancer 型別  {#loadbalancer}

在使用支援外部負載均衡器的雲提供商的服務時，設定 `type` 的值為 `"LoadBalancer"`，
將為 Service 提供負載均衡器。
負載均衡器是非同步建立的，關於被提供的負載均衡器的資訊將會透過 Service 的
`status.loadBalancer` 欄位釋出出去。

例項：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
      - ip: 192.0.2.127
```

<!--
Traffic from the external load balancer is directed at the backend Pods. The cloud provider decides how it is load balanced.
-->
來自外部負載均衡器的流量將直接重定向到後端 Pod 上，不過實際它們是如何工作的，這要依賴於雲提供商。

<!--
Some cloud providers allow you to specify the `loadBalancerIP`. In those cases, the load-balancer is created
with the user-specified `loadBalancerIP`. If the `loadBalancerIP` field is not specified,
the loadBalancer is set up with an ephemeral IP address. If you specify a `loadBalancerIP`
but your cloud provider does not support the feature, the `loadbalancerIP` field that you
set is ignored.
-->
某些雲提供商允許設定 `loadBalancerIP`。
在這些情況下，將根據使用者設定的 `loadBalancerIP` 來建立負載均衡器。
如果沒有設定 `loadBalancerIP` 欄位，將會給負載均衡器指派一個臨時 IP。
如果設定了 `loadBalancerIP`，但云提供商並不支援這種特性，那麼設定的
`loadBalancerIP` 值將會被忽略掉。


<!--
On **Azure**, if you want to use a user-specified public type `loadBalancerIP`, you first need
to create a static type public IP address resource. This public IP address resource should
be in the same resource group of the other automatically created resources of the cluster.
For example, `MC_myResourceGroup_myAKSCluster_eastus`.

Specify the assigned IP address as loadBalancerIP. Ensure that you have updated the securityGroupName in the cloud provider configuration file. For information about troubleshooting `CreatingLoadBalancerFailed` permission issues see, [Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](https://docs.microsoft.com/en-us/azure/aks/static-ip) or [CreatingLoadBalancerFailed on AKS cluster with advanced networking](https://github.com/Azure/AKS/issues/357).
-->
{{< note >}}
在 **Azure** 上，如果要使用使用者指定的公共型別 `loadBalancerIP`，則
首先需要建立靜態型別的公共 IP 地址資源。
此公共 IP 地址資源應與叢集中其他自動建立的資源位於同一資源組中。
例如，`MC_myResourceGroup_myAKSCluster_eastus`。

將分配的 IP 地址設定為 loadBalancerIP。確保你已更新雲提供程式配置檔案中的
securityGroupName。
有關對 `CreatingLoadBalancerFailed` 許可權問題進行故障排除的資訊，
請參閱 [與 Azure Kubernetes 服務（AKS）負載平衡器一起使用靜態 IP 地址](https://docs.microsoft.com/en-us/azure/aks/static-ip)
或[在 AKS 叢集上使用高階聯網時出現 CreatingLoadBalancerFailed](https://github.com/Azure/AKS/issues/357)。
{{< /note >}}
<!--
#### Load balancers with mixed protocol types

{{< feature-state for_k8s_version="v1.24" state="beta" >}}

By default, for LoadBalancer type of Services, when there is more than one port defined, all
ports must have the same protocol, and the protocol must be one which is supported
by the cloud provider.

The feature gate `MixedProtocolLBService` (enabled by default for the kube-apiserver as of v1.24) allows the use of
different protocols for LoadBalancer type of Services, when there is more than one port defined.

-->
#### 混合協議型別的負載均衡器

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

預設情況下，對於 LoadBalancer 型別的服務，當定義了多個埠時，所有
埠必須具有相同的協議，並且該協議必須是受雲提供商支援的協議。

當服務中定義了多個埠時，特性門控 `MixedProtocolLBService`（在 kube-apiserver 1.24 版本預設為啟用）允許
LoadBalancer 型別的服務使用不同的協議。

<!--
The set of protocols that can be used for LoadBalancer type of Services is still defined by the cloud provider. If a
cloud provider does not support mixed protocols they will provide only a single protocol.
-->
{{< note >}}
可用於 LoadBalancer 型別服務的協議集仍然由雲提供商決定。
如果雲提供商不支援混合協議，他們將只提供單一協議。
{{< /note >}}

<!--
#### Disabling load balancer NodePort allocation {#load-balancer-nodeport-allocation}
-->
### 禁用負載均衡器節點埠分配 {#load-balancer-nodeport-allocation}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
Starting in v1.20, you can optionally disable node port allocation for a Service Type=LoadBalancer by setting
the field `spec.allocateLoadBalancerNodePorts` to `false`. This should only be used for load balancer implementations
that route traffic directly to pods as opposed to using node ports. By default, `spec.allocateLoadBalancerNodePorts`
is `true` and type LoadBalancer Services will continue to allocate node ports. If `spec.allocateLoadBalancerNodePorts`
is set to `false` on an existing Service with allocated node ports, those node ports will **not** be de-allocated automatically.
You must explicitly remove the `nodePorts` entry in every Service port to de-allocate those node ports.
-->
你可以透過設定 `spec.allocateLoadBalancerNodePorts` 為 `false` 
對型別為 LoadBalancer 的服務禁用節點埠分配。
這僅適用於直接將流量路由到 Pod 而不是使用節點埠的負載均衡器實現。
預設情況下，`spec.allocateLoadBalancerNodePorts` 為 `true`，
LoadBalancer 型別的服務繼續分配節點埠。
如果現有服務已被分配節點埠，將引數 `spec.allocateLoadBalancerNodePorts`
設定為 `false` 時，這些服務上已分配置的節點埠**不會**被自動釋放。
你必須顯式地在每個服務埠中刪除 `nodePorts` 項以釋放對應埠。

<!--
#### Specifying class of load balancer implementation {#load-balancer-class}
-->
#### 設定負載均衡器實現的類別 {#load-balancer-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
`spec.loadBalancerClass` enables you to use a load balancer implementation other than the cloud provider default.
By default, `spec.loadBalancerClass` is `nil` and a `LoadBalancer` type of Service uses
the cloud provider's default load balancer implementation if the cluster is configured with
a cloud provider using the `--cloud-provider` component flag. 
If `spec.loadBalancerClass` is specified, it is assumed that a load balancer
implementation that matches the specified class is watching for Services.
Any default load balancer implementation (for example, the one provided by
the cloud provider) will ignore Services that have this field set.
`spec.loadBalancerClass` can be set on a Service of type `LoadBalancer` only.
Once set, it cannot be changed. 
-->
`spec.loadBalancerClass` 允許你不使用雲提供商的預設負載均衡器實現，轉而使用指定的負載均衡器實現。
預設情況下，`.spec.loadBalancerClass` 的取值是 `nil`，如果叢集使用 `--cloud-provider` 配置了雲提供商，
`LoadBalancer` 型別服務會使用雲提供商的預設負載均衡器實現。
如果設定了 `.spec.loadBalancerClass`，則假定存在某個與所指定的類相匹配的
負載均衡器實現在監視服務變化。
所有預設的負載均衡器實現（例如，由雲提供商所提供的）都會忽略設定了此欄位
的服務。`.spec.loadBalancerClass` 只能設定到型別為 `LoadBalancer` 的 Service
之上，而且一旦設定之後不可變更。

<!--
The value of `spec.loadBalancerClass` must be a label-style identifier,
with an optional prefix such as "`internal-vip`" or "`example.com/internal-vip`".
Unprefixed names are reserved for end-users.
-->
`.spec.loadBalancerClass` 的值必須是一個標籤風格的識別符號，
可以有選擇地帶有類似 "`internal-vip`" 或 "`example.com/internal-vip`" 這類
字首。沒有字首的名字是保留給終端使用者的。

<!--
#### Internal load balancer

In a mixed environment it is sometimes necessary to route traffic from Services inside the same
(virtual) network address block.

In a split-horizon DNS environment you would need two Services to be able to route both external and internal traffic to your endpoints.

To set an internal load balancer, add one of the following annotations to your Service
depending on the cloud Service provider you're using.
-->
#### 內部負載均衡器 {#internal-load-balancer}

在混合環境中，有時有必要在同一(虛擬)網路地址塊內路由來自服務的流量。

在水平分割 DNS 環境中，你需要兩個服務才能將內部和外部流量都路由到你的端點（Endpoints）。

如要設定內部負載均衡器，請根據你所使用的雲運營商，為服務新增以下註解之一。

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
<!--
Select one of the tabs.
-->
選擇一個標籤
{{% /tab %}}
{{% tab name="GCP" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        cloud.google.com/load-balancer-type: "Internal"
[...]
```

{{% /tab %}}
{{% tab name="AWS" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/aws-load-balancer-internal: "true"
[...]
```

{{% /tab %}}
{{% tab name="Azure" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
[...]
```

{{% /tab %}}
{{% tab name="IBM Cloud" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.kubernetes.io/ibm-load-balancer-cloud-provider-ip-type: "private"
[...]
```

{{% /tab %}}
{{% tab name="OpenStack" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
[...]
```

{{% /tab %}}
{{% tab name="Baidu Cloud" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
[...]
```

{{% /tab %}}
{{% tab name="Tencent Cloud" %}}

```yaml
[...]
metadata:
  annotations:
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
[...]
```

{{% /tab %}}
{{% tab name="Alibaba Cloud" %}}

```yaml
[...]
metadata:
  annotations:
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-address-type: "intranet"
[...]
```

{{% /tab %}}
{{< /tabs >}}

<!--
#### TLS support on AWS {#ssl-support-on-aws}

For partial TLS / SSL support on clusters running on AWS, you can add three
annotations to a `LoadBalancer` service:
-->
### AWS TLS 支援 {#ssl-support-on-aws}

為了對在 AWS 上執行的叢集提供 TLS/SSL 部分支援，你可以向 `LoadBalancer`
服務新增三個註解：

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

<!--
The first specifies the ARN of the certificate to use. It can be either a
certificate from a third party issuer that was uploaded to IAM or one created
within AWS Certificate Manager.
-->
第一個指定要使用的證書的 ARN。 它可以是已上載到 IAM 的第三方頒發者的證書，
也可以是在 AWS Certificate Manager 中建立的證書。

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: (https|http|ssl|tcp)
```

<!--
The second annotation specifies which protocol a Pod speaks. For HTTPS and
SSL, the ELB expects the Pod to authenticate itself over the encrypted
connection, using a certificate.

HTTP and HTTPS selects layer 7 proxying: the ELB terminates
the connection with the user, parses headers, and injects the `X-Forwarded-For`
header with the user's IP address (Pods only see the IP address of the
ELB at the other end of its connection) when forwarding requests.

TCP and SSL selects layer 4 proxying: the ELB forwards traffic without
modifying the headers.

In a mixed-use environment where some ports are secured and others are left unencrypted,
you can use the following annotations:
-->
第二個註解指定 Pod 使用哪種協議。 對於 HTTPS 和 SSL，ELB 希望 Pod 使用證書
透過加密連線對自己進行身份驗證。

HTTP 和 HTTPS 選擇第7層代理：ELB 終止與使用者的連線，解析標頭，並在轉發請求時向
`X-Forwarded-For` 標頭注入使用者的 IP 地址（Pod 僅在連線的另一端看到 ELB 的 IP 地址）。

TCP 和 SSL 選擇第4層代理：ELB 轉發流量而不修改報頭。

在某些埠處於安全狀態而其他埠未加密的混合使用環境中，可以使用以下註解：

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
        service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443,8443"
```

<!--
In the above example, if the Service contained three ports, `80`, `443`, and
`8443`, then `443` and `8443` would use the SSL certificate, but `80` would be proxied HTTP.

From Kubernetes v1.9 onwards you can use [predefined AWS SSL policies](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html) with HTTPS or SSL listeners for your Services.
To see which policies are available for use, you can use the `aws` command line tool:
-->
在上例中，如果服務包含 `80`、`443` 和 `8443` 三個埠， 那麼 `443` 和 `8443` 將使用 SSL 證書，
而 `80` 埠將轉發 HTTP 資料包。

從 Kubernetes v1.9 起可以使用
[預定義的 AWS SSL 策略](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html)
為你的服務使用 HTTPS 或 SSL 偵聽器。
要檢視可以使用哪些策略，可以使用 `aws` 命令列工具：

```bash
aws elb describe-load-balancer-policies --query 'PolicyDescriptions[].PolicyName'
```

<!--
You can then specify any one of those policies using the
"`service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy`"
annotation; for example:
-->
然後，你可以使用 "`service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy`"
註解; 例如：

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: "ELBSecurityPolicy-TLS-1-2-2017-01"
```

<!--
#### PROXY protocol support on AWS

To enable [PROXY protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)
support for clusters running on AWS, you can use the following service
annotation:
-->
#### AWS 上的 PROXY 協議支援

為了支援在 AWS 上執行的叢集，啟用
[PROXY 協議](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)。
你可以使用以下服務註解：

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"
```

<!--
Since version 1.3.0, the use of this annotation applies to all ports proxied by the ELB
and cannot be configured otherwise.
-->
從 1.3.0 版開始，此註解的使用適用於 ELB 代理的所有埠，並且不能進行其他配置。
<!--
#### ELB Access Logs on AWS

There are several annotations to manage access logs for ELB Services on AWS.

The annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`
controls whether access logs are enabled.

The annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`
controls the interval in minutes for publishing the access logs. You can specify
an interval of either 5 or 60 minutes.

The annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`
controls the name of the Amazon S3 bucket where load balancer access logs are
stored.

The annotation `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`
specifies the logical hierarchy you created for your Amazon S3 bucket.
-->
#### AWS 上的 ELB 訪問日誌

有幾個註解可用於管理 AWS 上 ELB 服務的訪問日誌。

註解 `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled` 控制是否啟用訪問日誌。

註解 `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval` 
控制釋出訪問日誌的時間間隔（以分鐘為單位）。你可以指定 5 分鐘或 60 分鐘的間隔。

註解 `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name` 
控制儲存負載均衡器訪問日誌的 Amazon S3 儲存桶的名稱。

註解 `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`
指定為 Amazon S3 儲存桶建立的邏輯層次結構。

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "true"
        # 指定是否為負載均衡器啟用訪問日誌
        service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval: "60"
        # 釋出訪問日誌的時間間隔。你可以將其設定為 5 分鐘或 60 分鐘。
        service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name: "my-bucket"
        # 用來存放訪問日誌的 Amazon S3 Bucket 名稱
        service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix: "my-bucket-prefix/prod"
        # 你為 Amazon S3 Bucket 所建立的邏輯層次結構，例如 `my-bucket-prefix/prod`
```

<!--
#### Connection Draining on AWS

Connection draining for Classic ELBs can be managed with the annotation
`service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled` set
to the value of `"true"`. The annotation
`service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout` can
also be used to set maximum time, in seconds, to keep the existing connections open before deregistering the instances.
-->
#### AWS 上的連線排空

可以將註解 `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled`
設定為 `"true"` 來管理 ELB 的連線排空。
註解 `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout`
也可以用於設定最大時間（以秒為單位），以保持現有連線在登出例項之前保持開啟狀態。

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "true"
        service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"
```

<!--
#### Other ELB annotations

There are other annotations to manage Classic Elastic Load Balancers that are described below.
-->
#### 其他 ELB 註解

還有其他一些註解，用於管理經典彈性負載均衡器，如下所述。

```yaml
    metadata:
      name: my-service
      annotations:
        # 按秒計的時間，表示負載均衡器關閉連線之前連線可以保持空閒
        # （連線上無資料傳輸）的時間長度
        service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "60"

        # 指定該負載均衡器上是否啟用跨區的負載均衡能力
        service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"

        # 逗號分隔列表值，每一項都是一個鍵-值耦對，會作為額外的標籤記錄於 ELB 中
        service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "environment=prod,owner=devops"

        # 將某後端視為健康、可接收請求之前需要達到的連續成功健康檢查次數。
        # 預設為 2，必須介於 2 和 10 之間
        service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold: ""

        # 將某後端視為不健康、不可接收請求之前需要達到的連續不成功健康檢查次數。
        # 預設為 6，必須介於 2 和 10 之間
        service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold: "3"

        # 對每個例項進行健康檢查時，連續兩次檢查之間的大致間隔秒數
        # 預設為 10，必須介於 5 和 300 之間
        service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "20"

        # 時長秒數，在此期間沒有響應意味著健康檢查失敗
        # 此值必須小於 service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval
        # 預設值為 5，必須介於 2 和 60 之間
        service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout: "5"

        # 由已有的安全組所構成的列表，可以配置到所建立的 ELB 之上。
        # 與註解 service.beta.kubernetes.io/aws-load-balancer-extra-security-groups 不同，
        # 這一設定會替代掉之前指定給該 ELB 的所有其他安全組，也會覆蓋掉為此
        # ELB 所唯一建立的安全組。 
        # 此列表中的第一個安全組 ID 被用來作為決策源，以允許入站流量流入目標工作節點
        # (包括服務流量和健康檢查）。
        # 如果多個 ELB 配置了相同的安全組 ID，為工作節點安全組新增的允許規則行只有一個，
        # 這意味著如果你刪除了這些 ELB 中的任何一個，都會導致該規則記錄被刪除，
        # 以至於所有共享該安全組 ID 的其他 ELB 都無法訪問該節點。
        # 此註解如果使用不當，會導致跨服務的不可用狀況。
        service.beta.kubernetes.io/aws-load-balancer-security-groups: "sg-53fae93f"

        # 額外的安全組列表，將被新增到所建立的 ELB 之上。
        # 新增時，會保留為 ELB 所專門建立的安全組。
        # 這樣會確保每個 ELB 都有一個唯一的安全組 ID 和與之對應的允許規則記錄，
        # 允許請求（服務流量和健康檢查）傳送到目標工作節點。
        # 這裡頂一個安全組可以被多個服務共享。
        service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-53fae93f,sg-42efd82e"

        # 用逗號分隔的一個鍵-值偶對列表，用來為負載均衡器選擇目標節點
        service.beta.kubernetes.io/aws-load-balancer-target-node-labels: "ingress-gw,gw-name=public-api"
```

<!--
#### Network Load Balancer support on AWS {#aws-nlb-support}
-->
#### AWS 上網路負載均衡器支援 {#aws-nlb-support}

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

<!--
To use a Network Load Balancer on AWS, use the annotation `service.beta.kubernetes.io/aws-load-balancer-type` with the value set to `nlb`.
-->
要在 AWS 上使用網路負載均衡器，可以使用註解
`service.beta.kubernetes.io/aws-load-balancer-type`，將其取值設為 `nlb`。

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
```

<!--
NLB only works with certain instance classes; see the [AWS documentation](http://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-register-targets.html#register-deregister-targets)
on Elastic Load Balancing for a list of supported instance types.
-->
{{< note >}}
NLB 僅適用於某些例項類。有關受支援的例項型別的列表，
請參見
[AWS文件](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-register-targets.html#register-deregister-targets)
中關於所支援的例項型別的 Elastic Load Balancing 說明。
{{< /note >}}

<!--
Unlike Classic Elastic Load Balancers, Network Load Balancers (NLBs) forward the
client's IP address through to the node. If a Service's `.spec.externalTrafficPolicy`
is set to `Cluster`, the client's IP address is not propagated to the end
Pods.

By setting `.spec.externalTrafficPolicy` to `Local`, the client IP addresses is
propagated to the end Pods, but this could result in uneven distribution of
traffic. Nodes without any Pods for a particular LoadBalancer Service will fail
the NLB Target Group's health check on the auto-assigned
`.spec.healthCheckNodePort` and not receive any traffic.
-->
與經典彈性負載平衡器不同，網路負載平衡器（NLB）將客戶端的 IP 地址轉發到該節點。
如果服務的 `.spec.externalTrafficPolicy` 設定為 `Cluster` ，則客戶端的IP地址不會傳達到最終的 Pod。

透過將 `.spec.externalTrafficPolicy` 設定為 `Local`，客戶端IP地址將傳播到最終的 Pod，
但這可能導致流量分配不均。
沒有針對特定 LoadBalancer 服務的任何 Pod 的節點將無法透過自動分配的
`.spec.healthCheckNodePort` 進行 NLB 目標組的執行狀況檢查，並且不會收到任何流量。

<!--
In order to achieve even traffic, either use a DaemonSet, or specify a
[pod anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
to not locate on the same node.

You can also use NLB Services with the [internal load balancer](/docs/concepts/services-networking/service/#internal-load-balancer)
annotation.

In order for client traffic to reach instances behind an NLB, the Node security
groups are modified with the following IP rules:
-->

為了獲得均衡流量，請使用 DaemonSet 或指定
[Pod 反親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
使其不在同一節點上。

你還可以將 NLB 服務與[內部負載平衡器](/zh-cn/docs/concepts/services-networking/service/#internal-load-balancer)
註解一起使用。

為了使客戶端流量能夠到達 NLB 後面的例項，使用以下 IP 規則修改了節點安全組：

| Rule | Protocol | Port(s) | IpRange(s) | IpRange Description |
|------|----------|---------|------------|---------------------|
| Health Check | TCP | NodePort(s) (`.spec.healthCheckNodePort` for `.spec.externalTrafficPolicy = Local`) | Subnet CIDR | kubernetes.io/rule/nlb/health=\<loadBalancerName\> |
| Client Traffic | TCP | NodePort(s) | `.spec.loadBalancerSourceRanges` (defaults to `0.0.0.0/0`) | kubernetes.io/rule/nlb/client=\<loadBalancerName\> |
| MTU Discovery | ICMP | 3,4 | `.spec.loadBalancerSourceRanges` (defaults to `0.0.0.0/0`) | kubernetes.io/rule/nlb/mtu=\<loadBalancerName\> |

<!--
In order to limit which client IP's can access the Network Load Balancer,
specify `loadBalancerSourceRanges`.
-->
為了限制哪些客戶端IP可以訪問網路負載平衡器，請指定 `loadBalancerSourceRanges`。

```yaml
spec:
  loadBalancerSourceRanges:
    - "143.231.0.0/16"
```

<!--
If `.spec.loadBalancerSourceRanges` is not set, Kubernetes
allows traffic from `0.0.0.0/0` to the Node Security Group(s). If nodes have
public IP addresses, be aware that non-NLB traffic can also reach all instances
in those modified security groups.
-->
{{< note >}}
如果未設定 `.spec.loadBalancerSourceRanges` ，則 Kubernetes 允許從 `0.0.0.0/0` 到節點安全組的流量。
如果節點具有公共 IP 地址，請注意，非 NLB 流量也可以到達那些修改後的安全組中的所有例項。
{{< /note >}}

<!--
Further documentation on annotations for Elastic IPs and other common use-cases may be found
in the [AWS Load Balancer Controller documentation](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/).
-->
有關彈性 IP 註解和更多其他常見用例，
請參閱[AWS負載均衡控制器文件](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)。

<!--
#### Other CLB annotations on Tencent Kubernetes Engine (TKE)

There are other annotations for managing Cloud Load Balancers on TKE as shown below.

```yaml
    metadata:
      name: my-service
      annotations:
        # Bind Loadbalancers with specified nodes
        service.kubernetes.io/qcloud-loadbalancer-backends-label: key in (value1, value2)

        # ID of an existing load balancer
        service.kubernetes.io/tke-existed-lbid：lb-6swtxxxx

        # Custom parameters for the load balancer (LB), does not support modification of LB type yet
        service.kubernetes.io/service.extensiveParameters: ""

        # Custom parameters for the LB listener
        service.kubernetes.io/service.listenerParameters: ""

        # Specifies the type of Load balancer;
        # valid values: classic (Classic Cloud Load Balancer) or application (Application Cloud Load Balancer)
        service.kubernetes.io/loadbalance-type: xxxxx

        # Specifies the public network bandwidth billing method;
        # valid values: TRAFFIC_POSTPAID_BY_HOUR(bill-by-traffic) and BANDWIDTH_POSTPAID_BY_HOUR (bill-by-bandwidth).
        service.kubernetes.io/qcloud-loadbalancer-internet-charge-type: xxxxxx

        # Specifies the bandwidth value (value range: [1,2000] Mbps).
        service.kubernetes.io/qcloud-loadbalancer-internet-max-bandwidth-out: "10"

        # When this annotation is set，the loadbalancers will only register nodes
        # with pod running on it, otherwise all nodes will be registered.
        service.kubernetes.io/local-svc-only-bind-node-with-pod: true
```
-->
#### 騰訊 Kubernetes 引擎（TKE）上的 CLB 註解

以下是在 TKE 上管理雲負載均衡器的註解。

```yaml
    metadata:
      name: my-service
      annotations:
        # 繫結負載均衡器到指定的節點。
        service.kubernetes.io/qcloud-loadbalancer-backends-label: key in (value1, value2)

        # 為已有負載均衡器新增 ID。
        service.kubernetes.io/tke-existed-lbid：lb-6swtxxxx

        # 負載均衡器（LB）的自定義引數尚不支援修改 LB 型別。
        service.kubernetes.io/service.extensiveParameters: ""

        # 自定義負載均衡監聽器。
        service.kubernetes.io/service.listenerParameters: ""

        # 指定負載均衡型別。
        # 可用引數: classic (Classic Cloud Load Balancer) 或 application (Application Cloud Load Balancer)
        service.kubernetes.io/loadbalance-type: xxxxx

        # 指定公用網路頻寬計費方法。
        # 可用引數: TRAFFIC_POSTPAID_BY_HOUR(bill-by-traffic) 和 BANDWIDTH_POSTPAID_BY_HOUR (bill-by-bandwidth).
        service.kubernetes.io/qcloud-loadbalancer-internet-charge-type: xxxxxx

        # 指定頻寬引數 (取值範圍： [1,2000] Mbps).
        service.kubernetes.io/qcloud-loadbalancer-internet-max-bandwidth-out: "10"

        # 當設定該註解時，負載平衡器將只註冊正在執行 Pod 的節點，
        # 否則所有節點將會被註冊。
        service.kubernetes.io/local-svc-only-bind-node-with-pod: true
```
<!--
### Type ExternalName {#externalname}

Services of type ExternalName map a Service to a DNS name, not to a typical selector such as
`my-service` or `cassandra`. You specify these Services with the `spec.externalName` parameter.

This Service definition, for example, maps
the `my-service` Service in the `prod` namespace to `my.database.example.com`:
-->

### ExternalName 型別         {#externalname}

型別為 ExternalName 的服務將服務對映到 DNS 名稱，而不是典型的選擇器，例如 `my-service` 或者 `cassandra`。
你可以使用 `spec.externalName` 引數指定這些服務。

例如，以下 Service 定義將 `prod` 名稱空間中的 `my-service` 服務對映到 `my.database.example.com`：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

<!--
ExternalName accepts an IPv4 address string, but as a DNS name comprised of digits, not as an IP address. ExternalNames that resemble IPv4 addresses are not resolved by CoreDNS or ingress-nginx because ExternalName
is intended to specify a canonical DNS name. To hardcode an IP address, consider using
[headless Services](#headless-services).
-->
{{< note >}}
ExternalName 服務接受 IPv4 地址字串，但作為包含數字的 DNS 名稱，而不是 IP 地址。
類似於 IPv4 地址的外部名稱不能由 CoreDNS 或 ingress-nginx 解析，因為外部名稱旨在指定規範的 DNS 名稱。
要對 IP 地址進行硬編碼，請考慮使用 [headless Services](#headless-services)。
{{< /note >}}

<!--
When looking up the host `my-service.prod.svc.cluster.local`, the cluster DNS Service
returns a `CNAME` record with the value `my.database.example.com`. Accessing
`my-service` works in the same way as other Services but with the crucial
difference that redirection happens at the DNS level rather than via proxying or
forwarding. Should you later decide to move your database into your cluster, you
can start its Pods, add appropriate selectors or endpoints, and change the
Service's `type`.
-->
當查詢主機 `my-service.prod.svc.cluster.local` 時，叢集 DNS 服務返回 `CNAME` 記錄，
其值為 `my.database.example.com`。
訪問 `my-service` 的方式與其他服務的方式相同，但主要區別在於重定向發生在 DNS 級別，而不是透過代理或轉發。
如果以後你決定將資料庫移到叢集中，則可以啟動其 Pod，新增適當的選擇器或端點以及更改服務的 `type`。

<!--
{{< warning >}}
You may have trouble using ExternalName for some common protocols, including HTTP and HTTPS. If you use ExternalName then the hostname used by clients inside your cluster is different from the name that the ExternalName references.

For protocols that use hostnames this difference may lead to errors or unexpected responses. HTTP requests will have a `Host:` header that the origin server does not recognize; TLS servers will not be able to provide a certificate matching the hostname that the client connected to.
{{< /warning >}}
-->
{{< warning >}}
對於一些常見的協議，包括 HTTP 和 HTTPS，
你使用 ExternalName 可能會遇到問題。
如果你使用 ExternalName，那麼叢集內客戶端使用的主機名
與 ExternalName 引用的名稱不同。

對於使用主機名的協議，此差異可能會導致錯誤或意外響應。
HTTP 請求將具有源伺服器無法識別的 `Host:` 標頭；TLS 服
務器將無法提供與客戶端連線的主機名匹配的證書。
{{< /warning >}}

<!--
This section is indebted to the [Kubernetes Tips - Part
1](https://akomljen.com/kubernetes-tips-part-1/) blog post from [Alen Komljen](https://akomljen.com/).
-->
{{< note >}}
本部分感謝 [Alen Komljen](https://akomljen.com/)的
[Kubernetes Tips - Part1](https://akomljen.com/kubernetes-tips-part-1/) 部落格文章。
{{< /note >}}

<!--
### External IPs

If there are external IPs that route to one or more cluster nodes, Kubernetes Services can be exposed on those
`externalIPs`. Traffic that ingresses into the cluster with the external IP (as destination IP), on the Service port,
will be routed to one of the Service endpoints. `externalIPs` are not managed by Kubernetes and are the responsibility
of the cluster administrator.

In the Service spec, `externalIPs` can be specified along with any of the `ServiceTypes`.
In the example below, "`my-service`" can be accessed by clients on "`80.11.12.10:80`" (`externalIP:port`)
-->
### 外部 IP  {#external-ips}

如果外部的 IP 路由到叢集中一個或多個 Node 上，Kubernetes Service 會被暴露給這些 externalIPs。
透過外部 IP（作為目的 IP 地址）進入到叢集，打到 Service 的埠上的流量，
將會被路由到 Service 的 Endpoint 上。
`externalIPs` 不會被 Kubernetes 管理，它屬於叢集管理員的職責範疇。

根據 Service 的規定，`externalIPs` 可以同任意的 `ServiceType` 來一起指定。
在上面的例子中，`my-service` 可以在  "`80.11.12.10:80`"(`externalIP:port`) 上被客戶端訪問。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
  externalIPs:
    - 80.11.12.10
```

<!--
## Shortcomings

Using the userspace proxy for VIPs works at small to medium scale, but will
not scale to very large clusters with thousands of Services.  The
[original design proposal for portals](https://github.com/kubernetes/kubernetes/issues/1107)
has more details on this.

Using the userspace proxy obscures the source IP address of a packet accessing
a Service.
This makes some kinds of network filtering (firewalling) impossible.  The iptables
proxy mode does not
obscure in-cluster source IPs, but it does still impact clients coming through
a load balancer or node-port.

The `Type` field is designed as nested functionality - each level adds to the
previous.  This is not strictly required on all cloud providers (e.g. Google Compute Engine does
not need to allocate a `NodePort` to make `LoadBalancer` work, but AWS does)
but the current API requires it.
-->
## 不足之處

為 VIP 使用使用者空間代理，將只適合小型到中型規模的叢集，不能夠擴充套件到上千 Service 的大型叢集。
檢視[最初設計方案](https://github.com/kubernetes/kubernetes/issues/1107) 獲取更多細節。

使用使用者空間代理，隱藏了訪問 Service 的資料包的源 IP 地址。
這使得一些型別的防火牆無法起作用。
iptables 代理不會隱藏 Kubernetes 叢集內部的 IP 地址，但卻要求客戶端請求
必須透過一個負載均衡器或 Node 埠。

`Type` 欄位支援巢狀功能 —— 每一層需要新增到上一層裡面。
不會嚴格要求所有云提供商（例如，GCE 就沒必要為了使一個 `LoadBalancer`
能工作而分配一個 `NodePort`，但是 AWS 需要 ），但當前 API 是強制要求的。

<!--
## Virtual IP implementation {#the-gory-details-of-virtual-ips}

The previous information should be sufficient for many people who want to
use Services.  However, there is a lot going on behind the scenes that may be
worth understanding.
-->
## 虛擬IP實施 {#the-gory-details-of-virtual-ips}

對很多想使用 Service 的人來說，前面的資訊應該足夠了。
然而，有很多內部原理性的內容，還是值去理解的。

<!--
### Avoiding collisions

One of the primary philosophies of Kubernetes is that you should not be
exposed to situations that could cause your actions to fail through no fault
of your own. For the design of the Service resource, this means not making
you choose your own port number if that choice might collide with
someone else's choice.  That is an isolation failure.

In order to allow you to choose a port number for your Services, we must
ensure that no two Services can collide. Kubernetes does that by allocating each
Service its own IP address from within the `service-cluster-ip-range`
CIDR range that is configured for the API server.

To ensure each Service receives a unique IP, an internal allocator atomically
updates a global allocation map in {{< glossary_tooltip term_id="etcd" >}}
prior to creating each Service. The map object must exist in the registry for
Services to get IP address assignments, otherwise creations will
fail with a message indicating an IP address could not be allocated.

In the control plane, a background controller is responsible for creating that
map (needed to support migrating from older versions of Kubernetes that used
in-memory locking). Kubernetes also uses controllers to check for invalid
assignments (eg due to administrator intervention) and for cleaning up allocated
IP addresses that are no longer used by any Services.
-->
### 避免衝突

Kubernetes 最主要的哲學之一，是使用者不應該暴露那些能夠導致他們操作失敗、但又不是他們的過錯的場景。
對於 Service 資源的設計，這意味著如果使用者的選擇有可能與他人衝突，那就不要讓使用者自行選擇埠號。
這是一個隔離性的失敗。

為了使使用者能夠為他們的 Service 選擇一個埠號，我們必須確保不能有 2 個 Service 發生衝突。
Kubernetes 透過在為 API 伺服器配置的 `service-cluster-ip-range` CIDR
範圍內為每個服務分配自己的 IP 地址來實現。

為了保證每個 Service 被分配到一個唯一的 IP，需要一個內部的分配器能夠原子地更新
{{< glossary_tooltip term_id="etcd" >}} 中的一個全域性分配對映表，
這個更新操作要先於建立每一個 Service。
為了使 Service 能夠獲取到 IP，這個對映表物件必須在註冊中心存在，
否則建立 Service 將會失敗，指示一個 IP 不能被分配。

在控制平面中，一個後臺 Controller 的職責是建立對映表
（需要支援從使用了記憶體鎖的 Kubernetes 的舊版本遷移過來）。
同時 Kubernetes 會透過控制器檢查不合理的分配（如管理員干預導致的）
以及清理已被分配但不再被任何 Service 使用的 IP 地址。

<!--
#### IP address ranges for `type: ClusterIP` Services {#service-ip-static-sub-range}

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}
However, there is a problem with this `ClusterIP` allocation strategy, because a user
can also [choose their own address for the service](#choosing-your-own-ip-address).
This could result in a conflict if the internal allocator selects the same IP address
for another Service.
-->
#### `type: ClusterIP` 服務的 IP 地址範圍  {#service-ip-static-sub-range}

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}
但是，這種 `ClusterIP` 分配策略存在一個問題，因為使用者還可以[為服務選擇自己的地址](#choosing-your-own-ip-address)。
如果內部分配器為另一個服務選擇相同的 IP 地址，這可能會導致衝突。

<!--
If you enable the `ServiceIPStaticSubrange`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
the allocation strategy divides the `ClusterIP` range into two bands, based on
the size of the configured `service-cluster-ip-range` by using the following formula
`min(max(16, cidrSize / 16), 256)`, described as _never less than 16 or more than 256,
with a graduated step function between them_. Dynamic IP allocations will be preferentially
chosen from the upper band, reducing risks of conflicts with the IPs
assigned from the lower band.
This allows users to use the lower band of the `service-cluster-ip-range` for their
Services with static IPs assigned with a very low risk of running into conflicts.
-->
如果啟用 `ServiceIPStaticSubrange`[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
分配策略根據配置的 `service-cluster-ip-range` 的大小，使用以下公式
`min(max(16, cidrSize / 16), 256)` 進行劃分，該公式可描述為
“在不小於 16 且不大於 256 之間有一個步進量（Graduated Step）”，將
`ClusterIP` 範圍分成兩段。動態 IP 分配將優先從上半段地址中選擇，
從而降低與下半段地址分配的 IP 衝突的風險。
這允許使用者將 `service-cluster-ip-range` 的下半段地址用於他們的服務，
與所分配的靜態 IP 的衝突風險非常低。

<!--
### Service IP addresses {#ips-and-vips}

Unlike Pod IP addresses, which actually route to a fixed destination,
Service IPs are not actually answered by a single host.  Instead, kube-proxy
uses iptables (packet processing logic in Linux) to define _virtual_ IP addresses
which are transparently redirected as needed.  When clients connect to the
VIP, their traffic is automatically transported to an appropriate endpoint.
The environment variables and DNS for Services are actually populated in
terms of the Service's virtual IP address (and port).

kube-proxy supports three proxy modes&mdash;userspace, iptables and IPVS&mdash;which
each operate slightly differently.
-->
### Service IP 地址 {#ips-and-vips}

不像 Pod 的 IP 地址，它實際路由到一個固定的目的地，Service 的 IP 實際上
不能透過單個主機來進行應答。
相反，我們使用 `iptables`（Linux 中的資料包處理邏輯）來定義一個
虛擬 IP 地址（VIP），它可以根據需要透明地進行重定向。
當客戶端連線到 VIP 時，它們的流量會自動地傳輸到一個合適的 Endpoint。
環境變數和 DNS，實際上會根據 Service 的 VIP 和埠來進行填充。

kube-proxy支援三種代理模式: 使用者空間，iptables和IPVS；它們各自的操作略有不同。

#### Userspace  {#userspace}

<!--
As an example, consider the image processing application described above.
When the backend Service is created, the Kubernetes master assigns a virtual
IP address, for example 10.0.0.1.  Assuming the Service port is 1234, the
Service is observed by all of the kube-proxy instances in the cluster.
When a proxy sees a new Service, it opens a new random port, establishes an
iptables redirect from the virtual IP address to this new port, and starts accepting
connections on it.

When a client connects to the Service's virtual IP address, the iptables
rule kicks in, and redirects the packets to the proxy's own port.
The "Service proxy" chooses a backend, and starts proxying traffic from the client to the backend.

This means that Service owners can choose any port they want without risk of
collision.  Clients can connect to an IP and port, without being aware
of which Pods they are actually accessing.
-->

作為一個例子，考慮前面提到的圖片處理應用程式。
當建立後端 Service 時，Kubernetes master 會給它指派一個虛擬 IP 地址，比如 10.0.0.1。
假設 Service 的埠是 1234，該 Service 會被叢集中所有的 `kube-proxy` 例項觀察到。
當代理看到一個新的 Service， 它會開啟一個新的埠，建立一個從該 VIP 重定向到
新埠的 iptables，並開始接收請求連線。

當一個客戶端連線到一個 VIP，iptables 規則開始起作用，它會重定向該資料包到
"服務代理" 的埠。
"服務代理" 選擇一個後端，並將客戶端的流量代理到後端上。

這意味著 Service 的所有者能夠選擇任何他們想使用的埠，而不存在衝突的風險。
客戶端可以連線到一個 IP 和埠，而不需要知道實際訪問了哪些 Pod。

#### iptables

<!--
Again, consider the image processing application described above.
When the backend Service is created, the Kubernetes control plane assigns a virtual
IP address, for example 10.0.0.1.  Assuming the Service port is 1234, the
Service is observed by all of the kube-proxy instances in the cluster.
When a proxy sees a new Service, it installs a series of iptables rules which
redirect from the virtual IP address  to per-Service rules.  The per-Service
rules link to per-Endpoint rules which redirect traffic (using destination NAT)
to the backends.

When a client connects to the Service's virtual IP address the iptables rule kicks in.
A backend is chosen (either based on session affinity or randomly) and packets are
redirected to the backend.  Unlike the userspace proxy, packets are never
copied to userspace, the kube-proxy does not have to be running for the virtual
IP address to work, and Nodes see traffic arriving from the unaltered client IP
address.

This same basic flow executes when traffic comes in through a node-port or
through a load-balancer, though in those cases the client IP does get altered.
-->
再次考慮前面提到的圖片處理應用程式。
當建立後端 Service 時，Kubernetes 控制面板會給它指派一個虛擬 IP 地址，比如 10.0.0.1。
假設 Service 的埠是 1234，該 Service 會被叢集中所有的 `kube-proxy` 例項觀察到。
當代理看到一個新的 Service， 它會配置一系列的 iptables 規則，從 VIP 重定向到每個 Service 規則。
該特定於服務的規則連線到特定於 Endpoint 的規則，而後者會重定向（目標地址轉譯）到後端。

當客戶端連線到一個 VIP，iptables 規則開始起作用。一個後端會被選擇（或者根據會話親和性，或者隨機），
資料包被重定向到這個後端。
不像使用者空間代理，資料包從來不複製到使用者空間，kube-proxy 不是必須為該 VIP 工作而執行，
並且客戶端 IP 是不可更改的。

當流量打到 Node 的埠上，或透過負載均衡器，會執行相同的基本流程，
但是在那些案例中客戶端 IP 是可以更改的。

#### IPVS

<!--
iptables operations slow down dramatically in large scale cluster e.g 10,000 Services.
IPVS is designed for load balancing and based on in-kernel hash tables. So you can achieve performance consistency in large number of Services from IPVS-based kube-proxy. Meanwhile, IPVS-based kube-proxy has more sophisticated load balancing algorithms (least conns, locality, weighted, persistence).
-->
在大規模叢集（例如 10000 個服務）中，iptables 操作會顯著降低速度。 IPVS
專為負載平衡而設計，並基於核心內雜湊表。
因此，你可以透過基於 IPVS 的 kube-proxy 在大量服務中實現效能一致性。
同時，基於 IPVS 的 kube-proxy 具有更復雜的負載均衡演算法（最小連線、區域性性、
加權、永續性）。

## API 物件

<!--
Service is a top-level resource in the Kubernetes REST API. You can find more details
about the API object at: [Service API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).
-->
Service 是 Kubernetes REST API 中的頂級資源。你可以在以下位置找到有關 API 物件的更多詳細資訊：
[Service 物件 API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).

## 受支援的協議 {#protocol-support}

### TCP

<!--
You can use TCP for any kind of Service, and it's the default network protocol.
-->
你可以將 TCP 用於任何型別的服務，這是預設的網路協議。

### UDP

<!--
You can use UDP for most Services. For type=LoadBalancer Services, UDP support
depends on the cloud provider offering this facility.
-->
你可以將 UDP 用於大多數服務。 對於 type=LoadBalancer 服務，對 UDP 的支援取決於提供此功能的雲提供商。

<!-- 

### SCTP

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

When using a network plugin that supports SCTP traffic, you can use SCTP for
most Services. For type=LoadBalancer Services, SCTP support depends on the cloud
provider offering this facility. (Most do not).
-->
### SCTP

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

一旦你使用了支援 SCTP 流量的網路外掛，你就可以使用 SCTP 於更多的服務。
對於 type = LoadBalancer 的服務，SCTP 的支援取決於提供此設施的雲供應商（大多數不支援）。

<!--
#### Warnings {#caveat-sctp-overview}

##### Support for multihomed SCTP associations {#caveat-sctp-multihomed}
-->
#### 警告 {#caveat-sctp-overview}

##### 支援多宿主 SCTP 關聯 {#caveat-sctp-multihomed}

<!--
{{< warning >}}
The support of multihomed SCTP associations requires that the CNI plugin can support the assignment of multiple interfaces and IP addresses to a Pod.

NAT for multihomed SCTP associations requires special logic in the corresponding kernel modules.
{{< /warning >}}
-->
{{< warning >}}
支援多宿主SCTP關聯要求 CNI 外掛能夠支援為一個 Pod 分配多個介面和IP地址。

用於多宿主 SCTP 關聯的 NAT 在相應的核心模組中需要特殊的邏輯。
{{< /warning >}}

<!--
##### Windows {#caveat-sctp-windows-os}

{{< note >}}
SCTP is not supported on Windows based nodes.
{{< /note >}}
-->
##### Windows {#caveat-sctp-windows-os}

{{< note >}}
基於 Windows 的節點不支援 SCTP。
{{< /note >}}

<!--
##### Userspace kube-proxy {#caveat-sctp-kube-proxy-userspace}

{{< warning >}}
The kube-proxy does not support the management of SCTP associations when it is in userspace mode.
{{< /warning >}}
-->
##### 使用者空間 kube-proxy {#caveat-sctp-kube-proxy-userspace}

{{< warning >}}
當 kube-proxy 處於使用者空間模式時，它不支援 SCTP 關聯的管理。
{{< /warning >}}

### HTTP

<!--
If your cloud provider supports it, you can use a Service in LoadBalancer mode
to set up external HTTP / HTTPS reverse proxying, forwarded to the Endpoints
of the Service.
-->
如果你的雲提供商支援它，則可以在 LoadBalancer 模式下使用服務來設定外部
HTTP/HTTPS 反向代理，並將其轉發到該服務的 Endpoints。

<!--
You can also use {{< glossary_tooltip term_id="ingress" >}} in place of Service
to expose HTTP / HTTPS Services.
-->
{{< note >}}
你還可以使用 {{< glossary_tooltip text="Ingress" term_id="ingress" >}} 代替
Service 來公開 HTTP/HTTPS 服務。
{{< /note >}}

<!--
### PROXY protocol

If your cloud provider supports it,
you can use a Service in LoadBalancer mode to configure a load balancer outside
of Kubernetes itself, that will forward connections prefixed with
[PROXY protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

The load balancer will send an initial series of octets describing the
incoming connection, similar to this example
-->
### PROXY 協議

如果你的雲提供商支援它，
則可以在 LoadBalancer 模式下使用 Service 在 Kubernetes 本身之外配置負載均衡器，
該負載均衡器將轉發字首為
[PROXY 協議](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)
的連線。

負載平衡器將傳送一系列初始位元組，描述傳入的連線，類似於此示例

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```

<!--
followed by the data from the client.
-->
上述是來自客戶端的資料。

## {{% heading "whatsnext" %}}

<!--
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
* Read about [Ingress](/docs/concepts/services-networking/ingress/)
* Read about [Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/)
-->
* 閱讀[使用服務訪問應用](/zh-cn/docs/concepts/services-networking/connect-applications-service/)
* 閱讀了解 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
* 閱讀了解[端點切片（Endpoint Slices）](/zh-cn/docs/concepts/services-networking/endpoint-slices/)

