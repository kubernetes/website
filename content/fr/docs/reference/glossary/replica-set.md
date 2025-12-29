---
title: ReplicaSet
id: replica-set
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/replicaset/
short_description: >
  Un ReplicaSet garantit qu’un nombre spécifié de répliques de Pods sont en cours d’exécution à tout moment.

aka: 
tags:
- fundamental
- core-object
- workload
---
Un ReplicaSet a pour objectif de maintenir un ensemble de Pods répliqués en cours d’exécution à tout moment.

<!--more-->

Des objets de type workload tels que les {{< glossary_tooltip term_id="deployment" >}} utilisent des ReplicaSets
pour s’assurer que le nombre configuré de {{< glossary_tooltip term_id="pod" text="Pods" >}} s’exécute
dans votre cluster, conformément à la spécification de ce ReplicaSet.
