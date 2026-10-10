---
reviewers:
- davidopp
- lavalamp
title: Considérations pour les grands clusters
weight: 10
---

Un cluster est un ensemble de {{< glossary_tooltip text="nœuds" term_id="node" >}} (machines physiques ou virtuelles) exécutant des agents Kubernetes, et gérés par le {{< glossary_tooltip text="plan de contrôle" term_id="control-plane" >}}.

Kubernetes {{< param "version" >}} prend en charge des clusters pouvant aller jusqu’à 5 000 nœuds. Plus précisément, Kubernetes est conçu pour fonctionner avec des configurations respectant *toutes* les limites suivantes :

* Pas plus de 110 pods par nœud
* Pas plus de 5 000 nœuds
* Pas plus de 150 000 pods au total
* Pas plus de 300 000 conteneurs au total

Vous pouvez faire évoluer votre cluster en ajoutant ou en supprimant des nœuds. La manière de procéder dépend du mode de déploiement de votre cluster.

## Quotas de ressources des fournisseurs cloud {#quota-issues}

Pour éviter de rencontrer des problèmes de quotas chez les fournisseurs cloud lors de la création d’un cluster comportant de nombreux nœuds, il est recommandé de :

* Demander une augmentation de quota pour les ressources cloud telles que :
  * Instances de calcul
  * CPU
  * Volumes de stockage
  * Adresses IP utilisées
  * Jeux de règles de filtrage réseau
  * Nombre de load balancers
  * Sous-réseaux
  * Flux de logs
* Limiter les opérations de montée en charge du cluster en créant les nouveaux nœuds par lots, avec des pauses entre chaque lot, car certains fournisseurs cloud appliquent des limitations de débit sur la création d’instances.

## Composants du plan de contrôle

Pour un grand cluster, vous devez disposer d’un plan de contrôle avec suffisamment de ressources de calcul et autres.

En général, il est recommandé d’exécuter une ou deux instances de plan de contrôle par zone de disponibilité, en commençant par un dimensionnement vertical, puis en passant à un dimensionnement horizontal lorsque les gains de performance deviennent faibles.

Vous devez exécuter au moins une instance par zone de disponibilité pour assurer la tolérance aux pannes. Les nœuds Kubernetes ne redirigent pas automatiquement le trafic vers les points de terminaison du plan de contrôle situés dans la même zone de défaillance ; cependant, votre fournisseur cloud peut proposer ses propres mécanismes pour cela.

Par exemple, avec un load balancer managé, vous pouvez configurer celui-ci pour diriger le trafic provenant du kubelet et des pods d’une zone de défaillance _A_ uniquement vers les nœuds du plan de contrôle situés dans la même zone _A_. Si un nœud du plan de contrôle ou une zone entière devient indisponible, le trafic du plan de contrôle pour cette zone est alors redirigé entre zones. Exécuter plusieurs instances du plan de contrôle dans chaque zone réduit ce risque.

### Stockage etcd

Pour améliorer les performances des grands clusters, vous pouvez stocker les objets Event dans une instance etcd dédiée séparée.

Lors de la création d’un cluster, vous pouvez (via des outils personnalisés) :

* démarrer et configurer une instance etcd supplémentaire
* configurer le {{< glossary_tooltip term_id="kube-apiserver" text="serveur API" >}} pour l’utiliser pour le stockage des événements

Voir [Exploiter des clusters etcd pour Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) et
[Configurer un cluster etcd haute disponibilité avec kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
pour plus de détails sur la configuration et la gestion d’etcd pour un grand cluster.

## Ressources des addons

Les [limites de ressources Kubernetes](/docs/concepts/configuration/manage-resources-containers/)
permettent de réduire l’impact des fuites mémoire et d’autres comportements des pods et conteneurs sur les autres composants. Ces limites s’appliquent également aux ressources des
{{< glossary_tooltip text="addons" term_id="addons" >}} comme elles s’appliquent aux charges de travail applicatives.

Par exemple, vous pouvez définir des limites CPU et mémoire pour un composant de logging :

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

Les limites par défaut des addons sont généralement basées sur l’expérience des clusters de petite ou moyenne taille. Dans les grands clusters, les addons consomment souvent plus de ressources que prévu. Sans ajustement, ils peuvent être constamment redémarrés en raison des limites mémoire, ou fonctionner avec de mauvaises performances à cause des restrictions CPU.

Pour éviter ces problèmes, lors de la création d’un cluster avec de nombreux nœuds, il est recommandé de :

* Certains addons sont scalés verticalement (une seule instance pour tout le cluster ou par zone de disponibilité). Dans ce cas, augmentez les requests et limits à mesure que le cluster grandit.
* De nombreux addons scalent horizontalement (plus de pods ajoutés), mais peuvent aussi nécessiter une augmentation légère des ressources dans les très grands clusters. Le [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) peut être utilisé en mode _recommender_ pour proposer des valeurs.
* Certains addons s’exécutent en une instance par nœud via un {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} (ex : collecte de logs). Ils peuvent également nécessiter un ajustement des ressources.

## Priorisation des composants essentiels du cluster

Pour garantir que les composants essentiels du cluster (comme CoreDNS, metrics-server et autres addons critiques) soient planifiés avant les autres charges de travail et ne soient pas préemptés, ils doivent être exécutés avec une [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/) système, comme `system-cluster-critical` ou `system-node-critical`.

## {{% heading "whatsnext" %}}

* `VerticalPodAutoscaler` est une ressource personnalisée que vous pouvez déployer dans votre cluster pour vous aider à gérer les requests et limits des pods.  
  En savoir plus sur le [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)
  et comment l’utiliser pour dimensionner les composants du cluster, y compris les addons critiques.

* Lire sur [l’autoscaling des nœuds](/docs/concepts/cluster-administration/node-autoscaling/)

* Le [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
  vous aide à redimensionner automatiquement les addons en fonction de la taille de votre cluster.
  