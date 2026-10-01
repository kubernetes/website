---
title: Topology-Aware Workload Scheduling
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

*Topology-Aware Scheduling* (TAS) is a feature of the Workload API that optimizes the placement of
pods within the cluster.

TAS ensures that all pods within a PodGroup are co-located into a specific topology domain,
such as a single server rack or zone. This minimizes inter-pod communication latency and prevents
workload fragmentation across the cluster infrastructure.

## Topology-aware scheduling with gang scheduling policy

When applied to PodGroups with `gang` scheduling policy, TAS simulates the potential assignment
(*placement*) of the full group of pods at once. It guarantees that at least the specified
`minCount` pods can fit together into the same topology domain before committing resources.
If no feasible placement is found, the entire PodGroup becomes unschedulable.

This is the recommended approach for workloads like distributed AI and ML training that strictly
require proximity to minimize inter-pod communication latency.

If new pods are added to the PodGroup where some pods are already scheduled (for example, if pods
are recreated), the scheduler will force all new incoming pods to land on the exact same topology
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

Every PodGroup (or PodGroupTemplate) may optionally declare the `schedulingConstraints` field,
which is interpreted by the [placement-based PodGroup scheduling algorithm](/docs/concepts/scheduling-eviction/podgroup-scheduling/#placement-scheduling-algorithm).
If constraints are defined in PodGroupTemplate, they will be copied to referencing PodGroups.

As of Kubernetes v1.36, the API supports topology constraints.

{{< note >}}
As of Kubernetes v1.36, you can specify only a single topology constraint in each PodGroup.
{{< /note >}}

### Topology constraint

To define a topology constraint for a PodGroup you need to set a `key`, which corresponds to
a Kubernetes node label, representing the target topology domain (for example, a rack or a zone).
The scheduler strictly enforces that all pods within the PodGroup are placed onto nodes that share
the exact same value for this specified label.

Here is an example of a PodGroup configured with a topology constraint:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: example-podgroup
spec:
  schedulingPolicy:
    gang:
      minCount: 4
  schedulingConstraints:
    topology:
      - key: topology.example.com/rack
```

## Multi-level topology-aware scheduling

{{< feature-state feature_gate_name="CompositePodGroup" >}}

Complex workloads might require co-location of their Pods at different levels of the cluster
infrastructure. For example, an entire workload may need to run within a single availability zone,
while different parts of that workload may require strict co-location within specific server racks.

Such multi-level co-location requirements can be expressed using the `CompositePodGroup` API and
by specifying topology constraints at different levels of a group hierarchy.

Using the `CompositePodGroup` API requires enabling the
[`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
feature gate and the
`scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}.

### Multi-level topology constraints resolution

Every group inside a `CompositePodGroup` hierarchy can specify a topology constraint which
guarantees that all descendant Pods of that group will be scheduled in the same topology domain,
matching that group's constraint.

During [hierarchical scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling), the
scheduler resolves these constraints in a **top-down** manner. Specifically, topology domains that
are considered during scheduling of a child group are confined within a topology domain that
corresponds to the placement assumed by the parent group.

Kubernetes does not impose any strict requirements on the physical hierarchy of topology labels - topology
keys are arbitrary node labels. However, the order in which you specify topology constraints from
parent to child determines the order in which the scheduler subdivides topology domains.

{{< note >}}
As of Kubernetes v1.37, you can specify only a single topology constraint in each
`CompositePodGroup`.
{{< /note >}}

### Example

The following example configures a `Workload` where the parent `CompositePodGroupTemplate`
constrains the entire workload to a single availability zone (`topology.example.com/zone`), while
two child `PodGroupTemplate` entries (`workers` and `driver`) constrain their respective
Pods to server racks (`topology.example.com/rack`) within that zone:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: Workload
metadata:
  name: example-workload
spec:
  compositePodGroupTemplates:
  - name: root
    schedulingPolicy:
      gang:
        minGroupCount: 2
    schedulingConstraints:
      topology:
      - key: topology.example.com/zone
    podGroupTemplates:
    - name: workers
      schedulingPolicy:
        gang:
          minCount: 8
      schedulingConstraints:
        topology:
        - key: topology.example.com/rack
    - name: driver
      schedulingPolicy:
        gang:
          minCount: 1
      schedulingConstraints:
        topology:
        - key: topology.example.com/rack
```

After creating the `Workload` object, the corresponding group objects are created as follows:

- Root `CompositePodGroup` referencing the `root` template.
- Two child `PodGroup` objects (`workers` and `driver`), each referencing the root
  `CompositePodGroup` as their parent group.

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: CompositePodGroup
metadata:
  name: workload-root
spec:
  workloadRef:
    workloadName: example-workload
    templateName: root
  schedulingPolicy:
    gang:
      minGroupCount: 2
  schedulingConstraints:
    topology:
    - key: topology.example.com/zone
---
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: workload-workers
spec:
  parentCompositePodGroupName: workload-root
  workloadRef:
    workloadName: example-workload
    templateName: workers
  schedulingPolicy:
    gang:
      minCount: 8
  schedulingConstraints:
    topology:
    - key: topology.example.com/rack
---
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: workload-driver
spec:
  parentCompositePodGroupName: workload-root
  workloadRef:
    workloadName: example-workload
    templateName: driver
  schedulingPolicy:
    gang:
      minCount: 1
  schedulingConstraints:
    topology:
    - key: topology.example.com/rack
```

During scheduling, the scheduler first selects an availability zone for `workload-root`. It then
subdivides the nodes in that zone by rack to find feasible rack placements for `workload-workers`
and `workload-driver` within the selected zone.

For example, consider a cluster with five nodes labeled as follows:

| Node | `topology.example.com/zone` | `topology.example.com/rack` |
| --- | --- | --- |
| `node-a` | `zone-1` | `rack-1` |
| `node-b` | `zone-1` | `rack-1` |
| `node-c` | `zone-1` | `rack-2` |
| `node-d` | `zone-2` | `rack-1` |
| `node-e` | `zone-2` | `rack-3` |

When processing `workload-root`, the scheduler evaluates candidate placements across all cluster
nodes based on the `topology.example.com/zone` topology key:

| Evaluated candidate placement | Nodes in candidate placement |
| --- | --- |
| `zone-1` | `node-a`, `node-b`, `node-c` |
| `zone-2` | `node-d`, `node-e` |

When evaluating candidate placements for `workload-workers`, the scheduler subdivides only the nodes
within the placement assumed by `workload-root` based on the `topology.example.com/rack` topology key:

| Parent placement | Evaluated candidate placement | Nodes in candidate placement |
| --- | --- | --- |
| `zone-1` | `rack-1` | `node-a`, `node-b` |
| `zone-1` | `rack-2` | `node-c` |
| `zone-2` | `rack-1` | `node-d` |
| `zone-2` | `rack-3` | `node-e` |

Candidate placements generated for the sibling `workload-driver` PodGroup are identical to those
generated for `workload-workers`, since both groups specify the same topology key
(`topology.example.com/rack`).

## {{% heading "whatsnext" %}}

* Learn about [pod group policies](/docs/concepts/workloads/workload-api/policies/).
* Learn about [plugins related Topology-aware Scheduling](/docs/concepts/scheduling-eviction/topology-aware-scheduling/)
* Read about [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
* Learn about the [scheduling building blocks and the workloadbuilder library](/docs/concepts/workloads/workload-api/workloadbuilder/), including the scheduling constraints building block.
