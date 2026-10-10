---
title: LimitRange
id: limitrange
full_link: /docs/concepts/policy/limit-range/
short_description: >
  Fournit des contraintes pour limiter la consommation de ressources par conteneur ou par Pod dans un namespace.

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container
---

Limite la consommation de ressources par {{< glossary_tooltip text="conteneur" term_id="container" >}} ou {{< glossary_tooltip text="Pod" term_id="pod" >}},
définie pour un {{< glossary_tooltip text="namespace" term_id="namespace" >}} donné.

<!--more-->

Un [LimitRange](/docs/concepts/policy/limit-range/) peut soit limiter la quantité de {{< glossary_tooltip text="ressources API" term_id="api-resource" >}}
qui peuvent être créées (pour un type de ressource particulier),
soit la quantité de {{< glossary_tooltip text="ressources d’infrastructure" term_id="infrastructure-resource" >}}
qui peut être demandée ou consommée par des conteneurs ou des Pods individuels au sein d’un namespace.