---
title: Exposer les informations du Pod aux containers via les variables d'environnement 
content_type: task
weight: 30
---

<!-- overview -->

Cette page montre comment un Pod peut utiliser des variables d'environnement pour
exposer ses propres informations aux containers qu'il exécute via la  
_downward API_.
Vous pouvez utiliser des variables d'environnement pour exposer des champs 
de configuration du Pod, des containers ou les deux.

Dans Kubernetes, il y a deux façons distinctes d'exposer les champs de
configuration de Pod et de container à l'intérieur d'un container:

* _Via les variables d'environnement_, comme expliqué dans cette tâche,
* Via un [volume](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Ensemble, ces deux façons d'exposer des informations du Pod et du container sont appelées la _downward API_.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Utiliser les champs du Pod comme variables d'environnement

Dans cette partie de l'exercice, vous allez créer un Pod qui a un container,
et vous allez projeter les champs d'informations du Pod à l'intérieur du
container comme variables d'environnement.

{{% codenew file="pods/inject/dapi-envars-pod.yaml" %}}

Dans ce fichier de configuration, on trouve cinq variables d'environnement.
Le champ `env` est une liste de variables d'environnement.
Le premier élément de la liste spécifie que la valeur de la variable d'environnement
`MY_NODE_NAME` hérite du champ `spec.nodeName` du Pod.
Il en va de même pour les autres variables d'environnement, qui héritent
des autres champs du Pod.
{{< note >}}
Les champs de configuration présents dans cet exemple sont des champs du Pod. Ce ne sont pas les champs du container à l'intérieur du Pod.
{{< /note >}}

Créez le Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-pod.yaml
```

Vérifiez que le container dans le Pod fonctionne:

```shell
# Si le nouveau Pod n'est pas fonctionnel, re-exécutez cette commande plusieurs fois
kubectl get pods
```

Affichez les logs du container:

```shell
kubectl logs dapi-envars-fieldref
```

Le résultat doit afficher les valeurs des variables d'environnement choisies:

```
minikube
dapi-envars-fieldref
default
172.17.0.4
default
```

Pour comprendre pourquoi ces valeurs apparaissent dans les logs, regardez les champs `command` et `args` du fichier de configuration. Lorsque le container s'exécute, il écrit les valeurs de 5 variables d'environnement vers stdout, avec un interval de 10 secondes.

Ensuite, exécutez un shell à l'intérieur du container:

```shell
kubectl exec -it dapi-envars-fieldref -- sh
```

Dans ce shell, listez les variables d'environnement:

```shell
# À exécuter à l'intérieur du container
printenv
```

Le résultat doit montrer que certaines variables d'environnement contiennent 
les informations du Pod:

```
MY_POD_SERVICE_ACCOUNT=default
...
MY_POD_NAMESPACE=default
MY_POD_IP=172.17.0.4
...
MY_NODE_NAME=minikube
...
MY_POD_NAME=dapi-envars-fieldref
```

## Utiliser des informations du container comme variables d'environnement

Dans l'exercice précédent, vous avez utilisé les informations du Pod à
travers des variables d'environnement.
Dans cet exercice, vous allez faire passer des champs appartenant 
au [container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) 
qui est exécuté à l'intérieur du Pod. 

Voici un fichier de configuration pour un autre Pod qui ne contient qu'un seul 
container:

{{% codenew file="pods/inject/dapi-envars-container.yaml" %}}

Dans ce fichier, vous pouvez voir 4 variables d'environnement.
Le champ `env` est une liste de variables d'environnement.
Le premier élément de la liste spécifie que la variable d'environnement `MY_CPU_REQUEST` aura sa valeur à partir du champ `requests.cpu` du container avec le nom `test-container`. Il en va de même pour les autres variables d'environnement, qui hériteront des champs du container qui sera exécuté.

Créez le Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-container.yaml
```

Vérifiez que le container dans le Pod fonctionne:

```shell
# Si le nouveau Pod n'est pas fonctionnel, re-exécutez cette commande plusieurs fois
kubectl get pods
```

Affichez les logs du container:

```shell
kubectl logs dapi-envars-resourcefieldref
```

Le résultat doit afficher les valeurs des variables selectionnées:

```
1
1
33554432
67108864
```

## {{% heading "whatsnext" %}}


* Lire [Définir des variables d'environnement pour un Container](/docs/tasks/inject-data-application/define-environment-variable-container/)
* Lire la [`documentation de référence des Pod`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec).
  Elle inclut la documentation pour les containers.
* Lire la liste des [champs de configuration disponibles](/docs/concepts/workloads/pods/downward-api/#available-fields)
  qui peuvent être exposés via la downward API.

En savoir plus sur les pods, les containers et les variables d'environnement avec les documentations de référence:

* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
