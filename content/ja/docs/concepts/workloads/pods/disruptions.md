---
title: Disruption
content_type: concept
weight: 70
---


<!-- overview -->
このガイドは、高可用性アプリケーションを構築したいと考えており、そのために、Podに対してどのような種類のDisruptionが発生する可能性があるか理解する必要がある、アプリケーション所有者を対象としたものです。

また、クラスターのアップグレードやオートスケーリングなどのクラスターの操作を自動化したいクラスター管理者も対象にしています。

<!-- body -->

## 自発的なDisruptionと非自発的なDisruption

Podは誰か(人やコントローラー)が破壊するか、避けることができないハードウェアまたはシステムソフトウェアエラーが発生するまで、消えることはありません。

これらの不可避なケースをアプリケーションに対する*非自発的なDisruption*と呼びます。
例えば:

- ノードのバックエンドの物理マシンのハードウェア障害
- クラスター管理者が誤ってVM(インスタンス)を削除した
- クラウドプロバイダーまたはハイパーバイザーの障害によってVMが消えた
- カーネルパニック
- クラスターネットワークパーティションが原因でクラスターからノードが消えた
- ノードの[リソース不足](/docs/concepts/scheduling-eviction/node-pressure-eviction/)によるPodの退避

リソース不足を除いて、これら条件は全て、大半のユーザーにとって馴染みのあるものでしょう。
これらはKubernetesに固有のものではありません。

それ以外のケースのことを*自発的なDisruption*と呼びます。
これらはアプリケーションの所有者によって起こされたアクションと、クラスター管理者によって起こされたアクションの両方を含みます。
典型的なアプリケーションの所有者によるアクションには次のものがあります:

- Deploymentやその他のPodを管理するコントローラーの削除
- 再起動を伴うDeployment内のPodのテンプレートの更新
- Podの直接削除(例:アクシデントによって)

クラスター管理者のアクションには、次のようなものが含まれます:

- 修復やアップグレードのための[ノードのドレイン](/docs/tasks/administer-cluster/safely-drain-node/)。
- クラスターのスケールダウンのためにクラスターからノードをドレインする([クラスター自動スケーリング](https://github.com/kubernetes/autoscaler/#readme)について学ぶ)。
- そのノードに別のものを割り当てることができるように、ノードからPodを削除する。

これらのアクションはクラスター管理者によって直接実行されるか、クラスター管理者やクラスターをホスティングしているプロバイダーによって自動的に実行される可能性があります。

クラスターに対して自発的なDisruptionの要因となるものが有効になっているかどうかについては、クラスター管理者に聞くか、クラウドプロバイダーに相談または配布文書を参照してください。
有効になっているものが何もなければ、Pod Disruption Budgetの作成はスキップすることができます。

{{< caution >}}
全ての自発的なDisruptionがPod Disruption Budgetによる制約を受けるわけではありません。
例えばDeploymentやPodの削除はPod Disruption Budgetをバイパスします。
{{< /caution >}}

## Disruptionへの対応

非自発的なDisruptionを軽減する方法をいくつか紹介します:

- Podは必要な[リソースを要求](/ja/docs/tasks/configure-pod-container/assign-memory-resource)するようにする。
- 高可用性が必要な場合はアプリケーションをレプリケートする。(レプリケートされた[ステートレス](/ja/docs/tasks/run-application/run-stateless-application-deployment/)および[ステートフル](/ja/docs/tasks/run-application/run-replicated-stateful-application/)アプリケーションの実行について学ぶ。)
- レプリケートされたアプリケーションを実行する際にさらに高い可用性を得るには、([アンチアフィニティ](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)を使って)ラックを横断して、または([マルチゾーンクラスター](/ja/docs/setup/multiple-zones)を使用している場合には)ゾーンを横断してアプリケーションを分散させる。

自発的なDisruptionの頻度は様々です。
基本的なKubernetesクラスターでは、自動で発生する自発的なDisruptionはありません(ユーザーによってトリガーされたものだけです)。
しかし、クラスター管理者やホスティングプロバイダーが何か追加のサービスを実行して自発的なDisruptionが発生する可能性があります。
例えば、ノード上のソフトウェアアップデートのロールアウトは自発的なDisruptionの原因となります。
また、クラスター(ノード)自動スケーリングの実装の中には、ノードのデフラグとコンパクト化のために自発的なDisruptionを伴うものがあります。
クラスタ管理者やホスティングプロバイダーは、自発的なDisruptionがある場合、どの程度のDisruptionが予想されるかを文書化しているはずです。
Podのspecの中で[PriorityClassesを使用している](/ja/docs/concepts/scheduling-eviction/pod-priority-preemption/)場合など、特定の設定オプションによっても自発的(および非自発的)なDisruptionを引き起こす可能性があります。


## Pod Disruption Budget

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Kubernetesは、自発的なDisruptionが頻繁に発生する場合でも、可用性の高いアプリケーションの運用を支援する機能を提供しています。

アプリケーションの所有者として、各アプリケーションに対してPodDisruptionBudget (PDB)を作成することができます。
PDBは、レプリカを持っているアプリケーションのうち、自発的なDisruptionによって同時にダウンするPodの数を制限します。
例えば、クォーラムベースのアプリケーションでは、実行中のレプリカの数がクォーラムに必要な数を下回らないようにする必要があります。
Webフロントエンドは、負荷に対応するレプリカの数が、全体に対して一定の割合を下回らないようにしたいかもしれません。

クラスター管理者やホスティングプロバイダーは、直接PodやDeploymentを削除するのではなく、[Eviction API](/docs/tasks/administer-cluster/safely-drain-node/#eviction-api)を呼び出す、PodDisruptionBudgetsに配慮したツールを使用すべきです。

例えば、`kubectl drain`サブコマンドはノードを休止中とマークします。
`kubectl drain`を実行すると、ツールは休止中としたノード上の全てのPodを退避しようとします。
`kubectl`があなたの代わりに送信する退避要求は一時的に拒否される可能性があるため、ツールは対象のノード上の全てのPodが終了するか、設定可能なタイムアウト時間に達するまで、全ての失敗した要求を定期的に再試行します。

PDBはアプリケーションの意図したレプリカ数に対して、許容できるレプリカの数を指定します。
例えば`.spec.replicas: 5`を持つDeploymentは常に5つのPodを持つことが想定されます。
PDBが同時に4つまでを許容する場合、Eviction APIは1度に(2つではなく)1つのPodの自発的なDisruptionを許可します。

アプリケーションを構成するPodのグループは、アプリケーションのコントローラー(Deployment、StatefulSetなど)が使用するものと同じラベルセレクターを使用して指定されます。

"意図した"Podの数は、これらのPodを管理するワークロードリソースの`.spec.replicas`から計算されます。
コントロールプレーンはPodの`.metadata.ownerReferences`を調べることで、所有しているワークロードリソースを見つけます。

[非自発的なDisruption](#voluntary-and-involuntary-disruptions)はPDBによって防ぐことができません;
しかし、予算にはカウントされます。

アプリケーションのローリングアップデートによって削除または利用できなくなったPodはDisruptionの予算にカウントされますが、ローリングアップグレードを実行している時は(DeploymentやStatefulSetなどの)ワークロードリソースはPDBによって制限されません。
代わりに、アプリケーションのアップデート中の障害のハンドリングは、個々のワークロードリソースに対するspecで設定されます。

ノードのドレイン中に動作がおかしくなったアプリケーションの退避をサポートするために、[Unhealthy Pod Eviction Policy](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)に`AlwaysAllow`を設定することを推奨します。
既定の動作は、ドレインを継続する前にアプリケーションPodが[healthy](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)な状態になるまで待機します。

Eviction APIを使用してPodを退避した場合、[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)で設定した`terminationGracePeriodSeconds`に従って正常に[終了](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)します。

## PodDisruptionBudgetの例 {#pdb-example}

`node-1`から`node-3`まで3つのノードがあるクラスターを考えます。
クラスターにはいくつかのアプリケーションが動いています。
それらのうちの1つは3つのレプリカを持ち、最初は`pod-a`、`pod-b`そして`pod-c`と名前が付いています。
もう一つ、これとは独立したPDBなしの`pod-x`と呼ばれるものもあります。
初期状態ではPodは次のようにレイアウトされています:

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *available*   | pod-b *available*   | pod-c *available*  |
| pod-x  *available*   |                     |                    |

3つのPodはすべてDeploymentの一部で、これらはまとめて1つのPDBを持ち、3つのPodのうちの少なくとも2つが常に存在していることを要求します。

例えばクラスター管理者がカーネルのバグを修正するために、再起動して新しいカーネルバージョンにしたいとします。
クラスター管理者はまず、`kubectl drain`コマンドを使って`node-1`をドレインしようとします。
ツールは`pod-a`と`pod-x`を退避しようとします。
これはすぐに成功します。
2つのPodは同時に`terminating`状態になります。
これにより、クラスターは次のような状態になります:

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* |                     |                    |

DeploymentはPodの1つが終了中であることに気づき、`pod-d`という代わりのPodを作成します。
`node-1`はcordonされたため、別のノードに展開されます。
また、`pod-x`の代わりとして`pod-y`も作られました。

(備考: StatefulSetの場合、`pod-a`は`pod-0`のように呼ばれ、代わりのPodが作成される前に完全に終了する必要があります。
この代わりのPodは、UIDは異なりますが、同じ`pod-0`という名前になります。
それを除けば、本例はStatefulSetにも当てはまります。)

現在、クラスターは次のような状態になっています:

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* | pod-d *starting*    | pod-y              |

ある時点でPodは終了し、クラスターはこのようになります:

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *starting*    | pod-y              |

この時点で、せっかちなクラスター管理者が`node-2`か`node-3`をドレインしようとすると、Deploymentの利用可能なPodは2つしかなく、また、PDBによって最低2つのPodが要求されているため、drainコマンドはブロックされます。
しばらくすると、`pod-d`が使用可能になります。

クラスターの状態はこのようになります:

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *available*   | pod-y              |

ここでクラスター管理者が`node-2`をドレインしようとします。
drainコマンドは2つのPodをなんらかの順番で退避しようとします。
例えば最初に`pod-b`、次に`pod-d`とします。
`pod-b`については退避に成功します。
しかし`pod-d`を退避しようとすると、Deploymentに対して利用可能なPodは1つしか残らないため、退避は拒否されます。

Deploymentは`pod-b`の代わりとして`pod-e`を作成します。
クラスターには`pod-e`をスケジューリングする十分なリソースがないため、ドレインは再びブロックされます。
クラスターは次のような状態になります:

|    node-1 *drained*  |       node-2        |       node-3       | *no node*          |
|:--------------------:|:-------------------:|:------------------:|:------------------:|
|                      | pod-b *terminating* | pod-c *available*  | pod-e *pending*    |
|                      | pod-d *available*   | pod-y              |                    |

この時点で、クラスター管理者はアップグレードを継続するためにクラスターにノードを追加する必要があります。

KubernetesがどのようにDisruptionの発生率を変化させているかについては、次のようなものから知ることができます:

- いくつのレプリカをアプリケーションが必要としているか
- インスタンスのグレースフルシャットダウンにどれくらいの時間がかかるか
- 新しいインスタンスのスタートアップにどれくらいの時間がかかるか
- コントローラーの種類
- クラスターリソースのキャパシティ

## Pod Disruption Condition {#pod-disruption-conditions}

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

{{< note >}}
この機能を使用するためには、クラスターで[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)`PodDisruptionConditions`を有効にする必要があります。
{{< /note >}}

有効にすると、専用のPod `DisruptionTarget` [Condition](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)が追加されます。
これはPodが{{<glossary_tooltip term_id="disruption" text="Disruption">}}によって削除されようとしていることを示すものです。
Conditionの`reason`フィールドにて、追加で以下のいずれかをPodの終了の理由として示します:

`PreemptionByScheduler`
: Podはより高い優先度を持つ新しいPodを収容するために、スケジューラーによって{{<glossary_tooltip term_id="preemption" text="プリエンプトされる">}}予定です。
詳細については[Podの優先度とプリエンプション](/ja/docs/concepts/scheduling-eviction/pod-priority-preemption/)を参照してください。

`DeletionByTaintManager`
: Podが許容しない`NoExecute` taintによって、Podは(`kube-controller-manager`の中のノードライフサイクルコントローラーである)Taintマネージャーによって削除される予定です。
{{<glossary_tooltip term_id="taint" text="taint">}}ベースの退避を参照してください。

`EvictionByEvictionAPI`
: Podは{{<glossary_tooltip term_id="api-eviction" text="Kubernetes APIを使用して退避するように">}}マークされました。

`DeletionByPodGC`
: すでに存在しないノードに紐づいているPodのため、[Podのガベージコレクション](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)によって削除される予定です。

`TerminationByKubelet`
: {{<glossary_tooltip term_id="node-pressure-eviction" text="node-pressureによる退避">}}または[Graceful Node Shutdown](/ja/docs/concepts/architecture/nodes/#graceful-node-shutdown)のため、Podはkubeletによって終了させられました。

{{< note >}}
PodのDisruptionは一時停止する場合があります。
コントロールプレーンは同じPodに対するDisruptionを継続するために再試行するかもしれませんが、保証はされていません。
その結果、`DisruptionTarget` ConditionはPodに付与されるかもしれませんが、実際にはPodは削除されていない可能性があります。
そのような状況の場合、しばらくすると、Pod Disruption Conditionはクリアされます。
{{< /note >}}

フィーチャーゲート`PodDisruptionConditions`を有効にすると、Podのクリーンアップと共に、Podガベージコレクタ(PodGC)が非終了フェーズにあるPodを失敗とマークします。
([Podガベージコレクション](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)も参照してください)。

Job(またはCronJob)を使用している場合、Jobの[Pod失敗ポリシー](/ja/docs/concepts/workloads/controllers/job#pod-failure-policy)の一部としてこれらのPod Disruption Conditionを使用したいと思うかもしれません。

## クラスターオーナーとアプリケーションオーナーロールの分離

多くの場合、クラスター管理者とアプリケーションオーナーは、互いの情報を一部しか持たない別の役割であると考えるのが便利です。
このような責任の分離は、次のようなシナリオで意味を持つことがあります:

- 多くのアプリケーションチームでKubernetesクラスターを共有していて、役割の専門化が自然に行われている場合
- クラスター管理を自動化するためにサードパーティのツールやサービスを使用している場合

Pod Disruption Budgetはロール間のインターフェースを提供することによって、この役割の分離をサポートします。

もしあなたの組織でこのような責任の分担がなされていない場合は、Pod Disruption Budgetを使用する必要はないかもしれません。

## クラスターで破壊的なアクションを実行する方法

あなたがクラスターの管理者で、ノードやシステムソフトウェアのアップグレードなど、クラスター内のすべてのノードに対して破壊的なアクションを実行する必要がある場合、次のような選択肢があります:

- アップグレードの間のダウンタイムを許容する。
- もう一つの完全なレプリカクラスターにフェールオーバーする。
   - ダウンタイムはありませんが、重複するノードと、切り替えを調整する人的労力の両方のコストがかかる可能性があります。
- Disruptionに耐性のあるアプリケーションを書き、PDBを使用する。
   - ダウンタイムはありません。
   - リソースの重複は最小限です。
   - クラスター管理をより自動化できます。
   - Disruptionに耐えうるアプリケーションを書くことは大変ですが、自発的なDisruptionに耐えうるようにするための作業は、非自発的なDisruptionに耐えうるために必要な作業とほぼ重複しています。




## {{% heading "whatsnext" %}}


* [Pod Disruption Budgeを構成して](/docs/tasks/run-application/configure-pdb/)アプリケーションを保護する手順にしたがってください。

* [ノードのドレイン](/docs/tasks/administer-cluster/safely-drain-node/)について学んでください。

* ロールアウト中の可用性を維持するためのステップなど、[Deploymentの更新](/ja/docs/concepts/workloads/controllers/deployment/#updating-a-deployment)について学んでください。
