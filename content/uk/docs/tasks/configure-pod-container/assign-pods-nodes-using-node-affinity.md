---
title: Призначення Podʼів на вузли за допомогою спорідненості вузла
min-kubernetes-server-version: v1.10
content_type: task
weight: 160
---

<!-- overview -->

На цій сторінці показано, як призначити Pod Kubernetes на певний вузол за допомогою спорідненості вузла в кластері Kubernetes.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Додайте мітку до вузла {#add-a-label-to-a-node}

1. Виведіть список вузлів у вашому кластері разом з їхніми мітками:

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

    ```none
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    У попередньому виводі можна побачити, що вузол `worker0` має мітку `disktype=ssd`.

## Розмістіть Pod, використовуючи потрібну спорідненість вузла {#create-a-pod-using-required-node-affinity}

Цей маніфест описує Pod, який має спорідненість вузла `requiredDuringSchedulingIgnoredDuringExecution`, `disktype: ssd`. Це означає, що Pod буде розміщений лише на вузлі, який має мітку `disktype=ssd`.

{{% code_sample file="pods/pod-nginx-required-affinity.yaml" %}}

1. Застосуйте маніфест, щоб створити Pod, який буде розміщений на вашому обраному вузлі:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-required-affinity.yaml
    ```

1. Перевірте, що Pod працює на вашому обраному вузлі:

    ```shell
    kubectl get pods --output=wide
    ```

    Вивід буде схожий на такий:

    ```none
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```

## Розмістіть Pod, використовуючи бажану спорідненість вузла {#create-a-pod-using-preferred-node-affinity}

Цей маніфест описує Pod, який має бажану спорідненість вузла `preferredDuringSchedulingIgnoredDuringExecution`, `disktype: ssd`. Це означає, що Pod надасть перевагу вузлу, який має мітку `disktype=ssd`.

{{% code_sample file="pods/pod-nginx-preferred-affinity.yaml" %}}

1. Застосуйте маніфест, щоб створити Pod, який буде розміщений на вашому обраному вузлі:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-preferred-affinity.yaml
    ```

1. Перевірте, що Pod працює на вашому обраному вузлі:

    ```shell
    kubectl get pods --output=wide
    ```

    Вивід буде схожий на такий:

    ```none
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```

## {{% heading "whatsnext" %}}

Дізнайтеся більше про [Спорідненість вузла](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).
