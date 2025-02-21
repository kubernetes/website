---
title: Керування доступом на основі ролей
id: rbac
date: 2018-04-12
full_link: /docs/reference/access-authn-authz/rbac/
short_description: >
  Управління рішеннями з авторизації, яке дозволяє адміністраторам динамічно налаштовувати політики доступу через API Kubernetes.

aka:
- RBAC
- Role-Based Access Control
tags:
- security
- fundamental
---

Управління рішеннями з авторизації, яке дозволяє адміністраторам динамічно налаштовувати політики доступу через {{< glossary_tooltip text="API Kubernetes" term_id="kubernetes-api" >}}.

<!--more-->

RBAC використовує чотири типи обʼєктів Kubernetes:

Role
: Визначає правила дозволів у певному просторі імен.

ClusterRole
: Визначає правила дозволів для всього кластера.

RoleBinding
: Надає дозволи, визначені в ролі, набору користувачів у певному просторі імен.

ClusterRoleBinding
: Надає дозволи, визначені в ролі, набору користувачів у всьому кластері.

Докладніше дивіться [RBAC](/docs/reference/access-authn-authz/rbac/).
