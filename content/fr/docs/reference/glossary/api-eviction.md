---
title: Éviction initiée par l’API
id: api-eviction
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  Processus consistant à utiliser l’API d’éviction pour créer un objet Eviction qui déclenche l’arrêt gracieux d’un Pod.

aka:
tags:
- operation
---

L’éviction initiée par l’API est le processus par lequel vous utilisez l’API d’éviction pour créer un objet `Eviction` qui déclenche l’arrêt gracieux d’un Pod.

<!--more-->

Vous pouvez demander une éviction en appelant directement l’API d’éviction à l’aide d’un client du kube-apiserver, comme la commande `kubectl drain`.  
Lorsqu’un objet `Eviction` est créé, le serveur API termine le Pod.

Les évictions initiées par l’API respectent les `PodDisruptionBudgets` configurés ainsi que le paramètre `terminationGracePeriodSeconds`.

L’éviction initiée par l’API est différente de l’éviction due à la pression sur les nœuds.