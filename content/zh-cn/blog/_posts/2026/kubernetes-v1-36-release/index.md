---  
layout: blog
title: "Kubernetes v1.36：ハル (Haru)"
date: 2026-04-22
evergreen: true
slug: kubernetes-v1-36-release
release_announcement:
  minor_version: "1.36"
author: >
  [Kubernetes v1.36 发布团队](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.36/release-team.md)
translator: >
  [Paco Xu](https://github.com/pacoxu)(DaoCloud)
---

<!--
layout: blog
title: "Kubernetes v1.36: ハル (Haru)"
date: 2026-04-22
evergreen: true
slug: kubernetes-v1-36-release
release_announcement:
  minor_version: "1.36"
author: >
  [Kubernetes v1.36 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.36/release-team.md)
-->

<!--
**Editors:** Chad M. Crowell, Kirti Goyal, Sophia Ugochukwu, Swathi Rao, Utkarsh Umre
-->
**编辑**：Chad M. Crowell、Kirti Goyal、Sophia Ugochukwu、Swathi Rao、Utkarsh Umre

<!--
Similar to previous releases, the release of Kubernetes v1.36 introduces new stable, beta, and alpha features. The consistent delivery of high-quality releases underscores the strength of our development cycle and the vibrant support from our community.
-->
与之前的版本类似，Kubernetes v1.36 的发布引入了新的稳定（GA）、Beta 和 Alpha 特性。
持续交付高质量版本，凸显了我们开发周期的韧性，以及社区充满活力的支持。

<!--
This release consists of 70 enhancements. Of those enhancements, 18 have graduated to Stable, 25 are entering Beta, and 25 have graduated to Alpha.
-->
此版本包含 70 项增强。其中，18 项已进阶至稳定阶段，25 项进入 Beta 阶段，25 项进阶至 Alpha 阶段。

<!--
There are also some [deprecations and removals](#deprecations-removals-and-community-updates) in this release; make sure to read about those.
-->
本次发布还包含一些[弃用与移除](#deprecations-removals-and-community-updates)内容，请务必阅读相关说明。

<!--
## Release theme and logo
-->
## 发布主题与徽标   {#release-theme-and-logo}

<!--
Figure src="k8s-v1.36.svg" alt="Kubernetes v1.36 Haru logo: a hex badge with the title Haru in flowing script beneath v1.36; Mount Fuji rises on the right, its peak lit red with streaks of pale snow, the Japanese calligraphy 晴れに翔け brushed down its slope; a white Kubernetes helm floats in the blue sky to the left among stylised clouds in the ukiyo-e manner; in the foreground stand two cats as paired guardians, a grey-and-white cat on the left and a ginger tabby on the right, each wearing a collar with a small blue Kubernetes helm charm" class="release-logo"
-->
{{< figure src="k8s-v1.36.svg" alt="Kubernetes v1.36 Haru 徽标：一个六边形徽章，v1.36 下方以流畅字体写着 Haru；富士山耸立在右侧，山顶呈红色并有淡雪纹理，日文书法“晴れに翔け”沿山坡书写；左侧蓝天中漂浮着白色 Kubernetes 舵轮，周围是浮世绘风格的云；前景中有两只作为成对守护者的猫，左侧为灰白猫，右侧为姜黄色虎斑猫，各自戴着带有蓝色 Kubernetes 舵轮小饰物的项圈" class="release-logo" >}}

<!--
We open 2026 with Kubernetes v1.36, a release that arrives as the season turns and the light shifts on the mountain. ハル (_Haru_) is a sound in Japanese that carries many meanings; among those we hold closest are 春 (spring), 晴れ (_hare_, clear skies), and 遥か (_haruka_, far-off, distant). A season, a sky, and a horizon. You will find all three in what follows.
-->
我们以 Kubernetes v1.36 开启 2026 年。
这个版本到来之时，季节更迭，山间光影流转。
ハル（__Haru__）在日语中富含多重意象；
其中我们最贴近的含义包括：春（__spring__）、晴れ（__hare__，晴空）和遥か（__haruka__，遥远）。
一个季节、一片天空和一条地平线。你将在接下来的内容中看到这三者。

<!--
The logo, created by [avocadoneko / Natsuho Ide](https://x.com/avocadoneko), draws inspiration from [Katsushika Hokusai](https://en.wikipedia.org/wiki/Hokusai)'s [_Thirty-six Views of Mount Fuji_](https://en.wikipedia.org/wiki/Thirty-six_Views_of_Mount_Fuji) (富嶽三十六景, _Fugaku Sanjūrokkei_), the same series that gave the world [_The Great Wave off Kanagawa_](https://en.wikipedia.org/wiki/The_Great_Wave_off_Kanagawa). Our v1.36 logo reimagines one of the series' most celebrated prints, [_Fine Wind, Clear Morning_](https://en.wikipedia.org/wiki/Fine_Wind,_Clear_Morning) (凱風快晴, _Gaifū Kaisei_), also known as Red Fuji (赤富士, _Aka Fuji_): the mountain lit red in a summer dawn, bare of snow after the long thaw. Thirty-six views felt like a fitting number to sit with at v1.36, and a reminder that even Hokusai didn't stop there.<sup>1</sup> Keeping watch over the scene is the Kubernetes helm, set into the sky alongside the mountain.
-->
该版本徽标由 [avocadoneko / Natsuho Ide](https://x.com/avocadoneko) 创作，
灵感来自[葛饰北斋](https://en.wikipedia.org/wiki/Hokusai)的
[《富嶽岳三十六景》](https://en.wikipedia.org/wiki/Thirty-six_Views_of_Mount_Fuji)
（富三十六景，__Fugaku Sanjūrokkei__）。
这一系列也诞生了了[__神奈川冲浪里__](https://en.wikipedia.org/wiki/The_Great_Wave_off_Kanagawa)这样的传世杰作。
我们的 v1.36 徽标重新诠释了这个系列中最著名的作品之一：
[《凯风快晴》](https://en.wikipedia.org/wiki/Fine_Wind,_Clear_Morning)
（凱風快晴，__Gaifū Kaisei__），又名赤富士（__Aka Fuji__）：
夏日黎明中被照亮成红色、经历漫长融雪后已不覆雪的山。
三十六景与 v1.36 相映成趣，也提醒我们即便是北斋也没有止步于此。<sup>1</sup>
Kubernetes 舵轮守望着这一幕，与山一同融入天空。

<!--
At the foot of Fuji sit Stella (left) and Nacho (right), two cats with the Kubernetes helm on their collars, standing in for the role of [_komainu_](https://en.wikipedia.org/wiki/Komainu), the paired lion-dog guardians that watch over Japanese shrines. Paired, because nothing is guarded alone. Stella and Nacho stand in for a very much larger set of paws: the SIGs and working groups, the maintainers and reviewers, the people behind docs, blogs, and translations, the release team, first-time contributors taking their first steps, and lifelong contributors returning season after season. Kubernetes v1.36 is, as always, held up by many hands.
-->
富士山脚下坐着 Stella（左）和 Nacho（右），
两只猫的项圈上带有 Kubernetes 舵轮，
象征着[__狛犬__](https://en.wikipedia.org/wiki/Komainu)的角色：
守护日本神社的一对狮犬守护像。
它们成对出现，因为没有什么是独自守护的。
Stella 和 Nacho 代表着远比这两对爪子庞大得多的群体：
SIG 和工作组、维护者和评审者、文档、博客与翻译背后的人们、发布团队、
迈出第一步的首次贡献者，以及年复一年回归的长期贡献者。
一如既往，Kubernetes v1.36 由众多双手托举。

<!--
Brushed across Red Fuji in the logo is the calligraphy 晴れに翔け (_hare ni kake_), "soar into clear skies". It is the first half of a couplet that was too long to fit on the mountain:
-->
徽标中横跨赤富士的书法是“晴れに翔け”（__hare ni kake__），
意为“翱翔于晴空”。
这是一个对句的前半句，完整对句太长，无法完全放在山上：

<!--
> **晴れに翔け、未来よ明け**\
> _hare ni kake, asu yo ake_\
> "Soar into clear skies; toward tomorrow's sunrise."<sup>2</sup>
-->
> **晴れに翔け、未来よ明け**\
> _hare ni kake, asu yo ake_\
> “翱翔于晴空；迎向明日朝阳。”<sup>2</sup>

<!--
That is the wish we carry for this release: to soar into clear skies, for the release itself, for the project, and for everyone who ships it together. The dawn breaking over Red Fuji is not an ending but a passage: this release carries us to the next, and that one to the one after, on toward horizons far beyond what any single view can hold.
-->
这就是我们寄托于此版本的愿望：
让这个版本、这个项目，以及共同交付它的每个人，都能翱翔于晴空。
赤富士上破晓的晨光不是终点，而是一条通往未来的道路：
这个版本把我们带向下一个版本，而下一个版本又会通向再下一个版本，
一路迈向任何单一视角都无法穷尽的遥远地平线。

<!--
<sub>1. The series was so popular that Hokusai added ten more prints, bringing the total to forty-six.</sub>\
<sub>2. 未来 means "the future" in its widest sense, not just tomorrow but everything still to come. It is usually read _mirai_; here it takes the informal reading _asu_.</sub>
-->
<sub>1. 这个系列非常受欢迎，北斋又增加了十幅版画，使总数达到四十六幅。</sub>\
<sub>2. “未来”表示最宽泛意义上的“未来”，不只是明天，还包括一切尚未到来的事物。它通常读作 __mirai__；这里采用非正式读法 __asu__。</sub>

<!--
## Spotlight on key updates
-->
## 重点更新速览   {#spotlight-on-key-updates}

<!--
Kubernetes v1.36 is packed with new features and improvements. Here are a
few select updates the Release Team would like to highlight!
-->
Kubernetes v1.36 带来了大量新特性与改进。下面是发布团队希望重点介绍的几个更新！

<!--
### Stable: Fine-grained API authorization
-->
### 稳定（GA）阶段：细粒度 API 鉴权   {#stable-fine-grained-api-authorization}

<!--
On behalf of Kubernetes SIG Auth and SIG Node, we are pleased to announce the
graduation of fine-grained `kubelet` API authorization to General Availability
(GA) in Kubernetes v1.36!
-->
我们很高兴代表 Kubernetes SIG Auth 和 SIG Node 宣布：
细粒度 `kubelet` API 鉴权在 Kubernetes v1.36 中进阶至正式发布（GA）！

<!--
The `KubeletFineGrainedAuthz` feature gate was introduced as an opt-in alpha feature
in Kubernetes v1.32, then graduated to beta (enabled by default) in v1.33.
Now, the feature is generally available.
This feature enables more precise, least-privilege access control over the kubelet's
HTTPS API replacing the need to grant the overly broad nodes/proxy permission for
common monitoring and observability use cases.
-->
`KubeletFineGrainedAuthz` 特性门控在 Kubernetes v1.32 中作为可选的 Alpha 特性引入，
随后在 v1.33 中进阶为 Beta（默认启用）。
现在，此特性已正式发布（GA）。
该特性针对 kubelet 的 HTTPS API 实现了更精确、符合最小权限原则的访问控制，
替代了在常见监控和可观测性用例中授予过于宽泛的 nodes/proxy 权限的需求。

<!--
​​This work was done as a part of [KEP #2862](https://kep.k8s.io/2862) led by SIG Auth and SIG Node.
-->
此项工作是 [KEP #2862](https://kep.k8s.io/2862) 的一部分，由 SIG Auth 和 SIG Node 牵头完成。

<!--
### Beta: Resource health status
-->
### Beta：资源健康状态   {#beta-resource-health-status}

<!--
Before the v1.34 release, Kubernetes lacked a native way to report the health of allocated devices,
making it difficult to diagnose Pod crashes caused by hardware failures.
Building on the initial alpha release in v1.31 which focused on Device Plugins,
Kubernetes v1.36 expands this feature by promoting the `allocatedResourcesStatus`
field within the `.status` for each Pod (to beta). This field provides a unified health
reporting mechanism for all specialized hardware.
-->
在 v1.34 发布之前，Kubernetes 缺少一种原生方式来报告已分配设备的健康状况，
这使得诊断由硬件故障导致的 Pod 崩溃变得困难。
在 v1.31 中聚焦于设备插件的初始 Alpha 版本基础上，
Kubernetes v1.36 通过将每个 Pod 的 `.status` 中的 `allocatedResourcesStatus`
字段提升至 Beta，扩展了这一特性。
此字段为所有专用硬件提供统一的健康报告机制。

<!--
Users can now run `kubectl describe pod` to determine if a container's crash loop is
due to an `Unhealthy` or `Unknown` device status, regardless of whether the hardware was
provisioned via traditional plugins or the newer DRA framework.
This enhanced visibility allows administrators and automated controllers to
quickly identify faulty hardware and streamline the recovery of high-performance workloads.
-->
用户现在可以运行 `kubectl describe pod` 来判断容器的崩溃循环是否由
`Unhealthy` 或 `Unknown` 设备状态导致，无论相关硬件是通过传统插件还是较新的 DRA 框架制备。
这种增强的可见性使管理员和自动化控制器能够快速识别故障硬件，
并简化高性能工作负载的恢复流程。

<!--
This work was done as part of [KEP #4680](https://kep.k8s.io/4680) led by SIG Node.
-->
此项工作是 [KEP #4680](https://kep.k8s.io/4680) 的一部分，由 SIG Node 牵头完成。

<!--
### Alpha: Workload Aware Scheduling (WAS) features
-->
### Alpha：工作负载感知调度（WAS）特性   {#alpha-workload-aware-scheduling-was-features}

<!--
Previously, the Kubernetes scheduler and job controllers managed pods as independent units,
often leading to fragmented scheduling or resource waste for complex, distributed workloads.
Kubernetes v1.36 introduces a comprehensive suite of Workload Aware Scheduling (WAS) features in Alpha,
natively integrating the Job controller with a revised [Workload](/docs/concepts/workloads/workload-api/)
API and a new decoupled PodGroup API,
to treat related pods as a single logical entity.
-->
此前，Kubernetes 调度器和 Job 控制器将 Pod 作为独立单元进行管理，
这常常会导致复杂分布式工作负载出现碎片化调度或资源浪费。
Kubernetes v1.36 引入了一整套 Alpha 阶段的工作负载感知调度（Workload-Aware Scheduling，WAS）特性，
将 Job 控制器与修订后的 [Workload](/docs/concepts/workloads/workload-api/)
API 以及新的解耦 PodGroup API 原生集成，
从而把相关 Pod 作为单个逻辑实体处理。

<!--
Kubernetes v1.35 already supported [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/) by requiring
a minimum number of pods to be schedulable before any were bound to nodes.
v1.36 goes further with a new PodGroup scheduling cycle that evaluates the entire group atomically,
either all pods in the group are bound together, or none are.
-->
Kubernetes v1.35 已经支持[编组调度](/docs/concepts/scheduling-eviction/gang-scheduling/)：
它要求在任何 Pod 绑定到节点之前，至少有指定数量的 Pod 可被调度。
v1.36 更进一步，引入新的 PodGroup 调度周期，以原子方式评估整个组：
组内所有 Pod 要么一起绑定，要么一个都不绑定。

<!--
This work was done across several KEPs (including [#4671](https://kep.k8s.io/4671), [#5547](https://kep.k8s.io/5547), [#5832](https://kep.k8s.io/5832), [#5732](https://kep.k8s.io/5732), and [#5710](https://kep.k8s.io/5710)) led by SIG Scheduling and SIG Apps.
-->
此项工作跨越多个 KEP（包括 [#4671](https://kep.k8s.io/4671)、[#5547](https://kep.k8s.io/5547)、
[#5832](https://kep.k8s.io/5832)、[#5732](https://kep.k8s.io/5732) 和 [#5710](https://kep.k8s.io/5710)），
由 SIG Scheduling 和 SIG Apps 牵头完成。

<!--
## Features graduating to Stable
-->
## 进阶至稳定阶段的特性   {#features-graduating-to-stable}

<!--
_This is a selection of some of the improvements that are now stable following the v1.36 release._
-->
**以下列出 v1.36 发布后进入稳定（GA）阶段的一些改进。**

<!--
### Volume group snapshots
-->
### 卷组快照   {#volume-group-snapshots}

<!--
After several cycles in beta, VolumeGroupSnapshot support reaches General Availability (GA) in Kubernetes v1.36.
This feature allows you to take crash-consistent snapshots across multiple PersistentVolumeClaims simultaneously.
The support for volume group snapshots relies on a set of [extension APIs for group snapshots](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis).
These APIs allow users to take crash consistent snapshots for a set of volumes.
A key aim is to allow you to restore that set of snapshots to new volumes and recover your workload based on
a crash consistent recovery point.
-->
经过数个 Beta 周期后，VolumeGroupSnapshot 支持在 Kubernetes v1.36 中达到正式发布（GA）。
此特性允许你同时为多个 PersistentVolumeClaim 创建崩溃一致性快照。
卷组快照支持依赖一组用于组快照的[扩展 API](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis)。
这些 API 允许用户为一组卷创建崩溃一致性快照。
一个关键目标是允许你将这组快照恢复到新卷，
并基于某个崩溃一致性恢复点恢复工作负载。

<!--
This work was done as part of [KEP #3476](https://kep.k8s.io/3476) led by SIG Storage.
-->
此项工作是 [KEP #3476](https://kep.k8s.io/3476) 的一部分，由 SIG Storage 牵头完成。

<!--
### Mutable volume attach limits
-->
### 可变卷挂载限制   {#mutable-volume-attach-limits}

<!--
In Kubernetes v1.36, the _mutable `CSINode` allocatable_ feature graduates to stable.
This enhancement allows [Container Storage Interface (CSI)](https://kubernetes-csi.github.io/docs/introduction.html) drivers to
dynamically update the reported maximum number of volumes that a node can handle.
-->
在 Kubernetes v1.36 中，**可变 `CSINode` 可分配数量**特性进阶至稳定（GA）阶段。
这一增强允许[容器存储接口（CSI）](https://kubernetes-csi.github.io/docs/introduction.html)驱动
动态更新所报告的某个节点可处理的最大卷数量。

<!--
With this update, the `kubelet` can dynamically update a node's volume limits and capacity information.
The `kubelet` adjusts these limits based on periodic checks or in response to
resource exhaustion errors from the CSI driver, without requiring a component restart.
This ensures the Kubernetes scheduler maintains an accurate view of storage availability,
preventing pod scheduling failures caused by outdated volume limits.
-->
通过这项更新，`kubelet` 可以动态更新节点的卷限制和容量信息。
`kubelet` 会基于周期性检查，或响应来自 CSI 驱动的资源耗尽错误来调整这些限制，
且无需重启组件。
这确保 Kubernetes 调度器能保持对存储可用性的准确视图，
避免因过期的卷限制导致 Pod 调度失败。

<!--
This work was done as part of [KEP #4876](https://kep.k8s.io/4876) led by SIG Storage.
-->
此项工作是 [KEP #4876](https://kep.k8s.io/4876) 的一部分，由 SIG Storage 牵头完成。

<!--
### API for external signing of ServiceAccount tokens {#api-for-external-signing-of-service-account-tokens}
-->
### ServiceAccount 令牌外部签名 API   {#api-for-external-signing-of-service-account-tokens}

<!--
In Kubernetes v1.36, the _external ServiceAccount token signer_ feature for service accounts graduates to stable,
making it possible to offload token signing to an external system while still integrating cleanly with the Kubernetes API.
Clusters can now rely on an external JWT signer for issuing projected service account tokens that
follow the standard service account token format, including support for extended expiration when needed.
This is especially useful for clusters that already rely on external identity or key management systems,
allowing Kubernetes to integrate without duplicating key management inside the control plane.
-->
在 Kubernetes v1.36 中，面向 ServiceAccount 的**外部 ServiceAccount 令牌签名器**特性进阶至稳定（GA）阶段，
使集群可以将令牌签名卸载到外部系统，同时仍能与 Kubernetes API 清晰集成。
集群现在可以依赖外部 JWT 签名器签发投射的服务账户令牌，
这些令牌遵循标准的服务账户令牌格式，并在需要时支持延长过期时间。
这对已经依赖外部身份或密钥管理系统的集群尤其有用，
因为 Kubernetes 可以与其集成，而不必在控制平面内重复管理密钥。

<!--
The kube-apiserver is wired to discover public keys from the external signer,
cache them, and validate tokens it did not sign itself,
so existing authentication and authorization flows continue to work as expected.
Over the alpha and beta phases, the API and configuration for the external signer plugin,
path validation, and OIDC discovery were hardened to handle real-world deployments and rotation patterns safely.
-->
kube-apiserver 已被连接到外部签名器，以发现并缓存其公钥，
并验证并非由 kube-apiserver 自身签发的令牌，
因此现有身份认证与鉴权流程会继续按预期工作。
在 Alpha 和 Beta 阶段，外部签名器插件的 API 与配置、路径验证以及 OIDC 发现
都经过了加固，以便安全处理真实部署和轮换模式。

<!--
With GA in v1.36, external ServiceAccount token signing is now a fully supported option for platforms that
centralize identity and signing, simplifying integration with external IAM systems and
reducing the need to manage signing keys directly inside the control plane.
-->
随着 v1.36 中进入 GA，外部 ServiceAccount 令牌签名现在成为一种完全受支持的选项，
可供集中管理身份和签名的平台使用，
简化与外部 IAM 系统的集成，并减少在控制平面内直接管理签名密钥的需求。

<!--
This work was done as part of [KEP #740](https://kep.k8s.io/740) led by SIG Auth.
-->
此项工作是 [KEP #740](https://kep.k8s.io/740) 的一部分，由 SIG Auth 牵头完成。

<!--
### DRA features graduating to Stable
-->
### 进阶至稳定阶段的 DRA 特性   {#dra-features-graduating-to-stable}

<!--
Part of the Dynamic Resource Allocation (DRA) ecosystem reaches full production maturity in
Kubernetes v1.36 as key governance and selection features graduate to Stable.
The transition of _DRA admin access_ to GA provides a permanent, secure framework for cluster administrators
to access and manage hardware resources globally, while the stabilization of _prioritized lists_ ensures that
resource selection logic remains consistent and predictable across all cluster environments.
-->
在 Kubernetes v1.36 中，随着关键治理和选择特性进阶至稳定（GA）阶段，
动态资源分配（DRA）生态的一部分已经达到完整的生产成熟度。
**DRA 管理员访问**进阶至 GA，
为集群管理员全局访问和管理硬件资源提供了永久且安全的框架；
同时，**优先级列表**的稳定化确保资源选择逻辑在所有集群环境中保持一致且可预测。

<!--
Now, organizations can confidently deploy mission-critical hardware automation with the guarantee
of long-term API stability and backward compatibility. These features empower users to implement
sophisticated resource-sharing policies and administrative overrides that are essential for
large-scale GPU clusters and multi-tenant AI platforms, marking the completion of the
core architectural foundation for next-generation resource management.
-->
现在，组织可以在长期 API 稳定性和向后兼容性的保障下，
放心部署任务关键型硬件自动化。
这些特性使用户能够实现复杂的资源共享策略和管理性覆盖，
而这些能力对大规模 GPU 集群和多租户 AI 平台至关重要；
这也标志着下一代资源管理的核心架构基础已经完成。

<!--
This work was done as part of KEPs [#5018](https://kep.k8s.io/5018) and [#4816](https://kep.k8s.io/4816) led by SIG Auth and SIG Scheduling.
-->
此项工作是 [KEP #5018](https://kep.k8s.io/5018) 和 [KEP #4816](https://kep.k8s.io/4816)
的一部分，由 SIG Auth 和 SIG Scheduling 牵头完成。

<!--
### Mutating admission policies
-->
### 变更性准入策略   {#mutating-admission-policies}

<!--
Declarative cluster management reaches a new level of sophistication in Kubernetes v1.36 with the
graduation of [MutatingAdmissionPolicies](/docs/reference/access-authn-authz/mutating-admission-policy/) to Stable. This milestone provides a native,
high-performance alternative to traditional webhooks by allowing administrators to
define resource mutations directly in the API server using the Common Expression Language (CEL),
fully replacing the need for external infrastructure for many common use cases.
-->
随着 [MutatingAdmissionPolicy（变更准入策略）](/docs/reference/access-authn-authz/mutating-admission-policy/)
在 Kubernetes v1.36 中进阶至稳定（GA），声明式集群管理的成熟度达到新高度。
这一里程碑为传统 Webhook 提供了原生、高性能的替代方案：
管理员可以使用通用表达式语言（CEL）直接在 API 服务器中定义资源变更，
在许多常见用例中完全替代对外部基础设施的需求。

<!--
Now, cluster operators can modify incoming requests without the latency and operational
complexity associated with managing custom admission webhooks.
By moving mutation logic into a declarative, versioned policy, organizations can achieve
more predictable cluster behavior, reduced network overhead,
and a hardened security model with the full guarantee of long-term API stability.
-->
现在，集群操作人员可以修改传入请求，
而无需承担管理自定义准入 Webhook 所带来的延迟和运维复杂性。
通过将变更逻辑迁移到声明式、版本化的策略中，
组织可以获得更可预测的集群行为、更低的网络开销，
以及在长期 API 稳定性完整保障下的强化安全模型。

<!--
This work was done as part of [KEP #3962](https://kep.k8s.io/3962) led by SIG API Machinery.
-->
此项工作是 [KEP #3962](https://kep.k8s.io/3962) 的一部分，由 SIG API Machinery 牵头完成。

<!--
### Declarative validation of Kubernetes native types with `validation-gen` {#declarative-validation-of-kubernetes-native-types-with-validation-gen}
-->
### 使用 `validation-gen` 对 Kubernetes 原生类型进行声明式验证   {#declarative-validation-of-kubernetes-native-types-with-validation-gen}

<!--
The development of custom resources reaches a new level of efficiency in Kubernetes v1.36
as _declarative validation_ (with `validation-gen`) graduates to Stable.
This milestone replaces the manual and often error-prone task of writing complex
OpenAPI schemas by allowing developers to define sophisticated validation logic directly
within Go struct tags using the Common Expression Language (CEL).
-->
随着**声明式验证**（使用 `validation-gen`）在 Kubernetes v1.36 中进阶至稳定（GA），
自定义资源的开发效率达到新水平。
这一里程碑允许开发者使用通用表达式语言（CEL），
直接在 Go 结构体标签中定义复杂验证逻辑，
从而替代手动编写复杂 OpenAPI 模式这一通常容易出错的任务。

<!--
Instead of writing custom validation functions, Kubernetes contributors can now define validation
rules using IDL marker comments (such as `+k8s:minimum` or `+k8s:enum`) directly
within the API type definitions (`types.go`). The `validation-gen` tool parses these
comments to automatically generate robust API validation code at compile-time.
This reduces maintenance overhead and ensures that API validation
remains consistent and synchronized with the source code.
-->
现在，Kubernetes 贡献者无需编写自定义验证函数，
而是可以直接在 API 类型定义（`types.go`）中使用 IDL 标记注释
（例如 `+k8s:minimum` 或 `+k8s:enum`）定义验证规则。
`validation-gen` 工具会解析这些注释，并在编译时自动生成稳健的 API 验证代码。
这降低了维护开销，并确保 API 验证与源代码保持一致和同步。

<!--
This work was done as part of [KEP #5073](https://kep.k8s.io/5073) led by SIG API Machinery.
-->
此项工作是 [KEP #5073](https://kep.k8s.io/5073) 的一部分，由 SIG API Machinery 牵头完成。

<!--
### Removal of gogo protobuf dependency for Kubernetes API types {#remove-gogo-protobuf-dependency-for-kubernetes-api-types}
-->
### 移除 Kubernetes API 类型对 gogo protobuf 的依赖   {#remove-gogo-protobuf-dependency-for-kubernetes-api-types}

<!--
Security and long-term maintainability for the Kubernetes codebase take a major step forward
in Kubernetes v1.36 with the completion of the `gogoprotobuf` removal.
This initiative has eliminated a significant dependency on the unmaintained `gogoprotobuf` library,
which had become a source of potential security vulnerabilities and
a blocker for adopting modern Go language features.
-->
随着 `gogoprotobuf` 移除工作的完成，
Kubernetes 代码库的安全性和长期可维护性在 Kubernetes v1.36 中迈出重要一步。
这项工作消除了对无人维护的 `gogoprotobuf` 库的重要依赖；
该库已经成为潜在安全漏洞的来源，也阻碍了现代 Go 语言特性的采用。

<!--
Instead of migrating to standard Protobuf generation, which presented compatibility risks
for Kubernetes API types, the project opted to fork and internalize the required
generation logic within `k8s.io/code-generator`. This approach successfully eliminates
the unmaintained runtime dependencies from the Kubernetes dependency graph
while preserving existing API behavior and serialization compatibility.
For consumers of Kubernetes API Go types, this change reduces technical debt and
prevents accidental misuse with standard protobuf libraries.
-->
项目没有迁移到标准 Protobuf 生成方式，因为这会给 Kubernetes API 类型带来兼容性风险；
相反，项目选择对所需的生成逻辑进行 fork，并将其内置到 `k8s.io/code-generator` 中。
这种方式在保留现有 API 行为和序列化兼容性的同时，
成功从 Kubernetes 依赖图中消除了无人维护的运行时依赖。
对于 Kubernetes API Go 类型的使用者而言，
这一变更降低了技术债，并避免了与标准 protobuf 库的意外误用。

<!--
This work was done as part of [KEP #5589](https://kep.k8s.io/5589) led by SIG API Machinery.
-->
此项工作是 [KEP #5589](https://kep.k8s.io/5589) 的一部分，由 SIG API Machinery 牵头完成。

<!--
### Node log query
-->
### 节点日志查询   {#node-log-query}

<!--
Previously, Kubernetes required cluster administrators to log into nodes via SSH or implement a
client-side reader for debugging issues pertaining to control-plane or worker nodes.
While certain issues still require direct node access, issues with the kube-proxy or kubelet
can be diagnosed by inspecting their logs. Node logs offer cluster administrators
a method to view these logs using the kubelet API and kubectl plugin
to simplify troubleshooting without logging into nodes, similar to debugging issues
related to a pod or container. This method is operating system agnostic and
requires the services or nodes to log to `/var/log`.
-->
过去，Kubernetes 要求集群管理员通过 SSH 登录节点，
或实现客户端读取器，以调试与控制平面节点或工作节点相关的问题。
虽然某些问题仍然需要直接访问节点，
但与 kube-proxy 或 kubelet 有关的问题可以通过检查其日志来诊断。
节点日志为集群管理员提供了一种方法：
使用 kubelet API 和 kubectl 插件查看这些日志，
从而简化故障排查，无需登录节点；
这类似于调试与 Pod 或容器相关的问题。
这种方法与操作系统无关，并要求服务或节点将日志写入 `/var/log`。

<!--
As this feature reaches GA in Kubernetes 1.36 after thorough performance validation on production workloads,
it is enabled by default on the kubelet through the `NodeLogQuery` feature gate.
In addition, the `enableSystemLogQuery` kubelet configuration option must also be enabled.
-->
此特性在生产工作负载上经过充分性能验证后，于 Kubernetes 1.36 中达到 GA。
它通过 `NodeLogQuery` 特性门控在 kubelet 上默认启用。
此外，还必须启用 `enableSystemLogQuery` kubelet 配置选项。

<!--
This work was done as a part of [KEP #2258](https://kep.k8s.io/2258) led by SIG Windows.
-->
此项工作是 [KEP #2258](https://kep.k8s.io/2258) 的一部分，由 SIG Windows 牵头完成。

<!--
### Support User Namespaces in pods
-->
### 支持 Pod 中的用户命名空间   {#support-user-namespaces-in-pods}

<!--
Container isolation and node security reach a major maturity milestone in Kubernetes v1.36 as
support for User Namespaces graduates to Stable.
This long-awaited feature provides a critical layer of defense-in-depth by allowing the
mapping of a container's root user to a non-privileged user on the host,
ensuring that even if a process escapes the container,
it possesses no administrative power over the underlying node.
-->
随着对用户命名空间的支持进阶至稳定（GA），
容器隔离与节点安全在 Kubernetes v1.36 中达到重要成熟度里程碑。
这一期待已久的特性允许将容器的 root 用户映射到主机上的非特权用户，
从而提供关键的纵深防御层：
即使某个进程逃逸出容器，它也不会对底层节点拥有管理权限。

<!--
Now, cluster operators can confidently enable this hardened isolation for production
workloads to mitigate the impact of container breakout vulnerabilities.
By decoupling the container's internal identity from the host's identity,
Kubernetes provides a robust, standardized mechanism to protect multi-tenant
environments and sensitive infrastructure from unauthorized access,
all with the full guarantee of long-term API stability.
-->
现在，集群操作人员可以放心地为生产工作负载启用这种加固隔离，
以缓解容器逃逸漏洞的影响。
通过将容器内部身份与主机身份解耦，
Kubernetes 提供了一种稳健、标准化的机制，
在长期 API 稳定性的完整保障下，保护多租户环境和敏感基础设施免受未授权访问。

<!--
This work was done as part of [KEP #127](https://kep.k8s.io/127) led by SIG Node.
-->
此项工作是 [KEP #127](https://kep.k8s.io/127) 的一部分，由 SIG Node 牵头完成。

<!--
### Support PSI based on cgroupv2
-->
### 支持基于 cgroup v2 的 PSI   {#support-psi-based-on-cgroupv2}

<!--
Node resource management and observability become more precise in Kubernetes v1.36
as the export of Pressure Stall Information (PSI) metrics graduates to Stable.
This feature provides the kubelet with the ability to report "pressure" metrics for CPU,
memory, and I/O, offering a more granular view of resource contention than
traditional utilization metrics.
-->
随着压力停滞信息（PSI）指标导出进阶至稳定（GA），
节点资源管理和可观测性在 Kubernetes v1.36 中变得更加精确。
此特性使 kubelet 能够报告 CPU、内存和 I/O 的“压力”指标，
相比传统利用率指标，它提供了关于资源竞争的更细粒度视图。

<!--
Cluster operators and autoscalers can use these metrics to distinguish between a system that is
simply busy and one that is actively stalling due to resource exhaustion.
By leveraging these signals, users can more accurately tune pod resource requests,
improve the reliability of vertical autoscaling, and detect noisy neighbor
effects before they lead to application performance degradation or node instability.
-->
集群操作人员和自动伸缩器可以使用这些指标区分两类系统：
一种只是繁忙，另一种则因资源耗尽而出现停滞。
借助这些信号，用户可以更准确地调整 Pod 资源请求，
提升垂直自动伸缩的可靠性，
并在“吵闹邻居”效应导致应用性能下降或节点不稳定之前发现它们。

<!--
This work was done as part of [KEP #4205](https://kep.k8s.io/4205) led by SIG Node.
-->
此项工作是 [KEP #4205](https://kep.k8s.io/4205) 的一部分，由 SIG Node 牵头完成。

<!--
### Volume source: OCI artifact and/or image {#volumesource-oci-artifact-and-or-image}
-->
### VolumeSource：OCI 制品和/或镜像   {#volumesource-oci-artifact-and-or-image}

<!--
The distribution of container data becomes more flexible in Kubernetes v1.36 as _OCI volume source_ support graduates to Stable.
This feature moves beyond the traditional requirement of mounting volumes from external storage providers
or config maps by allowing the kubelet to pull and mount content directly from any OCI-compliant registry,
such as a container image or an artifact repository.
-->
随着 **OCI 卷源**支持进阶至稳定（GA），
容器数据分发在 Kubernetes v1.36 中变得更加灵活。
此特性允许 kubelet 直接从任何符合 OCI 标准的仓库拉取和挂载内容，
例如容器镜像或制品仓库，
从而突破了从外部存储提供商或 ConfigMap 挂载卷这一传统要求。

<!--
Now, developers and platform engineers can package application data, models, or static assets as OCI artifacts
and deliver them to pods using the same registries and versioning workflows they already use for container images.
This convergence of image and volume management simplifies CI/CD pipelines,
reduces dependency on specialized storage backends for read-only content,
and ensures that data remains portable and securely accessible across any environment.
-->
现在，开发者和平台工程师可以将应用数据、模型或静态资产打包为 OCI 制品，
并使用他们已经用于容器镜像的同一套仓库和版本控制工作流将其交付给 Pod。
镜像与卷管理的这种融合简化了 CI/CD 流水线，
减少了只读内容对专用存储后端的依赖，
并确保数据在任何环境中都保持可移植且可安全访问。

<!--
This work was done as part of [KEP #4639](https://kep.k8s.io/4639) led by SIG Node.
-->
此项工作是 [KEP #4639](https://kep.k8s.io/4639) 的一部分，由 SIG Node 牵头完成。

<!--
## New features in Beta
-->
## Beta 阶段的新特性   {#new-features-in-beta}

<!--
_This is a selection of some of the improvements that are now beta following the v1.36 release._
-->
**以下列出 v1.36 发布后进入 Beta 阶段的一些改进。**

<!--
### Staleness mitigation for controllers
-->
### 缓解控制器陈旧状态   {#staleness-mitigation-for-controllers}

<!--
Staleness in Kubernetes controllers is a problem that affects many controllers and can subtly affect controller behavior.
It is usually not until it is too late, when a controller in production has already taken incorrect action,
that staleness is found to be an issue due to some underlying assumption made by the controller author.
This could lead to conflicting updates or data corruption upon controller reconciliation during times of cache staleness.
-->
Kubernetes 控制器中的陈旧状态是一个会影响许多控制器的问题，
并可能以细微方式影响控制器行为。
通常要等到为时已晚，即生产环境中的控制器已经采取了错误操作之后，
人们才会发现，由控制器作者某些底层假设导致的陈旧状态已经成为问题。
这可能会在缓存陈旧期间进行控制器调谐时导致冲突更新或数据损坏。

<!--
We are excited to announce that Kubernetes v1.36 includes new features that help mitigate controller staleness and
provide better observability of controller behavior.
This prevents reconciliation based on an outdated view of cluster state that can often lead to harmful behavior.
-->
我们很高兴地宣布，Kubernetes v1.36 包含一些新特性，
有助于缓解控制器陈旧状态，并为控制器行为提供更好的可观测性。
这可以防止基于过时的集群状态视图执行调谐，
而这种调谐往往会导致有害行为。

<!--
This work was done as part of [KEP #5647](https://kep.k8s.io/5647) led by SIG API Machinery.
-->
此项工作是 [KEP #5647](https://kep.k8s.io/5647) 的一部分，由 SIG API Machinery 牵头完成。

<!--
### IP/CIDR validation improvements
-->
### IP/CIDR 验证改进   {#ipcidr-validation-improvements}

<!--
In Kubernetes v1.36, the `StrictIPCIDRValidation` feature for API IP and CIDR fields graduates to beta,
tightening validation to catch malformed addresses and prefixes that previously slipped through.
This helps prevent subtle configuration bugs where Services, Pods, NetworkPolicies,
or other resources reference invalid IPs, which could otherwise lead to
confusing runtime behavior or security surprises.
-->
在 Kubernetes v1.36 中，面向 API IP 和 CIDR 字段的 `StrictIPCIDRValidation`
特性进阶至 Beta，收紧验证以捕获此前可能漏过的格式错误地址和前缀。
这有助于防止 Service、Pod、NetworkPolicy 或其他资源引用无效 IP 时产生隐蔽配置缺陷；
否则这些缺陷可能导致令人困惑的运行时行为或安全意外。

<!--
Controllers are updated to canonicalize IPs they write back into objects and to warn when they
encounter bad values that were already stored, so clusters can gradually converge on clean,
consistent data. With beta, `StrictIPCIDRValidation` is ready for wider use,
giving operators more reliable guardrails around IP-related configuration
as they evolve networks and policies over time.
-->
控制器已经更新，会对写回对象的 IP 进行规范化，
并在遇到已经存储的错误值时发出警告，
因此集群可以逐步收敛到干净、一致的数据。
进入 Beta 后，`StrictIPCIDRValidation` 已准备好进行更广泛的使用，
随着网络与策略不断演进，它可为操作人员提供更可靠的 IP 相关配置防护。

<!--
This work was done as a part of [KEP #4858](https://kep.k8s.io/4858) led by SIG Network.
-->
此项工作是 [KEP #4858](https://kep.k8s.io/4858) 的一部分，由 SIG Network 牵头完成。

<!--
### Separate kubectl user preferences from cluster configs
-->
### 将 kubectl 用户偏好与集群配置分离   {#separate-kubectl-user-preferences-from-cluster-configs}

<!--
The `.kuberc` feature for customizing `kubectl` user preferences continues to be beta
and is enabled by default. The `~/.kube/kuberc` file allows users to store aliases, default flags,
and other personal settings separately from `kubeconfig` files, which hold cluster endpoints and credentials.
This separation prevents personal preferences from interfering with CI pipelines or shared `kubeconfig` files,
while maintaining a consistent `kubectl` experience across different clusters and contexts.
-->
用于自定义 `kubectl` 用户偏好的 `.kuberc` 特性继续处于 Beta 阶段，并默认启用。
`~/.kube/kuberc` 文件允许用户将别名、默认命令行参数和其他个人设置
与保存集群端点和凭据的 `kubeconfig` 文件分开存放。
这种分离可以防止个人偏好干扰 CI 流水线或共享的 `kubeconfig` 文件，
同时在不同集群和上下文中保持一致的 `kubectl` 体验。

<!--
In Kubernetes v1.36, `.kuberc` was expanded with the ability to define policies for credential plugins
(allowlists or denylists) to enforce safer authentication practicies.
Users can disable this functionality if needed by setting the `KUBECTL_KUBERC=false` or `KUBERC=off` environment variables.
-->
在 Kubernetes v1.36 中，`.kuberc` 得到扩展，
能够为凭据插件定义策略（允许列表或拒绝列表），以强制实施更安全的身份认证实践。
如有需要，用户可以通过设置 `KUBECTL_KUBERC=false` 或 `KUBERC=off` 环境变量来禁用此功能。

<!--
This work was done as a part of [KEP #3104](https://kep.k8s.io/3104) led by SIG CLI, with the help from SIG Auth.
-->
此项工作是 [KEP #3104](https://kep.k8s.io/3104) 的一部分，
由 SIG CLI 牵头，并得到了 SIG Auth 的帮助。

<!--
### Mutable container resources when Job is suspended
-->
### Job 挂起时可变更的容器资源   {#mutable-container-resources-when-job-is-suspended}

<!--
In Kubernetes v1.36, the `MutablePodResourcesForSuspendedJobs` feature graduates to beta and is enabled by default.
This update This update relaxes Job validation to allow updates to container CPU, memory,
GPU, and extended resource requests and limits while a Job is suspended.
-->
在 Kubernetes v1.36 中，`MutablePodResourcesForSuspendedJobs` 特性进阶至 Beta 并默认启用。
这项更新放宽了 Job 验证，允许在 Job 挂起期间更新容器的 CPU、内存、
GPU 以及扩展资源的请求和限制。

<!--
This capability allows queue controllers and operators to adjust batch workload requirements based on
real‑time cluster conditions. For example, a queueing system can suspend incoming Jobs,
adjust their resource requirements to match available capacity or quota, and then unsuspend them.
The feature strictly limits mutability to suspended Jobs (or Jobs whose pods have been terminated upon suspension)
to prevent disruptive changes to actively running pods.
-->
这一能力允许队列控制器和操作人员根据实时集群状况调整批处理工作负载需求。
例如，排队系统可以挂起传入的 Job，
调整其资源需求以匹配可用容量或配额，然后取消挂起。
此特性严格将可变性限制在已挂起的 Job
（或其 Pod 已在挂起时终止的 Job）上，
以防止对正在运行的 Pod 造成破坏性变更。

<!--
This work was done as a part of [KEP #5440](https://kep.k8s.io/5440) led by SIG Apps.
-->
此项工作是 [KEP #5440](https://kep.k8s.io/5440) 的一部分，由 SIG Apps 牵头完成。

<!--
### Constrained impersonation
-->
### 受限的身份扮演（Impersonation）  {#constrained-impersonation}

<!--
In Kubernetes v1.36, the `ConstrainedImpersonation` feature for user impersonation graduates to beta,
tightening a historically all‑or‑nothing mechanism into something that can actually follow least‑privilege principles.
When this feature is enabled, an impersonator must have two distinct sets of permissions:
one to impersonate a given identity, and another to perform specific actions on that identity’s behalf.
This prevents support tools, controllers, or node agents from using impersonation to gain broader access
than they themselves are allowed, even if their impersonation RBAC is misconfigured.
Existing impersonate rules keep working, but the API server prefers the new constrained checks first,
making the transition incremental instead of a flag day. With beta in v1.36, `ConstrainedImpersonation` is tested,
documented, and ready for wider adoption by platform teams that rely on impersonation for debugging, proxying,
or node‑level controllers.
-->
在 Kubernetes v1.36 中，用于用户身份扮演的 `ConstrainedImpersonation`
特性进阶至 Beta，将历史上“全有或全无”的机制收紧为真正能够遵循最小权限原则的机制。
启用此特性时，身份扮演者必须拥有两组不同的权限：
一组用于扮演给定身份，另一组用于代表该身份执行特定操作。
这可以防止支持工具、控制器或节点代理即使在身份扮演 RBAC 配置错误的情况下，
也通过身份扮演获得超出其自身被允许范围的访问权限。
现有的 impersonate 规则会继续工作，
但 API 服务器会优先使用新的受限检查，
使迁移成为增量过程，而不是一次性切换。
随着 v1.36 中进入 Beta，`ConstrainedImpersonation` 已经过测试、具备文档，
并已准备好被依赖身份扮演进行调试、代理或节点级控制器的平台团队更广泛采用。

<!--
This work was done as a part of [KEP #5284](https://kep.k8s.io/5284) led by SIG Auth.
-->
此项工作是 [KEP #5284](https://kep.k8s.io/5284) 的一部分，由 SIG Auth 牵头完成。

<!--
### DRA features in beta
-->
### Beta 阶段的 DRA 特性   {#dra-features-in-beta}

<!--
The [Dynamic Resource Allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) framework reaches another maturity milestone in Kubernetes v1.36 as several core features graduate to beta and are enabled by default.
This transition moves DRA beyond basic allocation by graduating [partitionable devices](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices) and [consumable capacity](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#consumable-capacity), allowing for more granular sharing of hardware like GPUs,
while [device taints and tolerations](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations) ensure that specialized resources are only utilized by the appropriate workloads.
-->
随着若干核心特性进阶至 Beta 并默认启用，
[动态资源分配（DRA）](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)框架
在 Kubernetes v1.36 中达到又一个成熟度里程碑。
通过推进[可分区设备](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)
和[可消耗容量](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#consumable-capacity)，
这次转变让 DRA 超越了基础分配，允许对 GPU 等硬件进行更细粒度的共享；
同时，[设备污点和容忍](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)
确保专用资源只被合适的工作负载使用。

<!--
Now, users benefit from a much more reliable and observable resource lifecycle through [ResourceClaim device status](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status)
and the ability to ensure device attachment before Pod scheduling.
By integrating these features with [extended resource](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource) support,
Kubernetes provides a robust production-ready alternative to the legacy device plugin system,
enabling complex AI and HPC workloads to manage hardware with unprecedented precision and operational safety.
-->
现在，用户可以通过 [ResourceClaim 设备状态](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status)
以及在 Pod 调度前确保设备挂接的能力，
受益于更可靠且更可观测的资源生命周期。
通过将这些特性与[扩展资源](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)支持集成，
Kubernetes 为传统设备插件系统提供了一个稳健、生产就绪的替代方案，
使复杂的 AI 与 HPC 工作负载能够以前所未有的精度和运维安全性管理硬件。

<!--
This work was done across several KEPs (including [#5004](https://kep.k8s.io/5004), [#4817](https://kep.k8s.io/4817), [#5055](https://kep.k8s.io/5055), [#5075](https://kep.k8s.io/5075), [#4815](https://kep.k8s.io/4815), and [#5007](https://kep.k8s.io/issues/5007)) led by SIG Scheduling and SIG Node.
-->
此项工作跨越多个 KEP（包括 [#5004](https://kep.k8s.io/5004)、[#4817](https://kep.k8s.io/4817)、
[#5055](https://kep.k8s.io/5055)、[#5075](https://kep.k8s.io/5075)、[#4815](https://kep.k8s.io/4815)
和 [#5007](https://kep.k8s.io/issues/5007)），由 SIG Scheduling 和 SIG Node 牵头完成。

<!--
### Statusz for Kubernetes components
-->
### Kubernetes 组件的 Statusz   {#statusz-for-kubernetes-components}

<!--
In Kubernetes v1.36, the `ComponentStatusz` feature gate for core Kubernetes components graduates to beta,
providing a `/statusz` endpoint (enabled by default) that surfaces real‑time build and version details for each component.
This low‑overhead [z-page](/docs/reference/instrumentation/zpages/) exposes information like start time, uptime, Go version, binary version,
emulation version, and minimum compatibility version, so operators and developers can quickly see exactly
what is running without digging through logs or configs.
-->
在 Kubernetes v1.36 中，面向核心 Kubernetes 组件的 `ComponentStatusz` 特性门控进阶至 Beta，
提供一个默认启用的 `/statusz` 端点，用于呈现每个组件的实时构建和版本细节。
这个低开销的 [z-page](/docs/reference/instrumentation/zpages/) 会公开启动时间、运行时长、
Go 版本、二进制版本、仿真版本和最低兼容版本等信息，
使操作人员和开发者无需深入日志或配置，就能快速准确了解正在运行的内容。

<!--
The endpoint offers a human‑readable text view by default, plus a versioned structured API (`config.k8s.io/v1beta1`)
for programmatic access in JSON, YAML, or CBOR via explicit content negotiation.
Access is granted to the `system:monitoring` group, keeping it aligned with existing protections on
health and metrics endpoints and avoiding exposure of sensitive data.
-->
此端点默认提供人类可读的文本视图，
并通过显式内容协商提供一个版本化的结构化 API（`config.k8s.io/v1beta1`），
以 JSON、YAML 或 CBOR 形式供程序访问。
访问权限授予 `system:monitoring` 组，
使其与健康和指标端点上的现有保护保持一致，并避免暴露敏感数据。

<!--
With beta, `ComponentStatusz` is enabled by default across all core control‑plane components and node agents,
backed by unit, integration, and end‑to‑end tests so it can be safely used in production for
observability and debugging workflows.
-->
进入 Beta 后，`ComponentStatusz` 在所有核心控制平面组件和节点代理程序上默认启用，
并由单元测试、集成测试和端到端测试提供支撑，
因此可以安全地用于生产环境中的可观测性和调试工作流。

<!--
This work was done as a part of [KEP #4827](https://kep.k8s.io/4827) led by SIG Instrumentation.
-->
此项工作是 [KEP #4827](https://kep.k8s.io/4827) 的一部分，由 SIG Instrumentation 牵头完成。

<!--
### Flagz for Kubernetes components
-->
### Kubernetes 组件的 Flagz   {#flagz-for-kubernetes-components}

<!--
In Kubernetes v1.36, the `ComponentFlagz` feature gate for core Kubernetes components graduates to beta,
standardizing a `/flagz` endpoint that exposes the effective command‑line flags each component was started with.
This gives cluster operators and developers real‑time, in‑cluster visibility into component configuration,
making it much easier to debug unexpected behavior or verify that a flag rollout actually took effect after a restart.
-->
在 Kubernetes v1.36 中，面向核心 Kubernetes 组件的 `ComponentFlagz` 特性门控进阶至 Beta，
标准化了 `/flagz` 端点，用于公开每个组件启动时实际生效的命令行标志。
这为集群操作人员和开发者提供了组件配置的实时集群内可见性，
使调试意外行为或验证某个标志发布在重启后是否真正生效变得容易得多。

<!--
The endpoint supports both a human‑readable text view and a versioned structured API (initially `config.k8s.io/v1beta1`),
so you can either `curl` it during an incident or wire it into automated tooling once you are ready.
Access is granted to the `system:monitoring` group and sensitive values can be redacted,
keeping configuration insight aligned with existing security practices around health and status endpoints.
-->
此端点同时支持人类可读的文本视图和版本化的结构化 API（初始为 `config.k8s.io/v1beta1`），
因此你既可以在事故期间用 `curl` 查看它，也可以在准备好后将其接入自动化工具。
访问权限授予 `system:monitoring` 组，且敏感值可以被遮蔽，
使配置可见性与健康和状态端点周边的现有安全实践保持一致。

<!--
With beta, `ComponentFlagz` is now enabled by default and implemented across all core control‑plane components
and node agents, backed by unit, integration, and end‑to‑end tests to ensure the endpoint is reliable in production clusters.
-->
进入 Beta 后，`ComponentFlagz` 现在默认启用，并已在所有核心控制平面组件和节点代理程序中实现；
单元测试、集成测试和端到端测试为其提供支撑，以确保该端点在生产集群中可靠。

<!--
This work was done as a part of [KEP #4828](https://kep.k8s.io/4828) led by SIG Instrumentation.
-->
此项工作是 [KEP #4828](https://kep.k8s.io/4828) 的一部分，由 SIG Instrumentation 牵头完成。

<!--
### Mixed version proxy (aka _unknown version interoperability proxy_) {#mixed-version-proxy}
-->
### 混合版本代理（又称**未知版本互操作代理**）   {#mixed-version-proxy}

<!--
In Kubernetes v1.36, the _mixed version proxy_ feature graduates to beta, building on its alpha introduction in v1.28
to provide safer control-plane upgrades for mixed-version clusters. Each API request can now be routed to the apiserver
instance that serves the requested group, version, and resource, reducing 404s and failures due to version skew.
-->
在 Kubernetes v1.36 中，**混合版本代理**特性在 v1.28 引入的 Alpha 版本基础上进阶至 Beta，
为混合版本集群提供更安全的控制平面升级。
现在，每个 API 请求都可以路由到为所请求的组、版本和资源提供服务的 apiserver 实例，
从而减少因版本偏差导致的 404 和失败。

<!--
The feature relies on peer-aggregated discovery, so apiservers share information about which resources and versions they expose,
then use that data to transparently reroute requests when needed. New metrics on rerouted traffic and proxy behavior
help operators understand how often requests are forwarded and to which peers.
Together, these changes make it easier to run highly available, mixed-version API control planes in production
while performing multi-step or partial control-plane upgrades.
-->
此特性依赖对等聚合发现，因此各 apiserver 会共享它们公开哪些资源和版本的信息，
随后在需要时使用这些数据透明地重路由请求。
关于被重路由流量和代理行为的新指标，
可帮助操作人员了解请求被转发的频率以及被转发到哪些对等实例。
这些变更结合起来，使在生产环境中运行高可用的混合版本 API 控制平面变得更容易，
同时支持执行多步骤或部分控制平面升级。

<!--
This work was done as a part of [KEP #4020](https://kep.k8s.io/4020) led by SIG API Machinery
-->
此项工作是 [KEP #4020](https://kep.k8s.io/4020) 的一部分，由 SIG API Machinery 牵头完成。

<!--
### Memory QoS with cgroups v2
-->
### 基于 cgroups v2 的内存 QoS   {#memory-qos-with-cgroups-v2}

<!--
Kubernetes now enhances memory QoS on Linux cgroup v2 nodes with smarter, tiered memory protection that better aligns kernel
controls with pod requests and limits, reducing interference and thrashing for workloads sharing the same node.
This iteration also refines how kubelet programs memory.high and memory.min, adds metrics and safeguards to avoid livelocks,
and introduces configuration options so cluster operators can tune memory protection behavior for their environments.
-->
Kubernetes 现在在 Linux cgroup v2 节点上通过更智能、分层的内存保护增强内存 QoS，
使内核控制更好地与 Pod 请求和限制对齐，
减少共享同一节点的工作负载之间的干扰和抖动。
这一迭代还改进了 kubelet 对 memory.high 和 memory.min 的设置方式，
增加了指标和防护机制以避免活锁，
并引入配置选项，使集群操作人员可以针对其环境调整内存保护行为。

<!--
This work was done as part of [KEP #2570](https://kep.k8s.io/2570) led by SIG Node.
-->
此项工作是 [KEP #2570](https://kep.k8s.io/2570) 的一部分，由 SIG Node 牵头完成。

<!--
## New features in Alpha
-->
## Alpha 阶段的新特性   {#new-features-in-alpha}

<!--
This is a selection of some of the improvements that are now alpha following the v1.36 release.
-->
以下列出 v1.36 发布后进入 Alpha 阶段的一些改进。

<!--
### HPA scale to zero for custom metrics
-->
### 基于自定义指标的 HPA 缩容到零   {#hpa-scale-to-zero-for-custom-metrics}

<!--
Until now, the HorizontalPodAutoscaler (HPA) required a minimum of at least one replica to remain active,
as it could only calculate scaling needs based on metrics (like CPU or Memory) from running pods.
Kubernetes v1.36 continues the development of the _HPA scale to zero_ feature (disabled by default) in Alpha,
allowing workloads to scale down to zero replicas specifically when using Object or External metrics.
-->
到目前为止，HorizontalPodAutoscaler（HPA）要求至少保留一个活跃副本，
因为它只能基于运行中 Pod 的指标（如 CPU 或内存）计算扩缩容需求。
Kubernetes v1.36 继续推进 Alpha 阶段的 **HPA 缩容到零**特性（默认禁用），
允许工作负载在使用 Object 或 External 指标时专门缩容到零个副本。

<!--
Now, users can experiment with significantly reducing infrastructure costs by completely idling heavy workloads when
no work is pending. While the feature remains behind the `HPAScaleToZero` feature gate,
it enables the HPA to stay active even with zero running pods,
automatically scaling the deployment back up as soon as the external metric (e.g., queue length)
indicates that new tasks have arrived.
-->
现在，用户可以进行实验：
在没有待处理工作时让重型工作负载完全空闲，从而显著降低基础设施成本。
虽然此特性仍受 `HPAScaleToZero` 特性门控控制，
但它使 HPA 即使在没有运行中 Pod 时也能保持活跃，
并在外部指标（例如队列长度）表明有新任务到达时，
自动将 Deployment 扩容回来。

<!--
This work was done as part of [KEP #2021](https://kep.k8s.io/2021) led by SIG Autoscaling.
-->
此项工作是 [KEP #2021](https://kep.k8s.io/2021) 的一部分，由 SIG Autoscaling 牵头完成。

<!--
### DRA features in Alpha
-->
### Alpha 阶段的 DRA 特性   {#dra-features-in-alpha}

<!--
Historically, the Dynamic Resource Allocation (DRA) framework lacked seamless integration with high-level controllers and
provided limited visibility into device-specific metadata or availability.
Kubernetes v1.36 introduces a wave of DRA enhancements in Alpha, including native ResourceClaim support for workloads,
and DRA native resources to provide the flexibility of DRA to cpu management.
-->
过去，动态资源分配（DRA）框架缺少与高级控制器的无缝集成，
并且对设备特定元数据或可用性的可见性有限。
Kubernetes v1.36 引入了一批 Alpha 阶段的 DRA 增强，
包括面向工作负载的原生 ResourceClaim 支持，
以及 DRA 原生资源，用于为 CPU 管理提供 DRA 的灵活性。

<!--
Now, users can leverage the [downward API](/docs/concepts/workloads/pods/downward-api/) to expose complex resource attributes directly to containers and
benefit from improved resource availability visibility for more predictable scheduling. these updates,
combined with support for list types in device attributes, transform DRA from a low-level primitive into a robust system
capable of handling the sophisticated networking and compute requirements of modern AI and
high-performance computing (HPC) stacks.
-->
现在，用户可以利用 [Downward API](/docs/concepts/workloads/pods/downward-api/)
将复杂资源属性直接暴露给容器，
并受益于改进后的资源可用性可见性，从而实现更可预测的调度。
这些更新结合对设备属性中列表类型的支持，
将 DRA 从低层原语转变为稳健的系统，
能够处理现代 AI 和高性能计算（HPC）栈的复杂网络与计算需求。

<!--
This work was done across several KEPs (including [#5729](https://kep.k8s.io/5729), [#5304](https://kep.k8s.io/5304), [#5517](https://kep.k8s.io/5517), [#5677](https://kep.k8s.io/5677), and [#5491](https://kep.k8s.io/5491)) led by SIG Scheduling and SIG Node.
-->
此项工作跨越多个 KEP（包括 [#5729](https://kep.k8s.io/5729)、[#5304](https://kep.k8s.io/5304)、
[#5517](https://kep.k8s.io/5517)、[#5677](https://kep.k8s.io/5677) 和 [#5491](https://kep.k8s.io/5491)），
由 SIG Scheduling 和 SIG Node 牵头完成。

<!--
### Native histogram support for Kubernetes metrics
-->
### Kubernetes 指标的原生直方图支持   {#native-histogram-support-for-kubernetes-metrics}

<!--
High-resolution monitoring reaches a new milestone in Kubernetes v1.36 with the introduction of native histogram support
in Alpha. While classical Prometheus histograms relied on static, pre-defined buckets that often forced a compromise
between data accuracy and memory usage, this update allows the control plane to export sparse histograms that
dynamically adjust their resolution based on real-time data.
-->
随着原生直方图支持在 Alpha 阶段引入，
高分辨率监控在 Kubernetes v1.36 中达到新的里程碑。
传统 Prometheus 直方图依赖静态、预定义的桶，
往往迫使用户在数据精度和内存使用之间取舍；
这项更新允许控制平面导出稀疏直方图，
并基于实时数据动态调整其分辨率。

<!--
Now, cluster operators can capture precise latency distributions for the kube-apiserver and other core components without
the overhead of manual bucket management. This architectural shift ensures more reliable SLIs and SLOs,
providing high-fidelity heatmaps that remain accurate even during the most unpredictable workload spikes.
-->
现在，集群操作人员可以捕获 kube-apiserver 和其他核心组件的精确延迟分布，
而无需承担手动管理桶的开销。
这一架构转变确保 SLI 和 SLO 更可靠，
提供高保真热力图，即使在最难预测的工作负载峰值期间也能保持准确。

<!--
This work was done as part of [KEP #5808](https://kep.k8s.io/5808) led by SIG Instrumentation.
-->
此项工作是 [KEP #5808](https://kep.k8s.io/5808) 的一部分，由 SIG Instrumentation 牵头完成。

<!--
### Manifest based admission control config
-->
### 基于清单的准入控制配置   {#manifest-based-admission-control-config}

<!--
Managing admission controllers moves toward a more declarative and consistent model in Kubernetes v1.36 with the
introduction of _manifest-based admission control_ configuration in Alpha.
This change addresses the long-standing challenge of configuring admission plugins through disparate command-line
flags or separate, complex config files by allowing administrators to define the desired state of admission control
directly through a structured manifest.
-->
随着 Alpha 阶段的**基于清单的准入控制**配置引入，
准入控制器管理在 Kubernetes v1.36 中迈向更加声明式且一致的模型。
长期以来，准入插件需要通过分散的命令行参数或独立且复杂的配置文件进行配置。
这一变更允许管理员直接通过结构化清单定义准入控制的期望状态，
从而应对这一长期挑战。

<!--
Now, cluster operators can manage admission plugin settings with the same versioned, declarative workflows used for
other Kubernetes objects, significantly reducing the risk of configuration drift and manual errors during cluster upgrades.
By centralizing these configurations into a unified manifest, the kube-apiserver becomes easier to audit and automate,
paving the way for more secure and reproducible cluster deployments.
-->
现在，集群操作人员可以使用与其他 Kubernetes 对象相同的版本化、声明式工作流来管理准入插件设置，
显著降低集群升级期间配置漂移和手动错误的风险。
通过将这些配置集中到统一清单中，
kube-apiserver 变得更易于审计和自动化，
为更安全、可复现的集群部署铺平道路。

<!--
This work was done as part of [KEP #5793](https://kep.k8s.io/5793) led by SIG API Machinery.
-->
此项工作是 [KEP #5793](https://kep.k8s.io/5793) 的一部分，由 SIG API Machinery 牵头完成。

<!--
### CRI list streaming
-->
### CRI 列表流式传输   {#cri-list-streaming}

<!--
With the introduction of _CRI list streaming_ in Alpha, Kubernetes v1.36 uses new internal streaming operations.
This enhancement addresses the memory pressure and latency spikes often seen on large-scale nodes by replacing traditional,
monolithic `List` requests between the kubelet and the container runtime with a more efficient server-side streaming RPC.
-->
随着 **CRI 列表流式传输**在 Alpha 阶段引入，
Kubernetes v1.36 使用了新的内部流式操作。
此增强将 kubelet 与容器运行时之间传统的整体式 `List` 请求
替换为更高效的服务器端流式 RPC，
以解决大规模节点上常见的内存压力和延迟峰值问题。

<!--
Now, instead of waiting for a single, massive response containing all container or image data, the kubelet can process results
incrementally as they are streamed. This shift significantly reduces the peak memory footprint of the kubelet and improves
responsiveness on high-density nodes, ensuring that cluster management remains fluid even as the number of
containers per node continues to grow.
-->
现在，kubelet 不再等待包含所有容器或镜像数据的单个巨大响应，
而是可以在结果被流式传输时增量处理。
这一转变显著降低了 kubelet 的峰值内存占用，
并提升了高密度节点上的响应能力，
确保即使每个节点上的容器数量持续增长，集群管理也能保持流畅。

<!--
This work was done as part of [KEP #5825](https://kep.k8s.io/5825) led by SIG Node.
-->
此项工作是 [KEP #5825](https://kep.k8s.io/5825) 的一部分，由 SIG Node 牵头完成。

<!--
## Other notable changes
-->
## 其他值得注意的变化   {#other-notable-changes}

<!--
### Ingress NGINX retirement
-->
### Ingress NGINX 退役   {#ingress-nginx-retirement}

<!--
To prioritize the safety and security of the ecosystem, Kubernetes SIG Network and the Security Response Committee have 
retired Ingress NGINX on March 24, 2026.
Since that date, there have been no further releases, no bugfixes, and no updates to resolve any security vulnerabilities discovered. Existing deployments of
Ingress NGINX will continue to function, and installation artifacts like Helm charts and container images will remain available. 
-->
为优先保障生态系统的安全，Kubernetes SIG Network 和安全响应委员会（Security Response Committee）
已于 2026 年 3 月 24 日退役 Ingress NGINX。
自该日期起，不再发布后续版本、不再修复缺陷，也不再更新以修复新发现的安全漏洞。
现有 Ingress NGINX 部署将继续运行，Helm Chart 和容器镜像等安装制品也将继续可用。

<!--
For full details, see the [official retirement announcement](/blog/2025/11/11/ingress-nginx-retirement/).
-->
完整详情请参阅[官方退役公告](/blog/2025/11/11/ingress-nginx-retirement/)。

<!--
### Faster SELinux labelling for volumes (GA) {#volume-selinux-labelling}
-->
### 卷的 SELinux 标签提速（GA）   {#volume-selinux-labelling}

<!--
Kubernetes v1.36 makes the SELinux volume mounting improvement generally available. This change replaced recursive file 
relabeling with `mount -o context=XYZ` option, applying the correct SELinux label to the entire volume at mount time. 
It brings more consistent performance and reduces Pod startup delays on SELinux-enforcing systems.
-->
Kubernetes v1.36 将 SELinux 卷挂载改进提升为正式可用。
此变更使用 `mount -o context=XYZ` 选项替代了递归文件重标记，
在挂载时为整个卷应用正确的 SELinux 标签。
它带来更一致的性能，并减少启用 SELinux 强制模式系统上的 Pod 启动延迟。

<!--
This feature was introduced as beta in v1.28 for `ReadWriteOncePod` volumes. In v1.32, it gained metrics and an opt-out 
option (`securityContext.seLinuxChangePolicy: Recursive`) to help catch conflicts. Now in v1.36, 
it reaches Stable and defaults to all volumes, with Pods or CSIDrivers opting in via `spec.seLinuxMount`.
-->
该特性在 v1.28 作为 Beta 引入，适用于 `ReadWriteOncePod` 卷。
在 v1.32，它新增了指标和退出选项（`securityContext.seLinuxChangePolicy: Recursive`）以帮助发现冲突。
现在在 v1.36，它进入稳定（GA）阶段，并默认适用于所有卷；
Pod 或 CSIDriver 可通过 `spec.seLinuxMount` 显式启用。

<!--
However, we expect this feature to create the risk of breaking changes in the future Kubernetes releases, potentially due to sharing one volume between privileged and unprivileged Pods on the same node.
-->
不过，我们预计该特性在未来 Kubernetes 版本中可能带来破坏性变更风险，
潜在原因是在同一节点上的特权 Pod 和非特权 Pod 之间共享同一个卷。

<!--
Developers have the responsibility of setting the `seLinuxChangePolicy` field and SELinux volume labels on Pods. Regardless of whether they are writing a Deployment, StatefulSet, DaemonSet or even a custom resource that includes a Pod template, being careless with these settings can lead to a range of problems such as Pods not starting up correctly when Pods share a volume.
-->
开发者有责任为 Pod 设置 `seLinuxChangePolicy` 字段和 SELinux 卷标签。
无论他们是在编写 Deployment、StatefulSet、DaemonSet，
还是包含 Pod 模板的自定义资源，
对这些设置不够谨慎都可能导致一系列问题，
例如 Pod 共享卷时无法正确启动。

<!--
Kubernetes v1.36 is the ideal release to audit your clusters. To learn more, check out [SELinux Volume Label Changes goes GA (and likely implications in v1.37)](/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/) blog.
-->
Kubernetes v1.36 是审计集群的理想版本。
要了解更多信息，请查看博客
[SELinux Volume Label Changes goes GA (and likely implications in v1.37)](/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/)。

<!--
For more details on this enhancement, refer to [KEP-1710: Speed up recursive SELinux label change](https://kep.k8s.io/1710).
-->
有关此增强的更多细节，请参阅 [KEP-1710：加快递归 SELinux 标签变更](https://kep.k8s.io/1710)。

<!--
## Graduations, deprecations, and removals in v1.36
-->
## v1.36 的升级、弃用与移除   {#graduations-deprecations-and-removals-in-v136}

<!--
### Graduations to stable
-->
### 进阶至稳定阶段   {#graduations-to-stable}

<!--
This lists all the features that graduated to stable (also known as general availability).
For a full list of updates including new features and graduations from alpha to beta, see the release notes.
-->
这里列出了所有进阶至稳定（也称为正式发布，GA）阶段的特性。
有关包括新特性以及从 Alpha 进阶至 Beta 的完整更新列表，请参阅发布说明。

<!--
This release includes a total of 18 enhancements promoted to stable:
-->
此版本共有 18 项增强提升至稳定阶段：

<!--
- [Support User Namespaces in pods](https://kep.k8s.io/127)
- [API for external signing of Service Account tokens](https://kep.k8s.io/740)
- [Speed up recursive SELinux label change](https://kep.k8s.io/1710)
- [Portworx file in-tree to CSI driver migration](https://kep.k8s.io/2589)
- [Fine grained Kubelet API authorization](https://kep.k8s.io/2862)
- [Mutating Admission Policies](https://kep.k8s.io/3962)
- [Node log query](https://kep.k8s.io/2258)
- [VolumeGroupSnapshot](https://kep.k8s.io/3476)
- [Mutable CSINode Allocatable Property](https://kep.k8s.io/4876)
- [DRA: Prioritized Alternatives in Device Requests](https://kep.k8s.io/4816)
- [Support PSI based on cgroupv2](https://kep.k8s.io/4205)
- [add ProcMount option](https://kep.k8s.io/4265)
- [DRA: Extend PodResources to include resources from Dynamic Resource Allocation](https://kep.k8s.io/3695)
- [VolumeSource: OCI Artifact and/or Image](https://kep.k8s.io/4639)
- [Split L3 Cache Topology Awareness in CPU Manager](https://kep.k8s.io/5109)
- [DRA: AdminAccess for ResourceClaims and ResourceClaimTemplates](https://kep.k8s.io/5018)
- [Remove gogo protobuf dependency for Kubernetes API types](https://kep.k8s.io/5589)
- [CSI driver opt-in for service account tokens via secrets field](https://kep.k8s.io/5538)
-->
- [支持 Pod 中的用户命名空间](https://kep.k8s.io/127)
- [ServiceAccount 令牌外部签名 API](https://kep.k8s.io/740)
- [加快递归 SELinux 标签变更](https://kep.k8s.io/1710)
- [Portworx file in-tree 到 CSI 驱动迁移](https://kep.k8s.io/2589)
- [细粒度 Kubelet API 鉴权](https://kep.k8s.io/2862)
- [变更性准入策略](https://kep.k8s.io/3962)
- [节点日志查询](https://kep.k8s.io/2258)
- [VolumeGroupSnapshot](https://kep.k8s.io/3476)
- [可变 CSINode 可分配属性](https://kep.k8s.io/4876)
- [DRA：设备请求中的优先替代项](https://kep.k8s.io/4816)
- [支持基于 cgroup v2 的 PSI](https://kep.k8s.io/4205)
- [添加 ProcMount 选项](https://kep.k8s.io/4265)
- [DRA：扩展 PodResources 以包含来自动态资源分配的资源](https://kep.k8s.io/3695)
- [VolumeSource：OCI 制品和/或镜像](https://kep.k8s.io/4639)
- [在 CPU Manager 中拆分 L3 缓存拓扑感知](https://kep.k8s.io/5109)
- [DRA：ResourceClaim 和 ResourceClaimTemplate 的 AdminAccess](https://kep.k8s.io/5018)
- [移除 Kubernetes API 类型对 gogo protobuf 的依赖](https://kep.k8s.io/5589)
- [CSI 驱动选择通过 secrets 字段接收服务账户令牌](https://kep.k8s.io/5538)

<!--
## Deprecations removals, and community updates
-->
## 弃用、移除与社区更新   {#deprecations-removals-and-community-updates}

<!--
As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better ones to improve the
project's overall health. See the Kubernetes deprecation and removal policy for more details on this process.
Kubernetes v1.36 includes a couple of deprecations.
-->
随着 Kubernetes 的发展与成熟，为提升项目整体健康度，
特性可能会被弃用、移除或被更好的特性替代。
关于这一过程的更多信息，请参阅 Kubernetes 的弃用与移除策略。
Kubernetes v1.36 包含若干项弃用内容。

<!--
### Deprecation of Service .spec.externalIPs {#deprecate-service-spec-externalips}
-->
### Service `.spec.externalIPs` 的弃用   {#deprecate-service-spec-externalips}

<!--
With this release, the `externalIPs` field in Service `spec` is deprecated. This means the functionality exists, but will no longer function in a **future** version of Kubernetes. You should plan to migrate if you currently rely on that field.
This field has been a known security headache for years,
enabling man-in-the-middle attacks on your cluster traffic, as documented in [CVE-2020-8554](https:/github.com/kubernetes/kubernetes/issues/97076).
From Kubernetes v1.36 and onwards, you will see deprecation warnings when using it, with full removal planned for v1.43.
-->
在本次发布中，Service `spec` 中的 `externalIPs` 字段被弃用。
这意味着此功能仍然存在，但将在 Kubernetes 的**未来**版本中不再工作。
如果你当前依赖此字段，应计划迁移。
这个字段多年来一直是已知的安全隐患，
会让集群流量面临中间人攻击风险，如 [CVE-2020-8554](https://github.com/kubernetes/kubernetes/issues/97076) 所述。
从 Kubernetes v1.36 起，使用它时你会看到弃用警告，并计划在 v1.43 完全移除。

<!--
If your Services still lean on `externalIPs`, consider using LoadBalancer services for cloud-managed ingress,
NodePort for simple port exposure, or [Gateway API](https://gateway-api.sigs.k8s.io/) for a more flexible and secure way to handle external traffic.
-->
如果你的 Service 仍依赖 `externalIPs`，
可考虑使用 LoadBalancer 服务处理云托管入口、使用 NodePort 做简单端口暴露，
或使用 [Gateway API](https://gateway-api.sigs.k8s.io/) 以更灵活且更安全的方式处理外部流量。

<!--
For more details on this field and its deprecation, refer to [External IPs](/docs/concepts/services-networking/service/#external-ips) or read
[KEP-5707: Deprecate service.spec.externalIPs](https://kep.k8s.io/5707).
-->
有关此字段及其弃用的更多细节，请参阅[外部 IP](/docs/concepts/services-networking/service/#external-ips)，
或阅读 [KEP-5707：弃用 service.spec.externalIPs](https://kep.k8s.io/5707)。

<!--
### Removal of the `gitRepo` volume driver {#remove-gitrepo-volume-driver}
-->
### 移除 `gitRepo` 卷驱动   {#remove-gitrepo-volume-driver}

<!--
The `gitRepo` volume type has been deprecated since v1.11. For Kubernetes v1.36, the `gitRepo` volume plugin is
permanently disabled and cannot be turned back on. This change protects clusters from a critical security issue where
using `gitRepo` could let an attacker run code as root on the node.
-->
`gitRepo` 卷类型自 v1.11 起已被弃用。
在 Kubernetes v1.36 中，`gitRepo` 卷插件被永久禁用，且无法重新启用。
此变更可保护集群免受关键安全问题影响，
因为使用 `gitRepo` 可能让攻击者以 root 身份在节点上运行代码。

<!--
Although `gitRepo` has been deprecated for years and better alternatives have been recommended,
it was still technically possible to use it in previous releases.
From v1.36 onward, that path is closed for good, so any existing workloads depending on `gitRepo` will need to migrate to
supported approaches such as init containers or external `git-sync` style tools.
-->
尽管 `gitRepo` 多年来一直处于弃用状态，且已有更好的替代方案被推荐，
但在此前版本中它在技术上仍可使用。
从 v1.36 开始，这条路径将被永久关闭，
因此任何依赖 `gitRepo` 的现有工作负载都需要迁移到受支持方案，
例如 init 容器或外部 `git-sync` 风格工具。

<!--
For more details on this removal, refer to [KEP-5040: Remove gitRepo volume driver](https://kep.k8s.io/5040)
-->
有关此移除的更多细节，请参阅 [KEP-5040：移除 gitRepo 卷驱动](https://kep.k8s.io/5040)。

<!--
## Release notes
-->
## 发布说明   {#release-notes}

<!--
Check out the full details of the Kubernetes v1.36 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md).
-->
请在我们的[发布说明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md)
中查看 Kubernetes v1.36 发布的完整细节。

<!--
## Availability
-->
## 可用性   {#availability}

<!--
Kubernetes v1.36 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.36.0) or on the [Kubernetes download page](https://kubernetes.io/releases/download/).
-->
Kubernetes v1.36 可通过 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.36.0)
或 [Kubernetes 下载页面](https://kubernetes.io/releases/download/)获取。

<!--
To get started with Kubernetes, check out [these tutorials](https://kubernetes.io/docs/tutorials/) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). 
You can also easily [install v1.36 using kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
-->
要开始使用 Kubernetes，请查看[这些教程](/docs/tutorials/)，
或使用 [`minikube`](https://minikube.sigs.k8s.io/) 在本地运行 Kubernetes 集群。
你也可以轻松地[使用 `kubeadm` 安装 v1.36](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)。

<!--
## Release Team
-->
## 发布团队   {#release-team}

<!--
Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is 
made up of dedicated community volunteers who work together to build the many pieces that make up the 
Kubernetes releases you rely on. This requires the specialized skills of people from all corners of our community, 
from the code itself to its documentation and project management.
-->
Kubernetes 的存在离不开社区的支持、投入和辛勤工作。
每个发布团队都由专注的社区志愿者组成，
他们共同构建你所依赖的 Kubernetes 发布版本中的诸多组成部分。
这需要来自社区各个角落的专业能力：
从代码本身到文档与项目管理。

<!--
We would like to thank the entire [Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.36/release-team.md) for the hours spent hard at work to deliver the Kubernetes v1.36 release to our community. 
The Release Team's membership ranges from first-time shadows to returning team leads with experience forged over 
several release cycles. A very special thanks goes out to our release lead, Ryota Sawada, 
for guiding us through a successful release cycle, for his hands-on approach to solving challenges, 
and for bringing the energy and care that drives our community forward.
-->
我们感谢整个[发布团队](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.36/release-team.md)
为向社区交付 Kubernetes v1.36 所付出的辛勤时间。
发布团队成员既包括首次参与的 shadow，也包括经过多个发布周期锤炼、再次回归的团队负责人。
我们特别感谢发布负责人 Ryota Sawada：
他带领我们走过一个成功的发布周期，
以亲力亲为的方式解决挑战，
并带来推动社区前行的能量与关怀。

<!--
## Project Velocity
-->
## 项目活跃度   {#project-velocity}

<!--
The CNCF K8s [DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) project aggregates a number of interesting data points related to the velocity of 
Kubernetes and various sub-projects. This includes everything from individual contributions to the number of 
companies that are contributing, and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.
-->
CNCF K8s 的 [DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)
项目汇总了与 Kubernetes 及其各子项目活跃度相关的一系列有趣数据点。
这些数据涵盖从个人贡献到参与贡献公司的数量等多个方面，
体现了推动该生态演进所投入努力的深度与广度。

<!--
During the v1.36 release cycle, which spanned 15 weeks from 12th January 2026 to 22nd April 2026, 
Kubernetes received contributions from as many as 106 different companies and 491 individuals. 
In the wider cloud native ecosystem, the figure goes up to 370 companies, counting 2235 total contributors.
-->
在 v1.36 发布周期（从 2026 年 1 月 12 日到 2026 年 4 月 22 日，共 15 周）期间，
Kubernetes 收到了来自多达 106 家公司与 491 名个人的贡献。
在更广泛的云原生生态中，这一数字上升到 370 家公司，共计 2235 名贡献者。

<!--
Note that “contribution” counts when someone makes a commit, code review, comment, creates an issue or PR, 
reviews a PR (including blogs and documentation) or comments on issues and PRs.
If you are interested in contributing, visit [Getting Started](https://www.kubernetes.dev/docs/guide/#getting-started) on our contributor website.
-->
请注意，这里的“贡献”统计包括：提交代码、进行代码评审、发表评论、创建 Issue 或 PR、
评审 PR（包括博客与文档）以及对 Issue 与 PR 的评论等。
如果你有兴趣参与贡献，请访问贡献者网站上的 [Getting Started](https://www.kubernetes.dev/docs/guide/#getting-started)。

<!--
Source for this data:
- [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)
-->
数据来源：

- [贡献 Kubernetes 的公司](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [整体生态的贡献](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

<!--
## Events Update
-->
## 活动更新   {#events-update}

<!--
Explore upcoming Kubernetes and cloud native events, including KubeCon + CloudNativeCon, KCD, 
and other notable conferences worldwide. Stay informed and get involved with the Kubernetes community!
-->
了解即将到来的 Kubernetes 与云原生活动，包括 KubeCon + CloudNativeCon、KCD 与全球其他重要会议。
保持关注并参与 Kubernetes 社区！

<!--
**April 2026**
-->
**2026 年 4 月**

<!--
- KCD - [Kubernetes Community Days: Guadalajara](https://community.cncf.io/events/details/cncf-kcd-guadalajara-presents-kcd-guadalajara-2026/cohost-kcd-guadalajara/): April 18, 2026 | Guadalajara, Mexico
-->
- KCD - [Kubernetes Community Days: Guadalajara](https://community.cncf.io/events/details/cncf-kcd-guadalajara-presents-kcd-guadalajara-2026/cohost-kcd-guadalajara/)：2026 年 4 月 18 日｜墨西哥 Guadalajara

<!--
**May 2026**
-->
**2026 年 5 月**

<!--
- KCD - [Kubernetes Community Days: Toronto](https://community.cncf.io/events/details/cncf-kcd-toronto-presents-kcd-toronto-2026/): May 13, 2026 | Toronto, Canada
- KCD - [Kubernetes Community Days: Texas](https://community.cncf.io/events/details/cncf-kcd-texas-presents-kcd-texas-2026/cohost-kcd-texas/): May 15, 2026 | Austin, USA
- KCD - [Kubernetes Community Days: Istanbul](https://community.cncf.io/events/details/cncf-kcd-istanbul-presents-kcd-istanbul-2026/): May 15, 2026 | Istanbul, Turkey
- KCD - [Kubernetes Community Days: Helsinki](https://community.cncf.io/events/details/cncf-kcd-helsinki-presents-kubernetes-community-days-helsinki-2026/): May 20, 2026 | Helsinki, Finland
- KCD - [Kubernetes Community Days: Czech & Slovak](https://community.cncf.io/events/details/cncf-kcd-czech-slovak-presents-kcd-czech-amp-slovak-prague-2026/): May 21, 2026 | Prague, Czechia
-->
- KCD - [Kubernetes Community Days: Toronto](https://community.cncf.io/events/details/cncf-kcd-toronto-presents-kcd-toronto-2026/)：2026 年 5 月 13 日｜加拿大 Toronto
- KCD - [Kubernetes Community Days: Texas](https://community.cncf.io/events/details/cncf-kcd-texas-presents-kcd-texas-2026/cohost-kcd-texas/)：2026 年 5 月 15 日｜美国 Austin
- KCD - [Kubernetes Community Days: Istanbul](https://community.cncf.io/events/details/cncf-kcd-istanbul-presents-kcd-istanbul-2026/)：2026 年 5 月 15 日｜土耳其 Istanbul
- KCD - [Kubernetes Community Days: Helsinki](https://community.cncf.io/events/details/cncf-kcd-helsinki-presents-kubernetes-community-days-helsinki-2026/)：2026 年 5 月 20 日｜芬兰 Helsinki
- KCD - [Kubernetes Community Days: Czech & Slovak](https://community.cncf.io/events/details/cncf-kcd-czech-slovak-presents-kcd-czech-amp-slovak-prague-2026/)：2026 年 5 月 21 日｜捷克 Prague

<!--
**June 2026**
-->
**2026 年 6 月**

<!--
- KCD - [Kubernetes Community Days: New York](https://community.cncf.io/events/details/cncf-kcd-new-york-presents-kcd-new-york-2026/): June 10, 2026 | New York, USA
- [KubeCon + CloudNativeCon India 2026: June 18-19, 2026](https://events.linuxfoundation.org/kubecon-cloudnativecon-india/) | Mumbai, India
-->
- KCD - [Kubernetes Community Days: New York](https://community.cncf.io/events/details/cncf-kcd-new-york-presents-kcd-new-york-2026/)：2026 年 6 月 10 日｜美国 New York
- [KubeCon + CloudNativeCon India 2026：2026 年 6 月 18-19 日](https://events.linuxfoundation.org/kubecon-cloudnativecon-india/)｜印度 Mumbai

<!--
**July 2026**
-->
**2026 年 7 月**

<!--
- [KubeCon + CloudNativeCon Japan 2026: July 29-30, 2026](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan/) | Yokohama, Japan
-->
- [KubeCon + CloudNativeCon Japan 2026：2026 年 7 月 29-30 日](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan/)｜日本 Yokohama

<!--
**September 2026**
-->
**2026 年 9 月**

<!--
- [KubeCon + CloudNativeCon China 2026: September 8-9, 2026](https://www.lfopensource.cn/kubecon-cloudnativecon-openinfra-summit-pytorch-conference-china/) | Shanghai, China
-->
- [KubeCon + CloudNativeCon China 2026：2026 年 9 月 8-9 日](https://www.lfopensource.cn/kubecon-cloudnativecon-openinfra-summit-pytorch-conference-china/)｜中国上海

<!--
**October 2026**
-->
**2026 年 10 月**

<!--
- KCD - [Kubernetes Community Days: UK: Oct 19, 2026](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-edinburgh-2026/) | Edinburgh, UK
-->
- KCD - [Kubernetes Community Days: UK：2026 年 10 月 19 日](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-edinburgh-2026/)｜英国 Edinburgh

<!--
**November 2026**
-->
**2026 年 11 月**

<!--
- KCD - [Kubernetes Community Days: Porto](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2026-collab-with-devops-days-portugal/): Nov 19, 2026 | Porto, Portugal
- [KubeCon + CloudNativeCon North America 2026](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): Nov 9-12, 2026 | Salt Lake, USA
-->
- KCD - [Kubernetes Community Days: Porto](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2026-collab-with-devops-days-portugal/)：2026 年 11 月 19 日｜葡萄牙 Porto
- [KubeCon + CloudNativeCon North America 2026](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/)：2026 年 11 月 9-12 日｜美国 Salt Lake

<!--
You can find the latest event details [here](https://community.cncf.io/events/#/list).
-->
你可以在[此处](https://community.cncf.io/events/#/list)查看最新活动详情。

<!--
## Upcoming Release Webinar
-->
## 即将举行的发布网络研讨会   {#upcoming-release-webinar}

<!--
Join members of the Kubernetes v1.36 Release Team on **Wednesday, May 20th 2026 at 4:00 PM (UTC)** to learn about the release highlights
of this release. For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v136-release/) on the CNCF Online Programs site.
-->
欢迎在 **2026 年 5 月 20 日（星期三）16:00（UTC）** 与 Kubernetes v1.36 发布团队成员一起，
了解本次发布的重点亮点。
有关更多信息与注册方式，请访问 CNCF Online Programs 网站上的[活动页面](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v136-release/)。

<!--
## Get Involved
-->
## 参与其中   {#get-involved}

<!--
The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. 
Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), 
and through the channels below. Thank you for your continued feedback and support.
-->
参与 Kubernetes 最简单的方式之一，
是加入与你兴趣相符的众多[特别兴趣小组（Special Interest Groups，SIG）](https://github.com/kubernetes/community/blob/master/sig-list.md)之一。
你想向 Kubernetes 社区发布一些内容吗？
欢迎在我们每周的[社区会议](https://github.com/kubernetes/community/tree/master/communication)上发声，
也可以通过以下渠道参与交流。感谢你持续的反馈与支持。

<!--
- Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](https://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
- 在 Bluesky 关注我们 [@kubernetes.io](https://bsky.app/profile/kubernetes.io) 获取最新动态
- 在 [Discuss](https://discuss.kubernetes.io/) 加入社区讨论
- 在 [Slack](https://slack.k8s.io/) 加入社区
- 在 [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes) 提问（或回答问题）
- 分享你的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- 在[博客](https://kubernetes.io/blog/)阅读更多 Kubernetes 最新动态
- 进一步了解 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team)
