---
title: Pod 级资源管理器参考
content_type: reference
weight: 30
---
<!--
title: Pod-level resource managers reference
content_type: reference
weight: 30
-->

{{< feature-state feature_gate_name="PodLevelResourceManagers" >}}

<!--
This document provides reference details for the pod-level resource managers
implementation in the `kubelet`, including PodResources API reporting
structures and state checkpoint format migrations during version upgrades
and downgrades.
-->
本文档提供 `kubelet` 中 Pod 级资源管理器实现的参考细节，
包括 PodResources API 的报告结构，
以及版本升级和降级期间状态检查点格式的迁移。

<!--
## PodResources API {#podresources-api}

In Kubernetes 1.37, the `kubelet`'s node-local `PodResources` gRPC API
natively includes pod-level resource entries when the
`PodLevelResourceManagers` feature gate is enabled. This allows node-local
monitoring agents and device plugins to query exclusive resources assigned
to a Pod:
-->
## PodResources API {#podresources-api}

在 Kubernetes 1.37 中，当 `PodLevelResourceManagers` 特性门控启用时，
`kubelet` 的节点本地 `PodResources` gRPC API 会原生包含 Pod 级资源条目。
这使节点本地的监控代理和设备插件可以查询分配给某个 Pod 的独占资源：

<!--
-   **Pod-level fields:** The `PodResources` gRPC message includes
    top-level `cpu_ids` and `memory` fields representing the exclusive
    CPUs and NUMA-aligned memory blocks allocated to the entire Pod.
-->
- **Pod 级字段：** `PodResources` gRPC 消息包含顶层 `cpu_ids` 和 `memory` 字段，
  用于表示分配给整个 Pod 的独占 CPU 和 NUMA 对齐的内存块。

<!--
-   **Container-level filtering:** Container-level reporting avoids
    double-counting:
    -   Containers receiving individual exclusive allocations report their
        specific assigned CPUs and memory in `ContainerResources`.
    -   Containers sharing resources within the Pod's budget (running in
        the pod-isolated shared pool or Node shared pool) leave
        container-level `cpu_ids` and `memory` fields empty, with the
        allocation reflected at the Pod level.
-->
- **容器级过滤：** 容器级报告可避免重复计算：
  - 获得单独独占分配的容器会在 `ContainerResources` 中报告其被分配到的具体 CPU 和内存。
  - 在 Pod 预算内共享资源的容器（运行于 Pod 隔离的共享池或节点共享池中）
    会把容器级的 `cpu_ids` 和 `memory` 字段留空，该分配则反映在 Pod 级。

<!--
-   **Computing the Pod shared pool:** API consumers can compute the
    resources in the pod-level shared pool by taking the pod-level
    allocation and subtracting the union of all exclusive container-level
    allocations:
    `PodSharedPool.CpuIds = Pod.CpuIds - Union(all Container.CpuIds)`
-->
- **计算 Pod 共享池：** API 消费者可以用 Pod
  级分配减去所有容器级独占分配的并集，从而算出 Pod 级共享池中的资源：
  `PodSharedPool.CpuIds = Pod.CpuIds - Union(all Container.CpuIds)`

<!--
Here is a summary of the `PodResources` API reporting behavior when
pod-level resources are specified:

### 1. Topology Manager scope: `pod`

The Topology Manager allocates a pod-level resource budget. Pod-level
fields in `PodResources` are populated with this allocation.
-->
以下是当指定了 Pod 级资源时 `PodResources` API 报告行为的摘要：

### 1. 拓扑管理器范围：`pod` {#1-topology-manager-scope-pod}

拓扑管理器会分配一个 Pod 级的资源预算。`PodResources` 中的 Pod 级字段会填入这一分配。

<!--
{{< table caption="PodResources API reporting for pod scope" >}}
Container Combination            | Pod-Level `cpu_ids` / `memory`                | Container-Level `cpu_ids` / `memory`             | Details / Notes
:------------------------------- | :-------------------------------------------- | :----------------------------------------------- | :--------------
Exclusive Container (Guaranteed) | Populated with the full Pod-level allocation. | Populated with the container's allocated subset. | The container receives exclusive CPUs carved out of the pod-level allocation.
Shared Pool Container            | Populated with the full Pod-level allocation. | Empty                                            | Avoids double-counting since the container runs in the Pod shared pool.
{{< /table >}}
-->
{{< table caption="`pod` 范围下 PodResources API 的报告行为" >}}
容器组合 | Pod 级 `cpu_ids` / `memory` | 容器级 `cpu_ids` / `memory` | 详情 / 说明
:--- | :--- | :--- | :---
独占容器（Guaranteed） | 填入完整的 Pod 级分配。 | 填入该容器分配得到的子集。 | 该容器获得从 Pod 级分配中划分出的独占 CPU。
共享池容器 | 填入完整的 Pod 级分配。 | 空 | 因为该容器运行在 Pod 共享池中，所以可避免重复计算。
{{< /table >}}

<!--
### 2. Topology Manager scope: `container`

The `kubelet` evaluates resource allocations per container. Pod-level
`PodResources` API fields remain empty.
-->
### 2. 拓扑管理器范围：`container` {#2-topology-manager-scope-container}

`kubelet` 会按容器逐个评估资源分配。Pod 级的 `PodResources` API 字段保持为空。

<!--
{{< table caption="PodResources API reporting for container scope" >}}
Container Combination            | Pod-Level `cpu_ids` / `memory` | Container-Level `cpu_ids` / `memory`                  | Details / Notes
:------------------------------- | :----------------------------- | :---------------------------------------------------- | :--------------
Exclusive Container (Guaranteed) | Empty                          | Populated with the container's allocated CPUs/Memory. | The container receives exclusive allocations directly from the Node's allocatable pool.
Shared Pool Container            | Empty                          | Empty                                                 | Runs in the Node's general shared pool.
{{< /table >}}
-->
{{< table caption="`container` 范围下 PodResources API 的报告行为" >}}
容器组合 | Pod 级 `cpu_ids` / `memory` | 容器级 `cpu_ids` / `memory` | 详情/说明
:--- | :--- | :--- | :---
独占容器（Guaranteed） | 空 | 填入该容器分配得到的 CPU/内存。 | 该容器直接从节点的可分配池中获得独占分配。
共享池容器 | 空 | 空 | 运行在节点的常规共享池中。
{{< /table >}}

<!--
## `kubelet` state checkpoint formats {#state-checkpoints}

The `kubelet` maintains local state checkpoint files (`cpu_manager_state`
and `memory_manager_state` in the `kubelet` root directory) to preserve
resource assignments across restarts during `kubelet` version upgrades and
downgrades.
-->
## `kubelet` 状态检查点格式 {#state-checkpoints}

`kubelet` 维护本地状态检查点文件（位于 `kubelet` 根目录中的
`cpu_manager_state` 和 `memory_manager_state`），
以便在 `kubelet` 版本升级和降级期间的重启过程中保留资源分配。

<!--
### Checkpoint format in Kubernetes v1.36

In Kubernetes v1.36, enabling the `PodLevelResourceManagers` feature gate
saved state checkpoints using an internal V3 format. While upgrading to
1.36 is backward compatible, the V3 format lacks forward compatibility. If
you downgrade a 1.36 `kubelet` to 1.35 or earlier (or disable the feature
gate after active use in 1.36), the older `kubelet` cannot parse V3
checkpoints and fails to start with a `checkpoint is corrupted` error.
-->
### Kubernetes v1.36 中的检查点格式 {#checkpoint-format-in-kubernetes-v1-36}

在 Kubernetes v1.36 中，启用 `PodLevelResourceManagers` 特性门控会使用内部的
V3 格式保存状态检查点。虽然升级到 1.36 是向后兼容的，
但 V3 格式缺少前向兼容性。如果你把 1.36 的 `kubelet` 降级到 1.35 或更早版本
（或者在 1.36 中活跃使用之后禁用该特性门控），较旧的 `kubelet` 无法解析 V3 检查点，
并会因 `checkpoint is corrupted` 错误而启动失败。

<!--
To recover, drain the Node, manually remove the checkpoint files
(`cpu_manager_state` and `memory_manager_state`), and restart the
`kubelet`.
-->
要恢复，请腾空该节点，手动删除检查点文件
（`cpu_manager_state` 和 `memory_manager_state`），然后重启 `kubelet`。

<!--
### Forward-compatible format in Kubernetes v1.37+

In Kubernetes v1.37, checkpoint files use a generalized V4 format that
embeds the standard V2 structure. This introduces a forward-compatible
internal format so that checkpoint incompatibility is a one-off issue
rather than something you should expect in future updates:
-->
### Kubernetes v1.37 及更高版本中的前向兼容格式 {#forward-compatible-format-in-kubernetes-v1-37}

在 Kubernetes v1.37 中，检查点文件使用一种通用的 V4 格式，
其中内嵌标准的 V2 结构。这引入了一种前向兼容的内部格式，
使检查点不兼容成为一次性问题，而不是你在未来更新中预期会遇到的情况：

<!--
-   **Upgrade and downgrade compatibility:** Older `kubelet` versions can
    read V4 checkpoints without corruption errors. If you downgrade a
    v1.37 `kubelet` to v1.36 (even with `PodLevelResourceManagers`
    enabled in 1.36), the 1.36 `kubelet` safely restores standard
    container allocations from V2.
-   **Loss of pod-level entries:** While the `kubelet` starts safely
    without corruption, active pod-level resource assignments
    (`PodEntries`) are lost upon downgrade to v1.36.
-->
- **升级与降级兼容性：** 较旧的 `kubelet` 版本可以读取 V4 检查点而不会出现损坏错误。
  如果你把 v1.37 的 `kubelet` 降级到 v1.36（即使在 1.36 中启用了
  `PodLevelResourceManagers`），1.36 的 `kubelet` 也能从 V2 安全地恢复标准容器分配。
- **Pod 级条目的丢失：** 虽然 `kubelet` 可以安全启动而不会出现损坏，
  但在降级到 v1.36 时，活跃的 Pod 级资源分配（`PodEntries`）会丢失。

<!--
If you are not running Kubernetes v1.37, consult the documentation for
that version of Kubernetes for information about upgrades and downgrades.
-->
如果你运行的不是 Kubernetes v1.37，请查阅该版本 Kubernetes 的文档，了解升级和降级相关的信息。

<!--
## See also

-   [Pod-level resource managers concept](/docs/concepts/resource-management/pod-level-resource-managers/):
    Read the concept page to understand the overall architecture, QoS
    class requirements, and resource manager allocation rules across
    `pod` and `container` scopes.
-->
## 另请参阅 {#see-also}

- [Pod 级资源管理器概念](/zh-cn/docs/concepts/resource-management/pod-level-resource-managers/)：
  阅读该概念页面，了解整体架构、QoS 类要求，
  以及 `pod` 和 `container` 范围下的资源管理器分配规则。

<!--
-   [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/):
    Learn how to configure `.spec.resources` in Pod manifests to request
    pod-level compute resources.
-   [Use pod-level resources with `kubelet` resource managers](/docs/tutorials/cluster-management/use-pod-level-resource-managers/):
    Follow a step-by-step hands-on tutorial to configure the `kubelet`
    and verify allocation behaviors.
-->
- [分配 Pod 级 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)：
  了解如何在 Pod 清单中配置 `.spec.resources` 以请求 Pod 级计算资源。
- [使用 Pod 级资源与 `kubelet` 资源管理器](/zh-cn/docs/tutorials/cluster-management/use-pod-level-resource-managers/)：
  按照分步实践教程配置 `kubelet` 并验证分配行为。

<!--
-   [`kubelet` state files reference](/docs/reference/node/kubelet-files/#resource-managers-state):
    Learn more about where local state checkpoint files
    (`cpu_manager_state` and `memory_manager_state`) are stored on the
    host filesystem.
-->
- [`kubelet` 状态文件参考](/zh-cn/docs/reference/node/kubelet-files/#resource-managers-state)：
  进一步了解本地状态检查点文件（`cpu_manager_state` 和 `memory_manager_state`）存放在宿主机文件系统的什么位置。
