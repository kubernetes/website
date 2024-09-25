---
title: Gateway API
content_type: concept
description: >-
  Gateway APIは動的なインフラストラクチャの展開と高度なトラフィックルーティングを提供するAPIの種類のファミリーです。
weight: 55
---

<!-- overview -->

拡張可能でロール指向な、プロトコルを意識した設定メカニズムを使用して、ネットワークサービスを利用可能にします。
[Gateway API](https://gateway-api.sigs.k8s.io/)は、動的なインフラストラクチャの展開と高度なトラフィックルーティングを提供するAPIの[種類](https://gateway-api.sigs.k8s.io/references/spec/)を含む{{<glossary_tooltip text="アドオン" term_id="addons">}}です。

<!-- body -->

## デザイン原則

Gateway APIのデザインとアーキテクチャは次の原則から成ります:

* __ロール指向:__ Gateway APIの種類は、Kubernetesのサービスネットワークの管理に対して責任を持つ組織のロールをモデルとしています:
  * __インフラストラクチャプロバイダー:__ 複数の独立したクラスターをクラウドプロバイダーなどの複数のテナントに提供できるよう、インフラストラクチャを管理します。
  * __クラスターオペレーター:__ クラスターを管理し、通常はポリシー、ネットワークアクセス、アプリケーションのパーミッションなどに関わります。
  * __アプリケーション開発者:__ クラスター上で実行されるアプリケーションを管理し、通常はアプリケーションレベルの設定や[Service](/ja/docs/concepts/services-networking/service/)の構成に関わります。
* __ポータビリティ:__ Gateway APIの仕様は[カスタムリソース](/ja/docs/concepts/extend-kubernetes/api-extension/custom-resources)として定義され、多くの[実装](https://gateway-api.sigs.k8s.io/implementations/)によってサポートされています。
* __豊富な機能:__ Gateway APIの種類は、ヘッダーベースのマッチング、トラフィックの重み付けといった、一般的なトラフィックルーティングのユースケースに対する機能をサポートしています。これは、[Ingress](/ja/docs/concepts/services-networking/ingress/)ではカスタムアノテーションを使用することでのみ実現可能でした。
* __拡張可能:__ GatewayはカスタムリソースをAPIのさまざまなレイヤーでリンクさせることができます。これにより、APIの構造内の適切な場所で細かなカスタマイズが可能となります。

## リソースモデル

Gateway APIには3つの安定版のAPIの種類があります:

* __GatewayClass:__ 共通の設定を持ち、クラスを実装するコントローラーによって管理されたゲートウェイの集合を定義します。

* __Gateway:__ クラウドロードバランサーなどのトラフィックを処理するインフラストラクチャのインスタンスを定義します。

* __HTTPRoute:__ Gatewayリスナーからバックエンドのネットワークエンドポイントへのトラフィックのマッピングに関する、HTTP固有のルールを定義します。
これらのエンドポイントは多くの場合、{{<glossary_tooltip text="Service" term_id="service">}}で表されます。

Gateway APIは、組織のロール指向の性質をサポートするために、相互に依存関係を持つ異なるAPIの種類によって構成されます。
Gatewayオブジェクトはただ一つのGatewayClassと関連づけられます。
GatewayClassは、このクラスのGatewayを管理する責任を持つGatewayコントローラーを記述します。
HTTPRouteのような1つ以上のルートの種類がGatewayに関連づけられます。
Gatewayは、その`リスナー`にアタッチされる可能性のあるルートをフィルタリングすることができ、ルートとの双方向の信頼モデルを形成します。

次の図は、3つの安定版のGateway APIの種類の関係を示しています:

{{< figure src="/docs/images/gateway-kind-relationships.svg" alt="3つの安定版のGateway API種別の関係を示している図" class="diagram-medium" >}}

### GatewayClass {#api-kind-gateway-class}

Gatewayは、通常異なる設定を持つ、異なるコントローラーによって実装されます。
Gatewayはクラスを実装したコントローラーの名前を含むGatewayClassを参照する必要があります。

最小のGatewayClassの例:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: example-class
spec:
  controllerName: example.com/gateway-controller
```

この例では、Gateway APIを実装したコントローラーは、`example.com/gateway-controller`という名前のコントローラーを持つGatewayClassを管理するように構成されます。
このクラスのGatewayは実装のコントローラーによって管理されます。

このAPIの種類の完全な定義については、[GatewayClass](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.GatewayClass)のリファレンスを参照してください。

### Gateway {#api-kind-gateway}

Gatewayはトラフィックを処理するインフラストラクチャのインスタンスを記述します。
これは、Serviceのようなバックエンドに対して、フィルタリング、分散、分割などのようなトラフィック処理のために使用されるネットワークエンドポイントを定義します。
例えばGatewayは、HTTPトラフィックを受け付けるために構成された、クラウドロードバランサーやクラスター内のプロキシサーバーを表す場合があります。

最小のGatewayリソースの例:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-class
  listeners:
  - name: http
    protocol: HTTP
    port: 80
```

この例では、トラフィックを処理するインフラストラクチャのインスタンスは、80番ポートでHTTPトラフィックをリッスンするようにプログラムされています。
`address`フィールドが指定されていないので、アドレスまたはホスト名はコントローラーの実装によってGatewayに割り当てられます。
このアドレスは、ルートで定義されたバックエンドのネットワークエンドポイントのトラフィックを処理するためのネットワークエンドポイントとして使用されます。

このAPIの種類の完全な定義については、[Gateway](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.Gateway)のリファレンスを参照してください。

### HTTPRoute {#api-kind-httproute}

HTTPRouteの種類は、Gatewayリスナーからバックエンドのネットワークエンドポイントに対するHTTPリクエストのルーティングの振る舞いを指定します。
Serviceバックエンドに対して、実装はバックエンドのネットワークエンドポイントをService IPまたはServiceの背後のエンドポイントとして表すことができます。
基盤となるGatewayの実装に適用される設定はHTTPRouteによって表されます。
例えば、新しいHTTPRouteを定義することにより、クラウドロードバランサーやクラスター内のプロキシサーバーの追加のトラフィックルートを構成する場合があります。

最小のHTTPRouteの例:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-httproute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "www.example.com"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /login
    backendRefs:
    - name: example-svc
      port: 8080
```

この例では、Host:ヘッダーに`www.example.com`が設定され、リクエストパスに`/login`が指定されたHTTPトラフィックが、`example-gateway`という名前のGatewayから、`8080`番ポート上の`example-svc`という名前のServiceにルーティングされます。

このAPIの種類の完全な定義については、[HTTPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.HTTPRoute)のリファレンスを参照してください。

## リクエストフロー

以下は、GatewayとHTTPRouteを使用してHTTPトラフィックをServiceにルーティングする簡単な例です:

{{< figure src="/docs/images/gateway-request-flow.svg" alt="GatewayとHTTPRouteを使用してServiceにHTTPトラフィックをルーティングする例の図" class="diagram-medium" >}}

この例では、リバースプロキシとして実装されたGatewayに対するリクエストフローは次のようになります:

1. クライアントはURL `http://www.example.com`に対するHTTPリクエストの準備を開始します。
2. クライアントのDNSリゾルバは宛先の名前をクエリし、Gatewayに関連づけられた1つ以上のIPアドレスとのマッピングを学習します。
3. クライアントはGatewayのIPアドレスにリクエストを送信します。リバースプロキシはHTTPリクエストを受信し、Host:ヘッダーを使用してGatewayとそれに関連づけられたHTTPRouteから導かれた構成にマッチさせます。
4. オプションで、リバースプロキシはHTTPRouteのマッチングルールに基づいて、リクエストヘッダーもしくはパスのマッチングを実行することができます。
5. オプションで、リバースプロキシはリクエストを変更することができます。例えば、HTTPRouteのフィルタールールに従ってヘッダーを追加または削除します。
6. 最後に、リバースプロキシはリクエストを1つ以上のバックエンドにフォワードします。

## 適合性

Gateway APIは幅広い機能をカバーし、広く実装されています。
この組み合わせは、APIがどこで使われても一貫した体験を提供することを保証するために、明確な適合性の定義とテストを必要とします。

リリースチャンネル、サポートレベル、そして適合テストの実行などの詳細を理解するためには、[適合性](https://gateway-api.sigs.k8s.io/concepts/conformance/)のドキュメントを参照してください。

## Ingressからの移行

Gateway APIは[Ingress](/ja/docs/concepts/services-networking/ingress/) APIの後継です。
しかし、Ingressは含まれていません。
このため、既存のIngressリソースからGateway APIリソースへの変換を1度だけ行う必要があります。

IngressリソースからGateway APIリソースへの移行の詳細に関するガイドは、[Ingressの移行](https://gateway-api.sigs.k8s.io/guides/migrating-from-ingress/#migrating-from-ingress)を参照してください。

## {{% heading "whatsnext" %}}

Gateway APIリソースをKubernetesでネイティブに実装する代わりに、幅広い[実装](https://gateway-api.sigs.k8s.io/implementations/)によってサポートされた[カスタムリソース](/ja/docs/concepts/extend-kubernetes/api-extension/custom-resources/)として仕様が定義されています。
Gateway API CRDを[インストール](https://gateway-api.sigs.k8s.io/guides/#installing-gateway-api)するか、選んだ実装のインストール手順に従ってください。
実装をインストールした後、[Getting Started](https://gateway-api.sigs.k8s.io/guides/)ガイドを使用してGateway APIをすぐに使い始めることができます。

{{< note >}}
選択した実装のドキュメントを必ず確認し、注意点を理解するようにしてください。
{{< /note >}}

すべてのGateway API種別の追加の詳細については[API仕様](https://gateway-api.sigs.k8s.io/reference/spec/)を参照してください。
