---
title: Qu'est-ce-que Kubernetes ?
description: Description de Kubernetes
content_template: templates/concept
weight: 10
card:
  name: concepts
  weight: 10
---

{{% capture overview %}}
Cette page est une vue d'ensemble de Kubernetes.
{{% /capture %}}

{{% capture body %}}
Kubernetes est une plate-forme open-source extensible et portable pour la gestion de charges de travail (workloads) et des services conteneurisés.
Elle favorise à la fois l'écriture de configuration déclarative (declarative configuration) et l'automatisation.
C'est un large écosystème en rapide expansion.
Les services, le support et les outils Kubernetes sont largement disponibles.

Google a rendu open-source le projet Kubernetes en 2014.
Le développement de Kubernetes est basé sur une [décennie et demie d’expérience de Google avec la gestion de la charge et de la mise à l'échelle (scale) en production](https://research.google.com/pubs/pub43438.html), associé aux meilleures idées et pratiques de la communauté.

## Pourquoi ai-je besoin de Kubernetes et que peut-il faire ?

Kubernetes a un certain nombre de fonctionnalités. Il peut être considéré comme:

- une plate-forme de conteneur
- une plate-forme de microservices
- une plate-forme cloud portable
et beaucoup plus.

Kubernetes fournit un environnement de gestion **focalisé sur le conteneur** (container-centric).
Il orchestre les ressources machines (computing), la mise en réseau et l’infrastructure de stockage sur les workloads des utilisateurs.
Cela permet de se rapprocher de la simplicité des Platform as a Service (PaaS) avec la flexibilité des solutions d'Infrastructure as a Service (IaaS), tout en gardant de la portabilité entre les différents fournisseurs d'infrastructures (providers).

## Comment Kubernetes est-il une plate-forme ?

Même si Kubernetes fournit de nombreuses fonctionnalités, il existe toujours de nouveaux scénarios qui bénéficieraient de fonctionnalités complémentaires.
Ces workflows spécifiques à une application permettent d'accélérer la vitesse de développement.
Si l'orchestration fournie de base est acceptable pour commencer, il est souvent nécessaire d'avoir une automatisation robuste lorsque l'on doit la faire évoluer.
C'est pourquoi Kubernetes a également été conçu pour servir de plate-forme et favoriser la construction d’un écosystème de composants et d’outils facilitant le déploiement, la mise à l’échelle et la gestion des applications.

[Les Labels](/docs/concepts/overview/working-with-objects/labels/) permettent aux utilisateurs d'organiser leurs ressources comme ils/elles le souhaitent.
[Les Annotations](/docs/concepts/overview/working-with-objects/annotations/) autorisent les utilisateurs à définir des informations personnalisées sur les ressources pour faciliter leurs workflows et fournissent un moyen simple aux outils de gérer la vérification d'un état (checkpoint state).

De plus, le [plan de contrôle Kubernetes (control
plane)](/docs/concepts/overview/components/) est construit sur les mêmes [APIs](/docs/reference/using-api/api-overview/) que celles accessibles aux développeurs et utilisateurs.
Les utilisateurs peuvent écrire leurs propres controlleurs (controllers), tels que les [ordonnanceurs (schedulers)](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/devel/scheduler.md),
avec [leurs propres APIs](/docs/concepts/api-extension/custom-resources/) qui peuvent être utilisés par un [outil en ligne de commande](/docs/user-guide/kubectl-overview/).

Ce choix de [conception](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) a permis de construire un ensemble d'autres systèmes par dessus Kubernetes.

## Ce que Kubernetes n'est pas

Kubernetes n’est pas une solution PaaS (Platform as a Service).
Kubernetes opérant au niveau des conteneurs plutôt qu'au niveau du matériel, il fournit une partie des fonctionnalités des offres PaaS, telles que le déploiement, la mise à l'échelle, l'équilibrage de charge (load balancing), la journalisation (logging) et la surveillance (monitoring).
Cependant, Kubernetes n'est pas monolithique.
Ces implémentations par défaut sont optionnelles et interchangeables. Kubernetes fournit les bases permettant de construire des plates-formes orientées développeurs, en laissant la possibilité à l'utilisateur de faire ses propres choix.

Kubernetes:

- Ne limite pas les types d'applications supportées. Kubernetes prend en charge des workloads extrêmement divers, dont des applications stateless, stateful ou orientées traitement de données (data-processing).
Si l'application peut fonctionner dans un conteneur, elle devrait bien fonctionner sur Kubernetes.
- Ne déploie pas de code source et ne build pas d'application non plus. Les workflows d'Intégration Continue, de Livraison Continue et de Déploiement Continu (CI/CD) sont réalisés en fonction de la culture d'entreprise, des préférences ou des pré-requis techniques.
- Ne fournit pas nativement de services au niveau applicatif tels que des middlewares (e.g., message buses), des frameworks de traitement de données (par exemple, Spark), des bases de données (e.g., mysql), caches, ou systèmes de stockage clusterisés (e.g., Ceph).
Ces composants peuvent être lancés dans Kubernetes et/ou être accessibles à des applications tournant dans Kubernetes via des mécaniques d'intermédiation tel que Open Service Broker.
- N'impose pas de solutions de logging, monitoring, ou alerting.
Kubernetes fournit quelques intégrations primaires et des mécanismes de collecte et export de métriques.
- Ne fournit ou n'impose un langague/système de configuration (e.g., [jsonnet](https://github.com/google/jsonnet)).
Il fournit une API déclarative qui peut être ciblée par n'importe quelle forme de spécifications déclaratives.
- Ne fournit ou n'adopte aucune mécanique de configuration des machines, de maintenance, de gestion ou de contrôle de la santé des systèmes.

De plus, Kubernetes n'est pas vraiment un _système d'orchestration_. En réalité, il élimine le besoin d'orchestration.
Techniquement, l'_orchestration_ se définie par l'exécution d'un workflow défini : premièrement faire A, puis B, puis C.
Kubernetes quant à lui est composé d'un ensemble de processus de contrôle qui pilote l'état courant vers l'état désiré.
Peu importe comment on arrive du point A au point C.
Un contrôle centralisé n'est pas non plus requis.
Cela abouti à un système plus simple à utiliser et plus puissant, robuste, résiliant et extensible.

## Pourquoi les conteneurs ?

Vous cherchez des raisons d'utiliser des conteneurs ?

![Pourquoi les conteneurs ?](/images/docs/why_containers.svg)

L'_ancienne façon (old way)_ de déployer des applications consistait à installer les applications sur un hôte en utilisant les systèmes de gestions de paquets natifs.
Cela avait pour principale inconvénient de lier fortement les exécutables, la configuration, les librairies et le cycle de vie de chacun avec l'OS.
Il est bien entendu possible de construire une image de machine virtuelle (VM) immuable pour arriver à produire des publications (rollouts) ou retours arrières (rollbacks), mais les VMs sont lourdes et non-portables.

La _nouvelle façon (new way)_ consiste à déployer des conteneurs basés sur une virtualisation au niveau du système d'opération (operation-system-level) plutôt que de la virtualisation hardware.
Ces conteneurs sont isolés les uns des autres et de l'hôte :
ils ont leurs propres systèmes de fichiers, ne peuvent voir que leurs propres processus et leur usage des ressources peut être contraint.
Ils sont aussi plus facile à construire que des VMs, et vu qu'ils sont décorrélés de l'infrastructure sous-jacente et du système de fichiers de l'hôte, ils sont aussi portables entre les différents fournisseurs de Cloud et les OS.

Étant donné que les conteneurs sont petits et rapides, une application peut être packagées dans chaque image de conteneurs.
Cette relation application-image tout-en-un permet de bénéficier de tous les bénéfices des conteneurs. Avec les conteneurs, des images immuables de conteneur peuvent être créées au moment du build/release plutôt qu'au déploiement, vu que chaque application ne dépend pas du reste de la stack applicative et n'est pas liée à l'environnement de production.
La génération d'images de conteneurs au moment du build permet d'obtenir un environnement constant qui peut être déployé tant en développement qu'en production. De la même manière, les conteneurs sont bien plus transparents que les VMs, ce qui facilite le monitoring et le management.
Cela est particulièrement vrai lorsque le cycle de vie des conteneurs est géré par l'infrastructure plutôt que caché par un gestionnaire de processus à l'intérieur du conteneur. Avec une application par conteneur, gérer ces conteneurs équivaut à gérer le déploiement de son application.

Résumé des bénéfices des conteneurs :

- **Création et déploiement agile d'application** :
  Augmente la simplicité et l'efficacité de la création d'images par rapport à l'utilisation d'image de VM.
- **Développement, intégration et déploiement Continus**:
  Fournit un processus pour constuire et déployer fréquemment et de façon fiable avec la capacité de faire des rollbacks rapide et simple (grâce à l'immuabilité de l'image).
- **Séparation des besoins entre Dev et Ops**:
  Création d'images applicatives au moment du build plutôt qu'au déploiement, tout en séparant l'application de l'infrastructure.
- **Observabilité**
  Pas seulement des informations venant du système d'exploitation sous-jacent mais aussi des signaux propres de l'application.
- **Consistance entre les environnements de développement, tests et production**:
  Fonctionne de la même manière que ce soit sur un poste local que chez un fournisseur d'hébergement / dans le Cloud.
- **Portabilité entre Cloud et distribution système**:
  Fonctionne sur Ubuntu, RHEL, CoreOS, on-prem, Google Kubernetes Engine, et n'importe où.
- **Gestion centrée Application**:
  Bascule le niveau d'abstraction d'une virtualisation hardware liée à l'OS à une logique de ressources orientée application.
- **[Micro-services](https://martinfowler.com/articles/microservices.html) faiblement couplés, distribués, élastiques**:
  Les applications sont séparées en petits morceaux indépendants et peuvent être déployés et gérés dynamiquement -- pas une stack monolithique dans une seule machine à tout faire.
- **Isolation des ressources**:
  Performances de l'application prédictible.
- **Utilisation des ressources**:
  Haute efficacité et densité.

## Qu'est-ce-que Kubernetes signifie ? K8s ?

Le nom **Kubernetes** tire son origine du grec ancien, signifiant _capitaine_ ou _pilôte_ et est la racine de _gouverneur_ et [cybernetic](http://www.etymonline.com/index.php?term=cybernetics). _K8s_ est l'abréviation dérivée par le remplacement des 8 lettres "ubernete" par "8".

{{% /capture %}}

{{% capture whatsnext %}}
*   Prêt à [commencer](/docs/setup/) ?
*   Pour plus de détails, voir la [documentation Kubernetes](/docs/home/).
{{% /capture %}}
