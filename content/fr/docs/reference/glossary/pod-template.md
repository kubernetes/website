---
title: Modèle de Pod
id: pod-template
short_description: >
  Un modèle utilisé pour créer des Pods.

aka: 
  - pod template
tags:
- core-object
---

Un objet API qui définit un modèle pour créer des Pods.  
Le PodTemplate API est également intégré dans les définitions d’objets pour la gestion des workloads, comme les Deployments ou StatefulSets.

<!--more--> 

Les modèles de Pod permettent de définir des métadonnées communes (labels, nom du Pod, etc.) et de spécifier l’état souhaité d’un Pod.  
Les contrôleurs de gestion des workloads utilisent ces modèles (souvent intégrés dans un autre objet, comme Deployment ou StatefulSet) pour définir et gérer un ou plusieurs Pods.  
Lorsque plusieurs Pods sont créés à partir du même modèle, on parle de répliques (replicas).  
Bien qu’il soit possible de créer un objet PodTemplate directement, cela est rarement nécessaire.