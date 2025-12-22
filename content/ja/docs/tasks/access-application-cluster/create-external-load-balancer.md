---
title: 外部ロードバランサーを作成する
content_type: task
weight: 80
---

<!-- overview -->

このページでは、外部ロードバランサーを作成する方法について説明します。

{{< glossary_tooltip text="Service" term_id="service" >}}を作成する際に、クラウドロードバランサーを自動的に作成するオプションがあります。
これにより、外部からアクセス可能なIPアドレスが割り当てられ、そのIPからのトラフィックがクラスター内のノード上の正しいポートへと送信されます。
_ただし、クラスターが対応する環境で実行されており、適切なクラウドロードバランサープロバイダーのパッケージが構成されている必要があります_。

Serviceの代わりに、{{< glossary_tooltip term_id="ingress" >}}を使用することもできます。
詳細については、[Ingress](/docs/concepts/services-networking/ingress/)のドキュメントを参照してください。

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

クラスターは、外部ロードバランサーの構成をサポートするクラウド環境、またはそれに相当する他の環境上で実行されている必要があります。

<!-- steps -->

## Serviceを作成する

### マニフェストからServiceを作成する

外部ロードバランサーを作成するには、Serviceのマニフェストに次の行を追加します:

```yaml
    type: LoadBalancer
```

マニフェストは次のようになります:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - port: 8765
      targetPort: 9376
  type: LoadBalancer
```

### kubectlを使用してServiceを作成する

代わりに、`kubectl expose`コマンドとその`--type=LoadBalancer`フラグを使用してServiceを作成することも可能です:

```bash
kubectl expose deployment example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer
```

このコマンドは、参照されているリソース(上記の例では`example`という名前の{{< glossary_tooltip text="Deployment" term_id="deployment" >}})と同じセレクターを使用して、新しいServiceを作成します。

オプションのフラグを含む詳細については、[`kubectl expose`のリファレンス](/docs/reference/generated/kubectl/kubectl-commands/#expose)を参照してください。

## IPアドレスの確認

`kubectl`を使用してサービスの情報を取得することで、そのサービスに割り当てられたIPアドレスを確認できます:

```bash
kubectl describe services example-service
```

このコマンドの出力は次のようになります:

```
Name:                     example-service
Namespace:                default
Labels:                   app=example
Annotations:              <none>
Selector:                 app=example
Type:                     LoadBalancer
IP Families:              <none>
IP:                       10.3.22.96
IPs:                      10.3.22.96
LoadBalancer Ingress:     192.0.2.89
Port:                     <unset>  8765/TCP
TargetPort:               9376/TCP
NodePort:                 <unset>  30593/TCP
Endpoints:                172.17.0.3:9376
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

ロードバランサーのIPアドレスは、`LoadBalancer Ingress`の横に表示されます。

{{< note >}}
Minikube上でサービスを実行している場合は、割り当てられたIPアドレスとポートを、次のコマンドで確認できます:

```bash
minikube service example-service --url
```
{{< /note >}}

## クライアントの送信元IPアドレスを保持する

デフォルトでは、ターゲットコンテナから見える送信元IPは、クライアントの*元の送信元IPアドレスではありません*。
クライアントIPの保持を有効にするには、Serviceの`.spec`内で次のフィールドを設定する必要があります:

* `.spec.externalTrafficPolicy` - このServiceが外部トラフィックをノードローカルのエンドポイントにルーティングするか、クラスター全体のエンドポイントにルーティングするかを指定します。指定可能な値は`Cluster`(デフォルト)と`Local`の2つです。`Cluster`を指定するとクライアントの送信元IPは隠蔽され、他のノードへの2回目のホップが発生する可能性がありますが、全体的な負荷分散は良好になります。`Local`を指定するとクライアントの送信元IPが保持され、LoadBalancer型およびNodePort型Serviceにおいて2回目のホップを回避できますが、トラフィックの分散が偏るリスクがあります。
* `.spec.healthCheckNodePort` - サービスのヘルスチェック用ノードポート(数値のポート番号)を指定します。`healthCheckNodePort`を指定しない場合、サービスコントローラーがクラスターのNodePortレンジから自動的にポートを割り当てます。
このポートレンジは、APIサーバーのコマンドラインオプション`--service-node-port-range`で設定できます。Serviceの`type`がLoadBalancerで、`externalTrafficPolicy`が`Local`に設定されている場合に限り、指定した`healthCheckNodePort`の値が使用されます。

Serviceのマニフェストで`externalTrafficPolicy`をLocalに設定することで、この機能が有効になります。
たとえば、次のように指定します:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - port: 8765
      targetPort: 9376
  externalTrafficPolicy: Local
  type: LoadBalancer
```

### 送信元IPアドレスを保持する際の注意点と制限事項

一部のクラウドプロバイダーが提供するロードバランサーサービスでは、各ターゲットに対して異なる重みを設定することができません。

各ターゲットがノードへのトラフィック送信において等しく重み付けされているため、外部トラフィックは異なるPod間で均等に負荷分散されません。外部ロードバランサーは、ターゲットとして使用される各ノード上のPod数を認識していません。

`NumServicePods << NumNodes`または`NumServicePods >> NumNodes`の場合、重み付けがなくても、かなり均等に近い分散が見られます。

Pod間の内部トラフィックは、すべてのPodに対して等しい確率で、ClusterIPサービスと同様の動作をするはずです。

## ロードバランサーのガベージコレクション

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

通常、LoadBalancer型Serviceが削除されると、それに関連付けられたクラウドプロバイダー上のロードバランサーリソースも速やかにクリーンアップされるはずです。
しかし、Serviceの削除後に関連するクラウドリソースが孤立状態になるさまざまなコーナーケースが知られています。
これを防ぐために、「Service LoadBalancerのFinalizer保護」が導入されました。
Finalizerを使用することで、対応するロードバランサーリソースが削除されるまでは、Serviceリソース自体も削除されなくなります。

具体的には、`type`がLoadBalancerであるServiceには、`service.kubernetes.io/load-balancer-cleanup`という名前のFinalizerがサービスコントローラーによって付与されます。
このFinalizerは、ロードバランサーリソースがクリーンアップされるまで削除されません。
これにより、たとえばサービスコントローラーがクラッシュするようなコーナーケースにおいても、ロードバランサーリソースが取り残されるのを防ぐことができます。

## 外部ロードバランサープロバイダー

この機能のデータパスは、Kubernetesクラスター外部のロードバランサーによって提供されることに注意が必要です。

Serviceの`type`がLoadBalancerに設定されている場合、Kubernetesはクラスター内のPodに対しては`type`がClusterIPに相当する機能を提供し、さらに(Kubernetesの外部にある)ロードバランサーに、該当するPodをホストしているノードの情報を登録することで、この機能を拡張します。
Kubernetesのコントロールプレーンは、外部ロードバランサーの作成、必要に応じたヘルスチェックやパケットフィルタリングルールの設定を自動で行います。
クラウドプロバイダーによってロードバランサーのIPアドレスが割り当てられると、コントロールプレーンはその外部IPアドレスを取得し、Serviceオブジェクトに反映します。

## {{% heading "whatsnext" %}}

* [アプリケーションをServiceに接続する](/docs/tutorials/services/connect-applications-service/)チュートリアルを参照してください
* [Service](/docs/concepts/services-networking/service/)について読む
* [Ingress](/docs/concepts/services-networking/ingress/)について読む
