---
title: 送信元IPを使用する
content_type: tutorial
min-kubernetes-server-version: v1.5
weight: 40
---

<!-- overview -->

Kubernetesクラスター内で実行されているアプリケーションは、Serviceという抽象化を経由して、他のアプリケーションや外の世界との発見や通信を行います。このドキュメントでは、異なる種類のServiceに送られたパケットの送信元IPに何が起こるのか、そして必要に応じてこの振る舞いを切り替える方法について説明します。

## {{% heading "prerequisites" %}}

### 用語

このドキュメントでは、以下の用語を使用します。

{{< comment >}}
If localizing this section, link to the equivalent Wikipedia pages for
the target localization.
{{< /comment >}}

[NAT](https://ja.wikipedia.org/wiki/%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E5%A4%89%E6%8F%9B)
: ネットワークアドレス変換(network address translation)

[送信元NAT](https://en.wikipedia.org/wiki/Network_address_translation#SNAT)
: パケットの送信元のIPを置換します。このページでは、通常ノードのIPアドレスを置換することを意味します。

[送信先NAT](https://en.wikipedia.org/wiki/Network_address_translation#DNAT)
: パケットの送信先のIPを置換します。このページでは、通常{{< glossary_tooltip term_id="pod" >}}のIPアドレスを置換することを意味します。

[VIP](/ja/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: Kubernetes内のすべての{{< glossary_tooltip text="Service" term_id="service" >}}などに割り当てられる仮想IPアドレス(virtual IP address)です。

[kube-proxy](/ja/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: すべてのノード上でServiceのVIPを管理するネットワークデーモンです。

### 前提条件

{{< include "task-tutorial-prereqs.md" >}}

以下の例では、HTTPヘッダー経由で受け取ったリクエストの送信元IPをエコーバックする、小さなnginxウェブサーバーを使用します。次のコマンドでウェブサーバーを作成できます。

```shell
kubectl create deployment source-ip-app --image=registry.k8s.io/echoserver:1.4
```

出力は次のようになります。

```
deployment.apps/source-ip-app created
```

## {{% heading "objectives" %}}

* 単純なアプリケーションを様々な種類のService経由で公開する
* それぞれの種類のServiceがどのように送信元IPのNATを扱うかを理解する
* 送信元IPを保持することに関わるトレードオフを理解する

<!-- lessoncontent -->

## `Type=ClusterIP`を使用したServiceでの送信元IP

kube-proxyが[iptablesモード](/ja/docs/concepts/services-networking/service/#proxy-mode-iptables)(デフォルト)で実行されている場合、クラスター内部からClusterIPに送られたパケットに送信元のNATが行われることは決してありません。kube-proxyが実行されているノード上で`http://localhost:10249/proxyMode`にリクエストを送って、kube-proxyのモードを問い合わせてみましょう。

```console
kubectl get nodes
```

出力は次のようになります。

```
NAME                           STATUS     ROLES    AGE     VERSION
kubernetes-node-6jst   Ready      <none>   2h      v1.13.0
kubernetes-node-cx31   Ready      <none>   2h      v1.13.0
kubernetes-node-jj1t   Ready      <none>   2h      v1.13.0
```

これらのノードの1つでproxyモードを取得します(kube-proxyはポート10249をlistenしています)。

```shell
# このコマンドは、問い合わせを行いたいノード上のシェルで実行してください。
curl http://localhost:10249/proxyMode
```

出力は次のようになります。

```
iptables
```

source IPアプリのServiceを作成することで、送信元IPが保持されているかテストできます。

```shell
kubectl expose deployment source-ip-app --name=clusterip --port=80 --target-port=8080
```

出力は次のようになります。

```
service/clusterip exposed
```
```shell
kubectl get svc clusterip
```

出力は次のようになります。

```
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
clusterip    ClusterIP   10.0.170.92   <none>        80/TCP    51s
```

そして、同じクラスター上のPodから`ClusterIP`にアクセスします。

```shell
kubectl run busybox -it --image=busybox --restart=Never --rm
```

出力は次のようになります。

```
Waiting for pod default/busybox to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

```

これで、Podの内部でコマンドが実行できます。

```shell
# このコマンドは、"kubectl run" のターミナルの内部で実行してください
ip addr
```
```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1460 qdisc noqueue
    link/ether 0a:58:0a:f4:03:08 brd ff:ff:ff:ff:ff:ff
    inet 10.244.3.8/24 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::188a:84ff:feb0:26a5/64 scope link
       valid_lft forever preferred_lft forever
```

そして、`wget`を使用してローカルのウェブサーバーに問い合わせます。

```shell
# "10.0.170.92" の部分をService名が"clusterip"のIPv4アドレスに置き換えてください
wget -qO - 10.0.170.92
```
```
CLIENT VALUES:
client_address=10.244.3.8
command=GET
...
```

`client_address`は常にクライアントのPodのIPアドレスになります。これは、クライアントのPodとサーバーのPodが同じノード内にあっても異なるノードにあっても変わりません。

## `Type=NodePort`を使用したServiceでの送信元IP

[`Type=NodePort`](/ja/docs/concepts/services-networking/service/#nodeport)を使用したServiceに送られたパケットは、デフォルトで送信元のNATが行われます。`NodePort` Serviceを作ることでテストできます。

```shell
kubectl expose deployment source-ip-app --name=nodeport --port=80 --target-port=8080 --type=NodePort
```

出力は次のようになります。

```
service/nodeport exposed
```

```shell
NODEPORT=$(kubectl get -o jsonpath="{.spec.ports[0].nodePort}" services nodeport)
NODES=$(kubectl get nodes -o jsonpath='{ $.items[*].status.addresses[?(@.type=="InternalIP")].address }')
```

クラウドプロバイダーで実行する場合、上に示した`nodes:nodeport`に対してファイアウォールのルールを作成する必要があるかもしれません。それでは、上で割り当てたノードポート経由で、クラスターの外部からServiceにアクセスしてみましょう。

```shell
for node in $NODES; do curl -s $node:$NODEPORT | grep -i client_address; done
```

出力は次のようになります。

```
client_address=10.180.1.1
client_address=10.240.0.5
client_address=10.240.0.3
```

これらは正しいクライアントIPではなく、クラスターのinternal IPであることがわかります。ここでは、次のようなことが起こっています。

* クライアントがパケットを`node2:nodePort`に送信する
* `node2`は、パケット内の送信元IPアドレスを自ノードのIPアドレスに置換する(SNAT)
* `node2`は、パケット内の送信先IPアドレスをPodのIPアドレスに置換する
* パケットはnode1にルーティングされ、endpointにルーティングされる
* Podからの応答がnode2にルーティングされて戻ってくる
* Podからの応答がクライアントに送り返される

図で表すと次のようになります。

{{< mermaid >}}
graph LR;
  client(client)-->node2[Node 2];
  node2-->client;
  node2-. SNAT .->node1[Node 1];
  node1-. SNAT .->node2;
  node1-->endpoint(Endpoint);

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  class node1,node2,endpoint k8s;
  class client plain;
{{</ mermaid >}}

クライアントのIPが失われることを回避するために、Kubernetesには[クライアントの送信元IPを保持する](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)機能があります。`service.spec.externalTrafficPolicy`の値を`Local`に設定すると、kube-proxyはローカルに存在するエンドポイントへのプロキシリクエストだけをプロキシし、他のノードへはトラフィックを転送しなくなります。このアプローチでは、オリジナルの送信元IPアドレスが保持されます。ローカルにエンドポイントが存在しない場合には、そのノードに送信されたパケットは損失します。そのため、エンドポイントに到達するパケットに適用する可能性のあるパケット処理ルールでは、送信元IPが正しいことを信頼できます。

次のようにして`service.spec.externalTrafficPolicy`フィールドを設定します。

```shell
kubectl patch svc nodeport -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

出力は次のようになります。

```
service/nodeport patched
```

そして、再度テストしてみます。

```shell
for node in $NODES; do curl --connect-timeout 1 -s $node:$NODEPORT | grep -i client_address; done
```

出力は次のようになります。

```
client_address=198.51.100.79
```

今度は、*正しい*クライアントIPが含まれる応答が1つだけ得られました。これは、エンドポイントのPodが実行されているノードから来たものです。

ここでは、次のようなことが起こっています。

* クライアントがパケットをエンドポイントが存在しない`node2:nodePort`に送信する
* パケットが損失する
* クライアントがパケットをエンドポイントが*存在する*`node1:nodePort`に送信する
* node1は、正しい送信元IPを持つパケットをエンドポイントにルーティングする

図で表すと次のようになります。

{{< mermaid >}}
graph TD;
  client --> node1[Node 1];
  client(client) --x node2[Node 2];
  node1 --> endpoint(endpoint);
  endpoint --> node1;

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  class node1,node2,endpoint k8s;
  class client plain;
{{</ mermaid >}}



## `Type=LoadBalancer`を使用したServiceでの送信元IP

[`Type=LoadBalancer`](/ja/docs/concepts/services-networking/service/#loadbalancer)を使用したServiceに送られたパケットは、デフォルトで送信元のNATが行われます。`Ready`状態にあるすべてのスケジュール可能なKubernetesのNodeは、ロードバランサーからのトラフィックを受付可能であるためです。そのため、エンドポイントが存在しないノードにパケットが到達した場合、システムはエンドポイントが*存在する*ノードにパケットをプロシキーします。このとき、(前のセクションで説明したように)パケットの送信元IPがノードのIPに置換されます。

ロードバランサー経由でsource-ip-appを公開することで、これをテストできます。

```shell
kubectl expose deployment source-ip-app --name=loadbalancer --port=80 --target-port=8080 --type=LoadBalancer
```

出力は次のようになります。

```
service/loadbalancer exposed
```

ServiceのIPアドレスを表示します。

```console
kubectl get svc loadbalancer
```

出力は次のようになります。

```
NAME           TYPE           CLUSTER-IP    EXTERNAL-IP       PORT(S)   AGE
loadbalancer   LoadBalancer   10.0.65.118   203.0.113.140     80/TCP    5m
```

次に、Serviceのexternal-ipにリクエストを送信します。

```shell
curl 203.0.113.140
```

出力は次のようになります。

```
CLIENT VALUES:
client_address=10.240.0.5
...
```

しかし、Google Kubernetes EngineやGCE上で実行している場合、同じ`service.spec.externalTrafficPolicy`フィールドを`Local`に設定すると、ロードバランサーからのトラフィックを受け付け可能なノードのリストから、Serviceエンドポイントが*存在しない*ノードが強制的に削除されます。この動作は、ヘルスチェックを意図的に失敗させることによって実現されています。

図で表すと次のようになります。

![Source IP with externalTrafficPolicy](/images/docs/sourceip-externaltrafficpolicy.svg)

アノテーションを設定することで動作をテストできます。

```shell
kubectl patch svc loadbalancer -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

Kubernetesにより割り当てられた`service.spec.healthCheckNodePort`フィールドをすぐに確認します。

```shell
kubectl get svc loadbalancer -o yaml | grep -i healthCheckNodePort
```

出力は次のようになります。

```yaml
  healthCheckNodePort: 32122
```

`service.spec.healthCheckNodePort`フィールドは、`/healthz`でhealth checkを配信しているすべてのノード上のポートを指しています。次のコマンドでテストできます。

```shell
kubectl get pod -o wide -l run=source-ip-app
```

出力は次のようになります。

```
NAME                            READY     STATUS    RESTARTS   AGE       IP             NODE
source-ip-app-826191075-qehz4   1/1       Running   0          20h       10.180.1.136   kubernetes-node-6jst
```

`curl`を使用して、さまざまなノード上の`/healthz`エンドポイントからデータを取得します。

```shell
# このコマンドは選んだノードのローカル上で実行してください
curl localhost:32122/healthz
```
```
1 Service Endpoints found
```

ノードが異なると、得られる結果も異なる可能性があります。

```shell
# このコマンドは、選んだノード上でローカルに実行してください
curl localhost:32122/healthz
```
```
No Service Endpoints Found
```

{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}上で実行中のコントローラーは、クラウドのロードバランサーを割り当てる責任があります。同じコントローラーは、各ノード上のポートやパスを指すHTTPのヘルスチェックも割り当てます。エンドポイントが存在しない2つのノードがヘルスチェックに失敗するまで約10秒待った後、`curl`を使用してロードバランサーのIPv4アドレスに問い合わせます。

```shell
curl 203.0.113.140
```

出力は次のようになります。

```
CLIENT VALUES:
client_address=198.51.100.79
...
```

## クロスプラットフォームのサポート

`Type=LoadBalancer`を使用したServiceで送信元IPを保持する機能を提供しているのは一部のクラウドプロバイダだけです。実行しているクラウドプロバイダによっては、以下のように異なる方法でリクエストを満たす場合があります。

1. クライアントとのコネクションをプロキシが終端し、ノードやエンドポイントとの接続には新しいコネクションが開かれる。このような場合、送信元IPは常にクラウドのロードバランサーのものになり、クライアントのIPにはなりません。

2. クライアントからロードバランサーのVIPに送信されたリクエストが、中間のプロキシではなく、クライアントの送信元IPとともにノードまで到達するようなパケット転送が使用される。

1つめのカテゴリーのロードバランサーの場合、真のクライアントIPと通信するために、 HTTPの[Forwarded](https://tools.ietf.org/html/rfc7239#section-5.2)ヘッダーや[X-FORWARDED-FOR](https://ja.wikipedia.org/wiki/X-Forwarded-For)ヘッダー、[proxy protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)などの、ロードバランサーとバックエンドの間で合意されたプロトコルを使用する必要があります。2つ目のカテゴリーのロードバランサーの場合、Serviceの`service.spec.healthCheckNodePort`フィールドに保存されたポートを指すHTTPのヘルスチェックを作成することで、上記の機能を活用できます。

## {{% heading "cleanup" %}}

Serviceを削除します。

```shell
kubectl delete svc -l app=source-ip-app
```

Deployment、ReplicaSet、Podを削除します。

```shell
kubectl delete deployment source-ip-app
```

## {{% heading "whatsnext" %}}

* [Service経由でアプリケーションに接続する](/ja/docs/concepts/services-networking/connect-applications-service/)方法についてさらに学ぶ。
* [External Load Balancerを作成する](/docs/tasks/access-application-cluster/create-external-load-balancer/)方法について学ぶ。


