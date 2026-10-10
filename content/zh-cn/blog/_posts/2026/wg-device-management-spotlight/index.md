---
layout: blog
title: "聚焦 WG Device Management"
slug: wg-device-management-spotlight-2026
date: 2026-06-24T10:00:00-08:00
author: "Natalie Fisher"
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---

<!--
layout: blog
title: "Spotlight on WG Device Management"
slug: wg-device-management-spotlight-2026
date: 2026-06-24T10:00:00-08:00
canonical_url: https://www.kubernetes.dev/blog/2026/06/17/wg-device-management-spotlight-2026
author: "Natalie Fisher"
-->

<!--
The rising popularity of AI, Edge, and Telecommunications workloads on Kubernetes has led to new requirements for hardware management. We now need hardware specification beyond CPU time and memory allocations.  This includes allocating GPUs, TPUs, network interfaces, and other hardware, sometimes after pod start and occasionally through time-sharing.
-->
AI、边缘计算和电信工作负载在 Kubernetes 上日益普及，对硬件管理提出了新的需求。
我们现在需要的硬件规格已经超出了 CPU 时间和内存分配的范畴。
这包括分配 GPU、TPU、网络接口和其他硬件，有时在 Pod 启动之后分配，有时通过分时共享。

<!--
Efficiently managing this specialized hardware is the mission of the **[Device Management Working Group](https://www.kubernetes.dev/community/community-groups/wg/device-management/)**. Their cornerstone project, **[Dynamic Resource Allocation (DRA)](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)**, recently graduated to GA, marking a fundamental shift in how the project handles hardware-intensive workloads at scale.
-->
高效管理这些专用硬件是 **[Device Management 工作组](https://www.kubernetes.dev/community/community-groups/wg/device-management/)**
的使命。他们的核心项目 **[动态资源分配（DRA）](https://kubernetes.io/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)**
最近已正式 GA，标志着该项目在大规模处理硬件密集型工作负载方面的根本性转变。

<!--
In this spotlight, we sit down with working group chairs **[Kevin Klues](https://github.com/klueska)**, **[Patrick Ohly](https://github.com/pohly)**, and
**[John Belamaric](https://github.com/johnbelamaric)** to discuss the limitations of the legacy device model,
the _NP-hard_ challenges of scheduling, and how they're building a more programmable, hardware-aware future for Kubernetes.
-->
在本期聚焦中，我们与工作组主席 **[Kevin Klues](https://github.com/klueska)**、**[Patrick Ohly](https://github.com/pohly)**
和 **[John Belamaric](https://github.com/johnbelamaric)** 坐下来讨论了传统设备模型的局限性、
调度中的 _NP 难_ 挑战，以及他们如何为 Kubernetes 构建一个更可编程、更具硬件感知能力的未来。

<!--
## Introducing Device Management
-->
## 介绍 Device Management {#introducing-device-management}

<!--
**Natalie Fisher: Can you introduce yourself, your role, and how you got involved in the Device Management Working Group?**
-->
**Natalie Fisher：能否介绍一下你自己、你的角色，以及你是如何参与 Device Management 工作组的？**

<!--
**Kevin Klues:** My name is Kevin Klues. I am a Distinguished Engineer at NVIDIA. I have been a co-chair of the device management working group since its inception at Kubecon EU 2024. I have also been involved with DRA (the working group's primary deliverable) since its inception in 2019 / 2020.
I have also been a kubelet maintainer since 2019, with a focus on its device manager, CPU manager, and topology manager subcomponents. The challenges we saw with using these components for workloads that relied on external accelerators (e.g., GPUs) are what triggered us to start working on DRA in the first place.
-->
**Kevin Klues：** 我叫 Kevin Klues，是 NVIDIA 的杰出工程师。
自 2024 年 KubeCon EU 工作组成立以来，我一直担任 Device Management 工作组的联合主席。
我从 2019/2020 年 DRA（工作组的主要成果）诞生之初就参与其中。
我从 2019 年起还担任 kubelet 维护者，专注于其设备管理器、CPU 管理器和拓扑管理器子组件。
我们在为依赖外部加速器（例如 GPU）的工作负载使用这些组件时遇到的挑战，正是促使我们开始研发 DRA 的原因。

<!--
**Patrick Ohly:** I am a Principal Engineer at Intel. In Kubernetes, I am a Tech Lead for [SIG Testing](https://www.kubernetes.dev/community/community-groups/sigs/testing/) and [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/) and co-chair of the Device Management WG. I was co-chair of the WG Structured Logging and a member of the Steering Committee. Some of my early contributions to Kubernetes include [ephemeral CSI volumes](https://kubernetes.io/docs/concepts/storage/ephemeral-volumes/) and storage capacity tracking, so I had some experience with API design, implementation, and scheduling. We knew that introducing a major new API for accelerators would be hard. Somewhat foolishly, I accepted that challenge in 2020, wrote the initial DRA KEP (now known as "classic DRA") and implemented most of it, then started over with a second KEP for today's "structured parameters DRA". Initially, it was an uphill battle to convince maintainers that this work was necessary. It was only around 2023 that interest in DRA picked up, leading to the formation of the working group.
-->
**Patrick Ohly：** 我是 Intel 的首席工程师。
在 Kubernetes 中，我是 [SIG Testing](https://www.kubernetes.dev/community/community-groups/sigs/testing/)
和 [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/) 的技术负责人，
同时也是 Device Management WG 的联合主席。我曾担任 WG Structured Logging 的联合主席，也是指导委员会成员。
我早期对 Kubernetes 的贡献包括[临时 CSI 卷](https://kubernetes.io/zh-cn/docs/concepts/storage/ephemeral-volumes/)和存储容量跟踪，
所以我有一些 API 设计、实现和调度方面的经验。我们知道为加速器引入一个重要的新 API 将是困难的。
我在 2020 年有些冒失地接受了这个挑战，编写了最初的 DRA KEP（现在被称为"经典 DRA"）并实现了其大部分功能，
然后从头开始编写了第二个 KEP，也就是今天的"结构化参数 DRA"。最初，说服维护者认为这项工作是必要的是一场艰难的斗争。
直到 2023 年左右，人们对 DRA 的兴趣才开始增长，最终促成了工作组的成立。

<!--
**John Belamaric:** I am a Senior Staff SWE at Google, and the third co-chair of WG Device Management, also since its inception. I am also a co-chair of [SIG Architecture](https://www.kubernetes.dev/community/community-groups/sigs/architecture/) since 2019. As Patrick mentioned, in late 2023, interest in DRA really picked up. The initial implementation, made autoscaling very challenging, and so there was some concern in the community about advancing it to beta. I got involved to try to help address some of those concerns, and the three of us, along with Tim Hockin, worked hard over the next few months to build a consensus around a new design. To facilitate this collaboration, we formed the working group after discussion at KubeCon in Paris in 2024.
-->
**John Belamaric：** 我是 Google 的高级软件工程师，同样自工作组成立以来担任 WG Device Management 的第三位联合主席。
自 2019 年以来，我也是 [SIG Architecture](https://www.kubernetes.dev/community/community-groups/sigs/architecture/)
的联合主席。正如 Patrick 提到的，2023 年末，人们对 DRA 的兴趣真正增长起来。
最初的实现使自动扩缩容变得非常困难，因此社区对将其推进到 Beta 阶段存在一些担忧。
我参与进来试图帮助解决这些问题，我们三人与 Tim Hockin 在接下来的几个月中努力围绕新设计达成了共识。
为了促进这种合作，我们在 2024 年巴黎 KubeCon 讨论后成立了这个工作组。

<!--
## The problem and the solution
-->
## 问题与解决方案 {#the-problem-and-the-solution}

<!--
The working group emerged from a fundamental rethink of how Kubernetes interacts with specialized hardware. At the heart of this evolution is **Dynamic Resource Allocation (DRA)**. Rather than treating devices as simple integers, DRA provides a structured framework that breaks device management into four distinct stages:

* **Modeling:** Vendors use the **ResourceSlice API** to advertise the granular capabilities and capacity of their hardware.
* **Requesting:** Users define their specific hardware needs—such as GPU memory or interconnect requirements—through the **`ResourceClaim` API**.
* **Scheduling:** The Kubernetes scheduler uses these APIs to match workload requirements against available hardware intelligently.
* **Actuation:** Once a match is made, the system handles the "handshake" that prepares and secures the device for the Pod's use.
-->
该工作组源于对 Kubernetes 如何与专用硬件交互的根本性重新思考。
这一演进的核心是**动态资源分配（DRA）**。
DRA 不再将设备视为简单的整数，而是提供了一个结构化框架，将设备管理分为四个不同的阶段：

* **建模：** 供应商使用 **ResourceSlice API** 来发布其硬件的细粒度能力和容量。
* **请求：** 用户通过 **`ResourceClaim` API** 定义其特定的硬件需求——例如 GPU 内存或互连要求。
* **调度：** Kubernetes 调度器使用这些 API 智能地将工作负载需求与可用硬件进行匹配。
* **执行：** 一旦匹配完成，系统处理"握手"过程，为 Pod 准备和保护设备。

<!--
**NF: For readers who may not be familiar, what is the Device Management Working Group, and what problems is it trying to solve?**
-->
**NF：对于可能不太熟悉的读者，什么是 Device Management 工作组，它试图解决什么问题？**

<!--
**KK:** The Device Management Working Group was chartered to enable simple and efficient configuration, sharing, and allocation of accelerators and other specialized hardware across Kubernetes workloads. Think GPUs, TPUs, FPGAs, and similar devices that don't fit neatly into Kubernetes' traditional resource model.
-->
**KK：** Device Management 工作组的使命是实现跨 Kubernetes 工作负载的加速器和其他专用硬件的简单高效配置、共享和分配。
想想 GPU、TPU、FPGA 以及类似的不能很好地融入 Kubernetes 传统资源模型的设备。

<!--
The problem we set out to solve is that the legacy Device Plugin API  (which has been the primary mechanism for exposing hardware accelerators in Kubernetes) is fundamentally limited. It treats devices as opaque integers: you can request "2 GPUs," but you can't say anything meaningful about which GPUs you need, how they should be connected to each other, whether they can be shared, or how they should be partitioned. That was fine for simple cases, but modern AI/ML workloads are anything but simple. They span multiple nodes, require specific interconnect topologies, and increasingly need to share or partition hardware dynamically.
-->
我们着手解决的问题是，传统的 Device Plugin API（一直是在 Kubernetes 中暴露硬件加速器的主要机制）存在根本性的限制。
它将设备视为不透明的整数：你可以请求"2 个 GPU"，但无法表达你需要哪些 GPU、它们之间应如何连接、是否可以共享或应如何分区等有意义的信息。
这对于简单场景是足够的，但现代 AI/ML 工作负载绝非简单。
它们跨越多个节点，需要特定的互连拓扑，并且越来越需要动态共享或分区硬件。

<!--
The working group's primary deliverable is Dynamic Resource Allocation (DRA), a new framework that replaces the rigid device plugin model with a flexible, declarative API.
With DRA, workloads can describe their hardware requirements (e.g., GPU type, memory capacity, interconnect topology, desired partitioning) and drivers can publish fine-grained device attributes that the scheduler can act on.
DRA [graduated](https://kubernetes.io/blog/2025/09/01/kubernetes-v1-34-dra-updates/) to GA in Kubernetes 1.34, and the ecosystem around it (e.g., drivers, tooling, and new API extensions) is growing rapidly.
-->
工作组的主要成果是动态资源分配（DRA），这是一个用灵活的声明式 API 替代僵化的设备插件模型的新框架。
通过 DRA，工作负载可以描述其硬件需求（例如 GPU 类型、内存容量、互连拓扑、期望的分区），
驱动程序可以发布细粒度的设备属性供调度器使用。
DRA 在 Kubernetes 1.34 中[正式 GA](https://kubernetes.io/blog/2025/09/01/kubernetes-v1-34-dra-updates/)，
围绕它的生态系统（例如驱动程序、工具和新的 API 扩展）正在快速增长。

<!--
**PO:** As Kevin said, the working group was formed around the existing effort to develop DRA. The initial work was done with only a handful of people actively involved, and perhaps also could only be done successfully in such a setup. But because it touches on so many different areas of Kubernetes, we also needed a place to discuss that and get the broader community of Kubernetes maintainers, device vendors, and, to a lesser extent, also end-users involved. The working group provides that place, with regular meetings online (one slot for Americas/EMEA, one for EMEA/Asia) and at KubeCon.
-->
**PO：** 正如 Kevin 所说，工作组是围绕现有的 DRA 开发工作成立的。
最初的工作只有少数人积极参与，也许也只有在这样的设置下才能成功完成。
但由于它涉及 Kubernetes 的众多不同领域，我们还需要一个地方来讨论这些问题，
并让更广泛的 Kubernetes 维护者、设备供应商以及（在较小程度上）最终用户社区参与进来。
工作组提供了这样的场所，定期在线会议（一个时段面向美洲/EMEA，一个面向 EMEA/亚洲）以及 KubeCon 上的讨论。

<!--
**JB:** DRA is the first problem the WG has addressed. It is focused on selection, allocation, and configuration of the devices. We broke the problem down into four parts: how does the vendor model the device and advertise capacity, how does the user request it, how do we schedule that request on top of the advertised capacity, and how do we actuate that result (that is, how do we make the device ready and available to the Pod).
-->
**JB：** DRA 是工作组解决的第一个问题。它专注于设备的选择、分配和配置。
我们将问题分解为四个部分：供应商如何对设备建模并发布容量、用户如何请求设备、
我们如何在已发布的容量之上调度该请求，以及我们如何执行该结果（即如何使设备准备好并可供 Pod 使用）。

<!--
One thing that is fundamental to the approach we took is an awareness of the incredible diversity of hardware and the rapid rate of change in the hardware industry. We knew that we couldn't keep up with the change if the Kubernetes APIs had to change for every type of hardware. Instead, we created a general approach where we address the hardware aspects that are important to Kubernetes. What we have done so far is focus on the scheduling and configuration aspects of devices. We build a device modeling API (the ResourceSlice API) that vendors use to model the scheduling characteristics of their devices, and allow users to pass through arbitrary configurations to those devices. By doing this, Kubernetes can be "programmed" to understand these aspects of the devices, without needing to be modified.
-->
我们采取的方法中有一个根本性的认识，那就是硬件的多样性令人难以置信，而且硬件行业的变化速度也极快。
我们知道，如果 Kubernetes API 必须为每种类型的硬件而改变，我们就无法跟上这种变化。
相反，我们创建了一种通用方法，来处理对 Kubernetes 重要的硬件方面。
到目前为止，我们的工作重点是设备的调度和配置方面。
我们构建了一个设备建模 API（ResourceSlice API），供应商用它来描述其设备的调度特性，
并允许用户向这些设备传递任意配置。
通过这样做，Kubernetes 可以被"编程"来理解设备的这些方面，而无需自身被修改。

<!--
But DRA, as it stands right now, is very focused on scheduling. There are other aspects of Device Management that are in scope for the WG. In particular, we are looking into device failure detection and mitigation, and whether there is some better support we can build into Kubernetes to help.
-->
但目前的 DRA 非常专注于调度。设备管理还有其他方面属于工作组的范围。
特别是，我们正在研究设备故障检测和缓解，以及我们是否可以在 Kubernetes 中构建更好的支持来帮助解决这些问题。

<!--
Also, as Kevin alluded to, devices are often allocated and used in groups, rather than individually. Choosing the right devices to work together in a group depends on how they are interconnected; for example, NVIDIA GPUs may be in an any-to-any fabric arrangement in an NVLINK domain, whereas TPUs may have a 3D torus interconnect. This affects the "selection, allocation and configuration" of devices, and we have a lot more work to do to address these use cases.
-->
此外，正如 Kevin 提到的，设备通常是以组的形式分配和使用的，而不是单独使用。
选择正确的设备在组中协同工作取决于它们的互连方式；
例如，NVIDIA GPU 可能在 NVLINK 域中采用任意对任意的 fabric 排列，而 TPU 可能采用 3D 环面互连。
这会影响设备的"选择、分配和配置"，我们还有大量工作要做来解决这些使用场景。

<!--
## A cross-SIG effort
-->
## 跨 SIG 协作 {#a-cross-sig-effort}

<!--
Because device management touches scheduling, node operations, autoscaling, networking, and API design, the work naturally spans multiple SIGs across the Kubernetes project.
-->
由于设备管理涉及调度、节点操作、自动扩缩容、网络和 API 设计，这项工作自然跨越了 Kubernetes 项目中的多个 SIG。

<!--
**NF: How does collaboration across these SIGs work in practice, and why is it necessary?**
-->
**NF：跨 SIG 协作在实践中是如何运作的，为什么是必要的？**

<!--
**KK:** Device management touches nearly every layer of the Kubernetes stack, which is why the working group was chartered as a cross-SIG effort from the start. We have five stakeholder SIGs: sig-node, sig-scheduling, sig-autoscaling, sig-network, and sig-architecture.
-->
**KK：** 设备管理几乎涉及 Kubernetes 栈的每一层，这就是为什么工作组从一开始就被定位为跨 SIG 的协作。
我们有五个利益相关的 SIG：sig-node、sig-scheduling、sig-autoscaling、sig-network 和 sig-architecture。

<!--
In practice, the working group serves as a coordination layer. We don't own code directly; instead, our deliverables take the form of KEPs and implementations that live in the respective SIGs. What we provide is a unified forum where the people building the scheduler, the kubelet, the autoscaler, and the network plane can design together rather than in isolation.
-->
在实践中，工作组充当协调层。我们不直接拥有代码；相反，我们的成果以 KEP 和实现的形式存在于各自的 SIG 中。
我们提供的是一个统一的论坛，让构建调度器、kubelet、自动扩缩器和网络平面的人能够协同设计，而不是各自为政。

<!--
Why is this necessary? Consider a simple example: a user requests a set of GPUs that need to communicate via NVLink. That requirement involves the scheduler (place the pods on the right nodes), the kubelet (configure the devices and expose them to the container), and potentially autoscaling (provision the right node type if none exists).
-->
为什么这是必要的？考虑一个简单的例子：用户请求一组需要通过 NVLink 通信的 GPU。
该需求涉及调度器（将 Pod 放置在正确的节点上）、kubelet（配置设备并将其暴露给容器）以及可能的自动扩缩容（如果不存在合适的节点则配置正确的节点类型）。

<!--
If those three groups design independently, you end up with inconsistent abstractions, duplicated logic, and integration bugs that only surface in production. The working group ensures that a single coherent API and data model flows through all of these components.
-->
如果这三个团队独立设计，你最终会得到不一致的抽象、重复的逻辑以及只在生产环境中才会暴露的集成缺陷。
工作组确保单一一致的 API 和数据模型贯穿所有这些组件。

<!--
The cross-SIG model also means that design decisions are reviewed from multiple angles. Someone from sig-scheduling will catch scheduler complexity that a sig-node contributor might overlook, and vice versa. It slows down individual decisions slightly, but produces much more robust outcomes.
-->
跨 SIG 模型还意味着设计决策会从多个角度进行审查。
sig-scheduling 的人会发现 sig-node 贡献者可能忽视的调度器复杂性，反之亦然。
这会稍微减慢单个决策的速度，但会产生更健壮的结果。

<!--
## Current focus areas
-->
## 当前重点领域 {#current-focus-areas}

<!--
With DRA now generally available, the working group's focus has expanded to enable more advanced scheduling models, shared semantics, operational visibility, and support for increasingly complex hardware topologies.
-->
随着 DRA 正式 GA，工作组的重点已扩展到支持更高级的调度模型、共享语义、运维可见性以及对日益复杂的硬件拓扑的支持。

<!--
**NF: What are some of the key initiatives or deliverables the working group is currently focused on?**
-->
**NF：工作组目前聚焦的一些关键举措或成果是什么？**

<!--
**KK:** We maintain a project board at [Kubernetes Project Board](https://github.com/orgs/kubernetes/projects/95) with real-time tracking of our initiatives and their progress.
-->
**KK：** 我们在 [Kubernetes 项目看板](https://github.com/orgs/kubernetes/projects/95)上维护着一个项目看板，
实时跟踪我们的举措及其进展。

<!--
**PO:** The scope and feature set of core DRA were intentionally limited to enable graduation to GA within a reasonable time. Additional KEPs add more features, on their own schedule. Those fall roughly into three categories:

1. Extend the expressiveness of DRA to support more complex devices and scheduling scenarios.
2. Support _day two_ operations like health monitoring.
3. Improve multi-node support, primarily by integrating with workload-aware scheduling.
-->
**PO：** 核心 DRA 的范围和功能集是有意限制的，以便在合理的时间内晋级到 GA。
额外的 KEP 按照各自的计划添加更多功能。这些大致分为三类：

1. 扩展 DRA 的表达能力以支持更复杂的设备和调度场景。
2. 支持_第二天（Day 2）_运维操作，如健康监控。
3. 改善多节点支持，主要通过与工作负载感知调度集成。

<!--
In addition to the project board, we also maintain a table which summarizes all the [KEPs](https://www.kubernetes.dev/resources/keps/) which are currently in flight. This is the status for 1.36; more are likely to be added for 1.37:
-->
除了项目看板，我们还维护了一个表格来汇总所有当前正在进行的 [KEP](https://www.kubernetes.dev/resources/keps/)。
以下是 1.36 的状态；1.37 可能会添加更多：

| KEP | 描述 | 版本 |  |  |  |  |
| :---: | :---- | :---: | :---: | :---: | :---: | :---: |
|  |  | **1.32** | **1.33** | **1.34** | **1.35** | **1.36** |
| [4381](https://www.kubernetes.dev/resources/keps/4381) | DRA: Structured Parameters | Beta | Beta | Stable |  |  |
| [5004](https://www.kubernetes.dev/resources/keps/5004) | DRA: Extended Resource Requests via DRA |  |  | Alpha | Alpha | Beta |
| [4817](https://www.kubernetes.dev/resources/keps/4817)  | DRA: Resource Claim Status | Alpha | Beta | Beta | Beta | Beta  |
| [5018](https://www.kubernetes.dev/resources/keps/5018) | DRA: Namespace Controlled Admin Access |  | Alpha | Beta | Beta | Stable |
| [5055](https://www.kubernetes.dev/resources/keps/5055) | DRA: Device Taints and Tolerations |  | Alpha | Alpha | Alpha | Beta |
| [4816](https://www.kubernetes.dev/resources/keps/4816) | DRA: Prioritized Alternatives in Device Requests |  | Alpha | Beta | Beta | Stable |
| [5075](https://www.kubernetes.dev/resources/keps/5075) | DRA: Consumable Capacity |  |  | Alpha | Alpha | Beta |
| [4815](https://www.kubernetes.dev/resources/keps/4815) | DRA: Partitionable Devices |  | Alpha | Alpha | Alpha | Beta |
| [5304](https://www.kubernetes.dev/resources/keps/5304) | DRA: Attributes Downward API |  |  |  |  | Alpha |
| [5729](https://www.kubernetes.dev/resources/keps/5729) | DRA: ResourceClaim Support for Workloads |  |  |  |  | Alpha |
| [4680](https://www.kubernetes.dev/resources/keps/4680) | Resource Health Status in Pod Status | Alpha | Alpha | Alpha | Alpha | Beta |
| [5517](https://www.kubernetes.dev/resources/keps/5517) | DRA: Native Resource Requests |  |  |  |  | Alpha |
| [5677](https://www.kubernetes.dev/resources/keps/5677) | DRA: Resource Availability Visibility |  |  |  |  | Alpha |
| [5007](https://www.kubernetes.dev/resources/keps/5007) | DRA: Device Binding Conditions |  |  | Alpha | Alpha | Beta |
| [5491](https://www.kubernetes.dev/resources/keps/5491) | DRA: List Types for Attributes |  |  |  |  | Alpha |

<!--
**NF: One of the core challenges is efficient device utilization and sharing. What progress is being made in this area?**
-->
**NF：核心挑战之一是高效的设备利用和共享。这方面取得了什么进展？**

<!--
**JB:** Good question. One way to think about it is what we are doing in the two primary APIs: ResourceClaim and ResourceSlice.
-->
**JB：** 好问题。一种思考方式是看我们在两个主要 API 中正在做什么：ResourceClaim 和 ResourceSlice。

<!--
The ResourceClaim API is how the user asks for devices. We have built some features that allow the user to be more flexible in their requests. For example, instead of asking for a specific model of GPU, they can ask for a GPU with at least a certain amount of memory. Or they can ask for a list of alternatives: "I'd like one A100 (80GB) GPU, but if you don't have it, I'll take 2 A100 (40 GB) GPUs." This gives the scheduler some options to satisfy the request, which can lead to better obtainability and utilization of hardware that otherwise would not be selected.
-->
ResourceClaim API 是用户请求设备的方式。
我们构建了一些功能，允许用户在请求中更加灵活。
例如，用户可以请求具有至少一定内存量的 GPU，而不是请求特定型号的 GPU。
或者他们可以请求一个备选列表："我想要一个 A100（80GB）GPU，但如果没有，我可以接受 2 个 A100（40GB）GPU。"
这为调度器提供了满足请求的选项，可以带来更好的硬件可获得性和利用率，否则这些硬件不会被选择。

<!--
The ResourceClaim API allows users to explicitly share devices. You can point multiple containers (in the same or different Pods) at a ResourceClaim; this allows the devices allocated by that claim to be used in all of those containers, *if the device supports it*.
-->
ResourceClaim API 允许用户显式共享设备。
你可以将多个容器（在相同或不同的 Pod 中）指向一个 ResourceClaim；
这允许该声明分配的设备在所有这些容器中使用，*前提是设备支持此操作*。

<!--
The ResourceSlice API is how vendors model and advertise their devices. This is where we implement support for other sharing models. For example, we have a way to represent "overlapping partitions", enabling the scheduler to dynamically select a MIG partition, and make any overlapping MIG partitions unavailable automatically. This works well in combination with a request like "give me any GPU with 20GB or more of memory" \- the scheduler can satisfy that with a MIG or a real GPU.
-->
ResourceSlice API 是供应商建模和发布其设备的方式。这是我们实现对其他共享模型支持的地方。
例如，我们有一种表示"重叠分区"的方式，使调度器能够动态选择 MIG 分区，并自动使任何重叠的 MIG 分区不可用。
这与"给我任何具有 20GB 或更多内存的 GPU"这样的请求配合使用效果很好——调度器可以用 MIG 或真实 GPU 来满足该请求。

<!--
Some features require changes in both. We have another sharing method we call "consumable capacity". In the explicit sharing case described above, a user needs to point containers at the same ResourceClaim; there is one ResourceClaim shared amongst several containers and Pods. With consumable capacity, the device sharing works more like how Pods share a Node. The user creates a ResourceClaim that asks for a certain amount of resources, for example, "I need a NIC with 2Gbps of bandwidth". The scheduler knows that there is a NIC with 40Gbps of bandwidth available, and so it allocates 2Gbps out of that 40Gbps and gives it to that ResourceClaim. In this case, each Pod has its own ResourceClaim, but the underlying device is shared between those claims. It's up to the on-node DRA driver to properly set up the device for this sort of sharing (in the NIC case, likely by creating a subinterface). We call this "platform-mediated sharing" to differentiate it from the explicit "user-mediated sharing".
-->
有些功能需要两者同时修改。我们还有另一种共享方式叫做"可消耗容量"（consumable capacity）。
在上述显式共享场景中，用户需要将容器指向同一个 ResourceClaim；有一个 ResourceClaim 在多个容器和 Pod 之间共享。
而对于可消耗容量，设备共享的方式更像 Pod 共享节点的方式。
用户创建一个 ResourceClaim 来请求一定量的资源，例如，"我需要一个具有 2Gbps 带宽的网卡"。
调度器知道有一个 40Gbps 带宽的网卡可用，因此它从 40Gbps 中分配 2Gbps 给该 ResourceClaim。
在这种情况下，每个 Pod 都有自己的 ResourceClaim，但底层设备在这些声明之间共享。
节点上的 DRA 驱动程序负责为这种共享正确设置设备（对于网卡，可能通过创建子接口）。
我们称之为"平台介导的共享"，以区别于显式的"用户介导的共享"。

<!--
## Real-world impact
-->
## 实际影响 {#real-world-impact}

<!--
While much of the work is deeply technical, the underlying goal is practical: enabling Kubernetes to better support real-world AI/ML and hardware-intensive workloads at scale.
-->
虽然大部分工作是深度技术性的，但其根本目标是实用的：使 Kubernetes 能够更好地大规模支持实际的 AI/ML 和硬件密集型工作负载。

<!--
**NF: What are the biggest challenges users face today when running hardware-intensive workloads (like AI/ML) on Kubernetes?**
-->
**NF：当前用户在 Kubernetes 上运行硬件密集型工作负载（如 AI/ML）时面临的最大挑战是什么？**

<!--
**PO:** Such workloads depart from traditional container workloads in several ways: they may consist of multiple communicating pods which all need to run at the same time ("gang scheduling"). They are often long-running and expensive to initialize, and their performance is sensitive to where they run (topology within a node and interconnects between nodes for multiple pods). The Kubernetes scheduler traditionally has not supported either of this well because it schedules one pod at a time and is unaware of the topology within a node. Several external schedulers try to fill this gap, which often isn't ideal, in particular when the Kubernetes scheduler schedules other pods to the same cluster.
-->
**PO：** 这类工作负载在几个方面不同于传统容器工作负载：它们可能由多个需要同时运行的通信 Pod 组成（"组调度"）。
它们通常是长时间运行且初始化成本高昂的，其性能对运行位置很敏感（节点内的拓扑以及多 Pod 之间的节点间互连）。
Kubernetes 调度器传统上对这两者的支持都不好，因为它一次调度一个 Pod 并且不了解节点内的拓扑。
一些外部调度器试图填补这个空白，但这通常并不理想，特别是当 Kubernetes 调度器将其他 Pod 调度到同一集群时。

<!--
**NF: How should platform engineers think about device management when designing their Kubernetes platforms?**
-->
**NF：平台工程师在设计 Kubernetes 平台时应该如何考虑设备管理？**

<!--
**JB:** We're still learning here, but one idea of DRA is to enable a shift to more "requirements driven" specifications. This can allow less coupling between end users that write the workload specification and the cluster administrators that set up the clusters. Instead of agreeing on labeling conventions and requiring users to understand the cluster topology, the users can specify what their workload needs, and the scheduler can figure out how to satisfy it. If we can make this work, it can make even complex workloads more portable across clusters.
-->
**JB：** 我们还在学习中，但 DRA 的一个理念是实现向更"需求驱动"规格的转变。
这可以减少编写工作负载规格的最终用户和设置集群的集群管理员之间的耦合。
用户不必商定标签约定或要求用户了解集群拓扑，而是可以指定其工作负载需要什么，调度器来决定如何满足。
如果我们能使其工作，即使是复杂的工作负载也可以更容易地在集群之间移植。

<!--
## Challenges and trade-offs
-->
## 挑战和权衡 {#challenges-and-trade-offs}

<!--
As with many areas of Kubernetes, increasing flexibility and expressiveness also introduces new layers of complexity, particularly around scheduling and optimization.
-->
与 Kubernetes 的许多领域一样，增加灵活性和表达能力也引入了新的复杂性层次，特别是在调度和优化方面。

<!--
**NF: What are some of the hardest technical challenges the working group is tackling today?**
-->
**NF：工作组目前正在解决的最难的技术挑战有哪些？**

<!--
**PO:** There's an inherent conflict between flexibility and scheduling complexity. The current implementation is focused on finding some solution that satisfies the requested resources, but it's not necessarily the best one, whatever "best" means, which is also not always clear. The other big challenge is exposing node-allocatable resources (RAM, CPU) as devices with additional metadata; this is necessary to fine-tune scheduling of workloads which need perfect alignment on a node for optimal performance.
-->
**PO：** 灵活性和调度复杂性之间存在固有的冲突。
当前的实现侧重于找到满足所请求资源的某种解决方案，但它不一定是最佳方案——无论"最佳"意味着什么——这一点也并不总是清晰的。
另一个大挑战是将节点可分配资源（RAM、CPU）作为带有额外元数据的设备暴露出来；
这对于精细调优需要在节点上完美对齐以获得最佳性能的工作负载的调度是必要的。

<!--
**JB:** Patrick's list is good. Complex device modeling is hard, and making sure that we build the right semantics such that they apply to lots of different hardware is always tricky.
-->
**JB：** Patrick 的列表很好。复杂设备建模很困难，确保我们构建正确的语义使其适用于多种不同硬件始终是棘手的。

<!--
On top of that, scheduling in general is very complex and is an NP-hard problem. All the metadata and flexibility DRA adds gives the scheduler more options, which has pros and cons. More options are helpful if you are constrained in your choices, as it means you can schedule something that you otherwise could not. But it also means it is even harder to find an optimal solution when there are many possibilities in a given cluster. DRA works well in our common use cases so far, but we have a lot of work to do to improve the optimality of the chosen scheduling solution and ensure the performance of making that choice.
-->
除此之外，调度本身就非常复杂，是一个 NP 难问题。
DRA 添加的所有元数据和灵活性给调度器更多选项，这有优点也有缺点。
如果你的选择受限，更多选项是有帮助的，因为这意味着你可以调度原本无法调度的内容。
但这也意味着当给定集群中有很多可能性时，找到最优解决方案变得更加困难。
DRA 在我们常见的用例中目前运行良好，但我们还有大量工作要做，以提高所选调度方案的最优性并确保做出选择的性能。

<!--
## Looking ahead
-->
## 展望未来 {#looking-ahead}

<!--
Despite the challenges, contributors across the working group remain excited about the pace of innovation and the growing community forming around device management in Kubernetes.
-->
尽管面临挑战，工作组的贡献者们对创新的步伐和围绕 Kubernetes 设备管理形成的不断壮大的社区仍然感到兴奋。

<!--
**NF: Looking ahead, what are you most excited about in the future of device management in Kubernetes?**
-->
**NF：展望未来，你对 Kubernetes 设备管理的未来最感兴趣的是什么？**

<!--
**KK:** NVIDIA recently donated its DRA driver for GPUs to the Kubernetes project. I'm personally excited for more community members to start contributing to the project and defining its future direction.
-->
**KK：** NVIDIA 最近将其 GPU 的 DRA 驱动程序捐赠给了 Kubernetes 项目。
我个人很期待看到更多社区成员开始为项目做贡献并定义其未来方向。

<!--
**PO:** For me, it's primarily the number of new contributors and people stepping up to help out. This poses new challenges around reviewing proposals and helping developers get those implemented and merged. It's nice and rewarding to see others succeed, and it bodes well for the future because more people are familiar with the topic.
-->
**PO：** 对我来说，主要是新贡献者的数量和站出来帮忙的人。
这带来了围绕审查提案和帮助开发者实现和合并代码的新挑战。
看到别人成功是令人愉快和有意义的，这对未来也是一个好兆头，因为更多人熟悉了这个主题。

<!--
**JB:** I am excited about a lot of things. The community really has grown and has so many interesting features in the works to enable modeling of more complex devices, and to better model multi-node devices.
-->
**JB：** 我对很多事情感到兴奋。社区确实在壮大，有许多有趣的功能正在开发中，
以支持更复杂设备的建模，以及更好地对多节点设备建模。

<!--
I am really excited to see the creative ways people will use these APIs. They were primarily designed to address "devices", but just like how "everything is a file" in Unix/Linux, the APIs themselves are quite flexible as to what they model. They really build out a more programmable scheduler, which can have interesting applications. For example, I recently prototyped using DRA to schedule pods to nodes where a large AI model is already locally cached. It's really quite flexible, and I have great confidence in the creativity of our community, so I think we'll see some unexpected solutions in the ecosystem.
-->
我真的很期待看到人们以创造性的方式使用这些 API。
它们主要是为"设备"而设计的，但就像 Unix/Linux 中"一切皆文件"一样，这些 API 本身对于它们建模的内容是相当灵活的。
它们确实构建了一个更可编程的调度器，这可以有有趣的应用。
例如，我最近做了一个原型，使用 DRA 将 Pod 调度到已本地缓存了大型 AI 模型的节点上。
它确实非常灵活，我对社区的创造力有很大的信心，所以我认为我们会在生态系统中看到一些意想不到的解决方案。

<!--
# Getting involved
-->
# 参与贡献 {#getting-involved}

<!--
**NF: How can contributors get involved with the Device Management Working Group?**
-->
**NF：贡献者如何参与 Device Management 工作组？**

<!--
**KK:** The easiest first step is to join our mailing list at [wg-device-management@kubernetes.io](mailto:wg-device-management@kubernetes.io). Subscribing will automatically add calendar invites for our biweekly meetings to your calendar.
-->
**KK：** 最简单的第一步是加入我们的邮件列表 [wg-device-management@kubernetes.io](mailto:wg-device-management@kubernetes.io)。
订阅后会自动将我们双周会议的日历邀请添加到你的日历中。

<!--
  We have two meeting slots to accommodate different time zones:

- Europe/Americas: Tuesdays at 8:30 AM PT (biweekly)
- Asia/Europe: Wednesdays at 9:00 AM CET (biweekly)
-->
我们有两个会议时段以适应不同的时区：

- 欧洲/美洲：每两周二 太平洋时间上午 8:30
- 亚洲/欧洲：每两周三 中欧时间上午 9:00

<!--
Meeting notes, agendas, and recordings are all publicly accessible (links available from [Device Management page](https://www.kubernetes.dev/community/community-groups/wg/device-management/#meetings)). You can get a feel for the work in progress before attending your first meeting.
-->
会议记录、议程和录像都是公开可访问的（链接可从[设备管理页面](https://www.kubernetes.dev/community/community-groups/wg/device-management/#meetings)获取）。
你可以在参加第一次会议之前了解正在进行的工作。

<!--
On Slack, find us in `#wg-device-management` on the Kubernetes Slack workspace. That's the best place for quick questions or to introduce yourself.
-->
在 Slack 上，你可以在 Kubernetes Slack 工作区的 `#wg-device-management` 频道找到我们。
那是快速提问或自我介绍的最佳地方。

<!--
For more hands-on contributions, the DRA Driver for NVIDIA GPUs is now a community project and a great place to start. It's a real-world, production-grade implementation that the broader community is now shaping together.
-->
对于更实际的贡献，NVIDIA GPU 的 DRA 驱动程序现在是一个社区项目，也是一个很好的起点。
它是一个真实的、生产级的实现，更广泛的社区现在正在共同塑造。

<!--
We welcome contributors at all levels – whether you're interested in the API design, the scheduler internals, driver development, or documentation. Come say hello.
-->
我们欢迎各级别的贡献者——无论你对 API 设计、调度器内部机制、驱动程序开发还是文档感兴趣。来打个招呼吧。

<!--
## Summary
-->
## 总结 {#summary}

<!--
As Kubernetes evolves to support the AI/ML revolution and high-performance computing, the work happening within WG Device Management is becoming the foundation for how modern workloads are scheduled and operated at scale.
-->
随着 Kubernetes 不断发展以支持 AI/ML 革命和高性能计算，WG Device Management 中正在进行的工作正在成为现代工作负载如何大规模调度和运行的基础。

<!--
From the graduation of Dynamic Resource Allocation (DRA) to the next frontiers of health monitoring and topology-aware scheduling, this group is effectively rewriting the "handshake" between software and hardware.
-->
从动态资源分配（DRA）正式 GA 到健康监控和拓扑感知调度的下一个前沿，该工作组实际上正在重写软件和硬件之间的"握手"。

<!--
If you're interested in shaping the future of hardware-aware orchestration, now is the perfect time to get involved. Whether you want to help refine the API, build out drivers, or improve documentation, the working group welcomes all levels of experience and perspectives from across the community.
-->
如果你有兴趣塑造硬件感知编排的未来，现在是参与的最佳时机。
无论你是想帮助完善 API、构建驱动程序还是改进文档，工作组欢迎来自社区各个层次的经验和观点。
