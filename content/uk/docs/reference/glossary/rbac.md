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

RBAC використовує *ролі*, які містять правила дозволів, та *привʼязки ролей*, які надають дозволи, визначені в ролі, конкретному набору користувачів.
