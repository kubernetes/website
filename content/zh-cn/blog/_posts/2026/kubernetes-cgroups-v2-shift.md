---
layout: blog
title: "Kubernetes 迁移到 cgroup v2：你需要了解的内容"
date: 2026-10-06T10:00:00-08:00
slug: kubernetes-cgroups-v2-shift
author: >
  Paco Xu (DaoCloud)

---
<!--
layout: blog
title: 'The Shift to cgroup v2 in Kubernetes: What You Need to Know'
date: 2026-10-06T10:00:00-08:00
slug: kubernetes-cgroups-v2-shift
author: >
   Paco Xu (DaoCloud)
-->

<!--
In Linux, _cgroups_ (control groups) are a kernel feature used for managing system resources.
Kubernetes uses cgroups to allocate resources like CPU and memory to containers,
ensuring that applications run smoothly without interfering with each other.
With the release of Kubernetes v1.31, support for v1 cgroup management moved into
[maintenance mode](/blog/2024/08/14/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/).
Support for v2 cgroup management has been stable since Kubernetes v1.25.
-->
在 Linux 中，**cgroups**（控制组，control groups）是用于管理系统资源的内核特性。
Kubernetes 使用 cgroups 为容器分配 CPU 和内存等资源，
确保应用能够平稳运行且互不干扰。
随着 Kubernetes v1.31 发布，对 v1 cgroup 管理的支持进入了
[维护模式](/zh-cn/blog/2024/08/14/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/)。
对 v2 cgroup 管理的支持自 Kubernetes v1.25 起保持稳定。

<!--
Compared with cgroup v1, cgroup v2 provides a single unified hierarchy,
a more consistent interface, and a stronger foundation for resource isolation
and modern resource-management features.
-->
与 cgroup v1 相比，cgroup v2 提供统一的层级结构、
更加一致的接口，并为资源隔离和现代资源管理特性打下更坚实的基础。

<!--
## Deprecation of cgroup v1
-->
## 弃用 cgroup v1

<!--
Kubernetes has [deprecated cgroup v1](/docs/concepts/architecture/cgroups/#deprecation-of-cgroup-v1).
Starting with Kubernetes v1.35, `failCgroupV1` defaults to `true`, so the kubelet does not start
on a cgroup v1 node by default. Administrators can temporarily set `failCgroupV1: false` in the
[kubelet configuration file](/docs/tasks/administer-cluster/kubelet-config-file/), but removal will
follow the [Kubernetes deprecation policy](/docs/reference/using-api/deprecation-policy/).
Further removal work is tracked in [KEP-5573: Remove cgroup v1 support](https://www.kubernetes.dev/resources/keps/5573).
-->
Kubernetes 已经[弃用 cgroup v1](/zh-cn/docs/concepts/architecture/cgroups/#deprecation-of-cgroup-v1)。
从 Kubernetes v1.35 开始，`failCgroupV1` 默认为 `true`，
因此 kubelet 默认不会在 cgroup v1 节点上启动。
管理员可以在 [kubelet 配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)中临时设置 
`failCgroupV1: false`，但移除将遵循
[Kubernetes 弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
后续移除工作由
[KEP-5573：移除 cgroup v1 支持](https://www.kubernetes.dev/resources/keps/5573)跟踪。

<!--
If you are still on a release older than v1.35, migrate every Linux node to
cgroup v2 before upgrading, or plan to set the temporary `failCgroupV1: false`
override. If you are already on v1.35 or later, confirm that every Linux node
runs cgroup v2 (or that you intentionally keep the override). Under the default
configuration, a remaining cgroup v1 node fails during kubelet startup.
-->
如果你仍在使用早于 v1.35 的版本，请在升级前把每个 Linux 节点迁移到 cgroup v2，
或者计划设置临时的 `failCgroupV1: false` 覆盖项。
如果你已经在使用 v1.35 或更高版本，请确认每个 Linux 节点都在运行 cgroup v2
（或者你确实有意保留该覆盖项）。
在默认配置下，仍停留在 cgroup v1 的节点会在 kubelet 启动时失败。

<!--
For kubeadm-managed clusters, Kubernetes v1.35 also makes this an earlier, stricter check. The
`SystemVerification` preflight check, provided by `k8s.io/system-validators`, returns an error during
`kubeadm init`, `kubeadm join`, and `kubeadm upgrade` when it detects cgroup v1 with kubelet v1.35 or
later; with an older kubelet, the check remains a warning. See
[kubernetes/system-validators#1.12.1 release notes](https://github.com/kubernetes/system-validators/releases/tag/v1.12.1) for details.
-->
对于由 kubeadm 管理的集群，Kubernetes v1.35 还提前并强化了这项检查。
由 `k8s.io/system-validators` 提供的 `SystemVerification` 预检，
在检测到 cgroup v1 且 kubelet 为 v1.35 或更高版本时，
会在 `kubeadm init`、`kubeadm join` 和 `kubeadm upgrade` 期间返回错误；
如果 kubelet 版本更旧，该检查仍然只是警告。
详情参见
[kubernetes/system-validators v1.12.1 发行说明](https://github.com/kubernetes/system-validators/releases/tag/v1.12.1)。

<!--
The top FAQs cover three main areas: why to migrate, the benefits and drawbacks,
and key points to keep in mind when using cgroup v2.
-->
最常见的问题主要集中在三个方面：为什么要迁移、利弊权衡，以及使用 cgroup v2 时需要注意的要点。

<!--
## Limitations of cgroup v1 and Improvements with cgroup v2
-->
## cgroup v1 的局限与 cgroup v2 的改进

<!--
The Linux kernel documentation describes both interfaces:
-->
Linux 内核文档描述了这两套接口：

<!--
- [cgroup v1 documentation](https://www.kernel.org/doc/Documentation/cgroup-v1/)
- [cgroup v2 documentation](https://docs.kernel.org/admin-guide/cgroup-v2.html)
-->
- [cgroup v1 文档](https://www.kernel.org/doc/Documentation/cgroup-v1/)
- [cgroup v2 文档](https://docs.kernel.org/admin-guide/cgroup-v2.html)

<!--
Let's enumerate some known issues.
-->
下面列举一些已知问题。

<!--
### `active_file` memory is not considered available memory
-->
### `active_file` 内存不计入可用内存

<!--
The kubelet treats `active_file` memory as not reclaimable. For I/O-intensive workloads, a large
page cache can therefore make the kubelet report memory pressure and evict Pods. This is a
[known kubelet issue](/docs/concepts/scheduling-eviction/node-pressure-eviction/#active-file-memory-is-not-considered-as-available-memory)
([kubernetes/kubernetes#43916](https://github.com/kubernetes/kubernetes/issues/43916)); migrating to
cgroup v2 does not by itself change that calculation. The documented workaround is to set equal
memory requests and limits for containers that perform intensive I/O, after measuring an appropriate
value.
-->
kubelet 将 `active_file` 内存视为不可回收。
因此，对于 I/O 密集型工作负载，较大的页缓存可能导致 kubelet 报告内存压力并驱逐 Pod。
这是一个[已知的 kubelet 问题](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/#active-file-memory-is-not-considered-as-available-memory)
（[kubernetes/kubernetes#43916](https://github.com/kubernetes/kubernetes/issues/43916)）；
迁移到 cgroup v2 本身不会改变这一计算方式。
文档中的应对办法是：先根据实际负载测定合适的数值，
再为执行密集 I/O 的容器设置相等的内存请求和限制。

<!--
### Memory QoS updates in Kubernetes v1.36
-->
### Kubernetes v1.36 中的 Memory QoS 更新

<!--
[Memory QoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) was introduced as an alpha feature in Kubernetes v1.22 and
updated in v1.27. It remains alpha in v1.36, but now separates memory throttling from memory
reservation and adds [tiered memory protection](/blog/2026/04/29/kubernetes-v1-36-memory-qos-tiered-protection/):
-->
[Memory QoS](/zh-cn/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2)
在 Kubernetes v1.22 中作为 Alpha 特性引入，并在 v1.27 中更新。
它在 v1.36 中仍为 Alpha，但现在把内存节流与内存预留分开，
并增加了[分层内存保护](/zh-cn/blog/2026/04/29/kubernetes-v1-36-memory-qos-tiered-protection/)：

<!--
Memory QoS is available **only** on Linux nodes that use cgroup v2. It relies on the cgroup v2 memory
controller: `memory.high` provides throttling, while `memory.min` and `memory.low` provide hard and
soft protection when tiered reservation is enabled. cgroup v1 cannot provide this protection model.
-->
Memory QoS **仅**在使用 cgroup v2 的 Linux 节点上可用。
它依赖 cgroup v2 内存控制器：`memory.high` 提供节流，
而在启用分层预留时，`memory.min` 和 `memory.low` 分别提供硬保护和软保护。
cgroup v1 无法提供这一保护模型。

<!--
- Enabling the `MemoryQoS` feature gate applies `memory.high` throttling to Burstable containers.
  The threshold is derived from the request, limit, and `memoryThrottlingFactor` (default `0.9`).
- `memoryReservationPolicy: None` is the default. It does not write `memory.min` or `memory.low`.
- `memoryReservationPolicy: TieredReservation` maps Guaranteed Pod memory requests to `memory.min`
  (hard protection) and Burstable Pod requests to `memory.low` (soft protection). BestEffort Pods
  receive neither protection.
- The kubelet exposes Alpha metrics for the total `memory.min` and `memory.low` reservations on a node.
-->
- 启用 `MemoryQoS` 特性门控后，会对 Burstable 容器施加 `memory.high` 节流。
  阈值由请求、限制和 `memoryThrottlingFactor`（默认 `0.9`）推导得出。
- `memoryReservationPolicy: None` 是默认值。它不会写入 `memory.min` 或 `memory.low`。
- `memoryReservationPolicy: TieredReservation` 将 Guaranteed Pod 的内存请求映射到 `memory.min`
  （硬保护），将 Burstable Pod 的请求映射到 `memory.low`（软保护）。
  BestEffort Pod 不获得任何一种保护。
- kubelet 会暴露节点上 `memory.min` 与 `memory.low` 预留总量的 Alpha 指标。

<!--
- Kernel 5.9 or later is recommended. On older kernels, `memory.high` reclaim can trigger a known
  livelock; from v1.36 the kubelet logs a warning when Memory QoS is enabled on an affected kernel.
-->
- 建议使用 5.9 或更高版本的内核。在更早的内核上，`memory.high` 回收可能触发已知的活锁；
  从 v1.36 起，当在受影响的内核上启用 Memory QoS 时，kubelet 会记录一条警告。

<!--
For example, to opt in to tiered protection:
-->
例如，要选择启用分层保护：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: true
memoryReservationPolicy: TieredReservation
memoryThrottlingFactor: 0.9
```

<!--
The overall Kubernetes recommendation is not to enable Alpha features in production; however, if you
judge that memory QoS with tiered reservations is useful for your platform in production, make sure
to test the configuration **and** account for hard-reserved memory before you enable
the `TieredReservation` feature gate.
See the
[Pod QoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) documentation
for the current mapping of Kubernetes QoS classes to cgroup v2 controls.
-->
Kubernetes 的总体建议是不要在生产环境中启用 Alpha 特性；
不过，如果你判断带分层预留的 Memory QoS 对你的平台在生产中有用，
请务必先测试该配置，**并且**把硬预留内存考虑在内，
然后再启用 `TieredReservation` 特性门控。
有关 Kubernetes QoS 类到 cgroup v2 控制项的当前映射，
请参阅 [Pod QoS](/zh-cn/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) 文档。

<!--
### Container-aware OOM handling
-->
### 感知容器的 OOM 处理

<!--
On cgroup v2 nodes, the kubelet defaults `singleProcessOOMKill` to `false`. It therefore sets
`memory.oom.group` for each container cgroup so that an OOM event kills all processes in that
container together, rather than leaving a partially functioning multi-process container. Set
`singleProcessOOMKill: true` only if you need the cgroup v1-compatible behavior where the kernel
may kill one process at a time. See the
[`KubeletConfiguration` reference](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)
for this setting.
-->
在 cgroup v2 节点上，kubelet 将 `singleProcessOOMKill` 默认为 `false`。
因此它会为每个容器 cgroup 设置 `memory.oom.group`，
使一次 OOM 事件同时杀死该容器中的所有进程，
而不是留下一个仅部分进程仍在运行的多进程容器。
仅当你需要与 cgroup v1 兼容的行为（内核可能一次只杀死一个进程）时，
才将 `singleProcessOOMKill` 设为 `true`。
该设置参见
[`KubeletConfiguration` 参考](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)。

<!--
This behavior is scoped to a container cgroup, not the whole Pod. Also, `cgroup.kill` is a separate
administrative interface: writing `1` to it sends `SIGKILL` to every process in that cgroup and its
descendants; it does not configure OOM behavior. The cgroup v2 memory controller additionally
provides `memory.events` counters that monitoring systems and userspace OOM managers can observe.
-->
这一行为的作用范围是容器 cgroup，而不是整个 Pod。
另外，`cgroup.kill` 是一个独立的管理接口：向其中写入 `1` 会向该 cgroup 及其后代中的每个进程发送 `SIGKILL`；
它并不配置 OOM 行为。
cgroup v2 内存控制器还提供 `memory.events` 计数器，供监控系统和用户态 OOM 管理器观察。

<!--
### Rootless support
-->
### Rootless 支持

<!--
In cgroup v1, delegating controllers to less privileged containers may be dangerous.
-->
在 cgroup v1 中，把控制器委派给权限较低的容器可能存在风险。

<!--
Unlike cgroup v1, cgroup v2 officially supports delegation.
Most implementations of rootless containers rely on systemd for
delegating v2 controllers to non-root users.
-->
与 cgroup v1 不同，cgroup v2 官方支持委派。
大多数 rootless 容器实现依赖 systemd，把 v2 控制器委派给非 root 用户。

<!--
This delegation mechanism is separate from Kubernetes Pod user namespaces, which map container
users to unprivileged host users. [Pod user namespace support](/docs/concepts/workloads/pods/user-namespaces/)
graduated to stable in Kubernetes v1.36; check its filesystem, kernel, CRI runtime, and OCI runtime
prerequisites before enabling it.
-->
这种委派机制与 Kubernetes Pod [用户命名空间](/zh-cn/docs/concepts/workloads/pods/user-namespaces/)是分开的。
用户命名空间把容器用户映射到主机上的非特权用户。
Pod 用户命名空间支持已在 Kubernetes v1.36 进阶到稳定版；
启用前请检查其文件系统、内核、CRI 运行时和 OCI 运行时方面的前提条件。

<!--
### What else?
-->
### 还有什么？

<!--
1. eBPF stories:
   - In cgroup v1, device access controls are exposed through interface files.
   - The cgroup v2 device controller has no interface files, and is implemented on top of cgroup BPF.
   - Cilium attaches BPF cgroup programs for socket-based load balancing. Its
     [default cgroup root](https://docs.cilium.io/en/stable/network/kubernetes/kubeproxy-free/#validate-bpf-cgroup-programs-attachment)
     is `/run/cilium/cgroupv2`.
2. [Pressure Stall Information (PSI)](/docs/reference/instrumentation/understand-psi-metrics/)
   reports CPU, memory, and I/O contention at node, Pod, and container level. On supported
   clusters, the kubelet exposes PSI by default (`KubeletPSI` is stable and locked on). PSI
   requires cgroup v2, Linux 4.20 or later, `CONFIG_PSI=y`, and a kernel not booted with
   `psi=0`. The kubelet surfaces the data through the
   [Summary API](/docs/reference/instrumentation/node-metrics/#summary-api-source) and
   `/metrics/cadvisor`.
3. When migrating, update software that reads the cgroup filesystem directly. The
   [migration guidance](/docs/concepts/architecture/cgroups/#migrating-cgroupv2) recommends
   cAdvisor v0.43.0 or later and lists compatible Java, Node.js, and `automaxprocs` versions.
-->
1. eBPF 相关：
   - 在 cgroup v1 中，设备访问控制通过接口文件暴露。
   - cgroup v2 的设备控制器没有接口文件，而是基于 cgroup BPF 实现。
   - Cilium 会挂接 BPF cgroup 程序，用于基于套接字的负载均衡。
     其[默认 cgroup 根目录](https://docs.cilium.io/en/stable/network/kubernetes/kubeproxy-free/#validate-bpf-cgroup-programs-attachment)
     是 `/run/cilium/cgroupv2`。
2. [压力停滞信息（PSI）](/docs/reference/instrumentation/understand-psi-metrics/)
   在节点、Pod 和容器级别报告 CPU、内存和 I/O 争用。
   在受支持的集群上，kubelet 默认暴露 PSI（`KubeletPSI` 已稳定并锁定为开启）。
   PSI 需要 cgroup v2、Linux 4.20 或更高版本、`CONFIG_PSI=y`，以及内核启动时未设置 `psi=0`。
   kubelet 通过 [Summary API](/zh-cn/docs/reference/instrumentation/node-metrics/#summary-api-source)
   和 `/metrics/cadvisor` 提供这些数据。
3. 迁移时，请更新直接读取 cgroup 文件系统的软件。
   [迁移指南](/zh-cn/docs/concepts/architecture/cgroups/#migrating-cgroupv2)建议使用
   cAdvisor v0.43.0 或更高版本，并列出了兼容的 Java、Node.js 和 `automaxprocs` 版本。

<!--
### CPU weight conversion in newer OCI runtimes
-->
### 较新 OCI 运行时中的 CPU 权重转换 {#cpu-weight-conversion-in-newer-oci-runtimes}

<!--
cgroup v1 uses `cpu.shares`, whereas cgroup v2 uses `cpu.weight`. Newer OCI runtimes use an improved
non-linear conversion that preserves the default priority and gives small CPU requests more usable
granularity. The change is implemented in the OCI runtime rather than Kubernetes: it is available
in crun v1.23 and runc v1.3.2. After upgrading a runtime, monitoring or policy tools that predict
exact `cpu.weight` values may need updates. Read
[New Conversion from cgroup v1 CPU Shares to v2 CPU Weight](/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/)
for the formula, examples, and compatibility considerations.
-->
cgroup v1 使用 `cpu.shares`，而 cgroup v2 使用 `cpu.weight`。
较新的 OCI 运行时采用改进的非线性转换，既能保留默认优先级，又让较小的 CPU 请求获得更可用的粒度。
这一变更实现在 OCI 运行时中，而不是 Kubernetes 中：crun v1.23 和 runc v1.3.2 已提供该能力。
升级运行时之后，预测精确 `cpu.weight` 值的监控或策略工具可能需要更新。
公式、示例和兼容性方面的考虑，请阅读
[CGroup v1 CPU 份额（shares）到 v2 CPU 权重（weight）的新转换](/zh-cn/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/)。

<!--
### In-place resource updates
-->
### 原地资源更新

<!--
[In-place Pod vertical scaling](/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize-inplace)
graduated to stable in Kubernetes v1.35. Kubernetes v1.36 then [enabled]
(/blog/2026/04/30/kubernetes-v1-36-inplace-pod-level-resources-beta/)
in-place vertical scaling for Pod-level resources
by default, as a Beta feature. The kubelet coordinates changes between the Pod-level and container
cgroups so that increases create headroom before container limits grow, while decreases constrain
containers before shrinking the Pod-level boundary. Accurate aggregate enforcement for this
v1.36 feature requires cgroup v2.
-->
[Pod 原地垂直扩缩容](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize-inplace)已在 
Kubernetes v1.35 进阶到稳定版。
随后，Kubernetes v1.36 将 Pod
级别资源的[原地垂直扩缩容](/zh-cn/blog/2026/04/30/kubernetes-v1-36-inplace-pod-level-resources-beta/)
作为 Beta 特性默认启用。
kubelet 会协调 Pod 级别 cgroup 与容器 cgroup 之间的变更：
增加资源时，先留出余量再提高容器限制；减少资源时，先收紧容器再缩小 Pod 级别边界。
要准确执行这一 v1.36 特性的聚合限制，需要 cgroup v2。

<!--
## Adopting cgroup version 2
-->
## 采用 cgroup v2

<!--
### Requirements
-->
### 要求

<!--
Here's what you need to use cgroup v2 with Kubernetes.
First up, you need to be using a version of Kubernetes with support for v2 cgroup management;
that's been stable since Kubernetes v1.25 and all supported Kubernetes releases include this support.
-->
下面是在 Kubernetes 中使用 cgroup v2 所需的条件。
首先，你需要使用支持 v2 cgroup 管理的 Kubernetes 版本；
该支持自 Kubernetes v1.25 起保持稳定，所有仍受支持的 Kubernetes 版本都包含这一能力。

<!--
- You need at least one Linux node; cgroup is a Linux-only concept
- Your OS install must run with cgroup v2 enabled
- The kernel version must be 5.8 or later (5.9 or later is recommended when using memory QoS)
- The container runtime must support cgroup v2. For example:
  - containerd v1.4 or later supports cgroup v2; use containerd v2.0 or later for automatic
    cgroup-driver discovery
  - CRI-O v1.20 or later
- The kubelet and the container runtime must both be configured to use the correct cgroup driver. See [Configure the kubelet's cgroup driver to match the container runtime cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
-->
- 至少需要一个 Linux 节点；cgroup 是仅 Linux 才有的概念
- 操作系统必须以启用 cgroup v2 的方式运行
- 内核版本必须为 5.8 或更高（使用 Memory QoS 时建议 5.9 或更高）
- 容器运行时必须支持 cgroup v2。例如：
  - containerd v1.4 或更高版本支持 cgroup v2；若要自动发现 cgroup 驱动，请使用 containerd v2.0 或更高版本
  - CRI-O v1.20 或更高版本
- kubelet 和容器运行时都必须配置为使用正确的 cgroup 驱动。参见[配置 kubelet 的 cgroup 驱动，使之与容器运行时的 cgroup 驱动一致](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。

<!--
For now, you can opt back in to use cgroup v1; the Kubernetes project recommends using cgroup v2, but in Kubernetes 1.36 (the current release) the cgroup v1 option remains
supported as a fallback.
That fallback is scheduled for removal in
Kubernetes v1.38. If you are running an older cluster, plan to migrate; if you are setting
up a new cluster with Linux nodes, you should prefer cgroup v2.
In either case, review both the [Kubernetes runtime documentation](/docs/setup/production-environment/container-runtimes/#systemd-cgroup-driver)
and (if relevant) the [containerd compatibility matrix](https://github.com/containerd/containerd/blob/main/RELEASES.md#kubernetes-support).
-->
目前你仍可以选择继续使用 cgroup v1。
Kubernetes 项目建议使用 cgroup v2，但在 Kubernetes 1.36（当前版本）中，
cgroup v1 仍作为后备选项受到支持。
该后备选项计划在 Kubernetes v1.38 中移除。
如果你正在运行较旧的集群，请计划迁移；
如果你正在为 Linux 节点搭建新集群，应优先选择 cgroup v2。
无论哪种情况，都请同时查阅
[Kubernetes 运行时文档](/zh-cn/docs/setup/production-environment/container-runtimes/#systemd-cgroup-driver)，
以及（如相关）[containerd 兼容性矩阵](https://github.com/containerd/containerd/blob/main/RELEASES.md#kubernetes-support)。

<!--
#### kernel updates around cgroup v2
-->
#### 围绕 cgroup v2 的内核更新

<!--
When Kubernetes was first announced, in 2014, only v1 cgroup existed.
Version 2 cgroup management first appeared in Linux kernel 4.5, released in 2016.
-->
Kubernetes 于 2014 年首次发布时，只有 cgroup v1。
cgroup v2 管理最早出现在 2016 年发布的 Linux 内核 4.5 中。

<!--
- In Linux 4.5, the cgroup v2 `io`, `memory`, and `pids` controllers were supported.
- Linux 4.15 added support for the cgroup v2 `cpu` controller.
- [Pressure Stall Information](https://docs.kernel.org/accounting/psi.html) (PSI) support began with Linux 4.20.
- The Kubernetes project does not recommend using cgroup v2 with a Linux kernel older than 5.2
  due to lack of cgroup-level task freezer support.
- Kubernetes documents 5.8 as the minimum kernel version for cgroup v2; the root cgroup's
  system-level `cpu.stat` file was added in Linux 5.8.
- The `memory.high` livelock fix used by Memory QoS is present in Linux 5.9 and later.
- `memory.peak` was added in Linux 5.19.
-->
- Linux 4.5 支持 cgroup v2 的 `io`、`memory` 和 `pids` 控制器。
- Linux 4.15 增加了对 cgroup v2 `cpu` 控制器的支持。
- [压力停滞信息](https://docs.kernel.org/accounting/psi.html)（PSI）的支持始于 Linux 4.20。
- 由于缺少 cgroup 级别的 task freezer 支持，Kubernetes 项目不建议在早于 5.2 的 Linux 内核上使用 cgroup v2。
- Kubernetes 将 5.8 记为 cgroup v2 的最低内核版本；根 cgroup 的系统级 `cpu.stat` 文件是在 Linux 5.8 中加入的。
- Memory QoS 所依赖的 `memory.high` 活锁修复存在于 Linux 5.9 及更高版本。
- `memory.peak` 在 Linux 5.19 中加入。

<!--
### cgroup driver configuration
-->
### cgroup 驱动配置

<!--
[Configure the kubelet's cgroup driver to match the container runtime cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
-->
[配置 kubelet 的 cgroup 驱动，使之与容器运行时的 cgroup 驱动一致](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)。

<!--
If you use `kubeadm` to manage your cluster, Kubernetes recommends that you use the `systemd` cgroup driver,
because `kubeadm` manages the kubelet as a systemd service. For other management tooling,
check the documentation for the tool you're using to manage your cluster.
-->
如果你使用 `kubeadm` 管理集群，Kubernetes 建议使用 `systemd` cgroup 驱动，
因为 `kubeadm` 将 kubelet 作为 systemd 服务来管理。
对于其他管理工具，请查阅你用来管理集群的工具的文档。

<!--
If you can pick either option, I recommend using the systemd driver.
-->
如果两种驱动都可以选，我建议使用 systemd 驱动。

<!--
Whatever tooling you've chosen, the kubelet automatically tries to detect the runtime's recommended cgroup driver.
This automatic detection relies on using a runtime
that implements the `RuntimeConfig`
CRI RPC (for example: containerd v2.0+ or CRI-O v1.28+).
-->
无论你选择哪种工具，kubelet 都会自动尝试检测运行时推荐的 cgroup 驱动。
这种自动检测依赖于实现了 `RuntimeConfig` CRI RPC 的运行时
（例如 containerd v2.0+ 或 CRI-O v1.28+）。

<!--
If you're using a container runtime that supports cgroup v2 but doesn't support automatic cgroup driver detection,
you can manually configure an override by editing
the kubelet configuration file. For example:
-->
如果你使用的容器运行时支持 cgroup v2，但不支持自动检测 cgroup 驱动，
可以通过编辑 kubelet 配置文件手动覆盖。例如：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd
```

<!--
Automatic discovery of the runtime's cgroup driver through the CRI, tracked by
[KEP-4033](https://www.kubernetes.dev/resources/keps/4033), graduated to stable in Kubernetes v1.34. It requires a runtime
that implements the `RuntimeConfig` CRI RPC (containerd v2.0+ or CRI-O v1.28+). When available,
the kubelet uses the value reported by the runtime instead of its configured `cgroupDriver` value.
-->
通过 CRI 自动发现运行时 cgroup 驱动的能力由
[KEP-4033](https://www.kubernetes.dev/resources/keps/4033) 跟踪，已在 Kubernetes v1.34 进阶到稳定版。
它要求运行时实现 `RuntimeConfig` CRI RPC（containerd v2.0+ 或 CRI-O v1.28+）。
当该能力可用时，kubelet 会使用运行时报告的值，而不是自身配置的 `cgroupDriver` 值。

<!--
### Tools and commands for troubleshooting
-->
### 排查问题的工具和命令

<!--
Tools and commands that you should know about cgroups:
-->
了解 cgroup 时应当知道的工具和命令：

<!--
- `stat -fc %T /sys/fs/cgroup/`: Check whether cgroup v2 is enabled; it returns `cgroup2fs`.
- `systemctl list-units 'kube*' --type=slice` or `--type=scope`: List Kubernetes-related units
  that systemd currently has in memory.
- `bpftool cgroup list /sys/fs/cgroup/*`: List all programs attached to the cgroup CGROUP.
- `systemd-cgls /sys/fs/cgroup/*`: Recursively show control group contents.
- `systemd-cgtop`: Show top control groups by their resource usage.
- `tree -L 2 -d /sys/fs/cgroup/kubepods.slice`: Show Pods' related cgroups directories.
-->
- `stat -fc %T /sys/fs/cgroup/`：检查是否启用了 cgroup v2；启用时返回 `cgroup2fs`。
- `systemctl list-units 'kube*' --type=slice` 或 `--type=scope`：列出 systemd 当前载入内存的、与 Kubernetes 相关的单元。
- `bpftool cgroup list /sys/fs/cgroup/*`：列出挂接到该 cgroup 的所有程序。
- `systemd-cgls /sys/fs/cgroup/*`：递归显示控制组内容。
- `systemd-cgtop`：按资源用量显示排名靠前的控制组。
- `tree -L 2 -d /sys/fs/cgroup/kubepods.slice`：显示与 Pod 相关的 cgroup 目录。

<!--
#### How to check if a Pod CPU or memory limit is successfully applied to the cgroup file?
-->
#### 如何检查 Pod 的 CPU 或内存限制是否已成功写入 cgroup 文件？

<!--
Work from the API object down to the node. Identify the node, then compare
desired resources in the spec with the enacted values in status (in-place
resize can leave those out of sync):
-->
从 API 对象一路查到节点。先确定节点，再比较 spec 中的期望资源与 status 中已生效的值
（原地调整大小可能使二者暂时不一致）：

```bash
kubectl get pod <pod-name> -n <namespace> \
  -o jsonpath='{.spec.nodeName}{"\n"}'

kubectl get pod <pod-name> -n <namespace> \
  -o jsonpath='{range .spec.containers[*]}{.name}{" spec\t"}{.resources}{"\n"}{end}'

kubectl get pod <pod-name> -n <namespace> \
  -o jsonpath='{range .status.containerStatuses[*]}{.name}{" status\t"}{.resources}{"\n"}{end}'
```

<!--
On that node, as root, with the systemd cgroup driver and cgroup v2 (these
snippets also need `jq`). Pin the container with kubelet labels; a container
name alone is not unique on a node. Use `crictl ps -a` if the container is
not running:
-->
在该节点上以 root 身份操作，并使用 systemd cgroup 驱动和 cgroup v2
（这些片段还需要 `jq`）。用 kubelet 标签定位容器；仅凭容器名在节点上并不唯一。
如果容器没有在运行，请使用 `crictl ps -a`：

```bash
CONTAINER_ID=$(crictl ps \
  --label io.kubernetes.pod.namespace=<namespace> \
  --label io.kubernetes.pod.name=<pod-name> \
  --name <container-name> -q | head -n1)

# OCI 视图（不是 CRI protobuf 字段名）
crictl inspect "$CONTAINER_ID" | jq '.info.runtimeSpec.linux.resources'

# 此容器的内核 cgroup 路径
PID=$(crictl inspect "$CONTAINER_ID" | jq -r '.info.pid')
CGROUP="/sys/fs/cgroup$(awk -F: '$1=="0"{print $3}' /proc/$PID/cgroup)"

cat "$CGROUP/cpu.weight"   # request.cpu → shares → weight；不是限制
cat "$CGROUP/cpu.max"      # limit.cpu，格式为 "quota period"；无限制时为 "max <period>"
cat "$CGROUP/memory.max"   # limit.memory；无限制时为 "max"

# Pod 级别 cgroup（父 slice），供 Pod 级别资源使用
cat "$(dirname "$CGROUP")/cpu.max" "$(dirname "$CGROUP")/memory.max"

# 启用 MemoryQoS 时才会出现
cat "$CGROUP/memory.high" "$CGROUP/memory.min" "$CGROUP/memory.low"

SCOPE=$(basename "$CGROUP")
systemctl show "$SCOPE" \
  -p CPUWeight -p CPUQuotaPerSecUSec -p CPUQuotaPeriodUSec -p MemoryMax
```

<!--
Do not treat `info.runtimeSpec.linux.cgroupsPath` as a filesystem path when
the runtime uses the systemd driver; that value is a systemd unit path
(`slice:runtime:id`), not a directory under `/sys/fs/cgroup`.
-->
当运行时使用 systemd 驱动时，不要把 `info.runtimeSpec.linux.cgroupsPath` 当作文件系统路径；
该值是 systemd 单元路径（`slice:runtime:id`），不是 `/sys/fs/cgroup` 下的目录。

<!--
Expected mapping at each layer:
-->
各层的预期映射：

<!--
- Kubernetes: `spec.containers[*].resources` (desired) and
  `status.containerStatuses[*].resources` (enacted after in-place resize).
  Pod-level resources are on `spec.resources` and the parent pod slice.
- CRI (kubelet → runtime; these protobuf names stay cgroup v1-style even on
  v2): `cpu_shares`, `cpu_quota`, `cpu_period`, `memory_limit_in_bytes`, plus
  `unified` for Memory QoS. `crictl inspect` does not show these names; it
  shows the OCI spec the runtime derived from them.
- OCI spec: `linux.resources.cpu.{shares,quota,period}`,
  `linux.resources.memory.limit`, and `linux.resources.unified`. The runtime
  converts shares, quota, and period into cgroup v2 files. After upgrading
  crun or runc, the shares-to-weight formula may change; see
  [CPU weight conversion](#cpu-weight-conversion-in-newer-oci-runtimes).
- systemd scope: `CPUWeight`, `CPUQuotaPerSecUSec`, `CPUQuotaPeriodUSec`,
  `MemoryMax`. Unlimited or unset values often appear as `[not set]` or
  infinity.
- cgroupfs: `cpu.weight` (from CPU request; an unset request still yields the
  default of 2 shares), `cpu.max`, and `memory.max` on the container scope.
  Memory QoS adds `memory.high`, `memory.min`, and `memory.low`.
-->
- Kubernetes：`spec.containers[*].resources`（期望值）和
  `status.containerStatuses[*].resources`（原地调整大小之后已生效的值）。
  Pod 级别资源位于 `spec.resources` 和父级 Pod slice 上。
- CRI（kubelet → 运行时；这些 protobuf 名称即使在 v2 上仍保持 cgroup v1 风格）：
  `cpu_shares`、`cpu_quota`、`cpu_period`、`memory_limit_in_bytes`，
  以及用于 Memory QoS 的 `unified`。
  `crictl inspect` 不会显示这些名称；它显示的是运行时据此推导出的 OCI spec。
- OCI spec：`linux.resources.cpu.{shares,quota,period}`、
  `linux.resources.memory.limit` 和 `linux.resources.unified`。
  运行时把 shares、quota 和 period 转换成 cgroup v2 文件。
  升级 crun 或 runc 之后，shares 到 weight 的公式可能变化；参见
  [CPU 权重转换](#cpu-weight-conversion-in-newer-oci-runtimes)。
- systemd scope：`CPUWeight`、`CPUQuotaPerSecUSec`、`CPUQuotaPeriodUSec`、
  `MemoryMax`。无限制或未设置的值通常显示为 `[not set]` 或 infinity。
- cgroupfs：容器 scope 上的 `cpu.weight`（来自 CPU 请求；未设置请求时仍会得到默认的 2 shares）、
  `cpu.max` 和 `memory.max`。
  Memory QoS 还会增加 `memory.high`、`memory.min` 和 `memory.low`。

<!--
## Further reading
-->
## 延伸阅读

<!--
- [Kubernetes 1.31: Moving cgroup v1 Support into Maintenance Mode](/blog/2024/08/14/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/)
- [Kubernetes v1.36: Tiered Memory Protection with Memory QoS](/blog/2026/04/29/kubernetes-v1-36-memory-qos-tiered-protection/)
- [Kubernetes v1.36: PSI Metrics for Kubernetes Graduates to GA](/blog/2026/05/12/kubernetes-v1-36-psi-metrics-ga/)
- [Kubernetes 1.25: cgroup v2 graduates to GA](/blog/2022/08/31/cgroupv2-ga-1-25/)
- KubeCon NA 2022 [cgroup v2: Before You Jump In](https://www.youtube.com/watch?v=WxZK-UXKvXk) by Tony Gosselin & Mike Tougeron, Adobe Systems
- KubeCon NA 2022 [Cgroupv2 Is Coming Soon To a Cluster Near You](https://www.youtube.com/watch?v=sgyFCp1CRhA) - David Porter, Google & Mrunal Patel, RedHat
- KubeCon EU 2020 [Kubernetes On cgroup v2](https://www.youtube.com/watch?v=u8h0e84HxcE&t=783s) by Giuseppe Scrivano, Red Hat.
- This blog only covers the basic requirements and configuration of Kubernetes components.
  It will not include how to enable cgroup fs in OS distributions.
  For migration, you can refer to [migrating cgroup v2](/docs/concepts/architecture/cgroups/#migrating-cgroupv2)
-->
- [Kubernetes 1.31：对 cgroup v1 的支持转为维护模式](/zh-cn/blog/2024/08/14/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/)
- [Kubernetes v1.36：借助 Memory QoS 实现分层内存保护](/zh-cn/blog/2026/04/29/kubernetes-v1-36-memory-qos-tiered-protection/)
- [Kubernetes v1.36：Kubernetes PSI 指标升级到 GA](/zh-cn/blog/2026/05/12/kubernetes-v1-36-psi-metrics-ga/)
- [Kubernetes 1.25: cgroup v2 升级到 GA](/zh-cn/blog/2022/08/31/cgroupv2-ga-1-25/)
- KubeCon NA 2022：[cgroup v2: Before You Jump In](https://www.youtube.com/watch?v=WxZK-UXKvXk)，Tony Gosselin 与 Mike Tougeron，Adobe Systems
- KubeCon NA 2022：[Cgroupv2 Is Coming Soon To a Cluster Near You](https://www.youtube.com/watch?v=sgyFCp1CRhA)，David Porter（Google）与 Mrunal Patel（Red Hat）
- KubeCon EU 2020：[Kubernetes On cgroup v2](https://www.youtube.com/watch?v=u8h0e84HxcE&t=783s)，Giuseppe Scrivano，Red Hat
- 本文只介绍 Kubernetes 组件的基本要求和配置，不包括如何在各操作系统发行版中启用 cgroup 文件系统。
  关于迁移，可以参考[迁移到 cgroup v2](/zh-cn/docs/concepts/architecture/cgroups/#migrating-cgroupv2)。
