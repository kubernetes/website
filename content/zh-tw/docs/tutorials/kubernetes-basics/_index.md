---
title: 學習 Kubernetes 基礎知識
main_menu: true
no_list: true
weight: 20
content_type: concept
card:
  name: tutorials
  weight: 20
  title: 基礎知識介紹
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
本教程介紹 Kubernetes 叢集編排系統的基礎知識。每個模塊包含關於
Kubernetes 主要特性和概念的一些背景資訊，還包括一個在線教程供你學習。

使用本教程，你可以學習到：

* 在叢集中部署容器化應用。
* 改變部署的規模。
* 更新容器化應用以使用新的軟體版本。
* 調試容器化應用。

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
## Kubernetes 可以爲你做些什麼?

通過使用現代的 Web 服務，使用者希望應用能夠 24/7 全天候可用，開發人員希望每天可以多次部署應用的更新版本。
容器化可以幫助打包軟體以達成這些目標，使應用能夠以簡單快速的方式被髮布和更新，而不會出現中斷。
Kubernetes 幫助你確保這些容器化應用在你想要的時間和地點運行，並幫助應用找到它們需要的資源和工具。
Kubernetes 是一個可用於生產環境的開源平臺，基於 Google 在容器叢集方面積累的經驗，
設計上融合了來自社區的最佳實踐。

<!--
## Kubernetes Basics Modules
-->
## Kubernetes 基礎知識模塊

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
      path="/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_01.svg?v=1469803628347"
      alt="模塊一"
      title="1.  創建一個 Kubernetes 叢集" >}}

  <!--
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347"
      alt="Module 2"
      title="2. Deploy an app" >}}
  -->
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347"
      alt="模塊二"
      title="2. 部署一個應用" >}}

  <!--
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/explore/explore-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347"
      alt="Module 3"
      title="3. Explore your app" >}}
  -->
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/explore/explore-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347"
      alt="模塊三"
      title="3. 訪問你的應用" >}}

  <!--
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/expose/expose-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347"
      alt="Module 4"
      title="4. Expose your app publicly" >}}
  -->
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/expose/expose-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347"
      alt="模塊四"
      title="4. 公開發布你的應用" >}}

  <!--
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/scale/scale-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347"
      alt="Module 5"
      title="5. Scale up your app" >}}
  -->
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/scale/scale-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347"
      alt="模塊五"
      title="5. 擴大你的應用規模" >}}

  <!--
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/update/update-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347"
      alt="Module 6"
      title="6. Update your app" >}}
  -->
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/update/update-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347"
      alt="模塊六"
      title="6. 更新你的應用" >}}
{{< /tutorials/modules >}}

## {{% heading "whatsnext" %}}

<!--
* Tutorial [Using Minikube to Create a Cluster](/docs/tutorials/kubernetes-basics/create-cluster/)
-->
* [使用 Minikube 創建一個叢集](/zh-cn/docs/tutorials/kubernetes-basics/create-cluster/)的教程
