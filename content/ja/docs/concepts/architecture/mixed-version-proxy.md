---
title: Mixed Version Proxy
content_type: concept
weight: 220
---

<!-- overview -->

{{< feature-state feature_gate_name="UnknownVersionInteroperabilityProxy" >}}

Kubernetes {{< skew currentVersion >}}には、{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}が他の_ピア_APIサーバーにリソースリクエストをプロキシできるようにするアルファ機能が含まれています。
また、クライアントがディスカバリーを通じてクラスター全体で提供されるリソースの全体像を取得することもできます。
これは、1つのクラスター内で異なるバージョンのKubernetesを実行する複数のAPIサーバーがある場合に役立ちます(例えば、Kubernetesの新しいリリースへの長期間にわたるロールアウト中など)。

これにより、クラスター管理者は、より安全にアップグレードできる高可用性クラスターを設定できます:

1. 重要なタスクでリソースの包括的なリストを表示するためにディスカバリーに依存するコントローラーが、常にすべてのリソースの完全なビューを取得できるようにします。この完全なクラスター全体のディスカバリーを_ピア集約ディスカバリー_と呼びます。
1. (アップグレード中に行われる)リソースリクエストを正しいkube-apiserverに転送します。このプロキシにより、ユーザーはアップグレードプロセスに起因する予期しない404 Not Foundエラーを見ることがなくなります。このメカニズムは_Mixed Version Proxy_と呼ばれます。

## ピア集約ディスカバリーとMixed Version Proxyの有効化 {#enabling-peer-aggregated-discovery-and-mixed-version-proxy}

{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}を起動する際に、`UnknownVersionInteroperabilityProxy`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#UnknownVersionInteroperabilityProxy)が有効になっていることを確認してください:

```shell
kube-apiserver \
--feature-gates=UnknownVersionInteroperabilityProxy=true \
# required command line arguments for this feature
--peer-ca-file=<path to kube-apiserver CA cert>
--proxy-client-cert-file=<path to aggregator proxy cert>,
--proxy-client-key-file=<path to aggregator proxy key>,
--requestheader-client-ca-file=<path to aggregator CA cert>,
# requestheader-allowed-names can be set to blank to allow any Common Name
--requestheader-allowed-names=<valid Common Names to verify proxy client cert against>,

# optional flags for this feature
--peer-advertise-ip=`IP of this kube-apiserver that should be used by peers to proxy requests`
--peer-advertise-port=`port of this kube-apiserver that should be used by peers to proxy requests`

# …and other flags as usual
```

### APIサーバー間のプロキシトランスポートと認証 {#transport-and-authn}

* ソースkube-apiserverは、[既存のAPIサーバークライアント認証フラグ](/docs/tasks/extend-kubernetes/configure-aggregation-layer/#kubernetes-apiserver-client-authentication)`--proxy-client-cert-file`と`--proxy-client-key-file`を再利用して、ピア(宛先kube-apiserver)によって検証される自身のIDを提示します。宛先APIサーバーは、`--requestheader-client-ca-file`コマンドライン引数を使用して指定した設定に基づいてピア接続を検証します。

* 宛先サーバーのサービング証明書を認証するには、**ソース**APIサーバーに`--peer-ca-file`コマンドライン引数を使用して認証局バンドルを設定する必要があります。

### ピアAPIサーバー接続の設定 {#configuration-for-peer-api-server-connectivity}

ピアがリクエストをプロキシするために使用するkube-apiserverのネットワークロケーションを設定するには、kube-apiserverに`--peer-advertise-ip`と`--peer-advertise-port`コマンドライン引数を使用するか、APIサーバー設定ファイルでこれらのフィールドを指定します。
これらのフラグが指定されていない場合、ピアはkube-apiserverの`--advertise-address`または`--bind-address`コマンドライン引数の値を使用します。
それらも設定されていない場合、ホストのデフォルトインターフェースが使用されます。

## ピア集約ディスカバリー {#peer-aggregated-discovery}

この機能を有効にすると、ディスカバリーリクエストはデフォルトで包括的なディスカバリードキュメント(クラスター内のすべてのapiserverによって提供されるすべてのリソースをリストする)を提供するように自動的に有効になります。

ピア集約されていないディスカバリードキュメントをリクエストしたい場合は、ディスカバリーリクエストに次のAcceptヘッダーを追加することでそれを示すことができます:

```
application/json;g=apidiscovery.k8s.io;v=v2;as=APIGroupDiscoveryList;profile=nopeer
```

{{< note >}}
ピア集約ディスカバリーは、`/apis`エンドポイントへの[集約ディスカバリー](/docs/concepts/overview/kubernetes-api/#aggregated-discovery)リクエストにのみサポートされており、[非集約(レガシー)ディスカバリー](/docs/concepts/overview/kubernetes-api/#unaggregated-discovery)リクエストにはサポートされていません。
{{< /note >}}

## Mixed version proxying {#mixed-version-proxying}

Mixed version proxyingを有効にすると、[アグリゲーションレイヤー](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)は次の処理を行う特別なフィルターをロードします:

* APIサーバーがそのAPIを提供できない場合(APIが導入される前のバージョンであるか、そのAPIサーバーでAPIが無効になっているため)、リソースリクエストがAPIサーバーに到達すると、そのAPIサーバーはリクエストされたAPIを提供できるピアAPIサーバーにリクエストを送信しようとします。これは、ローカルサーバーが認識しないAPIグループ/バージョン/リソースを識別し、リクエストを処理できるピアAPIサーバーにそれらのリクエストをプロキシしようとすることで実現されます。
* ピアAPIサーバーが応答に失敗した場合、_ソース_APIサーバーは503(「Service Unavailable」)エラーで応答します。

### 内部での動作 {#how-it-works-under-the-hood}

APIサーバーがリソースリクエストを受信すると、最初にどのAPIサーバーがリクエストされたリソースを提供できるかを確認します。
この確認は、ピア集約されていないディスカバリードキュメントを使用して行われます。

* リクエストを受信したAPIサーバーから取得したピア集約されていないディスカバリードキュメントにリソースがリストされている場合(例えば、`GET /api/v1/pods/some-pod`)、リクエストはローカルで処理されます。

* リクエスト内のリソース(例えば、`GET /apis/resource.k8s.io/v1beta1/resourceclaims`)が、リクエストを処理しようとしているAPIサーバー(_処理APIサーバー_)から取得したピア集約されていないディスカバリードキュメントに見つからない場合、おそらく`resource.k8s.io/v1beta1` APIがより新しいKubernetesバージョンで導入され、_処理APIサーバー_がそれをサポートしていない古いバージョンを実行しているためです。その場合、_処理APIサーバー_はすべてのピアAPIサーバーからピア集約されていないディスカバリードキュメントを確認して、関連するAPIグループ/バージョン/リソース(この場合は`resource.k8s.io/v1beta1/resourceclaims`)を提供するピアAPIサーバーを取得します。_処理APIサーバー_は、リクエストされたリソースを認識している一致するピアkube-apiserverの1つにリクエストをプロキシします。

* そのAPIグループ/バージョン/リソースを認識しているピアがいない場合、処理APIサーバーは自身のハンドラーチェーンにリクエストを渡し、最終的に404(「Not Found」)レスポンスを返すはずです。

* 処理APIサーバーがピアAPIサーバーを識別して選択したが、そのピアが応答に失敗した場合(ネットワーク接続の問題、またはリクエストの受信とコントローラーがピアの情報をコントロールプレーンに登録する間のデータ競合などの理由)、処理APIサーバーは503(「Service Unavailable」)エラーで応答します。
