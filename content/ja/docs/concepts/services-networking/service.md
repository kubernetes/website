---
title: Service
api_metadata:
- apiVersion: "v1"
  kind: "Service"
feature:
  title: サービスディスカバリと負荷分散
  description: >
    アプリケーションを変更して、なじみのないサービスディスカバリの仕組みを使用する必要はありません。KubernetesはPodに独自のIPアドレスと一連のPodに対する単一のDNS名を提供し、Pod間で負荷分散できます。
description: >-
  クラスター内で実行されているアプリケーションが、複数のバックエンドに分散している場合でも、単一のエンドポイントとして公開します。
content_type: concept
weight: 10
---


<!-- overview -->

{{< glossary_definition term_id="service" length="short" prepend="Kubernetesにおいて、Serviceとは、" >}}

KubernetesにおけるServiceの主要な目的の一つは、既存のアプリケーションを変更することなく、サービスディスカバリの仕組みを利用できるようにすることです。
Pod内で実行するコードは、クラウドネイティブな環境向けに設計されたものでも、コンテナ化した古いアプリケーションでも構いません。
Serviceを使用することで、その複数のPodがネットワーク上でアクセス可能になり、クライアントから通信できるようになります。

{{< glossary_tooltip term_id="deployment" >}}を使用してアプリケーションを実行する場合、DeploymentはPodを動的に作成、削除します。
常に、どれだけのPodが動作していて健全な状態であるかは分からず、健全なPodの名前すら分からない可能性もあります。
Kubernetesの{{< glossary_tooltip term_id="pod" text="Pod" >}}は、クラスターの望ましい状態に一致させるために作成、削除されます。
Podは一時的なリソースです(個々のPodに対して、信頼性が高く永続的であるとは期待すべきではありません)。

各Podは独自のIPアドレスを取得します(Kubernetesは、ネットワークプラグインがこれを保証することを期待しています)。
クラスター内の特定のDeploymentで、ある時点で実行されているPodの集合は、少し時が経過すると、異なるPodの集合になっている可能性があります。

これは、とある問題につながります。
Podの集合(「バックエンド」と呼びます)がクラスター内の他のPod(「フロントエンド」と呼びます)に機能を提供する場合、フロントエンドがワークロードのバックエンド部分を使用できるように、どのようにして接続対象のIPアドレスを発見し、追跡するのでしょうか？

ここで _Service_ の登場です。

<!-- body -->

## KubernetesにおけるService {#services-in-kubernetes}

Kubernetesの一部であるService APIは、Podのグループをネットワーク経由で公開するための抽象化です。
各Serviceオブジェクトは、エンドポイントの論理的な集合(通常、これらのエンドポイントはPodです)および、Podの公開方法についてのポリシーを定義します。

例として、3つのレプリカで実行されているステートレスな画像処理バックエンドについて考えます。
これらのレプリカは互いに代替可能です&mdash;フロントエンドはどのバックエンドを使用するかを気にしません。
バックエンドを構成する実際のPodは変化する可能性がありますが、フロントエンドのクライアントはそれを意識する必要はなく、バックエンドの集合を自身で追跡すべきでもありません。

Serviceという抽象化により、この分離が可能になります。

Serviceが対象とするPodは、通常、ユーザーが定義する{{< glossary_tooltip text="セレクター" term_id="selector" >}}によって決定されます。
Serviceのエンドポイントを定義する他の方法については、[セレクター _なし_ のService](#services-without-selectors)を参照してください。

ワークロードがHTTPを使用する場合、[Ingress](/docs/concepts/services-networking/ingress/)を使用して、Webトラフィックがワークロードに到達する方法を制御できます。
IngressはServiceタイプではありませんが、クラスターへのエントリーポイントとして機能します。
Ingressを使用すると、ルーティングルールを単一のリソースに統合できるため、クラスター内で個別に実行されている複数のワークロードコンポーネントを、単一のリスナーの背後で公開できます。

Kubernetesの[Gateway](https://gateway-api.sigs.k8s.io/#what-is-the-gateway-api) APIは、IngressやServiceを超える追加機能を提供します。
Gatewayは{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}を使用して実装された拡張APIの一種であり、クラスターに追加することで、クラスター内で実行されているネットワークサービスへのアクセスを設定できます。

### クラウドネイティブなサービスディスカバリ {#cloud-native-service-discovery}

アプリケーションでサービスディスカバリにKubernetes APIを使用できる場合、{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}に問い合わせて一致するEndpointSliceを取得できます。
KubernetesはService内のPodの集合が変更されるたびに、そのServiceのEndpointSliceを更新します。

ネイティブではないアプリケーションの場合、KubernetesはアプリケーションとバックエンドのPodの間にネットワークポートまたはロードバランサーを配置する方法を提供します。

いずれの場合でも、ワークロードはこれらの[サービスディスカバリ](#discovering-services)の仕組みを使用して、接続先を見つけることができます。

## Serviceの定義方法 {#defining-a-service}

Serviceは{{< glossary_tooltip text="オブジェクト" term_id="object" >}}です(PodやConfigMapがオブジェクトであるのと同じです)。
Kubernetes APIを使用してServiceの定義を作成、表示、変更できます。
通常は`kubectl`のようなツールを使用して、これらのAPI呼び出しを行います。

例えば、TCPポート9376でリッスンし、`app.kubernetes.io/name=MyApp`というラベルが付けられたPodの集合があるとします。
そのTCPリスナーを公開するServiceを定義できます:

{{% code_sample file="service/simple-service.yaml" %}}

このマニフェストを適用すると、デフォルトのClusterIP [Serviceタイプ](#publishing-services-service-types)で「my-service」という名前の新しいServiceが作成されます。
このServiceは、`app.kubernetes.io/name: MyApp`ラベルを持つすべてのPodのTCPポート9376を対象とします。

KubernetesはこのServiceに対してIPアドレス(_ClusterIP_)を割り当てます。
このIPアドレスは仮想IPアドレスメカニズムによって使用されます。
このメカニズムの詳細については、[仮想IPとServiceプロキシ](/docs/reference/networking/virtual-ips/)を参照してください。

このServiceのコントローラーは、セレクターに一致するPodを継続的にスキャンし、ServiceのEndpointSliceの集合に対して必要に応じて更新を行います。

Serviceオブジェクト名は、有効な[RFC 1035ラベル名](/docs/concepts/overview/working-with-objects/names#rfc-1035-label-names)である必要があります。

{{< note >}}
Serviceは _任意の_ 受信`port`を`targetPort`にマッピングできます。
ただし、デフォルトでは、利便性のために`targetPort`は`port`フィールドと同じ値に設定されます。
{{< /note >}}

### Serviceオブジェクトの緩和された命名要件 {#relaxed-naming-requirements-for-service-objects}

{{< feature-state feature_gate_name="RelaxedServiceNameValidation" >}}

`RelaxedServiceNameValidation`フィーチャーゲートは、Serviceオブジェクト名が数字で始まることを許可します。
このフィーチャーゲートが有効化されている場合、Serviceオブジェクト名は有効な[RFC 1123ラベル名](/docs/concepts/overview/working-with-objects/names/#dns-label-names)である必要があります。

### ポート定義 {#field-spec-ports}

Pod内のポート定義には名前が含まれ、Serviceの`targetPort`属性でこれらの名前を参照できます。
例えば、次のようにServiceの`targetPort`をPodのポートにバインドできます:

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

これは、Serviceに異なるポート番号で同じネットワークプロトコルを提供する複数のPodが混在している場合でも、単一の設定された名前を使用して機能します。
これにより、Serviceのデプロイと進化に大きな柔軟性がもたらされます。
たとえば、バックエンドソフトウェアの次のバージョンでPodが公開するポート番号を変更しても、クライアントを壊すことはありません。

Serviceのデフォルトプロトコルは[TCP](/docs/reference/networking/service-protocols/#protocol-tcp)です。
他の[サポートされているプロトコル](/docs/reference/networking/service-protocols/)も使用できます。

多くのServiceは複数のポートを公開する必要があるため、Kubernetesは単一のServiceに対して、[複数のポート定義](#multi-port-services)をサポートしています。
各ポート定義は、同じ`protocol`を持つことも、異なるものを持つことも可能です。

### セレクター無しのService {#services-without-selectors}

Serviceは、セレクターを使ってKubernetes Podへのアクセスを抽象化するのが一般的です。
ただし、セレクター無しで対応する{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}オブジェクトを使用すれば、クラスター外のバックエンドなど、他の種類のバックエンドも抽象化できます。

例えば:

* 本番環境では外部のデータベースクラスターを使用したいが、テスト環境では独自のデータベースを使用する場合。
* Serviceを別の{{< glossary_tooltip term_id="namespace" >}}または別のクラスター上のServiceに向けたい場合。
* ワークロードをKubernetesに移行中の場合。移行方法を評価している間は、バックエンドの一部のみをKubernetesで実行する場合。

これらのいずれのシナリオでも、Podに一致するセレクターを指定 _せずに_ Serviceを定義できます。
例えば:

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

このServiceにはセレクターが含まれないため、対応するEndpointSliceオブジェクトは自動的に作成されません。
EndpointSliceオブジェクトを手動で追加することで、Serviceを実行されているネットワークアドレスとポートにマッピングできます。
例えば、次のように定義します:

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-1 # 慣習で、EndpointSliceの名前にプレフィックスとしてService名を使用します

  labels:
    # "kubernetes.io/service-name"ラベルを設定する必要があります。
    # その値はServiceの名前と一致させてください
    kubernetes.io/service-name: my-service
addressType: IPv4
ports:
  - name: http # 上記で定義したServiceポート名と一致させる必要があります
    appProtocol: http
    protocol: TCP
    port: 9376
endpoints:
  - addresses:
      - "10.4.5.6"
  - addresses:
      - "10.1.2.3"
```

#### カスタムEndpointSlice {#custom-endpointslices}

Service用に[EndpointSlice](#endpointslices)オブジェクトを作成する場合、EndpointSliceには任意の名前を使用できます。
ただし、名前空間内の各EndpointSliceは一意の名前である必要があります。
EndpointSliceに`kubernetes.io/service-name` {{< glossary_tooltip text="ラベル" term_id="label" >}}を設定することで、EndpointSliceをServiceに関連付けられます。

{{< note >}}
エンドポイントのIPは次のものであっては　_いけません_: ループバック(IPv4の場合は127.0.0.0/8、IPv6の場合は::1/128)、またはリンクローカル(IPv4の場合は169.254.0.0/16と224.0.0.0/24、IPv6の場合はfe80::/64)。

エンドポイントIPアドレスは、他のKubernetes ServiceのClusterIPにすることはできません。
これは、{{< glossary_tooltip term_id="kube-proxy" >}}が宛先として仮想IPをサポートしていないためです。
{{< /note >}}

自身で作成するEndpointSlice、または独自のコード内で作成するEndpointSliceの場合、[`endpointslice.kubernetes.io/managed-by`](/docs/reference/labels-annotations-taints/#endpointslicekubernetesiomanaged-by)ラベルに使用する値も選択するべきです。
EndpointSliceを管理する独自のコントローラーコードを作成する場合は、`"my-domain.example/name-of-controller"`のような値の使用を検討してください。
サードパーティツールを使用している場合は、ツールの名前をすべて小文字で使用し、スペースやその他の句読点をダッシュ(`-`)に変更してください。
`kubectl`のようなツールを直接使用してEndpointSliceを管理する場合は、`"staff"`や`"cluster-admins"`のような、手動で管理していることを説明する名前を使用してください。
Kubernetes自身のコントロールプレーンによって管理されるEndpointSliceを識別する予約語である`"controller"`の使用は避けてください。

#### セレクターの無いServiceへのアクセス {#service-no-selector-access}

セレクターの無いServiceへのアクセスは、セレクターがある場合と同じように機能します。
セレクターの無いServiceの[例](#services-without-selectors)では、トラフィックはEndpointSliceマニフェストで定義された2つのエンドポイントのいずれかにルーティングされます: ポート9376上の10.1.2.3または10.4.5.6へのTCP接続です。

{{< note >}}
Kubernetes APIサーバーは、Podにマッピングされていないエンドポイントへのプロキシを許可しません。
`kubectl port-forward service/<service-name> forwardedPort:servicePort`のようなアクションは、Serviceにセレクターが無い場合、この制約により失敗します。
これにより、Kubernetes APIサーバーが、呼び出し元に未許可のエンドポイントへのプロキシとして使用されることを防ぐことができます。
{{< /note >}}

`ExternalName` Serviceは、セレクターを持たず、代わりにDNS名を使用するServiceの特殊なケースです。
詳細については、[ExternalName](#externalname)セクションを参照してください。

### EndpointSlice {#endpointslices}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

[EndpointSlice](/docs/concepts/services-networking/endpoint-slices/)は、Serviceの背後にあるネットワークエンドポイントのサブセット(_スライス_)を表すオブジェクトです。

Kubernetesクラスターは、各EndpointSliceが保持するエンドポイントの数を追跡します。
特定のServiceに紐づくエンドポイント数が多く、しきい値に達した場合、Kubernetesは新しい空のEndpointSliceを追加し、そこに新たなエンドポイント情報を保存します。
デフォルトでは、既存のすべてのEndpointSliceがそれぞれ、少なくとも100個のエンドポイントを含むと、Kubernetesは新しいEndpointSliceを作成します。
Kubernetesは、追加のエンドポイントを追加する必要性が生じるまで、新しいEndpointSliceを作成しません。

このAPIの詳細については、[EndpointSlice](/docs/concepts/services-networking/endpoint-slices/)を参照してください。

### Endpoints(非推奨) {#endpoints}

{{< feature-state for_k8s_version="v1.33" state="deprecated" >}}

EndpointSlice APIは、従来の[Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/) APIの後継です。
非推奨となったEndpoints APIには、EndpointSliceと比較していくつかの問題があります:

  - デュアルスタッククラスターをサポートしていません。
  - [trafficDistribution](/docs/concepts/services-networking/service/#traffic-distribution)のような新しい機能をサポートするために必要な情報が含まれていません。
  - エンドポイントのリストが単一のオブジェクトに収まらないほど長い場合、切り捨てられます。

このため、すべてのクライアントはEndpointsではなくEndpointSlice APIを使用することをお勧めします。

#### 容量超過のEndpoints {#over-capacity-endpoints}

Kubernetesでは、単一のEndpointsオブジェクトに格納できるエンドポイントの数は制限されています。
Serviceに1000個を超えるエンドポイントが存在する場合、KubernetesはEndpointsオブジェクト内のデータを切り捨てます。
Serviceは複数のEndpointSliceにリンクできるため、1000個という制限はレガシーのEndpoints APIにのみ影響します。

その場合、KubernetesはEndpointsオブジェクトに格納する最大1000個のバックエンドエンドポイントを選択し、Endpointsに[`endpoints.kubernetes.io/over-capacity: truncated`](/docs/reference/labels-annotations-taints/#endpoints-kubernetes-io-over-capacity)という{{< glossary_tooltip text="アノテーション" term_id="annotation" >}}を設定します。
コントロールプレーンはまた、バックエンドのPod数が1000未満に減少した場合、このアノテーションを削除します。

トラフィックは引き続きバックエンドに送信されますが、レガシーのEndpoints APIに依存するロードバランシング機構は、利用可能なバックエンドのエンドポイントのうち最大1000個にのみトラフィックを送信します。

同様に、APIの制限によって、Endpointsを手動で更新して1000個を超えるエンドポイントを持つようにすることはできません。

### アプリケーションプロトコル {#application-protocol}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

`appProtocol`フィールドは、各Serviceポートに対してアプリケーションプロトコルを指定する方法を提供します。
これは、実装が理解するプロトコルに対して、より豊かな動作を提供するためのヒントとして使用されます。
このフィールドの値は、対応するEndpointsおよびEndpointSliceオブジェクトによってミラーリングされます。

このフィールドは、標準のKubernetesラベル構文に従います。有効な値は次のいずれかです:

* [IANA標準サービス名](https://www.iana.org/assignments/service-names)。

* `mycompany.com/my-custom-protocol`のような実装定義のプレフィックス付きの名前。

* Kubernetes定義のプレフィックス付きの名前:

| プロトコル | 説明 |
|----------|-------------|
| `kubernetes.io/h2c` | [RFC 7540](https://www.rfc-editor.org/rfc/rfc7540)で説明されている平文のHTTP/2 |
| `kubernetes.io/ws`  | [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455)で説明されている平文のWebSocket |
| `kubernetes.io/wss` | [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455)で説明されているTLS上のWebSocket |

### マルチポートService {#multi-port-services}

一部のServiceでは、複数のポートを公開する必要があります。
Kubernetesでは、単一のServiceオブジェクトに複数のポート定義を設定できます。
Serviceに複数のポートを使用する場合、曖昧さを避けるために、すべてのポートに名前を付ける必要があります。
例えば、下記のように設定します:

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
Kubernetesの{{< glossary_tooltip term_id="name" text="名前">}}全般と同様に、ポート名は小文字の英数字と`-`のみを含む必要があります。
ポート名は英数字で始まり、英数字で終わる必要もあります。

例えば、`123-abc`や`web`という名前は有効ですが、`123_abc`や`-web`は無効です。
{{< /note >}}

## Serviceタイプ {#publishing-services-service-types}

アプリケーションの一部(例えば、フロントエンド)で、Serviceをクラスターの外部からアクセス可能な外部IPアドレスとして公開したい場合があります。

KubernetesのServiceタイプを使用すると、必要なServiceの種類を指定できます。

利用可能な`type`の値とその動作は次の通りです:

[`ClusterIP`](#type-clusterip)
: クラスター内部のIPでServiceを公開します。この値を選択すると、Serviceはクラスター内からのみ到達可能になります。これは、Serviceに対して明示的に`type`を指定しない場合に使用されるデフォルトです。[Ingress](/docs/concepts/services-networking/ingress/)または[Gateway](https://gateway-api.sigs.k8s.io/)を使用して、Serviceをパブリックインターネットに公開できます。

[`NodePort`](#type-nodeport)
: 各ノードのIPの静的ポート(`NodePort`)でServiceを公開します。NodePortを利用可能にするために、Kubernetesは、`type: ClusterIP`のServiceを要求した場合と同じように、ClusterIPアドレスを設定します。

[`LoadBalancer`](#loadbalancer)
: 外部のロードバランサーを使用してServiceを外部に公開します。Kubernetesはロードバランシングコンポーネントを直接提供しないため、独自に提供するか、Kubernetesクラスターをクラウドプロバイダーと統合する必要があります。

[`ExternalName`](#externalname)
: Serviceを`externalName`フィールドの内容(例えば、ホスト名`api.foo.bar.example`)にマッピングします。このマッピングにより、クラスターのDNSサーバーがその外部ホスト名の値を持つ`CNAME`レコードを返すように設定されます。いかなる種類のプロキシも設定されません。

Service APIの`type`フィールドは階層的な機能として設計されており、上位のタイプは下位のタイプの機能を含みます。
ただし、この階層的な設計には例外があります。
[ロードバランサーの`NodePort`割り当てを無効にする](/docs/concepts/services-networking/service/#load-balancer-nodeport-allocation)ことで、`LoadBalancer` Serviceを定義できます。

### `type: ClusterIP` {#type-clusterip}

このデフォルトのServiceタイプでは、クラスターが予約済みのIPアドレスプールからIPアドレスが割り当てられます。

他のいくつかのServiceタイプは、`ClusterIP`タイプを基盤として構築されています。

`.spec.clusterIP`を`"None"`に設定したServiceを定義すると、KubernetesはIPアドレスを割り当てません。
詳細については、[ヘッドレスService](#headless-services)を参照してください。

#### 独自のIPアドレスの選択 {#choosing-your-own-ip-address}

`Service`作成リクエストの一部として、独自のclusterIPアドレスを指定できます。
指定するためには、`.spec.clusterIP`フィールドを設定します。
例えば、再利用したい既存のDNSエントリがある場合や、特定のIPアドレス用に設定されていて再設定が困難なレガシーシステムがある場合などです。

選択するIPアドレスは、APIサーバーに設定されている`service-cluster-ip-range` CIDR範囲内の有効なIPv4またはIPv6アドレスである必要があります。
無効な`clusterIP`アドレスの値でServiceを作成しようとすると、APIサーバーは問題が発生したことを示す422 HTTPステータスコードを返します。

Kubernetesがどのように、2つの異なるServiceが同じIPアドレスを使用しようとする際のリスクと影響を軽減するかについては、[衝突の回避](/docs/reference/networking/virtual-ips/#avoiding-collisions)を参照してください。

### `type: NodePort` {#type-nodeport}

`type`フィールドを`NodePort`に設定すると、Kubernetesコントロールプレーンは`--service-node-port-range`フラグで指定された範囲(デフォルト: 30000-32767)からポートを割り当てます。
各ノードはそのポート(すべてのノードで同じポート番号)をServiceにプロキシします。
割り当てられたポートは、Serviceの`.spec.ports[*].nodePort`フィールドで確認できます。

NodePortを使用すると、独自のロードバランシングソリューションのセットアップや、Kubernetesで完全にサポートされていない環境の構成、あるいはノードのIPアドレスの直接公開さえ可能になります。

NodePortタイプのServiceの場合、Kubernetesはさらにポート(Serviceのプロトコルに合わせてTCP、UDP、またはSCTP)を割り当てます。
クラスター内のすべてのノードは、割り当てられたポートをリッスンし、Serviceに関連付けられた準備完了状態のエンドポイントの1つにトラフィックを転送するように自身を構成します。
適切なプロトコル(例: TCP)と適切なポート(そのServiceに割り当てられたポート)を使用して任意のノードに接続することで、クラスター外から`type: NodePort`のServiceにアクセスできます。

#### 独自のポート選択 {#nodeport-custom-port}

特定のポート番号が必要な場合は、`nodePort`フィールドに値を指定できます。
コントロールプレーンはそのポートを割り当てるか、APIのトランザクションが失敗したことを報告します。
つまり、ポートの衝突を自分で処理する必要があります。
また、NodePortによる使用のために設定された範囲内の有効なポート番号を使用する必要があります。

以下は、NodePort値(この例では、30007)を指定した`type: NodePort`のServiceのマニフェストの例です:

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
      # デフォルトでは、利便性のために`targetPort`は
      # `port`フィールドと同じ値に設定されます。
      targetPort: 80
      # オプションのフィールド
      # デフォルトでは、利便性のためにKubernetesコントロールプレーンは
      # 範囲(デフォルト: 30000-32767)からポートを割り当てます
      nodePort: 30007
```

#### ポート衝突を避けるためのNodePort範囲の予約 {#avoid-nodeport-collisions}

NodePortサービスへのポート割り当てのポリシーは、自動割り当てと手動割り当ての両方のシナリオに適用されます。
ユーザーが特定のポートを使用するNodePortサービスを作成する場合、ターゲットポートはすでに割り当てられている別のポートと競合する可能性があります。

この問題を回避するため、NodePortサービスのポート範囲は2つの帯域に分割されています。
動的なポート割り当てはデフォルトで上位の帯域を使用し、上位の帯域が使い尽くされると下位帯域を使用することがあります。
ユーザーは、下位の帯域から割り当てることでポート衝突のリスクを低減することができます。

#### `type: NodePort` ServiceのカスタムIPアドレス設定 {#service-nodeport-custom-listen-address}

NodePortサービスを提供するために特定のIPアドレスを使用するよう、クラスター内のノードを設定できます。
各ノードが複数のネットワークに接続されている場合(例: アプリケーショントラフィック用のネットワークと、ノード間およびコントロールプレーン間のトラフィック用の別のネットワーク)に、この設定が必要になることがあります。

ポートをプロキシする特定のIPアドレスを指定する場合は、kube-proxyの`--nodeport-addresses`フラグ、または[kube-proxy設定ファイル](/docs/reference/config-api/kube-proxy-config.v1alpha1/)の同等の`nodePortAddresses`フィールドを特定のIPブロックに設定できます。

このフラグは、カンマ区切りのIPブロックリスト(例: `10.0.0.0/8`、`192.0.2.0/25`)を受け取り、kube-proxyがこのノードのローカルとみなすIPアドレス範囲を指定します。

例えば、`--nodeport-addresses=127.0.0.0/8`フラグでkube-proxyを起動すると、kube-proxyはNodePortサービスに対してループバックインターフェースのみを選択します。
`--nodeport-addresses`のデフォルトは空のリストです。
これは、kube-proxyがNodePortに対して利用可能なすべてのネットワークインターフェースを考慮する必要があることを意味します。(これは以前のKubernetesリリースとも互換性があります。)
{{< note >}}
このServiceは`<NodeIP>:spec.ports[*].nodePort`および`.spec.clusterIP:spec.ports[*].port`として表示されます。
kube-proxyの`--nodeport-addresses`フラグまたはkube-proxy設定ファイルの同等のフィールドが設定されている場合、`<NodeIP>`はフィルタリングされたノードのIPアドレス(または複数のIPアドレスの可能性)になります。
{{< /note >}}

### `type: LoadBalancer` {#loadbalancer}

外部ロードバランサーをサポートするクラウドプロバイダーでは、`type`フィールドを`LoadBalancer`に設定すると、Service向けにロードバランサーがプロビジョニングされます。
実際のロードバランサーの作成は非同期で行われ、プロビジョニングされたバランサーに関する情報はServiceの`.status.loadBalancer`フィールドで公開されます。
たとえば、次のように設定します:

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

外部ロードバランサーからのトラフィックはバックエンドのPodに転送されます。
負荷分散の方法は、クラウドプロバイダーが決定します。

`type: LoadBalancer`のServiceを実装するために、Kubernetesは通常、まず`type: NodePort`のServiceをリクエストした場合と同等の変更を行います。
その後、cloud-controller-managerコンポーネントが外部ロードバランサーを設定し、割り当てられたNodePortにトラフィックを転送します。

クラウドプロバイダーの実装でサポートされている場合、LoadBalancerタイプのServiceを設定してNodePortの割り当てを[省略](#load-balancer-nodeport-allocation)できます。

一部のクラウドプロバイダーでは`loadBalancerIP`を指定できます。
その場合、ユーザーが指定した`loadBalancerIP`でロードバランサーが作成されます。
`loadBalancerIP`フィールドが指定されていない場合、ロードバランサーは一時的なIPアドレスで設定されます。
`loadBalancerIP`を指定しても、クラウドプロバイダーがこの機能をサポートしていない場合、設定した`loadbalancerIP`フィールドは無視されます。

{{< note >}}
Serviceの`.spec.loadBalancerIP`フィールドはKubernetes v1.24で非推奨になりました。

このフィールドは仕様が不十分で、実装によって意味が異なっていました。
また、デュアルスタックネットワーキングをサポートできません。
このフィールドは将来のAPIバージョンで削除される可能性があります。

(プロバイダー固有の)アノテーションを介してServiceのロードバランサーIPアドレスの指定をサポートするプロバイダーと統合する場合は、その方法に切り替えてください。

Kubernetesとロードバランサーの統合コードを書いている場合は、このフィールドの使用を避けてください。
Serviceではなく[Gateway](https://gateway-api.sigs.k8s.io/)と統合するか、同等の詳細を指定するService上の独自の(プロバイダー固有の)アノテーションを定義できます。
{{< /note >}}

#### ロードバランサートラフィックに対するノードの可用性の影響　{#node-liveness-impact-on-load-balancer-traffic}

ロードバランサーによるヘルスチェックは現代のアプリケーションにとって重要です。
これらはロードバランサーがトラフィックをディスパッチするサーバー(仮想マシンまたはIPアドレス)を決定するために使用されます。
Kubernetes APIはKubernetesが管理するロードバランサーに対してヘルスチェックをどのように実装する必要があるかを定義していません。
代わりに、クラウドプロバイダー(および統合コードを実装する人々)によって動作が決定されます。
ロードバランサーによるヘルスチェックはServiceの`externalTrafficPolicy`フィールドをサポートする文脈で広く使用されています。

#### 混合プロトコルタイプのロードバランサー {#load-balancers-with-mixed-protocol-types}

{{< feature-state feature_gate_name="MixedProtocolLBService" >}}

デフォルトでは、LoadBalancerタイプのServiceで複数のポートが定義されている場合、すべてのポートは同じプロトコルを持つ必要があり、そのプロトコルはクラウドプロバイダーがサポートするものでなければなりません。

フィーチャーゲート`MixedProtocolLBService`(v1.24以降のkube-apiserverではデフォルトで有効)により、複数のポートが定義されている場合、LoadBalancerタイプのServiceで異なるプロトコルを使用できます。

{{< note >}}
ロードバランサーServiceで使用できるプロトコルのセットは、クラウドプロバイダーによって定義されます。
クラウドプロバイダーは、Kubernetes APIが強制する制限を超えた追加の制限を課す場合があります。
{{< /note >}}

#### ロードバランサーによるNodePort割り当ての無効化 {#load-balancer-nodeport-allocation}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

`spec.allocateLoadBalancerNodePorts`フィールドを`false`に設定することで、`type: LoadBalancer`のServiceに対するNodePort割り当てをオプションで無効にできます。
これは、NodePortを使用せずに、トラフィックをPodに直接ルーティングするロードバランサー実装に対してのみ使用してください。
デフォルトでは、`spec.allocateLoadBalancerNodePorts`は`true`であり、LoadBalancerタイプのServiceは引き続きNodePortを割り当てます。
既に割り当て済みのNodePortを持つ既存のServiceに対して`spec.allocateLoadBalancerNodePorts`を`false`に設定しても、それらのNodePortは自動的に割り当て解除**されません**。
NodePortの割り当てを解除するには、すべてのServiceポートの`nodePorts`エントリを明示的に削除する必要があります。

#### ロードバランサー実装のクラスの指定 {#load-balancer-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

`type`が`LoadBalancer`に設定されたServiceの場合、`.spec.loadBalancerClass`フィールドを使用すると、クラウドプロバイダーのデフォルト以外のロードバランサー実装を使用できます。

デフォルトでは、`.spec.loadBalancerClass`は設定されておらず、クラスターが`--cloud-provider`コンポーネントフラグを使用してクラウドプロバイダーで設定されている場合、`LoadBalancer`タイプのServiceはクラウドプロバイダーのデフォルトロードバランサー実装を使用します。

`.spec.loadBalancerClass`を指定すると、指定されたクラスに一致するロードバランサー実装がServiceを監視していると想定されます。
デフォルトのロードバランサー実装(たとえば、クラウドプロバイダーが提供するもの)は、このフィールドが設定されたServiceを無視します。
`spec.loadBalancerClass`は`LoadBalancer`タイプのServiceにのみ設定できます。
一度設定すると、変更できません。
`spec.loadBalancerClass`の値はラベル形式の識別子である必要があり、"`internal-vip`"や"`example.com/internal-vip`"などのプレフィックスをオプションとして持つことができます。
プレフィックスのない名前はエンドユーザー向けに予約されています。

#### ロードバランサーのIPアドレスモード {#load-balancer-ip-mode}

{{< feature-state feature_gate_name="LoadBalancerIPMode" >}}

`type: LoadBalancer`のServiceの場合、コントローラーは`.status.loadBalancer.ingress.ipMode`を設定できます。
`.status.loadBalancer.ingress.ipMode`は、ロードバランサーIPの動作方法を指定します。
これは`.status.loadBalancer.ingress.ip`フィールドも指定されている場合にのみ指定できます。

`.status.loadBalancer.ingress.ipMode`には、「VIP」と「Proxy」の2つの値が設定できます。
デフォルト値は「VIP」で、これはトラフィックがロードバランサーのIPとポートを宛先として設定された状態でNodeに配信されることを意味します。
「Proxy」に設定する場合、クラウドプロバイダーのロードバランサーがトラフィックを配信する方法に応じて、2つのケースがあります:

- トラフィックがノードに配信されてからPodにDNATされる場合、宛先はノードのIPとNodePortに設定されます。
- トラフィックがPodに直接配信される場合、宛先はPodのIPとポートに設定されます。

Service実装はこの情報を使用してトラフィックルーティングを調整できます。

#### 内部ロードバランサー {#internal-load-balancer}

混在環境では、同じ(仮想)ネットワークアドレスブロック内のServiceからトラフィックをルーティングする必要がある場合があります。

スプリットホライズンDNS環境では、エンドポイントへの外部トラフィックと内部トラフィックの両方をルーティングできるように、2つのServiceが必要です。

内部ロードバランサーを設定するには、使用しているクラウドサービスプロバイダーに応じて、次のいずれかのアノテーションをServiceに追加します:

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
いずれかのタブを選択してください。
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

ExternalNameタイプのServiceは、`my-service`や`cassandra`のような典型的なセレクターではなく、ServiceをDNS名にマッピングします。
これらのServiceは`spec.externalName`パラメーターで指定します。

たとえば、このServiceの定義は、`prod`Namespace内の`my-service` Serviceを`my.database.example.com`にマッピングします:

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
`type: ExternalName`のServiceはIPv4アドレスの文字列を受け入れますが、文字列をIPアドレスとしてではなく、数字で構成されたDNS名として扱います(ただし、インターネットでは、DNSにそのような名前を設定することは許可されていません)。
IPv4アドレスに似た外部名を持つServiceはDNSサーバーによって解決されません。

ServiceをIPアドレスに直接マッピングしたい場合は、[ヘッドレスService](#headless-services)の使用を検討してください。
{{< /note >}}

ホスト`my-service.prod.svc.cluster.local`を検索すると、クラスターのDNSサービスは`my.database.example.com`を持つ`CNAME`レコードを返します。
`my-service`へのアクセスは他のServiceと同じように機能しますが、重要な違いは、リダイレクトがプロキシや転送を介してではなく、DNSレベルで発生することです。
後でデータベースをクラスター内に移動することにした場合、Podを起動し、適切なセレクターまたはエンドポイントを追加し、Serviceの`type`を変更できます。

{{< caution >}}
ExternalNameを使用すると、HTTPやHTTPSを含む一部の一般的なプロトコルで問題が発生する可能性があります。
ExternalNameを使用する場合、クラスター内のクライアントが使用するホスト名は、ExternalNameが参照する名前とは異なります。

ホスト名を使用するプロトコルの場合、この違いによりエラーや予期しないレスポンスが発生する可能性があります。
HTTPリクエストには、オリジンサーバーが認識しない`Host:`ヘッダーが含まれます。
TLSサーバーは、クライアントが接続したホスト名と一致する証明書を提供できません。
{{< /caution >}}

## ヘッドレスService {#headless-services}

時には、負荷分散や単一のService IPが不要な場合があります。
この場合、ClusterIPアドレス(`.spec.clusterIP`)に明示的に`"None"`を指定することで、いわゆる _ヘッドレスService_ を作成できます。

ヘッドレスServiceを使用すると、Kubernetesの実装に縛られることなく、他のサービスディスカバリ機構と連携できます。

ヘッドレスServiceの場合、ClusterIPは割り当てられず、kube-proxyはこれらのServiceを処理せず、プラットフォームによる負荷分散やプロキシは行われません。

ヘッドレスServiceにより、クライアントは好みのPodに直接接続できます。
ヘッドレスServiceは[仮想IPアドレスとプロキシ](/docs/reference/networking/virtual-ips/)を使用してルートやパケット転送を設定しません。
その代わりに、ヘッドレスServiceはクラスターの[DNSサービス](/docs/concepts/services-networking/dns-pod-service/)を通じて提供される内部DNSレコードを介して、個々のPodのエンドポイントIPアドレスを報告します。
ヘッドレスServiceを定義するには、`.spec.type`をClusterIPに設定し(`type`のデフォルトでもあります)、さらに`.spec.clusterIP`をNoneに設定します。

文字列値のNoneは特殊なケースであり、`.spec.clusterIP`フィールドを未設定のままにすることとは異なります。

DNSが自動的に設定される方法は、Serviceにセレクターが定義されているかどうかによって異なります:

### セレクターありの場合 {#with-selectors}

セレクターを定義するヘッドレスServiceの場合、エンドポイントコントローラーはKubernetes APIでEndpointSliceを作成し、ServiceのPodを直接指すAまたはAAAAレコード(IPv4またはIPv6アドレス)を返すようにDNS設定を変更します。

### セレクターなしの場合 {#without-selectors}

セレクターを定義しないヘッドレスServiceの場合、コントロールプレーンはEndpointSliceオブジェクトを作成しません。
ただし、DNSシステムは次のいずれかを検索して設定します:

* [`type: ExternalName`](#externalname) ServiceのDNS CNAMEレコード
* `ExternalName`以外のすべてのServiceタイプについて、Serviceの準備完了エンドポイントのすべてのIPアドレスに対するDNS A/AAAAレコード
  * IPv4エンドポイントの場合、DNSシステムはAレコードを作成します。
  * IPv6エンドポイントの場合、DNSシステムはAAAAレコードを作成します。

セレクターなしでヘッドレスServiceを定義する場合、`port`は`targetPort`と一致する必要があります。

## Serviceの検出 {#discovering-services}

クラスター内で実行されているクライアントに対して、Kubernetesは、環境変数とDNSという2つの主要なServiceの検出方法をサポートしています。

### 環境変数 {#environment-variables}

Podがノード上で実行されると、kubeletはアクティブな各Serviceに対して環境変数のセットを追加します。
`{SVCNAME}_SERVICE_HOST`と`{SVCNAME}_SERVICE_PORT`変数が追加されます。
ここで、Service名は大文字に変換され、ダッシュはアンダースコアに変換されます。

たとえば、TCPポートとして6379を公開し、ClusterIPアドレスとして10.0.0.11が割り当てられたService `redis-primary`は、次の環境変数を生成します:

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
PodがServiceにアクセスする必要があり、環境変数を使用してポートとClusterIPをクライアントPodに公開する場合、クライアントPodが作成される*前に*Serviceを作成する必要があります。
そうしないと、クライアントPodに環境変数が設定されません。

DNSのみを使用してServiceのClusterIPを検出する場合は、この順序の問題を気にする必要はありません。
{{< /note >}}

Kubernetesは、Docker Engineの「_[レガシーコンテナリンク](https://docs.docker.com/network/links/)_」機能と互換性のある変数もサポートし、提供しています。
これが、Kubernetesにおいて、どのように実装されているかを確認するには、[`makeLinkVariables`](https://github.com/kubernetes/kubernetes/blob/dd2d12f6dc0e654c15d5db57a5f9f6ba61192726/pkg/kubelet/envvars/envvars.go#L72)を参照してください。

### DNS {#dns}

[アドオン](/docs/concepts/cluster-administration/addons/)を使用して、KubernetesクラスターのDNSサービスを設定できます(そしてほぼ常に設定すべきです)。

CoreDNSなどのクラスター対応のDNSサーバーは、新しいServiceについてKubernetes APIを監視し、それぞれに対してDNSレコードのセットを作成します。
クラスター全体でDNSが有効になっている場合、すべてのPodはDNS名によってServiceを自動的に解決できるはずです。

たとえば、KubernetesのNamespace `my-ns`に`my-service`というServiceがある場合、コントロールプレーンとDNS Serviceが連携して`my-service.my-ns`のDNSレコードを作成します。
`my-ns` Namespace内のPodは、`my-service`の名前検索を行うことでServiceを見つけることができるはずです(`my-service.my-ns`も機能します)。

他のNamespace内のPodは、名前を`my-service.my-ns`として修飾する必要があります。
これらの名前は、Serviceに割り当てられたClusterIPに解決されます。

Kubernetesは、名前付きポートに対するDNS SRV(Service)レコードもサポートしています。
`my-service.my-ns` Serviceにプロトコルが`TCP`に設定された`http`という名前のポートがある場合、`_http._tcp.my-service.my-ns`に対してDNS SRVクエリを実行して、`http`のポート番号とIPアドレスを検出できます。

Kubernetes DNSサーバーは、`ExternalName` Serviceにアクセスする唯一の方法です。
`ExternalName`の解決に関する詳細情報は、[ServiceとPodに対するDNS](/docs/concepts/services-networking/dns-pod-service/)を参照してください。

<!-- preserve existing hyperlinks -->
<a id="shortcomings" />
<a id="the-gory-details-of-virtual-ips" />
<a id="proxy-modes" />
<a id="proxy-mode-userspace" />
<a id="proxy-mode-iptables" />
<a id="proxy-mode-ipvs" />
<a id="ips-and-vips" />

## 仮想IPアドレッシング機構 {#virtual-ip-addressing-mechanism}

[仮想IPとServiceプロキシ](/docs/reference/networking/virtual-ips/)では、Kubernetesが仮想IPアドレスを使用してServiceを公開するために提供する機構について詳しく説明しています。

### トラフィックポリシー {#traffic-policies}

`.spec.internalTrafficPolicy`および`.spec.externalTrafficPolicy`フィールドを設定して、Kubernetesが正常な("ready")バックエンドにトラフィックをルーティングする方法を制御できます。

詳細については、[トラフィックポリシー](/docs/reference/networking/virtual-ips/#traffic-policies)を参照してください。

### トラフィック分散 {#traffic-distribution}

{{< feature-state feature_gate_name="ServiceTrafficDistribution" >}}

`.spec.trafficDistribution`フィールドは、Kubernetes Service内のトラフィックルーティングに影響を与える別の方法を提供します。
トラフィックポリシーが厳密なセマンティック保証に焦点を当てているのに対し、トラフィック分散では _優先設定_(トポロジ的に近いエンドポイントへのルーティングなど)を表現できます。
これにより、パフォーマンス、コスト、または信頼性の最適化に役立ちます。
Kubernetes {{< skew currentVersion >}}では、次のフィールド値がサポートされています:

`PreferClose`
: クライアントと同じゾーンにあるエンドポイントへのトラフィックルーティングの優先設定を示します。

{{< feature-state feature_gate_name="PreferSameTrafficDistribution" >}}

Kubernetes {{< skew currentVersion >}}では、(`PreferSameTrafficDistribution` [フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)が無効になっていない限り)2つの追加の値が利用可能です:

`PreferSameZone`
: これは`PreferClose`のエイリアスで、意図されたセマンティクスについてより明確です。

`PreferSameNode`
: クライアントと同じノード上にあるエンドポイントへのトラフィックルーティングの優先設定を示します。

フィールドが設定されていない場合、実装はデフォルトのルーティング戦略を適用します。

詳細については、[トラフィック分散](/docs/reference/networking/virtual-ips/#traffic-distribution)を参照してください。

### スティッキーセッション {#session-stickiness}

特定のクライアントからの接続が毎回同じPodに渡されるようにしたい場合、クライアントのIPアドレスに基づいてセッションアフィニティを設定できます。
詳細については、[セッションアフィニティ](/docs/reference/networking/virtual-ips/#session-affinity)を参照してください。

## ExternalIPs {#external-ips}

もし、1つ以上のクラスターノードに転送するexternalIPが複数ある場合、Kubernetes Serviceはそれらの`externalIPs`で公開できます。
externalIP(宛先IPとして)とServiceに一致するポートでネットワークトラフィックがクラスターに到着すると、Kubernetesが設定したルールとルートにより、トラフィックがそのServiceのエンドポイントの1つにルーティングされることが保証されます。

Serviceを定義する際、任意の[Serviceタイプ](#publishing-services-service-types)に対して`externalIPs`を指定できます。
以下の例では、`"my-service"`という名前のServiceは、`"198.51.100.32:80"`(`.spec.externalIPs[]`と`.spec.ports[].port`から計算)でTCPを使用してクライアントからアクセスできます。

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
Kubernetesは`externalIPs`の割り当てを管理しません。
これらはクラスター管理者の責任です。
{{< /note >}}

## APIオブジェクト {#api-object}

ServiceはKubernetes REST APIにおいてトップレベルのリソースです。
詳細については、[Service APIオブジェクト](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)を参照してください。

## {{% heading "whatsnext" %}}

Serviceと、それがKubernetesにどのように適合するかについて、さらに学習してください:

* [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)のチュートリアルに従ってください。
* [Ingress](/docs/concepts/services-networking/ingress/)を参照してください。Ingressは、クラスター外部からクラスター内のServiceへのHTTPおよびHTTPSルートを公開します。
* [Gateway](/docs/concepts/services-networking/gateway/)を参照してください。GatewayはKubernetesの拡張機能で、Ingressよりも柔軟性を提供します。

さらなる背景情報については、以下を参照してください:

* [仮想IPとServiceプロキシ](/docs/reference/networking/virtual-ips/)
* [EndpointSlice](/docs/concepts/services-networking/endpoint-slices/)
* [Service APIのリファレンス](/docs/reference/kubernetes-api/service-resources/service-v1/)
* [EndpointSlice APIのリファレンス](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/)
* [Endpoint APIのリファレンス(レガシー)](/docs/reference/kubernetes-api/service-resources/endpoints-v1/)
