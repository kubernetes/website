---
title: 基于角色的访问控制良好实践
description: >
  为集群操作人员提供的良好的 RBAC 设计原则和实践。
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
是一项重要的安全控制措施，用于保证集群用户和工作负载只能访问履行自身角色所需的资源。
在为集群用户设计权限时，请务必确保集群管理员知道可能发生特权提级的地方，
降低因过多权限而导致安全事件的风险。

此文档的良好实践应该与通用
[RBAC 文档](/zh/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update)一起阅读。

<!-- body -->

<!--
## General good practice

### Least privilege
-->
## 通用的良好实践 {#general-good-practice}

### 最小特权  {#least-privilege}

<!--
Ideally minimal RBAC rights should be assigned to users and service accounts. Only permissions 
explicitly required for their operation should be used. Whilst each cluster will be different, 
some general rules that can be applied are :
-->
理想情况下，分配给用户和服务帐户的 RBAC 权限应该是最小的。
仅应使用操作明确需要的权限，虽然每个集群会有所不同，但可以应用的一些常规规则：

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
- 尽可能在命名空间级别分配权限。授予用户在特定命名空间中的权限时使用 RoleBinding
  而不是 ClusterRoleBinding。
- 尽可能避免通过通配符设置权限，尤其是对所有资源的权限。
  由于 Kubernetes 是一个可扩展的系统，因此通过通配符来授予访问权限不仅会授予集群中当前的所有对象类型，
  还包含所有未来被创建的所有对象类型。
- 管理员不应使用 `cluster-admin` 账号，除非特别需要。为低特权帐户提供
  [伪装权限](/zh/docs/reference/access-authn-authz/authentication/#user-impersonation)
  可以避免意外修改集群资源。
- 避免将用户添加到 `system:masters` 组。任何属于此组成员的用户都会绕过所有 RBAC 权限检查，
  始终具有不受限制的超级用户访问权限，并且不能通过删除 `RoleBinding` 或 `ClusterRoleBinding`
  来取消其权限。顺便说一句，如果集群是使用 Webhook 鉴权，此组的成员身份也会绕过该 
  Webhook（来自属于该组成员的用户的请求永远不会发送到 Webhook）。
 
<!--
### Minimize distribution of privileged tokens
-->
### 最大限度地减少特权令牌的分发 {#minimize-distribution-of-privileged-tokens}

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
理想情况下，不应为 Pod 分配具有强大权限（例如，在[特权提级的风险](#privilege-escalation-risks)中列出的任一权限）的服务帐户。
如果工作负载需要比较大的权限，请考虑以下做法：
- 限制运行此类 Pod 的节点数量。确保你运行的任何 DaemonSet 都是必需的，
  并且以最小权限运行，以限制容器逃逸的影响范围。
- 避免将此类 Pod 与不可信任或公开的 Pod 在一起运行。
  考虑使用[污点和容忍度](/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)、
  [节点亲和性](/zh/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)或
  [Pod 反亲和性](/zh/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)确保 
  Pod 不会与不可信或不太受信任的 Pod 一起运行。
  特别注意可信度不高的 Pod 不符合 **Restricted** Pod 安全标准的情况。
<!--
### Hardening

Kubernetes defaults to providing access which may not be required in every cluster. Reviewing 
the RBAC rights provided by default can provide opportunities for security hardening.
In general, changes should not be made to rights provided to `system:` accounts some options 
to harden cluster rights exist:
-->
### 加固 {#hardening}

Kubernetes 默认提供访问权限并非是每个集群都需要的。
审查默认提供的 RBAC 权限为安全加固提供了机会。
一般来说，不应该更改 `system:` 帐户的某些权限，有一些方式来强化现有集群的权限：

<!--
- Review bindings for the `system:unauthenticated` group and remove where possible, as this gives 
  access to anyone who can contact the API server at a network level.
- Avoid the default auto-mounting of service account tokens by setting
  `automountServiceAccountToken: false`. For more details, see
  [using default service account token](/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server).
  Setting this value for a Pod will overwrite the service account setting, workloads
  which require service account tokens can still mount them.
-->
- 审查 `system:unauthenticated` 组的绑定，并在可能的情况下将其删除，
  因为这会给所有能够访问 API 服务器的人以网络级别的权限。
- 通过设置 `automountServiceAccountToken: false` 来避免服务账号令牌的默认自动挂载，
  有关更多详细信息，请参阅[使用默认服务账号令牌](/zh/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)。
  此参数可覆盖 Pod 服务账号设置，而需要服务账号令牌的工作负载仍可以挂载。

<!--
### Periodic review

It is vital to periodically review the Kubernetes RBAC settings for redundant entries and 
possible privilege escalations.
If an attacker is able to create a user account with the same name as a deleted user,
they can automatically inherit all the rights of the deleted user, especially the
rights assigned to that user.
 --> 
### 定期检查  {#periodic-review}
定期检查 Kubernetes RBAC 设置是否有冗余条目和提权可能性是至关重要的。
如果攻击者能够创建与已删除用户同名的用户账号，
他们可以自动继承被删除用户的所有权限，尤其是分配给该用户的权限。

<!--
## Kubernetes RBAC - privilege escalation risks {#privilege-escalation-risks}

Within Kubernetes RBAC there are a number of privileges which, if granted, can allow a user or a service account
to escalate their privileges in the cluster or affect systems outside the cluster.

This section is intended to provide visibility of the areas where cluster operators 
should take care, to ensure that they do not inadvertently allow for more access to clusters than intended.
-->
## Kubernetes RBAC - 权限提权的风险 {#privilege-escalation-risks}

在 Kubernetes RBAC 中有许多特权，如果被授予，
用户或服务帐户可以提升其在集群中的权限并可能影响集群外的系统。

本节旨在提醒集群操作员需要注意的不同领域，
以确保他们不会无意中授予超出预期的集群访问权限。

<!--
### Listing secrets

It is generally clear that allowing `get` access on Secrets will allow a user to read their contents.
It is also important to note that `list` and `watch` access also effectively allow for users to reveal the Secret contents.
For example, when a List response is returned (for example, via `kubectl get secrets -A -o yaml`), the response
includes the contents of all Secrets.
-->
### 列举 Secret {#listing-secrets}

大家都很清楚，若允许对 Secrets 执行 `get` 访问，用户就获得了访问 Secret 内容的能力。
同样需要注意的是：`list` 和 `watch` 访问也会授权用户获取 Secret 的内容。
例如，当返回 List 响应时（例如，通过 
`kubectl get secrets -A -o yaml`），响应包含所有 Secret 的内容。

<!--
### Workload creation

Users who are able to create workloads (either Pods, or
[workload resources](/docs/concepts/workloads/controllers/) that manage Pods) will
be able to gain access to the underlying node unless restrictions based on the Kubernetes
[Pod Security Standards](/docs/concepts/security/pod-security-standards/) are in place.
-->
### 工作负载的创建 {#workload-creation}

能够创建工作负载的用户（Pod 或管理 Pod 的[工作负载资源](/zh/docs/concepts/workloads/controllers/)） 
能够访问下层的节点，除非基于 Kubernetes 的
[Pod 安全标准](/zh/docs/concepts/security/pod-security-standards/)做限制。

<!--
Users who can run privileged Pods can use that access to gain node access and potentially to
further elevate their privileges. Where you do not fully trust a user or other principal
with the ability to create suitably secure and isolated Pods, you should enforce either the
**Baseline** or **Restricted** Pod Security Standard.
You can use [Pod Security admission](/docs/concepts/security/pod-security-admission/)
or other (third party) mechanisms to implement that enforcement.
-->
可以运行特权 Pod 的用户可以利用该访问权限获得节点访问权限，
并可能进一步提升他们的特权。如果你不完全信任某用户或其他主体，
不相信他们能够创建比较安全且相互隔离的 Pod，你应该强制实施 **Baseline**
或 **Restricted** Pod 安全标准。
你可以使用 [Pod 安全性准入](/zh/docs/concepts/security/pod-security-admission/)或其他（第三方）机制来强制实施这些限制。

<!--
You can also use the deprecated [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/) mechanism
to restrict users' abilities to create privileged Pods (N.B. PodSecurityPolicy is scheduled for removal
in version 1.25).
-->
你还可以使用已弃用的 [PodSecurityPolicy](/zh-cn/docs/concepts/security/pod-security-policy/)
机制以限制用户创建特权 Pod 的能力 （特别注意：PodSecurityPolicy 已计划在版本 1.25 中删除）。

<!--
Creating a workload in a namespace also grants indirect access to Secrets in that namespace. 
Creating a pod in kube-system or a similarly privileged namespace can grant a user access to 
Secrets they would not have through RBAC directly.
-->
在命名空间中创建工作负载还会授予对该命名空间中 Secret 的间接访问权限。
在 kube-system 或类似特权的命名空间中创建 Pod 
可以授予用户不需要通过 RBAC 即可获取 Secret 访问权限。

<!--
### Persistent volume creation

As noted in the [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/#volumes-and-file-systems) documentation, access to create PersistentVolumes can allow for escalation of access to the underlying host. Where access to persistent storage is required trusted administrators should create 
PersistentVolumes, and constrained users should use PersistentVolumeClaims to access that storage.
-->
### 持久卷的创建 {#persistent-volume-creation}

如 [PodSecurityPolicy](/zh-cn/docs/concepts/security/pod-security-policy/#volumes-and-file-systems) 
文档中所述，创建 PersistentVolumes 的权限可以提权访问底层主机。
如果需要访问 PersistentVolume，受信任的管理员应该创建 `PersistentVolume`，
受约束的用户应该使用 `PersistentVolumeClaim` 访问该存储。

<!--
### Access to `proxy` subresource of Nodes

Users with access to the proxy sub-resource of node objects have rights to the Kubelet API, 
which allows for command execution on every pod on the node(s) which they have rights to. 
This access bypasses audit logging and admission control, so care should be taken before 
granting rights to this resource.
-->
### 访问 Node 的 `proxy` 子资源  {#access-to-proxy-subresource-of-nodes}

有权访问 Node 对象的 proxy 子资源的用户有权访问 Kubelet API，
这允许在他们有权访问的节点上的所有 Pod 上执行命令。
此访问绕过审计日志记录和准入控制，因此在授予对此资源的权限前应小心。

<!--
### Escalate verb

Generally the RBAC system prevents users from creating clusterroles with more rights than 
they possess. The exception to this is the `escalate` verb. As noted in the [RBAC documentation](/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update),
users with this right can effectively escalate their privileges.
-->
### esclate 动词 {#escalate-verb}
通常，RBAC 系统会阻止用户创建比他所拥有的更多权限的 `ClusterRole`。
而 `escalate` 动词是个例外。如
[RBAC 文档](/zh/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update)
中所述，拥有此权限的用户可以有效地提升他们的权限。

<!--
### Bind verb

Similar to the `escalate` verb, granting users this right allows for bypass of Kubernetes 
in-built protections against privilege escalation, allowing users to create bindings to 
roles with rights they do not already have.
-->
### bind 动词  {#bind-verb}

与 `escalate` 动作类似，授予此权限的用户可以绕过 Kubernetes
对权限提升的内置保护，用户可以创建并绑定尚不具有的权限的角色。

<!--
### Impersonate verb

This verb allows users to impersonate and gain the rights of other users in the cluster. 
Care should be taken when granting it, to ensure that excessive permissions cannot be gained 
via one of the impersonated accounts.
-->
### impersonate 动词 {#impersonate-verb}

此动词允许用户伪装并获得集群中其他用户的权限。
授予它时应小心，以确保通过其中一个伪装账号不会获得过多的权限。

<!--
### CSRs and certificate issuing

The CSR API allows for users with `create` rights to CSRs and `update` rights on `certificatesigningrequests/approval` 
where the signer is `kubernetes.io/kube-apiserver-client` to create new client certificates 
which allow users to authenticate to the cluster. Those client certificates can have arbitrary 
names including duplicates of Kubernetes system components. This will effectively allow for privilege escalation.
-->
### CSR 和证书颁发 {#csrs-and-certificate-issuing}

CSR API 允许用户拥有 `create` CSR 的权限和 `update`
`certificatesigningrequests/approval` 的权限，
其中签名者是 `kubernetes.io/kube-apiserver-client`，
通过此签名创建的客户端证书允许用户向集群进行身份验证。
这些客户端证书可以包含任意的名称，包括 Kubernetes 系统组件的副本。
这将有利于特权提级。

<!--
### Token request

Users with `create` rights on `serviceaccounts/token` can create TokenRequests to issue 
tokens for existing service accounts. 
-->
### 令牌请求 {#token-request}

拥有 `serviceaccounts/token` 的 `create` 权限的用户可以创建 
TokenRequest 来发布现有服务帐户的令牌。

<!--
### Control admission webhooks

Users with control over `validatingwebhookconfigurations` or `mutatingwebhookconfigurations` 
can control webhooks that can read any object admitted to the cluster, and in the case of 
mutating webhooks, also mutate admitted objects.
-->
###  控制准入 Webhook {#control-admission-webhooks}

可以控制 `validatingwebhookconfigurations` 或 `mutatingwebhookconfigurations`
的用户可以控制能读取任何允许进入集群的对象的 webhook，
并且在有变更 webhook 的情况下，还可以变更准入的对象。

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
## Kubernetes RBAC - 拒绝服务攻击的风险 {#denial-of-service-risks}

### 对象创建拒绝服务 {#object-creation-dos}
有权在集群中创建对象的用户根据创建对象的大小和数量可能会创建足够大的对象，
产生拒绝服务状况，如 [Kubernetes 使用的 etcd 容易受到 OOM 攻击](https://github.com/kubernetes/kubernetes/issues/107325)中的讨论。
允许太不受信任或者不受信任的用户对系统进行有限的访问在多租户集群中是特别重要的。

缓解此问题的一种选择是使用[资源配额](/zh/docs/concepts/policy/resource-quotas/#object-count-quota)以限制可以创建的对象数量。