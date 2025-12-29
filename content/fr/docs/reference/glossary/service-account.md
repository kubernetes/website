---
title: ServiceAccount
id: service-account
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  Fournit une identité aux processus s’exécutant dans un Pod.

aka: 
tags:
- fundamental
- core-object
---
Fournit une identité aux processus s’exécutant dans un {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!--more-->

Lorsque des processus à l’intérieur de Pods accèdent au cluster, ils sont authentifiés par le serveur d’API en tant que compte de service spécifique, par exemple `default`. Lorsque vous créez un Pod, s’il n’est associé à aucun compte de service, il se voit automatiquement attribuer le compte de service par défaut du même {{< glossary_tooltip text="Namespace" term_id="namespace" >}}.
