---
title: Atribuindo Pods aos Nós Usando Afinidade de Nós
min-kubernetes-server-version: v1.10
content_type: task
weight: 120
update_date: 2022-07-18
origin_version: 1.24
contributors: DonatoHorn
reviewers:
---

<!-- overview -->
Esta página mostra como atribuir um Pod Kubernetes à um Nó particular usando 
Afinidade de Nó em um cluster Kubernetes.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Adicione um rótulo a um Nó

1. Liste os Nós em seu cluster, juntamente com seus rótulos:

    ```shell
    kubectl get nodes --show-labels
    ```
    A saída é similar a esta:

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

1. Escolha um dos seus Nós, e adicione um rótulo a ele:

    ```shell
    kubectl label nodes <your-node-name> disktype=ssd
    ```
    onde `<your-node-name>` é o nome do seu nó escolhido.

1. Verifique se o seu nó escolhido tem o rótulo `disktype=ssd`:

    ```shell
    kubectl get nodes --show-labels
    ```

    A saída é similar a esta:

    ```
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    Na saída anterior, você pode ver que o nó `worker0` tem o rótulo `disktype=ssd`.

## Agende um Pod usando afinidade de Nó requerida

Este manifesto descreve um Pod que tem uma afinidade de nó 
`requiredDuringSchedulingIgnoredDuringExecution`,`disktype: ssd`. 
Isto significa que o pod será agendado somente em um nó que tenha o rótulo `disktype=ssd`. 

{{< codenew file="pods/pod-nginx-required-affinity.yaml" >}}

1. Aplique o manifesto para criar um Pod que será agendado no seu nó escolhido:
    
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-required-affinity.yaml
    ```

1. Verifique se o pod está executando em seu nó escolhido:

    ```shell
    kubectl get pods --output=wide
    ```

    A saída é similar a esta:
    
    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```
    
## Agende um Pod usando afinidade de nó preferido

Este manifesto descreve um Pod que tem uma afinidade de nó 
`preferredDuringSchedulingIgnoredDuringExecution`, `disktype: ssd`. 
Isto significa que o pod dará preferência a um nó que tenha o rótulo `disktype=ssd`. 

{{< codenew file="pods/pod-nginx-preferred-affinity.yaml" >}}

1. Aplique o manifesto para criar um Pod que é agendado no seu nó escolhido:
    
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-preferred-affinity.yaml
    ```

1. Verifique se o pod está executando em seu nó escolhido:

    ```shell
    kubectl get pods --output=wide
    ```

    A saída é similar a esta:
    
    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```



## {{% heading "whatsnext" %}}

Aprenda mais sobre [Afinidade de Nó](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).

