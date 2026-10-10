---
title: Affecter des ressources supplémentaires à un conteneur
content_type: task
weight: 40
---

<!-- overview -->

Cette page montre comment affecter des ressources supplémentaires à un conteneur.

{{< feature-state state="stable" >}}




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Avant de commencer cet exercice, procédez à l'exercice en
[Annoncer des ressources supplémentaires pour un nœud](/docs/tasks/administer-cluster/extended-resource-node/).
Cela configurera l'un de vos nœuds pour qu'il annoncera une ressource dongle.




<!-- steps -->

## Affecter une ressource supplémentaire à un Pod

Pour demander une ressource supplémentaire, incluez le champ `resources:requests` dans votre fichier de manifeste du conteneur. Les ressources supplémentaires sont entièrement qualifiées dans n'importe quel domaine à l'extérieur de `*.kubernetes.io/`.
Les noms de ressources supplémentaires valides ont la forme `example.com/foo` où `example.com` est remplacé par le domaine de votre organisation et `foo` est le nom descriptif de la ressource.

Voici le fichier de configuration d'un Pod qui a un seul conteneur :

{{% codenew file="pods/resource/extended-resource-pod.yaml" %}}

Dans le fichier de configuration, vous pouvez constater que le conteneur demande 3 dongles.

Créez un pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod.yaml
```

Vérifiez que le Pod fonctionne :

```shell
kubectl get pod extended-resource-demo
```

Décrivez le Pod :

```shell
kubectl describe pod extended-resource-demo
```

La sortie affiche les demandes des dongles :

```yaml
Limits:
  example.com/dongle: 3
Requests:
  example.com/dongle: 3
```

## Tentative de création d'un deuxième Pod

Voici le fichier de configuration d'un Pod qui a un seul conteneur. Le conteneur demande
deux dongles.

{{% codenew file="pods/resource/extended-resource-pod-2.yaml" %}}

Kubernetes ne pourra pas satisfaire la demande de deux dongles, parce que le premier Pod
a utilisé trois des quatre dongles disponibles.

Essayez de créer un Pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod-2.yaml
```

Décrivez le Pod :

```shell
kubectl describe pod extended-resource-demo-2
```

La sortie montre que le Pod ne peut pas être planifié, du fait qu'il n'y a pas de Nœud qui a
2 dongles disponibles :


```
Conditions:
  Type    Status
  PodScheduled  False
...
Events:
  ...
  ... Warning   FailedScheduling  pod (extended-resource-demo-2) failed to fit in any node
fit failure summary on nodes : Insufficient example.com/dongle (1)
```

Affichez l'état du Pod :

```shell
kubectl get pod extended-resource-demo-2
```

La sortie indique que le Pod a été créé, mais pas programmé pour tourner sur un Nœud.
Il a le statut Pending :

```yaml
NAME                       READY     STATUS    RESTARTS   AGE
extended-resource-demo-2   0/1       Pending   0          6m
```

## Nettoyage

Supprimez les Pods que vous avez créés dans cet exercice :

```shell
kubectl delete pod extended-resource-demo
kubectl delete pod extended-resource-demo-2
```



## {{% heading "whatsnext" %}}


### Pour les développeurs d'applications

* [Allocation des ressources mémoire aux conteneurs et pods](/fr/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Allocation des ressources CPU aux conteneurs et pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### Pour les administrateurs de cluster

* [Annoncer des ressources supplémentaires pour un nœud](/docs/tasks/administer-cluster/extended-resource-node/)

