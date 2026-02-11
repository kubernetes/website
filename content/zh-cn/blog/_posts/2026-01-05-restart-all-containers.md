---
layout: blog
title: "Kubernetes v1.35: 通过就地重启 Pod 实现更高的效率"
date: 2026-01-05T10:30:00-08:00
slug: kubernetes-v1-35-restart-all-containers
author: >
  [Yuan Wang](https://github.com/yuanwang04)
  [Giuseppe Tinti Tomio](https://github.com/GiuseppeTT)
  [Sergey Kanzhelev](https://github.com/SergeyKanzhelev)
translator: >
  [Xin Li](https://github.com/my-git9)
---

<!--
layout: blog
title: "Kubernetes v1.35: New level of efficiency with in-place Pod restart"
date: 2026-01-05T10:30:00-08:00
slug: kubernetes-v1-35-restart-all-containers
author: >
  [Yuan Wang](https://github.com/yuanwang04)
  [Giuseppe Tinti Tomio](https://github.com/GiuseppeTT)
  [Sergey Kanzhelev](https://github.com/SergeyKanzhelev)
translator: >
  [Xin Li](https://github.com/my-git9)
-->

<!--
The release of Kubernetes 1.35 introduces a powerful new feature that provides a much-requested capability: the ability to trigger a full, in-place restart of the Pod. This feature, *Restart All Containers* (alpha in 1.35), allows for an efficient way to reset a Pod's state compared to resource-intensive approach of deleting and recreating the entire Pod. This feature is especially useful for AI/ML workloads allowing application developers to concentrate on their core training logic while offloading complex failure-handling and recovery mechanisms to sidecars and declarative Kubernetes configuration. With `RestartAllContainers` and other planned enhancements, Kubernetes continues to add building blocks for creating the most flexible, robust, and efficient platforms for AI/ML workloads.

This new functionality is available by enabling the `RestartAllContainersOnContainerExits` feature gate. This alpha feature extends the [*Container Restart Rules* feature](/docs/concepts/workloads/pods/pod-lifecycle/#container-restart-rules), which graduated to beta in Kubernetes 1.35.
-->
Kubernetes 1.35 版本引入了一项强大的新特性，满足了用户对 Pod 就地重启的迫切需求。
这项名为“重启所有容器”（Restart All Containers，1.35 版本为 Alpha 版）的特性，
相比于资源用量较高的删除并重建整个 Pod 的方式，能够更高效地重置 Pod 的状态。
该特性对于 AI/ML 工作负载尤为实用，使应用程序开发人员能够专注于核心训练逻辑，
同时将复杂的故障处理和恢复机制交给边车容器和声明式 Kubernetes 配置来处理。
凭借 `RestartAllContainers` 和其他计划中的增强特性，
Kubernetes 将继续构建更灵活、更健壮、更高效的 AI/ML 工作负载平台。

启用 `RestartAllContainersOnContainerExits` 特性门控即可使用此新特性。
此 Alpha 特性扩展了[**容器重启规则**特性](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-restart-rules)，
该特性在 Kubernetes 1.35 中升级为 Beta 版。

<!--
## The problem: when a single container restart isn't enough and recreating pods is too costly

Kubernetes has long supported restart policies at the Pod level (`restartPolicy`) and, more recently, at the [individual container level](/blog/2025/08/29/kubernetes-v1-34-per-container-restart-policy/). These policies are great for handling crashes in a single, isolated process. However, many modern applications have more complex inter-container dependencies. For instance:
-->
## 问题：当单个容器重启不足以解决问题，而重新创建 Pod 成本过高时

Kubernetes 长期以来一直支持 Pod 级别的重启策略（`restartPolicy`），
最近也支持[单个容器级别的重启策略](/blog/2025/08/29/kubernetes-v1-34-per-container-restart-policy/)。
这些策略非常适合处理单个独立进程中的崩溃。然而，许多现代应用程序具有更复杂的容器间依赖关系。例如：

<!--
- An **init container** prepares the environment by mounting a volume or generating a configuration file. If the main application container corrupts this environment, simply restarting that one container is not enough. The entire initialization process needs to run again.
- A **watcher sidecar** monitors system health. If it detects an unrecoverable but retriable error state, it must trigger a restart of the main application container from a clean slate.
- A **sidecar** that manages a remote resource fails. Even if the sidecar restarts on its own, the main container may be stuck trying to access an outdated or broken connection.
-->
- **初始化容器**通过挂载卷或生成配置文件来准备环境。如果主应用程序容器损坏了此环境，
  仅仅重启该容器是不够的，需要重新运行整个初始化过程。
- **监视边车**监控系统健康状况。如果它检测到不可恢复但可重试的错误状态，则必须触发主应用程序容器从头开始重启。
- 管理远程资源的**边车**发生故障。即使边车自行重启，主容器也可能因为尝试访问过时或损坏的连接而卡住。

<!--
In all these cases, the desired action is not to restart a single container, but all of them. Previously, the only way to achieve this was to delete the Pod and have a controller (like a Job or ReplicaSet) create a new one. This process is slow and expensive, involving the scheduler, node resource allocation and re-initialization of networking and storage.

This inefficiency becomes even worse when handling large-scale AI/ML workloads (>= 1,000 Nodes with one Pod per Node). A common requirement for these synchronous workloads is that when a failure occurs (such as a Node crash), all Pods in the fleet must be recreated to reset the state before training can resume, even if all the other Pods were not directly affected by the failure. Deleting, creating and scheduling thousands of Pods simultaneously creates a massive bottleneck. The estimated overhead of this failure could cost [$100,000 per month in wasted resources](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.qwqcnzf96avw).
-->
在所有这些情况下，我们期望的操作并非重启单个容器，而是重启所有容器。
此前，实现此目的的唯一方法是删除 Pod，然后由控制器（例如 Job 或 ReplicaSet）创建一个新的 Pod。
这个过程缓慢且成本高昂，涉及调度器、节点资源分配以及网络和存储的重新初始化。

在处理大规模 AI/ML 工作负载（≥ 1000 个节点，每个节点一个 Pod）时，这种低效性会更加严重。
这些同步工作负载的一个常见要求是，当发生故障（例如节点崩溃）时，
必须重新创建集群中的所有 Pod 以重置状态，然后才能恢复训练，
即使其他 Pod 并未直接受到故障的影响。
同时删除、创建和调度数千个 Pod 会造成巨大的瓶颈。
此次故障造成的损失估计每月可能高达 10 万美元（资源浪费）。

<!--
Handling these failures for AI/ML training jobs requires a complex integration touching both the training framework and Kubernetes, which are often fragile and toilsome. This feature introduces a Kubernetes-native solution, improving system robustness and allowing application developers to concentrate on their core training logic.

Another major benefit of restarting Pods in place is that keeping Pods on their assigned Nodes allows for further optimizations. For example, one can implement node-level caching tied to a specific Pod identity, something that is impossible when Pods are unnecessarily being recreated on different Nodes.
-->
处理 AI/ML 训练任务的这些故障需要复杂的集成，涉及训练框架和 Kubernetes，
而这两者通常都很脆弱且繁琐。
此特性引入了一种 Kubernetes 原生解决方案，
提高了系统健壮性，并使应用程序开发人员能够专注于其核心训练逻辑。

就地重启 Pod 的另一个主要优势在于，将 Pod 保留在其分配的节点上可以进行进一步的优化。
例如，可以实现与特定 Pod 标识绑定的节点级缓存，
而当 Pod 不必要地在不同的节点上重新创建时，这种优化方式是无法实现的。

<!--
## Introducing the `RestartAllContainers` action

To address this, Kubernetes v1.35 adds a new action to the container restart rules: `RestartAllContainers`. When a container exits in a way that matches a rule with this action, the kubelet initiates a fast, **in-place** restart of the Pod.
-->
## 引入 `RestartAllContainers` 操作

为了解决这个问题，Kubernetes v1.35 在容器重启规则中添加了一个新的操作：`RestartAllContainers`。
当容器以符合此操作规则的方式退出时，kubelet 会启动对 Pod 的快速**就地**重启。

<!--
This in-place restart is highly efficient because it preserves the Pod's most important resources:
- The Pod's UID, IP address and network namespace.
- The Pod's sandbox and any attached devices.
- All volumes, including `emptyDir` and mounted volumes from PVCs.
-->
这种就地重启非常高效，因为它保留了 Pod 最重要的资源：
- Pod 的 UID、IP 地址和网络命名空间。
- Pod 的沙箱及其所有连接的设备。
- 所有卷，包括 `emptyDir` 和从 PVC 挂载的卷。

<!--
After terminating all running containers, the Pod's startup sequence is re-executed from the very beginning. This means all **init containers** are run again in order, followed by the sidecar and regular containers, ensuring a completely fresh start in a known-good environment. With the exception of ephemeral containers (which are terminated), all other containers—including those that previously succeeded or failed—will be restarted, regardless of their individual restart policies.
-->
终止所有正在运行的容器后，Pod 的启动序列将从头开始重新执行。
这意味着所有**初始化容器**将按顺序再次运行，随后是边车容器和常规容器，
从而确保在已知良好的环境中完全重新启动。
除了临时容器（会被终止）之外，所有其他容器——包括之前成功或失败的容器——都将重新启动，
而不管它们各自的重启策略如何。

<!--
## Use cases

### 1. Efficient restarts for ML/Batch jobs

For ML training jobs, [rescheduling a worker Pod on failure](/blog/2025/07/03/navigating-failures-in-pods-with-devices/#roadmap-for-failure-modes-container-code-failed) is a costly operation that wastes valuable compute resources. On a 1,000-node training cluster, rescheduling overhead can waste [over $100,000 in compute resources monthly](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.qwqcnzf96avw).
-->
## 应用案例

### 1. 高效重启机器学习/批处理作业

对于机器学习训练作业，
[在工作节点 Pod 发生故障时重新调度](/blog/2025/07/03/navigating-failures-in-pods-with-devices/#roadmap-for-failure-modes-container-code-failed)是一项代价高昂的操作，
会浪费宝贵的计算资源。
在一个拥有 1000 个节点的训练集群中，
重新调度带来的开销每月可能会浪费[超过 10 万美元的计算资源](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.qwqcnzf96avw)。

<!--
With `RestartAllContainers` actions you can address this by enabling a much faster, hybrid recovery strategy: recreate only the "bad" Pods (e.g., those on unhealthy Nodes) while triggering `RestartAllContainers` for the remaining healthy Pods. Benchmarks show this reduces the recovery overhead [from minutes to a few seconds](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.cwkee8kar0i5).

With in-place restarts, a watcher sidecar can monitor the main training process. If it encounters a specific, retriable error, the watcher can exit with a designated code to trigger a fast reset of the worker Pod, allowing it to restart from the last checkpoint without involving the Job controller. This capability is now natively supported by Kubernetes.

Read more details about future development and JobSet features at [KEP-467 JobSet in-place restart](https://github.com/kubernetes-sigs/jobset/issues/467).
-->
借助 `RestartAllContainers` 操作，你可以启用一种速度更快、混合的恢复策略来解决这个问题：
仅重新创建“故障”Pod（例如，位于不健康节点上的 Pod），同时对其余健康的 Pod
触发 `RestartAllContainers` 操作。基准测试表明，这可以将恢复开销从几分钟降低到几秒钟。

通过就地重启，监视器边车可以监控主训练过程。如果遇到特定的可重试错误，
监视器可以退出并返回指定的代码，从而触发工作 Pod 的快速重置，
使其能够从上一个检查点重新启动，而无需 Job 控制器的参与。Kubernetes 现在原生支持此特性。

有关未来开发和 JobSet 特性的更多详细信息，请参阅
[KEP-467 JobSet 就地重启](https://github.com/kubernetes-sigs/jobset/issues/467)。

<!--
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ml-worker-pod
spec:
  restartPolicy: Never
  initContainers:
  # This init container will re-run on every in-place restart
  - name: setup-environment
    image: my-repo/setup-worker:1.0
  - name: watcher-sidecar
    image: my-repo/watcher:1.0
    restartPolicy: Always
    restartPolicyRules:
    - action: RestartAllContainers
      onExit:
        exitCodes:
          operator: In
          # A specific exit code from the watcher triggers a full pod restart
          values: [88]
  containers:
  - name: main-application
    image: my-repo/training-app:1.0
```
-->
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ml-worker-pod
spec:
  restartPolicy: Never
  initContainers:
  # 此初始化容器将在每次就地重启时重新运行。
  - name: setup-environment
    image: my-repo/setup-worker:1.0
  - name: watcher-sidecar
    image: my-repo/watcher:1.0
    restartPolicy: Always
    restartPolicyRules:
    - action: RestartAllContainers
      onExit:
        exitCodes:
          operator: In
          # 监视器返回特定退出代码会触发 Pod 完全重启。
          values: [88]
  containers:
  - name: main-application
    image: my-repo/training-app:1.0
```

<!--
### 2. Re-running init containers for a clean state

Imagine a scenario where an init container is responsible for fetching credentials or setting up a shared volume. If the main application fails in a way that corrupts this shared state, you need the [init container to rerun](https://github.com/kubernetes/enhancements/issues/3676).

By configuring the main application to exit with a specific code upon detecting such a corruption, you can trigger the `RestartAllContainers` action, guaranteeing that the init container provides a clean setup before the application restarts.
-->
### 2. 重新运行初始化容器以确保干净状态

设想这样一种场景：初始化容器负责获取凭据或设置共享卷。
如果主应用程序发生故障，导致共享状态损坏，则需要重新运行初始化容器。

通过配置主应用程序在检测到此类损坏时以特定代码退出，你可以触发 `RestartAllContainers`
操作，从而确保初始化容器在应用程序重启之前提供一个干净的设置。

<!--
### 3. Handling high rate of similar tasks execution

There are cases when tasks are best represented as a Pod execution. And each task requires a clean execution. The task may be a game session backend or some queue item processing. If the rate of tasks is high, running the whole cycle of Pod creation, scheduling and initialization is simply too expensive, especially when tasks can be short. The ability to restart all containers from scratch enables a Kubernetes-native way to handle this scenario without custom solutions or frameworks. 
-->
### 3. 处理高频率的类似任务执行

有些情况下，任务最好以 Pod 执行的形式呈现。每个任务都需要干净利落地执行。例如，游戏会话后端或队列项处理。
如果任务频率很高，运行完整的 Pod 创建、调度和初始化流程会非常耗费资源，
尤其是在任务执行时间可能很短的情况下。
Kubernetes 原生支持从头开始重启所有容器，无需自定义解决方案或框架即可处理这种情况。

<!--
## How to use it

To try this feature, you must enable the `RestartAllContainersOnContainerExits` feature gate on your Kubernetes cluster components (API server and kubelet) running Kubernetes v1.35+. This alpha feature extends the `ContainerRestartRules` feature, which graduated to beta in v1.35 and is enabled by default.

Once enabled, you can add `restartPolicyRules` to any container (init, sidecar, or regular) and use the `RestartAllContainers` action.
-->
## 使用方法

要试用此特性，你必须在运行 Kubernetes v1.35 或更高版本的 Kubernetes
集群组件（API 服务器和 kubelet）上启用 `RestartAllContainersOnContainerExits` 特性门控。
此 Alpha 特性扩展了 `ContainerRestartRules` 特性，后者已在 v1.35 版本中升级为 beta 版，并默认启用。

启用后，你可以将 `restartPolicyRules` 添加到任何容器（Init、边车或常规容器），
并使用 `RestartAllContainers` 操作。

<!--
The feature is designed to be easily usable on existing apps. However, if an application does not follow some best practices, it may cause issues for the application or for observability tooling. When enabling the feature, make sure that all containers are reentrant and that external tooling is prepared for init containers to re-run. Also, when restarting all containers, the kubelet does not run `preStop` hooks. This means containers must be designed to handle abrupt termination without relying on `preStop` hooks for graceful shutdown. 
-->
该特性旨在方便现有应用程序使用。但是，如果应用程序不遵循某些最佳实践，
则可能会导致应用程序本身或可观测性工具出现问题。
启用此特性时，请确保所有容器都是可重入的，并且外部工具已准备好用于重新启动初始化容器。
此外，重启所有容器时，kubelet 不会运行 `preStop` 钩子。
这意味着容器必须设计为能够处理突然终止的情况，而无需依赖 `preStop` 钩子来实现优雅关闭。

<!--
## Observing the restart

To make this process observable, a new Pod condition, `AllContainersRestarting`, is added to the Pod's status. When a restart is triggered, this condition becomes `True` and it reverts to `False` once all containers have terminated and the Pod is ready to start its lifecycle anew. This provides a clear signal to users and other cluster components about the Pod's state.

All containers restarted by this action will have their restart count incremented in the container status.
-->
## 观察重启

为了使重启过程可观察，Pod 的状态中添加了一个新的条件 `AllContainersRestarting`。
当触发重启时，此条件变为 `True`；当所有容器终止且 Pod 准备好重新开始其生命周期时，
此条件变为 `False`。这为用户和其他集群组件提供了关于 Pod 状态的清晰信号。

所有通过此操作重启的容器，其容器状态中的重启计数都会递增。

<!--
## Learn more

- Read the official documentation on [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers).
- Read the detailed proposal in the [KEP-5532: Restart All Containers on Container Exits](https://kep.k8s.io/5532).
- Read the proposal for JobSet in-place restart in [JobSet issue #467](https://github.com/kubernetes-sigs/jobset/issues/467).
-->
## 了解更多

- 阅读 [Pod 生命周期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers)的官方文档。
- 阅读 [KEP-5532：容器退出时重启所有容器](https://kep.k8s.io/5532)中的详细提案。
- 阅读 [JobSet issue #467](https://github.com/kubernetes-sigs/jobset/issues/467)
  中关于 JobSet 就地重启的提案。

<!--
## We want your feedback!

As an alpha feature, `RestartAllContainers` is ready for you to experiment with and any use cases and feedback are welcome. This feature is driven by the [SIG Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md) community. If you are interested in getting involved, sharing your thoughts, or contributing, please join us!
-->
## 我们期待你的反馈！

作为一项 Alpha 特性，`RestartAllContainers` 现已开放试用，
欢迎你提出任何使用案例和反馈意见。
此特性由 [SIG Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md) 社区驱动。
如果你有兴趣参与、分享想法或做出贡献，请加入我们！

<!--
You can reach SIG Node through:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
-->
你可以通过以下方式联系 SIG Node：

- Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
