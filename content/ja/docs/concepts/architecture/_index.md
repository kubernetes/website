---
title: "クラスターのアーキテクチャ"
weight: 30
no_list: true
description: >
  Kubernetesの背後にあるアーキテクチャのコンセプト。
---

Kubernetesクラスターは、コントロールプレーンと、コンテナ化されたアプリケーションを実行するワーカーマシン群(ノードと呼ばれます)で構成されます。
各クラスターには、Podを実行するために少なくとも1つのワーカーノードが必要です。

ワーカーノードは、アプリケーションのワークロードを構成するPodをホストします。
コントロールプレーンは、クラスター内のワーカーノードとPodを管理します。
本番環境では、コントロールプレーンは通常複数のコンピューターにまたがって実行され、クラスターは通常複数のノードを実行することで、耐障害性と高可用性を提供します。

このドキュメントでは、完全に機能するKubernetesクラスターに必要なさまざまなコンポーネントの概要を説明します。

{{< figure src="/images/docs/kubernetes-cluster-architecture.svg" alt="コントロールプレーン(kube-apiserver、etcd、kube-controller-manager、kube-scheduler)と複数のノード。各ノードではkubeletとkube-proxyが実行されています。" caption="図1. Kubernetesクラスターのコンポーネント。" class="diagram-large" >}}

{{< details summary="このアーキテクチャについて" >}}
図1は、Kubernetesクラスターのリファレンスアーキテクチャの一例を示しています。
コンポーネントの実際の配置は、具体的なクラスターの構成や要件によって異なる場合があります。

この図では、各ノードで[`kube-proxy`](#kube-proxy)コンポーネントが実行されています。
{{< glossary_tooltip text="Service" term_id="service">}} APIと関連する動作をクラスターネットワーク上で利用可能にするためには、各ノードにネットワークプロキシコンポーネントが必要です。
ただし、一部のネットワークプラグインは、独自のサードパーティ製プロキシ実装を提供しています。
そのようなネットワークプラグインを使用する場合、ノードで`kube-proxy`を実行する必要はありません。
{{< /details >}}

## コントロールプレーンコンポーネント {#control-plane-components}

コントロールプレーンのコンポーネントは、クラスターに関する全体的な判断(たとえばスケジューリングなど)を行うほか、クラスターのイベントの検知と対応(たとえば、Deploymentの`{{< glossary_tooltip text="replicas" term_id="replica" >}}`フィールドが満たされていない場合に新しい{{< glossary_tooltip text="Pod" term_id="pod">}}を起動するなど)を行います。

コントロールプレーンコンポーネントは、クラスター内の任意のマシンで実行できます。
ただし、単純化のため、セットアップスクリプトは通常すべてのコントロールプレーンコンポーネントを同じマシン上で起動し、そのマシンではユーザーのコンテナを実行しません。
複数のマシンにまたがって実行されるコントロールプレーンのセットアップ例については、[kubeadmを使用した高可用性クラスターの作成](/docs/setup/production-environment/tools/kubeadm/high-availability/)を参照してください。

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

コントローラーにはさまざまな種類があります。
いくつか例を挙げます:

- Nodeコントローラー: ノードがダウンした際に、それを検知して対応する役割を担います。
- Jobコントローラー: 一度限りのタスクを表すJobオブジェクトを監視し、それらのタスクを完了まで実行するためのPodを作成します。
- EndpointSliceコントローラー: (ServiceとPodの間のリンクを提供するために)EndpointSliceオブジェクトを作成します。
- ServiceAccountコントローラー: 新しい名前空間に対してデフォルトのServiceAccountを作成します。

上記はすべてを網羅したリストではありません。

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

cloud-controller-managerは、利用しているクラウドプロバイダーに固有のコントローラーのみを実行します。
オンプレミス環境でKubernetesを実行している場合や、自分のPC内の学習環境で実行している場合、クラスターにcloud-controller-managerは存在しません。

kube-controller-managerと同様に、cloud-controller-managerは、論理的に独立した複数の制御ループを、単一のプロセスとして実行する1つのバイナリにまとめています。
パフォーマンスの向上や障害への耐性を高めるために、水平方向にスケール(複数のコピーを実行)できます。

次のコントローラーは、クラウドプロバイダーに依存する可能性があります。

- Nodeコントローラー: ノードが応答を停止した後、そのノードがクラウド上で削除されたかどうかを判断するためにクラウドプロバイダーを確認します。
- Routeコントローラー: 基盤となるクラウドインフラ内でルートを設定します。
- Serviceコントローラー: クラウドプロバイダーのロードバランサーの作成、更新、削除を行います。

---

## Nodeコンポーネント {#node-components}

ノードコンポーネントはすべてのノード上で実行され、実行中のPodの維持やKubernetesの実行環境の提供を行います。

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy(オプション) {#kube-proxy}

{{< glossary_definition term_id="kube-proxy" length="all" >}}
Serviceに対するパケット転送を自身で実装し、kube-proxyと同等の動作を提供する[ネットワークプラグイン](#network-plugins)を使用している場合、クラスター内のノードでkube-proxyを実行する必要はありません。

### コンテナランタイム {#container-runtime}

{{< glossary_definition term_id="container-runtime" length="all" >}}

## アドオン {#addons}

アドオンは、Kubernetesのリソース({{< glossary_tooltip term_id="daemonset" >}}や{{< glossary_tooltip term_id="deployment" >}}など)を使用してクラスターの機能を実装します。
これらはクラスターレベルの機能を提供するため、アドオンの名前空間に属するリソースは`kube-system`名前空間に配置されます。

いくつかのアドオンについて以下で説明します。
利用可能なアドオンのより詳細な一覧については、[アドオン](/docs/concepts/cluster-administration/addons/)を参照してください。

### DNS

他のアドオンは厳密には必須ではありませんが、多くの例がクラスターDNSに依存しているため、すべてのKubernetesクラスターは[クラスターDNS](/docs/concepts/services-networking/dns-pod-service/)を備えるべきです。

クラスターDNSは、環境内にある他のDNSサーバーに加えて稼働するDNSサーバーであり、KubernetesのService用のDNSレコードを提供します。

Kubernetesによって起動されたコンテナは、自動的にこのDNSサーバーをDNS検索に含めます。

### Web UI(Dashboard) {#web-ui-dashboard}

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/)は、Kubernetesクラスターのための汎用的なWebベースのUIです。
ユーザーはこれを使って、クラスター内で稼働しているアプリケーションやクラスター自体の管理やトラブルシューティングを行えます。

### コンテナリソースの監視 {#container-resource-monitoring}

[コンテナリソースの監視](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)は、コンテナに関する一般的な時系列メトリクスを中央のデータベースに記録し、そのデータを閲覧するためのUIを提供します。

### クラスターレベルのロギング {#cluster-level-logging}

[クラスターレベルのロギング](/docs/concepts/cluster-administration/logging/)の仕組みは、コンテナのログを検索・閲覧用のインターフェースを備えた中央のログストアに保存する役割を担います。

### ネットワークプラグイン {#network-plugins}

[ネットワークプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins)は、Container Network Interface(CNI)仕様を実装するソフトウェアコンポーネントです。
PodへのIPアドレスの割り当てや、クラスター内でPod同士が通信できるようにする役割を担います。

## アーキテクチャのバリエーション {#architecture-variations}

Kubernetesの中核となるコンポーネントは一貫していますが、それらがデプロイされ管理される方法はさまざまです。
これらのバリエーションを理解することは、特定の運用上のニーズを満たすKubernetesクラスターを設計し維持するうえで非常に重要です。

### コントロールプレーンのデプロイオプション {#control-plane-deployment-options}

コントロールプレーンコンポーネントは、いくつかの方法でデプロイできます。

従来のデプロイ
: コントロールプレーンコンポーネントは専用のマシンやVM上で直接実行され、多くの場合systemdのサービスとして管理されます。

static Pod
: コントロールプレーンコンポーネントはstatic Podとしてデプロイされ、特定のノード上のkubeletによって管理されます。
  これはkubeadmのようなツールで使われる一般的なアプローチです。

セルフホスト
: コントロールプレーンはKubernetesクラスター自体の内部でPodとして実行され、DeploymentやStatefulSet、その他のKubernetesのプリミティブによって管理されます。

マネージドKubernetesサービス
: クラウドプロバイダーは多くの場合コントロールプレーンを抽象化し、そのコンポーネントを自身のサービス提供の一部として管理します。

### ワークロード配置に関する考慮事項 {#workload-placement-considerations}

コントロールプレーンコンポーネントを含むワークロードの配置は、クラスターのサイズ、パフォーマンス要件、運用ポリシーによって異なる場合があります:

- より小規模なクラスターや開発用のクラスターでは、コントロールプレーンコンポーネントとユーザーのワークロードが同じノード上で実行されることがあります。
- より大規模な本番クラスターでは、多くの場合特定のノードをコントロールプレーンコンポーネント専用にし、ユーザーのワークロードから分離します。
- 一部の組織では、重要なアドオンや監視ツールをコントロールプレーンのノード上で実行します。

### クラスター管理ツール {#cluster-management-tools}

kubeadm、kops、Kubesprayといったツールは、クラスターのデプロイと管理に対してそれぞれ異なるアプローチを提供しており、コンポーネントの配置や管理の方法もそれぞれ独自のものです。

### カスタマイズと拡張性 {#customization-and-extensibility}

Kubernetesのアーキテクチャは、大幅なカスタマイズを可能にします。

- カスタムスケジューラーをデプロイして、デフォルトのKubernetesスケジューラーと並行して動作させたり、完全に置き換えたりできます。
- APIサーバーは、CustomResourceDefinitionやAPIアグリゲーションによって拡張できます。
- クラウドプロバイダーは、cloud-controller-managerを使用してKubernetesと深く統合できます。

Kubernetesのアーキテクチャの柔軟性により、組織は運用の複雑さ、パフォーマンス、管理のオーバーヘッドといった要素のバランスを取りながら、クラスターを特定のニーズに合わせて調整できます。

## {{% heading "whatsnext" %}}

以下についてさらに学べます。

- [ノード](/docs/concepts/architecture/nodes/)とコントロールプレーンとの[通信](/docs/concepts/architecture/control-plane-node-communication/)。
- Kubernetesの[コントローラー](/docs/concepts/architecture/controller/)。
- クラスターオブジェクトの[ガベージコレクション](/docs/concepts/architecture/garbage-collection/)。
- Kubernetesのデフォルトスケジューラーである[kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/)。
- etcdの公式[ドキュメント](https://etcd.io/docs/)。
- Kubernetesにおけるいくつかの[コンテナランタイム](/docs/setup/production-environment/container-runtimes/)。
- [cloud-controller-manager](/docs/concepts/architecture/cloud-controller/)を使用したクラウドプロバイダーとの統合。
- [kubectl](/docs/reference/generated/kubectl/kubectl-commands)コマンド。
