---
title: " 在 Rancher 中添加对 Kuernetes 的支持 "
date: 2016-04-08
slug: adding-support-for-kubernetes-in-rancher
---
<!--
title: " Adding Support for Kubernetes in Rancher "
date: 2016-04-08
slug: adding-support-for-kubernetes-in-rancher
url: /blog/2016/04/Adding-Support-For-Kubernetes-In-Rancher
-->
<!--
_Today’s guest post is written by Darren Shepherd, Chief Architect at Rancher Labs, an open-source software platform for managing containers._ -->
_今天的来宾帖子由 Rancher Labs（用于管理容器的开源软件平台）的首席架构师 Darren Shepherd  撰写。_ 


<!--
Over the last year, we’ve seen a tremendous increase in the number of companies looking to leverage containers in their software development and IT organizations. To achieve this, organizations have been looking at how to build a centralized container management capability that will make it simple for users to get access to containers, while centralizing visibility and control with the IT organization. In 2014 we started the open-source Rancher project to address this by building a management platform for containers.  
-->
在过去的一年中，我们看到希望在其软件开发和IT组织中利用容器的公司数量激增。
为了实现这一目标，组织一直在研究如何构建集中式的容器管理功能，该功能将使用户可以轻松访问容器，同时集中管理IT组织的可见性和控制力。
2014年，我们启动了开源 Rancher 项目，通过构建容器管理平台来解决此问题。

<!--
Recently we shipped Rancher v1.0. With this latest release, [Rancher](http://www.rancher.com/), an open-source software platform for managing containers, now supports Kubernetes as a container orchestration framework when creating environments. Now, launching a Kubernetes environment with Rancher is fully automated, delivering a functioning cluster in just 5-10 minutes.&nbsp;
-->
最近，我们发布了 Rancher v1.0。
在此最新版本中，用于管理容器的开源软件平台 [Rancher](http://www.rancher.com/) 现在在创建环境时支持 Kubernetes 作为容器编排框架。
现在，使用 Rancher 启动 Kubernetes 环境是完全自动化的，只需 5 至 10 分钟即可交付运行正常的集群。

<!--
We created Rancher to provide organizations with a complete management platform for containers. As part of that, we’ve always supported deploying Docker environments natively using the Docker API and Docker Compose. Since its inception, we’ve been impressed with the operational maturity of Kubernetes, and with this release, we’re making it possible to deploy a variety of container orchestration and scheduling frameworks within the same management platform.&nbsp;  
-->
我们创建 Rancher 的目的是为组织提供完整的容器管理平台。
作为其中的一部分，我们始终支持使用 Docker API 和 Docker Compose 在本地部署 Docker 环境。
自成立以来， Kubernetes 的运营成熟度给我们留下了深刻的印象，而在此版本中，我们使得其可以在同一管理平台上部署各种容器编排和调度框架。

<!--
Adding Kubernetes gives users access to one of the fastest growing platforms for deploying and managing containers in production. We’ll provide first-class Kubernetes support in Rancher going forward and continue to support native Docker deployments.&nbsp;  
-->
添加 Kubernetes 使用户可以访问增长最快的平台之一，用于在生产中部署和管理容器。
我们将在 Rancher 中提供一流的 Kubernetes 支持，并将继续支持本机 Docker 部署。

<!--
**Bringing Kubernetes to Rancher**  
-->
**将 Kubernetes 带到 Rancher**  

 ![Kubernetes deployment-3.PNG](https://lh6.googleusercontent.com/bhmC1-XO5T-itFN3ZsCQmrxUSSEcnezaL-qch6ILWvJRnbhEBZZlAMEj-RcNgkM9XVEUzsRMsvDGc7u8f-M19Jdk_J0GCoO-gZTCZDtgkokgqNkCgP98o8W29xD0kmKiMPeLN-Tt)
 
<!--
Our platform was already extensible for a variety of different packaging formats, so we were optimistic about embracing Kubernetes. We were right, working with the Kubernetes project has been a fantastic experience as developers. The design of the project made this incredibly easy, and we were able to utilize plugins and extensions to build a distribution of Kubernetes that leveraged our infrastructure and application services. For instance, we were able to plug in Rancher’s software defined networking, storage management, load balancing, DNS and infrastructure management functions directly into Kubernetes, without even changing the code base.
-->
我们的平台已经可以扩展为各种不同的包装格式，因此我们对拥抱 Kubernetes 感到乐观。
没错，作为开发人员，与 Kubernetes 项目一起工作是一次很棒的经历。
该项目的设计使这一操作变得异常简单，并且我们能够利用插件和扩展来构建 Kubernetes 发行版，从而利用我们的基础架构和应用程序服务。
例如，我们能够将 Rancher 的软件定义的网络，存储管理，负载平衡，DNS 和基础结构管理功能直接插入 Kubernetes，而无需更改代码库。


<!--
Even better, we have been able to add a number of services around the core Kubernetes functionality. For instance, we implemented our popular [application catalog on top of Kubernetes](https://github.com/rancher/community-catalog/tree/master/kubernetes-templates). Historically we’ve used Docker Compose to define application templates, but with this release, we now support Kubernetes services, replication controllers and pods to deploy applications. With the catalog, users connect to a git repo and automate deployment and upgrade of an application deployed as Kubernetes services. Users then configure and deploy a complex multi-node enterprise application with one click of a button. Upgrades are fully automated as well, and pushed out centrally to users.
-->
更好的是，我们已经能够围绕 Kubernetes 核心功能添加许多服务。
例如，我们在 Kubernetes 上实现了常用的 [应用程序目录](https://github.com/rancher/community-catalog/tree/master/kubernetes-templates) 。
过去，我们曾使用 Docker Compose 定义应用程序模板，但是在此版本中，我们现在支持 Kubernetes 服务、副本控制器和和 Pod 来部署应用程序。
使用目录，用户可以连接到 git 仓库并自动部署和升级作为 Kubernetes 服务部署的应用。
然后，用户只需单击一下按钮，即可配置和部署复杂的多节点企业应用程序。
升级也是完全自动化的，并集中向用户推出。


<!--
**Giving Back**
-->
**回馈**

<!--
Like Kubernetes, Rancher is an open-source software project, free to use by anyone, and given to the community without any restrictions. You can find all of the source code, upcoming releases and issues for Rancher on [GitHub](http://www.github.com/rancher/rancher). We’re thrilled to be joining the Kubernetes community, and look forward to working with all of the other contributors. View a demo of the new Kubernetes support in Rancher [here](http://rancher.com/kubernetes/).&nbsp;
-->
与 Kubernetes 一样，Rancher 是一个开源软件项目，任何人均可免费使用，并且不受任何限制地分发给社区。
您可以在 [GitHub](http://www.github.com/rancher/rancher) 上找到 Rancher 的所有源代码，即将发布的版本和问题。
我们很高兴加入 Kubernetes 社区，并期待与所有其他贡献者合作。
在Rancher [here](http://rancher.com/kubernetes/) 中查看有关 Kubernetes 新支持的演示。&nbsp;

<!--
_-- Darren Shepherd, Chief Architect, Rancher Labs_
-->
_-- Rancher Labs 首席架构师 Darren Shepherd_
