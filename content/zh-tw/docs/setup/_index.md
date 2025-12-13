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
When you install Kubernetes, choose an installation type based on: ease of maintenance, security,
control, available resources, and expertise required to operate and manage a cluster.
-->
本節列出了設置和運行 Kubernetes 的不同方法。
安裝 Kubernetes 時，請根據以下條件選擇安裝類型：易於維護、安全性、可控制性、可用資源以及操作和管理 Kubernetes 叢集所需的專業知識。

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
你可以[下載 Kubernetes](/zh-cn/releases/download/)，在本地機器、雲或你自己的資料中心上部署 Kubernetes 叢集。

諸如 {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} 或
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}
等某些 [Kubernetes 組件](/zh-cn/docs/concepts/overview/components/)可以在叢集中以[容器映像檔](/zh-cn/releases/download/#container-images)部署。

**建議**儘可能將 Kubernetes 組件作爲容器映像檔運行，並且讓 Kubernetes 管理這些組件。
但是運行容器的相關組件 —— 尤其是 kubelet，不在此列。

如果你不想自己管理 Kubernetes 叢集，則可以選擇託管服務，包括[經過認證的平臺](/zh-cn/docs/setup/production-environment/turnkey-solutions/)。
在各種雲和裸機環境中，還有其他標準化和定製的解決方案。
<!-- body -->

<!--
## Learning environment
-->
## 學習環境   {#learning-environment}

<!--
If you're learning Kubernetes, use the tools supported by the Kubernetes community,
or tools in the ecosystem to set up a Kubernetes cluster on a local machine.
See [Install tools](/docs/tasks/tools/).
-->
如果正打算學習 Kubernetes，請使用 Kubernetes 社區支持
或生態系統中的工具在本地計算機上設置 Kubernetes 叢集。
請參閱[安裝工具](/zh-cn/docs/tasks/tools/)。

<!--
## Production environment
-->
## 生產環境   {#production-environment}

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

對於你自己管理的叢集，官方支持的用於部署 Kubernetes 的工具是
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
- [下載 Kubernetes](/zh-cn/releases/download/)
- [下載並安裝包括 kubectl 在內的工具](/zh-cn/docs/tasks/tools/)
- 爲新叢集選擇[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)
- 瞭解叢集設置的[最佳實踐](/zh-cn/docs/setup/best-practices/)

Kubernetes 的設計是讓其{{< glossary_tooltip term_id="control-plane" text="控制平面" >}}在 Linux 上運行的。
在叢集中，你可以在 Linux 或其他操作系統（包括 Windows）上運行應用程式。

- 學習[設定包含 Windows 節點的叢集](/zh-cn/docs/concepts/windows/)
