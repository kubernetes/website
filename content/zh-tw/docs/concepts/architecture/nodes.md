---
title: 節點
content_type: concept
weight: 10
---
<!--
reviewers:
- caesarxuchao
- dchen1107
title: Nodes
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
Kubernetes runs your workload by placing containers into Pods to run on _Nodes_.
A node may be a virtual or physical machine, depending on the cluster. Each node
is managed by the 
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
and contains the services necessary to run
{{< glossary_tooltip text="Pods" term_id="pod" >}}.

Typically you have several nodes in a cluster; in a learning or resource-limited
environment, you might have just one.

The [components](/docs/concepts/overview/components/#node-components) on a node include the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, a
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, and the
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}.
-->
Kubernetes 透過將容器放入在節點（Node）上執行的 Pod 中來執行你的工作負載。
節點可以是一個虛擬機器或者物理機器，取決於所在的叢集配置。
每個節點包含執行 {{< glossary_tooltip text="Pods" term_id="pod" >}} 所需的服務；
這些節點由 {{< glossary_tooltip text="控制面" term_id="control-plane" >}} 負責管理。

通常叢集中會有若干個節點；而在一個學習用或者資源受限的環境中，你的叢集中也可能
只有一個節點。

節點上的[元件](/zh-cn/docs/concepts/overview/components/#node-components)包括
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}、
{{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}以及
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}。

<!-- body -->
<!--
## Management

There are two main ways to have Nodes added to the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}:

1. The kubelet on a node self-registers to the control plane
2. You, or another human user, manually add a Node object

After you create a Node {{< glossary_tooltip text="object" term_id="object" >}},
or the kubelet on a node self-registers, the control plane checks whether the new Node object is
valid. For example, if you try to create a Node from the following JSON manifest:
-->
## 管理  {#management}

向 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}新增節點的方式主要有兩種：

1. 節點上的 `kubelet` 向控制面執行自注冊；
2. 你，或者別的什麼人，手動新增一個 Node 物件。

在你建立了 Node {{< glossary_tooltip text="物件" term_id="object" >}}或者節點上的
`kubelet` 執行了自注冊操作之後，控制面會檢查新的 Node 物件是否合法。
例如，如果你嘗試使用下面的 JSON 物件來建立 Node 物件：

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

<!--
Kubernetes creates a Node object internally (the representation). Kubernetes checks
that a kubelet has registered to the API server that matches the `metadata.name`
field of the Node. If the node is healthy (if all necessary services are running),
it is eligible to run a Pod. Otherwise, that node is ignored for any cluster activity
until it becomes healthy.
-->
Kubernetes 會在內部建立一個 Node 物件作為節點的表示。Kubernetes 檢查 `kubelet`
向 API 伺服器註冊節點時使用的 `metadata.name` 欄位是否匹配。
如果節點是健康的（即所有必要的服務都在執行中），則該節點可以用來執行 Pod。
否則，直到該節點變為健康之前，所有的叢集活動都會忽略該節點。 

{{< note >}}
<!--
Kubernetes keeps the object for the invalid Node and continues checking to see whether
it becomes healthy.

You, or a {{< glossary_tooltip term_id="controller" text="controller">}}, must explicitly
delete the Node object to stop that health checking.
-->
Kubernetes 會一直儲存著非法節點對應的物件，並持續檢查該節點是否已經變得健康。
你，或者某個{{< glossary_tooltip term_id="controller" text="控制器">}}必須顯式地刪除該
Node 物件以停止健康檢查操作。
{{< /note >}}

<!--
The name of a Node object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
Node 物件的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
### Node name uniqueness

The [name](/docs/concepts/overview/working-with-objects/names#names) identifies a Node. Two Nodes
cannot have the same name at the same time. Kubernetes also assumes that a resource with the same
name is the same object. In case of a Node, it is implicitly assumed that an instance using the
same name will have the same state (e.g. network settings, root disk contents)
and attributes like node labels. This may lead to
inconsistencies if an instance was modified without changing its name. If the Node needs to be
replaced or updated significantly, the existing Node object needs to be removed from API server
first and re-added after the update.
-->
### 節點名稱唯一性     {#node-name-uniqueness}

節點的[名稱](/zh-cn/docs/concepts/overview/working-with-objects/names#names)用來標識 Node 物件。
沒有兩個 Node 可以同時使用相同的名稱。 Kubernetes 還假定名字相同的資源是同一個物件。
就 Node 而言，隱式假定使用相同名稱的例項會具有相同的狀態（例如網路配置、根磁碟內容）
和類似節點標籤這類屬性。這可能在節點被更改但其名稱未變時導致系統狀態不一致。
如果某個 Node 需要被替換或者大量變更，需要從 API 伺服器移除現有的 Node 物件，
之後再在更新之後重新將其加入。

<!--
### Self-registration of Nodes

When the kubelet flag `-register-node` is true (the default), the kubelet will attempt to
register itself with the API server.  This is the preferred pattern, used by most distros.

For self-registration, the kubelet is started with the following options:
-->
### 節點自注冊 {#self-registration-of-nodes}

當 kubelet 標誌 `--register-node` 為 true（預設）時，它會嘗試向 API 服務註冊自己。
這是首選模式，被絕大多數發行版選用。

對於自注冊模式，kubelet 使用下列引數啟動：

<!--
- `--kubeconfig` - Path to credentials to authenticate itself to the API server.
- `--cloud-provider` - How to talk to a {{< glossary_tooltip text="cloud provider" term_id="cloud-provider" >}} to read metadata about itself.
- `--register-node` - Automatically register with the API server.
- `--register-with-taints` - Register the node with the given list of {{< glossary_tooltip text="taints" term_id="taint" >}} (comma separated `<key>=<value>:<effect>`).

    No-op if `register-node` is false.
- `--node-ip` - IP address of the node.
- `--node-labels` - {{< glossary_tooltip text="Labels" term_id="label" >}} to add when registering the node in the cluster (see label restrictions enforced by the [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)).
- `--node-status-update-frequency` - Specifies how often kubelet posts node status to master.
-->
- `--kubeconfig` - 用於向 API 伺服器執行身份認證所用的憑據的路徑。
- `--cloud-provider` - 與某{{< glossary_tooltip text="雲驅動" term_id="cloud-provider" >}}
  進行通訊以讀取與自身相關的元資料的方式。
- `--register-node` - 自動向 API 服務註冊。
- `--register-with-taints` - 使用所給的{{< glossary_tooltip text="汙點" term_id="taint" >}}列表
  （逗號分隔的 `<key>=<value>:<effect>`）註冊節點。當 `register-node` 為 false 時無效。
- `--node-ip` - 節點 IP 地址。
- `--node-labels` - 在叢集中註冊節點時要新增的{{< glossary_tooltip text="標籤" term_id="label" >}}。
  （參見 [NodeRestriction 准入控制外掛](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)所實施的標籤限制）。
- `--node-status-update-frequency` - 指定 kubelet 向控制面傳送狀態的頻率。

<!--
When the [Node authorization mode](/docs/reference/access-authn-authz/node/) and
[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) are enabled,
kubelets are only authorized to create/modify their own Node resource.
-->
啟用[Node 鑑權模式](/zh-cn/docs/reference/access-authn-authz/node/)和
[NodeRestriction 准入外掛](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)時，
僅授權 `kubelet` 建立或修改其自己的節點資源。

{{< note >}}
<!--
As mentioned in the [Node name uniqueness](#node-name-uniqueness) section,
when Node configuration needs to be updated, it is a good practice to re-register
the node with the API server. For example, if the kubelet being restarted with
the new set of `--node-labels`, but the same Node name is used, the change will
not take an effect, as labels are being set on the Node registration.
-->
正如[節點名稱唯一性](#node-name-uniqueness)一節所述，當 Node 的配置需要被更新時，
一種好的做法是重新向 API 伺服器註冊該節點。例如，如果 kubelet 重啟時其 `--node-labels`
是新的值集，但同一個 Node 名稱已經被使用，則所作變更不會起作用，
因為節點標籤是在 Node 註冊時完成的。

<!--
Pods already scheduled on the Node may misbehave or cause issues if the Node
configuration will be changed on kubelet restart. For example, already running
Pod may be tainted against the new labels assigned to the Node, while other
Pods, that are incompatible with that Pod will be scheduled based on this new
label.  Node re-registration ensures all Pods will be drained and properly
re-scheduled.
-->
如果在 kubelet 重啟期間 Node 配置發生了變化，已經被排程到某 Node 上的 Pod
可能會出現行為不正常或者出現其他問題，例如，已經執行的 Pod
可能透過汙點機制設定了與 Node 上新設定的標籤相排斥的規則，也有一些其他 Pod，
本來與此 Pod 之間存在不相容的問題，也會因為新的標籤設定而被調到到同一節點。
節點重新註冊操作可以確保節點上所有 Pod 都被排空並被正確地重新排程。
{{< /note >}}

<!--
### Manual Node administration

You can create and modify Node objects using
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}.

When you want to create Node objects manually, set the kubelet flag `--register-node=false`.

You can modify Node objects regardless of the setting of `--register-node`.
For example, you can set labels on an existing Node, or mark it unschedulable.
-->
### 手動節點管理 {#manual-node-administration}

你可以使用 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
來建立和修改 Node 物件。

如果你希望手動建立節點物件時，請設定 kubelet 標誌 `--register-node=false`。

你可以修改 Node 物件（忽略 `--register-node` 設定）。
例如，修改節點上的標籤或標記其為不可排程。

<!--
You can use labels on Nodes in conjunction with node selectors on Pods to control
scheduling. For example, you can to constrain a Pod to only be eligible to run on
a subset of the available nodes.

Marking a node as unschedulable prevents the scheduler from placing new pods onto
that Node, but does not affect existing Pods on the Node. This is useful as a
preparatory step before a node reboot or other maintenance.

To mark a Node unschedulable, run:
-->
你可以結合使用 Node 上的標籤和 Pod 上的選擇算符來控制排程。
例如，你可以限制某 Pod 只能在符合要求的節點子集上執行。

如果標記節點為不可排程（unschedulable），將阻止新 Pod 排程到該 Node 之上，
但不會影響任何已經在其上的 Pod。
這是重啟節點或者執行其他維護操作之前的一個有用的準備步驟。

要標記一個 Node 為不可排程，執行以下命令：

```shell
kubectl cordon $NODENAME
```

<!--
See [Safely Drain a Node](/docs/tasks/administer-cluster/safely-drain-node/)
for more details.
-->
更多細節參考[安全地騰空節點](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)。

{{< note >}}
<!--
Pods that are part of a {{< glossary_tooltip term_id="daemonset" >}} tolerate
being run on an unschedulable Node. DaemonSets typically provide node-local services
that should run on the Node even if it is being drained of workload applications.
-->
被 {{< glossary_tooltip term_id="daemonset" text="DaemonSet" >}} 控制器建立的 Pod
能夠容忍節點的不可排程屬性。
DaemonSet 通常提供節點本地的服務，即使節點上的負載應用已經被騰空，
這些服務也仍需執行在節點之上。
{{< /note >}}

<!--
## Node Status

A node's status contains the following information:

* [Addresses](#addresses)
* [Conditions](#condition)
* [Capacity and Allocatable](#capacity)
* [Info](#info)
-->
## 節點狀態   {#node-status}

一個節點的狀態包含以下資訊:

* [地址（Addresses）](#addresses)
* [狀況（Condition）](#condition)
* [容量與可分配（Capacity）](#capacity)
* [資訊（Info）](#info)

<!--
You can use `kubectl` to view a Node's status and other details:
-->
你可以使用 `kubectl` 來檢視節點狀態和其他細節資訊：

```shell
kubectl describe node <節點名稱>
```

<!-- Each section is described in detail below. -->
下面對每個部分進行詳細描述。

<!--
### Addresses

The usage of these fields varies depending on your cloud provider or bare metal configuration.
-->
### 地址   {#addresses}

這些欄位的用法取決於你的雲服務商或者物理機配置。

<!--
* HostName: The hostname as reported by the node's kernel. Can be overridden via the kubelet `-hostname-override` parameter.
* ExternalIP: Typically the IP address of the node that is externally routable (available from outside the cluster).
* InternalIP: Typichostnameally the IP address of the node that is routable only within the cluster.
-->
* HostName：由節點的核心報告。可以透過 kubelet 的 `--hostname-override` 引數覆蓋。
* ExternalIP：通常是節點的可外部路由（從叢集外可訪問）的 IP 地址。
* InternalIP：通常是節點的僅可在叢集內部路由的 IP 地址。

<!--
### Conditions {#condition}

The `conditions` field describes the status of all `Running` nodes. Examples of conditions include:
-->
### 狀況 {#condition}

`conditions` 欄位描述了所有 `Running` 節點的狀況。狀況的示例包括：

<!--
{{< table caption = "Node conditions, and a description of when each condition applies." >}}
| Node Condition | Description |
|----------------|-------------|
| `Ready`              | `True` if the node is healthy and ready to accept pods, `False` if the node is not healthy and is not accepting pods, and `Unknown` if the node controller has not heard from the node in the last `node-monitor-grace-period` (default is 40 seconds) |
| `DiskPressure`       | `True` if pressure exists on the disk size—that is, if the disk capacity is low; otherwise `False` |
| `MemoryPressure`     | `True` if pressure exists on the node memory—that is, if the node memory is low; otherwise `False` |
| `PIDPressure`    | `True` if pressure exists on the processes - that is, if there are too many processes on the node; otherwise `False` |
| `NetworkUnavailable`    | `True` if the network for the node is not correctly configured, otherwise `False` |
{{< /table >}}
-->
{{< table caption = "節點狀況及每種狀況適用場景的描述" >}}
| 節點狀況       | 描述        |
|----------------|-------------|
| `Ready` | 如節點是健康的並已經準備好接收 Pod 則為 `True`；`False` 表示節點不健康而且不能接收 Pod；`Unknown` 表示節點控制器在最近 `node-monitor-grace-period` 期間（預設 40 秒）沒有收到節點的訊息 |
| `DiskPressure` | `True` 表示節點存在磁碟空間壓力，即磁碟可用量低, 否則為 `False` |
| `MemoryPressure` | `True` 表示節點存在記憶體壓力，即節點記憶體可用量低，否則為 `False` |
| `PIDPressure` | `True` 表示節點存在程序壓力，即節點上程序過多；否則為 `False` |
| `NetworkUnavailable` | `True` 表示節點網路配置不正確；否則為 `False` |
{{< /table >}}

{{< note >}}
<!--
If you use command-line tools to print details of a cordoned Node, the Condition includes
`SchedulingDisabled`. `SchedulingDisabled` is not a Condition in the Kubernetes API; instead,
cordoned nodes are marked Unschedulable in their spec.
-->
如果使用命令列工具來列印已保護（Cordoned）節點的細節，其中的 Condition 欄位可能包括
`SchedulingDisabled`。`SchedulingDisabled` 不是 Kubernetes API 中定義的
Condition，被保護起來的節點在其規約中被標記為不可排程（Unschedulable）。
{{< /note >}}

<!--
In the Kubernetes API, a node's condition is represented as part of the `.status`
of the Node resource. For example, the following JSON structure describes a healthy node:
-->
在 Kubernetes API 中，節點的狀況表示節點資源中`.status` 的一部分。 
例如，以下 JSON 結構描述了一個健康節點：

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

<!--
If the `status` of the Ready condition remains `Unknown` or `False` for longer
than the `pod-eviction-timeout` (an argument passed to the
{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager"
>}}), then the [node controller](#node-controller) triggers
{{< glossary_tooltip text="API-initiated eviction" term_id="api-eviction" >}}
for all Pods assigned to that node. The default eviction timeout duration is
**five minutes**.
-->
如果 Ready 狀況的 `status` 處於 `Unknown` 或者 `False` 狀態的時間超過了
`pod-eviction-timeout` 值（一個傳遞給
{{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
的引數），[節點控制器](#node-controller)會對節點上的所有 Pod 觸發
{{< glossary_tooltip text="API-發起的驅逐" term_id="api-eviction" >}}。
預設的逐出超時時長為 **5 分鐘**。

<!--
In some cases when the node is unreachable, the API server is unable to communicate
with the kubelet on the node. The decision to delete the pods cannot be communicated to
the kubelet until communication with the API server is re-established. In the meantime,
the pods that are scheduled for deletion may continue to run on the partitioned node.
-->
某些情況下，當節點不可達時，API 伺服器不能和其上的 kubelet 通訊。
刪除 Pod 的決定不能傳達給 kubelet，直到它重新建立和 API 伺服器的連線為止。
與此同時，被計劃刪除的 Pod 可能會繼續在遊離的節點上執行。

<!--
The node controller does not force delete pods until it is confirmed that they have stopped
running in the cluster. You can see the pods that might be running on an unreachable node as
being in the `Terminating` or `Unknown` state. In cases where Kubernetes cannot deduce from the
underlying infrastructure if a node has permanently left a cluster, the cluster administrator
may need to delete the node object by hand.  Deleting the node object from Kubernetes causes
all the Pod objects running on the node to be deleted from the API server, and frees up their
names.
-->
節點控制器在確認 Pod 在叢集中已經停止執行前，不會強制刪除它們。
你可以看到可能在這些無法訪問的節點上執行的 Pod 處於 `Terminating` 或者 `Unknown` 狀態。
如果 kubernetes 不能基於下層基礎設施推斷出某節點是否已經永久離開了叢集，
叢集管理員可能需要手動刪除該節點物件。
從 Kubernetes 刪除節點物件將導致 API 伺服器刪除節點上所有執行的 Pod 物件並釋放它們的名字。

<!--
When problems occur on nodes, the Kubernetes control plane automatically creates
[taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) that match the conditions
affecting the node.
The scheduler takes the Node's taints into consideration when assigning a Pod to a Node.
Pods can also have {{< glossary_tooltip text="tolerations" term_id="toleration" >}} that let
them run on a Node even though it has a specific taint.
-->
當節點上出現問題時，Kubernetes 控制面會自動建立與影響節點的狀況對應的
[汙點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
排程器在將 Pod 指派到某 Node 時會考慮 Node 上的汙點設定。
Pod 也可以設定{{< glossary_tooltip text="容忍度" term_id="toleration" >}}，
以便能夠在設定了特定汙點的 Node 上執行。

<!--
See [Taint Nodes by Condition](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)
for more details.
-->
進一步的細節可參閱[根據狀況為節點設定汙點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)。

<!--
### Capacity and Allocatable {#capacity}

Describes the resources available on the node: CPU, memory and the maximum
number of pods that can be scheduled onto the node.
-->
### 容量（Capacity）與可分配（Allocatable）     {#capacity}

這兩個值描述節點上的可用資源：CPU、記憶體和可以排程到節點上的 Pod 的個數上限。

<!--
The fields in the capacity block indicate the total amount of resources that a
Node has. The allocatable block indicates the amount of resources on a
Node that is available to be consumed by normal Pods.
-->
`capacity` 塊中的欄位標示節點擁有的資源總量。
`allocatable` 塊指示節點上可供普通 Pod 消耗的資源量。

<!--
You may read more about capacity and allocatable resources while learning how
to [reserve compute resources](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) on a Node.
-->
可以在學習如何在節點上[預留計算資源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
的時候瞭解有關容量和可分配資源的更多資訊。

<!--
### Info

Describes general information about the node, such as kernel version, Kubernetes
version (kubelet and kube-proxy version), container runtime details, and which
operating system the node uses.
The kubelet gathers this information from the node and publishes it into
the Kubernetes API.
-->

### 資訊（Info） {#info}

Info 指的是節點的一般資訊，如核心版本、Kubernetes 版本（`kubelet` 和 `kube-proxy` 版本）、
容器執行時詳細資訊，以及節點使用的作業系統。
`kubelet` 從節點收集這些資訊並將其釋出到 Kubernetes API。

<!--
## Heartbeats

Heartbeats, sent by Kubernetes nodes, help your cluster determine the
availability of each node, and to take action when failures are detected.

For nodes there are two forms of heartbeats:
-->
## 心跳  {#heartbeats}

Kubernetes 節點發送的心跳幫助你的叢集確定每個節點的可用性，並在檢測到故障時採取行動。

對於節點，有兩種形式的心跳:

<!--
* updates to the `.status` of a Node
* [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/) objects
  within the `kube-node-lease`
  {{< glossary_tooltip term_id="namespace" text="namespace">}}.
  Each Node has an associated Lease object.
-->
* 更新節點的 `.status`
* `kube-node-lease` {{<glossary_tooltip term_id="namespace" text="名字空間">}}中的
  [Lease（租約）](/docs/reference/kubernetes-api/cluster-resources/lease-v1/)物件。
  每個節點都有一個關聯的 Lease 物件。

<!--
Compared to updates to `.status` of a Node, a Lease is a lightweight resource.
Using Leases for heartbeats reduces the performance impact of these updates
for large clusters.

The kubelet is responsible for creating and updating the `.status` of Nodes,
and for updating their related Leases.
-->
與 Node 的 `.status` 更新相比，Lease 是一種輕量級資源。
使用 Lease 來表達心跳在大型叢集中可以減少這些更新對效能的影響。

kubelet 負責建立和更新節點的 `.status`，以及更新它們對應的 Lease。

<!--
- The kubelet updates the node's `.status` either when there is change in status
  or if there has been no update for a configured interval. The default interval
  for `.status` updates to Nodes is 5 minutes, which is much longer than the 40
  second default timeout for unreachable nodes.
- The kubelet creates and then updates its Lease object every 10 seconds
  (the default update interval). Lease updates occur independently from
  updates to the Node's `.status`. If the Lease update fails, the kubelet retries,
  using exponential backoff that starts at 200 milliseconds and capped at 7 seconds.
-->
- 當節點狀態發生變化時，或者在配置的時間間隔內沒有更新事件時，kubelet 會更新 `.status`。
  `.status` 更新的預設間隔為 5 分鐘（比節點不可達事件的 40 秒預設超時時間長很多）。
- `kubelet` 會建立並每 10 秒（預設更新間隔時間）更新 Lease 物件。
  Lease 的更新獨立於 Node 的 `.status` 更新而發生。
  如果 Lease 的更新操作失敗，kubelet 會採用指數回退機制，從 200 毫秒開始重試，
  最長重試間隔為 7 秒鐘。

<!--
## Node Controller

The node {{< glossary_tooltip text="controller" term_id="controller" >}} is a
Kubernetes control plane component that manages various aspects of nodes.

The node controller has multiple roles in a node's life. The first is assigning a
CIDR block to the node when it is registered (if CIDR assignment is turned on).
-->
## 節點控制器  {#node-controller}

節點{{< glossary_tooltip text="控制器" term_id="controller" >}}是 Kubernetes 控制面元件，
管理節點的方方面面。

節點控制器在節點的生命週期中扮演多個角色。
第一個是當節點註冊時為它分配一個 CIDR 區段（如果啟用了 CIDR 分配）。

<!--
The second is keeping the node controller's internal list of nodes up to date with
the cloud provider's list of available machines. When running in a cloud
environment, whenever a node is unhealthy, the node controller asks the cloud
provider if the VM for that node is still available. If not, the node
controller deletes the node from its list of nodes.
-->
第二個是保持節點控制器內的節點列表與雲服務商所提供的可用機器列表同步。
如果在雲環境下執行，只要某節點不健康，節點控制器就會詢問雲服務是否節點的虛擬機器仍可用。
如果不可用，節點控制器會將該節點從它的節點列表刪除。

<!--
The third is monitoring the nodes' health. The node controller is
responsible for:

- In the case that a node becomes unreachable, updating the `Ready` condition
  in the Node's `.status` field. In this case the node controller sets the
  `Ready` condition to `Unknown`.
- If a node remains unreachable: triggering
  [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/)
  for all of the Pods on the unreachable node. By default, the node controller
  waits 5 minutes between marking the node as `Unknown` and submitting
  the first eviction request.

By default, the node controller checks the state of each node every 5 seconds.
This period can be configured using the `--node-monitor-period` flag on the
`kube-controller-manager` component.
-->
第三個是監控節點的健康狀況。節點控制器負責：

- 在節點不可達的情況下，在 Node 的 `.status` 中更新 `Ready` 狀況。
  在這種情況下，節點控制器將 NodeReady 狀況更新為 `Unknown` 。
- 如果節點仍然無法訪問：對於不可達節點上的所有 Pod 觸發
  [API 發起的逐出](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)操作。
  預設情況下，節點控制器在將節點標記為 `Unknown` 後等待 5 分鐘提交第一個驅逐請求。

預設情況下，節點控制器每 5 秒檢查一次節點狀態，可以使用 `kube-controller-manager`
元件上的 `--node-monitor-period` 引數來配置週期。

<!--
### Rate limits on eviction

In most cases, the node controller limits the eviction rate to
`-node-eviction-rate` (default 0.1) per second, meaning it won't evict pods
from more than 1 node per 10 seconds.
-->
### 逐出速率限制  {#rate-limits-on-eviction}

大部分情況下，節點控制器把逐出速率限制在每秒 `--node-eviction-rate` 個（預設為 0.1）。
這表示它每 10 秒鐘內至多從一個節點驅逐 Pod。

<!--
The node eviction behavior changes when a node in a given availability zone
becomes unhealthy. The node controller checks what percentage of nodes in the zone
are unhealthy (the `Ready` condition is `Unknown` or `False`) at
the same time:
-->
當一個可用區域（Availability Zone）中的節點變為不健康時，節點的驅逐行為將發生改變。
節點控制器會同時檢查可用區域中不健康（`Ready` 狀況為 `Unknown` 或 `False`）
的節點的百分比：

<!--
- If the fraction of unhealthy nodes is at least `--unhealthy-zone-threshold`
  (default 0.55), then the eviction rate is reduced.
- If the cluster is small (i.e. has less than or equal to
  `--large-cluster-size-threshold` nodes - default 50), then evictions are stopped.
- Otherwise, the eviction rate is reduced to `--secondary-node-eviction-rate`
  (default 0.01) per second.
-->
- 如果不健康節點的比例超過 `--unhealthy-zone-threshold` （預設為 0.55），
  驅逐速率將會降低。
- 如果叢集較小（意即小於等於 `--large-cluster-size-threshold` 個節點 - 預設為 50），
  驅逐操作將會停止。 
- 否則驅逐速率將降為每秒 `--secondary-node-eviction-rate` 個（預設為 0.01）。

<!--
The reason these policies are implemented per availability zone is because one
availability zone might become partitioned from the master while the others remain
connected. If your cluster does not span multiple cloud provider availability zones,
then the eviction mechanism does not take per-zone unavailability into account.
-->
在逐個可用區域中實施這些策略的原因是，
當一個可用區域可能從控制面脫離時其它可用區域可能仍然保持連線。
如果你的叢集沒有跨越雲服務商的多個可用區域，那（整個叢集）就只有一個可用區域。

<!--
A key reason for spreading your nodes across availability zones is so that the
workload can be shifted to healthy zones when one entire zone goes down.
Therefore, if all nodes in a zone are unhealthy then node controller evicts at
the normal rate `-node-eviction-rate`.  The corner case is when all zones are
completely unhealthy (none of the nodes in the cluster are healthy). In such a
case, the node controller assumes that there is some problem with connectivity
between the control plane and the nodes, and doesn't perform any evictions.
(If there has been an outage and some nodes reappear, the node controller does
evict pods from the remaining nodes that are unhealthy or unreachable).
-->
跨多個可用區域部署你的節點的一個關鍵原因是當某個可用區域整體出現故障時，
工作負載可以轉移到健康的可用區域。
因此，如果一個可用區域中的所有節點都不健康時，節點控制器會以正常的速率
`--node-eviction-rate` 進行驅逐操作。
在所有的可用區域都不健康（也即叢集中沒有健康節點）的極端情況下，
節點控制器將假設控制面與節點間的連接出了某些問題，它將停止所有驅逐動作
（如果故障後部分節點重新連線，節點控制器會從剩下不健康或者不可達節點中驅逐 Pod）。

<!--
The Node Controller is also responsible for evicting pods running on nodes with
`NoExecute` taints, unless the pods do not tolerate the taints.
The Node Controller also adds {{< glossary_tooltip text="taints" term_id="taint" >}}
corresponding to node problems like node unreachable or not ready. This means
that the scheduler won't place Pods onto unhealthy nodes.
-->
節點控制器還負責驅逐執行在擁有 `NoExecute` 汙點的節點上的 Pod，
除非這些 Pod 能夠容忍此汙點。
節點控制器還負責根據節點故障（例如節點不可訪問或沒有就緒）
為其新增{{< glossary_tooltip text="汙點" term_id="taint" >}}。
這意味著排程器不會將 Pod 排程到不健康的節點上。

<!--
## Resource capacity tracking {#node-capacity}

Node objects track information about the Node's resource capacity (for example: the amount
of memory available, and the number of CPUs).
Nodes that [self register](#self-registration-of-nodes) report their capacity during
registration. If you [manually](#manual-node-administration) add a Node, then
you need to set the node's capacity information when you add it.
-->
### 資源容量跟蹤   {#node-capacity}

Node 物件會跟蹤節點上資源的容量（例如可用記憶體和 CPU 數量）。
透過[自注冊](#self-registration-of-nodes)機制生成的 Node 物件會在註冊期間報告自身容量。
如果你[手動](#manual-node-administration)添加了 Node，
你就需要在新增節點時手動設定節點容量。

<!--
The Kubernetes {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} ensures that
there are enough resources for all the pods on a node.  The scheduler checks that the sum
of the requests of containers on the node is no greater than the node capacity.
The sum of requests includes all containers started by the kubelet, but excludes any
containers started directly by the container runtime, and also excludes any
process running outside of the kubelet's control.
-->
Kubernetes {{< glossary_tooltip text="排程器" term_id="kube-scheduler" >}}
保證節點上有足夠的資源供其上的所有 Pod 使用。
它會檢查節點上所有容器的請求的總和不會超過節點的容量。
總的請求包括由 kubelet 啟動的所有容器，但不包括由容器執行時直接啟動的容器，
也不包括不受 `kubelet` 控制的其他程序。

{{< note >}}
<!--
If you want to explicitly reserve resources for non-Pod processes, follow this tutorial to
[reserve resources for system daemons](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved).
-->
如果要為非 Pod 程序顯式保留資源。
請參考[為系統守護程序預留資源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)。
{{< /note >}}

<!--
## Node topology
-->
## 節點拓撲  {#node-topology}

{{< feature-state state="beta" for_k8s_version="v1.18" >}}

<!--
If you have enabled the `TopologyManager`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/), then
the kubelet can use topology hints when making resource assignment decisions.
See [Control Topology Management Policies on a Node](/docs/tasks/administer-cluster/topology-manager/)
for more information.
-->
如果啟用了 `TopologyManager` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
`kubelet` 可以在作出資源分配決策時使用拓撲提示。
參考[控制節點上拓撲管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)瞭解詳細資訊。

<!-- 
## Graceful node shutdown {#graceful-node-shutdown}
-->
## 節點體面關閉 {#graceful-node-shutdown}

{{< feature-state state="beta" for_k8s_version="v1.21" >}}

<!-- 
The kubelet attempts to detect node system shutdown and terminates pods running on the node.

Kubelet ensures that pods follow the normal
[pod termination process](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
during the node shutdown.
-->
kubelet 會嘗試檢測節點系統關閉事件並終止在節點上執行的 Pods。

在節點終止期間，kubelet 保證 Pod 遵從常規的
[Pod 終止流程](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)。

<!-- 
The graceful node shutdown feature depends on systemd since it takes advantage of
[systemd inhibitor locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit/) to
delay the node shutdown with a given duration.
-->
節點體面關閉特性依賴於 systemd，因為它要利用
[systemd 抑制器鎖](https://www.freedesktop.org/wiki/Software/systemd/inhibit/)機制，
在給定的期限內延遲節點關閉。

<!--
Graceful node shutdown is controlled with the `GracefulNodeShutdown`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) which is
enabled by default in 1.21.
-->
節點體面關閉特性受 `GracefulNodeShutdown`
[特性門控](/docs/reference/command-line-tools-reference/feature-gates/)控制，
在 1.21 版本中是預設啟用的。

<!--
Note that by default, both configuration options described below,
`ShutdownGracePeriod` and `ShutdownGracePeriodCriticalPods` are set to zero,
thus not activating the graceful node shutdown functionality.
To activate the feature, the two kubelet config settings should be configured appropriately and set to non-zero values.
-->
注意，預設情況下，下面描述的兩個配置選項，`shutdownGracePeriod` 和
`shutdownGracePeriodCriticalPods` 都是被設定為 0 的，因此不會啟用節點體面關閉功能。
要啟用此功能特性，這兩個 kubelet 配置選項要適當配置，並設定為非零值。

<!-- 
During a graceful shutdown, kubelet terminates pods in two phases:

1. Terminate regular pods running on the node.
2. Terminate [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical) running on the node.
-->
在體面關閉節點過程中，kubelet 分兩個階段來終止 Pod：

1. 終止在節點上執行的常規 Pod。
2. 終止在節點上執行的[關鍵 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)。

<!-- 
Graceful Node Shutdown feature is configured with two [`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) options:
* `ShutdownGracePeriod`:
  * Specifies the total duration that the node should delay the shutdown by. This is the total grace period for pod termination for both regular and [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).
* `ShutdownGracePeriodCriticalPods`:
  * Specifies the duration used to terminate [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical) during a node shutdown. This value should be less than `ShutdownGracePeriod`.
-->
節點體面關閉的特性對應兩個
[`KubeletConfiguration`](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/) 選項：

* `shutdownGracePeriod`：
  * 指定節點應延遲關閉的總持續時間。此時間是 Pod 體面終止的時間總和，不區分常規 Pod
    還是[關鍵 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)。
* `shutdownGracePeriodCriticalPods`：
  * 在節點關閉期間指定用於終止[關鍵 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
    的持續時間。該值應小於 `shutdownGracePeriod`。

<!--  
For example, if `ShutdownGracePeriod=30s`, and
`ShutdownGracePeriodCriticalPods=10s`, kubelet will delay the node shutdown by
30 seconds. During the shutdown, the first 20 (30-10) seconds would be reserved
for gracefully terminating normal pods, and the last 10 seconds would be
reserved for terminating [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).
-->
例如，如果設定了 `shutdownGracePeriod=30s` 和 `shutdownGracePeriodCriticalPods=10s`，
則 kubelet 將延遲 30 秒關閉節點。
在關閉期間，將保留前 20（30 - 10）秒用於體面終止常規 Pod，
而保留最後 10 秒用於終止[關鍵 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)。

<!--
When pods were evicted during the graceful node shutdown, they are marked as failed.
Running `kubectl get pods` shows the status of the the evicted pods as `Shutdown`.
And `kubectl describe pod` indicates that the pod was evicted because of node shutdown:
-->
{{< note >}}
當 Pod 在正常節點關閉期間被驅逐時，它們會被標記為已經失敗（Failed）。
執行 `kubectl get pods` 時，被驅逐的 Pod 的狀態顯示為 `Shutdown`。
並且 `kubectl describe pod` 表示 Pod 因節點關閉而被驅逐：

```
Reason:         Terminated
Message:        Pod was terminated in response to imminent node shutdown.
```
{{< /note >}}

<!--
## Non Graceful node shutdown {#non-graceful-node-shutdown}
-->
## 節點非體面關閉 {#non-graceful-node-shutdown}

{{< feature-state state="alpha" for_k8s_version="v1.24" >}}

<!--
A node shutdown action may not be detected by kubelet's Node Shutdown Mananger, 
either because the command does not trigger the inhibitor locks mechanism used by 
kubelet or because of a user error, i.e., the ShutdownGracePeriod and 
ShutdownGracePeriodCriticalPods are not configured properly. Please refer to above 
section [Graceful Node Shutdown](#graceful-node-shutdown) for more details.
-->
節點關閉的操作可能無法被 kubelet 的節點關閉管理器檢測到，
是因為該命令不會觸發 kubelet 所使用的抑制鎖定機制，或者是因為使用者錯誤的原因，
即 ShutdownGracePeriod 和 ShutdownGracePeriodCriticalPod 配置不正確。
請參考以上[節點體面關閉](#graceful-node-shutdown)部分了解更多詳細資訊。

<!--
When a node is shutdown but not detected by kubelet's Node Shutdown Manager, the pods 
that are part of a StatefulSet will be stuck in terminating status on 
the shutdown node and cannot move to a new running node. This is because kubelet on 
the shutdown node is not available to delete the pods so the StatefulSet cannot 
create a new pod with the same name. If there are volumes used by the pods, the 
VolumeAttachments will not be deleted from the original shutdown node so the volumes 
used by these pods cannot be attached to a new running node. As a result, the 
application running on the StatefulSet cannot function properly. If the original 
shutdown node comes up, the pods will be deleted by kubelet and new pods will be 
created on a different running node. If the original shutdown node does not come up,  
these pods will be stuck in terminating status on the shutdown node forever.
-->
當某節點關閉但 kubelet 的節點關閉管理器未檢測到這一事件時，
在那個已關閉節點上、屬於 StatefulSet 的 Pod 將停滯於終止狀態，並且不能移動到新的執行節點上。
這是因為已關閉節點上的 kubelet 已不存在，亦無法刪除 Pod，
因此 StatefulSet 無法建立同名的新 Pod。
如果 Pod 使用了卷，則 VolumeAttachments 不會從原來的已關閉節點上刪除，
因此這些 Pod 所使用的卷也無法掛接到新的執行節點上。
所以，那些以 StatefulSet 形式執行的應用無法正常工作。
如果原來的已關閉節點被恢復，kubelet 將刪除 Pod，新的 Pod 將被在不同的執行節點上建立。
如果原來的已關閉節點沒有被恢復，那些在已關閉節點上的 Pod 將永遠滯留在終止狀態。

<!--
To mitigate the above situation, a  user can manually add the taint `node 
kubernetes.io/out-of-service` with either `NoExecute` or `NoSchedule` effect to 
a Node marking it out-of-service. 
If the `NodeOutOfServiceVolumeDetach`  [feature gate](/docs/reference/
command-line-tools-reference/feature-gates/) is enabled on
`kube-controller-manager`, and a Node is marked out-of-service with this taint, the 
pods on the node will be forcefully deleted if there are no matching tolerations on
it and volume detach operations for the pods terminating on the node will happen
immediately. This allows the Pods on the out-of-service node to recover quickly on a
different node. 
-->
為了緩解上述情況，使用者可以手動將具有 `NoExecute` 或 `NoSchedule` 效果的
`node kubernetes.io/out-of-service` 汙點新增到節點上，標記其無法提供服務。
如果在 `kube-controller-manager` 上啟用了 `NodeOutOfServiceVolumeDetach` 
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
並且節點被透過汙點標記為無法提供服務，如果節點 Pod 上沒有設定對應的容忍度，
那麼這樣的 Pod 將被強制刪除，並且該在節點上被終止的 Pod 將立即進行卷分離操作。
這樣就允許那些在無法提供服務節點上的 Pod 能在其他節點上快速恢復。

<!--
During a non-graceful shutdown, Pods are terminated in the two phases:

1. Force delete the Pods that do not have matching `out-of-service` tolerations.
2. Immediately perform detach volume operation for such pods. 
-->
在非體面關閉期間，Pod 分兩個階段終止：
1. 強制刪除沒有匹配的 `out-of-service` 容忍度的 Pod。
2. 立即對此類 Pod 執行分離卷操作。

<!--
{{< note >}}
- Before adding the taint `node.kubernetes.io/out-of-service` , it should be verified
that the node is already in shutdown or power off state (not in the middle of
restarting).
- The user is required to manually remove the out-of-service taint after the pods are
moved to a new node and the user has checked that the shutdown node has been
recovered since the user was the one who originally added the taint.
{{< /note >}}
-->
{{< note >}}
- 在新增 `node.kubernetes.io/out-of-service` 汙點之前，應該驗證節點已經處於關閉或斷電狀態（而不是在重新啟動中）。
- 將 Pod 移動到新節點後，使用者需要手動移除停止服務的汙點，並且使用者要檢查關閉節點是否已恢復，因為該使用者是最初新增汙點的使用者。
{{< /note >}}


<!--
### Pod Priority based graceful node shutdown {#pod-priority-graceful-node-shutdown}
-->
### 基於 Pod 優先順序的節點體面關閉    {#pod-priority-graceful-node-shutdown}

{{< feature-state state="alpha" for_k8s_version="v1.23" >}}

<!--
To provide more flexibility during graceful node shutdown around the ordering
of pods during shutdown, graceful node shutdown honors the PriorityClass for
Pods, provided that you enabled this feature in your cluster. The feature
allows cluster administers to explicitly define the ordering of pods
during graceful node shutdown based on
[priority classes](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass).
-->
為了在節點體面關閉期間提供更多的靈活性，尤其是處理關閉期間的 Pod 排序問題，
節點體面關閉機制能夠關注 Pod 的 PriorityClass 設定，前提是你已經在叢集中啟用了此功能特性。
此功能特性允許叢集管理員基於 Pod
的[優先順序類（Priority Class）](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
顯式地定義節點體面關閉期間 Pod 的處理順序。

<!--
The [Graceful Node Shutdown](#graceful-node-shutdown) feature, as described
above, shuts down pods in two phases, non-critical pods, followed by critical
pods. If additional flexibility is needed to explicitly define the ordering of
pods during shutdown in a more granular way, pod priority based graceful
shutdown can be used.
-->
前文所述的[節點體面關閉](#graceful-node-shutdown)特效能夠分兩個階段關閉 Pod，
首先關閉的是非關鍵的 Pod，之後再處理關鍵 Pod。
如果需要顯式地以更細粒度定義關閉期間 Pod 的處理順序，需要一定的靈活度，
這時可以使用基於 Pod 優先順序的體面關閉機制。

<!--
When graceful node shutdown honors pod priorities, this makes it possible to do
graceful node shutdown in multiple phases, each phase shutting down a
particular priority class of pods. The kubelet can be configured with the exact
phases and shutdown time per phase.
-->
當節點體面關閉能夠處理 Pod 優先順序時，節點體面關閉的處理可以分為多個階段，
每個階段關閉特定優先順序類的 Pod。kubelet 可以被配置為按確切的階段處理 Pod，
且每個階段可以獨立設定關閉時間。

<!--
Assuming the following custom pod
[priority classes](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
in a cluster,
-->
假設叢集中存在以下自定義的 Pod
[優先順序類](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)。

| Pod 優先順序類名稱        | Pod 優先順序類數值       |
|-------------------------|------------------------|
|`custom-class-a`         | 100000                 |
|`custom-class-b`         | 10000                  |
|`custom-class-c`         | 1000                   |
|`regular/unset`          | 0                      |

<!--
Within the [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)
the settings for `shutdownGracePeriodByPodPriority` could look like:
-->
在 [kubelet 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)中，
`shutdownGracePeriodByPodPriority` 可能看起來是這樣：

| Pod 優先順序類數值       | 關閉期限  |
|------------------------|-----------|
| 100000                 | 10 秒     |
| 10000                  | 180 秒    |
| 1000                   | 120 秒    |
| 0                      | 60 秒     |

<!--
The corresponding kubelet config YAML configuration would be:
-->
對應的 kubelet 配置 YAML 將會是：

```yaml
shutdownGracePeriodByPodPriority:
  - priority: 100000
    shutdownGracePeriodSeconds: 10
  - priority: 10000
    shutdownGracePeriodSeconds: 180
  - priority: 1000
    shutdownGracePeriodSeconds: 120
  - priority: 0
    shutdownGracePeriodSeconds: 60
```

<!--
The above table implies that any pod with `priority` value >= 100000 will get
just 10 seconds to stop, any pod with value >= 10000 and < 100000 will get 180
seconds to stop, any pod with value >= 1000 and < 10000 will get 120 seconds to stop.
Finally, all other pods will get 60 seconds to stop.

One doesn't have to specify values corresponding to all of the classes. For
example, you could instead use these settings:
-->
上面的表格表明，所有 `priority` 值大於等於 100000 的 Pod 會得到 10 秒鐘期限停止，
所有 `priority` 值介於 10000 和 100000 之間的 Pod 會得到 180 秒鐘期限停止，
所有 `priority` 值介於 1000 和 10000 之間的 Pod 會得到 120 秒鐘期限停止，
所有其他 Pod 將獲得 60 秒的時間停止。

使用者不需要為所有的優先順序類都設定數值。例如，你也可以使用下面這種配置：

| Pod 優先順序類數值       | 關閉期限  |
|------------------------|-----------|
| 100000                 | 300 秒    |
| 1000                   | 120 秒    |
| 0                      | 60 秒     |

<!--
In the above case, the pods with `custom-class-b` will go into the same bucket
as `custom-class-c` for shutdown.

If there are no pods in a particular range, then the kubelet does not wait
for pods in that priority range. Instead, the kubelet immediately skips to the
next priority class value range.
-->
在上面這個場景中，優先順序類為 `custom-class-b` 的 Pod 會與優先順序類為 `custom-class-c`
的 Pod 在關閉時按相同期限處理。

如果在特定的範圍內不存在 Pod，則 kubelet 不會等待對應優先順序範圍的 Pod。
kubelet 會直接跳到下一個優先順序數值範圍進行處理。

<!--
If this feature is enabled and no configuration is provided, then no ordering
action will be taken.

Using this feature requires enabling the `GracefulNodeShutdownBasedOnPodPriority`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
, and setting `ShutdownGracePeriodByPodPriority` in the
[kubelet config](/docs/reference/config-api/kubelet-config.v1beta1/)
to the desired configuration containing the pod priority class values and
their respective shutdown periods.
-->
如果此功能特性被啟用，但沒有提供配置資料，則不會出現排序操作。

使用此功能特性需要啟用 `GracefulNodeShutdownBasedOnPodPriority` 
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
並將 [kubelet 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
中的 `shutdownGracePeriodByPodPriority` 設定為期望的配置，
其中包含 Pod 的優先順序類數值以及對應的關閉期限。

<!-- 
{{< note >}}
The ability to take Pod priority into account during graceful node shutdown was introduced
as an Alpha feature in Kubernetes v1.23. In Kubernetes {{< skew currentVersion >}}
the feature is Beta and is enabled by default.
{{< /note >}} 
-->
{{< note >}}
在節點體面關閉期間考慮 Pod 優先順序的能力是作為 Kubernetes v1.23 中的 Alpha 功能引入的。
在 Kubernetes {{< skew currentVersion >}} 中該功能是 Beta 版，預設啟用。
{{< /note >}} 

<!--
Metrics `graceful_shutdown_start_time_seconds` and `graceful_shutdown_end_time_seconds`
are emitted under the kubelet subsystem to monitor node shutdowns.
-->
kubelet 子系統中會生成 `graceful_shutdown_start_time_seconds` 和
`graceful_shutdown_end_time_seconds` 度量指標以便監視節點關閉行為。

<!--
## Swap memory management {#swap-memory}
-->
## 交換記憶體管理 {#swap-memory}

{{< feature-state state="alpha" for_k8s_version="v1.22" >}}

<!--
Prior to Kubernetes 1.22, nodes did not support the use of swap memory, and a
kubelet would by default fail to start if swap was detected on a node. In 1.22
onwards, swap memory support can be enabled on a per-node basis.
-->
在 Kubernetes 1.22 之前，節點不支援使用交換記憶體，並且預設情況下，
如果在節點上檢測到交換記憶體配置，kubelet 將無法啟動。
在 1.22 以後，可以逐個節點地啟用交換記憶體支援。

<!--
To enable swap on a node, the `NodeSwap` feature gate must be enabled on
the kubelet, and the `--fail-swap-on` command line flag or `failSwapOn`
[configuration setting](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)
must be set to false.
-->
要在節點上啟用交換記憶體，必須啟用kubelet 的 `NodeSwap` 特性門控，
同時使用 `--fail-swap-on` 命令列引數或者將 `failSwapOn`
[配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)設定為 false。

<!--
A user can also optionally configure `memorySwap.swapBehavior` in order to
specify how a node will use swap memory. For example,
-->
使用者還可以選擇配置 `memorySwap.swapBehavior` 以指定節點使用交換記憶體的方式。例如:

```yaml
memorySwap:
  swapBehavior: LimitedSwap
```

<!--
The available configuration options for `swapBehavior` are:

- `LimitedSwap`: Kubernetes workloads are limited in how much swap they can
  use. Workloads on the node not managed by Kubernetes can still swap.
- `UnlimitedSwap`: Kubernetes workloads can use as much swap memory as they
  request, up to the system limit.
-->
可用的 `swapBehavior` 的配置選項有：

- `LimitedSwap`：Kubernetes 工作負載的交換記憶體會受限制。
  不受 Kubernetes 管理的節點上的工作負載仍然可以交換。
- `UnlimitedSwap`：Kubernetes 工作負載可以使用盡可能多的交換記憶體請求，
  一直到達到系統限制為止。

<!--
If configuration for `memorySwap` is not specified and the feature gate is
enabled, by default the kubelet will apply the same behaviour as the
`LimitedSwap` setting.

The behaviour of the `LimitedSwap` setting depends if the node is running with
v1 or v2 of control groups (also known as "cgroups"):
-->
如果啟用了特性門控但是未指定 `memorySwap` 的配置，預設情況下 kubelet 將使用
`LimitedSwap` 設定。

`LimitedSwap` 這種設定的行為取決於節點執行的是 v1 還是 v2 的控制組（也就是 `cgroups`）：

<!--
- **cgroupsv1:** Kubernetes workloads can use any combination of memory and
  swap, up to the pod's memory limit, if set.
- **cgroupsv2:** Kubernetes workloads cannot use swap memory.
-->
- **cgroupsv1:** Kubernetes 工作負載可以使用記憶體和交換，上限為 Pod 的記憶體限制值（如果設定了的話）。
- **cgroupsv2:** Kubernetes 工作負載不能使用交換記憶體。

<!--
For more information, and to assist with testing and provide feedback, please
see [KEP-2400](https://github.com/kubernetes/enhancements/issues/2400) and its
[design proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md).
-->
如需更多資訊以及協助測試和提供反饋，請參見
[KEP-2400](https://github.com/kubernetes/enhancements/issues/2400)
及其[設計提案](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md)。

## {{% heading "whatsnext" %}}

<!--
* Learn about the [components](/docs/concepts/overview/components/#node-components) that make up a node.
* Read the [API definition for Node](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).
* Read the [Node](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node)
  section of the architecture design document.
* Read about [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
-->
* 進一步瞭解節點[元件](/zh-cn/docs/concepts/overview/components/#node-components)。
* 閱讀 [Node 的 API 定義](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core)。
* 閱讀架構設計文件中有關
  [Node](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node)
  的章節。
* 瞭解[汙點和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。

