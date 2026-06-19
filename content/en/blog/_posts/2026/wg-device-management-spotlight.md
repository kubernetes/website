---
layout: blog
title: "Spotlight on WG Device Management"
slug: wg-device-management-spotlight-2026
date: 2026-06-17
canonical_url: https://www.kubernetes.dev/blog/2026/06/17/wg-device-management-spotlight-2026
draft: true
author: "Natalie Fisher"
---


The rising popularity of AI, Edge, and Telecommunications workloads on Kubernetes has led to new requirements for hardware management. We now need hardware specification beyond CPU time and memory allocations.  This includes allocating GPUs, TPUs, network interfaces, and other hardware, sometimes after pod start and occasionally through time-sharing. 

Efficiently managing this specialized hardware is the mission of the **[Device Management Working Group](https://www.kubernetes.dev/community/community-groups/wg/device-management/)**. Their cornerstone project, **[Dynamic Resource Allocation (DRA)](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)**, recently graduated to GA, marking a fundamental shift in how the project handles hardware-intensive workloads at scale.

In this spotlight, we sit down with working group chairs **[Kevin Klues](https://github.com/klueska)**, **[Patrick Ohly](https://github.com/pohly)**, and
**[John Belamaric](https://github.com/johnbelamaric)** to discuss the limitations of the legacy device model,
the _NP-hard_ challenges of scheduling, and how they’re building a more programmable, hardware-aware future for Kubernetes.

## Introducing Device Management

**Natalie Fisher: Can you introduce yourself, your role, and how you got involved in the Device Management Working Group?**

**Kevin Klues:** My name is Kevin Klues. I am a Distinguished Engineer at NVIDIA. I have been a co-chair of the device management working group since its inception at Kubecon EU 2024. I have also been involved with DRA (the working group's primary deliverable) since its inception in 2019 / 2020.
I have also been a kubelet maintainer since 2019, with a focus on its device manager, CPU manager, and topology manager subcomponents. The challenges we saw with using these components for workloads that relied on external accelerators (e.g., GPUs) are what triggered us to start working on DRA in the first place.

**Patrick Ohly:** I am a Principal Engineer at Intel. In Kubernetes, I am a Tech Lead for [SIG Testing](https://www.kubernetes.dev/community/community-groups/sigs/testing/) and [SIG Instrumentation](https://www.kubernetes.dev/community/community-groups/sigs/instrumentation/) and co-chair of the Device Management WG. I was co-chair of the WG Structured Logging and a member of the Steering Committee. Some of my early contributions to Kubernetes include [ephemeral CSI volumes](https://kubernetes.io/docs/concepts/storage/ephemeral-volumes/) and storage capacity tracking, so I had some experience with API design, implementation, and scheduling. We knew that introducing a major new API for accelerators would be hard. Somewhat foolishly, I accepted that challenge in 2020, wrote the initial DRA KEP (now known as “classic DRA”) and implemented most of it, then started over with a second KEP for today’s "structured parameters DRA". Initially, it was an uphill battle to convince maintainers that this work was necessary. It was only around 2023 that interest in DRA picked up, leading to the formation of the working group.

**John Belamaric:** I am a Senior Staff SWE at Google, and the third co-chair of WG Device Management, also since its inception. I am also a co-chair of [SIG Architecture](https://www.kubernetes.dev/community/community-groups/sigs/architecture/) since 2019. As Patrick mentioned, in late 2023, interest in DRA really picked up. The initial implementation, made autoscaling very challenging, and so there was some concern in the community about advancing it to beta. I got involved to try to help address some of those concerns, and the three of us, along with Tim Hockin, worked hard over the next few months to build a consensus around a new design. To facilitate this collaboration, we formed the working group after discussion at KubeCon in Paris in 2024. 

## The problem and the solution

The working group emerged from a fundamental rethink of how Kubernetes interacts with specialized hardware. At the heart of this evolution is **Dynamic Resource Allocation (DRA)**. Rather than treating devices as simple integers, DRA provides a structured framework that breaks device management into four distinct stages:

* **Modeling:** Vendors use the **ResourceSlice API** to advertise the granular capabilities and capacity of their hardware.  
* **Requesting:** Users define their specific hardware needs—such as GPU memory or interconnect requirements—through the **`ResourceClaim` API**.  
* **Scheduling:** The Kubernetes scheduler uses these APIs to match workload requirements against available hardware intelligently.  
* **Actuation:** Once a match is made, the system handles the "handshake" that prepares and secures the device for the Pod's use.

**NF: For readers who may not be familiar, what is the Device Management Working Group, and what problems is it trying to solve?**

**KK:** The Device Management Working Group was chartered to enable simple and efficient configuration, sharing, and allocation of accelerators and other specialized hardware across Kubernetes workloads. Think GPUs, TPUs, FPGAs, and similar devices that don't fit neatly into Kubernetes' traditional resource model. 

The problem we set out to solve is that the legacy Device Plugin API  (which has been the primary mechanism for exposing hardware accelerators in Kubernetes) is fundamentally limited. It treats devices as opaque integers: you can request "2 GPUs," but you can't say anything meaningful about which GPUs you need, how they should be connected to each other, whether they can be shared, or how they should be partitioned. That was fine for simple cases, but modern AI/ML workloads are anything but simple. They span multiple nodes, require specific interconnect topologies, and increasingly need to share or partition hardware dynamically.

The working group's primary deliverable is Dynamic Resource Allocation (DRA), a new framework that replaces the rigid device plugin model with a flexible, declarative API.
With DRA, workloads can describe their hardware requirements (e.g., GPU type, memory capacity, interconnect topology, desired partitioning) and drivers can publish fine-grained device attributes that the scheduler can act on.
DRA [graduated](https://kubernetes.io/blog/2025/09/01/kubernetes-v1-34-dra-updates/) to GA in Kubernetes 1.34, and the ecosystem around it (e.g., drivers, tooling, and new API extensions) is growing rapidly.

**PO:** As Kevin said, the working group was formed around the existing effort to develop DRA. The initial work was done with only a handful of people actively involved, and perhaps also could only be done successfully in such a setup. But because it touches on so many different areas of Kubernetes, we also needed a place to discuss that and get the broader community of Kubernetes maintainers, device vendors, and, to a lesser extent, also end-users involved. The working group provides that place, with regular meetings online (one slot for Americas/EMEA, one for EMEA/Asia) and at KubeCon.

**JB:** DRA is the first problem the WG has addressed. It is focused on selection, allocation, and configuration of the devices. We broke the problem down into four parts: how does the vendor model the device and advertise capacity, how does the user request it, how do we schedule that request on top of the advertised capacity, and how do we actuate that result (that is, how do we make the device ready and available to the Pod).

One thing that is fundamental to the approach we took is an awareness of the incredible diversity of hardware and the rapid rate of change in the hardware industry. We knew that we couldn’t keep up with the change if the Kubernetes APIs had to change for every type of hardware. Instead, we created a general approach where we address the hardware aspects that are important to Kubernetes. What we have done so far is focus on the scheduling and configuration aspects of devices. We build a device modeling API (the ResourceSlice API) that vendors use to model the scheduling characteristics of their devices, and allow users to pass through arbitrary configurations to those devices. By doing this, Kubernetes can be “programmed” to understand these aspects of the devices, without needing to be modified.

But DRA, as it stands right now, is very focused on scheduling. There are other aspects of Device Management that are in scope for the WG. In particular, we are looking into device failure detection and mitigation, and whether there is some better support we can build into Kubernetes to help.

Also, as Kevin alluded to, devices are often allocated and used in groups, rather than individually. Choosing the right devices to work together in a group depends on how they are interconnected; for example, NVIDIA GPUs may be in an any-to-any fabric arrangement in an NVLINK domain, whereas TPUs may have a 3D torus interconnect. This affects the “selection, allocation and configuration” of devices, and we have a lot more work to do to address these use cases.

## A cross-SIG effort

Because device management touches scheduling, node operations, autoscaling, networking, and API design, the work naturally spans multiple SIGs across the Kubernetes project.

**NF: How does collaboration across these SIGs work in practice, and why is it necessary?**

**KK:** Device management touches nearly every layer of the Kubernetes stack, which is why the working group was chartered as a cross-SIG effort from the start. We have five stakeholder SIGs: sig-node, sig-scheduling, sig-autoscaling, sig-network, and sig-architecture.

In practice, the working group serves as a coordination layer. We don't own code directly; instead, our deliverables take the form of KEPs and implementations that live in the respective SIGs. What we provide is a unified forum where the people building the scheduler, the kubelet, the autoscaler, and the network plane can design together rather than in isolation.

Why is this necessary? Consider a simple example: a user requests a set of GPUs that need to communicate via NVLink. That requirement involves the scheduler (place the pods on the right nodes), the kubelet (configure the devices and expose them to the container), and potentially autoscaling (provision the right node type if none exists).

If those three groups design independently, you end up with inconsistent abstractions, duplicated logic, and integration bugs that only surface in production. The working group ensures that a single coherent API and data model flows through all of these components.

The cross-SIG model also means that design decisions are reviewed from multiple angles. Someone from sig-scheduling will catch scheduler complexity that a sig-node contributor might overlook, and vice versa. It slows down individual decisions slightly, but produces much more robust outcomes.

## Current focus areas

With DRA now generally available, the working group’s focus has expanded to enable more advanced scheduling models, shared semantics, operational visibility, and support for increasingly complex hardware topologies.

**NF: What are some of the key initiatives or deliverables the working group is currently focused on?**

**KK:** We maintain a project board at [Kubernetes Project Board](https://github.com/orgs/kubernetes/projects/95) with real-time tracking of our initiatives and their progress.

**PO:** The scope and feature set of core DRA were intentionally limited to enable graduation to GA within a reasonable time. Additional KEPs add more features, on their own schedule. Those fall roughly into three categories:

1. Extend the expressiveness of DRA to support more complex devices and scheduling scenarios.  
2. Support _day two_ operations like health monitoring.
3. Improve multi-node support, primarily by integrating with workload-aware scheduling.

In addition to the project board, we also maintain a table which summarizes all the [KEPs](https://www.kubernetes.dev/resources/keps/) which are currently in flight. This is the status for 1.36; more are likely to be added for 1.37:

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

**NF: One of the core challenges is efficient device utilization and sharing. What progress is being made in this area?**

**JB:** Good question. One way to think about it is what we are doing in the two primary APIs: ResourceClaim and ResourceSlice.

The ResourceClaim API is how the user asks for devices. We have built some features that allow the user to be more flexible in their requests. For example, instead of asking for a specific model of GPU, they can ask for a GPU with at least a certain amount of memory. Or they can ask for a list of alternatives: "I’d like one A100 (80GB) GPU, but if you don’t have it, I’ll take 2 A100 (40 GB) GPUs." This gives the scheduler some options to satisfy the request, which can lead to better obtainability and utilization of hardware that otherwise would not be selected.

The ResourceClaim API allows users to explicitly share devices. You can point multiple containers (in the same or different Pods) at a ResourceClaim; this allows the devices allocated by that claim to be used in all of those containers, *if the device supports it*. 

The ResourceSlice API is how vendors model and advertise their devices. This is where we implement support for other sharing models. For example, we have a way to represent "overlapping partitions", enabling the scheduler to dynamically select a MIG partition, and make any overlapping MIG partitions unavailable automatically. This works well in combination with a request like “give me any GPU with 20GB or more of memory” \- the scheduler can satisfy that with a MIG or a real GPU.

Some features require changes in both. We have another sharing method we call “consumable capacity”. In the explicit sharing case described above, a user needs to point containers at the same ResourceClaim; there is one ResourceClaim shared amongst several containers and Pods. With consumable capacity, the device sharing works more like how Pods share a Node. The user creates a ResourceClaim that asks for a certain amount of resources, for example, “I need a NIC with 2Gbps of bandwidth”. The scheduler knows that there is a NIC with 40Gbps of bandwidth available, and so it allocates 2Gbps out of that 40Gbps and gives it to that ResourceClaim. In this case, each Pod has its own ResourceClaim, but the underlying device is shared between those claims. It’s up to the on-node DRA driver to properly set up the device for this sort of sharing (in the NIC case, likely by creating a subinterface). We call this “platform-mediated sharing” to differentiate it from the explicit "user-mediated sharing".

## Real-world impact

While much of the work is deeply technical, the underlying goal is practical: enabling Kubernetes to better support real-world AI/ML and hardware-intensive workloads at scale.

**NF: What are the biggest challenges users face today when running hardware-intensive workloads (like AI/ML) on Kubernetes?**

**PO:** Such workloads depart from traditional container workloads in several ways: they may consist of multiple communicating pods which all need to run at the same time (“gang scheduling”). They are often long-running and expensive to initialize, and their performance is sensitive to where they run (topology within a node and interconnects between nodes for multiple pods). The Kubernetes scheduler traditionally has not supported either of this well because it schedules one pod at a time and is unaware of the topology within a node. Several external schedulers try to fill this gap, which often isn’t ideal, in particular when the Kubernetes scheduler schedules other pods to the same cluster.

**NF: How should platform engineers think about device management when designing their Kubernetes platforms?**

**JB:** We’re still learning here, but one idea of DRA is to enable a shift to more "requirements driven" specifications. This can allow less coupling between end users that write the workload specification and the cluster administrators that set up the clusters. Instead of agreeing on labeling conventions and requiring users to understand the cluster topology, the users can specify what their workload needs, and the scheduler can figure out how to satisfy it. If we can make this work, it can make even complex workloads more portable across clusters.

## Challenges and trade-offs

As with many areas of Kubernetes, increasing flexibility and expressiveness also introduces new layers of complexity, particularly around scheduling and optimization.

**NF: What are some of the hardest technical challenges the working group is tackling today?**

**PO:** There’s an inherent conflict between flexibility and scheduling complexity. The current implementation is focused on finding some solution that satisfies the requested resources, but it’s not necessarily the best one, whatever “best” means, which is also not always clear. The other big challenge is exposing node-allocatable resources (RAM, CPU) as devices with additional metadata; this is necessary to fine-tune scheduling of workloads which need perfect alignment on a node for optimal performance.

**JB:** Patrick’s list is good. Complex device modeling is hard, and making sure that we build the right semantics such that they apply to lots of different hardware is always tricky.

On top of that, scheduling in general is very complex and is an NP-hard problem. All the metadata and flexibility DRA adds gives the scheduler more options, which has pros and cons. More options are helpful if you are constrained in your choices, as it means you can schedule something that you otherwise could not. But it also means it is even harder to find an optimal solution when there are many possibilities in a given cluster. DRA works well in our common use cases so far, but we have a lot of work to do to improve the optimality of the chosen scheduling solution and ensure the performance of making that choice.

## Looking ahead

Despite the challenges, contributors across the working group remain excited about the pace of innovation and the growing community forming around device management in Kubernetes.

**NF: Looking ahead, what are you most excited about in the future of device management in Kubernetes?**

**KK:** NVIDIA recently donated its DRA driver for GPUs to the Kubernetes project. I’m personally excited for more community members to start contributing to the project and defining its future direction.

**PO:** For me, it’s primarily the number of new contributors and people stepping up to help out. This poses new challenges around reviewing proposals and helping developers get those implemented and merged. It’s nice and rewarding to see others succeed, and it bodes well for the future because more people are familiar with the topic.

**JB:** I am excited about a lot of things. The community really has grown and has so many interesting features in the works to enable modeling of more complex devices, and to better model multi-node devices.

I am really excited to see the creative ways people will use these APIs. They were primarily designed to address "devices", but just like how "everything is a file" in Unix/Linux, the APIs themselves are quite flexible as to what they model. They really build out a more programmable scheduler, which can have interesting applications. For example, I recently prototyped using DRA to schedule pods to nodes where a large AI model is already locally cached. It’s really quite flexible, and I have great confidence in the creativity of our community, so I think we’ll see some unexpected solutions in the ecosystem.

# Getting involved

**NF: How can contributors get involved with the Device Management Working Group?**

**KK:** The easiest first step is to join our mailing list at [wg-device-management@kubernetes.io](mailto:wg-device-management@kubernetes.io). Subscribing will automatically add calendar invites for our biweekly meetings to your calendar.

  We have two meeting slots to accommodate different time zones:

- Europe/Americas: Tuesdays at 8:30 AM PT (biweekly)  
- Asia/Europe: Wednesdays at 9:00 AM CET (biweekly)

Meeting notes, agendas, and recordings are all publicly accessible (links available from [Device Management page](https://www.kubernetes.dev/community/community-groups/wg/device-management/#meetings)). You can get a feel for the work in progress before attending your first meeting.

On Slack, find us in `#wg-device-management` on the Kubernetes Slack workspace. That's the best place for quick questions or to introduce yourself.

For more hands-on contributions, the DRA Driver for NVIDIA GPUs is now a community project and a great place to start. It's a real-world, production-grade implementation that the broader community is now shaping together.

We welcome contributors at all levels – whether you're interested in the API design, the scheduler internals, driver development, or documentation. Come say hello.

## Summary

As Kubernetes evolves to support the AI/ML revolution and high-performance computing, the work happening within WG Device Management is becoming the foundation for how modern workloads are scheduled and operated at scale.

From the graduation of Dynamic Resource Allocation (DRA) to the next frontiers of health monitoring and topology-aware scheduling, this group is effectively rewriting the "handshake" between software and hardware.

If you’re interested in shaping the future of hardware-aware orchestration, now is the perfect time to get involved. Whether you want to help refine the API, build out drivers, or improve documentation, the working group welcomes all levels of experience and perspectives from across the community.
