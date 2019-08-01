---
title: Nodes
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

Ready conditionが`pod-eviction-timeout`に設定された時間を超えても`Unknown`や`False`のままになっている場合、[kube-controller-manager](/docs/admin/kube-controller-manager/)に引数が渡され、該当Node上にあるPodはNodeコントローラーによって削除がスケジュールされます。デフォルトのevictionタイムアウトの時間は**5分**です。Nodeが到達不能ないくつかの場合においては、APIサーバーが該当Nodeのkubeletと疎通できない状態になっています。その場合、APIサーバーがkubeletと再び通信を確立するまでの間、Podの削除を行うことはできません。削除がスケジュールされるまでの間、削除対象のPodたちは切り離されたNodeの上で稼働を続けることになります。

バージョン1.5よりも前のKubernetesでは、NodeコントローラーはAPIサーバーから到達不能なそれらのPodを[強制削除](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods)していました。しかしながら、1.5以降では、Nodeコントローラーはクラスター内でPodが停止するのを確認するまでは強制的に削除しないようになりました。到達不能なNode上で動いているPodは`Terminating`または`Unknown`のステータスになります。Kubernetesが基盤となるインフラストラクチャーを推定できない場合、クラスター管理者は手動でNodeオブジェクトを削除する必要があります。KubernetesからNodeオブジェクトを削除すると、そのNodeで実行されているすべてのPodオブジェクトがAPIサーバーから削除され、それらの名前が解放されます。

バージョン1.12において、`TaintNodesByCondition`機能がBetaに昇格し、それによってNodeのライフサイクルコントローラーがconditionを表した[taint](/docs/concepts/configuration/taint-and-toleration/)を自動的に生成するようになりました。
同様に、スケジューラがPodを配置するNodeを検討する際、NodeのtaintとPodのtolerationsを見るかわりにconditionを無視するようになりました。

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

[Pod](/docs/concepts/workloads/pods/pod/)や[Service](/docs/concepts/services-networking/service/)と違い、Nodeは本質的にはKubernetesによって作成されません。GCPのようなクラウドプロバイダーによって外的に作成されるか、VMや物理マシンのプールに存在するものです。そのため、KubernetesがNodeを作成すると、そのNodeを表すオブジェクトが作成されます。作成後、KubernetesはそのNodeが有効かどうかを確認します。 たとえば、次の内容からノードを作成しようとしたとします:

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

Kubernetesは内部的にNodeオブジェクトを作成し、 `metadata.name`フィールドに基づくヘルスチェックによってNodeを検証します。Nodeが有効な場合、つまり必要なサービスがすべて実行されている場合は、Podを実行する資格があります。それ以外の場合、該当ノードが有効になるまではいかなるクラスターの活動に対しても無視されます。

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

In versions of Kubernetes prior to 1.13, NodeStatus is the heartbeat from the
node. Starting from Kubernetes 1.13, node lease feature is introduced as an
alpha feature (feature gate `NodeLease`,
[KEP-0009](https://github.com/kubernetes/community/blob/master/keps/sig-node/0009-node-heartbeat.md)).
When node lease feature is enabled, each node has an associated `Lease` object in
`kube-node-lease` namespace that is renewed by the node periodically, and both
NodeStatus and node lease are treated as heartbeats from the node. Node leases
are renewed frequently while NodeStatus is reported from node to master only
when there is some change or enough time has passed (default is 1 minute, which
is longer than the default timeout of 40 seconds for unreachable nodes). Since
node lease is much more lightweight than NodeStatus, this feature makes node
heartbeat significantly cheaper from both scalability and performance
perspectives.

In Kubernetes 1.4, we updated the logic of the node controller to better handle
cases when a large number of nodes have problems with reaching the master
(e.g. because the master has networking problem). Starting with 1.4, the node
controller looks at the state of all nodes in the cluster when making a
decision about pod eviction.

In most cases, node controller limits the eviction rate to
`--node-eviction-rate` (default 0.1) per second, meaning it won't evict pods
from more than 1 node per 10 seconds.

The node eviction behavior changes when a node in a given availability zone
becomes unhealthy. The node controller checks what percentage of nodes in the zone
are unhealthy (NodeReady condition is ConditionUnknown or ConditionFalse) at
the same time. If the fraction of unhealthy nodes is at least
`--unhealthy-zone-threshold` (default 0.55) then the eviction rate is reduced:
if the cluster is small (i.e. has less than or equal to
`--large-cluster-size-threshold` nodes - default 50) then evictions are
stopped, otherwise the eviction rate is reduced to
`--secondary-node-eviction-rate` (default 0.01) per second. The reason these
policies are implemented per availability zone is because one availability zone
might become partitioned from the master while the others remain connected. If
your cluster does not span multiple cloud provider availability zones, then
there is only one availability zone (the whole cluster).

A key reason for spreading your nodes across availability zones is so that the
workload can be shifted to healthy zones when one entire zone goes down.
Therefore, if all nodes in a zone are unhealthy then node controller evicts at
the normal rate `--node-eviction-rate`.  The corner case is when all zones are
completely unhealthy (i.e. there are no healthy nodes in the cluster). In such
case, the node controller assumes that there's some problem with master
connectivity and stops all evictions until some connectivity is restored.

Starting in Kubernetes 1.6, the NodeController is also responsible for evicting
pods that are running on nodes with `NoExecute` taints, when the pods do not tolerate
the taints. Additionally, as an alpha feature that is disabled by default, the
NodeController is responsible for adding taints corresponding to node problems like
node unreachable or not ready. See [this documentation](/docs/concepts/configuration/taint-and-toleration/)
for details about `NoExecute` taints and the alpha feature.

Starting in version 1.8, the node controller can be made responsible for creating taints that represent
Node conditions. This is an alpha feature of version 1.8.

### Self-Registration of Nodes

When the kubelet flag `--register-node` is true (the default), the kubelet will attempt to
register itself with the API server.  This is the preferred pattern, used by most distros.

For self-registration, the kubelet is started with the following options:

  - `--kubeconfig` - Path to credentials to authenticate itself to the apiserver.
  - `--cloud-provider` - How to talk to a cloud provider to read metadata about itself.
  - `--register-node` - Automatically register with the API server.
  - `--register-with-taints` - Register the node with the given list of taints (comma separated `<key>=<value>:<effect>`). No-op if `register-node` is false.
  - `--node-ip` - IP address of the node.
  - `--node-labels` - Labels to add when registering the node in the cluster (see label restrictions enforced by the [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) in 1.13+).
  - `--node-status-update-frequency` - Specifies how often kubelet posts node status to master.

When the [Node authorization mode](/docs/reference/access-authn-authz/node/) and
[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) are enabled,
kubelets are only authorized to create/modify their own Node resource.

#### Manual Node Administration

A cluster administrator can create and modify node objects.

If the administrator wishes to create node objects manually, set the kubelet flag
`--register-node=false`.

The administrator can modify node resources (regardless of the setting of `--register-node`).
Modifications include setting labels on the node and marking it unschedulable.

Labels on nodes can be used in conjunction with node selectors on pods to control scheduling,
e.g. to constrain a pod to only be eligible to run on a subset of the nodes.

Marking a node as unschedulable prevents new pods from being scheduled to that
node, but does not affect any existing pods on the node. This is useful as a
preparatory step before a node reboot, etc. For example, to mark a node
unschedulable, run this command:

```shell
kubectl cordon $NODENAME
```

{{< note >}}
Pods created by a DaemonSet controller bypass the Kubernetes scheduler
and do not respect the unschedulable attribute on a node. This assumes that daemons belong on
the machine even if it is being drained of applications while it prepares for a reboot.
{{< /note >}}

### Node capacity

The capacity of the node (number of cpus and amount of memory) is part of the node object.
Normally, nodes register themselves and report their capacity when creating the node object. If
you are doing [manual node administration](#manual-node-administration), then you need to set node
capacity when adding a node.

The Kubernetes scheduler ensures that there are enough resources for all the pods on a node.  It
checks that the sum of the requests of containers on the node is no greater than the node capacity.  It
includes all containers started by the kubelet, but not containers started directly by the [container runtime](/docs/concepts/overview/components/#node-components) nor any process running outside of the containers.

If you want to explicitly reserve resources for non-Pod processes, follow this tutorial to
[reserve resources for system daemons](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved).


## API Object

Node is a top-level resource in the Kubernetes REST API. More details about the
API object can be found at:
[Node API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).

{{% /capture %}}
