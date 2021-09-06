---
title: "例: StatefulSetを使用したCassandraのデプロイ"
content_type: tutorial
weight: 30
---

<!-- overview -->
このチュートリアルでは、[Apache Cassandra](http://cassandra.apache.org/)をKubernetes上で実行する方法を紹介します。
データベースの一種であるCassandraには、データの耐久性(アプリケーションの _状態_)を提供するために永続ストレージが必要です。
この例では、カスタムのCassandraのseed providerにより、Cassandraクラスターに参加した新しいCassandraインスタンスを検出できるようにします。

*StatefulSet*を利用すると、ステートフルなアプリケーションをKubernetesクラスターにデプロイするのが簡単になります。
このチュートリアルで使われている機能のより詳しい情報は、[StatefulSet](/ja/docs/concepts/workloads/controllers/statefulset/)を参照してください。

{{< note >}}
CassandraとKubernetesは、ともにクラスターのメンバーを表すために _ノード_ という用語を使用しています。このチュートリアルでは、StatefulSetに属するPodはCassandraのノードであり、Cassandraクラスター( _ring_ と呼ばれます)のメンバーでもあります。これらのPodがKubernetesクラスター内で実行されるとき、Kubernetesのコントロールプレーンは、PodをKubernetesの{{< glossary_tooltip text="Node" term_id="node" >}}上にスケジュールします。

Cassandraノードが開始すると、 _シードリスト_ を使ってring上の他のノードの検出が始まります。
このチュートリアルでは、Kubernetesクラスター内に現れた新しいCassandra Podを検出するカスタムのCassandraのseed providerをデプロイします。
{{< /note >}}


## {{% heading "objectives" %}}

* Cassandraのheadless {{< glossary_tooltip text="Service" term_id="service" >}}を作成して検証する。
* {{< glossary_tooltip term_id="StatefulSet" >}}を使用してCassandra ringを作成する。
* StatefulSetを検証する。
* StatefulSetを編集する。
* StatefulSetと{{< glossary_tooltip text="Pod" term_id="pod" >}}を削除する。


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

このチュートリアルを完了するには、{{< glossary_tooltip text="Pod" term_id="pod" >}}、{{< glossary_tooltip text="Service" term_id="service" >}}、{{< glossary_tooltip text="StatefulSet" term_id="StatefulSet" >}}の基本についてすでに知っている必要があります。

### Minikubeのセットアップに関する追加の設定手順

{{< caution >}}
[Minikube](/ja/docs/getting-started-guides/minikube/)は、デフォルトでは1024MiBのメモリと1CPUに設定されます。
デフォルトのリソース設定で起動したMinikubeでは、このチュートリアルの実行中にリソース不足のエラーが発生してしまいます。このエラーを回避するためにはMinikubeを次の設定で起動してください:

```shell
minikube start --memory 5120 --cpus=4
```
{{< /caution >}}



<!-- lessoncontent -->
## Cassandraのheadless Serviceを作成する {#creating-a-cassandra-headless-service}

Kubernetesでは、{{< glossary_tooltip text="Service" term_id="service" >}}は同じタスクを実行する{{< glossary_tooltip text="Pod" term_id="pod" >}}の集合を表します。

以下のServiceは、Cassandra Podとクラスター内のクライアント間のDNSルックアップに使われます:

{{< codenew file="application/cassandra/cassandra-service.yaml" >}}

`cassandra-service.yaml`ファイルから、Cassandra StatefulSetのすべてのメンバーをトラッキングするServiceを作成します。

```shell
kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-service.yaml
```


### 検証 (オプション) {#validating}

Cassandra Serviceを取得します。

```shell
kubectl get svc cassandra
```

結果は次のようになります。

```
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
cassandra   ClusterIP   None         <none>        9042/TCP   45s
```


`cassandra`という名前のServiceが表示されない場合、作成に失敗しています。よくある問題のトラブルシューティングについては、[Serviceのデバッグ](/ja/docs/tasks/debug-application-cluster/debug-service/)を読んでください。

## StatefulSetを使ってCassandra ringを作成する

以下に示すStatefulSetマニフェストは、3つのPodからなるCassandra ringを作成します。

{{< note >}}
この例ではMinikubeのデフォルトのプロビジョナーを使用しています。
クラウドを使用している場合、StatefulSetを更新してください。
{{< /note >}}

{{< codenew file="application/cassandra/cassandra-statefulset.yaml" >}}

`cassandra-statefulset.yaml`ファイルから、CassandraのStatefulSetを作成します:

```shell
# cassandra-statefulset.yaml を編集せずにapplyできる場合は、このコマンドを使用してください
kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml
```

クラスターに合わせて`cassandra-statefulset.yaml`を編集する必要がある場合、 https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml をダウンロードして、修正したバージョンを保存したフォルダからマニフェストを適用してください。

```shell
# cassandra-statefulset.yaml をローカルで編集する必要がある場合、このコマンドを使用してください
kubectl apply -f cassandra-statefulset.yaml
```


## CassandraのStatefulSetを検証する

1. CassandraのStatefulSetを取得します

    ```shell
    kubectl get statefulset cassandra
    ```

    結果は次のようになるはずです:

    ```
    NAME        DESIRED   CURRENT   AGE
    cassandra   3         0         13s
    ```

    `StatefulSet`リソースがPodを順番にデプロイします。

1. Podを取得して順序付きの作成ステータスを確認します

    ```shell
    kubectl get pods -l="app=cassandra"
    ```

    結果は次のようになるはずです:

    ```shell
    NAME          READY     STATUS              RESTARTS   AGE
    cassandra-0   1/1       Running             0          1m
    cassandra-1   0/1       ContainerCreating   0          8s
    ```

    3つすべてのPodのデプロイには数分かかる場合があります。デプロイが完了すると、同じコマンドは次のような結果を返します:

    ```
    NAME          READY     STATUS    RESTARTS   AGE
    cassandra-0   1/1       Running   0          10m
    cassandra-1   1/1       Running   0          9m
    cassandra-2   1/1       Running   0          8m
    ```

3. 1番目のPodの中でCassandraの[nodetool](https://cwiki.apache.org/confluence/display/CASSANDRA2/NodeTool)を実行して、ringのステータスを表示します。

    ```shell
    kubectl exec -it cassandra-0 -- nodetool status
    ```

    結果は次のようになるはずです:

    ```
    Datacenter: DC1-K8Demo
    ======================
    Status=Up/Down
    |/ State=Normal/Leaving/Joining/Moving
    --  Address     Load       Tokens       Owns (effective)  Host ID                               Rack
    UN  172.17.0.5  83.57 KiB  32           74.0%             e2dd09e6-d9d3-477e-96c5-45094c08db0f  Rack1-K8Demo
    UN  172.17.0.4  101.04 KiB  32           58.8%             f89d6835-3a42-4419-92b3-0e62cae1479c  Rack1-K8Demo
    UN  172.17.0.6  84.74 KiB  32           67.1%             a6a1e8c2-3dc5-4417-b1a0-26507af2aaad  Rack1-K8Demo
    ```

## CassandraのStatefulSetを変更する

`kubectl edit`を使うと、CassandraのStatefulSetのサイズを変更できます。

1. 次のコマンドを実行します。

    ```shell
    kubectl edit statefulset cassandra
    ```

    このコマンドを実行すると、ターミナルでエディタが起動します。変更が必要な行は`replicas`フィールドです。
    以下の例は、StatefulSetファイルの抜粋です:

    ```yaml
    # Please edit the object below. Lines beginning with a '#' will be ignored,
    # and an empty file will abort the edit. If an error occurs while saving this file will be
    # reopened with the relevant failures.
    #
    apiVersion: apps/v1
    kind: StatefulSet
    metadata:
      creationTimestamp: 2016-08-13T18:40:58Z
      generation: 1
      labels:
      app: cassandra
      name: cassandra
      namespace: default
      resourceVersion: "323"
      uid: 7a219483-6185-11e6-a910-42010a8a0fc0
    spec:
      replicas: 3
    ```

1. レプリカ数を4に変更し、マニフェストを保存します。

    これで、StatefulSetが4つのPodを実行するようにスケールされました。

1. CassandraのStatefulSetを取得して、変更を確かめます:

    ```shell
    kubectl get statefulset cassandra
    ```

    結果は次のようになるはずです:

    ```
    NAME        DESIRED   CURRENT   AGE
    cassandra   4         4         36m
    ```



## {{% heading "cleanup" %}}

StatefulSetを削除したりスケールダウンしても、StatefulSetに関係するボリュームは削除されません。
StatefulSetに関連するすべてのリソースを自動的に破棄するよりも、データの方がより貴重であるため、安全のためにこのような設定になっています。

{{< warning >}}
ストレージクラスやreclaimポリシーによっては、*PersistentVolumeClaim*を削除すると、関連するボリュームも削除される可能性があります。PersistentVolumeClaimの削除後にもデータにアクセスできるとは決して想定しないでください。
{{< /warning >}}

1. 次のコマンドを実行して(単一のコマンドにまとめています)、CassandraのStatefulSetに含まれるすべてのリソースを削除します:

    ```shell
    grace=$(kubectl get pod cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
      && kubectl delete statefulset -l app=cassandra \
      && echo "Sleeping ${grace} seconds" 1>&2 \
      && sleep $grace \
      && kubectl delete persistentvolumeclaim -l app=cassandra
    ```

1. 次のコマンドを実行して、CassandraをセットアップしたServiceを削除します:

    ```shell
    kubectl delete service -l app=cassandra
    ```

## Cassandraコンテナの環境変数

このチュートリアルのPodでは、Googleの[コンテナレジストリ](https://cloud.google.com/container-registry/docs/)の[`gcr.io/google-samples/cassandra:v13`](https://github.com/kubernetes/examples/blob/master/cassandra/image/Dockerfile)イメージを使用しました。このDockerイメージは[debian-base](https://github.com/kubernetes/kubernetes/tree/master/build/debian-base)をベースにしており、OpenJDK 8が含まれています。

このイメージには、Apache Debianリポジトリの標準のCassandraインストールが含まれます。
環境変数を利用すると、`cassandra.yaml`に挿入された値を変更できます。

| 環境変数                  | デフォルト値      |
| ------------------------ |:---------------: |
| `CASSANDRA_CLUSTER_NAME` | `'Test Cluster'` |
| `CASSANDRA_NUM_TOKENS`   | `32`             |
| `CASSANDRA_RPC_ADDRESS`  | `0.0.0.0`        |



## {{% heading "whatsnext" %}}


* [StatefulSetのスケール](/ja/docs/tasks/run-application/scale-stateful-set/)を行う方法を学ぶ。
* [*KubernetesSeedProvider*](https://github.com/kubernetes/examples/blob/master/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java)についてもっと学ぶ。
* カスタムの[Seed Providerの設定](https://git.k8s.io/examples/cassandra/java/README.md)についてもっと学ぶ。


