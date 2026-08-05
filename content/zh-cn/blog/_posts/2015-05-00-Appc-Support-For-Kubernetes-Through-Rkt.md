---
title: " 通过 RKT 对 Kubernetes 的 AppC 支持 "
date: 2015-05-04
slug: appc-support-for-kubernetes-through-rkt
---
<!--
title: " AppC Support for Kubernetes through RKT "
date: 2015-05-04
slug: appc-support-for-kubernetes-through-rkt
url: /blog/2015/05/Appc-Support-For-Kubernetes-Through-Rkt
-->

<!--
We very recently accepted a pull request to the Kubernetes project to add appc support for the Kubernetes community. &nbsp;Appc is a new open container specification that was initiated by CoreOS, and is supported through CoreOS rkt container runtime.
-->
我们最近接受了对 Kubernetes 项目的拉取请求，以增加对 Kubernetes 社区的应用程序支持。 &nbsp;AppC 是由 CoreOS 发起的新的开放容器规范，并通过 CoreOS rkt 容器运行时受到支持。

<!--
This is an important step forward for the Kubernetes project and for the broader containers community. &nbsp;It adds flexibility and choice to the container-verse and brings the promise of &nbsp;compelling new security and performance capabilities to the Kubernetes developer.
-->
对于Kubernetes项目和更广泛的容器社区而言，这是重要的一步。 &nbsp;它为容器语言增加了灵活性和选择余地，并为Kubernetes开发人员带来了令人信服的新安全性和性能功能。

<!--
Container based runtimes (like Docker or rkt) when paired with smart orchestration technologies (like Kubernetes and/or Apache Mesos) are a legitimate disruption to the way that developers build and run their applications. &nbsp;While the supporting technologies are relatively nascent, they do offer the promise of some very powerful new ways to assemble, deploy, update, debug and extend solutions. &nbsp;I believe that the world has not yet felt the full potential of containers and the next few years are going to be particularly exciting! &nbsp;With that in mind it makes sense for several projects to emerge with different properties and different purposes. It also makes sense to be able to plug together different pieces (whether it be the container runtime or the orchestrator) based on the specific needs of a given application.
-->
与智能编排技术（例如 Kubernetes 和/或 Apache Mesos）配合使用时，基于容器的运行时（例如 Docker 或 rkt）对开发人员构建和运行其应用程序的方式是一种合法干扰。 &nbsp;尽管支持技术还处于新生阶段，但它们确实为组装，部署，更新，调试和扩展解决方案提供了一些非常强大的新方法。 &nbsp;我相信，世界还没有意识到容器的全部潜力，未来几年将特别令人兴奋！ &nbsp;考虑到这一点，有几个具有不同属性和不同目的的项目才有意义。能够根据给定应用程序的特定需求将不同的部分（无论是容器运行时还是编排工具）插入在一起也是有意义的。

<!--
Docker has done an amazing job of democratizing container technologies and making them accessible to the outside world, and we expect Kubernetes to support Docker indefinitely. CoreOS has also started to do interesting work with rkt to create an elegant, clean, simple and open platform that offers some really interesting properties. &nbsp;It looks poised deliver a secure and performant operating environment for containers. &nbsp;The Kubernetes team has been working with the appc team at CoreOS for a while and in many ways they built rkt with Kubernetes in mind as a simple pluggable runtime component. &nbsp;
-->
Docker 在使容器技术民主化并使外界可以访问它们方面做得非常出色，我们希望 Kubernetes 能够无限期地支持 Docker。CoreOS 还开始与 rkt 进行有趣的工作，以创建一个优雅，干净，简单和开放的平台，该平台提供了一些非常有趣的属性。 &nbsp;这看起来蓄势待发，可以为容器提供安全，高性能的操作环境。 &nbsp;Kubernetes 团队已经与 CoreOS 的 appc 团队合作了一段时间，在许多方面，他们都将 Kubernetes 作为简单的可插入运行时组件来构建 rkt。 &nbsp;

<!--
The really nice thing is that with Kubernetes you can now pick the container runtime that works best for you based on your workloads’ needs, change runtimes without having the replace your cluster environment, or even mix together applications where different parts are running in different container runtimes in the same cluster. &nbsp;Additional choices can’t help but ultimately benefit the end developer.
-->
真正的好处是，借助 Kubernetes，您现在可以根据工作负载的需求选择最适合您的容器运行时，无需替换集群环境即可更改运行时，甚至可以将在同一集群中在不同容器中运行的应用程序的不同部分混合在一起。 &nbsp;其他选择无济于事，但最终使最终开发人员受益。

<!--
-- Craig McLuckie  
Google Product Manager and Kubernetes co-founder  
-->
-- Craig McLuckie
Google 产品经理和 Kubernetes 联合创始人
