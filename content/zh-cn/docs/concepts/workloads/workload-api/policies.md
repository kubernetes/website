---
title: PodGroup 调度策略
content_type: concept
weight: 10
---

<!--
title: PodGroup Scheduling Policies
content_type: concept
weight: 10
-->

<!-- overview -->

{{< feature-state feature_gate_name="GenericWorkload" >}}

<!--
Every [PodGroup](/docs/concepts/workloads/podgroup-api/) must declare a scheduling policy
in its `spec.schedulingPolicy` field. This policy dictates how the scheduler treats the
collection of Pods in the group.
-->
每个 [PodGroup](/zh-cn/docs/concepts/workloads/podgroup-api/) 必须在其 `spec.schedulingPolicy` 字段中声明调度策略。
此策略规定了调度器如何处理组中的 Pod 集合。

<!-- body -->

<!--
## Policy types
-->
## 策略类型   {#policy-types}

<!--
The `schedulingPolicy` field supports two policy types: `basic` and `gang`.
You must specify exactly one.
-->
`schedulingPolicy` 字段支持两种策略类型：`basic` 和 `gang`。
你必须恰好指定其中一种。

<!--
### Basic policy
-->
### 基本策略   {#basic-policy}

<!--
The `basic` policy instructs the scheduler to evaluate all Pods on a best-effort basis.
Unlike the `gang` policy, a PodGroup using the `basic` policy is considered feasible
regardless of how many of its Pods are currently schedulable.
-->
`basic` 策略指示调度器在尽力而为的基础上评估所有 Pod。
与 `gang` 策略不同，使用 `basic` 策略的 PodGroup 被视为可行，
无论其当前有多少 Pod 可调度。

<!--
The primary reason to use the `basic` policy is to organize Pods into a group for better
observability and management, while still evaluating them together within a single, atomic
[PodGroup scheduling cycle](/docs/concepts/scheduling-eviction/podgroup-scheduling/#podgroup-scheduling-cycle).
-->
使用 `basic` 策略的主要原因是将 Pod 组织成一个组，以便更好地进行可观测性和管理，
同时在单个原子性的
[PodGroup 调度周期](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/#podgroup-scheduling-cycle)
中一起评估它们。

<!--
This policy is suited for groups that do not require simultaneous startup but logically
belong together, or to open the way for group-level constraints that do not imply
"all-or-nothing" placement.
-->
此策略适用于不需要同时启动但在逻辑上属于一起的组，
或者为不意味着 "全有或全无" 放置的组级约束开辟道路。

```yaml
schedulingPolicy:
  basic: {}
```

<!--
### Gang policy
-->
### Gang 策略   {#gang-policy}

<!--
The `gang` policy enforces "all-or-nothing" scheduling. This is essential for tightly-coupled
workloads where partial startup results in deadlocks or wasted resources.
-->
`gang` 策略强制执行 "全有或全无" 调度。
这对于紧密耦合的工作负载至关重要，因为部分启动会导致死锁或资源浪费。

<!--
This can be used for [Jobs](/docs/concepts/workloads/controllers/job/)
or any other batch process where all workers must run concurrently to make progress.
-->
这可用于 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 或任何其他批处理过程，
其中所有工作者必须同时运行才能取得进展。

<!--
The `gang` policy requires a `minCount` field, which is the minimum number of Pods that must be
schedulable simultaneously for the group to be feasible:
-->
`gang` 策略需要一个 `minCount` 字段，这是组可行所需的最小同时可调度 Pod 数量：

```yaml
schedulingPolicy:
  gang:
    # The number of Pods that must be schedulable simultaneously
    # for the group to be admitted.
    minCount: 4
```

<!--
## Setting policies via PodGroupTemplates
-->
## 通过 PodGroupTemplates 设置策略   {#setting-policies-via-podgrouptemplates}

<!--
When using the [Workload API](/docs/concepts/workloads/workload-api/), you define scheduling
policies inside `PodGroupTemplates`. The workload controller copies the policy from the
template into each PodGroup it creates, making the PodGroup self-contained. Changes to the
Workload's templates only affect newly created PodGroups, not existing ones.
-->
使用[工作负载 API](/zh-cn/docs/concepts/workloads/workload-api/) 时，你在 `PodGroupTemplates` 中定义调度策略。
工作负载控制器将策略从模板复制到它创建的每个 PodGroup 中，使 PodGroup 成为自包含的。
对 Workload 模板的更改仅影响新创建的 PodGroup，而不影响现有的 PodGroup。

<!--
For standalone PodGroups (created without a Workload), you set `spec.schedulingPolicy`
directly on the PodGroup itself.
-->
对于独立的 PodGroup（不使用 Workload 创建），你直接在 PodGroup 本身上设置 `spec.schedulingPolicy`。

## {{% heading "whatsnext" %}}

<!--
* See the [PodGroup API](/docs/concepts/workloads/podgroup-api/) for how policies are carried at runtime.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/) that defines PodGroupTemplates.
* Read about [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
* Read about the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
-->
* 查看 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/) 了解策略在运行时如何执行。
* 了解定义 PodGroupTemplates 的[工作负载 API](/zh-cn/docs/concepts/workloads/workload-api/)。
* 阅读 [PodGroup 调度](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/)。
* 阅读 [Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)算法。
