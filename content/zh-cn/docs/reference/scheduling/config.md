---
title: 调度器配置
content_type: concept
weight: 20
---
<!--
title: Scheduler Configuration
content_type: concept
weight: 20
-->

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
You can customize the behavior of the `kube-scheduler` by writing a configuration
file and passing its path as a command line argument.
-->
你可以通过编写配置文件，并将其路径传给 `kube-scheduler` 的命令行参数，定制 `kube-scheduler` 的行为。

<!-- overview -->

<!-- body -->
<!--
A scheduling Profile allows you to configure the different stages of scheduling
in the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}.
Each stage is exposed in an extension point. Plugins provide scheduling behaviors
by implementing one or more of these extension points.
-->
调度模板（Profile）允许你配置 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
中的不同调度阶段。每个阶段都暴露于某个扩展点中。插件通过实现一个或多个扩展点来提供调度行为。

<!--
You can specify scheduling profiles by running `kube-scheduler --config <filename>`,
using the
KubeSchedulerConfiguration [v1](/docs/reference/config-api/kube-scheduler-config.v1/)
struct.
-->
你可以通过运行 `kube-scheduler --config <filename>` 来设置调度模板，
使用 KubeSchedulerConfiguration [v1](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)
结构体。

<!--
A minimal configuration looks as follows:
-->
最简单的配置如下：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
clientConnection:
  kubeconfig: /etc/srv/kubernetes/kube-scheduler/kubeconfig
```

{{< note >}}
<!--
KubeSchedulerConfiguration v1beta3 is deprecated in v1.26 and will be removed in v1.29.
Please migrate KubeSchedulerConfiguration to [v1](/docs/reference/config-api/kube-scheduler-config.v1/).
-->
KubeSchedulerConfiguration v1beta3 在 v1.26 中已被弃用，
并将在 v1.29 中被移除。请将 KubeSchedulerConfiguration 迁移到
[v1](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)。
{{< /note >}}

<!--
## Profiles
-->
## 配置文件    {#profiles}

<!--
A scheduling Profile allows you to configure the different stages of scheduling
in the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}.
Each stage is exposed in an [extension point](#extension-points).
[Plugins](#scheduling-plugins) provide scheduling behaviors by implementing one
or more of these extension points.
-->
通过调度配置文件，你可以配置 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} 在不同阶段的调度行为。
每个阶段都在一个[扩展点](#extension-points)中公开。
[调度插件](#scheduling-plugins)通过实现一个或多个扩展点，来提供调度行为。

<!--
You can configure a single instance of `kube-scheduler` to run
[multiple profiles](#multiple-profiles).
-->
你可以配置同一 `kube-scheduler` 实例使用[多个配置文件](#multiple-profiles)。

<!--
### Extension points
-->
### 扩展点    {#extensions-points}

<!--
Scheduling happens in a series of stages that are exposed through the following
extension points:
-->
调度行为发生在一系列阶段中，这些阶段是通过以下扩展点公开的：

<!--
1. `queueSort`: These plugins provide an ordering function that is used to
   sort pending Pods in the scheduling queue. Exactly one queue sort plugin
   may be enabled at a time.
-->
1. `queueSort`：这些插件对调度队列中的悬决的 Pod 排序。
   一次只能启用一个队列排序插件。
<!--
1. `preFilter`: These plugins are used to pre-process or check information
   about a Pod or the cluster before filtering. They can mark a pod as
   unschedulable.
 -->
2. `preFilter`：这些插件用于在过滤之前预处理或检查 Pod 或集群的信息。
   它们可以将 Pod 标记为不可调度。
<!--
1. `filter`: These plugins are the equivalent of Predicates in a scheduling
   Policy and are used to filter out nodes that can not run the Pod. Filters
   are called in the configured order. A pod is marked as unschedulable if no
   nodes pass all the filters.
-->
3. `filter`：这些插件相当于调度策略中的断言（Predicates），用于过滤不能运行 Pod 的节点。
   过滤器的调用顺序是可配置的。
   如果没有一个节点通过所有过滤器的筛选，Pod 将会被标记为不可调度。
<!--
1. `postFilter`: These plugins are called in their configured order when no
   feasible nodes were found for the pod. If any `postFilter` plugin marks the
   Pod _schedulable_, the remaining plugins are not called.
--> 
4. `postFilter`：当无法为 Pod 找到可用节点时，按照这些插件的配置顺序调用他们。
   如果任何 `postFilter` 插件将 Pod 标记为**可调度**，则不会调用其余插件。
<!--
1. `preScore`: This is an informational extension point that can be used
   for doing pre-scoring work.
-->
5. `preScore`：这是一个信息扩展点，可用于预打分工作。
<!--
1. `score`: These plugins provide a score to each node that has passed the
   filtering phase. The scheduler will then select the node with the highest
   weighted scores sum.
-->
6. `score`：这些插件给通过筛选阶段的节点打分。调度器会选择得分最高的节点。
<!--
1. `reserve`: This is an informational extension point that notifies plugins
   when resources have been reserved for a given Pod. Plugins also implement an
   `Unreserve` call that gets called in the case of failure during or after
   `Reserve`.
-->
7. `reserve`：这是一个信息扩展点，当资源已经预留给 Pod 时，会通知插件。
   这些插件还实现了 `Unreserve` 接口，在 `Reserve` 期间或之后出现故障时调用。
<!--
1. `permit`: These plugins can prevent or delay the binding of a Pod.
-->
8. `permit`：这些插件可以阻止或延迟 Pod 绑定。
<!--
1. `preBind`: These plugins perform any work required before a Pod is bound.
-->
9. `preBind`：这些插件在 Pod 绑定节点之前执行。
<!--
1. `bind`: The plugins bind a Pod to a Node. `bind` plugins are called in order
   and once one has done the binding, the remaining plugins are skipped. At
   least one bind plugin is required.
-->
10. `bind`：这个插件将 Pod 与节点绑定。`bind` 插件是按顺序调用的，只要有一个插件完成了绑定，
   其余插件都会跳过。`bind` 插件至少需要一个。
<!--
1. `postBind`: This is an informational extension point that is called after
   a Pod has been bound.
-->
11. `postBind`：这是一个信息扩展点，在 Pod 绑定了节点之后调用。
<!--
1. `multiPoint`: This is a config-only field that allows plugins to be enabled
   or disabled for all of their applicable extension points simultaneously.
-->
12. `multiPoint`：这是一个仅配置字段，允许同时为所有适用的扩展点启用或禁用插件。

<!--
For each extension point, you could disable specific [default plugins](#scheduling-plugins)
or enable your own. For example:
-->
对每个扩展点，你可以禁用[默认插件](#scheduling-plugins)或者是启用自己的插件，例如：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - plugins:
      score:
        disabled:
        - name: PodTopologySpread
        enabled:
        - name: MyCustomPluginA
          weight: 2
        - name: MyCustomPluginB
          weight: 1
```

<!--
You can use `*` as name in the disabled array to disable all default plugins
for that extension point. This can also be used to rearrange plugins order, if
desired.
-->
你可以在 `disabled` 数组中使用 `*` 禁用该扩展点的所有默认插件。
如果需要，这个字段也可以用来对插件重新顺序。

<!--
### Scheduling plugins
-->
### 调度插件   {#scheduling-plugins}

<!--
The following plugins, enabled by default, implement one or more of these
extension points:
-->
下面默认启用的插件实现了一个或多个扩展点：

<!--
- `ImageLocality`: Favors nodes that already have the container images that the
  Pod runs.
  Extension points: `score`.
-->
- `ImageLocality`：选择已经存在 Pod 运行所需容器镜像的节点。

  实现的扩展点：`score`。

<!--
- `TaintToleration`: Implements
  [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
  Implements extension points: `filter`, `preScore`, `score`.
-->
- `TaintToleration`：实现了[污点和容忍](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。

  实现的扩展点：`filter`、`preScore`、`score`。

<!--
- `NodeName`: Checks if a Pod spec node name matches the current node.
  Extension points: `filter`.
-->
- `NodeName`：检查 Pod 指定的节点名称与当前节点是否匹配。

  实现的扩展点：`filter`。

<!--
- `NodePorts`: Checks if a node has free ports for the requested Pod ports.
  Extension points: `preFilter`, `filter`.
-->
- `NodePorts`：检查 Pod 请求的端口在节点上是否可用。

  实现的扩展点：`preFilter`、`filter`。

<!--
- `NodeAffinity`: Implements
  [node selectors](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
  and [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).
  Extension points: `filter`, `score`.
-->
- `NodeAffinity`：实现了[节点选择器](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
  和[节点亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)。

  实现的扩展点：`filter`、`score`。

<!--
- `PodTopologySpread`: Implements
  [Pod topology spread](/docs/concepts/scheduling-eviction/topology-spread-constraints/).
  Extension points: `preFilter`, `filter`, `preScore`, `score`.
-->
- `PodTopologySpread`：实现了 [Pod 拓扑分布](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)。

  实现的扩展点：`preFilter`、`filter`、`preScore`、`score`。

<!--
- `NodeUnschedulable`: Filters out nodes that have `.spec.unschedulable` set to
  true.
  Extension points: `filter`.
-->
- `NodeUnschedulable`：过滤 `.spec.unschedulable` 值为 true 的节点。

  实现的扩展点：`filter`。

<!--
- `NodeResourcesFit`: Checks if the node has all the resources that the Pod is
  requesting. The score can use one of three strategies: `LeastAllocated`
  (default), `MostAllocated` and `RequestedToCapacityRatio`.
  Extension points: `preFilter`, `filter`, `score`.
-->
- `NodeResourcesFit`：检查节点是否拥有 Pod 请求的所有资源。
  得分可以使用以下三种策略之一：`LeastAllocated`（默认）、`MostAllocated`
  和 `RequestedToCapacityRatio`。

  实现的扩展点：`preFilter`、`filter`、`score`。

<!--
- `NodeResourcesBalancedAllocation`: Favors nodes that would obtain a more
  balanced resource usage if the Pod is scheduled there.
  Extension points: `score`.
-->
- `NodeResourcesBalancedAllocation`：调度 Pod 时，选择资源使用更为均衡的节点。

  实现的扩展点：`score`。

<!--
- `VolumeBinding`: Checks if the node has or if it can bind the requested
  {{< glossary_tooltip text="volumes" term_id="volume" >}}.
  Extension points: `preFilter`, `filter`, `reserve`, `preBind`, `score`.
-->
- `VolumeBinding`：检查节点是否有请求的卷，或是否可以绑定请求的{{< glossary_tooltip text="卷" term_id="volume" >}}。
  实现的扩展点：`preFilter`、`filter`、`reserve`、`preBind` 和 `score`。

  {{< note >}}
  <!--
  `score` extension point is enabled when `VolumeCapacityPriority` feature is
  enabled. It prioritizes the smallest PVs that can fit the requested volume
  size.
  -->
  当 `VolumeCapacityPriority` 特性被启用时，`score` 扩展点也被启用。
  它优先考虑可以满足所需卷大小的最小 PV。
  {{< /note >}}
  
<!--
- `VolumeRestrictions`: Checks that volumes mounted in the node satisfy
  restrictions that are specific to the volume provider.
  Extension points: `filter`.
-->
- `VolumeRestrictions`：检查挂载到节点上的卷是否满足卷提供程序的限制。

  实现的扩展点：`filter`。

<!--
- `VolumeZone`: Checks that volumes requested satisfy any zone requirements they
  might have.
  Extension points: `filter`.
-->
- `VolumeZone`：检查请求的卷是否在任何区域都满足。

  实现的扩展点：`filter`。

<!--
- `NodeVolumeLimits`: Checks that CSI volume limits can be satisfied for the
  node.
  Extension points: `filter`.
-->
- `NodeVolumeLimits`：检查该节点是否满足 CSI 卷限制。

  实现的扩展点：`filter`。

<!--
- `EBSLimits`: Checks that AWS EBS volume limits can be satisfied for the node.
  Extension points: `filter`.
-->
- `EBSLimits`：检查节点是否满足 AWS EBS 卷限制。

  实现的扩展点：`filter`。

<!--
- `GCEPDLimits`: Checks that GCP-PD volume limits can be satisfied for the node.
  Extension points: `filter`.
-->
- `GCEPDLimits`：检查该节点是否满足 GCP-PD 卷限制。

  实现的扩展点：`filter`。

<!--
- `AzureDiskLimits`: Checks that Azure disk volume limits can be satisfied for
  the node.
  Extension points: `filter`.
-->
- `AzureDiskLimits`：检查该节点是否满足 Azure 卷限制。

  实现的扩展点：`filter`。

<!--
- `InterPodAffinity`: Implements
  [inter-Pod affinity and anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity).
  Extension points: `preFilter`, `filter`, `preScore`, `score`.
-->
- `InterPodAffinity`：实现 [Pod 间亲和性与反亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)。

  实现的扩展点：`preFilter`、`filter`、`preScore`、`score`。

<!--
- `PrioritySort`: Provides the default priority based sorting.
  Extension points: `queueSort`.
-->
- `PrioritySort`：提供默认的基于优先级的排序。

  实现的扩展点：`queueSort`。

<!--
- `DefaultBinder`: Provides the default binding mechanism.
  Extension points: `bind`.
-->
- `DefaultBinder`：提供默认的绑定机制。

  实现的扩展点：`bind`。

<!--
- `DefaultPreemption`: Provides the default preemption mechanism.
  Extension points: `postFilter`.
-->
- `DefaultPreemption`：提供默认的抢占机制。

  实现的扩展点：`postFilter`。

<!--
You can also enable the following plugins, through the component config APIs,
that are not enabled by default:
-->
你也可以通过组件配置 API 启用以下插件（默认不启用）：

<!--
- `CinderLimits`: Checks that [OpenStack Cinder](https://docs.openstack.org/cinder/)
  volume limits can be satisfied for the node.
  Extension points: `filter`.
-->
- `CinderLimits`：检查是否可以满足节点的 [OpenStack Cinder](https://docs.openstack.org/cinder/) 卷限制。
  实现的扩展点：`filter`。

<!--
### Multiple profiles

You can configure `kube-scheduler` to run more than one profile.
Each profile has an associated scheduler name and can have a different set of
plugins configured in its [extension points](#extension-points).
-->
### 多配置文件 {#multiple-profiles}

你可以配置 `kube-scheduler` 运行多个配置文件。
每个配置文件都有一个关联的调度器名称，并且可以在其扩展点中配置一组不同的插件。

<!--
With the following sample configuration, the scheduler will run with two
profiles: one with the default plugins and one with all scoring plugins
disabled.
-->
使用下面的配置样例，调度器将运行两个配置文件：一个使用默认插件，另一个禁用所有打分插件。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
  - schedulerName: no-scoring-scheduler
    plugins:
      preScore:
        disabled:
        - name: '*'
      score:
        disabled:
        - name: '*'
```

<!--
Pods that want to be scheduled according to a specific profile can include
the corresponding scheduler name in its `.spec.schedulerName`.
-->
对于那些希望根据特定配置文件来进行调度的 Pod，可以在 `.spec.schedulerName` 字段指定相应的调度器名称。

<!--
By default, one profile with the scheduler name `default-scheduler` is created.
This profile includes the default plugins described above. When declaring more
than one profile, a unique scheduler name for each of them is required.
-->
默认情况下，将创建一个调度器名为 `default-scheduler` 的配置文件。
这个配置文件包括上面描述的所有默认插件。
声明多个配置文件时，每个配置文件中调度器名称必须唯一。

<!--
If a Pod doesn't specify a scheduler name, kube-apiserver will set it to
`default-scheduler`. Therefore, a profile with this scheduler name should exist
to get those pods scheduled.
-->
如果 Pod 未指定调度器名称，kube-apiserver 将会把调度器名设置为 `default-scheduler`。
因此，应该存在一个调度器名为 `default-scheduler` 的配置文件来调度这些 Pod。

{{< note >}}
<!--
Pod's scheduling events have `.spec.schedulerName` as their `reportingController`.
Events for leader election use the scheduler name of the first profile in the list.

For more information, please refer to the `reportingController` section under
[Event API Reference](/docs/reference/kubernetes-api/cluster-resources/event-v1/).
-->
Pod 的调度事件把 `.spec.schedulerName` 字段值作为它们的 `ReportingController`。
领导者选举事件使用列表中第一个配置文件的调度器名称。

有关更多信息，请参阅
[Event API 参考文档](/zh-cn/docs/reference/kubernetes-api/cluster-resources/event-v1/)中的
`reportingController` 一节。
{{< /note >}}

{{< note >}}
<!--
All profiles must use the same plugin in the `queueSort` extension point and have
the same configuration parameters (if applicable). This is because the scheduler
only has one pending pods queue.
-->
所有配置文件必须在 `queueSort` 扩展点使用相同的插件，并具有相同的配置参数（如果适用）。
这是因为调度器只有一个保存 pending 状态 Pod 的队列。
{{< /note >}}

<!--
### Plugins that apply to multiple extension points {#multipoint}
-->
### 应用于多个扩展点的插件 {#multipoint}

<!--
Starting from `kubescheduler.config.k8s.io/v1beta3`, there is an additional field in the
profile config, `multiPoint`, which allows for easily enabling or disabling a plugin
across several extension points. The intent of `multiPoint` config is to simplify the
configuration needed for users and administrators when using custom profiles.
-->
从 `kubescheduler.config.k8s.io/v1beta3` 开始，配置文件配置中有一个附加字段
`multiPoint`，它允许跨多个扩展点轻松启用或禁用插件。
`multiPoint` 配置的目的是简化用户和管理员在使用自定义配置文件时所需的配置。

<!--
Consider a plugin, `MyPlugin`, which implements the `preScore`, `score`, `preFilter`,
and `filter` extension points. To enable `MyPlugin` for all its available extension
points, the profile config looks like:
-->
考虑一个插件，`MyPlugin`，它实现了 `preScore`、`score`、`preFilter` 和 `filter` 扩展点。
要为其所有可用的扩展点启用 `MyPlugin`，配置文件配置如下所示：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: MyPlugin
```

<!--
This would equate to manually enabling `MyPlugin` for all of its extension
points, like so:
-->
这相当于为所有扩展点手动启用 `MyPlugin`，如下所示：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: non-multipoint-scheduler
    plugins:
      preScore:
        enabled:
        - name: MyPlugin
      score:
        enabled:
        - name: MyPlugin
      preFilter:
        enabled:
        - name: MyPlugin
      filter:
        enabled:
        - name: MyPlugin
```

<!--
One benefit of using `multiPoint` here is that if `MyPlugin` implements another
extension point in the future, the `multiPoint` config will automatically enable it
for the new extension.
-->
在这里使用 `multiPoint` 的一个好处是，如果 `MyPlugin` 将来实现另一个扩展点，`multiPoint` 配置将自动为新扩展启用它。

<!--
Specific extension points can be excluded from `MultiPoint` expansion using
the `disabled` field for that extension point. This works with disabling default
plugins, non-default plugins, or with the wildcard (`'*'`) to disable all plugins.
An example of this, disabling `Score` and `PreScore`, would be:
-->
可以使用该扩展点的 `disabled` 字段将特定扩展点从 `MultiPoint` 扩展中排除。
这适用于禁用默认插件、非默认插件或使用通配符 (`'*'`) 来禁用所有插件。
禁用 `Score` 和 `PreScore` 的一个例子是：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: non-multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: 'MyPlugin'
      preScore:
        disabled:
        - name: '*'
      score:
        disabled:
        - name: '*'
```

<!--
Starting from `kubescheduler.config.k8s.io/v1beta3`, all [default plugins](#scheduling-plugins)
are enabled internally through `MultiPoint`.
However, individual extension points are still available to allow flexible
reconfiguration of the default values (such as ordering and Score weights). For
example, consider two Score plugins `DefaultScore1` and `DefaultScore2`, each with
a weight of `1`. They can be reordered with different weights like so:
-->
从 `kubescheduler.config.k8s.io/v1beta3` 开始，所有[默认插件](#scheduling-plugins)都通过 `MultiPoint` 在内部启用。
但是，仍然可以使用单独的扩展点来灵活地重新配置默认值（例如排序和分数权重）。
例如，考虑两个 Score 插件 `DefaultScore1` 和 `DefaultScore2`，每个插件的权重为 `1`。
它们可以用不同的权重重新排序，如下所示：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      score:
        enabled:
        - name: 'DefaultScore2'
          weight: 5
```

<!--
In this example, it's unnecessary to specify the plugins in `MultiPoint` explicitly
because they are default plugins. And the only plugin specified in `Score` is `DefaultScore2`.
This is because plugins set through specific extension points will always take precedence
over `MultiPoint` plugins. So, this snippet essentially re-orders the two plugins
without needing to specify both of them.
-->
在这个例子中，没有必要在 `MultiPoint` 中明确指定插件，因为它们是默认插件。
`Score` 中指定的唯一插件是 `DefaultScore2`。
这是因为通过特定扩展点设置的插件将始终优先于 `MultiPoint` 插件。
因此，此代码段实质上重新排序了这两个插件，而无需同时指定它们。

<!--
The general hierarchy for precedence when configuring `MultiPoint` plugins is as follows:
1. Specific extension points run first, and their settings override whatever is set elsewhere
2. Plugins manually configured through `MultiPoint` and their settings
3. Default plugins and their default settings
-->
配置 `MultiPoint` 插件时优先级的一般层次结构如下：

1. 特定的扩展点首先运行，它们的设置会覆盖其他地方的设置
2. 通过 `MultiPoint` 手动配置的插件及其设置
3. 默认插件及其默认设置

<!--
To demonstrate the above hierarchy, the following example is based on these plugins:
|Plugin|Extension Points|
|---|---|
|`DefaultQueueSort`|`QueueSort`|
|`CustomQueueSort`|`QueueSort`|
|`DefaultPlugin1`|`Score`, `Filter`|
|`DefaultPlugin2`|`Score`|
|`CustomPlugin1`|`Score`, `Filter`|
|`CustomPlugin2`|`Score`, `Filter`|
-->
为了演示上述层次结构，以下示例基于这些插件：
|插件|扩展点|
|---|---|
|`DefaultQueueSort`|`QueueSort`|
|`CustomQueueSort`|`QueueSort`|
|`DefaultPlugin1`|`Score`, `Filter`|
|`DefaultPlugin2`|`Score`|
|`CustomPlugin1`|`Score`, `Filter`|
|`CustomPlugin2`|`Score`, `Filter`|

<!--
A valid sample configuration for these plugins would be:
-->
这些插件的一个有效示例配置是：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: 'CustomQueueSort'
        - name: 'CustomPlugin1'
          weight: 3
        - name: 'CustomPlugin2'
        disabled:
        - name: 'DefaultQueueSort'
      filter:
        disabled:
        - name: 'DefaultPlugin1'
      score:
        enabled:
        - name: 'DefaultPlugin2'
```

<!--
Note that there is no error for re-declaring a `MultiPoint` plugin in a specific
extension point. The re-declaration is ignored (and logged), as specific extension points
take precedence.
-->
请注意，在特定扩展点中重新声明 `MultiPoint` 插件不会出错。
重新声明被忽略（并记录），因为特定的扩展点优先。

<!--
Besides keeping most of the config in one spot, this sample does a few things:
-->
除了将大部分配置保存在一个位置之外，此示例还做了一些事情：

<!--
* Enables the custom `queueSort` plugin and disables the default one
* Enables `CustomPlugin1` and `CustomPlugin2`, which will run first for all of their extension points
* Disables `DefaultPlugin1`, but only for `filter`
* Reorders `DefaultPlugin2` to run first in `score` (even before the custom plugins)
-->
* 启用自定义 `queueSort` 插件并禁用默认插件
* 启用 `CustomPlugin1` 和 `CustomPlugin2`，这将首先为它们的所有扩展点运行
* 禁用 `DefaultPlugin1`，但仅适用于 `filter`
* 重新排序 `DefaultPlugin2` 以在 `score` 中首先运行（甚至在自定义插件之前）

<!--
In versions of the config before `v1beta3`, without `multiPoint`, the above snippet would equate to this:
-->
在 `v1beta3` 之前的配置版本中，没有 `multiPoint`，上面的代码片段等同于：

<!--
```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:

      # Disable the default QueueSort plugin
      queueSort:
        enabled:
        - name: 'CustomQueueSort'
        disabled:
        - name: 'DefaultQueueSort'

      # Enable custom Filter plugins
      filter:
        enabled:
        - name: 'CustomPlugin1'
        - name: 'CustomPlugin2'
        - name: 'DefaultPlugin2'
        disabled:
        - name: 'DefaultPlugin1'

      # Enable and reorder custom score plugins
      score:
        enabled:
        - name: 'DefaultPlugin2'
          weight: 1
        - name: 'DefaultPlugin1'
          weight: 3
```
-->
```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:

      # 禁用默认的 QueueSort 插件
      queueSort:
        enabled:
        - name: 'CustomQueueSort'
        disabled:
        - name: 'DefaultQueueSort'

      # 启用自定义的 Filter 插件
      filter:
        enabled:
        - name: 'CustomPlugin1'
        - name: 'CustomPlugin2'
        - name: 'DefaultPlugin2'
        disabled:
        - name: 'DefaultPlugin1'

      # 启用并重新排序自定义的打分插件
      score:
        enabled:
        - name: 'DefaultPlugin2'
          weight: 1
        - name: 'DefaultPlugin1'
          weight: 3
```

<!--
While this is a complicated example, it demonstrates the flexibility of `MultiPoint` config
as well as its seamless integration with the existing methods for configuring extension points.
-->
虽然这是一个复杂的例子，但它展示了 `MultiPoint` 配置的灵活性以及它与配置扩展点的现有方法的无缝集成。

<!--
## Scheduler configuration migrations
-->
## 调度程序配置迁移   {#scheduler-configuration-migrations}

{{< tabs name="tab_with_md" >}}
{{% tab name="v1beta1 → v1beta2" %}}

<!--
* With the v1beta2 configuration version, you can use a new score extension for the
  `NodeResourcesFit` plugin.
  The new extension combines the functionalities of the `NodeResourcesLeastAllocated`,
  `NodeResourcesMostAllocated` and `RequestedToCapacityRatio` plugins.
  For example, if you previously used the `NodeResourcesMostAllocated` plugin, you
  would instead use `NodeResourcesFit` (enabled by default) and add a `pluginConfig`
  with a `scoreStrategy` that is similar to:
-->
* 在 v1beta2 配置版本中，你可以为 `NodeResourcesFit` 插件使用新的 score 扩展。
  新的扩展结合了 `NodeResourcesLeastAllocated`、`NodeResourcesMostAllocated` 和 `RequestedToCapacityRatio` 插件的功能。
  例如，如果你之前使用了 `NodeResourcesMostAllocated` 插件，
  则可以改用 `NodeResourcesFit`（默认启用）并添加一个 `pluginConfig` 和 `scoreStrategy`，类似于：

  ```yaml
  apiVersion: kubescheduler.config.k8s.io/v1beta2
  kind: KubeSchedulerConfiguration
  profiles:
  - pluginConfig:
    - args:
        scoringStrategy:
          resources:
          - name: cpu
            weight: 1
          type: MostAllocated
      name: NodeResourcesFit
  ```

<!--
* The scheduler plugin `NodeLabel` is deprecated; instead, use the [`NodeAffinity`](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) plugin (enabled by default) to achieve similar behavior.
-->
* 调度器插件 `NodeLabel` 已弃用；
  相反，要使用 [`NodeAffinity`](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
  插件（默认启用）来实现类似的行为。

<!--
* The scheduler plugin `ServiceAffinity` is deprecated; instead, use the [`InterPodAffinity`](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity) plugin (enabled by default) to achieve similar behavior.
-->
* 调度程序插件 `ServiceAffinity` 已弃用；
  相反，使用 [`InterPodAffinity`](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
  插件（默认启用）来实现类似的行为。
  
<!--
* The scheduler plugin `NodePreferAvoidPods` is deprecated; instead, use [node taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) to achieve similar behavior.
-->
* 调度器插件 `NodePreferAvoidPods` 已弃用；
  相反，使用[节点污点](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)来实现类似的行为。

<!--
* A plugin enabled in a v1beta2 configuration file takes precedence over the default configuration for that plugin.
-->
* 在 v1beta2 配置文件中启用的插件优先于该插件的默认配置。

<!--
* Invalid `host` or `port` configured for scheduler healthz and metrics bind address will cause validation failure.
-->
* 调度器的健康检查和审计的绑定地址，所配置的 `host` 或 `port` 无效将导致验证失败。

{{% /tab %}}

{{% tab name="v1beta2 → v1beta3" %}}
<!--
* Three plugins' weight are increased by default:
  * `InterPodAffinity` from 1 to 2
  * `NodeAffinity` from 1 to 2
  * `TaintToleration` from 1 to 3
-->
* 默认增加三个插件的权重：
  * `InterPodAffinity` 从 1 到 2
  * `NodeAffinity` 从 1 到 2
  * `TaintToleration` 从 1 到 3
{{% /tab %}}

{{% tab name="v1beta3 → v1" %}}

<!--
* The scheduler plugin `SelectorSpread` is removed, instead, use the `PodTopologySpread` plugin (enabled by default)
to achieve similar behavior.
-->
* 调度器插件 `SelectorSpread` 被移除，改为使用 `PodTopologySpread` 插件（默认启用）来实现类似的行为。

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
* Read the [kube-scheduler reference](/docs/reference/command-line-tools-reference/kube-scheduler/)
* Learn about [scheduling](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Read the [kube-scheduler configuration (v1)](/docs/reference/config-api/kube-scheduler-config.v1/) reference
-->
* 阅读 [kube-scheduler 参考](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)
* 了解[调度](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)
* 阅读 [kube-scheduler 配置 (v1)](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/) 参考
