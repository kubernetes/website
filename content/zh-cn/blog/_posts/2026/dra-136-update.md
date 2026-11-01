---
layout: blog
title: "Kubernetes v1.36：更多驱动程序、新特性以及下一代 DRA"
date: 2026-05-07T10:35:00-08:00
slug: kubernetes-v1-36-dra-136-updates
author: >
  DRA 团队
translator: >
  [Paco Xu](https://github.com/pacoxu)(DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.36: More Drivers, New Features, and the Next Era of DRA"
date: 2026-05-07T10:35:00-08:00
slug: kubernetes-v1-36-dra-136-updates

author: >
  The DRA team
-->

<!--
Dynamic Resource Allocation (DRA) has fundamentally changed how platform administrators handle hardware
accelerators and specialized resources in Kubernetes. In the v1.36 release, DRA
continues to mature, bringing a wave of feature graduations, critical usability
improvements, and new capabilities that extend the flexibility of DRA to native
resources like memory and CPU, and support for ResourceClaims in PodGroups.
-->
动态资源分配（DRA）从根本上改变了平台管理员在 Kubernetes 中处理硬件加速器和专用资源的方式。
在 Kubernetes v1.36 中，DRA 继续走向成熟，带来了多项特性进阶、重要的可用性改进，
以及一些新的能力，包括将 DRA 的灵活性扩展到内存和 CPU 这类原生资源，
并支持在 PodGroup 中使用 ResourceClaim。

<!--
Driver availability continues to expand. Beyond specialized compute accelerators,
the ecosystem includes support for networking and other hardware types,
reflecting a move toward a more robust, hardware-agnostic infrastructure.
-->
驱动程序的可用性也在持续扩展。除了专用计算加速器之外，
这一生态系统也已经支持网络设备及其他硬件类型，
这反映出它正迈向更稳健、不过度绑定特定硬件的基础设施。

<!--
Whether you are managing massive fleets of GPUs, need better handling of failures,
or simply looking for better ways to define resource fallback options, the upgrades
to DRA in 1.36 have something for you. Let's dive into the new features and graduations!
-->
无论你是在管理大规模 GPU 资源池，需要更好地处理故障，
还是只是希望找到更好的方式来定义资源候选/回退选项，
DRA 在 v1.36 中的升级都会对你有所帮助。
下面我们来看看这些新特性和进阶内容。

<!--
## Feature graduations
-->
## 特性进阶

<!--
The community has been hard at work stabilizing core DRA concepts. In Kubernetes 1.36,
several highly anticipated features have graduated to Beta and Stable.
-->
社区一直在努力稳定 DRA 的核心概念。
在 Kubernetes 1.36 中，多项备受期待的特性已经进入 Beta 和稳定阶段。

<!--
### Prioritized list (stable) {#prioritized-list}
-->
### 按优先级排序的列表（Stable） {#prioritized-list}

<!--
Hardware heterogeneity is a reality in most clusters. With the
[Prioritized list](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#prioritized-list)
feature, you can confidently define fallback preferences when requesting
devices. Instead of hardcoding a request for a specific device model, you can specify an
ordered list of preferences (e.g., "Give me an H100, but if none are available, fall back
to an A100"). The scheduler will evaluate these requests in order, drastically improving
scheduling flexibility and cluster utilization.
-->
硬件异构是大多数集群中的现实情况。使用[按优先级排序的列表](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#prioritized-list)
特性，你可以在请求设备时明确指定回退偏好。
你无需将对特定设备型号的请求硬编码，而是可以指定一个有序的偏好列表
（例如，“给我一块 H100，如果没有可用的，就回退到 A100”）。
调度器会按顺序评估这些请求，从而显著提升调度灵活性和集群利用率。

<!--
### Extended resource support (beta) {#extended-resource}
-->
### 扩展资源支持（Beta） {#extended-resource}

<!--
As DRA becomes the standard for resource allocation, bridging the gap with legacy systems
is crucial. The DRA
[Extended resource](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)
feature allows users to request resources via traditional extended resources on a Pod.
This allows for a gradual transition to DRA, meaning cluster operators can migrate clusters
to DRA but let application developers adopt the ResourceClaim API on their own schedule.
-->
随着 DRA 成为资源分配的标准，弥合与既有机制之间的差距就变得至关重要。
DRA 的[扩展资源](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)
特性允许用户通过 Pod 上传统的扩展资源方式来请求资源。
这使得向 DRA 的过渡可以循序渐进，也就是说，集群运维人员可以将集群迁移到 DRA，
而让应用开发者按照自己的节奏采用 ResourceClaim API。

<!--
### Partitionable devices (beta) {#partitionable-devices}
-->
### 可切分设备（Beta） {#partitionable-devices}

<!--
Hardware accelerators are powerful, and sometimes a single workload doesn't need an
entire device. The
[Partitionable devices](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)
feature, provides native DRA support for dynamically carving physical hardware into smaller,
logical instances (such as Multi-Instance GPUs) based on workload demands. This allows
administrators to safely and efficiently share expensive accelerators across multiple Pods.
-->
硬件加速器能力强大，而有时单个工作负载并不需要整个设备。
[可切分设备](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)
特性为 DRA 原生提供了支持，能够根据工作负载需求，将物理硬件动态切分为更小的逻辑实例
（例如多实例 GPU）。
这使管理员能够在多个 Pod 之间安全且高效地共享昂贵的加速器。

<!--
### Device taints (beta) {#device-taints}
-->
### 设备污点（Beta） {#device-taints}

<!--
Just as you can taint a Kubernetes Node, you can apply taints directly to specific DRA
devices.
[Device taints and tolerations](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)
empower cluster administrators to manage hardware more effectively. You can taint faulty
devices to prevent them from being allocated to standard claims, or reserve specific hardware
for dedicated teams, specialized workloads, and experiments. Ultimately, only Pods with
matching tolerations are permitted to claim these tainted devices.
-->
正如你可以为 Kubernetes Node 添加污点一样，
你也可以直接为特定 DRA 设备添加污点。
[设备污点和容忍度](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)
让集群管理员能够更高效地管理硬件。
你可以为故障设备打上污点，使其不会被普通 ResourceClaim 申领占用；
也可以把特定硬件预留给专属团队、专用工作负载或实验场景。
这样，只有具有匹配容忍度的 Pod 才允许申领这些带污点的设备。

<!--
### Device binding conditions (beta) {#device-binding-conditions}
-->
### 设备绑定状况（Beta） {#device-binding-conditions}

<!--
To improve scheduling reliability, the Kubernetes scheduler can use the
[Binding conditions](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-binding-conditions)
feature to delay committing a Pod to a Node until its required external resources—such as attachable
devices or FPGAs—are fully prepared. By explicitly modeling resource readiness, this
prevents premature assignments that can lead to Pod failures, ensuring a much more robust
and predictable deployment process.
-->
为了提升调度可靠性，Kubernetes
调度器可以使用[绑定状况](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-binding-conditions)
特性，在 Pod 所需的外部资源（例如可挂接设备或 FPGA）完全就绪之前，推迟将 Pod 绑定到节点。
通过显式地对资源就绪状态建模，这一特性能够防止过早分配导致 Pod 失败，
从而确保部署过程更加稳健且可预测。

<!--
### Resource health status (beta) {#device-health-monitoring}
-->
### 资源健康状态（Beta） {#device-health-monitoring}

<!--
Knowing when a device has failed or become unhealthy is critical for workloads running on
specialized hardware. With
[Resource health status](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-health-monitoring),
Kubernetes expose device health information directly in the Pod status, giving users and
controllers crucial visibility to quickly identify and react to hardware failures. The
feature includes support for human-readable health status messages, making it
significantly easier to diagnose issues without the need to dive into complex driver logs.
-->
对于运行在专用硬件上的工作负载来说，知道设备何时故障或变得不健康至关重要。
借助[资源健康状态](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-health-monitoring)，
Kubernetes 直接在 Pod 状态中暴露设备健康信息，
为用户和控制器提供了关键的可见性，以便快速识别并响应硬件故障。
该特性还支持易于阅读的健康状态消息，使问题诊断变得容易得多，
而无需深入复杂的驱动日志。

<!--
## New Features
-->
## 新特性

<!--
Beyond stabilizing existing capabilities, v1.36 introduces foundational new features
that expand what DRA can do. These are alpha features, so they are behind feature gates
that are disabled by default.
-->
除了稳定现有能力之外，v1.36 还引入了一些基础性的新特性，进一步扩展了 DRA 能支持的场景。
这些特性目前均处于 Alpha 阶段，并由默认关闭的特性门控控制。

<!--
### ResourceClaim support for workloads {#workload-resourceclaims}
-->
### 面向工作负载的 ResourceClaim 支持 {#workload-resourceclaims}

<!--
To optimize large-scale AI/ML workloads that rely on strict topological scheduling, the 
[ResourceClaim support for workloads](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#workload-resourceclaims)
feature enables Kubernetes to seamlessly manage shared resources across massive sets
of Pods. By associating ResourceClaims or ResourceClaimTemplates with PodGroups,
this feature eliminates previous scaling bottlenecks, such as the limit on the
number of pods that can share a claim, and removes the burden of manual claim
management from specialized orchestrators.
-->
为了优化依赖严格拓扑调度的大规模 AI/ML 工作负载，
[面向工作负载的 ResourceClaim 支持](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#workload-resourceclaims)
特性使 Kubernetes 能够在大规模 Pod 集合之间统一管理共享资源。
通过将 ResourceClaim 或 ResourceClaimTemplate 与 PodGroup 关联起来，
该特性消除了此前的扩展性瓶颈，例如可共享某个申领的 Pod 数量限制，
同时也减轻了专用编排器手动管理申领的负担。

<!--
### Node allocatable resources {#node-allocatable-resources}
-->
### 节点可分配资源 {#node-allocatable-resources}

<!--
Why should DRA only be for external accelerators? In v1.36, we are introducing the first
iteration of using the DRA APIs to manage _node allocatable_ infrastructure resources (like CPU and
memory). By bringing CPU and memory allocation under the DRA umbrella with the DRA
[Node allocatable resources](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#node-allocatable-resources)
feature, users can leverage DRA's advanced placement, NUMA-awareness, and prioritization
semantics for standard compute resources, paving the way for incredibly fine-grained
performance tuning.
-->
为什么 DRA 只能用于外部加速器呢？在 v1.36 中，我们引入了使用 DRA API 管理
**节点可分配**基础设施资源（如 CPU 和内存）的第一版实现。
通过 DRA 的[节点可分配资源](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#node-allocatable-resources)
特性，将 CPU 和内存分配纳入 DRA 体系之下，
用户就可以将 DRA 的高级放置能力、NUMA 感知和优先级语义应用到标准计算资源上，
从而为极细粒度的性能调优铺平道路。

<!--
### DRA resource availability visibility {#resource-pool-status}
-->
### DRA 资源可用性可见性 {#resource-pool-status}

<!--
One of the most requested features from cluster administrators has been better visibility
into hardware capacity. The new
[Resource pool status](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resource-pool-status)
feature allows you to query the availability of devices in DRA resource pools. By creating a
`ResourcePoolStatusRequest` object, you get a point-in-time snapshot of device counts
— total, allocated, available, and unavailable — for each pool managed by a given
driver. This enables better integration with dashboards and capacity planning tools.
-->
集群管理员最常提出的需求之一，就是希望更好地了解硬件容量。
全新的[资源池状态](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resource-pool-status)
特性允许你查询 DRA 资源池中的设备可用性。
通过创建 `ResourcePoolStatusRequest` 对象，
你可以获得某个驱动所管理的每个资源池在某一时刻的设备数量快照，
包括总数、已分配、可用和不可用。
这有助于更好地集成仪表板和容量规划工具。

<!--
### List types for attributes {#list-type-attributes}
-->
### 属性的列表类型 {#list-type-attributes}

<!--
ResourceClaim constraint evaluation has changed to work better with scalar
and list values:
`matchAttribute` now checks for a non-empty intersection, and
`distinctAttribute` checks for pairwise disjoint values.
-->
ResourceClaim 的约束求值机制已经调整，以便更好地处理标量值和列表值：
`matchAttribute` 现在检查是否存在非空交集，
而 `distinctAttribute` 则检查值是否两两不相交。

<!--
An `includes()` function in CEL has also been introduced,
that lets device selectors keep working more easily when an attribute
changes between scalar and list representations.
(The `includes()` function is only available in DRA
contexts for expression evaluation).
-->
同时，CEL 中还引入了一个 `includes()` 函数，
这使设备选择器在某个属性于标量表示和列表表示之间变化时，
仍可更容易地保持可用。
（`includes()` 函数仅可用于 DRA 表达式求值上下文。）

<!--
### Deterministic device selection {#deterministic-device-selection}
-->
### 确定性设备选择 {#deterministic-device-selection}

<!--
The Kubernetes scheduler has been updated to evaluate devices using lexicographical
ordering based on resource pool and ResourceSlice names. This change empowers drivers
to proactively influence the scheduling process, leading to improved throughput and
more optimal scheduling decisions. The ResourceSlice controller toolkit automatically
generates names that reflect the exact device ordering specified by the driver author.
-->
Kubernetes 调度器已更新：在评估设备时，会按资源池与 ResourceSlice 名称的字典序进行比较。
这样一来，驱动可以更主动地影响调度过程，有助于提高吞吐量并做出更优的调度决策。
ResourceSlice 控制器工具包还会自动生成名称，使其与驱动作者在实现里声明的设备先后次序一致。

<!--
### Discoverable device metadata in containers {#device-metadata}
-->
### 容器中可被发现的设备元数据 {#device-metadata}

<!--
Workloads running on nodes with DRA devices often need to discover details about
their allocated devices, such as PCI bus addresses or network
interface configuration, without querying the Kubernetes API. With
[Device metadata](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-metadata),
Kubernetes defines a standard protocol for how DRA drivers expose device
attributes to containers as versioned JSON files at well-known paths. Drivers
built with the
[DRA kubelet plugin library](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
get this behavior transparently; they just provide the metadata and the
library handles file layout, CDI bind-mounts, versioning, and lifecycle. This
gives applications a consistent, driver-independent way to discover and
consume device metadata, eliminating the need for custom controllers or
looking up ResourceSlice objects to get metadata via attributes.
-->
运行在带有 DRA 设备的节点上的工作负载，通常需要在不查询 Kubernetes API 的情况下，
发现其已分配设备的详细信息，例如 PCI 总线地址或网络接口配置。
借助[设备元数据](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-metadata)，
Kubernetes 定义了一套标准协议，用于规定 DRA 驱动如何以带版本的 JSON 文件形式，
在约定路径下向容器暴露设备属性。
使用 [DRA kubelet plugin library](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
构建的驱动可以无需额外处理即可获得这一能力；它们只需要提供元数据，其余如文件布局、
CDI bind-mount、版本控制和生命周期管理，都由该库负责处理。
这为应用提供了一种一致、与驱动无关的方式来发现和使用设备元数据，
从而无需再借助自定义控制器或查询 ResourceSlice 对象并从其属性中获取元数据。

<!--
## What’s next?
-->
## 后续计划

<!--
This release introduced a wealth of new Dynamic Resource Allocation (DRA) features,
and the momentum is only building. As we look ahead, our roadmap focuses on maturing
existing features toward beta and stable releases while hardening DRA’s performance,
scalability, and reliability. A key priority over the coming cycles will be deep
integration with _workload aware_ and _topology aware scheduling_.
-->
这一版本引入了大量新的动态资源分配（DRA）特性，而且相关工作仍在持续推进。
展望未来，我们的路线图将聚焦于推动现有特性走向 Beta 和稳定发布阶段，
同时进一步夯实 DRA 的性能、可扩展性和可靠性。
在接下来的几个迭代周期中，一个关键优先事项将是与
__工作负载感知调度__ 和 __拓扑感知调度__ 的深度集成。

<!--
A big goal for us is to migrate users from Device Plugin to DRA, and we want
you involved. Whether you are currently maintaining a driver or are just beginning
to explore the possibilities, your input is vital. Partner with us to shape the next
generation of resource management. Reach out today to collaborate on development,
share feedback, or start building your first DRA driver.
-->
我们的一个重要目标，是推动用户从设备插件迁移到 DRA，而我们也希望你参与其中。
无论你当前正在维护某个驱动，还是刚开始探索这些可能性，
你的意见都至关重要。与我们一起塑造下一代资源管理能力。
现在就联系我们，一起协作开发、分享反馈，或者开始构建你的第一个 DRA 驱动程序。

<!--

## Getting involved
-->
## 参与其中

<!--
A good starting point is joining the WG Device Management 
[Slack channel](https://kubernetes.slack.com/archives/C0409NGC1TK) and
[meetings](https://docs.google.com/document/d/1qxI87VqGtgN7EAJlqVfxx86HGKEAc2A3SKru8nJHNkQ/edit?tab=t.0#heading=h.tgg8gganowxq),
which happen at Americas/EMEA and EMEA/APAC friendly time slots.
-->
一个不错的起点，是加入 WG Device Management 的
[Slack 频道](https://kubernetes.slack.com/archives/C0409NGC1TK)
和[会议](https://docs.google.com/document/d/1qxI87VqGtgN7EAJlqVfxx86HGKEAc2A3SKru8nJHNkQ/edit?tab=t.0#heading=h.tgg8gganowxq)，
这些会议分别安排在适合 Americas/EMEA 和 EMEA/APAC 的时间段举行。

<!--
Not all enhancement ideas are tracked as issues yet, so come talk to us if you want to help or have some ideas yourself!
We have work to do at all levels, from difficult core changes to usability enhancements in kubectl, which could be picked up by newcomers.
-->
并非所有增强想法目前都已经作为 Issue 进行跟踪，
因此，如果你想提供帮助，或者你自己也有一些想法，欢迎来和我们交流。
我们在各个层面都有工作要做，从高难度核心变更，到 kubectl 的易用性增强，
其中一些工作也很适合新贡献者上手。
