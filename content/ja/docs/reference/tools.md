---
title: ツール
content_type: concept
---

<!-- overview -->
Kubernetesには、Kubernetesシステムの操作に役立ついくつかの組み込みツールが含まれています。

<!-- body -->
## crictl

[`crictl`](https://github.com/kubernetes-sigs/cri-tools) は、{{<glossary_tooltip term_id="cri" text="CRI">}}と互換性のあるコンテナランタイムに使用可能な、調査・デバッグ用のためのコマンドラインツールです。


## Dashboard
[`Dashboard`](/ja/docs/tasks/access-application-cluster/web-ui-dashboard/)は、KubernetesのWebベースのユーザーインターフェースで、コンテナ化されたアプリケーションをKubernetesクラスターにデプロイしたり、トラブルシューティングしたり、クラスターとそのリソース自体を管理したりすることが出来ます。

## Headlamp

[`Headlamp`](https://headlamp.dev/)は、拡張可能なKubernetesのグラフィカルユーザーインターフェース(GUI)であり、Kubernetesクラスターのオプションコンポーネントです。
Headlampは、Kubernetesプロジェクトの一部です。

Headlampを用いて以下のことを行います。

* 最新の扱いやすいGUIを用いたクラスター管理及びトラブルシューティング

* クラスター内へのデプロイおよびデスクトップアプリケーションへの対応

* プラグインシステムによる拡張性

* ユーザーの権限に応じて動的に適用されるRBACベースのアクセス制御



## Helm
[`Helm`](https://github.com/helm/helm)は、事前に設定されたKubernetesリソースのパッケージ、別名Kubernetes chartsを管理するためのツールです。

Helmを用いて以下のことを行います。

* Kubernetes chartsとしてパッケージ化された人気のあるソフトウェアの検索と利用

* Kubernetes chartsとして所有するアプリケーションを共有すること

* Kubernetesアプリケーションの再現性のあるビルドの作成

* Kubernetesマニフェストファイルを知的な方法で管理

* Helmパッケージのリリース管理

## Kompose
[`Kompose`](https://github.com/kubernetes/kompose)は、Docker ComposeユーザーがKubernetesに移行する手助けをするツールです。

Komposeを用いて以下のことを行います。

* Docker ComposeファイルのKubernetesオブジェクトへの変換

* ローカルのDocker開発からKubernetesを経由したアプリケーション管理への移行

* v1またはv2のDocker Compose用`yaml`ファイルならびに[分散されたアプリケーションバンドル](https://docs.docker.com/compose/bundles/)の変換


## Kui
[`Kui`](https://github.com/kubernetes-sigs/kui) は、`kubectl`でコマンドラインリクエストを受け取り、結果をGUIで表示できるツールです。

`kubectl`の出力がASCIIテーブルの代わりに、ユーザーがソート出来るテーブルをGUI上で表示します。

Kuiを用いて以下のことを行います。

* コピーペーストすることなく、自動生成された冗長なリソース名を直接クリックして確認

* Kui上で`kubectl`を実行可能で、時折`kubectl`本体よりも早いパフォーマンスを発揮

* {{< glossary_tooltip text="Job" term_id="job">}}をクエリし、実行をウォーターフォール図で確認

* タブ形式のUIを使って、クラスター内の様々なリソースをクリックして確認


## Minikube
[`minikube`](https://minikube.sigs.k8s.io/docs/)は、開発やテストのためにワークステーション上でシングルノードのKubernetesクラスターをローカルで実行するツールです。


