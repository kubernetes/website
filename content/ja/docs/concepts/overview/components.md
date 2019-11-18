---
title: Kubernetesのコンポーネント
content_template: templates/concept
weight: 20
card: 
  name: concepts
  weight: 20
---

{{% capture overview %}}
<<<<<<< HEAD

このページでは、Kubernetesクラスターの機能を提供するために必要になる様々なコンポーネントを説明します。（実行ファイル形式で提供される）

=======
このドキュメントでは、Kubernetesクラスターが機能するために必要となるさまざまなコンポーネントの概要を説明します。
>>>>>>> dev-1.15-ja.1
{{% /capture %}}

{{% capture body %}}

<<<<<<< HEAD
## マスターコンポーネント

マスターコンポーネントは、クラスターのコントロールプレーンです。マスターコンポーネントはクラスターに関する全体的な決定を行い（例えばスケジューリングなど）、クラスターのイベントを検知し、それらに応答します（例えば、レプリケーションコントローラーの'replicas'フィールドが充足されていない場合、新しいPodを立ち上げます）。

マスターコンポーネントは、クラスター内のどのマシン上でも動かすことが出来ます。しかし、話を簡単にするために、環境構築を行うスクリプトは通常、全てのマスターコンポーネントを同じマシン上で稼働させ、ユーザーのコンテナはそのマシンでは稼働させません。複数マスターマシン構成の構築例は、[高可用性クラスターを構築する](/docs/admin/high-availability/)を確認してください。
=======
## Masterコンポーネント

Masterコンポーネントは、クラスターのコントロールプレーンを提供します。
Masterコンポーネントは、クラスターに関する(スケジューリングなどの)グローバルな決定を行います。また、クラスターイベントの検出および応答を行います(たとえば、deploymentの`replica`フィールドが満たされていない場合に、新しい {{< glossary_tooltip text="pod" term_id="pod">}} を起動する等)。

Masterコンポーネントはクラスター内のどのマシンでも実行できますが、シンプルにするため、セットアップスクリプトは通常、すべてのMasterコンポーネントを同じマシンで起動し、そのマシンではユーザーコンテナを実行しません。
マルチMaster VMセットアップの例については、[高可用性クラスターの構築](/docs/admin/high-availability/) を参照してください。
>>>>>>> dev-1.15-ja.1

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

<<<<<<< HEAD
コントローラーには下記のものがあります:

  * ノードコントローラー: ノードがダウンした場合に、通知と応答を行います。
  * レプリケーションコントローラー: それぞれのレプリケーションコントローラーオブジェクト内に、正しい数のポッドが存在しているかを管理します。
  * エンドポイントコントローラー: エンドポイントを設定します。（これは、サービスとPodを結合するということです）
  * サービスアカウント & トークンコントローラー: 新しい名前空間にデフォルトアカウントとAPIアクセストークンを作成します。

### クラウドコントローラーマネージャー（cloud-controller-manager）

[クラウドコントローラーマネージャー](/docs/tasks/administer-cluster/running-cloud-controller/)は、基盤となるクラウドサービスと連携するコントローラーを動かします。クラウドコントローラーマネージャーはKubernetes 1.6でリリースされたアルファの機能です。

クラウドコントローラーマネージャーは、クラウドサービス固有の制御ループのみを動かします。これらの制御ループは kube-controller-manager から無効にしなければなりません。無効にするには、kube-controller-managerの起動時に、`--cloud-provider`フラグに`external`を指定します。

クラウドコントローラーマネージャーは、クラウドベンダー固有のコードと、Kubernetes本体のコードを独立して開発することを可能にします。以前のリリースでは、Kubernetes本体のコードがクラウドサービス固有のコードに機能的に依存していました。将来のリリースでは、クラウドベンダー固有のコードはクラウドベンダー自身が保持し、Kubernetesが稼働している時にクラウドコントローラーマネージャーに紐付けられるようになっていきます。

以下のコントローラーがクラウドサービスとの依存関係を持っています:

  * ノードコントローラー: クラウドから応答が無くなった後、ノードが削除されていないかを確認します。
  * ルートコントローラー: クラウド基盤にルーティング情報を設定します。
  * サービスコントローラー: クラウドサービス上のロードバランサーを作成、更新、削除します。
  * ボリュームコントローラー: ボリュームを作成、アタッチ、マウント、またクラウドサービスと連携し、ボリュームを編成します。

## ノードコンポーネント

ノードコンポーネントは全てのノード上で稼働し、稼働中Podの管理、Kubernetes実行環境を提供します。
=======
コントローラーには以下が含まれます。

  * ノードコントローラー：ノードがダウンした場合の通知と対応を担当します。
  * レプリケーションコントローラー：システム内の全レプリケーションコントローラーオブジェクトについて、Podの数を正しく保つ役割を持ちます。
  * エンドポイントコントローラー：エンドポイントオブジェクトを注入します(つまり、ServiceとPodを紐付けます)。
  * サービスアカウントとトークンコントローラー：新規の名前空間に対して、デフォルトアカウントとAPIアクセストークンを作成します。

### cloud-controller-manager

[cloud-controller-manager](/docs/tasks/administer-cluster/running-cloud-controller/) は、基盤であるクラウドプロバイダーと対話するコントローラーを実行します。
cloud-controller-managerバイナリは、Kubernetesリリース1.6で導入された機能です。

cloud-controller-managerは、クラウドプロバイダー固有のコントローラーループのみを実行します。これらのコントローラーループはkube-controller-managerで無効にする必要があります。 kube-controller-managerの起動時に `--cloud-provider` フラグを `external` に設定することで、コントローラーループを無効にできます。

cloud-controller-managerを使用すると、クラウドベンダーのコードとKubernetesコードを互いに独立して進化させることができます。以前のリリースでは、コアKubernetesコードは、機能的にクラウドプロバイダー固有のコードに依存していました。将来のリリースでは、クラウドベンダーに固有のコードはクラウドベンダー自身で管理し、Kubernetesの実行中にcloud-controller-managerにリンクする必要があります。

次のコントローラーには、クラウドプロバイダーへの依存関係があります。

  * ノードコントローラー：ノードが応答を停止した後、クラウドで削除されたかどうかを判断するため、クラウドプロバイダーをチェックします。
  * ルーティングコントローラー：基盤であるクラウドインフラでルーティングを設定します。
  * Serviceコントローラー：クラウドプロバイダーのロードバランサーの作成、更新、削除を行います。
  * Volumeコントローラー：Volumeを作成、アタッチ、マウントしたり、クラウドプロバイダーとやり取りしてVolumeを調整したりします。

## ノードコンポーネント

ノードコンポーネントはすべてのノードで実行され、実行中PodのメンテナンスおよびKubernetesランタイム環境の提供を行います。
>>>>>>> dev-1.15-ja.1

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

<<<<<<< HEAD
[kube-proxy](/docs/admin/kube-proxy/)は、ホスト上のネットワークルールを管理し、コネクションの転送を行うことで、Kubernetesサービスの抽象化を可能にします。

### コンテナランタイム

コンテナランタイムは、コンテナを稼働させる責務を持つソフトウェアです。
Kubernetesはいくつかのランタイムをサポートしています: [Docker](http://www.docker.com)、[containerd](https://containerd.io)、[cri-o](https://cri-o.io/)、[rktlet](https://github.com/kubernetes-incubator/rktlet)、また[Kubernetes CRI (コンテナランタイムインターフェース)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md)の実装があります。

## アドオン

アドオンは、クラスターの機能群を実装したPodとサービスです。そのPodは、Deployment、レプリケーションコントローラーなどによって管理されるでしょう。名前空間に属するアドオンオブジェクトは、`kube-system`名前空間に作られます。

一部のアドオンを下記に示します。その他の利用可能なアドオンのリストは、[アドオン](/docs/concepts/cluster-administration/addons/)を確認してください。

### DNS

厳密には他のアドオンは必須ではありませんが、多数の実例が依存しているため、全てのKubernetesクラスターは[クラスターDNS](/docs/concepts/services-networking/dns-pod-service/)を持つべきです。

クラスターDNSはDNSサーバーで、あなたの環境で動いている他のDNSサーバーに加え、Kubernetesサービスで利用するDNSレコードも扱います。

Kubernetesから起動されたコンテナは、DNSの検索対象として、自動的にこのDNSサーバーを含めます。

### Web UI (ダッシュボード)

[ダッシュボード](/docs/tasks/access-application-cluster/web-ui-dashboard/)は、汎用のKubernetesのクラスターを管理するためのWebベースのUIです。ユーザーはこれを用いて、クラスター上で稼働しているアプリケーション、またクラスターそのものの管理、トラブルシュートが可能です。

### コンテナリソース監視

[コンテナリソース監視](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)は、コンテナに関する一般的な時系列のメトリクスをセントラルなデータベースに記録し、そのデータを閲覧するUIを提供します。

### クラスターレベルロギング

[クラスターレベルロギング](/docs/concepts/cluster-administration/logging/)機構は、コンテナのログを、検索、閲覧のインターフェースを持ったセントラルなログ保管場所に保存します。

{{% /capture %}}

=======
{{< glossary_definition term_id="kube-proxy" length="all" >}}

### コンテナランタイム

{{< glossary_definition term_id="container-runtime" length="all" >}}

## アドオン

アドオンはクラスター機能を実装するためにKubernetesリソース({{< glossary_tooltip term_id="daemonset" >}}、{{< glossary_tooltip term_id="deployment" >}}など)を使用します。
アドオンはクラスターレベルの機能を提供しているため、アドオンのリソースで名前空間が必要なものは`kube-system`名前空間に属します。

いくつかのアドオンについて以下で説明します。より多くの利用可能なアドオンのリストは、[アドオン](/docs/concepts/cluster-administration/addons/) をご覧ください。

### DNS

クラスターDNS以外のアドオンは必須ではありませんが、すべてのKubernetesクラスターは[クラスターDNS](/docs/concepts/services-networking/dns-pod-service/)を持つべきです。多くの使用例がクラスターDNSを前提としています。

クラスターDNSは、環境内の他のDNSサーバーに加えて、KubernetesサービスのDNSレコードを提供するDNSサーバーです。

Kubernetesによって開始されたコンテナは、DNS検索にこのDNSサーバーを自動的に含めます。


### Web UI (ダッシュボード)

[ダッシュボード](/docs/tasks/access-application-cluster/web-ui-dashboard/)は、Kubernetesクラスター用の汎用WebベースUIです。これによりユーザーはクラスターおよびクラスター内で実行されているアプリケーションについて、管理およびトラブルシューティングを行うことができます。

### コンテナリソース監視

[コンテナリソース監視](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)は、コンテナに関する一般的な時系列メトリックを中央データベースに記録します。また、そのデータを閲覧するためのUIを提供します。

### クラスターレベルログ

[クラスターレベルログ](/docs/concepts/cluster-administration/logging/)メカニズムは、コンテナのログを、検索／参照インターフェイスを備えた中央ログストアに保存します。

{{% /capture %}}
{{% capture whatsnext %}}
* [ノード](/docs/concepts/architecture/nodes/) について学ぶ
* [kube-scheduler](/docs/concepts/scheduling/kube-scheduler/) について学ぶ
* etcdの公式 [ドキュメント](https://etcd.io/docs/) を読む
{{% /capture %}}
>>>>>>> dev-1.15-ja.1
