---
reviewers:
- sig-cluster-lifecycle
title: Options pour une topologie hautement disponible
content_type: concept
weight: 50
---

<!-- aperçu -->

Cette page explique les deux options pour configurer la topologie de vos clusters Kubernetes hautement disponibles (HA).

Vous pouvez configurer un cluster HA :

- Avec des nœuds de plan de contrôle empilés (stacked), où les nœuds etcd sont co-localisés avec les nœuds du plan de contrôle
- Avec des nœuds etcd externes, où etcd s’exécute sur des nœuds séparés des nœuds du plan de contrôle

Vous devez soigneusement comparer les avantages et inconvénients de chaque topologie avant de configurer un cluster HA.

{{< note >}}
kubeadm initialise le cluster etcd de manière statique. Consultez le
[Guide de clustering etcd](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)
pour plus de détails.
{{< /note >}}

<!-- corps -->

## Topologie etcd empilée (stacked)

Un cluster HA empilé est une [topologie](https://en.wikipedia.org/wiki/Network_topology) dans laquelle le cluster de stockage distribué fourni par etcd est empilé sur le cluster formé par les nœuds gérés par kubeadm qui exécutent les composants du plan de contrôle.

Chaque nœud du plan de contrôle exécute une instance de `kube-apiserver`, `kube-scheduler` et `kube-controller-manager`.
Le `kube-apiserver` est exposé aux nœuds workers via un load balancer.

Chaque nœud du plan de contrôle crée un membre etcd local, et ce membre etcd communique uniquement avec le `kube-apiserver` de ce même nœud.
Il en va de même pour les instances locales de `kube-controller-manager` et `kube-scheduler`.

Cette topologie couple les composants du plan de contrôle et les membres etcd sur les mêmes nœuds. Elle est plus simple à mettre en place qu’un cluster avec etcd externe, et plus simple à gérer pour la réplication.

Cependant, cette approche comporte un risque de couplage de défaillance. Si un nœud tombe, un membre etcd et une instance du plan de contrôle sont perdus, ce qui réduit la redondance.
Vous pouvez atténuer ce risque en ajoutant davantage de nœuds de plan de contrôle.

Il est donc recommandé d’exécuter au minimum trois nœuds de plan de contrôle empilés pour un cluster HA.

C’est la topologie par défaut dans kubeadm. Un membre etcd local est créé automatiquement
sur les nœuds du plan de contrôle lors de l’utilisation de `kubeadm init` et `kubeadm join --control-plane`.

![Topologie etcd empilée](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

## Topologie etcd externe

Un cluster HA avec etcd externe est une [topologie](https://en.wikipedia.org/wiki/Network_topology)
dans laquelle le cluster de stockage distribué fourni par etcd est externe au cluster formé par les nœuds exécutant les composants du plan de contrôle.

Comme dans la topologie empilée, chaque nœud du plan de contrôle exécute une instance de `kube-apiserver`, `kube-scheduler` et `kube-controller-manager`.
Le `kube-apiserver` est exposé aux nœuds workers via un load balancer. Cependant, les membres etcd s’exécutent sur des hôtes séparés, et chaque hôte etcd communique avec le `kube-apiserver` de chaque nœud du plan de contrôle.

Cette topologie découple le plan de contrôle et etcd. Elle permet donc une meilleure résilience : la perte d’un nœud du plan de contrôle ou d’un membre etcd a moins d’impact sur la redondance du cluster.

Cependant, cette topologie nécessite deux fois plus de machines que la topologie empilée.
Un minimum de trois nœuds pour le plan de contrôle et trois nœuds pour etcd est requis pour un cluster HA avec cette topologie.

![Topologie etcd externe](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)

## {{% heading "whatsnext" %}}

- [Configurer un cluster hautement disponible avec kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
