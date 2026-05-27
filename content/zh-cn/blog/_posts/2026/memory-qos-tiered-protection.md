---
layout: blog
title: "Kubernetes v1.36：借助 Memory QoS 实现分层内存保护"
date: 2026-04-29T10:35:00-08:00
slug: kubernetes-v1-36-memory-qos-tiered-protection
author: >
  Qi Wang (Red Hat),
  Sohan Kunkerkar (Red Hat)
translator: >
  [Paco Xu](https://github.com/pacoxu)(DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.36: Tiered Memory Protection with Memory QoS"
date: 2026-04-29T10:35:00-08:00
slug: kubernetes-v1-36-memory-qos-tiered-protection
author: >
  Qi Wang (Red Hat),
  Sohan Kunkerkar (Red Hat)
-->

<!--
On behalf of SIG Node, we are pleased to announce updates to the Memory QoS
feature (alpha) in Kubernetes v1.36. Memory QoS uses the cgroup v2 memory
controller to give the kernel better guidance on how to treat container memory.
It was first introduced in v1.22 and updated in v1.27. In Kubernetes v1.36, we're introducing: opt-in memory reservation, tiered
protection by QoS class, observability metrics, and kernel-version warning for `memory.high`.
-->
我谨代表 SIG Node 宣布 Kubernetes v1.36 中 Memory QoS 特性（Alpha）的更新。
Memory QoS 使用 cgroup v2 的内存控制器，为内核提供更好的指引来处理容器内存。
它最早在 v1.22 中引入，并在 v1.27 中更新。
在 Kubernetes v1.36 中，我们引入了以下内容：可选启用的内存预留、基于 QoS 类的分层保护、
可观测性指标，以及针对 `memory.high` 的内核版本告警。

<!--
## What's new in v1.36
-->
## v1.36 的新变化

<!--
### Opt-in memory reservation with `memoryReservationPolicy`
-->
### 使用 `memoryReservationPolicy` 选择性启用内存预留

<!--
v1.36 separates throttling from reservation. Enabling the feature gate turns on
`memory.high` throttling (the kubelet sets `memory.high` based on
`memoryThrottlingFactor`, default 0.9), but memory reservation is now controlled
by a separate kubelet configuration field:
-->
v1.36 将节流与预留分离开来。启用该特性门控后，会开启 `memory.high` 节流
（kubelet 基于 `memoryThrottlingFactor` 设置 `memory.high`，默认值为 0.9），
但内存预留现在由一个独立的 kubelet 配置字段控制：

<!--
- **`None`** (default): no `memory.min` or `memory.low` is written. Throttling
  via `memory.high` still works.
- **`TieredReservation`**: the kubelet writes tiered memory protection based on the Pod's
[QoS class](/docs/concepts/workloads/pods/pod-qos/):
-->
- **`None`**（默认）：不写入 `memory.min` 或 `memory.low`。通过 `memory.high` 进行的节流仍然有效。
- **`TieredReservation`**：kubelet 基于 Pod 的
  [QoS 类](/zh-cn/docs/concepts/workloads/pods/pod-qos/)
  写入分层内存保护：

<!--
**Guaranteed** Pods get hard protection via `memory.min`. For example, a
Guaranteed Pod requesting 512 MiB of memory results in:
-->
**Guaranteed** Pod 通过 `memory.min` 获得硬保护。例如，一个请求 512 MiB 内存的
Guaranteed Pod 会得到：

```none
$ cat /sys/fs/cgroup/kubepods.slice/kubepods-pod6a4f2e3b_1c9d_4a5e_8f7b_2d3e4f5a6b7c.slice/memory.min
536870912
```

<!--
The kernel will not reclaim this memory under any circumstances. If it cannot
honor the guarantee, it invokes the OOM killer on other processes to free pages.
-->
内核在任何情况下都不会回收这部分内存。如果无法兑现这一保证，
它会对其他进程触发 OOM killer 以释放内存页。

<!--
**Burstable** Pods get soft protection via `memory.low`. For the same 512 MiB
request on a Burstable Pod:
-->
**Burstable** Pod 通过 `memory.low` 获得软保护。对于同样请求 512 MiB 内存的
Burstable Pod：

```none
$ cat /sys/fs/cgroup/kubepods.slice/kubepods-burstable.slice/kubepods-burstable-pod8b3c7d2e_4f5a_6b7c_9d1e_3f4a5b6c7d8e.slice/memory.low
536870912
```

<!--
The kernel avoids reclaiming this memory under normal pressure, but may reclaim
it if the alternative is a system-wide OOM.
-->
在正常压力下，内核会避免回收这部分内存；但如果另一种选择是系统范围的 OOM，
内核仍可能回收其中一部分。

<!--
**BestEffort** Pods get neither `memory.min` nor `memory.low`. Their memory
remains fully reclaimable.
-->
**BestEffort** Pod 既不会获得 `memory.min`，也不会获得 `memory.low`。
它们的内存仍然是完全可回收的。

<!--
#### Comparison with v1.27 behavior
-->
#### 与 v1.27 行为的对比

<!--
In earlier versions, enabling the MemoryQoS feature gate immediately set `memory.min` for every container with a memory request. `memory.min` is a hard reservation that the kernel will not reclaim, regardless of memory pressure.
-->
在更早的版本中，启用 `MemoryQoS` 特性门控后，会立即为每个带有内存请求的容器设置 `memory.min`。
`memory.min` 是一种硬预留，无论内存压力如何，内核都不会回收它。

<!--
Consider a node with 8 GiB of RAM where Burstable Pod requests total 7 GiB. In earlier versions, that 7 GiB would be locked as `memory.min`, leaving little headroom for the kernel, system daemons, or BestEffort workloads and increasing the risk of OOM kills.
-->
假设一个节点有 8 GiB RAM，而 Burstable Pod 的请求总量达到 7 GiB。
在更早版本中，这 7 GiB 会作为 `memory.min` 被锁定，
从而给内核、系统守护进程或 BestEffort 工作负载留下极少余量，
并增加 OOM kill 的风险。

<!--
With v1.36 tiered reservation, those Burstable requests map to `memory.low` instead of `memory.min`. Under normal pressure, the kernel still protects that memory, but under extreme pressure it can reclaim part of it to avoid system-wide OOM. Only Guaranteed Pods use `memory.min`, which keeps hard reservation lower.
-->
在 v1.36 的分层预留机制下，这些 Burstable 请求会映射到 `memory.low`，而不是 `memory.min`。
在正常压力下，内核仍会保护这部分内存；但在极端压力下，
它可以回收其中一部分以避免系统范围的 OOM。
只有 Guaranteed Pod 才会使用 `memory.min`，这使得硬预留保持在更低水平。

<!--
With `memoryReservationPolicy` in v1.36, you can enable throttling first, observe workload behavior, and opt into reservation when your node has enough headroom.
-->
借助 v1.36 中的 `memoryReservationPolicy`，
你可以先启用节流，观察工作负载行为，
然后在节点拥有足够余量时再选择启用预留。

<!--
### Observability metrics
-->
### 可观测性指标

<!--
Two alpha-stability metrics are exposed on the kubelet `/metrics` endpoint:
-->
kubelet 的 `/metrics` 端点会暴露两个 Alpha 级稳定性指标：

| 指标 | 说明 |
|--------|-------------|
| `kubelet_memory_qos_node_memory_min_bytes` | Guaranteed Pod 的 `memory.min` 总量 |
| `kubelet_memory_qos_node_memory_low_bytes` | Burstable Pod 的 `memory.low` 总量 |

<!--
These are useful for capacity planning. If `kubelet_memory_qos_node_memory_min_bytes`
is creeping toward your node's physical memory, you know hard reservation is
getting tight.
-->
这些指标对于容量规划非常有用。
如果 `kubelet_memory_qos_node_memory_min_bytes`
正在逐渐逼近节点的物理内存，
你就知道硬预留已经变得紧张了。

```none
$ curl -sk https://localhost:10250/metrics | grep memory_qos
# HELP kubelet_memory_qos_node_memory_min_bytes [ALPHA] Total memory.min in bytes for Guaranteed pods
kubelet_memory_qos_node_memory_min_bytes 5.36870912e+08
# HELP kubelet_memory_qos_node_memory_low_bytes [ALPHA] Total memory.low in bytes for Burstable pods
kubelet_memory_qos_node_memory_low_bytes 2.147483648e+09
```

<!--
### Kernel version check
-->
### 内核版本检查

<!--
On kernels older than 5.9, `memory.high` throttling can trigger the
[kernel livelock](https://lore.kernel.org/all/a4e23b59e9ef499b575ae73a8120ee089b7d3373.1594640214.git.chris@chrisdown.name/) issue. The bug was fixed
in kernel 5.9. In v1.36, when the feature gate is enabled, the kubelet checks the
kernel version at startup and logs a warning if it is below 5.9. The feature
continues to work — this is informational, not a hard block.
-->
在版本低于 5.9 的内核上，`memory.high` 节流可能触发
[内核活锁](https://lore.kernel.org/all/a4e23b59e9ef499b575ae73a8120ee089b7d3373.1594640214.git.chris@chrisdown.name/)
问题。这个缺陷已在内核 5.9 中修复。
在 v1.36 中，当启用该特性门控时，kubelet 会在启动时检查内核版本，
如果内核版本低于 5.9 就记录一条告警日志。
该特性仍然可以继续工作，这只是信息提示，并不是硬阻断。

<!--
### How Kubernetes maps Memory QoS to cgroup v2
-->
### Kubernetes 如何将 Memory QoS 映射到 cgroup v2

<!--
Memory QoS uses four cgroup v2 memory controller interfaces:
-->
Memory QoS 使用四个 cgroup v2 内存控制器接口：

<!--
- **`memory.max`**: hard memory limit — unchanged from previous versions
- **`memory.min`**: hard memory protection — with `TieredReservation`, set only for Guaranteed Pods
- **`memory.low`**: soft memory protection — set for Burstable Pods with `TieredReservation`
- **`memory.high`**: memory throttling threshold — unchanged from previous versions
-->
- **`memory.max`**：硬内存限制，与之前版本一致
- **`memory.min`**：硬内存保护，在 `TieredReservation` 下仅对 Guaranteed Pod 设置
- **`memory.low`**：软内存保护，在 `TieredReservation` 下对 Burstable Pod 设置
- **`memory.high`**：内存节流阈值，与之前版本一致

<!--
The following table shows how Kubernetes container resources map to cgroup v2
interfaces when `memoryReservationPolicy: TieredReservation` is configured.
With the default `memoryReservationPolicy: None`, no `memory.min` or
`memory.low` values are set.
-->
下表展示了在配置 `memoryReservationPolicy: TieredReservation` 时，
Kubernetes 容器资源如何映射到 cgroup v2 接口。
对于默认值 `memoryReservationPolicy: None`，不会设置 `memory.min` 或 `memory.low`。

<table>
    <tr>
        <th>QoS 类</th>
        <th><tt>memory.min</tt></th>
        <th><tt>memory.low</tt></th>
        <th><tt>memory.high</tt></th>
        <th><tt>memory.max</tt></th>
    </tr>
    <tr>
        <td><b>Guaranteed</b></td>
        <td>设置为 <code>requests.memory</code><br>（硬保护）</td>
        <td>不设置</td>
        <td>不设置<br>（requests == limits，因此节流没有意义）</td>
        <td>设置为 <code>limits.memory</code></td>
    </tr>
    <tr>
        <td><b>Burstable</b></td>
        <td>不设置</td>
        <td>设置为 <code>requests.memory</code><br>（软保护）</td>
        <td>基于节流因子公式计算</td>
        <td>设置为 <code>limits.memory</code><br>（如果已指定）</td>
    </tr>
    <tr>
        <td><b>BestEffort</b></td>
        <td>不设置</td>
        <td>不设置</td>
        <td>基于节点可分配内存计算</td>
        <td>不设置</td>
    </tr>
</table>

<!--
### Cgroup hierarchy
-->
### cgroup 层级

<!--
cgroup v2 requires that a parent cgroup's memory protection is at least as
large as the sum of its children's. The kubelet maintains this by setting
`memory.min` on the kubepods root cgroup to the sum of all Guaranteed and
Burstable Pod memory requests, and `memory.low` on the Burstable QoS cgroup
to the sum of all Burstable Pod memory requests. This way the kernel can
enforce the per-container and per-pod protection values correctly.
-->
cgroup v2 要求父 cgroup 的内存保护值至少要与其所有子 cgroup 之和一样大。
kubelet 通过以下方式维持这一点：
将 kubepods 根 cgroup 上的 `memory.min`
设置为所有 Guaranteed 和 Burstable Pod 内存请求之和，
并将 Burstable QoS cgroup 上的 `memory.low`
设置为所有 Burstable Pod 内存请求之和。
这样，内核就能够正确执行容器级和 Pod 级的保护值。

<!--
The kubelet manages pod-level and QoS-class cgroups directly using the runc
libcontainer library, while container-level cgroups are managed by the
container runtime (containerd or CRI-O).
-->
kubelet 直接使用 runc 的 libcontainer 库管理 Pod 级别和 QoS 类级别的 cgroup，
而容器级别的 cgroup 则由容器运行时（containerd 或 CRI-O）管理。

<!--
## How do I use it?
-->
## 如何使用？

<!--
### Prerequisites
-->
### 前提条件

<!--
1. Kubernetes v1.36 or later
2. Linux with cgroup v2. Kernel 5.9 or higher is recommended — earlier kernels
   work but may experience the livelock issue. You can verify cgroup v2 is
   active by running `mount | grep cgroup2`.
3. A container runtime that supports cgroup v2 (containerd 1.6+, CRI-O 1.22+)
-->
1. Kubernetes v1.36 或更高版本
2. 使用 cgroup v2 的 Linux。推荐使用 5.9 或更高版本的内核；
   更早版本的内核也能工作，但可能会遇到活锁问题。
   你可以运行 `mount | grep cgroup2` 来验证 cgroup v2 是否已启用。
3. 支持 cgroup v2 的容器运行时（containerd 1.6+、CRI-O 1.22+）

<!--
### Configuration
-->
### 配置

<!--
To enable Memory QoS with tiered protection:
-->
要启用带分层保护的 Memory QoS：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: true
memoryReservationPolicy: TieredReservation  # 可选值：None（默认）、TieredReservation
memoryThrottlingFactor: 0.9  # 可选，默认值为 0.9
```

<!--
If you want `memory.high` throttling without memory protection, omit
`memoryReservationPolicy` or set it to `None`:
-->
如果你只想启用 `memory.high` 节流，而不启用内存保护，
可以省略 `memoryReservationPolicy`，或者将其设置为 `None`：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: true
memoryReservationPolicy: None  # 默认值
```

<!--
## How can I learn more?
-->
## 如何进一步了解？

<!--
- [KEP-2570: Memory QoS](https://kep.k8s.io/2570)
- [Pod Quality of Service Classes](/docs/concepts/workloads/pods/pod-qos/)
- [Managing Resources for Containers](/docs/concepts/configuration/manage-resources-containers/)
- [Kubernetes cgroups v2 support](/docs/concepts/architecture/cgroups/)
- [Linux kernel cgroups v2 documentation](https://docs.kernel.org/admin-guide/cgroup-v2.html)
-->
- [KEP-2570：Memory QoS](https://kep.k8s.io/2570)
- [Pod QoS 类](/zh-cn/docs/concepts/workloads/pods/pod-qos/)
- [为 Pod 和容器管理资源](/zh-cn/docs/concepts/configuration/manage-resources-containers/)
- [关于 CGroup v2](/zh-cn/docs/concepts/architecture/cgroups/)
- [Linux 内核 cgroups v2 文档](https://docs.kernel.org/admin-guide/cgroup-v2.html)

<!--
## Getting involved
-->
## 参与其中

<!--
This feature is driven by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).
If you are interested in contributing or have feedback, you can find us on
[Slack](https://kubernetes.slack.com/messages/sig-node) (#sig-node), the
[mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node),
or at the regular
[SIG Node meetings](https://github.com/kubernetes/community/tree/master/sig-node#meetings).
Please file bugs at [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues)
and enhancement proposals at
[kubernetes/enhancements](https://github.com/kubernetes/enhancements/issues/2570).
-->
此特性由 [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 推动。
如果你有兴趣参与贡献或提供反馈，
可以通过 [Slack](https://kubernetes.slack.com/messages/sig-node)（`#sig-node`）、
[邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
或定期举行的
[SIG Node 会议](https://github.com/kubernetes/community/tree/master/sig-node#meetings)
找到我们。
请将缺陷报告提交到 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues)，
并将增强提案提交到 [kubernetes/enhancements](https://github.com/kubernetes/enhancements/issues/2570)。
