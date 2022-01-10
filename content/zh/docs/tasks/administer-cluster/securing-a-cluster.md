---
title: 保护集群安全
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
本文档涉及与保护集群免受意外或恶意访问有关的主题，并对总体安全性提出建议。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Controlling access to the Kubernetes API

As Kubernetes is entirely API-driven, controlling and limiting who can access the cluster and what actions
they are allowed to perform is the first line of defense.
-->
## 控制对 Kubernetes API 的访问

因为 Kubernetes 是完全通过 API 驱动的，所以，控制和限制谁可以通过 API 访问集群，以及允许这些访问者执行什么样的 API 动作，就成为了安全控制的第一道防线。

<!--
### Use Transport Layer Security (TLS) for all API traffic

Kubernetes expects that all API communication in the cluster is encrypted by default with TLS, and the
majority of installation methods will allow the necessary certificates to be created and distributed to
the cluster components. Note that some components and installation methods may enable local ports over
HTTP and administrators should familiarize themselves with the settings of each component to identify
potentially unsecured traffic.
-->
### 为所有 API 交互使用传输层安全 （TLS）

Kubernetes 期望集群中所有的 API 通信在默认情况下都使用 TLS 加密，大多数安装方法也允许创建所需的证书并且分发到集群组件中。请注意，某些组件和安装方法可能使用 HTTP 来访问本地端口， 管理员应该熟悉每个组件的设置，以识别潜在的不安全的流量。

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
### API 认证

安装集群时，选择一个 API 服务器的身份验证机制，去使用与之匹配的公共访问模式。
例如，小型的单用户集群可能希望使用简单的证书或静态承载令牌方法。
更大的集群则可能希望整合现有的、OIDC、LDAP 等允许用户分组的服务器。

所有 API 客户端都必须经过身份验证，即使它是基础设施的一部分，比如节点、代理、调度程序和卷插件。
这些客户端通常使用 [服务帐户](/zh/docs/reference/access-authn-authz/service-accounts-admin/)
或 X509 客户端证书，并在集群启动时自动创建或是作为集群安装的一部分进行设置。

如果你希望获取更多信息，请参考[认证参考文档](/zh/docs/reference/access-authn-authz/authentication/)。

<!--
### API Authorization

Once authenticated, every API call is also expected to pass an authorization check. Kubernetes ships
an integrated [Role-Based Access Control (RBAC)](/docs/reference/access-authn-authz/rbac/) component that matches an incoming user or group to a
set of permissions bundled into roles. These permissions combine verbs (get, create, delete) with
resources (pods, services, nodes) and can be namespace-scoped or cluster-scoped. A set of out-of-the-box
roles are provided that offer reasonable default separation of responsibility depending on what
actions a client might want to perform. It is recommended that you use the [Node](/docs/reference/access-authn-authz/node/) and [RBAC](/docs/reference/access-authn-authz/rbac/) authorizers together, in combination with the
[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) admission plugin.
-->
### API 授权

一旦通过身份认证，每个 API 的调用都将通过鉴权检查。
Kubernetes 集成[基于角色的访问控制（RBAC）](/zh/docs/reference/access-authn-authz/rbac/)组件，
将传入的用户或组与一组绑定到角色的权限匹配。
这些权限将动作（get，create，delete）和资源（pod，service, node）在命名空间或者集群范围内结合起来，
根据客户可能希望执行的操作，提供了一组提供合理的违约责任分离的外包角色。
建议你将[节点](/zh/docs/reference/access-authn-authz/node/) 和
[RBAC](/zh/docs/reference/access-authn-authz/rbac/) 一起作为授权者，再与
[NodeRestriction](/zh/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
准入插件结合使用。

<!--
As with authentication, simple and broad roles may be appropriate for smaller clusters, but as
more users interact with the cluster, it may become necessary to separate teams into separate
namespaces with more limited roles.
-->
与身份验证一样，简单而广泛的角色可能适合于较小的集群，但是随着更多的用户与集群交互，
可能需要将团队划分成有更多角色限制的单独的命名空间。

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
就鉴权而言，理解怎么样更新一个对象可能导致在其它地方的发生什么样的行为是非常重要的。
例如，用户可能不能直接创建 Pod，但允许他们通过创建一个 Deployment 来创建这些 Pod，
这将让他们间接创建这些 Pod。
同样地，从 API 删除一个节点将导致调度到这些节点上的 Pod 被中止，并在其他节点上重新创建。
原生的角色设计代表了灵活性和常见用例之间的平衡，但有限制的角色应该仔细审查，
以防止意外升级。如果外包角色不满足你的需求，则可以为用例指定特定的角色。

如果你希望获取更多信息，请参阅[鉴权参考](/zh/docs/reference/access-authn-authz/authorization/)。

<!--
## Controlling access to the Kubelet

Kubelets expose HTTPS endpoints which grant powerful control over the node and containers. By default Kubelets allow unauthenticated access to this API.

Production clusters should enable Kubelet authentication and authorization.

Consult the [Kubelet authentication/authorization reference](/docs/admin/kubelet-authentication-authorization) for more information.
-->
## 控制对 Kubelet 的访问

Kubelet 公开 HTTPS 端点，这些端点授予节点和容器强大的控制权。
默认情况下，Kubelet 允许对此 API 进行未经身份验证的访问。

生产级别的集群应启用 Kubelet 身份验证和授权。

如果你希望获取更多信息，请参考
[Kubelet 身份验证/授权参考](/zh/docs/reference/command-line-tools-reference/kubelet-authentication-authorization/)。

<!--
## Controlling the capabilities of a workload or user at runtime

Authorization in Kubernetes is intentionally high level, focused on coarse actions on resources.
More powerful controls exist as **policies** to limit by use case how those objects act on the
cluster, themselves, and other resources.
-->
## 控制运行时负载或用户的能力

Kubernetes 中的授权故意设置为了高层级，它侧重于对资源的粗粒度行为。
更强大的控制是以通过用例限制这些对象如何作用于集群、自身和其他资源上的**策略**存在的。

<!--
### Limiting resource usage on a cluster

[Resource quota](/docs/concepts/policy/resource-quotas/) limits the number or capacity of
resources granted to a namespace. This is most often used to limit the amount of CPU, memory,
or persistent disk a namespace can allocate, but can also control how many pods, services, or
volumes exist in each namespace.

[Limit ranges](/docs/tasks/administer-cluster/memory-default-namespace/) restrict the maximum or minimum size of some of the
resources above, to prevent users from requesting unreasonably high or low values for commonly
reserved resources like memory, or to provide default limits when none are specified.
-->
### 限制集群上的资源使用

[资源配额](/zh/docs/concepts/policy/resource-quotas/)
限制了授予命名空间的资源的数量或容量。
这通常用于限制命名空间可以分配的 CPU、内存或持久磁盘的数量，但也可以控制
每个命名空间中有多少个 Pod、服务或卷的存在。

[限制范围](/zh/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)限制
上述某些资源的最大值或者最小值，以防止用户使用类似内存这样的通用保留资源时请求
不合理的过高或过低的值，或者在没有指定的情况下提供默认限制。

<!--
### Controlling what privileges containers run with

A pod definition contains a [security context](/docs/tasks/configure-pod-container/security-context/)
that allows it to request access to run as a specific Linux user on a node (like root),
access to run privileged or access the host network, and other controls that would otherwise
allow it to run unfettered on a hosting node. [Pod security policies](/docs/concepts/policy/pod-security-policy/)
can limit which users or service accounts can provide dangerous security context settings. For example, pod security policies can limit volume mounts, especially `hostPath`, which are aspects of a pod that should be controlled.
-->
### 控制容器运行的特权

Pod 定义包含了一个[安全上下文](/zh/docs/tasks/configure-pod-container/security-context/)，
用于描述允许它请求访问某个节点上的特定 Linux 用户（如 root）、获得特权或访问主机网络、
以及允许它在主机节点上不受约束地运行的其它控件。
[Pod 安全策略](/zh/docs/concepts/policy/pod-security-policy/)
可以限制哪些用户或服务帐户可以提供危险的安全上下文设置。
例如，Pod 的安全策略可以限制卷挂载，尤其是 `hostpath`，这些都是 Pod 应该控制的一些方面。

<!--
Generally, most application workloads need limited access to host resources so they can
successfully run as a root process (uid 0) without access to host information. However,
considering the privileges associated with the root user, you should write application
containers to run as a non-root user. Similarly, administrators who wish to prevent
client applications from escaping their containers should use a restrictive pod security
policy.
-->
一般来说，大多数应用程序需要限制对主机资源的访问，
他们可以在不能访问主机信息的情况下成功以根进程（UID 0）运行。
但是，考虑到与 root 用户相关的特权，在编写应用程序容器时，你应该使用非 root 用户运行。
类似地，希望阻止客户端应用程序逃避其容器的管理员，应该使用限制性的 pod 安全策略。

<!--
### Restricting network access

The [network policies](/docs/tasks/administer-cluster/declare-network-policy/) for a namespace
allows application authors to restrict which pods in other namespaces may access pods and ports
within their namespaces. Many of the supported [Kubernetes networking providers](/docs/concepts/cluster-administration/networking/)
now respect network policy.
-->
### 限制网络访问

基于命名空间的[网络策略](/zh/docs/tasks/administer-cluster/declare-network-policy/)
允许应用程序作者限制其它命名空间中的哪些 Pod 可以访问它们命名空间内的 Pod 和端口。
现在已经有许多支持网络策略的
[Kubernetes 网络供应商](/zh/docs/concepts/cluster-administration/networking/)。

<!--
Quota and limit ranges can also be used to control whether users may request node ports or
load-balanced services, which on many clusters can control whether those users applications
are visible outside of the cluster.

Additional protections may be available that control network rules on a per-plugin or
per-environment basis, such as per-node firewalls, physically separating cluster nodes to
prevent cross talk, or advanced networking policy.
-->
对于可以控制用户的应用程序是否在集群之外可见的许多集群，配额和限制范围也可用于
控制用户是否可以请求节点端口或负载均衡服务。

在插件或者环境基础上控制网络规则可以增加额外的保护措施，比如节点防火墙、物理分离
群集节点以防止串扰、或者高级的网络策略。

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
### 限制云 metadata API 访问

云平台（AWS,  Azure, GCE 等）经常讲 metadate 本地服务暴露给实例。
默认情况下，这些 API 可由运行在实例上的 Pod 访问，并且可以包含
该云节点的凭据或配置数据（如 kubelet 凭据）。
这些凭据可以用于在集群内升级或在同一账户下升级到其他云服务。

在云平台上运行 Kubernetes 时，限制对实例凭据的权限，使用
[网络策略](/zh/docs/tasks/administer-cluster/declare-network-policy/)
限制对 metadata API 的 pod 访问，并避免使用配置数据来传递机密。

<!--
### Controlling which nodes pods may access

By default, there are no restrictions on which nodes may run a pod.  Kubernetes offers a
[rich set of policies for controlling placement of pods onto nodes](/docs/concepts/configuration/assign-pod-node/)
and the [taint-based pod placement and eviction](/docs/concepts/configuration/taint-and-toleration/)
that are available to end users. For many clusters use of these policies to separate workloads
can be a convention that authors adopt or enforce via tooling.

As an administrator, a beta admission plugin `PodNodeSelector` can be used to force pods
within a namespace to default or require a specific node selector, and if end users cannot
alter namespaces, this can strongly limit the placement of all of the pods in a specific workload.
-->
### 控制 Pod 可以访问哪些节点

默认情况下，对哪些节点可以运行 pod 没有任何限制。
Kubernetes 给最终用户提供了
[一组丰富的策略用于控制 pod 放在节点上的位置](/zh/docs/concepts/scheduling-eviction/assign-pod-node/)，
以及[基于污点的 Pod 放置和驱逐](/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)。
对于许多集群，可以约定由作者采用或者强制通过工具使用这些策略来分离工作负载。

对于管理员，Beta 阶段的准入插件 `PodNodeSelector` 可用于强制命名空间中的 Pod
使用默认或需要使用特定的节点选择器。
如果最终用户无法改变命名空间，这可以强烈地限制所有的 pod 在特定工作负载的位置。

<!--
## Protecting cluster components from compromise

This section describes some common patterns for protecting clusters from compromise.
-->
## 保护集群组件免受破坏

本节描述保护集群免受破坏的一些常见模式。

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
### 限制访问 etcd

对于 API 来说，拥有 etcd 后端的写访问权限，相当于获得了整个集群的 root 权限，
并且可以使用写访问权限来相当快速地升级。
从 API 服务器访问它们的 etcd 服务器，管理员应该使用广受信任的凭证，
如通过 TLS 客户端证书的相互认证。
通常，我们建议将 etcd 服务器隔离到只有API服务器可以访问的防火墙后面。

{{< caution >}}
允许集群中其它组件拥有读或写全空间的权限去访问 etcd 实例，相当于授予群集管理员访问的权限。
对于非主控组件，强烈推荐使用单独的 etcd 实例，或者使用 etcd 的访问控制列表
去限制只能读或者写空间的一个子集。
{{< /caution >}}

<!--
### Enable audit logging

The [audit logger](/docs/tasks/debug-application-cluster/audit/) is a beta feature that records actions taken by the
API for later analysis in the event of a compromise. It is recommended to enable audit logging
and archive the audit file on a secure server.
-->
### 开启审计日志

[审计日志](/zh/docs/tasks/debug-application-cluster/audit/)是 Beta 特性，
负责记录 API 操作以便在发生破坏时进行事后分析。
建议启用审计日志，并将审计文件归档到安全服务器上。

<!--
### Restrict access to alpha or beta features

Alpha and beta Kubernetes features are in active development and may have limitations or bugs
that result in security vulnerabilities. Always assess the value an alpha or beta feature may
provide against the possible risk to your security posture. When in doubt, disable features you
do not use.
-->
### 限制使用 alpha 和 beta 特性

Kubernetes 的 alpha 和 beta 特性还在努力开发中，可能存在导致安全漏洞的缺陷或错误。
要始终评估 alpha 和 beta 特性可能为你的安全态势带来的风险。
当你怀疑存在风险时，可以禁用那些不需要使用的特性。

<!--
### Rotate infrastructure credentials frequently

The shorter the lifetime of a secret or credential the harder it is for an attacker to make
use of that credential. Set short lifetimes on certificates and automate their rotation. Use
an authentication provider that can control how long issued tokens are available and use short
lifetimes where possible. If you use service-account tokens in external integrations, plan to
rotate those tokens frequently. For example, once the bootstrap phase is complete, a bootstrap token used for setting up nodes should be revoked or its authorization removed.
-->
### 频繁回收基础设施证书

一个 Secret 或凭据的寿命越短，攻击者就越难使用该凭据。
在证书上设置短生命周期并实现自动回收，是控制安全的一个好方法。
因此，使用身份验证提供程序时，应该要求可以控制发布令牌的可用时间，并尽可能使用短寿命。
如果在外部集成中使用服务帐户令牌，则应该频繁地回收这些令牌。
例如，一旦引导阶段完成，就应该撤销用于设置节点的引导令牌，或者取消它的授权。

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
[pod security policies](/docs/concepts/policy/pod-security-policy/).
-->
### 在启用第三方集成之前，请先审查它们

许多集成到 Kubernetes 的第三方都可以改变你集群的安全配置。
启用集成时，在授予访问权限之前，你应该始终检查扩展所请求的权限。
例如，许多安全集成可以请求访问来查看集群上的所有 Secret，
从而有效地使该组件成为集群管理。
当有疑问时，如果可能的话，将集成限制在单个命名空间中运行。

如果组件创建的 Pod 能够在命名空间中做一些类似 `kube-system` 命名空间中的事情，
那么它也可能是出乎意料的强大。
因为这些 Pod 可以访问服务账户的 Secret，或者，如果这些服务帐户被授予访问许可的
[Pod 安全策略](/zh/docs/concepts/policy/pod-security-policy/)的权限，它们能以高权限运行。

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
### 对 Secret 进行静态加密

一般情况下，etcd 数据库包含了通过 Kubernetes API 可以访问到的所有信息，
并且可以授予攻击者对集群状态的可见性。
始终使用经过良好审查的备份和加密解决方案来加密备份，并考虑在可能的情况下使用全磁盘加密。

Kubernetes 支持 [静态数据加密](/zh/docs/tasks/administer-cluster/encrypt-data/)，
该功能在 1.7 版本引入，并在 1.13 版本成为 Beta。它会加密 etcd 里面的 `Secret` 资源，以防止某一方通过查看
etcd 的备份文件查看到这些 Secret 的内容。虽然目前这还只是 Beta 阶段的功能，
但是在备份没有加密或者攻击者获取到 etcd 的读访问权限的时候，它能提供额外的防御层级。

<!--
### Receiving alerts for security updates and reporting vulnerabilities

Join the [kubernetes-announce](https://groups.google.com/forum/#!forum/kubernetes-announce)
group for emails about security announcements. See the [security reporting](/security/)
page for more on how to report vulnerabilities.
-->
### 接收安全更新和报告漏洞的警报

加入 [kubernetes-announce](https://groups.google.com/forum/#!forum/kubernetes-announce)
组，能够获取有关安全公告的邮件。有关如何报告漏洞的更多信息，请参见
[安全报告](/zh/docs/reference/issues-security/security/)页面。




