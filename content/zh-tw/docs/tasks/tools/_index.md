---
title: "安裝工具"
weight: 10
description: 在你的計算機上設定 Kubernetes 工具。
no_list: true
---

<!--
title: "Install Tools"
description: Set up Kubernetes tools on your computer.
weight: 10
no_list: true
-->

<!--
## kubectl

The Kubernetes command-line tool, [kubectl](/docs/reference/kubectl/kubectl/), allows
you to run commands against Kubernetes clusters.
You can use kubectl to deploy applications, inspect and manage cluster resources,
and view logs. For more information including a complete list of kubectl operations, see the
[`kubectl` reference documentation](/docs/reference/kubectl/).
-->
## kubectl

Kubernetes 命令列工具，[kubectl](/docs/reference/kubectl/kubectl/)，使得你可以對 Kubernetes 叢集執行命令。
你可以使用 kubectl 來部署應用、監測和管理叢集資源以及檢視日誌。

有關更多資訊，包括 kubectl 操作的完整列表，請參見[`kubectl` 
參考檔案](/zh-cn/docs/reference/kubectl/)。

<!--
kubectl is installable on a variety of Linux platforms, macOS and Windows. 
Find your preferred operating system below.

- [Install kubectl on Linux](/docs/tasks/tools/install-kubectl-linux)
- [Install kubectl on macOS](/docs/tasks/tools/install-kubectl-macos)
- [Install kubectl on Windows](/docs/tasks/tools/install-kubectl-windows)
-->
kubectl 可安裝在各種 Linux 平臺、 macOS 和 Windows 上。
在下面找到你喜歡的作業系統。

- [在 Linux 上安裝 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-linux)
- [在 macOS 上安裝 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-macos)
- [在 Windows 上安裝 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-windows)

<!--
## kind

[`kind`](https://kind.sigs.k8s.io/docs/) lets you run Kubernetes on
your local computer. This tool requires that you have
[Docker](https://docs.docker.com/get-docker/) installed and configured.

The kind [Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) page
shows you what you need to do to get up and running with `kind`.

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="View kind Quick Start Guide">View kind Quick Start Guide</a>

-->
## kind

[`kind`](https://kind.sigs.k8s.io/docs/) 讓你能夠在本地計算機上執行 Kubernetes。
`kind` 要求你安裝並配置好 [Docker](https://docs.docker.com/get-docker/)。

kind [快速入門](https://kind.sigs.k8s.io/docs/user/quick-start/)頁面展示了
開始使用 `kind` 所需要完成的操作。

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/"
  role="button" aria-label="檢視 kind 的快速入門指南">
檢視 kind 的快速入門指南
</a>

<!--
## minikube

Like `kind`, [`minikube`](https://minikube.sigs.k8s.io/) is a tool that lets you run Kubernetes
locally. `minikube` runs a single-node Kubernetes cluster on your personal
computer (including Windows, macOS and Linux PCs) so that you can try out
Kubernetes, or for daily development work.

You can follow the official
[Get Started!](https://minikube.sigs.k8s.io/docs/start/) guide if your focus is
on getting the tool installed.
-->
## minikube

與 `kind` 類似，[`minikube`](https://minikube.sigs.k8s.io/) 是一個工具，
能讓你在本地執行 Kubernetes。
`minikube` 在你本地的個人計算機（包括 Windows、macOS 和 Linux PC）執行一個單節點的
Kubernetes 叢集，以便你來嘗試 Kubernetes 或者開展每天的開發工作。

如果你關注如何安裝此工具，可以按官方的
[Get Started!](https://minikube.sigs.k8s.io/docs/start/)指南操作。

<!--
a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="View minikube Get Started! Guide">View minikube Get Started! Guide</a>

Once you have `minikube` working, you can use it to
[run a sample application](/docs/tutorials/hello-minikube/).
-->
<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/"
  role="button" aria-label="檢視 minikube 快速入門指南">
檢視 minikube 快速入門指南
</a>

當你擁有了可工作的 `minikube` 時，就可以用它來
[執行示例應用](/zh-cn/docs/tutorials/hello-minikube/)了。

## kubeadm

<!--
You can use the {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} tool to create and manage Kubernetes clusters.
It performs the actions necessary to get a minimum viable, secure cluster up and running in a user friendly way.
-->
你可以使用 {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} 工具來
建立和管理 Kubernetes 叢集。
該工具能夠執行必要的動作並用一種使用者友好的方式啟動一個可用的、安全的叢集。

<!--
[Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) shows you how to install kubeadm.
Once installed, you can use it to [create a cluster](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
-->
[安裝 kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
展示瞭如何安裝 kubeadm 的過程。
一旦安裝了 kubeadm，你就可以使用它來
[建立一個叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)。

<!-- a class="btn btn-primary" href="/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="View kubeadm Install Guide">View kubeadm Install Guide</a-->

<a class="btn btn-primary" href="/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/"
  role="button" aria-label="檢視 kubeadm 安裝指南">檢視 kubeadm 安裝指南</a>

