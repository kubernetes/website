---
title: ノードを安全にドレインする
content_type: task
weight: 310
---

<!-- overview -->
このページでは、{{< glossary_tooltip text="ノード" term_id="node" >}}を安全にドレインする方法を示します。
オプションで、定義されたPodDisruptionBudgetを考慮することも可能です。

## {{% heading "prerequisites" %}}

このタスクを実行するには、以下のいずれかの前提条件を満たしている必要があります:
  1. ノードのドレイン中にアプリケーションの高可用性を必要としない
  1. [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/)の概念に関する記事を読み、必要とするアプリケーションに対して[PodDisruptionBudgetを設定](/docs/tasks/run-application/configure-pdb/)していること

<!-- steps -->

## (オプション)Disruption Budgetを設定する {#configure-poddisruptionbudget}

メンテナンス中もワークロードの可用性を維持するために、[PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/)を設定できます。

ドレイン対象のノード上で動作している、または今後動作する可能性のあるアプリケーションにとって可用性が重要である場合は、まず[PodDisruptionBudgetを設定](/docs/tasks/run-application/configure-pdb/)してから、このガイドに従ってください。

ノードのドレイン中に不具合のあるアプリケーションの削除を許容するため、PodDisruptionBudgetには`AlwaysAllow`の[UnhealthyPodEvictionPolicy](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)を設定することが推奨されます。
デフォルトの挙動では、アプリケーションのPodが[健全](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)になるまで、ドレインは実行されません。

## `kubectl drain`を使ってノードをサービスから除外する

ノードに対してメンテナンス(例: カーネルのアップグレードやハードウェアのメンテナンスなど)を行う前に、`kubectl drain`を使用して、そのノード上のすべてのPodを安全に退避させることができます。
安全に退避すると、Podのコンテナが[正常に終了](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)し、指定したPodDisruptionBudgetも尊重されます。

{{< note >}}
デフォルトでは、`kubectl drain`はノード上で削除不可の特定のシステム用Podを無視します。
詳細は[kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)のドキュメントを参照してください。
{{< /note >}}

`kubectl drain`が正常に終了した場合、それは(前段で述べた除外対象を除く)すべてのPodが安全に削除されたことを示します(望ましい正常終了期間および定義されたPodDisruptionBudgetは尊重されます)。
その時点で、ノードを停止しても安全です。
物理マシンの場合は電源を落とすことができ、クラウドプラットフォーム上であれば仮想マシンを削除しても差し支えありません。

{{< note >}}
`node.kubernetes.io/unschedulable` taintを許容する新しいPodが存在する場合、それらのPodはドレイン済みのノードにスケジューリングされる可能性があります。
DaemonSet以外では、そのtaintを許容しないようにしてください。

あなた、または他のAPIユーザーがPodの[`nodeName`](/docs/concepts/scheduling-eviction/assign-pod-node/#nodename)フィールドを(スケジューラーを介さずに)直接設定した場合、そのPodは指定されたノードにバインドされ、そのノードがドレイン済みでスケジューリング不可とマークされていたとしても、そのノード上で実行されます。
{{< /note >}}

まず、ドレインしたいノードの名前を特定します。
クラスター内のすべてのノードは、次のコマンドで一覧表示できます:

```shell
kubectl get nodes
```

次に、ノードをドレインするようにKubernetesに指示します:

```shell
kubectl drain --ignore-daemonsets <node name>
```

DaemonSetによって管理されているPodが存在する場合は、ノードを正常にドレインするために、`kubectl`に`--ignore-daemonsets`を指定する必要があります。
`kubectl drain`サブコマンド単体では、実際にはDaemonSetのPodをノードからドレインしません:
DaemonSetコントローラー(コントロールプレーンの一部)は、欠落したPodをただちに同等の新しいPodで置き換えます。
また、DaemonSetコントローラーはスケジューリング不可のtaintを無視するPodも作成するため、ドレイン中のノード上に新しいPodが起動されることがあります。

エラーなくコマンドが完了したら、そのノードの電源を切ることができます(あるいは同等に、クラウドプラットフォーム上であれば、そのノードに対応する仮想マシンを削除することもできます)。
メンテナンス作業中にそのノードをクラスターに残しておいた場合は、作業完了後にKubernetesがそのノードへのPodのスケジューリングを再び可能にするために、次のコマンドを実行してください。

```shell
kubectl uncordon <node name>
```

## 複数ノードの並列ドレイン

`kubectl drain`コマンドは、一度に1つのノードに対してのみ発行すべきです。
ただし、異なるノードに対して、複数の`kubectl drain`コマンドを異なるターミナルまたはバックグラウンドで並行で実行することは可能です。
複数のドレインコマンドが同時に実行されていても、指定したPodDisruptionBudgetは引き続き順守されます。

たとえば、3つのレプリカを持つStatefulSetがあり、そのセットに対して`minAvailable: 2`を指定したPodDisruptionBudgetを設定している場合、`kubectl drain`は、3つのレプリカのPodがすべて[健全](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)である場合にのみ、そのStatefulSetのPodを退避させます。
このとき、複数のドレインコマンドを並行して発行した場合でも、KubernetesはPodDisruptionBudgetを順守し、任意の時点で使用不能なPodが1つ(`replicas - minAvailable`で計算)にとどまるように制御します。
[健全](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)なレプリカの数が指定したバジェットを下回る原因となるようなドレイン操作はブロックされます。

## Eviction API {#eviction-api}

[kubectl drain](/docs/reference/generated/kubectl/kubectl-commands/#drain)を使用したくないとき(外部コマンドの呼び出しを避けたい場合や、Podの退避プロセスをより細かく制御したい場合など)は、Eviction APIを用いてプログラムから退避を実行することもできます。

詳細は、[APIを基点とした退避](/docs/concepts/scheduling-eviction/api-eviction/)を参照してください。

## {{% heading "whatsnext" %}}

* [PodDisruptionBudgetを設定](/docs/tasks/run-application/configure-pdb/)してアプリケーションを保護する手順をご確認ください。

