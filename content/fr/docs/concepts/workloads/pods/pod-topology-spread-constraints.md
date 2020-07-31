---
title: Contraintes de propagation de topologie pour les Pods
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Vous pouvez utiliser des  _contraintes de propagation de topologie_ pour contrôler comment les {{< glossary_tooltip text="Pods" term_id="Pod" >}} sont propagés à travers votre cluster parmi les domaines de défaillance comme les régions, zones, noeuds et autres domaines de topologie définis par l'utilisateur. Ceci peut aider à créer de la haute disponibilité et à utiliser efficacement les ressources.



<!-- body -->

## Conditions préalables

### Autoriser la Feature Gate

La [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `EvenPodsSpread`  doit être autorisée pour
{{< glossary_tooltip text="l'API Server" term_id="kube-apiserver" >}} **et** le
{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}}.

### Labels de noeuds

Les contraintes de propagation de topologie reposent sur les labels de noeuds pour identifier le ou les domaines de topologie dans lesquels se trouve  chacun des noeuds. Par exemple, un noeud pourrait avoir les labels: `node=node1,zone=us-east-1a,region=us-east-1`

Supposez que vous avec un cluster de 4 noeuds ayant les labels suivants:

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

Vous pouvez en savoir plus sur ce champ en exécutant `kubectl explain Pod.spec.topologySpreadConstraints`.

### Exemple : Une TopologySpreadConstraint

Supposez que vous avez un cluster de 4 noeuds où 3 Pods étiquettés `foo:bar` sont placés sur node1, node2 et node3 respectivement (`P` représente un Pod) :

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

{{< codenew file="pods/topology-spread-constraints/one-constraint.yaml" >}}

`topologyKey: zone` implies the even distribution will only be applied to the nodes which have label pair "zone:&lt;any value&gt;" present. `whenUnsatisfiable: DoNotSchedule` tells the scheduler to let it stay pending if the incoming Pod can’t satisfy the constraint.

If the scheduler placed this incoming Pod into "zoneA", the Pods distribution would become [3, 1], hence the actual skew is 2 (3 - 1) - which violates `maxSkew: 1`. In this example, the incoming Pod can only be placed onto "zoneB":

```
+---------------+---------------+      +---------------+---------------+
|     zoneA     |     zoneB     |      |     zoneA     |     zoneB     |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |  OR  | node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
|   P   |   P   |   P   |   P   |      |   P   |   P   |  P P  |       |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
```

You can tweak the Pod spec to meet various kinds of requirements:

- Change `maxSkew` to a bigger value like "2" so that the incoming Pod can be placed onto "zoneA" as well.
- Change `topologyKey` to "node" so as to distribute the Pods evenly across nodes instead of zones. In the above example, if `maxSkew` remains "1", the incoming Pod can only be placed onto "node4".
- Change `whenUnsatisfiable: DoNotSchedule` to `whenUnsatisfiable: ScheduleAnyway` to ensure the incoming Pod to be always schedulable (suppose other scheduling APIs are satisfied). However, it’s preferred to be placed onto the topology domain which has fewer matching Pods. (Be aware that this preferability is jointly normalized with other internal scheduling priorities like resource usage ratio, etc.)

### Example: Multiple TopologySpreadConstraints

This builds upon the previous example. Suppose you have a 4-node cluster where 3 Pods labeled `foo:bar` are located in node1, node2 and node3 respectively (`P` represents Pod):

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
|   P   |   P   |   P   |       |
+-------+-------+-------+-------+
```

You can use 2 TopologySpreadConstraints to control the Pods spreading on both zone and node:

{{< codenew file="pods/topology-spread-constraints/two-constraints.yaml" >}}

In this case, to match the first constraint, the incoming Pod can only be placed onto "zoneB"; while in terms of the second constraint, the incoming Pod can only be placed onto "node4". Then the results of 2 constraints are ANDed, so the only viable option is to place on "node4".

Multiple constraints can lead to conflicts. Suppose you have a 3-node cluster across 2 zones:

```
+---------------+-------+
|     zoneA     | zoneB |
+-------+-------+-------+
| node1 | node2 | node3 |
+-------+-------+-------+
|  P P  |   P   |  P P  |
+-------+-------+-------+
```

If you apply "two-constraints.yaml" to this cluster, you will notice "mypod" stays in `Pending` state. This is because: to satisfy the first constraint, "mypod" can only be put to "zoneB"; while in terms of the second constraint, "mypod" can only put to "node2". Then a joint result of "zoneB" and "node2" returns nothing.

To overcome this situation, you can either increase the `maxSkew` or modify one of the constraints to use `whenUnsatisfiable: ScheduleAnyway`.

### Conventions

There are some implicit conventions worth noting here:

- Only the Pods holding the same namespace as the incoming Pod can be matching candidates.

- Nodes without `topologySpreadConstraints[*].topologyKey` present will be bypassed. It implies that:

  1. the Pods located on those nodes do not impact `maxSkew` calculation - in the above example, suppose "node1" does not have label "zone", then the 2 Pods will be disregarded, hence the incomingPod will be scheduled into "zoneA".
  2. the incoming Pod has no chances to be scheduled onto this kind of nodes - in the above example, suppose a "node5" carrying label `{zone-typo: zoneC}` joins the cluster, it will be bypassed due to the absence of label key "zone".

- Be aware of what will happen if the incomingPod’s `topologySpreadConstraints[*].labelSelector` doesn’t match its own labels. In the above example, if we remove the incoming Pod’s labels, it can still be placed onto "zoneB" since the constraints are still satisfied. However, after the placement, the degree of imbalance of the cluster remains unchanged - it’s still zoneA having 2 Pods which hold label {foo:bar}, and zoneB having 1 Pod which holds label {foo:bar}. So if this is not what you expect, we recommend the workload’s `topologySpreadConstraints[*].labelSelector` to match its own labels.

- If the incoming Pod has `spec.nodeSelector` or `spec.affinity.nodeAffinity` defined, nodes not matching them will be bypassed.

    Suppose you have a 5-node cluster ranging from zoneA to zoneC:

    ```
    +---------------+---------------+-------+
    |     zoneA     |     zoneB     | zoneC |
    +-------+-------+-------+-------+-------+
    | node1 | node2 | node3 | node4 | node5 |
    +-------+-------+-------+-------+-------+
    |   P   |   P   |   P   |       |       |
    +-------+-------+-------+-------+-------+
    ```

    and you know that "zoneC" must be excluded. In this case, you can compose the yaml as below, so that "mypod" will be placed onto "zoneB" instead of "zoneC". Similarly `spec.nodeSelector` is also respected.

    {{< codenew file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" >}}

### Cluster-level default constraints

{{< feature-state for_k8s_version="v1.18" state="alpha" >}}

It is possible to set default topology spread constraints for a cluster. Default
topology spread constraints are applied to a Pod if, and only if:

- It doesn't define any constraints in its `.spec.topologySpreadConstraints`.
- It belongs to a service, replication controller, replica set or stateful set.

Default constraints can be set as part of the `PodTopologySpread` plugin args
in a [scheduling profile](/docs/reference/scheduling/profiles).
The constraints are specified with the same [API above](#api), except that
`labelSelector` must be empty. The selectors are calculated from the services,
replication controllers, replica sets or stateful sets that the Pod belongs to.

An example configuration might look like follows:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha2
kind: KubeSchedulerConfiguration

profiles:
  pluginConfig:
    - name: PodTopologySpread
      args:
        defaultConstraints:
          - maxSkew: 1
            topologyKey: failure-domain.beta.kubernetes.io/zone
            whenUnsatisfiable: ScheduleAnyway
```

{{< note >}}
The score produced by default scheduling constraints might conflict with the
score produced by the
[`DefaultPodTopologySpread` plugin](/docs/reference/scheduling/profiles/#scheduling-plugins).
It is recommended that you disable this plugin in the scheduling profile when
using default constraints for `PodTopologySpread`.
{{< /note >}}

## Comparison with PodAffinity/PodAntiAffinity

In Kubernetes, directives related to "Affinity" control how Pods are
scheduled - more packed or more scattered.

- For `PodAffinity`, you can try to pack any number of Pods into qualifying
  topology domain(s)
- For `PodAntiAffinity`, only one Pod can be scheduled into a
  single topology domain.

The "EvenPodsSpread" feature provides flexible options to distribute Pods evenly across different
topology domains - to achieve high availability or cost-saving. This can also help on rolling update
workloads and scaling out replicas smoothly. See [Motivation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation) for more details.

## Known Limitations

As of 1.18, at which this feature is Beta, there are some known limitations:

- Scaling down a Deployment may result in imbalanced Pods distribution.
- Pods matched on tainted nodes are respected. See [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)


