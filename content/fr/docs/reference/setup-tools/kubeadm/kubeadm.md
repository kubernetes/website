---
title: Aperçu de kubeadm
weight: 10
card:
  name: reference
  weight: 40
---
<img src="https://raw.githubusercontent.com/cncf/artwork/master/projects/kubernetes/certified-kubernetes/versionless/color/certified-kubernetes-color.png" align="right" width="150px">Kubeadm est un outil conçu afin que les commandes `kubeadm init` et `kubeadm join` soient la meilleure façon de créer rapidement des clusters Kubernetes.

Kubeadm effectue les actions nécessaires afin d'obtenir un cluster minimal mais fonctionnel et en état de marche. Son objectif est d'assembler le cluster sans pour autant provisioner les machines qui le composent. De la même façon, kubeadm ne supporte pas l'installation des extensions habituelles comme le Dashboard (tableau de bord), les solutions de surveillance ou bien encore les extensions spécifiques aux fournisseurs cloud.

On préférera des outils plus spécifiques et de plus haut niveau, construits autour de kubeadm, et qui, idéalement, utiliseront kubeadm comme base de déploiement afin de créer facilement des clusters conformes.

## Prochaines étapes

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init) pour assembler un noeud Kubernetes control-plane
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) pour assembler un noeud Kubernetes worker node et le joindre au cluster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) pour mettre à jour un cluster Kubernetes vers une version plus récente
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config) si vous avez initialisé votre cluster en utilisant kubeadm v1.7.x ou antérieur, pour configurer votre cluster avec `kubeadm upgrade`
* [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token) pour gérer vos jetons avec `kubeadm join`
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset) pour annuler des changements faits avec `kubeadm init` ou `kubeadm join` à cet hôte 
* [kubeadm version](/docs/reference/setup-tools/kubeadm/kubeadm-version) pour afficher la version de kubeadm
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha) pour utiliser un lot de fonctionnalités rendus disponibles afin d'obtenir le retour de la communauté
