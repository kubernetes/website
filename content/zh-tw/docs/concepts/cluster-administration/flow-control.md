---
title: API 優先順序和公平性
content_type: concept
min-kubernetes-server-version: v1.18
---

<!-- overview -->

{{< feature-state state="beta"  for_k8s_version="v1.20" >}}

<!--
Controlling the behavior of the Kubernetes API server in an overload situation
is a key task for cluster administrators. The {{< glossary_tooltip
term_id="kube-apiserver" text="kube-apiserver" >}} has some controls available
(i.e. the `--max-requests-inflight` and `--max-mutating-requests-inflight`
command-line flags) to limit the amount of outstanding work that will be
accepted, preventing a flood of inbound requests from overloading and
potentially crashing the API server, but these flags are not enough to ensure
that the most important requests get through in a period of high traffic.
-->
對於叢集管理員來說，控制 Kubernetes API 伺服器在過載情況下的行為是一項關鍵任務。
{{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
有一些控制元件（例如：命令列標誌 `--max-requests-inflight` 和 `--max-mutating-requests-inflight` ）,
可以限制將要接受的未處理的請求，從而防止過量請求入站，潛在導致 API 伺服器崩潰。
但是這些標誌不足以保證在高流量期間，最重要的請求仍能被伺服器接受。

<!--
The API Priority and Fairness feature (APF) is an alternative that improves upon
aforementioned max-inflight limitations. APF classifies
and isolates requests in a more fine-grained way. It also introduces
a limited amount of queuing, so that no requests are rejected in cases
of very brief bursts.  Requests are dispatched from queues using a
fair queuing technique so that, for example, a poorly-behaved
{{< glossary_tooltip text="controller" term_id="controller" >}} need not
starve others (even at the same priority level).
-->
API 優先順序和公平性（APF）是一種替代方案，可提升上述最大併發限制。
APF 以更細粒度的方式對請求進行分類和隔離。
它還引入了空間有限的排隊機制，因此在非常短暫的突發情況下，API 伺服器不會拒絕任何請求。
透過使用公平排隊技術從佇列中分發請求，這樣，
一個行為不佳的 {{< glossary_tooltip text="控制器" term_id="controller" >}}
就不會餓死其他控制器（即使優先順序相同）。

<!--
This feature is designed to work well with standard controllers, which
use informers and react to failures of API requests with exponential
back-off, and other clients that also work this way.
-->
本功能特性在設計上期望其能與標準控制器一起工作得很好；
這類控制器使用通知元件（Informers）獲得資訊並對 API 請求的失效作出反應，
在處理失效時能夠執行指數型回退。其他客戶端也以類似方式工作。

<!--
{{< caution >}}
Requests classified as "long-running" — primarily watches — are not
subject to the API Priority and Fairness filter. This is also true for
the `--max-requests-inflight` flag without the API Priority and
Fairness feature enabled.
{{< /caution >}}
-->
{{< caution >}}
屬於“長時間執行”型別的請求（主要是 watch）不受 API 優先順序和公平性過濾器的約束。
如果未啟用 APF 特性，即便設定 `--max-requests-inflight` 標誌，該類請求也不受約束。
{{< /caution >}}


<!-- body -->

<!--
## Enabling/Disabling API Priority and Fairness
-->
## 啟用/禁用 API 優先順序和公平性    {#enabling-api-priority-and-fairness}

<!--
The API Priority and Fairness feature is controlled by a feature gate
and is enabled by default.  See
[Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/)
for a general explanation of feature gates and how to enable and
disable them.  The name of the feature gate for APF is
"APIPriorityAndFairness".  This feature also involves an {{<
glossary_tooltip term_id="api-group" text="API Group" >}} with: (a) a
`v1alpha1` version, disabled by default, and (b) a `v1beta1` and
`v1beta21 versions,  enabled by default.  You can disable the feature
gate and API group beta version by adding the following
command-line flags to your `kube-apiserver` invocation:
-->
API 優先順序與公平性（APF）特性由特性門控控制，預設情況下啟用。
有關特性門控的一般性描述以及如何啟用和禁用特性門控，
請參見[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
APF 的特性門控稱為 `APIPriorityAndFairness`。
此特性也與某個 {{< glossary_tooltip term_id="api-group" text="API 組" >}}
相關：
(a) `v1alpha1` 版本，預設被禁用；
(b) `v1beta1` 和 `v1beta2` 版本，預設被啟用。
你可以在啟動 `kube-apiserver` 時，新增以下命令列標誌來禁用此功能門控及 API Beta 組：

```shell
kube-apiserver \
--feature-gates=APIPriorityAndFairness=false \
--runtime-config=flowcontrol.apiserver.k8s.io/v1beta1=false,flowcontrol.apiserver.k8s.io/v1beta2=false \
  # ...其他配置不變
```

<!--
Alternatively, you can enable the v1alpha1 version of the API group
with `--runtime-config=flowcontrol.apiserver.k8s.io/v1alpha1=true`.
-->
或者，你也可以透過
`--runtime-config=flowcontrol.apiserver.k8s.io/v1alpha1=true`
啟用 API 組的 v1alpha1 版本。

<!--
The command-line flag `--enable-priority-and-fairness=false` will disable the
API Priority and Fairness feature, even if other flags have enabled it.
-->
命令列標誌 `--enable-priority-fairness=false` 將徹底禁用 APF 特性，即使其他標誌啟用它也是無效。

<!--
## Concepts
There are several distinct features involved in the API Priority and Fairness
feature. Incoming requests are classified by attributes of the request using
_FlowSchemas_, and assigned to priority levels. Priority levels add a degree of
isolation by maintaining separate concurrency limits, so that requests assigned
to different priority levels cannot starve each other. Within a priority level,
a fair-queuing algorithm prevents requests from different _flows_ from starving
each other, and allows for requests to be queued to prevent bursty traffic from
causing failed requests when the average load is acceptably low.
-->
## 概念    {#concepts}

APF 特性包含幾個不同的功能。
傳入的請求透過 _FlowSchema_ 按照其屬性分類，並分配優先順序。
每個優先順序維護自定義的併發限制，加強了隔離度，這樣不同優先順序的請求，就不會相互餓死。
在同一個優先順序內，公平排隊演算法可以防止來自不同 _flow_ 的請求相互餓死。
該演算法將請求排隊，透過排隊機制，防止在平均負載較低時，通訊量突增而導致請求失敗。

<!--
### Priority Levels
Without APF enabled, overall concurrency in the API server is limited by the
`kube-apiserver` flags `--max-requests-inflight` and
`--max-mutating-requests-inflight`. With APF enabled, the concurrency limits
defined by these flags are summed and then the sum is divided up among a
configurable set of _priority levels_. Each incoming request is assigned to a
single priority level, and each priority level will only dispatch as many
concurrent requests as its configuration allows.
-->
### 優先順序    {#Priority-Levels}

如果未啟用 APF，API 伺服器中的整體併發量將受到 `kube-apiserver` 的引數
`--max-requests-inflight` 和 `--max-mutating-requests-inflight` 的限制。
啟用 APF 後，將對這些引數定義的併發限制進行求和，然後將總和分配到一組可配置的 _優先順序_ 中。
每個傳入的請求都會分配一個優先順序；每個優先順序都有各自的配置，設定允許分發的併發請求數。

<!--
The default configuration, for example, includes separate priority levels for
leader-election requests, requests from built-in controllers, and requests from
Pods. This means that an ill-behaved Pod that floods the API server with
requests cannot prevent leader election or actions by the built-in controllers
from succeeding.
-->
例如，預設配置包括針對領導者選舉請求、內建控制器請求和 Pod 請求都單獨設定優先順序。
這表示即使異常的 Pod 向 API 伺服器傳送大量請求，也無法阻止領導者選舉或內建控制器的操作執行成功。


<!--
### Queuing
Even within a priority level there may be a large number of distinct sources of
traffic. In an overload situation, it is valuable to prevent one stream of
requests from starving others (in particular, in the relatively common case of a
single buggy client flooding the kube-apiserver with requests, that buggy client
would ideally not have much measurable impact on other clients at all). This is
handled by use of a fair-queuing algorithm to process requests that are assigned
the same priority level. Each request is assigned to a _flow_, identified by the
name of the matching FlowSchema plus a _flow distinguisher_ — which
is either the requesting user, the target resource's namespace, or nothing — and the
system attempts to give approximately equal weight to requests in different
flows of the same priority level.
To enable distinct handling of distinct instances, controllers that have
many instances should authenticate with distinct usernames
-->
### 排隊    {#Queuing}

即使在同一優先順序內，也可能存在大量不同的流量源。
在過載情況下，防止一個請求流餓死其他流是非常有價值的
（尤其是在一個較為常見的場景中，一個有故障的客戶端會瘋狂地向 kube-apiserver 傳送請求，
理想情況下，這個有故障的客戶端不應對其他客戶端產生太大的影響）。
公平排隊演算法在處理具有相同優先順序的請求時，實現了上述場景。
每個請求都被分配到某個 _流_ 中，該 _流_ 由對應的 FlowSchema 的名字加上一個
_流區分項（Flow Distinguisher）_ 來標識。
這裡的流區分項可以是發出請求的使用者、目標資源的名稱空間或什麼都不是。
系統嘗試為不同流中具有相同優先順序的請求賦予近似相等的權重。
要啟用對不同例項的不同處理方式，多例項的控制器要分別用不同的使用者名稱來執行身份認證。

<!--
After classifying a request into a flow, the API Priority and Fairness
feature then may assign the request to a queue.  This assignment uses
a technique known as {{< glossary_tooltip term_id="shuffle-sharding"
text="shuffle sharding" >}}, which makes relatively efficient use of
queues to insulate low-intensity flows from high-intensity flows.
-->
將請求劃分到流中之後，APF 功能將請求分配到佇列中。
分配時使用一種稱為 {{< glossary_tooltip term_id="shuffle-sharding" text="混洗分片（Shuffle-Sharding）" >}}
的技術。
該技術可以相對有效地利用佇列隔離低強度流與高強度流。

<!--
The details of the queuing algorithm are tunable for each priority level, and
allow administrators to trade off memory use, fairness (the property that
independent flows will all make progress when total traffic exceeds capacity),
tolerance for bursty traffic, and the added latency induced by queuing.
-->
排隊演算法的細節可針對每個優先等級進行調整，並允許管理員在記憶體佔用、
公平性（當總流量超標時，各個獨立的流將都會取得進展）、
突發流量的容忍度以及排隊引發的額外延遲之間進行權衡。

<!--
### Exempt requests

Some requests are considered sufficiently important that they are not subject to
any of the limitations imposed by this feature. These exemptions prevent an
improperly-configured flow control configuration from totally disabling an API
server.
-->
### 豁免請求    {#Exempt-requests}

某些特別重要的請求不受制於此特性施加的任何限制。這些豁免可防止不當的流控配置完全禁用 API 伺服器。

<!--
## Resources

The flow control API involves two kinds of resources.
[PriorityLevelConfigurations](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#prioritylevelconfiguration-v1beta1-flowcontrol-apiserver-k8s-io)
define the available isolation classes, the share of the available concurrency
budget that each can handle, and allow for fine-tuning queuing behavior.
[FlowSchemas](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#flowschema-v1beta1-flowcontrol-apiserver-k8s-io)
are used to classify individual inbound requests, matching each to a
single PriorityLevelConfiguration. There is also a `v1alpha1` version
of the same API group, and it has the same Kinds with the same syntax and
semantics.
-->
## 資源    {#Resources}

流控 API 涉及兩種資源。
[PriorityLevelConfigurations](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#prioritylevelconfiguration-v1alpha1-flowcontrol-apiserver-k8s-io)
定義隔離型別和可處理的併發預算量，還可以微調排隊行為。
[FlowSchemas](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#flowschema-v1alpha1-flowcontrol-apiserver-k8s-io)
用於對每個入站請求進行分類，並與一個 PriorityLevelConfigurations 相匹配。
此外同一 API 組還有一個 `v1alpha1` 版本，其中包含語法和語義都相同的資源類別。

<!--
### PriorityLevelConfiguration
A PriorityLevelConfiguration represents a single isolation class. Each
PriorityLevelConfiguration has an independent limit on the number of outstanding
requests, and limitations on the number of queued requests.
-->
### PriorityLevelConfiguration    {#PriorityLevelConfiguration}

一個 PriorityLevelConfiguration 表示單個隔離型別。每個 PriorityLevelConfigurations
對未完成的請求數有各自的限制，對排隊中的請求數也有限制。

<!--
Concurrency limits for PriorityLevelConfigurations are not specified in absolute
number of requests, but rather in "concurrency shares." The total concurrency
limit for the API Server is distributed among the existing
PriorityLevelConfigurations in proportion with these shares. This allows a
cluster administrator to scale up or down the total amount of traffic to a
server by restarting `kube-apiserver` with a different value for
`--max-requests-inflight` (or `--max-mutating-requests-inflight`), and all
PriorityLevelConfigurations will see their maximum allowed concurrency go up (or
down) by the same fraction.
-->
PriorityLevelConfigurations 的併發限制不是指定請求絕對數量，而是在“併發份額”中指定。
API 伺服器的總併發量限制透過這些份額按例分配到現有 PriorityLevelConfigurations 中。
叢集管理員可以更改 `--max-requests-inflight` （或 `--max-mutating-requests-inflight` ）的值，
再重新啟動 `kube-apiserver` 來增加或減小伺服器的總流量，
然後所有的 PriorityLevelConfigurations 將看到其最大併發增加（或減少）了相同的比例。

<!--
With the Priority and Fairness feature enabled, the total concurrency limit for
the server is set to the sum of `--max-requests-inflight` and
`--max-mutating-requests-inflight`. There is no longer any distinction made
between mutating and non-mutating requests; if you want to treat them
separately for a given resource, make separate FlowSchemas that match the
mutating and non-mutating verbs respectively.
-->
{{< caution >}}
啟用 APF 功能後，伺服器的總併發量限制將設定為
`--max-requests-inflight` 和 `--max-mutating-requests-inflight` 之和。
可變請求和不可變請求之間不再有任何區別；
如果對於某種資源，你需要區別對待不同請求，請建立不同的 FlowSchema 分別匹配可變請求和不可變請求。
{{< /caution >}}

<!--
When the volume of inbound requests assigned to a single
PriorityLevelConfiguration is more than its permitted concurrency level, the
`type` field of its specification determines what will happen to extra requests.
A type of `Reject` means that excess traffic will immediately be rejected with
an HTTP 429 (Too Many Requests) error. A type of `Queue` means that requests
above the threshold will be queued, with the shuffle sharding and fair queuing techniques used
to balance progress between request flows.
-->
當入站請求的數量大於分配的 PriorityLevelConfigurations 中允許的併發級別時， `type` 欄位將確定對額外請求的處理方式。
`Reject` 型別，表示多餘的流量將立即被 HTTP 429（請求過多）錯誤所拒絕。
`Queue` 型別，表示對超過閾值的請求進行排隊，將使用閾值分片和公平排隊技術來平衡請求流之間的進度。

<!--
The queuing configuration allows tuning the fair queuing algorithm for a
priority level. Details of the algorithm can be read in the
[enhancement proposal](#whats-next), but in short:
-->
公平排隊演算法支援透過排隊配置對優先順序微調。 可以在[增強建議](#whats-next)中閱讀演算法的詳細資訊，但總之：

<!--
* Increasing `queues` reduces the rate of collisions between different flows, at
  the cost of increased memory usage. A value of 1 here effectively disables the
  fair-queuing logic, but still allows requests to be queued.
-->
* `queues` 遞增能減少不同流之間的衝突機率，但代價是增加了記憶體使用量。
  值為 1 時，會禁用公平排隊邏輯，但仍允許請求排隊。

<!--
* Increasing `queueLengthLimit` allows larger bursts of traffic to be
  sustained without dropping any requests, at the cost of increased
  latency and memory usage.
-->
* `queueLengthLimit` 遞增可以在不丟棄任何請求的情況下支撐更大的突發流量，
  但代價是增加了等待時間和記憶體使用量。

<!--
* Changing `handSize` allows you to adjust the probability of collisions between
  different flows and the overall concurrency available to a single flow in an
  overload situation.

  {{< note >}}
  A larger `handSize` makes it less likely for two individual flows to collide
  (and therefore for one to be able to starve the other), but more likely that
  a small number of flows can dominate the apiserver. A larger `handSize` also
  potentially increases the amount of latency that a single high-traffic flow
  can cause. The maximum number of queued requests possible from a
  single flow is `handSize * queueLengthLimit`.
  {{< /note >}}
-->
* 修改 `handSize` 允許你調整過載情況下不同流之間的衝突機率以及單個流可用的整體併發性。

  {{< note >}}
  較大的 `handSize` 使兩個單獨的流程發生碰撞的可能性較小（因此，一個流可以餓死另一個流），
  但是更有可能的是少數流可以控制 apiserver。
  較大的 `handSize` 還可能增加單個高併發流的延遲量。
  單個流中可能排隊的請求的最大數量為 `handSize * queueLengthLimit` 。
  {{< /note >}}

<!--
Following is a table showing an interesting collection of shuffle
sharding configurations, showing for each the probability that a
given mouse (low-intensity flow) is squished by the elephants (high-intensity flows) for
an illustrative collection of numbers of elephants. See
https://play.golang.org/p/Gi0PLgVHiUg , which computes this table.
-->
下表顯示了有趣的隨機分片配置集合，
每行顯示給定的老鼠（低強度流）被不同數量的大象擠壓（高強度流）的機率。
表來源請參閱： https://play.golang.org/p/Gi0PLgVHiUg

{{< table caption = "Example Shuffle Sharding Configurations" >}}
<!-- HandSize | Queues | 1 elephant | 4 elephants | 16 elephants -->
隨機分片 | 佇列數 | 1 個大象 | 4 個大象 | 16 個大象
|----------|-----------|------------|----------------|--------------------|
| 12 | 32 | 4.428838398950118e-09 | 0.11431348830099144 | 0.9935089607656024 |
| 10 | 32 | 1.550093439632541e-08 | 0.0626479840223545 | 0.9753101519027554 |
| 10 | 64 | 6.601827268370426e-12 | 0.00045571320990370776 | 0.49999929150089345 |
| 9 | 64 | 3.6310049976037345e-11 | 0.00045501212304112273 | 0.4282314876454858 |
| 8 | 64 | 2.25929199850899e-10 | 0.0004886697053040446 | 0.35935114681123076 |
| 8 | 128 | 6.994461389026097e-13 | 3.4055790161620863e-06 | 0.02746173137155063 |
| 7 | 128 | 1.0579122850901972e-11 | 6.960839379258192e-06 | 0.02406157386340147 |
| 7 | 256 | 7.597695465552631e-14 | 6.728547142019406e-08 | 0.0006709661542533682 |
| 6 | 256 | 2.7134626662687968e-12 | 2.9516464018476436e-07 | 0.0008895654642000348 |
| 6 | 512 | 4.116062922897309e-14 | 4.982983350480894e-09 | 2.26025764343413e-05 |
| 6 | 1024 | 6.337324016514285e-16 | 8.09060164312957e-11 | 4.517408062903668e-07 |
{{< /table >}}

<!-- ### FlowSchema -->
### FlowSchema    {#FlowSchema}

<!--
A FlowSchema matches some inbound requests and assigns them to a
priority level. Every inbound request is tested against every
FlowSchema in turn, starting with those with numerically lowest ---
which we take to be the logically highest --- `matchingPrecedence` and
working onward.  The first match wins.
-->
FlowSchema 匹配一些入站請求，並將它們分配給優先順序。
每個入站請求都會對所有 FlowSchema 測試是否匹配，
首先從 `matchingPrecedence` 數值最低的匹配開始（我們認為這是邏輯上匹配度最高），
然後依次進行，直到首個匹配出現。

<!--
Only the first matching FlowSchema for a given request matters. If multiple
FlowSchemas match a single inbound request, it will be assigned based on the one
with the highest `matchingPrecedence`. If multiple FlowSchemas with equal
`matchingPrecedence` match the same request, the one with lexicographically
smaller `name` will win, but it's better not to rely on this, and instead to
ensure that no two FlowSchemas have the same `matchingPrecedence`.
-->
{{< caution >}}
對一個請求來說，只有首個匹配的 FlowSchema  才有意義。
如果一個入站請求與多個 FlowSchema 匹配，則將基於 `matchingPrecedence` 值最高的請求進行篩選。
如果一個請求匹配多個 FlowSchema 且 `matchingPrecedence` 的值相同，則按 `name` 的字典序選擇最小，
但是最好不要依賴它，而是確保不存在兩個 FlowSchema 具有相同的 `matchingPrecedence` 值。
{{< /caution >}}

<!--
A FlowSchema matches a given request if at least one of its `rules`
matches. A rule matches if at least one of its `subjects` *and* at least
one of its `resourceRules` or `nonResourceRules` (depending on whether the
incoming request is for a resource or non-resource URL) matches the request.
-->
當給定的請求與某個 FlowSchema 的 `rules` 的其中一條匹配，那麼就認為該請求與該 FlowSchema 匹配。
判斷規則與該請求是否匹配，**不僅**要求該條規則的 `subjects` 欄位至少存在一個與該請求相匹配，
**而且**要求該條規則的 `resourceRules` 或 `nonResourceRules`
（取決於傳入請求是針對資源URL還是非資源URL）欄位至少存在一個與該請求相匹配。

<!--
For the `name` field in subjects, and the `verbs`, `apiGroups`, `resources`,
`namespaces`, and `nonResourceURLs` fields of resource and non-resource rules,
the wildcard `*` may be specified to match all values for the given field,
effectively removing it from consideration.
-->
對於 `subjects` 中的 `name` 欄位和資源和非資源規則的
`verbs`，`apiGroups`，`resources`，`namespaces` 和 `nonResourceURLs` 欄位，
可以指定萬用字元 `*` 來匹配任意值，從而有效地忽略該欄位。

<!--
A FlowSchema's `distinguisherMethod.type` determines how requests matching that
schema will be separated into flows. It may be
either `ByUser`, in which case one requesting user will not be able to starve
other users of capacity, or `ByNamespace`, in which case requests for resources
in one namespace will not be able to starve requests for resources in other
namespaces of capacity, or it may be blank (or `distinguisherMethod` may be
omitted entirely), in which case all requests matched by this FlowSchema will be
considered part of a single flow. The correct choice for a given FlowSchema
depends on the resource and your particular environment.
-->
FlowSchema 的 `distinguisherMethod.type` 欄位決定了如何把與該模式匹配的請求分散到各個流中。
可能是 `ByUser` ，在這種情況下，一個請求使用者將無法餓死其他容量的使用者；
或者是 `ByNamespace` ，在這種情況下，一個名稱空間中的資源請求將無法餓死其它名稱空間的資源請求；
或者它可以為空（或者可以完全省略 `distinguisherMethod`），
在這種情況下，與此 FlowSchema 匹配的請求將被視為單個流的一部分。
資源和你的特定環境決定了如何選擇正確一個 FlowSchema。

<!--
## Defaults

Each kube-apiserver maintains two sorts of APF configuration objects:
mandatory and suggested.
-->
## 預設值    {#defaults}

每個 kube-apiserver 會維護兩種型別的 APF 配置物件：強制的（Mandatory）和建議的（Suggested）。

<!--
### Mandatory Configuration Objects

The four mandatory configuration objects reflect fixed built-in
guardrail behavior.  This is behavior that the servers have before
those objects exist, and when those objects exist their specs reflect
this behavior.  The four mandatory objects are as follows.
-->
### 強制的配置物件

有四種強制的配置物件對應內建的守護行為。這裡的行為是伺服器在還未建立物件之前就具備的行為，
而當這些物件存在時，其規約反映了這類行為。四種強制的物件如下：

<!--
* The mandatory `exempt` priority level is used for requests that are
  not subject to flow control at all: they will always be dispatched
  immediately. The mandatory `exempt` FlowSchema classifies all
  requests from the `system:masters` group into this priority
  level. You may define other FlowSchemas that direct other requests
  to this priority level, if appropriate.
-->
* 強制的 `exempt` 優先順序用於完全不受流控限制的請求：它們總是立刻被分發。
  強制的 `exempt` FlowSchema 把 `system:masters` 組的所有請求都歸入該優先順序。
  如果合適，你可以定義新的 FlowSchema，將其他請求定向到該優先順序。
<!--
* The mandatory `catch-all` priority level is used in combination with
  the mandatory `catch-all` FlowSchema to make sure that every request
  gets some kind of classification. Typically you should not rely on
  this catch-all configuration, and should create your own catch-all
  FlowSchema and PriorityLevelConfiguration (or use the suggested
  `global-default` priority level that is installed by default) as
  appropriate. Because it is not expected to be used normally, the
  mandatory `catch-all` priority level has a very small concurrency
  share and does not queue requests.
-->
* 強制的 `catch-all` 優先順序與強制的 `catch-all` FlowSchema 結合使用，
  以確保每個請求都分類。一般而言，你不應該依賴於 `catch-all` 的配置，
  而應適當地建立自己的 `catch-all` FlowSchema 和 PriorityLevelConfiguration
  （或使用預設安裝的 `global-default` 配置）。
  因為這一優先順序不是正常場景下要使用的，`catch-all` 優先順序的併發度份額很小，
  並且不會對請求進行排隊。

<!--
### Suggested Configuration Objects

The suggested FlowSchemas and PriorityLevelConfigurations constitute a
reasonable default configuration.  You can modify these and/or create
additional configuration objects if you want.  If your cluster is
likely to experience heavy load then you should consider what
configuration will work best.

The suggested configuration groups requests into six priority levels:
-->
### 建議的配置物件

建議的 FlowSchema 和 PriorityLevelConfiguration 包含合理的預設配置。
你可以修改這些物件或者根據需要建立新的配置物件。如果你的叢集可能承受較重負載，
那麼你就要考慮哪種配置最合適。

建議的配置把請求分為六個優先順序：

<!--
* The `node-high` priority level is for health updates from nodes.
-->
* `node-high` 優先順序用於來自節點的健康狀態更新。

<!--
* The `system` priority level is for non-health requests from the
  `system:nodes` group, i.e. Kubelets, which must be able to contact
  the API server in order for workloads to be able to schedule on
  them.
-->
* `system` 優先順序用於 `system:nodes` 組（即 kubelet）的與健康狀態更新無關的請求；
  kubelets 必須能連上 API 伺服器，以便工作負載能夠排程到其上。

<!--
* The `leader-election` priority level is for leader election requests from
  built-in controllers (in particular, requests for `endpoints`, `configmaps`,
  or `leases` coming from the `system:kube-controller-manager` or
  `system:kube-scheduler` users and service accounts in the `kube-system`
  namespace). These are important to isolate from other traffic because failures
  in leader election cause their controllers to fail and restart, which in turn
  causes more expensive traffic as the new controllers sync their informers.
-->
* `leader-election` 優先順序用於內建控制器的領導選舉的請求
  （特別是來自 `kube-system` 名稱空間中 `system:kube-controller-manager` 和
  `system:kube-scheduler` 使用者和服務賬號，針對 `endpoints`、`configmaps` 或 `leases` 的請求）。
  將這些請求與其他流量相隔離非常重要，因為領導者選舉失敗會導致控制器發生故障並重新啟動，
  這反過來會導致新啟動的控制器在同步資訊時，流量開銷更大。

<!--
* The `workload-high` priority level is for other requests from built-in
  controllers.
* The `workload-low` priority level is for requests from any other service
  account, which will typically include all requests from controllers running in
  Pods.
* The `global-default` priority level handles all other traffic, e.g.
  interactive `kubectl` commands run by nonprivileged users.
-->
* `workload-high` 優先順序用於內建控制器的其他請求。
* `workload-low` 優先順序用於來自所有其他服務帳戶的請求，通常包括來自 Pod
  中執行的控制器的所有請求。
* `global-default` 優先順序可處理所有其他流量，例如：非特權使用者執行的互動式
  `kubectl` 命令。

<!--
The suggested FlowSchemas serve to steer requests into the above
priority levels, and are not enumerated here.
-->
建議的 FlowSchema 用來將請求導向上述的優先順序內，這裡不再一一列舉。

<!--
### Maintenance of the Mandatory and Suggested Configuration Objects

Each `kube-apiserver` independently maintains the mandatory and
suggested configuration objects, using initial and periodic behavior.
Thus, in a situation with a mixture of servers of different versions
there may be thrashing as long as different servers have different
opinions of the proper content of these objects.
-->
### 強制的與建議的配置物件的維護

每個 `kube-apiserver` 都獨立地維護其強制的與建議的配置物件，
這一維護操作既是伺服器的初始行為，也是其週期性操作的一部分。
因此，當存在不同版本的伺服器時，如果各個伺服器對於配置物件中的合適內容有不同意見，
就可能出現抖動。

<!--
Each `kube-apiserver` makes an initial maintenance pass over the
mandatory and suggested configuration objects, and after that does
periodic maintenance (once per minute) of those objects.

For the mandatory configuration objects, maintenance consists of
ensuring that the object exists and, if it does, has the proper spec.
The server refuses to allow a creation or update with a spec that is
inconsistent with the server's guardrail behavior.
-->
每個 `kube-apiserver` 都會對強制的與建議的配置物件執行初始的維護操作，
之後（每分鐘）對這些物件執行週期性的維護。

對於強制的配置物件，維護操作包括確保物件存在並且包含合適的規約（如果存在的話）。
伺服器會拒絕建立或更新與其守護行為不一致的規約。

<!--
Maintenance of suggested configuration objects is designed to allow
their specs to be overridden.  Deletion, on the other hand, is not
respected: maintenance will restore the object.  If you do not want a
suggested configuration object then you need to keep it around but set
its spec to have minimal consequences.  Maintenance of suggested
objects is also designed to support automatic migration when a new
version of the `kube-apiserver` is rolled out, albeit potentially with
thrashing while there is a mixed population of servers.
-->
對建議的配置物件的維護操作被設計為允許其規約被過載。刪除操作是不允許的，
維護操作期間會重建這類配置物件。如果你不需要某個建議的配置物件，
你需要將它放在一邊，並讓其規約所產生的影響最小化。
對建議的配置物件而言，其維護方面的設計也支援在上線新的 `kube-apiserver`
時完成自動的遷移動作，即便可能因為當前的伺服器集合存在不同的版本而可能造成抖動仍是如此。

<!--
Maintenance of a suggested configuration object consists of creating
it --- with the server's suggested spec --- if the object does not
exist.  OTOH, if the object already exists, maintenance behavior
depends on whether the `kube-apiservers` or the users control the
object.  In the former case, the server ensures that the object's spec
is what the server suggests; in the latter case, the spec is left
alone.
-->
對建議的配置物件的維護操作包括基於伺服器建議的規約建立物件
（如果物件不存在的話）。反之，如果物件已經存在，維護操作的行為取決於是否
`kube-apiserver` 或者使用者在控制物件。如果 `kube-apiserver` 在控制物件，
則伺服器確保物件的規約與伺服器所給的建議匹配，如果使用者在控制物件，
物件的規約保持不變。

<!--
The question of who controls the object is answered by first looking
for an annotation with key `apf.kubernetes.io/autoupdate-spec`.  If
there is such an annotation and its value is `true` then the
kube-apiservers control the object.  If there is such an annotation
and its value is `false` then the users control the object.  If
neither of those condtions holds then the `metadata.generation` of the
object is consulted.  If that is 1 then the kube-apiservers control
the object.  Otherwise the users control the object.  These rules were
introduced in release 1.22 and their consideration of
`metadata.generation` is for the sake of migration from the simpler
earlier behavior.  Users who wish to control a suggested configuration
object should set its `apf.kubernetes.io/autoupdate-spec` annotation
to `false`.
-->
關於誰在控制物件這個問題，首先要看物件上的 `apf.kubernetes.io/autoupdate-spec`
註解。如果物件上存在這個註解，並且其取值為`true`，則 kube-apiserver
在控制該物件。如果存在這個註解，並且其取值為`false`，則使用者在控制物件。
如果這兩個條件都不滿足，則需要進一步檢視物件的 `metadata.generation`。
如果該值為 1，則 kube-apiserver 控制物件，否則使用者控制物件。
這些規則是在 1.22 發行版中引入的，而對 `metadata.generation`
的考量是為了便於從之前較簡單的行為遷移過來。希望控制建議的配置物件的使用者應該將物件的
`apf.kubernetes.io/autoupdate-spec` 註解設定為 `false`。

<!--
Maintenance of a mandatory or suggested configuration object also
includes ensuring that it has an `apf.kubernetes.io/autoupdate-spec`
annotation that accurately reflects whether the kube-apiservers
control the object.

Maintenance also includes deleting objects that are neither mandatory
nor suggested but are annotated
`apf.kubernetes.io/autoupdate-spec=true`.
-->
對強制的或建議的配置物件的維護操作也包括確保物件上存在 `apf.kubernetes.io/autoupdate-spec`
這一註解，並且其取值準確地反映了是否 kube-apiserver 在控制著物件。

維護操作還包括刪除那些既非強制又非建議的配置，同時註解配置為
`apf.kubernetes.io/autoupdate-spec=true` 的物件。

<!--
## Health check concurrency exemption
-->
## 健康檢查併發豁免    {#Health-check-concurrency-exemption}

<!--
The suggested configuration gives no special treatment to the health
check requests on kube-apiservers from their local kubelets --- which
tend to use the secured port but supply no credentials.  With the
suggested config, these requests get assigned to the `global-default`
FlowSchema and the corresponding `global-default` priority level,
where other traffic can crowd them out.
-->
推薦配置沒有為本地 kubelet 對 kube-apiserver 執行健康檢查的請求進行任何特殊處理
——它們傾向於使用安全埠，但不提供憑據。
在推薦配置中，這些請求將分配 `global-default` FlowSchema 和 `global-default` 優先順序，
這樣其他流量可以排除健康檢查。

<!--
If you add the following additional FlowSchema, this exempts those
requests from rate limiting.
-->
如果新增以下 FlowSchema，健康檢查請求不受速率限制。

<!--
Making this change also allows any hostile party to then send
health-check requests that match this FlowSchema, at any volume they
like.  If you have a web traffic filter or similar external security
mechanism to protect your cluster's API server from general internet
traffic, you can configure rules to block any health check requests
that originate from outside your cluster.
-->
{{< caution >}}
進行此更改後，任何敵對方都可以傳送與此 FlowSchema 匹配的任意數量的健康檢查請求。
如果你有 Web 流量過濾器或類似的外部安全機制保護叢集的 API 伺服器免受常規網路流量的侵擾，
則可以配置規則，阻止所有來自叢集外部的健康檢查請求。
{{< /caution >}}

{{< codenew file="priority-and-fairness/health-for-strangers.yaml" >}}

<!--
## Diagnostics

Every HTTP response from an API server with the priority and fairness feature
enabled has two extra headers: `X-Kubernetes-PF-FlowSchema-UID` and
`X-Kubernetes-PF-PriorityLevel-UID`, noting the flow schema that matched the request
and the priority level to which it was assigned, respectively. The API objects'
names are not included in these headers in case the requesting user does not
have permission to view them, so when debugging you can use a command like
-->

## 問題診斷    {#diagnostics}

啟用了 APF 的 API 伺服器，它每個 HTTP 響應都有兩個額外的 HTTP 頭：
`X-Kubernetes-PF-FlowSchema-UID` 和 `X-Kubernetes-PF-PriorityLevel-UID`，
注意與請求匹配的 FlowSchema 和已分配的優先順序。
如果請求使用者沒有檢視這些物件的許可權，則這些 HTTP 頭中將不包含 API 物件的名稱，
因此在除錯時，你可以使用類似如下的命令：

```shell
kubectl get flowschemas -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
kubectl get prioritylevelconfigurations -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
```

<!--
to get a mapping of UIDs to names for both FlowSchemas and
PriorityLevelConfigurations.
-->
來獲取 UID 到 FlowSchema 的名稱和 UID 到 PriorityLevelConfigurations 的名稱的對映。

<!--
## Observability

### Metrics
-->
## 可觀察性    {#Observability}

### 指標    {#Metrics}

<!--
In versions of Kubernetes before v1.20, the labels `flow_schema` and
`priority_level` were inconsistently named `flowSchema` and `priorityLevel`,
respectively. If you're running Kubernetes versions v1.19 and earlier, you
should refer to the documentation for your version.
-->
{{< note >}}
在 Kubernetes v1.20 之前的版本中，標籤 `flow_schema` 和 `priority_level`
的名稱有時被寫作 `flowSchema` 和 `priorityLevel`，即存在不一致的情況。
如果你在執行 Kubernetes v1.19 或者更早版本，你需要參考你所使用的叢集
版本對應的文件。
{{< /note >}}

<!--
When you enable the API Priority and Fairness feature, the kube-apiserver
exports additional metrics. Monitoring these can help you determine whether your
configuration is inappropriately throttling important traffic, or find
poorly-behaved workloads that may be harming system health.
-->
當你開啟了 APF 後，kube-apiserver 會暴露額外指標。
監視這些指標有助於判斷你的配置是否不當地限制了重要流量，
或者發現可能會損害系統健康的，行為不良的工作負載。

<!--
* `apiserver_flowcontrol_rejected_requests_total` is a counter vector
  (cumulative since server start) of requests that were rejected,
  broken down by the labels `flow_schema` (indicating the one that
  matched the request), `priority_evel` (indicating the one to which
  the request was assigned), and `reason`.  The `reason` label will be
  have one of the following values:
-->
* `apiserver_flowcontrol_rejected_requests_total` 是一個計數器向量，
  記錄被拒絕的請求數量（自伺服器啟動以來累計值），
  由標籤 `flow_chema`（表示與請求匹配的 FlowSchema），`priority_evel` 
  （表示分配給請該求的優先順序）和 `reason` 來區分。
  `reason` 標籤將具有以下值之一：
  <!--
  * `queue-full`, indicating that too many requests were already
    queued,
  * `concurrency-limit`, indicating that the
    PriorityLevelConfiguration is configured to reject rather than
    queue excess requests, or
  * `time-out`, indicating that the request was still in the queue
    when its queuing time limit expired.
  -->
  * `queue-full` ，表明已經有太多請求排隊，
  * `concurrency-limit`，表示將 PriorityLevelConfiguration 配置為
    `Reject` 而不是 `Queue` ，或者
  * `time-out`, 表示在其排隊時間超期的請求仍在佇列中。

<!--
* `apiserver_flowcontrol_dispatched_requests_total` is a counter
  vector (cumulative since server start) of requests that began
  executing, broken down by the labels `flow_schema` (indicating the
  one that matched the request) and `priority_level` (indicating the
  one to which the request was assigned).
-->
* `apiserver_flowcontrol_dispatched_requests_total` 是一個計數器向量，
  記錄開始執行的請求數量（自伺服器啟動以來的累積值），
  由標籤 `flow_schema`（表示與請求匹配的 FlowSchema）和
  `priority_level`（表示分配給該請求的優先順序）來區分。

<!--
* `apiserver_current_inqueue_requests` is a gauge vector of recent
  high water marks of the number of queued requests, grouped by a
  label named `request_kind` whose value is `mutating` or `readOnly`.
  These high water marks describe the largest number seen in the one
  second window most recently completed.  These complement the older
  `apiserver_current_inflight_requests` gauge vector that holds the
  last window's high water mark of number of requests actively being
  served.
-->
* `apiserver_current_inqueue_requests` 是一個表向量，
  記錄最近排隊請求數量的高水位線，
  由標籤 `request_kind` 分組，標籤的值為 `mutating` 或 `readOnly`。
  這些高水位線表示在最近一秒鐘內看到的最大數字。
  它們補充說明了老的表向量 `apiserver_current_inflight_requests`
  （該量儲存了最後一個視窗中，正在處理的請求數量的高水位線）。

<!--
* `apiserver_flowcontrol_read_vs_write_request_count_samples` is a
  histogram vector of observations of the then-current number of
  requests, broken down by the labels `phase` (which takes on the
  values `waiting` and `executing`) and `request_kind` (which takes on
  the values `mutating` and `readOnly`).  The observations are made
  periodically at a high rate.
-->
* `apiserver_flowcontrol_read_vs_write_request_count_samples` 是一個直方圖向量，
  記錄當前請求數量的觀察值，
  由標籤 `phase`（取值為 `waiting` 和 `executing`）和 `request_kind`
  （取值 `mutating` 和 `readOnly`）拆分。定期以高速率觀察該值。

<!--
* `apiserver_flowcontrol_read_vs_write_request_count_watermarks` is a
  histogram vector of high or low water marks of the number of
  requests broken down by the labels `phase` (which takes on the
  values `waiting` and `executing`) and `request_kind` (which takes on
  the values `mutating` and `readOnly`); the label `mark` takes on
  values `high` and `low`.  The water marks are accumulated over
  windows bounded by the times when an observation was added to
  `apiserver_flowcontrol_read_vs_write_request_count_samples`.  These
  water marks show the range of values that occurred between samples.
-->
* `apiserver_flowcontrol_read_vs_write_request_count_watermarks` 是一個直方圖向量，
  記錄請求數量的高/低水位線，
  由標籤 `phase`（取值為 `waiting` 和 `executing`）和 `request_kind`
  （取值為 `mutating` 和 `readOnly`）拆分；標籤 `mark` 取值為 `high` 和 `low` 。
  `apiserver_flowcontrol_read_vs_write_request_count_samples` 向量觀察到有值新增，
  則該向量累積。這些水位線顯示了樣本值的範圍。

<!--
* `apiserver_flowcontrol_current_inqueue_requests` is a gauge vector
  holding the instantaneous number of queued (not executing) requests,
  broken down by the labels `priorityLevel` and `flowSchema`.
-->
* `apiserver_flowcontrol_current_inqueue_requests` 是一個表向量，
  記錄包含排隊中的（未執行）請求的瞬時數量，
  由標籤 `priorityLevel` 和 `flowSchema` 拆分。

<!--
* `apiserver_flowcontrol_current_executing_requests` is a gauge vector
  holding the instantaneous number of executing (not waiting in a
  queue) requests, broken down by the labels `priority_level` and
  `flow_schema`.
-->
* `apiserver_flowcontrol_current_executing_requests` 是一個表向量，
  記錄包含執行中（不在佇列中等待）請求的瞬時數量，
  由標籤 `priority_level` 和 `flow_schema` 進一步區分。

<!-- 
* `apiserver_flowcontrol_request_concurrency_in_use` is a gauge vector
  holding the instantaneous number of occupied seats, broken down by
  the labels `priority_level` and `flow_schema`.
-->
* `apiserver_flowcontrol_request_concurrency_in_use` 是一個規範向量，
  包含佔用座位的瞬時數量，由標籤 `priority_level` 和 `flow_schema` 進一步區分。

<!--
* `apiserver_flowcontrol_priority_level_request_count_samples` is a
  histogram vector of observations of the then-current number of
  requests broken down by the labels `phase` (which takes on the
  values `waiting` and `executing`) and `priority_level`.  Each
  histogram gets observations taken periodically, up through the last
  activity of the relevant sort.  The observations are made at a high
  rate.
-->
* `apiserver_flowcontrol_priority_level_request_count_samples` 是一個直方圖向量，
  記錄當前請求的觀測值，由標籤 `phase`（取值為`waiting` 和 `executing`）和
  `priority_level` 進一步區分。
  每個直方圖都會定期進行觀察，直到相關類別的最後活動為止。觀察頻率高。

<!--
* `apiserver_flowcontrol_priority_level_request_count_watermarks` is a
  histogram vector of high or low water marks of the number of
  requests broken down by the labels `phase` (which takes on the
  values `waiting` and `executing`) and `priority_level`; the label
  `mark` takes on values `high` and `low`.  The water marks are
  accumulated over windows bounded by the times when an observation
  was added to
  `apiserver_flowcontrol_priority_level_request_count_samples`.  These
  water marks show the range of values that occurred between samples.
-->
* `apiserver_flowcontrol_priority_level_request_count_watermarks` 是一個直方圖向量，
  記錄請求數的高/低水位線，由標籤 `phase`（取值為 `waiting` 和 `executing`）和
  `priority_level` 拆分；
  標籤 `mark` 取值為 `high` 和 `low` 。
  `apiserver_flowcontrol_priority_level_request_count_samples` 向量觀察到有值新增，
  則該向量累積。這些水位線顯示了樣本值的範圍。

<!--
* `apiserver_flowcontrol_request_queue_length_after_enqueue` is a
  histogram vector of queue lengths for the queues, broken down by
  the labels `priority_level` and `flow_schema`, as sampled by the
  enqueued requests.  Each request that gets queued contributes one
  sample to its histogram, reporting the length of the queue immediately
  after the request was added.  Note that this produces different
  statistics than an unbiased survey would.
-->
* `apiserver_flowcontrol_request_queue_length_after_enqueue` 是一個直方圖向量，
  記錄請求佇列的長度，由標籤 `priority_level` 和 `flow_schema` 進一步區分。
  每個排隊中的請求都會為其直方圖貢獻一個樣本，並在新增請求後立即上報佇列的長度。
  請注意，這樣產生的統計資料與無偏調查不同。
  <!--
  An outlier value in a histogram here means it is likely that a single flow
  (i.e., requests by one user or for one namespace, depending on
  configuration) is flooding the API server, and being throttled. By contrast,
  if one priority level's histogram shows that all queues for that priority
  level are longer than those for other priority levels, it may be appropriate
  to increase that PriorityLevelConfiguration's concurrency shares.
  -->
  {{< note >}}
  直方圖中的離群值在這裡表示單個流（即，一個使用者或一個名稱空間的請求，
  具體取決於配置）正在瘋狂地向 API 伺服器發請求，並受到限制。
  相反，如果一個優先順序的直方圖顯示該優先順序的所有佇列都比其他優先順序的佇列長，
  則增加 PriorityLevelConfigurations 的併發份額是比較合適的。
  {{< /note >}}

<!--
* `apiserver_flowcontrol_request_concurrency_limit` is a gauge vector
  hoding the computed concurrency limit (based on the API server's
  total concurrency limit and PriorityLevelConfigurations' concurrency
  shares), broken down by the label `priority_level`.
-->
* `apiserver_flowcontrol_request_concurrency_limit` 是一個表向量，
  記錄併發限制的計算值（基於 API 伺服器的總併發限制和 PriorityLevelConfigurations
  的併發份額），並按標籤 `priority_level` 進一步區分。

<!--
* `apiserver_flowcontrol_request_wait_duration_seconds` is a histogram
  vector of how long requests spent queued, broken down by the labels
  `flowSchema` (indicating which one matched the request),
  `priorityLevel` (indicating the one to which the request was
  assigned), and `execute` (indicating whether the request started
  executing).
-->
* `apiserver_flowcontrol_request_wait_duration_seconds` 是一個直方圖向量，
  記錄請求排隊的時間，
  由標籤 `flow_schema`（表示與請求匹配的 FlowSchema ），
  `priority_level`（表示分配該請求的優先順序）
  和 `execute`（表示請求是否開始執行）進一步區分。
  <!--
  Since each FlowSchema always assigns requests to a single
  PriorityLevelConfiguration, you can add the histograms for all the
  FlowSchemas for one priority level to get the effective histogram for
  requests assigned to that priority level.
  -->
  {{< note >}}
  由於每個 FlowSchema 總會給請求分配 PriorityLevelConfigurations，
  因此你可以為一個優先順序新增所有 FlowSchema 的直方圖，以獲取分配給
  該優先順序的請求的有效直方圖。
  {{< /note >}}

<!--
* `apiserver_flowcontrol_request_execution_seconds` is a histogram
  vector of how long requests took to actually execute, broken down by
  the labels `flowSchema` (indicating which one matched the request)
  and `priorityLevel` (indicating the one to which the request was
  assigned).
-->
* `apiserver_flowcontrol_request_execution_seconds` 是一個直方圖向量，
  記錄請求實際執行需要花費的時間，
  由標籤 `flow_schema`（表示與請求匹配的 FlowSchema ）和
  `priority_level`（表示分配給該請求的優先順序）進一步區分。

<!--
### Debug endpoints

When you enable the API Priority and Fairness feature, the `kube-apiserver`
serves the following additional paths at its HTTP[S] ports.
-->
### 除錯端點    {#Debug-endpoints}

啟用 APF 特性後， kube-apiserver 會在其 HTTP/HTTPS 埠提供以下路徑：

<!--
- `/debug/api_priority_and_fairness/dump_priority_levels` - a listing of
  all the priority levels and the current state of each.  You can fetch like this:
-->
- `/debug/api_priority_and_fairness/dump_priority_levels` ——
  所有優先順序及其當前狀態的列表。你可以這樣獲取：

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_priority_levels
  ```

  <!-- The output is similar to this: -->
  輸出類似於：

  ```none
  PriorityLevelName, ActiveQueues, IsIdle, IsQuiescing, WaitingRequests, ExecutingRequests,
  workload-low,      0,            true,   false,       0,               0,
  global-default,    0,            true,   false,       0,               0,
  exempt,            <none>,       <none>, <none>,      <none>,          <none>,
  catch-all,         0,            true,   false,       0,               0,
  system,            0,            true,   false,       0,               0,
  leader-election,   0,            true,   false,       0,               0,
  workload-high,     0,            true,   false,       0,               0,
  ```

<!--
- `/debug/api_priority_and_fairness/dump_queues` - a listing of all the
  queues and their current state.  You can fetch like this:
-->
- `/debug/api_priority_and_fairness/dump_queues` —— 所有佇列及其當前狀態的列表。
  你可以這樣獲取：

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_queues
  ```

  <!-- The output is similar to this: -->
  輸出類似於：

  ```none
  PriorityLevelName, Index,  PendingRequests, ExecutingRequests, VirtualStart,
  workload-high,     0,      0,               0,                 0.0000,
  workload-high,     1,      0,               0,                 0.0000,
  workload-high,     2,      0,               0,                 0.0000,
  ...
  leader-election,   14,     0,               0,                 0.0000,
  leader-election,   15,     0,               0,                 0.0000,
  ```

<!--
- `/debug/api_priority_and_fairness/dump_requests` - a listing of all the requests
  that are currently waiting in a queue.  You can fetch like this:
-->
- `/debug/api_priority_and_fairness/dump_requests` ——當前正在佇列中等待的所有請求的列表。
  你可以這樣獲取：

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_requests
  ```

  <!-- The output is similar to this: -->
  輸出類似於：

  ```none
  PriorityLevelName, FlowSchemaName, QueueIndex, RequestIndexInQueue, FlowDistingsher,       ArriveTime,
  exempt,            <none>,         <none>,     <none>,              <none>,                <none>,
  system,            system-nodes,   12,         0,                   system:node:127.0.0.1, 2020-07-23T15:26:57.179170694Z,
  ```

  <!--
  In addition to the queued requests, the output includes one phantom line
  for each priority level that is exempt from limitation.
  -->
  針對每個優先級別，輸出中還包含一條虛擬記錄，對應豁免限制。

  <!-- You can get a more detailed listing with a command like this: -->
  你可以使用以下命令獲得更詳細的清單：

  ```shell
  kubectl get --raw '/debug/api_priority_and_fairness/dump_requests?includeRequestDetails=1'
  ```

  <!-- The output is similar to this: -->

  輸出類似於：
  ```none
  PriorityLevelName, FlowSchemaName, QueueIndex, RequestIndexInQueue, FlowDistingsher,       ArriveTime,                     UserName,              Verb,   APIPath,                                                     Namespace, Name,   APIVersion, Resource, SubResource,
  system,            system-nodes,   12,         0,                   system:node:127.0.0.1, 2020-07-23T15:31:03.583823404Z, system:node:127.0.0.1, create, /api/v1/namespaces/scaletest/configmaps,
  system,            system-nodes,   12,         1,                   system:node:127.0.0.1, 2020-07-23T15:31:03.594555947Z, system:node:127.0.0.1, create, /api/v1/namespaces/scaletest/configmaps,
  ```

## {{% heading "whatsnext" %}}

<!--
For background information on design details for API priority and fairness, see
the [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness).
You can make suggestions and feature requests via [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery) 
or the feature's [slack channel](https://kubernetes.slack.com/messages/api-priority-and-fairness).
-->
有關 API 優先順序和公平性的設計細節的背景資訊，
請參閱[增強提案](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness)。
你可以透過 [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery/)
或特性的 [Slack 頻道](https://kubernetes.slack.com/messages/api-priority-and-fairness/)
提出建議和特性請求。

