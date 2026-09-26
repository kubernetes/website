---
layout: blog
title: "聚焦 SIG Storage"
date: 2026-06-15
slug: sig-storage-spotlight-2026
author: "Darshan Murthy (Apple)"
translator: >
  [Fan Baofa](https://github.com/carlory) (DaoCloud)
---

<!--
layout: blog
title: "Spotlight on SIG Storage"
date: 2026-06-15
canonical_url: https://www.kubernetes.dev/blog/2026/06/15/sig-storage-spotlight-2026
slug: sig-storage-spotlight-2026
author: "Darshan Murthy (Apple)"
-->

<!--
In our ongoing SIG Spotlight series, we shine a light on the groups that keep the Kubernetes project
moving forward. This time, we catch up with **[SIG
Storage](https://github.com/kubernetes/community/tree/master/sig-storage)**, the group responsible
for persistent data, volume management, and the interfaces that connect Kubernetes workloads to the
storage systems beneath them.
-->
在持续推出的 SIG 聚焦系列中，我们会介绍推动 Kubernetes 项目不断向前发展的各个团队。
这一次，我们采访了
**[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)**，
该团队负责持久化数据、卷管理，
以及将 Kubernetes 工作负载与其底层存储系统连接起来的接口。

<!--
We spoke with [Xing Yang](https://github.com/xing-yang), Co-Chair of SIG Storage and Software
Engineer at VMware by Broadcom, about the SIG's history, the features shipping in recent Kubernetes
releases, and where storage in Kubernetes is headed as AI workloads become the norm.
-->
我们采访了 SIG Storage 联合主席、VMware by Broadcom 软件工程师
[Xing Yang](https://github.com/xing-yang)，聊了聊这个 SIG 的历史、近期 Kubernetes
版本中发布的功能，以及随着 AI 工作负载成为常态，Kubernetes 中的存储将走向何方。

<!--
## Introductions
-->
## 介绍

<!--
**Could you introduce yourself and share your role(s) within SIG Storage?**
-->
**你能介绍一下自己，并分享你在 SIG Storage 中承担的角色吗？**

<!--
My name is [Xing Yang](https://github.com/xing-yang), a software engineer at VMware by Broadcom. I'm a co-chair in SIG Storage,
alongside another co-chair [Saad Ali](https://github.com/saad-ali) from Google. There are also two Tech Leads in SIG Storage:
[Michelle Au](https://github.com/msau42) from Google and [Jan Šafránek](https://github.com/jsafrane) from Red Hat.
-->
我叫 [Xing Yang](https://github.com/xing-yang)，是 VMware by Broadcom 的软件工程师。
我是 SIG Storage 的联合主席，另一位联合主席是来自 Google 的
[Saad Ali](https://github.com/saad-ali)。SIG Storage 还有两位技术负责人：
来自 Google 的 [Michelle Au](https://github.com/msau42) 和来自 Red Hat 的
[Jan Šafránek](https://github.com/jsafrane)。

<!--
**What first drew you to storage in Kubernetes, and how did you start contributing?**
-->
**最初是什么吸引你关注 Kubernetes 中的存储？你又是如何开始贡献的？**

<!--
I have always been working in the storage domain, so SIG Storage was a natural place for me to get
started when I began to learn Kubernetes. I started attending [SIG Storage meetings](https://github.com/kubernetes/community/blob/main/sig-storage/README.md#meetings), trying to figure
out what I could do to help. This was before the first [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI) release —
lots of things were still evolving. It was a very exciting time.
-->
我一直在存储领域工作，所以当我开始学习 Kubernetes 时，SIG Storage 自然而然成了我的起点。
我开始参加 [SIG Storage 会议](https://github.com/kubernetes/community/blob/main/sig-storage/README.md#meetings)，
试着了解自己能帮上什么忙。那是在第一个
[容器存储接口](https://github.com/container-storage-interface/spec/blob/master/spec.md)（CSI）
版本发布之前，很多事情还在演进之中。那是一段非常令人兴奋的时期。

<!--
**What subprojects or areas do you actively maintain or review today?**
-->
**现在你积极维护或评审哪些子项目或领域？**

<!--
I'm a maintainer in Kubernetes CSI. There are multiple CSI sidecars — such as `csi-provisioner`,
`csi-attacher`, `csi-resizer`, and `csi-snapshotter` — that we need to release following every
Kubernetes release. I'm also a co-chair for a [Data Protection Working Group](https://github.com/kubernetes/community/blob/main/wg-data-protection/README.md) co-sponsored by SIG
Storage and [SIG Apps](https://github.com/kubernetes/community/tree/main/sig-apps). Several features have come out of that WG aimed at filling gaps in data
protection support within Kubernetes. One is [Volume Group
Snapshot](https://kubernetes.io/docs/concepts/storage/volume-group-snapshots/), which provides
crash-consistent group snapshots for multiple volumes used by an application. [Changed Block
Tracking](https://github.com/kubernetes/enhancements/issues/3314) (CBT) is another critical feature
from the DP WG designed to support efficient backups.
-->
我是 Kubernetes CSI 的维护者。我们需要在每个 Kubernetes 版本发布后发布多个 CSI
边车容器，例如 `csi-provisioner`、`csi-attacher`、`csi-resizer` 和
`csi-snapshotter`。我也是由 SIG Storage 和
[SIG Apps](https://github.com/kubernetes/community/tree/main/sig-apps)
共同发起的[数据保护工作组](https://github.com/kubernetes/community/blob/main/wg-data-protection/README.md)的联合主席。
这个工作组已经产出了若干功能，旨在填补 Kubernetes 中数据保护支持方面的空白。
其中之一是[卷组快照](/zh-cn/blog/2026/05/08/kubernetes-v1-36-volume-group-snapshot-ga/)（Volume Group Snapshot），
它为应用所使用的多个卷提供崩溃一致性的组快照。
[变更块跟踪](https://github.com/kubernetes/enhancements/issues/3314)（Changed Block Tracking，CBT）
是数据保护工作组的另一项关键功能，用于支持高效备份。

<!--
## About SIG Storage
-->
## 关于 SIG Storage

<!--
**For folks who are new: what is SIG Storage, in your own words? What problems in Kubernetes are
you trying to solve?**
-->
**对于刚接触的人来说，你会如何用自己的话描述 SIG Storage？你们试图解决 Kubernetes
中的哪些问题？**

<!--
SIG Storage is a [Special Interest Group](https://github.com/kubernetes/community/blob/main/governance.md) focused on how to provide storage to containers running in
your Kubernetes cluster. We define standard interfaces so that a storage vendor can write a driver
and have its underlying storage system consumed by containers in Kubernetes.
-->
SIG Storage 是一个[特别兴趣小组](https://github.com/kubernetes/community/blob/main/governance.md)，
专注于如何为 Kubernetes 集群中运行的容器提供存储。我们定义标准接口，使存储供应商能够编写驱动程序，
并让 Kubernetes 中的容器使用其底层存储系统。

<!--
**Why does Kubernetes need a dedicated storage SIG? What makes storage hard in a distributed
system?**
-->
**为什么 Kubernetes 需要一个专门的存储 SIG？在分布式系统中，存储为何如此困难？**

<!--
When Kubernetes was first introduced, it was meant for stateless workloads only. Container
applications were regarded as ephemeral and therefore did not need to persist data. However, that
changed drastically. Stateful workloads started running in Kubernetes, and we needed a dedicated
SIG to tackle the associated storage challenges. PersistentVolumeClaims, PersistentVolumes, and
StorageClasses were all introduced to provision data volumes for applications running in Kubernetes.
-->
Kubernetes 最初被引入时，只面向无状态工作负载。容器应用被视为临时性的，因此不需要持久化数据。
然而，这种情况发生了巨大变化。有状态工作负载开始在 Kubernetes 中运行，我们需要一个专门的 SIG
来应对相关的存储挑战。PersistentVolumeClaim、PersistentVolume 和 StorageClass
都是为了给 Kubernetes 中运行的应用制备数据卷而引入的。

<!--
**How did SIG Storage originally form, and how has its mission changed over time?**
-->
**SIG Storage 最初是如何形成的？它的使命随着时间发生了哪些变化？**

<!--
SIG Storage was formed to address the challenges of handling persistent data within Kubernetes.
Initially, PersistentVolumes were implemented as in-tree plugins, and the SIG managed those plugins
while developing core storage primitives like PersistentVolumes and PersistentVolumeClaims.
-->
SIG Storage 的成立是为了解决 Kubernetes 中处理持久化数据的挑战。最初，PersistentVolume
是以内置（in-tree）插件的形式实现的，SIG 在开发 PersistentVolume 和 PersistentVolumeClaim
等核心存储原语的同时，也负责管理这些插件。

<!--
Container Storage Interface (CSI) was introduced later and played a crucial role in simplifying
storage integration, enabling third-party storage providers to develop and maintain their own
out-of-tree plugins without modifying Kubernetes core code.
-->
容器存储接口（Container Storage Interface，CSI）后来被引入，并在简化存储集成方面发挥了关键作用，
使第三方存储提供商能够开发和维护自己的树外（out-of-tree）插件，而无需修改 Kubernetes 核心代码。

<!--
With basic integration addressed by CSI, the SIG's mission expanded to include advanced storage
features that leverage the new interface. The SIG has also expanded its scope to support object
storage through the [Container Object Storage Interface](https://github.com/kubernetes-sigs/container-object-storage-interface) (COSI).
-->
随着 CSI 解决了基础集成问题，SIG 的使命扩展到涵盖利用这一新接口的高级存储功能。
SIG 还通过[容器对象存储接口](https://github.com/kubernetes-sigs/container-object-storage-interface)
（Container Object Storage Interface，COSI）扩展了其范围，以支持对象存储。

<!--
## Current work and roadmap
-->
## 当前工作和路线图

<!--
**What are the top features SIG Storage is actively working on right now?**
-->
**SIG Storage 目前正在积极推进的最重要功能有哪些？**

<!--
The Data Protection WG has been working on a couple of exciting features:
-->
数据保护工作组一直在推进几项令人兴奋的功能：

<!--
- **VolumeGroupSnapshot** is a Kubernetes feature enabling a crash-consistent, point-in-time
  snapshot of multiple PersistentVolumes simultaneously. This ensures data integrity for
  applications — like databases — that rely on multiple volumes by capturing all volumes in the
  group atomically, at the exact same point in time. It just moved to GA in Kubernetes v1.36.
-->
- **VolumeGroupSnapshot** 是一项 Kubernetes 功能，可同时为多个 PersistentVolume 创建崩溃一致性的时间点快照。
  对于数据库这类依赖多个卷的应用，它会在完全相同的时间点原子地捕获组内所有卷，从而确保数据完整性。
  该功能刚刚在 Kubernetes v1.36 中进入正式发布（GA）阶段。

<!--
- **CSI Changed Block Tracking (CBT)** enables efficient, incremental backups. By allowing storage
  systems to report only the blocks that have changed since the last snapshot, it significantly
  reduces the amount of data that needs to be transferred. It just moved to Beta in Kubernetes v1.36.
-->
- **CSI Changed Block Tracking（CBT）** 支持高效的增量备份。它允许存储系统只报告自上次快照以来发生变化的块，
  从而显著减少需要传输的数据量。该功能刚刚在 Kubernetes v1.36 中进入 Beta 阶段。

<!--
Another feature worth highlighting is **Container Object Storage Interface (COSI)**. COSI provides
a standard interface for provisioning and consuming object storage buckets in Kubernetes —
standardizing object storage for containerized applications much like CSI did for block and file
storage. COSI is now transitioning to `v1alpha2`, with plans for promotion to Beta in a future
release.
-->
另一个值得强调的功能是 **Container Object Storage Interface（COSI）**。COSI
为在 Kubernetes 中制备和使用对象存储桶提供了标准接口，就像 CSI 为块存储和文件存储所做的那样，
为容器化应用标准化对象存储。COSI 现在正在过渡到 `v1alpha2`，并计划在未来版本中提升到 Beta。

<!--
**What recent work from SIG Storage do you consider a "win" for users?**
-->
**你认为 SIG Storage 近期哪些工作算得上用户的“胜利”？**

<!--
The graduation of [VolumeAttributesClass](https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/)
to GA in Kubernetes v1.34 is a major win for users managing stateful workloads. Previously,
changing volume attributes like IOPS or throughput required out-of-band actions or disruptive
operations. Now, users can dynamically tune storage properties such as IOPS or throughput directly
through the Kubernetes API — scaling up for peak loads or down to optimize costs — without external
processes or downtime.
-->
[VolumeAttributesClass](/zh-cn/docs/concepts/storage/volume-attributes-classes/) 在 Kubernetes
v1.34 中进入 GA，是管理有状态工作负载的用户的一项重大胜利。过去，修改 IOPS
或吞吐量等卷属性需要带外操作或破坏性操作。现在，用户可以直接通过 Kubernetes API
动态调整 IOPS 或吞吐量等存储属性，在负载高峰时向上扩展，或向下调整以优化成本，
而不需要外部流程或停机。

<!--
VolumeAttributesClass enables dynamic modification of storage characteristics without recreating
the volume. This completes the picture by allowing users to tune both capacity and other storage
properties dynamically, just as they can now tune both CPU and memory for compute.
-->
VolumeAttributesClass 支持在不重新创建卷的情况下动态修改存储特性。它补全了这幅图景：
用户既可以动态调整容量，也可以动态调整其他存储属性，就像现在可以同时调整计算资源中的 CPU 和内存一样。

<!--
**Looking ahead one or two releases, what's on the roadmap that people should watch for?**
-->
**展望接下来一两个版本，路线图上有哪些值得大家关注的内容？**

<!--
I'd like to draw attention to the [Volume Health](https://github.com/kubernetes/enhancements/issues/1432) feature. This feature is designed to offer
critical visibility into the operational status and integrity of persistent volumes. By enabling
storage drivers and the Kubernetes control plane to report issues, it allows for proactive
monitoring and identification of volume-related problems.
-->
我想请大家关注 [Volume Health](https://github.com/kubernetes/enhancements/issues/1432) 功能。
该功能旨在为持久卷的运行状态和完整性提供关键可见性。通过让存储驱动和 Kubernetes
控制平面报告问题，它可以主动监控并识别与卷相关的问题。

<!--
Currently, volume health information is reported via non-persistent events. We are actively
investigating enhancements to this feature with the goal of supporting automated remediation
capabilities in the future.
-->
目前，卷健康信息是通过非持久化事件来报告的。我们正在积极研究对此功能的增强，
目标是在未来支持自动化修复能力。

<!--
**Are there areas where you'd really like more discussion or help from the community?**
-->
**有哪些领域是你们非常希望社区进一步讨论或提供帮助的？**

<!--
We always need help from the community to fix bugs, add tests, and help with reviews.
-->
我们始终需要社区帮助修复 Bug、添加测试，并参与评审。

<!--
We'd also like to get feedback on the Alpha feature [Mutable PV
Affinity](https://github.com/kubernetes/enhancements/issues/4762), which was introduced in
Kubernetes v1.35. Use cases include migrating volumes from zonal to regional storage or migrating
from one disk type to another.
-->
我们也希望获得关于 Alpha 功能
[Mutable PV Affinity](https://github.com/kubernetes/enhancements/issues/4762) 的反馈。
该功能是在 Kubernetes v1.35 中引入的。其使用场景包括将卷从可用区级存储迁移到区域级存储，
或从一种磁盘类型迁移到另一种磁盘类型。

<!--
Another topic is **volume replication**. It was raised at [KubeCon Atlanta](https://www.cncf.io/reports/kubecon-cloudnativecon-north-america-2025/) and has been discussed
in the Data Protection WG. Community members interested in this topic are encouraged to join the DP
WG meetings.
-->
另一个主题是**卷复制**。这个主题是在
[KubeCon Atlanta](https://www.cncf.io/reports/kubecon-cloudnativecon-north-america-2025/)
上提出的，并已在数据保护工作组中讨论。鼓励对此主题感兴趣的社区成员参加数据保护工作组会议。

<!--
**What are the biggest challenges users face today when running stateful workloads on Kubernetes?**
-->
**如今用户在 Kubernetes 上运行有状态工作负载时面临的最大挑战是什么？**

<!--
While Kubernetes has moved stateful workloads — like databases and AI pipelines — into the
mainstream, managing "state" in a system designed for ephemerality remains difficult:
-->
虽然 Kubernetes 已经让数据库和 AI 流水线等有状态工作负载进入主流，
但在一个为临时性而设计的系统中管理“状态”仍然很困难：

<!--
- **Data Gravity and Storage Locality**: Pods move in seconds, but data has gravity. If a node
  fails, a pod using local storage is stuck. Operators must decide whether the failure is transient
  or permanent — a high-stakes call. This is why we are enhancing the Volume Health feature to
  provide the visibility needed to automate recovery choices.
-->
- **数据引力和存储局部性**：Pod 可以在数秒内迁移，但数据具有引力。如果某个节点发生故障，
  使用本地存储的 Pod 就会受困。操作者必须判断故障是临时性的还是永久性的，这是一个风险很高的决策。
  这就是我们增强 Volume Health 功能的原因：提供自动化恢复决策所需的可见性。

<!--
- **Day 2 Complexity**: Setting up a database is easy; maintaining its health over time is the real
  challenge. Standard Kubernetes objects like StatefulSets offer a baseline, but they lack the
  operational logic needed for tasks such as schema upgrades, engine patching, or cluster-wide
  Kubernetes upgrades.
-->
- **第 2 天复杂性**：搭建数据库很容易；随着时间推移持续维护其健康状态才是真正的挑战。
  StatefulSet 这类标准 Kubernetes 对象提供了基础能力，但缺少执行模式升级、引擎补丁更新或集群范围
  Kubernetes 升级等任务所需的运维逻辑。

<!--
- **Data Mobility**: Moving persistent data remains a significant hurdle — whether migrating between
  storage tiers, shifting workloads across availability zones, or moving to a different cluster.
  This challenge includes ongoing synchronization and replication for high availability and disaster
  recovery across a distributed system.
-->
- **数据移动性**：迁移持久化数据仍然是一大障碍，无论是在存储层级之间迁移、跨可用区迁移工作负载，
  还是迁移到另一个集群。这个挑战还包括在分布式系统中为实现高可用和灾难恢复而持续进行同步和复制。

<!--
## Storage and AI
-->
## 存储和 AI

<!--
**How do you see storage evolving in Kubernetes over the next few years, especially as AI/ML
workloads grow?**
-->
**你认为未来几年 Kubernetes 中的存储会如何演进，尤其是在 AI/ML 工作负载增长的背景下？**

<!--
I see several trends shaping storage in Kubernetes as it evolves from a container orchestrator into
the "Operating System" for AI:
-->
随着 Kubernetes 从容器编排器演进为 AI 的“操作系统”，我看到有几种趋势正在塑造
Kubernetes 中的存储：

<!--
- **More Intelligent Data Management**: We'll see a shift toward smarter CSI drivers and data
  management tools offering advanced features like automatic tiering, snapshots, migration, and
  replication — optimized specifically for high-performance AI/ML workflows and large data
  platforms.
-->
- **更智能的数据管理**：我们会看到更智能的 CSI 驱动和数据管理工具逐渐出现，
  提供自动分层、快照、迁移和复制等高级功能，并专门针对高性能 AI/ML 工作流和大型数据平台进行优化。

<!--
- **Object Storage as a First-Class Citizen**: AI datasets now frequently reach exabyte scale,
  making object storage the preferred choice for AI workloads. COSI is standardizing bucket
  management just as CSI did for disks, allowing data scientists to use a BucketClaim to
  provision S3-compatible storage natively and unifying object, file, and block storage into a
  single workflow.
-->
- **对象存储成为一等公民**：如今 AI 数据集经常达到 EB 级规模，使对象存储成为 AI 工作负载的首选。
  COSI 正在标准化存储桶管理，就像 CSI 标准化磁盘一样，让数据科学家能够使用 BucketClaim
  原生制备兼容 S3 的存储，并将对象存储、文件存储和块存储统一到一个工作流中。

<!--
- **Performance and Low Latency**: For AI/ML, storage needs to keep up with GPU processing speeds.
  This will accelerate adoption of high-performance parallel file systems and NVMe-over-Fabrics
  (NVMe-oF) technologies managed natively via Kubernetes. The line between traditional block/file
  and memory-speed storage will continue to blur.
-->
- **性能和低延迟**：对于 AI/ML 来说，存储需要跟上 GPU 的处理速度。这会加速采用高性能并行文件系统，
  以及通过 Kubernetes 原生管理的 NVMe over Fabrics（NVMe-oF）技术。传统块/文件存储与内存速度存储之间的界限将继续模糊。

<!--
- **Data-Aware Scheduling**: Instead of just considering CPU and RAM, the Kubernetes scheduler will
  increasingly prioritize placing Pods based on data locality — calculating the cost of moving data
  versus moving compute to keep massive data platforms performant.
-->
- **数据感知调度**：Kubernetes 调度器将不再只考虑 CPU 和 RAM，而是会越来越优先根据数据局部性放置 Pod，
  计算移动数据与移动计算之间的成本，以保持海量数据平台的性能。

---

<!--
SIG Storage continues to tackle some of the hardest problems in Kubernetes: keeping stateful
applications running reliably, making storage operations transparent and composable, and now
scaling up to meet the demands of AI-era workloads. Whether you're a user managing databases in
production or a developer curious about storage internals, there's a place for you in SIG Storage.
-->
SIG Storage 持续应对 Kubernetes 中一些最困难的问题：让有状态应用可靠运行，
让存储操作透明且可组合，并且如今还要扩展能力以满足 AI 时代工作负载的需求。
无论你是在生产环境中管理数据库的用户，还是对存储内部机制感兴趣的开发者，
SIG Storage 中都有适合你的位置。

<!--
If you'd like to get involved, check out the [SIG Storage community
page](https://www.kubernetes.dev/community/community-groups/sigs/storage/) and join the [bi-weekly
meetings](https://github.com/kubernetes/community/tree/master/sig-storage#meetings). You can also
find the SIG on Slack at
[#sig-storage](https://kubernetes.slack.com/messages/sig-storage).
-->
如果你想参与进来，请查看 [SIG Storage 社区页面](https://www.kubernetes.dev/community/community-groups/sigs/storage/)，
并参加[双周会议](https://github.com/kubernetes/community/tree/master/sig-storage#meetings)。
你也可以在 Slack 上的
[#sig-storage](https://kubernetes.slack.com/messages/sig-storage) 找到这个 SIG。

<!--
- [SIG Storage Mailing List](https://groups.google.com/a/kubernetes.io/g/sig-storage)
- [SIG Storage on Slack](https://kubernetes.slack.com/messages/sig-storage)
- [Data Protection WG](https://github.com/kubernetes/community/blob/master/wg-data-protection/README.md)
-->
- [SIG Storage 邮件列表](https://groups.google.com/a/kubernetes.io/g/sig-storage)
- [Slack 上的 SIG Storage](https://kubernetes.slack.com/messages/sig-storage)
- [数据保护工作组](https://github.com/kubernetes/community/blob/master/wg-data-protection/README.md)
