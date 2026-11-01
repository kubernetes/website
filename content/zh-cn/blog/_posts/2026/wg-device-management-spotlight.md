---
layout: blog
title: "聚焦设备管理工作组"
slug: wg-device-management-spotlight-2026
date: 2026-06-24T10:00:00-08:00
author: "Natalie Fisher"
translator: >
  [windsonsea](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Spotlight on WG Device Management"
slug: wg-device-management-spotlight-2026
date: 2026-06-24T10:00:00-08:00
canonicalUrl: https://www.kubernetes.dev/blog/2026/06/24/wg-device-management-spotlight-2026
author: "Natalie Fisher"
-->

<!--
The rising popularity of AI, Edge, and Telecommunications workloads on Kubernetes has led to new requirements for hardware management. We now need hardware specification beyond CPU time and memory allocations.  This includes allocating GPUs, TPUs, network interfaces, and other hardware, sometimes after pod start and occasionally through time-sharing. 
-->
AI、边缘计算和电信工作负载在 Kubernetes 上的日益普及，对硬件管理提出了新的要求。
我们现在需要超越 CPU 时间和内存分配的硬件规格说明。
这包括分配 GPU、TPU、网络接口和其他硬件，有时需要在 Pod 启动之后进行，偶尔还需要通过时间共享来实现。

<!--
Efficiently managing this specialized hardware is the mission of the **[Device Management Working Group](https://www.kubernetes.dev/community/community-groups/wg/device-management/)**. Their cornerstone project, **[Dynamic Resource Allocation (DRA)](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)**, recently graduated to GA, marking a fundamental shift in how the project handles hardware-intensive workloads at scale.
-->
高效地管理这些专用硬件是**[设备管理工作组](https://www.kubernetes.dev/community/community-groups/wg/device-management/)**的使命。
该工作组的核心项目**[动态资源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)**近期已正式发布（GA），
标志着该项目在大规模处理硬件密集型工作负载的方式上发生了根本性转变。

<!--
In this spotlight, we sit down with working group chairs **[Kevin Klues](https://github.com/klueska)**, **[Patrick Ohly](https://github.com/pohly)**, and
**[John Belamaric](https://github.com/johnbelamaric)** to discuss the limitations of the legacy device model,
the _NP-hard_ challenges of scheduling, and how they're building a more programmable, hardware-aware future for Kubernetes.
-->
在本篇聚焦中，我们与工作组主席 **[Kevin Klues](https://github.com/klueska)**、
**[Patrick Ohly](https://github.com/pohly)** 和
**[John Belamaric](https://github.com/johnbelamaric)** 进行了深入交流，
讨论了传统设备模型的局限性、调度中的 **NP 困难**挑战，
以及他们如何为 Kubernetes 构建一个更具可编程性、硬件感知的未来。

<!--
## Introducing Device Management
-->
## 设备管理介绍 {#introducing-device-management}

<!--
**Natalie Fisher: Can you introduce yourself, your role, and how you got involved in the Device Management Working Group?**
-->
**Natalie Fisher：请介绍一下你自己、你的角色，以及你是如何加入设备管理工作组的？**

<!--
**Kevin Klues:** My name is Kevin Klues. I am a Distinguished Engineer at NVIDIA. I have been a co-chair of the device management working group since its inception at Kubecon EU 2024. I have also been involved with DRA (the working group's primary deliverable) since its inception in 2019 / 2020.
I have also been a kubelet maintainer since 2019, with a focus on its device manager, CPU manager, and topology manager subcomponents. The challenges we saw with using these components for workloads that relied on external accelerators (e.g., GPUs) are what triggered us to start working on DRA in the first place.
-->
**Kevin Klues：** 我叫 Kevin Klues，是 NVIDIA 的杰出工程师。
自 2024 年 KubeCon EU 大会上设备管理工作组成立以来，我一直担任联合主席。
我也从 2019/2020 年 DRA（工作组的主要交付成果）创立之初就参与其中。
我自 2019 年起还是 kubelet 的维护者，主要负责其设备管理器、CPU 管理器和拓扑管理器等子组件。
我们在使用这些组件处理依赖外部加速器（如 GPU）的工作负载时所遇到的挑战，正是促使我们开始开发 DRA 的原因。

<!--
**Patrick Ohly:** I am a Principal Engineer at Intel. In Kubernetes, I am a Tech Lead for [SIG Testing](https://www.kubernetes.dev/community/community-groups/sigs/testing/) and [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/) and co-chair of the Device Management WG. I was co-chair of the WG Structured Logging and a member of the Steering Committee. Some of my early contributions to Kubernetes include [ephemeral CSI volumes](https://kubernetes.io/docs/concepts/storage/ephemeral-volumes/) and storage capacity tracking, so I had some experience with API design, implementation, and scheduling. We knew that introducing a major new API for accelerators would be hard. Somewhat foolishly, I accepted that challenge in 2020, wrote the initial DRA KEP (now known as "classic DRA") and implemented most of it, then started over with a second KEP for today's "structured parameters DRA". Initially, it was an uphill battle to convince maintainers that this work was necessary. It was only around 2023 that interest in DRA picked up, leading to the formation of the working group.
-->
**Patrick Ohly：** 我是 Intel 的首席工程师。在 Kubernetes 中，我是
[SIG Testing](https://www.kubernetes.dev/community/community-groups/sigs/testing/) 和
[SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/)
的技术负责人，也是设备管理工作组的联合主席。我曾担任结构化日志工作组的联合主席，也是指导委员会的成员。
我对 Kubernetes 的一些早期贡献包括[临时 CSI 卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/)和存储容量跟踪，
因此我在 API 设计、实现和调度方面有一些经验。我们知道，为加速器引入一个重大的新 API 会很困难。在 2020 年，
我有些冒失地接受了这个挑战，编写了最初的 DRA KEP（现在被称为"经典 DRA"）并实现了其中的大部分内容，
然后又以第二个 KEP 重新开始，也就是今天的"结构化参数 DRA"。起初，要让维护者们相信这项工作是必要的，是一场艰难的战斗。
直到 2023 年左右，DRA 的关注度才逐渐升温，进而促成了工作组的成立。

<!--
**John Belamaric:** I am a Senior Staff SWE at Google, and the third co-chair of WG Device Management, also since its inception. I am also a co-chair of [SIG Architecture](https://www.kubernetes.dev/community/community-groups/sigs/architecture/) since 2019. As Patrick mentioned, in late 2023, interest in DRA really picked up. The initial implementation, made autoscaling very challenging, and so there was some concern in the community about advancing it to beta. I got involved to try to help address some of those concerns, and the three of us, along with Tim Hockin, worked hard over the next few months to build a consensus around a new design. To facilitate this collaboration, we formed the working group after discussion at KubeCon in Paris in 2024. 
-->
**John Belamaric：** 我是 Google 的高级资深软件工程师，也是设备管理工作组的第三位联合主席，同样自工作组成立之初就担任此职。
我自 2019 年起还担任 [SIG Architecture](https://www.kubernetes.dev/community/community-groups/sigs/architecture/)
的联合主席。正如 Patrick 所说，2023 年底 DRA 的关注度确实大幅提升。最初的实现使得自动扩缩容变得非常具有挑战性，
因此社区对将其推进到 Beta 阶段存在一些顾虑。我参与进来是为了帮助解决其中一些问题，我们三人连同 Tim Hockin
在接下来的几个月里努力工作，围绕一个新设计达成了共识。为了促进这种协作，我们在 2024 年巴黎 KubeCon 的讨论之后成立了这个工作组。

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
这个工作组源于对 Kubernetes 如何与专用硬件交互的一次根本性重新思考。这一演进的核心是**动态资源分配（DRA）**。
DRA 不再将设备视为简单的整数，而是提供了一个结构化框架，将设备管理分解为四个不同的阶段：

* **建模：** 供应商使用 **ResourceSlice API** 来发布其硬件的细粒度能力和容量。
* **请求：** 用户通过 **`ResourceClaim` API** 定义其具体的硬件需求——例如 GPU 内存或互连要求。
* **调度：** Kubernetes 调度器使用这些 API，智能地将工作负载需求与可用硬件进行匹配。
* **驱动：** 一旦匹配成功，系统会处理"握手"过程，为 Pod 的使用准备并保障设备。

<!--
**NF: For readers who may not be familiar, what is the Device Management Working Group, and what problems is it trying to solve?**
-->
**NF：对于可能不太了解的读者，什么是设备管理工作组，它试图解决什么问题？**

<!--
**KK:** The Device Management Working Group was chartered to enable simple and efficient configuration, sharing, and allocation of accelerators and other specialized hardware across Kubernetes workloads. Think GPUs, TPUs, FPGAs, and similar devices that don't fit neatly into Kubernetes' traditional resource model. 
-->
**KK：** 设备管理工作组的宗旨是实现在 Kubernetes 工作负载中对加速器和其他专用硬件进行简单高效的配置、共享和分配。
想想 GPU、TPU、FPGA 以及类似设备，它们无法整齐地归入 Kubernetes 的传统资源模型。

<!--
The problem we set out to solve is that the legacy Device Plugin API  (which has been the primary mechanism for exposing hardware accelerators in Kubernetes) is fundamentally limited. It treats devices as opaque integers: you can request "2 GPUs," but you can't say anything meaningful about which GPUs you need, how they should be connected to each other, whether they can be shared, or how they should be partitioned. That was fine for simple cases, but modern AI/ML workloads are anything but simple. They span multiple nodes, require specific interconnect topologies, and increasingly need to share or partition hardware dynamically.
-->
我们着手解决的问题是，传统的设备插件 API（一直是 Kubernetes 中暴露硬件加速器的主要机制）从根本上存在局限性。
它将设备视为不透明的整数：你可以请求 "2 个 GPU"，但无法说明你需要哪些 GPU、它们应该如何相互连接、是否可以共享，
或者应该如何分区。这对于简单场景来说没问题，但现代 AI/ML 工作负载绝非简单。它们跨越多个节点，
需要特定的互连拓扑，并且越来越需要动态地共享或分区硬件。

<!--
The working group's primary deliverable is Dynamic Resource Allocation (DRA), a new framework that replaces the rigid device plugin model with a flexible, declarative API.
With DRA, workloads can describe their hardware requirements (e.g., GPU type, memory capacity, interconnect topology, desired partitioning) and drivers can publish fine-grained device attributes that the scheduler can act on.
DRA [graduated](https://kubernetes.io/blog/2025/09/01/kubernetes-v1-34-dra-updates/) to GA in Kubernetes 1.34, and the ecosystem around it (e.g., drivers, tooling, and new API extensions) is growing rapidly.
-->
工作组的主要交付成果是动态资源分配（DRA），这是一个新框架，用灵活的声明式 API 取代了僵化的设备插件模型。
借助 DRA，工作负载可以描述其硬件需求（例如 GPU 类型、内存容量、互连拓扑、期望的分区方式），
驱动程序可以发布调度器可据以行动的细粒度设备属性。
DRA 在 Kubernetes 1.34 中[毕业](/blog/2025/09/01/kubernetes-v1-34-dra-updates/)至 GA，
围绕它的生态系统（例如驱动程序、工具和新的 API 扩展）正在快速壮大。

<!--
**PO:** As Kevin said, the working group was formed around the existing effort to develop DRA. The initial work was done with only a handful of people actively involved, and perhaps also could only be done successfully in such a setup. But because it touches on so many different areas of Kubernetes, we also needed a place to discuss that and get the broader community of Kubernetes maintainers, device vendors, and, to a lesser extent, also end-users involved. The working group provides that place, with regular meetings online (one slot for Americas/EMEA, one for EMEA/Asia) and at KubeCon.
-->
**PO：** 正如 Kevin 所说，工作组是围绕开发 DRA 的现有工作而成立的。最初的工作只有少数几个人积极参与，
也许也只有在这样的小团队中才能成功完成。但由于它涉及 Kubernetes 的许多不同领域，我们也需要一个地方来讨论这些问题，
并让更广泛的 Kubernetes 维护者、设备供应商以及（在较小程度上）终端用户参与进来。
工作组提供了这样一个场所，通过定期的线上会议（一个面向美洲/欧洲、中东及非洲时段，
一个面向欧洲、中东及非洲/亚洲时段）和 KubeCon 现场会议来进行。

<!--
**JB:** DRA is the first problem the WG has addressed. It is focused on selection, allocation, and configuration of the devices. We broke the problem down into four parts: how does the vendor model the device and advertise capacity, how does the user request it, how do we schedule that request on top of the advertised capacity, and how do we actuate that result (that is, how do we make the device ready and available to the Pod).
-->
**JB：** DRA 是工作组解决的第一个问题。它专注于设备的选择、分配和配置。我们将问题分解为四个部分：
供应商如何对设备进行建模并发布容量，用户如何请求设备，我们如何在该已发布容量之上调度该请求，
以及我们如何驱动该结果（即如何使设备准备就绪并可供 Pod 使用）。

<!--
One thing that is fundamental to the approach we took is an awareness of the incredible diversity of hardware and the rapid rate of change in the hardware industry. We knew that we couldn't keep up with the change if the Kubernetes APIs had to change for every type of hardware. Instead, we created a general approach where we address the hardware aspects that are important to Kubernetes. What we have done so far is focus on the scheduling and configuration aspects of devices. We build a device modeling API (the ResourceSlice API) that vendors use to model the scheduling characteristics of their devices, and allow users to pass through arbitrary configurations to those devices. By doing this, Kubernetes can be "programmed" to understand these aspects of the devices, without needing to be modified.
-->
我们采用的方法的一个根本出发点，是对硬件难以置信的多样性以及硬件行业快速变化的认识。我们深知，如果
Kubernetes API 必须为每种硬件类型而变更，我们将无法跟上变化的步伐。相反，我们创建了一种通用方法，
来处理对 Kubernetes 而言重要的硬件方面。我们目前所做的工作集中在设备的调度和配置方面。
我们构建了一个设备建模 API（ResourceSlice API），供应商用它来建模其设备的调度特性，
并允许用户将任意配置传递给这些设备。通过这种方式，Kubernetes 可以被"编程"来理解设备的这些方面，而无需修改自身。

<!--
But DRA, as it stands right now, is very focused on scheduling. There are other aspects of Device Management that are in scope for the WG. In particular, we are looking into device failure detection and mitigation, and whether there is some better support we can build into Kubernetes to help.
-->
但就目前而言，DRA 非常专注于调度。设备管理的其他方面也在工作组的工作范围内。
特别是，我们正在研究设备故障检测和缓解，以及我们是否可以在 Kubernetes 中构建更好的支持来提供帮助。

<!--
Also, as Kevin alluded to, devices are often allocated and used in groups, rather than individually. Choosing the right devices to work together in a group depends on how they are interconnected; for example, NVIDIA GPUs may be in an any-to-any fabric arrangement in an NVLINK domain, whereas TPUs may have a 3D torus interconnect. This affects the "selection, allocation and configuration" of devices, and we have a lot more work to do to address these use cases.
-->
此外，正如 Kevin 所提到的，设备通常以组为单位进行分配和使用，而不是单独使用。
选择合适的设备在组中协同工作取决于它们的互连方式；例如，NVIDIA GPU 可能在 NVLINK 域内采用全互联架构，
而 TPU 可能采用 3D 环面互连。这影响了设备的"选择、分配和配置"，我们在解决这些用例方面还有大量工作要做。

<!--
## A cross-SIG effort
-->
## 跨 SIG 协作 {#a-cross-sig-effort}

<!--
Because device management touches scheduling, node operations, autoscaling, networking, and API design, the work naturally spans multiple SIGs across the Kubernetes project.
-->
由于设备管理涉及调度、节点运维、自动扩缩容、网络和 API 设计，这项工作自然跨越了 Kubernetes 项目中的多个 SIG。

<!--
**NF: How does collaboration across these SIGs work in practice, and why is it necessary?**
-->
**NF：这些 SIG 之间的协作在实践中是如何运作的，为什么有必要这样做？**

<!--
**KK:** Device management touches nearly every layer of the Kubernetes stack, which is why the working group was chartered as a cross-SIG effort from the start. We have five stakeholder SIGs: sig-node, sig-scheduling, sig-autoscaling, sig-network, and sig-architecture.
-->
**KK：** 设备管理几乎涉及 Kubernetes 技术栈的每一层，这就是为什么工作组从一开始就被确立为跨 SIG 的协作。
我们有五个利益相关方 SIG：sig-node、sig-scheduling、sig-autoscaling、sig-network 和 sig-architecture。

<!--
In practice, the working group serves as a coordination layer. We don't own code directly; instead, our deliverables take the form of KEPs and implementations that live in the respective SIGs. What we provide is a unified forum where the people building the scheduler, the kubelet, the autoscaler, and the network plane can design together rather than in isolation.
-->
在实践中，工作组充当协调层。我们不直接拥有代码；相反，我们的交付成果以 KEP 和实现的形式存在于各个 SIG 中。
我们提供的是一个统一的论坛，让构建调度器、kubelet、自动扩缩器和网络层的开发者可以在一起设计，而不是各自为战。

<!--
Why is this necessary? Consider a simple example: a user requests a set of GPUs that need to communicate via NVLink. That requirement involves the scheduler (place the pods on the right nodes), the kubelet (configure the devices and expose them to the container), and potentially autoscaling (provision the right node type if none exists).
-->
为什么有必要这样做？考虑一个简单的例子：用户请求一组需要通过 NVLink 通信的 GPU。
这个需求涉及调度器（将 Pod 放置在正确的节点上）、kubelet（配置设备并将其暴露给容器），
以及可能的自动扩缩容（如果不存在合适的节点，则配置正确的节点类型）。

<!--
If those three groups design independently, you end up with inconsistent abstractions, duplicated logic, and integration bugs that only surface in production. The working group ensures that a single coherent API and data model flows through all of these components.
-->
如果这三个团队独立设计，最终会得到不一致的抽象、重复的逻辑，以及只有在生产环境中才会暴露的集成缺陷。
工作组确保一个连贯的 API 和数据模型贯穿所有这些组件。

<!--
The cross-SIG model also means that design decisions are reviewed from multiple angles. Someone from sig-scheduling will catch scheduler complexity that a sig-node contributor might overlook, and vice versa. It slows down individual decisions slightly, but produces much more robust outcomes.
-->
跨 SIG 模式还意味着设计决策会从多个角度进行审查。来自 sig-scheduling 的人会发现 sig-node
贡献者可能忽略的调度器复杂性，反之亦然。这会稍微减缓单个决策的速度，但会产生更加稳健的结果。

<!--
## Current focus areas
-->
## 当前重点领域 {#current-focus-areas}

<!--
With DRA now generally available, the working group's focus has expanded to enable more advanced scheduling models, shared semantics, operational visibility, and support for increasingly complex hardware topologies.
-->
随着 DRA 现已正式发布，工作组的关注点已扩展到支持更高级的调度模型、共享语义、运维可见性，以及对日益复杂的硬件拓扑的支持。

<!--
**NF: What are some of the key initiatives or deliverables the working group is currently focused on?**
-->
**NF：工作组目前重点关注的关键举措或交付成果有哪些？**

<!--
**KK:** We maintain a project board at [Kubernetes Project Board](https://github.com/orgs/kubernetes/projects/95) with real-time tracking of our initiatives and their progress.
-->
**KK：** 我们在 [Kubernetes 项目看板](https://github.com/orgs/kubernetes/projects/95)上维护着一个项目看板，
实时跟踪我们的各项举措及其进展。

<!--
**PO:** The scope and feature set of core DRA were intentionally limited to enable graduation to GA within a reasonable time. Additional KEPs add more features, on their own schedule. Those fall roughly into three categories:

1. Extend the expressiveness of DRA to support more complex devices and scheduling scenarios.  
2. Support _day two_ operations like health monitoring.
3. Improve multi-node support, primarily by integrating with workload-aware scheduling.
-->
**PO：** 核心 DRA 的范围和功能集被有意限制，以便在合理的时间内毕业至 GA。额外的 KEP 按各自的进度添加更多功能。它们大致分为三类：

1. 扩展 DRA 的表达能力，以支持更复杂的设备和调度场景。
2. 支持运维阶段（**day two**）操作，如健康监控。
3. 改进多节点支持，主要通过与工作负载感知调度集成来实现。

<!--
In addition to the project board, we also maintain a table which summarizes all the [KEPs](https://www.kubernetes.dev/resources/keps/) which are currently in flight. This is the status for 1.36; more are likely to be added for 1.37:
-->
除了项目看板之外，我们还维护着一个表格，汇总了所有正在推进中的
[KEP](https://www.kubernetes.dev/resources/keps/)。以下是 1.36 版本的状态；1.37 版本可能会添加更多：

<!--
| KEP | Description | Release |  |  |  |  |
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
-->
| KEP | 描述 | 发布版本 |  |  |  |  |
| :---: | :---- | :---: | :---: | :---: | :---: | :---: |
|  |  | **1.32** | **1.33** | **1.34** | **1.35** | **1.36** |
| [4381](https://www.kubernetes.dev/resources/keps/4381) | DRA：结构化参数 | Beta | Beta | Stable |  |  |
| [5004](https://www.kubernetes.dev/resources/keps/5004) | DRA：通过 DRA 扩展资源请求 |  |  | Alpha | Alpha | Beta |
| [4817](https://www.kubernetes.dev/resources/keps/4817) | DRA：资源声明状态 | Alpha | Beta | Beta | Beta | Beta |
| [5018](https://www.kubernetes.dev/resources/keps/5018) | DRA：命名空间管控的管理员访问 |  | Alpha | Beta | Beta | Stable |
| [5055](https://www.kubernetes.dev/resources/keps/5055) | DRA：设备污点与容忍度 |  | Alpha | Alpha | Alpha | Beta |
| [4816](https://www.kubernetes.dev/resources/keps/4816) | DRA：设备请求中的优先级备选项 |  | Alpha | Beta | Beta | Stable |
| [5075](https://www.kubernetes.dev/resources/keps/5075) | DRA：可消耗容量 |  |  | Alpha | Alpha | Beta |
| [4815](https://www.kubernetes.dev/resources/keps/4815) | DRA：可分区设备 |  | Alpha | Alpha | Alpha | Beta |
| [5304](https://www.kubernetes.dev/resources/keps/5304) | DRA：属性 Downward API |  |  |  |  | Alpha |
| [5729](https://www.kubernetes.dev/resources/keps/5729) | DRA：工作负载的 ResourceClaim 支持 |  |  |  |  | Alpha |
| [4680](https://www.kubernetes.dev/resources/keps/4680) | Pod 状态中的资源健康状态 | Alpha | Alpha | Alpha | Alpha | Beta |
| [5517](https://www.kubernetes.dev/resources/keps/5517) | DRA：原生资源请求 |  |  |  |  | Alpha |
| [5677](https://www.kubernetes.dev/resources/keps/5677) | DRA：资源可用性可见性 |  |  |  |  | Alpha |
| [5007](https://www.kubernetes.dev/resources/keps/5007) | DRA：设备绑定条件 |  |  | Alpha | Alpha | Beta |
| [5491](https://www.kubernetes.dev/resources/keps/5491) | DRA：属性的列表类型 |  |  |  |  | Alpha |

<!--
**NF: One of the core challenges is efficient device utilization and sharing. What progress is being made in this area?**
-->
**NF：其中一个核心挑战是高效的设备利用和共享。这方面取得了哪些进展？**

<!--
**JB:** Good question. One way to think about it is what we are doing in the two primary APIs: ResourceClaim and ResourceSlice.
-->
**JB：** 好问题。可以从我们在两个主要 API（ResourceClaim 和 ResourceSlice）中所做的工作来理解。

<!--
The ResourceClaim API is how the user asks for devices. We have built some features that allow the user to be more flexible in their requests. For example, instead of asking for a specific model of GPU, they can ask for a GPU with at least a certain amount of memory. Or they can ask for a list of alternatives: "I'd like one A100 (80GB) GPU, but if you don't have it, I'll take 2 A100 (40 GB) GPUs." This gives the scheduler some options to satisfy the request, which can lead to better obtainability and utilization of hardware that otherwise would not be selected.
-->
ResourceClaim API 是用户请求设备的方式。我们构建了一些功能，让用户在请求时更加灵活。例如，用户可以不指定
GPU 的具体型号，而是请求一个至少具有特定内存容量的 GPU。或者用户可以提供一组备选方案：
"我想要一个 A100（80GB）GPU，但如果没有的话，我可以接受 2 个 A100（40GB）GPU。"
这给调度器提供了一些满足请求的选项，从而可以提高硬件的可获得性和利用率，否则这些硬件可能不会被选中。

<!--
The ResourceClaim API allows users to explicitly share devices. You can point multiple containers (in the same or different Pods) at a ResourceClaim; this allows the devices allocated by that claim to be used in all of those containers, *if the device supports it*. 
-->
ResourceClaim API 允许用户显式地共享设备。你可以将多个容器（在相同或不同的 Pod 中）指向同一个
ResourceClaim；这使得该声明分配的设备可以在所有这些容器中使用，**前提是设备支持**。

<!--
The ResourceSlice API is how vendors model and advertise their devices. This is where we implement support for other sharing models. For example, we have a way to represent "overlapping partitions", enabling the scheduler to dynamically select a MIG partition, and make any overlapping MIG partitions unavailable automatically. This works well in combination with a request like "give me any GPU with 20GB or more of memory" \- the scheduler can satisfy that with a MIG or a real GPU.
-->
ResourceSlice API 是供应商建模和发布其设备的方式。我们在这里实现了对其他共享模型的支持。例如，
我们有一种表示"重叠分区"的方法，使调度器能够动态选择一个 MIG 分区，并自动使任何重叠的 MIG 分区不可用。
这与"给我任何内存 20GB 或以上的 GPU" 这样的请求配合得很好 —— 调度器可以用 MIG 或真实 GPU 来满足该请求。

<!--
Some features require changes in both. We have another sharing method we call "consumable capacity". In the explicit sharing case described above, a user needs to point containers at the same ResourceClaim; there is one ResourceClaim shared amongst several containers and Pods. With consumable capacity, the device sharing works more like how Pods share a Node. The user creates a ResourceClaim that asks for a certain amount of resources, for example, "I need a NIC with 2Gbps of bandwidth". The scheduler knows that there is a NIC with 40Gbps of bandwidth available, and so it allocates 2Gbps out of that 40Gbps and gives it to that ResourceClaim. In this case, each Pod has its own ResourceClaim, but the underlying device is shared between those claims. It's up to the on-node DRA driver to properly set up the device for this sort of sharing (in the NIC case, likely by creating a subinterface). We call this "platform-mediated sharing" to differentiate it from the explicit "user-mediated sharing".
-->
有些功能需要同时修改两者。我们还有另一种共享方法，称为"可消耗容量"。在上述显式共享的场景中，
用户需要将容器指向同一个 ResourceClaim；一个 ResourceClaim 被多个容器和 Pod 共享。
而使用可消耗容量时，设备共享的工作方式更像是 Pod 共享 Node。用户创建一个请求特定数量资源的 ResourceClaim，
例如"我需要一个带宽为 2Gbps 的 NIC"。调度器知道有一个带宽为 40Gbps 的可用 NIC，于是它从这 40Gbps
中分配 2Gbps 给该 ResourceClaim。在这种情况下，每个 Pod 有自己的 ResourceClaim，
但底层设备在这些声明之间共享。由节点上的 DRA 驱动程序来正确设置设备以实现此类共享
（在 NIC 的情况下，可能是通过创建子接口）。我们将此称为"平台中介共享"，以区别于显式的"用户中介共享"。

<!--
## Real-world impact
-->
## 实际影响 {#real-world-impact}

<!--
While much of the work is deeply technical, the underlying goal is practical: enabling Kubernetes to better support real-world AI/ML and hardware-intensive workloads at scale.
-->
虽然大部分工作都非常技术化，但底层目标是实用的：使 Kubernetes 能够更好地大规模支持现实中的 AI/ML 和硬件密集型工作负载。

<!--
**NF: What are the biggest challenges users face today when running hardware-intensive workloads (like AI/ML) on Kubernetes?**
-->
**NF：如今用户在 Kubernetes 上运行硬件密集型工作负载（如 AI/ML）时面临的最大挑战是什么？**

<!--
**PO:** Such workloads depart from traditional container workloads in several ways: they may consist of multiple communicating pods which all need to run at the same time ("gang scheduling"). They are often long-running and expensive to initialize, and their performance is sensitive to where they run (topology within a node and interconnects between nodes for multiple pods). The Kubernetes scheduler traditionally has not supported either of this well because it schedules one pod at a time and is unaware of the topology within a node. Several external schedulers try to fill this gap, which often isn't ideal, in particular when the Kubernetes scheduler schedules other pods to the same cluster.
-->
**PO：** 这类工作负载在多个方面不同于传统的容器工作负载：它们可能由多个需要同时运行的通信 Pod 组成（"成组调度"）。
它们通常是长期运行的，初始化成本高昂，并且其性能对运行位置（节点内的拓扑和多个 Pod 之间节点的互连）很敏感。
Kubernetes 调度器传统上对这两方面支持不佳，因为它一次只调度一个 Pod，且不了解节点内的拓扑。
一些外部调度器试图填补这一空白，但这通常并不理想，特别是当 Kubernetes 调度器将其他 Pod 调度到同一集群时。

<!--
**NF: How should platform engineers think about device management when designing their Kubernetes platforms?**
-->
**NF：平台工程师在设计 Kubernetes 平台时应该如何考虑设备管理？**

<!--
**JB:** We're still learning here, but one idea of DRA is to enable a shift to more "requirements driven" specifications. This can allow less coupling between end users that write the workload specification and the cluster administrators that set up the clusters. Instead of agreeing on labeling conventions and requiring users to understand the cluster topology, the users can specify what their workload needs, and the scheduler can figure out how to satisfy it. If we can make this work, it can make even complex workloads more portable across clusters.
-->
**JB：** 我们仍在学习中，但 DRA 的一个理念是实现向更多"需求驱动"规格的转变。
这可以减少编写工作负载规格的终端用户与设置集群的集群管理员之间的耦合。
用户无需就标签约定达成一致并被要求了解集群拓扑，而是可以指定其工作负载的需求，由调度器来确定如何满足。
如果我们能做到这一点，即使是复杂的工作负载也能在不同集群之间更具可移植性。

<!--
## Challenges and trade-offs
-->
## 挑战与权衡 {#challenges-and-trade-offs}

<!--
As with many areas of Kubernetes, increasing flexibility and expressiveness also introduces new layers of complexity, particularly around scheduling and optimization.
-->
与 Kubernetes 的许多领域一样，增加灵活性和表达能力也会引入新的复杂性层次，特别是在调度和优化方面。

<!--
**NF: What are some of the hardest technical challenges the working group is tackling today?**
-->
**NF：工作组目前面临的一些最难的技术挑战是什么？**

<!--
**PO:** There's an inherent conflict between flexibility and scheduling complexity. The current implementation is focused on finding some solution that satisfies the requested resources, but it's not necessarily the best one, whatever "best" means, which is also not always clear. The other big challenge is exposing node-allocatable resources (RAM, CPU) as devices with additional metadata; this is necessary to fine-tune scheduling of workloads which need perfect alignment on a node for optimal performance.
-->
**PO：** 灵活性和调度复杂性之间存在固有的冲突。当前的实现专注于找到满足所请求资源的某种解决方案，
但不一定是最优的——无论"最优"意味着什么，而这本身也并不总是明确的。
另一个重大挑战是将节点可分配资源（RAM、CPU）作为带有附加元数据的设备暴露出来；
这对于微调需要在节点上完美对齐以获得最佳性能的工作负载的调度是必要的。

<!--
**JB:** Patrick's list is good. Complex device modeling is hard, and making sure that we build the right semantics such that they apply to lots of different hardware is always tricky.
-->
**JB：** Patrick 列出的很好。复杂的设备建模很困难，确保我们构建正确的语义使其适用于许多不同的硬件也总是很棘手。

<!--
On top of that, scheduling in general is very complex and is an NP-hard problem. All the metadata and flexibility DRA adds gives the scheduler more options, which has pros and cons. More options are helpful if you are constrained in your choices, as it means you can schedule something that you otherwise could not. But it also means it is even harder to find an optimal solution when there are many possibilities in a given cluster. DRA works well in our common use cases so far, but we have a lot of work to do to improve the optimality of the chosen scheduling solution and ensure the performance of making that choice.
-->
除此之外，调度本身非常复杂，是一个 NP 困难问题。DRA 添加的所有元数据和灵活性给调度器提供了更多选项，这有利有弊。
如果你在选择上受到限制，更多选项是有帮助的，因为这意味着你可以调度原本无法调度的内容。但这也意味着，
当给定集群中存在许多可能性时，找到最优解变得更加困难。DRA 在我们目前的常见用例中表现良好，
但我们还有大量工作要做，以提高所选调度方案的最优性，并确保做出该选择的性能。

<!--
## Looking ahead
-->
## 展望未来 {#looking-ahead}

<!--
Despite the challenges, contributors across the working group remain excited about the pace of innovation and the growing community forming around device management in Kubernetes.
-->
尽管面临挑战，工作组的贡献者们依然对创新的步伐以及围绕 Kubernetes 设备管理而不断壮大的社区感到兴奋。

<!--
**NF: Looking ahead, what are you most excited about in the future of device management in Kubernetes?**
-->
**NF：展望未来，你对 Kubernetes 设备管理的未来最感到兴奋的是什么？**

<!--
**KK:** NVIDIA recently donated its DRA driver for GPUs to the Kubernetes project. I'm personally excited for more community members to start contributing to the project and defining its future direction.
-->
**KK：** NVIDIA 最近将其 GPU 的 DRA 驱动程序捐赠给了 Kubernetes 项目。
我个人非常期待更多社区成员开始为该项目做贡献，并定义其未来方向。

<!--
**PO:** For me, it's primarily the number of new contributors and people stepping up to help out. This poses new challenges around reviewing proposals and helping developers get those implemented and merged. It's nice and rewarding to see others succeed, and it bodes well for the future because more people are familiar with the topic.
-->
**PO：** 对我来说，主要是新贡献者和主动提供帮助的人数。这给提案审查以及帮助开发者实现和合并代码带来了新的挑战。
看到他人取得成功令人欣慰且富有成就感，这对未来是个好兆头，因为有更多人熟悉这个领域。

<!--
**JB:** I am excited about a lot of things. The community really has grown and has so many interesting features in the works to enable modeling of more complex devices, and to better model multi-node devices.
-->
**JB：** 我对很多事情都感到兴奋。社区确实壮大了，并且有许多有趣的功能正在开发中，以支持更复杂设备的建模，以及更好地建模多节点设备。

<!--
I am really excited to see the creative ways people will use these APIs. They were primarily designed to address "devices", but just like how "everything is a file" in Unix/Linux, the APIs themselves are quite flexible as to what they model. They really build out a more programmable scheduler, which can have interesting applications. For example, I recently prototyped using DRA to schedule pods to nodes where a large AI model is already locally cached. It's really quite flexible, and I have great confidence in the creativity of our community, so I think we'll see some unexpected solutions in the ecosystem.
-->
我非常期待看到人们创造性地使用这些 API 的方式。它们主要是为解决"设备"问题而设计的，但就像
Unix/Linux 中"一切皆文件"一样，这些 API 本身对它们所建模的内容非常灵活。
它们真正构建了一个更具可编程性的调度器，可以产生有趣的应用。例如，我最近做了一个原型，
使用 DRA 将 Pod 调度到已经本地缓存了大型 AI 模型的节点上。它确实非常灵活，
我对我们社区的创造力充满信心，所以我认为我们会在生态系统中看到一些出人意料的解决方案。

<!--
## Getting involved
-->
## 参与其中 {#getting-involved}

<!--
**NF: How can contributors get involved with the Device Management Working Group?**
-->
**NF：贡献者如何参与设备管理工作组？**

<!--
**KK:** The easiest first step is to join our mailing list at [wg-device-management@kubernetes.io](mailto:wg-device-management@kubernetes.io). Subscribing will automatically add calendar invites for our biweekly meetings to your calendar.
-->
**KK：** 最简单的第一步是加入我们的邮件列表
[wg-device-management@kubernetes.io](mailto:wg-device-management@kubernetes.io)。
订阅后会自动将我们双周会议的日历邀请添加到你的日历中。

<!--
  We have two meeting slots to accommodate different time zones:

- Europe/Americas: Tuesdays at 8:30 AM PT (biweekly)  
- Asia/Europe: Wednesdays at 9:00 AM CET (biweekly)
-->
我们有两个会议时段以适应不同的时区：

- 欧洲/美洲：每周二上午 8:30 PT（双周一次）
- 亚洲/欧洲：每周三上午 9:00 CET（双周一次）

<!--
Meeting notes, agendas, and recordings are all publicly accessible (links available from [Device Management page](https://www.kubernetes.dev/community/community-groups/wg/device-management/#meetings)). You can get a feel for the work in progress before attending your first meeting.
-->
会议记录、议程和录像均公开可访问
（链接可从[设备管理页面](https://www.kubernetes.dev/community/community-groups/wg/device-management/#meetings)获取）。
你可以在参加第一次会议之前了解正在进行的工作。

<!--
On Slack, find us in `#wg-device-management` on the Kubernetes Slack workspace. That's the best place for quick questions or to introduce yourself.
-->
在 Slack 上，你可以在 Kubernetes Slack 工作空间的 `#wg-device-management` 频道找到我们。这是快速提问或自我介绍的最佳场所。

<!--
For more hands-on contributions, the DRA Driver for NVIDIA GPUs is now a community project and a great place to start. It's a real-world, production-grade implementation that the broader community is now shaping together.
-->
对于更多实践性的贡献，NVIDIA GPU 的 DRA 驱动程序现在是一个社区项目，是一个很好的起点。
它是一个真实的、生产级的实现，更广泛的社区正在共同塑造它。

<!--
We welcome contributors at all levels – whether you're interested in the API design, the scheduler internals, driver development, or documentation. Come say hello.
-->
我们欢迎各个层次的贡献者——无论你是对 API 设计、调度器内部机制、驱动程序开发还是文档感兴趣。欢迎来打个招呼。

<!--
## Summary
-->
## 总结 {#summary}

<!--
As Kubernetes evolves to support the AI/ML revolution and high-performance computing, the work happening within WG Device Management is becoming the foundation for how modern workloads are scheduled and operated at scale.
-->
随着 Kubernetes 不断发展以支持 AI/ML 革命和高性能计算，设备管理工作组内的工作正成为大规模调度和运维现代工作负载的基础。

<!--
From the graduation of Dynamic Resource Allocation (DRA) to the next frontiers of health monitoring and topology-aware scheduling, this group is effectively rewriting the "handshake" between software and hardware.
-->
从动态资源分配（DRA）的正式发布，到健康监控和拓扑感知调度的下一个前沿，这个工作组正在有效地改写软件与硬件之间的"握手"。

<!--
If you're interested in shaping the future of hardware-aware orchestration, now is the perfect time to get involved. Whether you want to help refine the API, build out drivers, or improve documentation, the working group welcomes all levels of experience and perspectives from across the community.
-->
如果你有兴趣塑造硬件感知编排的未来，现在是参与的绝佳时机。无论你是想帮助完善 API、
构建驱动程序，还是改进文档，工作组都欢迎来自社区各个层次的经验和视角。
