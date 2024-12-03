---
title: RBAC (Role-Based Access Control)
id: rbac
date: 2018-04-12
full_link: /ja/docs/reference/access-authn-authz/rbac/
short_description: >
  管理者がKubernetes APIを通じてアクセスポリシーを動的に設定できるようにし、認可の判断を管理します。

aka: 
tags:
- security
- fundamental
---
 管理者が{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}を通じてアクセスポリシーを動的に設定できるようにし、認可の判断を管理します。

<!--more--> 

RBACは、権限を含む*Role*と、Roleで定義された権限を一連のユーザーに付与する*RoleBinding*を使用します。
