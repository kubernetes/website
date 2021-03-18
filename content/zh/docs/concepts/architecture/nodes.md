---
title: 节点
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
contains the services necessary to run
{{< glossary_tooltip text="Pods" term_id="pod" >}}, managed by the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.

Typically you have several nodes in a cluster; in a learning or resource-limited
environment, you might have just one.

The [components](/docs/concepts/overview/components/#node-components) on a node include the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, a
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, and the
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}.
-->
Kubernetes 通过将容器放入在节点（Node）上运行的 Pod 中来执行你的工作负载。
节点可以是一个虚拟机或者物理机器，取决于所在的集群配置。
每个节点包含运行 {{< glossary_tooltip text="Pods" term_id="pod" >}} 所需的服务，
这些 Pods 由 {{< glossary_tooltip text="控制面" term_id="control-plane" >}} 负责管理。

通常集群中会有若干个节点；而在一个学习用或者资源受限的环境中，你的集群中也可能
只有一个节点。

节点上的[组件](/zh/docs/concepts/overview/components/#node-components)包括
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}、
{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}以及
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}。

<!-- body -->
<!--
## Management

There are two main ways to have Nodes added to the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}:

1. The kubelet on a node self-registers to the control plane
2. You, or another human user, manually add a Node object

After you create a Node object, or the kubelet on a node self-registers, the
control plane checks whether the new Node object is valid. For example, if you
try to create a Node from the following JSON manifest:
-->
## 管理  {#management}

向 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver"
>}}添加节点的方式主要有两种：

1. 节点上的 `kubelet` 向控制面执行自注册；
2. 你，或者别的什么人，手动添加一个 Node 对象。

在你创建了 Node 对象或者节点上的 `kubelet` 执行了自注册操作之后，
控制面会检查新的 Node 对象是否合法。例如，如果你使用下面的 JSON
对象来创建 Node 对象：

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
Kubernetes 会在内部创建一个 Node 对象作为节点的表示。Kubernetes 检查 `kubelet`
向 API 服务器注册节点时使用的 `metadata.name` 字段是否匹配。
如果节点是健康的（即所有必要的服务都在运行中），则该节点可以用来运行 Pod。
否则，直到该节点变为健康之前，所有的集群活动都会忽略该节点。 

<!--
Kubernetes keeps the object for the invalid Node and continues checking to see whether
it becomes healthy.
You, or a {{< glossary_tooltip term_id="controller" text="controller">}}, must explicitly
delete the Node object to stop that health checking.
-->
{{< note >}}
Kubernetes 会一直保存着非法节点对应的对象，并持续检查该节点是否已经
变得健康。
你，或者某个{{< glossary_tooltip term_id="controller" text="控制器">}}必需显式地
删除该 Node 对象以停止健康检查操作。
{{< /note >}}

<!--
The name of a Node object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
Node 对象的名称必须是合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
### Self-registration of Nodes

When the kubelet flag `-register-node` is true (the default), the kubelet will attempt to
register itself with the API server.  This is the preferred pattern, used by most distros.

For self-registration, the kubelet is started with the following options:
-->
### 节点自注册 {#self-registration-of-nodes}

当 kubelet 标志 `--register-node` 为 true（默认）时，它会尝试向 API 服务注册自己。
这是首选模式，被绝大多数发行版选用。

对于自注册模式，kubelet 使用下列参数启动：

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
  - `--kubeconfig` - 用于向 API 服务器表明身份的凭据路径。
  - `--cloud-provider` - 与某{{< glossary_tooltip text="云驱动" term_id="cloud-provider" >}}
    进行通信以读取与自身相关的元数据的方式。
  - `--register-node` - 自动向 API 服务注册。
  - `--register-with-taints` - 使用所给的污点列表（逗号分隔的 `<key>=<value>:<effect>`）注册节点。
    当 `register-node` 为 false 时无效。
  - `--node-ip` - 节点 IP 地址。
  - `--node-labels` - 在集群中注册节点时要添加的
    {{< glossary_tooltip text="标签" term_id="label" >}}。
    （参见 [NodeRestriction 准入控制插件](/zh/docs/reference/access-authn-authz/admission-controllers/#noderestriction)所实施的标签限制）。
  - `--node-status-update-frequency` - 指定 kubelet 向控制面发送状态的频率。

<!--
When the [Node authorization mode](/docs/reference/access-authn-authz/node/) and
[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) are enabled,
kubelets are only authorized to create/modify their own Node resource.
-->
启用[节点授权模式](/zh/docs/reference/access-authn-authz/node/)和
[NodeRestriction 准入插件](/zh/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
时，仅授权 `kubelet` 创建或修改其自己的节点资源。

<!--
### Manual Node administration

You can create and modify Node objects using
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}.

When you want to create Node objects manually, set the kubelet flag `--register-node=false`.

You can modify Node objects regardless of the setting of `--register-node`.
For example, you can set labels on an existing Node, or mark it unschedulable.
-->
### 手动节点管理 {#manual-node-administration}

你可以使用 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
来创建和修改 Node 对象。

如果你希望手动创建节点对象时，请设置 kubelet 标志 `--register-node=false`。

你可以修改 Node 对象（忽略 `--register-node` 设置）。
例如，修改节点上的标签或标记其为不可调度。

<!--
You can use labels on Nodes in conjunction with node selectors on Pods to control
scheduling. For example, you can to constrain a Pod to only be eligible to run on
a subset of the available nodes.

Marking a node as unschedulable prevents the scheduler from placing new pods onto
that Node, but does not affect existing Pods on the Node. This is useful as a
preparatory step before a node reboot or other maintenance.

To mark a Node unschedulable, run:
-->
你可以结合使用节点上的标签和 Pod 上的选择算符来控制调度。
例如，你可以限制某 Pod 只能在符合要求的节点子集上运行。

如果标记节点为不可调度（unschedulable），将阻止新 Pod 调度到该节点之上，但不会
影响任何已经在其上的 Pod。
这是重启节点或者执行其他维护操作之前的一个有用的准备步骤。

要标记一个节点为不可调度，执行以下命令：

```shell
kubectl cordon $NODENAME
```

<!--
Pods that are part of a {{< glossary_tooltip term_id="daemonset" >}} tolerate
being run on an unschedulable Node. DaemonSets typically provide node-local services
that should run on the Node even if it is being drained of workload applications.
-->
{{< note >}}
被 {{< glossary_tooltip term_id="daemonset" text="DaemonSet" >}} 控制器创建的 Pod
能够容忍节点的不可调度属性。
DaemonSet 通常提供节点本地的服务，即使节点上的负载应用已经被腾空，这些服务也仍需
运行在节点之上。
{{< /note >}}

<!--
## Node Status

A node's status contains the following information:

* [Addresses](#addresses)
* [Conditions](#condition)
* [Capacity and Allocatable](#capacity)
* [Info](#info)
-->
## 节点状态   {#node-status}

一个节点的状态包含以下信息:

* [地址](#addresses)
* [状况](#condition)
* [容量与可分配](#capacity)
* [信息](#info)

<!--
You can use `kubectl` to view a Node's status and other details:
-->
你可以使用 `kubectl` 来查看节点状态和其他细节信息：

```shell
kubectl describe node <节点名称>
```

<!-- Each section is described in detail below. -->
下面对每个部分进行详细描述。

<!--
### Addresses

The usage of these fields varies depending on your cloud provider or bare metal configuration.
-->
### 地址   {#addresses}

这些字段的用法取决于你的云服务商或者物理机配置。

<!--
* HostName: The as reported by the node's kernel. Can be overridden via the kubelet `-hostname-override` parameter.
* ExternalIP: Typically the IP address of the node that is externally routable (available from outside the cluster).
* InternalIP: Typichostnameally the IP address of the node that is routable only within the cluster.
-->
* HostName：由节点的内核设置。可以通过 kubelet 的 `--hostname-override` 参数覆盖。
* ExternalIP：通常是节点的可外部路由（从集群外可访问）的 IP 地址。
* InternalIP：通常是节点的仅可在集群内部路由的 IP 地址。

<!--
### Conditions {#condition}

The `conditions` field describes the status of all `Running` nodes. Examples of conditions include:
-->
### 状况 {#condition}

`conditions` 字段描述了所有 `Running` 节点的状态。状况的示例包括：

<!--
{{< table caption = "Node conditions, and a description of when each condition applies." >}}
| Node Condition | Description |
|----------------|-------------|
| `Ready`        | `True` if the node is healthy and ready to accept pods, `False` if the node is not healthy and is not accepting pods, and `Unknown` if the node controller has not heard from the node in the last `node-monitor-grace-period` (default is 40 seconds) |
| `DiskPressure`    | `True` if there is insufficient free space on the node for adding new pods, otherwise `False` |
| `MemoryPressure`    | `True` if pressure exists on the node memory - that is, if the node memory is low; otherwise `False` |
| `PIDPressure`    | `True` if pressure exists on the processes - that is, if there are too many processes on the node; otherwise `False` |
| `NetworkUnavailable`    | `True` if the network for the node is not correctly configured, otherwise `False` |
{{< /table >}}
-->
{{< table caption = "节点状况及每种状况适用场景的描述" >}}
| 节点状况       | 描述        |
|----------------|-------------|
| `Ready` | 如节点是健康的并已经准备好接收 Pod 则为 `True`；`False` 表示节点不健康而且不能接收 Pod；`Unknown` 表示节点控制器在最近 `node-monitor-grace-period` 期间（默认 40 秒）没有收到节点的消息 |
| `DiskPressure` | `True` 表示节点的空闲空间不足以用于添加新 Pod, 否则为 `False` |
| `MemoryPressure` | `True` 表示节点存在内存压力，即节点内存可用量低，否则为 `False` |
| `PIDPressure` | `True` 表示节点存在进程压力，即节点上进程过多；否则为 `False` |
| `NetworkUnavailable` | `True` 表示节点网络配置不正确；否则为 `False` |
{{< /table >}}

<!--
If you use command-line tools to print details of a cordoned Node, the Condition includes
`SchedulingDisabled`. `SchedulingDisabled` is not a Condition in the Kubernetes API; instead,
cordoned nodes are marked Unschedulable in their spec.
-->
{{< note >}}
如果使用命令行工具来打印已保护（Cordoned）节点的细节，其中的 Condition 字段可能
包括 `SchedulingDisabled`。`SchedulingDisabled` 不是 Kubernetes API 中定义的
Condition，被保护起来的节点在其规约中被标记为不可调度（Unschedulable）。
{{< /note >}}

<!--
The node condition is represented as a JSON object. For example, the following response describes a healthy node.
-->
节点条件使用 JSON 对象表示。例如，下面的响应描述了一个健康的节点。

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
If the Status of the Ready condition remains `Unknown` or `False` for longer than the `pod-eviction-timeout`, an argument is passed to the {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}), all the Pods on the node are scheduled for deletion by the Node Controller. The default eviction timeout duration is **five minutes**. In some cases when the node is unreachable, the apiserver is unable to communicate with the kubelet on the node. The decision to delete the pods cannot be communicated to the kubelet until communication with the API server is re-established. In the meantime, the pods that are scheduled for deletion may continue to run on the partitioned node.
-->
如果 Ready 条件处于 `Unknown` 或者 `False` 状态的时间超过了 `pod-eviction-timeout` 值，
（一个传递给 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}} 的参数），
节点上的所有 Pod 都会被节点控制器计划删除。默认的逐出超时时长为 **5 分钟**。
某些情况下，当节点不可达时，API 服务器不能和其上的 kubelet 通信。
删除 Pod 的决定不能传达给 kubelet，直到它重新建立和 API 服务器的连接为止。
与此同时，被计划删除的 Pod 可能会继续在游离的节点上运行。

<!--
The node controller does not force delete pods until it is confirmed that they have stopped
running in the cluster. You can see the pods that might be running on an unreachable node as
being in the `Terminating` or `Unknown` state. In cases where Kubernetes cannot deduce from the
underlying infrastructure if a node has permanently left a cluster, the cluster administrator
may need to delete the node object by hand.  Deleting the node object from Kubernetes causes
all the Pod objects running on the node to be deleted from the API server, and frees up their
names.
-->
节点控制器在确认 Pod 在集群中已经停止运行前，不会强制删除它们。
你可以看到这些可能在无法访问的节点上运行的 Pod 处于 `Terminating` 或者 `Unknown` 状态。
如果 kubernetes 不能基于下层基础设施推断出某节点是否已经永久离开了集群，
集群管理员可能需要手动删除该节点对象。
从 Kubernetes 删除节点对象将导致 API 服务器删除节点上所有运行的 Pod 对象并释放它们的名字。

<!--
The node lifecycle controller automatically creates
[taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) that represent conditions.
The scheduler takes the Node's taints into consideration when assigning a Pod to a Node.
Pods can also have tolerations which let them tolerate a Node's taints.
-->
节点生命周期控制器会自动创建代表状况的
[污点](/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)。
当调度器将 Pod 指派给某节点时，会考虑节点上的污点。
Pod 则可以通过容忍度（Toleration）表达所能容忍的污点。

<!--
### Capacity and Allocatable {#capacity}

Describes the resources available on the node: CPU, memory and the maximum
number of pods that can be scheduled onto the node.
-->
### 容量与可分配 {#capacity}

描述节点上的可用资源：CPU、内存和可以调度到节点上的 Pod 的个数上限。

<!--
The fields in the capacity block indicate the total amount of resources that a
Node has. The allocatable block indicates the amount of resources on a
Node that is available to be consumed by normal Pods.
-->
`capacity` 块中的字段标示节点拥有的资源总量。
`allocatable` 块指示节点上可供普通 Pod 消耗的资源量。

<!--
You may read more about capacity and allocatable resources while learning how
to [reserve compute resources](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) on a Node.
-->
可以在学习如何在节点上[预留计算资源](/zh/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
的时候了解有关容量和可分配资源的更多信息。

<!--
### Info

Describes general information about the node, such as kernel version, Kubernetes version (kubelet and kube-proxy version), Docker version (if used), and OS name.
This information is gathered by Kubelet from the node.
-->

### 信息 {#info}

关于节点的一般性信息，例如内核版本、Kubernetes 版本（`kubelet` 和 `kube-proxy` 版本）、
Docker 版本（如果使用了）和操作系统名称。这些信息由 `kubelet` 从节点上搜集而来。

<!--
### Node Controller

The node {{< glossary_tooltip text="controller" term_id="controller" >}} is a
Kubernetes control plane component that manages various aspects of nodes.

The node controller has multiple roles in a node's life. The first is assigning a
CIDR block to the node when it is registered (if CIDR assignment is turned on).
-->
### 节点控制器  {#node-controller}

节点{{< glossary_tooltip text="控制器" term_id="controller" >}}是
Kubernetes 控制面组件，管理节点的方方面面。

节点控制器在节点的生命周期中扮演多个角色。
第一个是当节点注册时为它分配一个 CIDR 区段（如果启用了 CIDR 分配）。

<!--
The second is keeping the node controller's internal list of nodes up to date with
the cloud provider's list of available machines. When running in a cloud
environment, whenever a node is unhealthy, the node controller asks the cloud
provider if the VM for that node is still available. If not, the node
controller deletes the node from its list of nodes.
-->
第二个是保持节点控制器内的节点列表与云服务商所提供的可用机器列表同步。
如果在云环境下运行，只要某节点不健康，节点控制器就会询问云服务是否节点的虚拟机仍可用。
如果不可用，节点控制器会将该节点从它的节点列表删除。

<!--
The third is monitoring the nodes' health. The node controller is
responsible for updating the NodeReady condition of NodeStatus to
ConditionUnknown when a node becomes unreachable (i.e. the node controller stops
receiving heartbeats for some reason, e.g. due to the node being down), and then later evicting
all the pods from the node (using graceful termination) if the node continues
to be unreachable. (The default timeouts are 40s to start reporting
ConditionUnknown and 5m after that to start evicting pods.) The node controller
checks the state of each node every `-node-monitor-period` seconds.
-->
第三个是监控节点的健康情况。节点控制器负责在节点不可达
（即，节点控制器因为某些原因没有收到心跳，例如节点宕机）时，
将节点状态的 `NodeReady` 状况更新为 "`Unknown`"。
如果节点接下来持续处于不可达状态，节点控制器将逐出节点上的所有 Pod（使用优雅停机 graceful termination）。
默认情况下 40 秒后开始报告 "`Unknown`"，在那之后 5 分钟开始逐出 Pod。
节点控制器每隔 `--node-monitor-period` 秒检查每个节点的状态。

<!--
#### Heartbeats

Heartbeats, sent by Kubernetes nodes, help determine the availability of a node.
There are two forms of heartbeats: updates of `NodeStatus` and the
[Lease object](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/#lease-v1-coordination-k8s-io).
Each Node has an associated Lease object in the `kube-node-lease`
{{< glossary_tooltip term_id="namespace" text="namespace">}}.
Lease is a lightweight resource, which improves the performance
of the node heartbeats as the cluster scales.
-->
#### 心跳机制  {#heartbeats}

Kubernetes 节点发送的心跳（Heartbeats）有助于确定节点的可用性。
心跳有两种形式：`NodeStatus` 和 [`Lease` 对象](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lease-v1-coordination-k8s-io)。
每个节点在 `kube-node-lease`{{< glossary_tooltip term_id="namespace" text="名字空间">}}
中都有一个与之关联的 `Lease` 对象。
`Lease` 是一种轻量级的资源，可在集群规模扩大时提高节点心跳机制的性能。

<!--
The kubelet is responsible for creating and updating the `NodeStatus` and
a Lease object.
-->
`kubelet` 负责创建和更新 `NodeStatus` 和 `Lease` 对象。

<!--
- The kubelet updates the `NodeStatus` either when there is change in status,
  or if there has been no update for a configured interval. The default interval
  for `NodeStatus` updates is 5 minutes (much longer than the 40 second default
  timeout for unreachable nodes).
- The kubelet creates and then updates its Lease object every 10 seconds
  (the default update interval). Lease updates occur independently from the
  `NodeStatus` updates. If the Lease update fails, the kubelet retries with
  exponential backoff starting at 200 milliseconds and capped at 7 seconds.

-->
- 当状态发生变化时，或者在配置的时间间隔内没有更新事件时，kubelet 会更新 `NodeStatus`。
  `NodeStatus` 更新的默认间隔为 5 分钟（比不可达节点的 40 秒默认超时时间长很多）。
- `kubelet` 会每 10 秒（默认更新间隔时间）创建并更新其 `Lease` 对象。
  `Lease` 更新独立于 `NodeStatus` 更新而发生。
  如果 `Lease` 的更新操作失败，`kubelet` 会采用指数回退机制，从 200 毫秒开始
  重试，最长重试间隔为 7 秒钟。

<!--
#### Reliability

In most cases, the node controller limits the eviction rate to
`-node-eviction-rate` (default 0.1) per second, meaning it won't evict pods
from more than 1 node per 10 seconds.
-->
#### 可靠性  {#reliability}

大部分情况下，节点控制器把逐出速率限制在每秒 `--node-eviction-rate` 个（默认为 0.1）。
这表示它每 10 秒钟内至多从一个节点驱逐 Pod。

<!--
The node eviction behavior changes when a node in a given availability zone
becomes unhealthy. The node controller checks what percentage of nodes in the zone
are unhealthy (NodeReady condition is ConditionUnknown or ConditionFalse) at
the same time. If the fraction of unhealthy nodes is at least
`-unhealthy-zone-threshold` (default 0.55) then the eviction rate is reduced:
if the cluster is small (i.e. has less than or equal to
`-large-cluster-size-threshold` nodes - default 50) then evictions are
stopped, otherwise the eviction rate is reduced to
`-secondary-node-eviction-rate` (default 0.01) per second. The reason these
policies are implemented per availability zone is because one availability zone
might become partitioned from the master while the others remain connected. If
your cluster does not span multiple cloud provider availability zones, then
there is only one availability zone (the whole cluster).
-->
当一个可用区域（Availability Zone）中的节点变为不健康时，节点的驱逐行为将发生改变。
节点控制器会同时检查可用区域中不健康（NodeReady 状况为 Unknown 或 False）
的节点的百分比。如果不健康节点的比例超过 `--unhealthy-zone-threshold` （默认为 0.55），
驱逐速率将会降低：如果集群较小（意即小于等于 `--large-cluster-size-threshold`
个节点 - 默认为 50），驱逐操作将会停止，否则驱逐速率将降为每秒
`--secondary-node-eviction-rate` 个（默认为 0.01）。
在单个可用区域实施这些策略的原因是当一个可用区域可能从控制面脱离时其它可用区域
可能仍然保持连接。
如果你的集群没有跨越云服务商的多个可用区域，那（整个集群）就只有一个可用区域。

<!--
A key reason for spreading your nodes across availability zones is so that the
workload can be shifted to healthy zones when one entire zone goes down.
Therefore, if all nodes in a zone are unhealthy then node controller evicts at
the normal rate `-node-eviction-rate`.  The corner case is when all zones are
completely unhealthy (i.e. there are no healthy nodes in the cluster). In such
case, the node controller assumes that there's some problem with master
connectivity and stops all evictions until some connectivity is restored.
-->
跨多个可用区域部署你的节点的一个关键原因是当某个可用区域整体出现故障时，
工作负载可以转移到健康的可用区域。
因此，如果一个可用区域中的所有节点都不健康时，节点控制器会以正常的速率
`--node-eviction-rate` 进行驱逐操作。
在所有的可用区域都不健康（也即集群中没有健康节点）的极端情况下，
节点控制器将假设控制面节点的连接出了某些问题，
它将停止所有驱逐动作直到一些连接恢复。

<!--
The Node Controller is also responsible for evicting pods running on nodes with
`NoExecute` taints, unless the pods do not tolerate the taints.
The Node Controller also adds {{< glossary_tooltip text="taints" term_id="taint" >}}
corresponding to node problems like node unreachable or not ready. This means
that the scheduler won't place Pods onto unhealthy nodes.
-->
节点控制器还负责驱逐运行在拥有 `NoExecute` 污点的节点上的 Pod，
除非这些 Pod 能够容忍此污点。
节点控制器还负责根据节点故障（例如节点不可访问或没有就绪）为其添加
{{< glossary_tooltip text="污点" term_id="taint" >}}。
这意味着调度器不会将 Pod 调度到不健康的节点上。

<!--
`kubectl cordon` marks a node as 'unschedulable', which has the side effect of the service
controller removing the node from any LoadBalancer node target lists it was previously 
eligible for, effectively removing incoming load balancer traffic from the cordoned node(s).
-->
{{< caution>}}
`kubectl cordon` 会将节点标记为“不可调度（Unschedulable）”。
此操作的副作用是，服务控制器会将该节点从负载均衡器中之前的目标节点列表中移除，
从而使得来自负载均衡器的网络请求不会到达被保护起来的节点。
{{< /caution>}}

<!--
### Node capacity

Node objects track information about the Node's resource capacity (for example: the amount
of memory available, and the number of CPUs).
Nodes that [self register](#self-registration-of-nodes) report their capacity during
registration. If you [manually](#manual-node-administration) add a Node, then
you need to set the node's capacity information when you add it.
-->
### 节点容量   {#node-capacity}

Node 对象会跟踪节点上资源的容量（例如可用内存和 CPU 数量）。
通过[自注册](#self-registration-of-nodes)机制生成的 Node 对象会在注册期间报告自身容量。
如果你[手动](#manual-node-administration)添加了 Node，你就需要在添加节点时
手动设置节点容量。

<!--
The Kubernetes {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} ensures that
there are enough resources for all the pods on a node.  The scheduler checks that the sum
of the requests of containers on the node is no greater than the node capacity.
The sum of requests includes all containers started by the kubelet, but excludes any
containers started directly by the container runtime, and also excludes any
process running outside of the kubelet's control.
-->
Kubernetes {{< glossary_tooltip text="调度器" term_id="kube-scheduler" >}}保证节点上
有足够的资源供其上的所有 Pod 使用。它会检查节点上所有容器的请求的总和不会超过节点的容量。
总的请求包括由 kubelet 启动的所有容器，但不包括由容器运行时直接启动的容器，
也不包括不受 `kubelet` 控制的其他进程。

<!--
If you want to explicitly reserve resources for non-Pod processes, follow this tutorial to
[reserve resources for system daemons](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved).
-->
{{< note >}}
如果要为非 Pod 进程显式保留资源。请参考
[为系统守护进程预留资源](/zh/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)。
{{< /note >}}

<!--
## Node topology
-->
## 节点拓扑  {#node-topology}

{{< feature-state state="alpha" for_k8s_version="v1.16" >}}

<!--
If you have enabled the `TopologyManager`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/), then
the kubelet can use topology hints when making resource assignment decisions.
See [Control Topology Management Policies on a Node](/docs/tasks/administer-cluster/topology-manager/)
for more information.
-->
如果启用了 `TopologyManager` [特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)，
`kubelet` 可以在作出资源分配决策时使用拓扑提示。
参考[控制节点上拓扑管理策略](/zh/docs/tasks/administer-cluster/topology-manager/)
了解详细信息。

<!-- 
## Graceful Node Shutdown {#graceful-node-shutdown}
-->
## 节点体面关闭 {#graceful-node-shutdown}

{{< feature-state state="alpha" for_k8s_version="v1.20" >}}

<!-- 
If you have enabled the `GracefulNodeShutdown` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/), then the kubelet attempts to detect the node system shutdown and terminates pods running on the node.
Kubelet ensures that pods follow the normal [pod termination process](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) during the node shutdown.
-->
如果你启用了 `GracefulNodeShutdown` [特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)，
那么 kubelet 尝试检测节点的系统关闭事件并终止在节点上运行的 Pod。
在节点终止期间，kubelet 保证 Pod 遵从常规的 [Pod 终止流程](/zh/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)。

<!-- 
When the `GracefulNodeShutdown` feature gate is enabled, kubelet uses [systemd inhibitor locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit/) to delay the node shutdown with a given duration. During a shutdown kubelet terminates pods in two phases:
-->
当启用了 `GracefulNodeShutdown` 特性门控时，
kubelet 使用 [systemd 抑制器锁](https://www.freedesktop.org/wiki/Software/systemd/inhibit/)
在给定的期限内延迟节点关闭。在关闭过程中，kubelet 分两个阶段终止 Pod：

<!-- 
1. Terminate regular pods running on the node.
2. Terminate [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical) running on the node.
-->
1. 终止在节点上运行的常规 Pod。
2. 终止在节点上运行的[关键 Pod](/zh/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)。

<!-- 
Graceful Node Shutdown feature is configured with two [`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) options:
* `ShutdownGracePeriod`:
  * Specifies the total duration that the node should delay the shutdown by. This is the total grace period for pod termination for both regular and [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).
* `ShutdownGracePeriodCriticalPods`:
  * Specifies the duration used to terminate [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical) during a node shutdown. This should be less than `ShutdownGracePeriod`.
-->
节点体面关闭的特性对应两个 [`KubeletConfiguration`](/zh/docs/tasks/administer-cluster/kubelet-config-file/) 选项：
* `ShutdownGracePeriod`：
  * 指定节点应延迟关闭的总持续时间。此时间是 Pod 体面终止的时间总和，不区分常规 Pod 还是
    [关键 Pod](/zh/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)。
* `ShutdownGracePeriodCriticalPods`：
  * 在节点关闭期间指定用于终止
    [关键 Pod](/zh/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
    的持续时间。该值应小于 `ShutdownGracePeriod`。

<!--  
For example, if `ShutdownGracePeriod=30s`, and `ShutdownGracePeriodCriticalPods=10s`, kubelet will delay the node shutdown by 30 seconds. During the shutdown, the first 20 (30-10) seconds would be reserved for gracefully terminating normal pods, and the last 10 seconds would be reserved for terminating [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).
-->
例如，如果设置了 `ShutdownGracePeriod=30s` 和 `ShutdownGracePeriodCriticalPods=10s`，则 kubelet 将延迟 30 秒关闭节点。
在关闭期间，将保留前 20（30 - 10）秒用于体面终止常规 Pod，而保留最后 10 秒用于终止
[关键 Pod](/zh/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)。

## {{% heading "whatsnext" %}}

<!--
* Learn about the [components](/docs/concepts/overview/components/#node-components) that make up a node.
* Read the [API definition for Node](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).
* Read the [Node](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node)
  section of the architecture design document.
* Read about [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
-->
* 了解有关节点[组件](/zh/docs/concepts/overview/components/#node-components)
* 阅读[节点的 API 定义](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core)
* 阅读架构设计文档中有关[节点](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node)的章节
* 了解[污点和容忍度](/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)

