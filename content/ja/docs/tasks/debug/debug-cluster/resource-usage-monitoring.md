---
content_type: concept
title: リソース監視のためのツール
weight: 15
---

<!-- overview -->

アプリケーションを拡張し、信頼性の高いサービスを提供するために、デプロイ時にアプリケーションがどのように動作するかを理解する必要があります。
コンテナ、[Pod](/ja/docs/concepts/workloads/pods/)、[Service](/ja/docs/concepts/services-networking/service/)、クラスター全体の特性を調べることにより、Kubernetesクラスターのアプリケーションパフォーマンスを調査することができます。
Kubernetesは、これらの各レベルでアプリケーションのリソース使用に関する詳細な情報を提供します。
この情報により、アプリケーションのパフォーマンスを評価し、ボトルネックを取り除くことで全体のパフォーマンスを向上させることができます。

<!-- body -->

Kubernetesでは、アプリケーションの監視は1つの監視ソリューションに依存することはありません。
新しいクラスターでは、[リソースメトリクス](#resource-metrics-pipeline)または[フルメトリクス](#full-metrics-pipeline)パイプラインを使用してモニタリング統計を収集することができます。

## リソースメトリクスパイプライン {#resource-metrics-pipeline}

リソースメトリックパイプラインは、[Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/)コントローラーなどのクラスターコンポーネントや、`kubectl top`ユーティリティに関連する限定的なメトリックセットを提供します。

これらのメトリクスは軽量、短期、インメモリーの[metrics-server](https://github.com/kubernetes-sigs/metrics-server)によって収集され、`metrics.k8s.io` APIを通じて公開されます。

metrics-serverはクラスター上のすべてのノードを検出し
各ノードの[kubelet](/docs/reference/command-line-tools-reference/kubelet/)にCPUとメモリーの使用量を問い合わせます。

kubeletはKubernetesマスターとノードの橋渡し役として、マシン上で動作するPodやコンテナを管理する。
kubeletは各Podを構成するコンテナに変換し、コンテナランタイムインターフェースを介してコンテナランタイムから個々のコンテナ使用統計情報を取得します。この情報は、レガシーDocker統合のための統合cAdvisorから取得されます。

そして、集約されたPodリソース使用統計情報を、metrics-server Resource Metrics APIを通じて公開します。
このAPIは、kubeletの認証済みおよび読み取り専用ポート上の `/metrics/resource/v1beta1` で提供されます。

## フルメトリクスパイプライン {#full-metrics-pipeline}

フルメトリクスパイプラインは、より豊富なメトリクスにアクセスすることができます。
Kubernetesは、Horizontal Pod Autoscalerなどのメカニズムを使用して、現在の状態に基づいてクラスターを自動的にスケールまたは適応させることによって、これらのメトリクスに対応することができます。
モニタリングパイプラインは、kubeletからメトリクスを取得し、`custom.metrics.k8s.io` または `external.metrics.k8s.io` APIを実装してアダプタ経由でKubernetesにそれらを公開します。
CNCFプロジェクトの[Prometheus](https://prometheus.io)は、Kubernetes、ノード、Prometheus自身をネイティブに監視することができます。
CNCFに属さない完全なメトリクスパイプラインのプロジェクトは、Kubernetesのドキュメントの範囲外です。

## {{% heading "whatsnext" %}}

以下のような追加のデバッグツールについて学びます:

* [ロギング](/ja/docs/concepts/cluster-administration/logging/)
* [モニタリング](/ja/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
* [`exec`でコンテナに入る](/ja/docs/tasks/debug/debug-application/get-shell-running-container/)
* [Connecting to containers via proxies](/docs/tasks/extend-kubernetes/http-proxy-access-api/)
* [Connecting to containers via port forwarding](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* [crictlでKubernetesのノードを検査する](/ja/docs/tasks/debug/debug-cluster/crictl/)
