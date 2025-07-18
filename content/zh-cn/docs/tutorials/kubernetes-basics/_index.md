---
title: 学习 Kubernetes 基础知识
main_menu: true
no_list: true
weight: 20
content_type: concept
card:
  name: tutorials
  weight: 20
  title: 基础知识介绍
---
<!--
title: Learn Kubernetes Basics
main_menu: true
no_list: true
weight: 20
content_type: concept
card:
  name: tutorials
  weight: 20
  title: Walkthrough the basics
-->

## {{% heading "objectives" %}}

<!--
This tutorial provides a walkthrough of the basics of the Kubernetes cluster orchestration
system. Each module contains some background information on major Kubernetes features
and concepts, and a tutorial for you to follow along.

Using the tutorials, you can learn to:

* Deploy a containerized application on a cluster.
* Scale the deployment.
* Update the containerized application with a new software version.
* Debug the containerized application.
-->
本教程介绍 Kubernetes 集群编排系统的基础知识。每个模块包含关于
Kubernetes 主要特性和概念的一些背景信息，还包括一个在线教程供你学习。

使用本教程，你可以学习到：

* 在集群中部署容器化应用。
* 改变部署的规模。
* 更新容器化应用以使用新的软件版本。
* 调试容器化应用。

<!--
## What can Kubernetes do for you?

With modern web services, users expect applications to be available 24/7, and developers
expect to deploy new versions of those applications several times a day. Containerization
helps package software to serve these goals, enabling applications to be released and updated
without downtime. Kubernetes helps you make sure those containerized applications run where
and when you want, and helps them find the resources and tools they need to work. Kubernetes
is a production-ready, open source platform designed with Google's accumulated experience in
container orchestration, combined with best-of-breed ideas from the community.
-->
## Kubernetes 可以为你做些什么?

通过使用现代的 Web 服务，用户希望应用能够 24/7 全天候可用，开发人员希望每天可以多次部署应用的更新版本。
容器化可以帮助打包软件以达成这些目标，使应用能够以简单快速的方式被发布和更新，而不会出现中断。
Kubernetes 帮助你确保这些容器化应用在你想要的时间和地点运行，并帮助应用找到它们需要的资源和工具。
Kubernetes 是一个可用于生产环境的开源平台，基于 Google 在容器集群方面积累的经验，
设计上融合了来自社区的最佳实践。

<!--
## Kubernetes Basics Modules
-->
## Kubernetes 基础知识模块

<!-- For translators, translate only the values of the ‘alt’ and ‘title’ keys -->
{{< tutorials/modules >}}
  <!--
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_01.svg?v=1469803628347"
      alt="Module 1"
      title="1. Create a Kubernetes cluster" >}}
  -->
  {{< tutorials/module
      path="/zh-cn/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_01.svg?v=1469803628347"
      alt="模块一"
      title="1.  创建一个 Kubernetes 集群" >}}

  <!--
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347"
      alt="Module 2"
      title="2. Deploy an app" >}}
  -->
  {{< tutorials/module
      path="/zh-cn/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347"
      alt="模块二"
      title="2. 部署一个应用" >}}

  <!--
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/explore/explore-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347"
      alt="Module 3"
      title="3. Explore your app" >}}
  -->
  {{< tutorials/module
      path="/zh-cn/docs/tutorials/kubernetes-basics/explore/explore-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347"
      alt="模块三"
      title="3. 访问你的应用" >}}

  <!--
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/expose/expose-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347"
      alt="Module 4"
      title="4. Expose your app publicly" >}}
  -->
  {{< tutorials/module
      path="/zh-cn/docs/tutorials/kubernetes-basics/expose/expose-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347"
      alt="模块四"
      title="4. 公开发布你的应用" >}}

  <!--
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/scale/scale-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347"
      alt="Module 5"
      title="5. Scale up your app" >}}
  -->
  {{< tutorials/module
      path="/zh-cn/docs/tutorials/kubernetes-basics/scale/scale-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347"
      alt="模块五"
      title="5. 扩大你的应用规模" >}}

  <!--
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/update/update-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347"
      alt="Module 6"
      title="6. Update your app" >}}
  -->
  {{< tutorials/module
      path="/zh-cn/docs/tutorials/kubernetes-basics/update/update-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347"
      alt="模块六"
      title="6. 更新你的应用" >}}
{{< /tutorials/modules >}}

## {{% heading "whatsnext" %}}

<!--
* Tutorial [Using Minikube to Create a Cluster](/docs/tutorials/kubernetes-basics/create-cluster/)
-->
* [使用 Minikube 创建一个集群](/zh-cn/docs/tutorials/kubernetes-basics/create-cluster/)的教程
