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

### デフォルトのポリシーについて

kube-schedulerは、デフォルトで用意されているスケジューリングポリシーのセットを持っています。

### フィルタリング

- `PodFitsHostPorts`: Nodeに、Podが要求するポートが利用可能かどうかをチェックします。

- `PodFitsHost`: Podがそのホスト名において特定のNodeを指定しているかをチェックします。

- `PodFitsResources`: Nodeに、Podが要求するリソース(例: CPUとメモリー)が利用可能かどうかをチェックします。

- `PodMatchNodeSelector`: PodのNodeSelectorが、Nodeのラベルにマッチするかどうかをチェックします。

- `NoVolumeZoneConflict`: Podが要求するVolumeがNode上で利用可能かを、障害が発生しているゾーンを考慮して評価します。

- `NoDiskConflict`: NodeのVolumeがPodの要求を満たし、すでにマウントされているかどうかを評価します。

- `MaxCSIVolumeCount`: CSI Volumeをいくつ割り当てるべきか決定し、それが設定された上限を超えるかどうかを評価します。

- `CheckNodeMemoryPressure`: もしNodeがメモリーの容量が逼迫している場合、また設定された例外がない場合はそのPodはそのNodeにスケジュールされません。

- `CheckNodePIDPressure`: もしNodeのプロセスIDが枯渇しそうになっていた場合や、設定された例外がない場合はそのPodはそのNodeにスケジュールされません。

- `CheckNodeDiskPressure`: もしNodeのストレージが逼迫している場合(ファイルシステムの残り容量がほぼない場合)や、設定された例外がない場合はそのPodはそのNodeにスケジュールされません。

- `CheckNodeCondition`: Nodeは、ファイルシステムの空き容量が完全になくなった場合、ネットワークが利用不可な場合、kubeletがPodを稼働させる準備をできていない場合などに、その状況を通知できます。Nodeがこの状況下かつ設定された例外がない場合、Podは該当のNodeにスケジュールされません。

- `PodToleratesNodeTaints`: PodのTolerationがNodeのTaintを許容できるかチェックします。

- `CheckVolumeBinding`: Podが要求するVolumeの要求を満たすか評価します。これはPersistentVolumeClaimがバインドされているかに関わらず適用されます。

### スコアリング

- `SelectorSpreadPriority`:　同一のService、StatefulSetや、ReplicaSetに属するPodを複数のホストをまたいで稼働させます。

- `InterPodAffinityPriority`: weightedPodAffinityTermの要素をイテレートして合計を計算したり、もし一致するPodAffinityTermがNodeに適合している場合は、"重み"を合計値に足したりします。:最も高い合計値を持つNode(複数もあり)が候補となります。

- `LeastRequestedPriority`: 要求されたリソースがより低いNodeを優先するものです。言い換えると、Nodeに多くのPodが稼働しているほど、Podが使用するリソースが多くなり、その要求量が低いNodeが選択されます。

- `MostRequestedPriority`: 要求されたリソースがより多いNodeを優先するものです。このポリシーは、ワークロードの全体セットを実行するために必要な最小数のNodeに対して、スケジュールされたPodを適合させます。　

- `RequestedToCapacityRatioPriority`: デフォルトのリソーススコアリング関数を使用して、requestedToCapacityベースのResourceAllocationPriorityを作成します。

- `BalancedResourceAllocation`: バランスのとれたリソース使用量になるようにNodeを選択します。

- `NodePreferAvoidPodsPriority`: Nodeの`scheduler.alpha.kubernetes.io/preferAvoidPods`というアノテーションに基づいてNodeの優先順位づけをします。この設定により、2つの異なるPodが同じNode上で実行しないことを示唆できます。

- `NodeAffinityPriority`: "PreferredDuringSchedulingIgnoredDuringExecution"の値によって示されたNode Affinityのスケジューリング性向に基づいてNodeの優先順位づけを行います。詳細は[NodeへのPodの割り当て](https://kubernetes.io/ja/docs/concepts/scheduling-eviction/assign-pod-node/)にて確認できます。

- `TaintTolerationPriority`: Node上における許容できないTaintsの数に基づいて、全てのNodeの優先順位リストを準備します。このポリシーでは優先順位リストを考慮してNodeのランクを調整します。

- `ImageLocalityPriority`: すでにPodに対するコンテナイメージをローカルにキャッシュしているNodeを優先します。

- `ServiceSpreadingPriority`: このポリシーの目的は、特定のServiceに対するバックエンドのPodが、それぞれ異なるNodeで実行されるようにすることです。このポリシーではServiceのバックエンドのPodがすでに実行されていないNode上にスケジュールするように優先します。これによる結果として、Serviceは単体のNode障害に対してより耐障害性が高まります。

- `CalculateAntiAffinityPriorityMap`: このポリシーは[PodのAnti-Affinity](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)の実装に役立ちます。

- `EqualPriorityMap`: 全てのNodeに対して等しい重みを与えます。


## {{% heading "whatsnext" %}}

* [スケジューラーのパフォーマンスチューニング](/ja/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)を参照してください。
* [Podトポロジーの分散制約](/docs/concepts/workloads/pods/pod-topology-spread-constraints/)を参照してください。
* kube-schedulerの[リファレンスドキュメント](/docs/reference/command-line-tools-reference/kube-scheduler/)を参照してください。
* [複数のスケジューラーの設定](/docs/tasks/administer-cluster/configure-multiple-schedulers/)について学んでください。
* [トポロジーの管理ポリシー](/docs/tasks/administer-cluster/topology-manager/)について学んでください。
* [Podのオーバーヘッド](/docs/concepts/configuration/pod-overhead/)について学んでください。
