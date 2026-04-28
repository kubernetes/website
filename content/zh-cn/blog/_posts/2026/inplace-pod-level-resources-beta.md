---
layout: blog
title: "Kubernetes v1.36：Pod 级别资源的原地垂直扩缩容升级至 Beta 版本"
draft: true
slug: kubernetes-v1-36-inplace-pod-level-resources-beta
author: Narang Dixita Sohanlal (Google)
translator: >
  [Xin Li](https://github.com/my-git9)
---
<!--
layout: blog
title: "Kubernetes v1.36: In-Place Vertical Scaling for Pod-Level Resources Graduates to Beta"
draft: true
slug: kubernetes-v1-36-inplace-pod-level-resources-beta
author: Narang Dixita Sohanlal (Google)
-->

<!--
Following the graduation of Pod-Level Resources to Beta in v1.34 and the General Availability (GA)
of In-Place Pod Vertical Scaling in v1.35, the Kubernetes community is thrilled to announce
that **In-Place Pod-Level Resources Vertical Scaling has graduated to Beta in v1.36!**

This feature is now enabled by default via the `InPlacePodLevelResourcesVerticalScaling`
feature gate. It allows users to update the aggregate Pod resource budget (`.spec.resources`)
for a running Pod, **often without requiring a container restart.**
-->
在 v1.34 中 Pod 级别资源升级到 Beta 版本，以及 v1.35 中原地 Pod 垂直扩缩容达到正式可用（GA）之后，
Kubernetes 社区非常高兴地宣布：**Pod 级别资源的原地垂直扩缩容已在 v1.36 中升级到 Beta 版本！**

此特性现在通过 InPlacePodLevelResourcesVerticalScaling 特性门控默认启用。
它允许用户更新运行中 Pod 的聚合 Pod 资源预算（`.spec.resources`），**通常不需要容器重启**。

<!--
## Why Pod-level in-place resize?

The Pod-level resource model simplified management for complex Pods (such as those with sidecars)
by allowing containers to share a collective pool of resources. In v1.36, you can now adjust
this aggregate boundary on-the-fly.

This is particularly useful for Pods where containers do not have individual limits defined.
These containers automatically scale their effective boundaries to fit the newly resized
Pod-level dimensions, allowing you to expand the shared pool during peak demand without
manual per-container recalculations.
-->
## 为什么需要 Pod 级别的原地调整大小？ {#why-pod-level-in-place-resize}

Pod 级别的资源模型通过允许容器共享一个集体资源池，简化了复杂 Pod（例如带有边车容器的 Pod）的管理。
在 v1.36 中，你现在可以动态调整这个聚合边界。

这对于没有定义单个容器限制的 Pod 特别有用。这些容器会自动调整其有效边界以适应新调整大小的 Pod 级维度，
允许你在高峰需求期间扩展共享池，而无需手动重新计算每个容器。

<!--
## Resource inheritance and the `resizePolicy`

When a Pod-level resize is initiated, the Kubelet treats the change as a resize event for
every container that inherits its limits from the Pod-level budget. To determine whether a
restart is required, the Kubelet consults the `resizePolicy` defined within individual containers:

*   **Non-disruptive Updates:** If a container's `restartPolicy` is set to `NotRequired`,
    the Kubelet attempts to update the cgroup limits dynamically via the Container Runtime
    Interface (CRI).
*   **Disruptive Updates:** If set to `RestartContainer`, the container will be restarted
    to apply the new aggregate boundary safely.

> **Note:** Currently, `resizePolicy` is not supported at the Pod level. The Kubelet always
> defers to individual container settings to decide if an update can be applied in-place or
> requires a restart.
-->
## 资源继承和 `resizePolicy` {#resource-inheritance-and-the-resizepolicy}

当启动 Pod 级别的调整大小时，kubelet 将此更改视为每个从 Pod 级预算继承其限制的容器的调整大小事件。
为了确定是否需要重启，kubelet 会参考各个容器中定义的 `resizePolicy`：

* **非破坏性更新**：如果容器的 `restartPolicy` 设置为 `NotRequired`，kubelet
  会尝试通过容器运行时接口（CRI）动态更新 CGroup 限制。
* **破坏性更新**：如果设置为 `RestartContainer`，容器将被重启以安全应用新的聚合边界。

> **注意**：目前，`resizePolicy` 不支持在 Pod 级别设置。kubelet 始终遵循各个容器的设置来决定更新是否可以原地应用或需要重启。

<!--
## Example: ccaling a shared resource pool

In this scenario, a Pod is defined with a 2 CPU pod-level limit. Because the individual
containers do not have their own limits defined, they share this total pool.

### 1. Initial Pod specification
-->
## 示例：调整共享资源池大小 {#example-ccaling-a-shared-resource-pool}

在这个场景中，一个 Pod 定义了 2 CPU 的 Pod 级别限制。由于各个容器没有定义自己的限制，它们共享这个总池。

### 1. 初始 Pod 规范

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: shared-pool-app
spec:
  resources: # Pod-level limits
    limits:
      cpu: "2"
      memory: "4Gi"
  containers:
  - name: main-app
    image: my-app:v1
    resizePolicy: [{resourceName: "cpu", restartPolicy: "NotRequired"}]
  - name: sidecar
    image: logger:v1
    resizePolicy: [{resourceName: "cpu", restartPolicy: "NotRequired"}]
```

<!--
### 2. The resize operation

To double the CPU capacity to 4 CPUs, apply a patch using the `resize` subresource:
-->
### 2. 调整大小操作

要将 CPU 容量增加一倍至 4 个 CPU，请使用 `resize` 子资源应用补丁：

```bash
kubectl patch pod shared-pool-app --subresource resize --patch \
  '{"spec":{"resources":{"limits":{"cpu":"4"}}}}'
```

<!--
## Node-Level reality: feasibility and safety

Applying a resize patch is only the first step. The Kubelet performs several checks and follows
a specific sequence to ensure node stability:

### 1. The feasibility check

Before admitting a resize, the Kubelet verifies if the new aggregate request fits within
the Node's allocatable capacity. If the Node is overcommitted, the resize is not ignored;
instead, the `PodResizePending` condition will reflect a `Deferred` or `Infeasible` status,
providing immediate feedback on why the "envelope" hasn't grown.
-->
## 节点级现实：可行性和安全性 {#node-level-reality-feasibility-and-safety}

应用调整大小补丁只是第一步。kubelet 执行多项检查并遵循特定顺序以确保节点稳定性：

### 1. 可行性检查

在接受调整大小之前，kubelet 会验证新的聚合请求是否适合节点的可分配容量。
如果节点过度承诺，调整大小不会被忽略；相反，`PodResizePending` 条件会反映 `Deferred` 或 `Infeasible` 状态，
提示为什么“信封”没有增长的即时反馈。

<!--
### 2. Update sequencing

To prevent resource "overshoot," the Kubelet coordinates the cgroup updates in a specific order:
*   **When Increasing:** The Pod-level cgroup is expanded first, creating the "room" before
    the individual container cgroups are enlarged.
*   **When Decreasing:** The container cgroups are throttled first, and only then is the
    aggregate Pod-level cgroup shrunken.
-->
### 2. 更新顺序

为防止资源“超调”，kubelet 按特定顺序协调 CGroup 更新：
* **增加时**：首先扩展 Pod 级 CGroup，在扩大各个容器 CGroup 之前创建“空间”。
* **减少时**：首先限制容器 CGroup，然后才缩小聚合 Pod 级 CGroup。

<!--
## Observability: tracking resize status

With the move to Beta, Kubernetes uses **Pod Conditions** to track the lifecycle of a resize:

*   **`PodResizePending`**: The spec is updated, but the Node hasn't admitted the change
    (e.g., due to capacity).
*   **`PodResizeInProgress`**: The Node has admitted the resize (`status.allocatedResources`)
    but the changes aren't yet fully applied to the cgroups (`status.resources`).
-->
## 可观测性：跟踪调整大小状态 {#observability-tracking-resize-status}

随着升级到 Beta 版本，Kubernetes 使用 **Pod 状况**来跟踪调整大小的生命周期：

* **`PodResizePending`**：规范已更新，但节点尚未接受更改（例如，由于容量）。
* **`PodResizeInProgress`**：节点已接受调整大小（`status.allocatedResources`），
  但更改尚未完全应用到 CGroup（`status.resources`）。

```yaml
status:
  allocatedResources:
    cpu: "4"
  resources:
    limits:
      cpu: "4"
  conditions:
  - type: PodResizeInProgress
    status: "True"
```

<!--
## Constraints and requirements

*   **cgroup v2 Only:** Required for accurate aggregate enforcement.
*   **CRI Support:** Requires a container runtime that supports the `UpdateContainerResources`
    CRI call (e.g., containerd v2.0+ or CRI-O).
*   **Feature Gates:** Requires `PodLevelResources`, `InPlacePodVerticalScaling`,
    `InPlacePodLevelResourcesVerticalScaling`, and `NodeDeclaredFeatures`.
*   **Linux Only:** Currently exclusive to Linux-based nodes.
-->
## 约束和要求 {#constraints-and-requirements}

* **仅支持 CGroup v2**：准确的聚合执行所必需。
* **CRI 支持**：需要支持 `UpdateContainerResources` CRI 调用的容器运行时（例如 containerd v2.0+ 或 CRI-O）。
* **特性门控**：需要 `PodLevelResources`、`InPlacePodVerticalScaling`、`InPlacePodLevelResourcesVerticalScaling`
  和 `NodeDeclaredFeatures`。
* **仅支持 Linux**：目前仅适用于基于 Linux 的节点。

<!--
## What's next?

As we move toward General Availability (GA), the community is focusing on **Vertical Pod Autoscaler
(VPA) Integration**, enabling VPA to issue Pod-level resource recommendations and trigger
in-place actuation automatically.
-->
## 下一步 {#whats-next}

在我们向正式可用（GA）迈进的过程中，社区正在专注于**垂直 Pod 自动缩放器（VPA）集成**，
使 VPA 能够发布 Pod 级资源建议并自动触发原地执行。

<!--
## Getting started and providing feedback

We encourage you to test this feature and provide feedback via the standard Kubernetes
communication channels:

*   Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
*   [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
*   [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
-->
## 开始使用并提供反馈 {#getting-started-and-providing-feedback}

我们鼓励你测试此特性并通过标准的 Kubernetes 沟通渠道提供反馈：

* Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
* [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
* [开放社区 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnode)
