---
reviewers:
  - jlowdermilk
  - justinsb
  - quinton-hoole
title: Exécution sur plusieurs zones
weight: 20
content_type: concept
---

<!-- overview -->

Cette page décrit l’exécution de Kubernetes sur plusieurs zones.

<!-- body -->

## Contexte

Kubernetes est conçu pour qu’un seul cluster Kubernetes puisse fonctionner
sur plusieurs zones de défaillance, généralement regroupées au sein d’une
_entité logique_ appelée _région_. Les principaux fournisseurs cloud définissent
une région comme un ensemble de zones de défaillance (également appelées _zones de disponibilité_)
qui fournissent un ensemble cohérent de fonctionnalités : dans une région, chaque zone
expose les mêmes API et services.

Les architectures cloud typiques visent à réduire au maximum le risque qu’une panne
dans une zone affecte également les services d’une autre zone.

## Comportement du plan de contrôle

Tous les [composants du plan de contrôle](/docs/concepts/architecture/#control-plane-components)
peuvent fonctionner comme un ensemble de ressources interchangeables, répliquées par composant.

Lors du déploiement d’un plan de contrôle Kubernetes, placez les réplicas des
composants du plan de contrôle sur plusieurs zones de défaillance. Si la disponibilité est
un critère important, sélectionnez au moins trois zones de défaillance et répliquez
chaque composant du plan de contrôle (API server, scheduler, etcd,
controller manager) sur au moins trois zones de défaillance.
Si vous utilisez un cloud controller manager, vous devez également le répliquer
dans toutes les zones sélectionnées.

{{< note >}}
Kubernetes ne fournit pas de résilience inter-zones pour les points d’accès de l’API server.
Vous pouvez utiliser différentes techniques pour améliorer la disponibilité de l’API cluster,
notamment le round-robin DNS, les enregistrements SRV ou une solution de load balancing tierce avec vérification de santé.
{{< /note >}}

## Comportement des nœuds

Kubernetes répartit automatiquement les Pods des ressources de charge de travail
(telles que {{< glossary_tooltip text="Deployment" term_id="deployment" >}} ou
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}) sur différents nœuds du cluster.
Cette répartition permet de réduire l’impact des défaillances.

Lors de leur démarrage, les kubelets sur chaque nœud ajoutent automatiquement des
{{< glossary_tooltip text="labels" term_id="label" >}} à l’objet Node représentant
ce kubelet dans l’API Kubernetes. Ces labels peuvent inclure des
informations de zone
([zone information](/docs/reference/labels-annotations-taints/#topologykubernetesiozone)).

Si votre cluster s’étend sur plusieurs zones ou régions, vous pouvez utiliser ces labels
avec des
[contraintes de répartition topologique des Pods](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
pour contrôler la distribution des Pods entre les domaines de défaillance :
régions, zones et même nœuds spécifiques.
Ces indications permettent au
{{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} de placer
les Pods de manière à améliorer la disponibilité et réduire le risque qu’une panne corrélée
affecte l’ensemble de votre charge de travail.

Par exemple, vous pouvez définir une contrainte pour vous assurer que les 3 réplicas
d’un StatefulSet sont répartis sur des zones différentes lorsque cela est possible.
Cela peut être défini de manière déclarative sans avoir à spécifier explicitement
les zones utilisées pour chaque workload.

### Répartition des nœuds entre les zones

Le cœur de Kubernetes ne crée pas de nœuds pour vous ; vous devez le faire vous-même,
ou utiliser un outil comme le [Cluster API](https://cluster-api.sigs.k8s.io/)
pour gérer les nœuds à votre place.

Avec des outils comme Cluster API, vous pouvez définir des ensembles de machines
exécutées comme nœuds de travail répartis sur plusieurs domaines de défaillance,
ainsi que des règles permettant de réparer automatiquement le cluster en cas
de panne complète d’une zone.

## Attribution manuelle des zones aux Pods

Vous pouvez appliquer des [sélecteurs de nœuds](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
aux Pods que vous créez, ainsi qu’aux templates de Pods dans les ressources
de type Deployment, StatefulSet ou Job.

## Accès au stockage par zone

Lors de la création de volumes persistants, Kubernetes ajoute automatiquement des labels
de zone aux PersistentVolumes liés à une zone spécifique.
Le {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} s’assure ensuite,
via le prédicat `NoVolumeZoneConflict`, que les pods utilisant un PersistentVolume donné
sont planifiés uniquement dans la même zone que ce volume.

Notez que la manière d’ajouter ces labels dépend du fournisseur cloud
et du provisionneur de stockage utilisé. Consultez toujours la documentation
de votre environnement pour garantir une configuration correcte.

Vous pouvez spécifier une {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}
qui définit les domaines de défaillance (zones) dans lesquels le stockage peut être créé.
Pour en savoir plus, consultez les
[topologies autorisées](/docs/concepts/storage/storage-classes/#allowed-topologies).

## Réseau

Kubernetes n’intègre pas nativement de prise en charge du réseau par zone.
Vous pouvez utiliser un
[plugin réseau](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
pour configurer la connectivité du cluster, et cette solution peut inclure des
éléments dépendant des zones. Par exemple, si votre fournisseur cloud prend en charge
les Services de type `LoadBalancer`, le load balancer peut diriger le trafic uniquement
vers les Pods situés dans la même zone que l’instance traitant la connexion.

Consultez la documentation de votre fournisseur cloud pour plus de détails.

Pour les déploiements sur site ou personnalisés, des considérations similaires s’appliquent.
Le comportement des {{< glossary_tooltip text="Service" term_id="service" >}} et
{{< glossary_tooltip text="Ingress" term_id="ingress" >}}, notamment en matière de zones,
dépend de la configuration de votre cluster.

## Récupération en cas de panne

Lors de la configuration du cluster, vous devez également envisager la manière
dont votre système peut restaurer le service si toutes les zones d’une région deviennent
indisponibles simultanément. Par exemple, votre système dépend-il de la présence
d’au moins un nœud actif dans une zone ?

Assurez-vous que les opérations de réparation critiques ne dépendent pas de la disponibilité
d’un nœud sain dans le cluster. Par exemple, si tous les nœuds sont défaillants,
vous devrez peut-être exécuter une tâche de réparation avec une
{{< glossary_tooltip text="tolérance" term_id="toleration" >}} spéciale afin de permettre
la remise en service d’au moins un nœud.

Kubernetes ne fournit pas de solution complète à ce problème, mais il s’agit
d’un point important à prendre en compte.

## {{% heading "whatsnext" %}}

Pour comprendre comment le scheduler place les Pods dans un cluster en respectant
les contraintes configurées, consultez la section
[Planification et éviction](/docs/concepts/scheduling-eviction/).
