---
title: 节点
api_metadata:
- apiVersion: "v1"
  kind: "Node"
content_type: concept
weight: 10
---
<!--
reviewers:
- caesarxuchao
- dchen1107
title: Nodes
api_metadata:
- apiVersion: "v1"
  kind: "Node"
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
Kubernetes runs your {{< glossary_tooltip text="workload" term_id="workload" >}}
by placing containers into Pods to run on _Nodes_.
A node may be a virtual or physical machine, depending on the cluster. Each node
is managed by the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
and contains the services necessary to run
{{< glossary_tooltip text="Pods" term_id="pod" >}}.

Typically you have several nodes in a cluster; in a learning or resource-limited
environment, you might have only one node.

The [components](/docs/concepts/overview/components/#node-components) on a node include the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, a
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, and the
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}.
-->
Kubernetes 通过将容器放入在节点（Node）上运行的 Pod
中来执行你的{{< glossary_tooltip text="工作负载" term_id="workload" >}}。
节点可以是一个虚拟机或者物理机器，取决于所在的集群配置。
每个节点包含运行 {{< glossary_tooltip text="Pod" term_id="pod" >}} 所需的服务；
这些节点由{{< glossary_tooltip text="控制面" term_id="control-plane" >}}负责管理。

通常集群中会有若干个节点；而在一个学习所用或者资源受限的环境中，你的集群中也可能只有一个节点。

节点上的[组件](/zh-cn/docs/concepts/overview/components/#node-components)包括
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}、
{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}以及
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}。

<!-- body -->
<!--
## Management

There are two main ways to have Nodes added to the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}:

1. The kubelet on a node self-registers to the control plane
2. You (or another human user) manually add a Node object

After you create a Node {{< glossary_tooltip text="object" term_id="object" >}},
or the kubelet on a node self-registers, the control plane checks whether the new Node object
is valid. For example, if you try to create a Node from the following JSON manifest:
-->
## 管理  {#management}

向 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}添加节点的方式主要有两种：

1. 节点上的 `kubelet` 向控制面执行自注册；
2. 你（或者别的什么人）手动添加一个 Node 对象。

在你创建了 Node {{< glossary_tooltip text="对象" term_id="object" >}}或者节点上的
`kubelet` 执行了自注册操作之后，控制面会检查新的 Node 对象是否合法。
例如，如果你尝试使用下面的 JSON 对象来创建 Node 对象：

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
field of the Node. If the node is healthy (i.e. all necessary services are running),
then it is eligible to run a Pod. Otherwise, that node is ignored for any cluster activity
until it becomes healthy.
-->
Kubernetes 会在内部创建一个 Node 对象作为节点的表示。Kubernetes 检查 `kubelet`
向 API 服务器注册节点时使用的 `metadata.name` 字段是否匹配。
如果节点是健康的（即所有必要的服务都在运行中），则该节点可以用来运行 Pod。
否则，直到该节点变为健康之前，所有的集群活动都会忽略该节点。

{{< note >}}
<!--
Kubernetes keeps the object for the invalid Node and continues checking to see whether
it becomes healthy.

You, or a {{< glossary_tooltip term_id="controller" text="controller">}}, must explicitly
delete the Node object to stop that health checking.
-->
Kubernetes 会一直保存着非法节点对应的对象，并持续检查该节点是否已经变得健康。

你，或者某个{{< glossary_tooltip term_id="controller" text="控制器">}}必须显式地删除该
Node 对象以停止健康检查操作。
{{< /note >}}

<!--
The name of a Node object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
Node 对象的名称必须是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
### Node name uniqueness

The [name](/docs/concepts/overview/working-with-objects/names#names) identifies a Node. Two Nodes
cannot have the same name at the same time. Kubernetes also assumes that a resource with the same
name is the same object. In case of a Node, it is implicitly assumed that an instance using the
same name will have the same state (e.g. network settings, root disk contents) and attributes like
node labels. This may lead to inconsistencies if an instance was modified without changing its name.
If the Node needs to be replaced or updated significantly, the existing Node object needs to be
removed from API server first and re-added after the update.
-->
### 节点名称唯一性     {#node-name-uniqueness}

节点的[名称](/zh-cn/docs/concepts/overview/working-with-objects/names#names)用来标识 Node 对象。
没有两个 Node 可以同时使用相同的名称。 Kubernetes 还假定名字相同的资源是同一个对象。
就 Node 而言，隐式假定使用相同名称的实例会具有相同的状态（例如网络配置、根磁盘内容）
和类似节点标签这类属性。这可能在节点被更改但其名称未变时导致系统状态不一致。
如果某个 Node 需要被替换或者大量变更，需要从 API 服务器移除现有的 Node 对象，
之后再在更新之后重新将其加入。

<!--
### Self-registration of Nodes

When the kubelet flag `--register-node` is true (the default), the kubelet will attempt to
register itself with the API server. This is the preferred pattern, used by most distros.

For self-registration, the kubelet is started with the following options:
-->
### 节点自注册    {#self-registration-of-nodes}

当 kubelet 标志 `--register-node` 为 true（默认）时，它会尝试向 API 服务注册自己。
这是首选模式，被绝大多数发行版选用。

对于自注册模式，kubelet 使用下列参数启动：

<!--
- `--kubeconfig` - Path to credentials to authenticate itself to the API server.
- `--cloud-provider` - How to talk to a {{< glossary_tooltip text="cloud provider" term_id="cloud-provider" >}}
  to read metadata about itself.
- `--register-node` - Automatically register with the API server.
- `--register-with-taints` - Register the node with the given list of
  {{< glossary_tooltip text="taints" term_id="taint" >}} (comma separated `<key>=<value>:<effect>`).

  No-op if `register-node` is false.
-->
- `--kubeconfig` - 用于向 API 服务器执行身份认证所用的凭据的路径。
- `--cloud-provider` - 与某{{< glossary_tooltip text="云驱动" term_id="cloud-provider" >}}
  进行通信以读取与自身相关的元数据的方式。
- `--register-node` - 自动向 API 服务器注册。
- `--register-with-taints` - 使用所给的{{< glossary_tooltip text="污点" term_id="taint" >}}列表
  （逗号分隔的 `<key>=<value>:<effect>`）注册节点。当 `register-node` 为 false 时无效。
<!--
- `--node-ip` - Optional comma-separated list of the IP addresses for the node.
  You can only specify a single address for each address family.
  For example, in a single-stack IPv4 cluster, you set this value to be the IPv4 address that the
  kubelet should use for the node.
  See [configure IPv4/IPv6 dual stack](/docs/concepts/services-networking/dual-stack/#configure-ipv4-ipv6-dual-stack)
  for details of running a dual-stack cluster.

  If you don't provide this argument, the kubelet uses the node's default IPv4 address, if any;
  if the node has no IPv4 addresses then the kubelet uses the node's default IPv6 address.
-->
- `--node-ip` - 可选的以英文逗号隔开的节点 IP 地址列表。你只能为每个地址簇指定一个地址。
  例如在单协议栈 IPv4 集群中，需要将此值设置为 kubelet 应使用的节点 IPv4 地址。
  参阅[配置 IPv4/IPv6 双协议栈](/zh-cn/docs/concepts/services-networking/dual-stack/#configure-ipv4-ipv6-dual-stack)了解运行双协议栈集群的详情。

  如果你未提供这个参数，kubelet 将使用节点默认的 IPv4 地址（如果有）；
  如果节点没有 IPv4 地址，则 kubelet 使用节点的默认 IPv6 地址。
<!--
- `--node-labels` - {{< glossary_tooltip text="Labels" term_id="label" >}} to add when registering the node
  in the cluster (see label restrictions enforced by the
  [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)).
- `--node-status-update-frequency` - Specifies how often kubelet posts its node status to the API server.
-->
- `--node-labels` - 在集群中注册节点时要添加的{{< glossary_tooltip text="标签" term_id="label" >}}。
  （参见 [NodeRestriction 准入控制插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)所实施的标签限制）。
- `--node-status-update-frequency` - 指定 kubelet 向 API 服务器发送其节点状态的频率。

<!--
When the [Node authorization mode](/docs/reference/access-authn-authz/node/) and
[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
are enabled, kubelets are only authorized to create/modify their own Node resource.
-->
当 [Node 鉴权模式](/zh-cn/docs/reference/access-authn-authz/node/)和
[NodeRestriction 准入插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)被启用后，
仅授权 kubelet 创建/修改自己的 Node 资源。

{{< note >}}
<!--
As mentioned in the [Node name uniqueness](#node-name-uniqueness) section,
when Node configuration needs to be updated, it is a good practice to re-register
the node with the API server. For example, if the kubelet is being restarted with
a new set of `--node-labels`, but the same Node name is used, the change will
not take effect, as labels are only set (or modified) upon Node registration with the API server.
-->
正如[节点名称唯一性](#node-name-uniqueness)一节所述，当 Node 的配置需要被更新时，
一种好的做法是重新向 API 服务器注册该节点。例如，如果 kubelet 重启时其 `--node-labels`
是新的值集，但同一个 Node 名称已经被使用，则所作变更不会起作用，
因为节点标签是在 Node 注册到 API 服务器时完成（或修改）的。

<!--
Pods already scheduled on the Node may misbehave or cause issues if the Node
configuration will be changed on kubelet restart. For example, already running
Pod may be tainted against the new labels assigned to the Node, while other
Pods, that are incompatible with that Pod will be scheduled based on this new
label. Node re-registration ensures all Pods will be drained and properly
re-scheduled.
-->
如果在 kubelet 重启期间 Node 配置发生了变化，已经被调度到某 Node 上的 Pod
可能会出现行为不正常或者出现其他问题，例如，已经运行的 Pod
可能通过污点机制设置了与 Node 上新设置的标签相排斥的规则，也有一些其他 Pod，
本来与此 Pod 之间存在不兼容的问题，也会因为新的标签设置而被调到同一节点。
节点重新注册操作可以确保节点上所有 Pod 都被排空并被正确地重新调度。
{{< /note >}}

<!--
### Manual Node administration

You can create and modify Node objects using
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}.

When you want to create Node objects manually, set the kubelet flag `--register-node=false`.

You can modify Node objects regardless of the setting of `--register-node`.
For example, you can set labels on an existing Node or mark it unschedulable.
-->
### 手动节点管理 {#manual-node-administration}

你可以使用 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
来创建和修改 Node 对象。

如果你希望手动创建节点对象时，请设置 kubelet 标志 `--register-node=false`。

你可以修改 Node 对象（忽略 `--register-node` 设置）。
例如，你可以修改节点上的标签或并标记其为不可调度。

<!--
You can use labels on Nodes in conjunction with node selectors on Pods to control
scheduling. For example, you can constrain a Pod to only be eligible to run on
a subset of the available nodes.

Marking a node as unschedulable prevents the scheduler from placing new pods onto
that Node but does not affect existing Pods on the Node. This is useful as a
preparatory step before a node reboot or other maintenance.

To mark a Node unschedulable, run:
-->
你可以结合使用 Node 上的标签和 Pod 上的选择算符来控制调度。
例如，你可以限制某 Pod 只能在符合要求的节点子集上运行。

如果标记节点为不可调度（unschedulable），将阻止新 Pod 调度到该 Node 之上，
但不会影响任何已经在其上的 Pod。
这是重启节点或者执行其他维护操作之前的一个有用的准备步骤。

要标记一个 Node 为不可调度，执行以下命令：

```shell
kubectl cordon $NODENAME
```

<!--
See [Safely Drain a Node](/docs/tasks/administer-cluster/safely-drain-node/)
for more details.
-->
更多细节参考[安全地腾空节点](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)。

{{< note >}}
<!--
Pods that are part of a {{< glossary_tooltip term_id="daemonset" >}} tolerate
being run on an unschedulable Node. DaemonSets typically provide node-local services
that should run on the Node even if it is being drained of workload applications.
-->
被 {{< glossary_tooltip term_id="daemonset" text="DaemonSet" >}} 控制器创建的 Pod
能够容忍节点的不可调度属性。
DaemonSet 通常提供节点本地的服务，即使节点上的负载应用已经被腾空，
这些服务也仍需运行在节点之上。
{{< /note >}}

<!--
## Node status

A Node's status contains the following information:

* [Addresses](/docs/reference/node/node-status/#addresses)
* [Conditions](/docs/reference/node/node-status/#condition)
* [Capacity and Allocatable](/docs/reference/node/node-status/#capacity)
* [Info](/docs/reference/node/node-status/#info)
-->
## 节点状态   {#node-status}

一个节点的状态包含以下信息:

* [地址（Addresses）](/zh-cn/docs/reference/node/node-status/#addresses)
* [状况（Condition）](/zh-cn/docs/reference/node/node-status/#condition)
* [容量与可分配（Capacity）](/zh-cn/docs/reference/node/node-status/#capacity)
* [信息（Info）](/zh-cn/docs/reference/node/node-status/#info)

<!--
You can use `kubectl` to view a Node's status and other details:

```shell
kubectl describe node <insert-node-name-here>
```
-->
你可以使用 `kubectl` 来查看节点状态和其他细节信息：

```shell
kubectl describe node <节点名称>
```

<!-- 
See [Node Status](/docs/reference/node/node-status/) for more details.
-->
更多细节参见 [Node Status](/zh-cn/docs/reference/node/node-status)。

<!--
## Node heartbeats

Heartbeats, sent by Kubernetes nodes, help your cluster determine the
availability of each node, and to take action when failures are detected.

For nodes there are two forms of heartbeats:
-->
## 节点心跳  {#node-heartbeats}

Kubernetes 节点发送的心跳帮助你的集群确定每个节点的可用性，并在检测到故障时采取行动。

对于节点，有两种形式的心跳：

<!--
* Updates to the [`.status`](/docs/reference/node/node-status/) of a Node.
* [Lease](/docs/concepts/architecture/leases/) objects
  within the `kube-node-lease`
  {{< glossary_tooltip term_id="namespace" text="namespace">}}.
  Each Node has an associated Lease object.
-->
* 更新节点的 [`.status`](/zh-cn/docs/reference/node/node-status/)
* `kube-node-lease` {{<glossary_tooltip term_id="namespace" text="名字空间">}}中的
  [Lease（租约）](/zh-cn/docs/concepts/architecture/leases/)对象。
  每个节点都有一个关联的 Lease 对象。

<!--
## Node controller

The node {{< glossary_tooltip text="controller" term_id="controller" >}} is a
Kubernetes control plane component that manages various aspects of nodes.

The node controller has multiple roles in a node's life. The first is assigning a
CIDR block to the node when it is registered (if CIDR assignment is turned on).
-->
## 节点控制器  {#node-controller}

节点{{< glossary_tooltip text="控制器" term_id="controller" >}}是 Kubernetes 控制面组件，
管理节点的方方面面。

节点控制器在节点的生命周期中扮演多个角色。
第一个是当节点注册时为它分配一个 CIDR 区段（如果启用了 CIDR 分配）。

<!--
The second is keeping the node controller's internal list of nodes up to date with
the cloud provider's list of available machines. When running in a cloud
environment and whenever a node is unhealthy, the node controller asks the cloud
provider if the VM for that node is still available. If not, the node
controller deletes the node from its list of nodes.
-->
第二个是保持节点控制器内的节点列表与云服务商所提供的可用机器列表同步。
如果在云环境下运行，只要某节点不健康，节点控制器就会询问云服务是否节点的虚拟机仍可用。
如果不可用，节点控制器会将该节点从它的节点列表删除。

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
第三个是监控节点的健康状况。节点控制器负责：

- 在节点不可达的情况下，在 Node 的 `.status` 中更新 `Ready` 状况。
  在这种情况下，节点控制器将 NodeReady 状况更新为 `Unknown`。
- 如果节点仍然无法访问：对于不可达节点上的所有 Pod 触发
  [API 发起的逐出](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)操作。
  默认情况下，节点控制器在将节点标记为 `Unknown` 后等待 5 分钟提交第一个驱逐请求。

默认情况下，节点控制器每 5 秒检查一次节点状态，可以使用 `kube-controller-manager`
组件上的 `--node-monitor-period` 参数来配置周期。

<!--
### Rate limits on eviction

In most cases, the node controller limits the eviction rate to
`--node-eviction-rate` (default 0.1) per second, meaning it won't evict pods
from more than 1 node per 10 seconds.
-->
### 逐出速率限制  {#rate-limits-on-eviction}

大部分情况下，节点控制器把逐出速率限制在每秒 `--node-eviction-rate` 个（默认为 0.1）。
这表示它每 10 秒钟内至多从一个节点驱逐 Pod。

<!--
The node eviction behavior changes when a node in a given availability zone
becomes unhealthy. The node controller checks what percentage of nodes in the zone
are unhealthy (the `Ready` condition is `Unknown` or `False`) at
the same time:
-->
当一个可用区域（Availability Zone）中的节点变为不健康时，节点的驱逐行为将发生改变。
节点控制器会同时检查可用区域中不健康（`Ready` 状况为 `Unknown` 或 `False`）
的节点的百分比：

<!--
- If the fraction of unhealthy nodes is at least `--unhealthy-zone-threshold`
  (default 0.55), then the eviction rate is reduced.
- If the cluster is small (i.e. has less than or equal to
  `--large-cluster-size-threshold` nodes - default 50), then evictions are stopped.
- Otherwise, the eviction rate is reduced to `--secondary-node-eviction-rate`
  (default 0.01) per second.
-->
- 如果不健康节点的比例超过 `--unhealthy-zone-threshold`（默认为 0.55），
  驱逐速率将会降低。
- 如果集群较小（意即小于等于 `--large-cluster-size-threshold` 个节点 - 默认为 50），
  驱逐操作将会停止。
- 否则驱逐速率将降为每秒 `--secondary-node-eviction-rate` 个（默认为 0.01）。

<!--
The reason these policies are implemented per availability zone is because one
availability zone might become partitioned from the control plane while the others remain
connected. If your cluster does not span multiple cloud provider availability zones,
then the eviction mechanism does not take per-zone unavailability into account.
-->
在逐个可用区域中实施这些策略的原因是，
当一个可用区域可能从控制面脱离时其它可用区域可能仍然保持连接。
如果你的集群没有跨越云服务商的多个可用区域，那（整个集群）就只有一个可用区域。

<!--
A key reason for spreading your nodes across availability zones is so that the
workload can be shifted to healthy zones when one entire zone goes down.
Therefore, if all nodes in a zone are unhealthy, then the node controller evicts at
the normal rate of `--node-eviction-rate`. The corner case is when all zones are
completely unhealthy (none of the nodes in the cluster are healthy). In such a
case, the node controller assumes that there is some problem with connectivity
between the control plane and the nodes, and doesn't perform any evictions.
(If there has been an outage and some nodes reappear, the node controller does
evict pods from the remaining nodes that are unhealthy or unreachable).
-->
跨多个可用区域部署你的节点的一个关键原因是当某个可用区域整体出现故障时，
工作负载可以转移到健康的可用区域。
因此，如果一个可用区域中的所有节点都不健康时，节点控制器会以正常的速率
`--node-eviction-rate` 进行驱逐操作。
在所有的可用区域都不健康（也即集群中没有健康节点）的极端情况下，
节点控制器将假设控制面与节点间的连接出了某些问题，它将停止所有驱逐动作
（如果故障后部分节点重新连接，节点控制器会从剩下不健康或者不可达节点中驱逐 Pod）。

<!--
The node controller is also responsible for evicting pods running on nodes with
`NoExecute` taints, unless those pods tolerate that taint.
The node controller also adds {{< glossary_tooltip text="taints" term_id="taint" >}}
corresponding to node problems like node unreachable or not ready. This means
that the scheduler won't place Pods onto unhealthy nodes.
-->
节点控制器还负责驱逐运行在拥有 `NoExecute` 污点的节点上的 Pod，
除非这些 Pod 能够容忍此污点。
节点控制器还负责根据节点故障（例如节点不可访问或没有就绪）
为其添加{{< glossary_tooltip text="污点" term_id="taint" >}}。
这意味着调度器不会将 Pod 调度到不健康的节点上。

<!--
## Resource capacity tracking {#node-capacity}

Node objects track information about the Node's resource capacity: for example, the amount
of memory available and the number of CPUs.
Nodes that [self register](#self-registration-of-nodes) report their capacity during
registration. If you [manually](#manual-node-administration) add a Node, then
you need to set the node's capacity information when you add it.
-->
### 资源容量跟踪   {#node-capacity}

Node 对象会跟踪节点上资源的容量（例如可用内存和 CPU 数量）。
通过[自注册](#self-registration-of-nodes)机制生成的 Node 对象会在注册期间报告自身容量。
如果你[手动](#manual-node-administration)添加了 Node，
你就需要在添加节点时手动设置节点容量。

<!--
The Kubernetes {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} ensures that
there are enough resources for all the Pods on a Node. The scheduler checks that the sum
of the requests of containers on the node is no greater than the node's capacity.
That sum of requests includes all containers managed by the kubelet, but excludes any
containers started directly by the container runtime, and also excludes any
processes running outside of the kubelet's control.
-->
Kubernetes {{< glossary_tooltip text="调度器" term_id="kube-scheduler" >}}
保证节点上有足够的资源供其上的所有 Pod 使用。
它会检查节点上所有容器的请求的总和不会超过节点的容量。
总的请求包括由 kubelet 启动的所有容器，但不包括由容器运行时直接启动的容器，
也不包括不受 `kubelet` 控制的其他进程。

{{< note >}}
<!--
If you want to explicitly reserve resources for non-Pod processes, see
[reserve resources for system daemons](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved).
-->
如果要为非 Pod 进程显式保留资源。
请参考[为系统守护进程预留资源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)。
{{< /note >}}

<!--
## Node topology
-->
## 节点拓扑  {#node-topology}

{{< feature-state feature_gate_name="TopologyManager" >}}

<!--
If you have enabled the `TopologyManager`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/), then
the kubelet can use topology hints when making resource assignment decisions.
See [Control Topology Management Policies on a Node](/docs/tasks/administer-cluster/topology-manager/)
for more information.
-->
如果启用了 `TopologyManager` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
`kubelet` 可以在作出资源分配决策时使用拓扑提示。
参考[控制节点上拓扑管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)了解详细信息。

<!--
## Swap memory management {#swap-memory}
-->
## 交换内存（swap）管理 {#swap-memory}

{{< feature-state feature_gate_name="NodeSwap" >}}

<!--
To enable swap on a node, the `NodeSwap` feature gate must be enabled on
the kubelet (default is true), and the `--fail-swap-on` command line flag or `failSwapOn`
[configuration setting](/docs/reference/config-api/kubelet-config.v1beta1/)
must be set to false.
To allow Pods to utilize swap, `swapBehavior` should not be set to `NoSwap` (which is the default behavior) in the kubelet config.
-->
要在节点上启用交换内存，必须启用 kubelet 的 `NodeSwap` 特性门控（默认启用），
同时使用 `--fail-swap-on` 命令行参数或者将 `failSwapOn`
[配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)设置为 false。
为了允许 Pod 使用交换内存，在 kubelet 配置中不应将 `swapBehavior` 设置为 `NoSwap`（默认行为）。

{{< warning >}}
<!--
When the memory swap feature is turned on, Kubernetes data such as the content
of Secret objects that were written to tmpfs now could be swapped to disk.
-->
当内存交换功能被启用后，Kubernetes 数据（如写入 tmpfs 的 Secret 对象的内容）可以被交换到磁盘。
{{< /warning >}}

<!--
A user can also optionally configure `memorySwap.swapBehavior` in order to
specify how a node will use swap memory. For example,
-->
用户还可以选择配置 `memorySwap.swapBehavior` 以指定节点使用交换内存的方式。例如：

```yaml
memorySwap:
  swapBehavior: LimitedSwap
```

<!--
- `NoSwap` (default): Kubernetes workloads will not use swap.
- `LimitedSwap`: The utilization of swap memory by Kubernetes workloads is subject to limitations.
  Only Pods of Burstable QoS are permitted to employ swap.
-->
- `NoSwap`（默认）：Kubernetes 工作负载不会使用交换内存。
- `LimitedSwap`：Kubernetes 工作负载对交换内存的使用受到限制。
  只有具有 Burstable QoS 的 Pod 可以使用交换内存。

<!--
If configuration for `memorySwap` is not specified and the feature gate is
enabled, by default the kubelet will apply the same behaviour as the
`NoSwap` setting.
-->
如果启用了特性门控但是未指定 `memorySwap` 的配置，默认情况下 kubelet 将使用与
`NoSwap` 设置相同的行为。

<!--
With `LimitedSwap`, Pods that do not fall under the Burstable QoS classification (i.e.
`BestEffort`/`Guaranteed` Qos Pods) are prohibited from utilizing swap memory.
To maintain the aforementioned security and node
health guarantees, these Pods are not permitted to use swap memory when `LimitedSwap` is
in effect.
-->
采用 `LimitedSwap` 时，不属于 Burstable QoS 分类的 Pod
（即 `BestEffort`/`Guaranteed` QoS Pod）
被禁止使用交换内存。为了保持上述的安全性和节点健康性保证，
在 `LimitedSwap` 生效时，不允许这些 Pod 使用交换内存。

<!--
Prior to detailing the calculation of the swap limit, it is necessary to define the following terms:
* `nodeTotalMemory`: The total amount of physical memory available on the node.
* `totalPodsSwapAvailable`: The total amount of swap memory on the node that is available for use by Pods (some swap memory may be reserved for system use).
* `containerMemoryRequest`: The container's memory request.
-->
在详细介绍交换限制的计算之前，有必要定义以下术语：

* `nodeTotalMemory`：节点上可用的物理内存总量。
* `totalPodsSwapAvailable`：节点上可供 Pod 使用的交换内存总量
  （一些交换内存可能被保留由系统使用）。
* `containerMemoryRequest`：容器的内存请求。

<!--
Swap limitation is configured as:
`(containerMemoryRequest / nodeTotalMemory) * totalPodsSwapAvailable`.

It is important to note that, for containers within Burstable QoS Pods, it is possible to
opt-out of swap usage by specifying memory requests that are equal to memory limits.
Containers configured in this manner will not have access to swap memory.
-->
交换内存限制被配置为 `(containerMemoryRequest / nodeTotalMemory) * totalPodsSwapAvailable` 的值。

需要注意的是，位于 Burstable QoS Pod 中的容器可以通过将内存请求设置为与内存限制相同来选择不使用交换内存。
以这种方式配置的容器将无法访问交换内存。

<!--
Swap is supported only with **cgroup v2**, cgroup v1 is not supported. 

For more information, and to assist with testing and provide feedback, please
see the blog-post about [Kubernetes 1.28: NodeSwap graduates to Beta1](/blog/2023/08/24/swap-linux-beta/),
[KEP-2400](https://github.com/kubernetes/enhancements/issues/4128) and its
[design proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md).
-->
只有 **Cgroup v2** 支持交换内存，Cgroup v1 不支持。

如需了解更多信息、协助测试和提交反馈，请参阅关于
[Kubernetes 1.28：NodeSwap 进阶至 Beta1](/zh-cn/blog/2023/08/24/swap-linux-beta/) 的博客文章、
[KEP-2400](https://github.com/kubernetes/enhancements/issues/4128)
及其[设计提案](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md)。

## {{% heading "whatsnext" %}}

<!--
Learn more about the following:
* [Components](/docs/concepts/overview/components/#node-components) that make up a node.
* [API definition for Node](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).
* [Node](https://git.k8s.io/design-proposals-archive/architecture/architecture.md#the-kubernetes-node) section of the architecture design document.
* [Cluster autoscaling](/docs/concepts/cluster-administration/cluster-autoscaling/) to
  manage the number and size of nodes in your cluster.
* [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
* [Node Resource Managers](/docs/concepts/policy/node-resource-managers/).
* [Resource Management for Windows nodes](/docs/concepts/configuration/windows-resource-management/).
-->
进一步了解以下资料：

* 构成节点的[组件](/zh-cn/docs/concepts/overview/components/#node-components)。
* [Node 的 API 定义](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core)。
* 架构设计文档中有关
  [Node](https://git.k8s.io/design-proposals-archive/architecture/architecture.md#the-kubernetes-node)
  的章节。
* [集群自动扩缩](https://git.k8s.io/design-proposals-archive/architecture/architecture.md#the-kubernetes-node)
  以管理集群中节点的数量和规模。
* [污点和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
* [节点资源管理器](/zh-cn/docs/concepts/policy/node-resource-managers/)。
* [Windows 节点的资源管理](/zh-cn/docs/concepts/configuration/windows-resource-management/)。
