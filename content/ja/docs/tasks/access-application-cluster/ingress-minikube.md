---
title: Minikube上でNGINX Ingressコントローラーを使用してIngressをセットアップする
content_type: task
weight: 100
---

<!-- overview -->

[Ingress](/ja/docs/concepts/services-networking/ingress/)とは、クラスター内のServiceに外部からのアクセスを許可するルールを定義するAPIオブジェクトです。[Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers/)はIngress内に設定されたルールを満たすように動作します。

このページでは、簡単なIngressをセットアップして、HTTPのURIに応じてwebまたはweb2というServiceにリクエストをルーティングする方法を説明します。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Minikubeクラスターを作成する

1. **Launch Terminal**をクリックします。

    {{< kat-button >}}

1. (オプション) Minikubeをローカル環境にインストールした場合は、次のコマンドを実行します。

    ```shell
    minikube start
    ```

## Ingressコントローラーを有効化する

1. NGINX Ingressコントローラーを有効にするために、次のコマンドを実行します。

    ```shell
    minikube addons enable ingress
    ```

1. NGINX Ingressコントローラーが起動したことを確認します。

    ```shell
    kubectl get pods -n kube-system
    ```

    {{< note >}}
    このコマンドの実行には数分かかる場合があります。
    {{< /note >}}

    出力は次のようになります。

    ```shell
    NAME                                        READY     STATUS    RESTARTS   AGE
    default-http-backend-59868b7dd6-xb8tq       1/1       Running   0          1m
    kube-addon-manager-minikube                 1/1       Running   0          3m
    kube-dns-6dcb57bcc8-n4xd4                   3/3       Running   0          2m
    kubernetes-dashboard-5498ccf677-b8p5h       1/1       Running   0          2m
    nginx-ingress-controller-5984b97644-rnkrg   1/1       Running   0          1m
    storage-provisioner                         1/1       Running   0          2m
    ```

## Hello Worldアプリをデプロイする

1. 次のコマンドを実行して、Deploymentを作成します。

    ```shell
    kubectl create deployment web --image=gcr.io/google-samples/hello-app:1.0
    ```

    出力は次のようになります。

    ```shell
    deployment.apps/web created
    ```

1. Deploymentを公開します。

    ```shell
    kubectl expose deployment web --type=NodePort --port=8080
    ```

    出力は次のようになります。

    ```shell
    service/web exposed
    ```

1. Serviceが作成され、NodePort上で利用できるようになったことを確認します。

    ```shell
    kubectl get service web
    ```

    出力は次のようになります。

    ```shell
    NAME      TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
    web       NodePort   10.104.133.249   <none>        8080:31637/TCP   12m
    ```

1. NodePort経由でServiceを訪問します。

    ```shell
    minikube service web --url
    ```

    出力は次のようになります。

    ```shell
    http://172.17.0.15:31637
    ```

    {{< note >}}
    Katacoda環境の場合のみ: 上部のterminalパネルでプラスのアイコンをクリックして、**Select port to view on Host 1**(Host 1を表示するポートを選択)をクリックします。NodePort(上の例では`31637`)を入力して、**Display Port**(ポートを表示)をクリックしてください。
    {{< /note >}}

    出力は次のようになります。

    ```shell
    Hello, world!
    Version: 1.0.0
    Hostname: web-55b8c6998d-8k564
    ```

    これで、MinikubeのIPアドレスとNodePort経由で、サンプルアプリにアクセスできるようになりました。次のステップでは、Ingressリソースを使用してアプリにアクセスできるように設定します。

## Ingressリソースを作成する

以下に示すファイルは、hello-world.info経由で送られたトラフィックをServiceに送信するIngressリソースです。

1. 以下の内容で`example-ingress.yaml`を作成します。

    {{< codenew file="service/networking/example-ingress.yaml" >}}

1. 次のコマンドを実行して、Ingressリソースを作成します。

    ```shell
    kubectl apply -f https://kubernetes.io/examples/service/networking/example-ingress.yaml
    ```

    出力は次のようになります。

    ```shell
    ingress.networking.k8s.io/example-ingress created
    ```

1. 次のコマンドで、IPアドレスが設定されていることを確認します。

    ```shell
    kubectl get ingress
    ```

    {{< note >}}
    このコマンドの実行には数分かかる場合があります。
    {{< /note >}}

    ```shell
    NAME              CLASS    HOSTS              ADDRESS        PORTS   AGE
    example-ingress   <none>   hello-world.info   172.17.0.15    80      38s
    ```

1. 次の行を`/etc/hosts`ファイルの最後に書きます。

    {{< note >}}
    Minikubeをローカル環境で実行している場合、`minikube ip`コマンドを使用すると外部のIPが取得できます。Ingressのリスト内に表示されるIPアドレスは、内部のIPになるはずです。
    {{< /note >}}

    ```
    172.17.0.15 hello-world.info
    ```

    この設定により、リクエストがhello-world.infoからMinikubeに送信されるようになります。

1. Ingressコントローラーがトラフィックを制御していることを確認します。

    ```shell
    curl hello-world.info
    ```

    出力は次のようになります。

    ```shell
    Hello, world!
    Version: 1.0.0
    Hostname: web-55b8c6998d-8k564
    ```

    {{< note >}}
    Minikubeをローカル環境で実行している場合、ブラウザからhello-world.infoにアクセスできます。
    {{< /note >}}

## 2番目のDeploymentを作成する

1. 次のコマンドを実行して、v2のDeploymentを作成します。

    ```shell
    kubectl create deployment web2 --image=gcr.io/google-samples/hello-app:2.0
    ```

    出力は次のようになります。

    ```shell
    deployment.apps/web2 created
    ```

1. Deploymentを公開します。

    ```shell
    kubectl expose deployment web2 --port=8080 --type=NodePort
    ```

    出力は次のようになります。

    ```shell
    service/web2 exposed
    ```

## Ingressを編集する

1. 既存の`example-ingress.yaml`を編集して、以下の行を追加します。

    ```yaml
          - path: /v2
            pathType: Prefix
            backend:
              service:
                name: web2
                port:
                  number: 8080
    ```

1. 次のコマンドで変更を適用します。

    ```shell
    kubectl apply -f example-ingress.yaml
    ```

    出力は次のようになります。

    ```shell
    ingress.networking/example-ingress configured
    ```

## Ingressを試す

1. Hello Worldアプリの1番目のバージョンにアクセスします。

    ```shell
    curl hello-world.info
    ```

    出力は次のようになります。

    ```shell
    Hello, world!
    Version: 1.0.0
    Hostname: web-55b8c6998d-8k564
    ```

1. Hello Worldアプリの2番目のバージョンにアクセスします。

    ```shell
    curl hello-world.info/v2
    ```

    出力は次のようになります。

    ```shell
    Hello, world!
    Version: 2.0.0
    Hostname: web2-75cd47646f-t8cjk
    ```

    {{< note >}}
    Minikubeをローカル環境で実行している場合、ブラウザからhello-world.infoおよびhello-world.info/v2にアクセスできます。
    {{< /note >}}




## {{% heading "whatsnext" %}}

* [Ingress](/ja/docs/concepts/services-networking/ingress/)についてさらに学ぶ。
* [Ingressコントローラー](/ja/docs/concepts/services-networking/ingress-controllers/)についてさらに学ぶ。
* [Service](/ja/docs/concepts/services-networking/service/)についてさらに学ぶ。
