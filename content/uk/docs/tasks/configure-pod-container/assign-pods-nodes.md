---
title: Призначення Podʼів на вузли
content_type: task
weight: 150
---

<!-- overview -->

Ця сторінка показує, як призначити Pod Kubernetes на певний вузол в кластері Kubernetes.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Додайте мітку до вузла {#add-a-label-to-a-node}

1. Виведіть список {{< glossary_tooltip term_id="node" text="вузлів" >}} у вашому кластері разом з їхніми мітками:

    ```shell
    kubectl get nodes --show-labels
    ```

    Вивід буде схожий на такий:

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

1. Виберіть один з ваших вузлів і додайте до нього мітку:

    ```shell
    kubectl label nodes <your-node-name> disktype=ssd
    ```

    де `<your-node-name>` — це імʼя вашого обраного вузла.

1. Перевірте, що ваш обраний вузол має мітку `disktype=ssd`:

    ```shell
    kubectl get nodes --show-labels
    ```

    Вивід буде схожий на такий:

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    У попередньому виводі можна побачити, що вузол `worker0` має мітку `disktype=ssd`.

## Створіть Pod, який буде призначений на ваш обраний вузол {#create-a-pod-that-gets-scheduled-to-your-chosen-node}

Цей файл конфігурації Podʼа описує Pod, який має селектор вузла `disktype: ssd`. Це означає, що Pod буде призначений на вузол, який має мітку `disktype=ssd`.

{{% code_sample file="pods/pod-nginx.yaml" %}}

1. Використайте файл конфігурації, щоб створити Pod, який буде призначений на ваш обраний вузол:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml
    ```

1. Перевірте, що Pod працює на вашому обраному вузлі:

    ```shell
    kubectl get pods --output=wide
    ```

    Вивід буде схожий на такий:

    ```shell
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```

## Створіть Pod, який буде призначений на конкретний вузол {#create-a-pod-that-gets-scheduled-to-specific-node}

Ви також можете призначити Pod на один конкретний вузол, встановивши `nodeName`.

{{% code_sample file="pods/pod-nginx-specific-node.yaml" %}}

Використовуйте файл конфігурації, щоб створити Pod, який буде призначений тільки на `foo-node`.

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [мітки та селектори](/docs/concepts/overview/working-with-objects/labels/).
* Дізнайтеся більше про [вузли](/docs/concepts/architecture/nodes/).
