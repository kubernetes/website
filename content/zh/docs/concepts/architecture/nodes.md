---
approvers:
- caesarxuchao
- dchen1107

title: Nodes
redirect_from:
- "/docs/admin/node/"
- "/docs/admin/node.html"
- "/docs/concepts/nodes/node/"
- "/docs/concepts/nodes/node.html"
---

{{< toc >}}


## Node 是什么？


`Node` 是 Kubernetes 的工作节点，以前叫做 `minion`。取决于你的集群，Node 可以是一个虚拟机或者物理机器。每个 node 都有用于运行 [pods](/docs/user-guide/pods) 的必要服务，并由 master 组件管理。Node 上的服务包括 Docker、kubelet 和 kube-proxy。请查阅架构设计文档中 [The Kubernetes Node](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node) 一节获取更多细节。


## Node 状态


  一个 node 的状态包含以下信息:

* [地址](#地址)
* ~~[阶段](#阶段)~~ **已废弃**
* [条件](#条件)
* [容量](#容量)
* [信息](#信息)


下面对每个章节进行详细描述。


### 地址


这些字段组合的用法取决于你的云服务商或者裸机配置。

* HostName：HostName 和 node 内核报告的相同。可以通过 kubelet 的 `--hostname-override` 参数覆盖。
* ExternalIP：通常是可以外部路由的 node IP 地址（从集群外可访问）。
* InternalIP：通常是仅可在集群内部路由的 node IP 地址。


### 阶段


已废弃：node 阶段已经不再使用。


### 条件


`conditions` 字段描述了所有 `Running` nodes 的状态。


| Node 条件          | 描述                                       |
| ---------------- | ---------------------------------------- |
| `OutOfDisk`      | `True` 表示 node 的空闲空间不足以用于添加新 pods, 否则为 `False` |
| `Ready`          | `True` 表示 node 是健康的并已经准备好接受 pods；`False` 表示 node 不健康而且不能接受 pods；`Unknown` 表示 node 控制器在最近 40 秒内没有收到 node 的消息 |
| `MemoryPressure` | `True` 表示 node 不存在内存压力 -- 即 node 内存用量低, 否则为 `False`       |
| `DiskPressure`   | `True` 表示 node 不存在磁盘压力 -- 即磁盘用量低, 否则为 `False`       |


Node 条件使用一个 JSON 对象表示。例如，下面的响应描述了一个健康的 node。

```json
"conditions": [
  {
    "kind": "Ready",
    "status": "True"
  }
]
```


如果 Ready 条件处于状态 "Unknown" 或者 "False" 的时间超过了 `pod-eviction-timeout`(一个传递给 [kube-controller-manager](/docs/admin/kube-controller-manager/) 的参数)，node 上的所有 Pods 都会被 Node 控制器计划删除。默认的删除超时时长为**5分钟**。某些情况下，当 node 不可访问时，apiserver 不能和其上的 kubelet 通信。删除 pods 的决定不能传达给 kubelet，直到它重新建立和 apiserver 的连接为止。与此同时，被计划删除的 pods 可能会继续在分区 node 上运行。


在 1.5 版本之前的 Kubernetes 里，node 控制器会将不能访问的 pods 从 apiserver 中[强制删除](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods)。但在 1.5 或更高的版本里，在node 控制器确认这些 pods 已经在集群里停运行前不会强制删除它们。你可以看到这些处于 "Terminating" 或者 "Unknown" 状态的 pods 可能在无法访问的 node 上运行。为了防止 kubernetes 不能从底层基础设施中推断出一个 node 是否已经永久的离开了集群，集群管理员可能需要手动删除这个 node 对象。从 Kubernetes 删除 node 对象将导致 apiserver 删除 node 上所有运行的 Pod 对象并释放它们的名字。


### 容量


描述 node 上的可用资源：CPU、内存和可以调度到 node 上的 pods 的最大数量。


### 信息


关于 node 的通用信息，例如内核版本、Kubernetes 版本（kubelet 和 kube-proxy 版本）、Docker 版本 （如果使用了）和 OS 名。这些信息由 Kubelet 从 node 搜集而来。


## 管理


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


Kubernetes 会在内部创一个 node 对象（象征 node），并基于  `metadata.name` 字段（我们假设 `metadata.name` 能够被解析）通过健康检查来验证 node。如果 node 可用，意即所有必要服务都已运行，它就符合了运行一个 pod 的条件；否则它将被所有的集群动作忽略直到变为可用。请注意，Kubernetes 将保存不可用 node 的对象，除非它被客户端显式的删除。Kubernetes 将持续检查 node 是否变的可用。


当前，有3个组件同 Kubernetes node 接口交互：node 控制器、kubelet 和 kubectl。


### Node 控制器


Node 控制器是一个 Kubernetes master 组件，管理 nodes 的方方面面。


Node 控制器在 node 的生命周期中扮演了多个角色。第一个是当 node 注册时为它分配一个 CIDR block（如果打开了 CIDR 分配）。


第二个是使用云服务商提供了可用节点列表保持 node 控制器内部的 nodes 列表更新。如果在云环境下运行，任何时候当一个 node 不健康时 node 控制器将询问云服务 node 的虚拟机是否可用。如果不可用，node 控制器会将这个 node 从它的 nodes 列表删除。


第三个是监控 nodes 的健康情况。Node 控制器负责在 node 不能访问时（也即是 node 控制器因为某些原因没有收到心跳，例如 node 宕机）将它的 NodeStatus 的 NodeReady 状态更新为 ConditionUnknown。后续如果 node 持续不可访问，Node 控制器将删除 node 上的所有 pods（使用优雅终止）。（默认情况下 40s 开始报告 ConditionUnknown，在那之后 5m 开始删除 pods。）Node 控制器每隔 `--node-monitor-period` 秒检查每个 node 的状态。


在 Kubernetes 1.4 中我们更新了 node 控制器逻辑以更好的处理大批量 nodes 访问 master 出问题的情况（例如 master 的网络出了问题）。从 1.4 开始，node 控制器在决定删除 pod 之前会检查集群中所有 nodes 的状态。


大部分情况下， node 控制器把删除频率限制在每秒 `--node-eviction-rate` 个（默认为 0.1）。这表示它在 10 秒钟内不会从超过一个 node 上删除 pods。


当一个 availability zone 中的 node 变为不健康时，它的删除行为将发生改变。Node 控制器会同时检查 zone 中不健康（NodeReady  状态为 ConditionUnknown 或 ConditionFalse）的 nodes 的百分比。如果不健康 nodes 的部分超过 `--unhealthy-zone-threshold` （默认为 0.55），删除速率将会减小：如果集群较小（意即小于等于 `--large-cluster-size-threshold` 个 nodes - 默认为50），删除将会停止，否则删除速率将降为每秒 `--secondary-node-eviction-rate` 个（默认为 0.01）。在单个 availability zone 实施这些策略的原因是当一个 availability zone 可能从 master 分区时其它的仍然保持连接。如果你的集群没有跨越云服务商的多个 availability zones，那就只有一个 availability zone（整个集群）。


在多个 availability zones 分布你的 nodes 的一个关键原因是当整个 zone 故障时，工作负载可以转移到健康的 zones。因此，如果一个 zone 中的所有 nodes 都不健康时，node 控制器会以正常的速率 `--node-eviction-rate` 删除。在所有的 zones 都不健康（也即集群中没有健康 node）的极端情况下，node 控制器将假设 master 的连接出了某些问题，它将停止所有删除动作直到一些连接恢复。


从 Kubernetes 1.6 开始，NodeController 还负责删除运行在拥有 `NoExecute` taints 的 nodes 上的 pods，如果这些 pods 没有 tolerate 这些 taints。此外，作为一个默认禁用的 alpha 特性，NodeController 还负责根据 node 故障（例如 node 不可访问或没有 ready）添加 taints。请查看 [这个文档](/docs/concepts/configuration/assign-pod-node/#taints-and-tolerations-beta-feature)了解关于 `NoExecute` taints 和这个 alpha 特性。


### Nodes 自注册


当 kubelet 标志 `--register-node` 为 true （默认）时，它会尝试向 API 服务注册自己。这是首选模式，被绝大多数发行版选用。


  对于自注册模式，kubelet 使用下列参数启动：

  - `--api-servers` - apiservers 地址。
  - `--kubeconfig` - 用于向 apiserver 验证自己的凭据路径。
  - `--cloud-provider` - 如何从云服务商读取关于自己的元数据。
  - `--register-node` - 自动向  API 服务注册。
  - `--register-with-taints` - 使用 taints 列表（逗号分隔的 `<key>=<value>:<effect>`）注册 node。当 `register-node` 为 false 时无效。
  - `--node-ip` - node IP 地址。
  - `--node-labels` - 向集群注册时给 node 添加的 labels。
  - `--node-status-update-frequency` - 指定 kubelet 向 master 发送状态的频率。


目前，任何 kubelet 都被授权可以创建/修改任意 node 资源，但通常只对自己的进行创建/修改。（未来我们计划只允许一个 kubelet 修改它自己 node 的资源。）


#### 手动 Node 管理


集群管理员可以创建及修改 node 对象。


如果管理员希望手动创建 node 对象，请设置 kubelet 标记 `--register-node=false`。


管理员可以修改 node 资源（忽略 `--register-node` 设置）。修改包括在 node 上设置 labels及标记它为不可调度。


Nodes 上的 labels 可以和 pods 的 node selectors 一起使用来控制调度，例如限制一个 pod 只能在一个符合要求的 nodes 子集上运行。


标记一个 node 为不可调度的将防止新建 pods 调度到那个 node 之上，但不会影响任何已经在它之上的 pods。这是重启 node 等操作之前的一个有用的准备步骤。例如，标记一个 node 为不可调度的，执行以下命令：

```shell
kubectl cordon $NODENAME
```


请注意，被 daemonSet 控制器创建的 pods 将忽略 Kubernetes 调度器，且不会遵照 node 上不可调度的属性。这个假设基于守护程序属于节点机器，即使在准备重启而隔离应用的时候。


### Node 容量


Node 的容量（cpu 数量和内存容量）是 node 对象的一部分。通常情况下，在创建 node 对象时，它们会注册自己并报告自己的容量。如果你正在执行[手动 node 管理](#manual-node-administration)，那么你需要在添加 node 时手动设置 node 容量。


Kubernetes 调度器保证一个 node 上有足够的资源供其上的所有 pods 使用。它会检查 node 上所有容器要求的总和不会超过 node 的容量。这包括所有 kubelet 启动的容器，但不包含 Docker 启动的容器和不在容器中的进程。


如果希望显式的为非 pod 进程预留资源，你可以创建一个占位 pod。使用如下模板：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-reserver
spec:
  containers:
  - name: sleep-forever
    image: k8s.gcr.io/pause:0.8.0
    resources:
      requests:
        cpu: 100m
        memory: 100Mi
```


设置 `cpu` 和 `memory` 值为你希望预留的资源量。将文件放在清单文件夹中（kubelet 的 `--config=DIR` 标志）。当你希望预留资源时，在每个 kubelet 上都这样执行。


## API 对象


Node 是 Kubernetes REST API 的顶级资源。更多关于 API 对象的细节可以在这里找到： [Node API
object](/docs/api-reference/{{< param "version" >}}/#node-v1-core).``
