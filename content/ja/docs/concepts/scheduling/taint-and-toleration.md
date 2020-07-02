---
title: TaintとToleration
content_type: concept
weight: 40
---


<!-- overview -->
[_Nodeアフィニティ_](/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity)は
{{< glossary_tooltip text="Pod" term_id="pod" >}}の属性であり、ある{{< glossary_tooltip text="Node" term_id="node" >}}群を*引きつけます*（優先条件または必須条件）。 反対に_Taint_はNodeがある種のPodを排除できるようにします。

_Toleration_はPodに適用され、一致するTaintが付与されたNodeへPodがスケジューリングされることを認めるものです。ただしそのNodeへ必ずスケジューリングされるとは限りません。

TaintとTolerationは組になって機能し、Podが不適切なNodeへスケジューリングされないことを保証します。TaintはNodeに一つまたは複数個付与することができます。これはそのNodeがTaintを許容しないPodを受け入れるべきではないことを示します。


<!-- body -->

## コンセプト

NodeにTaintを付与するには[kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)コマンドを使用します。
例えば、次のコマンドは

```shell
kubectl taint nodes node1 key=value:NoSchedule
```

`node1`にTaintを設定します。このTaintのキーは`key`、値は`value`、Taintの効果は`NoSchedule`です。
これは`node1`にはPodに合致するTolerationがなければスケジューリングされないことを意味します。

上記のコマンドで付与したTaintを外すには、下記のコマンドを使います。
```shell
kubectl taint nodes node1 key:NoSchedule-
```

PodのTolerationはPodSpecの中に指定します。下記のTolerationはどちらも、上記の`kubectl taint`コマンドで追加したTaintと合致するため、どちらのTolerationが設定されたPodも`node1`へスケジューリングされることができます。

```yaml
tolerations:
- key: "key"
  operator: "Equal"
  value: "value"
  effect: "NoSchedule"
```

```yaml
tolerations:
- key: "key"
  operator: "Exists"
  effect: "NoSchedule"
```

Tolerationを設定したPodの例を示します。

{{< codenew file="pods/pod-with-toleration.yaml" >}}

`operator`のデフォルトは`Equal`です。

TolerationがTaintと合致するのは、`key`と`effect`が同一であり、さらに下記の条件のいずれかを満たす場合です。

* `operator`が`Exists`（`value`を指定すべきでない場合）
* `operator`が`Equal`であり、かつ`value`が同一である場合

{{< note >}}

2つ特殊な場合があります。

空の`key`と演算子`Exists`は全ての`key`、`value`、`effect`と一致するため、すべてのTaintと合致します。

空の`effect`は`key`が一致する全てのeffectと合致します。

{{< /note >}}

上記の例では`effect`に`NoSchedule`を指定しました。代わりに、`effect`に`PreferNoSchedule`を指定することができます。
これは`NoSchedule`の「ソフトな」バージョンであり、システムはTaintに対応するTolerationが設定されていないPodがNodeへ配置されることを避けようとしますが、必須の条件とはしません。3つ目の`effect`の値として`NoExecute`がありますが、これについては後述します。

同一のNodeに複数のTaintを付与することや、同一のPodに複数のTolerationを設定することができます。
複数のTaintやTolerationが設定されている場合、Kubernetesはフィルタのように扱います。最初はNodeの全てのTaintがある状態から始め、Podが対応するTolerationを持っているTaintは無視され外されていきます。無視されずに残ったTaintが効果を及ぼします。
具体的には、

* effect `NoSchedule`のTaintが無視されず残った場合、KubernetesはそのPodをNodeへスケジューリングしません。
* effect `NoSchedule`のTaintは残らず、effect `PreferNoSchedule`のTaintは残った場合、KubernetesはそのNodeへのスケジューリングをしないように試みます。
* effect `NoExecute`のTaintが残った場合、既に稼働中のPodはそのNodeから排除され、まだ稼働していないPodはスケジューリングされないようになります。

例として、下記のようなTaintが付与されたNodeを考えます。

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

Podには2つのTolerationが設定されています。

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
```

この例では、3つ目のTaintと合致するTolerationがないため、PodはNodeへはスケジューリングされません。
しかし、これらのTaintが追加された時点で、そのNodeでPodが稼働していれば続けて稼働することが可能です。 これは、PodのTolerationと合致しないTaintは3つあるTaintのうちの3つ目のTaintのみであり、それが`NoSchedule`であるためです。

一般に、effect `NoExecute`のTaintがNodeに追加されると、合致するTolerationが設定されていないPodは即時にNodeから排除され、合致するTolerationが設定されたPodが排除されることは決してありません。
しかし、effect`NoExecute`に対するTolerationは`tolerationSeconds`フィールドを任意で指定することができ、これはTaintが追加された後にそのNodeにPodが残る時間を示します。例えば、

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
  tolerationSeconds: 3600
```

この例のPodが稼働中で、対応するTaintがNodeへ追加された場合、PodはそのNodeに3600秒残り、その後排除されます。仮にTaintがそれよりも前に外された場合、Podは排除されません。

## ユースケースの例

TaintとTolerationは、実行されるべきではないNodeからPodを遠ざけたり、排除したりするための柔軟な方法です。いくつかのユースケースを示します。

* **専有Node**: あるNode群を特定のユーザーに専有させたい場合、そのNode群へTaintを追加し(`kubectl taint nodes nodename dedicated=groupName:NoSchedule`) 対応するTolerationをPodへ追加します（これを実現する最も容易な方法はカスタム
[アドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/)を書くことです）。
Tolerationが設定されたPodはTaintの設定された（専有の）Nodeと、クラスターにあるその他のNodeの使用が認められます。もしPodが必ず専有Node*のみ*を使うようにしたい場合は、Taintと同様のラベルをそのNode群に設定し(例: `dedicated=groupName`)、アドミッションコントローラーはNodeアフィニティを使ってPodが`dedicated=groupName`のラベルの付いたNodeへスケジューリングすることが必要であるということも設定する必要があります。

* **特殊なハードウェアを備えるNode**: クラスターの中の少数のNodeが特殊なハードウェア（例えばGPU）を備える場合、そのハードウェアを必要としないPodがスケジューリングされないようにして、後でハードウェアを必要とするPodができたときの余裕を確保したいことがあります。
これは特殊なハードウェアを持つNodeにTaintを追加(例えば `kubectl taint nodes nodename special=true:NoSchedule` または
`kubectl taint nodes nodename special=true:PreferNoSchedule`)して、ハードウェアを使用するPodに対応するTolerationを追加することで可能です。
専有Nodeのユースケースと同様に、Tolerationを容易に適用する方法はカスタム
[アドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/)を使うことです。
例えば、特殊なハードウェアを表すために[拡張リソース](/docs/concepts/configuration/manage-compute-resources-container/#extended-resources)
を使い、ハードウェアを備えるNodeに拡張リソースの名称のTaintを追加して、
[拡張リソースToleration](/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration)
アドミッションコントローラーを実行することが推奨されます。NodeにはTaintが付与されているため、TolerationのないPodはスケジューリングされません。しかし拡張リソースを要求するPodを作成しようとすると、`拡張リソースToleration` アドミッションコントローラーはPodに自動的に適切なTolerationを設定し、Podはハードウェアを備えるNodeへスケジューリングされます。
これは特殊なハードウェアを備えたNodeではそれを必要とするPodのみが稼働し、Podに対して手作業でTolerationを追加しなくて済むようにします。

* **Taintを基にした排除**: Nodeに問題が起きたときにPodごとに排除する設定を行うことができます。次のセクションにて説明します。

## Taintを基にした排除

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

上述したように、effect `NoExecute`のTaintはNodeで実行中のPodに次のような影響を与えます。

 * 対応するTolerationのないPodは即座に除外される
 * 対応するTolerationがあり、それに`tolerationSeconds`が指定されていないPodは残り続ける
 * 対応するTolerationがあり、それに`tolerationSeconds`が指定されているPodは指定された間、残される

Nodeコントローラーは特定の条件を満たす場合に自動的にTaintを追加します。
組み込まれているTaintは下記の通りです。

 * `node.kubernetes.io/not-ready`: Nodeの準備ができていない場合。これはNodeCondition `Ready`が`False`である場合に対応します。
 * `node.kubernetes.io/unreachable`: NodeがNodeコントローラーから到達できない場合。これはNodeCondition`Ready`が`Unknown`の場合に対応します。
 * `node.kubernetes.io/out-of-disk`: Nodeのディスクの空きがない場合。
 * `node.kubernetes.io/memory-pressure`: Nodeのメモリーが不足している場合。
 * `node.kubernetes.io/disk-pressure`: Nodeのディスクが不足している場合。
 * `node.kubernetes.io/network-unavailable`: Nodeのネットワークが利用できない場合。
 * `node.kubernetes.io/unschedulable`: Nodeがスケジューリングできない場合。
 * `node.cloudprovider.kubernetes.io/uninitialized`: kubeletが外部のクラウド事業者により起動されたときに設定されるTaintで、このNodeは利用不可能であることを示します。cloud-controller-managerによるコントローラーがこのNodeを初期化した後にkubeletはこのTaintを外します。

Nodeから追い出すときには、Nodeコントローラーまたはkubeletは関連するTaintを`NoExecute`効果の状態で追加します。
不具合のある状態から通常の状態へ復帰した場合は、kubeletまたはNodeコントローラーは関連するTaintを外すことができます。

{{< note >}}
コントロールプレーンは新しいTaintをNodeに加えるレートを制限しています。
このレート制限は一度に多くのNodeが到達不可能になった場合（例えばネットワークの断絶）に、退役させられるNodeの数を制御します。
{{< /note >}}

Podに`tolerationSeconds`を指定することで不具合があるか応答のないNodeに残る時間を指定することができます。

例えば、ローカルの状態を多数持つアプリケーションとネットワークが分断された場合を考えます。ネットワークが復旧して、Podを排除しなくて済むことを見込んで、長時間Nodeから排除されないようにしたいこともあるでしょう。
この場合Podに設定するTolerationは次のようになります。

```yaml
tolerations:
- key: "node.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

{{< note >}}
Kubernetesはユーザーまたはコントローラーが明示的に指定しない限り、自動的に`node.kubernetes.io/not-ready`と`node.kubernetes.io/unreachable`に対するTolerationを`tolerationSeconds=300`にて設定します。

自動的に設定されるTolerationは、Taintに対応する問題がNodeで検知されても5分間はそのNodeにPodが残されることを意味します。
{{< /note >}}

[DaemonSet](/docs/concepts/workloads/controllers/daemonset/)のPodは次のTaintに対して`NoExecute`のTolerationが`tolerationSeconds`を指定せずに設定されます。

  * `node.kubernetes.io/unreachable`
  * `node.kubernetes.io/not-ready`

これはDaemonSetのPodはこれらの問題によって排除されないことを保証します。

## 条件によるTaintの付与

NodeのライフサイクルコントローラーはNodeの状態に応じて`NoSchedule`効果のTaintを付与します。
スケジューラーはNodeの状態ではなく、Taintを確認します。
Nodeに何がスケジューリングされるかは、そのNodeの状態に影響されないことを保証します。ユーザーは適切なTolerationをPodに付与することで、どの種類のNodeの問題を無視するかを選ぶことができます。

DaemonSetのコントローラーは、DaemonSetが中断されるのを防ぐために自動的に次の`NoSchedule`Tolerationを全てのDaemonSetに付与します。

  * `node.kubernetes.io/memory-pressure`
  * `node.kubernetes.io/disk-pressure`
  * `node.kubernetes.io/out-of-disk` (*重要なPodのみ*)
  * `node.kubernetes.io/unschedulable` (1.10またはそれ以降)
  * `node.kubernetes.io/network-unavailable` (*ホストネットワークのみ*)

これらのTolerationを追加することは後方互換性を保証します。DaemonSetに任意のTolerationを加えることもできます。


## {{% heading "whatsnext" %}}

* [リソース枯渇の対処](/docs/tasks/administer-cluster/out-of-resource/)とどのような設定ができるかについてを読む
* [Podの優先度](/docs/concepts/configuration/pod-priority-preemption/)を読む
