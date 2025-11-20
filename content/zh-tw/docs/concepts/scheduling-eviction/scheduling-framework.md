---
title: 調度框架
content_type: concept
weight: 60
---
<!--
reviewers:
- ahg-g
title: Scheduling Framework
content_type: concept
weight: 60
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

<!--
The _scheduling framework_ is a pluggable architecture for the Kubernetes scheduler.
It consists of a set of "plugin" APIs that are compiled directly into the scheduler.
These APIs allow most scheduling features to be implemented as plugins,
while keeping the scheduling "core" lightweight and maintainable. Refer to the
[design proposal of the scheduling framework][kep] for more technical information on
the design of the framework.
-->
**調度框架**是面向 Kubernetes 調度器的一種插件架構，
它由一組直接編譯到調度程式中的“插件” API 組成。
這些 API 允許大多數調度功能以插件的形式實現，同時使調度“核心”保持簡單且可維護。
請參考[調度框架的設計提案](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/624-scheduling-framework/README.md)
獲取框架設計的更多技術資訊。

[kep]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/624-scheduling-framework/README.md

<!-- body -->

<!--
## Framework workflow
-->
## 框架工作流程   {#framework-workflow}

<!--
The Scheduling Framework defines a few extension points. Scheduler plugins
register to be invoked at one or more extension points. Some of these plugins
can change the scheduling decisions and some are informational only.
-->
調度框架定義了一些擴展點。調度器插件註冊後在一個或多個擴展點處被調用。
這些插件中的一些可以改變調度決策，而另一些僅用於提供資訊。

<!--
Each attempt to schedule one Pod is split into two phases, the
**scheduling cycle** and the **binding cycle**.
-->
每次調度一個 Pod 的嘗試都分爲兩個階段，即**調度週期**和**綁定週期**。

<!--
### Scheduling Cycle & Binding Cycle
-->
### 調度週期和綁定週期   {#scheduling-cycle-and-binding-cycle}

<!--
The scheduling cycle selects a node for the Pod, and the binding cycle applies
that decision to the cluster. Together, a scheduling cycle and binding cycle are
referred to as a "scheduling context".
-->
調度週期爲 Pod 選擇一個節點，綁定週期將該決策應用於叢集。
調度週期和綁定週期一起被稱爲“調度上下文”。

<!--
Scheduling cycles are run serially, while binding cycles may run concurrently.
-->
調度週期是串行運行的，而綁定週期可能是同時運行的。

<!--
A scheduling or binding cycle can be aborted if the Pod is determined to
be unschedulable or if there is an internal error. The Pod will be returned to
the queue and retried.
-->
如果確定 Pod 不可調度或者存在內部錯誤，則可以終止調度週期或綁定週期。
Pod 將返回隊列並重試。

<!--
## Interfaces
-->
## 介面   {#interfaces}

<!--
The following picture shows the scheduling context of a Pod and the interfaces
that the scheduling framework exposes.
-->
下圖顯示了一個 Pod 的調度上下文以及調度框架公開的介面。

<!--
One plugin may implement multiple interfaces to perform more complex or
stateful tasks.
-->
一個插件可能實現多個介面，以執行更爲複雜或有狀態的任務。

<!--
Some interfaces match the scheduler extension points which can be configured through
[Scheduler Configuration](/docs/reference/scheduling/config/#extension-points).
-->
某些介面與可以通過[調度器設定](/zh-cn/docs/reference/scheduling/config/#extension-points)來設置的調度器擴展點匹配。

<!--
{{< figure src="/images/docs/scheduling-framework-extensions.png" title="scheduling framework extension points" class="diagram-large">}}
-->
{{< figure src="/images/docs/scheduling-framework-extensions.png" title="調度框架擴展點" class="diagram-large">}}

<!--
### PreEnqueue {#pre-enqueue}
-->
### PreEnqueue {#pre-enqueue}

<!--
These plugins are called prior to adding Pods to the internal active queue, where Pods are marked as
ready for scheduling.

Only when all PreEnqueue plugins return `Success`, the Pod is allowed to enter the active queue.
Otherwise, it's placed in the internal unschedulable Pods list, and doesn't get an `Unschedulable` condition.

For more details about how internal scheduler queues work, read
[Scheduling queue in kube-scheduler](https://github.com/kubernetes/community/blob/f03b6d5692bd979f07dd472e7b6836b2dad0fd9b/contributors/devel/sig-scheduling/scheduler_queues.md).
-->
這些插件在將 Pod 被添加到內部活動隊列之前被調用，在此隊列中 Pod 被標記爲準備好進行調度。

只有當所有 PreEnqueue 插件返回 `Success` 時，Pod 才允許進入活動隊列。
否則，它將被放置在內部無法調度的 Pod 列表中，並且不會獲得 `Unschedulable` 狀態。

要了解有關內部調度器隊列如何工作的更多詳細資訊，請閱讀
[kube-scheduler 調度隊列](https://github.com/kubernetes/community/blob/f03b6d5692bd979f07dd472e7b6836b2dad0fd9b/contributors/devel/sig-scheduling/scheduler_queues.md)。

### EnqueueExtension

<!--
EnqueueExtension is the interface where the plugin can control
whether to retry scheduling of Pods rejected by this plugin, based on changes in the cluster.
Plugins that implement PreEnqueue, PreFilter, Filter, Reserve or Permit should implement this interface.
-->
EnqueueExtension 作爲一個介面，插件可以在此介面之上根據叢集中的變化來控制是否重新嘗試調度被此插件拒絕的
Pod。實現 PreEnqueue、PreFilter、Filter、Reserve 或 Permit 的插件應實現此介面。

### QueueingHint

{{< feature-state feature_gate_name="SchedulerQueueingHints" >}}

<!--
QueueingHint is a callback function for deciding whether a Pod can be requeued to the active queue or backoff queue.
It's executed every time a certain kind of event or change happens in the cluster.
When the QueueingHint finds that the event might make the Pod schedulable,
the Pod is put into the active queue or the backoff queue
so that the scheduler will retry the scheduling of the Pod.
-->
QueueingHint 作爲一個回調函數，用於決定是否將 Pod 重新排隊到活躍隊列或回退隊列。
每當叢集中發生某種事件或變化時，此函數就會被執行。
當 QueueingHint 發現事件可能使 Pod 可調度時，Pod 將被放入活躍隊列或回退隊列，
以便調度器可以重新嘗試調度 Pod。

<!--
### QueueSort {#queue-sort}
-->
### 隊列排序 {#queue-sort}

<!--
These plugins are used to sort Pods in the scheduling queue. A queue sort plugin
essentially provides a `Less(Pod1, Pod2)` function. Only one queue sort
plugin may be enabled at a time.
-->
這些插件用於對調度隊列中的 Pod 進行排序。
隊列排序插件本質上提供 `Less(Pod1, Pod2)` 函數。
一次只能啓動一個隊列插件。

<!--
### PreFilter {#pre-filter}
-->
### PreFilter {#pre-filter}

<!--
These plugins are used to pre-process info about the Pod, or to check certain
conditions that the cluster or the Pod must meet. If a PreFilter plugin returns
an error, the scheduling cycle is aborted.
-->
這些插件用於預處理 Pod 的相關資訊，或者檢查叢集或 Pod 必須滿足的某些條件。
如果 PreFilter 插件返回錯誤，則調度週期將終止。

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
這些插件用於過濾出不能運行該 Pod 的節點。對於每個節點，
調度器將按照其設定順序調用這些過濾插件。如果任何過濾插件將節點標記爲不可行，
則不會爲該節點調用剩下的過濾插件。節點可以被同時進行評估。

<!--
### PostFilter {#post-filter}
-->
### PostFilter  {#post-filter}

<!--
These plugins are called after the Filter phase, but only when no feasible nodes
were found for the pod. Plugins are called in their configured order. If
any postFilter plugin marks the node as `Schedulable`, the remaining plugins
will not be called. A typical PostFilter implementation is preemption, which
tries to make the pod schedulable by preempting other Pods.
-->
這些插件在 Filter 階段後調用，但僅在該 Pod 沒有可行的節點時調用。
插件按其設定的順序調用。如果任何 PostFilter 插件標記節點爲 "Schedulable"，
則其餘的插件不會調用。典型的 PostFilter 實現是搶佔，試圖通過搶佔其他 Pod
的資源使該 Pod 可以調度。

<!--
### PreScore {#pre-score}
-->
### PreScore {#pre-score}

<!--
These plugins are used to perform "pre-scoring" work, which generates a sharable
state for Score plugins to use. If a PreScore plugin returns an error, the
scheduling cycle is aborted.
-->
這些插件用於執行“前置評分（pre-scoring）”工作，即生成一個可共享狀態供 Score 插件使用。
如果 PreScore 插件返回錯誤，則調度週期將終止。

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
這些插件用於對通過過濾階段的節點進行排序。調度器將爲每個節點調用每個評分插件。
將有一個定義明確的整數範圍，代表最小和最大分數。
在[標準化評分](#normalize-scoring)階段之後，
調度器將根據設定的插件權重合並所有插件的節點分數。

<!--
#### Capacity scoring {#scoring-capacity}

{{< feature-state feature_gate_name="StorageCapacityScoring" >}}

The feature gate `VolumeCapacityPriority` was used in v1.32 to support storage that are
statically provisioned. Starting from v1.33, the new feature gate `StorageCapacityScoring`
replaces the old `VolumeCapacityPriority` gate with added support to dynamically provisioned storage.
When `StorageCapacityScoring` is enabled, the VolumeBinding plugin in the kube-scheduler is extended
to score Nodes based on the storage capacity on each of them.
This feature is applicable to CSI volumes that supported [Storage Capacity](/docs/concepts/storage/storage-capacity/),
including local storage backed by a CSI driver.
-->
#### 容量打分 {#scoring-capacity}

{{< feature-state feature_gate_name="StorageCapacityScoring" >}}

在 v1.32 中，特性門控 `VolumeCapacityPriority` 被用於支持靜態製備的儲存。
從 v1.33 開始，新的特性門控 `StorageCapacityScoring` 取代了舊的 `VolumeCapacityPriority`，
並新增了對動態製備儲存的支持。
啓用 `StorageCapacityScoring` 後，kube-scheduler 中的 VolumeBinding 插件功能將進行擴展，
根據每個節點上的儲存容量對節點進行打分。
該特性適用於支持[儲存容量](/zh-cn/docs/concepts/storage/storage-capacity/)的 CSI 卷，
包括由 CSI 驅動程式支持的本地儲存。

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
這些插件用於在調度器計算 Node 排名之前修改分數。
在此擴展點註冊的插件被調用時會使用同一插件的 [Score](#scoring)
結果。每個插件在每個調度週期調用一次。

<!--
For example, suppose a plugin `BlinkingLightScorer` ranks Nodes based on how
many blinking lights they have.
-->
例如，假設一個 `BlinkingLightScorer` 插件基於具有的閃爍指示燈數量來對節點進行排名。

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
`BlinkingLightScorer` 插件還應該註冊該擴展點。

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
如果任何 NormalizeScore 插件返回錯誤，則調度階段將終止。

{{< note >}}
<!--
Plugins wishing to perform "pre-reserve" work should use the
NormalizeScore extension point.
-->
希望執行“預保留”工作的插件應該使用 NormalizeScore 擴展點。
{{< /note >}}

### Reserve {#reserve}

<!--
A plugin that implements the Reserve interface has two methods, namely `Reserve`
and `Unreserve`, that back two informational scheduling phases called Reserve
and Unreserve, respectively. Plugins which maintain runtime state (aka "stateful
plugins") should use these phases to be notified by the scheduler when resources
on a node are being reserved and unreserved for a given Pod.
-->
實現了 Reserve 介面的插件，擁有兩個方法，即 `Reserve` 和 `Unreserve`，
他們分別支持兩個名爲 Reserve 和 Unreserve 的資訊傳遞性質的調度階段。
維護運行時狀態的插件（又稱"有狀態插件"）應該使用這兩個階段，
以便在節點上的資源被保留和解除保留給特定的 Pod 時，得到調度器的通知。

<!--
The Reserve phase happens before the scheduler actually binds a Pod to its
designated node. It exists to prevent race conditions while the scheduler waits
for the bind to succeed. The `Reserve` method of each Reserve plugin may succeed
or fail; if one `Reserve` method call fails, subsequent plugins are not executed
and the Reserve phase is considered to have failed. If the `Reserve` method of
all plugins succeed, the Reserve phase is considered to be successful and the
rest of the scheduling cycle and the binding cycle are executed.
-->
Reserve 階段發生在調度器實際將一個 Pod 綁定到其指定節點之前。
它的存在是爲了防止在調度器等待綁定成功時發生競爭情況。
每個 Reserve 插件的 `Reserve` 方法可能成功，也可能失敗；
如果一個 `Reserve` 方法調用失敗，後面的插件就不會被執行，Reserve 階段被認爲失敗。
如果所有插件的 `Reserve` 方法都成功了，Reserve 階段就被認爲是成功的，
剩下的調度週期和綁定週期就會被執行。

<!--
The Unreserve phase is triggered if the Reserve phase or a later phase fails.
When this happens, the `Unreserve` method of **all** Reserve plugins will be
executed in the reverse order of `Reserve` method calls. This phase exists to
clean up the state associated with the reserved Pod.
-->
如果 Reserve 階段或後續階段失敗了，則觸發 Unreserve 階段。
發生這種情況時，**所有** Reserve 插件的 `Unreserve` 方法將按照
`Reserve` 方法調用的相反順序執行。
這個階段的存在是爲了清理與保留的 Pod 相關的狀態。

{{< caution >}}
<!--
The implementation of the `Unreserve` method in Reserve plugins must be
idempotent and may not fail.
-->
Reserve 插件中 `Unreserve` 方法的實現必須是冪等的，並且不能失敗。
{{< /caution >}}

<!--
This is the last step in a scheduling cycle. Once a Pod is in the reserved
state, it will either trigger [Unreserve](#unreserve) plugins (on failure) or
[PostBind](#post-bind) plugins (on success) at the end of the binding cycle.
-->
這個是調度週期的最後一步。
一旦 Pod 處於保留狀態，它將在綁定週期結束時觸發 [Unreserve](#unreserve) 插件（失敗時）或
[PostBind](#post-bind) 插件（成功時）。

<!--
### Permit
-->
### Permit

<!--
_Permit_ plugins are invoked at the end of the scheduling cycle for each Pod, to
prevent or delay the binding to the candidate node. A permit plugin can do one of
the three things:
-->
**Permit** 插件在每個 Pod 調度週期的最後調用，用於防止或延遲 Pod 的綁定。
一個允許插件可以做以下三件事之一：

<!--
1.  **approve** \
    Once all Permit plugins approve a Pod, it is sent for binding.
-->
1.  **批准** \
    一旦所有 Permit 插件批准 Pod 後，該 Pod 將被髮送以進行綁定。

<!--
1.  **deny** \
    If any Permit plugin denies a Pod, it is returned to the scheduling queue.
    This will trigger the Unreserve phase in [Reserve plugins](#reserve).
-->
2.  **拒絕** \
    如果任何 Permit 插件拒絕 Pod，則該 Pod 將被返回到調度隊列。
    這將觸發 [Reserve 插件](#reserve)中的 Unreserve 階段。

<!--
1.  **wait** (with a timeout) \
    If a Permit plugin returns "wait", then the Pod is kept in an internal "waiting"
    Pods list, and the binding cycle of this Pod starts but directly blocks until it
    gets approved. If a timeout occurs, **wait** becomes **deny**
    and the Pod is returned to the scheduling queue, triggering the
    Unreserve phase in [Reserve plugins](#reserve).
-->
3. **等待**（帶有超時）\
    如果一個 Permit 插件返回“等待”結果，則 Pod 將保持在一個內部的“等待中”
    的 Pod 列表，同時該 Pod 的綁定週期啓動時即直接阻塞直到得到批准。
    如果超時發生，**等待**變成**拒絕**，並且 Pod 將返回調度隊列，從而觸發
    [Reserve 插件](#reserve)中的 Unreserve 階段。

{{< note >}}
<!--
While any plugin can access the list of "waiting" Pods and approve them
(see [`FrameworkHandle`](https://git.k8s.io/enhancements/keps/sig-scheduling/624-scheduling-framework#frameworkhandle)),
we expect only the permit plugins to approve binding of reserved Pods that are in "waiting" state.
Once a Pod is approved, it is sent to the [PreBind](#pre-bind) phase.
-->
儘管任何插件可以訪問“等待中”狀態的 Pod 列表並批准它們
（查看 [`FrameworkHandle`](https://git.k8s.io/enhancements/keps/sig-scheduling/624-scheduling-framework#frameworkhandle)）。
我們期望只有允許插件可以批准處於“等待中”狀態的預留 Pod 的綁定。
一旦 Pod 被批准了，它將發送到 [PreBind](#pre-bind) 階段。
{{< /note >}}

<!--
### PreBind {#pre-bind}
-->
### PreBind  {#pre-bind}

<!--
These plugins are used to perform any work required before a Pod is bound. For
example, a pre-bind plugin may provision a network volume and mount it on the
target node before allowing the Pod to run there.
-->
這些插件用於執行 Pod 綁定前所需的所有工作。
例如，一個 PreBind 插件可能需要製備網路卷並且在允許 Pod
運行在該節點之前將其掛載到目標節點上。

<!--
If any PreBind plugin returns an error, the Pod is [rejected](#reserve) and
returned to the scheduling queue.
-->
如果任何 PreBind 插件返回錯誤，則 Pod 將被[拒絕](#reserve)並且退回到調度隊列中。

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
Bind 插件用於將 Pod 綁定到節點上。直到所有的 PreBind 插件都完成，Bind 插件纔會被調用。
各 Bind 插件按照設定順序被調用。Bind 插件可以選擇是否處理指定的 Pod。
如果某 Bind 插件選擇處理某 Pod，**剩餘的 Bind 插件將被跳過**。

<!--
### PostBind {#post-bind}
-->
### PostBind  {#post-bind}

<!--
This is an informational interface. Post-bind plugins are called after a
Pod is successfully bound. This is the end of a binding cycle, and can be used
to clean up associated resources.
-->
這是個資訊傳遞性質的介面。
PostBind 插件在 Pod 成功綁定後被調用。這是綁定週期的結尾，可用於清理相關的資源。

<!--
## Plugin API
-->
## 插件 API   {#plugin-api}

<!--
There are two steps to the plugin API. First, plugins must register and get
configured, then they use the extension point interfaces. Extension point
interfaces have the following form.
-->
插件 API 分爲兩個步驟。首先，插件必須完成註冊並設定，然後才能使用擴展點介面。
擴展點介面具有以下形式。

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
## Plugin configuration
-->
## 插件設定   {#plugin-configuration}

<!--
You can enable or disable plugins in the scheduler configuration. If you are using
Kubernetes v1.18 or later, most scheduling
[plugins](/docs/reference/scheduling/config/#scheduling-plugins) are in use and
enabled by default.
-->
你可以在調度器設定中啓用或禁用插件。
如果你在使用 Kubernetes v1.18 或更高版本，
大部分調度[插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)都在使用中且預設啓用。

<!--
In addition to default plugins, you can also implement your own scheduling
plugins and get them configured along with default plugins. You can visit
[scheduler-plugins](https://github.com/kubernetes-sigs/scheduler-plugins) for more details.
-->
除了預設的插件，你還可以實現自己的調度插件並且將它們與預設插件一起設定。
你可以訪問 [scheduler-plugins](https://github.com/kubernetes-sigs/scheduler-plugins)
瞭解更多資訊。

<!--
If you are using Kubernetes v1.18 or later, you can configure a set of plugins as
a scheduler profile and then define multiple profiles to fit various kinds of workload.
Learn more at [multiple profiles](/docs/reference/scheduling/config/#multiple-profiles).
-->
如果你正在使用 Kubernetes v1.18 或更高版本，你可以將一組插件設置爲一個調度器設定檔案，
然後定義不同的設定檔案來滿足各類工作負載。
瞭解更多關於[多設定檔案](/zh-cn/docs/reference/scheduling/config/#multiple-profiles)。
