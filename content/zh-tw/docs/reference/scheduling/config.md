---
title: 調度器配置
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
你可以通過編寫配置文件，並將其路徑傳給 `kube-scheduler` 的命令行參數，定製 `kube-scheduler` 的行爲。

<!-- overview -->

<!-- body -->
<!--
A scheduling Profile allows you to configure the different stages of scheduling
in the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}.
Each stage is exposed in an extension point. Plugins provide scheduling behaviors
by implementing one or more of these extension points.
-->
調度模板（Profile）允許你配置 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
中的不同調度階段。每個階段都暴露於某個擴展點中。插件通過實現一個或多個擴展點來提供調度行爲。

<!--
You can specify scheduling profiles by running `kube-scheduler --config <filename>`,
using the
KubeSchedulerConfiguration [v1](/docs/reference/config-api/kube-scheduler-config.v1/)
struct.
-->
你可以通過運行 `kube-scheduler --config <filename>` 來設置調度模板，
使用 KubeSchedulerConfiguration [v1](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)
結構體。

<!--
A minimal configuration looks as follows:
-->
最簡單的配置如下：

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
KubeSchedulerConfiguration v1beta3 在 v1.26 中已被棄用，
並將在 v1.29 中被移除。請將 KubeSchedulerConfiguration 遷移到
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
通過調度配置文件，你可以配置 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} 在不同階段的調度行爲。
每個階段都在一個[擴展點](#extension-points)中公開。
[調度插件](#scheduling-plugins)通過實現一個或多個擴展點，來提供調度行爲。

<!--
You can configure a single instance of `kube-scheduler` to run
[multiple profiles](#multiple-profiles).
-->
你可以配置同一 `kube-scheduler` 實例使用[多個配置文件](#multiple-profiles)。

<!--
### Extension points
-->
### 擴展點    {#extensions-points}

<!--
Scheduling happens in a series of stages that are exposed through the following
extension points:
-->
調度行爲發生在一系列階段中，這些階段是通過以下擴展點公開的：

<!--
1. `queueSort`: These plugins provide an ordering function that is used to
   sort pending Pods in the scheduling queue. Exactly one queue sort plugin
   may be enabled at a time.
-->
1. `queueSort`：這些插件對調度隊列中的懸決的 Pod 排序。
   一次只能啓用一個隊列排序插件。
<!--
1. `preFilter`: These plugins are used to pre-process or check information
   about a Pod or the cluster before filtering. They can mark a pod as
   unschedulable.
 -->
2. `preFilter`：這些插件用於在過濾之前預處理或檢查 Pod 或集羣的信息。
   它們可以將 Pod 標記爲不可調度。
<!--
1. `filter`: These plugins are the equivalent of Predicates in a scheduling
   Policy and are used to filter out nodes that can not run the Pod. Filters
   are called in the configured order. A pod is marked as unschedulable if no
   nodes pass all the filters.
-->
3. `filter`：這些插件相當於調度策略中的斷言（Predicates），用於過濾不能運行 Pod 的節點。
   過濾器的調用順序是可配置的。
   如果沒有一個節點通過所有過濾器的篩選，Pod 將會被標記爲不可調度。
<!--
1. `postFilter`: These plugins are called in their configured order when no
   feasible nodes were found for the pod. If any `postFilter` plugin marks the
   Pod _schedulable_, the remaining plugins are not called.
--> 
4. `postFilter`：當無法爲 Pod 找到可用節點時，按照這些插件的配置順序調用他們。
   如果任何 `postFilter` 插件將 Pod 標記爲**可調度**，則不會調用其餘插件。
<!--
1. `preScore`: This is an informational extension point that can be used
   for doing pre-scoring work.
-->
5. `preScore`：這是一個信息擴展點，可用於預打分工作。
<!--
1. `score`: These plugins provide a score to each node that has passed the
   filtering phase. The scheduler will then select the node with the highest
   weighted scores sum.
-->
6. `score`：這些插件給通過篩選階段的節點打分。調度器會選擇得分最高的節點。
<!--
1. `reserve`: This is an informational extension point that notifies plugins
   when resources have been reserved for a given Pod. Plugins also implement an
   `Unreserve` call that gets called in the case of failure during or after
   `Reserve`.
-->
7. `reserve`：這是一個信息擴展點，當資源已經預留給 Pod 時，會通知插件。
   這些插件還實現了 `Unreserve` 接口，在 `Reserve` 期間或之後出現故障時調用。
<!--
1. `permit`: These plugins can prevent or delay the binding of a Pod.
-->
8. `permit`：這些插件可以阻止或延遲 Pod 綁定。
<!--
1. `preBind`: These plugins perform any work required before a Pod is bound.
-->
9. `preBind`：這些插件在 Pod 綁定節點之前執行。
<!--
1. `bind`: The plugins bind a Pod to a Node. `bind` plugins are called in order
   and once one has done the binding, the remaining plugins are skipped. At
   least one bind plugin is required.
-->
10. `bind`：這個插件將 Pod 與節點綁定。`bind` 插件是按順序調用的，只要有一個插件完成了綁定，
   其餘插件都會跳過。`bind` 插件至少需要一個。
<!--
1. `postBind`: This is an informational extension point that is called after
   a Pod has been bound.
-->
11. `postBind`：這是一個信息擴展點，在 Pod 綁定了節點之後調用。
<!--
1. `multiPoint`: This is a config-only field that allows plugins to be enabled
   or disabled for all of their applicable extension points simultaneously.
-->
12. `multiPoint`：這是一個僅配置字段，允許同時爲所有適用的擴展點啓用或禁用插件。

<!--
For each extension point, you could disable specific [default plugins](#scheduling-plugins)
or enable your own. For example:
-->
對每個擴展點，你可以禁用[默認插件](#scheduling-plugins)或者是啓用自己的插件，例如：

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
你可以在 `disabled` 數組中使用 `*` 禁用該擴展點的所有默認插件。
如果需要，這個字段也可以用來對插件重新順序。

<!--
### Scheduling plugins
-->
### 調度插件   {#scheduling-plugins}

<!--
The following plugins, enabled by default, implement one or more of these
extension points:
-->
下面默認啓用的插件實現了一個或多個擴展點：

<!--
- `ImageLocality`: Favors nodes that already have the container images that the
  Pod runs.
  Extension points: `score`.
-->
- `ImageLocality`：選擇已經存在 Pod 運行所需容器鏡像的節點。

  實現的擴展點：`score`。

<!--
- `TaintToleration`: Implements
  [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
  Implements extension points: `filter`, `preScore`, `score`.
-->
- `TaintToleration`：實現了[污點和容忍](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。

  實現的擴展點：`filter`、`preScore`、`score`。

<!--
- `NodeName`: Checks if a Pod spec node name matches the current node.
  Extension points: `filter`.
-->
- `NodeName`：檢查 Pod 指定的節點名稱與當前節點是否匹配。

  實現的擴展點：`filter`。

<!--
- `NodePorts`: Checks if a node has free ports for the requested Pod ports.
  Extension points: `preFilter`, `filter`.
-->
- `NodePorts`：檢查 Pod 請求的端口在節點上是否可用。

  實現的擴展點：`preFilter`、`filter`。

<!--
- `NodeAffinity`: Implements
  [node selectors](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
  and [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).
  Extension points: `filter`, `score`.
-->
- `NodeAffinity`：實現了[節點選擇器](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
  和[節點親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)。

  實現的擴展點：`filter`、`score`。

<!--
- `PodTopologySpread`: Implements
  [Pod topology spread](/docs/concepts/scheduling-eviction/topology-spread-constraints/).
  Extension points: `preFilter`, `filter`, `preScore`, `score`.
-->
- `PodTopologySpread`：實現了 [Pod 拓撲分佈](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)。

  實現的擴展點：`preFilter`、`filter`、`preScore`、`score`。

<!--
- `NodeUnschedulable`: Filters out nodes that have `.spec.unschedulable` set to
  true.
  Extension points: `filter`.
-->
- `NodeUnschedulable`：過濾 `.spec.unschedulable` 值爲 true 的節點。

  實現的擴展點：`filter`。

<!--
- `NodeResourcesFit`: Checks if the node has all the resources that the Pod is
  requesting. The score can use one of three strategies: `LeastAllocated`
  (default), `MostAllocated` and `RequestedToCapacityRatio`.
  Extension points: `preFilter`, `filter`, `score`.
-->
- `NodeResourcesFit`：檢查節點是否擁有 Pod 請求的所有資源。
  得分可以使用以下三種策略之一：`LeastAllocated`（默認）、`MostAllocated`
  和 `RequestedToCapacityRatio`。

  實現的擴展點：`preFilter`、`filter`、`score`。

<!--
- `NodeResourcesBalancedAllocation`: Favors nodes that would obtain a more
  balanced resource usage if the Pod is scheduled there.
  Extension points: `score`.
-->
- `NodeResourcesBalancedAllocation`：調度 Pod 時，選擇資源使用更爲均衡的節點。

  實現的擴展點：`score`。

<!--
- `VolumeBinding`: Checks if the node has or if it can bind the requested
  {{< glossary_tooltip text="volumes" term_id="volume" >}}.
  Extension points: `preFilter`, `filter`, `reserve`, `preBind`, `score`.
-->
- `VolumeBinding`：檢查節點是否有請求的卷，或是否可以綁定請求的{{< glossary_tooltip text="卷" term_id="volume" >}}。
  實現的擴展點：`preFilter`、`filter`、`reserve`、`preBind` 和 `score`。

  {{< note >}}
  <!--
  `score` extension point is enabled when `StorageCapacityScoring` feature is
  enabled. It prioritizes the smallest PVs that can fit the requested volume
  size.
  -->
  當 `StorageCapacityScoring` 特性被啓用時，`score` 擴展點也被啓用。
  它優先考慮可以滿足所需卷大小的最小 PV。
  {{< /note >}}
  
<!--
- `VolumeRestrictions`: Checks that volumes mounted in the node satisfy
  restrictions that are specific to the volume provider.
  Extension points: `filter`.
-->
- `VolumeRestrictions`：檢查掛載到節點上的卷是否滿足卷提供程序的限制。

  實現的擴展點：`filter`。

<!--
- `VolumeZone`: Checks that volumes requested satisfy any zone requirements they
  might have.
  Extension points: `filter`.
-->
- `VolumeZone`：檢查請求的卷是否在任何區域都滿足。

  實現的擴展點：`filter`。

<!--
- `NodeVolumeLimits`: Checks that CSI volume limits can be satisfied for the
  node.
  Extension points: `filter`.
-->
- `NodeVolumeLimits`：檢查該節點是否滿足 CSI 卷限制。

  實現的擴展點：`filter`。

<!--
- `EBSLimits`: Checks that AWS EBS volume limits can be satisfied for the node.
  Extension points: `filter`.
-->
- `EBSLimits`：檢查節點是否滿足 AWS EBS 卷限制。

  實現的擴展點：`filter`。

<!--
- `GCEPDLimits`: Checks that GCP-PD volume limits can be satisfied for the node.
  Extension points: `filter`.
-->
- `GCEPDLimits`：檢查該節點是否滿足 GCP-PD 卷限制。

  實現的擴展點：`filter`。

<!--
- `AzureDiskLimits`: Checks that Azure disk volume limits can be satisfied for
  the node.
  Extension points: `filter`.
-->
- `AzureDiskLimits`：檢查該節點是否滿足 Azure 卷限制。

  實現的擴展點：`filter`。

<!--
- `InterPodAffinity`: Implements
  [inter-Pod affinity and anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity).
  Extension points: `preFilter`, `filter`, `preScore`, `score`.
-->
- `InterPodAffinity`：實現 [Pod 間親和性與反親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)。

  實現的擴展點：`preFilter`、`filter`、`preScore`、`score`。

<!--
- `PrioritySort`: Provides the default priority based sorting.
  Extension points: `queueSort`.
-->
- `PrioritySort`：提供默認的基於優先級的排序。

  實現的擴展點：`queueSort`。

<!--
- `DefaultBinder`: Provides the default binding mechanism.
  Extension points: `bind`.
-->
- `DefaultBinder`：提供默認的綁定機制。

  實現的擴展點：`bind`。

<!--
- `DefaultPreemption`: Provides the default preemption mechanism.
  Extension points: `postFilter`.
-->
- `DefaultPreemption`：提供默認的搶佔機制。

  實現的擴展點：`postFilter`。

<!--
You can also enable the following plugins, through the component config APIs,
that are not enabled by default:
-->
你也可以通過組件配置 API 啓用以下插件（默認不啓用）：

<!--
- `CinderLimits`: Checks that [OpenStack Cinder](https://docs.openstack.org/cinder/)
  volume limits can be satisfied for the node.
  Extension points: `filter`.
-->
- `CinderLimits`：檢查是否可以滿足節點的 [OpenStack Cinder](https://docs.openstack.org/cinder/) 卷限制。
  實現的擴展點：`filter`。

<!--
### Multiple profiles

You can configure `kube-scheduler` to run more than one profile.
Each profile has an associated scheduler name and can have a different set of
plugins configured in its [extension points](#extension-points).
-->
### 多配置文件 {#multiple-profiles}

你可以配置 `kube-scheduler` 運行多個配置文件。
每個配置文件都有一個關聯的調度器名稱，並且可以在其擴展點中配置一組不同的插件。

<!--
With the following sample configuration, the scheduler will run with two
profiles: one with the default plugins and one with all scoring plugins
disabled.
-->
使用下面的配置樣例，調度器將運行兩個配置文件：一個使用默認插件，另一個禁用所有打分插件。

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
對於那些希望根據特定配置文件來進行調度的 Pod，可以在 `.spec.schedulerName` 字段指定相應的調度器名稱。

<!--
By default, one profile with the scheduler name `default-scheduler` is created.
This profile includes the default plugins described above. When declaring more
than one profile, a unique scheduler name for each of them is required.
-->
默認情況下，將創建一個調度器名爲 `default-scheduler` 的配置文件。
這個配置文件包括上面描述的所有默認插件。
聲明多個配置文件時，每個配置文件中調度器名稱必須唯一。

<!--
If a Pod doesn't specify a scheduler name, kube-apiserver will set it to
`default-scheduler`. Therefore, a profile with this scheduler name should exist
to get those pods scheduled.
-->
如果 Pod 未指定調度器名稱，kube-apiserver 將會把調度器名設置爲 `default-scheduler`。
因此，應該存在一個調度器名爲 `default-scheduler` 的配置文件來調度這些 Pod。

{{< note >}}
<!--
Pod's scheduling events have `.spec.schedulerName` as their `reportingController`.
Events for leader election use the scheduler name of the first profile in the list.

For more information, please refer to the `reportingController` section under
[Event API Reference](/docs/reference/kubernetes-api/cluster-resources/event-v1/).
-->
Pod 的調度事件把 `.spec.schedulerName` 字段值作爲它們的 `ReportingController`。
領導者選舉事件使用列表中第一個配置文件的調度器名稱。

有關更多信息，請參閱
[Event API 參考文檔](/zh-cn/docs/reference/kubernetes-api/cluster-resources/event-v1/)中的
`reportingController` 一節。
{{< /note >}}

{{< note >}}
<!--
All profiles must use the same plugin in the `queueSort` extension point and have
the same configuration parameters (if applicable). This is because the scheduler
only has one pending pods queue.
-->
所有配置文件必須在 `queueSort` 擴展點使用相同的插件，並具有相同的配置參數（如果適用）。
這是因爲調度器只有一個保存 pending 狀態 Pod 的隊列。
{{< /note >}}

<!--
### Plugins that apply to multiple extension points {#multipoint}
-->
### 應用於多個擴展點的插件 {#multipoint}

<!--
Starting from `kubescheduler.config.k8s.io/v1beta3`, there is an additional field in the
profile config, `multiPoint`, which allows for easily enabling or disabling a plugin
across several extension points. The intent of `multiPoint` config is to simplify the
configuration needed for users and administrators when using custom profiles.
-->
從 `kubescheduler.config.k8s.io/v1beta3` 開始，配置文件配置中有一個附加字段
`multiPoint`，它允許跨多個擴展點輕鬆啓用或禁用插件。
`multiPoint` 配置的目的是簡化用戶和管理員在使用自定義配置文件時所需的配置。

<!--
Consider a plugin, `MyPlugin`, which implements the `preScore`, `score`, `preFilter`,
and `filter` extension points. To enable `MyPlugin` for all its available extension
points, the profile config looks like:
-->
考慮一個插件，`MyPlugin`，它實現了 `preScore`、`score`、`preFilter` 和 `filter` 擴展點。
要爲其所有可用的擴展點啓用 `MyPlugin`，配置文件配置如下所示：

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
這相當於爲所有擴展點手動啓用 `MyPlugin`，如下所示：

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
在這裏使用 `multiPoint` 的一個好處是，如果 `MyPlugin` 將來實現另一個擴展點，`multiPoint` 配置將自動爲新擴展啓用它。

<!--
Specific extension points can be excluded from `MultiPoint` expansion using
the `disabled` field for that extension point. This works with disabling default
plugins, non-default plugins, or with the wildcard (`'*'`) to disable all plugins.
An example of this, disabling `Score` and `PreScore`, would be:
-->
可以使用該擴展點的 `disabled` 字段將特定擴展點從 `MultiPoint` 擴展中排除。
這適用於禁用默認插件、非默認插件或使用通配符 (`'*'`) 來禁用所有插件。
禁用 `Score` 和 `PreScore` 的一個例子是：

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
從 `kubescheduler.config.k8s.io/v1beta3` 開始，所有[默認插件](#scheduling-plugins)都通過 `MultiPoint` 在內部啓用。
但是，仍然可以使用單獨的擴展點來靈活地重新配置默認值（例如排序和分數權重）。
例如，考慮兩個 Score 插件 `DefaultScore1` 和 `DefaultScore2`，每個插件的權重爲 `1`。
它們可以用不同的權重重新排序，如下所示：

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
在這個例子中，沒有必要在 `MultiPoint` 中明確指定插件，因爲它們是默認插件。
`Score` 中指定的唯一插件是 `DefaultScore2`。
這是因爲通過特定擴展點設置的插件將始終優先於 `MultiPoint` 插件。
因此，此代碼段實質上重新排序了這兩個插件，而無需同時指定它們。

<!--
The general hierarchy for precedence when configuring `MultiPoint` plugins is as follows:
1. Specific extension points run first, and their settings override whatever is set elsewhere
2. Plugins manually configured through `MultiPoint` and their settings
3. Default plugins and their default settings
-->
配置 `MultiPoint` 插件時優先級的一般層次結構如下：

1. 特定的擴展點首先運行，它們的設置會覆蓋其他地方的設置
2. 通過 `MultiPoint` 手動配置的插件及其設置
3. 默認插件及其默認設置

<!--
To demonstrate the above hierarchy, the following example is based on these plugins:
| Plugin             | Extension Points  |
| ------------------ | ----------------- |
| `DefaultQueueSort` | `QueueSort`       |
| `CustomQueueSort`  | `QueueSort`       |
| `DefaultPlugin1`   | `Score`, `Filter` |
| `DefaultPlugin2`   | `Score`           |
| `CustomPlugin1`    | `Score`, `Filter` |
| `CustomPlugin2`    | `Score`, `Filter` |
-->
爲了演示上述層次結構，以下示例基於這些插件：
|插件                |擴展點              |
| ------------------ | ----------------- |
| `DefaultQueueSort` | `QueueSort`       |
| `CustomQueueSort`  | `QueueSort`       |
| `DefaultPlugin1`   | `Score`、`Filter` |
| `DefaultPlugin2`   | `Score`           |
| `CustomPlugin1`    | `Score`、`Filter` |
| `CustomPlugin2`    | `Score`、`Filter` |

<!--
A valid sample configuration for these plugins would be:
-->
這些插件的一個有效示例配置是：

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
請注意，在特定擴展點中重新聲明 `MultiPoint` 插件不會出錯。
重新聲明被忽略（並記錄），因爲特定的擴展點優先。

<!--
Besides keeping most of the config in one spot, this sample does a few things:
-->
除了將大部分配置保存在一個位置之外，此示例還做了一些事情：

<!--
* Enables the custom `queueSort` plugin and disables the default one
* Enables `CustomPlugin1` and `CustomPlugin2`, which will run first for all of their extension points
* Disables `DefaultPlugin1`, but only for `filter`
* Reorders `DefaultPlugin2` to run first in `score` (even before the custom plugins)
-->
* 啓用自定義 `queueSort` 插件並禁用默認插件
* 啓用 `CustomPlugin1` 和 `CustomPlugin2`，這將首先爲它們的所有擴展點運行
* 禁用 `DefaultPlugin1`，但僅適用於 `filter`
* 重新排序 `DefaultPlugin2` 以在 `score` 中首先運行（甚至在自定義插件之前）

<!--
In versions of the config before `v1beta3`, without `multiPoint`, the above snippet would equate to this:
-->
在 `v1beta3` 之前的配置版本中，沒有 `multiPoint`，上面的代碼片段等同於：

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

      # 禁用默認的 QueueSort 插件
      queueSort:
        enabled:
        - name: 'CustomQueueSort'
        disabled:
        - name: 'DefaultQueueSort'

      # 啓用自定義的 Filter 插件
      filter:
        enabled:
        - name: 'CustomPlugin1'
        - name: 'CustomPlugin2'
        - name: 'DefaultPlugin2'
        disabled:
        - name: 'DefaultPlugin1'

      # 啓用並重新排序自定義的打分插件
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
雖然這是一個複雜的例子，但它展示了 `MultiPoint` 配置的靈活性以及它與配置擴展點的現有方法的無縫集成。

<!--
## Scheduler configuration migrations
-->
## 調度程序配置遷移   {#scheduler-configuration-migrations}

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
* 在 v1beta2 配置版本中，你可以爲 `NodeResourcesFit` 插件使用新的 score 擴展。
  新的擴展結合了 `NodeResourcesLeastAllocated`、`NodeResourcesMostAllocated` 和 `RequestedToCapacityRatio` 插件的功能。
  例如，如果你之前使用了 `NodeResourcesMostAllocated` 插件，
  則可以改用 `NodeResourcesFit`（默認啓用）並添加一個 `pluginConfig` 和 `scoreStrategy`，類似於：

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
* 調度器插件 `NodeLabel` 已棄用；
  相反，要使用 [`NodeAffinity`](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
  插件（默認啓用）來實現類似的行爲。

<!--
* The scheduler plugin `ServiceAffinity` is deprecated; instead, use the [`InterPodAffinity`](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity) plugin (enabled by default) to achieve similar behavior.
-->
* 調度程序插件 `ServiceAffinity` 已棄用；
  相反，使用 [`InterPodAffinity`](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
  插件（默認啓用）來實現類似的行爲。
  
<!--
* The scheduler plugin `NodePreferAvoidPods` is deprecated; instead, use [node taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) to achieve similar behavior.
-->
* 調度器插件 `NodePreferAvoidPods` 已棄用；
  相反，使用[節點污點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)來實現類似的行爲。

<!--
* A plugin enabled in a v1beta2 configuration file takes precedence over the default configuration for that plugin.
-->
* 在 v1beta2 配置文件中啓用的插件優先於該插件的默認配置。

<!--
* Invalid `host` or `port` configured for scheduler healthz and metrics bind address will cause validation failure.
-->
* 調度器的健康檢查和審計的綁定地址，所配置的 `host` 或 `port` 無效將導致驗證失敗。

{{% /tab %}}

{{% tab name="v1beta2 → v1beta3" %}}
<!--
* Three plugins' weight are increased by default:
  * `InterPodAffinity` from 1 to 2
  * `NodeAffinity` from 1 to 2
  * `TaintToleration` from 1 to 3
-->
* 默認增加三個插件的權重：
  * `InterPodAffinity` 從 1 到 2
  * `NodeAffinity` 從 1 到 2
  * `TaintToleration` 從 1 到 3
{{% /tab %}}

{{% tab name="v1beta3 → v1" %}}

<!--
* The scheduler plugin `SelectorSpread` is removed, instead, use the `PodTopologySpread` plugin (enabled by default)
to achieve similar behavior.
-->
* 調度器插件 `SelectorSpread` 被移除，改爲使用 `PodTopologySpread` 插件（默認啓用）來實現類似的行爲。

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
* Read the [kube-scheduler reference](/docs/reference/command-line-tools-reference/kube-scheduler/)
* Learn about [scheduling](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Read the [kube-scheduler configuration (v1)](/docs/reference/config-api/kube-scheduler-config.v1/) reference
-->
* 閱讀 [kube-scheduler 參考](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)
* 瞭解[調度](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)
* 閱讀 [kube-scheduler 配置 (v1)](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/) 參考
