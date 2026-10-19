---
title: Condition
id: condition
full_link: /docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions
short_description: >
  Une condition représente l’état actuel d’une ressource Kubernetes et indique si certains aspects sont vrais.

aka:
tags:
- fondamental
---

Une condition est un champ dans le statut d’une ressource Kubernetes qui décrit l’état actuel de cette ressource.

<!--more-->

Les conditions fournissent un moyen standardisé pour les composants Kubernetes de communiquer le statut des ressources.  
Chaque condition possède un `type`, un `status` (True, False, ou Unknown), et éventuellement des champs comme `reason` et `message` pour fournir des informations supplémentaires.  
Par exemple, un Pod peut avoir des conditions telles que `Ready`, `ContainersReady` ou `PodScheduled`.