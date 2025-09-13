---
title: クラスター内のアプリケーションにアクセスするためにポートフォワーディングを使用する
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
---

<!-- overview -->

このページでは、`kubectl port-forward`を使用して、Kubernetesクラスター内で実行中のMongoDBサーバーに接続する方法について説明します。
この種の接続は、データベースのデバッグに役立ちます。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* [MongoDB Shell](https://www.mongodb.com/try/download/shell)をインストールする。

<!-- steps -->

## MongoDBのDeploymentとServiceを作成する

1. MongoDBを実行するDeploymentを作成する:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-deployment.yaml
   ```

   正常にコマンドが実行されると、Deploymentが作成されたことを示す出力が表示されます:

   ```
   deployment.apps/mongo created
   ```

   Podのステータスを表示して、準備完了であることを確認します:

   ```shell
   kubectl get pods
   ```

   出力には作成されたPodが表示されます:

   ```
   NAME                     READY   STATUS    RESTARTS   AGE
   mongo-75f59d57f4-4nd6q   1/1     Running   0          2m4s
   ```

   Deploymentのステータスを表示します:

   ```shell
   kubectl get deployment
   ```

   出力には、Deploymentが作成されたことが表示されます:

   ```
   NAME    READY   UP-TO-DATE   AVAILABLE   AGE
   mongo   1/1     1            1           2m21s
   ```

   Deploymentは自動的にReplicaSetを管理します。
   ReplicaSetのステータスを表示するには、次のコマンドを使用します:

   ```shell
   kubectl get replicaset
   ```

   出力には、ReplicaSetが作成されたことが表示されます:

   ```
   NAME               DESIRED   CURRENT   READY   AGE
   mongo-75f59d57f4   1         1         1       3m12s
   ```

2. ネットワーク上にMongoDBを公開するためのServiceを作成します:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-service.yaml
   ```

   正常にコマンドが実行されると、Serviceが作成されたことを示す出力が表示されます:

   ```
   service/mongo created
   ```

   Serviceが作成されたことを確認します:

   ```shell
   kubectl get service mongo
   ```

   出力には、Serviceが作成されたことが表示されます:

   ```
   NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
   mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
   ```

3. MongoDBサーバーがPod内で実行中であり、27017番ポートでリッスンしていることを確認します:

   ```shell
   # mongo-75f59d57f4-4nd6qをPod名に置き換えてください
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```

   出力には、そのPod内のMongoDBのポートが表示されます:

   ```
    27017
   ```

   27017は、MongoDBの公式なTCPポートです。

## ローカルポートをPodのポートにフォワードする

1. `kubectl port-forward`では、Pod名などのリソース名を指定して、ポートフォワードの対象となるPodを選択できます。

   ```shell
   # mongo-75f59d57f4-4nd6qを実際のPod名に置き換えてください
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```

   これは、次のコマンドと同じ意味になります。

   ```shell
   kubectl port-forward pods/mongo-75f59d57f4-4nd6q 28015:27017
   ```

   または、

   ```shell
   kubectl port-forward deployment/mongo 28015:27017
   ```

   または、

   ```shell
   kubectl port-forward replicaset/mongo-75f59d57f4 28015:27017
   ```

   または、

   ```shell
   kubectl port-forward service/mongo 28015:27017
   ```

   上記のいずれのコマンドも有効です。出力は次のようになります:

   ```
   Forwarding from 127.0.0.1:28015 -> 27017
   Forwarding from [::1]:28015 -> 27017
   ```

   {{< note >}}
   `kubectl port-forward`は終了せずに待機状態のままとなります。演習を続けるには、別のターミナルを開く必要があります。
   {{< /note >}}

2. MongoDBのコマンドラインインターフェースを起動します:

   ```shell
   mongosh --port 28015
   ```

3. MongoDBのコマンドラインプロンプトで、`ping`コマンドを入力します:

   ```
   db.runCommand( { ping: 1 } )
   ```

   pingリクエストが成功すると、次のような結果が返されます:

   ```
   { ok: 1 }
   ```

### オプションで _kubectl_ にローカルポートを自動割り当てさせる {#let-kubectl-choose-local-port}

特定のローカルポートを指定する必要がない場合は、`kubectl`にローカルポートの割り当てを任せることができます。
これにより、ローカルポートの競合を管理する必要がなくなり、構文もやや簡潔になります:

```shell
kubectl port-forward deployment/mongo :27017
```

`kubectl`ツールは、使用されていないローカルポート番号を見つけて割り当てます(他のアプリケーションで使用されている可能性があるため、低いポート番号は避けられます)。
出力は次のようになります:

```
Forwarding from 127.0.0.1:63753 -> 27017
Forwarding from [::1]:63753 -> 27017
```

<!-- discussion -->

## 解説

ローカルの28015番ポートへの接続は、MongoDBサーバーを実行しているPodの27017番ポートにフォワードされます。
この接続が確立されていれば、ローカルのワークステーションから、Pod内で実行中のデータベースのデバッグを行うことができます。

{{< note >}}
`kubectl port-forward`はTCPポートのみに対応しています。
UDPプロトコルのサポートについては、[Issue 47862](https://github.com/kubernetes/kubernetes/issues/47862)で追跡されています。
{{< /note >}}

## {{% heading "whatsnext" %}}

[kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward)について詳しくは、こちらを参照してください。