---
title: Service
feature:
  title: サービスディスカバリーと負荷分散
  description: >
    Kubernetesでは、なじみのないサービスディスカバリーのメカニズムを使用するためにユーザーがアプリケーションの修正をする必要はありません。KubernetesはPodにそれぞれのIPアドレス割り振りや、Podのセットに対する単一のDNS名を提供したり、それらのPodのセットに対する負荷分散が可能です。

content_type: concept
weight: 10
---


<!-- overview -->

{{< glossary_definition term_id="service" length="short" >}}

Kubernetesでは、なじみのないサービスディスカバリーのメカニズムを使用するためにユーザーがアプリケーションの修正をする必要はありません。
KubernetesはPodにそれぞれのIPアドレス割り振りや、Podのセットに対する単一のDNS名を提供したり、それらのPodのセットに対する負荷分散が可能です。



<!-- body -->

## Serviceを利用する動機

Kubernetes {{< glossary_tooltip term_id="pod" text="Pod" >}}はクラスターの状態に合わせて作成され削除されます。Podは揮発的なリソースです。
{{< glossary_tooltip term_id="deployment" >}}をアプリケーションを稼働させるために使用すると、Podを動的に作成・削除してくれます。

各Podはそれ自身のIPアドレスを持ちます。しかしDeploymentでは、ある時点において同時に稼働しているPodのセットは、その後のある時点において稼働しているPodのセットとは異なる場合があります。

この仕組みはある問題を引き起こします。もし、あるPodのセット(ここでは"バックエンド"と呼びます)がクラスター内で他のPodのセット(ここでは"フロントエンド"と呼びます)に対して機能を提供する場合、フロントエンドのPodがワークロードにおけるバックエンドを使用するために、バックエンドのPodのIPアドレスを探し出したり、記録し続けるためにはどうすればよいでしょうか?

ここで _Service_ について説明します。

## Serviceリソース {#service-resource}

Kubernetesにおいて、ServiceはPodの論理的なセットや、そのPodのセットにアクセスするためのポリシーを定義します(このパターンはよくマイクロサービスと呼ばることがあります)。
ServiceによってターゲットとされたPodのセットは、たいてい {{< glossary_tooltip text="セレクター" term_id="selector" >}}によって定義されます。
その他の方法について知りたい場合は[セレクターなしのService](#services-without-selectors)を参照してください。

例えば、3つのレプリカが稼働しているステートレスな画像処理用のバックエンドを考えます。これらのレプリカは代替可能です。&mdash; フロントエンドはバックエンドが何であろうと気にしません。バックエンドのセットを構成する実際のPodのセットが変更された際、フロントエンドクライアントはその変更を気にしたり、バックエンドのPodのセットの情報を記録しておく必要はありません。

Serviceによる抽象化は、クライアントからバックエンドのPodの管理する責務を分離することを可能にします。

### クラウドネイティブのサービスディスカバリー

アプリケーション内でサービスディスカバリーのためにKubernetes APIが使える場合、ユーザーはエンドポイントを{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}に問い合わせることができ、またService内のPodのセットが変更された時はいつでも更新されたエンドポイントの情報を取得できます。

非ネイティブなアプリケーションのために、KubernetesはアプリケーションとバックエンドPodの間で、ネットワークポートやロードバランサーを配置する方法を提供します。

## Serviceの定義

KubernetesのServiceはPodと同様にRESTのオブジェクトです。他のRESTオブジェクトと同様に、ユーザーはServiceの新しいインスタンスを作成するためにAPIサーバーに対してServiceの定義を`POST`できます。Serviceオブジェクトの名前は、有効な[DNSラベル名](/ja/docs/concepts/overview/working-with-objects/names#dns-label-names)である必要があります。

例えば、TCPで9376番ポートで待ち受けていて、`app=Myapp`というラベルをもつPodのセットがあるとします。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```

この定義では、"my-service"という名前のついた新しいServiceオブジェクトを作成します。これは`app=Myapp`ラベルのついた各Pod上でTCPの9376番ポートをターゲットとします。

Kubernetesは、このServiceに対してIPアドレス("clusterIP"とも呼ばれます)を割り当てます。これはServiceのプロキシーによって使用されます(下記の[仮想IPとServiceプロキシー](#virtual-ips-and-service-proxies)を参照ください)。

Serviceセレクターのコントローラーはセレクターに一致するPodを継続的にスキャンし、“my-service”という名前のEndpointsオブジェクトに対して変更をPOSTします。

{{< note >}}
Serviceは`port`から`targetPort`へのマッピングを行います。デフォルトでは、利便性のために`targetPort`フィールドは`port`フィールドと同じ値で設定されます。
{{< /note >}}

Pod内のポートの定義は名前を設定でき、Serviceの`targetPort`属性にてその名前を参照できます。これは単一の設定名をもつService内で、複数の種類のPodが混合していたとしても有効で、異なるポート番号を介することによって利用可能な、同一のネットワークプロトコルを利用します。
この仕組みはServiceをデプロイしたり、設定を追加する場合に多くの点でフレキシブルです。例えば、バックエンドソフトウェアにおいて、次のバージョンでPodが公開するポート番号を変更するときに、クライアントの変更なしに行えます。

ServiceのデフォルトプロトコルはTCPです。また、他の[サポートされているプロトコル](#protocol-support)も利用可能です。

多くのServiceが、1つ以上のポートを公開する必要があるように、Kubernetesは1つのServiceオブジェクトに対して複数のポートの定義をサポートしています。
各ポート定義は同一の`protocol`または異なる値を設定できます。

### セレクターなしのService {#services-without-selectors}

Serviceは多くの場合、KubernetesのPodに対するアクセスを抽象化しますが、他の種類のバックエンドも抽象化できます。
例えば:

* プロダクション環境で外部のデータベースクラスターを利用したいが、テスト環境では、自身のクラスターが持つデータベースを利用したい場合
* Serviceを、異なる{{< glossary_tooltip term_id="namespace" >}}のServiceや他のクラスターのServiceに向ける場合
* ワークロードをKubernetesに移行するとき、アプリケーションに対する処理をしながら、バックエンドの一部をKubernetesで実行する場合

このような場合において、ユーザーはPodセレクター_なしで_ Serviceを定義できます。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```

このServiceはセレクターがないため、対応するEndpointsオブジェクトは自動的に作成されません。
ユーザーはEndpointsオブジェクトを手動で追加することにより、向き先のネットワークアドレスとポートを手動でマッピングできます。

```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: my-service
subsets:
  - addresses:
      - ip: 192.0.2.42
    ports:
      - port: 9376
```

Endpointsオブジェクトの名前は、有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)である必要があります。

{{< note >}}
Endpointsのipは、loopback (127.0.0.0/8 for IPv4, ::1/128 for IPv6), や
link-local (169.254.0.0/16 and 224.0.0.0/24 for IPv4, fe80::/64 for IPv6)に設定することができません。

{{< glossary_tooltip term_id="kube-proxy" >}}が仮想IPを最終的な到達先に設定することをサポートしていないため、Endpointsのipアドレスは他のKubernetes ServiceのClusterIPにすることができません。
{{< /note >}}

セレクターなしのServiceへのアクセスは、セレクターをもっているServiceと同じようにふるまいます。上記の例では、トラフィックはYAMLファイル内で`192.0.2.42:9376` (TCP)で定義された単一のエンドポイントにルーティングされます。

ExternalName Serviceはセレクターの代わりにDNS名を使用する特殊なケースのServiceです。さらなる情報は、このドキュメントの後で紹介する[ExternalName](#externalname)を参照ください。

### エンドポイントスライス

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

エンドポイントスライスは、Endpointsに対してよりスケーラブルな代替手段を提供できるAPIリソースです。概念的にはEndpointsに非常に似ていますが、エンドポイントスライスを使用すると、ネットワークエンドポイントを複数のリソースに分割できます。デフォルトでは、エンドポイントスライスは、100個のエンドポイントに到達すると「いっぱいである」と見なされ、その時点で追加のエンドポイントスライスが作成され、追加のエンドポイントが保存されます。

エンドポイントスライスは、[エンドポイントスライスのドキュメント](/ja/docs/concepts/services-networking/endpoint-slices/)にて詳しく説明されている追加の属性と機能を提供します。

### アプリケーションプロトコル

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

`AppProtocol`フィールドによってServiceの各ポートに対して特定のアプリケーションプロトコルを指定することができます。
この値は、対応するEndpointsオブジェクトとEndpointSliceオブジェクトに反映されます。
## 仮想IPとサービスプロキシー {#virtual-ips-and-service-proxies}

Kubernetesクラスターの各Nodeは`kube-proxy`を稼働させています。`kube-proxy`は[`ExternalName`](#externalname)タイプ以外の`Service`用に仮想IPを実装する責務があります。

### なぜ、DNSラウンドロビンを使わないのでしょうか。

ここで湧き上がる質問として、なぜKubernetesは内部のトラフィックをバックエンドへ転送するためにプロキシーに頼るのでしょうか。
他のアプローチはどうなのでしょうか。例えば、複数のAバリュー(もしくはIPv6用にAAAAバリューなど)をもつDNSレコードを設定し、ラウンドロビン方式で名前を解決することは可能でしょうか。

Serviceにおいてプロキシーを使う理由はいくつかあります。

* DNSの実装がレコードのTTLをうまく扱わず、期限が切れた後も名前解決の結果をキャッシュするという長い歴史がある。
* いくつかのアプリケーションではDNSルックアップを1度だけ行い、その結果を無期限にキャッシュする。
* アプリケーションとライブラリーが適切なDNS名の再解決を行ったとしても、DNSレコード上の0もしくは低い値のTTLがDNSに負荷をかけることがあり、管理が難しい。

### user-spaceプロキシーモード {#proxy-mode-userspace}

このモードでは、kube-proxyはServiceやEndpointsオブジェクトの追加・削除をチェックするために、Kubernetes Masterを監視します。
各Serviceは、ローカルのNode上でポート(ランダムに選ばれたもの)を公開します。この"プロキシーポート"に対するどのようなリクエストも、そのServiceのバックエンドPodのどれか1つにプロキシーされます(Endpointsを介して通知されたPodに対して)。
kube-proxyは、どのバックエンドPodを使うかを決める際にServiceの`SessionAffinity`項目の設定を考慮に入れます。

最後に、user-spaceプロキシーはServiceの`clusterIP`(仮想IP)と`port`に対するトラフィックをキャプチャするiptablesルールをインストールします。
そのルールは、トラフィックをバックエンドPodにプロキシーするためのプロキシーポートにリダイレクトします。

デフォルトでは、user-spaceモードにおけるkube-proxyはラウンドロビンアルゴリズムによってバックエンドPodを選択します。

![user-spaceプロキシーのService概要ダイアグラム](/images/docs/services-userspace-overview.svg)

### `iptables`プロキシーモード {#proxy-mode-iptables}

このモードでは、kube-proxyはServiceやEndpointsオブジェクトの追加・削除のチェックのためにKubernetesコントロールプレーンを監視します。
各Serviceでは、そのServiceの`clusterIP`と`port`に対するトラフィックをキャプチャするiptablesルールをインストールし、そのトラフィックをServiceのあるバックエンドのセットに対してリダイレクトします。
各Endpointsオブジェクトは、バックエンドのPodを選択するiptablesルールをインストールします。

デフォルトでは、iptablesモードにおけるkube-proxyはバックエンドPodをランダムで選択します。

トラフィックのハンドリングのためにiptablesを使用すると、システムのオーバーヘッドが少なくなります。これは、トラフィックがLinuxのnetfilterによってuser-spaceとkernel-spaceを切り替える必要がないためです。
このアプローチは、オーバーヘッドが少ないことに加えて、より信頼できる方法でもあります。

kube-proxyがiptablesモードで稼働し、最初に選択されたPodが応答しない場合、そのコネクションは失敗します。
これはuser-spaceモードでの挙動と異なります: user-spaceモードにおいては、kube-proxyは最初のPodに対するコネクションが失敗したら、自動的に他のバックエンドPodに対して再接続を試みます。

iptablesモードのkube-proxyが正常なバックエンドPodのみをリダイレクト対象とするために、Podの[ReadinessProbe](/ja/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)を使用してバックエンドPodが正常に動作しているか確認できます。これは、ユーザーがkube-proxyを介して、コネクションに失敗したPodに対してトラフィックをリダイレクトするのを除外することを意味します。

![iptablesプロキシーのService概要ダイアグラム](/images/docs/services-iptables-overview.svg)

### IPVSプロキシーモード {#proxy-mode-ipvs}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

`ipvs`モードにおいて、kube-proxyはServiceとEndpointsオブジェクトを監視し、IPVSルールを作成するために`netlink`インターフェースを呼び出し、定期的にKubernetesのServiceとEndpointsとIPVSルールを同期させます。
このコントロールループはIPVSのステータスが理想的な状態になることを保証します。
Serviceにアクセスするとき、IPVSはトラフィックをバックエンドのPodに向けます。

IPVSプロキシーモードはiptablesモードと同様に、netfilterのフック関数に基づいています。ただし、基礎となるデータ構造としてハッシュテーブルを使っているのと、kernel-spaceで動作します。
これは、IPVSモードにおけるkube-proxyはiptablesモードに比べてより低いレイテンシーでトラフィックをリダイレクトし、プロキシーのルールを同期する際にはよりパフォーマンスがよいことを意味します。
他のプロキシーモードと比較して、IPVSモードはより高いネットワークトラフィックのスループットをサポートしています。

IPVSはバックエンドPodに対するトラフィックのバランシングのために多くのオプションを下記のとおりに提供します。

* `rr`: ラウンドロビン
* `lc`: 最低コネクション数(オープンされているコネクション数がもっとも小さいもの)
* `dh`: 送信先IPによって割り当てられたハッシュ値をもとに割り当てる(Destination Hashing)
* `sh`: 送信元IPによって割り当てられたハッシュ値をもとに割り当てる(Source Hashing)
* `sed`: 見込み遅延が最小なもの
* `nq`: キューなしスケジューリング

{{< note >}}
IPVSモードでkube-proxyを稼働させるためには、kube-proxyを稼働させる前にNode上でIPVSを有効にしなければなりません。

kube-proxyはIPVSモードで起動する場合、IPVSカーネルモジュールが利用可能かどうかを確認します。
もしIPVSカーネルモジュールが見つからなかった場合、kube-proxyはiptablesモードで稼働するようにフォールバックされます。
{{< /note >}}

![IPVSプロキシーのService概要ダイアグラム](/images/docs/services-ipvs-overview.svg)

このダイアグラムのプロキシーモデルにおいて、ServiceのIP:Portに対するトラフィックは、クライアントがKubernetesのServiceやPodについて何も知ることなく適切にバックエンドにプロキシーされています。

特定のクライアントからのコネクションが、毎回同一のPodにリダイレクトされるようにするためには、`service.spec.sessionAffinity`に"ClientIP"を設定することにより、クライアントのIPアドレスに基づいたSessionAffinityを選択することができます(デフォルトは"None")。
また、`service.spec.sessionAffinityConfig.clientIP.timeoutSeconds`を適切に設定することにより、セッションのタイムアウト時間を設定できます(デフォルトではこの値は18,000で、3時間となります)。

## 複数のポートを公開するService

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
    app: MyApp
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
KubernetesのPod名と同様に、ポート名は小文字の英数字と`-`のみ含める必要があります。また、ポート名の最初と最後の文字は英数字である必要があります。

例えば、`123-abc`や`web`という名前は有効で、`123_abc`や`-web`は無効です。
{{< /note >}}

## ユーザー所有のIPアドレスを選択する

`Service`を作成するリクエストの一部として、ユーザー所有のclusterIPアドレスを指定することができます。
これを行うためには`.spec.clusterIP`フィールドにセットします。
使用例として、もしすでに再利用したいDNSエントリーが存在していた場合や、特定のIPアドレスを設定されたレガシーなシステムや、IPの再設定が難しい場合です。

ユーザーが指定したIPアドレスは、そのAPIサーバーのために設定されている`service-cluster-ip-range`というCIDRレンジ内の有効なIPv4またはIPv6アドレスである必要があります。
もし無効なclusterIPアドレスの値を設定してServiceを作成した場合、問題があることを示すためにAPIサーバーはHTTPステータスコード422を返します。

## サービスディスカバリー

Kubernetesは、Serviceオブジェクトを見つけ出すために2つの主要なモードをサポートしています。 - それは環境変数とDNSです。

### 環境変数

PodがNode上で稼働するとき、kubeletはアクティブな各Serviceに対して、環境変数のセットを追加します。
これは[Docker links互換性](https://docs.docker.com/userguide/dockerlinks/)のある変数(
[makeLinkVariables関数](https://releases.k8s.io/{{< param "githubbranch" >}}/pkg/kubelet/envvars/envvars.go#L72)を確認してください)や、より簡単な`{SVCNAME}_SERVICE_HOST`や、`{SVCNAME}_SERVICE_PORT`変数をサポートします。この変数名で使われるService名は大文字に変換され、`-`は`_`に変換されます。

例えば、TCPポート6379番を公開していて、さらにclusterIPが10.0.0.11に割り当てられている`redis-master`というServiceは、下記のような環境変数を生成します。

```shell
REDIS_MASTER_SERVICE_HOST=10.0.0.11
REDIS_MASTER_SERVICE_PORT=6379
REDIS_MASTER_PORT=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP_PROTO=tcp
REDIS_MASTER_PORT_6379_TCP_PORT=6379
REDIS_MASTER_PORT_6379_TCP_ADDR=10.0.0.11
```

{{< note >}}
Serviceにアクセスする必要のあるPodがあり、クライアントであるそのPodに対して環境変数を使ってポートとclusterIPを公開する場合、クライアントのPodが存在する*前に* Serviceを作成しなくてはなりません。
そうでない場合、クライアントのPodはそれらの環境変数を作成しません。

ServiceのclusterIPを発見するためにDNSのみを使う場合、このような問題を心配する必要はありません。
{{< /note >}}

### DNS

ユーザーは[アドオン](/docs/concepts/cluster-administration/addons/)を使ってKubernetesクラスターにDNS Serviceをセットアップできます(常にセットアップすべきです)。

CoreDNSなどのクラスター対応のDNSサーバーは新しいServiceや、各Service用のDNSレコードのセットのためにKubernetes APIを常に監視します。
もしクラスターを通してDNSが有効になっている場合、全てのPodはDNS名によって自動的にServiceに対する名前解決をするようにできるはずです。

例えば、Kubernetesの`my-ns`というNamespace内で`my-service`というServiceがある場合、KubernetesコントロールプレーンとDNS Serviceが協調して動作し、`my-service.my-ns`というDNSレコードを作成します。
`my-ns`というNamespace内のPodは`my-service`という名前で簡単に名前解決できるはずです(`my-service.my-ns`でも動作します)。

他のNamespace内でのPodは`my-service.my-ns`といった形で指定しなくてはなりません。これらのDNS名は、そのServiceのclusterIPに名前解決されます。

Kubernetesは名前付きのポートに対するDNS SRV(Service)レコードもサポートしています。もし`my-service.my-ns`というServiceが`http`という名前のTCPポートを持っていた場合、IPアドレスと同様に、`http`のポート番号を探すために`_http._tcp.my-service.my-ns`というDNS SRVクエリを実行できます。

KubernetesのDNSサーバーは`ExternalName` Serviceにアクセスする唯一の方法です。
[DNS Pods と Service](/ja/docs/concepts/services-networking/dns-pod-service/)にて`ExternalName`による名前解決に関するさらなる情報を確認できます。

## Headless Service {#headless-service}

場合によっては、負荷分散と単一のService IPは不要です。このケースにおいて、clusterIP(`.spec.clusterIP`)の値を`"None"`に設定することにより、"Headless"とよばれるServiceを作成できます。

ユーザーは、Kubernetesの実装と紐づくことなく、他のサービスディスカバリーのメカニズムと連携するためにHeadless Serviceを使用できます。
例えば、ユーザーはこのAPI上でカスタム{{< glossary_tooltip term_id="operator-pattern" text="オペレーター" >}}を実装することができます。

この`Service`においては、clusterIPは割り当てられず、kube-proxyはこのServiceをハンドリングしないのと、プラットフォームによって行われるはずの
ロードバランシングやプロキシーとしての処理は行われません。DNSがどのように自動で設定されるかは、定義されたServiceが定義されたラベルセレクターを持っているかどうかに依存します。

### ラベルセレクターの利用

ラベルセレクターを定義したHeadless Serviceにおいて、EndpointsコントローラーはAPIにおいて`Endpoints`レコードを作成し、`Service`のバックエンドにある`Pod`へのIPを直接指し示すためにDNS設定を修正します。

### ラベルセレクターなしの場合

ラベルセレクターを定義しないHeadless Serviceにおいては、Endpointsコントローラーは`Endpoints`レコードを作成しません。
しかしDNSのシステムは下記の2つ両方を探索し、設定します。

* [`ExternalName`](#externalname)タイプのServiceに対するCNAMEレコード
* 他の全てのServiceタイプを含む、Service名を共有している全ての`Endpoints`レコード

## Serviceの公開 (Serviceのタイプ) {#publishing-services-service-types}

ユーザーのアプリケーションのいくつかの部分において(例えば、frontendsなど)、ユーザーのクラスターの外部にあるIPアドレス上でServiceを公開したい場合があります。

Kubernetesの`ServiceTypes`によって、ユーザーがどのような種類のServiceを使いたいかを指定することが可能です。
デフォルトでは`ClusterIP`となります。

`Type`項目の値と、そのふるまいは以下のようになります。

* `ClusterIP`: クラスター内部のIPでServiceを公開する。このタイプではServiceはクラスター内部からのみ疎通性があります。このタイプはデフォルトの`ServiceType`です。
* [`NodePort`](#nodeport): 各NodeのIPにて、静的なポート(`NodePort`)上でServiceを公開します。その`NodePort` のServiceが転送する先の`ClusterIP` Serviceが自動的に作成されます。`<NodeIP>:<NodePort>`にアクセスすることによって`NodePort` Serviceにアクセスできるようになります。
* [`LoadBalancer`](#loadbalancer): クラウドプロバイダーのロードバランサーを使用して、Serviceを外部に公開します。クラスター外部にあるロードバランサーが転送する先の`NodePort`と`ClusterIP` Serviceは自動的に作成されます。
* [`ExternalName`](#externalname): `CNAME`レコードを返すことにより、`externalName`フィールドに指定したコンテンツ(例: `foo.bar.example.com`)とServiceを紐づけます。しかし、いかなる種類のプロキシーも設定されません。
  {{< note >}}
  `ExternalName`タイプのServiceを利用するためには、kube-dnsのバージョン1.7かCoreDNSのバージョン0.0.8以上が必要となります。
  {{< /note >}}

また、Serviceを公開するために[Ingress](/ja/docs/concepts/services-networking/ingress/)も利用可能です。IngressはServiceのタイプではありませんが、クラスターに対するエントリーポイントとして動作します。
Ingressは同一のIPアドレスにおいて、複数のServiceを公開するように、ユーザーの設定した転送ルールを1つのリソースにまとめることができます。

### NodePort タイプ {#nodeport}

もし`type`フィールドの値を`NodePort`に設定すると、Kubernetesコントロールプレーンは`--service-node-port-range`フラグによって指定されたレンジのポート(デフォルト: 30000-32767)を割り当てます。
各Nodeはそのポート(各Nodeで同じポート番号)への通信をServiceに転送します。
作成したServiceは、`.spec.ports[*].nodePort`フィールド内に割り当てられたポートを記述します。

もしポートへの通信を転送する特定のIPを指定したい場合、特定のIPブロックをkube-proxyの`--nodeport-address`フラグで指定できます。これはKubernetes v1.10からサポートされています。
このフラグは、コンマ区切りのIPブロックのリスト(例: 10.0.0./8, 192.0.2.0/25)を使用し、kube-proxyがこのNodeに対してローカルとみなすべきIPアドレスの範囲を指定します。

例えば、`--nodeport-addresses=127.0.0.0/8`というフラグによってkube-proxyを起動した時、kube-proxyはNodePort Serviceのためにループバックインターフェースのみ選択します。`--nodeport-addresses`のデフォルト値は空のリストになります。これはkube-proxyがNodePort Serviceに対して全てのネットワークインターフェースを利用可能とするべきということを意味します(これは以前のKubernetesのバージョンとの互換性があります)。

もしポート番号を指定したい場合、`nodePort`フィールドに値を指定できます。コントロールプレーンは指定したポートを割り当てるか、APIトランザクションが失敗したことを知らせるかのどちらかになります。
これは、ユーザーが自分自身で、ポート番号の衝突に関して気をつける必要があることを意味します。
また、ユーザーは有効なポート番号を指定する必要があり、NodePortの使用において、設定された範囲のポートを指定する必要があります。

NodePortの使用は、Kubernetesによって完全にサポートされていないようなユーザー独自の負荷分散を設定をするための有効な方法や、1つ以上のNodeのIPを直接公開するための方法となりえます。

注意点として、このServiceは`<NodeIP>:spec.ports[*].nodePort`と、`.spec.clusterIP:spec.ports[*].port`として疎通可能です。
(もしkube-proxyにおいて`--nodeport-addressses`が設定された場合、<NodeIP>はフィルターされたNodeIPとなります。)

例えば:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app: MyApp
  ports:
      # デフォルトでは利便性のため、 `targetPort` は `port` と同じ値にセットされます。
    - port: 80
      targetPort: 80
      # 省略可能なフィールド
      # デフォルトでは利便性のため、Kubernetesコントロールプレーンはある範囲から1つポートを割り当てます(デフォルト値の範囲:30000-32767)
      nodePort: 30007
```

### LoadBalancer タイプ {#loadbalancer}

外部のロードバランサーをサポートするクラウドプロバイダー上で、`type`フィールドに`LoadBalancer`を設定すると、Service用にロードバランサーがプロビジョニングされます。
実際のロードバランサーの作成は非同期で行われ、プロビジョンされたバランサーの情報は、Serviceの`.status.loadBalancer`フィールドに記述されます。
例えば:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
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

外部のロードバランサーからのトラフィックはバックエンドのPodに直接転送されます。クラウドプロバイダーはどのようにそのリクエストをバランシングするかを決めます。

LoadBalancerタイプのサービスで複数のポートが定義されている場合、すべてのポートが同じプロトコルである必要があり、さらにそのプロトコルは`TCP`、`UDP`、`SCTP`のいずれかである必要があります。

いくつかのクラウドプロバイダーにおいて、`loadBalancerIP`の設定をすることができます。このようなケースでは、そのロードバランサーはユーザーが指定した`loadBalancerIP`に対してロードバランサーを作成します。
もし`loadBalancerIP`フィールドの値が指定されていない場合、そのロードバランサーはエフェメラルなIPアドレスに対して作成されます。もしユーザーが`loadBalancerIP`を指定したが、使っているクラウドプロバイダーがその機能をサポートしていない場合、その`loadBalancerIP`フィールドに設定された値は無視されます。

{{< note >}}
もしSCTPを使っている場合、`LoadBalancer` タイプのServiceに関する[使用上の警告](#caveat-sctp-loadbalancer-service-type)を参照してください。
{{< /note >}}

{{< note >}}

**Azure** において、もしユーザーが指定する`loadBalancerIP`を使用したい場合、最初に静的なパブリックIPアドレスのリソースを作成する必要があります。
このパブリックIPアドレスのリソースは、クラスター内で自動的に作成された他のリソースと同じグループに作られるべきです。
例: `MC_myResourceGroup_myAKSCluster_eastus`

割り当てられたIPアドレスをloadBalancerIPとして指定してください。クラウドプロバイダーの設定ファイルにおいてsecurityGroupNameを更新したことを確認してください。
`CreatingLoadBalancerFailed`というパーミッションの問題に対するトラブルシューティングの情報は、[Azure Kubernetes Service(AKS)のロードバランサーで静的IPアドレスを使用する](https://docs.microsoft.com/en-us/azure/aks/static-ip) や、[高度なネットワークを使用したAKSクラスターでのCreatingLoadBalancerFailed](https://github.com/Azure/AKS/issues/357)を参照してください。
{{< /note >}}

#### 内部のロードバランサー
複雑な環境において、同一の(仮想)ネットワークアドレスブロック内のServiceからのトラフィックを転送する必要がでてきます。

Split-HorizonなDNS環境において、ユーザーは2つのServiceを外部と内部の両方からのトラフィックをエンドポイントに転送させる必要がでてきます。

ユーザーは、Serviceに対して下記のアノテーションを1つ追加することでこれを実現できます。
追加するアノテーションは、ユーザーが使っているクラウドプロバイダーに依存しています。

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
タブを選択してください。
{{% /tab %}}
{{% tab name="GCP" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        cloud.google.com/load-balancer-type: "Internal"
[...]
```

{{% /tab %}}
{{% tab name="AWS" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/aws-load-balancer-internal: 0.0.0.0/0
[...]
```

{{% /tab %}}
{{% tab name="Azure" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
[...]
```

{{% /tab %}}
{{% tab name="IBM Cloud" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.kubernetes.io/ibm-load-balancer-cloud-provider-ip-type: "private"
[...]
```

{{% /tab %}}
{{% tab name="OpenStack" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
[...]
```

{{% /tab %}}
{{% tab name="Baidu Cloud" %}}

```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
[...]
```

{{% /tab %}}
{{% tab name="Tencent Cloud" %}}

```yaml
[...]
metadata:
  annotations:
    service.kubernetes.io/qcloud-loadbalancer-internal-subnetid: subnet-xxxxx
[...]
```

{{% /tab %}}
{{< /tabs >}}


#### AWSにおけるTLSのサポート {#ssl-support-on-aws}

AWS上で稼働しているクラスターにおいて、部分的なTLS/SSLのサポートをするには、`LoadBalancer` Serviceに対して3つのアノテーションを追加できます。

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

1つ目は、使用する証明書のARNです。これはIAMにアップロードされたサードパーティーが発行した証明書か、AWS Certificate Managerで作成された証明書になります。

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: (https|http|ssl|tcp)
```

2つ目のアノテーションはPodが利用するプロトコルを指定するものです。HTTPSとSSLの場合、ELBはそのPodが証明書を使って暗号化されたコネクションを介して自分自身のPodを認証すると推測します。

HTTPとHTTPSでは、レイヤー7でのプロキシーを選択します。ELBはユーザーとのコネクションを切断し、リクエストを転送するときにリクエストヘッダーをパースして、`X-Forwarded-For`ヘッダーにユーザーのIPを追加します(Podは接続相手のELBのIPアドレスのみ確認可能です)。

TCPとSSLでは、レイヤー4でのプロキシーを選択します。ELBはヘッダーの値を変更せずにトラフィックを転送します。

いくつかのポートがセキュアに保護され、他のポートではセキュアでないような混合した環境において、下記のようにアノテーションを使うことができます。

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
        service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443,8443"
```

上記の例では、もしServiceが`80`、`443`、`8443`と3つのポートを含んでいる場合、`443`と`8443`はSSL証明書を使いますが、`80`では単純にHTTPでのプロキシーとなります。

Kubernetes v1.9以降のバージョンからは、Serviceのリスナー用にHTTPSやSSLと[事前定義されたAWS SSLポリシー](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html)を使用できます。
どのポリシーが使用できるかを確認するために、`aws`コマンドラインツールを使用できます。

```bash
aws elb describe-load-balancer-policies --query 'PolicyDescriptions[].PolicyName'
```

ユーザーは"`service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy`"というアノテーションを使用することにより、複数のポリシーの中からどれか1つを指定できます。
例えば:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: "ELBSecurityPolicy-TLS-1-2-2017-01"
```

#### AWS上でのPROXYプロトコルのサポート

AWS上で稼働するクラスターで[PROXY protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)のサポートを有効にするために、下記のServiceのアノテーションを使用できます。

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"
```

Kubernetesバージョン1.3.0からは、このアノテーションを使用するとELBによってプロキシーされた全てのポートが対象になり、そしてそれ以外の場合は構成されません。

#### AWS上でのELBのアクセスログ

AWS上でのELB Service用のアクセスログを管理するためにはいくつかのアノテーションが使用できます。

`service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`というアノテーションはアクセスログを有効にするかを設定できます。

`service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`というアノテーションはアクセスログをパブリッシュするためのインターバル(分)を設定できます。
ユーザーはそのインターバルで5分もしくは60分で設定できます。

`service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`というアノテーションはロードバランサーのアクセスログが保存されるAmazon S3のバケット名を設定できます。

`service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`というアノテーションはユーザーが作成したAmazon S3バケットの論理的な階層を指定します。

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "true"
        # ロードバランサーのアクセスログが有効かどうか。
        service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval: "60"
        # アクセスログをパブリッシュするためのインターバル(分)。ユーザーはそのインターバルで5分もしくは60分で設定できます。
        service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name: "my-bucket"
        # ロードバランサーのアクセスログが保存されるAmazon S3のバケット名。
        service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix: "my-bucket-prefix/prod"
        # ユーザーが作成したAmazon S3バケットの論理的な階層。例えば: `my-bucket-prefix/prod`
```

#### AWSでの接続の中断

古いタイプのELBでの接続の中断は、`service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled`というアノテーションを`"true"`に設定することで管理できます。
`service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout`というアノテーションで、インスタンスを登録解除するまえに既存の接続をオープンにし続けるための最大時間(秒)を指定できます。

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "true"
        service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"
```

#### 他のELBアノテーション

古いタイプのELBを管理するためのアノテーションは他にもあり、下記で紹介します。

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "60"
        # ロードバランサーによってクローズされる前にアイドル状態(コネクションでデータは送信されない)になれる秒数

        service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
        # ゾーンを跨いだロードバランシングが有効かどうか

        service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "environment=prod,owner=devops"
        # ELBにおいて追加タグとして保存されるキー・バリューのペアのコンマ区切りのリスト

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold: ""
        # バックエンドへのトラフィックが正常になったと判断するために必要なヘルスチェックの連続成功数
        # デフォルトでは2 この値は2から10の間で設定可能

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold: "3"
        # バックエンドへのトラフィックが異常になったと判断するために必要なヘルスチェックの連続失敗数
        # デフォルトでは6 この値は2から10の間で設定可能

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "20"
        # 各インスタンスのヘルスチェックのおよそのインターバル(秒)
        # デフォルトでは10 この値は5から300の間で設定可能

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout: "5"
        # ヘルスチェックが失敗したと判断されるレスポンスタイムのリミット(秒)
        # この値はservice.beta.kubernetes.io/aws-load-balancer-healthcheck-intervalの値以下である必要があります。
        # デフォルトでは5 この値は2から60の間で設定可能

        service.beta.kubernetes.io/aws-load-balancer-security-groups: "sg-53fae93f"
        # ELBが作成される際に追加されるセキュリティグループのリスト
        # service.beta.kubernetes.io/aws-load-balancer-extra-security-groupsアノテーションと異なり
        # 元々ELBに付与されていたセキュリティグループを置き換えることになります。

        service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-53fae93f,sg-42efd82e"
        # ELBに追加される予定のセキュリティーグループのリスト

        service.beta.kubernetes.io/aws-load-balancer-target-node-labels: "ingress-gw,gw-name=public-api"
        # ロードバランサーがターゲットノードを指定する際に利用するキーバリューのペアのコンマ区切りリストです。
```

#### AWSでのNetwork Load Balancerのサポート {#aws-nlb-support}

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

AWSでNetwork Load Balancerを使用するには、値を`nlb`に設定してアノテーション`service.beta.kubernetes.io/aws-load-balancer-type`を付与します。

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
```

{{< note >}}
NLBは特定のインスタンスクラスでのみ稼働します。サポートされているインスタンスタイプを確認するためには、ELBに関する[AWS documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-register-targets.html#register-deregister-targets)を参照してください。
{{< /note >}}

古いタイプのElastic Load Balancersとは異なり、Network Load Balancers (NLBs)はクライアントのIPアドレスをNodeに転送します。
もしServiceの`.spec.externalTrafficPolicy`の値が`Cluster`に設定されていた場合、クライアントのIPアドレスは末端のPodに伝播しません。

`.spec.externalTrafficPolicy`を`Local`に設定することにより、クライアントIPアドレスは末端のPodに伝播します。しかし、これにより、トラフィックの分配が不均等になります。
特定のLoadBalancer Serviceに紐づいたPodがないNodeでは、自動的に割り当てられた`.spec.healthCheckNodePort`に対するNLBのターゲットグループのヘルスチェックが失敗し、トラフィックを全く受信しません。

均等なトラフィックの分配を実現するために、DaemonSetの使用や、同一のNodeに配備しないように[Podのanti-affinity](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)を設定します。

また、[内部のロードバランサー](/ja/docs/concepts/services-networking/service/#internal-load-balancer)のアノテーションとNLB Serviceを使用できます。

NLBの背後にあるインスタンスに対してクライアントのトラフィックを転送するために、Nodeのセキュリティーグループは下記のようなIPルールに従って変更されます。

| Rule | Protocol | Port(s) | IpRange(s) | IpRange Description |
|------|----------|---------|------------|---------------------|
| ヘルスチェック | TCP | NodePort(s) (`.spec.healthCheckNodePort` for `.spec.externalTrafficPolicy = Local`) | VPC CIDR | kubernetes.io/rule/nlb/health=\<loadBalancerName\> |
| クライアントのトラフィック | TCP | NodePort(s) | `.spec.loadBalancerSourceRanges` (デフォルト: `0.0.0.0/0`) | kubernetes.io/rule/nlb/client=\<loadBalancerName\> |
| MTUによるサービスディスカバリー | ICMP | 3,4 | `.spec.loadBalancerSourceRanges` (デフォルト: `0.0.0.0/0`) | kubernetes.io/rule/nlb/mtu=\<loadBalancerName\> |

どのクライアントIPがNLBにアクセス可能かを制限するためには、`loadBalancerSourceRanges`を指定してください。

```yaml
spec:
  loadBalancerSourceRanges:
  - "143.231.0.0/16"
```

{{< note >}}
もし`.spec.loadBalancerSourceRanges`が設定されていない場合、KubernetesはNodeのセキュリティーグループに対して`0.0.0.0/0`からのトラフィックを許可します。
もしNodeがパブリックなIPアドレスを持っていた場合、NLBでないトラフィックも修正されたセキュリティーグループ内の全てのインスタンスにアクセス可能になってしまうので注意が必要です。

{{< /note >}}

#### Tencent Kubernetes Engine(TKE)におけるその他のCLBアノテーション

以下に示すように、TKEでCloud Load Balancerを管理するためのその他のアノテーションがあります。

```yaml
    metadata:
      name: my-service
      annotations:
        # 指定したノードでロードバランサーをバインドします
        service.kubernetes.io/qcloud-loadbalancer-backends-label: key in (value1, value2)

        # 既存のロードバランサーのID
        service.kubernetes.io/tke-existed-lbid: lb-6swtxxxx

        # ロードバランサー(LB)のカスタムパラメーターは、LBタイプの変更をまだサポートしていません
        service.kubernetes.io/service.extensiveParameters: ""

        # LBリスナーのカスタムパラメーター
        service.kubernetes.io/service.listenerParameters: ""

        # ロードバランサーのタイプを指定します
        # 有効な値: classic(Classic Cloud Load Balancer)またはapplication(Application Cloud Load Balancer)
        service.kubernetes.io/loadbalance-type: xxxxx

        # パブリックネットワーク帯域幅の課金方法を指定します
        # 有効な値: TRAFFIC_POSTPAID_BY_HOUR(bill-by-traffic)およびBANDWIDTH_POSTPAID_BY_HOUR(bill-by-bandwidth)
        service.kubernetes.io/qcloud-loadbalancer-internet-charge-type: xxxxxx

        # 帯域幅の値を指定します(値の範囲:[1-2000] Mbps)。
        service.kubernetes.io/qcloud-loadbalancer-internet-max-bandwidth-out: "10"

        # この注釈が設定されている場合、ロードバランサーはポッドが実行されているノードのみを登録します
        # そうでない場合、すべてのノードが登録されます
        service.kubernetes.io/local-svc-only-bind-node-with-pod: true
```

### ExternalName タイプ {#externalname}

ExternalNameタイプのServiceは、ServiceをDNS名とマッピングし、`my-service`や`cassandra`というような従来のラベルセレクターとはマッピングしません。
ユーザーはこれらのServiceにおいて`spec.externalName`フィールドの値を指定します。

このServiceの定義では、例えば`prod`というNamespace内の`my-service`というServiceを`my.database.example.com`にマッピングします。

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
ExternalNameはIpv4のアドレスの文字列のみ受け付けますが、IPアドレスではなく、数字で構成されるDNS名として受け入れます。
IPv4アドレスに似ているExternalNamesはCoreDNSもしくはIngress-Nginxによって名前解決されず、これはExternalNameは正規のDNS名を指定することを目的としているためです。
IPアドレスをハードコードする場合、[Headless Service](#headless-service)の使用を検討してください。
{{< /note >}}

`my-service.prod.svc.cluster.local`というホストをルックアップするとき、クラスターのDNS Serviceは`my.database.example.com`という値をもつ`CNAME`レコードを返します。
`my-service`へのアクセスは、他のServiceと同じ方法ですが、再接続する際はプロキシーや転送を介して行うよりも、DNSレベルで行われることが決定的に異なる点となります。
後にユーザーが使用しているデータベースをクラスター内に移行することになった場合は、Podを起動させ、適切なラベルセレクターやEndpointsを追加し、Serviceの`type`を変更します。

{{< warning >}}
HTTPやHTTPSなどの一般的なプロトコルでExternalNameを使用する際に問題が発生する場合があります。ExternalNameを使用する場合、クラスター内のクライアントが使用するホスト名は、ExternalNameが参照する名前とは異なります。

ホスト名を使用するプロトコルの場合、この違いによりエラーまたは予期しない応答が発生する場合があります。HTTPリクエストがオリジンサーバーが認識しない`Host:`ヘッダーを持っていたなら、TLSサーバーはクライアントが接続したホスト名に一致する証明書を提供できません。
{{< /warning >}}

{{< note >}}
このセクションは、[Alen Komljen](https://akomljen.com/)による[Kubernetes Tips - Part1](https://akomljen.com/kubernetes-tips-part-1/)というブログポストを参考にしています。

{{< /note >}}

### External IPs

もし1つ以上のクラスターNodeに転送するexternalIPが複数ある場合、Kubernetes Serviceは`externalIPs`に指定したIPで公開されます。
そのexternalIP(到達先のIPとして扱われます)のServiceのポートからトラフィックがクラスターに入って来る場合、ServiceのEndpointsのどれか1つに対して転送されます。
`externalIPs`はKubernetesによって管理されず、それを管理する責任はクラスターの管理者にあります。

Serviceのspecにおいて、`externalIPs`は他のどの`ServiceTypes`と併用して設定できます。
下記の例では、"`my-service`"は"`80.11.12.10:80`" (`externalIP:port`)のクライアントからアクセス可能です。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 9376
  externalIPs:
  - 80.11.12.10
```

## Serviceの欠点

仮想IP用にuserspaceモードのプロキシーを使用すると、小規模もしくは中規模のスケールでうまく稼働できますが、1000以上のServiceがあるようなとても大きなクラスターではうまくスケールしません。
これについては、[Serviceのデザインプロポーザル](https://github.com/kubernetes/kubernetes/issues/1107)にてさらなる詳細を確認できます。

userspaceモードのプロキシーの使用は、Serviceにアクセスするパケットの送信元IPアドレスが不明瞭になります。
これは、いくつかの種類のネットワークフィルタリング(ファイアウォールによるフィルタリング)を不可能にします。
iptablesプロキシーモードはクラスター内の送信元IPを不明瞭にはしませんが、依然としてロードバランサーやNodePortへ疎通するクライアントに影響があります。

`Type`フィールドはネストされた機能としてデザインされています。 - 各レベルの値は前のレベルに対して追加します。
これは全てのクラウドプロバイダーにおいて厳密に要求されていません(例: Google Compute Engineは`LoadBalancer`を動作させるために`NodePort`を割り当てる必要はありませんが、AWSではその必要があります)が、現在のAPIでは要求しています。

## 仮想IPの実装について {#the-gory-details-of-virtual-ips}

これより前の情報は、ただServiceを使いたいという多くのユーザーにとっては有益かもしれません。しかし、その裏側では多くのことが行われており、理解する価値があります。

### 衝突の回避

Kubernetesの主要な哲学のうちの一つは、ユーザーは、ユーザー自身のアクションによるミスでないものによって、ユーザーのアクションが失敗するような状況に晒されるべきでないことです。
Serviceリソースの設計において、これはユーザーの指定したポートが衝突する可能性がある場合はそのポートのServiceを作らないことを意味します。これは障害を分離することとなります。

Serviceのポート番号を選択できるようにするために、我々はどの2つのServiceでもポートが衝突しないことを保証します。
Kubernetesは各Serviceに、それ自身のIPアドレスを割り当てることで実現しています。

各Serviceが固有のIPを割り当てられるのを保証するために、内部のアロケーターは、Serviceを作成する前に、etcd内のグローバルの割り当てマップをアトミックに更新します。
そのマップオブジェクトはServiceのIPアドレスの割り当てのためにレジストリー内に存在しなくてはならず、そうでない場合は、Serviceの作成時にIPアドレスが割り当てられなかったことを示すエラーメッセージが表示されます。

コントロールプレーンにおいて、バックグラウンドのコントローラーはそのマップを作成する責務があります(インメモリーのロックが使われていた古いバージョンのKubernetesからのマイグレーションをサポートすることも必要です)。
また、Kubernetesは(例えば、管理者の介入によって)無効な割り当てがされているかをチェックすることと、現時点でどのServiceにも使用されていない割り当て済みIPアドレスのクリーンアップのためにコントローラーを使用します。

### ServiceのIPアドレス {#ips-and-vips}

実際に固定された向き先であるPodのIPアドレスとは異なり、ServiceのIPは実際には単一のホストによって応答されません。
その代わり、kube-proxyは必要な時に透過的にリダイレクトされる_仮想_ IPアドレスを定義するため、iptables(Linuxのパケット処理ロジック)を使用します。
クライアントがVIPに接続する時、そのトラフィックは自動的に適切なEndpointsに転送されます。
Service用の環境変数とDNSは、Serviceの仮想IPアドレス(とポート)の面において、自動的に生成されます。

kube-proxyは3つの微妙に異なった動作をするプロキシーモード&mdash; userspace、iptablesとIPVS &mdash; をサポートしています。

#### Userspace

例として、上記で記述されている画像処理のアプリケーションを考えます。
バックエンドのServiceが作成されたとき、KubernetesのMasterは仮想IPを割り当てます。例えば10.0.0.1などです。
そのServiceのポートが1234で、そのServiceはクラスター内の全てのkube-proxyインスタンスによって監視されていると仮定します。
kube-proxyが新しいServiceを見つけた時、kube-proxyは新しいランダムポートをオープンし、その仮想IPアドレスの新しいポートにリダイレクトするようにiptablesを更新し、そのポート上で新しい接続を待ち受けを開始します。

クライアントがServiceの仮想IPアドレスに接続したとき、iptablesルールが有効になり、そのパケットをプロキシー自身のポートにリダイレクトします。
その"Service プロキシー"はバックエンドPodの対象を選択し、クライアントのトラフィックをバックエンドPodに転送します。

これはServiceのオーナーは、衝突のリスクなしに、求めるどのようなポートも選択できることを意味します。
クライアントは単純にそのIPとポートに対して接続すればよく、実際にどのPodにアクセスしているかを意識しません。

#### iptables

また画像処理のアプリケーションについて考えます。バックエンドServiceが作成された時、そのKubernetesコントロールプレーンは仮想IPアドレスを割り当てます。例えば10.0.0.1などです。
Serviceのポートが1234で、そのServiceがクラスター内のすべてのkube-proxyインスタンスによって監視されていると仮定します。
kube-proxyが新しいServiceを見つけた時、kube-proxyは仮想IPから各Serviceのルールにリダイレクトされるような、iptablesルールのセットをインストールします。
Service毎のルールは、トラフィックをバックエンドにリダイレクト(Destination NATを使用)しているEndpoints毎のルールに対してリンクしています。

クライアントがServiceの仮想IPアドレスに対して接続しているとき、そのiptablesルールが有効になります。
バックエンドのPodが選択され(SessionAffinityに基づくか、もしくはランダムで選択される)、パケットはバックエンドにリダイレクトされます。
userspaceモードのプロキシーとは異なり、パケットは決してuserspaceにコピーされず、kube-proxyは仮想IPのために稼働される必要はなく、またNodeでは変更されていないクライアントIPからトラフィックがきます。

このように同じ基本的なフローは、NodePortまたはLoadBalancerを介してトラフィックがきた場合に、実行され、ただクライアントIPは変更されます。

#### IPVS

iptablesの処理は、大規模なクラスターの場合劇的に遅くなります。例としてはServiceが10,000ほどある場合です。
IPVSは負荷分散のために設計され、カーネル内のハッシュテーブルに基づいています。そのためIPVSベースのkube-proxyによって、多数のServiceがある場合でも一貫して高パフォーマンスを実現できます。
次第に、IPVSベースのkube-proxyは負荷分散のアルゴリズムはさらに洗練されています(最小接続数、位置ベース、重み付け、永続性など)。

## APIオブジェクト

ServiceはKubernetesのREST APIにおいてトップレベルのリソースです。ユーザーはそのAPIオブジェクトに関して、[Service API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)でさらなる情報を確認できます。

## サポートされているプロトコル {#protocol-support}

### TCP

ユーザーはどの種類のServiceにおいてもTCPを利用できます。これはデフォルトのネットワークプロトコルです。

### UDP

ユーザーは多くのServiceにおいてUDPを利用できます。 type=LoadBalancerのServiceにおいては、UDPのサポートはこの機能を提供しているクラウドプロバイダーに依存しています。

### HTTP

もしクラウドプロバイダーがサポートしている場合、ServiceのEndpointsに転送される外部のHTTP/HTTPSでのリバースプロキシーをセットアップするために、LoadBalancerモードでServiceを作成可能です。

{{< note >}}
ユーザーはまた、HTTP/HTTPS Serviceを公開するために、Serviceの代わりに{{< glossary_tooltip term_id="ingress" >}}を利用することもできます。
{{< /note >}}

### PROXY プロトコル

もしクラウドプロバイダーがサポートしている場合、Kubernetesクラスターの外部のロードバランサーを設定するためにLoadBalancerモードでServiceを利用できます。これは[PROXY protocol](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)がついた接続を転送します。

ロードバランサーは、最初の一連のオクテットを送信します。
下記のような例となります。

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```

クライアントからのデータのあとに追加されます。

### SCTP

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

KubernetesはService、Endpoints、EndpointSlice、NetworkPolicyとPodの定義において`protocol`フィールドの値でSCTPをサポートしています。ベータ版の機能のため、この機能はデフォルトで有効になっています。SCTPをクラスターレベルで無効にするには、クラスター管理者はAPI Serverにおいて`SCTPSupport` [フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を`--feature-gates=SCTPSupport=false,…`と設定して無効にする必要があります。

そのフィーチャーゲートが有効になった時、ユーザーはService、Endpoints、EndpointSlice、NetworkPolicyの`protocol`フィールドと、Podの`SCTP`フィールドを設定できます。
Kubernetesは、TCP接続と同様に、SCTPアソシエーションに応じてネットワークをセットアップします。

#### 警告 {#caveat-sctp-overview}

##### マルチホームSCTPアソシエーションのサポート {#caveat-sctp-multihomed}

{{< warning >}}
マルチホームSCTPアソシエーションのサポートは、複数のインターフェースとPodのIPアドレスの割り当てをサポートできるCNIプラグインを要求します。

マルチホームSCTPアソシエーションにおけるNATは、対応するカーネルモジュール内で特別なロジックを要求します。
{{< /warning >}}

##### type=LoadBalancer Service について {#caveat-sctp-loadbalancer-service-type}

{{< warning >}}
クラウドプロバイダーのロードバランサーの実装がプロトコルとしてSCTPをサポートしている場合は、`type` がLoadBalancerで` protocol`がSCTPの場合でのみサービスを作成できます。
そうでない場合、Serviceの作成要求はリジェクトされます。現時点でのクラウドのロードバランサーのプロバイダー(Azure、AWS、CloudStack、GCE、OpenStack)は全てSCTPのサポートをしていません。
{{< /warning >}}

##### Windows {#caveat-sctp-windows-os}

{{< warning >}}
SCTPはWindowsベースのNodeではサポートされていません。
{{< /warning >}}

##### Userspace kube-proxy {#caveat-sctp-kube-proxy-userspace}

{{< warning >}}
kube-proxyはuserspaceモードにおいてSCTPアソシエーションの管理をサポートしません。
{{< /warning >}}

## {{% heading "whatsnext" %}}

* [Connecting Applications with Services](/ja/docs/concepts/services-networking/connect-applications-service/)を参照してください。
* [Ingress](/ja/docs/concepts/services-networking/ingress/)を参照してください。
* [EndpointSlices](/ja/docs/concepts/services-networking/endpoint-slices/)を参照してください。
