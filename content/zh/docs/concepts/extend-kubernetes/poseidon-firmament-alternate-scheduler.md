| title                        | content_type | weight |
| ---------------------------- | ------------ | ------ |
| Poseidon-Firmament Scheduler | concept      | 80     |

{{< feature-state for_k8s_version="v1.6" state="alpha" >}}

<!--

The Poseidon-Firmament scheduler is an alternate scheduler that can be deployed alongside the default Kubernetes scheduler.

-->

Poseidon-Firmament 调度程序是一个备用调度程序，可以与默认的 Kubernetes 调度程序一起部署。

<!--

## Introduction

Poseidon is a service that acts as the integration glue between the [Firmament scheduler](https://github.com/Huawei-PaaS/firmament) and Kubernetes. Poseidon-Firmament augments the current Kubernetes scheduling capabilities. It incorporates novel flow network graph based scheduling capabilities alongside the default Kubernetes scheduler. The Firmament scheduler models workloads and clusters as flow networks and runs min-cost flow optimizations over these networks to make scheduling decisions.

Firmament models the scheduling problem as a constraint-based optimization over a flow network graph. This is achieved by reducing scheduling to a min-cost max-flow optimization problem. The Poseidon-Firmament scheduler dynamically refines the workload placements.

Poseidon-Firmament scheduler runs alongside the default Kubernetes scheduler as an alternate scheduler. You can simultaneously run multiple, different schedulers.

Flow graph scheduling with the Poseidon-Firmament scheduler provides the following advantages:

- Workloads (Pods) are bulk scheduled to enable scheduling at massive scale.
  The Poseidon-Firmament scheduler outperforms the Kubernetes default scheduler by a wide margin when it comes to throughput performance for scenarios where compute resource requirements are somewhat uniform across your workload (Deployments, ReplicaSets, Jobs).
- The Poseidon-Firmament's scheduler's end-to-end throughput performance and bind time improves as the number of nodes in a cluster increases. As you scale out, Poseidon-Firmament scheduler is able to amortize more and more work across workloads.
- Scheduling in Poseidon-Firmament is dynamic; it keeps cluster resources in a global optimal state during every scheduling run.
- The Poseidon-Firmament scheduler supports scheduling complex rule constraints.

-->

## 介绍

Poseidon 是一个充当 [Firmament scheduler](https://github.com/Huawei-PaaS/firmament) 和 Kubernetes 之间集成粘合剂的服务。Poseidon-Firmament 增强了当前 Kubernetes 的调度功能，它结合了新颖的基于流网络图的调度功能以及默认的 Kubernetes 调度程序。Firmament 调度程序将工作负载和集群建模为流网络，并在这些网络上运行最小成本的流优化，以制定调度决策。

Firmament 将调度问题建模为流网络图上基于约束的优化，它通过将调度过程抽象成最低成本最大流优化问题来实现。Poseidon-Firmament 调度程序可动态优化工作负载的分配。

Poseidon-Firmament 调度程序作为备用调度程序与默认的 Kubernetes 调度程序一起运行，您可以同时运行多个不同的调度程序。

使用 Poseidon-Firmament 调度程序进行流调度具有以下优点：

- 工作负载（Pods）是批量调度的，以实现大规模调度。

  对于在整个工作负载（部署，副本集，作业）中计算资源需求在某种程度上是统一的场景，如吞吐性能，Poseidon-Firmament 调度程序的性能要远远优于 Kubernetes 默认调度程序。

- 随着集群中节点数量的增加，Poseidon-Firmament 的调度程序的端到端吞吐性能和绑定时间将得到改善。扩展时，Poseidon-Firmament 调度程序可以分摊越来越多的工作负载。

- Poseidon-Firmament 的调度是动态的；它将在每次调度运行期间将集群资源保持在全局最佳状态。

- Poseidon-Firmament 调度程序支持复杂规则约束的调度。

<!--

## How the Poseidon-Firmament scheduler works

Kubernetes supports [using multiple schedulers](https://github.com/kubernetes/website/blob/master/docs/tasks/administer-cluster/configure-multiple-schedulers). You can specify, for a particular Pod, that it is scheduled by a custom scheduler (“poseidon” for this case), by setting the `schedulerName` field in the PodSpec at the time of pod creation. The default scheduler will ignore that Pod and allow Poseidon-Firmament scheduler to schedule the Pod on a relevant node.

For example:

```
apiVersion: v1
kind: Pod
...
spec:
    schedulerName: poseidon
...
```

-->

## Poseidon-Firmament 调度程序如何工作

Kubernetes 支持 [使用多个调度程序](https://github.com/kubernetes/website/blob/master/docs/tasks/administer-cluster/configure-multiple-schedulers)。您可以通过在 Pod 创建时在 PodSpec 中设置 `schedulerName` 字段，为特定的 Pod 指定由自定义调度程序进行调度（在这种情况下为 ”poseidon“）。默认调度程序将忽略该 Pod，并允许 Poseidon-Firmament 调度程序在相关节点上调度 Pod。

例如：

```
apiVersion: v1
kind: Pod
...
spec:
    schedulerName: poseidon
...
```

<!--

## Batch scheduling

As mentioned earlier, Poseidon-Firmament scheduler enables an extremely high throughput scheduling environment at scale due to its bulk scheduling approach versus Kubernetes pod-at-a-time approach. In our extensive tests, we have observed substantial throughput benefits as long as resource requirements (CPU/Memory) for incoming Pods are uniform across jobs (Replicasets/Deployments/Jobs), mainly due to efficient amortization of work across jobs.

Although, Poseidon-Firmament scheduler is capable of scheduling various types of workloads, such as service, batch, etc., the following are a few use cases where it excels the most:

1. For “Big Data/AI” jobs consisting of large number of tasks, throughput benefits are tremendous.
2. Service or batch jobs where workload resource requirements are uniform across jobs (Replicasets/Deployments/Jobs).

-->

## 批量调度

如前所述，Poseidon-Firmament 调度程序由于具有批量调度方法而不是 Kubernetes 的一次性 Pod 方案，因此可以实现极高吞吐量的大规模调度环境。在我们广泛的测试中，我们观察到只要在各个作业（副本集/部署/作业）中传入 Pod 的资源需求（CPU/内存）是一致的，就可以显著提高吞吐量，这主要是由于各个作业之间的有效摊销。

尽管 Poseidon-Firmament 调度程序能够调度各种类型的工作负载，例如服务，批处理等，但以下是一些最能发挥其最大作用的用例：

1. 对于包含大量任务的“大数据/AI”作业，吞吐量收益是巨大的。
2. 服务或批处理作业，其中工作负载资源需求在各个作业之间是一致的（副本集/部署/作业）。

<!--

## Feature state

Poseidon-Firmament is designed to work with Kubernetes release 1.6 and all subsequent releases.

{{< caution >}} Poseidon-Firmament scheduler does not provide support for high availability; its implementation assumes that the scheduler cannot fail. {{< /caution >}}

-->

## 功能状态

Poseidon-Firmament 旨在与 Kubernetes 1.6版和所有后续版本一起使用。

{{< caution >}} Poseidon-Firmament 调度程序不提供对高可用性的支持；它的实现假定调度程序不会失败。 {{< /caution >}}

<!--

## Feature comparison {#feature-comparison-matrix}

{{< table caption="Feature comparison of Kubernetes and Poseidon-Firmament schedulers." >}}

| Feature                                                      | Kubernetes Default Scheduler | Poseidon-Firmament Scheduler | Notes                                                        |
| ------------------------------------------------------------ | ---------------------------- | ---------------------------- | ------------------------------------------------------------ |
| Node Affinity/Anti-Affinity                                  | Y                            | Y                            |                                                              |
| Pod Affinity/Anti-Affinity - including support for pod anti-affinity symmetry | Y                            | Y                            | The default scheduler outperforms the Poseidon-Firmament scheduler pod affinity/anti-affinity functionality. |
| Taints & Tolerations                                         | Y                            | Y                            |                                                              |
| Baseline Scheduling capability in accordance to available compute resources (CPU & Memory) on a node | Y                            | Y†                           | **†** Not all Predicates & Priorities are supported with Poseidon-Firmament. |
| Extreme Throughput at scale                                  | Y†                           | Y                            | **†** Bulk scheduling approach scales or increases workload placement. Firmament scheduler offers high throughput when resource requirements (CPU/Memory) for incoming Pods are uniform across ReplicaSets/Deployments/Jobs. |
| Colocation Interference Avoidance                            | N                            | N                            |                                                              |
| Priority Preemption                                          | Y                            | N†                           | **†** Partially exists in Poseidon-Firmament versus extensive support in Kubernetes default scheduler. |
| Inherent Rescheduling                                        | N                            | Y†                           | **†** Poseidon-Firmament scheduler supports workload re-scheduling. In each scheduling run, Poseidon-Firmament considers all Pods, including running Pods, and as a result can migrate or evict Pods – a globally optimal scheduling environment. |
| Gang Scheduling                                              | N                            | Y                            |                                                              |
| Support for Pre-bound Persistence Volume Scheduling          | Y                            | Y                            |                                                              |
| Support for Local Volume & Dynamic Persistence Volume Binding Scheduling | Y                            | N                            |                                                              |
| High Availability                                            | Y                            | N                            |                                                              |
| Real-time metrics based scheduling                           | N                            | Y†                           | **†** Partially supported in Poseidon-Firmament using Heapster (now deprecated) for placing Pods using actual cluster utilization statistics rather than reservations. |
| Support for Max-Pod per node                                 | Y                            | Y                            | Poseidon-Firmament scheduler seamlessly co-exists with Kubernetes default scheduler. |
| Support for Ephemeral Storage, in addition to CPU/Memory     | Y                            | Y                            |                                                              |
| {{< /table >}}                                               |                              |                              |                                                              |

-->

## 功能比较 {#feature-comparison-matrix}

{{< table caption="Feature comparison of Kubernetes and Poseidon-Firmament schedulers." >}}

| 功能                                                     | Kubernetes 默认调度程序 | Poseidon-Firmament 调度程序 | 注释                                                         |
| -------------------------------------------------------- | ----------------------- | --------------------------- | ------------------------------------------------------------ |
| 节点亲和性/非亲和性                                      | Y                       | Y                           |                                                              |
| Pod 亲和性/非亲和性      - 包括支持 pod 非亲和对称       | Y                       | Y                           | 默认调度程序的性能优于 Poseidon-Firmament 调度程序的 pod 亲和性/非亲和性功能。 |
| Taints & Tolerations                                     | Y                       | Y                           |                                                              |
| 根据节点上的可用计算资源（CPU 和内存）进行基线调度的功能 | Y                       | Y†                          | **†** Poseidon-Firmament 并不支持所有 Predicates & Priorities |
| 大规模吞吐量                                             | Y†                      | Y                           | **†** 批量调度方法可扩展或增加工作负载的分配。当传入 Pod 的资源需求（CPU /内存）在整个副本集 / 部署 / 作业中是一致的时，Firmment Scheduler 可提供高吞吐量。 |
| 主机托管干扰避免                                         | N                       | N                           |                                                              |
| 优先抢占                                                 | Y                       | N†                          | **†** Poseidon-Firmament 部分支持，而 Kubernetes 默认调度程序则提供了广泛的支持。 |
| 固有重调度                                               | N                       | Y†                          | **†** Poseidon-Firmament调度程序支持工作负载重新调度。在每次调度运行中，Poseidon-Firmament 都会考虑所有 Pod，包括正在运行的 Pod，因此可以迁移或清除 Pods（全局最佳调度环境）。 |
| Gang 调度                                                | N                       | Y                           |                                                              |
| 支持预绑定持久卷的调度                                   | Y                       | Y                           |                                                              |
| 支持本地卷和动态持久卷绑定调度                           | Y                       | N                           |                                                              |
| 高可用性                                                 | Y                       | N                           |                                                              |
| 基于实时指标的调度                                       | N                       | Y†                          | **†** 使用 Heapster（现已弃用）在 Poseidon-Firmament 中得到部分支持，以便使用实际群集利用率统计信息而不是保留来放置 Pod。 |
| 每个节点支持Max-Pod                                      | Y                       | Y                           | Poseidon-Firmament 调度程序与 Kubernetes 默认调度程序无缝共存。 |
| 除 CPU /内存外，还支持临时存储                           | Y                       | Y                           |                                                              |
| {{< /table >}}                                           |                         |                             |                                                              |

<!--

## Installation

The [Poseidon-Firmament installation guide](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/install/README.md#Installation) explains how to deploy Poseidon-Firmament to your cluster.

## Performance comparison

{{< note >}} Please refer to the [latest benchmark results](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/benchmark/README.md) for detailed throughput performance comparison test results between Poseidon-Firmament scheduler and the Kubernetes default scheduler. {{< /note >}}

Pod-by-pod schedulers, such as the Kubernetes default scheduler, process Pods in small batches (typically one at a time). These schedulers have the following crucial drawbacks:

1. The scheduler commits to a pod placement early and restricts the choices for other pods that wait to be placed.
2. There is limited opportunities for amortizing work across pods because they are considered for placement individually.

These downsides of pod-by-pod schedulers are addressed by batching or bulk scheduling in Poseidon-Firmament scheduler. Processing several pods in a batch allows the scheduler to jointly consider their placement, and thus to find the best trade-off for the whole batch instead of one pod. At the same time it amortizes work across pods resulting in much higher throughput.

## {{% heading "whatsnext" %}}

- See [Poseidon-Firmament](https://github.com/kubernetes-sigs/poseidon#readme) on GitHub for more information.
- See the [design document](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/design/README.md) for Poseidon.
- Read [Firmament: Fast, Centralized Cluster Scheduling at Scale](https://www.usenix.org/system/files/conference/osdi16/osdi16-gog.pdf), the academic paper on the Firmament scheduling design.
- If you'd like to contribute to Poseidon-Firmament, refer to the [developer setup instructions](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/devel/README.md).

-->

## 安装

[Poseidon-Firmament 安装指引](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/install/README.md#Installation) 介绍了如何将 Poseidon-Firmament 部署到您的群集。

## 性能对比

{{< note >}} 有关 Poseidon-Firmament 调度程序和 Kubernetes 默认调度程序之间的详细吞吐量性能比较测试结果，请参考最新的基准测试结果。{{< /note >}}

每个 Pod 的调度程序（例如 Kubernetes 默认调度程序）以小批量（通常一次）处理 Pod。这些调度程序具有以下关键缺陷：

1. 调度程序尽早提交 pod 安排，并限制其他等待安排的 pods 选择。
2. 在各个 pods 中摊销工作的机会有限，因为考虑将其单独安排。

逐个 Pod 调度程序的这些缺点可以通过 Poseidon-Firmament 调度程序中的批处理或批量调度来解决。批量处理多个 Pod，可使调度程序共同考虑其调度安排，从而找到整个批次而不是一个 Pod 的最佳折衷方案。同时，它还分摊了各个 Pod 的工作量，从而提高了吞吐量。

## {{% heading "whatsnext" %}}

- 更多信息，请在 GitHub 参考 [Poseidon-Firmament](https://github.com/kubernetes-sigs/poseidon#readme)。
- 参考 Poseidon 的[设计文档](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/design/README.md)。
- 阅读 Firmament 调度设计的学术论文 [Firmament: Fast, Centralized Cluster Scheduling at Scale](https://www.usenix.org/system/files/conference/osdi16/osdi16-gog.pdf)。
- 如果您想为 Poseidon-Firmament 做贡献，请前往 [开发人员安装指引](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/devel/README.md)。
