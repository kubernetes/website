---
no_issue: true
title: はじめに
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: 環境について学ぶ
  - anchor: "#production-environment"
    title: 本番環境
---

<!-- overview -->

このセクションではKubernetesをセットアップして動かすための複数のやり方について説明します。
Kubernetesをインストールする際には、メンテナンスの容易さ、セキュリティ、制御、利用可能なリソース、クラスターの運用および管理に必要な専門知識に基づいてインストレーションタイプを選んでください。

Kuerbetesクラスターをローカルマシン、クラウド、データセンターにデプロイするために、[Kubernetesをダウンロード](/releases/download/)できます。

{{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}}や{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}のようないくつかの[Kubernetesのコンポーネント](/ja/docs/concepts/overview/components/)も、[コンテナイメージ](/releases/download/#container-images)としてクラスター内にデプロイできます。

可能であればコンテナイメージとしてKubernetesのコンポーネントを実行し、それらのコンポーネントをKubernetesで管理するようにすることを**推奨**します。
コンテナを実行するコンポーネント(特にkubelet)は、このカテゴリーには含まれません。

Kubernetesクラスターを自分で管理するのを望まないなら、[認定プラットフォーム](/ja/docs/setup/production-environment/turnkey-solutions/)をはじめとする、マネージドのサービスを選択することもできます。
複数のクラウドやベアメタル環境にまたがった、その他の標準あるいはカスタムのソリューションもあります。

<!-- body -->

## 環境について学ぶ

Kubernetesについて学んでいる場合、Kubernetesコミュニティにサポートされているツールや、Kubernetesクラスターをローカルマシンにセットアップするエコシステム内のツールを使いましょう。
[ツールのインストール](/ja/docs/tasks/tools/)を参照してください。

## プロダクション環境

[プロダクション環境](/ja/docs/setup/production-environment/)用のソリューションを評価する際には、Kubernetesクラスター(または*抽象概念*)の運用においてどの部分を自分で管理し、どの部分をプロバイダーに任せるのかを考慮してください。

自分で管理するクラスターであれば、Kubernetesをデプロイするための公式にサポートされているツールは[kubeadm](/ja/docs/setup/production-environment/tools/kubeadm/)です。

## {{% heading "whatsnext" %}}

- [Kubernetesのダウンロード](/releases/download/)
- `kubectl`を含む、ツールのダウンロードと[インストール](/ja/docs/tasks/tools/)
- 新しいクラスターのための[コンテナランタイム](/ja/docs/setup/production-environment/container-runtimes/)の選択
- クラスターセットアップの[ベストプラクティス](/ja/docs/setup/best-practices/)を学ぶ

Kubernetesは、その{{< glossary_tooltip term_id="control-plane" text="コントロールプレーン" >}}がLinux上で実行されるよう設計されています。
クラスター内では、Linux上でも、Windowsを含めた別のオペレーティングシステム上でも、アプリケーションを実行できます。

- [Windowsノードのクラスターのセットアップ](/docs/concepts/windows/)について学ぶ
