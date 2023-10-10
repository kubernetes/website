---
title: Assigner des pods aux nœuds
content_type: task
weight: 120
---

<!-- overview -->
Cette page montre comment assigner un Pod à un nœud particulier dans un cluster Kubernetes.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Ajouter un label à un nœud

1. Listez les nœuds de votre cluster :

    ```shell
    kubectl get nodes
    ```

    La sortie est la suivante :

    ```shell
    NAME      STATUS    ROLES     AGE     VERSION
    worker0   Ready     <none>    1d      v1.13.0
    worker1   Ready     <none>    1d      v1.13.0
    worker2   Ready     <none>    1d      v1.13.0
    ```
2. Choisissez l'un de vos nœuds et ajoutez-y un label :

    ```shell
    kubectl label nodes <your-node-name> disktype=ssd
    ```

    où `<your-node-name>` est le nom du noeud que vous avez choisi.

3. Vérifiez que le nœud que vous avez choisi a le label `disktype=ssd` :

    ```shell
    kubectl get nodes --show-labels
    ```

    La sortie est la suivante :

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    Dans la sortie précédente, vous constatez que le nœud `worker0` possède le label `disktype=ssd`.

## Créez un pod qui sera planifié sur un nœud sélectionné.

Le fichier de configuration de pod décrit un pod qui possède un selector de nœud de type `disktype:ssd`. Cela signifie que le pod sera planifié sur un nœud ayant le label `disktype=ssd`.

{{% codenew file="pods/pod-nginx.yaml" %}}

1. Utilisez le fichier de configuration pour créer un pod qui sera ordonnancé sur votre nœud choisi :

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml
    ```

2. Vérifiez que le pod fonctionne sur le nœud que vous avez choisi :

    ```shell
    kubectl get pods --output=wide
    ```

    La sortie est la suivante :

    ```shell
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```
## Créez un pod qui va être planifié sur un nœud spécifique

Vous pouvez également ordonnancer un pod sur un nœud spécifique via le paramètre `nodeName`.

{{% codenew file="pods/pod-nginx-specific-node.yaml" %}}

Utilisez le fichier de configuration pour créer un pod qui sera ordonnancé sur `foo-node` uniquement.



## {{% heading "whatsnext" %}}

Pour en savoir plus sur
[labels et selectors](/docs/concepts/overview/working-with-objects/labels/).


