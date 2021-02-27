---
title: 配置资源不足时的处理方式
content_type: concept
---
<!--
reviewers:
- derekwaynecarr
- vishh
- timstclair
title: Configure Out Of Resource Handling
content_type: concept
-->

<!-- overview -->

<!--
This page explains how to configure out of resource handling with `kubelet`.

The `kubelet` needs to preserve node stability when available compute resources
are low. This is especially important when dealing with incompressible
compute resources, such as memory or disk space. If such resources are exhausted,
nodes become unstable.
-->
本页介绍资源不足时如何配置 `kubelet` 来进行处理。

当可用计算资源较少时，`kubelet`需要保证节点稳定性。
这在处理如内存和硬盘之类的不可压缩资源时尤为重要。
如果任意一种资源耗尽，节点将会变得不稳定。

<!-- body -->


<!--
### Eviction Signals

The `kubelet` supports eviction decisions based on the signals described in the following
table. The value of each signal is described in the Description column, which is based on
the `kubelet` summary API.
-->
### 驱逐信号

`kubelet` 支持按照以下表格中描述的信号触发驱逐决定。
每个信号的值在 description 列描述，基于 `kubelet` 摘要 API。

<!--
| Eviction Signal            | Description                                                         |
|----------------------------|---------------------------------------------------------------------|
| `memory.available` | `memory.available` := `node.status.capacity[memory]` - `node.stats.memory.workingSet` |
| `nodefs.available` | `nodefs.available` := `node.stats.fs.available` |
| `nodefs.inodesFree` | `nodefs.inodesFree` := `node.stats.fs.inodesFree` |
| `imagefs.available` | `imagefs.available` := `node.stats.runtime.imagefs.available` |
| `imagefs.inodesFree` | `imagefs.inodesFree` := `node.stats.runtime.imagefs.inodesFree` |
| `pid.available`      | `pid.available` := `node.stats.rlimit.maxpid` - `node.stats.rlimit.curproc`           |
-->
| 驱逐信号                   | 描述                                                                |
|----------------------------|---------------------------------------------------------------------|
| `memory.available` | `memory.available` := `node.status.capacity[memory]` - `node.stats.memory.workingSet` |
| `nodefs.available` | `nodefs.available` := `node.stats.fs.available` |
| `nodefs.inodesFree` | `nodefs.inodesFree` := `node.stats.fs.inodesFree` |
| `imagefs.available` | `imagefs.available` := `node.stats.runtime.imagefs.available` |
| `imagefs.inodesFree` | `imagefs.inodesFree` := `node.stats.runtime.imagefs.inodesFree` |
| `pid.available`      | `pid.available` := `node.stats.rlimit.maxpid` - `node.stats.rlimit.curproc`           |
<!--
Each of the above signals supports either a literal or percentage based value.
The percentage based value is calculated relative to the total capacity
associated with each signal.
-->
上面的每个信号都支持字面值或百分比的值。基于百分比的值的计算与每个信号对应的总容量相关。

<!--
The value for `memory.available` is derived from the cgroupfs instead of tools
like `free -m`. This is important because `free -m` does not work in a
container, and if users use the [node
allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) feature, out of resource decisions
are made local to the end user Pod part of the cgroup hierarchy as well as the
root node. This
[script](/examples/admin/resource/memory-available.sh)
reproduces the same set of steps that the `kubelet` performs to calculate
`memory.available`. The `kubelet` excludes inactive_file (i.e. # of bytes of
file-backed memory on inactive LRU list) from its calculation as it assumes that
memory is reclaimable under pressure.
-->
`memory.available` 的值从 cgroupfs 获取，而不是通过类似 `free -m` 的工具。
这很重要，因为 `free -m` 不能在容器中工作，并且如果用户使用了
[节点可分配资源](/zh/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
特性，资源不足的判定将同时在本地 cgroup 层次结构的终端用户 Pod 部分和根节点做出。
这个[脚本](/zh/examples/admin/resource/memory-available.sh)
复现了与 `kubelet` 计算 `memory.available` 相同的步骤。
`kubelet` 将 `inactive_file`（意即活动 LRU 列表上基于文件后端的内存字节数）从计算中排除，
因为它假设内存在出现压力时将被回收。


<!--
`kubelet` supports only two filesystem partitions.

1. The `nodefs` filesystem that kubelet uses for volumes, daemon logs, etc.
2. The `imagefs` filesystem that container runtimes uses for storing images and
   container writable layers.
-->
`kubelet` 只支持两种文件系统分区。

1. `nodefs` 文件系统，kubelet 将其用于卷和守护程序日志等。
2. `imagefs` 文件系统，容器运行时用于保存镜像和容器可写层。

<!--
`imagefs` is optional. `kubelet` auto-discovers these filesystems using
cAdvisor. `kubelet` does not care about any other filesystems. Any other types
of configurations are not currently supported by the kubelet. For example, it is
*not OK* to store volumes and logs in a dedicated `filesystem`.

In future releases, the `kubelet` will deprecate the existing [garbage
collection](/docs/concepts/cluster-administration/kubelet-garbage-collection/)
support in favor of eviction in response to disk pressure.
-->
`imagefs` 可选。`kubelet` 使用 cAdvisor 自动发现这些文件系统。
`kubelet` 不关心其它文件系统。当前不支持配置任何其它类型。
例如，在专用 `filesytem` 中存储卷和日志是 _不可以_ 的。

在将来的发布中，`kubelet`将废除当前存在的
[垃圾回收](/zh/docs/concepts/cluster-administration/kubelet-garbage-collection/)
机制，这种机制目前支持将驱逐操作作为对磁盘压力的响应。

<!--
### Eviction Thresholds

The `kubelet` supports the ability to specify eviction thresholds that trigger the `kubelet` to reclaim resources.

Each threshold has the following form:

`[eviction-signal][operator][quantity]`

where:

* `eviction-signal` is an eviction signal token as defined in the previous table.
* `operator` is the desired relational operator, such as `<` (less than).
* `quantity` is the eviction threshold quantity, such as `1Gi`. These tokens must
match the quantity representation used by Kubernetes. An eviction threshold can also
be expressed as a percentage using the `%` token.

For example, if a node has `10Gi` of total memory and you want trigger eviction if
the available memory falls below `1Gi`, you can define the eviction threshold as
either `memory.available<10%` or `memory.available<1Gi`. You cannot use both.
-->
### 驱逐阈值

`kubelet`支持指定驱逐阈值，用于触发 `kubelet` 回收资源。

每个阈值形式如下：

`[eviction-signal][operator][quantity]`

* 合法的 `eviction-signal` 标志如上所示。
* `operator` 是所需的关系运算符，例如 `<`。
* `quantity` 是驱逐阈值值标志，例如 `1Gi`。合法的标志必须匹配 Kubernetes 使用的数量表示。
  驱逐阈值也可以使用 `%` 标记表示百分比。

举例说明，如果一个节点有 `10Gi` 内存，希望在可用内存下降到 `1Gi` 以下时引起驱逐操作，
则驱逐阈值可以使用下面任意一种方式指定（但不是两者同时）。

* `memory.available<10%`
* `memory.available<1Gi`

<!--
#### Soft Eviction Thresholds

A soft eviction threshold pairs an eviction threshold with a required
administrator-specified grace period. No action is taken by the `kubelet`
to reclaim resources associated with the eviction signal until that grace
period has been exceeded. If no grace period is provided, the `kubelet`
returns an error on startup.
-->
#### 软驱逐阈值

软驱逐阈值使用一对由驱逐阈值和管理员必须指定的宽限期组成的配置对。在超过宽限期前，`kubelet`不会采取任何动作回收和驱逐信号关联的资源。如果没有提供宽限期，`kubelet`启动时将报错。

<!--
In addition, if a soft eviction threshold has been met, an operator can
specify a maximum allowed Pod termination grace period to use when evicting
pods from the node. If specified, the `kubelet` uses the lesser value among
the `pod.Spec.TerminationGracePeriodSeconds` and the max allowed grace period.
If not specified, the `kubelet` kills Pods immediately with no graceful
termination.
-->
此外，如果达到了软驱逐阈值，操作员可以指定从节点驱逐 pod 时，在宽限期内允许结束的 pod 的最大数量。
如果指定了 `pod.Spec.TerminationGracePeriodSeconds` 值，
`kubelet` 将使用它和宽限期二者中较小的一个。
如果没有指定，`kubelet`将立即终止 pod，而不会优雅结束它们。

<!--
To configure soft eviction thresholds, the following flags are supported:

* `eviction-soft` describes a set of eviction thresholds (e.g. `memory.available<1.5Gi`) that if met over a
corresponding grace period would trigger a Pod eviction.
* `eviction-soft-grace-period` describes a set of eviction grace periods (e.g. `memory.available=1m30s`) that
correspond to how long a soft eviction threshold must hold before triggering a Pod eviction.
* `eviction-max-pod-grace-period` describes the maximum allowed grace period (in seconds) to use when terminating
pods in response to a soft eviction threshold being met.
-->
软驱逐阈值的配置支持下列标记：

* `eviction-soft` 描述了驱逐阈值的集合（例如 `memory.available<1.5Gi`），如果在宽限期之外满足条件将触发 pod 驱逐。
* `eviction-soft-grace-period` 描述了驱逐宽限期的集合（例如 `memory.available=1m30s`），对应于在驱逐 pod 前软驱逐阈值应该被控制的时长。
* `eviction-max-pod-grace-period` 描述了当满足软驱逐阈值并终止 pod 时允许的最大宽限期值（秒数）。

<!--
#### Hard Eviction Thresholds

A hard eviction threshold has no grace period, and if observed, the `kubelet`
will take immediate action to reclaim the associated starved resource. If a
hard eviction threshold is met, the `kubelet` kills the Pod immediately
with no graceful termination.

To configure hard eviction thresholds, the following flag is supported:

* `eviction-hard` describes a set of eviction thresholds (e.g. `memory.available<1Gi`) that if met
would trigger a Pod eviction.

The `kubelet` has the following default hard eviction threshold:

* `memory.available<100Mi`
* `nodefs.available<10%`
* `imagefs.available<15%`

On a Linux node, the default value also includes `nodefs.inodesFree<5%`.

-->
#### 硬驱逐阈值

硬驱逐阈值没有宽限期，一旦察觉，`kubelet` 将立即采取行动回收关联的短缺资源。
如果满足硬驱逐阈值，`kubelet` 将立即结束 Pod 而不是体面地终止它们。

硬驱逐阈值的配置支持下列标记：

* `eviction-hard` 描述了驱逐阈值的集合（例如 `memory.available<1Gi`），如果满足条件将触发 Pod 驱逐。

`kubelet` 有如下所示的默认硬驱逐阈值：

* `memory.available<100Mi`
* `nodefs.available<10%`
* `imagefs.available<15%`

在Linux节点上，默认值还包括 `nodefs.inodesFree<5％`。

<!--
### Eviction Monitoring Interval

The `kubelet` evaluates eviction thresholds per its configured housekeeping interval.

* `housekeeping-interval` is the interval between container housekeepings.
-->
### 驱逐监控时间间隔

`kubelet` 根据其配置的整理时间间隔计算驱逐阈值。

* `housekeeping-interval` 是容器管理时间间隔。

<!--
### Node Conditions

The `kubelet` maps one or more eviction signals to a corresponding node condition.

If a hard eviction threshold has been met, or a soft eviction threshold has been met
independent of its associated grace period, the `kubelet` reports a condition that
reflects the node is under pressure.
-->
### 节点状态

`kubelet` 会将一个或多个驱逐信号映射到对应的节点状态。

如果满足硬驱逐阈值，或者满足独立于其关联宽限期的软驱逐阈值时，`kubelet`将报告节点处于压力下的状态。

<!--
The following node conditions are defined that correspond to the specified eviction signal.

| Node Condition | Eviction Signal  | Description                                                      |
|-------------------------|-------------------------------|--------------------------------------------|
| `MemoryPressure` | `memory.available` | Available memory on the node has satisfied an eviction threshold |
| `DiskPressure` | `nodefs.available`, `nodefs.inodesFree`, `imagefs.available`, or `imagefs.inodesFree` | Available disk space and inodes on either the node's root filesystem or image filesystem has satisfied an eviction threshold |
| `PIDPressure`     | `pid.available`                                                                       | Available processes identifiers on the (Linux) node has fallen below an eviction threshold                                   |   

The `kubelet` continues to report node status updates at the frequency specified by
`--node-status-update-frequency` which defaults to `10s`.
-->
下列节点状态根据相应的驱逐信号定义。

| 节点状态 | 驱逐信号  | 描述                                                      |
|-------------------------|-------------------------------|--------------------------------------------|
| `MemoryPressure` | `memory.available` | 节点上可用内存量达到逐出阈值 |
| `DiskPressure` | `nodefs.available`, `nodefs.inodesFree`, `imagefs.available`, 或 `imagefs.inodesFree` | 节点或者节点的根文件系统或镜像文件系统上可用磁盘空间和 i 节点个数达到逐出阈值 |
| `PIDPressure`     | `pid.available`                                                                       | 在（Linux）节点上的可用进程标识符已降至驱逐阈值以下                                   |   

`kubelet` 将以 `--node-status-update-frequency` 指定的频率连续报告节点状态更新，其默认值为 `10s`。

<!--
### Oscillation of node conditions

If a node is oscillating above and below a soft eviction threshold, but not exceeding
its associated grace period, it would cause the corresponding node condition to
constantly oscillate between true and false, and could cause poor scheduling decisions
as a consequence.

To protect against this oscillation, the following flag is defined to control how
long the `kubelet` must wait before transitioning out of a pressure condition.

* `eviction-pressure-transition-period` is the duration for which the `kubelet` has
to wait before transitioning out of an eviction pressure condition.

The `kubelet` would ensure that it has not observed an eviction threshold being met
for the specified pressure condition for the period specified before toggling the
condition back to `false`.
-->
### 节点状态振荡

如果节点在软驱逐阈值的上下振荡，但没有超过关联的宽限期时，将引起对应节点的状态持续在
true 和 false 间跳变，并导致不好的调度结果。

为了防止这种振荡，可以定义下面的标志，用于控制 `kubelet` 从压力状态中退出之前必须等待的时间。

* `eviction-pressure-transition-period` 是 `kubelet` 从压力状态中退出之前必须等待的时长。

`kubelet` 将确保在设定的时间段内没有发现和指定压力条件相对应的驱逐阈值被满足时，才会将状态变回 `false`。

<!--
### Reclaiming node level resources

If an eviction threshold has been met and the grace period has passed,
the `kubelet` initiates the process of reclaiming the pressured resource
until it has observed the signal has gone below its defined threshold.

The `kubelet` attempts to reclaim node level resources prior to evicting end-user Pods. If
disk pressure is observed, the `kubelet` reclaims node level resources differently if the
machine has a dedicated `imagefs` configured for the container runtime.
-->
### 回收节点层级资源

如果满足驱逐阈值并超过了宽限期，`kubelet`将启动回收压力资源的过程，直到它发现低于设定阈值的信号为止。

`kubelet` 将尝试在驱逐终端用户 pod 前回收节点层级资源。
发现磁盘压力时，如果节点针对容器运行时配置有独占的 `imagefs`，`kubelet`回收节点层级资源的方式将会不同。

<!--
#### With `imagefs`

If `nodefs` filesystem has met eviction thresholds, `kubelet` frees up disk space by deleting the dead Pods and their containers.

If `imagefs` filesystem has met eviction thresholds, `kubelet` frees up disk space by deleting all unused images.

#### Without `imagefs`

If `nodefs` filesystem has met eviction thresholds, `kubelet` frees up disk space in the following order:

1. Delete dead Pods and their containers
2. Delete all unused images
-->
#### 使用 `imagefs`

如果 `nodefs` 文件系统满足驱逐阈值，`kubelet`通过驱逐 pod 及其容器来释放磁盘空间。

如果 `imagefs` 文件系统满足驱逐阈值，`kubelet`通过删除所有未使用的镜像来释放磁盘空间。

#### 未使用 `imagefs`

如果 `nodefs` 满足驱逐阈值，`kubelet`将以下面的顺序释放磁盘空间：

1. 删除停止运行的 pod/container
2. 删除全部没有使用的镜像

<!--
### Evicting end-user Pods

If the `kubelet` is unable to reclaim sufficient resource on the node, `kubelet` begins evicting Pods.

The `kubelet` ranks Pods for eviction first by whether or not their usage of the starved resource exceeds requests,
then by [Priority](/docs/concepts/configuration/pod-priority-preemption/), and then by the consumption of the starved compute resource relative to the Pods' scheduling requests.

-->
### 驱逐最终用户的 pod

如果 `kubelet` 在节点上无法回收足够的资源，`kubelet`将开始驱逐 pod。

`kubelet` 首先根据他们对短缺资源的使用是否超过请求来排除 pod 的驱逐行为，
然后通过[优先级](/zh/docs/concepts/configuration/pod-priority-preemption/)，
然后通过相对于 pod 的调度请求消耗急需的计算资源。

<!--
As a result, `kubelet` ranks and evicts Pods in the following order:

* `BestEffort` or `Burstable` Pods whose usage of a starved resource exceeds its request.
Such pods are ranked by Priority, and then usage above request.
* `Guaranteed` pods and `Burstable` pods whose usage is beneath requests are evicted last.
`Guaranteed` Pods are guaranteed only when requests and limits are specified for all
the containers and they are equal. Such pods are guaranteed to never be evicted because
of another Pod's resource consumption. If a system daemon (such as `kubelet`, `docker`,
and `journald`) is consuming more resources than were reserved via `system-reserved` or
`kube-reserved` allocations, and the node only has `Guaranteed` or `Burstable` Pods using
less than requests remaining, then the node must choose to evict such a Pod in order to
preserve node stability and to limit the impact of the unexpected consumption to other Pods.
In this case, it will choose to evict pods of Lowest Priority first.
-->
`kubelet` 按以下顺序对要驱逐的 pod 排名：

* `BestEffort` 或 `Burstable`，其对短缺资源的使用超过了其请求，此类 pod 按优先级排序，然后使用高于请求。
* `Guaranteed` pod 和 `Burstable` pod，其使用率低于请求，最后被驱逐。
  `Guaranteed` Pod 只有为所有的容器指定了要求和限制并且它们相等时才能得到保证。
  由于另一个 Pod 的资源消耗，这些 Pod 保证永远不会被驱逐。
  如果系统守护进程（例如 `kubelet`、`docker`、和 `journald`）消耗的资源多于通过
  `system-reserved` 或 `kube-reserved` 分配保留的资源，并且该节点只有 `Guaranteed` 或
  `Burstable` Pod 使用少于剩余的请求，然后节点必须选择驱逐这样的 Pod
  以保持节点的稳定性并限制意外消耗对其他 pod 的影响。
  在这种情况下，它将首先驱逐优先级最低的 pod。

<!--
If necessary, `kubelet` evicts Pods one at a time to reclaim disk when `DiskPressure`
is encountered. If the `kubelet` is responding to `inode` starvation, it reclaims
`inodes` by evicting Pods with the lowest quality of service first. If the `kubelet`
is responding to lack of available disk, it ranks Pods within a quality of service
that consumes the largest amount of disk and kill those first.
-->
必要时，`kubelet`会在遇到 `DiskPressure` 时逐个驱逐 Pod 来回收磁盘空间。
如果 `kubelet` 响应 `inode` 短缺，它会首先驱逐服务质量最低的 Pod 来回收 `inodes`。
如果 `kubelet` 响应缺少可用磁盘，它会将 Pod 排在服务质量范围内，该服务会消耗大量的磁盘并首先结束这些磁盘。

<!--
#### With `imagefs`

If `nodefs` is triggering evictions, `kubelet` sorts Pods based on the usage on `nodefs`
- local volumes + logs of all its containers.

If `imagefs` is triggering evictions, `kubelet` sorts Pods based on the writable layer usage of all its containers.

#### Without `imagefs`

If `nodefs` is triggering evictions, `kubelet` sorts Pods based on their total disk usage
- local volumes + logs & writable layer of all its containers.
-->
#### 使用 `imagefs`

如果是 `nodefs` 触发驱逐，`kubelet`将按 `nodefs` 用量 - 本地卷 + pod 的所有容器日志的总和对其排序。

如果是 `imagefs` 触发驱逐，`kubelet`将按 pod 所有可写层的用量对其进行排序。

#### 未使用 `imagefs`

如果是 `nodefs` 触发驱逐，`kubelet`会根据磁盘的总使用情况对 pod 进行排序 - 本地卷 + 所有容器的日志及其可写层。

<!--
### Minimum eviction reclaim

In certain scenarios, eviction of Pods could result in reclamation of small amount of resources. This can result in
`kubelet` hitting eviction thresholds in repeated successions. In addition to that, eviction of resources like `disk`,
 is time consuming.
-->
### 最小驱逐回收

在某些场景，驱逐 pod 会导致回收少量资源。这将导致 `kubelet` 反复碰到驱逐阈值。除此之外，对如 `disk` 这类资源的驱逐时比较耗时的。

<!--
To mitigate these issues, `kubelet` can have a per-resource `minimum-reclaim`. Whenever `kubelet` observes
resource pressure, `kubelet` attempts to reclaim at least `minimum-reclaim` amount of resource below
the configured eviction threshold.

For example, with the following configuration:
-->
为了减少这类问题，`kubelet`可以为每个资源配置一个 `minimum-reclaim`。
当 `kubelet` 发现资源压力时，`kubelet`将尝试至少回收驱逐阈值之下 `minimum-reclaim` 数量的资源。

例如使用下面的配置：

```
--eviction-hard=memory.available<500Mi,nodefs.available<1Gi,imagefs.available<100Gi
--eviction-minimum-reclaim="memory.available=0Mi,nodefs.available=500Mi,imagefs.available=2Gi"`
```

<!--
If an eviction threshold is triggered for `memory.available`, the `kubelet` works to ensure
that `memory.available` is at least `500Mi`. For `nodefs.available`, the `kubelet` works
to ensure that `nodefs.available` is at least `1.5Gi`, and for `imagefs.available` it
works to ensure that `imagefs.available` is at least `102Gi` before no longer reporting pressure
on their associated resources.

The default `eviction-minimum-reclaim` is `0` for all resources.
-->
如果 `memory.available` 驱逐阈值被触发，`kubelet` 将保证 `memory.available` 至少为 `500Mi`。
对于 `nodefs.available`，`kubelet` 将保证 `nodefs.available` 至少为 `1.5Gi`。
对于 `imagefs.available`，`kubelet` 将保证 `imagefs.available` 至少为 `102Gi`，
直到不再有相关资源报告压力为止。

所有资源的默认 `eviction-minimum-reclaim` 值为 `0`。

<!--
### Scheduler

The node reports a condition when a compute resource is under pressure. The
scheduler views that condition as a signal to dissuade placing additional
pods on the node.

| Node Condition    | Scheduler Behavior                               |
| ---------------- | ------------------------------------------------ |
| `MemoryPressure` | No new `BestEffort` Pods are scheduled to the node. |
| `DiskPressure` | No new Pods are scheduled to the node. |
-->
### 调度器

当资源处于压力之下时，节点将报告状态。调度器将那种状态视为一种信号，阻止更多 pod 调度到这个节点上。

| 节点状态    | 调度器行为                               |
| ---------------- | ------------------------------------------------ |
| `MemoryPressure` | 新的 `BestEffort` Pod 不会被调度到该节点 |
| `DiskPressure` | 没有新的 Pod 会被调度到该节点 |

<!--
## Node OOM Behavior

If the node experiences a system OOM (out of memory) event prior to the `kubelet` is able to reclaim memory,
the node depends on the [oom_killer](https://lwn.net/Articles/391222/) to respond.

The `kubelet` sets a `oom_score_adj` value for each container based on the quality of service for the Pod.
-->
## 节点 OOM 行为

如果节点在 `kubelet` 回收内存之前经历了系统 OOM（内存不足）事件，它将基于
[oom-killer](https://lwn.net/Articles/391222/) 做出响应。

`kubelet` 基于 pod 的 service 质量为每个容器设置一个 `oom_score_adj` 值。

<!--
| Quality of Service | oom_score_adj |
|----------------------------|-----------------------------------------------------------------------|
| `Guaranteed` | -998 |
| `BestEffort` | 1000 |
| `Burstable` | min(max(2, 1000 - (1000 * memoryRequestBytes) / machineMemoryCapacityBytes), 999) |
-->

| Service 质量 | oom_score_adj |
|----------------------------|-----------------------------------------------------------------------|
| `Guaranteed` | -998 |
| `BestEffort` | 1000 |
| `Burstable` | min(max(2, 1000 - (1000 * memoryRequestBytes) / machineMemoryCapacityBytes), 999) |

<!--
If the `kubelet` is unable to reclaim memory prior to a node experiencing system OOM, the `oom_killer` calculates
an `oom_score` based on the percentage of memory it's using on the node, and then add the `oom_score_adj` to get an
effective `oom_score` for the container, and then kills the container with the highest score.

The intended behavior should be that containers with the lowest quality of service that
are consuming the largest amount of memory relative to the scheduling request should be killed first in order
to reclaim memory.

Unlike Pod eviction, if a Pod container is OOM killed, it may be restarted by the `kubelet` based on its `RestartPolicy`.
-->
如果 `kubelet` 在节点经历系统 OOM 之前无法回收内存，`oom_killer` 将基于它在节点上
使用的内存百分比算出一个 `oom_score`，并加上 `oom_score_adj` 得到容器的有效
`oom_score`，然后结束得分最高的容器。

预期的行为应该是拥有最低服务质量并消耗和调度请求相关内存量最多的容器第一个被结束，以回收内存。

和 pod 驱逐不同，如果一个 Pod 的容器是被 OOM 结束的，基于其 `RestartPolicy`，
它可能会被 `kubelet` 重新启动。

<!--
## Best Practices

The following sections describe best practices for out of resource handling.

### Schedulable resources and eviction policies

Consider the following scenario:

* Node memory capacity: `10Gi`
* Operator wants to reserve 10% of memory capacity for system daemons (kernel, `kubelet`, etc.)
* Operator wants to evict Pods at 95% memory utilization to reduce incidence of system OOM.

To facilitate this scenario, the `kubelet` would be launched as follows:
-->
## 最佳实践

以下部分描述了资源外处理的最佳实践。

### 可调度资源和驱逐策略

考虑以下场景：

* 节点内存容量：`10Gi`
* 操作员希望为系统守护进程保留 10% 内存容量（内核、`kubelet`等）。
* 操作员希望在内存用量达到 95% 时驱逐 pod，以减少对系统的冲击并防止系统 OOM 的发生。

为了促成这个场景，`kubelet`将像下面这样启动：

```
--eviction-hard=memory.available<500Mi
--system-reserved=memory=1.5Gi
```

<!--
Implicit in this configuration is the understanding that "System reserved" should include the amount of memory
covered by the eviction threshold.

To reach that capacity, either some Pod is using more than its request, or the system is using more than `1.5Gi - 500Mi = 1Gi`.

This configuration ensures that the scheduler does not place Pods on a node that immediately induce memory pressure
and trigger eviction assuming those Pods use less than their configured request.
-->
这个配置的暗示是理解系统保留应该包含被驱逐阈值覆盖的内存数量。

要达到这个容量，要么某些 pod 使用了超过它们请求的资源，要么系统使用的内存超过 `1.5Gi - 500Mi = 1Gi`。

这个配置将保证在 pod 使用量都不超过它们配置的请求值时，如果可能立即引起内存压力并触发驱逐时，调度器不会将 pod 放到这个节点上。

<!--
### DaemonSet

It is never desired for `kubelet` to evict a `DaemonSet` Pod, since the Pod is
immediately recreated and rescheduled back to the same node.

At the moment, the `kubelet` has no ability to distinguish a Pod created
from `DaemonSet` versus any other object. If/when that information is
available, the `kubelet` could pro-actively filter those Pods from the
candidate set of Pods provided to the eviction strategy.

In general, it is strongly recommended that `DaemonSet` not
create `BestEffort` Pods to avoid being identified as a candidate Pod
for eviction. Instead `DaemonSet` should ideally launch `Guaranteed` Pods.
-->
### DaemonSet

我们永远都不希望 `kubelet` 驱逐一个从 `DaemonSet` 派生的 Pod，因为这个 Pod 将立即被重建并调度回相同的节点。

目前，`kubelet`没有办法区分一个 Pod 是由 `DaemonSet` 还是其他对象创建。
如果/当这个信息可用时，`kubelet` 可能会预先将这些 pod 从提供给驱逐策略的候选集合中过滤掉。

总之，强烈推荐 `DaemonSet` 不要创建 `BestEffort` 的 Pod，防止其被识别为驱逐的候选 Pod。
相反，理想情况下 `DaemonSet` 应该启动 `Guaranteed` 的 pod。

<!--
## Deprecation of existing feature flags to reclaim disk

`kubelet` has been freeing up disk space on demand to keep the node stable.

As disk based eviction matures, the following `kubelet` flags are marked for deprecation
in favor of the simpler configuration supported around eviction.
-->
## 现有的回收磁盘特性标签已被弃用

`kubelet` 已经按需求清空了磁盘空间以保证节点稳定性。

当磁盘驱逐成熟时，下面的 `kubelet` 标志将被标记为废弃的，以简化支持驱逐的配置。

<!--
| Existing Flag | New Flag |
| ------------- | -------- |
| `--image-gc-high-threshold` | `--eviction-hard` or `eviction-soft` |
| `--image-gc-low-threshold` | `--eviction-minimum-reclaim` |
| `--maximum-dead-containers` | deprecated |
| `--maximum-dead-containers-per-container` | deprecated |
| `--minimum-container-ttl-duration` | deprecated |
| `--low-diskspace-threshold-mb` | `--eviction-hard` or `eviction-soft` |
| `--outofdisk-transition-frequency` | `--eviction-pressure-transition-period` |
-->

| 现有标签 | 新标签 |
| ------------- | -------- |
| `--image-gc-high-threshold` | `--eviction-hard` or `eviction-soft` |
| `--image-gc-low-threshold` | `--eviction-minimum-reclaim` |
| `--maximum-dead-containers` | deprecated |
| `--maximum-dead-containers-per-container` | deprecated |
| `--minimum-container-ttl-duration` | deprecated |
| `--low-diskspace-threshold-mb` | `--eviction-hard` or `eviction-soft` |
| `--outofdisk-transition-frequency` | `--eviction-pressure-transition-period` |

<!--
## Known issues

The following sections describe known issues related to out of resource handling.
-->
## 已知问题

以下部分描述了与资源外处理有关的已知问题。

<!--
### kubelet may not observe memory pressure right away

The `kubelet` currently polls `cAdvisor` to collect memory usage stats at a regular interval. If memory usage
increases within that window rapidly, the `kubelet` may not observe `MemoryPressure` fast enough, and the `OOMKiller`
will still be invoked. We intend to integrate with the `memcg` notification API in a future release to reduce this
latency, and instead have the kernel tell us when a threshold has been crossed immediately.
-->
### kubelet 可能无法立即发现内存压力

`kubelet`当前通过以固定的时间间隔轮询 `cAdvisor` 来收集内存使用数据。如果内存使用在那个时间窗口内迅速增长，`kubelet`可能不能足够快的发现 `MemoryPressure`，`OOMKiller`将不会被调用。我们准备在将来的发行版本中通过集成 `memcg` 通知 API 来减小这种延迟。当超过阈值时，内核将立即告诉我们。

<!--
If you are not trying to achieve extreme utilization, but a sensible measure of overcommit, a viable workaround for
this issue is to set eviction thresholds at approximately 75% capacity. This increases the ability of this feature
to prevent system OOMs, and promote eviction of workloads so cluster state can rebalance.
-->
如果您想处理可察觉的超量使用而不要求极端精准，可以设置驱逐阈值为大约 75% 容量作为这个问题的变通手段。这将增强这个特性的能力，防止系统 OOM，并提升负载卸载能力，以再次平衡集群状态。

<!--
### kubelet may evict more Pods than needed

The Pod eviction may evict more Pods than needed due to stats collection timing gap. This can be mitigated by adding
the ability to get root container stats on an on-demand basis [(https://github.com/google/cadvisor/issues/1247)](https://github.com/google/cadvisor/issues/1247) in the future.
-->
### kubelet 可能会驱逐超过需求数量的 pod

由于状态采集的时间差，驱逐操作可能驱逐比所需的更多的 pod。将来可通过添加从根容器获取所需状态的能力
[https://github.com/google/cadvisor/issues/1247](https://github.com/google/cadvisor/issues/1247)
来减缓这种状况。
