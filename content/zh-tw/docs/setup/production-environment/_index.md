---
title: 生產環境
weight: 30
no_list: true
---
<!--
title: "Production environment"
description: Create a production-quality Kubernetes cluster
weight: 30
no_list: true
-->

<!-- overview -->

<!--
A production-quality Kubernetes cluster requires planning and preparation.
If your Kubernetes cluster is to run critical workloads, it must be configured to be resilient.
This page explains steps you can take to set up a production-ready cluster,
or to promote an existing cluster for production use.
If you're already familiar with production setup and want the links, skip to
[What's next](#what-s-next).
-->
生產質量的 Kubernetes 集羣需要規劃和準備。
如果你的 Kubernetes 集羣是用來運行關鍵負載的，該集羣必須被配置爲彈性的（Resilient）。
本頁面闡述你在安裝生產就緒的集羣或將現有集羣升級爲生產用途時可以遵循的步驟。
如果你已經熟悉生產環境安裝，因此只關注一些鏈接，則可以跳到[接下來](#what-s-next)節。

<!-- body -->

<!--
## Production considerations

Typically, a production Kubernetes cluster environment has more requirements than a
personal learning, development, or test environment Kubernetes. A production environment may require
secure access by many users, consistent availability, and the resources to adapt
to changing demands.
-->
## 生產環境考量  {#production-considerations}

通常，一個生產用 Kubernetes 集羣環境與個人學習、開發或測試環境所使用的 Kubernetes 相比有更多的需求。
生產環境可能需要被很多用戶安全地訪問，需要提供一致的可用性，以及能夠與需求變化相適配的資源。

<!--
As you decide where you want your production Kubernetes environment to live
(on premises or in a cloud) and the amount of management you want to take
on or hand to others, consider how your requirements for a Kubernetes cluster
are influenced by the following issues:
-->
在你決定在何處運行你的生產用 Kubernetes 環境（在本地或者在雲端），
以及你希望承擔或交由他人承擔的管理工作量時，
需要考察以下因素如何影響你對 Kubernetes 集羣的需求：

<!--
- *Availability*: A single-machine Kubernetes [learning environment](/docs/setup/#learning-environment)
  has a single point of failure. Creating a highly available cluster means considering:
  - Separating the control plane from the worker nodes.
  - Replicating the control plane components on multiple nodes.
  - Load balancing traffic to the cluster’s {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}}.
  - Having enough worker nodes available, or able to quickly become available, as changing workloads warrant it.
-->
- **可用性**：一個單機的 Kubernetes [學習環境](/zh-cn/docs/setup/#學習環境)
  具有單點失效特點。創建高可用的集羣則意味着需要考慮：
  - 將控制面與工作節點分開
  - 在多個節點上提供控制面組件的副本
  - 爲針對集羣的 {{< glossary_tooltip term_id="kube-apiserver" text="API 服務器" >}}
    的流量提供負載均衡
  - 隨着負載的合理需要，提供足夠的可用的（或者能夠迅速變爲可用的）工作節點

<!--
- *Scale*: If you expect your production Kubernetes environment to receive a stable amount of
  demand, you might be able to set up for the capacity you need and be done. However,
  if you expect demand to grow over time or change dramatically based on things like
  season or special events, you need to plan how to scale to relieve increased
  pressure from more requests to the control plane and worker nodes or scale down to reduce unused
  resources.
-->
- **規模**：如果你預期你的生產用 Kubernetes 環境要承受固定量的請求，
  你可能可以針對所需要的容量來一次性完成安裝。
  不過，如果你預期服務請求會隨着時間增長，或者因爲類似季節或者特殊事件的原因而發生劇烈變化，
  你就需要規劃如何處理請求上升時對控制面和工作節點的壓力，或者如何縮減集羣規模以減少未使用資源的消耗。

<!--
- *Security and access management*: You have full admin privileges on your own
  Kubernetes learning cluster. But shared clusters with important workloads, and
  more than one or two users, require a more refined approach to who and what can
  access cluster resources. You can use role-based access control
  ([RBAC](/docs/reference/access-authn-authz/rbac/)) and other
  security mechanisms to make sure that users and workloads can get access to the
  resources they need, while keeping workloads, and the cluster itself, secure.
  You can set limits on the resources that users and workloads can access
  by managing [policies](/docs/concepts/policy/) and
  [container resources](/docs/concepts/configuration/manage-resources-containers/).
-->
- **安全性與訪問管理**：在你自己的學習環境 Kubernetes 集羣上，你擁有完全的管理員特權。
  但是針對運行着重要工作負載的共享集羣，用戶賬戶不止一兩個時，
  就需要更細粒度的方案來確定誰或者哪些主體可以訪問集羣資源。
  你可以使用基於角色的訪問控制（[RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)）
  和其他安全機制來確保用戶和負載能夠訪問到所需要的資源，
  同時確保工作負載及集羣自身仍然是安全的。
  你可以通過管理[策略](/zh-cn/docs/concepts/policy/)和
  [容器資源](/zh-cn/docs/concepts/configuration/manage-resources-containers)
  來針對用戶和工作負載所可訪問的資源設置約束。

<!--
Before building a Kubernetes production environment on your own, consider
handing off some or all of this job to 
[Turnkey Cloud Solutions](/docs/setup/production-environment/turnkey-solutions/) 
providers or other [Kubernetes Partners](/partners/).
Options include:
-->
在自行構建 Kubernetes 生產環境之前，
請考慮將這一任務的部分或者全部交給[雲方案承包服務](/zh-cn/docs/setup/production-environment/turnkey-solutions)提供商或者其他
[Kubernetes 合作伙伴](/zh-cn/partners/)。選項有：

<!--
- *Serverless*: Just run workloads on third-party equipment without managing
  a cluster at all. You will be charged for things like CPU usage, memory, and
  disk requests.
- *Managed control plane*: Let the provider manage the scale and availability
  of the cluster's control plane, as well as handle patches and upgrades.
- *Managed worker nodes*: Configure pools of nodes to meet your needs,
  then the provider makes sure those nodes are available and ready to implement
  upgrades when needed.
- *Integration*: There are providers that integrate Kubernetes with other
  services you may need, such as storage, container registries, authentication
  methods, and development tools.
-->
- **無服務**：僅是在第三方設備上運行負載，完全不必管理集羣本身。
  你需要爲 CPU 用量、內存和磁盤請求等付費。
- **託管控制面**：讓供應商決定集羣控制面的規模和可用性，並負責打補丁和升級等操作。
- **託管工作節點**：配置一個節點池來滿足你的需要，由供應商來確保節點始終可用，並在需要的時候完成升級。
- **集成**：有一些供應商能夠將 Kubernetes 與一些你可能需要的其他服務集成，
  這類服務包括存儲、容器鏡像倉庫、身份認證方法以及開發工具等。

<!--
Whether you build a production Kubernetes cluster yourself or work with
partners, review the following sections to evaluate your needs as they relate
to your cluster’s *control plane*, *worker nodes*, *user access*, and
*workload resources*.
-->
無論你是自行構造一個生產用 Kubernetes 集羣還是與合作伙伴一起協作，
請審閱下面章節以評估你的需求，因爲這關係到你的集羣的**控制面**、**工作節點**、**用戶訪問**以及**負載資源**。

<!--
## Production cluster setup

In a production-quality Kubernetes cluster, the control plane manages the
cluster from services that can be spread across multiple computers
in different ways. Each worker node, however, represents a single entity that
is configured to run Kubernetes pods.
-->
## 生產用集羣安裝  {#production-cluster-setup}

在生產質量的 Kubernetes 集羣中，控制面用不同的方式來管理集羣和可以分佈到多個計算機上的服務。
每個工作節點則代表的是一個可配置來運行 Kubernetes Pod 的實體。

<!--
### Production control plane

The simplest Kubernetes cluster has the entire control plane and worker node
services running on the same machine. You can grow that environment by adding
worker nodes, as reflected in the diagram illustrated in
[Kubernetes Components](/docs/concepts/overview/components/).
If the cluster is meant to be available for a short period of time, or can be
discarded if something goes seriously wrong, this might meet your needs.
-->
### 生產用控制面  {#production-control-plane}

最簡單的 Kubernetes 集羣中，整個控制面和工作節點服務都運行在同一臺機器上。
你可以通過添加工作節點來提升環境運算能力，正如
[Kubernetes 組件](/zh-cn/docs/concepts/overview/components/)示意圖所示。
如果只需要集羣在很短的一段時間內可用，或者可以在某些事物出現嚴重問題時直接丟棄，
這種配置可能符合你的需要。

<!--
If you need a more permanent, highly available cluster, however, you should
consider ways of extending the control plane. By design, one-machine control
plane services running on a single machine are not highly available.
If keeping the cluster up and running
and ensuring that it can be repaired if something goes wrong is important,
consider these steps:
-->
如果你需要一個更爲持久的、高可用的集羣，那麼就需要考慮擴展控制面的方式。
根據設計，運行在一臺機器上的單機控制面服務不是高可用的。
如果你認爲保持集羣的正常運行並需要確保它在出錯時可以被修復是很重要的，
可以考慮以下步驟：

<!--
- *Choose deployment tools*: You can deploy a control plane using tools such
  as kubeadm, kops, and kubespray. See
  [Installing Kubernetes with deployment tools](/docs/setup/production-environment/tools/)
  to learn tips for production-quality deployments using each of those deployment
  methods. Different [Container Runtimes](/docs/setup/production-environment/container-runtimes/)
  are available to use with your deployments.
-->
- **選擇部署工具**：你可以使用類似 kubeadm、kops 和 kubespray 這類工具來部署控制面。
  參閱[使用部署工具安裝 Kubernetes](/zh-cn/docs/setup/production-environment/tools/)
  以瞭解使用這類部署方法來完成生產就緒部署的技巧。
  存在不同的[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)
  可供你的部署採用。
<!--
- *Manage certificates*: Secure communications between control plane services
  are implemented using certificates. Certificates are automatically generated
  during deployment or you can generate them using your own certificate authority.
  See [PKI certificates and requirements](/docs/setup/best-practices/certificates/) for details.
-->
- **管理證書**：控制面服務之間的安全通信是通過證書來完成的。
  證書是在部署期間自動生成的，或者你也可以使用自己的證書機構來生成它們。
  參閱 [PKI 證書和需求](/zh-cn/docs/setup/best-practices/certificates/)瞭解細節。
<!--
- *Configure load balancer for apiserver*: Configure a load balancer
  to distribute external API requests to the apiserver service instances running on different nodes. See 
  [Create an External Load Balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/)
  for details.
-->
- **爲 API 服務器配置負載均衡**：配置負載均衡器來將外部的 API 請求散佈給運行在不同節點上的 API 服務實例。
  參閱[創建外部負載均衡器](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/)瞭解細節。
<!--
- *Separate and backup etcd service*: The etcd services can either run on the
  same machines as other control plane services or run on separate machines, for
  extra security and availability. Because etcd stores cluster configuration data,
  backing up the etcd database should be done regularly to ensure that you can
  repair that database if needed.
  See the [etcd FAQ](https://etcd.io/docs/v3.5/faq/) for details on configuring and using etcd.
  See [Operating etcd clusters for Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/)
  and [Set up a High Availability etcd cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
  for details.
-->
- **分離並備份 etcd 服務**：etcd 服務可以運行於其他控制面服務所在的機器上，
  也可以運行在不同的機器上以獲得更好的安全性和可用性。
  因爲 etcd 存儲着集羣的配置數據，應該經常性地對 etcd 數據庫進行備份，
  以確保在需要的時候你可以修復該數據庫。與配置和使用 etcd 相關的細節可參閱
  [etcd FAQ](https://etcd.io/docs/v3.5/faq/)。
  更多的細節可參閱[爲 Kubernetes 運維 etcd 集羣](/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/)
  和[使用 kubeadm 配置高可用的 etcd 集羣](/zh-cn/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)。
<!--
- *Create multiple control plane systems*: For high availability, the
  control plane should not be limited to a single machine. If the control plane
  services are run by an init service (such as systemd), each service should run on at
  least three machines. However, running control plane services as pods in
  Kubernetes ensures that the replicated number of services that you request
  will always be available.
  The scheduler should be fault tolerant,
  but not highly available. Some deployment tools set up [Raft](https://raft.github.io/)
  consensus algorithm to do leader election of Kubernetes services. If the
  primary goes away, another service elects itself and take over. 
-->
- **創建多控制面系統**：爲了實現高可用性，控制面不應被限制在一臺機器上。
  如果控制面服務是使用某 init 服務（例如 systemd）來運行的，每個服務應該至少運行在三臺機器上。
  不過，將控制面作爲服務運行在 Kubernetes Pod 中可以確保你所請求的個數的服務始終保持可用。
  調度器應該是可容錯的，但不是高可用的。
  某些部署工具會安裝 [Raft](https://raft.github.io/) 票選算法來對 Kubernetes 服務執行領導者選舉。
  如果主節點消失，另一個服務會被選中並接手相應服務。
<!--
- *Span multiple zones*: If keeping your cluster available at all times is
  critical, consider creating a cluster that runs across multiple data centers,
  referred to as zones in cloud environments. Groups of zones are referred to as regions.
  By spreading a cluster across
  multiple zones in the same region, it can improve the chances that your
  cluster will continue to function even if one zone becomes unavailable.
  See [Running in multiple zones](/docs/setup/best-practices/multiple-zones/) for details.
-->
- **跨多個可用區**：如果保持你的集羣一直可用這點非常重要，可以考慮創建一個跨多個數據中心的集羣；
  在雲環境中，這些數據中心被視爲可用區。若干個可用區在一起可構成地理區域。
  通過將集羣分散到同一區域中的多個可用區內，即使某個可用區不可用，整個集羣能夠繼續工作的機會也大大增加。
  更多的細節可參閱[跨多個可用區運行](/zh-cn/docs/setup/best-practices/multiple-zones/)。
<!--
- *Manage on-going features*: If you plan to keep your cluster over time,
  there are tasks you need to do to maintain its health and security. For example,
  if you installed with kubeadm, there are instructions to help you with
  [Certificate Management](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
  and [Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
  See [Administer a Cluster](/docs/tasks/administer-cluster/)
  for a longer list of Kubernetes administrative tasks.
-->
- **管理演進中的特性**：如果你計劃長時間保留你的集羣，就需要執行一些維護其健康和安全的任務。
  例如，如果你採用 kubeadm 安裝的集羣，
  則有一些可以幫助你完成
  [證書管理](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
  和[升級 kubeadm 集羣](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)
  的指令。
  參見[管理集羣](/zh-cn/docs/tasks/administer-cluster)瞭解一個 Kubernetes
  管理任務的較長列表。

<!--
To learn about available options when you run control plane services, see
[kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/),
[kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/),
and [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/)
component pages. For highly available control plane examples, see
[Options for Highly Available topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/),
[Creating Highly Available clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/),
and [Operating etcd clusters for Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/).
See [Backing up an etcd cluster](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)
for information on making an etcd backup plan.
-->
如要了解運行控制面服務時可使用的選項，可參閱
[kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)、
[kube-controller-manager](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/) 和
[kube-scheduler](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/) 
組件參考頁面。
如要了解高可用控制面的例子，可參閱[高可用拓撲結構選項](/zh-cn/docs/setup/production-environment/tools/kubeadm/ha-topology/)、
[使用 kubeadm 創建高可用集羣](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)
以及[爲 Kubernetes 運維 etcd 集羣](/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/)。
關於制定 etcd 備份計劃，可參閱[對 etcd 集羣執行備份](/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)。

<!--
### Production worker nodes

Production-quality workloads need to be resilient and anything they rely
on needs to be resilient (such as CoreDNS). Whether you manage your own
control plane or have a cloud provider do it for you, you still need to
consider how you want to manage your worker nodes (also referred to
simply as *nodes*).  
-->
### 生產用工作節點   {#production-worker-nodes}

生產質量的工作負載需要是彈性的；它們所依賴的其他組件（例如 CoreDNS）也需要是彈性的。
無論你是自行管理控制面還是讓雲供應商來管理，你都需要考慮如何管理工作節點
（有時也簡稱爲**節點**）。

<!--
- *Configure nodes*: Nodes can be physical or virtual machines. If you want to
  create and manage your own nodes, you can install a supported operating system,
  then add and run the appropriate
  [Node services](/docs/concepts/architecture/#node-components). Consider:
-->
- **配置節點**：節點可以是物理機或者虛擬機。如果你希望自行創建和管理節點，
  你可以安裝一個受支持的操作系統，之後添加並運行合適的[節點服務](/zh-cn/docs/concepts/architecture/#node-components)。考慮：
  <!--
  - The demands of your workloads when you set up nodes by having appropriate memory, CPU, and disk speed and storage capacity available.
  - Whether generic computer systems will do or you have workloads that need GPU processors, Windows nodes, or VM isolation.
  -->
  - 在安裝節點時要通過配置適當的內存、CPU 和磁盤讀寫速率、存儲容量來滿足你的負載的需求。
  - 是否通用的計算機系統即足夠，還是你有負載需要使用 GPU 處理器、Windows 節點或者 VM 隔離。
<!--
- *Validate nodes*: See [Valid node setup](/docs/setup/best-practices/node-conformance/)
  for information on how to ensure that a node meets the requirements to join
  a Kubernetes cluster.
-->
- **驗證節點**：參閱[驗證節點配置](/zh-cn/docs/setup/best-practices/node-conformance/)以瞭解如何確保節點滿足加入到 Kubernetes 集羣的需求。
<!--
- *Add nodes to the cluster*: If you are managing your own cluster you can
  add nodes by setting up your own machines and either adding them manually or
  having them register themselves to the cluster’s apiserver. See the
  [Nodes](/docs/concepts/architecture/nodes/) section for information on how to set up Kubernetes to add nodes in these ways.
-->
- **添加節點到集羣中**：如果你自行管理你的集羣，你可以通過安裝配置你的機器，
  之後或者手動加入集羣，或者讓它們自動註冊到集羣的 API 服務器。
  參閱[節點](/zh-cn/docs/concepts/architecture/nodes/)節，瞭解如何配置 Kubernetes 以便以這些方式來添加節點。
<!--
- *Scale nodes*: Have a plan for expanding the capacity your cluster will
  eventually need. See [Considerations for large clusters](/docs/setup/best-practices/cluster-large/)
  to help determine how many nodes you need, based on the number of pods and
  containers you need to run. If you are managing nodes yourself, this can mean
  purchasing and installing your own physical equipment.
-->
- **擴縮節點**：制定一個擴充集羣容量的規劃，你的集羣最終會需要這一能力。
  參閱[大規模集羣考察事項](/zh-cn/docs/setup/best-practices/cluster-large/)
  以確定你所需要的節點數；
  這一規模是基於你要運行的 Pod 和容器個數來確定的。
  如果你自行管理集羣節點，這可能意味着要購買和安裝你自己的物理設備。
<!--
- *Autoscale nodes*: Read [Node Autoscaling](/docs/concepts/cluster-administration/cluster-autoscaling) to learn about the
  tools available to automatically manage your nodes and the capacity they
  provide.
-->
- **節點自動擴縮容**：查閱[節點自動擴縮容](/zh-cn/docs/concepts/cluster-administration/cluster-autoscaling)，
  瞭解可以自動管理節點的工具及其提供的能力。
<!--
- *Set up node health checks*: For important workloads, you want to make sure
  that the nodes and pods running on those nodes are healthy. Using the
  [Node Problem Detector](/docs/tasks/debug/debug-cluster/monitor-node-health/)
  daemon, you can ensure your nodes are healthy.
-->
- **安裝節點健康檢查**：對於重要的工作負載，你會希望確保節點以及在節點上運行的 Pod 處於健康狀態。
  通過使用 [Node Problem Detector](/zh-cn/docs/tasks/debug/debug-cluster/monitor-node-health/)，
  你可以確保你的節點是健康的。

<!--
## Production user management

In production, you may be moving from a model where you or a small group of
people are accessing the cluster to where there may potentially be dozens or
hundreds of people. In a learning environment or platform prototype, you might have a single
administrative account for everything you do. In production, you will want
more accounts with different levels of access to different namespaces.
-->
### 生產級用戶環境   {#production-user-management}

在生產環境中，情況可能不再是你或者一小組人在訪問集羣，而是幾十上百人需要訪問集羣。
在學習環境或者平臺原型環境中，你可能具有一個可以執行任何操作的管理賬號。
在生產環境中，你會需要對不同名字空間具有不同訪問權限級別的很多賬號。

<!--
Taking on a production-quality cluster means deciding how you
want to selectively allow access by other users. In particular, you need to
select strategies for validating the identities of those who try to access your
cluster (authentication) and deciding if they have permissions to do what they
are asking (authorization):
-->
建立一個生產級別的集羣意味着你需要決定如何有選擇地允許其他用戶訪問集羣。
具體而言，你需要選擇驗證嘗試訪問集羣的人的身份標識（身份認證），
並確定他們是否被許可執行他們所請求的操作（鑑權）：

<!--
- *Authentication*: The apiserver can authenticate users using client
  certificates, bearer tokens, an authenticating proxy, or HTTP basic auth.
  You can choose which authentication methods you want to use.
  Using plugins, the apiserver can leverage your organization’s existing
  authentication methods, such as LDAP or Kerberos. See
  [Authentication](/docs/reference/access-authn-authz/authentication/)
  for a description of these different methods of authenticating Kubernetes users.
-->
- **認證（Authentication）**：API 服務器可以使用客戶端證書、持有者令牌、
  身份認證代理或者 HTTP 基本認證機制來完成身份認證操作。
  你可以選擇你要使用的認證方法。通過使用插件，
  API 服務器可以充分利用你所在組織的現有身份認證方法，
  例如 LDAP 或者 Kerberos。
  關於認證 Kubernetes 用戶身份的不同方法的描述，
  可參閱[身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)。
<!--
- *Authorization*: When you set out to authorize your regular users, you will probably choose
  between RBAC and ABAC authorization. See [Authorization Overview](/docs/reference/access-authn-authz/authorization/)
  to review different modes for authorizing user accounts (as well as service account access to
  your cluster):
-->
- **鑑權（Authorization）**：當你準備爲一般用戶執行權限判定時，
  你可能會需要在 RBAC 和 ABAC 鑑權機制之間做出選擇。
  參閱[鑑權概述](/zh-cn/docs/reference/access-authn-authz/authorization/)，
  瞭解對用戶賬戶（以及訪問你的集羣的服務賬戶）執行鑑權的不同模式。
  <!--
  - *Role-based access control* ([RBAC](/docs/reference/access-authn-authz/rbac/)): Lets you
    assign access to your cluster by allowing specific sets of permissions to authenticated users.
    Permissions can be assigned for a specific namespace (Role) or across the entire cluster
    (ClusterRole). Then using RoleBindings and ClusterRoleBindings, those permissions can be attached
    to particular users.
  -->
  - **基於角色的訪問控制**（[RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)）：
    讓你通過爲通過身份認證的用戶授權特定的許可集合來控制集羣訪問。
    訪問許可可以針對某特定名字空間（Role）或者針對整個集羣（ClusterRole）。
    通過使用 RoleBinding 和 ClusterRoleBinding 對象，這些訪問許可可以被關聯到特定的用戶身上。
  <!--
  - *Attribute-based access control* ([ABAC](/docs/reference/access-authn-authz/abac/)): Lets you
    create policies based on resource attributes in the cluster and will allow or deny access
    based on those attributes. Each line of a policy file identifies versioning properties (apiVersion
    and kind) and a map of spec properties to match the subject (user or group), resource property,
    non-resource property (/version or /apis), and readonly. See
    [Examples](/docs/reference/access-authn-authz/abac/#examples) for details.
  -->
  - **基於屬性的訪問控制**（[ABAC](/zh-cn/docs/reference/access-authn-authz/abac/)）：
    讓你能夠基於集羣中資源的屬性來創建訪問控制策略，基於對應的屬性來決定允許還是拒絕訪問。
    策略文件的每一行都給出版本屬性（apiVersion 和 kind）以及一個規約屬性的映射，
    用來匹配主體（用戶或組）、資源屬性、非資源屬性（/version 或 /apis）和只讀屬性。
    參閱[示例](/zh-cn/docs/reference/access-authn-authz/abac/#examples)以瞭解細節。

<!--
As someone setting up authentication and authorization on your production Kubernetes cluster, here are some things to consider:
-->
作爲在你的生產用 Kubernetes 集羣中安裝身份認證和鑑權機制的負責人，要考慮的事情如下：

<!--
- *Set the authorization mode*: When the Kubernetes API server
  ([kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/))
  starts, supported authorization modes must be set using an *--authorization-config* file or the *--authorization-mode*
  flag. For example, that flag in the *kube-adminserver.yaml* file (in */etc/kubernetes/manifests*)
  could be set to Node,RBAC. This would allow Node and RBAC authorization for authenticated requests.
-->
- **設置鑑權模式**：當 Kubernetes API 服務器（[kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)）啓動時，
  所支持的鑑權模式必須使用 `*--authorization-config` 文件或 `--authorization-mode` 標誌配置。
  例如，`kube-apiserver.yaml`（位於 `/etc/kubernetes/manifests` 下）中對應的標誌可以設置爲 `Node,RBAC`。
  這樣就會針對已完成身份認證的請求執行 Node 和 RBAC 鑑權。
<!--
- *Create user certificates and role bindings (RBAC)*: If you are using RBAC
  authorization, users can create a CertificateSigningRequest (CSR) that can be
  signed by the cluster CA. Then you can bind Roles and ClusterRoles to each user.
  See [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
  for details.
-->
- **創建用戶證書和角色綁定（RBAC）**：如果你在使用 RBAC 鑑權，用戶可以創建由集羣 CA 簽名的
  CertificateSigningRequest（CSR）。接下來你就可以將 Role 和 ClusterRole 綁定到每個用戶身上。
  參閱[證書籤名請求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)瞭解細節。
<!--
- *Create policies that combine attributes (ABAC)*: If you are using ABAC
  authorization, you can assign combinations of attributes to form policies to
  authorize selected users or groups to access particular resources (such as a
  pod), namespace, or apiGroup. For more information, see
  [Examples](/docs/reference/access-authn-authz/abac/#examples).
-->
- **創建組合屬性的策略（ABAC）**：如果你在使用 ABAC 鑑權，
  你可以設置屬性組合以構造策略對所選用戶或用戶組執行鑑權，
  判定他們是否可訪問特定的資源（例如 Pod）、名字空間或者 apiGroup。
  進一步的詳細信息可參閱[示例](/zh-cn/docs/reference/access-authn-authz/abac/#examples)。
<!--
- *Consider Admission Controllers*: Additional forms of authorization for
  requests that can come in through the API server include
  [Webhook Token Authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication).
  Webhooks and other special authorization types need to be enabled by adding
  [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
  to the API server.
-->
- **考慮准入控制器**：針對指向 API 服務器的請求的其他鑑權形式還包括
  [Webhook 令牌認證](/zh-cn/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)。
  Webhook 和其他特殊的鑑權類型需要通過向 API
  服務器添加[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)來啓用。

<!--
## Set limits on workload resources

Demands from production workloads can cause pressure both inside and outside
of the Kubernetes control plane. Consider these items when setting up for the
needs of your cluster's workloads:
-->
## 爲負載資源設置約束  {#set-limits-on-workload-resources}

生產環境負載的需求可能對 Kubernetes 的控制面內外造成壓力。
在針對你的集羣的負載執行配置時，要考慮以下條目：

<!--
- *Set namespace limits*: Set per-namespace quotas on things like memory and CPU. See
  [Manage Memory, CPU, and API Resources](/docs/tasks/administer-cluster/manage-resources/)
  for details.
-->
- **設置名字空間限制**：爲每個名字空間的內存和 CPU 設置配額。
  參閱[管理內存、CPU 和 API 資源](/zh-cn/docs/tasks/administer-cluster/manage-resources/)以瞭解細節。
<!--
- *Prepare for DNS demand*: If you expect workloads to massively scale up,
  your DNS service must be ready to scale up as well. See
  [Autoscale the DNS service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
-->
- **爲 DNS 請求做準備**：如果你希望工作負載能夠完成大規模擴展，你的 DNS 服務也必須能夠擴大規模。
  參閱[自動擴縮集羣中 DNS 服務](/zh-cn/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)。
<!--
- *Create additional service accounts*: User accounts determine what users can
  do on a cluster, while a service account defines pod access within a particular
  namespace. By default, a pod takes on the default service account from its namespace.
  See [Managing Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/)
  for information on creating a new service account. For example, you might want to:
-->
- **創建額外的服務賬戶**：用戶賬戶決定用戶可以在集羣上執行的操作，服務賬號則定義的是在特定名字空間中
  Pod 的訪問權限。默認情況下，Pod 使用所在名字空間中的 default 服務賬號。
  參閱[管理服務賬號](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)以瞭解如何創建新的服務賬號。
  例如，你可能需要：
  <!--
  - Add secrets that a pod could use to pull images from a particular container registry. See
    [Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/)
    for an example.
  - Assign RBAC permissions to a service account. See
    [ServiceAccount permissions](/docs/reference/access-authn-authz/rbac/#service-account-permissions)
    for details.
  -->
  - 爲 Pod 添加 Secret，以便 Pod 能夠從某特定的容器鏡像倉庫拉取鏡像。
    參閱[爲 Pod 配置服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)以獲得示例。
  - 爲服務賬號設置 RBAC 訪問許可。參閱[服務賬號訪問許可](/zh-cn/docs/reference/access-authn-authz/rbac/#service-account-permissions)瞭解細節。

## {{% heading "whatsnext" %}}

<!--
- Decide if you want to build your own production Kubernetes or obtain one from
  available [Turnkey Cloud Solutions](/docs/setup/production-environment/turnkey-solutions/)
  or [Kubernetes Partners](/partners/).
- If you choose to build your own cluster, plan how you want to
  handle [certificates](/docs/setup/best-practices/certificates/)
  and set up high availability for features such as
  [etcd](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
  and the
  [API server](/docs/setup/production-environment/tools/kubeadm/ha-topology/).
-->
- 決定你是想自行構造自己的生產用 Kubernetes，
  還是從某可用的[雲服務外包廠商](/zh-cn/docs/setup/production-environment/turnkey-solutions/)或
  [Kubernetes 合作伙伴](/zh-cn/partners/)獲得集羣。
- 如果你決定自行構造集羣，則需要規劃如何處理[證書](/zh-cn/docs/setup/best-practices/certificates/)併爲類似
  [etcd](/zh-cn/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) 和
  [API 服務器](/zh-cn/docs/setup/production-environment/tools/kubeadm/ha-topology/)這些功能組件配置高可用能力。
<!--
- Choose from [kubeadm](/docs/setup/production-environment/tools/kubeadm/),
  [kops](https://kops.sigs.k8s.io/) or
  [Kubespray](https://kubespray.io/) deployment methods.
-->
- 選擇使用 [kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/)、
  [kops](https://kops.sigs.k8s.io/) 或
  [Kubespray](https://kubespray.io/) 作爲部署方法。
<!--
- Configure user management by determining your
  [Authentication](/docs/reference/access-authn-authz/authentication/) and
  [Authorization](/docs/reference/access-authn-authz/authorization/) methods.
-->
- 通過決定[身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)和[鑑權](/zh-cn/docs/reference/access-authn-authz/authorization/)方法來配置用戶管理。
<!--
- Prepare for application workloads by setting up
  [resource limits](/docs/tasks/administer-cluster/manage-resources/),
  [DNS autoscaling](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
  and [service accounts](/docs/reference/access-authn-authz/service-accounts-admin/).
-->
- 通過配置[資源限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/)、
  [DNS 自動擴縮](/zh-cn/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)和[服務賬號](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)來爲應用負載作準備。
