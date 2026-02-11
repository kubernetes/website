---
title: Використання HTTP-проксі для доступу до Kubernetes API
content_type: task
weight: 40
---

<!-- overview -->

Ця сторінка показує, як використовувати HTTP-проксі для доступу до Kubernetes API.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Якщо у вас ще немає застосунку, що працює у вашому кластері, запустіть застосунок Hello world, скориставшись:

```shell
kubectl create deployment hello-app --image=gcr.io/google-samples/hello-app:2.0 --port=8080
```

<!-- steps -->

## Використання kubectl для запуску проксі-сервера {#using-kubectl-to-start-a-proxy-server}

Ця команда запускає проксі до сервера Kubernetes API:

```shell
kubectl proxy --port=8080
```

## Дослідження Kubernetes API {#exploring-the-kubernetes-api}

Коли проксі-сервер працює, ви можете досліджувати API за допомогою `curl`, `wget` або оглядача.

Отримання версій API:

```shell
curl http://localhost:8080/api/
```

Вихідні дані повинні виглядати приблизно так:

```json
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
```

Отримання списку Podʼів:

```shell
curl http://localhost:8080/api/v1/namespaces/default/pods
```

Вихідні дані повинні виглядати приблизно так:

```json
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
```

## {{% heading "whatsnext" %}}

Дізнайтеся більше про [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy).
