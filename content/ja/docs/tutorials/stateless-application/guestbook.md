---
title: "例: Redisを使用したPHPのゲストブックアプリケーションのデプロイ"
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 30
  title: "ステートレスの例: Redisを使用したPHPのゲストブック"
---

<!-- overview -->
このチュートリアルでは、Kubernetesと[Docker](https://www.docker.com/)を使用した、シンプルなマルチティアのウェブアプリケーションのビルドとデプロイの方法を紹介します。この例は、以下のコンポーネントから構成されています。

* ゲストブックのエントリーを保存するための、シングルインスタンスの[Redis](https://redis.io/)マスター
* 読み込みデータ配信用の、複数の[レプリケーションされたRedis](https://redis.io/topics/replication)インスタンス
* 複数のウェブフロントエンドのインスタンス



## {{% heading "objectives" %}}

* Redisのマスターを起動する。
* Redisのスレーブを起動する。
* ゲストブックのフロントエンドを起動する。
* フロントエンドのServiceを公開して表示を確認する。
* クリーンアップする。


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}



<!-- lessoncontent -->

## Redisのマスターを起動する

ゲストブックアプリケーションでは、データを保存するためにRedisを使用します。ゲストブックはRedisのマスターインスタンスにデータを書き込み、複数のRedisのスレーブインスタンスからデータを読み込みます。

### RedisのマスターのDeploymentを作成する

以下のマニフェストファイルは、シングルレプリカのRedisのマスターPodを実行するDeploymentコントローラーを指定しています。

{{% codenew file="application/guestbook/redis-master-deployment.yaml" %}}

1. マニフェストファイルをダウンロードしたディレクトリ内で、ターミナルウィンドウを起動します。
1. `redis-master-deployment.yaml`ファイルから、RedisのマスターのDeploymentを適用します。

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-deployment.yaml
      ```

1. Podのリストを問い合わせて、RedisのマスターのPodが実行中になっていることを確認します。

      ```shell
      kubectl get pods
      ```

      結果は次のようになるはずです。

      ```shell
      NAME                            READY     STATUS    RESTARTS   AGE
      redis-master-1068406935-3lswp   1/1       Running   0          28s
      ```

1. 次のコマンドを実行して、RedisのマスターのPodからログを表示します。

     ```shell
     kubectl logs -f POD-NAME
     ```

{{< note >}}
POD-NAMEの部分を実際のPodの名前に書き換えてください。
{{< /note >}}

### RedisのマスターのServiceを作成する

ゲストブックアプリケーションは、データを書き込むためにRedisのマスターと通信する必要があります。そのためには、[Service](/ja/docs/concepts/services-networking/service/)を適用して、トラフィックをRedisのマスターのPodへプロキシしなければなりません。Serviceは、Podにアクセスするためのポリシーを指定します。

{{% codenew file="application/guestbook/redis-master-service.yaml" %}}

1. 次の`redis-master-service.yaml`から、RedisのマスターのServiceを適用します。

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-service.yaml
      ```

1. Serviceのリストを問い合わせて、RedisのマスターのServiceが実行中になっていることを確認します。

      ```shell
      kubectl get service
      ```

      The response should be similar to this:

      ```shell
      NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP    1m
      redis-master   ClusterIP   10.0.0.151   <none>        6379/TCP   8s
      ```

{{< note >}}
このマニフェストファイルは、`redis-master`という名前のServiceを、前に定義したラベルにマッチする一連のラベル付きで作成します。これにより、ServiceはネットワークトラフィックをRedisのマスターのPodへとルーティングできるようになります。
{{< /note >}}


## Redisのスレーブを起動する

Redisのマスターは1つのPodですが、レプリカのRedisのスレーブを追加することで、トラフィックの需要を満たすための高い可用性を持たせることができます。

### RedisのスレーブのDeploymentを作成する

Deploymentはマニフェストファイル内に書かれた設定に基づいてスケールします。ここでは、Deploymentオブジェクトは2つのレプリカを指定しています。

もし1つもレプリカが実行されていなければ、このDeploymentは2つのレプリカをコンテナクラスター上で起動します。逆に、もしすでに2つ以上のレプリカが実行されていれば、実行中のレプリカが2つになるようにスケールダウンします。

{{% codenew file="application/guestbook/redis-slave-deployment.yaml" %}}

1. `redis-slave-deployment.yaml`ファイルから、RedisのスレーブのDeploymentを適用します。

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-slave-deployment.yaml
      ```

1. Podのリストを問い合わせて、RedisのスレーブのPodが実行中になっていることを確認します。

      ```shell
      kubectl get pods
      ```

      結果は次のようになるはずです。

      ```shell
      NAME                            READY     STATUS              RESTARTS   AGE
      redis-master-1068406935-3lswp   1/1       Running             0          1m
      redis-slave-2005841000-fpvqc    0/1       ContainerCreating   0          6s
      redis-slave-2005841000-phfv9    0/1       ContainerCreating   0          6s
      ```

### RedisのスレーブのServiceを作成する

ゲストブックアプリケーションは、データを読み込むためにRedisのスレーブと通信する必要があります。Redisのスレーブが発見できるようにするためには、Serviceをセットアップする必要があります。Serviceは一連のPodに対する透過的なロードバランシングを提供します。

{{% codenew file="application/guestbook/redis-slave-service.yaml" %}}

1. 次の`redis-slave-service.yaml`ファイルから、RedisのスレーブのServiceを適用します。

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/redis-slave-service.yaml
      ```

1. Serviceのリストを問い合わせて、RedisのスレーブのServiceが実行中になっていることを確認します。

      ```shell
      kubectl get services
      ```

      結果は次のようになるはずです。

      ```
      NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP    2m
      redis-master   ClusterIP   10.0.0.151   <none>        6379/TCP   1m
      redis-slave    ClusterIP   10.0.0.223   <none>        6379/TCP   6s
      ```

## ゲストブックのフロントエンドをセットアップして公開する

ゲストブックアプリケーションには、HTTPリクエストをサーブするPHPで書かれたウェブフロントエンドがあります。このアプリケーションは、書き込みリクエストに対しては`redis-master` Serviceに、読み込みリクエストに対しては`redis-slave` Serviceに接続するように設定されています。

### ゲストブックのフロントエンドのDeploymentを作成する

{{% codenew file="application/guestbook/frontend-deployment.yaml" %}}

1. `frontend-deployment.yaml`ファイルから、フロントエンドのDeploymentを適用します。

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml
      ```

1. Podのリストを問い合わせて、3つのフロントエンドのレプリカが実行中になっていることを確認します。

      ```shell
      kubectl get pods -l app=guestbook -l tier=frontend
      ```

      結果は次のようになるはずです。

      ```
      NAME                        READY     STATUS    RESTARTS   AGE
      frontend-3823415956-dsvc5   1/1       Running   0          54s
      frontend-3823415956-k22zn   1/1       Running   0          54s
      frontend-3823415956-w9gbt   1/1       Running   0          54s
      ```

### フロントエンドのServiceを作成する

適用した`redis-slave`および`redis-master` Serviceは、コンテナクラスター内部からのみアクセス可能です。これは、デフォルトのServiceのtypeが[ClusterIP](/ja/docs/concepts/services-networking/service/#publishing-services-service-types)であるためです。`ClusterIP`は、Serviceが指している一連のPodに対して1つのIPアドレスを提供します。このIPアドレスはクラスター内部からのみアクセスできます。

もしゲストの人にゲストブックにアクセスしてほしいのなら、フロントエンドServiceを外部から見えるように設定しなければなりません。そうすれば、クライアントはコンテナクラスターの外部からServiceにリクエストを送れるようになります。Minikubeでは、Serviceを`NodePort`でのみ公開できます。

{{< note >}}
一部のクラウドプロバイダーでは、Google Compute EngineやGoogle Kubernetes Engineなど、外部のロードバランサーをサポートしているものがあります。もしクラウドプロバイダーがロードバランサーをサポートしていて、それを使用したい場合は、`type: NodePort`という行を単に削除またはコメントアウトして、`type: LoadBalancer`のコメントアウトを外せば使用できます。
{{< /note >}}

{{% codenew file="application/guestbook/frontend-service.yaml" %}}

1. `frontend-service.yaml`ファイルから、フロントエンドのServiceを提供します。

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml
      ```

1. Serviceのリストを問い合わせて、フロントエンドのServiceが実行中であることを確認します。

      ```shell
      kubectl get services
      ```

      結果は次のようになるはずです。

      ```
      NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
      frontend       NodePort    10.0.0.112   <none>       80:31323/TCP   6s
      kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP        4m
      redis-master   ClusterIP   10.0.0.151   <none>        6379/TCP       2m
      redis-slave    ClusterIP   10.0.0.223   <none>        6379/TCP       1m
      ```

### フロントエンドのServiceを`NodePort`経由で表示する

このアプリケーションをMinikubeやローカルのクラスターにデプロイした場合、ゲストブックを表示するためのIPアドレスを見つける必要があります。

1. 次のコマンドを実行すると、フロントエンドServiceに対するIPアドレスを取得できます。

      ```shell
      minikube service frontend --url
      ```

      結果は次のようになるはずです。

      ```
      http://192.168.99.100:31323
      ```

1. IPアドレスをコピーして、ブラウザー上でページを読み込み、ゲストブックを表示しましょう。

### フロントエンドのServiceを`LoadBalancer`経由で表示する

もし`frontend-service.yaml`マニフェストを`type: LoadBalancer`でデプロイした場合、ゲストブックを表示するためのIPアドレスを見つける必要があります。

1. 次のコマンドを実行すると、フロントエンドServiceに対するIPアドレスを取得できます。

      ```shell
      kubectl get service frontend
      ```

      結果は次のようになるはずです。

      ```
      NAME       TYPE        CLUSTER-IP      EXTERNAL-IP        PORT(S)        AGE
      frontend   ClusterIP   10.51.242.136   109.197.92.229     80:32372/TCP   1m
      ```

1. 外部IPアドレス(EXTERNAL-IP)をコピーして、ブラウザー上でページを読み込み、ゲストブックを表示しましょう。

## ウェブフロントエンドをスケールする

サーバーがDeploymentコントローラーを使用するServiceとして定義されているため、スケールアップやスケールダウンは簡単です。

1. 次のコマンドを実行すると、フロントエンドのPodの数をスケールアップできます。

      ```shell
      kubectl scale deployment frontend --replicas=5
      ```

1. Podのリストを問い合わせて、実行中のフロントエンドのPodの数を確認します。

      ```shell
      kubectl get pods
      ```

      結果は次のようになるはずです。

      ```
      NAME                            READY     STATUS    RESTARTS   AGE
      frontend-3823415956-70qj5       1/1       Running   0          5s
      frontend-3823415956-dsvc5       1/1       Running   0          54m
      frontend-3823415956-k22zn       1/1       Running   0          54m
      frontend-3823415956-w9gbt       1/1       Running   0          54m
      frontend-3823415956-x2pld       1/1       Running   0          5s
      redis-master-1068406935-3lswp   1/1       Running   0          56m
      redis-slave-2005841000-fpvqc    1/1       Running   0          55m
      redis-slave-2005841000-phfv9    1/1       Running   0          55m
      ```

1. 次のコマンドを実行すると、フロントエンドのPodの数をスケールダウンできます。

      ```shell
      kubectl scale deployment frontend --replicas=2
      ```

1. Podのリストを問い合わせて、実行中のフロントエンドのPodの数を確認します。

      ```shell
      kubectl get pods
      ```

      結果は次のようになるはずです。

      ```
      NAME                            READY     STATUS    RESTARTS   AGE
      frontend-3823415956-k22zn       1/1       Running   0          1h
      frontend-3823415956-w9gbt       1/1       Running   0          1h
      redis-master-1068406935-3lswp   1/1       Running   0          1h
      redis-slave-2005841000-fpvqc    1/1       Running   0          1h
      redis-slave-2005841000-phfv9    1/1       Running   0          1h
      ```



## {{% heading "cleanup" %}}

DeploymentとServiceを削除すると、実行中のPodも削除されます。ラベルを使用すると、複数のリソースを1つのコマンドで削除できます。

1. 次のコマンドを実行すると、すべてのPod、Deployment、Serviceが削除されます。

      ```shell
      kubectl delete deployment -l app=redis
      kubectl delete service -l app=redis
      kubectl delete deployment -l app=guestbook
      kubectl delete service -l app=guestbook
      ```

      結果は次のようになるはずです。

      ```
      deployment.apps "redis-master" deleted
      deployment.apps "redis-slave" deleted
      service "redis-master" deleted
      service "redis-slave" deleted
      deployment.apps "frontend" deleted
      service "frontend" deleted
      ```

1. Podのリストを問い合わせて、実行中のPodが存在しないことを確認します。

      ```shell
      kubectl get pods
      ```

      結果は次のようになるはずです。

      ```
      No resources found.
      ```



## {{% heading "whatsnext" %}}

* ゲストブックアプリケーションに対する[ELKによるロギングとモニタリング](/ja/docs/tutorials/stateless-application/guestbook-logs-metrics-with-elk/)
* [Kubernetesの基本](/ja/docs/tutorials/kubernetes-basics/)のインタラクティブチュートリアルを終わらせる
* Kubernetesを使って、[MySQLとWordpressのためにPersistent Volume](/ja/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog)を使用したブログを作成する
* [サービスとアプリケーションの接続](/ja/docs/concepts/services-networking/connect-applications-service/)についてもっと読む
* [リソースの管理](/ja/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively)についてもっと読む
