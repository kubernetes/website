---
layout: blog
title: "介绍 SIG etcd"
slug: introducing-sig-etcd
date: 2023-11-07
canonicalUrl: https://etcd.io/blog/2023/introducing-sig-etcd/
---

<!--
layout: blog
title: "Introducing SIG etcd"
slug: introducing-sig-etcd
date: 2023-11-07
canonicalUrl: https://etcd.io/blog/2023/introducing-sig-etcd/
-->

<!--
**Authors**:  Han Kang (Google), Marek Siarkowicz (Google), Frederico Muñoz (SAS Institute)
-->
**作者**：Han Kang (Google), Marek Siarkowicz (Google), Frederico Muñoz (SAS Institute)

**译者**：Xin Li (Daocloud)

<!--
Special Interest Groups (SIGs) are a fundamental part of the Kubernetes project,
with a substantial share of the community activity happening within them.
When the need arises, [new SIGs can be created](https://github.com/kubernetes/community/blob/master/sig-wg-lifecycle.md),
and that was precisely what happened recently.
-->
特殊兴趣小组（SIG）是 Kubernetes 项目的基本组成部分，很大一部分的 Kubernetes 社区活动都在其中进行。
当有需要时，可以创建[新的 SIG](https://github.com/kubernetes/community/blob/master/sig-wg-lifecycle.md)，
而这正是最近发生的事情。

<!--
[SIG etcd](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md)
is the most recent addition to the list of Kubernetes SIGs.
In this article we will get to know it a bit better, understand its origins, scope, and plans.
-->
[SIG etcd](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md)
是 Kubernetes SIG 列表中的最新成员。在这篇文章中，我们将更好地认识它，了解它的起源、职责和计划。

<!--
## The critical role of etcd

If we look inside the control plane of a Kubernetes cluster, we will find
[etcd](https://kubernetes.io/docs/concepts/overview/components/#etcd),
a consistent and highly-available key value store used as Kubernetes' backing
store for all cluster data -- this description alone highlights the critical role that etcd plays,
and the importance of it within the Kubernetes ecosystem.
-->
## etcd 的关键作用

如果我们查看 Kubernetes 集群的控制平面内部，我们会发现
[etcd](https://kubernetes.io/zh-cn/docs/concepts/overview/components/#etcd)，
一个一致且高可用的键值存储，用作 Kubernetes 所有集群数据的后台数据库 -- 仅此描述就突出了
etcd 所扮演的关键角色，以及它在 Kubernetes 生态系统中的重要性。

<!--
This critical role makes the health of the etcd project and community an important consideration,
and [concerns about the state of the project](https://groups.google.com/a/kubernetes.io/g/steering/c/e-O-tVSCJOk/m/N9IkiWLEAgAJ)
in early 2022 did not go unnoticed. The changes in the maintainer team, amongst other factors,
contributed to a situation that needed to be addressed.
-->
由于 etcd 在生态中的关键作用，其项目和社区的健康成为了一个重要的考虑因素，
并且人们 2022 年初[对项目状态的担忧](https://groups.google.com/a/kubernetes.io/g/steering/c/e-O-tVSCJOk/m/N9IkiWLEAgAJ)
并没有被忽视。维护团队的变化以及其他因素导致了一些情况需要被解决。

<!--
## Why a special interest group

With the critical role of etcd in mind, it was proposed that the way forward would
be to create a new special interest group. If etcd was already at the heart of Kubernetes,
creating a dedicated SIG not only recognises that role, it would make etcd a first-class citizen of the Kubernetes community.
-->
## 为什么要设立特殊兴趣小组

考虑到 etcd 的关键作用，有人提出未来的方向是创建一个新的特殊兴趣小组。
如果 etcd 已经成为 Kubernetes 的核心，创建专门的 SIG 不仅是对这一角色的认可，
还会使 etcd 成为 Kubernetes 社区的一等公民。

<!--
Establishing SIG etcd creates a dedicated space to make explicit the contract
between etcd and Kubernetes api machinery and to prevent, on the etcd level,
changes which violate this contract. Additionally, etcd will be able to adop
the processes that Kubernetes offers its SIGs ([KEPs](https://www.kubernetes.dev/resources/keps/),
[PRR](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md),
[phased feature gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/),
amongst others) in order to improve the consistency and reliability of the codebase. Being able to use these processes will be a substantial benefit to the etcd community.
-->
SIG etcd 的成立为明确 etcd 和 Kubernetes API 机制之间的契约关系创造了一个专门的空间，
并防止在 etcd 级别上发生违反此契约的更改。此外，etcd 将能够采用 Kubernetes 提供的 SIG
流程（[KEP](https://www.kubernetes.dev/resources/keps/)、
[PRR](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md)、
[分阶段特性门控](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)以及其他流程）
以提高代码库的一致性和可靠性，这将为 etcd 社区带来巨大的好处。

<!--
As a SIG, etcd will also be able to draw contributor support from Kubernetes proper:
active contributions to etcd from Kubernetes maintainers would decrease the likelihood
of breaking Kubernetes changes, through the increased number of potential reviewers
and the integration with existing testing framework. This will not only benefit Kubernetes,
which will be able to better participate and shape the direction of etcd in terms of the critical role it plays,
but also etcd as a whole.
-->
作为 SIG，etcd 还能够从 Kubernetes 获得贡献者的支持：Kubernetes 维护者对 etcd
的积极贡献将通过增加潜在审核者数量以及与现有测试框架的集成来降低破坏 Kubernetes 更改的可能性。
这不仅有利于 Kubernetes，由于它能够更好地参与并塑造 etcd 所发挥的关键作用，从而也将有利于整个 etcd。

<!--
## About SIG etcd

The recently created SIG is already working towards its goals, defined in its
[Charter](https://github.com/kubernetes/community/blob/master/sig-etcd/charter.md)
and [Vision](https://github.com/kubernetes/community/blob/master/sig-etcd/vision.md).
The purpose is clear: to ensure etcd is a reliable, simple, and scalable production-ready
store for building cloud-native distributed systems and managing cloud-native infrastructure
via orchestrators like Kubernetes.
-->
## 关于 SIG etcd

最近创建的 SIG 已经在努力实现其[章程](https://github.com/kubernetes/community/blob/master/sig-etcd/charter.md)
和[愿景](https:///github.com/kubernetes/community/blob/master/sig-etcd/vision.md)中定义的目标。
其目的很明确：确保 etcd 是一个可靠、简单且可扩展的生产就绪存储，用于构建云原生分布式系统并通过 Kubernetes 等编排器管理云原生基础设施。

<!--
The scope of SIG etcd is not exclusively about etcd as a Kubernetes component,
it also covers etcd as a standard solution. Our goal is to make etcd the most
reliable key-value storage to be used anywhere, unconstrained by any Kubernetes-specific
limits and scaling to meet the requirements of many diverse use-cases.
-->
SIG etcd 的范围不仅仅涉及将 etcd 作为 Kubernetes 组件，还涵盖将 etcd 作为标准解决方案。
我们的目标是使 etcd 成为可在任何地方使用的最可靠的键值存储，不受任何 kubernetes 特定限制的约束，并且可以扩展以满足许多不同用例的需求。

<!--
We are confident that the creation of SIG etcd constitutes an important milestone
in the lifecycle of the project, simultaneously improving etcd itself,
and also the integration of etcd with Kubernetes. We invite everyone interested in etcd to
[visit our page](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md),
[join us at our Slack channel](https://kubernetes.slack.com/messages/etcd),
and get involved in this new stage of etcd's life.
-->
我们相信，SIG etcd 的创建将成为项目生命周期中的一个重要里程碑，同时改进 etcd 本身以及
etcd 与 Kubernetes 的集成。我们欢迎所有对 etcd
感兴趣的人[访问我们的页面](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md)、
[加入我们的 Slack 频道](https://kubernetes.slack.com/messages/etcd)，并参与 etcd 生命的新阶段。
