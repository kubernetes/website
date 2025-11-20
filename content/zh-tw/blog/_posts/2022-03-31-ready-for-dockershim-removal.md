---
layout: blog
title: "你的叢集準備好使用 v1.24 版本了嗎？"
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
早在 2020 年 12 月，Kubernetes 就宣佈[棄用 Dockershim](/zh-cn/blog/2020/12/02/dont-panic-kubernetes-and-docker/)。
在 Kubernetes 中，dockershim 是一個軟體 shim，
它允許你將整個 Docker 引擎用作 Kubernetes 中的容器運行時。
在即將發佈的 v1.24 版本中，我們將移除 Dockershim - 
在宣佈棄用之後到徹底移除這段時間內，我們至少預留了一年的時間繼續支持此功能，
這符合相關的[項目策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。 
如果你是叢集操作員，則該指南包含你在此版本中需要了解的實際情況。
另外還包括你需要做些什麼來確保你的叢集不會崩潰！

<!--
## First, does this even affect you?
-->
## 首先，這對你有影響嗎？

<!--
If you are rolling your own cluster or are otherwise unsure whether or not this removal affects you, stay on the safe side and [check to see if you have any dependencies on Docker Engine](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/). Please note that using Docker Desktop to build your application containers is not a Docker dependency for your cluster. Container images created by Docker are compliant with the [Open Container Initiative (OCI)](https://opencontainers.org/), a Linux Foundation governance structure that defines industry standards around container formats and runtimes. They will work just fine on any container runtime supported by Kubernetes.
-->
如果你正在管理自己的叢集或不確定此刪除是否會影響到你，
請保持安全狀態並[檢查你對 Docker Engine 是否有依賴](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)。 
請注意，使用 Docker Desktop 構建應用程式容器並不算是叢集對 Docker 有依賴。
Docker 創建的容器映像檔符合 [Open Container Initiative (OCI)](https://opencontainers.org/) 規範，
而 OCI 是 Linux 基金會的一種治理架構，負責圍繞容器格式和運行時定義行業標準。 
這些映像檔可以在 Kubernetes 支持的任何容器運行時上正常工作。

<!--
If you are using a managed Kubernetes service from a cloud provider, and you haven’t explicitly changed the container runtime, there may be nothing else for you to do. Amazon EKS, Azure AKS, and Google GKE all default to containerd now, though you should make sure they do not need updating if you have any node customizations. To check the runtime of your nodes, follow [Find Out What Container Runtime is Used on a Node](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).
-->
如果你使用的是雲服務提供商管理的 Kubernetes 服務，
並且你確定沒有更改過容器運行時，那麼你可能不需要做任何事情。 
Amazon EKS、Azure AKS 和 Google GKE 現在都預設使用 containerd，
但如果你的叢集中有任何自定義的節點，你要確保它們不需要被更新。
要檢查節點的運行時，請參考[查明節點上所使用的容器運行時](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/)。

<!--
Regardless of whether you are rolling your own cluster or using a managed Kubernetes service from a cloud provider, you may need to [migrate telemetry or security agents that rely on Docker Engine](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/). 
-->
無論你是在管理自己的叢集還是使用雲服務提供商管理的 Kubernetes 服務，
你可能都需要[遷移依賴 Docker Engine 的遙測或安全代理](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)。

<!--
## I have a Docker dependency. What now?
-->
## 我對 Docker 有依賴。現在該怎麼辦？

<!--
If your Kubernetes cluster depends on Docker Engine and you intend to upgrade to Kubernetes v1.24 (which you should eventually do for security and similar reasons), you will need to change your container runtime from Docker Engine to something else or use [cri-dockerd](https://github.com/Mirantis/cri-dockerd). Since [containerd](https://containerd.io/) is a graduated CNCF project and the runtime within Docker itself, it’s a safe bet as an alternative container runtime. Fortunately, the Kubernetes project has already documented the process of [changing a node’s container runtime](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/), using containerd as an example. Instructions are similar for switching to one of the other supported runtimes.
-->
如果你的 Kubernetes 叢集對 Docker Engine 有依賴，
並且你打算升級到 Kubernetes v1.24 版本（出於安全和類似原因，你最終應該這樣做），
你需要將容器運行時從 Docker Engine 更改爲其他方式或使用 [cri-dockerd](https://github.com/Mirantis/cri-dockerd)。 
由於 [containerd](https://containerd.io/) 是一個已經畢業的 CNCF 項目，
並且是 Docker 本身的運行時，因此用它作爲容器運行時的替代方式是一個安全的選擇。
幸運的是，Kubernetes 項目已經以 containerd 爲例，
提供了[更改節點容器運行時](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/)的過程文檔。
切換到其它支持的運行時的操作指令與此類似。

<!--
## I want to upgrade Kubernetes, and I need to maintain compatibility with Docker as a runtime. What are my options?
-->
## 我想升級 Kubernetes，並且我需要保持與 Docker 作爲運行時的兼容性。我有哪些選擇？

<!--
Fear not, you aren’t being left out in the cold and you don’t have to take the security risk of staying on an old version of Kubernetes. Mirantis and Docker have jointly released, and are maintaining, a replacement for dockershim. That replacement is called [cri-dockerd](https://github.com/Mirantis/cri-dockerd). If you do need to maintain compatibility with Docker as a runtime, install cri-dockerd following the instructions in the project’s documentation.
-->
別擔心，你不會被冷落，也不必冒着安全風險繼續使用舊版本的 Kubernetes。 
Mirantis 和 Docker 已經聯合發佈並正在維護 dockershim 的替代品。 
這種替代品稱爲 [cri-dockerd](https://github.com/Mirantis/cri-dockerd)。 
如果你確實需要保持與 Docker 作爲運行時的兼容性，請按照項目文檔中的說明安裝 cri-dockerd。

<!--
## Is that it?
-->
## 這樣就可以了嗎？


<!--
Yes. As long as you go into this release aware of the changes being made and the details of your own clusters, and you make sure to communicate clearly with your development teams, it will be minimally dramatic. You may have some changes to make to your cluster, application code, or scripts, but all of these requirements are documented. Switching from using Docker Engine as your runtime to using [one of the other supported container runtimes](/docs/setup/production-environment/container-runtimes/) effectively means removing the middleman, since the purpose of dockershim is to access the container runtime used by Docker itself. From a practical perspective, this removal is better both for you and for Kubernetes maintainers in the long-run.
-->
是的。只要你深入瞭解此版本所做的變更和你自己叢集的詳細資訊，
並確保與你的開發團隊進行清晰的溝通，它的不確定性就會降到最低。 
你可能需要對叢集、應用程式代碼或腳本進行一些更改，但所有這些要求都已經有說明指導。 
從使用 Docker Engine 作爲運行時，切換到使用[其他任何一種支持的容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)，
這意味着移除了中間層的組件，因爲 dockershim 的作用是訪問 Docker 本身使用的容器運行時。 
從實際角度長遠來看，這種移除對你和 Kubernetes 維護者都更有好處。

<!--
If you still have questions, please first check the [Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq/).
-->
如果你仍有疑問，請先查看[棄用 Dockershim 的常見問題](/zh-cn/blog/2022/02/17/dockershim-faq/)。
