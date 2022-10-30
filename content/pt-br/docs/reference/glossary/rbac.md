---
title: RBAC (Controle de Acesso Baseado em Funções)
id: rbac
date: 2018-04-12
full_link: /docs/reference/access-authn-authz/rbac/
short_description: >
  Gerencia decisões de autorização, permitindo que os administradores configurem dinamicamente políticas de acesso por meio da API do Kubernetes.

aka:
 - Role Based Access Control
 - Controle de Acesso Baseado em Funções
tags:
- security
- fundamental
---
 Gerencia decisões de autorização, permitindo que os administradores configurem dinamicamente políticas de acesso por meio da {{< glossary_tooltip text="API do Kubernetes" term_id="kubernetes-api" >}}.
 
<!--more--> 

O RBAC (do inglês - Role-Based Access Control) utiliza *funções*, que contêm regras de permissão, e *atribuição das funções*, que concedem as permissões definidas em uma função a um conjunto de usuários.