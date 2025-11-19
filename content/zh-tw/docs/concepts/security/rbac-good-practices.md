---
title: 基於角色的訪問控制良好實踐
description: >
  爲集羣操作人員提供的良好的 RBAC 設計原則和實踐。
content_type: concept
weight: 60
---

<!--
reviewers:
title: Role Based Access Control Good Practices
description: >
  Principles and practices for good RBAC design for cluster operators.
content_type: concept
weight: 60
-->

<!-- overview -->

<!--
Kubernetes {{< glossary_tooltip text="RBAC" term_id="rbac" >}} is a key security control
to ensure that cluster users and workloads have only the access to resources required to
execute their roles. It is important to ensure that, when designing permissions for cluster
users, the cluster administrator understands the areas where privilge escalation could occur,
to reduce the risk of excessive access leading to security incidents.

The good practices laid out here should be read in conjunction with the general
[RBAC documentation](/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update).
-->

Kubernetes {{< glossary_tooltip text="RBAC" term_id="rbac" >}}
是一項重要的安全控制措施，用於保證集羣用戶和工作負載只能訪問履行自身角色所需的資源。
在爲集羣用戶設計權限時，請務必確保集羣管理員知道可能發生特權提級的地方，
降低因過多權限而導致安全事件的風險。

此文檔的良好實踐應該與通用
[RBAC 文檔](/zh-cn/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update)一起閱讀。

<!-- body -->

<!--
## General good practice

### Least privilege
-->
## 通用的良好實踐 {#general-good-practice}

### 最小特權  {#least-privilege}

<!--
Ideally, minimal RBAC rights should be assigned to users and service accounts. Only permissions
explicitly required for their operation should be used. While each cluster will be different,
some general rules that can be applied are :
-->
理想情況下，分配給用戶和服務帳戶的 RBAC 權限應該是最小的。
僅應使用操作明確需要的權限，雖然每個集羣會有所不同，但可以應用的一些常規規則：

<!--
 - Assign permissions at the namespace level where possible. Use RoleBindings as opposed to
   ClusterRoleBindings to give users rights only within a specific namespace.
 - Avoid providing wildcard permissions when possible, especially to all resources.
   As Kubernetes is an extensible system, providing wildcard access gives rights
   not just to all object types that currently exist in the cluster, but also to all object types
   which are created in the future.
 - Administrators should not use `cluster-admin` accounts except where specifically needed.
   Providing a low privileged account with
   [impersonation rights](/docs/reference/access-authn-authz/authentication/#user-impersonation)
   can avoid accidental modification of cluster resources.
 - Avoid adding users to the `system:masters` group. Any user who is a member of this group
   bypasses all RBAC rights checks and will always have unrestricted superuser access, which cannot be
   revoked by removing RoleBindings or ClusterRoleBindings. As an aside, if a cluster is
   using an authorization webhook, membership of this group also bypasses that webhook (requests
   from users who are members of that group are never sent to the webhook)
-->
- 儘可能在命名空間級別分配權限。授予用戶在特定命名空間中的權限時使用 RoleBinding
  而不是 ClusterRoleBinding。
- 儘可能避免通過通配符設置權限，尤其是對所有資源的權限。
  由於 Kubernetes 是一個可擴展的系統，因此通過通配符來授予訪問權限不僅會授予集羣中當前的所有對象類型，
  還包含所有未來被創建的所有對象類型。
- 管理員不應使用 `cluster-admin` 賬號，除非特別需要。爲低特權帳戶提供
  [僞裝權限](/zh-cn/docs/reference/access-authn-authz/authentication/#user-impersonation)
  可以避免意外修改集羣資源。
- 避免將用戶添加到 `system:masters` 組。任何屬於此組成員的用戶都會繞過所有 RBAC 權限檢查，
  始終具有不受限制的超級用戶訪問權限，並且不能通過刪除 `RoleBinding` 或 `ClusterRoleBinding`
  來取消其權限。順便說一句，如果集羣使用 Webhook 鑑權，此組的成員身份也會繞過該
  Webhook（來自屬於該組成員的用戶的請求永遠不會發送到 Webhook）。

<!--
### Minimize distribution of privileged tokens
-->
### 最大限度地減少特權令牌的分發 {#minimize-distribution-of-privileged-tokens}

<!--
Ideally, pods shouldn't be assigned service accounts that have been granted powerful permissions
(for example, any of the rights listed under [privilege escalation risks](#privilege-escalation-risks)).
In cases where a workload requires powerful permissions, consider the following practices:

- Limit the number of nodes running powerful pods. Ensure that any DaemonSets you run
  are necessary and are run with least privilege to limit the blast radius of container escapes.
- Avoid running powerful pods alongside untrusted or publicly-exposed ones. Consider using 
  [Taints and Toleration](/docs/concepts/scheduling-eviction/taint-and-toleration/),
  [NodeAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity), or
  [PodAntiAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
  to ensure pods don't run alongside untrusted or less-trusted Pods. Pay especial attention to
  situations where less-trustworthy Pods are not meeting the **Restricted** Pod Security Standard.
-->
理想情況下，不應爲 Pod 分配具有強大權限（例如，在[特權提級的風險](#privilege-escalation-risks)中列出的任一權限）
的服務帳戶。如果工作負載需要比較大的權限，請考慮以下做法：

- 限制運行此類 Pod 的節點數量。確保你運行的任何 DaemonSet 都是必需的，
  並且以最小權限運行，以限制容器逃逸的影響範圍。
- 避免將此類 Pod 與不可信任或公開的 Pod 在一起運行。
  考慮使用[污點和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)、
  [節點親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)或
  [Pod 反親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)確保
  Pod 不會與不可信或不太受信任的 Pod 一起運行。
  特別注意可信度不高的 Pod 不符合 **Restricted** Pod 安全標準的情況。

<!--
### Hardening

Kubernetes defaults to providing access which may not be required in every cluster. Reviewing
the RBAC rights provided by default can provide opportunities for security hardening.
In general, changes should not be made to rights provided to `system:` accounts some options
to harden cluster rights exist:
-->
### 加固 {#hardening}

Kubernetes 默認提供訪問權限並非是每個集羣都需要的。
審查默認提供的 RBAC 權限爲安全加固提供了機會。
一般來說，不應該更改 `system:` 帳戶的某些權限，有一些方式來強化現有集羣的權限：

<!--
- Review bindings for the `system:unauthenticated` group and remove them where possible, as this gives 
  access to anyone who can contact the API server at a network level.
- Avoid the default auto-mounting of service account tokens by setting
  `automountServiceAccountToken: false`. For more details, see
  [using default service account token](/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server).
  Setting this value for a Pod will overwrite the service account setting, workloads
  which require service account tokens can still mount them.
-->
- 審查 `system:unauthenticated` 組的綁定，並在可能的情況下將其刪除，
  因爲這會給所有能夠訪問 API 服務器的人以網絡級別的權限。
- 通過設置 `automountServiceAccountToken: false` 來避免服務賬號令牌的默認自動掛載，
  有關更多詳細信息，請參閱[使用默認服務賬號令牌](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)。
  此參數可覆蓋 Pod 服務賬號設置，而需要服務賬號令牌的工作負載仍可以掛載。

<!--
### Periodic review

It is vital to periodically review the Kubernetes RBAC settings for redundant entries and
possible privilege escalations.
If an attacker is able to create a user account with the same name as a deleted user,
they can automatically inherit all the rights of the deleted user, specially the
rights assigned to that user.
 -->
### 定期檢查  {#periodic-review}

定期檢查 Kubernetes RBAC 設置是否有冗餘條目和提權可能性是至關重要的。
如果攻擊者能夠創建與已刪除用戶同名的用戶賬號，
他們可以自動繼承被刪除用戶的所有權限，尤其是分配給該用戶的權限。

<!--
## Kubernetes RBAC - privilege escalation risks {#privilege-escalation-risks}

Within Kubernetes RBAC there are a number of privileges which, if granted, can allow a user or a service account
to escalate their privileges in the cluster or affect systems outside the cluster.

This section is intended to provide visibility of the areas where cluster operators
should take care, to ensure that they do not inadvertently allow for more access to clusters than intended.
-->
## Kubernetes RBAC - 權限提權的風險 {#privilege-escalation-risks}

在 Kubernetes RBAC 中有許多特權，如果被授予，
用戶或服務帳戶可以提升其在集羣中的權限並可能影響集羣外的系統。

本節旨在提醒集羣操作員需要注意的不同領域，
以確保他們不會無意中授予超出預期的集羣訪問權限。

<!--
### Listing secrets

It is generally clear that allowing `get` access on Secrets will allow a user to read their contents.
It is also important to note that `list` and `watch` access also effectively allow for users to reveal the Secret contents.
For example, when a List response is returned (for example, via `kubectl get secrets -A -o yaml`), the response
includes the contents of all Secrets.
-->
### 列舉 Secret {#listing-secrets}

大家都很清楚，若允許對 Secrets 執行 `get` 訪問，用戶就獲得了訪問 Secret 內容的能力。
同樣需要注意的是：`list` 和 `watch` 訪問也會授權用戶獲取 Secret 的內容。
例如，當返回 List 響應時（例如，通過
`kubectl get secrets -A -o yaml`），響應包含所有 Secret 的內容。

<!--
### Workload creation

Permission to create workloads (either Pods, or
[workload resources](/docs/concepts/workloads/controllers/) that manage Pods) in a namespace
implicitly grants access to many other resources in that namespace, such as Secrets, ConfigMaps, and
PersistentVolumes that can be mounted in Pods. Additionally, since Pods can run as any
[ServiceAccount](/docs/reference/access-authn-authz/service-accounts-admin/), granting permission
to create workloads also implicitly grants the API access levels of any service account in that
namespace.
-->
### 工作負載的創建 {#workload-creation}

在一個命名空間中創建工作負載（Pod 或管理 Pod 的[工作負載資源](/zh-cn/docs/concepts/workloads/controllers/)）
的權限隱式地授予了對該命名空間中許多其他資源的訪問權限，例如可以掛載在
Pod 中的 Secret、ConfigMap 和 PersistentVolume。
此外，由於 Pod 可以被任何[服務賬號](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)運行，
因此授予創建工作負載的權限也會隱式地授予該命名空間中任何服務賬號的 API 訪問級別。

<!--
Users who can run privileged Pods can use that access to gain node access and potentially to
further elevate their privileges. Where you do not fully trust a user or other principal
with the ability to create suitably secure and isolated Pods, you should enforce either the
**Baseline** or **Restricted** Pod Security Standard.
You can use [Pod Security admission](/docs/concepts/security/pod-security-admission/)
or other (third party) mechanisms to implement that enforcement.
-->
可以運行特權 Pod 的用戶可以利用該訪問權限獲得節點訪問權限，
並可能進一步提升他們的特權。如果你不完全信任某用戶或其他主體，
不相信他們能夠創建比較安全且相互隔離的 Pod，你應該強制實施 **Baseline**
或 **Restricted** Pod 安全標準。你可以使用
[Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)或其他（第三方）
機制來強制實施這些限制。

<!-- 
For these reasons, namespaces should be used to separate resources requiring different levels of
trust or tenancy. It is still considered best practice to follow [least privilege](#least-privilege)
principles and assign the minimum set of permissions, but boundaries within a namespace should be
considered weak.
-->
出於這些原因，命名空間應該用於隔離不同的信任級別或不同租戶所需的資源。
遵循[最小特權](#least-privilege)原則並分配最小權限集仍被認爲是最佳實踐，
但命名空間內的邊界概念應視爲比較弱。

<!--
### Persistent volume creation

If someone - or some application - is allowed to create arbitrary PersistentVolumes, that access
includes the creation of `hostPath` volumes, which then means that a Pod would get access
to the underlying host filesystem(s) on the associated node. Granting that ability is a security risk.
-->
### 持久卷的創建 {#persistent-volume-creation}

如果允許某人或某個應用創建任意的 PersistentVolume，則這種訪問權限包括創建 `hostPath` 卷，
這意味着 Pod 將可以訪問對應節點上的下層主機文件系統。授予該能力會帶來安全風險。

<!--
There are many ways a container with unrestricted access to the host filesystem can escalate privileges, including
reading data from other containers, and abusing the credentials of system services, such as Kubelet.

You should only allow access to create PersistentVolume objects for:
-->
不受限制地訪問主機文件系統的容器可以通過多種方式提升特權，包括從其他容器讀取數據以及濫用系統服務
（例如 kubelet）的憑據。

你應該只允許以下實體具有創建 PersistentVolume 對象的訪問權限：

<!--
- Users (cluster operators) that need this access for their work, and who you trust,
- The Kubernetes control plane components which creates PersistentVolumes based on PersistentVolumeClaims
  that are configured for automatic provisioning.
  This is usually setup by the Kubernetes provider or by the operator when installing a CSI driver.
-->
- 需要此訪問權限才能工作的用戶（集羣操作員）以及你信任的人，
- Kubernetes 控制平面組件，這些組件基於已配置爲自動製備的 PersistentVolumeClaim 創建 PersistentVolume。
  這通常由 Kubernetes 提供商或操作員在安裝 CSI 驅動程序時進行設置。

<!--
Where access to persistent storage is required trusted administrators should create
PersistentVolumes, and constrained users should use PersistentVolumeClaims to access that storage.
-->
在需要訪問持久存儲的地方，受信任的管理員應創建 PersistentVolume，而受約束的用戶應使用
PersistentVolumeClaim 來訪問該存儲。

<!--
### Access to `proxy` subresource of Nodes

Users with access to the proxy sub-resource of node objects have rights to the Kubelet API,
which allows for command execution on every pod on the node(s) to which they have rights.
This access bypasses audit logging and admission control, so care should be taken before
granting rights to this resource.
-->
### 訪問 Node 的 `proxy` 子資源  {#access-to-proxy-subresource-of-nodes}

有權訪問 Node 對象的 proxy 子資源的用戶有權訪問 kubelet API，
這允許在他們有權訪問的節點上的所有 Pod 上執行命令。
此訪問繞過審計日誌記錄和准入控制，因此在授予對此資源的權限前應小心。

<!--
### Escalate verb

Generally, the RBAC system prevents users from creating clusterroles with more rights than the user possesses.
The exception to this is the `escalate` verb. As noted in the [RBAC documentation](/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update),
users with this right can effectively escalate their privileges.
-->
### esclate 動詞 {#escalate-verb}

通常，RBAC 系統會阻止用戶創建比他所擁有的更多權限的 `ClusterRole`。
而 `escalate` 動詞是個例外。如
[RBAC 文檔](/zh-cn/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update)
中所述，擁有此權限的用戶可以有效地提升他們的權限。

<!--
### Bind verb

Similar to the `escalate` verb, granting users this right allows for the bypass of Kubernetes
in-built protections against privilege escalation, allowing users to create bindings to
roles with rights they do not already have.
-->
### bind 動詞  {#bind-verb}

與 `escalate` 動作類似，授予此權限的用戶可以繞過 Kubernetes
對權限提升的內置保護，用戶可以創建並綁定尚不具有的權限的角色。

<!--
### Impersonate verb

This verb allows users to impersonate and gain the rights of other users in the cluster.
Care should be taken when granting it, to ensure that excessive permissions cannot be gained
via one of the impersonated accounts.
-->
### impersonate 動詞 {#impersonate-verb}

此動詞允許用戶僞裝並獲得集羣中其他用戶的權限。
授予它時應小心，以確保通過其中一個僞裝賬號不會獲得過多的權限。

<!--
### CSRs and certificate issuing

The CSR API allows for users with `create` rights to CSRs and `update` rights on `certificatesigningrequests/approval`
where the signer is `kubernetes.io/kube-apiserver-client` to create new client certificates
which allow users to authenticate to the cluster. Those client certificates can have arbitrary
names including duplicates of Kubernetes system components. This will effectively allow for privilege escalation.
-->
### CSR 和證書頒發 {#csrs-and-certificate-issuing}

CSR API 允許用戶擁有 `create` CSR 的權限和 `update`
`certificatesigningrequests/approval` 的權限，
其中籤名者是 `kubernetes.io/kube-apiserver-client`，
通過此簽名創建的客戶端證書允許用戶向集羣進行身份驗證。
這些客戶端證書可以包含任意的名稱，包括 Kubernetes 系統組件的副本。
這將有利於特權提級。

<!--
### Token request

Users with `create` rights on `serviceaccounts/token` can create TokenRequests to issue
tokens for existing service accounts.
-->
### 令牌請求 {#token-request}

擁有 `serviceaccounts/token` 的 `create` 權限的用戶可以創建
TokenRequest 來發布現有服務帳戶的令牌。

<!--
### Control admission webhooks

Users with control over `validatingwebhookconfigurations` or `mutatingwebhookconfigurations`
can control webhooks that can read any object admitted to the cluster, and in the case of
mutating webhooks, also mutate admitted objects.
-->
### 控制准入 Webhook {#control-admission-webhooks}

可以控制 `validatingwebhookconfigurations` 或 `mutatingwebhookconfigurations`
的用戶可以控制能讀取任何允許進入集羣的對象的 webhook，
並且在有變更 webhook 的情況下，還可以變更准入的對象。

<!--
### Namespace modification

Users who can perform **patch** operations on Namespace objects (through a namespaced RoleBinding to a Role with that access) can modify
labels on that namespace. In clusters where Pod Security Admission is used, this may allow a user to configure the namespace
for a more permissive policy than intended by the administrators.
For clusters where NetworkPolicy is used, users may be set labels that indirectly allow
access to services that an administrator did not intend to allow.
-->
### 命名空間修改 {#namespace-modification}
可以對命名空間對象執行 **patch** 操作的用戶（通過命名空間內的 RoleBinding 關聯到具有該權限的 Role），
可以修改該命名空間的標籤。在使用 Pod 安全准入的集羣中，這可能允許用戶將命名空間配置爲比管理員預期更寬鬆的策略。
對於使用 NetworkPolicy 的集羣，用戶所設置的標籤可能間接導致對某些本不應被允許訪問的服務的訪問權限被開放。

<!--
## Kubernetes RBAC - denial of service risks {#denial-of-service-risks}

### Object creation denial-of-service {#object-creation-dos}

Users who have rights to create objects in a cluster may be able to create sufficient large 
objects to create a denial of service condition either based on the size or number of objects, as discussed in
[etcd used by Kubernetes is vulnerable to OOM attack](https://github.com/kubernetes/kubernetes/issues/107325). This may be
specifically relevant in multi-tenant clusters if semi-trusted or untrusted users 
are allowed limited access to a system.

One option for mitigation of this issue would be to use
[resource quotas](/docs/concepts/policy/resource-quotas/#object-count-quota)
to limit the quantity of objects which can be created.
-->
## Kubernetes RBAC - 拒絕服務攻擊的風險 {#denial-of-service-risks}

### 對象創建拒絕服務 {#object-creation-dos}

有權在集羣中創建對象的用戶根據創建對象的大小和數量可能會創建足夠大的對象，
產生拒絕服務狀況，如 [Kubernetes 使用的 etcd 容易受到 OOM 攻擊](https://github.com/kubernetes/kubernetes/issues/107325)中的討論。
允許太不受信任或者不受信任的用戶對系統進行有限的訪問在多租戶集羣中是特別重要的。

緩解此問題的一種選擇是使用[資源配額](/zh-cn/docs/concepts/policy/resource-quotas/#object-count-quota)以限制可以創建的對象數量。

## {{% heading "whatsnext" %}}

<!--
* To learn more about RBAC, see the [RBAC documentation](/docs/reference/access-authn-authz/rbac/).
-->

* 瞭解有關 RBAC 的更多信息，請參閱 [RBAC 文檔](/zh-cn/docs/reference/access-authn-authz/rbac/)。
