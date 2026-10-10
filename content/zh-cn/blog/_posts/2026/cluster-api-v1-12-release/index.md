---  
layout: blog
title: "Cluster API v1.12：引入就地更新和链式升级"
date: 2026-01-27T08:00:00-08:00
slug: cluster-api-v1-12-release
author: >
  Fabrizio Pandini (Broadcom)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Cluster API v1.12: Introducing In-place Updates and Chained Upgrades"
date: 2026-01-27T08:00:00-08:00
slug: cluster-api-v1-12-release
author: >
  Fabrizio Pandini (Broadcom)
-->

<!--
[Cluster API](https://cluster-api.sigs.k8s.io/) brings declarative management to Kubernetes cluster lifecycle, allowing users and platform teams to define the desired state of clusters and rely on controllers to continuously reconcile toward it.
-->
[Cluster API](https://cluster-api.sigs.k8s.io/) 为 Kubernetes 集群生命周期带来了声明式管理，
允许用户和平台团队定义集群的期望状态，并依靠控制器持续协调以达到该状态。

<!--
Similar to how you can use StatefulSets or Deployments in Kubernetes to manage a group of Pods, in Cluster API you can use KubeadmControlPlane to manage a set of control plane Machines, or you can use MachineDeployments to manage a group of worker Nodes.
-->
类似于在 Kubernetes 中使用 StatefulSet 或 Deployment 管理一组 Pod，
在 Cluster API 中，你可以使用 KubeadmControlPlane 来管理一组控制平面 Machine，
或者使用 MachineDeployment 管理一组工作节点。

<!--
The [Cluster API v1.12.0](https://github.com/kubernetes-sigs/cluster-api/releases/tag/v1.12.0) release expands what is possible in Cluster API, reducing friction in common lifecycle operations by introducing in-place updates and chained upgrades. 
-->
[Cluster API v1.12.0](https://github.com/kubernetes-sigs/cluster-api/releases/tag/v1.12.0)
版本扩展了 Cluster API 的能力范围，
通过引入就地更新和链式升级减少了常见生命周期操作的摩擦。

<!--
## Emphasis on simplicity and usability
-->
## 强调简单性和可用性

<!--
With v1.12.0, the Cluster API project demonstrates once again that this community is capable of delivering a great amount of innovation, while at the same time minimizing impact for Cluster API users.
-->
通过 v1.12.0，Cluster API 项目再次证明这个社区能够提供大量创新，
同时最大程度地减少对 Cluster API 用户的影响。

<!--
What does this mean in practice?

Users simply have to change the [Cluster](https://cluster-api.sigs.k8s.io/user/concepts#cluster) or the [Machine](https://cluster-api.sigs.k8s.io/user/concepts#machine) spec (just as with previous Cluster API releases), and Cluster API will automatically trigger in-place updates or chained upgrades when possible and advisable.
-->
这在实践中意味着什么？

用户只需更改 [Cluster](https://cluster-api.sigs.k8s.io/user/concepts#cluster)
或 [Machine](https://cluster-api.sigs.k8s.io/user/concepts#machine)
的规约（与之前的 Cluster API 版本一样），Cluster API 会在可能且合适的情况下自动触发就地更新或链式升级。

<!--
## In-place Updates
-->
## 就地更新

<!--
Like Kubernetes does for Pods in Deployments, when the [Machine](https://cluster-api.sigs.k8s.io/user/concepts#machine) spec changes also Cluster API performs rollouts by creating a new Machine and deleting the old one.
-->
就像 Kubernetes 对 Deployment 中的 Pod 所做的那样，
当 [Machine](https://cluster-api.sigs.k8s.io/user/concepts#machine)
的规约更改时，Cluster API 也通过创建新 Machine 并删除旧 Machine 来执行滚动更新。

<!--
This approach, inspired by the principle of immutable infrastructure, has a set of considerable advantages:

- It is simple to explain, predictable, consistent and easy to reason about with users and engineers.
- It is simple to implement, because it relies only on two core primitives, create and delete.
- Implementation does not depend on Machine-specific choices, like OS, bootstrap mechanism etc.

As a result, Machine rollouts drastically reduce the number of variables to be considered when managing the lifecycle of a host server that is hosting Nodes.
-->
这种方法受不可变基础设施原则的启发，具有一系列显著优势：

- 易于解释、可预测、一致，且用户和工程师易于理解。
- 实现简单，因为它只依赖两个核心原语：创建和删除。
- 实现不依赖于 Machine 特定的选择，如操作系统、引导机制等。

因此，Machine 滚动更新大大减少了管理承载节点的主机服务器生命周期时需要考虑的变量数量。

<!--
However, while advantages of immutability are not under discussion, both Kubernetes and Cluster API are undergoing a similar journey, introducing changes that allow users to minimize workload disruption whenever possible.
-->
然而，虽然不可变性的优势毋庸置疑，但 Kubernetes 和 Cluster API
都在经历类似的历程，引入更改以允许用户尽可能减少工作负载中断。

<!--
Over time, also Cluster API has introduced several improvements to immutable rollouts, including:

- Support for [in-place propagation of changes affecting Kubernetes resources only](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20221003-In-place-propagation-of-Kubernetes-objects-only-changes.md), thus avoiding unnecessary rollouts
- A way to [Taint outdated nodes with PreferNoSchedule](https://github.com/kubernetes-sigs/cluster-api/pull/10223), thus reducing Pod churn by optimizing how Pods are rescheduled during rollouts.
- Support for the delete first rollout strategy, thus making it easier to do immutable rollouts on bare metal / environments with constrained resources.

The new [in-place update](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240807-in-place-updates.md) feature in Cluster API is the next step in this journey.
-->
随着时间的推移，Cluster API 也对不可变滚动更新引入了多项改进，包括：

- 支持[仅影响 Kubernetes 资源的就地变更传播](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20221003-In-place-propagation-of-Kubernetes-objects-only-changes.md)，
  从而避免不必要的滚动更新
- 一种[使用 PreferNoSchedule 污染过时节点](https://github.com/kubernetes-sigs/cluster-api/pull/10223)的方法，
  通过优化滚动更新期间 Pod 的重新调度方式来减少 Pod 更替。
- 支持先删除后创建的滚动更新策略，
  从而更容易在裸金属/资源受限环境中执行不可变滚动更新。

Cluster API
中的新[就地更新](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240807-in-place-updates.md)特性是这一历程的下一步。

<!--
With the v1.12.0 release, Cluster API introduces support for [update extensions](https://cluster-api.sigs.k8s.io/tasks/experimental-features/runtime-sdk/implement-in-place-update-hooks) allowing users to make changes on existing machines in-place, without deleting and re-creating the Machines.

Both KubeadmControlPlane and MachineDeployments support in-place updates based on the new update extension, and this means that the boundary of what is possible in Cluster API is now changed in a significant way.
-->
在 v1.12.0 版本中，Cluster API 引入了对[更新扩展](https://cluster-api.sigs.k8s.io/tasks/experimental-features/runtime-sdk/implement-in-place-update-hooks)的支持，
允许用户在现有机器上就地进行更改，而无需删除和重新创建 Machine。

KubeadmControlPlane 和 MachineDeployments 都基于新的更新扩展支持就地更新，
这意味着 Cluster API 的能力边界现在发生了重大变化。

<!--
How do in-place updates work?

The simplest way to explain it is that once the user triggers an update by changing the desired state of Machines, then Cluster API chooses the best tool to achieve the desired state. 

The news is that now Cluster API can choose between immutable rollouts and in-place update extensions to perform required changes.

{{< figure src="in-place.svg" alt="In-place updates in Cluster API" >}}
-->
就地更新如何工作？

最简单的解释是，一旦用户通过更改 Machine 的期望状态触发更新，
Cluster API 会选择最佳工具来实现期望状态。

现在的新消息是，Cluster API 可以在不可变滚动更新和就地更新扩展之间选择来执行所需的更改。

{{< figure src="in-place.svg" alt="Cluster API 中的就地更新" >}}

<!--
Importantly, this is not immutable rollouts vs in-place updates; Cluster API considers both valid options and selects the most appropriate mechanism for a given change. 

From the perspective of the Cluster API maintainers, in-place updates are most useful for making changes that don't otherwise require a node drain or pod restart; for example: changing user credentials for the Machine. On the other hand, when the workload will be disrupted anyway, just do a rollout.
-->
重要的是，这不是不可变滚动更新与就地更新的对立；
Cluster API 认为两者都是有效的选项，并为给定的更改选择最合适的机制。

从 Cluster API 维护者的角度来看，就地更新最适用于不需要节点排空或 Pod 重启的更改；
例如：更改 Machine 的用户凭证。另一方面，当工作负载无论如何都会中断时，只需执行滚动更新。

<!--
Nevertheless, Cluster API remains true to its extensible nature, and everyone can create their own update extension and decide when and how to use in-place updates by trading in some of the benefits of immutable rollouts.

For a deep dive into this feature, make sure to attend the session [In-place Updates with Cluster API: The Sweet Spot Between Immutable and Mutable Infrastructure](https://kccnceu2026.sched.com/event/2CW1r/in-place-updates-with-cluster-api-the-sweet-spot-between-immutable-and-mutable-infrastructure-fabrizio-pandini-stefan-buringer-broadcom?iframe=yes&w=100%&sidebar=yes&bg=no) at KubeCon EU in Amsterdam!  
-->
尽管如此，Cluster API 仍然保持其可扩展的特性，每个人都可以创建自己的更新扩展，
并通过权衡不可变滚动更新的一些好处来决定何时以及如何使用就地更新。

要深入了解此功能，请务必参加阿姆斯特丹 KubeCon EU
的会议[使用 Cluster API 进行就地更新：不可变基础架构和可变基础架构之间的最佳平衡点](https://kccnceu2026.sched.com/event/2CW1r/in-place-updates-with-cluster-api-the-sweet-spot-between-immutable-and-mutable-infrastructure-fabrizio-pandini-stefan-buringer-broadcom?iframe=yes&w=100%&sidebar=yes&bg=no)！

<!--
## Chained Upgrades
-->
## 链式升级

<!--
[ClusterClass](https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/) and managed topologies in Cluster API jointly provided a powerful and effective framework that acts as a building block for many platforms offering Kubernetes-as-a-Service.

Now with v1.12.0 this feature is making another important step forward, by allowing users to upgrade by more than one Kubernetes minor version in a single operation, commonly referred to as a [chained upgrade](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20250513-chained-and-efficient-upgrades-for-clusters-with-managed-topologies.md).

This allows users to declare a target Kubernetes version and let Cluster API safely orchestrate the required intermediate steps, rather than manually managing each minor upgrade.
-->
[ClusterClass](https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/)
和 Cluster API 中的托管拓扑共同提供了一个强大而有效的框架，
作为许多提供 Kubernetes-as-a-Service 的平台的基础组件。

现在在 v1.12.0 中，此功能向前迈出了重要一步，
允许用户在单个操作中升级多个 Kubernetes 次要版本，
通常称为[链式升级](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20250513-chained-and-efficient-upgrades-for-clusters-with-managed-topologies.md)。

这允许用户声明目标 Kubernetes 版本，并让 Cluster API 安全地编排所需的中间步骤，
而不是手动管理每个次要版本升级。

<!--
The simplest way to explain how chained upgrades work, is that once the user triggers an update by changing the desired version for a Cluster, Cluster API computes an upgrade plan, and then starts executing it. Rather than (for example) update the Cluster to v1.33.0 and then v1.34.0 and then v1.35.0, checking on progress at each step, a chained upgrade lets you go directly to v1.35.0.
-->
最简单的解释链式升级如何工作的方式是，一旦用户通过更改 Cluster 的期望版本触发更新，
Cluster API 会计算升级计划，然后开始执行它。例如，不需要先将 Cluster 更新到 v1.33.0，
然后 v1.34.0，然后 v1.35.0，并在每个步骤检查进度，链式升级允许你直接升级到 v1.35.0。

<!--
Executing an upgrade plan means upgrading control plane and worker machines in a strictly controlled order, repeating this process as many times as needed to reach the desired state. The Cluster API is now capable of managing this for you.

Cluster API takes care of optimizing and minimizing the upgrade steps for worker machines, and in fact worker machines will skip upgrades to intermediate Kubernetes minor releases whenever allowed by the Kubernetes version skew policies.

{{< figure src="chained.svg" alt="Chained upgrades in Cluster API" >}}
-->
执行升级计划意味着以严格控制的顺序升级控制平面和工作节点机器，
根据需要重复此过程多次以达到期望状态。Cluster API 现在能够为你管理此过程。

Cluster API 负责优化和最小化工作节点机器的升级步骤，
实际上，只要 Kubernetes 版本偏差策略允许，工作节点机器将跳过中间 Kubernetes 次要版本的升级。

{{< figure src="chained.svg" alt="Cluster API 中的链式升级" >}}

<!--
Also in this case extensibility is at the core of this feature, and [upgrade plan runtime extensions](https://cluster-api.sigs.k8s.io/tasks/experimental-features/runtime-sdk/implement-upgrade-plan-hooks) can be used to influence how the upgrade plan is computed; similarly, [lifecycle hooks](https://cluster-api.sigs.k8s.io/tasks/experimental-features/runtime-sdk/implement-lifecycle-hooks) can be used to automate other tasks that must be performed during an upgrade, e.g. upgrading an addon after the control plane update completed.

From our perspective, chained upgrades are most useful for users that struggle to keep up with Kubernetes minor releases, and e.g. they want to upgrade only once per year and then upgrade by three versions (n-3 → n). But be warned: the fact that you can now easily upgrade by more than one minor version is not an excuse to not patch your cluster frequently!
-->
在这种情况下，可扩展性也是此功能的核心，
[升级计划运行时扩展](https://cluster-api.sigs.k8s.io/tasks/experimental-features/runtime-sdk/implement-upgrade-plan-hooks)
可用于影响升级计划的计算方式；类似地，
[生命周期钩子](https://cluster-api.sigs.k8s.io/tasks/experimental-features/runtime-sdk/implement-lifecycle-hooks)
可用于自动化升级期间必须执行的其他任务，例如在控制平面更新完成后升级附加组件。

从我们的角度来看，链式升级最适合难以跟上 Kubernetes 次要版本发布节奏的用户，
例如他们希望每年只升级一次，然后升级三个版本（n-3 → n）。
但请注意：现在可以轻松升级多个次要版本并不意味着可以不频繁修补集群！

<!--
## Release team
-->
## 发布团队

<!--
I would like to thank all the contributors, the maintainers, and all the engineers that volunteered for the release team.

The reliability and predictability of Cluster API releases, which is one of the most appreciated features from our users, is only possible with the support, commitment, and hard work of its community.

Kudos to the entire Cluster API community for the v1.12.0 release and all the great releases delivered in 2025!

If you are interested in getting involved, learn about 
[Cluster API contributing guidelines](https://cluster-api.sigs.k8s.io/contributing).
-->
我要感谢所有贡献者、维护者以及所有自愿加入发布团队的工程师。

Cluster API 版本的可靠性和可预测性是用户最赞赏的特性之一，
这只有在社区的支持、承诺和辛勤工作下才有可能实现。

向整个 Cluster API 社区致敬，感谢 v1.12.0 版本和 2025 年交付的所有出色版本！

如果你有兴趣参与，请了解 [Cluster API 贡献指南](https://cluster-api.sigs.k8s.io/contributing)。

<!--
## What's next?
-->
## 下一步是什么？

<!--
If you read the [Cluster API manifesto](https://cluster-api.sigs.k8s.io/user/manifesto), you can see how the Cluster API subproject claims the right to remain unfinished, recognizing the need to continuously evolve, improve, and adapt to the changing needs of Cluster API's users and the broader Cloud Native ecosystem.

As Kubernetes itself continues to evolve, the Cluster API subproject will keep advancing alongside it, focusing on safer upgrades, reduced disruption, and stronger building blocks for platforms managing Kubernetes at scale.

Innovation remains at the heart of Cluster API, stay tuned for an exciting 2026!
-->
如果你阅读 [Cluster API 宣言](https://cluster-api.sigs.k8s.io/user/manifesto)，
你可以看到 Cluster API 子项目如何声称保持未完成状态的权利，
认识到需要不断演进、改进并适应 Cluster API 用户和更广泛的云原生生态系统不断变化的需求。

随着 Kubernetes 本身的不断发展，Cluster API 子项目将与其一起前进，
专注于更安全的升级、减少中断以及为大规模管理 Kubernetes 的平台提供更强大的构建块。

创新仍然是 Cluster API 的核心，敬请期待激动人心的 2026 年！

---

<!--
Useful links:
- [Cluster API](https://cluster-api.sigs.k8s.io/)
- [Cluster API v1.12.0 release](https://github.com/kubernetes-sigs/cluster-api/releases/tag/v1.12.0)
- [In-place update proposal](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240807-in-place-updates.md)
- [Chained upgrade proposal](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20250513-chained-and-efficient-upgrades-for-clusters-with-managed-topologies.md)
-->
有用链接：

- [Cluster API](https://cluster-api.sigs.k8s.io/)
- [Cluster API v1.12.0 发布](https://github.com/kubernetes-sigs/cluster-api/releases/tag/v1.12.0)
- [就地更新提案](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240807-in-place-updates.md)
- [链式升级提案](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20250513-chained-and-efficient-upgrades-for-clusters-with-managed-topologies.md)
