---
title: Modèle de ResourceClaim
id: resourceclaimtemplate
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates
short_description: >
  Définit un modèle utilisé par Kubernetes pour créer des ResourceClaims. Sert à fournir un accès par Pod à des ressources séparées mais similaires.

tags:
- workload
---
Définit un modèle que Kubernetes utilise pour créer des {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}.  
Les ResourceClaimTemplates sont utilisés dans
[l'allocation dynamique de ressources (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
pour fournir un _accès par Pod à des ressources séparées mais similaires_.

<!--more-->

Lorsqu'un ResourceClaimTemplate est référencé dans la spécification d'une charge de travail,
Kubernetes crée automatiquement des objets ResourceClaim basés sur le modèle.  
Chaque ResourceClaim est lié à un Pod spécifique. Lorsque le Pod se termine,
Kubernetes supprime le ResourceClaim correspondant.
