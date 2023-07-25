---
title: クラスター内のアプリケーションにアクセスするために外部IPアドレスを公開する
content_type: tutorial
weight: 10
---

<!-- overview -->

このページでは、外部IPアドレスを公開するKubernetesのServiceオブジェクトを作成する方法を示します。




## {{% heading "prerequisites" %}}


 * [kubectl](/ja/docs/tasks/tools/install-kubectl/)をインストールしてください。

 * Kubernetesクラスターを作成する際に、Google Kubernetes EngineやAmazon Web Servicesのようなクラウドプロバイダーを使用します。このチュートリアルでは、クラウドプロバイダーを必要とする[外部ロードバランサー](/docs/tasks/access-application-cluster/create-external-load-balancer/)を作成します。

 * Kubernetes APIサーバーと通信するために、`kubectl`を設定してください。手順については、各クラウドプロバイダーのドキュメントを参照してください。




## {{% heading "objectives" %}}


* 5つのインスタンスで実際のアプリケーションを起動します。
* 外部IPアドレスを公開するServiceオブジェクトを作成します。
* 起動中のアプリケーションにアクセスするためにServiceオブジェクトを使用します。




<!-- lessoncontent -->

## 5つのPodで起動しているアプリケーションへのServiceの作成

1. クラスターにてHello Worldアプリケーションを実行してください。

{{< codenew file="service/load-balancer-example.yaml" >}}

```shell
kubectl apply -f https://k8s.io/examples/service/load-balancer-example.yaml
```


上記のコマンドにより、 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}を作成し、{{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}を関連づけます。ReplicaSetには5つの{{< glossary_tooltip text="Pod" term_id="pod" >}}があり、それぞれHello Worldアプリケーションが起動しています。

1. Deploymentに関する情報を表示します:

        kubectl get deployments hello-world
        kubectl describe deployments hello-world

1. ReplicaSetオブジェクトに関する情報を表示します:

        kubectl get replicasets
        kubectl describe replicasets

1. Deploymentを公開するServiceオブジェクトを作成します。

        kubectl expose deployment hello-world --type=LoadBalancer --name=my-service

1. Serviceに関する情報を表示します:

        kubectl get services my-service

    出力は次のようになります:

        NAME         TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)    AGE
        my-service   LoadBalancer   10.3.245.137   104.198.205.71   8080/TCP   54s

    {{< note >}}

    `type=LoadBalancer`のServiceは外部のクラウドプロバイダーによってサポートされており、ここでは扱いません。詳細は[こちらのページ](/ja/docs/concepts/services-networking/service/#loadbalancer)を参照してください。

    {{< /note >}}

    {{< note >}}

    外部IPアドレスが\<pending\>と表示されている場合は、しばらく待ってから同じコマンドを実行してください。

    {{< /note >}}

1. Serviceに関する詳細な情報を表示します:

        kubectl describe services my-service

    出力は次のようになります:

        Name:           my-service
        Namespace:      default
        Labels:         app.kubernetes.io/name=load-balancer-example
        Annotations:    <none>
        Selector:       app.kubernetes.io/name=load-balancer-example
        Type:           LoadBalancer
        IP:             10.3.245.137
        LoadBalancer Ingress:   104.198.205.71
        Port:           <unset> 8080/TCP
        NodePort:       <unset> 32377/TCP
        Endpoints:      10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more...
        Session Affinity:   None
        Events:         <none>

    Serviceによって公開された外部IPアドレス(`LoadBalancer Ingress`)を記録しておいてください。
    この例では、外部IPアドレスは104.198.205.71です。
    また、`Port`および`NodePort`の値も控えてください。
    この例では、`Port`は8080、`NodePort`は32377です。

1. 先ほどの出力にて、Serviceにはいくつかのエンドポイントがあることを確認できます: 10.0.0.6:8080、
   10.0.1.6:8080、10.0.1.7:8080、その他2つです。
   これらはHello Worldアプリケーションが動作しているPodの内部IPアドレスです。
   これらのPodのアドレスを確認するには、次のコマンドを実行します:

        kubectl get pods --output=wide

    出力は次のようになります:

        NAME                         ...  IP         NODE
        hello-world-2895499144-1jaz9 ...  10.0.1.6   gke-cluster-1-default-pool-e0b8d269-1afc
        hello-world-2895499144-2e5uh ...  10.0.1.8   gke-cluster-1-default-pool-e0b8d269-1afc
        hello-world-2895499144-9m4h1 ...  10.0.0.6   gke-cluster-1-default-pool-e0b8d269-5v7a
        hello-world-2895499144-o4z13 ...  10.0.1.7   gke-cluster-1-default-pool-e0b8d269-1afc
        hello-world-2895499144-segjf ...  10.0.2.5   gke-cluster-1-default-pool-e0b8d269-cpuc

1. Hello Worldアプリケーションにアクセスするために、外部IPアドレス(`LoadBalancer Ingress`)を使用します:

        curl http://<external-ip>:<port>

    ここで、`<external-ip>`はServiceの外部IPアドレス(`LoadBalancer Ingress`)で、
    `<port>`はServiceの詳細出力における`Port`です。minikubeを使用している場合、`minikube service my-service`を実行することでHello Worldアプリケーションをブラウザで自動的に
    開かれます。

    正常なリクエストに対するレスポンスは、helloメッセージです:

        Hello Kubernetes!




## {{% heading "cleanup" %}}


Serviceを削除する場合、次のコマンドを実行します:

    kubectl delete services my-service

Deployment、ReplicaSet、およびHello Worldアプリケーションが動作しているPodを削除する場合、次のコマンドを実行します:

    kubectl delete deployment hello-world




## {{% heading "whatsnext" %}}


[connecting applications with services](/docs/concepts/services-networking/connect-applications-service/)にて詳細を学ぶことができます。

