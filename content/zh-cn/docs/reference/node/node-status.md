---
content_type: reference
title: 节点状态
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
在 Kubernetes 中，[节点](/zh-cn/docs/concepts/architecture/nodes/)的状态是管理 Kubernetes
集群的一个关键方面。在本文中，我们将简要介绍如何监控和维护节点状态以确保集群的健康和稳定。

<!--
## Node status fields

A Node's status contains the following information:

* [Addresses](#addresses)
* [Conditions](#condition)
* [Capacity and Allocatable](#capacity)
* [Info](#info)
-->
## 节点状态字段  {#node-status-fields}

一个节点的状态包含以下信息:

* [地址（Addresses）](#addresses)
* [状况（Condition）](#condition)
* [容量与可分配（Capacity）](#capacity)
* [信息（Info）](#info)

<!--
You can use `kubectl` to view a Node's status and other details:

```shell
kubectl describe node <insert-node-name-here>
```

Each section of the output is described below.
-->
你可以使用 `kubectl` 来查看节点状态和其他细节信息：

```shell
kubectl describe node <节点名称>
```

下面对输出的每个部分进行详细描述。

<!--
## Addresses

The usage of these fields varies depending on your cloud provider or bare metal configuration.
-->
### 地址   {#addresses}

这些字段的用法取决于你的云服务商或者物理机配置。

<!--
* HostName: The hostname as reported by the node's kernel. Can be overridden via the kubelet
  `--hostname-override` parameter.
* ExternalIP: Typically the IP address of the node that is externally routable (available from
  outside the cluster).
* InternalIP: Typically the IP address of the node that is routable only within the cluster.
-->
* HostName：由节点的内核报告。可以通过 kubelet 的 `--hostname-override` 参数覆盖。
* ExternalIP：通常是节点的可外部路由（从集群外可访问）的 IP 地址。
* InternalIP：通常是节点的仅可在集群内部路由的 IP 地址。

<!--
## Conditions {#condition}

The `conditions` field describes the status of all `Running` nodes. Examples of conditions include:
-->
### 状况   {#condition}

`conditions` 字段描述了所有 `Running` 节点的状况。状况的示例包括：

<!--
{{< table caption = "Node conditions, and a description of when each condition applies." >}}
| Node Condition       | Description |
|----------------------|-------------|
| `Ready`              | `True` if the node is healthy and ready to accept pods, `False` if the node is not healthy and is not accepting pods, and `Unknown` if the node controller has not heard from the node in the last `node-monitor-grace-period` (default is 40 seconds) |
| `DiskPressure`       | `True` if pressure exists on the disk size—that is, if the disk capacity is low; otherwise `False` |
| `MemoryPressure`     | `True` if pressure exists on the node memory—that is, if the node memory is low; otherwise `False` |
| `PIDPressure`        | `True` if pressure exists on the processes—that is, if there are too many processes on the node; otherwise `False` |
| `NetworkUnavailable` | `True` if the network for the node is not correctly configured, otherwise `False` |
{{< /table >}}
-->
{{< table caption = "节点状况及每种状况适用场景的描述" >}}
| 节点状况       | 描述        |
|----------------|-------------|
| `Ready` | 如节点是健康的并已经准备好接收 Pod 则为 `True`；`False` 表示节点不健康而且不能接收 Pod；`Unknown` 表示节点控制器在最近 `node-monitor-grace-period` 期间（默认 40 秒）没有收到节点的消息 |
| `DiskPressure` | `True` 表示节点存在磁盘空间压力，即磁盘可用量低，否则为 `False` |
| `MemoryPressure` | `True` 表示节点存在内存压力，即节点内存可用量低，否则为 `False` |
| `PIDPressure` | `True` 表示节点存在进程压力，即节点上进程过多；否则为 `False` |
| `NetworkUnavailable` | `True` 表示节点网络配置不正确；否则为 `False` |
{{< /table >}}

{{< note >}}
<!--
If you use command-line tools to print details of a cordoned Node, the Condition includes
`SchedulingDisabled`. `SchedulingDisabled` is not a Condition in the Kubernetes API; instead,
cordoned nodes are marked Unschedulable in their spec.
-->
如果使用命令行工具来打印已保护（Cordoned）节点的细节，其中的 Condition 字段可能包括
`SchedulingDisabled`。`SchedulingDisabled` 不是 Kubernetes API 中定义的
Condition，被保护起来的节点在其规约中被标记为不可调度（Unschedulable）。
{{< /note >}}

<!--
In the Kubernetes API, a node's condition is represented as part of the `.status`
of the Node resource. For example, the following JSON structure describes a healthy node:
-->
在 Kubernetes API 中，节点的状况表示节点资源中 `.status` 的一部分。
例如，以下 JSON 结构描述了一个健康节点：

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
which defaults to 40 seconds. This will cause either an `node.kubernetes.io/unreachable` taint, for an `Unknown` status,
or a `node.kubernetes.io/not-ready` taint, for a `False` status, to be added to the Node.
-->
当节点上出现问题时，Kubernetes 控制面会自动创建与影响节点的状况对应的
[污点](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
例如当 Ready 状况的 `status` 保持 `Unknown` 或 `False` 的时间长于
kube-controller-manager 的 `NodeMonitorGracePeriod`（默认为 40 秒）时，
会造成 `Unknown` 状态下为节点添加 `node.kubernetes.io/unreachable` 污点或在
`False` 状态下为节点添加 `node.kubernetes.io/not-ready` 污点。

<!--
These taints affect pending pods as the scheduler takes the Node's taints into consideration when
assigning a pod to a Node. Existing pods scheduled to the node may be evicted due to the application
of `NoExecute` taints. Pods may also have {{< glossary_tooltip text="tolerations" term_id="toleration" >}} that let
them schedule to and continue running on a Node even though it has a specific taint.
-->
这些污点会影响悬决的 Pod，因为调度器在将 Pod 分配到节点时会考虑节点的污点。
已调度到节点的当前 Pod 可能会由于施加的 `NoExecute` 污点被驱逐。
Pod 还可以设置{{< glossary_tooltip text="容忍度" term_id="toleration" >}}，
使得这些 Pod 仍然能够调度到且继续运行在设置了特定污点的节点上。

<!--
See [Taint Based Evictions](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions) and
[Taint Nodes by Condition](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)
for more details.
-->
进一步的细节可参阅[基于污点的驱逐](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions)
和[根据状况为节点设置污点](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)。

<!--
## Capacity and Allocatable {#capacity}

Describes the resources available on the node: CPU, memory, and the maximum
number of pods that can be scheduled onto the node.
-->
### 容量（Capacity）与可分配（Allocatable）     {#capacity}

这两个值描述节点上的可用资源：CPU、内存和可以调度到节点上的 Pod 的个数上限。

<!--
The fields in the capacity block indicate the total amount of resources that a
Node has. The allocatable block indicates the amount of resources on a
Node that is available to be consumed by normal Pods.
-->
`capacity` 块中的字段标示节点拥有的资源总量。
`allocatable` 块指示节点上可供普通 Pod 使用的资源量。

<!--
You may read more about capacity and allocatable resources while learning how
to [reserve compute resources](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
on a Node.
-->
你可以通过学习如何在节点上[预留计算资源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
来进一步了解有关容量和可分配资源的信息。

<!--
## Info

Describes general information about the node, such as kernel version, Kubernetes
version (kubelet and kube-proxy version), container runtime details, and which
operating system the node uses.
The kubelet gathers this information from the node and publishes it into
the Kubernetes API.
-->
### 信息（Info） {#info}

Info 指的是节点的一般信息，如内核版本、Kubernetes 版本（`kubelet` 和 `kube-proxy` 版本）、
容器运行时详细信息，以及节点使用的操作系统。
`kubelet` 从节点收集这些信息并将其发布到 Kubernetes API。

<!--
## Heartbeats

Heartbeats, sent by Kubernetes nodes, help your cluster determine the
availability of each node, and to take action when failures are detected.
-->
## 心跳   {#heartbeats}

Kubernetes 节点发送的心跳帮助你的集群确定每个节点的可用性，并在检测到故障时采取行动。

<!--
For nodes there are two forms of heartbeats:

* updates to the `.status` of a Node
* [Lease](/docs/concepts/architecture/leases/) objects
  within the `kube-node-lease`
  {{< glossary_tooltip term_id="namespace" text="namespace">}}.
  Each Node has an associated Lease object.
-->
对于节点，有两种形式的心跳：

* 更新节点的 `.status`
* `kube-node-lease` {{<glossary_tooltip term_id="namespace" text="名字空间">}}中的
  [Lease（租约）](/zh-cn/docs/concepts/architecture/leases/)对象。
  每个节点都有一个关联的 Lease 对象。

<!--
Compared to updates to `.status` of a Node, a Lease is a lightweight resource.
Using Leases for heartbeats reduces the performance impact of these updates
for large clusters.

The kubelet is responsible for creating and updating the `.status` of Nodes,
and for updating their related Leases.
-->
与节点的 `.status` 更新相比，Lease 是一种轻量级资源。
使用 Lease 来表达心跳在大型集群中可以减少这些更新对性能的影响。

kubelet 负责创建和更新节点的 `.status`，以及更新它们对应的 Lease。

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
- 当节点状态发生变化时，或者在配置的时间间隔内没有更新事件时，kubelet 会更新 `.status`。
  `.status` 更新的默认间隔为 5 分钟（比节点不可达事件的 40 秒默认超时时间长很多）。
- `kubelet` 会创建并每 10 秒（默认更新间隔时间）更新 Lease 对象。
  Lease 的更新独立于节点的 `.status` 更新而发生。
  如果 Lease 的更新操作失败，kubelet 会采用指数回退机制，从 200 毫秒开始重试，
  最长重试间隔为 7 秒钟。
