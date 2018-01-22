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


* TOC
{:toc}


Kubernetes 的节点可以按照 `Capacity` 调度。默认情况下 pod 能够使用节点全部可用容量。这是个问题，因为节点自己通常运行了不少驱动 OS 和 Kubernetes 的系统守护进程（system daemons）。除非为这些系统守护进程留出资源，否则它们将与 pod 争夺资源并导致节点资源短缺问题。


`kubelet` 公开了一个名为 `Node Allocatable` 的特性，有助于为系统守护进程预留计算资源。Kubernetes 推荐集群管理员按照每个节点上的工作负载密度配置 `Node Allocatable`。


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


Kubernetes 节点上的 `Allocatable` 被定义为 pod 可用计算资源量。调度器不会超额申请  `Allocatable`。目前支持 `CPU`, `memory` 和 `storage` 这几个参数。


Node Allocatable 暴露为 API 中 `v1.Node` 对象的一部分，也是 CLI 中 `kubectl describe node` 的一部分。


在 `kubelet` 中，可以为两类系统守护进程预留资源。


### 启用 QoS 和 Pod 级别的 cgroups


为了恰当的在节点范围实施 node allocatable，您必须通过 `--cgroups-per-qos` 标志启用新的 cgroup 层次结构。这个标志是默认启用的。启用后，`kubelet` 将在其管理的 cgroup 层次结构中创建所有终端用户的 pod。


### 配置 cgroup 驱动


`kubelet` 支持在主机上使用 cgroup 驱动操作 cgroup 层次结构。驱动通过 `--cgroup-driver` 标志配置。


支持的参数值如下：

* `cgroupfs` 是默认的驱动，在主机上直接操作 cgroup 文件系统以对 cgroup 沙箱进行管理。
* `systemd` 是可选的驱动，使用 init 系统支持的资源的瞬时切片管理 cgroup 沙箱。


取决于相关容器运行时（container runtime）的配置，操作员可能需要选择一个特定的 cgroup 驱动来保证系统正常运行。例如如果操作员使用 `docker` 运行时提供的 cgroup 驱动时，必须配置 `kubelet` 使用 `systemd` cgroup 驱动。


### Kube Reserved

- **Kubelet Flag**: `--kube-reserved=[cpu=100m][,][memory=100Mi][,][storage=1Gi]`
- **Kubelet Flag**: `--kube-reserved-cgroup=`


`kube-reserved` 是为了给诸如 `kubelet`、`container runtime`、`node problem detector` 等 kubernetes 系统守护进程争取资源预留。这并不代表要给以 pod 形式运行的系统守护进程保留资源。`kube-reserved` 通常是节点上的一个 `pod 密度（pod density）` 功能。 [这个性能仪表盘](http://node-perf-dash.k8s.io/#/builds) 从 pod 密度的多个层面展示了 `kubelet` 和 `docker engine` 的 `cpu` 和 `memory` 使用情况。


要选择性的在系统守护进程上执行 `kube-reserved`，需要把  kubelet 的 `--kube-reserved-cgroup` 标志的值设置为 kube 守护进程的父控制组。


推荐将 kubernetes 系统守护进程放置于顶级控制组之下（例如 systemd 机器上的 `runtime.slice`）。理想情况下每个系统守护进程都应该在其自己的子控制组中运行。请参考[这篇文档](https://git.k8s.io/community/contributors/design-proposals/node-allocatable.md#recommended-cgroups-setup)，获取更过关于推荐控制组层次结构的细节。


请注意，如果 `--kube-reserved-cgroup` 不存在，Kubelet 将**不会**创建它。如果指定了一个无效的 cgroup，Kubelet 将会失败。


### 系统预留值（System Reserved）

- **Kubelet Flag**: `--system-reserved=[cpu=100mi][,][memory=100Mi][,][storage=1Gi]`
- **Kubelet Flag**: `--system-reserved-cgroup=`


`system-reserved` 用于为诸如 `sshd`、`udev` 等系统守护进程争取资源预留。`system-reserved` 也应该为 `kernel` 预留 `内存`，因为目前 `kernel` 使用的内存并不记在 Kubernetes 的 pod 上。同时还推荐为用户登录会话预留资源（systemd 体系中的 `user.slice`）。


要想在系统守护进程上可选地执行 `system-reserved`，请指定 `--system-reserved-cgroup` kubelet 标志的值为 OS 系统守护进程的父级控制组。


推荐将 OS 系统守护进程放在一个顶级控制组之下（例如 systemd 机器上的`system.slice`）。


请注意，如果 `--system-reserved-cgroup` 不存在，Kubelet **不会**创建它。如果指定了无效的 cgroup，Kubelet 将会失败。


### 驱逐阈值（Eviction Thresholds）

- **Kubelet Flag**: `--eviction-hard=[memory.available<500Mi]`


节点级别的内存压力将导致系统内存不足（System OOMs），这将影响到整个节点及其上运行的所有 pod。节点可以暂时离线直到内存已经回收为止。为了防止（或减少可能性）系统内存不足，kubelet 提供了 [`资源不足（Out of Resource）`](./out-of-resource.md) 管理。驱逐（Eviction）操作只支持  `memory` 和 `storage`。通过 `--eviction-hard` 标志预留一些内存后，当节点上的可用内存降至保留值以下时，`kubelet` 将尝试 `驱逐` pod。假设，如果节点上不存在系统守护进程，pod 将不能使用超过 `capacity-eviction-hard` 的资源。因此，为驱逐而预留的资源对 pod 是不可用的。


### 执行节点 Allocatable

- **Kubelet Flag**: `--enforce-node-allocatable=pods[,][system-reserved][,][kube-reserved]`


调度器将 `Allocatable` 按 pod 的可用 `capacity` 对待。


`kubelet` 默认在 pod 中执行 `Allocatable`。无论何时，如果所有 pod 的总用量超过了 `Allocatable`，驱逐 pod 的措施将被执行。有关驱逐策略的更多细节可以在 [这里](./out-of-resource.md#eviction-policy) 找到。请通过设置 kubelet `--enforce-node-allocatable` 标志值为 `pods` 控制这个措施。


可选的，通过在相同标志中同时指定 `kube-reserved` 和 `system-reserved` 值能够使 `kubelet` 执行 `kube-reserved` 和 `system-reserved`。请注意，要想执行 `kube-reserved` 或者 `system-reserved`时，需要分别指定 `--kube-reserved-cgroup` 或者 `--system-reserved-cgroup`。


## 一般原则


系统守护进程期望被按照类似 `Guaranteed` pod 一样对待。系统守护进程可以在其范围控制组中爆发式增长，您需要将这个行为作为 kubernetes 部署的一部分进行管理。例如，`kubelet` 应该有它自己的控制组并和容器运行时（container runtime）共享 `Kube-reserved` 资源。然而，如果执行了 `kube-reserved`，则 kubelet 不能突然爆发并耗尽节点的所有可用资源。


在执行 `system-reserved` 预留操作时请加倍小心，因为它可能导致节点上的关键系统服务 CPU 资源短缺或因为内存不足（OOM）而被终止。


* 在 `pods` 上执行 `Allocatable` 作为开始。
* 一旦足够用于追踪系统守护进程的监控和告警的机制到位，请尝试基于用量探索（usage heuristics）方式执行 `kube-reserved`。
* 随着时间推进，如果绝对必要，可以执行 `system-reserved`。


随着时间的增长以及越来越多特性的加入，kube 系统守护进程对资源的需求可能也会增加。以后 kubernetes 项目将尝试减少对节点系统守护进程的利用，但目前那并不是优先事项。所以，请期待在将来的发布中将 `Allocatable` 容量降低。


## 示例场景


这是一个用于说明节点 Allocatable 计算方式的示例：


* 节点拥有 `32Gi 内存`，`16 核 CPU` 和 `100Gi 存储`
* `--kube-reserved` 设置为 `cpu=1,memory=2Gi,storage=1Gi`
* `--system-reserved` 设置为 `cpu=500m,memory=1Gi,storage=1Gi`
* `--eviction-hard` 设置为 `memory.available<500Mi,nodefs.available<10%` 


在这个场景下，`Allocatable` 将会是 `14.5 CPUs`、`28.5Gi` 内存以及 `98Gi` 存储。调度器保证这个节点上的所有 pod 请求的内存总量不超过 `28.5Gi`，存储不超过 `88Gi`。当 pod 的内存使用总量超过 `28.5Gi` 或者磁盘使用总量超过 `88Gi` 时，Kubelet 将会驱逐它们。如果节点上的所有进程都尽可能多的使用 CPU，则 pod 加起来不能使用超过 `14.5 CPUs` 的资源。


当没有执行 `kube-reserved` 和/或 `system-reserved` 且系统守护进程使用量超过其预留时，如果节点内存用量高于 `31.5Gi` 或存储大于 `90Gi`，`kubelet` 将会驱逐 pod。


## 可用特性


截至 Kubernetes 1.2 版本，已经可以**可选**的指定 `kube-reserved` 和 `system-reserved` 预留。当在相同的发布中都可用时，调度器将转为使用 `Allocatable` 替代 `Capacity`。


截至 Kubernetes 1.6 版本，`eviction-thresholds` 是通过计算 `Allocatable` 进行考虑。要使用旧版本的行为，请设置 `--experimental-allocatable-ignore-eviction` kubelet 标志为 `true`。


截至 Kubernetes 1.6 版本，`kubelet` 使用控制组在 pod 上执行 `Allocatable`。要使用旧版本行为，请取消设置 `--enforce-node-allocatable` kubelet 标志。请注意，除非 `--kube-reserved` 或者 `--system-reserved` 或者 `--eviction-hard` 标志没有默认参数，否则 `Allocatable` 的实施不会影响已经存在的 deployment。


截至 Kubernetes 1.6 版本，`kubelet` 在 pod 自己的 cgroup 沙箱中启动它们，这个 cgroup 沙箱在 kubelet 管理的 cgroup 层次结构中的一个独占部分中。在从前一个版本升级 `kubelet` 之前，要求操作员 drain 节点，以保证 pod 及其关联的容器在 cgroup 层次结构中合适的部分中启动。


截至 Kubernetes 1.7 版本，`kubelet` 支持指定 `storage` 为 `kube-reserved` 和 `system-reserved` 的资源。
