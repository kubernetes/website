---
reviewers:
- brendandburns
- erictune
- mikedanese
title: Bien démarrer
main_menu: true
weight: 20
content_type: concept
no_list: true
---

<!-- overview -->

Cette section présente les différentes façons de configurer et d’exécuter Kubernetes.
Lorsque vous installez Kubernetes, choisissez un type d’installation en fonction de la facilité de maintenance, de la sécurité,
du contrôle, des ressources disponibles et de l’expertise requise pour exploiter et gérer un cluster.

Vous pouvez [télécharger Kubernetes](/releases/download/) pour déployer un cluster Kubernetes
sur une machine locale, dans le cloud ou dans votre propre centre de données.

Plusieurs [composants Kubernetes](/docs/concepts/overview/components/) tels que {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} ou {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} peuvent également être
déployés sous forme d’[images de conteneur](/releases/download/#container-images) au sein du cluster.

Il est **recommandé** d’exécuter les composants Kubernetes sous forme d’images de conteneur lorsque cela est possible, et de laisser Kubernetes gérer ces composants.
Les composants qui exécutent des conteneurs — notamment kubelet — ne peuvent pas être inclus dans cette catégorie.

Si vous ne souhaitez pas gérer vous-même un cluster Kubernetes, vous pouvez choisir un service managé, y compris des
[plateformes certifiées](/docs/setup/production-environment/turnkey-solutions/).
Il existe également d’autres solutions standardisées et personnalisées dans une large gamme d’environnements cloud et bare metal.

<!-- body -->

## Environnement d’apprentissage

Si vous apprenez Kubernetes, utilisez les outils pris en charge par la communauté Kubernetes
ou ceux de l’écosystème pour configurer un cluster Kubernetes sur une machine locale.
Voir [Environnement d’apprentissage](/docs/setup/learning-environment/)

## Environnement de production

Lors de l’évaluation d’une solution pour un
[environnement de production](/docs/setup/production-environment/), déterminez quels aspects
de l’exploitation d’un cluster Kubernetes (ou _abstractions_) vous souhaitez gérer vous-même et lesquels vous
préférez déléguer à un fournisseur.

Pour un cluster que vous gérez vous-même, l’outil officiellement pris en charge
pour déployer Kubernetes est [kubeadm](/docs/setup/production-environment/tools/kubeadm/).

## {{% heading "whatsnext" %}}

- [Télécharger Kubernetes](/releases/download/)
- Télécharger et [installer les outils](/docs/tasks/tools/) incluant `kubectl`
- Choisir un [runtime de conteneur](/docs/setup/production-environment/container-runtimes/) pour votre cluster
- Découvrir les [bonnes pratiques](/docs/setup/best-practices/) pour la configuration du cluster

Kubernetes est conçu pour que son {{< glossary_tooltip term_id="control-plane" text="plan de contrôle" >}}
s’exécute sur Linux. Dans votre cluster, vous pouvez exécuter des applications sur Linux ou d’autres systèmes d’exploitation, y compris Windows.

- Apprendre à [configurer des clusters avec des nœuds Windows](/docs/concepts/windows/)
