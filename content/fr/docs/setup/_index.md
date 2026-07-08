---
reviewers:
- sieben
- perriea
- lledru
- awkif
- yastij
title: Démarrage
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#environnement-dapprentissage"
    title: Environnement d’apprentissage
  - anchor: "#environnement-de-production"
    title: Environnement de production
---

<!-- overview -->

Cette section présente les différentes façons de configurer et d’exécuter Kubernetes.

Lors de l’installation de Kubernetes, vous devez choisir un type d’installation en fonction de plusieurs critères : facilité de maintenance, sécurité, niveau de contrôle, ressources disponibles et expertise nécessaire pour opérer et gérer un cluster.

Vous pouvez [télécharger Kubernetes](/releases/download/) afin de déployer un cluster Kubernetes sur une machine locale, dans le cloud ou dans votre propre centre de données.

Plusieurs [composants Kubernetes](/docs/concepts/overview/components/) tels que {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} ou {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} peuvent également être déployés sous forme d’[images de conteneurs](/releases/download/#container-images) au sein du cluster.

Il est **recommandé** d’exécuter les composants Kubernetes sous forme d’images de conteneurs lorsque cela est possible, afin de laisser Kubernetes les gérer. Les composants qui exécutent des conteneurs — notamment kubelet — ne sont pas inclus dans cette recommandation.

Si vous ne souhaitez pas gérer vous-même un cluster Kubernetes, vous pouvez utiliser un service managé, y compris des [plateformes certifiées](/docs/setup/production-environment/turnkey-solutions/). Il existe également d’autres solutions standardisées ou personnalisées disponibles dans différents environnements cloud et bare metal.

---

## Environnement d’apprentissage

Si vous apprenez Kubernetes, utilisez les outils supportés par la communauté Kubernetes ou l’écosystème pour configurer un cluster sur une machine locale.

Voir [Environnement d’apprentissage](/docs/setup/learning-environment/)

---

## Environnement de production

Lors de l’évaluation d’une solution pour un [environnement de production](/docs/setup/production-environment/), prenez en compte les aspects que vous souhaitez gérer vous-même et ceux que vous préférez déléguer à un fournisseur. 

Pour un cluster que vous gérez vous-même, l’outil officiellement recommandé pour déployer Kubernetes est [kubeadm](/docs/setup/production-environment/tools/kubeadm/).

---

## {{% heading "whatsnext" %}}

* [Télécharger Kubernetes](/releases/download/)
* Télécharger et [installer les outils](/docs/tasks/tools/) dont `kubectl`
* Choisir un [runtime de conteneur](/docs/setup/production-environment/container-runtimes/) pour votre cluster
* Découvrir les [bonnes pratiques](/docs/setup/best-practices/) pour la configuration d’un cluster

Kubernetes est conçu pour exécuter son {{< glossary_tooltip term_id="control-plane" text="plan de contrôle" >}} sur Linux. Au sein du cluster, vous pouvez exécuter des applications sur Linux ou d’autres systèmes d’exploitation, y compris Windows.

* Apprendre à [configurer des clusters avec des nœuds Windows](/docs/concepts/windows/) 
