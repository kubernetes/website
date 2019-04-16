---
title: Aperçu du Pod
description: Pod Concept Kubernetes
content_template: templates/concept
weight: 10
card: 
  name: concepts
  weight: 60
---

{{% capture overview %}}
Cette page fournit un aperçu du `Pod`, l'objet déployable le plus petit dans le modèle d'objets Kubernetes.
{{% /capture %}}

{{% capture body %}}

## Comprendre les Pods

Un *Pod* est le bloc de construction de base de Kubernetes--l'unité la plus petite et la plus simple dans le modèle d'objets de Kubernetes--que vous créez ou déployez. Un Pod représente un process en cours d'exécution dans votre cluster.

Un Pod encapsule un conteneur applicatif (ou, dans certains cas, plusieurs conteneurs), des ressources de stockage, une IP réseau unique, et des options qui contrôlent comment le ou les conteneurs doivent s'exécuter. Un Pod représente une unité de déploiement : *une instance unique d'une application dans Kubernetes*, qui peut consister soit en un unique conteneur soit en un petit nombre de conteneurs qui sont étroitement liés et qui partagent des ressources.

> [Docker](https://www.docker.com) est le runtime de conteneurs le plus courant utilisé dans un Pod Kubernetes, mais les Pods prennent également en charge d'autres runtimes de conteneurs.

Les Pods dans un cluster Kubernetes peuvent être utilisés de deux manières différentes :

* **les Pods exécutant un conteneur unique**. Le modèle "un-conteneur-par-Pod" est le cas d'utilisation Kubernetes le plus courant ; dans ce cas, vous pouvez voir un Pod comme un wrapper autour d'un conteneur unique, et Kubernetes gère les Pods plutôt que directement les conteneurs.
* **les Pods exécutant plusieurs conteneurs devant travailler ensemble**. Un Pod peut encapsuler une application composée de plusieurs conteneurs co-localisés qui sont étroitement liés et qui doivent partager des ressources. Ces conteneurs co-localisés pourraient former une unique unité de service cohésive--un conteneur servant des fichiers d'un volume partagé au public, alors qu'un conteneur "sidecar" séparé rafraîchit ou met à jour ces fichiers. Le Pod enveloppe ensemble ces conteneurs et ressources de stockage en une entité maniable de base.

Le [Blog Kubernetes](http://kubernetes.io/blog) contient quelques informations supplémentaires sur les cas d'utilisation des Pods. Pour plus d'informations, voir :

* [The Distributed System Toolkit: Patterns for Composite Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)
* [Container Design Patterns](https://kubernetes.io/blog/2016/06/container-design-patterns)

Chaque Pod est destiné à exécuter une instance unique d'une application donnée. Si vous désirez mettre à l'échelle votre application horizontalement, (par ex., exécuter plusieurs instances), vous devez utiliser plusieurs Pods, un pour chaque instance. Dans Kubernetes, on parle généralement de _réplication_. Des Pods répliqués sont en général créés et gérés comme un groupe par une abstraction appelée Controller. Voir [Pods et Controllers](#pods-and-controllers) pour plus d'informations.

### Comment les Pods gèrent plusieurs conteneurs

Les Pods sont conçus pour supporter plusieurs process coopérants (sous forme de conteneurs) qui forment une unité de service cohésive. Les conteneurs d'un même Pod sont automatiquement co-localisés et co-programmés sur la même machine physique ou virtuelle dans le cluster. Ces conteneurs peuvent partager des ressources et dépendances, communiquer entre eux, et coordonner quand et comment ils sont arrêtés.

Notez que grouper plusieurs conteneurs co-localisés et co-gérés dans un unique Pod est un cas d'utilisation relativement avancé. Vous devez utiliser ce pattern seulement dans des instances spécifiques dans lesquelles vos conteneurs sont étroitement liés. Par exemple, vous pourriez avoir un conteneur qui agit comme un serveur web pour des fichiers contenus dans un volume partagé, et un conteneur "sidecar" séparé qui met à jour ces fichiers depuis une source externe, comme dans le diagramme suivant :

{{< figure src="/images/docs/pod.svg" title="pod diagram" width="50%" >}}

Les Pods fournissent deux types de ressources partagées pour leurs conteneurs : *réseau* et *stockage*.

#### Réseau

Chaque Pod se voit assigner une adresse IP unique. Tous les conteneurs d'un Pod partagent le même namespace réseau, y compris l'adresse IP et les ports réseau. Les conteneurs *à l'intérieur d'un Pod* peuvent communiquer entre eux en utilisant `localhost`. Lorsque les conteneurs dans un Pod communiquent avec des entités *en dehors du Pod*, ils doivent coordonner comment ils utilisent les ressources réseau partagées (comme les ports).

#### Stockage

Un Pod peut spécifier un jeu de *volumes* de stockage partagés. Tous les conteneurs dans le Pod peuvent accéder aux volumes partagés, permettant à ces conteneurs de partager des données. Les volumes permettent aussi les données persistantes d'un Pod de survivre au cas où un des conteneurs doit être redémarré. Voir [Volumes](/docs/concepts/storage/volumes/) pour plus d'informations sur la façon dont Kubernetes implémente le stockage partagé dans un Pod.

## Travailler avec des Pods

Vous aurez rarement à créer directement des Pods individuels dans Kubernetes--même des Pods à un seul conteneur. Ceci est dû au fait que les Pods sont conçus comme des entités relativement éphémères et jetables. Lorsqu'un Pod est créé (directement par vous ou indirectement par un Controller), il est programmé pour s'exécuter sur un Nœud dans votre cluster. Le Pod reste sur ce Nœud jusqu'à ce que le process se termine, l'objet pod soit supprimé, le pod soit *expulsé* par manque de ressources, ou le Nœud soit en échec.

{{< note >}}
Redémarrer un conteneur dans un Pod ne doit pas être confondu avec redémarrer le Pod. Le Pod lui-même ne s'exécute pas, mais est un environnement dans lequel les conteneurs s'exécutent, et persiste jusqu'à ce qu'il soit supprimé.
{{< /note >}}

Les Pods ne se guérissent pas par eux-mêmes. Si un Pod est programmé sur un Nœud qui échoue, ou si l'opération de programmation elle-même échoue, le Pod est supprimé ; de plus, un Pod ne survivra pas à une expulsion due à un manque de ressources ou une mise en maintenance du Nœud. Kubernetes utilise une abstraction de plus haut niveau, appelée un *Controller*, qui s'occupe de gérer les instances de Pods relativement jetables. Ainsi, même s'il est possible d'utiliser des Pods directement, il est beaucoup plus courant dans Kubernetes de gérer vos Pods en utilisant un Controller. Voir [Pods et Controllers](#pods-and-controllers) pour plus d'informations sur la façon dont Kubernetes utilise des Controllers pour implémenter la mise à l'échelle et la guérison des Pods.

### Pods et Controllers

Un Controller peut créer et gérer plusieurs Pods pour vous, s'occupant de la réplication et du déploiement et fournissant des capacités d'auto-guérison au niveau du cluster. Par exemple, si un Nœud échoue, le Controller peut automatiquement remplacer le Pod en programmant un remplaçant identique sur un Nœud différent.

Quelques exemples de Controllers qui contiennent un ou plusieurs pods :

* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)

En général, les Controllers utilisent des Templates de Pod que vous lui fournissez pour créer les Pods dont il est responsable.

## Templates de Pod

Les Templates de Pod sont des spécifications de pod qui sont inclus dans d'autres objets, comme les 
[Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/), [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/), et
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/).  Les Controllers utilisent les Templates de Pod pour créer réellement les pods.
L'exemple ci-dessous est un manifeste simple pour un Pod d'un conteneur affichant un message.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'echo Hello Kubernetes! && sleep 3600']
```
Plutôt que de spécifier tous les états désirés courants de tous les réplicas, les templates de pod sont comme des emporte-pièces. Une fois qu'une pièce a été coupée, la pièce n'a plus de relation avec l'outil. Il n'y a pas de lien qui persiste dans le temps entre le template et le pod. Un changement à venir dans le template ou même le changement pour un nouveau template n'a pas d'effet direct sur les pods déjà créés. De manière similaire, les pods créés par un replication controller peuvent par la suite être modifiés directement. C'est en contraste délibéré avec les pods, qui spécifient l'état désiré courant de tous les conteneurs appartenant au pod. Cette approche simplifie radicalement la sémantique système et augmente la flexibilité de la primitive.

{{% /capture %}}

{{% capture whatsnext %}}
* En savoir plus sur le comportement des Pods :
  * [Terminaison d'un Pod](/docs/concepts/workloads/pods/pod/#termination-of-pods)
  * [Cycle de vie d'un Pod](../pod-lifecycle)
{{% /capture %}}
