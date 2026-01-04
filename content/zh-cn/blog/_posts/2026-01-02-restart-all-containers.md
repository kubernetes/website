---
layout: blog
title: "Kubernetes v1.35：原地 Pod 重启带来全新的效率提升"
date: 2026-01-02T10:30:00-08:00
slug: kubernetes-v1-35-restart-all-containers
author: >
  [Yuan Wang](https://github.com/yuanwang04)
  [Giuseppe Tinti Tomio](https://github.com/GiuseppeTT)
  [Sergey Kanzhelev](https://github.com/SergeyKanzhelev)
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
layout: blog
title: "Kubernetes v1.35: New level of efficiency with in-place Pod restart"
date: 2026-01-02T10:30:00-08:00
slug: kubernetes-v1-35-restart-all-containers
author: >
  [Yuan Wang](https://github.com/yuanwang04)
  [Giuseppe Tinti Tomio](https://github.com/GiuseppeTT)
  [Sergey Kanzhelev](https://github.com/SergeyKanzhelev)
-->
<!--
The release of Kubernetes 1.35 introduces a powerful new feature that provides a much-requested capability: the ability to trigger a full, in-place restart of the Pod. This feature, *Restart All Containers* (alpha in 1.35), allows for an efficient way to reset a Pod's state compared to resource-intensive approach of deleting and recreating the entire Pod. This feature is especially useful for AI/ML workloads allowing application developers to concentrate on their core training logic while offloading complex failure-handling and recovery mechanisms to sidecars and declarative Kubernetes configuration. With `RestartAllContainers` and other planned enhancements, Kubernetes continues to add building blocks for creating the most flexible, robust, and efficient platforms for AI/ML workloads.
-->
Kubernetes 1.35 的发布带来了一项强大的新特性，实现了长期呼声很高的一项能力：**触发 Pod 的完整原地重启**。
该特性名为 *Restart All Containers*（在 1.35 中为 Alpha），
相比“删除并重建整个 Pod”这种资源消耗更高的方式，它提供了一种更高效的手段来重置 Pod 状态。
这一特性对 AI/ML 工作负载尤其有用：
应用开发者可以把复杂的故障处理与恢复机制交给边车（sidecar）以及声明式的 Kubernetes 配置，从而更专注于核心训练逻辑。
随着 `RestartAllContainers` 以及其他计划中的增强持续推进，
Kubernetes 也在不断为构建最灵活、最健壮、最高效的 AI/ML 平台补齐积木。

<!--
This new functionality is available by enabling the `RestartAllContainersOnContainerExits` feature gate. This alpha feature extends the [*Container Restart Rules* feature](/docs/concepts/workloads/pods/pod-lifecycle/#container-restart-rules), which graduated to beta in Kubernetes 1.35.
-->
该功能需要启用 `RestartAllContainersOnContainerExits` 特性门控才可使用。
这个 Alpha 特性扩展了 [*容器重启规则（Container Restart Rules）*](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-restart-rules)
能力；后者在 Kubernetes 1.35 中已晋升为 Beta。

<!--
## The problem: when a single container restart isn't enough and recreating pods is too costly
-->
## 问题：仅重启单个容器不够用，而重建 Pod 又代价过高

<!--
Kubernetes has long supported restart policies at the Pod level (`restartPolicy`) and, more recently, at the [individual container level](/blog/2025/08/29/kubernetes-v1-34-per-container-restart-policy/). These policies are great for handling crashes in a single, isolated process. However, many modern applications have more complex inter-container dependencies. For instance:
-->
Kubernetes 长期以来支持 Pod 级别的重启策略（`restartPolicy`），并且近期也支持了[容器级别的重启策略](/zh-cn/blog/2025/08/29/kubernetes-v1-34-per-container-restart-policy/)。
这些策略很适合处理“单个、隔离进程”的崩溃问题；但许多现代应用的容器间依赖更复杂。例如：

<!--
- An **init container** prepares the environment by mounting a volume or generating a configuration file. If the main application container corrupts this environment, simply restarting that one container is not enough. The entire initialization process needs to run again.
- A **watcher sidecar** monitors system health. If it detects an unrecoverable but retriable error state, it must trigger a restart of the main application container from a clean slate.
- A **sidecar** that manages a remote resource fails. Even if the sidecar restarts on its own, the main container may be stuck trying to access an outdated or broken connection.
-->
- **Init 容器**通过挂载卷或生成配置文件来准备环境。如果主应用容器把这个环境弄坏了，
  只重启该容器并不足够：需要重新执行整个初始化流程。
- **监控边车（watcher sidecar）**负责监控系统健康状况。
  如果它检测到一种“不可恢复、但可重试”的错误状态，就必须触发主应用容器从干净状态重新开始。
- **管理远端资源的边车**发生故障。即使该边车自行重启，主容器也可能仍卡在尝试访问一个过期或损坏的连接上。

<!--
In all these cases, the desired action is not to restart a single container, but all of them. Previously, the only way to achieve this was to delete the Pod and have a controller (like a Job or ReplicaSet) create a new one. This process is slow and expensive, involving the scheduler, node resource allocation and re-initialization of networking and storage.
-->
在上述所有场景中，期望的动作并不是重启某一个容器，而是**把所有容器都重启**。
以前要做到这一点，唯一的办法是删除 Pod，然后让控制器（例如 Job 或 ReplicaSet）创建一个新的 Pod。
这个过程又慢又贵，需要经过调度器、节点资源重新分配，以及网络与存储的重新初始化。

<!--
This inefficiency becomes even worse when handling large-scale AI/ML workloads (>= 1,000 Nodes with one Pod per Node). A common requirement for these synchronous workloads is that when a failure occurs (such as a Node crash), all Pods in the fleet must be recreated to reset the state before training can resume, even if all the other Pods were not directly affected by the failure. Deleting, creating and scheduling thousands of Pods simultaneously creates a massive bottleneck. The estimated overhead of this failure could cost [$100,000 per month in wasted resources](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.qwqcnzf96avw).
-->
当处理大规模 AI/ML 工作负载时（例如 \(\ge\) 1000 个节点、每节点一个 Pod），这种低效会更加严重。
这类同步工作负载的一个常见要求是：当发生故障（例如节点宕机）时，
需要重建整个集群中的所有 Pod 来重置状态，然后训练才能继续；
即便其他 Pod 并未直接受到该故障影响，也往往需要一起重置。
同时删除、创建并调度成千上万个 Pod 会形成巨大的瓶颈。
据估算，这类故障带来的额外开销可能导致每月浪费资源达 [$100,000](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.qwqcnzf96avw)。

<!--
Handling these failures for AI/ML training jobs requires a complex integration touching both the training framework and Kubernetes, which are often fragile and toilsome. This feature introduces a Kubernetes-native solution, improving system robustness and allowing application developers to concentrate on their core training logic.
-->
为 AI/ML 训练作业处理这些故障，通常需要在训练框架与 Kubernetes 之间做复杂集成；
这种集成往往脆弱、费力且维护成本高。该特性提供了一种 Kubernetes 原生方案，增强系统健壮性，
并让应用开发者更专注于核心训练逻辑。

<!--
Another major benefit of restarting Pods in place is that keeping Pods on their assigned Nodes allows for further optimizations. For example, one can implement node-level caching tied to a specific Pod identity, something that is impossible when Pods are unnecessarily being recreated on different Nodes.
-->
原地重启 Pod 的另一个重要收益是：Pod 仍保留在其已分配的节点上，从而可以做更多优化。
例如，你可以实现与特定 Pod 身份绑定的节点级缓存；而当 Pod 被频繁、不必要地在不同节点上重建时，这是无法做到的。

<!--
## Introducing the `RestartAllContainers` action
-->
## 引入 `RestartAllContainers` 动作

<!--
To address this, Kubernetes v1.35 adds a new action to the container restart rules: `RestartAllContainers`. When a container exits in a way that matches a rule with this action, the kubelet initiates a fast, **in-place** restart of the Pod.
-->
为解决上述问题，Kubernetes v1.35 在容器重启规则中新增了一个动作：`RestartAllContainers`。
当某个容器以符合某条规则的方式退出，且该规则配置了此动作时，kubelet 会触发 Pod 的快速**原地**重启。

<!--
This in-place restart is highly efficient because it preserves the Pod's most important resources:
- The Pod's UID, IP address and network namespace.
- The Pod's sandbox and any attached devices.
- All volumes, including `emptyDir` and mounted volumes from PVCs.
-->
这种原地重启非常高效，因为它会保留 Pod 最重要的资源：
- Pod 的 UID、IP 地址与网络命名空间（network namespace）。
- Pod 的沙箱（sandbox）以及所有已挂接的设备。
- 所有卷（volume），包括 `emptyDir` 与从 PVC 挂载的卷。

<!--
After terminating all running containers, the Pod's startup sequence is re-executed from the very beginning. This means all **init containers** are run again in order, followed by the sidecar and regular containers, ensuring a completely fresh start in a known-good environment. With the exception of ephemeral containers (which are terminated), all other containers—including those that previously succeeded or failed—will be restarted, regardless of their individual restart policies.
-->
当 kubelet 终止所有正在运行的容器后，Pod 的启动序列会从最开始重新执行。
这意味着所有 **Init 容器**会按顺序重新运行，然后才是边车与普通容器，
从而确保在一个“已知良好”的环境中完全重新开始。除临时容器（ephemeral containers，会被终止）之外，
其他所有容器——包括之前成功或失败过的容器——都会被重启，而不受各自重启策略的影响。

<!--
## Use cases
-->
## 使用场景

<!--
### 1. Efficient restarts for ML/Batch jobs
-->
### 1. 面向 ML/批处理作业的高效重启

<!--
For ML training jobs, [rescheduling a worker Pod on failure](/blog/2025/07/03/navigating-failures-in-pods-with-devices/#roadmap-for-failure-modes-container-code-failed) is a costly operation that wastes valuable compute resources. On a 1,000-node training cluster, rescheduling overhead can waste [over $100,000 in compute resources monthly](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.qwqcnzf96avw).
-->
对于机器学习训练作业而言，[在故障发生时对 worker Pod 重新调度](/zh-cn/blog/2025/07/03/navigating-failures-in-pods-with-devices/#roadmap-for-failure-modes-container-code-failed)
是一项代价高昂的操作，会浪费宝贵的算力资源。
在一个 1000 节点规模的训练集群中，重新调度带来的开销可能造成每月浪费算力资源超过 [$100,000](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.qwqcnzf96avw)。

<!--
With `RestartAllContainers` actions you can address this by enabling a much faster, hybrid recovery strategy: recreate only the "bad" Pods (e.g., those on unhealthy Nodes) while triggering `RestartAllContainers` for the remaining healthy Pods. Benchmarks show this reduces the recovery overhead [from minutes to a few seconds](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.cwkee8kar0i5).
-->
通过 `RestartAllContainers` 动作，你可以采用一种更快的混合恢复策略来缓解这一问题：
只重建“坏”的 Pod（例如位于不健康节点上的 Pod），而对其余健康 Pod 触发 `RestartAllContainers`。
基准测试显示，这能将恢复开销[从分钟级降低到数秒](https://docs.google.com/document/d/16zexVooHKPc80F4dVtUjDYK9DOpkVPRNfSv0zRtfFpk/edit?tab=t.0#bookmark=id.cwkee8kar0i5)。

<!--
With in-place restarts, a watcher sidecar can monitor the main training process. If it encounters a specific, retriable error, the watcher can exit with a designated code to trigger a fast reset of the worker Pod, allowing it to restart from the last checkpoint without involving the Job controller. This capability is now natively supported by Kubernetes.
-->
借助原地重启，一个监控边车（watcher sidecar）可以负责监控主训练进程。
当它遇到某个特定的、可重试的错误时，watcher 可以用指定退出码退出，从而触发 worker Pod 的快速重置，
使其无需经过 Job 控制器即可从上一个 checkpoint 继续重启。
这一能力现在已由 Kubernetes 原生支持。

<!--
Read more details about future development and JobSet features at [KEP-467 JobSet in-place restart](https://github.com/kubernetes-sigs/jobset/issues/467).
-->
关于未来演进与 JobSet 特性的更多细节，请参阅 [KEP-467 JobSet 原地重启](https://github.com/kubernetes-sigs/jobset/issues/467)。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ml-worker-pod
spec:
  restartPolicy: Never
  initContainers:
  # 该 Init 容器会在每次原地重启时重新执行
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
          # watcher 的特定退出码会触发 Pod 的全量重启
          values: [88]
  containers:
  - name: main-application
    image: my-repo/training-app:1.0
```

<!--
### 2. Re-running init containers for a clean state
-->
### 2. 重新执行 Init 容器以获得干净状态

<!--
Imagine a scenario where an init container is responsible for fetching credentials or setting up a shared volume. If the main application fails in a way that corrupts this shared state, you need the [init container to rerun](https://github.com/kubernetes/enhancements/issues/3676).
-->
设想这样一个场景：某个 Init 容器负责拉取凭据或设置共享卷。
如果主应用以某种方式失败并破坏了这份共享状态，你就需要让 [Init 容器重新运行](https://github.com/kubernetes/enhancements/issues/3676)。

<!--
By configuring the main application to exit with a specific code upon detecting such a corruption, you can trigger the `RestartAllContainers` action, guaranteeing that the init container provides a clean setup before the application restarts.
-->
你可以在主应用检测到此类破坏时，让它以特定退出码退出，从而触发 `RestartAllContainers` 动作，
确保在应用重启之前，Init 容器会先提供一次干净的初始化设置。

<!--
### 3. Handling high rate of similar tasks execution
-->
### 3. 处理高频、同类任务执行

<!--
There are cases when tasks are best represented as a Pod execution. And each task requires a clean execution. The task may be a game session backend or some queue item processing. If the rate of tasks is high, running the whole cycle of Pod creation, scheduling and initialization is simply too expensive, especially when tasks can be short. The ability to restart all containers from scratch enables a Kubernetes-native way to handle this scenario without custom solutions or frameworks.
-->
在某些情况下，用 Pod 来表达一次任务执行是最合适的，并且每次任务都需要干净执行。
任务可能是某个游戏会话后端，或是队列条目处理等。
当任务频率很高时，完整走一遍“创建 Pod → 调度 → 初始化”的周期会非常昂贵，尤其是当任务本身可能很短时。
能够从头重启所有容器，使 Kubernetes 可以用原生方式处理这种场景，而无需自定义方案或额外框架。

<!--
## How to use it
-->
## 如何使用

<!--
To try this feature, you must enable the `RestartAllContainersOnContainerExits` feature gate on your Kubernetes cluster components (API server and kubelet) running Kubernetes v1.35+. This alpha feature extends the `ContainerRestartRules` feature, which graduated to beta in v1.35 and is enabled by default.
-->
要试用该特性，你必须在运行 Kubernetes v1.35+ 的集群组件（API server 与 kubelet）上启用 `RestartAllContainersOnContainerExits` 特性门控。
这个 Alpha 特性扩展了 `ContainerRestartRules` 特性；后者在 v1.35 中已晋升为 Beta 且默认启用。

<!--
Once enabled, you can add `restartPolicyRules` to any container (init, sidecar, or regular) and use the `RestartAllContainers` action.
-->
启用后，你可以在任何容器（Init、边车或普通容器）上添加 `restartPolicyRules`，并使用 `RestartAllContainers` 动作。

<!--
The feature is designed to be easily usable on existing apps. However, if an application does not follow some best practices, it may cause issues for the application or for observability tooling. When enabling the feature, make sure that all containers are reentrant and that external tooling is prepared for init containers to re-run. Also, when restarting all containers, the kubelet does not run `preStop` hooks. This means containers must be designed to handle abrupt termination without relying on `preStop` hooks for graceful shutdown.
-->
该特性被设计为可以较容易地应用到现有应用上。
但如果应用没有遵循一些最佳实践，可能会给应用本身或可观测性工具带来问题。
启用该特性时，请确保所有容器都是可重入（reentrant）的，并且外部工具已经准备好应对 Init 容器的重复执行。
另外，当执行“重启所有容器”时，kubelet 不会运行 `preStop` hook。
这意味着容器必须能够处理突发终止，而不能依赖 `preStop` hook 来实现优雅关闭。

<!--
## Observing the restart
-->
## 观测重启过程

<!--
To make this process observable, a new Pod condition, `AllContainersRestarting`, is added to the Pod's status. When a restart is triggered, this condition becomes `True` and it reverts to `False` once all containers have terminated and the Pod is ready to start its lifecycle anew. This provides a clear signal to users and other cluster components about the Pod's state.
-->
为了让该过程可观测，Pod 的 status 中新增了一个 Pod Condition：`AllContainersRestarting`。
当触发重启时，该 condition 变为 `True`；当所有容器都已终止且 Pod 准备好重新开始其生命周期时，它会恢复为 `False`。
这为用户与其他集群组件提供了一个清晰信号，用于判断 Pod 当前所处状态。

<!--
All containers restarted by this action will have their restart count incremented in the container status.
-->
所有因该动作而重启的容器，其容器状态中的重启计数（restart count）都会递增。

<!--
## Learn more
-->
## 了解更多

<!--
- Read the official documentation on [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers).
- Read the detailed proposal in the [KEP-5532: Restart All Containers on Container Exits](https://kep.k8s.io/5532).
- Read the proposal for JobSet in-place restart in [JobSet issue #467](https://github.com/kubernetes-sigs/jobset/issues/467).
-->
- 阅读官方文档：[Pod 生命周期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-all-containers)。
- 阅读详细提案：[KEP-5532：Restart All Containers on Container Exits](https://kep.k8s.io/5532)。
- 阅读 JobSet 原地重启提案：[JobSet issue #467](https://github.com/kubernetes-sigs/jobset/issues/467)。

<!--
## We want your feedback!
-->
## 我们期待你的反馈！

<!--
As an alpha feature, `RestartAllContainers` is ready for you to experiment with and any use cases and feedback are welcome. This feature is driven by the [SIG Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md) community. If you are interested in getting involved, sharing your thoughts, or contributing, please join us!
-->
作为一个 Alpha 特性，`RestartAllContainers` 已经可以供你试用，我们也欢迎任何使用场景与反馈。
该特性由 [SIG Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md) 社区推动。
如果你有兴趣参与、分享想法或做出贡献，欢迎加入我们！

<!--
You can reach SIG Node through:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
-->
你可以通过以下方式联系 SIG Node：
- Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
