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
每个 [PodGroup](/zh-cn/docs/concepts/workloads/podgroup-api/)
都必须在其 `spec.schedulingPolicy` 字段中声明一个调度策略。
该策略决定了调度器如何处理组中的 Pod 集合。

<!-- body -->

<!--
## Policy types

The `schedulingPolicy` field supports two policy types: `basic` and `gang`.
You must specify exactly one.
-->
## 策略类别  {#policy-types}

`schedulingPolicy` 字段支持两种策略类型：`basic` 和 `gang`。
你必须指定其中一种。

<!--
### Basic policy

The `basic` policy instructs the scheduler to evaluate all Pods on a best-effort basis.
Unlike the `gang` policy, a PodGroup using the `basic` policy is considered feasible
regardless of how many of its Pods are currently schedulable.
-->
### Basic 策略   {#basic-policy}

`basic` 策略指示调度器尽力评估所有 Pod。
与 `gang` 策略不同，使用 `basic` 策略的 PodGroup 无论其当前有多少 Pod 可调度，
都被认为是可行的。

<!--
The primary reason to use the `basic` policy is to organize Pods into a group for better
observability and management, while still evaluating them together within a single, atomic
[PodGroup scheduling cycle](/docs/concepts/scheduling-eviction/podgroup-scheduling/#podgroup-scheduling-cycle).

This policy is suited for groups that do not require simultaneous startup but logically
belong together, or to open the way for group-level constraints that do not imply
"all-or-nothing" placement.
-->
使用 `basic` 策略的主要原因是将 Pod 组织成组，以提升可观测性和管理能力，
同时仍然在单个原子
[PodGroup 调度周期](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/#podgroup-scheduling-cycle)
内对它们进行一起评估。

此策略可用于那些不需要同时启动但逻辑上属于同一组的群体，
或者为不涉及“全有或全无”的组约束提供扩展空间。

```yaml
schedulingPolicy:
  basic: {}
```

<!--
### Gang policy

The `gang` policy enforces "all-or-nothing" scheduling. This is essential for tightly-coupled
workloads where partial startup results in deadlocks or wasted resources.
-->
### Gang 策略  {#gang-policy}

`gang` 策略强制执行“全有或全无”的调度机制。这对于紧密耦合的工作负载非常重要，
因为部分启动可能导致死锁或资源浪费。

<!--
This can be used for [Jobs](/docs/concepts/workloads/controllers/job/)
or any other batch process where all workers must run concurrently to make progress.

The `gang` policy requires a `minCount` field, which is the minimum number of Pods that must be
schedulable simultaneously for the group to be feasible:
-->
此策略常用于 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
或其他需要所有 Worker 同时运行才能推进的批处理任务。

`gang` 策略需要一个 `minCount` 字段，该字段表示为了使该组可行，
必须同时调度的最小 Pod 数量：

<!--
```yaml
schedulingPolicy:
  gang:
    # The number of Pods that must be schedulable simultaneously
    # for the group to be admitted.
    minCount: 4
```
-->
```yaml
schedulingPolicy:
  gang:
    # 组被允许调度所需的最小 Pod 数量
    minCount: 4
```

<!--
## Setting policies via PodGroupTemplates

When using the [Workload API](/docs/concepts/workloads/workload-api/), you define scheduling
policies inside `PodGroupTemplates`. The workload controller copies the policy from the
template into each PodGroup it creates, making the PodGroup self-contained. Changes to the
Workload's templates only affect newly created PodGroups, not existing ones.

For standalone PodGroups (created without a Workload), you set `spec.schedulingPolicy`
directly on the PodGroup itself.
-->
## 通过 PodGroupTemplates 设置策略

使用 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/) 时，
你需要在 `PodGroupTemplates` 中定义调度策略。
工作负载控制器会将模板中的策略复制到它创建的每个 PodGroup 中，
从而使 PodGroup 成为自包含的。对工作负载模板的更改只会影响新创建的 PodGroup，
而不会影响已存在的 PodGroup。

对于独立 PodGroup（未通过工作负载创建），你可以直接在
PodGroup 本身上设置 `spec.schedulingPolicy`。

## {{% heading "whatsnext" %}}

<!--
* See the [PodGroup API](/docs/concepts/workloads/podgroup-api/) for how policies are carried at runtime.
* Learn about the [Workload API](/docs/concepts/workloads/workload-api/) that defines PodGroupTemplates.
* Read about [PodGroup scheduling](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
* Read about the [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
-->
* 请参阅 [PodGroup API](/zh-cn/docs/concepts/workloads/podgroup-api/)，了解策略如何在运行时执行。
* 了解定义 PodGroupTemplate 的 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/)。
* 阅读 [PodGroup 调度](/zh-cn/docs/concepts/scheduling-eviction/podgroup-scheduling/)。
* 阅读 [Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)算法。
