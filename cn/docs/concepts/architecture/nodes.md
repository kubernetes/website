---
assignees:
- caesarxuchao
- dchen1107
title: Nodes
redirect_from:
- "/docs/admin/node/"
- "/docs/admin/node.html"
- "/docs/concepts/nodes/node/"
- "/docs/concepts/nodes/node.html"
---

<!--
title: Nodes
-->

* TOC
{:toc}

<!--
## What is a node?
-->
## Node 是什么？

<!--
A `node` is a worker machine in Kubernetes, previously known as a `minion`. A node
may be a VM or physical machine, depending on the cluster. Each node has
the services necessary to run [pods](/docs/user-guide/pods) and is managed by the master
components. The services on a node include Docker, kubelet and kube-proxy. See
[The Kubernetes Node](https://git.k8s.io/community/contributors/design-proposals/architecture.md#the-kubernetes-node) section in the
architecture design doc for more details.
-->
`Node` 是 Kubernetes 的工作节点，以前叫做 `minion`。取决于你的集群，Node 可以是一个虚拟机或者物理机器。每个 node 都有用于运行 [pods](/docs/user-guide/pods) 的必要服务，并由 master 组件管理。Node 上的服务包括 Docker、kubelet 和 kube-proxy。请查阅架构设计文档中 [The Kubernetes Node](https://git.k8s.io/community/contributors/design-proposals/architecture.md#the-kubernetes-node) 一节获取更多细节。

<!--
## Node Status
-->
## Node 状态

<!--
A node's status contains the following information:

* [Addresses](#Addresses)
* ~~[Phase](#Phase)~~ **deprecated**
* [Condition](#Condition)
* [Capacity](#Capacity)
* [Info](#Info)
  -->
  一个 node 的状态包含以下信息:

* [地址](#地址)
* ~~[阶段](#阶段)~~ **已废弃**
* [条件](#条件)
* [容量](#容量)
* [信息](#信息)

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

* HostName: The hostname as reported by the node's kernel. Can be overridden via the kubelet `--hostname-override` parameter.
* ExternalIP: Typically the IP address of the node that is externally routable (available from outside the cluster).
* InternalIP: Typically the IP address of the node that is routable only within the cluster.
-->
这些字段组合的用法取决于你的云服务商或者裸金属配置。

* HostName：HostName 和 node 内核报告的相同。可以通过 kubelet 的 `--hostname-override` 参数覆盖。
* ExternalIP：通常是可以外部路由的 node IP 地址（从集群外可访问）。
* InternalIP：通常是仅可在集群内部路由的 node IP 地址。

<!--
### Phase
-->
### 阶段

<!--
Deprecated: node phase is no longer used.
-->
已废弃：node 阶段已经不再使用。

<!--
### Condition
-->
### 条件

<!--
The `conditions` field describes the status of all `Running` nodes.
-->
`conditions` 字段描述了所有 `Running` nodes 的状态。

<!--
| Node Condition   | Description                              |
| ---------------- | ---------------------------------------- |
| `OutOfDisk`      | `True` if there is insufficient free space on the node for adding new pods, otherwise `False` |
| `Ready`          | `True` if the node is healthy and ready to accept pods, `False` if the node is not healthy and is not accepting pods, and `Unknown` if the node controller has not heard from the node in the last 40 seconds |
| `MemoryPressure`    | `True` if pressure exists on the node memory -- that is, if the node memory is low; otherwise `False` |
| `DiskPressure`    | `True` if pressure exists on the disk size -- that is, if the disk capacity is low; otherwise `False` |
-->
| Node 条件          | 描述                                       |
| ---------------- | ---------------------------------------- |
| `OutOfDisk`      | `True` 表示 node 的空闲空间不足以用于添加新 pods, 否则为 `False` |
| `Ready`          | `True` 表示 node 是健康的并已经准备好接受 pods；`False` 表示 node 不健康而且不能接受 pods；`Unknown` 表示 node 控制器在最近 40 秒内没有收到 node 的消息 |
| `MemoryPressure` | `True` 表示 node 不存在内存压力 -- 即 node 内存用量低, 否则为 `False`       |
| `DiskPressure`   | `True` 表示 node 不存在磁盘压力 -- 即磁盘用量低, 否则为 `False`       |

<!--
The node condition is represented as a JSON object. For example, the following response describes a healthy node.
-->
Node 条件使用一个 JSON 对象表示。例如，下面的响应描述了一个健康的 node。

```json
"conditions": [
  {
    "kind": "Ready",
    "status": "True"
  }
]
```

<!--
If the Status of the Ready condition is "Unknown" or "False" for longer than the `pod-eviction-timeout`, an argument passed to the [kube-controller-manager](/docs/admin/kube-controller-manager/), all of the Pods on the node are scheduled for deletion by the Node Controller. The default eviction timeout duration is **five minutes**. In some cases when the node is unreachable, the apiserver is unable to communicate with the kubelet on it. The decision to delete the pods cannot be communicated to the kubelet until it re-establishes communication with the apiserver. In the meantime, the pods which are scheduled for deletion may continue to run on the partitioned node.
-->
如果 Ready 条件处于状态 "Unknown" 或者 "False" 的时间超过了 `pod-eviction-timeout`(一个传递给 [kube-controller-manager](/docs/admin/kube-controller-manager/) 的参数)，node 上的所有 Pods 都会被 Node 控制器计划删除。默认的删除超时时长为**5分钟**。某些情况下，当 node 不可访问时，apiserver 不能和其上的 kubelet 通信。删除 pods 的决定不能传达给 kubelet，直到它重新建立和 apiserver 的连接为止。与此同时，被计划删除的 pods 可能会继续在分区 node 上运行。

<!--
In versions of Kubernetes prior to 1.5, the node controller would [force delete](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods) these unreachable pods from the apiserver. However, in 1.5 and higher, the node controller does not force delete pods until it is confirmed that they have stopped running in the cluster. One can see these pods which may be running on an unreachable node as being in the "Terminating" or "Unknown" states. In cases where Kubernetes cannot deduce from the underlying infrastructure if a node has permanently left a cluster, the cluster administrator may need to delete the node object by hand.  Deleting the node object from Kubernetes causes all the Pod objects running on it to be deleted from the apiserver, freeing up their names.
-->
在 1.5 版本之前的 Kubernetes 里，node 控制器会将不能访问的 pods 从 apiserver 中[强制删除](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods)。但在 1.5 或更高的版本里，在node 控制器确认这些 pods 已经在集群里停运行前不会强制删除它们。你可以看到这些处于 "Terminating" 或者 "Unknown" 状态的 pods 可能在无法访问的 node 上运行。为了防止 kubernetes 不能从底层基础设施中推断出一个 node 是否已经永久的离开了集群，集群管理员可能需要手动删除这个 node 对象。从 Kubernetes 删除 node 对象将导致 apiserver 删除 node 上所有运行的 Pod 对象并释放它们的名字。

<!--
### Capacity
-->
### 容量

<!--
Describes the resources available on the node: CPU, memory and the maximum
number of pods that can be scheduled onto the node.
-->
描述 node 上的可用资源：CPU、内存和可以调度到 node 上的 pods 的最大数量。

<!--
### Info
-->
### 信息

<!--
General information about the node, such as kernel version, Kubernetes version
(kubelet and kube-proxy version), Docker version (if used), OS name.
The information is gathered by Kubelet from the node.
-->
关于 node 的通用信息，例如内核版本、Kubernetes 版本（kubelet 和 kube-proxy 版本）、Docker 版本 （如果使用了）和 OS 名。这些信息由 Kubelet 从 node 搜集而来。

<!--
## Management
-->
## 管理

<!--
Unlike [pods](/docs/user-guide/pods) and [services](/docs/user-guide/services),
a node is not inherently created by Kubernetes: it is created externally by cloud
providers like Google Compute Engine, or exists in your pool of physical or virtual
machines. What this means is that when Kubernetes creates a node, it is really
just creating an object that represents the node. After creation, Kubernetes
will check whether the node is valid or not. For example, if you try to create
a node from the following content:
-->
与 [pods](/docs/user-guide/pods) 和 [services](/docs/user-guide/services) 不同，node 并不是在 Kubernetes 内部创建的：它是被外部的云服务商创建，例如 Google Compute Engine 或者你的集群中的物理或者虚拟机。这意味着当 Kubernetes 创建一个 node 时，它其实仅仅创建了一个对象来代表这个 node。创建以后，Kubernetes 将检查这个 node 是否可用。例如，如果你尝试使用如下内容创建一个 node：

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
Kubernetes will create a node object internally (the representation), and
validate the node by health checking based on the `metadata.name` field (we
assume `metadata.name` can be resolved). If the node is valid, i.e. all necessary
services are running, it is eligible to run a pod; otherwise, it will be
ignored for any cluster activity until it becomes valid. Note that Kubernetes
will keep the object for the invalid node unless it is explicitly deleted by
the client, and it will keep checking to see if it becomes valid.
-->
Kubernetes 会在内部创一个 node 对象（象征 node），并基于  `metadata.name` 字段（我们假设 `metadata.name` 能够被解析）通过健康检查来验证 node。如果 node 可用，意即所有必要服务都已运行，它就符合了运行一个 pod 的条件；否则它将被所有的集群动作忽略指导变为可用。请注意，Kubernetes 将保存不可用 node 的对象，除非它被客户端显式的删除。Kubernetes 将持续检查 node 是否变的可用。

<!--
Currently, there are three components that interact with the Kubernetes node
interface: node controller, kubelet, and kubectl.
-->
当前，有3个组件同 Kubernetes node 接口交互：node 控制器、kubelet 和 kubectl。

<!--
### Node Controller
-->
### Node 控制器

<!--
The node controller is a Kubernetes master component which manages various
aspects of nodes.
-->
Node 控制器是一个 Kubernetes master 组件，管理 nodes 的方方面面。

<!--
The node controller has multiple roles in a node's life. The first is assigning a
CIDR block to the node when it is registered (if CIDR assignment is turned on).
-->
Node 控制器在 node 的生命周期中扮演了多个角色。第一个是当 node 注册时为它分配一个 CIDR block（如果打开了 CIDR 分配）。

<!--
The second is keeping the node controller's internal list of nodes up to date with
the cloud provider's list of available machines. When running in a cloud
environment, whenever a node is unhealthy the node controller asks the cloud
provider if the VM for that node is still available. If not, the node
controller deletes the node from its list of nodes.
-->
第二个是使用云服务商提供了可用节点列表保持 node 控制器内部的 nodes 列表更新。如果在云环境下运行，任何时候当一个 node 不健康时 node 控制器将询问云服务 node 的虚拟机是否可用。如果不可用，node 控制器会将这个 node 从它的 nodes 列表删除。

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
第三个是监控 nodes 的健康情况。Node 控制器负责在 node 不能访问时（也即是 node 控制器因为某些原因没有收到心跳，例如 node 宕机）将它的 NodeStatus 的 NodeReady 状态更新为 ConditionUnknown。后续如果 node 持续不可访问，Node 控制器将删除 node 上的所有 pods（使用优雅终止）。（默认情况下 40s 开始报告 ConditionUnknown，在那之后 5m 开始删除 pods。）Node 控制器每隔 `--node-monitor-period` 秒检查每个 node 的状态。

<!--
In Kubernetes 1.4, we updated the logic of the node controller to better handle
cases when a big number of nodes have problems with reaching the master
(e.g. because the master has networking problem). Starting with 1.4, the node
controller will look at the state of all nodes in the cluster when making a
decision about pod eviction.
-->
在 Kubernetes 1.4 中我们更新了 node 控制器逻辑以更好的处理大批量 nodes 访问 master 出问题的情况（例如 master 的网络出了问题）。从 1.4 开始，node 控制器在决定删除 pod 之前会检查集群中所有 nodes 的状态。

<!--
In most cases, node controller limits the eviction rate to
`--node-eviction-rate` (default 0.1) per second, meaning it won't evict pods
from more than 1 node per 10 seconds.
-->
大部分情况下， node 控制器把删除频率限制在每秒 `--node-eviction-rate` 个（默认为 0.1）。这表示它在 10 秒钟内不会从超过一个 node 上删除 pods。

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
当一个 availability zone 中的 node 变为不健康时，它的删除行为将发生改变。Node 控制器会同时检查 zone 中不健康（NodeReady  状态为 ConditionUnknown 或 ConditionFalse）的 nodes 的百分比。如果不健康 nodes 的部分超过 `--unhealthy-zone-threshold` （默认为 0.55），删除速率将会减小：如果集群较小（意即小于等于 `--large-cluster-size-threshold` 个 nodes - 默认为50），删除将会停止，否则删除速率将降为每秒 `--secondary-node-eviction-rate` 个（默认为 0.01）。在单个 availability zone 实施这些策略的原因是当一个 availability zone 可能从 master 分区时其它的仍然保持连接。如果你的集群没有跨越云服务商的多个 availability zones，那就只有一个 availability zone（整个集群）。

<!--
A key reason for spreading your nodes across availability zones is so that the
workload can be shifted to healthy zones when one entire zone goes down.
Therefore, if all nodes in a zone are unhealthy then node controller evicts at
the normal rate `--node-eviction-rate`.  The corner case is when all zones are
completely unhealthy (i.e. there are no healthy nodes in the cluster). In such
case, the node controller assumes that there's some problem with master
connectivity and stops all evictions until some connectivity is restored.
-->
在多个 availability zones 分布你的 nodes 的一个关键原因是当整个 zone 故障时，工作负载可以转移到健康的 zones。因此，如果一个 zone 中的所有 nodes 都不健康时，node 控制器会以正常的速率 `--node-eviction-rate` 删除。在所有的 zones 都不健康（也即集群中没有健康 node）的极端情况下，node 控制器将假设 master 的连接出了某些问题，它将停止所有删除动作直到一些连接恢复。

<!--
Starting in Kubernetes 1.6, the NodeController is also responsible for evicting
pods that are running on nodes with `NoExecute` taints, when the pods do not tolerate
the taints. Additionally, as an alpha feature that is disabled by default, the
NodeController is responsible for adding taints corresponding to node problems like
node unreachable or not ready. See [this documentation](/docs/concepts/configuration/assign-pod-node/#taints-and-tolerations-beta-feature)
for details about `NoExecute` taints and the alpha feature.
-->
从 Kubernetes 1.6 开始，NodeController 还负责删除运行在拥有 `NoExecute` taints 的 nodes 上的 pods，如果这些 pods 没有 tolerate 这些 taints。此外，作为一个默认禁用的 alpha 特性，NodeController 还负责根据 node 故障（例如 node 不可访问或没有 ready）添加 taints。请查看 [这个文档](/docs/concepts/configuration/assign-pod-node/#taints-and-tolerations-beta-feature)了解关于 `NoExecute` taints 和这个 alpha 特性。

<!--
### Self-Registration of Nodes
-->
### Nodes 自注册

<!--
When the kubelet flag `--register-node` is true (the default), the kubelet will attempt to
register itself with the API server.  This is the preferred pattern, used by most distros.
-->
当 kubelet 标志 `--register-node` 为 true （默认）时，它会尝试向 API 服务注册自己。这是首选模式，被绝大多数发行版选用。

<!--
For self-registration, the kubelet is started with the following options:

  - `--api-servers` - Location of the apiservers.
  - `--kubeconfig` - Path to credentials to authenticate itself to the apiserver.
  - `--cloud-provider` - How to talk to a cloud provider to read metadata about itself.
  - `--register-node` - Automatically register with the API server.
  - `--register-with-taints` - Register the node with the given list of taints (comma seperated `<key>=<value>:<effect>`). No-op if `register-node` is false.
  - `--node-ip`   IP address of the node.
  - `--node-labels` - Labels to add when registering the node in the cluster.
  - `--node-status-update-frequency` - Specifies how often kubelet posts node status to master.
  -->
  对于自注册模式，kubelet 使用下列参数启动：

  - `--api-servers` - apiservers 地址。
  - `--kubeconfig` - 用于向 apiserver 验证自己的凭据路径。
  - `--cloud-provider` - 如何从云服务商读取关于自己的元数据。
  - `--register-node` - 自动向  API 服务注册。
  - `--register-with-taints` - 使用 taints 列表（逗号分隔的 `<key>=<value>:<effect>`）注册 node。当 `register-node` 为 false 时无效。
  - `--node-ip` - node IP 地址。
  - `--node-labels` - 向集群注册时给 node 添加的 labels。
  - `--node-status-update-frequency` - 指定 kubelet 向 master 发送状态的频率。

<!--
Currently, any kubelet is authorized to create/modify any node resource, but in practice it only creates/modifies
its own. (In the future, we plan to only allow a kubelet to modify its own node resource.)
-->
目前，任何 kubelet 都被授权可以创建/修改任意 node 资源，但通常只对自己的进行创建/修改。（未来我们计划只允许一个 kubelet 修改它自己 node 的资源。）

<!--
#### Manual Node Administration
-->
#### 手动 Node 管理

<!--
A cluster administrator can create and modify node objects.
-->
集群管理员可以创建及修改 node 对象。

<!--
If the administrator wishes to create node objects manually, set the kubelet flag
`--register-node=false`.
-->
如果管理员希望手动创建 node 对象，请设置 kubelet 标记 `--register-node=false`。

<!--
The administrator can modify node resources (regardless of the setting of `--register-node`).
Modifications include setting labels on the node and marking it unschedulable.
-->
管理员可以修改 node 资源（忽略 `--register-node` 设置）。修改包括在 node 上设置 labels及标记它为不可调度。

<!--
Labels on nodes can be used in conjunction with node selectors on pods to control scheduling,
e.g. to constrain a pod to only be eligible to run on a subset of the nodes.
-->
Nodes 上的 labels 可以和 pods 的 node selectors 一起使用来控制调度，例如限制一个 pod 只能在一个符合要求的 nodes 子集上运行。

<!--
Marking a node as unschedulable will prevent new pods from being scheduled to that
node, but will not affect any existing pods on the node. This is useful as a
preparatory step before a node reboot, etc. For example, to mark a node
unschedulable, run this command:
-->
标记一个 node 为不可调度的将防止新建 pods 调度到那个 node 之上，但不会影响任何已经在它之上的 pods。这是重启 node 等操作之前的一个有用的准备步骤。例如，标记一个 node 为不可调度的，执行以下命令：

```shell
kubectl cordon $NODENAME
```

<!--
Note that pods which are created by a daemonSet controller bypass the Kubernetes scheduler,
and do not respect the unschedulable attribute on a node.  The assumption is that daemons belong on
the machine even if it is being drained of applications in preparation for a reboot.
-->
请注意，被 daemonSet 控制器创建的 pods 将忽略 Kubernetes 调度器，且不会遵照 node 上不可调度的属性。这个假设基于守护程序属于节点机器，即使在准备重启而隔离应用的时候。

<!--
### Node capacity
-->
### Node 容量

<!--
The capacity of the node (number of cpus and amount of memory) is part of the node object.
Normally, nodes register themselves and report their capacity when creating the node object. If
you are doing [manual node administration](#manual-node-administration), then you need to set node
capacity when adding a node.
-->
Node 的容量（cpu 数量和内存容量）是 node 对象的一部分。通常情况下，在创建 node 对象时，它们会注册自己并报告自己的容量。如果你正在执行[手动 node 管理](#manual-node-administration)，那么你需要在添加 node 时手动设置 node 容量。

<!--
The Kubernetes scheduler ensures that there are enough resources for all the pods on a node.  It
checks that the sum of the requests of containers on the node is no greater than the node capacity.  It
includes all containers started by the kubelet, but not containers started directly by Docker nor
processes not in containers.
-->
Kubernetes 调度器保证一个 node 上有足够的资源供其上的所有 pods 使用。它会检查 node 上所有容器要求的总和不会超过 node 的容量。这包括所有 kubelet 启动的容器，但不包含 Docker 启动的容器和不在容器中的进程。

<!--
If you want to explicitly reserve resources for non-pod processes, you can create a placeholder
pod. Use the following template:
-->
如果希望显式的为非 pod 进程预留资源，你可以创建一个占位 pod。使用如下模板：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-reserver
spec:
  containers:
  - name: sleep-forever
    image: gcr.io/google_containers/pause:0.8.0
    resources:
      requests:
        cpu: 100m
        memory: 100Mi
```

<!--
Set the `cpu` and `memory` values to the amount of resources you want to reserve.
Place the file in the manifest directory (`--config=DIR` flag of kubelet).  Do this
on each kubelet where you want to reserve resources.
-->
设置 `cpu` 和 `memory` 值为你希望预留的资源量。将文件放在清单文件夹中（kubelet 的 `--config=DIR` 标志）。当你希望预留资源时，在每个 kubelet 上都这样执行。

<!--
## API Object
-->
## API 对象

<!--
Node is a top-level resource in the Kubernetes REST API. More details about the
API object can be found at: [Node API
object](/docs/api-reference/{{page.version}}/#node-v1-core).``
-->
Node 是 Kubernetes REST API 的顶级资源。更多关于 API 对象的细节可以在这里找到： [Node API
object](/docs/api-reference/{{page.version}}/#node-v1-core).``
