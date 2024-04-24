---
title: Serviceを利用したクラスター内のアプリケーションへのアクセス
content_type: tutorial
weight: 60
---

<!-- overview -->

ここでは、クラスター内で稼働しているアプリケーションに外部からアクセスするために、KubernetesのServiceオブジェクトを作成する方法を紹介します。
例として、2つのインスタンスから成るアプリケーションへのロードバランシングを扱います。




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




## {{% heading "objectives" %}}


* 2つのHello Worldアプリケーションを稼働させる。
* Nodeのポートを公開するServiceオブジェクトを作成する。
* 稼働しているアプリケーションにアクセスするためにServiceオブジェクトを使用する。




<!-- lessoncontent -->

## 2つのPodから成るアプリケーションのServiceを作成

アプリケーションDeploymentの設定ファイルは以下の通りです:

{{% codenew file="service/access/hello-application.yaml" %}}

1. クラスターでHello Worldアプリケーションを稼働させます:
   上記のファイルを使用し、アプリケーションのDeploymentを作成します:
   ```shell
   kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml
   ```
    このコマンドは{{< glossary_tooltip text="Deployment" term_id="deployment" >}}オブジェクトとそれに紐付く{{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}オブジェクトを作成します。ReplicaSetは、Hello Worldアプリケーションが稼働している2つの{{< glossary_tooltip text="Pod" term_id="pod" >}}から構成されます。

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
[service configuration file](/ja/docs/concepts/services-networking/service/)
を使用してServiceを作成することもできます。




## {{% heading "cleanup" %}}


Serviceを削除するには、以下のコマンドを実行します:

    kubectl delete services example-service

Hello Worldアプリケーションが稼働しているDeployment、ReplicaSet、Podを削除するには、以下のコマンドを実行します:

    kubectl delete deployment hello-world




## {{% heading "whatsnext" %}}


詳細は
[serviceを利用してアプリケーションと接続する](/ja/docs/concepts/services-networking/connect-applications-service/)
を確認してください。

