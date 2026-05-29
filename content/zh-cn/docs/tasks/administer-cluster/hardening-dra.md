---
title: 在集群中强化动态资源分配（DRA）
content_type: task
weight: 330
---
<!--
title: Harden Dynamic Resource Allocation in Your Cluster
content_type: task
weight: 330
-->

<!-- overview -->

<!--
This page shows cluster administrators how to harden authorization for
Dynamic Resource Allocation (DRA), with a focus on least-privilege access for
`ResourceClaim` status updates.
-->
本页面展示集群管理员如何强化动态资源分配（DRA）的授权，
重点关注 `ResourceClaim` 状态更新的最小权限访问。

<!-- prerequisites -->

<!--
## Prerequisites
-->
## 前提条件   

<!--
- {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
- Dynamic Resource Allocation is configured in your cluster.
- You can edit RBAC resources and restart or roll out DRA components.
-->
- {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
- 集群中已配置动态资源分配。
- 你可以编辑 RBAC 资源并重启或上线 DRA 组件。

<!-- steps -->

<!--
## Identify DRA components that write status
-->
## 识别写入状态的 DRA 组件

<!--
Document which identities (usually ServiceAccounts) update ResourceClaim
status in your cluster. Typical writers are:
-->
记录哪些身份（通常为 ServiceAccount）在你的集群中更新 ResourceClaim 状态。
典型的写入者包括：

<!--
- kube-scheduler or a custom allocation controller
- node-local DRA drivers
- multi-node DRA status controllers
-->
- kube-scheduler 或自定义分配控制器
- 节点本地 DRA 驱动程序
- 多节点 DRA 状态控制器

<!--
## Grant least-privilege permissions for synthetic subresources
-->
## 为合成子资源授予最小权限

<!--
Starting in Kubernetes v1.36, DRA status updates require synthetic subresource
permissions in addition to `resourceclaims/status`.
-->
从 Kubernetes v1.36 开始，DRA 状态更新除了需要 `resourceclaims/status` 外，
还需要合成子资源权限。

<!--
### Grant scheduler and allocation-controller permissions
-->
### 为调度器和分配控制器授予权限

<!--
Apply a role that allows binding-related updates:
-->
应用允许绑定相关更新的角色：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dra-binding-updater
rules:
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/status"]
    verbs: ["get", "patch", "update"]
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/binding"]
    verbs: ["patch", "update"]
```

<!--
### Grant node-local driver permissions
-->
### 为节点本地驱动程序授予权限

<!--
Use node-aware verbs for node-local drivers:
-->
为节点本地驱动程序使用节点感知的动词：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dra-node-driver-status-updater
rules:
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/status"]
    verbs: ["get", "patch", "update"]
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/driver"]
    verbs: ["associated-node:patch", "associated-node:update"]
    resourceNames: ["dra.example.com"]
```

<!--
### Grant multi-node controller permissions only when needed
-->
### 仅在需要时为多节点控制器授予权限 

<!--
Use `arbitrary-node:*` only for components that must update from any node:
-->
仅对必须从任何节点更新的组件使用 `arbitrary-node:*`：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dra-multinode-status-updater
rules:
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/status"]
    verbs: ["get", "patch", "update"]
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/driver"]
    verbs: ["arbitrary-node:patch", "arbitrary-node:update"]
    resourceNames: ["dra.example.com"]
```

<!--
## Bind roles to explicit identities
-->
## 将角色绑定到明确身份  

<!--
Create `ClusterRoleBinding` objects for each component identity, and avoid
sharing a broad role across unrelated DRA components.
-->
为每个组件身份创建 `ClusterRoleBinding` 对象，
并避免在不相关的 DRA 组件之间共享宽泛的角色。

<!--
Restrict `resourceclaims/driver` rules with `resourceNames` where possible so
an identity can only write status for the specific DRA driver it operates.
-->
尽可能使用 `resourceNames` 限制 `resourceclaims/driver` 规则，
以便身份只能写入其操作的特定 DRA 驱动程序的状态。

<!--
## Validate and monitor
-->
## 验证和监控   

<!--
1. Verify each identity has only the required verbs and subresources.
1. Confirm DRA status updates work after rollout.
1. Watch API server audit events for denied `resourceclaims/binding` and
   `resourceclaims/driver` requests.
-->
1. 验证每个身份只有所需的动词和子资源。
1. 确认上线后 DRA 状态更新正常工作。
1. 监视 API 服务器审计事件，查看被拒绝的 `resourceclaims/binding` 和
   `resourceclaims/driver` 请求。

<!--
## What's next
-->
## 接下来  

<!--
- [Hardening Guide - Dynamic Resource Allocation](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)
- [Securing a Cluster](/docs/tasks/administer-cluster/securing-a-cluster/)
- [Authorization](/docs/reference/access-authn-authz/authorization/)
-->
- [强化指南 - 动态资源分配](/zh-cn/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)
- [保护集群安全](/zh-cn/docs/tasks/administer-cluster/securing-a-cluster/)
- [授权](/zh-cn/docs/reference/access-authn-authz/authorization/)
