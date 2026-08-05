---
layout: blog
title: 'kubeadm 七周年生日快乐！'
date: 2023-09-26
slug: happy-7th-birthday-kubeadm
---
<!--
layout: blog
title: 'Happy 7th Birthday kubeadm!'
date: 2023-09-26
slug: happy-7th-birthday-kubeadm
-->

<!--
**Author:** Fabrizio Pandini (VMware)
-->
**作者:** Fabrizio Pandini (VMware)

**译者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
What a journey so far!

Starting from the initial blog post [“How we made Kubernetes insanely easy to install”](/blog/2016/09/how-we-made-kubernetes-easy-to-install/) in September 2016, followed by an exciting growth that lead to general availability / [“Production-Ready Kubernetes Cluster Creation with kubeadm”](/blog/2018/12/04/production-ready-kubernetes-cluster-creation-with-kubeadm/) two years later.

And later on a continuous, steady and reliable flow of small improvements that is still going on as of today.
-->
回首向来萧瑟处，七年光阴风雨路！

从 2016 年 9 月发表第一篇博文
[How we made Kubernetes insanely easy to install](/blog/2016/09/how-we-made-kubernetes-easy-to-install/)
开始，kubeadm 经历了令人激动的成长旅程，两年后随着
[Production-Ready Kubernetes Cluster Creation with kubeadm](/blog/2018/12/04/production-ready-kubernetes-cluster-creation-with-kubeadm/)
这篇博文的发表进阶为正式发布。

此后，持续、稳定且可靠的系列小幅改进一直延续至今。

<!--
## What is kubeadm? (quick refresher)

kubeadm is focused on bootstrapping Kubernetes clusters on existing infrastructure and performing an essential set of maintenance tasks. The core of the kubeadm interface is quite simple: new control plane nodes
are created by running [`kubeadm init`](/docs/reference/setup-tools/kubeadm/kubeadm-init/) and
worker nodes are joined to the control plane by running
[`kubeadm join`](/docs/reference/setup-tools/kubeadm/kubeadm-join/).
Also included are utilities for managing already bootstrapped clusters, such as control plane upgrades
and token and certificate renewal.
-->
## 什么是 kubeadm？（简要回顾）

kubeadm 专注于在现有基础设施上启动引导 Kubernetes 集群并执行一组重要的维护任务。
kubeadm 接口的核心非常简单：通过运行
[`kubeadm init`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/)
创建新的控制平面节点，通过运行
[`kubeadm join`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)
将工作节点加入控制平面。此外还有用于管理已启动引导的集群的实用程序，例如控制平面升级、令牌和证书续订等。

<!--
To keep kubeadm lean, focused, and vendor/infrastructure agnostic, the following tasks are out of its scope:
- Infrastructure provisioning
- Third-party networking
- Non-critical add-ons, e.g. for monitoring, logging, and visualization
- Specific cloud provider integrations
-->
为了使 kubeadm 精简、聚焦且与供应商/基础设施无关，以下任务不包括在其范围内：

- 基础设施制备
- 第三方联网
- 例如监视、日志记录和可视化等非关键的插件
- 特定云驱动集成

<!--
Infrastructure provisioning, for example, is left to other SIG Cluster Lifecycle projects, such as the
[Cluster API](https://cluster-api.sigs.k8s.io/). Instead, kubeadm covers only the common denominator
in every Kubernetes cluster: the
[control plane](/docs/concepts/overview/components/#control-plane-components).
The user may install their preferred networking solution and other add-ons on top of Kubernetes
*after* cluster creation.
-->
例如，基础设施制备留给 SIG Cluster Lifecycle 等其他项目来处理，
比如 [Cluster API](https://cluster-api.sigs.k8s.io/)。
kubeadm 仅涵盖每个 Kubernetes 集群中的共同要素：
[控制平面](/zh-cn/docs/concepts/overview/components/#control-plane-components)。
用户可以在集群创建后安装其偏好的联网方案和其他插件。

<!--
Behind the scenes, kubeadm does a lot. The tool makes sure you have all the key components:
etcd, the API server, the scheduler, the controller manager. You can join more control plane nodes
for improving resiliency or join worker nodes for running your workloads. You get cluster DNS
and kube-proxy set up for you. TLS between components is enabled and used for encryption in transit.
-->
kubeadm 在幕后做了大量工作。它确保你拥有所有关键组件：etcd、API 服务器、调度器、控制器管理器。
你可以加入更多的控制平面节点以提高容错性，或者加入工作节点以运行你的工作负载。
kubeadm 还为你设置好了集群 DNS 和 kube-proxy；在各组件之间启用 TLS 用于传输加密。

<!--
## Let's celebrate! Past, present and future of kubeadm

In all and for all kubeadm's story is tightly coupled with Kubernetes' story, and with this amazing community.

Therefore celebrating kubeadm is first of all celebrating this community, a set of people, who joined forces in finding a common ground, a minimum viable tool, for bootstrapping Kubernetes clusters.
-->
## 庆祝 kubeadm 的过去、现在和未来！

总之，kubeadm 的故事与 Kubernetes 深度耦合，也离不开这个令人惊叹的社区。

因此庆祝 kubeadm 首先是庆祝这个社区，一群人共同努力寻找一个共同点，一个最小可行工具，用于启动引导 Kubernetes 集群。

<!--
This tool, was instrumental to the Kubernetes success back in time as well as it is today, and the silver line of kubeadm's value proposition can be summarized in two points

- An obsession in making things deadly simple for the majority of the users: kubeadm init & kubeadm join, that's all you need! 

- A sharp focus on a well-defined problem scope: bootstrapping Kubernetes clusters on existing infrastructure. As our slogan says: *keep it simple, keep it extensible!*
-->
kubeadm 这个工具对 Kubernetes 的成功起到了关键作用，其价值主张可以概括为两点：

- 极致的简单：只需两个命令 kubeadm init 和 kubeadm join 即可完成初始化和接入集群的操作！让大多数用户轻松上手。

- 明确定义的问题范围：专注于在现有基础设施上启动引导 Kubernetes 集群。正如我们的口号所说：**保持简单，保持可扩展！**

<!--
This silver line, this clear contract, is the foundation the entire kubeadm user base relies on, and this post is a celebration for kubeadm's users as well.

We are deeply thankful for any feedback from our users, for the enthusiasm that they are continuously showing for this tool via Slack, GitHub, social media, blogs, in person at every KubeCon or at the various meet ups around the world. Keep going!
-->
这个明确的约定是整个 kubeadm 用户群体所依赖的基石，同时本文也是为了与 kubeadm 的使用者们共同欢庆。

我们由衷感谢用户给予的反馈，感谢他们通过 Slack、GitHub、社交媒体、博客、每次 KubeCon
会面以及各种聚会上持续展现的热情。来看看后续的发展！

<!--
What continues to amaze me after all those years is the great things people are building on top of kubeadm, and as of today there is a strong and very active list of projects doing so:
- [minikube](https://minikube.sigs.k8s.io/)
- [kind](https://kind.sigs.k8s.io/)
- [Cluster API](https://cluster-api.sigs.k8s.io/)
- [Kubespray](https://kubespray.io/)
- and many more; if you are using Kubernetes today, there is a good chance that you are using kubeadm even without knowing it 😜
-->
这么多年来，对人们基于 kubeadm 构建的诸多项目我感到惊叹。迄今已经有很多强大而活跃的项目，例如：

- [minikube](https://minikube.sigs.k8s.io/)
- [kind](https://kind.sigs.k8s.io/)
- [Cluster API](https://cluster-api.sigs.k8s.io/)
- [Kubespray](https://kubespray.io/)
- 还有更多；如果你正在使用 Kubernetes，很可能你甚至不知道自己正在使用 kubeadm 😜

<!--
This community, the kubeadm’s users, the projects building on top of kubeadm are the highlights of kubeadm’s 7th birthday celebration and the foundation for what will come next!
-->
这个社区、kubeadm 的用户以及基于 kubeadm 构建的项目，是 kubeadm 七周年庆典的亮点，也是未来怎么发展的基础！

<!--
Stay tuned, and feel free to reach out to us!
- Try [kubeadm](/docs/setup/) to install Kubernetes today
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
-->
请继续关注我们，并随时与我们联系！

- 现在尝试使用 [kubeadm](/zh-cn/docs/setup/) 安装 Kubernetes
- 在 [GitHub](https://github.com/kubernetes/kubernetes) 参与 Kubernetes 项目
- 在 [Slack](http://slack.k8s.io/) 与社区交流
- 关注我们的 Twitter 账号 [@Kubernetesio](https://twitter.com/kubernetesio)，获取最近更新信息
