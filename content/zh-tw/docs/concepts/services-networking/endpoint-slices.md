---
title: EndpointSlice
api_metadata:
- apiVersion: "discovery.k8s.io/v1"
  kind: "EndpointSlice"
content_type: concept
weight: 60
description: >-
  EndpointSlice API 是 Kubernetes 用於擴縮 Service
  以處理大量後端的機制，還允許集羣高效更新其健康後端的列表。
---
<!--
reviewers:
- freehan
title: EndpointSlices
api_metadata:
- apiVersion: "discovery.k8s.io/v1"
  kind: "EndpointSlice"
content_type: concept
weight: 60
description: >-
  The EndpointSlice API is the mechanism that Kubernetes uses to let your Service
  scale to handle large numbers of backends, and allows the cluster to update its
  list of healthy backends efficiently.
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

{{< glossary_definition term_id="endpoint-slice" length="short" >}}

<!-- body -->

<!--
## EndpointSlice API {#endpointslice-resource}

In Kubernetes, an EndpointSlice contains references to a set of network
endpoints. The control plane automatically creates EndpointSlices
for any Kubernetes Service that has a {{< glossary_tooltip text="selector"
term_id="selector" >}} specified. These EndpointSlices include
references to all the Pods that match the Service selector. EndpointSlices group
network endpoints together by unique combinations of IP family, protocol,
port number, and Service name.
The name of a EndpointSlice object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

As an example, here's a sample EndpointSlice object, that's owned by the `example`
Kubernetes Service.
-->
## EndpointSlice API {#endpointslice-resource}

在 Kubernetes 中，`EndpointSlice` 包含對一組網絡端點的引用。
控制面會自動爲設置了{{< glossary_tooltip text="選擇算符" term_id="selector" >}}的
Kubernetes Service 創建 EndpointSlice。
這些 EndpointSlice 將包含對與 Service 選擇算符匹配的所有 Pod 的引用。
EndpointSlice 通過唯一的 IP 地址簇、協議、端口號和 Service 名稱將網絡端點組織在一起。
EndpointSlice 的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

例如，下面是 Kubernetes Service `example` 所擁有的 EndpointSlice 對象示例。

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    nodeName: node-1
    zone: us-west2-a
```

<!--
By default, the control plane creates and manages EndpointSlices to have no
more than 100 endpoints each. You can configure this with the
`--max-endpoints-per-slice`
{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
flag, up to a maximum of 1000.

EndpointSlices act as the source of truth for
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} when it comes to
how to route internal traffic.
-->
默認情況下，控制面創建和管理的 EndpointSlice 將包含不超過 100 個端點。
你可以使用 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
的 `--max-endpoints-per-slice` 標誌設置此值，最大值爲 1000。

當涉及如何路由內部流量時，EndpointSlice 充當
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
的決策依據。

<!--
### Address types

EndpointSlices support two address types:

* IPv4
* IPv6

Each `EndpointSlice` object represents a specific IP address type. If you have
a Service that is available via IPv4 and IPv6, there will be at least two
`EndpointSlice` objects (one for IPv4, and one for IPv6).
-->
### 地址類型

EndpointSlice 支持兩種地址類型：

* IPv4
* IPv6

每個 `EndpointSlice` 對象代表一個特定的 IP 地址類型。如果你有一個支持 IPv4 和 IPv6 的 Service，
那麼將至少有兩個 `EndpointSlice` 對象（一個用於 IPv4，一個用於 IPv6）。

<!--
### Conditions

The EndpointSlice API stores conditions about endpoints that may be useful for consumers.
The three conditions are `serving`, `terminating`, and `ready`.
-->
### 狀況

EndpointSlice API 存儲了可能對使用者有用的、有關端點的狀況。
這三個狀況分別是 `serving`、`terminating` 和 `ready`。

<!--
#### Serving
-->
#### Serving（服務中）

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
The `serving` condition indicates that the endpoint is currently serving responses, and
so it should be used as a target for Service traffic. For endpoints backed by a Pod, this
maps to the Pod's `Ready` condition.
-->
`serving` 狀況表示端點目前正在提供響應，且因此應將其用作 Service 流量的目標。
對於由 Pod 支持的端點，此狀況對應於 Pod 的 `Ready` 狀況。

<!--
#### Terminating
-->
#### Terminating（終止中）

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
The `terminating` condition indicates that the endpoint is
terminating. For endpoints backed by a Pod, this condition is set when
the Pod is first deleted (that is, when it receives a deletion
timestamp, but most likely before the Pod's containers exit).

Service proxies will normally ignore endpoints that are `terminating`,
but they may route traffic to endpoints that are both `serving` and
`terminating` if all available endpoints are `terminating`. (This
helps to ensure that no Service traffic is lost during rolling updates
of the underlying Pods.)
-->
`terminating` 狀況表示端點正在終止中。對於由 Pod 支持的端點，
當 Pod 首次被刪除時（即收到刪除時間戳時，但很可能在容器實際退出之前），會設置此狀況。

服務代理通常會忽略處於 `terminating` 狀態的端點，但如果所有可用端點都處於 `terminating`，
服務代理可能仍會將流量路由到同時具有 `serving` 和 `terminating` 的端點。
（這樣有助於在底層 Pod 滾動更新過程中確保 Service 流量不會中斷。）

<!--
#### Ready

The `ready` condition is essentially a shortcut for checking
"`serving` and not `terminating`" (though it will also always be
`true` for Services with `spec.publishNotReadyAddresses` set to
`true`).
-->
#### Ready（就緒）

`ready` 狀況本質上是檢查 "`serving` 且不是 `terminating`" 的一種簡化方式
（不過對於將 `spec.publishNotReadyAddresses` 設置爲 `true` 的 Service，`ready` 狀況始終設置爲 `true`）。

<!--
### Topology information {#topology}

Each endpoint within an EndpointSlice can contain relevant topology information.
The topology information includes the location of the endpoint and information
about the corresponding Node and zone. These are available in the following
per endpoint fields on EndpointSlices:
-->
### 拓撲信息   {#topology}

EndpointSlice 中的每個端點都可以包含一定的拓撲信息。
拓撲信息包括端點的位置，對應節點、可用區的信息。
這些信息體現爲 EndpointSlices 的如下端點字段：

<!--
* `nodeName` - The name of the Node this endpoint is on.
* `zone` - The zone this endpoint is in.
-->
* `nodeName` - 端點所在的 Node 名稱；
* `zone` - 端點所處的可用區。

<!--
### Management

Most often, the control plane (specifically, the endpoint slice
{{< glossary_tooltip text="controller" term_id="controller" >}}) creates and
manages EndpointSlice objects. There are a variety of other use cases for
EndpointSlices, such as service mesh implementations, that could result in other
entities or controllers managing additional sets of EndpointSlices.
-->
### 管理   {#management}

通常，控制面（尤其是端點切片的{{< glossary_tooltip text="控制器" term_id="controller" >}}）
會創建和管理 EndpointSlice 對象。EndpointSlice 對象還有一些其他使用場景，
例如作爲服務網格（Service Mesh）的實現。
這些場景都會導致有其他實體或者控制器負責管理額外的 EndpointSlice 集合。

<!--
To ensure that multiple entities can manage EndpointSlices without interfering
with each other, Kubernetes defines the
{{< glossary_tooltip term_id="label" text="label" >}}
`endpointslice.kubernetes.io/managed-by`, which indicates the entity managing
an EndpointSlice.
The endpoint slice controller sets `endpointslice-controller.k8s.io` as the value
for this label on all EndpointSlices it manages. Other entities managing
EndpointSlices should also set a unique value for this label.
-->
爲了確保多個實體可以管理 EndpointSlice 而且不會相互產生干擾，
Kubernetes 定義了{{< glossary_tooltip term_id="label" text="標籤" >}}
`endpointslice.kubernetes.io/managed-by`，用來標明哪個實體在管理某個 EndpointSlice。
端點切片控制器會在自己所管理的所有 EndpointSlice 上將該標籤值設置爲
`endpointslice-controller.k8s.io`。
管理 EndpointSlice 的其他實體也應該爲此標籤設置一個唯一值。

<!--
### Ownership

In most use cases, EndpointSlices are owned by the Service that the endpoint
slice object tracks endpoints for. This ownership is indicated by an owner
reference on each EndpointSlice as well as a `kubernetes.io/service-name`
label that enables simple lookups of all EndpointSlices belonging to a Service.
-->
### 屬主關係   {#ownership}

在大多數場合下，EndpointSlice 都由某個 Service 所有，
（因爲）該端點切片正是爲該服務跟蹤記錄其端點。這一屬主關係是通過爲每個 EndpointSlice
設置一個屬主（owner）引用，同時設置 `kubernetes.io/service-name` 標籤來標明的，
目的是方便查找隸屬於某 Service 的所有 EndpointSlice。

<!--
### Distribution of EndpointSlices

Each EndpointSlice has a set of ports that applies to all endpoints within the
resource. When named ports are used for a Service, Pods may end up with
different target port numbers for the same named port, requiring different
EndpointSlices.
-->
### EndpointSlices 的分佈問題  {#distribution-of-endpointslices}

每個 EndpointSlice 都有一組端口值，適用於資源內的所有端點。
當爲 Service 使用命名端口時，Pod 可能會就同一命名端口獲得不同的端口號，
因而需要不同的 EndpointSlice。

<!--
The control plane tries to fill EndpointSlices as full as possible, but does not
actively rebalance them. The logic is fairly straightforward:

1. Iterate through existing EndpointSlices, remove endpoints that are no longer
   desired and update matching endpoints that have changed.
2. Iterate through EndpointSlices that have been modified in the first step and
   fill them up with any new endpoints needed.
3. If there's still new endpoints left to add, try to fit them into a previously
   unchanged slice and/or create new ones.
-->
控制面嘗試儘量將 EndpointSlice 填滿，不過不會主動地在若干 EndpointSlice
之間執行再平衡操作。這裏的邏輯也是相對直接的：

1. 列舉所有現有的 EndpointSlices，移除那些不再需要的端點並更新那些已經變化的端點。
2. 列舉所有在第一步中被更改過的 EndpointSlices，用新增加的端點將其填滿。
3. 如果還有新的端點未被添加進去，嘗試將這些端點添加到之前未更改的切片中，
   或者創建新切片。

<!--
Importantly, the third step prioritizes limiting EndpointSlice updates over a
perfectly full distribution of EndpointSlices. As an example, if there are 10
new endpoints to add and 2 EndpointSlices with room for 5 more endpoints each,
this approach will create a new EndpointSlice instead of filling up the 2
existing EndpointSlices. In other words, a single EndpointSlice creation is
preferable to multiple EndpointSlice updates.
-->
這裏比較重要的是，與在 EndpointSlice 之間完成最佳的分佈相比，第三步中更看重限制
EndpointSlice 更新的操作次數。例如，如果有 10 個端點待添加，有兩個 EndpointSlice
中各有 5 個空位，上述方法會創建一個新的 EndpointSlice 而不是將現有的兩個
EndpointSlice 都填滿。換言之，與執行多個 EndpointSlice 更新操作相比較，
方法會優先考慮執行一個 EndpointSlice 創建操作。

<!--
With kube-proxy running on each Node and watching EndpointSlices, every change
to an EndpointSlice becomes relatively expensive since it will be transmitted to
every Node in the cluster. This approach is intended to limit the number of
changes that need to be sent to every Node, even if it may result with multiple
EndpointSlices that are not full.
-->
由於 kube-proxy 在每個節點上運行並監視 EndpointSlice 狀態，EndpointSlice
的每次變更都變得相對代價較高，因爲這些狀態變化要傳遞到集羣中每個節點上。
這一方法嘗試限制要發送到所有節點上的變更消息個數，即使這樣做可能會導致有多個
EndpointSlice 沒有被填滿。

<!--
In practice, this less than ideal distribution should be rare. Most changes
processed by the EndpointSlice controller will be small enough to fit in an
existing EndpointSlice, and if not, a new EndpointSlice is likely going to be
necessary soon anyway. Rolling updates of Deployments also provide a natural
repacking of EndpointSlices with all Pods and their corresponding endpoints
getting replaced.
-->
在實踐中，上面這種並非最理想的分佈是很少出現的。大多數被 EndpointSlice
控制器處理的變更都是足夠小的，可以添加到某已有 EndpointSlice 中去的。
並且，假使無法添加到已有的切片中，不管怎樣都很快就會創建一個新的
EndpointSlice 對象。Deployment 的滾動更新爲重新爲 EndpointSlice
打包提供了一個自然的機會，所有 Pod 及其對應的端點在這一期間都會被替換掉。

<!--
### Duplicate endpoints

Due to the nature of EndpointSlice changes, endpoints may be represented in more
than one EndpointSlice at the same time. This naturally occurs as changes to
different EndpointSlice objects can arrive at the Kubernetes client watch / cache
at different times.
-->
### 重複的端點   {#duplicate-endpoints}

由於 EndpointSlice 變化的自身特點，端點可能會同時出現在不止一個 EndpointSlice
中。鑑於不同的 EndpointSlice 對象在不同時刻到達 Kubernetes 的監視/緩存中，
這種情況的出現是很自然的。

{{< note >}}
<!--
Clients of the EndpointSlice API must iterate through all the existing EndpointSlices
associated to a Service and build a complete list of unique network endpoints. It is
important to mention that endpoints may be duplicated in different EndpointSlices.

You can find a reference implementation for how to perform this endpoint aggregation
and deduplication as part of the `EndpointSliceCache` code within `kube-proxy`.
-->
EndpointSlice API 的客戶端必須遍歷與 Service 關聯的所有現有 EndpointSlices，
並構建唯一網絡端點的完整列表。值得一提的是端點可能在不同的 EndpointSlices 中重複。

你可以在 `kube-proxy` 中的 `EndpointSliceCache` 代碼中找到有關如何執行此端點聚合和重複數據刪除的參考實現。
{{< /note >}}

<!--
### EndpointSlice mirroring
-->
### EndpointSlice 鏡像    {#endpointslice-mirroring}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

<!--
The EndpointSlice API is a replacement for the older Endpoints API. To
preserve compatibility with older controllers and user workloads that
expect {{<glossary_tooltip term_id="kube-proxy" text="kube-proxy">}}
to route traffic based on Endpoints resources, the cluster's control
plane mirrors most user-created Endpoints resources to corresponding
EndpointSlices.
-->
EndpointSlice API 是舊版 Endpoints API 的替代方案。
爲了保持與舊版控制器和用戶工作負載的兼容性
（例如期望由 {{<glossary_tooltip term_id="kube-proxy" text="kube-proxy">}} 基於 Endpoints 資源來路由流量），
集羣的控制平面會將大多數用戶創建的 Endpoints 資源鏡像到相應的 EndpointSlice 中。

<!--
(However, this feature, like the rest of the Endpoints API, is
deprecated. Users who manually specify endpoints for selectorless
Services should do so by creating EndpointSlice resources directly,
rather than by creating Endpoints resources and allowing them to be
mirrored.)
-->
（不過，與 Endpoints API 的其他部分一樣，此特性也已被棄用。
對於無選擇算符的 Service，用戶如果需要手動指定端點，應該直接創建 EndpointSlice 資源，
而不是創建 Endpoints 資源並允許其被鏡像。）

<!--
The control plane mirrors Endpoints resources unless:

* the Endpoints resource has a `endpointslice.kubernetes.io/skip-mirror` label
  set to `true`.
* the Endpoints resource has a `control-plane.alpha.kubernetes.io/leader`
  annotation.
* the corresponding Service resource does not exist.
* the corresponding Service resource has a non-nil selector.
-->
控制面對 Endpoints 資源進行映射的例外情況有：

* Endpoints 資源上標籤 `endpointslice.kubernetes.io/skip-mirror` 值爲 `true`。
* Endpoints 資源包含標籤 `control-plane.alpha.kubernetes.io/leader`。
* 對應的 Service 資源不存在。
* 對應的 Service 的選擇算符不爲空。

<!--
Individual Endpoints resources may translate into multiple EndpointSlices. This
will occur if an Endpoints resource has multiple subsets or includes endpoints
with multiple IP families (IPv4 and IPv6). A maximum of 1000 addresses per
subset will be mirrored to EndpointSlices.
-->
每個 Endpoints 資源可能會被轉譯到多個 EndpointSlices 中去。
當 Endpoints 資源中包含多個子網或者包含多個 IP 協議族（IPv4 和 IPv6）的端點時，
就有可能發生這種狀況。
每個子網最多有 1000 個地址會被鏡像到 EndpointSlice 中。

## {{% heading "whatsnext" %}}

<!--
* Follow the [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/) tutorial
* Read the [API reference](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/) for the EndpointSlice API
* Read the [API reference](/docs/reference/kubernetes-api/service-resources/endpoints-v1/) for the Endpoints API
-->
* 遵循[使用 Service 連接到應用](/zh-cn/docs/tutorials/services/connect-applications-service/)教程
* 閱讀 EndpointSlice API 的 [API 參考](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* 閱讀 Endpoints API 的 [API 參考](/zh-cn/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
