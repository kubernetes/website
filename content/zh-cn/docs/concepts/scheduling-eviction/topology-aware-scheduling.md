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
that allows to find the optimal placement for the considered PodGroup, guaranteeing that all pods
will be collocated within the same topology domain. Users can accomodate TAS to their specific
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

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Topology-aware scheduling API](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* Read about [pod group scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
* Read about [pod group policies](/docs/concepts/workloads/workload-api/policies/).
-->
* 进一步了解[拓扑感知调度 API](/zh-cn/docs/concepts/workloads/workload-api/topology-aware-scheduling/)。
* 参阅 [Pod 组调度](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/)的内容。
* 参阅 [Pod 组策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)的内容。
