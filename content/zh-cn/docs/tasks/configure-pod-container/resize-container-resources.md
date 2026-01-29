---
title: 调整分配给容器的 CPU 和内存资源
content_type: task
weight: 30
min-kubernetes-server-version: 1.33
---
<!--
title: Resize CPU and Memory Resources assigned to Containers
content_type: task
weight: 30
min-kubernetes-server-version: 1.33
-->

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

<!--
This page explains how to change the CPU and memory resource requests and limits
assigned to a container *without recreating the Pod*.
-->
本页面说明了如何在**不重新创建 Pod** 的情况下，更改分配给容器的 CPU 和内存资源请求与限制。

<!--
Traditionally, changing a Pod's resource requirements necessitated deleting the existing Pod
and creating a replacement, often managed by a [workload controller](/docs/concepts/workloads/controllers/).
In-place Pod Resize allows changing the CPU/memory allocation of container(s) within a running Pod
while potentially avoiding application disruption. The process for resizing Pod resources is covered in [Resize CPU and Memory Resources assigned to Pods](/docs/tasks/configure-pod-container/resize-pod-resources).
-->
传统上，更改 Pod 的资源需求需要删除现有 Pod 并创建一个替代 Pod，
这通常由[工作负载控制器](/zh-cn/docs/concepts/workloads/controllers/)管理。
而就地 Pod 调整功能允许在运行中的 Pod 内变更容器的 CPU 和内存分配，从而可能避免干扰应用。
Pod 资源调整的流程详见：[调整分配给 Pod 的 CPU 与内存资源](/zh-cn/docs/tasks/configure-pod-container/resize-pod-resources)。

<!--
**Key Concepts:**

* **Desired Resources:** A container's `spec.containers[*].resources` represent
  the *desired* resources for the container, and are mutable for CPU and memory.
* **Actual Resources:** The `status.containerStatuses[*].resources` field
  reflects the resources *currently configured* for a running container.
  For containers that haven't started or were restarted,
  it reflects the resources allocated upon their next start.
* **Triggering a Resize:** You can request a resize by updating the desired `requests`
  and `limits` in the Pod's specification.
  This is typically done using `kubectl patch`, `kubectl apply`, or `kubectl edit`
  targeting the Pod's `resize` subresource.
  When the desired resources don't match the allocated resources,
  the Kubelet will attempt to resize the container.
* **Allocated Resources (Advanced):**
  The `status.containerStatuses[*].allocatedResources` field tracks resource values
  confirmed by the Kubelet, primarily used for internal scheduling logic.
  For most monitoring and validation purposes, focus on `status.containerStatuses[*].resources`.
-->
**关键概念：**

- **期望资源（Desired Resources）**：容器的 `spec.containers[*].resources`
  字段表示容器的**期望**资源，对于 CPU 和内存是可变的。
- **实际资源（Actual Resources）**：`status.containerStatuses[*].resources`
  字段反映当前运行容器**实际配置**的资源。
  对于尚未启动或重新启动的容器，该字段表示其下次启动时分配的资源。
- **触发调整（Triggering a Resize）**：你可以通过更新 Pod 规约中的 `requests` 和 `limits` 来请求调整。
  这通常通过 `kubectl patch`、`kubectl apply` 或 `kubectl edit` 操作
  Pod 的 `resize` 子资源来完成。
  当期望资源与已分配资源不一致时，Kubelet 会尝试调整容器资源。
- **已分配资源（Allocated Resources，进阶）**：`status.containerStatuses[*].allocatedResources`
  字段用于记录由 Kubelet 确认的资源值，主要用于内部调度逻辑。
  在大多数监控和验证场景中，建议关注 `status.containerStatuses[*].resources` 字段。

<!--
If a node has pods with a pending or incomplete resize (see [Pod Resize Status](#pod-resize-status) below),
the {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} uses
the *maximum* of a container's desired requests, allocated requests,
and actual requests from the status when making scheduling decisions.
-->
如果某个节点上存在处于挂起或未完成调整状态的 Pod（见下文 [Pod 调整状态](#pod-resize-status)），
{{< glossary_tooltip text="调度器" term_id="kube-scheduler" >}}会在进行调度决策时，
使用容器的期望请求、已分配请求和实际请求三者中的**最大值**。

## {{% heading "prerequisites" %}}

<!--
The `InPlacePodVerticalScaling` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
must be enabled
for your control plane and for all nodes in your cluster.

The `kubectl` client version must be at least v1.32 to use the `--subresource=resize` flag.
-->

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

你需要在控制平面和集群中的所有节点上启用 `InPlacePodVerticalScaling` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。  

要使用 `--subresource=resize` 参数，`kubectl` 客户端版本需至少为 v1.32。

<!--
## Pod resize status

The Kubelet updates the Pod's status conditions to indicate the state of a resize request:

* `type: PodResizePending`: The Kubelet cannot immediately grant the request.
  The `message` field provides an explanation of why.
    * `reason: Infeasible`: The requested resize is impossible on the current node
      (for example, requesting more resources than the node has).
    * `reason: Deferred`: The requested resize is currently not possible,
      but might become feasible later (for example if another pod is removed).
      The Kubelet will retry the resize.
* `type: PodResizeInProgress`: The Kubelet has accepted the resize and allocated resources,
  but the changes are still being applied.
  This is usually brief but might take longer depending on the resource type and runtime behavior.
  Any errors during actuation are reported in the `message` field (along with `reason: Error`).
-->
## Pod 大小调整状态   {#pod-resize-status}

Kubelet 会通过更新 Pod 的状态状况来反映调整请求的当前状态：

* `type: PodResizePending`：Kubelet 当前无法立即执行该请求。`message` 字段会说明原因：
  * `reason: Infeasible`：请求的资源在当前节点上不可行（例如请求超出节点总资源）。
  * `reason: Deferred`：请求的资源当前无法满足，但未来可能满足（例如其他 Pod 被移除后），
    Kubelet 会重试调整。
* `type: PodResizeInProgress`：Kubelet 已接受调整并分配了资源，但调整仍在进行中。  
  这一状态通常很短暂，但也可能因资源类型或运行时行为而延长。
  执行过程中的任何错误都会在 `message` 字段中报告，同时带有 `reason: Error`。

<!--
### How kubelet retries Deferred resizes

If the requested resize is _Deferred_, the kubelet will periodically re-attempt the resize,
for example when another pod is removed or scaled down. If there are multiple deferred
resizes, they are retried according to the following priority:

* Pods with a higher Priority (based on PriorityClass) will have their resize request retried first.
* If two pods have the same Priority, resize of guaranteed pods will be retried before the resize of burstable pods.
* If all else is the same, pods that have been in the Deferred state longer will be prioritized.

A higher priority resize being marked as pending will not block the remaining pending resizes from being attempted;
all remaining pending resizes will still be retried even if a higher-priority resize gets deferred again.
-->
### 如何重试 Deferred 调整大小

如果请求的调整大小操作被标记为 **Deferred**，kubelet 会定期重新尝试执行该调整，例如当其他 Pod 被移除或缩容时。
当存在多个延迟的调整操作时，kubelet 会按照以下优先级顺序进行重试：

* 优先级（基于 PriorityClass）较高的 Pod，其调整请求会先被重试。
* 如果两个 Pod 拥有相同的优先级，则会先重试 Guaranteed 类型的 Pod，再重试 Burstable 的类型 Pod。
* 如果上述条件均相同，则优先处理在延迟状态下停留时间更长的 Pod。

需要注意的是，即使高优先级的调整被再次标记为待处理，也不会阻塞其余待处理的调整操作；其余的待处理调整仍会被继续重试。

<!--
### Leveraging `observedGeneration` Fields

{{< feature-state feature_gate_name="PodObservedGenerationTracking" >}}

* The top-level `status.observedGeneration` field shows the `metadata.generation` corresponding to the latest pod specification that the kubelet has acknowledged. You can use this to determine the most recent resize request the kubelet has processed.
* In the `PodResizeInProgress` condition, the `conditions[].observedGeneration` field indicates the `metadata.generation` of the podSpec when the current in-progress resize was initiated.
* In the `PodResizePending` condition, the `conditions[].observedGeneration` field indicates the `metadata.generation` of the podSpec when the pending resize's allocation was last attempted.
-->
### 利用 `observedGeneration` 字段

{{< feature-state feature_gate_name="PodObservedGenerationTracking" >}}

* 顶层的 `status.observedGeneration` 字段显示了 kubelet 已确认的最新 Pod 规约所对应的 `metadata.generation`。
  你可以使用该字段来判断 kubelet 已处理的最近一次调整请求。
* 在 `PodResizeInProgress` 状态条件，`conditions[].observedGeneration` 字段表示当前正在进行的调整操作开始时，
  该 Pod 规约（podSpec）的 `metadata.generation`。
* 在 `PodResizePending` 状态条件，`conditions[].observedGeneration` 字段表示上一次尝试为待处理调整请求分配资源时，
  Pod 规约的 `metadata.generation`。

<!--
## Container resize policies

Containers can specify an optional `resizePolicy` array as part of the resource requirements.
Each entry defines how a particular resource should be handled during in-place resize.
-->
## 容器调整策略   {#container-resize-policies}

容器可以在资源需求中指定可选的 `resizePolicy` 数组。  
该数组中的每一项定义了某种资源在就地调整期间应如何处理。

<!--
You can control whether a container should be restarted when resizing
by setting `resizePolicy` in the container specification.
This allows fine-grained control based on resource type (CPU or memory).
-->
你可以通过在容器规约中设置 `resizePolicy`，控制在调整资源时容器是否需要重启。
这样可以针对不同资源类型（CPU 或内存）进行精细化控制。

```yaml
    resizePolicy:
    - resourceName: cpu
      restartPolicy: NotRequired
    - resourceName: memory
      restartPolicy: RestartContainer
```

<!--
* `NotRequired`: (Default) Apply the resource change to the running container without restarting it.
* `RestartContainer`: Restart the container to apply the new resource values.
  This is often necessary for memory changes because many applications
  and runtimes cannot adjust their memory allocation dynamically.

If `resizePolicy[*].restartPolicy` is not specified for a resource, it defaults to `NotRequired`.
-->
* `NotRequired`：（默认）在不重启容器的情况下应用资源变更。
* `RestartContainer`：重启容器以应用新的资源值。
  对于内存变更，许多应用和运行时无法动态调整内存分配，因此通常需要重启。

如果未为某个资源指定 `resizePolicy[*].restartPolicy`，则默认为 `NotRequired`。

{{< note >}}
<!--
If a Pod's overall `restartPolicy` is `Never`, then any container `resizePolicy` must be `NotRequired` for all resources.
You cannot configure a resize policy that would require a restart in such Pods.
-->
如果 Pod 的整体 `restartPolicy` 为 `Never`，则所有容器的 `resizePolicy` 必须对所有资源都设置为 `NotRequired`。
此类 Pod 不允许配置需要重启的调整策略。
{{< /note >}}

<!--
**Example Scenario:**

Consider a container configured with `restartPolicy: NotRequired` for CPU and `restartPolicy: RestartContainer` for memory.
* If only CPU resources are changed, the container is resized in-place.
* If only memory resources are changed, the container is restarted.
* If *both* CPU and memory resources are changed simultaneously, the container is restarted (due to the memory policy).
-->
**示例场景：**

考虑一个容器，其 CPU 的 `restartPolicy` 为 `NotRequired`，内存的 `restartPolicy` 为 `RestartContainer`：
* 如果仅更改 CPU 资源，容器将原地调整大小。
* 如果仅更改内存资源，容器将重启。
* 如果**同时**更改 CPU 和内存资源，容器将重启（由于内存策略）。

<!--
## Limitations

For Kubernetes v{{< skew currentVersion >}}, resizing pod resources in-place has the following limitations:
-->
## 限制   {#limitations}

对于 Kubernetes v{{< skew currentVersion >}}，原地调整 Pod 资源大小存在以下限制：

<!--
* **Resource Types:** Only CPU and memory resources can be resized.
-->
* **资源类型**：只能调整 CPU 和内存资源。

<!--
* **Memory Decrease:** If the memory resize restart policy is `NotRequired` (or unspecified), the kubelet will make a
best-effort attempt to prevent oom-kills when decreasing memory limits, but doesn't provide any guarantees. 
Before decreasing container memory limits, if memory usage exceeds the requested limit, the resize will be skipped
and the status will remain in an "In Progress" state. This is considered best-effort because it is still subject
to a race condition where memory usage may spike right after the check is performed. 
-->
* **内存减少**：如果内存调整的重启策略为 `NotRequired`（或未指定），kubelet 会尽力在降低内存限制时避免 OOM（内存不足导致的进程被杀死），
  但并不提供任何保证。在降低容器内存限制之前，如果内存使用量已超过请求的限制，则此次调整会被跳过，
  状态将保持在 "In Progress"。之所以称为尽力而为，是因为该过程仍可能受到竞争条件影响：
  在检查完成后，内存使用量可能会立即出现峰值。

<!--
* **QoS Class:** The Pod's original [Quality of Service (QoS) class](/docs/concepts/workloads/pods/pod-qos/)
  (Guaranteed, Burstable, or BestEffort) is determined at creation and **cannot** be changed by a resize.
  The resized resource values must still adhere to the rules of the original QoS class:
    * *Guaranteed*: Requests must continue to equal limits for both CPU and memory after resizing.
    * *Burstable*: Requests and limits cannot become equal for *both* CPU and memory simultaneously
      (as this would change it to Guaranteed).
    * *BestEffort*: Resource requirements (`requests` or `limits`) cannot be added
      (as this would change it to Burstable or Guaranteed).
-->
* **QoS 类**：Pod 的原始[服务质量（QoS）类](/zh-cn/docs/concepts/workloads/pods/pod-qos/)
  （Guaranteed、Burstable 或 BestEffort）在创建时确定，**不能**通过调整大小来更改。
  调整后的资源值仍必须遵守原始 QoS 类的规则：
  * **Guaranteed**：调整后，CPU 和内存的请求必须继续等于限制。
  * **Burstable**：CPU 和内存的请求和限制不能**同时**变为相等
    （因为这会将其更改为 Guaranteed）。
  * **BestEffort**：不能添加资源要求（`requests` 或 `limits`）
    （因为这会将其更改为 Burstable 或 Guaranteed）。

<!--
* **Container Types:** Non-restartable {{< glossary_tooltip text="init containers" term_id="init-container" >}} and
  {{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}} cannot be resized.
  [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) can be resized.
-->
* **容器类型**：不可重启的{{< glossary_tooltip text="Init 容器" term_id="init-container" >}}和
  {{< glossary_tooltip text="临时容器" term_id="ephemeral-container" >}}不能调整大小。
  [边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)可以调整大小。

<!--
* **Resource Removal:** Resource requests and limits cannot be entirely removed once set;
  they can only be changed to different values.
-->
* **资源移除**：一旦设置了资源请求和限制，就不能完全移除；
  只能更改为不同的值。

<!--
* **Operating System:** Windows pods do not support in-place resize.
-->
* **操作系统**：Windows Pod 不支持原地调整大小。

<!--
* **Node Policies:** Pods managed by [static CPU or Memory manager policies](/docs/tasks/administer-cluster/cpu-management-policies/)
  cannot be resized in-place.
-->
* **节点策略**：由[静态 CPU 或内存管理器策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)管理的
  Pod 不能原地调整大小。

<!--
* **Swap:** Pods utilizing [swap memory](/docs/concepts/architecture/nodes/#swap-memory) cannot resize memory requests
  unless the `resizePolicy` for memory is `RestartContainer`.
-->
* **交换内存**：使用[交换内存](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)的 Pod 不能调整内存请求，
  除非内存的 `resizePolicy` 为 `RestartContainer`。

<!--
These restrictions might be relaxed in future Kubernetes versions.
-->
这些限制可能会在未来的 Kubernetes 版本中放宽。

<!--
## Example 1: Resizing CPU without restart

First, create a Pod designed for in-place CPU resize and restart-required memory resize.
-->
## 示例 1：调整 CPU 而不重启   {#example-1-resizing-cpu-without-restart}

首先，创建一个设计用于原地 CPU 调整和需要重启的内存调整的 Pod。

{{% code_sample file="pods/resource/pod-resize.yaml" %}}

<!--
Create the pod:
-->
创建 Pod：

```shell
kubectl create -f pod-resize.yaml
```

<!--
This pod starts in the Guaranteed QoS class. Verify its initial state:
-->
这个 Pod 以 Guaranteed QoS 类启动。验证其初始状态：

```shell
# 等待 Pod 运行
kubectl get pod resize-demo --output=yaml
```

<!--
Observe the `spec.containers[0].resources` and `status.containerStatuses[0].resources`.
They should match the manifest (700m CPU, 200Mi memory). Note the `status.containerStatuses[0].restartCount` (should be 0).
-->
观察 `spec.containers[0].resources` 和 `status.containerStatuses[0].resources`。
它们应该与清单文件匹配（700m CPU，200Mi 内存）。注意 `status.containerStatuses[0].restartCount`（应该为 0）。

<!--
Now, increase the CPU request and limit to `800m`. You use `kubectl patch` with the `--subresource resize` command line argument.
-->
现在，将 CPU 请求和限制增加到 `800m`。使用带有 `--subresource resize` 命令行参数的 `kubectl patch`。

```shell
kubectl patch pod resize-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"cpu":"800m"}, "limits":{"cpu":"800m"}}}]}}'

# 替代方法：
# kubectl -n qos-example edit pod resize-demo --subresource resize
# kubectl -n qos-example apply -f <updated-manifest> --subresource resize --server-side
```

{{< note >}}
<!--
The `--subresource resize` command line argument requires `kubectl` client version v1.32.0 or later.
Older versions will report an `invalid subresource` error.
-->
`--subresource resize` 命令行参数要求 `kubectl` 客户端版本为 v1.32.0 或更高。
较早版本会报告 `invalid subresource` 错误。
{{< /note >}}

<!--
Check the pod status again after patching:
-->
在应用补丁后再次检查 Pod 状态：

```shell
kubectl get pod resize-demo --output=yaml --namespace=qos-example
```

<!--
You should see:
* `spec.containers[0].resources` now shows `cpu: 800m`.
* `status.containerStatuses[0].resources` also shows `cpu: 800m`, indicating the resize was successful on the node.
* `status.containerStatuses[0].restartCount` remains `0`, because the CPU `resizePolicy` was `NotRequired`.
-->
你应该看到：
* `spec.containers[0].resources` 现在显示 `cpu: 800m`。
* `status.containerStatuses[0].resources` 也显示 `cpu: 800m`，表明节点上的调整已成功。
* `status.containerStatuses[0].restartCount` 保持为 `0`，因为 CPU 的 `resizePolicy` 是 `NotRequired`。

<!--
## Example 2: Resizing memory with restart

Now, resize the memory for the *same* pod by increasing it to `300Mi`.
Since the memory `resizePolicy` is `RestartContainer`, the container is expected to restart.
-->
## 示例 2：调整内存并重启   {#example-2-resizing-memory-with-restart}

现在，将**同一个** Pod 的内存增加到 `300Mi`。
由于内存的 `resizePolicy` 是 `RestartContainer`，容器将会重启。

```shell
kubectl patch pod resize-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"memory":"300Mi"}, "limits":{"memory":"300Mi"}}}]}}'
```

<!--
Check the pod status shortly after patching:
-->
在应用补丁后立即检查 Pod 状态：

```shell
kubectl get pod resize-demo --output=yaml
```

<!--
You should now observe:
* `spec.containers[0].resources` shows `memory: 300Mi`.
* `status.containerStatuses[0].resources` also shows `memory: 300Mi`.
* `status.containerStatuses[0].restartCount` has increased to `1` (or more, if restarts happened previously),
  indicating the container was restarted to apply the memory change.
-->
你现在应该观察到：
* `spec.containers[0].resources` 显示 `memory: 300Mi`。
* `status.containerStatuses[0].resources` 也显示 `memory: 300Mi`。
* `status.containerStatuses[0].restartCount` 增加到 `1`（如果之前发生过重启，可能会更多），
  表明容器已重启以应用内存变更。

<!--
## Troubleshooting: Infeasible resize request

Next, try requesting an unreasonable amount of CPU, such as 1000 full cores (written as `"1000"` instead of `"1000m"` for millicores), which likely exceeds node capacity.
-->
## 故障排查：不可行的调整请求   {#troubleshooting-infeasible-resize-request}

接下来，尝试请求不合理的 CPU 数量，例如 1000 个完整核心（写作 `"1000"` 而不是 `"1000m"` 毫核），这很可能超出节点容量。

```shell
# 尝试使用过大的 CPU 请求进行补丁
kubectl patch pod resize-demo --subresource resize --patch \
  '{"spec":{"containers":[{"name":"pause", "resources":{"requests":{"cpu":"1000"}, "limits":{"cpu":"1000"}}}]}}'
```

<!--
Query the Pod's details:
-->
查询 Pod 的详细信息：

```shell
kubectl get pod resize-demo --output=yaml
```

<!--
You'll see changes indicating the problem:

* The `spec.containers[0].resources` reflects the *desired* state (`cpu: "1000"`).
* A condition with `type: PodResizePending` and `reason: Infeasible` was added to the Pod.
* The condition's `message` will explain why (`Node didn't have enough capacity: cpu, requested: 800000, capacity: ...`)
* Crucially, `status.containerStatuses[0].resources` will *still show the previous values* (`cpu: 800m`, `memory: 300Mi`),
  because the infeasible resize was not applied by the Kubelet.
* The `restartCount` will not have changed due to this failed attempt.

To fix this, you would need to patch the pod again with feasible resource values.
-->
你会看到表明问题的变更：

* `spec.containers[0].resources` 反映了**期望**状态（`cpu: "1000"`）。
* Pod 添加了一个 `type: PodResizePending` 和 `reason: Infeasible` 的条件。
* 状况的 `message` 会解释原因（`Node didn't have enough capacity: cpu, requested: 800000, capacity: ...`）
* 重要的是，`status.containerStatuses[0].resources` **仍然显示之前的值**（`cpu: 800m`，`memory: 300Mi`），
  因为不可行的调整未被 Kubelet 应用。
* 由于这次失败的尝试，`restartCount` 不会发生变化。

要修复这个问题，你需要使用可行的资源值再次对 Pod 进行补丁。

<!--
## Clean up

Delete the pod:
-->
## 清理   {#clean-up}

删除 Pod：

```shell
kubectl delete pod resize-demo
```

## {{% heading "whatsnext" %}}

<!--
### For application developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
-->
### 对于应用开发人员

* [为容器和 Pod 分配内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)

* [为容器和 Pod 分配 CPU 资源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [分配 Pod 级别的 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
-->
### 对于集群管理员

* [为名字空间配置默认内存请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [为名字空间配置默认 CPU 请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [为名字空间配置最小和最大内存约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [为名字空间配置最小和最大 CPU 约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [为名字空间配置内存和 CPU 配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
