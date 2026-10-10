---
title: ノード
content_type: concept
weight: 10
---

<!-- overview -->

Kubernetesはコンテナを _Node_ 上で実行されるPodに配置することで、ワークロードを実行します。
ノードはクラスターによりますが、1つのVMまたは物理的なマシンです。
各ノードは{{< glossary_tooltip text="Pod" term_id="pod" >}}やそれを制御する{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}を実行するのに必要なサービスを含んでいます。

通常、1つのクラスターで複数のノードを持ちます。学習用途やリソースの制限がある環境では、1ノードかもしれません。

1つのノード上の[コンポーネント](/ja/docs/concepts/overview/components/#node-components)には、{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}、{{< glossary_tooltip text="コンテナランタイム" term_id="container-runtime" >}}、{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}が含まれます。

<!-- body -->

## 管理 {#management}

ノードを{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}に加えるには2つの方法があります:

1. ノード上のkubeletが、コントロールプレーンに自己登録する。
2. あなた、もしくは他のユーザーが手動でNodeオブジェクトを追加する。

Nodeオブジェクトの作成、もしくはノード上のkubeletによる自己登録の後、コントロールプレーンはNodeオブジェクトが有効かチェックします。例えば、下記のjsonマニフェストでノードを作成してみましょう:

```json
{
  "kind": "Node",
  "apiVersion": "v1",
  "metadata": {
    "name": "10.240.79.157",
    "labels": {
      "name": "my-first-k8s-node"
    }
  }
}
```

Kubernetesは内部的にNodeオブジェクトを作成します。 APIサーバーに登録したkubeletがノードの`metadata.name`フィールドが一致しているか検証します。ノードが有効な場合、つまり必要なサービスがすべて実行されている場合は、Podを実行する資格があります。それ以外の場合、該当ノードが有効になるまではいかなるクラスターの活動に対しても無視されます。

{{< note >}}
Kubernetesは無効なNodeのオブジェクトを保持し、それが有効になるまで検証を続けます。

ヘルスチェックを止めるためには、あなた、もしくは{{< glossary_tooltip term_id="controller" text="コントローラー">}}が明示的にNodeを削除する必要があります。
{{< /note >}}

Nodeオブジェクトの名前は有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)である必要があります。

### ノードの自己登録 {#self-registration-of-nodes}

kubeletのフラグ `--register-node`がtrue（デフォルト）のとき、kubeletは自分自身をAPIサーバーに登録しようとします。これはほとんどのディストリビューションで使用されている推奨パターンです。

自己登録については、kubeletは以下のオプションを伴って起動されます:

  - `--kubeconfig` - 自分自身をAPIサーバーに対して認証するための資格情報へのパス
  - `--cloud-provider` - 自身に関するメタデータを読むために{{< glossary_tooltip text="クラウドプロバイダー" term_id="cloud-provider" >}}と会話する方法
  - `--register-node` - 自身をAPIサーバーに自動的に登録
  - `--register-with-taints` - 与えられた{{< glossary_tooltip text="taint" term_id="taint" >}}のリストでノードを登録します (カンマ区切りの `<key>=<value>:<effect>`)。 
  
  `register-node`がfalseの場合、このオプションは機能しません
  - `--node-ip` - ノードのIPアドレス
  - `--node-labels` - ノードをクラスターに登録するときに追加する{{< glossary_tooltip text="Label" term_id="label" >}}（[NodeRestriction許可プラグイン](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)によって適用されるラベルの制限を参照）
  - `--node-status-update-frequency` - kubeletがノードのステータスをマスターにPOSTする頻度の指定

[ノード認証モード](/docs/reference/access-authn-authz/node/)および[NodeRestriction許可プラグイン](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)が有効になっている場合、kubeletは自分自身のノードリソースを作成/変更することのみ許可されています。

### 手動によるノード管理 {#manual-node-administration}

クラスター管理者は{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}を使用してNodeオブジェクトを作成および変更できます。

管理者が手動でNodeオブジェクトを作成したい場合は、kubeletフラグ `--register-node = false`を設定してください。

管理者は`--register-node`の設定に関係なくNodeオブジェクトを変更することができます。
例えば、ノードにラベルを設定し、それをunschedulableとしてマークすることが含まれます。

ノード上のラベルは、スケジューリングを制御するためにPod上のノードセレクターと組み合わせて使用できます。
例えば、Podをノードのサブセットでのみ実行する資格があるように制限します。

ノードをunschedulableとしてマークすると、新しいPodがそのノードにスケジュールされるのを防ぎますが、ノード上の既存のPodには影響しません。
これは、ノードの再起動などの前の準備ステップとして役立ちます。

ノードにスケジュール不可能のマークを付けるには、次のコマンドを実行します:

```shell
kubectl cordon $ノード名
```

{{< note >}}
{{< glossary_tooltip term_id="daemonset" >}}によって作成されたPodはノード上のunschedulable属性を考慮しません。
これは、再起動の準備中にアプリケーションからアプリケーションが削除されている場合でも、DaemonSetがマシンに属していることを前提としているためです。
{{< /note >}}

## ノードのステータス {#node-status}

ノードのステータスは以下の情報を含みます:

* [Addresses](#addresses)
* [Conditions](#condition)
* [CapacityとAllocatable](#capacity)
* [Info](#info)

`kubectl`を使用し、ノードのステータスや詳細を確認できます:

```shell
kubectl describe node <ノード名をここに挿入>
```

出力情報の各箇所について、以下で説明します。

### Addresses

これらのフィールドの使い方は、お使いのクラウドプロバイダーやベアメタルの設定内容によって異なります。

* HostName: ノードのカーネルによって伝えられたホスト名です。kubeletの`--hostname-override`パラメーターによって上書きすることができます。
* ExternalIP: 通常は、外部にルーティング可能(クラスターの外からアクセス可能)なノードのIPアドレスです。
* InternalIP: 通常は、クラスター内でのみルーティング可能なノードのIPアドレスです。


### Conditions {#condition}

`conditions`フィールドは全ての`Running`なノードのステータスを表します。例として、以下のような状態を含みます:

{{< table caption = "ノードのConditionと、各condition適用時の概要" >}}
| ノードのCondition       | 概要 |
|----------------------|-------------|
| `Ready`              | ノードの状態が有効でPodを配置可能な場合に`True`になります。ノードの状態に問題があり、Podが配置できない場合に`False`になります。ノードコントローラーが、`node-monitor-grace-period`で設定された時間内(デフォルトでは40秒)に該当ノードと疎通できない場合、`Unknown`になります。 |
| `DiskPressure`       | ノードのディスク容量が圧迫されているときに`True`になります。圧迫とは、ディスクの空き容量が少ないことを指します。それ以外のときは`False`です。 |
| `MemoryPressure`     | ノードのメモリが圧迫されているときに`True`になります。圧迫とは、メモリの空き容量が少ないことを指します。それ以外のときは`False`です。 |
| `PIDPressure`        | プロセスが圧迫されているときに`True`になります。圧迫とは、プロセス数が多すぎることを指します。それ以外のときは`False`です。 |
| `NetworkUnavailable` | ノードのネットワークが適切に設定されていない場合に`True`になります。それ以外のときは`False`です。 |
{{< /table >}}

{{< note >}}
コマンドラインを使用してcordonされたNodeを表示する場合、Conditionは`SchedulingDisabled`を含みます。
`SchedulingDisabled`はKubernetesのAPIにおけるConditionではありません;その代わり、cordonされたノードはUnschedulableとしてマークされます。
{{< /note >}}

Nodeの状態は、Nodeリソースの`.status`の一部として表現されます。例えば、正常なノードの場合は以下のようなjson構造が表示されます。

```json
"conditions": [
  {
    "type": "Ready",
    "status": "True",
    "reason": "KubeletReady",
    "message": "kubelet is posting ready status",
    "lastHeartbeatTime": "2019-06-05T18:38:35Z",
    "lastTransitionTime": "2019-06-05T11:41:27Z"
  }
]
```

Ready conditionが`pod-eviction-timeout`({{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}に渡された引数)に設定された時間を超えても`Unknown`や`False`のままになっている場合、該当ノード上にあるPodはノードコントローラーによって削除がスケジュールされます。デフォルトの退役のタイムアウトの時間は**5分**です。ノードが到達不能ないくつかの場合においては、APIサーバーが該当ノードのkubeletと疎通できない状態になっています。その場合、APIサーバーがkubeletと再び通信を確立するまでの間、Podの削除を行うことはできません。削除がスケジュールされるまでの間、削除対象のPodは切り離されたノードの上で稼働を続けることになります。

ノードコントローラーはクラスター内でPodが停止するのを確認するまでは強制的に削除しないようになりました。到達不能なノード上で動いているPodは`Terminating`または`Unknown`のステータスになります。Kubernetesが基盤となるインフラストラクチャーを推定できない場合、クラスター管理者は手動でNodeオブジェクトを削除する必要があります。KubernetesからNodeオブジェクトを削除すると、そのノードで実行されているすべてのPodオブジェクトがAPIサーバーから削除され、それらの名前が解放されます。

ノードのライフサイクルコントローラーがconditionを表した[taint](/ja/docs/concepts/scheduling-eviction/taint-and-toleration/)を自動的に生成します。
スケジューラーがPodをノードに割り当てる際、ノードのtaintを考慮します。Podが許容するtaintは例外です。

詳細は[条件によるtaintの付与](/ja/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)を参照してください。

### CapacityとAllocatable {#capacity}

ノードで利用可能なリソース（CPU、メモリ、およびノードでスケジュールできる最大Pod数）について説明します。

capacityブロック内のフィールドは、ノードが持っているリソースの合計量を示します。
allocatableブロックは、通常のPodによって消費されるノード上のリソースの量を示します。

CapacityとAllocatableについて深く知りたい場合は、ノード上でどのように[コンピュートリソースが予約されるか](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)を読みながら学ぶことができます。

### Info {#info}

カーネルのバージョン、Kubernetesのバージョン（kubeletおよびkube-proxyのバージョン）、（使用されている場合）Dockerのバージョン、OS名など、ノードに関する一般的な情報です。
この情報はノードからkubeletを通じて取得され、Kubernetes APIに公開されます。


## ノードのハートビート {#node-heartbeats}
ハートビートは、Kubernetesノードから送信され、ノードが利用可能か判断するのに役立ちます。
以下の２つのハートビートがあります：
* Nodeの`.status`の更新
* [Lease object](/docs/reference/generated/kubernetes-api/{{< latest-version >}}#lease-v1-coordination-k8s-io)です。
各ノードは`kube-node-lease`という{{< glossary_tooltip term_id="namespace" text="namespace">}}に関連したLeaseオブジェクトを持ちます。
Leaseは軽量なリソースで、クラスターのスケールに応じてノードのハートビートにおけるパフォーマンスを改善します。

kubeletが`NodeStatus`とLeaseオブジェクトの作成および更新を担当します。

- kubeletは、ステータスに変化があったり、設定した間隔の間に更新がない時に`NodeStatus`を更新します。`NodeStatus`更新のデフォルト間隔は５分です。(到達不能の場合のデフォルトタイムアウトである40秒よりもはるかに長いです)
- kubeletは10秒間隔(デフォルトの更新間隔)でLeaseオブジェクトの生成と更新を実施します。Leaseの更新は`NodeStatus`の更新とは独立されて行われます。Leaseの更新が失敗した場合、kubeletは200ミリ秒から始まり7秒を上限とした指数バックオフでリトライします。



## ノードコントローラー {#node-controller}

ノード{{< glossary_tooltip text="コントローラー" term_id="controller" >}}は、ノードのさまざまな側面を管理するKubernetesのコントロールプレーンコンポーネントです。

ノードコントローラーは、ノードの存続期間中に複数の役割を果たします。1つ目は、ノードが登録されたときにCIDRブロックをノードに割り当てることです（CIDR割り当てがオンになっている場合）。

2つ目は、ノードコントローラーの内部ノードリストをクラウドの利用可能なマシンのリストと一致させることです。
クラウド環境で実行している場合、ノードに異常があると、ノードコントローラーはクラウドプロバイダーにそのNodeのVMがまだ使用可能かどうかを問い合わせます。
使用可能でない場合、ノードコントローラーはノードのリストから該当ノードを削除します。

3つ目は、ノードの状態を監視することです。
ノードが到達不能(例えば、ノードがダウンしているなどので理由で、ノードコントローラーがハートビートの受信を停止した場合)になると、ノードコントローラーは、NodeStatusのNodeReady conditionをConditionUnknownに変更する役割があります。その後も該当ノードが到達不能のままであった場合、Graceful Terminationを使って全てのPodを退役させます。デフォルトのタイムアウトは、ConditionUnknownの報告を開始するまで40秒、その後Podの追い出しを開始するまで5分に設定されています。
ノードコントローラーは、`--node-monitor-period`に設定された秒数ごとに各ノードの状態をチェックします。


#### 信頼性 {#rate-limits-on-eviction}

ほとんどの場合、排除の速度は1秒あたり`--node-eviction-rate`に設定された数値（デフォルトは秒間0.1）です。つまり、10秒間に1つ以上のPodをノードから追い出すことはありません。

特定のアベイラビリティーゾーン内のノードのステータスが異常になると、ノード排除の挙動が変わります。ノードコントローラーは、ゾーン内のノードの何%が異常（NodeReady条件がConditionUnknownまたはConditionFalseである）であるかを同時に確認します。
異常なノードの割合が少なくとも `--healthy-zone-threshold`に設定した値を下回る場合（デフォルトは0.55）であれば、退役率は低下します。クラスターが小さい場合（すなわち、 `--large-cluster-size-threshold`の設定値よりもノード数が少ない場合。デフォルトは50）、退役は停止し、そうでない場合、退役率は秒間で`--secondary-node-eviction-rate`の設定値（デフォルトは0.01）に減少します。
これらのポリシーがアベイラビリティーゾーンごとに実装されているのは、1つのアベイラビリティーゾーンがマスターから分割される一方、他のアベイラビリティーゾーンは接続されたままになる可能性があるためです。
クラスターが複数のクラウドプロバイダーのアベイラビリティーゾーンにまたがっていない場合、アベイラビリティーゾーンは1つだけです（クラスター全体）。

ノードを複数のアベイラビリティゾーンに分散させる主な理由は、1つのゾーン全体が停止したときにワークロードを正常なゾーンに移動できることです。
したがって、ゾーン内のすべてのノードが異常である場合、ノードコントローラーは通常のレート `--node-eviction-rate`で退役します。
コーナーケースは、すべてのゾーンが完全にUnhealthyである（すなわち、クラスター内にHealthyなノードがない）場合です。
このような場合、ノードコントローラーはマスター接続に問題があると見なし、接続が回復するまですべての退役を停止します。

ノードコントローラーは、Podがtaintを許容しない場合、 `NoExecute`のtaintを持つノード上で実行されているPodを排除する責務もあります。
さらに、ノードコントローラーはノードに到達できない、または準備ができていないなどのノードの問題に対応する{{< glossary_tooltip text="taint" term_id="taint" >}}を追加する責務があります。これはスケジューラーが、問題のあるノードにPodを配置しない事を意味しています。

### ノードのキャパシティ {#node-capacity}

Nodeオブジェクトはノードのリソースキャパシティ（CPUの数とメモリの量）を監視します。
[自己登録](#self-registration-of-nodes)したノードは、Nodeオブジェクトを作成するときにキャパシティを報告します。
[手動によるノード管理](#manual-node-administration)を実行している場合は、ノードを追加するときにキャパシティを設定する必要があります。

Kubernetes{{< glossary_tooltip text="スケジューラー" term_id="kube-scheduler" >}}は、ノード上のすべてのPodに十分なリソースがあることを確認します。スケジューラーは、ノード上のコンテナが要求するリソースの合計がノードキャパシティ以下であることを確認します。
これは、kubeletによって管理されたすべてのコンテナを含みますが、コンテナランタイムによって直接開始されたコンテナやkubeletの制御外で実行されているプロセスは含みません。

{{< note >}}
Pod以外のプロセス用にリソースを明示的に予約したい場合は、[Systemデーモン用にリソースを予約](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)を参照してください。
{{< /note >}}

## ノードのトポロジー {#node-topology}

{{< feature-state state="alpha" for_k8s_version="v1.16" >}}
`TopologyManager`の[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にすると、
kubeletはリソースの割当を決定する際にトポロジーのヒントを利用できます。
詳細は、[ノードのトポロジー管理ポリシーを制御する](/ja/docs/tasks/administer-cluster/topology-manager/)を参照してください。

## ノードの正常終了 {#graceful-node-shutdown}

{{< feature-state state="beta" for_k8s_version="v1.21" >}}

kubeletは、ノードのシステムシャットダウンを検出すると、ノード上で動作しているPodを終了させます。

Kubelet は、ノードのシャットダウン時に、ポッドが通常の[通常のポッド終了プロセス](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)に従うようにします。

Graceful Node Shutdownはsystemdに依存しているため、[systemd inhibitor locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit/)を
利用してノードのシャットダウンを一定時間遅らせることができます。

Graceful Node Shutdownは、v1.21でデフォルトで有効になっている`GracefulNodeShutdown` [フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)で制御されます。

なお、デフォルトでは、後述の設定オプション`ShutdownGracePeriod`および`ShutdownGracePeriodCriticalPods`の両方がゼロに設定されているため、Graceful node shutdownは有効になりません。この機能を有効にするには、この2つのkubeletの設定を適切に設定し、ゼロ以外の値を設定する必要があります。

Graceful shutdownでは、kubeletは以下の2段階でPodを終了させます。

1. そのノード上で動作している通常のPodを終了させます。
2. そのノード上で動作している[critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)を終了させます。

Graceful Node Shutdownには、2つの[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)オプションを設定します。:
* `ShutdownGracePeriod`:
  *  ノードがシャットダウンを遅らせるべき合計期間を指定します。これは、通常のPodと[critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)の両方のPod終了の合計猶予期間です。
* `ShutdownGracePeriodCriticalPods`:
  * ノードのシャットダウン時に[critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)を終了させるために使用する期間を指定します。この値は、ShutdownGracePeriodよりも小さくする必要があります。

例えば、`ShutdownGracePeriod=30s`、`ShutdownGracePeriodCriticalPods=10s`とすると、
kubeletはノードのシャットダウンを30秒遅らせます。シャットダウンの間、最初の20(30-10)秒は通常のポッドを優雅に終了させるために確保され、
残りの10秒は重要なポッドを終了させるために確保されることになります。

{{< note >}}
Graceful Node Shutdown中にPodが退避された場合、それらのPodの`.status`は`Failed`になります。
`kubectl get pods`を実行すると、退避させられたPodのステータスが `Shutdown` と表示されます。
また、`kubectl describe pod`を実行すると、ノードのシャットダウンのためにPodが退避されたことがわかります。

```
Status:         Failed
Reason:         Shutdown
Message:        Node is shutting, evicting pods
```

失敗したポッドオブジェクトは、明示的に削除されるか、[GCによってクリーンアップ](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)されるまで保存されます。
これは、ノードが突然終了した場合とは異なった振る舞いです。

{{< /note >}}

##  ノードの非正常終了 {#non-graceful-node-shutdown}

{{< feature-state state="beta" for_k8s_version="v1.26" >}}

コマンドがkubeletのinhibitor locksメカニズムをトリガーしない場合や、ShutdownGracePeriodやShutdownGracePeriodCriticalPodsが適切に設定されていないといったユーザーによるミス等が原因で、ノードがシャットダウンしたことをkubeletのNode Shutdownマネージャーが検知できないことがあります。詳細は上記セクション[ノードの正常終了](#graceful-node-shutdown)を参照ください。

ノードのシャットダウンがkubeletのNode Shutdownマネージャーに検知されない場合、StatefulSetを構成するPodはシャットダウン状態のノード上でterminating状態のままになってしまい、他の実行中のノードに移動することができなくなってしまいます。これは、ノードがシャットダウンしているため、その上のkubeletがPodを削除できず、それにより、StatefulSetが新しいPodを同じ名前で作成できなくなってしまうためです。Podがボリュームを使用している場合、VolumeAttachmentsはシャットダウン状態のノードによって削除されないため、Podが使用しているボリュームは他の実行中のノードにアタッチすることができなくなってしまいます。その結果として、StatefulSet上で実行中のアプリケーションは適切に機能しなくなってしまいます。シャットダウンしていたノードが復旧した場合、そのノード上のPodはkubeletに削除され、他の実行中のノード上に作成されます。また、シャットダウン状態のノードが復旧できなかった場合は、そのノード上のPodは永久にterminating状態のままとなります。

上記の状況を脱却するには、ユーザーが手動で`NoExecute`または`NoSchedule` effectを設定して`node.kubernetes.io/out-of-service` taintをノードに付与することで、故障中の状態に設定することができます。`kube-controller-manager` において `NodeOutOfServiceVolumeDetach`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が有効になっており、かつノードがtaintによって故障中としてマークされている場合は、ノードに一致するtolerationがないPodは強制的に削除され、ノード上のterminating状態のPodに対するボリュームデタッチ操作が直ちに実行されます。これにより、故障中のノード上のPodを異なるノード上にすばやく復旧させることが可能になります。

non-graceful shutdownの間に、Podは以下の2段階で終了します:

1. 一致する`out-of-service` tolerationを持たないPodを強制的に削除する。
2. 上記のPodに対して即座にボリュームデタッチ操作を行う。

{{< note >}}
- `node.kubernetes.io/out-of-service` taintを付与する前に、ノードがシャットダウンしているか電源がオフになっていることを確認してください(再起動中ではないこと)。
- Podの別ノードへの移動後、シャットダウンしていたノードが回復した場合は、ユーザーが手動で付与したout-of-service taintをユーザー自ら手動で削除する必要があります。
{{< /note >}}

## スワップメモリの管理 {#swap-memory}

{{< feature-state state="alpha" for_k8s_version="v1.22" >}}

Kubernetes 1.22以前では、ノードはスワップメモリの使用をサポートしておらず、ノード上でスワップが検出された場合、
kubeletはデフォルトで起動に失敗していました。1.22以降では、スワップメモリのサポートをノードごとに有効にすることができます。



ノードでスワップを有効にするには、kubeletの `NodeSwap` [フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にし、
`--fail-swap-on`コマンドラインフラグまたは`failSwapOn`[KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)を false に設定する必要があります。


ユーザーはオプションで、ノードがスワップメモリをどのように使用するかを指定するために、`memorySwap.swapBehavior`を設定することもできます。ノードがスワップメモリをどのように使用するかを指定します。例えば、以下のようになります。

```yaml
memorySwap:
  swapBehavior: LimitedSwap
```

swapBehaviorで使用できる設定オプションは以下の通りです。:
- `LimitedSwap`: Kubernetesのワークロードが、使用できるスワップ量に制限を設けます。Kubernetesが管理していないノード上のワークロードは、依然としてスワップを使用できます。
- `UnlimitedSwap`: Kubernetesのワークロードが使用できるスワップ量に制限を設けません。システムの限界まで、要求されただけのスワップメモリを使用することができます。

`memorySwap`の設定が指定されておらず、[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が有効な場合、デフォルトのkubeletは`LimitedSwap`の設定と同じ動作を適用します。

`LimitedSwap`設定の動作は、ノードがコントロールグループ(「cgroups」とも呼ばれる)のv1とv2のどちらで動作しているかによって異なります。

Kubernetesのワークロードでは、メモリとスワップを組み合わせて使用することができ、ポッドのメモリ制限が設定されている場合はその制限まで使用できます。
- **cgroupsv1:** Kubernetesのワークロードは、メモリとスワップを組み合わせて使用することができ、ポッドのメモリ制限が設定されている場合はその制限まで使用できます。
- **cgroupsv2:** Kubernetesのワークロードは、スワップメモリを使用できません。

詳しくは、[KEP-2400](https://github.com/kubernetes/enhancements/issues/2400)と
[design proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md)をご覧いただき、テストにご協力、ご意見をお聞かせください。


## {{% heading "whatsnext" %}}

* [ノードコンポーネント](/ja/docs/concepts/overview/components/#node-components)について学習する。
* [Node APIオブジェクト](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core)について読む。
* アーキテクチャ設計文書の[Node](https://git.k8s.io/design-proposals-archive/architecture/architecture.md#the-kubernetes-node)という章を読む。
* [TaintとToleration](/ja/docs/concepts/scheduling-eviction/taint-and-toleration/)について読む。
