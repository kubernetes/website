---
title: Network Policy
id: network-policy
full_link: /docs/concepts/services-networking/network-policies/
short_description: >
  Une spécification définissant comment des groupes de Pods sont autorisés à communiquer entre eux et avec d'autres points de terminaison réseau.

aka: 
tags:
- networking
- architecture
- extension
- core-object
---

Une spécification définissant comment des groupes de Pods sont autorisés à communiquer entre eux et avec d'autres points de terminaison réseau.

<!--more-->

Les NetworkPolicies permettent de configurer de manière déclarative quels Pods sont autorisés à se connecter entre eux, quels namespaces sont autorisés à communiquer,
et plus précisément quels numéros de port sont concernés par chaque politique. Les objets NetworkPolicy utilisent des {{< glossary_tooltip text="labels" term_id="label" >}}
pour sélectionner des Pods et définir des règles spécifiant quel trafic est autorisé vers les Pods sélectionnés.

Les NetworkPolicies sont implémentées par un plugin réseau compatible fourni par un fournisseur réseau.
Notez que la création d’un objet NetworkPolicy sans contrôleur pour l’implémenter n’aura aucun effet.