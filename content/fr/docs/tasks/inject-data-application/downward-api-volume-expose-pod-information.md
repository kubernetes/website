---
title: Exposer les informations d'un Pod à ses containers à travers des fichiers
content_type: task
weight: 40
---

<!-- overview -->

Cette page montre comment un Pod peut utiliser un 
[volume en `downwardAPI`](/docs/concepts/storage/volumes/#downwardapi),
pour exposer des informations sur lui-même aux containers executés dans ce Pod.
Vous pouvez utiliser un volume `downwardAPI` pour exposer des champs 
de configuration du Pod, de ses containers ou les deux.

Dans Kubernetes, il y a deux façons distinctes d'exposer les champs de
configuration de Pod et de container à l'intérieur d'un container:

* Via les [variables d'environnement](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* Via un volume monté, comme expliqué dans cette tâche

Ensemble, ces deux façons d'exposer des informations du Pod et du container sont appelées la _downward API_.


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}


<!-- steps -->

## Stocker des champs d'un Pod

Dans cette partie de l'exercice, vous allez créer un Pod qui a un container,
et vous allez projeter les champs d'informations du Pod à l'intérieur du
container via des fichiers dans le container.
Voici le fichier de configuration du Pod:

{{% codenew file="pods/inject/dapi-volume.yaml" %}}

Dans la configuration, on peut voir que le Pod a un volume de type `downward API`, et que le container monte ce volume sur le chemin `/etc/podinfo`.

Dans la liste `items` sous la définition `downwardAPI`, on peut voir que
chaque élément de la liste définit un fichier du volume Downward API.
Le premier élément spécifie que le champ `metadata.labels` doit être exposé dans un fichier appelé `labels`.
Le second élement spécifie que les champs `annotations` du Pod doivent
être stockés dans un fichier appelé `annotations`.

{{< note >}}
Les champs de configuration présents dans cet exemple sont des champs du Pod. Ce ne sont pas les champs du container à l'intérieur du Pod.
{{< /note >}}

Créez le Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume.yaml
```

Vérifiez que le container dans le Pod fonctionne:

```shell
kubectl get pods
```

Affichez les logs du container:

```shell
kubectl logs kubernetes-downwardapi-volume-example
```

Le résultat doit afficher le contenu  des fichiers `labels` et `annotations`:

```
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"

build="two"
builder="john-doe"
```

Exécutez un shell à l'intérieur du container de votre Pod:

```shell
kubectl exec -it kubernetes-downwardapi-volume-example -- sh
```

Dans ce shell, affichez le contenu du ficher `labels`:

```shell
/# cat /etc/podinfo/labels
```

Le résultat doit montrer que tous les labels du Pod ont 
été écrits dans le fichier `labels`:

```shell
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"
```

Il en va de même pour le fichier `annotations`:

```shell
/# cat /etc/podinfo/annotations
```

Listez les fichiers présents dans le dossier `/etc/podinfo`:

```shell
/# ls -laR /etc/podinfo
```

Dans le résultat, vous pouvez voir que les fichiers `labels` et `annotations`
sont dans un sous-dossier temporaire.
Dans cet exemple, `..2982_06_02_21_47_53.299460680`. Dans le dossier
`/etc/podinfo`, le dossier `..data` est un lien symbolique au dossier temporaire.
De plus, dans le dossier `/etc/podinfo`, les fichiers `labels` et `annotations`
sont eux aussi des liens symboliques.

```
drwxr-xr-x  ... Feb 6 21:47 ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 ..data -> ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 annotations -> ..data/annotations
lrwxrwxrwx  ... Feb 6 21:47 labels -> ..data/labels

/etc/..2982_06_02_21_47_53.299460680:
total 8
-rw-r--r--  ... Feb  6 21:47 annotations
-rw-r--r--  ... Feb  6 21:47 labels
```

L'utilisation de liens symboliques permet une mise à jour atomique des
données. Les mises à jour sont écrites dans un nouveau dossier temporaire,
puis les liens symboliques sont mis à jour avec [rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html).

{{< note >}}
Un container utilisant la Downward API via un volume monté dans un 
[subPath](/docs/concepts/storage/volumes/#using-subpath) ne recevra pas de mise à jour de la Downward API.
{{< /note >}}

Quittez la session shell:

```shell
/# exit
```

## Stocker des champs d'un container

Dans l'exercice précedent, vous avez rendu accessible des champs d'un Pod via la
Downward API.
Dans l'exercice suivant, vous allez faire passer de la même manière des champs
qui appartiennent au 
[container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container), plutôt qu'au Pod.
Voici un fichier de configuration pour un Pod qui n'a qu'un seul container:

{{% codenew file="pods/inject/dapi-volume-resources.yaml" %}}

Dans cette configuration, on peut voir que le Pod a un volume de type
[`downwardAPI`](/docs/concepts/storage/volumes/#downwardapi),
et que le container monte ce volume sur le chemin `/etc/podinfo`.

Dans la liste `items` sous la définition `downwardAPI`, on peut voir que
chaque élément de la liste définit un fichier du volume Downward API.

Le premier élément spécifie que dans le container nommé `client-container`,
la valeur du champ `limits.cpu` dans un format spécifié par `1m` sera exposé dans
un fichier appelé `cpu_limit`. Le champ `divisor` est optionnel et a une valeur
par défaut de `1`. Un diviseur de 1 spécifie l'unité `coeur` pour la ressource
`cpu`, et l'unité `bytes` pour la ressource `memory`.

Créez le Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume-resources.yaml
```

Exécutez un shell à l'intérieur du container de votre Pod:

```shell
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

Dans le shell, affichez le contenu du fichier `cpu_limit`:

```shell
# À exécuter à l'intérieur du container
cat /etc/podinfo/cpu_limit
```

Vous pouvez utiliser des commandes similaires pour afficher les fichiers
`cpu_request`, `mem_limit` et `mem_request`.

<!-- discussion -->

## Projection de champs sur des chemins spécifiques et droits d'accès

Vous pouvez projeter des champs sur des chemins spécifiques,
et assigner des permissions pour chacun de ces chemins.
Pour plus d'informations, regardez la documentation des 
[Secrets](/docs/concepts/configuration/secret/).

## {{% heading "whatsnext" %}}

* Lire la [`documentation de référence des Pod`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
  qui inclut la documentation pour les containers.
* Lire la liste des [champs de configuration disponibles](/docs/concepts/workloads/pods/downward-api/#available-fields)
  qui peuvent être exposés via la downward API.
* Lire la documentation de l'API [`Volumes`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
  qui définit les Volumes accessibles par des containers.
* Lire la documentation de l'API [`DownwardAPIVolumeSource`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumesource-v1-core)
  qui définit un volume contenant des informations de la Downward API.
* Lire la documentation de l'API [`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
  qui définit les champs disponibles pour un Volume Downward API.
* Lire la documentation de l'API [`ResourceFieldSelector`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
  qui spécifie les ressources des containers et leur format.
