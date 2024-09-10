---
title: 为系统守护进程预留计算资源
content_type: task
weight: 290
---
<!--
reviewers:
- vishh
- derekwaynecarr
- dashpole
title: Reserve Compute Resources for System Daemons
content_type: task
weight: 290
-->

<!-- overview -->
<!--
Kubernetes nodes can be scheduled to `Capacity`. Pods can consume all the
available capacity on a node by default. This is an issue because nodes
typically run quite a few system daemons that power the OS and Kubernetes
itself. Unless resources are set aside for these system daemons, pods and system
daemons compete for resources and lead to resource starvation issues on the
node.

The `kubelet` exposes a feature named 'Node Allocatable' that helps to reserve
compute resources for system daemons. Kubernetes recommends cluster
administrators to configure 'Node Allocatable' based on their workload density
on each node.
-->
Kubernetes 的节点可以按照 `Capacity` 调度。默认情况下 pod 能够使用节点全部可用容量。
这是个问题，因为节点自己通常运行了不少驱动 OS 和 Kubernetes 的系统守护进程。
除非为这些系统守护进程留出资源，否则它们将与 Pod 争夺资源并导致节点资源短缺问题。

`kubelet` 公开了一个名为 'Node Allocatable' 的特性，有助于为系统守护进程预留计算资源。
Kubernetes 推荐集群管理员按照每个节点上的工作负载密度配置 'Node Allocatable'。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- 
You can configure below kubelet [configuration settings](/docs/reference/config-api/kubelet-config.v1beta1/)
using the [kubelet configuration file](/docs/tasks/administer-cluster/kubelet-config-file/).
-->
你可以使用 [kubelet 配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)来配置以下
kubelet [设置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)。

<!-- steps -->

<!--
## Node Allocatable

![node capacity](/images/docs/node-capacity.svg)

'Allocatable' on a Kubernetes node is defined as the amount of compute resources
that are available for pods. The scheduler does not over-subscribe
'Allocatable'. 'CPU', 'memory' and 'ephemeral-storage' are supported as of now.

Node Allocatable is exposed as part of `v1.Node` object in the API and as part
of `kubectl describe node` in the CLI.

Resources can be reserved for two categories of system daemons in the `kubelet`.
-->
## 节点可分配资源   {#node-allocatable}

![节点容量](/images/docs/node-capacity.svg)

Kubernetes 节点上的 'Allocatable' 被定义为 Pod 可用计算资源量。
调度器不会超额申请 'Allocatable'。
目前支持 'CPU'、'memory' 和 'ephemeral-storage' 这几个参数。

可分配的节点暴露为 API 中 `v1.Node` 对象的一部分，也是 CLI 中
`kubectl describe node` 的一部分。

在 `kubelet` 中，可以为两类系统守护进程预留资源。

<!--
### Enabling QoS and Pod level cgroups

To properly enforce node allocatable constraints on the node, you must
enable the new cgroup hierarchy via the `cgroupsPerQOS` setting. This setting is
enabled by default. When enabled, the `kubelet` will parent all end-user pods
under a cgroup hierarchy managed by the `kubelet`.
-->
### 启用 QoS 和 Pod 级别的 cgroups  {#enabling-qos-and-pod-level-cgroups}

为了恰当地在节点范围实施节点可分配约束，你必须通过 `cgroupsPerQOS`
设置启用新的 cgroup 层次结构。这个设置是默认启用的。
启用后，`kubelet` 将在其管理的 cgroup 层次结构中创建所有终端用户的 Pod。

<!--
### Configuring a cgroup driver

The `kubelet` supports manipulation of the cgroup hierarchy on
the host using a cgroup driver. The driver is configured via the `cgroupDriver` setting.

The supported values are the following:

* `cgroupfs` is the default driver that performs direct manipulation of the
cgroup filesystem on the host in order to manage cgroup sandboxes.
* `systemd` is an alternative driver that manages cgroup sandboxes using
transient slices for resources that are supported by that init system.

Depending on the configuration of the associated container runtime,
operators may have to choose a particular cgroup driver to ensure
proper system behavior. For example, if operators use the `systemd`
cgroup driver provided by the `containerd` runtime, the `kubelet` must
be configured to use the `systemd` cgroup driver.
-->
### 配置 cgroup 驱动  {#configuring-a-cgroup-driver}

`kubelet` 支持在主机上使用 cgroup 驱动操作 cgroup 层次结构。
该驱动通过 `cgroupDriver` 设置进行配置。

支持的参数值如下：

* `cgroupfs` 是默认的驱动，在主机上直接操作 cgroup 文件系统以对 cgroup
  沙箱进行管理。
* `systemd` 是可选的驱动，使用 init 系统支持的资源的瞬时切片管理
  cgroup 沙箱。

取决于相关容器运行时的配置，操作员可能需要选择一个特定的 cgroup 驱动来保证系统正常运行。
例如，如果操作员使用 `containerd` 运行时提供的 `systemd` cgroup 驱动时，
必须配置 `kubelet` 使用 `systemd` cgroup 驱动。

<!--
### Kube Reserved

- **KubeletConfiguration Setting**: `kubeReserved: {}`. Example value `{cpu: 100m, memory: 100Mi, ephemeral-storage: 1Gi, pid=1000}`
- **KubeletConfiguration Setting**: `kubeReservedCgroup: ""`

`kubeReserved` is meant to capture resource reservation for kubernetes system
daemons like the `kubelet`, `container runtime`, etc.
It is not meant to reserve resources for system daemons that are run as pods.
`kubeReserved` is typically a function of `pod density` on the nodes.

In addition to `cpu`, `memory`, and `ephemeral-storage`, `pid` may be
specified to reserve the specified number of process IDs for
kubernetes system daemons.
-->
### Kube 预留值  {#kube-reserved}

- **KubeletConfiguration 设置**：`kubeReserved: {}`。
  示例值 `{cpu: 100m, memory: 100Mi, ephemeral-storage: 1Gi, pid=1000}`
- **KubeletConfiguration 设置**：`kubeReservedCgroup: ""`

`kubeReserved` 用来给诸如 `kubelet`、容器运行时等
Kubernetes 系统守护进程记述其资源预留值。
该配置并非用来给以 Pod 形式运行的系统守护进程预留资源。`kubeReserved`
通常是节点上 `Pod 密度` 的函数。

除了 `cpu`、`内存` 和 `ephemeral-storage` 之外，`pid` 可用来指定为
Kubernetes 系统守护进程预留指定数量的进程 ID。

<!--
To optionally enforce `kubeReserved` on kubernetes system daemons, specify the parent
control group for kube daemons as the value for `kubeReservedCgroup` setting,
and [add `kube-reserved` to `enforceNodeAllocatable`](#enforcing-node-allocatable).

It is recommended that the kubernetes system daemons are placed under a top
level control group (`runtime.slice` on systemd machines for example). Each
system daemon should ideally run within its own child control group. Refer to
[the design proposal](https://git.k8s.io/design-proposals-archive/node/node-allocatable.md#recommended-cgroups-setup)
for more details on recommended control group hierarchy.
-->
要选择性地对 Kubernetes 系统守护进程上执行 `kubeReserved` 保护，需要把 kubelet 的
`kubeReservedCgroup` 设置的值设为 kube 守护进程的父控制组，
并[将 `kube-reserved` 添加到 `enforceNodeAllocatable`](#enforcing-node-allocatable)。

推荐将 Kubernetes 系统守护进程放置于顶级控制组之下（例如 systemd 机器上的 `runtime.slice`）。
理想情况下每个系统守护进程都应该在其自己的子控制组中运行。
请参考[这个设计方案](https://git.k8s.io/design-proposals-archive/node/node-allocatable.md#recommended-cgroups-setup)，
进一步了解关于推荐控制组层次结构的细节。

<!--
Note that Kubelet **does not** create `kubeReservedCgroup` if it doesn't
exist. The kubelet will fail to start if an invalid cgroup is specified. With `systemd`
cgroup driver, you should follow a specific pattern for the name of the cgroup you
define: the name should be the value you set for `kubeReservedCgroup`,
with `.slice` appended.
-->
请注意，如果 `kubeReservedCgroup` 不存在，Kubelet 将 **不会** 创建它。
如果指定了一个无效的 cgroup，Kubelet 将会无法启动。就 `systemd` cgroup 驱动而言，
你要为所定义的 cgroup 设置名称时要遵循特定的模式：
所设置的名字应该是你为 `kubeReservedCgroup` 所给的参数值加上 `.slice` 后缀。

<!--
### System Reserved

- **KubeletConfiguration Setting**: `systemReserved: {}`. Example value `{cpu: 100m, memory: 100Mi, ephemeral-storage: 1Gi, pid=1000}`
- **KubeletConfiguration Setting**: `systemReservedCgroup: ""`
-->
### 系统预留值  {#system-reserved}

- **KubeletConfiguration 设置**：`systemReserved: {}`。
  示例值 `{cpu: 100m, memory: 100Mi, ephemeral-storage: 1Gi, pid=1000}`
- **KubeletConfiguration 设置**：`systemReservedCgroup: ""`

<!--
`systemReserved` is meant to capture resource reservation for OS system daemons
like `sshd`, `udev`, etc. `systemReserved` should reserve `memory` for the
`kernel` too since `kernel` memory is not accounted to pods in Kubernetes at this time.
Reserving resources for user login sessions is also recommended (`user.slice` in
systemd world).

In addition to `cpu`, `memory`, and `ephemeral-storage`, `pid` may be
specified to reserve the specified number of process IDs for OS system
daemons.
-->
`systemReserved` 用于为诸如 `sshd`、`udev` 等系统守护进程记述其资源预留值。
`systemReserved` 也应该为 `kernel` 预留 `内存`，因为目前 `kernel`
使用的内存并不记在 Kubernetes 的 Pod 上。
同时还推荐为用户登录会话预留资源（systemd 体系中的 `user.slice`）。

除了 `cpu`、`内存` 和 `ephemeral-storage` 之外，`pid` 可用来指定为
Kubernetes 系统守护进程预留指定数量的进程 ID。

<!--
To optionally enforce `systemReserved` on system daemons, specify the parent
control group for OS system daemons as the value for `systemReservedCgroup` setting,
and [add `system-reserved` to `enforceNodeAllocatable`](#enforcing-node-allocatable).

It is recommended that the OS system daemons are placed under a top level
control group (`system.slice` on systemd machines for example).
-->
要想为系统守护进程上可选地实施 `systemReserved` 约束，请指定 kubelet 的
`systemReservedCgroup` 设置值为 OS 系统守护进程的父级控制组，
并[将 `system-reserved` 添加到 `enforceNodeAllocatable`](#enforcing-node-allocatable)。

推荐将 OS 系统守护进程放在一个顶级控制组之下（例如 systemd 机器上的
`system.slice`）。

<!--
Note that `kubelet` **does not** create `systemReservedCgroup` if it doesn't
exist. `kubelet` will fail if an invalid cgroup is specified.  With `systemd`
cgroup driver, you should follow a specific pattern for the name of the cgroup you
define: the name should be the value you set for `systemReservedCgroup`,
with `.slice` appended.
-->
请注意，如果 `systemReservedCgroup` 不存在，`kubelet` **不会** 创建它。
如果指定了无效的 cgroup，`kubelet` 将会失败。就 `systemd` cgroup 驱动而言，
你在指定 cgroup 名字时要遵循特定的模式：
该名字应该是你为 `systemReservedCgroup` 参数所设置的值加上 `.slice` 后缀。

<!--
### Explicitly Reserved CPU List
-->
### 显式预留的 CPU 列表 {#explicitly-reserved-cpu-list}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

<!--
**KubeletConfiguration Setting**: `reservedSystemCPUs:`. Example value `0-3`
-->
**KubeletConfiguration 设置**：`reservedSystemCPUs:`。示例值 `0-3`

<!--
`reservedSystemCPUs` is meant to define an explicit CPU set for OS system daemons and
kubernetes system daemons. `reservedSystemCPUs` is for systems that do not intend to
define separate top level cgroups for OS system daemons and kubernetes system daemons
with regard to cpuset resource.
If the Kubelet **does not** have `kubeReservedCgroup` and `systemReservedCgroup`,
the explicit cpuset provided by `reservedSystemCPUs` will take precedence over the CPUs
defined by `kubeReservedCgroup` and `systemReservedCgroup` options.
-->
`reservedSystemCPUs` 旨在为操作系统守护程序和 Kubernetes 系统守护程序预留一组明确指定编号的 CPU。
`reservedSystemCPUs` 适用于不打算针对 cpuset 资源为操作系统守护程序和 Kubernetes
系统守护程序定义独立的顶级 cgroups 的系统。
如果 Kubelet **没有** 指定参数 `kubeReservedCgroup` 和 `systemReservedCgroup`，
则 `reservedSystemCPUs` 的设置将优先于 `kubeReservedCgroup` 和 `systemReservedCgroup` 选项。

<!--
This option is specifically designed for Telco/NFV use cases where uncontrolled
interrupts/timers may impact the workload performance. you can use this option
to define the explicit cpuset for the system/kubernetes daemons as well as the
interrupts/timers, so the rest CPUs on the system can be used exclusively for
workloads, with less impact from uncontrolled interrupts/timers. To move the
system daemon, kubernetes daemons and interrupts/timers to the explicit cpuset
defined by this option, other mechanism outside Kubernetes should be used.
For example: in Centos, you can do this using the tuned toolset.
-->
此选项是专门为电信/NFV 用例设计的，在这些用例中不受控制的中断或计时器可能会影响其工作负载性能。
你可以使用此选项为系统或 Kubernetes 守护程序以及中断或计时器显式定义 cpuset，
这样系统上的其余 CPU 可以专门用于工作负载，因不受控制的中断或计时器的影响得以降低。
要将系统守护程序、Kubernetes 守护程序和中断或计时器移动到此选项定义的显式
cpuset 上，应使用 Kubernetes 之外的其他机制。
例如：在 CentOS 系统中，可以使用 tuned 工具集来执行此操作。

<!--
### Eviction Thresholds

**KubeletConfiguration Setting**: `evictionHard: {memory.available: "100Mi", nodefs.available: "10%", nodefs.inodesFree: "5%", imagefs.available: "15%"}`. Example value: `{memory.available: "<500Mi"}`

Memory pressure at the node level leads to System OOMs which affects the entire
node and all pods running on it. Nodes can go offline temporarily until memory
has been reclaimed. To avoid (or reduce the probability of) system OOMs kubelet
provides [out of resource](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
management. Evictions are
supported for `memory` and `ephemeral-storage` only. By reserving some memory via
`evictionHard` setting, the `kubelet` attempts to evict pods whenever memory
availability on the node drops below the reserved value. Hypothetically, if
system daemons did not exist on a node, pods cannot use more than `capacity -
eviction-hard`. For this reason, resources reserved for evictions are not
available for pods.
-->
### 驱逐阈值   {#eviction-Thresholds}

**KubeletConfiguration 设置**：
`evictionHard: {memory.available: "100Mi", nodefs.available: "10%", nodefs.inodesFree: "5%", imagefs.available: "15%"}`。
示例值: `{memory.available: "<500Mi"}`

节点级别的内存压力将导致系统内存不足，这将影响到整个节点及其上运行的所有 Pod。
节点可以暂时离线直到内存已经回收为止。为了防止系统内存不足（或减少系统内存不足的可能性），
kubelet 提供了[资源不足](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)管理。
驱逐操作只支持 `memory` 和 `ephemeral-storage`。
通过 `evictionHard` 设置预留一些内存后，当节点上的可用内存降至预留值以下时，
`kubelet` 将尝试驱逐 Pod。
如果节点上不存在系统守护进程，Pod 将不能使用超过 `capacity-eviction-hard` 所指定的资源量。
因此，为驱逐而预留的资源对 Pod 是不可用的。

<!--
### Enforcing Node Allocatable

**KubeletConfiguration setting**: `enforceNodeAllocatable: [pods]`. Example value: `[pods,system-reserved,kube-reserved]`

The scheduler treats 'Allocatable' as the available `capacity` for pods.
-->
### 实施节点可分配约束   {#enforcing-node-allocatable}

**KubeletConfiguration 设置**：`enforceNodeAllocatable: [pods]`。
示例值：`[pods,system-reserved,kube-reserved]`

调度器将 'Allocatable' 视为 Pod 可用的 `capacity`（资源容量）。

<!--
`kubelet` enforce 'Allocatable' across pods by default. Enforcement is performed
by evicting pods whenever the overall usage across all pods exceeds
'Allocatable'. More details on eviction policy can be found
on the [node pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
page. This enforcement is controlled by
specifying `pods` value to the KubeletConfiguration setting `enforceNodeAllocatable`.
-->
`kubelet` 默认对 Pod 执行 'Allocatable' 约束。
无论何时，如果所有 Pod 的总用量超过了 'Allocatable'，驱逐 Pod 的措施将被执行。
有关驱逐策略的更多细节可以在[节点压力驱逐](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)页找到。
可将 KubeletConfiguration `enforceNodeAllocatable` 设置为 `pods` 值来控制这个措施。

<!--
Optionally, `kubelet` can be made to enforce `kubeReserved` and
`systemReserved` by specifying `kube-reserved` & `system-reserved` values in
the same setting. Note that to enforce `kubeReserved` or `systemReserved`,
`kubeReservedCgroup` or `systemReservedCgroup` needs to be specified
respectively.
-->
可选地，通过在同一设置中同时指定 `kube-reserved` 和 `system-reserved` 值，
可以使 `kubelet` 强制实施 `kubeReserved` 和 `systemReserved` 约束。
请注意，要想执行 `kubeReserved` 或者 `systemReserved` 约束，
需要对应设置 `kubeReservedCgroup` 或者 `systemReservedCgroup`。

<!--
## General Guidelines

System daemons are expected to be treated similar to
[Guaranteed pods](/docs/tasks/configure-pod-container/quality-service-pod/#create-a-pod-that-gets-assigned-a-qos-class-of-guaranteed).
System daemons can burst within their bounding control groups and this behavior needs
to be managed as part of kubernetes deployments. For example, `kubelet` should
have its own control group and share `kubeReserved` resources with the
container runtime. However, Kubelet cannot burst and use up all available Node
resources if `kubeReserved` is enforced.
-->
## 一般原则   {#general-guidelines}

系统守护进程一般会被按照类似
[Guaranteed 的 Pod](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/#create-a-pod-that-gets-assigned-a-qos-class-of-guaranteed)
一样对待。
系统守护进程可以在与其对应的控制组中出现突发资源用量，这一行为要作为 Kubernetes 部署的一部分进行管理。
例如，`kubelet` 应该有它自己的控制组并和容器运行时共享 `kubeReserved` 资源。
不过，如果执行了 `kubeReserved` 约束，则 kubelet 不可出现突发负载并用光节点的所有可用资源。

<!--
Be extra careful while enforcing `systemReserved` reservation since it can lead
to critical system services being CPU starved, OOM killed, or unable
to fork on the node. The
recommendation is to enforce `systemReserved` only if a user has profiled their
nodes exhaustively to come up with precise estimates and is confident in their
ability to recover if any process in that group is oom-killed.
-->
在执行 `systemReserved` 预留策略时请加倍小心，因为它可能导致节点上的关键系统服务出现 CPU 资源短缺、
因为内存不足而被终止或者无法在节点上创建进程。
建议只有当用户详尽地描述了他们的节点以得出精确的估计值，
并且对该组中进程因内存不足而被杀死时，有足够的信心将其恢复时，
才可以强制执行 `systemReserved` 策略。

<!--
* To begin with enforce 'Allocatable' on `pods`.
* Once adequate monitoring and alerting is in place to track kube system
  daemons, attempt to enforce `kubeReserved` based on usage heuristics.
* If absolutely necessary, enforce `systemReserved` over time.
-->
* 作为起步，可以先针对 `pods` 上执行 'Allocatable' 约束。
* 一旦用于追踪系统守护进程的监控和告警的机制到位，可尝试基于用量估计的方式执行 `kubeReserved` 策略。
* 随着时间推进，在绝对必要的时候可以执行 `systemReserved` 策略。

<!--
The resource requirements of kube system daemons may grow over time as more and
more features are added. Over time, kubernetes project will attempt to bring
down utilization of node system daemons, but that is not a priority as of now.
So expect a drop in `Allocatable` capacity in future releases.
-->
随着时间推进和越来越多特性被加入，kube 系统守护进程对资源的需求可能也会增加。
以后 Kubernetes 项目将尝试减少对节点系统守护进程的利用，但目前这件事的优先级并不是最高。
所以，将来的发布版本中 `Allocatable` 容量是有可能降低的。

<!-- discussion -->

<!--
## Example Scenario

Here is an example to illustrate Node Allocatable computation:

* Node has `32Gi` of `memory`, `16 CPUs` and `100Gi` of `Storage`
* `kubeReserved` is set to `{cpu: 1000m, memory: 2Gi, ephemeral-storage: 1Gi}`
* `systemReserved` is set to `{cpu: 500m, memory: 1Gi, ephemeral-storage: 1Gi}`
* `evictionHard` is set to `{memory.available: "<500Mi", nodefs.available: "<10%"}`
-->
## 示例场景   {#example-scenario}

这是一个用于说明节点可分配（Node Allocatable）计算方式的示例：

* 节点拥有 `32Gi` `memory`、`16 CPU` 和 `100Gi` `Storage` 资源
* `kubeReserved` 被设置为 `{cpu: 1000m, memory: 2Gi, ephemeral-storage: 1Gi}`
* `systemReserved` 被设置为 `{cpu: 500m, memory: 1Gi, ephemeral-storage: 1Gi}`
* `evictionHard` 被设置为 `{memory.available: "<500Mi", nodefs.available: "<10%"}`

<!--
Under this scenario, 'Allocatable' will be 14.5 CPUs, 28.5Gi of memory and
`88Gi` of local storage.
Scheduler ensures that the total memory `requests` across all pods on this node does
not exceed 28.5Gi and storage doesn't exceed 88Gi.
Kubelet evicts pods whenever the overall memory usage across pods exceeds 28.5Gi,
or if overall disk usage exceeds 88Gi. If all processes on the node consume as
much CPU as they can, pods together cannot consume more than 14.5 CPUs.
-->
在这个场景下，'Allocatable' 将会是 14.5 CPUs、28.5Gi 内存以及 `88Gi` 本地存储。
调度器保证这个节点上的所有 Pod 的内存 `requests` 总量不超过 28.5Gi，存储不超过 '88Gi'。
当 Pod 的内存使用总量超过 28.5Gi 或者磁盘使用总量超过 88Gi 时，kubelet 将会驱逐它们。
如果节点上的所有进程都尽可能多地使用 CPU，则 Pod 加起来不能使用超过 14.5 CPUs 的资源。

<!--
If `kubeReserved` and/or `systemReserved` is not enforced and system daemons
exceed their reservation, `kubelet` evicts pods whenever the overall node memory
usage is higher than 31.5Gi or `storage` is greater than 90Gi.
-->
当没有执行 `kubeReserved` 和/或 `systemReserved` 策略且系统守护进程使用量超过其预留时，
如果节点内存用量高于 31.5Gi 或 `storage` 大于 90Gi，kubelet 将会驱逐 Pod。
