---
layout: blog
title: "Kubernetes v1.37：工作负载感知调度继续演进"
draft: true
slug: kubernetes-v1-37-advancing-workload-aware-scheduling
author: >
  Antoni Zawodny (Google),
  Bartosz Rejman (Google),
  Heba Elayoty (Microsoft),
  Jon Huhn (Microsoft),
  Maciej Skoczeń (Google),
  Maciej Wyrzuc (Google),
  Matt Matejczyk (Google)
translator: >
  [Paco Xu](https://github.com/pacoxu) (DaoCloud)
---

<!--
layout: blog
title: "Kubernetes v1.37: Advancing Workload-Aware Scheduling"
draft: true
slug: kubernetes-v1-37-advancing-workload-aware-scheduling
author: >
  Antoni Zawodny (Google),
  Bartosz Rejman (Google),
  Heba Elayoty (Microsoft),
  Jon Huhn (Microsoft),
  Maciej Skoczeń (Google),
  Maciej Wyrzuc (Google),
  Matt Matejczyk (Google)
-->

<!--
AI/ML and complex batch workloads continue to push the boundaries of Kubernetes scheduling. Following the foundational workload-centric enhancements introduced in previous releases, Kubernetes v1.37 delivers the next major milestone in the Workload-Aware Scheduling (WAS) journey. In this release, the core Workload and PodGroup APIs—enabling gang scheduling—along with Workload-Aware Preemption (WAP) and shared DRA ResourceClaims for PodGroups, all graduate to Beta, solidifying their role in the Kubernetes ecosystem.
-->
AI/ML 和复杂批处理工作负载不断推动 Kubernetes 调度能力的边界。
继先前版本引入以工作负载为中心的基础增强之后，
Kubernetes v1.37 为工作负载感知调度（Workload-Aware Scheduling，WAS）的演进带来了下一个重要里程碑。
在此版本中，支持编组调度的核心 Workload 和 PodGroup API、
工作负载感知抢占（Workload-Aware Preemption，WAP），
以及面向 PodGroup 的共享动态资源分配（Dynamic Resource Allocation，DRA） 的 ResourceClaim 均进阶到 Beta，
进一步巩固了它们在 Kubernetes 生态系统中的作用。

<!--
To address the hierarchical scheduling requirements of modern high-performance distributed workloads, v1.37 introduces the new [CompositePodGroup](/docs/concepts/workloads/compositepodgroup-api/) API.
This new API allows expressing multi-level topology constraints, gang scheduling, and preemption policies for complex, heterogeneous groups of Pods. Crucially, this architectural expansion unlocks native scheduling support for advanced workload structures commonly managed by higher-order extension APIs such as JobSet and LeaderWorkerSet (LWS).
-->
为满足现代高性能分布式工作负载的分层调度需求，
v1.37 引入了新的 [CompositePodGroup](/docs/concepts/workloads/compositepodgroup-api/) API。
这一新 API 可以为复杂的异构 Pod 组表达多级拓扑约束、编组调度和抢占策略。
更重要的是，这项架构扩展为通常由 JobSet 和 LeaderWorkerSet（LWS）等高阶扩展 API
管理的高级工作负载结构提供了原生调度支持。

<!--
Alongside these API additions, v1.37 focuses on streamlining adoption by introducing a new set of _controller integration APIs_ and the `workloadbuilder` Go library. These provide standardized building blocks that significantly simplify how out-of-tree controllers can integrate with WAS capabilities.
Utilizing these new tools, the native Job controller integration has been upgraded to fully consume the expanded WAS APIs—enabling advanced scheduling policies, flexible disruption modes, and topology-aware scheduling for standard batch workloads.
-->
除新增这些 API 外，v1.37 还引入了一组新的__控制器集成 API__ 和 `workloadbuilder` Go 库，
以降低这些特性的采用门槛。这些组件提供标准化构建块，
显著降低了树外控制器集成 WAS 能力的复杂度。
借助这些新工具，原生 Job 控制器的集成也已升级，能够充分利用扩展后的 WAS API，
从而为标准批处理工作负载启用高级调度策略、灵活的干扰模式和拓扑感知调度。

<!--
## Gang scheduling and Workload / PodGroup APIs
-->
## 编组调度以及 Workload/PodGroup API

<!--
Kubernetes v1.37 delivers a major milestone: [Workload](/docs/concepts/workloads/workload-api/) / [PodGroup](/docs/concepts/workloads/podgroup-api/) APIs and _gang scheduling_
are officially graduating to Beta. This graduation signals that native, "all-or-nothing"
scheduling for workloads is solidifying for wider adoption.
-->
Kubernetes v1.37 带来了一个重要里程碑：
[Workload](/zh-cn/docs/concepts/workloads/workload-api/) /
[PodGroup](/zh-cn/docs/concepts/workloads/podgroup-api/) API 和__编组调度__正式进阶到 Beta。
这次进阶意味着，面向工作负载的原生“全有或全无”调度正在逐步稳定，
可以得到更广泛的采用。

<!--
Key updates to the API and gang scheduling algorithm in this release include:
-->
此版本中 API 和编组调度算法的主要更新包括：

<!--
### Beta graduation and API versioning changes
-->
### 进阶到 Beta 以及 API 版本变更

<!--
The core Workload and PodGroup APIs have been promoted to v1beta1, meaning they are now one step away from
General Availability (GA). For early adopters who have been testing these features,
take note of the alpha versioning transition: v1alpha2 has been entirely replaced by v1alpha3.
This transition introduces breaking changes designed to clean up the API structure around `disruptionMode`.
-->
核心 Workload 和 PodGroup API 已进阶到 v1beta1，
这意味着它们距离正式可用（GA）仅有一步之遥。
一直在测试这些特性的早期采用者请注意 Alpha 版本的转换：
v1alpha2 已被 v1alpha3 完全取代。
此次转换引入了破坏性变更，旨在简化并理顺 `disruptionMode` 相关的 API 结构。

<!--
### Native PodGroup queueing
-->
### 原生 PodGroup 入队

<!--
A significant under-the-hood improvement in v1.37 makes the PodGroup a first-class citizen in the scheduling queue.
Previously, even if belonging to a PodGroup, all member Pods were queued individually. Now, only the top-level PodGroup
object is queued. This ensures all Pods share the same queueing behavior and lays the groundwork
for more advanced PodGroup queueing strategies in the future.
-->
v1.37 在底层实现了一项重要改进，使 PodGroup 成为调度队列中的一等对象。
以前，即使 Pod 属于某个 PodGroup，所有成员 Pod 仍会分别入队。
现在，只有顶层 PodGroup 对象会入队。
这确保所有 Pod 共享相同的入队行为，并为未来更高级的 PodGroup 入队策略奠定基础。

<!--
### Dynamic elasticity with minCount mutability
-->
### 通过可变的 minCount 实现动态弹性

<!--
In earlier iterations, the `minCount` field, which dictates the minimum number of Pods required
to successfully schedule a PodGroup, was strictly immutable. In v1.37, `minCount` is now mutable.
This API change unlocks flexibility for elastic workloads. Controllers can now dynamically
adjust the minimum required size of a gang on the fly, allowing workloads to gracefully degrade
or expand without interrupting already-scheduled Pods.
-->
在早期版本中，`minCount` 字段用于指定成功调度 PodGroup 所需的最少 Pod 数量，
并且严格不可变。在 v1.37 中，`minCount` 现在可以修改。
这一 API 变更为弹性工作负载带来了更大灵活性。
控制器现在可以动态调整编组所需的最小规模，
使工作负载能够平滑降级或扩展，而不会中断已经调度的 Pod。

<!--
## Workload-aware preemption
-->
## 工作负载感知抢占

<!--
In Kubernetes v1.37 the separate
`WorkloadAwarePreemption` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
for _workload-aware preemption_ was merged into the `GenericWorkload` feature gate,
becoming a core part of the gang scheduling effort.
-->
在 Kubernetes v1.37 中，用于__工作负载感知抢占__的独立
`WorkloadAwarePreemption`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
已合并到 `GenericWorkload` 特性门控中，
成为编组调度工作中的核心组成部分。

<!--
While the core concepts of workload-aware preemption stay the same, there are some
differences between the v1.36 and v1.37 releases:
-->
虽然工作负载感知抢占的核心概念保持不变，
但 v1.36 和 v1.37 版本之间仍存在一些差异：

<!--
### Performance and optimality
-->
### 性能和最优性

<!--
To check whether a preemptor can fit in the cluster thanks to preemption, the scheduler
simulates the removal of all potential victims and re-runs the scheduling algorithm. After
that it tries to reprieve as many victims as possible. In the v1.36 release, the scheduling
algorithm was run for each victim reprieval, verifying whether with the victim reprieved, the algorithm
can still find a valid placement for the preemptor. In v1.37, the scheduling algorithm is run only once
and the preemptor Pods are assumed based on its output. Later, the reprieval checks
whether a victim can still run in its place with the preemptor assumed.
-->
为了判断集群能否通过抢占为抢占者腾出空间，
调度器会模拟移除所有潜在被抢占者并重新运行调度算法，
随后尝试使尽可能多的被抢占者免于抢占。
在 v1.36 中，每尝试豁免一个被抢占者，调度器都会重新运行一次调度算法，
以确认保留该对象后仍能为抢占者找到有效的放置方案。
在 v1.37 中，调度算法只运行一次，并根据其输出假定（Assume）抢占者 Pod 的放置位置。
后续的豁免检查只需判断，在抢占者 Pod 已被假定放置的情况下，
被抢占者能否继续留在原位置运行。

<!--
### PodGroup as a victim
-->
### 作为被抢占者的 PodGroup

<!--
One of the limitations of v1.36 was the fact that the default preemption for single Pods
was not aware of PodGroups and was not respecting their `disruptionMode` fields, allowing
for disruption of single Pods even when the PodGroup had `disruptionMode: {all: {}}` set.
Kubernetes v1.37 removes this limitation; the default preemption now respects the PodGroup
`disruptionMode` field.
-->
v1.36 的一个局限是，单个 Pod 的默认抢占无法感知 PodGroup，
也不会遵从其 `disruptionMode` 字段；
即使 PodGroup 设置了 `disruptionMode: {all: {}}`，单个 Pod 仍可能被干扰。
Kubernetes v1.37 消除了这一限制：
默认抢占现在会遵从 PodGroup 的 `disruptionMode` 字段。

<!--
### Rename of the `disruptionMode` fields
-->
### 重命名 `disruptionMode` 字段

<!--
During the promotion of the API to Beta, the `disruptionMode` field was changed to decouple
its naming from the PodGroup object, allowing consistent naming across PodGroups and CompositePodGroups.
The modes changed as follows: `PodGroup` became `all`, and `Pod` became `single`.
-->
在 API 进阶到 Beta 的过程中，`disruptionMode` 字段发生了变更，
使其命名不再与 PodGroup 对象耦合，
从而可以在 PodGroup 和 CompositePodGroup 中使用一致的名称。
模式名称变更如下：`PodGroup` 改为 `all`，`Pod` 改为 `single`。

<!--
### Support for `preemptionPolicy`
-->
### 支持 `preemptionPolicy`

<!--
In v1.36, the PodGroup does not have a `preemptionPolicy` field. The PodGroup can perform
preemption as long as none of the Pods forming it has `preemptionPolicy: Never` set. In v1.37,
when the [`PodGroupPreemptionPolicy`](/docs/reference/command-line-tools-reference/feature-gates/#PodGroupPreemptionPolicy)
feature gate is enabled, a PodGroup also has a `preemptionPolicy` field. It serves as an authoritative field for whether
a PodGroup can perform preemption.
-->
在 v1.36 中，PodGroup 没有 `preemptionPolicy` 字段。
只要组成 PodGroup 的所有 Pod 都没有设置 `preemptionPolicy: Never`，
PodGroup 就可以执行抢占。
在 v1.37 中，启用
[`PodGroupPreemptionPolicy`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#PodGroupPreemptionPolicy)
特性门控后，PodGroup 也会具有 `preemptionPolicy` 字段。
该字段是决定 PodGroup 能否执行抢占的权威字段。

<!--
## CompositePodGroup API
-->
## CompositePodGroup API

<!--
In Kubernetes v1.36, workload-aware scheduling established a clean separation between static workload templates (Workload) and runtime group state (PodGroup), but the supported scheduling policies were limited to a single, flat group. The CompositePodGroup API, introduced in Kubernetes v1.37, extends this model to support hierarchical scheduling requirements.
-->
在 Kubernetes v1.36 中，工作负载感知调度在静态工作负载模板（Workload）
和运行时组状态（PodGroup）之间建立了清晰的分离，
但所支持的调度策略仅限于单个扁平组。
Kubernetes v1.37 引入的 CompositePodGroup API 扩展了这一模型，
以支持分层调度需求。

<!--
This API allows its consumers to express multi-level scheduling requirements by organizing a workload in a tree-shaped hierarchy consisting of CompositePodGroup and PodGroup objects. Each CompositePodGroup carries policies and constraints that apply to other groups (CompositePodGroups and/or PodGroups), similar to how PodGroups govern scheduling behavior for a flat group of Pods. The scheduler treats such a hierarchy as a single scheduling unit and aims to satisfy the requirements specified by every group within that hierarchy.
-->
此 API 允许使用者将工作负载组织为由 CompositePodGroup 和 PodGroup 对象组成的树形层次结构，
从而表达多级调度需求。
每个 CompositePodGroup 都携带适用于其他组（CompositePodGroup 和/或 PodGroup）的策略与约束，
这类似于 PodGroup 管理扁平 Pod 组调度行为的方式。
调度器会将这样的层次结构视为单个调度单元，
并力求满足该层次结构中每个组所指定的要求。

<!--
### Defining a workload hierarchy
-->
### 定义工作负载层次结构

<!--
To express multi-level scheduling requirements, you define a hierarchy of templates in a Workload object. Controllers then create the corresponding CompositePodGroup and PodGroup objects from that hierarchy.
-->
要表达多级调度需求，你需要在 Workload 对象中定义模板层次结构。
然后，控制器根据该层次结构创建对应的 CompositePodGroup 和 PodGroup 对象。

<!--
To support this, the Workload API is extended with the `spec.compositePodGroupTemplates` field. Each CompositePodGroupTemplate defines a template for a parent CompositePodGroup and directly nests the templates (`podGroupTemplates` and/or `compositePodGroupTemplates`) from which its child groups derive.
-->
为此，Workload API 新增了 `spec.compositePodGroupTemplates` 字段。
每个 CompositePodGroupTemplate 都为父 CompositePodGroup 定义一个模板，
并直接嵌套用于派生其子组的模板
（`podGroupTemplates` 和/或 `compositePodGroupTemplates`）。

<!--
Below is a sample Workload object that defines a two-level template hierarchy:
-->
下面的 Workload 对象示例定义了一个两级模板层次结构：

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: Workload
metadata:
  name: example-workload
  annotations:
    kubernetes.io/description: "要求 4 个 Worker Pod 和 1 个 Driver Pod 一起调度的两级工作负载层次结构。"
spec:
  compositePodGroupTemplates:
    - name: workload-root
      schedulingPolicy:
        gang:
          minGroupCount: 2
      podGroupTemplates:
        - name: workers
          schedulingPolicy:
            gang:
              minCount: 4
        - name: driver
          schedulingPolicy:
            gang:
              minCount: 1
```

<!--
After creating `example-workload`, a controller can stamp out the corresponding runtime group objects from these templates:
-->
创建 `example-workload` 后，控制器可以根据这些模板生成对应的运行时组对象：

<!--
1. A root CompositePodGroup that references the `workload-root` template in `example-workload` and carries its group-level scheduling policy (gang scheduling with `minGroupCount: 2`):
-->
1. 一个根 CompositePodGroup，它引用 `example-workload` 中的 `workload-root` 模板，
   并携带其组级调度策略（设置了 `minGroupCount: 2` 的编组调度）：

   ```yaml
   apiVersion: scheduling.k8s.io/v1alpha3
   kind: CompositePodGroup
   metadata:
     name: example-root-group
     annotations:
       kubernetes.io/description: "协调工作器和驱动 PodGroup 子组进行编组调度的根组。"
   spec:
     workloadRef:
       workloadName: example-workload
       templateName: workload-root
     schedulingPolicy:
       gang:
         minGroupCount: 2
   ```

<!--
2. Two child PodGroup objects (`example-workload-workers` and `example-workload-driver`) that reference their respective leaf templates in `example-workload` and link to the root group via `parentCompositePodGroupName`:
-->
2. 两个 PodGroup 子对象（`example-workload-workers` 和 `example-workload-driver`），
   它们分别引用 `example-workload` 中对应的叶级模板，
   并通过 `parentCompositePodGroupName` 链接到根组：

   ```yaml
   apiVersion: scheduling.k8s.io/v1beta1
   kind: PodGroup
   metadata:
     name: example-workload-workers
     annotations:
       kubernetes.io/description: "要求至少 4 个 Pod 一起调度的工作器组。"
   spec:
     parentCompositePodGroupName: example-root-group
     workloadRef:
       workloadName: example-workload
       templateName: workers
     schedulingPolicy:
       gang:
         minCount: 4
   ---
   apiVersion: scheduling.k8s.io/v1beta1
   kind: PodGroup
   metadata:
     name: example-workload-driver
     annotations:
       kubernetes.io/description: "要求 1 个 Pod 与工作器一起调度的驱动组。"
   spec:
     parentCompositePodGroupName: example-root-group
     workloadRef:
       workloadName: example-workload
       templateName: driver
     schedulingPolicy:
       gang:
         minCount: 1
   ```

<!--
### How multi-level gang scheduling works
-->
### 多级编组调度的工作原理

<!--
To schedule a hierarchical workload, `kube-scheduler` evaluates the entire group tree as a unified scheduling unit:

* **Recursive evaluation**: The scheduler traverses the hierarchy from the root CompositePodGroup down to the leaf PodGroup objects. At each level, a parent CompositePodGroup is considered schedulable only when its child groups satisfy its scheduling policy (for example, placing at least `minGroupCount` of child groups when using the gang policy), while each leaf PodGroup must satisfy its own Pod-level policy (for example, placing at least `minCount` of member Pods when using the gang policy).
* **All-or-nothing scheduling**: Once a valid combination of child groups is found that satisfies the requirements of the root CompositePodGroup, the Pods across the entire hierarchy are scheduled and bound atomically. If the root group cannot satisfy its policy constraints, the entire hierarchy remains unschedulable and no Pods are bound, preventing partial deployments and deadlocks.
-->
为了调度分层工作负载，`kube-scheduler` 会将整个组树作为统一的调度单元进行评估：

* __递归评估__：调度器从根 CompositePodGroup 开始向下遍历层次结构，
  直至叶级 PodGroup 对象。
  在每一层，只有其子组满足调度策略时，父 CompositePodGroup 才会被视为可调度
  （例如，使用编组策略时至少放置 `minGroupCount` 个子组）；
  同时，每个叶级 PodGroup 必须满足自己的 Pod 级策略
  （例如，使用编组策略时至少放置 `minCount` 个成员 Pod）。
* __全有或全无调度__：一旦找到满足根 CompositePodGroup 要求的有效子组组合，
  整个层次结构中的 Pod 就会以原子方式完成调度和绑定。
  如果根组无法满足策略约束，整个层次结构会保持不可调度状态，且不会绑定任何 Pod，
  从而避免部分调度上线和死锁问题。

<!--
### Workload-aware preemption for the CompositePodGroup API
-->
### CompositePodGroup API 的工作负载感知抢占

<!--
Kubernetes v1.37 extends workload-aware preemption to support CompositePodGroup hierarchies as well. Specifically, if a CompositePodGroup cannot be scheduled due to insufficient capacity in the cluster, the scheduler can invoke preemption to evict lower-priority workloads in order to fit the Pods belonging to that CompositePodGroup.
-->
Kubernetes v1.37 扩展了工作负载感知抢占，使其也支持 CompositePodGroup 层次结构。
具体而言，如果 CompositePodGroup 因集群容量不足而无法调度，
调度器可以调用抢占机制来驱逐优先级较低的工作负载，
从而容纳属于该 CompositePodGroup 的 Pod。

<!--
A CompositePodGroup can be selected for preemption as well. To specify the desired behavior during preemption, workload owners can specify an appropriate `disruptionMode` in the CompositePodGroup spec:

* **`single`**: Allows individual child groups within the CompositePodGroup to be preempted and disrupted independently. This is the behavior when `disruptionMode` is not set.
* **`all`**: Enforces "all-or-nothing" disruption semantics across the entire CompositePodGroup hierarchy. If any Pod within the descendant subtree must be preempted, the scheduler evicts all Pods across the entire hierarchy together.
-->
CompositePodGroup 本身也可以被选为抢占对象。
为了指定抢占期间的预期行为，工作负载所有者可以在 CompositePodGroup 规约中设置适当的
`disruptionMode`：

* __`single`__：允许 CompositePodGroup 中的各个子组被独立抢占和干扰。
  未设置 `disruptionMode` 时采用此行为。
* __`all`__：在整个 CompositePodGroup 层次结构中强制执行“全有或全无”的干扰语义。
  如果后代子树中的任何 Pod 必须被抢占，调度器会一起驱逐整个层次结构中的所有 Pod。

<!--
## Topology-aware scheduling
-->
## 拓扑感知调度

<!--
In Kubernetes v1.37, topology-aware scheduling expands to support complex, multi-level workload hierarchies and delivers performance improvements for existing single-level deployments.
-->
在 Kubernetes v1.37 中，拓扑感知调度扩展为支持复杂的多级工作负载层次结构，
同时提升了现有单级部署的性能。

<!--
### Multi-level topology-aware scheduling
-->
### 多级拓扑感知调度

<!--
In Kubernetes v1.36, we introduced foundational topology-aware scheduling, allowing you to define co-location constraints directly on a PodGroup. While effective for single-level groupings, complex distributed workloads—such as large-scale AI/ML training, JobSet deployments, or disaggregated inference via LeaderWorkerSet (LWS)—often require co-location across multiple levels of cluster infrastructure simultaneously.
-->
在 Kubernetes v1.36 中，我们引入了基础性的拓扑感知调度，
允许你直接在 PodGroup 上定义共置约束。
这种方式对单级分组非常有效，但复杂的分布式工作负载
（例如大规模 AI/ML 训练、JobSet 部署，
或通过 LeaderWorkerSet（LWS）实现的解聚推理）
通常需要同时在集群基础设施的多个层级上实现共置。

<!--
For example, an entire workload may need to run within a single availability zone, while different parts of that workload (such as specific worker groups or driver processes) require strict co-location within specific server racks.
-->
例如，整个工作负载可能需要在单个可用区内运行，
而工作负载的不同部分（例如特定工作器组或驱动进程）
则要求严格共置在特定服务器机架内。

<!--
In Kubernetes v1.37, alongside the new CompositePodGroup API (`scheduling.k8s.io/v1alpha3`), topology-aware scheduling expands to support *multi-level topology-aware scheduling*. You can now express complex co-location requirements by specifying topology constraints at different levels of a group hierarchy.
-->
在 Kubernetes v1.37 中，伴随着新的 CompositePodGroup API（scheduling.k8s.io/v1alpha3），
拓扑感知调度也扩展为支持__多级拓扑感知调度__。
现在，你可以在组层次结构的不同层级上指定拓扑约束，
从而表达复杂的共置要求。

<!--
### Top-down topology constraint resolution
-->
### 自顶向下解析拓扑约束

<!--
During hierarchical scheduling, the `kube-scheduler` resolves multi-level topology constraints in a **top-down** manner. Specifically, topology domains that are considered during the scheduling of a child group are confined within a topology domain that corresponds to the placement assumed by the parent group.
-->
在分层调度期间，`kube-scheduler` 以__自顶向下__的方式解析多级拓扑约束。
具体而言，调度子组时所考虑的拓扑域，
会被限制在与父组假定放置位置相对应的拓扑域之内。

<!--
### Configuration and runtime execution
-->
### 配置和运行时执行

<!--
Using the updated Workload API (`scheduling.k8s.io/v1beta1`), you can configure multi-level topology constraints directly within `compositePodGroupTemplates`. In the example below, the parent template constrains the overall workload to a single availability zone (`topology.kubernetes.io/zone`), while child templates for `workers` and `driver` constrain their respective Pods to server racks (`topology.example.com/rack`) within that selected zone:
-->
借助更新后的 Workload API（`scheduling.k8s.io/v1beta1`），
你可以直接在 `compositePodGroupTemplates` 中配置多级拓扑约束。
在以下示例中，父模板将整个工作负载限制在单个可用区
（`topology.kubernetes.io/zone`）内，
而 `workers` 和 `driver` 子模板则将各自的 Pod 限制在所选可用区内的服务器机架
（`topology.example.com/rack`）中：

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: Workload
metadata:
  name: multi-level-tas-workload
  namespace: job-ns
  annotations:
    kubernetes.io/description: "为根组定义可用区级共置，并为子组定义机架级共置的工作负载。"
spec:
  compositePodGroupTemplates:
  - name: root
    schedulingPolicy:
      gang:
        minGroupCount: 2
    schedulingConstraints:
      topology:
      - key: topology.kubernetes.io/zone
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
When a controller creates an instance of this workload at runtime, it spawns the corresponding runtime objects from these templates:

1. The root CompositePodGroup referencing the `root` template, carrying the availability zone topology constraint and the hierarchical gang scheduling policy.
2. The two child PodGroup objects (`tas-workload-workers` and `tas-workload-driver`), each referencing the root CompositePodGroup as their parent group via the `parentCompositePodGroupName` spec field:
-->
当控制器在运行时创建此工作负载的实例时，
它会根据这些模板生成相应的运行时对象：

1. 引用 `root` 模板的根 CompositePodGroup，
   携带可用区拓扑约束和分层编组调度策略。
2. 两个 PodGroup 子对象（`tas-workload-workers` 和 `tas-workload-driver`），
   各自通过规约中的 `parentCompositePodGroupName` 字段，
   将根 CompositePodGroup 引用为父组：

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: CompositePodGroup
metadata:
  name: tas-workload-root
  namespace: job-ns
  annotations:
    kubernetes.io/description: "将整个工作负载限制在单个可用区内的根组。"
spec:
  workloadRef:
    workloadName: multi-level-tas-workload
    templateName: root
  schedulingPolicy:
    gang:
      minGroupCount: 2
  schedulingConstraints:
    topology:
    - key: topology.kubernetes.io/zone
---
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: tas-workload-workers
  namespace: job-ns
  annotations:
    kubernetes.io/description: "要求将 8 个 Pod 共置在所选可用区的单个机架内的工作器组。"
spec:
  parentCompositePodGroupName: tas-workload-root
  workloadRef:
    workloadName: multi-level-tas-workload
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
  name: tas-workload-driver
  namespace: job-ns
  annotations:
    kubernetes.io/description: "要求将 1 个 Pod 放置在所选可用区内某个机架中的驱动组。"
spec:
  parentCompositePodGroupName: tas-workload-root
  workloadRef:
    workloadName: multi-level-tas-workload
    templateName: driver
  schedulingPolicy:
    gang:
      minCount: 1
  schedulingConstraints:
    topology:
    - key: topology.example.com/rack
```

<!--
During scheduling, the scheduler evaluates multiple candidate availability zones across the cluster for `tas-workload-root`. For each candidate zone, it subdivides the nodes by rack topology to explore feasible rack placements for `tas-workload-workers` and `tas-workload-driver` strictly within that zone, systematically evaluating multiple combinations across available zones and racks before making a scheduling decision.
-->
在调度期间，调度器会为 `tas-workload-root` 评估集群中的多个候选可用区。
对于每个候选可用区，调度器按照机架拓扑对节点进行分组，
以探索在该可用区内严格放置 `tas-workload-workers` 和 `tas-workload-driver`
的可行机架方案；在作出调度决策之前，
调度器会系统地评估可用区和机架间的多种组合。

<!--
By allowing topology constraints to be modeled hierarchically, Kubernetes v1.37 provides a structured way to express multi-level co-location requirements across complex cluster infrastructures.
-->
通过允许以分层方式对拓扑约束建模，
Kubernetes v1.37 提供了一种结构化方法，
用于表达复杂集群基础设施中的多级共置要求。

<!--
### Performance improvements for single-level TAS
-->
### 单级拓扑感知调度（TAS）的性能改进

<!--
Alongside the Alpha introduction of multi-level hierarchies, Kubernetes v1.37 reduces the cost of placement evaluation for existing single-level topology-aware scheduling. We are continuously working to optimize the efficiency of placement evaluation algorithms in `kube-scheduler` and plan to deliver further performance improvements in future releases.
-->
除了以 Alpha 形式引入多级层次结构外，
Kubernetes v1.37 还降低了现有单级拓扑感知调度的放置评估开销。
我们正在持续优化 `kube-scheduler` 中放置评估算法的效率，
并计划在未来版本中进一步提升性能。

<!--
## Controller Integration APIs
-->
## 控制器集成 API

<!--
Kubernetes v1.37 introduces new standard building blocks so that every controller can expose the same scheduling primitives in their own APIs, and share the same logic for translating them into scheduling objects.
These primitives express specific scheduling behaviors — such as policies or disruption logic — while
leaving the field naming flexible for each controller. A prime example of this is the native Job
controller, which we detail in the next section.
-->
Kubernetes v1.37 引入了新的标准构建块，
让每个控制器都能在自己的 API 中公开相同的调度原语，
并共享将这些原语转换为调度对象的同一套逻辑。
这些原语表达特定的调度行为（例如策略或干扰逻辑），
同时允许各个控制器灵活地命名字段。
原生 Job 控制器就是一个典型示例，下一节将对其进行详细介绍。

<!--
Types prefixed with `WorkloadPodGroup` describe a leaf group of Pods; types prefixed with
`WorkloadCompositePodGroup` describe a group of groups. A controller embeds them verbatim into
its own API, under whatever field name fits its domain:

* `WorkloadPodGroupSchedulingPolicy` — either `basic`, meaning standard Pod-by-Pod scheduling, or `gang` with a `minCount`. The composite variant takes a `minGroupCount` instead.
* `WorkloadPodGroupSchedulingConstraints` — the topology constraints (`topology[].key`) the group's Pods must be co-located within.
* `WorkloadPodGroupDisruptionMode` — `single` or `all`, with the preemption semantics described earlier in this post.
* `WorkloadPodGroupResourceClaim` — the ResourceClaims shared across the group.
-->
以 `WorkloadPodGroup` 为前缀的类型描述叶级 Pod 组；
以 `WorkloadCompositePodGroup` 为前缀的类型描述由多个组组成的组。
控制器将这些类型原样嵌入自己的 API 中，
并可以使用适合其领域的任意字段名称：

* `WorkloadPodGroupSchedulingPolicy`：可以是表示标准逐 Pod 调度的 `basic`，
  也可以是带 `minCount` 的 `gang`；对应的 CompositePodGroup 类型则使用 `minGroupCount`。
* `WorkloadPodGroupSchedulingConstraints`：用于限定组内 Pod 共置范围的拓扑约束
  （`topology[].key`）。
* `WorkloadPodGroupDisruptionMode`：取值为 `single` 或 `all`，
  其抢占语义如本文前面所述。
* `WorkloadPodGroupResourceClaim`：整个组共享的 ResourceClaim。

<!--
Only the shapes are shared, so controllers retain full autonomy over how they name and nest these fields in their own APIs.
-->
共享的只是这些结构，因此控制器仍能完全自主决定
如何在自己的 API 中命名和嵌套这些字段。

<!--
**The `workloadbuilder` library** turns that intent into the scheduling objects. A controller describes its workload as a tree of `WorkloadItem` nodes — a node with children compiles to a `CompositePodGroupTemplate`, a node without children to a `PodGroupTemplate` — and attaches its own defaults plus the user-supplied building blocks to each node. From there, `Validate()` reports problems back at the exact field path within the controller's own API, `BuildWorkload()` compiles the tree into a Workload, and `NewPodGroup()` and `NewCompositePodGroup()` stamp out the runtime group objects.
-->
__`workloadbuilder` 库__会将这些意图转换为调度对象。
控制器将其工作负载描述为由 `WorkloadItem` 节点组成的树：
带子节点的节点会被编译为 `CompositePodGroupTemplate`，
没有子节点的节点会被编译为 `PodGroupTemplate`；
控制器还会为每个节点附加自己的默认值和用户提供的构建块。
随后，`Validate()` 会在控制器自身 API 中精确对应的字段路径上报告问题，
`BuildWorkload()` 将这棵树编译为 Workload，
而 `NewPodGroup()` 和 `NewCompositePodGroup()` 则生成运行时组对象。

<!--
Validation is deny-by-default: a controller declares the policies and disruption modes it actually supports through `AllowedPolicies` and `AllowedDisruptionModes`, and anything outside those lists is rejected. Building blocks added in future releases therefore stay unavailable until a controller explicitly opts into them.
-->
校验遵循默认拒绝原则：控制器通过 `AllowedPolicies` 和 `AllowedDisruptionModes`
声明其实际支持的策略和干扰模式，列表以外的任何值都会被拒绝。
因此，在控制器显式选择采用之前，未来版本新增的构建块都将保持不可用。

<!--
For hierarchical workloads where a parent controller owns the Workload and delegates group creation to its children, `NewBuilderFromExistingWorkload` lets a child materialize only its own PodGroup from the parent's Workload.
-->
对于由父控制器拥有 Workload、并将组创建工作委派给子控制器的分层工作负载，
`NewBuilderFromExistingWorkload` 允许子控制器仅从父控制器的 Workload
中实例化自己的 PodGroup。

<!--
Neither the building blocks nor the library have a feature gate of their own; they become user-visible through whichever controller adopts them. The native Job controller is the first to do so, and we detail it in the next section.
-->
这些构建块和库都没有自己的特性门控；
它们会通过采用它们的控制器呈现给用户。
原生 Job 控制器是第一个采用它们的控制器，下一节将详细介绍。

<!--
## Integration with the Job controller
-->
## 与 Job 控制器集成

<!--
Building upon the new _controller integration_ APIs, the Job API now features an explicit `.spec.scheduling` field, so you can declare how a Job should be scheduled instead of relying on the Job controller to infer it from the Job's shape. This expands support well beyond static, indexed, and fully-parallel Jobs.
-->
基于新的__控制器集成__ API，Job API 现在提供显式的 `.spec.scheduling` 字段，
因此你可以声明 Job 应如何调度，
而不必依赖 Job 控制器根据 Job 的结构来推断调度方式。
这使支持范围远远超出了静态 Job、带索引的 Job 和完全并行的 Job。

<!--
`.spec.scheduling` is composed of the building blocks described above:

* `schedulingPolicy` — `basic` for standard Pod-by-Pod scheduling, or `gang` for all-or-nothing scheduling.
* `schedulingConstraints` — the topology domain the Job's Pods must be co-located within.
* `disruptionMode` — whether the Job's Pods can be preempted individually (`single`) or only as a whole (`all`).
* `resourceClaims` — the ResourceClaims shared by all of the Job's Pods.
-->
`.spec.scheduling` 由上述构建块组成：

* `schedulingPolicy`：`basic` 表示标准的逐 Pod 调度，
  `gang` 表示全有或全无调度。
* `schedulingConstraints`：Job 的 Pod 必须共置于其中的拓扑域。
* `disruptionMode`：Job 的 Pod 是可以逐个抢占（`single`），
  还是只能作为整体抢占（`all`）。
* `resourceClaims`：由 Job 的所有 Pod 共享的 ResourceClaim 列表。

<!--
For example:
-->
例如：

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: distributed-training-job
  annotations:
    kubernetes.io/description: "使用显式 WAS 调度、编组策略和可用区拓扑约束的分布式 Job。"
spec:
  parallelism: 8
  completions: 8
  scheduling:
    schedulingPolicy:
      gang: {}                # 省略 minCount → 默认取 parallelism (8)
    schedulingConstraints:
      topology:
      - key: topology.kubernetes.io/zone
    disruptionMode:
      all: {}
  template:
    spec:
      containers:
      ...
```

<!--
Omitting `.spec.scheduling`, or omitting `schedulingPolicy` within it, selects the `basic` policy, which behaves exactly like standard Job scheduling today.
-->
省略 `.spec.scheduling`，或省略其中的 `schedulingPolicy`，
将选择 `basic` 策略，其行为与当前的标准 Job 调度完全相同。

<!--
For every Job it manages, the controller compiles this configuration into a Workload and a PodGroup
owned by the Job, and sets `.spec.schedulingGroup.podGroupName` on each Pod it creates so the scheduler
treats them as one group. Once created, `.spec.scheduling` is immutable, with one exception:
`schedulingPolicy.gang.minCount` can be updated, which lets you resize a running gang.
-->
对于其管理的每个 Job，控制器都会将此配置编译为由该 Job 所拥有的
Workload 和 PodGroup，并在其创建的每个 Pod 上设置
`.spec.schedulingGroup.podGroupName`，使调度器将这些 Pod 视为一个组。
`.spec.scheduling` 创建后不可变，但有一个例外：
可以更新 `schedulingPolicy.gang.minCount`，
从而调整正在运行的编组规模。

<!--
## DRA ResourceClaim support for workloads
-->
## 面向工作负载的 DRA ResourceClaim 支持

<!--
As the core WAS APIs mature, so do their integrations with [Dynamic Resource Allocation](/docs/concepts/resource-management/dynamic-resource-allocation/)
(DRA). Kubernetes v1.36 introduced the [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
feature gate. The associated feature allows [ResourceClaims](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#resourceclaims-templates)
to be replicated and reserved for entire PodGroups and shared by all their
member Pods:
-->
随着核心 WAS API 逐渐成熟，它们与[动态资源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
（DRA）的集成也在走向成熟。
Kubernetes v1.36 引入了
[`DRAWorkloadResourceClaims`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
特性门控。相关特性允许复制
[ResourceClaim](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates)
并将其预留给整个 PodGroup，由组内所有成员 Pod 共享：

```yaml
apiVersion: scheduling.k8s.io/v1beta1
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
  name: topology-aware-workers-pg-pod
spec:
  ...
  schedulingGroup:
    podGroupName: training-job-workers-pg
  resourceClaims:
    - name: pg-claim
      resourceClaimTemplateName: my-claim-template
```

<!--
In Kubernetes v1.37, the `DRAWorkloadResourceClaims` feature gate graduated to Beta.
-->
在 Kubernetes v1.37 中，`DRAWorkloadResourceClaims` 特性门控已进阶到 Beta。

<!--
While the API and core functionality of the feature remain unchanged, one change
eliminates some potentially surprising behavior when disabling the feature.
Previously when one of a Pod's `spec.resourceClaims` referenced a
ResourceClaimTemplate and matched one of its PodGroup's `spec.resourceClaims`
and the `DRAWorkloadResourceClaims` feature gate was **disabled**, a ResourceClaim was created for the Pod instead
of the PodGroup. In that scenario in v1.37, no ResourceClaim is created at all.
This change prevents Kubernetes from creating a flood of ResourceClaims from a
ResourceClaimTemplate and potentially exhausting DRA resources when a
claim intended to be shared by a whole PodGroup is replicated for each and every
Pod in the group.
-->
虽然该特性的 API 和核心功能保持不变，
但有一项变更消除了禁用此特性时可能令人意外的行为。
以前，当 Pod 的 `spec.resourceClaims` 中某一项引用了 ResourceClaimTemplate，
并且与其 PodGroup 的某个 `spec.resourceClaims` 匹配，
同时 `DRAWorkloadResourceClaims` 特性门控处于__禁用__状态时，
系统会为 Pod 而非 PodGroup 创建 ResourceClaim。
在 v1.37 的同一场景中，系统完全不会创建 ResourceClaim。
这一变更可避免 Kubernetes 根据 ResourceClaimTemplate 大量创建 ResourceClaim：
如果原本应由整个 PodGroup 共享的申领被复制给组内的每一个 Pod，
就可能耗尽 DRA 资源。

<!--
For more information, see the [feature documentation](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api#workload-resource-claims).
-->
有关更多信息，请参阅[特性文档](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#workload-resourceclaims)。

<!--
## What's next?
-->
## 后续计划

<!--
The [Workload-Aware Scheduling Working Group](https://www.kubernetes.dev/community/community-groups/wg/workload-aware-scheduling/) (WG WAS) is currently finalizing its plans for the Kubernetes v1.38 release cycle. While the roadmap is still taking shape (stay tuned!), the following key initiatives are already planned:
-->
[工作负载感知调度工作组](https://www.kubernetes.dev/community/community-groups/wg/workload-aware-scheduling/)
（WG WAS）正在敲定 Kubernetes v1.38 发布周期的计划。
虽然路线图仍在逐步成形（敬请关注！），
但以下关键工作已在计划之中：

<!--
* **Graduation of Workload and PodGroup APIs to GA:** Solidifying the core foundation of workload-aware scheduling as a stable Kubernetes API.
* **Graduation of Topology-Aware Scheduling (TAS) and CompositePodGroup (CPG) to Beta:** Bringing these advanced placement and hierarchical scheduling features to Beta stability.
* **Graduation of controller integration building blocks to Beta:** Further refining the integration APIs to ensure a robust developer experience.
* **Increased adoption and integration:** Expanding the ecosystem by integrating workload-aware scheduling with other controllers, with a particular focus on hierarchical orchestrators such as [JobSet](https://github.com/kubernetes-sigs/jobset).
* **Kueue Integration:** Fostering closer alignment between WAS and [Kueue](https://kueue.sigs.k8s.io/). In the near term, we aim to ensure Kueue is fully aware of WAS features for seamless interoperability. In the long term, we envision Kueue leveraging WAS as its underlying engine for capabilities like gang-scheduling and topology-aware placement.
-->
* __Workload 和 PodGroup API 进阶到 GA：__
  将工作负载感知调度的核心基础巩固为稳定的 Kubernetes API。
* __拓扑感知调度（TAS）和 CompositePodGroup（CPG）进阶到 Beta：__
  让这些高级放置和分层调度特性达到 Beta 阶段。
* __控制器集成构建块进阶到 Beta：__
  进一步完善集成 API，确保可靠、完善的开发体验。
* __提高采用率并扩大集成范围：__
  通过将工作负载感知调度与其他控制器集成来扩展生态系统，
  尤其关注 [JobSet](https://github.com/kubernetes-sigs/jobset) 等分层编排器。
* __Kueue 集成：__
  推动 WAS 与 [Kueue](https://kueue.sigs.k8s.io/) 更紧密地协同。
  短期内，我们的目标是确保 Kueue 能够充分感知 WAS 特性，实现无缝互操作。
  长期来看，我们希望 Kueue 将 WAS 用作底层引擎，
  以实现编组调度和拓扑感知放置等能力。

<!--
## Getting started
-->
## 快速开始

<!--
Many of the workload-aware scheduling improvements are now available as Beta features in v1.37, while new advanced capabilities are introduced in Alpha. Both Beta and Alpha features here are disabled by default and require manual enablement.
-->
许多工作负载感知调度改进现在已在 v1.37 中以 Beta 特性的形式提供，
同时还有新的高级能力以 Alpha 特性的形式引入。
这里的 Beta 和 Alpha 特性均默认禁用，需要手动启用。

<!--
**Beta features:**
-->
__Beta 特性：__

<!--
* **Workload API, gang scheduling, and preemption:** The
  [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
  feature gate (which now integrates gang scheduling and workload-aware preemption) is Beta and disabled by default on the `kube-apiserver`, `kube-controller-manager` and `kube-scheduler`.
  Ensure your manifests are updated to use the `scheduling.k8s.io/v1beta1`
  {{< glossary_tooltip text="API group" term_id="api-group" >}}.
* **DRA ResourceClaim support for workloads:** Enable the
  [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
  feature gate on the `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` and `kubelet`.
-->
* __Workload API、编组调度和抢占：__
  [`GenericWorkload`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
  特性门控（现在集成了编组调度和工作负载感知抢占）处于 Beta 阶段，
  并且在 `kube-apiserver`、`kube-controller-manager` 和 `kube-scheduler` 上默认禁用。
  请确保清单已更新为使用 `scheduling.k8s.io/v1beta1`
  {{< glossary_tooltip text="API 组" term_id="api-group" >}}。
* __面向工作负载的 DRA ResourceClaim 支持：__
  在 `kube-apiserver`、`kube-controller-manager`、`kube-scheduler` 和 `kubelet` 上启用
  [`DRAWorkloadResourceClaims`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
  特性门控。

<!--
**Alpha features:**
-->
__Alpha 特性：__

<!--
* **Topology-aware scheduling:** Enable the
  [`TopologyAwareWorkloadScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#TopologyAwareWorkloadScheduling)
  feature gate on the `kube-apiserver` and `kube-scheduler`.

* **CompositePodGroup API:** Enable the
  [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
  feature gate on the `kube-apiserver`, `kube-controller-manager` and `kube-scheduler`, and ensure the `scheduling.k8s.io/v1alpha3` API version is enabled.
  Note that enabling `CompositePodGroup` on the `kube-controller-manager` also requires the [`TopologyAwareWorkloadScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#TopologyAwareWorkloadScheduling) feature gate to be enabled.
* **Workload API integration with the Job controller:** Enable the
  [`WorkloadWithJob`](/docs/reference/command-line-tools-reference/feature-gates/#WorkloadWithJob)
  feature gate on the `kube-apiserver` and `kube-controller-manager`.
* **PodGroup `preemptionPolicy`:** Enable the
  [`PodGroupPreemptionPolicy`](/docs/reference/command-line-tools-reference/feature-gates/#PodGroupPreemptionPolicy)
  feature gate on the `kube-apiserver` and `kube-scheduler`.
-->
* __拓扑感知调度：__
  在 `kube-apiserver` 和 `kube-scheduler` 上启用
  [`TopologyAwareWorkloadScheduling`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#TopologyAwareWorkloadScheduling)
  特性门控。

* __CompositePodGroup API：__
  在 `kube-apiserver`、`kube-controller-manager` 和 `kube-scheduler` 上启用
  [`CompositePodGroup`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
  特性门控，并确保启用了 `scheduling.k8s.io/v1alpha3` API 版本。
  请注意，在 `kube-controller-manager` 上启用 `CompositePodGroup`，
  还需要启用
  [`TopologyAwareWorkloadScheduling`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#TopologyAwareWorkloadScheduling)
  特性门控。
* __Workload API 与 Job 控制器集成：__
  在 `kube-apiserver` 和 `kube-controller-manager` 上启用
  [`WorkloadWithJob`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#WorkloadWithJob)
  特性门控。
* __PodGroup `preemptionPolicy`：__
  在 `kube-apiserver` 和 `kube-scheduler` 上启用
  [`PodGroupPreemptionPolicy`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#PodGroupPreemptionPolicy)
  特性门控。

<!--
**Controller integration APIs:**
-->
__控制器集成 API：__

<!--
The new `workloadbuilder` library is available to developers building both out-of-tree and in-tree controllers who want to integrate with WAS. It does not require a feature gate. You can explore the library and find usage examples directly in the [`kubernetes/component-helpers`](https://github.com/kubernetes/component-helpers/tree/master/scheduling/schedulingv1/workloadbuilder) repository.
-->
新的 `workloadbuilder` 库可供希望与 WAS 集成的树外和树内控制器开发者使用。
它不需要特性门控。
你可以直接在
[`kubernetes/component-helpers`](https://github.com/kubernetes/component-helpers/tree/master/scheduling/schedulingv1/workloadbuilder)
仓库中查看该库并查找用法示例。

<!--
We encourage you to try out workload-aware scheduling in your test clusters
and share your experiences to help shape the future of Kubernetes scheduling.
You can send your feedback by:

* Reaching out via [Slack (#wg-workload-aware-scheduling)](https://kubernetes.slack.com/archives/C0AHLJ0EAEL).
* Joining the [WG Workload-Aware Scheduling](https://www.kubernetes.dev/community/community-groups/wg/workload-aware-scheduling/) or [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/#meetings) meetings.
* Filing a new [issue](https://github.com/kubernetes/kubernetes/issues) in the Kubernetes repository.
-->
我们鼓励你在测试集群中试用工作负载感知调度并分享经验，
帮助塑造 Kubernetes 调度的未来。
你可以通过以下方式提供反馈：

* 通过 [Slack（#wg-workload-aware-scheduling）](https://kubernetes.slack.com/archives/C0AHLJ0EAEL)
  与我们联系。
* 参加 [WG Workload-Aware Scheduling](https://www.kubernetes.dev/community/community-groups/wg/workload-aware-scheduling/)
  或 [SIG Scheduling](https://www.kubernetes.dev/community/community-groups/sigs/scheduling/#meetings) 会议。
* 在 Kubernetes 仓库中提交新的 [Issue](https://github.com/kubernetes/kubernetes/issues)。

<!--
## Learn more
-->
## 了解更多

<!--
To dive deeper into the architecture and design of these features, read the KEPs:

* [KEP-4671: Gang Scheduling Support in Kubernetes](https://www.kubernetes.dev/resources/keps/4671/)
* [KEP-5710: Workload-aware preemption](https://www.kubernetes.dev/resources/keps/5710/)
* [KEP-5732: Topology-aware workload scheduling](https://www.kubernetes.dev/resources/keps/5732/)
* [KEP-6012: CompositePodGroup API](https://www.kubernetes.dev/resources/keps/6012/)
* [KEP-6089: WAS: Controller Integration APIs](https://www.kubernetes.dev/resources/keps/6089/)
* [KEP-5547: WAS: Integrate Workload APIs with Job controller](https://www.kubernetes.dev/resources/keps/5547/)
* [KEP-5729: DRA: ResourceClaim Support for Workloads](https://www.kubernetes.dev/resources/keps/5729/)
-->
要深入了解这些特性的架构和设计，请阅读以下 KEP：

* [KEP-4671：Kubernetes 中的编组调度支持](https://www.kubernetes.dev/resources/keps/4671/)
* [KEP-5710：工作负载感知抢占](https://www.kubernetes.dev/resources/keps/5710/)
* [KEP-5732：拓扑感知工作负载调度](https://www.kubernetes.dev/resources/keps/5732/)
* [KEP-6012：CompositePodGroup API](https://www.kubernetes.dev/resources/keps/6012/)
* [KEP-6089：WAS 控制器集成 API](https://www.kubernetes.dev/resources/keps/6089/)
* [KEP-5547：WAS Workload API 与 Job 控制器集成](https://www.kubernetes.dev/resources/keps/5547/)
* [KEP-5729：DRA 面向工作负载的 ResourceClaim 支持](https://www.kubernetes.dev/resources/keps/5729/)
