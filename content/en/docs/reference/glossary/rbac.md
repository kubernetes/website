---
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
---
 Manages authorization decisions, allowing admins to dynamically configure access policies through the {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}.

<!--more--> 

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
