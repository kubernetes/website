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

RBACは、以下の4種類のKubernetesオブジェクトを使用します:

Role
: 特定のNamespaceの権限を定義します。

ClusterRole
: クラスター全体の権限を定義します。

RoleBinding
: 特定のNamespaceにおいて、Roleで定義された権限を一連のユーザーに付与します。

ClusterRoleBinding
: クラスター全体において、Roleで定義された権限を一連のユーザーに付与します。

詳細については、[RBAC](/ja/docs/reference/access-authn-authz/rbac/)を参照して下さい。
