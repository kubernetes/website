---
layout: blog
title: "Kubernetes v1.35: Workload Aware Scheduling の導入"
date: 2025-12-29T10:30:00-08:00
slug: kubernetes-v1-35-introducing-workload-aware-scheduling
author: >
  Maciej Skoczeń (Google),
  Dominik Marciński (Google)
translator: >
  [Daiki Hayakawa](https://github.com/bells17) ([3-shake Inc.](https://3-shake.com/))
---

大規模なワークロードのスケジューリングは、単一のPodをスケジューリングするよりもはるかに複雑で脆弱な操作です。
これは、各Podを独立してスケジューリングするのではなく、すべてのPodをまとめて考慮する必要があることが多いためです。
たとえば、機械学習のバッチジョブをスケジューリングする際には、プロセス全体を可能な限り効率的にするために、各ワーカーを同じラックに配置するなど、戦略的に配置する必要がよくあります。
同時に、このようなワークロードを構成するPodは、スケジューリングの観点からは非常に多くの場合同一であり、このプロセスのあるべき姿を根本的に変えるものです。

大規模ワークロードのスケジューリングを効率的に行うために適応されたカスタムスケジューラーは数多く存在しますが、特にユースケースが増加しているAI時代においては、こうしたワークロードのスケジューリングがKubernetesユーザーにとってどれほど一般的で重要であるかを考えると、大規模ワークロードのスケジューリングを `kube-scheduler` のファーストクラスの対象としてネイティブにサポートする時が来ています。

## Workload aware scheduling {#workload-aware-scheduling}

最近のKubernetes 1.35リリースでは、*Workload aware scheduling* の改善の第一弾が提供されました。
これらは、ワークロードのスケジューリングと管理を改善することを目的とした、より広範な取り組みの一部です。
この取り組みは複数のSIGとリリースにまたがり、最終目標に向けてシステムの機能を段階的に拡張していく予定です。
その目標とは、プリエンプションやオートスケーリングを含む（ただしこれらに限定されない）、Kubernetesにおけるシームレスなワークロードのスケジューリングと管理です。

Kubernetes v1.35では、ワークロードの望ましい構成やスケジューリング指向の要件を記述するために使用できるWorkload APIが導入されます。
また、Gang Podを *オール・オア・ナッシング* 方式でスケジューリングするように `kube-scheduler` に指示する、*Gangスケジューリング* の初期実装が含まれています。
さらに、*Opportunistic Batching処理* 機能により、（通常Gangを構成する）同一Podのスケジューリングを高速化するための改善も行いました。

## Workload API {#workload-api}

新しいWorkload APIリソースは `scheduling.k8s.io/v1alpha1`
{{< glossary_tooltip text="APIグループ" term_id="api-group" >}}の一部です。
このリソースは、マルチPodアプリケーションのスケジューリング要件を構造化された機械可読な定義として機能します。
Jobのようなユーザー向けワークロードが何を実行するかを定義するのに対し、Workloadリソースは、Podのグループをどのようにスケジューリングし、そのライフサイクルを通じて配置をどのように管理すべきかを決定します。

Workloadを使用すると、Podのグループを定義し、それにスケジューリングポリシーを適用できます。
以下はGangスケジューリングの設定例です。`workers` という名前の `podGroup` を定義し、`minCount` を4に設定した `gang` ポリシーを適用します。

```yaml
apiVersion: scheduling.k8s.io/v1alpha1
kind: Workload
metadata:
  name: training-job-workload
  namespace: some-ns
spec:
  podGroups:
  - name: workers
    policy:
      gang:
        # 4つのPodが同時に実行できる場合にのみGangはスケジュール可能
        minCount: 4
```

Podを作成する際には、新しい `workloadRef` フィールドを使用してこのWorkloadにリンクします:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
  namespace: some-ns
spec:
  workloadRef:
    name: training-job-workload
    podGroup: workers
  ...
```

## Gangスケジューリングの仕組み {#how-gang-scheduling-works}

`gang` ポリシーは *オール・オア・ナッシング* の配置を強制します。
Gangスケジューリングがなければ、Jobが部分的にスケジューリングされ、実行できないままリソースを消費し、リソースの浪費やデッドロックの可能性につながることがあります。

GangスケジューリングされたPodグループの一部であるPodを作成すると、スケジューラーの `GangScheduling` プラグインが各Podグループ（またはレプリカキー）のライフサイクルを独立して管理します:

1. Podを作成すると（またはコントローラーが自動的に作成すると）、
   スケジューラーは以下の条件が満たされるまでスケジューリングをブロックします:
   * 参照先のWorkloadオブジェクトが作成されていること。
   * 参照先のPodグループがWorkload内に存在すること。
   * そのグループ内の待機中のPod数が `minCount` を満たしていること。

2. 十分な数のPodが到着すると、スケジューラーはそれらの配置を試みます。
   ただし、すぐにNodeにバインドするのではなく、Podは `Permit` ゲートで待機します。

3. スケジューラーは、グループ全体（少なくとも `minCount` 分）に対して有効な割り当てが見つかったかどうかを確認します。
   * グループの余地がある場合、ゲートが開き、すべてのPodがNodeにバインドされます。
   * タイムアウト（5分に設定）以内にグループの一部のPodのみがスケジューリングされた場合、
     スケジューラーはグループ内の**すべて**のPodを拒否します。
     それらはキューに戻り、予約されたリソースが他のワークロードのために解放されます。

これは最初の実装ですが、Kubernetesプロジェクトは今後のリリースでGangスケジューリングアルゴリズムを改善・拡張することを明確に意図していることを指摘しておきます。
提供を目指している利点には、Gang全体の単一サイクルスケジューリングフェーズ、ワークロードレベルのプリエンプションなどが含まれ、最終目標に向かって進んでいきます。

## Opportunistic Batching {#opportunistic-batching}

明示的なGangスケジューリングに加えて、v1.35では *Opportunistic Batching* が導入されます。
これは、同一Podのスケジューリングレイテンシーを改善するベータ機能です。

Gangスケジューリングとは異なり、この機能はWorkload APIやユーザー側での明示的なオプトインを必要としません。
スケジューラー内でOpportunisticに動作し、同一のスケジューリング要件（コンテナイメージ、リソース要求、アフィニティなど）を持つPodを識別します。
スケジューラーがPodを処理する際に、キュー内の後続の同一Podに対して実行可能性の計算を再利用でき、プロセスを大幅に高速化します。

ほとんどのユーザーは、Podが以下の条件を満たしていれば、特別な手順を踏むことなく、この最適化の恩恵を自動的に受けることができます。

### 制約事項 {#restrictions}

Opportunistic Batching処理は特定の条件下で動作します。
`kube-scheduler` が配置を見つけるために使用するすべてのフィールドが、Pod間で同一である必要があります。
さらに、一部の機能を使用すると、正確性を確保するために、それらのPodに対するバッチ処理メカニズムが無効になります。

ワークロードに対してバッチ処理が暗黙的に無効になっていないことを確認するために、`kube-scheduler` の設定を確認する必要がある場合があることに注意してください。

制約事項の詳細については、[ドキュメント](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/#enabling-opportunistic-batching)を参照してください。

## 最終目標 {#the-north-star-vision}

プロジェクトには、ワークロード対応スケジューリングを実現するという広範な目標があります。
これらの新しいAPIとスケジューリングの拡張機能は、最初のステップに過ぎません。
近い将来、この取り組みは以下に取り組むことを目指しています:

* ワークロードスケジューリングフェーズの導入
* マルチノード [DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
  およびトポロジー対応スケジューリングのサポート改善
* ワークロードレベルのプリエンプション
* スケジューリングとオートスケーリングの統合改善
* 外部ワークロードスケジューラーとの連携改善
* ワークロードのライフサイクル全体を通じた配置管理
* マルチワークロードスケジューリングシミュレーション

他にもあります。これらの重点分野の優先順位と実装順序は変更される可能性があります。
今後の更新にご期待ください。

## はじめに {#getting-started}

ワークロード対応スケジューリングの改善を試すには:

* Workload API: `kube-apiserver` と `kube-scheduler` の両方で
  [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
  フィーチャーゲートを有効にし、`scheduling.k8s.io/v1alpha1`
  {{< glossary_tooltip text="APIグループ" term_id="api-group" >}}が有効であることを確認してください。
* Gangスケジューリング: `kube-scheduler` で
  [`GangScheduling`](/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling)
  フィーチャーゲートを有効にしてください（Workload APIが有効である必要があります）。
* Opportunistic Batching処理: ベータ機能として、v1.35ではデフォルトで有効になっています。
  必要に応じて、`kube-scheduler` の
  [`OpportunisticBatching`](/docs/reference/command-line-tools-reference/feature-gates/#OpportunisticBatching)
  フィーチャーゲートを使用して無効にできます。

テストクラスターでワークロード対応スケジューリングを試して、Kubernetesスケジューリングの将来を形作るために、ぜひ体験をお聞かせください。
フィードバックは以下の方法で送ることができます:

* [Slack (#sig-scheduling)](https://kubernetes.slack.com/archives/C09TP78DV)で連絡してください。
* [ワークロード対応スケジューリングの追跡Issue](https://github.com/kubernetes/kubernetes/issues/132192)にコメントしてください。
* Kubernetesリポジトリに新しい[Issue](https://github.com/kubernetes/enhancements/issues)を報告してください。

## さらに詳しく {#learn-more}

* [Workload APIとGangスケジューリング](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/4671-gang-scheduling)および
  [Opportunistic Batching処理](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/5598-opportunistic-batching)のKEPをお読みください。
* 最近の更新については、[ワークロード対応スケジューリングのIssue](https://github.com/kubernetes/kubernetes/issues/132192)を追跡してください。
