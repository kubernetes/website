---
title: EndpointSlice
api_metadata:
- apiVersion: "discovery.k8s.io/v1"
  kind: "EndpointSlice"
content_type: concept
weight: 60
description: >-
  EndpointSlice APIは、KubernetesがServiceを多数のバックエンドに対応できるようにスケールさせるための仕組みであり、クラスターが正常なバックエンドの一覧を効率的に更新できるようにするものです。
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

{{< glossary_definition term_id="endpoint-slice" length="short" >}}

<!-- body -->

## EndpointSlice API {#endpointslice-resource}

Kubernetesでは、EndpointSliceにはネットワークエンドポイントの集合への参照が含まれます。
コントロールプレーンは、{{< glossary_tooltip text = "セレクター" term_id = "selector" >}}が指定されているKubernetes ServiceのEndpointSliceを自動的に作成します。
これらのEndpointSliceには、Serviceセレクターに一致するすべてのPodへの参照が含まれています。
EndpointSliceは、IPファミリー、プロトコル、ポート番号、およびService名の一意の組み合わせによってネットワークエンドポイントをグループ化します。
EndpointSliceオブジェクトの名前は有効な[DNSサブドメイン名](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)である必要があります。

一例として、以下に`example`というKubernetes Serviceによって所有されるサンプルのEndpointSliceオブジェクトを示します。

```yaml
apiVersion: discovery.k8s.io/v1
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
    nodeName: node-1
    zone: us-west2-a
```

既定では、コントロールプレーンはEndpointSliceを作成・管理し、それぞれのエンドポイント数が100以下になるようにします。
`--max-endpoints-per-slice`{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}フラグを設定することで、最大1000個まで設定可能です。

EndpointSliceは内部トラフィックのルーティング方法に関して、{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}に対する信頼できる唯一の情報源(source of truth)として機能します。

### アドレスの種類 {#address-types}

EndpointSliceは次の2種類のアドレスをサポートします。

* IPv4
* IPv6

各`EndpointSlice`オブジェクトは、特定のIPアドレス種別を表します。
IPv4とIPv6の両方が利用可能なServiceがある場合は、少なくとも2つのEndpointSliceオブジェクト(IPv4用とIPv6用)が存在します。

### 状態 {#conditions}

EndpointSlice APIはコンシューマーの役に立つエンドポイントの状態を保持しています。
状態には`serving`、`terminating`、`ready`の3種類があります。

#### Serving

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

`serving`状態は、そのエンドポイントが現在レスポンスを返していることを示し、Serviceトラフィックのターゲットとして使用されるべきであることを表します。
Podをバックに持つエンドポイントでは、Podの`Ready`状態に対応します。

#### Terminating

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

`terminating`状態は、そのエンドポイントが終了処理中であることを示します。
Podをバックに持つエンドポイントでは、この状態はPodが最初に削除された時点に設定されます(つまりdeletionタイムスタンプを受け取った時点であり、通常はPodのコンテナが終了する前)。

Serviceプロキシは通常、`terminating`状態のエンドポイントを無視しますが、利用可能なエンドポイントがすべて`terminating`状態である場合は、`serving`と`terminating`の両方が設定されているエンドポイントへトラフィックをルーティングすることがあります(これは、基盤となるPodのローリングアップデート中にServiceのトラフィックが失われないようにするためです)。

### Ready

`ready`状態は、実質的には"`serving`かつ`terminating`ではない"ことを確認するためのショートカットです(ただし、`spec.publishNotReadyAddresses`が`true`に設定されているServiceでは、常に`true`になります)。

### トポロジー情報 {#topology}

EndpointSliceに属する各エンドポイントは、関連するトポロジーの情報を持つことができます。
トポロジー情報には、エンドポイントの配置場所、および対応するノードやゾーンに関する情報が含まれます。
これらは、EndpointSliceの各エンドポイントに対する以下のフィールドで利用できます。

* `nodeName` - このエンドポイントが存在するノードの名前。
* `zone` - このエンドポイントが存在するゾーン。

### 管理 {#management}

ほとんどの場合、コントロールプレーン(具体的には、EndpointSlice{{< glossary_tooltip text = "コントローラー" term_id = "controller" >}})が、EndpointSliceオブジェクトを作成および管理します。
EndpointSliceには、サービスメッシュの実装など、他のさまざまなユースケースがあり、他のエンティティまたはコントローラーがEndpointSliceの追加セットを管理する可能性があります。

複数のエンティティが互いに干渉することなくEndpointSliceを管理できるようにするために、KubernetesはEndpointSliceを管理するエンティティを示す`endpointslice.kubernetes.io/managed-by`という{{< glossary_tooltip term_id="label" text="ラベル" >}}を定義します。
EndpointSliceコントローラーは、自身が管理するすべてのEndpointSliceに対して、このラベルの値として`endpointslice-controller.k8s.io`を設定します。
EndpointSliceを管理するその他のエンティティも同様に、このラベルに一意な値を設定する必要があります。

### 所有権 {#ownership}

ほとんどのユースケースでは、EndpointSliceはEndpointSliceオブジェクトがエンドポイントを追跡するServiceによって所有されます。
これは、各EndpointSlice上のownerリファレンスと`kubernetes.io/service-name`ラベルによって示されます。
これにより、Serviceに属するすべてのEndpointSliceを簡単に検索できるようになっています。

### EndpointSliceの分散 {#distribution-of-endpointslices}

それぞれのEndpointSliceにはポートの集合があり、リソース内のすべてのエンドポイントに適用されます。
Serviceが名前付きポートを使用した場合、Podは同じ名前のポートに対して、結果的に異なるターゲットポート番号を持つことがあり、そのため異なるEndpointSliceが必要になる場合があります。

コントロールプレーンはEndpointSliceをできる限り埋めようとしますが、積極的にリバランスを行うことはありません。
コントローラーのロジックは極めて単純で、以下のようになっています。

1. 既存のEndpointSliceをイテレートし、もう必要のないエンドポイントを削除し、変更があったエンドポイントを更新する。
2. 前のステップで変更されたEndpointSliceをイテレートし、追加する必要がある新しいエンドポイントで埋める。
3. まだ追加するべき新しいエンドポイントが残っていた場合、これまで変更されなかったスライスに追加を試みたり、新しいスライスを作成したりする。

ここで重要なのは、3番目のステップでEndpointSliceを完全に分散させることよりも、EndpointSliceの更新を制限することを優先していることです。
たとえば、もし新しい追加するべきエンドポイントが10個あり、2つのEndpointSliceにそれぞれ5個の空きがあった場合、このアプローチでは2つの既存のEndpointSliceを埋める代わりに、新しいEndpointSliceが作られます。
言い換えれば、1つのEndpointSliceを作成する方が、複数のEndpointSliceを更新するよりも好ましいということです。

各ノード上で実行されているkube-proxyはEndpointSliceを監視しており、EndpointSliceに加えられた変更はクラスター内のすべてのノードに送信されるため、比較的コストの高い処理になります。
先ほどのアプローチは、たとえ複数のEndpointSliceが埋まらない結果になるとしても、すべてのノードへ送信しなければならない変更の数を抑制することを目的としています。

現実的には、こうしたあまり理想的ではない分散が発生することは稀です。
EndpointSliceコントローラーによって処理されるほとんどの変更は、既存のEndpointSliceに収まるほど十分小さくなるためです。
そうでなかったとしても、すぐに新しいEndpointSliceが必要になる可能性が高いです。
また、Deploymentのローリングアップデートでは、すべてのPodとそれに対応するエンドポイントが置き換えられるため、EndpointSliceも自然に再配置されます。

### エンドポイントの重複 {#duplicate-endpoints}

EndpointSliceの変更の性質上、エンドポイントは同時に複数のEndpointSliceで表される場合があります。
これは、さまざまなEndpointSliceオブジェクトへの変更が、さまざまな時間にKubernetesクライアントのウォッチ/キャッシュに到達する可能性があるために自然に発生します。
EndpointSliceを使用する実装では、エンドポイントを複数のスライスに表示できる必要があります。

{{< note >}}
EndpointSlice APIのクライアントは、Serviceに関連づけられた既存のすべてのEndpointSliceをイテレートして、一意のネットワークエンドポイントの完全な一覧を構築する必要があります。
異なるEndpointSliceに同じエンドポイントが重複して存在する可能性がある点に注意が必要です。

このようなエンドポイントの集約および重複排除を実行する方法のリファレンス実装は、`kube-proxy`内の`EndpointSliceCache`のコードにあります。
{{< /note >}}

### EndpointSliceのミラーリング {#endpointslice-mirroring}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

EndpointSlice APIは旧来のEndpoint APIを置き換えるものです。
{{<glossary_tooltip term_id="kube-proxy" text="kube-proxy">}}がEndpointリソースに基づいてトラフィックをルーティングすることを前提としている古いコントローラーやユーザーワークロードとの互換性を維持するために、クラスターのコントロールプレーンは、ユーザーが作成したほとんどのEndpointリソースを対応するEndpointSliceにミラーリングします。

(ただし、この機能はEndpoint APIの他の部分と同様に非推奨です。
セレクターを持たないServiceに対してEndpointを手動で指定するユーザーは、Endpointリソースを作成してミラーリングさせるのではなく、EndpointSliceリソースを直接作成する必要があります。)

コントロールプレーンは、次の場合を除いて、Endpointリソースをミラーリングします。

* Endpointリソースの`endpointslice.kubernetes.io/skip-mirror`ラベルが`true`に設定されている。
* Endpointリソースが`control-plane.alpha.kubernetes.io/leader`アノテーションを持っている。
* 対応するServiceリソースが存在しない。
* 対応するServiceリソースに、nil以外のセレクターがある。

個々のEndpointリソースは、複数のEndpointSliceに変換される場合があります。
これは、Endpointリソースに複数のサブセットがある場合、または複数のIPファミリ(IPv4およびIPv6)を持つエンドポイントが含まれている場合に発生します。
サブセットごとに最大1000個のアドレスがEndpointSliceにミラーリングされます。

## {{% heading "whatsnext" %}}

* [サービスとアプリケーションの接続](/docs/tutorials/services/connect-applications-service/)のチュートリアルを参照してください
* EndpointSlice APIの[APIリファレンス](docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)を読む
* Endpoint APIの[APIリファレンス](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)を読む
