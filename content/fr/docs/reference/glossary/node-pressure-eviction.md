---
title: Éviction sous pression du nœud
id: node-pressure-eviction
full_link: /docs/concepts/scheduling-eviction/node-pressure-eviction/
short_description: >
  Processus par lequel le kubelet termine de manière proactive des Pods afin de libérer des ressources sur les nœuds.

aka:
- kubelet eviction
tags:
- operation
---

L’éviction sous pression du nœud est le processus par lequel le kubelet termine de manière proactive des Pods afin de libérer des ressources sur les nœuds.

<!--more-->

Le kubelet surveille les ressources telles que le CPU, la mémoire, l’espace disque et les inodes du système de fichiers sur les nœuds du cluster.  
Lorsque l’une ou plusieurs de ces ressources atteignent un certain seuil d’utilisation, le kubelet peut interrompre un ou plusieurs Pods sur le nœud afin de libérer des ressources et éviter une saturation.

L’éviction sous pression du nœud est différente de l’éviction initiée via l’API.