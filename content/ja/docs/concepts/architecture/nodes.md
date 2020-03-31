---
title: ノード
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

ノードは、以前には `ミニオン` としても知られていた、Kubernetesにおけるワーカーマシンです。1つのノードはクラスターの性質にもよりますが、1つのVMまたは物理的なマシンです。各ノードには[Pod](/ja/docs/concepts/workloads/pods/pod/)を動かすために必要なサービスが含まれており、マスターコンポーネントによって管理されています。ノード上のサービスには[コンテナランタイム](/ja/docs/concepts/overview/components/#container-runtime)、kubelet、kube-proxyが含まれています。詳細については、設計ドキュメントの[Kubernetes Node](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node)セクションをご覧ください。

{{% /capture %}}


{{% capture body %}}

## ノードのステータス

ノードのステータスには以下のような情報が含まれます:

* [Addresses](#addresses)
* [Conditions](#condition)
* [CapacityとAllocatable](#capacity)
* [Info](#info)

ノードのステータスや、ノードに関するその他の詳細は、下記のコマンドを使うことで表示できます:
```shell
kubectl describe node <ノード名>
```
各セクションについては、下記で説明します。

### Addresses

これらのフィールドの使い方は、お使いのクラウドプロバイダーやベアメタルの設定内容によって異なります。

* HostName: ノードのカーネルによって伝えられたホスト名です。kubeletの`--hostname-override`パラメーターによって上書きすることができます。
* ExternalIP: 通常は、外部にルーティング可能(クラスターの外からアクセス可能)なノードのIPアドレスです。
* InternalIP: 通常は、クラスター内でのみルーティング可能なノードのIPアドレスです。


### Conditions {#condition}

`conditions`フィールドは全ての`Running`なノードのステータスを表します。例として、以下のような状態を含みます:

| ノードのCondition | 概要 |
|----------------|-------------|
| `OutOfDisk`    | 新しいPodを追加するために必要なディスク容量が足りない場合に`True`になります。それ以外のときは`False`です。 |
| `Ready`        | ノードの状態がHealthyでPodを配置可能な場合に`True`になります。ノードの状態に問題があり、Podが配置できない場合に`False`になります。ノードコントローラーが、`node-monitor-grace-period`で設定された時間内(デフォルトでは40秒)に該当ノードと疎通できない場合、`Unknown`になります。 |
| `MemoryPressure`    | ノードのメモリが圧迫されているときに`True`になります。圧迫とは、メモリの空き容量が少ないことを指します。それ以外のときは`False`です。 |
| `PIDPressure`    | プロセスが圧迫されているときに`True`になります。圧迫とは、プロセス数が多すぎることを指します。それ以外のときは`False`です。 |
| `DiskPressure`    | ノードのディスク容量が圧迫されているときに`True`になります。圧迫とは、ディスクの空き容量が少ないことを指します。それ以外のときは`False`です。 |
| `NetworkUnavailable`    | ノードのネットワークが適切に設定されていない場合に`True`になります。それ以外のときは`False`です。 |

ノードのConditionはJSONオブジェクトで表現されます。例えば、正常なノードの場合は以下のようなレスポンスが表示されます。

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

Ready conditionが`pod-eviction-timeout`に設定された時間を超えても`Unknown`や`False`のままになっている場合、[kube-controller-manager](/docs/admin/kube-controller-manager/)に引数が渡され、該当ノード上にあるPodはノードコントローラーによって削除がスケジュールされます。デフォルトの退役のタイムアウトの時間は**5分**です。ノードが到達不能ないくつかの場合においては、APIサーバーが該当ノードのkubeletと疎通できない状態になっています。その場合、APIサーバーがkubeletと再び通信を確立するまでの間、Podの削除を行うことはできません。削除がスケジュールされるまでの間、削除対象のPodたちは切り離されたノードの上で稼働を続けることになります。

バージョン1.5よりも前のKubernetesでは、ノードコントローラーはAPIサーバーから到達不能なそれらのPodを[強制削除](/ja/docs/concepts/workloads/pods/pod/#podの強制削除)していました。しかしながら、1.5以降では、ノードコントローラーはクラスター内でPodが停止するのを確認するまでは強制的に削除しないようになりました。到達不能なノード上で動いているPodは`Terminating`または`Unknown`のステータスになります。Kubernetesが基盤となるインフラストラクチャーを推定できない場合、クラスター管理者は手動でNodeオブジェクトを削除する必要があります。KubernetesからNodeオブジェクトを削除すると、そのノードで実行されているすべてのPodオブジェクトがAPIサーバーから削除され、それらの名前が解放されます。

バージョン1.12において、`TaintNodesByCondition`機能がBetaに昇格し、それによってノードのライフサイクルコントローラーがconditionを表した[taint](/docs/concepts/configuration/taint-and-toleration/)を自動的に生成するようになりました。
同様に、スケジューラーがPodを配置するノードを検討する際、ノードのtaintとPodのtolerationsを見るかわりにconditionを無視するようになりました。

ユーザーは、古いスケジューリングモデルか、新しくてより柔軟なスケジューリングモデルのどちらかを選択できるようになりました。
上記のtolerationがないPodは古いスケジュールモデルに従ってスケジュールされます。しかし、特定のノードのtaintを許容するPodについては、条件に合ったノードにスケジュールすることができます。

{{< caution >}}

この機能を有効にすると、conditionが観測されてからtaintが作成されるまでの間にわずかな遅延が発生します。
この遅延は通常1秒未満ですが、正常にスケジュールされているが、kubeletによって配置を拒否されたPodの数が増える可能性があります。

{{< /caution >}}

### CapacityとAllocatable {#capacity}

ノードで利用可能なリソース（CPU、メモリ、およびノードでスケジュールできる最大Pod数）について説明します。

capacityブロック内のフィールドは、ノードが持っているリソースの合計量を示します。
allocatableブロックは、通常のPodによって消費されるノード上のリソースの量を示します。

CapacityとAllocatableについて深く知りたい場合は、ノード上でどのように[コンピュートリソースが予約されるか](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)を読みながら学ぶことができます。

### Info

カーネルのバージョン、Kubernetesのバージョン（kubeletおよびkube-proxyのバージョン）、（使用されている場合）Dockerのバージョン、OS名など、ノードに関する一般的な情報です。
この情報はノードからkubeletを通じて取得されます。

## 管理 {#management}

[Pod](/ja/docs/concepts/workloads/pods/pod/)や[Service](/ja/docs/concepts/services-networking/service/)と違い、ノードは本質的にはKubernetesによって作成されません。GCPのようなクラウドプロバイダーによって外的に作成されるか、VMや物理マシンのプールに存在するものです。そのため、Kubernetesがノードを作成すると、そのノードを表すオブジェクトが作成されます。作成後、Kubernetesはそのノードが有効かどうかを確認します。 たとえば、次の内容からノードを作成しようとしたとします:

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

Kubernetesは内部的にNodeオブジェクトを作成し、 `metadata.name`フィールドに基づくヘルスチェックによってノードを検証します。ノードが有効な場合、つまり必要なサービスがすべて実行されている場合は、Podを実行する資格があります。それ以外の場合、該当ノードが有効になるまではいかなるクラスターの活動に対しても無視されます。

{{< note >}}
Kubernetesは無効なノードのためにオブジェクトを保存し、それをチェックし続けます。
このプロセスを停止するには、Nodeオブジェクトを明示的に削除する必要があります。
{{< /note >}}

現在、Kubernetesのノードインターフェースと相互作用する3つのコンポーネントがあります。ノードコントローラー、kubelet、およびkubectlです。

### ノードコントローラー

ノードコントローラーは、ノードのさまざまな側面を管理するKubernetesのマスターコンポーネントです。

ノードコントローラーは、ノードの存続期間中に複数の役割を果たします。1つ目は、ノードが登録されたときにCIDRブロックをノードに割り当てることです（CIDR割り当てがオンになっている場合）。

2つ目は、ノードコントローラーの内部ノードリストをクラウドの利用可能なマシンのリストと一致させることです。
クラウド環境で実行している場合、ノードに異常があると、ノードコントローラーはクラウドプロバイダーにそのNodeのVMがまだ使用可能かどうかを問い合わせます。
使用可能でない場合、ノードコントローラーはノードのリストから該当ノードを削除します。

3つ目は、ノードの状態を監視することです。
ノードが到達不能(例えば、ノードがダウンしているなどので理由で、ノードコントローラーがハートビートの受信を停止した場合)になると、ノードコントローラーは、NodeStatusのNodeReady conditionをConditionUnknownに変更する役割があります。その後も該当ノードが到達不能のままであった場合、Graceful Terminationを使って全てのPodを退役させます。デフォルトのタイムアウトは、ConditionUnknownの報告を開始するまで40秒、その後Podの追い出しを開始するまで5分に設定されています。
ノードコントローラーは、`--node-monitor-period`に設定された秒数ごとに各ノードの状態をチェックします。

バージョン1.13よりも前のKubernetesにおいて、NodeStatusはノードからのハートビートでした。Kubernetes 1.13から、NodeLeaseがアルファ機能として導入されました（Feature Gate `NodeLease`, [KEP-0009](https://github.com/kubernetes/community/blob/master/keps/sig-node/0009-node-heartbeat.md)）。

NodeLeaseが有効になっている場合、各ノードは `kube-node-lease`というNamespaceに関連付けられた`Lease`オブジェクトを持ち、ノードによって定期的に更新されます。NodeStatusとNodeLeaseの両方がノードからのハートビートとして扱われます。NodeLeaseは頻繁に更新されますが、NodeStatusはノードからマスターへの変更があるか、または十分な時間が経過した場合にのみ報告されます（デフォルトは1分で、到達不能の場合のデフォルトタイムアウトである40秒よりも長いです）。NodeLeaseはNodeStatusよりもはるかに軽量であるため、スケーラビリティとパフォーマンスの両方の観点においてノードのハートビートのコストを下げます。

Kubernetes 1.4では、マスターに問題が発生した場合の対処方法を改善するように、ノードコントローラーのロジックをアップデートしています（マスターのネットワークに問題があるため）
バージョン1.4以降、ノードコントローラーは、Podの退役について決定する際に、クラスター内のすべてのノードの状態を調べます。

ほとんどの場合、排除の速度は1秒あたり`--node-eviction-rate`に設定された数値（デフォルトは秒間0.1）です。つまり、10秒間に1つ以上のPodをノードから追い出すことはありません。

特定のアベイラビリティーゾーン内のノードのステータスが異常になると、ノード排除の挙動が変わります。ノードコントローラーは、ゾーン内のノードの何%が異常（NodeReady条件がConditionUnknownまたはConditionFalseである）であるかを同時に確認します。
異常なノードの割合が少なくとも `--healthy-zone-threshold`に設定した値を下回る場合（デフォルトは0.55）であれば、退役率は低下します。クラスターが小さい場合（すなわち、 `--large-cluster-size-threshold`の設定値よりもノード数が少ない場合。デフォルトは50）、退役は停止し、そうでない場合、退役率は秒間で`--secondary-node-eviction-rate`の設定値（デフォルトは0.01）に減少します。
これらのポリシーがアベイラビリティーゾーンごとに実装されているのは、1つのアベイラビリティーゾーンがマスターから分割される一方、他のアベイラビリティーゾーンは接続されたままになる可能性があるためです。
クラスターが複数のクラウドプロバイダーのアベイラビリティーゾーンにまたがっていない場合、アベイラビリティーゾーンは1つだけです（クラスター全体）。

ノードを複数のアベイラビリティゾーンに分散させる主な理由は、1つのゾーン全体が停止したときにワークロードを正常なゾーンに移動できることです。
したがって、ゾーン内のすべてのノードが異常である場合、ノードコントローラーは通常のレート `--node-eviction-rate`で退役します。
コーナーケースは、すべてのゾーンが完全にUnhealthyである（すなわち、クラスタ内にHealthyなノードがない）場合です。
このような場合、ノードコントローラーはマスター接続に問題があると見なし、接続が回復するまですべての退役を停止します。

Kubernetes 1.6以降では、ノードコントローラーは、Podがtaintを許容しない場合、 `NoExecute`のtaintを持つノード上で実行されているPodを排除する責務もあります。
さらに、デフォルトで無効になっているアルファ機能として、ノードコントローラーはノードに到達できない、または準備ができていないなどのノードの問題に対応するtaintを追加する責務があります。
`NoExecute`のtaint及び上述のアルファ機能に関する詳細は、[こちらのドキュメント](/docs/concepts/configuration/taint-and-toleration/)をご覧ください。

バージョン1.8以降、ノードコントローラーに対してノードの状態を表すtaintを作成する責務を持たせることができます。これはバージョン1.8のアルファ機能です。

### ノードの自己登録

kubeletのフラグ `--register-node`がtrue（デフォルト）のとき、kubeletは自分自身をAPIサーバーに登録しようとします。これはほとんどのディストリビューションで使用されている推奨パターンです。

自己登録については、kubeletは以下のオプションを伴って起動されます:

  - `--kubeconfig` - 自分自身をAPIサーバーに対して認証するための資格情報へのパス
  - `--cloud-provider` - 自身に関するメタデータを読むためにクラウドプロバイダーと会話する方法
  - `--register-node` - 自身をAPIサーバーに自動的に登録
  - `--register-with-taints` - 与えられたtaintのリストでノードを登録します (カンマ区切りの `<key>=<value>:<effect>`). `register-node`がfalseの場合、このオプションは機能しません
  - `--node-ip` - ノードのIPアドレス
  - `--node-labels` - ノードをクラスターに登録するときに追加するラベル（1.13以降の[NodeRestriction許可プラグイン](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)によって適用されるラベルの制限を参照）
  - `--node-status-update-frequency` - kubeletがノードのステータスをマスターにPOSTする頻度の指定

[ノード認証モード](/docs/reference/access-authn-authz/node/)および[NodeRestriction許可プラグイン](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)が有効になっている場合、kubeletは自分自身のノードリソースを作成/変更することのみ許可されています。

#### 手動によるノード管理 {#manual-node-administration}

クラスター管理者はNodeオブジェクトを作成および変更できます。

管理者が手動でNodeオブジェクトを作成したい場合は、kubeletフラグ `--register-node = false`を設定してください。

管理者は`--register-node`の設定に関係なくNodeリソースを変更することができます。
変更には、ノードにラベルを設定し、それをunschedulableとしてマークすることが含まれます。

ノード上のラベルは、スケジューリングを制御するためにPod上のノードセレクタと組み合わせて使用できます。
例えば、Podをノードのサブセットでのみ実行する資格があるように制限します。

ノードをunschedulableとしてマークすると、新しいPodがそのノードにスケジュールされるのを防ぎますが、ノード上の既存のPodには影響しません。
これは、ノードの再起動などの前の準備ステップとして役立ちます。たとえば、ノードにスケジュール不可能のマークを付けるには、次のコマンドを実行します:

```shell
kubectl cordon $ノード名
```

{{< note >}}
DaemonSetコントローラーによって作成されたPodはKubernetesスケジューラーをバイパスし、ノード上のunschedulable属性を考慮しません。
これは、再起動の準備中にアプリケーションからアプリケーションが削除されている場合でも、デーモンがマシンに属していることを前提としているためです。
{{< /note >}}

### ノードのキャパシティ

ノードのキャパシティ（CPUの数とメモリの量）はNodeオブジェクトの一部です。
通常、ノードは自分自身を登録し、Nodeオブジェクトを作成するときにキャパシティを報告します。
[手動によるノード管理](#manual-node-administration)を実行している場合は、ノードを追加するときにキャパシティを設定する必要があります。

Kubernetesスケジューラーは、ノード上のすべてのPodに十分なリソースがあることを確認します。
ノード上のコンテナが要求するリソースの合計がノードキャパシティ以下であることを確認します。
これは、kubeletによって開始されたすべてのコンテナを含みますが、[コンテナランタイム](/ja/docs/concepts/overview/components/#container-runtime)によって直接開始されたコンテナやコンテナの外で実行されているプロセスは含みません。

Pod以外のプロセス用にリソースを明示的に予約したい場合は、このチュートリアルに従って[Systemデーモン用にリソースを予約](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)してください。


## APIオブジェクト

NodeはKubernetesのREST APIにおけるトップレベルのリソースです。APIオブジェクトに関する詳細は以下の記事にてご覧いただけます:
[Node APIオブジェクト](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).

{{% /capture %}}
