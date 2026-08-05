---
title: 学习环境
content_type: concept
weight: 20
---
<!--
title: Learning environment
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
If you are learning Kubernetes, you need a place to practice. This page explains your options for setting up a Kubernetes environment where you can experiment and learn.
-->
如果你正在学习 Kubernetes，你需要一个练习环境。
本页面将介绍如何搭建 Kubernetes 环境，以便你进行实验和学习。

<!-- body -->

<!--
## Installing kubectl

Before you set up a cluster, you need the `kubectl` command-line tool. This tool lets you communicate with a Kubernetes cluster and run commands against it.

See [Install and Set Up kubectl](/docs/tasks/tools/#kubectl) for installation instructions.
-->
## 安装 kubectl

在设置集群之前，你需要 `kubectl` 命令行工具。该工具允许你与
Kubernetes 集群通信并对其运行命令。

有关安装说明，请参阅[安装和设置 kubectl](/zh-cn/docs/tasks/tools/#kubectl)。

<!--
## Setting up local Kubernetes environments

Running Kubernetes locally gives you a safe environment to learn and experiment. You can set up and tear down clusters without worrying about costs or affecting production systems.
-->
## 设置本地 Kubernetes 环境

在本地运行 Kubernetes 可以为你提供一个安全的学习和实验环境。
你可以设置和销毁集群，而无需担心成本或影响生产系统。

<!--
### kind

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) runs Kubernetes clusters using Docker containers as nodes. It is lightweight and designed specifically for testing Kubernetes itself, but works great for learning too.

To get started with kind, see the [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/).
-->
### kind

[kind](https://kind.sigs.k8s.io/)（Kubernetes IN Docker）使用
Docker 容器作为节点运行 Kubernetes 集群。
它轻量级且专为测试 Kubernetes 本身而设计，但也非常适合学习。

要开始使用 kind，请参阅 [kind 快速入门](https://kind.sigs.k8s.io/docs/user/quick-start/)。

<!--
### minikube

[minikube](https://minikube.sigs.k8s.io/) runs a single-node Kubernetes cluster on your local machine. It supports multiple container runtimes and works on Linux, macOS, and Windows.

To get started with minikube, see the [minikube Get Started](https://minikube.sigs.k8s.io/docs/start/) guide.
-->
### minikube

[minikube](https://minikube.sigs.k8s.io/)
在你的本地计算机上运行单节点 Kubernetes 集群。
它支持多种容器运行时，并可在 Linux、macOS 和 Windows 系统上运行。

要开始使用 minikube，请参阅 [minikube 入门指南](https://minikube.sigs.k8s.io/docs/start/)。

<!--
### Other local options
-->
### 其他本地选项

{{% thirdparty-content single="true" %}}

<!--
There are several third-party tools that can also run Kubernetes locally. Kubernetes does not provide support for these tools, but they may work well for your learning needs:

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) can run a local Kubernetes cluster
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) can run a local Kubernetes cluster
- [Rancher Desktop](https://docs.rancherdesktop.io/) provides Kubernetes on your desktop
- [MicroK8s](https://canonical.com/microk8s) runs a lightweight Kubernetes cluster
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local) runs a minimal OpenShift cluster locally (OpenShift is Kubernetes-conformant)

Refer to each tool's documentation for setup instructions and support.
-->
有一些第三方工具也可以在本地运行 Kubernetes。Kubernetes 本身并不支持这些工具，但它们或许能满足你的学习需求：

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) 可以运行本地 Kubernetes 集群
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) 可以运行本地 Kubernetes 集群
- [Rancher Desktop](https://docs.rancherdesktop.io/) 在你的桌面上提供 Kubernetes 服务
- [MicroK8s](https://canonical.com/microk8s) 运行一个轻量级的 Kubernetes 集群
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local)
  在本地运行一个最小化的 OpenShift 集群（OpenShift 符合 Kubernetes 标准）

请参阅各工具的文档以获取设置说明和支持。

<!--
## Using online playgrounds
-->
## 使用在线实验环境

{{% thirdparty-content single="true" %}}

<!--
Online Kubernetes playgrounds let you try Kubernetes without installing anything on your computer. These environments run in your web browser:
-->
在线 Kubernetes 实验环境让你无需在计算机上安装任何软件即可试用 Kubernetes。
这些环境直接在你的 Web 浏览器中运行：

<!--
- **[Killercoda](https://killercoda.com/kubernetes)** provides interactive Kubernetes scenarios and a playground environment
- **[Play with Kubernetes](https://labs.play-with-k8s.com/)** gives you a temporary Kubernetes cluster in your browser

These platforms are useful for quick experiments and following tutorials without local setup.
-->
- **[Killercoda](https://killercoda.com/kubernetes)** 提供交互式 Kubernetes 场景和实验环境。
- **[Play with Kubernetes](https://labs.play-with-k8s.com/)** 可在浏览器中创建一个临时的 Kubernetes 集群。

这些平台非常适合快速实验和学习教程，无需本地配置。

<!--
## Practicing with production-like clusters

If you want to practice setting up a more production-like cluster, you can use **kubeadm**. Setting up a cluster with kubeadm is an advanced task that requires multiple machines (physical or virtual) and careful configuration.

For learning about production environments, see [Production environment](/docs/setup/production-environment/).
-->
## 使用类似生产环境的集群进行练习

如果你想练习搭建更接近生产环境的集群，可以使用 **kubeadm**。
使用 kubeadm 搭建集群是一项高级任务，需要多台机器（物理机或虚拟机）以及细致的配置。

有关生产环境的更多信息，请参阅[生产环境](/docs/setup/production-environment/)。

{{< note >}}
<!--
Setting up a production-like cluster is significantly more complex than the learning environments described above. Start with kind, minikube, or an online playground first.
-->
搭建一个类似生产环境的集群比上面描述的学习环境要复杂得多。
建议先从 kind、minikube 或在线实验环境入手。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
- Follow the [Hello Minikube](/docs/tutorials/hello-minikube/) tutorial to deploy your first application
- Learn about [Kubernetes components](/docs/concepts/overview/components/)
- Explore [kubectl commands](/docs/reference/kubectl/)
-->
- 按照 [Hello Minikube](/docs/tutorials/hello-minikube/) 教程部署你的第一个应用程序
- 了解 [Kubernetes 组件](/docs/concepts/overview/components/)
- 探索 [kubectl 命令](/docs/reference/kubectl/)
