---
title: Vue d'ensemble de l'administration d'un cluster
content_template: templates/concept
description: Administration cluster Kubernetes
weight: 10
---

{{% capture overview %}}
La vue d'ensemble de l'administration d'un cluster est destinée à toute personne créant ou administrant un cluster Kubernetes.
Il suppose une certaine familiarité avec les [concepts](/docs/concepts/) de Kubernetes.
{{% /capture %}}

{{% capture body %}}
## Planifier le déploiement d'un cluster

Voir le guide: [choisir la bonne solution](/fr/docs/setup/pick-right-solution/) pour des exemples de planification, de mise en place et de configuration de clusters Kubernetes. Les solutions répertoriées dans cet article s'appellent des *distributions*.

Avant de choisir un guide, voici quelques considérations:

 - Voulez-vous simplement essayer Kubernetes sur votre machine ou voulez-vous créer un cluster haute disponibilité à plusieurs nœuds? Choisissez les distributions les mieux adaptées à vos besoins.
 - **Si vous recherchez la haute disponibilité**, apprenez à configurer des [clusters multi zones](/docs/concepts/cluster-administration/federation/).
 - Utiliserez-vous **un cluster Kubernetes hébergé**, comme [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/), ou **hébergerez-vous votre propre cluster**?
 - Votre cluster sera-t-il **on-premises**, ou **sur un cloud (IaaS)**? Kubernetes ne prend pas directement en charge les clusters hybrides. Cependant, vous pouvez configurer plusieurs clusters.
 - **Si vous configurez Kubernetes on-premises**, choisissez le [modèle réseau](/docs/concepts/cluster-administration/networking/) qui vous convient le mieux.
 - Voulez-vous faire tourner Kubernetes sur du **bare metal** ou sur des **machines virtuelles (VMs)**?
 - Voulez-vous **simplement faire tourner un cluster**, ou vous attendez-vous à faire du **développement actif sur le code du projet Kubernetes**? Dans ce dernier cas, choisissez une distribution activement développée. Certaines distributions n’utilisent que des versions binaires, mais offrent une plus grande variété de choix.
 - Familiarisez-vous avec les [composants](/docs/admin/cluster-components/) nécessaires pour faire tourner un cluster.

A noter: Toutes les distributions ne sont pas activement maintenues. Choisissez des distributions qui ont été testées avec une version récente de Kubernetes.

## Gérer un cluster

* [Gérer un cluster](/docs/tasks/administer-cluster/cluster-management/) décrit plusieurs rubriques relatives au cycle de vie d’un cluster: création d’un nouveau cluster, mise à niveau des nœuds maître et des workers de votre cluster, maintenance des nœuds (mises à niveau du noyau, par exemple) et mise à niveau de la version de l’API Kubernetes d’un cluster en cours d’exécution.

* Apprenez comment [gérer les nœuds](/docs/concepts/nodes/node/).

* Apprenez à configurer et gérer les [quotas de ressources](/docs/concepts/policy/resource-quotas/) pour les clusters partagés.

## Sécuriser un cluster

* La rubrique [Certificats](/docs/concepts/cluster-administration/certificates/) décrit les étapes à suivre pour générer des certificats à l’aide de différentes suites d'outils.

* L' [Environnement de conteneur dans Kubernetes](/docs/concepts/containers/container-environment-variables/) décrit l'environnement des conteneurs gérés par la Kubelet sur un nœud Kubernetes.

* Le [Contrôle de l'accès à l'API Kubernetes](/docs/reference/access-authn-authz/controlling-access/) explique comment configurer les autorisations pour les utilisateurs et les comptes de service.

* La rubrique [Authentification](/docs/reference/access-authn-authz/authentication/) explique l'authentification dans Kubernetes, y compris les différentes options d'authentification.

* [Autorisations](/docs/reference/access-authn-authz/authorization/) est distinct de l'authentification et contrôle le traitement des appels HTTP.

* [Utiliser les Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/) explique les plug-ins qui interceptent les requêtes adressées au serveur d'API Kubernetes après authentification et autorisation.

* [Utiliser Sysctls dans un cluster Kubernetes](/docs/concepts/cluster-administration/sysctl-cluster/) explique aux administrateurs comment utiliser l'outil de ligne de commande `sysctl` pour définir les paramètres du noyau.

* [Auditer](/docs/tasks/debug-application-cluster/audit/) explique comment interagir avec les journaux d'audit de Kubernetes.

### Sécuriser la Kubelet
  * [Communication Master-Node](/docs/concepts/architecture/master-node-communication/)
  * [TLS bootstrapping](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
  * [Kubelet authentification/autorisations](/docs/admin/kubelet-authentication-authorization/)

## Services de cluster optionnels

* [Integration DNS](/docs/concepts/services-networking/dns-pod-service/) décrit comment résoudre un nom DNS directement vers un service Kubernetes.

* [Journalisation et surveillance de l'activité du cluster](/docs/concepts/cluster-administration/logging/) explique le fonctionnement de la connexion à Kubernetes et son implémentation.
{{% /capture %}}
