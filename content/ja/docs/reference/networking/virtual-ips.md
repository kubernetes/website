---
title: 仮想IPとサービスプロキシ
content_type: reference
weight: 50
---

<!-- overview -->

Kubernetesクラスターの各Nodeは`kube-proxy`を稼働させています。`kube-proxy`は[`ExternalName`](/ja/docs/concepts/services-networking/service/#externalname)タイプ以外の`Service`用に仮想IPを実装する責務があります。

### なぜ、DNSラウンドロビンを使わないのでしょうか。

ここで湧き上がる質問として、なぜKubernetesは内部のトラフィックをバックエンドへ転送するためにプロキシに頼るのでしょうか。
他のアプローチはどうなのでしょうか。例えば、複数のAバリュー(もしくはIPv6用にAAAAバリューなど)をもつDNSレコードを設定し、ラウンドロビン方式で名前を解決することは可能でしょうか。

Serviceにおいてプロキシを使う理由はいくつかあります。

* DNSの実装がレコードのTTLをうまく扱わず、期限が切れた後も名前解決の結果をキャッシュするという長い歴史がある。
* いくつかのアプリケーションではDNSルックアップを1度だけ行い、その結果を無期限にキャッシュする。
* アプリケーションとライブラリーが適切なDNS名の再解決を行ったとしても、DNSレコード上の0もしくは低い値のTTLがDNSに負荷をかけることがあり、管理が難しい。

<!-- body -->

## プロキシモード {#proxy-modes}

### user-spaceプロキシモード {#proxy-mode-userspace}

このモードでは、kube-proxyはServiceやEndpointsオブジェクトの追加・削除をチェックするために、Kubernetes Masterを監視します。
各Serviceは、ローカルのNode上でポート(ランダムに選ばれたもの)を公開します。この"プロキシポート"に対するどのようなリクエストも、そのServiceのバックエンドPodのどれか1つにプロキシされます(Endpointsを介して通知されたPodに対して)。
kube-proxyは、どのバックエンドPodを使うかを決める際にServiceの`SessionAffinity`項目の設定を考慮に入れます。

最後に、user-spaceプロキシはServiceの`clusterIP`(仮想IP)と`port`に対するトラフィックをキャプチャするiptablesルールをインストールします。
そのルールは、トラフィックをバックエンドPodにプロキシするためのプロキシポートにリダイレクトします。

デフォルトでは、user-spaceモードにおけるkube-proxyはラウンドロビンアルゴリズムによってバックエンドPodを選択します。

![user-spaceプロキシのService概要ダイアグラム](/images/docs/services-userspace-overview.svg)

### `iptables`プロキシモード {#proxy-mode-iptables}

このモードでは、kube-proxyはServiceやEndpointsオブジェクトの追加・削除のチェックのためにKubernetesコントロールプレーンを監視します。
各Serviceでは、そのServiceの`clusterIP`と`port`に対するトラフィックをキャプチャするiptablesルールをインストールし、そのトラフィックをServiceのあるバックエンドのセットに対してリダイレクトします。
各Endpointsオブジェクトは、バックエンドのPodを選択するiptablesルールをインストールします。

デフォルトでは、iptablesモードにおけるkube-proxyはバックエンドPodをランダムで選択します。

トラフィックのハンドリングのためにiptablesを使用すると、システムのオーバーヘッドが少なくなります。これは、トラフィックがLinuxのnetfilterによってuser-spaceとkernel-spaceを切り替える必要がないためです。
このアプローチは、オーバーヘッドが少ないことに加えて、より信頼できる方法でもあります。

kube-proxyがiptablesモードで稼働し、最初に選択されたPodが応答しない場合、そのコネクションは失敗します。
これはuser-spaceモードでの挙動と異なります: user-spaceモードにおいては、kube-proxyは最初のPodに対するコネクションが失敗したら、自動的に他のバックエンドPodに対して再接続を試みます。

iptablesモードのkube-proxyが正常なバックエンドPodのみをリダイレクト対象とするために、Podの[ReadinessProbe](/ja/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)を使用してバックエンドPodが正常に動作しているか確認できます。これは、ユーザーがkube-proxyを介して、コネクションに失敗したPodに対してトラフィックをリダイレクトするのを除外することを意味します。

![iptablesプロキシのService概要ダイアグラム](/images/docs/services-iptables-overview.svg)

### IPVSプロキシモード {#proxy-mode-ipvs}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

`ipvs`モードにおいて、kube-proxyはServiceとEndpointsオブジェクトを監視し、IPVSルールを作成するために`netlink`インターフェースを呼び出し、定期的にKubernetesのServiceとEndpointsとIPVSルールを同期させます。
このコントロールループはIPVSのステータスが理想的な状態になることを保証します。
Serviceにアクセスするとき、IPVSはトラフィックをバックエンドのPodに向けます。

IPVSプロキシモードはiptablesモードと同様に、netfilterのフック関数に基づいています。ただし、基礎となるデータ構造としてハッシュテーブルを使っているのと、kernel-spaceで動作します。
これは、IPVSモードにおけるkube-proxyはiptablesモードに比べてより低いレイテンシーでトラフィックをリダイレクトし、プロキシのルールを同期する際にはよりパフォーマンスがよいことを意味します。
他のプロキシモードと比較して、IPVSモードはより高いネットワークトラフィックのスループットをサポートしています。

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

![IPVSプロキシのService概要ダイアグラム](/images/docs/services-ipvs-overview.svg)

このダイアグラムのプロキシモデルにおいて、ServiceのIP:Portに対するトラフィックは、クライアントがKubernetesのServiceやPodについて何も知ることなく適切にバックエンドにプロキシされています。

特定のクライアントからのコネクションが、毎回同一のPodにリダイレクトされるようにするためには、`service.spec.sessionAffinity`に"ClientIP"を設定することにより、クライアントのIPアドレスに基づいたSessionAffinityを選択することができます(デフォルトは"None")。
また、`service.spec.sessionAffinityConfig.clientIP.timeoutSeconds`を適切に設定することにより、セッションのタイムアウト時間を設定できます(デフォルトではこの値は18,000で、3時間となります)。

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
その代わり、kube-proxyは必要な時に透過的にリダイレクトされる*仮想*IPアドレスを定義するため、iptables(Linuxのパケット処理ロジック)を使用します。
クライアントがVIPに接続する時、そのトラフィックは自動的に適切なEndpointsに転送されます。
Service用の環境変数とDNSは、Serviceの仮想IPアドレス(とポート)の面において、自動的に生成されます。

kube-proxyは3つの微妙に異なった動作をするプロキシモード&mdash; userspace、iptablesとIPVS &mdash; をサポートしています。

#### Userspace

例として、上記で記述されている画像処理のアプリケーションを考えます。
バックエンドのServiceが作成されたとき、KubernetesのMasterは仮想IPを割り当てます。例えば10.0.0.1などです。
そのServiceのポートが1234で、そのServiceはクラスター内の全てのkube-proxyインスタンスによって監視されていると仮定します。
kube-proxyが新しいServiceを見つけた時、kube-proxyは新しいランダムポートをオープンし、その仮想IPアドレスの新しいポートにリダイレクトするようにiptablesを更新し、そのポート上で新しい接続を待ち受けを開始します。

クライアントがServiceの仮想IPアドレスに接続したとき、iptablesルールが有効になり、そのパケットをプロキシ自身のポートにリダイレクトします。
その"Service プロキシ"はバックエンドPodの対象を選択し、クライアントのトラフィックをバックエンドPodに転送します。

これはServiceのオーナーは、衝突のリスクなしに、求めるどのようなポートも選択できることを意味します。
クライアントは単純にそのIPとポートに対して接続すればよく、実際にどのPodにアクセスしているかを意識しません。

#### iptables

また画像処理のアプリケーションについて考えます。バックエンドServiceが作成された時、そのKubernetesコントロールプレーンは仮想IPアドレスを割り当てます。例えば10.0.0.1などです。
Serviceのポートが1234で、そのServiceがクラスター内のすべてのkube-proxyインスタンスによって監視されていると仮定します。
kube-proxyが新しいServiceを見つけた時、kube-proxyは仮想IPから各Serviceのルールにリダイレクトされるような、iptablesルールのセットをインストールします。
Service毎のルールは、トラフィックをバックエンドにリダイレクト(Destination NATを使用)しているEndpoints毎のルールに対してリンクしています。

クライアントがServiceの仮想IPアドレスに対して接続しているとき、そのiptablesルールが有効になります。
バックエンドのPodが選択され(SessionAffinityに基づくか、もしくはランダムで選択される)、パケットはバックエンドにリダイレクトされます。
userspaceモードのプロキシとは異なり、パケットは決してuserspaceにコピーされず、kube-proxyは仮想IPのために稼働される必要はなく、またNodeでは変更されていないクライアントIPからトラフィックがきます。

このように同じ基本的なフローは、NodePortまたはLoadBalancerを介してトラフィックがきた場合に、実行され、ただクライアントIPは変更されます。

#### IPVS

iptablesの処理は、大規模なクラスターの場合劇的に遅くなります。例としてはServiceが10,000ほどある場合です。
IPVSは負荷分散のために設計され、カーネル内のハッシュテーブルに基づいています。そのためIPVSベースのkube-proxyによって、多数のServiceがある場合でも一貫して高パフォーマンスを実現できます。
次第に、IPVSベースのkube-proxyは負荷分散のアルゴリズムはさらに洗練されています(最小接続数、位置ベース、重み付け、永続性など)。
