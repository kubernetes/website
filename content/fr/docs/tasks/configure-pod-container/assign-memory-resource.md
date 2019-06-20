---
title: Allouer des ressources mémoire aux conteneurs et aux pods
content_template: templates/task
weight: 10
---

{{% capture overview %}}

Cette page montre comment assigner une mémoire *request* et une mémoire *limit* à un conteneur. Un conteneur est garanti d'avoir autant de mémoire qu'il le demande, mais n'est pas autorisé à consommer plus de mémoire que sa limite.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Chaque nœud de votre cluster doit avoir au moins 300 MiB de mémoire.

Pour quelques étapes de cette page, vous devez lancer 
[metrics-server] (https://github.com/kubernetes-incubator/metrics-server)
dans votre cluster. Si vous avez déjà metrics-server vous pouvez sauter ces étapes.

Si vous utilisez Minikube, exécutez la commande suivante pour activer metrics-server :

```shell
minikube addons enable metrics-server
```

Pour voir si le metrics-server fonctionne, ou un autre fournisseur de l'API des métriques de ressources (`metrics.k8s.io`), exécutez la commande suivante :

```shell
kubectl get apiservices
```

Si l'API des métriques de ressources est disponible, la sortie inclura une référence à `metrics.k8s.io`.

```shell
NAME      
v1beta1.metrics.k8s.io
```

{{% /capture %}}

{{% capture steps %}}

## Créer un namespace

Créez un namespace de manière à ce que les ressources que vous créez dans cet exercice soient isolées du reste de votre cluster.

```shell
kubectl create namespace mem-example
```

## Spécifier une demande de mémoire et une limite de mémoire

Pour spécifier une demande de mémoire pour un conteneur, incluez le champ `resources:requests`.
dans le manifeste des ressources du conteneur. Pour spécifier une limite de mémoire, incluez `resources:limits`.

Dans cet exercice, vous créez un pod qui possède un seul conteneur. Le conteneur dispose d'une demande de mémoire de 100 MiB et une limite de mémoire de 200 MiB. Voici le fichier de configuration
pour le Pod :

{{< codenew file="pods/resource/memory-request-limit.yaml" >}}

La section `args` de votre fichier de configuration fournit des arguments pour le conteneur lorsqu'il démarre.
Les arguments `"--vm-bytes", "150M"` indiquent au conteneur d'allouer 150 MiB de mémoire.

Créez le Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

Vérifiez que le Pod fonctionne :

```shell
kubectl get pod memory-demo --namespace=mem-example
```

Consultez des informations détaillées sur le Pod :

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

La sortie montre que le conteneur dans le Pod a une demande de mémoire de 100 MiB et une limite de mémoire de 200 MiB.


```yaml
...
resources:
  limits:
    memory: 200Mi
  requests:
    memory: 100Mi
...
```

Exécutez `kubectl top` pour récupérer les métriques du pod :

```shell
kubectl top pod memory-demo --namespace=mem-example
```

La sortie montre que le Pod utilise environ 162.900.000 bytes de mémoire, qui est d'environ 150 MiB. Ce qui est supérieur à la demande de 100 MiB du Pod, mais ne dépassant pas la limite de 200 Mio de Pod.

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

Supprimez votre Pod :

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

## Dépasser la limite de mémoire d'un conteneur

Un conteneur peut dépasser sa demande de mémoire si le nœud dispose de la mémoire disponible. Cependant, un conteneur n'est pas autorisé à utiliser plus que sa limite de mémoire. Si un conteneur alloue plus de mémoire que sa limite, le Conteneur devient un candidat à la terminaison. Si le conteneur continue à consommer de la mémoire au-delà de sa limite, le conteneur est arrêté. 
Si un conteneur terminé peut être redémarré, le kubelet le redémarre, comme pour tout autre type d'échec d'exécution.

Dans cet exercice, vous créez un Pod qui tente d'allouer plus de mémoire que sa limite.
Voici le fichier de configuration d'un Pod qui contient un conteneur avec une demande de mémoire de 50 MiB et une limite de mémoire de 100 MiB :

{{< codenew file="pods/resource/memory-request-limit-2.yaml" >}}

Dans la section `args` du fichier de configuration, vous pouvez voir que le conteneur
tentera d'allouer 250 MiB de mémoire, ce qui est bien au-dessus de la limite de 100 MiB.

Créez le Pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

Consultez des informations détaillées sur le Pod :

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

A ce niveau, le conteneur est soit en train de tourner, soit stoppé. Répétez la commande précédente jusqu'à ce que le conteneur soit terminé :

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

Obtenez une vue plus détaillée de l'état du conteneur :

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

La sortie indique que le conteneur a été stoppé suite à un manque de mémoire (OOM) :

```shell
lastState:
   terminated:
     containerID: docker://65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

Le conteneur dans cet exercice pourra être redémarré, ainsi le kubelet le redémarre. Répéter
cette commande plusieurs fois pour s'assurer que le conteneur est stoppé et redémarré d'une manière répététive :

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

La sortie permet de voir que le conteneur est stoppé, redémarré, stoppé à nouveau, redémarré, et ainsi de suite :

```
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
```
```

kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

Affichez des informations détaillées sur l'historique du Pod :

```
kubectl describe pod memory-demo-2 --namespace=mem-example
```

La sortie indique que le conteneur se démarre et échoue continuellement :

```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

Affichez des informations détaillées sur les nœuds de votre cluster :

```
kubectl describe nodes
```

La sortie inclut un enregistrement de la mise à mort du conteneur suite à une condition hors mémoire :

```
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

Supprimez votre Pod :

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

## Spécifiez une demande de mémoire trop volumineuse pour vos nœuds.

Les demandes de mémoire et les limites sont associées aux conteneurs, mais il est utile de réfléchir avant tout à la capacité de demande et limite mémoire des pods. 
La demande de mémoire pour le Pod est la somme des demandes de mémoire pour tous ses conteneurs. De même, la mémoire limite pour le Pod est la somme des limites de tous ses Conteneurs.

L'ordonnancement des modules est basé sur les demandes. Un Pod est schedulé pour se lancer sur un Nœud uniquement si le Nœud dispose de suffisamment de mémoire disponible pour répondre à la demande de mémoire du Pod.

Dans cet exercice, vous allez créer un Pod dont la demande de mémoire est si importante qu'elle dépasse la capacité de la mémoire de n'importe quel nœud de votre cluster. Voici le fichier de configuration d'un Pod qui possède un seul conteneur avec une demande de 1000 GiB de mémoire, qui dépasse probablement la capacité de tous les nœuds de votre cluster.

{{< codenew file="pods/resource/memory-request-limit-3.yaml" >}}

Créez le Pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-3.yaml --namespace=mem-example
```

Affichez l'état du Pod :

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

La sortie indique que l'état du Pod est PENDING. En d'autres termes, le Pod n'est pas programmé pour tourner sur aucun Nœud, et il restera indéfiniment dans l'état PENDING :

```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

Affichez des informations détaillées sur le Pod, y compris les événements :

```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

La sortie indique que le conteneur ne peut pas être planifié par manque de mémoire sur les nœuds :

```shell
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```

## Unités de mémoire

La ressource mémoire est mesurée en bytes. Vous pouvez exprimer la mémoire sous la forme d'un nombre entier simple ou d'un nombre avec l'un de ces suffixes : E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki.
Par exemple, les valeurs suivantes représentent approximativement la même valeur :

```shell
128974848, 129e6, 129M , 123Mi
```

Supprimez votre Pod :

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

## Si vous ne spécifiez pas de limite de mémoire

Si vous ne spécifiez pas de limite de mémoire pour un conteneur, l'une des situations suivantes s'applique :

* Le conteneur n'a pas de limite maximale quant à la quantité de mémoire qu'il utilise. Le conteneur
pourrait utiliser toute la mémoire disponible sur le nœud où il est en cours d'exécution, ce qui pourrait à son tour invoquer le OOM killer. De plus, dans le cas d'un OOM Kill, un conteneur sans limite de ressources aura plus de chance d'être stoppé.

* Le conteneur s'exécute dans un namespace qui a une limite de mémoire par défaut, d'ou le conteneur est automatiquement affecté cette limite par defaut. Les administrateurs du cluster peuvent utiliser un [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)
pour spécifier une valeur par défaut pour la limite de mémoire.

## Motivation pour les demandes et les limites de mémoire

En configurant les demandes de mémoire et les limites pour les conteneurs qui s'exécutent dans votre cluster.
vous pouvez utiliser efficacement les ressources mémoire disponibles sur les noeuds de votre cluster. En gardant la demande de mémoire d'un Pod basse, vous donnez au Pod une bonne chance d'être schedulé. En ayant une limite de mémoire supérieure à la demande de mémoire, vous accomplissez deux choses :

* Le Pod peut avoir des éclats d'activités où il fait usage de la mémoire qui se trouve être disponible. 
* La quantité de mémoire qu'un Pod peut utiliser pendant un  éclat d'activité est limitée à une quantité raisonnable.

## Clean up

Supprimez votre namespace. Ceci va supprimer tous les Pods que vous avez créés dans cet exercice :

```shell
kubectl delete namespace mem-example
```

{{% /capture %}}

{{% capture whatsnext %}}

### Pour les développeurs d'applications

* [Allocation des ressources CPU aux conteneurs et pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Configuration de la qualité de service pour les pods](/docs/tasks/configure-pod-container/quality-service-pod/)

### Pour les administrateurs de cluster

* [Configuration des demandes et des limites de mémoire par défaut pour un Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configuration des demandes et des limites par défaut de CPU pour un Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configuration des contraintes de mémoire minimales et maximales pour un Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configuration des contraintes minimales et maximales du CPU pour un Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configuration des quotas de mémoire et de CPU pour un Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configuration du quota de pods pour un Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configuration des quotas pour les objets API](/docs/tasks/administer-cluster/quota-api-object/)

{{% /capture %}}



