---
title: Composants de Kubernetes
content_template: templates/concept
weight: 20
card: 
  name: concepts
  weight: 20
---

{{% capture overview %}}
Ce document résume les divers composants binaires requis pour livrer 
un cluster Kubernetes fonctionnel.
{{% /capture %}}

{{% capture body %}}
## Composants Master

Les composants Master fournissent le plan de contrôle (control plane) du cluster.
Les composants Master prennent des décisions globales à propos du cluster (par exemple, la planification (scheduling)). 
Ils détectent et répondent aux événements du cluster (par exemple, démarrer un nouveau {{< glossary_tooltip text="Pod" term_id="pod">}} lorsque le champ `replicas` d'un déploiement n'est pas satisfait).

Les composants Master peuvent être exécutés sur n'importe quelle machine du cluster. Toutefois,
par soucis de simplicité, les scripts de mise en route démarrent typiquement tous les composants master sur la 
même machine et n'exécutent pas de conteneurs utilisateur sur cette machine.
Voir [Construire des Clusters en Haute Disponibilité](/docs/admin/high-availability/) pour une configuration d'exemple en multi-master-VM.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Ces contrôleurs incluent :

  * Node Controller : Responsable de détecter et apporter une réponse lorsqu'un nœud tombe en panne.
  * Replication Controller : Responsable de maintenir le bon nombre de pods pour chaque objet
  ReplicationController dans le système.
  * Endpoints Controller : Remplit les objets Endpoints (c'est-à-dire joint les Services et Pods).
  * Service Account & Token Controllers : Créent des comptes par défaut et des jetons d'accès à l'API 
  pour les nouveaux namespaces.

### cloud-controller-manager

Le [cloud-controller-manager](/docs/tasks/administer-cluster/running-cloud-controller/) exécute les contrôleurs 
qui interagissent avec les fournisseurs cloud sous-jacents. Le binaire du cloud-controller-manager est une 
fonctionnalité alpha introduite dans la version 1.6 de Kubernetes.

Le cloud-controller-manager exécute seulement les boucles spécifiques des fournisseurs cloud. 
Vous devez désactiver ces boucles de contrôleurs dans le kube-controller-manager.
Vous pouvez désactiver les boucles de contrôleurs en définissant la valeur du flag `--cloud-provider` à `external` lors du démarrage du kube-controller-manager.

Le cloud-controller-manager permet au code du fournisseur cloud et au code de Kubernetes d'évoluer indépendamment l'un de l'autre.
Dans des versions antérieures, le code de base de Kubernetes dépendait du code spécifique du fournisseur cloud pour la fonctionnalité. Dans des versions ultérieures, le code spécifique des fournisseurs cloud devrait être maintenu par les fournisseurs cloud eux-mêmes et lié au cloud-controller-manager lors de l'exécution de Kubernetes.

Les contrôleurs suivants ont des dépendances vers des fournisseurs cloud :

  * Node Controller : Pour vérifier le fournisseur de cloud afin de déterminer si un nœud a été supprimé dans le cloud après avoir cessé de répondre
  * Route Controller : Pour mettre en place des routes dans l'infrastructure cloud sous-jacente
  * Service Controller : Pour créer, mettre à jour et supprimer les load balancers des fournisseurs cloud
  * Volume Controller : Pour créer, attacher et monter des Volumes, et interagir avec le fournisseur cloud pour orchestrer les volumes.

## Composants de nœud

Les composants de nœud (Node components) s'exécutent sur chaque nœud, en maintenant les pods en exécution
et en fournissant l'environnement d'exécution Kubernetes.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### Container Runtime

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Addons

Les addons utilisent les ressources Kubernetes ({{< glossary_tooltip term_id="daemonset" >}}, {{< glossary_tooltip term_id="deployment" >}}, etc)
pour implémenter des fonctionnalités cluster. Comme ces derniers fournissent des fonctionnalités au niveau 
du cluster, les ressources dans des namespaces pour les addons appartiennent au namespace `kube-system`.

Les addons sélectionnés sont décrits ci-dessous. Pour une liste étendue des addons disponibles, voir la page 
[Addons](/docs/concepts/cluster-administration/addons/).

### DNS

Tandis que les autres addons ne sont pas strictement requis, tous les clusters Kubernetes devraient avoir un 
[DNS cluster](/fr/docs/concepts/services-networking/dns-pod-service/) car de nombreux exemples en dépendent.

Le DNS Cluster est un serveur DNS, en plus des autres serveurs DNS dans votre environnement, qui sert 
les enregistrements DNS pour les services Kubernetes.

Les conteneurs démarrés par Kubernetes incluent automatiquement ce serveur DNS dans leurs recherches DNS.

### Interface utilisateur Web (Dashboard)

Le [Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) est une interface utilisateur web à but général pour les clusters Kubernetes. Il permet aux utilisateurs de gérer et de dépanner aussi bien des 
applications s'exécutant dans le cluster que le cluster lui-même.

### La surveillance des ressources de conteneur

[La surveillance des ressources de conteneur](/docs/tasks/debug-application-cluster/resource-usage-monitoring/) enregistre des métriques chronologiques génériques à propos des conteneurs dans une base de données centrale et 
fournit une interface utilisateur pour parcourir ces données.

### Le logging au niveau cluster

Un mécanisme de [logging au niveau cluster](/docs/concepts/cluster-administration/logging/) est chargé
de sauvegarder les logs des conteneurs dans un magasin de logs central avec une interface de recherche/navigation.

{{% /capture %}}
{{% capture whatsnext %}}
* En savoir plus sur les [Nœuds](/fr/docs/concepts/architecture/nodes/)
* En savoir plus sur [kube-scheduler](/docs/concepts/scheduling/kube-scheduler/)
* Lire la [documentation officielle d'etcd](https://etcd.io/docs/)
{{% /capture %}}
