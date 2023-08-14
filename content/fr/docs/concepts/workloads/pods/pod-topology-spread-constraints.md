---
title: Contraintes de propagation de topologie pour les Pods
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Vous pouvez utiliser des  _contraintes de propagation de topologie_ pour contrôler comment les {{< glossary_tooltip text="Pods" term_id="Pod" >}} sont propagés à travers votre cluster parmi les domaines de défaillance comme les régions, zones, noeuds et autres domaines de topologie définis par l'utilisateur. Ceci peut aider à mettre en place de la haute disponibilité et à utiliser efficacement les ressources.



<!-- body -->

## Conditions préalables

### Autoriser la Feature Gate

La [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `EvenPodsSpread`  doit être autorisée pour
{{< glossary_tooltip text="l'API Server" term_id="kube-apiserver" >}} **et** le
{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}}.

### Labels de noeuds

Les contraintes de propagation de topologie reposent sur les labels de noeuds pour identifier le ou les domaines de topologie dans lesquels se trouve  chacun des noeuds. Par exemple, un noeud pourrait avoir les labels: `node=node1,zone=us-east-1a,region=us-east-1`

Supposons que vous ayez un cluster de 4 noeuds ayant les labels suivants:

```
NAME    STATUS   ROLES    AGE     VERSION   LABELS
node1   Ready    <none>   4m26s   v1.16.0   node=node1,zone=zoneA
node2   Ready    <none>   3m58s   v1.16.0   node=node2,zone=zoneA
node3   Ready    <none>   3m17s   v1.16.0   node=node3,zone=zoneB
node4   Ready    <none>   2m43s   v1.16.0   node=node4,zone=zoneB
```

Une vue logique du cluster est celle-ci :

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
```

Plutôt que d'appliquer des labels manuellement, vous pouvez aussi réutiliser les [labels réputés](/docs/reference/kubernetes-api/labels-annotations-taints/) qui sont créés et renseignés automatiquement dans la plupart des clusters.

## Contraintes de propagation pour les Pods

### API

Le champ `pod.spec.topologySpreadConstraints` est introduit dans 1.16 comme suit :

```
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  topologySpreadConstraints:
    - maxSkew: <integer>
      minDomains: <integer>
      topologyKey: <string>
      whenUnsatisfiable: <string>
      labelSelector: <object>
```

Vous pouvez définir une ou plusieurs `topologySpreadConstraint` pour indiquer au kube-scheduler comment placer chaque nouveau Pod par rapport aux Pods déjà existants dans votre cluster. Les champs sont :

- **maxSkew** décrit le degré avec lequel les Pods peuvent être inégalement distribués. C'est la différence maximale permise entre le nombre de Pods correspondants entre deux quelconques domaines de topologie d'un type donné. Il doit être supérieur à zéro.
- **topologyKey** est la clé des labels de noeuds. Si deux noeuds sont étiquettés avec cette clé et ont des valeurs égales pour ce label, le scheduler considère les deux noeuds dans la même topologie. Le scheduler essaie de placer un nombre équilibré de Pods dans chaque domaine de topologie.
- **whenUnsatisfiable** indique comment traiter un Pod qui ne satisfait pas les contraintes de propagation :
  - `DoNotSchedule` (défaut) indique au scheduler de ne pas le programmer.
  - `ScheduleAnyway` indique au scheduler de le programmer, tout en priorisant les noeuds minimisant le biais (*skew*).
- **labelSelector** est utilisé pour touver les Pods correspondants. Les Pods correspondants à ce sélecteur de labels sont comptés pour déterminer le nombre de Pods dans leurs domaines de topologie correspodants. Voir [Sélecteurs de labels](/docs/concepts/overview/working-with-objects/labels/#label-selectors) pour plus de détails.

Vous pouvez en savoir plus sur ces champ en exécutant `kubectl explain Pod.spec.topologySpreadConstraints`.

### Exemple : Une TopologySpreadConstraint

Supposons que vous ayez un cluster de 4 noeuds où 3 Pods étiquettés `foo:bar` sont placés sur node1, node2 et node3 respectivement (`P` représente un Pod) :

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
|   P   |   P   |   P   |       |
+-------+-------+-------+-------+
```

Si nous voulons qu'un nouveau Pod soit uniformément réparti avec les Pods existants à travers les zones, la spec peut être :

{{% codenew file="pods/topology-spread-constraints/one-constraint.yaml" %}}

`topologyKey: zone` implique que la distribution uniforme sera uniquement appliquée pour les noeuds ayant le label "zone:&lt;any value&gt;" présent. `whenUnsatisfiable: DoNotSchedule` indique au scheduler de laisser le Pod dans l'état Pending si le Pod entrant ne peut pas satisfaire la contrainte.

Si le scheduler plaçait ce Pod entrant dans "zoneA", la distribution des Pods deviendrait [3, 1], et le biais serait de 2 (3 - 1) - ce qui va à l'encontre de `maxSkew: 1`. Dans cet exemple, le Pod entrant peut uniquement être placé dans "zoneB":

```
+---------------+---------------+      +---------------+---------------+
|     zoneA     |     zoneB     |      |     zoneA     |     zoneB     |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |  OR  | node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
|   P   |   P   |   P   |   P   |      |   P   |   P   |  P P  |       |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
```

Vous pouvez ajuster la spec du Pod pour pour répondre à divers types d'exigences :

- Changez `maxSkew` pour une valeur plus grande comme "2" pour que le Pod entrant puisse aussi être placé dans la "zoneA".
- Changez `topologyKey` pour "node" pour distribuer les Pods uniformément à travers les noeuds et non plus les zones. Dans l'exemple ci-dessus, si `maxSkew` reste à "1", le Pod entrant peut être uniquement placé dans "node4".
- Changez `whenUnsatisfiable: DoNotSchedule` en `whenUnsatisfiable: ScheduleAnyway` pour s'assurer que le Pod est toujours programmable (en supposant que les autres APIs de scheduling soient satisfaites). Cependant, il sera de préférence placé dans la topologie de domaine ayant le moins de Pods correspondants. (Prenez note que cette préférence est normalisée conjointement avec d'autres priorités de scheduling interne comme le ratio d'usage de ressources, etc.)

### Example: Plusieurs TopologySpreadConstraints

Cela s'appuie sur l'exemple précédent. Supposons que vous ayez un cluster de 4 noeuds où 3 Pods étiquetés `foo:bar` sont placés sur node1, node2 et node3 respectivement (`P` représente un Pod):

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
|   P   |   P   |   P   |       |
+-------+-------+-------+-------+
```

Vous pouvez utiliser 2 TopologySpreadConstraints pour contrôler la répartition des Pods aussi bien dans les zones que dans les noeuds :

{{% codenew file="pods/topology-spread-constraints/two-constraints.yaml" %}}

Dans ce cas, pour satisfaire la première contrainte, le Pod entrant peut uniquement être placé dans "zoneB" ; alors que pour satisfaire la seconde contrainte, le Pod entrant peut uniquement être placé dans "node4". Le résultat étant l'intersection des résultats des 2 contraintes, l'unique option possible est de placer le Pod entrant dans "node4".

Plusieurs contraintes peuvent entraîner des conflits. Supposons que vous ayez un cluster de 3 noeuds couvrant 2 zones :

```
+---------------+-------+
|     zoneA     | zoneB |
+-------+-------+-------+
| node1 | node2 | node3 |
+-------+-------+-------+
|  P P  |   P   |  P P  |
+-------+-------+-------+
```

Si vous appliquez "two-constraints.yaml" à ce cluster, vous noterez que "mypod" reste dans l'état `Pending`. Cela parce que : pour satisfaire la première contrainte, "mypod" peut uniquement être placé dans "zoneB"; alors que pour satisfaire la seconde contrainte, "mypod" peut uniquement être placé sur "node2". Ainsi, le résultat de l'intersection entre "zoneB" et "node2" ne retourne rien.

Pour surmonter cette situation, vous pouvez soit augmenter `maxSkew`, soit modifier une des contraintes pour qu'elle utilise `whenUnsatisfiable: ScheduleAnyway`.

### Conventions

Il existe quelques conventions implicites qu'il est intéressant de noter ici :

- Seuls le Pods du même espace de noms que le Pod entrant peuvent être des candidats pour la correspondance.

- Les noeuds sans label  `topologySpreadConstraints[*].topologyKey` seront ignorés. Cela induit que :

  1. les Pods localisés sur ces noeuds n'impactent pas le calcul de `maxSkew` - dans l'exemple ci-dessus, supposons que "node1" n'a pas de label "zone", alors les 2 Pods ne seront pas comptés, et le Pod entrant sera placé dans "zoneA".
  2. le Pod entrant n'a aucune chance d'être programmé sur ce type de noeuds - dans l'exemple ci-dessus, supposons qu'un "node5" portant un label `{zone-typo: zoneC}` joigne le cluster ; il sera ignoré, en raison de l'absence de label "zone".

- Faites attention à ce qui arrive lorsque le `topologySpreadConstraints[*].labelSelector`  du Pod entrant ne correspond pas à ses propres labels. Dans l'exemple ci-dessus, si nous supprimons les labels du Pod entrant, il sera toujours placé dans "zoneB" car les contraintes sont toujours satisfaites. Cependant, après le placement, le degré de déséquilibre du cluster reste inchangé - zoneA contient toujours 2 Pods ayant le label {foo:bar}, et zoneB contient 1 Pod cayant le label {foo:bar}. Si ce n'est pas ce que vous attendez, nous recommandons que `topologySpreadConstraints[*].labelSelector` du workload corresponde à ses propres labels.

- Si le Pod entrant a défini `spec.nodeSelector` ou `spec.affinity.nodeAffinity`, les noeuds non correspondants seront ignorés.

    Supposons que vous ayez un cluster de 5 noeuds allant de zoneA à zoneC :

    ```
    +---------------+---------------+-------+
    |     zoneA     |     zoneB     | zoneC |
    +-------+-------+-------+-------+-------+
    | node1 | node2 | node3 | node4 | node5 |
    +-------+-------+-------+-------+-------+
    |   P   |   P   |   P   |       |       |
    +-------+-------+-------+-------+-------+
    ```

    et vous savez que "zoneC" doit être exclue. Dans ce cas, vous pouvez écrire le yaml ci-dessous, pour que "mypod" soit placé dans "zoneB" plutôt que dans "zoneC". `spec.nodeSelector` est pris en compte de la même manière.

    {{% codenew file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" %}}

### Contraintes par défaut au niveau du cluster

{{< feature-state for_k8s_version="v1.18" state="alpha" >}}

Il est possible de définir des contraintes de propagation de topologie par défaut pour un cluster. Les contraintes de propagation de topologie sont appliquées à un Pod si et seulement si :

- Il ne définit aucune contrainte dans son `.spec.topologySpreadConstraints`.
- Il appartient à un service, replication controller, replica set ou stateful set.

Les contraintes par défaut peuvent être définies comme arguments du plugin `PodTopologySpread`
dans un [profil de scheduling](/docs/reference/scheduling/profiles).
Les contraintes sont spécifiées avec la même [API ci-dessus](#api), à l'exception que
`labelSelector` doit être vide. Les sélecteurs sont calculés à partir des services,
replication controllers, replica sets ou stateful sets auxquels le Pod appartient.

Un exemple de configuration pourrait ressembler à :

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha2
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
  - pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints:
            - maxSkew: 1
              topologyKey: topology.kubernetes.io/zone
              whenUnsatisfiable: ScheduleAnyway
```

{{< note >}}
Le score produit par les contraintes de scheduling par défaut peuvent rentrer en conflit avec le score
produit par le [plugin `DefaultPodTopologySpread`](/docs/reference/scheduling/profiles/#scheduling-plugins).
Il est recommandé de désactiver ce plugin dans le profil de scheduling lorsque vous utilisez des contraintes
par défaut pour `PodTopologySpread`.
{{< /note >}}

## Comparaison avec PodAffinity/PodAntiAffinity

Dans Kubernetes, les directives relatives aux "Affinités" contrôlent comment les Pods sont
programmés - plus regroupés ou plus dispersés.

- Pour `PodAffinity`, vous pouvez essayer de regrouper un certain nombre de Pods dans des domaines de topologie qualifiés,
- Pour `PodAntiAffinity`, seulement un Pod peut être programmé dans un domaine de topologie unique.

La fonctionnalité "EvenPodsSpread" fournit des options flexibles pour distribuer des Pods uniformément sur différents domaines de topologie - pour mettre en place de la haute disponibilité ou réduire les coûts. Cela peut aussi aider
au rolling update des charges de travail et à la mise à l'échelle de réplicas. Voir [Motivations](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation) pour plus de détails.

## Limitations connues

En version 1.18, pour laquelle cette fonctionnalité est en Beta, il y a quelques limitations connues :

- Réduire un Déploiement peut résulter en une distrubution désiquilibrée des Pods.
- Les Pods correspondants sur des noeuds taintés sont respectés. Voir [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)
