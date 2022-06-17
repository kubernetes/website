---
title: 基於角色的訪問控制良好實踐
description: >
  為叢集操作人員提供的良好的 RBAC 設計原則和實踐。
content_type: concept
---

<!--
reviewers:
title: Role Based Access Control Good Practices
description: >
  Principles and practices for good RBAC design for cluster operators.
content_type: concept
-->

<!-- overview -->

<!--
Kubernetes {{< glossary_tooltip text="RBAC" term_id="rbac" >}} is a key security control 
to ensure that cluster users and workloads have only the access to resources required to 
execute their roles. It is important to ensure that, when designing permissions for cluster
users, the cluster administrator understands the areas where privilge escalation could occur, 
to reduce the risk of excessive access leading to security incidents.

The good practices laid out here should be read in conjunction with the general [RBAC documentation](/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update).
-->

Kubernetes {{< glossary_tooltip text="RBAC" term_id="rbac" >}}
是一項重要的安全控制措施，用於保證叢集使用者和工作負載只能訪問履行自身角色所需的資源。
在為叢集使用者設計許可權時，請務必確保叢集管理員知道可能發生特權提級的地方，
降低因過多許可權而導致安全事件的風險。

此文件的良好實踐應該與通用
[RBAC 文件](/zh-cn/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update)一起閱讀。

<!-- body -->

<!--
## General good practice

### Least privilege
-->
## 通用的良好實踐 {#general-good-practice}

### 最小特權  {#least-privilege}

<!--
Ideally minimal RBAC rights should be assigned to users and service accounts. Only permissions 
explicitly required for their operation should be used. Whilst each cluster will be different, 
some general rules that can be applied are :
-->
理想情況下，分配給使用者和服務帳戶的 RBAC 許可權應該是最小的。
僅應使用操作明確需要的許可權，雖然每個叢集會有所不同，但可以應用的一些常規規則：

<!--
 - Assign permissions at the namespace level where possible. Use RoleBindings as opposed to 
   ClusterRoleBindings to give users rights only within a specific namespace.
 - Avoid providing wildcard permissions when possible, especially to all resources.
   As Kubernetes is an extensible system, providing wildcard access gives rights
   not just to all object types presently in the cluster, but also to all future object types
   which are created in the future.
 - Administrators should not use `cluster-admin` accounts except where specifically needed. 
   Providing a low privileged account with [impersonation rights](/docs/reference/access-authn-authz/authentication/#user-impersonation)
   can avoid accidental modification of cluster resources.
 - Avoid adding users to the `system:masters` group. Any user who is a member of this group 
   bypasses all RBAC rights checks and will always have unrestricted superuser access, which cannot be 
   revoked by removing Role Bindings or Cluster Role Bindings. As an aside, if a cluster is 
   using an authorization webhook, membership of this group also bypasses that webhook (requests 
   from users who are members of that group are never sent to the webhook)
-->
- 儘可能在名稱空間級別分配許可權。授予使用者在特定名稱空間中的許可權時使用 RoleBinding
  而不是 ClusterRoleBinding。
- 儘可能避免透過萬用字元設定許可權，尤其是對所有資源的許可權。
  由於 Kubernetes 是一個可擴充套件的系統，因此透過萬用字元來授予訪問許可權不僅會授予叢集中當前的所有物件型別，
  還包含所有未來被建立的所有物件型別。
- 管理員不應使用 `cluster-admin` 賬號，除非特別需要。為低特權帳戶提供
  [偽裝許可權](/zh-cn/docs/reference/access-authn-authz/authentication/#user-impersonation)
  可以避免意外修改叢集資源。
- 避免將使用者新增到 `system:masters` 組。任何屬於此組成員的使用者都會繞過所有 RBAC 許可權檢查，
  始終具有不受限制的超級使用者訪問許可權，並且不能透過刪除 `RoleBinding` 或 `ClusterRoleBinding`
  來取消其許可權。順便說一句，如果叢集是使用 Webhook 鑑權，此組的成員身份也會繞過該 
  Webhook（來自屬於該組成員的使用者的請求永遠不會發送到 Webhook）。
 
<!--
### Minimize distribution of privileged tokens
-->
### 最大限度地減少特權令牌的分發 {#minimize-distribution-of-privileged-tokens}

<!--
Ideally, pods shouldn't be assigned service accounts that have been granted powerful permissions (for example, any of the rights listed under
[privilege escalation risks](#privilege-escalation-risks)). 
In cases where a workload requires powerful permissions, consider the following practices:
 - Limit the number of nodes running powerful pods. Ensure that any DaemonSets you run
  are necessary and are run with least privilege to limit the blast radius of container escapes.
 - Avoid running powerful pods alongside untrusted or publicly-exposed ones. Consider using 
   [Taints and Toleration](/docs/concepts/scheduling-eviction/taint-and-toleration/), [NodeAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity), or [PodAntiAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity) to ensure 
   pods don't run alongside untrusted or less-trusted Pods. Pay especial attention to
   situations where less-trustworthy Pods are not meeting the **Restricted** Pod Security Standard.
-->
理想情況下，不應為 Pod 分配具有強大許可權（例如，在[特權提級的風險](#privilege-escalation-risks)中列出的任一許可權）的服務帳戶。
如果工作負載需要比較大的許可權，請考慮以下做法：
- 限制執行此類 Pod 的節點數量。確保你執行的任何 DaemonSet 都是必需的，
  並且以最小許可權執行，以限制容器逃逸的影響範圍。
- 避免將此類 Pod 與不可信任或公開的 Pod 在一起執行。
  考慮使用[汙點和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)、
  [節點親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)或
  [Pod 反親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)確保 
  Pod 不會與不可信或不太受信任的 Pod 一起執行。
  特別注意可信度不高的 Pod 不符合 **Restricted** Pod 安全標準的情況。
<!--
### Hardening

Kubernetes defaults to providing access which may not be required in every cluster. Reviewing 
the RBAC rights provided by default can provide opportunities for security hardening.
In general, changes should not be made to rights provided to `system:` accounts some options 
to harden cluster rights exist:
-->
### 加固 {#hardening}

Kubernetes 預設提供訪問許可權並非是每個叢集都需要的。
審查預設提供的 RBAC 許可權為安全加固提供了機會。
一般來說，不應該更改 `system:` 帳戶的某些許可權，有一些方式來強化現有叢集的許可權：

<!--
- Review bindings for the `system:unauthenticated` group and remove where possible, as this gives 
  access to anyone who can contact the API server at a network level.
- Avoid the default auto-mounting of service account tokens by setting
  `automountServiceAccountToken: false`. For more details, see
  [using default service account token](/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server).
  Setting this value for a Pod will overwrite the service account setting, workloads
  which require service account tokens can still mount them.
-->
- 審查 `system:unauthenticated` 組的繫結，並在可能的情況下將其刪除，
  因為這會給所有能夠訪問 API 伺服器的人以網路級別的許可權。
- 透過設定 `automountServiceAccountToken: false` 來避免服務賬號令牌的預設自動掛載，
  有關更多詳細資訊，請參閱[使用預設服務賬號令牌](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)。
  此引數可覆蓋 Pod 服務賬號設定，而需要服務賬號令牌的工作負載仍可以掛載。

<!--
### Periodic review

It is vital to periodically review the Kubernetes RBAC settings for redundant entries and 
possible privilege escalations.
If an attacker is able to create a user account with the same name as a deleted user,
they can automatically inherit all the rights of the deleted user, especially the
rights assigned to that user.
 --> 
### 定期檢查  {#periodic-review}
定期檢查 Kubernetes RBAC 設定是否有冗餘條目和提權可能性是至關重要的。
如果攻擊者能夠建立與已刪除使用者同名的使用者賬號，
他們可以自動繼承被刪除使用者的所有許可權，尤其是分配給該使用者的許可權。

<!--
## Kubernetes RBAC - privilege escalation risks {#privilege-escalation-risks}

Within Kubernetes RBAC there are a number of privileges which, if granted, can allow a user or a service account
to escalate their privileges in the cluster or affect systems outside the cluster.

This section is intended to provide visibility of the areas where cluster operators 
should take care, to ensure that they do not inadvertantly allow for more access to clusters than intended.
-->
## Kubernetes RBAC - 許可權提權的風險 {#privilege-escalation-risks}

在 Kubernetes RBAC 中有許多特權，如果被授予，
使用者或服務帳戶可以提升其在叢集中的許可權並可能影響叢集外的系統。

本節旨在提醒叢集操作員需要注意的不同領域，
以確保他們不會無意中授予超出預期的叢集訪問許可權。

<!--
### Listing secrets

It is generally clear that allowing `get` access on Secrets will allow a user to read their contents.
It is also important to note that `list` and `watch` access also effectively allow for users to reveal the Secret contents.
For example, when a List response is returned (for example, via `kubectl get secrets -A -o yaml`), the response
includes the contents of all Secrets.
-->
### 列舉 Secret {#listing-secrets}

大家都很清楚，若允許對 Secrets 執行 `get` 訪問，使用者就獲得了訪問 Secret 內容的能力。
同樣需要注意的是：`list` 和 `watch` 訪問也會授權使用者獲取 Secret 的內容。
例如，當返回 List 響應時（例如，透過 
`kubectl get secrets -A -o yaml`），響應包含所有 Secret 的內容。

<!--
### Workload creation

Users who are able to create workloads (either Pods, or
[workload resources](/docs/concepts/workloads/controllers/) that manage Pods) will
be able to gain access to the underlying node unless restrictions based on the Kubernetes
[Pod Security Standards](/docs/concepts/security/pod-security-standards/) are in place.
-->
### 工作負載的建立 {#workload-creation}

能夠建立工作負載的使用者（Pod 或管理 Pod 的[工作負載資源](/zh-cn/docs/concepts/workloads/controllers/)） 
能夠訪問下層的節點，除非基於 Kubernetes 的
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)做限制。

<!--
Users who can run privileged Pods can use that access to gain node access and potentially to
further elevate their privileges. Where you do not fully trust a user or other principal
with the ability to create suitably secure and isolated Pods, you should enforce either the
**Baseline** or **Restricted** Pod Security Standard.
You can use [Pod Security admission](/docs/concepts/security/pod-security-admission/)
or other (third party) mechanisms to implement that enforcement.
-->
可以執行特權 Pod 的使用者可以利用該訪問許可權獲得節點訪問許可權，
並可能進一步提升他們的特權。如果你不完全信任某使用者或其他主體，
不相信他們能夠建立比較安全且相互隔離的 Pod，你應該強制實施 **Baseline**
或 **Restricted** Pod 安全標準。
你可以使用 [Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)或其他（第三方）機制來強制實施這些限制。

<!--
You can also use the deprecated [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/) mechanism
to restrict users' abilities to create privileged Pods (N.B. PodSecurityPolicy is scheduled for removal
in version 1.25).
-->
你還可以使用已棄用的 [PodSecurityPolicy](/zh-cn/docs/concepts/security/pod-security-policy/)
機制以限制使用者建立特權 Pod 的能力 （特別注意：PodSecurityPolicy 已計劃在版本 1.25 中刪除）。

<!--
Creating a workload in a namespace also grants indirect access to Secrets in that namespace. 
Creating a pod in kube-system or a similarly privileged namespace can grant a user access to 
Secrets they would not have through RBAC directly.
-->
在名稱空間中建立工作負載還會授予對該名稱空間中 Secret 的間接訪問許可權。
在 kube-system 或類似特權的名稱空間中建立 Pod 
可以授予使用者不需要透過 RBAC 即可獲取 Secret 訪問許可權。

<!--
### Persistent volume creation

As noted in the [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/#volumes-and-file-systems) documentation, access to create PersistentVolumes can allow for escalation of access to the underlying host. Where access to persistent storage is required trusted administrators should create 
PersistentVolumes, and constrained users should use PersistentVolumeClaims to access that storage.
-->
### 持久卷的建立 {#persistent-volume-creation}

如 [PodSecurityPolicy](/zh-cn/docs/concepts/security/pod-security-policy/#volumes-and-file-systems) 
文件中所述，建立 PersistentVolumes 的許可權可以提權訪問底層主機。
如果需要訪問 PersistentVolume，受信任的管理員應該建立 `PersistentVolume`，
受約束的使用者應該使用 `PersistentVolumeClaim` 訪問該儲存。

<!--
### Access to `proxy` subresource of Nodes

Users with access to the proxy sub-resource of node objects have rights to the Kubelet API, 
which allows for command execution on every pod on the node(s) which they have rights to. 
This access bypasses audit logging and admission control, so care should be taken before 
granting rights to this resource.
-->
### 訪問 Node 的 `proxy` 子資源  {#access-to-proxy-subresource-of-nodes}

有權訪問 Node 物件的 proxy 子資源的使用者有權訪問 Kubelet API，
這允許在他們有權訪問的節點上的所有 Pod 上執行命令。
此訪問繞過審計日誌記錄和准入控制，因此在授予對此資源的許可權前應小心。

<!--
### Escalate verb

Generally the RBAC system prevents users from creating clusterroles with more rights than 
they possess. The exception to this is the `escalate` verb. As noted in the [RBAC documentation](/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update),
users with this right can effectively escalate their privileges.
-->
### esclate 動詞 {#escalate-verb}
通常，RBAC 系統會阻止使用者建立比他所擁有的更多許可權的 `ClusterRole`。
而 `escalate` 動詞是個例外。如
[RBAC 文件](/zh-cn/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update)
中所述，擁有此許可權的使用者可以有效地提升他們的許可權。

<!--
### Bind verb

Similar to the `escalate` verb, granting users this right allows for bypass of Kubernetes 
in-built protections against privilege escalation, allowing users to create bindings to 
roles with rights they do not already have.
-->
### bind 動詞  {#bind-verb}

與 `escalate` 動作類似，授予此許可權的使用者可以繞過 Kubernetes
對許可權提升的內建保護，使用者可以建立並繫結尚不具有的許可權的角色。

<!--
### Impersonate verb

This verb allows users to impersonate and gain the rights of other users in the cluster. 
Care should be taken when granting it, to ensure that excessive permissions cannot be gained 
via one of the impersonated accounts.
-->
### impersonate 動詞 {#impersonate-verb}

此動詞允許使用者偽裝並獲得叢集中其他使用者的許可權。
授予它時應小心，以確保透過其中一個偽裝賬號不會獲得過多的許可權。

<!--
### CSRs and certificate issuing

The CSR API allows for users with `create` rights to CSRs and `update` rights on `certificatesigningrequests/approval` 
where the signer is `kubernetes.io/kube-apiserver-client` to create new client certificates 
which allow users to authenticate to the cluster. Those client certificates can have arbitrary 
names including duplicates of Kubernetes system components. This will effectively allow for privilege escalation.
-->
### CSR 和證書頒發 {#csrs-and-certificate-issuing}

CSR API 允許使用者擁有 `create` CSR 的許可權和 `update`
`certificatesigningrequests/approval` 的許可權，
其中籤名者是 `kubernetes.io/kube-apiserver-client`，
透過此簽名建立的客戶端證書允許使用者向叢集進行身份驗證。
這些客戶端證書可以包含任意的名稱，包括 Kubernetes 系統元件的副本。
這將有利於特權提級。

<!--
### Token request

Users with `create` rights on `serviceaccounts/token` can create TokenRequests to issue 
tokens for existing service accounts. 
-->
### 令牌請求 {#token-request}

擁有 `serviceaccounts/token` 的 `create` 許可權的使用者可以建立 
TokenRequest 來發布現有服務帳戶的令牌。

<!--
### Control admission webhooks

Users with control over `validatingwebhookconfigurations` or `mutatingwebhookconfigurations` 
can control webhooks that can read any object admitted to the cluster, and in the case of 
mutating webhooks, also mutate admitted objects.
-->
###  控制准入 Webhook {#control-admission-webhooks}

可以控制 `validatingwebhookconfigurations` 或 `mutatingwebhookconfigurations`
的使用者可以控制能讀取任何允許進入叢集的物件的 webhook，
並且在有變更 webhook 的情況下，還可以變更准入的物件。

<!--
## Kubernetes RBAC - denial of service risks {#denial-of-service-risks}

### Object creation denial-of-service {#object-creation-dos}
Users who have rights to create objects in a cluster may be able to create sufficient large 
objects to create a denial of service condition either based on the size or number of objects, as discussed in
[etcd used by Kubernetes is vulnerable to OOM attack](https://github.com/kubernetes/kubernetes/issues/107325). This may be
specifically relevant in multi-tenant clusters if semi-trusted or untrusted users 
are allowed limited access to a system.

One option for mitigation of this issue would be to use [resource quotas](/docs/concepts/policy/resource-quotas/#object-count-quota)
to limit the quantity of objects which can be created.
-->
## Kubernetes RBAC - 拒絕服務攻擊的風險 {#denial-of-service-risks}

### 物件建立拒絕服務 {#object-creation-dos}
有權在叢集中建立物件的使用者根據建立物件的大小和數量可能會建立足夠大的物件，
產生拒絕服務狀況，如 [Kubernetes 使用的 etcd 容易受到 OOM 攻擊](https://github.com/kubernetes/kubernetes/issues/107325)中的討論。
允許太不受信任或者不受信任的使用者對系統進行有限的訪問在多租戶叢集中是特別重要的。

緩解此問題的一種選擇是使用[資源配額](/zh-cn/docs/concepts/policy/resource-quotas/#object-count-quota)以限制可以建立的物件數量。