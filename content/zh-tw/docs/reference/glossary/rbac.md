---
title: 基於角色的訪問控制（RBAC）
id: rbac
date: 2018-04-12
full_link: /zh-cn/docs/reference/access-authn-authz/rbac/
short_description: >
  管理授權決策，允許管理員通過 Kubernetes API 動態配置訪問策略。

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
管理授權決策，允許管理員通過 {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} 動態配置訪問策略。

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
RBAC 使用四種類別的 Kubernetes 對象：

- **Role**：在特定命名空間中定義權限規則。

- **ClusterRole**：定義集羣範圍內的權限規則。

- **RoleBinding**：將角色中定義的權限授予特定命名空間中的一組用戶。

- **ClusterRoleBinding**：將角色中定義的權限授予集羣範圍內的一組用戶。

更多信息參見 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)。
