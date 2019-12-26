---
reviewers:
- ahg-g
title: 调度框架
content_template: templates/concept
weight: 70
---

<!--
---
reviewers:
- ahg-g
title: Scheduling Framework
content_template: templates/concept
weight: 70
---
-->

{{% capture overview %}}

{{< feature-state for_k8s_version="1.15" state="alpha" >}}

<!--
The scheduling framework is a new plugable architecture for Kubernetes Scheduler
that makes scheduler customizations easy. It adds a new set of "plugin" APIs to
the existing scheduler. Plugins are compiled into the scheduler. The APIs
allow most scheduling features to be implemented as plugins, while keeping the
scheduling "core" simple and maintainable. Refer to the [design proposal of the
scheduling framework][kep] for more technical information on the design of the
framework.
-->

调度框架是 Kubernetes Scheduler 的一种新的可插入架构，可以简化调度器的自定义。它向现有的调度器增加了一组新的“插件” API。插件被编译到调度器程序中。这些 API 允许大多数调度功能以插件的形式实现，同时使调度“核心”保持简单且可维护。请参考[调度框架的设计提案][kep]获取框架设计的更多技术信息。

[kep]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/20180409-scheduling-framework.md

{{% /capture %}}

{{% capture body %}}

<!--
# Framework workflow
-->

# 框架工作流程

<!--
The Scheduling Framework defines a few extension points. Scheduler plugins
register to be invoked at one or more extension points. Some of these plugins
can change the scheduling decisions and some are informational only.
-->

调度框架定义了一些扩展点。调度器插件注册后在一个或多个扩展点处被调用。这些插件中的一些可以改变调度决策，而另一些仅用于提供信息。

<!--
Each attempt to schedule one Pod is split into two phases, the **scheduling
cycle** and the **binding cycle**.
-->

每次调度一个 pod 的尝试都分为两个阶段，即**调度周期**和**绑定周期**。

<!--
## Scheduling Cycle & Binding Cycle
-->

## 调度周期和绑定周期

<!--
The scheduling cycle selects a node for the Pod, and the binding cycle applies
that decision to the cluster. Together, a scheduling cycle and binding cycle are
referred to as a "scheduling context".
-->

调度周期为 pod 选择一个节点，绑定周期将该决策应用于集群。调度周期和绑定周期一起被称为“调度上下文”。

<!--
Scheduling cycles are run serially, while binding cycles may run concurrently.
-->

调度周期是串行运行的，而绑定周期可能是同时运行的。

<!--
A scheduling or binding cycle can be aborted if the Pod is determined to
be unschedulable or if there is an internal error. The Pod will be returned to
the queue and retried.
-->

如果确定 pod 不可调度或者存在内部错误，则可以终止调度周期或绑定周期。Pod 将返回队列并重试。

<!--
## Extension points
-->

## 扩展点

<!--
The following picture shows the scheduling context of a Pod and the extension
points that the scheduling framework exposes. In this picture "Filter" is
equivalent to "Predicate" and "Scoring" is equivalent to "Priority function".
-->

下图显示了一个 pod 的调度上下文以及调度框架公开的扩展点。在此图片中，“过滤器”等同于“断言”，“评分”相当于“优先级函数”。

<!--
One plugin may register at multiple extension points to perform more complex or
stateful tasks.
-->

一个插件可以在多个扩展点处注册，以执行更复杂或有状态的任务。

<!--
{{< figure src="/images/docs/scheduling-framework-extensions.png" title="scheduling framework extension points" >}}
-->

{{< figure src="/images/docs/scheduling-framework-extensions.png" title="调度框架扩展点" >}}

<!--
### Queue sort
-->

###　队列排序

<!--
These plugins are used to sort Pods in the scheduling queue. A queue sort plugin
essentially will provide a "less(Pod1, Pod2)" function. Only one queue sort
plugin may be enabled at a time.
-->

队列排序插件用于对调度队列中的 pod 进行排序。队列排序插件本质上将提供 "less(Pod1, Pod2)" 函数。一次只能启动一个队列插件。

<!--
### Pre-filter
-->

### 前置过滤

<!--
These plugins are used to pre-process info about the Pod, or to check certain
conditions that the cluster or the Pod must meet. If a pre-filter plugin returns
an error, the scheduling cycle is aborted.
-->

前置过滤插件用于预处理 pod 的相关信息，或者检查集群或 pod 必须满足的某些条件。如果前置过滤插件返回错误，则调度周期将终止。

<!--
### Filter
-->

### 过滤

<!--
These plugins are used to filter out nodes that cannot run the Pod. For each
node, the scheduler will call filter plugins in their configured order. If any
filter plugin marks the node as infeasible, the remaining plugins will not be
called for that node. Nodes may be evaluated concurrently.
-->

过滤插件用于过滤出不能运行该 pod 的节点。对于每个节点，调度器将按照其配置顺序调用这些过滤插件。如果任何过滤插件将节点标记为不可行，则不会为该节点调用剩下的过滤插件。节点可以被同时进行评估。

<!--
### Post-filter
-->

### 后置过滤

<!--
This is an informational extension point. Plugins will be called with a list of
nodes that passed the filtering phase. A plugin may use this data to update
internal state or to generate logs/metrics.
-->

后置过滤是一个信息性的扩展点。通过过滤阶段的节点列表将调用这些后置过滤。插件将使用这些数据来更新内部的状态或者生成日志/指标。

<!--
**Note:** Plugins wishing to perform "pre-scoring" work should use the
post-filter extension point.
-->

**注意：**希望执行“预评分”工作的插件应该使用后置过滤扩展点。

<!--
### Scoring
-->

### 评分

<!--
These plugins are used to rank nodes that have passed the filtering phase. The
scheduler will call each scoring plugin for each node. There will be a well
defined range of integers representing the minimum and maximum scores. After the
[normalize scoring](#normalize-scoring) phase, the scheduler will combine node
scores from all plugins according to the configured plugin weights.
-->

评分插件用于对通过过滤阶段的节点进行排名。调度器将为每个节点调用每个评分插件。将有一个定义明确的整数范围，代表最小和最大分数。在[标准化评分](#标准化评分)阶段之后，调度器将根据配置的插件权重合并所有插件的节点分数。

<!--
### Normalize scoring
-->

### 标准化评分

<!--
These plugins are used to modify scores before the scheduler computes a final
ranking of Nodes. A plugin that registers for this extension point will be
called with the [scoring](#scoring) results from the same plugin. This is called
once per plugin per scheduling cycle.
-->

标准化评分插件用于在调度器计算节点的排名之前修改分数。在此扩展点注册的插件将使用同一插件的[评分](#评分)结果被调用。每个插件在每个调度周期调用一次。

<!--
For example, suppose a plugin `BlinkingLightScorer` ranks Nodes based on how
many blinking lights they have.
-->

例如，假设一个 `BlinkingLightScorer` 插件基于具有的闪烁指示灯数量来对节点进行排名。

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

然而，最大的闪烁灯个数值可能比 `NodeScoreMax` 小。要解决这个问题，`BlinkingLightScorer` 插件还应该注册该扩展点。

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
If any normalize-scoring plugin returns an error, the scheduling cycle is
aborted.
-->

如果任何标准化评分插件返回错误，则调度阶段将终止。

<!--
**Note:** Plugins wishing to perform "pre-reserve" work should use the
normalize-scoring extension point.
-->

**注意：**希望执行“预保留”工作的插件应该使用标准化评分扩展点。

<!--
### Reserve
-->

### 保留

<!--
This is an informational extension point. Plugins which maintain runtime state
(aka "stateful plugins") should use this extension point to be notified by the
scheduler when resources on a node are being reserved for a given Pod. This
happens before the scheduler actually binds the Pod to the Node, and it exists
to prevent race conditions while the scheduler waits for the bind to succeed.
-->

保留是一个信息性的扩展点。管理运行时状态的插件（也成为“有状态插件”）应该使用此扩展点，以便调度器在节点给指定 pod 预留了资源时能够通知该插件。这是在调度器真正将 pod 绑定到节点之前发生的，并且它存在是为了防止在调度器等待绑定成功时发生竞争情况。

<!--
This is the last step in a scheduling cycle. Once a Pod is in the reserved
state, it will either trigger [Unreserve](#unreserve) plugins (on failure) or
[Post-bind](#post-bind) plugins (on success) at the end of the binding cycle.
-->

这个是调度周期的最后一步。一旦 pod 处于保留状态，它将在绑定周期结束时触发[不保留](#不保留)插件（失败时）或
[绑定后](#绑定后)插件（成功时）。

<!--
*Note: This concept used to be referred to as "assume".*
-->

*注意：此概念曾被称为“假设”。*

<!--
### Permit
-->

### 允许

<!--
These plugins are used to prevent or delay the binding of a Pod. A permit plugin
can do one of three things.
-->

允许插件用于防止或延迟 pod 的绑定。一个允许插件可以做以下三件事之一。

<!--
1.  **approve** \
    Once all permit plugins approve a Pod, it is sent for binding.
-->

1.  **批准** \
    一旦所有允许插件批准 pod 后，该 pod 将被发送以进行绑定。

<!--
1.  **deny** \
    If any permit plugin denies a Pod, it is returned to the scheduling queue.
    This will trigger [Unreserve](#unreserve) plugins.
-->

1.  **拒绝** \
    如果任何允许插件拒绝 pod，则该 pod 将被返回到调度队列。这将触发[不保留](#不保留)插件。

<!--
1.  **wait** (with a timeout) \
    If a permit plugin returns "wait", then the Pod is kept in the permit phase
    until a [plugin approves it](#frameworkhandle). If a timeout occurs, **wait**
    becomes **deny** and the Pod is returned to the scheduling queue, triggering
    [Unreserve](#unreserve) plugins.
-->

1.  **等待**（带有超时） \
    如果一个允许插件返回“等待”结果，则 pod 将保持在允许阶段，直到插件批准它。如果超时发生，**等待**变成**拒绝**，并且 pod 将返回调度队列，从而触发[不保留](#不保留)插件。

<!--
**Approving a Pod binding**
-->

**批准 pod 绑定**

<!--
While any plugin can access the list of "waiting" Pods from the cache and
approve them (see [`FrameworkHandle`](#frameworkhandle)) we expect only the permit
plugins to approve binding of reserved Pods that are in "waiting" state. Once a
Pod is approved, it is sent to the pre-bind phase.
-->

尽管任何插件可以从缓存中访问“等待”状态的 pod 列表并批准它们。我们希望只有允许插件可以批准处于“等待”状态的 预留 pod 的绑定。一旦 pod 被批准了，它将发送到预绑定阶段。

<!--
### Pre-bind
-->

### 预绑定

<!--
These plugins are used to perform any work required before a Pod is bound. For
example, a pre-bind plugin may provision a network volume and mount it on the
target node before allowing the Pod to run there.
-->

预绑定插件用于执行 pod 绑定前所需的任何工作。例如，一个预绑定插件可能需要提供网络卷并且在允许 pod 运行在该节点之前将其挂载到目标节点上。

<!--
If any pre-bind plugin returns an error, the Pod is [rejected](#unreserve) and
returned to the scheduling queue.
-->

如果任何预绑定插件返回错误，则 pod 将被[拒绝](#不保留)并且返回到调度队列中。

<!--
### Bind
-->

### 绑定

<!--
These plugins are used to bind a Pod to a Node. Bind plugins will not be called
until all pre-bind plugins have completed. Each bind plugin is called in the
configured order. A bind plugin may choose whether or not to handle the given
Pod. If a bind plugin chooses to handle a Pod, **the remaining bind plugins are
skipped**.
-->

绑定插件用于将 pod 绑定到节点上。直到所有的预绑定插件都完成，绑定插件才会被调用。每个绑定插件按照配置顺序被调用。绑定插件可以选择是否处理指定的 pod。如果绑定插件选择处理 pod，**剩余的绑定插件将被跳过**。

<!--
### Post-bind
-->

### 绑定后

<!--
This is an informational extension point. Post-bind plugins are called after a
Pod is successfully bound. This is the end of a binding cycle, and can be used
to clean up associated resources.
-->

这是个信息性的扩展点。绑定后插件在 pod 成功绑定后被调用。这是绑定周期的结尾，可用于清理相关的资源。

<!--
### Unreserve
-->

### 不保留

<!--
This is an informational extension point. If a Pod was reserved and then
rejected in a later phase, then unreserve plugins will be notified. Unreserve
plugins should clean up state associated with the reserved Pod.
-->

这是个信息性的扩展点。如果 pod 被保留，然后在后面的阶段中被拒绝，则不保留插件将被通知。不保留插件应该清楚保留 pod 的相关状态。

<!--
Plugins that use this extension point usually should also use
[Reserve](#reserve).
-->

使用此扩展点的插件通常也使用[保留](#保留)。

<!--
## Plugin API
-->

## 插件 API

<!--
There are two steps to the plugin API. First, plugins must register and get
configured, then they use the extension point interfaces. Extension point
interfaces have the following form.
-->

插件 API 分为两个步骤。首先，插件必须注册并配置，然后才能使用扩展点接口。扩展点接口具有以下形式。

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
   PreFilter(PluginContext, *v1.pod) error
}

// ...
```

<!--
# Plugin Configuration
-->

# 插件配置

<!--
Plugins can be enabled in the scheduler configuration. Also, default plugins can
be disabled in the configuration. In 1.15, there are no default plugins for the
scheduling framework.
-->

可以在调度器配置中启用插件。另外，默认的插件可以在配置中禁用。在 1.15 版本，调度框架没有默认的插件。

<!--
The scheduler configuration can include configuration for plugins as well. Such
configurations are passed to the plugins at the time the scheduler initializes
them. The configuration is an arbitrary value. The receiving plugin should
decode and process the configuration.
-->

调度器配置也可以包含插件的配置。这些配置在调度器初始化插件时传给插件。配置是一个任意值。接收插件应该解码并处理配置信息。

<!--
The following example shows a scheduler configuration that enables some
plugins at `reserve` and `preBind` extension points and disables a plugin. It
also provides a configuration to plugin `foo`.
-->

下面的例子显示一个调度器配置，该配置在 `reserve` 和 `preBind` 扩展点启用了一些插件并且禁用了一个插件。它还提供了 `foo` 插件的配置。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration

...

plugins:
  reserve:
    enabled:
    - name: foo
    - name: bar
    disabled:
    - name: baz
  preBind:
    enabled:
    - name: foo
    disabled:
    - name: baz

pluginConfig:
- name: foo
  args: >
    Arbitrary set of args to plugin foo
```

<!--
When an extension point is omitted from the configuration default plugins for
that extension points are used. When an extension point exists and `enabled` is
provided, the `enabled` plugins are called in addition to default plugins.
Default plugins are called first and then the additional enabled plugins are
called in the same order specified in the configuration. If a different order of
calling default plugins is desired, default plugins must be `disabled` and
`enabled` in the desired order.
-->

当配置省略扩展点时，将使用该扩展点的默认插件。当存在扩展掉并且配置为 `enabled`，则 `enabled` 的插件将和默认插件一同调用。首先调用默认插件，然后以配置中指定的顺序来调用其他已启用的插件。如果希望以不同的顺序来调用默认插件，默认插件必须 `disabled`，然后以期望的顺序 `enabled`。

<!--
Assuming there is a default plugin called `foo` at `reserve` and we are adding
plugin `bar` that we want to be invoked before `foo`, we should disable `foo`
and enable `bar` and `foo` in order. The following example shows the
configuration that achieves this:
-->

假设在 `reserve` 扩展点有一个默认的 `foo` 插件，且添加 `bar` 插件并且希望在 `foo` 插件之前执行，我们应该禁用 `foo` 并且按顺序启用 `bar` 和 `foo`。下面的例子显示了实现此目的的配置：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration

...

plugins:
  reserve:
    enabled:
    - name: bar
    - name: foo
    disabled:
    - name: foo
```

{{% /capture %}}
