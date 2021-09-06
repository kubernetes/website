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
{{< feature-state for_k8s_version="v1.19" state="beta" >}}

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
Each stage is exposed in a extension point. Plugins provide scheduling behaviors
by implementing one or more of these extension points.
-->
调度模板（Profile）允许你配置 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
中的不同调度阶段。每个阶段都暴露于某个扩展点中。插件通过实现一个或多个扩展点来提供调度行为。

<!--
You can specify scheduling profiles by running `kube-scheduler --config <filename>`,
using the component config APIs
([`v1beta1`](https://pkg.go.dev/k8s.io/kube-scheduler@v0.19.0/config/v1beta1?tab=doc#KubeSchedulerConfiguration)).
-->
你可以通过运行 `kube-scheduler --config <filename>` 来设置调度模板，
配置文件使用组件配置的 API ([`v1alpha1`](https://pkg.go.dev/k8s.io/kube-scheduler@v0.19.0/config/v1beta1?tab=doc#KubeSchedulerConfiguration))。

<!-- A minimal configuration looks as follows: -->
最简单的配置如下：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta1
kind: KubeSchedulerConfiguration
clientConnection:
  kubeconfig: /etc/srv/kubernetes/kube-scheduler/kubeconfig
```

<!-- ## Profiles -->
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

<!-- ### Extension points -->
### 扩展点    {#extensions-points}

<!--  
Scheduling happens in a series of stages that are exposed through the following
extension points:
-->
调度行为发生在一系列阶段中，这些阶段是通过以下扩展点公开的：

<!--  
1. `QueueSort`: These plugins provide an ordering function that is used to
   sort pending Pods in the scheduling queue. Exactly one queue sort plugin
   may be enabled at a time.
-->
1. `QueueSort`：这些插件对调度队列中的悬决的 Pod 排序。
   一次只能启用一个队列排序插件。
<!--
2. `PreFilter`: These plugins are used to pre-process or check information
   about a Pod or the cluster before filtering. They can mark a pod as
   unschedulable.
 -->
2. `PreFilter`：这些插件用于在过滤之前预处理或检查 Pod 或集群的信息。
   它们可以将 Pod 标记为不可调度。
<!--
3. `Filter`: These plugins are the equivalent of Predicates in a scheduling
   Policy and are used to filter out nodes that can not run the Pod. Filters
   are called in the configured order. A pod is marked as unschedulable if no
   nodes pass all the filters.
-->
3. `Filter`：这些插件相当于调度策略中的断言（Predicates），用于过滤不能运行 Pod 的节点。
   过滤器的调用顺序是可配置的。
   如果没有一个节点通过所有过滤器的筛选，Pod 将会被标记为不可调度。
<!--
4. `PreScore`: This is an informational extension point that can be used
   for doing pre-scoring work.
-->
4. `PreScore`：这是一个信息扩展点，可用于预打分工作。
<!--  
5. `Score`: These plugins provide a score to each node that has passed the
   filtering phase. The scheduler will then select the node with the highest
   weighted scores sum.
-->
5. `Score`：这些插件给通过筛选阶段的节点打分。调度器会选择得分最高的节点。
<!--  
6. `Reserve`: This is an informational extension point that notifies plugins
   when resources have been reserved for a given Pod. Plugins also implement an
   `Unreserve` call that gets called in the case of failure during or after
   `Reserve`.
-->
6. `Reserve`：这是一个信息扩展点，当资源已经预留给 Pod 时，会通知插件。
   这些插件还实现了 `Unreserve` 接口，在 `Reserve` 期间或之后出现故障时调用。
<!-- 7. `Permit`: These plugins can prevent or delay the binding of a Pod. -->
7. `Permit`：这些插件可以阻止或延迟 Pod 绑定。
<!-- 8. `PreBind`: These plugins perform any work required before a Pod is bound.-->
8. `PreBind`：这些插件在 Pod 绑定节点之前执行。
<!--  
9. `Bind`: The plugins bind a Pod to a Node. Bind plugins are called in order
   and once one has done the binding, the remaining plugins are skipped. At
   least one bind plugin is required.
-->
9. `Bind`：这个插件将 Pod 与节点绑定。绑定插件是按顺序调用的，只要有一个插件完成了绑定，其余插件都会跳过。绑定插件至少需要一个。
<!--
10. `PostBind`: This is an informational extension point that is called after
   a Pod has been bound.
-->
10.  `PostBind`：这是一个信息扩展点，在 Pod 绑定了节点之后调用。

<!--
For each extension point, you could disable specific [default plugins](#scheduling-plugins)
or enable your own. For example:
-->
对每个扩展点，你可以禁用[默认插件](#scheduling-plugins)或者是启用自己的插件，例如：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta1
kind: KubeSchedulerConfiguration
profiles:
  - plugins:
      score:
        disabled:
        - name: NodeResourcesLeastAllocated
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

<!-- ### Scheduling plugins -->
### 调度插件    {#scheduling-plugin}

<!--
1. `UnReserve`: This is an informational extension point that is called if
   a Pod is rejected after being reserved and put on hold by a `Permit` plugin.
-->
1. `UnReserve`：这是一个信息扩展点，如果一个 Pod 在预留后被拒绝，并且被 `Permit` 插件搁置，它就会被调用。

<!-- ## Scheduling plugins -->
## 调度插件   {#scheduling-plugins}

<!--  
The following plugins, enabled by default, implement one or more of these
extension points:
-->
下面默认启用的插件实现了一个或多个扩展点：

<!--  
- `SelectorSpread`: Favors spreading across nodes for Pods that belong to
  {{< glossary_tooltip text="Services" term_id="service" >}},
  {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} and
  {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}}.
  Extension points: `PreScore`, `Score`.
-->
- `SelectorSpread`：对于属于 {{< glossary_tooltip text="Services" term_id="service" >}}、
  {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} 和
  {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}} 的 Pod，偏好跨多个节点部署。

  实现的扩展点：`PreScore`，`Score`。
<!--  
- `ImageLocality`: Favors nodes that already have the container images that the
  Pod runs.
  Extension points: `Score`.
-->
- `ImageLocality`：选择已经存在 Pod 运行所需容器镜像的节点。

  实现的扩展点：`Score`。
<!--  
- `TaintToleration`: Implements
  [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
  Implements extension points: `Filter`, `Prescore`, `Score`.
-->
- `TaintToleration`：实现了[污点和容忍](/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)。

  实现的扩展点：`Filter`，`Prescore`，`Score`。
<!--  
- `NodeName`: Checks if a Pod spec node name matches the current node.
  Extension points: `Filter`.
-->
- `NodeName`：检查 Pod 指定的节点名称与当前节点是否匹配。

  实现的扩展点：`Filter`。
<!--  
- `NodePorts`: Checks if a node has free ports for the requested Pod ports.
  Extension points: `PreFilter`, `Filter`.
-->
- `NodePorts`：检查 Pod 请求的端口在节点上是否可用。

  实现的扩展点：`PreFilter`，`Filter`。
<!--  
- `NodePreferAvoidPods`: Scores nodes according to the node
  {{< glossary_tooltip text=" " term_id="annotation" >}}
  `scheduler.alpha.kubernetes.io/preferAvoidPods`.
  Extension points: `Score`.
-->
- `NodePreferAvoidPods`：基于节点的 {{< glossary_tooltip text="注解" term_id="annotation" >}}
  `scheduler.alpha.kubernetes.io/preferAvoidPods` 打分。

  实现的扩展点：`Score`。
<!--  
- `NodeAffinity`: Implements
  [node selectors](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
  and [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).
  Extension points: `Filter`, `Score`.
-->
- `NodeAffinity`：实现了[节点选择器](/zh/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
  和[节点亲和性](/zh/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)。

  实现的扩展点：`Filter`，`Score`.
<!--  
- `PodTopologySpread`: Implements
  [Pod topology spread](/docs/concepts/workloads/pods/pod-topology-spread-constraints/).
  Extension points: `PreFilter`, `Filter`, `PreScore`, `Score`.
-->
- `PodTopologySpread`：实现了 [Pod 拓扑分布](/zh/docs/concepts/workloads/pods/pod-topology-spread-constraints/)。

  实现的扩展点：`PreFilter`，`Filter`，`PreScore`，`Score`。
<!--  
- `NodeUnschedulable`: Filters out nodes that have `.spec.unschedulable` set to
  true.
  Extension points: `Filter`.
-->
- `NodeUnschedulable`：过滤 `.spec.unschedulable` 值为 true 的节点。

  实现的扩展点：`Filter`。
<!--  
- `NodeResourcesFit`: Checks if the node has all the resources that the Pod is
  requesting.
  Extension points: `PreFilter`, `Filter`.
-->
- `NodeResourcesFit`：检查节点是否拥有 Pod 请求的所有资源。

  实现的扩展点：`PreFilter`，`Filter`。
<!--  
- `NodeResourcesBalancedAllocation`: Favors nodes that would obtain a more
  balanced resource usage if the Pod is scheduled there.
  Extension points: `Score`.
-->
- `NodeResourcesBalancedAllocation`：调度 Pod 时，选择资源使用更为均衡的节点。

  实现的扩展点：`Score`。
<!--  
- `NodeResourcesLeastAllocated`: Favors nodes that have a low allocation of
  resources.
  Extension points: `Score`.
-->
- `NodeResourcesLeastAllocated`：选择资源分配较少的节点。

  实现的扩展点：`Score`。
<!--  
- `VolumeBinding`: Checks if the node has or if it can bind the requested
  {{< glossary_tooltip text="volumes" term_id="volume" >}}.
  Extension points: `PreFilter`, `Filter`, `Reserve`, `PreBind`.
-->
- `VolumeBinding`：检查节点是否有请求的卷，或是否可以绑定请求的卷。

  实现的扩展点: `PreFilter`，`Filter`，`Reserve`，`PreBind`。
<!--
- `VolumeRestrictions`: Checks that volumes mounted in the node satisfy
  restrictions that are specific to the volume provider.
  Extension points: `Filter`.
-->
- `VolumeRestrictions`：检查挂载到节点上的卷是否满足卷提供程序的限制。

  实现的扩展点：`Filter`。
<!--  
- `VolumeZone`: Checks that volumes requested satisfy any zone requirements they
  might have.
  Extension points: `Filter`.
-->
- `VolumeZone`：检查请求的卷是否在任何区域都满足。

  实现的扩展点：`Filter`。
<!--
- `NodeVolumeLimits`: Checks that CSI volume limits can be satisfied for the
  node.
  Extension points: `Filter`.
-->
- `NodeVolumeLimits`：检查该节点是否满足 CSI 卷限制。

  实现的扩展点：`Filter`。
<!--  
- `EBSLimits`: Checks that AWS EBS volume limits can be satisfied for the node.
  Extension points: `Filter`.
-->
- `EBSLimits`：检查节点是否满足 AWS EBS 卷限制。

  实现的扩展点：`Filter`。
<!--  
- `GCEPDLimits`: Checks that GCP-PD volume limits can be satisfied for the node.
  Extension points: `Filter`.
-->
- `GCEPDLimits`：检查该节点是否满足 GCP-PD 卷限制。

  实现的扩展点：`Filter`。
<!--  
- `AzureDiskLimits`: Checks that Azure disk volume limits can be satisfied for
  the node.
  Extension points: `Filter`.
-->
- `AzureDiskLimits`：检查该节点是否满足 Azure 卷限制。

  实现的扩展点：`Filter`。
<!--  
- `InterPodAffinity`: Implements
  [inter-Pod affinity and anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity).
  Extension points: `PreFilter`, `Filter`, `PreScore`, `Score`.
-->
- `InterPodAffinity`：实现 [Pod 间亲和性与反亲和性](/zh/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)。

  实现的扩展点：`PreFilter`，`Filter`，`PreScore`，`Score`。
<!--  
- `PrioritySort`: Provides the default priority based sorting.
  Extension points: `QueueSort`.
-->
- `PrioritySort`：提供默认的基于优先级的排序。

  实现的扩展点：`QueueSort`。
<!--  
- `DefaultBinder`: Provides the default binding mechanism.
  Extension points: `Bind`.
-->
- `DefaultBinder`：提供默认的绑定机制。

  实现的扩展点：`Bind`。
<!--  
- `DefaultPreemption`: Provides the default preemption mechanism.
  Extension points: `PostFilter`.
-->
- `DefaultPreemption`：提供默认的抢占机制。

  实现的扩展点：`PostFilter`。

<!--  
You can also enable the following plugins, through the component config APIs,
that are not enabled by default:
-->
你也可以通过组件配置 API 启用以下插件（默认不启用）:

<!--  
- `NodeResourcesMostAllocated`: Favors nodes that have a high allocation of
  resources.
  Extension points: `Score`.
-->
- `NodeResourcesMostAllocated`：选择已分配资源多的节点。

  实现的扩展点：`Score`。
<!--  
- `RequestedToCapacityRatio`: Favor nodes according to a configured function of
  the allocated resources.
  Extension points: `Score`.
-->
- `RequestedToCapacityRatio`：根据已分配资源的某函数设置选择节点。

  实现的扩展点：`Score`。
<!--  
- `NodeResourceLimits`: Favors nodes that satisfy the Pod resource limits.
  Extension points: `PreScore`, `Score`.
-->
- `NodeResourceLimits`：选择满足 Pod 资源限制的节点。

  实现的扩展点：`PreScore`，`Score`。
<!--  
- `CinderVolume`: Checks that OpenStack Cinder volume limits can be satisfied
  for the node.
  Extension points: `Filter`.
-->
- `CinderVolume`：检查该节点是否满足 OpenStack Cinder 卷限制。

  实现的扩展点：`Filter`。
<!--  
- `NodeLabel`: Filters and / or scores a node according to configured
  {{< glossary_tooltip text="label(s)" term_id="label" >}}.
  Extension points: `Filter`, `Score`.
-->
- `NodeLabel`：根据配置的 {{< glossary_tooltip text="标签" term_id="label" >}}
  过滤节点和/或给节点打分。

  实现的扩展点：`Filter`，`Score`。
<!--  
- `ServiceAffinity`: Checks that Pods that belong to a
  {{< glossary_tooltip term_id="service" >}} fit in a set of nodes defined by
  configured labels. This plugin also favors spreading the Pods belonging to a
  Service across nodes.
  Extension points: `PreFilter`, `Filter`, `Score`.
-->
- `ServiceAffinity`：检查属于某个 {{< glossary_tooltip term_id="service" >}} 的 Pod
  与配置的标签所定义的节点集是否适配。
  这个插件还支持将属于某个 Service 的 Pod 分散到各个节点。

  实现的扩展点：`PreFilter`，`Filter`，`Score`。

<!-- ### Multiple profiles -->
### 多配置文件    {#multiple-profiles}

<!--  
You can configure `kube-scheduler` to run more than one profile.
Each profile has an associated scheduler name and can have a different set of
plugins configured in its [extension points](#extension-points).
-->
你可以配置 `kube-scheduler` 运行多个配置文件。
每个配置文件都有一个关联的调度器名称，并且可以在其扩展点中配置一组不同的插件。

<!--  
With the following sample configuration, the scheduler will run with two
profiles: one with the default plugins and one with all scoring plugins
disabled.
-->
使用下面的配置样例，调度器将运行两个配置文件：一个使用默认插件，另一个禁用所有打分插件。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta1
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
Pod's scheduling events have `.spec.schedulerName` as the ReportingController.
Events for leader election use the scheduler name of the first profile in the
list.
-->
Pod 的调度事件把 `.spec.schedulerName` 字段值作为 ReportingController。
领导者选举事件使用列表中第一个配置文件的调度器名称。
{{< /note >}}

{{< note >}}
<!--  
All profiles must use the same plugin in the QueueSort extension point and have
the same configuration parameters (if applicable). This is because the scheduler
only has one pending pods queue.
-->
所有配置文件必须在 QueueSort 扩展点使用相同的插件，并具有相同的配置参数（如果适用）。
这是因为调度器只有一个保存 pending 状态 Pod 的队列。

{{< /note >}}

## {{% heading "whatsnext" %}}

<!--  
* Read the [kube-scheduler reference](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)
* Learn about [scheduling](/docs/concepts/scheduling-eviction/kube-scheduler/)
-->
* 阅读 [kube-scheduler 参考](/zh/docs/reference/command-line-tools-reference/kube-scheduler/)
* 了解[调度](/zh/docs/concepts/scheduling-eviction/kube-scheduler/)
