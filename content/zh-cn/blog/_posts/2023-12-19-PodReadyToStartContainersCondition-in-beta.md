---
layout: blog
title: "Kubernetes 1.29：PodReadyToStartContainers 状况进阶至 Beta"
date: 2023-12-19
slug: pod-ready-to-start-containers-condition-now-in-beta
---
<!--
layout: blog
title: "Kubernetes 1.29: PodReadyToStartContainers Condition Moves to Beta"
date: 2023-12-19
slug: pod-ready-to-start-containers-condition-now-in-beta
-->

<!--
**Authors**: Zefeng Chen (independent), Kevin Hannon (Red Hat)
-->
**作者**：Zefeng Chen (independent), Kevin Hannon (Red Hat)

**译者**：[Michael Yao](https://github.com/windsonsea)

<!--
With the recent release of Kubernetes 1.29, the `PodReadyToStartContainers`
[condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) is 
available by default.
The kubelet manages the value for that condition throughout a Pod's lifecycle, 
in the status field of a Pod. The kubelet will use the `PodReadyToStartContainers`
condition to accurately surface the initialization state of a Pod,
from the perspective of Pod sandbox creation and network configuration by a container runtime.
-->
随着最近发布的 Kubernetes 1.29，`PodReadyToStartContainers`
[状况](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)默认可用。
kubelet 在 Pod 的整个生命周期中管理该状况的值，将其存储在 Pod 的状态字段中。
kubelet 将通过容器运行时从 Pod 沙箱创建和网络配置的角度使用 `PodReadyToStartContainers`
状况准确地展示 Pod 的初始化状态，

<!--
## What's the motivation for this feature?
-->
## 这个特性的动机是什么？

<!--
Cluster administrators did not have a clear and easily accessible way to view the completion of Pod's sandbox creation
and initialization. As of 1.28, the `Initialized` condition in Pods tracks the execution of init containers.
However, it has limitations in accurately reflecting the completion of sandbox creation and readiness to start containers for all Pods in a cluster. 
This distinction is particularly important in multi-tenant clusters where tenants own the Pod specifications, including the set of init containers, 
while cluster administrators manage storage plugins, networking plugins, and container runtime handlers. 
Therefore, there is a need for an improved mechanism to provide cluster administrators with a clear and 
comprehensive view of Pod sandbox creation completion and container readiness.
-->
集群管理员以前没有明确且轻松访问的方式来查看 Pod 沙箱创建和初始化的完成情况。
从 1.28 版本开始，Pod 中的 `Initialized` 状况跟踪 Init 容器的执行情况。
然而，它在准确反映沙箱创建完成和容器准备启动的方面存在一些限制，无法适用于集群中的所有 Pod。
在多租户集群中，这种区别尤为重要，租户拥有包括 Init 容器集合在内的 Pod 规约，
而集群管理员管理存储插件、网络插件和容器运行时处理程序。
因此，需要改进这个机制，以便为集群管理员提供清晰和全面的 Pod 沙箱创建完成和容器就绪状态的视图。

<!--
## What's the benefit?

1. Improved Visibility: Cluster administrators gain a clearer and more comprehensive view of Pod sandbox
   creation completion and container readiness.
   This enhanced visibility allows them to make better-informed decisions and troubleshoot issues more effectively.
-->
## 这个特性有什么好处？

1. 改进可见性：集群管理员可以更清晰和全面地查看 Pod 沙箱的创建完成和容器的就绪状态。
   这种增强的可见性使他们能够做出更明智的决策，并更有效地解决问题。

<!--
2. Metric Collection and Monitoring: Monitoring services can leverage the fields associated with
   the `PodReadyToStartContainers` condition to report sandbox creation state and latency.
   Metrics can be collected at per-Pod cardinality or aggregated based on various
   properties of the Pod, such as `volumes`, `runtimeClassName`, custom annotations for CNI
   and IPAM plugins or arbitrary labels and annotations, and `storageClassName` of
   PersistentVolumeClaims.
   This enables comprehensive monitoring and analysis of Pod readiness across the cluster.
-->
2. 指标收集和监控：监控服务可以利用与 `PodReadyToStartContainers` 状况相关的字段来报告沙箱创建状态和延迟。
   可以按照每个 Pod 的基数进行指标收集，或者根据 Pod 的各种属性进行聚合，例如
   `volumes`、`runtimeClassName`、CNI 和 IPAM 插件的自定义注解，
   以及任意标签和注解，以及 PersistentVolumeClaims 的 `storageClassName`。
   这样可以全面监控和分析集群中 Pod 的就绪状态。

<!--
3. Enhanced Troubleshooting: With a more accurate representation of Pod sandbox creation and container readiness,
   cluster administrators can quickly identify and address any issues that may arise during the initialization process.
   This leads to improved troubleshooting capabilities and reduced downtime.
-->
3. 增强故障排查能力：通过更准确地表示 Pod 沙箱的创建和容器的就绪状态，
   集群管理员可以快速识别和解决初始化过程中可能出现的任何问题。
   这将提高故障排查能力，并减少停机时间。

<!--
### What’s next?

Due to feedback and adoption, the Kubernetes team promoted `PodReadyToStartContainersCondition` to Beta in 1.29. 
Your comments will help determine if this condition continues forward to get promoted to GA, 
so please submit additional feedback on this feature!
-->
### 后续事项

鉴于反馈和采用情况，Kubernetes 团队在 1.29 版本中将 `PodReadyToStartContainersCondition`
进阶至 Beta版。你的评论将有助于确定该状况是否继续并晋升至 GA，请针对此特性提交更多反馈！

<!--
### How can I learn more?

Please check out the
[documentation](/docs/concepts/workloads/pods/pod-lifecycle/) for the
`PodReadyToStartContainersCondition` to learn more about it and how it fits in relation to
other Pod conditions.
-->
### 如何了解更多？

请查看关于 `PodReadyToStartContainersCondition`
的[文档](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)，
以了解其更多信息及其与其他 Pod 状况的关系。

<!--
### How to get involved?

This feature is driven by the SIG Node community. Please join us to connect with
the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
-->
### 如何参与？

该特性由 SIG Node 社区推动。请加入我们，与社区建立联系，分享你对这一特性及更多内容的想法和反馈。
我们期待倾听你的建议！
