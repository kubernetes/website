---
title: 关于 dockershim 移除和使用兼容 CRI 运行时的文章
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
这是关于 Kubernetes 弃用和移除 **dockershim**
或使用兼容 CRI 的容器运行时相关的文章和其他页面的列表。

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

## Kubernetes 项目 {#kubernetes-project}

* Kubernetes 博客：[Dockershim 移除常见问题解答](/zh-cn/blog/2020/12/02/dockershim-faq/)（最初发表于 2020/12/02）

* Kubernetes 博客：[更新：Dockershim 移除常见问题解答](/zh-cn/blog/2022/02/17/dockershim-faq/)（更新发表于 2020/12/02）

* Kubernetes 博客：[Kubernetes 即将移除 Dockershim：承诺和下一步](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/)（发表于 2022/01/07）

* Kubernetes 博客：[移除 Dockershim 即将到来。你准备好了吗？](/zh-cn/blog/2021/11/12/are-you-ready-for-dockershim-removal/)（发表于 2021/11/12）

* Kubernetes 文档：[从 dockershim 迁移](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/)

* Kubernetes 文档：[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)

* Kubernetes 增强建议：[KEP-2221: 从 kubelet 中移除 dockershim](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2221-remove-dockershim/README.md)

* Kubernetes 增强提问：[从 kubelet 中移除 dockershim](https://github.com/kubernetes/enhancements/issues/2221) (_k/enhancements#2221_)

<!--
You can provide feedback via the GitHub issue [**Dockershim removal feedback & issues**](https://github.com/kubernetes/kubernetes/issues/106917). (_k/kubernetes/#106917_)
-->
你可以通过 GitHub 问题
[**Dockershim 移除反馈和问题**](https://github.com/kubernetes/kubernetes/issues/106917) 提供反馈。 (_k/kubernetes/#106917_)

<!-- 
## External sources {#third-party}
-->
## 外部来源 {#third-party}

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
* Amazon Web Services EKS 文档：[Amazon EKS 将终止对 Dockershim 的支持](https://docs.aws.amazon.com/eks/latest/userguide/dockershim-deprecation.html)

* CNCF 会议视频：[将 Kubernetes 从 Docker 迁移到 containerd 运行时的经验教训](https://www.docker.com/blog/what-developers-need-to-know-about-docker-docker-engine-and-kubernetes-v1-20/)（Ana Caylin，在 KubeCon Europe 2019）

* Docker.com 博客：[开发人员需要了解的关于 Docker、Docker Engine 和 Kubernetes v1.20 的哪些知识](https://www.docker.com/blog/what-developers-need-to-know-about-docker-docker-engine-and-kubernetes-v1-20/)（发表于 2020/12/04）

* YouTube 上的 “**Google Open Source**” 频道：[与 Google 一起学习 Kubernetes - 从 Dockershim 迁移到 Containerd](https://youtu.be/fl7_4hjT52g)

* Azure 博客上的 Microsoft 应用：[Dockershim 弃用和 AKS](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/dockershim-deprecation-and-aks/ba-p/3055902)（发表于 2022/01/21）

* Mirantis 博客：[Dockershim 的未来是 cri-dockerd](https://www.mirantis.com/blog/the-future-of-dockershim-is-cri-dockerd/)（发表于 2021/04/21）

* Mirantis: [Mirantis/cri-dockerd](https://mirantis.github.io/cri-dockerd/) 官方文档

* Tripwire：[Dockershim 即将弃用如何影响你的 Kubernetes](https://www.tripwire.com/state-of-security/security-data-protection/cloud/how-dockershim-forthcoming-deprecation-affects-your-kubernetes/) （发表于 2021/07/01）
