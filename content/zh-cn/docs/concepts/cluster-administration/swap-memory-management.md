---
title: 交换内存管理
content_type: concept
weight: 10
---
<!--
title: Swap memory management
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
Kubernetes can be configured to use swap memory on a {{< glossary_tooltip text="node" term_id="node" >}},
allowing the kernel to free up physical memory by swapping out pages to backing storage.
This is useful for multiple use-cases.
For example, nodes running workloads that can benefit from using swap,
such as those that have large memory footprints but only access a portion of that memory at any given time.
It also helps prevent Pods from being terminated during memory pressure spikes, 
shields nodes from system-level memory spikes that might compromise its stability,
allows for more flexible memory management on the node, and much more.
-->
你可以配置 Kubernetes 在{{< glossary_tooltip text="节点" term_id="node" >}}上使用交换内存，
让内核可以通过把页面换出到后备存储来释放物理内存。这在多种使用场景下都很有用。
例如，节点上运行的工作负载可以从使用交换内存中受益，比如那些内存占用很大但在任一时刻只访问其中一部分内存的工作负载。
它还有助于防止 Pod 在内存用量激增期间被终止，使节点免受可能危及自身稳定性的系统级内存激增影响，
让节点上的内存管理更加灵活，等等。

<!--
To learn about configuring swap in your cluster, read
[Configuring swap memory on Kubernetes nodes](/docs/tutorials/cluster-management/provision-swap-memory/).
-->
要了解如何在集群中配置交换内存，
请阅读[在 Kubernetes 节点上配置交换内存](/zh-cn/docs/tutorials/cluster-management/provision-swap-memory/)。

<!-- body -->

<!--
## Operating system support
-->
## 操作系统支持 {#operating-system-support}

<!--
* Linux nodes support swap; you need to configure each node to enable it.
  By default, the kubelet will **not** start on a Linux node that has swap enabled.
* Windows nodes require swap space.
  By default, the kubelet does **not** start on a Windows node that has swap disabled.
-->
* Linux 节点支持交换内存；你需要配置每个节点来启用它。
  默认情况下，kubelet 在启用了交换内存的 Linux 节点上**不会**启动。
* Windows 节点要求有交换空间。
  默认情况下，kubelet 在禁用了交换空间的 Windows 节点上**不会**启动。

<!--
## How does it work?
-->
## 此特性如何工作？ {#how-does-it-work}

<!--
There are a number of possible ways that one could envision swap use on a node.
If kubelet is already running on a node, it would need to be restarted after swap is provisioned in order to identify it.
-->
可以设想在节点上使用交换内存的方式有多种。
如果节点上已经运行着 kubelet，那么在制备好交换内存之后，需要重启 kubelet 才能识别它。

<!--
When kubelet starts on a node in which swap is provisioned and available
(with the `failSwapOn: false` configuration), kubelet will:
- Be able to start on this swap-enabled node.
- Direct the Container Runtime Interface (CRI) implementation, often referred to as the container runtime,
to allocate zero swap memory to Kubernetes workloads by default.
-->
当 kubelet 在已制备并可用交换内存的节点上启动时（配置为 `failSwapOn: false`），kubelet 将：

- 能够在这个启用了交换内存的节点上启动。
- 指示容器运行时接口（Container Runtime Interface，CRI）实现
  （通常称为容器运行时）默认不为 Kubernetes 工作负载分配任何交换内存。

<!--
Swap configuration on a node is exposed to a cluster admin via the
[`memorySwap` in the KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1).
As a cluster administrator, you can specify the node's behaviour in the
presence of swap memory by setting `memorySwap.swapBehavior`.
-->
节点上的交换内存配置通过
[KubeletConfiguration 中的 `memorySwap`](/zh-cn/docs/reference/config-api/kubelet-config.v1)
向集群管理员公开。作为集群管理员，你可以通过设置 `memorySwap.swapBehavior`
来指定存在交换内存时节点的行为。

<!--
### Swap behaviors
-->
### 交换内存行为 {#swap-behaviors}

<!--
You need to pick a [swap behavior](/docs/reference/node/swap-behavior/) to
use. Different nodes in your cluster can use different swap behaviors.
-->
你需要选择一种要使用的[交换内存行为](/zh-cn/docs/reference/node/swap-behavior/)。
集群中的不同节点可以使用不同的交换内存行为。

<!--
The swap behaviors you can choose for Linux nodes are:
-->
Linux 节点可选的交换内存行为包括：

<!--
`NoSwap` (default)
: Workloads running as Pods on this node do not and cannot use swap.
-->
`NoSwap`（默认）
: 在此节点上作为 Pod 运行的工作负载不会也不能使用交换内存。

<!--
`LimitedSwap`
: Kubernetes workloads can utilize swap memory.
-->
`LimitedSwap`
: Kubernetes 工作负载可以使用交换内存。

{{< note >}}
<!--
If you choose the NoSwap behavior, and you configure the kubelet to tolerate
swap space (`failSwapOn: false`), then your workloads don't use any swap.

However, processes outside of Kubernetes-managed containers, such as systemd
services (and even the kubelet itself!) **can** utilize swap.
-->
如果你选择 NoSwap 行为，并将 kubelet 配置为容忍交换空间（`failSwapOn: false`），
那么你的工作负载不会使用任何交换内存。

然而，Kubernetes 所管理的容器之外的进程，例如 systemd 服务（甚至 kubelet 自身！）**可以**利用交换内存。
{{< /note >}}

<!--
You can read [configuring swap memory on Kubernetes nodes](/docs/tutorials/cluster-management/provision-swap-memory/) to learn about enabling swap for your cluster.
-->
你可以阅读[在 Kubernetes 节点上配置交换内存](/zh-cn/docs/tutorials/cluster-management/provision-swap-memory/)来了解如何为集群启用交换内存。

<!--
### Container runtime integration
-->
### 容器运行时集成 {#container-runtime-integration}

<!--
The kubelet uses the container runtime API, and directs the container runtime to
apply specific configuration (for example, in the cgroup v2 case, `memory.swap.max`) in a manner that will
enable the desired swap configuration for a container. For runtimes that use control groups, or cgroups,
the container runtime is then responsible for writing these settings to the container-level cgroup.
-->
kubelet 使用容器运行时 API，指示容器运行时以能为容器启用所需交换内存配置的方式应用特定配置
（例如，在 cgroup v2 的情况下为 `memory.swap.max`）。对于使用控制组（即 cgroup）的运行时，
容器运行时随后负责将这些设置写入容器级的 cgroup。

<!--
## Observability for swap use
-->
## 交换内存使用的可观测性 {#observability-for-swap-use}

<!--
### Node and container level metric statistics
-->
### 节点级和容器级指标统计 {#node-and-container-level-metric-statistics}

<!--
Kubelet now collects node and container level metric statistics,
which can be accessed at the `/metrics/resource` (which is used mainly by monitoring
tools like Prometheus) and `/stats/summary` (which is used mainly by Autoscalers) kubelet HTTP endpoints.
This allows clients who can directly request the kubelet to
monitor swap usage and remaining swap memory when using `LimitedSwap`.
Additionally, a `machine_swap_bytes` metric has been added to cadvisor to show
the total physical swap capacity of the machine.
See [this page](/docs/reference/instrumentation/node-metrics/) for more info.
-->
kubelet 现在会收集节点级和容器级的指标统计信息，
可以通过 `/metrics/resource`（主要由 Prometheus 等监控工具使用）
和 `/stats/summary`（主要由自动扩缩容工具使用）这两个 kubelet HTTP 端点访问。
这让能够直接向 kubelet 发起请求的客户端在使用 `LimitedSwap` 时可以监控交换内存的使用情况和剩余交换内存量。
此外，cadvisor 中还新增了 `machine_swap_bytes` 指标，用于显示机器的物理交换内存总容量。
更多信息请参阅[此页面](/zh-cn/docs/reference/instrumentation/node-metrics/)。

<!--
For example, these `/metrics/resource` are supported:
- `node_swap_usage_bytes`: Current swap usage of the node in bytes.
- `container_swap_usage_bytes`: Current amount of the container swap usage in bytes.
- `container_swap_limit_bytes`: Current amount of the container swap limit in bytes.
-->
例如，支持以下 `/metrics/resource`：

- `node_swap_usage_bytes`：节点当前的交换内存使用量，单位为字节。
- `container_swap_usage_bytes`：容器当前的交换内存使用量，单位为字节。
- `container_swap_limit_bytes`：容器当前的交换内存限额，单位为字节。

<!--
### Using `kubectl top --show-swap`
-->
### 使用 `kubectl top --show-swap` {#using-kubectl-top-show-swap}

<!--
Querying metrics is valuable, but somewhat cumbersome, as these metrics
are designed to be used by software rather than humans.
In order to consume this data in a more user-friendly way,
the `kubectl top` command has been extended to support swap metrics, using the `--show-swap` flag.
-->
查询指标很有价值，但略显繁琐，因为这些指标的设计初衷是供软件而非人类使用。
为了以更友好的方式使用这些数据，
`kubectl top` 命令已扩展为支持交换内存指标，可通过 `--show-swap` 标志使用。

<!--
In order to receive information about swap usage on nodes, `kubectl top nodes --show-swap` can be used:
-->
要获取节点上交换内存使用情况的信息，可以使用 `kubectl top nodes --show-swap`：

```shell
kubectl top nodes --show-swap
```

<!--
This will result in an output similar to:
-->
输出结果类似于：

```
NAME    CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)   SWAP(bytes)    SWAP(%)       
node1   1m           10%      2Mi             10%         1Mi            0%   
node2   5m           10%      6Mi             10%         2Mi            0%   
node3   3m           10%      4Mi             10%         <unknown>      <unknown>   
```

<!--
In order to receive information about swap usage by pods, `kubectl top pods --show-swap` can be used:
-->
要获取各 Pod 的交换内存使用情况信息，可以使用 `kubectl top pods --show-swap`：

```shell
kubectl top pod -n kube-system --show-swap
```

<!--
This will result in an output similar to:
-->
输出结果类似于：

```
NAME                                      CPU(cores)   MEMORY(bytes)   SWAP(bytes)
coredns-58d5bc5cdb-5nbk4                  2m           19Mi            0Mi
coredns-58d5bc5cdb-jsh26                  3m           37Mi            0Mi
etcd-node01                               51m          143Mi           5Mi
kube-apiserver-node01                     98m          824Mi           16Mi
kube-controller-manager-node01            20m          135Mi           9Mi
kube-proxy-ffgs2                          1m           24Mi            0Mi
kube-proxy-fhvwx                          1m           39Mi            0Mi
kube-scheduler-node01                     13m          69Mi            0Mi
metrics-server-8598789fdb-d2kcj           5m           26Mi            0Mi   
```

<!--
### Nodes to report swap capacity as part of node status
-->
### 节点在节点状态中报告交换内存容量 {#nodes-to-report-swap-capacity-as-part-of-node-status}

<!--
A new node status field is now added, `node.status.nodeInfo.swap.capacity`, to report the swap capacity of a node.
-->
现在新增了一个节点状态字段 `node.status.nodeInfo.swap.capacity`，用于报告节点的交换内存容量。

<!--
As an example, the following command can be used to retrieve the swap capacity of the nodes in a cluster:
-->
例如，可以使用以下命令获取集群中各节点的交换内存容量：

```shell
kubectl get nodes -o go-template='{{range .items}}{{.metadata.name}}: {{if .status.nodeInfo.swap.capacity}}{{.status.nodeInfo.swap.capacity}}{{else}}<unknown>{{end}}{{"\n"}}{{end}}'
```

<!--
This will result in an output similar to:
-->
输出结果类似于：

```
node1: 21474836480
node2: 42949664768
node3: <unknown>
```

{{< note >}}
<!--
The `<unknown>` value indicates that the `.status.nodeInfo.swap.capacity` field is not set for that Node.
This probably means that the node does not have swap provisioned, or less likely,
that the kubelet is not able to determine the swap capacity of the node.
-->
`<unknown>` 值表示该节点的 `.status.nodeInfo.swap.capacity` 字段未设置。
这通常意味着节点没有制备交换内存；在较小概率下，
也可能是 kubelet 无法确定该节点的交换内存容量。
{{< /note >}}

<!--
### Swap discovery using Node Feature Discovery (NFD) {#node-feature-discovery}
-->
### 使用 Node Feature Discovery（NFD）发现交换内存 {#node-feature-discovery}

<!--
[Node Feature Discovery](https://github.com/kubernetes-sigs/node-feature-discovery)
is a Kubernetes addon for detecting hardware features and configuration.
It can be utilized to discover which nodes are provisioned with swap.
-->
[Node Feature Discovery](https://github.com/kubernetes-sigs/node-feature-discovery)
是一个用于检测硬件特性和配置的 Kubernetes 插件。可以用它来发现哪些节点制备了交换内存。

<!--
As an example, to figure out which nodes are provisioned with swap,
use the following command:
-->
例如，要找出哪些节点制备了交换内存，请使用以下命令：

```shell
kubectl get nodes -o jsonpath='{range .items[?(@.metadata.labels.feature\.node\.kubernetes\.io/memory-swap)]}{.metadata.name}{"\t"}{.metadata.labels.feature\.node\.kubernetes\.io/memory-swap}{"\n"}{end}'
```

<!--
This will result in an output similar to:
-->
输出结果类似于：

```
k8s-worker1: true
k8s-worker2: true
k8s-worker3: false
```

<!--
In this example, swap is provisioned on nodes `k8s-worker1` and `k8s-worker2`, but not on `k8s-worker3`.
-->
在此示例中，节点 `k8s-worker1` 和 `k8s-worker2` 制备了交换内存，而 `k8s-worker3` 没有。

<!--
## Risks and caveats
-->
## 风险与注意事项 {#risks-and-caveats}

{{< caution >}}
<!--
It is deeply encouraged to encrypt the swap space.
See Memory-backed volumes [memory-backed volumes](#memory-backed-volumes) for more info.
-->
强烈建议对交换空间进行加密。更多信息参阅[内存支持的卷](#memory-backed-volumes)。
{{< /caution >}}

<!--
Having swap available on a system reduces predictability.
While swap can enhance performance by making more RAM available, swapping data
back to memory is a heavy operation, sometimes slower by many orders of magnitude,
which can cause unexpected performance regressions.
-->
系统上可用交换内存会降低可预测性。虽然交换内存可以通过让更多 RAM 可用而提升性能，但把数据换回内存
是一项开销很大的操作，有时会慢上好几个数量级，这可能导致意外的性能回退。

<!--
Furthermore, swap changes a system's behaviour under memory pressure.
Enabling swap increases the risk of noisy neighbors,
where Pods that frequently use their RAM may cause other Pods to swap.
In addition, since swap allows for greater memory usage for workloads in Kubernetes that cannot be predictably accounted for,
and due to unexpected packing configurations,
the scheduler currently does not account for swap memory usage.
This heightens the risk of noisy neighbors.
-->
此外，交换内存会改变系统在内存压力下的行为。启用交换内存会增加吵闹的邻居的风险，
经常使用自身 RAM 的 Pod 可能会导致其他 Pod 被换出。
另外，由于交换内存允许 Kubernetes 中的工作负载使用更多无法被可预测地核算的内存，
加上意外的装箱配置，调度器目前不会核算交换内存的使用量。
这进一步加剧了吵闹的邻居的风险。

<!--
The performance of a node with swap memory enabled depends on the underlying physical storage.
When swap memory is in use, performance will be significantly worse in an I/O
operations per second (IOPS) constrained environment, such as a cloud VM with
I/O throttling, when compared to faster storage mediums like solid-state drives
or NVMe.
As swap might cause IO pressure, it is recommended to give a higher IO latency
priority to system critical daemons. See the relevant section in the
[recommended practices](#good-practice-for-using-swap-in-a-kubernetes-cluster) section below.
-->
启用了交换内存的节点，其性能取决于底层物理存储。
在使用交换内存时，与固态硬盘或 NVMe 等更快的存储介质相比，
在每秒 I/O 操作数（IOPS）受限的环境（例如存在 I/O 限流的云虚拟机）中，性能会明显变差。
由于交换内存可能造成 I/O 压力，建议为系统关键的守护进程赋予更高的 I/O 延迟优先级。
请参阅下文的[推荐做法](#good-practice-for-using-swap-in-a-kubernetes-cluster)一节。

<!--
### Memory-backed volumes
-->
### 内存支持的卷 {#memory-backed-volumes}

<!--
On Linux nodes, memory-backed volumes (such as [`secret`](/docs/concepts/configuration/secret/)
volume mounts, or [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) with `medium: Memory`)
are implemented with a `tmpfs` filesystem.
The contents of such volumes should remain in memory at all times, hence should
not be swapped to disk.
To ensure the contents of such volumes remain in memory, the `noswap` tmpfs option
is being used.
-->
在 Linux 节点上，由内存支持的卷（例如 [`secret`](/zh-cn/docs/concepts/configuration/secret/)
卷挂载，或带有 `medium: Memory` 的 [`emptyDir`](/zh-cn/docs/concepts/storage/volumes/#emptydir)）
是使用 `tmpfs` 文件系统实现的。这类卷的内容应始终保留在内存中，因此不应被换出到磁盘。
为确保这类卷的内容保留在内存中，使用了 `noswap` tmpfs 选项。

<!--
The Linux kernel officially supports the `noswap` option from version 6.3 (more info
can be found in [Linux Kernel Version Requirements](/docs/reference/node/kernel-version-requirements/#requirements-other)).
However, the different distributions often choose to backport this mount option to older
Linux versions as well.
-->
Linux 内核从 6.3 版本开始正式支持 `noswap` 选项（更多信息参见
[Linux 内核版本要求](/zh-cn/docs/reference/node/kernel-version-requirements/#requirements-other)）。
不过，不同的发行版通常也会选择把这个挂载选项向后移植到较旧的 Linux 版本中。

<!--
In order to verify whether the node supports the `noswap` option, the kubelet will do the following:
* If the kernel's version is above 6.3 then the `noswap` option will be assumed to be supported.
* Otherwise, kubelet would try to mount a dummy tmpfs with the `noswap` option at startup.
  If kubelet fails with an error indicating of an unknown option, `noswap` will be assumed
  to not be supported, hence will not be used.
  A kubelet log entry will be emitted to warn the user about memory-backed volumes might swap to disk.
  If kubelet succeeds, the dummy tmpfs will be deleted and the `noswap` option will be used.
  * If the `noswap` option is not supported, kubelet will emit a warning log entry,
    then continue its execution.
-->
为了验证节点是否支持 `noswap` 选项，kubelet 将执行以下操作：

* 如果内核版本高于 6.3，则假定支持 `noswap` 选项。
* 否则，kubelet 会在启动时尝试以 `noswap` 选项挂载一个临时 tmpfs。
  如果 kubelet 因未知选项而失败，则假定不支持 `noswap`，因而不会使用它。
  kubelet 会打印一条日志，提醒用户内存支持的卷可能会被换出到磁盘。
  如果 kubelet 成功，则删除这个临时 tmpfs 并使用 `noswap` 选项。
  * 如果不支持 `noswap` 选项，kubelet 会打印一条警告日志，然后继续执行。

<!--
See [Configuring swap memory on Kubernetes nodes](/docs/tutorials/cluster-management/provision-swap-memory/) for an example of setting up swap.
However, handling encrypted swap is not within the scope of kubelet;
rather, it is a general OS configuration concern and should be addressed at that level.
It is the administrator's responsibility to provision encrypted swap to mitigate this risk.
-->
关于设置交换内存的示例，请参阅[在 Kubernetes 节点上配置交换内存](/zh-cn/docs/tutorials/cluster-management/provision-swap-memory/)。
不过，处理加密交换内存不属于 kubelet 的职责范围；它其实是操作系统配置层面的通用问题，应在该层面解决。
管理员有责任制备加密的交换内存来降低这一风险。

<!--
### Evictions
-->
### 驱逐 {#evictions}

<!--
Configuring memory eviction thresholds for swap-enabled nodes can be tricky.
-->
为启用了交换内存的节点配置内存驱逐阈值可能很棘手。

<!--
With swap being disabled, it is reasonable to configure kubelet's eviction thresholds
to be a bit lower than the node's memory capacity.
The rationale is that we want Kubernetes to start evicting Pods before the node runs out of memory
and invokes the Out Of Memory (OOM) killer, since the OOM killer is not Kubernetes-aware,
therefore does not consider things like QoS, pod priority, or other Kubernetes-specific factors.
-->
在禁用交换内存的情况下，把 kubelet 的驱逐阈值配置为略低于节点的内存容量是合理的。
其理由是，我们希望在节点内存耗尽并调用内存不足（Out Of Memory，OOM）
终止程序之前，Kubernetes 就开始驱逐 Pod；因为 OOM 终止程序并不感知 Kubernetes，
因此它不会考虑 QoS、Pod 优先级或其他 Kubernetes 特有的因素。

<!--
With swap enabled, the situation is more complex.
In Linux, the `vm.min_free_kbytes` parameter defines the memory threshold for the kernel
to start aggressively reclaiming memory, which includes swapping out pages.
If the kubelet's eviction thresholds are set in a way that eviction would take place
before the kernel starts reclaiming memory, it could lead to workloads never
being able to swap out during node memory pressure.
However, setting the eviction thresholds too high could result in the node running out of memory
and invoking the OOM killer, which is not ideal either.
-->
启用交换内存后，情况会更复杂。在 Linux 中，`vm.min_free_kbytes`
参数定义了内核开始积极回收内存（包括换出页面）的内存阈值。
如果把 kubelet 的驱逐阈值设置为在内核开始回收内存之前就发生驱逐，
可能会导致工作负载在节点出现内存压力期间始终无法换出。
然而，把驱逐阈值设置得太高又可能导致节点内存耗尽并调用 OOM 终止程序，这同样不理想。

<!--
To address this, it is recommended to set the kubelet's eviction thresholds
to be slightly lower than the `vm.min_free_kbytes` value.
This way, the node can start swapping before kubelet would start evicting Pods,
allowing workloads to swap out unused data and preventing evictions from happening.
On the other hand, since it is just slightly lower, kubelet is likely to start evicting Pods
before the node runs out of memory, thus avoiding the OOM killer.
-->
为解决这个问题，建议把 kubelet 的驱逐阈值设置为略低于 `vm.min_free_kbytes` 的值。
这样，节点可以在 kubelet 开始驱逐 Pod 之前就开始交换，让工作负载能够换出未使用的数据，从而避免发生驱逐。
另一方面，由于只是略低，kubelet 很可能会在节点内存耗尽之前就开始驱逐 Pod，从而避免调用 OOM 终止程序。

<!--
The value of `vm.min_free_kbytes` can be determined by running the following command on the node:
-->
可以在节点上运行以下命令来确定 `vm.min_free_kbytes` 的值：

```shell
cat /proc/sys/vm/min_free_kbytes
```

<!--
### Unutilized swap space
-->
### 未使用的交换空间 {#unutilized-swap-space}

<!--
Under the `LimitedSwap` behavior, the amount of swap available to a Pod is determined automatically,
based on the proportion of the memory requested relative to the node's total memory
(For more details, see the [section below](#how-is-the-swap-limit-being-determined-with-limitedswap)).
-->
在 `LimitedSwap` 行为下，Pod 可用的交换内存量会根据其内存请求相对于节点总内存的比例自动确定
（更多细节请参阅[下文](#how-is-the-swap-limit-being-determined-with-limitedswap)一节）。

<!--
This design means that usually there would be some portion of swap that will remain
restricted for Kubernetes workloads.
For example, since Kubernetes {{< skew currentVersion >}} does not permit swap use for
Pods in the Guaranteed {{< glossary_tooltip text="QoS class" term_id="qos-class" >}},
the amount of swap that's proportional to the memory request for Guaranteed pods would
remain unused by Kubernetes workloads.
-->
这种设计意味着通常会有部分交换内存仍然不能被 Kubernetes 工作负载使用。
例如，由于 Kubernetes {{< skew currentVersion >}} 不允许
Guaranteed {{< glossary_tooltip text="QoS 类" term_id="qos-class" >}} 中的 Pod 使用交换内存，
与 Guaranteed Pod 的内存请求成比例的那部分交换内存将会闲置，不被 Kubernetes 工作负载使用。

<!--
This behavior carries some risk in a situation where many pods are not eligible for swapping.
On the other hand, it effectively keeps some system-reserved amount of swap memory that can be used by processes
outside of Kubernetes' scope, such as system daemons and even kubelet itself.
-->
在许多 Pod 都不符合交换条件的情况下，这种行为会带来一定风险。
另一方面，它实际上保留了一部分系统预留的交换内存，可供 Kubernetes 范围之外的进程使用，
例如系统守护进程甚至 kubelet 自身。

<!--
## Good practice for using swap in a Kubernetes cluster
-->
## 在 Kubernetes 集群中使用交换内存的良好实践 {#good-practice-for-using-swap-in-a-kubernetes-cluster}

<!--
### Disable swap for system-critical daemons
-->
### 为系统关键的守护进程禁用交换内存 {#disable-swap-for-system-critical-daemons}

<!--
During the testing phase and based on user feedback, it was observed that the performance
of system-critical daemons and services might degrade.
This implies that system daemons, including the kubelet, could operate slower than usual.
If this issue is encountered, it is advisable to configure the cgroup of the system slice
to prevent swapping (i.e., set `memory.swap.max=0`).
-->
在测试阶段并根据用户反馈，我们观察到系统关键的守护进程和服务的性能可能会下降。
这意味着系统守护进程（包括 kubelet）的运行速度可能比平时更慢。
如果遇到这一问题，建议把 system 切片的 cgroup 配置为禁止交换（即设置 `memory.swap.max=0`）。

<!--
### Protect system-critical daemons for I/O latency
-->
### 为 I/O 延迟保护系统关键的守护进程 {#protect-system-critical-daemons-for-i-o-latency}

<!--
Swap can increase the I/O load on a node.
When memory pressure causes the kernel to rapidly swap pages in and out,
system-critical daemons and services that rely on I/O operations may
experience performance degradation.
-->
交换内存会增加节点上的 I/O 负载。当内存压力导致内核快速地把页面换入换出时，
依赖 I/O 操作的系统关键的守护进程和服务可能会出现性能下降。

<!--
To mitigate this, it is recommended for systemd users to prioritize the system slice in terms of I/O latency.
For non-systemd users,
setting up a dedicated cgroup for system daemons and processes and prioritizing I/O latency in the same way is advised.
This can be achieved by setting `io.latency` for the system slice,
thereby granting it higher I/O priority.
See [cgroup's documentation](https://www.kernel.org/doc/Documentation/admin-guide/cgroup-v2.rst) for more info.
-->
为缓解这一问题，建议 systemd 用户从 I/O 延迟的角度优先考虑 system 切片。对于非 systemd 用户，
建议为系统守护进程和进程设置一个专用 cgroup，并以同样的方式优先考虑 I/O 延迟。
这可以通过为 system 切片设置 `io.latency` 来实现，从而赋予它更高的 I/O 优先级。
更多信息请参阅 [cgroup 的文档](https://www.kernel.org/doc/Documentation/admin-guide/cgroup-v2.rst)。

<!--
### Swap and control plane nodes
-->
### 交换内存与控制平面节点 {#swap-and-control-plane-nodes}

<!--
The Kubernetes project recommends running control plane nodes without any swap space configured.
The control plane primarily hosts Guaranteed QoS Pods, so swap can generally be disabled.
The main concern is that swapping critical services on the control plane could negatively impact performance.
-->
Kubernetes 项目建议在运行控制平面节点时不配置任何交换空间。
控制平面主要运行 Guaranteed QoS Pod，因此通常可以禁用交换内存。
主要顾虑是控制平面上的关键服务被换出，可能会对性能产生负面影响。

<!--
### Use of a dedicated disk for swap
-->
### 使用专用磁盘承载交换内存 {#use-of-a-dedicated-disk-for-swap}

<!--
The Kubernetes project recommends using encrypted swap, whenever you run nodes with swap enabled.
If swap resides on a partition or the root filesystem, workloads may interfere
with system processes that need to write to disk.
When they share the same disk, processes can overwhelm swap,
disrupting the I/O of kubelet, container runtime, and systemd, which would impact other workloads.
Since swap space is located on a disk, it is crucial to ensure the disk is fast enough for the intended use cases.
Alternatively, one can configure I/O priorities between different mapped areas of a single backing device.
-->
Kubernetes 项目建议，无论何时运行启用了交换内存的节点，都应使用加密的交换内存。
如果交换内存位于某个分区或根文件系统上，工作负载可能会干扰需要写入磁盘的系统进程。
当它们共用同一块磁盘时，进程可能会压垮交换内存，
扰乱 kubelet、容器运行时和 systemd 的 I/O，进而影响其他工作负载。
由于交换空间位于磁盘上，确保磁盘对于预期用例足够快至关重要。
或者，你也可以在单个后备设备的不同映射区域之间配置 I/O 优先级。

<!--
### Swap-aware scheduling
-->
### 交换内存感知调度 {#swap-aware-scheduling}

<!--
Kubernetes {{< skew currentVersion >}} does not support allocating Pods to nodes in a way that accounts
for swap memory usage. The scheduler typically uses _requests_ for infrastructure resources
to guide Pod placement, and Pods do not request swap space; they just request `memory`.
This means that the scheduler does not consider swap memory when making scheduling decisions.
While this is something we are actively working on, it is not yet implemented.
-->
Kubernetes {{< skew currentVersion >}} 不支持在把 Pod 分配到节点时考虑交换内存的使用情况。
调度器通常使用基础设施资源的**请求值**来指导 Pod 的放置，而 Pod 并不会请求交换空间；它们只请求 `memory`。
这意味着调度器在做出调度决策时不会考虑交换内存。虽然我们正在积极处理这一点，但目前尚未实现。

<!--
In order for administrators to ensure that Pods are not scheduled on nodes
with swap memory unless they are specifically intended to use it,
Administrators can taint nodes with swap available to protect against this problem.
Taints will ensure that workloads which tolerate swap will not spill onto nodes without swap under load.
-->
为了让管理员确保 Pod 不会被调度到有交换内存的节点上（除非明确打算使用交换内存），
管理员可以为有可用交换内存的节点添加污点来防止这一问题。
污点将确保容忍交换内存的工作负载在负载较高时不会溢出到没有交换内存的节点上。

<!--
### Selecting storage for optimal performance
-->
### 为获得最佳性能选择存储 {#selecting-storage-for-optimal-performance}

<!--
The storage device designated for swap space is critical to maintaining system responsiveness
during high memory usage.
Rotational hard disk drives (HDDs) are ill-suited for this task as their mechanical nature introduces significant latency,
leading to severe performance degradation and system thrashing.
For modern performance needs, a device such as a Solid State Drive (SSD) is probably the appropriate choice for swap,
as its low-latency electronic access minimizes the slowdown.
-->
用于交换空间的存储设备对于在高内存使用期间维持系统响应能力至关重要。
机械硬盘（HDD）不适合这项任务，因为其机械特性会引入明显的延迟，导致严重的性能下降和系统抖动。
对于现代性能需求，固态硬盘（SSD）之类的设备可能是承载交换内存的合适选择，
因为其低延迟的电子访问可以将速度下降降到最低。

<!--
## Swap behavior details
-->
## 交换内存行为详解 {#swap-behavior-details}

<!--
### How is the swap limit being determined with LimitedSwap?
-->
### 如何通过 LimitedSwap 确定交换内存限额？ {#how-is-the-swap-limit-being-determined-with-limitedswap}

<!--
The configuration of swap memory, including its limitations, presents a significant
challenge. Not only is it prone to misconfiguration, but as a system-level property, any
misconfiguration could potentially compromise the entire node rather than just a specific
workload. To mitigate this risk and ensure the health of the node, we have implemented
Swap with automatic configuration of limitations.
-->
交换内存的配置（包括其限制）是一项重大挑战。它不仅容易出现配置错误，而且作为系统级属性，
任何错误配置都可能危及整个节点，而不只是某个特定的工作负载。为降低这一风险并确保节点的健康，
我们实现了带限制自动配置的交换内存。

<!--
With `LimitedSwap`, Pods that do not fall under the Burstable QoS classification (i.e.
`BestEffort`/`Guaranteed` QoS Pods) are prohibited from utilizing swap memory.
`BestEffort` QoS Pods exhibit unpredictable memory consumption patterns and lack
information regarding their memory usage, making it difficult to determine a safe
allocation of swap memory.
-->
使用 `LimitedSwap` 时，不属于 Burstable QoS 类别的 Pod（即 `BestEffort`/`Guaranteed` QoS Pod）
被禁止使用交换内存。`BestEffort` QoS Pod 表现出不可预测的内存消耗模式，而且缺少有关其内存使用情况的信息，
因此很难确定安全的交换内存分配量。

<!--
Conversely, `Guaranteed` QoS Pods are typically employed for applications that rely on the
precise allocation of resources specified by the workload, with memory being immediately available.
To maintain the aforementioned security and node health guarantees,
these Pods are not permitted to use swap memory when `LimitedSwap` is in effect.
In addition, high-priority pods are not permitted to use swap in order to ensure the memory
they consume always resides in RAM, hence ready to use.
-->
相反，`Guaranteed` QoS Pod 通常用于依赖工作负载所指定的精确资源分配、且内存立即可用的应用。
为了维持上述安全和节点健康保证，当 `LimitedSwap` 生效时，这些 Pod 不允许使用交换内存。
此外，高优先级 Pod 也不允许使用交换内存，以确保它们消耗的内存始终驻留在 RAM 中，随时可用。

<!--
Prior to detailing the calculation of the swap limit, it is necessary to define the following terms:
* `nodeTotalMemory`: The total amount of physical memory available on the node.
* `totalPodsSwapAvailable`: The total amount of swap memory on the node that is available for use by Pods (some swap memory may be reserved for system use).
* `containerMemoryRequest`: The container's memory request.
-->
在详细说明交换内存限额的计算方式之前，有必要先定义以下术语：

* `nodeTotalMemory`：节点上可用的物理内存总量。
* `totalPodsSwapAvailable`：节点上可供 Pod 使用的交换内存总量（部分交换内存可能保留给系统使用）。
* `containerMemoryRequest`：容器的内存请求。

<!--
Swap limitation is configured as:  
( `containerMemoryRequest` / `nodeTotalMemory` ) × `totalPodsSwapAvailable`
-->
交换内存限额配置为：  
（ `containerMemoryRequest` / `nodeTotalMemory` ）× `totalPodsSwapAvailable`

<!--
In other words, the amount of swap that a container is able to use is proportionate to its
memory request, the node's total physical memory and the total amount of swap memory on
the node that is available for use by Pods.
-->
换句话说，容器能够使用的交换内存量与其内存请求、节点的总物理内存以及节点上可供 Pod
使用的交换内存总量成比例关系。

<!--
It is important to note that, for containers within Burstable QoS Pods, it is possible to
opt-out of swap usage by specifying memory requests that are equal to memory limits.
Containers configured in this manner will not have access to swap memory.
-->
值得注意的是，对于 Burstable QoS Pod 中的容器，可以通过设置与内存限制相等的内存请求来选择不使用交换内存。
以这种方式配置的容器将无法访问交换内存。

## {{% heading "whatsnext" %}}

<!--
- To learn about managing swap on Linux nodes, read
  [configuring swap memory on Kubernetes nodes](/docs/tutorials/cluster-management/provision-swap-memory/).
- You can check out a [blog post about Kubernetes and swap](/blog/2025/03/25/swap-linux-improvements/)
- For background information, please see the original KEP, [KEP-2400](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2400-node-swap),
and its [design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md).
-->
- 要了解如何在 Linux 节点上管理交换内存，请阅读
  [在 Kubernetes 节点上配置交换内存](/zh-cn/docs/tutorials/cluster-management/provision-swap-memory/)。
- 你可以查看一篇[关于 Kubernetes 与交换内存的博客文章](/blog/2025/03/25/swap-linux-improvements/)
- 如需背景信息，请参阅最初的 KEP，[KEP-2400](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2400-node-swap)，
  及其[设计](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md)。
