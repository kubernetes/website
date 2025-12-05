---
title: 關於 dockershim 移除和使用兼容 CRI 運行時的文章
content_type: reference
weight: 20
---

<!-- 
title: Articles on dockershim Removal and on Using CRI-compatible Runtimes
content_type: reference
weight: 20
-->

<!-- overview -->

<!-- 
This is a list of articles and other pages that are either
about the Kubernetes' deprecation and removal of _dockershim_,
or about using CRI-compatible container runtimes,
in connection with that removal.
-->
這是關於 Kubernetes 棄用和移除 **dockershim**
或使用兼容 CRI 的容器運行時相關的文章和其他頁面的列表。

<!-- body -->

<!-- 
## Kubernetes project

* Kubernetes blog: [Dockershim Removal FAQ](/blog/2020/12/02/dockershim-faq/) (originally published 2020/12/02)

* Kubernetes blog: [Updated: Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq/) (updated published 2022/02/17)

* Kubernetes blog: [Kubernetes is Moving on From Dockershim: Commitments and Next Steps](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/) (published 2022/01/07)

* Kubernetes blog: [Dockershim removal is coming. Are you ready?](/blog/2021/11/12/are-you-ready-for-dockershim-removal/) (published 2021/11/12)

* Kubernetes documentation: [Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/)

* Kubernetes documentation: [Container Runtimes](/docs/setup/production-environment/container-runtimes/)

* Kubernetes enhancement proposal: [KEP-2221: Removing dockershim from kubelet](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2221-remove-dockershim/README.md)

* Kubernetes enhancement proposal issue: [Removing dockershim from kubelet](https://github.com/kubernetes/enhancements/issues/2221) (_k/enhancements#2221_)
-->

## Kubernetes 項目 {#kubernetes-project}

* Kubernetes 博客：[Dockershim 移除常見問題解答](/zh-cn/blog/2020/12/02/dockershim-faq/)（最初發表於 2020/12/02）

* Kubernetes 博客：[更新：Dockershim 移除常見問題解答](/zh-cn/blog/2022/02/17/dockershim-faq/)（更新發表於 2020/12/02）

* Kubernetes 博客：[Kubernetes 即將移除 Dockershim：承諾和下一步](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/)（發表於 2022/01/07）

* Kubernetes 博客：[移除 Dockershim 即將到來。你準備好了嗎？](/zh-cn/blog/2021/11/12/are-you-ready-for-dockershim-removal/)（發表於 2021/11/12）

* Kubernetes 文檔：[從 dockershim 遷移](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/)

* Kubernetes 文檔：[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)

* Kubernetes 增強建議：[KEP-2221: 從 kubelet 中移除 dockershim](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2221-remove-dockershim/README.md)

* Kubernetes 增強提問：[從 kubelet 中移除 dockershim](https://github.com/kubernetes/enhancements/issues/2221) (_k/enhancements#2221_)

<!--
You can provide feedback via the GitHub issue [**Dockershim removal feedback & issues**](https://github.com/kubernetes/kubernetes/issues/106917). (_k/kubernetes/#106917_)
-->
你可以通過 GitHub 問題
[**Dockershim 移除反饋和問題**](https://github.com/kubernetes/kubernetes/issues/106917) 提供反饋。 (_k/kubernetes/#106917_)

<!-- 
## External sources {#third-party}
-->
## 外部來源 {#third-party}

<!-- sort these alphabetically -->

<!--
* Amazon Web Services EKS documentation: [Amazon EKS is ending support for Dockershim](https://docs.aws.amazon.com/eks/latest/userguide/dockershim-deprecation.html)

* CNCF conference video: [Lessons Learned Migrating Kubernetes from Docker to containerd Runtime](https://www.youtube.com/watch?v=uDOu6rK4yOk) (Ana Caylin, at KubeCon Europe 2019)

* Docker.com blog: [What developers need to know about Docker, Docker Engine, and Kubernetes v1.20](https://www.docker.com/blog/what-developers-need-to-know-about-docker-docker-engine-and-kubernetes-v1-20/) (published 2020/12/04)

* "_Google Open Source_" channel on YouTube: [Learn Kubernetes with Google - Migrating from Dockershim to Containerd](https://youtu.be/fl7_4hjT52g)

* Microsoft Apps on Azure blog: [Dockershim deprecation and AKS](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/dockershim-deprecation-and-aks/ba-p/3055902) (published 2022/01/21)

* Mirantis blog: [The Future of Dockershim is cri-dockerd](https://www.mirantis.com/blog/the-future-of-dockershim-is-cri-dockerd/) (published 2021/04/21)

* Mirantis: [Mirantis/cri-dockerd](https://mirantis.github.io/cri-dockerd/) Official Documentation

* Tripwire: [How Dockershim’s Forthcoming Deprecation Affects Your Kubernetes](https://www.tripwire.com/state-of-security/security-data-protection/cloud/how-dockershim-forthcoming-deprecation-affects-your-kubernetes/) (published 2021/07/01)
-->
* Amazon Web Services EKS 文檔：[Amazon EKS 將終止對 Dockershim 的支持](https://docs.aws.amazon.com/eks/latest/userguide/dockershim-deprecation.html)

* CNCF 會議影片：[將 Kubernetes 從 Docker 遷移到 containerd 運行時的經驗教訓](https://www.docker.com/blog/what-developers-need-to-know-about-docker-docker-engine-and-kubernetes-v1-20/)（Ana Caylin，在 KubeCon Europe 2019）

* Docker.com 博客：[開發人員需要了解的關於 Docker、Docker Engine 和 Kubernetes v1.20 的哪些知識](https://www.docker.com/blog/what-developers-need-to-know-about-docker-docker-engine-and-kubernetes-v1-20/)（發表於 2020/12/04）

* YouTube 上的 “**Google Open Source**” 頻道：[與 Google 一起學習 Kubernetes - 從 Dockershim 遷移到 Containerd](https://youtu.be/fl7_4hjT52g)

* Azure 博客上的 Microsoft 應用：[Dockershim 棄用和 AKS](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/dockershim-deprecation-and-aks/ba-p/3055902)（發表於 2022/01/21）

* Mirantis 博客：[Dockershim 的未來是 cri-dockerd](https://www.mirantis.com/blog/the-future-of-dockershim-is-cri-dockerd/)（發表於 2021/04/21）

* Mirantis: [Mirantis/cri-dockerd](https://mirantis.github.io/cri-dockerd/) 官方文檔

* Tripwire：[Dockershim 即將棄用如何影響你的 Kubernetes](https://www.tripwire.com/state-of-security/security-data-protection/cloud/how-dockershim-forthcoming-deprecation-affects-your-kubernetes/) （發表於 2021/07/01）
