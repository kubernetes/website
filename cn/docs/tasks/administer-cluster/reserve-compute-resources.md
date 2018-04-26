---
approvers:
- vishh
- derekwaynecarr
- dashpole
cn-approvers:
- xiaosuiba
cn-reviewers:
- zjj2wry
- zhangqx2010
title: 为系统守护进程预留计算资源
---
<!--

---
approvers:
- vishh
- derekwaynecarr
- dashpole
  title: Reserve Compute Resources for System Daemons
---

-->

* TOC
{:toc}

<!--
Kubernetes nodes can be scheduled to `Capacity`. Pods can consume all the
available capacity on a node by default. This is an issue because nodes
typically run quite a few system daemons that power the OS and Kubernetes
itself. Unless resources are set aside for these system daemons, pods and system
daemons compete for resources and lead to resource starvation issues on the
node.
-->
Kubernetes 的节点可以按照 `Capacity` 调度。默认情况下 pod 能够使用节点全部可用容量。这是个问题，因为节点自己通常运行了不少驱动 OS 和 Kubernetes 的系统守护进程（system daemons）。除非为这些系统守护进程留出资源，否则它们将与 pod 争夺资源并导致节点资源短缺问题。

<!--
The `kubelet` exposes a feature named `Node Allocatable` that helps to reserve
compute resources for system daemons. Kubernetes recommends cluster
administrators to configure `Node Allocatable` based on their workload density
on each node.
-->
`kubelet` 公开了一个名为 `Node Allocatable` 的特性，有助于为系统守护进程预留计算资源。Kubernetes 推荐集群管理员按照每个节点上的工作负载密度配置 `Node Allocatable`。

<!--
## Node Allocatable
-->
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

<!--
`Allocatable` on a Kubernetes node is defined as the amount of compute resources
that are available for pods. The scheduler does not over-subscribe
`Allocatable`. `CPU`, `memory` and `storage` are supported as of now.
-->
Kubernetes 节点上的 `Allocatable` 被定义为 pod 可用计算资源量。调度器不会超额申请  `Allocatable`。目前支持 `CPU`, `memory` 和 `storage` 这几个参数。

<!--
Node Allocatable is exposed as part of `v1.Node` object in the API and as part
of `kubectl describe node` in the CLI.
-->
Node Allocatable 暴露为 API 中 `v1.Node` 对象的一部分，也是 CLI 中 `kubectl describe node` 的一部分。

<!--
Resources can be reserved for two categories of system daemons in the `kubelet`.
-->
在 `kubelet` 中，可以为两类系统守护进程预留资源。

<!--
### Enabling QoS and Pod level cgroups
-->
### 启用 QoS 和 Pod 级别的 cgroups

<!--
To properly enforce node allocatable constraints on the node, you must
enable the new cgroup hierarchy via the `--cgroups-per-qos` flag.  This flag is
enabled by default.  When enabled, the `kubelet` will parent all end-user pods
under a cgroup hierarchy managed by the `kubelet`.
-->
为了恰当的在节点范围实施 node allocatable，您必须通过 `--cgroups-per-qos` 标志启用新的 cgroup 层次结构。这个标志是默认启用的。启用后，`kubelet` 将在其管理的 cgroup 层次结构中创建所有终端用户的 pod。

<!--
### Configuring a cgroup driver
-->
### 配置 cgroup 驱动

<!--
The `kubelet` supports manipulation of the cgroup hierarchy on
the host using a cgroup driver. The driver is configured via the
`--cgroup-driver` flag.
-->
`kubelet` 支持在主机上使用 cgroup 驱动操作 cgroup 层次结构。驱动通过 `--cgroup-driver` 标志配置。

<!--
The supported values are the following:

* `cgroupfs` is the default driver that performs direct manipulation of the
  cgroup filesystem on the host in order to manage cgroup sandboxes.
* `systemd` is an alternative driver that manages cgroup sandboxes using
  transient slices for resources that are supported by that init system.
  -->
支持的参数值如下：

* `cgroupfs` 是默认的驱动，在主机上直接操作 cgroup 文件系统以对 cgroup 沙箱进行管理。
* `systemd` 是可选的驱动，使用 init 系统支持的资源的瞬时切片管理 cgroup 沙箱。

<!--
Depending on the configuration of the associated container runtime,
operators may have to choose a particular cgroup driver to ensure
proper system behavior.  For example, if operators use the `systemd`
cgroup driver provided by the `docker` runtime, the `kubelet` must
be configured to use the `systemd` cgroup driver.
-->
取决于相关容器运行时（container runtime）的配置，操作员可能需要选择一个特定的 cgroup 驱动来保证系统正常运行。例如如果操作员使用 `docker` 运行时提供的 cgroup 驱动时，必须配置 `kubelet` 使用 `systemd` cgroup 驱动。

<!--
### Kube Reserved
-->
### Kube Reserved

- **Kubelet Flag**: `--kube-reserved=[cpu=100m][,][memory=100Mi][,][storage=1Gi]`
- **Kubelet Flag**: `--kube-reserved-cgroup=`

<!--
`kube-reserved` is meant to capture resource reservation for kubernetes system
daemons like the `kubelet`, `container runtime`, `node problem detector`, etc.
It is not meant to reserve resources for system daemons that are run as pods.
`kube-reserved` is typically a function of `pod density` on the nodes. [This
performance dashboard](http://node-perf-dash.k8s.io/#/builds) exposes `cpu` and
`memory` usage profiles of `kubelet` and `docker engine` at multiple levels of
pod density. [This blog
post](http://blog.kubernetes.io/2016/11/visualize-kubelet-performance-with-node-dashboard.html)
explains how the dashboard can be interpreted to come up with a suitable
`kube-reserved` reservation.
-->
`kube-reserved` 是为了给诸如 `kubelet`、`container runtime`、`node problem detector` 等 kubernetes 系统守护进程争取资源预留。这并不代表要给以 pod 形式运行的系统守护进程保留资源。`kube-reserved` 通常是节点上的一个 `pod 密度（pod density）` 功能。 [这个性能仪表盘](http://node-perf-dash.k8s.io/#/builds) 从 pod 密度的多个层面展示了 `kubelet` 和 `docker engine` 的 `cpu` 和 `memory` 使用情况。

<!--
To optionally enforce `kube-reserved` on system daemons, specify the parent
control group for kube daemons as the value for `--kube-reserved-cgroup` kubelet
flag.
-->
要选择性的在系统守护进程上执行 `kube-reserved`，需要把  kubelet 的 `--kube-reserved-cgroup` 标志的值设置为 kube 守护进程的父控制组。

<!--
It is recommended that the kubernetes system daemons are placed under a top
level control group (`runtime.slice` on systemd machines for example). Each
system daemon should ideally run within its own child control group. Refer to
[this
doc](https://git.k8s.io/community/contributors/design-proposals/node-allocatable.md#recommended-cgroups-setup)
for more details on recommended control group hierarchy.
-->
推荐将 kubernetes 系统守护进程放置于顶级控制组之下（例如 systemd 机器上的 `runtime.slice`）。理想情况下每个系统守护进程都应该在其自己的子控制组中运行。请参考[这篇文档](https://git.k8s.io/community/contributors/design-proposals/node-allocatable.md#recommended-cgroups-setup)，获取更过关于推荐控制组层次结构的细节。

<!--
Note that Kubelet **does not** create `--kube-reserved-cgroup` if it doesn't
exist. Kubelet will fail if an invalid cgroup is specified.
-->
请注意，如果 `--kube-reserved-cgroup` 不存在，Kubelet 将**不会**创建它。如果指定了一个无效的 cgroup，Kubelet 将会失败。

<!--
### System Reserved
-->
### 系统预留值（System Reserved）

- **Kubelet Flag**: `--system-reserved=[cpu=100mi][,][memory=100Mi][,][storage=1Gi]`
- **Kubelet Flag**: `--system-reserved-cgroup=`

<!--
`system-reserved` is meant to capture resource reservation for OS system daemons
like `sshd`, `udev`, etc. `system-reserved` should reserve `memory` for the
`kernel` too since `kernel` memory is not accounted to pods in Kubernetes at this time.
Reserving resources for user login sessions is also recommended (`user.slice` in
systemd world).
-->
`system-reserved` 用于为诸如 `sshd`、`udev` 等系统守护进程争取资源预留。`system-reserved` 也应该为 `kernel` 预留 `内存`，因为目前 `kernel` 使用的内存并不记在 Kubernetes 的 pod 上。同时还推荐为用户登录会话预留资源（systemd 体系中的 `user.slice`）。

<!--
To optionally enforce `system-reserved` on system daemons, specify the parent
control group for OS system daemons as the value for `--system-reserved-cgroup`
kubelet flag.
-->
要想在系统守护进程上可选地执行 `system-reserved`，请指定 `--system-reserved-cgroup` kubelet 标志的值为 OS 系统守护进程的父级控制组。

<!--
It is recommended that the OS system daemons are placed under a top level
control group (`system.slice` on systemd machines for example).
-->
推荐将 OS 系统守护进程放在一个顶级控制组之下（例如 systemd 机器上的`system.slice`）。

<!--
Note that Kubelet **does not** create `--system-reserved-cgroup` if it doesn't
exist. Kubelet will fail if an invalid cgroup is specified.
-->
请注意，如果 `--system-reserved-cgroup` 不存在，Kubelet **不会**创建它。如果指定了无效的 cgroup，Kubelet 将会失败。

<!--
### Eviction Thresholds
-->
### 驱逐阈值（Eviction Thresholds）

- **Kubelet Flag**: `--eviction-hard=[memory.available<500Mi]`

<!--
Memory pressure at the node level leads to System OOMs which affects the entire
node and all pods running on it. Nodes can go offline temporarily until memory
has been reclaimed. To avoid (or reduce the probability of) system OOMs kubelet
provides [`Out of Resource`](./out-of-resource.md) management. Evictions are
supported for `memory` and `storage` only. By reserving some memory via
`--eviction-hard` flag, the `kubelet` attempts to `evict` pods whenever memory
availability on the node drops below the reserved value. Hypothetically, if
system daemons did not exist on a node, pods cannot use more than `capacity -eviction-hard`. For this reason, resources reserved for evictions are not
available for pods.
-->
节点级别的内存压力将导致系统内存不足（System OOMs），这将影响到整个节点及其上运行的所有 pod。节点可以暂时离线直到内存已经回收为止。为了防止（或减少可能性）系统内存不足，kubelet 提供了 [`资源不足（Out of Resource）`](./out-of-resource.md) 管理。驱逐（Eviction）操作只支持  `memory` 和 `storage`。通过 `--eviction-hard` 标志预留一些内存后，当节点上的可用内存降至保留值以下时，`kubelet` 将尝试 `驱逐` pod。假设，如果节点上不存在系统守护进程，pod 将不能使用超过 `capacity-eviction-hard` 的资源。因此，为驱逐而预留的资源对 pod 是不可用的。

<!--
### Enforcing Node Allocatable
-->
### 执行节点 Allocatable

- **Kubelet Flag**: `--enforce-node-allocatable=pods[,][system-reserved][,][kube-reserved]`

<!--
The scheduler treats `Allocatable` as the available `capacity` for pods.
-->
调度器将 `Allocatable` 按 pod 的可用 `capacity` 对待。

<!--
`kubelet` enforce `Allocatable` across pods by default. Enforcement is performed
by evicting pods whenever the overall usage across all pods exceeds
`Allocatable`. More details on eviction policy can be found
[here](./out-of-resource.md#eviction-policy). This enforcement is controlled by
specifying `pods` value to the kubelet flag `--enforce-node-allocatable`.
-->
`kubelet` 默认在 pod 中执行 `Allocatable`。无论何时，如果所有 pod 的总用量超过了 `Allocatable`，驱逐 pod 的措施将被执行。有关驱逐策略的更多细节可以在 [这里](./out-of-resource.md#eviction-policy) 找到。请通过设置 kubelet `--enforce-node-allocatable` 标志值为 `pods` 控制这个措施。

<!--
Optionally, `kubelet` can be made to enforce `kube-reserved` and
`system-reserved` by specifying `kube-reserved` & `system-reserved` values in
the same flag. Note that to enforce `kube-reserved` or `system-reserved`,
`--kube-reserved-cgroup` or `--system-reserved-cgroup` needs to be specified
respectively.
-->
可选的，通过在相同标志中同时指定 `kube-reserved` 和 `system-reserved` 值能够使 `kubelet` 执行 `kube-reserved` 和 `system-reserved`。请注意，要想执行 `kube-reserved` 或者 `system-reserved`时，需要分别指定 `--kube-reserved-cgroup` 或者 `--system-reserved-cgroup`。

<!--
## General Guidelines
-->
## 一般原则

<!--
System daemons are expected to be treated similar to `Guaranteed` pods. System
daemons can burst within their bounding control groups and this behavior needs
to be managed as part of kubernetes deployments. For example, `kubelet` should
have its own control group and share `Kube-reserved` resources with the
container runtime. However, Kubelet cannot burst and use up all available Node
resources if `kube-reserved` is enforced.
-->
系统守护进程期望被按照类似 `Guaranteed` pod 一样对待。系统守护进程可以在其范围控制组中爆发式增长，您需要将这个行为作为 kubernetes 部署的一部分进行管理。例如，`kubelet` 应该有它自己的控制组并和容器运行时（container runtime）共享 `Kube-reserved` 资源。然而，如果执行了 `kube-reserved`，则 kubelet 不能突然爆发并耗尽节点的所有可用资源。

<!--
Be extra careful while enforcing `system-reserved` reservation since it can lead
to critical system services being CPU starved or OOM killed on the node. The
recommendation is to enforce `system-reserved` only if a user has profiled their
nodes exhaustively to come up with precise estimates and is confident in their
ability to recover if any process in that group is oom_killed.
-->
在执行 `system-reserved` 预留操作时请加倍小心，因为它可能导致节点上的关键系统服务 CPU 资源短缺或因为内存不足（OOM）而被终止。

<!--
* To begin with enforce `Allocatable` on `pods`.
* Once adequate monitoring and alerting is in place to track kube system
  daemons, attempt to enforce `kube-reserved` based on usage heuristics.
* If absolutely necessary, enforce `system-reserved` over time.
  -->
* 在 `pods` 上执行 `Allocatable` 作为开始。
* 一旦足够用于追踪系统守护进程的监控和告警的机制到位，请尝试基于用量探索（usage heuristics）方式执行 `kube-reserved`。
* 随着时间推进，如果绝对必要，可以执行 `system-reserved`。

<!--
The resource requirements of kube system daemons may grow over time as more and
more features are added. Over time, kubernetes project will attempt to bring
down utilization of node system daemons, but that is not a priority as of now.
So expect a drop in `Allocatable` capacity in future releases.
-->
随着时间的增长以及越来越多特性的加入，kube 系统守护进程对资源的需求可能也会增加。以后 kubernetes 项目将尝试减少对节点系统守护进程的利用，但目前那并不是优先事项。所以，请期待在将来的发布中将 `Allocatable` 容量降低。

<!--
## Example Scenario
-->
## 示例场景

<!--
Here is an example to illustrate Node Allocatable computation:
-->
这是一个用于说明节点 Allocatable 计算方式的示例：

<!--
* Node has `32Gi` of `memory`, `16 CPUs` and `100Gi` of `Storage`
* `--kube-reserved` is set to `cpu=1,memory=2Gi,storage=1Gi`
* `--system-reserved` is set to `cpu=500m,memory=1Gi,storage=1Gi`
* `--eviction-hard` is set to `memory.available<500Mi,nodefs.available<10%`
  -->
* 节点拥有 `32Gi 内存`，`16 核 CPU` 和 `100Gi 存储`
* `--kube-reserved` 设置为 `cpu=1,memory=2Gi,storage=1Gi`
* `--system-reserved` 设置为 `cpu=500m,memory=1Gi,storage=1Gi`
* `--eviction-hard` 设置为 `memory.available<500Mi,nodefs.available<10%` 

<!--
Under this scenario, `Allocatable` will be `14.5 CPUs`, `28.5Gi` of memory and
`98Gi` of local storage.
Scheduler ensures that the total memory `requests` across all pods on this node does
not exceed `28.5Gi` and storage doesn't exceed `88Gi`.
Kubelet evicts pods whenever the overall memory usage exceeds across pods exceed `28.5Gi`,
or if overall disk usage exceeds `88Gi` If all processes on the node consume as
much CPU as they can, pods together cannot consume more than `14.5 CPUs`.
-->
在这个场景下，`Allocatable` 将会是 `14.5 CPUs`、`28.5Gi` 内存以及 `98Gi` 存储。调度器保证这个节点上的所有 pod 请求的内存总量不超过 `28.5Gi`，存储不超过 `88Gi`。当 pod 的内存使用总量超过 `28.5Gi` 或者磁盘使用总量超过 `88Gi` 时，Kubelet 将会驱逐它们。如果节点上的所有进程都尽可能多的使用 CPU，则 pod 加起来不能使用超过 `14.5 CPUs` 的资源。

<!--
If `kube-reserved` and/or `system-reserved` is not enforced and system daemons
exceed their reservation, `kubelet` evicts pods whenever the overall node memory
usage is higher than `31.5Gi` or `storage` is greater than `90Gi`
-->
当没有执行 `kube-reserved` 和/或 `system-reserved` 且系统守护进程使用量超过其预留时，如果节点内存用量高于 `31.5Gi` 或存储大于 `90Gi`，`kubelet` 将会驱逐 pod。

<!--
## Feature Availability
-->
## 可用特性

<!--
As of Kubernetes version 1.2, it has been possible to **optionally** specify
`kube-reserved` and `system-reserved` reservations. The scheduler switched to
using `Allocatable` instead of `Capacity` when available in the same release.
-->
截至 Kubernetes 1.2 版本，已经可以**可选**的指定 `kube-reserved` 和 `system-reserved` 预留。当在相同的发布中都可用时，调度器将转为使用 `Allocatable` 替代 `Capacity`。

<!--
As of Kubernetes version 1.6, `eviction-thresholds` are being considered by
computing `Allocatable`. To revert to the old behavior set
`--experimental-allocatable-ignore-eviction` kubelet flag to `true`.
-->
截至 Kubernetes 1.6 版本，`eviction-thresholds` 是通过计算 `Allocatable` 进行考虑。要使用旧版本的行为，请设置 `--experimental-allocatable-ignore-eviction` kubelet 标志为 `true`。

<!--
As of Kubernetes version 1.6, `kubelet` enforces `Allocatable` on pods using
control groups. To revert to the old behavior unset `--enforce-node-allocatable`
kubelet flag. Note that unless `--kube-reserved`, or `--system-reserved` or
`--eviction-hard` flags have non-default values, `Allocatable` enforcement does
not affect existing deployments.
-->
截至 Kubernetes 1.6 版本，`kubelet` 使用控制组在 pod 上执行 `Allocatable`。要使用旧版本行为，请取消设置 `--enforce-node-allocatable` kubelet 标志。请注意，除非 `--kube-reserved` 或者 `--system-reserved` 或者 `--eviction-hard` 标志没有默认参数，否则 `Allocatable` 的实施不会影响已经存在的 deployment。

<!--
As of Kubernetes version 1.6, `kubelet` launches pods in their own cgroup
sandbox in a dedicated part of the cgroup hierarchy it manages.  Operators are
required to drain their nodes prior to upgrade of the `kubelet` from prior
versions in order to ensure pods and their associated containers are launched in
the proper part of the cgroup hierarchy.
-->
截至 Kubernetes 1.6 版本，`kubelet` 在 pod 自己的 cgroup 沙箱中启动它们，这个 cgroup 沙箱在 kubelet 管理的 cgroup 层次结构中的一个独占部分中。在从前一个版本升级 `kubelet` 之前，要求操作员 drain 节点，以保证 pod 及其关联的容器在 cgroup 层次结构中合适的部分中启动。

<!--
As of Kubernetes version 1.7, `kubelet` supports specifying `storage` as a resource
for `kube-reserved` and `system-reserved`.
-->
截至 Kubernetes 1.7 版本，`kubelet` 支持指定 `storage` 为 `kube-reserved` 和 `system-reserved` 的资源。
