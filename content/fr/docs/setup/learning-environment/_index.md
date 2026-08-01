---
title: Environnement d’apprentissage
content_type: concept
weight: 20
---

<!-- overview -->

Si vous débutez avec Kubernetes, vous avez besoin d’un environnement pour pratiquer. Cette page explique les différentes options pour configurer un environnement Kubernetes afin d’expérimenter et d’apprendre.

<!-- body -->

## Installation de kubectl

Avant de configurer un cluster, vous devez installer l’outil en ligne de commande `kubectl`. Cet outil vous permet de communiquer avec un cluster Kubernetes et d’exécuter des commandes.

Consultez [Installer et configurer kubectl](/docs/tasks/tools/#kubectl) pour les instructions d’installation.

---

## Configuration d’environnements Kubernetes locaux

Exécuter Kubernetes localement vous permet d’avoir un environnement sécurisé pour apprendre et expérimenter. Vous pouvez créer et supprimer des clusters sans coût ni impact sur des systèmes de production.

### kind

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) exécute des clusters Kubernetes en utilisant des conteneurs Docker comme nœuds. Il est léger et conçu pour tester Kubernetes lui-même, mais il est aussi très adapté à l’apprentissage.

Pour commencer avec kind, consultez le [guide de démarrage rapide kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

---

### minikube

[minikube](https://minikube.sigs.k8s.io/) exécute un cluster Kubernetes à nœud unique sur votre machine locale. Il prend en charge plusieurs runtimes de conteneurs et fonctionne sur Linux, macOS et Windows.

Pour commencer avec minikube, consultez le guide [Getting Started minikube](https://minikube.sigs.k8s.io/docs/start/).

---

### Autres solutions locales

{{% thirdparty-content single="true" %}}

Il existe plusieurs outils tiers permettant également d’exécuter Kubernetes localement. Kubernetes ne fournit pas de support pour ces outils, mais ils peuvent être utiles pour l’apprentissage :

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) peut exécuter un cluster Kubernetes local
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) peut exécuter un cluster Kubernetes local
- [Rancher Desktop](https://docs.rancherdesktop.io/) fournit Kubernetes sur votre poste de travail
- [MicroK8s](https://canonical.com/microk8s) exécute un cluster Kubernetes léger
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local) exécute un cluster OpenShift minimal local (OpenShift est compatible Kubernetes)

Consultez la documentation de chaque outil pour les instructions d’installation et de support.

---

## Utilisation de playgrounds en ligne

{{% thirdparty-content single="true" %}}

Les playgrounds Kubernetes en ligne vous permettent de tester Kubernetes sans rien installer sur votre ordinateur. Ces environnements s’exécutent dans votre navigateur :

- **[Killercoda](https://killercoda.com/kubernetes)** propose des scénarios interactifs Kubernetes et un environnement de test

Ces plateformes sont utiles pour des expériences rapides et pour suivre des tutoriels sans installation locale.

---

## Pratique avec des clusters proches de la production

Si vous souhaitez pratiquer la création d’un cluster plus proche de la production, vous pouvez utiliser **kubeadm**. La configuration d’un cluster avec kubeadm est une tâche avancée qui nécessite plusieurs machines (physiques ou virtuelles) et une configuration rigoureuse.

Pour en savoir plus sur les environnements de production, consultez [Environnement de production](/docs/setup/production-environment/).

{{< note >}}
La configuration d’un cluster proche de la production est beaucoup plus complexe que les environnements d’apprentissage décrits ci-dessus. Commencez d’abord avec kind, minikube ou un playground en ligne.
{{< /note >}}

---

## {{% heading "whatsnext" %}}

- Suivez le tutoriel [Hello Minikube](/docs/tutorials/hello-minikube/) pour déployer votre première application
- Apprenez les [composants de Kubernetes](/docs/concepts/overview/components/)
- Explorez les commandes [kubectl](/docs/reference/kubectl/)