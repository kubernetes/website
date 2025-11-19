---
title: 多租戶
content_type: concept
weight: 80
---
<!--
title: Multi-tenancy
content_type: concept
weight: 80
-->

<!--
This page provides an overview of available configuration options and best practices for cluster
multi-tenancy.
-->
此頁面概述了叢集多租戶的可用設定選項和最佳實踐。

<!--
Sharing clusters saves costs and simplifies administration. However, sharing clusters also
presents challenges such as security, fairness, and managing _noisy neighbors_.
-->
共享叢集可以節省成本並簡化管理。
然而，共享叢集也帶來了諸如安全性、公平性和管理**嘈雜鄰居**等挑戰。

<!--
Clusters can be shared in many ways. In some cases, different applications may run in the same
cluster. In other cases, multiple instances of the same application may run in the same cluster,
one for each end user. All these types of sharing are frequently described using the umbrella term
_multi-tenancy_.
-->
叢集可以通過多種方式共享。在某些情況下，不同的應用可能會在同一個叢集中運行。
在其他情況下，同一應用的多個實例可能在同一個叢集中運行，每個實例對應一個最終使用者。
所有這些類型的共享經常使用一個總括術語 **多租戶（Multi-Tenancy）** 來表述。

<!--
While Kubernetes does not have first-class concepts of end users or tenants, it provides several
features to help manage different tenancy requirements. These are discussed below.
-->
雖然 Kubernetes 沒有最終使用者或租戶的一階概念，
它還是提供了幾個特性來幫助管理不同的租戶需求。下面將對此進行討論。

<!--
## Use cases
-->
## 用例 {#use-cases}

<!--
The first step to determining how to share your cluster is understanding your use case, so you can
evaluate the patterns and tools available. In general, multi-tenancy in Kubernetes clusters falls
into two broad categories, though many variations and hybrids are also possible.
-->
確定如何共享叢集的第一步是理解用例，以便你可以評估可用的模式和工具。
一般來說，Kubernetes 叢集中的多租戶分爲兩大類，但也可以有許多變體和混合。

<!--
### Multiple teams
-->
### 多團隊 {#multiple-teams}

<!--
A common form of multi-tenancy is to share a cluster between multiple teams within an
organization, each of whom may operate one or more workloads. These workloads frequently need to
communicate with each other, and with other workloads located on the same or different clusters.
-->
多租戶的一種常見形式是在組織內的多個團隊之間共享一個叢集，每個團隊可以操作一個或多個工作負載。
這些工作負載經常需要相互通信，並與位於相同或不同叢集上的其他工作負載進行通信。

<!--
In this scenario, members of the teams often have direct access to Kubernetes resources via tools
such as `kubectl`, or indirect access through GitOps controllers or other types of release
automation tools. There is often some level of trust between members of different teams, but
Kubernetes policies such as RBAC, quotas, and network policies are essential to safely and fairly
share clusters.
-->
在這一場景中，團隊成員通常可以通過類似 `kubectl` 等工具直接訪問 Kubernetes 資源，
或者通過 GitOps 控制器或其他類型的自動化發佈工具間接訪問 Kubernetes 資源。
不同團隊的成員之間通常存在某種程度的信任，
但 RBAC、配額和網路策略等 Kubernetes 策略對於安全、公平地共享叢集至關重要。

<!--
### Multiple customers
-->
### 多客戶 {#multiple-customers}

<!--
The other major form of multi-tenancy frequently involves a Software-as-a-Service (SaaS) vendor
running multiple instances of a workload for customers. This business model is so strongly
associated with this deployment style that many people call it "SaaS tenancy." However, a better
term might be "multi-customer tenancy," since SaaS vendors may also use other deployment models,
and this deployment model can also be used outside of SaaS.
-->
多租戶的另一種主要形式通常涉及爲客戶運行多個工作負載實例的軟件即服務 (SaaS) 供應商。
這種業務模型與其部署風格之間的相關非常密切，以至於許多人稱之爲 “SaaS 租戶”。  
但是，更好的術語可能是“多客戶租戶（Multi-Customer Tenancy）”，因爲 SaaS 供應商也可以使用其他部署模型，
並且這種部署模型也可以在 SaaS 之外使用。

<!--
In this scenario, the customers do not have access to the cluster; Kubernetes is invisible from
their perspective and is only used by the vendor to manage the workloads. Cost optimization is
frequently a critical concern, and Kubernetes policies are used to ensure that the workloads are
strongly isolated from each other.
-->
在這種情況下，客戶無權訪問叢集；
從他們的角度來看，Kubernetes 是不可見的，僅由供應商用於管理工作負載。
成本優化通常是一個關鍵問題，Kubernetes 策略用於確保工作負載彼此高度隔離。

<!--
## Terminology
-->
## 術語 {#terminology}

<!--
### Tenants
-->
### 租戶 {#tenants}

<!--
When discussing multi-tenancy in Kubernetes, there is no single definition for a "tenant".
Rather, the definition of a tenant will vary depending on whether multi-team or multi-customer
tenancy is being discussed.
-->
在討論 Kubernetes 中的多租戶時，“租戶”沒有單一的定義。
相反，租戶的定義將根據討論的是多團隊還是多客戶租戶而有所不同。

<!--
In multi-team usage, a tenant is typically a team, where each team typically deploys a small
number of workloads that scales with the complexity of the service. However, the definition of
"team" may itself be fuzzy, as teams may be organized into higher-level divisions or subdivided
into smaller teams.
-->
在多團隊使用中，租戶通常是一個團隊，
每個團隊通常部署少量工作負載，這些工作負載會隨着服務的複雜性而發生規模伸縮。
然而，“團隊”的定義本身可能是模糊的，
因爲團隊可能被組織成更高級別的部門或細分爲更小的團隊。

<!--
By contrast, if each team deploys dedicated workloads for each new client, they are using a
multi-customer model of tenancy. In this case, a "tenant" is simply a group of users who share a
single workload. This may be as large as an entire company, or as small as a single team at that
company.
-->
相反，如果每個團隊爲每個新客戶部署專用的工作負載，那麼他們使用的是多客戶租戶模型。
在這種情況下，“租戶”只是共享單個工作負載的一組使用者。
這種租戶可能大到整個公司，也可能小到該公司的一個團隊。

<!--
In many cases, the same organization may use both definitions of "tenants" in different contexts.
For example, a platform team may offer shared services such as security tools and databases to
multiple internal “customers” and a SaaS vendor may also have multiple teams sharing a development
cluster. Finally, hybrid architectures are also possible, such as a SaaS provider using a
combination of per-customer workloads for sensitive data, combined with multi-tenant shared
services.
-->
在許多情況下，同一組織可能在不同的上下文中使用“租戶”的兩種定義。
例如，一個平臺團隊可能向多個內部“客戶”提供安全工具和數據庫等共享服務，
而 SaaS 供應商也可能讓多個團隊共享一個開發叢集。最後，混合架構也是可能的，
例如，某 SaaS 提供商爲每個客戶的敏感數據提供獨立的工作負載，同時提供多租戶共享的服務。

<!--
{{< figure src="/images/docs/multi-tenancy.png" title="A cluster showing coexisting tenancy models" class="diagram-large" >}}
-->
{{< figure src="/images/docs/multi-tenancy.png" title="展示共存租戶模型的叢集" class="diagram-large" >}}

<!--
### Isolation
-->
### 隔離 {#isolation}

<!--
There are several ways to design and build multi-tenant solutions with Kubernetes. Each of these
methods comes with its own set of tradeoffs that impact the isolation level, implementation
effort, operational complexity, and cost of service.
-->
使用 Kubernetes 設計和構建多租戶解決方案有多種方法。
每種方法都有自己的一組權衡，這些權衡會影響隔離級別、實現工作量、操作複雜性和服務成本。

<!--
A Kubernetes cluster consists of a control plane which runs Kubernetes software, and a data plane
consisting of worker nodes where tenant workloads are executed as pods. Tenant isolation can be
applied in both the control plane and the data plane based on organizational requirements.
-->
Kubernetes 叢集由運行 Kubernetes 軟件的控制平面和由工作節點組成的數據平面組成，
租戶工作負載作爲 Pod 在工作節點上執行。
租戶隔離可以根據組織要求應用於控制平面和數據平面。

<!--
The level of isolation offered is sometimes described using terms like “hard” multi-tenancy, which
implies strong isolation, and “soft” multi-tenancy, which implies weaker isolation. In particular,
"hard" multi-tenancy is often used to describe cases where the tenants do not trust each other,
often from security and resource sharing perspectives (e.g. guarding against attacks such as data
exfiltration or DoS). Since data planes typically have much larger attack surfaces, "hard"
multi-tenancy often requires extra attention to isolating the data-plane, though control plane
isolation  also remains critical.
-->
所提供的隔離級別有時會使用一些術語來描述，例如 “硬性（Hard）” 多租戶意味着強隔離，
而 “柔性（Soft）” 多租戶意味着較弱的隔離。
特別是，“硬性”多租戶通常用於描述租戶彼此不信任的情況，
並且大多是從安全和資源共享的角度（例如，防範數據泄露或 DoS 攻擊等）。
由於數據平面通常具有更大的攻擊面，“硬性”多租戶通常需要額外注意隔離數據平面，
儘管控制平面隔離也很關鍵。

<!--
However, the terms "hard" and "soft" can often be confusing, as there is no single definition that
will apply to all users. Rather, "hardness" or "softness" is better understood as a broad
spectrum, with many different techniques that can be used to maintain different types of isolation
in your clusters, based on your requirements.
-->
但是，“硬性”和“柔性”這兩個術語常常令人困惑，因爲沒有一種定義能夠適用於所有使用者。
相反，依據“硬度（Hardness）”或“柔度（Softness）”所定義的廣泛譜系則更容易理解，
根據你的需求，可以使用許多不同的技術在叢集中維護不同類型的隔離。

<!--
In more extreme cases, it may be easier or necessary to forgo any cluster-level sharing at all and
assign each tenant their dedicated cluster, possibly even running on dedicated hardware if VMs are
not considered an adequate security boundary. This may be easier with managed Kubernetes clusters,
where the overhead of creating and operating clusters is at least somewhat taken on by a cloud
provider. The benefit of stronger tenant isolation must be evaluated against the cost and
complexity of managing multiple clusters. The [Multi-cluster SIG](https://git.k8s.io/community/sig-multicluster/README.md)
is responsible for addressing these types of use cases.
-->
在更極端的情況下，徹底放棄所有叢集級別的共享併爲每個租戶分配其專用叢集可能更容易或有必要，
如果認爲虛擬機所提供的安全邊界還不夠，甚至可以在專用硬件上運行。
對於託管的 Kubernetes 叢集而言，這種方案可能更容易，
其中創建和操作叢集的開銷至少在一定程度上由雲提供商承擔。
必須根據管理多個叢集的成本和複雜性來評估更強的租戶隔離的好處。
[Multi-Cluster SIG](https://git.k8s.io/community/sig-multicluster/README.md) 負責解決這些類型的用例。

<!--
The remainder of this page focuses on isolation techniques used for shared Kubernetes clusters.
However, even if you are considering dedicated clusters, it may be valuable to review these
recommendations, as it will give you the flexibility to shift to shared clusters in the future if
your needs or capabilities change.
-->
本頁的其餘部分重點介紹用於共享 Kubernetes 叢集的隔離技術。
但是，即使你正在考慮使用專用叢集，查看這些建議也可能很有價值，
因爲如果你的需求或功能發生變化，它可以讓你在未來比較靈活地切換到共享叢集。

<!--
## Control plane isolation
-->
## 控制面隔離 {#control-plane-isolation}

<!--
Control plane isolation ensures that different tenants cannot access or affect each others'
Kubernetes API resources.
-->
控制平面隔離確保不同租戶無法訪問或影響彼此的 Kubernetes API 資源。

<!--
### Namespaces
-->
### 命名空間 {#namespaces}

<!--
In Kubernetes, a {{< glossary_tooltip text="Namespace" term_id="namespace" >}} provides a
mechanism for isolating groups of API resources within a single cluster. This isolation has two
key dimensions:
-->
在 Kubernetes 中，
{{<glossary_tooltip text="命名空間" term_id="namespace" >}}提供了一種在單個叢集中隔離 API 資源組的機制。
這種隔離有兩個關鍵維度：

<!--
1. Object names within a namespace can overlap with names in other namespaces, similar to files in
   folders. This allows tenants to name their resources without having to consider what other
   tenants are doing.
-->
1. 一個命名空間中的對象名稱可以與其他命名空間中的名稱重疊，類似於文件夾中的文件。
   這允許租戶命名他們的資源，而無需考慮其他租戶在做什麼。

<!--
2. Many Kubernetes security policies are scoped to namespaces. For example, RBAC Roles and Network
   Policies are namespace-scoped resources. Using RBAC, Users and Service Accounts can be
   restricted to a namespace.
-->
2. 許多 Kubernetes 安全策略的作用域是命名空間。
   例如，RBAC Role 和 NetworkPolicy 是命名空間作用域的資源。
   使用 RBAC，可以將使用者賬號和服務賬號限制在一個命名空間中。

<!--
In a multi-tenant environment, a Namespace helps segment a tenant's workload into a logical and
distinct management unit. In fact, a common practice is to isolate every workload in its own
namespace, even if multiple workloads are operated by the same tenant. This ensures that each
workload has its own identity and can be configured with an appropriate security policy.
-->
在多租戶環境中，命名空間有助於將租戶的工作負載劃分到各不相同的邏輯管理單元中。
事實上，一種常見的做法是將每個工作負載隔離在自己的命名空間中，
即使多個工作負載由同一個租戶操作。
這可確保每個工作負載都有自己的身份，並且可以使用適當的安全策略進行設定。

<!--
The namespace isolation model requires configuration of several other Kubernetes resources,
networking plugins, and adherence to security best practices to properly isolate tenant workloads.
These considerations are discussed below.
-->
命名空間隔離模型需要設定其他幾個 Kubernetes 資源、網路插件，
並遵守安全最佳實踐以正確隔離租戶工作負載。這些考慮將在下面討論。

<!--
### Access controls
-->
### 訪問控制 {#access-controls}

<!--
The most important type of isolation for the control plane is authorization. If teams or their
workloads can access or modify each others' API resources, they can change or disable all other
types of policies thereby negating any protection those policies may offer. As a result, it is
critical to ensure that each tenant has the appropriate access to only the namespaces they need,
and no more. This is known as the "Principle of Least Privilege."
-->
控制平面最重要的隔離類型是授權。如果各個團隊或其工作負載可以訪問或修改彼此的 API 資源，
他們可以更改或禁用所有其他類型的策略，從而取消這些策略可能提供的任何保護。
因此，確保每個租戶只對他們需要的命名空間有適當的訪問權，
而不是更多，這一點至關重要。這被稱爲“最小特權原則（Principle of Least Privileges）”。

<!--
Role-based access control (RBAC) is commonly used to enforce authorization in the Kubernetes
control plane, for both users and workloads (service accounts).
[Roles](/docs/reference/access-authn-authz/rbac/#role-and-clusterrole) and
[RoleBindings](/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) are
Kubernetes objects that are used at a namespace level to enforce access control in your
application; similar objects exist for authorizing access to cluster-level objects, though these
are less useful for multi-tenant clusters.

-->
基於角色的訪問控制 (RBAC) 通常用於在 Kubernetes 控制平面中對使用者和工作負載（服務賬號）強制執行鑑權。
[角色](/zh-cn/docs/reference/access-authn-authz/rbac/#role-and-clusterrole)
和[角色綁定](/zh-cn/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding)是兩種
Kubernetes 對象，用來在命名空間級別對應用實施訪問控制；
對叢集級別的對象訪問鑑權也有類似的對象，不過這些對象對於多租戶叢集不太有用。

<!--
In a multi-team environment, RBAC must be used to restrict tenants' access to the appropriate
namespaces, and ensure that cluster-wide resources can only be accessed or modified by privileged
users such as cluster administrators.
-->
在多團隊環境中，必須使用 RBAC 來限制租戶只能訪問合適的命名空間，
並確保叢集範圍的資源只能由叢集管理員等特權使用者訪問或修改。

<!--
If a policy ends up granting a user more permissions than they need, this is likely a signal that
the namespace containing the affected resources should be refactored into finer-grained
namespaces. Namespace management tools may simplify the management of these finer-grained
namespaces by applying common RBAC policies to different namespaces, while still allowing
fine-grained policies where necessary.
-->
如果一個策略最終授予使用者的權限比他們所需要的還多，
這可能是一個信號，表明包含受影響資源的命名空間應該被重構爲更細粒度的命名空間。
命名空間管理工具可以通過將通用 RBAC 策略應用於不同的命名空間來簡化這些細粒度命名空間的管理，
同時在必要時仍允許細粒度策略。

<!--
### Quotas
-->
### 配額 {#quotas}

<!--
Kubernetes workloads consume node resources, like CPU and memory.  In a multi-tenant environment,
you can use [Resource Quotas](/docs/concepts/policy/resource-quotas/) to manage resource usage of
tenant workloads.  For the multiple teams use case, where tenants have access to the Kubernetes
API, you can use resource quotas to limit the number of API resources (for example: the number of
Pods, or the number of ConfigMaps) that a tenant can create. Limits on object count ensure
fairness and aim to avoid _noisy neighbor_ issues from affecting other tenants that share a
control plane.
-->
Kubernetes 工作負載消耗節點資源，例如 CPU 和內存。在多租戶環境中，
你可以使用[資源配額](/zh-cn/docs/concepts/policy/resource-quotas/)來管理租戶工作負載的資源使用情況。
對於多團隊場景，各個租戶可以訪問 Kubernetes API，你可以使用資源配額來限制租戶可以創建的 API 資源的數量
（例如：Pod 的數量或 ConfigMap 的數量）。
對對象計數的限制確保了公平性，並有助於避免**嘈雜鄰居**問題影響共享控制平面的其他租戶。

<!--
Resource quotas are namespaced objects. By mapping tenants to namespaces, cluster admins can use
quotas to ensure that a tenant cannot monopolize a cluster's resources or overwhelm its control
plane. Namespace management tools simplify the administration of quotas. In addition, while
Kubernetes quotas only apply within a single namespace, some namespace management tools allow
groups of namespaces to share quotas, giving administrators far more flexibility with less effort
than built-in quotas.
-->
資源配額是命名空間作用域的對象。通過將租戶映射到命名空間，
叢集管理員可以使用配額來確保租戶不能壟斷叢集的資源或壓垮控制平面。
命名空間管理工具簡化了配額的管理。
此外，雖然 Kubernetes 配額僅針對單個命名空間，
但一些命名空間管理工具允許多個命名空間組共享配額，
與內置配額相比，降低了管理員的工作量，同時爲其提供了更大的靈活性。

<!--
Quotas prevent a single tenant from consuming greater than their allocated share of resources
hence minimizing the “noisy neighbor” issue, where one tenant negatively impacts the performance
of other tenants' workloads.
-->
配額可防止單個租戶所消耗的資源超過其被分配的份額，從而最大限度地減少**嘈雜鄰居**問題，
即一個租戶對其他租戶工作負載的性能產生負面影響。

<!--
When you apply a quota to namespace, Kubernetes requires you to also specify resource requests and
limits for each container. Limits are the upper bound for the amount of resources that a container
can consume. Containers that attempt to consume resources that exceed the configured limits will
either be throttled or killed, based on the resource type. When resource requests are set lower
than limits, each container is guaranteed the requested amount but there may still be some
potential for impact across workloads.
-->
當你對命名空間應用配額時，Kubernetes 要求你還爲每個容器指定資源請求和限制。
限制是容器可以消耗的資源量的上限。
根據資源類型，嘗試使用超出設定限制的資源的容器將被限制或終止。
當資源請求設置爲低於限制時，
每個容器所請求的數量都可以得到保證，但可能仍然存在跨工作負載的一些潛在影響。

<!--
Quotas cannot protect against all kinds of resource sharing, such as network traffic.
Node isolation (described below) may be a better solution for this problem.
-->
配額不能針對所共享的所有資源（例如網路流量）提供保護。
節點隔離（如下所述）可能是解決此問題的更好方法。

<!--
## Data Plane Isolation
-->
## 數據平面隔離 {#data-plane-isolation}

<!--
Data plane isolation ensures that pods and workloads for different tenants are sufficiently
isolated.
-->
數據平面隔離確保不同租戶的 Pod 和工作負載之間被充分隔離。

<!--
### Network isolation
-->
### 網路隔離 {#network-isolation}

<!--
By default, all pods in a Kubernetes cluster are allowed to communicate with each other, and all
network traffic is unencrypted. This can lead to security vulnerabilities where traffic is
accidentally or maliciously sent to an unintended destination, or is intercepted by a workload on
a compromised node.
-->
默認情況下，Kubernetes 叢集中的所有 Pod 都可以相互通信，並且所有網路流量都是未加密的。
這可能導致安全漏洞，導致流量被意外或惡意發送到非預期目的地，
或被受感染節點上的工作負載攔截。

<!--
Pod-to-pod communication can be controlled using [Network Policies](/docs/concepts/services-networking/network-policies/),
which restrict communication between pods using namespace labels or IP address ranges.
In a multi-tenant environment where strict network isolation between tenants is required, starting
with a default policy that denies communication between pods is recommended with another rule that
allows all pods to query the DNS server for name resolution. With such a default policy in place,
you can begin adding more permissive rules that allow for communication within a namespace.
It is also recommended not to use empty label selector '{}' for namespaceSelector field in network policy definition,
in case traffic need to be allowed between namespaces.
This scheme can be further refined as required. Note that this only applies to pods within a single
control plane; pods that belong to different virtual control planes cannot talk to each other via
Kubernetes networking.
-->
Pod 之間的通信可以使用[網路策略](/zh-cn/docs/concepts/services-networking/network-policies/)來控制，
它使用命名空間標籤或 IP 地址範圍來限制 Pod 之間的通信。
在需要租戶之間嚴格網路隔離的多租戶環境中，建議從拒絕 Pod 之間通信的默認策略入手，
然後添加一條允許所有 Pod 查詢 DNS 伺服器以進行名稱解析的規則。
有了這樣的默認策略之後，你就可以開始添加允許在命名空間內進行通信的更多規則。
另外建議不要在網路策略定義中對 namespaceSelector 字段使用空標籤選擇算符 “{}”，
以防需要允許在命名空間之間傳輸流量。該方案可根據需要進一步細化。
請注意，這僅適用於單個控制平面內的 Pod；
屬於不同虛擬控制平面的 Pod 不能通過 Kubernetes 網路相互通信。

<!--
Namespace management tools may simplify the creation of default or common network policies.
In addition, some of these tools allow you to enforce a consistent set of namespace labels across
your cluster, ensuring that they are a trusted basis for your policies.
-->
命名空間管理工具可以簡化默認或通用網路策略的創建。
此外，其中一些工具允許你在整個叢集中強制實施一組一致的命名空間標籤，
確保它們是你策略的可信基礎。

{{< warning >}}
<!--
Network policies require a [CNI plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#cni)
that supports the implementation of network policies. Otherwise, NetworkPolicy resources will be ignored.
-->
網路策略需要一個支持網路策略實現的
[CNI 插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#cni)。
否則，NetworkPolicy 資源將被忽略。
{{< /warning >}}

<!--
More advanced network isolation may be provided by service meshes, which provide OSI Layer 7
policies based on workload identity, in addition to namespaces. These higher-level policies can
make it easier to manage namespace-based multi-tenancy, especially when multiple namespaces are
dedicated to a single tenant. They frequently also offer encryption using mutual TLS, protecting
your data even in the presence of a compromised node, and work across dedicated or virtual clusters.
However, they can be significantly more complex to manage and may not be appropriate for all users.
-->
服務網格可以提供更高級的網路隔離，
除了命名空間之外，它還提供基於工作負載身份的 OSI 第 7 層策略。
這些更高層次的策略可以更輕鬆地管理基於命名空間的多租戶，
尤其是存在多個命名空間專用於某一個租戶時。
服務網格還經常使用雙向 TLS 提供加密能力，
即使在存在受損節點的情況下也能保護你的數據，並且可以跨專用或虛擬叢集工作。
但是，它們的管理可能要複雜得多，並且可能並不適合所有使用者。

<!--
### Storage isolation
-->
### 存儲隔離 {#storage-isolation}

<!--
Kubernetes offers several types of volumes that can be used as persistent storage for workloads.
For security and data-isolation, [dynamic volume provisioning](/docs/concepts/storage/dynamic-provisioning/)
is recommended and volume types that use node resources should be avoided.
-->
Kubernetes 提供了若干類型的卷，可以用作工作負載的持久存儲。
爲了安全和數據隔離，建議使用[動態卷製備](/zh-cn/docs/concepts/storage/dynamic-provisioning/)，
並且應避免使用節點資源的卷類型。

<!--
[StorageClasses](/docs/concepts/storage/storage-classes/) allow you to describe custom "classes"
of storage offered by your cluster, based on quality-of-service levels, backup policies, or custom
policies determined by the cluster administrators.
-->
[存儲類（StorageClass）](/zh-cn/docs/concepts/storage/storage-classes/)允許你根據服務質量級別、
備份策略或由叢集管理員確定的自定義策略描述叢集提供的自定義存儲“類”。

<!--
Pods can request storage using a [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/).
A PersistentVolumeClaim is a namespaced resource, which enables isolating portions of the storage
system and dedicating it to tenants within the shared Kubernetes cluster.
However, it is important to note that a PersistentVolume is a cluster-wide resource and has a
lifecycle independent of workloads and namespaces.
-->
Pod 可以使用[持久卷申領（PersistentVolumeClaim）](/zh-cn/docs/concepts/storage/persistent-volumes/)請求存儲。
PersistentVolumeClaim 是一種命名空間作用域的資源，
它可以隔離存儲系統的不同部分，並將隔離出來的存儲提供給共享 Kubernetes 叢集中的租戶專用。
但是，重要的是要注意 PersistentVolume 是叢集作用域的資源，
並且其生命週期獨立於工作負載和命名空間的生命週期。

<!--
For example, you can configure a separate StorageClass for each tenant and use this to strengthen isolation.
If a StorageClass is shared, you should set a [reclaim policy of `Delete`](/docs/concepts/storage/storage-classes/#reclaim-policy)
to ensure that a PersistentVolume cannot be reused across different namespaces.
-->
例如，你可以爲每個租戶設定一個單獨的 StorageClass，並使用它來加強隔離。
如果一個 StorageClass 是共享的，你應該設置一個[回收策略](/zh-cn/docs/concepts/storage/storage-classes/#reclaim-policy)
以確保 PersistentVolume 不能在不同的命名空間中重複使用。

<!--
### Sandboxing containers
-->
### 沙箱容器 {#sandboxing-containers}

<!--
Kubernetes pods are composed of one or more containers that execute on worker nodes.
Containers utilize OS-level virtualization and hence offer a weaker isolation boundary than
virtual machines that utilize hardware-based virtualization.
-->
Kubernetes Pod 由在工作節點上執行的一個或多個容器組成。
容器利用操作系統級別的虛擬化，
因此提供的隔離邊界比使用基於硬件虛擬化的虛擬機弱一些。

<!--
In a shared environment, unpatched vulnerabilities in the application and system layers can be
exploited by attackers for container breakouts and remote code execution that allow access to host
resources. In some applications, like a Content Management System (CMS), customers may be allowed
the ability to upload and execute untrusted scripts or code. In either case, mechanisms to further
isolate and protect workloads using strong isolation are desirable.
-->
在共享環境中，攻擊者可以利用應用和系統層中未修補的漏洞實現容器逃逸和遠程代碼執行，
從而允許訪問主機資源。在某些應用中，例如內容管理系統（CMS），
客戶可能被授權上傳和執行非受信的腳本或代碼。
無論哪種情況，都需要使用強隔離進一步隔離和保護工作負載的機制。

<!--
Sandboxing provides a way to isolate workloads running in a shared cluster. It typically involves
running each pod in a separate execution environment such as a virtual machine or a userspace
kernel. Sandboxing is often recommended when you are running untrusted code, where workloads are
assumed to be malicious. Part of the reason this type of isolation is necessary is because
containers are processes running on a shared kernel; they mount file systems like `/sys` and `/proc`
from the underlying host, making them less secure than an application that runs on a virtual
machine which has its own kernel. While controls such as seccomp, AppArmor, and SELinux can be
used to strengthen the security of containers, it is hard to apply a universal set of rules to all
workloads running in a shared cluster. Running workloads in a sandbox environment helps to
insulate the host from container escapes, where an attacker exploits a vulnerability to gain
access to the host system and all the processes/files running on that host.
-->
沙箱提供了一種在共享叢集中隔離運行中的工作負載的方法。
它通常涉及在單獨的執行環境（例如虛擬機或使用者空間內核）中運行每個 Pod。
當你運行不受信任的代碼時（假定工作負載是惡意的），通常建議使用沙箱，
這種隔離是必要的，部分原因是由於容器是在共享內核上運行的進程。
它們從底層主機掛載像 `/sys` 和 `/proc` 這樣的文件系統，
這使得它們不如在具有自己內核的虛擬機上運行的應用安全。
雖然 seccomp、AppArmor 和 SELinux 等控件可用於加強容器的安全性，
但很難將一套通用規則應用於在共享叢集中運行的所有工作負載。
在沙箱環境中運行工作負載有助於將主機隔離開來，不受容器逃逸影響，
在容器逃逸場景中，攻擊者會利用漏洞來訪問主機系統以及在該主機上運行的所有進程/文件。

<!--
Virtual machines and userspace kernels are two popular approaches to sandboxing.
-->
虛擬機和使用者空間內核是兩種流行的沙箱方法。

<!--
### Node Isolation
-->
### 節點隔離 {#node-isolation}

<!--
Node isolation is another technique that you can use to isolate tenant workloads from each other.
With node isolation, a set of nodes is dedicated to running pods from a particular tenant and
co-mingling of tenant pods is prohibited. This configuration reduces the noisy tenant issue, as
all pods running on a node will belong to a single tenant. The risk of information disclosure is
slightly lower with node isolation because an attacker that manages to escape from a container
will only have access to the containers and volumes mounted to that node.
-->
節點隔離是另一種可用於將租戶工作負載相互隔離的技術。
通過節點隔離，一組節點專用於運行來自特定租戶的 Pod，並且禁止混合不同租戶 Pod 集合。
這種設定減少了嘈雜的租戶問題，因爲在一個節點上運行的所有 Pod 都將屬於一個租戶。
節點隔離的信息泄露風險略低，
因爲成功實現容器逃逸的攻擊者也只能訪問掛載在該節點上的容器和卷。

<!--
Although workloads from different tenants are running on different nodes, it is important to be
aware that the kubelet and (unless using virtual control planes) the API service are still shared
services. A skilled attacker could use the permissions assigned to the kubelet or other pods
running on the node to move laterally within the cluster and gain access to tenant workloads
running on other nodes. If this is a major concern, consider implementing compensating controls
such as seccomp, AppArmor or SELinux or explore using sandboxed containers or creating separate
clusters for each tenant.
-->
儘管來自不同租戶的工作負載在不同的節點上運行，
仍然很重要的是要注意 kubelet 和
（除非使用虛擬控制平面）API 服務仍然是共享服務。
熟練的攻擊者可以使用分配給 kubelet 或節點上運行的其他 Pod
的權限在叢集內橫向移動並獲得對其他節點上運行的租戶工作負載的訪問權限。
如果這是一個主要問題，請考慮實施補償控制，
例如使用 seccomp、AppArmor 或 SELinux，或者探索使用沙箱容器，或者爲每個租戶創建單獨的叢集。

<!--
Node isolation is a little easier to reason about from a billing standpoint than sandboxing
containers since you can charge back per node rather than per pod. It also has fewer compatibility
and performance issues and may be easier to implement than sandboxing containers.
For example, nodes for each tenant can be configured with taints so that only pods with the
corresponding toleration can run on them. A mutating webhook could then be used to automatically
add tolerations and node affinities to pods deployed into tenant namespaces so that they run on a
specific set of nodes designated for that tenant.
-->
從計費的角度來看，節點隔離比沙箱容器更容易理解，
因爲你可以按節點而不是按 Pod 收費。
它的兼容性和性能問題也較少，而且可能比沙箱容器更容易實現。
例如，可以爲每個租戶的節點設定污點，
以便只有具有相應容忍度的 Pod 才能在其上運行。
然後可以使用變更性質的 Webhook 自動向部署到租戶命名空間中的 Pod 添加容忍度和節點親和性，
以便它們在爲該租戶指定的一組特定節點上運行。

<!--
Node isolation can be implemented using [pod node selectors](/docs/concepts/scheduling-eviction/assign-pod-node/).
-->
節點隔離可以使用[將 Pod 指派給節點](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)來實現。

<!--
## Additional Considerations
-->
## 額外的注意事項 {#additional-considerations}

<!--
This section discusses other Kubernetes constructs and patterns that are relevant for multi-tenancy.
-->
本節討論與多租戶相關的其他 Kubernetes 結構和模式。

<!--
### API Priority and Fairness
-->
### API 優先級和公平性 {#api-priority-and-fairness}

<!--
[API priority and fairness](/docs/concepts/cluster-administration/flow-control/) is a Kubernetes
feature that allows you to assign a priority to certain pods running within the cluster.
When an application calls the Kubernetes API, the API server evaluates the priority assigned to pod.
Calls from pods with higher priority are fulfilled before those with a lower priority.
When contention is high, lower priority calls can be queued until the server is less busy or you
can reject the requests.
-->
[API 優先級和公平性](/zh-cn/docs/concepts/cluster-administration/flow-control/)是 Kubernetes 的一個特性，
允許你爲叢集中運行的某些 Pod 賦予優先級。
當應用調用 Kubernetes API 時，API 伺服器會評估分配給 Pod 的優先級。
來自具有較高優先級的 Pod 的調用會在具有較低優先級的 Pod 的調用之前完成。
當爭用很激烈時，較低優先級的調用可以排隊，直到伺服器不那麼忙，或者你可以拒絕請求。

<!--
Using API priority and fairness will not be very common in SaaS environments unless you are
allowing customers to run applications that interface with the Kubernetes API, for example,
a controller.
-->
使用 API 優先級和公平性在 SaaS 環境中並不常見，
除非你允許客戶運行與 Kubernetes API 接口的應用，例如控制器。

<!--
### Quality-of-Service (QoS) {#qos}
-->
### 服務質量 (QoS) {#qos}

<!--
When you’re running a SaaS application, you may want the ability to offer different
Quality-of-Service (QoS) tiers of service to different tenants. For example, you may have freemium
service that comes with fewer performance guarantees and features and a for-fee service tier with
specific performance guarantees. Fortunately, there are several Kubernetes constructs that can
help you accomplish this within a shared cluster, including network QoS, storage classes, and pod
priority and preemption. The idea with each of these is to provide tenants with the quality of
service that they paid for. Let’s start by looking at networking QoS.
-->
當你運行 SaaS 應用時，
你可能希望能夠爲不同的租戶提供不同的服務質量 (QoS) 層級。
例如，你可能擁有具有性能保證和功能較差的免費增值服務，
以及具有一定性能保證的收費服務層。
幸運的是，有幾個 Kubernetes 結構可以幫助你在共享叢集中完成此任務，
包括網路 QoS、存儲類以及 Pod 優先級和搶佔。
這些都是爲了給租戶提供他們所支付的服務質量。
讓我們從網路 QoS 開始。

<!--
Typically, all pods on a node share a network interface. Without network QoS, some pods may
consume an unfair share of the available bandwidth at the expense of other pods.
The Kubernetes [bandwidth plugin](https://www.cni.dev/plugins/current/meta/bandwidth/) creates an
[extended resource](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
for networking that allows you to use Kubernetes resources constructs, i.e. requests/limits, to
apply rate limits to pods by using Linux tc queues.
Be aware that the plugin is considered experimental as per the
[Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#support-traffic-shaping)
documentation and should be thoroughly tested before use in production environments.
-->
通常，節點上的所有 Pod 共享一個網路接口。
如果沒有網路 QoS，一些 Pod 可能會以犧牲其他 Pod 爲代價不公平地消耗可用帶寬。
Kubernetes [帶寬插件](https://www.cni.dev/plugins/current/meta/bandwidth/)爲網路創建
[擴展資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)，
以允許你使用 Kubernetes 的 resources 結構，即 requests 和 limits 設置。
通過使用 Linux tc 隊列將速率限制應用於 Pod。
請注意，根據[支持流量整形](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#support-traffic-shaping)文檔，
該插件被認爲是實驗性的，在生產環境中使用之前應該進行徹底的測試。

<!--
For storage QoS, you will likely want to create different storage classes or profiles with
different performance characteristics. Each storage profile can be associated with a different
tier of service that is optimized for different workloads such IO, redundancy, or throughput.
Additional logic might be necessary to allow the tenant to associate the appropriate storage
profile with their workload.
-->
對於存儲 QoS，你可能希望創建具有不同性能特徵的不同存儲類或設定文件。
每個存儲設定文件可以與不同的服務層相關聯，該服務層針對 IO、冗餘或吞吐量等不同的工作負載進行優化。
可能需要額外的邏輯來允許租戶將適當的存儲設定文件與其工作負載相關聯。

<!--
Finally, there’s [pod priority and preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
where you can assign priority values to pods. When scheduling pods, the scheduler will try
evicting pods with lower priority when there are insufficient resources to schedule pods that are
assigned a higher priority. If you have a use case where tenants have different service tiers in a
shared cluster e.g. free and paid, you may want to give higher priority to certain tiers using
this feature.
-->
最後，還有 [Pod 優先級和搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)，
你可以在其中爲 Pod 分配優先級值。
在調度 Pod 時，當沒有足夠的資源來調度分配了較高優先級的 Pod 時，
調度程序將嘗試驅逐具有較低優先級的 Pod。
如果你有一個用例，其中租戶在共享叢集中具有不同的服務層，例如免費和付費，
你可能希望使用此功能爲某些層級提供更高的優先級。

### DNS

<!--
Kubernetes clusters include a Domain Name System (DNS) service to provide translations from names
to IP addresses, for all Services and Pods. By default, the Kubernetes DNS service allows lookups
across all namespaces in the cluster.
-->
Kubernetes 叢集包括一個域名系統（DNS）服務，
可爲所有服務和 Pod 提供從名稱到 IP 地址的轉換。
默認情況下，Kubernetes DNS 服務允許在叢集中的所有命名空間中進行查找。

<!--
In multi-tenant environments where tenants can access pods and other Kubernetes resources, or where
stronger isolation is required, it may be necessary to prevent pods from looking up services in other
Namespaces.
You can restrict cross-namespace DNS lookups by configuring security rules for the DNS service.
For example, CoreDNS (the default DNS service for Kubernetes) can leverage Kubernetes metadata
to restrict queries to Pods and Services within a namespace. For more information, read an
[example](https://github.com/coredns/policy#kubernetes-metadata-multi-tenancy-policy) of
configuring this within the CoreDNS documentation.
-->
在多租戶環境中，租戶可以訪問 Pod 和其他 Kubernetes 資源，
或者在需要更強隔離的情況下，可能需要阻止 Pod 在其他名稱空間中查找服務。
你可以通過爲 DNS 服務設定安全規則來限制跨命名空間的 DNS 查找。
例如，CoreDNS（Kubernetes 的默認 DNS 服務）可以利用 Kubernetes
元數據來限制對命名空間內的 Pod 和服務的查詢。
有關更多信息，請閱讀 CoreDNS 文檔中設定此功能的
[示例](https://github.com/coredns/policy#kubernetes-metadata-multi-tenancy-policy)。

<!--
When a [Virtual Control Plane per tenant](#virtual-control-plane-per-tenant) model is used, a DNS
service must be configured per tenant or a multi-tenant DNS service must be used.
Here is an example of a [customized version of CoreDNS](https://github.com/kubernetes-sigs/cluster-api-provider-nested/blob/main/virtualcluster/doc/tenant-dns.md)
that supports multiple tenants.
-->
當使用[各租戶獨立虛擬控制面](#virtual-control-plane-per-tenant)模型時，
必須爲每個租戶設定 DNS 服務或必須使用多租戶 DNS 服務。參見一個
[CoreDNS 的定製版本](https://github.com/kubernetes-sigs/cluster-api-provider-nested/blob/main/virtualcluster/doc/tenant-dns.md)支持多租戶的示例。

### Operators

<!--
[Operators](/docs/concepts/extend-kubernetes/operator/) are Kubernetes controllers that manage
applications. Operators can simplify the management of multiple instances of an application, like
a database service, which makes them a common building block in the multi-consumer (SaaS)
multi-tenancy use case.
-->
[Operator 模式](/zh-cn/docs/concepts/extend-kubernetes/operator/)是管理應用的 Kubernetes 控制器。
Operator 可以簡化應用的多個實例的管理，例如數據庫服務，
這使它們成爲多消費者 (SaaS) 多租戶用例中的通用構建塊。

<!--
Operators used in a multi-tenant environment should follow a stricter set of guidelines.
Specifically, the Operator should:

* Support creating resources within different tenant namespaces, rather than just in the namespace
  in which the Operator is deployed.
* Ensure that the Pods are configured with resource requests and limits, to ensure scheduling and fairness.
* Support configuration of Pods for data-plane isolation techniques such as node isolation and
  sandboxed containers.
-->
在多租戶環境中使用 Operators 應遵循一套更嚴格的準則。具體而言，Operator 應：

* 支持在不同的租戶命名空間內創建資源，而不僅僅是在部署 Operator 的命名空間內。
* 確保 Pod 設定了資源請求和限制，以確保調度和公平。
* 支持節點隔離、沙箱容器等數據平面隔離技術的 Pod 設定。

<!--
## Implementations
-->
## 實現 {#implementations}

<!--
There are two primary ways to share a Kubernetes cluster for multi-tenancy: using Namespaces
(that is, a Namespace per tenant) or by virtualizing the control plane (that is, virtual control
plane per tenant).
-->
爲多租戶共享 Kubernetes 叢集有兩種主要方法：
使用命名空間（即每個租戶獨立的命名空間）
或虛擬化控制平面（即每個租戶獨立的虛擬控制平面）。

<!--
In both cases, data plane isolation, and management of additional considerations such as API
Priority and Fairness, is also recommended.
-->
在這兩種情況下，還建議對數據平面隔離和其他考慮事項，如 API 優先級和公平性，進行管理。

<!--
Namespace isolation is well-supported by Kubernetes, has a negligible resource cost, and provides
mechanisms to allow tenants to interact appropriately, such as by allowing service-to-service
communication. However, it can be difficult to configure, and doesn't apply to Kubernetes
resources that can't be namespaced, such as Custom Resource Definitions, Storage Classes, and Webhooks.
-->
Kubernetes 很好地支持命名空間隔離，其資源開銷可以忽略不計，並提供了允許租戶適當交互的機制，
例如允許服務之間的通信。
但是，它可能很難設定，而且不適用於非命名空間作用域的 Kubernetes 資源，例如自定義資源定義、存儲類和 Webhook 等。

<!--
Control plane virtualization allows for isolation of non-namespaced resources at the cost of
somewhat higher resource usage and more difficult cross-tenant sharing. It is a good option when
namespace isolation is insufficient but dedicated clusters are undesirable, due to the high cost
of maintaining them (especially on-prem) or due to their higher overhead and lack of resource
sharing. However, even within a virtualized control plane, you will likely see benefits by using
namespaces as well.
-->
控制平面虛擬化允許以更高的資源使用率和更困難的跨租戶共享爲代價隔離非命名空間作用域的資源。
當命名空間隔離不足但不希望使用專用叢集時，這是一個不錯的選擇，
因爲維護專用叢集的成本很高（尤其是本地叢集），
或者由於專用叢集的額外開銷較高且缺乏資源共享。
但是，即使在虛擬化控制平面中，你也可能會看到使用命名空間的好處。

<!--
The two options are discussed in more detail in the following sections.
-->
以下各節將更詳細地討論這兩個選項：

<!--
### Namespace per tenant
-->
### 每個租戶獨立的命名空間 {#namespace-per-tenant}

<!--
As previously mentioned, you should consider isolating each workload in its own namespace, even if
you are using dedicated clusters or virtualized control planes. This ensures that each workload
only has access to its own resources, such as ConfigMaps and Secrets, and allows you to tailor
dedicated security policies for each workload. In addition, it is a best practice to give each
namespace names that are unique across your entire fleet (that is, even if they are in separate
clusters), as this gives you the flexibility to switch between dedicated and shared clusters in
the future, or to use multi-cluster tooling such as service meshes.
-->
如前所述，你應該考慮將每個工作負載隔離在其自己的命名空間中，
即使你使用的是專用叢集或虛擬化控制平面。
這可確保每個工作負載只能訪問其自己的資源，例如 ConfigMap 和 Secret，
並允許你爲每個工作負載定製專用的安全策略。
此外，最佳實踐是爲整個叢集中的每個命名空間名稱提供唯一的名稱（即，即使它們位於單獨的叢集中），
因爲這使你將來可以靈活地在專用叢集和共享叢集之間切換，
或者使用多叢集工具，例如服務網格。

<!--
Conversely, there are also advantages to assigning namespaces at the tenant level, not just the
workload level, since there are often policies that apply to all workloads owned by a single
tenant. However, this raises its own problems. Firstly, this makes it difficult or impossible to
customize policies to individual workloads, and secondly, it may be challenging to come up with a
single level of "tenancy" that should be given a namespace. For example, an organization may have
divisions, teams, and subteams - which should be assigned a namespace?
-->
相反，在租戶級別分配命名空間也有優勢，而不僅僅是工作負載級別，
因爲通常有一些策略適用於單個租戶擁有的所有工作負載。
然而，這種方案也有自己的問題。
首先，這使得爲各個工作負載定製策略變得困難或不可能，
其次，確定應該賦予命名空間的單一級別的 “租戶” 可能很困難。
例如，一個組織可能有部門、團隊和子團隊 - 哪些應該分配一個命名空間？

<!--
One possible approach is to organize your namespaces into hierarchies, and share certain policies and
resources between them. This could include managing namespace labels, namespace lifecycles,
delegated access, and shared resource quotas across related namespaces. These capabilities can
be useful in both multi-team and multi-customer scenarios.
-->
一種可能的方法是將多個命名空間組織成層次結構，並在它們之間共享某些策略和資源。
這可以包括管理命名空間標籤、命名空間生命週期、委託訪問權限，以及在相關命名空間之間共享資源配額。
這些功能在多團隊和多客戶場景中都很有用。

<!--
### Virtual control plane per tenant
-->
### 每個租戶獨立的虛擬控制面    {#virtual-control-plane-per-tenant}

<!--
Another form of control-plane isolation is to use Kubernetes extensions to provide each tenant a
virtual control-plane that enables segmentation of cluster-wide API resources.
[Data plane isolation](#data-plane-isolation) techniques can be used with this model to securely
manage worker nodes across tenants.
-->
控制面隔離的另一種形式是使用 Kubernetes 擴展爲每個租戶提供一個虛擬控制面，
以實現叢集範圍內 API 資源的分段。
[數據平面隔離](#data-plane-isolation)技術可以與此模型一起使用，
以安全地跨多個租戶管理工作節點。

<!--
The virtual control plane based multi-tenancy model extends namespace-based multi-tenancy by
providing each tenant with dedicated control plane components, and hence complete control over
cluster-wide resources and add-on services. Worker nodes are shared across all tenants, and are
managed by a Kubernetes cluster that is normally inaccessible to tenants.
This cluster is often referred to as a _super-cluster_ (or sometimes as a _host-cluster_).
Since a tenant’s control-plane is not directly associated with underlying compute resources it is
referred to as a _virtual control plane_.
-->
基於虛擬控制面的多租戶模型通過爲每個租戶提供專用控制面組件來擴展基於命名空間的多租戶，
從而完全控制叢集範圍的資源和附加服務。
工作節點在所有租戶之間共享，並由租戶通常無法訪問的 Kubernetes 叢集管理。
該叢集通常被稱爲 **超叢集（Super-Cluster）**（或有時稱爲 **host-cluster**）。
由於租戶的控制面不直接與底層計算資源相關聯，因此它被稱爲**虛擬控制平面**。

<!--
A virtual control plane typically consists of the Kubernetes API server,
the controller manager, and the etcd data store.
It interacts with the super cluster via a metadata synchronization controller
which coordinates changes across tenant control planes and the control plane of the super-cluster.
-->
虛擬控制面通常由 Kubernetes API 伺服器、控制器管理器和 etcd 數據存儲組成。
它通過元數據同步控制器與超叢集交互，
該控制器跨租戶控制面和超叢集控制面對變化進行協調。

<!--
By using per-tenant dedicated control planes,
most of the isolation problems due to sharing one API server among all tenants are solved.
Examples include noisy neighbors in the control plane,
uncontrollable blast radius of policy misconfigurations,
and conflicts between cluster scope objects such as webhooks and CRDs.
Hence, the virtual control plane model is particularly suitable for cases
where each tenant requires access to a Kubernetes API server and expects the full cluster manageability.
-->
通過使用每個租戶單獨的專用控制面，可以解決由於所有租戶共享一個 API 伺服器而導致的大部分隔離問題。
例如，控制平面中的嘈雜鄰居、策略錯誤設定導致的不可控爆炸半徑以及如
Webhook 和 CRD 等叢集範圍對象之間的衝突。
因此，虛擬控制平面模型特別適用於每個租戶都需要訪問
Kubernetes API 伺服器並期望具有完整叢集可管理性的情況。

<!--
The improved isolation comes at the cost of running
and maintaining an individual virtual control plane per tenant.
In addition, per-tenant control planes do not solve isolation problems in the data plane,
such as node-level noisy neighbors or security threats.
These must still be addressed separately.
-->
改進的隔離是以每個租戶運行和維護一個單獨的虛擬控制平面爲代價的。
此外，租戶層面的控制面不能解決數據面的隔離問題，
例如節點級的嘈雜鄰居或安全威脅。這些仍然必須單獨解決。
