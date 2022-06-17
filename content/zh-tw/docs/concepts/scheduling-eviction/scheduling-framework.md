---
title: 排程框架
content_type: concept
weight: 90
---

<!--
---
reviewers:
- ahg-g
title: Scheduling Framework
content_type: concept
weight: 90
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="1.19" state="stable" >}}

<!--
The scheduling framework is a pluggable architecture for the Kubernetes scheduler.
It adds a new set of "plugin" APIs to the existing scheduler. Plugins are compiled into the scheduler. The APIs allow most scheduling features to be implemented as plugins, while keeping the
scheduling "core" lightweight and maintainable. Refer to the [design proposal of the
scheduling framework][kep] for more technical information on the design of the
framework.
-->

排程框架是面向 Kubernetes 排程器的一種外掛架構，
它為現有的排程器添加了一組新的“外掛” API。外掛會被編譯到排程器之中。
這些 API 允許大多數排程功能以外掛的形式實現，同時使排程“核心”保持簡單且可維護。
請參考[排程框架的設計提案](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/624-scheduling-framework/README.md)
獲取框架設計的更多技術資訊。

<!-- body -->

<!--
# Framework workflow
-->
# 框架工作流程

<!--
The Scheduling Framework defines a few extension points. Scheduler plugins
register to be invoked at one or more extension points. Some of these plugins
can change the scheduling decisions and some are informational only.
-->
排程框架定義了一些擴充套件點。排程器外掛註冊後在一個或多個擴充套件點處被呼叫。
這些外掛中的一些可以改變排程決策，而另一些僅用於提供資訊。

<!--
Each attempt to schedule one Pod is split into two phases, the **scheduling
cycle** and the **binding cycle**.
-->
每次排程一個 Pod 的嘗試都分為兩個階段，即 **排程週期** 和 **繫結週期**。

<!--
## Scheduling Cycle & Binding Cycle
-->
## 排程週期和繫結週期

<!--
The scheduling cycle selects a node for the Pod, and the binding cycle applies
that decision to the cluster. Together, a scheduling cycle and binding cycle are
referred to as a "scheduling context".
-->
排程週期為 Pod 選擇一個節點，繫結週期將該決策應用於叢集。
排程週期和繫結週期一起被稱為“排程上下文”。

<!--
Scheduling cycles are run serially, while binding cycles may run concurrently.
-->
排程週期是序列執行的，而繫結週期可能是同時執行的。

<!--
A scheduling or binding cycle can be aborted if the Pod is determined to
be unschedulable or if there is an internal error. The Pod will be returned to
the queue and retried.
-->
如果確定 Pod 不可排程或者存在內部錯誤，則可以終止排程週期或繫結週期。
Pod 將返回佇列並重試。

<!--
## Extension points
-->
## 擴充套件點

<!--
The following picture shows the scheduling context of a Pod and the extension
points that the scheduling framework exposes. In this picture "Filter" is
equivalent to "Predicate" and "Scoring" is equivalent to "Priority function".
-->
下圖顯示了一個 Pod 的排程上下文以及排程框架公開的擴充套件點。
在此圖片中，“過濾器”等同於“斷言”，“評分”相當於“優先順序函式”。

<!--
One plugin may register at multiple extension points to perform more complex or
stateful tasks.
-->
一個外掛可以在多個擴充套件點處註冊，以執行更復雜或有狀態的任務。

<!--
{{< figure src="/images/docs/scheduling-framework-extensions.png" title="scheduling framework extension points" class="diagram-large">}}
-->
{{< figure src="/images/docs/scheduling-framework-extensions.png" title="排程框架擴充套件點" class="diagram-large">}}

<!--
### QueueSort {#queue-sort}
-->
### 佇列排序 {#queue-sort}

<!--
These plugins are used to sort Pods in the scheduling queue. A queue sort plugin
essentially provides a `less(Pod1, Pod2)` function. Only one queue sort
plugin may be enabled at a time.
-->
這些外掛用於對排程佇列中的 Pod 進行排序。
佇列排序外掛本質上提供 `less(Pod1, Pod2)` 函式。
一次只能啟動一個佇列外掛。

<!--
### PreFilter {#pre-filter}
-->
### PreFilter {#pre-filter}

<!--
These plugins are used to pre-process info about the Pod, or to check certain
conditions that the cluster or the Pod must meet. If a PreFilter plugin returns
an error, the scheduling cycle is aborted.
-->
這些外掛用於預處理 Pod 的相關資訊，或者檢查叢集或 Pod 必須滿足的某些條件。
如果 PreFilter 外掛返回錯誤，則排程週期將終止。

<!--
### Filter
-->
### Filter

<!--
These plugins are used to filter out nodes that cannot run the Pod. For each
node, the scheduler will call filter plugins in their configured order. If any
filter plugin marks the node as infeasible, the remaining plugins will not be
called for that node. Nodes may be evaluated concurrently.
-->
這些外掛用於過濾出不能執行該 Pod 的節點。對於每個節點，
排程器將按照其配置順序呼叫這些過濾外掛。如果任何過濾外掛將節點標記為不可行，
則不會為該節點呼叫剩下的過濾外掛。節點可以被同時進行評估。

<!--
### PostFilter {#post-filter}
-->
### PostFilter  {#post-filter}

<!--
These plugins are called after Filter phase, but only when no feasible nodes
were found for the pod. Plugins are called in their configured order. If
any postFilter plugin marks the node as `Schedulable`, the remaining plugins
will not be called. A typical PostFilter implementation is preemption, which
tries to make the pod schedulable by preempting other Pods.
-->
這些外掛在 Filter 階段後呼叫，但僅在該 Pod 沒有可行的節點時呼叫。
外掛按其配置的順序呼叫。如果任何 PostFilter 外掛標記節點為“Schedulable”，
則其餘的外掛不會呼叫。典型的 PostFilter 實現是搶佔，試圖透過搶佔其他 Pod
的資源使該 Pod 可以排程。

<!--
### PreScore {#pre-score}
 -->
### PreScore {#pre-score}

<!--
These plugins are used to perform "pre-scoring" work, which generates a sharable
state for Score plugins to use. If a PreScore plugin returns an error, the
scheduling cycle is aborted.
 -->
這些外掛用於執行 “前置評分（pre-scoring）” 工作，即生成一個可共享狀態供 Score 外掛使用。
如果 PreScore 外掛返回錯誤，則排程週期將終止。

<!--
### Score {#scoring}
 -->
### Score  {#scoring}

<!--
These plugins are used to rank nodes that have passed the filtering phase. The
scheduler will call each scoring plugin for each node. There will be a well
defined range of integers representing the minimum and maximum scores. After the
[NormalizeScore](#normalize-scoring) phase, the scheduler will combine node
scores from all plugins according to the configured plugin weights.
-->
這些外掛用於對透過過濾階段的節點進行排序。排程器將為每個節點呼叫每個評分外掛。
將有一個定義明確的整數範圍，代表最小和最大分數。
在[標準化評分](#normalize-scoring)階段之後，排程器將根據配置的外掛權重
合併所有外掛的節點分數。

<!--
### NormalizeScore {#normalize-scoring}
-->
### NormalizeScore   {#normalize-scoring}

<!--
These plugins are used to modify scores before the scheduler computes a final
ranking of Nodes. A plugin that registers for this extension point will be
called with the [Score](#scoring) results from the same plugin. This is called
once per plugin per scheduling cycle.
-->
這些外掛用於在排程器計算 Node 排名之前修改分數。
在此擴充套件點註冊的外掛被呼叫時會使用同一外掛的 [Score](#scoring) 結果。
每個外掛在每個排程週期呼叫一次。

<!--
For example, suppose a plugin `BlinkingLightScorer` ranks Nodes based on how
many blinking lights they have.
-->
例如，假設一個 `BlinkingLightScorer` 外掛基於具有的閃爍指示燈數量來對節點進行排名。

```go
func ScoreNode(_ *v1.pod, n *v1.Node) (int, error) {
   return getBlinkingLightCount(n)
}
```

<!--
However, the maximum count of blinking lights may be small compared to
`NodeScoreMax`. To fix this, `BlinkingLightScorer` should also register for this
extension point.
-->
然而，最大的閃爍燈個數值可能比 `NodeScoreMax` 小。要解決這個問題，
`BlinkingLightScorer` 外掛還應該註冊該擴充套件點。

```go
func NormalizeScores(scores map[string]int) {
   highest := 0
   for _, score := range scores {
      highest = max(highest, score)
   }
   for node, score := range scores {
      scores[node] = score*NodeScoreMax/highest
   }
}
```

<!--
If any NormalizeScore plugin returns an error, the scheduling cycle is
aborted.
-->
如果任何 NormalizeScore 外掛返回錯誤，則排程階段將終止。

<!--
Plugins wishing to perform "pre-reserve" work should use the
NormalizeScore extension point.
-->
{{< note >}}
希望執行“預保留”工作的外掛應該使用 NormalizeScore 擴充套件點。
{{< /note >}}

<!--
### Reserve
-->
### Reserve

<!--
This is an informational extension point. Plugins which maintain runtime state
(aka "stateful plugins") should use this extension point to be notified by the
scheduler when resources on a node are being reserved for a given Pod. This
happens before the scheduler actually binds the Pod to the Node, and it exists
to prevent race conditions while the scheduler waits for the bind to succeed.
-->
Reserve 是一個資訊性的擴充套件點。
管理執行時狀態的外掛（也成為“有狀態外掛”）應該使用此擴充套件點，以便
排程器在節點給指定 Pod 預留了資源時能夠通知該外掛。
這是在排程器真正將 Pod 繫結到節點之前發生的，並且它存在是為了防止
在排程器等待繫結成功時發生競爭情況。

<!--
This is the last step in a scheduling cycle. Once a Pod is in the reserved
state, it will either trigger [Unreserve](#unreserve) plugins (on failure) or
[PostBind](#post-bind) plugins (on success) at the end of the binding cycle.
-->
這個是排程週期的最後一步。
一旦 Pod 處於保留狀態，它將在繫結週期結束時觸發 [Unreserve](#unreserve) 外掛
（失敗時）或 [PostBind](#post-bind) 外掛（成功時）。

<!--
### Permit
-->
### Permit

<!--
_Permit_ plugins are invoked at the end of the scheduling cycle for each Pod, to
prevent or delay the binding to the candidate node. A permit plugin can do one of
the three things:
-->
_Permit_ 外掛在每個 Pod 排程週期的最後呼叫，用於防止或延遲 Pod 的繫結。
一個允許外掛可以做以下三件事之一：

<!--
1.  **approve** \
    Once all Permit plugins approve a Pod, it is sent for binding.
-->
1.  **批准** \
    一旦所有 Permit 外掛批准 Pod 後，該 Pod 將被髮送以進行繫結。

<!--
1.  **deny** \
    If any Permit plugin denies a Pod, it is returned to the scheduling queue.
    This will trigger [Unreserve](#unreserve) plugins.
-->
1.  **拒絕** \
    如果任何 Permit 外掛拒絕 Pod，則該 Pod 將被返回到排程佇列。
    這將觸發[Unreserve](#unreserve) 外掛。

<!--
1.  **wait** (with a timeout) \
    If a Permit plugin returns "wait", then the Pod is kept in an internal "waiting"
    Pods list, and the binding cycle of this Pod starts but directly blocks until it
    gets [approved](#frameworkhandle). If a timeout occurs, **wait** becomes **deny**
    and the Pod is returned to the scheduling queue, triggering [Unreserve](#unreserve)
    plugins.
-->
1.  **等待**（帶有超時） \
    如果一個 Permit 外掛返回 “等待” 結果，則 Pod 將保持在一個內部的 “等待中”
    的 Pod 列表，同時該 Pod 的繫結週期啟動時即直接阻塞直到得到
    [批准](#frameworkhandle)。如果超時發生，**等待** 變成 **拒絕**，並且 Pod
    將返回排程佇列，從而觸發 [Unreserve](#unreserve) 外掛。


<!--
While any plugin can access the list of "waiting" Pods and approve them
(see [`FrameworkHandle`](https://git.k8s.io/enhancements/keps/sig-scheduling/624-scheduling-framework#frameworkhandle)), we expect only the permit
plugins to approve binding of reserved Pods that are in "waiting" state. Once a Pod
is approved, it is sent to the [PreBind](#pre-bind) phase.
 -->
{{< note >}}
儘管任何外掛可以訪問 “等待中” 狀態的 Pod 列表並批准它們
(檢視 [`FrameworkHandle`](https://git.k8s.io/enhancements/keps/sig-scheduling/624-scheduling-framework#frameworkhandle))。
我們期望只有允許外掛可以批准處於 “等待中” 狀態的預留 Pod 的繫結。
一旦 Pod 被批准了，它將傳送到 [PreBind](#pre-bind) 階段。
{{< /note >}}

<!--
### Pre-bind {#pre-bind}
-->
### PreBind  {#pre-bind}

<!--
These plugins are used to perform any work required before a Pod is bound. For
example, a pre-bind plugin may provision a network volume and mount it on the
target node before allowing the Pod to run there.
-->
這些外掛用於執行 Pod 繫結前所需的所有工作。
例如，一個 PreBind 外掛可能需要製備網路卷並且在允許 Pod 執行在該節點之前
將其掛載到目標節點上。

<!--
If any PreBind plugin returns an error, the Pod is [rejected](#unreserve) and
returned to the scheduling queue.
-->
如果任何 PreBind 外掛返回錯誤，則 Pod 將被 [拒絕](#unreserve) 並且
退回到排程佇列中。

<!--
### Bind
-->
### Bind

<!--
These plugins are used to bind a Pod to a Node. Bind plugins will not be called
until all PreBind plugins have completed. Each bind plugin is called in the
configured order. A bind plugin may choose whether or not to handle the given
Pod. If a bind plugin chooses to handle a Pod, **the remaining bind plugins are
skipped**.
-->
Bind 外掛用於將 Pod 繫結到節點上。直到所有的 PreBind 外掛都完成，Bind 外掛才會被呼叫。
各 Bind 外掛按照配置順序被呼叫。Bind 外掛可以選擇是否處理指定的 Pod。
如果某 Bind 外掛選擇處理某 Pod，**剩餘的 Bind 外掛將被跳過**。

<!--
### PostBind {#post-bind}
-->
### PostBind  {#post-bind}

<!--
This is an informational extension point. Post-bind plugins are called after a
Pod is successfully bound. This is the end of a binding cycle, and can be used
to clean up associated resources.
-->
這是個資訊性的擴充套件點。
PostBind 外掛在 Pod 成功繫結後被呼叫。這是繫結週期的結尾，可用於清理相關的資源。

<!--
### Unreserve
-->
### Unreserve

<!--
This is an informational extension point. If a Pod was reserved and then
rejected in a later phase, then unreserve plugins will be notified. Unreserve
plugins should clean up state associated with the reserved Pod.
-->
這是個資訊性的擴充套件點。
如果 Pod 被保留，然後在後面的階段中被拒絕，則 Unreserve 外掛將被通知。
Unreserve 外掛應該清楚保留 Pod 的相關狀態。

<!--
Plugins that use this extension point usually should also use
[Reserve](#reserve).
-->
使用此擴充套件點的外掛通常也使用 [Reserve](#reserve)。

<!--
## Plugin API
-->
## 外掛 API

<!--
There are two steps to the plugin API. First, plugins must register and get
configured, then they use the extension point interfaces. Extension point
interfaces have the following form.
-->
外掛 API 分為兩個步驟。首先，外掛必須完成註冊並配置，然後才能使用擴充套件點介面。
擴充套件點介面具有以下形式。

```go
type Plugin interface {
   Name() string
}

type QueueSortPlugin interface {
   Plugin
   Less(*v1.pod, *v1.pod) bool
}

type PreFilterPlugin interface {
   Plugin
   PreFilter(context.Context, *framework.CycleState, *v1.pod) error
}

// ...
```

<!--
# Plugin Configuration
-->
# 外掛配置

<!--
You can enable or disable plugins in the scheduler configuration. If you are using
Kubernetes v1.18 or later, most scheduling
[plugins](/docs/reference/scheduling/config/#scheduling-plugins) are in use and
enabled by default.
 -->
你可以在排程器配置中啟用或禁用外掛。
如果你在使用 Kubernetes v1.18 或更高版本，大部分排程
[外掛](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)
都在使用中且預設啟用。

<!--
In addition to default plugins, you can also implement your own scheduling
plugins and get them configured along with default plugins. You can visit
[scheduler-plugins](https://github.com/kubernetes-sigs/scheduler-plugins) for more details.
 -->
除了預設的外掛，你還可以實現自己的排程外掛並且將它們與預設外掛一起配置。
你可以訪問 [scheduler-plugins](https://github.com/kubernetes-sigs/scheduler-plugins)
瞭解更多資訊。

<!--
If you are using Kubernetes v1.18 or later, you can configure a set of plugins as
a scheduler profile and then define multiple profiles to fit various kinds of workload.
Learn more at [multiple profiles](/docs/reference/scheduling/config/#multiple-profiles).
 -->
如果你正在使用 Kubernetes v1.18 或更高版本，你可以將一組外掛設定為
一個排程器配置檔案，然後定義不同的配置檔案來滿足各類工作負載。
瞭解更多關於[多配置檔案](/zh-cn/docs/reference/scheduling/config/#multiple-profiles)。


