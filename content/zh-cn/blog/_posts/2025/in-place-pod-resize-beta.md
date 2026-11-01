---
layout: blog
title: "Kubernetes v1.33：原地调整 Pod 资源特性升级为 Beta"
slug: kubernetes-v1-33-in-place-pod-resize-beta
date: 2025-05-16T10:30:00-08:00
author: "Tim Allclair (Google)"
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.33: In-Place Pod Resize Graduated to Beta"
slug: kubernetes-v1-33-in-place-pod-resize-beta
date: 2025-05-16T10:30:00-08:00
author: "Tim Allclair (Google)"
-->

<!--
On behalf of the Kubernetes project, I am excited to announce that the **in-place Pod resize** feature (also known as In-Place Pod Vertical Scaling), first introduced as alpha in Kubernetes v1.27, has graduated to **Beta** and will be enabled by default in the Kubernetes v1.33 release! This marks a significant milestone in making resource management for Kubernetes workloads more flexible and less disruptive.
-->
代表 Kubernetes 项目，我很高兴地宣布，**原地 Pod 调整大小**特性（也称为原地 Pod 垂直缩放），
在 Kubernetes v1.27 中首次引入为 Alpha 版本，现在已升级为 **Beta** 版本，
并将在 Kubernetes v1.33 发行版中默认启用！
这标志着 Kubernetes 工作负载的资源管理变得更加灵活和不那么具有干扰性的一个重要里程碑。

<!--
## What is in-place Pod resize?

Traditionally, changing the CPU or memory resources allocated to a container required restarting the Pod. While acceptable for many stateless applications, this could be disruptive for stateful services, batch jobs, or any workloads sensitive to restarts.
-->
## 什么是原地 Pod 调整大小？   {#what-is-in-place-pod-resize}

传统上，更改分配给容器的 CPU 或内存资源需要重启 Pod。
虽然这对于许多无状态应用来说是可以接受的，
但这对于有状态服务、批处理作业或任何对重启敏感的工作负载可能会造成干扰。

<!--
In-place Pod resizing allows you to change the CPU and memory requests and limits assigned to containers within a *running* Pod, often without requiring a container restart.
-->
原地 Pod 调整大小允许你更改**运行中**的 Pod 内容器的 CPU
和内存请求及限制，通常无需重启容器。

<!--
Here's the core idea:
* The `spec.containers[*].resources` field in a Pod specification now represents the *desired* resources and is mutable for CPU and memory.
* The `status.containerStatuses[*].resources` field reflects the *actual* resources currently configured on a running container.
* You can trigger a resize by updating the desired resources in the Pod spec via the new `resize` subresource.
-->
核心思想如下：

* Pod 规约中的 `spec.containers[*].resources` 字段现在代表**期望的**资源，并且对于 CPU 和内存是可变更的。
* `status.containerStatuses[*].resources` 字段反映当前运行容器上已配置的**实际**资源。
* 你可以通过新的 `resize` 子资源更新 Pod 规约中的期望资源来触发调整大小。

<!--
You can try it out on a v1.33 Kubernetes cluster by using kubectl to edit a Pod (requires `kubectl` v1.32+):
-->
你可以在 v1.33 的 Kubernetes 集群上使用 kubectl 编辑
Pod 来尝试（需要 v1.32+ 的 kubectl）：

<!--
```shell
kubectl edit pod <pod-name> --subresource resize
```
-->
```shell
kubectl edit pod <Pod 名称> --subresource resize
```

<!--
For detailed usage instructions and examples, please refer to the official Kubernetes documentation:
[Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/).
-->
有关详细使用说明和示例，请参阅官方 Kubernetes 文档：
[调整分配给容器的 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)。

<!--
## Why does in-place Pod resize matter?

Kubernetes still excels at scaling workloads horizontally (adding or removing replicas), but in-place Pod resizing unlocks several key benefits for vertical scaling:
-->
## 为什么原地 Pod 调整大小很重要？   {#why-does-in-place-pod-resize-matter}

Kubernetes 在水平扩缩工作负载（添加或移除副本）方面仍然表现出色，但原地
Pod 调整大小为垂直扩缩解锁了几个关键优势：

<!--
* **Reduced Disruption:** Stateful applications, long-running batch jobs, and sensitive workloads can have their resources adjusted without suffering the downtime or state loss associated with a Pod restart.
* **Improved Resource Utilization:** Scale down over-provisioned Pods without disruption, freeing up resources in the cluster. Conversely, provide more resources to Pods under heavy load without needing a restart.
* **Faster Scaling:** Address transient resource needs more quickly. For example Java applications often need more CPU during startup than during steady-state operation. Start with higher CPU and resize down later.
-->
* **减少干扰：** 有状态应用、长时间运行的批处理作业和敏感工作负载可以在不经历
  Pod 重启相关的停机或状态丢失的情况下调整资源。

* **改进资源利用率：** 无需中断即可缩小过度配置的 Pod，从而释放集群中的资源。
  相反，在重负载下的 Pod 可以在不重启的情况下获得更多的资源。

* **更快的扩缩：** 更快速地解决瞬时资源需求。例如，Java
  应用在启动期间通常比在稳定状态下需要更多的 CPU。
  可以开始时使用更高的 CPU 配置，然后在之后调整减小。

<!--
## What's changed between Alpha and Beta?

Since the alpha release in v1.27, significant work has gone into maturing the feature, improving its stability, and refining the user experience based on feedback and further development. Here are the key changes:
-->
## 从 Alpha 到 Beta 有哪些变化？   {#whats-changed-between-alpha-and-beta}

自从 v1.27 的 Alpha 版本发布以来，为了完善此特性、
提高其稳定性并根据反馈和进一步开发优化用户体验，已经进行了大量工作。
以下是关键变化：

<!--
### Notable user-facing changes

* **`resize` Subresource:** Modifying Pod resources must now be done via the Pod's `resize` subresource (`kubectl patch pod <name> --subresource resize ...`). `kubectl` versions v1.32+ support this argument.
* **Resize Status via Conditions:** The old `status.resize` field is deprecated. The status of a resize operation is now exposed via two Pod conditions:
    * `PodResizePending`: Indicates the Kubelet cannot grant the resize immediately (e.g., `reason: Deferred` if temporarily unable, `reason: Infeasible` if impossible on the node).
    * `PodResizeInProgress`: Indicates the resize is accepted and being applied. Errors encountered during this phase are now reported in this condition's message with `reason: Error`.
* **Sidecar Support:** Resizing {{< glossary_tooltip text="sidecar containers" term_id="sidecar-container" >}} in-place is now supported.
-->
### 显著的用户可感知的变化

* **`resize` 子资源：** 修改 Pod 资源现在必须通过 Pod 的 `resize`
  子资源进行（`kubectl patch pod <name> --subresource resize ...`）。
  kubectl 版本 v1.32+ 支持此参数。
* **通过状况显示调整大小状态：** 旧的 `status.resize` 字段已被弃用。
  调整大小操作的状态现在通过两个 Pod 状况暴露：
    * `PodResizePending`：表示 kubelet 无法立即批准调整大小
     （例如，如果暂时不能，则 `reason: Deferred`；如果在节点上不可能，则 `reason: Infeasible`）。
    * `PodResizeInProgress`：表示调整大小已被接受并正在应用。
      在此阶段遇到的错误现在会在此状况的消息中报告为 `reason: Error`。
* **支持边车容器：** 现在支持对{{< glossary_tooltip text="边车容器" term_id="sidecar-container" >}}进行原地调整大小。

<!--
### Stability and reliability enhancements

* **Refined Allocated Resources Management:** The allocation management logic with the Kubelet was significantly reworked, making it more consistent and robust. The changes eliminated whole classes of bugs, and greatly improved the reliability of in-place Pod resize.
-->
### 稳定性和可靠性增强

* **改进的已分配资源管理：** 对 Kubelet 的分配管理逻辑进行了重大重新设计，
  使其更加一致和稳健。这些更改消除了很多种错误，并大大提高了原地 Pod 调整大小的可靠性。
<!--
* **Improved Checkpointing & State Tracking:** A more robust system for tracking "allocated" and "actuated" resources was implemented, using new checkpoint files (`allocated_pods_state`, `actuated_pods_state`) to reliably manage resize state across Kubelet restarts and handle edge cases where runtime-reported resources differ from requested ones. Several bugs related to checkpointing and state restoration were fixed. Checkpointing efficiency was also improved.
-->
* **改进的检查点操作和状态跟踪操作：** 实现了更健壮的系统来跟踪“已分配”和“已执行”的资源，
  使用新的检查点文件（`allocated_pods_state`，`actuated_pods_state`）以可靠地管理
  kubelet 重启时的调整大小状态，并处理运行时报告的资源与请求的资源不同的边缘情况。
  修复了几个与检查点和状态恢复相关的错误。还提高了检查点的效率。
<!--
* **Faster Resize Detection:** Enhancements to the Kubelet's Pod Lifecycle Event Generator (PLEG) allow the Kubelet to respond to and complete resizes much more quickly.
* **Enhanced CRI Integration:** A new `UpdatePodSandboxResources` CRI call was added to better inform runtimes and plugins (like NRI) about Pod-level resource changes.
* **Numerous Bug Fixes:** Addressed issues related to systemd cgroup drivers, handling of containers without limits, CPU minimum share calculations, container restart backoffs, error propagation, test stability, and more.
-->
* **更快的调整大小检测：** 对 kubelet 的 Pod 生命周期事件生成器（PLEG）进行了增强，
  使 kubelet 能够更快地响应并完成大小调整。
* **增强的 CRI 集成：** 添加了新的 `UpdatePodSandboxResources` CRI 调用，
  以更好地通知运行时和插件（如 NRI）有关 Pod 级别的资源变化。
* **众多 Bug 修复：** 解决了与 systemd CGroup 驱动程序、未设资源限制的容器的处理、CPU
  最小份额计算、容器重启退避、错误传播、测试稳定性等相关的问题。

<!--
## What's next?

Graduating to Beta means the feature is ready for broader adoption, but development doesn't stop here! Here's what the community is focusing on next:
-->
## 接下来是什么？   {#whats-next}

晋升为 Beta 意味着该特性已经准备好被更广泛地采用，但开发工作并不会止步于此！
以下是社区接下来的关注重点：

<!--
* **Stability and Productionization:** Continued focus on hardening the feature, improving performance, and ensuring it is robust for production environments.
* **Addressing Limitations:** Working towards relaxing some of the current limitations noted in the documentation, such as allowing memory limit decreases.
-->
* **稳定性和产品化：** 持续关注增强特性，提升性能，并确保它在生产环境中足够稳健。
* **解决限制：** 致力于解除文档中提到的一些当前限制，例如允许降低内存限制值。
<!--
* **[VerticalPodAutoscaler](/docs/concepts/workloads/autoscaling/#scaling-workloads-vertically) (VPA) Integration:** Work to enable VPA to leverage in-place Pod resize is already underway. A new `InPlaceOrRecreate` update mode will allow it to attempt non-disruptive resizes first, or fall back to recreation if needed. This will allow users to benefit from VPA's recommendations with significantly less disruption.
* **User Feedback:** Gathering feedback from users adopting the beta feature is crucial for prioritizing further enhancements and addressing any uncovered issues or bugs.
-->
* **[垂直 Pod 自动扩缩](/zh-cn/docs/concepts/workloads/autoscaling/#scaling-workloads-vertically)（VPA）集成：**
  此任务正在进行，为的是使 VPA 能够利用原地 Pod 重新调整大小。一个新的 **InPlaceOrRecreate**
  更新模式将允许它首先尝试非干扰性的重新调整大小，或者在需要时回退到重建。
  这将使用户能够受益于 VPA 的建议，并显著减少干扰。
* **用户反馈：** 收集采用 Beta 版特性的用户反馈，对于优先处理后续的增强特性以及解决发现的任何问题或错误至关重要。

<!--
## Getting started and providing feedback

With the `InPlacePodVerticalScaling` feature gate enabled by default in v1.33, you can start experimenting with in-place Pod resizing right away!

Refer to the [documentation](/docs/tasks/configure-pod-container/resize-container-resources/) for detailed guides and examples.
-->
## 开始使用并提供反馈   {#getting-started-and-providing-feedback}

随着 **InPlacePodVerticalScaling** 特性门控在 v1.33 中默认启用，
你可以立即开始尝试原地 Pod 资源调整大小！

参考[文档](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)获取详细的指南和示例。

<!--
As this feature moves through Beta, your feedback is invaluable. Please report any issues or share your experiences via the standard Kubernetes communication channels (GitHub issues, mailing lists, Slack). You can also review the [KEP-1287: In-place Update of Pod Resources](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1287-in-place-update-pod-resources) for the full in-depth design details.

We look forward to seeing how the community leverages in-place Pod resize to build more efficient and resilient applications on Kubernetes!
-->
随着此特性从 Beta 阶段逐步推进，你的反馈是无价的。请通过 Kubernetes
标准沟通渠道（GitHub Issues、邮件列表、Slack）报告任何问题或分享你的经验。
你也可以查看
[KEP-1287: In-place Update of Pod Resources](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1287-in-place-update-pod-resources)
以获取完整的深入设计细节。

我们期待看到社区如何利用原地 Pod 调整大小来构建更高效、弹性更好的 Kubernetes 应用！
