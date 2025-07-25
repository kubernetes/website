---
title: "Architecture du cluster"
weight: 30
description: >
  Les concepts architecturaux derrière Kubernetes.
---

Un cluster Kubernetes est composé d'un plan de contrôle et d'un ensemble de machines de travail, appelées nœuds, qui exécutent des applications conteneurisées. 
Chaque cluster a besoin d'au moins un nœud de travail pour exécuter des Pods.

Les nœuds de travail hébergent les Pods qui sont les composants de la charge de travail de l'application.
Le plan de contrôle gère les nœuds de travail et les Pods du cluster. Dans les environnements de production,
le plan de contrôle s'exécute généralement sur plusieurs ordinateurs et un cluster
exécute généralement plusieurs nœuds, offrant une tolérance aux pannes et une haute disponibilité.

Ce document décrit les différents composants nécessaires pour avoir un cluster Kubernetes complet et fonctionnel.

{{< figure src="/images/docs/kubernetes-cluster-architecture.svg" alt="Le plan de contrôle (kube-apiserver, etcd, kube-controller-manager, kube-scheduler) et plusieurs nœuds. Chaque nœud exécute un kubelet et kube-proxy."
title="Composants du cluster Kubernetes"
caption="**Remarque :** Ce diagramme présente une architecture de référence d'exemple pour un cluster Kubernetes. La répartition réelle des composants peut varier en fonction des configurations et des exigences spécifiques du cluster." class="diagram-large" >}}

## Composants du plan de contrôle

Les composants du plan de contrôle prennent des décisions globales sur le cluster (par exemple, la planification),
ainsi que la détection et la réponse aux événements du cluster (par exemple, démarrer un nouveau
{{< glossary_tooltip text="pod" term_id="pod">}} lorsque le champ `{{< glossary_tooltip text="replicas" term_id="replica" >}}` d'un déploiement
n'est pas satisfait).

Les composants du plan de contrôle peuvent s'exécuter sur n'importe quelle machine du cluster. Cependant, pour simplifier, les scripts d'installation
démarrent généralement tous les composants du plan de contrôle sur la même machine et n'exécutent pas de conteneurs utilisateur sur cette machine.
Consultez [Création de clusters hautement disponibles avec kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
pour un exemple de configuration du plan de contrôle s'exécutant sur plusieurs machines.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Il existe de nombreux types de contrôleurs différents. Voici quelques exemples :

- Contrôleur de nœuds : Responsable de la détection et de la réponse lorsque les nœuds tombent en panne.
- Contrôleur de tâches : Surveille les objets Job qui représentent des tâches ponctuelles, puis crée des Pods pour exécuter ces tâches jusqu'à leur achèvement.
- Contrôleur EndpointSlice : Remplit les objets EndpointSlice (pour établir un lien entre les Services et les Pods).
- Contrôleur ServiceAccount : Crée des comptes de service par défaut pour les nouveaux espaces de noms.

Ce qui précède n'est pas une liste exhaustive.

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

Le cloud-controller-manager exécute uniquement des contrôleurs spécifiques à votre fournisseur de cloud.
Si vous exécutez Kubernetes sur vos propres serveurs ou dans un environnement d'apprentissage sur votre
propre PC, le cluster n'a pas de cloud-controller-manager.

Comme pour kube-controller-manager, cloud-controller-manager combine plusieurs boucles de contrôle logiquement
indépendantes en un seul binaire que vous exécutez en tant que processus unique. Vous pouvez mettre à l'échelle
horizontalement (exécuter plusieurs copies) pour améliorer les performances ou pour aider à tolérer les pannes.

Les contrôleurs suivants peuvent avoir des dépendances vis-à-vis du fournisseur de cloud :

- Contrôleur de nœuds : Pour vérifier auprès du fournisseur de cloud si un nœud a été
  supprimé dans le cloud après avoir cessé de répondre
- Contrôleur de routage : Pour configurer les routes dans l'infrastructure cloud sous-jacente
- Contrôleur de service : Pour créer, mettre à jour et supprimer des équilibreurs de charge du fournisseur de cloud

## Composants du nœud

Les composants du nœud s'exécutent sur chaque nœud, maintenant les Pods en cours d'exécution et fournissant l'environnement d'exécution Kubernetes.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy (optionnel) {#kube-proxy}

{{< glossary_definition term_id="kube-proxy" length="all" >}}
Si vous utilisez un [plugin réseau](#network-plugins) qui implémente le transfert de paquets pour les Services
par lui-même, et fournissant un comportement équivalent à kube-proxy, alors vous n'avez pas besoin d'exécuter
kube-proxy sur les nœuds de votre cluster.

### Runtime de conteneur

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Add-ons

Les add-ons utilisent des ressources Kubernetes ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, etc.) pour implémenter des fonctionnalités de cluster.
Étant donné qu'ils fournissent des fonctionnalités au niveau du cluster, les ressources des add-ons
appartiennent au namespace `kube-system`.

Certains add-ons sélectionnés sont décrits ci-dessous ; pour une liste étendue d'add-ons disponibles,
veuillez consulter [Add-ons](/docs/concepts/cluster-administration/addons/).

### DNS

Bien que les autres add-ons ne soient pas strictement nécessaires, tous les clusters Kubernetes devraient avoir
[DNS du cluster](/docs/concepts/services-networking/dns-pod-service/), car de nombreux exemples en dépendent.

Le DNS du cluster est un serveur DNS, en plus des autres serveur(s) DNS de votre environnement,
qui fournit des enregistrements DNS pour les services Kubernetes.

Les conteneurs démarrés par Kubernetes incluent automatiquement ce serveur DNS dans leurs recherches DNS.

### Interface utilisateur Web (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) est une interface utilisateur basée sur le web,
générale, pour les clusters Kubernetes. Il permet aux utilisateurs de gérer et de résoudre les problèmes des applications
en cours d'exécution dans le cluster, ainsi que du cluster lui-même.

### Surveillance des ressources des conteneurs

[Surveillance des ressources des conteneurs](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
enregistre des métriques génériques de séries chronologiques sur les conteneurs dans une base de données centrale et fournit une interface utilisateur pour parcourir ces données.

### Journalisation au niveau du cluster

Un mécanisme de [journalisation au niveau du cluster](/docs/concepts/cluster-administration/logging/) est responsable
de l'enregistrement des journaux des conteneurs dans un magasin de journaux central avec une interface de recherche/parcours.

### Plugins réseau

[Les plugins réseau](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins)
sont des composants logiciels qui implémentent la spécification de l'interface réseau de conteneur (CNI).
Ils sont responsables de l'allocation des adresses IP aux pods et de leur permettre de communiquer
entre eux au sein du cluster.

## Variations de l'architecture

Bien que les composants principaux de Kubernetes restent cohérents, la manière dont ils sont déployés et
gérés peut varier. Comprendre ces variations est crucial pour concevoir et maintenir
des clusters Kubernetes répondant à des besoins opérationnels spécifiques.

### Options de déploiement du plan de contrôle

Les composants du plan de contrôle peuvent être déployés de plusieurs manières :

Déploiement traditionnel
: Les composants du plan de contrôle s'exécutent directement sur des machines dédiées ou des machines virtuelles, souvent gérées en tant que services systemd.

Pods statiques
: Les composants du plan de contrôle sont déployés en tant que Pods statiques, gérés par le kubelet sur des nœuds spécifiques.
  Il s'agit d'une approche courante utilisée par des outils tels que kubeadm.

Auto-hébergé
: Le plan de contrôle s'exécute en tant que Pods au sein du cluster Kubernetes lui-même, gérés par des déploiements
  et des StatefulSets ou d'autres primitives Kubernetes.

Services Kubernetes gérés
: Les fournisseurs de cloud abstraient souvent le plan de contrôle, en gérant ses composants dans le cadre de leur offre de services.

### Considérations pour le placement de la charge de travail

Le placement des charges de travail, y compris les composants du plan de contrôle, peut varier en fonction de la taille du cluster,
des exigences de performance et des politiques opérationnelles :

- Dans les clusters plus petits ou de développement, les composants du plan de contrôle et les charges de travail des utilisateurs peuvent s'exécuter sur les mêmes nœuds.
- Les clusters de production plus importants dédient souvent des nœuds spécifiques aux composants du plan de contrôle,
  les séparant des charges de travail des utilisateurs.
- Certaines organisations exécutent des add-ons critiques ou des outils de surveillance sur les nœuds du plan de contrôle.

### Outils de gestion de cluster

Des outils tels que kubeadm, kops et Kubespray offrent différentes approches pour le déploiement et la gestion des clusters,
chacun avec sa propre méthode de disposition et de gestion des composants.

La flexibilité de l'architecture de Kubernetes permet aux organisations d'adapter leurs clusters à des besoins spécifiques,
en équilibrant des facteurs tels que la complexité opérationnelle, les performances et la charge de gestion.

### Personnalisation et extensibilité

L'architecture de Kubernetes permet une personnalisation significative :

- Des ordonnanceurs personnalisés peuvent être déployés pour travailler aux côtés de l'ordonnanceur Kubernetes par défaut ou pour le remplacer entièrement.
- Les serveurs API peuvent être étendus avec des CustomResourceDefinitions et une agrégation d'API.
- Les fournisseurs de cloud peuvent s'intégrer profondément à Kubernetes en utilisant le cloud-controller-manager.

La flexibilité de l'architecture de Kubernetes permet aux organisations d'adapter leurs clusters à des besoins spécifiques,
en équilibrant des facteurs tels que la complexité opérationnelle, les performances et la charge de gestion.

## {{% heading "whatsnext" %}}

En savoir plus sur les sujets suivants :

- [Nœuds](/fr/docs/concepts/architecture/nodes/) et
  [leur communication](/fr/docs/concepts/architecture/control-plane-node-communication/)
  avec le plan de contrôle.
- Les [contrôleurs](/fr/docs/concepts/architecture/controller/) Kubernetes.
- [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/), qui est l'ordonnanceur par défaut de Kubernetes.
- La [documentation officielle](https://etcd.io/docs/) d'Etcd.
- Plusieurs [runtimes de conteneurs](/docs/setup/production-environment/container-runtimes/) dans Kubernetes.
- Intégration avec les fournisseurs de cloud en utilisant [cloud-controller-manager](/docs/concepts/architecture/cloud-controller/).
- Commandes [kubectl](/docs/reference/generated/kubectl/kubectl-commands).
