---
reviewers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Déboguer un StatefulSet
content_type: task
weight: 30
---

<!-- overview -->
Cette tâche explique comment déboguer un StatefulSet.

## {{% heading "prerequisites" %}}

* Vous devez disposer d'un cluster Kubernetes, et l'outil de ligne de commande kubectl doit être configuré pour communiquer avec votre cluster.
* Vous devez avoir un StatefulSet en cours d'exécution que vous souhaitez examiner.

<!-- steps -->

## Déboguer un StatefulSet

Pour lister tous les Pods appartenant à un StatefulSet et portant l'étiquette `app.kubernetes.io/name=MyApp`, vous pouvez utiliser la commande suivante :

```shell
kubectl get pods -l app.kubernetes.io/name=MyApp
```

Si l'un des Pods listés reste longtemps dans l'état `Unknown` ou `Terminating`, consultez la tâche
[Supprimer des Pods d'un StatefulSet](/docs/tasks/run-application/delete-stateful-set/) pour savoir comment y remédier.
Vous pouvez déboguer les Pods individuels d'un StatefulSet à l'aide du guide
[Déboguer des Pods](/docs/tasks/debug/debug-application/debug-pods/).

## {{% heading "whatsnext" %}}

Apprenez-en davantage sur le [débogage d'un conteneur d'initialisation](/docs/tasks/debug/debug-application/debug-init-containers/).
