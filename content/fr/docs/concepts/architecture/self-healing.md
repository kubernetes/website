---
title: Auto-réparation de Kubernetes
content_type: concept
weight: 50
feature:
  title: Auto-réparation
  anchor: Récupération automatique après une défaillance
  description: >
    Kubernetes redémarre les conteneurs qui se bloquent, remplace les Pods
    entiers lorsque nécessaire, rattache le stockage en cas de défaillances
    plus importantes et peut s'intégrer à des autoscalers de nœuds afin
    d'assurer l'auto-réparation jusqu'au niveau des nœuds.
---
<!-- overview -->

Kubernetes est conçu avec des capacités d'auto-réparation qui contribuent à maintenir la santé et la disponibilité des charges de travail.
Il remplace automatiquement les conteneurs défaillants, reprogramme les charges de travail lorsque des nœuds deviennent indisponibles et veille à ce que l'état souhaité du système soit maintenu.

<!-- body -->

## Capacités d'auto-réparation {#self-healing-capabilities}

- **Redémarrage au niveau des conteneurs :** Si un conteneur à l'intérieur d'un Pod échoue, Kubernetes le redémarre conformément à la [`restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy).

- **Remplacement des réplicas :** Si un Pod appartenant à un [Deployment](/docs/concepts/workloads/controllers/deployment/) ou à un [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) échoue, Kubernetes crée un Pod de remplacement afin de maintenir le nombre de réplicas spécifié.
  Si un Pod faisant partie d'un [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) échoue, le plan de contrôle crée un Pod de remplacement qui s'exécute sur le même nœud.

- **Récupération du stockage persistant :** Si un nœud exécute un Pod auquel est attaché un PersistentVolume (PV) et que ce nœud tombe en panne, Kubernetes peut rattacher le volume à un nouveau Pod sur un autre nœud.

- **Équilibrage de charge pour les Services :** Si un Pod situé derrière un [Service](/docs/concepts/services-networking/service/) échoue, Kubernetes le retire automatiquement des points de terminaison du Service afin que le trafic soit uniquement dirigé vers des Pods sains.

Voici quelques-uns des composants clés qui fournissent les capacités d'auto-réparation de Kubernetes :

- **[kubelet](/docs/concepts/architecture/#kubelet) :** S'assure que les conteneurs sont en cours d'exécution et redémarre ceux qui échouent.

- **Contrôleurs Deployment (via ReplicaSet), ReplicaSet, StatefulSet et DaemonSet :** Maintiennent le nombre souhaité de réplicas de Pods.

- **Contrôleur PersistentVolume :** Gère l'attachement et le détachement des volumes pour les charges de travail avec état.

## Considérations {#considerations}

- **Défaillances du stockage :** Si un volume persistant devient indisponible, des étapes de récupération supplémentaires peuvent être nécessaires.

- **Erreurs applicatives :** Kubernetes peut redémarrer les conteneurs, mais les problèmes sous-jacents de l'application doivent être résolus séparément.

## {{% heading "whatsnext" %}}

- Pour en savoir plus sur les [Pods](/docs/concepts/workloads/pods/)
- Découvrez les [contrôleurs Kubernetes](/docs/concepts/architecture/controller/)
- Explorez les [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
- Découvrez la [mise à l'échelle automatique des nœuds](/docs/concepts/cluster-administration/node-autoscaling/). La mise à l'échelle automatique des nœuds fournit également des mécanismes de réparation automatique lorsqu'un ou plusieurs nœuds de votre cluster tombent en panne.
