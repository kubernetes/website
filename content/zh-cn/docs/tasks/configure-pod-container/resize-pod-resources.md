---
title: 调整分配给 Pod 的 CPU 和内存资源
content_type: task
weight: 30
min-kubernetes-server-version: 1.35
---
<!--
title: Resize CPU and Memory Resources assigned to Pods
content_type: task
weight: 30
min-kubernetes-server-version: 1.35
-->

<!-- overview -->

{{< feature-state feature_gate_name="InPlacePodLevelResourcesVerticalScaling" >}}

<!--
This page explains how to change the CPU and memory resources set at the Pod level without recreating the Pod.
-->
本页面说明了如何在**不重新创建 Pod** 的情况下，更改在 Pod 级别设置的 CPU 和内存资源。

<!--
The In-place Pod Resize feature allows modifying resource allocations for a running Pod, avoiding application disruption. The process for resizing individual container resources is covered in [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources).
-->
就地 Pod 调整功能允许修改运行中 Pod 的资源分配，从而避免干扰应用。
调整单个容器资源的流程详见[调整分配给容器的 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources)。

<!--
This page highlights In-place Pod-level resources resize. Pod-level resources
are defined in `spec.resources` and they act as the upper bound on the aggregate resources
consumed by all containers in the Pod. The In-place Pod-level resources resize feature
lets you change these aggregate CPU and memory allocations for a running Pod directly.
-->
本页面重点介绍就地 Pod 级别资源调整。Pod 级别资源定义在 `spec.resources` 中，
作为 Pod 中所有容器消耗资源的总量上限。就地 Pod 级别资源调整功能允许你直接更改运行中
Pod 的这些 CPU 和内存总量分配。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
The following [feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
must be enabled for your control plane and for all nodes in your cluster:

* [`InPlacePodLevelResourcesVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodLevelResourcesVerticalScaling)
* [`PodLevelResources`](/docs/reference/command-line-tools-reference/feature-gates/#PodLevelResources)
* [`InPlacePodVerticalScaling`](/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodVerticalScaling)
* [`NodeDeclaredFeatures`](/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures)

The kubectl client version must be at least v1.32 to use the `--subresource=resize` flag.
-->
你需要在控制平面和集群中的所有节点上启用以下[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)：

* [`InPlacePodLevelResourcesVerticalScaling`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodLevelResourcesVerticalScaling)
* [`PodLevelResources`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#PodLevelResources)
* [`InPlacePodVerticalScaling`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#InPlacePodVerticalScaling)
* [`NodeDeclaredFeatures`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures)

要使用 `--subresource=resize` 参数，`kubectl` 客户端版本需至少为 v1.32。

<!--
## Pod Resize Status and Retry Logic

The mechanism the `kubelet` uses to track and retry resource changes is shared between container-level and Pod-level resize requests.

The statuses, reasons, and retry priorities are identical to those defined for container resize:
-->
## Pod 调整状态和重试逻辑   {#pod-resize-status-and-retry-logic}

`kubelet` 用于跟踪和重试资源变更的机制在容器级别和 Pod 级别的调整请求之间是共享的。

状态、原因和重试优先级与容器调整中定义的完全相同：

<!--
* Status Conditions: The `kubelet` uses PodResizePending (with reasons like Infeasible or Deferred) and PodResizeInProgress to communicate the state of the request.

* Retry Priority: Deferred resizes are retried based on PriorityClass, then QoS class (Guaranteed over Burstable), and finally by the duration they have been deferred.

* Tracking: You can use the `observedGeneration` fields to track which Pod specification (metadata.generation) corresponds to the status of the latest processed resize request.

For a full description of these conditions and retry logic, please refer to the [Pod resize status](/docs/tasks/configure-pod-container/resize-container-resources/#pod-resize-status) section in the container resize documentation.
-->
* 状态条件：`kubelet` 使用 PodResizePending（原因如 Infeasible 或 Deferred）和
  PodResizeInProgress 来传达请求的状态。
* 重试优先级：Deferred 调整根据 PriorityClass 进行重试，然后是 QoS
  类（Guaranteed 优先于 Burstable），最后按被延迟的持续时间排序。
* 跟踪：你可以使用 `observedGeneration` 字段来跟踪哪个 Pod
  规约（`metadata.generation`）对应于最近处理的调整请求的状态。

有关这些条件和重试逻辑的完整描述，参阅容器调整文档中的
[Pod 调整状态](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/#pod-resize-status)部分。

<!--
## Container Resize Policy and Pod-Level Resize

Pod-level resource resize does not support or require its own restart policy.

* No Pod-Level Policy: Changes to the Pod's aggregate resources (spec.resources) are always applied in-place without triggering a restart. This is because Pod-level resources act as an overall constraint on the Pod's cgroup and do not directly manage the application runtime within containers.

* [Container Policy](/docs/tasks/configure-pod-container/resize-container-resources/#container-resize-policies) Still Governs: The resizePolicy must still be configured at the container level (spec.containers[*].resizePolicy). This policy governs whether an individual container is restarted when its resource requests or limits change, regardless of whether that change was initiated by a direct container-level resize or by an update to the overall Pod-level resource envelope.
-->
## 容器调整策略和 Pod 级别调整   {#container-resize-policy-and-pod-level-resize}

Pod 级别资源调整不支持也不需要自己的重启策略。

* 无 Pod 级别策略：对 Pod 总量资源（`spec.resources`）的更改始终就地应用，不会触发重启。
  这是因为 Pod 级别资源作为 Pod cgroup 的整体约束，不直接管理容器内的应用运行时。

* [容器策略](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/#container-resize-policies)仍然有效：
  `resizePolicy` 仍必须在容器级别（`spec.containers[*].resizePolicy`）配置。
  此策略控制当单个容器的资源请求或限制发生变更时是否重启该容器，无论该变更是由直接的容器级别调整发起的，
  还是由整体 Pod 级别资源边界的更新发起的。

<!--
## Limitations

For Kubernetes {{< skew currentVersion >}}, resizing Pod-level resources in-place is subject to all the limitations described for container-level resource resize, which you can find here: [Resize CPU and Memory Resources assigned to Containers: Limitations](/docs/tasks/configure-pod-container/resize-container-resources/#limitations).

Additionally, the following constraint is specific to Pod-level resource resize:
* Container Requests Validation: A resize is only permitted if the resulting
  Pod-level resource requests (spec.resources.requests) are greater than or equal to
  the sum of the corresponding resource requests from all individual containers
  within the Pod. This maintains the minimum guaranteed resource availability for
  the Pod.

* Container Limits Validation: A resize is permitted if individual container limits
  are less than or equal to the Pod-level resource limits (spec.resources.limits).
  The Pod-level limit serves as a boundary that no single container may exceed, but
  the sum of container limits is permitted to exceed the Pod-level limit, enabling
  resource sharing across containers within the Pod.
-->
## 限制   {#limitations}

对于 Kubernetes {{< skew currentVersion >}}，就地调整 Pod 级别资源受限于容器级别资源调整中描述的所有限制，
详见[调整分配给容器的 CPU 和内存资源：限制](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/#limitations)。

此外，以下约束是 Pod 级别资源调整特有的：

* 容器请求验证：仅当调整后的 Pod 级别资源请求（`spec.resources.requests`）大于或等于
  Pod 中所有单个容器的对应资源请求之和时，才允许调整。这确保了 Pod 的最低保证资源可用性。

* 容器限制验证：当单个容器限制小于或等于 Pod 级别资源限制（`spec.resources.limits`）时，
  允许调整。Pod 级别限制作为一个边界，任何单个容器都不能超过，但容器限制之和允许超过
  Pod 级别限制，从而实现 Pod 内容器之间的资源共享。

<!--
## Example: Resizing Pod-Level Resources

First, create a Pod designed for in-place CPU resize and restart-required memory resize.
-->
## 示例：调整 Pod 级别资源   {#example-resizing-pod-level-resources}

首先，创建一个设计用于就地 CPU 调整和需要重启的内存调整的 Pod。

{{% code_sample file="pods/resource/pod-level-resize.yaml" %}}

<!--
Create the pod:
-->
创建 Pod：

```shell
kubectl create -f pod-level-resize.yaml
```

<!--
This pod starts in the Guaranteed QoS class as pod-level requests are equal to limits. Verify its initial state:

```shell
# Wait a moment for the pod to be running
kubectl get pod pod-level-resize-demo --output=yaml
```
-->
此 Pod 以 Guaranteed QoS 类启动，因为 Pod 级别的请求等于限制。验证其初始状态：

```shell
# 等待 Pod 运行
kubectl get pod pod-level-resize-demo --output=yaml
```

<!--
Observe the `spec.resources`(200m CPU, 200Mi memory). Note the
`status.containerStatuses[0].restartCount` (should be 0) and
`status.containerStatuses[1].restartCount` (should be 0).
-->
观察 `spec.resources`（200m CPU，200Mi 内存）。注意
`status.containerStatuses[0].restartCount`（应为 0）和
`status.containerStatuses[1].restartCount`（应为 0）。

<!--
Now, increase the pod-level CPU request and limit to `300m`. You use `kubectl patch` with the `--subresource resize` command line argument.

```shell
kubectl patch pod pod-level-resize-demo --subresource resize --patch \
  '{"spec":{"resources":{"requests":{"cpu":"300m"}, "limits":{"cpu":"300m"}}}}'

# Alternative methods:
# kubectl edit pod pod-level-resize-demo --subresource resize
# kubectl apply -f <updated-manifest> --subresource resize --server-side
```
-->
现在，将 Pod 级别的 CPU 请求和限制增加到 `300m`。使用带有 `--subresource resize` 命令行参数的 `kubectl patch`。

```shell
kubectl patch pod pod-level-resize-demo --subresource resize --patch \
  '{"spec":{"resources":{"requests":{"cpu":"300m"}, "limits":{"cpu":"300m"}}}}'

# 替代方法：
# kubectl edit pod pod-level-resize-demo --subresource resize
# kubectl apply -f <updated-manifest> --subresource resize --server-side
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
kubectl get pod pod-level-resize-demo --output=yaml
```

<!--
You should see:
* `spec.resources.requests` and `spec.resources.limits` now show `cpu: 300m`.
* `status.containerStatuses[0].restartCount` remains `0`, because the CPU
  `resizePolicy` was `NotRequired`.
* `status.containerStatuses[1].restartCount` increased to `1` indicating the
  container was restarted to apply the CPU change. The restart occurred in Container 1 despite the resize being applied at the Pod level, due to the intricate relationship between Pod-level limits and container-level policies. Because Container 1 did not specify an explicit CPU limit, its underlying resource configuration (For example, cgroups) implicitly adopted the Pod's overall CPU limit as its effective maximum consumption boundary. When the Pod-level CPU limit was patched from 200m to 300m, this action consequently changed the implicit limit enforced on Container 1. Since Container 1 had its resizePolicy explicitly set to RestartContainer for CPU, the `kubelet` was obligated to restart the container to correctly apply this change in the underlying resource enforcement mechanism, thus confirming that altering Pod-level limits can trigger container restart policies even when container limits are not directly defined.
-->
你应该看到：

* `spec.resources.requests` 和 `spec.resources.limits` 现在显示 `cpu: 300m`。
* `status.containerStatuses[0].restartCount` 保持为 `0`，因为 CPU 的
  `resizePolicy` 为 `NotRequired`。
* `status.containerStatuses[1].restartCount` 增加到 `1`，表明容器已重启以应用 CPU 变更。
  尽管调整是在 Pod 级别应用的，容器 1 仍然发生了重启，这是由于 Pod 级别限制与容器级别策略之间的复杂关系所致。
  由于容器 1 未指定显式的 CPU 限制，其底层资源配置（例如 cgroups）隐式地将 Pod 的整体 CPU
  限制作为其有效的最大消耗边界。当 Pod 级别的 CPU 限制从 200m 修补为 300m 时，此操作也随之改变了容器
  1 上实施的隐式限制。由于容器 1 的 `resizePolicy` 对 CPU 显式设置为 `RestartContainer`，
  `kubelet` 必须重启容器以正确应用底层资源执行机制中的此变更，
  这证实了即使在未直接定义容器限制的情况下，更改 Pod 级别限制也能触发容器重启策略。

<!--
## Clean up

Delete the pod:
-->
## 清理   {#clean-up}

删除 Pod：

```shell
kubectl delete pod pod-level-resize-demo
```

## {{% heading "whatsnext" %}}

<!--
### For application developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)
-->
### 对于应用开发者

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

* [为命名空间配置默认内存请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [为命名空间配置默认 CPU 请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [为命名空间配置最小和最大内存约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [为命名空间配置最小和最大 CPU 约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [为命名空间配置内存和 CPU 配额](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
