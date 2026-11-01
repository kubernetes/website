---
title: 他のツール
content_type: concept
weight: 150
no_list: true
---

<!-- overview -->
Kubernetesには、Kubernetesシステムの操作に役立ついくつかの組み込みツールが含まれています。

<!-- body -->
## crictl

[`crictl`](https://github.com/kubernetes-sigs/cri-tools) は、{{<glossary_tooltip term_id="cri" text="CRI">}}と互換性のあるコンテナランタイムに使用可能な、調査・デバッグ用のためのコマンドラインツールです。


## Dashboard

[`Dashboard`](/ja/docs/tasks/access-application-cluster/web-ui-dashboard/)は、KubernetesのWebベースのユーザーインターフェースで、コンテナ化されたアプリケーションのKubernetesクラスターへのデプロイや、そのトラブルシューティング、クラスターとそのリソース自体の管理などを行うことができます。

## Headlamp

[`Headlamp`](https://headlamp.dev/)は、拡張可能なKubernetesのグラフィカルユーザーインターフェース(GUI)であり、Kubernetesクラスターのオプションコンポーネントです。
Headlampは、Kubernetesプロジェクトの一部です。

Headlampを用いて以下のことを行います。

* 最新の扱いやすいGUIを用いたクラスター管理及びトラブルシューティング
* クラスター内へのデプロイおよびデスクトップアプリケーションへの対応
* プラグインシステムによる拡張性
* ユーザーの権限に応じて動的に適用されるRBACベースのアクセス制御



## Helm
{{% thirdparty-content single="true" %}}

[`Helm`](https://github.com/helm/helm)は、事前に設定されたKubernetesリソースのパッケージ、別名 _Helm Charts_ を管理するためのツールです。

Helmを用いて以下のことを行います。

* Kubernetes chartsとしてパッケージ化された人気のあるソフトウェアの検索と利用
* Kubernetes chartsとして所有するアプリケーションを共有すること
* Kubernetesアプリケーションの再現性のあるビルドの作成
* Kubernetesマニフェストファイルの効率的な管理
* Helmパッケージのリリース管理

## Kompose

[`Kompose`](https://github.com/kubernetes/kompose)は、Docker ComposeユーザーがKubernetesに移行する手助けをするツールです。

Komposeを用いて以下のことを行います。

* Docker ComposeファイルのKubernetesオブジェクトへの変換
* ローカルのDocker開発からKubernetesを経由したアプリケーション管理への移行
* v1またはv2のDocker Compose用`yaml`ファイルならびに[分散されたアプリケーションバンドル](https://docs.docker.com/compose/bundles/)の変換


## Kui

[`Kui`](https://github.com/kubernetes-sigs/kui) は、通常の`kubectl`コマンドラインリクエストを受け取り、結果をグラフィックと共に返答するツールです。
ASCIIテーブルの代わりに、Kuiはソート可能なテーブルを備えたGUIレンダリングを提供します。

Kuiを用いて以下のことを行います。

* コピーペーストすることなく、自動生成された冗長なリソース名を直接クリックして確認
* Kui上で`kubectl`を実行可能で、時折`kubectl`本体よりも早いパフォーマンスを発揮
* {{< glossary_tooltip text="Job" term_id="job">}}をクエリし、実行結果をウォーターフォール図としてレンダリング
* タブ形式のUIを使って、クラスター内の様々なリソースをクリックして確認


## Minikube

[`minikube`](https://minikube.sigs.k8s.io/docs/)は、開発やテストのためにワークステーション上でシングルノードのKubernetesクラスターをローカルで実行するツールです。


