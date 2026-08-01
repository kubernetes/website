---
reviewers:
- bprashanth
- erictune
- foxish
- smarterclayton
title: Forcer la suppression des Pods d'un StatefulSet
content_type: task
weight: 70
---

<!-- overview -->
Cette page explique comment supprimer des Pods qui font partie d'un
{{< glossary_tooltip text="StatefulSet" term_id="StatefulSet" >}},
ainsi que les précautions à prendre lors de cette opération.

## {{% heading "prerequisites" %}}

- Cette tâche est relativement avancée et peut enfreindre certaines des propriétés
  inhérentes aux StatefulSets.
- Avant de continuer, familiarisez-vous avec les considérations énumérées ci-dessous.

<!-- steps -->

## Considérations relatives aux StatefulSets

Lors du fonctionnement normal d'un StatefulSet, il n'est **jamais** nécessaire de forcer la
suppression d'un de ses Pods. Le [contrôleur StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
est chargé de créer, de mettre à l'échelle et de supprimer les membres du StatefulSet. Il tente
de garantir que les Pods d'ordinal 0 à N-1 sont actifs et prêts, conformément au nombre de
réplicas spécifié. Un StatefulSet garantit qu'à tout moment, au plus un Pod possédant une
identité donnée s'exécute dans un cluster. C'est ce que l'on appelle la sémantique *au plus un*
fournie par un StatefulSet.

La suppression forcée manuelle doit être effectuée avec prudence, car elle peut enfreindre la
sémantique *au plus un* inhérente aux StatefulSets. Les StatefulSets peuvent servir à exécuter
des applications distribuées et en cluster qui nécessitent une identité réseau et un stockage
stables. La configuration de ces applications repose souvent sur un ensemble constitué d'un
nombre fixe de membres aux identités fixes. La présence de plusieurs membres ayant la même
identité peut avoir des conséquences désastreuses et entraîner une perte de données (par
exemple, un scénario de *split-brain* dans les systèmes reposant sur un quorum).

## Supprimer des Pods

Vous pouvez effectuer une suppression gracieuse d'un Pod à l'aide de la commande suivante :

```shell
kubectl delete pods <pod>
```

Pour que la commande ci-dessus entraîne un arrêt gracieux, le Pod ne **doit pas** définir
`pod.Spec.TerminationGracePeriodSeconds` sur 0. Définir
`pod.Spec.TerminationGracePeriodSeconds` sur 0 seconde est dangereux et fortement déconseillé
pour les Pods d'un StatefulSet. Une suppression gracieuse est sûre et garantit que le Pod
[s'arrête correctement](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
avant que le kubelet ne supprime son nom du serveur d'API.

Un Pod n'est pas supprimé automatiquement lorsqu'un nœud est inaccessible.
Les Pods exécutés sur un nœud inaccessible passent à l'état `Terminating` ou `Unknown` après un
[délai d'expiration](/docs/concepts/architecture/nodes/#condition).
Les Pods peuvent également passer à ces états lorsqu'un utilisateur tente de supprimer
gracieusement un Pod situé sur un nœud inaccessible.
Un Pod dans cet état ne peut être supprimé du serveur d'API que de l'une des façons suivantes :

- L'objet Node est supprimé (par vous ou par le
  [contrôleur de nœud](/docs/concepts/architecture/nodes/#node-controller)).
- Le kubelet du nœud qui ne répond pas recommence à répondre, arrête le Pod et supprime son entrée
  du serveur d'API.
- L'utilisateur force la suppression du Pod.

La bonne pratique recommandée consiste à utiliser la première ou la deuxième approche. Si vous
avez la certitude qu'un nœud est hors service (par exemple, définitivement déconnecté du réseau
ou éteint), supprimez l'objet Node. Si le nœud subit une partition réseau, essayez de la résoudre
ou attendez qu'elle se résorbe. Une fois la partition résorbée, le kubelet termine la suppression
du Pod et libère son nom dans le serveur d'API.

Normalement, le système termine la suppression lorsque le Pod ne s'exécute plus sur un nœud ou
lorsque le nœud est supprimé par un administrateur. Vous pouvez contourner ce comportement en
forçant la suppression du Pod.

### Suppression forcée

Une suppression forcée **n'attend pas** que le kubelet confirme l'arrêt du Pod.
Que la suppression forcée parvienne ou non à arrêter le Pod, elle libère immédiatement son nom
dans le serveur d'API. Le contrôleur StatefulSet peut alors créer un Pod de remplacement avec la
même identité. Cela peut entraîner la duplication d'un Pod toujours en cours d'exécution et, si celui-ci
peut encore communiquer avec les autres membres du StatefulSet, enfreindre la sémantique *au plus
un* que le StatefulSet est conçu pour garantir.

Lorsque vous forcez la suppression d'un Pod d'un StatefulSet, vous affirmez que le Pod concerné
ne communiquera plus jamais avec les autres Pods du StatefulSet et que son nom peut être libéré en
toute sécurité afin de créer un remplacement.

Pour forcer la suppression d'un Pod avec kubectl version 1.5 ou ultérieure, exécutez la commande
suivante :

```shell
kubectl delete pods <pod> --grace-period=0 --force
```

Si vous utilisez kubectl version 1.4 ou antérieure, omettez l'option `--force` et exécutez :

```shell
kubectl delete pods <pod> --grace-period=0
```

Si le Pod reste à l'état `Unknown` après l'exécution de ces commandes, utilisez la commande
suivante pour le supprimer du cluster :

```shell
kubectl patch pod <pod> -p '{"metadata":{"finalizers":null}}'
```

Forcez toujours la suppression des Pods d'un StatefulSet avec prudence et en ayant pleinement
conscience des risques encourus.

## {{% heading "whatsnext" %}}

Apprenez-en davantage sur le [débogage d'un StatefulSet](/docs/tasks/debug/debug-application/debug-statefulset/).
