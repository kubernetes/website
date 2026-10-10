---
layout: blog
title: 'Kubernetes v1.32 增加了新的 CPU Manager 静态策略选项用于严格 CPU 预留'
date: 2024-12-16
slug: cpumanager-strict-cpu-reservation
author: >
  [Jing Zhang](https://github.com/jingczhang) (Nokia)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.32 Adds A New CPU Manager Static Policy Option For Strict CPU Reservation'
date: 2024-12-16
slug: cpumanager-strict-cpu-reservation
author: >
  [Jing Zhang](https://github.com/jingczhang) (Nokia)
-->

<!--
In Kubernetes v1.32, after years of community discussion, we are excited to introduce a
`strict-cpu-reservation` option for the [CPU Manager static policy](/docs/tasks/administer-cluster/cpu-management-policies/#static-policy-options).
This feature is currently in alpha, with the associated policy hidden by default. You can only use the
policy if you explicitly enable the alpha behavior in your cluster.
-->
在 Kubernetes v1.32 中，经过社区多年的讨论，我们很高兴地引入了
[CPU Manager 静态策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/#static-policy-options)的
`strict-cpu-reservation` 选项。此特性当前处于 Alpha 阶段，默认情况下关联的策略是隐藏的。
只有在你的集群中明确启用了此 Alpha 行为后，才能使用此策略。

<!--
## Understanding the feature

The CPU Manager static policy is used to reduce latency or improve performance. The `reservedSystemCPUs` defines an explicit CPU set for OS system daemons and kubernetes system daemons. This option is designed for Telco/NFV type use cases where uncontrolled interrupts/timers may impact the workload performance. you can use this option to define the explicit cpuset for the system/kubernetes daemons as well as the interrupts/timers, so the rest CPUs on the system can be used exclusively for workloads, with less impact from uncontrolled interrupts/timers. More details of this parameter can be found on the [Explicitly Reserved CPU List](/docs/tasks/administer-cluster/reserve-compute-resources/#explicitly-reserved-cpu-list) page.

If you want to protect your system daemons and interrupt processing, the obvious way is to use the `reservedSystemCPUs` option.
-->
## 理解此特性

CPU Manager 静态策略用于减少延迟或提高性能。`reservedSystemCPUs`
定义了一个明确的 CPU 集合，供操作系统系统守护进程和 Kubernetes 系统守护进程使用。
此选项专为 Telco/NFV 类型的使用场景设计，在这些场景中，不受控制的中断/计时器可能会影响工作负载的性能。
你可以使用此选项为系统/Kubernetes 守护进程以及中断/计时器定义明确的 CPU 集合，
从而使系统上的其余 CPU 可以专用于工作负载，并减少不受控制的中断/计时器带来的影响。
有关此参数的更多详细信息，请参阅
[显式预留的 CPU 列表](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#explicitly-reserved-cpu-list)
页面。

如果你希望保护系统守护进程和中断处理，显而易见的方法是使用 `reservedSystemCPUs` 选项。

<!--
However, until the Kubernetes v1.32 release, this isolation was only implemented for guaranteed
pods that made requests for a whole number of CPUs. At pod admission time, the kubelet only
compares the CPU _requests_ against the allocatable CPUs. In Kubernetes, limits can be higher than
the requests; the previous implementation allowed burstable and best-effort pods to use up
the capacity of `reservedSystemCPUs`, which could then starve host OS services of CPU - and we
know that people saw this in real life deployments.
The existing behavior also made benchmarking (for both infrastructure and workloads) results inaccurate.

When this new `strict-cpu-reservation` policy option is enabled, the CPU Manager static policy will not allow any workload to use the reserved system CPU cores.
-->
然而，在 Kubernetes v1.32 发布之前，这种隔离仅针对请求整数个 CPU
的 Guaranteed 类型 Pod 实现。在 Pod 准入时，kubelet 仅将 CPU
**请求量**与可分配的 CPU 进行比较。在 Kubernetes 中，限制值可以高于请求值；
之前的实现允许 Burstable 和 BestEffort 类型的 Pod 使用 `reservedSystemCPUs` 的容量，
这可能导致主机操作系统服务缺乏足够的 CPU 资源 —— 并且我们已经知道在实际部署中确实发生过这种情况。
现有的行为还导致基础设施和工作负载的基准测试结果不准确。

当启用这个新的 `strict-cpu-reservation` 策略选项后，CPU Manager
静态策略将不允许任何工作负载使用预留的系统 CPU 核心。

<!--
## Enabling the feature

To enable this feature, you need to turn on both the `CPUManagerPolicyAlphaOptions` feature gate and the `strict-cpu-reservation` policy option. And you need to remove the `/var/lib/kubelet/cpu_manager_state` file if it exists and restart kubelet.

With the following kubelet configuration:
-->
## 启用此特性

要启用此特性，你需要同时开启 `CPUManagerPolicyAlphaOptions` 特性门控和
`strict-cpu-reservation` 策略选项。并且如果存在 `/var/lib/kubelet/cpu_manager_state`
文件，则需要删除该文件并重启 kubelet。

使用以下 kubelet 配置：

```yaml
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
featureGates:
  ...
  CPUManagerPolicyOptions: true
  CPUManagerPolicyAlphaOptions: true
cpuManagerPolicy: static
cpuManagerPolicyOptions:
  strict-cpu-reservation: "true"
reservedSystemCPUs: "0,32,1,33,16,48"
...
```

<!--
When `strict-cpu-reservation` is not set or set to false:
-->
当未设置 `strict-cpu-reservation` 或将其设置为 false 时：

```console
# cat /var/lib/kubelet/cpu_manager_state
{"policyName":"static","defaultCpuSet":"0-63","checksum":1058907510}
```

<!--
When `strict-cpu-reservation` is set to true:
-->
当 `strict-cpu-reservation` 设置为 true 时：

```console
# cat /var/lib/kubelet/cpu_manager_state
{"policyName":"static","defaultCpuSet":"2-15,17-31,34-47,49-63","checksum":4141502832}
```

<!--
## Monitoring the feature

You can monitor the feature impact by checking the following CPU Manager counters:
- `cpu_manager_shared_pool_size_millicores`: report shared pool size, in millicores (e.g. 13500m)
- `cpu_manager_exclusive_cpu_allocation_count`: report exclusively allocated cores, counting full cores (e.g. 16)
-->
## 监控此特性

你可以通过检查以下 CPU Manager 计数器来监控该特性的影响：

- `cpu_manager_shared_pool_size_millicores`：报告共享池大小，以毫核为单位（例如 13500m）
- `cpu_manager_exclusive_cpu_allocation_count`：报告独占分配的核心数，按完整核心计数（例如 16）

<!--
Your best-effort workloads may starve if the `cpu_manager_shared_pool_size_millicores` count is zero for prolonged time.

We believe any pod that is required for operational purpose like a log forwarder should not run as best-effort, but you can review and adjust the amount of CPU cores reserved as needed.
-->
如果 `cpu_manager_shared_pool_size_millicores` 计数在长时间内为零，
你的 BestEffort 类型工作负载可能会因资源匮乏而受到影响。

我们建议，任何用于操作目的的 Pod（如日志转发器）都不应以 BestEffort 方式运行，
但你可以根据需要审查并调整预留的 CPU 核心数量。

<!--
## Conclusion

Strict CPU reservation is critical for Telco/NFV use cases. It is also a prerequisite for enabling the all-in-one type of deployments where workloads are placed on nodes serving combined control+worker+storage roles.

We want you to start using the feature and looking forward to your feedback.
-->
## 总结

严格的 CPU 预留对于 Telco/NFV 使用场景至关重要。
它也是启用一体化部署类型（其中工作负载被放置在同时担任控制面节点、工作节点和存储角色的节点上）的前提条件。

我们希望你开始使用该特性，并期待你的反馈。

<!--
## Further reading

Please check out the [Control CPU Management Policies on the Node](/docs/tasks/administer-cluster/cpu-management-policies/)
task page to learn more about the CPU Manager, and how it fits in relation to the other node-level resource managers.
-->
## 进一步阅读

请查看[节点上的控制 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)任务页面，
以了解更多关于 CPU Manager 的信息，以及它如何与其他节点级资源管理器相关联。

<!--
## Getting involved

This feature is driven by the [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md). If you are interested in helping develop this feature, sharing feedback, or participating in any other ongoing SIG Node projects, please attend the SIG Node meeting for more details.
-->
## 参与其中

此特性由 [SIG Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md)
推动。如果你有兴趣帮助开发此特性、分享反馈或参与任何其他正在进行的 SIG Node 项目，
请参加 SIG Node 会议以获取更多详情。
