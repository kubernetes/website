---
layout: blog
title: "逐个 KEP 地增强 Kubernetes"
date: 2022-08-11
slug: enhancing-kubernetes-one-kep-at-a-time
---
<!--
layout: blog
title: "Enhancing Kubernetes one KEP at a Time"
date: 2022-08-11
slug: enhancing-kubernetes-one-kep-at-a-time
canonicalUrl: https://www.k8s.dev/blog/2022/08/11/enhancing-kubernetes-one-kep-at-a-time/
-->

<!--
**Author:** Ryler Hockenbury (Mastercard)
-->
**作者：** Ryler Hockenbury (Mastercard)

<!--
Did you know that Kubernetes v1.24 has [46 enhancements](https://kubernetes.io/blog/2022/05/03/kubernetes-1-24-release-announcement/)? That's a lot of new functionality packed into a 4-month release cycle. The Kubernetes release team coordinates the logistics of the release, from remediating test flakes to publishing updated docs. It's a ton of work, but they always deliver.
-->
你知道 Kubernetes v1.24 有 [46 项增强功能](https://kubernetes.io/zh-cn/blog/2022/05/03/kubernetes-1-24-release-announcement/)吗？
在 4 个月的发布周期中包含了很多新功能。Kubernetes 发布团队负责协调发布的后勤工作，从修复测试漏洞到发布更新的文档。
这项工作的工作量很大，但他们总能做到。

<!--
The release team comprises around 30 people across six subteams - Bug Triage, CI Signal, Enhancements, Release Notes, Communications, and Docs.  Each of these subteams manages a component of the release. This post will focus on the role of the enhancements subteam and how you can get involved.
-->
发布团队由大约 30 人组成，包括 6 个子团队：Bug Triage、CI Signal、Enhancements、Release Notes、
Communications、和 Docs 子团队。这些子团队中的每个团队都管理一个版本组件。
这篇文章将重点介绍增强子团队的角色以及你如何参与其中。

<!--
## What's the enhancements subteam?
-->
## 什么是增强子团队？

<!--
Great question. We'll get to that in a second but first, let's talk about how features are managed in Kubernetes.
-->
好问题。我们稍后讨论这个问题，首先，让我们谈谈如何在 Kubernetes 中管理功能特性。

<!--
Each new feature requires a [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/README.md) - KEP for short. KEPs are small structured design documents that provide a way to propose and coordinate new features. The KEP author describes the motivation, design (and alternatives), risks, and tests - then community members provide feedback to build consensus.
-->
每个新特性都需要一个 [Kubernetes 增强提案](https://github.com/kubernetes/enhancements/blob/master/keps/README.md)——简称 KEP。
KEP 是小型结构化设计文档，提供了一种用于提出和协调新特性的方法。首先，KEP 作者描述新特性的背景、
设计方案（和替代方案）、风险和相关测试。然后通过社区成员提供反馈达成共识。

<!--
KEPs are submitted and updated through a pull request (PR) workflow on the [k/enhancements repo](https://github.com/kubernetes/enhancements). Features start in alpha and move through a graduation process to beta and stable as they mature. For example, here's a cool KEP about [privileged container support on Windows Server](https://github.com/kubernetes/enhancements/blob/master/keps/sig-windows/1981-windows-privileged-container-support/kep.yaml).  It was introduced as alpha in Kubernetes v1.22 and graduated to beta in v1.23.
-->
在 [k/enhancements repo](https://github.com/kubernetes/enhancements)
仓上通过拉取请求（PR）工作流对 KEP 进行提交和更新。
特性从 Alpha 阶段开始，经过逐步演进发展到 Beta 阶段，然后逐渐趋于稳定。例如，这是一个关于
[Windows 服务器上的特权容器支持](https://github.com/kubernetes/enhancements/blob/master/keps/sig-windows/1981-windows-privileged-container-support/kep.yaml)
的非常不错的 KEP。它在 Kubernetes v1.22 版本中作为 Alpha 特性引入，在 v1.23 版本中升级为 Beta。

<!--
Now getting back to the question - the enhancements subteam coordinates the lifecycle tracking of the KEPs for each release. Each KEP is required to meet a set of requirements to be cleared for inclusion in a release. The enhancements subteam verifies each requirement for each KEP and tracks the status.
-->
现在回到问题——增强子团队协调跟踪每个版本的 KEP 的生命周期。
每个 KEP 都需要满足一系列要求后才能被引入到发布版本中。增强子团队验证每个 KEP 的每个要求并跟踪其状态。

<!--
At the start of a release, [Kubernetes Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) submit their enhancements to opt into a release. A typical release might have from 60 to 90 enhancements at the beginning.  During the release, many enhancements will drop out. Some do not quite meet the KEP requirements, and others do not complete their implementation in code. About 60%-70% of the opted-in KEPs will make it into the final release.
-->
在一个版本开始时，[Kubernetes 特别兴趣小组](https://github.com/kubernetes/community/blob/master/sig-list.md)（SIGs）
提交他们选入此版本的增强功能。通常版本在开始时可能有 60 到 90 个增强功能。在发布期间，许多增强功能会被移除。
移除的增强功能有些不完全符合 KEP 要求，另一些是代码实现还未完成。
大约 60%-70% 选择加入版本的 KEP 会进入最终版本。

<!--
## What does the enhancements subteam do?

Another great question, keep them coming! The enhancements team is involved in two crucial milestones during each release: enhancements freeze and code freeze.
-->
## 增强子团队是做什么的？

又一个好问题，继续！在每个版本中，增强团队都涉及到两个关键的里程碑：增强冻结和代码冻结。

<!--
#### Enhancements Freeze
-->
#### 增强冻结

<!--
Enhancements freeze is the deadline for a KEP to be complete in order for the enhancement to be included in a release. It's a quality gate to enforce alignment around maintaining and updating KEPs. The most notable requirements are a (1) [production readiness review ](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md)(PRR) and a (2) [KEP file](https://github.com/kubernetes/enhancements/tree/master/keps/NNNN-kep-template) with a complete test plan and graduation criteria.
-->
增强功能冻结是完成 KEP 以便将增强功能包含在版本中的最后期限。它是围绕维护和更新 KEP 实施一致性的质量检验门禁。
最值得注意的要求是：（1）[生产准备审查](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md)（PRR）和
（2）具有完整测试计划和毕业标准的 [KEP 文件](https://github.com/kubernetes/enhancements/tree/master/keps/NNNN-kep-template)。

<!--
The enhancements subteam communicates to each KEP author through comments on the KEP issue on Github. As a first step, they'll verify the status and check if it meets the requirements.  The KEP gets marked as tracked after satisfying the requirements; otherwise, it's considered at risk. If a KEP is still at risk when enhancement freeze is in effect, the KEP is removed from the release.
-->
增强子团队通过在 Github 上就 KEP 问题发表评论，与每个 KEP 作者进行交流。
第一步，他们将验证 KEP 状态并检查它是否符合要求。KEP 在满足要求后被标记为已跟踪；否则，KEP 被认为有风险。
如果在增强冻结生效时 KEP 仍然存在风险，则从版本中移除该 KEP。

<!--
This part of the cycle is typically the busiest for the enhancements subteam because of the large number of KEPs to groom, and each KEP might need to be visited multiple times to verify whether it meets requirements.
-->
对于增强子团队来说，发布周期的这一部分工作通常是最繁忙的，因为要梳理的 KEP 数量很大，每个 KEP 可能需要多次访问，以验证其是否满足要求。

<!--
#### Code Freeze
-->
#### 代码冻结

<!--
Code freeze is the implementation deadline for all enhancements. The code must be implemented, reviewed, and merged by this point if a code change or update is needed for the enhancement. The latter third of the release is focused on stabilizing the codebase - fixing flaky tests, resolving various regressions, and preparing docs - and all the code needs to be in place before those steps can happen.
-->
代码冻结是所有增强功能的实现截止日期。如果增强功能需要更改或更新代码，则必须在此节点之前完成代码实现、审阅并合入代码。
版本后三分之一时间要专注于稳定代码库——修复不稳定的测试、解决各种回归问题和准备文档——并且所有代码都需要在这些步骤发生之前就绪。

<!--
The enhancements subteam verifies that all PRs for an enhancement are merged into the [Kubernetes codebase](https://github.com/kubernetes/kubernetes) (k/k). During this period, the subteam reaches out to KEP authors to understand what PRs are part of the KEP, verifies that those PRs get merged, and then updates the status of the KEP. The enhancement is removed from the release if the code isn't all merged before the code freeze deadline.
-->
增强子团队验证增强的所有 PR 是否已合入到 [Kubernetes codebase](https://github.com/kubernetes/kubernetes)（k/k）。
在此期间，子团队与 KEP 作者联系以了解哪些 PR 是 KEP 的一部分，确认这些 PR 是否已合入，然后更新 KEP 的状态。
如果代码在代码冻结截止日期之前没有全部合入，则该增强功能将从版本中删除。

<!--
## How can I get involved with the release team?
-->
## 我如何参与发布团队？

<!--
I'm glad you asked. The most direct way is to apply to be a [release team shadow](https://github.com/kubernetes/sig-release/blob/master/release-team/shadows.md). The shadow role is a hands-on apprenticeship intended to prepare individuals for leadership positions on the release team. Many shadow roles are non-technical and do not require prior contributions to the Kubernetes codebase.
-->
我很高兴你问了。最直接的方法是申请成为一个[发布团队影子](https://github.com/kubernetes/sig-release/blob/master/release-team/shadows.md)。
影子角色是一种实践性的学徒，旨在为个人在发布团队中担任领导职务做准备。
许多影子角色是非技术性的，不需要事先对 Kubernetes 代码库作出贡献。

<!--
With 3 Kubernetes releases every year and roughly 25 shadows per release, the release team is always in need of individuals wanting to contribute. Before each release cycle, the release team opens the application for the shadow program. When the application goes live, it's posted in the [Kubernetes Dev Mailing List](https://groups.google.com/a/kubernetes.io/g/dev).  You can subscribe to notifications from that list (or check it regularly!) to watch when the application opens. The announcement will typically go out in mid-April, mid-July, and mid-December - or roughly a month before the start of each release.
-->
每年发布 3 个 Kubernetes 版本，每个版本大约有 25 个影子，发布团队总是需要愿意做出贡献的人。
在每个发布周期之前，发布团队会开放影子计划的申请。当申请上线时，会在
[Kubernetes Dev Mailing List](https://groups.google.com/a/kubernetes.io/g/dev) 中发布。
你可以订阅该列表中的通知（或定期查看！）以查看申请何时开放。
该公告通常会在 4 月中旬、7 月中旬和 12 月中旬发布，或者在每个版本开始前大约一个月发布。

<!--
## How can I find out more?
-->
## 我怎样才能了解更多信息？

<!--
Check out the [role handbooks](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks) if you're curious about the specifics of all the Kubernetes release subteams. The handbooks capture the logistics of each subteam, including a week-by-week breakdown of the subteam activities.  It's an excellent reference for getting to know each team better.
-->
如果你对所有 Kubernetes 发布子团队的细节有兴趣，
请查看[角色手册](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks)。
手册记录了每个子团队的后勤工作，包括子团队活动的每周细分。对于更好地了解每个团队来说，这是一个很好地参考。

<!--
You can also check out the release-related Kubernetes slack channels - particularly #release, #sig-release, and #sig-arch. These channels have discussions and updates surrounding many aspects of the release.
-->
你还可以查看与发布相关的 Kubernetes slack 频道——特别是 #release、#sig-release 和 #sig-arch。
这些频道围绕发布的许多方面进行了讨论和更新。
