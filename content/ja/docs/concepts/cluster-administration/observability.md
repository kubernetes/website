---
title: 可観測性(オブザーバビリティ)
weight: 55
content_type: concept
description: >
  メトリクス、ログ、トレースを収集して、Kubernetesクラスター全体をエンドツーエンドで可視化する方法について理解しましょう。
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#metrics"
    title: メトリクス
  - anchor: "#logs"
    title: ログ
  - anchor: "#traces"
    title: トレース
---

<!-- overview -->

Kubernetesにおいて、可観測性(オブザーバビリティ)とは、メトリクス、ログ、トレース(しばしば可観測性の3本柱と呼ばれる)を収集・分析し、クラスターの内部状態、パフォーマンス、健全性をより深く理解するプロセスです。

Kubernetesコントロールプレーンコンポーネントや多くのアドオンは、これらのシグナルを生成・出力します。
これらを集約・相関付けることで、クラスター全体のコントロールプレーン、アドオン、アプリケーションの統合された全体像を得ることができます。

図1は、クラスターコンポーネントが、3つの主要なシグナルタイプをどのように出力するかを示しています。

{{< mermaid >}}
flowchart LR
    A[クラスターコンポーネント] --> M[メトリクスパイプライン]
    A --> L[ログパイプライン]
    A --> T[トレースパイプライン]
    M --> S[(ストレージと分析)]
    L --> S
    T --> S
    S --> O[オペレーターと自動化]
{{< /mermaid >}}

*図1. クラスターコンポーネントによって出力される高レベルなシグナルとそのコンシューマー。*

<!-- body -->
## メトリクス {#metrics}

Kubernetesコンポーネントは、`/metrics`エンドポイントから[Prometheus形式](https://prometheus.io/docs/instrumenting/exposition_formats/)でメトリクスを出力します。
以下が含まれます:

- kube-controller-manager
- kube-proxy
- kube-apiserver
- kube-scheduler
- kubelet

kubeletは、`/metrics/cadvisor`、`/metrics/resource`、`/metrics/probes`でもメトリクスを公開します。
また、[kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics/)などのアドオンは、Kubernetesオブジェクトのステータスを追加して、これらのコントロールプレーンシグナルを充実させます。

一般的なKubernetesメトリクスパイプラインは、これらのエンドポイントを定期的にスクレイプし、サンプルを時系列データベースに保存します(例: Prometheus)。

詳細や設定オプションについては、[システムメトリクスガイド](/docs/concepts/cluster-administration/system-metrics/)を参照してください。

図2は、一般的なKubernetesメトリクスパイプラインを示しています。

{{< mermaid >}}
flowchart LR
    C[クラスターコンポーネント] --> P[Prometheusスクレイパー]
    P --> TS[(時系列ストレージ)]
    TS --> D[ダッシュボードとアラート]
    TS --> A[自動化されたアクション]
{{< /mermaid >}}

*図2. 一般的なKubernetesメトリクスパイプラインのコンポーネント。*

マルチクラスターやマルチクラウドで可視性を高めるには、分散時系列データベース(例: ThanosやCortex)とPrometheusを組み合わせて使用することができます。

メトリクススクレイパーや時系列データベースについては、[一般的な可観測性ツール - メトリクスツール](#metrics-tools)を参照してください。

#### {{% heading "seealso" %}}

- [Kubernetesコンポーネントのシステムメトリクス](/docs/concepts/cluster-administration/system-metrics/)
- [metrics-serverによるリソース使用状況の監視](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
- [kube-state-metricsのコンセプト](/docs/concepts/cluster-administration/kube-state-metrics/)
- [リソースメトリクスパイプラインの概要](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)

## ログ {#logs}

ログは、アプリケーション内、Kubernetesシステムコンポーネント内、および監査ログなどのセキュリティに関連するアクティビティのイベントを時系列で記録します。

コンテナランタイムは、コンテナ化されたアプリケーションの標準出力(`stdout`)および標準エラー出力(`stderr`)ストリームからの出力をキャプチャします。
ランタイムごとに実装方法は異なりますが、kubeletとの統合は _CRIログ形式_ を通じて標準化されており、kubeletはこれらのログを`kubectl logs`で取得できるようにします。

![ノードレベルのログ記録](/images/docs/user-guide/logging/logging-node-level.png)

*図3a. ノードレベルのログ記録アーキテクチャ。*

システムコンポーネントログは、クラスターからのイベントをキャプチャし、デバッグやトラブルシューティングに役立つことがよくあります。
これらのコンポーネントは、コンテナ内で実行されるものと実行されないものの2つに分類されます。
例えば、`kube-scheduler`や`kube-proxy`は通常コンテナ内で実行されますが、`kubelet`やコンテナランタイムはホスト上で直接実行されます。

- `systemd`を使用するマシンでは、kubeletとコンテナランタイムはjournaldに書き込みます。
  それ以外の場合は、`/var/log`ディレクトリの`.log`ファイルに書き込みます。
- コンテナ内で実行されるシステムコンポーネントは、デフォルトのコンテナログ記録メカニズムをバイパスして、常に`/var/log`の`.log`ファイルに書き込みます。

`/var/log`配下に保存されるシステムコンポーネントのログやコンテナのログは、無制限に増大しないようにログローテーションが必要です。
一部のクラスタープロビジョニングスクリプトは、デフォルトでログローテーションを設定します。
自身の環境を確認し、必要に応じて調整してください。
ログファイルの保存場所、形式、設定オプションの詳細については、[システムログリファレンス](/docs/concepts/cluster-administration/system-logs/)を参照してください。

ほとんどのクラスターは、これらのファイルをtailして中央ログストアにエントリを転送するノードレベルのログエージェント(例: Fluent BitまたはFluentd)を実行しています。
[ログアーキテクチャガイダンス](/docs/concepts/cluster-administration/logging/)では、このようなパイプラインの設計、保持の適用、バックエンドへのログフローについて説明しています。

図3は、一般的なログ集約パイプラインを示しています。

{{< mermaid >}}
flowchart LR
    subgraph "ソース"
        A[アプリケーション stdout / stderr]
        B[コントロールプレーンログ]
        C[監査記録]
    end
    A --> N[ノードログエージェント]
    B --> N
    C --> N
    N --> L[中央ログストア]
    L --> Q[ダッシュボード, アラート, SIEM]
{{< /mermaid >}}

*図3. 一般的なKubernetesログパイプラインのコンポーネント。*

ログエージェントと中央ログストアについては、[一般的な可観測性ツール - ログツール](#logging-tools)を参照してください。

#### {{% heading "seealso" %}}

- [ログアーキテクチャ](/docs/concepts/cluster-administration/logging/)
- [システムログ](/docs/concepts/cluster-administration/system-logs/)
- [ログ記録のタスクとチュートリアル](/docs/tasks/debug/logging/)
- [監査ログの設定](/docs/tasks/debug/debug-cluster/audit/)

## トレース {#traces}

トレースは、リクエストがKubernetesコンポーネントとアプリケーション間をどのように移動するかをキャプチャし、レイテンシ、タイミング、処理間の関係を結び付けます。
トレースを収集することで、エンドツーエンドのリクエストフローを可視化し、パフォーマンスの問題を診断し、コントロールプレーン、アドオン、またはアプリケーションのボトルネックや予期しない動作を特定できます。

Kubernetes {{< skew currentVersion >}}は、組み込みのgRPCエクスポーターを介して直接、またはOpenTelemetry Collectorを通じて転送することで、[OpenTelemetry Protocol](/docs/concepts/cluster-administration/system-traces/)(OTLP)経由でスパンをエクスポートできます。

OpenTelemetry Collectorは、コンポーネントやアプリケーションからスパンを受信し、それらを処理(例: サンプリングやリダクションの適用)して、保存と分析のためにトレーシングバックエンドに転送します。

図4は、一般的な分散トレーシングパイプラインを示しています。

{{< mermaid >}}
flowchart LR
    subgraph "ソース"
        A[コントロールプレーンスパン]
        B[アプリケーションスパン]
    end
    A --> X[OTLPエクスポーター]
    B --> X
    X --> COL[OpenTelemetry Collector]
    COL --> TS[(トレーシングバックエンド)]
    TS --> V[可視化と分析]
{{< /mermaid >}}

*図4. 一般的なKubernetesトレースパイプラインのコンポーネント。*

トレーシングコレクターとバックエンドについては、[一般的な可観測性ツール - トレーシングツール](#tracing-tools)を参照してください。

#### {{% heading "seealso" %}}

- [Kubernetesコンポーネントのシステムトレース](/docs/concepts/cluster-administration/system-traces/)
- [OpenTelemetry Collectorスタートガイド](https://opentelemetry.io/docs/collector/getting-started/)
- [監視とトレースのタスク](/docs/tasks/debug/monitoring/)

## 一般的な可観測性ツール {#common-observability-tools}

{{% thirdparty-content %}}

注意: このセクションは、Kubernetesが必要とする可観測性機能を提供するサードパーティプロジェクトにリンクしています。
Kubernetesプロジェクトのメンテナーは、アルファベット順にリストされているこれらのプロジェクトに対して責任を負いません。
このリストにプロジェクトを追加するには、変更を提出する前に[コンテンツガイド](/docs/contribute/style/content-guide/)を読んでください。

### メトリクスツール {#metrics-tools}

- [Cortex](https://cortexmetrics.io/)は、水平スケーラブルな長期Prometheusストレージを提供します。
- [Grafana Mimir](https://grafana.com/oss/mimir/)は、マルチテナント、水平スケーラブルなPrometheus互換ストレージを提供するGrafana Labsのプロジェクトです。
- [Prometheus](https://prometheus.io/)は、Kubernetesコンポーネントからメトリクスをスクレイプして保存する監視システムです。
- [Thanos](https://thanos.io/)は、グローバルクエリ、ダウンサンプリング、オブジェクトストレージサポートでPrometheusを拡張します。

### ログツール {#logging-tools}

- [Elasticsearch](https://www.elastic.co/elasticsearch/)は、分散ログインデックスと検索を提供します。
- [Fluent Bit](https://fluentbit.io/)は、低リソース消費でコンテナとノードのログを収集・転送します。
- [Fluentd](https://www.fluentd.org/)は、ログを複数の宛先にルーティング・変換します。
- [Grafana Loki](https://grafana.com/oss/loki/)は、Prometheusに触発されたラベルベース形式でログを保存します。
- [OpenSearch](https://opensearch.org/)は、Elasticsearch APIと互換性のあるオープンソースのログインデックスと検索を提供します。

### トレーシングツール {#tracing-tools}

- [Grafana Tempo](https://grafana.com/oss/tempo/)は、スケーラブルで低コストな分散トレーシングストレージを提供します。
- [Jaeger](https://www.jaegertracing.io/)は、マイクロサービスの分散トレースをキャプチャして可視化します。
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)は、トレースを含むテレメトリーデータを受信、処理、エクスポートします。
- [Zipkin](https://zipkin.io/)は、分散トレーシングの収集と可視化を提供します。

## {{% heading "whatsnext" %}}

- [metrics-serverでリソース使用状況メトリクスを収集する](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)方法を学ぶ
- [ログ記録のタスクとチュートリアル](/docs/tasks/debug/logging/)を探索する
- [監視とトレースのタスクガイド](/docs/tasks/debug/monitoring/)を参照する
- コンポーネントエンドポイントと安定性について、[システムメトリクスガイド](/docs/concepts/cluster-administration/system-metrics/)を確認する
- 検証済みのサードパーティオプションについて、[一般的な可観測性ツール](#common-observability-tools)セクションを確認する
