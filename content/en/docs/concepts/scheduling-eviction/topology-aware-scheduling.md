---
title: Topology-Aware Workload Scheduling
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

*Topology-Aware Scheduling* (TAS) is a [placement scheduling algorithm](/docs/concepts/scheduling-eviction/podgroup-scheduling/#placement-scheduling-algorithm)
that allows to find the optimal placement for the considered PodGroup, guaranteeing that all pods
will be collocated within the same topology domain. Users can accomodate TAS to their specific
needs by changing TAS plugins configuration.

## Scheduling framework: TAS plugins configuration

The scheduler includes new and extended in-tree plugins that implement the TAS extension points:

*   `TopologyPlacement`: Implements the `PlacementGeneratePlugin` interface. It generates candidate
placements by grouping nodes based on the distinct values of the requested topology `key` (defined
in the PodGroup).

*   `NodeResourcesFit`: Extended to implement the `PlacementScorePlugin` interface. Following
similar logic to standard pod bin-packing, it scores placements based on the allocation ratio
across all nodes within the placement. It uses the `MostAllocated` strategy to maximize resource
utilization within a placement, and it inherits resource weights from the standard pod-by-pod
plugin settings.

*   `PodGroupPodsCount`: Implements the `PlacementScorePlugin` interface. It scores candidate
placements based on the total number of pods in the PodGroup that you can successfully schedule. 

### Customizing plugin weights and bin-packing resource weights

By default, the `NodeResourcesFit` and `PodGroupPodsCount` plugins are configured with equal
weights (both default to 1) to maintain a good balance between bin-packing logic and scheduling as
many pods as possible. 

You can adjust these weights, or the resource weights in the bin-packing strategy in your
KubeSchedulerConfiguration. Here is an example snippet showing how to change the weights for both
plugins, and how to override the `NodeResourcesFit` resource weights. The latter change will apply
both to pod-by-pod and placement scoring algorithms:

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

## {{% heading "whatsnext" %}}

* Learn more about [Topology-aware scheduling API](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* Read about [pod group scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
* Read about [pod group policies](/docs/concepts/workloads/workload-api/policies/).