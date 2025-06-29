---
title: ノードの安全な退避
content_type: task
weight: 310
---

<!-- overview -->
このページでは、定義されたPodDisruptionBudgetを守りながら、{{< glossary_tooltip text="ノード" term_id="node" >}}を安全に退避する方法を説明します。

## {{% heading "prerequisites" %}}

このタスクを実施する前に、以下の前提条件を満たしている必要があります。
  1. ノードの退避中にアプリケーションの高可用性を必要としない、または
  1. [PodDisruptionBudget](/ja/docs/concepts/workloads/pods/disruptions/)の概念を理解し、必要なアプリケーションに対して[PodDisruptionBudgetを設定](/ja/docs/tasks/run-application/configure-pdb/)している

<!-- steps -->

## （オプション）Disruption Budgetの設定 {#configure-poddisruptionbudget}

メンテナンス中もワークロードの可用性を維持したい場合は、[PodDisruptionBudget](/ja/docs/concepts/workloads/pods/disruptions/)を設定してください。

退避対象のノード上で実行されている、または実行される可能性のあるアプリケーションの可用性が重要な場合は、まず[PodDisruptionBudgetを設定](/ja/docs/tasks/run-application/configure-pdb/)してから、このガイドに従ってください。

ノード退避時に動作不良なアプリケーションの退避をサポートするため、PodDisruptionBudgetの[不健全なpodの退避ポリシー](/ja/docs/tasks/run-application/configure-pdb/#不健全なpodの退避ポリシー)を`AlwaysAllow`に設定することを推奨します。
デフォルトでは、退避を進める前にアプリケーションPodが[正常](/ja/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)になるのを待ちます。

## `kubectl drain`でサービスからノードを削除する

ノードでメンテナンス（例: カーネルアップグレードやハードウェアメンテナンスなど）を行う前に、`kubectl drain`を使ってノード上のすべてのPodを安全に退避できます。
安全な退避操作によって、Podのコンテナは[正常に終了](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)し、指定したPodDisruptionBudgetが考慮されます。

{{< note >}}
`kubectl drain`はデフォルトで、ノードにある停止できない一部のシステムPodを無視します。
詳細は[kubectl drain](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_drain/)を参照してください。
{{< /note >}}

`kubectl drain`が正常に終了した場合、それは、指定された正常終了期間やPodDisruptionBudgetを考慮して、前述の除外対象を除くすべてのPodが安全に退避されたことを意味します。
その後、物理マシンの電源を停止、またはクラウド環境の場合は仮想マシンを削除し、ノードを停止しても安全です。

{{< note >}}
`node.kubernetes.io/unschedulable` taintを許容する新しいPodがある場合、それらのPodは退避済みノードにスケジューリングされる可能性があります。
このtaintはDaemonSet以外では許容しないようにしてください。

また、APIユーザーがPodの[`nodeName`](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#nodename)フィールドを直接設定(スケジューラーをバイパス)した場合、そのPodは退避済みかつスケジューリング不可にしたノード上でも実行されます。
{{< /note >}}

まず、退避したいノード名を特定します。クラスター内のノード一覧は次のコマンドで確認できます:

```shell
kubectl get nodes
```

次に、Kubernetesにノードの退避を指示します:

```shell
kubectl drain --ignore-daemonsets <ノード名>
```

DaemonSetで管理されているPodが存在する場合、`kubectl`で`--ignore-daemonsets`を指定する必要があります。
`kubectl drain`サブコマンド単体ではDaemonSetのPodは退避されません。
コントロールプレーンのDaemonSetコントローラーが、失われたPodを新しい同等のPodで即座に置き換えてしまいます。
また、DaemonSetコントローラーはスケジューリング不可taintを無視するPodを作成するため、退避中のノードにも新しいPodが起動してしまいます。

退避コマンドがエラーなく終了したら、ノードの電源を切る(またはクラウドの場合は仮想マシンを削除する)ことができます。
メンテナンス作業中もノードをクラスターに残す場合は、作業後に次のコマンド

```shell
kubectl uncordon <ノード名>
```

を実行して、ノードがPodのスケジューリング候補に復帰したとKubernetesへ伝える必要があります。

## 複数ノードの並列退避

`kubectl drain`コマンドは1度に1つのノードに対してのみ実行するべきです。
ただし、異なるノードに対して複数の`kubectl drain`コマンドを別々のターミナルやバックグラウンドで並行して実行することは可能です。
複数の退避コマンドが同時に動作しても、指定したPodDisruptionBudgetは遵守されます。

例えば、3つのレプリカを持つStatefulSetに`minAvailable: 2`を指定したPodDisruptionBudgetを設定している場合、`kubectl drain`は3つのレプリカPodがすべて[正常](/ja/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)なときのみPodを退避します。
複数の退避コマンドを並行して実行した場合でも、KubernetesはPodDisruptionBudgetを守り、
同時に利用できないPodが常に1つ(`replicas - minAvailable`で計算された数)以下であることを保証します。
正常なレプリカの個数がPDBで指定した数を下回るような退避操作は、全てブロックされます。

## Eviction API {#eviction-api}
[kubectl drain](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_drain/)を使いたくない場合(外部コマンドの呼び出しを避けたい場合や、Podの退避プロセスをより細かく制御したい場合など)は、Eviction APIによってプログラムから退避操作を実行できます。

詳細は[APIによる退避](/ja/docs/concepts/scheduling-eviction/api-eviction/)を参照してください。

## {{% heading "whatsnext" %}}

* [PodDisruptionBudgetの設定](/ja/docs/tasks/run-application/configure-pdb/)でアプリケーションを保護する手順を確認してください。
