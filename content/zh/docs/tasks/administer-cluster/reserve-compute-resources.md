---
reviewers:
- vishh
- derekwaynecarr
- dashpole
title: 为系统守护进程预留计算资源
content_type: task
min-kubernetes-server-version: 1.8
---
<!--
---
reviewers:
- vishh
- derekwaynecarr
- dashpole
title: Reserve Compute Resources for System Daemons
content_type: task
min-kubernetes-server-version: 1.8
---
-->

<!-- overview -->
<!--
Kubernetes nodes can be scheduled to `Capacity`. Pods can consume all the
available capacity on a node by default. This is an issue because nodes
typically run quite a few system daemons that power the OS and Kubernetes
itself. Unless resources are set aside for these system daemons, pods and system
daemons compete for resources and lead to resource starvation issues on the
node.

The `kubelet` exposes a feature named `Node Allocatable` that helps to reserve
compute resources for system daemons. Kubernetes recommends cluster
administrators to configure `Node Allocatable` based on their workload density
on each node.
-->
Kubernetes 的节点可以按照 `Capacity` 调度。默认情况下 pod 能够使用节点全部可用容量。
这是个问题，因为节点自己通常运行了不少驱动 OS 和 Kubernetes 的系统守护进程。
除非为这些系统守护进程留出资源，否则它们将与 pod 争夺资源并导致节点资源短缺问题。

`kubelet` 公开了一个名为 `Node Allocatable` 的特性，有助于为系统守护进程预留计算资源。
Kubernetes 推荐集群管理员按照每个节点上的工作负载密度配置 `Node Allocatable`。

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
<!-- 
Your Kubernetes server must be at or later than version 1.17 to use
the kubelet command line option `--reserved-cpus` to set an
[explicitly reserved CPU list](#explicitly-reserved-cpu-list).
-->
您的 kubernetes 服务器版本必须至少是 1.17 版本，才能使用 kubelet 命令行选项 `--reserved-cpus` 来设置 [显式 CPU 保留列表](#explicitly-reserved-cpu-list)

<!-- steps -->

<!--
## Node Allocatable

```text
      Node Capacity
---------------------------
|     kube-reserved       |
|-------------------------|
|     system-reserved     |
|-------------------------|
|    eviction-threshold   |
|-------------------------|
|                         |
|      allocatable        |
|   (available for pods)  |
|                         |
|                         |
---------------------------
```

`Allocatable` on a Kubernetes node is defined as the amount of compute resources
that are available for pods. The scheduler does not over-subscribe
`Allocatable`. `CPU`, `memory` and `ephemeral-storage` are supported as of now.

Node Allocatable is exposed as part of `v1.Node` object in the API and as part
of `kubectl describe node` in the CLI.

Resources can be reserved for two categories of system daemons in the `kubelet`.
-->
## 可分配的节点

```text
      Node Capacity
---------------------------
|     kube-reserved       |
|-------------------------|
|     system-reserved     |
|-------------------------|
|    eviction-threshold   |
|-------------------------|
|                         |
|      allocatable        |
|   (available for pods)  |
|                         |
|                         |
---------------------------
```

Kubernetes 节点上的 `Allocatable` 被定义为 pod 可用计算资源量。调度器不会超额申请 `Allocatable`。
目前支持 `CPU`, `memory` 和 `ephemeral-storage` 这几个参数。

可分配的节点暴露为 API 中 `v1.Node` 对象的一部分，也是 CLI 中 `kubectl describe node` 的一部分。

在 `kubelet` 中，可以为两类系统守护进程预留资源。

<!--
### Enabling QoS and Pod level cgroups

To properly enforce node allocatable constraints on the node, you must
enable the new cgroup hierarchy via the `--cgroups-per-qos` flag. This flag is
enabled by default. When enabled, the `kubelet` will parent all end-user pods
under a cgroup hierarchy managed by the `kubelet`.
-->
### 启用 QoS 和 Pod 级别的 cgroups

为了恰当的在节点范围实施 node allocatable，您必须通过 `--cgroups-per-qos` 标志启用新的 cgroup 层次结构。
这个标志是默认启用的。启用后，`kubelet` 将在其管理的 cgroup 层次结构中创建所有终端用户的 Pod。

<!--
### Configuring a cgroup driver

The `kubelet` supports manipulation of the cgroup hierarchy on
the host using a cgroup driver. The driver is configured via the
`--cgroup-driver` flag.

The supported values are the following:

* `cgroupfs` is the default driver that performs direct manipulation of the
cgroup filesystem on the host in order to manage cgroup sandboxes.
* `systemd` is an alternative driver that manages cgroup sandboxes using
transient slices for resources that are supported by that init system.

Depending on the configuration of the associated container runtime,
operators may have to choose a particular cgroup driver to ensure
proper system behavior. For example, if operators use the `systemd`
cgroup driver provided by the `docker` runtime, the `kubelet` must
be configured to use the `systemd` cgroup driver.
-->
### 配置 cgroup 驱动

`kubelet` 支持在主机上使用 cgroup 驱动操作 cgroup 层次结构。驱动通过 `--cgroup-driver` 标志配置。

支持的参数值如下：

* `cgroupfs` 是默认的驱动，在主机上直接操作 cgroup 文件系统以对 cgroup 沙箱进行管理。
* `systemd` 是可选的驱动，使用 init 系统支持的资源的瞬时切片管理 cgroup 沙箱。

取决于相关容器运行时的配置，操作员可能需要选择一个特定的 cgroup 驱动来保证系统正常运行。
例如如果操作员使用 `docker` 运行时提供的 `systemd` cgroup 驱动时，必须配置 `kubelet` 使用 `systemd` cgroup 驱动。

<!--
### Kube Reserved

- **Kubelet Flag**: `--kube-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=1Gi][,][pid=1000]`
- **Kubelet Flag**: `--kube-reserved-cgroup=`

`kube-reserved` is meant to capture resource reservation for kubernetes system
daemons like the `kubelet`, `container runtime`, `node problem detector`, etc.
It is not meant to reserve resources for system daemons that are run as pods.
`kube-reserved` is typically a function of `pod density` on the nodes.

In addition to `cpu`, `memory`, and `ephemeral-storage`, `pid` may be
specified to reserve the specified number of process IDs for
kubernetes system daemons.

To optionally enforce `kube-reserved` on system daemons, specify the parent
control group for kube daemons as the value for `--kube-reserved-cgroup` kubelet
flag.

It is recommended that the kubernetes system daemons are placed under a top
level control group (`runtime.slice` on systemd machines for example). Each
system daemon should ideally run within its own child control group. Refer to
[this
doc](https://git.k8s.io/community/contributors/design-proposals/node/node-allocatable.md#recommended-cgroups-setup)
for more details on recommended control group hierarchy.

Note that Kubelet **does not** create `--kube-reserved-cgroup` if it doesn't
exist. Kubelet will fail if an invalid cgroup is specified.
-->
### Kube 预留值

- **Kubelet Flag**: `--kube-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=1Gi][,][pid=1000]`
- **Kubelet Flag**: `--kube-reserved-cgroup=`

`kube-reserved` 是为了给诸如 `kubelet`、`container runtime`、`node problem detector` 等 kubernetes 系统守护进程争取资源预留。
这并不代表要给以 pod 形式运行的系统守护进程保留资源。`kube-reserved` 通常是节点上的一个 `pod 密度` 功能。

除了 `cpu`，`内存` 和 `ephemeral-storage` 之外，`pid` 可能是指定为 kubernetes 系统守护进程预留指定数量的进程 ID。

要选择性的在系统守护进程上执行 `kube-reserved`，需要把 kubelet 的 `--kube-reserved-cgroup` 标志的值设置为 kube 守护进程的父控制组。

推荐将 kubernetes 系统守护进程放置于顶级控制组之下（例如 systemd 机器上的 `runtime.slice`）。
理想情况下每个系统守护进程都应该在其自己的子控制组中运行。
请参考[这篇文档](https://git.k8s.io/community/contributors/design-proposals/node/node-allocatable.md#recommended-cgroups-setup)，获取更过关于推荐控制组层次结构的细节。

请注意，如果 `--kube-reserved-cgroup` 不存在，Kubelet 将**不会**创建它。如果指定了一个无效的 cgroup，Kubelet 将会失败。

<!--
### System Reserved

- **Kubelet Flag**: `--system-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=1Gi][,][pid=1000]`
- **Kubelet Flag**: `--system-reserved-cgroup=`


`system-reserved` is meant to capture resource reservation for OS system daemons
like `sshd`, `udev`, etc. `system-reserved` should reserve `memory` for the
`kernel` too since `kernel` memory is not accounted to pods in Kubernetes at this time.
Reserving resources for user login sessions is also recommended (`user.slice` in
systemd world).

In addition to `cpu`, `memory`, and `ephemeral-storage`, `pid` may be
specified to reserve the specified number of process IDs for OS system
daemons.

To optionally enforce `system-reserved` on system daemons, specify the parent
control group for OS system daemons as the value for `--system-reserved-cgroup`
kubelet flag.

It is recommended that the OS system daemons are placed under a top level
control group (`system.slice` on systemd machines for example).

Note that Kubelet **does not** create `--system-reserved-cgroup` if it doesn't
exist. Kubelet will fail if an invalid cgroup is specified.
-->
### 系统预留值

- **Kubelet Flag**: `--system-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=1Gi][,][pid=1000]`
- **Kubelet Flag**: `--system-reserved-cgroup=`

`system-reserved` 用于为诸如 `sshd`、`udev` 等系统守护进程争取资源预留。
`system-reserved` 也应该为 `kernel` 预留 `内存`，因为目前 `kernel` 使用的内存并不记在 Kubernetes 的 pod 上。
同时还推荐为用户登录会话预留资源（systemd 体系中的 `user.slice`）。

除了 `cpu`，`内存` 和 `ephemeral-storage` 之外，`pid` 可能是指定为 kubernetes 系统守护进程预留指定数量的进程 ID。

要想在系统守护进程上可选地执行 `system-reserved`，请指定 `--system-reserved-cgroup` kubelet 标志的值为 OS 系统守护进程的父级控制组。

推荐将 OS 系统守护进程放在一个顶级控制组之下（例如 systemd 机器上的 `system.slice`）。

请注意，如果 `--system-reserved-cgroup` 不存在，Kubelet **不会**创建它。如果指定了无效的 cgroup，Kubelet 将会失败。

<!--
### Explicitly Reserved CPU List
-->
### 显式保留的 CPU 列表 {#explicitly-reserved-cpu-list}
{{< feature-state for_k8s_version="v1.17" state="stable" >}}

- **Kubelet Flag**: `--reserved-cpus=0-3`

<!--
`reserved-cpus` is meant to define an explicit CPU set for OS system daemons and
kubernetes system daemons. This option is added in 1.17 release. `reserved-cpus`
is for systems that do not intent to define separate top level cgroups for
OS system daemons and kubernetes system daemons with regard to cpuset resource.
If the Kubelet **does not** have `--system-reserved-cgroup` and `--kube-reserved-cgroup`,
the explicit cpuset provided by `reserved-cpus` will take precedence over the CPUs
defined by `--kube-reserved` and `--system-reserved` options.
-->
`reserved-cpus` 旨在为操作系统守护程序和 kubernetes 系统守护程序定义一个显式 cpuset。此选项在 kubernetes 1.17 版本中添加。
`reserved-cpus` 适用于不打算针对 cpuset 资源为操作系统守护程序和 kubernetes 系统守护程序定义单独的顶级 cgroups 的系统。
如果 Kubelet **没有** 指定参数 `--system-reserved-cgroup` 和 `--kube-reserved-cgroup`，则 `reserved-cpus` 提供的显式 cpuset 将优先于 `--kube-reserved` 和 `--system-reserved` 选项定义的 cpuset。

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
此选项是专门为 Telco 或 NFV 用例设计的，在这些用例中不受控制的中断或计时器可能会影响其工作负载性能。
可以使用此选项为系统或 kubernetes 守护程序以及中断或计时器定义显式的 cpuset，因此系统上的
其余 CPU 可以专门用于工作负载，而不受不受控制的中断或计时器的影响较小。
要将系统守护程序、kubernetes 守护程序和中断或计时器移动到此选项定义的显式 cpuset 上，
应使用 Kubernetes 之外的其他机制。
例如：在 Centos 系统中，可以使用 tuned 工具集来执行此操作。

<!--
### Eviction Thresholds

- **Kubelet Flag**: `--eviction-hard=[memory.available<500Mi]`

Memory pressure at the node level leads to System OOMs which affects the entire
node and all pods running on it. Nodes can go offline temporarily until memory
has been reclaimed. To avoid (or reduce the probability of) system OOMs kubelet
provides [`Out of Resource`](/docs/tasks/administer-cluster/out-of-resource/) management. Evictions are
supported for `memory` and `ephemeral-storage` only. By reserving some memory via
`--eviction-hard` flag, the `kubelet` attempts to `evict` pods whenever memory
availability on the node drops below the reserved value. Hypothetically, if
system daemons did not exist on a node, pods cannot use more than `capacity -
eviction-hard`. For this reason, resources reserved for evictions are not
available for pods.
-->
### 驱逐阈值

- **Kubelet Flag**: `--eviction-hard=[memory.available<500Mi]`

节点级别的内存压力将导致系统内存不足，这将影响到整个节点及其上运行的所有 pod。节点可以暂时离线直到内存已经回收为止。
为了防止（或减少可能性）系统内存不足，kubelet 提供了
[资源不足](/zh/docs/tasks/administer-cluster/out-of-resource/)管理。
驱逐操作只支持 `memory` 和 `ephemeral-storage`。
通过 `--eviction-hard` 标志预留一些内存后，当节点上的可用内存降至保留值以下时，`kubelet` 将尝试`驱逐` pod。
假设，如果节点上不存在系统守护进程，pod 将不能使用超过 `capacity-eviction-hard` 的资源。因此，为驱逐而预留的资源对 pod 是不可用的。

<!--
### Enforcing Node Allocatable

- **Kubelet Flag**: `--enforce-node-allocatable=pods[,][system-reserved][,][kube-reserved]`

The scheduler treats `Allocatable` as the available `capacity` for pods.

`kubelet` enforce `Allocatable` across pods by default. Enforcement is performed
by evicting pods whenever the overall usage across all pods exceeds
`Allocatable`. More details on eviction policy can be found
[here](/docs/tasks/administer-cluster/out-of-resource/#eviction-policy). This enforcement is controlled by
specifying `pods` value to the kubelet flag `--enforce-node-allocatable`.


Optionally, `kubelet` can be made to enforce `kube-reserved` and
`system-reserved` by specifying `kube-reserved` & `system-reserved` values in
the same flag. Note that to enforce `kube-reserved` or `system-reserved`,
`--kube-reserved-cgroup` or `--system-reserved-cgroup` needs to be specified
respectively.
-->
### 执行节点分配

- **Kubelet Flag**: `--enforce-node-allocatable=pods[,][system-reserved][,][kube-reserved]`

调度器将 `Allocatable` 按 pod 的可用 `capacity` 对待。

`kubelet` 默认在 Pod 中执行 `Allocatable`。无论何时，如果所有 pod 的总用量超过了 `Allocatable`，
驱逐 pod 的措施将被执行。有关驱逐策略的更多细节可以在
[这里](/zh/docs/tasks/administer-cluster/out-of-resource/#eviction-policy).找到。
请通过设置 kubelet `--enforce-node-allocatable` 标志值为 `pods` 控制这个措施。

可选的，通过在相同标志中同时指定 `kube-reserved` 和 `system-reserved` 值能够使 `kubelet` 
执行 `kube-reserved` 和 `system-reserved`。请注意，要想执行 `kube-reserved` 或者 `system-reserved` 时，
需要分别指定 `--kube-reserved-cgroup` 或者 `--system-reserved-cgroup`。

<!--
## General Guidelines

System daemons are expected to be treated similar to `Guaranteed` pods. System
daemons can burst within their bounding control groups and this behavior needs
to be managed as part of kubernetes deployments. For example, `kubelet` should
have its own control group and share `Kube-reserved` resources with the
container runtime. However, Kubelet cannot burst and use up all available Node
resources if `kube-reserved` is enforced.

Be extra careful while enforcing `system-reserved` reservation since it can lead
to critical system services being CPU starved, OOM killed, or unable
to fork on the node. The
recommendation is to enforce `system-reserved` only if a user has profiled their
nodes exhaustively to come up with precise estimates and is confident in their
ability to recover if any process in that group is oom_killed.

* To begin with enforce `Allocatable` on `pods`.
* Once adequate monitoring and alerting is in place to track kube system
  daemons, attempt to enforce `kube-reserved` based on usage heuristics.
* If absolutely necessary, enforce `system-reserved` over time.

The resource requirements of kube system daemons may grow over time as more and
more features are added. Over time, kubernetes project will attempt to bring
down utilization of node system daemons, but that is not a priority as of now.
So expect a drop in `Allocatable` capacity in future releases.
-->
## 一般原则

系统守护进程期望被按照类似 `Guaranteed` pod 一样对待。系统守护进程可以在其范围控制组中爆发式增长，
您需要将这个行为作为 kubernetes 部署的一部分进行管理。
例如，`kubelet` 应该有它自己的控制组并和容器运行时共享 `Kube-reserved` 资源。
然而，如果执行了 `kube-reserved`，则 kubelet 不能突然爆发并耗尽节点的所有可用资源。

在执行 `system-reserved` 预留操作时请加倍小心，因为它可能导致节点上的关键系统服务 CPU 资源短缺
或因为内存不足而被终止。
建议只有当用户详尽地描述了他们的节点以得出精确的估计时才强制执行 `system-reserved`，
并且如果该组中的任何进程都是 oom_killed，则对他们恢复的能力充满信心。

* 在 `pods` 上执行 `Allocatable` 作为开始。
* 一旦足够用于追踪系统守护进程的监控和告警的机制到位，请尝试基于用量探索方式执行 `kube-reserved`。
* 随着时间推进，如果绝对必要，可以执行 `system-reserved`。

随着时间的增长以及越来越多特性的加入，kube 系统守护进程对资源的需求可能也会增加。
以后 kubernetes 项目将尝试减少对节点系统守护进程的利用，但目前那并不是优先事项。
所以，请期待在将来的发布中将 `Allocatable` 容量降低。



<!-- discussion -->

<!--
## Example Scenario

Here is an example to illustrate Node Allocatable computation:

* Node has `32Gi` of `memory`, `16 CPUs` and `100Gi` of `Storage`
* `--kube-reserved` is set to `cpu=1,memory=2Gi,ephemeral-storage=1Gi`
* `--system-reserved` is set to `cpu=500m,memory=1Gi,ephemeral-storage=1Gi`
* `--eviction-hard` is set to `memory.available<500Mi,nodefs.available<10%`

Under this scenario, `Allocatable` will be `14.5 CPUs`, `28.5Gi` of memory and
`88Gi` of local storage.
Scheduler ensures that the total memory `requests` across all pods on this node does
not exceed `28.5Gi` and storage doesn't exceed `88Gi`.
Kubelet evicts pods whenever the overall memory usage across pods exceeds `28.5Gi`,
or if overall disk usage exceeds `88Gi` If all processes on the node consume as
much CPU as they can, pods together cannot consume more than `14.5 CPUs`.

If `kube-reserved` and/or `system-reserved` is not enforced and system daemons
exceed their reservation, `kubelet` evicts pods whenever the overall node memory
usage is higher than `31.5Gi` or `storage` is greater than `90Gi`
-->
## 示例场景

这是一个用于说明节点分配计算方式的示例：

* 节点拥有 `32Gi 内存`，`16 核 CPU` 和 `100Gi 存储`
* `--kube-reserved` 设置为 `cpu=1,memory=2Gi,ephemeral-storage=1Gi`
* `--system-reserved` 设置为 `cpu=500m,memory=1Gi,ephemeral-storage=1Gi`
* `--eviction-hard` 设置为 `memory.available<500Mi,nodefs.available<10%`

在这个场景下，`Allocatable` 将会是 `14.5 CPUs`、`28.5Gi` 内存以及 `88Gi` 本地存储。
调度器保证这个节点上的所有 pod `请求`的内存总量不超过 `28.5Gi`，存储不超过 `88Gi`。
当 pod 的内存使用总量超过 `28.5Gi` 或者磁盘使用总量超过 `88Gi` 时，Kubelet 将会驱逐它们。
如果节点上的所有进程都尽可能多的使用 CPU，则 pod 加起来不能使用超过 `14.5 CPUs` 的资源。

当没有执行 `kube-reserved` 和/或 `system-reserved` 且系统守护进程使用量超过其预留时，
如果节点内存用量高于 `31.5Gi` 或`存储`大于 `90Gi`，kubelet 将会驱逐 pod。
