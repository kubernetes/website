---
title: 节点
content_template: templates/concept
weight: 10
---
<!--
---
reviewers:
- caesarxuchao
- dchen1107
title: Nodes
content_template: templates/concept
weight: 10
---
-->

{{% capture overview %}}

<!--
A node is a worker machine in Kubernetes, previously known as a `minion`. A node
may be a VM or physical machine, depending on the cluster. Each node contains
the services necessary to run [pods](/docs/concepts/workloads/pods/pod/) and is managed by the master
components. The services on a node include the [container runtime](/docs/concepts/overview/components/#node-components), kubelet and kube-proxy. See
[The Kubernetes Node](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node) section in the
architecture design doc for more details.
-->
在 Kubernetes 中，节点（Node）是执行工作的机器，以前叫做 `minion`。根据你的集群环境，节点可以是一个虚拟机或者物理机器。每个节点都包含用于运行 [pods](/docs/concepts/workloads/pods/pod/) 的必要服务，并由主控组件管理。节点上的服务包括 [容器运行时](/docs/concepts/overview/components/#node-components)、kubelet 和 kube-proxy。查阅架构设计文档中 [Kubernetes 节点](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node) 一节获取更多细节。


{{% /capture %}}


{{% capture body %}}

<!--
## Node Status
-->
## 节点状态

<!--
A node's status contains the following information:

* [Addresses](#addresses)
* [Conditions](#condition)
* [Capacity and Allocatable](#capacity)
* [Info](#info)
-->
一个节点的状态包含以下信息:

* [地址](#addresses)
* [条件](#condition)
* [容量与可分配](#capacity)
* [信息](#info)


<!--
Node status and other details about a node can be displayed using below command:
-->
可以使用以下命令显示节点状态和有关节点的其他详细信息：
```shell
kubectl describe node <insert-node-name-here>
```
<!--
Each section is described in detail below.
-->
下面对每个章节进行详细描述。

<!--
### Addresses
-->
### 地址

<!--
The usage of these fields varies depending on your cloud provider or bare metal configuration.
-->
这些字段组合的用法取决于你的云服务商或者裸机配置。

<!--
* HostName: The  as reported by the node's kernel. Can be overridden via the kubelet `--hostname-override` parameter.
* ExternalIP: Typically the IP address of the node that is externally routable (available from outside the cluster).
* InternalIP: Typichostnameally the IP address of the node that is routable only within the cluster.
-->
* HostName：由节点的内核指定。可以通过 kubelet 的 `--hostname-override` 参数覆盖。
* ExternalIP：通常是可以外部路由的节点 IP 地址（从集群外可访问）。
* InternalIP：通常是仅可在集群内部路由的节点 IP 地址。


<!--
### Conditions {#condition}
-->
### 条件 {#condition}

<!--
The `conditions` field describes the status of all `Running` nodes. Examples of conditions include:
-->
`conditions` 字段描述了所有 `Running` 节点的状态。条件的示例包括：

<!--
| Node Condition | Description |
|----------------|-------------|
| `OutOfDisk`    | `True` if there is insufficient free space on the node for adding new pods, otherwise `False` |
| `Ready`        | `True` if the node is healthy and ready to accept pods, `False` if the node is not healthy and is not accepting pods, and `Unknown` if the node controller has not heard from the node in the last `node-monitor-grace-period` (default is 40 seconds) |
| `MemoryPressure`    | `True` if pressure exists on the node memory -- that is, if the node memory is low; otherwise `False` |
| `PIDPressure`    | `True` if pressure exists on the processes -- that is, if there are too many processes on the node; otherwise `False` |
| `DiskPressure`    | `True` if pressure exists on the disk size -- that is, if the disk capacity is low; otherwise `False` |
| `NetworkUnavailable`    | `True` if the network for the node is not correctly configured, otherwise `False` |
-->
| 节点条件 | 描述 |
|----------------|-------------|
| `OutOfDisk`    | `True` 表示节点的空闲空间不足以用于添加新 pods, 否则为 `False` |
| `Ready`        | 表示节点是健康的并已经准备好接受 pods；`False` 表示节点不健康而且不能接受 pods；`Unknown` 表示节点控制器在最近 40 秒内没有收到节点的消息 |
| `MemoryPressure`    | `True` 表示节点存在内存压力 -- 即节点内存用量低，否则为 `False` |
| `PIDPressure`    | `True` 表示节点存在进程压力 -- 即进程过多；否则为 `False` |
| `DiskPressure`    | `True` 表示节点存在磁盘压力 -- 即磁盘可用量低，否则为 `False` |
| `NetworkUnavailable`    | `True` 表示节点网络配置不正确；否则为 `False` |

<!--
The node condition is represented as a JSON object. For example, the following response describes a healthy node.
-->
节点条件使用一个 JSON 对象表示。例如，下面的响应描述了一个健康的节点。

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
If the Status of the Ready condition remains `Unknown` or `False` for longer than the `pod-eviction-timeout`, an argument is passed to the [kube-controller-manager](/docs/admin/kube-controller-manager/) and all the Pods on the node are scheduled for deletion by the Node Controller. The default eviction timeout duration is **five minutes**. In some cases when the node is unreachable, the apiserver is unable to communicate with the kubelet on the node. The decision to delete the pods cannot be communicated to the kubelet until communication with the apiserver is re-established. In the meantime, the pods that are scheduled for deletion may continue to run on the partitioned node.
-->
如果 Ready 条件处于状态 `Unknown` 或者 `False` 的时间超过了 `pod-eviction-timeout`（一个传递给 [kube-controller-manager](/docs/admin/kube-controller-manager/) 的参数），节点上的所有 Pods 都会被节点控制器计划删除。默认的删除超时时长为**5 分钟**。某些情况下，当节点不可访问时，apiserver 不能和其上的 kubelet 通信。删除 pods 的决定不能传达给 kubelet，直到它重新建立和 apiserver 的连接为止。与此同时，被计划删除的 pods 可能会继续在分区节点上运行。


<!--
In versions of Kubernetes prior to 1.5, the node controller would [force delete](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods)
these unreachable pods from the apiserver. However, in 1.5 and higher, the node controller does not force delete pods until it is
confirmed that they have stopped running in the cluster. You can see the pods that might be running on an unreachable node as being in
the `Terminating` or `Unknown` state. In cases where Kubernetes cannot deduce from the underlying infrastructure if a node has
permanently left a cluster, the cluster administrator may need to delete the node object by hand.  Deleting the node object from
Kubernetes causes all the Pod objects running on the node to be deleted from the apiserver, and frees up their names.
-->
在 1.5 版本之前的 Kubernetes 里，节点控制器会将不能访问的 pods 从 apiserver 中[强制删除](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods)。但在 1.5 或更高的版本里，在节点控制器确认这些 pods 已经在集群停止运行前不会强制删除它们。你可以看到这些处于 `Terminating` 或者 `Unknown` 状态的 pods 可能在无法访问的节点上运行。为了防止 kubernetes 不能从底层基础设施中推断出一个节点是否已经永久的离开了集群，集群管理员可能需要手动删除这个节点对象。从 Kubernetes 删除节点对象将导致 apiserver 删除节点上所有运行的 Pod 对象并释放它们的名字。


<!--
The node lifecycle controller automatically creates
[taints](/docs/concepts/configuration/taint-and-toleration/) that represent conditions.
When the scheduler is assigning a Pod to a Node, the scheduler takes the Node's taints
into account, except for any taints that the Pod tolerates.
-->
节点生命周期控制器会自动创建代表条件的[污点](/docs/concepts/configuration/taint-and-toleration/)。
当调度器将 Pod 分配给节点时，调度器会考虑节点上的污点，但是 Pod 可以容忍的污点除外。

<!--
### Capacity and Allocatable {#capacity}
-->
### 容量与可分配 {#capacity}

<!--
Describes the resources available on the node: CPU, memory and the maximum
number of pods that can be scheduled onto the node.
-->
描述节点上的可用资源：CPU、内存和可以调度到节点上的 pods 的最大数量。

<!--
The fields in the capacity block indicate the total amount of resources that a
Node has. The allocatable block indicates the amount of resources on a
Node that is available to be consumed by normal Pods.
-->
capacity 块中的字段指示节点拥有的资源总量。allocatable 块指示节点上可供普通 Pod 消耗的资源量。

<!--
You may read more about capacity and allocatable resources while learning how
to [reserve compute resources](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) on a Node.
-->
可以在学习如何在节点上[保留计算资源](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)的同时阅读有关容量和可分配资源的更多信息。

<!--
### Info
-->
### 信息

<!--
Describes general information about the node, such as kernel version, Kubernetes version (kubelet and kube-proxy version), Docker version (if used), and OS name.
This information is gathered by Kubelet from the node.
-->
关于节点的通用信息，例如内核版本、Kubernetes 版本（kubelet 和 kube-proxy 版本）、Docker 版本（如果使用了）和操作系统名称。这些信息由 kubelet 从节点上搜集而来。

<!--
## Management
-->
## 管理

<!--
Unlike [pods](/docs/concepts/workloads/pods/pod/) and [services](/docs/concepts/services-networking/service/),
a node is not inherently created by Kubernetes: it is created externally by cloud
providers like Google Compute Engine, or it exists in your pool of physical or virtual
machines. So when Kubernetes creates a node, it creates
an object that represents the node. After creation, Kubernetes
checks whether the node is valid or not. For example, if you try to create
a node from the following content:
-->
与 [pods](/docs/concepts/workloads/pods/pod/) 和 [services](/docs/concepts/services-networking/service/) 不同，节点并不是在 Kubernetes 内部创建的：它是被外部的云服务商创建，例如 Google Compute Engine 或者你的集群中的物理或者虚拟机。这意味着当 Kubernetes 创建一个节点时，它其实仅仅创建了一个对象来代表这个节点。创建以后，Kubernetes 将检查这个节点是否可用。例如，如果你尝试使用如下内容创建一个节点：


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
Kubernetes creates a node object internally (the representation), and
validates the node by health checking based on the `metadata.name` field. If the node is valid -- that is, if all necessary
services are running -- it is eligible to run a pod. Otherwise, it is
ignored for any cluster activity until it becomes valid.
-->
Kubernetes 会在内部创一个 Node 对象（用以表示节点），并基于  `metadata.name` 字段执行健康检查，对节点进行验证。如果节点可用，意即所有必要服务都已运行，它就符合了运行一个 pod 的条件；否则它将被所有的集群动作忽略直到变为可用。

{{< note >}}
<!--
Kubernetes keeps the object for the invalid node and keeps checking to see whether it becomes valid.
You must explicitly delete the Node object to stop this process.--> Kubernetes 保留无效节点的对象，并继续检查它是否有效。必须显式删除 Node 对象以停止此过程。
{{< /note >}}

<!--
Currently, there are three components that interact with the Kubernetes node
interface: node controller, kubelet, and kubectl.
-->
当前，有 3 个组件同 Kubernetes 节点接口交互：节点控制器、kubelet 和 kubectl。

<!--
### Node Controller
-->
### 节点控制器

<!--
The node controller is a Kubernetes master component which manages various
aspects of nodes.
-->
节点控制器是一个 Kubernetes master 组件，管理节点的方方面面。

<!--
The node controller has multiple roles in a node's life. The first is assigning a
CIDR block to the node when it is registered (if CIDR assignment is turned on).
-->
节点控制器在节点的生命周期中扮演了多个角色。第一个是当节点注册时为它分配一个 CIDR block（如果打开了 CIDR 分配）。

<!--
The second is keeping the node controller's internal list of nodes up to date with
the cloud provider's list of available machines. When running in a cloud
environment, whenever a node is unhealthy, the node controller asks the cloud
provider if the VM for that node is still available. If not, the node
controller deletes the node from its list of nodes.
-->
第二个是使用云服务商提供了可用节点列表保持节点控制器内部的节点列表更新。如果在云环境下运行，任何时候当一个节点不健康时节点控制器将询问云服务节点的虚拟机是否可用。如果不可用，节点控制器会将这个节点从它的节点列表删除。

<!--
The third is monitoring the nodes' health. The node controller is
responsible for updating the NodeReady condition of NodeStatus to
ConditionUnknown when a node becomes unreachable (i.e. the node controller stops
receiving heartbeats for some reason, e.g. due to the node being down), and then later evicting
all the pods from the node (using graceful termination) if the node continues
to be unreachable. (The default timeouts are 40s to start reporting
ConditionUnknown and 5m after that to start evicting pods.) The node controller
checks the state of each node every `--node-monitor-period` seconds.
-->
第三个是监控节点的健康情况。节点控制器负责在节点不能访问时（也即是节点控制器因为某些原因没有收到心跳，例如节点宕机）将它的 NodeStatus 的 NodeReady 状态更新为 ConditionUnknown。后续如果节点持续不可访问，节点控制器将删除节点上的所有 pods（使用优雅终止）。（默认情况下 40s 开始报告 ConditionUnknown，在那之后 5m 开始删除 pods。）节点控制器每隔 `--node-monitor-period` 秒检查每个节点的状态。

<!--
#### Heartbeats
-->
#### 心跳机制

<!--
Heartbeats, sent by Kubernetes nodes, help determine the availability of a node.
There are two forms of heartbeats: updates of `NodeStatus` and the
[Lease object](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/#lease-v1-coordination-k8s-io).
Each Node has an associated Lease object in the `kube-node-lease`
{{< glossary_tooltip term_id="namespace" text="namespace">}}.
Lease is a lightweight resource, which improves the performance
of the node heartbeats as the cluster scales.
-->
Kubernetes 节点发送的心跳有助于确定节点的可用性。
心跳有两种形式：`NodeStatus` 和 [`Lease` 对象](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/#lease-v1-coordination-k8s-io)。
每个节点在 `kube-node-lease`{{< glossary_tooltip term_id="namespace" text="命名空间">}} 中都有一个关联的 `Lease` 对象。
`Lease` 是一种轻量级的资源，可在集群扩展时提高节点心跳机制的性能。

<!--
The kubelet is responsible for creating and updating the `NodeStatus` and
a Lease object.
-->
kubelet 负责创建和更新 `NodeStatus` 和 `Lease` 对象。

<!--
- The kubelet updates the `NodeStatus` either when there is change in status,
  or if there has been no update for a configured interval. The default interval
  for `NodeStatus` updates is 5 minutes (much longer than the 40 second default
  timeout for unreachable nodes).
- The kubelet creates and then updates its Lease object every 10 seconds
  (the default update interval). Lease updates occur independently from the
  `NodeStatus` updates.
-->
- 当状态发生变化时，或者在配置的时间间隔内没有更新时，kubelet 会更新 `NodeStatus`。
`NodeStatus` 更新的默认间隔为 5 分钟（比无法访问的节点的 40 秒默认超时时间长很多）。
- kubelet 会每 10 秒（默认更新间隔时间）创建并更新其 `Lease` 对象。`Lease` 更新独立于 `NodeStatus` 更新而发生。

<!--
#### Reliability
-->
#### 可靠性

<!--
In Kubernetes 1.4, we updated the logic of the node controller to better handle
cases when a large number of nodes have problems with reaching the master
(e.g. because the master has networking problem). Starting with 1.4, the node
controller looks at the state of all nodes in the cluster when making a
decision about pod eviction.
-->
在 Kubernetes 1.4 中我们更新了节点控制器逻辑以更好地处理大批量节点访问 master 出问题的情况（例如 master 的网络出了问题）。从 1.4 开始，节点控制器在决定删除 pod 之前会检查集群中所有节点的状态。

<!--
In most cases, node controller limits the eviction rate to
`--node-eviction-rate` (default 0.1) per second, meaning it won't evict pods
from more than 1 node per 10 seconds.
-->
大部分情况下，节点控制器把驱逐频率限制在每秒 `--node-eviction-rate` 个（默认为 0.1）。这表示它每 10 秒钟内至多从一个节点驱逐 Pods。

<!--
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
-->
当一个可用区域中的节点变为不健康时，它的驱逐行为将发生改变。节点控制器会同时检查可用区域中不健康（NodeReady  状态为 ConditionUnknown 或 ConditionFalse）的节点的百分比。如果不健康节点的部分超过 `--unhealthy-zone-threshold` （默认为 0.55），驱逐速率将会减小：如果集群较小（意即小于等于 `--large-cluster-size-threshold` 个 节点 - 默认为 50），驱逐操作将会停止，否则驱逐速率将降为每秒 `--secondary-node-eviction-rate` 个（默认为 0.01）。在单个可用区域实施这些策略的原因是当一个可用区域可能从 master 分区时其它的仍然保持连接。如果你的集群没有跨越云服务商的多个可用区域，那就只有一个可用区域整个集群）。

<!--
A key reason for spreading your nodes across availability zones is so that the
workload can be shifted to healthy zones when one entire zone goes down.
Therefore, if all nodes in a zone are unhealthy then node controller evicts at
the normal rate `--node-eviction-rate`.  The corner case is when all zones are
completely unhealthy (i.e. there are no healthy nodes in the cluster). In such
case, the node controller assumes that there's some problem with master
connectivity and stops all evictions until some connectivity is restored.
-->
在多个可用区域分布你的节点的一个关键原因是当整个可用区域故障时，工作负载可以转移到健康的可用区域。因此，如果一个可用区域中的所有节点都不健康时，节点控制器会以正常的速率 `--node-eviction-rate` 进行驱逐操作。在所有的可用区域都不健康（也即集群中没有健康节点）的极端情况下，节点控制器将假设 master 的连接出了某些问题，它将停止所有驱逐动作直到一些连接恢复。

<!--
Starting in Kubernetes 1.6, the NodeController is also responsible for evicting
pods that are running on nodes with `NoExecute` taints, when the pods do not tolerate
the taints. Additionally, as an alpha feature that is disabled by default, the
NodeController is responsible for adding taints corresponding to node problems like
node unreachable or not ready. See [this documentation](/docs/concepts/configuration/taint-and-toleration/)
for details about `NoExecute` taints and the alpha feature.
-->
从 Kubernetes 1.6 开始，NodeController 还负责驱逐运行在拥有 `NoExecute` 污点的节点上的 pods，如果这些 pods 没有容忍这些污点。此外，作为一个默认禁用的 alpha 特性，NodeController 还负责根据节点故障（例如节点不可访问或没有 ready）添加污点。请查看[这个文档](/docs/concepts/configuration/assign-pod-node/#taints-and-tolerations-beta-feature)了解关于 `NoExecute` 污点和这个 alpha 特性。


<!--
Starting in version 1.8, the node controller can be made responsible for creating taints that represent
Node conditions. This is an alpha feature of version 1.8.
-->
从版本 1.8 开始，可以使节点控制器负责创建代表节点条件的污点。这是版本 1.8 的 Alpha 功能。

<!--
### Self-Registration of Nodes
-->
### 节点自注册

<!--
When the kubelet flag `--register-node` is true (the default), the kubelet will attempt to
register itself with the API server.  This is the preferred pattern, used by most distros.
-->
当 kubelet 标志 `--register-node` 为 true （默认）时，它会尝试向 API 服务注册自己。这是首选模式，被绝大多数发行版选用。

<!--
For self-registration, the kubelet is started with the following options:
-->
  对于自注册模式，kubelet 使用下列参数启动：

<!--
  - `--kubeconfig` - Path to credentials to authenticate itself to the apiserver.
  - `--cloud-provider` - How to talk to a cloud provider to read metadata about itself.
  - `--register-node` - Automatically register with the API server.
  - `--register-with-taints` - Register the node with the given list of taints (comma separated `<key>=<value>:<effect>`). No-op if `register-node` is false.
  - `--node-ip` - IP address of the node.
  - `--node-labels` - Labels to add when registering the node in the cluster (see label restrictions enforced by the [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) in 1.13+).
  - `--node-status-update-frequency` - Specifies how often kubelet posts node status to master.
-->
  - `--kubeconfig` - 用于向 apiserver 验证自己的凭据路径。
  - `--cloud-provider` - 如何从云服务商读取关于自己的元数据。
  - `--register-node` - 自动向 API 服务注册。
  - `--register-with-taints` - 使用 taints 列表（逗号分隔的 `<key>=<value>:<effect>`）注册节点。当 `register-node` 为 false 时无效。
  - `--node-ip` - 节点 IP 地址。
  - `--node-labels` - 在集群中注册节点时要添加的标签（请参阅 [NodeRestriction 准入插件](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) 在 1.13+ 中实施的标签限制）。
  - `--node-status-update-frequency` - 指定 kubelet 向 master 发送状态的频率。

<!--
When the [Node authorization mode](/docs/reference/access-authn-authz/node/) and
[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) are enabled,
kubelets are only authorized to create/modify their own Node resource.
-->
启用[节点授权模式](/docs/reference/access-authn-authz/node/) 和 [NodeRestriction 准入插件](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)时，仅授权小组件创建或修改其自己的节点资源。

<!--
#### Manual Node Administration
-->
#### 手动节点管理

<!--
A cluster administrator can create and modify node objects.
-->
集群管理员可以创建及修改节点对象。

<!--
If the administrator wishes to create node objects manually, set the kubelet flag
`--register-node=false`.
-->
如果管理员希望手动创建节点对象，请设置 kubelet 标记 `--register-node=false`。

<!--
The administrator can modify node resources (regardless of the setting of `--register-node`).
Modifications include setting labels on the node and marking it unschedulable.
-->
管理员可以修改节点资源（忽略 `--register-node` 设置）。修改包括在节点上设置 labels 及标记它为不可调度。

<!--
Labels on nodes can be used in conjunction with node selectors on pods to control scheduling,
e.g. to constrain a pod to only be eligible to run on a subset of the nodes.
-->
节点上的 labels 可以和 pods 的节点 selectors 一起使用来控制调度，例如限制一个 pod 只能在一个符合要求的节点子集上运行。

<!--
Marking a node as unschedulable prevents new pods from being scheduled to that
node, but does not affect any existing pods on the node. This is useful as a
preparatory step before a node reboot, etc. For example, to mark a node
unschedulable, run this command:
-->
标记一个节点为不可调度的将防止新建 pods 调度到那个节点之上，但不会影响任何已经在它之上的 pods。这是重启节点等操作之前的一个有用的准备步骤。例如，标记一个节点为不可调度的，执行以下命令：


```shell
kubectl cordon $NODENAME
```

{{< note >}}
<!--
Pods created by a DaemonSet controller bypass the Kubernetes scheduler
and do not respect the unschedulable attribute on a node. This assumes that daemons belong on
the machine even if it is being drained of applications while it prepares for a reboot
-->
请注意，被 daemonSet 控制器创建的 pods 将忽略 Kubernetes 调度器，且不会遵照节点上不可调度的属性。这个假设基于守护程序属于节点机器，即使在准备重启而隔离应用的时候。
{{< /note >}}

<!--
### Node capacity
-->
### 节点容量

<!--
The capacity of the node (number of cpus and amount of memory) is part of the node object.
Normally, nodes register themselves and report their capacity when creating the node object. If
you are doing [manual node administration](#manual-node-administration), then you need to set node
capacity when adding a node.
-->
节点的容量（cpu 数量和内存容量）是节点对象的一部分。通常情况下，在创建节点对象时，它们会注册自己并报告自己的容量。如果你正在执行[手动节点管理](#manual-node-administration)，那么你需要在添加节点时手动设置节点容量。

<!--
The Kubernetes scheduler ensures that there are enough resources for all the pods on a node.  It
checks that the sum of the requests of containers on the node is no greater than the node capacity.  It
includes all containers started by the kubelet, but not containers started directly by the [container runtime](/docs/concepts/overview/components/#node-components) nor any process running outside of the containers.
-->
Kubernetes 调度器保证一个节点上有足够的资源供其上的所有 pods 使用。它会检查节点上所有容器要求的总和不会超过节点的容量。这包括由 kubelet 启动的所有容器，但不包括由 [container runtime](/docs/concepts/overview/components/#node-components) 直接启动的容器，也不包括在容器外部运行的任何进程。

<!--
If you want to explicitly reserve resources for non-Pod processes, follow this tutorial to
[reserve resources for system daemons](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved).
-->
如果要为非 Pod 进程显式保留资源。请按照本教程[为系统守护程序保留资源](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)。

<!--
## Node topology
-->
## 节点拓扑

{{< feature-state state="alpha" >}}

<!--
If you have enabled the `TopologyManager`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/), then
the kubelet can use topology hints when making resource assignment decisions.
-->
如果启用了 `TopologyManager` [功能开关](/docs/reference/command-line-tools-reference/feature-gates/)，则 kubelet 可以在做出资源分配决策时使用拓扑提示。

<!--
## API Object
-->
## API 对象

<!--
Node is a top-level resource in the Kubernetes REST API. More details about the
API object can be found at:
[Node API object](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).
-->
节点是 Kubernetes REST API 的顶级资源。更多关于 API 对象的细节可以在这里找到：[节点 API 对象](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core)。

{{% /capture %}}
{{% capture whatsnext %}}
<!--
* Read about [node components](https://kubernetes.io/docs/concepts/overview/components/#node-components)
* Read about node-level topology: [Control Topology Management Policies on a node](/docs/tasks/administer-cluster/topology-manager/)
-->
* 了解有关[节点组件](https://kubernetes.io/docs/concepts/overview/components/#node-components)的信息。
* 阅读有关节点级拓扑的信息：[控制节点上的拓扑管理策略](/docs/tasks/administer-cluster/topology-manager/)。
{{% /capture %}}
