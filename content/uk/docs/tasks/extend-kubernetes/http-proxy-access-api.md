---
title: Використання HTTP-проксі для доступу до Kubernetes API
content_type: task
weight: 40
---

<!-- overview -->

На цій сторінці показано, як використовувати HTTP-проксі для доступу до Kubernetes API.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Якщо у вашому кластері ще не працює жоден застосунок, запустіть застосунок Hello world, виконавши цю команду:

```shell
kubectl create deployment hello-app --image=gcr.io/google-samples/hello-app:2.0 --port=8080
```

<!-- steps -->

## Використання kubectl для запуску проксі-сервера {#using-kubectl-to-start-a-proxy-server}

Ця команда запускає проксі до API-сервера Kubernetes:

    kubectl proxy --port=8080

## Дослідження Kubernetes API {#exploring-the-kubernetes-api}

Коли проксі-сервер працює, ви можете досліджувати API за допомогою `curl`, `wget` або браузера.

Отримайте версії API:

    curl http://localhost:8080/api/

Вивід має бути подібним до такого:

    {
      "kind": "APIVersions",
      "versions": [
        "v1"
      ],
      "serverAddressByClientCIDRs": [
        {
          "clientCIDR": "0.0.0.0/0",
          "serverAddress": "10.0.2.15:8443"
        }
      ]
    }

Отримайте список Podʼів:

    curl http://localhost:8080/api/v1/namespaces/default/pods

Вивід має бути подібним до такого:

    {
      "kind": "PodList",
      "apiVersion": "v1",
      "metadata": {
        "resourceVersion": "33074"
      },
      "items": [
        {
          "metadata": {
            "name": "kubernetes-bootcamp-2321272333-ix8pt",
            "generateName": "kubernetes-bootcamp-2321272333-",
            "namespace": "default",
            "uid": "ba21457c-6b1d-11e6-85f7-1ef9f1dab92b",
            "resourceVersion": "33003",
            "creationTimestamp": "2016-08-25T23:43:30Z",
            "labels": {
              "pod-template-hash": "2321272333",
              "run": "kubernetes-bootcamp"
            },
            ...
    }

## {{% heading "whatsnext" %}} {#what-s-next}

Дізнайтеся більше про [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy).
