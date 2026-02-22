---
title: Objets dans Kubernetes
content_type: concept
weight: 30
description: >
  Les objets Kubernetes sont des entités persistantes dans le système Kubernetes.
  Kubernetes utilise ces entités pour représenter l'état de votre cluster.
  Apprenez le modèle d'objet Kubernetes et comment travailler avec ces objets.
simple_list: true
card:
  name: concepts
  weight: 40
---

<!-- overview -->

Cette page explique comment les objets Kubernetes sont représentés dans l'API Kubernetes et comment vous pouvez
les exprimer au format `.yaml`.

<!-- body -->

## Comprendre les objets Kubernetes {#kubernetes-objects}

Les *objets Kubernetes* sont des entités persistantes dans le système Kubernetes. Kubernetes utilise ces
entités pour représenter l'état de votre cluster. Plus précisément, ils peuvent décrire :

* Les applications conteneurisées en cours d'exécution (et sur quels nœuds)
* Les ressources disponibles pour ces applications
* Les politiques régissant le comportement de ces applications, telles que les politiques de redémarrage, de mise à niveau et de tolérance aux pannes

Un objet Kubernetes est un "enregistrement d'intention" - une fois que vous avez créé l'objet, le système Kubernetes
travaillera constamment pour s'assurer que l'objet existe. En créant un objet, vous indiquez essentiellement
au système Kubernetes à quoi vous voulez que la charge de travail de votre cluster ressemble ; 
c'est *l'état souhaité* de votre cluster.

Pour travailler avec les objets Kubernetes - que ce soit pour les créer, les modifier ou les supprimer - vous devrez utiliser l'
[API Kubernetes](/fr/docs/concepts/overview/kubernetes-api/). Lorsque vous utilisez l'interface de ligne de commande `kubectl`, par exemple, 
l'interface CLI effectue les appels d'API Kubernetes nécessaires pour vous. 
Vous pouvez également utiliser l'API Kubernetes directement dans vos propres programmes en utilisant l'une des
[Librairies clientes](/docs/reference/using-api/client-libraries/).

### Spécification de l'objet et état

Presque tous les objets Kubernetes incluent deux champs d'objet imbriqués qui régissent
la configuration de l'objet : la *`spec`* de l'objet et le *`status`* de l'objet.
Pour les objets qui ont une `spec`, vous devez la définir lors de la création de l'objet,
en fournissant une description des caractéristiques que vous souhaitez que la ressource ait :
son _état souhaité_.

Le `status` décrit l'_état actuel_ de l'objet, fourni et mis à jour
par le système Kubernetes et ses composants. Le
{{< glossary_tooltip text="plan de contrôle" term_id="control-plane" >}} Kubernetes
gère continuellement et activement l'état réel de chaque objet pour le faire correspondre à l'état souhaité que vous
avez fourni.

Par exemple : dans Kubernetes, un Déploiement est un objet qui peut représenter une
application en cours d'exécution sur votre cluster. Lorsque vous créez le Déploiement, vous
pouvez définir la `spec` du Déploiement pour spécifier que vous souhaitez que trois répliques de
l'application soient en cours d'exécution. Le système Kubernetes lit la `spec` du Déploiement
et démarre trois instances de votre application souhaitée - mettant à jour
le statut pour correspondre à votre spécification. Si l'une de ces instances venait à échouer
(un changement d'état), le système Kubernetes réagit à la différence
entre la spécification et le statut en effectuant une correction - dans ce cas, en démarrant
une instance de remplacement.

Pour plus d'informations sur la spécification de l'objet, l'état et les métadonnées, consultez la
[Convention de l'API Kubernetes](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

### Description d'un objet Kubernetes

Lorsque vous créez un objet dans Kubernetes, vous devez fournir la spécification de l'objet qui décrit son
état souhaité, ainsi que des informations de base sur l'objet (comme un nom). Lorsque vous utilisez
l'API Kubernetes pour créer l'objet (directement ou via `kubectl`), cette requête API doit
inclure ces informations au format JSON dans le corps de la requête.
Le plus souvent, vous fournissez les informations à `kubectl` dans un fichier appelé _manifeste_.
Par convention, les manifestes sont en YAML (vous pouvez également utiliser le format JSON).
Des outils tels que `kubectl` convertissent les informations d'un manifeste en JSON ou dans un autre format de sérialisation
pris en charge lors de l'envoi de la requête API via HTTP.

Voici un exemple de manifeste montrant les champs requis et la spécification de l'objet pour un
Déploiement Kubernetes :

{{% code_sample file="application/deployment.yaml" %}}

Une façon de créer un Déploiement en utilisant un fichier manifeste comme celui ci-dessus est d'utiliser la
commande [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) dans l'interface 
de ligne de commande `kubectl`, en passant le fichier `.yaml` en argument. Voici un exemple :

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

La sortie est similaire à ceci :

```
deployment.apps/nginx-deployment created
```

### Champs requis

Dans le manifeste (fichier YAML ou JSON) de l'objet Kubernetes que vous souhaitez créer, vous devrez définir des valeurs pour
les champs suivants :

* `apiVersion` - La version de l'API Kubernetes que vous utilisez pour créer cet objet
* `kind` - Le type d'objet que vous souhaitez créer
* `metadata` - Des données qui aident à identifier de manière unique l'objet, y compris une chaîne `name`, un `UID` et éventuellement un `namespace` facultatif
* `spec` - L'état souhaité de l'objet

Le format précis de la `spec` de l'objet est différent pour chaque objet Kubernetes et contient
des champs imbriqués spécifiques à cet objet. La [Référence de l'API Kubernetes](/docs/reference/kubernetes-api/)
peut vous aider à trouver le format de spécification pour tous les objets que vous pouvez créer avec Kubernetes.

Par exemple, consultez le champ [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
pour la référence de l'API Pod.
Pour chaque Pod, le champ `.spec` spécifie le pod et son état souhaité (comme le nom de l'image du conteneur pour
chaque conteneur dans ce pod).
Un autre exemple de spécification d'objet est le
champ [`spec`](/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/#StatefulSetSpec)
pour l'API StatefulSet. Pour StatefulSet, le champ `.spec` spécifie le StatefulSet et
son état souhaité.
Dans le `.spec` d'un StatefulSet se trouve un [modèle](/docs/concepts/workloads/pods/#pod-templates)
pour les objets Pod. Ce modèle décrit les Pods que le contrôleur StatefulSet va créer afin de
satisfaire la spécification du StatefulSet.
Différents types d'objets peuvent également avoir différents `.status` ; encore une fois, les pages de référence de l'API
détailent la structure de ce champ `.status` et son contenu pour chaque type d'objet différent.

{{< note >}}
Consultez les [Meilleures pratiques de configuration](/docs/concepts/configuration/overview/) pour des
informations supplémentaires sur l'écriture de fichiers de configuration YAML.
{{< /note >}}

## Validation des champs côté serveur

À partir de Kubernetes v1.25, le serveur API offre une validation des champs côté serveur
[field validation](/docs/reference/using-api/api-concepts/#field-validation)
qui détecte les champs non reconnus ou en double dans un objet. Il offre toutes les fonctionnalités
de `kubectl --validate` côté serveur.

L'outil `kubectl` utilise le drapeau `--validate` pour définir le niveau de validation des champs. Il accepte les
valeurs `ignore`, `warn` et `strict`, tout en acceptant également les valeurs `true` (équivalent à `strict`)
et `false` (équivalent à `ignore`). Le paramètre de validation par défaut pour `kubectl` est `--validate=true`.

`Strict`
: Validation stricte des champs, erreurs en cas d'échec de la validation

`Warn`
: La validation des champs est effectuée, mais les erreurs sont exposées sous forme d'avertissements plutôt que de refuser la requête

`Ignore`
: Aucune validation des champs côté serveur n'est effectuée

Lorsque `kubectl` ne peut pas se connecter à un serveur API prenant en charge la validation des champs, il bascule
vers une validation côté client. Les versions de Kubernetes 1.27 et ultérieures offrent toujours une validation des champs ;
les versions antérieures de Kubernetes peuvent ne pas l'offrir. Si votre cluster est plus ancien que v1.27, consultez la documentation
de votre version de Kubernetes.

## {{% heading "whatsnext" %}}

Si vous débutez avec Kubernetes, lisez-en plus sur les sujets suivants :

* [Pods](/docs/concepts/workloads/pods/) qui sont les objets Kubernetes de base les plus importants.
* [Déploiement](/docs/concepts/workloads/controllers/deployment/) d'objets.
* [Contrôleurs](/docs/concepts/architecture/controller/) dans Kubernetes.
* [kubectl](/docs/reference/kubectl/) et [commandes kubectl](/docs/reference/generated/kubectl/kubectl-commands).

La gestion des objets Kubernetes
explique comment utiliser `kubectl` pour gérer les objets.
Vous devrez peut-être [installer kubectl](/docs/tasks/tools/#kubectl) si vous ne l'avez pas déjà disponible.

Pour en savoir plus sur l'API Kubernetes en général, visitez :

* [Vue d'ensemble de l'API Kubernetes](/docs/reference/using-api/)

Pour approfondir vos connaissances sur les objets dans Kubernetes, lisez d'autres pages de cette section :
<!-- Docsy automatically includes a list of pages in the section -->
