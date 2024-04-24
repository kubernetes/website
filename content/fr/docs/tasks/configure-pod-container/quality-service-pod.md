---
title: Configurer la qualité de service pour les pods
content_type: task
weight: 30
---


<!-- overview -->

Cette page montre comment configurer les Pods pour qu'ils soient affectés à des classes particulières de qualité de service (QoS). Kubernetes utilise des classes de QoS pour prendre des décisions concernant l'ordonnancement et les évictions des pods.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## Les Classes de QoS

Quand Kubernetes crée un Pod, il affecte une de ces classes QoS au Pod :

* Guaranteed
* Burstable
* BestEffort

## Créez un namespace

Créez un namespace de manière à ce que les ressources que vous créez dans cet exercice soient isolées du reste de votre cluster.

```shell
kubectl create namespace qos-example
```

## Créez un Pod qui se fait attribuer une classe QoS de Guaranteed

Pour qu'un Pod reçoive une classe de QoS Guaranteed :

* Chaque conteneur du Pod doit avoir une limite de mémoire et une demande de mémoire, et elles doivent être les mêmes.
* Chaque conteneur dans le Pod doit avoir une limite CPU et une demande CPU, et ils doivent être les mêmes.

Ci-dessous le fichier de configuration d'un Pod qui a un seul conteneur.
Le conteneur dispose d'une limite de mémoire et d'une demande de mémoire, tous deux égaux à 200 MiB. Le conteneur a également une limite CPU et une demande CPU, toutes deux égales à 700 milliCPU :

{{% codenew file="pods/qos/qos-pod.yaml" %}}

Créez le Pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod.yaml --namespace=qos-example
```

Consultez des informations détaillées sur le Pod :

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```

Le résultat indique que Kubernetes a donné au pod une classe de qualité de service de type Guaranteed. De plus, il affiche que la demande de mémoire du conteneur du pod correspond à sa limite de mémoire, et que la demande de CPU correspond à sa limite de CPU.

```yaml
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
  ...
status:
  qosClass: Guaranteed
```

{{< note >}}
Si un conteneur spécifie sa propre limite de mémoire, mais ne spécifie pas de demande de mémoire, Kubernetes attribue automatiquement une demande de mémoire correspondant à la limite. De même, si un conteneur spécifie sa propre limite CPU, mais ne spécifie pas de demande de CPU, Kubernetes lui attribue automatiquement une demande de CPU qui correspond à cette limite.
{{< /note >}}

Supprimez votre Pod :

```shell
kubectl delete pod qos-demo --namespace=qos-example
```

## Créez un Pod qui se fait attribuer une classe QoS de type Burstable

Un Pod reçoit une classe QoS de Burstable si :

* Le Pod ne répond pas aux critères de la classe QoS Guaranteed.
* Au moins un conteneur dans le Pod dispose d'une demande de mémoire ou de CPU.

Voici le fichier de configuration d'un pod qui a un seul conteneur. Le conteneur a une limite de mémoire de 200 MiB et une demande de mémoire de 100 MiB.

{{% codenew file="pods/qos/qos-pod-2.yaml" %}}

Créez le Pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-2.yaml --namespace=qos-example
```

Consultez des informations détaillées sur le Pod :

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```

La sortie montre que Kubernetes a accordé au pod une classe QoS de type Burstable.
```yaml
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: qos-demo-2-ctr
    resources:
      limits:
        memory: 200Mi
      requests:
        memory: 100Mi
  ...
status:
  qosClass: Burstable
```

Supprimez votre Pod :

```shell
kubectl delete pod qos-demo-2 --namespace=qos-example
```

## Créez un Pod qui se fait attribuer une classe QoS de type BestEffort

Pour qu'un pod puisse avoir la classe QoS de BestEffort, les conteneurs dans le pod ne doivent pas
avoir des limites ou des demandes de mémoire ou de CPU.

Voici le fichier de configuration d'un Pod qui a un seul conteneur. Le conteneur n'a pas des limites ou des demandes de mémoire ou de CPU :

{{% codenew file="pods/qos/qos-pod-3.yaml" %}}

Créez le Pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-3.yaml --namespace=qos-example
```

Consultez des informations détaillées sur le Pod :

```shell
kubectl get pod qos-demo-3 --namespace=qos-example --output=yaml
```

Le résultat montre que Kubernetes a accordé au pod une classe QoS de BestEffort.

```yaml
spec:
  containers:
    ...
    resources: {}
  ...
status:
  qosClass: BestEffort
```

Supprimez votre Pod :

```shell
kubectl delete pod qos-demo-3 --namespace=qos-example
```

## Créez un pod qui contient deux conteneurs


Voici le fichier de configuration d'un Pod qui a deux conteneurs. Un conteneur spécifie une
demande de mémoire de 200 MiB. L'autre conteneur ne spécifie aucune demande ou limite.

{{% codenew file="pods/qos/qos-pod-4.yaml" %}}

Notez que le pod répond aux critères de la classe QoS Burstable. En d'autres termes, il ne répond pas aux exigences de la classe de qualité de service Guaranteed, et l'un de ses conteneurs dispose d'une demande de mémoire.

Créez le Pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-4.yaml --namespace=qos-example
```

Consultez des informations détaillées sur le Pod :

```shell
kubectl get pod qos-demo-4 --namespace=qos-example --output=yaml
```

Le résultat montre que Kubernetes a accordé au pod une classe QoS de Burstable:

```yaml
spec:
  containers:
    ...
    name: qos-demo-4-ctr-1
    resources:
      requests:
        memory: 200Mi
    ...
    name: qos-demo-4-ctr-2
    resources: {}
    ...
status:
  qosClass: Burstable
```

Supprimez votre pod :

```shell
kubectl delete pod qos-demo-4 --namespace=qos-example
```

## Nettoyage

Supprimez votre namespace.

```shell
kubectl delete namespace qos-example
```



## {{% heading "whatsnext" %}}



### Pour les développeurs d'applications

* [Allocation des ressources CPU aux conteneurs et pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Allocation des ressources mémoire aux conteneurs et pods](/fr/docs/tasks/configure-pod-container/assign-memory-resource/)


### Pour les administrateurs de cluster

* [Configuration des demandes et des limites de mémoire par défaut pour un Namespace](/docs/tasks/administer-cluster/memory-default-namespace/)

* [Configuration des demandes et des limites par défaut de CPU pour un Namespace](/docs/tasks/administer-cluster/cpu-default-namespace/)

* [Configuration des contraintes de mémoire minimales et maximales pour un Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)

* [Configuration des contraintes minimales et maximales du CPU pour un Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)

* [Configuration des quotas de mémoire et de CPU pour un Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)

* [Configuration du quota de pods pour un Namespace](/docs/tasks/administer-cluster/quota-pod-namespace/)

* [Configuration des quotas pour les objets API](/docs/tasks/administer-cluster/quota-api-object/)






