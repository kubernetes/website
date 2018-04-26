---
assignees:
- timstclair
- deads2k
- liggitt
- ericchiang
title: Using Node Authorization
---

* TOC
{:toc}

<!-- Node authorization is a special-purpose authorization mode that specifically authorizes API requests made by kubelets. -->

节点认证是为了让节点能够通过kubelets 来调用master api 的一种特殊的认证

## Overview

<!-- The Node authorizer allows a kubelet to perform API operations. This includes: -->

节点认证能够允许kubelet通过调用master的api 来完成一些操作.这些操作包括：

<!-- Read operations: -->

读取操作：

<!-- * services
* endpoints
* nodes
* pods
* secrets, configmaps, persistent volume claims and persistent volumes related to pods bound to the kubelet's node -->

* 服务
* 后端节点
* 服务器节点
* 容器
* secretes,configmaps, pod相关的持久性存储（pv,pvc）的绑定信息，以及kubelet的节点信息

<!-- Write operations: -->
写入操作：

<!-- * nodes and node status (enable the `NodeRestriction` admission plugin to limit a kubelet to modify its own node)
* pods and pod status (enable the `NodeRestriction` admission plugin to limit a kubelet to modify pods bound to itself)
* events -->

* 服务节点和服务节点的状态（启动NodeRestriction插件来限制kubelet来修改自己所在的节点）
* pod 和 pod的状态（启动NodeRestriction 插件来限制kubelet来修改自己所在节点上的pod）
* events 事件

<!-- Auth-related operations: -->

认证相关的操作：

<!-- * read/write access to the certificationsigningrequests API for TLS bootstrapping
* the ability to create tokenreviews and subjectaccessreviews for delegated authentication/authorization checks -->

* 对证书请求API的TLS 引导调用的读写权限
* 能够创建认证密要来完成主题的读写以及对认证和授权的检查

<!-- In future releases, the node authorizer may add or remove permissions to ensure kubelets
have the minimal set of permissions required to operate correctly. -->

在将来，节点的认证可能会增加，也可能会减少，这样做的目的是让我们的node节点拥有最少但是足够的权限来完成正确的操作所需

<!-- In order to be authorized by the Node authorizer, kubelets must use a credential that identifies them as 
being in the `system:nodes` group, with a username of `system:node:<nodeName>`.
This group and user name format match the identity created for each kubelet as part of 
[kubelet TLS bootstrapping](/docs/admin/kubelet-tls-bootstrapping/). -->

为了通过节点的认证，kubelets 必须使用 正确的 证书来证明自己的角色是 ‘system:nodes’ ,并且用户名是 ‘system:node<nodename>’
这个system:nodes组合用户名的格式必须与为每个kubelet创建的相一致，具体的参见
[kubelet TLS bootstrapping](/docs/admin/kubelet-tls-bootstrapping/).

<!-- To enable the Node authorizer, start the apiserver with `--authorization-mode=Node`. -->
启动节点认证，需要我们在启动apiserver的时候添加参数 `--authorization-mode=Node`

<!-- To limit the API objects kubelets are able to write, enable the [NodeRestriction](/docs/admin/admission-controllers#NodeRestriction) admission plugin by starting the apiserver with `--admission-control=...,NodeRestriction,...` -->

如果想限制kubelets所能调取的api 功能，可以通过激活 插件 [NodeRestriction](/docs/admin/admission-controllers#NodeRestriction) ，具体的激活方法就是在启动时候追加如下参数`--admission-control=...,NodeRestriction,...`

<!-- ## Migration considerations -->
## 关于迁移的考虑

<!-- ### Kubelets outside the `system:nodes` group -->
### 哪些不在`system:nodes` 组中的Kubelets 

<!-- Kubelets outside the `system:nodes` group would not be authorized by the `Node` authorization mode,
and would need to continue to be authorized via whatever mechanism currently authorizes them.
The node admission plugin would not restrict requests from these kubelets. -->

如果Kubelets 不在 `system:nodes` 组中， 就不能作为 节点Node被认证，这就需要继续通过其他的途径来认证node节点的身份
节点上的admission插件不会限制这些kubelets的请求

<!-- ### Kubelets with undifferentiated usernames -->
### 拥有相同用户名的Kubelets


<!-- In some deployments, kubelets have credentials that place them in the `system:nodes` group,
but do not identify the particular node they are associated with,
because they do not have a username in the `system:node:...` format.
These kubelets would not be authorized by the `Node` authorization mode,
and would need to continue to be authorized via whatever mechanism currently authorizes them. -->

在一些部署的环境中，kubelets 有正确的证书来证明自己属于`system:nodes`组，但是没有正确的证书证明自己和哪个node管理，因为他们又有 格式为`system:node:...`的用户名这种情况的kubelets不能够被认证通过Node的身份，这些kubelets需要继续使用其他的机制来完成合格认证

<!-- The `NodeRestriction` admission plugin would ignore requests from these kubelets,
since the default node identifier implementation would not consider that a node identity. -->

并且插件 `NodeRestriction` 会忽略来自这些未通过认证的kubelets的请求，因为默认的节点认证信息不能够被认为是一个有效的节点认证信息

<!-- ### Upgrades from previous versions using RBAC -->

### 相对于之前版本使用RBAC的更新

<!-- Upgraded pre-1.7 clusters using [RBAC](/docs/admin/authorization/rbac/) will continue functioning as-is because the `system:nodes` group binding will already exist. -->



<!-- If a cluster admin wishes to start using the `Node` authorizer and `NodeRestriction` admission plugin
to limit node access to the API, that can be done non-disruptively: -->

如果管理员希望启用节点认证和管理插件NodeRestriction

<!-- 1. Enable the `Node` authorization mode (`--authorization-mode=Node,RBAC`) and the `NodeRestriction` admission plugin
2. Ensure all kubelets' credentials conform to the group/username requirements
3. Audit apiserver logs to ensure the `Node` authorizer is not rejecting requests from kubelets (no persistent `NODE DENY` messages logged)
4. Delete the `system:node` cluster role binding -->

1. 启用节点认证模式(`--authorization-mode=Node,RBAC`),并且启用管理插件`NodeRestriction`
2. 确保所有的kubeletes 证书 满足 组 和 用户名的验证
3. 修改apiserver的日志，确保节点认证不会被拒绝（日志中不存在 关键词 `NODE DENY`）
4. 删除角色 `system:node` 的绑定

<!-- ### RBAC Node Permissions -->

### RBAC Node 权限

<!-- In 1.6, the `system:node` cluster role was automatically bound to the `system:nodes` group when using the [RBAC Authorization mode](/docs/admin/authorization/rbac/). -->

在版本1.6中 ， 角色`system:node`会自动的和 `system:node`组绑定，当你使用[RBAC Authorization mode](/docs/admin/authorization/rbac/).

<!-- In 1.7, the automatic binding of the `system:nodes` group to the `system:node` role is deprecated
because the node authorizer accomplishes the same purpose with the benefit of additional restrictions
on secret and configmap access. If the `Node` and `RBAC` authorization modes are both enabled,
the automatic binding of the `system:nodes` group to the `system:node` role is not created in 1.7. -->

在版本1.7中，自动绑定`system:nodes`组到`system:node`的方式是不建议的，因为节点认证的作用是一样的，这得力于secrete和configmap权限的控制。如果NODE和RBAC认证同时启用自动绑定`system:nodes`到`system:node`角色的功能是不会自动启动的

<!-- In 1.8, the binding will not be created at all. -->

<!-- When using RBAC, the `system:node` cluster role will continue to be created,
for compatibility with deployment methods that bind other users or groups to that role. -->

在版本1.8中，绑定这个功能直接不会出现
当使用RBAC的时候 `system:node` 角色还是会被创建，主要是为了兼容绑定其他的用户和组到这个角色

