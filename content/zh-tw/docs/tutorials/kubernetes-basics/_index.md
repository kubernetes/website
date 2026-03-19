---
title: 學習 Kubernetes 基礎
main_menu: true
no_list: true
weight: 20
content_type: concept
card:
  name: tutorials
  weight: 20
  title: 基礎概念導覽
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
本教學將帶您逐步了解 Kubernetes 叢集編排系統的基礎。
每個模組都包含 Kubernetes 主要功能和概念的背景介紹，以及可供您逐步操作的教學。

透過這些教學，您將學會：

* 在叢集上部署容器化應用程式。
* 擴展 Deployment。
* 將容器化應用程式更新至新版本。
* 為容器化應用程式除錯。

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
## Kubernetes 能為您做什麼？

在現代 Web 服務中，使用者期望應用程式能夠全天候運作，而開發人員則期望每天能多次部署新版本。
容器化技術有助於封裝軟體以達成這些目標，讓應用程式能夠在不停機的情況下發佈與更新。
Kubernetes 可確保容器化應用程式依照您的需求在指定的位置與時機運行，並協助取得運作所需的資源與相關工具。
Kubernetes 是一個可用於正式環境的開源平台，結合了 Google 在容器編排方面累積的豐富經驗，以及來自社群的最佳實踐。

<!--
## Kubernetes Basics Modules
-->
## Kubernetes 基礎模組

<!-- For translators, translate only the values of the 'alt' and 'title' keys -->
{{< tutorials/modules >}}
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_01.svg?v=1469803628347"
      alt="模組 1"
      title="1. 建立 Kubernetes 叢集" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347"
      alt="模組 2"
      title="2. 部署應用程式" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/explore/explore-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347"
      alt="模組 3"
      title="3. 探索應用程式" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/expose/expose-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347"
      alt="模組 4"
      title="4. 公開應用程式" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/scale/scale-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347"
      alt="模組 5"
      title="5. 擴展應用程式規模" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/update/update-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347"
      alt="模組 6"
      title="6. 更新應用程式" >}}
{{< /tutorials/modules >}}

## {{% heading "whatsnext" %}}

<!--
* See the [Learning environment](/docs/setup/learning-environment/) page to learn more about practice clusters and how you can run your own one.
* Tutorial [Using Minikube to Create a Cluster](/docs/tutorials/kubernetes-basics/create-cluster/)
-->
* 請參閱[學習環境](/zh-tw/docs/setup/learning-environment/)頁面，以深入了解練習用叢集，以及如何自行建立叢集。
* 教學：[使用 Minikube 建立叢集](/zh-tw/docs/tutorials/kubernetes-basics/create-cluster/)
