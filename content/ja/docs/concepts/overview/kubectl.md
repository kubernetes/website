---
title: kubectlコマンドラインツール
content_type: concept
description: >
  kubectlは、Kubernetesクラスターと通信するための主要なコマンドラインツールです。
  このページでは、kubectlとKubernetesエコシステムにおけるその役割について概要を説明します。
weight: 50
card:
  name: concepts
  title: kubectl
  weight: 40
---

<!-- overview -->

{{< glossary_definition term_id="kubectl" length="short" >}}

`kubectl`ツールは、[Kubernetes API](/docs/concepts/overview/kubernetes-api/)を通じてクラスターと通信します。
設定については、`kubectl`は`$HOME/.kube`ディレクトリ内の`config`という名前のファイルを探します。
`KUBECONFIG`環境変数を設定するか、[`--kubeconfig`](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)フラグを設定することで、他の[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)ファイルを指定できます。

<!-- body -->

## kubectlの役割 {#role-of-kubectl}

`kubectl`ツールは、Kubernetesオブジェクトの作成、検査、更新、削除を行うための主要なインターフェースです。
クラスター内部で実行される[Kubernetesコンポーネント](/docs/concepts/overview/components/)と、それらのコンポーネントが実装する[Kubernetes API](/docs/concepts/overview/kubernetes-api/)を補完するものです。
ノートパソコンから`kubectl`を実行する場合でも、クラスター内のPodから実行する場合でも、APIサーバーにリクエストを送信します。
[クライアントライブラリ](/docs/reference/using-api/client-libraries/)や[Headlamp](https://headlamp.dev/)のようなWebダッシュボードなど、他のクライアントも同じAPIを通じて通信します。

## kubectlの仕組み {#how-kubectl-works}

`kubectl`ツールは、[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)ファイルで定義されたクラスター、ユーザー、およびコンテキストを使用してAPIサーバーに接続し、認証を行います。
クラスターの外部から`kubectl`を実行する場合、kubeconfigファイルを使用してAPIサーバーのアドレスと認証情報を見つけます。
`kubectl`がPod内(例えばCI/CDパイプライン内)で実行される場合、PodにマウントされたServiceAccountトークンに基づくクラスター内認証を使用できます。

コマンドを実行すると、`kubectl`はその意図を[Kubernetes API](/docs/concepts/overview/kubernetes-api/)への1つ以上のHTTPリクエストに変換します。
APIサーバーは各リクエストを検証し、{{< glossary_tooltip text="etcd" term_id="etcd" >}}に保存されたクラスターの状態に適用し、結果を返します。
これは、Deploymentの作成であってもログの読み取りであっても、すべての`kubectl`のアクションが同じAPIドリブンなパスを辿ることを意味します。

kubeconfigでは複数のクラスター、ユーザー、コンテキストを定義できるため、環境を再設定することなく`kubectl`を使用してクラスター間を切り替えることができます。
`kubectl config use-context`を実行してアクティブなコンテキストを変更してください。

## kubectlでできること {#what-you-can-do-with-kubectl}

`kubectl`ツールは多くの操作をサポートしており、以下の大まかなカテゴリに分類されます:

* **リソースの管理** – Pod、Deployment、Serviceなどのオブジェクトを作成、更新、削除します。
  設定ファイルによる宣言的な管理には`kubectl apply`を使用します。
* **クラスターの状態の検査** – オブジェクトの一覧表示と詳細表示、イベントの確認、リソース使用量のチェックを行います。
* **デバッグ** – コンテナからのログの確認、実行中のコンテナ内でのコマンドの実行、またはPodへのポートフォワードを行います。
* **クラスター操作** – メンテナンスのためにノードをドレインし、新しいワークロードを防ぐためにノードをcordonし、クラスターの設定を管理します。
* **スクリプトと自動化** – スクリプトやパイプラインで使用するために、出力をJSON、YAML、または[JSONPath](/docs/reference/kubectl/jsonpath/)を使用したカスタムカラム形式としてフォーマットします。

構文、コマンドリファレンス、および例については、[kubectlリファレンスドキュメント](/docs/reference/kubectl/)を参照してください。

## 宣言的管理と命令的管理 {#declarative-vs-imperative}

本番ワークロードでは、バージョン管理された設定ファイルとともに`kubectl apply`を使用した[宣言的なオブジェクト管理](/docs/concepts/overview/working-with-objects/object-management/)を推奨します。
宣言的管理は、変更の追跡、コラボレーション、GitOpsワークフローとの統合に役立ちます。
命令的なコマンド(`kubectl create`や`kubectl run`など)は開発や実験には便利ですが、再現や監査が困難です。

## プラグインによるkubectlの拡張 {#extending-kubectl-with-plugins}

新しいサブコマンドを追加する[プラグイン](/docs/tasks/extend-kubectl/kubectl-plugins/)で`kubectl`を拡張できます。
プラグインは、`kubectl-<plugin-name>`の命名規則に従うスタンドアロンのバイナリです。
Kubernetesコミュニティは多くのプラグインをメンテナンスしており、[Krew](https://krew.sigs.k8s.io/)プラグインマネージャーで管理できます。

## バージョン互換性 {#version-compatibility}

`kubectl`ツールは、クラスターのコントロールプレーンに対して前後1マイナーバージョンのバージョンスキューをサポートしています。
例えば、`kubectl` v1.32はv1.31、v1.32、v1.33のコントロールプレーンで動作します。
互換性のあるバージョンを使用することで、予期しない動作を回避できます。
詳細については、[バージョンスキューポリシー](/releases/version-skew-policy/)を参照してください。

## {{% heading "whatsnext" %}}

* 構文とコマンドの詳細については、[kubectlリファレンス](/docs/reference/kubectl/)を読んでください。
* お使いのマシンに[kubectlをインストール](/docs/tasks/tools/#kubectl)してください。
* `kubectl`が使用する[Kubernetes API](/docs/concepts/overview/kubernetes-api/)について学んでください。
* クラスターを構成する[Kubernetesのコンポーネント](/docs/concepts/overview/components/)を確認してください。
* [オブジェクト管理](/docs/concepts/overview/working-with-objects/object-management/)や宣言的設定について調べてください。
* サポートされるバージョンの組み合わせについて[バージョンスキューポリシー](/releases/version-skew-policy/)を確認してください。
