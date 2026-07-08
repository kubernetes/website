---
content_type: "reference"
title: 节点重启后会发生什么
weight: 90
---
<!--
content_type: "reference"
title: What Happens After A Node Restart
weight: 90
-->

<!--
System components on a node sometimes restart, either because of an upgrade, a
crash, or an explicit operator action. This page describes what happens to Pods
and to the node when the {{< glossary_tooltip term_id="kubelet" text="kubelet" >}},
the {{< glossary_tooltip term_id="container-runtime" text="container runtime" >}},
or the node as a whole restarts.
-->
节点上的系统组件有时会重新启动，可能是因为升级、崩溃或管理员的显式操作。本文描述了当
{{< glossary_tooltip term_id="kubelet" text="kubelet" >}}、
{{< glossary_tooltip term_id="container-runtime" text="容器运行时" >}}
或整个节点重新启动时，Pod 和节点会发生什么。

<!-- body -->

<!--
In a healthy cluster these restarts are usually safe and do not break running
workloads. The sections below describe the effects to be aware of, which become
more pronounced on large or heavily loaded nodes. The most disruptive case is a
[node reboot](#impact-of-a-node-reboot), which encompasses both a container
runtime restart and a kubelet restart, but with more consequences because every
container on the node stops first.
-->
在健康的集群中，这些重启通常是安全的，不会破坏正在运行的工作负载。以下部分描述需要注意的影响，
这些影响在大型或负载较重的节点上会更加明显。
最具破坏性的情况是[节点重启](#impact-of-a-node-reboot)，
它包含容器运行时重启和 kubelet 重启，但后果更严重，因为节点上的每个容器都会首先停止。

<!--
## Impact of a kubelet restart
-->
## kubelet 重启的影响 {#impact-of-a-kubelet-restart}

<!--
If only the kubelet restarts, the containers that are already running **continue to
run**. The kubelet re-establishes its view of the Node, and reconciles the running
containers against the desired state. During this period of time, the following happens:
-->
如果只有 kubelet 重新启动，已经运行的容器**继续运行**。
kubelet 重新建立其对节点的视图，并根据期望状态协调正在运行的容器。
在此期间，会发生以下情况：

<!--
* The kubelet re-initializes and re-synchronizes its caches, which produces a
  burst of requests to the {{< glossary_tooltip term_id="kube-apiserver" text="API 服务器" >}}.
  On large nodes with many Pods this burst can be significant.
-->
* kubelet 重新初始化并重新同步其缓存，这会向
  {{< glossary_tooltip term_id="kube-apiserver" text="API 服务器" >}}发送大量请求。
  在有许多 Pod 的大型节点上，这种请求突发可能会很显著。

<!--
* The node is temporarily reported as `NotReady` until the kubelet finishes
  initializing. While the node is `NotReady`, the
  {{< glossary_tooltip term_id="kube-scheduler" text="调度器" >}} does not
  place new Pods on it.
-->
* 在 kubelet 完成初始化之前，节点暂时报告为 `NotReady`。当节点处于 `NotReady` 状态时，
  {{< glossary_tooltip term_id="kube-scheduler" text="调度器" >}}不会在其上放置新的 Pod。

<!--
* [Node heartbeats](/docs/concepts/architecture/nodes/#node-heartbeats) pause
  while the kubelet is down and resume once it has restarted and finished
  initializing, when the kubelet renews its `Lease` object and posts node status
  again.
-->
* [节点心跳](/zh-cn/docs/concepts/architecture/nodes/#node-heartbeats)在 kubelet 宕机期间暂停，
  一旦 kubelet 重新启动并完成初始化（此时 kubelet 会更新其 `Lease` 对象并再次发布节点状态），心跳就会恢复。

<!--
* The kubelet preserves the readiness of running containers across a restart.
  Each Pod's readiness drives
  {{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlice" >}},
  Endpoints, and
  downstream configuration (such as Gateways or Ingresses); this means that resetting
  container readiness on every restart would place a large
  load on the API server and on components that watch endpoint state, and could
  briefly remove healthy Pods from Service load balancing. This behavior is
  described in
  [KEP-4781: Fix inconsistent container ready state after kubelet restart](https://www.kubernetes.dev/resources/keps/4781/).
  Resetting container readiness to `false` on every restart was the default
  behavior for a long time. The `ChangeContainerStatusOnKubeletRestart`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  lets you revert to that behavior, but it is a deprecated legacy escape hatch
  that is slated for removal, so you should not rely on it. For more detail, see
  [Pod behavior during kubelet restarts](/docs/concepts/workloads/pods/pod-lifecycle/#kubelet-restarts).
-->
* kubelet 在重启期间会保留运行中容器的就绪状态。每个 Pod 的就绪状态会驱动
  {{< glossary_tooltip term_id="endpoint-slice" text="EndpointSlice" >}}、
  Endpoints 以及下游配置（如 Gateway 或 Ingress）；这意味着每次重启时重置容器就绪状态会给
  API 服务器和监视端点状态的组件带来很大负载，
  并可能短暂地将健康的 Pod 从 Service 负载均衡中移除。此行为在
  [KEP-4781：修复 kubelet 重启后容器就绪状态不一致的问题](https://www.kubernetes.dev/resources/keps/4781/)
  中有描述。长期以来，每次重启时将容器就绪状态重置为 `false` 是默认行为。
  `ChangeContainerStatusOnKubeletRestart`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
  允许你恢复到该行为，但这是一个已弃用的遗留后门，计划移除，因此你不应依赖它。
  有关详细信息，请参阅
  [kubelet 重启期间的 Pod 行为](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#kubelet-restarts)。

<!--
* During the initial kubelet startup,
  {{< glossary_tooltip term_id="garbage-collection" text="垃圾回收" >}}
  of unused images and containers, and Pod
  [evictions](/docs/concepts/scheduling-eviction/node-pressure-eviction/) driven
  by node-pressure, are paused. This pause continues for a short
  grace period after the kubelet has completed its main startup routines.
  This delay can slow the node's reaction to memory or disk pressure.
-->
* 在 kubelet 初始启动期间，未使用的镜像和容器的
  {{< glossary_tooltip term_id="garbage-collection" text="垃圾回收" >}}
  以及由节点压力驱动的 Pod
  [驱逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)都会暂停。
  此暂停在 kubelet 完成其主要启动例程后仍会持续一段短暂的宽限期。
  这种延迟可能会减慢节点对内存或磁盘压力的反应。

<!--
* Ongoing image pulls are cancelled. Depending on the container runtime, a
  cancelled pull may have to start over from the beginning when it is retried.
-->
* 正在进行的镜像拉取会被取消。根据容器运行时的不同，取消的拉取在重试时可能必须从头开始。

<!--
* Pod admission runs again for the Pods on the node as the kubelet replays them
  through its admission checks. If the node's
  {{< glossary_tooltip term_id="label" text="标签" >}} or
  {{< glossary_tooltip term_id="taint" text="污点" >}} have changed while
  the kubelet was down, a Pod can fail admission and be rejected even though it
  was already running. This is an existing behavior, and whether it should be
  considered a bug is still debated; see
  [kubernetes/kubernetes#123859](https://github.com/kubernetes/kubernetes/issues/123859)
  for the discussion and details.
-->
* 当 kubelet 重新通过其准入检查时，节点上的 Pod 会再次运行 Pod 准入。如果节点的
  {{< glossary_tooltip term_id="label" text="标签" >}}或
  {{< glossary_tooltip term_id="taint" text="污点" >}}在 kubelet 宕机期间发生了变化，
  即使 Pod 已经在运行，它也可能在准入时失败并被拒绝。这是现有行为，是否应将其视为 BUG 仍在讨论中；
  有关讨论和详细信息，请参阅
  [kubernetes/kubernetes#123859](https://github.com/kubernetes/kubernetes/issues/123859)。

<!--
Overall, in a healthy cluster a kubelet restart does not break running
workloads. On large clusters with overcommitted nodes, however, the
re-initialization load and the paused garbage collection and eviction can
contribute to system instability.
-->
总体而言，在健康的集群中，kubelet 重启不会破坏正在运行的工作负载。然而，在节点过度使用的大型集群中，
重新初始化负载以及暂停的垃圾回收和驱逐可能会导致系统不稳定。

<!--
Kubernetes does not define the behavior of your
container runtime if you restart it. Depending on the container runtime
you use, a restart may trigger a stop or restart for
all local containers.
However, most container runtimes used with Kubernetes
use a configuration that allows you to restart the
runtime and leave containers executing.
-->
Kubernetes 没有定义容器运行时重启时的行为。
根据你使用的容器运行时，重启可能会触发所有本地容器的停止或重启。
然而，大多数与 Kubernetes 一起使用的容器运行时都使用一种允许你重启运行时而让容器继续执行的配置。
  
<!--
## Impact of a container runtime restart
-->
## 容器运行时重启的影响 {#impact-of-a-container-runtime-restart}
  
<!--
When the container runtime (such as
{{< glossary_tooltip term_id="containerd" text="containerd" >}} or CRI-O)
restarts, the kubelet loses its connection to the runtime until it comes back.
During this window:
-->
当容器运行时（如 {{< glossary_tooltip term_id="containerd" text="containerd" >}} 或 CRI-O）
重新启动时，kubelet 会失去与运行时的连接，直到运行时恢复。在此期间：
  
<!--
* `exec` [probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)
  fail for the duration of the restart, because the kubelet cannot run commands
  inside containers. With a short timeout and failure threshold, a failing
  liveness probe can cause a container to be restarted, and a failing readiness
  probe can cause the Pod to flap out of the `Ready` state.
-->
* 在重启期间，`exec` [探针](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)
  会失败，因为 kubelet 无法在容器内运行命令。如果超时时间短且失败阈值低，失败的存活探针会导致容器重启，
  失败的就绪探针会导致 Pod 在 `Ready` 状态之间波动。

<!--
* The node is reported as `NotReady` by the kubelet, which blocks scheduling of
  new Pods onto the node.
-->
* kubelet 将节点报告为 `NotReady`，这会阻止在该节点上调度新的 Pod。

<!--
* Container operations such as restarts, initialization, and status updates are
  delayed until the runtime is available again.
-->
* 容器操作（如重启、初始化和状态更新）会延迟，直到运行时再次可用。

<!--
* If an
  {{< glossary_tooltip term_id="init-container" text="Init 容器" >}} was executing
  when the runtime restarted, its execution state can be lost, in which case the
  init container runs again.
-->
* 如果在运行时重启时，某个
  {{< glossary_tooltip term_id="init-container" text="Init 容器" >}}正在执行，
  其执行状态可能会丢失，在这种情况下，Init 容器会再次运行。

<!--
* In rare cases, interrupting an operation at a precise moment can leave state
  inconsistent:

  * An interrupted image pull may leave inconsistent image layers, which can
    render the image unusable until it is pulled again.

  * An interrupted sandbox creation, if it is terminated in the middle of a CNI
    or NRI call, may leave the sandbox in an inconsistent state, with CNI only
    partially initialized and the possibility of a resource leak.
-->
* 在极少数情况下，在精确时刻中断操作可能会导致状态不一致：

  * 中断的镜像拉取可能会留下不一致的镜像层，这可能会使镜像无法使用，直到再次拉取。

  * 中断的 Sandbox 创建，如果在 CNI 或 NRI 调用中途终止，可能会使 Sandbox 处于不一致状态，
    CNI 仅部分初始化，并可能出现资源泄漏。

<!--
Interrupting an operation at a precise moment is a low-probability situation, so
restarting a container runtime is generally a safe operation. On a heavily loaded
node, where every operation is slower, the window for interrupting a critical
operation is larger and the probability of hitting one of these edge cases
increases.
-->
在精确时刻中断操作是低概率事件，因此重启容器运行时通常是安全的操作。在负载较重的节点上，
每个操作都较慢，中断关键操作的时间窗口更大，遇到这些边缘情况的概率会增加。

<!--
## Impact of a node reboot
-->
## 节点重启的影响 {#impact-of-a-node-reboot}

<!--
A node reboot is the most disruptive of these events, because every container on
the node stops. A reboot encompasses both a container runtime restart and a
kubelet restart, but with more consequences: where a standalone kubelet or
runtime restart leaves the already-running containers in place, a reboot stops
every container first. After the node boots, the kubelet and container runtime
start again with no containers actually running.
-->
节点重启是这些事件中最具破坏性的，因为节点上的每个容器都会停止。重启包含容器运行时重启和
kubelet 重启，但后果更严重：独立的 kubelet 或运行时重启会让已运行的容器保持不变，
而重启会首先停止每个容器。节点启动后，kubelet 和容器运行时重新启动，但没有任何容器实际运行。

<!--
Before a planned reboot you can reduce the impact by cordoning the node, so the
scheduler stops placing new Pods on it, and then
{{< glossary_tooltip term_id="drain" text="drain" >}} it to evict the existing
Pods gracefully. When
[graceful node shutdown](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown)
is enabled, the kubelet also attempts to stop running Pods cleanly when it
detects that the node is shutting down.
-->
在计划重启之前，你可以通过隔离（cordon）节点来减少影响，使调度器停止在其上放置新的 Pod，
然后{{< glossary_tooltip term_id="drain" text="腾空" >}}节点以优雅地驱逐现有 Pod。
当启用[体面节点关闭](/zh-cn/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown)时，
kubelet 还会在检测到节点正在关闭时尝试干净地停止运行中的 Pod。

<!--
When the node comes back:
-->
当节点恢复时：

<!--
* The reboot stops all containers, and the kubelet recreates them when the node
  comes back. If the node stays down longer than the configured
  toleration period described below, only Pods managed by a controller
  (such as a
  {{< glossary_tooltip term_id="deployment" text="Deployment" >}},
  {{< glossary_tooltip term_id="statefulset" text="StatefulSet" >}}, or
  {{< glossary_tooltip term_id="daemonset" text="DaemonSet" >}})
  get a replacement Pod. The replacement Pod might schedule onto a different
  node. Standalone Pods (without another object or controller managing them) are
  **not** recreated after deletion.
-->
* 重启会停止所有容器，当节点恢复时，kubelet 会重新创建它们。如果节点宕机时间超过下面描述的配置容忍期，
  只有由控制器管理的 Pod（如
  {{< glossary_tooltip term_id="deployment" text="Deployment" >}}、
  {{< glossary_tooltip term_id="statefulset" text="StatefulSet" >}} 或
  {{< glossary_tooltip term_id="daemonset" text="DaemonSet" >}}）
  会获得替换 Pod。替换的 Pod 可能会调度到不同的节点上。独立 Pod（没有其他对象或控制器管理它们）
  在删除后**不会**重新创建。

<!--
* The node renews the lease and reconcile it's status. It is reported as `NotReady` until the kubelet,
  container runtime, and network are ready.
  While the node is `NotReady`, the node may be
  [tainted](/docs/concepts/scheduling-eviction/taint-and-toleration/)
  with `node.kubernetes.io/not-ready`, and after the configured toleration
  period the control plane can evict Pods that do not tolerate it.
-->
* 节点更新租约并协调其状态。在 kubelet、容器运行时和网络准备就绪之前，节点会报告为 `NotReady`。
  当节点处于 `NotReady` 状态时，节点可能会被[标记污点](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)
  `node.kubernetes.io/not-ready`，在配置的容忍期过后，控制平面可以驱逐不容忍该污点的 Pod。

<!--
* The kubelet re-runs admission for the Pods assigned to the node, so the label
  and taint considerations described under
  [kubelet restart](#impact-of-a-kubelet-restart) apply here as well.
-->
* kubelet 对分配给该节点的 Pod 重新运行准入，因此
  [kubelet 重启](#impact-of-a-kubelet-restart)下描述的标签和污点注意事项也适用于此。

<!--
* For Pods that request devices, the kubelet calls the relevant
  [device plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  again to confirm the device allocations for the Pods that are being restored on
  the node. The device plugin must re-register with the kubelet after the reboot
  so that these allocations can be reconciled.
-->
* 对于请求设备的 Pod，kubelet 会再次调用相关的
  [设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  来确认正在节点上恢复的 Pod 的设备分配。设备插件必须在重启后重新向 kubelet 注册，以便协调这些分配。
  
<!--
* Local storage tied to the lifetime of a container or Pod can be lost. A
  container's writable layer is discarded when the container is recreated, so
  data written there does not survive the reboot. An
  [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) volume lasts as long as
  the Pod stays on the node: a memory-backed `emptyDir` (`medium: Memory`) is
  always lost on reboot because it is held in RAM, while a disk-backed `emptyDir`
  survives a reboot as long as the Pod is not evicted or deleted, and is removed
  only when the Pod leaves the node.
-->
* 与容器或 Pod 生命周期绑定的本地存储可能会丢失。当容器重新创建时，其可写层会被丢弃，
  因此写入那里的数据无法在重启后存活。
  [`emptyDir`](/zh-cn/docs/concepts/storage/volumes/#emptydir) 卷的生命周期与 Pod 在节点上的时间相同：
  内存支持的 `emptyDir`（`medium: Memory`）在重启时总是会丢失，因为它存储在 RAM 中，
  而磁盘支持的 `emptyDir` 只要 Pod 不被驱逐或删除，就能在重启后存活，只有当 Pod 离开节点时才会被删除。

<!--
For workloads that must tolerate node reboots, run Pods through a controller, use
[persistent volumes](/docs/concepts/storage/persistent-volumes/) for data that
must survive, and configure
[disruption budgets](/docs/concepts/workloads/pods/disruptions/) and probes so
that traffic is only sent to Pods once they are ready.
-->
对于必须容忍节点重启的工作负载，请通过控制器运行 Pod，
对必须存活的数据使用[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)，
并配置[中断预算](/zh-cn/docs/concepts/workloads/pods/disruptions/)和探针，
以便只在 Pod 就绪后才向其发送流量。

## {{% heading "whatsnext" %}}

<!--
* Learn about the kubelet's [sync loop](/docs/reference/node/kubelet-sync-loop/).
* Read about [Pod lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/).
* Read about [node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
* Learn how to [safely drain a node](/docs/tasks/administer-cluster/safely-drain-node/).
-->
* 了解 kubelet 的[同步循环](/zh-cn/docs/reference/node/kubelet-sync-loop/)。
* 阅读 [Pod 生命周期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)。
* 阅读[节点压力驱逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)。
* 了解如何[安全地腾空节点](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)。