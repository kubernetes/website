---
title: "安裝工具"
weight: 10
description: 在你的計算機上設置 Kubernetes 工具。
no_list: true
card:
  name: tasks
  weight: 20
  anchors:
  - anchor: "#kubectl"
    title: 安裝 kubectl
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
讓你可以對 Kubernetes 集羣運行命令。
你可以使用 kubectl 來部署應用、監測和管理集羣資源以及查看日誌。

有關更多信息，包括 kubectl 操作的完整列表，請參見 [`kubectl` 參考文件](/zh-cn/docs/reference/kubectl/)。

<!--
kubectl is installable on a variety of Linux platforms, macOS and Windows. 
Find your preferred operating system below.

- [Install kubectl on Linux](/docs/tasks/tools/install-kubectl-linux)
- [Install kubectl on macOS](/docs/tasks/tools/install-kubectl-macos)
- [Install kubectl on Windows](/docs/tasks/tools/install-kubectl-windows)
-->
kubectl 可安裝在各種 Linux 平臺、 macOS 和 Windows 上。
在下面找到你喜歡的操作系統。

- [在 Linux 上安裝 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-linux)
- [在 macOS 上安裝 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-macos)
- [在 Windows 上安裝 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-windows)

## kind

<!--
[`kind`](https://kind.sigs.k8s.io/) lets you run Kubernetes on
your local computer. This tool requires that you have either
[Docker](https://www.docker.com/) or [Podman](https://podman.io/) installed.

The kind [Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) page
shows you what you need to do to get up and running with kind.

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="View kind Quick Start Guide">View kind Quick Start Guide</a>
-->
[`kind`](https://kind.sigs.k8s.io/) 讓你能夠在本地計算機上運行 Kubernetes。
使用這個工具需要你安裝 [Docker](https://www.docker.com/) 或者 [Podman](https://podman.io/)。

kind 的 [Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) 頁面展示開始使用
`kind` 所需要完成的操作。

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/"
  role="button" aria-label="查看 kind 的快速入門指南">
查看 kind 的快速入門指南
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
與 `kind` 類似，[`minikube`](https://minikube.sigs.k8s.io/) 是一個工具，
能讓你在本地運行 Kubernetes。
`minikube` 在你的個人計算機（包括 Windows、macOS 和 Linux PC）上運行一個一體化（all-in-one）
或多節點的本地 Kubernetes 集羣，以便你來嘗試 Kubernetes 或者開展每天的開發工作。

如果你關注如何安裝此工具，可以按官方的
[Get Started!](https://minikube.sigs.k8s.io/docs/start/)指南操作。

<!--
<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="View minikube Get Started! Guide">View minikube Get Started! Guide</a>

Once you have `minikube` working, you can use it to
[run a sample application](/docs/tutorials/hello-minikube/).
-->
<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/"
  role="button" aria-label="查看 minikube 快速入門指南">
查看 minikube 快速入門指南
</a>

當你擁有了可工作的 `minikube` 時，
就可以用它來[運行示例應用](/zh-cn/docs/tutorials/hello-minikube/)了。

## kubeadm

<!--
You can use the {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} tool to create and manage Kubernetes clusters.
It performs the actions necessary to get a minimum viable, secure cluster up and running in a user friendly way.
-->
你可以使用 {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}}
工具來創建和管理 Kubernetes 集羣。
該工具能夠執行必要的動作並用一種用戶友好的方式啓動一個可用的、安全的集羣。

<!--
[Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) shows you how to install kubeadm.
Once installed, you can use it to [create a cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
-->
[安裝 kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
展示瞭如何安裝 kubeadm 的過程。一旦安裝了 kubeadm，
你就可以使用它來[創建一個集羣](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)。

<!--
<a class="btn btn-primary" href="/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="View kubeadm Install Guide">View kubeadm Install Guide</a>
-->

<a class="btn btn-primary" href="/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/"
  role="button" aria-label="查看 kubeadm 安裝指南">查看 kubeadm 安裝指南</a>

