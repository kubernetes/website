---
layout: blog
title: 'Kubernetes v1.31：全新的 Kubernetes CPUManager 静态策略：跨核分发 CPU'
date: 2024-08-22
slug: cpumanager-static-policy-distributed-cpu-across-cores
author: >
  [Jiaxin Shan](https://github.com/Jeffwan) (Bytedance)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.31: New Kubernetes CPUManager Static Policy: Distribute CPUs Across Cores'
date: 2024-08-22
slug: cpumanager-static-policy-distributed-cpu-across-cores
author: >
  [Jiaxin Shan](https://github.com/Jeffwan) (Bytedance)
-->

<!--
In Kubernetes v1.31, we are excited to introduce a significant enhancement to CPU management capabilities: the `distribute-cpus-across-cores` option for the [CPUManager static policy](/docs/tasks/administer-cluster/cpu-management-policies/#static-policy-options). This feature is currently in alpha and hidden by default, marking a strategic shift aimed at optimizing CPU utilization and improving system performance across multi-core processors.
-->
在 Kubernetes v1.31 中，我们很高兴引入了对 CPU 管理能力的重大增强：针对
[CPUManager 静态策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/#static-policy-options)的
`distribute-cpus-across-cores` 选项。此特性目前处于 Alpha 阶段，
默认被隐藏，标志着旨在优化 CPU 利用率和改善多核处理器系统性能的战略转变。

<!--
## Understanding the feature

Traditionally, Kubernetes' CPUManager tends to allocate CPUs as compactly as possible, typically packing them onto the fewest number of physical cores. However, allocation strategy matters, CPUs on the same physical host still share some resources of the physical core, such as the cache and execution units, etc.
-->
## 理解这一特性   {#understanding-the-feature}

传统上，Kubernetes 的 CPUManager 倾向于尽可能紧凑地分配 CPU，通常将这些 CPU 打包到尽可能少的物理核上。
然而，分配策略很重要，因为同一物理主机上的 CPU 仍然共享一些物理核的资源，例如缓存和执行单元等。

{{< figure src="cpu-cache-architecture.png" alt="cpu-cache-architecture" >}}

<!--
While default approach minimizes inter-core communication and can be beneficial under certain scenarios, it also poses a challenge. CPUs sharing a physical core can lead to resource contention, which in turn may cause performance bottlenecks, particularly noticeable in CPU-intensive applications.
-->
虽然默认方法可以最小化核间通信，并在某些情况下是有益的，但也带来了挑战。
在同一物理核上共享的 CPU 可能导致资源竞争，从而可能造成性能瓶颈，这在 CPU 密集型应用中尤为明显。

<!--
The new `distribute-cpus-across-cores` feature addresses this issue by modifying the allocation strategy. When enabled, this policy option instructs the CPUManager to spread out the CPUs (hardware threads) across as many physical cores as possible. This distribution is designed to minimize contention among CPUs sharing the same physical core, potentially enhancing the performance of applications by providing them dedicated core resources.

Technically, within this static policy, the free CPU list is reordered in the manner depicted in the diagram, aiming to allocate CPUs from separate physical cores.
-->
全新的 `distribute-cpus-across-cores` 特性通过修改分配策略来解决这个问题。
当此特性被启用时，此策略选项指示 CPUManager 尽可能将 CPU（硬件线程）分发到尽可能多的物理核上。
这种分发旨在最小化共享同一物理核的 CPU 之间的争用，从而通过为应用提供专用的核资源来潜在提高性能。

从技术上讲，在这个静态策略中，可用的 CPU 列表按照图示的方式重新排序，旨在从不同的物理核分配 CPU。

{{< figure src="cpu-ordering.png" alt="cpu-ordering" >}}

<!--
## Enabling the feature

To enable this feature, users firstly need to add `--cpu-manager-policy=static` kubelet flag or the `cpuManagerPolicy: static` field in KubeletConfiuration. Then user can add `--cpu-manager-policy-options distribute-cpus-across-cores=true` or `distribute-cpus-across-cores=true` to their CPUManager policy options in the Kubernetes configuration or. This setting directs the CPUManager to adopt the new distribution strategy. It is important to note that this policy option cannot currently be used in conjunction with `full-pcpus-only` or `distribute-cpus-across-numa` options.
-->
## 启用此特性   {#enabling-the-feature}

要启用此特性，用户首先需要在 kubelet 配置中添加 `--cpu-manager-policy=static` kubelet 标志或 `cpuManagerPolicy: static` 字段。
然后用户可以在 Kubernetes 配置中添加 `--cpu-manager-policy-options distribute-cpus-across-cores=true` 或
`distribute-cpus-across-cores=true` 到自己的 CPUManager 策略选项中。此设置指示 CPUManager 采用新的分发策略。
需要注意的是，目前此策略选项无法与 `full-pcpus-only` 或 `distribute-cpus-across-numa` 选项一起使用。

<!--
## Current limitations and future directions

As with any new feature, especially one in alpha, there are limitations and areas for future improvement. One significant current limitation is that `distribute-cpus-across-cores` cannot be combined with other policy options that might conflict in terms of CPU allocation strategies. This restriction can affect compatibility with certain workloads and deployment scenarios that rely on more specialized resource management.
-->
## 当前限制和未来方向   {#current-limitations-and-future-directions}

与所有新特性一样，尤其是处于 Alpha 阶段的特性，此特性也存在一些限制，很多方面还有待后续改进。
当前一个显著的限制是 `distribute-cpus-across-cores` 不能与可能在 CPU 分配策略上存在冲突的其他策略选项结合使用。
这一限制可能会影响与（依赖于更专业的资源管理的）某些工作负载和部署场景的兼容性。

<!--
Looking forward, we are committed to enhancing the compatibility and functionality of the `distribute-cpus-across-cores` option. Future updates will focus on resolving these compatibility issues, allowing this policy to be combined with other CPUManager policies seamlessly. Our goal is to provide a more flexible and robust CPU allocation framework that can adapt to a variety of workloads and performance demands.
-->
展望未来，我们将致力于增强 `distribute-cpus-across-cores` 选项的兼容性和特性。
未来的更新将专注于解决这些兼容性问题，使此策略能够与其他 CPUManager 策略无缝结合。
我们的目标是提供一个更灵活和强大的 CPU 分配框架，能够适应各种工作负载和性能需求。

<!--
## Conclusion

The introduction of the `distribute-cpus-across-cores` policy in Kubernetes CPUManager is a step forward in our ongoing efforts to refine resource management and improve application performance. By reducing the contention on physical cores, this feature offers a more balanced approach to CPU resource allocation, particularly beneficial for environments running heterogeneous workloads. We encourage Kubernetes users to test this new feature and provide feedback, which will be invaluable in shaping its future development.

This draft aims to clearly explain the new feature while setting expectations for its current stage and future improvements.
-->
## 结论   {#conclusion}

在 Kubernetes CPUManager 中引入 `distribute-cpus-across-cores` 策略是我们持续努力改进资源管理和提升应用性能而向前迈出的一步。
通过减少物理核上的争用，此特性提供了更加平衡的 CPU 资源分配方法，特别有利于运行异构工作负载的环境。
我们鼓励 Kubernetes 用户测试这一新特性并提供反馈，这将对其未来发展至关重要。

本文旨在清晰地解释这一新特性，同时设定对其当前阶段和未来改进的期望。

<!--
## Further reading

Please check out the [Control CPU Management Policies on the Node](/docs/tasks/administer-cluster/cpu-management-policies/)
task page to learn more about the CPU Manager, and how it fits in relation to the other node-level resource managers.
-->
## 进一步阅读   {#further-reading}

请查阅[节点上的 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)任务页面，
以了解有关 CPU 管理器的更多信息，以及 CPU 管理器与其他节点级资源管理器的关系。

<!--
## Getting involved

This feature is driven by the [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md). If you are interested in helping develop this feature, sharing feedback, or participating in any other ongoing SIG Node projects, please attend the SIG Node meeting for more details.
-->
## 参与其中   {#getting-involved}

此特性由 [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md) 推动。
如果你有兴趣帮助开发此特性、分享反馈或参与其他目前 SIG Node 项目的工作，请参加 SIG Node 会议了解更多细节。
