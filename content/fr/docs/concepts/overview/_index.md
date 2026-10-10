---
title: Vue d'ensemble
description: >
  Kubernetes est une plateforme open source portable et extensible pour gérer les charges de travail et les services conteneurisés, qui facilite à la fois la configuration déclarative et l'automatisation. Il dispose d'un écosystème vaste et en pleine croissance. Les services, le support et les outils Kubernetes sont largement disponibles.
content_type: concept
weight: 20
card:
  name: concepts
  weight: 10
  anchors:
  - anchor: "#pourquoi-vous-avez-besoin-de-kubernetes-et-ce-quil-peut-faire"
    title: Pourquoi Kubernetes ?
no_list: true
---

<!-- overview -->
Cette page est une vue d'ensemble de Kubernetes.


<!-- body -->

Le nom Kubernetes provient du grec, signifiant timonier ou pilote. K8s comme abréviation résulte du comptage des huit lettres entre le "K" et le "s". Google a open-sourcé le projet Kubernetes en 2014. Kubernetes combine [plus de 15 ans d'expérience de Google](/blog/2015/04/borg-predecessor-to-kubernetes/) dans l'exécution de charges de travail en production à grande échelle avec les meilleures idées et pratiques de la communauté.

## Pourquoi vous avez besoin de Kubernetes et ce qu'il peut faire {#pourquoi-vous-avez-besoin-de-kubernetes-et-ce-quil-peut-faire}

Les conteneurs sont un bon moyen de regrouper et d'exécuter vos applications. Dans un environnement de production, vous devez gérer les conteneurs qui exécutent les applications et vous assurer qu'il n'y a pas de temps d'arrêt. Par exemple, si un conteneur tombe en panne, un autre conteneur doit démarrer. Ne serait-il pas plus facile si ce comportement était géré par un système ?

C'est là que Kubernetes vient à la rescousse ! Kubernetes vous fournit un cadre pour exécuter des systèmes distribués de manière résiliente. Il prend en charge la mise à l'échelle et le basculement pour votre application, fournit des modèles de déploiement, et plus encore. Par exemple : Kubernetes peut facilement gérer un déploiement canari pour votre système.

Kubernetes vous fournit :

* **Découverte de services et équilibrage de charge**
  Kubernetes peut exposer un conteneur en utilisant le nom DNS ou en utilisant leur propre adresse IP. Si le trafic vers un conteneur est élevé, Kubernetes est capable d'équilibrer la charge et de distribuer le trafic réseau afin que le déploiement soit stable.
* **Orchestration du stockage**
  Kubernetes vous permet de monter automatiquement un système de stockage de votre choix, tel que des stockages locaux, des fournisseurs de cloud public, et plus encore.
* **Déploiements et retours en arrière automatisés**
  Vous pouvez décrire l'état souhaité pour vos conteneurs déployés en utilisant Kubernetes, et il peut changer l'état actuel pour l'état souhaité à un rythme contrôlé. Par exemple, vous pouvez automatiser Kubernetes pour créer de nouveaux conteneurs pour votre déploiement, supprimer les conteneurs existants et adopter toutes leurs ressources pour le nouveau conteneur.
* **Emballage automatique des conteneurs**
  Vous fournissez à Kubernetes un cluster de nœuds qu'il peut utiliser pour exécuter des tâches conteneurisées. Vous dites à Kubernetes combien de CPU et de mémoire (RAM) chaque conteneur a besoin. Kubernetes peut ajuster les conteneurs sur vos nœuds pour faire le meilleur usage de vos ressources.
* **Auto-guérison**
  Kubernetes redémarre les conteneurs qui échouent, remplace les conteneurs, tue les conteneurs qui ne répondent pas à votre vérification de santé définie par l'utilisateur, et ne les annonce pas aux clients tant qu'ils ne sont pas prêts à servir.
* **Gestion des secrets et de la configuration**
  Kubernetes vous permet de stocker et de gérer des informations sensibles, telles que des mots de passe, des jetons OAuth et des clés SSH. Vous pouvez déployer et mettre à jour des secrets et la configuration de l'application sans reconstruire vos images de conteneur, et sans exposer les secrets dans votre configuration de pile.
* **Exécution par lots**
  En plus des services, Kubernetes peut gérer vos charges de travail par lots et CI, en remplaçant les conteneurs qui échouent, si désiré.
* **Mise à l'échelle horizontale**
  Mettez à l'échelle votre application vers le haut et vers le bas avec une simple commande, avec une interface utilisateur, ou automatiquement en fonction de l'utilisation du CPU.
* **Double pile IPv4/IPv6**
  Allocation d'adresses IPv4 et IPv6 aux Pods et Services
* **Conçu pour l'extensibilité**
  Ajoutez des fonctionnalités à votre cluster Kubernetes sans changer le code source en amont.

## Ce que Kubernetes n'est pas

Kubernetes n'est pas un système PaaS (Platform as a Service) traditionnel et tout compris. Étant donné que Kubernetes fonctionne au niveau des conteneurs plutôt qu'au niveau du matériel, il fournit certaines fonctionnalités généralement applicables communes aux offres PaaS, telles que le déploiement, la mise à l'échelle, l'équilibrage de charge, et permet aux utilisateurs d'intégrer leurs solutions de journalisation, de surveillance et d'alerte. Cependant, Kubernetes n'est pas monolithique, et ces solutions par défaut sont optionnelles et plugables. Kubernetes fournit les blocs de construction pour créer des plateformes de développement, mais préserve le choix et la flexibilité de l'utilisateur là où c'est important.

Kubernetes :

* Ne limite pas les types d'applications prises en charge. Kubernetes vise à prendre en charge une variété extrêmement diversifiée de charges de travail, y compris les charges de travail sans état, avec état et de traitement de données. Si une application peut fonctionner dans un conteneur, elle devrait bien fonctionner sur Kubernetes.
* Ne déploie pas de code source et ne construit pas votre application. Les workflows d'intégration continue, de livraison et de déploiement (CI/CD) sont déterminés par les cultures et les préférences des organisations ainsi que par les exigences techniques.
* Ne fournit pas de services au niveau de l'application, tels que des middleware (par exemple, des bus de messages), des frameworks de traitement de données (par exemple, Spark), des bases de données (par exemple, MySQL), des caches, ni des systèmes de stockage de cluster (par exemple, Ceph) en tant que services intégrés. De tels composants peuvent fonctionner sur Kubernetes, et/ou peuvent être accessibles par des applications fonctionnant sur Kubernetes via des mécanismes portables, tels que le [Open Service Broker](https://openservicebrokerapi.org/).
* Ne dicte pas de solutions de journalisation, de surveillance ou d'alerte. Il fournit certaines intégrations comme preuve de concept, et des mécanismes pour collecter et exporter des métriques.
* Ne fournit ni n'adopte de langage/système de configuration complet (par exemple, Jsonnet). Il fournit une API déclarative qui peut être ciblée par des formes arbitraires de spécifications déclaratives.
* Ne fournit ni n'adopte de systèmes complets de configuration, de maintenance, de gestion ou d'auto-guérison des machines.
* De plus, Kubernetes n'est pas un simple système d'orchestration. En fait, il élimine le besoin d'orchestration. La définition technique de l'orchestration est l'exécution d'un workflow défini : d'abord faire A, puis B, puis C. En revanche, Kubernetes comprend un ensemble de processus de contrôle indépendants et composables qui conduisent continuellement l'état actuel vers l'état souhaité fourni. Peu importe comment vous passez de A à C. Le contrôle centralisé n'est pas non plus requis. Cela se traduit par un système plus facile à utiliser et plus puissant, robuste, résilient et extensible.

## Contexte historique de Kubernetes {#retour-dans-le-temps}

Jetons un coup d'œil à pourquoi Kubernetes est si utile en remontant dans le temps.

![Évolution du déploiement](/images/docs/Container_Evolution.svg)

**Ère du déploiement traditionnel :**

Au début, les organisations exécutaient des applications sur des serveurs physiques. Il n'y avait aucun moyen de définir des limites de ressources pour les applications dans un serveur physique, et cela causait des problèmes d'allocation de ressources. Par exemple, si plusieurs applications s'exécutent sur un serveur physique, il peut y avoir des instances où une application prendrait la plupart des ressources, et par conséquent, les autres applications sous-performeraient. Une solution à cela serait d'exécuter chaque application sur un serveur physique différent. Mais cela ne se généralisait pas car les ressources étaient sous-utilisées, et il était coûteux pour les organisations de maintenir de nombreux serveurs physiques.

**Ère du déploiement virtualisé :**

En guise de solution, la virtualisation a été introduite. Elle permet d'exécuter plusieurs machines virtuelles (VM) sur le CPU d'un seul serveur physique. La virtualisation permet aux applications d'être isolées entre les VM et fournit un niveau de sécurité car les informations d'une application ne peuvent pas être librement accessibles par une autre application.

La virtualisation permet une meilleure utilisation des ressources dans un serveur physique et permet une meilleure évolutivité car une application peut être ajoutée ou mise à jour facilement, réduit les coûts matériels, et bien plus encore. Avec la virtualisation, vous pouvez présenter un ensemble de ressources physiques comme un cluster de machines virtuelles jetables.

Chaque VM est une machine complète exécutant tous les composants, y compris son propre système d'exploitation, sur le matériel virtualisé.

**Ère du déploiement de conteneurs :**

Les conteneurs sont similaires aux VM, mais ils ont des propriétés d'isolation assouplies pour partager le système d'exploitation (OS) entre les applications. Par conséquent, les conteneurs sont considérés comme légers. Similaire à une VM, un conteneur a son propre système de fichiers, part de CPU, mémoire, espace de processus, et plus encore. Comme ils sont découplés de l'infrastructure sous-jacente, ils sont portables à travers les clouds et les distributions OS.

Les conteneurs sont devenus populaires car ils offrent des avantages supplémentaires, tels que :

* Création et déploiement d'applications agiles : facilité et efficacité accrues de la création d'images de conteneurs par rapport à l'utilisation d'images VM.
* Développement, intégration et déploiement continus : permet une construction et un déploiement fiables et fréquents d'images de conteneurs avec des retours en arrière rapides et efficaces (en raison de l'immutabilité des images).
* Séparation des préoccupations Dev et Ops : créer des images de conteneurs d'application au moment de la construction/libération plutôt qu'au moment du déploiement, découplant ainsi les applications de l'infrastructure.
* Observabilité : non seulement surface les informations et métriques au niveau de l'OS, mais aussi la santé de l'application et d'autres signaux.
* Cohérence environnementale entre le développement, les tests et la production : fonctionne de la même manière sur un ordinateur portable que dans le cloud.
* Portabilité des clouds et des distributions OS : fonctionne sur Ubuntu, RHEL, CoreOS, sur site, sur les principaux clouds publics, et partout ailleurs.
* Gestion centrée sur les applications : élève le niveau d'abstraction de l'exécution d'un OS sur du matériel virtuel à l'exécution d'une application sur un OS utilisant des ressources logiques.
* Micro-services distribués, élastiques et libérés, faiblement couplés : les applications sont divisées en morceaux plus petits et indépendants et peuvent être déployées et gérées dynamiquement – pas une pile monolithique fonctionnant sur une grande machine à usage unique.
* Isolation des ressources : performance d'application prévisible.
* Utilisation des ressources : haute efficacité et densité.


## {{% heading "whatsnext" %}}

* Jetez un coup d'œil aux [Composants Kubernetes](/fr/docs/concepts/overview/components/)
* Jetez un coup d'œil à [L'API Kubernetes](/fr/docs/concepts/overview/kubernetes-api/)
* Jetez un coup d'œil à [L'Architecture du Cluster](/docs/concepts/architecture/)
* Prêt à [Commencer](/docs/setup/) ?
