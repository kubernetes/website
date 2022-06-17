---
title: 端點切片（Endpoint Slices）
content_type: concept
weight: 45
---

<!--
reviewers:
- freehan
title: Endpoint Slices
content_type: concept
weight: 45
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

<!--
_EndpointSlices_ provide a simple way to track network endpoints within a
Kubernetes cluster. They offer a more scalable and extensible alternative to
Endpoints.
-->
_端點切片（EndpointSlices）_ 提供了一種簡單的方法來跟蹤 Kubernetes 叢集中的網路端點
（network endpoints）。它們為 Endpoints 提供了一種可伸縮和可拓展的替代方案。

<!-- body -->

<!--
## Motivation

The Endpoints API has provided a simple and straightforward way of
tracking network endpoints in Kubernetes. Unfortunately as Kubernetes clusters
and {{< glossary_tooltip text="Services" term_id="service" >}} have grown to handle and
send more traffic to more backend Pods, limitations of that original API became
more visible.
Most notably, those included challenges with scaling to larger numbers of
network endpoints.
-->
## 動機    {#motivation}

Endpoints API 提供了在 Kubernetes 跟蹤網路端點的一種簡單而直接的方法。
不幸的是，隨著 Kubernetes 叢集和 {{< glossary_tooltip text="服務" term_id="service" >}}
逐漸開始為更多的後端 Pods 處理和傳送請求，原來的 API 的侷限性變得越來越明顯。
最重要的是那些因為要處理大量網路端點而帶來的挑戰。

<!--
Since all network endpoints for a Service were stored in a single Endpoints
resource, those resources could get quite large. That affected the performance
of Kubernetes components (notably the master control plane) and resulted in
significant amounts of network traffic and processing when Endpoints changed.
EndpointSlices help you mitigate those issues as well as provide an extensible
platform for additional features such as topological routing.
-->
由於任一 Service 的所有網路端點都儲存在同一個 Endpoints 資源中，
這類資源可能變得非常巨大，而這一變化會影響到 Kubernetes
元件（比如主控元件）的效能，並在 Endpoints 變化時產生大量的網路流量和額外的處理。
EndpointSlice 能夠幫助你緩解這一問題，
還能為一些諸如拓撲路由這類的額外功能提供一個可擴充套件的平臺。

<!--
## Endpoint Slice resources {#endpointslice-resource}

In Kubernetes, an EndpointSlice contains references to a set of network
endpoints. The control plane automatically creates EndpointSlices
for any Kubernetes Service that has a {{< glossary_tooltip text="selector"
term_id="selector" >}} specified. These EndpointSlices include
references to any Pods that match the Service selector. EndpointSlices group
network endpoints together by unique combinations of protocol, port number, and
Service name.  
The name of a EndpointSlice object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

As an example, here's a sample EndpointSlice resource for the `example`
Kubernetes Service.
-->
## Endpoint Slice 資源 {#endpointslice-resource}

在 Kubernetes 中，`EndpointSlice` 包含對一組網路端點的引用。
指定選擇器後控制面會自動為設定了 {{< glossary_tooltip text="選擇算符" term_id="selector" >}}
的 Kubernetes Service 建立 EndpointSlice。
這些 EndpointSlice 將包含對與 Service 選擇算符匹配的所有 Pod 的引用。
EndpointSlice 透過唯一的協議、埠號和 Service 名稱將網路端點組織在一起。
EndpointSlice 的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

例如，下面是 Kubernetes Service `example` 的 EndpointSlice 資源示例。

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
`-max-endpoints-per-slice`
{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
flag, up to a maximum of 1000.

EndpointSlices can act as the source of truth for
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} when it comes to
how to route internal traffic. When enabled, they should provide a performance
improvement for services with large numbers of endpoints.
-->
預設情況下，控制面建立和管理的 EndpointSlice 將包含不超過 100 個端點。
你可以使用 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
的 `--max-endpoints-per-slice` 標誌設定此值，最大值為 1000。

當涉及如何路由內部流量時，EndpointSlice 可以充當
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} 
的決策依據。
啟用該功能後，在服務的端點數量龐大時會有可觀的效能提升。

<!--
## Address Types

EndpointSlices support three address types:

* IPv4
* IPv6
* FQDN (Fully Qualified Domain Name)
-->
## 地址型別

EndpointSlice 支援三種地址型別：

* IPv4
* IPv6
* FQDN (完全合格的域名)

<!--
### Conditions

The EndpointSlice API stores conditions about endpoints that may be useful for consumers.
The three conditions are `ready`, `serving`, and `terminating`.
-->
### 狀況

EndpointSlice API 儲存了可能對使用者有用的、有關端點的狀況。
這三個狀況分別是 `ready`、`serving` 和 `terminating`。


<!--
#### Ready

`ready` is a condition that maps to a Pod's `Ready` condition. A running Pod with the `Ready`
condition set to `True` should have this EndpointSlice condition also set to `true`. For
compatibility reasons, `ready` is NEVER `true` when a Pod is terminating. Consumers should refer
to the `serving` condition to inspect the readiness of terminating Pods. The only exception to
this rule is for Services with `spec.publishNotReadyAddresses` set to `true`. Endpoints for these
Services will always have the `ready` condition set to `true`.
-->
#### Ready（就緒）

`ready` 狀況是對映 Pod 的 `Ready` 狀況的。
處於執行中的 Pod，它的 `Ready` 狀況被設定為 `True`，應該將此 EndpointSlice 狀況也設定為 `true`。
出於相容性原因，當 Pod 處於終止過程中，`ready` 永遠不會為 `true`。
消費者應參考 `serving` 狀況來檢查處於終止中的 Pod 的就緒情況。
該規則的唯一例外是將 `spec.publishNotReadyAddresses` 設定為 `true` 的 Service。
這些 Service 的端點將始終將 `ready` 狀況設定為 `true`。

<!--
#### Serving

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

`serving` is identical to the `ready` condition, except it does not account for terminating states.
Consumers of the EndpointSlice API should check this condition if they care about pod readiness while
the pod is also terminating.
-->
#### Serving（服務中）

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

`serving` 狀況與 `ready` 狀況相同，不同之處在於它不考慮終止狀態。
如果 EndpointSlice API 的使用者關心 Pod 終止時的就緒情況，就應檢查此狀況。

{{< note >}}
<!--
Although `serving` is almost identical to `ready`, it was added to prevent break the existing meaning
of `ready`. It may be unexpected for existing clients if `ready` could be `true` for terminating
endpoints, since historically terminating endpoints were never included in the Endpoints or
EndpointSlice API to begin with. For this reason, `ready` is _always_ `false` for terminating
endpoints, and a new condition `serving` was added in v1.20 so that clients can track readiness
for terminating pods independent of the existing semantics for `ready`.
-->
儘管 `serving` 與 `ready` 幾乎相同，但是它是為防止破壞 `ready` 的現有含義而增加的。
如果對於處於終止中的端點，`ready` 可能是 `true`，那麼對於現有的客戶端來說可能是有些意外的，
因為從始至終，Endpoints 或 EndpointSlice API 從未包含處於終止中的端點。
出於這個原因，`ready` 對於處於終止中的端點 _總是_ `false`，
並且在 v1.20 中添加了新的狀況 `serving`，以便客戶端可以獨立於 `ready`
的現有語義來跟蹤處於終止中的 Pod 的就緒情況。
{{< /note >}}

<!-- 
#### Terminating

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

`Terminating` is a condition that indicates whether an endpoint is terminating.
For pods, this is any pod that has a deletion timestamp set.
-->
#### Terminating（終止中）

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

`Terminating` 是表示端點是否處於終止中的狀況。
對於 Pod 來說，這是設定了刪除時間戳的 Pod。


<!--
### Topology information {#topology}

Each endpoint within an EndpointSlice can contain relevant topology information.
The topology information includes the location of the endpoint and information
about the corresponding Node and zone. These are available in the following
per endpoint fields on EndpointSlices:
-->
### 拓撲資訊   {#topology}

EndpointSlice 中的每個端點都可以包含一定的拓撲資訊。
拓撲資訊包括端點的位置，對應節點、可用區的資訊。
這些資訊體現為 EndpointSlices 的如下端點欄位：

<!--
* `nodeName` - The name of the Node this endpoint is on.
* `zone` - The zone this endpoint is in.
-->
* `nodeName` - 端點所在的 Node 名稱；
* `zone` - 端點所處的可用區。

{{< note >}}
<!--
In the v1 API, the per endpoint `topology` was effectively removed in favor of
the dedicated fields `nodeName` and `zone`.
-->
在 v1 API 中，逐個端點設定的 `topology` 實際上被去除，
以鼓勵使用專用的欄位 `nodeName` 和 `zone`。

<!--
Setting arbitrary topology fields on the `endpoint` field of an `EndpointSlice`
resource has been deprecated and is not supported in the v1 API. 
Instead, the v1 API supports setting individual `nodeName` and `zone` fields. 
These fields are automatically translated between API versions. For example, the
value of the `"topology.kubernetes.io/zone"` key in the `topology` field in
the v1beta1 API is accessible as the `zone` field in the v1 API.
-->
對 `EndpointSlice` 物件的 `endpoint` 欄位設定任意的拓撲結構資訊這一操作已被廢棄，
不再被 v1 API 所支援。取而代之的是 v1 API 所支援的 `nodeName` 和 `zone`
這些獨立的欄位。這些欄位可以在不同的 API 版本之間自動完成轉譯。
例如，v1beta1 API 中 `topology` 欄位的 `topology.kubernetes.io/zone`
取值可以在 v1 API 中透過 `zone` 欄位訪問。
{{< /note >}}

<!--
### Management

Most often, the control plane (specifically, the endpoint slice
{{< glossary_tooltip text="controller" term_id="controller" >}}) creates and
manages EndpointSlice objects. There are a variety of other use cases for
EndpointSlices, such as service mesh implementations, that could result in other
entities or controllers managing additional sets of EndpointSlices.
-->
### 管理   {#management}

通常，控制面（尤其是端點切片的 {{< glossary_tooltip text="控制器" term_id="controller" >}}）
會建立和管理 EndpointSlice 物件。EndpointSlice 物件還有一些其他使用場景，
例如作為服務網格（Service Mesh）的實現。
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
為了確保多個實體可以管理 EndpointSlice 而且不會相互產生干擾，Kubernetes 定義了
{{< glossary_tooltip term_id="label" text="標籤" >}}
`endpointslice.kubernetes.io/managed-by`，用來標明哪個實體在管理某個
EndpointSlice。端點切片控制器會在自己所管理的所有 EndpointSlice 上將該標籤值設定為
`endpointslice-controller.k8s.io`。
管理 EndpointSlice 的其他實體也應該為此標籤設定一個唯一值。

<!--
### Ownership

In most use cases, EndpointSlices are owned by the Service that the endpoint
slice object tracks endpoints for. This ownership is indicated by an owner
reference on each EndpointSlice as well as a `kubernetes.io/service-name`
label that enables simple lookups of all EndpointSlices belonging to a Service.
-->
### 屬主關係   {#ownership}

在大多數場合下，EndpointSlice 都由某個 Service 所有，
（因為）該端點切片正是為該服務跟蹤記錄其端點。這一屬主關係是透過為每個 EndpointSlice
設定一個屬主（owner）引用，同時設定 `kubernetes.io/service-name` 標籤來標明的，
目的是方便查詢隸屬於某 Service 的所有 EndpointSlice。

<!--
### EndpointSlice mirroring

In some cases, applications create custom Endpoints resources. To ensure that
these applications do not need to concurrently write to both Endpoints and
EndpointSlice resources, the cluster's control plane mirrors most Endpoints
resources to corresponding EndpointSlices.
-->
### EndpointSlice 映象    {#endpointslice-mirroring}

在某些場合，應用會建立定製的 Endpoints 資源。為了保證這些應用不需要併發的更改
Endpoints 和 EndpointSlice 資源，叢集的控制面將大多數 Endpoints
對映到對應的 EndpointSlice 之上。

<!--
The control plane mirrors Endpoints resources unless:

* the Endpoints resource has a `endpointslice.kubernetes.io/skip-mirror` label
  set to `true`.
* the Endpoints resource has a `control-plane.alpha.kubernetes.io/leader`
  annotation.
* the corresponding Service resource does not exist.
* the corresponding Service resource has a non-nil selector.
-->
控制面對 Endpoints 資源進行對映的例外情況有：

* Endpoints 資源上標籤 `endpointslice.kubernetes.io/skip-mirror` 值為 `true`。
* Endpoints 資源包含標籤 `control-plane.alpha.kubernetes.io/leader`。
* 對應的 Service 資源不存在。
* 對應的 Service 的選擇算符不為空。

<!--
Individual Endpoints resources may translate into multiple EndpointSlices. This
will occur if an Endpoints resource has multiple subsets or includes endpoints
with multiple IP families (IPv4 and IPv6). A maximum of 1000 addresses per
subset will be mirrored to EndpointSlices.
-->
每個 Endpoints 資源可能會被翻譯到多個 EndpointSlices 中去。
當 Endpoints 資源中包含多個子網或者包含多個 IP 地址族（IPv4 和 IPv6）的端點時，
就有可能發生這種狀況。
每個子網最多有 1000 個地址會被映象到 EndpointSlice 中。

<!--
### Distribution of EndpointSlices

Each EndpointSlice has a set of ports that applies to all endpoints within the
resource. When named ports are used for a Service, Pods may end up with
different target port numbers for the same named port, requiring different
EndpointSlices. This is similar to the logic behind how subsets are grouped
with Endpoints.
-->
### EndpointSlices 的分佈問題  {#distribution-of-endpointslices}

每個 EndpointSlice 都有一組埠值，適用於資源內的所有端點。
當為 Service 使用命名埠時，Pod 可能會就同一命名埠獲得不同的埠號，
因而需要不同的 EndpointSlice。這有點像 Endpoints 用來對子網進行分組的邏輯。

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
之間執行再平衡操作。這裡的邏輯也是相對直接的：

1. 列舉所有現有的 EndpointSlices，移除那些不再需要的端點並更新那些已經變化的端點。
2. 列舉所有在第一步中被更改過的 EndpointSlices，用新增加的端點將其填滿。
3. 如果還有新的端點未被新增進去，嘗試將這些端點新增到之前未更改的切片中，
   或者建立新切片。

<!--
Importantly, the third step prioritizes limiting EndpointSlice updates over a
perfectly full distribution of EndpointSlices. As an example, if there are 10
new endpoints to add and 2 EndpointSlices with room for 5 more endpoints each,
this approach will create a new EndpointSlice instead of filling up the 2
existing EndpointSlices. In other words, a single EndpointSlice creation is
preferrable to multiple EndpointSlice updates.
-->
這裡比較重要的是，與在 EndpointSlice 之間完成最佳的分佈相比，第三步中更看重限制
EndpointSlice 更新的操作次數。例如，如果有 10 個端點待新增，有兩個 EndpointSlice
中各有 5 個空位，上述方法會建立一個新的 EndpointSlice 而不是將現有的兩個
EndpointSlice 都填滿。換言之，與執行多個 EndpointSlice 更新操作相比較，
方法會優先考慮執行一個 EndpointSlice 建立操作。

<!--
With kube-proxy running on each Node and watching EndpointSlices, every change
to an EndpointSlice becomes relatively expensive since it will be transmitted to
every Node in the cluster. This approach is intended to limit the number of
changes that need to be sent to every Node, even if it may result with multiple
EndpointSlices that are not full.
-->
由於 kube-proxy 在每個節點上執行並監視 EndpointSlice 狀態，EndpointSlice
的每次變更都變得相對代價較高，因為這些狀態變化要傳遞到叢集中每個節點上。
這一方法嘗試限制要傳送到所有節點上的變更訊息個數，即使這樣做可能會導致有多個
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
控制器處理的變更都是足夠小的，可以新增到某已有 EndpointSlice 中去的。
並且，假使無法新增到已有的切片中，不管怎樣都會快就會需要一個新的
EndpointSlice 物件。Deployment 的滾動更新為重新為 EndpointSlice
打包提供了一個自然的機會，所有 Pod 及其對應的端點在這一期間都會被替換掉。

<!--
### Duplicate endpoints

Due to the nature of EndpointSlice changes, endpoints may be represented in more
than one EndpointSlice at the same time. This naturally occurs as changes to
different EndpointSlice objects can arrive at the Kubernetes client watch/cache
at different times. Implementations using EndpointSlice must be able to have the
endpoint appear in more than one slice. A reference implementation of how to
perform endpoint deduplication can be found in the `EndpointSliceCache`
implementation in `kube-proxy`.
-->
### 重複的端點   {#duplicate-endpoints}

由於 EndpointSlice 變化的自身特點，端點可能會同時出現在不止一個 EndpointSlice
中。鑑於不同的 EndpointSlice 物件在不同時刻到達 Kubernetes 的監視/快取中，
這種情況的出現是很自然的。
使用 EndpointSlice 的實現必須能夠處理端點出現在多個切片中的狀況。
關於如何執行端點去重（deduplication）的參考實現，你可以在 `kube-proxy` 的
`EndpointSlice` 實現中找到。

## {{% heading "whatsnext" %}}

<!--
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->
* 閱讀[使用 Service 連線到應用](/zh-cn/docs/concepts/services-networking/connect-applications-service/)

