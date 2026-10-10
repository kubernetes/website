---
layout: blog
title: "你的集群准备好使用 v1.24 版本了吗？"
date: 2022-03-31
slug: ready-for-dockershim-removal
---
<!--
layout: blog
title: "Is Your Cluster Ready for v1.24?"
date: 2022-03-31
slug: ready-for-dockershim-removal
-->

<!--
**Author:** Kat Cosgrove
-->
**作者:** Kat Cosgrove


<!--
Way back in December of 2020, Kubernetes announced the [deprecation of Dockershim](/blog/2020/12/02/dont-panic-kubernetes-and-docker/). In Kubernetes, dockershim is a software shim that allows you to use the entire Docker engine as your container runtime within Kubernetes. In the upcoming v1.24 release, we are removing Dockershim - the delay between deprecation and removal in line with the [project’s policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/) of supporting features for at least one year after deprecation. If you are a cluster operator, this guide includes the practical realities of what you need to know going into this release. Also, what do you need to do to ensure your cluster doesn’t fall over!
-->
早在 2020 年 12 月，Kubernetes 就宣布[弃用 Dockershim](/zh-cn/blog/2020/12/02/dont-panic-kubernetes-and-docker/)。
在 Kubernetes 中，dockershim 是一个软件 shim，
它允许你将整个 Docker 引擎用作 Kubernetes 中的容器运行时。
在即将发布的 v1.24 版本中，我们将移除 Dockershim - 
在宣布弃用之后到彻底移除这段时间内，我们至少预留了一年的时间继续支持此功能，
这符合相关的[项目策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。 
如果你是集群操作员，则该指南包含你在此版本中需要了解的实际情况。
另外还包括你需要做些什么来确保你的集群不会崩溃！

<!--
## First, does this even affect you?
-->
## 首先，这对你有影响吗？

<!--
If you are rolling your own cluster or are otherwise unsure whether or not this removal affects you, stay on the safe side and [check to see if you have any dependencies on Docker Engine](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/). Please note that using Docker Desktop to build your application containers is not a Docker dependency for your cluster. Container images created by Docker are compliant with the [Open Container Initiative (OCI)](https://opencontainers.org/), a Linux Foundation governance structure that defines industry standards around container formats and runtimes. They will work just fine on any container runtime supported by Kubernetes.
-->
如果你正在管理自己的集群或不确定此删除是否会影响到你，
请保持安全状态并[检查你对 Docker Engine 是否有依赖](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)。 
请注意，使用 Docker Desktop 构建应用程序容器并不算是集群对 Docker 有依赖。
Docker 创建的容器镜像符合 [Open Container Initiative (OCI)](https://opencontainers.org/) 规范，
而 OCI 是 Linux 基金会的一种治理架构，负责围绕容器格式和运行时定义行业标准。 
这些镜像可以在 Kubernetes 支持的任何容器运行时上正常工作。

<!--
If you are using a managed Kubernetes service from a cloud provider, and you haven’t explicitly changed the container runtime, there may be nothing else for you to do. Amazon EKS, Azure AKS, and Google GKE all default to containerd now, though you should make sure they do not need updating if you have any node customizations. To check the runtime of your nodes, follow [Find Out What Container Runtime is Used on a Node](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).
-->
如果你使用的是云服务提供商管理的 Kubernetes 服务，
并且你确定没有更改过容器运行时，那么你可能不需要做任何事情。 
Amazon EKS、Azure AKS 和 Google GKE 现在都默认使用 containerd，
但如果你的集群中有任何自定义的节点，你要确保它们不需要被更新。
要检查节点的运行时，请参考[查明节点上所使用的容器运行时](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/)。

<!--
Regardless of whether you are rolling your own cluster or using a managed Kubernetes service from a cloud provider, you may need to [migrate telemetry or security agents that rely on Docker Engine](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/). 
-->
无论你是在管理自己的集群还是使用云服务提供商管理的 Kubernetes 服务，
你可能都需要[迁移依赖 Docker Engine 的遥测或安全代理](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)。

<!--
## I have a Docker dependency. What now?
-->
## 我对 Docker 有依赖。现在该怎么办？

<!--
If your Kubernetes cluster depends on Docker Engine and you intend to upgrade to Kubernetes v1.24 (which you should eventually do for security and similar reasons), you will need to change your container runtime from Docker Engine to something else or use [cri-dockerd](https://github.com/Mirantis/cri-dockerd). Since [containerd](https://containerd.io/) is a graduated CNCF project and the runtime within Docker itself, it’s a safe bet as an alternative container runtime. Fortunately, the Kubernetes project has already documented the process of [changing a node’s container runtime](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/), using containerd as an example. Instructions are similar for switching to one of the other supported runtimes.
-->
如果你的 Kubernetes 集群对 Docker Engine 有依赖，
并且你打算升级到 Kubernetes v1.24 版本（出于安全和类似原因，你最终应该这样做），
你需要将容器运行时从 Docker Engine 更改为其他方式或使用 [cri-dockerd](https://github.com/Mirantis/cri-dockerd)。 
由于 [containerd](https://containerd.io/) 是一个已经毕业的 CNCF 项目，
并且是 Docker 本身的运行时，因此用它作为容器运行时的替代方式是一个安全的选择。
幸运的是，Kubernetes 项目已经以 containerd 为例，
提供了[更改节点容器运行时](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/)的过程文档。
切换到其它支持的运行时的操作指令与此类似。

<!--
## I want to upgrade Kubernetes, and I need to maintain compatibility with Docker as a runtime. What are my options?
-->
## 我想升级 Kubernetes，并且我需要保持与 Docker 作为运行时的兼容性。我有哪些选择？

<!--
Fear not, you aren’t being left out in the cold and you don’t have to take the security risk of staying on an old version of Kubernetes. Mirantis and Docker have jointly released, and are maintaining, a replacement for dockershim. That replacement is called [cri-dockerd](https://github.com/Mirantis/cri-dockerd). If you do need to maintain compatibility with Docker as a runtime, install cri-dockerd following the instructions in the project’s documentation.
-->
别担心，你不会被冷落，也不必冒着安全风险继续使用旧版本的 Kubernetes。 
Mirantis 和 Docker 已经联合发布并正在维护 dockershim 的替代品。 
这种替代品称为 [cri-dockerd](https://github.com/Mirantis/cri-dockerd)。 
如果你确实需要保持与 Docker 作为运行时的兼容性，请按照项目文档中的说明安装 cri-dockerd。

<!--
## Is that it?
-->
## 这样就可以了吗？


<!--
Yes. As long as you go into this release aware of the changes being made and the details of your own clusters, and you make sure to communicate clearly with your development teams, it will be minimally dramatic. You may have some changes to make to your cluster, application code, or scripts, but all of these requirements are documented. Switching from using Docker Engine as your runtime to using [one of the other supported container runtimes](/docs/setup/production-environment/container-runtimes/) effectively means removing the middleman, since the purpose of dockershim is to access the container runtime used by Docker itself. From a practical perspective, this removal is better both for you and for Kubernetes maintainers in the long-run.
-->
是的。只要你深入了解此版本所做的变更和你自己集群的详细信息，
并确保与你的开发团队进行清晰的沟通，它的不确定性就会降到最低。 
你可能需要对集群、应用程序代码或脚本进行一些更改，但所有这些要求都已经有说明指导。 
从使用 Docker Engine 作为运行时，切换到使用[其他任何一种支持的容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)，
这意味着移除了中间层的组件，因为 dockershim 的作用是访问 Docker 本身使用的容器运行时。 
从实际角度长远来看，这种移除对你和 Kubernetes 维护者都更有好处。

<!--
If you still have questions, please first check the [Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq/).
-->
如果你仍有疑问，请先查看[弃用 Dockershim 的常见问题](/zh-cn/blog/2022/02/17/dockershim-faq/)。
