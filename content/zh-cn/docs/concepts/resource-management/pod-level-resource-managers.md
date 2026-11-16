---
title: Pod 级资源管理器
content_type: concept
weight: 40
min-kubernetes-server-version: v1.36
---
<!--
title: Pod-level resource managers
content_type: concept
weight: 40
min-kubernetes-server-version: v1.36
-->

<!-- overview -->

{{< feature-state feature_gate_name="PodLevelResourceManagers" >}}

<!--
Pod-level resource support for the existing resource managers (Topology, CPU,
and Memory) extends them to handle pod-level resource specifications. When
enabled (via the `PodLevelResources` and `PodLevelResourceManagers` feature
gates), the resource managers can use `.spec.resources` directly as the basis
for their allocation decisions, evolving from a strictly per-container
allocation model to a
{{< glossary_tooltip term_id="pod" >}}-centric one. This partitioning scheme
introduces a more flexible and powerful resource management model, particularly
for performance-sensitive workloads. It allows you to define hybrid allocation
models where some containers in a Pod receive exclusive, NUMA-aligned resources,
while others share the remaining resources from a pod-level shared pool.
-->
现有的资源管理器（拓扑、CPU 和内存）对 Pod 级资源的支持将其扩展为能够处理
Pod 级资源规约。当启用时（通过 `PodLevelResources` 和 `PodLevelResourceManagers`
特性门控），资源管理器可以直接使用 `.spec.resources` 作为分配决策的基础，从严格的按容器分配模型演进为以
{{< glossary_tooltip text="Pod" term_id="pod" >}} 为中心的模型。
这种分区方案引入了一种更灵活、更强大的资源管理模型，
尤其适用于对性能敏感的工作负载。它允许你定义混合分配模型，
其中 Pod 中的某些容器获得独占的、NUMA 对齐的资源，
而其他容器共享 Pod 级共享池中剩余的资源。

<!--
To practice setting up `kubelet` resource managers with pod-level resources and
observe allocation behaviors hands-on, follow the
[Use pod-level resources with `kubelet` resource managers](/docs/tutorials/cluster-management/use-pod-level-resource-managers/)
tutorial.
-->
要练习使用 Pod 级资源设置 `kubelet` 资源管理器并亲身体验分配行为，
请遵循[使用 Pod 级资源与 `kubelet` 资源管理器](/zh-cn/docs/tutorials/cluster-management/use-pod-level-resource-managers/)教程。

<!-- body -->

<!--
To understand pod-level resource managers, it is helpful to contrast them with
the traditional container-focused model. Previously, `kubelet` resource
allocations were strictly all or nothing: to receive exclusive NUMA-aligned
resources for your workload, every container in the Pod had to be Guaranteed
(specifying requests equal to limits for both CPU and memory).
-->
为了理解 Pod 级资源管理器，将它们与传统的以容器为中心的模型进行对比会很有帮助。
此前，`kubelet` 资源分配是严格的"全有或全无"：
要为工作负载获得独占的 NUMA 对齐资源，Pod 中的每个容器都必须是
Guaranteed（为 CPU 和内存指定相等的 requests 和 limits）。

<!--
Pod-level resource managers use `.spec.resources` to enable flexible
partitioning based on the configured Topology Manager scope:
-->
Pod 级资源管理器使用 `.spec.resources`，根据配置的拓扑管理器范围启用灵活的分区：

<!--
-   **`pod` scope:** The `kubelet` allocates and NUMA-aligns a single Pod
    bubble for the entire Pod based on `.spec.resources`. Containers requesting
    exclusive allocations carve out dedicated slices from within this Pod
    bubble, while all other containers share the remaining bubble capacity in a
    pod-isolated shared pool.
-   **`container` scope:** Enables a hybrid allocation model. The `kubelet`
    allows individual containers to receive exclusive, NUMA-aligned resources
    directly from the Node's allocatable pool, while using the Pod's
    `.spec.resources` ceiling to cap collective consumption—allowing sidecars
    to run in the general Node shared pool without requiring every container
    in the Pod to be Guaranteed.
-->
- **`pod` 范围：** `kubelet` 基于 `.spec.resources` 为整个 Pod 分配并 NUMA 对齐一个单一的
  Pod 资源单元（Pod bubble）。请求独占分配的容器会从此 Pod 资源泡中划分出专属的切片，
  而所有其他容器在 Pod 隔离的共享池中共享剩余的资源泡容量。
- **`container` 范围：** 启用混合分配模型。`kubelet` 允许各个容器直接从节点的
  可分配池中获得独占的、NUMA 对齐的资源，同时使用 Pod 的 `.spec.resources`
  上限来限制总体消耗 —— 允许边车在常规节点共享池中运行，
  而无需 Pod 中的每个容器都为 Guaranteed。

<!--
Both standard init containers and restartable init containers (sidecars) are
fully supported. They can receive exclusive resource slices or use the Pod's
shared pool, and the pod-level resource managers respect their lifecycle rules
(for example, reusable resources for standard init containers vs. persistent
reservations for sidecars).
-->
标准 Init 容器和可重启 Init 容器（边车）都完全受支持。
它们可以获得独占的资源切片或使用 Pod 的共享池，
并且 Pod 级资源管理器会遵守它们的生命周期规则
（例如，标准 Init 容器的可重用资源与边车的持久保留）。

<!--
## Glossary
-->
## 术语表

<!--
Pod level resources specification
:   The resource budget defined at the Pod level in `.spec.resources`, that
    specifies the collective requests and limits for the entire Pod.
-->
Pod 级资源规约
: 在 Pod 级别的 `.spec.resources` 中定义的资源预算，
  用于指定整个 Pod 的总体 requests 和 limits。

<!--
Guaranteed container
:   A container that specifies resource requests equal to its limits for both
    CPU (exclusive CPU allocation requires a positive integer value) and Memory.
    Consistent with existing `kubelet` behavior, this makes the container
    eligible for exclusive resource allocation from the resource managers.
-->
Guaranteed 容器
: 为 CPU（独占 CPU 分配要求正整数值）和内存都指定了与 limits 相等的
  resource requests 的容器。与现有的 `kubelet` 行为一致，
  这使容器有资格从资源管理器获得独占资源分配。

<!--
Exclusive slice
:   A dedicated portion of resources (for example: specific CPUs or memory
    pages) allocated solely to a single container, ensuring isolation from other
    containers.
-->
独占切片
: 专门分配给单个容器的专属资源部分（例如：特定 CPU 或内存页），
  确保与其他容器隔离。

<!--
Pod shared pool
:   The subset of a Pod's allocated resources that remains after all exclusive
    slices have been reserved. These resources are shared by all containers in
    the Pod that do not receive an exclusive allocation. While containers in
    this pool share resources with each other, they are strictly isolated from
    the exclusive slices and the general node-wide shared pool.
-->
Pod 共享池
: 在所有独占切片被保留后剩余的 Pod 已分配资源的子集。
  这些资源由 Pod 中所有未获得独占分配的容器共享。
  虽然此池中的容器彼此共享资源，但它们与独占切片和常规的节点级共享池严格隔离。

<!--
## How pod-level resource managers work
-->
## Pod 级资源管理器的工作原理

<!--
The CPU and Memory resource managers operate differently depending on the
configured Topology Manager scope.
-->
CPU 和内存资源管理器的运行方式因配置的拓扑管理器范围不同而异。

<!--
### Topology manager's pod scope and pod-level resources
-->
### 拓扑管理器的 Pod 范围和 Pod 级资源

<!--
When the Topology Manager scope is set to `pod`, the `kubelet` performs a
single NUMA alignment for the entire Pod based on the resource budget defined
in `.spec.resources`.
-->
当拓扑管理器范围设置为 `pod` 时，`kubelet` 基于 `.spec.resources`
中定义的资源预算为整个 Pod 执行单次 NUMA 对齐。

<!--
The resulting NUMA-aligned resource pool is then partitioned:
-->
得到的 NUMA 对齐资源池随后被划分为：

<!--
1.  **Exclusive slices:** Containers that specify `Guaranteed` resources
    (requests equal to limits for both CPU and memory, and the CPU request is
    a positive integer) receive exclusive slices from the Pod's total
    allocation.
2.  **Pod shared pool:** The remaining resources form a shared pool for all
    other containers in the Pod that do not receive an exclusive allocation.
    While containers in this pool share resources with each other, they are
    strictly isolated from the exclusive slices and the general node-wide
    shared pool.
-->
1.  **独占切片：** 指定了 `Guaranteed` 资源（CPU 和内存的 requests 与
    limits 相等，且 CPU request 为正整数）的容器从 Pod 的总分配中获得独占切片。
2.  **Pod 共享池：** 剩余资源形成一个共享池，供 Pod 中所有其他
    未获得独占分配的容器使用。虽然此池中的容器彼此共享资源，
    但它们与独占切片和常规的节点级共享池严格隔离。

<!--
Note that when standard init containers run to completion, their resources
enter a per-Pod reusable set rather than returning to the Node's resource
pool. Because they run sequentially, subsequent app containers can reuse
these resources (either for their own exclusive slices or for the shared
pool).
-->
请注意，当标准 Init 容器运行完成时，它们的资源会进入每个 Pod 的可重用集合，
而不是返回到节点的资源池。由于它们是按顺序运行的，
后续的应用容器可以重用这些资源（用于自己的独占切片或共享池）。

<!--
This allows you to co-locate containers that require exclusive resources
(for example, a high-performance primary application) with those that do not
(for example, sidecars for logging or monitoring), all within a single
NUMA-aligned Pod.
-->
这允许你将需要独占资源的容器（例如高性能主应用）与不需要独占资源的容器
（例如日志或监控边车）放在同一个 NUMA 对齐的 Pod 中。

<!--
Consider the containers in the following Pod spec, where the Topology Manager
scope is `pod` and the Pod has a total budget of 4 CPUs. `main-app` requests
an exclusive 2 CPU slice, while the sidecars share the remaining 2 CPUs in
the Pod's shared pool:
-->
考虑以下 Pod 规约中的容器，其中拓扑管理器范围为 `pod`，Pod 的总预算为 4 个 CPU。
`main-app` 请求独占的 2 个 CPU 切片，而边车在 Pod 的共享池中共享剩余的
2 个 CPU：

{{% code_sample file="pods/resource/pod-level-resource-managers-pod-scope-mixed.yaml" %}}

<!--
**Important considerations:**

When using pod-level resources with the Topology manager's `pod` scope, there
are some important considerations:
-->
**重要注意事项：**

当将 Pod 级资源与拓扑管理器的 `pod` 范围一起使用时，有一些重要注意事项：

<!--
-   **Empty shared pool restriction:** This configuration does not allow Pod
    specifications that would produce an empty Pod shared pool if there are
    containers that require one. If the sum of resource requests from all
    containers that are `Guaranteed` exactly equals the total resource budget,
    and there is at least one other container that requires a shared pool,
    the `kubelet` rejects the Pod at admission.

    For example, the following Pod asks for a pod-level budget of 4 CPUs.
    `main-app` requires an exclusive 3 CPUs and `metrics-sidecar` requires
    an exclusive 1 CPU. Because there are 0 CPUs left in the shared pool
    for `logging-sidecar`, the `kubelet` rejects this Pod (the same
    validation applies for memory):
-->
- **空共享池限制：** 如果存在需要共享池的容器，此配置不允许会产生空的
  Pod 共享池的 Pod 规约。如果所有 `Guaranteed` 容器的 resource requests
  之和恰好等于总资源预算，并且至少有一个其他容器需要共享池，
  `kubelet` 会在准入时拒绝该 Pod。

  例如，以下 Pod 请求的 Pod 级预算为 4 个 CPU。`main-app` 需要独占的 3 个
  CPU，`metrics-sidecar` 需要独占的 1 个 CPU。
  由于共享池中没有剩余的 CPU 可供 `logging-sidecar` 使用，
  `kubelet` 会拒绝此 Pod（相同的验证也适用于内存）：

  {{% code_sample file="pods/resource/pod-level-resource-managers-empty-shared-pool.yaml" %}}

<!--
-   **Wasted resources:** Any resources overallocated when using the `pod`
    scope (the total container requests sum to less than the pod-level budget
    and there are no shared pool containers, or the shared pool containers
    don't fully use the remaining amount) remain assigned and reserved for
    the Pod, effectively going to waste during the entire Pod execution.
-->
- **资源浪费：** 使用 `pod` 范围时超量分配的任何资源
  （所有容器的 requests 总和小于 Pod 级预算且没有共享池容器，
  或共享池容器未完全使用剩余量）仍保持分配并为 Pod 保留，
  在整个 Pod 执行期间实际上被浪费。

<!--
-   **Persistent pool:** The Pod's total resource pool (the NUMA alignment
    and total reserved capacity) is persistent. If a shared-pool container
    crashes and restarts, the Pod's overall resource reservation remains
    safely anchored on the Node. The Node releases the resources back to
    its general pool only when the entire Pod terminates.
-->
- **持久池：** Pod 的总资源池（NUMA 对齐和总保留容量）是持久的。
  如果共享池中的容器崩溃并重启，Pod 的整体资源保留仍安全地锚定在节点上。
  只有当整个 Pod 终止时，节点才会将资源释放回其常规池。

<!--
### Topology manager's container scope and pod-level resources
-->
### 拓扑管理器的 Container 范围和 Pod 级资源

<!--
When the Topology Manager scope is set to `container`, the `kubelet` evaluates
each container individually for exclusive allocation.
-->
当拓扑管理器范围设置为 `container` 时，`kubelet` 会逐个评估每个容器以进行独占分配。

<!--
If the overall Pod achieves a `Guaranteed`
{{< glossary_tooltip text="QoS class" term_id="qos-class" >}} (by specifying
appropriate values in the Pod-level `.spec.resources`), you can mix and match
containers:
-->
如果整个 Pod 达到 `Guaranteed`
{{< glossary_tooltip text="QoS 类" term_id="qos-class" >}}
（通过在 Pod 级别的 `.spec.resources` 中指定适当的值），
你可以混合搭配容器：

- 具有自己的 `Guaranteed` requests 的容器获得独占的 NUMA 对齐资源。
- Pod 中其他未指定 `Guaranteed` requests 的容器在节点的共享池中运行。
- 所有容器的总体资源消耗仍由 Pod 的 `.spec.resources` limits 强制执行。

<!--
This scope is useful when you have an infrastructure sidecar that needs to
be aligned to a specific NUMA Node for device access, while the main
workload can run in the general Node shared pool.
-->
当你有一个基础设施边车需要为设备访问对齐到特定 NUMA 节点，
而主工作负载可以在常规节点共享池中运行时，此范围非常有用。

<!--
Consider the containers in the following Pod spec, where the Topology
Manager scope is `container` and the Pod represents a workload with an
infrastructure sidecar and two application workers, with a total budget of
4 CPUs. The `infrastructure-sidecar` gets an exclusive, NUMA-aligned 2 CPU
slice. The two application workers (`worker-1` and `worker-2`) run in the
general, node-wide shared pool:
-->
考虑以下 Pod 规约中的容器，其中拓扑管理器范围为 `container`，
Pod 代表一个包含基础设施边车和两个应用工作器的工作负载，总预算为 4 个 CPU。
`infrastructure-sidecar` 获得独占的、NUMA 对齐的 2 个 CPU 切片。
两个应用工作器（`worker-1` 和 `worker-2`）在常规的节点级共享池中运行：

{{% code_sample file="pods/resource/pod-level-resource-managers-container-scope-mixed.yaml" %}}

<!--
### CPU quota (CFS)
-->
### CPU 配额（CFS）

<!--
When running mixed workloads within a Pod, the `kubelet` enforces isolation
differently depending on the allocation:
-->
在 Pod 内运行混合工作负载时，`kubelet` 根据分配方式以不同方式强制执行隔离：

<!--
-   **Exclusive containers:** Containers with exclusive CPU slices have their
    CPU CFS quota enforcement disabled, allowing them to run without
    throttling by the Linux scheduler.
-   **Pod shared pool containers:** Containers in the Pod shared pool have
    CPU CFS quotas enabled, ensuring they do not consume more than the
    leftover Pod budget and preventing them from interfering with the
    exclusive containers.
-->
- **独占容器：** 具有独占 CPU 切片的容器禁用了其 CPU CFS 配额强制执行，
  允许它们在 Linux 调度器下运行时不被节流。
- **Pod 共享池容器：** Pod 共享池中的容器启用 CPU CFS 配额，
  确保它们消耗的资源不超过剩余的 Pod 预算，
  并防止它们干扰独占容器。

<!--
### Persistent pool and restarts
-->
### 持久池和重启

<!--
The Pod's total resource pool (the NUMA alignment and total reserved
capacity) is persistent. If a container in the Pod's shared pool crashes
and restarts, the Pod's overall resource reservation remains safely
anchored on the Node. The Node releases the resources back to its general
pool only when the entire Pod terminates.
-->
Pod 的总资源池（NUMA 对齐和总保留容量）是持久的。
如果 Pod 共享池中的容器崩溃并重启，Pod 的整体资源保留仍安全地锚定在节点上。
只有当整个 Pod 终止时，节点才会将资源释放回其常规池。

<!--
### `kubelet` downgrades and state checkpoints
-->
### `kubelet` 降级和状态检查点

<!--
In Kubernetes 1.36, enabling `PodLevelResourceManagers` updated internal
`kubelet` state checkpoint files (`cpu_manager_state` and
`memory_manager_state`) to a format that older `kubelet` versions cannot
load. If you downgrade a 1.36 `kubelet` after active use, the older
`kubelet` fails to start; you must drain the Node, delete these checkpoint
files, and restart the `kubelet`.
-->
在 Kubernetes 1.36 中，启用 `PodLevelResourceManagers` 会将内部
`kubelet` 状态检查点文件（`cpu_manager_state` 和 `memory_manager_state`）
更新为旧版 `kubelet` 无法加载的格式。
如果你在活跃使用后降级 1.36 的 `kubelet`，旧版 `kubelet` 将无法启动；
你必须腾空节点、删除这些检查点文件并重启 `kubelet`。

<!--
In Kubernetes 1.37, checkpoint files use a forward-compatible format to
prevent start-up failures during downgrades, though 1.36 `kubelet`
versions do not restore active pod-level resource assignments. For
complete details on checkpoint formats and recovery, see the
[Pod-level resource managers reference](/docs/reference/node/pod-level-resource-managers/#state-checkpoints).
-->
在 Kubernetes 1.37 中，检查点文件使用前向兼容的格式来防止降级期间的启动失败，
尽管 1.36 版本的 `kubelet` 不会恢复活跃的 Pod 级资源分配。
有关检查点格式和恢复的完整详细信息，请参阅
[Pod 级资源管理器参考](/zh-cn/docs/reference/node/pod-level-resource-managers/#state-checkpoints)。

<!--
## Observability and metrics
-->
## 可观测性和指标

<!--
You can monitor the behavior and health of the resource managers across both
container-level and pod-level allocations using the following `kubelet`
metrics (enabled via the `PodLevelResourceManagers` feature gate):
-->
你可以使用以下 `kubelet` 指标（通过 `PodLevelResourceManagers` 特性门控启用）
监控容器级和 Pod 级分配中资源管理器的行为和健康状况：

<!--
-   `resource_manager_allocations_total`: Counts the total number of exclusive
    resource allocations performed by a manager. The `source` label ("pod" or
    "node") distinguishes between allocations drawn from the node-level pool
    versus a pre-allocated pod-level pool.
-   `resource_manager_allocation_errors_total`: Counts errors encountered during
    exclusive resource allocation, distinguished by the intended allocation
    `source` ("pod" or "node").
-   `resource_manager_container_assignments`: Tracks the cumulative number of
    containers that will be granted a specific type of resource assignment. The
    `assignment_type` label ("node_exclusive", "pod_exclusive", "pod_shared")
    provides visibility into how many containers are running with exclusive
    resources (from the node or pod pool) versus the pod-level shared pool.
-->
- `resource_manager_allocations_total`：统计管理器执行的独占资源分配总数。
  `source` 标签（"pod" 或 "node"）区分了从节点级池与从预分配的 Pod 级池中提取的分配。
- `resource_manager_allocation_errors_total`：统计在独占资源分配期间遇到的错误，
  按预期分配的 `source`（"pod" 或 "node"）区分。
- `resource_manager_container_assignments`：跟踪将被授予特定类型资源分配的容器累积数量。
  `assignment_type` 标签（"node_exclusive"、"pod_exclusive"、
  "pod_shared"）提供了对有多少容器使用（来自节点或 Pod 池的）
  独占资源与 Pod 级共享池运行的可见性。

### PodResources API {#podresources-api}

<!--
In Kubernetes 1.37, the `kubelet`'s node-local `PodResources` gRPC API
includes pod-level resource allocations when `PodLevelResourceManagers` is
enabled. Node-local monitoring agents and device plugins can query
top-level Pod assignments (`cpu_ids` and `memory`) while avoiding
double-counting container-level allocations.
-->
在 Kubernetes 1.37 中，当启用 `PodLevelResourceManagers` 时，
`kubelet` 的节点本地 `PodResources` gRPC API 包含 Pod 级资源分配。
节点本地监控代理和设备插件可以查询顶级 Pod 分配（`cpu_ids` 和 `memory`），
同时避免重复计算容器级分配。

<!--
For complete API schemas, field masks, and scope-by-scope reporting tables, see
the
[Pod-level resource managers reference](/docs/reference/node/pod-level-resource-managers/#podresources-api).
-->
有关完整的 API 模式、字段掩码和各范围报告表，请参阅
[Pod 级资源管理器参考](/zh-cn/docs/reference/node/pod-level-resource-managers/#podresources-api)。

<!--
## Limitations and caveats

-   The functionality is only implemented for the `static` CPU Manager policy
    and the `Static` Memory Manager policy. Note that the `BestEffort` policy is
    not supported for the Memory Manager.
-   This feature is only supported on Linux nodes. On Windows nodes, the
    resource managers will act as a no-op for pod-level allocations.
-->
## 限制和注意事项

-   该功能仅针对 `static` CPU 管理器策略和 `Static` 内存管理器策略实现。
    请注意，`BestEffort` 策略不受内存管理器支持。
-   此功能仅在 Linux 节点上受支持。在 Windows 节点上，
    资源管理器对 Pod 级分配将作为空操作（no-op）。

## {{% heading "whatsnext" %}}

<!--
-   Learn how to
    [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/).
-   Follow the
    [Use pod-level resources with `kubelet` resource managers](/docs/tutorials/cluster-management/use-pod-level-resource-managers/)
    tutorial.
-   Read about
    [Node Resource Managers](/docs/concepts/policy/node-resource-managers/).
-->
- 了解如何[分配 Pod 级 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)。
- 遵循[使用 Pod 级资源与 `kubelet` 资源管理器](/zh-cn/docs/tutorials/cluster-management/use-pod-level-resource-managers/)教程。
- 阅读[节点资源管理器](/zh-cn/docs/concepts/policy/node-resource-managers/)。
