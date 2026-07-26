---
layout: blog
title: "JobSet 介绍"
date: 2025-03-23
slug: introducing-jobset
author: >
  Daniel Vega-Myhre (Google),
  Abdullah Gharaibeh (Google),
  Kevin Hannon (Red Hat)
translator: >
  Xin Li (DaoCloud)
---
<!--
layout: blog
title: "Introducing JobSet"
date: 2025-03-23
slug: introducing-jobset

**Authors**: Daniel Vega-Myhre (Google), Abdullah Gharaibeh (Google), Kevin Hannon (Red Hat)
-->

<!--
In this article, we introduce [JobSet](https://jobset.sigs.k8s.io/), an open source API for
representing distributed jobs. The goal of JobSet is to provide a unified API for distributed ML
training and HPC workloads on Kubernetes.
-->
在本文中，我们介绍 [JobSet](https://jobset.sigs.k8s.io/)，这是一个用于表示分布式任务的开源 API。
JobSet 的目标是为 Kubernetes 上的分布式机器学习训练和高性能计算（HPC）工作负载提供统一的 API。

<!--
## Why JobSet?

The Kubernetes community’s recent enhancements to the batch ecosystem on Kubernetes has attracted ML
engineers who have found it to be a natural fit for the requirements of running distributed training
workloads. 

Large ML models (particularly LLMs) which cannot fit into the memory of the GPU or TPU chips on a
single host are often distributed across tens of thousands of accelerator chips, which in turn may
span thousands of hosts.
-->
## 为什么需要 JobSet？   {#why-jobset}

Kubernetes 社区近期对 Kubernetes 批处理生态系统的增强，吸引了许多机器学习工程师，
他们发现这非常符合运行分布式训练工作负载的需求。

单个主机上的 GPU 或 TPU 芯片通常无法满足大型机器学习模型（尤其是大语言模型，LLM）的内存需求，
因此往往会被分布到成千上万的加速器芯片上，而这些芯片可能跨越数千个主机。

<!--
As such, the model training code is often containerized and executed simultaneously on all these
hosts, performing distributed computations which often shard both the model parameters and/or the
training dataset across the target accelerator chips, using communication collective primitives like
all-gather and all-reduce to perform distributed computations and synchronize gradients between
hosts. 

These workload characteristics make Kubernetes a great fit for this type of workload, as efficiently
scheduling and managing the lifecycle of containerized applications across a cluster of compute
resources is an area where it shines. 
-->
因此，模型训练代码通常会被容器化，并在所有这些主机上同时执行，进行分布式计算。
这些计算通常会将模型参数和/或训练数据集拆分到目标加速器芯片上，并使用如
all-gather 和 all-reduce 等通信集合原语来进行分布式计算以及在主机之间同步梯度。

这些工作负载的特性使得 Kubernetes 非常适合此类任务，
因为高效地调度和管理跨计算资源集群的容器化应用生命周期是 Kubernetes 的强项。

<!--
It is also very extensible, allowing developers to define their own Kubernetes APIs, objects, and
controllers which manage the behavior and life cycle of these objects, allowing engineers to develop
custom distributed training orchestration solutions to fit their needs.

However, as distributed ML training techniques continue to evolve, existing Kubernetes primitives do
not adequately model them alone anymore.
-->
Kubernetes 还具有很强的可扩展性，允许开发者定义自己的 Kubernetes API、
对象以及管理这些对象行为和生命周期的控制器，
从而让工程师能够开发定制化的分布式训练编排解决方案以满足特定需求。

然而，随着分布式机器学习训练技术的不断发展，现有的 Kubernetes
原语已经无法单独充分描述这些新技术。

<!--
Furthermore, the landscape of Kubernetes distributed training orchestration APIs has become
fragmented, and each of the existing solutions in this fragmented landscape has certain limitations
that make it non-optimal for distributed ML training. 

For example, the KubeFlow training operator defines custom APIs for different frameworks (e.g.
PyTorchJob, TFJob, MPIJob, etc.); however, each of these job types are in fact a solution fit
specifically to the target framework, each with different semantics and behavior.
-->
此外，Kubernetes 分布式训练编排 API 的领域已经变得支离破碎，
而这个碎片化的领域中每个现有的解决方案都存在某些限制，
使得它们在分布式机器学习训练方面并非最优选择。

例如，KubeFlow 训练 Operator 为不同的框架定义了自定义 API（例如 PyTorchJob、TFJob、MPIJob 等）。
然而，这些作业类型实际上分别是针对特定框架量身定制的解决方案，各自具有不同的语义和行为。

<!--
On the other hand, the Job API fixed many gaps for running batch workloads, including Indexed
completion mode, higher scalability, Pod failure policies and Pod backoff policy to mention a few of
the most recent enhancements. However, running ML training and HPC workloads using the upstream Job
API requires extra orchestration to fill the following gaps:

Multi-template Pods : Most HPC or ML training jobs include more than one type of Pods. The different
Pods are part of the same workload, but they need to run a different container, request different
resources or have different failure policies. A common example is the driver-worker pattern.
-->
另一方面，Job API 弥补了运行批处理工作负载的许多空白，包括带索引的完成模式（Indexed Completion Mode）、
更高的可扩展性、Pod 失效策略和 Pod 回退策略等，这些都是最近的一些重要增强功能。然而，使用上游
Job API 运行机器学习训练和高性能计算（HPC）工作负载时，需要额外的编排来填补以下空白：

- 多模板 Pod：大多数 HPC 或机器学习训练任务包含多种类型的 Pod。这些不同的 Pod 属于同一工作负载，
  但它们需要运行不同的容器、请求不同的资源或具有不同的失效策略。
  一个常见的例子是驱动器-工作节点（driver-worker）模式。

<!--
Job groups : Large scale training workloads span multiple network topologies, running across
multiple racks for example. Such workloads are network latency sensitive, and aim to localize
communication and minimize traffic crossing the higher-latency network links. To facilitate this,
the workload needs to be split into groups of Pods each assigned to a network topology.

Inter-Pod communication : Create and manage the resources (e.g. [headless
Services](/docs/concepts/services-networking/service/#headless-services)) necessary to establish
communication between the Pods of a job.
-->
- 任务组：大规模训练工作负载跨越多个网络拓扑，例如在多个机架之间运行。
  这类工作负载对网络延迟非常敏感，目标是将通信本地化并尽量减少跨越高延迟网络链路的流量。
  为此，需要将工作负载拆分为 Pod 组，每组分配到一个网络拓扑。

- Pod 间通信：创建和管理建立作业中 Pod 之间通信所需的资源
  （例如[无头服务](/zh-cn/docs/concepts/services-networking/service/#headless-services)）。

<!--
Startup sequencing : Some jobs require a specific start sequence of pods; sometimes the driver is
expected to start first (like Ray or Spark), in other cases the workers are expected to be ready
before starting the driver (like MPI).

JobSet aims to address those gaps using the Job API as a building block to build a richer API for
large-scale distributed HPC and ML use cases.
-->
- 启动顺序：某些任务需要特定的 Pod 启动顺序；有时需要驱动（driver）首先启动（例如 Ray 或 Spark），
  而有时，人们期望多个工作节点（worker）在驱动启动之前就绪（例如 MPI）。

JobSet 旨在以 Job API 为基础，填补这些空白，构建一个更丰富的 API，
以支持大规模分布式 HPC 和 ML 使用场景。

<!--
## How JobSet Works
JobSet models a distributed batch workload as a group of Kubernetes Jobs. This allows a user to
easily specify different pod templates for different distinct groups of pods (e.g. a leader,
workers, parameter servers, etc.). 

It uses the abstraction of a ReplicatedJob to manage child Jobs, where a ReplicatedJob is
essentially a Job Template with some desired number of Job replicas specified. This provides a
declarative way to easily create identical child-jobs to run on different islands of accelerators,
without resorting to scripting or Helm charts to generate many versions of the same job but with
different names.
-->
## JobSet 的工作原理   {#how-jobset-works}

JobSet 将分布式批处理工作负载建模为一组 Kubernetes Job。
这使得用户可以轻松为不同的 Pod 组（例如领导者 Pod、工作节点 Pod、参数服务器 Pod 等）
指定不同的 Pod 模板。

它通过抽象概念 ReplicatedJob 来管理子 Job，其中 ReplicatedJob 本质上是一个带有指定副本数量的
Job 模板。这种方式提供了一种声明式的手段，能够轻松创建相同的子 Job，使其在不同的加速器集群上运行，
而无需借助脚本或 Helm Chart 来生成具有不同名称的多个相同任务版本。

<!--
{{< figure src="jobset_diagram.svg" alt="JobSet Architecture" class="diagram-large" clicktozoom="true" >}}

Some other key JobSet features which address the problems described above include:

Replicated Jobs : In modern data centers, hardware accelerators like GPUs and TPUs allocated in
islands of homogenous accelerators connected via a specialized, high bandwidth network links. For
example, a user might provision nodes containing a group of hosts co-located on a rack, each with
H100 GPUs, where GPU chips within each host are connected via NVLink, with a NVLink Switch
connecting the multiple NVLinks. TPU Pods are another example of this: TPU ViperLitePods consist of
64 hosts, each with 4 TPU v5e chips attached, all connected via ICI mesh. When running a distributed
training job across multiple of these islands, we often want to partition the workload into a group
of smaller identical jobs, 1 per island, where each pod primarily communicates with the pods within
the same island to do segments of distributed computation, and keeping the gradient synchronization
over DCN (data center network, which is lower bandwidth than ICI) to a bare minimum. 
-->
{{< figure src="jobset_diagram.svg" alt="JobSet 架构" class="diagram-large" clicktozoom="true" >}}

解决上述问题的其他一些关键 JobSet 特性包括：

- **任务副本（Replicated Jobs）**：在现代数据中心中，硬件加速器（如 GPU 和 TPU）通常以同质加速器岛的形式分配，
  并通过专用的高带宽网络链路连接。例如，用户可能会配置包含一组主机的节点，这些主机位于同一机架内，
  每个主机都配备了 H100 GPU，主机内的 GPU 芯片通过 NVLink 连接，并通过 NVLink 交换机连接多个 NVLink。
  TPU Pod 是另一个例子：TPU ViperLitePods 包含 64 个主机，每个主机连接了 4 个 TPU v5e 芯片，
  所有芯片通过 ICI 网格连接。在跨多个这样的加速器岛运行分布式训练任务时，我们通常希望将工作负载划分为一组较小的相同任务，
  每个岛一个任务，其中每个 Pod 主要与同一岛内的其他 Pod 通信以完成分布式计算的部分段，
  并将梯度同步通过数据中心网络（DCN，其带宽低于 ICI）降到最低。

<!--
Automatic headless service creation, configuration, and lifecycle management : Pod-to-pod
communication via pod hostname is enabled by default, with automatic configuration and lifecycle
management of the headless service enabling this. 

Configurable success policies : JobSet has configurable success policies which target specific
ReplicatedJobs, with operators to target “Any” or “All” of their child jobs. For example, you can
configure the JobSet to be marked complete if and only if all pods that are part of the “worker”
ReplicatedJob are completed.
-->
- **自动创建、配置无头服务并管理其生命周期**：默认情况下，启用通过 Pod 主机名来完成
  Pod 到 Pod 的通信，并通过无头服务的自动配置和生命周期管理来支持这一功能。

- **可配置的成功策略**：JobSet 提供了可配置的成功策略，这些策略针对特定的 ReplicatedJob，
  并可通过操作符指定 "Any" 或 "All" 子任务。例如，你可以将 JobSet 配置为仅在属于 "worker"
  ReplicatedJob 的所有 Pod 完成时才标记为完成。

<!--
Configurable failure policies : JobSet has configurable failure policies which allow the user to
specify a maximum number of times the JobSet should be restarted in the event of a failure. If any
job is marked failed, the entire JobSet will be recreated, allowing the workload to resume from the
last checkpoint. When no failure policy is specified, if any job fails, the JobSet simply fails. 
-->
- **可配置的失效策略**：JobSet 提供了可配置的失效策略，允许用户指定在发生故障时
  JobSet 应重启的最大次数。如果任何任务被标记为失败，整个 JobSet 将会被重新创建，
  从而使工作负载可以从最后一个检查点恢复。当未指定失效策略时，如果任何任务失败，
  JobSet 会直接标记为失败。

<!--
Exclusive placement per topology domain : JobSet allows users to express that child jobs have 1:1
exclusive assignment to a topology domain, typically an accelerator island like a rack. For example,
if the JobSet creates two child jobs, then this feature will enforce that the pods of each child job
will be co-located on the same island, and that only one child job is allowed to schedule per
island. This is useful for scenarios where we want to use a distributed data parallel (DDP) training
strategy to train a model using multiple islands of compute resources (GPU racks or TPU slices),
running 1 model replica in each accelerator island, ensuring the forward and backward passes
themselves occur within a single model replica occurs over the high bandwidth interconnect linking
the accelerators chips within the island, and only the gradient synchronization between model
replicas occurs across accelerator islands over the lower bandwidth data center network.
-->
- **按拓扑域的独占放置**：JobSet 允许用户指定子任务与拓扑域（通常是加速器岛，例如机架）
  之间的一对一独占分配关系。例如，如果 JobSet 创建了两个子任务，
  此功能将确保每个子任务的 Pod 位于同一个加速器岛内，并且每个岛只允许调度一个子任务。
  这在我们希望使用分布式数据并行（DDP）训练策略的情况下非常有用，
  例如利用多个计算资源岛（GPU 机架或 TPU 切片）训练模型，在每个加速器岛内运行一个模型副本，
  确保前向和反向传播过程通过岛内加速器芯片之间的高带宽互联完成，
  而模型副本之间的梯度同步则通过低带宽的数据中心网络在加速器岛之间进行。

<!--
Integration with Kueue : Users can submit JobSets via [Kueue](https://kueue.sigs.k8s.io/) to
oversubscribe their clusters, queue workloads to run as capacity becomes available, prevent partial
scheduling and deadlocks, enable multi-tenancy, and more.
-->
- **与 Kueue 集成**：用户可以通过 [Kueue](https://kueue.sigs.k8s.io/)
  提交 JobSet，以实现集群的超额订阅、将工作负载排队等待容量可用时运行、
  防止部分调度和死锁、支持多租户等更多功能。

<!--
## Example use case

### Distributed ML training on multiple TPU slices with Jax

The following example is a JobSet spec for running a TPU Multislice workload on 4 TPU v5e
[slices](https://cloud.google.com/tpu/docs/system-architecture-tpu-vm#slices). To learn more about
TPU concepts and terminology, please refer to these
[docs](https://cloud.google.com/tpu/docs/system-architecture-tpu-vm).
-->
## 示例用例   {#example-use-case}

### 使用 Jax 在多个 TPU 切片上进行分布式 ML 训练

以下示例展示了一个 JobSet 规范，用于在 4 个 TPU v5e
[切片](https://cloud.google.com/tpu/docs/system-architecture-tpu-vm#slices)上运行
TPU 多切片工作负载。若想了解更多关于 TPU 的概念和术语，
请参考这些[文档](https://cloud.google.com/tpu/docs/system-architecture-tpu-vm)。

<!--
This example uses [Jax](https://jax.readthedocs.io/en/latest/quickstart.html), an ML framework with
native support for Just-In-Time (JIT) compilation targeting TPU chips via
[OpenXLA](https://github.com/openxla). However, you can also use
[PyTorch/XLA](https://pytorch.org/xla/release/2.3/index.html) to do ML training on TPUs.

This example makes use of several JobSet features (both explicitly and implicitly) to support the
unique scheduling requirements of TPU multislice training out-of-the-box with very little
configuration required by the user.
-->
此示例使用了 [Jax](https://jax.readthedocs.io/en/latest/quickstart.html)，
这是一个通过 [OpenXLA](https://github.com/openxla) 提供对 TPU 芯片即时（JIT）
编译原生支持的机器学习框架。不过，你也可以使用 [PyTorch/XLA](https://pytorch.org/xla/release/2.3/index.html)
在 TPUs 上进行机器学习训练。

此示例利用了 JobSet 的多个功能（无论是显式还是隐式），以开箱即用地支持 TPU
多切片训练的独特调度需求，而用户需要的配置非常少。

<!--
```yaml
# Run a simple Jax workload on 
apiVersion: jobset.x-k8s.io/v1alpha2
kind: JobSet
metadata:
  name: multislice
  annotations:
    # Give each child Job exclusive usage of a TPU slice 
    alpha.jobset.sigs.k8s.io/exclusive-topology: cloud.google.com/gke-nodepool
spec:
  failurePolicy:
    maxRestarts: 3
  replicatedJobs:
  - name: workers
    replicas: 4 # Set to number of TPU slices
    template:
      spec:
        parallelism: 2 # Set to number of VMs per TPU slice
        completions: 2 # Set to number of VMs per TPU slice
        backoffLimit: 0
        template:
          spec:
            hostNetwork: true
            dnsPolicy: ClusterFirstWithHostNet
            nodeSelector:
              cloud.google.com/gke-tpu-accelerator: tpu-v5-lite-podslice
              cloud.google.com/gke-tpu-topology: 2x4
            containers:
            - name: jax-tpu
              image: python:3.8
              ports:
              - containerPort: 8471
              - containerPort: 8080
              securityContext:
                privileged: true
              command:
              - bash
              - -c
              - |
                pip install "jax[tpu]" -f https://storage.googleapis.com/jax-releases/libtpu_releases.html
                python -c 'import jax; print("Global device count:", jax.device_count())'
                sleep 60
              resources:
                limits:
                  google.com/tpu: 4
```
-->
```yaml
# 运行简单的 Jax 工作负载
apiVersion: jobset.x-k8s.io/v1alpha2
kind: JobSet
metadata:
  name: multislice
  annotations:
    # 为每个子任务提供 TPU 切片的独占使用权
    alpha.jobset.sigs.k8s.io/exclusive-topology: cloud.google.com/gke-nodepool
spec:
  failurePolicy:
    maxRestarts: 3
  replicatedJobs:
  - name: workers
    replicas: 4 # 设置为 TPU 切片的数量
    template:
      spec:
        parallelism: 2 # 设置为每个 TPU 切片的虚拟机数量
        completions: 2 # 设置为每个 TPU 切片的虚拟机数量
        backoffLimit: 0
        template:
          spec:
            hostNetwork: true
            dnsPolicy: ClusterFirstWithHostNet
            nodeSelector:
              cloud.google.com/gke-tpu-accelerator: tpu-v5-lite-podslice
              cloud.google.com/gke-tpu-topology: 2x4
            containers:
            - name: jax-tpu
              image: python:3.8
              ports:
              - containerPort: 8471
              - containerPort: 8080
              securityContext:
                privileged: true
              command:
              - bash
              - -c
              - |
                pip install "jax[tpu]" -f https://storage.googleapis.com/jax-releases/libtpu_releases.html
                python -c 'import jax; print("Global device count:", jax.device_count())'
                sleep 60
              resources:
                limits:
                  google.com/tpu: 4
```

<!--
## Future work and getting involved
We have a number of features on the JobSet roadmap planned for development this year, which can be
found in the [JobSet roadmap](https://github.com/kubernetes-sigs/jobset?tab=readme-ov-file#roadmap).

Please feel free to reach out with feedback of any kind. We’re also open to additional contributors,
whether it is to fix or report bugs, or help add new features or write documentation. 
-->
## 未来工作与参与方式   {#furture-work-and-getting-involved}

我们今年的 JobSet 路线图中计划开发多项功能，具体内容可以在
[JobSet 路线图](https://github.com/kubernetes-sigs/jobset?tab=readme-ov-file#roadmap)中找到。

欢迎你随时提供任何形式的反馈。我们也欢迎更多贡献者加入，无论是修复或报告问题、
帮助添加新功能，还是撰写文档，都非常欢迎。

<!--
You can get in touch with us via our [repo](http://sigs.k8s.io/jobset), [mailing
list](https://groups.google.com/a/kubernetes.io/g/wg-batch) or on
[Slack](https://kubernetes.slack.com/messages/wg-batch).

Last but not least, thanks to all [our
contributors](https://github.com/kubernetes-sigs/jobset/graphs/contributors) who made this project
possible!
-->
你可以通过我们的[代码仓库](http://sigs.k8s.io/jobset)、
[邮件列表](https://groups.google.com/a/kubernetes.io/g/wg-batch)或者在
[Slack](https://kubernetes.slack.com/messages/wg-batch) 上与我们联系。

最后但同样重要的是，感谢所有[贡献者](https://github.com/kubernetes-sigs/jobset/graphs/contributors)，
是你们让这个项目成为可能！
