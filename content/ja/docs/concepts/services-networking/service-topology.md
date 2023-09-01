---
title: Serviceトポロジー
feature:
  title: Serviceトポロジー
  description: >
    Serviceのトラフィックをクラスタートポロジーに基づいてルーティングします。
content_type: concept
weight: 150
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

{{< note >}}
この機能、特にアルファ版の`topologyKeys`APIは、Kubernetes v1.21以降では非推奨です。Kubernetes v1.21で導入された、[トポロジーを意識したルーティング](/ja/docs/concepts/services-networking/topology-aware-routing/)が同様の機能を提供します。
{{</ note >}}

*Serviceトポロジー*を利用すると、Serviceのトラフィックをクラスターのノードトポロジーに基づいてルーティングできるようになります。たとえば、あるServiceのトラフィックに対して、できるだけ同じノードや同じアベイラビリティゾーン上にあるエンドポイントを優先してルーティングするように指定できます。

<!-- body -->

## はじめに

デフォルトでは、`ClusterIP`や`NodePort`Serviceに送信されたトラフィックは、Serviceに対応する任意のバックエンドのアドレスにルーティングされる可能性があります。しかし、Kubernetes 1.7以降では、「外部の」トラフィックをそのトラフィックを受信したノード上のPodにルーティングすることが可能になりました。しかし、この機能は`ClusterIP`Serviceでは対応しておらず、ゾーン内ルーティングなどのより複雑なトポロジーは実現不可能でした。*Serviceトポロジー*の機能を利用すれば、Serviceの作者が送信元ノードと送信先ノードのNodeのラベルに基づいてトラフィックをルーティングするためのポリシーを定義できるようになるため、この問題を解決できます。

送信元と送信先の間のNodeラベルのマッチングを使用することにより、オペレーターは、そのオペレーターの要件に適したメトリクスを使用して、お互いに「より近い」または「より遠い」ノードのグループを指定できます。たとえば、パブリッククラウド上のさまざまなオペレーターでは、Serviceのトラフィックを同一ゾーン内に留めようとする傾向があります。パブリッククラウドでは、ゾーンをまたぐトラフィックでは関連するコストがかかる一方、ゾーン内のトラフィックにはコストがかからない場合があるからです。その他のニーズとしては、DaemonSetが管理するローカルのPodにトラフィックをルーティングできるようにしたり、レイテンシーを低く抑えるために同じラック上のスイッチに接続されたノードにトラフィックを限定したいというものがあります。

## Serviceトポロジーを利用する

クラスターのServiceトポロジーが有効になっていれば、Serviceのspecに`topologyKeys`フィールドを指定することで、Serviceのトラフィックのルーティングを制御できます。このフィールドは、Nodeラベルの優先順位リストで、このServiceにアクセスするときにエンドポイントをソートするために使われます。トラフィックは、最初のラベルの値が送信元Nodeのものと一致するNodeに送信されます。一致したノード上にServiceに対応するバックエンドが存在しなかった場合は、2つ目のラベルについて検討が行われ、同様に、残っているラベルが順番に検討されまます。

一致するキーが1つも見つからなかった場合、トラフィックは、Serviceに対応するバックエンドが存在しなかったかのように拒否されます。言い換えると、エンドポイントは、利用可能なバックエンドが存在する最初のトポロジーキーに基づいて選択されます。このフィールドが指定され、すべてのエントリーでクライアントのトポロジーに一致するバックエンドが存在しない場合、そのクライアントに対するバックエンドが存在しないものとしてコネクションが失敗します。「任意のトポロジー」を意味する特別な値`"*"`を指定することもできます。任意の値にマッチするこの値に意味があるのは、リストの最後の値として使った場合だけです。

`topologyKeys`が未指定または空の場合、トポロジーの制約は適用されません。

ホスト名、ゾーン名、リージョン名のラベルが付いたNodeを持つクラスターについて考えてみましょう。このとき、Serviceの`topologyKeys`の値を設定することで、トラフィックの向きを以下のように制御できます。

* トラフィックを同じノード上のエンドポイントのみに向け、同じノード上にエンドポイントが1つも存在しない場合には失敗するようにする: `["kubernetes.io/hostname"]`。
* 同一ノード上のエンドポイントを優先し、失敗した場合には同一ゾーン上のエンドポイント、同一リージョンゾーンのエンドポイントへとフォールバックし、それ以外の場合には失敗する: `["kubernetes.io/hostname", "topology.kubernetes.io/zone", "topology.kubernetes.io/region"]`。これは、たとえばデータのローカリティが非常に重要である場合などに役に立ちます。
* 同一ゾーンを優先しますが、ゾーン内に利用可能なノードが存在しない場合は、利用可能な任意のエンドポイントにフォールバックする: `["topology.kubernetes.io/zone", "*"]`。

## 制約

* Serviceトポロジーは`externalTrafficPolicy=Local`と互換性がないため、Serviceは2つの機能を同時に利用できません。2つの機能を同じクラスター上の異なるServiceでそれぞれ利用することは可能ですが、同一のService上では利用できません。

* 有効なトポロジーキーは、現在は`kubernetes.io/hostname`、`topology.kubernetes.io/zone`、および`topology.kubernetes.io/region`に限定されています。しかし、将来は一般化され、他のノードラベルも使用できるようになる予定です。

* トポロジーキーは有効なラベルのキーでなければならず、最大で16個のキーまで指定できます。

* すべての値をキャッチする`"*"`を使用する場合は、トポロジーキーの最後の値として指定しなければなりません。

## 例

以下では、Serviceトポロジーの機能を利用したよくある例を紹介します。

### ノードローカルのエンドポイントだけを使用する

ノードローカルのエンドポイントのみにルーティングするServiceの例です。もし同一ノード上にエンドポイントが存在しない場合、トラフィックは損失します。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
```

### ノードローカルのエンドポイントを優先して使用する

ノードローカルのエンドポイントを優先して使用しますが、ノードローカルのエンドポイントが存在しない場合にはクラスター全体のエンドポイントにフォールバックするServiceの例です。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
    - "*"
```


### 同一ゾーンや同一リージョンのエンドポイントだけを使用する

同一リージョンのエンドポイントより同一ゾーンのエンドポイントを優先するServiceの例です。もしいずれのエンドポイントも存在しない場合、トラフィックは損失します。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "topology.kubernetes.io/zone"
    - "topology.kubernetes.io/region"
```

### ノードローカル、同一ゾーン、同一リーションのエンドポイントを優先して使用する

ノードローカル、同一ゾーン、同一リージョンのエンドポイントを順番に優先し、クラスター全体のエンドポイントにフォールバックするServiceの例です。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
    - "topology.kubernetes.io/zone"
    - "topology.kubernetes.io/region"
    - "*"
```

## {{% heading "whatsnext" %}}

* [トポロジーを意識したヒント](/ja/docs/concepts/services-networking/topology-aware-hints/)を読む。
* [サービスとアプリケーションの接続](/ja/docs/tutorials/services/connect-applications-service/)を読む。

