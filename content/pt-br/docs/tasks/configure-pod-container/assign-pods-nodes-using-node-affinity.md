---
title: Atribuindo Pods aos nós usando afinidade de nó
min-kubernetes-server-version: v1.10
content_type: task
weight: 160
---

<!-- overview -->
Esta página mostra como atribuir um Pod kubernetes a um nó particular em um 
cluster Kubernetes utilizando afinidade de nó.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Adicione um label a um nó

1. Liste os nós em seu cluster, juntamente com seus labels:

    ```shell
    kubectl get nodes --show-labels
    ```
    A saída é semelhante a esta:

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```
2. Escolha um de seus nós e adicione um label a ele:

    ```shell
    kubectl label nodes <your-node-name> disktype=ssd
    ```
    onde `<your-node-name>` é o nome do seu nó escolhido.

3. Verifique se seu nó escolhido tem o label `disktype=ssd`:

    ```shell
    kubectl get nodes --show-labels
    ```

    A saída é semelhante a esta:

    ```
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    Na saída anterior, você pode ver que o nó `worker0` tem o label
    `disktype=ssd`.

## Alocar um Pod usando afinidade de nó obrigatória

Este manifesto descreve um Pod que possui uma afinidade de nó `requiredDuringSchedulingIgnoredDuringExecution` com o label `disktype: ssd`. 
Isso significa que o Pod será alocado apenas em um nó que tenha o label `disktype=ssd`. 

{{% code_sample file="pods/pod-nginx-required-affinity.yaml" %}}

1. Aplique o manifesto para criar um Pod que será alocado no nó escolhido:
    
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-required-affinity.yaml
    ```

2. Verifique se o Pod está executando no nó escolhido:

    ```shell
    kubectl get pods --output=wide
    ```

    A saída é semelhante a esta:
    
    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```
    
## Alocar um Pod usando afinidade de nó preferencial

Este manifesto descreve um Pod que possui uma afinidade de nó `requiredDuringSchedulingIgnoredDuringExecution` com o label `disktype: ssd`.
Isso significa que o Pod será alocado de preferência em um nó com o label `disktype=ssd`. 

{{% code_sample file="pods/pod-nginx-preferred-affinity.yaml" %}}

1. Aplique o manifesto para criar um Pod que será alocado no nó escolhido:
    
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-preferred-affinity.yaml
    ```

2. Verifique se o Pod está executando no nó escolhido:

    ```shell
    kubectl get pods --output=wide
    ```

    A saída é semelhante a esta:
    
    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```



## {{% heading "whatsnext" %}}

Saiba mais sobre
[Afinidade de nó](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).