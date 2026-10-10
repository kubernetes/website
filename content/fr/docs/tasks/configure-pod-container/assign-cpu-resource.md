---
title: Allouer des ressources CPU aux conteneurs et aux pods
content_type: task
weight: 20
---

<!-- overview -->

Cette page montre comment assigner une *demande* (request en anglais) de CPU et une *limite* de CPU à un conteneur.
Un conteneur est garanti d'avoir autant de CPU qu'il le demande, mais n'est pas autorisé à utiliser plus de CPU que sa limite.





## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Chaque nœud de votre cluster doit avoir au moins 1 CPU.

Pour certaines des étapes de cette page, vous devez lancer [metrics-server](https://github.com/kubernetes-incubator/metrics-server) dans votre cluster. Si le serveur de métriques est déja lancé,
vous pouvez sauter ces étapes.

Si vous utilisez minikube, exécutez la commande suivante pour activer metrics-server :

```shell
minikube addons enable metrics-server
```

Pour voir si metrics-server (ou un autre fournisseur de l'API des métriques de ressources `metrics.k8s.io`) est lancé, tapez la commande suivante:

```shell
kubectl get apiservices
```

Si l'API de métriques de ressources est disponible, la sortie inclura une
référence à `metrics.k8s.io`.


```shell
NAME
v1beta1.metrics.k8s.io
```




<!-- steps -->

## Créer un namespace

Créez un namespace de manière à ce que les ressources que vous créez dans cet exercice soient isolés du reste de votre cluster.

```shell
kubectl create namespace cpu-example
```

## Spécifier une demande de CPU et une limite de CPU

Pour spécifier une demande de CPU pour un conteneur, incluez le champ `resources:requests`.
dans le manifeste des ressources du conteneur. Pour spécifier une limite de CPU, incluez `resources:limits`.

Dans cet exercice, vous allez créer un Pod qui a un seul conteneur. Le conteneur a une demande de 0.5 CPU et une limite de 1 CPU. Voici le fichier de configuration du Pod :

{{% codenew file="pods/resource/cpu-request-limit.yaml" %}}

La section `args` du fichier de configuration fournit des arguments pour le conteneur lorsqu'il démarre. L'argument `-cpus "2"` demande au conteneur d'utiliser 2 CPUs.

Créez le Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

Vérifiez que le Pod fonctionne :

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

Consultez des informations détaillées sur le Pod :

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

La sortie indique que le conteneur dans le Pod a une demande CPU de 500 milliCPU.
et une limite de CPU de 1 CPU.

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

Utilisez `kubectl top` pour récupérer les métriques du Pod :

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

La sortie montre que le Pod utilise 974 milliCPU, ce qui est légèrement inférieur à
la limite de 1 CPU spécifiée dans le fichier de configuration du Pod.

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

Souvenez-vous qu'en réglant `-cpu "2"`, vous avez configuré le conteneur pour faire en sorte qu'il utilise 2 CPU, mais que le conteneur ne peut utiliser qu'environ 1 CPU. L'utilisation du CPU du conteneur est entravée, car le conteneur tente d'utiliser plus de ressources CPU que sa limite.

{{< note >}}
Une autre explication possible de la restriction du CPU est que le Nœud pourrait ne pas avoir
suffisamment de ressources CPU disponibles. Rappelons que les conditions préalables à cet exercice exigent que chacun de vos Nœuds doit avoir au moins 1 CPU.
Si votre conteneur fonctionne sur un nœud qui n'a qu'un seul CPU, le conteneur ne peut pas utiliser plus que 1 CPU, quelle que soit la limite de CPU spécifiée pour le conteneur.
{{< /note >}}

## Unités de CPU

La ressource CPU est mesurée en unités *CPU*. Un CPU, à Kubernetes, est équivalent à:

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* 1 Hyperthread sur un serveur physique avec un processeur Intel qui a de l'hyperthreading.

Les valeurs fractionnelles sont autorisées. Un conteneur qui demande 0,5 CPU est garanti deux fois moins CPU par rapport à un conteneur qui demande 1 CPU. Vous pouvez utiliser le suffixe m pour signifier milli. Par exemple 100m CPU, 100 milliCPU, et 0.1 CPU sont tous égaux. Une précision plus fine que 1m n'est pas autorisée.

Le CPU est toujours demandé en tant que quantité absolue, jamais en tant que quantité relative, 0.1 est la même quantité de CPU sur une machine single-core, dual-core ou 48-core.

Supprimez votre pod :

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

## Spécifier une demande de CPU trop élevée pour vos nœuds.

Les demandes et limites de CPU sont associées aux conteneurs, mais il est utile de réfléchir à la demande et à la limite de CPU d'un pod. La demande de CPU pour un Pod est la somme des demandes de CPU pour tous les conteneurs du Pod. De même, la limite de CPU pour les un Pod est la somme des limites de CPU pour tous les conteneurs du Pod.

L'ordonnancement des pods est basé sur les demandes. Un Pod est prévu pour se lancer sur un Nœud uniquement si le nœud dispose de suffisamment de ressources CPU pour satisfaire la demande de CPU du Pod.

Dans cet exercice, vous allez créer un Pod qui a une demande de CPU si importante qu'elle dépassera la capacité de n'importe quel nœud de votre cluster. Voici le fichier de configuration d'un Pod
qui a un seul conteneur. Le conteneur nécessite 100 CPU, ce qui est susceptible de dépasser la capacité de tous les nœuds de votre cluster.

{{% codenew file="pods/resource/cpu-request-limit-2.yaml" %}}

Créez le Pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```

Affichez l'état du Pod :

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

La sortie montre que l'état du Pod est en attente. En d'autres termes, le Pod n'a pas été
planifié pour tourner sur n'importe quel Nœud, et il restera à l'état PENDING indéfiniment :


```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

Afficher des informations détaillées sur le Pod, y compris les événements:


```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

la sortie signale que le conteneur ne peut pas être planifié en raison d'une quantité insuffisante de ressources de CPU sur les Nœuds :


```shell
Events:
  Reason			Message
  ------			-------
  FailedScheduling	No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

Supprimez votre Pod :

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

## Si vous ne spécifiez pas de limite CPU

Si vous ne spécifiez pas de limite CPU pour un conteneur, une de ces situations s'applique :

* Le conteneur n'a pas de limite maximale quant aux ressources CPU qu'il peut utiliser. Le conteneur
pourrait utiliser toutes les ressources CPU disponibles sur le nœud où il est lancé.

* Le conteneur est lancé dans un namespace qui a une limite par défaut de CPU, ainsi le conteneur reçoit automatiquement cette limite par défaut. Les administrateurs du cluster peuvent utiliser un
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/)
pour spécifier une valeur par défaut pour la limite de CPU.

## Motivation pour les demandes et les limites du CPU

En configurant les demandes et les limites de CPU des conteneurs qui se lancent sur votre cluster,
vous pouvez utiliser efficacement les ressources CPU disponibles sur les Nœuds de votre cluster.
En gardant une demande faible de CPU de pod, vous donnez au Pod une bonne chance d'être ordonnancé.
En ayant une limite CPU supérieure à la demande de CPU, vous accomplissez deux choses :

* Le Pod peut avoir des pics d'activité où il utilise les ressources CPU qui sont déjà disponibles.
* La quantité de ressources CPU qu'un Pod peut utiliser pendant une pic d'activité est limitée à une quantité raisonnable.

## Nettoyage

Supprimez votre namespace :

```shell
kubectl delete namespace cpu-example
```



## {{% heading "whatsnext" %}}



### Pour les développeurs d'applications

* [Allocation des ressources mémoire aux conteneurs et aux pods](/fr/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Configuration de la qualité de service pour les pods](/docs/tasks/configure-pod-container/quality-service-pod/)

### Pour les administrateurs de cluster

* [Configuration des demandes et des limites de mémoire par défaut pour un Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configuration des demandes et des limites par défaut de CPU pour un Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configuration des contraintes de mémoire minimales et maximales pour un Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configuration des contraintes minimales et maximales du CPU pour un Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configuration des quotas de mémoire et de CPU pour un Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configuration du quota de pods pour un Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configuration des quotas pour les objets API](/docs/tasks/administer-cluster/quota-api-object/)





