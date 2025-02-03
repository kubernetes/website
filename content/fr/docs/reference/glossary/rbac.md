---
titre: RBAC (Contrôle d'accès basé sur les rôles)
id: rbac
date: 2024-09-12
full_link: /docs/reference/access-authn-authz/rbac/
short_description: >
  Gère les décisions d'autorisation, permettant aux administrateurs de configurer dynamiquement les politiques d'accès via l'API Kubernetes.

aka: 
tags:
- security
- fundamental
---
 Gère les décisions d'autorisation, permettant aux administrateurs de configurer dynamiquement les politiques d'accès via l'{{< glossary_tooltip text="API Kubernetes" term_id="kubernetes-api" >}}.

<!--more--> 

RBAC utilise des *rôles*, qui contiennent des règles de permission, et des *rôles de liaison*, qui accordent les permissions définies dans un rôle à un ensemble d'utilisateurs.


