---
reviewers:
title: Pods
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Les _Pods_ sont les plus petites unités informatiques déployables
qui peuvent être créées et gérées dans Kubernetes.

{{% /capture %}}


{{% capture body %}}

## Qu'est-ce qu'un pod ?

Un _pod_ (terme anglo-saxon décrivant un groupe de baleines ou une gousse de pois) est un groupe d'un ou plusieurs conteneurs 
(comme des conteneurs Docker), ayant du stockage/réseau partagé, et une spécification 
sur la manière d'exécuter ces conteneurs. Les éléments d'un pod sont toujours co-localisés
et co-ordonnancés, et s'exécutent dans un contexte partagé. Un pod modélise un
"hôte logique" spécifique à une application - il contient un ou plusieurs conteneurs applicatifs
qui sont étroitement liés &mdash; dans un monde pré-conteneurs, être exécuté sur la même machine 
physique ou virtuelle signifierait être exécuté sur le même hôte logique.

Bien que Kubernetes prenne en charge d'autres runtimes de conteneurs que Docker, Docker est le runtime
le plus connu, et cela aide à décrire des pods en termes Docker.

Le contexte partagé d'un pod est un ensemble de namespaces Linux, cgroups, et
potentiellement d'autres facettes d'isolation - les mêmes choses qui isolent un conteneur Docker.
Dans le contexte d'un pod, les applications individuelles peuvent se voir appliquer d'autres sous-isolations.

Les conteneurs d'un pod partagent une adresse IP et un espace de ports, et peuvent communiquer via `localhost`. 
Ils peuvent aussi communiquer entre eux en utilisant des communications inter-process standard comme
les sémaphores SystemV ou la mémoire partagée POSIX.  Les conteneurs appartenant à des pods distincts ont des adresses IP
distinctes et ne peuvent pas communiquer par IPC sans [configuration spécifique](/docs/concepts/policy/pod-security-policy/). Ces conteneurs communiquent en général entre eux via les adresses IP de leurs pods.

Les applications à l'intérieur d'un pod ont aussi accès à des volumes partagés, 
qui sont définis dans le cadre d'un pod et sont mis à disposition pour être montés
dans le système de fichiers de chaque application.

En terme de concepts [Docker](https://www.docker.com/), un pod est modélisé par un groupe de conteneurs Docker
ayant des namespaces et des [volumes](/docs/concepts/storage/volumes/) partagés.

Tout comme des conteneurs applicatifs individuels, les pods sont considérés comme des entités relativement éphémères (plutôt que durables).
Comme discuté dans [Cycle de vie d'un pod](/docs/concepts/workloads/pods/pod-lifecycle/), les pods sont créés, des ID uniques (UID) leurs sont assignés,
et ils sont ordonnancés sur des nœuds où il restent jusqu'à leur arrêt (selon la politique de redémarrage) ou suppression.
Si un nœud meurt, les pods ordonnancés sur ce nœud sont programmés pour être terminés, après un délai d'attente. Un pod donné (défini par un UID)
n'est pas "re-ordonnancé" sur un nouveau nœud ; par contre, il peut être remplacé par un pod identique,
ayant le même nom si désiré, mais avec un nouvel UID (voir [replication
controller](/docs/concepts/workloads/controllers/replicationcontroller/) pour plus de détails).

Lorsque quelque chose, comme un volume, a le même cycle de vie qu'un pod, il existe aussi longtemps
que le pod (avec l'UID donné) existe. Si ce pod est supprimé pour une quelconque raison, même si un remplaçant
identique est recréé, la chose liée (par ex. le volume) est aussi détruite et créée à nouveau.

{{< figure src="/images/docs/pod.svg" title="pod diagram" width="50%" >}}

*Un pod multi-conteneurs contenant un extracteur de fichiers et un serveur web
utilisant un volume persistant comme espace de stockage partagé entre les conteneurs.*

## Intérêts des pods

### Gestion

Les pods fournissent une unité de service cohérente afin d'avoir un modèle coopératif entre plusieurs processus.
Ils simplifient le déploiement et la gestion d'applications 
en fournissant une abstraction de plus haut niveau que l'ensemble des applications les constituant.
Les pods servent d'unité de déploiement, de mise à l'échelle horizontale, et de réplication.
La co-localisation (co-ordonnancement), la fin partagée (par ex. l'arrêt), 
la réplication coordonnée, le partage de ressources et la gestion des dépendances sont 
traités automatiquement pour les conteneurs dans un pod.

### Partage de ressources et communication

Les pods permettent le partage de ressources et la communication entre ses constituants.

Les applications dans un pod utilisent toutes le même réseau (même adresse IP et espace de ports)
et peuvent donc "se trouver" entre elles et communiquer en utilisant `localhost`.
À cause de cela, les applications dans un pod doivent coordonner leurs usages de ports.
Chaque pod a une adresse IP dans un réseau plat partagé ayant un accès complet 
aux autres hôtes et pods à travers le réseau.

Le nom d'hôte est défini avec le nom du pod pour les conteneurs applicatifs à l'intérieur du pod.
[Plus de détails sur le réseau](/docs/concepts/cluster-administration/networking/).

En plus de définir les conteneurs applicatifs s'exécutant dans le pod, le pod spécifie 
un ensemble de volumes de stockage partagés. Les volumes permettent aux données de survivre 
aux redémarrages de conteneurs et d'être partagés entre les applications d'un même pod.

## Cas d'utilisation de pods

Des pods peuvent être utilisés pour héberger verticalement des piles applicatives intégrées (par ex. LAMP),
mais leur principal intérêt est la mise en place de programmes auxiliaires co-localisés et co-gérés, comme :

* systèmes de gestion de contenu, chargeurs de fichiers et de données, gestionnaires de cache local, etc.
* sauvegarde de log et checkpoint, compression, rotation, prise d'instantanés, etc.
* data change watchers, log tailers, adaptateurs de logs et monitoring, éditeurs d'événements, etc.
* proxies, bridges et adaptateurs
* contrôleurs, gestionnaires, configurateurs et gestionnaires de mise à jour

Des pods individuels ne sont pas destinés à exécuter plusieurs instances de la même application, en général.

Pour une explication plus détaillée, voir [The Distributed System ToolKit: Patterns for
Composite
Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns).

## Alternatives envisagées

_Pourquoi ne pas simplement exécuter plusieurs programmes dans un unique conteneur (Docker) ?_

1. Transparence. Rendre les conteneurs à l'intérieur du pod visibles par l'infrastucture
   permet à l'infrastucture de fournir des services à ces conteneurs, 
   comme la gestion des processus et le monitoring des ressources. Ceci 
   apporte un certain nombre de facilités aux utilisateurs.
1. Découpler les dépendances logicielles. Les conteneurs individuels peuvent être
   versionnés, reconstruits et redéployés de manière indépendante. Kubernetes pourrait
   même un jour prendre en charge la mise à jour à chaud de conteneurs individuels.
1. Facilité d'utilisation. Les utilisateurs n'ont pas besoin d'exécuter leur propre gestionnaire
   de processus, de se soucier de la propagation de signaux et de codes de sortie, etc.
1. Efficacité. L'infrastructure prenant plus de responsabilités, les conteneurs peuvent être plus légers.

_Pourquoi ne pas prendre en charge le co-ordonnancement de conteneurs basé sur les affinités ?_

Cette approche pourrait fournir la co-localisation, mais ne fournirait pas la plupart 
des bénéfices des pods, comme le partage de ressources, IPC, la garantie d'une fin partagée et une gestion simplifiée.

## Durabilité des pods (ou manque de)

Les pods ne doivent pas être considérés comme des entités durables. Ils ne survivent pas à des erreurs d'ordonnancement, à un nœud en échec
ou à d'autres expulsions, suite à un manque de ressources ou une mise en maintenance d'un nœud.

En général, les utilisateurs n'ont pas à créer directement des pods. Ils doivent presque toujours 
utiliser des contrôleurs, même pour des singletons, comme par exemple des [Deployments](/docs/concepts/workloads/controllers/deployment/).
Les contrôleurs fournissent l'auto-guérison à l'échelle du cluster, ainsi que la réplication et la gestion des déploiements (rollout).
Les contrôleurs comme [StatefulSet](/docs/concepts/workloads/controllers/statefulset.md)
peuvent aussi prendre en charge des pods avec état (stateful).

L'utilisation d'APIs collectives comme principale primitive exposée à l'utilisateur est courante dans les systèmes d'ordonnancement de clusters, comme [Borg](https://research.google.com/pubs/pub43438.html), [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html), [Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema), et [Tupperware](http://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997).

Un Pod est exposé en tant que primitive afin de faciliter :

* la connexion du scheduler et du contrôleur
* la possibilité d'opérations au niveau du pod sans besoin de passer par des APIs au niveau du contrôleur
* le découplage du cycle de fin d'un pod de celui d'un contrôleur, comme pour l'amorçage (bootstrapping)
* le découplage des contrôleurs et des services &mdash; le contrôleur d'endpoints examine uniquement des pods
* la composition claire des fonctionnalités niveau Kubelet et des fonctionnalités niveau cluster &mdash; concrètement, Kubelet est le "contrôleur de pods"
* les applications hautement disponibles, qui attendront que les pods soient remplacés avant leur arrêt et au moins avant leur suppression, comme dans les cas d'éviction programmée ou de pré-chargement d'image.

## Arrêt de pods

Les pods représentant des processus s'exécutant sur des nœuds d'un cluster, il est important de permettre à ces processus de se terminer proprement
lorsqu'ils ne sont plus nécessaires (plutôt que d'être violemment tués avec un signal KILL et n'avoir aucune chance de libérer ses ressources). Les 
utilisateurs doivent pouvoir demander une suppression et savoir quand les processus se terminent, mais aussi être capable de s'assurer que la suppression
est réellement effective. Lorsqu'un utilisateur demande la suppression d'un pod, le système enregistre le délai de grâce prévu avant que le pod puisse
être tué de force, et qu'un signal TERM soit envoyé au processus principal de chaque conteneur. Une fois la période de grâce expirée, le signal KILL
est envoyé à ces processus, et le pod est alors supprimé de l'API server. Si Kubelet ou le gestionnaire de conteneurs est redémarré lors de l'attente de l'arrêt des processus, l'arrêt sera réessayé avec la période de grâce complète.

Un exemple de déroulement :

1. Un utilisateur envoie une commande pour supprimer un Pod, avec une période de grâce par défaut (30s)
1. Le Pod dans l'API server est mis à jour avec le temps au delà duquel le Pod est considéré "mort" ainsi que la période de grâce.
1. Le Pod est affiché comme "Terminating" dans les listes des commandes client
1. (en même temps que 3) Lorsque Kubelet voit qu'un Pod a été marqué "Terminating", le temps ayant été mis en 2, il commence le processus de suppression du pod.
    1. Si un des conteneurs du Pod a défini un [preStop hook](/docs/concepts/containers/container-lifecycle-hooks/#hook-details), il est exécuté à l'intérieur du conteneur. Si le `preStop` hook est toujours en cours d'exécution à la fin de la période de grâce, l'étape 2 est invoquée avec une courte (2 secondes) période de grâce supplémentaire.
    1. Le signal TERM est envoyé aux conteneurs. Notez que tous les conteneurs du Pod ne recevront pas le signal TERM en même temps et il peut être nécessaire de définir des `preStop` hook si l'ordre d'arrêt est important.
1. (en même temps que 3) Le Pod est supprimé des listes d'endpoints des services, et n'est plus considéré comme faisant partie des pods en cours d'exécution pour les contrôleurs de réplication. Les Pods s'arrêtant lentement ne peuvent pas continuer à servir du trafic, les load balancers (comme le service proxy) les supprimant de leurs rotations.
1. Lorsque la période de grâce expire, les processus s'exécutant toujours dans le Pod sont tués avec SIGKILL.
1. Kubelet va supprimer le Pod dans l'API server en indiquant une période de grâce de 0 (suppression immédiate). Le Pod disparaît de l'API et n'est plus visible par le client.

Par défaut, toutes les suppressions ont une période de grâce de 30 secondes. La commande `kubectl delete` prend en charge l'option `--grace-period=<secondes>` permettant à l'utilisateur de spécifier sa propre valeur. La valeur `0` [force la suppression](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods) du pod. Avec kubectl version >= 1.5, vous devez spécifier un flag supplémentaire `--force` avec `--grace-period=0` pour pouvoir forcer la suppression.

### Suppression forcée de pods

La suppression forcée d'un pod est définie comme la suppression immédiate d'un pod de l'état du cluster et d'etcd. Lorqu'une suppression forcée est effectuée, l'apiserver n'attend pas la confirmation de kubelet que le pod a été terminé sur le nœud sur lequel il s'exécutait. Il supprime le pod de l'API immédiatement pour qu'un nouveau pod puisse être créé avec le même nom. Sur le nœud, les pods devant se terminer immédiatement se verront donner une courte période de grâce avant d'être tués de force.

Les suppressions forcées peuvent être potentiellement dangereuses pour certains pods et doivent être effectuées avec précaution. Dans le cas de pods d'un StatefulSet, veuillez vous référer à la documentation pour [supprimer des Pods d'un StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

## Mode privilégié pour les conteneurs d'un pod

Depuis Kubernetes v1.1, tout conteneur d'un pod peut activer le mode privilégié, en utilisant le flag `privileged` du `SecurityContext` de la spec du conteneur. Ceci est utile pour les conteneurs voulant utiliser les capacités de Linux comme manipuler la pile réseau ou accéder aux périphériques. Les processus dans un tel conteneur ont pratiquement les mêmes privilèges que les processus en dehors d'un conteneur. En mode privilégié, il doit être plus facile d'écrire des plugins réseau et volume en tant que pods séparés ne devant pas être compilés dans kubelet.

Si le master exécute Kubernetes v1.1 ou supérieur, et les nœuds exécutent une version antérieure à v1.1, les nouveaux pods privilégiés seront acceptés par l'api-server, mais ne seront pas lancés. Il resteront en état "pending".
Si l'utilisateur appelle `kubectl describe pod FooPodName`, l'utilisateur peut voir la raison pour laquelle le pod est en état "pending". La table d'événements dans la sortie de la commande "describe" indiquera :
`Error validating pod "FooPodName"."FooPodNamespace" from api, ignoring: spec.containers[0].securityContext.privileged: forbidden '<*>(0xc2089d3248)true'`


Si le master exécute une version antérieure à v1.1, les pods privilégiés ne peuvent alors pas être créés. Si l'utilisateur tente de créer un pod ayant un conteneur privilégié, l'utilisateur obtiendra l'erreur suivante :
`The Pod "FooPodName" is invalid.
spec.containers[0].securityContext.privileged: forbidden '<*>(0xc20b222db0)true'`

## Objet de l'API

Le Pod est une ressource au plus haut niveau dans l'API REST Kubernetes. Plus de détails sur l'objet de l'API peuvent être trouvés à :
[Objet de l'API Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).

{{% /capture %}}
