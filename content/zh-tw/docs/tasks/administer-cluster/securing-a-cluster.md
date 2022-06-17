---
title: 保護叢集
content_type: task
---
<!--
reviewers:
- smarterclayton
- liggitt
- ericchiang
- destijl
title: Securing a Cluster
content_type: task
-->

<!-- overview -->

<!--
This document covers topics related to protecting a cluster from accidental or malicious access
and provides recommendations on overall security.
-->
本文件涉及與保護叢集免受意外或惡意訪問有關的主題，並對總體安全性提出建議。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Controlling access to the Kubernetes API

As Kubernetes is entirely API-driven, controlling and limiting who can access the cluster and what actions
they are allowed to perform is the first line of defense.
-->
## 控制對 Kubernetes API 的訪問

因為 Kubernetes 是完全透過 API 驅動的，所以，控制和限制誰可以透過 API 訪問叢集，
以及允許這些訪問者執行什麼樣的 API 動作，就成為了安全控制的第一道防線。

<!--
### Use Transport Layer Security (TLS) for all API traffic

Kubernetes expects that all API communication in the cluster is encrypted by default with TLS, and the
majority of installation methods will allow the necessary certificates to be created and distributed to
the cluster components. Note that some components and installation methods may enable local ports over
HTTP and administrators should familiarize themselves with the settings of each component to identify
potentially unsecured traffic.
-->
### 為所有 API 互動使用傳輸層安全 （TLS）

Kubernetes 期望叢集中所有的 API 通訊在預設情況下都使用 TLS 加密，
大多數安裝方法也允許建立所需的證書並且分發到叢集元件中。
請注意，某些元件和安裝方法可能使用 HTTP 來訪問本地埠，
管理員應該熟悉每個元件的設定，以識別可能不安全的流量。

<!--
### API Authentication

Choose an authentication mechanism for the API servers to use that matches the common access patterns
when you install a cluster. For instance, small single-user clusters may wish to use a simple certificate
or static Bearer token approach. Larger clusters may wish to integrate an existing OIDC or LDAP server that
allow users to be subdivided into groups.

All API clients must be authenticated, even those that are part of the infrastructure like nodes,
proxies, the scheduler, and volume plugins. These clients are typically [service accounts](/docs/reference/access-authn-authz/service-accounts-admin/) or use x509 client certificates, and they are created automatically at cluster startup or are setup as part of the cluster installation.

Consult the [authentication reference document](/docs/reference/access-authn-authz/authentication/) for more information.
-->
### API 認證

安裝叢集時，選擇一個 API 伺服器的身份驗證機制，去使用與之匹配的公共訪問模式。
例如，小型的單使用者叢集可能希望使用簡單的證書或靜態承載令牌方法。
更大的叢集則可能希望整合現有的、OIDC、LDAP 等允許使用者分組的伺服器。

所有 API 客戶端都必須經過身份驗證，即使它是基礎設施的一部分，比如節點、代理、排程程式和卷外掛。
這些客戶端通常使用 [服務帳戶](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)
或 X509 客戶端證書，並在叢集啟動時自動建立或是作為叢集安裝的一部分進行設定。

如果你希望獲取更多資訊，請參考[認證參考文件](/zh-cn/docs/reference/access-authn-authz/authentication/)。

<!--
### API Authorization

Once authenticated, every API call is also expected to pass an authorization check. Kubernetes ships
an integrated [Role-Based Access Control (RBAC)](/docs/reference/access-authn-authz/rbac/) component that matches an incoming user or group to a
set of permissions bundled into roles. These permissions combine verbs (get, create, delete) with
resources (pods, services, nodes) and can be namespace-scoped or cluster-scoped. A set of out-of-the-box
roles are provided that offer reasonable default separation of responsibility depending on what
actions a client might want to perform. It is recommended that you use the
[Node](/docs/reference/access-authn-authz/node/) and
[RBAC](/docs/reference/access-authn-authz/rbac/) authorizers together, in combination with the
[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) admission plugin.
-->
### API 授權

一旦透過身份認證，每個 API 的呼叫都將透過鑑權檢查。
Kubernetes 整合[基於角色的訪問控制（RBAC）](/zh-cn/docs/reference/access-authn-authz/rbac/)元件，
將傳入的使用者或組與一組繫結到角色的許可權匹配。
這些許可權將動作（get、create、delete）和資源（Pod、Service、Node）進行組合，並可在名字空間或者叢集範圍生效。
Kubernetes 提供了一組可直接使用的角色，這些角色根據客戶可能希望執行的操作提供合理的責任劃分。
建議你同時使用 [Node](/zh-cn/docs/reference/access-authn-authz/node/) 和
[RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 兩個鑑權元件，再與
[NodeRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
准入外掛結合使用。

<!--
As with authentication, simple and broad roles may be appropriate for smaller clusters, but as
more users interact with the cluster, it may become necessary to separate teams into separate
{{< glossary_tooltip text="namespaces" term_id="namespace" >}} with more limited roles.
-->
與身份驗證一樣，簡單而廣泛的角色可能適合於較小的叢集，但是隨著更多的使用者與叢集互動，
可能需要將團隊劃分到有更多角色限制的、
單獨的{{< glossary_tooltip text="名字空間" term_id="namespace" >}}中去。

<!--
With authorization, it is important to understand how updates on one object may cause actions in
other places. For instance, a user may not be able to create pods directly, but allowing them to
create a deployment, which creates pods on their behalf, will let them create those pods
indirectly. Likewise, deleting a node from the API will result in the pods scheduled to that node
being terminated and recreated on other nodes. The out-of-the-box roles represent a balance
between flexibility and common use cases, but more limited roles should be carefully reviewed
to prevent accidental escalation. You can make roles specific to your use case if the out-of-box ones don't meet your needs.

Consult the [authorization reference section](/docs/reference/access-authn-authz/authorization/) for more information.
-->
就鑑權而言，很重要的一點是理解物件上的更新操作如何導致在其它地方發生對應行為。
例如，使用者可能不能直接建立 Pod，但允許他們透過建立 Deployment 來建立這些 Pod，
這將讓他們間接建立這些 Pod。
同樣地，從 API 刪除一個節點將導致排程到這些節點上的 Pod 被中止，並在其他節點上重新建立。
原生的角色設計代表了靈活性和常見用例之間的平衡，但須限制的角色應該被仔細審查，
以防止意外的許可權升級。如果內建的角色無法滿足你的需求，則可以根據使用場景需要建立特定的角色。

如果你希望獲取更多資訊，請參閱[鑑權參考](/zh-cn/docs/reference/access-authn-authz/authorization/)。

<!--
## Controlling access to the Kubelet

Kubelets expose HTTPS endpoints which grant powerful control over the node and containers. By default Kubelets allow unauthenticated access to this API.

Production clusters should enable Kubelet authentication and authorization.

Consult the [Kubelet authentication/authorization reference](/docs/reference/access-authn-authz/kubelet-authn-authz/)
for more information.
-->
## 控制對 Kubelet 的訪問

Kubelet 公開 HTTPS 端點，這些端點提供了對節點和容器的強大的控制能力。
預設情況下，Kubelet 允許對此 API 進行未經身份驗證的訪問。

生產級別的叢集應啟用 Kubelet 身份認證和授權。

進一步的資訊，請參考
[Kubelet 身份驗證/授權參考](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz/)。

<!--
## Controlling the capabilities of a workload or user at runtime

Authorization in Kubernetes is intentionally high level, focused on coarse actions on resources.
More powerful controls exist as **policies** to limit by use case how those objects act on the
cluster, themselves, and other resources.
-->
## 控制執行時負載或使用者的能力

Kubernetes 中的授權故意設計成較高抽象級別，側重於對資源的粗粒度行為。
更強大的控制是 **策略** 的形式呈現的，根據使用場景限制這些物件如何作用於叢集、自身和其他資源。

<!--
### Limiting resource usage on a cluster

[Resource quota](/docs/concepts/policy/resource-quotas/) limits the number or capacity of
resources granted to a namespace. This is most often used to limit the amount of CPU, memory,
or persistent disk a namespace can allocate, but can also control how many pods, services, or
volumes exist in each namespace.

[Limit ranges](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/) restrict the maximum or minimum size of some of the
resources above, to prevent users from requesting unreasonably high or low values for commonly
reserved resources like memory, or to provide default limits when none are specified.
-->
### 限制叢集上的資源使用

[資源配額（Resource Quota）](/zh-cn/docs/concepts/policy/resource-quotas/)限制了賦予名稱空間的資源的數量或容量。
資源配額通常用於限制名字空間可以分配的 CPU、記憶體或持久磁碟的數量，
但也可以控制每個名字空間中存在多少個 Pod、Service 或 Volume。

[限制範圍（Limit Range）](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
限制上述某些資源的最大值或者最小值，以防止使用者使用類似記憶體這樣的通用保留資源時請求不合理的過高或過低的值，
或者在沒有指定的情況下提供預設限制。

<!--
### Controlling what privileges containers run with

A pod definition contains a [security context](/docs/tasks/configure-pod-container/security-context/)
that allows it to request access to run as a specific Linux user on a node (like root),
access to run privileged or access the host network, and other controls that would otherwise
allow it to run unfettered on a hosting node.

You can configure [Pod security admission](/docs/concepts/security/pod-security-admission/)
to enforce use of a particular [Pod Security Standard](/docs/concepts/security/pod-security-standards/)
in a {{< glossary_tooltip text="namespace" term_id="namespace" >}}, or to detect breaches.
-->
### 控制容器執行的特權

Pod 定義包含了一個[安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)，
用於描述一些訪問請求，如以某個節點上的特定 Linux 使用者（如 root）身份執行，
以特權形式執行，訪問主機網路，以及一些在宿主節點上不受約束地執行的其它控制權限等等。

你可以配置 [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)來在某個
{{< glossary_tooltip text="名字空間" term_id="namespace" >}}中
強制實施特定的
[Pod 安全標準（Pod Security Standard）](/zh-cn/docs/concepts/security/pod-security-standards/)，
或者檢查安全上的缺陷。

<!--
Generally, most application workloads need limited access to host resources so they can
successfully run as a root process (uid 0) without access to host information. However,
considering the privileges associated with the root user, you should write application
containers to run as a non-root user. Similarly, administrators who wish to prevent
client applications from escaping their containers should apply the **Baseline**
or **Restricted** Pod Security Standard.
-->
一般來說，大多數應用程式需要對主機資源的有限制的訪問，
這樣它們可以在不訪問主機資訊的情況下，成功地以 root 賬號（UID 0）執行。
但是，考慮到與 root 使用者相關的特權，在編寫應用程式容器時，你應該使用非 root 使用者執行。
類似地，希望阻止客戶端應用程式從其容器中逃逸的管理員，應該應用 **Baseline**
或 **Restricted** Pod 安全標準。

<!--
### Restricting network access

The [network policies](/docs/tasks/administer-cluster/declare-network-policy/) for a namespace
allows application authors to restrict which pods in other namespaces may access pods and ports
within their namespaces. Many of the supported [Kubernetes networking providers](/docs/concepts/cluster-administration/networking/)
now respect network policy.
-->
### 限制網路訪問

基於名字空間的[網路策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)
允許應用程式作者限制其它名字空間中的哪些 Pod 可以訪問自身名字空間內的 Pod 和埠。
現在已經有許多支援網路策略的
[Kubernetes 網路驅動](/zh-cn/docs/concepts/cluster-administration/networking/)。

<!--
Quota and limit ranges can also be used to control whether users may request node ports or
load-balanced services, which on many clusters can control whether those users applications
are visible outside of the cluster.

Additional protections may be available that control network rules on a per-plugin or per-
environment basis, such as per-node firewalls, physically separating cluster nodes to
prevent cross talk, or advanced networking policy.
-->
配額（Quota）和限制範圍（Limit Range）也可用於控制使用者是否可以請求節點埠或負載均衡服務。
在很多叢集上，節點埠和負載均衡服務也可控制使用者的應用程式是否在叢集之外可見。

此外也可能存在一些基於外掛或基於環境的網路規則，能夠提供額外的保護能力。
例如各節點上的防火牆、物理隔離叢集節點以防止串擾或者高階的網路策略等。

<!--
### Restricting cloud metadata API access

Cloud platforms (AWS, Azure, GCE, etc.) often expose metadata services locally to instances.
By default these APIs are accessible by pods running on an instance and can contain cloud
credentials for that node, or provisioning data such as kubelet credentials. These credentials
can be used to escalate within the cluster or to other cloud services under the same account.

When running Kubernetes on a cloud platform, limit permissions given to instance credentials, use
[network policies](/docs/tasks/administer-cluster/declare-network-policy/) to restrict pod access
to the metadata API, and avoid using provisioning data to deliver secrets.
-->
### 限制雲元資料 API 訪問

雲平臺（AWS、Azure、GCE 等）經常將 metadata 本地服務暴露給例項。
預設情況下，這些 API 可由執行在例項上的 Pod 訪問，並且可以包含
該雲節點的憑據或配置資料（如 kubelet 憑據）。
這些憑據可以用於在叢集內升級或在同一賬戶下升級到其他雲服務。

在雲平臺上執行 Kubernetes 時，需要限制對例項憑據的許可權，使用
[網路策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)
限制 Pod 對元資料 API 的訪問，並避免使用配置資料來傳遞機密資訊。

<!--
### Controlling which nodes pods may access

By default, there are no restrictions on which nodes may run a pod.  Kubernetes offers a
[rich set of policies for controlling placement of pods onto nodes](/docs/concepts/scheduling-eviction/assign-pod-node/)
and the [taint-based pod placement and eviction](/docs/concepts/scheduling-eviction/taint-and-toleration/)
that are available to end users. For many clusters use of these policies to separate workloads
can be a convention that authors adopt or enforce via tooling.

As an administrator, a beta admission plugin `PodNodeSelector` can be used to force pods
within a namespace to default or require a specific node selector, and if end users cannot
alter namespaces, this can strongly limit the placement of all of the pods in a specific workload.
-->
### 控制 Pod 可以訪問的節點

預設情況下，對 Pod 可以執行在哪些節點上是沒有任何限制的。
Kubernetes 給終端使用者提供了
一組豐富的策略用於[控制 Pod 所放置的節點位置](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)，
以及[基於汙點的 Pod 放置和驅逐](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
對於許多叢集，使用這些策略來分離工作負載可以作為一種約定，要求作者遵守或者透過工具強制。

對於管理員，Beta 階段的准入外掛 `PodNodeSelector` 可用於強制某名字空間中的 Pod
使用預設的或特定的節點選擇算符。
如果終端使用者無法改變名字空間，這一機制可以有效地限制特定工作負載中所有 Pod 的放置位置。

<!--
## Protecting cluster components from compromise

This section describes some common patterns for protecting clusters from compromise.
-->
## 保護叢集元件免受破壞

本節描述保護叢集免受破壞的一些常用模式。

<!--
### Restrict access to etcd

Write access to the etcd backend for the API is equivalent to gaining root on the entire cluster,
and read access can be used to escalate fairly quickly. Administrators should always use strong
credentials from the API servers to their etcd server, such as mutual auth via TLS client certificates,
and it is often recommended to isolate the etcd servers behind a firewall that only the API servers
may access.

{{< caution >}}
Allowing other components within the cluster to access the master etcd instance with
read or write access to the full keyspace is equivalent to granting cluster-admin access. Using
separate etcd instances for non-master components or using etcd ACLs to restrict read and write
access to a subset of the keyspace is strongly recommended.
{{< /caution >}}
-->
### 限制訪問 etcd

擁有對 API 的 etcd 後端的寫訪問許可權相當於獲得了整個叢集的 root 許可權，
讀訪問許可權也可能被利用，實現相當快速的許可權提升。
對於從 API 伺服器訪問其 etcd 伺服器，管理員應該總是使用比較強的憑證，如透過 TLS
客戶端證書來實現雙向認證。
通常，我們建議將 etcd 伺服器隔離到只有 API 伺服器可以訪問的防火牆後面。

{{< caution >}}
允許叢集中其它元件對整個主鍵空間（keyspace）擁有讀或寫許可權去訪問 etcd 例項，
相當於授予這些元件叢集管理員的訪問許可權。
對於非主控元件，強烈推薦使用不同的 etcd 例項，或者使用 etcd 的訪問控制列表
來限制這些元件只能讀或寫主鍵空間的一個子集。
{{< /caution >}}

<!--
### Enable audit logging

The [audit logger](/docs/tasks/debug/debug-cluster/audit/) is a beta feature that records actions taken by the
API for later analysis in the event of a compromise. It is recommended to enable audit logging
and archive the audit file on a secure server.
-->
### 啟用審計日誌

[審計日誌](/zh-cn/docs/tasks/debug/debug-cluster/audit/)是 Beta 特性，
負責記錄 API 操作以便在發生破壞時進行事後分析。
建議啟用審計日誌，並將審計檔案歸檔到安全伺服器上。

<!--
### Restrict access to alpha or beta features

Alpha and beta Kubernetes features are in active development and may have limitations or bugs
that result in security vulnerabilities. Always assess the value an alpha or beta feature may
provide against the possible risk to your security posture. When in doubt, disable features you
do not use.
-->
### 限制使用 alpha 和 beta 特性

Kubernetes 的 alpha 和 beta 特性還在努力開發中，可能存在導致安全漏洞的缺陷或錯誤。
要始終評估 alpha 和 beta 特性可能給你的安全態勢帶來的風險。
當你懷疑存在風險時，可以禁用那些不需要使用的特性。

<!--
### Rotate infrastructure credentials frequently

The shorter the lifetime of a secret or credential the harder it is for an attacker to make
use of that credential. Set short lifetimes on certificates and automate their rotation. Use
an authentication provider that can control how long issued tokens are available and use short
lifetimes where possible. If you use service-account tokens in external integrations, plan to
rotate those tokens frequently. For example, once the bootstrap phase is complete, a bootstrap
token used for setting up nodes should be revoked or its authorization removed.
-->
### 經常輪換基礎設施證書

一項機密資訊或憑據的生命期越短，攻擊者就越難使用該憑據。
在證書上設定較短的生命期並實現自動輪換是控制安全的一個好方法。
使用身份驗證提供程式時，應該使用那些可以控制所釋出令牌的合法時長的提供程式，
並儘可能設定較短的生命期。
如果在外部整合場景中使用服務帳戶令牌，則應該經常性地輪換這些令牌。
例如，一旦引導階段完成，就應該撤銷用於配置節點的引導令牌，或者取消它的授權。

<!--
### Review third party integrations before enabling them

Many third party integrations to Kubernetes may alter the security profile of your cluster. When
enabling an integration, always review the permissions that an extension requests before granting
it access. For example, many security integrations may request access to view all secrets on
your cluster which is effectively making that component a cluster admin. When in doubt,
restrict the integration to functioning in a single namespace if possible.

Components that create pods may also be unexpectedly powerful if they can do so inside namespaces
like the `kube-system` namespace, because those pods can gain access to service account secrets
or run with elevated permissions if those service accounts are granted access to permissive
[PodSecurityPolicies](/docs/concepts/security/pod-security-policy/).
-->
### 在啟用第三方整合之前，請先審查它們

許多整合到 Kubernetes 的第三方軟體或服務都可能改變你的叢集的安全配置。
啟用整合時，在授予訪問許可權之前，你應該始終檢查擴充套件所請求的許可權。
例如，許多安全性整合中可能要求檢視叢集上的所有 Secret 的訪問許可權，
本質上該元件便成為了叢集的管理員。
當有疑問時，如果可能的話，將要整合的元件限制在某指定名字空間中執行。

如果執行 Pod 建立操作的元件能夠在 `kube-system` 這類名字空間中建立 Pod，
則這類元件也可能獲得意外的許可權，因為這些 Pod 可以訪問服務賬戶的 Secret，
或者，如果對應服務帳戶被授權訪問寬鬆的
[PodSecurityPolicy](/zh-cn/docs/concepts/security/pod-security-policy/)，
它們就能以較高的許可權執行。

<!--
If you use [Pod Security admission](/docs/concepts/security/pod-security-admission/) and allow
any component to create Pods within a namespace that permits privileged Pods, those Pods may
be able to escape their containers and use this widened access to elevate their privileges.
-->
如果你使用 [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)，
並且允許任何元件在一個允許執行特權 Pod 的名字空間中建立 Pod，這些 Pod
就可能從所在的容器中逃逸，利用被拓寬的訪問許可權來實現特權提升。

<!--
You should not allow untrusted components to create Pods in any system namespace (those with
names that start with `kube-`) nor in any namespace where that access grant allows the possibility
of privilege escalation.
-->
你不應該允許不可信的元件在任何系統名字空間（名字以 `kube-` 開頭）中建立 Pod，
也不允許它們在訪問許可權授權可被利用來提升特權的名字空間中建立 Pod。

<!--
### Encrypt secrets at rest

In general, the etcd database will contain any information accessible via the Kubernetes API
and may grant an attacker significant visibility into the state of your cluster. Always encrypt
your backups using a well reviewed backup and encryption solution, and consider using full disk
encryption where possible.

Kubernetes supports [encryption at rest](/docs/tasks/administer-cluster/encrypt-data/), a feature 
introduced in 1.7, and beta since 1.13. This will encrypt `Secret` resources in etcd, preventing
parties that gain access to your etcd backups from viewing the content of those secrets. While
this feature is currently beta, it offers an additional level of defense when backups
are not encrypted or an attacker gains read access to etcd.
-->
### 對 Secret 進行靜態加密

一般情況下，etcd 資料庫包含了透過 Kubernetes API 可以訪問到的所有資訊，
並且可能為攻擊者提供對你的叢集的狀態的較多的可見性。
你要始終使用經過充分審查的備份和加密方案來加密備份資料，
並考慮在可能的情況下使用全盤加密。

Kubernetes 支援[靜態資料加密](/zh-cn/docs/tasks/administer-cluster/encrypt-data/)。
該功能在 1.7 版本引入，並在 1.13 版本成為 Beta。
它會加密 etcd 裡面的 `Secret` 資源，以防止某一方透過檢視 etcd 的備份檔案檢視到這些
Secret 的內容。雖然目前該功能還只是 Beta 階段，
在備份未被加密或者攻擊者獲取到 etcd 的讀訪問許可權時，它仍能提供額外的防禦層級。

<!--
### Receiving alerts for security updates and reporting vulnerabilities

Join the [kubernetes-announce](https://groups.google.com/forum/#!forum/kubernetes-announce)
group for emails about security announcements. See the
[security reporting](/docs/reference/issues-security/security/)
page for more on how to report vulnerabilities.
-->
### 接收安全更新和報告漏洞的警報

請加入 [kubernetes-announce](https://groups.google.com/forum/#!forum/kubernetes-announce)
組，這樣你就能夠收到有關安全公告的郵件。有關如何報告漏洞的更多資訊，
請參見[安全報告](/zh-cn/docs/reference/issues-security/security/)頁面。

