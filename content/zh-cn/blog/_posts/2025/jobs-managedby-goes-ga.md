---
layout: blog
title: "Kubernetes v1.35：Job Managed By 特性正式发布（GA）"
date: 2025-12-18T10:30:00-08:00
slug: kubernetes-v1-35-job-managedby-for-jobs-goes-ga
author: >
  [Dejan Zele Pejchev](https://github.com/dejanzele) (G-Research),
  [Michał Woźniak](https://github.com/mimowo) (Google)
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
layout: blog
title: "Kubernetes v1.35: Job Managed By Goes GA"
date: 2025-12-18T10:30:00-08:00
slug: kubernetes-v1-35-job-managedby-for-jobs-goes-ga
author: >
  [Dejan Zele Pejchev](https://github.com/dejanzele) (G-Research),
  [Michał Woźniak](https://github.com/mimowo) (Google)
-->
<!--
In Kubernetes v1.35, the ability to specify an external Job controller (through `.spec.managedBy`) graduates to General Availability.
-->
在 Kubernetes v1.35 中，通过 `.spec.managedBy` 指定外部 Job 控制器的能力升级为正式可用（GA）。

<!--
This feature allows external controllers to take full responsibility for Job reconciliation, unlocking powerful scheduling patterns like multi-cluster dispatching with [MultiKueue](https://kueue.sigs.k8s.io/docs/concepts/multikueue/).
-->
该特性允许外部控制器对 Job 的调谐（reconciliation）承担完全责任，从而解锁更强大的调度模式，
例如借助 [MultiKueue](https://kueue.sigs.k8s.io/docs/concepts/multikueue/) 进行跨多集群派发。

<!--
## Why delegate Job reconciliation?
-->
## 为何要委派 Job 调谐？   {#why-delegate-job-reconciliation}

<!--
The primary motivation for this feature is to support multi-cluster batch scheduling architectures, such as MultiKueue.
-->
该特性的主要动机是支持多集群批处理调度架构，例如 MultiKueue。

<!--
The MultiKueue architecture distinguishes between a Management Cluster and a pool of Worker Clusters:
-->
MultiKueue 架构区分“管理集群（Management Cluster）”与一组“工作集群（Worker Clusters）”：

<!--
- The Management Cluster is responsible for dispatching Jobs but not executing them. It needs to accept Job objects to track status, but it skips the creation and execution of Pods.
-->
- 管理集群负责派发 Job，但不负责执行。
  它需要接收 Job 对象以跟踪状态，但会跳过 Pod 的创建与执行。

<!--
- The Worker Clusters receive the dispatched Jobs and execute the actual Pods.
-->
- 工作集群接收被派发的 Job，并执行实际的 Pod。

<!--
- Users usually interact with the Management Cluster. Because the status is automatically propagated back, they can observe the Job's progress "live" without accessing the Worker Clusters.
-->
- 用户通常与管理集群交互。由于状态会自动回传，
  用户无需访问工作集群也能“实时”观察 Job 的进度。

<!--
- In the Worker Clusters, the dispatched Jobs run as regular Jobs managed by the built-in Job controller, with no `.spec.managedBy` set.
-->
- 在工作集群中，被派发的 Job 会作为常规 Job 运行，
  由内置 Job 控制器管理，且不会设置 `.spec.managedBy`。

<!--
By using `.spec.managedBy`, the MultiKueue controller on the Management Cluster can take over the reconciliation of a Job. It copies the status from the "mirror" Job running on the Worker Cluster back to the Management Cluster.
-->
通过使用 `.spec.managedBy`，管理集群上的 MultiKueue 控制器可以接管某个 Job 的调谐。
它会将工作集群中运行的“镜像（mirror）Job”的状态复制回管理集群。

<!--
Why not just disable the Job controller? While one could theoretically achieve this by disabling the built-in Job controller entirely, this is often impossible or impractical for two reasons:
-->
为什么不直接禁用 Job 控制器？理论上可以通过完全禁用内置 Job 控制器来实现，
但这通常不可行或不现实，原因主要有两点：

<!--
1. Managed Control Planes: In many cloud environments, the Kubernetes control plane is locked, and users cannot modify controller manager flags.
-->
1. 托管控制平面：在许多云环境中，Kubernetes 控制平面是锁定的，
   用户无法修改控制器管理器的参数。

<!--
2. Hybrid Cluster Role: Users often need a "hybrid" mode where the Management Cluster dispatches some heavy workloads to remote clusters but still executes smaller or control-plane-related Jobs in the Management Cluster. `.spec.managedBy` allows this granularity on a per-Job basis.
-->
2. 混合集群角色：用户常常需要一种“混合”模式：
   管理集群将部分重型工作负载派发到远端集群，
   但仍在管理集群中执行较小的、或与控制平面相关的 Job。
   `.spec.managedBy` 让这种粒度可以按 Job 逐个控制。

<!--
## How `.spec.managedBy` works
-->
## `.spec.managedBy` 的工作机制   {#how-specmanagedby-works}

<!--
The `.spec.managedBy` field indicates which controller is responsible for the Job, specifically there are two modes of operation:
-->
`.spec.managedBy` 字段用于指示由哪个控制器负责该 Job。
具体而言，它有两种工作模式：

<!--
- **Standard**: if unset or set to the reserved value `kubernetes.io/job-controller`, the built-in Job controller reconciles the Job as usual (standard behavior).
-->
- **标准（Standard）**：如果未设置，或设置为保留值 `kubernetes.io/job-controller`，
  内置 Job 控制器会像往常一样调谐该 Job（标准行为）。

<!--
- **Delegation**: If set to any other value, the built-in Job controller skips reconciliation entirely for that Job.
-->
- **委派（Delegation）**：如果设置为任何其他值，内置 Job 控制器将完全跳过对该 Job 的调谐。

<!--
To prevent orphaned Pods or resource leaks, this field is immutable. You cannot transfer a running Job from one controller to another.
-->
为防止出现孤儿 Pod 或资源泄漏，该字段是不可变的（immutable）。
你不能将一个正在运行的 Job 从一个控制器转移到另一个控制器。

<!--
If you are looking into implementing an external controller, be aware that your controller needs to be conformant with the definitions for the [Job API](/docs/reference/kubernetes-api/workload-resources/job-v1/).
-->
如果你计划实现一个外部控制器，请注意你的控制器需要符合
[Job API](/zh-cn/docs/reference/kubernetes-api/workload-resources/job-v1/)
的定义。

<!--
In order to enforce the conformance, a significant part of the effort was to introduce the extensive Job status validation rules.
-->
为确保这种一致性，这项工作的一个重要部分是引入了一套**完善且严格的 Job 状态校验规则**。

<!--
Navigate to the [How can you learn more?](#how-can-you-learn-more) section for more details.
-->
更多细节请参阅[如何进一步了解？](#how-can-you-learn-more)一节。

<!--
## Ecosystem Adoption
-->
## 生态采纳情况   {#ecosystem-adoption}

<!--
The `.spec.managedBy` field is rapidly becoming the standard interface for delegating control in the Kubernetes batch ecosystem.
-->
`.spec.managedBy` 字段正在快速成为 Kubernetes 批处理生态中委派控制的标准接口。

<!--
Various custom workload controllers are adding this field (or an equivalent) to allow MultiKueue to take over their reconciliation and orchestrate them across clusters:
-->
多种自定义工作负载控制器正在加入该字段（或等效字段），
以便让 MultiKueue 接管它们的调谐并在多集群之间进行编排：

- [JobSet](https://github.com/kubernetes-sigs/jobset)
- [Kubeflow Trainer](https://www.kubeflow.org/docs/components/training/)
- [KubeRay](https://docs.ray.io/en/latest/cluster/kubernetes/)
- [AppWrapper](https://project-codeflare.github.io/appwrapper/)
- [Tekton Pipelines](https://tekton.dev/docs/)

<!--
While it is possible to use `.spec.managedBy` to implement a custom Job controller from scratch, we haven't observed that yet. The feature is specifically designed to support delegation patterns, like MultiKueue, without reinventing the wheel.
-->
虽然理论上可以用 `.spec.managedBy` 从零实现一个自定义 Job 控制器，
但我们尚未观察到这种用法。该特性更明确地面向委派模式（例如 MultiKueue）而设计，
以避免重复造轮子。

<!--
## How can you learn more?
-->
## 如何进一步了解？   {#how-can-you-learn-more}

<!--
If you want to dig deeper:
-->
如果你想进一步深入了解：

<!--
Read the user-facing documentation for:
-->
阅读面向用户的文档：

<!--
- [Jobs](/docs/concepts/workloads/controllers/job/),
-->
- [Job](/zh-cn/docs/concepts/workloads/controllers/job/)

<!--
- [Delegation of managing a Job object to an external controller](/docs/concepts/workloads/controllers/job/#delegation-of-managing-a-job-object-to-external-controller), and
-->
- [将 Job 对象的管理委派给外部控制器](/zh-cn/docs/concepts/workloads/controllers/job/#delegation-of-managing-a-job-object-to-external-controller)
<!--
- [MultiKueue](https://kueue.sigs.k8s.io/docs/concepts/multikueue/).
-->
- [MultiKueue](https://kueue.sigs.k8s.io/docs/concepts/multikueue/)

<!--
Deep dive into the design history:
-->
深入了解设计历程：

<!--
- The Kubernetes Enhancement Proposal (KEP) [Job's managed-by mechanism](https://github.com/kubernetes/enhancements/issues/4368) including introduction of the extensive [Job status validation rules](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/4368-support-managed-by-for-batch-jobs#job-status-validation).
-->
- Kubernetes 增强提案（KEP）[Job's managed-by mechanism](https://github.com/kubernetes/enhancements/issues/4368)，
  其中包括引入了更全面的 [Job status validation rules](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/4368-support-managed-by-for-batch-jobs#job-status-validation)。

<!--
- The Kueue KEP for [MultiKueue](https://github.com/kubernetes-sigs/kueue/tree/main/keps/693-multikueue).
-->
- Kueue 的 KEP：[MultiKueue](https://github.com/kubernetes-sigs/kueue/tree/main/keps/693-multikueue)。

<!--
Explore how MultiKueue uses `.spec.managedBy` in practice in the task guide for [running Jobs across clusters](https://kueue.sigs.k8s.io/docs/tasks/run/multikueue/job/).
-->
也可以通过任务指南了解 MultiKueue 在实践中如何使用 `.spec.managedBy`：
[跨集群运行 Job](https://kueue.sigs.k8s.io/docs/tasks/run/multikueue/job/)。

<!--
## Acknowledgments
-->
## 致谢   {#acknowledgments}

<!--
As with any Kubernetes feature, a lot of people helped shape this one through design discussions, reviews, test runs,
and bug reports.
-->
与任何 Kubernetes 特性一样，这项特性也由许多人一起塑造：
他们参与设计讨论、评审、试运行与缺陷报告等工作。

<!--
We would like to thank, in particular:
-->
我们特别感谢：

<!--
* [Maciej Szulik](https://github.com/soltysh) - for guidance, mentorship, and reviews.
-->
* [Maciej Szulik](https://github.com/soltysh)——提供指导、辅导与评审。

<!--
* [Filip Křepinský](https://github.com/atiratree) - for guidance, mentorship, and reviews.
-->
* [Filip Křepinský](https://github.com/atiratree)——提供指导、辅导与评审。

<!--
## Get involved
-->
## 参与其中   {#get-involved}

<!--
This work was sponsored by the Kubernetes
[Batch Working Group](https://github.com/kubernetes/community/tree/master/wg-batch)
in close collaboration with the
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps),
and with strong input from the
[SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) community.
-->
这项工作由 Kubernetes 的 [Batch Working Group](https://github.com/kubernetes/community/tree/master/wg-batch) 发起，
并与 [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) 紧密协作，
同时也得到了 [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling)
社区的强力支持与投入。

<!--
If you are interested in batch scheduling, multi-cluster solutions, or further improving the Job API:
-->
如果你对批处理调度、多集群解决方案或进一步改进 Job API 感兴趣：

<!--
- Join us in the Batch WG and SIG Apps meetings.
-->
- 欢迎加入 Batch WG 与 SIG Apps 会议。

<!--
- Subscribe to the [WG Batch Slack channel](https://kubernetes.slack.com/messages/wg-batch).
-->
- 订阅 [WG Batch Slack 频道](https://kubernetes.slack.com/messages/wg-batch)。
