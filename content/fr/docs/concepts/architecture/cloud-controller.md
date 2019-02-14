---
title: Concepts sous-jacents à Cloud Controller Manager
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Le concept de cloud controller manager (CCM, à ne pas confondre avec le binaire) a été créé à l'origine pour permettre au code de providers cloud et au noyau Kubernetes d'évoluer indépendamment les uns des autres. Le cloud controller manager fonctionne aux côtés d'autres composants principaux, tels que le Kubernetes controller manager, l'API server et le scheduler. Il peut également être démarré en tant qu’addon Kubernetes, auquel cas il s’applique au-dessus de Kubernetes.

La conception du cloud controller manager repose sur un mécanisme de plugin qui permet aux nouveaux providers cloud de s'intégrer facilement à Kubernetes à l'aide de plugins. Des mesures sont en place pour l'intégration de nouveaux providers cloud sur Kubernetes et pour la migration de l'ancien modèle vers le nouveau modèle CCM.

Ce document traite les concepts du cloud controller manager et donne des détails sur ses fonctions associées.

Voici l'architecture d'un cluster Kubernetes sans le cloud controller manager:

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)

{{% /capture %}}


{{% capture body %}}

## Design

Dans le diagramme précédent, Kubernetes et le provider cloud sont intégrés via plusieurs composants différents:

* Kubelet
* controller manager Kubernetes
* server API Kubernetes 

Le CCM consolide toute la logique dépendante du cloud des trois composants précédents pour créer un point d’intégration unique avec le cloud. La nouvelle architecture avec le CCM se présente comme il suit:

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

## Composants du CCM

Le CCM rompt avec certaines fonctionnalités du gestionnaire de contrôleurs Kubernetes (KCM) et les exécute en tant que processus séparé. Plus précisément, il sépare les contrôleurs du KCM qui dépendent du cloud. Celui-ci suis les boucles du contrôleur dépendantes du cloud :

 * Node controller
 * Volume controller
 * Route controller
 * Service controller

Dans la version 1.9, le CCM exécute les contrôleurs suivants de la liste précédente:

* Node controller
* Route controller
* Service controller

En outre, il exécute un autre contrôleur appelé PersistentVolumeLabels controller. Celui-ci est responsable de la définition des labels par zone et région sur volumes persistant créé dans les cloud ​​GCP et AWS.

{{< note >}}
Le Volume controller a été arbitrairement choisi pour ne pas faire partie de CCM. En raison de la complexité du processus et des efforts déployés pour supprimer la logique de volume spécifique au provider, il a été décidé que le Volume controller ne serait pas déplacé vers le CCM.
{{< /note >}}

Le plan initial de prise en charge des volumes à l'aide de CCM consistait à utiliser des volumes Flex pour prendre en charge des volumes pouvant être pluggable. Toutefois, un projet concurrent appelé CSI est en cours de planification pour remplacer Flex.

En tenant compte de cette dynamique, nous avons décidé de mettre en place une mesure de seuil intermédiaire jusqu’à ce que le CSI soit prêt.

## Fonctions du CCM

Le CCM hérite des fonctionnalitées des composants de Kubernetes qui dépendent eux même d'un provider cloud. Cette section est structurée en fonction de ces composants.

### 1. Gestionnaire de contrôleur Kubernetes

La majorité des fonctions du CCM sont dérivées du KCM. Comme indiqué dans la section précédente, le CCM exécute les boucles de contrôle suivantes :

* Node controller
* Route controller
* Service controller
* PersistentVolumeLabels controller

#### Node controller

Le Node controller est responsable de l'initialisation d'un node en obtenant des informations sur les nodes s'exécutant dans le cluster dans le cadre d'un provider cloud. Le node controller exécute les fonctions suivantes:

1. Initialisez un node avec des labels de zone/région spécifiques au cloud.
2. Initialisez un node avec des paramètres d'instance spécifiques au cloud, par exemple, le type et la taille.
3. Obtenez les adresses réseau et le nom d'hôte du node.
4. Si un node ne répond plus, vérifiez que l'instance n'a pas ete suprimée sur votre cloud provider.
Si le node a été supprimé du nuage, supprimez l'objet Kubernetes Node.

#### Route controller

Le Route controller est responsable de la configuration appropriée des routes réseau dans le cloud afin que les conteneurs situés sur différentes node du cluster Kubernetes puissent communiquer entre eux. Le Route controller ne s'applique qu'aux clusters Google Compute Engine.

#### Service Controller

Le Service controller est chargé d'écouter les événements de création, de mise à jour et de suppression de service. Sur la base de l'état actuel des services dans Kubernetes, il configure les équilibreurs de charge cloud (tels qu'un ELB ou Google LB) pour refléter l'état des services dans Kubernetes. De plus, cela garantit que les services de base des services pour les équilibreurs de charge dans le cloud sont à jour.

#### PersistentVolumeLabels controller

Le PersistentVolumeLabels controller applique les labels sur les volumes AWS EBS/GCE PD lors de leur création. Cela évite aux utilisateurs de définir manuellement les labels sur ces volumes.

Ces labels sont essentielles pour le scheduling des pods car ces volumes ne doivent fonctionner que dans la région/zone dans laquelle ils se trouvent. Tout pod utilisant ces volumes doit être schedulé dans la même région/zone.

Le PersistentVolumeLabels controller a été créé spécifiquement pour le CCM; c'est-à-dire qu'il n'existait pas avant la création du CCM. Cela a été fait pour déplacer la logique de labelisation des PV dans le serveur API Kubernetes (il s'agissait d'un admission controller) vers le CCM. Il ne fonctionne pas sur le KCM.

### 2. Kubelet

Le Node controller contient les fonctionnalités de Kubelet dépendantes du cloud. Avant l’introduction du CCM, la sous-unité était responsable de l’initialisation de nodes avec des paramètres spécifiques au cloud, tels que les adresses IP, les étiquettes de région/zone et les informations de type d’instance. L’introduction du CCM a déplacé cette opération d’initialisation de Kubelet au CCM.

Dans ce nouveau modèle, Kubelet initialise un node sans paramètres spécifiques au cloud. Cependant, il ajoute un tag taint au node nouvellement créé, ce qui le rend non modifiable jusqu'à ce que le CCM initialise le node avec les informations spécifiques au cloud. Il supprime ensuite ce tag taint.

### 3. Serveur API Kubernetes

Le PersistentVolumeLabels controller déplace la fonctionnalité dépendante du cloud, du serveur API Kubernetes vers le CCM, comme décrit dans les sections précédentes.

## Mécanisme de plugin

Le cloud controller manager utilise des interfaces Go pour permettre la mise en œuvre d'implémentations depuis n'importe quel cloud. Plus précisément, il utilise l'interface CloudProvider définie [ici](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62).

La mise en œuvre des quatre contrôleurs partagés présentés ci-dessus et l'interface partagée du provider cloud, resteront dans le noyau Kubernetes. Les implémentations spécifiques aux providers cloud seront construites en dehors du noyau et implémenteront les interfaces définies dans le noyau.

Pour plus d'informations sur le développement des plugins, voir [Développer un Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).

## Autorisation

Cette section détaille les accès requis par le CCM sur différents objets API pour effectuer ses opérations.

### Node Controller

Le Node controller fonctionne uniquement avec les objets Node. Un accès complet est nécessaire pour get, list, create, update, patch, watch, et delete des objets du node.

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### Route controller

Le route controller écoute la création d'objets Node et configure les routes de manière appropriée. Cela nécessite un accès aux objets Node.

v1/Node:

- Get

### Service controller

Le service controller écoute les creations, les mises à jour, et les suppressions d'objets de service, puis configure les noeuds ainsi que les services de manière appropriée.

Pour accéder aux services, il faut un droit list et watch. Pour mettre à jour les services, un droit d'accès patch et update est necessaire.

Pour configurer des points de terminaison des services, il faut des droits create, list, get, watch, et update.

v1/Service:

- List
- Get
- Watch
- Patch
- Update

### PersistentVolumeLabels controller

Le PersistentVolumeLabels controller écoute les événements de création de PersistentVolume (PV), puis les met à jour. Ce contrôleur nécessite un accès get et update pour mettre à jour les PVs.

v1/PersistentVolume:

- Get
- List
- Watch
- Update

### Autres

La mise en œuvre du noyau de CCM nécessite un accès pour créer des événements et pour garantir un fonctionnement sécurisé, un accès est nécessaire pour créer ServiceAccounts.

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

Le RBAC ClusterRole pour le CCM ressemble à ceci:

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

## Implémentations de providers

Les providers cloud suivants ont implémenté les CCM:

* [Digital Ocean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)
* [Azure](https://github.com/kubernetes/kubernetes/tree/master/pkg/cloudprovider/providers/azure)
* [GCE](https://github.com/kubernetes/kubernetes/tree/master/pkg/cloudprovider/providers/gce)
* [AWS](https://github.com/kubernetes/kubernetes/tree/master/pkg/cloudprovider/providers/aws)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)

## Administration du cluster

Des instructions complètes pour la configuration et l'exécution du CCM sont fournies [ici](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).

{{% /capture %}}
