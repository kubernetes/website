---
title: Allocation dynamique de ressources
id: dra
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
short_description: >
  Fonctionnalité Kubernetes permettant de demander et partager des ressources, comme des accélérateurs matériels, entre les Pods.

aka:
- DRA
tags:
- extension
---
Fonctionnalité Kubernetes permettant de demander et de partager des ressources entre les Pods.  
Ces ressources sont souvent des {{< glossary_tooltip text="devices" term_id="device" >}}, comme des accélérateurs matériels.

<!--more-->

Avec DRA, les pilotes de périphériques et les administrateurs de cluster définissent des _classes_ de périphériques disponibles à _revendiquer_ dans les charges de travail. Kubernetes attribue les périphériques correspondants aux ResourceClaims et place les Pods correspondants sur les nœuds pouvant accéder aux périphériques alloués.
