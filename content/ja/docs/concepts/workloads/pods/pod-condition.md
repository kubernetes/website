---
title: "Pod Condition"
content_type: concept
weight: 35
---

Kubernetesでは、多くのオブジェクトに _Condition_ があります。
Conditionは、オブジェクトが表す対象の実際の状態における、ある側面を示すマーカーです。
PodにもConditionがあり、KubernetesのPodのConditionは、コントローラー(やトラブルシューティングを行う人)がPodの健全性を理解するための重要な要素です。

Podの[フェーズ](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)は、Podがライフサイクル上のどこに位置するかを大まかにまとめたものですが、単一の値ですべてを表現することはできません。
例えば、Podが`Running`フェーズにあっても、まだトラフィックを処理する準備が整っていない場合があります。
PodのConditionは、Podがスケジュールされたかどうか、コンテナが準備完了かどうか、リサイズが進行中かどうか、{{< glossary_tooltip text="taint" term_id="taint" >}}によってPodが中断されようとしているかなど、Podの状態の複数の側面を独立して追跡することでフェーズを補完します。

## Pod Conditionの構造 {#structure-of-a-pod-condition}

Podのステータスには、Podが特定のチェックポイントを通過したかどうかを示す[PodCondition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)の配列が含まれています。

PodCondition配列の各要素には、以下のフィールドがあります:

{{< table caption="PodConditionのフィールド" >}}
| フィールド名         | 説明                                                                                          |
|:---------------------|:-----------------------------------------------------------------------------------------------------|
| `type`               | このPodのConditionの名前です。                                                                          |
| `status`             | このConditionが適用可能かどうかを示します。可能な値は`"True"`、`"False"`、`"Unknown"`のいずれかです。 |
| `lastProbeTime`      | Pod Conditionが最後に確認されたときのタイムスタンプです。                                                 |
| `lastTransitionTime` | Podのステータスが、あるステータスから別のステータスへ最後に遷移したときのタイムスタンプです。                           |
| `reason`             | Conditionの最後の遷移理由を示す、機械可読のアッパーキャメルケースのテキストです。     |
| `message`            | 最後のステータス遷移に関する詳細を示す人間向けのメッセージです。                          |
| `observedGeneration` | Conditionが記録された時点のPodの`.metadata.generation`です。[Pod generation](/docs/concepts/workloads/pods/#pod-generation)を参照してください。 |
{{< /table >}}

## ビルトインのPod Condition {#built-in-pod-conditions}

Kubernetesは以下のPod Conditionを管理します:

[ライフサイクル上のCondition](#lifecycle-pod-conditions): Podがライフサイクルを進む過程で、おおよそ`PodScheduled`、`PodReadyToStartContainers`、`Initialized`、`ContainersReady`、`Ready`の順に設定されます。

[その他のCondition](#other-pod-conditions): 特定の操作やイベントに応じて、`DisruptionTarget`、`PodResizePending`、`PodResizeInProgress`が設定されます。

上記のビルトインのConditionに加えて、[PodのReadinessゲート](#enhanced-pod-readiness)を使用してカスタムのConditionを定義することもできます。

## ライフサイクル上のPod Condition {#lifecycle-pod-conditions}

Podがライフサイクルを進むにつれて、kubeletは以下のConditionをおおよそ次の順序で設定します:

1. `PodScheduled`: Podがノードにスケジュールされたことを示します。
1. `PodReadyToStartContainers`: Podのサンドボックスが正常に作成され、ネットワークが構成されたことを示します。
   サンドボックスとネットワークは、{{< glossary_tooltip text="コンテナランタイム" term_id="container-runtime" >}}と{{< glossary_tooltip text="CNI" term_id="cni" >}}プラグインによってセットアップされます。
1. `Initialized`: すべての[Initコンテナ](/docs/concepts/workloads/pods/init-containers/)が正常に完了したことを示します。
   Initコンテナを持たないPodでは、サンドボックスの作成前に`True`に設定されます。
1. `ContainersReady`: Pod内のすべてのコンテナが準備完了であることを示します。
   コンテナのReadinessは、設定されている場合は[Readiness Probe](/docs/concepts/configuration/liveness-readiness-startup-probes/)によって判定されます。
1. `Ready`: Podがリクエストを処理でき、一致するすべての[Service](/docs/concepts/services-networking/service/)の負荷分散プールに追加されるべきであることを示します。
   `Ready`でないPodはServiceのエンドポイントから削除されます。

{{< note >}}
`Ready` Conditionは`ContainersReady`だけに依存しているわけではありません。
Podが`readinessGates`を指定している場合、Podが`Ready`になるためには、それらのカスタムConditionもすべて`True`である必要があります。
詳細は[PodのReadiness](#enhanced-pod-readiness)を参照してください。
{{< /note >}}

kubectlを使用してPodのConditionを確認できます:

```shell
kubectl get pod <pod-name> -o yaml
```

実行中のPodの`status.conditions`は次のようになります:

```yaml
status:
  conditions:
    - type: PodScheduled
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-03-29T08:52:21Z"
      observedGeneration: 1
    - type: PodReadyToStartContainers
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:16Z"
      observedGeneration: 1
    - type: Initialized
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-03-29T08:52:21Z"
      observedGeneration: 1
    - type: ContainersReady
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:45Z"
      observedGeneration: 1
    - type: Ready
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:45Z"
      observedGeneration: 1
```

### PodReadyToStartContainers {#pod-ready-to-start-containers}

{{< feature-state feature_gate_name="PodReadyToStartContainersCondition" >}}

{{< note >}}
このConditionは、開発初期には`PodHasNetwork`という名前でした。
{{< /note >}}

Podがノードにスケジュールされた後、kubeletに受け入れられ、必要なストレージボリュームがマウントされる必要があります。
これらのフェーズが完了すると、kubeletは({{< glossary_tooltip text="コンテナランタイムインターフェース(CRI)" term_id="cri" >}}を使用して)コンテナランタイムと連携し、ランタイムサンドボックスをセットアップしてPodのネットワークを構成します。
`PodReadyToStartContainersCondition`フィーチャーゲートが有効な場合(Kubernetes {{< skew currentVersion >}}ではデフォルトで有効)、`PodReadyToStartContainers` ConditionがPodの`status.conditions`フィールドに追加されます。

`PodReadyToStartContainers` Conditionは、Podにネットワーク構成済みのランタイムサンドボックスがないことをkubeletが検出すると、`False`に設定されます。
これは以下のシナリオで発生します:

- Podのライフサイクルの初期で、kubeletがコンテナランタイムを使用してPodのサンドボックスのセットアップをまだ開始していないとき。
- Podのライフサイクルの後期で、Podのサンドボックスが以下のいずれかの原因で破棄されたとき:
  - Podが退避させられずに、ノードが再起動した。
  - 隔離に仮想マシンを使用するコンテナランタイムにおいて、Podサンドボックスの仮想マシンが再起動し、新しいサンドボックスと新しいコンテナネットワーク設定の作成が必要になった。

ランタイムプラグインによるPodのサンドボックスの作成とネットワーク構成が正常に完了すると、kubeletは`PodReadyToStartContainers` Conditionを`True`に設定します。
`PodReadyToStartContainers` Conditionが`True`に設定された後、kubeletはコンテナイメージの取得とコンテナの作成を開始できます。

Initコンテナを持つPodでは、kubeletはInitコンテナが正常に完了した後(これはランタイムプラグインによるサンドボックスの作成とネットワーク構成が成功した後に発生します)、`Initialized` Conditionを`True`に設定します。
Initコンテナを持たないPodでは、kubeletはサンドボックスの作成とネットワーク構成が開始する前に、`Initialized` Conditionを`True`に設定します。

## その他のPod Condition {#other-pod-conditions}

以下のConditionは、通常のPodのライフサイクルの進行には含まれません。
これらは特定の操作やイベントに応じて設定されます。

### DisruptionTarget {#disruption-target}

{{<glossary_tooltip term_id="disruption" text="Disruption">}}によりPodが削除されようとしていることを示すために、専用のPod `DisruptionTarget` Conditionが追加されます。
このConditionの`reason`フィールドは、Podの終了理由として以下のいずれかを示します:

`PreemptionByScheduler`
: より高い優先度を持つ新しいPodを受け入れるために、スケジューラーによってPodが{{<glossary_tooltip term_id="preemption" text="プリエンプト">}}されようとしています。
  詳細は[Podの優先度とプリエンプション](/docs/concepts/scheduling-eviction/pod-priority-preemption/)を参照してください。

`DeletionByTaintManager`
: Podが許容しない`NoExecute`のtaintにより、Taint Manager(`kube-controller-manager`内のノードライフサイクルコントローラーの一部)によってPodが削除されようとしています。
  {{<glossary_tooltip term_id="taint" text="taint">}}ベースの退避を参照してください。

`EvictionByEvictionAPI`
: Podが{{<glossary_tooltip term_id="api-eviction" text="Kubernetes APIを使用した退避">}}の対象としてマークされました。

`DeletionByPodGC`
: 既に存在しないノードにバインドされているPodが、[Podのガベージコレクション](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)によって削除されようとしています。

`TerminationByKubelet`
: {{<glossary_tooltip term_id="node-pressure-eviction" text="ノードの圧迫による退避">}}、[ノードのグレースフルシャットダウン](/docs/concepts/architecture/nodes/#graceful-node-shutdown)、または[システムにとってクリティカルなPod](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)のためのプリエンプションのいずれかにより、Podがkubeletによって終了されました。

[Podのコンテナの制限](/docs/concepts/configuration/manage-resources-containers/)を超過したことによる退避のようなその他すべてのDisruptionシナリオでは、Disruptionの原因がPod自体にある可能性が高く、リトライしても再発するため、Podは`DisruptionTarget` Conditionを受け取りません。

{{< note >}}
PodのDisruptionは中断される可能性があります。
コントロールプレーンは、同じPodのDisruptionを継続しようと再試行する場合がありますが、保証はされていません。
その結果、`DisruptionTarget` ConditionがPodに追加されても、そのPodが実際には削除されないことがあります。
このような場合、しばらくすると、PodのDisruptionのConditionはクリアされます。
{{< /note >}}

Podのガベージコレクター(PodGC)は、Podをクリーンアップするとともに、Podが非終了フェーズにある場合はそれらをfailedとしてマークします([Podのガベージコレクション](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)も参照してください)。

Job(またはCronJob)を使用する場合、これらのPodのDisruptionのConditionを、Jobの[Pod失敗ポリシー](/docs/concepts/workloads/controllers/job#pod-failure-policy)の一部として活用したい場合があります。

詳細については、[Disruption](/docs/concepts/workloads/pods/disruptions/)を参照してください。

### PodResizePendingとPodResizeInProgress {#pod-resize-conditions}

kubeletは、リサイズリクエストの状態を示すために、PodのステータスのConditionを更新します:

- `type: PodResizePending`: kubeletはリクエストをすぐには許可できません。
  `message`フィールドにその理由が記載されます。
  - `reason: Infeasible`: 要求されたリサイズは現在のノード上では実行不可能です(例えば、ノードが持つリソースより多くを要求した場合)。
  - `reason: Deferred`: 要求されたリサイズは現時点では不可能ですが、後で実現可能になる可能性があります(例えば、他のPodが削除された場合)。
    kubeletはリサイズを再試行します。
- `type: PodResizeInProgress`: kubeletはリサイズを受け入れてリソースを割り当てましたが、変更はまだ適用中です。
  通常は短時間で完了しますが、リソースの種類やランタイムの挙動によってはさらに時間がかかる場合があります。
  実行中に発生したエラーは、`message`フィールドに(`reason: Error`とともに)報告されます。

要求されたリサイズが _Deferred_ となった場合、kubeletは、例えば他のPodが削除されたりスケールダウンされたりしたときなどに、定期的にリサイズを再試行します。

Podのリサイズの詳細については、[コンテナに割り当てられたCPUおよびメモリリソースのリサイズ](/docs/tasks/configure-pod-container/resize-container-resources/)を参照してください。

## Enhanced Pod readiness {#enhanced-pod-readiness}

アプリケーションは、Podの`.status`に追加のフィードバックやシグナルを注入できます。
これは _Enhanced Pod readiness_ と呼ばれます。
これを使用するには、Podの`spec`で`readinessGates`を設定し、kubeletがPodのReadinessを評価する際に確認する追加のConditionのリストを指定します。
そして、これらのカスタムConditionを管理するコントローラーを実装またはインストールすると、kubeletはそれをPodがreadyかどうかを判断するための追加情報として使用します。

ReadinessゲートはPodの`status.condition`フィールドの現在の状態によって決まります。
Kubernetesが`status.conditions`フィールド内に該当するConditionを見つけられない場合、そのConditionのステータスはデフォルトで"`False`"になります。

```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready                              # ビルトインのPodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"        # 追加のPodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

追加するPodのConditionの名前は、Kubernetesの[ラベルキーのフォーマット](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)に準拠している必要があります。

### Pod Readinessのためのステータス {#status-for-pod-readiness}

Podにこれらの`status.conditions`を設定するには、アプリケーションや{{< glossary_tooltip term_id="operator-pattern" text="オペレーター">}}は、Podのステータスサブリソースに対して`PATCH`アクションを使用する必要があります。
`kubectl patch`を`--subresource=status`とともに使用するか、[Kubernetesのクライアントライブラリ](/docs/reference/using-api/client-libraries/)を使用して、PodのReadinessのためにカスタムのPodのConditionを設定するコードを記述できます。

カスタムConditionを使用するPodは、以下の両方が当てはまる場合**のみ**readyと評価されます。

- Pod内のすべてのコンテナがreadyである。
- `readinessGates`に指定されたすべてのConditionが`True`である。

PodのコンテナがReadyでも、カスタムConditionの少なくとも1つが欠落しているか`False`の場合、kubeletはPodの`Ready` Conditionを`reason: ReadinessGatesNotReady`とともに`status: "False"`に設定します。

## {{% heading "whatsnext" %}}

- [Podのライフサイクル](/docs/concepts/workloads/pods/pod-lifecycle/)について学ぶ。
- [Disruption](/docs/concepts/workloads/pods/disruptions/)について学ぶ。
- [コンテナのProbe](/docs/concepts/configuration/liveness-readiness-startup-probes/)と、それらがPodのReadinessにどう影響するかについて学ぶ。
- [Podのリソースをインプレースでリサイズする](/docs/tasks/configure-pod-container/resize-container-resources/)方法を学ぶ。
