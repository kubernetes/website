---
title: Topology-Aware Workload Scheduling
content_type: concept
weight: 85
---

<!-- overview -->
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

*Topology-Aware Scheduling* (TAS) is a [placement scheduling algorithm](/docs/concepts/scheduling-eviction/podgroup-scheduling/#placement-scheduling-algorithm)
that allows finding the optimal placement for the considered PodGroup, guaranteeing that all pods
will be collocated within the same topology domain. Users can adapt TAS to their specific
needs by changing TAS plugins configuration.

## Scheduling framework: TAS plugins configuration

The scheduler includes new and extended in-tree plugins that implement the TAS extension points:

*   `TopologyPlacementGenerator`: Implements the `PlacementGeneratePlugin` interface. It generates candidate
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

### Limiting the number of placements to score {#percentage-of-placements-to-score}

For a topology key with many distinct values, the `TopologyPlacementGenerator` plugin can generate
a large number of candidate placements. To bound the scheduling latency, the scheduler stops
searching once it finds enough feasible placements, and scores only those. This is the placement
counterpart of
[`percentageOfNodesToScore`](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/#percentage-of-nodes-to-score).

You control the threshold with the `percentageOfPlacementsToScore` field in your
KubeSchedulerConfiguration. The field accepts whole numbers between 0 and 100. For example, if
the plugin generates 500 placements and you set the value to 30, the scheduler stops after it finds
150 feasible placements. The scheduler always tries to find at least one feasible placement.

This field can be set for the whole scheduler, and overridden for an individual profile. A profile
that leaves the field unset uses the scheduler-wide value.

If the effective value is 0, or the field is unset at both levels, the scheduler computes an
adaptive percentage from the sum of the node counts of all generated placements. A node that
belongs to several placements counts once for each of them. The percentage decreases linearly from
100% when that sum is 0 to 10% when it reaches 5000, and keeps decreasing for larger sums down to a
minimum of 5%. Setting a profile's value to 0 selects the adaptive percentage for that profile even
when the scheduler-wide value is non-zero.

The following configuration sets a scheduler-wide value and overrides it for one profile:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
# Applies to every profile that does not set its own value
percentageOfPlacementsToScore: 50
profiles:
  - schedulerName: default-scheduler
  - schedulerName: exhaustive-placement-scheduler
    # Evaluate every generated placement
    percentageOfPlacementsToScore: 100
```

## Multi-level topology placements

{{< feature-state feature_gate_name="CompositePodGroup" >}}

When the [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
feature gate and the `scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled, the Topology-Aware Scheduling plugins extend their support to multi-level
`CompositePodGroup` hierarchies. These plugins are called for `CompositePodGroups` during
[hierarchical scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling).

### Candidate placement generation

For workloads defined with a `CompositePodGroup` hierarchy, the `TopologyPlacementGenerator` plugin generates
candidate placements top-down across the group hierarchy by successive subdivision:

* For a root `CompositePodGroup`, `TopologyPlacementGenerator` generates candidate placements across all
  available cluster nodes by grouping nodes based on the distinct values of the requested topology
  `key`.
* For a child `CompositePodGroup` or leaf `PodGroup`, `TopologyPlacementGenerator` generates candidate
  placements confined in the placement assumed by the parent group. It subdivides the set of nodes
  from the parent group's placement by grouping those nodes based on the child group's requested
  topology `key`.

{{< note >}}
If a topology constraint is not specified, the `TopologyPlacementGenerator` plugin generates a single
candidate placement equivalent to the parent placement.

Similarly, if the root group does not specify any topology constraint, the plugin generates a single
candidate placement corresponding to all available nodes in the cluster. This is also true for
single-level workloads using the `PodGroup` API where no topology constraint is specified.
{{< /note >}}

### Placement scoring

When scoring a candidate placement for a `CompositePodGroup`, the scoring plugins apply similar
logic to the single-level `PodGroup` case:

* `PodGroupPodsCount`: Scores candidate placements based on the total number of Pods (both
  already scheduled and newly assumed) across all descendant leaf `PodGroups` of that
  `CompositePodGroup`. Candidate placements capable of accommodating a higher total number of Pods
  across the subhierarchy receive higher scores.
* `NodeResourcesFit`: Aggregates the resource requests of all proposed Pods across all descendant
  `PodGroups` of that `CompositePodGroup` and evaluates resource utilization across all nodes within
  the candidate placement's domain.

## {{% heading "whatsnext" %}}

* Learn more about [Topology-aware scheduling API](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* Read about [pod group scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
* Read about [pod group policies](/docs/concepts/workloads/workload-api/policies/).