---
title: スケジューラーの設定
content_type: concept
weight: 20
---

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

設定ファイルを作成し、そのパスをコマンドライン引数として渡すことで`kube-scheduler`の振る舞いをカスタマイズすることができます。


<!-- overview -->

<!-- body -->

スケジューリングプロファイルは、{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}でスケジューリングの異なるステージを設定することができます。
各ステージは、拡張点に公開されています。プラグインをそれらの拡張点に1つ以上実装することで、スケジューリングの振る舞いを変更できます。

KubeSchedulerConfiguration([`v1beta2`](/docs/reference/config-api/kube-scheduler-config.v1beta2/)か[`v1beta3`](/docs/reference/config-api/kube-scheduler-config.v1beta3/))構造体を使用して、`kube-scheduler --config <filename>`を実行することで、スケジューリングプロファイルを指定することができます。

最小限の設定は次の通りです。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
clientConnection:
  kubeconfig: /etc/srv/kubernetes/kube-scheduler/kubeconfig
```

## プロファイル

スケジューリングプロファイルは、{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}でスケジューリングの異なるステージを設定することができます。
各ステージは[拡張点](#extension-points)に公開されています。
[プラグイン](#scheduling-plugins)をそれらの拡張点に1つ以上実装することで、スケジューリングの振る舞いを変更できます。

単一の`kube-scheduler`インスタンスで[複数のプロファイル](#multiple-profiles)を実行するように設定することも可能です。

### 拡張点 {#extension-points}

スケジューリングは一連のステージで行われ、以下の拡張点に公開されています。

1. `queueSort`: これらのプラグインは、スケジューリングキューにある`pending`状態のPodをソートするための順序付け関数を提供します。同時に有効化できるプラグインは1つだけです。
1. `preFilter`: これらのプラグインは、フィルタリングをする前にPodやクラスターの情報のチェックや前処理のために使用されます。これらのプラグインは、設定された順序で呼び出されます。
1. `filter`: これらのプラグインは、スケジューリングポリシーにおけるPredicatesに相当するもので、Podの実行不可能なNodeをフィルターするために使用されます。もし全てのNodeがフィルターされてしまった場合、Podはunschedulableとしてマークされます。
1. `postFilter`:これらのプラグインは、Podの実行可能なNodeが見つからなかった場合、設定された順序で呼び出されます。もし`postFilter`プラグインのいずれかが、Podを __スケジュール可能__ とマークした場合、残りの`postFilter`プラグインは呼び出されません。
1. `preScore`: これは、スコアリング前の作業を行う際に使用できる情報提供のための拡張点です。
1. `score`: これらのプラグインはフィルタリングフェーズを通過してきたそれぞれのNodeに対してスコア付けを行います。その後スケジューラーは、最も高い重み付きスコアの合計を持つノードを選択します。
1. `reserve`: これは、指定されたPodのためにリソースが予約された際に、プラグインに通知する、情報提供のための拡張点です。また、プラグインは`Reserve`中に失敗した際、または`Reserve`の後に呼び出される`Unreserve`も実装しています。
1. `permit`: これらのプラグインではPodのバインディングを拒む、または遅延させることができます。
1. `preBind`: これらのプラグインは、Podがバインドされる前に必要な処理を実行できます。
1. `bind`: これらのプラグインはPodをNodeにバインドします。`bind`プラグインは順番に呼び出され、1つのプラグインがバインドを完了すると、残りのプラグインはスキップされます。`bind`プラグインは少なくとも1つは必要です。
1. `postBind`: これは、Podがバインドされた後に呼び出される情報提供のための拡張点です。
1. `multiPoint`: このフィールドは設定のみ可能で、プラグインが適用されるすべての拡張点に対して同時に有効化または無効化することができます。

次の例のように、それぞれの拡張点に対して、特定の[デフォルトプラグイン](#scheduling-plugins)を無効化、または自作のプラグインを有効化することができます。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
profiles:
  - plugins:
      score:
        disabled:
        - name: PodTopologySpread
        enabled:
        - name: MyCustomPluginA
          weight: 2
        - name: MyCustomPluginB
          weight: 1
```

`disabled`配列の`name`フィールドに`*`を使用することで、その拡張点の全てのデフォルトプラグインを無効化できます。また、必要に応じてプラグインの順序を入れ替える場合にも使用されます。

### Scheduling plugins {#scheduling-plugins}

以下のプラグインはデフォルトで有効化されており、1つ以上の拡張点に実装されています。

- `ImageLocality`:Podが実行するコンテナイメージを既に持っているNodeを優先します。
  拡張点:`score`
- `TaintToleration`:[TaintsとTolerations](/ja/docs/concepts/scheduling-eviction/taint-and-toleration/)を実行します。
  実装する拡張点:`filter`、`preScore`、`score`
- `NodeName`: PodのSpecのNode名が、現在のNodeと一致するかをチェックします。
  拡張点:`filter`
- `NodePorts`:要求されたPodのポートに対して、Nodeが空きポートを持っているかチェックします。
  拡張点:`preFilter`、`filter`
- `NodeAffinity`:[nodeselectors](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)と[Nodeアフィニティ](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)を実行します。
  拡張点:`filter`、`score`
- `PodTopologySpread`:[Podトポロジーの分散制約](/docs/concepts/workloads/pods/pod-topology-spread-constraints/)を実行します。
  拡張点:`preFilter`、`filter`、`preScore`、`score`
- `NodeUnschedulable`:`.spec.unschedulable`がtrueに設定されているNodeをフィルタリングします。
  拡張点:`filter`.
- `NodeResourcesFit`:Podが要求しているすべてのリソースがNodeにあるかをチェックします。スコアは3つのストラテジのうちの1つを使用します:`LeastAllocated`(デフォルト)、`MostAllocated`、 と`RequestedToCapacityRatio`
  拡張点:`preFilter`、`filter`、`score`
- `NodeResourcesBalancedAllocation`:Podがスケジュールされた場合に、よりバランスの取れたリソース使用量となるNodeを優先します。
  拡張点:`score`
- `VolumeBinding`:Nodeが、要求された{{< glossary_tooltip text="ボリューム" term_id="volume" >}}を持っている、もしくはバインドしているかチェックします。
  拡張点:`preFilter`、`filter`、`reserve`、`preBind`、`score`
  {{< note >}}
  `score`拡張点は、`VolumeCapacityPriority`機能が有効になっている時に有効化されます。
  要求されたボリュームに適合する最小のPVを優先的に使用します。
  {{< /note >}}
- `VolumeRestrictions`:Nodeにマウントされたボリュームが、ボリュームプロバイダ固有の制限を満たしているかを確認します。
  拡張点:`filter`
- `VolumeZone`:要求されたボリュームがゾーン要件を満たしているかどうかを確認します。
  拡張点:`filter`
- `NodeVolumeLimits`:NodeのCSIボリューム制限を満たすかどうかをチェックします。
  拡張点:`filter`
- `EBSLimits`:NodeのAWSのEBSボリューム制限を満たすかどうかをチェックします。
  拡張点:`filter`
- `GCEPDLimits`:NodeのGCP-PDボリューム制限を満たすかどうかをチェックします。
  拡張点:`filter`
- `AzureDiskLimits`:NodeのAzureディスクボリューム制限を満たすかどうかをチェックします。
  拡張点:`filter`
- `InterPodAffinity`:[Pod間のaffinityとanti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)を実行します。
  拡張点:`preFilter`、`filter`、`preScore`、`score`
- `PrioritySort`:デフォルトの優先順位に基づくソートを提供します。
  拡張点:`queueSort`.
- `DefaultBinder`:デフォルトのバインディングメカニズムを提供します。
  拡張点:`bind`
- `DefaultPreemption`:デフォルトのプリエンプションメカニズムを提供します。
  拡張点:`postFilter`

また、コンポーネント設定のAPIにより、以下のプラグインを有効にすることができます。
デフォルトでは有効になっていません。

- `SelectorSpread`:{{< glossary_tooltip text="サービス" term_id="service" >}}と{{< glossary_tooltip text="レプリカセット" term_id="replica-set" >}}、{{< glossary_tooltip text="ステートフルセット" term_id="statefulset" >}}、に属するPodのNode間の拡散を優先します。
  拡張点:`preScore`、`score`
- `CinderLimits`:Nodeが[`OpenStack Cinder`](https://docs.openstack.org/cinder/)ボリューム制限を満たせるかチェックします。
  拡張点:`filter`

### 複数のプロファイル {#multiple-profiles}

`kube-scheduler`は複数のプロファイルを実行するように設定することができます。
各プロファイルは関連するスケジューラー名を持ち、その[拡張点](#extension-points)に異なるプラグインを設定することが可能です。

以下のサンプル設定では、スケジューラーは2つのプロファイルで実行されます。1つはデフォルトプラグインで、もう1つはすべてのスコアリングプラグインを無効にしたものです。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
  - schedulerName: no-scoring-scheduler
    plugins:
      preScore:
        disabled:
        - name: '*'
      score:
        disabled:
        - name: '*'
```

特定のプロファイルに従ってスケジュールさせたいPodは、その`.spec.schedulerName`に、対応するスケジューラー名を含めることができます。

デフォルトでは、スケジューラー名`default-scheduler`としてプロファイルが生成されます。
このプロファイルは、上記のデフォルトプラグインを含みます。複数のプロファイルを宣言する場合は、それぞれユニークなスケジューラー名にする必要があります。

もしPodがスケジューラー名を指定しない場合、kube-apiserverは`default-scheduler`を設定します。
従って、これらのPodをスケジュールするために、このスケジューラー名を持つプロファイルが存在する必要があります。

{{< note >}}
Podのスケジューリングイベントには、ReportingControllerとして`.spec.schedulerName`が設定されています。
リーダー選出のイベントには、リスト先頭のプロファイルのスケジューラー名が使用されます。
{{< /note >}}

{{< note >}}
すべてのプロファイルは、`queueSort`拡張点で同じプラグインを使用し、同じ設定パラメーターを持つ必要があります (該当する場合)。これは、pending状態のPodキューがスケジューラーに1つしかないためです。
{{< /note >}}

### 複数の拡張点に適用されるプラグイン {#multipoint}

`kubescheduler.config.k8s.io/v1beta3`からは、プロファイル設定に`multiPoint`というフィールドが追加され、複数の拡張点でプラグインを簡単に有効・無効化できるようになりました。
`multiPoint`設定の目的は、カスタムプロファイルを使用する際に、ユーザーや管理者が必要とする設定を簡素化することです。

`MyPlugin`というプラグインがあり、`preScore`、`score`、`preFilter`、`filter`拡張点を実装しているとします。
すべての利用可能な拡張点で`MyPlugin`を有効化するためには、プロファイル設定は次のようにします。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: MyPlugin
```

これは以下のように、`MyPlugin`を手動ですべての拡張ポイントに対して有効にすることと同じです。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: non-multipoint-scheduler
    plugins:
      preScore:
        enabled:
        - name: MyPlugin
      score:
        enabled:
        - name: MyPlugin
      preFilter:
        enabled:
        - name: MyPlugin
      filter:
        enabled:
        - name: MyPlugin
```

`multiPoint`を使用する利点の一つは、将来的に`MyPlugin`が別の拡張点を実装した場合に、`multiPoint`設定が自動的に新しい拡張点に対しても有効化されることです。

特定の拡張点は、その拡張点の`disabled`フィールドを使用して、`MultiPoint`の展開から除外することができます。
これは、デフォルトのプラグインを無効にしたり、デフォルト以外のプラグインを無効にしたり、ワイルドカード(`'*'`)を使ってすべてのプラグインを無効にしたりする場合に有効です。
`Score`と`PreScore`を無効にするためには、次の例のようにします。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: non-multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: 'MyPlugin'
      preScore:
        disabled:
        - name: '*'
      score:
        disabled:
        - name: '*'
```

`v1beta3`では、`MultiPoint`を通じて、内部的に全ての[デフォルトプラグイン](#scheduling-plugins)が有効化されています。
しかしながら、デフォルト値(並び順やスコアの重みなど)を柔軟に設定し直せるように、個別の拡張点は用意されています。
例えば、2つのスコアプラグイン`DefaultScore1`と`DefaultScore2`に、重み1が設定されているとします。
その場合、次のように重さを変更し、並べ替えることができます。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      score:
        enabled:
        - name: 'DefaultScore2'
          weight: 5
```

この例では、`MultiPoint`はデフォルトプラグインであるため、明示的にプラグイン名を指定する必要はありません。
そして、`Score`に指定されているプラグインは`DefaultScore2`のみです。
これは、特定の拡張点を通じて設定されたプラグインは、常に`MultiPoint`プラグインよりも優先されるためです。つまり、この設定例では、結果的に2つのプラグインを両方指定することなく、並び替えが行えます。

`MultiPoint`プラグインを設定する際の一般的な優先順位は、以下の通りです。
1. 特定の拡張点が最初に実行され、その設定は他の場所で設定されたものよりも優先される
2. `MultiPoint`を使用して、手動で設定したプラグインとその設定内容
3. デフォルトプラグインとそのデフォルト設定

上記の優先順位を示すために、次の例はこれらのプラグインをベースにします。

|プラグイン|拡張点|
|---|---|
|`DefaultQueueSort`|`QueueSort`|
|`CustomQueueSort`|`QueueSort`|
|`DefaultPlugin1`|`Score`, `Filter`|
|`DefaultPlugin2`|`Score`|
|`CustomPlugin1`|`Score`, `Filter`|
|`CustomPlugin2`|`Score`, `Filter`|

これらのプラグインの有効な設定例は次の通りです。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
        - name: 'CustomQueueSort'
        - name: 'CustomPlugin1'
          weight: 3
        - name: 'CustomPlugin2'
        disabled:
        - name: 'DefaultQueueSort'
      filter:
        disabled:
        - name: 'DefaultPlugin1'
      score:
        enabled:
        - name: 'DefaultPlugin2'
```

なお、特定の拡張点に`MultiPoint`プラグインを再宣言しても、エラーにはなりません。
特定の拡張点が優先されるため、再宣言は無視されます(ログは記録されます)。


このサンプルは、ほとんどのコンフィグを一箇所にまとめるだけでなく、いくつかの工夫をしています。
* カスタムの`queueSort`プラグインを有効にし、デフォルトのプラグインを無効にする。
* `CustomPlugin1`と`CustomPlugin2`を有効にし、この拡張点のプラグイン内で、最初に実行されるようにする。
* `filter`拡張点でのみ、`DefaultPlugin1`を無効にする。
* `score`拡張点で`DefaultPlugin2`が最初に実行されるように並べ替える(カスタムプラグインより先に)。

`v1beta3`以前のバージョンで、`multiPoint`がない場合、上記の設定例は、次のものと同等になります。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:

      # デフォルトQueueSortプラグインを無効化
      queueSort:
        enabled:
        - name: 'CustomQueueSort'
        disabled:
        - name: 'DefaultQueueSort'

      # カスタムFilterプラグインを有効化
      filter:
        enabled:
        - name: 'CustomPlugin1'
        - name: 'CustomPlugin2'
        - name: 'DefaultPlugin2'
        disabled:
        - name: 'DefaultPlugin1'

      # カスタムScoreプラグインを有効化し、実行順を並べ替える
      score:
        enabled:
        - name: 'DefaultPlugin2'
          weight: 1
        - name: 'DefaultPlugin1'
          weight: 3
```

これは複雑な例ですが、`MultiPoint`設定の柔軟性と、拡張点を設定する既存の方法とのシームレスな統合を実証しています。

## スケジューラー設定の移行

{{< tabs name="tab_with_md" >}}
{{% tab name="v1beta1 → v1beta2" %}}
* v1beta2`のバージョン`の設定では、新しい`NodeResourcesFit`プラグインをスコア拡張点で使用できます。
  この新しい拡張機能は、`NodeResourcesLeastAllocated`、`NodeResourcesMostAllocated`、 `RequestedToCapacityRatio`プラグインの機能を組み合わせたものです。
  例えば、以前は`NodeResourcesMostAllocated`プラグインを使っていたなら、代わりに`NodeResourcesFitプラグインを使用し(デフォルトで有効)、`pluginConfig`に次のような`scoreStrategy`を追加することになるでしょう。

  ```yaml
  apiVersion: kubescheduler.config.k8s.io/v1beta2
  kind: KubeSchedulerConfiguration
  profiles:
  - pluginConfig:
    - args:
        scoringStrategy:
          resources:
          - name: cpu
            weight: 1
          type: MostAllocated
      name: NodeResourcesFit
  ```

* スケジューラープラグインの`NodeLabel`は廃止されました。代わりに[`NodeAffinity`](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)プラグイン(デフォルトで有効)を使用することで同様の振る舞いを実現できます。

* スケジューラープラグインの`ServiceAffinity`は廃止されました。代わりに[`InterPodAffinity`](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)プラグイン(デフォルトで有効)を使用することで同様の振る舞いを実現できます。

* スケジューラープラグインの`NodePreferAvoidPods`は廃止されました。代わりに[Node taints](/ja/docs/concepts/scheduling-eviction/taint-and-toleration/)を使用することで同様の振る舞いを実現できます。

* v1beta2で有効化されたプラグインは、そのプラグインのデフォルトの設定より優先されます。

* スケジューラーのヘルスとメトリクスのバインドアドレスに設定されている`host`や`port`が無効な場合、バリデーションに失敗します。
{{% /tab %}}

{{% tab name="v1beta2 → v1beta3" %}}
* デフォルトで3つのプラグインの重みが増加しました。
  * `InterPodAffinity`:1から2
  * `NodeAffinity`:1から2
  * `TaintToleration`:1から3
{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [kube-schedulerリファレンス](/docs/reference/command-line-tools-reference/kube-scheduler/)を読む
* [scheduling](/ja/docs/concepts/scheduling-eviction/kube-scheduler/)について学ぶ
* [kube-scheduler設定(v1beta2)](/docs/reference/config-api/kube-scheduler-config.v1beta2/)のリファレンスを読む
* [kube-scheduler設定(v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/)のリファレンスを読む
