---
title: Concepts
main_menu: true
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

La section Concepts vous aide à mieux comprendre les composants du système Kubernetes et les abstractions utilisées pour représenter votre cluster. Elle vous aide également à comprendre plus en profondeur comment fonctionne Kubernetes.

{{% /capture %}}

{{% capture body %}}

## Vue d'ensemble

Pour utiliser Kubernetes, vous utilisez *les objets de l'API Kubernetes* pour décrire l'état souhaité *de votre cluster*: quelles applications ou autres workload (charge de travail) que vous souhaitez exécuter, quelles images de conteneur elles utilisent, le nombre de réplicas, les ressources réseau et disque que vous souhaitez mettre à disposition, et plus encore. Vous définissez l'état souhaité en créant des objets à l'aide de l'API Kubernetes, généralement via l'interface de ligne de commande, `kubectl`. Vous pouvez également utiliser l'API Kubernetes directement pour interagir avec le cluster et définir ou modifier l'état souhaité.

Une fois que vous avez défini l'état souhaité, le *Kubernetes Control Plane* (plan de contrôle Kubernetes) permet de faire en sorte que l'état actuel du cluster corresponde à l'état souhaité. Pour ce faire, Kubernetes effectue automatiquement diverses tâches, telles que le démarrage ou le redémarrage de conteneurs, la mise à l'échelle du nombre de réplicas d'une application donnée, etc. Le Kubernetes Control Plane comprend un ensemble de processus en cours d'exécution sur votre cluster:

* Le **Master Kubernetes** est un ensemble de trois processus qui s'exécutent sur un seul nœud de votre cluster, désigné comme nœud master. Ces processus sont: [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) et [kube-scheduler](/docs/admin/kube-scheduler/)

* Chaque nœud qui n'est pas master de votre cluster exécute deux processus:
  * **[kubelet](/docs/admin/kubelet/)**, qui communique avec le maître Kubernetes.
  * **[kube-proxy](/docs/admin/kube-proxy/)**, un proxy réseau qui reflète les services réseau Kubernetes sur chaque nœud.

## Les objets Kubernetes 

Kubernetes contient un certain nombre d'abstractions représentant l'état de votre système: applications et charges de travail conteneurisées déployées, leurs ressources réseau et disque associées, ainsi que d'autres informations sur les activités de votre cluster. Ces abstractions sont représentées par des objets dans l'API Kubernetes; voir la [vue d'ensemble des objets Kubernetes](/docs/concepts/abstractions/overview/) pour plus de détails.

Les objets de base de Kubernetes incluent:

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/docs/concepts/overview/working-with-objects/namespaces/)

En outre, Kubernetes contient un certain nombre d'abstractions de niveau supérieur appelées Contrôleurs. Les contrôleurs s'appuient sur les objets de base et fournissent des fonctionnalités supplémentaires. Ils comprennent:

* [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
* [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

## Plan de contrôle de Kubernetes

Les différentes parties du Kubernetes Control Plane, telles que les processus Kubernetes Master et kubelet, déterminent la manière dont Kubernetes communique avec votre cluster. Le plan de contrôle conserve un enregistrement de tous les objets Kubernetes du système et exécute des boucles de contrôle continues pour gérer l'état de ces objets. À tout moment, les boucles de contrôle du plan de contrôle répondent aux modifications du cluster et permettent de faire en sorte que l'état actuel de tous les objets du système corresponde à l'état souhaité que vous avez poussé.

Par exemple, lorsque vous utilisez l'API Kubernetes pour créer un objet Deployment, vous fournissez un nouvel état souhaité au système. Le Kubernetes Control Plane enregistre la création de cet objet et exécute vos instructions en lançant les applications requises tout en les planifiant sur les nœuds de cluster de manière à ce que l'état actuel du cluster corresponde à l'état souhaité.

### Master Kubernetes


Le master Kubernetes est responsable du maintien de l'état souhaité pour votre cluster. Lorsque vous interagissez avec Kubernetes, par exemple en utilisant l'interface de ligne de commande `kubectl`, vous communiquez avec le master Kubernetes de votre cluster.

> Le "master" fait référence à un ensemble de processus gérant l’état du cluster. En règle générale, tous les processus sont exécutés sur un seul nœud du cluster. Ce nœud est également appelé master. Celui-ci peut également être répliqué pour la disponibilité et la redondance.

### Nodes Kubernetes

Les nœuds d'un cluster sont les machines (machines virtuelles, serveurs physiques, etc.) qui exécutent vos applications et vos flux de travail dans le cloud. Le master Kubernetes contrôle chaque noeud; vous interagirez rarement directement avec les nœuds.

#### Métadonnées d'objet


* [Annotations](/docs/concepts/overview/working-with-objects/annotations/)

{{% /capture %}}

{{% capture whatsnext %}}

Si vous souhaitez écrire une page de concept, voir
[Utilisation des Page Templates](/docs/home/contribute/page-templates/)
pour plus d'informations sur le type de page de concept et le modèle de concept.

{{% /capture %}}
