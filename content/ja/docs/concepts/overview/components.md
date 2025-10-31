---
title: Kubernetesのコンポーネント
content_type: concept
description: >
  Kubernetesクラスターはコントロールプレーンのコンポーネントとノードと呼ばれるマシン群で構成されています。
weight: 30
card: 
  name: concepts
  weight: 20
---

<!-- overview -->
Kubernetesをデプロイすると、クラスターが展開されます。
{{< glossary_definition term_id="cluster" length="all" prepend="Kubernetesクラスターは、">}}

このドキュメントでは、Kubernetesクラスターが機能するために必要となるさまざまなコンポーネントの概要を説明します。

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetesのコンポーネント" caption="Kubernetesクラスターを構成するコンポーネント" class="diagram-large" >}}

<!-- body -->

## コントロールプレーンコンポーネント

コントロールプレーンコンポーネントは、クラスターに関する全体的な決定(スケジューリングなど)を行います。また、クラスターイベントの検出および応答を行います(たとえば、deploymentの`replicas`フィールドが満たされていない場合に、新しい {{< glossary_tooltip text="Pod" term_id="pod">}} を起動する等)。

コントロールプレーンコンポーネントはクラスター内のどのマシンでも実行できますが、シンプルにするため、セットアップスクリプトは通常、すべてのコントロールプレーンコンポーネントを同じマシンで起動し、そのマシンではユーザーコンテナを実行しません。
複数のマシンにまたがって実行されるコントロールプレーンのセットアップ例については、[kubeadmを使用した高可用性クラスターの構築](/ja/docs/setup/production-environment/tools/kubeadm/high-availability/) を参照してください。

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

コントローラーには以下が含まれます。

  * ノードコントローラー：ノードがダウンした場合の通知と対応を担当します。
  * Jobコントローラー：単発タスクを表すJobオブジェクトを監視し、そのタスクを実行して完了させるためのPodを作成します。
  * EndpointSliceコントローラー：EndpointSliceオブジェクトを作成します(つまり、ServiceとPodを紐付けます)。
  * ServiceAccountコントローラー：新規の名前空間に対して、デフォルトのServiceAccountを作成します。

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

cloud-controller-managerは、クラウドプロバイダー固有のコントローラーのみを実行します。
Kubernetesをオンプレミスあるいは個人のPC内での学習環境で動かす際には、クラスターにcloud controller managerはありません。

kube-controller-managerと同様に、cloud-controller-managerは複数の論理的に独立したコントロールループをシングルバイナリにまとめ、一つのプロセスとして動作します。パフォーマンスを向上させるあるいは障害に耐えるために水平方向にスケールする(一つ以上のコピーを動かす)ことができます。

次の各コントローラーは、それぞれ以下に示すような目的のためにクラウドプロバイダーへの依存関係を持つことができるようになっています。

  * Nodeコントローラー: ノードが応答を停止した後、クラウドで当該ノードが削除されたかどうかを判断するため
  * Route コントローラー: 基盤となるクラウドインフラのルートを設定するため
  * Service コントローラー: クラウドプロバイダーのロードバランサーの作成、更新、削除を行うため

## ノードコンポーネント {#node-components}

ノードコンポーネントはすべてのノードで実行され、稼働中のPodの管理やKubernetesの実行環境を提供します。

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### コンテナランタイム {#container-runtime}

{{< glossary_definition term_id="container-runtime" length="all" >}}

## アドオン

アドオンはクラスター機能を実装するためにKubernetesリソース({{< glossary_tooltip term_id="daemonset" >}}、{{< glossary_tooltip term_id="deployment" >}}など)を使用します。
アドオンはクラスターレベルの機能を提供しているため、アドオンのリソースで名前空間が必要なものは`kube-system`名前空間に属します。

いくつかのアドオンについて以下で説明します。より多くの利用可能なアドオンのリストは、[アドオン](/ja/docs/concepts/cluster-administration/addons/) をご覧ください。

### DNS

クラスターDNS以外のアドオンは必須ではありませんが、すべてのKubernetesクラスターは[クラスターDNS](/ja/docs/concepts/services-networking/dns-pod-service/)を持つべきです。多くの使用例がクラスターDNSを前提としています。

クラスターDNSは、環境内の他のDNSサーバーに加えて、KubernetesサービスのDNSレコードを提供するDNSサーバーです。

Kubernetesによって開始されたコンテナは、DNS検索にこのDNSサーバーを自動的に含めます。


### Web UI (ダッシュボード)

[ダッシュボード](/ja/docs/tasks/access-application-cluster/web-ui-dashboard/)は、Kubernetesクラスター用の汎用WebベースUIです。これによりユーザーはクラスターおよびクラスター内で実行されているアプリケーションについて、管理およびトラブルシューティングを行うことができます。

### コンテナリソース監視

[コンテナリソース監視](/ja/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)は、コンテナに関する一般的な時系列メトリックを中央データベースに記録します。また、そのデータを閲覧するためのUIを提供します。

### クラスターレベルのロギング

[クラスターレベルのロギング](/ja/docs/concepts/cluster-administration/logging/)メカニズムは、コンテナのログを、検索／参照インターフェースを備えた中央ログストアに保存します。


## {{% heading "whatsnext" %}}

* [ノード](/ja/docs/concepts/architecture/nodes/)について学ぶ
* [コントローラー](/ja/docs/concepts/architecture/controller/)について学ぶ
* [kube-scheduler](/ja/docs/concepts/scheduling-eviction/kube-scheduler/)について学ぶ
* etcdの公式 [ドキュメント](https://etcd.io/docs/)を読む

