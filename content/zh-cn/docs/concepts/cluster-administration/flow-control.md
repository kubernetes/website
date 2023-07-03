---
title: API 优先级和公平性
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
对于集群管理员来说，控制 Kubernetes API 服务器在过载情况下的行为是一项关键任务。
{{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
有一些控件（例如：命令行标志 `--max-requests-inflight` 和 `--max-mutating-requests-inflight`），
可以限制将要接受的未处理的请求，从而防止过量请求入站，潜在导致 API 服务器崩溃。
但是这些标志不足以保证在高流量期间，最重要的请求仍能被服务器接受。

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
API 优先级和公平性（APF）是一种替代方案，可提升上述最大并发限制。
APF 以更细粒度的方式对请求进行分类和隔离。
它还引入了空间有限的排队机制，因此在非常短暂的突发情况下，API 服务器不会拒绝任何请求。
通过使用公平排队技术从队列中分发请求，这样，
一个行为不佳的{{< glossary_tooltip text="控制器" term_id="controller" >}}就不会饿死其他控制器
（即使优先级相同）。

<!--
This feature is designed to work well with standard controllers, which
use informers and react to failures of API requests with exponential
back-off, and other clients that also work this way.
-->
本功能特性在设计上期望其能与标准控制器一起工作得很好；
这类控制器使用通知组件（Informers）获得信息并对 API 请求的失效作出反应，
在处理失效时能够执行指数型回退。其他客户端也以类似方式工作。

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
属于 “长时间运行” 类型的某些请求（例如远程命令执行或日志拖尾）不受 API 优先级和公平性过滤器的约束。
如果未启用 APF 特性，即便设置 `--max-requests-inflight` 标志，该类请求也不受约束。
APF 适用于 **watch** 请求。当 APF 被禁用时，**watch** 请求不受 `--max-requests-inflight` 限制。
{{< /caution >}}

<!-- body -->

<!--
## Enabling/Disabling API Priority and Fairness
-->
## 启用/禁用 API 优先级和公平性    {#enabling-api-priority-and-fairness}

<!--
The API Priority and Fairness feature is controlled by a feature gate
and is enabled by default.  See [Feature
Gates](/docs/reference/command-line-tools-reference/feature-gates/)
for a general explanation of feature gates and how to enable and
disable them.  The name of the feature gate for APF is
"APIPriorityAndFairness".  This feature also involves an {{<
glossary_tooltip term_id="api-group" text="API Group" >}} with: (a) a
`v1alpha1` version and a `v1beta1` version, disabled by default, and
(b) `v1beta2` and `v1beta3` versions, enabled by default.  You can
disable the feature gate and API group beta versions by adding the
following command-line flags to your `kube-apiserver` invocation:
-->
API 优先级与公平性（APF）特性由特性门控控制，默认情况下启用。
有关特性门控的一般性描述以及如何启用和禁用特性门控，
请参见[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
APF 的特性门控称为 `APIPriorityAndFairness`。
此特性也与某个 {{< glossary_tooltip term_id="api-group" text="API 组" >}}相关：
(a) `v1alpha1` 和 `v1beta1` 版本，默认被禁用；
(b) `v1beta2` 和 `v1beta3` 版本，默认被启用。
你可以在启动 `kube-apiserver` 时，添加以下命令行标志来禁用此功能门控及 API Beta 组：

```shell
kube-apiserver \
--feature-gates=APIPriorityAndFairness=false \
--runtime-config=flowcontrol.apiserver.k8s.io/v1beta2=false,flowcontrol.apiserver.k8s.io/v1beta3=false \
  # ...其他配置不变
```

<!--
Alternatively, you can enable the v1alpha1 and v1beta1 versions of the API group
with `--runtime-config=flowcontrol.apiserver.k8s.io/v1alpha1=true,flowcontrol.apiserver.k8s.io/v1beta1=true`.
-->
或者，你也可以通过
`--runtime-config=flowcontrol.apiserver.k8s.io/v1alpha1=true,flowcontrol.apiserver.k8s.io/v1beta1=true`
启用 API 组的 v1alpha1 和 v1beta1 版本。

<!--
The command-line flag `--enable-priority-and-fairness=false` will disable the
API Priority and Fairness feature, even if other flags have enabled it.
-->
命令行标志 `--enable-priority-fairness=false` 将彻底禁用 APF 特性，
即使其他标志启用它也是无效。

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

APF 特性包含几个不同的功能。
传入的请求通过 **FlowSchema** 按照其属性分类，并分配优先级。
每个优先级维护自定义的并发限制，加强了隔离度，这样不同优先级的请求，就不会相互饿死。
在同一个优先级内，公平排队算法可以防止来自不同 **流（Flow）** 的请求相互饿死。
该算法将请求排队，通过排队机制，防止在平均负载较低时，通信量突增而导致请求失败。

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
### 优先级    {#priority-levels}

如果未启用 APF，API 服务器中的整体并发量将受到 `kube-apiserver` 的参数
`--max-requests-inflight` 和 `--max-mutating-requests-inflight` 的限制。
启用 APF 后，将对这些参数定义的并发限制进行求和，然后将总和分配到一组可配置的 **优先级** 中。
每个传入的请求都会分配一个优先级；每个优先级都有各自的限制，设定特定限制允许分发的并发请求数。

<!--
The default configuration, for example, includes separate priority levels for
leader-election requests, requests from built-in controllers, and requests from
Pods. This means that an ill-behaved Pod that floods the API server with
requests cannot prevent leader election or actions by the built-in controllers
from succeeding.
-->
例如，默认配置包括针对领导者选举请求、内置控制器请求和 Pod 请求都单独设置优先级。
这表示即使异常的 Pod 向 API 服务器发送大量请求，也无法阻止领导者选举或内置控制器的操作执行成功。

<!--
The concurrency limits of the priority levels are periodically
adjusted, allowing under-utilized priority levels to temporarily lend
concurrency to heavily-utilized levels.  These limits are based on
nominal limits and bounds on how much concurrency a priority level may
lend and how much it may borrow, all derived from the configuration
objects mentioned below.
-->
优先级的并发限制会被定期调整，允许利用率较低的优先级将并发度临时借给利用率很高的优先级。
这些限制基于一个优先级可以借出多少个并发度以及可以借用多少个并发度的额定限制和界限，
所有这些均源自下述配置对象。

<!--
### Seats Occupied by a Request

The above description of concurrency management is the baseline story.
Requests have different durations but are counted equally at any given
moment when comparing against a priority level's concurrency limit. In
the baseline story, each request occupies one unit of concurrency. The
word "seat" is used to mean one unit of concurrency, inspired by the
way each passenger on a train or aircraft takes up one of the fixed
supply of seats.

But some requests take up more than one seat.  Some of these are **list**
requests that the server estimates will return a large number of
objects.  These have been found to put an exceptionally heavy burden
on the server.  For this reason, the server estimates the number of objects
that will be returned and considers the request to take a number of seats
that is proportional to that estimated number.
-->
### 请求占用的席位  {#seats-occupied-by-a-request}

上述并发管理的描述是基线情况。各个请求具有不同的持续时间，
但在与一个优先级的并发限制进行比较时，这些请求在任何给定时刻都以同等方式进行计数。
在这个基线场景中，每个请求占用一个并发单位。
我们用 “席位（Seat）” 一词来表示一个并发单位，其灵感来自火车或飞机上每位乘客占用一个固定座位的供应方式。

但有些请求所占用的席位不止一个。有些请求是服务器预估将返回大量对象的 **list** 请求。
我们发现这类请求会给服务器带来异常沉重的负担。
出于这个原因，服务器估算将返回的对象数量，并认为请求所占用的席位数与估算得到的数量成正比。

<!--
### Execution time tweaks for watch requests

API Priority and Fairness manages **watch** requests, but this involves a
couple more excursions from the baseline behavior.  The first concerns
how long a **watch**  request is considered to occupy its seat.  Depending
on request parameters, the response to a **watch**  request may or may not
begin with **create**  notifications for all the relevant pre-existing
objects.  API Priority and Fairness considers a **watch**  request to be
done with its seat once that initial burst of notifications, if any,
is over.

The normal notifications are sent in a concurrent burst to all
relevant **watch**  response streams whenever the server is notified of an
object create/update/delete.  To account for this work, API Priority
and Fairness considers every write request to spend some additional
time occupying seats after the actual writing is done.  The server
estimates the number of notifications to be sent and adjusts the write
request's number of seats and seat occupancy time to include this
extra work.
-->
### watch 请求的执行时间调整  {#execution-time-tweak-for-watch-requests}

APF 管理 **watch** 请求，但这需要考量基线行为之外的一些情况。
第一个关注点是如何判定 **watch** 请求的席位占用时长。
取决于请求参数不同，对 **watch** 请求的响应可能以针对所有预先存在的对象 **create** 通知开头，也可能不这样。
一旦最初的突发通知（如果有）结束，APF 将认为 **watch** 请求已经用完其席位。

每当向服务器通知创建/更新/删除一个对象时，正常通知都会以并发突发的方式发送到所有相关的 **watch** 响应流。
为此，APF 认为每个写入请求都会在实际写入完成后花费一些额外的时间来占用席位。
服务器估算要发送的通知数量，并调整写入请求的席位数以及包含这些额外工作后的席位占用时间。

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
### 排队    {#queuing}

即使在同一优先级内，也可能存在大量不同的流量源。
在过载情况下，防止一个请求流饿死其他流是非常有价值的
（尤其是在一个较为常见的场景中，一个有故障的客户端会疯狂地向 kube-apiserver 发送请求，
理想情况下，这个有故障的客户端不应对其他客户端产生太大的影响）。
公平排队算法在处理具有相同优先级的请求时，实现了上述场景。
每个请求都被分配到某个 **流（Flow）** 中，该 **流** 由对应的 FlowSchema 的名字加上一个
**流区分项（Flow Distinguisher）** 来标识。
这里的流区分项可以是发出请求的用户、目标资源的名字空间或什么都不是。
系统尝试为不同流中具有相同优先级的请求赋予近似相等的权重。
要启用对不同实例的不同处理方式，多实例的控制器要分别用不同的用户名来执行身份认证。

<!--
After classifying a request into a flow, the API Priority and Fairness
feature then may assign the request to a queue.  This assignment uses
a technique known as {{< glossary_tooltip term_id="shuffle-sharding"
text="shuffle sharding" >}}, which makes relatively efficient use of
queues to insulate low-intensity flows from high-intensity flows.
-->
将请求划分到流中之后，APF 功能将请求分配到队列中。
分配时使用一种称为{{< glossary_tooltip term_id="shuffle-sharding" text="混洗分片（Shuffle-Sharding）" >}}的技术。
该技术可以相对有效地利用队列隔离低强度流与高强度流。

<!--
The details of the queuing algorithm are tunable for each priority level, and
allow administrators to trade off memory use, fairness (the property that
independent flows will all make progress when total traffic exceeds capacity),
tolerance for bursty traffic, and the added latency induced by queuing.
-->
排队算法的细节可针对每个优先等级进行调整，并允许管理员在内存占用、
公平性（当总流量超标时，各个独立的流将都会取得进展）、
突发流量的容忍度以及排队引发的额外延迟之间进行权衡。

<!--
### Exempt requests

Some requests are considered sufficiently important that they are not subject to
any of the limitations imposed by this feature. These exemptions prevent an
improperly-configured flow control configuration from totally disabling an API
server.
-->
### 豁免请求    {#exempt-requests}

某些特别重要的请求不受制于此特性施加的任何限制。
这些豁免可防止不当的流控配置完全禁用 API 服务器。

<!--
## Resources

The flow control API involves two kinds of resources.
[PriorityLevelConfigurations](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#prioritylevelconfiguration-v1beta2-flowcontrol-apiserver-k8s-io)
define the available priority levels, the share of the available concurrency
budget that each can handle, and allow for fine-tuning queuing behavior.
[FlowSchemas](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#flowschema-v1beta2-flowcontrol-apiserver-k8s-io)
are used to classify individual inbound requests, matching each to a
single PriorityLevelConfiguration.  There is also a `v1alpha1` version
of the same API group, and it has the same Kinds with the same syntax and
semantics.
-->
## 资源    {#resources}

流控 API 涉及两种资源。
[PriorityLevelConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#prioritylevelconfiguration-v1beta2-flowcontrol-apiserver-k8s-io)
定义可用的优先级和可处理的并发预算量，还可以微调排队行为。
[FlowSchema](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#flowschema-v1beta2-flowcontrol-apiserver-k8s-io)
用于对每个入站请求进行分类，并与一个 PriorityLevelConfiguration 相匹配。
此外同一 API 组还有一个 `v1alpha1` 版本，其中包含语法和语义都相同的资源类别。

<!--
### PriorityLevelConfiguration

A PriorityLevelConfiguration represents a single priority level. Each
PriorityLevelConfiguration has an independent limit on the number of outstanding
requests, and limitations on the number of queued requests.
-->
### PriorityLevelConfiguration

一个 PriorityLevelConfiguration 表示单个优先级。每个 PriorityLevelConfiguration
对未完成的请求数有各自的限制，对排队中的请求数也有限制。

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
PriorityLevelConfiguration 的额定并发限制不是指定请求绝对数量，而是以“额定并发份额”的形式指定。
API 服务器的总并发量限制通过这些份额按例分配到现有 PriorityLevelConfiguration 中，
为每个级别按照数量赋予其额定限制。
集群管理员可以更改 `--max-requests-inflight` （或 `--max-mutating-requests-inflight`）的值，
再重新启动 `kube-apiserver` 来增加或减小服务器的总流量，
然后所有的 PriorityLevelConfiguration 将看到其最大并发增加（或减少）了相同的比例。

{{< caution >}}
<!--
In the versions before `v1beta3` the relevant
PriorityLevelConfiguration field is named "assured concurrency shares"
rather than "nominal concurrency shares".  Also, in Kubernetes release
1.25 and earlier there were no periodic adjustments: the
nominal/assured limits were always applied without adjustment.
-->
在 `v1beta3` 之前的版本中，相关的 PriorityLevelConfiguration
字段被命名为“保证并发份额”而不是“额定并发份额”。此外在 Kubernetes v1.25
及更早的版本中，不存在定期的调整：所实施的始终是额定/保证的限制，不存在调整。
{{< /caution >}}

<!--
The bounds on how much concurrency a priority level may lend and how
much it may borrow are expressed in the PriorityLevelConfiguration as
percentages of the level's nominal limit.  These are resolved to
absolute numbers of seats by multiplying with the nominal limit /
100.0 and rounding.  The dynamically adjusted concurrency limit of a
priority level is constrained to lie between (a) a lower bound of its
nominal limit minus its lendable seats and (b) an upper bound of its
nominal limit plus the seats it may borrow.  At each adjustment the
dynamic limits are derived by each priority level reclaiming any lent
seats for which demand recently appeared and then jointly fairly
responding to the recent seat demand on the priority levels, within
the bounds just described.
-->
一个优先级可以借出的并发数界限以及可以借用的并发数界限在
PriorityLevelConfiguration 表现该优先级的额定限制。
这些界限值乘以额定限制/100.0 并取整，被解析为绝对席位数量。
某优先级的动态调整并发限制范围被约束在
(a) 其额定限制的下限值减去其可借出的席位和
(b) 其额定限制的上限值加上它可以借用的席位之间。
在每次调整时，通过每个优先级推导得出动态限制，具体过程为回收最近出现需求的所有借出的席位，
然后在刚刚描述的界限内共同公平地响应有关这些优先级最近的席位需求。

{{< caution >}}
<!--
With the Priority and Fairness feature enabled, the total concurrency limit for
the server is set to the sum of `--max-requests-inflight` and
`--max-mutating-requests-inflight`. There is no longer any distinction made
between mutating and non-mutating requests; if you want to treat them
separately for a given resource, make separate FlowSchemas that match the
mutating and non-mutating verbs respectively.
-->
启用 APF 特性时，服务器的总并发限制被设置为 `--max-requests-inflight` 及
`--max-mutating-requests-inflight` 之和。变更性和非变更性请求之间不再有任何不同；
如果你想针对某给定资源分别进行处理，请制作单独的 FlowSchema，分别匹配变更性和非变更性的动作。
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
当入站请求的数量大于分配的 PriorityLevelConfiguration 中允许的并发级别时，
`type` 字段将确定对额外请求的处理方式。
`Reject` 类型，表示多余的流量将立即被 HTTP 429（请求过多）错误所拒绝。
`Queue` 类型，表示对超过阈值的请求进行排队，将使用阈值分片和公平排队技术来平衡请求流之间的进度。

<!--
The queuing configuration allows tuning the fair queuing algorithm for a
priority level. Details of the algorithm can be read in the
[enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness), but in short:
-->
公平排队算法支持通过排队配置对优先级微调。
可以在[增强建议](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness)中阅读算法的详细信息，
但总之：

<!--
* Increasing `queues` reduces the rate of collisions between different flows, at
  the cost of increased memory usage. A value of 1 here effectively disables the
  fair-queuing logic, but still allows requests to be queued.
-->
* `queues` 递增能减少不同流之间的冲突概率，但代价是增加了内存使用量。
  值为 1 时，会禁用公平排队逻辑，但仍允许请求排队。

<!--
* Increasing `queueLengthLimit` allows larger bursts of traffic to be
  sustained without dropping any requests, at the cost of increased
  latency and memory usage.
-->
* `queueLengthLimit` 递增可以在不丢弃任何请求的情况下支撑更大的突发流量，
  但代价是增加了等待时间和内存使用量。

<!--
* Changing `handSize` allows you to adjust the probability of collisions between
  different flows and the overall concurrency available to a single flow in an
  overload situation.
-->
* 修改 `handSize` 允许你调整过载情况下不同流之间的冲突概率以及单个流可用的整体并发性。

  {{< note >}}
  <!--
  A larger `handSize` makes it less likely for two individual flows to collide
  (and therefore for one to be able to starve the other), but more likely that
  a small number of flows can dominate the apiserver. A larger `handSize` also
  potentially increases the amount of latency that a single high-traffic flow
  can cause. The maximum number of queued requests possible from a
  single flow is `handSize * queueLengthLimit`.
  -->
  较大的 `handSize` 使两个单独的流程发生碰撞的可能性较小（因此，一个流可以饿死另一个流），
  但是更有可能的是少数流可以控制 apiserver。
  较大的 `handSize` 还可能增加单个高并发流的延迟量。
  单个流中可能排队的请求的最大数量为 `handSize * queueLengthLimit`。
  {{< /note >}}

<!--
Following is a table showing an interesting collection of shuffle
sharding configurations, showing for each the probability that a
given mouse (low-intensity flow) is squished by the elephants (high-intensity flows) for
an illustrative collection of numbers of elephants. See
https://play.golang.org/p/Gi0PLgVHiUg , which computes this table.
-->
下表显示了有趣的随机分片配置集合，每行显示给定的老鼠（低强度流）
被不同数量的大象挤压（高强度流）的概率。
表来源请参阅： https://play.golang.org/p/Gi0PLgVHiUg

{{< table caption = "混分切片配置示例" >}}
<!-- HandSize | Queues | 1 elephant | 4 elephants | 16 elephants -->
随机分片 | 队列数 | 1 个大象 | 4 个大象 | 16 个大象
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

FlowSchema 匹配一些入站请求，并将它们分配给优先级。
每个入站请求都会对 FlowSchema 测试是否匹配，
首先从 `matchingPrecedence` 数值最低的匹配开始，
然后依次进行，直到首个匹配出现。

{{< caution >}}
<!--
Only the first matching FlowSchema for a given request matters. If multiple
FlowSchemas match a single inbound request, it will be assigned based on the one
with the highest `matchingPrecedence`. If multiple FlowSchemas with equal
`matchingPrecedence` match the same request, the one with lexicographically
smaller `name` will win, but it's better not to rely on this, and instead to
ensure that no two FlowSchemas have the same `matchingPrecedence`.
-->
对一个请求来说，只有首个匹配的 FlowSchema  才有意义。
如果一个入站请求与多个 FlowSchema 匹配，则将基于逻辑上最高优先级 `matchingPrecedence` 的请求进行筛选。
如果一个请求匹配多个 FlowSchema 且 `matchingPrecedence` 的值相同，则按 `name` 的字典序选择最小，
但是最好不要依赖它，而是确保不存在两个 FlowSchema 具有相同的 `matchingPrecedence` 值。
{{< /caution >}}

<!--
A FlowSchema matches a given request if at least one of its `rules`
matches. A rule matches if at least one of its `subjects` *and* at least
one of its `resourceRules` or `nonResourceRules` (depending on whether the
incoming request is for a resource or non-resource URL) match the request.
-->
当给定的请求与某个 FlowSchema 的 `rules` 的其中一条匹配，那么就认为该请求与该 FlowSchema 匹配。
判断规则与该请求是否匹配，**不仅**要求该条规则的 `subjects` 字段至少存在一个与该请求相匹配，
**而且**要求该条规则的 `resourceRules` 或 `nonResourceRules`
（取决于传入请求是针对资源 URL 还是非资源 URL）字段至少存在一个与该请求相匹配。

<!--
For the `name` field in subjects, and the `verbs`, `apiGroups`, `resources`,
`namespaces`, and `nonResourceURLs` fields of resource and non-resource rules,
the wildcard `*` may be specified to match all values for the given field,
effectively removing it from consideration.
-->
对于 `subjects` 中的 `name` 字段和资源和非资源规则的
`verbs`、`apiGroups`、`resources`、`namespaces` 和 `nonResourceURLs` 字段，
可以指定通配符 `*` 来匹配任意值，从而有效地忽略该字段。

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
FlowSchema 的 `distinguisherMethod.type` 字段决定了如何把与该模式匹配的请求分散到各个流中。
可能是 `ByUser`，在这种情况下，一个请求用户将无法饿死其他容量的用户；
或者是 `ByNamespace`，在这种情况下，一个名字空间中的资源请求将无法饿死其它名字空间的资源请求；
或者为空（或者可以完全省略 `distinguisherMethod`），
在这种情况下，与此 FlowSchema 匹配的请求将被视为单个流的一部分。
资源和你的特定环境决定了如何选择正确一个 FlowSchema。

<!--
## Defaults

Each kube-apiserver maintains two sorts of APF configuration objects:
mandatory and suggested.
-->
## 默认值    {#defaults}

每个 kube-apiserver 会维护两种类型的 APF 配置对象：强制的（Mandatory）和建议的（Suggested）。

<!--
### Mandatory Configuration Objects

The four mandatory configuration objects reflect fixed built-in
guardrail behavior.  This is behavior that the servers have before
those objects exist, and when those objects exist their specs reflect
this behavior.  The four mandatory objects are as follows.
-->
### 强制的配置对象   {#mandatory-configuration-objects}

有四种强制的配置对象对应内置的守护行为。这里的行为是服务器在还未创建对象之前就具备的行为，
而当这些对象存在时，其规约反映了这类行为。四种强制的对象如下：

<!--
* The mandatory `exempt` priority level is used for requests that are
  not subject to flow control at all: they will always be dispatched
  immediately. The mandatory `exempt` FlowSchema classifies all
  requests from the `system:masters` group into this priority
  level. You may define other FlowSchemas that direct other requests
  to this priority level, if appropriate.
-->
* 强制的 `exempt` 优先级用于完全不受流控限制的请求：它们总是立刻被分发。
  强制的 `exempt` FlowSchema 把 `system:masters` 组的所有请求都归入该优先级。
  如果合适，你可以定义新的 FlowSchema，将其他请求定向到该优先级。

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
* 强制的 `catch-all` 优先级与强制的 `catch-all` FlowSchema 结合使用，
  以确保每个请求都分类。一般而言，你不应该依赖于 `catch-all` 的配置，
  而应适当地创建自己的 `catch-all` FlowSchema 和 PriorityLevelConfiguration
  （或使用默认安装的 `global-default` 配置）。
  因为这一优先级不是正常场景下要使用的，`catch-all` 优先级的并发度份额很小，
  并且不会对请求进行排队。

<!--
### Suggested Configuration Objects

The suggested FlowSchemas and PriorityLevelConfigurations constitute a
reasonable default configuration.  You can modify these and/or create
additional configuration objects if you want.  If your cluster is
likely to experience heavy load then you should consider what
configuration will work best.

The suggested configuration groups requests into six priority levels:
-->
### 建议的配置对象   {#suggested-configuration-objects}

建议的 FlowSchema 和 PriorityLevelConfiguration 包含合理的默认配置。
你可以修改这些对象或者根据需要创建新的配置对象。如果你的集群可能承受较重负载，
那么你就要考虑哪种配置最合适。

建议的配置把请求分为六个优先级：

<!--
* The `node-high` priority level is for health updates from nodes.
-->
* `node-high` 优先级用于来自节点的健康状态更新。

<!--
* The `system` priority level is for non-health requests from the
  `system:nodes` group, i.e. Kubelets, which must be able to contact
  the API server in order for workloads to be able to schedule on
  them.
-->
* `system` 优先级用于 `system:nodes` 组（即 kubelet）的与健康状态更新无关的请求；
  kubelet 必须能连上 API 服务器，以便工作负载能够调度到其上。

<!--
* The `leader-election` priority level is for leader election requests from
  built-in controllers (in particular, requests for `endpoints`, `configmaps`,
  or `leases` coming from the `system:kube-controller-manager` or
  `system:kube-scheduler` users and service accounts in the `kube-system`
  namespace). These are important to isolate from other traffic because failures
  in leader election cause their controllers to fail and restart, which in turn
  causes more expensive traffic as the new controllers sync their informers.
-->
* `leader-election` 优先级用于内置控制器的领导选举的请求
  （特别是来自 `kube-system` 名字空间中 `system:kube-controller-manager` 和
  `system:kube-scheduler` 用户和服务账号，针对 `endpoints`、`configmaps` 或 `leases` 的请求）。
  将这些请求与其他流量相隔离非常重要，因为领导者选举失败会导致控制器发生故障并重新启动，
  这反过来会导致新启动的控制器在同步信息时，流量开销更大。

<!--
* The `workload-high` priority level is for other requests from built-in
  controllers.
* The `workload-low` priority level is for requests from any other service
  account, which will typically include all requests from controllers running in
  Pods.
* The `global-default` priority level handles all other traffic, e.g.
  interactive `kubectl` commands run by nonprivileged users.
-->
* `workload-high` 优先级用于内置控制器的其他请求。
* `workload-low` 优先级用于来自所有其他服务帐户的请求，通常包括来自 Pod
  中运行的控制器的所有请求。
* `global-default` 优先级可处理所有其他流量，例如：非特权用户运行的交互式
  `kubectl` 命令。

<!--
The suggested FlowSchemas serve to steer requests into the above
priority levels, and are not enumerated here.
-->
建议的 FlowSchema 用来将请求导向上述的优先级内，这里不再一一列举。

<!--
### Maintenance of the Mandatory and Suggested Configuration Objects

Each `kube-apiserver` independently maintains the mandatory and
suggested configuration objects, using initial and periodic behavior.
Thus, in a situation with a mixture of servers of different versions
there may be thrashing as long as different servers have different
opinions of the proper content of these objects.
-->
### 强制的与建议的配置对象的维护   {#maintenance-of-the-mandatory-and-suggested-configuration-objects}

每个 `kube-apiserver` 都独立地维护其强制的与建议的配置对象，
这一维护操作既是服务器的初始行为，也是其周期性操作的一部分。
因此，当存在不同版本的服务器时，如果各个服务器对于配置对象中的合适内容有不同意见，
就可能出现抖动。

<!--
Each `kube-apiserver` makes an initial maintenance pass over the
mandatory and suggested configuration objects, and after that does
periodic maintenance (once per minute) of those objects.

For the mandatory configuration objects, maintenance consists of
ensuring that the object exists and, if it does, has the proper spec.
The server refuses to allow a creation or update with a spec that is
inconsistent with the server's guardrail behavior.
-->
每个 `kube-apiserver` 都会对强制的与建议的配置对象执行初始的维护操作，
之后（每分钟）对这些对象执行周期性的维护。

对于强制的配置对象，维护操作包括确保对象存在并且包含合适的规约（如果存在的话）。
服务器会拒绝创建或更新与其守护行为不一致的规约。

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
对建议的配置对象的维护操作被设计为允许其规约被重载。删除操作是不允许的，
维护操作期间会重建这类配置对象。如果你不需要某个建议的配置对象，
你需要将它放在一边，并让其规约所产生的影响最小化。
对建议的配置对象而言，其维护方面的设计也支持在上线新的 `kube-apiserver`
时完成自动的迁移动作，即便可能因为当前的服务器集合存在不同的版本而可能造成抖动仍是如此。

<!--
Maintenance of a suggested configuration object consists of creating
it --- with the server's suggested spec --- if the object does not
exist.  OTOH, if the object already exists, maintenance behavior
depends on whether the `kube-apiservers` or the users control the
object.  In the former case, the server ensures that the object's spec
is what the server suggests; in the latter case, the spec is left
alone.
-->
对建议的配置对象的维护操作包括基于服务器建议的规约创建对象
（如果对象不存在的话）。反之，如果对象已经存在，维护操作的行为取决于是否
`kube-apiserver` 或者用户在控制对象。如果 `kube-apiserver` 在控制对象，
则服务器确保对象的规约与服务器所给的建议匹配，如果用户在控制对象，
对象的规约保持不变。

<!--
The question of who controls the object is answered by first looking
for an annotation with key `apf.kubernetes.io/autoupdate-spec`.  If
there is such an annotation and its value is `true` then the
kube-apiservers control the object.  If there is such an annotation
and its value is `false` then the users control the object.  If
neither of those conditions holds then the `metadata.generation` of the
object is consulted.  If that is 1 then the kube-apiservers control
the object.  Otherwise the users control the object.  These rules were
introduced in release 1.22 and their consideration of
`metadata.generation` is for the sake of migration from the simpler
earlier behavior.  Users who wish to control a suggested configuration
object should set its `apf.kubernetes.io/autoupdate-spec` annotation
to `false`.
-->
关于谁在控制对象这个问题，首先要看对象上的 `apf.kubernetes.io/autoupdate-spec`
注解。如果对象上存在这个注解，并且其取值为`true`，则 kube-apiserver
在控制该对象。如果存在这个注解，并且其取值为`false`，则用户在控制对象。
如果这两个条件都不满足，则需要进一步查看对象的 `metadata.generation`。
如果该值为 1，则 kube-apiserver 控制对象，否则用户控制对象。
这些规则是在 1.22 发行版中引入的，而对 `metadata.generation`
的考量是为了便于从之前较简单的行为迁移过来。希望控制建议的配置对象的用户应该将对象的
`apf.kubernetes.io/autoupdate-spec` 注解设置为 `false`。

<!--
Maintenance of a mandatory or suggested configuration object also
includes ensuring that it has an `apf.kubernetes.io/autoupdate-spec`
annotation that accurately reflects whether the kube-apiservers
control the object.

Maintenance also includes deleting objects that are neither mandatory
nor suggested but are annotated
`apf.kubernetes.io/autoupdate-spec=true`.
-->
对强制的或建议的配置对象的维护操作也包括确保对象上存在 `apf.kubernetes.io/autoupdate-spec`
这一注解，并且其取值准确地反映了是否 kube-apiserver 在控制着对象。

维护操作还包括删除那些既非强制又非建议的配置，同时注解配置为
`apf.kubernetes.io/autoupdate-spec=true` 的对象。

<!--
## Health check concurrency exemption

The suggested configuration gives no special treatment to the health
check requests on kube-apiservers from their local kubelets --- which
tend to use the secured port but supply no credentials.  With the
suggested config, these requests get assigned to the `global-default`
FlowSchema and the corresponding `global-default` priority level,
where other traffic can crowd them out.
-->
## 健康检查并发豁免    {#health-check-concurrency-exemption}

推荐配置没有为本地 kubelet 对 kube-apiserver 执行健康检查的请求进行任何特殊处理
——它们倾向于使用安全端口，但不提供凭据。
在推荐配置中，这些请求将分配 `global-default` FlowSchema 和 `global-default` 优先级，
这样其他流量可以排除健康检查。

<!--
If you add the following additional FlowSchema, this exempts those
requests from rate limiting.
-->
如果添加以下 FlowSchema，健康检查请求不受速率限制。

{{< caution >}}
<!--
Making this change also allows any hostile party to then send
health-check requests that match this FlowSchema, at any volume they
like.  If you have a web traffic filter or similar external security
mechanism to protect your cluster's API server from general internet
traffic, you can configure rules to block any health check requests
that originate from outside your cluster.
-->
进行此更改后，任何敌对方都可以发送与此 FlowSchema 匹配的任意数量的健康检查请求。
如果你有 Web 流量过滤器或类似的外部安全机制保护集群的 API 服务器免受常规网络流量的侵扰，
则可以配置规则，阻止所有来自集群外部的健康检查请求。
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
## 问题诊断    {#diagnostics}

启用了 APF 的 API 服务器，它每个 HTTP 响应都有两个额外的 HTTP 头：
`X-Kubernetes-PF-FlowSchema-UID` 和 `X-Kubernetes-PF-PriorityLevel-UID`，
注意与请求匹配的 FlowSchema 和已分配的优先级。
如果请求用户没有查看这些对象的权限，则这些 HTTP 头中将不包含 API 对象的名称，
因此在调试时，你可以使用类似如下的命令：

```shell
kubectl get flowschemas -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
kubectl get prioritylevelconfigurations -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
```

<!--
to get a mapping of UIDs to names for both FlowSchemas and
PriorityLevelConfigurations.
-->
来获取 UID 到 FlowSchema 的名称和 UID 到 PriorityLevelConfiguration 的名称的映射。

<!--
## Observability

### Metrics
-->
## 可观察性    {#observability}

### 指标    {#metrics}

{{< note >}}
<!--
In versions of Kubernetes before v1.20, the labels `flow_schema` and
`priority_level` were inconsistently named `flowSchema` and `priorityLevel`,
respectively. If you're running Kubernetes versions v1.19 and earlier, you
should refer to the documentation for your version.
-->
在 Kubernetes v1.20 之前的版本中，标签 `flow_schema` 和 `priority_level`
的名称有时被写作 `flowSchema` 和 `priorityLevel`，即存在不一致的情况。
如果你在运行 Kubernetes v1.19 或者更早版本，你需要参考你所使用的集群版本对应的文档。
{{< /note >}}

<!--
When you enable the API Priority and Fairness feature, the kube-apiserver
exports additional metrics. Monitoring these can help you determine whether your
configuration is inappropriately throttling important traffic, or find
poorly-behaved workloads that may be harming system health.
-->
当你开启了 APF 后，kube-apiserver 会暴露额外指标。
监视这些指标有助于判断你的配置是否不当地限制了重要流量，
或者发现可能会损害系统健康的，行为不良的工作负载。

<!--
* `apiserver_flowcontrol_rejected_requests_total` is a counter vector
  (cumulative since server start) of requests that were rejected,
  broken down by the labels `flow_schema` (indicating the one that
  matched the request), `priority_level` (indicating the one to which
  the request was assigned), and `reason`.  The `reason` label will be
  one of the following values:
-->
* `apiserver_flowcontrol_rejected_requests_total` 是一个计数器向量，
  记录被拒绝的请求数量（自服务器启动以来累计值），
  由标签 `flow_chema`（表示与请求匹配的 FlowSchema）、`priority_level`
  （表示分配给请该求的优先级）和 `reason` 来区分。
  `reason` 标签将是以下值之一：

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
  * `queue-full`，表明已经有太多请求排队
  * `concurrency-limit`，表示将 PriorityLevelConfiguration 配置为
    `Reject` 而不是 `Queue`，或者
  * `time-out`，表示在其排队时间超期的请求仍在队列中。
  * `cancelled`，表示该请求未被清除锁定，已从队列中移除。

<!--
* `apiserver_flowcontrol_dispatched_requests_total` is a counter
  vector (cumulative since server start) of requests that began
  executing, broken down by `flow_schema` and `priority_level`.
-->
* `apiserver_flowcontrol_dispatched_requests_total` 是一个计数器向量，
  记录开始执行的请求数量（自服务器启动以来的累积值），
  由 `flow_schema` 和 `priority_level` 来区分。


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
* `apiserver_current_inqueue_requests` 是一个表向量，
  记录最近排队请求数量的高水位线，
  由标签 `request_kind` 分组，标签的值为 `mutating` 或 `readOnly`。
  这些高水位线表示在最近一秒钟内看到的最大数字。
  它们补充说明了老的表向量 `apiserver_current_inflight_requests`
  （该量保存了最后一个窗口中，正在处理的请求数量的高水位线）。

<!--
* `apiserver_flowcontrol_read_vs_write_current_requests` is a
  histogram vector of observations, made at the end of every
  nanosecond, of the number of requests broken down by the labels
  `phase` (which takes on the values `waiting` and `executing`) and
  `request_kind` (which takes on the values `mutating` and
  `readOnly`).  Each observed value is a ratio, between 0 and 1, of
  the number of requests divided by the corresponding limit on the
  number of requests (queue volume limit for waiting and concurrency
  limit for executing).
-->
* `apiserver_flowcontrol_read_vs_write_current_requests` 是一个直方图向量，
  在每个纳秒结束时记录请求数量的观察值，由标签 `phase`（取值为 `waiting` 及 `executing`）
  和 `request_kind`（取值为 `mutating` 及 `readOnly`）区分。
  每个观察到的值是一个介于 0 和 1 之间的比值，计算方式为请求数除以该请求数的对应限制
  （等待的队列长度限制和执行所用的并发限制）。

<!--
* `apiserver_flowcontrol_current_inqueue_requests` is a gauge vector
  holding the instantaneous number of queued (not executing) requests,
  broken down by `priority_level` and `flow_schema`.
-->
* `apiserver_flowcontrol_current_inqueue_requests` 是一个表向量，
  记录包含排队中的（未执行）请求的瞬时数量，
  由 `priority_level` 和 `flow_schema` 区分。

<!--
* `apiserver_flowcontrol_current_executing_requests` is a gauge vector
  holding the instantaneous number of executing (not waiting in a
  queue) requests, broken down by `priority_level` and `flow_schema`.
-->
* `apiserver_flowcontrol_current_executing_requests` 是一个表向量，
  记录包含执行中（不在队列中等待）请求的瞬时数量，
  由 `priority_level` 和 `flow_schema` 进一步区分。

<!-- 
* `apiserver_flowcontrol_request_concurrency_in_use` is a gauge vector
  holding the instantaneous number of occupied seats, broken down by
  `priority_level` and `flow_schema`.
-->
* `apiserver_flowcontrol_request_concurrency_in_use` 是一个规范向量，
  包含占用座位的瞬时数量，由 `priority_level` 和 `flow_schema` 进一步区分。

<!--
* `apiserver_flowcontrol_priority_level_request_utilization` is a
  histogram vector of observations, made at the end of each
  nanosecond, of the number of requests broken down by the labels
  `phase` (which takes on the values `waiting` and `executing`) and
  `priority_level`.  Each observed value is a ratio, between 0 and 1,
  of a number of requests divided by the corresponding limit on the
  number of requests (queue volume limit for waiting and concurrency
  limit for executing).
-->
* `apiserver_flowcontrol_priority_level_request_utilization` 是一个直方图向量，
  在每个纳秒结束时记录请求数量的观察值，
  由标签 `phase`（取值为 `waiting` 及 `executing`）和 `priority_level` 区分。
  每个观察到的值是一个介于 0 和 1 之间的比值，计算方式为请求数除以该请求数的对应限制
  （等待的队列长度限制和执行所用的并发限制）。

<!--
* `apiserver_flowcontrol_priority_level_seat_utilization` is a
  histogram vector of observations, made at the end of each
  nanosecond, of the utilization of a priority level's concurrency
  limit, broken down by `priority_level`.  This utilization is the
  fraction (number of seats occupied) / (concurrency limit).  This
  metric considers all stages of execution (both normal and the extra
  delay at the end of a write to cover for the corresponding
  notification work) of all requests except WATCHes; for those it
  considers only the initial stage that delivers notifications of
  pre-existing objects.  Each histogram in the vector is also labeled
  with `phase: executing` (there is no seat limit for the waiting
  phase).
-->
* `apiserver_flowcontrol_priority_level_seat_utilization` 是一个直方图向量，
  在每个纳秒结束时记录某个优先级并发度限制利用率的观察值，由标签 `priority_level` 区分。
  此利用率是一个分数：（占用的席位数）/（并发限制）。
  此指标考虑了除 WATCH 之外的所有请求的所有执行阶段（包括写入结束时的正常延迟和额外延迟，
  以覆盖相应的通知操作）；对于 WATCH 请求，只考虑传递预先存在对象通知的初始阶段。
  该向量中的每个直方图也带有 `phase: executing`（等待阶段没有席位限制）的标签。

<!--
* `apiserver_flowcontrol_request_queue_length_after_enqueue` is a
  histogram vector of queue lengths for the queues, broken down by
  `priority_level` and `flow_schema`, as sampled by the enqueued requests.
  Each request that gets queued contributes one sample to its histogram,
  reporting the length of the queue immediately after the request was added.
  Note that this produces different statistics than an unbiased survey would.
-->
* `apiserver_flowcontrol_request_queue_length_after_enqueue` 是一个直方图向量，
  记录请求队列的长度，由 `priority_level` 和 `flow_schema` 进一步区分。
  每个排队中的请求都会为其直方图贡献一个样本，并在添加请求后立即上报队列的长度。
  请注意，这样产生的统计数据与无偏调查不同。

  {{< note >}}
  <!--
  An outlier value in a histogram here means it is likely that a single flow
  (i.e., requests by one user or for one namespace, depending on
  configuration) is flooding the API server, and being throttled. By contrast,
  if one priority level's histogram shows that all queues for that priority
  level are longer than those for other priority levels, it may be appropriate
  to increase that PriorityLevelConfiguration's concurrency shares.
  -->
  直方图中的离群值在这里表示单个流（即，一个用户或一个名字空间的请求，
  具体取决于配置）正在疯狂地向 API 服务器发请求，并受到限制。
  相反，如果一个优先级的直方图显示该优先级的所有队列都比其他优先级的队列长，
  则增加 PriorityLevelConfiguration 的并发份额是比较合适的。
  {{< /note >}}

<!--
* `apiserver_flowcontrol_request_concurrency_limit` is the same as
  `apiserver_flowcontrol_nominal_limit_seats`.  Before the
  introduction of concurrency borrowing between priority levels, this
  was always equal to `apiserver_flowcontrol_current_limit_seats`
  (which did not exist as a distinct metric).
-->
* `apiserver_flowcontrol_request_concurrency_limit` 与
  `apiserver_flowcontrol_nominal_limit_seats` 相同。在优先级之间引入并发度借用之前，
  此字段始终等于 `apiserver_flowcontrol_current_limit_seats`
  （它过去不作为一个独立的指标存在）。

<!--
* `apiserver_flowcontrol_nominal_limit_seats` is a gauge vector
  holding each priority level's nominal concurrency limit, computed
  from the API server's total concurrency limit and the priority
  level's configured nominal concurrency shares.
-->
* `apiserver_flowcontrol_nominal_limit_seats` 是一个表向量，包含每个优先级的额定并发度限制，
  指标值根据 API 服务器的总并发度限制和各优先级所配置的额定并发度份额计算得出。

<!--
* `apiserver_flowcontrol_lower_limit_seats` is a gauge vector holding
  the lower bound on each priority level's dynamic concurrency limit.
-->
* `apiserver_flowcontrol_lower_limit_seats` 是一个表向量，包含每个优先级的动态并发度限制的下限。

<!--
* `apiserver_flowcontrol_upper_limit_seats` is a gauge vector holding
  the upper bound on each priority level's dynamic concurrency limit.
-->
* `apiserver_flowcontrol_upper_limit_seats` 是一个表向量，包含每个优先级的动态并发度限制的上限。

<!--
* `apiserver_flowcontrol_demand_seats` is a histogram vector counting
  observations, at the end of every nanosecond, of each priority
  level's ratio of (seat demand) / (nominal concurrency limit).  A
  priority level's seat demand is the sum, over both queued requests
  and those in the initial phase of execution, of the maximum of the
  number of seats occupied in the request's initial and final
  execution phases.
-->
* `apiserver_flowcontrol_demand_seats` 是一个直方图向量，
  统计每纳秒结束时每个优先级的（席位需求）/（额定并发限制）比率的观察值。
  某优先级的席位需求是针对排队的请求和初始执行阶段的请求，在请求的初始和最终执行阶段占用的最大席位数之和。

<!--
* `apiserver_flowcontrol_demand_seats_high_watermark` is a gauge vector
  holding, for each priority level, the maximum seat demand seen
  during the last concurrency borrowing adjustment period.
-->
* `apiserver_flowcontrol_demand_seats_high_watermark` 是一个表向量，
  为每个优先级包含了上一个并发度借用调整期间所观察到的最大席位需求。

<!--
* `apiserver_flowcontrol_demand_seats_average` is a gauge vector
  holding, for each priority level, the time-weighted average seat
  demand seen during the last concurrency borrowing adjustment period.
-->
* `apiserver_flowcontrol_demand_seats_average` 是一个表向量，
  为每个优先级包含了上一个并发度借用调整期间所观察到的时间加权平均席位需求。

<!--
* `apiserver_flowcontrol_demand_seats_stdev` is a gauge vector
  holding, for each priority level, the time-weighted population
  standard deviation of seat demand seen during the last concurrency
  borrowing adjustment period.
-->
* `apiserver_flowcontrol_demand_seats_stdev` 是一个表向量，
  为每个优先级包含了上一个并发度借用调整期间所观察到的席位需求的时间加权总标准偏差。

<!--
* `apiserver_flowcontrol_demand_seats_smoothed` is a gauge vector
  holding, for each priority level, the smoothed enveloped seat demand
  determined at the last concurrency adjustment.
-->
* `apiserver_flowcontrol_demand_seats_smoothed` 是一个表向量，
  为每个优先级包含了上一个并发度调整期间确定的平滑包络席位需求。

<!--
* `apiserver_flowcontrol_target_seats` is a gauge vector holding, for
  each priority level, the concurrency target going into the borrowing
  allocation problem.
-->
* `apiserver_flowcontrol_target_seats` 是一个表向量，
  包含每个优先级触发借用分配问题的并发度目标值。

<!--
* `apiserver_flowcontrol_seat_fair_frac` is a gauge holding the fair
  allocation fraction determined in the last borrowing adjustment.
-->
* `apiserver_flowcontrol_seat_fair_frac` 是一个表向量，
  包含了上一个借用调整期间确定的公平分配比例。

<!--
* `apiserver_flowcontrol_current_limit_seats` is a gauge vector
  holding, for each priority level, the dynamic concurrency limit
  derived in the last adjustment.
-->
* `apiserver_flowcontrol_current_limit_seats` 是一个表向量，
  包含每个优先级的上一次调整期间得出的动态并发限制。

<!--
* `apiserver_flowcontrol_request_wait_duration_seconds` is a histogram
  vector of how long requests spent queued, broken down by the labels
  `flow_schema`, `priority_level`, and `execute`. The `execute` label
  indicates whether the request has started executing.
-->
* `apiserver_flowcontrol_request_wait_duration_seconds` 是一个直方图向量，
  记录请求排队的时间，
  由标签 `flow_schema`、`priority_level` 和 `execute` 进一步区分。
  标签 `execute` 表示请求是否开始执行。

  {{< note >}}
  <!--
  Since each FlowSchema always assigns requests to a single
  PriorityLevelConfiguration, you can add the histograms for all the
  FlowSchemas for one priority level to get the effective histogram for
  requests assigned to that priority level.
  -->
  由于每个 FlowSchema 总会给请求分配 PriorityLevelConfiguration，
  因此你可以为一个优先级添加所有 FlowSchema 的直方图，以获取分配给该优先级的请求的有效直方图。
  {{< /note >}}

<!--
* `apiserver_flowcontrol_request_execution_seconds` is a histogram
  vector of how long requests took to actually execute, broken down by
  `flow_schema` and `priority_level`.
-->
* `apiserver_flowcontrol_request_execution_seconds` 是一个直方图向量，
  记录请求实际执行需要花费的时间，
  由标签 `flow_schema` 和 `priority_level` 进一步区分。

<!--
* `apiserver_flowcontrol_watch_count_samples` is a histogram vector of
  the number of active WATCH requests relevant to a given write,
  broken down by `flow_schema` and `priority_level`.
-->
* `apiserver_flowcontrol_watch_count_samples` 是一个直方图向量，
  记录给定写的相关活动 WATCH 请求数量，
  由标签 `flow_schema` 和 `priority_level` 进一步区分。

<!--
* `apiserver_flowcontrol_work_estimated_seats` is a histogram vector
  of the number of estimated seats (maximum of initial and final stage
  of execution) associated with requests, broken down by `flow_schema`
  and `priority_level`.
-->
* `apiserver_flowcontrol_work_estimated_seats` 是一个直方图向量，
  记录与估计席位（最初阶段和最后阶段的最多人数）相关联的请求数量，
  由标签 `flow_schema` 和 `priority_level` 进一步区分。

<!--
* `apiserver_flowcontrol_request_dispatch_no_accommodation_total` is a
  counter vector of the number of events that in principle could have led
  to a request being dispatched but did not, due to lack of available
  concurrency, broken down by `flow_schema` and `priority_level`.
-->
* `apiserver_flowcontrol_request_dispatch_no_accommodation_total`
  是一个事件数量的计数器，这些事件在原则上可能导致请求被分派，
  但由于并发度不足而没有被分派，
  由标签 `flow_schema` 和 `priority_level` 进一步区分。

<!--
### Debug endpoints

When you enable the API Priority and Fairness feature, the `kube-apiserver`
serves the following additional paths at its HTTP(S) ports.
-->
### 调试端点    {#debug-endpoints}

启用 APF 特性后，kube-apiserver 会在其 HTTP/HTTPS 端口提供以下路径：

<!--
- `/debug/api_priority_and_fairness/dump_priority_levels` - a listing of
  all the priority levels and the current state of each.  You can fetch like this:
-->
- `/debug/api_priority_and_fairness/dump_priority_levels` ——
  所有优先级及其当前状态的列表。你可以这样获取：

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_priority_levels
  ```

  <!--
  The output is similar to this:
  -->
  输出类似于：

  ```none
  PriorityLevelName, ActiveQueues, IsIdle, IsQuiescing, WaitingRequests, ExecutingRequests, DispatchedRequests, RejectedRequests, TimedoutRequests, CancelledRequests
  catch-all,         0,            true,   false,       0,               0,                 1,                  0,                0,                0
  exempt,            <none>,       <none>, <none>,      <none>,          <none>,            <none>,             <none>,           <none>,           <none>
  global-default,    0,            true,   false,       0,               0,                 46,                 0,                0,                0
  leader-election,   0,            true,   false,       0,               0,                 4,                  0,                0,                0
  node-high,         0,            true,   false,       0,               0,                 34,                 0,                0,                0
  system,            0,            true,   false,       0,               0,                 48,                 0,                0,                0
  workload-high,     0,            true,   false,       0,               0,                 500,                0,                0,                0
  workload-low,      0,            true,   false,       0,               0,                 0,                  0,                0,                0
  ```

<!--
- `/debug/api_priority_and_fairness/dump_queues` - a listing of all the
  queues and their current state.  You can fetch like this:
-->
- `/debug/api_priority_and_fairness/dump_queues` —— 所有队列及其当前状态的列表。
  你可以这样获取：

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_queues
  ```

  <!--
  The output is similar to this:
  -->
  输出类似于：

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
- `/debug/api_priority_and_fairness/dump_requests` —— 当前正在队列中等待的所有请求的列表。
  你可以这样获取：

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_requests
  ```

  <!--
  The output is similar to this:
  -->
  输出类似于：

  ```none
  PriorityLevelName, FlowSchemaName, QueueIndex, RequestIndexInQueue, FlowDistingsher,       ArriveTime,
  exempt,            <none>,         <none>,     <none>,              <none>,                <none>,
  system,            system-nodes,   12,         0,                   system:node:127.0.0.1, 2020-07-23T15:26:57.179170694Z,
  ```

  <!--
  In addition to the queued requests, the output includes one phantom line
  for each priority level that is exempt from limitation.
  -->
  针对每个优先级别，输出中还包含一条虚拟记录，对应豁免限制。

  <!--
  You can get a more detailed listing with a command like this:
  -->
  你可以使用以下命令获得更详细的清单：

  ```shell
  kubectl get --raw '/debug/api_priority_and_fairness/dump_requests?includeRequestDetails=1'
  ```

  <!--
  The output is similar to this:
  -->
  输出类似于：

  ```none
  PriorityLevelName, FlowSchemaName, QueueIndex, RequestIndexInQueue, FlowDistingsher,       ArriveTime,                     UserName,              Verb,   APIPath,                                                     Namespace, Name,   APIVersion, Resource, SubResource,
  system,            system-nodes,   12,         0,                   system:node:127.0.0.1, 2020-07-23T15:31:03.583823404Z, system:node:127.0.0.1, create, /api/v1/namespaces/scaletest/configmaps,
  system,            system-nodes,   12,         1,                   system:node:127.0.0.1, 2020-07-23T15:31:03.594555947Z, system:node:127.0.0.1, create, /api/v1/namespaces/scaletest/configmaps,
  ```

<!--
### Debug logging

At `-v=3` or more verbose the server outputs an httplog line for every
request, and it includes the following attributes.
-->
### 调试日志生成行为  {#debug-logging}

在 `-v=3` 或更详细的情况下，服务器会为每个请求输出一行 httplog，它包括以下属性。

<!--
- `apf_fs`: the name of the flow schema to which the request was classified.
- `apf_pl`: the name of the priority level for that flow schema.
- `apf_iseats`: the number of seats determined for the initial
  (normal) stage of execution of the request.
- `apf_fseats`: the number of seats determined for the final stage of
  execution (accounting for the associated WATCH notifications) of the
  request.
- `apf_additionalLatency`: the duration of the final stage of
  execution of the request.
-->
- `apf_fs`：请求被分类到的 FlowSchema 的名称。
- `apf_pl`：该 FlowSchema 的优先级名称。
- `apf_iseats`：为请求执行的初始（正常）阶段确定的席位数量。
- `apf_fseats`：为请求的最后执行阶段（考虑关联的 WATCH 通知）确定的席位数量。
- `apf_additionalLatency`：请求执行最后阶段的持续时间。

<!--
At higher levels of verbosity there will be log lines exposing details
of how APF handled the request, primarily for debugging purposes.
-->
在更高级别的精细度下，将有日志行揭示 APF 如何处理请求的详细信息，主要用于调试目的。

<!--
### Response headers

APF adds the following two headers to each HTTP response message.

- `X-Kubernetes-PF-FlowSchema-UID` holds the UID of the FlowSchema
  object to which the corresponding request was classified.
- `X-Kubernetes-PF-PriorityLevel-UID` holds the UID of the
  PriorityLevelConfiguration object associated with that FlowSchema.
-->
### 响应头  {#response-headers}

APF 将以下两个头添加到每个 HTTP 响应消息中。

- `X-Kubernetes-PF-FlowSchema-UID` 保存相应请求被分类到的 FlowSchema 对象的 UID。
- `X-Kubernetes-PF-PriorityLevel-UID` 保存与该 FlowSchema 关联的 PriorityLevelConfiguration 对象的 UID。

## {{% heading "whatsnext" %}}

<!--
For background information on design details for API priority and fairness, see
the [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness).
You can make suggestions and feature requests via [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery) 
or the feature's [slack channel](https://kubernetes.slack.com/messages/api-priority-and-fairness).
-->
有关 API 优先级和公平性的设计细节的背景信息，
请参阅[增强提案](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness)。
你可以通过 [SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery/)
或特性的 [Slack 频道](https://kubernetes.slack.com/messages/api-priority-and-fairness/)提出建议和特性请求。
