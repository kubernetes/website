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


当可用计算资源较少时，`kubelet` 需要保证节点稳定性。


这在处理如内存和硬盘之类的不可压缩资源时尤为重要。


如果任意一种资源耗尽，节点将会变得不稳定。


## 移除策略


`kubelet` 能够主动监测和防止计算资源的全面短缺。在那种情况下，`kubelet` 可以主动的结束一个或多个 pod 以回收短缺的资源。当 `kubelet` 结束一个 pod 时，它将终止 pod 中的所有容器，而 pod 的 `PodPhase` 将变为 `Failed`。


### 移除信号


`kubelet` 支持按照以下表格中描述的信号触发移除决定。每个信号的值在 description 列描述，基于 `kubelet` 摘要 API。

| Eviction Signal      | Description                              |
| -------------------- | ---------------------------------------- |
| `memory.available`   | `memory.available` := `node.status.capacity[memory]` - `node.stats.memory.workingSet` |
| `nodefs.available`   | `nodefs.available` := `node.stats.fs.available` |
| `nodefs.inodesFree`  | `nodefs.inodesFree` := `node.stats.fs.inodesFree` |
| `imagefs.available`  | `imagefs.available` := `node.stats.runtime.imagefs.available` |
| `imagefs.inodesFree` | `imagefs.inodesFree` := `node.stats.runtime.imagefs.inodesFree` |


上面的每个信号都支持字面值或百分比的值。基于百分比的值的计算与每个信号对应的总容量相关。


`memory.available` 的值从 cgroupfs 获取，而不是通过类似 `free -m` 的工具。这很重要，因为 `free -m` 不能在容器中工作，并且如果用户使用了  [可分配节点](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) 特性，资源不足的判定将同时在本地 cgroup 层次结构的终端用户 pod 部分和根节点做出。这个 [脚本](/docs/concepts/cluster-administration/out-of-resource/memory-available.sh) 复现了与 `kubelet` 计算 `memory.available` 相同的步骤。`kubelet` 将  inactive_file（意即活动 LRU 列表上基于文件后端的内存字节数）从计算中排除，因为它假设内存在出现压力时将被回收。


   `kubelet` 只支持两种文件系统分区。

1. `nodefs` 文件系统，kubelet 将其用于卷和守护程序日志等。
2. `imagefs` 文件系统，容器运行时用于保存镜像和容器可写层。


`imagefs` 可选。`kubelet` 使用 cAdvisor 自动发现这些文件系统。`kubelet` 不关心其它文件系统。当前不支持配置任何其它类型。例如，在专用 `文件系统` 中存储卷和日志是*不可以的*。


在将来的发布中，`kubelet` 将废除当前存在的  [垃圾回收](/docs/concepts/cluster-administration/kubelet-garbage-collection/) 机制，这种机制目前支持将移除操作作为对磁盘压力的响应。


### 移除门限


`kubelet` 支持指定移除门限，用于触发 `kubelet` 回收资源。


每个门限的形式如下：

`<eviction-signal><operator><quantity>`


* 合法的 `eviction-signal` 标志如上所示。
* 合法的 `operator` 标志为 `<`，
* 合法的 `quantity` 标志必须匹配 Kubernetes 使用的数量表示。
* 以 `%` 标志结尾的移除门限表示百分比。


举例说明，如果一个节点有 `10Gi` 内存，希望在可用内存下降到 `1Gi` 以下时引起移除操作，则移除门限可以使用下面任意一种方式指定（但不是两者同时）。

* `memory.available<10%`
* `memory.available<1Gi`


#### 软移除门限


软移除门限使用一对由移除门限和管理员必须指定的宽限期组成的配置对。在超过宽限期前，`kubelet` 不会采取任何动作回收和移除信号关联的资源。如果没有提供宽限期，`kubelet` 启动时将报错。


此外，如果达到了软移除门限，操作员可以指定从节点移除 pod 时，在宽限期内允许结束的 pod 的最大数量。如果指定了 `pod.Spec.TerminationGracePeriodSeconds` 值，`kubelet` 将使用它和宽限期二者中较小的一个。如果没有指定，`kubelet` 将立即终止 pod，而不会优雅结束它们。


  软移除门限的配置支持下列标记：

* `eviction-soft` 描述了移除门限的集合（例如 `memory.available<1.5Gi`），如果在宽限期之外满足条件将触发 pod 移除。
* `eviction-soft-grace-period` 描述了移除宽限期的集合（例如 `memory.available=1m30s`），对应于在移除 pod 前软移除门限应该被控制的时长。
* `eviction-max-pod-grace-period` 描述了当满足软移除门限并终止 pod 时允许的最大宽限期值（秒数）。


#### 硬移除门限


硬移除门限没有宽限期，一旦察觉，`kubelet` 将立即采取行动回收关联的短缺资源。如果满足硬移除门限，`kubelet` 将立即结束 pod 而不是优雅终止。


硬移除门限的配置支持下列标记：

* `eviction-hard` 描述了移除门限的集合（例如 `memory.available<1Gi`），如果满足条件将触发 pod 移除。


`kubelet` 有如下所示的默认硬移除门限：

* `--eviction-hard=memory.available<100Mi`


### 移除监控时间间隔


`kubelet` 根据其配置的整理时间间隔计算移除门限。

* `housekeeping-interval` 是容器管理时间间隔。


### 节点状态


`kubelet` 会将一个或多个移除信号映射到对应的节点状态。


如果满足硬移除门限，或者满足独立于其关联宽限期的软移除门限时，`kubelet` 将报告节点处于压力下的状态。


下列节点状态根据相应的移除信号定义。

| Node Condition   | Eviction Signal                          | Description                              |
| ---------------- | ---------------------------------------- | ---------------------------------------- |
| `MemoryPressure` | `memory.available`                       | Available memory on the node has satisfied an eviction threshold |
| `DiskPressure`   | `nodefs.available`, `nodefs.inodesFree`, `imagefs.available`, or `imagefs.inodesFree` | Available disk space and inodes on either the node's root filesytem or image filesystem has satisfied an eviction threshold |


`kubelet` 将以 `--node-status-update-frequency` 指定的频率连续报告节点状态更新，其默认值为 `10s`。


### 节点状态振荡


如果节点在软移除门限的上下振荡，但没有超过关联的宽限期时，将引起对应节点的状态持续在 true 和 false 间跳变，并导致不好的调度结果。


为了防止这种振荡，可以定义下面的标志，用于控制 `kubelet` 从压力状态中退出之前必须等待的时间。


* `eviction-pressure-transition-period` 是 `kubelet` 从压力状态中退出之前必须等待的时长。


`kubelet` 将确保在设定的时间段内没有发现和指定压力条件相对应的移除门限被满足时，才会将状态变回 `false`。


### 回收节点层级资源


如果满足移除门限并超过了宽限期，`kubelet` 将启动回收压力资源的过程，直到它发现低于设定门限的信号为止。


`kubelet` 将尝试在移除终端用户 pod 前回收节点层级资源。发现磁盘压力时，如果节点针对容器运行时配置有独占的 `imagefs`，`kubelet` 回收节点层级资源的方式将会不同。


#### 使用 Imagefs


如果 `nodefs` 满足移除门限，`kubelet` 将以下面的顺序释放磁盘空间：


1. 删除停止运行的 pod/container


如果 `imagefs` 满足移除门限，`kubelet` 将以下面的顺序释放磁盘空间：


2. 删除全部没有使用的镜像


#### 未使用 Imagefs


如果 `nodefs` 满足移除门限，`kubelet` 将以下面的顺序释放磁盘空间：

1. 删除停止运行的 pod/container
2. 删除全部没有使用的镜像


### 移除最终用户的 pod


如果 `kubelet` 在节点上无法回收足够的资源，它将开始移除 pod。


`kubelet` 按如下项目对要移除的 pod 排名：

* 按其 service 质量。
* 按和 pod 调度请求关联的短缺计算资源消耗情况。


因此，pod 的移除按以下顺序发生：

* 消耗最多短缺资源的 `BestEffort` pod 首先被终止。
* 消耗最多与其请求资源关联的短缺资源的 `Burstable` pod 将被优先终止。如果没有 pod 超出它们的请求量，移除策略将以短缺资源最大的消耗者作为目标。


`Guaranteed` 的 pod 保证绝对不会因为其它 pod 的资源消耗而被移除。如果系统守护进程（也就是 `kubelet`、`docker`、`journald` 等）使用的资源比 `system-reserved` 或者 `kube-reserved` 分配的更多，且节点上只有 `Guaranteed` 类型 pod 运行时，节点必须选择结束 `Guaranteed` pod 以保证稳定性并限制未知消耗对其它 `Guaranteed` pod 的冲击。


本地磁盘是一种 `BestEffort` 资源。如果有需要，在遭遇  `DiskPressure` 时，`kubelet` 将每次一个的移除 pod。`kubelet` 将按照 service 质量对 pod 排名。当 `kubelet` 响应 `inode` 短缺时，它将首先移除具有最低 service 质量的 pod 来回收 `inodes`。当 `kubelet` 响应可用磁盘短缺时，它将对某种服务质量内消耗最多磁盘的 pod 排名并结束它们。


#### 使用 Imagefs


如果 `nodefs` 触发移除，`kubelet` 将按 `nodefs` 用量 - 本地卷 + pod 的所有容器日志的总和对其排序。


如果是 `imagefs` 触发移除，`kubelet` 将按 pod 所有可写层的用量对其进行排序。


#### 未使用 Imagefs


如果 `nodefs` 触发移除，`kubelet` 将按 `nodefs` 用量 - 本地卷 + pod 的所有容器日志的总和对其排序。


### 最小移除回收


在某些场景，移除 pod 会导致回收少量资源。这将导致 `kubelet` 反复碰到移除门限。除此之外，对如 `disk` 这类资源的移除时比较耗时的。


为了减少这类问题，`kubelet` 可以为每个资源配置一个 `minimum-reclaim`。当 `kubelet` 发现资源压力时，`kubelet` 将尝试至少回收移除门限之下 `minimum-reclaim` 数量的资源。


例如使用下面的配置：

```
--eviction-hard=memory.available<500Mi,nodefs.available<1Gi,imagefs.available<100Gi
--eviction-minimum-reclaim="memory.available=0Mi,nodefs.available=500Mi,imagefs.available=2Gi"`
```

如果 `memory.available` 移除门限被触发，`kubelet` 将保证 `memory.available` 至少为 `500Mi`。对于  `nodefs.available`，`kubelet` 将保证 `nodefs.available` 至少为 `1.5Gi`。对于 `imagefs.available`，`kubelet` 将保证 `imagefs.available` 至少为 `102Gi`，直到不再有相关资源报告压力为止。


所有资源的默认 `eviction-minimum-reclaim` 值为 `0`。


### 调度器


当资源处于压力之下时，节点将报告状态。调度器将那种状态视为一种信号，阻止更多 pod 调度到这个节点上。

| Node Condition   | Scheduler Behavior                       |
| ---------------- | ---------------------------------------- |
| `MemoryPressure` | No new `BestEffort` pods are scheduled to the node. |
| `DiskPressure`   | No new pods are scheduled to the node.   |


## 节点 OOM 行为


如果节点在 `kubelet` 回收内存之前经历了系统 OOM(out of memory，内存不足) 事件，它将基于  [oom_killer](https://lwn.net/Articles/391222/) 做出响应。


`kubelet` 基于 pod 的 service 质量为每个容器设置一个 `oom_score_adj` 值。

| Quality of Service | oom_score_adj                            |
| ------------------ | ---------------------------------------- |
| `Guaranteed`       | -998                                     |
| `BestEffort`       | 1000                                     |
| `Burstable`        | min(max(2, 1000 - (1000 * memoryRequestBytes) / machineMemoryCapacityBytes), 999) |


如果 `kubelet` 在节点经历系统 OOM 之前无法回收内存，`oom_killer` 将基于它在节点上使用的内存百分比算出一个 `oom_score`，并加上 `oom_score_adj` 得到容器的有效 `oom_score`，然后结束得分最高的容器。


预期的行为应该是拥有最低 service 质量并消耗和调度请求相关内存量最多的容器第一个被结束，以回收内存。


和 pod 移除不同，如果一个 pod 的容器是被 OOM 结束的，基于其 `RestartPolicy`，它可能会被 `kubelet` 重新启动。


## 最佳实践


### 可调度资源和移除策略


想象一下下面的场景：

* 节点内存容量：`10Gi`
* 操作员希望为系统守护进程保留 10% 内存容量（内核、`kubelet` 等）。
* 操作员希望在内存用量达到 95% 时移除 pod，以减少对系统的冲击并防止系统 OOM 的发生。


为了促成这个场景，`kubelet` 将像下面这样启动：

```
--eviction-hard=memory.available<500Mi
--system-reserved=memory=1.5Gi
```


这个配置的暗示是理解“系统保留”应该包含被移除门限覆盖的内存数量。


要达到这个容量，要么某些 pod 使用了超过它们请求的资源，要么系统使用的内存超过 `500Mi`。


这个配置将保证在 pod 使用量都不超过它们配置的请求值时，如果可能立即引起内存压力并触发移除时，调度器不会将 pod 放到这个节点上。


### DaemonSet


我们永远都不希望 `kubelet` 移除一个从 `DaemonSet` 派生的 pod，因为这个 pod 将立即被重建并调度回相同的节点。


目前，`kubelet` 没有办法区分一个 pod 是由 `DaemonSet` 还是其他对象创建。如果/当这个信息可用时，`kubelet` 可能会预先将这些 pod 从提供给移除策略的候选集合中过滤掉。


总之，强烈推荐 `DaemonSet` 不要创建 `BestEffort` 的 pod，防止其被识别为移除的候选 pod。相反，理想情况下 `DaemonSet` 应该启动 `Guaranteed` 的 pod。


## 弃用现有特性标签以回收磁盘


`kubelet` 已经按需求清空了磁盘空间以保证节点稳定性。


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


## 已知问题


### kubelet 可能无法立即发现内存压力


`kubelet` 当前通过以固定的时间间隔轮询  `cAdvisor` 来收集内存使用数据。如果内存使用在那个时间窗口内迅速增长，`kubelet` 可能不能足够快的发现  `MemoryPressure`， `OOMKiller` 将不会被调用。我们准备在将来的发行版本中通过集成 `memcg` 通知 API 来减小这种延迟。当超过门限时，内核将立即告诉我们。


如果您想处理可察觉的超量使用而不要求极端精准，可以设置移除门限为大约 75% 容量作为这个问题的变通手段。这将增强这个特性的能力，防止系统 OOM，并提升负载卸载能力，以再次平衡集群状态。


### kubelet 可能会移除超过需求数量的 pod


由于状态采集的时间差，移除操作可能移除比所需的更多的 pod。将来可通过添加从根容器获取所需状态的能力 [(https://github.com/google/cadvisor/issues/1247)](https://github.com/google/cadvisor/issues/1247) 来减缓这种状况。


### Kubelet 响应 inode 耗尽时如何对待移除 pod 排名


目前，要知道某个特定的容器消耗了多少 inode 是一件不可能的事情。如果 `kubelet` 发现 inode 耗尽，它将按照 pod 的 service 质量排名删除它们。下面这个在 cadvisor 项目中开放的问题是关于如何追踪每个容器的 inode 使用量 [(https://github.com/google/cadvisor/issues/1422)](https://github.com/google/cadvisor/issues/1422)，以允许我们按 pod 的 inode 使用量对其排名。例如，这可以让我们识别一个创建了大量 0 比特文件的容器并删除它。