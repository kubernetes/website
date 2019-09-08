---
title: Serviceを利用したクラスター内のアプリケーションへのアクセス
content_template: templates/tutorial
weight: 60
---

{{% capture overview %}}

ここでは、クラスター内で稼働しているアプリケーションに外部からアクセスするために、KubernetesのServiceオブジェクトを作成する方法を紹介します。
例として、2つのインスタンスから成るアプリケーションへのロードバランシングを扱います。

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture objectives %}}

* 2つのHellow Worldアプリケーションを稼働させる。
* Nodeのポートを公開するServiceオブジェクトを作成する。
* 稼働しているアプリケーションにアクセスするためにServiceオブジェクトを使用する。

{{% /capture %}}


{{% capture lessoncontent %}}

## 2つのPodから成るアプリケーションのServiceを作成

1. クラスタでHello Worldアプリケーションを稼働させます:
   ```shell
   kubectl run hello-world --replicas=2 --labels="run=load-balancer-example" --image=gcr.io/google-samples/node-hello:1.0  --port=8080
   ```
    このコマンドは
    [Deployment](/docs/concepts/workloads/controllers/deployment/)
    オブジェクトとそれに紐付く
    [ReplicaSet](/ja/docs/concepts/workloads/controllers/replicaset/)
    オブジェクトを作成します。ReplicaSetは、Hello Worldアプリケーションが稼働している2つの
    [Pod](/ja/docs/concepts/workloads/pods/pod/)
    から構成されます。

1. Deploymentの情報を表示します:
   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

1. ReplicaSetオブジェクトの情報を表示します:
   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

1. Deploymentを公開するServiceオブジェクトを作成します:
   ```shell
   kubectl expose deployment hello-world --type=NodePort --name=example-service
   ```

1. Serviceに関する情報を表示します:
   ```shell
   kubectl describe services example-service
   ```
   出力例は以下の通りです:
   ```shell
   Name:                   example-service
   Namespace:              default
   Labels:                 run=load-balancer-example
   Annotations:            <none>
   Selector:               run=load-balancer-example
   Type:                   NodePort
   IP:                     10.32.0.16
   Port:                   <unset> 8080/TCP
   TargetPort:             8080/TCP
   NodePort:               <unset> 31496/TCP
   Endpoints:              10.200.1.4:8080,10.200.2.5:8080
   Session Affinity:       None
   Events:                 <none>
   ```
   NodePortの値を記録しておきます。上記の例では、31496です。

1. Hello Worldアプリーションが稼働しているPodを表示します:
   ```shell
   kubectl get pods --selector="run=load-balancer-example" --output=wide
   ```
   出力例は以下の通りです:
   ```shell
   NAME                           READY   STATUS    ...  IP           NODE
   hello-world-2895499144-bsbk5   1/1     Running   ...  10.200.1.4   worker1
   hello-world-2895499144-m1pwt   1/1     Running   ...  10.200.2.5   worker2
   ```
1. Hello World podが稼働するNodeのうち、いずれか1つのパブリックIPアドレスを確認します。
   確認方法は、使用している環境により異なります。
   例として、Minikubeの場合は`kubectl cluster-info`、Google Compute Engineの場合は`gcloud compute instances list`によって確認できます。

1. 選択したノード上で、NodePortの値でのTCP通信を許可するファイヤーウォールを作成します。
   NodePortの値が31568の場合、31568番のポートを利用したTCP通信を許可するファイヤーウォールを作成します。
   クラウドプロバイダーによって設定方法が異なります。

1. Hello World applicationにアクセスするために、Nodeのアドレスとポート番号を使用します:
   ```shell
   curl http://<public-node-ip>:<node-port>
   ```
   ここで `<public-node-ip>` はNodeのパブリックIPアドレス、
   `<node-port>` はNodePort Serviceのポート番号の値を表しています。
   リクエストが成功すると、下記のメッセージが表示されます:
   ```shell
   Hello Kubernetes!
   ```

## service configuration fileの利用

`kubectl expose`コマンドの代わりに、
[service configuration file](/docs/concepts/services-networking/service/)
を使用してServiceを作成することもできます。

{{% /capture %}}


{{% capture cleanup %}}

Serviceを削除するには、以下のコマンドを実行します:

    kubectl delete services example-service

Hello Worldアプリケーションが稼働しているDeployment、ReplicaSet、Podを削除するには、以下のコマンドを実行します:

    kubectl delete deployment hello-world

{{% /capture %}}


{{% capture whatsnext %}}

詳細は
[serviceを利用してアプリケーションと接続する](/docs/concepts/services-networking/connect-applications-service/)
を確認してください。
{{% /capture %}}
