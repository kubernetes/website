---
title: 服務（Service）
api_metadata:
- apiVersion: "v1"
  kind: "Service"
feature:
  title: 服務發現與負載均衡
  description: >
    你無需修改應用來使用陌生的服務發現機制。Kubernetes 爲每個 Pod 提供了自己的 IP 地址併爲一組
    Pod 提供一個 DNS 名稱，並且可以在它們之間實現負載均衡。
description: >-
  將在集羣中運行的應用通過同一個面向外界的端點公開出去，即使工作負載分散於多個後端也完全可行。
content_type: concept
weight: 10
---
<!--
reviewers:
- bprashanth
title: Service
api_metadata:
- apiVersion: "v1"
  kind: "Service"
feature:
  title: Service discovery and load balancing
  description: >
    No need to modify your application to use an unfamiliar service discovery mechanism. Kubernetes gives Pods their own IP addresses and a single DNS name for a set of Pods, and can load-balance across them.
description: >-
  Expose an application running in your cluster behind a single outward-facing
  endpoint, even when the workload is split across multiple backends.
content_type: concept
weight: 10
-->

<!-- overview -->

{{< glossary_definition term_id="service" length="short" prepend="Kubernetes 中 Service 是" >}}

<!--
A key aim of Services in Kubernetes is that you don't need to modify your existing
application to use an unfamiliar service discovery mechanism.
You can run code in Pods, whether this is a code designed for a cloud-native world, or
an older app you've containerized. You use a Service to make that set of Pods available
on the network so that clients can interact with it.
-->
Kubernetes 中 Service 的一個關鍵目標是讓你無需修改現有應用以使用某種不熟悉的服務發現機制。
你可以在 Pod 集合中運行代碼，無論該代碼是爲雲原生環境設計的，還是被容器化的老應用。
你可以使用 Service 讓一組 Pod 可在網絡上訪問，這樣客戶端就能與之交互。

<!--
If you use a {{< glossary_tooltip term_id="deployment" >}} to run your app,
that Deployment can create and destroy Pods dynamically. From one moment to the next,
you don't know how many of those Pods are working and healthy; you might not even know
what those healthy Pods are named.
Kubernetes {{< glossary_tooltip term_id="pod" text="Pods" >}} are created and destroyed
to match the desired state of your cluster. Pods are ephemeral resources (you should not
expect that an individual Pod is reliable and durable).
-->
如果你使用 {{< glossary_tooltip term_id="deployment" >}} 來運行你的應用，
Deployment 可以動態地創建和銷燬 Pod。
在任何時刻，你都不知道有多少個這樣的 Pod 正在工作以及它們健康與否；
你可能甚至不知道如何辨別健康的 Pod。
Kubernetes {{< glossary_tooltip term_id="pod" text="Pod" >}} 的創建和銷燬是爲了匹配集羣的預期狀態。
Pod 是臨時資源（你不應該期待單個 Pod 既可靠又耐用）。

<!--
Each Pod gets its own IP address (Kubernetes expects network plugins to ensure this).
For a given Deployment in your cluster, the set of Pods running in one moment in
time could be different from the set of Pods running that application a moment later.

This leads to a problem: if some set of Pods (call them "backends") provides
functionality to other Pods (call them "frontends") inside your cluster,
how do the frontends find out and keep track of which IP address to connect
to, so that the frontend can use the backend part of the workload?
-->
每個 Pod 會獲得屬於自己的 IP 地址（Kubernetes 期待網絡插件來保證這一點）。
對於集羣中給定的某個 Deployment，這一刻運行的 Pod 集合可能不同於下一刻運行該應用的
Pod 集合。

這就帶來了一個問題：如果某組 Pod（稱爲“後端”）爲集羣內的其他 Pod（稱爲“前端”）
集合提供功能，前端要如何發現並跟蹤要連接的 IP 地址，以便其使用負載的後端組件呢？

<!-- body -->

<!--
## Services in Kubernetes

The Service API, part of Kubernetes, is an abstraction to help you expose groups of
Pods over a network. Each Service object defines a logical set of endpoints (usually
these endpoints are Pods) along with a policy about how to make those pods accessible.
-->
## Kubernetes 中的 Service   {#services-in-kubernetes}

Service API 是 Kubernetes 的組成部分，它是一種抽象，幫助你將 Pod 集合在網絡上公開出去。
每個 Service 對象定義端點的一個邏輯集合（通常這些端點就是 Pod）以及如何訪問到這些 Pod 的策略。

<!--
For example, consider a stateless image-processing backend which is running with
3 replicas.  Those replicas are fungible&mdash;frontends do not care which backend
they use.  While the actual Pods that compose the backend set may change, the
frontend clients should not need to be aware of that, nor should they need to keep
track of the set of backends themselves.

The Service abstraction enables this decoupling.
-->
例如，考慮一個無狀態的圖像處理後端，其中運行 3 個副本（Replicas）。
這些副本是可互換的 —— 前端不需要關心它們調用的是哪個後端。
即便構成後端集合的實際 Pod 可能會發生變化，前端客戶端不應該也沒必要知道這些，
而且它們也不必親自跟蹤後端的狀態變化。

Service 抽象使這種解耦成爲可能。

<!--
The set of Pods targeted by a Service is usually determined
by a {{< glossary_tooltip text="selector" term_id="selector" >}} that you
define.
To learn about other ways to define Service endpoints,
see [Services _without_ selectors](#services-without-selectors).
-->
Service 所對應的 Pod 集合通常由你定義的{{< glossary_tooltip text="選擇算符" term_id="selector" >}}來確定。
若想了解定義 Service 端點的其他方式，可以查閱[**不帶**選擇算符的 Service](#services-without-selectors)。

<!--
If your workload speaks HTTP, you might choose to use an
[Ingress](/docs/concepts/services-networking/ingress/) to control how web traffic
reaches that workload.
Ingress is not a Service type, but it acts as the entry point for your
cluster. An Ingress lets you consolidate your routing rules into a single resource, so
that you can expose multiple components of your workload, running separately in your
cluster, behind a single listener.
-->
如果你的工作負載使用 HTTP 通信，你可能會選擇使用
[Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 來控制
Web 流量如何到達該工作負載。Ingress 不是一種 Service，但它可用作集羣的入口點。
Ingress 能讓你將路由規則整合到同一個資源內，這樣你就能將工作負載的多個組件公開出去，
這些組件使用同一個偵聽器，但各自獨立地運行在集羣中。

<!--
The [Gateway](https://gateway-api.sigs.k8s.io/#what-is-the-gateway-api) API for Kubernetes
provides extra capabilities beyond Ingress and Service. You can add Gateway to your cluster -
it is a family of extension APIs, implemented using
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}} -
and then use these to configure access to network services that are running in your cluster.
-->
用於 Kubernetes 的 [Gateway](https://gateway-api.sigs.k8s.io/#what-is-the-gateway-api) API
能夠提供 Ingress 和 Service 所不具備的一些額外能力。
Gateway 是使用 {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
實現的一系列擴展 API。
你可以添加 Gateway 到你的集羣中，之後就可以使用它們配置如何訪問集羣中運行的網絡服務。

<!--
### Cloud-native service discovery

If you're able to use Kubernetes APIs for service discovery in your application,
you can query the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
for matching EndpointSlices. Kubernetes updates the EndpointSlices for a Service
whenever the set of Pods in a Service changes.

For non-native applications, Kubernetes offers ways to place a network port or load
balancer in between your application and the backend Pods.
-->
### 雲原生服務發現   {#cloud-native-service-discovery}

如果你想要在自己的應用中使用 Kubernetes API 進行服務發現，可以查詢
{{< glossary_tooltip text="API 服務器" term_id="kube-apiserver" >}}，
尋找匹配的 EndpointSlice 對象。
只要 Service 中的 Pod 集合發生變化，Kubernetes 就會爲其更新 EndpointSlice。

對於非本地應用，Kubernetes 提供了在應用和後端 Pod 之間放置網絡端口或負載均衡器的方法。

<!--
Either way, your workload can use these [service discovery](#discovering-services)
mechanisms to find the target it wants to connect to.
-->
無論採用那種方式，你的負載都可以使用這裏的[服務發現](#discovering-services)機制找到希望連接的目標。

<!--
## Defining a Service

A Service in Kubernetes is an
{{< glossary_tooltip text="object" term_id="object" >}}
(the same way that a Pod or a ConfigMap is an object). You can create,
view or modify Service definitions using the Kubernetes API. Usually
you use a tool such as `kubectl` to make those API calls for you.
-->
## 定義 Service   {#defining-a-service}

Kubernetes 中的 Service 是一個{{< glossary_tooltip text="對象" term_id="object" >}}
（與 Pod 或 ConfigMap 類似）。你可以使用 Kubernetes API 創建、查看或修改 Service 定義。
通常你會使用 `kubectl` 這類工具來替你發起這些 API 調用。

<!--
For example, suppose you have a set of Pods that each listen on TCP port 9376
and are labelled as `app.kubernetes.io/name=MyApp`. You can define a Service to
publish that TCP listener:
-->
例如，假定有一組 Pod，每個 Pod 都在偵聽 TCP 端口 9376，並且它們還被打上
`app.kubernetes.io/name=MyApp` 標籤。你可以定義一個 Service 來發布該 TCP 偵聽器。

{{% code_sample file="service/simple-service.yaml" %}}

<!--
Applying this manifest creates a new Service named "my-service" with the default
ClusterIP [service type](#publishing-services-service-types). The Service
targets TCP port 9376 on any Pod with the `app.kubernetes.io/name: MyApp` label.

Kubernetes assigns this Service an IP address (the _cluster IP_),
that is used by the virtual IP address mechanism. For more details on that mechanism,
read [Virtual IPs and Service Proxies](/docs/reference/networking/virtual-ips/).
-->
應用上述清單時，系統將創建一個名爲 "my-service" 的、
[服務類型](#publishing-services-service-types)默認爲 ClusterIP 的 Service。
該 Service 指向帶有標籤 `app.kubernetes.io/name: MyApp` 的所有 Pod 的 TCP 端口 9376。

Kubernetes 爲該 Service 分配一個 IP 地址（稱爲 “集羣 IP”），供虛擬 IP 地址機制使用。
有關該機制的更多詳情，請閱讀[虛擬 IP 和服務代理](/zh-cn/docs/reference/networking/virtual-ips/)。

<!--
The controller for that Service continuously scans for Pods that
match its selector, and then makes any necessary updates to the set of
EndpointSlices for the Service.
-->
此 Service 的控制器不斷掃描與其選擇算符匹配的 Pod 集合，然後對 Service 的
EndpointSlice 集合執行必要的更新。

<!--
The name of a Service object must be a valid
[RFC 1035 label name](/docs/concepts/overview/working-with-objects/names#rfc-1035-label-names).
-->
Service 對象的名稱必須是有效的
[RFC 1035 標籤名稱](/zh-cn/docs/concepts/overview/working-with-objects/names#rfc-1035-label-names)。

{{< note >}}
<!--
A Service can map _any_ incoming `port` to a `targetPort`. By default and
for convenience, the `targetPort` is set to the same value as the `port`
field.
-->
Service 能夠將**任意**入站 `port` 映射到某個 `targetPort`。
默認情況下，出於方便考慮，`targetPort` 會被設置爲與 `port` 字段相同的值。
{{< /note >}}

<!--
### Relaxed naming requirements for Service objects

{{< feature-state feature_gate_name="RelaxedServiceNameValidation" >}}

The `RelaxedServiceNameValidation` feature gate allows Service object names to start with a digit. When this feature gate is enabled, Service object names must be valid [RFC 1123 label names](/docs/concepts/overview/working-with-objects/names/#dns-label-names).
-->
### 對 Service 對象放寬命名限制

{{< feature-state feature_gate_name="RelaxedServiceNameValidation" >}}

`RelaxedServiceNameValidation` 特性開關允許 Service 對象的名稱以數字開頭。
啓用該特性後，Service 對象的名稱必須符合
[RFC 1123 標籤名稱](/zh-cn/docs/concepts/overview/working-with-objects/names/#dns-label-names)的規範。

<!--
### Port definitions {#field-spec-ports}

Port definitions in Pods have names, and you can reference these names in the
`targetPort` attribute of a Service. For example, we can bind the `targetPort`
of the Service to the Pod port in the following way:
-->
### 端口定義 {#field-spec-ports}

Pod 中的端口定義是有名字的，你可以在 Service 的 `targetPort` 屬性中引用這些名字。
例如，我們可以通過以下方式將 Service 的 `targetPort` 綁定到 Pod 端口：

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
即使在 Service 中混合使用配置名稱相同的多個 Pod，各 Pod 通過不同的端口號支持相同的網絡協議，
此機制也可以工作。這一機制爲 Service 的部署和演化提供了較高的靈活性。
例如，你可以在後端軟件的新版本中更改 Pod 公開的端口號，但不會影響到客戶端。

<!--
The default protocol for Services is
[TCP](/docs/reference/networking/service-protocols/#protocol-tcp); you can also
use any other [supported protocol](/docs/reference/networking/service-protocols/).

Because many Services need to expose more than one port, Kubernetes supports
+[multiple port definitions](#multi-port-services) for a single Service.
Each port definition can have the same `protocol`, or a different one.
-->
Service 的默認協議是 [TCP](/zh-cn/docs/reference/networking/service-protocols/#protocol-tcp)；
你還可以使用其他[受支持的任何協議](/zh-cn/docs/reference/networking/service-protocols/)。

由於許多 Service 需要公開多個端口，所以 Kubernetes 爲同一 Service 定義[多個端口](#multi-port-services)。
每個端口定義可以具有相同的 `protocol`，也可以具有不同協議。

<!--
### Services without selectors

Services most commonly abstract access to Kubernetes Pods thanks to the selector,
but when used with a corresponding set of
{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlices">}}
objects and without a selector, the Service can abstract other kinds of backends,
including ones that run outside the cluster.
-->
### 沒有選擇算符的 Service   {#services-without-selectors}

由於選擇算符的存在，Service 的最常見用法是爲 Kubernetes Pod 集合提供訪問抽象，
但是當與相應的 {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}
對象一起使用且沒有設置選擇算符時，Service 也可以爲其他類型的後端提供抽象，
包括在集羣外運行的後端。

<!--
For example:

* You want to have an external database cluster in production, but in your
  test environment you use your own databases.
* You want to point your Service to a Service in a different
  {{< glossary_tooltip term_id="namespace" >}} or on another cluster.
* You are migrating a workload to Kubernetes. While evaluating the approach,
  you run only a portion of your backends in Kubernetes.
-->
例如：

* 你希望在生產環境中使用外部數據庫集羣，但在測試環境中使用自己的數據庫。
* 你希望讓你的 Service 指向另一個{{< glossary_tooltip term_id="namespace" >}}中或其它集羣中的服務。
* 你正在將工作負載遷移到 Kubernetes 上來。在評估所採用的方法時，你僅在 Kubernetes
  中運行一部分後端。

<!--
In any of these scenarios you can define a Service _without_ specifying a
selector to match Pods. For example:
-->
在所有這些場景中，你都可以定義**不**指定用來匹配 Pod 的選擇算符的 Service。例如：

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
Because this Service has no selector, the corresponding EndpointSlice
objects are not created automatically. You can map the Service
to the network address and port where it's running, by adding an EndpointSlice
object manually. For example:
-->
由於此 Service 沒有選擇算符，因此不會自動創建對應的 EndpointSlice 對象。
你可以通過手動添加 EndpointSlice 對象，將 Service 映射到該服務運行位置的網絡地址和端口：

<!--
```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-1 # by convention, use the name of the Service
                     # as a prefix for the name of the EndpointSlice
  labels:
    # You should set the "kubernetes.io/service-name" label.
    # Set its value to match the name of the Service
    kubernetes.io/service-name: my-service
addressType: IPv4
ports:
  - name: http # should match with the name of the service port defined above
    appProtocol: http
    protocol: TCP
    port: 9376
endpoints:
  - addresses:
      - "10.4.5.6"
  - addresses:
      - "10.1.2.3"
```
-->
```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-1 # 按慣例將 Service 的名稱用作 EndpointSlice 名稱的前綴
  labels:
    # 你應設置 "kubernetes.io/service-name" 標籤。
    # 設置其值以匹配 Service 的名稱
    kubernetes.io/service-name: my-service
addressType: IPv4
ports:
  - name: '' # 應與上面定義的 Service 端口的名稱匹配
    appProtocol: http
    protocol: TCP
    port: 9376
endpoints:  # 此列表中的 IP 地址可以按任何順序顯示
  - addresses:
      - "10.4.5.6"
  - addresses:
      - "10.1.2.3"
```

<!--
#### Custom EndpointSlices

When you create an [EndpointSlice](#endpointslices) object for a Service, you can
use any name for the EndpointSlice. Each EndpointSlice in a namespace must have a
unique name. You link an EndpointSlice to a Service by setting the
`kubernetes.io/service-name` {{< glossary_tooltip text="label" term_id="label" >}}
on that EndpointSlice.
-->
#### 自定義 EndpointSlices  {#custom-endpointslices}

當爲 Service 創建 [EndpointSlice](#endpointslices) 對象時，可以爲 EndpointSlice 使用任何名稱。
一個名字空間中的各個 EndpointSlice 都必須具有一個唯一的名稱。通過在 EndpointSlice 上設置
`kubernetes.io/service-name` {{< glossary_tooltip text="標籤" term_id="label" >}}可以將
EndpointSlice 鏈接到 Service。

{{< note >}}
<!--
The endpoint IPs _must not_ be: loopback (127.0.0.0/8 for IPv4, ::1/128 for IPv6), or
link-local (169.254.0.0/16 and 224.0.0.0/24 for IPv4, fe80::/64 for IPv6).

The endpoint IP addresses cannot be the cluster IPs of other Kubernetes Services,
because {{< glossary_tooltip term_id="kube-proxy" >}} doesn't support virtual IPs
as a destination.
-->
端點 IP 地址**必須不是**：本地迴路地址（IPv4 的 127.0.0.0/8、IPv6 的 ::1/128）
或鏈路本地地址（IPv4 的 169.254.0.0/16 和 224.0.0.0/24、IPv6 的 fe80::/64）。

端點 IP 地址不能是其他 Kubernetes 服務的集羣 IP，因爲
{{< glossary_tooltip term_id ="kube-proxy">}} 不支持將虛擬 IP 作爲目標地址。
{{< /note >}}

<!--
For an EndpointSlice that you create yourself, or in your own code,
you should also pick a value to use for the label
[`endpointslice.kubernetes.io/managed-by`](/docs/reference/labels-annotations-taints/#endpointslicekubernetesiomanaged-by).
If you create your own controller code to manage EndpointSlices, consider using a
value similar to `"my-domain.example/name-of-controller"`. If you are using a third
party tool, use the name of the tool in all-lowercase and change spaces and other
punctuation to dashes (`-`).
If people are directly using a tool such as `kubectl` to manage EndpointSlices,
use a name that describes this manual management, such as `"staff"` or
`"cluster-admins"`. You should
avoid using the reserved value `"controller"`, which identifies EndpointSlices
managed by Kubernetes' own control plane.
-->
對於你自己或在你自己代碼中創建的 EndpointSlice，你還應該爲
[`endpointslice.kubernetes.io/managed-by`](/zh-cn/docs/reference/labels-annotations-taints/#endpointslicekubernetesiomanaged-by)
標籤設置一個值。如果你創建自己的控制器代碼來管理 EndpointSlice，
請考慮使用類似於 `"my-domain.example/name-of-controller"` 的值。
如果你使用的是第三方工具，請使用全小寫的工具名稱，並將空格和其他標點符號更改爲短劃線 (`-`)。
如果直接使用 `kubectl` 之類的工具來管理 EndpointSlice 對象，請使用用來描述這種手動管理的名稱，
例如 `"staff"` 或 `"cluster-admins"`。你要避免使用保留值 `"controller"`；
該值標識由 Kubernetes 自己的控制平面管理的 EndpointSlice。

<!--
#### Accessing a Service without a selector {#service-no-selector-access}

Accessing a Service without a selector works the same as if it had a selector.
In the [example](#services-without-selectors) for a Service without a selector,
traffic is routed to one of the two endpoints defined in
the EndpointSlice manifest: a TCP connection to 10.1.2.3 or 10.4.5.6, on port 9376.
-->
#### 訪問沒有選擇算符的 Service   {#service-no-selector-access}

訪問沒有選擇算符的 Service 與有選擇算符的 Service 的原理相同。
在沒有選擇算符的 Service [示例](#services-without-selectors)中，
流量被路由到 EndpointSlice 清單中定義的兩個端點之一：
通過 TCP 協議連接到 10.1.2.3 或 10.4.5.6 的端口 9376。

{{< note >}}
<!--
The Kubernetes API server does not allow proxying to endpoints that are not mapped to
pods. Actions such as `kubectl port-forward service/<service-name> forwardedPort:servicePort` where the service has no
selector will fail due to this constraint. This prevents the Kubernetes API server
from being used as a proxy to endpoints the caller may not be authorized to access.
-->
Kubernetes API 服務器不允許將流量代理到未被映射至 Pod 上的端點。由於此約束，當 Service
沒有選擇算符時，諸如 `kubectl port-forward service/<service-name> forwardedPort:servicePort` 之類的操作將會失敗。
這可以防止 Kubernetes API 服務器被用作調用者可能無權訪問的端點的代理。
{{< /note >}}

<!--
An `ExternalName` Service is a special case of Service that does not have
selectors and uses DNS names instead. For more information, see the
[ExternalName](#externalname) section.
-->
`ExternalName` Service 是 Service 的特例，它沒有選擇算符，而是使用 DNS 名稱。
更多的相關信息，請參閱 [ExternalName](#externalname) 一節。

<!--
### EndpointSlices
-->
### EndpointSlices

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
[EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) are objects that
represent a subset (a _slice_) of the backing network endpoints for a Service.

Your Kubernetes cluster tracks how many endpoints each EndpointSlice represents.
If there are so many endpoints for a Service that a threshold is reached, then
Kubernetes adds another empty EndpointSlice and stores new endpoint information
there.
By default, Kubernetes makes a new EndpointSlice once the existing EndpointSlices
all contain at least 100 endpoints. Kubernetes does not make the new EndpointSlice
until an extra endpoint needs to be added.

See [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) for more
information about this API.
-->
[EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)
對象表示某個 Service 的後端網絡端點的子集（**切片**）。

你的 Kubernetes 集羣會跟蹤每個 EndpointSlice 所表示的端點數量。
如果 Service 的端點太多以至於達到閾值，Kubernetes 會添加另一個空的
EndpointSlice 並在其中存儲新的端點信息。
默認情況下，一旦現有 EndpointSlice 都包含至少 100 個端點，Kubernetes
就會創建一個新的 EndpointSlice。
在需要添加額外的端點之前，Kubernetes 不會創建新的 EndpointSlice。

參閱 [EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)
瞭解有關該 API 的更多信息。

<!--
### Endpoints (deprecated) {#endpoints}
-->
### Endpoints（已棄用）   {#endpoints}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

<!--
The EndpointSlice API is the evolution of the older
[Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
API. The deprecated Endpoints API has several problems relative to
EndpointSlice:

  - It does not support dual-stack clusters.
  - It does not contain information needed to support newer features, such as
    [trafficDistribution](/docs/concepts/services-networking/service/#traffic-distribution).
  - It will truncate the list of endpoints if it is too long to fit in a single object.

Because of this, it is recommended that all clients use the
EndpointSlice API rather than Endpoints.
-->
EndpointSlice API 是舊版 [Endpoints](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
API 的演進版本。與 EndpointSlice 相比，已棄用的 Endpoints API 存在以下幾個問題：

- 不支持雙棧集羣。
- 不包含支持 [trafficDistribution](/zh-cn/docs/concepts/services-networking/service/#traffic-distribution)
  等新特性所需的信息。
- 如果端點列表過長以至於無法放入單個對象中時會被截斷。

因此，推薦所有客戶端使用 EndpointSlice API 來替換 Endpoints。

<!--
#### Over-capacity endpoints

Kubernetes limits the number of endpoints that can fit in a single Endpoints
object. When there are over 1000 backing endpoints for a Service, Kubernetes
truncates the data in the Endpoints object. Because a Service can be linked
with more than one EndpointSlice, the 1000 backing endpoint limit only
affects the legacy Endpoints API.
-->
#### 超出容量的端點   {#over-capacity-endpoints}

Kubernetes 限制單個 Endpoints 對象中可以容納的端點數量。
當一個 Service 擁有 1000 個以上支撐端點時，Kubernetes 會截斷 Endpoints 對象中的數據。
由於一個 Service 可以鏈接到多個 EndpointSlice 之上，所以 1000 個支撐端點的限制僅影響舊版的
Endpoints API。

<!--
In that case, Kubernetes selects at most 1000 possible backend endpoints to store
into the Endpoints object, and sets an
{{< glossary_tooltip text="annotation" term_id="annotation" >}} on the Endpoints:
[`endpoints.kubernetes.io/over-capacity: truncated`](/docs/reference/labels-annotations-taints/#endpoints-kubernetes-io-over-capacity).
The control plane also removes that annotation if the number of backend Pods drops below 1000.
-->
如出現端點過多的情況，Kubernetes 選擇最多 1000 個可能的後端端點存儲到 Endpoints 對象中，
並在 Endpoints 上設置{{< glossary_tooltip text="註解" term_id="annotation" >}}
[`endpoints.kubernetes.io/over-capacity: truncated`](/zh-cn/docs/reference/labels-annotations-taints/#endpoints-kubernetes-io-over-capacity)。
如果後端 Pod 的數量降至 1000 以下，控制平面也會移除該註解。

<!--
Traffic is still sent to backends, but any load balancing mechanism that relies on the
legacy Endpoints API only sends traffic to at most 1000 of the available backing endpoints.

The same API limit means that you cannot manually update an Endpoints to have more than 1000 endpoints.
-->
請求流量仍會被髮送到後端，但任何依賴舊版 Endpoints API 的負載均衡機制最多隻能將流量發送到
1000 個可用的支撐端點。

這一 API 限制也意味着你不能手動將 Endpoints 更新爲擁有超過 1000 個端點。

<!--
### Application protocol
-->
### 應用協議    {#application-protocol}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

<!--
The `appProtocol` field provides a way to specify an application protocol for
each Service port. This is used as a hint for implementations to offer
richer behavior for protocols that they understand.
The value of this field is mirrored by the corresponding
Endpoints and EndpointSlice objects.
-->
`appProtocol` 字段提供了一種爲每個 Service 端口設置應用協議的方式。
此字段被實現代碼用作一種提示信息，以便針對實現能夠理解的協議提供更爲豐富的行爲。
此字段的取值會被映射到對應的 Endpoints 和 EndpointSlice 對象中。

<!--
This field follows standard Kubernetes label syntax. Valid values are one of:

* [IANA standard service names](https://www.iana.org/assignments/service-names).

* Implementation-defined prefixed names such as `mycompany.com/my-custom-protocol`.

* Kubernetes-defined prefixed names:

| Protocol | Description |
|----------|-------------|
| `kubernetes.io/h2c` | HTTP/2 over cleartext as described in [RFC 7540](https://www.rfc-editor.org/rfc/rfc7540) |
| `kubernetes.io/ws`  | WebSocket over cleartext as described in [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) |
| `kubernetes.io/wss` | WebSocket over TLS as described in [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) |
-->
此字段遵循標準的 Kubernetes 標籤語法。合法的取值值可以是以下之一：

- [IANA 標準服務名稱](https://www.iana.org/assignments/service-names)。
- 由具體實現所定義的、帶有 `mycompany.com/my-custom-protocol` 這類前綴的名稱。
- Kubernetes 定義的前綴名稱：

  | 協議     | 描述        |
  |----------|-------------|
  | `kubernetes.io/h2c` | 基於明文的 HTTP/2 協議，如 [RFC 7540](https://www.rfc-editor.org/rfc/rfc7540) 所述     |
  | `kubernetes.io/ws`  | 基於明文的 WebSocket 協議，如 [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) 所述  |
  | `kubernetes.io/wss` | 基於 TLS 的 WebSocket 協議，如 [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) 所述 |

<!--
### Multi-Port Services

For some Services, you need to expose more than one port.
Kubernetes lets you configure multiple port definitions on a Service object.
When using multiple ports for a Service, you must give all of your ports names
so that these are unambiguous.
For example:
-->
### 多端口 Service   {#multi-port-services}

對於某些 Service，你需要公開多個端口。Kubernetes 允許你爲 Service 對象配置多個端口定義。
爲 Service 使用多個端口時，必須爲所有端口提供名稱，以使它們無歧義。
例如：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
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

{{< note >}}
<!--
As with Kubernetes {{< glossary_tooltip term_id="name" text="names">}} in general, names for ports
must only contain lowercase alphanumeric characters and `-`. Port names must
also start and end with an alphanumeric character.

For example, the names `123-abc` and `web` are valid, but `123_abc` and `-web` are not.
-->
與一般的 Kubernetes 名稱一樣，端口名稱只能包含小寫字母、數字和 `-`。
端口名稱還必須以字母或數字開頭和結尾。

例如，名稱 `123-abc` 和 `web` 是合法的，但是 `123_abc` 和 `-web` 不合法。
{{< /note >}}

<!--
## Service type   {#publishing-services-service-types}

For some parts of your application (for example, frontends) you may want to expose a
Service onto an external IP address, one that's accessible from outside of your
cluster.

Kubernetes Service types allow you to specify what kind of Service you want.

The available `type` values and their behaviors are:
-->
## 服務類型     {#publishing-services-service-types}

對一些應用的某些部分（如前端），你可能希望將其公開於某外部 IP 地址，
也就是可以從集羣外部訪問的某個地址。

Kubernetes Service 類型允許指定你所需要的 Service 類型。

可用的 `type` 值及其行爲有：

<!--
[`ClusterIP`](#type-clusterip)
: Exposes the Service on a cluster-internal IP. Choosing this value
  makes the Service only reachable from within the cluster. This is the
  default that is used if you don't explicitly specify a `type` for a Service.
  You can expose the Service to the public internet using an
  [Ingress](/docs/concepts/services-networking/ingress/) or a
  [Gateway](https://gateway-api.sigs.k8s.io/).

[`NodePort`](#type-nodeport)
: Exposes the Service on each Node's IP at a static port (the `NodePort`).
  To make the node port available, Kubernetes sets up a cluster IP address,
  the same as if you had requested a Service of `type: ClusterIP`.
-->
`ClusterIP`
: 通過集羣的內部 IP 公開 Service，選擇該值時 Service 只能夠在集羣內部訪問。
  這也是你沒有爲 Service 顯式指定 `type` 時使用的默認值。
  你可以使用 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)
  或者 [Gateway API](https://gateway-api.sigs.k8s.io/) 向公共互聯網公開服務。

[`NodePort`](#type-nodeport)
: 通過每個節點上的 IP 和靜態端口（`NodePort`）公開 Service。
  爲了讓 Service 可通過節點端口訪問，Kubernetes 會爲 Service 配置集羣 IP 地址，
  相當於你請求了 `type: ClusterIP` 的 Service。

<!--
[`LoadBalancer`](#loadbalancer)
: Exposes the Service externally using an external load balancer. Kubernetes
  does not directly offer a load balancing component; you must provide one, or
  you can integrate your Kubernetes cluster with a cloud provider.

[`ExternalName`](#externalname)
: Maps the Service to the contents of the `externalName` field (for example,
  to the hostname `api.foo.bar.example`). The mapping configures your cluster's
  DNS server to return a `CNAME` record with that external hostname value.
  No proxying of any kind is set up.
-->
[`LoadBalancer`](#loadbalancer)
: 使用雲平臺的負載均衡器向外部公開 Service。Kubernetes 不直接提供負載均衡組件；
  你必須提供一個，或者將你的 Kubernetes 集羣與某個雲平臺集成。

[`ExternalName`](#externalname)
: 將服務映射到 `externalName` 字段的內容（例如，映射到主機名 `api.foo.bar.example`）。
  該映射將集羣的 DNS 服務器配置爲返回具有該外部主機名值的 `CNAME` 記錄。 
  集羣不會爲之創建任何類型代理。

<!--
The `type` field in the Service API is designed as nested functionality - each level
adds to the previous. However there is an exception to this nested design. You can
define a `LoadBalancer` Service by
[disabling the load balancer `NodePort` allocation](/docs/concepts/services-networking/service/#load-balancer-nodeport-allocation).
-->
服務 API 中的 `type` 字段被設計爲層層遞進的形式 - 每層都建立在前一層的基礎上。
但是，這種層層遞進的形式有一個例外。
你可以在定義 `LoadBalancer` Service 時[禁止負載均衡器分配 `NodePort`](/zh-cn/docs/concepts/services-networking/service/#load-balancer-nodeport-allocation)。

<!--
### `type: ClusterIP` {#type-clusterip}

This default Service type assigns an IP address from a pool of IP addresses that
your cluster has reserved for that purpose.

Several of the other types for Service build on the `ClusterIP` type as a
foundation.

If you define a Service that has the `.spec.clusterIP` set to `"None"` then
Kubernetes does not assign an IP address. See [headless Services](#headless-services)
for more information.
-->
### `type: ClusterIP` {#type-clusterip}

此默認 Service 類型從你的集羣中爲此預留的 IP 地址池中分配一個 IP 地址。

其他幾種 Service 類型在 `ClusterIP` 類型的基礎上進行構建。

如果你定義的 Service 將 `.spec.clusterIP` 設置爲 `"None"`，則 Kubernetes
不會爲其分配 IP 地址。有關詳細信息，請參閱[無頭服務](#headless-services)。

<!--
#### Choosing your own IP address

You can specify your own cluster IP address as part of a `Service` creation
request.  To do this, set the `.spec.clusterIP` field. For example, if you
already have an existing DNS entry that you wish to reuse, or legacy systems
that are configured for a specific IP address and difficult to re-configure.

The IP address that you choose must be a valid IPv4 or IPv6 address from within the
`service-cluster-ip-range` CIDR range that is configured for the API server.
If you try to create a Service with an invalid clusterIP address value, the API
server will return a 422 HTTP status code to indicate that there's a problem.
-->
#### 選擇自己的 IP 地址   {#choosing-your-own-ip-address}

在創建 `Service` 的請求中，你可以通過設置 `spec.clusterIP` 字段來指定自己的集羣 IP 地址。
比如，希望複用一個已存在的 DNS 條目，或者遺留系統已經配置了一個固定的 IP 且很難重新配置。

你所選擇的 IP 地址必須是合法的 IPv4 或者 IPv6 地址，並且這個 IP 地址在 API 服務器上所配置的
`service-cluster-ip-range` CIDR 範圍內。
如果你嘗試創建一個帶有非法 `clusterIP` 地址值的 Service，API 服務器會返回 HTTP 狀態碼 422，
表示值不合法。

<!--
Read [avoiding collisions](/docs/reference/networking/virtual-ips/#avoiding-collisions)
to learn how Kubernetes helps reduce the risk and impact of two different Services
both trying to use the same IP address.
-->
請閱讀[避免衝突](/zh-cn/docs/reference/networking/virtual-ips/#avoiding-collisions)節，
以瞭解 Kubernetes 如何協助降低兩個不同的 Service 試圖使用相同 IP 地址的風險和影響。

<!--
### `type: NodePort` {#type-nodeport}

If you set the `type` field to `NodePort`, the Kubernetes control plane
allocates a port from a range specified by `--service-node-port-range` flag (default: 30000-32767).
Each node proxies that port (the same port number on every Node) into your Service.
Your Service reports the allocated port in its `.spec.ports[*].nodePort` field.

Using a NodePort gives you the freedom to set up your own load balancing solution,
to configure environments that are not fully supported by Kubernetes, or even
to expose one or more nodes' IP addresses directly.
-->
### `type: NodePort`  {#type-nodeport}

如果你將 `type` 字段設置爲 `NodePort`，則 Kubernetes 控制平面將在
`--service-node-port-range` 標誌所指定的範圍內分配端口（默認值：30000-32767）。
每個節點將該端口（每個節點上的相同端口號）上的流量代理到你的 Service。
你的 Service 在其 `.spec.ports[*].nodePort` 字段中報告已分配的端口。

使用 NodePort 可以讓你自由設置自己的負載均衡解決方案，
配置 Kubernetes 不完全支持的環境，
甚至直接公開一個或多個節點的 IP 地址。

<!--
For a node port Service, Kubernetes additionally allocates a port (TCP, UDP or
SCTP to match the protocol of the Service). Every node in the cluster configures
itself to listen on that assigned port and to forward traffic to one of the ready
endpoints associated with that Service. You'll be able to contact the `type: NodePort`
Service, from outside the cluster, by connecting to any node using the appropriate
protocol (for example: TCP), and the appropriate port (as assigned to that Service).
-->
對於 NodePort 類型 Service，Kubernetes 額外分配一個端口（TCP、UDP 或 SCTP 以匹配 Service 的協議）。
集羣中的每個節點都將自己配置爲監聽所分配的端口，並將流量轉發到與該 Service 關聯的某個就緒端點。
通過使用合適的協議（例如 TCP）和適當的端口（分配給該 Service）連接到任何一個節點，
你就能夠從集羣外部訪問 `type: NodePort` 服務。

<!--
#### Choosing your own port {#nodeport-custom-port}

If you want a specific port number, you can specify a value in the `nodePort`
field. The control plane will either allocate you that port or report that
the API transaction failed.
This means that you need to take care of possible port collisions yourself.
You also have to use a valid port number, one that's inside the range configured
for NodePort use.

Here is an example manifest for a Service of `type: NodePort` that specifies
a NodePort value (30007, in this example):
-->
#### 選擇你自己的端口   {#nodeport-custom-port}

如果需要特定的端口號，你可以在 `nodePort` 字段中指定一個值。
控制平面將或者爲你分配該端口，或者報告 API 事務失敗。
這意味着你需要自行注意可能發生的端口衝突。
你還必須使用有效的端口號，該端口號在配置用於 NodePort 的範圍內。

以下是 `type: NodePort` 服務的一個清單示例，其中指定了 NodePort 值（在本例中爲 30007）：

<!--
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - port: 80
      # By default and for convenience, the `targetPort` is set to
      # the same value as the `port` field.
      targetPort: 80
      # Optional field
      # By default and for convenience, the Kubernetes control plane
      # will allocate a port from a range (default: 30000-32767)
      nodePort: 30007
```
-->
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    # 默認情況下，爲了方便起見，`targetPort` 被設置爲與 `port` 字段相同的值。
    - port: 80
      targetPort: 80
      # 可選字段
      # 默認情況下，爲了方便起見，Kubernetes 控制平面會從某個範圍內分配一個端口號
      #（默認：30000-32767）
      nodePort: 30007
```

<!--
#### Reserve Nodeport ranges to avoid collisions  {#avoid-nodeport-collisions}
-->
#### 預留 NodePort 端口範圍以避免發生衝突  {#avoid-nodeport-collisions}

<!--
The policy for assigning ports to NodePort services applies to both the auto-assignment and
the manual assignment scenarios. When a user wants to create a NodePort service that
uses a specific port, the target port may conflict with another port that has already been assigned.

To avoid this problem, the port range for NodePort services is divided into two bands.
Dynamic port assignment uses the upper band by default, and it may use the lower band once the 
upper band has been exhausted. Users can then allocate from the lower band with a lower risk of port collision.
-->
爲 NodePort 服務分配端口的策略既適用於自動分配的情況，也適用於手動分配的場景。
當某個用於希望創建一個使用特定端口的 NodePort 服務時，該目標端口可能與另一個已經被分配的端口衝突。

爲了避免這個問題，用於 NodePort 服務的端口範圍被分爲兩段。
動態端口分配默認使用較高的端口段，並且在較高的端口段耗盡時也可以使用較低的端口段。
用戶可以從較低端口段中分配端口，降低端口衝突的風險。

<!--
#### Custom IP address configuration for `type: NodePort` Services {#service-nodeport-custom-listen-address}

You can set up nodes in your cluster to use a particular IP address for serving node port
services. You might want to do this if each node is connected to multiple networks (for example:
one network for application traffic, and another network for traffic between nodes and the
control plane).

If you want to specify particular IP address(es) to proxy the port, you can set the
`--nodeport-addresses` flag for kube-proxy or the equivalent `nodePortAddresses`
field of the [kube-proxy configuration file](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
to particular IP block(s).
-->
#### 爲 `type: NodePort` 服務自定義 IP 地址配置  {#service-nodeport-custom-listen-address}

你可以配置集羣中的節點使用特定 IP 地址來支持 NodePort 服務。
如果每個節點都連接到多個網絡（例如：一個網絡用於應用流量，另一網絡用於節點和控制平面之間的流量），
你可能想要這樣做。

如果你要指定特定的 IP 地址來爲端口提供代理，可以將 kube-proxy 的 `--nodeport-addresses` 標誌或
[kube-proxy 配置文件](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/)中的等效字段
`nodePortAddresses` 設置爲特定的 IP 段。

<!--
This flag takes a comma-delimited list of IP blocks (e.g. `10.0.0.0/8`, `192.0.2.0/25`)
to specify IP address ranges that kube-proxy should consider as local to this node.

For example, if you start kube-proxy with the `--nodeport-addresses=127.0.0.0/8` flag,
kube-proxy only selects the loopback interface for NodePort Services.
The default for `--nodeport-addresses` is an empty list.
This means that kube-proxy should consider all available network interfaces for NodePort.
(That's also compatible with earlier Kubernetes releases.)
-->
此標誌接受逗號分隔的 IP 段列表（例如 `10.0.0.0/8`、`192.0.2.0/25`），用來設置 IP 地址範圍。
kube-proxy 應視將其視爲所在節點的本機地址。

例如，如果你使用 `--nodeport-addresses=127.0.0.0/8` 標誌啓動 kube-proxy，
則 kube-proxy 僅選擇 NodePort 服務的本地迴路接口。
`--nodeport-addresses` 的默認值是一個空的列表。
這意味着 kube-proxy 將認爲所有可用網絡接口都可用於 NodePort 服務
（這也與早期的 Kubernetes 版本兼容。）

{{< note >}}
<!--
This Service is visible as `<NodeIP>:spec.ports[*].nodePort` and `.spec.clusterIP:spec.ports[*].port`.
If the `--nodeport-addresses` flag for kube-proxy or the equivalent field
in the kube-proxy configuration file is set, `<NodeIP>` would be a filtered
node IP address (or possibly IP addresses).
-->
此 Service 的可見形式爲 `<NodeIP>:spec.ports[*].nodePort` 以及 `.spec.clusterIP:spec.ports[*].port`。
如果設置了 kube-proxy 的 `--nodeport-addresses` 標誌或 kube-proxy 配置文件中的等效字段，
則 `<NodeIP>` 將是一個被過濾的節點 IP 地址（或可能是多個 IP 地址）。
{{< /note >}}

<!--
### `type: LoadBalancer` {#loadbalancer}

On cloud providers which support external load balancers, setting the `type`
field to `LoadBalancer` provisions a load balancer for your Service.
The actual creation of the load balancer happens asynchronously, and
information about the provisioned balancer is published in the Service's
`.status.loadBalancer` field.
For example:
-->
### `type: LoadBalancer`  {#loadbalancer}

在使用支持外部負載均衡器的雲平臺時，如果將 `type` 設置爲 `"LoadBalancer"`，
則平臺會爲 Service 提供負載均衡器。
負載均衡器的實際創建過程是異步進行的，關於所製備的負載均衡器的信息將會通過 Service 的
`status.loadBalancer` 字段公開出來。
例如：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
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
Traffic from the external load balancer is directed at the backend Pods. The cloud
provider decides how it is load balanced.
-->
來自外部負載均衡器的流量將被直接重定向到後端各個 Pod 上，雲平臺決定如何進行負載平衡。

<!--
To implement a Service of `type: LoadBalancer`, Kubernetes typically starts off
by making the changes that are equivalent to you requesting a Service of
`type: NodePort`. The cloud-controller-manager component then configures the external
load balancer to forward traffic to that assigned node port.

You can configure a load balanced Service to
[omit](#load-balancer-nodeport-allocation) assigning a node port, provided that the
cloud provider implementation supports this.
-->
要實現 `type: LoadBalancer` 的服務，Kubernetes 通常首先進行與請求 `type: NodePort`
服務類似的更改。cloud-controller-manager 組件隨後配置外部負載均衡器，
以將流量轉發到所分配的節點端口。

你可以將負載均衡 Service 配置爲[忽略](#load-balancer-nodeport-allocation)分配節點端口，
前提是雲平臺實現支持這點。

<!--
Some cloud providers allow you to specify the `loadBalancerIP`. In those cases, the load-balancer is created
with the user-specified `loadBalancerIP`. If the `loadBalancerIP` field is not specified,
the load Balancer is set up with an ephemeral IP address. If you specify a `loadBalancerIP`
but your cloud provider does not support the feature, the `loadbalancerIP` field that you
set is ignored.
-->
某些雲平臺允許你設置 `loadBalancerIP`。這時，平臺將使用用戶指定的 `loadBalancerIP`
來創建負載均衡器。如果沒有設置 `loadBalancerIP` 字段，平臺將會給負載均衡器分配一個臨時 IP。
如果設置了 `loadBalancerIP`，但云平臺並不支持這一特性，所設置的 `loadBalancerIP` 值將會被忽略。

{{< note >}}
<!--
The`.spec.loadBalancerIP` field for a Service was deprecated in Kubernetes v1.24.

This field was under-specified and its meaning varies across implementations.
It also cannot support dual-stack networking. This field may be removed in a future API version.
-->
針對 Service 的 `.spec.loadBalancerIP` 字段已在 Kubernetes v1.24 中被棄用。

此字段的定義模糊，其含義因實現而異。它也不支持雙協議棧聯網。
此字段可能會在未來的 API 版本中被移除。

<!--
If you're integrating with a provider that supports specifying the load balancer IP address(es)
for a Service via a (provider specific) annotation, you should switch to doing that.

If you are writing code for a load balancer integration with Kubernetes, avoid using this field.
You can integrate with [Gateway](https://gateway-api.sigs.k8s.io/) rather than Service, or you
can define your own (provider specific) annotations on the Service that specify the equivalent detail.
-->
如果你正在集成某雲平臺，該平臺通過（特定於平臺的）註解爲 Service 指定負載均衡器 IP 地址，
你應該切換到這種做法。

如果你正在爲集成到 Kubernetes 的負載均衡器編寫代碼，請避免使用此字段。
你可以與 [Gateway](https://gateway-api.sigs.k8s.io/) 而不是 Service 集成，
或者你可以在 Service 上定義自己的（特定於提供商的）註解，以指定等效的細節。
{{< /note >}}

<!--
#### Node liveness impact on load balancer traffic

Load balancer health checks are critical to modern applications. They are used to
determine which server (virtual machine, or IP address) the load balancer should
dispatch traffic to. The Kubernetes APIs do not define how health checks have to be
implemented for Kubernetes managed load balancers, instead it's the cloud providers
(and the people implementing integration code) who decide on the behavior. Load
balancer health checks are extensively used within the context of supporting the
`externalTrafficPolicy` field for Services.
-->
#### 節點存活態對負載均衡器流量的影響

負載均衡器運行狀態檢查對於現代應用程序至關重要，
它們用於確定負載均衡器應將流量分派到哪個服務器（虛擬機或 IP 地址）。
Kubernetes API 沒有定義如何爲 Kubernetes 託管負載均衡器實施運行狀況檢查，
而是由雲提供商（以及集成代碼的實現人員）決定其行爲。
負載均衡器運行狀態檢查廣泛用於支持 Service 的 `externalTrafficPolicy` 字段。

<!--
#### Load balancers with mixed protocol types
-->
#### 混合協議類型的負載均衡器

{{< feature-state feature_gate_name="MixedProtocolLBService" >}}

<!--
By default, for LoadBalancer type of Services, when there is more than one port defined, all
ports must have the same protocol, and the protocol must be one which is supported
by the cloud provider.

The feature gate `MixedProtocolLBService` (enabled by default for the kube-apiserver as of v1.24) allows the use of
different protocols for LoadBalancer type of Services, when there is more than one port defined.
-->
默認情況下，對於 LoadBalancer 類型的 Service，當其中定義了多個端口時，
所有端口必須使用相同的協議，並且該協議必須是被雲平臺支持的。

當服務中定義了多個端口時，特性門控 `MixedProtocolLBService`（從 kube-apiserver 1.24
版本起默認爲啓用）允許 LoadBalancer 類型的服務使用不同的協議。

{{< note >}}
<!--
The set of protocols that can be used for load balanced Services is defined by your
cloud provider; they may impose restrictions beyond what the Kubernetes API enforces.
-->
可用於負載均衡服務的協議集合由你的雲平臺決定，他們可能在
Kubernetes API 強制執行的限制之外另加一些約束。
{{< /note >}}

<!--
#### Disabling load balancer NodePort allocation {#load-balancer-nodeport-allocation}
-->
### 禁用負載均衡服務的節點端口分配 {#load-balancer-nodeport-allocation}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
You can optionally disable node port allocation for a Service of `type: LoadBalancer`, by setting
the field `spec.allocateLoadBalancerNodePorts` to `false`. This should only be used for load balancer implementations
that route traffic directly to pods as opposed to using node ports. By default, `spec.allocateLoadBalancerNodePorts`
is `true` and type LoadBalancer Services will continue to allocate node ports. If `spec.allocateLoadBalancerNodePorts`
is set to `false` on an existing Service with allocated node ports, those node ports will **not** be de-allocated automatically.
You must explicitly remove the `nodePorts` entry in every Service port to de-allocate those node ports.
-->
通過設置 Service 的 `spec.allocateLoadBalancerNodePorts` 爲 `false`，你可以對 LoadBalancer
類型的 Service 禁用節點端口分配操作。
這僅適用於負載均衡器的實現能夠直接將流量路由到 Pod 而不是使用節點端口的情況。
默認情況下，`spec.allocateLoadBalancerNodePorts` 爲 `true`，LoadBalancer 類型的 Service
也會繼續分配節點端口。如果某已有 Service 已被分配節點端口，如果將其屬性
`spec.allocateLoadBalancerNodePorts` 設置爲 `false`，這些節點端口**不會**被自動釋放。
你必須顯式地在每個 Service 端口中刪除 `nodePorts` 項以釋放對應的端口。

<!--
#### Specifying class of load balancer implementation {#load-balancer-class}
-->
#### 設置負載均衡器實現的類別 {#load-balancer-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
For a Service with `type` set to `LoadBalancer`, the `.spec.loadBalancerClass` field
enables you to use a load balancer implementation other than the cloud provider default.

By default, `.spec.loadBalancerClass` is not set and a `LoadBalancer`
type of Service uses the cloud provider's default load balancer implementation if the
cluster is configured with a cloud provider using the `--cloud-provider` component
flag.
-->
對於 `type` 設置爲 `LoadBalancer` 的 Service，`spec.loadBalancerClass`
字段允許你使用有別於雲平臺的默認負載均衡器的實現。

默認情況下，`.spec.loadBalancerClass` 是未設置的，如果集羣使用 `--cloud-provider`
件標誌配置了雲平臺，`LoadBalancer` 類型 Service 會使用雲平臺的默認負載均衡器實現。

<!--
If you specify `.spec.loadBalancerClass`, it is assumed that a load balancer
implementation that matches the specified class is watching for Services.
Any default load balancer implementation (for example, the one provided by
the cloud provider) will ignore Services that have this field set.
`spec.loadBalancerClass` can be set on a Service of type `LoadBalancer` only.
Once set, it cannot be changed.
-->
如果你設置了 `.spec.loadBalancerClass`，則假定存在某個與所指定的類相匹配的負載均衡器實現在監視
Service 變更。所有默認的負載均衡器實現（例如，由雲平臺所提供的）都會忽略設置了此字段的 Service。
`.spec.loadBalancerClass` 只能設置到類型爲 `LoadBalancer` 的 Service 之上，
而且一旦設置之後不可變更。

<!--
The value of `spec.loadBalancerClass` must be a label-style identifier,
with an optional prefix such as "`internal-vip`" or "`example.com/internal-vip`".
Unprefixed names are reserved for end-users.
-->
`.spec.loadBalancerClass` 的值必須是一個標籤風格的標識符，
可以有選擇地帶有類似 "`internal-vip`" 或 "`example.com/internal-vip`" 這類前綴。
沒有前綴的名字是保留給最終用戶的。

<!--
#### Load balancer IP address mode {#load-balancer-ip-mode}
-->
#### 負載均衡器 IP 地址模式    {#load-balancer-ip-mode}

{{< feature-state feature_gate_name="LoadBalancerIPMode" >}}

<!--
For a Service of `type: LoadBalancer`, a controller can set `.status.loadBalancer.ingress.ipMode`. 
The `.status.loadBalancer.ingress.ipMode` specifies how the load-balancer IP behaves. 
It may be specified only when the `.status.loadBalancer.ingress.ip` field is also specified.
-->
對於 `type: LoadBalancer` 的 Service，控制器可以設置 `.status.loadBalancer.ingress.ipMode`。
`.status.loadBalancer.ingress.ipMode` 指定負載均衡器 IP 的行爲方式。
此字段只能在 `.status.loadBalancer.ingress.ip` 字段也被指定時才能指定。

<!--
There are two possible values for `.status.loadBalancer.ingress.ipMode`: "VIP" and "Proxy". 
The default value is "VIP" meaning that traffic is delivered to the node 
with the destination set to the load-balancer's IP and port. 
There are two cases when setting this to "Proxy", depending on how the load-balancer 
from the cloud provider delivers the traffics:
-->
`.status.loadBalancer.ingress.ipMode` 有兩個可能的值："VIP" 和 "Proxy"。
默認值是 "VIP"，意味着流量被傳遞到目的地設置爲負載均衡器 IP 和端口的節點上。
將此字段設置爲 "Proxy" 時會出現兩種情況，具體取決於雲驅動提供的負載均衡器如何傳遞流量：

<!--
- If the traffic is delivered to the node then DNATed to the pod, the destination would be set to the node's IP and node port;
- If the traffic is delivered directly to the pod, the destination would be set to the pod's IP and port.
-->
- 如果流量被傳遞到節點，然後 DNAT 到 Pod，則目的地將被設置爲節點的 IP 和節點端口；
- 如果流量被直接傳遞到 Pod，則目的地將被設置爲 Pod 的 IP 和端口。

<!--
Service implementations may use this information to adjust traffic routing.
-->
服務實現可以使用此信息來調整流量路由。

<!--
#### Internal load balancer

In a mixed environment it is sometimes necessary to route traffic from Services inside the same
(virtual) network address block.

In a split-horizon DNS environment you would need two Services to be able to route both external
and internal traffic to your endpoints.

To set an internal load balancer, add one of the following annotations to your Service
depending on the cloud service provider you're using:
-->
#### 內部負載均衡器 {#internal-load-balancer}

在混合環境中，有時有必要在同一（虛擬）網絡地址段內路由來自 Service 的流量。

在水平分割（Split-Horizon）DNS 環境中，你需要兩個 Service 才能將內部和外部流量都路由到你的端點。

如要設置內部負載均衡器，請根據你所使用的雲平臺，爲 Service 添加以下註解之一：

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}

<!--
Select one of the tabs.
-->
選擇一個標籤。

{{% /tab %}}
{{% tab name="GCP" %}}

```yaml
metadata:
  name: my-service
  annotations:
    networking.gke.io/load-balancer-type: "Internal"
```

{{% /tab %}}
{{% tab name="AWS" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internal"
```

{{% /tab %}}
{{% tab name="Azure" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
```

{{% /tab %}}
{{% tab name="IBM Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.kubernetes.io/ibm-load-balancer-cloud-provider-ip-type: "private"
```

{{% /tab %}}
{{% tab name="OpenStack" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
```

{{% /tab %}}
<!--
Baidu Cloud
-->
{{% tab name="百度雲" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
```

{{% /tab %}}
<!--
Tencent Cloud
-->
{{% tab name="騰訊雲" %}}

```yaml
metadata:
  annotations:
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
```

{{% /tab %}}
<!--
Alibaba Cloud
-->
{{% tab name="阿里雲" %}}

```yaml
metadata:
  annotations:
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-address-type: "intranet"
```

{{% /tab %}}
{{% tab name="OCI" %}}

```yaml
metadata:
  name: my-service
  annotations:
      service.beta.kubernetes.io/oci-load-balancer-internal: true
```
{{% /tab %}}
{{< /tabs >}}

<!--
### `type: ExternalName` {#externalname}

Services of type ExternalName map a Service to a DNS name, not to a typical selector such as
`my-service` or `cassandra`. You specify these Services with the `spec.externalName` parameter.

This Service definition, for example, maps
the `my-service` Service in the `prod` namespace to `my.database.example.com`:
-->
### ExternalName 類型         {#externalname}

類型爲 ExternalName 的 Service 將 Service 映射到 DNS 名稱，而不是典型的選擇算符，
例如 `my-service` 或者 `cassandra`。你可以使用 `spec.externalName` 參數指定這些服務。

例如，以下 Service 定義將 `prod` 名字空間中的 `my-service` 服務映射到 `my.database.example.com`：

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

{{< note >}}
<!--
A Service of `type: ExternalName` accepts an IPv4 address string,
but treats that string as a DNS name comprised of digits,
not as an IP address (the internet does not however allow such names in DNS).
Services with external names that resemble IPv4
addresses are not resolved by DNS servers.

If you want to map a Service directly to a specific IP address, consider using
[headless Services](#headless-services).
-->
`type: ExternalName` 的服務接受 IPv4 地址字符串，但將該字符串視爲由數字組成的 DNS 名稱，
而不是 IP 地址（然而，互聯網不允許在 DNS 中使用此類名稱）。
類似於 IPv4 地址的外部名稱無法被 DNS 服務器解析。

如果你想要將服務直接映射到某特定 IP 地址，請考慮使用[無頭服務](#headless-services)。
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
當查找主機 `my-service.prod.svc.cluster.local` 時，集羣 DNS 服務返回 `CNAME` 記錄，
其值爲 `my.database.example.com`。訪問 `my-service` 的方式與訪問其他 Service 的方式相同，
主要區別在於重定向發生在 DNS 級別，而不是通過代理或轉發來完成。
如果後來你決定將數據庫移到集羣中，則可以啓動其 Pod，添加適當的選擇算符或端點並更改
Service 的 `type`。

{{< caution >}}
<!--
You may have trouble using ExternalName for some common protocols, including HTTP and HTTPS.
If you use ExternalName then the hostname used by clients inside your cluster is different from
the name that the ExternalName references.

For protocols that use hostnames this difference may lead to errors or unexpected responses.
HTTP requests will have a `Host:` header that the origin server does not recognize;
TLS servers will not be able to provide a certificate matching the hostname that the client connected to.
-->
針對 ExternalName 服務使用一些常見的協議，包括 HTTP 和 HTTPS，可能會有問題。
如果你使用 ExternalName 服務，那麼集羣內客戶端使用的主機名與 ExternalName 引用的名稱不同。

對於使用主機名的協議，這一差異可能會導致錯誤或意外響應。
HTTP 請求將具有源服務器無法識別的 `Host:` 標頭；
TLS 服務器將無法提供與客戶端連接的主機名匹配的證書。
{{< /caution >}}

<!--
## Headless Services  {#headless-services}

Sometimes you don't need load-balancing and a single Service IP.  In
this case, you can create what are termed _headless Services_, by explicitly
specifying `"None"` for the cluster IP address (`.spec.clusterIP`).

You can use a headless Service to interface with other service discovery mechanisms,
without being tied to Kubernetes' implementation.

For headless Services, a cluster IP is not allocated, kube-proxy does not handle
these Services, and there is no load balancing or proxying done by the platform for them.
-->
## 無頭服務（Headless Services）  {#headless-services}

有時你並不需要負載均衡，也不需要單獨的 Service IP。遇到這種情況，可以通過顯式設置
集羣 IP（`spec.clusterIP`）的值爲 `"None"` 來創建**無頭服務（Headless Service）**。

你可以使用無頭 Service 與其他服務發現機制交互，而不必綁定到 Kubernetes 的實現。

無頭 Service 不會獲得集羣 IP，kube-proxy 不會處理這類 Service，
而且平臺也不會爲它們提供負載均衡或路由支持。

<!--
A headless Service allows a client to connect to whichever Pod it prefers, directly. Services that are headless don't
configure routes and packet forwarding using
[virtual IP addresses and proxies](/docs/reference/networking/virtual-ips/); instead, headless Services report the
endpoint IP addresses of the individual pods via internal DNS records, served through the cluster's
[DNS service](/docs/concepts/services-networking/dns-pod-service/).
To define a headless Service, you make a Service with `.spec.type` set to ClusterIP (which is also the default for `type`),
and you additionally set `.spec.clusterIP` to None.
-->
無頭 Service 允許客戶端直接連接到它所偏好的任一 Pod。
無頭 Service 不使用[虛擬 IP 地址和代理](/zh-cn/docs/reference/networking/virtual-ips/)
配置路由和數據包轉發；相反，無頭 Service 通過內部 DNS 記錄報告各個
Pod 的端點 IP 地址，這些 DNS 記錄是由集羣的
[DNS 服務](/zh-cn/docs/concepts/services-networking/dns-pod-service/)所提供的。
這些 DNS 記錄是由集羣內部 DNS 服務所提供的
要定義無頭 Service，你需要將 `.spec.type` 設置爲 ClusterIP（這也是 `type`
的默認值），並進一步將 `.spec.clusterIP` 設置爲 `None`。

<!--
The string value None is a special case and is not the same as leaving the `.spec.clusterIP` field unset.

How DNS is automatically configured depends on whether the Service has selectors defined:
-->
字符串值 None 是一種特殊情況，與未設置 `.spec.clusterIP` 字段不同。

DNS 如何自動配置取決於 Service 是否定義了選擇器：

<!--
### With selectors

For headless Services that define selectors, the Kubernetes control plane creates
EndpointSlices in the Kubernetes API, and modifies the DNS configuration to return
A or AAAA records (IPv4 or IPv6 addresses) that point directly to the Pods backing
the Service.
-->
### 帶選擇算符的服務 {#with-selectors}

對定義了選擇算符的無頭 Service，Kubernetes 控制平面在 Kubernetes API 中創建
EndpointSlice 對象，並且修改 DNS 配置返回 A 或 AAAA 記錄（IPv4 或 IPv6 地址），
這些記錄直接指向 Service 的後端 Pod 集合。

<!--
### Without selectors

For headless Services that do not define selectors, the control plane does
not create EndpointSlice objects. However, the DNS system looks for and configures
either:
-->
### 無選擇算符的服務  {#without-selectors}

對沒有定義選擇算符的無頭 Service，控制平面不會創建 EndpointSlice 對象。
然而 DNS 系統會執行以下操作之一：

<!--
* DNS CNAME records for [`type: ExternalName`](#externalname) Services.
* DNS A / AAAA records for all IP addresses of the Service's ready endpoints,
  for all Service types other than `ExternalName`.
  * For IPv4 endpoints, the DNS system creates A records.
  * For IPv6 endpoints, the DNS system creates AAAA records.
-->
* 對於 [`type: ExternalName`](#externalname) Service，查找和配置其 CNAME 記錄；
* 對所有其他類型的 Service，針對 Service 的就緒端點的所有 IP 地址，查找和配置
  DNS A / AAAA 記錄：
  * 對於 IPv4 端點，DNS 系統創建 A 記錄。
  * 對於 IPv6 端點，DNS 系統創建 AAAA 記錄。

<!--
When you define a headless Service without a selector, the `port` must
match the `targetPort`.
-->
當你定義無選擇算符的無頭 Service 時，`port` 必須與 `targetPort` 匹配。

<!--
## Discovering services

For clients running inside your cluster, Kubernetes supports two primary modes of
finding a Service: environment variables and DNS.
-->
## 服務發現  {#discovering-services}

對於在集羣內運行的客戶端，Kubernetes 支持兩種主要的服務發現模式：環境變量和 DNS。

<!--
### Environment variables

When a Pod is run on a Node, the kubelet adds a set of environment variables
for each active Service. It adds `{SVCNAME}_SERVICE_HOST` and `{SVCNAME}_SERVICE_PORT` variables,
where the Service name is upper-cased and dashes are converted to underscores.

For example, the Service `redis-primary` which exposes TCP port 6379 and has been
allocated cluster IP address 10.0.0.11, produces the following environment
variables:
-->
### 環境變量   {#environment-variables}

當 Pod 運行在某 Node 上時，kubelet 會在其中爲每個活躍的 Service 添加一組環境變量。
kubelet 會添加環境變量 `{SVCNAME}_SERVICE_HOST` 和 `{SVCNAME}_SERVICE_PORT`。
這裏 Service 的名稱被轉爲大寫字母，橫線被轉換成下劃線。

例如，一個 Service `redis-primary` 公開了 TCP 端口 6379，
同時被分配了集羣 IP 地址 10.0.0.11，這個 Service 生成的環境變量如下：

```shell
REDIS_PRIMARY_SERVICE_HOST=10.0.0.11
REDIS_PRIMARY_SERVICE_PORT=6379
REDIS_PRIMARY_PORT=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP_PROTO=tcp
REDIS_PRIMARY_PORT_6379_TCP_PORT=6379
REDIS_PRIMARY_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
<!--
When you have a Pod that needs to access a Service, and you are using
the environment variable method to publish the port and cluster IP to the client
Pods, you must create the Service *before* the client Pods come into existence.
Otherwise, those client Pods won't have their environment variables populated.

If you only use DNS to discover the cluster IP for a Service, you don't need to
worry about this ordering issue.
-->
當你的 Pod 需要訪問某 Service，並且你在使用環境變量方法將端口和集羣 IP 發佈到客戶端
Pod 時，必須在客戶端 Pod 出現**之前**創建該 Service。
否則，這些客戶端 Pod 中將不會出現對應的環境變量。

如果僅使用 DNS 來發現 Service 的集羣 IP，則無需擔心此順序問題。
{{< /note >}}

<!--
Kubernetes also supports and provides variables that are compatible with Docker
Engine's "_[legacy container links](https://docs.docker.com/network/links/)_" feature.
You can read [`makeLinkVariables`](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)
to see how this is implemented in Kubernetes.
-->
Kubernetes 還支持並提供與 Docker Engine 的
"**[legacy container links](https://docs.docker.com/network/links/)**"
兼容的變量。
你可以閱讀 [makeLinkVariables](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)
來了解這是如何在 Kubernetes 中實現的。

### DNS

<!--
You can (and almost always should) set up a DNS service for your Kubernetes
cluster using an [add-on](/docs/concepts/cluster-administration/addons/).

A cluster-aware DNS server, such as CoreDNS, watches the Kubernetes API for new
Services and creates a set of DNS records for each one.  If DNS has been enabled
throughout your cluster then all Pods should automatically be able to resolve
Services by their DNS name.
-->
你可以（並且幾乎總是應該）使用[插件（add-on）](/zh-cn/docs/concepts/cluster-administration/addons/)
來爲 Kubernetes 集羣安裝 DNS 服務。

能夠感知集羣的 DNS 服務器（例如 CoreDNS）會監視 Kubernetes API 中的新 Service，
併爲每個 Service 創建一組 DNS 記錄。如果在整個集羣中都啓用了 DNS，則所有 Pod
都應該能夠通過 DNS 名稱自動解析 Service。

<!--
For example, if you have a Service called `my-service` in a Kubernetes
namespace `my-ns`, the control plane and the DNS Service acting together
create a DNS record for `my-service.my-ns`. Pods in the `my-ns` namespace
should be able to find the service by doing a name lookup for `my-service`
(`my-service.my-ns` would also work).

Pods in other namespaces must qualify the name as `my-service.my-ns`. These names
will resolve to the cluster IP assigned for the Service.
-->
例如，如果你在 Kubernetes 命名空間 `my-ns` 中有一個名爲 `my-service` 的 Service，
則控制平面和 DNS 服務共同爲 `my-service.my-ns` 生成 DNS 記錄。
名字空間 `my-ns` 中的 Pod 應該能夠通過按名檢索 `my-service` 來找到服務
（`my-service.my-ns` 也可以）。

其他名字空間中的 Pod 必須將名稱限定爲 `my-service.my-ns`。
這些名稱將解析爲分配給 Service 的集羣 IP。

<!--
Kubernetes also supports DNS SRV (Service) records for named ports.  If the
`my-service.my-ns` Service has a port named `http` with the protocol set to
`TCP`, you can do a DNS SRV query for `_http._tcp.my-service.my-ns` to discover
the port number for `http`, as well as the IP address.

The Kubernetes DNS server is the only way to access `ExternalName` Services.
You can find more information about `ExternalName` resolution in
[DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/).
-->
Kubernetes 還支持命名端口的 DNS SRV（Service）記錄。
如果 Service `my-service.my-ns` 具有名爲 `http`　的端口，且協議設置爲 TCP，
則可以用 `_http._tcp.my-service.my-ns` 執行 DNS SRV 查詢以發現 `http` 的端口號以及 IP 地址。

Kubernetes DNS 服務器是唯一的一種能夠訪問 `ExternalName` 類型的 Service 的方式。
關於 `ExternalName` 解析的更多信息可以查看
[Service 與 Pod 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。

<!-- preserve existing hyperlinks -->
<a id="shortcomings" />
<a id="the-gory-details-of-virtual-ips" />
<a id="proxy-modes" />
<a id="proxy-mode-userspace" />
<a id="proxy-mode-iptables" />
<a id="proxy-mode-ipvs" />
<a id="ips-and-vips" />

<!--
## Virtual IP addressing mechanism

Read [Virtual IPs and Service Proxies](/docs/reference/networking/virtual-ips/) to learn about the
mechanism Kubernetes provides to expose a Service with a virtual IP address.
-->
## 虛擬 IP 尋址機制   {#virtual-ip-addressing-mechanism}

閱讀[虛擬 IP 和 Service 代理](/zh-cn/docs/reference/networking/virtual-ips/)以瞭解
Kubernetes 提供的使用虛擬 IP 地址公開服務的機制。

<!--
### Traffic distribution
-->
### 流量分發   {#traffic-distribution}

{{< feature-state feature_gate_name="ServiceTrafficDistribution" >}}

<!--
The `.spec.trafficDistribution` field provides another way to influence traffic
routing within a Kubernetes Service. While traffic policies focus on strict
semantic guarantees, traffic distribution allows you to express _preferences_
(such as routing to topologically closer endpoints). This can help optimize for
performance, cost, or reliability. In Kubernetes {{< skew currentVersion >}}, the
following field value is supported: 
-->
`.spec.trafficDistribution` 字段提供了另一種影響 Kubernetes Service 內流量路由的方法。
雖然流量策略側重於嚴格的語義保證，但流量分發允許你表達一定的**偏好**（例如路由到拓撲上更接近的端點）。
這一機制有助於優化性能、成本或可靠性。
Kubernetes {{< skew currentVersion >}} 支持以下字段值：

<!--
`PreferClose`
: Indicates a preference for routing traffic to endpoints that are in the same
  zone as the client.
-->
`PreferClose`
: 表示優先將流量路由到與客戶端處於同一區域中的端點。

{{< feature-state feature_gate_name="PreferSameTrafficDistribution" >}}

<!--
In Kubernetes {{< skew currentVersion >}}, two additional values are
available (unless the `PreferSameTrafficDistribution` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) is
disabled):

`PreferSameZone`
: This is an alias for `PreferClose` that is clearer about the intended semantics.

`PreferSameNode`
: Indicates a preference for routing traffic to endpoints that are on the same
  node as the client.
-->
在 Kubernetes {{< skew currentVersion >}} 中，
另外提供了兩個可選值（除非禁用了 `PreferSameTrafficDistribution` 
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) ）：

`PreferSameZone`  
: 這是 `PreferClose` 的別名，但它更清晰地表達了預期的語義。

`PreferSameNode`  
: 表示優先將流量路由到與客戶端處於同一節點上的端點。

<!--
If the field is not set, the implementation will apply its default routing strategy.

See [Traffic
Distribution](/docs/reference/networking/virtual-ips/#traffic-distribution) for
more details
-->
如果未設置該字段，實現將應用其默認路由策略，
詳見[流量分發](/zh-cn/docs/reference/networking/virtual-ips/#traffic-distribution)。

<!--
### Traffic policies

You can set the `.spec.internalTrafficPolicy` and `.spec.externalTrafficPolicy` fields
to control how Kubernetes routes traffic to healthy (“ready”) backends.

See [Traffic Policies](/docs/reference/networking/virtual-ips/#traffic-policies) for more details.
-->
### 流量策略    {#traffic-policies}

你可以設置 `.spec.internalTrafficPolicy` 和 `.spec.externalTrafficPolicy`
字段來控制 Kubernetes 如何將流量路由到健康（“就緒”）的後端。

有關詳細信息，請參閱[流量策略](/zh-cn/docs/reference/networking/virtual-ips/#traffic-policies)。

<!--
## Session stickiness

If you want to make sure that connections from a particular client are passed to
the same Pod each time, you can configure session affinity based on the client's
IP address. Read [session affinity](/docs/reference/networking/virtual-ips/#session-affinity)
to learn more.
-->
## 會話的黏性   {#session-stickiness}

如果你想確保來自特定客戶端的連接每次都傳遞到同一個 Pod，你可以配置基於客戶端 IP
地址的會話親和性。可閱讀[會話親和性](/zh-cn/docs/reference/networking/virtual-ips/#session-affinity)
來進一步學習。

<!--
### External IPs

If there are external IPs that route to one or more cluster nodes, Kubernetes Services
can be exposed on those `externalIPs`. When network traffic arrives into the cluster, with
the external IP (as destination IP) and the port matching that Service, rules and routes
that Kubernetes has configured ensure that the traffic is routed to one of the endpoints
for that Service.

When you define a Service, you can specify `externalIPs` for any
[service type](#publishing-services-service-types).
In the example below, the Service named `"my-service"` can be accessed by clients using TCP,
on `"198.51.100.32:80"` (calculated from `.spec.externalIPs[]` and `.spec.ports[].port`).
-->
### 外部 IP  {#external-ips}

如果有外部 IP 能夠路由到一個或多個集羣節點上，則 Kubernetes Service 可以在這些 `externalIPs`
上公開出去。當網絡流量進入集羣時，如果外部 IP（作爲目的 IP 地址）和端口都與該 Service 匹配，
Kubernetes 所配置的規則和路由會確保流量被路由到該 Service 的端點之一。

定義 Service 時，你可以爲任何[服務類型](#publishing-services-service-types)指定 `externalIPs`。

在下面的例子中，名爲 `my-service` 的 Service 可以在 "`198.51.100.32:80`"
（根據 `.spec.externalIPs[]` 和 `.spec.ports[].port` 得出）上被客戶端使用 TCP 協議訪問。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 49152
  externalIPs:
    - 198.51.100.32
```

{{< note >}}
<!--
Kubernetes does not manage allocation of `externalIPs`; these are the responsibility
of the cluster administrator.
-->
Kubernetes 不負責管理 `externalIPs` 的分配，這一工作是集羣管理員的職責。
{{< /note >}}

<!--
## API Object

Service is a top-level resource in the Kubernetes REST API. You can find more details
about the [Service API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).
-->
## API 對象   {#api-object}

Service 是 Kubernetes REST API 中的頂級資源。你可以找到有關
[Service 對象 API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
的更多詳細信息。

<!-- preserve existing hyperlinks -->
<a id="shortcomings" /><a id="#the-gory-details-of-virtual-ips" />

## {{% heading "whatsnext" %}}

<!--
Learn more about Services and how they fit into Kubernetes:

* Follow the [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
  tutorial.
* Read about [Ingress](/docs/concepts/services-networking/ingress/), which
  exposes HTTP and HTTPS routes from outside the cluster to Services within
  your cluster.
* Read about [Gateway](/docs/concepts/services-networking/gateway/), an extension to
  Kubernetes that provides more flexibility than Ingress.
-->
進一步學習 Service 及其在 Kubernetes 中所發揮的作用：

* 完成[使用 Service 連接到應用](/zh-cn/docs/tutorials/services/connect-applications-service/)教程。
* 閱讀 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 文檔。Ingress
  負責將來自集羣外部的 HTTP 和 HTTPS 請求路由給集羣內的服務。
* 閱讀 [Gateway](/zh-cn/docs/concepts/services-networking/gateway/) 文檔。Gateway 作爲 Kubernetes 的擴展提供比
  Ingress 更高的靈活性。

<!--
For more context, read the following:

* [Virtual IPs and Service Proxies](/docs/reference/networking/virtual-ips/)
* [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
* [Service API reference](/docs/reference/kubernetes-api/service-resources/service-v1/)
* [EndpointSlice API reference](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* [Endpoint API reference (legacy)](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
-->
更多上下文，可以閱讀以下內容：

* [虛擬 IP 和 Service 代理](/zh-cn/docs/reference/networking/virtual-ips/)
* [EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)
* [Service API 參考](/zh-cn/docs/reference/kubernetes-api/service-resources/service-v1/)
* [EndpointSlice API 參考](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* [Endpoints API 參考](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
