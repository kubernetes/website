---
content_type: reference
title: 節點狀態
weight: 80
---
<!--
content_type: reference
title: Node Status
weight: 80
-->

<!-- overview -->

<!--
The status of a [node](/docs/concepts/architecture/nodes/) in Kubernetes is a critical
aspect of managing a Kubernetes cluster. In this article, we'll cover the basics of
monitoring and maintaining node status to ensure a healthy and stable cluster.
-->
在 Kubernetes 中，[節點](/zh-cn/docs/concepts/architecture/nodes/)的狀態是管理 Kubernetes
叢集的一個關鍵方面。在本文中，我們將簡要介紹如何監控和維護節點狀態以確保叢集的健康和穩定。

<!--
## Node status fields

A Node's status contains the following information:

* [Addresses](#addresses)
* [Conditions](#condition)
* [Capacity and Allocatable](#capacity)
* [Info](#info)
-->
## 節點狀態字段  {#node-status-fields}

一個節點的狀態包含以下資訊:

* [地址（Addresses）](#addresses)
* [狀況（Condition）](#condition)
* [容量與可分配（Capacity）](#capacity)
* [資訊（Info）](#info)

<!--
You can use `kubectl` to view a Node's status and other details:

```shell
kubectl describe node <insert-node-name-here>
```

Each section of the output is described below.
-->
你可以使用 `kubectl` 來查看節點狀態和其他細節資訊：

```shell
kubectl describe node <節點名稱>
```

下面對輸出的每個部分進行詳細描述。

<!--
## Addresses

The usage of these fields varies depending on your cloud provider or bare metal configuration.
-->
### 地址   {#addresses}

這些字段的用法取決於你的雲服務商或者物理機設定。

<!--
* HostName: The hostname as reported by the node's kernel. Can be overridden via the kubelet
  `--hostname-override` parameter.
* ExternalIP: Typically the IP address of the node that is externally routable (available from
  outside the cluster).
* InternalIP: Typically the IP address of the node that is routable only within the cluster.
-->
* HostName：由節點的內核報告。可以通過 kubelet 的 `--hostname-override` 參數覆蓋。
* ExternalIP：通常是節點的可外部路由（從叢集外可訪問）的 IP 地址。
* InternalIP：通常是節點的僅可在叢集內部路由的 IP 地址。

<!--
## Conditions {#condition}

The `conditions` field describes the status of all `Running` nodes. Examples of conditions include:
-->
### 狀況   {#condition}

`conditions` 字段描述了所有 `Running` 節點的狀況。狀況的示例包括：

<!--
{{< table caption = "Node conditions, and a description of when each condition applies." >}}
| Node Condition       | Description |
|----------------------|-------------|
| `Ready`              | `True` if the node is healthy and ready to accept pods, `False` if the node is not healthy and is not accepting pods, and `Unknown` if the node controller has not heard from the node in the last `node-monitor-grace-period` (default is 50 seconds) |
| `DiskPressure`       | `True` if pressure exists on the disk size—that is, if the disk capacity is low; otherwise `False` |
| `MemoryPressure`     | `True` if pressure exists on the node memory—that is, if the node memory is low; otherwise `False` |
| `PIDPressure`        | `True` if pressure exists on the processes—that is, if there are too many processes on the node; otherwise `False` |
| `NetworkUnavailable` | `True` if the network for the node is not correctly configured, otherwise `False` |
{{< /table >}}
-->
{{< table caption = "節點狀況及每種狀況適用場景的描述" >}}
| 節點狀況       | 描述        |
|----------------|-------------|
| `Ready` | 如節點是健康的並已經準備好接收 Pod 則爲 `True`；`False` 表示節點不健康而且不能接收 Pod；`Unknown` 表示節點控制器在最近 `node-monitor-grace-period` 期間（預設 50 秒）沒有收到節點的消息 |
| `DiskPressure` | `True` 表示節點存在磁盤空間壓力，即磁盤可用量低，否則爲 `False` |
| `MemoryPressure` | `True` 表示節點存在內存壓力，即節點內存可用量低，否則爲 `False` |
| `PIDPressure` | `True` 表示節點存在進程壓力，即節點上進程過多；否則爲 `False` |
| `NetworkUnavailable` | `True` 表示節點網路設定不正確；否則爲 `False` |
{{< /table >}}

{{< note >}}
<!--
If you use command-line tools to print details of a cordoned Node, the Condition includes
`SchedulingDisabled`. `SchedulingDisabled` is not a Condition in the Kubernetes API; instead,
cordoned nodes are marked Unschedulable in their spec.
-->
如果使用命令列工具來打印已保護（Cordoned）節點的細節，其中的 Condition 字段可能包括
`SchedulingDisabled`。`SchedulingDisabled` 不是 Kubernetes API 中定義的
Condition，被保護起來的節點在其規約中被標記爲不可調度（Unschedulable）。
{{< /note >}}

<!--
In the Kubernetes API, a node's condition is represented as part of the `.status`
of the Node resource. For example, the following JSON structure describes a healthy node:
-->
在 Kubernetes API 中，節點的狀況表示節點資源中 `.status` 的一部分。
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
When problems occur on nodes, the Kubernetes control plane automatically creates
[taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) that match the conditions
affecting the node. An example of this is when the `status` of the Ready condition
remains `Unknown` or `False` for longer than the kube-controller-manager's `NodeMonitorGracePeriod`,
which defaults to 50 seconds. This will cause either an `node.kubernetes.io/unreachable` taint, for an `Unknown` status,
or a `node.kubernetes.io/not-ready` taint, for a `False` status, to be added to the Node.
-->
當節點上出現問題時，Kubernetes 控制面會自動創建與影響節點的狀況對應的
[污點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
例如當 Ready 狀況的 `status` 保持 `Unknown` 或 `False` 的時間長於
kube-controller-manager 的 `NodeMonitorGracePeriod`（預設爲 50 秒）時，
會造成 `Unknown` 狀態下爲節點添加 `node.kubernetes.io/unreachable` 污點或在
`False` 狀態下爲節點添加 `node.kubernetes.io/not-ready` 污點。

<!--
These taints affect pending pods as the scheduler takes the Node's taints into consideration when
assigning a pod to a Node. Existing pods scheduled to the node may be evicted due to the application
of `NoExecute` taints. Pods may also have {{< glossary_tooltip text="tolerations" term_id="toleration" >}} that let
them schedule to and continue running on a Node even though it has a specific taint.
-->
這些污點會影響懸決的 Pod，因爲調度器在將 Pod 分配到節點時會考慮節點的污點。
已調度到節點的當前 Pod 可能會由於施加的 `NoExecute` 污點被驅逐。
Pod 還可以設置{{< glossary_tooltip text="容忍度" term_id="toleration" >}}，
使得這些 Pod 仍然能夠調度到且繼續運行在設置了特定污點的節點上。

<!--
See [Taint Based Evictions](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions) and
[Taint Nodes by Condition](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)
for more details.
-->
進一步的細節可參閱[基於污點的驅逐](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions)
和[根據狀況爲節點設置污點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)。

<!--
## Capacity and Allocatable {#capacity}

Describes the resources available on the node: CPU, memory, and the maximum
number of pods that can be scheduled onto the node.
-->
### 容量（Capacity）與可分配（Allocatable）     {#capacity}

這兩個值描述節點上的可用資源：CPU、內存和可以調度到節點上的 Pod 的個數上限。

<!--
The fields in the capacity block indicate the total amount of resources that a
Node has. The allocatable block indicates the amount of resources on a
Node that is available to be consumed by normal Pods.
-->
`capacity` 塊中的字段標示節點擁有的資源總量。
`allocatable` 塊指示節點上可供普通 Pod 使用的資源量。

<!--
You may read more about capacity and allocatable resources while learning how
to [reserve compute resources](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
on a Node.
-->
你可以通過學習如何在節點上[預留計算資源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
來進一步瞭解有關容量和可分配資源的資訊。

<!--
## Info

Describes general information about the node, such as kernel version, Kubernetes
version (kubelet and kube-proxy version), container runtime details, and which
operating system the node uses.
The kubelet gathers this information from the node and publishes it into
the Kubernetes API.
-->
### 資訊（Info） {#info}

Info 指的是節點的一般資訊，如內核版本、Kubernetes 版本（`kubelet` 和 `kube-proxy` 版本）、
容器運行時詳細資訊，以及節點使用的操作系統。
`kubelet` 從節點收集這些資訊並將其發佈到 Kubernetes API。

<!--
## Heartbeats

Heartbeats, sent by Kubernetes nodes, help your cluster determine the
availability of each node, and to take action when failures are detected.
-->
## 心跳   {#heartbeats}

Kubernetes 節點發送的心跳幫助你的叢集確定每個節點的可用性，並在檢測到故障時採取行動。

<!--
For nodes there are two forms of heartbeats:

* updates to the `.status` of a Node
* [Lease](/docs/concepts/architecture/leases/) objects
  within the `kube-node-lease`
  {{< glossary_tooltip term_id="namespace" text="namespace">}}.
  Each Node has an associated Lease object.
-->
對於節點，有兩種形式的心跳：

* 更新節點的 `.status`
* `kube-node-lease` {{<glossary_tooltip term_id="namespace" text="名字空間">}}中的
  [Lease（租約）](/zh-cn/docs/concepts/architecture/leases/)對象。
  每個節點都有一個關聯的 Lease 對象。

<!--
Compared to updates to `.status` of a Node, a Lease is a lightweight resource.
Using Leases for heartbeats reduces the performance impact of these updates
for large clusters.

The kubelet is responsible for creating and updating the `.status` of Nodes,
and for updating their related Leases.
-->
與節點的 `.status` 更新相比，Lease 是一種輕量級資源。
使用 Lease 來表達心跳在大型叢集中可以減少這些更新對性能的影響。

kubelet 負責創建和更新節點的 `.status`，以及更新它們對應的 Lease。

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
- 當節點狀態發生變化時，或者在設定的時間間隔內沒有更新事件時，kubelet 會更新 `.status`。
  `.status` 更新的預設間隔爲 5 分鐘（比節點不可達事件的 40 秒預設超時時間長很多）。
- `kubelet` 會創建並每 10 秒（預設更新間隔時間）更新 Lease 對象。
  Lease 的更新獨立於節點的 `.status` 更新而發生。
  如果 Lease 的更新操作失敗，kubelet 會採用指數回退機制，從 200 毫秒開始重試，
  最長重試間隔爲 7 秒鐘。
