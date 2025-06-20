---
title: 基于角色的访问控制（RBAC）
id: rbac
date: 2018-04-12
full_link: /zh-cn/docs/reference/access-authn-authz/rbac/
short_description: >
  管理授权决策，允许管理员通过 Kubernetes API 动态配置访问策略。

aka: 
tags:
- security
- fundamental
---
<!--
title: RBAC (Role-Based Access Control)
id: rbac
date: 2018-04-12
full_link: /docs/reference/access-authn-authz/rbac/
short_description: >
  Manages authorization decisions, allowing admins to dynamically configure access policies through the Kubernetes API.

aka: 
tags:
- security
- fundamental
-->

<!--
 Manages authorization decisions, allowing admins to dynamically configure access policies through the {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}.
-->
管理授权决策，允许管理员通过 {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} 动态配置访问策略。

<!--more-->

<!--
RBAC utilizes four kinds of Kubernetes objects:

Role
: Defines permission rules in a specific namespace.

ClusterRole
: Defines permission rules cluster-wide.

RoleBinding
: Grants the permissions defined in a role to a set of users in a specific namespace.

ClusterRoleBinding
: Grants the permissions defined in a role to a set of users cluster-wide.

For more information, see [RBAC](/docs/reference/access-authn-authz/rbac/).
-->
RBAC 使用四种类别的 Kubernetes 对象：

- **Role**：在特定命名空间中定义权限规则。

- **ClusterRole**：定义集群范围内的权限规则。

- **RoleBinding**：将角色中定义的权限授予特定命名空间中的一组用户。

- **ClusterRoleBinding**：将角色中定义的权限授予集群范围内的一组用户。

更多信息参见 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)。
