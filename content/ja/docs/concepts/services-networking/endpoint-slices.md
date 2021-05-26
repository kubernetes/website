---
title: EndpointSlice
content_type: concept
weight: 15
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

*EndpointSlice*は、Kubernetesクラスター内にあるネットワークエンドポイントを追跡するための単純な手段を提供します。EndpointSliceは、よりスケーラブルでより拡張可能な、Endpointの代わりとなるものです。

<!-- body -->

## 動機

Endpoints APIはKubernetes内のネットワークエンドポイントを追跡する単純で直観的な手段を提供してきました。残念ながら、KubernetesクラスターやServiceが大規模になるにつれて、Endpoints APIの限界が明らかになってきました。最も顕著な問題の1つに、ネットワークエンドポイントの数が大きくなったときのスケーリングの問題があります。

Serviceのすべてのネットワークエンドポイントが単一のEndpointsリソースに格納されていたため、リソースのサイズが非常に大きくなる場合がありました。これがKubernetesのコンポーネント(特に、マスターコントロールプレーン)の性能に悪影響を与え、結果として、Endpointsに変更があるたびに、大量のネットワークトラフィックと処理が発生するようになってしまいました。EndpointSliceは、この問題を緩和するとともに、トポロジカルルーティングなどの追加機能のための拡張可能なプラットフォームを提供します。

## EndpointSliceリソース {#endpointslice-resource}

Kubernetes内ではEndpointSliceにはネットワークエンドポイントの集合へのリファレンスが含まれます。EndpointSliceコントローラーは、{{< glossary_tooltip text="セレクター" term_id="selector" >}}が指定されると、Kubernetes Serviceに対するEndpointSliceを自動的に作成します。これらのEndpointSliceにはServiceセレクターに一致する任意のPodへのリファレンスが含まれます。EndpointSliceはネットワークエンドポイントをユニークなServiceとPortの組み合わせでグループ化します。EndpointSliceオブジェクトの名前は有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)である必要があります。

一例として、以下に`example`というKubernetes Serviceに対するサンプルのEndpointSliceリソースを示します。

```yaml
apiVersion: discovery.k8s.io/v1beta1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    topology:
      kubernetes.io/hostname: node-1
      topology.kubernetes.io/zone: us-west2-a
```

デフォルトではEndpointSliceコントローラーが管理するEndpointSliceには、1つにつき最大で100個のエンドポイントしか所属しません。この規模以下であれば、EndpointSliceはEndpointとServiceが1対1対応になり、性能は変わらないはずです。

EndpointSliceは内部トラフィックのルーティング方法に関して、kube-proxyに対する唯一のソース(source of truth)として振る舞うことができます。EndpointSliceを有効にすれば、非常に多数のエンドポイントを持つServiceに対して性能向上が得られるはずです。

### アドレスの種類

EndpointSliceは次の3種類のアドレスをサポートします。

* IPv4
* IPv6
* FQDN (Fully Qualified Domain Name、完全修飾ドメイン名)

### トポロジー

EndpointSliceに属する各エンドポイントは、関連するトポロジーの情報を持つことができます。この情報は、エンドポイントの場所を示すために使われ、対応するNode、ゾーン、リージョンに関する情報が含まれます。値が利用できる場合にはEndpointSliceコントローラーによって次のようなTopologyラベルが設定されます。

* `kubernetes.io/hostname` - このエンドポイントが存在するNodeの名前。
* `topology.kubernetes.io/zone` - このエンドポイントが存在するゾーン。
* `topology.kubernetes.io/region` - このエンドポイントが存在するリージョン。

これらのラベルの値はスライス内の各エンドポイントと関連するリソースから継承したものです。hostnameラベルは対応するPod上のNodeNameフィールドの値を表します。zoneとregionラベルは対応するNode上の同じ名前のラベルの値を表します。

### 管理

EndpointSliceはデフォルトではEndpointSliceコントローラーによって作成・管理されます。EndpointSliceには他にもサービスメッシュの実装などのさまざまなユースケースがあるため、他のエンティティやコントローラーがEndpointSliceの追加の集合を管理する場合もあります。複数のエンティティが互いに干渉せずにEndpointSliceを管理できるようにするために、EndpointSliceを管理しているエンティティを表す`endpointslice.kubernetes.io/managed-by`ラベルが使用されます。EndpointSliceコントローラーの場合、管理対象のすべてのEndpointSliceに対して、このラベルの値として`endpointslice-controller.k8s.io`を設定します。EndpointSliceを管理するその他のエンティティも同様に、このラベルにユニークな値を設定する必要があります。

### 所有権

ほとんどのユースケースでは、EndpointSliceは対象のエンドポイントが追跡しているServiceによって所有されます。これは、各EndpointSlice上のownerリファレンスと`kubernetes.io/service-name`ラベルによって示されます。これにより、Serviceに属するすべてのEndpointSliceを簡単に検索できるようになっています。

## EndpointSliceコントローラー

EndpointSliceコントローラーは対応するEndpointSliceが最新の状態であることを保証するために、ServiceとPodを監視します。このコントローラーはセレクターが指定した各Serviceに対応するEndpointSliceを管理します。EndpointSliceはServiceセレクターに一致するPodのIPを表します。

### EndpointSliceのサイズ

デフォルトでは、それぞれのEndpointSliceのサイズの上限は100個のEndpointsに制限されています。この制限は{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}に`--max-endpoints-per-slice`フラグを使用することで、最大で1000まで設定できます。

### EndpointSliceの分散

それぞれのEndpointSliceにはポートの集合があり、リソース内のすべてのエンドポイントに適用されます。サービスが名前付きポートを使用した場合、Podが同じ名前のポートに対して、結果的に異なるターゲットポート番号が使用されて、異なるEndpointSliceが必要になる場合があります。これはサービスの部分集合がEndpointsにグループ化される場合と同様です。

コントローラーはEndpointSliceをできる限り充填しようとしますが、積極的にリバランスを行うことはありません。コントローラーのロジックは極めて単純で、以下のようになっています。

1. 既存のEndpointSliceをイテレートし、もう必要のないエンドポイントを削除し、変更があったエンドポイントを更新する。
2. 前のステップで変更されたEndpointSliceをイテレートし、追加する必要がある新しいエンドポイントで充填する。
3. まだ追加するべき新しいエンドポイントが残っていた場合、これまで変更されなかったスライスに追加を試み、その後、新しいスライスを作成する。

ここで重要なのは、3番目のステップでEndpointSliceを完全に分散させることよりも、EndpointSliceの更新を制限することを優先していることです。たとえば、もし新しい追加するべきエンドポイントが10個あり、2つのEndpointSliceにそれぞれ5個の空きがあった場合、このアプローチでは2つの既存のEndpointSliceを充填する代わりに、新しいEndpointSliceが作られます。言い換えれば、1つのEndpointSliceを作成する方が複数のEndpointSliceを更新するよりも好ましいということです。

各Node上で実行されているkube-proxyはEndpointSliceを監視しており、EndpointSliceに加えられた変更はクラスター内のすべてのNodeに送信されるため、比較的コストの高い処理になります。先ほどのアプローチは、たとえ複数のEndpointSliceが充填されない結果となるとしても、すべてのNodeへ送信しなければならない変更の数を抑制することを目的としています。

現実的には、こうしたあまり理想的ではない分散が発生することは稀です。EndpointSliceコントローラーによって処理されるほとんどの変更は、既存のEndpointSliceに収まるほど十分小さくなるためです。そうでなかったとしても、すぐに新しいEndpointSliceが必要になる可能性が高いです。また、Deploymentのローリングアップデートが行われれば、自然な再充填が行われます。Podとそれに対応するエンドポイントがすべて置換されるためです。

## {{% heading "whatsnext" %}}

* [EndpointSliceを有効にする](/docs/tasks/administer-cluster/enabling-endpointslices)
* [サービスとアプリケーションの接続](/ja/docs/concepts/services-networking/connect-applications-service/)を読む

