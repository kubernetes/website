---
title: Gestionnaire du contrôleur de cloud
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.11" >}}

Les technologies d'infrastructure cloud vous permettent d'exécuter Kubernetes sur des clouds publics, privés et hybrides.
Kubernetes croit en une infrastructure automatisée pilotée par API sans couplage 
étroit entre les composants.

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="Le gestionnaire du contrôleur de cloud est">}}

Le gestionnaire du contrôleur de cloud est structuré à l'aide d'un mécanisme de plugin
qui permet aux différents fournisseurs de cloud d'intégrer leurs plateformes à Kubernetes.

<!-- body -->

## Conception

![Composants de Kubernetes](/images/docs/components-of-kubernetes.svg)

Le gestionnaire du contrôleur de cloud s'exécute dans le plan de contrôle en tant qu'ensemble répliqué de processus
(généralement, ce sont des conteneurs dans des Pods). Chaque gestionnaire du contrôleur de cloud implémente
plusieurs {{< glossary_tooltip text="contrôleurs" term_id="controller" >}} 
dans un seul processus.


{{< note >}}
Vous pouvez également exécuter le gestionnaire du contrôleur de cloud en tant que
{{< glossary_tooltip text="addon" term_id="addons" >}} Kubernetes plutôt que 
de le faire partie du plan de contrôle.
{{< /note >}}

## Fonctions du gestionnaire du contrôleur de cloud {#fonctions-du-ccm}

Les contrôleurs à l'intérieur du gestionnaire du contrôleur de cloud comprennent :

### Contrôleur de nœud

Le contrôleur de nœud est responsable de la mise à jour des objets {{< glossary_tooltip text="Nœud" term_id="node" >}}
lorsque de nouveaux serveurs sont créés dans votre infrastructure cloud. Le contrôleur de nœud obtient des informations sur les
hôtes en cours d'exécution dans votre tenancy avec le fournisseur de cloud. Le contrôleur de nœud effectue les fonctions suivantes :

1. Mettre à jour un objet Nœud avec l'identifiant unique du serveur obtenu à partir de l'API du fournisseur de cloud.
1. Annoter et étiqueter l'objet Nœud avec des informations spécifiques au cloud, telles que la région dans laquelle le nœud
  est déployé et les ressources (CPU, mémoire, etc.) dont il dispose.
1. Obtenir le nom d'hôte et les adresses réseau du nœud.
1. Vérifier la santé du nœud. Si un nœud devient non réactif, ce contrôleur vérifie
  auprès de l'API de votre fournisseur de cloud si le serveur a été désactivé / supprimé / terminé.
  Si le nœud a été supprimé du cloud, le contrôleur supprime l'objet Nœud
  de votre cluster Kubernetes.

Certaines implémentations de fournisseurs de cloud divisent cela en un contrôleur de nœud
et un contrôleur de cycle de vie de nœud distinct.

### Contrôleur de route

Le contrôleur de route est responsable de la configuration des routes dans le cloud
de manière appropriée afin que les conteneurs sur différents nœuds de votre cluster Kubernetes
puissent communiquer entre eux.

Selon le fournisseur de cloud, le contrôleur de route peut également allouer des blocs
d'adresses IP pour le réseau de Pod.

### Contrôleur de service

{{< glossary_tooltip text="Les services" term_id="service" >}} s'intègrent aux composants d'infrastructure cloud tels que les équilibreurs de charge gérés, les adresses IP, le filtrage des paquets réseau
et la vérification de l'état de la cible. Le contrôleur de service interagit avec les API de votre
fournisseur de cloud pour configurer les équilibreurs de charge et autres composants
d'infrastructure
lorsque vous déclarez une ressource Service qui les nécessite.

## Autorisation

Cette section détaille l'accès requis par le gestionnaire du contrôleur de cloud
sur divers objets API pour effectuer ses opérations.

### Contrôleur de nœud {#autorisation-contrôleur-de-nœud}

Le contrôleur de nœud ne fonctionne qu'avec les objets Nœud. Il nécessite un accès complet
pour lire et modifier les objets Nœud.

`v1/Node` :

- get
- list
- create
- update
- patch
- watch
- delete

### Contrôleur de route {#autorisation-contrôleur-de-route}

Le contrôleur de route écoute la création d'objets Nœud et configure
les routes de manière appropriée. Il nécessite un accès Get aux objets Nœud.

`v1/Node` :

- get

### Contrôleur de service {#autorisation-contrôleur-de-service}

Le contrôleur de service surveille les événements de création, de mise à jour et de suppression des objets Service, puis
configure les Endpoints pour ces Services de manière appropriée (pour les EndpointSlices, le
kube-controller-manager les gère à la demande).

Pour accéder aux Services, il nécessite un accès **list** et **watch**. Pour mettre à jour les Services, il nécessite
un accès **patch** et **update**.

Pour configurer les ressources Endpoints pour les Services, il nécessite un accès **create**, **list**,
**get**, **watch** et **update**.

`v1/Service` :

- list
- get
- watch
- patch
- update

### Autres {#autorisation-divers}

La mise en œuvre du cœur du gestionnaire du contrôleur de cloud nécessite un accès pour créer des objets Event
et pour assurer un fonctionnement sécurisé, il nécessite un accès pour créer des comptes de service.

`v1/Event` :

- create
- patch
- update

`v1/ServiceAccount` :

- create

Le ClusterRole {{< glossary_tooltip term_id="rbac" text="RBAC" >}} pour le gestionnaire du
contrôleur de cloud ressemble à ceci :

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - create
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
- apiGroups:
  - ""
  resources:
  - services
  verbs:
  - list
  - patch
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - serviceaccounts
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - persistentvolumes
  verbs:
  - get
  - list
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - endpoints
  verbs:
  - create
  - get
  - list
  - watch
  - update
```


## {{% heading "whatsnext" %}}

* [Administration du gestionnaire du contrôleur de cloud](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)
  contient des instructions sur l'exécution et la gestion du gestionnaire du contrôleur de cloud.

* Pour mettre à niveau un plan de contrôle haute disponibilité pour utiliser le gestionnaire du contrôleur de cloud, consultez
  [Migrer le plan de contrôle répliqué pour utiliser le gestionnaire du contrôleur de cloud](/docs/tasks/administer-cluster/controller-manager-leader-migration/).

* Vous voulez savoir comment implémenter votre propre gestionnaire du contrôleur de cloud ou étendre un projet existant ?

  - Le gestionnaire du contrôleur de cloud utilise des interfaces Go, en particulier, l'interface `CloudProvider` définie dans
   [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.21/cloud.go#L42-L69)
   de [kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider) pour permettre
   l'intégration de toutes les implémentations de cloud.
  - La mise en œuvre des contrôleurs partagés mis en évidence dans ce document (Nœud, Route et Service),
   ainsi que certaines structures de base avec l'interface cloudprovider partagée, font partie du cœur de Kubernetes.
   Les implémentations spécifiques aux fournisseurs de cloud se trouvent en dehors du cœur de Kubernetes et implémentent
   l'interface `CloudProvider`.
  - Pour plus d'informations sur le développement de plugins,
   consultez [Développement du gestionnaire du contrôleur de cloud](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).