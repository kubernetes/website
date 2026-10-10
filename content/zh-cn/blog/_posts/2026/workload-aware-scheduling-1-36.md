---
layout: blog
title: "Kubernetes v1.36：工作负载感知调度再进一步"
date: 2026-05-13T10:35:00-08:00
slug: kubernetes-v1-36-advancing-workload-aware-scheduling
author: >
  Maciej Skoczeń (Google),
  Antoni Zawodny (Google),
  Matt Matejczyk (Google),
  Bartosz Rejman (Google),
  Jon Huhn (Microsoft),
  Maciej Wyrzuc (Google),
  Heba Elayoty (Microsoft)
translator: >
  [Fan Baofa](https://github.com/carlory) (DaoCloud)
---

<!--
layout: blog
title: "Kubernetes v1.36: Advancing Workload-Aware Scheduling"
date: 2026-05-13T10:35:00-08:00
slug: kubernetes-v1-36-advancing-workload-aware-scheduling
author: >
  Maciej Skoczeń (Google),
  Antoni Zawodny (Google),
  Matt Matejczyk (Google),
  Bartosz Rejman (Google),
  Jon Huhn (Microsoft),
  Maciej Wyrzuc (Google),
  Heba Elayoty (Microsoft)
-->

<!--
AI/ML and batch workloads introduce unique scheduling challenges that go beyond simple Pod-by-Pod scheduling.
In Kubernetes v1.35, we introduced the first tranche of *workload-aware scheduling* improvements,
featuring the foundational Workload API alongside basic *gang scheduling* support built on a Pod-based framework,
and an *opportunistic batching* feature to efficiently process identical Pods.
-->
AI/ML 和批处理工作负载带来了独特的调度挑战，已经超出了简单逐个 Pod 调度的范畴。
在 Kubernetes v1.35 中，我们引入了首批**工作负载感知调度**改进，
其中包括基础性的 Workload API、基于 Pod 框架构建的基本**编组调度**支持，
以及用于高效处理相同 Pod 的**机会性批处理**特性。

<!--
Kubernetes v1.36 introduces a significant architectural evolution by cleanly separating API concerns:
the Workload API acts as a static template, while the new PodGroup API handles the runtime state.
To support this, the `kube-scheduler` features a new *PodGroup scheduling cycle* that enables atomic workload processing
and paves the way for future enhancements. This release also debuts the first iterations of *topology-aware scheduling*
and *workload-aware preemption* to advance scheduling capabilities. Additionally,
*ResourceClaim support for workloads* unlocks *Dynamic Resource Allocation
([DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/))* for PodGroups. Finally,
to demonstrate real-world readiness, v1.36 delivers the first phase of integration between the Job controller and the new API.
-->
Kubernetes v1.36 通过清晰分离 API 关注点，引入了一项重要的架构演进：
Workload API 充当静态模板，而新的 PodGroup API 负责处理运行时状态。
为了支持这一点，`kube-scheduler` 提供了新的 **PodGroup 调度周期**，
支持以原子方式处理工作负载，并为未来增强铺平道路。
此版本还首次推出了**拓扑感知调度**和**工作负载感知抢占**的初始迭代，以推进调度能力。
此外，**工作负载的 ResourceClaim 支持**为 PodGroup 解锁了**动态资源分配
（[DRA](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)）**。
最后，为了展示其面向真实场景的就绪程度，v1.36 交付了 Job 控制器与新 API 集成的第一阶段。

<!--
## Workload and PodGroup API updates
-->
## Workload 和 PodGroup API 更新

<!--
The Workload API now serves as a static template, while the new PodGroup API describes the runtime object.
Kubernetes v1.36 introduces the Workload and PodGroup APIs as part of the
`scheduling.k8s.io/v1alpha2` {{< glossary_tooltip text="API group" term_id="api-group" >}},
completely replacing the previous `v1alpha1` API version.
-->
Workload API 现在用作静态模板，而新的 PodGroup API 描述运行时对象。
Kubernetes v1.36 将 Workload 和 PodGroup API 作为
`scheduling.k8s.io/v1alpha2` {{< glossary_tooltip text="API 组" term_id="api-group" >}}的一部分引入，
完全替代此前的 `v1alpha1` API 版本。

<!--
In v1.35, Pod groups and their runtime states were embedded within the Workload resource.
The new model decouples these concepts: the Workload now serves as a static template object,
while the PodGroup manages the runtime state. This separation also improves performance and scalability
as the PodGroup API allows per-replica sharding of status updates.
-->
在 v1.35 中，Pod 组及其运行时状态嵌入在 Workload 资源中。
新模型解耦了这些概念：Workload 现在充当静态模板对象，
而 PodGroup 负责管理运行时状态。
这种分离也提升了性能和可扩缩性，因为 PodGroup API 允许按副本对状态更新进行分片。

<!--
Because the Workload API acts merely as a template, the `kube-scheduler`'s logic is streamlined.
The scheduler can directly read the PodGroup, which contains all the information required by the scheduler,
without needing to watch or parse the Workload object itself.
-->
由于 Workload API 仅作为模板存在，`kube-scheduler` 的逻辑得以简化。
调度器可以直接读取 PodGroup；PodGroup 包含调度器所需的全部信息，
因此调度器无需监视或解析 Workload 对象本身。

<!--
Here is what the updated configuration looks like. Workload controllers (such as the Job controller)
define the Workload object, which now acts as a static template for your Pod groups:
-->
更新后的配置如下所示。工作负载控制器（例如 Job 控制器）
定义 Workload 对象，而这个对象现在充当 Pod 组的静态模板：

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  # Pod 组现在定义为模板，
  # 其中包含 PodGroup 对象的 spec 字段。
  podGroupTemplates:
  - name: workers
    schedulingPolicy:
      gang:
        # 仅当 4 个 Pod 可以同时运行时，此 gang 才可调度
        minCount: 4
```

<!--
Controllers then stamp out runtime PodGroup instances based on those templates.
The PodGroup runtime object holds the actual scheduling policy and references the template from which it was created.
It also has a status containing conditions that mirror the states of individual Pods,
reflecting the overall scheduling state of the group:
-->
随后，控制器基于这些模板生成运行时 PodGroup 实例。
PodGroup 运行时对象保存实际的调度策略，并引用创建它所用的模板。
它还包含一个状态字段，其中的状况会映射各个 Pod 的状态，
反映这个组的整体调度状态：

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-job-workers-pg
  namespace: some-ns
spec:
  # PodGroup 引用其来源 Workload 模板。
  # 相比之下，.metadata.ownerReferences 指向“真正的”工作负载对象，
  # 例如 Job。
  podGroupTemplateRef:
    workload:
      workloadName: training-job-workload
      podGroupTemplateName: workers
  # 实际的调度策略放在运行时 PodGroup 中
  schedulingPolicy:
    gang:
      minCount: 4
status:
  # status 包含映射各个 Pod 状况的状况信息。
  conditions:
  - type: PodGroupScheduled
    status: "True"
    lastTransitionTime: 2026-04-03T00:00:00Z
```

<!--
Finally, to bridge this new architecture with individual Pods, the `workloadRef` field in the Pod API has been replaced
with the `schedulingGroup` field. When creating Pods, you link them directly to the runtime PodGroup:
-->
最后，为了将这一新架构与各个 Pod 衔接起来，Pod API 中的 `workloadRef` 字段已被
`schedulingGroup` 字段替代。创建 Pod 时，你可以将它们直接关联到运行时 PodGroup：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
  namespace: some-ns
spec:
  # workloadRef 字段已被 schedulingGroup 替代
  schedulingGroup:
    podGroupName: training-job-workers-pg
  ...
```

<!--
By keeping the Workload as a static template and elevating the PodGroup to a first-class, standalone API,
we establish a robust foundation for building advanced workload scheduling capabilities in future Kubernetes releases.
-->
通过将 Workload 保持为静态模板，并将 PodGroup 提升为一等、独立的 API，
我们为在未来 Kubernetes 版本中构建高级工作负载调度能力奠定了坚实基础。

<!--
## PodGroup scheduling cycle and gang scheduling
-->
## PodGroup 调度周期和编组调度

<!--
To efficiently manage these workloads, the kube-scheduler now features a dedicated *PodGroup scheduling cycle*.
Instead of evaluating and reserving resources sequentially Pod-by-Pod, which risks scheduling deadlocks,
the scheduler evaluates the group as a unified operation.
-->
为了高效管理这些工作负载，kube-scheduler 现在提供了专用的 **PodGroup 调度周期**。
调度器不再逐个 Pod 顺序评估和预留资源，因为这种方式存在调度死锁风险；
它会把整个组作为一个统一操作来评估。

<!--
When the scheduler pops a PodGroup member from the scheduling queue, regardless of the group's specific policy,
it fetches the rest of the queued Pods for that group, sorts them deterministically,
and executes an atomic scheduling cycle as follows:
-->
当调度器从调度队列中弹出某个 PodGroup 成员时，无论该组使用哪种具体策略，
它都会获取该组中其余已排队的 Pod，以确定性方式对它们排序，
并按如下方式执行一个原子的调度周期：

<!--
1. The scheduler takes a single snapshot of the cluster state to prevent race conditions and ensure consistency
   while evaluating the entire group.

2. It then attempts to find valid Node placements for all Pods in the group using a PodGroup scheduling algorithm,
   which leverages the standard Pod-based filtering and scoring phases.

3. Based on the algorithm's outcome, the scheduling decision is applied atomically for the entire PodGroup.

   * Success: If the placement is found and group constraints are met, the schedulable member Pods
     are moved directly to the binding phase together. Any remaining unschedulable Pods are returned
     to the scheduling queue to wait for available resources so they can join the already scheduled Pods.

     (Note: If new Pods are added to a PodGroup after others are already scheduled,
     the cycle evaluates the new Pods while accounting for the existing ones.
     Crucially, Pods already assigned to Nodes remain running. The scheduler will not unassign
     or evict them, even if the group fails to meet its requirements in subsequent cycles.)

   * Failure: If the group fails to meet its requirements, the entire group is considered unschedulable.
     None of the Pods are bound, and they are returned to the scheduling queue to retry later after a backoff period.
-->
1. 调度器对集群状态获取一次快照，以避免竞态条件，并确保在评估整个组时保持一致性。

2. 随后，调度器尝试使用 PodGroup 调度算法为组内所有 Pod 找到有效的 Node 放置方案；
   该算法会利用标准的基于 Pod 的过滤和评分阶段。

3. 根据算法结果，调度决策会以原子方式应用到整个 PodGroup。

   * 成功：如果找到了放置方案且满足组约束，可调度的成员 Pod 会一起直接进入绑定阶段。
     其余仍不可调度的 Pod 会返回调度队列，等待可用资源，以便之后加入已调度的 Pod。

     （注意：如果在某些 Pod 已经调度后，又有新的 Pod 添加到 PodGroup，
     这个周期会在考虑已有 Pod 的同时评估新 Pod。
     关键在于，已经分配到 Node 的 Pod 会继续运行。
     即使该组在后续周期中未能满足其要求，调度器也不会取消分配或驱逐这些 Pod。）

   * 失败：如果该组未能满足其要求，整个组会被视为不可调度。
     不会绑定任何 Pod，这些 Pod 会返回调度队列，并在退避期之后稍后重试。

<!--
This cycle acts as the foundation for *gang scheduling*. When your workload requires strict *all-or-nothing* placement,
the `gang` policy leverages this cycle to prevent partial deployments that lead to resource wastage and potential deadlocks.
-->
这个周期是**编组调度**的基础。
当你的工作负载需要严格的**全有或全无**放置时，
`gang` 策略会利用这个周期，防止部分部署造成资源浪费和潜在死锁。

<!--
While the scheduler still holds the Pods in the `PreEnqueue` until the `minCount` requirement is met, the actual scheduling phase now relies entirely
on the new PodGroup cycle. Specifically, during the algorithm's execution, the scheduler verifies
that the number of schedulable Pods satisfies the `minCount`. If the cluster cannot accommodate the required minimum,
none of the pods are bound. The group fails and waits for sufficient resources to free up.
-->
虽然调度器仍会在满足 `minCount` 要求之前将 Pod 保留在 `PreEnqueue` 中，
但实际调度阶段现在完全依赖新的 PodGroup 周期。
具体而言，在算法执行期间，调度器会验证可调度 Pod 的数量是否满足 `minCount`。
如果集群无法容纳所需的最小数量，则不会绑定任何 Pod。
该组调度失败，并等待释放出足够资源。

<!--
### Limitations
-->
### 局限性

<!--
The first version of the PodGroup scheduling cycle comes with certain limitations:
-->
PodGroup 调度周期的首个版本存在一些局限性：

<!--
* For basic *homogeneous* Pod groups (i.e., those where all Pods have identical scheduling requirements
  and lack inter-Pod dependencies like affinity, anti-affinity, or topology spread constraints),
  the algorithm is expected to find a placement if one exists.

* For *heterogeneous* Pod groups, finding a valid placement if one exists is not guaranteed,
  even when the solution might seem trivial.

* For Pod groups with *inter-Pod dependencies*, finding a valid placement if one exists is not guaranteed.
-->
* 对于基本的**同构** Pod 组（即所有 Pod 具有相同调度要求，
  且不存在亲和性、反亲和性或拓扑分布约束等 Pod 间依赖的 Pod 组），
  如果存在可行的放置方案，算法预计能够找到它。

* 对于**异构** Pod 组，即使存在有效的放置方案，也不保证一定能找到，
  哪怕这个方案看起来很简单。

* 对于存在 **Pod 间依赖**的 Pod 组，即使存在有效的放置方案，也不保证一定能找到。

<!--
In addition to the above, for cases involving *intra-group dependencies*
(e.g., when the schedulability of one Pod depends on another group member via inter-Pod affinity),
this algorithm may fail to find a placement regardless of cluster state due to its deterministic processing order.
-->
除上述情况外，对于涉及**组内依赖**的场景
（例如某个 Pod 的可调度性通过 Pod 间亲和性依赖于另一个组成员），
由于该算法采用确定性的处理顺序，无论集群状态如何，都可能无法找到放置方案。

<!--
## Topology-aware scheduling
-->
## 拓扑感知调度

<!--
For complex distributed workloads like AI/ML training or batch processing, placing Pods randomly across a cluster
can introduce significant network latency and bottleneck overall performance.
-->
对于 AI/ML 训练或批处理这类复杂分布式工作负载，将 Pod 随机放置到整个集群中
可能引入显著的网络延迟，并成为整体性能瓶颈。

<!--
Topology-aware scheduling addresses this problem by allowing you to define topology constraints directly on a PodGroup,
ensuring its Pods are co-located within specific physical or logical domains:
-->
拓扑感知调度通过允许你直接在 PodGroup 上定义拓扑约束来解决这个问题，
确保其 Pod 被共同放置在特定的物理或逻辑域内：

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: topology-aware-workers-pg
spec:
  schedulingPolicy:
    gang:
      minCount: 4
  # 强制 Pod 根据机架拓扑共同放置
  schedulingConstraints:
    topology:
      - key: topology.kubernetes.io/rack
```

<!--
In this example, the `kube-scheduler` attempts to schedule the Pods across various combinations of Nodes
that match the `rack` topology constraint. It then selects the optimal placement based on how efficiently
the PodGroup utilizes resources and how many Pods can successfully be scheduled within that domain.
-->
在这个示例中，`kube-scheduler` 会尝试将 Pod 调度到符合 `rack` 拓扑约束的多种 Node 组合上。
随后，它会根据 PodGroup 利用资源的效率，以及在该域内可以成功调度多少 Pod，
选择最优放置方案。

<!--
To achieve this, the scheduler extends the PodGroup scheduling cycle with a dedicated placement-based algorithm
consisting of three phases:
-->
为实现这一点，调度器用一个专用的、基于放置方案的算法扩展了 PodGroup 调度周期；
该算法包含三个阶段：

<!--
1. Generate candidate placements (subsets of Nodes that are theoretically feasible for the PodGroup's assignment)
   based on the group's scheduling constraints. The topology-aware scheduling plugin uses the new `PlacementGenerate`
   extension point to create these placements.

2. Evaluate each proposed placement to confirm whether the entire PodGroup can actually fit there.

3. Score all feasible placements to select the best fit for the PodGroup. The topology-aware scheduling plugins
   use the new `PlacementScore` extension point to score these placements.
-->
1. 根据组的调度约束生成候选放置方案
   （理论上适合分配给 PodGroup 的 Node 子集）。
   拓扑感知调度插件使用新的 `PlacementGenerate` 扩展点创建这些放置方案。

2. 评估每个候选放置方案，确认整个 PodGroup 是否实际能够放入其中。

3. 对所有可行的放置方案打分，为 PodGroup 选择最合适的方案。
   拓扑感知调度插件使用新的 `PlacementScore` 扩展点对这些放置方案进行打分。

<!--
Currently, topology-aware scheduling does not trigger Pod preemption to satisfy constraints.
However, we plan to integrate workload-aware preemption with topology constraints in the upcoming release.
-->
目前，拓扑感知调度不会触发 Pod 抢占来满足约束。
不过，我们计划在即将到来的版本中，将工作负载感知抢占与拓扑约束集成起来。

<!--
While Kubernetes v1.36 delivers this foundational topology-aware scheduling, the Kubernetes project is planning
expand its capabilities soon. Future updates will introduce support for multiple topology levels,
soft constraints (preferences), deeper integration with Dynamic Resource Allocation (DRA),
and more robust behavior when paired with the `basic` scheduling policy.
-->
虽然 Kubernetes v1.36 交付了这一基础性的拓扑感知调度能力，
Kubernetes 项目计划很快扩展其能力。
未来更新将引入对多级拓扑、软约束（偏好）的支持，
与动态资源分配（DRA）的更深度集成，
以及在与 `basic` 调度策略配合使用时更稳健的行为。

<!--
## Workload-aware preemption
-->
## 工作负载感知抢占

<!--
To support the new PodGroup scheduling cycle, Kubernetes v1.36 introduces a new type of preemption mechanism
called *workload-aware preemption*. When a PodGroup cannot be scheduled, the scheduler utilizes this mechanism
to try making a scheduling of this PodGroup possible.
-->
为了支持新的 PodGroup 调度周期，Kubernetes v1.36 引入了一种新的抢占机制，
称为**工作负载感知抢占**。
当某个 PodGroup 无法调度时，调度器会利用这一机制尝试让该 PodGroup 的调度成为可能。

<!--
Compared to the default preemption used in the standard Pod-by-Pod scheduling cycle, this new mechanism
treats the entire PodGroup as a single preemptor unit. Instead of evaluating preemption victims on each Node separately,
it searches across the entire cluster. This allows the scheduler to preempt Pods from multiple Nodes simultaneously,
making enough space to schedule the whole PodGroup afterwards.
-->
与标准逐个 Pod 调度周期中使用的默认抢占相比，这种新机制会将整个 PodGroup 视为单个抢占者单元。
它不会在每个 Node 上单独评估抢占牺牲者，而是在整个集群范围内搜索。
这允许调度器同时从多个 Node 抢占 Pod，
从而为随后调度整个 PodGroup 腾出足够空间。

<!--
Workload-aware preemption also introduces two additional concepts directly to the PodGroup API:

* PodGroup `priority` that overrides the priority of the individual Pods forming the PodGroup.

* PodGroup `disruptionMode` that dictates whether the Pods within a PodGroup can be preempted independently,
  or if they have to be preempted together in an *all-or-nothing* fashion.
-->
工作负载感知抢占还直接向 PodGroup API 引入了两个额外概念：

* PodGroup `priority`：覆盖构成 PodGroup 的各个 Pod 的优先级。

* PodGroup `disruptionMode`：指定 PodGroup 中的 Pod 是否可以独立被抢占，
  或者是否必须以**全有或全无**的方式一起被抢占。

<!--
In Kubernetes v1.36, these fields are only respected by the workload-aware preemption mechanism.
The people working on this set of features are hoping to extend support for these fields
to other disruption sources, including default preemption used in the Pod-by-Pod scheduling cycle, in future releases.
-->
在 Kubernetes v1.36 中，只有工作负载感知抢占机制会遵从这些字段。
负责这组特性的人员希望在未来版本中，
将这些字段的支持扩展到其他中断来源，
包括逐个 Pod 调度周期中使用的默认抢占。

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: victim-pg
spec:
  priorityClassName: high-priority
  priority: 1000
  disruptionMode: PodGroup
```

<!--
In this example, when the scheduler evaluates `victim-pg` as a potential preemption victim
during a workload-aware preemption cycle, it will use 1000 as its priority and preempt the PodGroup
in a strictly *all-or-nothing* fashion.
-->
在这个示例中，当调度器在工作负载感知抢占周期中将 `victim-pg`
作为潜在抢占牺牲者进行评估时，
它会使用 1000 作为其优先级，并以严格的**全有或全无**方式抢占该 PodGroup。

<!--
## DRA ResourceClaim support for workloads
-->
## 工作负载的 DRA ResourceClaim 支持

<!--
Since its general availability in Kubernetes v1.34, {{< glossary_tooltip text="DRA" term_id="dra" >}}
has enabled Pods to make detailed requests for {{<glossary_tooltip text="devices" term_id="device" >}}
like GPUs, TPUs, and NICs. Requested devices can be shared by multiple Pods
requesting the same {{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}}
by name. Other requests can be replicated through a {{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}},
in which Kubernetes generates one ResourceClaim with a non-deterministic name
for each Pod referencing the template. However, large-scale workloads that require
certain Pods to share certain devices are currently left to manage creating
individual ResourceClaims themselves.
-->
自 Kubernetes v1.34 正式可用以来，{{< glossary_tooltip text="DRA" term_id="dra" >}}
已经让 Pod 能够对 GPU、TPU 和 NIC 等{{<glossary_tooltip text="设备" term_id="device" >}}
提出详细请求。所请求的设备可以由多个按名称请求同一个
{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}} 的 Pod 共享。
其他请求可以通过 {{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}} 进行复制；
在这种情况下，Kubernetes 会为每个引用该模板的 Pod 生成一个名称非确定性的 ResourceClaim。
然而，对于需要让某些 Pod 共享某些设备的大规模工作负载，
目前仍需要自行管理各个 ResourceClaim 的创建。

<!--
Now, in addition to Pods, PodGroups can represent the replicable unit for a
ResourceClaimTemplate. For ResourceClaimTemplates referenced by one of a
PodGroup's `spec.resourceClaims`, Kubernetes generates one ResourceClaim for the
entire PodGroup, no matter how many Pods are in the group. When one of a Pod's
`spec.resourceClaims` for a ResourceClaimTemplate matches one of its PodGroup's
`spec.resourceClaims`, the Pod's claim resolves to the ResourceClaim generated
for the PodGroup and a ResourceClaim will not be generated for that individual
Pod. A single PodGroupTemplate in a Workload object can express resource
requests which are both copied for each distinct PodGroup and shareable by the
Pods within each group.
-->
现在，除了 Pod 之外，PodGroup 也可以表示 ResourceClaimTemplate 的可复制单元。
对于 PodGroup 的某个 `spec.resourceClaims` 所引用的 ResourceClaimTemplate，
无论组内有多少 Pod，Kubernetes 都会为整个 PodGroup 生成一个 ResourceClaim。
当 Pod 中用于 ResourceClaimTemplate 的某个 `spec.resourceClaims`
与其 PodGroup 中的某个 `spec.resourceClaims` 匹配时，
该 Pod 的申领会解析为为 PodGroup 生成的 ResourceClaim，
并且不会为这个单独的 Pod 生成 ResourceClaim。
Workload 对象中的单个 PodGroupTemplate 可以表达一种资源请求：
这种请求既会为每个不同的 PodGroup 复制，
又可由每个组内的 Pod 共享。

<!--
The following example shows two Pods requesting the same ResourceClaim generated
from a ResourceClaimTemplate for their PodGroup:
-->
下面的示例展示了两个 Pod 请求同一个 ResourceClaim；
这个 ResourceClaim 是从其 PodGroup 的 ResourceClaimTemplate 生成的：

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-job-workers-pg
spec:
  ...
  resourceClaims:
    - name: pg-claim
      resourceClaimTemplateName: my-claim-template
---
apiVersion: v1
kind: Pod
metadata:
  name: topology-aware-workers-pg-pod-1
spec:
  ...
  schedulingGroup:
    podGroupName: training-job-workers-pg
  resourceClaims:
    - name: pg-claim
      resourceClaimTemplateName: my-claim-template
---
apiVersion: v1
kind: Pod
metadata:
  name: topology-aware-workers-pg-pod-2
spec:
  ...
  schedulingGroup:
    podGroupName: training-job-workers-pg
  resourceClaims:
    - name: pg-claim
      resourceClaimTemplateName: my-claim-template
```

<!--
In addition, ResourceClaims referenced by PodGroups, either through
`resourceClaimName` or the claim generated from `resourceClaimTemplateName`,
become reserved for the entire PodGroup. Previously, kube-scheduler could only
list individual Pods in a ResourceClaim's `status.reservedFor` field which is
limited to 256 items. Now, a single PodGroup reference in `status.reservedFor`
can represent many more than 256 Pods, allowing high-cardinality sharing of
devices.
-->
此外，PodGroup 通过 `resourceClaimName` 引用的 ResourceClaim，
或通过 `resourceClaimTemplateName` 生成的申领，
都会为整个 PodGroup 预留。
此前，kube-scheduler 只能在 ResourceClaim 的 `status.reservedFor` 字段中
列出各个 Pod，而该字段限制为 256 个条目。
现在，`status.reservedFor` 中的单个 PodGroup 引用可以表示远多于 256 个 Pod，
从而允许设备的高基数共享。

<!--
Together, these changes enable massive workloads with complex topologies to
utilize DRA for scalable device management.
-->
这些变更结合起来，使具有复杂拓扑的大规模工作负载能够利用 DRA
实现可扩缩的设备管理。

<!--
## Integration with the Job controller
-->
## 与 Job 控制器集成

<!--
In Kubernetes v1.36, the Job controller can create and manage Workload and PodGroup objects on your behalf,
so that Jobs representing a tightly coupled parallel application, such as distributed AI training,
are gang-scheduled without any additional tooling. Without this integration, you would have to
create the Workload and PodGroup yourself and wire their references into the Pod template.
Now, the Job controller automates this process natively.
-->
在 Kubernetes v1.36 中，Job 控制器可以代表你创建和管理 Workload 与 PodGroup 对象，
因此表示紧耦合并行应用（例如分布式 AI 训练）的 Job
无需任何额外工具即可进行编组调度。
如果没有这种集成，你需要自行创建 Workload 和 PodGroup，
并将它们的引用连接到 Pod 模板中。
现在，Job 控制器以原生方式自动化了这一过程。

<!--
When the [`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadWithJob)
feature gate is enabled, the Job controller automatically:
-->
启用 [`EnableWorkloadWithJob`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#EnableWorkloadWithJob)
特性门控后，Job 控制器会自动：

<!--
* creates a Workload and a corresponding runtime PodGroup for each qualifying Job,

* sets `.spec.schedulingGroup` onto every Pod the Job creates
  so the scheduler treats them as a single gang, and

* sets the Job as the owner of the generated objects,
  so they are garbage-collected when the Job is deleted.
-->
* 为每个符合条件的 Job 创建一个 Workload 和对应的运行时 PodGroup；

* 在 Job 创建的每个 Pod 上设置 `.spec.schedulingGroup`，
  使调度器将它们视为一个 gang；

* 将 Job 设置为所生成对象的属主，
  因此这些对象会在 Job 被删除时被垃圾收集。

<!--
### When does the integration kick in?
-->
### 什么时候会触发集成？

<!--
To keep the first feature iteration predictable, the Job controller only creates a
Workload and PodGroup when the Job has a well-defined, fixed shape:
-->
为了让首个特性迭代保持可预测，只有当 Job 具有定义明确且固定的形态时，
Job 控制器才会创建 Workload 和 PodGroup：

<!--
* `.spec.parallelism` is greater than 1

* [`.spec.completionMode`](/docs/concepts/workloads/controllers/job/#completion-mode) is set to `Indexed`

* `.spec.completions` is equal to `.spec.parallelism`

* The `schedulingGroup` is not already set on the Pod template.
-->
* `.spec.parallelism` 大于 1

* [`.spec.completionMode`](/zh-cn/docs/concepts/workloads/controllers/job/#completion-mode) 设置为 `Indexed`

* `.spec.completions` 等于 `.spec.parallelism`

* Pod 模板上尚未设置 `schedulingGroup`

<!--
These conditions describe the class of Jobs that gang scheduling can reason about:
each Pod has a stable identity (`Indexed`), the gang size is known and fixed at admission time
(`parallelism` == `completions`), and no other controller has already claimed scheduling responsibility
(`schedulingGroup` field is unset). Jobs that do not meet these conditions are scheduled Pod-by-Pod,
exactly as before.
-->
这些条件描述了编组调度可以推理的一类 Job：
每个 Pod 都具有稳定身份（`Indexed`），gang 的规模在准入时已知且固定
（`parallelism` == `completions`），并且没有其他控制器已经声明调度责任
（`schedulingGroup` 字段未设置）。
不满足这些条件的 Job 会像以前一样逐个 Pod 调度。

<!--
If you set `schedulingGroup` on the Pod template yourself (for example,
because a higher-level controller is managing the workload), the Job controller leaves
the Pod template alone and does not create its own Workload or PodGroup. This makes the feature
safe to enable in clusters that already use an external batch system.
-->
如果你自行在 Pod 模板上设置 `schedulingGroup`
（例如因为有更高层的控制器正在管理该工作负载），
Job 控制器会保持 Pod 模板不变，
并且不会创建自己的 Workload 或 PodGroup。
这使得该特性可以安全地在已经使用外部批处理系统的集群中启用。

<!--
Here is an example of a Job that qualifies for gang scheduling:
-->
下面是一个符合编组调度条件的 Job 示例：

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: training-job
  namespace: job-ns
spec:
  completionMode: Indexed
  parallelism: 4
  completions: 4
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: worker
        image: registry.example/trainer:latest
```

<!--
The Job controller creates a Workload and a PodGroup owned by this Job,
and every Pod it creates carries a `.spec.schedulingGroup` that points at the generated PodGroup.
The Pods are then scheduled together once all four can be placed at the same time using
the PodGroup scheduling cycle described earlier in this post.
-->
Job 控制器会创建归此 Job 所有的 Workload 和 PodGroup，
并且它创建的每个 Pod 都会携带指向所生成 PodGroup 的 `.spec.schedulingGroup`。
随后，一旦可以使用本文前面描述的 PodGroup 调度周期同时放置全部四个 Pod，
这些 Pod 就会一起调度。

<!--
### What's not covered yet
-->
### 尚未覆盖的内容

<!--
The current constraints limit this integration to static, indexed, fully-parallel Jobs.
Support for additional workload shapes, including elastic Jobs and other built-in controllers,
is tracked in [KEP-5547](https://kep.k8s.io/5547).
-->
当前约束将这一集成限制在静态、索引化、完全并行的 Job 上。
对其他工作负载形态的支持，包括弹性 Job 和其他内置控制器，
由 [KEP-5547](https://kep.k8s.io/5547) 跟踪。

<!--
In future Kubernetes releases, this integration will expand to support additional workload controllers,
and the current constraints for Jobs may be relaxed.
-->
在未来 Kubernetes 版本中，这一集成将扩展为支持更多工作负载控制器，
而当前针对 Job 的约束也可能放宽。

<!--
## What's next?
-->
## 后续计划

<!--
The journey for workload-aware scheduling doesn't stop here.
For v1.37, the community is actively working on:
-->
工作负载感知调度的旅程并不会止步于此。
面向 v1.37，社区正在积极推进：

<!--
* **Graduating Workload and PodGroup APIs to Beta:** Our primary goal is to mature the Workload and PodGroup APIs to the Beta stage,
  solidifying their foundational role in the Kubernetes ecosystem. As part of this graduation process, we also plan to introduce `minCount` mutability
  to unlock elastic jobs and allow dynamic workloads to scale efficiently.

* **Multi-level Workload hierarchies:** To support complex modern AI workloads like JobSet or Disaggregated Inference via LeaderWorkerSet (LWS),
  we are working on expanding the architecture to support multi-level hierarchies. We aim to introduce a new API
  that allows grouping multiple PodGroups into hierarchical structures, directly reflecting the organization of real-world workload controllers.

* **Graduating advanced scheduling features:** We are focused on driving the maturity of the broader workload-aware scheduling ecosystem.
  This includes bringing existing features, such as topology-aware scheduling and workload-aware preemption, to the Beta stage.

* **Unified controller integration API:** To streamline adoption, we’re working on a controller integration API.
  This will provide real-world workload controllers with a unified, standardized method for consuming workload-aware scheduling capabilities.
-->
* **将 Workload 和 PodGroup API 晋升到 Beta：** 我们的主要目标是让 Workload 和 PodGroup API 成熟到 Beta 阶段，
  巩固它们在 Kubernetes 生态系统中的基础地位。
  作为晋升过程的一部分，我们还计划引入 `minCount` 可变性，
  以解锁弹性 Job，并允许动态工作负载高效扩缩。

* **多级 Workload 层次结构：** 为了支持 JobSet 或通过 LeaderWorkerSet（LWS）实现的解聚推理等复杂现代 AI 工作负载，
  我们正在扩展架构以支持多级层次结构。
  我们计划引入一个新的 API，
  允许将多个 PodGroup 组织成层次结构，
  直接反映真实工作负载控制器的组织方式。

* **推进高级调度特性进阶：** 我们专注于推动更广泛的工作负载感知调度生态系统走向成熟。
  这包括将拓扑感知调度和工作负载感知抢占等现有特性推进到 Beta 阶段。

* **统一的控制器集成 API：** 为简化采用过程，我们正在开发控制器集成 API。
  这将为真实世界中的工作负载控制器提供一种统一、标准化的方法，
  用于消费工作负载感知调度能力。

<!--
The priority and implementation order of these focus areas are subject to change. Stay tuned for further updates.
-->
这些重点领域的优先级和实现顺序可能会发生变化。敬请关注后续更新。

<!--
## Getting started
-->
## 入门

<!--
All below workload-aware scheduling improvements are available as Alpha features in v1.36.
To try them out, you must configure the following:
-->
以下所有工作负载感知调度改进在 v1.36 中均作为 Alpha 特性提供。
要试用它们，你必须进行以下配置：

<!--
* Prerequisite: Workload and PodGroup API support: Enable the
  [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
  feature gate on both the `kube-apiserver` and `kube-scheduler`, and ensure the `scheduling.k8s.io/v1alpha2`
  {{< glossary_tooltip text="API group" term_id="api-group" >}} is enabled.
-->
* 前提条件：Workload 和 PodGroup API 支持：
  在 `kube-apiserver` 和 `kube-scheduler` 上启用
  [`GenericWorkload`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
  特性门控，并确保启用 `scheduling.k8s.io/v1alpha2`
  {{< glossary_tooltip text="API 组" term_id="api-group" >}}。

<!--
Once the prerequisite is met, you can enable specific features:
-->
满足前提条件后，你可以启用具体特性：

<!--
* Gang scheduling: Enable the
  [`GangScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling)
  feature gate on the `kube-scheduler`.
* Topology-aware scheduling: Enable the
  [`TopologyAwareWorkloadScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#TopologyAwareWorkloadScheduling)
  feature gate on the `kube-scheduler`.
* Workload-aware preemption: Enable the
  [`WorkloadAwarePreemption`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadAwarePreemption)
  feature gate on the `kube-scheduler` (requires `GangScheduling` to also be enabled).
* DRA ResourceClaim support for workloads: Enable the
  [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
  feature gate on the `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` and `kubelet`.
* Workload API integration with the Job controller: Enable the
  [`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/#EnableWorkloadWithJob)
  feature gate on the `kube-apiserver` and `kube-controller-manager`.
-->
* 编组调度：在 `kube-scheduler` 上启用
  [`GangScheduling`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling)
  特性门控。
* 拓扑感知调度：在 `kube-scheduler` 上启用
  [`TopologyAwareWorkloadScheduling`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#TopologyAwareWorkloadScheduling)
  特性门控。
* 工作负载感知抢占：在 `kube-scheduler` 上启用
  [`WorkloadAwarePreemption`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#WorkloadAwarePreemption)
  特性门控（还需要启用 `GangScheduling`）。
* 工作负载的 DRA ResourceClaim 支持：在 `kube-apiserver`、`kube-controller-manager`、`kube-scheduler` 和 `kubelet`
  上启用
  [`DRAWorkloadResourceClaims`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
  特性门控。
* Job 控制器的 Workload API 集成：在 `kube-apiserver` 和 `kube-controller-manager` 上启用
  [`WorkloadWithJob`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#EnableWorkloadWithJob)
  特性门控。

<!--
We encourage you to try out workload-aware scheduling in your test clusters
and share your experiences to help shape the future of Kubernetes scheduling.
You can send your feedback by:
-->
我们鼓励你在测试集群中试用工作负载感知调度，
并分享你的经验，以帮助塑造 Kubernetes 调度的未来。
你可以通过以下方式发送反馈：

<!--
* Reaching out via [Slack (#workload-aware-scheduling)](https://kubernetes.slack.com/archives/C0AHLJ0EAEL).
* Joining the [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/#meetings) meetings.
* Filing a new [issue](https://github.com/kubernetes/kubernetes/issues) in the Kubernetes repository.
-->
* 通过 [Slack（#workload-aware-scheduling）](https://kubernetes.slack.com/archives/C0AHLJ0EAEL)联系我们。
* 参加 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/#meetings) 会议。
* 在 Kubernetes 仓库中提交新的 [issue](https://github.com/kubernetes/kubernetes/issues)。

<!--
## Learn more
-->
## 了解更多

<!--
To dive deeper into the architecture and design of these features, read the KEPs:
-->
要深入了解这些特性的架构和设计，请阅读以下 KEP：

<!--
* [Workload API and gang scheduling](https://kep.k8s.io/4671)
* [Topology-aware scheduling](https://kep.k8s.io/5732)
* [Workload-aware preemption](https://kep.k8s.io/5710)
* [DRA ResourceClaim support for workloads](https://kep.k8s.io/5729)
* [Workload API support in Job controller](https://kep.k8s.io/5547)
-->
* [Workload API 和编组调度](https://kep.k8s.io/4671)
* [拓扑感知调度](https://kep.k8s.io/5732)
* [工作负载感知抢占](https://kep.k8s.io/5710)
* [工作负载的 DRA ResourceClaim 支持](https://kep.k8s.io/5729)
* [Job 控制器中的 Workload API 支持](https://kep.k8s.io/5547)
