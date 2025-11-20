---
title: Kubernetes 組件
content_type: concept
description: >
  組成 Kubernetes 叢集的關鍵組件概述。
weight: 10
card:
  title: 叢集組件
  name: concepts
  weight: 20
---
<!--
reviewers:
- lavalamp
title: Kubernetes Components
content_type: concept
description: >
  An overview of the key components that make up a Kubernetes cluster.
weight: 10
card:
  title: Components of a cluster
  name: concepts
  weight: 20
-->

<!-- overview -->

<!--
本頁面概述了組成 Kubernetes 叢集的基本組件。

{{ < figure src="/images/docs/components-of-kubernetes.svg" alt="Components of Kubernetes" caption="The components of a Kubernetes cluster" class="diagram-large" clicktozoom="true" >}}
-->
本文檔概述了一個正常運行的 Kubernetes 叢集所需的各種組件。

{{< figure src="/zh-cn/docs/images/components-of-kubernetes.svg" alt="Kubernetes 的組件" caption="Kubernetes 叢集的組件" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

<!--
## Core Components

A Kubernetes cluster consists of a control plane and one or more worker nodes.
Here's a brief overview of the main components:
-->
## 核心組件   {#core-components}

Kubernetes 叢集由控制平面和一個或多個工作節點組成。以下是主要組件的簡要概述：

<!--
### Control Plane Components

Manage the overall state of the cluster:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: The core component server that exposes the Kubernetes HTTP API.

[etcd](/docs/concepts/architecture/#etcd)
: Consistent and highly-available key value store for all API server data.

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: Looks for Pods not yet bound to a node, and assigns each Pod to a suitable node.

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: Runs {{< glossary_tooltip text="controllers" term_id="controller" >}} to implement Kubernetes API behavior.

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (optional)
: Integrates with underlying cloud provider(s).
-->
## 控制平面組件    {#control-plane-components}

這些控制平面組件（Control Plane Component）管理叢集的整體狀態：

[kube-apiserver](/zh-cn/docs/concepts/architecture/#kube-apiserver)
: 公開 Kubernetes HTTP API 的核心組件伺服器。

[etcd](/zh-cn/docs/concepts/architecture/#etcd)
: 具備一致性和高可用性的鍵值儲存，用於所有 API 伺服器的資料儲存。

[kube-scheduler](/zh-cn/docs/concepts/architecture/#kube-scheduler)
: 查找尚未綁定到節點的 Pod，並將每個 Pod 分配給合適的節點。

[kube-controller-manager](/zh-cn/docs/concepts/architecture/#kube-controller-manager)
: 運行{{< glossary_tooltip text="控制器" term_id="controller" >}}來實現 Kubernetes API 行爲。

[cloud-controller-manager](/zh-cn/docs/concepts/architecture/#cloud-controller-manager) (optional)
: 與底層雲驅動集成。

<!--
### Node Components

Run on every node, maintaining running pods and providing the Kubernetes runtime environment:

[kubelet](/docs/concepts/architecture/#kubelet)
: Ensures that Pods are running, including their containers.

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (optional)
: Maintains network rules on nodes to implement {{< glossary_tooltip text="Services" term_id="service" >}}.

[Container runtime](/docs/concepts/architecture/#container-runtime)
: Software responsible for running containers. Read
  [Container Runtimes](/docs/setup/production-environment/container-runtimes/) to learn more.
-->
## Node 組件  {#node-components}

在每個節點上運行，維護運行的 Pod 並提供 Kubernetes 運行時環境：

[kubelet](/zh-cn/docs/concepts/architecture/#kubelet)
: 確保 Pod 及其容器正常運行。

[kube-proxy](/zh-cn/docs/concepts/architecture/#kube-proxy)（可選）
: 維護節點上的網路規則以實現 Service 的功能。

[容器運行時（Container runtime）](/zh-cn/docs/concepts/architecture/#container-runtime)
: 負責運行容器的軟體，閱讀[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)以瞭解更多資訊。

{{% thirdparty-content single="true" %}}

<!--
Your cluster may require additional software on each node; for example, you might also
run [systemd](https://systemd.io/) on a Linux node to supervise local components.
-->
你的叢集可能需要每個節點上運行額外的軟體；例如，你可能還需要在 Linux
節點上運行 [systemd](https://systemd.io/) 來監督本地組件。

<!--
## Addons

Addons extend the functionality of Kubernetes. A few important examples include:
-->
## 插件（Addons）    {#addons}

插件擴展了 Kubernetes 的功能。一些重要的例子包括：

<!--
[DNS](/docs/concepts/architecture/#dns)
: For cluster-wide DNS resolution.

[Web UI](/docs/concepts/architecture/#web-ui-dashboard) (Dashboard)
: For cluster management via a web interface.

[Container Resource Monitoring](/docs/concepts/architecture/#container-resource-monitoring)
: For collecting and storing container metrics.

[Cluster-level Logging](/docs/concepts/architecture/#cluster-level-logging)
: For saving container logs to a central log store.
-->
[DNS](/zh-cn/docs/concepts/architecture/#dns)
: 叢集範圍內的 DNS 解析。

[Web 界面](/zh-cn/docs/concepts/architecture/#web-ui-dashboard)（Dashboard）
: 通過 Web 界面進行叢集管理。

[容器資源監控](/zh-cn/docs/concepts/architecture/#container-resource-monitoring)
: 用於收集和儲存容器指標。

[叢集層面日誌](/zh-cn/docs/concepts/architecture/#cluster-level-logging)
: 用於將容器日誌保存到中央日誌儲存。

<!--
## Flexibility in Architecture

Kubernetes allows for flexibility in how these components are deployed and managed.
The architecture can be adapted to various needs, from small development environments
to large-scale production deployments.

For more detailed information about each component and various ways to configure your
cluster architecture, see the [Cluster Architecture](/docs/concepts/architecture/) page.
-->
## 架構靈活性    {#flexibility-in-architecture}

Kubernetes 允許靈活地部署和管理這些組件。此架構可以適應各種需求，從小型開發環境到大規模生產部署。

有關每個組件的詳細資訊以及設定叢集架構的各種方法，
請參閱[叢集架構](/zh-cn/docs/concepts/architecture/)頁面。
