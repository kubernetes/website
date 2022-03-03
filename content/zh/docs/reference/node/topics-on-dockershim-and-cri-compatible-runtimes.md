---
title: 关于 dockershim 移除和使用兼容 CRI 运行时的外部文章
content_type: reference
weight: 20
---

<!-- 
title: External Articles on dockershim Removal and on Using CRI-compatible Runtimes
content_type: reference
weight: 20
-->

<!-- overview -->
<!-- 
This is a list of articles about:

	- the Kubernetes' deprecation and removal of _dockershim_
	- using CRI-compatible container runtimes
-->
这是有关以下内容的文章列表：

- Kubernetes 弃用和删除 _dockershim_
- 使用兼容 CRI 的容器运行时
<!-- body -->

<!-- 
## Primary sources

* [Kubernetes Blog: "Dockershim Deprecation FAQ", 2020/12/02](/blog/2020/12/02/dockershim-faq/)

* [Kubernetes Documentation: "Migrating from dockershim"](/docs/tasks/administer-cluster/migrating-from-dockershim/)

* [Kubernetes Documentation: "Container runtimes"](/docs/setup/production-environment/container-runtimes/)

* [Kubernetes enhancement issue: "Removing dockershim from kubelet" (`kubernetes/enhancements#2221`)](https://github.com/kubernetes/enhancements/issues/2221)

* [Kubernetes enhancement proposal: "KEP-2221: Removing dockershim from kubelet"](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2221-remove-dockershim/README.md)

* [Kubernetes Blog: "Dockershim removal is coming. Are you ready?", 2021/11/12](/blog/2021/11/12/are-you-ready-for-dockershim-removal/)
-->

## 首要来源

* [Kubernetes 博客: “Dockershim 弃用常见问题解答”, 2020/12/02](/blog/2020/12/02/dockershim-faq/)

* [Kubernetes 文档：“从 dockershim 迁移”](/zh/docs/tasks/administer-cluster/migrating-from-dockershim/)

* [Kubernetes 文档：“容器运行时”](/zh/docs/setup/production-environment/container-runtimes/)

* [Kubernetes 增强提问: “从 kubelet 中删除 dockershim” (`kubernetes/enhancements#2221`)](https://github.com/kubernetes/enhancements/issues/2221)

* [Kubernetes 增强建议：“KEP-2221: 从 kubelet 中删除 dockershim”](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2221-remove-dockershim/README.md)

* [Kubernetes 博客: “移除 Dockershim 即将到来。你准备好了吗？”, 2021/11/12](/blog/2021/11/12/are-you-ready-for-dockershim-removal/)

<!-- 
## Secondary sources

* [Docker.com blog: "What developers need to know about Docker, Docker Engine, and Kubernetes v1.20", 2020/12/04](https://www.docker.com/blog/what-developers-need-to-know-about-docker-docker-engine-and-kubernetes-v1-20/)

* [Tripwire.com: "How Dockershim’s Forthcoming Deprecation Affects Your Kubernetes"](https://www.tripwire.com/state-of-security/security-data-protection/cloud/how-dockershim-forthcoming-deprecation-affects-your-kubernetes/)

* [Amazon EKS documentation: "Dockershim deprecation"](https://docs.aws.amazon.com/eks/latest/userguide/dockershim-deprecation.html)

* ["Google Open Source" channel on YouTube: "Learn Kubernetes with Google - Migrating from Dockershim to Containerd"](https://youtu.be/fl7_4hjT52g)

* [Mirantis Blog: "The Future of Dockershim is cri-dockerd", 2021/04/21](https://www.mirantis.com/blog/the-future-of-dockershim-is-cri-dockerd/)

* [Github.com: "Mirantis/cri-dockerd" repo](https://github.com/Mirantis/cri-dockerd)
-->
## 次要来源

* [Docker.com 博客：“开发人员需要了解的关于 Docker、Docker Engine 和 Kubernetes v1.20 的哪些知识”，2020/12/04](https://www.docker.com/blog/what-developers-need-to-know-about-docker-docker-engine-and-kubernetes-v1-20/)

* [Tripwire.com：“Dockershim 即将弃用如何影响你的 Kubernetes”](https://www.tripwire.com/state-of-security/security-data-protection/cloud/how-dockershim-forthcoming-deprecation-affects-your-kubernetes/)

* [Amazon EKS 文档：“Dockershim 弃用”](https://docs.aws.amazon.com/eks/latest/userguide/dockershim-deprecation.html)

* [YouTube 上的 “Google 开源”频道：“与 Google 一起学习 Kubernetes - 从 Dockershim 迁移到 Containerd”](https://youtu.be/fl7_4hjT52g)

* [Mirantis 博客：“Dockershim 的未来是 cri-dockerd”，2021/04/21](https://www.mirantis.com/blog/the-future-of-dockershim-is-cri-dockerd/)

* [Github.com：“Mirantis/cri-dockerd” 仓库](https://github.com/Mirantis/cri-dockerd)
