---
title: 运行多个调度器
content_type: concept
weight: 10
---
<!--
title: Running multiple schedulers
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
Kubernetes allows you to run multiple schedulers within a single cluster.

This page describes the general principles of running multiple schedulers in a cluster, assuming that at least one of these schedulers is the default `kube-scheduler`. If you are only running custom or third-party schedulers, refer to their specific documentation.
-->
Kubernetes 允许你在单个集群内运行多个调度器。

本页介绍在集群中运行多个调度器的总体原则，假设这些调度器中至少有一个是默认的
`kube-scheduler`。如果你只运行自定义或第三方调度器，请参阅它们各自的文档。

<!-- body -->

<!--
## Deployment strategies

When running multiple schedulers, you must decide how they interact with each other and the cluster's nodes. There are three common deployment scenarios:
-->
## 部署策略   {#deployment-strategies}

在运行多个调度器时，你必须确定它们彼此之间以及与集群节点之间如何交互。
有三种常见的部署场景：

<!--
### High availability (Standby replicas)

If you want to run a single logical scheduler (such as `kube-scheduler`) but ensure it remains available if a failure occurs, you should run multiple replicas of the scheduler and enable **leader election**.
-->
### 高可用性（待命副本）   {#high-availability-standby-replicas}

如果你想运行单个逻辑调度器（例如 `kube-scheduler`），但又要确保它发生故障时仍然可用，
你应该运行该调度器的多个副本并启用**领导者选举**。

<!--
When leader election is enabled, only one replica (the leader) is active and schedules Pods, while the others remain in standby mode. If the active leader fails, one of the standby replicas automatically wins the leader election and takes over the scheduling work.

For details on how to configure this, see [Enable leader election](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/#enable-leader-election).
-->
启用领导者选举后，只有一个副本（领导者）处于活跃状态并调度 Pod，其他副本则处于待命状态。
如果活跃的领导者发生故障，其中一个待命副本会自动赢得领导者选举并接管调度工作。

有关如何配置的详细信息，
请参阅[启用领导者选举](/zh-cn/docs/tasks/extend-kubernetes/configure-multiple-schedulers/#enable-leader-election)。

<!--
### Multiple scheduler profiles or instances

If you want to use different configurations or scheduling rules for different workloads, you can either configure a single `kube-scheduler` instance with multiple scheduling profiles, or run several separate instances of `kube-scheduler`.
-->
### 多个调度方案或实例   {#multiple-scheduler-profiles-or-instances}

如果你想针对不同的工作负载使用不同的配置或调度规则，
你可以配置单个 `kube-scheduler` 实例并使用多个调度方案，
也可以运行多个彼此独立的 `kube-scheduler` 实例。

<!--
* **Multiple profiles in one instance:** A single `kube-scheduler` process can run multiple profiles (each with a unique scheduler name). Because these profiles run in the same process and share the same scheduling queue and cache, they do not make conflicting scheduling decisions. You can still use [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity-per-scheduling-profile) if you want to isolate workloads by directing each profile to a specific node pool.
* **Multiple separate instances:** If you run several separate `kube-scheduler` processes (deployments), they do not coordinate with each other and might make conflicting scheduling decisions (such as overcommitting a node's resources). To prevent this, each scheduler instance must target a disjoint set of nodes using [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity-per-scheduling-profile).
-->
* **单个实例中的多个调度方案：** 单个 `kube-scheduler` 进程可以运行多个调度方案
  （每个方案都有唯一的调度器名称）。由于这些方案运行在同一进程中，
  且共享同一个调度队列和缓存，因此它们不会做出相互冲突的调度决策。
  如果你想通过将每个方案导向特定的节点池来隔离工作负载，
  仍然可以使用[节点亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity-per-scheduling-profile)。
* **多个独立的实例：** 如果你运行多个彼此独立的 `kube-scheduler` 进程（Deployment），
  它们之间不会相互协调，可能会做出相互冲突的调度决策（例如过度分配某个节点的资源）。为避免这种情况，
  每个调度器实例必须借助[节点亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity-per-scheduling-profile)指向一组互不相交的节点。

<!--
### Mixing kube-scheduler with custom schedulers

If you run `kube-scheduler` alongside custom or third-party schedulers, run the schedulers on disjoint pools of nodes to avoid resource conflicts. Depending on how your custom scheduler is designed, it might support running in an active-active configuration, or it might require its own leader election mechanism. Always check the documentation for your custom scheduler.
-->
### 将 kube-scheduler 与自定义调度器混用   {#mixing-kube-scheduler-with-custom-schedulers}

如果你将 `kube-scheduler` 与自定义或第三方调度器一起运行，
请在互不相交的节点池上运行这些调度器，以避免资源冲突。
取决于你的自定义调度器是如何设计的，它可能支持以双活（active-active）配置运行，
也可能需要自己的领导者选举机制。请务必查阅你的自定义调度器的文档。

## {{% heading "whatsnext" %}}

<!--
* Read about [Configuring Multiple Schedulers](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/).
* Learn about [Assigning Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/).
-->
* 阅读[配置多个调度器](/zh-cn/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)。
* 了解[将 Pod 指派到节点](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)。
