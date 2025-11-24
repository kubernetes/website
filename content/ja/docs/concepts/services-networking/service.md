---
reviewers:
- bprashanth
title: Service
api_metadata:
- apiVersion: "v1"
  kind: "Service"
feature:
  title: サービスディスカバリーと負荷分散
  description: >
    Kubernetesでは、なじみのないサービスディスカバリーのメカニズムを使用するためにユーザーがアプリケーションの修正をする必要はありません。KubernetesはPodにそれぞれのIPアドレス割り振りや、Podのセットに対する単一のDNS名を提供したり、それらのPodのセットに対する負荷分散が可能です。
description: >-
  クラスター内で実行されているアプリケーションを、ワークロードが複数のバックエンドに分割されている場合でも、単一の外向きのエンドポイントの背後に公開します。
content_type: concept
weight: 10
---

<!-- overview -->

{{< glossary_definition term_id="service" length="short" prepend="KubernetesにおけるServiceとは、" >}}

KubernetesにおけるServiceの主な目的は、なじみのないサービスディスカバリーのメカニズムを使用するためにユーザーが既存のアプリケーションの修正をする必要がないようにすることです。
クラウドネイティブな世界のために設計されたコードであれ、コンテナ化された古いアプリであれ、Podでコードを実行できます。Serviceを使用することで、そのPodのセットをネットワーク上で利用可能にし、クライアントがそれと対話できるようにします。

{{< glossary_tooltip term_id="deployment" >}}を使用してアプリを実行する場合、そのDeploymentはPodを動的に作成および削除できます。ある瞬間から次の瞬間にかけて、それらのPodのいくつが動作していて健全であるかはわかりません。それらの健全なPodの名前さえわからないかもしれません。
Kubernetesの{{< glossary_tooltip term_id="pod" text="Pod" >}}は、クラスターの希望する状態に合わせて作成および削除されます。Podは揮発性のリソースです（個々のPodが信頼性が高く耐久性があることを期待すべきではありません）。

各Podは独自のIPアドレスを取得します（Kubernetesはネットワークプラグインがこれを保証することを期待しています）。
クラスター内の特定のDeploymentについて、ある時点で実行されているPodのセットは、その後の時点でそのアプリケーションを実行しているPodのセットとは異なる場合があります。

これは問題につながります。あるPodのセット（「バックエンド」と呼びます）がクラスター内の他のPodのセット（「フロントエンド」と呼びます）に機能を提供する場合、フロントエンドは接続先のIPアドレスをどのように見つけ、追跡すればよいのでしょうか？

そこで _Service_ の出番です。

<!-- body -->

## KubernetesにおけるService

Kubernetesの一部であるService APIは、ネットワーク上でPodのグループを公開するのに役立つ抽象化です。各Serviceオブジェクトは、論理的なエンドポイントのセット（通常、これらのエンドポイントはPodです）と、それらのPodにアクセスする方法についてのポリシーを定義します。

例えば、3つのレプリカで実行されているステートレスな画像処理バックエンドを考えてみましょう。これらのレプリカは代替可能です。フロントエンドはどのバックエンドを使用するかを気にしません。バックエンドセットを構成する実際のPodが変更される可能性がありますが、フロントエンドクライアントはそのことを認識する必要はなく、バックエンドのセット自体を追跡する必要もありません。

Serviceの抽象化により、この分離が可能になります。

ServiceによってターゲットとされるPodのセットは、通常、定義した{{< glossary_tooltip text="セレクター" term_id="selector" >}}によって決定されます。
Serviceエンドポイントを定義する他の方法については、[セレクターなしのService](#services-without-selectors)を参照してください。

ワークロードがHTTPを話す場合、Webトラフィックがそのワークロードに到達する方法を制御するために[Ingress](/ja/docs/concepts/services-networking/ingress/)を使用することを選択するかもしれません。
IngressはServiceタイプではありませんが、クラスターのエントリーポイントとして機能します。Ingressを使用すると、ルーティングルールを単一のリソースに統合できるため、クラスター内で別々に実行されているワークロードの複数のコンポーネントを単一のリスナーの背後に公開できます。

Kubernetes用の[Gateway](https://gateway-api.sigs.k8s.io/#what-is-the-gateway-api) APIは、IngressとServiceを超えた追加機能を提供します。Gatewayをクラスターに追加できます（これは{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}を使用して実装された拡張APIのファミリーです）。そして、これらを使用して、クラスター内で実行されているネットワークサービスへのアクセスを構成できます。

### クラウドネイティブなサービスディスカバリー

アプリケーションでサービスディスカバリーにKubernetes APIを使用できる場合、一致するEndpointSlicesについて{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}にクエリを実行できます。Kubernetesは、Service内のPodのセットが変更されるたびに、ServiceのEndpointSlicesを更新します。

非ネイティブなアプリケーションのために、KubernetesはアプリケーションとバックエンドPodの間にネットワークポートまたはロードバランサーを配置する方法を提供します。

いずれにせよ、ワークロードはこれらの[サービスディスカバリー](#discovering-services)メカニズムを使用して、接続したいターゲットを見つけることができます。

## Serviceの定義

Serviceは{{< glossary_tooltip text="オブジェクト" term_id="object" >}}です（PodやConfigMapがオブジェクトであるのと同じです）。Kubernetes APIを使用して、Service定義を作成、表示、または変更できます。通常、`kubectl`などのツールを使用して、それらのAPI呼び出しを行います。

例えば、それぞれがTCPポート9376でリッスンし、`app.kubernetes.io/name=MyApp`というラベルが付けられたPodのセットがあるとします。そのTCPリスナーを公開するためのServiceを定義できます。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

このマニフェストを適用すると、デフォルトのClusterIP [Serviceタイプ](#publishing-services-service-types)で「my-service」という名前の新しいServiceが作成されます。このServiceは、`app.kubernetes.io/name: MyApp`ラベルを持つ任意のPodのTCPポート9376をターゲットにします。

KubernetesはこのServiceにIPアドレス（_クラスターIP_）を割り当てます。これは仮想IPアドレスメカニズムによって使用されます。そのメカニズムの詳細については、[仮想IPとサービスプロキシ](/ja/docs/reference/networking/virtual-ips/)を読んでください。

そのServiceのコントローラーは、そのセレクターに一致するPodを継続的にスキャンし、ServiceのEndpointSlicesのセットに必要な更新を行います。

Serviceオブジェクトの名前は、有効な[RFC 1035ラベル名](/ja/docs/concepts/overview/working-with-objects/names#rfc-1035-label-names)である必要があります。

{{< note >}}
Serviceは、任意の受信`port`を`targetPort`にマッピングできます。デフォルトでは、利便性のために、`targetPort`は`port`フィールドと同じ値に設定されます。
{{< /note >}}

### Serviceオブジェクトの命名要件の緩和

{{< feature-state feature_gate_name="RelaxedServiceNameValidation" >}}

`RelaxedServiceNameValidation`フィーチャーゲートにより、Serviceオブジェクト名を数字で始めることができます。このフィーチャーゲートが有効になっている場合、Serviceオブジェクト名は有効な[RFC 1123ラベル名](/ja/docs/concepts/overview/working-with-objects/names/#dns-label-names)である必要があります。

### ポート定義 {#field-spec-ports}

Pod内のポート定義には名前があり、Serviceの`targetPort`属性でこれらの名前を参照できます。例えば、次のようにServiceの`targetPort`をPodのポートにバインドできます。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app.kubernetes.io/name: proxy
spec:
  containers:
  - name: nginx
    image: nginx:stable
    ports:
      - containerPort: 80
        name: http-web-svc

---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app.kubernetes.io/name: proxy
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 80
    targetPort: http-web-svc
```

これは、単一の構成名を使用するService内にPodが混在しており、異なるポート番号を介して同じネットワークプロトコルが利用可能な場合でも機能します。これにより、Serviceのデプロイと進化に多くの柔軟性がもたらされます。例えば、クライアントを壊すことなく、バックエンドソフトウェアの次のバージョンでPodが公開するポート番号を変更できます。

Serviceのデフォルトプロトコルは[TCP](/ja/docs/reference/networking/service-protocols/#protocol-tcp)です。他の[サポートされているプロトコル](/ja/docs/reference/networking/service-protocols/)も使用できます。

多くのServiceは複数のポートを公開する必要があるため、Kubernetesは単一のServiceに対する[複数のポート定義](#multi-port-services)をサポートしています。各ポート定義は、同じ`protocol`を持つことも、異なるプロトコルを持つこともできます。

### セレクターなしのService {#services-without-selectors}

Serviceは、セレクターのおかげでKubernetes Podへのアクセスを抽象化するのが最も一般的ですが、対応する{{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlices" >}}オブジェクトのセットとともにセレクターなしで使用される場合、Serviceはクラスター外で実行されるものを含む他の種類のバックエンドを抽象化できます。

例えば:

* 本番環境では外部のデータベースクラスターを使用したいが、テスト環境では独自のデータベースを使用する場合。
* 別の{{< glossary_tooltip term_id="namespace" >}}または別のクラスターにあるServiceにServiceを向けたい場合。
* ワークロードをKubernetesに移行している場合。アプローチを評価している間、バックエンドの一部のみをKubernetesで実行します。

これらのシナリオのいずれでも、Podに一致するセレクターを指定_せずに_Serviceを定義できます。例えば:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
```

このServiceにはセレクターがないため、対応するEndpointSliceオブジェクトは自動的に作成されません。EndpointSliceオブジェクトを手動で追加することで、Serviceを実行中のネットワークアドレスとポートにマッピングできます。例えば:

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-1 # 慣例により、EndpointSliceの名前のプレフィックスとしてServiceの名前を使用します
  labels:
    # "kubernetes.io/service-name"ラベルを設定する必要があります。
    # その値をServiceの名前と一致するように設定します
    kubernetes.io/service-name: my-service
addressType: IPv4
ports:
  - name: http # 上記で定義されたサービスポートの名前と一致する必要があります
    appProtocol: http
    protocol: TCP
    port: 9376
endpoints:
  - addresses:
      - "10.4.5.6"
  - addresses:
      - "10.1.2.3"
```

#### カスタムEndpointSlices

Service用の[EndpointSlice](#endpointslices)オブジェクトを作成する場合、EndpointSliceには任意の名前を使用できます。名前空間内の各EndpointSliceには一意の名前が必要です。EndpointSliceをServiceにリンクするには、そのEndpointSliceに`kubernetes.io/service-name` {{< glossary_tooltip text="ラベル" term_id="label" >}}を設定します。

{{< note >}}
エンドポイントIPは、ループバック（IPv4の場合は127.0.0.0/8、IPv6の場合は::1/128）、またはリンクローカル（IPv4の場合は169.254.0.0/16および224.0.0.0/24、IPv6の場合はfe80::/64）であっては_なりません_。

エンドポイントIPアドレスは、他のKubernetes ServiceのクラスターIPにすることはできません。これは、{{< glossary_tooltip term_id="kube-proxy" >}}が宛先として仮想IPをサポートしていないためです。
{{< /note >}}

自分で、または独自のコードで作成するEndpointSliceの場合、ラベル[`endpointslice.kubernetes.io/managed-by`](/ja/docs/reference/labels-annotations-taints/#endpointslicekubernetesiomanaged-by)に使用する値も選択する必要があります。EndpointSlicesを管理するための独自のコントローラーコードを作成する場合は、`"my-domain.example/name-of-controller"`のような値を使用することを検討してください。サードパーティのツールを使用している場合は、ツールの名前をすべて小文字で使用し、スペースやその他の句読点をダッシュ（`-`）に変更してください。
`kubectl`などのツールを直接使用してEndpointSlicesを管理する場合は、`"staff"`や`"cluster-admins"`など、この手動管理を説明する名前を使用してください。Kubernetes独自のコントロールプレーンによって管理されるEndpointSlicesを識別する予約値`"controller"`の使用は避けてください。

#### セレクターなしでServiceにアクセスする {#service-no-selector-access}

セレクターなしでServiceにアクセスすることは、セレクターがある場合と同じように機能します。セレクターなしのServiceの[例](#services-without-selectors)では、トラフィックはEndpointSliceマニフェストで定義された2つのエンドポイントのいずれか（ポート9376の10.1.2.3または10.4.5.6へのTCP接続）にルーティングされます。

{{< note >}}
Kubernetes APIサーバーは、Podにマッピングされていないエンドポイントへのプロキシを許可しません。Serviceにセレクターがない場合、`kubectl port-forward service/<service-name> forwardedPort:servicePort`などのアクションは、この制約のために失敗します。これにより、Kubernetes APIサーバーが、呼び出し元がアクセスを許可されていないエンドポイントへのプロキシとして使用されるのを防ぎます。
{{< /note >}}

`ExternalName` Serviceは、セレクターを持たず、代わりにDNS名を使用するServiceの特殊なケースです。詳細については、[ExternalName](#externalname)セクションを参照してください。

### EndpointSlices

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

[EndpointSlices](/ja/docs/concepts/services-networking/endpoint-slices/)は、Serviceのバッキングネットワークエンドポイントのサブセット（_スライス_）を表すオブジェクトです。

Kubernetesクラスターは、各EndpointSliceが表すエンドポイントの数を追跡します。Serviceのエンドポイントが多すぎてしきい値に達した場合、Kubernetesは別の空のEndpointSliceを追加し、そこに新しいエンドポイント情報を保存します。
デフォルトでは、既存のEndpointSlicesがすべて少なくとも100個のエンドポイントを含むと、Kubernetesは新しいEndpointSliceを作成します。Kubernetesは、追加のエンドポイントを追加する必要があるまで、新しいEndpointSliceを作成しません。

このAPIの詳細については、[EndpointSlices](/ja/docs/concepts/services-networking/endpoint-slices/)を参照してください。

### Endpoints (非推奨) {#endpoints}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

EndpointSlice APIは、古い[Endpoints](/ja/docs/reference/kubernetes-api/service-resources/endpoints-v1/) APIの進化形です。非推奨のEndpoints APIには、EndpointSliceと比較していくつかの問題があります。

  - デュアルスタッククラスターをサポートしていません。
  - [trafficDistribution](/ja/docs/concepts/services-networking/service/#traffic-distribution)などの新しい機能をサポートするために必要な情報が含まれていません。
  - 単一のオブジェクトに収まらないほど長い場合、エンドポイントのリストを切り捨てます。

このため、すべてのクライアントはEndpointsではなくEndpointSlice APIを使用することをお勧めします。

#### 容量超過のエンドポイント

Kubernetesは、単一のEndpointsオブジェクトに収まるエンドポイントの数を制限します。Serviceのバッキングエンドポイントが1000を超えると、KubernetesはEndpointsオブジェクトのデータを切り捨てます。Serviceは複数のEndpointSliceにリンクできるため、1000個のバッキングエンドポイント制限はレガシーEndpoints APIにのみ影響します。

その場合、Kubernetesは最大1000個の可能なバックエンドエンドポイントを選択してEndpointsオブジェクトに保存し、Endpointsに{{< glossary_tooltip text="アノテーション" term_id="annotation" >}} [`endpoints.kubernetes.io/over-capacity: truncated`](/ja/docs/reference/labels-annotations-taints/#endpoints-kubernetes-io-over-capacity)を設定します。コントロールプレーンは、バックエンドPodの数が1000を下回ると、そのアノテーションを削除します。

トラフィックは依然としてバックエンドに送信されますが、レガシーEndpoints APIに依存するロードバランシングメカニズムは、利用可能なバッキングエンドポイントの最大1000個にのみトラフィックを送信します。

同じAPI制限により、Endpointsを手動で更新して1000を超えるエンドポイントを持つことはできません。

### アプリケーションプロトコル

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

`appProtocol`フィールドは、各Serviceポートにアプリケーションプロトコルを指定する方法を提供します。これは、実装が理解できるプロトコルに対してより豊かな動作を提供するためのヒントとして使用されます。
このフィールドの値は、対応するEndpointsおよびEndpointSliceオブジェクトによってミラーリングされます。

このフィールドは標準のKubernetesラベル構文に従います。有効な値は次のいずれかです。

* [IANA標準サービス名](https://www.iana.org/assignments/service-names)。

* `mycompany.com/my-custom-protocol`などの実装定義のプレフィックス付き名前。

* Kubernetes定義のプレフィックス付き名前:

| プロトコル | 説明 |
|----------|-------------|
| `kubernetes.io/h2c` | [RFC 7540](https://www.rfc-editor.org/rfc/rfc7540)で説明されているクリアテキスト上のHTTP/2 |
| `kubernetes.io/ws`  | [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455)で説明されているクリアテキスト上のWebSocket |
| `kubernetes.io/wss` | [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455)で説明されているTLS上のWebSocket |

### 複数のポートを公開するService {#multi-port-services}

いくつかのServiceにおいて、ユーザーは1つ以上のポートを公開する必要があります。Kubernetesは、Serviceオブジェクト上で複数のポートを定義するように設定できます。
Serviceで複数のポートを使用するとき、どのポートかを明確にするために、複数のポート全てに対して名前をつける必要があります。
例えば:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 9376
    - name: https
      protocol: TCP
      port: 443
      targetPort: 9377
```

{{< note >}}
一般的なKubernetesの{{< glossary_tooltip term_id="name" text="名前">}}と同様に、ポート名は小文字の英数字と`-`のみを含める必要があります。また、ポート名の最初と最後の文字は英数字である必要があります。

例えば、`123-abc`や`web`という名前は有効ですが、`123_abc`や`-web`は無効です。
{{< /note >}}

## Serviceタイプ {#publishing-services-service-types}

アプリケーションのいくつかの部分（例えば、フロントエンドなど）において、クラスターの外部からアクセス可能な外部IPアドレス上にServiceを公開したい場合があります。

KubernetesのServiceタイプを使用すると、必要なServiceの種類を指定できます。

利用可能な`type`の値とその振る舞いは以下の通りです:

[`ClusterIP`](#type-clusterip)
: クラスター内部のIPでServiceを公開します。この値を選択すると、Serviceはクラスター内部からのみ到達可能になります。これは、Serviceの`type`を明示的に指定しない場合に使用されるデフォルトです。
  [Ingress](/ja/docs/concepts/services-networking/ingress/)または[Gateway](https://gateway-api.sigs.k8s.io/)を使用して、Serviceをパブリックインターネットに公開できます。

[`NodePort`](#type-nodeport)
: 各NodeのIPにて、静的なポート（`NodePort`）上でServiceを公開します。ノードポートを利用可能にするために、Kubernetesは`type: ClusterIP`のServiceを要求したかのように、クラスターIPアドレスを設定します。

[`LoadBalancer`](#loadbalancer)
: 外部のロードバランサーを使用して、Serviceを外部に公開します。Kubernetesは直接ロードバランシングコンポーネントを提供しません。ユーザーが提供するか、Kubernetesクラスターをクラウドプロバイダーと統合することができます。

[`ExternalName`](#externalname)
: Serviceを`externalName`フィールドの内容（例えば、ホスト名`api.foo.bar.example`）にマッピングします。マッピングは、クラスターのDNSサーバーがその外部ホスト名の値を持つ`CNAME`レコードを返すように構成します。
  いかなる種類のプロキシも設定されません。

Service APIの`type`フィールドは、ネストされた機能として設計されています。各レベルは前のレベルに追加されます。ただし、このネストされた設計には例外があります。[ロードバランサーの`NodePort`割り当てを無効にする](/ja/docs/concepts/services-networking/service/#load-balancer-nodeport-allocation)ことで、`LoadBalancer` Serviceを定義できます。

### `type: ClusterIP` {#type-clusterip}

このデフォルトのServiceタイプは、クラスターがその目的のために予約したIPアドレスのプールからIPアドレスを割り当てます。

Serviceの他のいくつかのタイプは、基盤として`ClusterIP`タイプの上に構築されています。

`.spec.clusterIP`が`"None"`に設定されたServiceを定義すると、KubernetesはIPアドレスを割り当てません。詳細については、[Headless Service](#headless-services)を参照してください。

#### 独自のIPアドレスを選択する

`Service`作成リクエストの一部として、独自のクラスターIPアドレスを指定できます。これを行うには、`.spec.clusterIP`フィールドを設定します。例えば、再利用したい既存のDNSエントリがある場合や、特定のIPアドレス用に構成されており再構成が難しいレガシーシステムがある場合などです。

選択するIPアドレスは、APIサーバー用に構成された`service-cluster-ip-range` CIDR範囲内の有効なIPv4またはIPv6アドレスである必要があります。
無効な`clusterIP`アドレス値でServiceを作成しようとすると、APIサーバーは問題があることを示すために422 HTTPステータスコードを返します。

2つの異なるServiceが同じIPアドレスを使用しようとするリスクと影響をKubernetesがどのように軽減するかについては、[衝突の回避](/ja/docs/reference/networking/virtual-ips/#avoiding-collisions)を参照してください。

### `type: NodePort` {#type-nodeport}

`type`フィールドを`NodePort`に設定すると、Kubernetesコントロールプレーンは`--service-node-port-range`フラグで指定された範囲（デフォルト: 30000-32767）からポートを割り当てます。
各ノードは、そのポート（すべてのノードで同じポート番号）をServiceにプロキシします。
Serviceは、割り当てられたポートを`.spec.ports[*].nodePort`フィールドで報告します。

NodePortを使用すると、独自のロードバランシングソリューションをセットアップしたり、Kubernetesによって完全にサポートされていない環境を構成したり、1つ以上のノードのIPアドレスを直接公開したりする自由が得られます。

ノードポートServiceの場合、Kubernetesはさらにポート（Serviceのプロトコルに合わせてTCP、UDP、またはSCTP）を割り当てます。クラスター内のすべてのノードは、その割り当てられたポートでリッスンし、そのServiceに関連付けられた準備完了のエンドポイントの1つにトラフィックを転送するように構成されます。適切なプロトコル（例: TCP）と適切なポート（そのServiceに割り当てられたもの）を使用して任意のノードに接続することで、クラスターの外部から`type: NodePort` Serviceにアクセスできます。

#### 独自のポートを選択する {#nodeport-custom-port}

特定のポート番号が必要な場合は、`nodePort`フィールドに値を指定できます。コントロールプレーンは、そのポートを割り当てるか、APIトランザクションが失敗したことを報告します。
これは、ポートの衝突の可能性を自分で処理する必要があることを意味します。
また、NodePortの使用用に構成された範囲内の有効なポート番号を使用する必要があります。

以下は、NodePort値（この例では30007）を指定する`type: NodePort`のServiceのマニフェスト例です。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - port: 80
      # デフォルトでは利便性のため、 `targetPort` は `port` と同じ値にセットされます。
      targetPort: 80
      # 省略可能なフィールド
      # デフォルトでは利便性のため、Kubernetesコントロールプレーンはある範囲から1つポートを割り当てます(デフォルト値の範囲:30000-32767)
      nodePort: 30007
```

#### 衝突を避けるためにNodeport範囲を予約する {#avoid-nodeport-collisions}

NodePort Serviceへのポート割り当てのポリシーは、自動割り当てと手動割り当ての両方のシナリオに適用されます。ユーザーが特定のポートを使用するNodePort Serviceを作成しようとすると、ターゲットポートがすでに割り当てられている別のポートと競合する可能性があります。

この問題を回避するために、NodePort Serviceのポート範囲は2つの帯域に分割されています。
動的ポート割り当てはデフォルトで上位帯域を使用し、上位帯域が使い果たされると下位帯域を使用する場合があります。ユーザーは、ポート衝突のリスクが低い下位帯域から割り当てることができます。

#### `type: NodePort` ServiceのカスタムIPアドレス構成 {#service-nodeport-custom-listen-address}

クラスター内のノードを設定して、ノードポートServiceの提供に特定のIPアドレスを使用するようにできます。各ノードが複数のネットワーク（例: アプリケーショントラフィック用のネットワークと、ノードとコントロールプレーン間のトラフィック用の別のネットワーク）に接続されている場合に、これを行うことができます。

ポートをプロキシする特定のIPアドレスを指定したい場合は、kube-proxyの`--nodeport-addresses`フラグ、または[kube-proxy構成ファイル](/ja/docs/reference/config-api/kube-proxy-config.v1alpha1/)の同等の`nodePortAddresses`フィールドを特定のIPブロックに設定できます。

このフラグは、コンマ区切りのIPブロックのリスト（例: `10.0.0.0/8`, `192.0.2.0/25`）を使用して、kube-proxyがこのノードに対してローカルと見なすべきIPアドレスの範囲を指定します。

例えば、`--nodeport-addresses=127.0.0.0/8`フラグを使用してkube-proxyを起動すると、kube-proxyはNodePort Service用にループバックインターフェースのみを選択します。
`--nodeport-addresses`のデフォルトは空のリストです。
これは、kube-proxyがNodePortのすべての利用可能なネットワークインターフェースを考慮すべきであることを意味します。（これは以前のKubernetesリリースとも互換性があります。）

{{< note >}}
このServiceは、`<NodeIP>:spec.ports[*].nodePort`および`.spec.clusterIP:spec.ports[*].port`として表示されます。
kube-proxyの`--nodeport-addresses`フラグまたはkube-proxy構成ファイルの同等のフィールドが設定されている場合、`<NodeIP>`はフィルタリングされたノードIPアドレス（またはIPアドレス）になります。
{{< /note >}}

### `type: LoadBalancer` {#loadbalancer}

外部ロードバランサーをサポートするクラウドプロバイダーでは、`type`フィールドを`LoadBalancer`に設定すると、Service用のロードバランサーがプロビジョニングされます。
ロードバランサーの実際の作成は非同期に行われ、プロビジョニングされたバランサーに関する情報はServiceの`.status.loadBalancer`フィールドに公開されます。
例えば:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 192.0.2.127
```

外部ロードバランサーからのトラフィックは、バックエンドPodに直接向けられます。クラウドプロバイダーは、負荷分散の方法を決定します。

`type: LoadBalancer`のServiceを実装するために、Kubernetesは通常、`type: NodePort`のServiceを要求するのと同等の変更を行うことから始めます。次に、cloud-controller-managerコンポーネントは、割り当てられたノードポートにトラフィックを転送するように外部ロードバランサーを構成します。

クラウドプロバイダーの実装がこれをサポートしている場合は、ノードポートの割り当てを[省略](#load-balancer-nodeport-allocation)するようにロードバランシングされたServiceを構成できます。

一部のクラウドプロバイダーでは、`loadBalancerIP`を指定できます。その場合、ロードバランサーはユーザー指定の`loadBalancerIP`で作成されます。`loadBalancerIP`フィールドが指定されていない場合、ロードバランサーはエフェメラルIPアドレスでセットアップされます。`loadBalancerIP`を指定したが、クラウドプロバイダーがその機能をサポートしていない場合、設定した`loadbalancerIP`フィールドは無視されます。

{{< note >}}
Serviceの`.spec.loadBalancerIP`フィールドはKubernetes v1.24で非推奨になりました。

このフィールドは仕様が不十分であり、その意味は実装によって異なります。
また、デュアルスタックネットワークもサポートできません。このフィールドは、将来のAPIバージョンで削除される可能性があります。

（プロバイダー固有の）アノテーションを介してServiceのロードバランサーIPアドレスを指定することをサポートするプロバイダーと統合している場合は、その方法に切り替える必要があります。

Kubernetesとのロードバランサー統合のコードを作成している場合は、このフィールドの使用を避けてください。
Serviceではなく[Gateway](https://gateway-api.sigs.k8s.io/)と統合するか、同等の詳細を指定する独自の（プロバイダー固有の）アノテーションをServiceに定義できます。
{{< /note >}}

#### ロードバランサートラフィックへのノードの活性の影響

ロードバランサーのヘルスチェックは、最新のアプリケーションにとって重要です。これらは、ロードバランサーがトラフィックをディスパッチするサーバー（仮想マシン、またはIPアドレス）を決定するために使用されます。Kubernetes APIは、Kubernetes管理のロードバランサーに対してヘルスチェックをどのように実装するかを定義していません。代わりに、動作を決定するのはクラウドプロバイダー（および統合コードを実装する人々）です。ロードバランサーのヘルスチェックは、Serviceの`externalTrafficPolicy`フィールドをサポートするコンテキスト内で広く使用されています。

#### 混合プロトコルタイプのロードバランサー

{{< feature-state feature_gate_name="MixedProtocolLBService" >}}

デフォルトでは、LoadBalancerタイプのServiceの場合、複数のポートが定義されていると、すべてのポートが同じプロトコルである必要があり、そのプロトコルはクラウドプロバイダーによってサポートされているものである必要があります。

フィーチャーゲート`MixedProtocolLBService`（v1.24以降のkube-apiserverではデフォルトで有効）を使用すると、複数のポートが定義されている場合に、LoadBalancerタイプのServiceに異なるプロトコルを使用できます。

{{< note >}}
ロードバランシングされたServiceに使用できるプロトコルのセットは、クラウドプロバイダーによって定義されます。Kubernetes APIが強制するもの以上の制限を課す場合があります。
{{< /note >}}

#### ロードバランサーのNodePort割り当てを無効にする {#load-balancer-nodeport-allocation}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

フィールド`spec.allocateLoadBalancerNodePorts`を`false`に設定することで、`type: LoadBalancer`のServiceのノードポート割り当てをオプションで無効にできます。これは、ノードポートを使用するのではなく、Podに直接トラフィックをルーティングするロードバランサー実装にのみ使用する必要があります。デフォルトでは、`spec.allocateLoadBalancerNodePorts`は`true`であり、タイプLoadBalancerのServiceは引き続きノードポートを割り当てます。既存のServiceで`spec.allocateLoadBalancerNodePorts`が`false`に設定されている場合、割り当てられたノードポートは自動的に割り当て解除**されません**。それらのノードポートを割り当て解除するには、すべてのServiceポートの`nodePorts`エントリを明示的に削除する必要があります。

#### ロードバランサー実装のクラスを指定する {#load-balancer-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

`type`が`LoadBalancer`に設定されているServiceの場合、`.spec.loadBalancerClass`フィールドを使用すると、クラウドプロバイダーのデフォルト以外のロードバランサー実装を使用できます。

デフォルトでは、`.spec.loadBalancerClass`は設定されておらず、`LoadBalancer`タイプのServiceは、クラスターが`--cloud-provider`コンポーネントフラグを使用してクラウドプロバイダーで構成されている場合、クラウドプロバイダーのデフォルトのロードバランサー実装を使用します。

`.spec.loadBalancerClass`を指定すると、指定されたクラスに一致するロードバランサー実装がServiceを監視していると想定されます。
デフォルトのロードバランサー実装（例えば、クラウドプロバイダーによって提供されるもの）は、このフィールドが設定されているServiceを無視します。
`spec.loadBalancerClass`は、タイプ`LoadBalancer`のServiceにのみ設定できます。
一度設定すると変更できません。
`spec.loadBalancerClass`の値は、"`internal-vip`"や"`example.com/internal-vip`"などのオプションのプレフィックスを持つラベルスタイルの識別子である必要があります。
プレフィックスのない名前はエンドユーザー用に予約されています。

#### ロードバランサーIPアドレスモード {#load-balancer-ip-mode}

{{< feature-state feature_gate_name="LoadBalancerIPMode" >}}

`type: LoadBalancer`のServiceの場合、コントローラーは`.status.loadBalancer.ingress.ipMode`を設定できます。
`.status.loadBalancer.ingress.ipMode`は、ロードバランサーIPの動作を指定します。
これは、`.status.loadBalancer.ingress.ip`フィールドも指定されている場合にのみ指定できます。

`.status.loadBalancer.ingress.ipMode`には、「VIP」と「Proxy」の2つの可能な値があります。
デフォルト値は「VIP」で、トラフィックがロードバランサーのIPとポートに設定された宛先でノードに配信されることを意味します。
これを「Proxy」に設定する場合、クラウドプロバイダーからのロードバランサーがトラフィックをどのように配信するかに応じて、2つのケースがあります。

- トラフィックがノードに配信されてからPodにDNATされる場合、宛先はノードのIPとノードポートに設定されます。
- トラフィックがPodに直接配信される場合、宛先はPodのIPとポートに設定されます。

Serviceの実装は、この情報を使用してトラフィックルーティングを調整できます。

#### 内部ロードバランサー

混合環境では、同じ（仮想）ネットワークアドレスブロック内のServiceからのトラフィックをルーティングする必要がある場合があります。

スプリットホライズンDNS環境では、外部トラフィックと内部トラフィックの両方をエンドポイントにルーティングするために2つのServiceが必要になります。

内部ロードバランサーを設定するには、使用しているクラウドサービスプロバイダーに応じて、次のアノテーションのいずれかをServiceに追加します。

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
タブを選択してください。
{{% /tab %}}

{{% tab name="GCP" %}}

```yaml
metadata:
  name: my-service
  annotations:
    networking.gke.io/load-balancer-type: "Internal"
```
{{% /tab %}}
{{% tab name="AWS" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internal"
```

{{% /tab %}}
{{% tab name="Azure" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
```

{{% /tab %}}
{{% tab name="IBM Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.kubernetes.io/ibm-load-balancer-cloud-provider-ip-type: "private"
```

{{% /tab %}}
{{% tab name="OpenStack" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
```

{{% /tab %}}
{{% tab name="Baidu Cloud" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
```

{{% /tab %}}
{{% tab name="Tencent Cloud" %}}

```yaml
metadata:
  annotations:
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
```

{{% /tab %}}
{{% tab name="Alibaba Cloud" %}}

```yaml
metadata:
  annotations:
    service.beta.kubernetes.io/alibaba-cloud-loadbalancer-address-type: "intranet"
```

{{% /tab %}}
{{% tab name="OCI" %}}

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/oci-load-balancer-internal: true
```
{{% /tab %}}
{{< /tabs >}}

### `type: ExternalName` {#externalname}

ExternalNameタイプのServiceは、`my-service`や`cassandra`のような一般的なセレクターではなく、DNS名にServiceをマッピングします。`spec.externalName`パラメータでこれらのServiceを指定します。

例えば、このService定義は、`prod`名前空間内の`my-service` Serviceを`my.database.example.com`にマッピングします。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

{{< note >}}
`type: ExternalName`のServiceはIPv4アドレス文字列を受け入れますが、その文字列をIPアドレスとしてではなく、数字で構成されるDNS名として扱います（ただし、インターネットではDNSでそのような名前は許可されていません）。
IPv4アドレスに似た外部名を持つServiceは、DNSサーバーによって解決されません。

Serviceを特定のIPアドレスに直接マッピングしたい場合は、[Headless Service](#headless-services)の使用を検討してください。
{{< /note >}}

ホスト`my-service.prod.svc.cluster.local`を検索すると、クラスターDNS Serviceは値`my.database.example.com`を持つ`CNAME`レコードを返します。
`my-service`へのアクセスは他のServiceと同じように機能しますが、リダイレクトがプロキシや転送ではなくDNSレベルで行われるという重要な違いがあります。
後でデータベースをクラスター内に移動することにした場合は、そのPodを開始し、適切なセレクターまたはエンドポイントを追加し、Serviceの`type`を変更できます。

{{< caution >}}
HTTPやHTTPSなどの一般的なプロトコルでExternalNameを使用すると、問題が発生する場合があります。
ExternalNameを使用する場合、クラスター内のクライアントが使用するホスト名は、ExternalNameが参照する名前とは異なります。

ホスト名を使用するプロトコルの場合、この違いによりエラーや予期しない応答が発生する可能性があります。
HTTPリクエストには、オリジンサーバーが認識しない`Host:`ヘッダーが含まれます。
TLSサーバーは、クライアントが接続したホスト名に一致する証明書を提供できません。
{{< /caution >}}

## Headless Service {#headless-services}

ロードバランシングや単一のService IPが必要ない場合があります。
この場合、クラスターIPアドレス（`.spec.clusterIP`）に`"None"`を明示的に指定することで、_Headless Service_と呼ばれるものを作成できます。

Headless Serviceを使用すると、Kubernetesの実装に縛られることなく、他のサービスディスカバリーメカニズムと連携できます。

Headless Serviceの場合、クラスターIPは割り当てられず、kube-proxyはこれらのServiceを処理しません。また、プラットフォームによってロードバランシングやプロキシは行われません。

Headless Serviceを使用すると、クライアントは好みのPodに直接接続できます。HeadlessであるServiceは、[仮想IPアドレスとプロキシ](/ja/docs/reference/networking/virtual-ips/)を使用してルートとパケット転送を構成しません。代わりに、Headless Serviceは、クラスターの[DNSサービス](/ja/docs/concepts/services-networking/dns-pod-service/)を通じて提供される内部DNSレコードを介して、個々のPodのエンドポイントIPアドレスを報告します。
Headless Serviceを定義するには、`.spec.type`をClusterIP（これは`type`のデフォルトでもあります）に設定し、さらに`.spec.clusterIP`をNoneに設定したServiceを作成します。

文字列値Noneは特殊なケースであり、`.spec.clusterIP`フィールドを設定しないままにするのと同じではありません。

DNSが自動的に構成される方法は、Serviceにセレクターが定義されているかどうかによって異なります。

### セレクターあり

セレクターを定義するHeadless Serviceの場合、エンドポイントコントローラーはKubernetes APIにEndpointSlicesを作成し、ServiceをバックアップするPodを直接指すAまたはAAAAレコード（IPv4またはIPv6アドレス）を返すようにDNS構成を変更します。

### セレクターなし

セレクターを定義しないHeadless Serviceの場合、コントロールプレーンはEndpointSliceオブジェクトを作成しません。ただし、DNSシステムは以下を探して構成します。

* [`type: ExternalName`](#externalname) ServiceのDNS CNAMEレコード。
* `ExternalName`以外のすべてのServiceタイプの、Serviceの準備完了エンドポイントのすべてのIPアドレスのDNS A / AAAAレコード。
  * IPv4エンドポイントの場合、DNSシステムはAレコードを作成します。
  * IPv6エンドポイントの場合、DNSシステムはAAAAレコードを作成します。

セレクターなしでHeadless Serviceを定義する場合、`port`は`targetPort`と一致する必要があります。

## サービスの検出 {#discovering-services}

クラスター内で実行されているクライアントの場合、KubernetesはServiceを見つけるための2つの主要なモード（環境変数とDNS）をサポートしています。

### 環境変数

PodがNode上で実行されると、kubeletはアクティブな各Serviceに一連の環境変数を追加します。`{SVCNAME}_SERVICE_HOST`および`{SVCNAME}_SERVICE_PORT`変数を追加します。ここで、Service名は大文字になり、ダッシュはアンダースコアに変換されます。

例えば、TCPポート6379を公開し、クラスターIPアドレス10.0.0.11が割り当てられた`redis-primary`というServiceは、次の環境変数を生成します。

```shell
REDIS_PRIMARY_SERVICE_HOST=10.0.0.11
REDIS_PRIMARY_SERVICE_PORT=6379
REDIS_PRIMARY_PORT=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_PRIMARY_PORT_6379_TCP_PROTO=tcp
REDIS_PRIMARY_PORT_6379_TCP_PORT=6379
REDIS_PRIMARY_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
Serviceにアクセスする必要があるPodがあり、環境変数メソッドを使用してポートとクラスターIPをクライアントPodに公開している場合、クライアントPodが存在する*前に*Serviceを作成する必要があります。
そうしないと、それらのクライアントPodには環境変数が設定されません。

DNSのみを使用してServiceのクラスターIPを検出する場合、この順序の問題について心配する必要はありません。
{{< /note >}}

Kubernetesは、Docker Engineの「_[レガシーコンテナリンク](https://docs.docker.com/network/links/)_」機能と互換性のある変数もサポートおよび提供しています。
Kubernetesでこれがどのように実装されているかを確認するには、[`makeLinkVariables`](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)を読むことができます。

### DNS

[アドオン](/ja/docs/concepts/cluster-administration/addons/)を使用して、Kubernetesクラスター用のDNSサービスをセットアップできます（そして、ほぼ常にそうすべきです）。

CoreDNSなどのクラスター対応DNSサーバーは、新しいServiceについてKubernetes APIを監視し、それぞれに一連のDNSレコードを作成します。クラスター全体でDNSが有効になっている場合、すべてのPodはDNS名によってServiceを自動的に解決できるはずです。

例えば、Kubernetes名前空間`my-ns`に`my-service`というServiceがある場合、コントロールプレーンとDNSサービスが連携して`my-service.my-ns`のDNSレコードを作成します。`my-ns`名前空間内のPodは、`my-service`の名前検索を行うことでServiceを見つけることができるはずです（`my-service.my-ns`も機能します）。

他の名前空間のPodは、名前を`my-service.my-ns`として修飾する必要があります。これらの名前は、Serviceに割り当てられたクラスターIPに解決されます。

Kubernetesは、名前付きポートのDNS SRV（Service）レコードもサポートしています。`my-service.my-ns` Serviceにプロトコルが`TCP`に設定された`http`という名前のポートがある場合、`_http._tcp.my-service.my-ns`のDNS SRVクエリを実行して、`http`のポート番号とIPアドレスを検出できます。

Kubernetes DNSサーバーは、`ExternalName` Serviceにアクセスする唯一の方法です。
`ExternalName`解決の詳細については、[ServiceとPodのDNS](/ja/docs/concepts/services-networking/dns-pod-service/)を参照してください。

<!-- preserve existing hyperlinks -->
<a id="shortcomings" />
<a id="the-gory-details-of-virtual-ips" />
<a id="proxy-modes" />
<a id="proxy-mode-userspace" />
<a id="proxy-mode-iptables" />
<a id="proxy-mode-ipvs" />
<a id="ips-and-vips" />

## 仮想IPアドレスメカニズム

[仮想IPとサービスプロキシ](/ja/docs/reference/networking/virtual-ips/)を読むと、Kubernetesが仮想IPアドレスを使用してServiceを公開するために提供するメカニズムが説明されています。

### トラフィックポリシー

`.spec.internalTrafficPolicy`および`.spec.externalTrafficPolicy`フィールドを設定して、Kubernetesが健全な（「準備完了」）バックエンドにトラフィックをルーティングする方法を制御できます。

詳細については、[トラフィックポリシー](/ja/docs/reference/networking/virtual-ips/#traffic-policies)を参照してください。

### トラフィック分散 {#traffic-distribution}

{{< feature-state feature_gate_name="ServiceTrafficDistribution" >}}

`.spec.trafficDistribution`フィールドは、Kubernetes Service内のトラフィックルーティングに影響を与える別の方法を提供します。トラフィックポリシーは厳密な意味的保証に焦点を当てていますが、トラフィック分散を使用すると、_好み_（トポロジー的に近いエンドポイントへのルーティングなど）を表現できます。これにより、パフォーマンス、コスト、または信頼性を最適化できます。Kubernetes {{< skew currentVersion >}}では、次のフィールド値がサポートされています。

`PreferClose`
: クライアントと同じゾーンにあるエンドポイントへのトラフィックルーティングを優先することを示します。

{{< feature-state feature_gate_name="PreferSameTrafficDistribution" >}}

Kubernetes {{< skew currentVersion >}}では、2つの追加の値が利用可能です（`PreferSameTrafficDistribution` [フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が無効になっていない限り）:

`PreferSameZone`
: これは`PreferClose`のエイリアスであり、意図されたセマンティクスについてより明確です。

`PreferSameNode`
: クライアントと同じノードにあるエンドポイントへのトラフィックルーティングを優先することを示します。

フィールドが設定されていない場合、実装はデフォルトのルーティング戦略を適用します。

詳細については、[トラフィック分散](/ja/docs/reference/networking/virtual-ips/#traffic-distribution)を参照してください。

### セッションのスティッキネス {#session-stickiness}

特定のクライアントからの接続が毎回同じPodに渡されるようにしたい場合は、クライアントのIPアドレスに基づいてセッションアフィニティを構成できます。詳細については、[セッションアフィニティ](/ja/docs/reference/networking/virtual-ips/#session-affinity)を参照してください。

## External IPs

1つ以上のクラスターノードにルーティングする外部IPがある場合、Kubernetes Serviceはそれらの`externalIPs`で公開できます。ネットワークトラフィックがクラスターに到着し、外部IP（宛先IPとして）とポートがそのServiceと一致すると、Kubernetesが構成したルールとルートにより、トラフィックがそのServiceのエンドポイントの1つにルーティングされることが保証されます。

Serviceを定義するとき、任意の[Serviceタイプ](#publishing-services-service-types)に対して`externalIPs`を指定できます。
以下の例では、`"my-service"`という名前のServiceは、クライアントがTCPを使用して`"198.51.100.32:80"`（`.spec.externalIPs[]`と`.spec.ports[].port`から計算）でアクセスできます。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 49152
  externalIPs:
    - 198.51.100.32
```

{{< note >}}
Kubernetesは`externalIPs`の割り当てを管理しません。これらはクラスター管理者の責任です。
{{< /note >}}

## APIオブジェクト

Serviceは、Kubernetes REST APIのトップレベルリソースです。[Service APIオブジェクト](/ja/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)の詳細を確認できます。

## {{% heading "whatsnext" %}}

ServiceとそれらがKubernetesにどのように適合するかについて詳しく学びましょう:

* [Serviceを使用したアプリケーションの接続](/ja/docs/tutorials/services/connect-applications-service/)チュートリアルに従ってください。
* [Ingress](/ja/docs/concepts/services-networking/ingress/)について読んでください。これは、クラスターの外部からクラスター内のServiceへのHTTPおよびHTTPSルートを公開します。
* [Gateway](/ja/docs/concepts/services-networking/gateway/)について読んでください。これは、Ingressよりも柔軟性を提供するKubernetesの拡張機能です。

その他のコンテキストについては、以下をお読みください:

* [仮想IPとサービスプロキシ](/ja/docs/reference/networking/virtual-ips/)
* [EndpointSlices](/ja/docs/concepts/services-networking/endpoint-slices/)
* [Service APIリファレンス](/ja/docs/reference/kubernetes-api/service-resources/service-v1/)
* [EndpointSlice APIリファレンス](/ja/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* [Endpoint APIリファレンス (レガシー)](/ja/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
