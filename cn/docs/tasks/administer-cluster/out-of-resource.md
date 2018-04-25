---
approvers:
- derekwaynecarr
- vishh
- timstclair
cn-approvers:
- xiaosuiba
cn-reviewers:
- markthink
title: 配置资源不足处理方式
---

* TOC
{:toc}

<!--
The `kubelet` needs to preserve node stability when available compute resources
are low.
-->
当可用计算资源较少时，`kubelet` 需要保证节点稳定性。

<!--
This is especially important when dealing with incompressible resources such as
memory or disk.
-->
这在处理如内存和硬盘之类的不可压缩资源时尤为重要。

<!--
If either resource is exhausted, the node would become unstable.
-->
如果任意一种资源耗尽，节点将会变得不稳定。

<!--
## Eviction Policy
-->
## 移除策略

<!--
The `kubelet` can pro-actively monitor for and prevent against total starvation
of a compute resource.  In those cases, the `kubelet` can pro-actively fail one
or more pods in order to reclaim the starved resource.  When the `kubelet` fails
a pod, it terminates all containers in the pod, and the `PodPhase` is
transitioned to `Failed`.
-->
`kubelet` 能够主动监测和防止计算资源的全面短缺。在那种情况下，`kubelet` 可以主动的结束一个或多个 pod 以回收短缺的资源。当 `kubelet` 结束一个 pod 时，它将终止 pod 中的所有容器，而 pod 的 `PodPhase` 将变为 `Failed`。

<!--
### Eviction Signals
-->
### 移除信号

<!--
The `kubelet` can support the ability to trigger eviction decisions on the
signals described in the table below.  The value of each signal is described in
the description column based on the `kubelet` summary API.
-->
`kubelet` 支持按照以下表格中描述的信号触发移除决定。每个信号的值在 description 列描述，基于 `kubelet` 摘要 API。

| Eviction Signal      | Description                              |
| -------------------- | ---------------------------------------- |
| `memory.available`   | `memory.available` := `node.status.capacity[memory]` - `node.stats.memory.workingSet` |
| `nodefs.available`   | `nodefs.available` := `node.stats.fs.available` |
| `nodefs.inodesFree`  | `nodefs.inodesFree` := `node.stats.fs.inodesFree` |
| `imagefs.available`  | `imagefs.available` := `node.stats.runtime.imagefs.available` |
| `imagefs.inodesFree` | `imagefs.inodesFree` := `node.stats.runtime.imagefs.inodesFree` |

<!--
Each of the above signals supports either a literal or percentage based value.
The percentage based value is calculated relative to the total capacity
associated with each signal.
-->
上面的每个信号都支持字面值或百分比的值。基于百分比的值的计算与每个信号对应的总容量相关。

<!--
The value for `memory.available` is derived from the cgroupfs instead of tools
like `free -m`.  This is important because `free -m` does not work in a
container, and if users use the [node
allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) feature, out of resource decisions
are made local to the end user pod part of the cgroup hierarchy as well as the
root node.  This
[script](/docs/concepts/cluster-administration/out-of-resource/memory-available.sh)
reproduces the same set of steps that the `kubelet` performs to calculate
`memory.available`. The `kubelet` excludes inactive_file (i.e. # of bytes of
file-backed memory on inactive LRU list) from its calculation as it assumes that
memory is reclaimable under pressure.
-->
`memory.available` 的值从 cgroupfs 获取，而不是通过类似 `free -m` 的工具。这很重要，因为 `free -m` 不能在容器中工作，并且如果用户使用了  [可分配节点](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) 特性，资源不足的判定将同时在本地 cgroup 层次结构的终端用户 pod 部分和根节点做出。这个 [脚本](/docs/concepts/cluster-administration/out-of-resource/memory-available.sh) 复现了与 `kubelet` 计算 `memory.available` 相同的步骤。`kubelet` 将  inactive_file（意即活动 LRU 列表上基于文件后端的内存字节数）从计算中排除，因为它假设内存在出现压力时将被回收。

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
cAdvisor.  `kubelet` does not care about any other filesystems. Any other types
of configurations are not currently supported by the kubelet. For example, it is
*not OK* to store volumes and logs in a dedicated `filesystem`.
-->
`imagefs` 可选。`kubelet` 使用 cAdvisor 自动发现这些文件系统。`kubelet` 不关心其它文件系统。当前不支持配置任何其它类型。例如，在专用 `文件系统` 中存储卷和日志是*不可以的*。

<!--
In future releases, the `kubelet` will deprecate the existing [garbage
collection](/docs/concepts/cluster-administration/kubelet-garbage-collection/) support in favor of eviction in
response to disk pressure.
-->
在将来的发布中，`kubelet` 将废除当前存在的  [垃圾回收](/docs/concepts/cluster-administration/kubelet-garbage-collection/) 机制，这种机制目前支持将移除操作作为对磁盘压力的响应。

<!--
### Eviction Thresholds
-->
### 移除门限

<!--
The `kubelet` supports the ability to specify eviction thresholds that trigger the `kubelet` to reclaim resources.
-->
`kubelet` 支持指定移除门限，用于触发 `kubelet` 回收资源。

<!--
Each threshold is of the following form:
-->
每个门限的形式如下：

`<eviction-signal><operator><quantity>`

<!--
* valid `eviction-signal` tokens as defined above.
* valid `operator` tokens are `<`
* valid `quantity` tokens must match the quantity representation used by Kubernetes
* an eviction threshold can be expressed as a percentage if ends with `%` token.
  -->
* 合法的 `eviction-signal` 标志如上所示。
* 合法的 `operator` 标志为 `<`，
* 合法的 `quantity` 标志必须匹配 Kubernetes 使用的数量表示。
* 以 `%` 标志结尾的移除门限表示百分比。

<!--
For example, if a node has `10Gi` of memory, and the desire is to induce eviction
if available memory falls below `1Gi`, an eviction threshold can be specified as either
of the following (but not both).
-->
举例说明，如果一个节点有 `10Gi` 内存，希望在可用内存下降到 `1Gi` 以下时引起移除操作，则移除门限可以使用下面任意一种方式指定（但不是两者同时）。

* `memory.available<10%`
* `memory.available<1Gi`

<!--
#### Soft Eviction Thresholds
-->
#### 软移除门限

<!--
A soft eviction threshold pairs an eviction threshold with a required
administrator specified grace period.  No action is taken by the `kubelet`
to reclaim resources associated with the eviction signal until that grace
period has been exceeded.  If no grace period is provided, the `kubelet` will
error on startup.
-->
软移除门限使用一对由移除门限和管理员必须指定的宽限期组成的配置对。在超过宽限期前，`kubelet` 不会采取任何动作回收和移除信号关联的资源。如果没有提供宽限期，`kubelet` 启动时将报错。

<!--
In addition, if a soft eviction threshold has been met, an operator can
specify a maximum allowed pod termination grace period to use when evicting
pods from the node.  If specified, the `kubelet` will use the lesser value among
the `pod.Spec.TerminationGracePeriodSeconds` and the max allowed grace period.
If not specified, the `kubelet` will kill pods immediately with no graceful
termination.
-->
此外，如果达到了软移除门限，操作员可以指定从节点移除 pod 时，在宽限期内允许结束的 pod 的最大数量。如果指定了 `pod.Spec.TerminationGracePeriodSeconds` 值，`kubelet` 将使用它和宽限期二者中较小的一个。如果没有指定，`kubelet` 将立即终止 pod，而不会优雅结束它们。

<!--
To configure soft eviction thresholds, the following flags are supported:

* `eviction-soft` describes a set of eviction thresholds (e.g. `memory.available<1.5Gi`) that if met over a
  corresponding grace period would trigger a pod eviction.
* `eviction-soft-grace-period` describes a set of eviction grace periods (e.g. `memory.available=1m30s`) that
  correspond to how long a soft eviction threshold must hold before triggering a pod eviction.
* `eviction-max-pod-grace-period` describes the maximum allowed grace period (in seconds) to use when terminating
  pods in response to a soft eviction threshold being met.
  -->
  软移除门限的配置支持下列标记：

* `eviction-soft` 描述了移除门限的集合（例如 `memory.available<1.5Gi`），如果在宽限期之外满足条件将触发 pod 移除。
* `eviction-soft-grace-period` 描述了移除宽限期的集合（例如 `memory.available=1m30s`），对应于在移除 pod 前软移除门限应该被控制的时长。
* `eviction-max-pod-grace-period` 描述了当满足软移除门限并终止 pod 时允许的最大宽限期值（秒数）。

<!--
#### Hard Eviction Thresholds
-->
#### 硬移除门限

<!--
A hard eviction threshold has no grace period, and if observed, the `kubelet`
will take immediate action to reclaim the associated starved resource.  If a
hard eviction threshold is met, the `kubelet` will kill the pod immediately
with no graceful termination.
-->
硬移除门限没有宽限期，一旦察觉，`kubelet` 将立即采取行动回收关联的短缺资源。如果满足硬移除门限，`kubelet` 将立即结束 pod 而不是优雅终止。

<!--
To configure hard eviction thresholds, the following flag is supported:

* `eviction-hard` describes a set of eviction thresholds (e.g. `memory.available<1Gi`) that if met
  would trigger a pod eviction.
-->
硬移除门限的配置支持下列标记：

* `eviction-hard` 描述了移除门限的集合（例如 `memory.available<1Gi`），如果满足条件将触发 pod 移除。

<!--
The `kubelet` has the following default hard eviction threshold:
-->
`kubelet` 有如下所示的默认硬移除门限：

* `--eviction-hard=memory.available<100Mi`

<!--
### Eviction Monitoring Interval
-->
### 移除监控时间间隔

<!--
The `kubelet` evaluates eviction thresholds per its configured housekeeping interval.

* `housekeeping-interval` is the interval between container housekeepings.
-->
`kubelet` 根据其配置的整理时间间隔计算移除门限。

* `housekeeping-interval` 是容器管理时间间隔。

<!--
### Node Conditions
-->
### 节点状态

<!--
The `kubelet` will map one or more eviction signals to a corresponding node condition.
-->
`kubelet` 会将一个或多个移除信号映射到对应的节点状态。

<!--
If a hard eviction threshold has been met, or a soft eviction threshold has been met
independent of its associated grace period, the `kubelet` will report a condition that
reflects the node is under pressure.
-->
如果满足硬移除门限，或者满足独立于其关联宽限期的软移除门限时，`kubelet` 将报告节点处于压力下的状态。

<!--
The following node conditions are defined that correspond to the specified eviction signal.
-->
下列节点状态根据相应的移除信号定义。

| Node Condition   | Eviction Signal                          | Description                              |
| ---------------- | ---------------------------------------- | ---------------------------------------- |
| `MemoryPressure` | `memory.available`                       | Available memory on the node has satisfied an eviction threshold |
| `DiskPressure`   | `nodefs.available`, `nodefs.inodesFree`, `imagefs.available`, or `imagefs.inodesFree` | Available disk space and inodes on either the node's root filesytem or image filesystem has satisfied an eviction threshold |

<!--
The `kubelet` will continue to report node status updates at the frequency specified by
`--node-status-update-frequency` which defaults to `10s`.
-->
`kubelet` 将以 `--node-status-update-frequency` 指定的频率连续报告节点状态更新，其默认值为 `10s`。

<!--
### Oscillation of node conditions
-->
### 节点状态振荡

<!--
If a node is oscillating above and below a soft eviction threshold, but not exceeding
its associated grace period, it would cause the corresponding node condition to
constantly oscillate between true and false, and could cause poor scheduling decisions
as a consequence.
-->
如果节点在软移除门限的上下振荡，但没有超过关联的宽限期时，将引起对应节点的状态持续在 true 和 false 间跳变，并导致不好的调度结果。

<!--
To protect against this oscillation, the following flag is defined to control how
long the `kubelet` must wait before transitioning out of a pressure condition.
-->
为了防止这种振荡，可以定义下面的标志，用于控制 `kubelet` 从压力状态中退出之前必须等待的时间。

<!--
* `eviction-pressure-transition-period` is the duration for which the `kubelet` has
  to wait before transitioning out of an eviction pressure condition.
  -->
* `eviction-pressure-transition-period` 是 `kubelet` 从压力状态中退出之前必须等待的时长。

<!--
The `kubelet` would ensure that it has not observed an eviction threshold being met
for the specified pressure condition for the period specified before toggling the
condition back to `false`.
-->
`kubelet` 将确保在设定的时间段内没有发现和指定压力条件相对应的移除门限被满足时，才会将状态变回 `false`。

<!--
### Reclaiming node level resources
-->
### 回收节点层级资源

<!--
If an eviction threshold has been met and the grace period has passed,
the `kubelet` will initiate the process of reclaiming the pressured resource
until it has observed the signal has gone below its defined threshold.
-->
如果满足移除门限并超过了宽限期，`kubelet` 将启动回收压力资源的过程，直到它发现低于设定门限的信号为止。

<!--
The `kubelet` attempts to reclaim node level resources prior to evicting end-user pods. If
disk pressure is observed, the `kubelet` reclaims node level resources differently if the
machine has a dedicated `imagefs` configured for the container runtime.
-->
`kubelet` 将尝试在移除终端用户 pod 前回收节点层级资源。发现磁盘压力时，如果节点针对容器运行时配置有独占的 `imagefs`，`kubelet` 回收节点层级资源的方式将会不同。

<!--
#### With Imagefs
-->
#### 使用 Imagefs

<!--
If `nodefs` filesystem has met eviction thresholds, `kubelet` will free up disk space in the following order:
-->
如果 `nodefs` 满足移除门限，`kubelet` 将以下面的顺序释放磁盘空间：

<!--
1. Delete dead pods/containers
  -->
1. 删除停止运行的 pod/container

<!--
If `imagefs` filesystem has met eviction thresholds, `kubelet` will free up disk space in the following order:
-->
如果 `imagefs` 满足移除门限，`kubelet` 将以下面的顺序释放磁盘空间：

<!--
1. Delete all unused images
  -->
2. 删除全部没有使用的镜像

<!--
#### Without Imagefs
-->
#### 未使用 Imagefs

<!--
If `nodefs` filesystem has met eviction thresholds, `kubelet` will free up disk space in the following order:

1. Delete dead pods/containers
2. Delete all unused images
-->
如果 `nodefs` 满足移除门限，`kubelet` 将以下面的顺序释放磁盘空间：

1. 删除停止运行的 pod/container
2. 删除全部没有使用的镜像

<!--
### Evicting end-user pods
-->
### 移除最终用户的 pod

<!--
If the `kubelet` is unable to reclaim sufficient resource on the node,
it will begin evicting pods.
-->
如果 `kubelet` 在节点上无法回收足够的资源，它将开始移除 pod。

<!--
The `kubelet` ranks pods for eviction as follows:

* by their quality of service.
* by the consumption of the starved compute resource relative to the pods scheduling request.
  -->
`kubelet` 按如下项目对要移除的 pod 排名：

* 按其 service 质量。
* 按和 pod 调度请求关联的短缺计算资源消耗情况。

<!--
As a result, pod eviction occurs in the following order:

* `BestEffort` pods that consume the most of the starved resource are failed
  first.
* `Burstable` pods that consume the greatest amount of the starved resource
  relative to their request for that resource are killed first.  If no pod
  has exceeded its request, the strategy targets the largest consumer of the
  starved resource.
* `Guaranteed` pods that consume the greatest amount of the starved resource
  relative to their request are killed first.  If no pod has exceeded its request,
  the strategy targets the largest consumer of the starved resource.
  -->
因此，pod 的移除按以下顺序发生：

* 消耗最多短缺资源的 `BestEffort` pod 首先被终止。
* 消耗最多与其请求资源关联的短缺资源的 `Burstable` pod 将被优先终止。如果没有 pod 超出它们的请求量，移除策略将以短缺资源最大的消耗者作为目标。

<!--
A `Guaranteed` pod is guaranteed to never be evicted because of another pod's
resource consumption.  If a system daemon (i.e. `kubelet`, `docker`, `journald`, etc.)
is consuming more resources than were reserved via `system-reserved` or `kube-reserved` allocations,
and the node only has `Guaranteed` pod(s) remaining, then the node must choose to evict a
`Guaranteed` pod in order to preserve node stability, and to limit the impact
of the unexpected consumption to other `Guaranteed` pod(s).
-->
`Guaranteed` 的 pod 保证绝对不会因为其它 pod 的资源消耗而被移除。如果系统守护进程（也就是 `kubelet`、`docker`、`journald` 等）使用的资源比 `system-reserved` 或者 `kube-reserved` 分配的更多，且节点上只有 `Guaranteed` 类型 pod 运行时，节点必须选择结束 `Guaranteed` pod 以保证稳定性并限制未知消耗对其它 `Guaranteed` pod 的冲击。

<!--
Local disk is a `BestEffort` resource.  If necessary, `kubelet` will evict pods one at a time to reclaim
disk when `DiskPressure` is encountered.  The `kubelet` will rank pods by quality of service.  If the `kubelet`
is responding to `inode` starvation, it will reclaim `inodes` by evicting pods with the lowest quality of service
first.  If the `kubelet` is responding to lack of available disk, it will rank pods within a quality of service
that consumes the largest amount of disk and kill those first.
-->
本地磁盘是一种 `BestEffort` 资源。如果有需要，在遭遇  `DiskPressure` 时，`kubelet` 将每次一个的移除 pod。`kubelet` 将按照 service 质量对 pod 排名。当 `kubelet` 响应 `inode` 短缺时，它将首先移除具有最低 service 质量的 pod 来回收 `inodes`。当 `kubelet` 响应可用磁盘短缺时，它将对某种服务质量内消耗最多磁盘的 pod 排名并结束它们。

<!--
#### With Imagefs
-->
#### 使用 Imagefs

<!--
If `nodefs` is triggering evictions, `kubelet` will sort pods based on the usage on `nodefs`
- local volumes + logs of all its containers.
-->
如果 `nodefs` 触发移除，`kubelet` 将按 `nodefs` 用量 - 本地卷 + pod 的所有容器日志的总和对其排序。

<!--
If `imagefs` is triggering evictions, `kubelet` will sort pods based on the writable layer usage of all its containers.
-->
如果是 `imagefs` 触发移除，`kubelet` 将按 pod 所有可写层的用量对其进行排序。

<!--
#### Without Imagefs
-->
#### 未使用 Imagefs

<!--
If `nodefs` is triggering evictions, `kubelet` will sort pods based on their total disk usage
- local volumes + logs & writable layer of all its containers.
-->
如果 `nodefs` 触发移除，`kubelet` 将按 `nodefs` 用量 - 本地卷 + pod 的所有容器日志的总和对其排序。

<!--
### Minimum eviction reclaim
-->
### 最小移除回收

<!--
In certain scenarios, eviction of pods could result in reclamation of small amount of resources. This can result in
`kubelet` hitting eviction thresholds in repeated successions. In addition to that, eviction of resources like `disk`,
 is time consuming.
-->
在某些场景，移除 pod 会导致回收少量资源。这将导致 `kubelet` 反复碰到移除门限。除此之外，对如 `disk` 这类资源的移除时比较耗时的。

<!--
To mitigate these issues, `kubelet` can have a per-resource `minimum-reclaim`. Whenever `kubelet` observes
resource pressure, `kubelet` will attempt to reclaim at least `minimum-reclaim` amount of resource below
the configured eviction threshold.
-->
为了减少这类问题，`kubelet` 可以为每个资源配置一个 `minimum-reclaim`。当 `kubelet` 发现资源压力时，`kubelet` 将尝试至少回收移除门限之下 `minimum-reclaim` 数量的资源。

<!--
For example, with the following configuration:
-->
例如使用下面的配置：

```
--eviction-hard=memory.available<500Mi,nodefs.available<1Gi,imagefs.available<100Gi
--eviction-minimum-reclaim="memory.available=0Mi,nodefs.available=500Mi,imagefs.available=2Gi"`
```
<!--
If an eviction threshold is triggered for `memory.available`, the `kubelet` will work to ensure
that `memory.available` is at least `500Mi`.  For `nodefs.available`, the `kubelet` will work
to ensure that `nodefs.available` is at least `1.5Gi`, and for `imagefs.available` it will
work to ensure that `imagefs.available` is at least `102Gi` before no longer reporting pressure
on their associated resources.
-->
如果 `memory.available` 移除门限被触发，`kubelet` 将保证 `memory.available` 至少为 `500Mi`。对于  `nodefs.available`，`kubelet` 将保证 `nodefs.available` 至少为 `1.5Gi`。对于 `imagefs.available`，`kubelet` 将保证 `imagefs.available` 至少为 `102Gi`，直到不再有相关资源报告压力为止。

<!--
The default `eviction-minimum-reclaim` is `0` for all resources.
-->
所有资源的默认 `eviction-minimum-reclaim` 值为 `0`。

<!--
### Scheduler
-->
### 调度器

<!--
The node will report a condition when a compute resource is under pressure.  The
scheduler views that condition as a signal to dissuade placing additional
pods on the node.
-->
当资源处于压力之下时，节点将报告状态。调度器将那种状态视为一种信号，阻止更多 pod 调度到这个节点上。

| Node Condition   | Scheduler Behavior                       |
| ---------------- | ---------------------------------------- |
| `MemoryPressure` | No new `BestEffort` pods are scheduled to the node. |
| `DiskPressure`   | No new pods are scheduled to the node.   |

<!--
## Node OOM Behavior
-->
## 节点 OOM 行为

<!--
If the node experiences a system OOM (out of memory) event prior to the `kubelet` is able to reclaim memory,
the node depends on the [oom_killer](https://lwn.net/Articles/391222/) to respond.
-->
如果节点在 `kubelet` 回收内存之前经历了系统 OOM(out of memory，内存不足) 事件，它将基于  [oom_killer](https://lwn.net/Articles/391222/) 做出响应。

<!--
The `kubelet` sets a `oom_score_adj` value for each container based on the quality of service for the pod.
-->
`kubelet` 基于 pod 的 service 质量为每个容器设置一个 `oom_score_adj` 值。

| Quality of Service | oom_score_adj                            |
| ------------------ | ---------------------------------------- |
| `Guaranteed`       | -998                                     |
| `BestEffort`       | 1000                                     |
| `Burstable`        | min(max(2, 1000 - (1000 * memoryRequestBytes) / machineMemoryCapacityBytes), 999) |

<!--
If the `kubelet` is unable to reclaim memory prior to a node experiencing system OOM, the `oom_killer` will calculate
an `oom_score` based on the percentage of memory it's using on the node, and then add the `oom_score_adj` to get an
effective `oom_score` for the container, and then kills the container with the highest score.
-->
如果 `kubelet` 在节点经历系统 OOM 之前无法回收内存，`oom_killer` 将基于它在节点上使用的内存百分比算出一个 `oom_score`，并加上 `oom_score_adj` 得到容器的有效 `oom_score`，然后结束得分最高的容器。

<!--
The intended behavior should be that containers with the lowest quality of service that
are consuming the largest amount of memory relative to the scheduling request should be killed first in order
to reclaim memory.
-->
预期的行为应该是拥有最低 service 质量并消耗和调度请求相关内存量最多的容器第一个被结束，以回收内存。

<!--
Unlike pod eviction, if a pod container is OOM killed, it may be restarted by the `kubelet` based on its `RestartPolicy`.
-->
和 pod 移除不同，如果一个 pod 的容器是被 OOM 结束的，基于其 `RestartPolicy`，它可能会被 `kubelet` 重新启动。

<!--
## Best Practices
-->
## 最佳实践

<!--
### Schedulable resources and eviction policies
-->
### 可调度资源和移除策略

<!--
Let's imagine the following scenario:

* Node memory capacity: `10Gi`
* Operator wants to reserve 10% of memory capacity for system daemons (kernel, `kubelet`, etc.)
* Operator wants to evict pods at 95% memory utilization to reduce thrashing and incidence of system OOM.
-->
想象一下下面的场景：

* 节点内存容量：`10Gi`
* 操作员希望为系统守护进程保留 10% 内存容量（内核、`kubelet` 等）。
* 操作员希望在内存用量达到 95% 时移除 pod，以减少对系统的冲击并防止系统 OOM 的发生。

<!--
To facilitate this scenario, the `kubelet` would be launched as follows:
-->
为了促成这个场景，`kubelet` 将像下面这样启动：

```
--eviction-hard=memory.available<500Mi
--system-reserved=memory=1.5Gi
```

<!--
Implicit in this configuration is the understanding that "System reserved" should include the amount of memory
covered by the eviction threshold.
-->
这个配置的暗示是理解“系统保留”应该包含被移除门限覆盖的内存数量。

<!--
To reach that capacity, either some pod is using more than its request, or the system is using more than `500Mi`.
-->
要达到这个容量，要么某些 pod 使用了超过它们请求的资源，要么系统使用的内存超过 `500Mi`。

<!--
This configuration will ensure that the scheduler does not place pods on a node that immediately induce memory pressure
and trigger eviction assuming those pods use less than their configured request.
-->
这个配置将保证在 pod 使用量都不超过它们配置的请求值时，如果可能立即引起内存压力并触发移除时，调度器不会将 pod 放到这个节点上。

<!--
### DaemonSet
-->
### DaemonSet

<!--
It is never desired for a `kubelet` to evict a pod that was derived from
a `DaemonSet` since the pod will immediately be recreated and rescheduled
back to the same node.
-->
我们永远都不希望 `kubelet` 移除一个从 `DaemonSet` 派生的 pod，因为这个 pod 将立即被重建并调度回相同的节点。

<!--
At the moment, the `kubelet` has no ability to distinguish a pod created
from `DaemonSet` versus any other object.  If/when that information is
available, the `kubelet` could pro-actively filter those pods from the
candidate set of pods provided to the eviction strategy.
-->
目前，`kubelet` 没有办法区分一个 pod 是由 `DaemonSet` 还是其他对象创建。如果/当这个信息可用时，`kubelet` 可能会预先将这些 pod 从提供给移除策略的候选集合中过滤掉。

<!--
In general, it is strongly recommended that `DaemonSet` not
create `BestEffort` pods to avoid being identified as a candidate pod
for eviction. Instead `DaemonSet` should ideally launch `Guaranteed` pods.
-->
总之，强烈推荐 `DaemonSet` 不要创建 `BestEffort` 的 pod，防止其被识别为移除的候选 pod。相反，理想情况下 `DaemonSet` 应该启动 `Guaranteed` 的 pod。

<!--
## Deprecation of existing feature flags to reclaim disk
-->
## 弃用现有特性标签以回收磁盘

<!--
`kubelet` has been freeing up disk space on demand to keep the node stable.
-->
`kubelet` 已经按需求清空了磁盘空间以保证节点稳定性。

<!--
As disk based eviction matures, the following `kubelet` flags will be marked for deprecation
in favor of the simpler configuration supported around eviction.
-->
当磁盘移除成熟时，下面的 `kubelet` 标志将被标记为废弃的，以简化支持移除的配置。

| Existing Flag                            | New Flag                                |
| ---------------------------------------- | --------------------------------------- |
| `--image-gc-high-threshold`              | `--eviction-hard` or `eviction-soft`    |
| `--image-gc-low-threshold`               | `--eviction-minimum-reclaim`            |
| `--maximum-dead-containers`              | deprecated                              |
| `--maximum-dead-containers-per-container` | deprecated                              |
| `--minimum-container-ttl-duration`       | deprecated                              |
| `--low-diskspace-threshold-mb`           | `--eviction-hard` or `eviction-soft`    |
| `--outofdisk-transition-frequency`       | `--eviction-pressure-transition-period` |

<!--
## Known issues
-->
## 已知问题

<!--
### kubelet may not observe memory pressure right away
-->
### kubelet 可能无法立即发现内存压力

<!--
The `kubelet` currently polls `cAdvisor` to collect memory usage stats at a regular interval.  If memory usage
increases within that window rapidly, the `kubelet` may not observe `MemoryPressure` fast enough, and the `OOMKiller`
will still be invoked.  We intend to integrate with the `memcg` notification API in a future release to reduce this
latency, and instead have the kernel tell us when a threshold has been crossed immediately.
-->
`kubelet` 当前通过以固定的时间间隔轮询  `cAdvisor` 来收集内存使用数据。如果内存使用在那个时间窗口内迅速增长，`kubelet` 可能不能足够快的发现  `MemoryPressure`， `OOMKiller` 将不会被调用。我们准备在将来的发行版本中通过集成 `memcg` 通知 API 来减小这种延迟。当超过门限时，内核将立即告诉我们。

<!--
If you are not trying to achieve extreme utilization, but a sensible measure of overcommit, a viable workaround for
this issue is to set eviction thresholds at approximately 75% capacity.  This increases the ability of this feature
to prevent system OOMs, and promote eviction of workloads so cluster state can rebalance.
-->
如果您想处理可察觉的超量使用而不要求极端精准，可以设置移除门限为大约 75% 容量作为这个问题的变通手段。这将增强这个特性的能力，防止系统 OOM，并提升负载卸载能力，以再次平衡集群状态。

<!--
### kubelet may evict more pods than needed
-->
### kubelet 可能会移除超过需求数量的 pod

<!--
The pod eviction may evict more pods than needed due to stats collection timing gap. This can be mitigated by adding
the ability to get root container stats on an on-demand basis [(https://github.com/google/cadvisor/issues/1247)](https://github.com/google/cadvisor/issues/1247) in the future.
-->
由于状态采集的时间差，移除操作可能移除比所需的更多的 pod。将来可通过添加从根容器获取所需状态的能力 [(https://github.com/google/cadvisor/issues/1247)](https://github.com/google/cadvisor/issues/1247) 来减缓这种状况。

<!--
### How kubelet ranks pods for eviction in response to inode exhaustion
-->
### Kubelet 响应 inode 耗尽时如何对待移除 pod 排名

<!--
At this time, it is not possible to know how many inodes were consumed by a particular container.  If the `kubelet` observes
inode exhaustion, it will evict pods by ranking them by quality of service.  The following issue has been opened in cadvisor
to track per container inode consumption [(https://github.com/google/cadvisor/issues/1422)](https://github.com/google/cadvisor/issues/1422) which would allow us to rank pods
by inode consumption.  For example, this would let us identify a container that created large numbers of 0 byte files, and evict
that pod over others.
-->
目前，要知道某个特定的容器消耗了多少 inode 是一件不可能的事情。如果 `kubelet` 发现 inode 耗尽，它将按照 pod 的 service 质量排名删除它们。下面这个在 cadvisor 项目中开放的问题是关于如何追踪每个容器的 inode 使用量 [(https://github.com/google/cadvisor/issues/1422)](https://github.com/google/cadvisor/issues/1422)，以允许我们按 pod 的 inode 使用量对其排名。例如，这可以让我们识别一个创建了大量 0 比特文件的容器并删除它。