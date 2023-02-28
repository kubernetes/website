---
title: Options pour la topologie en haute disponibilité
description: Topologie haute-disponibilité Kubernetes
content_type: concept
weight: 50
---

<!-- overview -->

Cette page explique les deux options de configuration de topologie de vos clusters Kubernetes
pour la haute disponibilité.

Vous pouvez configurer un cluster en haute disponibilité:

- Avec des nœuds du control plane empilés, les nœuds etcd étant co-localisés avec des nœuds du control plane
- Avec des nœuds etcd externes, où etcd s'exécute sur des nœuds distincts du control plane

Vous devez examiner attentivement les avantages et les inconvénients de chaque topologie avant
de configurer un cluster en haute disponibilité.


<!-- body -->

## Topologie etcd empilée

Un cluster HA empilé est une [topologie réseau](https://fr.wikipedia.org/wiki/Topologie_de_r%C3%A9seau)
où le cluster de stockage de données distribuées est fourni par etcd et est superposé au
cluster formé par les noeuds gérés par kubeadm qui exécute les composants du control plane.

Chaque nœud du control plane exécute une instance de `kube-apiserver`, `kube-scheduler` et
`kube-controller-manager`.
Le `kube-apiserver` est exposé aux nœuds à l'aide d'un loadbalancer.

Chaque nœud du control plane crée un membre etcd local et ce membre etcd communique uniquement avec
le `kube-apiserver` de ce noeud. Il en va de même pour le `kube-controller-manager` local
et les instances de `kube-scheduler`.

Cette topologie couple les control planes et les membres etcd sur les mêmes nœuds. C'est
plus simple à mettre en place qu'un cluster avec des nœuds etcd externes et plus simple à
gérer pour la réplication.

Cependant, un cluster empilé présente un risque d'échec du couplage. Si un noeud tombe en panne,
un membre etcd et une instance du control plane sont perdus et la redondance est compromise. Vous
pouvez atténuer ce risque en ajoutant plus de nœuds au control plane.

Par conséquent, vous devez exécuter au moins trois nœuds de control plane empilés pour un cluster
en haute disponibilité.

C'est la topologie par défaut dans kubeadm. Un membre etcd local est créé automatiquement
sur les noeuds du control plane en utilisant `kubeadm init` et `kubeadm join --experimental-control-plane`.

Schéma de la [Topologie etcd empilée](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

## Topologie etcd externe

Un cluster haute disponibilité avec un etcd externe est une
[topologie réseau](https://fr.wikipedia.org/wiki/Topologie_de_r%C3%A9seau) où le cluster de stockage de données
distribuées fourni par etcd est externe au cluster formé par les nœuds qui exécutent les composants
du control plane.

Comme la topologie etcd empilée, chaque nœud du control plane d'une topologie etcd externe exécute
une instance de `kube-apiserver`, `kube-scheduler` et `kube-controller-manager`. Et le `kube-apiserver`
est exposé aux nœuds workers à l’aide d’un load-balancer. Cependant, les membres etcd s'exécutent sur
des hôtes distincts et chaque hôte etcd communique avec le `kube-apiserver` de chaque nœud du control plane.

Cette topologie dissocie le control plane et le membre etcd. Elle fournit donc une configuration HA où
perdre une instance de control plane ou un membre etcd a moins d'impact et n'affecte pas la redondance du
cluster autant que la topologie HA empilée.

Cependant, cette topologie requiert le double du nombre d'hôtes de la topologie HA integrée.
Un minimum de trois machines pour les nœuds du control plane et de trois machines
 pour les nœuds etcd est requis pour un cluster HA avec cette topologie.

Schéma de la [Topologie externe etcd](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)



## {{% heading "whatsnext" %}}


- [Configurer un cluster hautement disponible avec kubeadm](/fr/docs/setup/production-environment/tools/kubeadm/high-availability/)

