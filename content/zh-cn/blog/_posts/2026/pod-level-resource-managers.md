---
layout: blog
title: "Kubernetes v1.36：Pod 级资源管理器（Alpha）"
date: 2026-05-01T10:35:00-08:00
slug: kubernetes-v1-36-feature-pod-level-resource-managers-alpha
author: Kevin Torres Martinez (Google)
translator: >
  [Paco Xu](https://github.com/pacoxu)(DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.36: Pod-Level Resource Managers (Alpha)"
date: 2026-05-01T10:35:00-08:00
slug: kubernetes-v1-36-feature-pod-level-resource-managers-alpha
author: Kevin Torres Martinez (Google)
-->

<!--
Kubernetes v1.36 introduces
[Pod-Level Resource Managers](/docs/concepts/workloads/resource-managers/#pod-level-resource-managers)
as an alpha feature, bringing a more flexible and powerful resource management
model to performance-sensitive workloads. This enhancement extends the kubelet's
Topology, CPU, and Memory Managers to support pod-level resource specifications
(`.spec.resources`), evolving them from a strictly per-container allocation
model to a pod-centric one.
-->
Kubernetes v1.36 将
[Pod 级资源管理器](/docs/concepts/workloads/resource-managers/#pod-level-resource-managers)
作为 Alpha 特性引入，为对性能敏感的工作负载带来了一种更灵活、更强大的资源管理模型。
这一增强将 kubelet 的拓扑管理器（Topology Manager）、CPU 管理器和内存管理器扩展为支持 Pod 级别资源规约
（`.spec.resources`），使它们从严格按容器分配的模型演进为以 Pod 为中心的模型。

<!--
## Why do we need pod-level resource managers?
-->
## 为什么需要 Pod 级资源管理器？

<!--
When running performance-critical workloads such as machine learning (ML)
training, high-frequency trading applications, or low-latency databases, you
often need exclusive, NUMA-aligned resources for your primary application
containers to ensure predictable performance.
-->
当运行机器学习（ML）训练、高频交易应用或低延迟数据库这类对性能要求严苛的工作负载时，
你通常需要为主要应用容器分配独占且经过 NUMA 对齐的资源，以确保性能可预测。

<!--
However, modern Kubernetes pods rarely consist of just one container. They
frequently include sidecar containers for logging, monitoring, service meshes,
or data ingestion.
-->
不过，现代 Kubernetes Pod 很少只包含一个容器。
它们通常还会包含用于日志、监控、服务网格或数据摄取的边车容器。

<!--
Before this feature, this created a trade-off, to get NUMA-aligned, exclusive
resources for your main application, you had to allocate exclusive,
integer-based CPU resources to *every* container in the pod. This might be
wasteful for lightweight sidecars. If you didn't do this, you forfeited the
pod's Guaranteed Quality of Service (QoS) class entirely, losing the performance
benefits.
-->
在这一特性出现之前，这会带来一种取舍：为了让主应用获得 NUMA 对齐的独占资源，
你必须为 Pod 中的**每一个**容器都分配基于整数的独占 CPU 资源。
这对于轻量级边车来说可能是一种浪费。
如果不这样做，你就会完全失去该 Pod 的 Guaranteed 服务质量（QoS）类，
同时失去相应的性能收益。

<!--
## Introducing pod-level resource managers
-->
## 引入 Pod 级资源管理器

<!--
Enabling pod-level resources support for the resource managers (via the
`PodLevelResourceManagers` and `PodLevelResources` feature gates) allows the
kubelet to create **hybrid resource allocation models**. This brings flexibility
and efficiency to high-performance workloads without sacrificing NUMA alignment.
-->
为资源管理器启用 Pod 级别资源支持（通过 `PodLevelResourceManagers` 和
`PodLevelResources` 特性门控）后，kubelet 就能够创建**混合资源分配模型**。
这为高性能工作负载带来了灵活性和效率，同时又不牺牲 NUMA 对齐。

<!--
### Real-world use cases
-->
### 真实世界中的用例

<!--
Here are a few practical scenarios demonstrating how this feature can be
applied, depending on the configured Topology Manager scope:
-->
下面通过几个实际场景说明，在不同的拓扑管理器作用域下，这一特性可以如何应用：

<!--
#### 1. Tightly-coupled database (Topology manager's pod scope)
-->
#### 1. 紧密耦合的数据库（拓扑管理器的 `pod` 作用域）

<!--
Consider a latency-sensitive database pod that includes a main database
container, a local metrics exporter, and a backup agent sidecar.
-->
假设有一个对延迟敏感的数据库 Pod，其中包含一个主数据库容器、一个本地指标导出器，
以及一个备份代理边车容器。

<!--
When configured with the `pod` Topology Manager scope, the kubelet performs a
single NUMA alignment based on the entire pod's budget. The database container
gets its exclusive CPU and memory slices from that NUMA node. The remaining
resources from the pod's budget form a new **pod shared pool**. The metrics
exporter and backup agent run in this pod shared pool. They share resources with
each other, but they are strictly isolated from the database's exclusive slices
and the rest of the node.
-->
当配置为拓扑管理器的 `pod` 作用域时，kubelet 会基于整个 Pod 的资源预算执行一次统一的 NUMA 对齐。
数据库容器会从该 NUMA 节点获得自己的独占 CPU 和内存切片。
Pod 预算中的剩余资源会形成一个新的 **Pod 共享池**。
指标导出器和备份代理运行在这个 Pod 共享池中。
它们彼此共享资源，但会与数据库的独占切片以及节点其余部分严格隔离。

<!--
This allows you to safely co-locate auxiliary containers on the same NUMA node
as your primary workload without wasting dedicated cores on them.
-->
这样一来，你就可以安全地将辅助容器与主工作负载放置在同一个 NUMA 节点上，
同时又不必为这些辅助容器浪费专用核心。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: tightly-coupled-database
spec:
  # Pod 级别资源定义整体预算和 NUMA 对齐规模。
  resources:
    requests:
      cpu: "8"
      memory: "16Gi"
    limits:
      cpu: "8"
      memory: "16Gi"
  initContainers:
  - name: metrics-exporter
    image: metrics-exporter:v1
    restartPolicy: Always
  - name: backup-agent
    image: backup-agent:v1
    restartPolicy: Always
  containers:
  - name: database
    image: database:v1
    # 这个 Guaranteed 容器从 Pod 预算中获得独占的 6 个 CPU 切片。
    # 剩余的 2 个 CPU 和 4Gi 内存会构成供边车使用的 Pod 共享池。
    resources:
      requests:
        cpu: "6"
        memory: "12Gi"
      limits:
        cpu: "6"
        memory: "12Gi"
```

<!--
#### 2. ML workload with infrastructure sidecars (Topology manager's container scope)
-->
#### 2. 带基础设施边车的 ML 工作负载（拓扑管理器的 `container` 作用域）

<!--
Imagine a pod running a GPU-accelerated ML training workload alongside a generic
service mesh sidecar.
-->
设想一个 Pod 运行着 GPU 加速的 ML 训练工作负载，同时还带有一个通用的服务网格边车。

<!--
Under the `container` Topology Manager scope, the kubelet evaluates each
container individually. You can grant the ML container exclusive, NUMA-aligned
CPUs and Memory for maximum performance. Meanwhile, the service mesh sidecar
doesn't need to be NUMA-aligned; it can run in the general node-wide shared
pool. The collective resource consumption is still safely bounded by the overall
pod limits, but you only allocate NUMA-aligned, exclusive resources to the
specific containers that actually require them.
-->
在拓扑管理器的 `container` 作用域下，kubelet 会逐个评估每个容器。
你可以为 ML 容器分配独占且经过 NUMA 对齐的 CPU 和内存，以获得最佳性能。
与此同时，服务网格边车并不需要进行 NUMA 对齐；它可以运行在节点范围内的通用共享池中。
总体资源消耗仍会安全地受整个 Pod 的限制值约束，但你只需要把 NUMA 对齐的独占资源分配给那些真正需要它们的特定容器。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ml-workload
spec:
  # Pod 级别资源定义整体预算约束。
  resources:
    requests:
      cpu: "4"
      memory: "8Gi"
    limits:
      cpu: "4"
      memory: "8Gi"
  initContainers:
  - name: service-mesh-sidecar
    image: service-mesh:v1
    restartPolicy: Always
  containers:
  - name: ml-training
    image: ml-training:v1
    # 在 `container` 作用域下，这个 Guaranteed 容器会获得独占且经过 NUMA 对齐的资源，
    # 而边车则运行在节点的共享池中。
    resources:
      requests:
        cpu: "3"
        memory: "6Gi"
      limits:
        cpu: "3"
        memory: "6Gi"
```

<!--
### CPU quotas (CFS) and isolation
-->
### CPU 配额（CFS）与隔离

<!--
When running these mixed workloads within a pod, isolation is enforced
differently depending on the allocation:
-->
当在一个 Pod 内运行这些混合工作负载时，隔离机制会根据分配方式的不同而有所区别：

<!--
*   **Exclusive containers:** Containers granted exclusive CPU slices have their
    CPU CFS quota enforcement disabled at the container level, allowing them to
    run without being throttled by the Linux scheduler.
*   **Pod shared pool containers:** Containers falling into the pod shared pool
    have CPU CFS quotas enforced at the pod level, ensuring they do not consume
    more than the leftover pod budget.
-->
* **独占容器：** 获得独占 CPU 切片的容器会在容器级别禁用 CPU CFS 配额限制，
  这样它们运行时就不会被 Linux 调度器限流。
* **Pod 共享池容器：** 落入 Pod 共享池的容器会在 Pod 级别应用 CPU CFS 配额限制，
  以确保它们不会消耗超过 Pod 剩余预算的资源。

<!--
## How to enable Pod-Level Resource Managers
-->
## 如何启用 Pod 级资源管理器

<!--
Using this feature requires Kubernetes v1.36 or newer. To enable it, you must
configure the kubelet with the appropriate feature gates and policies:
-->
使用这一特性需要 Kubernetes v1.36 或更高版本。
要启用它，你必须为 kubelet 配置相应的特性门控和策略：

<!--
1.  Enable the `PodLevelResources` and `PodLevelResourceManagers`
    [feature gates](/docs/reference/command-line-tools-reference/feature-gates/).
2.  Configure the
    [Topology Manager](/docs/tasks/administer-cluster/topology-manager/#topology-manager-policies)
    with a policy other than `none` (i.e., `best-effort`, `restricted`, or
    `single-numa-node`).
3.  Set the
    [Topology Manager scope](/docs/tasks/administer-cluster/topology-manager/#topology-manager-scopes)
    to either `pod` or `container` using the `topologyManagerScope` field in the
    [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).
4.  Configure the
    [CPU Manager](/docs/tasks/administer-cluster/cpu-management-policies/) with
    the `static` policy.
5.  Configure the
    [Memory Manager](/docs/tasks/administer-cluster/memory-manager/) with the
    `Static` policy.
-->
1. 启用 `PodLevelResources` 和 `PodLevelResourceManagers`
   [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
2. 将
   [拓扑管理器](/zh-cn/docs/tasks/administer-cluster/topology-manager/#topology-manager-policies)
   配置为 `none` 之外的策略（即 `best-effort`、`restricted` 或 `single-numa-node`）。
3. 在 [`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
   中使用 `topologyManagerScope` 字段，将
   [拓扑管理器作用域](/zh-cn/docs/tasks/administer-cluster/topology-manager/#topology-manager-scopes)
   设置为 `pod` 或 `container`。
4. 将
   [CPU 管理器](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)
   配置为 `static` 策略。
5. 将
   [内存管理器](/zh-cn/docs/tasks/administer-cluster/memory-manager/)
   配置为 `Static` 策略。

<!--
## Observability
-->
## 可观测性

<!--
To help cluster administrators monitor and debug these new allocation models, we
have introduced several new kubelet metrics when the feature gate is enabled:
-->
为了帮助集群管理员监控并调试这些新的分配模型，我们在启用该特性门控时引入了几个新的 kubelet 指标：

<!--
*   `resource_manager_allocations_total`: Counts the total number of exclusive
    resource allocations performed by a manager. The `source` label ("pod" or
    "node") distinguishes between allocations drawn from the node-level pool
    versus a pre-allocated pod-level pool.
*   `resource_manager_allocation_errors_total`: Counts errors encountered during
    exclusive resource allocation, distinguished by the intended allocation
    `source` ("pod" or "node").
*   `resource_manager_container_assignments`: Tracks the cumulative number of
    containers running with specific assignment types. The `assignment_type`
    label ("node_exclusive", "pod_exclusive", "pod_shared") provides visibility
    into how workloads are distributed.
-->
* `resource_manager_allocations_total`：统计某个管理器执行独占资源分配的总次数。
  `source` 标签（"pod" 或 "node"）用于区分分配来源于节点级资源池，
  还是来源于预先分配的 Pod 级资源池。
* `resource_manager_allocation_errors_total`：统计独占资源分配过程中出现的错误次数，
  并通过目标分配 `source`（"pod" 或 "node"）进行区分。
* `resource_manager_container_assignments`：跟踪以特定分配类型运行的容器累计数量。
  `assignment_type` 标签（"node_exclusive"、"pod_exclusive"、"pod_shared"）
  让你能够看到工作负载是如何分布的。

<!--
## Current limitations and caveats
-->
## 当前的限制与注意事项

<!--
While this feature opens up new possibilities, there are a few things to keep in
mind during its alpha phase. Be sure to review the
[Limitations and caveats](/docs/concepts/workloads/resource-managers/#limitations-and-caveats)
in the official documentation for full details on compatibility, requirements,
and downgrade instructions.
-->
虽然这一特性带来了新的可能性，但在其 Alpha 阶段仍有几点需要留意。
有关兼容性、要求以及降级说明的完整细节，请务必查阅官方文档中的
[限制与注意事项](/docs/concepts/workloads/resource-managers/#limitations-and-caveats)。

<!--
## Getting started and providing feedback
-->
## 开始使用并提供反馈

<!--
For a deep dive into the technical details and configuration of this feature,
check out the official concept documentation:
-->
若要深入了解这一特性的技术细节和配置方式，请参阅官方概念文档：

<!--
*   [Pod-level resource managers](/docs/concepts/workloads/resource-managers/#pod-level-resource-managers)
-->
* [Pod 级资源管理器](/docs/concepts/workloads/resource-managers/#pod-level-resource-managers)

<!--
To learn more about the overall pod-level resources feature and how to assign
resources to pods, see:
-->
若要进一步了解 Pod 级别资源特性的整体情况，以及如何为 Pod 分配资源，请参阅：

<!--
*   [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
-->
* [分配 Pod 级别 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)

<!--
As this feature moves through Alpha, your feedback is invaluable. Please report
any issues or share your experiences via the standard Kubernetes communication
channels:
-->
随着这一特性在 Alpha 阶段持续演进，你的反馈尤为宝贵。
欢迎通过 Kubernetes 的标准沟通渠道报告问题或分享你的使用经验：

<!--
*   Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
*   [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
*   [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
-->
* Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
* [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
* [开放的社区 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnode)
