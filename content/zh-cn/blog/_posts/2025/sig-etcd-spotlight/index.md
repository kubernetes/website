---
layout: blog
title: "聚焦 SIG etcd"
slug: sig-etcd-spotlight
canonicalUrl: https://www.kubernetes.dev/blog/2025/02/19/sig-etcd-spotlight
date: 2025-03-04
author: "Frederico Muñoz (SAS Institute)"
translator: >
  [Paco Xu](https://github.com/pacoxu)(DaoCloud)
---

<!--
layout: blog
title: "Spotlight on SIG etcd"
slug: sig-etcd-spotlight
canonicalUrl: https://www.kubernetes.dev/blog/2025/02/19/sig-etcd-spotlight
date: 2025-03-04
author: "Frederico Muñoz (SAS Institute)"
-->

<!--
In this SIG etcd spotlight we talked with [James Blair](https://github.com/jmhbnz), [Marek
Siarkowicz](https://github.com/serathius), [Wenjia Zhang](https://github.com/wenjiaswe), and
[Benjamin Wang](https://github.com/ahrtr) to learn a bit more about this Kubernetes Special Interest
Group.
-->
在这篇 SIG etcd 聚焦访谈中，我们与 [James Blair](https://github.com/jmhbnz)、
[Marek Siarkowicz](https://github.com/serathius)、[Wenjia Zhang](https://github.com/wenjiaswe)
和 [Benjamin Wang](https://github.com/ahrtr) 进行了交流，
以更深入了解这个 Kubernetes 特别兴趣小组。

<!--
## Introducing SIG etcd
-->
## 认识 SIG etcd

<!--
**Frederico: Hello, thank you for the time! Let’s start with some introductions, could you tell us a
bit about yourself, your role and how you got involved in Kubernetes.**
-->
**Frederico：你好，感谢接受采访！我们先从自我介绍开始，可以请你讲讲你自己、你的角色，以及你是如何参与 Kubernetes 的吗？**

<!--
**Benjamin:** Hello, I am Benjamin. I am a SIG etcd Tech Lead and one of the etcd maintainers. I
work for VMware, which is part of the Broadcom group. I got involved in Kubernetes & etcd & CSI
([Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md))
because of work and also a big passion for open source. I have been working on Kubernetes & etcd
(and also CSI) since 2020.
-->
**Benjamin：** 大家好，我是 Benjamin。我是 SIG etcd 的 Tech Lead，也是 etcd 维护者之一。
我在 VMware 工作，VMware 属于 Broadcom 集团。
我参与 Kubernetes、etcd 和 CSI
（[Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md)）
既是因为工作需要，也因为我对开源有很强热情。
从 2020 年起，我一直在 Kubernetes、etcd（以及 CSI）相关领域工作。

<!--
**James:** Hey team, I’m James, a co-chair for SIG etcd and etcd maintainer. I work at Red Hat as a
Specialist Architect helping people adopt cloud native technology. I got involved with the
Kubernetes ecosystem in 2019. Around the end of 2022 I noticed how the etcd community and project
needed help so started contributing as often as I could. There is a saying in our community that
"you come for the technology, and stay for the people": for me this is absolutely real, it’s been a
wonderful journey so far and I’m excited to support our community moving forward.
-->
**James：** 大家好，我是 James，是 SIG etcd 的联合主席，也是 etcd 维护者。
我在 Red Hat 担任 Specialist Architect，帮助大家采用云原生技术。
我在 2019 年开始参与 Kubernetes 生态。
到 2022 年底，我注意到 etcd 社区和项目需要更多支持，于是开始尽可能多地贡献。
我们社区里有句话：“为技术而来，为人而留”。
对我来说这句话完全真实，这一路是非常棒的旅程，我也很期待继续支持社区向前发展。

<!--
**Marek:** Hey everyone, I'm Marek, the SIG etcd lead. At Google, I lead the GKE etcd team, ensuring
a stable and reliable experience for all GKE users. My Kubernetes journey began with [SIG
Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation), where I
created and led the [Kubernetes Structured Logging effort](https://kubernetes.io/blog/2020/09/04/kubernetes-1-19-introducing-structured-logs/).
I'm still the main project lead for [Kubernetes Metrics Server](https://kubernetes-sigs.github.io/metrics-server/),
providing crucial signals for autoscaling in Kubernetes. I started working on etcd 3 years ago,
right around the 3.5 release. We faced some challenges, but I'm thrilled to see etcd now the most
scalable and reliable it's ever been, with the highest contribution numbers in the project's
history. I'm passionate about distributed systems, extreme programming, and testing.
-->
**Marek：** 大家好，我是 Marek，SIG etcd 的负责人。
在 Google，我负责 GKE 的 etcd 团队，确保所有 GKE 用户都能获得稳定可靠的体验。
我在 Kubernetes 的旅程开始于
[SIG Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation)，
在那里我创建并主导了
[Kubernetes Structured Logging 计划](https://kubernetes.io/blog/2020/09/04/kubernetes-1-19-introducing-structured-logs/)。
我目前仍是 [Kubernetes Metrics Server](https://kubernetes-sigs.github.io/metrics-server/)
的主要项目负责人，为 Kubernetes 自动扩缩提供关键信号。
我是在大约 3 年前开始参与 etcd，也就是 3.5 版本发布前后。
我们经历过一些挑战，但我非常高兴看到 etcd 现在在可扩展性和可靠性方面都达到了历史最佳，
同时贡献数量也达到了项目历史最高点。
我对分布式系统、极限编程和测试很有热情。

<!--
**Wenjia:** Hi there, my name is Wenjia, I am the co-chair of SIG etcd and one of the etcd
maintainers. I work at Google as an Engineering Manager, working on GKE (Google Kubernetes Engine)
and GDC (Google Distributed Cloud).  I have been working in the area of open source Kubernetes and
etcd since the Kubernetes v1.10 and etcd v3.1 releases. I got involved in Kubernetes because of my
job, but what keeps me in the space is the charm of the container orchestration technology, and more
importantly, the awesome open source community.
-->
**Wenjia：** 大家好，我叫 Wenjia，是 SIG etcd 的联合主席，也是 etcd 维护者之一。
我在 Google 担任工程经理，负责 GKE（Google Kubernetes Engine）和
GDC（Google Distributed Cloud）相关工作。
从 Kubernetes v1.10 和 etcd v3.1 发布开始，我就一直在开源 Kubernetes 与 etcd 领域工作。
我最初因工作接触 Kubernetes，但让我持续投入的是容器编排技术本身的魅力，
更重要的是这个出色的开源社区。

<!--
## Becoming a Kubernetes Special Interest Group (SIG)
-->
## 成为 Kubernetes 特别兴趣小组（SIG）

<!--
**Frederico: Excellent, thank you. I'd like to start with the origin of the SIG itself: SIG etcd is
a very recent SIG, could you quickly go through the history and reasons behind its creation?**
-->
**Frederico：非常好，谢谢。我们从 SIG 本身的起源谈起：SIG etcd 是一个比较新的 SIG，
你能简要介绍它的成立背景和原因吗？**

<!--
**Marek**: Absolutely! SIG etcd was formed because etcd is a critical component of Kubernetes,
serving as its data store. However, etcd was facing challenges like maintainer turnover and
reliability issues. [Creating a dedicated SIG](https://etcd.io/blog/2023/introducing-sig-etcd/)
allowed us to focus on addressing these problems, improving development and maintenance processes,
and ensuring etcd evolves in sync with the cloud-native landscape.
-->
**Marek：** 当然可以！SIG etcd 成立的原因是 etcd 是 Kubernetes 的关键组件，
承担其数据存储职责。
但 etcd 当时面临维护者流动、可靠性等挑战。
[成立专门的 SIG](https://etcd.io/blog/2023/introducing-sig-etcd/)
让我们能够聚焦解决这些问题，改进开发和维护流程，
并确保 etcd 与云原生生态的演进保持同步。

<!--
**Frederico: And has becoming a SIG worked out as expected? Better yet, are the motivations you just
described being addressed, and to what extent?**
-->
**Frederico：成为 SIG 之后，效果是否符合预期？换句话说，
你刚才提到的这些动机现在解决得怎么样了，进展到什么程度？**

<!--
**Marek**: It's been a positive change overall. Becoming a SIG has brought more structure and
transparency to etcd's development. We've adopted Kubernetes processes like KEPs
([Kubernetes Enhancement Proposals](https://github.com/kubernetes/enhancements/blob/master/keps/README.md)
and PRRs ([Production Readiness Reviews](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md),
which has improved our feature development and release cycle.
-->
**Marek：** 总体来看，这是非常积极的变化。
成为 SIG 之后，etcd 的开发过程有了更强的结构化和透明度。
我们采用了 Kubernetes 的流程，比如 KEP
（[Kubernetes Enhancement Proposals](https://github.com/kubernetes/enhancements/blob/master/keps/README.md)）
和 PRR（[Production Readiness Reviews](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md)），
这提升了我们的特性开发和发布周期质量。

<!--
**Frederico: On top of those, what would you single out as the major benefit that has resulted from
becoming a SIG?**
-->
**Frederico：除了这些之外，你会把哪一点视为“成为 SIG 后最大的收益”？**

<!--
**Marek**: The biggest benefits for me was adopting Kubernetes testing infrastructure, tools like
[Prow](https://docs.prow.k8s.io/) and [TestGrid](https://testgrid.k8s.io/). For large projects like
etcd there is just no comparison to the default GitHub tooling. Having known, easy to use, clear
tools is a major boost to the etcd as it makes it much easier for Kubernetes contributors to also
help etcd.
-->
**Marek：** 对我来说最大的收益是采用了 Kubernetes 的测试基础设施，
比如 [Prow](https://docs.prow.k8s.io/) 和 [TestGrid](https://testgrid.k8s.io/)。
对于 etcd 这样的大型项目，这些工具相比默认 GitHub 工具有明显优势。
这些成熟、易用、清晰的工具对 etcd 是非常大的加成，
它们让 Kubernetes 贡献者也更容易参与 etcd。

<!--
**Wenjia**: Totally agree, while challenges remain, the SIG structure provides a solid foundation
for addressing them and ensuring etcd's continued success as a critical component of the Kubernetes
ecosystem.
-->
**Wenjia：** 完全同意。虽然挑战依然存在，但 SIG 结构为解决这些问题提供了坚实基础，
也有助于确保 etcd 继续作为 Kubernetes 生态关键组件取得成功。

<!--
The positive impact on the community is another crucial aspect of SIG etcd's success that I’d like
to highlight. The Kubernetes SIG structure has created a welcoming environment for etcd
contributors, leading to increased participation from the broader Kubernetes community.  We have had
greater collaboration with other SIGs like [SIG API
Machinery](https://github.com/kubernetes/community/blob/master/sig-api-machinery/README.md),
[SIG Scalability](https://github.com/kubernetes/community/tree/master/sig-scalability),
[SIG Testing](https://github.com/kubernetes/community/tree/master/sig-scalability),
[SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle), etc.
-->
我还想强调一个关键方面：它对社区带来的积极影响。
Kubernetes 的 SIG 机制为 etcd 贡献者创造了更友好的环境，
也让更广泛的 Kubernetes 社区参与度明显提升。
我们和多个 SIG 的协作都在加强，包括
[SIG API Machinery](https://github.com/kubernetes/community/blob/master/sig-api-machinery/README.md)、
[SIG Scalability](https://github.com/kubernetes/community/tree/master/sig-scalability)、
[SIG Testing](https://github.com/kubernetes/community/tree/master/sig-scalability)、
[SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle) 等。

<!--
This collaboration helps ensure etcd's development aligns with the needs of the wider Kubernetes
ecosystem. The formation of the [etcd Operator Working Group](https://github.com/kubernetes/community/blob/master/wg-etcd-operator/README.md)
under the joint effort between SIG etcd and SIG Cluster Lifecycle exemplifies this successful
collaboration, demonstrating a shared commitment to improving etcd's operational aspects within
Kubernetes.
-->
这种协作有助于确保 etcd 的发展与整个 Kubernetes 生态需求保持一致。
由 SIG etcd 与 SIG Cluster Lifecycle 共同推动成立的
[etcd Operator Working Group](https://github.com/kubernetes/community/blob/master/wg-etcd-operator/README.md)
就是一个典型例子，体现了这种成功协作，也体现了双方对改进 etcd 在 Kubernetes 中运维能力的共同承诺。

<!--
**Frederico: Since you mentioned collaboration, have you seen changes in terms of contributors and
community involvement in recent months?**
-->
**Frederico：既然你提到协作，那在最近几个月里，
你们是否观察到贡献者规模和社区参与度的变化？**

<!--
**James**: Yes - as showing in our
[unique PR author data](https://etcd.devstats.cncf.io/d/23/prs-authors-repository-groups?orgId=1&var-period=m&var-repogroup_name=All&from=1422748800000&to=1738454399000)
we recently hit an all time high in March and are trending in a positive direction:
-->
**James：** 有的。正如我们的
[独立 PR 作者数据](https://etcd.devstats.cncf.io/d/23/prs-authors-repository-groups?orgId=1&var-period=m&var-repogroup_name=All&from=1422748800000&to=1738454399000)
所显示，最近在 3 月我们达到了历史最高点，而且趋势仍在向好：

<!--
{{< figure src="stats.png" alt="Unique PR author data stats" >}}
-->
{{< figure src="stats.png" alt="独立 PR 作者数据统计" >}}

<!--
Additionally, looking at our
[overall contributions across all etcd project repositories](https://etcd.devstats.cncf.io/d/74/contributions-chart?orgId=1&from=1422748800000&to=1738454399000&var-period=m&var-metric=contributions&var-repogroup_name=All&var-country_name=All&var-company_name=All&var-company=all)
we are also observing a positive trend showing a resurgence in etcd project activity:
-->
另外，从
[etcd 项目所有仓库的整体贡献数据](https://etcd.devstats.cncf.io/d/74/contributions-chart?orgId=1&from=1422748800000&to=1738454399000&var-period=m&var-metric=contributions&var-repogroup_name=All&var-country_name=All&var-company_name=All&var-company=all)
来看，我们也观察到了积极趋势，显示 etcd 项目活跃度正在回升：

<!--
{{< figure src="stats2.png" alt="Overall contributions stats" >}}
-->
{{< figure src="stats2.png" alt="整体贡献统计" >}}

<!--
## The road ahead
-->
## 未来之路

<!--
**Frederico: That's quite telling, thank you. In terms of the near future, what are the current
priorities for SIG etcd?**
-->
**Frederico：这些数据很有说服力，谢谢。那在近期，SIG etcd 的优先事项是什么？**

<!--
**Marek**: Reliability is always top of mind - we need to make sure etcd is rock-solid. We're also
working on making etcd easier to use and manage for operators. And we have our sights set on making
etcd a viable standalone solution for infrastructure management, not just for Kubernetes. Oh, and of
course, scaling - we need to ensure etcd can handle the growing demands of the cloud-native world.
-->
**Marek：** 可靠性始终是第一优先级，我们必须确保 etcd 足够稳健。
我们也在持续改进 etcd 的可用性和可运维性，让运维人员更容易使用和管理。
此外，我们也在推动 etcd 成为基础设施管理领域可独立使用的方案，而不仅仅服务于 Kubernetes。
当然还有扩展性，我们需要确保 etcd 能承载云原生世界不断增长的需求。

<!--
**Benjamin**: I agree that reliability should always be our top guiding principle. We need to ensure
not only correctness but also compatibility. Additionally, we should continuously strive to improve
the understandability and maintainability of etcd. Our focus should be on addressing the pain points
that the community cares about the most.
-->
**Benjamin：** 我同意，可靠性必须始终是我们的首要原则。
我们不仅要确保正确性，也要确保兼容性。
此外，我们还要持续提升 etcd 的可理解性和可维护性。
我们的重点应当放在解决社区最关心的痛点上。

<!--
**Frederico: Are there any specific SIGs that you work closely with?**
-->
**Frederico：你们是否会和某些 SIG 保持特别紧密的协作？**

<!--
**Marek**: SIG API Machinery, for sure - they own the structure of the data etcd stores, so we're
constantly working together. And SIG Cluster Lifecycle - etcd is a key part of Kubernetes clusters,
so we collaborate on the newly created etcd operator Working group.
-->
**Marek：** 首先肯定是 SIG API Machinery。
他们负责 etcd 所存储数据的结构定义，所以我们一直在紧密合作。
另外是 SIG Cluster Lifecycle，etcd 是 Kubernetes 集群的关键组成，
所以我们也在新成立的 etcd operator Working Group 上协同推进。

<!--
**Wenjia**: Other than SIG API Machinery and SIG Cluster Lifecycle that Marek mentioned above, SIG
Scalability and SIG Testing is another group that we work closely with.
-->
**Wenjia：** 除了 Marek 刚提到的 SIG API Machinery 和 SIG Cluster Lifecycle，
我们也和 SIG Scalability 以及 SIG Testing 保持紧密合作。

<!--
**Frederico: In a more general sense, how would you list the key challenges for SIG etcd in the
evolving cloud native landscape?**
-->
**Frederico：更广义地看，在不断演进的云原生环境中，
你会如何概括 SIG etcd 面临的关键挑战？**

<!--
**Marek**: Well, reliability is always a challenge when you're dealing with critical data. The
cloud-native world is evolving so fast that scaling to meet those demands is a constant effort.
-->
**Marek：** 当你处理关键数据时，可靠性永远都是挑战。
而云原生世界发展非常快，持续扩展以满足新需求也是一项长期工作。

<!--
## Getting involved
-->
## 如何参与

<!--
**Frederico: We're almost at the end of our conversation, but for those interested in in etcd, how
can they get involved?**
-->
**Frederico：我们的访谈接近尾声了。对于想参与 etcd 的人来说，可以如何开始？**

<!--
**Marek**: We'd love to have them! The best way to start is to join our
[SIG etcd meetings](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md#meetings),
follow discussions on the [etcd-dev mailing list](https://groups.google.com/g/etcd-dev), and check
out our [GitHub issues](https://github.com/etcd-io/etcd/issues). We're always looking for people to
review proposals, test code, and contribute to documentation.
-->
**Marek：** 我们非常欢迎！最好的起步方式是加入
[SIG etcd 例会](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md#meetings)，
关注 [etcd-dev 邮件列表](https://groups.google.com/g/etcd-dev) 的讨论，
并查看我们的 [GitHub issues](https://github.com/etcd-io/etcd/issues)。
我们一直在寻找愿意参与提案评审、代码测试和文档贡献的人。

<!--
**Wenjia**: I love this question 😀 . There are numerous ways for people interested in contributing
to SIG etcd to get involved and make a difference. Here are some key areas where you can help:
-->
**Wenjia：** 我非常喜欢这个问题 😀。
对希望为 SIG etcd 做贡献的人来说，参与方式很多，而且都能真正产生影响。
下面是一些你可以参与的重点方向：

<!--
**Code Contributions**:
 - _Bug Fixes_: Tackle existing issues in the etcd codebase. Start with issues labeled "good first
issue" or "help wanted" to find tasks that are suitable for newcomers.
 - _Feature Development_: Contribute to the development of new features and enhancements. Check the
etcd roadmap and discussions to see what's being planned and where your skills might fit in.
 - _Testing and Code Reviews_: Help ensure the quality of etcd by writing tests, reviewing code
   changes, and providing feedback.
 - _Documentation_: Improve [etcd's documentation](https://etcd.io/docs/) by adding new content,
   clarifying existing information, or fixing errors. Clear and comprehensive documentation is
   essential for users and contributors.
 - _Community Support_: Answer questions on forums, mailing lists, or [Slack  channels](https://kubernetes.slack.com/archives/C3HD8ARJ5).
   Helping others understand and use etcd is a valuable contribution.
-->
**代码贡献：**
- __Bug 修复__：处理 etcd 代码库中的既有问题。
  可以从标记为 `good first issue` 或 `help wanted` 的问题开始，
  这些任务通常更适合新贡献者。
- __特性开发__：参与新特性和增强能力的开发。
  可以查看 etcd 路线图和讨论，了解正在规划什么，以及你的技能可以在哪些方向发挥作用。
- __测试与代码评审__：通过编写测试、审查代码变更、提供反馈，帮助保障 etcd 质量。
- __文档__：通过新增内容、澄清已有信息、修复错误来完善
  [etcd 文档](https://etcd.io/docs/)。
  清晰、完整的文档对用户和贡献者都很关键。
- __社区支持__：在论坛、邮件列表或 [Slack 频道](https://kubernetes.slack.com/archives/C3HD8ARJ5)
  回答问题。帮助他人理解和使用 etcd 也是非常有价值的贡献。

<!--
**Getting Started**:
- _Join the community_: Start by joining the etcd community on Slack,
  attending SIG meetings, and following the mailing lists. This will
  help you get familiar with the project, its processes, and the
  people involved.
- _Find a mentor_: If you're new to open source or etcd, consider
  finding a mentor who can guide you and provide support. Stay tuned!
  Our first cohort of mentorship program was very successful. We will
  have a new round of mentorship program coming up.
- _Start small_: Don't be afraid to start with small contributions. Even
  fixing a typo in the documentation or submitting a simple bug fix
  can be a great way to get involved.
-->
**入门建议：**
- __加入社区__：先从加入 etcd 的 Slack 社区、参加 SIG 会议、关注邮件列表开始。
  这能帮助你熟悉项目、流程以及参与其中的人。
- __寻找导师__：如果你是开源或 etcd 新人，建议寻找导师来提供指导和支持。
  敬请关注！我们第一期 mentorship 计划非常成功，后续会开启新一轮。
- __从小处开始__：不要害怕从小贡献做起。
  即使只是修正文档中的错别字，或提交一个简单的 bug 修复，
  也是非常好的参与方式。

<!--
By contributing to etcd, you'll not only be helping to improve a
critical piece of the cloud-native ecosystem but also gaining valuable
experience and skills. So, jump in and start contributing!
-->
通过参与 etcd，你不仅是在帮助改进云原生生态中的关键组件，
也会获得宝贵的经验与技能。
所以，欢迎加入并开始贡献！

<!--
**Frederico: Excellent, thank you. Lastly, one piece of advice that
you'd like to give to other newly formed SIGs?**
-->
**Frederico：非常好，谢谢。最后一个问题：
你们是否有一条建议想给其他新成立的 SIG？**

<!--
**Marek**: Absolutely! My advice would be to embrace the established
processes of the larger community, prioritize collaboration with other
SIGs, and focus on building a strong community.
-->
**Marek：** 当然有！我的建议是：拥抱大社区已经建立的流程，
优先推进与其他 SIG 的协作，并专注建设一个强健的社区。

<!--
**Wenjia**: Here are some tips I myself found very helpful in my OSS
journey:
- _Be patient_: Open source development can take time. Don't get
  discouraged if your contributions aren't accepted immediately or if
  you encounter challenges.
- _Be respectful_: The etcd community values collaboration and
respect. Be mindful of others' opinions and work together to achieve
common goals.
- _Have fun_: Contributing to open source should be
enjoyable. Find areas that interest you and contribute in ways that
you find fulfilling.
-->
**Wenjia：** 在我的开源旅程中，下面这些建议对我帮助很大：
- __保持耐心__：开源开发需要时间。
  如果你的贡献没有立刻被接受，或遇到挑战，不要灰心。
- __保持尊重__：etcd 社区非常重视协作与尊重。
  要重视他人的观点，并共同努力达成目标。
- __享受过程__：参与开源应该是有乐趣的。
  找到你真正感兴趣的方向，用让你有成就感的方式去贡献。

<!--
**Frederico: A great way to end this spotlight, thank you all!**
-->
**Frederico：非常棒的收尾，感谢各位！**

<!--
For more information and resources, please take a look at:

1. etcd website: https://etcd.io/
2. etcd GitHub repository: https://github.com/etcd-io/etcd
3. etcd community: https://etcd.io/community/
-->
---

更多信息与资源请参考：

1. etcd 官网：<https://etcd.io/>
2. etcd GitHub 仓库：<https://github.com/etcd-io/etcd>
3. etcd 社区：<https://etcd.io/community/>
