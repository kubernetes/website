---
title: Serviceを使用してフロントエンドをバックエンドに接続する
content_type: tutorial
weight: 70
---

<!-- overview -->

このタスクでは、フロントエンドとバックエンドのマイクロサービスを作成する方法を示します。
バックエンドのマイクロサービスは挨拶です。
フロントエンドとバックエンドは、Kubernetes {{< glossary_tooltip term_id="service" >}}オブジェクトを使用して接続されます。




## {{% heading "objectives" %}}


* {{< glossary_tooltip term_id="deployment" >}}オブジェクトを使用してマイクロサービスを作成および実行します。
* フロントエンドを経由してトラフィックをバックエンドにルーティングします。
* Serviceオブジェクトを使用して、フロントエンドアプリケーションをバックエンドアプリケーションに接続します。




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

このタスクでは[Serviceで外部ロードバランサー](/docs/tasks/access-application-cluster/create-external-load-balancer/)を使用しますが、外部ロードバランサーの使用がサポートされている環境である必要があります。
ご使用の環境がこれをサポートしていない場合は、代わりにタイプ[NodePort](/ja/docs/concepts/services-networking/service/#nodeport)のServiceを使用できます。




<!-- lessoncontent -->

## Deploymentを使用したバックエンドの作成

バックエンドは、単純な挨拶マイクロサービスです。
バックエンドのDeploymentの構成ファイルは次のとおりです:

{{< codenew file="service/access/hello.yaml" >}}

バックエンドのDeploymentを作成します:

```shell
kubectl apply -f https://k8s.io/examples/service/access/hello.yaml
```

バックエンドのDeploymentに関する情報を表示します:

```shell
kubectl describe deployment hello
```

出力はこのようになります:

```
Name:                           hello
Namespace:                      default
CreationTimestamp:              Mon, 24 Oct 2016 14:21:02 -0700
Labels:                         app=hello
                                tier=backend
                                track=stable
Annotations:                    deployment.kubernetes.io/revision=1
Selector:                       app=hello,tier=backend,track=stable
Replicas:                       7 desired | 7 updated | 7 total | 7 available | 0 unavailable
StrategyType:                   RollingUpdate
MinReadySeconds:                0
RollingUpdateStrategy:          1 max unavailable, 1 max surge
Pod Template:
  Labels:       app=hello
                tier=backend
                track=stable
  Containers:
   hello:
    Image:              "gcr.io/google-samples/hello-go-gke:1.0"
    Port:               80/TCP
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
OldReplicaSets:                 <none>
NewReplicaSet:                  hello-3621623197 (7/7 replicas created)
Events:
...
```

## バックエンドServiceオブジェクトの作成

フロントエンドをバックエンドに接続する鍵は、バックエンドServiceです。
Serviceは、バックエンドマイクロサービスに常に到達できるように、永続的なIPアドレスとDNS名のエントリを作成します。
Serviceは{{< glossary_tooltip text="セレクター" term_id="selector" >}}を使用して、トラフィックをルーティングするPodを見つけます。

まず、Service構成ファイルを調べます:

{{< codenew file="service/access/hello-service.yaml" >}}

設定ファイルで、Serviceが`app：hello`および`tier：backend`というラベルを持つPodにトラフィックをルーティングしていることがわかります。

`hello` Serviceを作成します:

```shell
kubectl apply -f https://k8s.io/examples/service/access/hello-service.yaml
```

この時点で、バックエンドのDeploymentが実行され、そちらにトラフィックをルーティングできるServiceがあります。

## フロントエンドの作成

バックエンドができたので、バックエンドに接続するフロントエンドを作成できます。
フロントエンドは、バックエンドServiceに指定されたDNS名を使用して、バックエンドワーカーPodに接続します。
DNS名は`hello`です。これは、前のサービス設定ファイルの`name`フィールドの値です。

フロントエンドDeploymentのPodは、helloバックエンドServiceを見つけるように構成されたnginxイメージを実行します。
これはnginx設定ファイルです:

{{< codenew file="service/access/frontend.conf" >}}

バックエンドと同様に、フロントエンドにはDeploymentとServiceがあります。
Serviceの設定には`type：LoadBalancer`があります。これは、Serviceがクラウドプロバイダーのデフォルトのロードバランサーを使用することを意味します。

{{< codenew file="service/access/frontend.yaml" >}}

フロントエンドのDeploymentとServiceを作成します:

```shell
kubectl apply -f https://k8s.io/examples/service/access/frontend.yaml
```

出力結果から両方のリソースが作成されたことを確認します:

```
deployment.apps/frontend created
service/frontend created
```

{{< note >}}
nginxの構成は、[コンテナイメージ](/examples/service/access/Dockerfile)に焼き付けられます。
これを行うためのより良い方法は、[ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)を使用して、構成をより簡単に変更できるようにすることです。
{{< /note >}}

## フロントエンドServiceと対話

LoadBalancerタイプのServiceを作成したら、このコマンドを使用して外部IPを見つけることができます:

```shell
kubectl get service frontend --watch
```

これにより`frontend` Serviceの設定が表示され、変更が監視されます。
最初、外部IPは`<pending>`としてリストされます:

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   <pending>     80/TCP   10s
```

ただし、外部IPがプロビジョニングされるとすぐに、`EXTERNAL-IP`という見出しの下に新しいIPが含まれるように構成が更新されます:

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   XXX.XXX.XXX.XXX    80/TCP   1m
```

このIPを使用して、クラスターの外部から`frontend` Serviceとやり取りできるようになりました。

## フロントエンドを介するトラフィック送信

フロントエンドとバックエンドが接続されました。
フロントエンドServiceの外部IPに対してcurlコマンドを使用して、エンドポイントにアクセスできます。

```shell
curl http://${EXTERNAL_IP} # これを前に見たEXTERNAL-IPに置き換えます
```

出力には、バックエンドによって生成されたメッセージが表示されます:

```json
{"message":"Hello"}
```

## {{% heading "cleanup" %}}

Serviceを削除するには、このコマンドを入力してください：

```shell
kubectl delete services frontend hello
```

バックエンドとフロントエンドアプリケーションを実行しているDeploymentとReplicaSetとPodを削除するために、このコマンドを入力してください：

```shell
kubectl delete deployment frontend hello
```

## {{% heading "whatsnext" %}}


* [Service](/ja/docs/concepts/services-networking/service/)の詳細
* [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)の詳細



