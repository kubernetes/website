---
title: 入門
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
    title: 生產環境  
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
-->
本節列出了設定和執行 Kubernetes 的不同方法。

<!--
When you install Kubernetes, choose an installation type based on: ease of maintenance, security,
control, available resources, and expertise required to operate and manage a cluster.
-->
安裝 Kubernetes 時，請根據以下條件選擇安裝型別：易於維護、安全性、可控制性、可用資源以及操作和管理 Kubernetes 叢集所需的專業知識。

<!--
You can [download Kubernetes](/releases/download/) to deploy a Kubernetes cluster
on a local machine, into the cloud, or for your own datacenter.

If you don't want to manage a Kubernetes cluster yourself, you could pick a managed service, including
[certified platforms](/docs/setup/production-environment/turnkey-solutions/).
There are also other standardized and custom solutions across a wide range of cloud and
bare metal environments.
-->
可以[下載 Kubernetes](/releases/download/)，在本地機器、雲或你自己的資料中心上部署 Kubernetes 叢集。
如果你不想自己管理 Kubernetes 叢集，則可以選擇託管服務，包括[經過認證的平臺](/zh-cn/docs/setup/production-environment/turnkey-solutions/)。
在各種雲和裸機環境中，還有其他標準化和定製的解決方案。
<!-- body -->

<!--
## Learning environment
-->
## 學習環境

<!--
If you're learning Kubernetes, use the tools supported by the Kubernetes community,
or tools in the ecosystem to set up a Kubernetes cluster on a local machine.
See [Install tools](/docs/tasks/tools/).
-->
如果正打算學習 Kubernetes，請使用 Kubernetes 社群支援
或生態系統中的工具在本地計算機上設定 Kubernetes 叢集。
請參閱[安裝工具](/zh-cn/docs/tasks/tools/)。

<!--
## Production environment
-->
## 生產環境

<!--
When evaluating a solution for a
[production environment](/docs/setup/production-environment/), consider which aspects of
operating a Kubernetes cluster (or _abstractions_) you want to manage yourself and which you
prefer to hand off to a provider.

For a cluster you're managing yourself, the officially supported tool
for deploying Kubernetes is [kubeadm](/docs/setup/production-environment/tools/kubeadm/).
-->
在評估[生產環境](/zh-cn/docs/setup/production-environment/)的解決方案時，
請考慮要自己管理 Kubernetes 叢集（或相關抽象）的哪些方面，將哪些託付給提供商。

對於你自己管理的叢集，官方支援的用於部署 Kubernetes 的工具是 
[kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/)。

<!--
## {{% heading "whatsnext" %}}

- [Download Kubernetes](/releases/download/)
- Download and [install tools](/docs/tasks/tools/) including `kubectl`
- Select a [container runtime](/docs/setup/production-environment/container-runtimes/) for your new cluster
- Learn about [best practices](/docs/setup/best-practices/) for cluster setup

Kubernetes is designed for its {{< glossary_tooltip term_id="control-plane" text="control plane" >}} to
run on Linux. Within your cluster you can run applications on Linux or other operating systems, including
Windows.
- Learn to [set up clusters with Windows nodes](/docs/setup/production-environment/windows/)
-->
## {{% heading "whatsnext" %}}

- [下載 Kubernetes](/releases/download/)
- 下載並[安裝工具](/zh-cn/docs/tasks/tools/)，包括 kubectl 在內
- 為新叢集選擇[容器執行時](/zh-cn/docs/setup/production-environment/container-runtimes/)
- 瞭解叢集設定的[最佳實踐](/zh-cn/docs/setup/best-practices/)

Kubernetes 的設計是讓其{{< glossary_tooltip term_id="control-plane" text="控制平面" >}}在 Linux 上執行的。
在叢集中，你可以在 Linux 或其他作業系統（包括 Windows）上執行應用程式。
- 學習[配置包含 Windows 節點的叢集](/zh-cn/docs/setup/production-environment/windows/)
