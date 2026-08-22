---
title: HTTPプロキシを使用してKubernetes APIにアクセスする
content_type: task
weight: 40
---

<!-- overview -->
このページでは、HTTPプロキシを使用してKubernetes APIにアクセスする方法を説明します。


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

クラスター内でまだアプリケーションが実行されていない場合は、次のコマンドを入力してHello worldアプリケーションを起動してください:

```shell
kubectl create deployment hello-app --image=gcr.io/google-samples/hello-app:2.0 --port=8080
```

<!-- steps -->

## kubectlを使用してプロキシサーバーを起動する {#using-kubectl-to-start-a-proxy-server}

次のコマンドは、Kubernetes APIサーバーへのプロキシを起動します:

    kubectl proxy --port=8080

## Kubernetes APIを探索する {#exploring-the-kubernetes-api}

プロキシサーバーが実行されているときは、`curl`、`wget`、またはブラウザを使用してAPIを探索できます。

APIのバージョンを取得します:

    curl http://localhost:8080/api/

出力は次のようになります:

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

Podの一覧を取得します:

    curl http://localhost:8080/api/v1/namespaces/default/pods

出力は次のようになります:

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

## {{% heading "whatsnext" %}}

[kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy)についてさらに学ぶ。
