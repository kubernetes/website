---
title: 學習環境
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
如果您正在學習 Kubernetes，您需要一個練習的環境。本頁面將介紹建立 Kubernetes 環境的各種方式，讓您可以進行實驗與學習。
<!-- body -->

<!-- 
## Installing kubectl

Before you set up a cluster, you need the `kubectl` command-line tool. This tool lets you communicate with a Kubernetes cluster and run commands against it.

See [Install and Set Up kubectl](/docs/tasks/tools/#kubectl) for installation instructions. 
-->

## 安裝 kubectl

在建立叢集之前，您需要 `kubectl` 命令列工具。此工具能讓您與 Kubernetes 叢集通訊，並執行指令。

有關安裝說明，請參閱[安裝並設定 kubectl](/zh-tw/docs/tasks/tools/#kubectl)。 

<!-- 
## Setting up local Kubernetes environments

Running Kubernetes locally gives you a safe environment to learn and experiment. You can set up and tear down clusters without worrying about costs or affecting production systems. 
-->

## 設定本機 Kubernetes 環境

在本機執行 Kubernetes 能提供您一個安全的學習與實驗環境。您可以隨時建立與移除叢集，而無需擔心成本或影響正式環境系統。

<!-- 
### kind

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) runs Kubernetes clusters using Docker containers as nodes. It is lightweight and designed specifically for testing Kubernetes itself, but works great for learning too.

To get started with kind, see the [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/). 
-->

### kind

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) 使用 Docker 容器作為節點來執行 Kubernetes 叢集。它的設計輕量，專為測試 Kubernetes 本身而打造，也很適合用於學習。

若要開始使用 kind，請參閱 [kind 快速入門](https://kind.sigs.k8s.io/docs/user/quick-start/)。

<!-- 
### minikube

[minikube](https://minikube.sigs.k8s.io/) runs a single-node Kubernetes cluster on your local machine. It supports multiple container runtimes and works on Linux, macOS, and Windows.

To get started with minikube, see the [minikube Get Started](https://minikube.sigs.k8s.io/docs/start/) guide. 
-->

### minikube

[minikube](https://minikube.sigs.k8s.io/) 可在本機執行單一節點的 Kubernetes 叢集，支援多種容器執行階段，並可在 Linux、macOS 與 Windows 上運作

若要開始使用 minikube，請參閱 [minikube 入門](https://minikube.sigs.k8s.io/docs/start/)指南。

<!--
 ### Other local options

{{% thirdparty-content single="true" %}}

There are several third-party tools that can also run Kubernetes locally. Kubernetes does not provide support for these tools, but they may work well for your learning needs:

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) can run a local Kubernetes cluster
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) can run a local Kubernetes cluster
- [Rancher Desktop](https://docs.rancherdesktop.io/) provides Kubernetes on your desktop
- [MicroK8s](https://canonical.com/microk8s) runs a lightweight Kubernetes cluster
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local) runs a minimal OpenShift cluster locally (OpenShift is Kubernetes-conformant)

Refer to each tool's documentation for setup instructions and support. 
-->

### 其他本機選項

{{% thirdparty-content single="true" %}}

以下多個第三方工具也能在本機執行 Kubernetes。Kubernetes 並未支援這些工具，但仍可用於學習：

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) 可執行本機 Kubernetes 叢集
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) 可執行本機 Kubernetes 叢集
- [Rancher Desktop](https://docs.rancherdesktop.io/) 在您的電腦上提供 Kubernetes
- [MicroK8s](https://canonical.com/microk8s) 執行輕量級的 Kubernetes 叢集
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local) 可在本機執行最小化的 OpenShift 叢集（OpenShift 符合 Kubernetes 規範，並通過一致性測試）。

有關設定方式與支援資訊，請參閱各工具的文件。

<!--
 ## Using online playgrounds

{{% thirdparty-content single="true" %}}

Online Kubernetes playgrounds let you try Kubernetes without installing anything on your computer. These environments run in your web browser:

- **[Killercoda](https://killercoda.com/kubernetes)** provides interactive Kubernetes scenarios and a playground environment
- **[Play with Kubernetes](https://labs.play-with-k8s.com/)** gives you a temporary Kubernetes cluster in your browser

These platforms are useful for quick experiments and following tutorials without local setup. 
-->

## 使用線上練習環境

{{% thirdparty-content single="true" %}}

線上 Kubernetes 練習環境讓您無需在電腦上安裝任何軟體，即可體驗 Kubernetes。這些環境可直接在網頁瀏覽器中使用：

- **[Killercoda](https://killercoda.com/kubernetes)** 提供互動式 Kubernetes 情境與練習環境
- **[Play with Kubernetes](https://labs.play-with-k8s.com/)** 在您的瀏覽器中提供一個臨時的 Kubernetes 叢集

這些平台非常適合用於快速實驗，方便您在不需本機設定的情況下跟著教學操作。

<!-- 
## Practicing with production-like clusters

If you want to practice setting up a more production-like cluster, you can use **kubeadm**. Setting up a cluster with kubeadm is an advanced task that requires multiple machines (physical or virtual) and careful configuration.

For learning about production environments, see [Production environment](/docs/setup/production-environment/).

{{< note >}}
Setting up a production-like cluster is significantly more complex than the learning environments described above. Start with kind, minikube, or an online playground first.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Follow the [Hello Minikube](/docs/tutorials/hello-minikube/) tutorial to deploy your first application
- Learn about [Kubernetes components](/docs/concepts/overview/components/)
- Explore [kubectl commands](/docs/reference/kubectl/)
 -->

 ## 使用接近正式環境的叢集來練習

如果您想練習設定更接近正式環境的叢集，可以使用 **kubeadm**。使用 kubeadm 設定叢集是一項進階任務，需要多台機器（實體或虛擬），並進行仔細的設定。

若想了解有關正式環境的資訊，請參閱[正式環境](/zh-tw/docs/setup/production-environment/)。

{{< note >}}
設定接近正式環境的叢集會比上述的學習環境複雜許多。請先從 kind、minikube 或是線上練習環境開始。
{{< /note >}}

## {{% heading "whatsnext" %}}

- 遵循 [Hello Minikube](/zh-tw/docs/tutorials/hello-minikube/) 教學來部署您的第一個應用程式
- 了解 [Kubernetes 核心元件](/zh-tw/docs/concepts/overview/components/)
- 探索 [kubectl 指令](/zh-tw/docs/reference/kubectl/)