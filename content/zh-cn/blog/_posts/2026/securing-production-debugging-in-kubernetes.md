---
layout: blog
title: "保护 Kubernetes 中的生产环境调试"
date: 2026-03-18T10:00:00-08:00
slug: securing-production-debugging-in-kubernetes
author: >
  [Shridivya Sharma](https://github.com/shrishar)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Securing Production Debugging in Kubernetes"
date: 2026-03-18T10:00:00-08:00
slug: securing-production-debugging-in-kubernetes
author: >
  [Shridivya Sharma](https://github.com/shrishar)
-->

<!--
During production debugging, the fastest route is often broad access such as `cluster-admin` (a ClusterRole that grants administrator-level access), shared bastions/jump boxes, or long-lived SSH keys. It works in the moment, but it comes with two common problems: auditing becomes difficult, and temporary exceptions have a way of becoming routine.
-->
在生产环境调试期间，最快的途径通常是广泛的访问权限，
例如 `cluster-admin`（授予管理员级别访问权限的 ClusterRole）、共享的堡垒机/跳板机，
或者长期存在的 SSH 密钥。这种方法在当时有效，
但存在两个常见问题：审计变得困难，临时例外往往成为惯例。

<!--
This post offers my recommendations for good practices applicable to existing Kubernetes environments with minimal tooling changes:
-->
本文提供了我的建议，适用于现有 Kubernetes 环境的良好实践，只需最小的工具变更：

<!--
- Least privilege with RBAC
- Short-lived, identity-bound credentials
- An SSH-style handshake model for cloud native debugging
-->
- 使用 RBAC 实现最小权限原则
- 短期、身份绑定的凭证
- 用于云原生调试的 SSH 风格握手模型

<!--
A good architecture for securing production debugging workflows is to use a just-in-time secure shell gateway
(often deployed as an on demand pod in the cluster).
It acts as an SSH-style “front door” that makes temporary access actually temporary. You can
authenticate with short-lived, identity-bound credentials, establish a session to the gateway,
and the gateway uses the Kubernetes API and RBAC to control what they can do, such as `pods/log`, `pods/exec`, and `pods/portforward`.
Sessions expire automatically, and both the gateway logs and Kubernetes audit logs capture who accessed what and when without shared bastion accounts or long-lived keys.
-->
保护生产调试工作流程的良好架构是使用即时安全 shell 网关（通常部署为集群中的按需 Pod）。
它充当 SSH 风格的“前门”，使临时访问真正是临时的。
你可以使用短期、身份绑定的凭证进行身份验证，建立到网关的会话，
网关使用 Kubernetes API 和 RBAC 控制他们可以做什么，
例如 `pods/log`、`pods/exec` 和 `pods/portforward`。
会话会自动过期，网关日志和 Kubernetes 审计日志都会记录谁在何时访问了什么，
而无需共享堡垒机账户或长期存在的密钥。

<!--
## 1) Using an access broker on top of Kubernetes RBAC
-->
## 1) 在 Kubernetes RBAC 之上使用访问代理

<!--
RBAC controls who can do what in Kubernetes. Many Kubernetes environments rely primarily on RBAC for authorization, although Kubernetes also supports other authorization modes such as Webhook authorization. You can enforce access directly with Kubernetes RBAC, or put an access broker in front of the cluster that still relies on Kubernetes permissions under the hood. In either model, Kubernetes RBAC remains the source of truth for what the Kubernetes API allows and at what scope.
-->
RBAC 控制谁可以在 Kubernetes 中做什么。
尽管 Kubernetes 还支持其他授权模式（如 Webhook 授权），
但许多 Kubernetes 环境主要依赖 RBAC 进行授权。
你可以直接使用 Kubernetes RBAC 强制执行访问控制，
或者在集群前面放置一个访问代理，该代理在幕后仍然依赖 Kubernetes 权限。
在任一模型中，Kubernetes RBAC 仍然是 Kubernetes API 允许什么以及在什么范围的事实来源。

<!--
An access broker adds controls that RBAC does not cover well. For example, it can decide whether a request is auto-approved or requires manual approval, whether a user can run a command, and which commands are allowed in a session. It can also manage group membership so that you grant permissions to groups instead of individual users. Kubernetes RBAC can allow actions such as pods/exec, but it cannot restrict which commands run inside an exec session.
-->
访问代理添加了 RBAC 不能很好覆盖的控制。
例如，它可以决定请求是自动批准还是需要手动批准，用户是否可以运行命令，
以及会话中允许哪些命令。它还可以管理组成员身份，以便你向组而不是单个用户授予权限。
Kubernetes RBAC 可以允许诸如 `pods/exec` 之类的操作，
但它不能限制在 exec 会话中运行哪些命令。

<!--
With that model, Kubernetes RBAC defines the allowed actions for a user or group (for example, an on-call team in a single namespace).
I recommend you only define access rules that grant rights to groups or to ServiceAccounts - never to individual users. The broker or identity provider then adds or removes users from that group as needed.
-->
通过该模型，Kubernetes RBAC 定义了用户或组（例如单个命名空间中的值班团队）允许的操作。
我建议你只定义向组或 ServiceAccount 授予权限的访问规则——永远不要授予单个用户。
然后，代理或身份提供商根据需要向该组添加或删除用户。

<!--
The broker can also enforce extra policy on top, like which commands are permitted in an interactive session and
which requests can be auto-approved versus require manual approval.
That policy can live in a JSON or XML file and be maintained through code review, so updates go through a formal pull request and are reviewed like any other production change.
-->
代理还可以在上面强制执行额外的策略，例如在交互式会话中允许哪些命令，
以及哪些请求可以自动批准而哪些需要手动批准。
该策略可以保存在 JSON 或 XML 文件中，并通过代码审查进行维护，
因此更新会通过正式的拉取请求进行，并像任何其他生产变更一样接受审查。

<!--
### Example: a namespaced on-call debug Role
-->
### 示例：命名空间范围的值班调试 Role

<!--
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: oncall-debug
  namespace: <namespace>
rules:
  # Discover what’s running
  - apiGroups: [""]
    resources: ["pods", "events"]
    verbs: ["get", "list", "watch"]

  # Read logs
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]

  # Interactive debugging actions
  - apiGroups: [""]
    resources: ["pods/exec", "pods/portforward"]
    verbs: ["create"]

  # Understand rollout/controller state
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch"]

  # Optional: allow kubectl debug ephemeral containers
  - apiGroups: [""]
    resources: ["pods/ephemeralcontainers"]
    verbs: ["update"]
```
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: oncall-debug
  namespace: <namespace>
rules:
  # 运行的内容
  - apiGroups: [""]
    resources: ["pods", "events"]
    verbs: ["get", "list", "watch"]

  # 读取日志
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]

  # 交互式调试操作
  - apiGroups: [""]
    resources: ["pods/exec", "pods/portforward"]
    verbs: ["create"]

  # 了解滚动控制器状态
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch"]

  # 允许 kubectl 允许调试临时容器
  - apiGroups: [""]
    resources: ["pods/ephemeralcontainers"]
    verbs: ["update"]
```


<!--
Bind the Role to a group (rather than individual users) so membership can be managed through your identity provider:
-->
将该 Role 绑定到一个组（而不是单个用户），以便可以通过身份提供商管理成员身份：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: oncall-debug
  namespace: <namespace>
subjects:
  - kind: Group
    name: oncall-<team-name>
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: oncall-debug
  apiGroup: rbac.authorization.k8s.io
```

<!--
## 2) Short-lived, identity-bound credentials
-->
## 2) 短期、身份绑定的凭证

<!--
The goal is to use short-lived, identity-bound credentials that clearly tie a session to a real person and expire quickly. These credentials can include the user’s identity and the scope of what they’re allowed to do. They’re typically signed using a private key that stays with the engineer, such as a hardware-backed key (for example, a YubiKey), so they can not be forged without access to that key.
-->
目标是使用短期、身份绑定的凭证，这些凭证将会话与真实人物明确绑定并快速过期。
这些凭证可以包含用户的身份以及他们被允许执行的范围。
它们通常使用保存在工程师那里的私钥签名，例如硬件支持的密钥（例如 YubiKey），
因此没有访问该密钥的权限就无法伪造它们。

<!--
You can implement this with Kubernetes-native authentication (for example, client certificates or an OIDC-based flow),
or have the access broker from the previous section issue short-lived credentials on the user’s behalf.
In many setups, Kubernetes still uses RBAC to enforce permissions based on the authenticated identity and groups/claims.
If you use an access broker, it can also encode additional scope constraints in the credential and enforce them during the session, such as which cluster or namespace the session applies to and which actions
(or approved commands) are allowed against pods or nodes.
In either case, the credentials should be signed by a certificate authority (CA), and that CA should be rotated on a regular schedule (for example, quarterly) to limit long-term risk.
-->
你可以使用 Kubernetes 原生身份验证（例如客户端证书或基于 OIDC 的流程）实现这一点，
或者让前一节的访问代理代表用户颁发短期凭证。
在许多设置中，Kubernetes 仍然使用 RBAC 基于已验证身份和组/声明来强制执行权限。
如果使用访问代理，它还可以在凭证中编码额外的范围约束，并在会话期间强制执行这些约束，
例如会话适用于哪个集群或命名空间，以及允许对 pod 或节点执行哪些操作（或批准的命令）。
在任一情况下，凭证都应由证书颁发机构（CA）签名，并且该 CA 应定期轮换（例如每季度）以限制长期风险。

<!--
### Option A: short-lived OIDC tokens
-->
### 选项 A：短期 OIDC 令牌

<!--
A lot of managed Kubernetes clusters already give you short-lived tokens. The main thing is to make sure your kubeconfig refreshes them automatically instead of copying a long-lived token into the file.
-->
许多托管 Kubernetes 集群已经提供短期令牌。
主要是确保你的 kubeconfig 自动刷新它们，而不是将长期令牌复制到文件中。

<!--
For example:
-->
例如：

```yaml
users:
- name: oncall
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1
      command: cred-helper
      args: ["--cluster=prod", "--ttl=30m"]
```

<!--
### Option B: Short-lived client certificates (X.509)
-->
### 选项 B：短期客户端证书（X.509）

<!--
If your API server (or your access broker from the previous section) is set up to trust a client CA, you can use short-lived client certificates for debugging access. The idea is:
-->
如果你的 API 服务器（或前一节的访问代理）被设置为信任客户端 CA，
你可以使用短期客户端证书进行调试访问。这个想法是：

<!--
* The private key is created and kept under the engineer’s machine (ideally hardware-backed, like a non-exportable key in a YubiKey/PIV token)
* A short-lived certificate is issued (often via the
  [CertificateSigningRequest](/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests) API, or your access broker from the previous section, with a TTL).
* RBAC maps the authenticated identity to a minimal Role
-->
* 私钥在工程师的机器上创建并保留（理想情况下是硬件支持的，如 YubiKey/PIV 令牌中不可导出的密钥）
* 颁发短期证书（通常通过
  [CertificateSigningRequest](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests) API，
  或前一节的访问代理，具有 TTL）。
* RBAC 将已验证的身份映射到最小化 Role

<!--
This is straightforward to operationalize with the Kubernetes CertificateSigningRequest API.
-->
使用 Kubernetes CertificateSigningRequest API 可以直接实现这一点。

<!--
Generate a key and CSR locally:
-->
本地生成密钥和 CSR：

<!--
```bash
# Generate a private key.
# This could instead be generated within a hardware token;
# OpenSSL and several similar tools include support for that.
openssl genpkey -algorithm Ed25519 -out oncall.key

openssl req -new -key oncall.key -out oncall.csr \
  -subj "/CN=user/O=oncall-payments"
```
-->
```bash
# 生成私钥。
# 也可以在硬件令牌中生成私钥；
# OpenSSL 和一些类似的工具都支持这种方式。
openssl genpkey -algorithm Ed25519 -out oncall.key

openssl req -new -key oncall.key -out oncall.csr \
  -subj "/CN=user/O=oncall-payments"
```

<!--
Create a CertificateSigningRequest with a short expiration:
-->
创建一个短期过期的 CertificateSigningRequest：

<!--
# 30 minutes
-->
```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: oncall-<user>-20260218
spec:
  request: <base64-encoded oncall.csr>
  signerName: kubernetes.io/kube-apiserver-client
  expirationSeconds: 1800  # 30 分钟
  usages:
    - client auth
```

<!--
After the CSR is approved and signed, you extract the issued certificate and use it together with the private key to authenticate, for example via kubectl.
-->
CSR 被批准并签名后，提取颁发的证书并将其与私钥一起使用进行身份验证，
例如通过 kubectl。

<!--
## 3) Use a just-in-time access gateway to run debugging commands
-->
## 3) 使用即时访问网关运行调试命令

<!--
Once you have short-lived credentials, you can use them to open a secure shell session to a just-in-time access gateway, often exposed over SSH and created on demand. If the gateway is exposed over SSH, a common pattern is to issue the engineer a short-lived OpenSSH user certificate for the session. The gateway trusts your SSH user CA, authenticates the engineer at connection time, and then applies the approved session policy before making Kubernetes API calls on the user’s behalf. OpenSSH certificates are separate from Kubernetes X.509 client certificates, so these are usually treated as distinct layers.
-->
一旦你有了短期凭证，就可以使用它们打开到即时访问网关的安全 shell 会话，
该网关通常通过 SSH 暴露并按需创建。如果网关通过 SSH 暴露，
常见模式是为工程师颁发会话的短期 OpenSSH 用户证书。
网关信任你的 SSH 用户 CA，在连接时对工程师进行身份验证，
然后在代表用户进行 Kubernetes API 调用之前应用批准的会话策略。
OpenSSH 证书与 Kubernetes X.509 客户端证书是分开的，因此这些通常被视为独立的层。

<!--
The resulting session should also be scoped so it cannot be reused outside of what was approved. For example, the gateway or broker can limit it to a specific cluster and namespace, and optionally to a narrower target such as a pod or node. That way, even if someone tries to reuse the access, it will not work outside the intended scope. After the session is established, the gateway executes only the allowed actions and records what happened for auditing.
-->
生成的会话也应该有范围限制，以便无法在批准的范围之外重用它。
例如，网关或代理可以将其限制为特定集群和命名空间，还可以限制为更窄的目标，
如 Pod 或节点。这样，即使有人尝试重用访问权限，它也不会在预期范围之外工作。
会话建立后，网关只执行允许的操作并记录发生的事情用于审计。

<!--
### Example: Namespace-scoped role bindings
-->
### 示例：命名空间范围的角色绑定

<!--
# mapped from the short-lived credential (cert/OIDC)
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: jit-debug
  namespace: <namespace>
  annotations:
    kubernetes.io/description: >
      Colleagues performing semi-privileged debugging, with access provided
      just in time and on demand.
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods/exec"]
    verbs: ["create"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: jit-debug
  namespace: <namespace>
subjects:
  - kind: Group
    name: jit:oncall:<namespace>   # 从短期凭证 (cert/OIDC) 映射而来
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: jit-debug
  apiGroup: rbac.authorization.k8s.io
```

<!--
These RBAC objects, and the rules they define, allow debugging only within the specified namespace; attempts to access other namespaces are not allowed.
-->
这些 RBAC 对象以及它们定义的规则只允许在指定的命名空间内进行调试；不允许尝试访问其他命名空间。

<!--
### Example: Cluster-scoped role binding
-->
### 示例：集群范围的角色绑定

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: jit-cluster-read
rules:
  - apiGroups: [""]
    resources: ["nodes", "namespaces"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: jit-cluster-read
subjects:
  - kind: Group
    name: jit:oncall:cluster
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: jit-cluster-read
  apiGroup: rbac.authorization.k8s.io
```

<!--
These RBAC rules grant cluster-wide read access (for example, to nodes and namespaces) and should be used only for workflows that truly require cluster-scoped resources.
-->
这些 RBAC 规则授予集群范围的读访问权限（例如，对节点和命名空间），
并且只应该用于真正需要集群范围资源的工作流程。

<!--
Finer-grained restrictions like “only this pod/node” or “only these commands” are typically enforced by the access gateway/broker during the session, but Kubernetes also offers other options, such as ValidatingAdmissionPolicy for restricting writes and webhook authorization for custom authorization across verbs.
-->
更细粒度的限制，例如“仅这个 pod/node ”或“仅这些命令”，
通常由访问网关/代理在会话期间强制执行，但 Kubernetes 也提供其他选项，
例如用于限制写入的 ValidatingAdmissionPolicy 和用于跨动词的自定义授权的 Webhook 授权。

<!--
In environments with stricter access controls, you can add an extra, short-lived session mediation layer
to separate session establishment from privileged actions. Both layers are ephemeral, use identity-bound expiring credentials,
and produce independent audit trails. The mediation layer handles session setup/forwarding,
while the execution layer performs only RBAC-authorized Kubernetes actions.
This separation can reduce exposure by narrowing responsibilities, scoping credentials per step, and enforcing end-to-end session expiry.
-->
在具有更严格访问控制的环境中，你可以添加一个额外的短期会话中介层，
将会话建立与特权操作分开。两个层都是临时的，使用身份绑定的过期凭证，
并产生独立的审计轨迹。中介层处理会话设置/转发，而执行层仅执行 RBAC 授权的 Kubernetes 操作。
这种分离可以通过缩小职责范围、为每个步骤限定凭证范围以及强制执行端到端会话过期来减少暴露。

<!--
## References
-->
## 参考资料

<!--
- [Authorization](/docs/reference/access-authn-authz/authorization/)
- [Using RBAC Authorization](/docs/reference/access-authn-authz/rbac/)
- [Authenticating](/docs/reference/access-authn-authz/authentication/)
- [Certificates and Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
- [Issue a Certificate for a Kubernetes API Client Using a CertificateSigningRequest](/docs/tasks/tls/certificate-issue-client-csr/)
- [Role Based Access Control Good Practices](/docs/concepts/security/rbac-good-practices/)
-->
- [授权](/zh-cn/docs/reference/access-authn-authz/authorization/)
- [使用 RBAC 授权](/zh-cn/docs/reference/access-authn-authz/rbac/)
- [身份验证](/zh-cn/docs/reference/access-authn-authz/authentication/)
- [证书和证书签名请求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
- [使用 CertificateSigningRequest 为 Kubernetes API 客户端颁发证书](/zh-cn/docs/tasks/tls/certificate-issue-client-csr/)
- [基于角色的访问控制最佳实践](/zh-cn/docs/concepts/security/rbac-good-practices/)

<!--
_Disclaimer: The views expressed in this post are solely those of the author and do not reflect the views of the author’s employer or any other organization._
-->
**免责声明：本文表达的观点仅代表作者个人，不代表作者雇主或任何其他组织的观点。**
