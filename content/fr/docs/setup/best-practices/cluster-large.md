---
reviewers:
  - davidopp
  - lavalamp
title: Considérations pour les grands clusters
weight: 10
---

Un cluster est un ensemble de {{< glossary_tooltip text="nœuds" term_id="node" >}} (machines physiques ou virtuelles) exécutant des agents Kubernetes, et gérés par le
{{< glossary_tooltip text="plan de contrôle" term_id="control-plane" >}}.
Kubernetes {{< param "version" >}} prend en charge des clusters allant jusqu’à 5 000 nœuds. Plus précisément,
Kubernetes est conçu pour s’adapter à des configurations respectant _toutes_ les conditions suivantes :

- Pas plus de 110 pods par nœud
- Pas plus de 5 000 nœuds
- Pas plus de 150 000 pods au total
- Pas plus de 300 000 conteneurs au total

Vous pouvez faire évoluer votre cluster en ajoutant ou en supprimant des nœuds. La manière de procéder dépend de la façon dont votre cluster est déployé.

## Quotas de ressources des fournisseurs cloud {#quota-issues}

Pour éviter les problèmes de quotas des fournisseurs cloud lors de la création d’un cluster comportant de nombreux nœuds, il faut envisager :

- Demander une augmentation de quota pour les ressources cloud telles que :
  - Instances de calcul
  - CPU
  - Volumes de stockage
  - Adresses IP utilisées
  - Règles de filtrage de paquets
  - Nombre de load balancers
  - Sous-réseaux
  - Flux de logs
- Réguler les opérations de mise à l’échelle du cluster afin de créer les nouveaux nœuds par lots, avec une pause entre chaque lot, car certains fournisseurs cloud appliquent des limites de débit sur la création d’instances.

## Composants du plan de contrôle

Pour un cluster de grande taille, vous avez besoin d’un plan de contrôle disposant de ressources de calcul suffisantes.

En général, vous exécutez une ou deux instances du plan de contrôle par zone de défaillance, en les faisant évoluer verticalement en premier lieu, puis horizontalement une fois les gains de performance devenus marginaux.

Vous devez exécuter au moins une instance par zone de défaillance pour assurer la tolérance aux pannes. Les nœuds Kubernetes n’orientent pas automatiquement le trafic vers les points de terminaison du plan de contrôle situés dans la même zone de défaillance ; cependant, votre fournisseur cloud peut proposer ses propres mécanismes pour cela.

Par exemple, avec un load balancer géré, vous pouvez configurer celui-ci pour diriger le trafic provenant du kubelet et des Pods situés dans la zone de défaillance _A_ uniquement vers les serveurs du plan de contrôle également situés dans la zone _A_. Si un seul serveur du plan de contrôle ou un endpoint de la zone _A_ devient indisponible, tout le trafic du plan de contrôle de cette zone sera redirigé entre zones. Avoir plusieurs serveurs du plan de contrôle par zone réduit ce risque.

### Stockage etcd

Pour améliorer les performances des grands clusters, vous pouvez stocker les objets Event dans une instance etcd dédiée et séparée.

Lors de la création d’un cluster, vous pouvez (via des outils personnalisés) :

- démarrer et configurer une instance etcd supplémentaire
- configurer le {{< glossary_tooltip term_id="kube-apiserver" text="serveur API" >}} pour y stocker les événements

Voir [Opérer des clusters etcd pour Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) et
[Configurer un cluster etcd haute disponibilité avec kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
pour plus de détails sur la configuration et la gestion d’etcd dans un grand cluster.

## Ressources des addons

Les [limites de ressources Kubernetes](/docs/concepts/configuration/manage-resources-containers/)
permettent de limiter l’impact des fuites mémoire et d’autres problèmes pouvant affecter les pods et conteneurs sur les autres composants. Ces limites s’appliquent également aux ressources des
{{< glossary_tooltip text="addons" term_id="addons" >}} de la même manière qu’aux charges applicatives.

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

Les limites par défaut des addons sont généralement basées sur des données issues de l’expérience d’exécution de chaque addon sur des clusters Kubernetes de petite ou moyenne taille. Lorsqu’ils sont exécutés sur de grands clusters, les addons consomment souvent davantage de ressources que ce que permettent leurs limites par défaut. Si un grand cluster est déployé sans ajuster ces valeurs, les addons peuvent être constamment redémarrés car ils atteignent la limite mémoire. Alternativement, ils peuvent fonctionner mais avec de mauvaises performances en raison des restrictions de partage du temps CPU.

Pour éviter les problèmes de ressources liés aux addons du cluster lors de la création d’un cluster comportant de nombreux nœuds, il faut considérer les points suivants :

- Certains addons sont scalés verticalement — il n’existe qu’une seule réplique de l’addon pour tout le cluster ou pour une zone de défaillance entière. Pour ces addons, il faut augmenter les requests et les limits lors de la montée en charge du cluster.
- De nombreux addons sont scalés horizontalement — la capacité est augmentée en ajoutant des pods — mais dans les très grands clusters, il peut également être nécessaire d’augmenter légèrement les limites CPU ou mémoire. Le [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) peut fonctionner en mode _recommender_ afin de proposer des valeurs recommandées pour les requests et limits.
- Certains addons s’exécutent en une copie par nœud, contrôlés par un {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} : par exemple, un agrégateur de logs au niveau des nœuds. Comme dans le cas des addons scalés horizontalement, il peut également être nécessaire d’augmenter légèrement les limites CPU ou mémoire.

## Priorisation des composants essentiels du cluster

Pour garantir que les composants essentiels du cluster (tels que CoreDNS, metrics-server et autres addons critiques) soient planifiés avant les autres charges de travail et ne soient pas préemptés par des pods de priorité plus faible, exécutez-les avec une [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/) système, telle que `system-cluster-critical` ou `system-node-critical`.

## {{% heading "whatsnext" %}}

- `VerticalPodAutoscaler` est une ressource personnalisée que vous pouvez déployer dans votre cluster afin de gérer les requests et limits des pods.  
  Apprenez-en plus sur le [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)
  et sur la manière de l’utiliser pour scaler les composants du cluster, y compris les addons critiques.

- Consultez l’[autoscaling des nœuds](/docs/concepts/cluster-administration/node-autoscaling/)

- Le [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
  vous aide à redimensionner automatiquement les addons lorsque la taille du cluster évolue.
