---
title: Garbage Collection
id: garbage-collection
date: 2024-09-02
full_link: /docs/concepts/architecture/garbage-collection/
short_description: >
  Le Garbage collection est un terme générique désignant les différents mécanismes utilisés par Kubernetes pour nettoyer les ressources du cluster.

aka: 
tags:
- fundamental
- operation
---

Le Garbage collection est un terme générique désignant les différents mécanismes utilisés par Kubernetes pour nettoyer les ressources du cluster.

<!--more-->

Kubernetes utilise la collecte des déchets pour nettoyer les ressources telles que les [conteneurs et images inutilisés](/docs/concepts/architecture/garbage-collection/#containers-images), les [Pods en échec](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection), les objets possédés par la ressource ciblée, les [Jobs terminés](/docs/concepts/workloads/controllers/ttlafterfinished/) et les ressources qui ont expiré ou échoué.

