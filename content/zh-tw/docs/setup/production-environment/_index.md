---
title: 生產環境
weight: 30
no_list: true
---

<!-- overview -->

<!--
A production-quality Kubernetes cluster requires planning and preparation.
If your Kubernetes cluster is to run critical workloads, it must be configured to be resilient.
This page explains steps you can take to set up a production-ready cluster,
or to promote an existing cluster for production use.
If you're already familiar with production setup and want the links, skip to
[What's next](#what-s-next).
-->
生產質量的 Kubernetes 叢集需要規劃和準備。
如果你的 Kubernetes 叢集是用來執行關鍵負載的，該叢集必須被配置為彈性的（Resilient）。
本頁面闡述你在安裝生產就緒的叢集或將現有叢集升級為生產用途時可以遵循的步驟。
如果你已經熟悉生產環境安裝，因此只關注一些連結，則可以跳到[接下來](#what-s-next)節。

<!-- body -->

<!--
## Production considerations

Typically, a production Kubernetes cluster environment has more requirements than a
personal learning, development, or test environment Kubernetes. A production environment may require
secure access by many users, consistent availability, and the resources to adapt
to changing demands.
-->
## 生產環境考量  {#production-considerations}

通常，一個生產用 Kubernetes 叢集環境與個人學習、開發或測試環境所使用的
Kubernetes 相比有更多的需求。生產環境可能需要被很多使用者安全地訪問，需要
提供一致的可用性，以及能夠與需求變化相適配的資源。

<!--
As you decide where you want your production Kubernetes environment to live
(on premises or in a cloud) and the amount of management you want to take
on or hand to others, consider how your requirements for a Kubernetes cluster
are influenced by the following issues:
-->
在你決定在何處執行你的生產用 Kubernetes 環境（在本地或者在雲端），以及
你希望承擔或交由他人承擔的管理工作量時，需要考察以下因素如何影響你對
Kubernetes 叢集的需求：

<!--
- *Availability*: A single-machine Kubernetes [learning environment](/docs/setup/#learning-environment)
has a single point of failure. Creating a highly available cluster means considering:
  - Separating the control plane from the worker nodes.
  - Replicating the control plane components on multiple nodes.
  - Load balancing traffic to the cluster’s {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}}.
  - Having enough worker nodes available, or able to quickly become available, as changing workloads warrant it.
-->
- *可用性*：一個單機的 Kubernetes [學習環境](/zh-cn/docs/setup/#學習環境)
  具有單點失效特點。建立高可用的叢集則意味著需要考慮：
  - 將控制面與工作節點分開
  - 在多個節點上提供控制面元件的副本
  - 為針對叢集的 {{< glossary_tooltip term_id="kube-apiserver" text="API 伺服器" >}}
    的流量提供負載均衡
  - 隨著負載的合理需要，提供足夠的可用的（或者能夠迅速變為可用的）工作節點

<!--
- *Scale*: If you expect your production Kubernetes environment to receive a stable amount of
demand, you might be able to set up for the capacity you need and be done. However,
if you expect demand to grow over time or change dramatically based on things like
season or special events, you need to plan how to scale to relieve increased
pressure from more requests to the control plane and worker nodes or scale down to reduce unused
resources.
-->
- *規模*：如果你預期你的生產用 Kubernetes 環境要承受固定量的請求，
  你可能可以針對所需要的容量來一次性完成安裝。
  不過，如果你預期服務請求會隨著時間增長，或者因為類似季節或者特殊事件的
  原因而發生劇烈變化，你就需要規劃如何處理請求上升時對控制面和工作節點
  的壓力，或者如何縮減叢集規模以減少未使用資源的消耗。

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
- *安全性與訪問管理*：在你自己的學習環境 Kubernetes 叢集上，你擁有完全的管理員特權。
  但是針對執行著重要工作負載的共享叢集，使用者賬戶不止一兩個時，就需要更細粒度
  的方案來確定誰或者哪些主體可以訪問叢集資源。
  你可以使用基於角色的訪問控制（[RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)）
  和其他安全機制來確保使用者和負載能夠訪問到所需要的資源，同時確保工作負載及叢集
  自身仍然是安全的。
  你可以透過管理[策略](/zh-cn/docs/concets/policy/)和
  [容器資源](/zh-cn/docs/concepts/configuration/manage-resources-containers)來
  針對使用者和工作負載所可訪問的資源設定約束，

<!--
Before building a Kubernetes production environment on your own, consider
handing off some or all of this job to 
[Turnkey Cloud Solutions](/docs/setup/production-environment/turnkey-solutions/) 
providers or other [Kubernetes Partners](https://kubernetes.io/partners/).
Options include:
-->
在自行構造 Kubernetes 生產環境之前，請考慮將這一任務的部分或者全部交給
[雲方案承包服務](/zh-cn/docs/setup/production-environment/turnkey-solutions)
提供商或者其他 [Kubernetes 合作伙伴](https://kubernetes.io/partners/)。
選項有：

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
- *無服務*：僅是在第三方裝置上執行負載，完全不必管理叢集本身。你需要為
  CPU 用量、記憶體和磁碟請求等付費。
- *託管控制面*：讓供應商決定叢集控制面的規模和可用性，並負責打補丁和升級等操作。
- *託管工作節點*：配置一個節點池來滿足你的需要，由供應商來確保節點始終可用，
  並在需要的時候完成升級。
- *整合*：有一些供應商能夠將 Kubernetes 與一些你可能需要的其他服務整合，
  這類服務包括儲存、容器映象倉庫、身份認證方法以及開發工具等。

<!--
Whether you build a production Kubernetes cluster yourself or work with
partners, review the following sections to evaluate your needs as they relate
to your cluster’s *control plane*, *worker nodes*, *user access*, and
*workload resources*.
-->
無論你是自行構造一個生產用 Kubernetes 叢集還是與合作伙伴一起協作，請審閱
下面章節以評估你的需求，因為這關係到你的叢集的 *控制面*、*工作節點*、
*使用者訪問* 以及 *負載資源*。

<!--
## Production cluster setup

In a production-quality Kubernetes cluster, the control plane manages the
cluster from services that can be spread across multiple computers
in different ways. Each worker node, however, represents a single entity that
is configured to run Kubernetes pods.
-->
## 生產用叢集安裝  {#production-cluster-setup}

在生產質量的 Kubernetes 叢集中，控制面用不同的方式來管理叢集和可以
分佈到多個計算機上的服務。每個工作節點則代表的是一個可配置來執行
Kubernetes Pods 的實體。

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

最簡單的 Kubernetes 叢集中，整個控制面和工作節點服務都執行在同一臺機器上。
你可以透過新增工作節點來提升環境能力，正如
[Kubernetes 元件](/zh-cn/docs/concepts/overview/components/)示意圖所示。
如果只需要叢集在很短的一段時間內可用，或者可以在某些事物出現嚴重問題時直接丟棄，
這種配置可能符合你的需要。

<!--
If you need a more permanent, highly available cluster, however, you should
consider ways of extending the control plane. By design, one-machine control
plane services running on a single machine are not highly available.
If keeping the cluster up and running
and ensuring that it can be repaired if something goes wrong is important,
consider these steps:
-->
如果你需要一個更為持久的、高可用的叢集，那麼你就需要考慮擴充套件控制面的方式。
根據設計，執行在一臺機器上的單機控制面服務不是高可用的。
如果保持叢集處於執行狀態並且需要確保在出現問題時能夠被修復這點很重要，
可以考慮以下步驟：

<!--
- *Choose deployment tools*: You can deploy a control plane using tools such
as kubeadm, kops, and kubespray. See
[Installing Kubernetes with deployment tools](/docs/setup/production-environment/tools/)
to learn tips for production-quality deployments using each of those deployment
methods. Different [Container Runtimes](/docs/setup/production-environment/container-runtimes/)
are available to use with your deployments.
-->
- *選擇部署工具*：你可以使用類似 kubeadm、kops 和 kubespray 這類工具來部署控制面。
  參閱[使用部署工具安裝 Kubernetes](/zh-cn/docs/setup/production-environment/tools/)
  以瞭解使用這類部署方法來完成生產就緒部署的技巧。
  存在不同的[容器執行時](/zh-cn/docs/setup/production-environment/container-runtimes/)
  可供你的部署採用。
<!--
- *Manage certificates*: Secure communications between control plane services
are implemented using certificates. Certificates are automatically generated
during deployment or you can generate them using your own certificate authority.
See [PKI certificates and requirements](/docs/setup/best-practices/certificates/) for details.
-->
- *管理證書*：控制面服務之間的安全通訊是透過證書來完成的。證書是在部署期間
  自動生成的，或者你也可以使用你自己的證書機構來生成它們。
  參閱 [PKI 證書和需求](/zh-cn/docs/setup/best-practices/certificates/)瞭解細節。
<!--
- *Configure load balancer for apiserver*: Configure a load balancer
to distribute external API requests to the apiserver service instances running on different nodes. See 
[Create an External Load Balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/)
for details.
-->
- *為 API 伺服器配置負載均衡*：配置負載均衡器來將外部的 API 請求散佈給執行在
  不同節點上的 API 服務例項。參閱
  [建立外部負載均衡器](/zh-cn/docs/access-application-cluster/create-external-load-balancer/)
  瞭解細節。
<!--
- *Separate and backup etcd service*: The etcd services can either run on the
same machines as other control plane services or run on separate machines, for
extra security and availability. Because etcd stores cluster configuration data,
backing up the etcd database should be done regularly to ensure that you can
repair that database if needed.
See the [etcd FAQ](https://etcd.io/docs/v3.4/faq/) for details on configuring and using etcd.
See [Operating etcd clusters for Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/)
and [Set up a High Availability etcd cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
for details.
-->
- *分離並備份 etcd 服務*：etcd 服務可以運行於其他控制面服務所在的機器上，
  也可以執行在不同的機器上以獲得更好的安全性和可用性。
  因為 etcd 儲存著叢集的配置資料，應該經常性地對 etcd 資料庫進行備份，
  以確保在需要的時候你可以修復該資料庫。與配置和使用 etcd 相關的細節可參閱
  [etcd FAQ](/https://etcd.io/docs/v3.4/faq/)。
  更多的細節可參閱[為 Kubernetes 運維 etcd 叢集](/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/)
  和[使用 kubeadm 配置高可用的 etcd 叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)。
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
- *建立多控制面系統*：為了實現高可用性，控制面不應被限制在一臺機器上。
  如果控制面服務是使用某 init 服務（例如 systemd）來執行的，每個服務應該
  至少執行在三臺機器上。不過，將控制面作為服務執行在 Kubernetes Pods
  中可以確保你所請求的個數的服務始終保持可用。
  排程器應該是可容錯的，但不是高可用的。
  某些部署工具會安裝 [Raft](https://raft.github.io/) 票選演算法來對 Kubernetes
  服務執行領導者選舉。如果主節點消失，另一個服務會被選中並接手相應服務。
<!--
- *Span multiple zones*: If keeping your cluster available at all times is
critical, consider creating a cluster that runs across multiple data centers,
referred to as zones in cloud environments. Groups of zones are referred to as regions.
By spreading a cluster across
multiple zones in the same region, it can improve the chances that your
cluster will continue to function even if one zone becomes unavailable.
See [Running in multiple zones](/docs/setup/best-practices/multiple-zones/) for details.
-->
- *跨多個可用區*：如果保持你的叢集一直可用這點非常重要，可以考慮建立一個跨
  多個數據中心的叢集；在雲環境中，這些資料中心被視為可用區。
  若干個可用區在一起可構成地理區域。
  透過將叢集分散到同一區域中的多個可用區內，即使某個可用區不可用，整個叢集
  能夠繼續工作的機會也大大增加。
  更多的細節可參閱[跨多個可用區執行](/zh-cn/docs/setup/best-practices/multiple-zones/)。
<!--
- *Manage on-going features*: If you plan to keep your cluster over time,
there are tasks you need to do to maintain its health and security. For example,
if you installed with kubeadm, there are instructions to help you with
[Certificate Management](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
and [Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
See [Administer a Cluster](/docs/tasks/administer-cluster/)
for a longer list of Kubernetes administrative tasks.
-->
- *管理演進中的特性*：如果你計劃長時間保留你的叢集，就需要執行一些維護其
  健康和安全的任務。例如，如果你採用 kubeadm 安裝的叢集，則有一些可以幫助你完成
  [證書管理](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
  和[升級 kubeadm 叢集](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)
  的指令。
  參見[管理叢集](/zh-cn/docs/tasks/administer-cluster)瞭解一個 Kubernetes
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
要了解執行控制面服務時可使用的選項，可參閱
[kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)、
[kube-controller-manager](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/) 和
[kube-scheduler](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)
元件參考頁面。
如要了解高可用控制面的例子，可參閱
[高可用拓撲結構選項](/zh-cn/docs/setup/production-environment/tools/kubeadm/ha-topology/)、
[使用 kubeadm 建立高可用叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/) 以及[為 Kubernetes 運維 etcd 叢集](/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/)。
關於制定 etcd 備份計劃，可參閱
[對 etcd 叢集執行備份](/zh-cn/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)。

<!--
### Production worker nodes

Production-quality workloads need to be resilient and anything they rely
on needs to be resilient (such as CoreDNS). Whether you manage your own
control plane or have a cloud provider do it for you, you still need to
consider how you want to manage your worker nodes (also referred to
simply as *nodes*).  
-->
### 生產用工作節點

生產質量的工作負載需要是彈性的；它們所依賴的其他元件（例如 CoreDNS）也需要是彈性的。
無論你是自行管理控制面還是讓雲供應商來管理，你都需要考慮如何管理工作節點
（有時也簡稱為*節點*）。

<!--
- *Configure nodes*: Nodes can be physical or virtual machines. If you want to
create and manage your own nodes, you can install a supported operating system,
then add and run the appropriate
[Node services](/docs/concepts/overview/components/#node-components). Consider:
-->
- *配置節點*：節點可以是物理機或者虛擬機器。如果你希望自行建立和管理節點，
  你可以安裝一個受支援的作業系統，之後新增並執行合適的
  [節點服務](/zh-cn/docs/concepts/overview/components/#node-components)。
  考慮：
  <!--
  - The demands of your workloads when you set up nodes by having appropriate memory, CPU, and disk speed and storage capacity available.
  - Whether generic computer systems will do or you have workloads that need GPU processors, Windows nodes, or VM isolation.
  -->
  - 在安裝節點時要透過配置適當的記憶體、CPU 和磁碟速度、儲存容量來滿足
    你的負載的需求。
  - 是否通用的計算機系統即足夠，還是你有負載需要使用 GPU 處理器、Windows 節點
    或者 VM 隔離。
<!--
- *Validate nodes*: See [Valid node setup](/docs/setup/best-practices/node-conformance/)
for information on how to ensure that a node meets the requirements to join
a Kubernetes cluster.
-->
- *驗證節點*：參閱[驗證節點配置](/zh-cn/docs/setup/best-practices/node-conformance/)
  以瞭解如何確保節點滿足加入到 Kubernetes 叢集的需求。
<!--
- *Add nodes to the cluster*: If you are managing your own cluster you can
add nodes by setting up your own machines and either adding them manually or
having them register themselves to the cluster’s apiserver. See the
[Nodes](/docs/concepts/architecture/nodes/) section for information on how to set up Kubernetes to add nodes in these ways.
-->
- *新增節點到叢集中*：如果你自行管理你的叢集，你可以透過安裝配置你的機器，
  之後或者手動加入叢集，或者讓它們自動註冊到叢集的 API 伺服器。參閱
  [節點](/zh-cn/docs/concepts/architecture/nodes/)節，瞭解如何配置 Kubernetes
  以便以這些方式來新增節點。
<!--
- *Add Windows nodes to the cluster*: Kubernetes offers support for Windows
worker nodes, allowing you to run workloads implemented in Windows containers. See
[Windows in Kubernetes](/docs/setup/production-environment/windows/) for details.
-->
- *向叢集中新增 Windows 節點*：Kubernetes 提供對 Windows 工作節點的支援；
  這使得你可以執行實現於 Windows 容器內的工作負載。參閱
  [Kubernetes 中的 Windows](/zh-cn/docs/setup/production-environment/windows/)
  瞭解進一步的詳細資訊。
<!--
- *Scale nodes*: Have a plan for expanding the capacity your cluster will
eventually need. See [Considerations for large clusters](/docs/setup/best-practices/cluster-large/)
to help determine how many nodes you need, based on the number of pods and
containers you need to run. If you are managing nodes yourself, this can mean
purchasing and installing your own physical equipment.
-->
- *擴縮節點*：制定一個擴充叢集容量的規劃，你的叢集最終會需要這一能力。
  參閱[大規模叢集考察事項](/zh-cn/docs/setup/best-practices/cluster-large/)
  以確定你所需要的節點數；這一規模是基於你要執行的 Pod 和容器個數來確定的。
  如果你自行管理叢集節點，這可能意味著要購買和安裝你自己的物理裝置。
<!--
- *Autoscale nodes*: Most cloud providers support
[Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#readme)
to replace unhealthy nodes or grow and shrink the number of nodes as demand requires. See the
[Frequently Asked Questions](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
for how the autoscaler works and
[Deployment](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#deployment)
for how it is implemented by different cloud providers. For on-premises, there
are some virtualization platforms that can be scripted to spin up new nodes
based on demand.
-->
- *節點自動擴縮容*：大多數雲供應商支援
  [叢集自動擴縮器（Cluster Autoscaler）](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#readme)
  以便替換不健康的節點、根據需求來增加或縮減節點個數。參閱
  [常見問題](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
  瞭解自動擴縮器的工作方式，並參閱
  [Deployment](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#deployment)
  瞭解不同雲供應商是如何實現叢集自動擴縮器的。
  對於本地叢集，有一些虛擬化平臺可以透過指令碼來控制按需啟動新節點。
<!--
- *Set up node health checks*: For important workloads, you want to make sure
that the nodes and pods running on those nodes are healthy. Using the
[Node Problem Detector](/docs/tasks/debug/debug-cluster/monitor-node-health/)
daemon, you can ensure your nodes are healthy.
-->
- *安裝節點健康檢查*：對於重要的工作負載，你會希望確保節點以及在節點上
  執行的 Pod 處於健康狀態。透過使用
  [Node Problem Detector](/zh-cn/docs/tasks/debug/debug-cluster/monitor-node-health/)，
  你可以確保你的節點是健康的。

<!--
## Production user management

In production, you may be moving from a model where you or a small group of
people are accessing the cluster to where there may potentially be dozens or
hundreds of people. In a learning environment or platform prototype, you might have a single
administrative account for everything you do. In production, you will want
more accounts with different levels of access to different namespaces.
-->
### 生產級使用者環境

在生產環境中，情況可能不再是你或者一小組人在訪問叢集，而是幾十
上百人需要訪問叢集。在學習環境或者平臺原型環境中，你可能具有一個
可以執行任何操作的管理賬號。在生產環境中，你可需要對不同名字空間
具有不同訪問許可權級別的很多賬號。

<!--
Taking on a production-quality cluster means deciding how you
want to selectively allow access by other users. In particular, you need to
select strategies for validating the identities of those who try to access your
cluster (authentication) and deciding if they have permissions to do what they
are asking (authorization):
-->
建立一個生產級別的叢集意味著你需要決定如何有選擇地允許其他使用者訪問叢集。
具體而言，你需要選擇驗證嘗試訪問叢集的人的身份標識（身份認證），並確定
他們是否被許可執行他們所請求的操作（鑑權）：

<!--
- *Authentication*: The apiserver can authenticate users using client
certificates, bearer tokens, an authenticating proxy, or HTTP basic auth.
You can choose which authentication methods you want to use.
Using plugins, the apiserver can leverage your organization’s existing
authentication methods, such as LDAP or Kerberos. See
[Authentication](/docs/reference/access-authn-authz/authentication/)
for a description of these different methods of authenticating Kubernetes users.
-->
- *認證（Authentication）*：API 伺服器可以使用客戶端證書、持有者令牌、身份
  認證代理或者 HTTP 基本認證機制來完成身份認證操作。
  你可以選擇你要使用的認證方法。透過使用外掛，API 伺服器可以充分利用你所在
  組織的現有身份認證方法，例如 LDAP 或者 Kerberos。
  關於認證 Kubernetes 使用者身份的不同方法的描述，可參閱
  [身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)。
<!--
- *Authorization*: When you set out to authorize your regular users, you will probably choose between RBAC and ABAC authorization. See [Authorization Overview](/docs/reference/access-authn-authz/authorization/) to review different modes for authorizing user accounts (as well as service account access to your cluster):
-->
- *鑑權（Authorization）*：當你準備為一般使用者執行許可權判定時，你可能會需要
  在 RBAC 和 ABAC 鑑權機制之間做出選擇。參閱
  [鑑權概述](/zh-cn/docs/reference/access-authn-authz/authorization/)，瞭解
  對使用者賬戶（以及訪問你的叢集的服務賬戶）執行鑑權的不同模式。
  <!--
  - *Role-based access control* ([RBAC](/docs/reference/access-authn-authz/rbac/)): Lets you assign access to your cluster by allowing specific sets of permissions to authenticated users. Permissions can be assigned for a specific namespace (Role) or across the entire cluster (ClusterRole). Then using RoleBindings and ClusterRoleBindings, those permissions can be attached to particular users.
  -->
  - *基於角色的訪問控制*（[RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)）：
    讓你透過為透過身份認證的使用者授權特定的許可集合來控制叢集訪問。
    訪問許可可以針對某特定名字空間（Role）或者針對整個叢集（ClusterRole）。
    透過使用 RoleBinding 和 ClusterRoleBinding 物件，這些訪問許可可以被
    關聯到特定的使用者身上。
  <!--
  - *Attribute-based access control* ([ABAC](/docs/reference/access-authn-authz/abac/)): Lets you create policies based on resource attributes in the cluster and will allow or deny access based on those attributes. Each line of a policy file identifies versioning properties (apiVersion and kind) and a map of spec properties to match the subject (user or group), resource property, non-resource property (/version or /apis), and readonly. See [Examples](/docs/reference/access-authn-authz/abac/#examples) for details.
  -->
  - *基於屬性的訪問控制*（[ABAC](/zh-cn/docs/reference/access-authn-authz/abac/)）：
    讓你能夠基於叢集中資源的屬性來建立訪問控制策略，基於對應的屬性來決定
    允許還是拒絕訪問。策略檔案的每一行都給出版本屬性（apiVersion 和 kind）
    以及一個規約屬性的對映，用來匹配主體（使用者或組）、資源屬性、非資源屬性
    （/version 或 /apis）和只讀屬性。
    參閱[示例](/zh-cn/docs/reference/access-authn-authz/abac/#examples)以瞭解細節。

<!--
As someone setting up authentication and authorization on your production Kubernetes cluster, here are some things to consider:
-->
作為在你的生產用 Kubernetes 叢集中安裝身份認證和鑑權機制的負責人，
要考慮的事情如下：

<!--
- *Set the authorization mode*: When the Kubernetes API server
([kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/))
starts, the supported authentication modes must be set using the *--authorization-mode*
flag. For example, that flag in the *kube-adminserver.yaml* file (in */etc/kubernetes/manifests*)
could be set to Node,RBAC. This would allow Node and RBAC authorization for authenticated requests.
-->
- *設定鑑權模式*：當 Kubernetes API 伺服器
  （[kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)）
  啟動時，所支援的鑑權模式必須使用 `--authorization-mode` 標誌配置。
  例如，`kube-apiserver.yaml`（位於 `/etc/kubernetes/manifests` 下）中對應的
  標誌可以設定為 `Node,RBAC`。這樣就會針對已完成身份認證的請求執行 Node 和 RBAC
  鑑權。
<!--
- *Create user certificates and role bindings (RBAC)*: If you are using RBAC
authorization, users can create a CertificateSigningRequest (CSR) that can be
signed by the cluster CA. Then you can bind Roles and ClusterRoles to each user.
See [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
for details.
-->
- *建立使用者證書和角色繫結（RBAC）*：如果你在使用 RBAC 鑑權，使用者可以建立
  由叢集 CA 簽名的 CertificateSigningRequest（CSR）。接下來你就可以將 Role
  和 ClusterRole 繫結到每個使用者身上。
  參閱[證書籤名請求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
  瞭解細節。
<!--
- *Create policies that combine attributes (ABAC)*: If you are using ABAC
authorization, you can assign combinations of attributes to form policies to
authorize selected users or groups to access particular resources (such as a
pod), namespace, or apiGroup. For more information, see
[Examples](/docs/reference/access-authn-authz/abac/#examples).
-->
- *建立組合屬性的策略（ABAC）*：如果你在使用 ABAC 鑑權，你可以設定屬性組合
  以構造策略對所選使用者或使用者組執行鑑權，判定他們是否可訪問特定的資源
  （例如 Pod）、名字空間或者 apiGroup。進一步的詳細資訊可參閱
  [示例](/zh-cn/docs/reference/access-authn-authz/abac/#examples)。
<!--
- *Consider Admission Controllers*: Additional forms of authorization for
requests that can come in through the API server include
[Webhook Token Authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication).
Webhooks and other special authorization types need to be enabled by adding
[Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
to the API server.
-->
- *考慮准入控制器*：針對指向 API 伺服器的請求的其他鑑權形式還包括
  [Webhook 令牌認證](/zh-cn/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)。
  Webhook 和其他特殊的鑑權型別需要透過向 API 伺服器新增
  [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
  來啟用。

<!--
## Set limits on workload resources

Demands from production workloads can cause pressure both inside and outside
of the Kubernetes control plane. Consider these items when setting up for the
needs of your cluster's workloads:
-->
## 為負載資源設定約束  {#set-limits-on-workload-resources}

生產環境負載的需求可能對 Kubernetes 的控制面內外造成壓力。
在針對你的叢集的負載執行配置時，要考慮以下條目：

<!--
- *Set namespace limits*: Set per-namespace quotas on things like memory and CPU. See
[Manage Memory, CPU, and API Resources](/docs/tasks/administer-cluster/manage-resources/)
for details. You can also set
[Hierarchical Namespaces](/blog/2020/08/14/introducing-hierarchical-namespaces/)
for inheriting limits.
-->
- *設定名字空間限制*：為每個名字空間的記憶體和 CPU 設定配額。
  參閱[管理記憶體、CPU 和 API 資源](/zh-cn/docs/tasks/administer-cluster/manage-resources/)
  以瞭解細節。你也可以設定
  [層次化名字空間](/blog/2020/08/14/introducing-hierarchical-namespaces/)
  來繼承這類約束。
<!--
- *Prepare for DNS demand*: If you expect workloads to massively scale up,
your DNS service must be ready to scale up as well. See
[Autoscale the DNS service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
-->
- *為 DNS 請求做準備*：如果你希望工作負載能夠完成大規模擴充套件，你的 DNS 服務
  也必須能夠擴大規模。參閱
  [自動擴縮叢集中 DNS 服務](/zh-cn/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)。
<!--
- *Create additional service accounts*: User accounts determine what users can
do on a cluster, while a service account defines pod access within a particular
namespace. By default, a pod takes on the default service account from its namespace.
See [Managing Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/)
for information on creating a new service account. For example, you might want to:
-->
- *建立額外的服務賬戶*：使用者賬戶決定使用者可以在叢集上執行的操作，服務賬號則定義的
  是在特定名字空間中 Pod 的訪問許可權。
  預設情況下，Pod 使用所在名字空間中的 default 服務賬號。
  參閱[管理服務賬號](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)
  以瞭解如何建立新的服務賬號。例如，你可能需要：
  <!--
  - Add secrets that a pod could use to pull images from a particular container registry. See [Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/) for an example.
  - Assign RBAC permissions to a service account. See [ServiceAccount permissions](/docs/reference/access-authn-authz/rbac/#service-account-permissions) for details.
  -->
  - 為 Pod 新增 Secret，以便 Pod 能夠從某特定的容器映象倉庫拉取映象。
    參閱[為 Pod 配置服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
    以獲得示例。
  - 為服務賬號設定 RBAC 訪問許可。參閱
    [服務賬號訪問許可](/zh-cn/docs/reference/access-authn-authz/rbac/#service-account-permissions)
    瞭解細節。

## {{% heading "whatsnext" %}}

<!--
- Decide if you want to build your own production Kubernetes or obtain one from
available [Turnkey Cloud Solutions](/docs/setup/production-environment/turnkey-solutions/)
or [Kubernetes Partners](https://kubernetes.io/partners/).
- If you choose to build your own cluster, plan how you want to
handle [certificates](/docs/setup/best-practices/certificates/)
and set up high availability for features such as
[etcd](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
and the
[API server](/docs/setup/production-environment/tools/kubeadm/ha-topology/).
-->
- 決定你是想自行構造自己的生產用 Kubernetes 還是從某可用的
  [雲服務外包廠商](/zh-cn/docs/setup/production-environment/turnkey-solutions/)
  或 [Kubernetes 合作伙伴](https://kubernetes.io/partners/)獲得叢集。
- 如果你決定自行構造叢集，則需要規劃如何處理
  [證書](/zh-cn/docs/setup/best-practices/certificates/)
  併為類似
  [etcd](/zh-cn/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
  和
  [API 伺服器](/zh-cn/docs/setup/production-environment/tools/kubeadm/ha-topology/)
  這些功能元件配置高可用能力。
<!--
- Choose from [kubeadm](/docs/setup/production-environment/tools/kubeadm/), [kops](/docs/setup/production-environment/tools/kops/) or [Kubespray](/docs/setup/production-environment/tools/kubespray/)
deployment methods.
-->
- 選擇使用 [kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/)、
  [kops](/zh-cn/docs/setup/production-environment/tools/kops/) 或
  [Kubespray](/zh-cn/docs/setup/production-environment/tools/kubespray/)
  作為部署方法。
<!--
- Configure user management by determining your
[Authentication](/docs/reference/access-authn-authz/authentication/) and
[Authorization](/docs/reference/access-authn-authz/authorization/) methods.
-->
- 透過決定[身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)和
  [鑑權](/zh-cn/docs/reference/access-authn-authz/authorization/)方法來配置使用者管理。
<!--
- Prepare for application workloads by setting up
[resource limits](/docs/tasks/administer-cluster/manage-resources/),
[DNS autoscaling](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
and [service accounts](/docs/reference/access-authn-authz/service-accounts-admin/).
-->
- 透過配置[資源限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/)、
  [DNS 自動擴縮](/zh-cn/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
  和[服務賬號](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)
  來為應用負載作準備。

