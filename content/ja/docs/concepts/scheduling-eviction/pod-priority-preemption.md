---
title: Podの優先度とプリエンプション
content_type: concept
weight: 90
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

[Pod](/ja/docs/concepts/workloads/pods/)は _priority_（優先度）を持つことができます。
優先度は他の Pod に対する相対的な Pod の重要度を示します。
もし Pod をスケジューリングできないときには、スケジューラーはその Pod をスケジューリングできるようにするため、優先度の低い Pod をプリエンプトする（追い出す）ことを試みます。

<!-- body -->

{{< warning >}}
クラスターの全てのユーザーが信用されていない場合、悪意のあるユーザーが可能な範囲で最も高い優先度の Pod を作成することが可能です。これは他の Pod が追い出されたりスケジューリングできない状態を招きます。
管理者は ResourceQuota を使用して、ユーザーが Pod を高い優先度で作成することを防ぐことができます。

詳細は[デフォルトで優先度クラスの消費を制限する](/ja/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default)
を参照してください。
{{< /warning >}}

## 優先度とプリエンプションを使う方法

優先度とプリエンプションを使うには、

1.  1 つまたは複数の[PriorityClass](#priorityclass)を追加します

1.  追加した PriorityClass を[`priorityClassName`](#pod-priority)に設定した Pod を作成します。
    もちろん Pod を直接作る必要はありません。
    一般的には`priorityClassName`を Deployment のようなコレクションオブジェクトの Pod テンプレートに追加します。

これらの手順のより詳しい情報については、この先を読み進めてください。

{{< note >}}
Kubernetes には最初から既に 2 つの PriorityClass が設定された状態になっています。
`system-cluster-critical`と`system-node-critical`です。
これらは汎用のクラスであり、[重要なコンポーネントが常に最初にスケジュールされることを保証する](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)ために使われます。
{{< /note >}}

## PriorityClass

PriorityClass は namespace によらないオブジェクトで、優先度クラスの名称から優先度を表す整数値への対応を定義します。
PriorityClass オブジェクトのメタデータの`name`フィールドにて名称を指定します。
値は`value`フィールドで指定し、必須です。
値が大きいほど、高い優先度を示します。
PriorityClass オブジェクトの名称は[DNS サブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)として適切であり、かつ`system-`から始まってはいけません。

PriorityClass オブジェクトは 10 億以下の任意の 32 ビットの整数値を持つことができます。PriorityClass（優先度クラス）オブジェクトの値の範囲は、-2147483648 から 1000000000。
それよりも大きな値は通常はプリエンプトや追い出すべきではない重要なシステム用の Pod のために予約されています。
クラスターの管理者は割り当てたい優先度に対して、PriorityClass オブジェクトを 1 つずつ作成すべきです。

PriorityClass は任意でフィールド`globalDefault`と`description`を設定可能です。
`globalDefault`フィールドは`priorityClassName`が指定されない Pod はこの PriorityClass を使うべきであることを示します。`globalDefault`が true に設定された PriorityClass はシステムで一つのみ存在可能です。`globalDefault`が設定された PriorityClass が存在しない場合は、`priorityClassName`が設定されていない Pod の優先度は 0 に設定されます。

`description`フィールドは任意の文字列です。クラスターの利用者に対して、PriorityClass をどのような時に使うべきか示すことを意図しています。

### PodPriority と既存のクラスターに関する注意

- もし既存のクラスターをこの機能がない状態でアップグレードすると、既存の Pod の優先度は実質的に 0 になります。

- `globalDefault`が`true`に設定された PriorityClass を追加しても、既存の Pod の優先度は変わりません。PriorityClass のそのような値は、PriorityClass が追加された以後に作成された Pod のみに適用されます。

- PriorityClass を削除した場合、削除された PriorityClass の名前を使用する既存の Pod は変更されませんが、削除された PriorityClass の名前を使う Pod をそれ以上作成することはできなくなります。

### PriorityClass の例

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "この優先度クラスはXYZサービスのPodに対してのみ使用すべきです。"
```

## 非プリエンプトの PriorityClass {#non-preempting-priority-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

`preemptionPolicy: Never`と設定された Pod は、スケジューリングのキューにおいて他の優先度の低い Pod よりも優先されますが、他の Pod をプリエンプトすることはありません。
スケジューリングされるのを待つ非プリエンプトの Pod は、リソースが十分に利用可能になるまでスケジューリングキューに残ります。
非プリエンプトの Pod は、他の Pod と同様に、スケジューラーのバックオフの対象になります。これは、スケジューラーが Pod をスケジューリングしようと試みたものの失敗した場合、低い頻度で再試行するようにして、より優先度の低い Pod が先にスケジューリングされることを許します。

非プリエンプトの Pod は、他の優先度の高い Pod にプリエンプトされる可能性はあります。

`preemptionPolicy`はデフォルトでは`PreemptLowerPriority`に設定されており、これが設定されている Pod は優先度の低い Pod をプリエンプトすることを許容します。これは既存のデフォルトの挙動です。
`preemptionPolicy`を`Never`に設定すると、これが設定された Pod はプリエンプトを行わないようになります。

ユースケースの例として、データサイエンスの処理を挙げます。
ユーザーは他の処理よりも優先度を高くしたいジョブを追加できますが、そのとき既存の実行中の Pod の処理結果をプリエンプトによって破棄させたくはありません。
`preemptionPolicy: Never`が設定された優先度の高いジョブは、他の既にキューイングされた Pod よりも先に、クラスターのリソースが「自然に」開放されたときにスケジューリングされます。

### 非プリエンプトの PriorityClass の例

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority-nonpreempting
value: 1000000
preemptionPolicy: Never
globalDefault: false
description: "この優先度クラスは他のPodをプリエンプトさせません。"
```

## Pod の優先度 {#pod-priority}

一つ以上の PriorityClass があれば、仕様に PriorityClass を指定した Pod を作成することができるようになります。優先度のアドミッションコントローラーは`priorityClassName`フィールドを使用し、優先度の整数値を設定します。PriorityClass が見つからない場合、その Pod の作成は拒否されます。

下記の YAML は上記の例で作成した PriorityClass を使用する Pod の設定の例を示します。優先度のアドミッションコントローラーは仕様を確認し、この Pod の優先度は 1000000 であると設定します。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
    - name: nginx
      image: nginx
      imagePullPolicy: IfNotPresent
  priorityClassName: high-priority
```

### スケジューリング順序における Pod の優先度の効果

Pod の優先度が有効な場合、スケジューラーは待機状態の Pod をそれらの優先度順に並べ、スケジューリングキューにおいてより優先度の低い Pod よりも前に来るようにします。その結果、その条件を満たしたときには優先度の高い Pod は優先度の低い Pod より早くスケジューリングされます。優先度の高い Pod がスケジューリングできない場合は、スケジューラーは他の優先度の低い Pod のスケジューリングも試みます。

## プリエンプション

Pod が作成されると、スケジューリング待ちのキューに入り待機状態になります。スケジューラーはキューから Pod を取り出し、ノードへのスケジューリングを試みます。Pod に指定された条件を全て満たすノードが見つからない場合は、待機状態の Pod のためにプリエンプションロジックが発動します。待機状態の Pod を P と呼ぶことにしましょう。プリエンプションロジックは P よりも優先度の低い Pod を一つ以上追い出せば P をスケジューリングできるようになるノードを探します。そのようなノードがあれば、優先度の低い Pod はノードから追い出されます。Pod が追い出された後に、P はノードへスケジューリング可能になります。

### ユーザーへ開示される情報

Pod P がノード N の Pod をプリエンプトした場合、ノード N の名称が P のステータスの`nominatedNodeName`フィールドに設定されます。このフィールドはスケジューラーが Pod P のために予約しているリソースの追跡を助け、ユーザーにクラスターにおけるプリエンプトに関する情報を与えます。

Pod P は必ずしも「指名したノード」へスケジューリングされないことに注意してください。スケジューラーは、他のノードに対して処理を繰り返す前に、常に「指定したノード」に対して試行します。Pod がプリエンプトされると、その Pod は終了までの猶予期間を得ます。スケジューラーが Pod の終了を待つ間に他のノードが利用可能になると、スケジューラーは他のノードを Pod P のスケジューリング先にすることがあります。この結果、Pod の`nominatedNodeName`と`nodeName`は必ずしも一致しません。また、スケジューラーがノード N の Pod をプリエンプトさせた後に、Pod P よりも優先度の高い Pod が来た場合、スケジューラーはノード N をその新しい優先度の高い Pod へ与えることもあります。このような場合は、スケジューラーは Pod P の`nominatedNodeName`を消去します。これによって、スケジューラーは Pod P が他のノードの Pod をプリエンプトさせられるようにします。

### プリエンプトの制限

#### プリエンプトされる Pod の正常終了

Pod がプリエンプトされると、[猶予期間](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)が与えられます。
Pod は作業を完了し、終了するために十分な時間が与えられます。仮にそうでない場合、強制終了されます。この猶予期間によって、スケジューラーが Pod をプリエンプトした時刻と、待機状態の Pod P がノード N にスケジュール可能になるまでの時刻の間に間が開きます。この間、スケジューラーは他の待機状態の Pod をスケジュールしようと試みます。プリエンプトされた Pod が終了したら、スケジューラーは待ち行列にある Pod をスケジューリングしようと試みます。そのため、Pod がプリエンプトされる時刻と、P がスケジュールされた時刻には間が開くことが一般的です。この間を最小にするには、優先度の低い Pod の猶予期間を 0 または小さい値にする方法があります。

#### PodDisruptionBudget は対応するが、保証されない

[PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) (PDB)は、アプリケーションのオーナーが冗長化されたアプリケーションの Pod が意図的に中断される数の上限を設定できるようにするものです。Kubernetes は Pod をプリエンプトする際に PDB に対応しますが、PDB はベストエフォートで考慮します。スケジューラーはプリエンプトさせたとしても PDB に違反しない Pod を探します。そのような Pod が見つからない場合でもプリエンプションは実行され、PDB に反しますが優先度の低い Pod が追い出されます。

#### 優先度の低い Pod における Pod 間のアフィニティ

次の条件が真の場合のみ、ノードはプリエンプションの候補に入ります。
「待機状態の Pod よりも優先度の低い Pod をノードから全て追い出したら、待機状態の Pod をノードへスケジュールできるか」

{{< note >}}
プリエンプションは必ずしも優先度の低い Pod を全て追い出しません。
優先度の低い Pod を全て追い出さなくても待機状態の Pod がスケジューリングできる場合、一部の Pod のみ追い出されます。
このような場合であったとしても、上記の条件は真である必要があります。偽であれば、そのノードはプリエンプションの対象とはされません。
{{< /note >}}

待機状態の Pod が、優先度の低い Pod との間で Pod 間の{{< glossary_tooltip text="アフィニティ" term_id="affinity" >}}を持つ場合、Pod 間のアフィニティはそれらの優先度の低い Pod がなければ満たされません。この場合、スケジューラーはノードのどの Pod もプリエンプトしようとはせず、代わりに他のノードを探します。スケジューラーは適切なノードを探せる場合と探せない場合があります。この場合、待機状態の Pod がスケジューリングされる保証はありません。

この問題に対して推奨される解決策は、優先度が同一または高い Pod に対してのみ Pod 間のアフィニティを作成することです。

#### 複数ノードに対するプリエンプション

Pod P がノード N にスケジューリングできるよう、ノード N がプリエンプションの対象となったとします。
他のノードの Pod がプリエンプトされた場合のみ P が実行可能になることもあります。下記に例を示します。

- Pod P をノード N に配置することを検討します。
- Pod Q はノード N と同じゾーンにある別のノードで実行中です。
- Pod P はゾーンに対する Q へのアンチアフィニティを持ちます (`topologyKey: topology.kubernetes.io/zone`)。
- Pod P と、ゾーン内の他の Pod に対しては他のアンチアフィニティはない状態です。
- Pod P をノード N へスケジューリングするには、Pod Q をプリエンプトすることが考えられますが、スケジューラーは複数ノードにわたるプリエンプションは行いません。そのため、Pod P はノード N へはスケジューリングできないとみなされます。

Pod Q がそのノードから追い出されると、Pod アンチアフィニティに違反しなくなるので、Pod P はノード N へスケジューリング可能になります。

複数ノードに対するプリエンプションに関しては、十分な需要があり、合理的な性能を持つアルゴリズムを見つけられた場合に、将来的に機能追加を検討する可能性があります。

## トラブルシューティング

Pod の優先度とプリエンプションは望まない副作用をもたらす可能性があります。
いくつかの起こりうる問題と、その対策について示します。

### Pod が不必要にプリエンプトされる

プリエンプションは、リソースが不足している場合に優先度の高い待機状態の Pod のためにクラスターの既存の Pod を追い出します。
誤って高い優先度を Pod に割り当てると、意図しない高い優先度の Pod はクラスター内でプリエンプションを引き起こす可能性があります。Pod の優先度は Pod の仕様の`priorityClassName`フィールドにて指定されます。優先度を示す整数値へと変換された後、`podSpec`の`priority`へ設定されます。

この問題に対処するには、Pod の`priorityClassName`をより低い優先度に変更するか、このフィールドを未設定にすることができます。`priorityClassName`が未設定の場合、デフォルトでは優先度は 0 とされます。

Pod がプリエンプトされたとき、プリエンプトされた Pod のイベントが記録されます。
プリエンプションは Pod に必要なリソースがクラスターにない場合のみ起こるべきです。
このような場合、プリエンプションはプリエンプトされる Pod よりも待機状態の Pod の優先度が高い場合のみ発生します。
プリエンプションは待機状態の Pod がない場合や待機状態の Pod がプリエンプト対象の Pod 以下の優先度を持つ場合には決して発生しません。そのような状況でプリエンプションが発生した場合、問題を報告してください。

### Pod はプリエンプトされたが、プリエンプトさせた Pod がスケジューリングされない

Pod がプリエンプトされると、それらの Pod が要求した猶予期間が与えられます。そのデフォルトは 30 秒です。
Pod がその期間内に終了しない場合、強制終了されます。プリエンプトされた Pod がなくなれば、プリエンプトさせた Pod はスケジューリング可能です。

プリエンプトさせた Pod がプリエンプトされた Pod の終了を待っている間に、より優先度の高い Pod が同じノードに対して作成されることもあります。この場合、スケジューラーはプリエンプトさせた Pod の代わりに優先度の高い Pod をスケジューリングします。

これは予期された挙動です。優先度の高い Pod は優先度の低い Pod に取って代わります。

### 優先度の高い Pod が優先度の低い Pod より先にプリエンプトされる

スケジューラーは待機状態の Pod が実行可能なノードを探します。ノードが見つからない場合、スケジューラーは任意のノードから優先度の低い Pod を追い出し、待機状態の Pod のためのリソースを確保しようとします。
仮に優先度の低い Pod が動いているノードが待機状態の Pod を動かすために適切ではない場合、スケジューラーは他のノードで動いている Pod と比べると、優先度の高い Pod が動いているノードをプリエンプションの対象に選ぶことがあります。この場合もプリエンプトされる Pod はプリエンプトを起こした Pod よりも優先度が低い必要があります。

複数のノードがプリエンプションの対象にできる場合、スケジューラーは優先度が最も低い Pod のあるノードを選ぼうとします。しかし、そのような Pod が PodDisruptionBudget を持っており、プリエンプトすると PDB に反する場合はスケジューラーは優先度の高い Pod のあるノードを選ぶこともあります。

複数のノードがプリエンプションの対象として利用可能で、上記の状況に当てはまらない場合、スケジューラーは優先度の最も低いノードを選択します。

## Pod の優先度と QoS の相互作用 {#interactions-of-pod-priority-and-qos}

Pod の優先度と{{< glossary_tooltip text="QoSクラス" term_id="qos-class" >}}は直交する機能で、わずかに相互作用がありますが、デフォルトでは QoS クラスによる優先度の設定の制約はありません。スケジューラーのプリエンプションのロジックはプリエンプションの対象を決めるときに QoS クラスは考慮しません。
プリエンプションは Pod の優先度を考慮し、優先度が最も低いものを候補とします。より優先度の高い Pod は優先度の低い Pod を追い出すだけではプリエンプトを起こした Pod のスケジューリングに不十分な場合と、`PodDisruptionBudget`により優先度の低い Pod が保護されている場合のみ対象になります。

kubelet は[node-pressure による退避](/docs/concepts/scheduling-eviction/node-pressure-eviction/)を行う Pod の順番を決めるために、優先度を利用します。QoS クラスを使用して、最も退避される可能性の高い Pod の順番を推定することができます。
kubelet は追い出す Pod の順位付けを次の順で行います。

1. 枯渇したリソースを要求以上に使用しているか
1. Pod の優先度
1. 要求に対するリソースの使用量

詳細は[kubelet による Pod の退避](/docs/concepts/scheduling-eviction/node-pressure-eviction/#pod-selection-for-kubelet-eviction)を参照してください。

kubelet によるリソース不足時の Pod の追い出しでは、リソースの消費が要求を超えない Pod は追い出されません。優先度の低い Pod のリソースの利用量がその要求を超えていなければ、追い出されることはありません。より優先度が高く、要求を超えてリソースを使用している Pod が追い出されます。

## {{% heading "whatsnext" %}}

- PriorityClass と関連付けて ResourceQuota を使用することに関して [デフォルトで優先度クラスの消費を制限する](/ja/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default)
- [Pod の破壊](/docs/concepts/workloads/pods/disruptions/)を読む
- [API を起点とした退避](/ja/docs/concepts/scheduling-eviction/api-eviction/)を読む
- [Node-pressure による退避](/docs/concepts/scheduling-eviction/node-pressure-eviction/)を読む
