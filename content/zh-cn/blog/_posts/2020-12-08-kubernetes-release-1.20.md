---
layout: blog
title: 'Kubernetes 1.20: 最新版本'
date: 2020-12-08
slug: kubernetes-1-20-release-announcement
evergreen: true
---

<!-- ---
layout: blog
title: 'Kubernetes 1.20: The Raddest Release'
date: 2020-12-08
slug: kubernetes-1-20-release-announcement
evergreen: true
--- -->

**作者:** [Kubernetes 1.20 发布团队](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.20/release_team.md)
<!-- **Authors:** [Kubernetes 1.20 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.20/release_team.md) -->

我们很高兴地宣布 Kubernetes 1.20 的发布，这是我们 2020 年的第三个也是最后一个版本！此版本包含 42 项增强功能：11 项增强功能已升级到稳定版，15 项增强功能正在进入测试版，16 项增强功能正在进入 Alpha 版。
<!-- We’re pleased to announce the release of Kubernetes 1.20, our third and final release of 2020! This release consists of 42 enhancements: 11 enhancements have graduated to stable, 15 enhancements are moving to beta, and 16 enhancements are entering alpha. -->

1.20 发布周期在上一个延长的发布周期之后恢复到 11 周的正常节奏。这是一段时间以来功能最密集的版本之一：Kubernetes 创新周期仍呈上升趋势。此版本具有更多的 Alpha 而非稳定的增强功能，表明云原生生态系统仍有许多需要探索的地方。
<!-- The 1.20 release cycle returned to its normal cadence of 11 weeks following the previous extended release cycle. This is one of the most feature dense releases in a while: the Kubernetes innovation cycle is still trending upward. This release has more alpha than stable enhancements, showing that there is still much to explore in the cloud native ecosystem. -->

## 主题 {#major-themes}
<!-- ## Major Themes -->

### Volume 快照操作变得稳定 {#volume-snapshot-operations-goes-stable}

<!-- This feature provides a standard way to trigger volume snapshot operations and allows users to incorporate snapshot operations in a portable manner on any Kubernetes environment and supported storage providers. -->
此功能提供了触发卷快照操作的标准方法，并允许用户以可移植的方式在任何 Kubernetes 环境和支持的存储提供程序上合并快照操作。

<!-- Additionally, these Kubernetes snapshot primitives act as basic building blocks that unlock the ability to develop advanced, enterprise-grade, storage administration features for Kubernetes, including application or cluster level backup solutions. -->
此外，这些 Kubernetes 快照原语充当基本构建块，解锁为 Kubernetes 开发高级企业级存储管理功能的能力，包括应用程序或集群级备份解决方案。

<!-- Note that snapshot support requires Kubernetes distributors to bundle the Snapshot controller, Snapshot CRDs, and validation webhook. A CSI driver supporting the snapshot functionality must also be deployed on the cluster. -->
请注意，快照支持要求 Kubernetes 分销商捆绑 Snapshot 控制器、Snapshot CRD 和验证 webhook。还必须在集群上部署支持快照功能的 CSI 驱动程序。



<!-- ### Kubectl Debug Graduates to Beta -->
### Kubectl Debug 功能升级到 Beta {#kubectl-debug-graduates-to-beta}

<!-- The `kubectl alpha debug` features graduates to beta in 1.20, becoming `kubectl debug`. The feature provides support for common debugging workflows directly from kubectl. Troubleshooting scenarios supported in this release of kubectl include: -->
`kubectl alpha debug` 功能在 1.20 中升级到测试版，成为 `kubectl debug`. 该功能直接从 kubectl 提供对常见调试工作流的支持。此版本的 kubectl 支持的故障排除场景包括：

<!-- * Troubleshoot workloads that crash on startup by creating a copy of the pod that uses a different container image or command.
* Troubleshoot distroless containers by adding a new container with debugging tools, either in a new copy of the pod or using an ephemeral container. (Ephemeral containers are an alpha feature that are not enabled by default.)
* Troubleshoot on a node by creating a container running in the host namespaces and with access to the host’s filesystem. -->
* 通过创建使用不同容器映像或命令的 pod 副本，对在启动时崩溃的工作负载进行故障排除。
* 通过在 pod 的新副本或使用临时容器中添加带有调试工具的新容器来对 distroless 容器进行故障排除。（临时容器是默认未启用的 alpha 功能。）
* 通过创建在主机命名空间中运行并可以访问主机文件系统的容器来对节点进行故障排除。

<!-- Note that as a new built-in command, `kubectl debug` takes priority over any kubectl plugin named “debug”. You must rename the affected plugin. -->
请注意，作为新的内置命令，`kubectl debug` 优先于任何名为 “debug” 的 kubectl 插件。你必须重命名受影响的插件。

<!-- Invocations using `kubectl alpha debug` are now deprecated and will be removed in a subsequent release. Update your scripts to use `kubectl debug`. For more information about `kubectl debug`, see [Debugging Running Pods](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/). -->
`kubectl alpha debug` 现在不推荐使用，并将在后续版本中删除。更新你的脚本以使用 `kubectl debug`。 有关更多信息 `kubectl debug`，请参阅[调试正在运行的 Pod]((https://kubernetes.io/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/)。

<!-- ### Beta: API Priority and Fairness -->
### 测试版：API 优先级和公平性 {#beta-api-priority-and-fairness)

<!-- Introduced in 1.18, Kubernetes 1.20 now enables API Priority and Fairness (APF) by default. This allows `kube-apiserver` to categorize incoming requests by priority levels. -->
Kubernetes 1.20 由 1.18 引入，现在默认启用 API 优先级和公平性 (APF)。这允许 `kube-apiserver` 按优先级对传入请求进行分类。

<!-- ### Alpha with updates: IPV4/IPV6 -->
### Alpha 更新：IPV4/IPV6 {#alpha-with-updates-ipv4-ipv6}

<!-- The IPv4/IPv6 dual stack has been reimplemented to support dual stack services based on user and community feedback. This allows both IPv4 and IPv6 service cluster IP addresses to be assigned to a single service, and also enables a service to be transitioned from single to dual IP stack and vice versa. -->
基于用户和社区反馈，重新实现了 IPv4/IPv6 双栈以支持双栈服务。
这允许将 IPv4 和 IPv6 服务集群 IP 地址分配给单个服务，还允许服务从单 IP 堆栈转换为双 IP 堆栈，反之亦然。

<!-- ### GA: Process PID Limiting for Stability -->
### GA：进程 PID 稳定性限制 {#ga-process-pid-limiting-for-stability}

<!-- Process IDs (pids) are a fundamental resource on Linux hosts. It is trivial to hit the task limit without hitting any other resource limits and cause instability to a host machine. -->
进程 ID (pid) 是 Linux 主机上的基本资源。达到任务限制而不达到任何其他资源限制并导致主机不稳定是很可能发生的。

<!-- Administrators require mechanisms to ensure that user pods cannot induce pid exhaustion that prevents host daemons (runtime, kubelet, etc) from running. In addition, it is important to ensure that pids are limited among pods in order to ensure they have limited impact to other workloads on the node. -->
<!-- After being enabled-by-default for a year, SIG Node graduates PID Limits to GA on both `SupportNodePidsLimit` (node-to-pod PID isolation) and `SupportPodPidsLimit` (ability to limit PIDs per pod). -->
管理员需要机制来确保用户 pod 不会导致 pid 耗尽，从而阻止主机守护程序（运行时、kubelet 等）运行。此外，重要的是要确保 pod 之间的 pid 受到限制，以确保它们对节点上的其他工作负载的影响有限。
默认启用一年后，SIG Node 在 `SupportNodePidsLimit`（节点到 Pod PID 隔离）和 `SupportPodPidsLimit`（限制每个 Pod 的 PID 的能力）上都将 PID 限制升级为 GA。

<!-- ### Alpha: Graceful node shutdown -->
### Alpha：节点体面地关闭 {#alpha-graceful-node-shutdown}

<!-- Users and cluster administrators expect that pods will adhere to expected pod lifecycle including pod termination. Currently, when a node shuts down, pods do not follow the expected pod termination lifecycle and are not terminated gracefully which can cause issues for some workloads.
The `GracefulNodeShutdown` feature is now in Alpha. `GracefulNodeShutdown` makes the kubelet aware of node system shutdowns, enabling graceful termination of pods during a system shutdown. -->
用户和集群管理员希望 Pod 遵守预期的 Pod 生命周期，包括 Pod 终止。目前，当一个节点关闭时，Pod 不会遵循预期的 Pod 终止生命周期，也不会正常终止，这可能会导致某些工作负载出现问题。
该 `GracefulNodeShutdown` 功能现在处于 Alpha 阶段。`GracefulNodeShutdown` 使 kubelet 知道节点系统关闭，从而在系统关闭期间正常终止 pod。

<!-- ## Major Changes -->
## 主要变化 {#major-changes}

<!-- ### Dockershim Deprecation -->
### Dockershim 弃用 {#dockershim-deprecation}

<!-- Dockershim, the container runtime interface (CRI) shim for Docker is being deprecated. Support for Docker is deprecated and will be removed in a future release. Docker-produced images will continue to work in your cluster with all CRI compliant runtimes as Docker images follow the Open Container Initiative (OCI) image specification.
The Kubernetes community has written a [detailed blog post about deprecation](https://blog.k8s.io/2020/12/02/dont-panic-kubernetes-and-docker/) with [a dedicated FAQ page for it](https://blog.k8s.io/2020/12/02/dockershim-faq/). -->
Dockershim，Docker 的容器运行时接口 (CRI) shim 已被弃用。不推荐使用对 Docker 的支持，并将在未来版本中删除。由于 Docker 映像遵循开放容器计划 (OCI) 映像规范，因此 Docker 生成的映像将继续在具有所有 CRI 兼容运行时的集群中工作。
Kubernetes 社区写了一篇关于弃用的详细[博客文章](https://blog.k8s.io/2020/12/02/dont-panic-kubernetes-and-docker/)，并为其提供了一个专门的常见问题[解答页面](https://blog.k8s.io/2020/12/02/dockershim-faq/)。

<!-- ### Exec Probe Timeout Handling -->
### Exec 探测超时处理 {#exec-probe-timeout-handling}

<!-- A longstanding bug regarding exec probe timeouts that may impact existing pod definitions has been fixed. Prior to this fix, the field `timeoutSeconds` was not respected for exec probes. Instead, probes would run indefinitely, even past their configured deadline, until a result was returned. With this change, the default value of `1 second` will be applied if a value is not specified and existing pod definitions may no longer be sufficient if a probe takes longer than one second. A feature gate, called `ExecProbeTimeout`, has been added with this fix that enables cluster operators to revert to the previous behavior, but this will be locked and removed in subsequent releases. In order to revert to the previous behavior, cluster operators should set this feature gate to `false`. -->
一个关于 exec 探测超时的长期错误可能会影响现有的 pod 定义，已得到修复。在此修复之前，exec 探测器不考虑 `timeoutSeconds` 字段。相反，探测将无限期运行，甚至超过其配置的截止日期，直到返回结果。
通过此更改，如果未指定值，将应用默认值 `1 second`，并且如果探测时间超过一秒，现有 pod 定义可能不再足够。
新引入的 `ExecProbeTimeout` 特性门控所提供的修复使集群操作员能够恢复到以前的行为，但这种行为将在后续版本中锁定并删除。为了恢复到以前的行为，集群运营商应该将此特性门控设置为 `false`。

<!-- Please review the updated documentation regarding [configuring probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes) for more details. -->
有关更多详细信息，请查看有关配置探针的[更新文档](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes)。

<!-- ## Other Updates -->
## 其他更新 {#other-updates}

<!-- ### Graduated to Stable -->
### 稳定版 {#graduated-to-stable}

<!-- * [RuntimeClass](https://github.com/kubernetes/enhancements/issues/585)
* [Built-in API Types Defaults](https://github.com/kubernetes/enhancements/issues/1929)
* [Add Pod-Startup Liveness-Probe Holdoff](https://github.com/kubernetes/enhancements/issues/950)
* [Support CRI-ContainerD On Windows](https://github.com/kubernetes/enhancements/issues/1001)
* [SCTP Support for Services](https://github.com/kubernetes/enhancements/issues/614)
* [Adding AppProtocol To Services And Endpoints](https://github.com/kubernetes/enhancements/issues/1507) -->
* [RuntimeClass](https://github.com/kubernetes/enhancements/issues/585)
* [内置 API 类型默认值](https://github.com/kubernetes/enhancements/issues/1929)
* [添加了对 Pod 层面启动探针和活跃性探针的扼制](https://github.com/kubernetes/enhancements/issues/950)
* [在 Windows 上支持 CRI-ContainerD](https://github.com/kubernetes/enhancements/issues/1001)
* [SCTP 对 Services 的支持](https://github.com/kubernetes/enhancements/issues/614)
* [将 AppProtocol 添加到 Services 和 Endpoints 上](https://github.com/kubernetes/enhancements/issues/1507) 

<!-- ### Notable Feature Updates -->
### 值得注意的功能更新 {#notable-feature-updates}

<!-- * [CronJobs](https://github.com/kubernetes/enhancements/issues/19) -->
* [CronJobs](https://github.com/kubernetes/enhancements/issues/19)

<!-- # Release notes -->
# 发行说明 {#release-notes}

<!-- You can check out the full details of the 1.20 release in the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md). -->
你可以在[发行说明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md)中查看 1.20 发行版的完整详细信息。

<!-- # Availability of release -->
# 可用的发布 {#availability-of-release}

<!-- Kubernetes 1.20 is available for [download on GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.20.0). There are some great resources out there for getting started with Kubernetes. You can check out some [interactive tutorials](https://kubernetes.io/docs/tutorials/) on the main Kubernetes site, or run a local cluster on your machine using Docker containers with [kind](https://kind.sigs.k8s.io). If you’d like to try building a cluster from scratch, check out the [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) tutorial by Kelsey Hightower. -->
Kubernetes 1.20 可在 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.20.0) 上下载。有一些很棒的资源可以帮助你开始使用 Kubernetes。你可以在 Kubernetes 主站点上查看一些[交互式教程](https://kubernetes.io/docs/tutorials/)，或者使用 [kind](https://kind.sigs.k8s.io) 的 Docker 容器在你的机器上运行本地集群。如果你想尝试从头开始构建集群，请查看 Kelsey Hightower 的 [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) 教程。

<!-- # Release Team -->
# 发布团队 {#release-team}

<!-- This release was made possible by a very dedicated group of individuals, who came together as a team in the midst of a lot of things happening out in the world. A huge thank you to the release lead Jeremy Rickard, and to everyone else on the release team for supporting each other, and working so hard to deliver the 1.20 release for the community. -->
这个版本是由一群非常敬业的人促成的，他们在世界上发生的许多事情的时段作为一个团队走到了一起。
非常感谢发布负责人 Jeremy Rickard 以及发布团队中的其他所有人，感谢他们相互支持，并努力为社区发布 1.20 版本。

<!-- # Release Logo -->
# 发布 Logo {#release-logo}

![Kubernetes 1.20 Release Logo](/images/blog/2020-12-08-kubernetes-1.20-release-announcement/laser.png)

[raddest](https://www.dictionary.com/browse/rad): *adjective*, Slang. excellent; wonderful; cool:

<!-- > The Kubernetes 1.20 Release has been the raddest release yet. -->
> Kubernetes 1.20 版本是迄今为止最激动人心的版本。

<!-- 2020 has been a challenging year for many of us, but Kubernetes contributors have delivered a record-breaking number of enhancements in this release. That is a great accomplishment, so the release lead wanted to end the year with a little bit of levity and pay homage to [Kubernetes 1.14 - Caturnetes](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.14) with a "rad" cat named Humphrey. -->
2020 年对我们中的许多人来说都是充满挑战的一年，但 Kubernetes 贡献者在此版本中提供了创纪录的增强功能。这是一项了不起的成就，因此发布负责人希望以一点轻松的方式结束这一年，并向 [Kubernetes 1.14 - Caturnetes](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.14) 和一只名叫 Humphrey 的 “rad” 猫致敬。

<!-- Humphrey is the release lead's cat and has a permanent [`blep`](https://www.inverse.com/article/42316-why-do-cats-blep-science-explains). *Rad* was pretty common slang in the 1990s in the United States, and so were laser backgrounds. Humphrey in a 1990s style school picture felt like a fun way to end the year. Hopefully, Humphrey and his *blep* bring you a little joy at the end of 2020! -->
Humphrey是发布负责人的猫，有一个永久的 `blep`. 在 1990 年代，*Rad* 是美国非常普遍的俚语，激光背景也是如此。Humphrey 在 1990 年代风格的学校照片中感觉像是结束这一年的有趣方式。希望 Humphrey 和它的 *blep* 在 2020 年底给你带来一点快乐！

<!-- The release logo was created by [Henry Hsu - @robotdancebattle](https://www.instagram.com/robotdancebattle/). -->
发布标志由 [Henry Hsu - @robotdancebattle](https://www.instagram.com/robotdancebattle/) 创建。

<!-- # User Highlights -->
# 用户亮点 {#user-highlights}

<!-- - Apple is operating multi-thousand node Kubernetes clusters in data centers all over the world. Watch [Alena Prokharchyk's KubeCon NA Keynote](https://youtu.be/Tx8qXC-U3KM) to learn more about their cloud native journey. -->
- Apple 正在世界各地的数据中心运行数千个节点的 Kubernetes 集群。观看 [Alena Prokarchyk](https://youtu.be/Tx8qXC-U3KM) 的 KubeCon NA 主题演讲，了解有关他们的云原生之旅的更多信息。

<!-- # Project Velocity -->
# 项目速度 {#project-velocity}

<!-- The [CNCF K8s DevStats project](https://k8s.devstats.cncf.io/) aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing, and is a neat illustration of the depth and breadth of effort that goes into evolving this ecosystem. -->
[CNCF K8S DevStats 项目](https://k8s.devstats.cncf.io/)聚集了许多有关Kubernetes和各分项目的速度有趣的数据点。这包括从个人贡献到做出贡献的公司数量的所有内容，并且清楚地说明了为发展这个生态系统所做的努力的深度和广度。

<!-- In the v1.20 release cycle, which ran for 11 weeks (September 25 to December 9), we saw contributions from [967 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.19.0%20-%20now&var-metric=contributions) and [1335 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.19.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All) ([44 of whom](https://k8s.devstats.cncf.io/d/52/new-contributors?orgId=1&from=1601006400000&to=1607576399000&var-repogroup_name=Kubernetes) made their first Kubernetes contribution) from [26 countries](https://k8s.devstats.cncf.io/d/50/countries-stats?orgId=1&from=1601006400000&to=1607576399000&var-period_name=Quarter&var-countries=All&var-repogroup_name=Kubernetes&var-metric=rcommitters&var-cum=countries). -->
在持续 11 周（9 月 25 日至 12 月 9 日）的 v1.20 发布周期中，我们看到了来自 [26 个国家/地区](https://k8s.devstats.cncf.io/d/50/countries-stats?orgId=1&from=1601006400000&to=1607576399000&var-period_name=Quarter&var-countries=All&var-repogroup_name=Kubernetes&var-metric=rcommitters&var-cum=countries) 的 [967 家公司](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.19.0%20-%20now&var-metric=contributions) 和 [1335 名个人](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.19.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All)（其中 [44 人](https://k8s.devstats.cncf.io/d/52/new-contributors?orgId=1&from=1601006400000&to=1607576399000&var-repogroup_name=Kubernetes)首次为 Kubernetes 做出贡献）的贡献。

<!-- # Ecosystem Updates -->
# 生态系统更新 {#ecosystem-updates}

<!-- - KubeCon North America just wrapped up three weeks ago, the second such event to be virtual! All talks are [now available to all on-demand](https://www.youtube.com/playlist?list=PLj6h78yzYM2Pn8RxfLh2qrXBDftr6Qjut) for anyone still needing to catch up!
- In June, the Kubernetes community formed a new working group as a direct response to the Black Lives Matter protests occurring across America. WG Naming's goal is to remove harmful and unclear language in the Kubernetes project as completely as possible and to do so in a way that is portable to other CNCF projects. A great introductory talk on this important work and how it is conducted was given [at KubeCon 2020 North America](https://sched.co/eukp), and the initial impact of this labor [can actually be seen in the v1.20 release](https://github.com/kubernetes/enhancements/issues/2067).
- Previously announced this summer, [The Certified Kubernetes Security Specialist (CKS) Certification](https://www.cncf.io/announcements/2020/11/17/kubernetes-security-specialist-certification-now-available/) was released during Kubecon NA for immediate scheduling!  Following the model of CKA and CKAD, the CKS is a performance-based exam, focused on security-themed competencies and domains.  This exam is targeted at current CKA holders, particularly those who want to round out their baseline knowledge in securing cloud workloads (which is all of us, right?). -->
- KubeCon North America 三周前刚刚结束，这是第二个虚拟的此类活动！现在所有演讲都可以[点播](https://www.youtube.com/playlist?list=PLj6h78yzYM2Pn8RxfLh2qrXBDftr6Qjut)，供任何需要赶上的人使用！
- 6 月，Kubernetes 社区成立了一个新的工作组，作为对美国各地发生的 Black Lives Matter 抗议活动的直接回应。WG Naming 的目标是尽可能彻底地删除 Kubernetes 项目中有害和不清楚的语言，并以可移植到其他 CNCF 项目的方式进行。在 [KubeCon 2020 North America](https://sched.co/eukp) 上就这项重要工作及其如何进行进行了精彩的介绍性演讲，这项工作的初步影响[实际上可以在 v1.20 版本中看到](https://github.com/kubernetes/enhancements/issues/2067)。
- 此前于今年夏天宣布，在 Kubecon NA 期间发布了经认证的 [Kubernetes 安全专家 (CKS) 认证](https://www.cncf.io/announcements/2020/11/17/kubernetes-security-specialist-certification-now-available/) ，以便立即安排！遵循 CKA 和 CKAD 的模型，CKS 是一项基于性能的考试，侧重于以安全为主题的能力和领域。该考试面向当前的 CKA 持有者，尤其是那些想要完善其在保护云工作负载方面的基础知识的人（这是我们所有人，对吧？）。
  


<!-- # Event Updates -->
# 活动更新 {#event-updates}

<!-- KubeCon + CloudNativeCon Europe 2021 will take place May 4 - 7, 2021! Registration will open on January 11. You can find more information about the conference [here](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/). Remember that [the CFP](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/program/cfp/) closes on Sunday, December 13, 11:59pm PST! -->
KubeCon + CloudNativeCon Europe 2021 将于 2021 年 5 月 4 日至 7 日举行！注册将于 1 月 11 日开放。你可以在[此处](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/)找到有关会议的更多信息。
请记住，[CFP](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/program/cfp/) 将于太平洋标准时间 12 月 13 日星期日晚上 11:59 关闭！

<!-- # Upcoming release webinar -->
# 即将发布的网络研讨会 {#upcoming-release-webinar}

<!-- Stay tuned for the upcoming release webinar happening this January. -->
请继续关注今年 1 月即将举行的发布网络研讨会。

<!-- # Get Involved -->
# 参与其中 {#get-involved}

<!-- If you’re interested in contributing to the Kubernetes community, Special Interest Groups (SIGs) are a great starting point. Many of them may align with your interests! If there are things you’d like to share with the community, you can join the weekly community meeting, or use any of the following channels: -->
如果你有兴趣为 Kubernetes 社区做出贡献，那么特别兴趣小组 (SIG) 是一个很好的起点。其中许多可能符合你的兴趣！如果你有什么想与社区分享的内容，你可以参加每周的社区会议，或使用以下任一渠道：

<!-- * Find out more about contributing to Kubernetes at the new [Kubernetes Contributor website](https://www.kubernetes.dev/)
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team) -->

* 在新的 [Kubernetes Contributor 网站](https://www.kubernetes.dev/)上了解更多关于为Kubernetes 做出贡献的信息
* 在 Twitter [@Kubernetesio](https://twitter.com/kubernetesio) 上关注我们以获取最新更新
* 加入关于讨论的[社区](https://discuss.kubernetes.io/)讨论
* 加入 [Slack 社区](http://slack.k8s.io/)
* 分享你的 [Kubernetes 故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* 在[博客](https://kubernetes.io/blog/)上阅读更多关于 Kubernetes 发生的事情
* 了解有关 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team)的更多信息
