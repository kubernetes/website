---
layout: 博客
title: '动态 Kubelet 配置'
date: 2018-07-11
---
<!--
---
layout: blog
title: 'Dynamic Kubelet Configuration'
date: 2018-07-11
---
-->

<!--
**Author**: Michael Taufen (Google)
-->
**作者**: Michael Taufen (Google)

<!--
**Editor’s note: this post is part of a [series of in-depth articles](https://kubernetes.io/blog/2018/06/27/kubernetes-1.11-release-announcement/) on what’s new in Kubernetes 1.11**
-->
**编者注：这篇文章是 [一系列深度文章](https://kubernetes.io/blog/2018/06/27/kubernetes-1.11-release-announcement/) 的一部分，介绍了 Kubernetes 中的新增功能 1.11**

<!--
## Why Dynamic Kubelet Configuration?
-->
## 为什么要进行动态 Kubelet 配置？

<!--
Kubernetes provides API-centric tooling that significantly improves workflows for managing applications and infrastructure. Most Kubernetes installations, however, run the Kubelet as a native process on each host, outside the scope of standard Kubernetes APIs.
-->
Kubernetes 提供了以 API 为中心的工具，可显着改善用于管理应用程序和基础架构的工作流程。
但是，大多数 Kubernetes 安装都在标准 Kubernetes API 范围之外，在每个主机上将 Kubelet 作为本机进程运行。

<!--
In the past, this meant that cluster administrators and service providers could not rely on Kubernetes APIs to reconfigure Kubelets in a live cluster. In practice, this required operators to either ssh into machines to perform manual reconfigurations, use third-party configuration management automation tools, or create new VMs with the desired configuration already installed, then migrate work to the new machines. These approaches are environment-specific and can be expensive.
-->
过去，这意味着集群管理员和服务提供商无法依靠 Kubernetes API 在活动集群中重新配置 Kubelets。
实际上，这要求操作员要么转入计算机以执行手动重新配置，要么使用第三方配置管理自动化工具，或创建已经安装了所需配置的新 VM，然后将工作迁移到新计算机上。
这些方法是特定于环境的，并且可能很昂贵。

<!--
Dynamic Kubelet configuration gives cluster administrators and service providers the ability to reconfigure Kubelets in a live cluster via Kubernetes APIs.
-->
动态 Kubelet 配置使集群管理员和服务提供商能够通过 Kubernetes API 在活动集群中重新配置 Kubelet。

<!--
## What is Dynamic Kubelet Configuration?
-->
## 什么是动态 Kubelet 配置？

<!--
Kubernetes v1.10 made it possible to configure the Kubelet via a beta [config file](/docs/tasks/administer-cluster/kubelet-config-file/) API. Kubernetes already provides the ConfigMap abstraction for storing arbitrary file data in the API server.
-->
Kubernetes v1.10 使得可以通过beta [配置文件](/docs/tasks/administer-cluster/kubelet-config-file/)API 配置 Kubelet。
Kubernetes 已经提供了 ConfigMap 抽象，用于在 API 服务器中存储任意文件数据。

<!--
Dynamic Kubelet configuration extends the Node object so that a Node can refer to a ConfigMap that contains the same type of config file. When a Node is updated to refer to a new ConfigMap, the associated Kubelet will attempt to use the new configuration.
-->
动态 Kubelet 配置扩展了 Node 对象，以便 Node 可以引用包含相同类型配置文件的 ConfigMap。
当节点更新为引用新的 ConfigMap 时，关联的 Kubelet 将尝试使用新的配置。

<!--
## How does it work?
-->
## 它是如何工作的？

<!--
Dynamic Kubelet configuration provides the following core features:
-->
动态 Kubelet 配置提供以下核心功能：

<!--
* Kubelet attempts to use the dynamically assigned configuration.
* Kubelet "checkpoints" configuration to local disk, enabling restarts without API server access.
* Kubelet reports assigned, active, and last-known-good configuration sources in the Node status.
* When invalid configuration is dynamically assigned, Kubelet automatically falls back to a last-known-good configuration and reports errors in the Node status.
-->
* Kubelet 尝试使用动态分配的配置。
* Kubelet 对本地磁盘的“检查点”配置，无需 API 服务器访问即可重新启动。
* Kubelet 报告处于“节点”状态的已分配，活动和最近已知良好的配置源。
* 当动态分配了无效的配置时，Kubelet 会自动退回到最后一次正确的配置，并报告节点状态中的错误。

<!--
To use the dynamic Kubelet configuration feature, a cluster administrator or service provider will first post a ConfigMap containing the desired configuration, then set each Node.Spec.ConfigSource.ConfigMap reference to refer to the new ConfigMap. Operators can update these references at their preferred rate, giving them the ability to perform controlled rollouts of new configurations.
-->
要使用动态 Kubelet 配置功能，群集管理员或服务提供商将首先发布包含所需配置的 ConfigMap，然后设置每个 Node.Spec.ConfigSource。
ConfigMap 参考以引用新的 ConfigMap。
运营商可以以他们喜欢的速率更新这些参考，从而使他们能够执行新配置的受控部署。

<!--
Each Kubelet watches its associated Node object for changes. When the Node.Spec.ConfigSource.ConfigMap reference is updated, the Kubelet will "checkpoint" the new ConfigMap by writing the files it contains to local disk. The Kubelet will then exit, and the OS-level process manager will restart it. Note that if the Node.Spec.ConfigSource.ConfigMap reference is not set, the Kubelet uses the set of flags and config files local to the machine it is running on.
-->
每个 Kubelet 都会监视其关联的 Node 对象的更改。
更新 Node.Spec.ConfigSource.ConfigMap 引用后，
Kubelet 将通过将其包含的文件写入本地磁盘来“检查点”新的 ConfigMap。
然后，Kubelet 将退出，并且操作系统级进程管理者将重新启动它。
请注意，如果未设置 Node.Spec.ConfigSource.ConfigMap 引用，
则 Kubelet 将使用其正在运行的计算机本地的一组标志和配置文件。

<!--
Once restarted, the Kubelet will attempt to use the configuration from the new checkpoint. If the new configuration passes the Kubelet's internal validation, the Kubelet will update Node.Status.Config to reflect that it is using the new configuration. If the new configuration is invalid, the Kubelet will fall back to its last-known-good configuration and report an error in Node.Status.Config.
-->
重新启动后，Kubelet 将尝试从新检查点使用配置。
如果新配置通过了 Kubelet 的内部验证，则 Kubelet 将更新 Node。
Status.Config 用以反映它正在使用新配置。
如果新配置无效，则 Kubelet 将退回到其最后一个正确的配置，并在 Node.Status.Config 中报告错误。

<!--
Note that the default last-known-good configuration is the combination of Kubelet command-line flags with the Kubelet's local configuration file. Command-line flags that overlap with the config file always take precedence over both the local configuration file and dynamic configurations, for backwards-compatibility.
-->
请注意，默认的最后一次正确配置是 Kubelet 命令行标志与 Kubelet 的本地配置文件的组合。
与配置文件重叠的命令行标志始终优先于本地配置文件和动态配置，以实现向后兼容。

<!--
See the following diagram for a high-level overview of a configuration update for a single Node:
-->
有关单个节点的配置更新的高级概述，请参见下图：

![kubelet-diagram](/images/blog/2018-07-11-dynamic-kubelet-configuration/kubelet-diagram.png)

<!--
## How can I learn more?
-->
## 我如何了解更多？

<!--
Please see the official tutorial at /docs/tasks/administer-cluster/reconfigure-kubelet/, which contains more in-depth details on user workflow, how a configuration becomes "last-known-good," how the Kubelet "checkpoints" config, and possible failure modes.
-->
请参阅/ docs / tasks / administer-cluster / reconfigure-kubelet /上的官方教程，
其中包含有关用户工作流，配置如何成为“最新的正确的”配置，Kubelet如何“检查点”配置的更多详细信息，以及可能的故障模式。
