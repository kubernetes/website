---
title: 快速入門
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: 學習環境
  - anchor: "#production-environment"
    title: 正式環境
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
本部分介紹設定與執行 Kubernetes 的各種方式。
安裝 Kubernetes 時，應依據維護難易度、安全性、控制程度、可用資源，以及操作與管理叢集所需的專業能力，選擇適合的安裝方式。

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
你可以[下載 Kubernetes](/zh-tw/releases/download/)，並將 Kubernetes 叢集部署於本機、雲端，或自有資料中心。

部分 [Kubernetes 組件](/zh-tw/docs/concepts/overview/components/)，例如 {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} 或 {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}，也可以在叢集中以[容器映像檔](/zh-tw/releases/download/#container-images)的形式部署。

**建議**在可行的情況下，將 Kubernetes 組件以容器映像檔形式執行，並交由 Kubernetes 管理這些組件。
負責執行容器的組件（例如 kubelet）則不適用於此類方式。

若不希望自行管理 Kubernetes 叢集，可以選擇受管服務（managed service），包括[經認證的平台](/zh-tw/docs/setup/production-environment/turnkey-solutions/)。
此外，在各種雲端與裸機環境中，也有多種標準化或客製化的解決方案可供選擇。
<!-- body -->

<!--
## Learning environment
-->
## 學習環境  {#learning-environment}

<!--
If you're learning Kubernetes, use the tools supported by the Kubernetes community,
or tools in the ecosystem to set up a Kubernetes cluster on a local machine.
See [Learning environment](/docs/setup/learning-environment/)
-->
如果您正在學習 Kubernetes，請使用 Kubernetes 社群支援的工具，
或生態系中的工具，在本機電腦上建立 Kubernetes 叢集。
請參閱[學習環境](/zh-tw/docs/setup/learning-environment/)。

<!--
## Production environment
-->
## 正式環境  {#production-environment}

<!--
When evaluating a solution for a
[production environment](/docs/setup/production-environment/), consider which aspects of
operating a Kubernetes cluster (or _abstractions_) you want to manage yourself and which you
prefer to hand off to a provider.

For a cluster you're managing yourself, the officially supported tool
for deploying Kubernetes is [kubeadm](/docs/setup/production-environment/tools/kubeadm/).
-->
在評估[正式環境](/zh-tw/docs/setup/production-environment/)的解決方案時，
請考慮在操作 Kubernetes 叢集（或相關抽象）時，哪些部分要自行管理，哪些部分交由提供者處理。

對於自行管理的叢集，官方支援用於部署 Kubernetes 的工具是
[kubeadm](/zh-tw/docs/setup/production-environment/tools/kubeadm/)。

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
- [下載 Kubernetes](/zh-tw/releases/download/)
- 下載並[安裝工具](/zh-tw/docs/tasks/tools/)，包括 `kubectl`
- 為新叢集選擇[容器執行階段](/zh-tw/docs/setup/production-environment/container-runtimes/)
- 了解叢集設定的[最佳實務](/zh-tw/docs/setup/best-practices/)

Kubernetes 的設計是讓其{{< glossary_tooltip term_id="control-plane" text="控制平面" >}}在 Linux 上運作。
在叢集中，您可以在 Linux 或其他作業系統（包括 Windows）上執行應用程式。

- 了解如何[設定包含 Windows 節點的叢集](/zh-tw/docs/concepts/windows/)

