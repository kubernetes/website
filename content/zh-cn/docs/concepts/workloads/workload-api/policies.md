---
title: Pod 组策略
content_type: concept
weight: 10
---
<!--
title: Pod Group Policies
content_type: concept
weight: 10
-->

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

<!--
Every pod group defined in a [Workload](/docs/concepts/workloads/workload-api/)
must declare a scheduling policy. This policy dictates how the scheduler treats the collection of Pods.
-->
在 [Workload](/zh-cn/docs/concepts/workloads/workload-api/) 中定义的每一个
Pod 组都必须声明一个调度策略。此策略决定调度器如何处理这一组 Pod。

<!-- body -->

<!--
## Policy types

The API currently supports two policy types: `basic` and `gang`.
You must specify exactly one policy for each group.
-->
## 策略类别  {#policy-types}

当前 API 支持两种策略类别：`basic` 和 `gang`。你必须为每个 Pod 组指定一种策略。

<!--
### Basic policy

The `basic` policy instructs the scheduler to treat all Pods in the group as independent entities,
scheduling them using the standard Kubernetes behavior.
-->
### Basic 策略   {#basic-policy}

`basic` 策略指示调度器将组内的所有 Pod 视为独立实体，并使用标准的 Kubernetes 行为来调度这些 Pod。

<!--
The main reason to use the `basic` policy is to organize the Pods within your Workload
for better observability and management.

This policy can be used for groups of a Workload that do not require simultaneous startup
but logically belong to the application, or to open the way for future group constraints
that do not imply "all-or-nothing" placement.
-->
使用 `basic` 策略的主要原因是对 Workload 中的 Pod 进行组织，以提升可观测性和管理能力。

此策略可用于那些不需要同时启动但逻辑上属于应用的 Workload 组；
同时也为未来可能引入的、不一定要求“全有或全无”调度方式的组约束提供扩展空间。

```yaml
policy:
  basic: {}
```

<!--
### Gang policy

The `gang` policy enforces "all-or-nothing" scheduling. This is essential for tightly-coupled workloads
where partial startup results in deadlocks or wasted resources.
-->
### Gang 策略  {#gang-policy}

`gang` 策略强制执行“全有或全无”的调度机制。这对于紧密耦合的工作负载非常重要，因为部分启动可能导致死锁或资源浪费。

<!--
This can be used for [Jobs](/docs/concepts/workloads/controllers/job/)
or any other batch process where all workers must run concurrently to make progress.

The `gang` policy requires a `minCount` parameter:
-->
此策略常用于 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
或其他需要所有 Worker 同时运行才能推进的批处理任务。

`gang` 策略需要配置 `minCount` 参数：

<!--
```yaml
policy:
  gang:
    # The number of Pods that must be schedulable simultaneously
    # for the group to be admitted.
    minCount: 4
```
-->
```yaml
policy:
  gang:
    # 组被允许调度所需的最小 Pod 数量
    minCount: 4
```

## {{% heading "whatsnext" %}}

<!--
* Read about [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) algorithm.
-->
* 阅读 [Gang 调度](/zh-cn/docs/concepts/scheduling-eviction/gang-scheduling/)算法。
