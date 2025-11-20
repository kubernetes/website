---
title: API 優先級和公平性
content_type: concept
min-kubernetes-server-version: v1.18
weight: 110
---
<!--
title: API Priority and Fairness
content_type: concept
min-kubernetes-server-version: v1.18
weight: 110
-->

<!-- overview -->

{{< feature-state state="stable"  for_k8s_version="v1.29" >}}

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
對於叢集管理員來說，控制 Kubernetes API 伺服器在過載情況下的行爲是一項關鍵任務。
{{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
有一些控件（例如：命令列標誌 `--max-requests-inflight` 和 `--max-mutating-requests-inflight`），
可以限制將要接受的未處理的請求，從而防止過量請求入站，潛在導致 API 伺服器崩潰。
但是這些標誌不足以保證在高流量期間，最重要的請求仍能被伺服器接受。

<!--
The API Priority and Fairness feature (APF) is an alternative that improves upon
aforementioned max-inflight limitations. APF classifies
and isolates requests in a more fine-grained way. It also introduces
a limited amount of queuing, so that no requests are rejected in cases
of very brief bursts. Requests are dispatched from queues using a
fair queuing technique so that, for example, a poorly-behaved
{{< glossary_tooltip text="controller" term_id="controller" >}} need not
starve others (even at the same priority level).
-->
API 優先級和公平性（APF）是一種替代方案，可提升上述最大併發限制。
APF 以更細粒度的方式對請求進行分類和隔離。
它還引入了空間有限的排隊機制，因此在非常短暫的突發情況下，API 伺服器不會拒絕任何請求。
通過使用公平排隊技術從隊列中分發請求，這樣，
一個行爲不佳的{{< glossary_tooltip text="控制器" term_id="controller" >}}就不會餓死其他控制器
（即使優先級相同）。

<!--
This feature is designed to work well with standard controllers, which
use informers and react to failures of API requests with exponential
back-off, and other clients that also work this way.
-->
本功能特性在設計上期望其能與標準控制器一起工作得很好；
這類控制器使用通知組件（Informers）獲得資訊並對 API 請求的失效作出反應，
在處理失效時能夠執行指數型回退。其他客戶端也以類似方式工作。

{{< caution >}}
<!--
Some requests classified as "long-running"&mdash;such as remote
command execution or log tailing&mdash;are not subject to the API
Priority and Fairness filter. This is also true for the
`--max-requests-inflight` flag without the API Priority and Fairness
feature enabled. API Priority and Fairness _does_ apply to **watch**
requests. When API Priority and Fairness is disabled, **watch** requests
are not subject to the `--max-requests-inflight` limit.
-->
屬於 “長時間運行” 類型的某些請求（例如遠程命令執行或日誌拖尾）不受 API 優先級和公平性過濾器的約束。
如果未啓用 APF 特性，即便設置 `--max-requests-inflight` 標誌，該類請求也不受約束。
APF 適用於 **watch** 請求。當 APF 被禁用時，**watch** 請求不受 `--max-requests-inflight` 限制。
{{< /caution >}}

<!-- body -->

<!--
## Enabling/Disabling API Priority and Fairness
-->
## 啓用/禁用 API 優先級和公平性    {#enabling-api-priority-and-fairness}

<!--
The API Priority and Fairness feature is controlled by a command-line flag
and is enabled by default. See 
[Options](/docs/reference/command-line-tools-reference/kube-apiserver/#options)
for a general explanation of the available kube-apiserver command-line 
options and how to enable and disable them. The name of the 
command-line option for APF is "--enable-priority-and-fairness". This feature
also involves an {{<glossary_tooltip term_id="api-group" text="API Group" >}} 
with: (a) a stable `v1` version, introduced in 1.29, and 
enabled by default (b) a `v1beta3` version, enabled by default, and
deprecated in v1.29. You can
disable the API group beta version `v1beta3` by adding the
following command-line flags to your `kube-apiserver` invocation:
-->
API 優先級與公平性（APF）特性由命令列標誌控制，預設情況下啓用。
有關可用 kube-apiserver 命令列參數以及如何啓用和禁用的說明，
請參見[參數](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/#options)。
APF 的命令列參數是 "--enable-priority-and-fairness"。
此特性也與某個 {{< glossary_tooltip term_id="api-group" text="API 組" >}}相關：
(a) 穩定的 `v1` 版本，在 1.29 中引入，預設啓用；
(b) `v1beta3` 版本，預設被啓用，在 1.29 中被棄用。
你可以通過添加以下內容來禁用 Beta 版的 `v1beta3` API 組：

<!--
```shell
kube-apiserver \
--runtime-config=flowcontrol.apiserver.k8s.io/v1beta3=false \
 # …and other flags as usual
```
-->
```shell
kube-apiserver \
--runtime-config=flowcontrol.apiserver.k8s.io/v1beta3=false \
  # ...其他配置不變
```

<!--
The command-line flag `--enable-priority-and-fairness=false` will disable the
API Priority and Fairness feature.
-->
命令列標誌 `--enable-priority-fairness=false` 將徹底禁用 APF 特性。

<!--
## Recursive server scenarios

API Priority and Fairness must be used carefully in recursive server
scenarios. These are scenarios in which some server A, while serving
a request, issues a subsidiary request to some server B. Perhaps
server B might even make a further subsidiary call back to server
A. In situations where Priority and Fairness control is applied to
both the original request and some subsidiary ones(s), no matter how
deep in the recursion, there is a danger of priority inversions and/or
deadlocks.
-->
## 遞歸伺服器場景     {#recursive-server-scenarios}

在遞歸伺服器場景中，必須謹慎使用 API 優先級和公平性。這些場景指的是伺服器 A 在處理一個請求時，
會向伺服器 B 發出一個輔助請求。伺服器 B 可能會進一步向伺服器 A 發出輔助請求。
當優先級和公平性控制同時應用於原始請求及某些輔助請求（無論遞歸多深）時，存在優先級反轉和/或死鎖的風險。

<!--
One example of recursion is when the `kube-apiserver` issues an
admission webhook call to server B, and while serving that call,
server B makes a further subsidiary request back to the
`kube-apiserver`. Another example of recursion is when an `APIService`
object directs the `kube-apiserver` to delegate requests about a
certain API group to a custom external server B (this is one of the
things called "aggregation").
-->
遞歸的一個例子是 `kube-apiserver` 向伺服器 B 發出一個准入 Webhook 調用，
而在處理該調用時，伺服器 B 進一步向 `kube-apiserver` 發出一個輔助請求。
另一個遞歸的例子是，某個 `APIService` 對象指示 `kube-apiserver`
將某個 API 組的請求委託給自定義的外部伺服器 B（這被稱爲"聚合"）。

<!--
When the original request is known to belong to a certain priority
level, and the subsidiary controlled requests are classified to higher
priority levels, this is one possible solution. When the original
requests can belong to any priority level, the subsidiary controlled
requests have to be exempt from Priority and Fairness limitation. One
way to do that is with the objects that configure classification and
handling, discussed below. Another way is to disable Priority and
Fairness on server B entirely, using the techniques discussed above. A
third way, which is the simplest to use when server B is not
`kube-apiserver`, is to build server B with Priority and Fairness
disabled in the code.
-->
當原始請求被確定爲屬於某個特定優先級別時，將輔助請求分類爲更高的優先級別是一個可行的解決方案。
當原始請求可能屬於任何優先級時，輔助受控請求必須免受優先級和公平性限制。
一種實現方法是使用下文中討論的設定分類和處理的對象。
另一種方法是採用前面提到的技術，在伺服器 B 上完全禁用優先級和公平性。第三種方法是，
當伺服器 B 不是 `kube-apiserver` 時，最簡單的做法是在伺服器 B 的代碼中禁用優先級和公平性。

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
傳入的請求通過 **FlowSchema** 按照其屬性分類，並分配優先級。
每個優先級維護自定義的併發限制，加強了隔離度，這樣不同優先級的請求，就不會相互餓死。
在同一個優先級內，公平排隊算法可以防止來自不同 **流（Flow）** 的請求相互餓死。
該算法將請求排隊，通過排隊機制，防止在平均負載較低時，通信量突增而導致請求失敗。

<!--
### Priority Levels

Without APF enabled, overall concurrency in the API server is limited by the
`kube-apiserver` flags `--max-requests-inflight` and
`--max-mutating-requests-inflight`. With APF enabled, the concurrency limits
defined by these flags are summed and then the sum is divided up among a
configurable set of _priority levels_. Each incoming request is assigned to a
single priority level, and each priority level will only dispatch as many
concurrent requests as its particular limit allows.
-->
### 優先級    {#priority-levels}

如果未啓用 APF，API 伺服器中的整體併發量將受到 `kube-apiserver` 的參數
`--max-requests-inflight` 和 `--max-mutating-requests-inflight` 的限制。
啓用 APF 後，將對這些參數定義的併發限制進行求和，然後將總和分配到一組可設定的 **優先級** 中。
每個傳入的請求都會分配一個優先級；每個優先級都有各自的限制，設定特定限制允許分發的併發請求數。

<!--
The default configuration, for example, includes separate priority levels for
leader-election requests, requests from built-in controllers, and requests from
Pods. This means that an ill-behaved Pod that floods the API server with
requests cannot prevent leader election or actions by the built-in controllers
from succeeding.
-->
例如，預設設定包括針對領導者選舉請求、內置控制器請求和 Pod 請求都單獨設置優先級。
這表示即使異常的 Pod 向 API 伺服器發送大量請求，也無法阻止領導者選舉或內置控制器的操作執行成功。

<!--
The concurrency limits of the priority levels are periodically
adjusted, allowing under-utilized priority levels to temporarily lend
concurrency to heavily-utilized levels. These limits are based on
nominal limits and bounds on how much concurrency a priority level may
lend and how much it may borrow, all derived from the configuration
objects mentioned below.
-->
優先級的併發限制會被定期調整，允許利用率較低的優先級將併發度臨時借給利用率很高的優先級。
這些限制基於一個優先級可以借出多少個併發度以及可以借用多少個併發度的額定限制和界限，
所有這些均源自下述設定對象。

<!--
### Seats Occupied by a Request

The above description of concurrency management is the baseline story.
Requests have different durations but are counted equally at any given
moment when comparing against a priority level's concurrency limit. In
the baseline story, each request occupies one unit of concurrency. The
word "seat" is used to mean one unit of concurrency, inspired by the
way each passenger on a train or aircraft takes up one of the fixed
supply of seats.

But some requests take up more than one seat. Some of these are **list**
requests that the server estimates will return a large number of
objects. These have been found to put an exceptionally heavy burden
on the server. For this reason, the server estimates the number of objects
that will be returned and considers the request to take a number of seats
that is proportional to that estimated number.
-->
### 請求佔用的席位  {#seats-occupied-by-a-request}

上述併發管理的描述是基線情況。各個請求具有不同的持續時間，
但在與一個優先級的併發限制進行比較時，這些請求在任何給定時刻都以同等方式進行計數。
在這個基線場景中，每個請求佔用一個併發單位。
我們用 “席位（Seat）” 一詞來表示一個併發單位，其靈感來自火車或飛機上每位乘客佔用一個固定座位的供應方式。

但有些請求所佔用的席位不止一個。有些請求是伺服器預估將返回大量對象的 **list** 請求。
我們發現這類請求會給伺服器帶來異常沉重的負擔。
出於這個原因，伺服器估算將返回的對象數量，並認爲請求所佔用的席位數與估算得到的數量成正比。

<!--
### Execution time tweaks for watch requests

API Priority and Fairness manages **watch** requests, but this involves a
couple more excursions from the baseline behavior. The first concerns
how long a **watch** request is considered to occupy its seat. Depending
on request parameters, the response to a **watch** request may or may not
begin with **create** notifications for all the relevant pre-existing
objects. API Priority and Fairness considers a **watch** request to be
done with its seat once that initial burst of notifications, if any,
is over.

The normal notifications are sent in a concurrent burst to all
relevant **watch** response streams whenever the server is notified of an
object create/update/delete. To account for this work, API Priority
and Fairness considers every write request to spend some additional
time occupying seats after the actual writing is done. The server
estimates the number of notifications to be sent and adjusts the write
request's number of seats and seat occupancy time to include this
extra work.
-->
### watch 請求的執行時間調整  {#execution-time-tweak-for-watch-requests}

APF 管理 **watch** 請求，但這需要考量基線行爲之外的一些情況。
第一個關注點是如何判定 **watch** 請求的席位佔用時長。
取決於請求參數不同，對 **watch** 請求的響應可能以針對所有預先存在的對象 **create** 通知開頭，也可能不這樣。
一旦最初的突發通知（如果有）結束，APF 將認爲 **watch** 請求已經用完其席位。

每當向伺服器通知創建/更新/刪除一個對象時，正常通知都會以併發突發的方式發送到所有相關的 **watch** 響應流。
爲此，APF 認爲每個寫入請求都會在實際寫入完成後花費一些額外的時間來佔用席位。
伺服器估算要發送的通知數量，並調整寫入請求的席位數以及包含這些額外工作後的席位佔用時間。

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
### 排隊    {#queuing}

即使在同一優先級內，也可能存在大量不同的流量源。
在過載情況下，防止一個請求流餓死其他流是非常有價值的
（尤其是在一個較爲常見的場景中，一個有故障的客戶端會瘋狂地向 kube-apiserver 發送請求，
理想情況下，這個有故障的客戶端不應對其他客戶端產生太大的影響）。
公平排隊算法在處理具有相同優先級的請求時，實現了上述場景。
每個請求都被分配到某個 **流（Flow）** 中，該 **流** 由對應的 FlowSchema 的名字加上一個
**流區分項（Flow Distinguisher）** 來標識。
這裏的流區分項可以是發出請求的使用者、目標資源的名字空間或什麼都不是。
系統嘗試爲不同流中具有相同優先級的請求賦予近似相等的權重。
要啓用對不同實例的不同處理方式，多實例的控制器要分別用不同的使用者名來執行身份認證。

<!--
After classifying a request into a flow, the API Priority and Fairness
feature then may assign the request to a queue. This assignment uses
a technique known as {{< glossary_tooltip term_id="shuffle-sharding"
text="shuffle sharding" >}}, which makes relatively efficient use of
queues to insulate low-intensity flows from high-intensity flows.
-->
將請求劃分到流中之後，APF 功能將請求分配到隊列中。
分配時使用一種稱爲{{< glossary_tooltip term_id="shuffle-sharding" text="混洗分片（Shuffle-Sharding）" >}}的技術。
該技術可以相對有效地利用隊列隔離低強度流與高強度流。

<!--
The details of the queuing algorithm are tunable for each priority level, and
allow administrators to trade off memory use, fairness (the property that
independent flows will all make progress when total traffic exceeds capacity),
tolerance for bursty traffic, and the added latency induced by queuing.
-->
排隊算法的細節可針對每個優先等級進行調整，並允許管理員在內存佔用、
公平性（當總流量超標時，各個獨立的流將都會取得進展）、
突發流量的容忍度以及排隊引發的額外延遲之間進行權衡。

<!--
### Exempt requests

Some requests are considered sufficiently important that they are not subject to
any of the limitations imposed by this feature. These exemptions prevent an
improperly-configured flow control configuration from totally disabling an API
server.
-->
### 豁免請求    {#exempt-requests}

某些特別重要的請求不受制於此特性施加的任何限制。
這些豁免可防止不當的流控設定完全禁用 API 伺服器。

<!--
## Resources

The flow control API involves two kinds of resources.
[PriorityLevelConfigurations](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#prioritylevelconfiguration-v1-flowcontrol-apiserver-k8s-io)
define the available priority levels, the share of the available concurrency
budget that each can handle, and allow for fine-tuning queuing behavior.
[FlowSchemas](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#flowschema-v1-flowcontrol-apiserver-k8s-io)
are used to classify individual inbound requests, matching each to a
single PriorityLevelConfiguration.
-->
## 資源    {#resources}

流控 API 涉及兩種資源。
[PriorityLevelConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#prioritylevelconfiguration-v1-flowcontrol-apiserver-k8s-io)
定義可用的優先級和可處理的併發預算量，還可以微調排隊行爲。
[FlowSchema](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#flowschema-v1-flowcontrol-apiserver-k8s-io)
用於對每個入站請求進行分類，並與一個 PriorityLevelConfiguration 相匹配。

<!--
### PriorityLevelConfiguration

A PriorityLevelConfiguration represents a single priority level. Each
PriorityLevelConfiguration has an independent limit on the number of outstanding
requests, and limitations on the number of queued requests.
-->
### PriorityLevelConfiguration

一個 PriorityLevelConfiguration 表示單個優先級。每個 PriorityLevelConfiguration
對未完成的請求數有各自的限制，對排隊中的請求數也有限制。

<!--
The nominal concurrency limit for a PriorityLevelConfiguration is not
specified in an absolute number of seats, but rather in "nominal
concurrency shares." The total concurrency limit for the API Server is
distributed among the existing PriorityLevelConfigurations in
proportion to these shares, to give each level its nominal limit in
terms of seats. This allows a cluster administrator to scale up or
down the total amount of traffic to a server by restarting
`kube-apiserver` with a different value for `--max-requests-inflight`
(or `--max-mutating-requests-inflight`), and all
PriorityLevelConfigurations will see their maximum allowed concurrency
go up (or down) by the same fraction.
-->
PriorityLevelConfiguration 的額定併發限制不是指定請求絕對數量，而是以“額定併發份額”的形式指定。
API 伺服器的總併發量限制通過這些份額按例分配到現有 PriorityLevelConfiguration 中，
爲每個級別按照數量賦予其額定限制。
叢集管理員可以更改 `--max-requests-inflight` （或 `--max-mutating-requests-inflight`）的值，
再重新啓動 `kube-apiserver` 來增加或減小伺服器的總流量，
然後所有的 PriorityLevelConfiguration 將看到其最大併發增加（或減少）了相同的比例。

{{< caution >}}
<!--
In the versions before `v1beta3` the relevant
PriorityLevelConfiguration field is named "assured concurrency shares"
rather than "nominal concurrency shares". Also, in Kubernetes release
1.25 and earlier there were no periodic adjustments: the
nominal/assured limits were always applied without adjustment.
-->
在 `v1beta3` 之前的版本中，相關的 PriorityLevelConfiguration
字段被命名爲“保證併發份額”而不是“額定併發份額”。此外在 Kubernetes v1.25
及更早的版本中，不存在定期的調整：所實施的始終是額定/保證的限制，不存在調整。
{{< /caution >}}

<!--
The bounds on how much concurrency a priority level may lend and how
much it may borrow are expressed in the PriorityLevelConfiguration as
percentages of the level's nominal limit. These are resolved to
absolute numbers of seats by multiplying with the nominal limit /
100.0 and rounding. The dynamically adjusted concurrency limit of a
priority level is constrained to lie between (a) a lower bound of its
nominal limit minus its lendable seats and (b) an upper bound of its
nominal limit plus the seats it may borrow. At each adjustment the
dynamic limits are derived by each priority level reclaiming any lent
seats for which demand recently appeared and then jointly fairly
responding to the recent seat demand on the priority levels, within
the bounds just described.
-->
一個優先級可以借出的併發數界限以及可以借用的併發數界限在
PriorityLevelConfiguration 表現該優先級的額定限制。
這些界限值乘以額定限制/100.0 並取整，被解析爲絕對席位數量。
某優先級的動態調整併發限制範圍被約束在
(a) 其額定限制的下限值減去其可借出的席位和
(b) 其額定限制的上限值加上它可以借用的席位之間。
在每次調整時，通過每個優先級推導得出動態限制，具體過程爲回收最近出現需求的所有借出的席位，
然後在剛剛描述的界限內共同公平地響應有關這些優先級最近的席位需求。

{{< caution >}}
<!--
With the Priority and Fairness feature enabled, the total concurrency limit for
the server is set to the sum of `--max-requests-inflight` and
`--max-mutating-requests-inflight`. There is no longer any distinction made
between mutating and non-mutating requests; if you want to treat them
separately for a given resource, make separate FlowSchemas that match the
mutating and non-mutating verbs respectively.
-->
啓用 APF 特性時，伺服器的總併發限制被設置爲 `--max-requests-inflight` 及
`--max-mutating-requests-inflight` 之和。變更性和非變更性請求之間不再有任何不同；
如果你想針對某給定資源分別進行處理，請製作單獨的 FlowSchema，分別匹配變更性和非變更性的動作。
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
當入站請求的數量大於分配的 PriorityLevelConfiguration 中允許的併發級別時，
`type` 字段將確定對額外請求的處理方式。
`Reject` 類型，表示多餘的流量將立即被 HTTP 429（請求過多）錯誤所拒絕。
`Queue` 類型，表示對超過閾值的請求進行排隊，將使用閾值分片和公平排隊技術來平衡請求流之間的進度。

<!--
The queuing configuration allows tuning the fair queuing algorithm for a
priority level. Details of the algorithm can be read in the
[enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness), but in short:
-->
公平排隊算法支持通過排隊設定對優先級微調。
可以在[增強建議](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness)中閱讀算法的詳細資訊，
但總之：

<!--
* Increasing `queues` reduces the rate of collisions between different flows, at
  the cost of increased memory usage. A value of 1 here effectively disables the
  fair-queuing logic, but still allows requests to be queued.
-->
* `queues` 遞增能減少不同流之間的衝突概率，但代價是增加了內存使用量。
  值爲 1 時，會禁用公平排隊邏輯，但仍允許請求排隊。

<!--
* Increasing `queueLengthLimit` allows larger bursts of traffic to be
  sustained without dropping any requests, at the cost of increased
  latency and memory usage.
-->
* `queueLengthLimit` 遞增可以在不丟棄任何請求的情況下支撐更大的突發流量，
  但代價是增加了等待時間和內存使用量。

<!--
* Changing `handSize` allows you to adjust the probability of collisions between
  different flows and the overall concurrency available to a single flow in an
  overload situation.
-->
* 修改 `handSize` 允許你調整過載情況下不同流之間的衝突概率以及單個流可用的整體併發性。

  {{< note >}}
  <!--
  A larger `handSize` makes it less likely for two individual flows to collide
  (and therefore for one to be able to starve the other), but more likely that
  a small number of flows can dominate the apiserver. A larger `handSize` also
  potentially increases the amount of latency that a single high-traffic flow
  can cause. The maximum number of queued requests possible from a
  single flow is `handSize * queueLengthLimit`.
  -->
  較大的 `handSize` 使兩個單獨的流程發生碰撞的可能性較小（因此，一個流可以餓死另一個流），
  但是更有可能的是少數流可以控制 apiserver。
  較大的 `handSize` 還可能增加單個高併發流的延遲量。
  單個流中可能排隊的請求的最大數量爲 `handSize * queueLengthLimit`。
  {{< /note >}}

<!--
Following is a table showing an interesting collection of shuffle
sharding configurations, showing for each the probability that a
given mouse (low-intensity flow) is squished by the elephants (high-intensity flows) for
an illustrative collection of numbers of elephants. See
https://play.golang.org/p/Gi0PLgVHiUg , which computes this table.
-->
下表顯示了有趣的隨機分片設定集合，每行顯示給定的老鼠（低強度流）
被不同數量的大象擠壓（高強度流）的概率。
表來源請參閱： https://play.golang.org/p/Gi0PLgVHiUg

{{< table caption = "混分切片設定示例" >}}
<!-- HandSize | Queues | 1 elephant | 4 elephants | 16 elephants -->
隨機分片 | 隊列數 | 1 頭大象 | 4 頭大象 | 16 頭大象
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

<!--
### FlowSchema

A FlowSchema matches some inbound requests and assigns them to a
priority level. Every inbound request is tested against FlowSchemas,
starting with those with the numerically lowest `matchingPrecedence` and
working upward. The first match wins.
-->
### FlowSchema

FlowSchema 匹配一些入站請求，並將它們分配給優先級。
每個入站請求都會對 FlowSchema 測試是否匹配，
首先從 `matchingPrecedence` 數值最低的匹配開始，
然後依次進行，直到首個匹配出現。

{{< caution >}}
<!--
Only the first matching FlowSchema for a given request matters. If multiple
FlowSchemas match a single inbound request, it will be assigned based on the one
with the highest `matchingPrecedence`. If multiple FlowSchemas with equal
`matchingPrecedence` match the same request, the one with lexicographically
smaller `name` will win, but it's better not to rely on this, and instead to
ensure that no two FlowSchemas have the same `matchingPrecedence`.
-->
對一個請求來說，只有首個匹配的 FlowSchema 纔有意義。
如果一個入站請求與多個 FlowSchema 匹配，則將基於邏輯上最高優先級 `matchingPrecedence` 的請求進行篩選。
如果一個請求匹配多個 FlowSchema 且 `matchingPrecedence` 的值相同，則按 `name` 的字典序選擇最小，
但是最好不要依賴它，而是確保不存在兩個 FlowSchema 具有相同的 `matchingPrecedence` 值。
{{< /caution >}}

<!--
A FlowSchema matches a given request if at least one of its `rules`
matches. A rule matches if at least one of its `subjects` *and* at least
one of its `resourceRules` or `nonResourceRules` (depending on whether the
incoming request is for a resource or non-resource URL) match the request.
-->
當給定的請求與某個 FlowSchema 的 `rules` 的其中一條匹配，那麼就認爲該請求與該 FlowSchema 匹配。
判斷規則與該請求是否匹配，**不僅**要求該條規則的 `subjects` 字段至少存在一個與該請求相匹配，
**而且**要求該條規則的 `resourceRules` 或 `nonResourceRules`
（取決於傳入請求是針對資源 URL 還是非資源 URL）字段至少存在一個與該請求相匹配。

<!--
For the `name` field in subjects, and the `verbs`, `apiGroups`, `resources`,
`namespaces`, and `nonResourceURLs` fields of resource and non-resource rules,
the wildcard `*` may be specified to match all values for the given field,
effectively removing it from consideration.
-->
對於 `subjects` 中的 `name` 字段和資源和非資源規則的
`verbs`、`apiGroups`、`resources`、`namespaces` 和 `nonResourceURLs` 字段，
可以指定通配符 `*` 來匹配任意值，從而有效地忽略該字段。

<!--
A FlowSchema's `distinguisherMethod.type` determines how requests matching that
schema will be separated into flows. It may be `ByUser`, in which one requesting
user will not be able to starve other users of capacity; `ByNamespace`, in which
requests for resources in one namespace will not be able to starve requests for
resources in other namespaces of capacity; or blank (or `distinguisherMethod` may be
omitted entirely), in which all requests matched by this FlowSchema will be
considered part of a single flow. The correct choice for a given FlowSchema
depends on the resource and your particular environment.
-->
FlowSchema 的 `distinguisherMethod.type` 字段決定了如何把與該模式匹配的請求分散到各個流中。
可能是 `ByUser`，在這種情況下，一個請求使用者將無法餓死其他容量的使用者；
或者是 `ByNamespace`，在這種情況下，一個名字空間中的資源請求將無法餓死其它名字空間的資源請求；
或者爲空（或者可以完全省略 `distinguisherMethod`），
在這種情況下，與此 FlowSchema 匹配的請求將被視爲單個流的一部分。
資源和你的特定環境決定了如何選擇正確一個 FlowSchema。

<!--
## Defaults

Each kube-apiserver maintains two sorts of APF configuration objects:
mandatory and suggested.
-->
## 預設值    {#defaults}

每個 kube-apiserver 會維護兩種類型的 APF 設定對象：強制的（Mandatory）和建議的（Suggested）。

<!--
### Mandatory Configuration Objects

The four mandatory configuration objects reflect fixed built-in
guardrail behavior. This is behavior that the servers have before
those objects exist, and when those objects exist their specs reflect
this behavior. The four mandatory objects are as follows.
-->
### 強制的設定對象   {#mandatory-configuration-objects}

有四種強制的設定對象對應內置的守護行爲。這裏的行爲是伺服器在還未創建對象之前就具備的行爲，
而當這些對象存在時，其規約反映了這類行爲。四種強制的對象如下：

<!--
* The mandatory `exempt` priority level is used for requests that are
  not subject to flow control at all: they will always be dispatched
  immediately. The mandatory `exempt` FlowSchema classifies all
  requests from the `system:masters` group into this priority
  level. You may define other FlowSchemas that direct other requests
  to this priority level, if appropriate.
-->
* 強制的 `exempt` 優先級用於完全不受流控限制的請求：它們總是立刻被分發。
  強制的 `exempt` FlowSchema 把 `system:masters` 組的所有請求都歸入該優先級。
  如果合適，你可以定義新的 FlowSchema，將其他請求定向到該優先級。

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
* 強制的 `catch-all` 優先級與強制的 `catch-all` FlowSchema 結合使用，
  以確保每個請求都分類。一般而言，你不應該依賴於 `catch-all` 的設定，
  而應適當地創建自己的 `catch-all` FlowSchema 和 PriorityLevelConfiguration
  （或使用預設安裝的 `global-default` 設定）。
  因爲這一優先級不是正常場景下要使用的，`catch-all` 優先級的併發度份額很小，
  並且不會對請求進行排隊。

<!--
### Suggested Configuration Objects

The suggested FlowSchemas and PriorityLevelConfigurations constitute a
reasonable default configuration. You can modify these and/or create
additional configuration objects if you want. If your cluster is
likely to experience heavy load then you should consider what
configuration will work best.

The suggested configuration groups requests into six priority levels:
-->
### 建議的設定對象   {#suggested-configuration-objects}

建議的 FlowSchema 和 PriorityLevelConfiguration 包含合理的預設設定。
你可以修改這些對象或者根據需要創建新的設定對象。如果你的叢集可能承受較重負載，
那麼你就要考慮哪種設定最合適。

建議的設定把請求分爲六個優先級：

<!--
* The `node-high` priority level is for health updates from nodes.
-->
* `node-high` 優先級用於來自節點的健康狀態更新。

<!--
* The `system` priority level is for non-health requests from the
  `system:nodes` group, i.e. Kubelets, which must be able to contact
  the API server in order for workloads to be able to schedule on
  them.
-->
* `system` 優先級用於 `system:nodes` 組（即 kubelet）的與健康狀態更新無關的請求；
  kubelet 必須能連上 API 伺服器，以便工作負載能夠調度到其上。

<!--
* The `leader-election` priority level is for leader election requests from
  built-in controllers (in particular, requests for `endpoints`, `configmaps`,
  or `leases` coming from the `system:kube-controller-manager` or
  `system:kube-scheduler` users and service accounts in the `kube-system`
  namespace). These are important to isolate from other traffic because failures
  in leader election cause their controllers to fail and restart, which in turn
  causes more expensive traffic as the new controllers sync their informers.
-->
* `leader-election` 優先級用於內置控制器的領導選舉的請求
  （特別是來自 `kube-system` 名字空間中 `system:kube-controller-manager` 和
  `system:kube-scheduler` 使用者和服務賬號，針對 `endpoints`、`configmaps` 或 `leases` 的請求）。
  將這些請求與其他流量相隔離非常重要，因爲領導者選舉失敗會導致控制器發生故障並重新啓動，
  這反過來會導致新啓動的控制器在同步資訊時，流量開銷更大。

<!--
* The `workload-high` priority level is for other requests from built-in
  controllers.

* The `workload-low` priority level is for requests from any other service
  account, which will typically include all requests from controllers running in
  Pods.

* The `global-default` priority level handles all other traffic, e.g.
  interactive `kubectl` commands run by nonprivileged users.
-->
* `workload-high` 優先級用於內置控制器的其他請求。
* `workload-low` 優先級用於來自所有其他服務帳戶的請求，通常包括來自 Pod
  中運行的控制器的所有請求。
* `global-default` 優先級可處理所有其他流量，例如：非特權使用者運行的交互式
  `kubectl` 命令。

<!--
The suggested FlowSchemas serve to steer requests into the above
priority levels, and are not enumerated here.
-->
建議的 FlowSchema 用來將請求導向上述的優先級內，這裏不再一一列舉。

<!--
### Maintenance of the Mandatory and Suggested Configuration Objects

Each `kube-apiserver` independently maintains the mandatory and
suggested configuration objects, using initial and periodic behavior.
Thus, in a situation with a mixture of servers of different versions
there may be thrashing as long as different servers have different
opinions of the proper content of these objects.
-->
### 強制的與建議的設定對象的維護   {#maintenance-of-the-mandatory-and-suggested-configuration-objects}

每個 `kube-apiserver` 都獨立地維護其強制的與建議的設定對象，
這一維護操作既是伺服器的初始行爲，也是其週期性操作的一部分。
因此，當存在不同版本的伺服器時，如果各個伺服器對於設定對象中的合適內容有不同意見，
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
每個 `kube-apiserver` 都會對強制的與建議的設定對象執行初始的維護操作，
之後（每分鐘）對這些對象執行週期性的維護。

對於強制的設定對象，維護操作包括確保對象存在並且包含合適的規約（如果存在的話）。
伺服器會拒絕創建或更新與其守護行爲不一致的規約。

<!--
Maintenance of suggested configuration objects is designed to allow
their specs to be overridden. Deletion, on the other hand, is not
respected: maintenance will restore the object. If you do not want a
suggested configuration object then you need to keep it around but set
its spec to have minimal consequences. Maintenance of suggested
objects is also designed to support automatic migration when a new
version of the `kube-apiserver` is rolled out, albeit potentially with
thrashing while there is a mixed population of servers.
-->
對建議的設定對象的維護操作被設計爲允許其規約被重載。刪除操作是不允許的，
維護操作期間會重建這類設定對象。如果你不需要某個建議的設定對象，
你需要將它放在一邊，並讓其規約所產生的影響最小化。
對建議的設定對象而言，其維護方面的設計也支持在上線新的 `kube-apiserver`
時完成自動的遷移動作，即便可能因爲當前的伺服器集合存在不同的版本而可能造成抖動仍是如此。

<!--
Maintenance of a suggested configuration object consists of creating
it --- with the server's suggested spec --- if the object does not
exist. OTOH, if the object already exists, maintenance behavior
depends on whether the `kube-apiservers` or the users control the
object. In the former case, the server ensures that the object's spec
is what the server suggests; in the latter case, the spec is left
alone.
-->
對建議的設定對象的維護操作包括基於伺服器建議的規約創建對象
（如果對象不存在的話）。反之，如果對象已經存在，維護操作的行爲取決於是否
`kube-apiserver` 或者使用者在控制對象。如果 `kube-apiserver` 在控制對象，
則伺服器確保對象的規約與伺服器所給的建議匹配，如果使用者在控制對象，
對象的規約保持不變。

<!--
The question of who controls the object is answered by first looking
for an annotation with key `apf.kubernetes.io/autoupdate-spec`. If
there is such an annotation and its value is `true` then the
kube-apiservers control the object. If there is such an annotation
and its value is `false` then the users control the object. If
neither of those conditions holds then the `metadata.generation` of the
object is consulted. If that is 1 then the kube-apiservers control
the object. Otherwise the users control the object. These rules were
introduced in release 1.22 and their consideration of
`metadata.generation` is for the sake of migration from the simpler
earlier behavior. Users who wish to control a suggested configuration
object should set its `apf.kubernetes.io/autoupdate-spec` annotation
to `false`.
-->
關於誰在控制對象這個問題，首先要看對象上的 `apf.kubernetes.io/autoupdate-spec`
註解。如果對象上存在這個註解，並且其取值爲`true`，則 kube-apiserver
在控制該對象。如果存在這個註解，並且其取值爲`false`，則使用者在控制對象。
如果這兩個條件都不滿足，則需要進一步查看對象的 `metadata.generation`。
如果該值爲 1，則 kube-apiserver 控制對象，否則使用者控制對象。
這些規則是在 1.22 發行版中引入的，而對 `metadata.generation`
的考量是爲了便於從之前較簡單的行爲遷移過來。希望控制建議的設定對象的使用者應該將對象的
`apf.kubernetes.io/autoupdate-spec` 註解設置爲 `false`。

<!--
Maintenance of a mandatory or suggested configuration object also
includes ensuring that it has an `apf.kubernetes.io/autoupdate-spec`
annotation that accurately reflects whether the kube-apiservers
control the object.

Maintenance also includes deleting objects that are neither mandatory
nor suggested but are annotated
`apf.kubernetes.io/autoupdate-spec=true`.
-->
對強制的或建議的設定對象的維護操作也包括確保對象上存在 `apf.kubernetes.io/autoupdate-spec`
這一註解，並且其取值準確地反映了是否 kube-apiserver 在控制着對象。

維護操作還包括刪除那些既非強制又非建議的設定，同時註解設定爲
`apf.kubernetes.io/autoupdate-spec=true` 的對象。

<!--
## Health check concurrency exemption

The suggested configuration gives no special treatment to the health
check requests on kube-apiservers from their local kubelets --- which
tend to use the secured port but supply no credentials. With the
suggested config, these requests get assigned to the `global-default`
FlowSchema and the corresponding `global-default` priority level,
where other traffic can crowd them out.
-->
## 健康檢查併發豁免    {#health-check-concurrency-exemption}

推薦設定沒有爲本地 kubelet 對 kube-apiserver 執行健康檢查的請求進行任何特殊處理
——它們傾向於使用安全端口，但不提供憑據。
在推薦設定中，這些請求將分配 `global-default` FlowSchema 和 `global-default` 優先級，
這樣其他流量可以排除健康檢查。

<!--
If you add the following additional FlowSchema, this exempts those
requests from rate limiting.
-->
如果添加以下 FlowSchema，健康檢查請求不受速率限制。

{{< caution >}}
<!--
Making this change also allows any hostile party to then send
health-check requests that match this FlowSchema, at any volume they
like. If you have a web traffic filter or similar external security
mechanism to protect your cluster's API server from general internet
traffic, you can configure rules to block any health check requests
that originate from outside your cluster.
-->
進行此更改後，任何敵對方都可以發送與此 FlowSchema 匹配的任意數量的健康檢查請求。
如果你有 Web 流量過濾器或類似的外部安全機制保護叢集的 API 伺服器免受常規網路流量的侵擾，
則可以設定規則，阻止所有來自叢集外部的健康檢查請求。
{{< /caution >}}

{{% code_sample file="priority-and-fairness/health-for-strangers.yaml" %}}

<!--
## Observability

### Metrics
-->
## 可觀察性    {#observability}

### 指標    {#metrics}

{{< note >}}
<!--
In versions of Kubernetes before v1.20, the labels `flow_schema` and
`priority_level` were inconsistently named `flowSchema` and `priorityLevel`,
respectively. If you're running Kubernetes versions v1.19 and earlier, you
should refer to the documentation for your version.
-->
在 Kubernetes v1.20 之前的版本中，標籤 `flow_schema` 和 `priority_level`
的名稱有時被寫作 `flowSchema` 和 `priorityLevel`，即存在不一致的情況。
如果你在運行 Kubernetes v1.19 或者更早版本，你需要參考你所使用的叢集版本對應的文檔。
{{< /note >}}

<!--
When you enable the API Priority and Fairness feature, the kube-apiserver
exports additional metrics. Monitoring these can help you determine whether your
configuration is inappropriately throttling important traffic, or find
poorly-behaved workloads that may be harming system health.
-->
當你開啓了 APF 後，kube-apiserver 會暴露額外指標。
監視這些指標有助於判斷你的設定是否不當地限制了重要流量，
或者發現可能會損害系統健康的，行爲不良的工作負載。

<!--
#### Maturity level BETA
-->
#### 成熟度水平 BETA

<!--
* `apiserver_flowcontrol_rejected_requests_total` is a counter vector
  (cumulative since server start) of requests that were rejected,
  broken down by the labels `flow_schema` (indicating the one that
  matched the request), `priority_level` (indicating the one to which
  the request was assigned), and `reason`. The `reason` label will be
  one of the following values:
-->
* `apiserver_flowcontrol_rejected_requests_total` 是一個計數器向量，
  記錄被拒絕的請求數量（自伺服器啓動以來累計值），
  可按標籤 `flow_chema`（表示與請求匹配的 FlowSchema）、`priority_level`
  （表示分配給請該求的優先級）和 `reason` 分解。
  `reason` 標籤將是以下值之一：

  <!--
  * `queue-full`, indicating that too many requests were already
    queued.
  * `concurrency-limit`, indicating that the
    PriorityLevelConfiguration is configured to reject rather than
    queue excess requests.
  * `time-out`, indicating that the request was still in the queue
    when its queuing time limit expired.
  * `cancelled`, indicating that the request is not purge locked
    and has been ejected from the queue.
  -->
  * `queue-full`，表明已經有太多請求排隊
  * `concurrency-limit`，表示將 PriorityLevelConfiguration 設定爲
    `Reject` 而不是 `Queue`，或者
  * `time-out`，表示在其排隊時間超期的請求仍在隊列中。
  * `cancelled`，表示該請求未被清除鎖定，已從隊列中移除。

<!--
* `apiserver_flowcontrol_dispatched_requests_total` is a counter
  vector (cumulative since server start) of requests that began
  executing, broken down by `flow_schema` and `priority_level`.
-->
* `apiserver_flowcontrol_dispatched_requests_total` 是一個計數器向量，
  記錄開始執行的請求數量（自伺服器啓動以來的累積值），
  可按 `flow_schema` 和 `priority_level` 分解。

<!--
* `apiserver_flowcontrol_current_inqueue_requests` is a gauge vector
  holding the instantaneous number of queued (not executing) requests,
  broken down by `priority_level` and `flow_schema`.

* `apiserver_flowcontrol_current_executing_requests` is a gauge vector
  holding the instantaneous number of executing (not waiting in a
  queue) requests, broken down by `priority_level` and `flow_schema`.
-->
* `apiserver_flowcontrol_current_inqueue_requests` 是一個測量向量，
  記錄排隊中的（未執行）請求的瞬時數量，可按 `priority_level` 和 `flow_schema` 分解。

* `apiserver_flowcontrol_current_executing_requests` 是一個測量向量，
  記錄執行中（不在隊列中等待）請求的瞬時數量，可按 `priority_level` 和 `flow_schema` 分解。

<!--
* `apiserver_flowcontrol_current_executing_seats` is a gauge vector
  holding the instantaneous number of occupied seats, broken down by
  `priority_level` and `flow_schema`.

* `apiserver_flowcontrol_request_wait_duration_seconds` is a histogram
  vector of how long requests spent queued, broken down by the labels
  `flow_schema`, `priority_level`, and `execute`. The `execute` label
  indicates whether the request has started executing.
-->
* `apiserver_flowcontrol_current_executing_seats` 是一個測量向量，
  記錄了按 `priority_level` 和 `flow_schema` 細分的瞬時佔用席位數量。

* `apiserver_flowcontrol_request_wait_duration_seconds` 是一個直方圖向量，
  記錄了按 `flow_schema`、`priority_level` 和 `execute` 標籤細分的請求在隊列中等待的時長。
  `execute` 標籤表示請求是否已開始執行。

  {{< note >}}
  <!--
  Since each FlowSchema always assigns requests to a single
  PriorityLevelConfiguration, you can add the histograms for all the
  FlowSchemas for one priority level to get the effective histogram for
  requests assigned to that priority level.
  -->
  由於每個 FlowSchema 總會給請求分配 PriorityLevelConfiguration，
  因此你可以將一個優先級的所有 FlowSchema 的直方圖相加，以得到分配給該優先級的請求的有效直方圖。
  {{< /note >}}

<!--
* `apiserver_flowcontrol_nominal_limit_seats` is a gauge vector
  holding each priority level's nominal concurrency limit, computed
  from the API server's total concurrency limit and the priority
  level's configured nominal concurrency shares.
-->
* `apiserver_flowcontrol_nominal_limit_seats` 是一個測量向量，
  記錄了每個優先級的額定併發限制。
  此值是根據 API 伺服器的總併發限制和優先級的設定額定併發份額計算得出的。

<!--
#### Maturity level ALPHA
-->
#### 成熟度水平 ALPHA

<!--
* `apiserver_current_inqueue_requests` is a gauge vector of recent
  high water marks of the number of queued requests, grouped by a
  label named `request_kind` whose value is `mutating` or `readOnly`.
  These high water marks describe the largest number seen in the one
  second window most recently completed. These complement the older
  `apiserver_current_inflight_requests` gauge vector that holds the
  last window's high water mark of number of requests actively being
  served.
-->
* `apiserver_current_inqueue_requests` 是一個測量向量，
  記錄最近排隊請求數量的高水位線，
  由標籤 `request_kind` 分組，標籤的值爲 `mutating` 或 `readOnly`。
  這些高水位線表示在最近一秒鐘內看到的最大數字。
  它們補充說明了老的測量向量 `apiserver_current_inflight_requests`
  （該量保存了最後一個窗口中，正在處理的請求數量的高水位線）。

<!--
* `apiserver_current_inqueue_seats` is a gauge vector of the sum over
  queued requests of the largest number of seats each will occupy,
  grouped by labels named `flow_schema` and `priority_level`.
-->
* `apiserver_current_inqueue_seats` 是一個測量向量，
  記錄了排隊請求中每個請求將佔用的最大席位數的總和，
  按 `flow_schema` 和 `priority_level` 兩個標籤進行分組。

<!--
* `apiserver_flowcontrol_read_vs_write_current_requests` is a
  histogram vector of observations, made at the end of every
  nanosecond, of the number of requests broken down by the labels
  `phase` (which takes on the values `waiting` and `executing`) and
  `request_kind` (which takes on the values `mutating` and
  `readOnly`). Each observed value is a ratio, between 0 and 1, of
  the number of requests divided by the corresponding limit on the
  number of requests (queue volume limit for waiting and concurrency
  limit for executing).
-->
* `apiserver_flowcontrol_read_vs_write_current_requests` 是一個直方圖向量，
  在每個納秒結束時記錄請求數量的觀察值，可按標籤 `phase`（取值爲 `waiting` 及 `executing`）
  和 `request_kind`（取值爲 `mutating` 及 `readOnly`）分解。
  每個觀察到的值是一個介於 0 和 1 之間的比值，計算方式爲請求數除以該請求數的對應限制
  （等待的隊列長度限制和執行所用的併發限制）。

<!-- 
* `apiserver_flowcontrol_request_concurrency_in_use` is a gauge vector
  holding the instantaneous number of occupied seats, broken down by
  `priority_level` and `flow_schema`.
-->
* `apiserver_flowcontrol_request_concurrency_in_use` 是一個規範向量，
  包含佔用席位的瞬時數量，可按 `priority_level` 和 `flow_schema` 分解。

<!--
* `apiserver_flowcontrol_priority_level_request_utilization` is a
  histogram vector of observations, made at the end of each
  nanosecond, of the number of requests broken down by the labels
  `phase` (which takes on the values `waiting` and `executing`) and
  `priority_level`. Each observed value is a ratio, between 0 and 1,
  of a number of requests divided by the corresponding limit on the
  number of requests (queue volume limit for waiting and concurrency
  limit for executing).
-->
* `apiserver_flowcontrol_priority_level_request_utilization` 是一個直方圖向量，
  在每個納秒結束時記錄請求數量的觀察值，
  可按標籤 `phase`（取值爲 `waiting` 及 `executing`）和 `priority_level` 分解。
  每個觀察到的值是一個介於 0 和 1 之間的比值，計算方式爲請求數除以該請求數的對應限制
  （等待的隊列長度限制和執行所用的併發限制）。

<!--
* `apiserver_flowcontrol_priority_level_seat_utilization` is a
  histogram vector of observations, made at the end of each
  nanosecond, of the utilization of a priority level's concurrency
  limit, broken down by `priority_level`. This utilization is the
  fraction (number of seats occupied) / (concurrency limit). This
  metric considers all stages of execution (both normal and the extra
  delay at the end of a write to cover for the corresponding
  notification work) of all requests except WATCHes; for those it
  considers only the initial stage that delivers notifications of
  pre-existing objects. Each histogram in the vector is also labeled
  with `phase: executing` (there is no seat limit for the waiting
  phase).
-->
* `apiserver_flowcontrol_priority_level_seat_utilization` 是一個直方圖向量，
  在每個納秒結束時記錄某個優先級併發度限制利用率的觀察值，可按標籤 `priority_level` 分解。
  此利用率是一個分數：（佔用的席位數）/（併發限制）。
  此指標考慮了除 WATCH 之外的所有請求的所有執行階段（包括寫入結束時的正常延遲和額外延遲，
  以覆蓋相應的通知操作）；對於 WATCH 請求，只考慮傳遞預先存在對象通知的初始階段。
  該向量中的每個直方圖也帶有 `phase: executing`（等待階段沒有席位限制）的標籤。

<!--
* `apiserver_flowcontrol_request_queue_length_after_enqueue` is a
  histogram vector of queue lengths for the queues, broken down by
  `priority_level` and `flow_schema`, as sampled by the enqueued requests.
  Each request that gets queued contributes one sample to its histogram,
  reporting the length of the queue immediately after the request was added.
  Note that this produces different statistics than an unbiased survey would.
-->
* `apiserver_flowcontrol_request_queue_length_after_enqueue` 是一個直方圖向量，
  記錄請求隊列的長度，可按 `priority_level` 和 `flow_schema` 分解。
  每個排隊中的請求都會爲其直方圖貢獻一個樣本，並在添加請求後立即上報隊列的長度。
  請注意，這樣產生的統計資料與無偏調查不同。

  {{< note >}}
  <!--
  An outlier value in a histogram here means it is likely that a single flow
  (i.e., requests by one user or for one namespace, depending on
  configuration) is flooding the API server, and being throttled. By contrast,
  if one priority level's histogram shows that all queues for that priority
  level are longer than those for other priority levels, it may be appropriate
  to increase that PriorityLevelConfiguration's concurrency shares.
  -->
  直方圖中的離羣值在這裏表示單個流（即，一個使用者或一個名字空間的請求，
  具體取決於設定）正在瘋狂地向 API 伺服器發請求，並受到限制。
  相反，如果一個優先級的直方圖顯示該優先級的所有隊列都比其他優先級的隊列長，
  則增加 PriorityLevelConfiguration 的併發份額是比較合適的。
  {{< /note >}}

<!--
* `apiserver_flowcontrol_request_concurrency_limit` is the same as
  `apiserver_flowcontrol_nominal_limit_seats`. Before the
  introduction of concurrency borrowing between priority levels,
  this was always equal to `apiserver_flowcontrol_current_limit_seats`
  (which did not exist as a distinct metric).
-->
* `apiserver_flowcontrol_request_concurrency_limit` 與
  `apiserver_flowcontrol_nominal_limit_seats` 相同。在優先級之間引入併發度借用之前，
  此字段始終等於 `apiserver_flowcontrol_current_limit_seats`
  （它過去不作爲一個獨立的指標存在）。

<!--
* `apiserver_flowcontrol_lower_limit_seats` is a gauge vector holding
  the lower bound on each priority level's dynamic concurrency limit.
-->
* `apiserver_flowcontrol_lower_limit_seats` 是一個測量向量，包含每個優先級的動態併發度限制的下限。

<!--
* `apiserver_flowcontrol_upper_limit_seats` is a gauge vector holding
  the upper bound on each priority level's dynamic concurrency limit.
-->
* `apiserver_flowcontrol_upper_limit_seats` 是一個測量向量，包含每個優先級的動態併發度限制的上限。

<!--
* `apiserver_flowcontrol_demand_seats` is a histogram vector counting
  observations, at the end of every nanosecond, of each priority
  level's ratio of (seat demand) / (nominal concurrency limit). 
  A priority level's seat demand is the sum, over both queued requests
  and those in the initial phase of execution, of the maximum of the
  number of seats occupied in the request's initial and final
  execution phases.
-->
* `apiserver_flowcontrol_demand_seats` 是一個直方圖向量，
  統計每納秒結束時每個優先級的（席位需求）/（額定併發限制）比率的觀察值。
  某優先級的席位需求是針對排隊的請求和初始執行階段的請求，在請求的初始和最終執行階段佔用的最大席位數之和。

<!--
* `apiserver_flowcontrol_demand_seats_high_watermark` is a gauge vector
  holding, for each priority level, the maximum seat demand seen
  during the last concurrency borrowing adjustment period.
-->
* `apiserver_flowcontrol_demand_seats_high_watermark` 是一個測量向量，
  爲每個優先級包含了上一個併發度借用調整期間所觀察到的最大席位需求。

<!--
* `apiserver_flowcontrol_demand_seats_average` is a gauge vector
  holding, for each priority level, the time-weighted average seat
  demand seen during the last concurrency borrowing adjustment period.
-->
* `apiserver_flowcontrol_demand_seats_average` 是一個測量向量，
  爲每個優先級包含了上一個併發度借用調整期間所觀察到的時間加權平均席位需求。

<!--
* `apiserver_flowcontrol_demand_seats_stdev` is a gauge vector
  holding, for each priority level, the time-weighted population
  standard deviation of seat demand seen during the last concurrency
  borrowing adjustment period.
-->
* `apiserver_flowcontrol_demand_seats_stdev` 是一個測量向量，
  爲每個優先級包含了上一個併發度借用調整期間所觀察到的席位需求的時間加權總標準偏差。

<!--
* `apiserver_flowcontrol_demand_seats_smoothed` is a gauge vector
  holding, for each priority level, the smoothed enveloped seat demand
  determined at the last concurrency adjustment.
-->
* `apiserver_flowcontrol_demand_seats_smoothed` 是一個測量向量，
  爲每個優先級包含了上一個併發度調整期間確定的平滑包絡席位需求。

<!--
* `apiserver_flowcontrol_target_seats` is a gauge vector holding, for
  each priority level, the concurrency target going into the borrowing
  allocation problem.
-->
* `apiserver_flowcontrol_target_seats` 是一個測量向量，
  包含每個優先級觸發借用分配問題的併發度目標值。

<!--
* `apiserver_flowcontrol_seat_fair_frac` is a gauge holding the fair
  allocation fraction determined in the last borrowing adjustment.
-->
* `apiserver_flowcontrol_seat_fair_frac` 是一個測量向量，
  包含了上一個借用調整期間確定的公平分配比例。

<!--
* `apiserver_flowcontrol_current_limit_seats` is a gauge vector
  holding, for each priority level, the dynamic concurrency limit
  derived in the last adjustment.
-->
* `apiserver_flowcontrol_current_limit_seats` 是一個測量向量，
  包含每個優先級的上一次調整期間得出的動態併發限制。

<!--
* `apiserver_flowcontrol_request_execution_seconds` is a histogram
  vector of how long requests took to actually execute, broken down by
  `flow_schema` and `priority_level`.
-->
* `apiserver_flowcontrol_request_execution_seconds` 是一個直方圖向量，
  記錄請求實際執行需要花費的時間，
  可按標籤 `flow_schema` 和 `priority_level` 分解。

<!--
* `apiserver_flowcontrol_watch_count_samples` is a histogram vector of
  the number of active WATCH requests relevant to a given write,
  broken down by `flow_schema` and `priority_level`.
-->
* `apiserver_flowcontrol_watch_count_samples` 是一個直方圖向量，
  記錄給定寫的相關活動 WATCH 請求數量，
  可按標籤 `flow_schema` 和 `priority_level` 分解。

<!--
* `apiserver_flowcontrol_work_estimated_seats` is a histogram vector
  of the number of estimated seats (maximum of initial and final stage
  of execution) associated with requests, broken down by `flow_schema`
  and `priority_level`.
-->
* `apiserver_flowcontrol_work_estimated_seats` 是一個直方圖向量，
  記錄與估計席位（最初階段和最後階段的最多人數）相關聯的請求數量，
  可按標籤 `flow_schema` 和 `priority_level` 分解。

<!--
* `apiserver_flowcontrol_request_dispatch_no_accommodation_total` is a
  counter vector of the number of events that in principle could have led
  to a request being dispatched but did not, due to lack of available
  concurrency, broken down by `flow_schema` and `priority_level`.
-->
* `apiserver_flowcontrol_request_dispatch_no_accommodation_total`
  是一個事件數量的計數器，這些事件在原則上可能導致請求被分派，
  但由於併發度不足而沒有被分派，
  可按標籤 `flow_schema` 和 `priority_level` 分解。

<!--
* `apiserver_flowcontrol_epoch_advance_total` is a counter vector of
  the number of attempts to jump a priority level's progress meter
  backward to avoid numeric overflow, grouped by `priority_level` and
  `success`.
-->
* `apiserver_flowcontrol_epoch_advance_total` 是一個計數器向量，
  記錄了將優先級進度計向後跳躍以避免數值溢出的嘗試次數，
  按 `priority_level` 和 `success` 兩個標籤進行分組。

<!--
## Good practices for using API Priority and Fairness

When a given priority level exceeds its permitted concurrency, requests can
experience increased latency or be dropped with an HTTP 429 (Too Many Requests)
error. To prevent these side effects of APF, you can modify your workload or
tweak your APF settings to ensure there are sufficient seats available to serve
your requests.
-->
## 使用 API 優先級和公平性的最佳實踐   {#good-practices-for-using-api-priority-and-fairness}

當某個給定的優先級級別超過其所被允許的併發數時，請求可能會遇到延遲增加，
或以錯誤 HTTP 429 (Too Many Requests) 的形式被拒絕。
爲了避免這些 APF 的副作用，你可以修改你的工作負載或調整你的 APF 設置，確保有足夠的席位來處理請求。

<!--
To detect whether requests are being rejected due to APF, check the following
metrics:

- apiserver_flowcontrol_rejected_requests_total: the total number of requests
  rejected per FlowSchema and PriorityLevelConfiguration.
- apiserver_flowcontrol_current_inqueue_requests: the current number of requests
  queued per FlowSchema and PriorityLevelConfiguration.
- apiserver_flowcontrol_request_wait_duration_seconds: the latency added to
  requests waiting in queues.
- apiserver_flowcontrol_priority_level_seat_utilization: the seat utilization
  per PriorityLevelConfiguration.
-->
要檢測請求是否由於 APF 而被拒絕，可以檢查以下指標：

- apiserver_flowcontrol_rejected_requests_total：
  每個 FlowSchema 和 PriorityLevelConfiguration 拒絕的請求總數。
- apiserver_flowcontrol_current_inqueue_requests：
  每個 FlowSchema 和 PriorityLevelConfiguration 中排隊的當前請求數。
- apiserver_flowcontrol_request_wait_duration_seconds：請求在隊列中等待的延遲時間。
- apiserver_flowcontrol_priority_level_seat_utilization：
  每個 PriorityLevelConfiguration 的席位利用率。

<!--
### Workload modifications {#good-practice-workload-modifications}

To prevent requests from queuing and adding latency or being dropped due to APF,
you can optimize your requests by:
-->
### 工作負載修改 {#good-practice-workload-modifications}

爲了避免由於 APF 導致請求排隊、延遲增加或被拒絕，你可以通過以下方式優化請求：

<!--
- Reducing the rate at which requests are executed. A fewer number of requests
  over a fixed period will result in a fewer number of seats being needed at a
  given time.
-->
- 減少請求執行的速率。在固定時間段內減少請求數量將導致在某一給定時間點需要的席位數更少。

<!--
- Avoid issuing a large number of expensive requests concurrently. Requests can
  be optimized to use fewer seats or have lower latency so that these requests
  hold those seats for a shorter duration. List requests can occupy more than 1
  seat depending on the number of objects fetched during the request. Restricting
  the number of objects retrieved in a list request, for example by using
  pagination, will use less total seats over a shorter period. Furthermore,
  replacing list requests with watch requests will require lower total concurrency
  shares as watch requests only occupy 1 seat during its initial burst of
  notifications. If using streaming lists in versions 1.27 and later, watch
  requests will occupy the same number of seats as a list request for its initial
  burst of notifications because the entire state of the collection has to be
  streamed. Note that in both cases, a watch request will not hold any seats after
  this initial phase.
-->
- 避免同時發出大量消耗較多席位的請求。請求可以被優化爲使用更少的席位或降低延遲，
  使這些請求佔用席位的時間變短。列表請求根據請求期間獲取的對象數量可能會佔用多個席位。
  例如通過使用分頁等方式限制列表請求中取回的對象數量，可以在更短時間內使用更少的總席位數。
  此外，將列表請求替換爲監視請求將需要更低的總併發份額，因爲監視請求僅在初始的通知突發階段佔用 1 個席位。
  如果在 1.27 及更高版本中使用流式列表，因爲集合的整個狀態必須以流式傳輸，
  所以監視請求在其初始的通知突發階段將佔用與列表請求相同數量的席位。
  請注意，在這兩種情況下，監視請求在此初始階段之後將不再保留任何席位。

<!--
Keep in mind that queuing or rejected requests from APF could be induced by
either an increase in the number of requests or an increase in latency for
existing requests. For example, if requests that normally take 1s to execute
start taking 60s, it is possible that APF will start rejecting requests because
requests are occupying seats for a longer duration than normal due to this
increase in latency. If APF starts rejecting requests across multiple priority
levels without a significant change in workload, it is possible there is an
underlying issue with control plane performance rather than the workload or APF
settings.
-->
請注意，由於請求數量增加或現有請求的延遲增加，APF 可能會導致請求排隊或被拒絕。
例如，如果通常需要 1 秒執行的請求開始需要 60 秒，由於延遲增加，
請求所佔用的席位時間可能超過了正常情況下的時長，APF 將開始拒絕請求。
如果在沒有工作負載顯著變化的情況下，APF 開始在多個優先級級別上拒絕請求，
則可能存在控制平面性能的潛在問題，而不是工作負載或 APF 設置的問題。

<!--
### Priority and fairness settings {#good-practice-apf-settings}

You can also modify the default FlowSchema and PriorityLevelConfiguration
objects or create new objects of these types to better accommodate your
workload.

APF settings can be modified to:

- Give more seats to high priority requests.
- Isolate non-essential or expensive requests that would starve a concurrency
  level if it was shared with other flows.
-->
### 優先級和公平性設置   {#good-practice-apf-settings}

你還可以修改預設的 FlowSchema 和 PriorityLevelConfiguration 對象，
或創建新的對象來更好地容納你的工作負載。

APF 設置可以被修改以實現下述目標：

- 給予高優先級請求更多的席位。
- 隔離那些非必要或開銷大的請求，因爲如果與其他流共享，這些請求可能會耗盡所有併發級別。

<!--
#### Give more seats to high priority requests
-->
#### 給予高優先級請求更多的席位

<!--
1. If possible, the number of seats available across all priority levels for a
   particular `kube-apiserver` can be increased by increasing the values for the
   `max-requests-inflight` and `max-mutating-requests-inflight` flags. Alternatively,
   horizontally scaling the number of `kube-apiserver` instances will increase the
   total concurrency per priority level across the cluster assuming there is
   sufficient load balancing of requests.
-->
1. 如果有可能，你可以通過提高 `max-requests-inflight` 和 `max-mutating-requests-inflight`
   參數的值爲特定 `kube-apiserver` 提高所有優先級級別均可用的席位數量。另外，
   如果在請求的負載均衡足夠好的情況下，水平擴縮 `kube-apiserver` 實例的數量將提高叢集中每個優先級級別的總併發數。

<!--
1. You can create a new FlowSchema which references a PriorityLevelConfiguration
   with a larger concurrency level. This new PriorityLevelConfiguration could be an
   existing level or a new level with its own set of nominal concurrency shares.
   For example, a new FlowSchema could be introduced to change the
   PriorityLevelConfiguration for your requests from global-default to workload-low
   to increase the number of seats available to your user. Creating a new
   PriorityLevelConfiguration will reduce the number of seats designated for
   existing levels. Recall that editing a default FlowSchema or
   PriorityLevelConfiguration will require setting the
   `apf.kubernetes.io/autoupdate-spec` annotation to false.
-->
2. 你可以創建一個新的 FlowSchema，在其中引用併發級別更高的 PriorityLevelConfiguration。
   這個新的 PriorityLevelConfiguration 可以是現有的級別，也可以是具有自己一組額定併發份額的新級別。
   例如，你可以引入一個新的 FlowSchema 來將請求的 PriorityLevelConfiguration
   從全局預設值更改爲工作負載較低的級別，以增加使用者可用的席位數。
   創建一個新的 PriorityLevelConfiguration 將減少爲現有級別指定的席位數。
   請注意，編輯預設的 FlowSchema 或 PriorityLevelConfiguration 需要將
   `apf.kubernetes.io/autoupdate-spec` 註解設置爲 false。

<!--
1. You can also increase the NominalConcurrencyShares for the
   PriorityLevelConfiguration which is serving your high priority requests.
   Alternatively, for versions 1.26 and later, you can increase the LendablePercent
   for competing priority levels so that the given priority level has a higher pool
   of seats it can borrow.
-->
3. 你還可以爲服務於高優先級請求的 PriorityLevelConfiguration 提高 NominalConcurrencyShares。
   此外在 1.26 及更高版本中，你可以爲有競爭的優先級級別提高 LendablePercent，以便給定優先級級別可以借用更多的席位。

<!--
#### Isolate non-essential requests from starving other flows

For request isolation, you can create a FlowSchema whose subject matches the
user making these requests or create a FlowSchema that matches what the request
is (corresponding to the resourceRules). Next, you can map this FlowSchema to a
PriorityLevelConfiguration with a low share of seats.
-->
#### 隔離非關鍵請求以免餓死其他流

爲了進行請求隔離，你可以創建一個 FlowSchema，使其主體與發起這些請求的使用者匹配，
或者創建一個與請求內容匹配（對應 resourceRules）的 FlowSchema。
接下來，你可以將該 FlowSchema 映射到一個具有較低席位份額的 PriorityLevelConfiguration。

<!--
For example, suppose list event requests from Pods running in the default namespace
are using 10 seats each and execute for 1 minute. To prevent these expensive
requests from impacting requests from other Pods using the existing service-accounts
FlowSchema, you can apply the following FlowSchema to isolate these list calls
from other requests.

Example FlowSchema object to isolate list event requests:
-->
例如，假設來自 default 名字空間中運行的 Pod 的每個事件列表請求使用 10 個席位，並且執行時間爲 1 分鐘。
爲了防止這些開銷大的請求影響使用現有服務賬號 FlowSchema 的其他 Pod 的請求，你可以應用以下
FlowSchema 將這些列表調用與其他請求隔離開來。

用於隔離列表事件請求的 FlowSchema 對象示例：

{{% code_sample file="priority-and-fairness/list-events-default-service-account.yaml" %}}

<!--
- This FlowSchema captures all list event calls made by the default service
  account in the default namespace. The matching precedence 8000 is lower than the
  value of 9000 used by the existing service-accounts FlowSchema so these list
  event calls will match list-events-default-service-account rather than
  service-accounts.
- The catch-all PriorityLevelConfiguration is used to isolate these requests.
  The catch-all priority level has a very small concurrency share and does not
  queue requests.
-->
- 這個 FlowSchema 用於抓取 default 名字空間中預設服務賬號所發起的所有事件列表調用。
  匹配優先級爲 8000，低於現有服務賬號 FlowSchema 所用的 9000，因此這些列表事件調用將匹配到
  list-events-default-service-account 而不是服務賬號。
- 通用 PriorityLevelConfiguration 用於隔離這些請求。通用優先級級別具有非常小的併發份額，並且不對請求進行排隊。

## {{% heading "whatsnext" %}}

<!--
- You can visit flow control [reference doc](/docs/reference/debug-cluster/flow-control/) to learn more about troubleshooting.
- For background information on design details for API priority and fairness, see
  the [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness).
- You can make suggestions and feature requests via [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery)
  or the feature's [slack channel](https://kubernetes.slack.com/messages/api-priority-and-fairness).
-->
- 你可以查閱流控[參考文檔](/zh-cn/docs/reference/debug-cluster/flow-control/)瞭解有關故障排查的更多資訊。
- 有關 API 優先級和公平性的設計細節的背景資訊，
  請參閱[增強提案](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness)。
- 你可以通過 [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery/)
  或特性的 [Slack 頻道](https://kubernetes.slack.com/messages/api-priority-and-fairness/)提出建議和特性請求。
