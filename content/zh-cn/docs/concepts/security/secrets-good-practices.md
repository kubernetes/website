---
title: Kubernetes Secret 良好实践
description: >
  帮助集群管理员和应用开发者更好管理 Secret 的原理和实践。
content_type: concept
weight: 70
---
<!--
title: Good practices for Kubernetes Secrets
description: >
  Principles and practices for good Secret management for cluster administrators and application developers.
content_type: concept
weight: 70
-->

<!-- overview -->

{{<glossary_definition prepend="在 Kubernetes 中，Secret 是这样一个对象："
term_id="secret" length="all">}}

<!--
The following good practices are intended for both cluster administrators and
application developers. Use these guidelines to improve the security of your
sensitive information in Secret objects, as well as to more effectively manage
your Secrets.
-->
以下良好实践适用于集群管理员和应用开发者。遵从这些指导方针有助于提高 Secret
对象中敏感信息的安全性，还可以更有效地管理你的 Secret。

<!-- body -->

<!--
## Cluster administrators

This section provides good practices that cluster administrators can use to
improve the security of confidential information in the cluster.
-->
## 集群管理员   {#cluster-administrators}

本节提供了集群管理员可用于提高集群中机密信息安全性的良好实践。

<!--
### Configure encryption at rest

By default, Secret objects are stored unencrypted in {{<glossary_tooltip
term_id="etcd" text="etcd">}}. You should configure encryption of your Secret
data in `etcd`. For instructions, refer to
[Encrypt Secret Data at Rest](/docs/tasks/administer-cluster/encrypt-data/).
-->
### 配置静态加密   {#configure-encryption-at-rest}

默认情况下，Secret 对象以非加密的形式存储在 {{<glossary_tooltip term_id="etcd" text="etcd">}} 中。
你配置对在 `etcd` 中存储的 Secret 数据进行加密。相关的指导信息，
请参阅[静态加密 Secret 数据](/zh-cn/docs/tasks/administer-cluster/encrypt-data/)。

<!--
### Configure least-privilege access to Secrets {#least-privilege-secrets}

When planning your access control mechanism, such as Kubernetes
{{<glossary_tooltip term_id="rbac" text="Role-based Access Control">}} [(RBAC)](/docs/reference/access-authn-authz/rbac/),
consider the following guidelines for access to `Secret` objects. You should
also follow the other guidelines in
[RBAC good practices](/docs/concepts/security/rbac-good-practices).
-->
### 配置 Secret 资源的最小特权访问   {#least-privilege-secrets}

当规划诸如 Kubernetes
{{<glossary_tooltip term_id="rbac" text="基于角色的访问控制">}} [(RBAC)](/zh-cn/docs/reference/access-authn-authz/rbac/)
这类访问控制机制时，需要注意访问 `Secret` 对象的以下指导信息。
你还应遵从 [RBAC 良好实践](/zh-cn/docs/concepts/security/rbac-good-practices)中的其他指导信息。

<!--
- **Components**: Restrict `watch` or `list` access to only the most
  privileged, system-level components. Only grant `get` access for Secrets if
  the component's normal behavior requires it.
- **Humans**: Restrict `get`, `watch`, or `list` access to Secrets. Only allow
  cluster administrators to access `etcd`. This includes read-only access. For
  more complex access control, such as restricting access to Secrets with
  specific annotations, consider using third-party authorization mechanisms.
-->
- **组件**：限制仅最高特权的系统级组件可以执行 `watch` 或 `list` 访问。
  仅在组件的正常行为需要时才授予对 Secret 的 `get` 访问权限。
- **人员**：限制对 Secret 的 `get`、`watch` 或 `list` 访问权限。仅允许集群管理员访问 `etcd`。
  这包括只读访问。对于更复杂的访问控制，例如使用特定注解限制对 Secret 的访问，请考虑使用第三方鉴权机制。

{{< caution >}}
<!--
Granting `list` access to Secrets implicitly lets the subject fetch the
contents of the Secrets.
-->
授予对 Secret 的 `list` 访问权限将意味着允许对应主体获取 Secret 的内容。
{{< /caution >}}

<!--
A user who can create a Pod that uses a Secret can also see the value of that
Secret. Even if cluster policies do not allow a user to read the Secret
directly, the same user could have access to run a Pod that then exposes the
Secret. You can detect or limit the impact caused by Secret data being exposed,
either intentionally or unintentionally, by a user with this access. Some
recommendations include:
-->
如果一个用户可以创建使用某 Secret 的 Pod，则该用户也可以看到该 Secret 的值。
即使集群策略不允许用户直接读取 Secret，同一用户也可能有权限运行 Pod 进而暴露该 Secret。
你可以检测或限制具有此访问权限的用户有意或无意地暴露 Secret 数据所造成的影响。
这里有一些建议：

<!--
*  Use short-lived Secrets
*  Implement audit rules that alert on specific events, such as concurrent
   reading of multiple Secrets by a single user
-->
* 使用生命期短暂的 Secret
* 实现对特定事件发出警报的审计规则，例如同一用户并发读取多个 Secret 时发出警报

<!--
#### Additional ServiceAccount annotations for Secret management

You can also use the `kubernetes.io/enforce-mountable-secrets` annotation on
a ServiceAccount to enforce specific rules on how Secrets are used in a Pod.
For more details, see the [documentation on this annotation](/docs/reference/labels-annotations-taints/#enforce-mountable-secrets).
-->
#### 用于 Secret 管理的附加 ServiceAccount 注解

你还可以在 ServiceAccount 上使用 `kubernetes.io/enforce-mountable-secrets`
注解来强制执行有关如何在 Pod 中使用 Secret 的特定规则。

更多详细信息，请参阅[有关此注解的文档](/zh-cn/docs/reference/labels-annotations-taints/#enforce-mountable-secrets)。

<!--
### Improve etcd management policies

Consider wiping or shredding the durable storage used by `etcd` once it is
no longer in use.

If there are multiple `etcd` instances, configure encrypted SSL/TLS
communication between the instances to protect the Secret data in transit.
-->
### 改进 etcd 管理策略   {#improve-etcd-management-policies}

不再使用 `etcd` 所使用的持久存储时，考虑擦除或粉碎这些数据。

如果存在多个 `etcd` 实例，则在实例之间配置加密的 SSL/TLS 通信以保护传输中的 Secret 数据。

<!--
### Configure access to external Secrets
-->
### 配置对外部 Secret 的访问权限   {#configure-access-to-external-secrets}

{{% thirdparty-content %}}

<!--
You can use third-party Secrets store providers to keep your confidential data
outside your cluster and then configure Pods to access that information.
The [Kubernetes Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/)
is a DaemonSet that lets the kubelet retrieve Secrets from external stores, and
mount the Secrets as a volume into specific Pods that you authorize to access
the data.
-->
你可以使用第三方 Secret 存储提供商将机密数据保存在你的集群之外，然后配置 Pod 访问该信息。
[Kubernetes Secret 存储 CSI 驱动](https://secrets-store-csi-driver.sigs.k8s.io/)是一个 DaemonSet，
它允许 kubelet 从外部存储中检索 Secret，并将 Secret 作为卷挂载到特定的、你授权访问数据的 Pod。

<!--
For a list of supported providers, refer to
[Providers for the Secret Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver).
-->
有关支持的提供商列表，请参阅
[Secret 存储 CSI 驱动的提供商](https://secrets-store-csi-driver.sigs.k8s.io/concepts.html#provider-for-the-secrets-store-csi-driver)。

<!--
## Developers

This section provides good practices for developers to use to improve the
security of confidential data when building and deploying Kubernetes resources.
-->
## 开发者   {#developers}

本节为开发者提供了构建和部署 Kubernetes 资源时用于改进机密数据安全性的良好实践。

<!--
### Restrict Secret access to specific containers

If you are defining multiple containers in a Pod, and only one of those
containers needs access to a Secret, define the volume mount or environment
variable configuration so that the other containers do not have access to that
Secret.
-->
### 限制特定容器集合才能访问 Secret     {#restrict-secret-access-to-specific-containers}

如果你在一个 Pod 中定义了多个容器，且仅其中一个容器需要访问 Secret，则可以定义卷挂载或环境变量配置，
这样其他容器就不会有访问该 Secret 的权限。

<!--
### Protect Secret data after reading

Applications still need to protect the value of confidential information after
reading it from an environment variable or volume. For example, your
application must avoid logging the secret data in the clear or transmitting it
to an untrusted party.
-->
### 读取后保护 Secret 数据   {#protect-secret-data-after-reading}

应用程序从一个环境变量或一个卷读取机密信息的值后仍然需要保护这些值。
例如，你的应用程序必须避免以明文记录 Secret 数据，还必须避免将这些数据传输给不受信任的一方。

<!--
### Avoid sharing Secret manifests

If you configure a Secret through a
{{< glossary_tooltip text="manifest" term_id="manifest" >}}, with the secret
data encoded as base64, sharing this file or checking it in to a source
repository means the secret is available to everyone who can read the manifest.
-->
### 避免共享 Secret 清单   {#avoid-shareing-secret-manifests}

如果你通过{{< glossary_tooltip text="清单（Manifest）" term_id="manifest" >}}配置 Secret，
同时将该 Secret 数据编码为 base64，
那么共享此文件或将其检入一个源代码仓库就意味着有权读取该清单的所有人都能使用该 Secret。

{{< caution >}}
<!--
Base64 encoding is _not_ an encryption method, it provides no additional
confidentiality over plain text.
-->
Base64 编码**不是**一种加密方法，它没有为纯文本提供额外的保密机制。
{{< /caution >}}
