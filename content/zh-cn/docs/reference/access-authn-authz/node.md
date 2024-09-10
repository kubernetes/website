---
title: 使用 Node 鉴权
content_type: concept
weight: 34
---
<!--
reviewers:
- timstclair
- deads2k
- liggitt
title: Using Node Authorization
content_type: concept
weight: 34
-->

<!-- overview -->

<!--
Node authorization is a special-purpose authorization mode that specifically
authorizes API requests made by kubelets.
-->
节点鉴权是一种特殊用途的鉴权模式，专门对 kubelet 发出的 API 请求进行授权。

<!-- body -->

<!--
## Overview
-->
## 概述   {#overview}

<!--
The Node authorizer allows a kubelet to perform API operations. This includes:
-->
节点鉴权器允许 kubelet 执行 API 操作。包括：

<!--
Read operations:
-->
读取操作：

<!--
* services
* endpoints
* nodes
* pods
* secrets, configmaps, persistent volume claims and persistent volumes related
  to pods bound to the kubelet's node
-->
* services
* endpoints
* nodes
* pods
* 与绑定到 kubelet 节点的 Pod 相关的 Secret、ConfigMap、PersistentVolumeClaim 和持久卷

<!--
Write operations:
-->
写入操作：

<!--
* nodes and node status (enable the `NodeRestriction` admission plugin to limit
  a kubelet to modify its own node)
* pods and pod status (enable the `NodeRestriction` admission plugin to limit a
  kubelet to modify pods bound to itself)
* events
-->
* 节点和节点状态（启用 `NodeRestriction` 准入插件以限制 kubelet 只能修改自己的节点）
* Pod 和 Pod 状态 (启用 `NodeRestriction` 准入插件以限制 kubelet 只能修改绑定到自身的 Pod)
* 事件

<!--
Auth-related operations:
-->
身份认证与鉴权相关的操作：

<!--
* read/write access to the
  [CertificateSigningRequests API](/docs/reference/access-authn-authz/certificate-signing-requests/)
  for TLS bootstrapping
* the ability to create TokenReviews and SubjectAccessReviews for delegated
  authentication/authorization checks
-->
* 对于基于 TLS 的启动引导过程时使用的
  [certificationsigningrequests API](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
  的读/写权限
* 为委派的身份验证/鉴权检查创建 TokenReview 和 SubjectAccessReview 的能力

<!--
In future releases, the node authorizer may add or remove permissions to ensure
kubelets have the minimal set of permissions required to operate correctly.
-->
在将来的版本中，节点鉴权器可能会添加或删除权限，以确保 kubelet 具有正确操作所需的最小权限集。

<!--
In order to be authorized by the Node authorizer, kubelets must use a credential
that identifies them as being in the `system:nodes` group, with a username of
`system:node:<nodeName>`.
This group and user name format match the identity created for each kubelet as part of 
[kubelet TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/).
-->
为了获得节点鉴权器的授权，kubelet 必须使用一个凭据以表示它在 `system:nodes`
组中，用户名为 `system:node:<nodeName>`。上述的组名和用户名格式要与
[kubelet TLS 启动引导](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
过程中为每个 kubelet 创建的标识相匹配。

<!--
The value of `<nodeName>` **must** match precisely the name of the node as
registered by the kubelet. By default, this is the host name as provided by
`hostname`, or overridden via the
[kubelet option](/docs/reference/command-line-tools-reference/kubelet/)
`--hostname-override`. However, when using the `--cloud-provider` kubelet
option, the specific hostname may be determined by the cloud provider, ignoring
the local `hostname` and the `--hostname-override` option. 
For specifics about how the kubelet determines the hostname, see the
[kubelet options reference](/docs/reference/command-line-tools-reference/kubelet/).
-->
`<nodeName>` 的值**必须**与 kubelet 注册的节点名称精确匹配。默认情况下，节点名称是由
`hostname` 提供的主机名，或者通过 kubelet `--hostname-override`
[选项](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 覆盖。
但是，当使用 `--cloud-provider` kubelet 选项时，具体的主机名可能由云提供商确定，
忽略本地的 `hostname` 和 `--hostname-override` 选项。有关
kubelet 如何确定主机名的详细信息，请参阅
[kubelet 选项参考](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)。

<!--
To enable the Node authorizer, start the apiserver with `--authorization-mode=Node`.
-->
要启用节点鉴权器，请使用 `--authorization-mode=Node` 启动 API 服务器。

<!--
To limit the API objects kubelets are able to write, enable the
[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers#noderestriction)
admission plugin by starting the apiserver with
`--enable-admission-plugins=...,NodeRestriction,...`
-->
要限制 kubelet 可以写入的 API 对象，请使用
`--enable-admission-plugins=...,NodeRestriction,...` 启动 API 服务器，从而启用
[NodeRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers#NodeRestriction)
准入插件。

<!--
## Migration considerations
-->
## 迁移考虑因素   {#migration-considerations}

<!--
### Kubelets outside the `system:nodes` group
-->
### 在 `system:nodes` 组之外的 kubelet   {#kubelets-outside-the-system-nodes-group}

<!--
Kubelets outside the `system:nodes` group would not be authorized by the `Node`
authorization mode, and would need to continue to be authorized via whatever
mechanism currently authorizes them.
The node admission plugin would not restrict requests from these kubelets.
-->
`system:nodes` 组之外的 kubelet 不会被 `Node` 鉴权模式授权，并且需要继续通过当前授权它们的机制来授权。
节点准入插件不会限制来自这些 kubelet 的请求。

<!--
### Kubelets with undifferentiated usernames
-->
### 具有无差别用户名的 kubelet   {#kubelets-with-undifferentiated-usernames}

<!--
In some deployments, kubelets have credentials that place them in the `system:nodes` group,
but do not identify the particular node they are associated with,
because they do not have a username in the `system:node:...` format.
These kubelets would not be authorized by the `Node` authorization mode,
and would need to continue to be authorized via whatever mechanism currently authorizes them.
-->
在一些部署中，kubelet 具有 `system:nodes` 组的凭据，
但是无法给出它们所关联的节点的标识，因为它们没有 `system:node:...` 格式的用户名。
这些 kubelet 不会被 `Node` 鉴权模式授权，并且需要继续通过当前授权它们的任何机制来授权。

<!--
The `NodeRestriction` admission plugin would ignore requests from these kubelets,
since the default node identifier implementation would not consider that a node identity.
-->
因为默认的节点标识符实现不会把它当作节点身份标识，`NodeRestriction`
准入插件会忽略来自这些 kubelet 的请求。
