---
title: Environnement d’apprentissage
content_type: concept
weight: 20
---

<!-- overview -->

Si vous apprenez Kubernetes, vous avez besoin d’un environnement pour pratiquer. Cette page explique les différentes options pour configurer un environnement Kubernetes dans lequel vous pouvez expérimenter et apprendre.

<!-- body -->

## Installation de kubectl

Avant de configurer un cluster, vous devez disposer de l’outil en ligne de commande `kubectl`. Cet outil vous permet de communiquer avec un cluster Kubernetes et d’exécuter des commandes sur celui-ci.

Consultez [Installer et configurer kubectl](/docs/tasks/tools/#kubectl) pour les instructions d’installation.

## Configuration d’environnements Kubernetes locaux

Exécuter Kubernetes localement vous offre un environnement sûr pour apprendre et expérimenter. Vous pouvez créer et supprimer des clusters sans vous soucier des coûts ni affecter des systèmes de production.

### kind

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) exécute des clusters Kubernetes en utilisant des conteneurs Docker comme nœuds. Il est léger et conçu spécifiquement pour tester Kubernetes lui-même, mais fonctionne également très bien pour l’apprentissage.

Pour commencer avec kind, consultez le guide [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/).

### minikube

[minikube](https://minikube.sigs.k8s.io/) exécute un cluster Kubernetes à nœud unique sur votre machine locale. Il prend en charge plusieurs runtimes de conteneurs et fonctionne sur Linux, macOS et Windows.

Pour commencer avec minikube, consultez le guide [minikube Get Started](https://minikube.sigs.k8s.io/docs/start/).

### Autres options locales

{{% thirdparty-content single="true" %}}

Il existe plusieurs outils tiers capables d’exécuter Kubernetes localement. Kubernetes ne fournit pas de support pour ces outils, mais ils peuvent convenir à vos besoins d’apprentissage :

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) peut exécuter un cluster Kubernetes local
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) peut exécuter un cluster Kubernetes local
- [Rancher Desktop](https://docs.rancherdesktop.io/) fournit Kubernetes sur votre poste de travail
- [MicroK8s](https://canonical.com/microk8s) exécute un cluster Kubernetes léger
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local) exécute localement un cluster OpenShift minimal (OpenShift est conforme à Kubernetes)

Consultez la documentation de chaque outil pour les instructions d’installation et le support.

## Utiliser des environnements de test en ligne

{{% thirdparty-content single="true" %}}

Les environnements de test Kubernetes en ligne vous permettent d’essayer Kubernetes sans rien installer sur votre ordinateur. Ces environnements s’exécutent dans votre navigateur web :

- **[Killercoda](https://killercoda.com/kubernetes)** fournit des scénarios Kubernetes interactifs ainsi qu’un environnement de test

Ces plateformes sont utiles pour des expérimentations rapides et pour suivre des tutoriels sans configuration locale.

## Pratiquer avec des clusters proches de la production

Si vous souhaitez pratiquer la configuration d’un cluster plus proche d’un environnement de production, vous pouvez utiliser **kubeadm**. Configurer un cluster avec kubeadm est une tâche avancée qui nécessite plusieurs machines (physiques ou virtuelles) ainsi qu’une configuration minutieuse.

Pour en savoir plus sur les environnements de production, consultez [Environnement de production](/docs/setup/production-environment/).

{{< note >}}
La configuration d’un cluster proche de la production est nettement plus complexe que les environnements d’apprentissage décrits ci-dessus. Commencez d’abord avec kind, minikube ou un environnement de test en ligne.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Suivez le tutoriel [Hello Minikube](/docs/tutorials/hello-minikube/) pour déployer votre première application
- Découvrez les [composants Kubernetes](/docs/concepts/overview/components/)
- Explorez les [commandes kubectl](/docs/reference/kubectl/)
