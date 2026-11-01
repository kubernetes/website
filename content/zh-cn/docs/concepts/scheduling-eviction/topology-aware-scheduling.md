---
title: 拓扑感知的工作负载调度
content_type: concept
weight: 10
---
<!--
title: Topology-Aware Workload Scheduling
content_type: concept
weight: 10
-->

<!-- overview -->
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

<!--
*Topology-Aware Scheduling* (TAS) is a [placement scheduling algorithm](/docs/concepts/scheduling-eviction/podgroup-scheduling/#placement-scheduling-algorithm)
that allows finding the optimal placement for the considered PodGroup, guaranteeing that all pods
will be collocated within the same topology domain. Users can adapt TAS to their specific
needs by changing TAS plugins configuration.
-->
**拓扑感知调度**（Topology-Aware Scheduling，TAS）是一种[调度算法](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/#placement-scheduling-algorithm)，
用于为指定的 PodGroup 寻找最优的放置位置，并保证所有 Pod 都被调度到同一拓扑域中。
用户可以通过修改 TAS 插件配置来适配自身的特定需求。

<!--
## Scheduling framework: TAS plugins configuration

The scheduler includes new and extended in-tree plugins that implement the TAS extension points:

*   `TopologyPlacement`: Implements the `PlacementGeneratePlugin` interface. It generates candidate
placements by grouping nodes based on the distinct values of the requested topology `key` (defined
in the PodGroup).
-->
## 调度框架：TAS 插件配置 {#scheduling-framework-tas-plugins-configuration}

调度器包含了新的以及扩展的内置插件，用于实现 TAS 的扩展点：

* `TopologyPlacement`：实现了 `PlacementGeneratePlugin` 接口。
  它通过根据 PodGroup 中定义的拓扑 `key` 的不同取值对节点进行分组，从而生成候选放置方案。

<!--
*   `NodeResourcesFit`: Extended to implement the `PlacementScorePlugin` interface. Following
similar logic to standard pod bin-packing, it scores placements based on the allocation ratio
across all nodes within the placement. It uses the `MostAllocated` strategy to maximize resource
utilization within a placement, and it inherits resource weights from the standard pod-by-pod
plugin settings.
-->
* `NodeResourcesFit`：扩展实现了 `PlacementScorePlugin` 接口。其逻辑类似于标准的 Pod 装箱，
  基于放置中所有节点的资源分配比例对候选方案进行打分。它使用 `MostAllocated` 策略来最大化放置内的资源利用率，
  并继承了逐 Pod 插件中的资源权重设置。

<!--
*   `PodGroupPodsCount`: Implements the `PlacementScorePlugin` interface. It scores candidate
placements based on the total number of pods in the PodGroup that you can successfully schedule. 

### Customizing plugin weights and bin-packing resource weights

By default, the `NodeResourcesFit` and `PodGroupPodsCount` plugins are configured with equal
weights (both default to 1) to maintain a good balance between bin-packing logic and scheduling as
many pods as possible.
-->
* `PodGroupPodsCount`：实现了 `PlacementScorePlugin` 接口。
  它根据在该放置方案中可以成功调度的 PodGroup 中 Pod 的总数量来对候选方案进行评分。

### 自定义插件权重和装箱资源权重  {#customizing-plugin-weights-and-bin-packing-weights}

默认情况下，`NodeResourcesFit` 和 `PodGroupPodsCount` 插件具有相同的权重（默认均为 1），
以在装箱策略与尽可能多调度 Pod 之间保持良好的平衡。

<!--
You can adjust these weights, or the resource weights in the bin-packing strategy in your
KubeSchedulerConfiguration. Here is an example snippet showing how to change the weights for both
plugins, and how to override the `NodeResourcesFit` resource weights. The latter change will apply
both to pod-by-pod and placement scoring algorithms:
-->
你可以在 `KubeSchedulerConfiguration` 中调整这些权重，或修改装箱策略中的资源权重。
以下示例展示了如何更改这两个插件的权重，以及如何覆盖 `NodeResourcesFit` 的资源权重。
后者的修改将同时应用于逐 Pod 调度和放置评分算法：

<!--
```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
    plugins:
      placementScore:
        enabled:
          # 1) Change the default weights of the placement score plugins
          - name: NodeResourcesFit
            weight: 2
          - name: PodGroupPodsCount
            weight: 5
    pluginConfig:
      - name: NodeResourcesFit
        args:
          # 2) Changing the scoring resource weights for both pod-by-pod and placement scoring
          # algorithms
          scoringStrategy:
            # The type will only be considered in pod-by-pod scheduling. Placement scoring always
            # uses MostAllocated strategy
            type: LeastAllocated
            # Resource weights will be used in both pod-by-pod and placement scoring algorithms
            resources:
              - name: cpu
                weight: 2
              - name: memory
                weight: 3
```
-->
```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
    plugins:
      placementScore:
        enabled:
          # 1) 修改放置评分插件的默认权重
          - name: NodeResourcesFit
            weight: 2
          - name: PodGroupPodsCount
            weight: 5
    pluginConfig:
      - name: NodeResourcesFit
        args:
          # 2) 修改逐 Pod 和放置评分算法中的资源评分权重
          scoringStrategy:
            # 此类别仅在逐 Pod 调度中生效。放置评分始终使用 MostAllocated 策略
            type: LeastAllocated
            # 资源权重将同时应用于逐 Pod 和放置评分算法
            resources:
              - name: cpu
                weight: 2
              - name: memory
                weight: 3
```

<!--
## Multi-level topology placements
-->
## 多级拓扑放置  {#multi-level-topology-placements}

{{< feature-state feature_gate_name="CompositePodGroup" >}}

<!--
When the [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
feature gate and the `scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled, the Topology-Aware Scheduling plugins extend their support to multi-level
`CompositePodGroup` hierarchies. These plugins are called for `CompositePodGroups` during
[hierarchical scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling).
-->
当启用了
[`CompositePodGroup`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)特性门控和
`scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API 组" term_id="api-group" >}}时，
拓扑感知调度插件将其支持扩展到多级 `CompositePodGroup` 层次结构。
在[层次化调度](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/)过程中，
这些插件会被 `CompositePodGroup` 调用。

<!--
### Candidate placement generation

For workloads defined with a `CompositePodGroup` hierarchy, the `TopologyPlacement` plugin generates
candidate placements top-down across the group hierarchy by successive subdivision:
-->
### 候选放置方案生成  {#candidate-placement-generation}

对于通过 `CompositePodGroup` 层次结构定义的工作负载，`TopologyPlacement` 插件通过逐级细分，
自顶向下地在组层次结构中生成候选放置方案：

<!--
* For a root `CompositePodGroup`, `TopologyPlacement` generates candidate placements across all
  available cluster nodes by grouping nodes based on the distinct values of the requested topology
  `key`.
* For a child `CompositePodGroup` or leaf `PodGroup`, `TopologyPlacement` generates candidate
  placements confined in the placement assumed by the parent group. It subdivides the set of nodes
  from the parent group's placement by grouping those nodes based on the child group's requested
  topology `key`.
-->
* 对于根 `CompositePodGroup`，`TopologyPlacement` 根据所请求拓扑 `key` 的不同取值对节点进行分组，
  从而在所有可用集群节点中生成候选放置方案。
* 对于子 `CompositePodGroup` 或叶子 `PodGroup`，`TopologyPlacement` 在父组所假定的放置范围内生成候选放置方案。
  它基于子组所请求的拓扑 `key`，对父组放置中的节点集合进行分组细分。

{{< note >}}
<!--
If a topology constraint is not specified, the `TopologyPlacement` plugin generates a single
candidate placement equivalent to the parent placement.

Similarly, if the root group does not specify any topology constraint, the plugin generates a single
candidate placement corresponding to all available nodes in the cluster. This is also true for
single-level workloads using the `PodGroup` API where no topology constraint is specified.
-->
如果未指定拓扑约束，`TopologyPlacement` 插件将生成一个与父放置方案等价的单个候选放置方案。

类似地，如果根组未指定任何拓扑约束，插件将生成一个对应于集群中所有可用节点的单个候选放置方案。
对于使用 `PodGroup` API 且未指定拓扑约束的单级工作负载，同样如此。
{{< /note >}}

<!--
### Placement scoring

When scoring a candidate placement for a `CompositePodGroup`, the scoring plugins apply similar
logic to the single-level `PodGroup` case:
-->
### 放置评分  {#placement-scoring}

在对 `CompositePodGroup` 的候选放置方案进行评分时，评分插件所采用的逻辑与单级 `PodGroup` 的情况类似：

<!--
* `PodGroupPodsCount`: Scores candidate placements based on the total number of Pods (both
  already scheduled and newly assumed) across all descendant leaf `PodGroups` of that
  `CompositePodGroup`. Candidate placements capable of accommodating a higher total number of Pods
  across the subhierarchy receive higher scores.
* `NodeResourcesFit`: Aggregates the resource requests of all proposed Pods across all descendant
  `PodGroups` of that `CompositePodGroup` and evaluates resource utilization across all nodes within
  the candidate placement's domain.
-->
* `PodGroupPodsCount`：基于该 `CompositePodGroup` 的所有后代叶子 `PodGroup` 中
  Pod 的总数（包括已调度的和已假定的）对候选放置方案进行评分。
  能够在子层次结构中容纳更多 Pod 的候选放置方案将获得更高的评分。
* `NodeResourcesFit`：汇总该 `CompositePodGroup` 的所有后代 `PodGroup` 中所有提议 Pod 的资源请求，
  并评估候选放置方案域内所有节点的资源利用率。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Topology-aware scheduling API](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* Read about [pod group scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
* Read about [pod group policies](/docs/concepts/workloads/workload-api/policies/).
-->
* 进一步了解[拓扑感知调度 API](/zh-cn/docs/concepts/workloads/workload-api/topology-aware-scheduling/)。
* 参阅 [Pod 组调度](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/)的内容。
* 参阅 [Pod 组策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)的内容。
