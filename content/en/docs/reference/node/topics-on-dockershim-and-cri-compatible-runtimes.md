---
title: Articles on dockershim Removal and on Using CRI-compatible Runtimes
content_type: reference
weight: 20
---
<!-- overview -->
This is a list of articles and other pages that are either
about the Kubernetes' deprecation and removal of _dockershim_,
or about using CRI-compatible container runtimes,
in connection with that removal.

<!-- body -->

## Kubernetes project

* Kubernetes blog: [Dockershim Removal FAQ](/blog/2020/12/02/dockershim-faq/) (originally published 2020/12/02)

* Kubernetes blog: [Updated: Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq/) (updated published 2022/02/17)

* Kubernetes blog: [Kubernetes is Moving on From Dockershim: Commitments and Next Steps](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/) (published 2022/01/07)

* Kubernetes blog: [Dockershim removal is coming. Are you ready?](/blog/2021/11/12/are-you-ready-for-dockershim-removal/) (published 2021/11/12)

* Kubernetes documentation: [Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/)

* Kubernetes documentation: [Container Runtimes](/docs/setup/production-environment/container-runtimes/)

* Kubernetes enhancement proposal: [KEP-2221: Removing dockershim from kubelet](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2221-remove-dockershim/README.md)

* Kubernetes enhancement proposal issue: [Removing dockershim from kubelet](https://github.com/kubernetes/enhancements/issues/2221) (_k/enhancements#2221_)


You can provide feedback via the GitHub issue [**Dockershim removal feedback & issues**](https://github.com/kubernetes/kubernetes/issues/106917). (_k/kubernetes/#106917_)

## External sources {#third-party}

<!-- sort these alphabetically -->

* Amazon Web Services EKS documentation: [Amazon EKS is ending support for Dockershim](https://docs.aws.amazon.com/eks/latest/userguide/dockershim-deprecation.html)

* CNCF conference video: [Lessons Learned Migrating Kubernetes from Docker to containerd Runtime](https://www.youtube.com/watch?v=uDOu6rK4yOk) (Ana Caylin, at KubeCon Europe 2019)

* Docker.com blog: [What developers need to know about Docker, Docker Engine, and Kubernetes v1.20](https://www.docker.com/blog/what-developers-need-to-know-about-docker-docker-engine-and-kubernetes-v1-20/) (published 2020/12/04)

* "_Google Open Source_" channel on YouTube: [Learn Kubernetes with Google - Migrating from Dockershim to Containerd](https://youtu.be/fl7_4hjT52g)

* Microsoft Apps on Azure blog: [Dockershim deprecation and AKS](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/dockershim-deprecation-and-aks/ba-p/3055902) (published 2022/01/21)

* Mirantis blog: [The Future of Dockershim is cri-dockerd](https://www.mirantis.com/blog/the-future-of-dockershim-is-cri-dockerd/) (published 2021/04/21)

* Mirantis: [Mirantis/cri-dockerd](https://mirantis.github.io/cri-dockerd/) Official Documentation

* Tripwire: [How Dockershim’s Forthcoming Deprecation Affects Your Kubernetes](https://www.tripwire.com/state-of-security/security-data-protection/cloud/how-dockershim-forthcoming-deprecation-affects-your-kubernetes/) (published 2021/07/01)
