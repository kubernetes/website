---
title: Kubernetesのスケジューラー
content_type: concept
weight: 60
---

<!-- overview -->

Kubernetesにおいて、_スケジューリング_ とは、{{< glossary_tooltip term_id="kubelet" >}}が{{< glossary_tooltip text="Pod" term_id="pod" >}}を稼働させるために{{< glossary_tooltip text="Node" term_id="node" >}}に割り当てることを意味します。



<!-- body -->

## スケジューリングの概要{#scheduling}

スケジューラーは新規に作成されたPodで、Nodeに割り当てられていないものを監視します。スケジューラーは発見した各Podのために、稼働させるべき最適なNodeを見つけ出す責務を担っています。そのスケジューラーは下記で説明するスケジューリングの原理を考慮に入れて、NodeへのPodの割り当てを行います。

Podが特定のNodeに割り当てられる理由を理解したい場合や、カスタムスケジューラーを自身で作ろうと考えている場合、このページはスケジューリングに関して学ぶのに役立ちます。

## kube-scheduler

[kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)はKubernetesにおけるデフォルトのスケジューラーで、{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}の一部分として稼働します。
kube-schedulerは、もし希望するのであれば自分自身でスケジューリングのコンポーネントを実装でき、それを代わりに使用できるように設計されています。

kube-schedulerは、新規に作成された各Podや他のスケジューリングされていないPodを稼働させるために最適なNodeを選択します。
しかし、Pod内の各コンテナにはそれぞれ異なるリソースの要件があり、各Pod自体にもそれぞれ異なる要件があります。そのため、既存のNodeは特定のスケジューリング要求によってフィルターされる必要があります。

クラスター内でPodに対する割り当て要求を満たしたNodeは_割り当て可能_ なNodeと呼ばれます。
もし適切なNodeが一つもない場合、スケジューラーがNodeを割り当てることができるまで、そのPodはスケジュールされずに残ります。

スケジューラーはPodに対する割り当て可能なNodeをみつけ、それらの割り当て可能なNodeにスコアをつけます。その中から最も高いスコアのNodeを選択し、Podに割り当てるためのいくつかの関数を実行します。
スケジューラーは_binding_ と呼ばれる処理中において、APIサーバーに対して割り当てが決まったNodeの情報を通知します。

スケジューリングを決定する上で考慮が必要な要素としては、個別または複数のリソース要求や、ハードウェア/ソフトウェアのポリシー制約、affinityやanti-affinityの設定、データの局所性や、ワークロード間での干渉などが挙げられます。

## kube-schedulerによるスケジューリング{#kube-scheduler-implementation}

kube-schedulerは2ステップの操作によってPodに割り当てるNodeを選択します。

1. フィルタリング

2. スコアリング

_フィルタリング_ ステップでは、Podに割り当て可能なNodeのセットを探します。例えばPodFitsResourcesフィルターは、Podのリソース要求を満たすのに十分なリソースをもつNodeがどれかをチェックします。このステップの後、候補のNodeのリストは、要求を満たすNodeを含みます。
たいてい、リストの要素は複数となります。もしこのリストが空の場合、そのPodはスケジュール可能な状態とはなりません。

_スコアリング_ ステップでは、Podを割り当てるのに最も適したNodeを選択するために、スケジューラーはリストの中のNodeをランク付けします。
スケジューラーは、フィルタリングによって選ばれた各Nodeに対してスコアを付けます。このスコアはアクティブなスコア付けのルールに基づいています。

最後に、kube-schedulerは最も高いランクのNodeに対してPodを割り当てます。もし同一のスコアのNodeが複数ある場合は、kube-schedulerがランダムに1つ選択します。

スケジューラーのフィルタリングとスコアリングの動作に関する設定には2つのサポートされた手法があります。

1. [スケジューリングポリシー](/docs/reference/scheduling/policies) は、フィルタリングのための_Predicates_とスコアリングのための_Priorities_の設定することができます。
1. [スケジューリングプロファイル](/docs/reference/scheduling/config/#profiles)は、`QueueSort`、 `Filter`、 `Score`、 `Bind`、 `Reserve`、 `Permit`やその他を含む異なるスケジューリングの段階を実装するプラグインを設定することができます。kube-schedulerを異なるプロファイルを実行するように設定することもできます。


## {{% heading "whatsnext" %}}

* [スケジューラーのパフォーマンスチューニング](/ja/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)を参照してください。
* [Podトポロジーの分散制約](/docs/concepts/workloads/pods/pod-topology-spread-constraints/)を参照してください。
* kube-schedulerの[リファレンスドキュメント](/docs/reference/command-line-tools-reference/kube-scheduler/)を参照してください。
* [複数のスケジューラーの設定](/docs/tasks/administer-cluster/configure-multiple-schedulers/)について学んでください。
* [トポロジーの管理ポリシー](/docs/tasks/administer-cluster/topology-manager/)について学んでください。
* [Podのオーバーヘッド](/docs/concepts/scheduling-eviction/pod-overhead/)について学んでください。
* ボリュームを使用するPodのスケジューリングについて以下で学んでください。
  * [Volume Topology Support](/docs/concepts/storage/storage-classes/#volume-binding-mode)
  * [ストレージ容量の追跡](/ja//docs/concepts/storage/storage-capacity/)
  * [Node-specific Volume Limits](/docs/concepts/storage/storage-limits/)
