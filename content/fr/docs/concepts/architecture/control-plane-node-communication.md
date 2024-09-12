---
title: Communication entre les nœuds et le plan de contrôle
content_type: concept
weight: 20
aliases:
- communication-noeud-plan-controle
---

<!-- overview -->

Ce document répertorie les chemins de communication entre le {{< glossary_tooltip term_id="kube-apiserver" text="serveur API" >}}
et le {{< glossary_tooltip text="cluster" term_id="cluster" length="all" >}} Kubernetes.
L'objectif est de permettre aux utilisateurs de personnaliser leur installation pour renforcer la configuration réseau
afin que le cluster puisse fonctionner sur un réseau non fiable (ou sur des adresses IP publiques complètement)
fournies par un fournisseur de cloud.

<!-- body -->

## Nœud vers le plan de contrôle

Kubernetes utilise un modèle d'API de type "hub-et-spoke". Toutes les utilisations de l'API à partir des nœuds (ou des pods qu'ils exécutent)
se terminent au niveau du serveur API. Aucun des autres composants du plan de contrôle n'est conçu pour exposer
des services distants. Le serveur API est configuré pour écouter les connexions distantes sur un port HTTPS sécurisé
(généralement le port 443) avec une ou plusieurs formes d'authentification
[client](/docs/reference/access-authn-authz/authentication/) activées.
Une ou plusieurs formes d'[autorisation](/docs/reference/access-authn-authz/authorization/) devraient être
activées, en particulier si les [requêtes anonymes](/docs/reference/access-authn-authz/authentication/#anonymous-requests)
ou les [jetons de compte de service](/docs/reference/access-authn-authz/authentication/#service-account-tokens)
sont autorisés.

Les nœuds doivent être provisionnés avec le {{< glossary_tooltip text="certificat" term_id="certificate" >}} racine public pour le cluster afin qu'ils puissent
se connecter de manière sécurisée au serveur API avec des informations d'identification client valides. Une bonne approche consiste à ce que les
informations d'identification client fournies au kubelet soient sous la forme d'un certificat client. Consultez
[l'amorçage TLS du kubelet](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
pour la provision automatisée des certificats client du kubelet.

Les {{< glossary_tooltip text="pods" term_id="pod" >}} qui souhaitent se connecter au serveur API peuvent le faire de manière sécurisée en utilisant un compte de service de sorte
que Kubernetes injecte automatiquement le certificat racine public et un jeton d'accès valide
dans le pod lors de son instanciation.
Le service `kubernetes` (dans le namespace `default`) est configuré avec une adresse IP virtuelle qui est
redirigée (via `{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}`) vers le point de terminaison HTTPS du serveur API.

Les composants du plan de contrôle communiquent également avec le serveur API via le port sécurisé.

Par conséquent, le mode de fonctionnement par défaut des connexions des nœuds et des pods exécutés sur les
nœuds vers le plan de contrôle est sécurisé par défaut et peut fonctionner sur des 
réseaux non fiables et/ou publics.

## Plan de contrôle vers le nœud

Il existe deux chemins de communication principaux du plan de contrôle (le serveur API) vers les nœuds.
Le premier est du serveur API au processus {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} qui s'exécute sur chaque nœud du cluster.
Le deuxième est du serveur API vers n'importe quel nœud, pod ou service via la fonctionnalité de _proxy_ du serveur API.

### Serveur API vers kubelet

Les connexions du serveur API au kubelet sont utilisées pour :

* Récupérer les journaux des pods.
* Se connecter (généralement via `kubectl`) aux pods en cours d'exécution.
* Fournir la fonctionnalité de transfert de port du kubelet.

Ces connexions se terminent au niveau du point de terminaison HTTPS du kubelet. Par défaut, le serveur API ne vérifie pas
le certificat de service du kubelet, ce qui rend la connexion vulnérable aux 
attaques de l'homme du milieu et **non sécurisée** pour une utilisation 
sur des réseaux non fiables et/ou publics.

Pour vérifier cette connexion, utilisez le paramètre `--kubelet-certificate-authority` 
pour fournir au serveur API un ensemble de certificats racine à utiliser pour vérifier le certificat de service du kubelet.

Si cela n'est pas possible, utilisez le [tunnel SSH](#tunnels-ssh) entre le serveur API et le kubelet si
nécessaire pour éviter de se connecter via un
réseau non fiable ou public.


Enfin, l'[authentification et/ou l'autorisation du kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/)
devraient être activées pour sécuriser l'API du kubelet.

### Serveur API vers les nœuds, les pods et les services

Les connexions du serveur API vers un nœud, un pod ou un service sont par défaut des connexions HTTP non sécurisées
et ne sont donc ni authentifiées ni chiffrées. Elles peuvent être exécutées via une connexion HTTPS sécurisée
en préfixant `https:` au nom du nœud, du pod ou du service dans l'URL de l'API, mais elles ne vérifieront pas
le certificat fourni par le point de terminaison HTTPS ni ne fourniront des informations d'identification client. Ainsi,
bien que la connexion soit chiffrée, elle ne garantira aucune intégrité. Ces
connexions **ne sont actuellement pas sûres** pour une utilisation sur des réseaux non fiables ou publics.

### Tunnels SSH

Kubernetes prend en charge les [tunnels SSH](https://www.ssh.com/academy/ssh/tunneling) pour protéger les chemins de communication du plan de contrôle vers les nœuds. Dans cette
configuration, le serveur API initie un tunnel SSH vers chaque nœud du cluster (en se connectant à
le serveur SSH qui écoute sur le port 22) et fait passer tout le trafic destiné à un kubelet, un nœud, un pod ou
un service à travers le tunnel.
Ce tunnel garantit que le trafic n'est pas exposé en dehors du réseau dans lequel les nœuds sont
exécutés.

{{< note >}}
Les tunnels SSH sont actuellement obsolètes, vous ne devriez donc pas choisir de les utiliser à moins de savoir ce que vous
faites. Le service [Konnectivity](#service-konnectivity) est un remplacement pour ce
canal de communication.
{{< /note >}}

### Service Konnectivity

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

En remplacement des tunnels SSH, le service Konnectivity fournit un proxy de niveau TCP pour la
communication entre le plan de contrôle et le cluster. Le service Konnectivity se compose de deux parties : le
serveur Konnectivity dans le réseau du plan de contrôle et les agents Konnectivity dans le réseau des nœuds.
Les agents Konnectivity initient des connexions vers le serveur Konnectivity et maintiennent
les connexions réseau.
Après avoir activé le service Konnectivity, tout le trafic du plan de contrôle vers les nœuds passe
par ces connexions.

Suivez la [tâche du service Konnectivity](/docs/tasks/extend-kubernetes/setup-konnectivity/) pour configurer
le service Konnectivity dans votre cluster.

## {{% heading "whatsnext" %}}

* En savoir plus sur les [composants du plan de contrôle Kubernetes](/docs/concepts/architecture/#control-plane-components)
* En savoir plus sur le [modèle Hub et Spoke](https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html#hubs-spokes-and-other-wheel-metaphors)
* Apprenez comment [sécuriser un cluster](/docs/tasks/administer-cluster/securing-a-cluster/) 
* En savoir plus sur l'[API Kubernetes](/fr/docs/concepts/overview/kubernetes-api/)
* [Configurer le service Konnectivity](/docs/tasks/extend-kubernetes/setup-konnectivity/)
* [Utiliser le transfert de port pour accéder aux applications dans un cluster](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Apprenez comment [récupérer les journaux des pods](/docs/tasks/debug/debug-application/debug-running-pod/#examine-pod-logs), [utiliser kubectl port-forward](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)