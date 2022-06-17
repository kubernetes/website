---
title: " 在 Rancher 中新增對 Kuernetes 的支援 "
date: 2016-04-08
slug: adding-support-for-kubernetes-in-rancher
url: /zh-cn/blog/2016/04/Adding-Support-For-Kubernetes-In-Rancher
---
<!--
---
title: " Adding Support for Kubernetes in Rancher "
date: 2016-04-08
slug: adding-support-for-kubernetes-in-rancher
url: /zh-cn/blog/2016/04/Adding-Support-For-Kubernetes-In-Rancher
---
-->
<!--
_Today’s guest post is written by Darren Shepherd, Chief Architect at Rancher Labs, an open-source software platform for managing containers._ -->
_今天的來賓帖子由 Rancher Labs（用於管理容器的開源軟體平臺）的首席架構師 Darren Shepherd  撰寫。_ 


<!--
Over the last year, we’ve seen a tremendous increase in the number of companies looking to leverage containers in their software development and IT organizations. To achieve this, organizations have been looking at how to build a centralized container management capability that will make it simple for users to get access to containers, while centralizing visibility and control with the IT organization. In 2014 we started the open-source Rancher project to address this by building a management platform for containers.  
-->
在過去的一年中，我們看到希望在其軟體開發和IT組織中利用容器的公司數量激增。
為了實現這一目標，組織一直在研究如何構建集中式的容器管理功能，該功能將使使用者可以輕鬆訪問容器，同時集中管理IT組織的可見性和控制力。
2014年，我們啟動了開源 Rancher 專案，透過構建容器管理平臺來解決此問題。

<!--
Recently we shipped Rancher v1.0. With this latest release, [Rancher](http://www.rancher.com/), an open-source software platform for managing containers, now supports Kubernetes as a container orchestration framework when creating environments. Now, launching a Kubernetes environment with Rancher is fully automated, delivering a functioning cluster in just 5-10 minutes.&nbsp;
-->
最近，我們釋出了 Rancher v1.0。
在此最新版本中，用於管理容器的開源軟體平臺 [Rancher](http://www.rancher.com/) 現在在建立環境時支援 Kubernetes 作為容器編排框架。
現在，使用 Rancher 啟動 Kubernetes 環境是完全自動化的，只需 5 至 10 分鐘即可交付執行正常的叢集。

<!--
We created Rancher to provide organizations with a complete management platform for containers. As part of that, we’ve always supported deploying Docker environments natively using the Docker API and Docker Compose. Since its inception, we’ve been impressed with the operational maturity of Kubernetes, and with this release, we’re making it possible to deploy a variety of container orchestration and scheduling frameworks within the same management platform.&nbsp;  
-->
我們建立 Rancher 的目的是為組織提供完整的容器管理平臺。
作為其中的一部分，我們始終支援使用 Docker API 和 Docker Compose 在本地部署 Docker 環境。
自成立以來， Kubernetes 的運營成熟度給我們留下了深刻的印象，而在此版本中，我們使得其可以在同一管理平臺上部署各種容器編排和排程框架。

<!--
Adding Kubernetes gives users access to one of the fastest growing platforms for deploying and managing containers in production. We’ll provide first-class Kubernetes support in Rancher going forward and continue to support native Docker deployments.&nbsp;  
-->
新增 Kubernetes 使使用者可以訪問增長最快的平臺之一，用於在生產中部署和管理容器。
我們將在 Rancher 中提供一流的 Kubernetes 支援，並將繼續支援本機 Docker 部署。

<!--
**Bringing Kubernetes to Rancher**  
-->
**將 Kubernetes 帶到 Rancher**  

 ![Kubernetes deployment-3.PNG](https://lh6.googleusercontent.com/bhmC1-XO5T-itFN3ZsCQmrxUSSEcnezaL-qch6ILWvJRnbhEBZZlAMEj-RcNgkM9XVEUzsRMsvDGc7u8f-M19Jdk_J0GCoO-gZTCZDtgkokgqNkCgP98o8W29xD0kmKiMPeLN-Tt)
 
<!--
Our platform was already extensible for a variety of different packaging formats, so we were optimistic about embracing Kubernetes. We were right, working with the Kubernetes project has been a fantastic experience as developers. The design of the project made this incredibly easy, and we were able to utilize plugins and extensions to build a distribution of Kubernetes that leveraged our infrastructure and application services. For instance, we were able to plug in Rancher’s software defined networking, storage management, load balancing, DNS and infrastructure management functions directly into Kubernetes, without even changing the code base.
-->
我們的平臺已經可以擴充套件為各種不同的包裝格式，因此我們對擁抱 Kubernetes 感到樂觀。
沒錯，作為開發人員，與 Kubernetes 專案一起工作是一次很棒的經歷。
該專案的設計使這一操作變得異常簡單，並且我們能夠利用外掛和擴充套件來構建 Kubernetes 發行版，從而利用我們的基礎架構和應用程式服務。
例如，我們能夠將 Rancher 的軟體定義的網路，儲存管理，負載平衡，DNS 和基礎結構管理功能直接插入 Kubernetes，而無需更改程式碼庫。


<!--
Even better, we have been able to add a number of services around the core Kubernetes functionality. For instance, we implemented our popular [application catalog on top of Kubernetes](https://github.com/rancher/community-catalog/tree/master/kubernetes-templates). Historically we’ve used Docker Compose to define application templates, but with this release, we now support Kubernetes services, replication controllers and pods to deploy applications. With the catalog, users connect to a git repo and automate deployment and upgrade of an application deployed as Kubernetes services. Users then configure and deploy a complex multi-node enterprise application with one click of a button. Upgrades are fully automated as well, and pushed out centrally to users.
-->
更好的是，我們已經能夠圍繞 Kubernetes 核心功能新增許多服務。
例如，我們在 Kubernetes 上實現了常用的 [應用程式目錄](https://github.com/rancher/community-catalog/tree/master/kubernetes-templates) 。
過去，我們曾使用 Docker Compose 定義應用程式模板，但是在此版本中，我們現在支援 Kubernetes 服務、副本控制器和和 Pod 來部署應用程式。
使用目錄，使用者可以連線到 git 倉庫並自動部署和升級作為 Kubernetes 服務部署的應用。
然後，使用者只需單擊一下按鈕，即可配置和部署複雜的多節點企業應用程式。
升級也是完全自動化的，並集中向用戶推出。


<!--
**Giving Back**
-->
**回饋**

<!--
Like Kubernetes, Rancher is an open-source software project, free to use by anyone, and given to the community without any restrictions. You can find all of the source code, upcoming releases and issues for Rancher on [GitHub](http://www.github.com/rancher/rancher). We’re thrilled to be joining the Kubernetes community, and look forward to working with all of the other contributors. View a demo of the new Kubernetes support in Rancher [here](http://rancher.com/kubernetes/).&nbsp;
-->
與 Kubernetes 一樣，Rancher 是一個開源軟體專案，任何人均可免費使用，並且不受任何限制地分發給社群。
您可以在 [GitHub](http://www.github.com/rancher/rancher) 上找到 Rancher 的所有原始碼，即將釋出的版本和問題。
我們很高興加入 Kubernetes 社群，並期待與所有其他貢獻者合作。
在Rancher [here](http://rancher.com/kubernetes/) 中檢視有關 Kubernetes 新支援的演示。&nbsp;

<!--
_-- Darren Shepherd, Chief Architect, Rancher Labs_
-->
_-- Rancher Labs 首席架構師 Darren Shepherd_
