---
title: "安装工具"
weight: 10
description: 在你的计算机上设置 Kubernetes 工具。
no_list: true
card:
  name: tasks
  weight: 20
  anchors:
  - anchor: "#kubectl"
    title: 安装 kubectl
---

<!--
title: "Install Tools"
description: Set up Kubernetes tools on your computer.
weight: 10
no_list: true
card:
  name: tasks
  weight: 20
  anchors:
  - anchor: "#kubectl"
    title: Install kubectl
-->

## kubectl

<!-- overview -->

<!--
The Kubernetes command-line tool, [kubectl](/docs/reference/kubectl/kubectl/), allows
you to run commands against Kubernetes clusters.
You can use kubectl to deploy applications, inspect and manage cluster resources,
and view logs. For more information including a complete list of kubectl operations, see the
[`kubectl` reference documentation](/docs/reference/kubectl/).
-->
Kubernetes 命令行工具 [kubectl](/zh-cn/docs/reference/kubectl/kubectl/)，
让你可以对 Kubernetes 集群运行命令。
你可以使用 kubectl 来部署应用、监测和管理集群资源以及查看日志。

有关更多信息，包括 kubectl 操作的完整列表，请参见 [`kubectl` 参考文件](/zh-cn/docs/reference/kubectl/)。

<!--
kubectl is installable on a variety of Linux platforms, macOS and Windows. 
Find your preferred operating system below.

- [Install kubectl on Linux](/docs/tasks/tools/install-kubectl-linux)
- [Install kubectl on macOS](/docs/tasks/tools/install-kubectl-macos)
- [Install kubectl on Windows](/docs/tasks/tools/install-kubectl-windows)
-->
kubectl 可安装在各种 Linux 平台、 macOS 和 Windows 上。
在下面找到你喜欢的操作系统。

- [在 Linux 上安装 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-linux)
- [在 macOS 上安装 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-macos)
- [在 Windows 上安装 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-windows)

## kind

<!--
[`kind`](https://kind.sigs.k8s.io/) lets you run Kubernetes on
your local computer. This tool requires that you have either
[Docker](https://www.docker.com/) or [Podman](https://podman.io/) installed.

The kind [Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) page
shows you what you need to do to get up and running with kind.

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="View kind Quick Start Guide">View kind Quick Start Guide</a>
-->
[`kind`](https://kind.sigs.k8s.io/) 让你能够在本地计算机上运行 Kubernetes。
使用这个工具需要你安装 [Docker](https://www.docker.com/) 或者 [Podman](https://podman.io/)。

kind 的 [Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) 页面展示开始使用
`kind` 所需要完成的操作。

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/"
  role="button" aria-label="查看 kind 的快速入门指南">
查看 kind 的快速入门指南
</a>

## minikube

<!--
Like `kind`, [`minikube`](https://minikube.sigs.k8s.io/) is a tool that lets you run Kubernetes
locally. `minikube` runs an all-in-one or a multi-node local Kubernetes cluster on your personal
computer (including Windows, macOS and Linux PCs) so that you can try out
Kubernetes, or for daily development work.

You can follow the official
[Get Started!](https://minikube.sigs.k8s.io/docs/start/) guide if your focus is
on getting the tool installed.
-->
与 `kind` 类似，[`minikube`](https://minikube.sigs.k8s.io/) 是一个工具，
能让你在本地运行 Kubernetes。
`minikube` 在你的个人计算机（包括 Windows、macOS 和 Linux PC）上运行一个一体化（all-in-one）
或多节点的本地 Kubernetes 集群，以便你来尝试 Kubernetes 或者开展每天的开发工作。

如果你关注如何安装此工具，可以按官方的
[Get Started!](https://minikube.sigs.k8s.io/docs/start/)指南操作。

<!--
<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="View minikube Get Started! Guide">View minikube Get Started! Guide</a>

Once you have `minikube` working, you can use it to
[run a sample application](/docs/tutorials/hello-minikube/).
-->
<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/"
  role="button" aria-label="查看 minikube 快速入门指南">
查看 minikube 快速入门指南
</a>

当你拥有了可工作的 `minikube` 时，
就可以用它来[运行示例应用](/zh-cn/docs/tutorials/hello-minikube/)了。

## kubeadm

<!--
You can use the {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} tool to create and manage Kubernetes clusters.
It performs the actions necessary to get a minimum viable, secure cluster up and running in a user friendly way.
-->
你可以使用 {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}}
工具来创建和管理 Kubernetes 集群。
该工具能够执行必要的动作并用一种用户友好的方式启动一个可用的、安全的集群。

<!--
[Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) shows you how to install kubeadm.
Once installed, you can use it to [create a cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
-->
[安装 kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
展示了如何安装 kubeadm 的过程。一旦安装了 kubeadm，
你就可以使用它来[创建一个集群](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)。

<!--
<a class="btn btn-primary" href="/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="View kubeadm Install Guide">View kubeadm Install Guide</a>
-->

<a class="btn btn-primary" href="/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/"
  role="button" aria-label="查看 kubeadm 安装指南">查看 kubeadm 安装指南</a>

