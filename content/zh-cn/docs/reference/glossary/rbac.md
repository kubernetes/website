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
---
title: RBAC (Role-Based Access Control)
id: rbac
date: 2018-04-12
full_link: /zh-cn/docs/reference/access-authn-authz/rbac/
short_description: >
  Manages authorization decisions, allowing admins to dynamically configure access policies through the Kubernetes API.

aka: 
tags:
- security
- fundamental
---
-->

<!--
 Manages authorization decisions, allowing admins to dynamically configure access policies through the {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}.
-->
管理授权决策，允许管理员通过 {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} 动态配置访问策略。

<!--more--> 

<!--
RBAC utilizes *roles*, which contain permission rules, and *role bindings*, which grant the permissions defined in a role to a set of users.
-->
RBAC 使用 *角色* (包含权限规则)和 *角色绑定* (将角色中定义的权限授予一组用户)。


