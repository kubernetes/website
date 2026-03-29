---
title: Topology-Aware Workload Scheduling
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

*Topology-Aware Scheduling* (TAS) is a feature of the Workload API that optimizes the placement of
pods within the cluster.

TAS ensures that all pods within a PodGroup are co-located into a specific physical network domain,
such as a single server rack or zone. This minimizes inter-pod communication latency and prevents
workload fragmentation across the cluster infrastructure.

## Topology-aware scheduling with gang scheduling policy

When applied to PodGroups with `gang` scheduling policy, TAS simulates the potential assignment
(*placement*) of the full group of pods at once. It guarantees that at least the specified
`minCount` pods can fit together into the same physical network domain before committing resources.
If no feasible placement is found, the entire PodGroup becomes unschedulable.

This is the recommended approach for workloads like distributed AI and ML training that strictly
require proximity to minimize inter-pod communication latency.

If new pods are added to the PodGroup where some pods are already scheduled (for example, if pods
are restarted), the scheduler will force all new incoming pods to land on the exact same topology
domain where the existing pods currently reside. If that specific domain lacks sufficient capacity
for the new pods, the pods will remain pending - even if it means that less than `minCount` pods
are scheduled at this point.

{{< note >}}
As of v1.36 Topology-Aware Scheduling does not trigger workload or pod preemption. If no
feasible placement can be found without triggering preemption, the PodGroup becomes unschedulable.
{{< /note >}}

## Topology-aware scheduling with basic scheduling policy

Using TAS with `basic` scheduling policy may exhibit inconsistent behavior. The scheduler may only
observe a subset of pods when entering the PodGroup scheduling cycle - therefore placement
feasibility is only evaluated for the observed pods, rather than the entire PodGroup. To partially
mitigate this limitation, you can use scheduling gates to hold off PodGroup scheduling until all
pods within the PodGroup are in the scheduling queue.

If no feasible placement is found for the entire PodGroup, only a subset of pods may be scheduled,
and they are guaranteed to meet the scheduling constraints.

If new pods are added to the PodGroup where some pods are already scheduled, the scheduler will act
the same as in case of `gang` policy - forcing the new pods into the same domain, unless there is
insufficient capacity (in which case the new pods will remain pending).

## API configuration: scheduling constraints

TAS constraints are defined on PodGroup or PodGroupTemplate level.

Every PodGroup may optionally declare the `schedulingConstraints` field, which TAS interprets while
scheduling all pods within this PodGroup. If constraints are defined in PodGroupTemplate, they will
be copied to referencing PodGroups.

The API currently supports topology constraints.

{{< note >}}
As of Kubernetes v1.36, you can specify only a single topology constraint in each PodGroup. This
may change in the future.
{{< /note >}}

### Topology constraint

To define a topology constraint for a PodGroup you need to set a `key`, which corresponds to
a Kubernetes node label, representing the target topology domain (for example,
`topology.kubernetes.io/rack`). The scheduler strictly enforces that all pods within the PodGroup
are placed onto nodes that share the exact same value for this specified label.

Here is an example of a PodGroup configured with a topology constraint:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: example-podgroup
spec:
  schedulingPolicy:
    gang:
      minCount: 4
  schedulingConstraints:
    topology:
      - key: topology.kubernetes.io/rack
```

## Scheduling framework: extension points used by TAS

TAS algorithm proceeds in three main phases for a given PodGroup:

### Phase 1: Candidate placement generation

Generates candidate *placements* (subsets of nodes, that are theoretically feasible for PodGroup
assignment) based on the PodGroup's scheduling constraints.

This phase executes as extension point: `PlacementGeneratePlugin`.

### Phase 2: Pod-level filtering and feasibility check

Validates each proposed placement to see if all pods can fit. If they can, marks the placement as
feasible.

### Phase 3:  Placement scoring and selection

Scores all feasible placements to select the optimal domain for the PodGroup.

This phase executes as extension point: `PlacementScorePlugin`.


## Scheduling framework: TAS plugin configuration

The scheduler includes new and extended in-tree plugins that implement the TAS extension points:

*   `TopologyPlacement`: Implements the `PlacementGeneratePlugin` interface. It generates candidate
placements by grouping nodes based on the distinct values of the requested topology `key`.

*   `NodeResourcesFit`: Extended to implement the `PlacementScorePlugin` interface. Following
similar logic to standard pod bin-packing, it scores placements based on the allocation ratio
across all nodes within the placement. By default, it uses the `MostAllocated` strategy to maximize
resource utilization and fill in smaller "holes" within a placement, and it inherits resource
weights from the standard pod-by-pod plugin settings.

*   `PodGroupPodsCount`: Implements the `PlacementScorePlugin` interface. It scores candidate
placements based on the total number of pods in the PodGroup that you can successfully schedule. 

### Customizing plugin weights and strategies

By default, the `NodeResourcesFit` and `PodGroupPodsCount` plugins are configured with equal
weights (both default to 1) to maintain a good balance between bin-packing logic and scheduling as
many pods as possible. 

You can adjust these weights or change the default scoring strategy in your
KubeSchedulerConfiguration. Here is an example snippet showing how to change the weights for both
plugins, and how to override the `NodeResourcesFit` placement scoring strategy (for example,
changing it from MostAllocated to LeastAllocated):

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
    plugins:
      score:
        enabled:
          # 1) Change the default weights of the placement score plugins
          - name: NodeResourcesFit
            weight: 2
          - name: PodGroupPodsCount
            weight: 5
    pluginConfig:
      - name: NodeResourcesFit
        args:
          # 2) Change the placement scoring strategy and resource weights
          placementScoringStrategy:
            type: LeastAllocated
            resources:
              - name: cpu
                weight: 1
              - name: memory
                weight: 1
```

## {{% heading "whatsnext" %}}

* Learn about [pod group policies](/docs/concepts/workloads/workload-api/policies/).
* Read about [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
