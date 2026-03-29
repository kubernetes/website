---
title: "正式環境"
description: 建立正式環境等級的 Kubernetes 叢集
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
建立正式環境等級的 Kubernetes 叢集需要事先規劃與準備。
若您的 Kubernetes 叢集需要執行關鍵工作負載，則必須經過適當設定，以具備彈性。
本頁說明如何建立正式環境等級的 Kubernetes 叢集，或將現有叢集調整為可用於正式環境。
若您已熟悉正式環境的設定並只需要相關連結，請直接跳至[接下來](#what-s-next)。

<!-- body -->

<!--
## Production considerations

Typically, a production Kubernetes cluster environment has more requirements than a
personal learning, development, or test environment Kubernetes. A production environment may require
secure access by many users, consistent availability, and the resources to adapt
to changing demands.
-->
## 正式環境考量 {#production-considerations}

通常，正式環境中的 Kubernetes 叢集，相較於個人學習、開發或測試環境，會有更多需求。
正式環境可能需要支援多位使用者安全存取、維持穩定的可用性，以及具備因應需求變化的資源。

<!--
As you decide where you want your production Kubernetes environment to live
(on premises or in a cloud) and the amount of management you want to take
on or hand to others, consider how your requirements for a Kubernetes cluster
are influenced by the following issues:
-->
在決定正式 Kubernetes 環境的部署位置（本地部署或雲端），以及您希望自行管理或交由他人管理的程度時，
請考慮以下因素如何影響您對 Kubernetes 叢集的需求：

<!--
- *Availability*: A single-machine Kubernetes [learning environment](/docs/setup/#learning-environment)
  has a single point of failure. Creating a highly available cluster means considering:
  - Separating the control plane from the worker nodes.
  - Replicating the control plane components on multiple nodes.
  - Load balancing traffic to the cluster's {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}}.
  - Having enough worker nodes available, or able to quickly become available, as changing workloads warrant it.
-->
- **可用性**：單一機器的 Kubernetes [學習環境](/zh-tw/docs/setup/#learning-environment)
  存在單點故障的問題。建立高可用叢集時需要考慮：
  - 將控制平面與工作節點分開部署。
  - 在多個節點上部署控制平面組件的副本
  - 對叢集的 {{< glossary_tooltip term_id="kube-apiserver" text="API 伺服器" >}} 流量進行負載平衡。
  - 確保有足夠的工作節點可用，或能在工作負載需求變化時快速擴充。

<!--
- *Scale*: If you expect your production Kubernetes environment to receive a stable amount of
  demand, you might be able to set up for the capacity you need and be done. However,
  if you expect demand to grow over time or change dramatically based on things like
  season or special events, you need to plan how to scale to relieve increased
  pressure from more requests to the control plane and worker nodes or scale down to reduce unused
  resources.
-->
- **規模**：若您預期正式 Kubernetes 環境的需求量維持穩定，或許可以一次性完成所需的容量規劃。
  但若您預期需求會隨時間成長，或因季節性或特殊活動等因素而大幅波動，
  則需要規劃如何進行擴展，以因應控制平面與工作節點因請求增加所帶來的壓力，或縮減規模以減少閒置資源。

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
- **安全性與存取管理**：在自己的 Kubernetes 學習叢集上，您擁有完整的管理員權限。
  但對於承載重要工作負載且有多位使用者的共用叢集，則需要更精細的機制來控管哪些使用者或程序可以存取叢集資源。
  您可以使用角色型存取控制（[RBAC](/zh-tw/docs/reference/access-authn-authz/rbac/)）及其他安全機制，
  確保使用者與工作負載能夠取得所需的資源，同時維持工作負載及叢集本身的安全性。
  您可以透過管理[政策](/zh-tw/docs/concepts/policy/)及
  [容器資源](/zh-tw/docs/concepts/configuration/manage-resources-containers/)，
  來限制使用者與工作負載可存取的資源。

<!--
Before building a Kubernetes production environment on your own, consider
handing off some or all of this job to
[Turnkey Cloud Solutions](/docs/setup/production-environment/turnkey-solutions/)
providers or other [Kubernetes Partners](/partners/).
Options include:
-->
在自行建立 Kubernetes 正式環境之前，請考慮將部分或全部工作交由[雲端整合解決方案](/zh-tw/docs/setup/production-environment/turnkey-solutions/)提供商
或其他 [Kubernetes 合作夥伴](/zh-tw/partners/)處理。可選的方案包括：

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
- **無伺服器**：直接在第三方提供的基礎設施上執行工作負載，無需管理叢集。
  費用依 CPU 使用量、記憶體及磁碟請求等計算。
- **受管理的控制平面**：由提供商負責管理叢集控制平面的規模與可用性，並處理修補程式和升級作業。
- **受管理的工作節點**：設定節點池以符合您的需求，提供商確保節點保持可用，
  並在需要時能夠執行升級。
- **整合**：部分提供商可將 Kubernetes 與其他所需服務整合，
  例如儲存、映像檔儲存庫、身分驗證機制和開發工具。

<!--
Whether you build a production Kubernetes cluster yourself or work with
partners, review the following sections to evaluate your needs as they relate
to your cluster's *control plane*, *worker nodes*, *user access*, and
*workload resources*.
-->
無論您是自行建立正式 Kubernetes 叢集，或與合作夥伴合作，
請參閱以下章節，以評估與叢集的**控制平面**、**工作節點**、**使用者存取**
及**工作負載資源**相關的需求。

<!--
## Production cluster setup

In a production-quality Kubernetes cluster, the control plane manages the
cluster from services that can be spread across multiple computers
in different ways. Each worker node, however, represents a single entity that
is configured to run Kubernetes pods.
-->
## 正式叢集設定 {#production-cluster-setup}

在正式環境等級的 Kubernetes 叢集中，控制平面透過可分散部署於多台電腦上的服務來管理叢集。
每個工作節點則代表一個設定為執行 Kubernetes Pod 的獨立實體。

<!--
### Production control plane

The simplest Kubernetes cluster has the entire control plane and worker node
services running on the same machine. You can grow that environment by adding
worker nodes, as reflected in the diagram illustrated in
[Kubernetes Components](/docs/concepts/overview/components/).
If the cluster is meant to be available for a short period of time, or can be
discarded if something goes seriously wrong, this might meet your needs.
-->
### 正式環境控制平面 {#production-control-plane}

最簡單的 Kubernetes 叢集是將完整的控制平面和工作節點服務都執行在同一台機器上。
您可以透過新增工作節點來擴展該環境，如
[Kubernetes 組件](/zh-tw/docs/concepts/overview/components/)中的示意圖所示。
若叢集僅需在短時間內可用，或在出現嚴重問題時可以直接捨棄，這樣的設定可能已足以滿足您的需求。

<!--
If you need a more permanent, highly available cluster, however, you should
consider ways of extending the control plane. By design, one-machine control
plane services running on a single machine are not highly available.
If keeping the cluster up and running
and ensuring that it can be repaired if something goes wrong is important,
consider these steps:
-->
但若您需要更持久、高可用的叢集，則應考慮擴展控制平面的方式。
根據設計，執行在單台機器上的控制平面服務並非高可用的。
若維持叢集持續運作、確保出問題時能夠修復對您而言很重要，請考慮以下步驟：

<!--
- *Choose deployment tools*: You can deploy a control plane using tools such
  as kubeadm, kops, and kubespray. See
  [Installing Kubernetes with deployment tools](/docs/setup/production-environment/tools/)
  to learn tips for production-quality deployments using each of those deployment
  methods. Different [Container Runtimes](/docs/setup/production-environment/container-runtimes/)
  are available to use with your deployments.
-->
- **選擇部署工具**：您可以使用 kubeadm、kops 和 kubespray 等工具來部署控制平面。
  請參閱[使用部署工具安裝 Kubernetes](/zh-tw/docs/setup/production-environment/tools/)，
  了解如何使用各種部署方法建立正式環境等級的叢集。
  您的部署也可以搭配不同的[容器執行階段](/zh-tw/docs/setup/production-environment/container-runtimes/)。

<!--
- *Manage certificates*: Secure communications between control plane services
  are implemented using certificates. Certificates are automatically generated
  during deployment or you can generate them using your own certificate authority.
  See [PKI certificates and requirements](/docs/setup/best-practices/certificates/) for details.
-->
- **管理憑證**：控制平面服務之間的安全通訊是透過憑證來實現的。
  憑證會在部署期間自動產生，或您也可以使用自己的憑證授權機構來產生。
  詳情請參閱 [PKI 憑證與需求](/zh-tw/docs/setup/best-practices/certificates/)。

<!--
- *Configure load balancer for apiserver*: Configure a load balancer
  to distribute external API requests to the apiserver service instances running on different nodes. See
  [Create an External Load Balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/)
  for details.
-->
- **為 API 伺服器設定負載平衡器**：設定負載平衡器，
  將外部 API 請求分散至執行於不同節點上的 apiserver 服務實例。
  詳情請參閱[建立外部負載平衡器](/zh-tw/docs/tasks/access-application-cluster/create-external-load-balancer/)。

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
- **分離並備份 etcd 服務**：etcd 服務可以與其他控制平面服務部署於相同的機器上，
  也可以部署於獨立的機器上，以提升安全性與可用性。
  由於 etcd 儲存叢集的設定資料，應定期備份 etcd 資料庫，以確保在需要時能夠進行修復。
  關於設定與使用 etcd 的詳情，請參閱 [etcd FAQ](https://etcd.io/docs/v3.5/faq/)。
  更多細節請參閱[為 Kubernetes 操作 etcd 叢集](/zh-tw/docs/tasks/administer-cluster/configure-upgrade-etcd/)
  及[使用 kubeadm 建立高可用 etcd 叢集](/zh-tw/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)。

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
- **建立多個控制平面系統**：為了實現高可用性，控制平面不應受限於單一機器。
  若控制平面服務由 init 服務（例如 systemd）執行，每個服務至少應在三台機器上執行。
  不過，將控制平面服務以 Pod 的方式在 Kubernetes 中執行，
  可以確保所需的服務副本數量始終可用。
  排程器應具備容錯能力，但不需要具備高可用性。
  某些部署工具會使用 [Raft](https://raft.github.io/) 共識演算法進行 Kubernetes 服務的領導者選舉。
  若主要服務失效，其他服務會自行選舉並接管。

<!--
- *Span multiple zones*: If keeping your cluster available at all times is
  critical, consider creating a cluster that runs across multiple data centers,
  referred to as zones in cloud environments. Groups of zones are referred to as regions.
  By spreading a cluster across
  multiple zones in the same region, it can improve the chances that your
  cluster will continue to function even if one zone becomes unavailable.
  See [Running in multiple zones](/docs/setup/best-practices/multiple-zones/) for details.
-->
- **跨多個可用區部署**：若確保叢集隨時可用至關重要，
  請考慮建立跨多個資料中心的叢集（在雲端環境中稱為可用區）。
  多個可用區的集合稱為區域。
  將叢集分散至同一區域的多個可用區，可以提高在某個可用區發生故障時叢集仍能持續運作的可能性。
  詳情請參閱[在多個可用區中執行](/zh-tw/docs/setup/best-practices/multiple-zones/)。

<!--
- *Manage on-going features*: If you plan to keep your cluster over time,
  there are tasks you need to do to maintain its health and security. For example,
  if you installed with kubeadm, there are instructions to help you with
  [Certificate Management](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
  and [Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
  See [Administer a Cluster](/docs/tasks/administer-cluster/)
  for a longer list of Kubernetes administrative tasks.
-->
- **持續維護叢集**：若您計劃長期維護叢集，需要執行一些工作來維持其健康與安全。
  例如，若您使用 kubeadm 安裝，有相關指示可協助您完成
  [憑證管理](/zh-tw/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
  及[升級 kubeadm 叢集](/zh-tw/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。
  如需更完整的 Kubernetes 管理任務清單，請參閱[管理叢集](/zh-tw/docs/tasks/administer-cluster/)。

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
如需了解執行控制平面服務時的可用選項，請參閱
[kube-apiserver](/zh-tw/docs/reference/command-line-tools-reference/kube-apiserver/)、
[kube-controller-manager](/zh-tw/docs/reference/command-line-tools-reference/kube-controller-manager/)
及 [kube-scheduler](/zh-tw/docs/reference/command-line-tools-reference/kube-scheduler/) 組件參考頁面。
如需高可用控制平面的範例，請參閱
[高可用拓撲選項](/zh-tw/docs/setup/production-environment/tools/kubeadm/ha-topology/)、
[使用 kubeadm 建立高可用叢集](/zh-tw/docs/setup/production-environment/tools/kubeadm/high-availability/)
及[為 Kubernetes 操作 etcd 叢集](/zh-tw/docs/tasks/administer-cluster/configure-upgrade-etcd/)。
關於 etcd 備份計畫，請參閱
[備份 etcd 叢集](/zh-tw/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)。

<!--
### Production worker nodes

Production-quality workloads need to be resilient and anything they rely
on needs to be resilient (such as CoreDNS). Whether you manage your own
control plane or have a cloud provider do it for you, you still need to
consider how you want to manage your worker nodes (also referred to
simply as *nodes*).
-->
### 正式工作節點 {#production-worker-nodes}

正式環境等級的工作負載需要具備彈性，其所依賴的組件（例如 CoreDNS）也需要具備彈性。
無論您是自行管理控制平面，或由雲端提供者代為管理，
都需要考慮如何管理工作節點（有時也簡稱為**節點**）。

<!--
- *Configure nodes*: Nodes can be physical or virtual machines. If you want to
  create and manage your own nodes, you can install a supported operating system,
  then add and run the appropriate
  [Node services](/docs/concepts/architecture/#node-components). Consider:
  - The demands of your workloads when you set up nodes by having appropriate memory, CPU, and disk speed and storage capacity available.
  - Whether generic computer systems will do or you have workloads that need GPU processors, Windows nodes, or VM isolation.
-->
- **設定節點**：節點可以是實體機或虛擬機。若您想自行建立並管理節點，
  可以安裝受支援的作業系統，然後部署並執行適當的[節點服務](/zh-tw/docs/concepts/architecture/#node-components)。請考慮：
  - 在設定節點時，提供符合工作負載需求的記憶體、CPU 及磁碟速度與儲存容量。
  - 通用電腦系統是否足夠，或您的工作負載是否需要 GPU 處理器、Windows 節點或 VM 隔離。

<!--
- *Validate nodes*: See [Valid node setup](/docs/setup/best-practices/node-conformance/)
  for information on how to ensure that a node meets the requirements to join
  a Kubernetes cluster.
-->
- **驗證節點**：請參閱[有效的節點設定](/zh-tw/docs/setup/best-practices/node-conformance/)，
  了解如何確保節點符合加入 Kubernetes 叢集的需求。

<!--
- *Add nodes to the cluster*: If you are managing your own cluster you can
  add nodes by setting up your own machines and either adding them manually or
  having them register themselves to the cluster's apiserver. See the
  [Nodes](/docs/concepts/architecture/nodes/) section for information on how to set up Kubernetes to add nodes in these ways.
-->
- **將節點加入叢集**：若您自行管理叢集，可以透過設定機器並手動加入，
  或讓機器自動向叢集的 apiserver 註冊來新增節點。
  請參閱[節點](/zh-tw/docs/concepts/architecture/nodes/)章節，
  了解如何設定 Kubernetes 以這些方式新增節點。

<!--
- *Scale nodes*: Have a plan for expanding the capacity your cluster will
  eventually need. See [Considerations for large clusters](/docs/setup/best-practices/cluster-large/)
  to help determine how many nodes you need, based on the number of pods and
  containers you need to run. If you are managing nodes yourself, this can mean
  purchasing and installing your own physical equipment.
-->
- **擴縮節點**：制定擴充叢集容量的計畫，因為叢集最終會需要這項能力。
  請參閱[大規模叢集的注意事項](/zh-tw/docs/setup/best-practices/cluster-large/)，
  依據需要執行的 Pod 與容器數量來確定所需的節點數量。
  若您自行管理節點，這可能意味著需要購買並部署自己的實體設備。

<!--
- *Autoscale nodes*: Read [Node Autoscaling](/docs/concepts/cluster-administration/node-autoscaling) to learn about the
  tools available to automatically manage your nodes and the capacity they
  provide.
-->
- **自動擴縮節點**：請閱讀[節點自動擴縮](/zh-tw/docs/concepts/cluster-administration/node-autoscaling)，
  了解可自動管理節點及其提供之容量的工具。

<!--
- *Set up node health checks*: For important workloads, you want to make sure
  that the nodes and pods running on those nodes are healthy. Using the
  [Node Problem Detector](/docs/tasks/debug/debug-cluster/monitor-node-health/)
  daemon, you can ensure your nodes are healthy.
-->
- **設定節點健康狀態檢查**：對於重要的工作負載，您需要確保節點以及在其上執行的 Pod 都處於健康狀態。
  透過使用 [Node Problem Detector](/zh-tw/docs/tasks/debug/debug-cluster/monitor-node-health/) 常駐程式，
  您可以確保節點維持健康。

<!--
## Production user management

In production, you may be moving from a model where you or a small group of
people are accessing the cluster to where there may potentially be dozens or
hundreds of people. In a learning environment or platform prototype, you might have a single
administrative account for everything you do. In production, you will want
more accounts with different levels of access to different namespaces.
-->
## 正式環境使用者管理 {#production-user-management}

在正式環境中，您的使用情境可能會從僅有您或一小組人員存取叢集，
演變為可能有數十甚至數百人需要存取叢集。
在學習環境或平台原型中，您可能僅使用一個管理帳號處理所有操作。
在正式環境中，則通常需要建立多個帳號，並針對不同命名空間設定不同層級的存取權限。

<!--
Taking on a production-quality cluster means deciding how you
want to selectively allow access by other users. In particular, you need to
select strategies for validating the identities of those who try to access your
cluster (authentication) and deciding if they have permissions to do what they
are asking (authorization):
-->
建立正式環境等級的叢集意味著需要決定如何控管其他使用者的存取權限。
具體而言，您需要選擇驗證嘗試存取叢集之使用者身分（身分驗證），
以及判斷其是否具有執行所請求操作之權限（授權）的策略：

<!--
- *Authentication*: The apiserver can authenticate users using client
  certificates, bearer tokens, an authenticating proxy, or HTTP basic auth.
  You can choose which authentication methods you want to use.
  Using plugins, the apiserver can leverage your organization's existing
  authentication methods, such as LDAP or Kerberos. See
  [Authentication](/docs/reference/access-authn-authz/authentication/)
  for a description of these different methods of authenticating Kubernetes users.
-->
- **身分驗證（Authentication）**：apiserver 可以使用用戶端憑證、Bearer Token、
  身分驗證代理或 HTTP 基本驗證來對使用者進行身分驗證。
  您可以選擇要使用的身分驗證方法。
  透過外掛程式，apiserver 可以使用您組織現有的身分驗證機制，例如 LDAP 或 Kerberos。
  關於驗證 Kubernetes 使用者身分的各種方法，
  請參閱[身分驗證](/zh-tw/docs/reference/access-authn-authz/authentication/)。

<!--
- *Authorization*: When you set out to authorize your regular users, you will probably choose
  between RBAC and ABAC authorization. See [Authorization Overview](/docs/reference/access-authn-authz/authorization/)
  to review different modes for authorizing user accounts (as well as service account access to
  your cluster):
-->
- **授權（Authorization）**：為一般使用者設定授權時，您可能需要在 RBAC 與 ABAC 之間做選擇。
  請參閱[授權概述](/zh-tw/docs/reference/access-authn-authz/authorization/)，
  了解授權使用者帳號（以及服務帳號存取叢集）的不同模式：

  <!--
  - *Role-based access control* ([RBAC](/docs/reference/access-authn-authz/rbac/)): Lets you
    assign access to your cluster by allowing specific sets of permissions to authenticated users.
    Permissions can be assigned for a specific namespace (Role) or across the entire cluster
    (ClusterRole). Then using RoleBindings and ClusterRoleBindings, those permissions can be attached
    to particular users.
  -->
  - **角色型存取控制**（[RBAC](/zh-tw/docs/reference/access-authn-authz/rbac/)）：
    透過向已通過身分驗證的使用者授予特定的權限集合，以控制叢集的存取。
    權限可以針對特定命名空間（Role）或整個叢集（ClusterRole）進行設定。
    接著使用 RoleBinding 與 ClusterRoleBinding，可以將這些權限繫結至特定使用者。

  <!--
  - *Attribute-based access control* ([ABAC](/docs/reference/access-authn-authz/abac/)): Lets you
    create policies based on resource attributes in the cluster and will allow or deny access
    based on those attributes. Each line of a policy file identifies versioning properties (apiVersion
    and kind) and a map of spec properties to match the subject (user or group), resource property,
    non-resource property (/version or /apis), and readonly. See
    [Examples](/docs/reference/access-authn-authz/abac/#examples) for details.
  -->
  - **基於屬性的存取控制**（[ABAC](/zh-tw/docs/reference/access-authn-authz/abac/)）：
    讓您能根據叢集中資源的屬性建立政策，並依據這些屬性決定允許或拒絕存取。
    政策檔案的每一行都包含版本屬性（apiVersion 與 kind）以及 spec 屬性的對應，
    用於比對主體（使用者或群組）、資源屬性、非資源屬性（/version 或 /apis）及唯讀屬性。
    詳情請參閱[範例](/zh-tw/docs/reference/access-authn-authz/abac/#examples)。

<!--
As someone setting up authentication and authorization on your production Kubernetes cluster, here are some things to consider:
-->
作為在正式環境 Kubernetes 叢集上設定身分驗證與授權的負責人，以下是一些需要考慮的事項：

<!--
- *Set the authorization mode*: When the Kubernetes API server
  ([kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/))
  starts, supported authorization modes must be set using an *--authorization-config* file or the *--authorization-mode*
  flag. For example, that flag in the *kube-adminserver.yaml* file (in */etc/kubernetes/manifests*)
  could be set to Node,RBAC. This would allow Node and RBAC authorization for authenticated requests.
-->
- **設定授權模式**：當 Kubernetes API 伺服器
  （[kube-apiserver](/zh-tw/docs/reference/command-line-tools-reference/kube-apiserver/)）啟動時，
  必須透過 *--authorization-config* 檔案或 *--authorization-mode* 旗標來設定受支援的授權模式。
  例如，在 *kube-adminserver.yaml* 檔案（位於 */etc/kubernetes/manifests*）中，
  可將該旗標設定為 `Node,RBAC`，以對已通過身分驗證的請求啟用 Node 與 RBAC 授權。

<!--
- *Create user certificates and role bindings (RBAC)*: If you are using RBAC
  authorization, users can create a CertificateSigningRequest (CSR) that can be
  signed by the cluster CA. Then you can bind Roles and ClusterRoles to each user.
  See [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
  for details.
-->
- **建立使用者憑證與角色繫結（RBAC）**：若您使用 RBAC 授權，
  使用者可以建立 CertificateSigningRequest（CSR），由叢集 CA 進行簽署。
  接著可以將 Role 與 ClusterRole 繫結至各個使用者。
  詳情請參閱[憑證簽署請求](/zh-tw/docs/reference/access-authn-authz/certificate-signing-requests/)。

<!--
- *Create policies that combine attributes (ABAC)*: If you are using ABAC
  authorization, you can assign combinations of attributes to form policies to
  authorize selected users or groups to access particular resources (such as a
  pod), namespace, or apiGroup. For more information, see
  [Examples](/docs/reference/access-authn-authz/abac/#examples).
-->
- **建立結合屬性的政策（ABAC）**：若您使用 ABAC 授權，
  可以指定屬性組合來形成政策，授權特定使用者或群組存取特定資源（例如 Pod）、
  命名空間或 apiGroup。詳情請參閱[範例](/zh-tw/docs/reference/access-authn-authz/abac/#examples)。

<!--
- *Consider Admission Controllers*: Additional forms of authorization for
  requests that can come in through the API server include
  [Webhook Token Authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication).
  Webhooks and other special authorization types need to be enabled by adding
  [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
  to the API server.
-->
- **考慮准入控制器**：針對透過 API 伺服器傳入的請求，還有其他形式的授權機制，
  例如 [Webhook 令牌身分驗證](/zh-tw/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)。
  Webhook 與其他特殊授權類型需要透過在 API 伺服器中啟用
  [准入控制器](/zh-tw/docs/reference/access-authn-authz/admission-controllers/)來支援。

<!--
## Set limits on workload resources

Demands from production workloads can cause pressure both inside and outside
of the Kubernetes control plane. Consider these items when setting up for the
needs of your cluster's workloads:
-->
## 設定工作負載資源限制 {#set-limits-on-workload-resources}

正式環境中的工作負載可能會對 Kubernetes 控制平面內外造成壓力。
在為叢集的工作負載進行設定時，請考慮以下項目：

<!--
- *Set namespace limits*: Set per-namespace quotas on things like memory and CPU. See
  [Manage Memory, CPU, and API Resources](/docs/tasks/administer-cluster/manage-resources/)
  for details.
-->
- **設定命名空間限制**：為每個命名空間設定記憶體與 CPU 等資源的配額。
  詳情請參閱[管理記憶體、CPU 與 API 資源](/zh-tw/docs/tasks/administer-cluster/manage-resources/)。

<!--
- *Prepare for DNS demand*: If you expect workloads to massively scale up,
  your DNS service must be ready to scale up as well. See
  [Autoscale the DNS service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
-->
- **為 DNS 需求做準備**：若您預期工作負載會大規模擴展，
  DNS 服務也必須準備好相應地擴展。
  請參閱[自動擴縮叢集中的 DNS 服務](/zh-tw/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)。

<!--
- *Create additional service accounts*: User accounts determine what users can
  do on a cluster, while a service account defines pod access within a particular
  namespace. By default, a pod takes on the default service account from its namespace.
  See [Managing Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/)
  for information on creating a new service account. For example, you might want to:
  - Add secrets that a pod could use to pull images from a particular container registry. See
    [Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/)
    for an example.
  - Assign RBAC permissions to a service account. See
    [ServiceAccount permissions](/docs/reference/access-authn-authz/rbac/#service-account-permissions)
    for details.
-->
- **建立額外的服務帳號**：使用者帳號決定使用者在叢集上可以執行的操作，
  而服務帳號則定義特定命名空間中 Pod 的存取權限。
  預設情況下，Pod 會使用其命名空間中的預設服務帳號。
  關於建立新服務帳號的資訊，請參閱[管理服務帳號](/zh-tw/docs/reference/access-authn-authz/service-accounts-admin/)。
  例如，您可能需要：
  - 為 Pod 新增 Secret，使其能從特定映像檔儲存庫拉取映像檔。
    範例請參閱[為 Pod 設定服務帳號](/zh-tw/docs/tasks/configure-pod-container/configure-service-account/)。
  - 為服務帳號指派 RBAC 權限。
    詳情請參閱[服務帳號權限](/zh-tw/docs/reference/access-authn-authz/rbac/#service-account-permissions)。

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
- Choose from [kubeadm](/docs/setup/production-environment/tools/kubeadm/),
  [kops](https://kops.sigs.k8s.io/) or
  [Kubespray](https://kubespray.io/) deployment methods.
- Configure user management by determining your
  [Authentication](/docs/reference/access-authn-authz/authentication/) and
  [Authorization](/docs/reference/access-authn-authz/authorization/) methods.
- Prepare for application workloads by setting up
  [resource limits](/docs/tasks/administer-cluster/manage-resources/),
  [DNS autoscaling](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
  and [service accounts](/docs/reference/access-authn-authz/service-accounts-admin/).
-->
- 決定是否要自行建立正式 Kubernetes 叢集，
  或從可用的[雲端整合解決方案](/zh-tw/docs/setup/production-environment/turnkey-solutions/)
  或 [Kubernetes 合作夥伴](/zh-tw/partners/)取得叢集。
- 若您選擇自行建立叢集，請規劃如何處理[憑證](/zh-tw/docs/setup/best-practices/certificates/)，
  並為 [etcd](/zh-tw/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
  與 [API 伺服器](/zh-tw/docs/setup/production-environment/tools/kubeadm/ha-topology/)等組件設定高可用性。
- 從 [kubeadm](/zh-tw/docs/setup/production-environment/tools/kubeadm/)、
  [kops](https://kops.sigs.k8s.io/) 或
  [Kubespray](https://kubespray.io/) 等部署方法中選擇。
- 透過確定[身分驗證](/zh-tw/docs/reference/access-authn-authz/authentication/)與
  [授權](/zh-tw/docs/reference/access-authn-authz/authorization/)方法來設定使用者管理。
- 透過設定[資源限制](/zh-tw/docs/tasks/administer-cluster/manage-resources/)、
  [DNS 自動擴縮](/zh-tw/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
  與[服務帳號](/zh-tw/docs/reference/access-authn-authz/service-accounts-admin/)來為應用工作負載做準備。
