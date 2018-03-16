---
title: 使用节点授权
---

* TOC
{:toc}

Node authorization is a special-purpose authorization mode that specifically authorizes API requests made by kubelets.
节点授权是一种专门授权由kubelets发出的API请求的特殊用途授权模式。

## 概览

The Node authorizer allows a kubelet to perform API operations. This includes:
节点授权允许一个 kubelet 执行一些API操作,包括：

Read operations:
读取操作:

* services
* endpoints
* nodes
* pods
* secrets, configmaps, persistent volume claims and persistent volumes related to pods bound to the kubelet's node

Write operations:
写入操作:

* nodes and node status (enable the `NodeRestriction` admission plugin to limit a kubelet to modify its own node)
* pods and pod status (enable the `NodeRestriction` admission plugin to limit a kubelet to modify pods bound to itself)
* events

Auth-related operations:
与 Auth 相关的操作:

* read/write access to the certificationsigningrequests API for TLS bootstrapping
* the ability to create tokenreviews and subjectaccessreviews for delegated authentication/authorization checks

In future releases, the node authorizer may add or remove permissions to ensure kubelets
have the minimal set of permissions required to operate correctly.
在未来的发行版中，节点授权也许会 加入 或 删除 permissions 来确保 kubelets 所需的最小权限集能够正常工作。

In order to be authorized by the Node authorizer, kubelets must use a credential that identifies them as 
being in the `system:nodes` group, with a username of `system:node:<nodeName>`.
This group and user name format match the identity created for each kubelet as part of 
[kubelet TLS bootstrapping](/docs/admin/kubelet-tls-bootstrapping/).
为了能够得到节点授权者的授权，kebelets 必须使用一个带有用户名`system:node:<nodeName>`的标记以识别它们在`system:nodes`组，
该组和用户名格式与为每个kubelet创建的作为[kubelet TLS bootstrapping](/docs/admin/kubelet-tls-bootstrapping/)的标记相匹配

To enable the Node authorizer, start the apiserver with `--authorization-mode=Node`.
要启用节点授权，需要使用`--authorization-mode=Node`参数来启动 api服务器。

To limit the API objects kubelets are able to write, enable the [NodeRestriction](/docs/admin/admission-controllers#NodeRestriction) admission plugin by starting the apiserver with `--admission-control=...,NodeRestriction,...`
要限制kubelets能够写入的API对象，在启动api服务器时使用`--admission-control=...,NodeRestriction,...`启用准入插件 [NodeRestriction](/docs/admin/admission-controllers#NodeRestriction)

## Migration considerations
## 迁移注意事项

### Kubelets outside the `system:nodes` group
### 组`system:nodes`外的Kubelets

Kubelets outside the `system:nodes` group would not be authorized by the `Node` authorization mode,
and would need to continue to be authorized via whatever mechanism currently authorizes them.
The node admission plugin would not restrict requests from these kubelets.
`system：nodes`组之外的Kubelets不会被`Node`授权模式授权，
并且需要通过当前授权它们的机制继续授权。
节点准入插件不会限制来自这些kubelets的请求。

### Kubelets with undifferentiated usernames
## 具有未分化用户名的 Kubelets

In some deployments, kubelets have credentials that place them in the `system:nodes` group,
but do not identify the particular node they are associated with,
because they do not have a username in the `system:node:...` format.
These kubelets would not be authorized by the `Node` authorization mode,
and would need to continue to be authorized via whatever mechanism currently authorizes them.
在某些部署中，虽然kubelets具有将它们放置在`system：nodes`组中的标记，
但不会标识与它们相关联的特定节点，因为它们没有`system：node：...`格式的用户名。 
这些kubelets将不会被`Node`授权模式授权，并且需要通过当前授权的机制继续授权。


The `NodeRestriction` admission plugin would ignore requests from these kubelets,
since the default node identifier implementation would not consider that a node identity.
`NodeRestriction`准入插件会忽略来自这些kubelets的请求，因为默认的节点标记实现不会认为这是一个节点标记。

### Upgrades from previous versions using RBAC
### 从旧的RBAC版本升级

Upgraded pre-1.7 clusters using [RBAC](/docs/admin/authorization/rbac/) will continue functioning as-is because the `system:nodes` group binding will already exist.
升级完成的使用[RBAC](/docs/admin/authorization/rbac/)的 per-1.7 版的群集将继续按原样运行，因为`system：nodes`组的绑定已经存在。

If a cluster admin wishes to start using the `Node` authorizer and `NodeRestriction` admission plugin
to limit node access to the API, that can be done non-disruptively:
如果集群管理员希望开始使用`Node`授权者和`NodeRestriction`准入插件来限制节点对API的访问，这可以平滑的完成：

1. Enable the `Node` authorization mode (`--authorization-mode=Node,RBAC`) and the `NodeRestriction` admission plugin
2. Ensure all kubelets' credentials conform to the group/username requirements
3. Audit apiserver logs to ensure the `Node` authorizer is not rejecting requests from kubelets (no persistent `NODE DENY` messages logged)
4. Delete the `system:node` cluster role binding
1. 启用`Node`授权模式（`--authorization-mode = Node，RBAC`）和`NodeRestriction`准入插件
2. 确保所有kubelets的凭据符合 组/用户名 要求
3. 审计 apiserver logs 以确保`Node`授权者不拒绝来自kubelets的请求（没有持久的`NODE DENY`消息记录）
4. 删除`system：node`集群角色绑定

### RBAC Node Permissions
### RBAC节点权限

In 1.6, the `system:node` cluster role was automatically bound to the `system:nodes` group when using the [RBAC Authorization mode](/docs/admin/authorization/rbac/).
在1.6中，当使用[RBAC 授权模式](/docs/admin/authorization/rbac/).时，`system：node`集群角色自动绑定到`system：nodes`组。

In 1.7, the automatic binding of the `system:nodes` group to the `system:node` role is deprecated
because the node authorizer accomplishes the same purpose with the benefit of additional restrictions
on secret and configmap access. If the `Node` and `RBAC` authorization modes are both enabled,
the automatic binding of the `system:nodes` group to the `system:node` role is not created in 1.7.
在1.7中，`system：nodes`组与`system：node`角色的自动绑定已被弃用，
因为节点授权人完成相同的目的，并受益于对 secret 和 configmap 访问的额外限制。
如果启用了`Node`和`RBAC`授权模式，`system：nodes`组到`system：node`角色的自动绑定不会在1.7中创建。

In 1.8, the binding will not be created at all.
在1.8中，这个绑定根本就不会被创建

When using RBAC, the `system:node` cluster role will continue to be created,
for compatibility with deployment methods that bind other users or groups to that role.
在使用RBAC时，为了与将其他用户或组绑定到该角色的部署方法兼容，将继续创建`system：node`集群角色。