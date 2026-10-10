---
title: Kubernetesのコンポーネント
content_type: concept
description: >
  Kubernetesクラスターを構成するキーコンポーネントの概要。
weight: 10
card:
  title: クラスターのコンポーネント
  name: concepts
  weight: 20
---

<!-- overview -->

このページでは、Kubernetesクラスターを構成する必須コンポーネントの概略を説明します。

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetesのコンポーネント" caption="Kubernetesクラスターのコンポーネント" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## コアコンポーネント

Kubernetesクラスターは、コントロールプレーンと1つ以上のワーカーノードで構成されています。
以下に主要なコンポーネントの概要を簡単に説明します。

### コントロールプレーンコンポーネント

クラスター全体の状態を管理します:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: Kubernetes HTTP APIを公開するコアコンポーネントサーバーです。

[etcd](/docs/concepts/architecture/#etcd)
: APIサーバーのすべてのデータを保存する、一貫性と高可用性を兼ね備えたキーバリューストアです。

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: まだノードにバインドされていないPodを検出し、それぞれのPodを適切なノードに割り当てます。

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: {{< glossary_tooltip text="コントローラー" term_id="controller" >}}を実行して、Kubernetes APIの動作を実装します。

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager)(オプション)
: 基盤となるクラウドプロバイダーと統合します。

### ノードコンポーネント

すべてのノードで実行され、実行中のPodを維持し、Kubernetesランタイム環境を提供します。

[kubelet](/docs/concepts/architecture/#kubelet)
: コンテナを含むPodが稼働していることを保証します。

[kube-proxy](/docs/concepts/architecture/#kube-proxy)(オプション)
: ノード上のネットワークルールを維持し、{{< glossary_tooltip text="Service" term_id="service" >}}を実装します。

[コンテナランタイム](/docs/concepts/architecture/#container-runtime)
: コンテナを実行する役割を持つソフトウェアです。
  詳細は[コンテナランタイム](/docs/setup/production-environment/container-runtimes/)を参照してください。

{{% thirdparty-content single="true" %}}

クラスターによっては、各ノードに追加のソフトウェアが必要になる場合があります。
例えば、Linuxノード上で[systemd](https://systemd.io/)を実行してローカルコンポーネントを監督することもあります。

## アドオン

アドオンはKubernetesの機能を拡張します。
いくつかの重要な例は次のとおりです:

[DNS](/docs/concepts/architecture/#dns)
: クラスター全体のDNS解決のために使われます。

[Web UI](/docs/concepts/architecture/#web-ui-dashboard)(ダッシュボード)
: ウェブインターフェースを通してクラスターを管理するために使われます。

[Container Resource Monitoring](/docs/concepts/architecture/#container-resource-monitoring)
: コンテナのメトリクスを収集・保存するために使われます。

[Cluster-level Logging](/docs/concepts/architecture/#cluster-level-logging)
: コンテナのログを中央ログストアに保存するために使われます。

## アーキテクチャの柔軟性

Kubernetesは、これらのコンポーネントのデプロイと管理方法に柔軟性を持たせることができます。
Kubernetesのアーキテクチャは、小規模な開発環境から大規模な本番環境への展開まで、様々なニーズに適応できます。

各コンポーネントの詳細情報や、クラスターのアーキテクチャを設定する様々な方法については、[クラスターのアーキテクチャ](/docs/concepts/architecture/)のページをご覧ください。