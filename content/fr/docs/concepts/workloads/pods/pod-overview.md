---
title: Aperçu du Pod
description: Pod Concept Kubernetes
content_type: concept
weight: 10
card:
  name: concepts
  weight: 60
---

<!-- overview -->
Cette page fournit un aperçu du `Pod`, l'objet déployable le plus petit dans le modèle d'objets Kubernetes.


<!-- body -->

## Comprendre les Pods

Un *Pod* est l'unité d'exécution de base d'une application Kubernetes--l'unité la plus petite et la plus simple dans le modèle d'objets de Kubernetes--que vous créez ou déployez. Un Pod représente des process en cours d'exécution dans votre {{< glossary_tooltip term_id="cluster" text="cluster" >}}.

Un Pod encapsule un conteneur applicatif (ou, dans certains cas, plusieurs conteneurs), des ressources de stockage, une identité réseau (adresse IP) unique, ainsi que des options qui contrôlent comment le ou les conteneurs doivent s'exécuter. Un Pod représente une unité de déploiement : *une instance unique d'une application dans Kubernetes*, qui peut consister soit en un unique {{< glossary_tooltip text="container" term_id="container" >}} soit en un petit nombre de conteneurs qui sont étroitement liés et qui partagent des ressources.

> [Docker](https://www.docker.com) est le runtime de conteneurs le plus courant utilisé dans un Pod Kubernetes, mais les Pods prennent également en charge d'autres [runtimes de conteneurs](/docs/setup/production-environment/container-runtimes/).

Les Pods dans un cluster Kubernetes peuvent être utilisés de deux manières différentes :

* **les Pods exécutant un conteneur unique**. Le modèle "un-conteneur-par-Pod" est le cas d'utilisation Kubernetes le plus courant ; dans ce cas, vous pouvez voir un Pod comme un wrapper autour d'un conteneur unique, et Kubernetes gère les Pods plutôt que directement les conteneurs.
* **les Pods exécutant plusieurs conteneurs devant travailler ensemble**. Un Pod peut encapsuler une application composée de plusieurs conteneurs co-localisés qui sont étroitement liés et qui doivent partager des ressources. Ces conteneurs co-localisés pourraient former une unique unité de service cohésive--un conteneur servant des fichiers d'un volume partagé au public, alors qu'un conteneur "sidecar" séparé rafraîchit ou met à jour ces fichiers. Le Pod enveloppe ensemble ces conteneurs et ressources de stockage en une entité maniable de base.

Chaque Pod est destiné à exécuter une instance unique d'une application donnée. Si vous désirez mettre à l'échelle votre application horizontalement, (pour fournir plus de ressources au global en exécutant plus d'instances), vous devez utiliser plusieurs Pods, un pour chaque instance. Dans Kubernetes, on parle typiquement de _réplication_. Des Pods répliqués sont en général créés et gérés en tant que groupe par une ressource de charge de travail et son {{< glossary_tooltip text="_contrôleur_" term_id="controller" >}}. Voir [Pods et contrôleurs](#pods-et-controleurs) pour plus d'informations.

### Comment les Pods gèrent plusieurs conteneurs

Les Pods sont conçus pour supporter plusieurs process coopérants (sous forme de conteneurs) qui forment une unité de service cohésive. Les conteneurs d'un même Pod sont automatiquement co-localisés et co-programmés sur la même machine physique ou virtuelle dans le cluster. Ces conteneurs peuvent partager des ressources et dépendances, communiquer entre eux, et coordonner quand et comment ils sont arrêtés.

Notez que grouper plusieurs conteneurs co-localisés et co-gérés dans un unique Pod est un cas d'utilisation relativement avancé. Vous devez utiliser ce pattern seulement dans des instances spécifiques dans lesquelles vos conteneurs sont étroitement liés. Par exemple, vous pourriez avoir un conteneur qui agit comme un serveur web pour des fichiers contenus dans un volume partagé, et un conteneur "sidecar" séparé qui met à jour ces fichiers depuis une source externe, comme dans le diagramme suivant :

{{< figure src="/images/docs/pod.svg" alt="example pod diagram" width="50%" >}}

Certains Pods ont des {{< glossary_tooltip text="init containers" term_id="init-container" >}} en plus d'{{< glossary_tooltip text="app containers" term_id="app-container" >}}. Les Init containers s'exécutent et terminent avant que les conteneurs d'application soient démarrés.

Les Pods fournissent deux types de ressources partagées pour leurs conteneurs : *réseau* et *stockage*.

#### Réseau

Chaque Pod se voit assigner une adresse IP unique pour chaque famille d'adresses. Tous les conteneurs d'un Pod partagent le même namespace réseau, y compris l'adresse IP et les ports réseau. Les conteneurs *à l'intérieur d'un Pod* peuvent communiquer entre eux en utilisant `localhost`. Lorsque les conteneurs dans un Pod communiquent avec des entités *en dehors du Pod*, ils doivent coordonner comment ils utilisent les ressources réseau partagées (comme les ports).

#### Stockage

Un Pod peut spécifier un jeu de {{< glossary_tooltip text="volumes" term_id="volume" >}} de stockage partagés. Tous les conteneurs dans le Pod peuvent accéder aux volumes partagés, permettant à ces conteneurs de partager des données. Les volumes permettent aussi les données persistantes d'un Pod de survivre au cas où un des conteneurs doit être redémarré. Voir [Volumes](/docs/concepts/storage/volumes/) pour plus d'informations sur la façon dont Kubernetes implémente le stockage partagé dans un Pod.

## Travailler avec des Pods

Vous aurez rarement à créer directement des Pods individuels dans Kubernetes--même des Pods à un seul conteneur. Ceci est dû au fait que les Pods sont conçus comme des entités relativement éphémères et jetables. Lorsqu'un Pod est créé (directement par vous ou indirectement par un {{< glossary_tooltip text="_contrôleur_" term_id="controller" >}}), il est programmé pour s'exécuter sur un {{< glossary_tooltip term_id="node" >}} dans votre cluster. Le Pod reste sur ce nœud jusqu'à ce que le process se termine, l'objet pod soit supprimé, le pod soit *expulsé* par manque de ressources, ou le nœud soit en échec.

{{< note >}}
Redémarrer un conteneur dans un Pod ne doit pas être confondu avec redémarrer un Pod. Un Pod n'est pas un process, mais un environnement pour exécuter un conteneur. Un Pod persiste jusqu'à ce qu'il soit supprimé.
{{< /note >}}

Les Pods ne se guérissent pas par eux-mêmes. Si un Pod est programmé sur un Nœud qui échoue, ou si l'opération de programmation elle-même échoue, le Pod est supprimé ; de plus, un Pod ne survivra pas à une expulsion due à un manque de ressources ou une mise en maintenance du Nœud. Kubernetes utilise une abstraction de plus haut niveau, appelée un *contrôleur*, qui s'occupe de gérer les instances de Pods relativement jetables. Ainsi, même s'il est possible d'utiliser des Pods directement, il est beaucoup plus courant dans Kubernetes de gérer vos Pods en utilisant un contrôleur.

### Pods et contrôleurs

Vous pouvez utiliser des ressources de charges de travail pour créer et gérer plusieurs Pods pour vous. Un contrôleur pour la ressource gère la réplication,
le plan de déploiement et la guérison automatique en cas de problèmes du Pod. Par exemple, si un noeud est en échec, un contrôleur note que les Pods de ce noeud 
ont arrêté de fonctionner et créent des Pods pour les remplacer. L'ordonnanceur place le Pod de remplacement sur un noeud en fonctionnement.

Voici quelques exemples de ressources de charges de travail qui gèrent un ou plusieurs Pods :

* {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
* {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
* {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}

## Templates de Pod

Les Templates de Pod sont des spécifications pour créer des Pods, et sont inclus dans les ressources de charges de travail comme
les [Deployments](/fr/docs/concepts/workloads/controllers/deployment/), les [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/) et
les [DaemonSets](/docs/concepts/workloads/controllers/daemonset/).

Chaque contrôleur pour une ressource de charges de travail utilise le template de pod à l'intérieur de l'objet pour créer les Pods. Le template de pod fait partie de l'état désiré de la ressource de charges de travail que vous avez utilisé pour exécuter votre application.

L'exemple ci-dessous est un manifest pour un Job simple avec un `template` qui démarre un conteneur. Le conteneur dans ce Pod affiche un message puis se met en pause.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello
spec:
  template:
    # Ceci est un template de pod
    spec:
      containers:
      - name: hello
        image: busybox
        command: ['sh', '-c', 'echo "Hello, Kubernetes!" && sleep 3600']
      restartPolicy: OnFailure
    # Le template de pod se termine ici
```

Modifier le template de pod ou changer pour un nouvau template de pod n'a pas d'effet sur les pods déjà existants. Les Pods ne reçoivent pas une mise à jour
du template directement ; au lieu de cela, un nouveau Pod est créé pour correspondre au nouveau template de pod.

Par exemple, un contrôleur de Deployment s'assure que les Pods en cours d'exécution correspondent au template de pod en cours. Si le template est mis à jour,
le contrôleur doit supprimer les pods existants et créer de nouveaux Pods avec le nouveau template. Chaque contrôleur de charges de travail implémente ses propres
règles pour gérer les changements du template de Pod.

Sur les noeuds, le {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} n'observe ou ne gère pas directement les détails concernant les templates de pods et leurs mises à jours ; ces détails sont abstraits. Cette abstraction et cette séparation des préoccupations simplifie la sémantique du système, et rend possible l'extension du comportement du cluster sans changer le code existant.



## {{% heading "whatsnext" %}}

* En savoir plus sur les [Pods](/docs/concepts/workloads/pods/pod/)
* [The Distributed System Toolkit: Patterns for Composite Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns) explique les dispositions courantes pour des Pods avec plusieurs conteneurs
* En savoir plus sur le comportement des Pods :
  * [Terminaison d'un Pod](/docs/concepts/workloads/pods/pod/#termination-of-pods)
  * [Cycle de vie d'un Pod](/docs/concepts/workloads/pods/pod-lifecycle/)

