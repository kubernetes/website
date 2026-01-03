---
title: Affinity
id: affinity
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
  Règles utilisées par l’ordonnanceur pour déterminer l’emplacement des pods.

aka:
tags:
- fundamental
---

Dans Kubernetes, l’_affinity_ est un ensemble de règles qui donnent des indications à l’ordonnanceur quant à l’emplacement des pods.

<!--more-->
Il existe deux types d’affinité :
* [affinité de nœud](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [affinité entre pods](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

Ces règles sont définies à l’aide des {{< glossary_tooltip term_id="label" text="labels" >}} Kubernetes,  
et des {{< glossary_tooltip term_id="selector" text="sélecteurs" >}} spécifiés dans les {{< glossary_tooltip term_id="pod" text="pods" >}}.  
Elles peuvent être **obligatoires** ou **préférentielles**, selon la rigueur avec laquelle vous souhaitez que l’ordonnanceur les applique.
