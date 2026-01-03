---  
layout: blog
title: "Kubernetes v1.35：Timbernetes（世界树版本）"
date: 2025-12-17T10:30:00-08:00
evergreen: true
slug: kubernetes-v1-35-release
author: >
  v1.35 发布团队(https://github.com/kubernetes/sig-release/blob/master/releases/release-1.35/release-team.md)
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
layout: blog
title: "Kubernetes v1.35: Timbernetes (The World Tree Release)"
date: 2025-12-17T10:30:00-08:00
evergreen: true
slug: kubernetes-v1-35-release
author: >
  [Kubernetes v1.35 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.35/release-team.md)
-->
<!--
**Editors**: Aakanksha Bhende, Arujjwal Negi, Chad M. Crowell, Graziano Casto, Swathi Rao
-->
**编辑**：Aakanksha Bhende、Arujjwal Negi、Chad M. Crowell、Graziano Casto、Swathi Rao

<!--
Similar to previous releases, the release of Kubernetes v1.35 introduces new stable, beta, and alpha features. The consistent delivery of high-quality releases underscores the strength of our development cycle and the vibrant support from our community.
-->
与之前版本类似，Kubernetes v1.35 的发布引入了新的稳定（GA）、Beta 和 Alpha 特性。
持续交付高质量版本，体现了我们开发周期的韧性，也离不开社区的热情支持。

<!--
This release consists of 60 enhancements, including 17 stable, 19 beta, and 22 alpha features.
-->
此版本包含 60 个增强项，其中包括 17 个稳定（GA）特性、19 个 Beta 特性和 22 个 Alpha 特性。

<!--
There are also some [deprecations and removals](#deprecations-and-removals) in this release; make sure to read about those.
-->
本次发布还包含一些[弃用与移除](#deprecations-and-removals)内容，请务必阅读相关说明。

<!--
## Release theme and logo
-->
## 发布主题与徽标   {#release-theme-and-logo}
{{< figure
  src="k8s-v1.35.png"
  alt="Kubernetes v1.35 Timbernetes 徽标：世界树与三只松鼠。"
  class="release-logo"
>}}

<!--
2025 began in the shimmer of Octarine: The Color of Magic (v1.33) and rode the gusts Of Wind & Will (v1.34). We close the year with our hands on the World Tree, inspired by Yggdrasil, the tree of life that binds many realms. Like any great tree, Kubernetes grows ring by ring and release by release, shaped by the care of a global community.
-->
2025 年在 Octarine：The Color of Magic（v1.33）的微光中启程，
又乘着 Of Wind & Will（v1.34）的疾风前行。
我们在年末将双手搭在世界树上，灵感来自 Yggdrasil——那棵连接诸多世界的生命之树。
如同所有伟大的树木，Kubernetes 也在全球社区的悉心呵护下，
以年轮为记、以版本为序，不断成长。

<!--
At its center sits the Kubernetes wheel wrapped around the Earth, grounded by the resilient maintainers, contributors and users who keep showing up. Between day jobs, life changes, and steady open-source stewardship, they prune old APIs, graft new features and keep one of the world’s largest open source projects healthy.
-->
在这棵树的中心，是环抱地球的 Kubernetes 方向盘标。
它之所以稳固，源于那些始终如一的维护者、贡献者与用户。
在本职工作与生活变迁之间，在持续的开源维护之中，
他们修剪旧 API、嫁接新特性，让这个全球最大开源项目之一保持健康。

<!--
Three squirrels guard the tree: a wizard holding the LGTM scroll for reviewers, a warrior with an axe and Kubernetes shield for the release crews who cut new branches, and a rogue with a lantern for the triagers who bring light to dark issue queues.
-->
三只松鼠守护着这棵树：
为评阅者举起 LGTM 卷轴的法师；
为发布团队挥斧开枝、并举起 Kubernetes 盾牌的战士；
以及为分诊者照亮幽深 Issue 队列的提灯游侠。

<!--
Together, they stand in for a much larger adventuring party. Kubernetes v1.35 adds another growth ring to the World Tree, a fresh cut shaped by many hands, many paths and a community whose branches reach higher as its roots grow deeper.
-->
它们共同象征着一支规模更大的冒险队伍。
Kubernetes v1.35 为世界树再添一圈年轮——这一道新切面由无数双手、
无数条路径与一个根系更深、枝叶更高的社区共同塑造。

<!--
## Spotlight on key updates
-->
## 重点更新速览   {#spotlight-on-key-updates}
<!--
Kubernetes v1.35 is packed with new features and improvements. Here are a few select updates the Release Team would like to highlight!
-->
Kubernetes v1.35 带来了大量新特性与改进。下面是发布团队希望重点介绍的几个更新！

<!--
### Stable: In-place update of Pod resources
-->
### 稳定（GA）阶段：Pod 资源原地更新   {#stable-in-place-update-of-pod-resources}

<!--
Kubernetes has graduated in-place updates for Pod resources to General Availability (GA).
-->
Kubernetes 已将 Pod 资源的原地更新特性升级为正式发布（GA）。
<!--
This feature allows users to adjust CPU and memory resources without restarting Pods or Containers. Previously, such modifications required recreating Pods, which could disrupt workloads, particularly for stateful or batch applications. Earlier Kubernetes releases allowed you to change only infrastructure resource settings (requests and limits) for existing Pods. The new in-place functionality allows for smoother, nondisruptive vertical scaling, improves efficiency, and can also simplify development.
-->
该特性允许用户在不重启 Pod 或容器的情况下，调整 CPU 与内存资源。
此前，这类修改需要重建 Pod，可能会干扰工作负载，尤其是有状态或批处理应用。
更早的 Kubernetes 版本仅允许你为现有 Pod 修改基础设施资源设置（requests 与 limits）。
新的原地更新能力支持更平滑、不中断的纵向扩缩容，提高效率，也能简化开发流程。

<!--
This work was done as part of [KEP #1287](https://kep.k8s.io/1287) led by SIG Node.
-->
此项工作是 [KEP #1287](https://kep.k8s.io/1287) 的一部分，由 SIG Node 牵头完成。

<!--
### Beta: Pod certificates for workload identity and security
-->
### Beta：用于工作负载身份与安全的 Pod 证书   {#beta-pod-certificates-for-workload-identity-and-security}

<!--
Previously, delivering certificates to pods required external controllers (cert-manager, SPIFFE/SPIRE), CRD orchestration, and Secret management, with rotation handled by sidecars or init containers. Kubernetes v1.35 enables native workload identity with automated certificate rotation, drastically simplifying service mesh and zero-trust architectures. 
-->
此前，要向 Pod 下发证书，往往需要外部控制器（cert-manager、SPIFFE/SPIRE）、
CRD 编排以及 Secret 管理，并由边车或 Init 容器负责证书轮换。
Kubernetes v1.35 通过自动化证书轮换，实现原生工作负载身份，
大幅简化服务网格与零信任架构。

<!--
Now, the `kubelet` generates keys, requests certificates via PodCertificateRequest, and writes credential bundles directly to the Pod's filesystem. The `kube-apiserver` enforces node restriction at admission time, eliminating the most common pitfall for third-party signers: accidentally violating node isolation boundaries. This enables pure mTLS flows with no bearer tokens in the issuance path.
-->
现在，`kubelet` 会生成密钥，通过 PodCertificateRequest 请求证书，
并将凭据包直接写入 Pod 的文件系统。
`kube-apiserver` 会在准入阶段强制执行节点限制，
消除第三方签名者最常见的陷阱：无意间突破节点隔离边界。
这使得签发路径中无需持有者令牌即可实现纯双向 TLS 流程。

<!--
This work was done as part of [KEP #4317](https://kep.k8s.io/4317) led by SIG Auth.
-->
此项工作是 [KEP #4317](https://kep.k8s.io/4317) 的一部分，由 SIG Auth 牵头完成。

<!--
### Alpha: Node declared features before scheduling
-->
### Alpha：调度前节点声明式特性   {#alpha-node-declared-features-before-scheduling}

<!--
When control planes enable new features but nodes lag behind (permitted by Kubernetes skew policy), the scheduler can place pods requiring those features onto incompatible older nodes.
-->
当控制平面启用新特性、但节点侧进度滞后时（Kubernetes 版本偏差策略允许这种情况），
调度器可能会将需要这些特性的 Pod 调度到不兼容的旧节点上。

<!--
The node-declaration features framework allows nodes to declare their supported Kubernetes features. With the new alpha feature enabled, a Node reports the features it supports, publishing this information to the control plane via a new `.status.declaredFeatures` field. Then, the `kube-scheduler`, admission controllers, and third-party components can use these declarations. For example, you can enforce scheduling and API validation constraints to ensure that Pods run only on compatible nodes.
-->
节点声明式特性框架允许节点声明其所支持的 Kubernetes 特性。
启用这一 Alpha 特性后，Node 会通过新的 `.status.declaredFeatures` 字段上报其支持的特性，
并将信息发布到控制平面。
随后，`kube-scheduler`、准入控制器以及第三方组件都可以使用这些声明。
例如，你可以强制执行调度与 API 校验约束，确保 Pod 只运行在兼容的节点上。

<!--
This work was done as part of [KEP #5328](https://kep.k8s.io/5328) led by SIG Node.
-->
此项工作是 [KEP #5328](https://kep.k8s.io/5328) 的一部分，由 SIG Node 牵头完成。

<!--
## Features graduating to Stable
-->
## 进入稳定（GA）阶段的特性   {#features-graduating-to-stable}

<!--
*This is a selection of some of the improvements that are now stable following the v1.35 release.*
-->
**以下列出 v1.35 发布后进入稳定（GA）阶段的一些改进。**

<!--
### PreferSameNode traffic distribution
-->
### PreferSameNode 流量分配   {#prefersamenode-traffic-distribution}

<!--
The `trafficDistribution` field for Services has been updated to provide more explicit control over traffic routing. A new option, `PreferSameNode`, has been introduced to let services strictly prioritize endpoints on the local node if available, falling back to remote endpoints otherwise.
-->
Service 的 `trafficDistribution` 字段已更新，以便更明确地控制流量路由。
新增选项 `PreferSameNode`：在可用时严格优先选择本节点上的端点，
否则再回退到远端端点。

<!--
Simultaneously, the existing `PreferClose` option has been renamed to `PreferSameZone`. This change makes the API self-explanatory by explicitly indicating that traffic is preferred within the current availability zone. While `PreferClose` is preserved for backward compatibility, `PreferSameZone` is now the standard for zonal routing, ensuring that both node-level and zone-level preferences are clearly distinguished.
-->
同时，现有的 `PreferClose` 选项已重命名为 `PreferSameZone`。
这一变更让 API 更加直观、自解释：它明确表示优先在当前可用区内选择流量路径。
虽然为了向后兼容仍保留 `PreferClose`，但 `PreferSameZone` 现在是可用区级别路由的标准选项，
确保“节点级”与“可用区级”的偏好能够清晰区分。

<!--
This work was done as part of [KEP #3015](https://kep.k8s.io/3015) led by SIG Network.
-->
此项工作是 [KEP #3015](https://kep.k8s.io/3015) 的一部分，由 SIG Network 牵头完成。

<!--
### Job API managed-by mechanism
-->
### Job API 的 managed-by 机制   {#job-api-managed-by-mechanism}

<!--
The Job API now includes a `managedBy` field that allows an external controller to handle Job status synchronization. This feature, which graduates to stable in Kubernetes v1.35, is primarily driven by [MultiKueue](https://github.com/kubernetes-sigs/kueue/tree/main/keps/693-multikueue), a multi-cluster dispatching system where a Job created in a management cluster is mirrored and executed in a worker cluster, with status updates propagated back. To enable this workflow, the built-in Job controller must not act on a particular Job resource so that the Kueue controller can manage status updates instead.
-->
Job API 新增 `managedBy` 字段，允许外部控制器接管 Job 状态同步。
该特性在 Kubernetes v1.35 中进入稳定（GA）阶段，
主要由 [MultiKueue](https://github.com/kubernetes-sigs/kueue/tree/main/keps/693-multikueue) 推动。
MultiKueue 是一种多集群分发系统，在管理集群创建的 Job 会被镜像到工作集群执行，并将状态更新回传。
为实现这一工作流，需要让内置 Job 控制器不要处理某个特定 Job 资源，
从而由 Kueue 控制器接管状态更新。

<!--
The goal is to allow clean delegation of Job synchronization to another controller. It does not aim to pass custom parameters to that controller or modify CronJob concurrency policies.
-->
其目标是让 Job 同步能够清晰地委派给另一个控制器。
它并不意图向该控制器传递自定义参数，也不打算修改 CronJob 的并发策略。

<!--
This work was done as part of [KEP #4368](https://kep.k8s.io/4368) led by SIG Apps.
-->
此项工作是 [KEP #4368](https://kep.k8s.io/4368) 的一部分，由 SIG Apps 牵头完成。

<!--
### Reliable Pod update tracking with `.metadata.generation`
-->
### 使用 `.metadata.generation` 可靠跟踪 Pod 更新   {#reliable-pod-update-tracking-with-metadata-generation}

<!--
Historically, the Pod API lacked the `metadata.generation` field found in other Kubernetes objects such as Deployments.
Because of this omission, controllers and users had no reliable way to verify whether the `kubelet` had actually processed the latest changes to a Pod's specification. This ambiguity was particularly problematic for features like [In-Place Pod Vertical Scaling](#stable-in-place-update-of-pod-resources), where it was difficult to know exactly when a resource resize request had been enacted.
-->
在历史上，Pod API 缺少 `metadata.generation` 字段（其他对象例如 Deployment 具备该字段）。
因此，控制器与用户无法可靠地确认 `kubelet` 是否已经处理了 Pod 规约的最新变更。
这种不确定性在诸如[Pod 资源原地纵向扩缩容](#stable-in-place-update-of-pod-resources)
等特性中尤为突出，因为很难精确判断资源调整请求何时真正生效。

<!--
Kubernetes v1.33 added `.metadata.generation` fields for Pods, as an alpha feature. That field is now stable in the v1.35 Pod API, which means that every time a Pod's `spec` is updated, the `.metadata.generation` value is incremented. As part of this improvement, the Pod API also gained a `.status.observedGeneration` field, which reports the generation that the `kubelet` has successfully seen and processed. Pod conditions also each contain their own individual `observedGeneration` field that clients can report and / or observe.
-->
Kubernetes v1.33 以 Alpha 形式为 Pod 增加了 `.metadata.generation` 字段。
在 v1.35 的 Pod API 中，该字段已进入稳定（GA）阶段。
每当更新 Pod 的 `spec` 时，`.metadata.generation` 的值都会递增。
作为这一改进的一部分，Pod API 还新增了 `.status.observedGeneration` 字段，
用于报告 `kubelet` 已经成功看到并处理的 generation。
Pod 的各类状况（conditions）也各自包含独立的 `observedGeneration` 字段，
客户端可以上报和/或观测这些字段。

<!--
Because this feature has graduated to stable in v1.35, it is available for all workloads.
-->
由于该特性在 v1.35 进入稳定（GA）阶段，它对所有工作负载可用。

<!--
This work was done as part of [KEP #5067](https://kep.k8s.io/5067) led by SIG Node.
-->
此项工作是 [KEP #5067](https://kep.k8s.io/5067) 的一部分，由 SIG Node 牵头完成。

<!--
### Configurable NUMA node limit for topology manager
-->
### 为拓扑管理器提供可配置 NUMA 节点上限   {#configurable-numa-node-limit-for-topology-manager}

<!--
The [topology manager](/docs/concepts/policy/node-resource-managers/) historically used a hard-coded limit of 8 for the maximum number of NUMA nodes it can support, preventing state explosion during affinity calculation. (There's an important detail here; a _NUMA node_ is not the same as a Node in the Kubernetes API.) This limit on the number of NUMA nodes prevented Kubernetes from fully utilizing modern high-end servers, which increasingly feature CPU architectures with more than 8 NUMA nodes.
-->
[拓扑管理器](/zh-cn/docs/concepts/policy/node-resource-managers/)过去使用硬编码上限 8，
作为其可支持的 NUMA 节点最大数量，以避免在亲和性计算期间出现状态爆炸。
这里有个重要细节：NUMA 节点（NUMA node）与 Kubernetes API 中的 Node 并不是同一概念。
这一 NUMA 节点数量上限，限制了 Kubernetes 对现代高端服务器的充分利用，
因为这类服务器越来越常见地采用拥有超过 8 个 NUMA 节点的 CPU 架构。

<!--
Kubernetes v1.31 introduced a new, **beta** `max-allowable-numa-nodes` option to the topology manager policy configuration. In Kubernetes v1.35, that option is stable. Cluster administrators who enable it can use servers with more than 8 NUMA nodes.
-->
Kubernetes v1.31 为拓扑管理器策略配置引入了新的 **Beta** 选项`max-allowable-numa-nodes`。
在 Kubernetes v1.35 中，该选项已进入稳定（GA）阶段。
启用该选项的集群管理员可以使用拥有超过 8 个 NUMA 节点的服务器。

<!--
Although the configuration option is stable, the Kubernetes community is aware of the poor performance for large NUMA hosts, and there is a [proposed enhancement](https://kep.k8s.io/5726) (KEP-5726) that aims to improve on it. You can learn more about this by reading [Control Topology Management Policies on a node](/docs/tasks/administer-cluster/topology-manager/).
-->
尽管这一配置选项已进入稳定（GA）阶段，Kubernetes 社区仍注意到在大型 NUMA 主机上性能欠佳，
并提出了旨在改进该问题的[增强提案](https://kep.k8s.io/5726)（KEP-5726）。
要了解更多信息，请阅读[在节点上控制拓扑管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)。

<!--
This work was done as part of [KEP #4622](https://kep.k8s.io/4622) led by SIG Node.
-->
此项工作是 [KEP #4622](https://kep.k8s.io/4622) 的一部分，由 SIG Node 牵头完成。

<!--
## New features in Beta
-->
## Beta 中的新特性   {#new-features-in-beta}

<!--
*This is a selection of some of the improvements that are now beta following the v1.35 release.*
-->
**以下列出 v1.35 发布后进入 Beta 阶段的一些改进。**

<!--
### Expose node topology labels via Downward API
-->
### 通过 Downward API 暴露节点拓扑标签   {#expose-node-topology-labels-via-downward-api}

<!--
Accessing node topology information, such as region and zone, from within a Pod has typically required querying the Kubernetes API server. While functional, this approach creates complexity and security risks by necessitating broad RBAC permissions or sidecar containers just to retrieve infrastructure metadata. Kubernetes v1.35 promotes the capability to expose node topology labels directly via the Downward API to beta. 
-->
过去，要在 Pod 内访问节点拓扑信息（例如区域与可用区），通常需要查询 Kubernetes API 服务器。
这种做法虽然可行，但为了获取基础设施元数据，往往需要授予较宽泛的 RBAC 权限，
或引入边车容器，从而带来复杂度与安全风险。
Kubernetes v1.35 将“通过 Downward API 直接暴露节点拓扑标签”的能力提升为 Beta。

<!--
The `kubelet` can now inject standard topology labels, such as `topology.kubernetes.io/zone` and `topology.kubernetes.io/region`, into Pods as environment variables or projected volume files. The primary benefit is a safer and more efficient way for workloads to be topology-aware. This allows applications to natively adapt to their availability zone or region without dependencies on the API server, strengthening security by upholding the principle of least privilege and simplifying cluster configuration. 
-->
现在，`kubelet` 可以将标准拓扑标签（例如 `topology.kubernetes.io/zone`
与 `topology.kubernetes.io/region`）注入到 Pod 中，
以环境变量或投射卷文件（projected volume files）的形式呈现。
其主要收益是让工作负载以更安全、更高效的方式具备拓扑感知能力。
应用可以在不依赖 API 服务器的情况下原生适配其所在可用区或区域，
通过坚持最小特权原则来增强安全性，并简化集群配置。

<!--
**Note:** Kubernetes now injects available topology labels to every Pod so that they can be used as inputs to the [downward API](/docs/concepts/workloads/pods/downward-api/). With the v1.35 upgrade, most cluster administrators will see several new labels added to each Pod; this is expected as part of the design.
-->
**说明：** Kubernetes 现在会为每个 Pod 注入可用的拓扑标签，
使其可以作为 [Downward API](/zh-cn/docs/concepts/workloads/pods/downward-api/) 的输入。
升级到 v1.35 后，大多数集群管理员会看到每个 Pod 新增了若干标签；
这是设计的一部分，属于预期行为。

<!--
This work was done as part of [KEP #4742](https://kep.k8s.io/4742) led by SIG Node.
-->
此项工作是 [KEP #4742](https://kep.k8s.io/4742) 的一部分，由 SIG Node 牵头完成。

<!--
### Native support for storage version migration
-->
### 存储版本迁移的原生支持   {#native-support-for-storage-version-migration}

<!--
In Kubernetes v1.35, the native support for storage version migration graduates to beta and is enabled by default. This move integrates the migration logic directly into the core Kubernetes control plane ("in-tree"), eliminating the dependency on external tools.
-->
在 Kubernetes v1.35 中，存储版本迁移的原生支持升级为 Beta 并默认启用。
这一改动将迁移逻辑直接集成到 Kubernetes 核心控制平面（in-tree）中，
从而消除对外部工具的依赖。

<!--
Historically, administrators relied on manual "read/write loops"—often piping `kubectl get` into `kubectl replace—to` update schemas or re-encrypt data at rest. This method was inefficient and prone to conflicts, especially for large resources like Secrets. With this release, the built-in controller automatically handles update conflicts and consistency tokens, providing a safe, streamlined, and reliable way to ensure stored data remains current with minimal operational overhead.
-->
在过去，管理员依赖手工的“读/写循环”（read/write loops），
常见做法是把 `kubectl get` 的输出通过管道传给 `kubectl replace`，
用来更新资源的模式（Schema）或重新加密静态数据。
这种方式效率低且容易产生冲突，尤其是对 Secret 这类较大的资源更是如此。
在本次发布中，内置控制器会自动处理更新冲突与一致性令牌，
以更安全、简化且可靠的方式确保存储数据保持最新，并将运维开销降到最低。

<!--
This work was done as part of [KEP #4192](https://kep.k8s.io/4192) led by SIG API Machinery.
-->
此项工作是 [KEP #4192](https://kep.k8s.io/4192) 的一部分，由 SIG API Machinery 牵头完成。

<!--
### Mutable Volume attach limits
-->
### 可变更的卷挂接上限   {#mutable-volume-attach-limits}

<!--
A CSI (Container Storage Interface) driver is a Kubernetes plugin that provides a consistent way for storage systems to be exposed to containerized workloads. The `CSINode` object records details about all CSI drivers installed on a node. However, a mismatch can arise between the reported and actual attachment capacity on nodes. When volume slots are consumed after a CSI driver starts up, the `kube-scheduler` may assign stateful pods to nodes without sufficient capacity, ultimately getting stuck in a `ContainerCreating` state.
-->
CSI（Container Storage Interface）驱动是 Kubernetes 插件，
为存储系统向容器化工作负载暴露能力提供一致的方式。
`CSINode` 对象会记录节点上安装的所有 CSI 驱动的详细信息。
不过，节点上报告的挂接容量与实际挂接容量可能出现不一致：
当 CSI 驱动启动后卷槽位被消耗时，`kube-scheduler` 可能把有状态 Pod
调度到挂接容量不足的节点上，最终卡在 `ContainerCreating` 状态。

<!--
Kubernetes v1.35 makes `CSINode.spec.drivers[*].allocatable.count` mutable so that a node’s available volume attachment capacity can be updated dynamically. It also allows CSI drivers to control how frequently the `allocatable.count` value is updated on all nodes by introducing a configurable refresh interval, defined through the `CSIDriver` object. Additionally, it automatically updates `CSINode.spec.drivers[*].allocatable.count` on detecting a failure in volume attachment due to insufficient capacity. Although this feature graduated to beta in v1.34 with the feature flag `MutableCSINodeAllocatableCount` disabled by default, it remains in beta for v1.35 to allow time for feedback, but the feature flag is enabled by default.
-->
Kubernetes v1.35 使 `CSINode.spec.drivers[*].allocatable.count` 可变更，
以便动态更新节点可用的卷挂接容量。它还通过 `CSIDriver` 对象引入可配置的刷新间隔，
允许 CSI 驱动控制在所有节点上更新 `allocatable.count` 值的频率。
此外，当检测到因容量不足导致的卷挂接失败时，
它会自动更新 `CSINode.spec.drivers[*].allocatable.count`。
尽管该特性在 v1.34 中已升级为 Beta，
但当时特性门控 `MutableCSINodeAllocatableCount` 默认关闭；
在 v1.35 中它仍处于 Beta，以便留出反馈时间，同时该特性门控默认启用。

<!--
This work was done as part of [KEP #4876](https://kep.k8s.io/4876) led by SIG Storage.
-->
此项工作是 [KEP #4876](https://kep.k8s.io/4876) 的一部分，由 SIG Storage 牵头完成。

<!--
### Opportunistic batching
-->
### 机会式批处理   {#opportunistic-batching}

<!--
Historically, the Kubernetes scheduler processes pods sequentially with time complexity of `O(num pods × num nodes)`, which can result in redundant computation for compatible pods. This KEP introduces an opportunistic batching mechanism that aims to improve performance by identifying such compatible Pods via `Pod scheduling signature` and batching them together, allowing shared filtering and scoring results across them.
-->
在过去，Kubernetes 调度器按顺序处理 Pod，其时间复杂度为 `O(Pod 个数 × 节点个数)`，
这会导致对“可兼容 Pod”执行重复计算。此 KEP 引入一种机会式批处理机制，
旨在通过 `Pod scheduling signature` 识别这类可兼容 Pod 并将它们批量处理，
从而在这些 Pod 之间共享过滤与打分结果以提升性能。

<!--
The pod scheduling signature ensures that two pods with the same signature are “the same” from a scheduling perspective. It takes into account not only the pod and node attributes, but also the other pods in the system and global data about the pod placement. This means that any pod with the given signature will get the same scores/feasibility results from any arbitrary set of nodes.
-->
**Pod 调度签名（Pod Scheduling Signature）**机制确保从调度视角看，具有相同签名的两个 Pod 是“相同的”。
它不仅会考虑 Pod 与节点属性，还会纳入系统中的其他 Pod 以及有关放置的全局数据。
这意味着：具有给定签名的任意 Pod，在任意一组节点上都会得到相同的打分/可行性判断结果。

<!--
The batching mechanism consists of two operations that can be invoked whenever needed - *create* and *nominate*. Create leads to the creation of a new set of batch information from the scheduling results of Pods that have a valid signature. Nominate uses the batching information from create to set the nominated node name from a new Pod whose signature matches the canonical Pod’s signature.
-->
该批处理机制包含两个可按需调用的操作：*create* 与 *nominate*。
create 会基于具有有效签名的 Pod 的调度结果，创建一组新的批处理信息。
nominate 会使用 create 生成的批处理信息，
为一个新 Pod（其签名与规范 Pod 的签名一致）设置提名的节点名称。

<!--
This work was done as part of [KEP #5598](https://kep.k8s.io/5598) led by SIG Scheduling.
-->
此项工作是 [KEP #5598](https://kep.k8s.io/5598) 的一部分，由 SIG Scheduling 牵头完成。

<!--
### `maxUnavailable` for StatefulSets
-->
### StatefulSet 的 `maxUnavailable`   {#maxunavailable-for-statefulsets}

<!--
A StatefulSet runs a group of Pods and maintains a sticky identity for each of those Pods. This is critical for stateful workloads requiring stable network identifiers or persistent storage. When a StatefulSet's `.spec.updateStrategy.<type>` is set to `RollingUpdate`, the StatefulSet controller will delete and recreate each Pod in the StatefulSet. It will proceed in the same order as Pod termination (from the largest ordinal to the smallest), updating each Pod one at a time.
-->
StatefulSet 运行一组 Pod，并为其中每个 Pod 维护粘性身份（Sticky Identity）。
这对需要稳定网络标识符或持久存储的有状态工作负载至关重要。
当 StatefulSet 的 `.spec.updateStrategy.<type>` 设置为 `RollingUpdate` 时，
StatefulSet 控制器会删除并重建 StatefulSet 中的每个 Pod。
它会按 Pod 终止的顺序（从最大序号到最小序号）推进，一次只更新一个 Pod。

<!--
Kubernetes v1.24 added a new **alpha** field to a StatefulSet's `rollingUpdate` configuration settings, called `maxUnavailable`. That field wasn't part of the Kubernetes API unless your cluster administrator explicitly opted in.
In Kubernetes v1.35 that field is beta and is available by default. You can use it to define the maximum number of pods that can be unavailable during an update. This setting is most effective in combination with `.spec.podManagementPolicy` set to Parallel.  You can set `maxUnavailable` as either a positive number (example: 2) or a percentage of the desired number of Pods (example: 10%). If this field is not specified, it will default to 1, to maintain the previous behavior of only updating one Pod at a time. This improvement allows stateful applications (that can tolerate more than one Pod being down) to finish updating faster.
-->
Kubernetes v1.24 在 StatefulSet 的 `rollingUpdate` 配置中新增了一个 **Alpha** 字段
`maxUnavailable`，除非你的集群管理员显式选择启用，
否则该字段不会出现在 Kubernetes API 中。
在 Kubernetes v1.35 中，该字段升级为 Beta 且默认可用。
你可以用它定义更新期间最多允许不可用的 Pod 数量。
该设置与将 `.spec.podManagementPolicy` 设为 Parallel 组合使用时最有效。
你可以把 `maxUnavailable` 设置为一个正整数（例如：2），
或设置为期望 Pod 数量的百分比（例如：10%）。
如果未指定该字段，它默认为 1，以保持此前“一次只更新一个 Pod”的行为。
这一改进使有状态应用（可容忍多个 Pod 同时不可用）能够更快完成更新。

<!--
This work was done as part of [KEP #961](https://kep.k8s.io/961) led by SIG Apps.
-->
此项工作是 [KEP #961](https://kep.k8s.io/961) 的一部分，由 SIG Apps 牵头完成。

<!--
### Configurable credential plugin policy in `kuberc`
-->
### `kuberc` 中可配置的凭据插件策略   {#configurable-credential-plugin-policy-in-kuberc}

<!--
The optional [`kuberc` file](/docs/reference/kubectl/kuberc/) is a way to separate server configurations and cluster credentials from user preferences without disrupting already running CI pipelines with unexpected outputs.
-->
可选的 [`kuberc` 文件](/zh-cn/docs/reference/kubectl/kuberc/)
用于将服务器配置与集群凭据和用户偏好相分离，而不会因意外输出而打断已经在运行的 CI 流水线。

<!--
As part of the v1.35 release, `kuberc` gains additional functionality which allows users to configure credential plugin policy. This change introduces two fields `credentialPluginPolicy`, which allows or denies all plugins, and allows specifying a list of allowed plugins using `credentialPluginAllowlist`.
-->
作为 v1.35 发布的一部分，`kuberc` 增加了允许用户配置凭据插件策略的能力。
此变更引入两个字段：`credentialPluginPolicy`（允许或拒绝所有插件），
以及 `credentialPluginAllowlist`（允许指定允许插件的列表）。

<!--
This work was done as part of [KEP #3104](https://kep.k8s.io/3104) as a cooperation between SIG Auth and SIG CLI.
-->
此项工作是 [KEP #3104](https://kep.k8s.io/3104) 的一部分，
由 SIG Auth 与 SIG CLI 协作完成。

<!--
### KYAML
-->
### KYAML   {#kyaml}

<!--
YAML is a human-readable format of data serialization. In Kubernetes, YAML files are used to define and configure resources, such as Pods, Services, and Deployments. However, complex YAML is difficult to read. YAML's significant whitespace requires careful attention to indentation and nesting, while its optional string-quoting can lead to unexpected type coercion (see: The Norway Bug). While JSON is an alternative, it lacks support for comments and has strict requirements for trailing commas and quoted keys.
-->
YAML 是一种便于人类阅读的数据序列化格式。
在 Kubernetes 中，YAML 文件用于定义与配置资源，例如 Pod、Service 与 Deployment。
不过，复杂 YAML 很难阅读：YAML 对缩进与嵌套要求严格；
同时，其可选的字符串引用也可能导致意外的类型强制转换（参见：The Norway Bug）。
虽然 JSON 可以作为一种替代方案，但它不支持注释，并对尾随逗号与键的引号有严格要求。

<!--
KYAML is a safer and less ambiguous subset of YAML designed specifically for Kubernetes. Introduced as an opt-in alpha feature in v1.34, this feature graduated to beta in Kubernetes v1.35 and has been enabled by default. It can be disabled by setting the environment variable `KUBECTL_KYAML=false`. 
-->
KYAML 是专为 Kubernetes 设计的、更安全且更少歧义的 YAML 子集。
它在 v1.34 作为可选的 Alpha 特性引入，
并在 Kubernetes v1.35 升级为 Beta 且默认启用。
你可以通过设置环境变量 `KUBECTL_KYAML=false` 来禁用它。

<!--
KYAML addresses challenges pertaining to both YAML and JSON. All KYAML files are also valid YAML files. This means you can write KYAML and pass it as an input to any version of kubectl. This also means that you don’t need to write in strict KYAML for the input to be parsed.
-->
KYAML 旨在解决 YAML 与 JSON 的一些共性挑战。
所有 KYAML 文件也都是合法的 YAML 文件，
这意味着你可以编写 KYAML 并将其作为输入提供给任意版本的 kubectl。
这也意味着，即使输入并非严格 KYAML，也仍然可以被解析。

<!--
This work was done as part of [KEP #5295](https://kep.k8s.io/5295) led by SIG CLI.
-->
此项工作是 [KEP #5295](https://kep.k8s.io/5295) 的一部分，由 SIG CLI 牵头完成。

<!--
### Configurable tolerance for HorizontalPodAutoscalers
-->
### 可配置的 HorizontalPodAutoscalers 容忍度   {#configurable-tolerance-for-horizontalpodautoscalers}

<!--
The Horizontal Pod Autoscaler (HPA) has historically relied on a fixed, global 10% tolerance for scaling actions. A drawback of this hardcoded value was that workloads requiring high sensitivity, such as those needing to scale on a 5% load increase, were often blocked from scaling, while others might oscillate unnecessarily.
-->
水平 Pod 自动扩缩容器（Horizontal Pod Autoscaler，HPA）长期依赖固定的全局 10% 容忍度来执行扩缩容。
这一硬编码值的缺点是：对需要高灵敏度的工作负载（例如希望在负载增加 5% 时就扩容）不够友好，
这些工作负载常常无法触发扩缩容；而另一些工作负载则可能产生不必要的振荡。

<!--
With Kubernetes v1.35, the configurable tolerance feature graduates to beta and is enabled by default. This enhancement allows users to define a custom tolerance window on a per-resource basis within the HPA `behavior` field. By setting a specific tolerance (e.g., lowering it to 0.05 for 5%), operators gain precise control over autoscaling sensitivity, ensuring that critical workloads react quickly to small metric changes, without requiring cluster-wide configuration adjustments.
-->
在 Kubernetes v1.35 中，“可配置容忍度”特性升级为 Beta 并默认启用。
该增强允许用户在 HPA 的 `behavior` 字段中，按资源粒度定义自定义容忍窗口。
通过设置特定容忍度（例如将其降低到 0.05 来表示 5%），运维人员可以更精确地控制自动扩缩容灵敏度，
确保关键工作负载能对小幅指标变化快速响应，而无需进行集群范围的配置调整。

<!--
This work was done as part of [KEP #4951](https://kep.k8s.io/4951) led by SIG Autoscaling.
-->
此项工作是 [KEP #4951](https://kep.k8s.io/4951) 的一部分，由 SIG Autoscaling 牵头完成。

<!--
### Support for user namespaces in Pods
-->
### Pod 中的用户命名空间支持   {#support-for-user-namespaces-in-pods}

<!--
Kubernetes is adding support for user namespaces, allowing pods to run with isolated user and group ID mappings instead of sharing host IDs. This means containers can operate as root internally while actually being mapped to an unprivileged user on the host, reducing the risk of privilege escalation in the event of a compromise. The feature improves pod-level security and makes it safer to run workloads that need root inside the container. Over time, support has expanded to both stateless and stateful Pods through id-mapped mounts.
-->
Kubernetes 增加了对用户命名空间（user namespaces）的支持，
使 Pod 可以使用相互隔离的用户/组 ID 映射运行，而不是共享主机上的 ID。
这意味着容器在内部可以以 root 身份运行，
但在主机上实际映射为一个非特权用户，从而在发生入侵时降低提权风险。
该特性提升了 Pod 级别的安全性，使需要在容器内使用 root 的工作负载更安全。
随着时间推移，该能力也通过 ID 映射挂载（id-mapped mounts）扩展到无状态与有状态 Pod。

<!--
This work was done as part of [KEP #127](https://kep.k8s.io/127) led by SIG Node.
-->
此项工作是 [KEP #127](https://kep.k8s.io/127) 的一部分，由 SIG Node 牵头完成。

<!--
### VolumeSource: OCI artifact and/or image
-->
### VolumeSource：OCI 工件和/或镜像   {#volumesource-oci-artifact-andor-image}

<!--
When creating a Pod, you often need to provide data, binaries, or configuration files for your containers. This meant including the content into the main container image or using a custom init container to download and unpack files into an `emptyDir`. Both these approaches are still valid. Kubernetes v1.31 added support for the `image` volume type allowing Pods to declaratively pull and unpack OCI container image artifacts into a volume. This lets you package and deliver data-only artifacts such as configs, binaries, or machine learning models using standard OCI registry tools.
-->
在创建 Pod 时，你常常需要为容器提供数据、二进制文件或配置文件。
这通常意味着要么把内容打进主容器镜像，要么使用自定义 Init 容器下载并解包到 `emptyDir` 中。
这两种方式仍然有效。Kubernetes v1.31 增加了对 `image` 卷类型的支持，
允许 Pod 以声明的方式拉取并将 OCI 容器镜像工件解包到卷中。
这使你可以使用标准 OCI 镜像库工具来打包与分发纯数据工件，例如配置、二进制文件或机器学习模型。

<!--
With this feature, you can fully separate your data from your container image and remove the need for extra init containers or startup scripts. The image volume type has been in beta since v1.33 and is enabled by default in v1.35. Please note that using this feature requires a compatible container runtime, such as containerd v2.1 or later.
-->
借助该特性，你可以将数据与容器镜像彻底分离，并去除额外 Init 容器或启动脚本的需求。
image 卷类型自 v1.33 起处于 Beta，并在 v1.35 中默认启用。
请注意，使用该特性需要兼容的容器运行时，例如 containerd v2.1 或更高版本。

<!--
This work was done as part of [KEP #4639](https://kep.k8s.io/4639) led by SIG Node.
-->
此项工作是 [KEP #4639](https://kep.k8s.io/4639) 的一部分，由 SIG Node 牵头完成。

<!--
### Enforced `kubelet` credential verification for cached images
-->
### 对缓存镜像强制执行 `kubelet` 凭据校验   {#enforced-kubelet-credential-verification-for-cached-images}

<!--
The `imagePullPolicy: IfNotPresent` setting currently allows a Pod to use a container image that is already cached on a node, even if the Pod itself does not possess the credentials to pull that image. A drawback of this behavior is that it creates a security vulnerability in multi-tenant clusters: if a Pod with valid credentials pulls a sensitive private image to a node, a subsequent unauthorized Pod on the same node can access that image simply by relying on the local cache.
-->
当前，`imagePullPolicy: IfNotPresent` 允许 Pod 使用节点上已经缓存的容器镜像，
即使 Pod 本身并不具备拉取该镜像所需的凭据。这种行为在多租户集群中会带来安全漏洞：
如果某个具备有效凭据的 Pod 把敏感的私有镜像拉取到某节点上，
同一节点上后续的未授权 Pod 只需依赖本地缓存就能访问该镜像。

<!--
This KEP introduces a mechanism where the `kubelet` enforces credential verification for cached images. Before allowing a Pod to use a locally cached image, the `kubelet` checks if the Pod has the valid credentials to pull it. This ensures that only authorized workloads can use private images, regardless of whether they are already present on the node, significantly hardening the security posture for shared clusters.
-->
此 KEP 引入一种机制：由 `kubelet` 对缓存镜像强制执行凭据校验。
在允许 Pod 使用本地缓存镜像之前，`kubelet` 会检查 Pod 是否具备拉取该镜像的有效凭据。
这确保只有经授权的工作负载才能使用私有镜像，
无论该镜像是否已经存在于节点上，从而显著增强共享集群的安全性。

<!--
In Kubernetes v1.35, this feature has graduated to beta and is enabled by default. Users can still disable it by setting the `KubeletEnsureSecretPulledImages` feature gate to false. Additionally, the `imagePullCredentialsVerificationPolicy` flag allows operators to configure the desired security level, ranging from a mode that prioritizes backward compatibility to a strict enforcement mode that offers maximum security.
-->
在 Kubernetes v1.35 中，该特性升级为 Beta 并默认启用。
用户仍可将 `KubeletEnsureSecretPulledImages` 特性门控设为 false 来禁用它。
此外，`imagePullCredentialsVerificationPolicy` 参数允许运维人员配置期望的安全级别，
从优先保证向后兼容的模式到提供最高安全性的严格强制模式不等。

<!--
This work was done as part of [KEP #2535](https://kep.k8s.io/2535) led by SIG Node.
-->
此项工作是 [KEP #2535](https://kep.k8s.io/2535) 的一部分，由 SIG Node 牵头完成。

<!--
### Fine-grained Container restart rules
-->
### 细粒度的容器重启规则   {#fine-grained-container-restart-rules}

<!--
Historically, the `restartPolicy` field was defined strictly at the Pod level, forcing the same behavior on all containers within a Pod. A drawback of this global setting was the lack of granularity for complex workloads, such as AI/ML training jobs. These often required `restartPolicy: Never` for the Pod to manage job completion, yet individual containers would benefit from in-place restarts for specific, retriable errors (like network glitches or GPU init failures).
-->
在过去，`restartPolicy` 字段只能在 Pod 级别定义，从而强制 Pod 内所有容器采用相同行为。
这一全局设置对复杂工作负载（例如 AI/ML 训练作业）缺乏足够的粒度。
这类作业往往需要 Pod 使用 `restartPolicy: Never` 以管理作业完成，
但某些容器仍希望能针对可重试的特定错误（如网络抖动或 GPU 初始化失败）执行原地重启。

<!--
Kubernetes v1.35 addresses this by enabling `restartPolicy` and `restartPolicyRules` within the container API itself. This allows users to define restart strategies for individual regular and init containers that operate independently of the Pod's overall policy. For example, a container can now be configured to restart automatically only if it exits with a specific error code, avoiding the expensive overhead of rescheduling the entire Pod for a transient failure.
-->
Kubernetes v1.35 通过在容器 API 本身中启用 `restartPolicy` 与 `restartPolicyRules`
来解决这一问题。这允许用户为单个普通容器与 Init 容器定义重启策略，
并使其与 Pod 的整体策略相互独立。例如，你可以将容器配置为仅在以特定错误码退出时才自动重启，
从而避免因短暂故障而重调度整个 Pod 的昂贵开销。

<!--
In this release, the feature has graduated to beta and is enabled by default. Users can immediately leverage `restartPolicyRules` in their container specifications to optimize recovery times and resource utilization for long-running workloads, without altering the broader lifecycle logic of their Pods.
-->
在本次发布中，该特性升级为 Beta 并默认启用。用户可以立即在容器规约中使用 `restartPolicyRules`，
为长时间运行的工作负载优化恢复时间与资源利用率，而无需改变 Pod 更宏观的生命周期逻辑。

<!--
This work was done as part of [KEP #5307](https://kep.k8s.io/5307) led by SIG Node.
-->
此项工作是 [KEP #5307](https://kep.k8s.io/5307) 的一部分，由 SIG Node 牵头完成。

<!--
### CSI driver opt-in for service account tokens via secrets field
-->
### CSI 驱动可选择通过 secrets 字段获取 ServiceAccount 令牌   {#csi-driver-opt-in-for-service-account-tokens-via-secrets-field}

<!--
Providing ServiceAccount tokens to Container Storage Interface (CSI) drivers has traditionally relied on injecting them into the `volume_context` field. This approach presents a significant security risk because `volume_context` is intended for non-sensitive configuration data and is frequently logged in plain text by drivers and debugging tools, potentially leaking credentials.
-->
在向 CSI（Container Storage Interface）驱动提供 ServiceAccount 令牌时，
传统上依赖把令牌注入到 `volume_context` 字段中。
这种方式存在显著安全风险：`volume_context` 主要用于非敏感配置数据，
并且常被驱动与调试工具以明文形式记录到日志中，从而可能泄露凭据。

<!--
Kubernetes v1.35 introduces an opt-in mechanism for CSI drivers to receive ServiceAccount tokens via the dedicated secrets field in the NodePublishVolume request. Drivers can now enable this behavior by setting the `serviceAccountTokenInSecrets` field to true in their CSIDriver object, instructing the `kubelet` to populate the token securely.
-->
Kubernetes v1.35 引入一套可选择启用的机制，
让 CSI 驱动通过 NodePublishVolume 请求中的专用 secrets 字段获取 ServiceAccount 令牌。
驱动现在可以在其 CSIDriver 对象中将 `serviceAccountTokenInSecrets` 设为 true 来启用此行为，
从而指示 `kubelet` 以更安全的方式填充该令牌。

<!--
The primary benefit is the prevention of accidental credential exposure in logs and error messages. This change ensures that sensitive workload identities are handled via the appropriate secure channels, aligning with best practices for secret management while maintaining backward compatibility for existing drivers.
-->
其主要收益是防止凭据在日志与错误信息中被意外暴露。
这一变更确保敏感的工作负载身份通过合适的安全通道处理，
在保持对既有驱动向后兼容的同时，也更符合密文管理最佳实践。

<!--
This work was done as part of [KEP #5538](https://kep.k8s.io/5538) led by SIG Auth in cooperation with SIG Storage.
-->
此项工作是 [KEP #5538](https://kep.k8s.io/5538) 的一部分，
由 SIG Auth 牵头并与 SIG Storage 协作完成。

<!--
### Deployment status: count of terminating replicas
-->
### Deployment 状态：正在终止的副本计数   {#deployment-status-count-of-terminating-replicas}

<!--
Historically, the Deployment status provided details on available and updated replicas but lacked explicit visibility into Pods that were in the process of shutting down. A drawback of this omission was that users and controllers could not easily distinguish between a stable Deployment and one that still had Pods executing cleanup tasks or adhering to long grace periods.
-->
在过去，Deployment 状态会提供可用副本与已更新副本的详细信息，
但缺少对“正在关闭过程中的 Pod”的明确可见性。
这一缺失使用户与控制器难以区分“稳定的 Deployment”与“仍有 Pod 正在执行清理任务或处于较长优雅终止期”的 Deployment。

<!--
Kubernetes v1.35 promotes the `terminatingReplicas` field within the Deployment status to beta. This field provides a count of Pods that have a deletion timestamp set but have not yet been removed from the system. This feature is a foundational step in a larger initiative to improve how Deployments handle Pod replacement, laying the groundwork for future policies regarding when to create new Pods during a rollout.
-->
Kubernetes v1.35 将 Deployment 状态中的 `terminatingReplicas` 字段提升为 Beta。
该字段提供已设置删除时间戳但尚未从系统移除的 Pod 数量。该特性是一个更大计划中的基础一步，
旨在改进 Deployment 如何处理 Pod 替换，并为未来制定“在滚动发布期间何时创建新 Pod”的策略奠定基础。

<!--
The primary benefit is improved observability for lifecycle management tools and operators. By exposing the number of terminating Pods, external systems can now make more informed decisions such as waiting for a complete shutdown before proceeding with subsequent tasks without needing to manually query and filter individual Pod lists.
-->
其主要收益是提升生命周期管理工具与运维人员的可观测性。
通过公开正在终止的 Pod 数量，可以让外部系统做出更明智的决策，
例如在继续后续任务之前等待完全关闭，而无需手工查询并筛选各个 Pod 的列表。

<!--
This work was done as part of [KEP #3973](https://kep.k8s.io/3973) led by SIG Apps.
-->
此项工作是 [KEP #3973](https://kep.k8s.io/3973) 的一部分，由 SIG Apps 牵头完成。

<!--
## New features in Alpha
-->
## Alpha 阶段的新特性   {#new-features-in-alpha}
<!--
*This is a selection of some of the improvements that are now alpha following the v1.35 release.*
-->
**以下列出 v1.35 发布后进入 Alpha 阶段的一些改进。**

<!--
### Gang scheduling support in Kubernetes
-->
### Kubernetes 中的 Gang 调度支持   {#gang-scheduling-support-in-kubernetes}

<!--
Scheduling interdependent workloads, such as AI/ML training jobs or HPC simulations, has traditionally been challenging because the default Kubernetes scheduler places Pods individually. This often leads to partial scheduling where some Pods start while others wait indefinitely for resources, resulting in deadlocks and wasted cluster capacity.
-->
对相互依赖的工作负载（例如 AI/ML 训练作业或 HPC 仿真）进行调度，
传统上一直很有挑战性，因为默认的 Kubernetes 调度器会逐个调度 Pod。
这常导致“部分调度”：部分 Pod 已启动，而其他 Pod 由于资源不足无限期等待，
从而引发死锁并浪费集群容量。

<!--
Kubernetes v1.35 introduces native support for so-called "gang scheduling" via the new Workload API and PodGroup concept. This feature implements an "all-or-nothing" scheduling strategy, ensuring that a defined group of Pods is scheduled only if the cluster has sufficient resources to accommodate the entire group simultaneously.
-->
Kubernetes v1.35 通过新的 Workload API 与 PodGroup 概念，
引入对所谓成组调度（Gang Scheduling）的原生支持。
该特性实现“全有或全无”的调度策略：只有当集群有足够资源同时容纳整个 Pod 组时，才会对该组进行调度。

<!--
The primary benefit is improved reliability and efficiency for batch and parallel workloads. By preventing partial deployments, it eliminates resource deadlocks and ensures that expensive cluster capacity is utilized only when a complete job can run, significantly optimizing the orchestration of large-scale data processing tasks.
-->
其主要收益是提升批处理与并行工作负载的可靠性与效率。通过避免部分部署，它消除了资源死锁，
并确保昂贵的集群容量只在能够运行完整作业时才会被使用，从而显著优化大规模数据处理任务的编排。

<!--
This work was done as part of [KEP #4671](https://kep.k8s.io/4671) led by SIG Scheduling.
-->
此项工作是 [KEP #4671](https://kep.k8s.io/4671) 的一部分，由 SIG Scheduling 牵头完成。

<!--
### Constrained impersonation
-->
### 受限的身份扮演（Impersonation）   {#constrained-impersonation}

<!--
Historically, the `impersonate` verb in Kubernetes RBAC functioned on an all-or-nothing basis: once a user was authorized to impersonate a target identity, they gained all associated permissions. A drawback of this broad authorization was that it violated the principle of least privilege, preventing administrators from restricting impersonators to specific actions or resources.
-->
在过去，Kubernetes RBAC 中的 `impersonate` 动词按“全有或全无”运作：
一旦用户被授权可以扮演某个目标身份，就会获得该身份所关联的全部权限。
这种宽泛授权的缺点是违背最小特权原则，使管理员难以将模拟者的权限限制到特定动作或特定资源上。

<!--
Kubernetes v1.35 introduces a new alpha feature, constrained impersonation, which adds a secondary authorization check to the impersonation flow. When enabled via the `ConstrainedImpersonation` feature gate, the API server verifies not only the basic `impersonate` permission but also checks if the impersonator is authorized for the specific action using new verb prefixes (e.g., `impersonate-on:<mode>:<verb>`). This allows administrators to define fine-grained policies—such as permitting a support engineer to impersonate a cluster admin solely to view logs, without granting full administrative access.
-->
Kubernetes v1.35 引入一个新的 Alpha 特性：受限的身份扮演（Constrained Impersonation），
它在身份扮演流程中增加一次二次鉴权检查。当 `ConstrainedImpersonation` 特性门控被启用后，
API 服务器不仅会校验基础的 `impersonate` 权限，还会使用新的动词前缀（例如 `impersonate-on:<mode>:<verb>`）
检查身份扮演者是否被授权执行特定动作。
这使管理员可以定义细粒度策略——例如允许支持工程师模拟集群管理员仅用于查看日志，
而不授予完整的管理员访问权限。

<!--
This work was done as part of [KEP #5284](https://kep.k8s.io/5284) led by SIG Auth.
-->
此项工作是 [KEP #5284](https://kep.k8s.io/5284) 的一部分，由 SIG Auth 牵头完成。

<!--
### Flagz for Kubernetes components
-->
### Kubernetes 组件的 Flagz   {#flagz-for-kubernetes-components}

<!--
Verifying the runtime configuration of Kubernetes components, such as the API server or `kubelet`, has traditionally required privileged access to the host node or process arguments. To address this, the `/flagz` endpoint was introduced to expose command-line options via HTTP. However, its output was initially limited to plain text, making it difficult for automated tools to parse and validate configurations reliably.
-->
在过去，要验证 Kubernetes 组件（例如 API 服务器或 `kubelet`）的运行时配置，
通常需要对宿主机节点或进程参数具有特权访问权限。
为解决这一问题，引入了 `/flagz` 端点，通过 HTTP 公开其命令行选项。
但其最初输出仅为纯文本，使自动化工具难以可靠地解析并校验配置。

<!--
In Kubernetes v1.35, the `/flagz` endpoint has been enhanced to support structured, machine-readable JSON output. Authorized users can now request a versioned JSON response using standard HTTP content negotiation, while the original plain text format remains available for human inspection. This update significantly improves observability and compliance workflows, allowing external systems to programmatically audit component configurations without fragile text parsing or direct infrastructure access.
-->
在 Kubernetes v1.35 中，`/flagz` 端点增强为支持结构化、机器可读的 JSON 输出。
经授权的用户现在可以通过标准 HTTP 内容协商请求版本化的 JSON 响应，
同时原先的纯文本格式仍保留，便于人工查看。
此更新显著改进可观测性与合规工作流，让外部系统无需脆弱的文本解析或直接基础设施访问，
即可通过编程方式审计组件配置。

<!--
This work was done as part of [KEP #4828](https://kep.k8s.io/4828) led by SIG Instrumentation.
-->
此项工作是 [KEP #4828](https://kep.k8s.io/4828) 的一部分，由 SIG Instrumentation 牵头完成。

<!--
### Statusz for Kubernetes components
-->
### Kubernetes 组件的 Statusz   {#statusz-for-kubernetes-components}

<!--
Troubleshooting Kubernetes components like the `kube-apiserver` or `kubelet` has traditionally involved parsing unstructured logs or text output, which is brittle and difficult to automate. While a basic `/statusz` endpoint existed previously, it lacked a standardized, machine-readable format, limiting its utility for external monitoring systems.
-->
传统上，排查 `kube-apiserver` 或 `kubelet` 等 Kubernetes 组件问题，
往往需要解析非结构化日志或文本输出，这种方式脆弱且难以自动化。
此前虽然存在基础的 `/statusz` 端点，
但缺乏标准化、机器可读的格式，从而限制了外部监控系统的可用性。

<!--
In Kubernetes v1.35, the `/statusz` endpoint has been enhanced to support structured, machine-readable JSON output. Authorized users can now request this format using standard HTTP content negotiation to retrieve precise status data—such as version information and health indicators—without relying on fragile text parsing. This improvement provides a reliable, consistent interface for automated debugging and observability tools across all core components.
-->
在 Kubernetes v1.35 中，`/statusz` 端点增强为支持结构化、机器可读的 JSON 输出。
经授权的用户现在可以通过标准 HTTP 内容协商请求这一格式，
以获取精确的状态数据——例如版本信息与健康指标——而无需依赖脆弱的文本解析。
该改进为所有核心组件的自动化调试与可观测性工具提供了可靠且一致的接口。

<!--
This work was done as part of [KEP #4827](https://kep.k8s.io/4827) led by SIG Instrumentation.
-->
此项工作是 [KEP #4827](https://kep.k8s.io/4827) 的一部分，由 SIG Instrumentation 牵头完成。

<!--
### CCM: watch-based route controller reconciliation using informers
-->
### CCM：基于 Informer 的 Watch 式路由控制器调谐   {#ccm-watch-based-route-controller-reconciliation-using-informers}

<!--
Managing network routes within cloud environments has traditionally relied on the Cloud Controller Manager (CCM) periodically polling the cloud provider's API to verify and update route tables. This fixed-interval reconciliation approach can be inefficient, often generating a high volume of unnecessary API calls and introducing latency between a node state change and the corresponding route update.
-->
在云环境中管理网络路由，传统上依赖云控制器管理器（CCM）定期轮询云提供商 API 来校验并更新路由表。
这种固定间隔的调谐方式可能效率不高，
常会产生大量不必要的 API 调用，并在节点状态变化与路由更新之间引入延迟。

<!--
For the Kubernetes v1.35 release, the cloud-controller-manager library introduces a watch-based reconciliation strategy for the route controller. Instead of relying on a timer, the controller now utilizes informers to watch for specific Node events, such as additions, deletions, or relevant field updates and triggers route synchronization only when a change actually occurs.
-->
在 Kubernetes v1.35 中，cloud-controller-manager 库为路由控制器引入基于 watch 的调谐策略。
控制器不再依赖定时器，而是利用 Informer 监听特定的 Node 事件，例如新增、删除或相关字段更新，
仅在确有变更发生时触发路由同步。

<!--
The primary benefit is a significant reduction in cloud provider API usage, which lowers the risk of hitting rate limits and reduces operational overhead. Additionally, this event-driven model improves the responsiveness of the cluster's networking layer by ensuring that route tables are updated immediately following changes in cluster topology.
-->
其主要收益是显著减少对云提供商 API 的使用，从而降低触发速率限制的风险并减少运维开销。
此外，这种事件驱动模型通过确保路由表在集群拓扑变化后立即更新，提升了集群网络层的响应速度。

<!--
This work was done as part of [KEP #5237](https://kep.k8s.io/5237) led by SIG Cloud Provider.
-->
此项工作是 [KEP #5237](https://kep.k8s.io/5237) 的一部分，由 SIG Cloud Provider 牵头完成。

<!--
### Extended toleration operators for threshold-based placement
-->
### 用于基于阈值放置的扩展容忍度运算符   {#extended-toleration-operators-for-threshold-based-placement}

<!--
Kubernetes v1.35 introduces SLA-aware scheduling by enabling workloads to express reliability requirements. The feature adds numeric comparison operators to tolerations, allowing pods to match or avoid nodes based on SLA-oriented taints such as service guarantees or fault-domain quality.
-->
Kubernetes v1.35 通过允许工作负载表达可靠性要求，引入 SLA 感知调度（SLA-aware scheduling）。
该特性为容忍度增加数值比较运算符，
让 Pod 可以依据与 SLA 相关的污点（例如服务保障或故障域质量）来匹配或避开节点。

<!--
The primary benefit is enhancing the scheduler with more precise placement. Critical workloads can demand higher-SLA nodes, while lower priority workloads can opt into lower SLA ones. This improves utilization and reduces cost without compromising reliability.
-->
其主要收益是让调度器具备更精确的放置能力。关键工作负载可要求更高 SLA 的节点，
而低优先级工作负载则可选择使用较低 SLA 的节点。这在不牺牲可靠性的前提下提升了利用率并降低成本。

<!--
This work was done as part of [KEP #5471](https://kep.k8s.io/5471) led by SIG Scheduling.
-->
此项工作是 [KEP #5471](https://kep.k8s.io/5471) 的一部分，由 SIG Scheduling 牵头完成。

<!--
### Mutable container resources when Job is suspended
-->
### Job 挂起时可变更的容器资源   {#mutable-container-resources-when-job-is-suspended}

<!--
Running batch workloads often involves trial and error with resource limits. Currently, the Job specification is immutable, meaning that if a Job fails due to an Out of Memory (OOM) error or insufficient CPU, the user cannot simply adjust the resources; they must delete the Job and create a new one, losing the execution history and status.
-->
运行批处理工作负载时，经常需要对资源限制进行反复试错。
目前 Job 规约是不可变的，这意味着当 Job 因内存不足（OOM）或 CPU 不足而失败时，
用户无法直接调整资源；他们必须删除 Job 并重新创建，从而丢失执行历史与状态信息。

<!--
Kubernetes v1.35 introduces the capability to update resource requests and limits for Jobs that are in a suspended state. Enabled via the `MutableJobPodResourcesForSuspendedJobs` feature gate, this enhancement allows users to pause a failing Job, modify its Pod template with appropriate resource values, and then resume execution with the corrected configuration.
-->
Kubernetes v1.35 引入一种能力：对处于挂起状态的 Job 更新资源请求与限制。
通过 `MutableJobPodResourcesForSuspendedJobs` 特性门控启用后，
用户可以暂停一个失败的 Job，修改其 Pod 模板中的资源值，然后在修正配置后恢复执行。

<!--
The primary benefit is a smoother recovery workflow for misconfigured jobs. By allowing in-place corrections during suspension, users can resolve resource bottlenecks without disrupting the Job's lifecycle identity or losing track of its completion status, significantly improving the developer experience for batch processing.
-->
其主要收益是让配置错误的 Job 具备更平滑的恢复流程。
通过允许在挂起期间进行原地修正，用户可以消除资源瓶颈，
而不会破坏 Job 的生命周期标识，也不会丢失完成状态追踪，
从而显著改善批处理场景下的开发体验。

<!--
This work was done as part of [KEP #5440](https://kep.k8s.io/5440) led by SIG Apps.
-->
此项工作是 [KEP #5440](https://kep.k8s.io/5440) 的一部分，由 SIG Apps 牵头完成。

<!--
## Other notable changes
-->
## 其他值得关注的变更   {#other-notable-changes}
<!--
### Continued innovation in Dynamic Resource Allocation (DRA)
-->
### 动态资源分配（DRA）的持续创新   {#continued-innovation-in-dynamic-resource-allocation-dra}

<!--
The [core functionality](https://kep.k8s.io/4381) was graduated to stable in v1.34, with the ability to turn it off. In v1.35 it is always enabled. Several alpha features have also been significantly improved and are ready for testing. We encourage users to provide feedback on these capabilities to help clear the path for their target promotion to beta in upcoming releases.
-->
[核心能力](https://kep.k8s.io/4381)在 v1.34 中进阶至稳定（GA）阶段，并允许关闭。
在 v1.35 中，此特性将始终被启用。此外，若干 Alpha 特性也得到了显著改进，已准备好进行测试。
我们鼓励用户就这些能力提供反馈，以帮助它们在后续版本中更顺利地走向 Beta。

<!--
#### Extended Resource Requests via DRA
-->
#### 通过 DRA 扩展资源请求   {#extended-resource-requests-via-dra}

<!--
Several functional gaps compared to Extended Resource requests via Device Plugins were addressed, for example scoring and reuse of devices in init containers.
-->
相较于通过设备插件（Device Plugins）实现的扩展资源请求，
当前版本补齐了若干特性差距，例如对 Init 容器中设备的打分与复用能力。

<!--
#### Device Taints and Tolerations
-->
#### 设备污点与容忍度   {#device-taints-and-tolerations}

<!--
The new "None" effect can be used to report a problem without immediately affecting scheduling or running pod. DeviceTaintRule now provides status information about an ongoing eviction. The "None" effect can be used for a "dry run" before actually evicting pods:
-->
新的 “None” 效果可用于报告问题，而不会立刻影响调度或正在运行的 Pod。
DeviceTaintRule 现在还会提供正在进行驱逐的状态信息。
在真正开始驱逐 Pod 之前，可以先用 “None” 效果进行一次“演练”（dry run）：

<!--
- Create DeviceTaintRule with "effect: None".
- Check the status to see how many pods would be evicted.
- Replace "effect: None" with "effect: NoExecute".
-->
- 使用 `effect: None` 创建 DeviceTaintRule。
- 检查状态，了解将会驱逐多少个 Pod。
- 将 `effect: None` 替换为 `effect: NoExecute`。

<!--
#### Partitionable Devices
-->
#### 可切分设备   {#partitionable-devices}

<!--
Devices belonging to the same partitionable devices may now be defined in different ResourceSlices.
-->
属于同一类可切分设备（Partitionable Devices）的设备，
现在可以定义在不同的 ResourceSlice 中。

<!--
You can read more in the [official documentation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices).
-->
更多信息请参阅[官方文档](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)。

<!--
#### Consumable Capacity, Device Binding Conditions
-->
#### 可消耗容量与设备绑定条件   {#consumable-capacity-device-binding-conditions}

<!--
Several bugs were fixed and/or more tests added.
-->
该版本修复了若干缺陷并添加了更多测试。

<!--
You can learn more about [Consumable Capacity](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#consumable-capacity) and [Binding Conditions](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-binding-conditions) in the official documentation.
-->
你可以在官方文档中进一步了解[可消耗容量](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#consumable-capacity)
与[绑定条件](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-binding-conditions)。

<!--
### Comparable resource version semantics
-->
### 可比较的资源版本语义   {#comparable-resource-version-semantics}

<!--
Kubernetes v1.35 changes the way that clients are allowed to interpret [resource versions](/docs/reference/using-api/api-concepts/#resource-versions).
-->
Kubernetes v1.35 改变了客户端被允许解释[资源版本（resource versions）](/zh-cn/docs/reference/using-api/api-concepts/#resource-versions)的方式。

<!--
Before v1.35, the only supported comparison that clients could make was to check for string equality: if two resource versions were equal, they were the same. Clients could also provide a resource version to the API server and ask the control plane to do internal comparisons, such as streaming all events since a particular resource version.
-->
在 v1.35 之前，客户端唯一受支持的比较方式是字符串相等性检查：
如果两个资源版本相等，它们就是同一个版本。
客户端也可以向 API 服务器提供资源版本，并请求控制平面执行内部比较，
例如流式获取自某个资源版本以来的所有事件。

<!--
In v1.35, all in-tree resource versions meet a new stricter definition: the values are a special form of decimal number. And, because they can be compared, clients can do their own operations to compare two different resource versions.
-->
在 v1.35 中，所有 in-tree 的资源版本都满足更严格的新定义：
它们的取值是一种特殊形式的十进制数。由于这些值可比较，
客户端也可以自行比较两个不同的资源版本。

<!--
For example, this means that a client reconnecting after a crash can detect when it has lost updates, as distinct from the case where there has been an update but no lost changes in the meantime.
-->
例如，这意味着客户端在崩溃后重新连接时，可以检测自己是否丢失了更新，
而不仅仅是判断“期间是否有更新但没有丢失变更”的情况。

<!--
This change in semantics enables other important use cases such as [storage version migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration/), performance improvements to _informers_ (a client helper concept), and controller reliability. All of those cases require knowing whether one resource version is newer than another.
-->
这一语义变更还支撑了其他重要用例，例如
[存储版本迁移](/zh-cn/docs/tasks/manage-kubernetes-objects/storage-version-migration/)、对 `informers`
（一种客户端辅助概念）的性能改进，以及控制器可靠性提升。
这些用例都需要能够判断一个资源版本是否比另一个更新。

<!--
This work was done as part of [KEP #5504](https://kep.k8s.io/5504) led by SIG API Machinery.
-->
此项工作是 [KEP #5504](https://kep.k8s.io/5504) 的一部分，由 SIG API Machinery 牵头完成。

<!--
## Graduations, deprecations, and removals in v1.35
-->
## v1.35 的升级、弃用与移除   {#deprecations-and-removals}
<!--
### Graduations to stable
-->
### 进入稳定（GA）阶段的特性   {#graduations-to-stable}

<!--
This lists all the features that graduated to stable (also known as *general availability*). For a full list of updates including new features and graduations from alpha to beta, see the release notes.
-->
这里列出所有进入稳定（也称为 **正式发布（GA）**）阶段的特性。
要获取包含新增特性与从 Alpha 升级到 Beta 等在内的完整更新列表，请参阅发布说明。

<!--
This release includes a total of 15 enhancements promoted to stable:
-->
本次发布共有 15 个增强项进入稳定（GA）阶段：

<!--
* [Add CPUManager policy option to restrict reservedSystemCPUs to system daemons and interrupt processing](https://kep.k8s.io/4540)
-->
* [为 CPUManager 策略增加选项，将 reservedSystemCPUs 限定用于系统守护进程与中断处理](https://kep.k8s.io/4540)
<!--
* [Pod Generation](https://kep.k8s.io/5067)
-->
* [Pod Generation](https://kep.k8s.io/5067)
<!--
* [Invariant Testing](https://kep.k8s.io/5468)
-->
* [Invariant Testing](https://kep.k8s.io/5468)
<!--
* [In-Place Update of Pod Resources](https://kep.k8s.io/1287)
-->
* [Pod 资源原地更新](https://kep.k8s.io/1287)
<!--
* [Fine-grained SupplementalGroups control](https://kep.k8s.io/3619)
-->
* [更细粒度的 SupplementalGroups 控制](https://kep.k8s.io/3619)
<!--
* [Add support for a drop-in kubelet configuration directory](https://kep.k8s.io/3983)
-->
* [支持 drop-in kubelet 配置目录](https://kep.k8s.io/3983)
<!--
* [Remove gogo protobuf dependency for Kubernetes API types](https://kep.k8s.io/5589)
-->
* [移除 Kubernetes API 类型对 gogo protobuf 的依赖](https://kep.k8s.io/5589)
<!--
* [kubelet image GC after a maximum age](https://kep.k8s.io/4210)
-->
* [kubelet 镜像垃圾回收：基于最大镜像年龄](https://kep.k8s.io/4210)
<!--
* [Kubelet limit of Parallel Image Pulls](https://kep.k8s.io/3673)
-->
* [kubelet 并行拉取镜像的上限](https://kep.k8s.io/3673)
<!--
* [Add a TopologyManager policy option for MaxAllowableNUMANodes](https://kep.k8s.io/4622)
-->
* [为 TopologyManager 策略增加 MaxAllowableNUMANodes 选项](https://kep.k8s.io/4622)
<!--
* [Include kubectl command metadata in http request headers](https://kep.k8s.io/859)
-->
* [在 HTTP 请求头中包含 kubectl 命令元数据](https://kep.k8s.io/859)
<!--
* [PreferSameNode Traffic Distribution (formerly PreferLocal traffic policy / Node-level topology)](https://kep.k8s.io/3015)
-->
* [PreferSameNode 流量分配（原 PreferLocal 流量策略/节点级拓扑）](https://kep.k8s.io/3015)
<!--
* [Job API managed-by mechanism](https://kep.k8s.io/4368)
-->
* [Job API 的 managed-by 机制](https://kep.k8s.io/4368)
<!--
* [Transition from SPDY to WebSockets](https://kep.k8s.io/4006)
-->
* [从 SPDY 迁移到 WebSockets](https://kep.k8s.io/4006)

<!--
### Deprecations, removals and community updates
-->
### 弃用、移除与社区更新   {#deprecations-removals-and-community-updates}

<!--
As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better
ones to improve the project's overall health. See the Kubernetes
[deprecation and removal policy](/docs/reference/using-api/deprecation-policy/) for more details on this process. Kubernetes v1.35 includes a couple of deprecations.
-->
随着 Kubernetes 的发展与成熟，为提升项目整体健康度，
一些特性可能会被弃用、移除，或被更好的方案替代。
关于这一过程的更多信息，请参阅 Kubernetes 的[弃用与移除策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
Kubernetes v1.35 包含了若干项弃用内容。

<!--
#### Ingress NGINX retirement
-->
#### Ingress NGINX 退役   {#ingress-nginx-retirement}

<!--
For years, the Ingress NGINX controller has been a popular choice for routing traffic into Kubernetes clusters. It was flexible, widely adopted, and served as the standard entry point for countless applications.
-->
多年来，Ingress NGINX 控制器一直是将流量路由到 Kubernetes 集群的热门选择。
它灵活、被广泛采用，并长期作为无数应用的标准入口。

<!--
However, maintaining the project has become unsustainable. With a severe shortage of maintainers and mounting technical debt, the community recently made the difficult decision to retire it. This isn't strictly part of the v1.35 release, but it's such an important change that we wanted to highlight it here.
-->
然而，项目维护已经变得难以为继。由于维护者严重短缺且技术债不断累积，
社区近期做出了艰难决定：让该项目退役。这虽然并非严格意义上的 v1.35 发布内容，
但它影响重大，我们希望在这里特别强调。

<!--
Consequently, the Kubernetes project announced that Ingress NGINX will receive only best-effort maintenance until **March 2026**. After this date, it will be archived with no further updates. The recommended path forward is to migrate to the [Gateway API](https://gateway-api.sigs.k8s.io/), which offers a more modern, secure, and extensible standard for traffic management.
-->
因此，Kubernetes 项目宣布 Ingress NGINX 将仅提供尽力而为的维护，
直至 **2026 年 3 月**。
此日期之后，该项目将归档并不再更新。
推荐的后续路径是迁移到 [Gateway API](https://gateway-api.sigs.k8s.io/)，
它提供了更现代、更安全且更可扩展的流量管理标准。

<!--
You can find more in the [official blog post](/blog/2025/11/11/ingress-nginx-retirement/).
-->
更多信息请参阅[官方博客文章](/blog/2025/11/11/ingress-nginx-retirement/)。

<!--
#### Removal of cgroup v1 support
-->
#### 移除对 cgroup v1 的支持   {#removal-of-cgroup-v1-support}

<!--
When it comes to managing resources on Linux nodes, Kubernetes has historically relied on cgroups (control groups). While the original cgroup v1 was functional, it was often inconsistent and limited. That is why Kubernetes introduced support for cgroup v2 back in v1.25, offering a much cleaner, unified hierarchy and better resource isolation.
-->
在 Linux 节点的资源管理方面，Kubernetes 历史上依赖 cgroups（control groups）。
尽管最初的 cgroup v1 可以工作，但它常常不一致且存在局限。
因此，Kubernetes 在 v1.25 引入对 cgroup v2 的支持，
提供了更干净的统一层级结构与更好的资源隔离能力。

<!--
Because cgroup v2 is now the modern standard, Kubernetes is ready to retire the legacy cgroup v1 support in v1.35. This is an important notice for cluster administrators: if you are still running nodes on older Linux distributions that don't support cgroup v2, your `kubelet` will fail to start. To avoid downtime, you will need to migrate those nodes to systems where cgroup v2 is enabled.
-->
由于 cgroup v2 现已成为现代标准，
Kubernetes 准备在 v1.35 中退役遗留的 cgroup v1 支持。
这对集群管理员而言是一项重要提醒：
如果你仍在运行不支持 cgroup v2 的旧 Linux 发行版节点，
你的 `kubelet` 将无法启动。
为避免停机，你需要将这些节点迁移到启用了 cgroup v2 的系统上。

<!--
To learn more, read [about cgroup v2](/docs/concepts/architecture/cgroups/);  
you can also track the switchover work via [KEP-5573: Remove cgroup v1 support](https://kep.k8s.io/5573).  
-->
要了解更多信息，请阅读[关于 cgroup v2](/zh-cn/docs/concepts/architecture/cgroups/)；  
你也可以通过 [KEP-5573：移除 cgroup v1 支持](https://kep.k8s.io/5573) 跟踪切换工作。  

<!--
#### Deprecation of ipvs mode in kube-proxy
-->
#### kube-proxy 中 ipvs 模式的弃用   {#deprecation-of-ipvs-mode-in-kube-proxy}

<!--
Years ago, Kubernetes adopted the [`ipvs`](/docs/reference/networking/virtual-ips/#proxy-mode-ipvs) mode in `kube-proxy` to provide faster load balancing than the standard [`iptables`](/docs/reference/networking/virtual-ips/#proxy-mode-iptables). While it offered a performance boost, keeping it in sync with evolving networking requirements created too much technical debt and complexity.
-->
多年前，Kubernetes 在 `kube-proxy` 中采用[`ipvs`](/zh-cn/docs/reference/networking/virtual-ips/#proxy-mode-ipvs) 模式，
以提供比标准[`iptables`](/zh-cn/docs/reference/networking/virtual-ips/#proxy-mode-iptables) 更快的负载均衡。
虽然它带来了性能提升，但为了跟上不断演进的网络需求，
维护其一致性所带来的技术债与复杂度已过高。

<!--
Because of this maintenance burden, Kubernetes v1.35 deprecates `ipvs` mode. Although the mode remains available in this release, `kube-proxy` will now emit a warning on startup when configured to use it. The goal is to streamline the codebase and focus on modern standards. For Linux nodes, you should begin transitioning to [`nftables`](/docs/reference/networking/virtual-ips/#proxy-mode-nftables), which is now the recommended replacement.
-->
由于这一维护负担，Kubernetes v1.35 弃用 `ipvs` 模式。尽管该模式在本次发布中仍可用，
但当 `kube-proxy` 被配置为使用该模式时，将在启动时发出警告。
该弃用的目标是精简代码库并聚焦于现代标准。
对于 Linux 节点，你应开始迁移到[`nftables`](/zh-cn/docs/reference/networking/virtual-ips/#proxy-mode-nftables)，
它现在是推荐的替代方案。

<!--
You can find more in [KEP-5495: Deprecate ipvs mode in kube-proxy](https://kep.k8s.io/5495).
-->
更多信息请参阅 [KEP-5495：弃用 kube-proxy 的 ipvs 模式](https://kep.k8s.io/5495)。

<!--
#### Final call for containerd v1.X
-->
#### containerd v1.X 的最后通告   {#final-call-for-containerd-v1x}

<!--
While Kubernetes v1.35 still supports containerd 1.7 and other LTS releases, this is the final version with such support. The SIG Node community has designated v1.35 as the last release to support the containerd v1.X series.
-->
尽管 Kubernetes v1.35 仍支持 containerd 1.7 与其他 LTS 版本，
但这是最后一个提供此类支持的版本。
SIG Node 社区已将 v1.35 指定为最后一个支持 containerd v1.X 系列的版本。

<!--
This serves as an important reminder: before upgrading to the next Kubernetes version, you must switch to containerd 2.0 or later. To help identify which nodes need attention, you can monitor the `kubelet_cri_losing_support` metric within your cluster.
-->
这是一条重要提醒：
在升级到下一个 Kubernetes 版本之前，你必须切换到 containerd 2.0 或更高版本。
为帮助识别哪些节点需要关注，你可以在集群中监控 `kubelet_cri_losing_support` 指标。

<!--
You can find more in the [official blog post](/blog/2025/09/12/kubernetes-v1-34-cri-cgroup-driver-lookup-now-ga/#announcement-kubernetes-is-deprecating-containerd-v1-y-support) or in [KEP-4033: Discover cgroup driver from CRI](https://kep.k8s.io/4033).
-->
更多信息可参阅[官方博客文章](/blog/2025/09/12/kubernetes-v1-34-cri-cgroup-driver-lookup-now-ga/#announcement-kubernetes-is-deprecating-containerd-v1-y-support)，
或阅读 [KEP-4033：从 CRI 发现 cgroup driver](https://kep.k8s.io/4033)。

<!--
#### Improved Pod stability during `kubelet` restarts
-->
#### `kubelet` 重启期间的 Pod 稳定性改进   {#improved-pod-stability-during-kubelet-restarts}

<!--
Previously, restarting the `kubelet` service often caused a temporary disruption in Pod status. During a restart, the kubelet would reset container states, causing healthy Pods to be marked as `NotReady` and removed from load balancers, even if the application itself was still running correctly.
-->
此前，重启 `kubelet` 服务往往会造成 Pod 状态的短暂波动。在重启期间，kubelet 会重置容器状态，
导致健康的 Pod 被标记为 `NotReady` 并从负载均衡器中移除，即便应用本身仍在正常运行。

<!--
To address this reliability issue, this behavior has been corrected to ensure seamless node maintenance. The `kubelet` now properly restores the state of existing containers from the runtime upon startup. This ensures that your workloads remain `Ready` and traffic continues to flow uninterrupted during `kubelet` restarts or upgrades.
-->
为解决这一可靠性问题，该行为已被修正，以确保节点维护更平滑。
`kubelet` 现在会在启动时从运行时中正确恢复现有容器状态，
确保你的工作负载保持 `Ready`，并使流量在 `kubelet` 重启或升级期间持续不中断。

<!--
You can find more in [KEP-4781: Fix inconsistent container ready state after kubelet restart](https://kep.k8s.io/4871).
-->
更多信息请参阅
[KEP-4781：修复 kubelet 重启后容器就绪状态不一致问题](https://kep.k8s.io/4871)。

<!--
## Release notes
-->
## 发布说明   {#release-notes}

<!--
Check out the full details of the Kubernetes v1.35 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md).
-->
请在我们的[发布说明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md)
中查看 Kubernetes v1.35 发布的完整细节。

<!--
## Availability
-->
## 可用性   {#availability}

<!--
Kubernetes v1.35 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.35.0) or on the [Kubernetes download page](/releases/download/).
-->
Kubernetes v1.35 可通过[GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.35.0)
或 [Kubernetes 下载页面](/releases/download/)获取。

<!--
To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). You can also easily install v1.35 using [kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
-->
要开始使用 Kubernetes，请查看这些[交互式教程](/zh-cn/docs/tutorials/)，
或使用 [minikube](https://minikube.sigs.k8s.io/) 在本地运行 Kubernetes 集群。
你也可以使用 [kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
轻松安装 v1.35。

<!--
## Release team
-->
## 发布团队   {#release-team}

<!--
Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is made up of dedicated community volunteers who work together to build the many pieces that make up the Kubernetes releases you rely on. This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.
-->
Kubernetes 之所以成为可能，离不开社区的支持、承诺与辛勤付出。
每个发布团队由一群投入的社区志愿者组成，他们一起构建你所依赖的 Kubernetes 发布版本的诸多部分。
这需要来自社区各个角落的专业能力：从代码本身到文档与项目管理。

<!--
[We honor the memory of Han Kang](https://github.com/cncf/memorials/blob/main/han-kang.md), a long-time contributor and respected engineer whose technical excellence and infectious enthusiasm left a lasting impact on the Kubernetes community. Han was a significant force within SIG Instrumentation and SIG API Machinery, earning a [2021 Kubernetes Contributor Award](https://www.kubernetes.dev/community/awards/2021/) for his critical work and sustained commitment to the project's core stability. Beyond his technical contributions, Han was deeply admired for his generosity as a mentor and his passion for building connections among people. He was known for "opening doors" for others, whether guiding new contributors through their first pull requests or supporting colleagues with patience and kindness. Han’s legacy lives on through the engineers he inspired, the robust systems he helped build, and the warm, collaborative spirit he fostered within the cloud native ecosystem.
-->
我们在此缅怀[Han Kang](https://github.com/cncf/memorials/blob/main/han-kang.md)
——一位长期贡献者与备受尊敬的工程师，他的技术卓越与感染力十足的热情，
为 Kubernetes 社区留下了深远影响。Han 是 SIG Instrumentation 与 SIG API Machinery 中的重要力量，
并因其关键工作与对项目核心稳定性的持续投入，
获得了[2021 Kubernetes Contributor Award](https://www.kubernetes.dev/community/awards/2021/)。
除技术贡献之外，Han 也因其作为导师的慷慨与联结人们的热情而广受敬重。
他以“为他人打开大门”而闻名——无论是带领新贡献者完成第一次 PR，
还是以耐心与善意支持同事。Han 的遗产将通过他所激励的工程师、他参与构建的健壮系统，
以及他在云原生生态中所塑造的温暖协作精神延续下去。

<!--
We would like to thank the entire [Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.35/release-team.md) for the hours spent hard at work to deliver the Kubernetes v1.35 release to our community. The Release Team's membership ranges from first-time shadows to returning team leads with experience forged over several release cycles. We are incredibly grateful to our Release Lead, [Drew Hagen](https://github.com/drewhagen), whose hands-on guidance and vibrant energy not only navigated us through complex challenges but also fueled the community spirit behind this successful release.
-->
我们感谢整个[发布团队](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.35/release-team.md)
为向社区交付 Kubernetes v1.35 所付出的辛勤时间。
发布团队成员既有第一次参与的 shadow，也有历经多轮发布周期、经验丰富的回归 team lead。
我们尤其感谢发布负责人[Drew Hagen](https://github.com/drewhagen)：
他既以务实指导带我们穿越复杂挑战，也以充沛能量点燃了这次成功发布背后的社区精神。

<!--
## Project velocity
-->
## 项目活跃度   {#project-velocity}

<!--
The CNCF K8s [DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.
-->
CNCF K8s 的[DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)
项目汇总了与 Kubernetes 及其各子项目活跃度相关的一系列有趣数据点。
这些数据涵盖从个人贡献到参与贡献公司的数量等多个方面，
体现了推动该生态演进所投入努力的深度与广度。

<!--
During the v1.35 release cycle, which spanned 14 weeks from 15th September 2025 to 17th December 2025, Kubernetes received contributions from as many as 85 different companies and 419 individuals. In the wider cloud native ecosystem, the figure goes up to 281 companies, counting 1769 total contributors.
-->
在 v1.35 发布周期（从 2025 年 9 月 15 日到 2025 年 12 月 17 日，共 14 周）期间，
Kubernetes 收到了来自多达 85 家公司与 419 名个人的贡献。
在更广泛的云原生生态中，这一数字上升到 281 家公司，共计 1769 名贡献者。

<!--
Note that "contribution" counts when someone makes a commit, code review, comment, creates an issue or PR, reviews a PR (including blogs and documentation) or comments on issues and PRs.  
If you are interested in contributing, visit [Getting Started](https://www.kubernetes.dev/docs/guide/#getting-started) on our contributor website.
-->
请注意，这里的“贡献”统计包括：提交 commit、进行代码评审、发表评论、创建 Issue 或 PR、
评审 PR（包括博客与文档）以及对 Issue 与 PR 的评论等。  
如果你有兴趣参与贡献，请访问贡献者网站上的[Getting Started](https://www.kubernetes.dev/docs/guide/#getting-started)。

<!--
Sources for this data:
-->
数据来源：

<!--
* [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1757890800000&to=1765929599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)  
-->
* [贡献 Kubernetes 的公司](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1757890800000&to=1765929599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)

<!--
* [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1757890800000&to=1765929599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)
-->
* [整体生态的贡献](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1757890800000&to=1765929599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

<!--
## Events update
-->
## 活动更新   {#events-update}

<!--
Explore upcoming Kubernetes and cloud native events, including KubeCon \+ CloudNativeCon, KCD, and other notable conferences worldwide. Stay informed and get involved with the Kubernetes community\!
-->
了解即将到来的 Kubernetes 与云原生活动，包括 KubeCon + CloudNativeCon、KCD 与全球其他重要会议。
保持关注并参与 Kubernetes 社区！

<!--
**February 2026**
-->
**2026 年 2 月**

<!--
- [**KCD - Kubernetes Community Days:  New Delhi**](https://www.kcddelhi.com/index.html): Feb 21, 2026 | New Delhi, India
-->
- [**KCD - Kubernetes Community Days:  New Delhi**](https://www.kcddelhi.com/index.html)：2026 年 2 月 21 日｜印度 New Delhi

<!--
- [**KCD - Kubernetes Community Days:  Guadalajara**](https://community.cncf.io/events/details/cncf-kcd-guadalajara-presents-kcd-guadalajara-open-source-contributor-summit/cohost-kcd-guadalajara): Feb 23, 2026 | Guadalajara, Mexico
-->
- [**KCD：Guadalajara**](https://community.cncf.io/events/details/cncf-kcd-guadalajara-presents-kcd-guadalajara-open-source-contributor-summit/cohost-kcd-guadalajara)：2026 年 2 月 23 日｜墨西哥 Guadalajara

<!--
**March 2026**
-->
**2026 年 3 月**

<!--
- [**KubeCon + CloudNativeCon Europe 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/): Mar 23-26, 2026 | Amsterdam, Netherlands
-->
- [**KubeCon + CloudNativeCon Europe 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/)：2026 年 3 月 23-26 日｜荷兰 Amsterdam

<!--
**May 2026**
-->
**2026 年 5 月**

<!--
- [**KCD - Kubernetes Community Days:  Toronto**](https://community.cncf.io/events/details/cncf-kcd-toronto-presents-kcd-toronto-canada-2026/): May 13, 2026 | Toronto, Canada
-->
- [**KCD - Kubernetes Community Days:  Toronto**](https://community.cncf.io/events/details/cncf-kcd-toronto-presents-kcd-toronto-canada-2026/)：2026 年 5 月 13 日｜加拿大 Toronto

<!--
- [**KCD - Kubernetes Community Days:  Helsinki**](https://cloudnativefinland.org/kcd-helsinki-2026/): May 20, 2026 | Helsinki, Finland
-->
- [**KCD - Kubernetes Community Days:  Helsinki**](https://cloudnativefinland.org/kcd-helsinki-2026/)：2026 年 5 月 20 日｜芬兰 Helsinki

<!--
**June 2026**
-->
**2026 年 6 月**

<!--
- [**KubeCon + CloudNativeCon China 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-china/): Jun 10-11, 2026 | Hong Kong
-->
- [**KubeCon + CloudNativeCon China 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-china/)：2026 年 6 月 10-11 日｜中国香港

<!--
- [**KubeCon + CloudNativeCon India 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-india/): Jun 18-19, 2026 | Mumbai, India
-->
- [**KubeCon + CloudNativeCon India 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-india/)：2026 年 6 月 18-19 日｜印度 Mumbai

<!--
- [**KCD - Kubernetes Community Days:  Kuala Lumpur**](https://community.cncf.io/kcd-kuala-lumpur-2026/): Jun 27, 2026 | Kuala Lumpur, Malaysia
-->
- [**KCD：Kuala Lumpur**](https://community.cncf.io/kcd-kuala-lumpur-2026/)：2026 年 6 月 27 日｜马来西亚 Kuala Lumpur

<!--
**July 2026**
-->
**2026 年 7 月**

<!--
- [**KubeCon + CloudNativeCon Japan 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan/): Jul 29-30, 2026 | Yokohama, Japan
-->
- [**KubeCon + CloudNativeCon Japan 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan/)：2026 年 7 月 29-30 日｜日本 Yokohama

<!--
You can find the latest event details [here](https://community.cncf.io/events/#/list).
-->
你可以在[此处](https://community.cncf.io/events/#/list)查看最新活动详情。

<!--
## Upcoming release webinar
-->
## 即将举行的发布网络研讨会   {#upcoming-release-webinar}

<!--
Join members of the Kubernetes v1.35 Release Team on **Wednesday, January 14, 2026, at 5:00 PM (UTC)** to learn about the release highlights of this release. For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v135-release/) on the CNCF Online Programs site.
-->
欢迎在 **2026 年 1 月 14 日（星期三）17:00（UTC）** 与 Kubernetes v1.35 发布团队成员一起，
了解本次发布的重点亮点。有关更多信息与注册方式，请访问 CNCF Online Programs 网站上的[活动页面](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v135-release/)。

<!--
## Get involved
-->
## 参与其中   {#get-involved}

<!--
The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.
-->
参与 Kubernetes 最简单的方式之一，是加入与你兴趣相符的众多[特别兴趣小组（Special Interest Groups，SIG）](https://github.com/kubernetes/community/blob/master/sig-list.md)
之一。你想向 Kubernetes 社区发布一些内容吗？欢迎在我们每周的[社区会议](https://github.com/kubernetes/community/tree/master/communication)
上发声，也可以通过以下渠道参与交流。感谢你持续的反馈与支持。

<!--
* Follow us on Bluesky [@Kubernetesio](https://bsky.app/profile/kubernetes.io) for the latest updates
-->
* 在 Bluesky 关注我们：[@Kubernetesio](https://bsky.app/profile/kubernetes.io)，获取最新动态

<!--
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
-->
* 在 [Discuss](https://discuss.kubernetes.io/) 加入社区讨论

<!--
* Join the community on [Slack](http://slack.k8s.io/)
-->
* 在 [Slack](http://slack.k8s.io/) 加入社区

<!--
* Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
-->
* 在 [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes) 提问（或解答问题）

<!--
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
-->
* 分享你的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)

<!--
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
-->
* 在[博客](https://kubernetes.io/blog/)阅读 Kubernetes 的更多动态

<!--
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
* 了解更多关于 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team)的信息
