---
title: Node
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

Nodeは、以前には `ミニオン` としても知られていた、Kubernetesにおけるワーカーマシンです。1つのNodeはクラスターの性質にもよりますが、1つのVMまたは物理的なマシンです。各Nodeには[Pod](/docs/concepts/workloads/pods/pod/)を動かすために必要なサービスが含まれており、マスターコンポーネントによって管理されています。Node上のサービスには[コンテナランタイム](/docs/concepts/overview/components/#node-components)、kubelet、kube-proxyが含まれています。詳細については、設計ドキュメントの[Kubernetes Node](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node)セクションをご覧ください。

{{% /capture %}}


{{% capture body %}}

## Nodeのステータス

Nodeのステータスには以下のような情報が含まれます:

* [Addresses](#addresses)
* [Conditions](#condition)
* [CapacityとAllocatable](#capacity)
* [Info](#info)

Nodeのステータスや、Nodeに関するその他の詳細は、下記のコマンドを使うことで表示できます:
```shell
kubectl describe node <insert-node-name-here>
```
各セクションについては、下記で説明します。

### Addresses

これらのフィールドの使い方は、お使いのクラウドプロバイダーやベアメタルの設定内容によって異なります。

* HostName: Nodeのカーネルによって伝えられたホスト名ですkubeletの`--hostname-override`パラメータによって上書きすることができます。
* ExternalIP: 通常は、外部にルーティング可能(クラスターの外からアクセス可能)なNodeのIPアドレスです。
* InternalIP: 通常は、クラスター内でのみルーティング可能なNodeのIPアドレスです。


### Conditions {#condition}

`conditions`フィールドは全ての`Running`なNodeのステータスを表します。例として、以下のような状態を含みます:

| Node Condition | Description |
|----------------|-------------|
| `OutOfDisk`    | 新しいPodを追加するために必要なディスク容量が足りない場合に`True`になります。それ以外のときは`False`です。 |
| `Ready`        | Nodeの状態が健康でPodを配置可能な場合に`True`になります。Nodeの状態に問題があり、Podが配置できない場合に`False`になります。Nodeコントローラーが、`node-monitor-grace-period`で設定された時間内(デフォルトでは40秒)に該当Nodeと疎通できない場合、`Unknown`になります。 |
| `MemoryPressure`    | Nodeのメモリが圧迫されているときに`True`になります。圧迫とは、メモリの空き容量が少ないことを指します。それ以外のときは`False`です。 |
| `PIDPressure`    | プロセスが圧迫されているときに`True`になります。圧迫とは、プロセス数が多すぎることを指します。それ以外のときは`False`です。 |
| `DiskPressure`    | Nodeのディスク容量がが圧迫されているときに`True`になります。圧迫とは、ディスクの空き容量が少ないことを指します。それ以外のときは`False`です。 |
| `NetworkUnavailable`    | Nodeのネットワークが適切に設定されていない場合に`True`になります。それ以外のときは`False`です。 |

NodeのconditionはJSONオブジェクトで表現されます。例えば、健康なNodeの場合は以下のようなレスポンスが表示されます。

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

Ready conditionが`pod-eviction-timeout`に設定された時間を超えても`Unknown`や`False`のままになっている場合、[kube-controller-manager](/docs/admin/kube-controller-manager/)に引数が渡され、該当Node上にあるPodはNodeコントローラーによって削除がスケジュールされます。デフォルトの退役のタイムアウトの時間は**5分**です。Nodeが到達不能ないくつかの場合においては、APIサーバーが該当Nodeのkubeletと疎通できない状態になっています。その場合、APIサーバーがkubeletと再び通信を確立するまでの間、Podの削除を行うことはできません。削除がスケジュールされるまでの間、削除対象のPodたちは切り離されたNodeの上で稼働を続けることになります。

バージョン1.5よりも前のKubernetesでは、NodeコントローラーはAPIサーバーから到達不能なそれらのPodを[強制削除](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods)していました。しかしながら、1.5以降では、Nodeコントローラーはクラスター内でPodが停止するのを確認するまでは強制的に削除しないようになりました。到達不能なNode上で動いているPodは`Terminating`または`Unknown`のステータスになります。Kubernetesが基盤となるインフラストラクチャーを推定できない場合、クラスター管理者は手動でNodeオブジェクトを削除する必要があります。KubernetesからNodeオブジェクトを削除すると、そのNodeで実行されているすべてのPodオブジェクトがAPIサーバーから削除され、それらの名前が解放されます。

バージョン1.12において、`TaintNodesByCondition`機能がBetaに昇格し、それによってNodeのライフサイクルコントローラーがconditionを表した[taint](/docs/concepts/configuration/taint-and-toleration/)を自動的に生成するようになりました。
同様に、スケジューラーがPodを配置するNodeを検討する際、NodeのtaintとPodのtolerationsを見るかわりにconditionを無視するようになりました。

ユーザーは、古いスケジューリングモデルと新しく、より柔軟なスケジューリングモデルのどちらかを選択できるようになりました。
上記のtolerationがないPodは古いスケジュールモデルに従ってスケジュールされます。しかし、特定のNodeのtaintを許容するPodについては、条件に合ったNodeにスケジュールすることができます。

{{< caution >}}

この機能を有効にすると、conditionが観測されてからtaintが作成されるまでの間にわずかな遅延が発生します。
この遅延は通常1秒未満ですが、正常にスケジュールされているが、kubeletによって配置を拒否されたPodの数が増える可能性があります。

{{< /caution >}}

### CapacityとAllocatable {#capacity}

Nodeで利用可能なリソース（CPU、メモリ、およびNodeでスケジュールできる最大Pod数）について説明します。

capacityブロック内のフィールドは、Nodeが持っているリソースの合計量を示します。
allocatableブロックは、通常のPodによって消費されるNode上のリソースの量を示します。

CapacityとAllocatableについて深く知りたい場合は、Node上でどのように[コンピュートリソースが予約されるか](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)を読みながら学ぶことができます。

### Info

カーネルのバージョン、Kubernetesのバージョン（kubeletおよびkube-proxyのバージョン）、（使用されている場合）Dockerのバージョン、OS名など、Nodeに関する一般的な情報です。
この情報はNodeからkubeletを通じて取得されます。

## Management

[Pod](/docs/concepts/workloads/pods/pod/)や[Service](/docs/concepts/services-networking/service/)と違い、Nodeは本質的にはKubernetesによって作成されません。GCPのようなクラウドプロバイダーによって外的に作成されるか、VMや物理マシンのプールに存在するものです。そのため、KubernetesがNodeを作成すると、そのNodeを表すオブジェクトが作成されます。作成後、KubernetesはそのNodeが有効かどうかを確認します。 たとえば、次の内容からNodeを作成しようとしたとします:

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

Kubernetesは内部的にNodeオブジェクトを作成し、 `metadata.name`フィールドに基づくヘルスチェックによってNodeを検証します。Nodeが有効な場合、つまり必要なサービスがすべて実行されている場合は、Podを実行する資格があります。それ以外の場合、該当Nodeが有効になるまではいかなるクラスターの活動に対しても無視されます。

{{< note >}}
Kubernetesは無効なNodeのためにオブジェクトを保存し、それをチェックし続けます。
このプロセスを停止するには、Nodeオブジェクトを明示的に削除する必要があります。
{{< /note >}}

現在、KubernetesのNodeインタフェースと相互作用する3つのコンポーネントがあります。Nodeコントローラ、kubelet、およびkubectlです。

### Nodeコントローラー

Nodeコントローラは、Nodeのさまざまな側面を管理するKubernetesのマスターコンポーネントです。

Nodeコントローラは、Nodeの存続期間中に複数の役割を果たします。1つ目は、Nodeが登録されたときにCIDRブロックをNodeに割り当てることです（CIDR割り当てがオンになっている場合）。

2つ目は、Nodeコントローラの内部Nodeリストをクラウドの利用可能なマシンのリストと一致させることです。
クラウド環境で実行している場合、Nodeに異常があると、NodeコントローラはクラウドプロバイダにそのNodeのVMがまだ使用可能かどうかを問い合わせます。
使用可能でない場合、NodeコントローラはNodeのリストから該当Nodeを削除します。

3つ目は、Nodeの状態を監視することです。
Nodeが到達不能(例えば、NodeコントローラーがNodeがダウンしているなどので理由でハートビートの受信を停止した場合)になると、Nodeコントローラーは、NodeStatusのNodeReady conditionをConditionUnknownに変更する役割があります。その後も該当Nodeが到達不能のままであった場合、Graceful Terminationを使って全てのPodを退役させます。デフォルトのタイムアウトは、ConditionUnknownの報告を開始するまで40秒、その後Podの追い出しを開始するまで5分に設定されています。
Nodeコントローラは、`--node-monitor-period`に設定された秒数ごとに各Nodeの状態をチェックします。

バージョン1.13よりも前のKubernetesにおいて、NodeStatusはNodeからのハートビートでした。Kubernetes 1.13から、NodeLeaseがアルファ機能として導入されました（Feature Gate `NodeLease`, [KEP-0009](https://github.com/kubernetes/community/blob/master/keps/sig-node/0009-node-heartbeat.md)）。

NodeLeaseが有効になっている場合、各Nodeは `kube-node-lease`ネームスペースに関連付けられた`Lease`オブジェクトを持ち、Nodeによって定期的に更新されます。NodeStatusとNodeLeaseの両方がNodeからのハートビートとして扱われます。NodeLeaseは頻繁に更新されますが、NodeStatusはNodeからマスターへの変更があるか、または十分な時間が経過した場合にのみ報告されます（デフォルトは1分で、到達不能の場合のデフォルトタイムアウトである40秒よりも長いです）。NodeLeaseはNodeStatusよりもはるかに軽量であるため、スケーラビリティとパフォーマンスの両方の観点においてNodeのハートビートのコストを下げます。

Kubernetes 1.4では、マスターに問題が発生した場合の対処方法を改善するように、Nodeコントローラのロジックをアップデートしています（マスターがネットワークに問題があるため）
バージョン1.4以降、Nodeコントローラは、Podの退役について決定する際に、クラスタ内のすべてのNodeの状態を調べます。

ほとんどの場合、排除の速度は1秒あたり`--node-eviction-rate`に設定された数値（デフォルトは秒間0.1）です。つまり、10秒間に1つ以上のPodをNodeから追い出すことはありません。

特定のアベイラビリティーゾーン内のNodeのステータスが異常になると、Node排除の挙動が変わります。Nodeコントローラは、ゾーン内のNodeの何%が異常（NodeReady条件がConditionUnknownまたはConditionFalseである）であるかを同時に確認します。
異常なNodeの割合が少なくとも `--healthy-zone-threshold`に設定した値を下回る場合（デフォルトは0.55）であれば、退役率は低下します。クラスタが小さい場合（すなわち、 `--large-cluster-size-threshold`の設定値よりもNode数が少ない場合。デフォルトは50）、退役は停止し、そうでない場合、退役率は秒間で`--secondary-node-eviction-rate`の設定値（デフォルトは0.01）に減少します。
これらのポリシーがアベイラビリティーゾーンごとに実装されているのは、1つのアベイラビリティーゾーンがマスターから分割される一方、他のアベイラビリティーゾーンは接続されたままになる可能性があるためです。
クラスターが複数のクラウドプロバイダーのアベイラビリティーゾーンにまたがっていない場合、アベイラビリティーゾーンは1つだけです（クラスター全体）。

Nodeを複数のアベイラビリティゾーンに分散させる主な理由は、1つのゾーン全体が停止したときにワークロードを正常なゾーンに移動できることです。
したがって、ゾーン内のすべてのNodeが異常である場合、Nodeコントローラは通常のレート `--node-eviction-rate`で退役します。
コーナーケースは、すべてのゾーンが完全に不健康である（すなわち、クラスタ内に健全なNodeがない）場合です。
このような場合、Nodeコントローラはマスター接続に問題があると見なし、接続が回復するまですべての退役を停止します。

Kubernetes 1.6以降では、Nodeコントローラーは、Podがtaintを許容しない場合、 `NoExecute`のtaintを持つNode上で実行されているPodを排除する責務もあります。
さらに、デフォルトで無効になっているアルファ機能として、NodeコントローラーはNodeに到達できない、または準備ができていないなどのNodeの問題に対応するtaintを追加する責務があります。
`NoExecute`のtaint及び上述のアルファ機能に関する詳細は、[こちらのドキュメント](/docs/concepts/configuration/taint-and-toleration/)をご覧ください。

バージョン1.8以降、Nodeコントローラに対してNodeの状態を表すtaintを作成する責務を持たせることができます。これはバージョン1.8のアルファ機能です。

### Nodeの自己登録

kubeletのフラグ `--register-node`がtrue（デフォルト）のとき、kubeletは自分自身をAPIサーバーに登録しようとします。これはほとんどのディストリビューションで使用されている推奨パターンです。

自己登録については、kubeletは以下のオプションを伴って起動されます:

  - `--kubeconfig` - 自分自身をAPIサーバーに対して認証するための資格情報へのパス
  - `--cloud-provider` - 自身に関するメタデータを読むためにクラウドプロバイダーと会話する方法
  - `--register-node` - 自身をAPIサーバーに自動的に登録
  - `--register-with-taints` - 与えられたtaintのリストでNodeを登録します (カンマ区切りの `<key>=<value>:<effect>`). `register-node`がfalseの場合、このオプションは機能しません
  - `--node-ip` - NodeのIPアドレス
  - `--node-labels` - Nodeをクラスターに登録するときに追加するラベル（1.13以降の[NodeRestriction許可プラグイン](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)によって適用されるラベルの制限を参照）
  - `--node-status-update-frequency` - kubeletがNodeのステータスをマスターにPOSTする頻度の指定

[Node認証モード](/docs/reference/access-authn-authz/node/)および[NodeRestriction許可プラグイン]/docs/reference/access-authn-authz/admission-controllers/#noderestriction)が有効になっている場合、kubeletは自分自身のNodeリソースを作成/変更することのみ許可されています。

#### 手動によるNode管理 {#manual-node-administration}

クラスター管理者はNodeオブジェクトを作成および変更できます。

管理者が手動でNodeオブジェクトを作成したい場合は、kubeletフラグ `--register-node = false`を設定してください。

管理者は`--register-node`の設定に関係なくNodeリソースを変更することができます。
変更には、Nodeにラベルを設定し、それをunschedulableとしてマークすることが含まれます。

Node上のラベルは、スケジューリングを制御するためにPod上のNodeセレクタと組み合わせて使用できます。
例えば、PodをNodeのサブセットでのみ実行する資格があるように制限します。

Nodeをunschedulableとしてマークすると、新しいPodがそのNodeにスケジュールされるのを防ぎますが、Node上の既存のPodには影響しません。
これは、Nodeの再起動などの前の準備ステップとして役立ちます。たとえば、Nodeにスケジュール不可能のマークを付けるには、次のコマンドを実行します:

```shell
kubectl cordon $NODENAME
```

{{< note >}}
DaemonSetコントローラーによって作成されたPodはKubernetesスケジューラーをバイパスし、Node上のunschedulable属性を考慮しません。
これは、再起動の準備中にアプリケーションからアプリケーションが削除されている場合でも、デーモンがマシンに属していることを前提としているためです。
{{< /note >}}

### Nodeのキャパシティ

Nodeのキャパシティ（CPUの数とメモリの量）はNodeオブジェクトの一部です。
通常、Nodeは自分自身を登録し、Nodeオブジェクトを作成するときにキャパシティを報告します。
[手動によるNode管理](#manual-node-administration)を実行している場合は、Nodeを追加するときにキャパシティを設定する必要があります。

Kubernetesスケジューラーは、Node上のすべてのPodに十分なリソースがあることを確認します。
Node上のコンテナが要求するリソースの合計がNodeキャパシティ以下であることを確認します。
これは、kubeletによって開始されたすべてのコンテナを含みますが、[コンテナランタイム](/docs/concepts/overview/components/#node-components)によって直接開始されたコンテナやコンテナの外で実行されているプロセスは含みません。

Pod以外のプロセス用にリソースを明示的に予約したい場合は、このチュートリアルに従って[Systemデーモン用にリソースを予約](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)してください。


## APIオブジェクト

NodeはKubernetesのREST APIにおけるトップレベルのリソースです。APIオブジェクトに関する詳細は以下の記事にてご覧いただけます:
[Node APIオブジェクト](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).

{{% /capture %}}
