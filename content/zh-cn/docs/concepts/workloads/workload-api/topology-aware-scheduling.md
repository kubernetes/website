---
title: 拓扑感知工作负载调度
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
*Topology-Aware Scheduling* (TAS) is a feature of the Workload API that optimizes the placement of
pods within the cluster.

TAS ensures that all pods within a PodGroup are co-located into a specific topology domain,
such as a single server rack or zone. This minimizes inter-pod communication latency and prevents
workload fragmentation across the cluster infrastructure.
-->
**拓扑感知调度**（Topology-Aware Scheduling，TAS）是 Workload API 的一项特性，
用于优化 Pod 在集群中的调度方式。

TAS 确保同一个 PodGroup 中的所有 Pod 被一起调度在特定的拓扑域中，
例如同一个服务器机架或同一个可用区。这减少了 Pod 之间通信的延迟，
并防止工作负载在集群基础设施中发生碎片化分布。

<!--
## Topology-aware scheduling with gang scheduling policy

When applied to PodGroups with `gang` scheduling policy, TAS simulates the potential assignment
(*placement*) of the full group of pods at once. It guarantees that at least the specified
`minCount` pods can fit together into the same topology domain before committing resources.
If no feasible placement is found, the entire PodGroup becomes unschedulable.

This is the recommended approach for workloads like distributed AI and ML training that strictly
require proximity to minimize inter-pod communication latency.
-->
## 拓扑感知调度与 `gang` 调度策略配合使用

当 TAS 应用于使用 `gang` 调度策略的 PodGroup 时，TAS 会一次性模拟整个 Pod 组的潜在分配。
TAS 保证在真正分配资源之前，至少指定数量的 `minCount` Pod 可以一起调度到同一个拓扑域中。
如果找不到可行的调度方案，则整个 PodGroup 成为不可调度。

这是推荐用于分布式 AI 和 ML 训练等工作负载的方法，
因为这类场景通常严格要求 Pod 之间具备较近的物理距离，以降低通信延迟。

<!--
If new pods are added to the PodGroup where some pods are already scheduled (for example, if pods
are recreated), the scheduler will force all new incoming pods to land on the exact same topology
domain where the existing pods currently reside. If that specific domain lacks sufficient capacity
for the new pods, the pods will remain pending - even if it means that less than `minCount` pods
are scheduled at this point.
-->
如果向已经存在部分已调度 Pod 的 PodGroup 中新增 Pod（例如 Pod 被重新创建时），
调度器将强制所有新传入的 Pod 落在现有 Pod 当前所在的完全相同的拓扑域中。
如果该特定拓扑域没有足够容量来容纳新的 Pod，这些 Pod 将保持 Pending 状态
——即使这意味着当前已调度的 Pod 数量少于 `minCount`。

{{< note >}}
<!--
As of v1.36 Topology-Aware Scheduling does not trigger workload or pod preemption. If no
feasible placement can be found without triggering preemption, the PodGroup becomes unschedulable.
-->
截至 v1.36，TAS 不会触发工作负载或 Pod 抢占。如果在不触发抢占的情况下无法找到可行的调度方案，
则 PodGroup 成为不可调度。
{{< /note >}}

<!--
## Topology-aware scheduling with basic scheduling policy

Using TAS with `basic` scheduling policy may exhibit inconsistent behavior. The scheduler may only
observe a subset of pods when entering the PodGroup scheduling cycle - therefore placement
feasibility is only evaluated for the observed pods, rather than the entire PodGroup. To partially
mitigate this limitation, you can use scheduling gates to hold off PodGroup scheduling until all
pods within the PodGroup are in the scheduling queue.
-->
## 拓扑感知调度与 `basic` 调度策略配合使用

将 TAS 与 `basic` 调度策略一起使用时，可能会出现不一致的行为。调度器在进入 PodGroup 调度周期时，
可能只能观测到部分 Pod，因此可行性评估仅针对已观测到的 Pod，而不是整个 PodGroup。为了部分缓解这一限制，
你可以使用调度门控，以便在 PodGroup 中所有 Pod 都进入调度队列之前暂缓调度。

<!--
If no feasible placement is found for the entire PodGroup, only a subset of pods may be scheduled,
and they are guaranteed to meet the scheduling constraints.

If new pods are added to the PodGroup where some pods are already scheduled, the scheduler will act
the same as in case of `gang` policy - forcing the new pods into the same domain, unless there is
insufficient capacity (in which case the new pods will remain pending).
-->
如果无法为整个 PodGroup 找到可行的调度方案，则可能只有部分 Pod 会被调度，
但这些已调度的 Pod 仍然保证满足调度约束。

如果向已经存在部分已调度 Pod 的 PodGroup 中新增 Pod，
调度器的行为将与 `gang` 策略相同——强制新 Pod 进入相同的拓扑域，
除非容量不足（在这种情况下，新 Pod 将保持 Pending 状态）。

<!--
## API configuration: scheduling constraints

Every PodGroup (or PodGroupTemplate) may optionally declare the `schedulingConstraints` field,
which is interpreted by the [placement-based PodGroup scheduling algorithm](/docs/concepts/scheduling-eviction/podgroup-scheduling/#placement-scheduling-algorithm).
If constraints are defined in PodGroupTemplate, they will be copied to referencing PodGroups.

As of Kubernetes v1.36, the API supports topology constraints.
-->
## API 配置：调度约束

每个 PodGroup（或 PodGroupTemplate）都可以选择性声明 `schedulingConstraints` 字段，有关该字段的细节参阅
[PodGroup 调度算法](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/#placement-scheduling-algorithm)。
如果在 PodGroupTemplate 中定义了约束，这些约束会复制到引用该模板的 PodGroup 中。

截至 Kubernetes v1.36，API 支持拓扑约束。

{{< note >}}
<!--
As of Kubernetes v1.36, you can specify only a single topology constraint in each PodGroup.
-->
截至 Kubernetes v1.36，你只可以在每个 PodGroup 中指定一个拓扑约束。
{{< /note >}}

<!--
### Topology constraint

To define a topology constraint for a PodGroup you need to set a `key`, which corresponds to
a Kubernetes node label, representing the target topology domain (for example, a rack or a zone).
The scheduler strictly enforces that all pods within the PodGroup are placed onto nodes that share
the exact same value for this specified label.

Here is an example of a PodGroup configured with a topology constraint:
-->
### 拓扑约束

要为 PodGroup 定义拓扑约束，你需要设置一个 `key`，
它对应 Kubernetes 节点上的某个标签，用于表示目标拓扑域（例如机架或可用区）。
调度器会严格保证：同一个 PodGroup 中的所有 Pod 只能被调度到具有相同标签值的节点上。

下面是一个配置了拓扑约束的 PodGroup 示例：

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
<!--
## Multi-level topology-aware scheduling
-->
## 多级拓扑感知调度

{{< feature-state feature_gate_name="CompositePodGroup" >}}

<!--
Complex workloads might require co-location of their Pods at different levels of the cluster
infrastructure. For example, an entire workload may need to run within a single availability zone,
while different parts of that workload may require strict co-location within specific server racks.

Such multi-level co-location requirements can be expressed using the `CompositePodGroup` API and
by specifying topology constraints at different levels of a group hierarchy.

Using the `CompositePodGroup` API requires enabling the
[`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
feature gate and the
`scheduling.k8s.io/v1alpha3` {{< glossary_tooltip text="API group" term_id="api-group" >}}.
-->
复杂工作负载可能需要将其 Pod 共置于集群基础架构的不同层级。
例如，整个工作负载可能需要运行在单个可用区内，而该工作负载的不同部分可能需要严格共置于特定服务器机架上。

此类多层级共置需求可以通过 `CompositePodGroup` API 表达，并在组层级结构的不同层次上指定拓扑约束。

使用 `CompositePodGroup` API 需要启用
[`CompositePodGroup`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
特性门控和 `scheduling.k8s.io/v1alpha3` {{</* glossary_tooltip text="API 组" term_id="api-group" */>}}。


<!--
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
-->
### 多层级拓扑约束解析

`CompositePodGroup` 层级结构中的每个组都可以指定一个拓扑约束，确保该组的所有后代
Pod 都会在与该组约束相匹配的同一拓扑域中进行调度。

在[分层调度](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling)过程中，
调度器以**自顶向下**的方式解析这些约束。具体而言，在对子组进行调度时所考虑的拓扑域，
会被限定在父组所假定的位置对应的拓扑域之内。

Kubernetes 并不对拓扑标签的物理层级结构施加任何严格的要求——拓扑键是任意的节点标签。
不过，你从父组到子组指定拓扑约束的顺序，决定了调度器对拓扑域进行细分的顺序。

{{< note >}}
<!--
As of Kubernetes v1.37, you can specify only a single topology constraint in each
`CompositePodGroup`.
-->
从 Kubernetes v1.37 起，你只能在每个 `CompositePodGroup` 中指定一个拓扑约束。
{{< /note >}}

<!--
### Example

The following example configures a `Workload` where the parent `CompositePodGroupTemplate`
constrains the entire workload to a single availability zone (`topology.example.com/zone`), while
two child `PodGroupTemplate` entries (`workers` and `driver`) constrain their respective
Pods to server racks (`topology.example.com/rack`) within that zone:
-->
### 示例

下面的示例配置了一个 `Workload`，其中父级 `CompositePodGroupTemplate`
将整个工作负载约束到单个可用区（`topology.example.com/zone`），而两个子级 `PodGroupTemplate`
条目（`workers` 和 `driver`）将它们各自的 Pod 约束到该可用区内的服务器机架（`topology.example.com/rack`）：

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

<!--
After creating the `Workload` object, the corresponding group objects are created as follows:

- Root `CompositePodGroup` referencing the `root` template.
- Two child `PodGroup` objects (`workers` and `driver`), each referencing the root
  `CompositePodGroup` as their parent group.
-->
在创建 `Workload` 对象之后，对应的组对象将被创建，如下：

- 根级 `CompositePodGroup`，引用 `root` 模板。
- 两个子级 `PodGroup` 对象（`workers` 和 `driver`），各自将根级 `CompositePodGroup` 引用为其父组。

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

<!--
During scheduling, the scheduler first selects an availability zone for `workload-root`. It then
subdivides the nodes in that zone by rack to find feasible rack placements for `workload-workers`
and `workload-driver` within the selected zone.

For example, consider a cluster with five nodes labeled as follows:
-->
在调度过程中，调度器首先为 `workload-root` 选择一个可用区，然后按机架细分该可用区内的节点，
以找到 `workload-workers` 和 `workload-driver` 在所选可用区内的可行机架放置位置。

例如，考虑一个包含五个节点的集群，其标签如下：

| Node | `topology.example.com/zone` | `topology.example.com/rack` |
| --- | --- | --- |
| `node-a` | `zone-1` | `rack-1` |
| `node-b` | `zone-1` | `rack-1` |
| `node-c` | `zone-1` | `rack-2` |
| `node-d` | `zone-2` | `rack-1` |
| `node-e` | `zone-2` | `rack-3` |

<!--
When processing `workload-root`, the scheduler evaluates candidate placements across all cluster
nodes based on the `topology.example.com/zone` topology key:

| Evaluated candidate placement | Nodes in candidate placement |
| --- | --- |
| `zone-1` | `node-a`, `node-b`, `node-c` |
| `zone-2` | `node-d`, `node-e` |
-->
在处理 `workload-root` 时，调度器会基于 `topology.example.com/zone` 拓扑键，在所有集群节点上评估候选放置位置：

| 评估的候选位置 | 候选位置内的节点 |
| --- | --- |
| `zone-1` | `node-a`, `node-b`, `node-c` |
| `zone-2` | `node-d`, `node-e` |

<!--
When processing `workload-root`, the scheduler evaluates candidate placements across all cluster
nodes based on the `topology.example.com/zone` topology key:


| Evaluated candidate placement | Nodes in candidate placement |
| --- | --- | --- |
| `zone-1` | `rack-1` | `node-a`, `node-b` |
| `zone-1` | `rack-2` | `node-c` |
| `zone-2` | `rack-1` | `node-d` |
| `zone-2` | `rack-3` | `node-e` |
-->
在处理 `workload-root` 时，调度器会基于 `topology.example.com/zone` 拓扑键，在所有集群节点上评估候选放置位置：

| 评估的候选位置 | 候选位置内的节点 |
| --- | --- | --- |
| `zone-1` | `rack-1` | `node-a`, `node-b` |
| `zone-1` | `rack-2` | `node-c` |
| `zone-2` | `rack-1` | `node-d` |
| `zone-2` | `rack-3` | `node-e` |

<!--
Candidate placements generated for the sibling `workload-driver` PodGroup are identical to those
generated for `workload-workers`, since both groups specify the same topology key
(`topology.example.com/rack`).
-->
为同级 `workload-driver` PodGroup 生成的候选放置位置与为 `workload-workers`
生成的相同，因为这两个组都指定了相同的拓扑键（`topology.example.com/rack`）。

## {{% heading "whatsnext" %}}

<!--
* Learn about [pod group policies](/docs/concepts/workloads/workload-api/policies/).
* Learn about [plugins related Topology-aware Scheduling](/docs/concepts/scheduling-eviction/topology-aware-scheduling/)
* Read about [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
* Learn about the [scheduling building blocks and the workloadbuilder library](/docs/concepts/workloads/workload-api/workloadbuilder/), including the scheduling constraints building block.
-->
* 了解 [Pod 组策略](/zh-cn/docs/concepts/workloads/workload-api/policies/)。
* 了解[拓扑感知调度相关插件](/zh-cn/docs/concepts/scheduling-eviction/topology-aware-scheduling/)
* 参阅 [Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)算法。
* 了解[调度构建块和 workloadbuilder 库](/zh-cn/docs/concepts/workloads/workload-api/workloadbuilder/)，包括调度约束构建块。
