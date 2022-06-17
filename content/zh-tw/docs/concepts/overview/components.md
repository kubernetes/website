---
title: Kubernetes 元件
content_type: concept
description: >
  Kubernetes 叢集由代表控制平面的元件和一組稱為節點的機器組成。
weight: 20
card:
  name: concepts
  weight: 20
---
<!--
reviewers:
- lavalamp
title: Kubernetes Components
content_type: concept
description: >
  A Kubernetes cluster consists of the components that represent the control plane
  and a set of machines called nodes
weight: 20
card:
  name: concepts
  weight: 20
-->

<!--
When you deploy Kubernetes, you get a cluster.
{{</* glossary_definition term_id="cluster" length="all" prepend="A Kubernetes cluster consists of" */>}}

This document outlines the various components you need to have for
a complete and working Kubernetes cluster.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Components of Kubernetes" caption="The components of a Kubernetes cluster" class="diagram-large" >}}

-->
<!-- overview -->
當你部署完 Kubernetes，便擁有了一個完整的叢集。
{{< glossary_definition term_id="cluster" length="all" prepend="一個 Kubernetes">}}

本文件概述了一個正常執行的 Kubernetes 叢集所需的各種元件。

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetes 的元件" caption="Kubernetes 叢集的元件" class="diagram-large" >}}

<!-- body -->

<!--
## Control Plane Components

The control plane's components make global decisions about the cluster (for example, scheduling), as well as detecting and responding to cluster events (for example, starting up a new {{< glossary_tooltip text="pod" term_id="pod">}} when a deployment's `replicas` field is unsatisfied).
 -->
## 控制平面元件（Control Plane Components）    {#control-plane-components}

控制平面元件會為叢集做出全域性決策，比如資源的排程。
以及檢測和響應叢集事件，例如當不滿足部署的 `replicas` 欄位時，
要啟動新的 {{< glossary_tooltip text="pod" term_id="pod">}}）。

<!--
Control plane components can be run on any machine in the cluster. However,
for simplicity, set up scripts typically start all control plane components on
the same machine, and do not run user containers on this machine. See
[Creating Highly Available clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
for an example control plane setup that runs across multiple machines.
 -->
控制平面元件可以在叢集中的任何節點上執行。
然而，為了簡單起見，設定指令碼通常會在同一個計算機上啟動所有控制平面元件，
並且不會在此計算機上執行使用者容器。
請參閱[使用 kubeadm 構建高可用性叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)
中關於跨多機器控制平面設定的示例。

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

<!--
Some types of these controllers are:

  * Node controller: Responsible for noticing and responding when nodes go down.
  * Job controller: Watches for Job objects that represent one-off tasks, then creates
    Pods to run those tasks to completion.
  * Endpoints controller: Populates the Endpoints object (that is, joins Services & Pods).
  * Service Account & Token controllers: Create default accounts and API access tokens for new namespaces.
-->
這些控制器包括：

* 節點控制器（Node Controller）：負責在節點出現故障時進行通知和響應
* 任務控制器（Job Controller）：監測代表一次性任務的 Job 物件，然後建立 Pods 來執行這些任務直至完成
* 端點控制器（Endpoints Controller）：填充端點（Endpoints）物件（即加入 Service 與 Pod）
* 服務帳戶和令牌控制器（Service Account & Token Controllers）：為新的名稱空間建立預設帳戶和 API 訪問令牌

<!--
### cloud-controller-manager

The cloud-controller-manager only runs controllers that are specific to your cloud provider.
If you are running Kubernetes on your own premises, or in a learning environment inside your
own PC, the cluster does not have a cloud controller manager.

As with the kube-controller-manager, the cloud-controller-manager combines several logically
independent control loops into a single binary that you run as a single process. You can
scale horizontally (run more than one copy) to improve performance or to help tolerate failures.

The following controllers can have cloud provider dependencies:

  * Node controller: For checking the cloud provider to determine if a node has been deleted in the cloud after it stops responding
  * Route controller: For setting up routes in the underlying cloud infrastructure
  * Service controller: For creating, updating and deleting cloud provider load balancers
-->
### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

`cloud-controller-manager` 僅執行特定於雲平臺的控制器。
因此如果你在自己的環境中執行 Kubernetes，或者在本地計算機中執行學習環境，
所部署的叢集不需要有云控制器管理器。

與 `kube-controller-manager` 類似，`cloud-controller-manager`
將若干邏輯上獨立的控制迴路組合到同一個可執行檔案中，
供你以同一程序的方式執行。
你可以對其執行水平擴容（執行不止一個副本）以提升效能或者增強容錯能力。

下面的控制器都包含對雲平臺驅動的依賴：

  * 節點控制器（Node Controller）：用於在節點終止響應後檢查雲提供商以確定節點是否已被刪除
  * 路由控制器（Route Controller）：用於在底層雲基礎架構中設定路由
  * 服務控制器（Service Controller）：用於建立、更新和刪除雲提供商負載均衡器

<!--
## Node Components

Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.
-->
## Node 元件  {#node-components}

節點元件會在每個節點上執行，負責維護執行的 Pod 並提供 Kubernetes 執行環境。

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

<!--
### Container Runtime
-->
### 容器執行時（Container Runtime）    {#container-runtime}

{{< glossary_definition term_id="container-runtime" length="all" >}}

<!--
## Addons

Addons use Kubernetes resources ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, etc)
to implement cluster features. Because these are providing cluster-level features, namespaced resources
for addons belong within the `kube-system` namespace.
-->
## 外掛（Addons）    {#addons}

外掛使用 Kubernetes 資源（{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}、
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} 等）實現叢集功能。
因為這些外掛提供叢集級別的功能，外掛中名稱空間域的資源屬於 `kube-system` 名稱空間。

<!--
Selected addons are described below; for an extended list of available addons, please
see [Addons](/docs/concepts/cluster-administration/addons/).
-->
下面描述眾多外掛中的幾種。有關可用外掛的完整列表，請參見
[外掛（Addons）](/zh-cn/docs/concepts/cluster-administration/addons/)。

<!--
### DNS

While the other addons are not strictly required, all Kubernetes clusters should have [cluster DNS](/docs/concepts/services-networking/dns-pod-service/), as many examples rely on it.

Cluster DNS is a DNS server, in addition to the other DNS server(s) in your environment, which serves DNS records for Kubernetes services.

Containers started by Kubernetes automatically include this DNS server in their DNS searches.
-->
### DNS   {#dns}

儘管其他外掛都並非嚴格意義上的必需元件，但幾乎所有 Kubernetes 叢集都應該
有[叢集 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)，
因為很多示例都需要 DNS 服務。

叢集 DNS 是一個 DNS 伺服器，和環境中的其他 DNS 伺服器一起工作，它為 Kubernetes 服務提供 DNS 記錄。

Kubernetes 啟動的容器自動將此 DNS 伺服器包含在其 DNS 搜尋列表中。

<!--
### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications running in the cluster, as well as the cluster itself.
-->
### Web 介面（儀表盤）   {#web-ui-dashboard}

[Dashboard](/zh-cn/docs/tasks/access-application-cluster/web-ui-dashboard/)
是 Kubernetes 叢集的通用的、基於 Web 的使用者介面。
它使使用者可以管理叢集中執行的應用程式以及叢集本身，
並進行故障排除。

<!--
### Container Resource Monitoring

[Container Resource Monitoring](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/) records generic time-series metrics
about containers in a central database, and provides a UI for browsing that data.
-->
### 容器資源監控   {#container-resource-monitoring}

[容器資源監控](/zh-cn/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
將關於容器的一些常見的時間序列度量值儲存到一個集中的資料庫中，
並提供瀏覽這些資料的介面。

<!--
### Cluster-level Logging

A [cluster-level logging](/docs/concepts/cluster-administration/logging/) mechanism is responsible for
saving container logs to a central log store with search/browsing interface.
-->
### 叢集層面日誌   {#cluster-level-logging}

[叢集層面日誌](/zh-cn/docs/concepts/cluster-administration/logging/) 
機制負責將容器的日誌資料儲存到一個集中的日誌儲存中，
這種集中日誌儲存提供搜尋和瀏覽介面。

## {{% heading "whatsnext" %}}

<!--
* Learn about [Nodes](/docs/concepts/architecture/nodes/)
* Learn about [Controllers](/docs/concepts/architecture/controller/)
* Learn about [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Read etcd's official [documentation](https://etcd.io/docs/)
-->
* 進一步瞭解[節點](/zh-cn/docs/concepts/architecture/nodes/)
* 進一步瞭解[控制器](/zh-cn/docs/concepts/architecture/controller/)
* 進一步瞭解 [kube-scheduler](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)
* 閱讀 etcd 官方[文件](https://etcd.io/docs/)
