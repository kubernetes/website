---
layout: blog
title: "Kubernetes v1.35：引入工作负载感知调度"
date: 2025-12-29T10:30:00-08:00
slug: kubernetes-v1-35-introducing-workload-aware-scheduling
author: >
  Maciej Skoczeń (Google),
  Dominik Marciński (Google)
translator: >
  [Paco Xu](https://github.com/pacoxu)(DaoCloud)
---

<!--
layout: blog
title: "Kubernetes v1.35: Introducing Workload Aware Scheduling"
date: 2025-12-29T10:30:00-08:00
slug: kubernetes-v1-35-introducing-workload-aware-scheduling
author: >
  Maciej Skoczeń (Google),
  Dominik Marciński (Google)
-->

<!--
Scheduling large workloads is a much more complex and fragile operation than scheduling a single Pod,
as it often requires considering all Pods together instead of scheduling each one independently.
For example, when scheduling a machine learning batch job, you often need to place each worker strategically,
such as on the same rack, to make the entire process as efficient as possible.
At the same time, the Pods that are part of such a workload are very often identical
from the scheduling perspective, which fundamentally changes how this process should look.
-->
调度大型工作负载比调度单个 Pod 更复杂、也更脆弱，
因为它通常需要把所有 Pod 作为整体来考虑，而不是逐个独立调度。
例如，在调度一个机器学习批处理任务时，
你往往需要有策略地放置每个 worker（例如放在同一个机架上），
才能让整体执行效率更高。
同时，这类工作负载中的 Pod 在调度视角下往往非常相似，
这从根本上改变了调度过程应有的形态。

<!--
There are many custom schedulers adapted to perform workload scheduling efficiently,
but considering how common and important workload scheduling is to Kubernetes users,
especially in the AI era with the growing number of use cases,
it is high time to make workloads a first-class citizen for `kube-scheduler` and support them natively.
-->
虽然已经有很多定制调度器可以高效处理工作负载调度，
但考虑到工作负载调度对 Kubernetes 用户的普遍性和重要性，
尤其是在 AI 时代用例快速增长的背景下，
现在正是让工作负载成为 `kube-scheduler` 一等公民、并提供原生支持的时候。

<!--
## Workload aware scheduling
-->
## 工作负载感知调度

<!--
The recent 1.35 release of Kubernetes delivered the first tranche of *workload aware scheduling* improvements.
These are part of a wider effort that is aiming to improve scheduling and management of workloads.
The effort will span over many SIGs and releases, and is supposed to gradually expand
capabilities of the system toward reaching the north star goal,
which is seamless workload scheduling and management in Kubernetes including,
but not limited to, preemption and autoscaling.
-->
Kubernetes 1.35 最近发布了首批**工作负载感知调度**能力改进。
这些改进属于一个更广泛的长期计划，目标是提升工作负载的调度与管理能力。
该计划将跨越多个 SIG 和多个发布周期，
逐步扩展系统能力，向其“北极星目标”推进：
在 Kubernetes 中实现无缝的工作负载调度与管理，
包括但不限于抢占和自动伸缩。

<!--
Kubernetes v1.35 introduces the Workload API that you can use to describe the desired shape
as well as scheduling-oriented requirements of the workload. It comes with an initial implementation
of *gang scheduling* that instructs the `kube-scheduler` to schedule gang Pods in the *all-or-nothing* fashion.
Finally, we improved scheduling of identical Pods (that typically make a gang) to speed up the process
thanks to the *opportunistic batching* feature.
-->
Kubernetes v1.35 引入了 Workload API，
你可以用它描述工作负载的目标形态以及面向调度的要求。
它还带来了 **编组调度（Gang Scheduling）** 的初始实现，
可指示 `kube-scheduler` 以 **全有或全无（all-or-nothing）** 方式调度编组 Pod。
最后，我们通过 **机会式批处理（Opportunistic batching）** 特性提升了相同 Pod（通常构成一个编组）的调度效率，
从而加速整个调度过程。

<!--
## Workload API
-->
## Workload API

<!--
The new Workload API resource is part of the `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}}.
This resource acts as a structured, machine-readable definition of the scheduling requirements
of a multi-Pod application. While user-facing workloads like Jobs define what to run, the Workload resource
determines how a group of Pods should be scheduled and how its placement should be managed
throughout its lifecycle.
-->
新的 Workload API 资源属于 `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}。
该资源以结构化、机器可读的形式定义多 Pod 应用的调度需求。
像 Job 这类面向用户的工作负载定义“运行什么”，
而 Workload 资源定义“一组 Pod 应如何被调度”，
以及它们在整个生命周期内的放置如何被管理。

<!--
A Workload allows you to define a group of Pods and apply a scheduling policy to them.
Here is what a gang scheduling configuration looks like. You can define a `podGroup` named `workers`
and apply the `gang` policy with a `minCount` of 4.
-->
Workload 允许你定义一组 Pod，并对其应用调度策略。
下面是一个编组调度配置示例：
你可以定义一个名为 `workers` 的 `podGroup`，并应用 `gang` 策略，`minCount` 设置为 4。

<!--
```yaml
apiVersion: scheduling.k8s.io/v1alpha1
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  podGroups:
  - name: workers
    policy:
      gang:
        # The gang is schedulable only if 4 pods can run at once
        minCount: 4
```
-->
```yaml
apiVersion: scheduling.k8s.io/v1alpha1
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  podGroups:
  - name: workers
    policy:
      gang:
        # 仅当 4 个 Pod 能同时运行时，该编组才可调度
        minCount: 4
```

<!--
When you create your Pods, you link them to this Workload using the new `workloadRef` field:
-->
创建 Pod 时，你可以通过新的 `workloadRef` 字段把它们关联到这个 Workload：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
  namespace: some-ns
spec:
  workloadRef:
    name: training-job-workload
    podGroup: workers
  ...
```

<!--
## How gang scheduling works
-->
## 编组调度如何工作

<!--
The `gang` policy enforces *all-or-nothing* placement. Without gang scheduling,
a Job might be partially scheduled, consuming resources without being able to run,
leading to resource wastage and potential deadlocks.
-->
`gang` 策略会强制执行**全有或全无**放置。
没有编组调度时，一个 Job 可能只被部分调度，
占用资源却无法真正运行，从而导致资源浪费甚至潜在死锁。

<!--
When you create Pods that are part of a gang-scheduled pod group, the scheduler's `GangScheduling`
plugin manages the lifecycle independently for each pod group (or replica key):
-->
当你创建属于某个编组调度 Pod 组的 Pod 时，
调度器的 `GangScheduling` 插件会按每个 Pod 组（或副本键）独立管理其生命周期：

<!--
1. When you create your Pods (or a controller makes them for you),
   the scheduler blocks them from scheduling, until:
   * The referenced Workload object is created.
   * The referenced pod group exists in a Workload.
   * The number of pending Pods in that group meets your `minCount`.

2. Once enough Pods arrive, the scheduler tries to place them. However,
   instead of binding them to nodes immediately, the Pods wait at a `Permit` gate.

3. The scheduler checks if it has found valid assignments for the entire group (at least the `minCount`).
   * If there is room for the group, the gate opens, and all Pods are bound to nodes.
   * If only a subset of the group pods was successfully scheduled within a timeout (set to 5 minutes),
     the scheduler rejects **all** of the Pods in the group.
     They go back to the queue, freeing up the reserved resources for other workloads.
-->
1. 当你创建 Pod（或由控制器代你创建）时，
   调度器会先阻止它们被调度，直到：
   * 被引用的 Workload 对象已创建；
   * 被引用的 Pod 组在某个 Workload 中存在；
   * 该组中待调度 Pod 数量满足你的 `minCount`。

2. 当到达足够数量的 Pod 后，调度器会尝试放置它们。
   但这些 Pod 不会立即绑定到节点，而是先在 `Permit` 门控处等待。

3. 调度器会检查是否已为整个组（至少达到 `minCount`）找到有效分配。
   * 如果组有足够空间，门控打开，所有 Pod 绑定到节点。
   * 如果在超时（默认 5 分钟）内仅有子集 Pod 调度成功，
     调度器会拒绝该组中的**所有** Pod。
     它们会返回队列，释放已保留资源给其他工作负载。

<!--
We'd like to point out that that while this is a first implementation, the Kubernetes project firmly
intends to improve and expand the gang scheduling algorithm in future releases.
Benefits we hope to deliver include a single-cycle scheduling phase for a whole gang,
workload-level preemption, and more, moving towards the north star goal.
-->
需要说明的是，虽然这只是第一版实现，
Kubernetes 项目已经明确计划在后续版本持续改进并扩展编组调度算法。
我们希望带来的收益包括：
针对整个编组的单周期调度阶段、工作负载级抢占等，
并持续向北极星目标推进。

<!--
## 机会式批处理
-->
## Opportunistic batching

<!--
In addition to explicit gang scheduling, v1.35 introduces *opportunistic batching*.
This is a Beta feature that improves scheduling latency for identical Pods.
-->
除了显式的编组调度，v1.35 还引入了**机会式批处理**。
这是一个 Beta 特性，可降低相同 Pod 的调度延迟。

<!--
Unlike gang scheduling, this feature does not require the Workload API
or any explicit opt-in on the user's part. It works opportunistically within the scheduler
by identifying Pods that have identical scheduling requirements (container images, resource requests,
affinities, etc.). When the scheduler processes a Pod, it can reuse the feasibility calculations
for subsequent identical Pods in the queue, significantly speeding up the process.
-->
与编组调度不同，这个特性不要求启用 Workload API，
也不需要用户显式选择加入。
它在调度器内部以“机会式”方式工作：识别调度要求相同的 Pod
（例如容器镜像、资源请求、亲和性等）。
当调度器处理一个 Pod 时，
可以复用该 Pod 的可行性计算结果给队列中后续相同 Pod，
从而显著加速调度。

<!--
Most users will benefit from this optimization automatically, without taking any special steps,
provided their Pods meet the following criteria.
-->
只要 Pod 满足相应条件，多数用户无需额外操作就能自动受益于这项优化。

<!--
### Restrictions
-->
### 限制条件

<!--
Opportunistic batching works under specific conditions. All fields used by the `kube-scheduler`
to find a placement must be identical between Pods. Additionally, using some features
disables the batching mechanism for those Pods to ensure correctness.
-->
机会式批处理仅在特定条件下生效。
`kube-scheduler` 用于寻找放置位置的相关字段，必须在 Pod 之间保持一致。
此外，某些特性的使用会为这些 Pod 禁用批处理机制，以确保正确性。

<!--
Note that you may need to review your `kube-scheduler` configuration
to ensure it is not implicitly disabling batching for your workloads.
-->
请注意，你可能需要检查 `kube-scheduler` 配置，
确保它没有在你不知情的情况下为工作负载隐式禁用批处理。

<!--
See the [docs](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/#enabling-opportunistic-batching) for more details about restrictions.
-->
关于限制条件的更多细节，请参考[文档](/zh-cn/docs/concepts/scheduling-eviction/scheduler-perf-tuning/#enabling-opportunistic-batching)。

<!--
## The north star vision
-->
## 北极星愿景

<!--
The project has a broad ambition to deliver workload aware scheduling.
These new APIs and scheduling enhancements are just the first steps.
In the near future, the effort aims to tackle:

* Introducing a workload scheduling phase
* Improved support for multi-node [DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
  and topology aware scheduling
* Workload-level preemption
* Improved integration between scheduling and autoscaling
* Improved interaction with external workload schedulers
* Managing placement of workloads throughout their entire lifecycle
* Multi-workload scheduling simulations

And more. The priority and implementation order of these focus areas
are subject to change. Stay tuned for further updates.
-->
该项目有着广泛目标：实现工作负载感知调度。
这些新 API 与调度增强只是第一步。
在近期，工作将重点攻关：

* 引入工作负载调度阶段
* 增强多节点 [DRA](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
  与拓扑感知调度支持
* 工作负载级抢占
* 增强调度与自动伸缩的集成
* 增强与外部工作负载调度器的交互
* 覆盖工作负载全生命周期的放置管理
* 多工作负载调度模拟

以及更多方向。上述重点的优先级和实现顺序可能会调整，敬请关注后续更新。

<!--
## Getting started
-->
## 快速开始

<!--
To try the workload aware scheduling improvements:

* Workload API: Enable the
  [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
  feature gate on both `kube-apiserver` and `kube-scheduler`, and ensure the `scheduling.k8s.io/v1alpha1`
  {{< glossary_tooltip text="API group" term_id="api-group" >}} is enabled.
* Gang scheduling: Enable the
  [`GangScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling)
  feature gate on `kube-scheduler` (requires the Workload API to be enabled).
* Opportunistic batching: As a Beta feature, it is enabled by default in v1.35.
  You can disable it using the
  [`OpportunisticBatching`](/docs/reference/command-line-tools-reference/feature-gates/#OpportunisticBatching)
  feature gate on `kube-scheduler` if needed.
-->
要体验工作负载感知调度改进：

* Workload API：在 `kube-apiserver` 和 `kube-scheduler` 上启用
  [`GenericWorkload`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
  特性门控，并确保启用 `scheduling.k8s.io/v1alpha1`
  {{< glossary_tooltip text="API 组" term_id="api-group" >}}。
* 编组调度：在 `kube-scheduler` 上启用
  [`GangScheduling`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling)
  特性门控（要求 Workload API 已启用）。
* 机会式批处理：该 Beta 特性在 v1.35 默认启用。
  如有需要，可在 `kube-scheduler` 上通过
  [`OpportunisticBatching`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#OpportunisticBatching)
  特性门控将其关闭。

<!--
We encourage you to try out workload aware scheduling in your test clusters
and share your experiences to help shape the future of Kubernetes scheduling.
You can send your feedback by:

* Reaching out via [Slack (#sig-scheduling)](https://kubernetes.slack.com/archives/C09TP78DV).
* Commenting on the [workload aware scheduling tracking issue](https://github.com/kubernetes/kubernetes/issues/132192)
* Filing a new [issue](https://github.com/kubernetes/enhancements/issues) in the Kubernetes repository.
-->
我们鼓励你在测试集群中试用工作负载感知调度，并分享使用体验，
帮助塑造 Kubernetes 调度的未来。
你可以通过以下方式反馈：

* 在 [Slack (#sig-scheduling)](https://kubernetes.slack.com/archives/C09TP78DV) 联系我们。
* 在[工作负载感知调度跟踪 issue](https://github.com/kubernetes/kubernetes/issues/132192) 下评论。
* 在 Kubernetes 仓库提交新的 [Issue](https://github.com/kubernetes/enhancements/issues)。

<!--
## Learn more

* Read the KEPs for
  [Workload API and gang scheduling](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/4671-gang-scheduling) and
  [Opportunistic batching](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/5598-opportunistic-batching).
* Track the [Workload aware scheduling issue](https://github.com/kubernetes/kubernetes/issues/132192)
  for recent updates.
-->
## 了解更多

* 阅读以下 KEP：
  [Workload API 与编组调度](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/4671-gang-scheduling)
  和[机会式批处理](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/5598-opportunistic-batching)。
* 关注[工作负载感知调度 issue](https://github.com/kubernetes/kubernetes/issues/132192)
  获取最新进展。
