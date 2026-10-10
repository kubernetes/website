---
layout: blog
title: "聚光灯下的 SIG Instrumentation"
slug: sig-instrumentation-spotlight-2023
date: 2023-02-03
---
<!--
layout: blog
title: "Spotlight on SIG Instrumentation"
slug: sig-instrumentation-spotlight-2023
date: 2023-02-03
canonicalUrl: https://www.kubernetes.dev/blog/2023/02/03/sig-instrumentation-spotlight-2023/
-->

<!--
**Author:** Imran Noor Mohamed (Delivery Hero)
-->
**作者**: Imran Noor Mohamed (Delivery Hero)

**译者**: [Kevin Yang](https://github.com/kevin1689-cloud)

<!--
Observability requires the right data at the right time for the right consumer
(human or piece of software) to make the right decision. In the context of Kubernetes,
having best practices for cluster observability across all Kubernetes components is crucial.
-->
可观测性需要在合适的时间提供合适的数据，以便合适的消费者（人员或软件）做出正确的决策。
在 Kubernetes 的环境中，拥有跨所有 Kubernetes 组件的集群可观测性最佳实践是至关重要的。

<!--
SIG Instrumentation helps to address this issue by providing best practices and tools
that all other SIGs use to instrument Kubernetes components-like the *API server*,
*scheduler*, *kubelet* and *kube-controller-manager*.
-->
SIG Instrumentation 通过提供最佳实践和工具来解决这个问题， 所有其他 SIG 都可以使用它们来对如
**API 服务器**、**kubelet** 和 **kube-controller-manager** 这类 Kubernetes 组件进行插桩。

<!--
In this SIG Instrumentation spotlight, [Imran Noor Mohamed](https://www.linkedin.com/in/imrannoormohamed/),
SIG ContribEx-Comms tech lead talked with [Elana Hashman](https://twitter.com/ehashdn),
and [Han Kang](https://www.linkedin.com/in/hankang), chairs of SIG Instrumentation,
on how the SIG is organized, what are the current challenges and how anyone can get involved and contribute.
-->
在这次 SIG Instrumentation 采访报道中，SIG ContribEx-Comms 技术主管 [Imran Noor Mohamed](https://www.linkedin.com/in/imrannoormohamed/)
与 SIG Instrumentation 的两位主席 [Elana Hashman](https://twitter.com/ehashdn) 和 [Han Kang](https://www.linkedin.com/in/hankang)
讨论了 SIG 的组织结构、当前的挑战以及大家如何参与并贡献。

<!--
## About SIG Instrumentation

**Imran (INM)**: Hello, thank you for the opportunity of learning more about SIG Instrumentation.
Could you tell us a bit about yourself, your role, and how you got involved in SIG Instrumentation?
-->
## 关于 SIG Instrumentation

**Imran (INM)**: 你好，感谢你给我这个机会进一步了解关于 SIG Instrumentation 的情况。
你能否介绍一下你自己、你的角色以及你是如何参与 SIG Instrumentation 的？

<!--
**Han (HK)**: I started in SIG Instrumentation in 2018, and became a chair in 2020.
I primarily got involved with SIG instrumentation due to a number of upstream issues
with metrics which ended up affecting GKE in bad ways. As a result, we ended up
launching an initiative to stabilize our metrics and make metrics a proper API.
-->
**Han (HK)**: 我在 2018 年开始参与 SIG Instrumentation，并于 2020 年成为主席。
我参与 SIG Instrumentation 主要是因为一些上游的指标问题对 GKE 造成了不好的影响。
因此我们发起了一个活动，目的是让我们的指标更稳定并将这些指标打造成一个合适的 API 。

<!--
**Elana (EH)**: I also joined SIG Instrumentation in 2018 and became a chair at the
same time as Han. I was working as a site reliability engineer (SRE) on bare metal
Kubernetes clusters and was working to build out our observability stack.
I encountered some issues with label joins where Kubernetes metrics didn’t match
kube-state-metrics ([KSM](https://github.com/kubernetes/kube-state-metrics)) and
started participating in SIG meetings to improve things. I helped test performance
improvements to kube-state-metrics and ultimately coauthored a KEP for overhauling
metrics in the 1.14 release to improve usability.
-->
**Elana (EH)**: 我也是在 2018 年加入了 SIG Instrumentation，并与 Han 同时成为主席。
当时我是一名负责裸金属 Kubernetes 集群的站点可靠性工程师（site reliability engineer，SRE），
致力于构建我们的可观测性堆栈。我在标签关联方面遇到了一些问题，具体来说是 Kubernetes 的指标与
kube-state-metrics（[KSM](https://github.com/kubernetes/kube-state-metrics)）不匹配，
因此我开始参加 SIG 会议以改进这些方面。我帮助测试了 kube-state-metrics 的性能改进，
并最终共同撰写了一个关于在 1.14 版本中彻底改进指标以提高其可用性的 KEP 提案。

<!--
**Imran (INM)**: Interesting! Does that mean SIG Instrumentation involves a lot of plumbing?
-->
**Imran (INM)**: 有趣！这是否意味着 SIG Instrumentation 涉及很多的钻研工作？

<!--
**Han (HK)**: I wouldn’t say it involves a ton of plumbing, though it does touch
basically every code base. We have our own dedicated directories for our metrics,
logs, and tracing frameworks which we tend to work out of primarily. We do have to
interact with other SIGs in order to propagate our changes which makes us more of
a horizontal SIG.
-->
**Han (HK)**: 我不会说它涉及大量的钻研工作，但它确实触及了基本上每个代码库。
我们有专门的目录用于我们的 metrics、logs 和 tracing 框架，这些是我们要完成的主要工作。
我们必须与其他 SIG 进行互动以推动我们的变更，这使我们更加成为一个横向的 SIG。

<!--
**Imran (INM)**: Speaking about interaction and coordination with other SIG could
you describe how the SIGs is organized?
-->
**Imran (INM)**: 谈到与其他 SIG 的互动和协调，你能描述一下 SIG 是如何组织的吗？

<!--
**Elana (EH)**: In SIG Instrumentation, we have two chairs, Han and myself, as well
as two tech leads, David Ashpole and Damien Grisonnet. We all work together as the
SIG’s leads in order to run meetings, triage issues and PRs, review and approve KEPs,
plan for each release, present at KubeCon and community meetings, and write our annual
report. Within the SIG we also have a number of important subprojects, each of which is
stewarded by its subproject owners. For example, Marek Siarkowicz is a subproject owner
of [metrics-server](https://github.com/kubernetes-sigs/metrics-server).
-->
**Elana (EH)**: 在 SIG Instrumentation 中，我们有两位主席：Han 和我自己，还有两位技术负责人：
David Ashpole 和 Damien Grisonnet。作为 SIG 的领导者，我们一起工作，负责组织会议、分类问题和
PR、审查和批准 KEP、规划每个发布版本、在 KubeCon 和社区会议上演讲，以及撰写我们的年度报告。
在 SIG 内部，我们还有许多重要的子项目，每个子项目都有负责人来指导。例如，Marek Siarkowicz 是
[metrics-server](https://github.com/kubernetes-sigs/metrics-server) 这个子项目的负责人。

<!--
Because we’re a horizontal SIG, some of our projects have a wide scope and require
coordination from a dedicated group of contributors. For example, in order to guide
the Kubernetes migration to structured logging, we chartered the
[Structured Logging](https://github.com/kubernetes/community/blob/master/wg-structured-logging/README.md)
Working Group (WG), organized by Marek and Patrick Ohly. The WG doesn’t own any code,
but helps with various components such as the *kubelet*, *scheduler*, etc. in migrating
their code to use structured logs.
-->
由于我们是一个横向的 SIG，我们的一些项目的牵涉面很广，需要由一组专门的贡献者来协调。
例如，为了指导 Kubernetes 向结构化日志的迁移，我们成立了由 Marek 和 Patrick Ohly 组织的
[Structured Logging](https://github.com/kubernetes/community/blob/master/wg-structured-logging/README.md)
工作组（Working Group，WG）。这个工作组没有自己的代码，但会帮助各个组件（如 **kubelet**、**scheduler**
等）迁移它们的代码以使用结构化日志。

<!--
**Imran (INM)**: Walking through the
[charter](https://github.com/kubernetes/community/blob/master/sig-instrumentation/charter.md)
alone it’s clear that SIG Instrumentation has a lot of sub-projects.
Could you highlight some important ones?
-->
**Imran (INM)**: 从章程（[charter](https://github.com/kubernetes/community/blob/master/sig-instrumentation/charter.md)）来看，
SIG Instrumentation 显然有许多子项目。你能重点说一下其中一些重要的项目吗？

<!--
**Han (HK)**: We have many different sub-projects and we are in dire need of
people who can come and help shepherd them. Our most important projects in-tree
(that is, within the kubernetes/kubernetes repo) are metrics, tracing, and,
structured logging. Our most important projects out-of-tree are
(a) KSM (kube-state-metrics) and (b) metrics-server.
-->
**Han (HK)**: 我们有许多不同的子项目，我们急需能够来协助推动它们的人员。我们最重要的树内（in-tree）项目（即在
kubernetes/kubernetes 代码仓库中）是 metrics、tracing 和 structured logging。
我们最重要的树外（out-of-tree）项目是：（a）KSM（kube-state-metrics）和（b）metrics-server。

<!--
**Elana (EH)**: Echoing this, we would love to bring on more maintainers for
kube-state-metrics and metrics-server. Our friends at WG Structured Logging are
also looking for contributors. Other subprojects include klog, prometheus-adapter,
and a new subproject that we just launched for collecting high-fidelity, scalable
utilization metrics called [usage-metrics-collector](https://github.com/kubernetes-sigs/usage-metrics-collector).
All are seeking new contributors!
-->
**Elana (EH)**: 与上面所说的相呼应，我们希望为 kube-state-metrics 和 metrics-server
引入更多的维护者。我们在 Structure Logging 工作组的朋友也在寻找贡献者。其他子项目包括 klog、prometheus-Adapter，
以及我们刚刚启动的一个用于收集高保真度、可伸缩利用率指标的新子项目，称为
[usage-metrics-collector](https://github.com/kubernetes-sigs/usage-metrics-collector)
，它们都在寻找新的贡献者！

<!--
## Current status and ongoing challenges

**Imran (INM)**: For release [1.26](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.26)
we can see that there are a relevant number of metrics, logs, and tracing
[KEPs](https://www.k8s.dev/resources/keps/) in the pipeline. Would you like to
point out important things for last release (maybe alpha & stable milestone candidates?)
-->
## 现状和持续的挑战

**Imran (INM)**: 在 [1.26](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.26)
版本中，我们可以在流水线中看到有相当数量的关于 metrics、logs 和 tracing 方面的
[KEPs](https://www.k8s.dev/resources/keps/)。您可否谈谈上个版本中的重要事项
（例如 alpha 和 stable 里程碑的候选项？）

<!--
**Han (HK)**: We can now generate [documentation](https://kubernetes.io/docs/reference/instrumentation/metrics/)
for every single metric in the main Kubernetes code base! We have a pretty fancy
static analysis pipeline that enables this functionality. We’ve also added feature
metrics so that you can look at your metrics to determine which features are enabled
in your cluster at a given time. Lastly, we added a component-sli endpoint, which
should make it easy for people to create availability SLOs for *control-plane* components.
-->
**Han (HK)**: 现在我们可以为 Kubernetes 的 main 代码库中的所有监控指标生成[文档](https://kubernetes.io/docs/reference/instrumentation/metrics/)！
我们有一个相当不错的静态分析流水线，使这一功能成为可能。
我们还添加了 feature 指标，这样你可以查看这个指标来确定在给定时间内集群中启用了哪些特性。
最后，我们添加了一个 component-sli 端点，它应该使人们为**控制平面（control-plane）**
组件制定可用性 SLOs 变得容易。

<!--
**Elana (EH)**: We’ve also been working on tracing KEPs for both the *API server*
and *kubelet*, though neither graduated in 1.26. I’m also really excited about the
work Han is doing with WG Reliability to extend and improve our metrics stability framework.
-->
**Elana (EH)**: 我们还在做关于 **API 服务器** 和 **kubelet** 的 tracing 方面的 KEPs 工作，
尽管它们都没有在 1.26 版本中毕业。我对于 Han 与可靠性工作组合作，来扩展和改进我们的指标稳定性框架的工作也感到非常兴奋。

<!--
**Imran (INM)**: What do you think are the Kubernetes-specific challenges tackled by
the SIG Instrumentation? What are the future efforts to solve them?
-->
**Imran (INM)**: 您认为 SIG Instrumentation 所应对的 Kubernetes 特有挑战有哪些？未来打算如何来解决它们？

<!--
**Han (HK)**:  SIG instrumentation suffered a bit in the past from being a horizontal SIG.
We did not have an obvious location to put our code and did not have a good mechanism to
audit metrics that people would randomly add. We’ve fixed this over the years and now we
have dedicated spots for our code and a reliable mechanism for auditing new metrics.
We also now offer stability guarantees for metrics. We hope to have full-blown tracing
up and down the kubernetes stack, and metric support via exemplars.
-->
**Han (HK)**: SIG Instrumentation 作为一个横向的 SIG 曾经遇到一些困难，我们没有明确的位置来存放我们的代码，
也没有一个良好的机制来审核随意添加的指标。经过多年努力我们已经解决了这个问题，现在我们有了专门的代码存放位置，
并且有可靠的机制来审核新的指标。我们现在还为指标提供稳定性保证。我们希望在 Kubernetes 堆栈上下游进行全面的跟踪，
并通过示例提供指标支持。

<!--
**Elana (EH)**: I think SIG Instrumentation is a really interesting SIG because it
poses different kinds of opportunities to get involved than in other SIGs. You don’t
have to be a software developer to contribute to our SIG! All of our components and
subprojects are focused on better understanding Kubernetes and its performance in
production, which allowed me to get involved as one of the few SIG Chairs working as
an SRE at that time. I like that we provide opportunities for newcomers to contribute
through using, testing, and providing feedback on our subprojects, which is a lower
barrier to entry. Because many of these projects are out-of-tree, I think one of our
challenges is to figure out what’s in scope for core Kubernetes SIGs instrumentation
subprojects, what’s missing, and then fill in the gaps.
-->
**Elana (EH)**: 我认为 SIG Instrumentation 是一个非常有趣的 SIG，因为与其他 SIG
相比，它提供了不同类型的参与机会。您不必是一名软件开发人员就可以为我们的 SIG 做出贡献！
我们的所有组件和子项目都专注于更好地了解 Kubernetes 及其在生产环境中的性能，
这也使得我当时能参与进来并成为少数几个 SRE 身份的 SIG 主席。
我喜欢我们通过使用、测试和提供反馈意见的方式来为新人提供贡献机会，这降低了加入的门槛。
由于这些项目中许多都是 out-of-tree 的，我认为我们面临的挑战之一是确定 Kubernetes 核心
SIGs Instrumentation 子项目的范围并找出缺失的部分，然后填补这些空白。

<!--
## Community and contribution

**Imran (INM)**: Kubernetes values community over products. Any recommendation
for anyone looking into getting involved in SIG Instrumentation work? Where
should they start (new contributor-friendly areas within SIG?)
-->
## 社区和贡献

**Imran (INM)**: Kubernetes 重视社区胜过重视产品。如果有人想参与 SIG Instrumentation 的工作，
您有什么建议？他们应该从哪里开始（在 SIG 中适合新贡献者的领域？）

<!--
**Han(HK) and Elana (EH)**: Come to our bi-weekly triage
[meetings](https://github.com/kubernetes/community/tree/master/sig-instrumentation#meetings)!
They aren’t recorded and are a great place to ask questions and learn about our ongoing work.
We strive to be a friendly community and one of the easiest SIGs to get started with.
You can check out our latest KubeCon NA 2022 [SIG Instrumentation Deep Dive](https://youtu.be/JIzrlWtAA8Y)
to get more insight into our work. We also invite you to join our Slack channel #sig-instrumentation
and feel free to reach out to any of our SIG leads or subproject owners directly.
-->
**Han(HK) and Elana (EH)**: 参加我们的双周分类[会议](https://github.com/kubernetes/community/tree/master/sig-instrumentation#meetings)！
这些会议不会被录制，它们是一个很好的提问的地方并可以了解我们正在进行的工作。我们致力于打造一个友好的社区，
同时也是最容易入门的 SIG 之一。你可以查看我们最新的 KubeCon NA 2022 [SIG Instrumentation Deep Dive](https://youtu.be/JIzrlWtAA8Y)，
以更深入地了解我们的工作。我们还邀请你加入我们的 Slack 频道 #sig-instrumentation，并随时与我们的
SIG 负责人或子项目所有者直接联系。

<!--
Thank you so much for your time and insights into the workings of SIG Instrumentation!
-->
非常感谢你抽出宝贵时间并深入了解了 SIG Instrumentation 的工作！