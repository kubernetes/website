---
title: Communication Master-Node
content_template: templates/concept
description: Communication Master-Node Kubernetes
weight: 20
---

{{% capture overview %}}

Ce document répertorie les canaux de communication entre l'API du noeud maître (apiserver of master node en anglais) et le reste du cluster Kubernetes.
L'objectif est de permettre aux utilisateurs de personnaliser leur installation afin de sécuriser la configuration réseau, de sorte que le cluster puisse être exécuté sur un réseau non approuvé (ou sur des adresses IP entièrement publiques d'un fournisseur de cloud).

{{% /capture %}}

{{% capture body %}}

## Communication du Cluster vers le Master

Tous les canaux de communication du cluster au master se terminent au apiserver (aucun des autres composants principaux n'est conçu pour exposer des services distants).
Dans un déploiement typique, l'apiserver est configuré pour écouter les connexions distantes sur un port HTTPS sécurisé (443) avec un ou plusieurs types d'[authentification](/docs/reference/access-authn-authz/authentication/) client.
Une ou plusieurs formes d'[autorisation](/docs/reference/access-authn-authz/authorization/) devraient être activée, notamment si les [requêtes anonymes](/docs/reference/access-authn-authz/authentication/#anonymous-requests) ou [jeton de compte de service](/docs/reference/access-authn-authz/authentication/#service-account-tokens) sont autorisés.

Le certificat racine public du cluster doit être configuré pour que les nœuds puissent se connecter en toute sécurité à l'apiserver avec des informations d'identification client valides.
Par exemple, dans un déploiement GKE par défaut, les informations d'identification client fournies au kubelet sont sous la forme d'un certificat client.
Consultez [amorçage TLS de kubelet](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/) pour le provisioning automatisé des certificats de client Kubelet.

Les pods qui souhaitent se connecter à l'apiserver peuvent le faire de manière sécurisée en utilisant un compte de service afin que Kubernetes injecte automatiquement le certificat racine public et un jeton de support valide dans le pod lorsqu'il est instancié.
Le service `kubernetes` (dans tous les namespaces) est configuré avec une adresse IP virtuelle redirigée (via kube-proxy) vers le point de terminaison HTTPS sur le apiserver.

Les composants du master communiquent également avec l'apiserver du cluster via le port sécurisé.

Par conséquent, le mode de fonctionnement par défaut pour les connexions du cluster (nœuds et pods s'exécutant sur les nœuds) au master est sécurisé par défaut et peut s'exécuter sur des réseaux non sécurisés et/ou publics.

## Communication du Master vers le Cluster

Il existe deux voies de communication principales du master (apiserver) au cluster.
La première est du processus apiserver au processus kubelet qui s'exécute sur chaque nœud du cluster.
La seconde part de l'apiserver vers n'importe quel nœud, pod ou service via la fonctionnalité proxy de l'apiserver.

### Communication de l'apiserver vers le kubelet

Les connexions de l'apiserver au kubelet sont utilisées pour:

  * Récupérer les logs des pods.
  * S'attacher (via kubectl) à des pods en cours d'exécution.
  * Fournir la fonctionnalité de transfert de port du kubelet.

Ces connexions se terminent au point de terminaison HTTPS du kubelet.
Par défaut, l'apiserver ne vérifie pas le certificat du kubelet, ce qui rend la connexion sujette aux attaques de type "man-in-the-middle", et **non sûre** sur des réseaux non approuvés et/ou publics.

Pour vérifier cette connexion, utilisez l'argument `--kubelet-certificate-authority` pour fournir à apiserver un ensemble de certificats racine à utiliser pour vérifier le certificat du kubelet.

Si ce n'est pas possible, utilisez [SSH tunneling](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) entre l'apiserver et le kubelet si nécessaire pour éviter la connexion sur un réseau non sécurisé ou public.

Finalement, l'[authentification et/ou autorisation du Kubelet](/docs/admin/kubelet-authentication-authorization/) devrait être activé pour sécuriser l'API kubelet.

### apiserver vers nodes, pods et services

Les connexions de l'apiserver à un nœud, à un pod ou à un service sont définies par défaut en connexions HTTP.
Elles ne sont donc ni authentifiées ni chiffrées.
Elles peuvent être exécutées sur une connexion HTTPS sécurisée en préfixant `https:` au nom du nœud, du pod ou du service dans l'URL de l'API.
Cependant ils ne valideront pas le certificat fourni par le point de terminaison HTTPS ni ne fourniront les informations d'identification du client.
De plus, aucune garantie d'intégrité n'est fournie.
Ces connexions **ne sont actuellement pas sûres** pour fonctionner sur des réseaux non sécurisés et/ou publics.

### SSH Tunnels

Kubernetes prend en charge les tunnels SSH pour protéger les communications master -> cluster.
Dans cette configuration, l'apiserver initie un tunnel SSH vers chaque nœud du cluster (en se connectant au serveur ssh sur le port 22) et transmet tout le trafic destiné à un kubelet, un nœud, un pod ou un service via un tunnel.
Ce tunnel garantit que le trafic n'est pas exposé en dehors du réseau dans lequel les nœuds sont en cours d'exécution.

Les tunnels SSH étant actuellement obsolètes, vous ne devriez pas choisir de les utiliser à moins de savoir ce que vous faites.
Un remplacement pour ce canal de communication est en cours de conception.

{{% /capture %}}
