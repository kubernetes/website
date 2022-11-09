---
layout: blog
title: "聚焦 SIG Storage"
slug: sig-storage-spotlight
date: 2022-08-22
---
<!--
layout: blog
title: "Spotlight on SIG Storage"
slug: sig-storage-spotlight
date: 2022-08-22
canonicalUrl: https://www.kubernetes.dev/blog/2022/08/22/sig-storage-spotlight-2022/
-->

<!--
**Author**: Frederico Muñoz (SAS)
-->
**作者**：Frederico Muñoz (SAS)

<!--
Since the very beginning of Kubernetes, the topic of persistent data and how to address the requirement of stateful applications has been an important topic. Support for stateless deployments was natural, present from the start, and garnered attention, becoming very well-known. Work on better support for stateful applications was also present from early on, with each release increasing the scope of what could be run on Kubernetes.
-->
自 Kubernetes 诞生之初，持久数据以及如何解决有状态应用程序的需求一直是一个重要的话题。
对无状态部署的支持是很自然的、从一开始就存在的，并引起了人们的关注，变得众所周知。
从早期开始，我们也致力于更好地支持有状态应用程序，每个版本都增加了可以在 Kubernetes 上运行的范围。

<!--
Message queues, databases, clustered filesystems: these are some examples of the solutions that have different storage requirements and that are, today, increasingly deployed in Kubernetes. Dealing with ephemeral and persistent storage, local or remote, file or block, from many different vendors, while considering how to provide the needed resiliency and data consistency that users expect, all of this is under SIG Storage's umbrella.
-->
消息队列、数据库、集群文件系统：这些是具有不同存储要求的解决方案的一些示例，
如今这些解决方案越来越多地部署在 Kubernetes 中。
处理来自许多不同供应商的临时和持久存储（本地或远程、文件或块），同时考虑如何提供用户期望的所需弹性和数据一致性，
所有这些都在 SIG Storage 的整体负责范围之内。

<!--
In this SIG Storage spotlight, [Frederico Muñoz](https://twitter.com/fredericomunoz) (Cloud & Architecture Lead at SAS) talked with [Xing Yang](https://twitter.com/2000xyang), Tech Lead at VMware and co-chair of SIG Storage, on how the SIG is organized, what are the current challenges and how anyone can get involved and contribute.
-->
在这次 SIG Storage 采访报道中，[Frederico Muñoz](https://twitter.com/fredericomunoz)
（SAS 的云和架构负责人）与 VMware 技术负责人兼 SIG Storage 联合主席
[Xing Yang](https://twitter.com/2000xyang)，讨论了 SIG 的组织方式、当前的挑战是什么以及如何进行参与和贡献。

<!--
## About SIG Storage

**Frederico (FSM)**: Hello, thank you for the opportunity of learning more about SIG Storage. Could you tell us a bit about yourself, your role, and how you got involved in SIG Storage.
-->
## 关于 SIG Storage

**Frederico (FSM)**：你好，感谢你给我这个机会了解更多关于 SIG Storage 的情况。
你能否介绍一下你自己、你的角色以及你是如何参与 SIG Storage 的。

<!--
**Xing Yang (XY)**: I am a Tech Lead at VMware, working on Cloud Native Storage. I am also a Co-Chair of SIG Storage. I started to get involved in K8s SIG Storage at the end of 2017, starting with contributing to the [VolumeSnapshot](https://kubernetes.io/docs/concepts/storage/volume-snapshots/) project. At that time, the VolumeSnapshot project was still in an experimental, pre-alpha stage. It needed contributors. So I volunteered to help. Then I worked with other community members to bring VolumeSnapshot to Alpha in K8s 1.12 release in 2018, Beta in K8s 1.17 in 2019, and eventually GA in 1.20 in 2020.
-->
**Xing Yang (XY)**：我是 VMware 的技术主管，从事云原生存储方面的工作。我也是 SIG Storage 的联合主席。
我从 2017 年底开始参与 K8s SIG Storage，开始为
[VolumeSnapshot](https://kubernetes.io/zh-cn/docs/concepts/storage/volume-snapshots/) 项目做贡献。
那时，VolumeSnapshot 项目仍处于实验性的 pre-alpha 阶段。它需要贡献者。所以我自愿提供帮助。
然后我与其他社区成员合作，在 2018 年的 K8s 1.12 版本中将 VolumeSnapshot 带入 Alpha，
2019 年在 K8s 1.17 版本中带入 Beta，并最终在 2020 年在 1.20 版本中带入 GA。

<!--
**FSM**: Reading the [SIG Storage charter](https://github.com/kubernetes/community/blob/master/sig-storage/charter.md) alone it’s clear that SIG Storage covers a lot of ground, could you describe how the SIG is organised?
-->
**FSM**：仅仅阅读 [SIG Storage 章程](https://github.com/kubernetes/community/blob/master/sig-storage/charter.md)
就可以看出，SIG Storage 涵盖了很多领域，你能描述一下 SIG 的组织方式吗？

<!--
**XY**: In SIG Storage, there are two Co-Chairs and two Tech Leads. Saad Ali from Google and myself are Co-Chairs. Michelle Au from Google and Jan Šafránek from Red Hat are Tech Leads.
-->
**XY**：在 SIG Storage 中，有两位联合主席和两位技术主管。来自 Google 的 Saad Ali 和我是联合主席。
来自 Google 的 Michelle Au 和来自 Red Hat 的 Jan Šafránek 是技术主管。

<!--
We have bi-weekly meetings where we go through features we are working on for each particular release, getting the statuses, making sure each feature has dev owners and reviewers working on it, and reminding people about the release deadlines, etc. More information on the SIG is on the [community page](https://github.com/kubernetes/community/tree/master/sig-storage). People can also add PRs that need attention, design proposals that need discussion, and other topics to the meeting agenda doc. We will go over them after project tracking is done.
-->
我们每两周召开一次会议，讨论我们正在为每个特定版本开发的功能，获取状态，确保每个功能都有开发人员和审阅人员在处理它，
并提醒人们发布截止日期等。有关 SIG 的更多信息，请查阅[社区页面](https://github.com/kubernetes/community/tree/master/sig-storage)。
人们还可以将需要关注的 PR、需要讨论的设计提案和其他议题添加到会议议程文档中。
我们将在项目跟踪完成后对其进行审查。

<!--
We also have other regular meetings, i.e., CSI Implementation meeting, Object Bucket API design meeting, and one-off meetings for specific topics if needed. There is also a [K8s Data Protection Workgroup](https://github.com/kubernetes/community/blob/master/wg-data-protection/README.md) that is sponsored by SIG Storage and SIG Apps. SIG Storage owns or co-owns features that are being discussed at the Data Protection WG.
-->
我们还举行其他的定期会议，如 CSI 实施会议，Object Bucket API 设计会议，以及在需要时针对特定议题的一次性会议。
还有一个由 SIG Storage 和 SIG Apps 赞助的
[K8s 数据保护工作组](https://github.com/kubernetes/community/blob/master/wg-data-protection/README.md)。
SIG Storage 拥有或共同拥有数据保护工作组正在讨论的功能特性。

<!--
## Storage and Kubernetes

**FSM**: Storage is such a foundational component in so many things, not least in Kubernetes: what do you think are the Kubernetes-specific challenges in terms of storage management?
-->
## 存储和 Kubernetes

**FSM**：存储是很多模块的基础组件，尤其是 Kubernetes：你认为 Kubernetes 在存储管理方面的具体挑战是什么?

<!--
**XY**: In Kubernetes, there are multiple components involved for a volume operation. For example, creating a Pod to use a PVC has multiple components involved. There are the Attach Detach Controller and the external-attacher working on attaching the PVC to the pod. There’s the Kubelet that works on mounting the PVC to the pod. Of course the CSI driver is involved as well. There could be race conditions sometimes when coordinating between multiple components.
-->
**XY**：在 Kubernetes 中，卷操作涉及多个组件。例如，创建一个使用 PVC 的 Pod 涉及多个组件。
有 Attach Detach Controller 和 external-attacher 负责将 PVC 连接到 Pod。
还有 Kubelet 可以将 PVC 挂载到 Pod 上。当然，CSI 驱动程序也参与其中。
在多个组件之间进行协调时，有时可能会出现竞争状况。

<!--
Another challenge is regarding core vs [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) (CRD), not really storage specific. CRD is a great way to extend Kubernetes capabilities while not adding too much code to the Kubernetes core itself. However, this also means there are many external components that are needed when running a Kubernetes cluster.
-->
另一个挑战是关于核心与 [Custom Resource Definitions](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)（CRD），
这并不是特定于存储的。CRD 是一种扩展 Kubernetes 功能的好方法，同时又不会向 Kubernetes 核心本身添加太多代码。
然而，这也意味着运行 Kubernetes 集群时需要许多外部组件。

<!--
From the SIG Storage side, one most notable example is Volume Snapshot. Volume Snapshot APIs are defined as CRDs. API definitions and controllers are out-of-tree. There is a common snapshot controller and a snapshot validation webhook that should be deployed on the control plane, similar to how kube-controller-manager is deployed. Although Volume Snapshot is a CRD, it is a core feature of SIG Storage.  It is recommended for the K8s cluster distros to deploy Volume Snapshot CRDs, the snapshot controller, and the snapshot validation webhook, however, most of the time we don’t see distros deploy them. So this becomes a problem for the storage vendors: now it becomes their responsibility to deploy these non-driver specific common components. This could cause conflicts if a customer wants to use more than one storage system and deploy more than one CSI driver.
-->
在 SIG Storage 方面，一个最好的例子是卷快照。卷快照 API 被定义为 CRD。
API 定义和控制器是 out-of-tree。有一个通用的快照控制器和一个快照验证 Webhook
应该部署在控制平面上，类似于 kube-controller-manager 的部署方式。
虽然 Volume Snapshot 是一个 CRD，但它是 SIG Storage 的核心特性。
建议 K8s 集群发行版部署卷快照 CRD、快照控制器和快照验证 Webhook，然而，大多数时候我们没有看到发行版部署它们。
因此，这对存储供应商来说就成了一个问题：现在部署这些非驱动程序特定的通用组件成为他们的责任。
如果客户需要使用多个存储系统，且部署多个 CSI 驱动，可能会导致冲突。

<!--
**FSM**: Not only the complexity of a single storage system, you have to consider how they will be used together in Kubernetes?
-->
**FSM**：不仅要考虑单个存储系统的复杂性，还要考虑它们在 Kubernetes 中如何一起使用？

<!--
**XY**: Yes, there are many different storage systems that can provide storage to containers in Kubernetes. They don’t work the same way. It is challenging to find a solution that works for everyone.
-->
**XY**：是的，有许多不同的存储系统可以为 Kubernetes 中的容器提供存储。它们的工作方式不同。找到适合所有人的解决方案是具有挑战性的。

<!--
**FSM**: Storage in Kubernetes also involves interacting with external solutions, perhaps more so than other parts of Kubernetes. Is this interaction with vendors and external providers challenging? Has it evolved with time in any way?
-->
**FSM**：Kubernetes 中的存储还涉及与外部解决方案的交互，可能比 Kubernetes 的其他部分更多。
这种与供应商和外部供应商的互动是否具有挑战性？它是否以任何方式随着时间而演变？

<!--
**XY**: Yes, it is definitely challenging. Initially Kubernetes storage had in-tree volume plugin interfaces. Multiple storage vendors implemented in-tree interfaces and have volume plugins in the Kubernetes core code base.  This caused lots of problems.  If there is a bug in a volume plugin, it affects the entire Kubernetes code base.  All volume plugins must be released together with Kubernetes. There was no flexibility if storage vendors need to fix a bug in their plugin or want to align with their own product release.
-->
**XY**：是的，这绝对是具有挑战性的。最初 Kubernetes 存储具有 in-tree 卷插件接口。
多家存储供应商实现了 in-tree 接口，并在 Kubernetes 核心代码库中拥有卷插件。这引起了很多问题。
如果卷插件中存在错误，它会影响整个 Kubernetes 代码库。所有卷插件必须与 Kubernetes 一起发布。
如果存储供应商需要修复其插件中的错误或希望与他们自己的产品版本保持一致，这是不灵活的。

<!--
**FSM**: That’s where CSI enters the game?
-->
**FSM**：这就是 CSI 加入的原因？

<!--
**XY**: Exactly, then there comes [Container Storage Interface](https://kubernetes-csi.github.io/docs/) (CSI). This is an industry standard trying to design common storage interfaces so that a storage vendor can write one plugin and have it work across a range of container orchestration systems (CO). Now Kubernetes is the main CO, but back when CSI just started, there were Docker, Mesos, Cloud Foundry, in addition to Kubernetes. CSI drivers are out-of-tree so bug fixes and releases can happen at their own pace.
-->
**XY**：没错，接下来就是[容器存储接口](https://kubernetes-csi.github.io/docs/)（CSI）。
这是一个试图设计通用存储接口的行业标准，以便存储供应商可以编写一个插件并让它在一系列容器编排系统（CO）中工作。
现在 Kubernetes 是主要的 CO，但是在 CSI 刚开始的时候，除了 Kubernetes 之外，还有 Docker、Mesos、Cloud Foundry。
CSI 驱动程序是 out-of-tree 的，因此可以按照自己的节奏进行错误修复和发布。

<!--
CSI is definitely a big improvement compared to in-tree volume plugins. Kubernetes implementation of CSI has been GA [since the 1.13 release](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/).  It has come a long way.  SIG Storage has been working on moving in-tree volume plugins to out-of-tree CSI drivers for several releases now.
-->
与 in-tree 卷插件相比，CSI 绝对是一个很大的改进。CSI 的 Kubernetes
实现[自 1.13 版本以来](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/)就达到 GA。
它已经发展了很长时间。SIG Storage 一直致力于将 in-tree 卷插件迁移到 out-of-tree 的 CSI 驱动，已经有几个版本了。

<!--
**FSM**: Moving drivers away from the Kubernetes main tree and into CSI was an important improvement.
-->
**FSM**：将驱动程序从 Kubernetes 主仓移到 CSI 中是一项重要的改进。

<!--
**XY**: CSI interface is an improvement over the in-tree volume plugin interface, however, there are still challenges. There are lots of storage systems. Currently [there are more than 100 CSI drivers listed in CSI driver docs](https://kubernetes-csi.github.io/docs/drivers.html). These storage systems are also very diverse.  So it is difficult to design a common API that works for all.  We introduced capabilities at CSI driver level, but we also have challenges when volumes provisioned by the same driver have different behaviors.  The other day we just had a meeting discussing Per Volume CSI Driver Capabilities. We have a problem differentiating some CSI driver capabilities when the same driver supports both block and file volumes.  We are going to have follow up meetings to discuss this problem.
-->
**XY**： CSI 接口是对 in-tree 卷插件接口的改进，但是仍然存在挑战。有很多存储系统。
目前在 [CSI 驱动程序文档中列出了 100 多个 CSI 驱动程序](https://kubernetes-csi.github.io/docs/drivers.html)。
这些存储系统也非常多样化。因此，很难设计一个适用于所有人的通用 API。
我们在 CSI 驱动层面引入了功能，但当同一驱动配置的卷具有不同的行为时，我们也会面临挑战。
前几天我们刚刚开会讨论每种卷 CSI 驱动程序功能。
当同一个驱动程序同时支持块卷和文件卷时，我们在区分某些 CSI 驱动程序功能时遇到了问题。
我们将召开后续会议来讨论这个问题。

<!--
## Ongoing challenges

**FSM**: Specifically for the [1.25 release](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.25) we can see that there are a relevant number of storage-related [KEPs](https://bit.ly/k8s125-enhancements) in the pipeline, would you say that this release is particularly important for the SIG?
-->
## 持续的挑战

**FSM**：具体来说，对于 [1.25 版本](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.25)
们可以看到管道中有一些与存储相关的 [KEPs](https://bit.ly/k8s125-enhancements)。
你是否认为这个版本对 SIG 特别重要？

<!--
**XY**: I wouldn’t say one release is more important than other releases. In any given release, we are working on a few very important things.
-->
**XY**：我不会说一个版本比其他版本更重要。在任何给定的版本中，我们都在做一些非常重要的事情。

<!--
**FSM**: Indeed, but are there any 1.25 specific specificities and highlights you would like to point out though?
-->
**FSM**：确实如此，但你是否想指出 1.25 版本的特定特性和亮点呢？

<!--
**XY**: Yes. For the 1.25 release, I want to highlight the following:
-->
**XY**：好的。对于 1.25 版本，我想强调以下几点：

<!--
* [CSI Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration) is an on-going effort that SIG Storage has been working on for a few releases now. The goal is to move in-tree volume plugins to out-of-tree CSI drivers and eventually remove the in-tree volume plugins.  There are 7 KEPs that we are targeting in 1.25 are related to CSI migration. There is one core KEP for the general CSI Migration feature. That is targeting GA in 1.25. CSI Migration for GCE PD and AWS EBS are targeting GA. CSI Migration for vSphere is targeting to have the feature gate on by default while staying in 1.25 that are in Beta. Ceph RBD and PortWorx are targeting Beta, with feature gate off by default. Ceph FS is targeting Alpha.
-->
* [CSI 迁移](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration)
  是一项持续的工作，SIG Storage 已经工作了几个版本了。目标是将 in-tree 卷插件移动到 out-of-tree 的
  CSI 驱动程序，并最终删除 in-tree 卷插件。在 1.25 版本中，有 7 个 KEP 与 CSI 迁移有关。
  有一个核心 KEP 用于通用的 CSI 迁移功能。它的目标是在 1.25 版本中达到 GA。
  GCE PD 和 AWS EBS 的 CSI 迁移以 GA 为目标。vSphere 的 CSI 迁移的目标是在默认情况下启用特性门控，
  在 1.25 版本中达到 Beta。Ceph RBD 和 PortWorx 的目标是达到 Beta，默认关闭特性门控。
  Ceph FS 的目标是达到 Alpha。

<!--
* The second one I want to highlight is [COSI, the Container Object Storage Interface](https://github.com/kubernetes-sigs/container-object-storage-interface-spec). This is a sub-project under SIG Storage. COSI proposes object storage Kubernetes APIs to support orchestration of object store operations for Kubernetes workloads. It also introduces gRPC interfaces for object storage providers to write drivers to provision buckets. The COSI team has been working on this project for more than two years now. The COSI feature is targeting Alpha in 1.25. The KEP just got merged. The COSI team is working on updating the implementation based on the updated KEP.
-->
* 我要强调的第二个是 [COSI，容器对象存储接口](https://github.com/kubernetes-sigs/container-object-storage-interface-spec)。
  这是 SIG Storage 下的一个子项目。COSI 提出对象存储 Kubernetes API 来支持 Kubernetes 工作负载的对象存储操作的编排。
  它还为对象存储提供商引入了 gRPC 接口，以编写驱动程序来配置存储桶。COSI 团队已经在这个项目上工作两年多了。
  COSI 功能的目标是 1.25 版本中达到 Alpha。KEP 刚刚合入。COSI 团队正在根据更新后的 KEP 更新实现。

<!--
* Another feature I want to mention is [CSI Ephemeral Volume](https://github.com/kubernetes/enhancements/issues/596) support. This feature allows CSI volumes to be specified directly in the pod specification for ephemeral use cases. They can be used to inject arbitrary states, such as configuration, secrets, identity, variables or similar information, directly inside pods using a mounted volume.  This was initially introduced in 1.15 as an alpha feature, and it is now targeting GA in 1.25.
-->
* 我要提到的另一个功能是 [CSI 临时卷](https://github.com/kubernetes/enhancements/issues/596)支持。
  此功能允许在临时用例的 Pod 规约中直接指定 CSI 卷。它们可用于使用已安装的卷直接在 Pod 内注入任意状态，
  例如配置、Secrets、身份、变量或类似信息。这最初是在 1.15 版本中作为一个 Alpha 功能引入的，现在它的目标是在 1.25 版本中达到 GA。

<!--
**FSM**: If you had to single something out, what would be the most pressing areas the SIG is working on?
-->
**FSM**：如果你必须单独列出一些内容，那么 SIG 正在研究的最紧迫的领域是什么?

<!--
**XY**: CSI migration is definitely one area that the SIG has put in lots of effort and it has been on-going for multiple releases now. It involves work from multiple cloud providers and storage vendors as well.
-->
**XY**：CSI 迁移绝对是 SIG 投入大量精力的领域之一，并且现在已经进行了多个版本。它还涉及来自多个云提供商和存储供应商的工作。

<!--
## Community involvement

**FSM**: Kubernetes is a community-driven project. Any recommendation for anyone looking into getting involved in SIG Storage work? Where should they start?
-->
## 社区参与

**FSM**：Kubernetes 是一个社区驱动的项目。对任何希望参与 SIG Storage 工作的人有什么建议吗？他们应该从哪里开始？

<!--
**XY**: Take a look at the [SIG Storage community page](https://github.com/kubernetes/community/tree/master/sig-storage), it has lots of information on how to get started. There are [SIG annual reports](https://github.com/kubernetes/community/blob/master/sig-storage/annual-report-2021.md) that tell you what we did each year. Take a look at the Contributing guide. It has links to presentations that can help you get familiar with Kubernetes storage concepts.
-->
**XY**：查看 [SIG Storage 社区页面](https://github.com/kubernetes/community/tree/master/sig-storage)，
它有很多关于如何开始的信息。[SIG 年度报告](https://github.com/kubernetes/community/blob/master/sig-storage/annual-report-2021.md)告诉你我们每年做了什么。
查看贡献指南。它有一些演示的链接，可以帮助你熟悉 Kubernetes 存储概念。

<!--
Join our [bi-weekly meetings on Thursdays](https://github.com/kubernetes/community/tree/master/sig-storage#meetings). Learn how the SIG operates and what we are working on for each release. Find a project that you are interested in and help out. As I mentioned earlier, I got started in SIG Storage by contributing to the Volume Snapshot project.
-->
参加我们[在星期四举行的双周会议](https://github.com/kubernetes/community/tree/master/sig-storage#meetings)。
了解 SIG 的运作方式以及我们为每个版本所做的工作。找到你感兴趣的项目并提供贡献。
正如我之前提到的，我通过参与 Volume Snapshot 项目开始了 SIG Storage。

<!--
**FSM**: Any closing thoughts you would like to add?
-->
**FSM**：你有什么要补充的结束语吗？

<!--
**XY**: SIG Storage always welcomes new contributors. We need contributors to help with building new features, fixing bugs, doing code reviews, writing tests, monitoring test grid health, and improving documentation, etc.
-->
**XY**：SIG Storage 总是欢迎新的贡献者。
我们需要贡献者来帮助构建新功能、修复错误、进行代码审查、编写测试、监控测试网格的健康状况以及改进文档等。

<!--
**FSM**: Thank you so much for your time and insights into the workings of SIG Storage!
-->
**FSM**：非常感谢你抽出宝贵时间让我们深入了解 SIG Storage！