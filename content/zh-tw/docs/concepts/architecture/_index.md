---
title: "Kubernetes 架構"
weight: 30
description: >
  Kubernetes 背後的架構概念。
---
<!--
title: "Cluster Architecture"
weight: 30
description: >
  The architectural concepts behind Kubernetes.
-->

<!--
A Kubernetes cluster consists of a control plane plus a set of worker machines, called nodes,
that run containerized applications. Every cluster needs at least one worker node in order to run Pods.

The worker node(s) host the Pods that are the components of the application workload.
The control plane manages the worker nodes and the Pods in the cluster. In production
environments, the control plane usually runs across multiple computers and a cluster
usually runs multiple nodes, providing fault-tolerance and high availability.

This document outlines the various components you need to have for a complete and working Kubernetes cluster.
-->
Kubernetes 叢集由一個控制平面和一組用於運行容器化應用的工作機器組成，
這些工作機器稱作節點（Node）。每個叢集至少需要一個工作節點來運行 Pod。

工作節點託管着組成應用負載的 Pod。控制平面管理叢集中的工作節點和 Pod。
在生產環境中，控制平面通常跨多臺計算機運行，而一個叢集通常運行多個節點，以提供容錯和高可用。

本文概述了構建一個完整且可運行的 Kubernetes 叢集所需的各種組件。

<!--
{{< figure src="/images/docs/kubernetes-cluster-architecture.svg"
alt="The control plane (kube-apiserver, etcd, kube-controller-manager, kube-scheduler) and several nodes. Each node is running a kubelet and kube-proxy."
caption="Figure 1. Kubernetes cluster components." class="diagram-large" >}}
-->
{{< figure src="/images/docs/kubernetes-cluster-architecture.svg"
alt="控制平面（kube-apiserver、etcd、kube-controller-manager、kube-scheduler）和多個節點。每個節點運行 kubelet 和 kube-proxy。"
caption="圖 1. Kubernetes 叢集組件。" class="diagram-large" >}}

<!--
{{ /* details summary="About this architecture" */ }}
-->
{{< details summary="關於此架構" >}}
<!--
The diagram in Figure 1 presents an example reference architecture for a Kubernetes cluster.
The actual distribution of components can vary based on specific cluster setups and requirements.
-->
圖 1 中的圖表展示了 Kubernetes 叢集的示例參考架構，
組件的實際分佈可能根據特定的叢集設置和要求而有所不同。

<!--
In the diagram, each node runs the [`kube-proxy`](#kube-proxy) component. You need a
network proxy component on each node to ensure that the
{{< glossary_tooltip text="Service" term_id="service">}} API and associated behaviors
are available on your cluster network. However, some network plugins provide their own,
third party implementation of proxying. When you use that kind of network plugin,
the node does not need to run `kube-proxy`.
-->
圖中每個節點都運行 [`kube-proxy`](#kube-proxy) 組件。
你需要在每個節點上安裝一個網路代理組件，以確保 {{< glossary_tooltip text="Service" term_id="service">}}
API 和相關行爲在你的叢集網路上可用。
但是，一些網路插件爲流量代理提供了自己的第三方實現。
當你使用那種網路插件時，節點便不需要運行 `kube-proxy`。
{{< /details >}}

<!--
## Control plane components

The control plane's components make global decisions about the cluster (for example, scheduling),
as well as detecting and responding to cluster events (for example, starting up a new
{{< glossary_tooltip text="pod" term_id="pod">}} when a Deployment's
`{{< glossary_tooltip text="replicas" term_id="replica" >}}` field is unsatisfied).
-->
## 控制平面組件   {#control-plane-components}

控制平面組件會爲叢集做出全局決策，比如資源的調度。
以及檢測和響應叢集事件，例如當不滿足 Deployment 的
`{{< glossary_tooltip text="replicas" term_id="replica" >}}`
字段時，要啓動新的 {{< glossary_tooltip text="Pod" term_id="pod">}}）。

<!--
Control plane components can be run on any machine in the cluster. However, for simplicity, setup scripts
typically start all control plane components on the same machine, and do not run user containers on this machine.
See [Creating Highly Available clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
for an example control plane setup that runs across multiple machines.
-->
控制平面組件可以在叢集中的任何節點上運行。
然而，爲了簡單起見，安裝腳本通常會在同一個計算機上啓動所有控制平面組件，
並且不會在此計算機上運行使用者容器。
請參閱[使用 kubeadm 構建高可用性叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)中關於跨多機器安裝控制平面的示例。

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

<!--
There are many different types of controllers. Some examples of them are:

- Node controller: Responsible for noticing and responding when nodes go down.
- Job controller: Watches for Job objects that represent one-off tasks, then creates Pods to run those tasks to completion.
- EndpointSlice controller: Populates EndpointSlice objects (to provide a link between Services and Pods).
- ServiceAccount controller: Create default ServiceAccounts for new namespaces.

The above is not an exhaustive list.
-->
控制器有許多不同類型。以下是一些例子：

* Node 控制器：負責在節點出現故障時進行通知和響應
* Job 控制器：監測代表一次性任務的 Job 對象，然後創建 Pod 來運行這些任務直至完成
* EndpointSlice 控制器：填充 EndpointSlice 對象（以提供 Service 和 Pod 之間的鏈接）。
* ServiceAccount 控制器：爲新的命名空間創建預設的 ServiceAccount。

以上並不是一個詳盡的列表。

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

<!--
The cloud-controller-manager only runs controllers that are specific to your cloud provider.
If you are running Kubernetes on your own premises, or in a learning environment inside your
own PC, the cluster does not have a cloud controller manager.

As with the kube-controller-manager, the cloud-controller-manager combines several logically
independent control loops into a single binary that you run as a single process. You can scale
horizontally (run more than one copy) to improve performance or to help tolerate failures.
-->
`cloud-controller-manager` 僅運行特定於雲平臺的控制器。
因此如果你在自己的環境中運行 Kubernetes，或者在本地計算機中運行學習環境，
所部署的叢集不包含雲控制器管理器。

與 `kube-controller-manager` 類似，`cloud-controller-manager`
將若干邏輯上獨立的控制迴路組合到同一個可執行檔案中，以同一進程的方式供你運行。
你可以對其執行水平擴容（運行不止一個副本）以提升性能或者增強容錯能力。

<!--
The following controllers can have cloud provider dependencies:

- Node controller: For checking the cloud provider to determine if a node has been
  deleted in the cloud after it stops responding
- Route controller: For setting up routes in the underlying cloud infrastructure
- Service controller: For creating, updating and deleting cloud provider load balancers
-->
下面的控制器都包含對雲平臺驅動的依賴：

- Node 控制器：用於在節點終止響應後檢查雲平臺以確定節點是否已被刪除
- Route 控制器：用於在底層雲基礎架構中設置路由
- Service 控制器：用於創建、更新和刪除雲平臺上的負載均衡器

---

<!--
## Node components

Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.
-->
## 節點組件   {#node-components}

節點組件會在每個節點上運行，負責維護運行的 Pod 並提供 Kubernetes 運行時環境。

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

<!--
### kube-proxy (optional) {#kube-proxy}

If you use a [network plugin](#network-plugins) that implements packet forwarding for Services
by itself, and providing equivalent behavior to kube-proxy, then you do not need to run
kube-proxy on the nodes in your cluster.

### Container runtime
-->
### kube-proxy（可選）  {#kube-proxy}

{{< glossary_definition term_id="kube-proxy" length="all" >}}
如果你使用[網路插件](#network-plugins)爲 Service 實現本身的資料包轉發，
並提供與 kube-proxy 等效的行爲，那麼你不需要在叢集中的節點上運行 kube-proxy。

### 容器運行時   {#container-runtime}

{{< glossary_definition term_id="container-runtime" length="all" >}}

<!--
## Addons

Addons use Kubernetes resources ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, etc) to implement cluster features.
Because these are providing cluster-level features, namespaced resources for
addons belong within the `kube-system` namespace.

Selected addons are described below; for an extended list of available addons,
please see [Addons](/docs/concepts/cluster-administration/addons/).
-->
## 插件（Addons）    {#addons}

插件使用 Kubernetes 資源（{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}、
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} 等）實現叢集功能。
因爲這些插件提供叢集級別的功能，插件中命名空間域的資源屬於 `kube-system` 命名空間。

下面描述衆多插件中的幾種。有關可用插件的完整列表，
請參見[插件（Addons）](/zh-cn/docs/concepts/cluster-administration/addons/)。

### DNS

<!--
While the other addons are not strictly required, all Kubernetes clusters should have
[cluster DNS](/docs/concepts/services-networking/dns-pod-service/), as many examples rely on it.

Cluster DNS is a DNS server, in addition to the other DNS server(s) in your environment,
which serves DNS records for Kubernetes services.

Containers started by Kubernetes automatically include this DNS server in their DNS searches.
-->
儘管其他插件都並非嚴格意義上的必需組件，但幾乎所有 Kubernetes
叢集都應該有[叢集 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)，
因爲很多示例都需要 DNS 服務。

叢集 DNS 是一個 DNS 伺服器，和環境中的其他 DNS 伺服器一起工作，它爲 Kubernetes 服務提供 DNS 記錄。

Kubernetes 啓動的容器自動將此 DNS 伺服器包含在其 DNS 搜索列表中。

<!--
### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) is a general purpose,
web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications
running in the cluster, as well as the cluster itself.
-->
### Web 界面（儀表盤）   {#web-ui-dashboard}

[Dashboard](/zh-cn/docs/tasks/access-application-cluster/web-ui-dashboard/)
是 Kubernetes 叢集的通用的、基於 Web 的使用者界面。
它使使用者可以管理叢集中運行的應用程式以及叢集本身，並進行故障排除。

<!--
### Container resource monitoring

[Container Resource Monitoring](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
records generic time-series metrics about containers in a central database, and provides a UI for browsing that data.

### Cluster-level Logging

A [cluster-level logging](/docs/concepts/cluster-administration/logging/) mechanism is responsible
for saving container logs to a central log store with a search/browsing interface.
-->
### 容器資源監控   {#container-resource-monitoring}

[容器資源監控](/zh-cn/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
將關於容器的一些常見的時序度量值保存到一個集中的資料庫中，並提供瀏覽這些資料的界面。

### 叢集層面日誌   {#cluster-level-logging}

[叢集層面日誌](/zh-cn/docs/concepts/cluster-administration/logging/)機制負責將容器的日誌資料保存到一個集中的日誌儲存中，
這種集中日誌儲存提供搜索和瀏覽介面。

<!--
### Network plugins

[Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins)
are software components that implement the container network interface (CNI) specification.
They are responsible for allocating IP addresses to pods and enabling them to communicate
with each other within the cluster.
-->
### 網路插件   {#network-plugins}

[網路插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins)
是實現容器網路介面（CNI）規範的軟體組件。它們負責爲 Pod 分配 IP 地址，並使這些 Pod 能在叢集內部相互通信。

<!--
## Architecture variations

While the core components of Kubernetes remain consistent, the way they are deployed and
managed can vary. Understanding these variations is crucial for designing and maintaining
Kubernetes clusters that meet specific operational needs.
-->
## 架構變種    {#architecture-variations}

雖然 Kubernetes 的核心組件保持一致，但它們的部署和管理方式可能有所不同。
瞭解這些變化對於設計和維護滿足特定運營需求的 Kubernetes 叢集至關重要。

<!--
### Control plane deployment options

The control plane components can be deployed in several ways:

Traditional deployment
: Control plane components run directly on dedicated machines or VMs, often managed as systemd services.

Static Pods
: Control plane components are deployed as static Pods, managed by the kubelet on specific nodes.
  This is a common approach used by tools like kubeadm.
-->
### 控制平面部署選項    {#control-plane-deployment-options}

控制平面組件可以通過以下幾種方式部署：

傳統部署
: 控制平面組件直接在專用機器或虛擬機上運行，通常作爲 systemd 服務進行管理。

靜態 Pod
: 控制平面組件作爲靜態 Pod 部署，由特定節點上的 kubelet 管理。
  這是像 kubeadm 這樣的工具常用的方法。

<!--
Self-hosted
: The control plane runs as Pods within the Kubernetes cluster itself, managed by Deployments
  and StatefulSets or other Kubernetes primitives.

Managed Kubernetes services
: Cloud providers often abstract away the control plane, managing its components as part of their service offering.
-->
自託管
: 控制平面在 Kubernetes 叢集本身內部作爲 Pod 運行，
  由 Deployments、StatefulSets 或其他 Kubernetes 原語管理。

託管 Kubernetes 服務
: 雲平臺通常將控制平面抽象出來，將其組件作爲其服務的一部分進行管理。

<!--
### Workload placement considerations

The placement of workloads, including the control plane components, can vary based on cluster size,
performance requirements, and operational policies:

- In smaller or development clusters, control plane components and user workloads might run on the same nodes.
- Larger production clusters often dedicate specific nodes to control plane components,
  separating them from user workloads.
- Some organizations run critical add-ons or monitoring tools on control plane nodes.
-->
### 工作負載調度說明   {#workload-placement-considerations}

含控制平面組件在內的工作負載的調度可能因叢集大小、性能要求和操作策略而有所不同：

- 在較小或開發叢集中，控制平面組件和使用者工作負載可能在同一節點上運行。
- 較大的生產叢集通常將特定節點專用於控制平面組件，將其與使用者工作負載隔離。
- 一些組織在控制平面節點上運行關鍵組件或監控工具。

<!--
### Cluster management tools

Tools like kubeadm, kops, and Kubespray offer different approaches to deploying and managing clusters,
each with its own method of component layout and management.

The flexibility of Kubernetes architecture allows organizations to tailor their clusters to specific needs,
balancing factors such as operational complexity, performance, and management overhead.
-->
### 叢集管理工具   {#cluster-management-tools}

像 kubeadm、kops 和 Kubespray 這樣的工具提供了不同的叢集部署和管理方法，
每種方法都有自己的組件佈局和管理方式。

Kubernetes 架構的靈活性使各組織能夠根據特定需求調整其叢集，平衡操作複雜性、性能和管理開銷等因素。

<!--
### Customization and extensibility

Kubernetes architecture allows for significant customization:

- Custom schedulers can be deployed to work alongside the default Kubernetes scheduler or to replace it entirely.
- API servers can be extended with CustomResourceDefinitions and API Aggregation.
- Cloud providers can integrate deeply with Kubernetes using the cloud-controller-manager.

The flexibility of Kubernetes architecture allows organizations to tailor their clusters to specific needs,
balancing factors such as operational complexity, performance, and management overhead.
-->
### 定製和可擴展性   {#customization-and-extensibility}

Kubernetes 架構允許大幅度的定製：

- 你可以部署自定義的調度器與預設的 Kubernetes 調度器協同工作，也可以完全替換掉預設的調度器。
- API 伺服器可以通過 CustomResourceDefinition 和 API 聚合進行擴展。
- 雲平臺可以使用 cloud-controller-manager 與 Kubernetes 深度集成。

Kubernetes 架構的靈活性使各組織能夠根據特定需求調整其叢集，平衡操作複雜性、性能和管理開銷等因素。

## {{% heading "whatsnext" %}}

<!--
Learn more about the following:

- [Nodes](/docs/concepts/architecture/nodes/) and
  [their communication](/docs/concepts/architecture/control-plane-node-communication/)
  with the control plane.
- Kubernetes [controllers](/docs/concepts/architecture/controller/).
- [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/) which is the default scheduler for Kubernetes.
- Etcd's official [documentation](https://etcd.io/docs/).
- Several [container runtimes](/docs/setup/production-environment/container-runtimes/) in Kubernetes.
- Integrating with cloud providers using [cloud-controller-manager](/docs/concepts/architecture/cloud-controller/).
- [kubectl](/docs/reference/generated/kubectl/kubectl-commands) commands.
-->
瞭解更多內容：

- [節點](/zh-cn/docs/concepts/architecture/nodes/)及其與控制平面的[通信](/zh-cn/docs/concepts/architecture/control-plane-node-communication/)。
- Kubernetes [控制器](/zh-cn/docs/concepts/architecture/controller/)。
- Kubernetes 的預設調度器 [kube-scheduler](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)。
- Etcd 的官方[文檔](https://etcd.io/docs/)。
- Kubernetes 中的幾個[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)。
- 使用 [cloud-controller-manager](/zh-cn/docs/concepts/architecture/cloud-controller/) 與雲平臺集成。
- [kubectl](/zh-cn/docs/reference/generated/kubectl/kubectl-commands) 命令。
