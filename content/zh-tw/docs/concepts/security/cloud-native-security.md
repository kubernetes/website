---
title: "雲原生安全和 Kubernetes"
linkTitle: "雲原生安全"
weight: 10

# The section index lists this explicitly
hide_summary: true

description: >
  使你的雲原生工作負載保持安全的一些概念。
---
<!--
---
title: "Cloud Native Security and Kubernetes"
linkTitle: "Cloud Native Security"
weight: 10

# The section index lists this explicitly
hide_summary: true

description: >
  Concepts for keeping your cloud-native workload secure.
---
-->
<!-- 
Kubernetes is based on a cloud-native architecture, and draws on advice from the
{{< glossary_tooltip text="CNCF" term_id="cncf" >}} about good practice for
cloud native information security. 
-->
Kubernetes 基於雲原生架構，並借鑑了
{{< glossary_tooltip text="CNCF" term_id="cncf" >}}
有關雲原生信息安全良好實踐的建議。

<!--
Read on through this page for an overview of how Kubernetes is designed to
help you deploy a secure cloud native platform.
-->
繼續閱讀本頁，瞭解 Kubernetes 如何設計以幫助你部署安全的雲原生平臺。

<!--
## Cloud native information security
-->
## 雲原生信息安全

{{< comment >}}
<!--
There are localized versions available of this whitepaper; if you can link to one of those
when localizing, that's even better.
-->
該白皮書有可用的本地化版本；
如果在本地化時能鏈接到其中一個版本，那就更好了。
{{< /comment >}}

<!--
The CNCF [white paper](https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)
on cloud native security defines security controls and practices that are
appropriate to different _lifecycle phases_.
-->
CNCF 關於雲原生安全的[白皮書](https://github.com/cncf/tag-security/blob/main/security-whitepaper/v1/cloud-native-security-whitepaper-simplified-chinese.md)
介紹了適用於不同**生命週期階段**的安全控制和實踐。

<!--
## _Develop_ lifecycle phase {#lifecycle-phase-develop}
-->
## **開發**階段 {#lifecycle-phase-develop}

<!--
- Ensure the integrity of development environments.
- Design applications following good practice for information security,
  appropriate for your context.
- Consider end user security as part of solution design.
-->
- 確保開發環境的完整性。
- 在設計應用時，遵循信息安全的良好實踐，
   並根據實際情況進行調整。
- 將最終使用者的安全作爲解決方案設計的一部分。

<!--
To achieve this, you can:
-->
要達到這些目的，你可以：

<!--
1. Adopt an architecture, such as [zero trust](https://glossary.cncf.io/zero-trust-architecture/),
   that minimizes attack surfaces, even for internal threats.
1. Define a code review process that considers security concerns.
1. Build a _threat model_ of your system or application that identifies
   trust boundaries. Use that to model to identify risks and to help find
   ways to treat those risks.
1. Incorporate advanced security automation, such as _fuzzing_ and
   [security chaos engineering](https://glossary.cncf.io/security-chaos-engineering/),
   where it's justified.
-->
1. 採用諸如[零信任](https://glossary.cncf.io/zh-cn/zero-trust-architecture/)類似的架構，
   儘可能縮小攻擊面，對內部威脅也有效。
2. 建立考慮安全問題的代碼審查流程。
3. 構建系統或應用程序的**威脅模型**，確定信任邊界。
   利用該模型識別風險，並幫助找到處理這些風險的方法。
4. 合理的採用高級的安全自動化機制，例如**模糊測試**和[**安全混沌工程**](https://glossary.cncf.io/zh-cn/security-chaos-engineering/)。

<!--
## _Distribute_ lifecycle phase {#lifecycle-phase-distribute}
-->
## **分發**階段 {#lifecycle-phase-distribute}

<!--
- Ensure the security of the supply chain for container images you execute.
- Ensure the security of the supply chain for the cluster and other components
  that execute your application. An example of another component might be an
  external database that your cloud-native application uses for persistence.
-->
- 針對你所運行的容器映像檔，確保供應鏈安全。
- 針對運行應用程序的叢集或其他組件，保證其供應鏈安全。
   例如：其他組件可能是你的雲原生應用用於數據持久化的外部數據庫。

<!--
To achieve this, you can:
-->
要達到這些目的，你可以：

<!--
1. Scan container images and other artifacts for known vulnerabilities.
1. Ensure that software distribution uses encryption in transit, with
   a chain of trust for the software source.
1. Adopt and follow processes to update dependencies when updates are
   available, especially in response to security announcements.
1. Use validation mechanisms such as digital certificates for supply
   chain assurance.
1. Subscribe to feeds and other mechanisms to alert you to security
   risks.
1. Restrict access to artifacts. Place container images in a
   [private registry](/docs/concepts/containers/images/#using-a-private-registry)
   that only allows authorized clients to pull images.
-->
1. 掃描容器映像檔和其他製品以查找已知漏洞。
2. 確保軟件分發時採用傳輸加密技術，並建立軟件源的信任鏈。
3. 在有更新，尤其是安全公告時，採用並遵循更新依賴項的流程。
4. 使用數字證書等驗證機制來保證供應鏈可信。
5. 訂閱信息反饋和其他機制，以提醒你安全風險。
6. 嚴格限制製品訪問權限。將容器映像檔存儲在[私有倉庫](/zh-cn/docs/concepts/containers/images/#using-a-private-registry)，
   僅允許已授權客戶端拉取映像檔。

<!--
## _Deploy_ lifecycle phase {#lifecycle-phase-deploy}
-->
## **部署**階段 {#lifecycle-phase-deploy}

<!--
Ensure appropriate restrictions on what can be deployed, who can deploy it,
and where it can be deployed to.
You can enforce measures from the _distribute_ phase, such as verifying the
cryptographic identity of container image artifacts.
-->
確保對要部署的內容、可部署的人員和可部署的位置進行適當限制。
你可以採取分發階段的舉措，例如驗證容器映像檔製品的加密身份。

<!--
You can deploy different applications and cluster components into different
{{< glossary_tooltip text="namespaces" term_id="namespace" >}}. Containers
themselves, and namespaces, both provide isolation mechanisms that are
relevant to information security.
-->
你可以部署不同的應用程序和叢集組件到不同的{{< glossary_tooltip text="命名空間" term_id="namespace" >}}中。
容器本身和命名空間都提供了信息安全相關的隔離機制。

<!--
When you deploy Kubernetes, you also set the foundation for your
applications' runtime environment: a Kubernetes cluster (or
multiple clusters).
That IT infrastructure must provide the security guarantees that higher
layers expect.
-->
當你部署 Kubernetes 時，也是在爲應用程序的運行環境奠定基礎：一個或多個 Kubernetes 叢集。
該 IT 基礎設施必須提供上層所期望的安全保障。

<!--
## _Runtime_ lifecycle phase {#lifecycle-phase-runtime}
-->
## **運行**階段 {#lifecycle-phase-runtime}

<!--
The Runtime phase comprises three critical areas: [access](#protection-runtime-access),
[compute](#protection-runtime-compute), and [storage](#protection-runtime-storage).
-->
運行階段包含三個關鍵領域：[訪問](#protection-runtime-access)、
[計算](#protection-runtime-compute)和[存儲](#protection-runtime-storage)。

<!--
### Runtime protection: access {#protection-runtime-access}
-->
### 運行階段的防護：訪問 {#protection-runtime-access}

<!--
The Kubernetes API is what makes your cluster work. Protecting this API is key
to providing effective cluster security.
-->
Kubernetes API 是叢集運行的基礎。保護 API 是提供可靠的叢集安全性的關鍵。

<!--
Other pages in the Kubernetes documentation have more detail about how to set up
specific aspects of access control. The [security checklist](/docs/concepts/security/security-checklist/)
has a set of suggested basic checks for your cluster.
-->
Kubernetes 文檔中的其他頁面更詳細地介紹瞭如何設置訪問控制的具體細節。
[安全檢查清單](/zh-cn/docs/concepts/security/security-checklist/)爲你的叢集提供了一套建議的基本檢查。

<!--
Beyond that, securing your cluster means implementing effective
[authentication](/docs/concepts/security/controlling-access/#authentication) and
[authorization](/docs/concepts/security/controlling-access/#authorization) for API access. Use [ServiceAccounts](/docs/concepts/security/service-accounts/) to
provide and manage security identities for workloads and cluster
components.
-->
除此之外，加固叢集還意味着對訪問 API 實施有效的[身份認證](/zh-cn/docs/concepts/security/controlling-access/#authentication)和
[鑑權](/zh-cn/docs/concepts/security/controlling-access/#authorization)。
使用 [ServiceAccount](/zh-cn/docs/concepts/security/service-accounts/) 
爲工作負載和叢集組件提供和管理安全身份。

<!--
Kubernetes uses TLS to protect API traffic; make sure to deploy the cluster using
TLS (including for traffic between nodes and the control plane), and protect the
encryption keys. If you use Kubernetes' own API for
[CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests),
pay special attention to restricting misuse there.
-->
Kubernetes 使用 TLS 保護 API 流量；確保在部署叢集時採用了 TLS（包含工作節點和控制平面間的流量） 加密方式，
並保護好加密密鑰。如果使用 Kubernetes 自帶的
[證書籤名請求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests) API，
特別注意不要濫用它們。

<!--
### Runtime protection: compute {#protection-runtime-compute}
-->
### 運行階段的防護：計算 {#protection-runtime-compute}

<!--
{{< glossary_tooltip text="Containers" term_id="container" >}} provide two
things: isolation between different applications, and a mechanism to combine
those isolated applications to run on the same host computer. Those two
aspects, isolation and aggregation, mean that runtime security involves
identifying trade-offs and finding an appropriate balance.
-->
{{< glossary_tooltip text="容器" term_id="container" >}} 提供了兩種功能：
不同應用程序間的隔離，以及將這些隔離的應用程序合併運行到同一臺主機的機制。
隔離和聚合這兩個方面意味着運行時安全需要權衡利弊，並找到合適的平衡點。

<!--
Kubernetes relies on a {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
to actually set up and run containers. The Kubernetes project does
not recommend a specific container runtime and you should make sure that
the runtime(s) that you choose meet your information security needs.
-->
Kubernetes 依賴{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}
來設置和運行容器。 Kubernetes 項目不會推薦特定的容器運行時，你應當確保
你選用的運行時符合你的信息安全需要。
<!--
To protect your compute at runtime, you can:
-->
要在運行時保護計算資源，你可以：

<!--
1. Enforce [Pod security standards](/docs/concepts/security/pod-security-standards/)
   for applications, to help ensure they run with only the necessary privileges.
1. Run a specialized operating system on your nodes that is designed specifically
   for running containerized workloads. This is typically based on a read-only
   operating system (_immutable image_) that provides only the services
   essential for running containers.

   Container-specific operating systems help to isolate system components and
   present a reduced attack surface in case of a container escape.
-->
1. 爲應用程序強制採用 [Pod 安全性標準](/zh-cn/docs/concepts/security/pod-security-standards/)，
   確保它們僅以所需權限運行。
2. 在你的節點上運行專門爲運行容器化工作負載的而設計的專用操作系統。
   它通常基於只讀操作系統（**不可變映像檔**），只提供運行容器所必須的服務。

   容器化專用操作系統有助於隔離系統組件，並在容器逃逸時減少攻擊面。
<!--
1. Define [ResourceQuotas](/docs/concepts/policy/resource-quotas/) to
   fairly allocate shared resources, and use
   mechanisms such as [LimitRanges](/docs/concepts/policy/limit-range/)
   to ensure that Pods specify their resource requirements.
1. Partition workloads across different nodes.
   Use [node isolation](/docs/concepts/scheduling-eviction/assign-pod-node/#node-isolation-restriction)
   mechanisms, either from Kubernetes itself or from the ecosystem, to ensure that
   Pods with different trust contexts are run on separate sets of nodes.
1. Use a {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
   that provides security restrictions.
1. On Linux nodes, use a Linux security module such as [AppArmor](/docs/tutorials/security/apparmor/)
   or [seccomp](/docs/tutorials/security/seccomp/).
-->
3. 定義 [ResourceQuota](/zh-cn/docs/concepts/policy/resource-quotas/)
   以公平分配共享資源，並使用
   [LimitRange](/zh-cn/docs/concepts/policy/limit-range/) 等機制
   確保 Pod 定義了資源需求。
4. 劃分工作負載到不同節點上。
   使用來自 Kubernetes 本身或生態系統的
   [節點隔離](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-isolation-restriction)機制，
   以確保具有不同信任上下文的 Pod 在不同的節點上運行。
5. 使用提供安全限制的
   {{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}。
6. 在 Linux 節點上，使用 Linux 安全模式，例如 [AppArmor](/zh-cn/docs/tutorials/security/apparmor/)
  或者 [seccomp](zh-cn/docs/tutorials/security/seccomp/)。

<!--
### Runtime protection: storage {#protection-runtime-storage}
-->
### 運行階段的防護：存儲 {#protection-runtime-storage}

<!--
To protect storage for your cluster and the applications that run there, you can: 
-->
要保護你的叢集和應用運行使用的存儲，你可以：

<!--
1. Integrate your cluster with an external storage plugin that provides encryption at
   rest for volumes.
1. Enable [encryption at rest](/docs/tasks/administer-cluster/encrypt-data/) for
   API objects.
1. Protect data durability using backups. Verify that you can restore these, whenever you need to.
1. Authenticate connections between cluster nodes and any network storage they rely
   upon.
1. Implement data encryption within your own application.
-->
1. 爲你的叢集集成提供靜態加密的外部存儲插件。
2. 爲 API 對象啓用[靜態加密](/zh-cn/docs/tasks/administer-cluster/encrypt-data/)。
3. 使用備份保證數據的持久性。在需要的時候，驗證備份數據的可恢復性。
4. 叢集節點和它們所依賴的任何網路存儲都需要認證才能連接。
5. 在你的應用程序中實現數據加密。

<!--
For encryption keys, generating these within specialized hardware provides
the best protection against disclosure risks. A _hardware security module_
can let you perform cryptographic operations without allowing the security
key to be copied elsewhere.
-->
對於加密密鑰來說，在專用硬件中生成這些密鑰是防範泄密風險的最佳防護。
**硬件安全模塊**可以讓你在不允許將安全密鑰拷貝到其他地方的情況下執行加密操作。

<!--
### Networking and security
-->
### 網路和安全 {#networking-and-security}

<!--
You should also consider network security measures, such as
[NetworkPolicy](/docs/concepts/services-networking/network-policies/) or a
[service mesh](https://glossary.cncf.io/service-mesh/).
Some network plugins for Kubernetes provide encryption for your
cluster network, using technologies such as a virtual
private network (VPN) overlay.
By design, Kubernetes lets you use your own networking plugin for your
cluster (if you use managed Kubernetes, the person or organization
managing your cluster may have chosen a network plugin for you).
-->
你也應當考慮網路安全措施，
例如 [NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies/)
或者[服務網格](https://glossary.cncf.io/zh-cn/service-mesh/)。
一些 Kubernetes 的網路插件使用虛擬專用網路（VPN）疊加等技術，
可以爲叢集網路提供加密功能。
從設計上，Kubernetes 允許你在你的叢集中使用自有網路插件（如果你使用託管 Kubernetes，
叢集管理員或組織可能會爲你選擇一個網路插件）。

<!--
The network plugin you choose and the way you integrate it can have a
strong impact on the security of information in transit.
-->
你選用的網路插件和集成方式會對傳輸中的信息安全產生重大影響。

<!--
### Observability and runtime security
-->
### 可觀測性和運行時安全 {#Observability-and-runtime-security}

<!--
Kubernetes lets you extend your cluster with extra tooling. You can set up third
party solutions to help you monitor or troubleshoot your applications and the
clusters they are running. You also get some basic observability features built
in to Kubernetes itself. Your code running in containers can generate logs,
publish metrics or provide other observability data; at deploy time, you need to
make sure your cluster provides an appropriate level of protection there.
-->
Kubernetes 允許你使用外部工具擴展叢集。
你可以選擇第三方解決方案幫助你監控或排查應用程序或運行叢集的故障。
Kubernetes 自身還內置了一些基本的可觀測性功能。
運行在容器中的代碼可以生成日誌，暴露指標或提供其他的可觀測數據；
在部署時，你需要確保你的叢集提供適當級別的安全保護。

<!--
If you set up a metrics dashboard or something similar, review the chain of components
that populate data into that dashboard, as well as the dashboard itself. Make sure
that the whole chain is designed with enough resilience and enough integrity protection
that you can rely on it even during an incident where your cluster might be degraded.
-->
如果你設定了指標看板或其他類似的組件，審查暴露指標數據到看板的組件鏈路和看板本身。
確保整個鏈路設計具有足夠的彈性和足夠的完整性保護，
只有這樣，即便是在叢集降級導致的事件發生時，你也可以依賴它。

<!--
Where appropriate, deploy security measures below the level of Kubernetes
itself, such as cryptographically measured boot, or authenticated distribution
of time (which helps ensure the fidelity of logs and audit records).
-->
在適當的情況下，在 Kubernetes 層之下部署一些安全舉措，
例如加密後啓動或驗證分發時間（有助於確保日誌和審計記錄的真實性）。

<!--
For a high assurance environment, deploy cryptographic protections to ensure that
logs are both tamper-proof and confidential.
-->
對於高安全級別需求環境，部署加密保護措施，以確保日誌防篡改和保密。

## {{% heading "whatsnext" %}}

<!--
### Cloud native security {#further-reading-cloud-native}
-->
### 雲原生安全 {#further-reading-cloud-native}

<!--
* CNCF [white paper](https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)
  on cloud native security.
* CNCF [white paper](https://github.com/cncf/tag-security/blob/f80844baaea22a358f5b20dca52cd6f72a32b066/supply-chain-security/supply-chain-security-paper/CNCF_SSCP_v1.pdf)
  on good practices for securing a software supply chain.
* [Kubernetes Security Best Practices](https://www.youtube.com/watch?v=wqsUfvRyYpw) (Kubernetes Forum Seoul 2019)
* [Towards Measured Boot Out of the Box](https://www.youtube.com/watch?v=EzSkU3Oecuw) (Linux Security Summit 2016)
-->
* CNCF 有關雲原生安全的[白皮書](https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)。

* CNCF 有關加固軟件供應鏈的最佳實踐[白皮書](https://github.com/cncf/tag-security/blob/f80844baaea22a358f5b20dca52cd6f72a32b066/supply-chain-security/supply-chain-security-paper/CNCF_SSCP_v1.pdf)。
* [Fixing the Kubernetes clusterf\*\*k: Understanding security from the kernel up](https://archive.fosdem.org/2020/schedule/event/kubernetes/) (FOSDEM 2020)
* [Kubernetes 安全最佳實踐](https://www.youtube.com/watch?v=wqsUfvRyYpw) (Kubernetes Forum Seoul 2019)
* [朝着開箱即用的測量啓動前進](https://www.youtube.com/watch?v=EzSkU3Oecuw) (Linux Security Summit 2016)

<!--
### Kubernetes and information security {#further-reading-k8s}
-->
### Kubernetes 和信息安全 {#further-reading-k8s}

<!--
* [Kubernetes security](/docs/concepts/security/)
* [Securing your cluster](/docs/tasks/administer-cluster/securing-a-cluster/)
* [Data encryption in transit](/docs/tasks/tls/managing-tls-in-a-cluster/) for the control plane
* [Data encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
* [Secrets in Kubernetes](/docs/concepts/configuration/secret/)
* [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access)
* [Network policies](/docs/concepts/services-networking/network-policies/) for Pods
* [Pod security standards](/docs/concepts/security/pod-security-standards/)
* [RuntimeClasses](/docs/concepts/containers/runtime-class)
-->
* [安全](/zh-cn/docs/concepts/security/)
* [保護叢集](/zh-cn/docs/tasks/administer-cluster/securing-a-cluster/)
* 針對控制平面[傳輸中的數據加密](/zh-cn/docs/tasks/tls/managing-tls-in-a-cluster/) 
* [靜態加密機密數據](/zh-cn/docs/tasks/administer-cluster/encrypt-data/)
* [Secret](/zh-cn/docs/concepts/configuration/secret/)
* [Kubernetes API 訪問控制](/zh-cn/docs/concepts/security/controlling-access)
* 針對 Pod 的[網路策略](/zh-cn/docs/concepts/services-networking/network-policies/) 
* [Pod 安全性標準](/zh-cn/docs/concepts/security/pod-security-standards/)
* [容器運行時類](/zh-cn/docs/concepts/containers/runtime-class)
