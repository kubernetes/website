---
title: "Services, équilibrage de charge et réseau"
weight: 60
description: >
  Concepts et ressources qui sous-tendent le réseau dans Kubernetes.
no_list: true
---

## Le modèle réseau de Kubernetes {#the-kubernetes-network-model}

Le modèle réseau de Kubernetes repose sur plusieurs éléments :

* Chaque [pod](/docs/concepts/workloads/pods/) d'un cluster reçoit sa propre
  adresse IP, unique dans tout le cluster.

  * Un pod a son propre namespace réseau privé, partagé par
    tous les conteneurs du pod. Les processus qui s'exécutent dans
    différents conteneurs d'un même pod peuvent communiquer entre eux
    via `localhost`.

* Le _réseau des pods_ (aussi appelé réseau du cluster) gère la communication
  entre les pods. Il garantit que (sauf segmentation réseau volontaire) :

  * Tous les pods peuvent communiquer avec tous les autres pods, qu'ils soient
    sur le même [nœud](/docs/concepts/architecture/nodes/) ou sur
    des nœuds différents. Les pods peuvent communiquer entre eux
    directement, sans proxy ni traduction d'adresses (NAT).

    Sous Windows, cette règle ne s'applique pas aux pods qui utilisent le réseau de l'hôte.

  * Les agents d'un nœud (comme les démons système ou le kubelet) peuvent
    communiquer avec tous les pods de ce nœud.

* L'API [Service](/docs/concepts/services-networking/service/)
  vous permet de fournir une adresse IP ou un nom d'hôte stable (durable) pour un service mis en œuvre
  par un ou plusieurs pods backend, alors que les pods qui composent
  ce service peuvent changer au fil du temps.

  * Kubernetes gère automatiquement des objets
    [EndpointSlice](/docs/concepts/services-networking/endpoint-slices/)
    qui donnent des informations sur les pods qui servent actuellement de backends à un Service.

  * Une implémentation de proxy de service surveille l'ensemble des objets Service et
    EndpointSlice, et programme le plan de données pour acheminer
    le trafic des services vers leurs backends, en utilisant les API du système d'exploitation ou
    du fournisseur cloud pour intercepter ou réécrire les paquets.

* L'API [Gateway](/docs/concepts/services-networking/gateway/)
  (ou son prédécesseur, [Ingress](/docs/concepts/services-networking/ingress/))
  vous permet de rendre des Services accessibles à des clients extérieurs au cluster.

  * Un mécanisme plus simple, mais moins configurable, pour faire entrer le trafic
    dans le cluster est proposé par le
    [`type: LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer) de l'API Service,
    si vous utilisez un {{< glossary_tooltip text="fournisseur de cloud" term_id="cloud-provider" >}} compatible.

* [NetworkPolicy](/docs/concepts/services-networking/network-policies) est une API
  intégrée à Kubernetes qui vous permet de contrôler le trafic entre les pods, ou entre les pods et
  le monde extérieur.

Dans les anciens systèmes de conteneurs, il n'existait pas de connectivité automatique
entre les conteneurs de différents hôtes. Il fallait donc souvent
créer explicitement des liens entre les conteneurs, ou faire correspondre les ports des conteneurs
à des ports de l'hôte pour que les conteneurs d'autres hôtes puissent les joindre.
Ce n'est pas nécessaire dans Kubernetes : dans son modèle,
les pods peuvent être traités presque comme des VM ou des hôtes physiques du point de vue
de l'allocation des ports, du nommage, de la découverte de services, de l'équilibrage
de charge, de la configuration des applications et de la migration.

Seules quelques parties de ce modèle sont mises en œuvre par Kubernetes lui-même.
Pour les autres, Kubernetes définit les API, mais la
fonctionnalité correspondante est fournie par des composants externes, dont certains
sont facultatifs :

* La mise en place du namespace réseau des pods est assurée par un logiciel système qui implémente
  la [Container Runtime Interface](/docs/concepts/containers/cri/).

* Le réseau des pods lui-même est géré par une
  [implémentation du réseau des pods](/docs/concepts/cluster-administration/addons/#networking-and-network-policy).
  Sous Linux, la plupart des environnements d'exécution de conteneurs utilisent la
  {{< glossary_tooltip text="Container Networking Interface (CNI)" term_id="cni" >}}
  pour dialoguer avec l'implémentation du réseau des pods. C'est pourquoi ces
  implémentations sont souvent appelées _plugins CNI_.

* Kubernetes fournit une implémentation par défaut du proxy de service,
  appelée {{< glossary_tooltip term_id="kube-proxy">}}, mais certaines implémentations
  du réseau des pods utilisent plutôt leur propre proxy de service,
  plus étroitement intégré au reste de leur implémentation.

* Les NetworkPolicies sont en général aussi mises en œuvre par l'implémentation du réseau
  des pods. (Certaines implémentations plus simples du réseau des pods ne
  prennent pas en charge les NetworkPolicies, ou un administrateur peut choisir de
  configurer le réseau des pods sans elles. Dans
  ces cas, l'API reste présente, mais elle n'a aucun effet.)

* Il existe de nombreuses [implémentations de Gateway API](https://gateway-api.sigs.k8s.io/implementations/),
  certaines propres à des environnements cloud particuliers, d'autres plutôt
  orientées vers les environnements « bare metal », et d'autres plus génériques.

## {{% heading "whatsnext" %}}

Le tutoriel [Connecter des applications avec des Services](/docs/tutorials/services/connect-applications-service/)
vous permet de découvrir les Services et le réseau de Kubernetes avec un exemple pratique.

[Réseau du cluster](/docs/concepts/cluster-administration/networking/) explique comment mettre
en place le réseau de votre cluster, et donne aussi une vue d'ensemble des technologies utilisées.

Pour découvrir des concepts réseau précis, consultez :

* [Service](/docs/concepts/services-networking/service/) : exposer une application derrière un point d'accès externe unique
* [Ingress](/docs/concepts/services-networking/ingress/) : routage HTTP/HTTPS sensible au protocole, à partir des URI, des noms d'hôte et des chemins
* [Gateway API](/docs/concepts/services-networking/gateway/) : provisionnement dynamique de l'infrastructure et routage avancé du trafic
* [Politiques réseau](/docs/concepts/services-networking/network-policies/) : contrôler les flux de trafic au niveau des adresses IP ou des ports (couches 3 ou 4 du modèle OSI)
* [DNS pour les Services et les Pods](/docs/concepts/services-networking/dns-pod-service/) : découvrir les services de votre cluster grâce au DNS
