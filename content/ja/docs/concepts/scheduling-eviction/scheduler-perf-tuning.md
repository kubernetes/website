---
title: スケジューラーのパフォーマンスチューニング
content_type: concept
weight: 70
---

<!-- overview -->

{{< feature-state for_k8s_version="1.14" state="beta" >}}

[kube-scheduler](/ja/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)はKubernetesのデフォルトのスケジューラーです。クラスター内のノード上にPodを割り当てる責務があります。

クラスター内に存在するノードで、Podのスケジューリング要求を満たすものはPodに対して*割り当て可能*なノードと呼ばれます。スケジューラーはPodに対する割り当て可能なノードをみつけ、それらの割り当て可能なノードにスコアをつけます。その中から最も高いスコアのノードを選択し、Podに割り当てるためのいくつかの関数を実行します。スケジューラーは*Binding*と呼ばれる処理中において、APIサーバーに対して割り当てが決まったノードの情報を通知します。

このページでは、大規模のKubernetesクラスターにおけるパフォーマンス最適化のためのチューニングについて説明します。


<!-- body -->

大規模クラスターでは、レイテンシー(新規Podをすばやく配置)と精度(スケジューラーが不適切な配置を行うことはめったにありません)の間でスケジューリング結果を調整するスケジューラーの動作をチューニングできます。

このチューニング設定は、kube-scheduler設定の`percentageOfNodesToScore`で設定できます。KubeSchedulerConfiguration設定は、クラスター内のノードにスケジュールするための閾値を決定します。

### 閾値の設定

`percentageOfNodesToScore`オプションは、0から100までの数値を受け入れます。0は、kube-schedulerがコンパイル済みのデフォルトを使用することを示す特別な値です。
`percentageOfNodesToScore`に100より大きな値を設定した場合、kube-schedulerの挙動は100を設定した場合と同様となります。

この値を変更するためには、kube-schedulerの設定ファイル(これは`/etc/kubernetes/config/kube-scheduler.yaml`の可能性が高い)を編集し、スケジューラーを再起動します。

この変更をした後、

```bash
kubectl get pods -n kube-system | grep kube-scheduler
```

を実行して、kube-schedulerコンポーネントが正常であることを確認できます。

## ノードへのスコア付けの閾値 {#percentage-of-nodes-to-score}

スケジューリング性能を改善するため、kube-schedulerは割り当て可能なノードが十分に見つかるとノードの検索を停止できます。大規模クラスターでは、すべてのノードを考慮する単純なアプローチと比較して時間を節約できます。

クラスター内のすべてのノードに対する十分なノード数を整数パーセンテージで指定します。kube-schedulerは、これをノード数に変換します。スケジューリング中に、kube-schedulerが設定されたパーセンテージを超える十分な割り当て可能なノードを見つけた場合、kube-schedulerはこれ以上割り当て可能なノードを探すのを止め、[スコアリングフェーズ](/ja/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler-implementation)に進みます。

[スケジューラーはどのようにノードを探索するか](#how-the-scheduler-iterates-over-nodes)で処理を詳しく説明しています。

### デフォルトの閾値

閾値を指定しない場合、Kubernetesは100ノードのクラスターでは50%、5000ノードのクラスターでは10%になる線形方程式を使用して数値を計算します。自動計算の下限は5%です。

つまり、明示的に`percentageOfNodesToScore`を5未満の値を設定しない限り、クラスターの規模に関係なく、kube-schedulerは常に少なくともクラスターの5%のノードに対してスコア付けをします。

スケジューラーにクラスター内のすべてのノードに対してスコア付けをさせる場合は、`percentageOfNodesToScore`の値に100を設定します。

## 例

`percentageOfNodesToScore`の値を50%に設定する例は下記のとおりです。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

percentageOfNodesToScore: 50
```

## percentageOfNodesToScoreのチューニング

`percentageOfNodesToScore`は1から100の間の範囲である必要があり、デフォルト値はクラスターのサイズに基づいて計算されます。また、クラスターのサイズの最小値は100ノードとハードコードされています。

{{< note >}}
割り当て可能なノードが100以下のクラスターでは、スケジューラの検索を早期に停止するのに十分な割り当て可能なノードがないため、スケジューラはすべてのノードをチェックします。

小規模クラスターでは、`percentageOfNodesToScore`に低い値を設定したとしても、同様の理由で変更による影響は全くないか、ほとんどありません。

クラスターのノード数が数百以下の場合は、この設定オプションをデフォルト値のままにします。変更してもスケジューラの性能を大幅に改善する可能性はほとんどありません。
{{< /note >}}

この値を設定する際に考慮するべき重要な注意事項として、割り当て可能ノードのチェック対象のノードが少ないと、一部のノードはPodの割り当てのためにスコアリングされなくなります。結果として、高いスコアをつけられる可能性のあるノードがスコアリングフェーズに渡されることがありません。これにより、Podの配置が理想的なものでなくなります。

kube-schedulerが頻繁に不適切なPodの配置を行わないよう、`percentageOfNodesToScore`をかなり低い値を設定することは避けるべきです。スケジューラのスループットがアプリケーションにとって致命的で、ノードのスコアリングが重要でない場合を除いて、10%未満に設定することは避けてください。言いかえると、割り当て可能な限り、Podは任意のノード上で稼働させるのが好ましいです。

## スケジューラーはどのようにノードを探索するか {#how-the-scheduler-iterates-over-nodes}

このセクションでは、この機能の内部の詳細を理解したい人向けになります。

クラスター内の全てのノードに対して平等にPodの割り当ての可能性を持たせるため、スケジューラーはラウンドロビン方式でノードを探索します。複数のノードの配列になっているイメージです。スケジューラーはその配列の先頭から探索を開始し、`percentageOfNodesToScore`によって指定された数のノードを検出するまで、割り当て可能かどうかをチェックしていきます。次のPodでは、スケジューラーは前のPodの割り当て処理でチェックしたところから探索を再開します。

ノードが複数のゾーンに存在するとき、スケジューラーは様々なゾーンのノードを探索して、異なるゾーンのノードが割り当て可能かどうかのチェック対象になるようにします。例えば2つのゾーンに6つのノードがある場合を考えます。

```
Zone 1: Node 1, Node 2, Node 3, Node 4
Zone 2: Node 5, Node 6
```

スケジューラーは、下記の順番でノードの割り当て可能性を評価します。

```
Node 1, Node 5, Node 2, Node 6, Node 3, Node 4
```

全てのノードのチェックを終えたら、1番目のノードに戻ってチェックをします。


