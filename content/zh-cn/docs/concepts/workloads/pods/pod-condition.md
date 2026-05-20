---
title: Pod 状况
content_type: concept
weight: 35
---

<!--
title: "Pod Conditions"
content_type: concept
weight: 35
-->

<!--
In Kubernetes, many objects have _conditions_. 
Conditions are markers for some aspect of the actual state of the thing the object represents.
Pods have conditions, and Kubernetes Pod conditions are an important aspect of how controllers
(and people doing troubleshooting) can understand the health of a Pod.
-->
在 Kubernetes 中，许多对象都有**状况（condition）**。
状况是对象所代表事物的实际状态某些方面的标记。
Pod 有状况，Kubernetes Pod 状况是控制器（以及进行故障排除的人员）了解 Pod 健康状况的重要方面。

<!--
A Pod's [phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) provides a high-level
summary of where the Pod is in its lifecycle, but a single value cannot capture the full
picture. For example, a Pod may be in the `Running` phase but not yet ready to serve traffic.
Pod conditions complement the phase by tracking multiple aspects of the Pod's state
independently, such as whether it has been scheduled, whether its containers are ready,
whether a resize is in progress, or whether the Pod is about to be disrupted due to a
{{< glossary_tooltip text="taint" term_id="taint" >}}.
-->
Pod 的[阶段（phase）](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)提供了
Pod 在其生命周期中所处位置的高级摘要，但单个值无法捕捉全貌。
例如，Pod 可能处于 Running 阶段，但尚未准备好提供流量。
Pod 状况通过独立跟踪 Pod 状态的多个方面来补充阶段，
例如是否已调度、其容器是否就绪、是否正在进行调整大小，
或者 Pod 是否即将由于{{< glossary_tooltip text="污点" term_id="taint" >}}而受到干扰。

<!-- body -->

<!--
## Structure of a Pod condition
-->
## Pod 状况的结构   {#structure-of-a-pod-condition}

<!--
A Pod's status includes an array of
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
that indicate whether the Pod has passed certain checkpoints.
-->
Pod 的状态（status）包括一个
[PodConditions](/zh-cn/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core)
数组，用于指示 Pod 是否已通过某些检查点。

<!--
Each element of the PodCondition array has the following fields:
-->
PodCondition 数组的每个元素都有以下字段：

<!---->
{{< table caption="Fields of a PodCondition" >}}
| Field name           | Description                                                                                          |
|:---------------------|:-----------------------------------------------------------------------------------------------------|
| `type`               | Name of this Pod condition.                                                                          |
| `status`             | Indicates whether that condition is applicable, with possible values `"True"`, `"False"`, or `"Unknown"`. |
| `lastProbeTime`      | Timestamp of when the Pod condition was last probed.                                                 |
| `lastTransitionTime` | Timestamp for when the Pod last transitioned from one status to another.                             |
| `reason`             | Machine-readable, UpperCamelCase text indicating the reason for the condition's last transition.     |
| `message`            | Human-readable message indicating details about the last status transition.                          |
| `observedGeneration` | The `.metadata.generation` of the Pod at the time the condition was recorded. See [Pod generation](/docs/concepts/workloads/pods/#pod-generation). |
{{< /table >}}
-->
{{< table caption="PodCondition 的字段" >}}
| 字段名称              | 描述                                                   |
|:---------------------|:------------------------------------------------------|
| `type`               | 此 Pod 状况的名称。                                      |
| `status`             | 此 Pod 状况是否适用，可能的值为 `True`、`False`、`Unknown`。 |
| `lastProbeTime`      | 最后一次探查 Pod 状况的时间。                              |
| `lastTransitionTime` | 最后一次 Pod 状况转换的时间。                              |
| `reason`             | 机器可读的、大驼峰式文本，表示条件最后一次转换的原因。          |
| `message`            | 人可读的消息，指示状态转换的详细信息。                       |
| `observedGeneration` | 当记录此 Pod 状况时，Pod 的 `.metadata.generation`。请参阅 [Pod 生成](/zh-cn/docs/concepts/workloads/pods/#pod-generation)。    |
{{< /table >}}

<!--
## Built-in Pod conditions {#built-in-pod-conditions}
-->
## 内置 Pod 状况   {#built-in-pod-conditions}

<!--
Kubernetes manages the following Pod conditions:
-->
Kubernetes 管理以下 Pod 状况：

<!--
[Lifecycle conditions](#lifecycle-pod-conditions): set as a Pod progresses through its lifecycle, roughly in this order:
`PodScheduled`, `PodReadyToStartContainers`, `Initialized`, `ContainersReady`, `Ready`.
-->
[生命周期状况](#lifecycle-pod-conditions)：随着 Pod 经历其生命周期而设置，大致按此顺序：
`PodScheduled`、`PodReadyToStartContainers`、`Initialized`、`ContainersReady`、`Ready`。

<!--
[Other conditions](#other-pod-conditions): set in response to specific operations or events:
`DisruptionTarget`, `PodResizePending`, `PodResizeInProgress`.
-->
[其他状况](#other-pod-conditions)：响应特定操作或事件而设置：
`DisruptionTarget`、`PodResizePending`、`PodResizeInProgress`。

<!--
In addition to the built-in conditions above, you can define custom conditions
using [Pod readiness gates](#pod-readiness).
-->
除了上述内置状况外，你还可以使用 [Pod 就绪门控](#pod-readiness)定义自定义状况。

<!--
## Lifecycle Pod conditions {#lifecycle-pod-conditions}
-->
## 生命周期 Pod 状况   {#lifecycle-pod-conditions}

<!--
As a Pod progresses through its lifecycle, the kubelet sets the following conditions roughly in this order:
-->
随着 Pod 经历其生命周期，kubelet 大致按以下顺序设置以下状况：

<!--
1. `PodScheduled`: the Pod has been scheduled to a node.
1. `PodReadyToStartContainers`: the Pod sandbox has been successfully created and networking configured. The sandbox and network are set up by the {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}} and {{< glossary_tooltip text="CNI" term_id="cni" >}} plugin.
1. `Initialized`: all [init containers](/docs/concepts/workloads/pods/init-containers/) have completed successfully. For a Pod without init containers, this is set to `True` before sandbox creation.
1. `ContainersReady`: all containers in the Pod are ready. A container's readiness is determined by its [readiness probe](/docs/concepts/configuration/liveness-readiness-startup-probes/), if configured.
1. `Ready`: the Pod is able to serve requests and should be added to the load balancing pools of all matching [Services](/docs/concepts/services-networking/service/). Pods that are not `Ready` are removed from Service endpoints.
-->
1. `PodScheduled`：Pod 已调度到节点。
1. `PodReadyToStartContainers`：Pod sandbox 已成功创建并配置了网络。
   sandbox 和网络由{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}和
   {{< glossary_tooltip text="CNI" term_id="cni" >}} 插件设置。
1. `Initialized`：所有[初始容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)均已成功完成。
   对于没有初始容器的 Pod，此状况在 sandbox 创建之前设置为 `True`。
1. `ContainersReady`：Pod 中的所有容器都已就绪。
   容器的就绪状态由其[就绪探针](/zh-cn/docs/concepts/configuration/liveness-readiness-startup-probes/)确定（如果已配置）。
1. `Ready`：Pod 能够处理请求，应添加到所有匹配的 [Service](/zh-cn/docs/concepts/services-networking/service/) 的负载均衡池中。
   未 `Ready` 的 Pod 会从 Service 端点中移除。

{{< note >}}
<!--
The `Ready` condition depends on more than just `ContainersReady`. If the Pod specifies `readinessGates`, all of those custom conditions must also be `True` for the Pod to be `Ready`. See [Pod readiness](#pod-readiness) for details.
-->
`Ready` 状况不仅取决于 `ContainersReady`。
如果 Pod 指定了 `readinessGates`，则所有这些自定义状况也必须为 `True`，Pod 才能为 `Ready`。
有关详细信息，请参阅 [Pod 就绪](#pod-readiness)。
{{< /note >}}

<!--
You can inspect a Pod's conditions using kubectl:
-->
你可以使用 kubectl 检查 Pod 的状况：

```shell
kubectl get pod <pod-name> -o yaml
```

<!--
The following shows what `status.conditions` looks like for a running Pod:
-->
以下显示了运行中的 Pod 的 `status.conditions` 的样子：

```yaml
status:
  conditions:
    - type: PodScheduled
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-03-29T08:52:21Z"
      observedGeneration: 1
    - type: PodReadyToStartContainers
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:16Z"
      observedGeneration: 1
    - type: Initialized
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-03-29T08:52:21Z"
      observedGeneration: 1
    - type: ContainersReady
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:45Z"
      observedGeneration: 1
    - type: Ready
      status: "True"
      lastProbeTime: null
      lastTransitionTime: "2026-04-11T06:02:45Z"
      observedGeneration: 1
```

<!--
### PodReadyToStartContainers {#pod-ready-to-start-containers}
-->
### PodReadyToStartContainers   {#pod-ready-to-start-containers}

{{< feature-state feature_gate_name="PodReadyToStartContainersCondition" >}}

{{< note >}}
<!--
During its early development, this condition was named `PodHasNetwork`.
-->
在早期开发期间，此状况名为 `PodHasNetwork`。
{{< /note >}}

<!--
After a Pod gets scheduled on a node, it needs to be admitted by the kubelet
and to have any required storage volumes mounted. Once these phases are complete,
the kubelet works with a container runtime
(using {{< glossary_tooltip text="Container Runtime Interface (CRI)" term_id="cri" >}})
to set up a runtime sandbox and configure networking for the Pod.
If the `PodReadyToStartContainersCondition` feature gate is enabled
(it is enabled by default for Kubernetes {{< skew currentVersion >}}),
the `PodReadyToStartContainers` condition will be added to the `status.conditions` field of a Pod.
-->
Pod 在节点上调度后，需要由 kubelet 准入并挂载任何所需的存储卷。
这些阶段完成后，kubelet 与容器运行时（使用 {{< glossary_tooltip text="容器运行时接口（CRI）" term_id="cri" >}}）
协作，为 Pod 设置运行时 sandbox 并配置网络。
如果启用了 `PodReadyToStartContainersCondition` 特性门控
（Kubernetes {{< skew currentVersion >}} 中默认启用），
则 `PodReadyToStartContainers` 状况将添加到 Pod 的 `status.conditions` 字段。

<!--
The `PodReadyToStartContainers` condition is set to `False` by the kubelet
when it detects a Pod does not have a runtime sandbox with networking configured. This occurs in the following scenarios:
-->
当 kubelet 检测到 Pod 没有配置网络的运行时 sandbox 时，
`PodReadyToStartContainers` 状况设置为 `False`。
这在以下情况下发生：

<!--
- Early in the lifecycle of the Pod, when the kubelet has not yet begun to set up a sandbox for the Pod using the container runtime.
- Later in the lifecycle of the Pod, when the Pod sandbox has been destroyed due to either:
  - the node rebooting, without the Pod getting evicted
  - for container runtimes that use virtual machines for isolation, the Pod sandbox virtual machine rebooting, which then requires creating a new sandbox and fresh container network configuration.
-->
- 在 Pod 生命周期的早期，kubelet 尚未开始使用容器运行时为 Pod 设置 sandbox。
- 在 Pod 生命周期的后期，Pod sandbox 已被销毁，原因是：
  - 节点重新启动，而 Pod 未被驱逐
  - 对于使用虚拟机进行隔离的容器运行时，Pod sandbox 虚拟机重新启动，这需要创建新的 sandbox 和新的容器网络配置

<!--
The `PodReadyToStartContainers` condition is set to `True` by the kubelet after the successful completion of sandbox creation and network configuration for the Pod by the runtime plugin. The kubelet can start pulling container images and create containers after `PodReadyToStartContainers` condition has been set to `True`.
-->
运行时插件成功完成 Pod 的 sandbox 创建和网络配置后，kubelet 将 `PodReadyToStartContainers` 状况设置为 `True`。
在 `PodReadyToStartContainers` 状况设置为 `True` 后，kubelet 可以开始拉取容器镜像并创建容器。

<!--
For a Pod with init containers, the kubelet sets the `Initialized` condition to `True` after the init containers have successfully completed (which happens after successful sandbox creation and network configuration by the runtime plugin). For a Pod without init containers, the kubelet sets the `Initialized` condition to `True` before sandbox creation and network configuration starts.
-->
对于具有 Init 容器的 Pod，kubelet 在 Init 容器成功完成后
（这发生在运行时插件成功创建 sandbox 和配置网络之后）将 `Initialized` 状况设置为 `True`。
对于没有初始容器的 Pod，kubelet 在 sandbox 创建和网络配置开始之前将 `Initialized` 状况设置为 `True`。

<!--
## Other Pod conditions {#other-pod-conditions}
-->
## 其他 Pod 状况   {#other-pod-conditions}

<!--
The following conditions are not part of the normal Pod lifecycle progression.
They are set in response to specific operations or events.
-->
以下状况不是正常 Pod 生命周期进程的一部分。
它们响应特定操作或事件而设置。

<!--
### DisruptionTarget {#disruption-target}
-->
### DisruptionTarget   {#disruption-target}

<!--
A dedicated Pod `DisruptionTarget` condition is added to indicate that
the Pod is about to be deleted due to a {{<glossary_tooltip term_id="disruption" text="disruption">}}.
The `reason` field of the condition additionally
indicates one of the following reasons for the Pod termination:
-->
添加专用的 Pod `DisruptionTarget` 状况以指示 Pod 即将由于
{{<glossary_tooltip term_id="disruption" text="干扰">}}而被删除。
该状况的 `reason` 字段还指示 Pod 终止的以下原因之一：

<!--
`PreemptionByScheduler`
: Pod is due to be {{<glossary_tooltip term_id="preemption" text="preempted">}} by a scheduler in order to accommodate a new Pod with a higher priority. For more information, see [Pod priority preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
-->
`PreemptionByScheduler`
: Pod 即将被调度器 {{<glossary_tooltip term_id="preemption" text="抢占">}}，以便容纳具有更高优先级的新 Pod。
  有关更多信息，请参阅 [Pod 优先级抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。

<!--
`DeletionByTaintManager`
: Pod is due to be deleted by Taint Manager (which is part of the node lifecycle controller within `kube-controller-manager`) due to a `NoExecute` taint that the Pod does not tolerate; see {{<glossary_tooltip term_id="taint" text="taint">}}-based evictions.
-->
`DeletionByTaintManager`
: Pod 即将被 Taint Manager（`kube-controller-manager` 内节点生命周期控制器的一部分）删除，
  原因是 Pod 不容忍的 `NoExecute` 污点；
  请参阅基于{{<glossary_tooltip term_id="taint" text="污点">}}的驱逐。

<!--
`EvictionByEvictionAPI`
: Pod has been marked for {{<glossary_tooltip term_id="api-eviction" text="eviction using the Kubernetes API">}} .
-->
`EvictionByEvictionAPI`
: Pod 已被标记为{{<glossary_tooltip term_id="api-eviction" text="使用 Kubernetes API 驱逐">}}。

<!--
`DeletionByPodGC`
: Pod, that is bound to a no longer existing Node, is due to be deleted by [Pod garbage collection](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection).
-->
`DeletionByPodGC`
: 绑定到不再存在的节点的 Pod 即将被
  [Pod 垃圾回收](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)删除。

<!--
`TerminationByKubelet`
: Pod has been terminated by the kubelet, because of either {{<glossary_tooltip term_id="node-pressure-eviction" text="node pressure eviction">}},
  the [graceful node shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown),
  or preemption for [system critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
-->
`TerminationByKubelet`
: Pod 已被 kubelet 终止，原因是{{<glossary_tooltip term_id="node-pressure-eviction" text="节点压力驱逐">}}、
  [节点体面关闭](/zh-cn/docs/concepts/architecture/nodes/#graceful-node-shutdown)或
  为[系统关键 Pod](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/) 进行抢占。

<!--
In all other disruption scenarios, like eviction due to exceeding
[Pod container limits](/docs/concepts/configuration/manage-resources-containers/),
Pods don't receive the `DisruptionTarget` condition because the disruptions were
probably caused by the Pod and would reoccur on retry.
-->
在所有其他干扰场景中，例如由于超过
[Pod 容器限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/)而导致的驱逐，
Pod 不会收到 `DisruptionTarget` 状况，因为干扰可能是由 Pod 引起的，并且会在重试时再次发生。

{{< note >}}
<!--
A Pod disruption might be interrupted. The control plane might re-attempt to
continue the disruption of the same Pod, but it is not guaranteed. As a result,
the `DisruptionTarget` condition might be added to a Pod, but that Pod might then not actually be
deleted. In such a situation, after some time, the
Pod disruption condition will be cleared.
-->
Pod 干扰可能会被中断。
控制平面可能会重新尝试继续干扰同一个 Pod，但这不是保证的。
因此，`DisruptionTarget` 状况可能会添加到 Pod，但该 Pod 可能实际上不会被删除。
在这种情况下，一段时间后，Pod 干扰状况将被清除。
{{< /note >}}

<!--
Along with cleaning up the pods, the Pod garbage collector (PodGC) will also mark them as failed if they are in a non-terminal
phase (see also [Pod garbage collection](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)).
-->
除了清理 Pod 外，Pod 垃圾回收器（PodGC）还会将它们标记为失败（如果它们处于非终止阶段）
（另请参阅 [Pod 垃圾回收](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)）。

<!--
When using a Job (or CronJob), you may want to use these Pod disruption conditions as part of your Job's
[Pod failure policy](/docs/concepts/workloads/controllers/job#pod-failure-policy).
-->
使用 Job（或 CronJob）时，你可能希望将这些 Pod 干扰状况用作 Job 的
[Pod 失败策略](/zh-cn/docs/concepts/workloads/controllers/job#pod-failure-policy)的一部分。

<!--
For more details, see [Disruptions](/docs/concepts/workloads/pods/disruptions/).
-->
有关更多详细信息，请参阅[干扰](/zh-cn/docs/concepts/workloads/pods/disruptions/)。

<!--
### PodResizePending and PodResizeInProgress {#pod-resize-conditions}
-->
### PodResizePending 和 PodResizeInProgress   {#pod-resize-conditions}

<!--
The kubelet updates the Pod's status conditions to indicate the state of a resize request:
-->
kubelet 更新 Pod 的状态状况以指示调整大小请求的状态：

<!--
- `type: PodResizePending`: The kubelet cannot immediately grant the request. The `message` field provides an explanation of why.
  - `reason: Infeasible`: The requested resize is impossible on the current node (for example, requesting more resources than the node has).
  - `reason: Deferred`: The requested resize is currently not possible, but might become feasible later (for example if another pod is removed). The kubelet will retry the resize.
- `type: PodResizeInProgress`: The kubelet has accepted the resize and allocated resources, but the changes are still being applied. This is usually brief but might take longer depending on the resource type and runtime behavior. Any errors during actuation are reported in the `message` field (along with `reason: Error`).
-->
- `type: PodResizePending`：kubelet 无法立即批准请求。
  `message` 字段提供原因说明。
  - `reason: Infeasible`：请求的调整大小在当前节点上不可能（例如，请求的资源超过节点拥有的资源）。
  - `reason: Deferred`：请求的调整大小目前不可能，但以后可能变得可行（例如，如果另一个 Pod 被移除）。
    kubelet 将重试调整大小。
- `type: PodResizeInProgress`：kubelet 已接受调整大小并分配了资源，但更改仍在应用中。
  这通常很短暂，但可能根据资源类型和运行时行为花费更长时间。
  执行期间的任何错误都在 `message` 字段中报告（以及 `reason: Error`）。

<!--
If the requested resize is _Deferred_, the kubelet will periodically re-attempt the resize, for example when another pod is removed or scaled down.
-->
如果请求的调整大小被 `Deferred`，kubelet 将定期重试调整大小，例如当另一个 Pod 被移除或缩容时。

<!--
For more details on Pod resize, see [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/).
-->
有关 Pod 调整大小的更多详细信息，
请参阅[调整分配给容器的 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)。

<!--
## Enhanced Pod readiness
-->
## 增强 Pod 就绪   {#enhanced-pod-readiness}

<!--
Your application can inject extra feedback or signals into the Pod's `.status`;
this is known as _enhanced Pod readiness_.
To use this, set `readinessGates` in the Pod's `spec` to specify a list of additional
conditions that the kubelet evaluates for Pod readiness.
You then implement, or install, a controller that manages these custom conditions,
and the kubelet uses that as an extra input to decide if the Pod is ready.
-->
你的应用可以将额外的反馈或信号注入 Pod 的 `.status`；
这称为**增强 Pod 就绪**。
要使用此功能，请在 Pod 的 `spec` 中设置 `readinessGates`，
以指定 kubelet 评估 Pod 就绪的其他状况列表。
然后你实现或安装一个管理这些自定义状况的控制器，
kubelet 使用该控制器作为额外输入来决定 Pod 是否就绪。

<!--
Readiness gates are determined by the current state of `status.condition` fields for the Pod.
If Kubernetes cannot find such a condition in the `status.conditions` field of a Pod, the status of the condition is defaulted to "`False`".
-->
就绪门由 Pod 的 `status.condition` 字段的当前状态确定。
如果 Kubernetes 在 Pod 的 `status.conditions` 字段中找不到这样的状况，
则该状况的状态默认为 "`False`"。

<!--
# a built-in PodCondition
# an extra PodCondition
-->
```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready                              # 内置的 PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"        # 额外的 PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

<!--
The Pod conditions you add must have names that meet the Kubernetes [label key format](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set).
-->
你添加的 Pod 状况必须具有符合 Kubernetes
[标签键格式](/zh-cn/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)的名称。

<!--
### Status for Pod readiness
-->
### Pod 就绪的状态   {#status-for-pod-readiness}

<!--
To set these `status.conditions` for the Pod, applications and
{{< glossary_tooltip term_id="operator-pattern" text="operators">}} should use
the `PATCH` action on the Pod's status subresource. You can use `kubectl patch`
with `--subresource=status`, or a [Kubernetes client library](/docs/reference/using-api/client-libraries/) to write
code that sets custom Pod conditions for Pod readiness.
-->
要为 Pod 设置这些 `status.conditions`，应用和
{{< glossary_tooltip term_id="operator-pattern" text="operators">}} 应使用
Pod 状态子资源的 `PATCH` 操作。
你可以使用 `kubectl patch` 和 `--subresource=status`，
或使用 [Kubernetes 客户端库](/zh-cn/docs/reference/using-api/client-libraries/)编写代码来设置自定义
Pod 状况以实现 Pod 就绪。

<!--
For a Pod that uses custom conditions, that Pod is evaluated to be ready **only** when both the following statements apply:
-->
对于使用自定义状况的 Pod，仅当以下两个陈述都适用时，该 Pod 才被评估为就绪：

<!--
- All containers in the Pod are ready.
- All conditions specified in `readinessGates` are `True`.
-->
- Pod 中的所有容器都已就绪。
- `readinessGates` 中指定的所有状况都为 `True`。

<!--
When a Pod's containers are Ready but at least one custom condition is missing or `False`,
the kubelet sets the Pod's `Ready` condition to `status: "False"` with `reason: ReadinessGatesNotReady`.
-->
当 Pod 的容器为 Ready 但至少缺少一个自定义状况或为 `False` 时，
kubelet 将 Pod 的 `Ready` 状况设置为 `status: "False"` 及 `reason: ReadinessGatesNotReady`。

## {{% heading "whatsnext" %}}

<!--
- Learn about the [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/).
- Learn about [Disruptions](/docs/concepts/workloads/pods/disruptions/).
- Learn about [container probes](/docs/concepts/configuration/liveness-readiness-startup-probes/) and how they affect Pod readiness.
- Learn how to [resize Pod resources in-place](/docs/tasks/configure-pod-container/resize-container-resources/).
-->
- 了解 [Pod 生命周期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)。
- 了解[干扰](/zh-cn/docs/concepts/workloads/pods/disruptions/)。
- 了解[容器探针](/zh-cn/docs/concepts/configuration/liveness-readiness-startup-probes/)以及它们如何影响 Pod 就绪。
- 了解如何[就地调整 Pod 资源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)。
