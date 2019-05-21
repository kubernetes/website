---
reviewers:
title: Kubernetesコンポーネント
content_template: templates/concept
weight: 20
card: 
  name: concepts
  weight: 20
---

{{% capture overview %}}

このページでは、Kubernetesクラスターの機能を提供するために必要になる様々なコンポーネントを説明します。（実行ファイル形式で提供される）

{{% /capture %}}

{{% capture body %}}

## マスターコンポーネント

マスターコンポーネントは、クラスターのコントロールプレーンです。マスターコンポーネントはクラスターに関する全体的な決定を行い（例えばスケジューリングなど）、クラスターのイベントを検知し、それらに応答します（例えば、レプリケーションコントローラーの'replicas'フィールドが充足されていない場合、新しいPodを立ち上げます）。

マスターコンポーネントは、クラスター内のどのマシン上でも動かすことが出来ます。しかし、話を簡単にするために、環境構築を行うスクリプトは通常、全てのマスターコンポーネントを同じマシン上で稼働させ、ユーザーのコンテナはそのマシンでは稼働させません。複数マスターマシン構成の構築例は、[高可用性クラスターを構築する](/docs/admin/high-availability/)を確認してください。

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

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

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

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

