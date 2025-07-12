---
title: Cluster
id: cluster
date: 2019-06-15
full_link: 
short_description: >
   Un ensemble de machines physiques et/ou virtuelles, appelées noeuds, qui peuvent exécuter des applications conteneurisées. Chaque grappe possède au moins un noeud de calcul.

aka: 
tags:
- fundamental
- operation
---
Un ensemble de machines physiques et/ou virtuelles appelées {{< glossary_tooltip text="noeuds" term_id="node" >}},
qui peuvent exécuter des applications conteneurisées. Chaque cluster a au moins un noeud de calcul.

<!--more-->
Les noeuds de calcul hébergent les {{< glossary_tooltip text="Pods" term_id="pod" >}} qui sont
les composants de la charge de travail des applications. Le
{{< glossary_tooltip text="centre de contrôle" term_id="control-plane" >}} gère les noeuds de calcul
et les Pods dans la cluster. Dans les environnements de production en général, le centre de contrôle repose sur
plusieurs machines et le cluster est constitué de plusieurs noeuds, offrant ainsi
une tolérance aux pannes et une haute disponibilité.
