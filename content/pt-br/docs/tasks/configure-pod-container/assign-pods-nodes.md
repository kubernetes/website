---
title: Atribuindo Pods aos Nós
content_type: task
weight: 120
---

<!-- overview -->
Esta página mostra como atribuir um Pod Kubernetes a um nó particular em um 
cluster Kubernetes.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Adicione um rótulo a um nó

1. Liste os {{< glossary_tooltip term_id="node" text="nós" >}} em seu cluster, 
juntamente com seus rótulos:

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

1. Escolha um de seus nós, e adicione um rótulo a ele:

    ```shell
    kubectl label nodes <your-node-name> disktype=ssd
    ```

    onde `<your-node-name>` é o nome do seu nó escolhido.

1. Verifique se seu nó escolhido tem o rótulo `disktype=ssd`:

    ```shell
    kubectl get nodes --show-labels
    ```

    A saída é similiar a esta:

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    Na saída anterior, você pode ver que o nó `worker0` tem o rótulo `disktype=ssd`.

## Crie um pod que é agendado em seu nó escolhido

Este arquivo de configuração de pod descreve um pod que tem um seletor de nó, 
`disktype: ssd`. Isto significa que o pod será agendado em um nó que tem o rótulo `disktype=ssd`.

{{% codenew file="pods/pod-nginx.yaml" %}}

1. Use o arquivo de configuração para criar um pod que será agendado no nó escolhido:
    
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml
    ```

1. Verifique se o pod está executando no nó escolhido:

    ```shell
    kubectl get pods --output=wide
    ```

    A saída é similar a esta:
    
    ```shell
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```

## Crie um pod que é agendado em um nó específico

Você pode também agendar um pod para um nó específico usando `nodeName`.

{{% codenew file="pods/pod-nginx-specific-node.yaml" %}}

Use o arquivo de configuração para criar um pod que será agendado somente no nó `foo-node`.



## {{% heading "whatsnext" %}}

* Aprenda mais sobre [rótulos e seletores](/docs/concepts/overview/working-with-objects/labels/).
* Aprenda mais sobre [nós](/docs/concepts/architecture/nodes/).


