---
title: " Kubernetes 1.1 性能升级，工具改进和社区不断壮大  "
date: 2015-11-09
slug: kubernetes-1-1-performance-upgrades-improved-tooling-and-a-growing-community
---
<!--
title: " Kubernetes 1.1 Performance upgrades, improved tooling and a growing community  "
date: 2015-11-09
slug: kubernetes-1-1-performance-upgrades-improved-tooling-and-a-growing-community
url: /blog/2015/11/Kubernetes-1-1-Performance-Upgrades-Improved-Tooling-And-A-Growing-Community
-->

<!--
Since the Kubernetes 1.0 release in July, we’ve seen tremendous adoption by companies building distributed systems to manage their container clusters. We’re also been humbled by the rapid growth of the community who help make Kubernetes better everyday. We have seen commercial offerings such as Tectonic by CoreOS and RedHat Atomic Host emerge to deliver deployment and support of Kubernetes. And a growing ecosystem has added Kubernetes support including tool vendors such as Sysdig and Project Calico.  
-->
自从 Kubernetes 1.0 在七月发布以来，我们已经看到大量公司采用建立分布式系统来管理其容器集群。
我们也对帮助 Kubernetes 社区变得更好，迅速发展的人感到钦佩。
我们已经看到诸如 CoreOS 的 Tectonic 和 RedHat Atomic Host 之类的商业产品应运而生，用以提供 Kubernetes 的部署和支持。
一个不断发展的生态系统增加了 Kubernetes 的支持，包括 Sysdig 和 Project Calico 等工具供应商。

<!--
With the help of hundreds of contributors, we’re proud to announce the availability of Kubernetes 1.1, which offers major performance upgrades, improved tooling, and new features that make applications even easier to build and deploy.  
-->
在数百名贡献者的帮助下，我们自豪地宣布 Kubernetes 1.1 的可用性，它提供了主要的性能升级、改进的工具和新特性，使应用程序更容易构建和部署。

<!--
Some of the work we’d like to highlight includes:
-->
我们想强调的一些工作包括:

<!--
- **Substantial performance improvements** : We have architected Kubernetes from day one to handle Google-scale workloads, and our customers have put it through their paces. In Kubernetes 1.1, we have made further investments to ensure that you can run in extremely high-scale environments; later this week, we will be sharing examples of running thousand node clusters, and running over a million QPS against a single cluster.&nbsp;
-->
- **实质性的性能提升** ：从第一天开始，我们就设计了 Kubernetes 来处理 Google 规模的工作负载，而我们的客户已经按照自己的进度进行了调整。
 在 Kubernetes 1.1 中，我们进行了进一步的投资，以确保您可以在超大规模环境中运行；
 本周晚些时候，我们将分享运行数千个节点集群，并针对单个集群运行超过一百万个 QPS 的示例。

<!--
- **Significant improvement in network throughput** : Running Google-scale workloads also requires Google-scale networking. In Kubernetes 1.1, we have included an option to use native IP tables offering an 80% reduction in tail latency, an almost complete elimination of CPU overhead and improvements in reliability and system architecture ensuring Kubernetes can handle high-scale throughput well into the future.&nbsp;
-->
- **网络吞吐量显着提高** : 运行 Google 规模的工作负载也需要 Google 规模的网络。
 在 Kubernetes 1.1 中，我们提供了使用本机IP表的选项，可将尾部延迟减少80％，几乎完全消除了CPU开销，并提高了可靠性和系统架构，从而确保Kubernetes可以很好地处理未来的大规模吞吐量。 

<!--
- **Horizontal pod autoscaling (Beta)**: Many workloads can go through spiky periods of utilization, resulting in uneven experiences for your users. Kubernetes now has support for horizontal pod autoscaling, meaning your pods can scale up and down based on CPU usage. Read more about [Horizontal pod autoscaling](http://kubernetes.io/v1.1/docs/user-guide/horizontal-pod-autoscaler.html).&nbsp;
-->
- **水平 Pod 自动缩放 (测试版)**：许多工作负载可能会经历尖峰的使用期，从而给用户带来不均匀的体验。
 Kubernetes 现在支持水平 Pod 自动缩放，这意味着您的 Pod 可以根据 CPU 使用率进行缩放。
 阅读有关[水平 Pod 自动缩放](http://kubernetes.io/v1.1/docs/user-guide/horizontal-pod-autoscaler.html)的更多信息。

<!--
- **HTTP load balancer (Beta)**: Kubernetes now has the built-in ability to route HTTP traffic based on the packets introspection. This means you can have ‘http://foo.com/bar’ go to one service, and ‘http://foo.com/meep’ go to a completely independent service. Read more about the [Ingress object](http://kubernetes.io/v1.1/docs/user-guide/ingress.html).&nbsp;
-->
- **HTTP 负载均衡器 (测试版)**：Kubernetes 现在具有基于数据包自省功能来路由 HTTP 流量的内置功能。
 这意味着您可以让 ‘http://foo.com/bar’ 使用一项服务，而 ‘http://foo.com/meep’ 使用一项完全独立的服务。
 阅读有关[Ingress对象](http://kubernetes.io/v1.1/docs/user-guide/ingress.html)的更多信息。

<!--
- **Job objects (Beta)**: We’ve also had frequent request for integrated batch jobs, such as processing a batch of images to create thumbnails or a particularly large data file that has been broken down into many chunks. [Job objects](https://github.com/kubernetes/kubernetes/blob/master/docs/user-guide/jobs.md#writing-a-job-spec) introduces a new API object that runs a workload, restarts it if it fails, and keeps trying until it’s successfully completed. Read more about the[Job object](http://kubernetes.io/v1.1/docs/user-guide/jobs.html).&nbsp;
-->
- **Job 对象 (测试版)**：我们也经常需要集成的批处理 Job ，例如处理一批图像以创建缩略图，或者将特别大的数据文件分解成很多块。
 [Job 对象](https://github.com/kubernetes/kubernetes/blob/master/docs/user-guide/jobs.md#writing-a-job-spec)引入了一个新的 API 对象，该对象运行工作负载，
如果失败，则重新启动它，并继续尝试直到成功完成。
 阅读有关[Job 对象](http://kubernetes.io/v1.1/docs/user-guide/jobs.html)的更多信息。

<!--
- **New features to shorten the test cycle for developers** : We continue to work on making developing for applications for Kubernetes quick and easy. Two new features that speeds developer’s workflows include the ability to run containers interactively, and improved schema validation to let you know if there are any issues with your configuration files before you deploy them.&nbsp;
-->
- **新功能可缩短开发人员的测试周期** :我们将继续致力于快速便捷地为 Kubernetes 开发应用程序。
 加快开发人员工作流程的两项新功能包括以交互方式运行容器的功能，以及改进的架构验证功能，可在部署配置文件之前让您知道配置文件是否存在任何问题。

<!--
- **Rolling update improvements** : Core to the DevOps movement is being able to release new updates without any affect on a running service. Rolling updates now ensure that updated pods are healthy before continuing the update.&nbsp;
-->
- **滚动更新改进** : DevOps 运动的核心是能够发布新更新，而不会影响正在运行的服务。
 滚动更新现在可确保在继续更新之前，已更新的 Pod 状况良好。

<!--
- And many more. For a complete list of updates, see the [1.1. release](https://github.com/kubernetes/kubernetes/releases) notes on GitHub&nbsp;
-->
- 还有很多。有关更新的完整列表，请参见[1.1. 发布](https://github.com/kubernetes/kubernetes/releases)在GitHub上的笔记

<!--
Today, we’re also proud to mark the inaugural Kubernetes conference, [KubeCon](https://kubecon.io/), where some 400 community members along with dozens of vendors are in attendance supporting the Kubernetes project.  
-->
今天，我们也很荣幸地庆祝首届Kubernetes会议[KubeCon](https://kubecon.io/)，约有400个社区成员以及数十个供应商参加支持 Kubernetes 项目的会议。

<!--
We’d love to highlight just a few of the many partners making Kubernetes better:  
-->
我们想强调几个使 Kubernetes 变得更好的众多合作伙伴中的几位：

<!--
> “We are betting our major product, Tectonic – which enables any company to deploy, manage and secure its containers anywhere – on Kubernetes because we believe it is the future of the data center. The release of Kubernetes 1.1 is another major milestone that will create more widespread adoption of distributed systems and containers, and puts us on a path that will inevitably lead to a whole new generation of products and services.” – Alex Polvi, CEO, CoreOS.
-->
> “我们押注我们的主要产品 Tectonic-它能使任何公司都能在任何地方部署、管理和保护其容器-在 Kubernetes 上使用，因为我们认为这是数据中心的未来。
  Kubernetes 1.1 的发布是另一个重要的里程碑，它将使分布式系统和容器得到更广泛的采用，并使我们走上一条必将导致新一代产品和服务的道路。” – CoreOS 首席执行官Alex Polvi

<!--
> “Univa’s customers are looking for scalable, enterprise-caliber solutions to simplify managing container and non-container workloads in the enterprise. We selected Kubernetes as a foundational element of our new Navops suite which will help IT and DevOps rapidly integrate containerized workloads into their production systems and extend these workloads into cloud services.” – Gary Tyreman, CEO, Univa.
-->
> “Univa 的客户正在寻找可扩展的企业级解决方案，以简化企业中容器和非容器工作负载的管理。
 我们选择Kubernetes作为我们新的 Navops 套件的基础，它将帮助 IT 和 DevOps 将容器化工作负载快速集成到他们的生产系统中，并将这些工作负载扩展到云服务中。” – Univa 首席执行官 Gary Tyreman

<!--
> “The tremendous customer demand we’re seeing to run containers at scale with Kubernetes is a critical element driving growth in our professional services business at Redapt. As a trusted advisor, it’s great to have a tool like Kubernetes in our tool belt to help our customers achieve their objectives.” – Paul Welch, SR VP Cloud Solutions, Redapt
-->
> “我们看到通过 Kubernetes 大规模运行容器的巨大客户需求是推动 Redapt 专业服务业务增长的关键因素。
  作为值得信赖的顾问，在我们的工具带中有像 Kubernetes 这样的工具能够帮助我们的客户实现他们的目标，这是非常棒的。“ – Redapt SR 云解决方案副总裁 Paul Welch 
>
<!--
As we mentioned above, we would love your help:  
-->
如上所述，我们希望得到您的帮助:

<!--
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)&nbsp;
- Connect with the community on [Slack](http://slack.kubernetes.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates&nbsp;
- Post questions (or answer questions) on Stackoverflow&nbsp;
- Get started running, deploying, and using Kubernetes [guides](/docs/tutorials/kubernetes-basics/);
-->
- 在 [GitHub](https://github.com/kubernetes/kubernetes)上参与 Kubernetes 项目；
- 通过 [Slack](http://slack.kubernetes.io/) 与社区联系；
- 关注我们的 Twitter [@Kubernetesio](https://twitter.com/kubernetesio) 获取最新信息；
- 在 Stackoverflow 上发布问题（或回答问题）
- 开始运行，部署和使用 Kubernetes [指南](/docs/tutorials/kubernetes-basics/)；

<!--
But, most of all, just let us know how you are transforming your business using Kubernetes, and how we can help you do it even faster. Thank you for your support!  
-->
但是，最重要的是，请让我们知道您是如何使用 Kubernetes 改变您的业务的，以及我们如何可以帮助您更快地做到这一点。谢谢您的支持!

<!--
&nbsp;- David Aronchick, Senior Product Manager for Kubernetes and Google Container Engine
-->
&nbsp;- David Aronchick, Kubernetes 和谷歌容器引擎的高级产品经理

