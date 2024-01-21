---
title: 入门
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: 学习环境
  - anchor: "#production-environment"
    title: 生产环境  
---

<!--
reviewers:
- brendandburns
- erictune
- mikedanese
title: Getting started
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: Learning environment
  - anchor: "#production-environment"
    title: Production environment  
-->

<!-- overview -->

<!--
This section lists the different ways to set up and run Kubernetes.
When you install Kubernetes, choose an installation type based on: ease of maintenance, security,
control, available resources, and expertise required to operate and manage a cluster.
-->
本节列出了设置和运行 Kubernetes 的不同方法。
安装 Kubernetes 时，请根据以下条件选择安装类型：易于维护、安全性、可控制性、可用资源以及操作和管理 Kubernetes 集群所需的专业知识。

<!--
You can [download Kubernetes](/releases/download/) to deploy a Kubernetes cluster
on a local machine, into the cloud, or for your own datacenter.

Several [Kubernetes components](/docs/concepts/overview/components/) such as {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} or {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} can also be
deployed as [container images](/releases/download/#container-images) within the cluster.

It is **recommended** to run Kubernetes components as container images wherever
that is possible, and to have Kubernetes manage those components.
Components that run containers - notably, the kubelet - can't be included in this category.

If you don't want to manage a Kubernetes cluster yourself, you could pick a managed service, including
[certified platforms](/docs/setup/production-environment/turnkey-solutions/).
There are also other standardized and custom solutions across a wide range of cloud and
bare metal environments.
-->
你可以[下载 Kubernetes](/zh-cn/releases/download/)，在本地机器、云或你自己的数据中心上部署 Kubernetes 集群。

诸如 {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} 或
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}
等某些 [Kubernetes 组件](/zh-cn/docs/concepts/overview/components/)可以在集群中以[容器镜像](/zh-cn/releases/download/#container-images)部署。

**建议**尽可能将 Kubernetes 组件作为容器镜像运行，并且让 Kubernetes 管理这些组件。
但是运行容器的相关组件 —— 尤其是 kubelet，不在此列。

如果你不想自己管理 Kubernetes 集群，则可以选择托管服务，包括[经过认证的平台](/zh-cn/docs/setup/production-environment/turnkey-solutions/)。
在各种云和裸机环境中，还有其他标准化和定制的解决方案。
<!-- body -->

<!--
## Learning environment
-->
## 学习环境   {#learning-environment}

<!--
If you're learning Kubernetes, use the tools supported by the Kubernetes community,
or tools in the ecosystem to set up a Kubernetes cluster on a local machine.
See [Install tools](/docs/tasks/tools/).
-->
如果正打算学习 Kubernetes，请使用 Kubernetes 社区支持
或生态系统中的工具在本地计算机上设置 Kubernetes 集群。
请参阅[安装工具](/zh-cn/docs/tasks/tools/)。

<!--
## Production environment
-->
## 生产环境   {#production-environment}

<!--
When evaluating a solution for a
[production environment](/docs/setup/production-environment/), consider which aspects of
operating a Kubernetes cluster (or _abstractions_) you want to manage yourself and which you
prefer to hand off to a provider.

For a cluster you're managing yourself, the officially supported tool
for deploying Kubernetes is [kubeadm](/docs/setup/production-environment/tools/kubeadm/).
-->
在评估[生产环境](/zh-cn/docs/setup/production-environment/)的解决方案时，
请考虑要自己管理 Kubernetes 集群（或相关抽象）的哪些方面，将哪些托付给提供商。

对于你自己管理的集群，官方支持的用于部署 Kubernetes 的工具是
[kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/)。

## {{% heading "whatsnext" %}}

<!--
- [Download Kubernetes](/releases/download/)
- Download and [install tools](/docs/tasks/tools/) including `kubectl`
- Select a [container runtime](/docs/setup/production-environment/container-runtimes/) for your new cluster
- Learn about [best practices](/docs/setup/best-practices/) for cluster setup

Kubernetes is designed for its {{< glossary_tooltip term_id="control-plane" text="control plane" >}} to
run on Linux. Within your cluster you can run applications on Linux or other operating systems, including
Windows.

- Learn to [set up clusters with Windows nodes](/docs/concepts/windows/)
-->
- [下载 Kubernetes](/zh-cn/releases/download/)
- [下载并安装包括 kubectl 在内的工具](/zh-cn/docs/tasks/tools/)
- 为新集群选择[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)
- 了解集群设置的[最佳实践](/zh-cn/docs/setup/best-practices/)

Kubernetes 的设计是让其{{< glossary_tooltip term_id="control-plane" text="控制平面" >}}在 Linux 上运行的。
在集群中，你可以在 Linux 或其他操作系统（包括 Windows）上运行应用程序。

- 学习[配置包含 Windows 节点的集群](/zh-cn/docs/concepts/windows/)
