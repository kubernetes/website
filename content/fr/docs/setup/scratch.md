---
reviewers:
title: Créer un cluster personnalisé de zéro
---

Ce guide est à destination de ceux qui souhaitent construire un cluster Kubernetes personnalisé. Si vous trouvez un Guide de démarrage qui correspond à vos besoins dans [cette liste](/docs/setup/), nous vous recommandons de l'utiliser, vous beneficierez alors de l'experience des autres. Toutefois, si vous avez un IaaS, un réseau, un gestionnaire de configuration ou un système d'exploitation spécifique et qu'aucun des guides ne correspond à votre besoin, alors ce guide vous fournira les étapes que vous devez réaliser. Notez bien que cela demande beaucoup plus d'effort que d'utiliser un guide prédéfini.

Ce guide est également utile pour ceux qui souhaitent comprendre à un haut niveau ce que font certaines des étapes des scripts d'installation existant de cluster.

{{< toc >}}

## Conception et Préparation

### Apprentissage

  1. Vous devez déjà être familier avec l'utilisation de Kubernetes. Nous vous suggérons de monter un cluster temporaire en suivant un des autres Guide de démarrage.
  Cela vous permettra de vous familiariser avec la CLI ([kubectl](/docs/user-guide/kubectl/)) et les concepts ([pods](/docs/user-guide/pods/), [services](/docs/concepts/services-networking/service/), etc.) en premier.
  2. Vous devez avoir `kubectl` installé sur votre bureau. Cela devrait arriver en achevant un des autres Guide démarrage. Si cela n'est pas le cas, suivez les instructions [ici](/docs/tasks/kubectl/install/).

### Fournisseur de cloud

Kubernetes à le concept d'un fournisseur de cloud, qui est un module qui fournit une interface pour manager des Load Balancer TCP, des noeuds (instances) et des routes réseaux. Cette interface est définit dans `pkg/cloudprovider/cloud.go`. C'est possible de créer un cluster personnalisé sans implémenter un fournisseur de cloud (par exemple is vous faites du serveur physique (bare-metal)), et toutes les parties de l'interface n'ont pas à être implémentées, cela dépend de comment les paramètres sont configurés sur les différents composants.

### Noeuds

- Vous pouvez utiliser des serveurs physiques ou virtuels
- Vous pouvez faire un cluster avec 1 machine, pour lancer tout les exemples et les tests vous devez avoir au moins 4 noeuds
- La plupart des Guide de démarrage font la distinction entre le noeud maître et les autres noeuds. Ce n'est pas strictement nécessaire.
- Les noeuds devront faire une distribution Linux avec une architecture x86_64. Il est possible de faire tourner d'autres OSs et architecture, mais ce guide ne vous assistera pas dans cela.
- L'API et l'ETCD se suffiront sur une machine avec 1 coeur et 1GB de RAM pour des cluster d'une dizaine de noeuds. De plus gros ou plus actifs cluster demanderont plus de coeurs.
- Les autres noeuds peuvent avoir un nombre raisonnable de coeurs et de mémoire. Ils n'ont pas besoin d'avoir tous la même configuration.