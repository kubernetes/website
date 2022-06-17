---
title: 基於角色的訪問控制（RBAC）
id: rbac
date: 2018-04-12
full_link: /zh-cn/docs/reference/access-authn-authz/rbac/
short_description: >
  管理授權決策，允許管理員透過 Kubernetes API 動態配置訪問策略。

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
管理授權決策，允許管理員透過 {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} 動態配置訪問策略。

<!--more--> 

<!--
RBAC utilizes *roles*, which contain permission rules, and *role bindings*, which grant the permissions defined in a role to a set of users.
-->
RBAC 使用 *角色* (包含許可權規則)和 *角色繫結* (將角色中定義的許可權授予一組使用者)。


