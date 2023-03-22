---
title: スケジューリングフレームワーク
content_type: concept
weight: 60
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

スケジューリングフレームワークはKubernetesのスケジューラーに対してプラグイン可能なアーキテクチャです。
このアーキテクチャは、既存のスケジューラーに新たに「プラグイン」としてAPI群を追加するもので、プラグインはスケジューラー内部にコンパイルされます。このAPI群により、スケジューリングの「コア」の軽量かつ保守しやすい状態に保ちながら、ほとんどのスケジューリングの機能をプラグインとして実装することができます。このフレームワークの設計に関する技術的な情報についてはこちらの[スケジューリングフレームワークの設計提案][kep]をご覧ください。

[kep]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/624-scheduling-framework/README.md


<!-- body -->

# フレームワークのワークフロー

スケジューリングフレームワークは、いくつかの拡張点を定義しています。スケジューラープラグインは、1つ以上の拡張点で呼び出されるように登録します。これらのプラグインの中には、スケジューリングの決定を変更できるものから、単に情報提供のみを行うだけのものなどがあります。

この1つのPodをスケジュールしようとする各動作は**Scheduling Cycle**と**Binding Cycle**の2つのフェーズに分けられます。

## Scheduling Cycle & Binding Cycle

Scheduling CycleではPodが稼働するNodeを決定し、Binding Cycleではそれをクラスターに適用します。この2つのサイクルを合わせて「スケジューリングコンテキスト」と呼びます。

Scheduling CycleではPodに対して1つ1つが順番に実行され、Binding Cyclesでは並列に実行されます。

Podがスケジューリング不能と判断された場合や、内部エラーが発生した場合、Scheduling CycleまたはBinding Cycleを中断することができます。その際、Podはキューに戻され再試行されます。

## 拡張点

次の図はPodに対するスケジューリングコンテキストとスケジューリングフレームワークが公開する拡張点を示しています。この図では「Filter」がフィルタリングのための「Predicate」、「Scoring」がスコアリングのための「Priorities」機能に相当します。

1つのプラグインを複数の拡張点に登録することで、より複雑なタスクやステートフルなタスクを実行することができます。

{{< figure src="/images/docs/scheduling-framework-extensions.png" title="scheduling framework extension points" class="diagram-large">}}

### QueueSort {#queue-sort}

これらのプラグインはスケジューリングキュー内のPodをソートするために使用されます。このプラグインは、基本的に`Less(Pod1, Pod2)`という関数を提供します。また、このプラグインは、1つだけ有効化できます。

### PreFilter {#pre-filter}

これらのプラグインは、Podに関する情報を前処理したり、クラスターやPodが満たすべき特定の条件をチェックするために使用されます。もし、PreFilterプラグインのいずれかがエラーを返した場合、Scheduling Cycleは中断されます。

### Filter

FilterプラグインはPodを実行できないNodeを候補から除外します。各Nodeに対して、スケジューラーは設定された順番でFilterプラグインを呼び出します。もし、いずれかのFilterプラグインが途中でそのNodeを実行不可能とした場合、残りのプラグインではそのNodeは呼び出されません。Nodeは同時に評価されることがあります。

### PostFilter {#post-filter}

これらのプラグインはFilterフェーズで、Podに対して実行可能なNodeが見つからなかった場合にのみ呼び出されます。このプラグインは設定された順番で呼び出されます。もしいずれかのPostFilterプラグインが、あるNodeを「スケジュール可能(Schedulable)」と目星をつけた場合、残りのプラグインは呼び出されません。典型的なPostFilterの実装はプリエンプション方式で、他のPodを先取りして、Podをスケジューリングできるようにしようとします。

### PreScore {#pre-score}

これらのプラグインは、Scoreプラグインが使用する共有可能な状態を生成する「スコアリングの事前」作業を行うために使用されます。このプラグインがエラーを返した場合、Scheduling Cycleは中断されます。

### Score {#scoring}

これらのプラグインはフィルタリングのフェーズを通過したNodeをランク付けするために使用されます。スケジューラーはそれぞれのNodeに対して、それぞれのscoringプラグインを呼び出します。スコアの最小値と最大値の範囲が明確に定義されます。[NormalizeScore](#normalize-scoring)フェーズの後、スケジューラーは設定されたプラグインの重みに従って、全てのプラグインからNodeのスコアを足し合わせます。

### NormalizeScore {#normalize-scoring}

これらのプラグインはスケジューラーが最終的なNodeの順位を計算する前にスコアを修正するために使用されます。この拡張点に登録されたプラグインは、同じプラグインの[Score](#scoring)の結果を使用して呼び出されます。各プラグインはScheduling Cycle毎に、1回呼び出されます。


例えば、`BlinkingLightScorer`というプラグインが、点滅する光の数に基づいてランク付けをするとします。

```go
func ScoreNode(_ *v1.pod, n *v1.Node) (int, error) {
    return getBlinkingLightCount(n)
}
```

ただし、`NodeScoreMax`に比べ、点滅をカウントした最大値の方が小さい場合があります。これを解決するために、`BlinkingLightScorer`も拡張点に登録する必要があります。

```go
func NormalizeScores(scores map[string]int) {
    highest := 0
    for _, score := range scores {
        highest = max(highest, score)
    }
    for node, score := range scores {
        scores[node] = score*NodeScoreMax/highest
    }
}
```

NormalizeScoreプラグインが途中でエラーを返した場合、Scheduling Cycleは中断されます。

{{< note >}}
「Reserveの事前」作業を行いたいプラグインは、NormalizeScore拡張点を使用してください。
{{< /note >}}

### Reserve {#reserve}

Reserve拡張を実装したプラグインには、ReserveとUnreserve　という2つのメソッドがあり、それぞれ`Reserve`
と`Unreserve`と呼ばれる2つの情報スケジューリングフェーズを返します。
実行状態を保持するプラグイン（別名「ステートフルプラグイン」）は、これらのフェーズを使用して、Podに対してNodeのリソースが予約されたり予約解除された場合に、スケジューラーから通知を受け取ります。

Reserveフェーズは、スケジューラーが実際にPodを指定されたNodeにバインドする前に発生します。このフェーズはスケジューラーがバインドが成功するのを待つ間にレースコンディションの発生を防ぐためにあります。
各Reserveプラグインの`Reserve`メソッドは成功することも失敗することもあります。もしどこかの`Reserve`メソッドの呼び出しが失敗すると、後続のプラグインは実行されず、Reserveフェーズは失敗したものとみなされます。全てのプラグインの`Reserve`メソッドが成功した場合、Reserveフェーズは成功とみなされ、残りのScheduling CycleとBinding Cycleが実行されます。

Unreserveフェーズは、Reserveフェーズまたは後続のフェーズが失敗した場合に、呼び出されます。この時、**全ての**Reserveプラグインの`Unreserve`メソッドが、`Reserve`メソッドの呼び出された逆の順序で実行されます。このフェーズは予約されたPodに関連する状態をクリーンアップするためにあります。

{{< caution >}}
`Unreserve`メソッドの実装は冪等性を持つべきであり、この処理で問題があった場合に失敗させてはなりません。
{{< /caution >}}

<!-- ### Permit -->
### Permit

_Permit_ プラグインは、各PodのScheduling Cycleの終了時に呼び出され、候補Nodeへのバインドを阻止もしくは遅延させるために使用されます。permitプラグインは次の3つのうちどれかを実行できます。

1.  **承認(approve)** \
    全てのPermitプラグインから承認(approve)されたPodは、バインド処理へ送られます。

1.  **拒否(deny)** \
    もしどれか1つのPermitプラグインがPodを拒否(deny)した場合、そのPodはスケジューリングキューに戻されます。
    これは[Reserveプラグイン](#reserve)内のUnreserveフェーズで呼び出されます。

1.  **待機(wait)** (タイムアウトあり) \
    もしPermitプラグインが「待機(wait)」を返した場合、そのPodは内部の「待機中」Podリストに保持され、このPodに対するBinding Cycleは開始されるものの、承認(approve)されるまで直接ブロックされます。もしタイムアウトが発生した場合、この**待機(wait)**は**deny**へ変わり、対象のPodはスケジューリングキューに戻されると共に、[Reserveプラグイン](#reserve)のUnreserveフェーズが呼び出されます。

{{< note >}}
どのプラグインも「待機中」Podリストにアクセスして、それらを承認(approve)することができますが(参考:[`FrameworkHandle`](https://git.k8s.io/enhancements/keps/sig-scheduling/624-scheduling-framework#frameworkhandle))、その中の予約済みPodのバインドを承認(approve)できるのはPermitプラグインだけであると予想します。承認(approve)されたPodは、[PreBind](#pre-bind)フェーズへ送られます。
{{< /note >}}

### PreBind {#pre-bind}

これらのプラグインは、Podがバインドされる前に必要な作業を行うために使用されます。例えば、Podの実行を許可する前に、ネットワークボリュームをプロビジョニングし、Podを実行予定のNodeにマウントすることができます。

もし、いずれかのPreBindプラグインがエラーを返した場合、Podは[拒否](#reserve)され、スケジューリングキューに戻されます。

### Bind

これらのプラグインはPodをNodeにバインドするために使用されます。このプラグインは全てのPreBindプラグインの処理が完了するまで呼ばれません。それぞれのBindプラグインは設定された順序で呼び出されます。このプラグインは、与えられたPodを処理するかどうかを選択することができます。もしPodを処理することを選択した場合、**残りのBindプラグインは全てスキップされます。**

### PostBind {#post-bind}

これは単に情報提供のための拡張点です。Post-bindプラグインはPodのバインドが成功した後に呼び出されます。これはBinding Cycleの最後であり、関連するリソースのクリーンアップに使用されます。

## プラグインAPI

プラグインAPIには2つの段階があります。まず、プラグインを登録し設定することです。そして、拡張点インターフェースを使用することです。このインターフェースは次のような形式をとります。

```go
type Plugin interface {
    Name() string
}

type QueueSortPlugin interface {
    Plugin
    Less(*v1.pod, *v1.pod) bool
}

type PreFilterPlugin interface {
    Plugin
    PreFilter(context.Context, *framework.CycleState, *v1.pod) error
}

// ...
```

## プラグインの設定

スケジューラーの設定でプラグインを有効化・無効化することができます。Kubernetes v1.18以降を使用しているなら、ほとんどのスケジューリング[プラグイン](/docs/reference/scheduling/config/#scheduling-plugins)は使用されており、デフォルトで有効になっています。

デフォルトのプラグインに加えて、独自のスケジューリングプラグインを実装し、デフォルトのプラグインと一緒に使用することも可能です。詳しくは[スケジューラープラグイン](https://github.com/kubernetes-sigs/scheduler-plugins)をご覧下さい。

Kubernetes v1.18以降を使用しているなら、プラグインのセットをスケジューラープロファイルとして設定し、様々な種類のワークロードに適合するように複数のプロファイルを定義することが可能です。詳しくは[複数のプロファイル](/docs/reference/scheduling/config/#multiple-profiles)をご覧下さい。
