---
layout: blog
title: "Kubernetes v1.34：Pod 级别资源升级至 Beta"
date: 2025-09-22T10:30:00-08:00
slug: kubernetes-v1-34-pod-level-resources
author: Dixita Narang (Google)
translator: >
  [Paco Xu](https://github.com/pacoxu) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.34: Pod Level Resources Graduated to Beta"
date: 2025-09-22T10:30:00-08:00
slug: kubernetes-v1-34-pod-level-resources
author: Dixita Narang (Google)
-->

<!--
On behalf of the Kubernetes community, I am thrilled to announce that the Pod Level Resources feature has graduated to Beta in the Kubernetes v1.34 release and is enabled by default! This significant milestone introduces a new layer of flexibility for defining and managing resource allocation for your Pods. This flexibility stems from the ability to specify CPU and memory resources for the Pod as a whole. Pod level resources can be combined with the container-level specifications to express the exact resource requirements and limits your application needs.
-->
我很高兴代表 Kubernetes 社区宣布，Pod 级别资源特性已在 Kubernetes v1.34
发行版中升级至 Beta 并默认启用！
这一重要里程碑为定义和管理 Pod 的资源分配引入了新的灵活性。
这种灵活性来自于能够为整个 Pod 指定 CPU 和内存资源。
Pod 级别资源可以与容器级别的规约组合使用，从而表达应用所需的准确资源请求和限制。

<!--
## Pod-level specification for resources
-->
## Pod 级别资源规约

<!--
Until recently, resource specifications that applied to Pods were primarily defined
at the individual container level. While effective, this approach sometimes required
duplicating or meticulously calculating resource needs across multiple containers
within a single Pod. As a beta feature, Kubernetes allows you to specify the CPU,
memory and hugepages resources at the Pod-level. This means you can now define
resource requests and limits for an entire Pod, enabling easier resource sharing
without requiring granular, per-container management of these resources where
it's not needed.
-->
直到最近，适用于 Pod 的资源规约主要还是在各个容器级别定义。
虽然这种方式有效，但有时需要在单个 Pod 的多个容器之间重复设置或仔细计算资源需求。
作为一项 Beta 特性，Kubernetes 允许你在 Pod 级别指定 CPU、内存和大页内存资源。
这意味着你现在可以为整个 Pod 定义资源请求和限制，从而更容易地共享资源；
在不需要细粒度按容器管理这些资源的场景下，也不必再逐个容器进行管理。

<!--
## Why does Pod-level specification matter?
-->
## 为什么 Pod 级别规约很重要？

<!--
This feature enhances resource management in Kubernetes by offering *flexible resource management* at both the Pod and container levels.
-->
此特性通过在 Pod 和容器两个级别提供**灵活的资源管理**，增强了 Kubernetes 中的资源管理能力。

<!--
* It provides a consolidated approach to resource declaration, reducing the need for
  meticulous, per-container management, especially for Pods with multiple
  containers.
* Pod-level resources enable containers within a pod to share unused resoures
  amongst themselves, promoting efficient utilization within the pod. For example,
  it prevents sidecar containers from becoming performance bottlenecks. Previously,
  a sidecar (e.g., a logging agent or service mesh proxy) hitting its individual CPU
  limit could be throttled and slow down the entire Pod, even if the main
  application container had plenty of spare CPU. With pod-level resources, the
  sidecar and the main container can share Pod's resource budget, ensuring smooth
  operation during traffic spikes - either the whole Pod is throttled or all
  containers work.

* When both pod-level and container-level resources are specified, pod-level
  requests and limits take precedence. This gives you – and cluster administrators -
  a powerful way to enforce overall resource boundaries for your Pods.

  For scheduling, if a pod-level request is explicitly defined, the scheduler uses
  that specific value to find a suitable node, insteaf of the aggregated requests of
  the individual containers. At runtime, the pod-level limit acts as a hard ceiling
  for the combined resource usage of all containers. Crucially, this pod-level limit
  is the absolute enforcer; even if the sum of the individual container limits is
  higher, the total resource consumption can never exceed the pod-level limit.
* Pod-level resources are **prioritized** in influencing the Quality of Service (QoS) class of the Pod.
* For Pods running on Linux nodes, the Out-Of-Memory (OOM) score adjustment
  calculation considers both pod-level and container-level resources requests.
* Pod-level resources are **designed to be compatible with existing Kubernetes functionalities**, ensuring a smooth integration into your workflows.
-->
* 它提供了一种整合式的资源声明方式，减少了进行细致的按容器管理的需要，
  对于包含多个容器的 Pod 尤其有用。
* Pod 级别资源使 Pod 内的容器能够彼此共享未使用的资源，
  从而促进 Pod 内资源的高效利用。
  例如，它可以防止边车容器成为性能瓶颈。
  过去，某个边车（例如日志代理或服务网格代理）达到自身 CPU 限制时可能会被限流，
  并拖慢整个 Pod，即使主应用容器还有大量空闲 CPU。
  使用 Pod 级别资源后，边车和主容器可以共享 Pod 的资源预算，
  确保在流量高峰期间平稳运行：要么整个 Pod 被限流，要么所有容器都能工作。

* 当同时指定 Pod 级别和容器级别资源时，Pod 级别的请求和限制优先。
  这为你和集群管理员提供了一种强有力的方式来对 Pod 实施整体资源边界。

  对于调度而言，如果显式定义了 Pod 级别请求，调度器会使用该特定值来寻找合适的节点，
  而不是使用各个容器请求的聚合值。
  在运行时，Pod 级别限制会作为所有容器组合资源用量的硬性上限。
  关键在于，这个 Pod 级别限制是绝对的执行边界；
  即使各个容器限制之和更高，总资源消耗也永远不能超过 Pod 级别限制。
* Pod 级别资源在影响 Pod 的服务质量（QoS）类时**优先**。
* 对于运行在 Linux 节点上的 Pod，内存不足（OOM）分数调整计算会同时考虑
  Pod 级别和容器级别的资源请求。
* Pod 级别资源**被设计为与现有 Kubernetes 功能兼容**，确保可以顺畅集成到你的工作流中。

<!--
## How to specify resources for an entire Pod
-->
## 如何为整个 Pod 指定资源

<!--
Using `PodLevelResources` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) requires
Kubernetes v1.34 or newer for all cluster components, including the control plane
and every node. This feature gate is in beta and enabled by default in v1.34.
-->
使用 `PodLevelResources`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)时，要求所有集群组件
（包括控制平面和每个节点）均为 Kubernetes v1.34 或更高版本。
此特性门控处于 Beta 阶段，并在 v1.34 中默认启用。

<!--
### Example manifest
-->
### 示例清单

<!--
You can specify CPU, memory and hugepages resources directly in the Pod spec manifest at the `resources` field for the entire Pod.
-->
你可以直接在 Pod 规约清单中通过整个 Pod 的 `resources` 字段指定 CPU、内存和 HugePages 资源。

<!--
Here’s an example demonstrating a Pod with both CPU and memory requests and limits
defined at the Pod level:
-->
下面的示例展示了一个在 Pod 级别定义了 CPU 和内存请求及限制的 Pod：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-resources-demo
  namespace: pod-resources-example
spec:
  # Pod 规约级别的 'resources' 字段定义了此 Pod 内所有容器合计的整体资源预算。
  resources: # Pod 级别资源
    # 'limits' 指定 Pod 可使用的最大资源量。
    # Pod 中所有容器限制之和不能超过这些值。
    limits:
      cpu: "1" # 整个 Pod 不能使用超过 1 个 CPU 核心。
      memory: "200Mi" # 整个 Pod 不能使用超过 200 MiB 内存。
    # 'requests' 指定为 Pod 保证的最小资源量。
    # Kubernetes 调度器会使用此值来寻找具有足够容量的节点。
    requests:
      cpu: "1" # 调度后，Pod 保证可获得 1 个 CPU 核心。
      memory: "100Mi" # 调度后，Pod 保证可获得 100 MiB 内存。
  containers:
  - name: main-app-container
    image: nginx
    ...
    # 此容器没有指定资源请求或限制。
  - name: auxiliary-container
    image: fedora
    command: ["sleep", "inf"]
    ...
    # 此容器没有指定资源请求或限制。
```

<!--
In this example, the `pod-resources-demo` Pod as a whole requests 1 CPU and 100 MiB of memory, and is limited to 1 CPU and 200 MiB of memory. The containers within will operate under these overall Pod-level constraints, as explained in the next section.
-->
在此示例中，`pod-resources-demo` Pod 整体请求 1 个 CPU 和 100 MiB 内存，
并被限制为最多使用 1 个 CPU 和 200 MiB 内存。
其中的容器将在这些整体 Pod 级别约束下运行，如下一节所述。

<!--
### Interaction with container-level resource requests or limits
-->
### 与容器级别资源请求或限制的交互

<!--
When both pod-level and container-level resources are specified, **pod-level requests and limits take precedence**. This means the node allocates resources based on the pod-level specifications.
-->
当同时指定 Pod 级别和容器级别资源时，**Pod 级别请求和限制优先**。
这意味着节点会基于 Pod 级别规约来分配资源。

<!--
Consider a Pod with two containers where pod-level CPU and memory requests and
limits are defined, and only one container has its own explicit resource
definitions:
-->
设想一个包含两个容器的 Pod，其中定义了 Pod 级别的 CPU 和内存请求及限制，
并且只有一个容器具有自己的显式资源定义：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-resources-demo
  namespace: pod-resources-example
spec:
  resources:
    limits:
      cpu: "1"
      memory: "200Mi"
    requests:
      cpu: "1"
      memory: "100Mi"
  containers:
  - name: main-app-container
    image: nginx
    resources:
      requests:
        cpu: "0.5"
        memory: "50Mi"
  - name: auxiliary-container
    image: fedora
    command: [ "sleep", "inf"]
    # 此容器没有指定资源请求或限制。
```

<!--
* Pod-Level Limits: The pod-level limits (cpu: "1", memory: "200Mi") establish an absolute boundary for the entire Pod. The sum of resources consumed by all its containers is enforced at this ceiling and cannot be surpassed.

* Resource Sharing and Bursting: Containers can dynamically borrow any unused capacity, allowing them to burst as needed, so long as the Pod's aggregate usage stays within the overall limit.

* Pod-Level Requests: The pod-level requests (cpu: "1", memory: "100Mi") serve as the foundational resource guarantee for the entire Pod. This value informs the scheduler's placement decision and represents the minimum resources the Pod can rely on during node-level contention.

* Container-Level Requests: Container-level requests create a priority system within
the Pod's guaranteed budget. Because main-app-container has an explicit request
(cpu: "0.5", memory: "50Mi"), it is given precedence for its share of resources
under resource pressure over the auxiliary-container, which has no
such explicit claim.
-->
* Pod 级别限制：Pod 级别限制（cpu: "1", memory: "200Mi"）为整个 Pod 建立了绝对边界。
  其所有容器消耗的资源总和会受此上限约束，不能超过该上限。

* 资源共享和突增：容器可以动态借用任何未使用的容量，
  只要 Pod 的聚合用量仍在整体限制之内，就可以按需突增。

* Pod 级别请求：Pod 级别请求（cpu: "1", memory: "100Mi"）是整个 Pod 的基础资源保证。
  该值会影响调度器的放置决策，并表示在节点级别资源竞争期间 Pod 可以依赖的最小资源量。

* 容器级别请求：容器级别请求会在 Pod 的保证预算内创建一个优先级体系。
  因为 `main-app-container` 有显式请求（cpu: "0.5", memory: "50Mi"），
  所以在资源压力下，相比没有这种显式声明的 `auxiliary-container`，
  它会优先获得自己的资源份额。

<!--
## Limitations
* First of all, [in-place
  resize](/docs/concepts/workloads/pods/#pod-update-and-replacement) of pod-level
  resources is **not supported** for Kubernetes v1.34 (or earlier). Attempting to
  modify the _pod-level_ resource limits or requests on a running Pod results in an
  error: the resize is rejected. The v1.34 implementation of Pod level resources
  focuses on allowing initial declaration of an overall resource envelope, that
  applies to the **entire Pod**. That is distinct from in-place pod resize, which
  (despite what the name might suggest) allows you
  to make dynamic adjustments to _container_ resource
  requests and limits, within a *running* Pod,
  and potentially without a container restart. In-place resizing is also not yet a
  stable feature; it graduated to Beta in the v1.33 release.

* Only CPU, memory, and hugepages resources can be specified at pod-level.

* Pod-level resources are not supported for Windows pods. If the Pod specification
explicitly targets Windows (e.g., by setting spec.os.name: "windows"), the API
server will reject the Pod during the validation step. If the Pod is not explicitly
marked for Windows but is scheduled to a Windows node (e.g., via a nodeSelector),
the Kubelet on that Windows node will reject the Pod during its admission process.

* The Topology Manager, Memory Manager and CPU Manager do not
  align pods and containers based on pod-level resources as these resource managers
  don't currently support pod-level resources.
-->
## 限制

* 首先，Kubernetes v1.34（及更早版本）**不支持**对 Pod
  级别资源进行[原地调整大小](/zh-cn/docs/concepts/workloads/pods/#pod-update-and-replacement)。
  尝试修改运行中 Pod 的 _Pod 级别_资源限制或请求会导致错误：调整大小请求会被拒绝。
  v1.34 中 Pod 级别资源的实现重点在于允许初始声明适用于**整个 Pod**的整体资源包络。
  这与原地 Pod 调整大小不同；后者（尽管名称可能有些误导）允许你在**运行中**的 Pod
  内动态调整_容器_资源请求和限制，并且可能无需重启容器。
  原地调整大小也尚未成为稳定特性；它在 v1.33 发行版中升级至 Beta。

* 只能在 Pod 级别指定 CPU、内存和大页内存资源。

* Windows Pod 不支持 Pod 级别资源。
  如果 Pod 规约显式以 Windows 为目标（例如设置 `spec.os.name: "windows"`），
  API 服务器会在验证步骤拒绝该 Pod。
  如果 Pod 没有显式标记为 Windows，但被调度到 Windows 节点（例如通过 `nodeSelector`），
  该 Windows 节点上的 kubelet 会在其准入过程中拒绝该 Pod。

* 拓扑管理器、内存管理器和 CPU 管理器不会基于 Pod
  级别资源对 Pod 和容器进行对齐，因为这些资源管理器目前不支持 Pod 级别资源。

<!--
#### Getting started and providing feedback
-->
#### 开始使用并提供反馈

<!--
Ready to explore _Pod Level Resources_ feature? You'll need a Kubernetes cluster running version 1.34 or later. Remember to enable the `PodLevelResources` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) across your control plane and all nodes.
-->
准备探索 _Pod 级别资源_ 特性了吗？
你需要一个运行 1.34 或更高版本的 Kubernetes 集群。
请记得在控制平面和所有节点上启用 `PodLevelResources`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
As this feature moves through Beta, your feedback is invaluable. Please report any issues or share your experiences via the standard Kubernetes communication channels:



* Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
* [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
* [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
-->
随着此特性在 Beta 阶段继续演进，你的反馈非常宝贵。
请通过标准 Kubernetes 沟通渠道报告任何问题或分享你的使用经验：

* Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
* [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
* [开放的社区 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnode)
