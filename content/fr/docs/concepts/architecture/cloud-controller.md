---
title: Concepts entourant le Cloud Controller Manager
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Le concept de gestionnaire de contrôleur de cloud (CCM) (à ne pas confondre avec l'éxécutable) a été créé à l'origine pour permettre au code spécifique au cloud de chaque plateforme et au noyau Kubernetes d'évoluer indépendamment les uns des autres. Le gestionnaire de contrôleur de cloud fonctionne avec d'autres composants principaux tels que le gestionnaire de contrôleur Kubernetes, le serveur API et l'ordonnanceur (scheduleur). Il peut également être démarré en tant qu'addon Kubernetes, auquel cas il s'exécute au-dessus de Kubernetes.

La conception du gestionnaire de contrôleur de cloud est basée sur un mécanisme de plugins qui permet aux nouveaux fournisseurs de cloud computing de s'intégrer facilement à Kubernetes en utilisant des plugins. Des plans sont en place pour l'intégration de nouveaux fournisseurs de cloud sur Kubernetes et pour la migration des fournisseurs de cloud de l'ancien modèle vers le nouveau modèle CCM.

Ce document traite des concepts sous-jacent au gestionnaire de contrôleur de cloud et donne des détails sur ses fonctions associées.

Voici l'architecture d'un cluster Kubernetes sans le gestionnaire de contrôleur cloud :

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)

{{% /capture %}}


{{% capture body %}}

## Design

Dans le diagramme précédent, Kubernetes et le fournisseur de cloud sont intégrés à travers plusieurs composants différents :

* Kubelet
* Kubernetes controller manager
* Kubernetes API server

Le CCM consolide la logique inhérente au cloud des trois composants précédents pour créer un point d'intégration unique avec le cloud. La nouvelle architecture du CCM ressemble à ceci :

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

## Components of the CCM

Le CCM casse certaines des fonctionnalités de Kubernetes controller manager (KCM) et les exécute comme un processus séparé. Plus précisément, il permet d'éliminer les contrôleurs du KCM qui sont inhérent au cloud. Le KCM possède les boucles de régulation inhérente au cloud suivantes :

 * Node controller
 * Volume controller
 * Route controller
 * Service controller

Dans la version 1.9, le CCM utilise les contrôleurs suivants de la liste précédente :

* Node controller
* Route controller
* Service controller

{{< note >}}
Le contrôleur de volume a été délibérément choisi de ne pas faire partie du CCM. En raison de la complexité de la tâche et des efforts actuels visant à éliminer la logique de volume propre au fournisseur, il a été décidé que le contrôleur de volume ne serait pas transféré au CCM.
{{< /note >}}

Le plan initial de prise en charge des volumes à l'aide du CCM consistait à utiliser les volumes Flex pour prendre en charge les volumes pluggable. Toutefois, un effort concurrent, connu sous le nom de CSI, est prévu pour remplacer Flex.

Compte tenu de cette dynamique, nous avons décidé d'attendre jusqu'à ce que CSI soit prêt.

## Functions of the CCM

Le CCM hérite ses fonctions des composants de Kubernetes qui dépendent d'un fournisseur de cloud. La présente section est structurée en fonction de ces éléments.

### 1. Kubernetes controller manager

La majorité des fonctions du CCM sont dérivés de celles du KCM. Comme mentionné dans la section précédente, le CCM lance les boucles de contrôle suivantes :

* Node controller
* Route controller
* Service controller

#### Node controller

Le contrôleur de nœud est responsable de l'initialisation d'un nœud en obtenant des informations sur les nœuds s'exécutant dans le cluster auprès du fournisseur de cloud. Le contrôleur de nœud exécute les fonctions suivantes :

1. Initialise un nœud avec les étiquettes de zone ou de région spécifiques au cloud.
2. Initialise un nœud avec les détails de l'instance, par exemple le type et la taille.
3. Obtient le les adresses réseau et le nom d'hôte du nœud.
4. Si un nœud ne répond plus, vérifiez dans le nuage si le nœud a été supprimé du cloud. Si le nœud a été supprimé du cloud, supprimez l'objet Node Kubernetes.

#### Route controller

Le contrôleur d'itinéraire est responsable de la configuration appropriée du routage  dans le cloud afin que les conteneurs sur les différents nœuds du cluster Kubernetes puissent communiquer entre eux. Le contrôleur d'itinéraire n'est applicable que pour les clusters Google Compute Engine.

#### Service Controller

//pas sur

Le contrôleur de service est responsable de l'écoute de la création, de la mise à jour et de la suppression des événements de service. Basé sur l'état actuel des services de Kubernetes, il configure les équilibreurs de charge cloud (loadbalancers) (tels que ELB, Google LB ou Oracle Cloud Infrastructure LB) pour refléter l'état des services de Kubernetes. De plus, il garantit que les backends de service pour les loadbalancer cloud soient à jour.

### 2. Kubelet

Le contrôleur Node contient la partie dépendante du cloud du kubelet. Avant l'introduction du CCM, le kubelet était responsable de l'initialisation d'un nœud avec des détails spécifiques au cloud tels que les adresses IP, les étiquettes de région/zone et les informations de type d'instance. L'introduction du CCM a fait passer cette opération d'initialisation du kubelet au CCM.

Dans ce nouveau modèle, le kubelet initialise un nœud sans information spécifique au cloud. Cependant, il ajoute une taint au nœud nouvellement créé qui le rend non planifiable jusqu'à ce que le CCM initialise le nœud avec des informations spécifiques au cloud. Il enlève ensuite cette taint.

## Plugin mechanism

Le CCM utilise les interfaces Go pour permettre le branchement d'implémentations à partir de n'importe quel cloud. Plus précisément, il utilise l'interface CloudProvider définie [ici](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62).

L'implémentation des quatre contrôleurs partagés soulignés ci-dessus, ainsi qu'une partie de l'échafaudage et de l'interface partagée avec le fournisseur de cloud, resteront dans le cœur de Kubernetes. Les implémentations spécifiques aux fournisseurs de cloud seront construites en dehors du cœur et implémenteront les interfaces définies dans le cœur.

Pour plus d'informations sur le développement de plugins, voir [Développement de Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).

## Authorization

Cette section décompose l'accès requis sur divers objets API par le CCM pour effectuer ses opérations.

### Node Controller

Le contrôleur de Node ne fonctionne qu'avec les objets de type Node. Il est nécéssaire d'avoir les pleins accès au ressource get, list, create, update, patch, watch ainsi que delete.

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### Route controller

Le contrôleur de routage écoute la création d'objets Node et configure les routes de manière appropriée. Il nécessite l'accès aux objets Node.

v1/Node:

- Get

### Service controller

//Relire attentivement

Le contrôleur de service écoute l'objet Service pour les événements suivants : création, mise à jour, suppression des événements, puis configure les de ces services de manière appropriée.

Pour accéder aux Services, il faut les permissions list, et watch. Pour mettre à jour les Services, il faut disposer des permissions patch et update.

Pour configurer les endpoints des Services, il faut disposer des permissions : create, list, get, watch et update.

v1/Service:

- List
- Get
- Watch
- Patch
- Update

### Others

La mise en œuvre du noyau du CCM nécessite l'accès pour créer des événements, et pour assurer la sécurité des opérations, il nécessite l'accès pour créer des ServiceAccounts.

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

Les RBAC ClusterRole pour le CCM ressemble à ceci:

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

## Vendor Implementations

Les fournisseurs de services cloud suivants ont mis en œuvre des CCM :

* [AWS](https://github.com/kubernetes/cloud-provider-aws)
* [Azure](https://github.com/kubernetes/cloud-provider-azure)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
* [Digital Ocean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [GCP](https://github.com/kubernetes/cloud-provider-gcp)
* [Linode](https://github.com/linode/linode-cloud-controller-manager)
* [OpenStack](https://github.com/kubernetes/cloud-provider-openstack)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)

## Cluster Administration

Des instructions complètes sur la configuration et l'utilisation du CCM sont fournies [ici](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).

{{% /capture %}}
