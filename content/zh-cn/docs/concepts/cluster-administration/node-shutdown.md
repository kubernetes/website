---
title: 节点关闭
content_type: concept
weight: 10
---
<!--
title: Node Shutdowns
content_type: concept
weight: 10
-->

<!-- overview -->
<!--
In a Kubernetes cluster, a {{< glossary_tooltip text="node" term_id="node" >}}
can be shutdown in a planned graceful way or unexpectedly because of reasons such
as a power outage or something else external. A node shutdown could lead to workload
failure if the node is not drained before the shutdown. A node shutdown can be
either **graceful** or **non-graceful**.
-->
在 Kubernetes 集群中，{{< glossary_tooltip text="节点" term_id="node" >}}可以按计划的体面方式关闭，
也可能因断电或其他某些外部原因被意外关闭。如果节点在关闭之前未被排空，则节点关闭可能会导致工作负载失败。
节点可以**体面关闭**或**非体面关闭**。

<!-- body -->

<!-- 
## Graceful node shutdown {#graceful-node-shutdown}
-->
## 节点体面关闭 {#graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdown" >}}

<!-- 
The kubelet attempts to detect node system shutdown and terminates pods running on the node.

Kubelet ensures that pods follow the normal
[pod termination process](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
during the node shutdown. During node shutdown, the kubelet does not accept new
Pods (even if those Pods are already bound to the node).
-->
kubelet 会尝试检测节点系统关闭事件并终止在节点上运行的所有 Pod。

在节点终止期间，kubelet 保证 Pod 遵从常规的
[Pod 终止流程](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)，
且不接受新的 Pod（即使这些 Pod 已经绑定到该节点）。

<!-- 
The Graceful node shutdown feature depends on systemd since it takes advantage of
[systemd inhibitor locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit/) to
delay the node shutdown with a given duration.
-->
节点体面关闭特性依赖于 systemd，因为它要利用
[systemd 抑制器锁](https://www.freedesktop.org/wiki/Software/systemd/inhibit/)机制，
在给定的期限内延迟节点关闭。

<!--
Graceful node shutdown is controlled with the `GracefulNodeShutdown`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) which is
enabled by default in 1.21.
-->
节点体面关闭特性受 `GracefulNodeShutdown`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)控制，
在 1.21 版本中是默认启用的。

<!--
Note that by default, both configuration options described below,
`shutdownGracePeriod` and `shutdownGracePeriodCriticalPods` are set to zero,
thus not activating the graceful node shutdown functionality.
To activate the feature, the two kubelet config settings should be configured appropriately and
set to non-zero values.
-->
注意，默认情况下，下面描述的两个配置选项，`shutdownGracePeriod` 和
`shutdownGracePeriodCriticalPods` 都是被设置为 0 的，因此不会激活节点体面关闭功能。
要激活此功能特性，这两个 kubelet 配置选项要适当配置，并设置为非零值。

<!--
Once systemd detects or notifies node shutdown, the kubelet sets a `NotReady` condition on
the Node, with the `reason` set to `"node is shutting down"`. The kube-scheduler honors this condition
and does not schedule any Pods onto the affected node; other third-party schedulers are
expected to follow the same logic. This means that new Pods won't be scheduled onto that node
and therefore none will start.
-->
一旦 systemd 检测到或通知节点关闭，kubelet 就会在节点上设置一个
`NotReady` 状况，并将 `reason` 设置为 `"node is shutting down"`。
kube-scheduler 会重视此状况，不将 Pod 调度到受影响的节点上；
其他第三方调度程序也应当遵循相同的逻辑。这意味着新的 Pod 不会被调度到该节点上，
因此不会有新 Pod 启动。

<!--
The kubelet **also** rejects Pods during the `PodAdmission` phase if an ongoing
node shutdown has been detected, so that even Pods with a
{{< glossary_tooltip text="toleration" term_id="toleration" >}} for
`node.kubernetes.io/not-ready:NoSchedule` do not start there.
-->
如果检测到节点关闭正在进行中，kubelet **也会**在 `PodAdmission`
阶段拒绝 Pod，即使是该 Pod 带有 `node.kubernetes.io/not-ready:NoSchedule`
的{{< glossary_tooltip text="容忍度" term_id="toleration" >}}，也不会在此节点上启动。

<!--
At the same time when kubelet is setting that condition on its Node via the API, the kubelet also begins
terminating any Pods that are running locally.
-->
同时，当 kubelet 通过 API 在其 Node 上设置该状况时，kubelet
也开始终止在本地运行的所有 Pod。

<!-- 
During a graceful shutdown, kubelet terminates pods in two phases:

1. Terminate regular pods running on the node.
2. Terminate [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
   running on the node.
-->
在体面关闭节点过程中，kubelet 分两个阶段来终止 Pod：

1. 终止在节点上运行的常规 Pod。
2. 终止在节点上运行的[关键 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)。

<!-- 
Graceful node shutdown feature is configured with two
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) options:
* `shutdownGracePeriod`:
  * Specifies the total duration that the node should delay the shutdown by. This is the total
    grace period for pod termination for both regular and
    [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).
* `shutdownGracePeriodCriticalPods`:
  * Specifies the duration used to terminate
    [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
    during a node shutdown. This value should be less than `shutdownGracePeriod`.
-->
节点体面关闭的特性对应两个
[`KubeletConfiguration`](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/) 选项：

* `shutdownGracePeriod`：
  * 指定节点应延迟关闭的总持续时间。这是 Pod 体面终止的时间总和，不区分常规 Pod
    还是[关键 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)。
* `shutdownGracePeriodCriticalPods`：
  * 在节点关闭期间指定用于终止[关键 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
    的持续时间。该值应小于 `shutdownGracePeriod`。

{{< note >}}
<!--
There are cases when Node termination was cancelled by the system (or perhaps manually
by an administrator). In either of those situations the
Node will return to the `Ready` state. However Pods which already started the process
of termination
will not be restored by kubelet and will need to be re-scheduled.
-->
在某些情况下，节点终止过程会被系统取消（或者可能由管理员手动取消）。
无论哪种情况下，节点都将返回到 `Ready` 状态。然而，已经开始终止进程的
Pod 将不会被 kubelet 恢复，需要被重新调度。
{{< /note >}}

<!--  
For example, if `shutdownGracePeriod=30s`, and
`shutdownGracePeriodCriticalPods=10s`, kubelet will delay the node shutdown by
30 seconds. During the shutdown, the first 20 (30-10) seconds would be reserved
for gracefully terminating normal pods, and the last 10 seconds would be
reserved for terminating [critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).
-->
例如，如果设置了 `shutdownGracePeriod=30s` 和 `shutdownGracePeriodCriticalPods=10s`，
则 kubelet 将延迟 30 秒关闭节点。
在关闭期间，将保留前 20（30 - 10）秒用于体面终止常规 Pod，
而保留最后 10 秒用于终止[关键 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)。

{{< note >}}
<!--
When pods were evicted during the graceful node shutdown, they are marked as shutdown.
Running `kubectl get pods` shows the status of the evicted pods as `Terminated`.
And `kubectl describe pod` indicates that the pod was evicted because of node shutdown:
-->
当 Pod 在正常节点关闭期间被驱逐时，它们会被标记为关闭。
运行 `kubectl get pods` 时，被驱逐的 Pod 的状态显示为 `Terminated`。
并且 `kubectl describe pod` 表示 Pod 因节点关闭而被驱逐：

```
Reason:         Terminated
Message:        Pod was terminated in response to imminent node shutdown.
```
{{< /note >}}

<!--
### Pod Priority based graceful node shutdown {#pod-priority-graceful-node-shutdown}
-->
### 基于 Pod 优先级的节点体面关闭    {#pod-priority-graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdownBasedOnPodPriority" >}}

<!--
To provide more flexibility during graceful node shutdown around the ordering
of pods during shutdown, graceful node shutdown honors the PriorityClass for
Pods, provided that you enabled this feature in your cluster. The feature
allows cluster administers to explicitly define the ordering of pods
during graceful node shutdown based on
[priority classes](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass).
-->
为了在节点体面关闭期间提供更多的灵活性，尤其是处理关闭期间的 Pod 排序问题，
节点体面关闭机制能够关注 Pod 的 PriorityClass 设置，前提是你已经在集群中启用了此功能特性。
此特性允许集群管理员基于 Pod
的[优先级类（Priority Class）](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
显式地定义节点体面关闭期间 Pod 的处理顺序。

<!--
The [Graceful Node Shutdown](#graceful-node-shutdown) feature, as described
above, shuts down pods in two phases, non-critical pods, followed by critical
pods. If additional flexibility is needed to explicitly define the ordering of
pods during shutdown in a more granular way, pod priority based graceful
shutdown can be used.
-->
前文所述的[节点体面关闭](#graceful-node-shutdown)特性能够分两个阶段关闭 Pod，
首先关闭的是非关键的 Pod，之后再处理关键 Pod。
如果需要显式地以更细粒度定义关闭期间 Pod 的处理顺序，需要一定的灵活度，
这时可以使用基于 Pod 优先级的体面关闭机制。

<!--
When graceful node shutdown honors pod priorities, this makes it possible to do
graceful node shutdown in multiple phases, each phase shutting down a
particular priority class of pods. The kubelet can be configured with the exact
phases and shutdown time per phase.
-->
当节点体面关闭能够处理 Pod 优先级时，节点体面关闭的处理可以分为多个阶段，
每个阶段关闭特定优先级类的 Pod。可以配置 kubelet 按确切的阶段处理 Pod，
且每个阶段可以独立设置关闭时间。

<!--
Assuming the following custom pod
[priority classes](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
in a cluster,
-->
假设集群中存在以下自定义的 Pod
[优先级类](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)。

<!--
|Pod priority class name|Pod priority class value|
|-------------------------|------------------------|
|`custom-class-a`         | 100000                 |
|`custom-class-b`         | 10000                  |
|`custom-class-c`         | 1000                   |
|`regular/unset`          | 0                      |
-->
| Pod 优先级类名称        | Pod 优先级类数值       |
|-------------------------|------------------------|
|`custom-class-a`         | 100000                 |
|`custom-class-b`         | 10000                  |
|`custom-class-c`         | 1000                   |
|`regular/unset`          | 0                      |

<!--
Within the [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/)
the settings for `shutdownGracePeriodByPodPriority` could look like:
-->
在 [kubelet 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中，
`shutdownGracePeriodByPodPriority` 看起来可能是这样：

<!--
|Pod priority class value|Shutdown period|
|------------------------|---------------|
| 100000                 |10 seconds     |
| 10000                  |180 seconds    |
| 1000                   |120 seconds    |
| 0                      |60 seconds     |
-->
| Pod 优先级类数值       | 关闭期限  |
|------------------------|-----------|
| 100000                 | 10 秒     |
| 10000                  | 180 秒    |
| 1000                   | 120 秒    |
| 0                      | 60 秒     |

<!--
The corresponding kubelet config YAML configuration would be:
-->
对应的 kubelet 配置 YAML 将会是：

```yaml
shutdownGracePeriodByPodPriority:
  - priority: 100000
    shutdownGracePeriodSeconds: 10
  - priority: 10000
    shutdownGracePeriodSeconds: 180
  - priority: 1000
    shutdownGracePeriodSeconds: 120
  - priority: 0
    shutdownGracePeriodSeconds: 60
```

<!--
The above table implies that any pod with `priority` value >= 100000 will get
just 10 seconds to stop, any pod with value >= 10000 and < 100000 will get 180
seconds to stop, any pod with value >= 1000 and < 10000 will get 120 seconds to stop.
Finally, all other pods will get 60 seconds to stop.

One doesn't have to specify values corresponding to all of the classes. For
example, you could instead use these settings:
-->
上面的表格表明，所有 `priority` 值大于等于 100000 的 Pod 停止期限只有 10 秒，
所有 `priority` 值介于 10000 和 100000 之间的 Pod 停止期限是 180 秒，
所有 `priority` 值介于 1000 和 10000 之间的 Pod 停止期限是 120 秒，
其他所有 Pod  停止期限是 60 秒。

用户不需要为所有的优先级类都设置数值。例如，你也可以使用下面这种配置：

<!--
|Pod priority class value|Shutdown period|
|------------------------|---------------|
| 100000                 |300 seconds    |
| 1000                   |120 seconds    |
| 0                      |60 seconds     |
-->
| Pod 优先级类数值       | 关闭期限  |
|------------------------|-----------|
| 100000                 | 300 秒    |
| 1000                   | 120 秒    |
| 0                      | 60 秒     |

<!--
In the above case, the pods with `custom-class-b` will go into the same bucket
as `custom-class-c` for shutdown.

If there are no pods in a particular range, then the kubelet does not wait
for pods in that priority range. Instead, the kubelet immediately skips to the
next priority class value range.
-->
在上面这个场景中，优先级类为 `custom-class-b` 的 Pod 会与优先级类为 `custom-class-c`
的 Pod 在关闭时按相同期限处理。

如果在特定的范围内不存在 Pod，则 kubelet 不会等待对应优先级范围的 Pod。
kubelet 会直接跳到下一个优先级数值范围进行处理。

<!--
If this feature is enabled and no configuration is provided, then no ordering
action will be taken.

Using this feature requires enabling the `GracefulNodeShutdownBasedOnPodPriority`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
, and setting `ShutdownGracePeriodByPodPriority` in the
[kubelet config](/docs/reference/config-api/kubelet-config.v1beta1/)
to the desired configuration containing the pod priority class values and
their respective shutdown periods.
-->
如果此功能特性被启用，但没有提供配置数据，则不会出现排序操作。

使用此功能特性需要启用 `GracefulNodeShutdownBasedOnPodPriority`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
并将 [kubelet 配置](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
中的 `shutdownGracePeriodByPodPriority` 设置为期望的配置，
其中包含 Pod 的优先级类数值以及对应的关闭期限。

{{< note >}}
<!-- 
The ability to take Pod priority into account during graceful node shutdown was introduced
as an Alpha feature in Kubernetes v1.23. In Kubernetes {{< skew currentVersion >}}
the feature is Beta and is enabled by default.
-->
在节点体面关闭期间考虑 Pod 优先级的能力是作为 Kubernetes v1.23 中的 Alpha 功能引入的。
在 Kubernetes {{< skew currentVersion >}} 中该功能是 Beta 版，默认启用。
{{< /note >}}

<!--
Metrics `graceful_shutdown_start_time_seconds` and `graceful_shutdown_end_time_seconds`
are emitted under the kubelet subsystem to monitor node shutdowns.
-->
kubelet 子系统中会生成 `graceful_shutdown_start_time_seconds` 和
`graceful_shutdown_end_time_seconds` 度量指标以便监视节点关闭行为。

<!--
## Non-graceful node shutdown handling {#non-graceful-node-shutdown}
-->
## 处理节点非体面关闭 {#non-graceful-node-shutdown}

{{< feature-state feature_gate_name="NodeOutOfServiceVolumeDetach" >}}

<!--
A node shutdown action may not be detected by kubelet's Node Shutdown Manager,
either because the command does not trigger the inhibitor locks mechanism used by
kubelet or because of a user error, i.e., the ShutdownGracePeriod and
ShutdownGracePeriodCriticalPods are not configured properly. Please refer to above
section [Graceful Node Shutdown](#graceful-node-shutdown) for more details.
-->
节点关闭的操作可能无法被 kubelet 的节点关闭管理器检测到，
或是因为该命令没有触发 kubelet 所使用的抑制器锁机制，或是因为用户错误，
即 ShutdownGracePeriod 和 ShutdownGracePeriodCriticalPod 配置不正确。
请参考以上[节点体面关闭](#graceful-node-shutdown)部分了解更多详细信息。

<!--
When a node is shutdown but not detected by kubelet's Node Shutdown Manager, the pods
that are part of a {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} will be stuck in terminating status on
the shutdown node and cannot move to a new running node. This is because kubelet on
the shutdown node is not available to delete the pods so the StatefulSet cannot
create a new pod with the same name. If there are volumes used by the pods, the
VolumeAttachments will not be deleted from the original shutdown node so the volumes
used by these pods cannot be attached to a new running node. As a result, the
application running on the StatefulSet cannot function properly. If the original
shutdown node comes up, the pods will be deleted by kubelet and new pods will be
created on a different running node. If the original shutdown node does not come up,
these pods will be stuck in terminating status on the shutdown node forever.
-->
当某节点关闭但 kubelet 的节点关闭管理器未检测到这一事件时，
在那个已关闭节点上、属于 {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
的 Pod 将停滞于终止状态，并且不能移动到新的运行节点上。
这是因为已关闭节点上的 kubelet 已不存在，亦无法删除 Pod，
因此 StatefulSet 无法创建同名的新 Pod。
如果 Pod 使用了卷，则 VolumeAttachments 无法从原来的已关闭节点上删除，
因此这些 Pod 所使用的卷也无法挂接到新的运行节点上。
最终，那些以 StatefulSet 形式运行的应用无法正常工作。
如果原来的已关闭节点被恢复，kubelet 将删除 Pod，新的 Pod 将被在不同的运行节点上创建。
如果原来的已关闭节点没有被恢复，那些在已关闭节点上的 Pod 将永远滞留在终止状态。

<!--
To mitigate the above situation, a user can manually add the taint `node.kubernetes.io/out-of-service` with either `NoExecute`
or `NoSchedule` effect to a Node marking it out-of-service.
If the `NodeOutOfServiceVolumeDetach`[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled on {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}, and a Node is marked out-of-service with this taint, the
pods on the node will be forcefully deleted if there are no matching tolerations on it and volume
detach operations for the pods terminating on the node will happen immediately. This allows the
Pods on the out-of-service node to recover quickly on a different node.
-->
为了缓解上述情况，用户可以手动将具有 `NoExecute` 或 `NoSchedule` 效果的
`node.kubernetes.io/out-of-service` 污点添加到节点上，标记其无法提供服务。
如果在 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
上启用了 `NodeOutOfServiceVolumeDetach`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
并且节点被污点标记为无法提供服务，如果节点 Pod 上没有设置对应的容忍度，
那么这样的 Pod 将被强制删除，并且该在节点上被终止的 Pod 将立即进行卷分离操作。
这样就允许那些在无法提供服务节点上的 Pod 能在其他节点上快速恢复。

<!--
During a non-graceful shutdown, Pods are terminated in the two phases:

1. Force delete the Pods that do not have matching `out-of-service` tolerations.
2. Immediately perform detach volume operation for such pods.
-->
在非体面关闭期间，Pod 分两个阶段终止：

1. 强制删除没有匹配的 `out-of-service` 容忍度的 Pod。
2. 立即对此类 Pod 执行分离卷操作。

{{< note >}}
<!--
- Before adding the taint `node.kubernetes.io/out-of-service` , it should be verified
  that the node is already in shutdown or power off state (not in the middle of
  restarting).
- The user is required to manually remove the out-of-service taint after the pods are
  moved to a new node and the user has checked that the shutdown node has been
  recovered since the user was the one who originally added the taint.
-->
- 在添加 `node.kubernetes.io/out-of-service` 污点之前，
  应该验证节点已经处于关闭或断电状态（而不是在重新启动中）。
- 将 Pod 移动到新节点后，用户需要手动移除停止服务的污点，
  并且用户要检查关闭节点是否已恢复，因为该用户是最初添加污点的用户。
{{< /note >}}

<!--
### Forced storage detach on timeout {#storage-force-detach-on-timeout}

In any situation where a pod deletion has not succeeded for 6 minutes, kubernetes will
force detach volumes being unmounted if the node is unhealthy at that instant. Any
workload still running on the node that uses a force-detached volume will cause a
violation of the
[CSI specification](https://github.com/container-storage-interface/spec/blob/master/spec.md#controllerunpublishvolume),
which states that `ControllerUnpublishVolume` "**must** be called after all
`NodeUnstageVolume` and `NodeUnpublishVolume` on the volume are called and succeed".
In such circumstances, volumes on the node in question might encounter data corruption.
-->
### 存储超时强制解除挂接  {#storage-force-detach-on-timeout}

在任何情况下，当 Pod 未能在 6 分钟内删除成功，如果节点当时不健康，
Kubernetes 将强制解除挂接正在被卸载的卷。
任何运行在使用了强制解除挂接卷的节点之上的工作负载，
都将违反 [CSI 规范](https://github.com/container-storage-interface/spec/blob/master/spec.md#controllerunpublishvolume)，
该规范指出 `ControllerUnpublishVolume`
"**必须**在调用卷上的所有 `NodeUnstageVolume` 和 `NodeUnpublishVolume` 执行且成功后被调用"。
在这种情况下，相关节点上的卷可能会遇到数据损坏。

<!--
The forced storage detach behaviour is optional; users might opt to use the "Non-graceful
node shutdown" feature instead.
-->
强制存储解除挂接行为是可选的；用户可以选择使用"非体面节点关闭"特性。

<!--
Force storage detach on timeout can be disabled by setting the `disable-force-detach-on-timeout`
config field in `kube-controller-manager`. Disabling the force detach on timeout feature means
that a volume that is hosted on a node that is unhealthy for more than 6 minutes will not have
its associated
[VolumeAttachment](/docs/reference/kubernetes-api/config-and-storage-resources/volume-attachment-v1/)
deleted.
-->
可以通过在 `kube-controller-manager` 中设置 `disable-force-detach-on-timeout`
配置字段来禁用超时时存储强制解除挂接。
禁用超时强制解除挂接特性意味着，托管在异常超过 6 分钟的节点上的卷将不会保留其关联的
[VolumeAttachment](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/volume-attachment-v1/)。

<!--
After this setting has been applied, unhealthy pods still attached to a volumes must be recovered
via the [Non-Graceful Node Shutdown](#non-graceful-node-shutdown) procedure mentioned above.
-->
应用此设置后，仍然关联卷到不健康 Pod 必须通过上述[非体面节点关闭](#non-graceful-node-shutdown)过程进行恢复。

{{< note >}}
<!--
- Caution must be taken while using the [Non-Graceful Node Shutdown](#non-graceful-node-shutdown) procedure.
- Deviation from the steps documented above can result in data corruption.
-->
- 使用[非体面节点关闭](#non-graceful-node-shutdown)过程时必须小心。
- 偏离上述步骤可能会导致数据损坏。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
Learn more about the following:
* Blog: [Non-Graceful Node Shutdown](/blog/2023/08/16/kubernetes-1-28-non-graceful-node-shutdown-ga/).
* Cluster Architecture: [Nodes](/docs/concepts/architecture/nodes/).
-->
了解更多以下信息：

- 博客：[非体面节点关闭](/zh-cn/blog/2023/08/16/kubernetes-1-28-non-graceful-node-shutdown-ga/)。
- 集群架构：[节点](/zh-cn/docs/concepts/architecture/nodes/)。
