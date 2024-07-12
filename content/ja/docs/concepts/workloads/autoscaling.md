---
tille: ワークロードの自動スケーリング
description: >-
  自動スケーリングによって、何らかのかたちでワークロードを自動的に更新できます。これによりクラスターはリソース要求の変化に対してより弾力的かつ効率的に対応できるようになります。
content_type: concept
weight: 40
---

<!-- overview -->

Kubernetesでは、現在のリソース要求に応じてワークロードをスケールできます。
これによりクラスターはリソース要求の変化に対してより弾力的かつ効率的に対応できるようになります。

ワークロードをスケールするとき、ワークロードによって管理されるレプリカ数を増減したり、レプリカで使用可能なリソースをインプレースで調整できます。

ひとつ目のアプローチは _水平スケーリング_ と呼ばれ、一方でふたつ目のアプローチは _垂直スケーリング_ と呼ばれます。

ユースケースに応じて、ワークロードをスケールするには手動と自動の方法があります。

<!-- body -->

## ワークロードを手動でスケーリングする {#scaling-workloads-manually}

Kubernetesはワークロードの _手動スケーリング_ をサポートします。
水平スケーリングは `kubectl` CLIを使用して行うことができます。
垂直スケーリングの場合、ワークロードのリソース定義を _パッチ適用_ する必要があります。

両方の戦略の例については以下をご覧ください。

- **水平スケーリング**: [Running multiple instances of your app](/ja/docs/tutorials/kubernetes-basics/scale/scale-intro/)
- **垂直スケーリング**: [Resizing CPU and memory resources assigned to containers](/docs/tasks/configure-pod-container/resize-container-resources)

## ワークロードを自動でスケーリングする {#scaling-workloads-automatically}

Kubernetesはワークロードの _自動スケーリング_ もサポートしており、これがこのページの焦点です。

Kubernetesにおける _オートスケーリング_ の概念は一連のPodを管理するオブジェクト(例えば{{< glossary_tooltip text="Deployment" term_id="deployment" >}})を自動的に更新する機能を指します。

### ワークロードを水平方向にスケーリングする {#scaling-workloads-horizontally}

Kubernetesにおいて、 _HorizontalPodAutoscaler_ (HPA)を使用してワークロードを水平方向に自動的にスケールできます。

これはKubernetes APIリソースおよび{{< glossary_tooltip text="コントローラー" term_id="controller">}}として実装されておりCPUやメモリ使用率のような観測されたリソース使用率と一致するようにワークロードの{{<glossary_tooltip text="レプリカ" term_id="replica" >}}数を定期的に調整します。

Deployment用のHorizontalPodAutoscalerを構成する[ウォークスルーチュートリアル](/ja/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough)があります。

### ワークロードを垂直方向にスケーリングする {#scaling-workloads-vertically}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

_VerticalPodAutoscaler_ (VPA)を使用してワークロードを垂直方向に自動的にスケールできます。
HPAと異なり、VPAはデフォルトでKubernetesに付属していませんが、[GitHubで](https://github.com/kubernetes/autoscaler/tree/9f87b78df0f1d6e142234bb32e8acbd71295585a/vertical-pod-autoscaler)見つかる別のプロジェクトです。

インストールすることにより、管理されたレプリカのリソースを _どのように_ _いつ_ スケールするのかを定義するワークロードの{{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}}(CRDs)を作成できるようになります。

{{< note >}}
HPAが機能するにはクラスターに[Metrics Server](https://github.com/kubernetes-sigs/metrics-server)がインストールされている必要があります。
{{< /note >}}

現時点では、VPAは4つの異なるモードで動作できます:　

{{< table caption="VPAの異なるモード" >}}
モード | 説明
:----|:-----------
`Auto` | 現在、`Recreate`は将来インプレースアップデートに変更される可能性があります
`Recreate` | VPAはPod作成時にリソースリクエストを割り当てるだけでなく、要求されたリソースが新しい推奨事項と大きく異なる場合にそれらを削除することによって既存のPod上でリソースリクエストを更新します
`Initial` | VPAはPod作成時にリソースリクエストを割り当て、後から変更することはありません
`Off` | VPAはPodのリソース要件を自動的に変更しません。推奨事項は計算され、VPAオブジェクトで検査できます
{{< /table >}}

#### インプレースリサイズの要件 {#requirements-for-in-place-resizing}

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

{{< glossary_tooltip text="Pod" term_id="pod" >}}またはその{{< glossary_tooltip text="コンテナ" term_id="container" >}}を再起動**せずに**インプレースでワークロードをリサイズするには、Kubernetesバージョン1.27以降が必要です。
さらに、`InPlaceVerticalScaling`フィーチャーゲートを有効にする必要があります。

{{< feature-gate-description name="InPlacePodVerticalScaling" >}}

### クラスターサイズに基づく自動スケーリング {#autoscaling-based-on-cluster-size}

クラスターのサイズに基づいてスケールする必要があるワークロード（例えば`cluster-dns`や他のシステムコンポーネント）の場合は、[_Cluster Proportional Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)を使用できます。
VPAと同じように、これはKubernetesのコア部分ではありませんが、独自のGitHubプロジェクトとしてホストされています。

Cluster Proportional Autoscalerはスケジュール可能な{{< glossary_tooltip text="ノード" term_id="node" >}}とコアの数を監視し、それに応じてターゲットワークロードのレプリカ数をスケールします。

レプリカ数を同じままにする必要がある場合、[_Cluster Proportional Vertical Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler)を使用してクラスターサイズに応じてワークロードを垂直方向にスケールできます。
このプロジェクトは**現在ベータ版**でありGitHubで見つけることができます。

Cluster Proportional Autoscalerがワークロードのレプリカ数をスケールする一方で、Cluster Proportional Vertical Autoscalerはクラスター内のノードおよび/またはコアの数に基づいてワークロード（例えばDeploymentやDaemonSet）のリソース要求を調整します。

### イベント駆動型自動スケーリング {#event-driven-autoscaling}

例えば[_Kubernetes Event Driven Autoscaler_
(**KEDA**)](https://keda.sh/)を使用して、イベントに基づいてワークロードをスケールすることもできます。

KEDAは例えばキューのメッセージ数などの処理するべきイベント数に基づいてワークロードをスケールするCNCF graduatedプロジェクトです。様々なイベントソースに合わせて選択できる幅広いアダプターが存在します。

### スケジュールに基づく自動スケーリング {#autoscaling-based-on-schedules}

ワークロードををスケールするためのもう一つの戦略は、例えばオフピークの時間帯にリソース消費を削減するために、スケーリング操作を**スケジュールする**ことです。

イベント駆動型オートスケーリングと同様に、そのような動作はKEDAを[`Cron`スケーラー](https://keda.sh/docs/2.13/scalers/cron/)と組み合わせて使用することで実現できます。
`Cron`スケーラーによりワークロードをスケールインまたはスケールアウトするためのスケジュール（およびタイムゾーン）を定義できます。

## クラスターのインフラストラクチャーのスケーリング {#scaling-cluster-infrastructure}

ワークロードのスケーリングだけではニーズを満たすのに十分でない場合は、クラスターのインフラストラクチャー自体をスケールすることもできます。

クラスターのインフラストラクチャーのスケーリングは通常{{< glossary_tooltip text="ノード" term_id="node" >}}の追加または削除を意味します。
詳しくは[クラスターの自動スケーリング](/docs/concepts/cluster-administration/cluster-autoscaling/)を読んでください。

## {{% heading "whatsnext" %}}

- 水平スケーリングについて詳しく学ぶ
  - [StatefulSetのスケール](/ja/docs/tasks/run-application/scale-stateful-set/)
  - [HorizontalPodAutoscalerウォークスルー](/ja/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
- [コンテナリソースのインプレースサイズ変更](/docs/tasks/configure-pod-container/resize-container-resources/)
- [クラスター内のDNSサービスを自動スケールする](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
- [クラスターの自動スケーリング](/docs/concepts/cluster-administration/cluster-autoscaling/)について学ぶ
