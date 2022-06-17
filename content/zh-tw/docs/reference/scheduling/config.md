---
title: 排程器配置
content_type: concept
weight: 20
---
<!--
title: Scheduler Configuration
content_type: concept
weight: 20
-->
{{< feature-state for_k8s_version="v1.19" state="beta" >}}

<!--
You can customize the behavior of the `kube-scheduler` by writing a configuration
file and passing its path as a command line argument.
-->
你可以透過編寫配置檔案，並將其路徑傳給 `kube-scheduler` 的命令列引數，定製 `kube-scheduler` 的行為。

<!-- overview -->

<!-- body -->
<!--
A scheduling Profile allows you to configure the different stages of scheduling
in the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}.
Each stage is exposed in an extension point. Plugins provide scheduling behaviors
by implementing one or more of these extension points.
-->
排程模板（Profile）允許你配置 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
中的不同調度階段。每個階段都暴露於某個擴充套件點中。外掛透過實現一個或多個擴充套件點來提供排程行為。

<!--
You can specify scheduling profiles by running `kube-scheduler --config <filename>`,
using the 
KubeSchedulerConfiguration ([v1beta2](/docs/reference/config-api/kube-scheduler-config.v1beta2/)
or [v1beta3](/docs/reference/config-api/kube-scheduler-config.v1beta3/))
struct.
-->
你可以透過執行 `kube-scheduler --config <filename>` 來設定排程模板，
使用 KubeSchedulerConfiguration （[v1beta2](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta2/)
或者 [v1beta3](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta3/)） 結構體。

<!-- A minimal configuration looks as follows: -->
最簡單的配置如下：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
clientConnection:
  kubeconfig: /etc/srv/kubernetes/kube-scheduler/kubeconfig
```

<!-- ## Profiles -->
## 配置檔案    {#profiles}

<!--  
A scheduling Profile allows you to configure the different stages of scheduling
in the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}.
Each stage is exposed in an [extension point](#extension-points).
[Plugins](#scheduling-plugins) provide scheduling behaviors by implementing one
or more of these extension points.
-->
透過排程配置檔案，你可以配置 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} 在不同階段的排程行為。
每個階段都在一個[擴充套件點](#extension-points)中公開。
[排程外掛](#scheduling-plugins)透過實現一個或多個擴充套件點，來提供排程行為。

<!--  
You can configure a single instance of `kube-scheduler` to run
[multiple profiles](#multiple-profiles).
-->
你可以配置同一 `kube-scheduler` 例項使用[多個配置檔案](#multiple-profiles)。

<!-- ### Extension points -->
### 擴充套件點    {#extensions-points}

<!--  
Scheduling happens in a series of stages that are exposed through the following
extension points:
-->
排程行為發生在一系列階段中，這些階段是透過以下擴充套件點公開的：

<!--  
1. `queueSort`: These plugins provide an ordering function that is used to
   sort pending Pods in the scheduling queue. Exactly one queue sort plugin
   may be enabled at a time.
-->
1. `queueSort`：這些外掛對排程佇列中的懸決的 Pod 排序。
   一次只能啟用一個佇列排序外掛。
<!--
2. `preFilter`: These plugins are used to pre-process or check information
   about a Pod or the cluster before filtering. They can mark a pod as
   unschedulable.
 -->
2. `preFilter`：這些外掛用於在過濾之前預處理或檢查 Pod 或叢集的資訊。
   它們可以將 Pod 標記為不可排程。
<!--
3. `filter`: These plugins are the equivalent of Predicates in a scheduling
   Policy and are used to filter out nodes that can not run the Pod. Filters
   are called in the configured order. A pod is marked as unschedulable if no
   nodes pass all the filters.
-->
3. `filter`：這些外掛相當於排程策略中的斷言（Predicates），用於過濾不能執行 Pod 的節點。
   過濾器的呼叫順序是可配置的。
   如果沒有一個節點透過所有過濾器的篩選，Pod 將會被標記為不可排程。
<!--
4. `postFilter`: These plugins are called in their configured order when no
   feasible nodes were found for the pod. If any `postFilter` plugin marks the
   Pod _schedulable_, the remaining plugins are not called.
--> 
4. `postFilter`：當無法為 Pod 找到可用節點時，按照這些外掛的配置順序呼叫他們。
   如果任何 `postFilter` 外掛將 Pod 標記為“可排程”，則不會呼叫其餘外掛。
<!--
1. `preScore`: This is an informational extension point that can be used
   for doing pre-scoring work.
-->
5. `preScore`：這是一個資訊擴充套件點，可用於預打分工作。
<!--  
6. `score`: These plugins provide a score to each node that has passed the
   filtering phase. The scheduler will then select the node with the highest
   weighted scores sum.
-->
6. `score`：這些外掛給透過篩選階段的節點打分。排程器會選擇得分最高的節點。
<!--  
7. `reserve`: This is an informational extension point that notifies plugins
   when resources have been reserved for a given Pod. Plugins also implement an
   `Unreserve` call that gets called in the case of failure during or after
   `Reserve`.
-->
7. `reserve`：這是一個資訊擴充套件點，當資源已經預留給 Pod 時，會通知外掛。
   這些外掛還實現了 `Unreserve` 介面，在 `Reserve` 期間或之後出現故障時呼叫。
<!-- 8. `permit`: These plugins can prevent or delay the binding of a Pod. -->
8. `permit`：這些外掛可以阻止或延遲 Pod 繫結。
<!-- 9. `preBind`: These plugins perform any work required before a Pod is bound.-->
9. `preBind`：這些外掛在 Pod 繫結節點之前執行。
<!--  
10. `bind`: The plugins bind a Pod to a Node. Bind plugins are called in order
   and once one has done the binding, the remaining plugins are skipped. At
   least one bind plugin is required.
-->
10. `bind`：這個外掛將 Pod 與節點繫結。繫結外掛是按順序呼叫的，只要有一個外掛完成了繫結，其餘外掛都會跳過。繫結外掛至少需要一個。
<!--
11. `postBind`: This is an informational extension point that is called after
   a Pod has been bound.
-->
11. `postBind`：這是一個資訊擴充套件點，在 Pod 綁定了節點之後呼叫。
<!--
12. `multiPoint`: This is a config-only field that allows plugins to be enabled
    or disabled for all of their applicable extension points simultaneously.
-->
12. `multiPoint`：這是一個僅配置欄位，允許同時為所有適用的擴充套件點啟用或禁用外掛。

<!--
For each extension point, you could disable specific [default plugins](#scheduling-plugins)
or enable your own. For example:
-->
對每個擴充套件點，你可以禁用[預設外掛](#scheduling-plugins)或者是啟用自己的外掛，例如：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
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
你可以在 `disabled` 陣列中使用 `*` 禁用該擴充套件點的所有預設外掛。
如果需要，這個欄位也可以用來對外掛重新順序。

<!-- ### Scheduling plugins -->
### 排程外掛   {#scheduling-plugins}

<!--  
The following plugins, enabled by default, implement one or more of these
extension points:
-->
下面預設啟用的外掛實現了一個或多個擴充套件點：

<!--  
- `ImageLocality`: Favors nodes that already have the container images that the
  Pod runs.
  Extension points: `score`.
-->
- `ImageLocality`：選擇已經存在 Pod 執行所需容器映象的節點。

  實現的擴充套件點：`score`。
<!--  
- `TaintToleration`: Implements
  [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
  Implements extension points: `filter`, `prescore`, `score`.
-->
- `TaintToleration`：實現了[汙點和容忍](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。

  實現的擴充套件點：`filter`，`prescore`，`score`。
<!--  
- `NodeName`: Checks if a Pod spec node name matches the current node.
  Extension points: `filter`.
-->
- `NodeName`：檢查 Pod 指定的節點名稱與當前節點是否匹配。

  實現的擴充套件點：`filter`。
<!--  
- `NodePorts`: Checks if a node has free ports for the requested Pod ports.
  Extension points: `preFilter`, `filter`.
-->
- `NodePorts`：檢查 Pod 請求的埠在節點上是否可用。

  實現的擴充套件點：`preFilter`，`filter`。

<!--  
- `NodeAffinity`: Implements
  [node selectors](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
  and [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).
  Extension points: `filter`, `score`.
-->
- `NodeAffinity`：實現了[節點選擇器](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
  和[節點親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)。

  實現的擴充套件點：`filter`，`score`.
<!--  
- `PodTopologySpread`: Implements
  [Pod topology spread](/docs/concepts/workloads/pods/pod-topology-spread-constraints/).
  Extension points: `preFilter`, `filter`, `preScore`, `score`.
-->
- `PodTopologySpread`：實現了 [Pod 拓撲分佈](/zh-cn/docs/concepts/workloads/pods/pod-topology-spread-constraints/)。

  實現的擴充套件點：`preFilter`，`filter`，`preScore`，`score`。
<!--  
- `NodeUnschedulable`: Filters out nodes that have `.spec.unschedulable` set to
  true.
  Extension points: `filter`.
-->
- `NodeUnschedulable`：過濾 `.spec.unschedulable` 值為 true 的節點。

  實現的擴充套件點：`filter`。
<!--  
- `NodeResourcesFit`: Checks if the node has all the resources that the Pod is
  requesting. The score can use one of three strategies: `LeastAllocated`
  (default), `MostAllocated` and `RequestedToCapacityRatio`.
  Extension points: `preFilter`, `filter`, `score`.
-->
- `NodeResourcesFit`：檢查節點是否擁有 Pod 請求的所有資源。
  得分可以使用以下三種策略之一：`LeastAllocated`（預設）、`MostAllocated`
  和`RequestedToCapacityRatio`。

  實現的擴充套件點：`preFilter`，`filter`，`score`。
<!--  
- `NodeResourcesBalancedAllocation`: Favors nodes that would obtain a more
  balanced resource usage if the Pod is scheduled there.
  Extension points: `score`.
-->
- `NodeResourcesBalancedAllocation`：排程 Pod 時，選擇資源使用更為均衡的節點。

  實現的擴充套件點：`score`。

<!--  
- `VolumeBinding`: Checks if the node has or if it can bind the requested
  {{< glossary_tooltip text="volumes" term_id="volume" >}}.
  Extension points: `preFilter`, `filter`, `reserve`, `preBind`, `score`.
  {{< note >}}
  `score` extension point is enabled when `VolumeCapacityPriority` feature is
  enabled. It prioritizes the smallest PVs that can fit the requested volume
  size.
  {{< /note >}}
-->
- `VolumeBinding`：檢查節點是否有請求的卷，或是否可以繫結請求的卷。
  實現的擴充套件點: `preFilter`、`filter`、`reserve`、`preBind` 和 `score`。
  {{< note >}}
  當 `VolumeCapacityPriority` 特性被啟用時，`score` 擴充套件點也被啟用。
  它優先考慮可以滿足所需卷大小的最小 PV。
  {{< /note >}}
  
<!--
- `VolumeRestrictions`: Checks that volumes mounted in the node satisfy
  restrictions that are specific to the volume provider.
  Extension points: `filter`.
-->
- `VolumeRestrictions`：檢查掛載到節點上的卷是否滿足卷提供程式的限制。

  實現的擴充套件點：`filter`。
<!--  
- `VolumeZone`: Checks that volumes requested satisfy any zone requirements they
  might have.
  Extension points: `filter`.
-->
- `VolumeZone`：檢查請求的卷是否在任何區域都滿足。

  實現的擴充套件點：`filter`。
<!--
- `NodeVolumeLimits`: Checks that CSI volume limits can be satisfied for the
  node.
  Extension points: `filter`.
-->
- `NodeVolumeLimits`：檢查該節點是否滿足 CSI 卷限制。

  實現的擴充套件點：`filter`。
<!--  
- `EBSLimits`: Checks that AWS EBS volume limits can be satisfied for the node.
  Extension points: `filter`.
-->
- `EBSLimits`：檢查節點是否滿足 AWS EBS 卷限制。

  實現的擴充套件點：`filter`。
<!--  
- `GCEPDLimits`: Checks that GCP-PD volume limits can be satisfied for the node.
  Extension points: `filter`.
-->
- `GCEPDLimits`：檢查該節點是否滿足 GCP-PD 卷限制。

  實現的擴充套件點：`filter`。
<!--  
- `AzureDiskLimits`: Checks that Azure disk volume limits can be satisfied for
  the node.
  Extension points: `filter`.
-->
- `AzureDiskLimits`：檢查該節點是否滿足 Azure 卷限制。

  實現的擴充套件點：`filter`。
<!--  
- `InterPodAffinity`: Implements
  [inter-Pod affinity and anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity).
  Extension points: `preFilter`, `filter`, `preScore`, `score`.
-->
- `InterPodAffinity`：實現 [Pod 間親和性與反親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)。

  實現的擴充套件點：`preFilter`，`filter`，`preScore`，`score`。
<!--  
- `PrioritySort`: Provides the default priority based sorting.
  Extension points: `queueSort`.
-->
- `PrioritySort`：提供預設的基於優先順序的排序。

  實現的擴充套件點：`queueSort`。
<!--  
- `DefaultBinder`: Provides the default binding mechanism.
  Extension points: `bind`.
-->
- `DefaultBinder`：提供預設的繫結機制。

  實現的擴充套件點：`bind`。
<!--  
- `DefaultPreemption`: Provides the default preemption mechanism.
  Extension points: `PostFilter`.
-->
- `DefaultPreemption`：提供預設的搶佔機制。

  實現的擴充套件點：`postFilter`。

<!--  
You can also enable the following plugins, through the component config APIs,
that are not enabled by default:
-->
你也可以透過元件配置 API 啟用以下外掛（預設不啟用）:

<!--
- `SelectorSpread`: Favors spreading across nodes for Pods that belong to
  {{< glossary_tooltip text="Services" term_id="service" >}},
  {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} and
  {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}}.
  Extension points: `preScore`, `score`.
-->
- `SelectorSpread`：偏向把屬於
  {{< glossary_tooltip text="Services" term_id="service" >}}，
  {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} 和
  {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}} 的 Pod 跨節點分佈。

  實現的擴充套件點：`preScore`，`score`。

<!--
- `CinderLimits`: Checks that [OpenStack Cinder](https://docs.openstack.org/cinder/)
  volume limits can be satisfied for the node.
  Extension points: `filter`.
-->
- `CinderLimits`：檢查是否可以滿足節點的 [OpenStack Cinder](https://docs.openstack.org/cinder/)
卷限制


### 多配置檔案    {#multiple-profiles}

<!--  
You can configure `kube-scheduler` to run more than one profile.
Each profile has an associated scheduler name and can have a different set of
plugins configured in its [extension points](#extension-points).
-->
你可以配置 `kube-scheduler` 執行多個配置檔案。
每個配置檔案都有一個關聯的排程器名稱，並且可以在其擴充套件點中配置一組不同的外掛。

<!--  
With the following sample configuration, the scheduler will run with two
profiles: one with the default plugins and one with all scoring plugins
disabled.
-->
使用下面的配置樣例，排程器將執行兩個配置檔案：一個使用預設外掛，另一個禁用所有打分外掛。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
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
對於那些希望根據特定配置檔案來進行排程的 Pod，可以在 `.spec.schedulerName` 欄位指定相應的排程器名稱。

<!--  
By default, one profile with the scheduler name `default-scheduler` is created.
This profile includes the default plugins described above. When declaring more
than one profile, a unique scheduler name for each of them is required.
-->
預設情況下，將建立一個排程器名為 `default-scheduler` 的配置檔案。
這個配置檔案包括上面描述的所有預設外掛。
宣告多個配置檔案時，每個配置檔案中排程器名稱必須唯一。

<!--  
If a Pod doesn't specify a scheduler name, kube-apiserver will set it to
`default-scheduler`. Therefore, a profile with this scheduler name should exist
to get those pods scheduled.
-->
如果 Pod 未指定排程器名稱，kube-apiserver 將會把排程器名設定為 `default-scheduler`。
因此，應該存在一個排程器名為 `default-scheduler` 的配置檔案來排程這些 Pod。

{{< note >}}
<!--  
Pod's scheduling events have `.spec.schedulerName` as the ReportingController.
Events for leader election use the scheduler name of the first profile in the
list.
-->
Pod 的排程事件把 `.spec.schedulerName` 欄位值作為 ReportingController。
領導者選舉事件使用列表中第一個配置檔案的排程器名稱。
{{< /note >}}

{{< note >}}
<!--  
All profiles must use the same plugin in the queueSort extension point and have
the same configuration parameters (if applicable). This is because the scheduler
only has one pending pods queue.
-->
所有配置檔案必須在 queueSort 擴充套件點使用相同的外掛，並具有相同的配置引數（如果適用）。
這是因為排程器只有一個儲存 pending 狀態 Pod 的佇列。

{{< /note >}}

<!--
### Plugins that apply to multiple extension points {#multipoint}
-->

### 應用於多個擴充套件點的外掛 {#multipoint}

<!--
Starting from `kubescheduler.config.k8s.io/v1beta3`, there is an additional field in the
profile config, `multiPoint`, which allows for easily enabling or disabling a plugin
across several extension points. The intent of `multiPoint` config is to simplify the
configuration needed for users and administrators when using custom profiles.
-->
從 `kubescheduler.config.k8s.io/v1beta3` 開始，配置檔案配置中有一個附加欄位 `multiPoint`，它允許跨多個擴充套件點輕鬆啟用或禁用外掛。
`multiPoint` 配置的目的是簡化使用者和管理員在使用自定義配置檔案時所需的配置。

<!--
Consider a plugin, `MyPlugin`, which implements the `preScore`, `score`, `preFilter`,
and `filter` extension points. To enable `MyPlugin` for all its available extension
points, the profile config looks like:
-->

考慮一個外掛，`MyPlugin`，它實現了 `preScore`、`score`、`preFilter` 和 `filter` 擴充套件點。
要為其所有可用的擴充套件點啟用 `MyPlugin`，配置檔案配置如下所示：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
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

這相當於為所有擴充套件點手動啟用`MyPlugin`，如下所示：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
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

在這裡使用 `multiPoint` 的一個好處是，如果 `MyPlugin` 將來實現另一個擴充套件點，`multiPoint` 配置將自動為新擴充套件啟用它。

<!--
Specific extension points can be excluded from `MultiPoint` expansion using
the `disabled` field for that extension point. This works with disabling default
plugins, non-default plugins, or with the wildcard (`'*'`) to disable all plugins.
An example of this, disabling `Score` and `PreScore`, would be:
-->

可以使用該擴充套件點的 `disabled` 欄位將特定擴充套件點從 `MultiPoint` 擴充套件中排除。 
這適用於禁用預設外掛、非預設外掛或使用萬用字元 (`'*'`) 來禁用所有外掛。 
禁用 `Score` 和 `PreScore` 的一個例子是：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
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
In `v1beta3`, all [default plugins](#scheduling-plugins) are enabled internally through `MultiPoint`.
However, individual extension points are still available to allow flexible
reconfiguration of the default values (such as ordering and Score weights). For
example, consider two Score plugins `DefaultScore1` and `DefaultScore2`, each with
a weight of `1`. They can be reordered with different weights like so:
-->

在 `v1beta3` 中，所有 [預設外掛](#scheduling-plugins) 都透過 `MultiPoint` 在內部啟用。 
但是，仍然可以使用單獨的擴充套件點來靈活地重新配置預設值（例如排序和分數權重）。 
例如，考慮兩個Score外掛 `DefaultScore1` 和 `DefaultScore2` ，每個外掛的權重為 `1` 。 
它們可以用不同的權重重新排序，如下所示：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
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

在這個例子中，沒有必要在 `MultiPoint` 中明確指定外掛，因為它們是預設外掛。 
`Score` 中指定的唯一外掛是 `DefaultScore2`。 
這是因為透過特定擴充套件點設定的外掛將始終優先於 `MultiPoint` 外掛。 
因此，此程式碼段實質上重新排序了這兩個外掛，而無需同時指定它們。


<!--
The general hierarchy for precedence when configuring `MultiPoint` plugins is as follows:
-->
配置 `MultiPoint` 外掛時優先順序的一般層次結構如下：

<!--
1. Specific extension points run first, and their settings override whatever is set elsewhere
-->
1. 特定的擴充套件點首先執行，它們的設定會覆蓋其他地方的設定
   
<!--2. Plugins manually configured through `MultiPoint` and their settings
-->
2. 透過 `MultiPoint` 手動配置的外掛及其設定
   
<!--3. Default plugins and their default settings 
-->
3. 預設外掛及其預設設定

<!--
To demonstrate the above hierarchy, the following example is based on these plugins:
-->
為了演示上述層次結構，以下示例基於這些外掛：
|外掛|擴充套件點|
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
這些外掛的一個有效示例配置是：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
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
請注意，在特定擴充套件點中重新宣告 `MultiPoint` 外掛不會出錯。 
重新宣告被忽略（並記錄），因為特定的擴充套件點優先。

<!--
Besides keeping most of the config in one spot, this sample does a few things:
-->

除了將大部分配置儲存在一個位置之外，此示例還做了一些事情：

<!--
* Enables the custom `queueSort` plugin and disables the default one
* Enables `CustomPlugin1` and `CustomPlugin2`, which will run first for all of their extension points
* Disables `DefaultPlugin1`, but only for `filter`
* Reorders `DefaultPlugin2` to run first in `score` (even before the custom plugins)
-->
* 啟用自定義 `queueSort` 外掛並禁用預設外掛

* 啟用 `CustomPlugin1` 和 `CustomPlugin2`，這將首先為它們的所有擴充套件點執行

* 禁用 `DefaultPlugin1`，但僅適用於 `filter`

* 重新排序 `DefaultPlugin2` 以在 `score` 中首先執行（甚至在自定義外掛之前）

<!--
In versions of the config before `v1beta3`, without `multiPoint`, the above snippet would equate to this:
-->
在 `v1beta3` 之前的配置版本中，沒有 `multiPoint`，上面的程式碼片段等同於：

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

<!--
While this is a complicated example, it demonstrates the flexibility of `MultiPoint` config
as well as its seamless integration with the existing methods for configuring extension points.
-->

雖然這是一個複雜的例子，但它展示了 `MultiPoint` 配置的靈活性以及它與配置擴充套件點的現有方法的無縫整合。

<!--
## Scheduler configuration migrations
-->

## 排程程式配置遷移
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
* 在 v1beta2 配置版本中，你可以為 `NodeResourcesFit` 外掛使用新的 score 擴充套件。
 新的擴充套件結合了 `NodeResourcesLeastAllocated`、`NodeResourcesMostAllocated` 和 `RequestedToCapacityRatio` 外掛的功能。 
 例如，如果你之前使用了 `NodeResourcesMostAllocated` 外掛，
 則可以改用 `NodeResourcesFit`（預設啟用）並新增一個 `pluginConfig` 和 `scoreStrategy`，類似於：

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
* 排程器外掛 `NodeLabel` 已棄用；
  相反，要使用 [`NodeAffinity`](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) 
  外掛（預設啟用）來實現類似的行為。

<!--
* The scheduler plugin `ServiceAffinity` is deprecated; instead, use the [`InterPodAffinity`](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity) plugin (enabled by default) to achieve similar behavior.
-->
* 排程程式外掛 `ServiceAffinity` 已棄用；
  相反，使用 [`InterPodAffinity`](/zh-cn/doc/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity) 
  外掛（預設啟用）來實現類似的行為。
  
<!--
* The scheduler plugin `NodePreferAvoidPods` is deprecated; instead, use [node taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) to achieve similar behavior.
-->
* 排程器外掛 `NodePreferAvoidPods` 已棄用；
  相反，使用 [節點汙點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/) 來實現類似的行為。

<!--
* A plugin enabled in a v1beta2 configuration file takes precedence over the default configuration for that plugin.
-->
* 在 v1beta2 配置檔案中啟用的外掛優先於該外掛的預設配置。

<!--
* Invalid `host` or `port` configured for scheduler healthz and metrics bind address will cause validation failure.
-->
* 排程器的健康檢查和審計的繫結地址，所配置的 `host` 或 `port` 無效將導致驗證失敗。

{{% /tab %}}

{{% tab name="v1beta2 → v1beta3" %}}
<!--
* Three plugins' weight are increased by default:
  * `InterPodAffinity` from 1 to 2
  * `NodeAffinity` from 1 to 2
  * `TaintToleration` from 1 to 3
-->
* 預設增加三個外掛的權重：
  * `InterPodAffinity` 從 1 到 2
  * `NodeAffinity` 從 1 到 2
  * `TaintToleration` 從 1 到 3
{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--  
* Read the [kube-scheduler reference](/docs/reference/command-line-tools-reference/kube-scheduler/)
* Learn about [scheduling](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Read the [kube-scheduler configuration (v1beta2)](/docs/reference/config-api/kube-scheduler-config.v1beta2/) reference
* Read the [kube-scheduler configuration (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/) reference
-->
* 閱讀 [kube-scheduler 參考](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)
* 瞭解[排程](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)
* 閱讀 [kube-scheduler 配置 (v1beta2)](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta2/) 參考
* 閱讀 [kube-scheduler 配置 (v1beta3)](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta3/) 參考
