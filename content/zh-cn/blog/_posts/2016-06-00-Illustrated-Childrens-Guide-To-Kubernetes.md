---
title: " Kubernetes的儿童指南 "
date: 2016-06-09
slug: illustrated-childrens-guide-to-kubernetes
url: /blog/2016/06/Illustrated-Childrens-Guide-To-Kubernetes
---
<!--
---
title: " The Illustrated Children's Guide to Kubernetes "
date: 2016-06-09
slug: illustrated-childrens-guide-to-kubernetes
url: /blog/2016/06/Illustrated-Childrens-Guide-To-Kubernetes
---
-->
<!--
_Kubernetes is an open source project with a growing community. We love seeing the ways that our community innovates inside and on top of Kubernetes. Deis is an excellent example of company who understands the strategic impact of strong container orchestration. They contribute directly to the project; in associated subprojects; and, delightfully, with a creative endeavor to help our user community understand more about what Kubernetes is. Want to contribute to Kubernetes? One way is to get involved [here](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Ahelp-wanted) and help us with code. But, please don’t consider that the only way to contribute. This little adventure that Deis takes us is an example of how open source isn’t only code.&nbsp;_  
-->

Kubernetes是一个开源项目，社区不断壮大。我们喜欢看到我们的社区在Kubernetes内部和之上创新的方式。Deis是一个很好的例子，说明公司了解强大的容器编排的战略影响。他们直接为项目做出贡献；在相关项目中,令人高兴的是，我们创造性地帮助我们的用户社区更多地了解Kubernetes是什么。想为Kubernetes做贡献吗？一种方法是[在这里]参与进来(https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Ahelp-wanted) 并帮助我们编写代码。但是，请不要认为这是唯一的贡献方式。Deis带给我们的这个小创新就是一个例子，说明开源不仅仅是代码

<!--
_Have your own Kubernetes story you’d like to tell, [let us know](https://docs.google.com/a/google.com/forms/d/1cHiRdmBCEmUH9ekHY2G-KDySk5YXRzALHcMNgzwXtPM/viewform)!_  
_-- @sarahnovotny Community Wonk, Kubernetes project._  

_Guest post is by Beau Vrolyk, CEO of Deis, the open source Kubernetes-native PaaS._  
-->

有你自己想要告诉我的关于Kubernetes的故事[让我们知道](https://docs.google.com/a/google.com/forms/d/1cHiRdmBCEmUH9ekHY2G-KDySk5YXRzALHcMNgzwXtPM/viewform)!
@sarahnovotny Community Wonk, Kubernetes project.

客人邮报由Beau Vrolyk撰写,的DeisCEO，Kubernetes-native PaaS开源社区。

<!--
Over at [Deis](https://deis.com/), we’ve been busy building open source tools for Kubernetes. We’re just about to finish up moving our easy-to-use application platform to Kubernetes and couldn’t be happier with the results. In the Kubernetes project we’ve found not only a growing and vibrant community but also a well-architected system, informed by years of experience running containers at scale.&nbsp;  
-->

在[Deis]上(https://deis.com/),我们一直致力于为Kubernetes构建开源工具。我们即将完成将应用程序平台迁移到Kubernetes的工作，并对结果感到无比满意。在Kubernetes项目中，我们不仅发现了一个不断增长和充满活力的社区，而且还发现了一种架构良好的系统，这得益于多年大规模运行容器的经验；

<!--
But that’s not all! As we’ve decomposed, ported, and reborn our PaaS as a Kubernetes citizen; we found a need for tools to help manage all of the ephemera that comes along with building and running Kubernetes-native applications. The result has been open sourced as [Helm](https://github.com/kubernetes/helm) and we’re excited to see increasing adoption and growing excitement around the project.  
-->

但这还不是全部！当我们把PaaS分解、移植并重生为Kubernetes公民时，发现需要一些工具来帮助管理构建和运行Kubernetes本机应用程序时附带的所有问题。其结果已被开源为[Helm](https://github.com/kubernetes/helm)。我们很高兴看到该项目越来越多地被采用，越来越多的人对此感兴趣。

<!--
There’s fun in the Deis offices too -- we like to add some character to our &nbsp;architecture diagrams and pull requests. This time, literally. Meet Phippy--the intrepid little PHP app--and her journey to Kubernetes. What better way to talk to your parents, friends, and co-workers about this Kubernetes thing you keep going on about, than a little story time. We give to you The Illustrated Children's Guide to Kubernetes, conceived of and narrated by our own Matt Butcher and lovingly illustrated by Bailey Beougher. Join the fun on YouTube and tweet [@opendeis](https://twitter.com/Opendeis) to win your own copy of the book or a squishy little Phippy of your own.  
-->

Deis办公室也很有趣——我们喜欢为我们的办公室增添一些特色；架构图和拉请求，这一次真实的认识Phippy——一款无畏的小PHP应用程序——以及她的Kubernetes的旅程。有什么比一个小故事时间更好的方式来和你的父母、朋友和同事谈论你一直在谈论的Kubernetes的事情呢。我们为您提供了《库伯内特斯儿童指南》，由我们自己的马特·布彻构思和讲述，贝利·贝厄尔精心绘制。加入你的Tube和tweet[@opendeis]上的乐趣(https://twitter.com/Opendeis)，并赢得自己的书或小飞鱼。
