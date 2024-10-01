---
layout: blog
title: "SIG Scheduling 访谈"
slug: sig-scheduling-spotlight-2024
date: 2024-09-24
author: "Arvind Parekh"
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Spotlight on SIG Scheduling"
slug: sig-scheduling-spotlight-2024
canonicalUrl: https://www.kubernetes.dev/blog/2024/09/24/sig-scheduling-spotlight-2024
date: 2024-09-24
author: "Arvind Parekh"
-->

<!--
In this SIG Scheduling spotlight we talked with [Kensei Nakada](https://github.com/sanposhiho/), an
approver in SIG Scheduling.

## Introductions

**Arvind:** **Hello, thank you for the opportunity to learn more about SIG Scheduling! Would you
like to introduce yourself and tell us a bit about your role, and how you got involved with
Kubernetes?**
-->
在本次 SIG Scheduling 的访谈中，我们与 [Kensei Nakada](https://github.com/sanposhiho/)
进行了交流，他是 SIG Scheduling 的一名 Approver。

## 介绍

**Arvind:** **你好，感谢你让我们有机会了解 SIG Scheduling！
你能介绍一下自己，告诉我们你的角色以及你是如何参与 Kubernetes 的吗？**

<!--
**Kensei**: Hi, thanks for the opportunity! I’m Kensei Nakada
([@sanposhiho](https://github.com/sanposhiho/)), a software engineer at
[Tetrate.io](https://tetrate.io/). I have been contributing to Kubernetes in my free time for more
than 3 years, and now I’m an approver of SIG-Scheduling in Kubernetes. Also, I’m a founder/owner of
two SIG subprojects,
[kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator) and
[kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension).
-->
**Kensei**: 嗨，感谢你给我这个机会！我是 Kensei Nakada
([@sanposhiho](https://github.com/sanposhiho/))，是来自 [Tetrate.io](https://tetrate.io/) 的一名软件工程师。
我在业余时间为 Kubernetes 贡献了超过 3 年的时间，现在我是 Kubernetes 中 SIG-Scheduling 的一名 Approver。
同时，我还是两个 SIG 子项目的创始人/负责人：
[kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator) 和
[kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension)。

<!--
## About SIG Scheduling

**AP: That's awesome! You've been involved with the project since a long time. Can you provide a
brief overview of SIG Scheduling and explain its role within the Kubernetes ecosystem?**

**KN**: As the name implies, our responsibility is to enhance scheduling within
Kubernetes. Specifically, we develop the components that determine which Node is the best place for
each Pod. In Kubernetes, our main focus is on maintaining the
[kube-scheduler](https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/), along
with other scheduling-related components as part of our SIG subprojects.
-->
## 关于 SIG Scheduling

**AP: 太棒了！你参与这个项目已经很久了。你能简要概述一下 SIG Scheduling，并说明它在 Kubernetes 生态系统中的角色吗？**

**KN**: 正如名字所示，我们的责任是增强 Kubernetes 中的调度特性。
具体来说，我们开发了一些组件，将每个 Pod 调度到最合适的 Node。
在 Kubernetes 中，我们的主要关注点是维护
[kube-scheduler](https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/)，
以及其他调度相关的组件，这些组件是 SIG Scheduling 的子项目。

<!--
**AP: I see, got it! That makes me curious--what recent innovations or developments has SIG
Scheduling introduced to Kubernetes scheduling?**

**KN**: From a feature perspective, there have been [several
enhancements](https://kubernetes.io/blog/2023/04/17/fine-grained-pod-topology-spread-features-beta/)
to `PodTopologySpread` recently. `PodTopologySpread` is a relatively new feature in the scheduler,
and we are still in the process of gathering feedback and making improvements.
-->
**AP: 明白了！我有点好奇，SIG Scheduling 最近为 Kubernetes 调度引入了哪些创新或发展？**

**KN**: 从特性的角度来看，最近对 `PodTopologySpread`
进行了[几项增强](/zh-cn/blog/2023/04/17/fine-grained-pod-topology-spread-features-beta/)。
`PodTopologySpread` 是调度器中一个相对较新的特性，我们仍在收集反馈并进行改进。

<!--
Most recently, we have been focusing on a new internal enhancement called
[QueueingHint](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/4247-queueinghint/README.md)
which aims to enhance scheduling throughput. Throughput is one of our crucial metrics in
scheduling. Traditionally, we have primarily focused on optimizing the latency of each scheduling
cycle. QueueingHint takes a different approach, optimizing when to retry scheduling, thereby
reducing the likelihood of wasting scheduling cycles.
-->
最近，我们专注于一个内部增强特性，称为
[QueueingHint](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/4247-queueinghint/README.md)，
这个特性旨在提高调度的吞吐量。吞吐量是我们调度中的关键指标之一。传统上，我们主要关注优化每个调度周期的延迟。
而 QueueingHint 采取了一种不同的方法，它可以优化何时重试调度，从而减少浪费调度周期的可能性。

<!--
**A: That sounds interesting! Are there any other interesting topics or projects you are currently
working on within SIG Scheduling?**

**KN**: I’m leading the development of `QueueingHint` which I just shared.  Given that it’s a big new
challenge for us, we’ve been facing many unexpected challenges, especially around the scalability,
and we’re trying to solve each of them to eventually enable it by default.
-->
**A: 听起来很有趣！你目前在 SIG Scheduling 中还有其他有趣的主题或项目吗？**

**KN**: 我正在牵头刚刚提到的 `QueueingHint` 的开发。考虑到这是我们面临的一项重大新挑战，
我们遇到了许多意想不到的问题，特别是在可扩展性方面，我们正在努力解决每一个问题，使这项特性最终能够默认启用。

<!--
And also, I believe
[kube-scheduler-wasm-extention](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension)
(SIG sub project) that I started last year would be interesting to many people.  Kubernetes has
various extensions from many components. Traditionally, extensions are provided via webhooks
([extender](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/scheduler_extender.md)
in the scheduler) or Go SDK ([Scheduling
Framework](https://kubernetes.io/docs/concepts/scheduling-eviction/scheduling-framework/) in the
scheduler). However, these come with drawbacks - performance issues with webhooks and the need to
rebuild and replace schedulers with Go SDK, posing difficulties for those seeking to extend the
scheduler but lacking familiarity with it.  The project is trying to introduce a new solution to
this general challenge - a [WebAssembly](https://webassembly.org/) based extension. Wasm allows
users to build plugins easily, without worrying about recompiling or replacing their scheduler, and
sidestepping performance concerns.
-->
此外，我认为我去年启动的
[kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension)（SIG 子项目）
对许多人来说也会很有趣。Kubernetes 有各种扩展来自许多组件。传统上，扩展通过 Webhook
（调度器中的 [extender](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/scheduler_extender.md)）或
Go SDK（调度器中的[调度框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)）提供。
然而，这些方法存在缺点，首先是 Webhook 的性能问题以及需要重建和替换调度器的 Go SDK，这就给那些希望扩展调度器但对其不熟悉的人带来了困难。
此项目尝试引入一种新的解决方案来应对这一普遍挑战，即基于 [WebAssembly](https://webassembly.org/) 的扩展。
Wasm 允许用户轻松构建插件，而无需担心重新编译或替换调度器，还能规避性能问题。

<!--
Through this project, sig-scheduling has been learning valuable insights about WebAssembly's
interaction with large Kubernetes objects. And I believe the experience that we’re gaining should be
useful broadly within the community, beyond sig-scheduling.

**A: Definitely! Now, there are currently 8 subprojects inside SIG Scheduling. Would you like to
talk about them? Are there some interesting contributions by those teams you want to highlight?**

**KN**: Let me pick up three sub projects; Kueue, KWOK and descheduler.
-->
通过这个项目，sig-scheduling 正在积累 WebAssembly 与大型 Kubernetes 对象交互的宝贵洞察。
我相信我们所获得的经验应该对整个社区都很有用，而不仅限于 sig-scheduling 的范围。

**A: 当然！目前 SIG Scheduling 有 8 个子项目。你想谈谈它们吗？有没有一些你想强调的有趣贡献？**

**KN**: 让我挑选三个子项目：Kueue、KWOK 和 Descheduler。

<!--
[Kueue](https://github.com/kubernetes-sigs/kueue):
: Recently, many people have been trying to manage batch workloads with Kubernetes, and in 2022,
Kubernetes community founded
[WG-Batch](https://github.com/kubernetes/community/blob/master/wg-batch/README.md) for better
support for such batch workloads in Kubernetes.  [Kueue](https://github.com/kubernetes-sigs/kueue)
is a project that takes a crucial role for it. It’s a job queueing controller, deciding when a job
should wait, when a job should be admitted to start, and when a job should be preempted. Kueue aims
to be installed on a vanilla Kubernetes cluster while cooperating with existing matured controllers
(scheduler, cluster-autoscaler, kube-controller-manager, etc).
-->
[Kueue](https://github.com/kubernetes-sigs/kueue):
: 最近，许多人尝试使用 Kubernetes 管理批处理工作负载，2022 年，Kubernetes 社区成立了
  [WG-Batch](https://github.com/kubernetes/community/blob/master/wg-batch/README.md)，
  以更好地支持 Kubernetes 中的此类批处理工作负载。
  [Kueue](https://github.com/kubernetes-sigs/kueue) 是一个在其中扮演关键角色的项目。
  它是一个作业队列控制器，决定何时一个作业应该等待，何时一个作业应该被准许启动，以及何时一个作业应该被抢占。
  Kueue 旨在安装在一个普通的 Kubernetes 集群上，
  同时与现有的成熟控制器（调度器、cluster-autoscaler、kube-controller-manager 等）协作。

<!--
[KWOK](https://github.com/kubernetes-sigs/kwok):
: KWOK is a component in which you can create a cluster of thousands of Nodes in seconds. It’s
  mostly useful for simulation/testing as a lightweight cluster, and actually another SIG sub
  project [kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator)
  uses KWOK background.

[descheduler](https://github.com/kubernetes-sigs/descheduler):
: Descheduler is a component recreating pods that are running on undesired Nodes.  In Kubernetes,
scheduling constraints (`PodAffinity`, `NodeAffinity`, `PodTopologySpread`, etc) are honored only at
Pod schedule, but it’s not guaranteed that the contrtaints are kept being satisfied afterwards.
Descheduler evicts Pods violating their scheduling constraints (or other undesired conditions) so
that they’re recreated and rescheduled.
-->
[KWOK](https://github.com/kubernetes-sigs/kwok)
: KWOK 这个组件可以在几秒钟内创建一个包含数千个节点的集群。它主要用于模拟/测试轻量级集群，实际上另一个 SIG 子项目
  [kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator) 就在后端使用了 KWOK。

[Descheduler](https://github.com/kubernetes-sigs/descheduler)
: Descheduler 这个组件可以将运行在不理想的节点上的 Pod 重新创建。
  在 Kubernetes 中，调度约束（`PodAffinity`、`NodeAffinity`、`PodTopologySpread` 等）仅在 Pod 调度时被考虑，
  但不能保证这些约束在之后仍然被满足。Descheduler 会驱逐违反其调度约束（或其他不符合预期状况）的 Pod，
  以便这些 Pod 被重新创建和重新调度。

<!--
[Descheduling Framework](https://github.com/kubernetes-sigs/descheduler/blob/master/keps/753-descheduling-framework/README.md).
: One very interesting on-going project, similar to [Scheduling
  Framework](https://kubernetes.io/docs/concepts/scheduling-eviction/scheduling-framework/) in the
  scheduler, aiming to make descheduling logic extensible and allow maintainers to focus on building
  a core engine of descheduler.
-->
[Descheduling Framework](https://github.com/kubernetes-sigs/descheduler/blob/master/keps/753-descheduling-framework/README.md):
: 一个非常有趣的正在进行的项目，类似于调度器中的[调度框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)，
  旨在使去调度逻辑可扩展，并允许维护者们专注于构建 Descheduler 的核心引擎。

<!--
**AP: Thank you for letting us know! And I have to ask, what are some of your favorite things about
this SIG?**

**KN**: What I really like about this SIG is how actively engaged everyone is. We come from various
companies and industries, bringing diverse perspectives to the table. Instead of these differences
causing division, they actually generate a wealth of opinions. Each view is respected, and this
makes our discussions both rich and productive.

I really appreciate this collaborative atmosphere, and I believe it has been key to continuously
improving our components over the years.
-->
**AP: 感谢你告诉我们这些！我想问一下，你最喜欢这个 SIG 的哪些方面？**

**KN**: 我真正喜欢这个 SIG 的地方在于每个人都积极参与。
我们来自不同的公司和行业，带来了多样的视角。
这些差异并没有造成分歧，实际上产生了丰富的观点。
每种观点都会受到尊重，这使我们的讨论既丰富又富有成效。

我非常欣赏这种协作氛围，我相信这对我们多年来不断改进组件至关重要。

<!--
## Contributing to SIG Scheduling

**AP: Kubernetes is a community-driven project. Any recommendations for new contributors or
beginners looking to get involved and contribute to SIG scheduling? Where should they start?**

**KN**: Let me start with a general recommendation for contributing to any SIG: a common approach is
to look for
[good-first-issue](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).
However, you'll soon realize that many people worldwide are trying to contribute to the Kubernetes
repository.
-->
## 给 SIG Scheduling 做贡献

**AP: Kubernetes 是一个社区驱动的项目。你对新贡献者或希望参与并为
SIG Scheduling 做出贡献的初学者有什么建议？他们应该从哪里开始？**

**KN**: 让我先给出一个关于为任何 SIG 贡献的通用建议：一种常见的方法是寻找
[good-first-issue](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)。
然而，你很快就会意识到，世界各地有很多人正在尝试为 Kubernetes 仓库做贡献。

<!--
I suggest starting by examining the implementation of a component that interests you. If you have
any questions about it, ask in the corresponding Slack channel (e.g., #sig-scheduling for the
scheduler, #sig-node for kubelet, etc).  Once you have a rough understanding of the implementation,
look at issues within the SIG (e.g.,
[sig-scheduling](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fscheduling)),
where you'll find more unassigned issues compared to good-first-issue ones.  You may also want to
filter issues with the
[kind/cleanup](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue++label%3Akind%2Fcleanup+)
label, which often indicates lower-priority tasks and can be starting points.
-->
我建议先查看你感兴趣的某个组件的实现。如果你对该组件有任何疑问，可以在相应的
Slack 频道中提问（例如，调度器的 #sig-scheduling，kubelet 的 #sig-node 等）。
一旦你对实现有了大致了解，就可以查看 SIG 中的 Issue
（例如，[sig-scheduling](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fscheduling)），
相比 good-first-issue，在这里你会发现更多未分配的 Issue。你可能还想过滤带有
[kind/cleanup](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue++label%3Akind%2Fcleanup+)
标签的 Issue，这通常表示较低优先级的任务，可以作为起点。

<!--
Specifically for SIG Scheduling, you should first understand the [Scheduling
Framework](https://kubernetes.io/docs/concepts/scheduling-eviction/scheduling-framework/), which is
the fundamental architecture of kube-scheduler.  Most of the implementation is found in
[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler). I suggest
starting with
[ScheduleOne](https://github.com/kubernetes/kubernetes/blob/0590bb1ac495ae8af2a573f879408e48800da2c5/pkg/scheduler/schedule_one.go#L66)
function and then exploring deeper from there.

Additionally, apart from the main kubernetes/kubernetes repository, consider looking into
sub-projects. These typically have fewer maintainers and offer more opportunities to make a
significant impact. Despite being called "sub" projects, many have a large number of users and a
considerable impact on the community.
-->
具体对于 SIG Scheduling 而言，你应该先了解[调度框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)，
这是 kube-scheduler 的基本架构。大多数实现都可以在
[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler)中找到。我建议从
[ScheduleOne](https://github.com/kubernetes/kubernetes/blob/0590bb1ac495ae8af2a573f879408e48800da2c5/pkg/scheduler/schedule_one.go#L66)
函数开始，然后再深入探索。

此外，除了 kubernetes/kubernetes 主仓库外，还可以考虑查看一些子项目。
这些子项目的维护者通常比较少，你有更多的机会来对其产生重大影响。尽管被称为“子”项目，
但许多项目实际上有大量用户，并对社区产生了相当大的影响。

<!--
And last but not least, remember contributing to the community isn’t just about code.  While I
talked a lot about the implementation contribution, there are many ways to contribute, and each one
is valuable. One comment to an issue, one feedback to an existing feature, one review comment in PR,
one clarification on the documentation; every small contribution helps drive the Kubernetes
ecosystem forward.

**AP: Those are some pretty useful tips! And if I may ask, how do you assist new contributors in
getting started, and what skills are contributors likely to learn by participating in SIG
Scheduling?**
-->
最后但同样重要的是，记住为社区做贡献不仅仅是编写代码。
虽然我谈到了很多关于实现的贡献，但还有许多其他方式可以做贡献，每一种都很有价值。
对某个 Issue 的一条评论，对现有特性的一个反馈，对 PR 的一个审查建议，对文档的一个说明阐述；
每一个小贡献都有助于推动 Kubernetes 生态系统向前发展。

**AP: 这些建议非常有用！冒昧问一下，你是如何帮助新贡献者入门的，参与 SIG Scheduling 的贡献者可能会学习到哪些技能？**

<!--
**KN**: Our maintainers are available to answer your questions in the #sig-scheduling Slack
channel. By participating, you'll gain a deeper understanding of Kubernetes scheduling and have the
opportunity to collaborate and network with maintainers from diverse backgrounds. You'll learn not
just how to write code, but also how to maintain a large project, design and discuss new features,
address bugs, and much more.

## Future Directions

**AP: What are some Kubernetes-specific challenges in terms of scheduling? Are there any particular
pain points?**
-->
**KN**: 我们的维护者在 #sig-scheduling Slack 频道中随时可以回答你的问题。
多多参与，你将深入了解 Kubernetes 的调度，并有机会与来自不同背景的维护者合作和建立联系。
你将学习到的不仅仅是如何编写代码，还有如何维护大型项目、设计和讨论新特性、解决 Bug 等等。

## 未来方向

**AP: 在调度方面，Kubernetes 特有的挑战有哪些？有没有特别的痛点？**

<!--
**KN**: Scheduling in Kubernetes can be quite challenging because of the diverse needs of different
organizations with different business requirements. Supporting all possible use cases in
kube-scheduler is impossible. Therefore, extensibility is a key focus for us. A few years ago, we
rearchitected kube-scheduler with [Scheduling
Framework](https://kubernetes.io/docs/concepts/scheduling-eviction/scheduling-framework/), which
offers flexible extensibility for users to implement various scheduling needs through plugins. This
allows maintainers to focus on the core scheduling features and the framework runtime.
-->
**KN**: 在 Kubernetes 中进行调度可能相当具有挑战性，因为不同组织有不同的业务要求。
在 kube-scheduler 中支持所有可能的使用场景是不可能的。因此，可扩展性是我们关注的核心焦点。
几年前，我们使用[调度框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)为
kube-scheduler 重新设计了架构，为用户通过插件实现各种调度需求提供了灵活的可扩展性。
这使得维护者们能够专注于核心调度特性和框架运行时。

<!--
Another major issue is maintaining sufficient scheduling throughput. Typically, a Kubernetes cluster
has only one kube-scheduler, so its throughput directly affects the overall scheduling scalability
and, consequently, the cluster's scalability. Although we have an internal performance test
([scheduler_perf](https://github.com/kubernetes/kubernetes/tree/master/test/integration/scheduler_perf)),
unfortunately, we sometimes overlook performance degradation in less common scenarios. It’s
difficult as even small changes, which look irrelevant to performance, can lead to degradation.
-->
另一个主要问题是保持足够的调度吞吐量。通常，一个 Kubernetes 集群只有一个 kube-scheduler，
因此其吞吐量直接影响整体调度的可扩展性，从而影响集群的可扩展性。尽管我们有一个内部性能测试
([scheduler_perf](https://github.com/kubernetes/kubernetes/tree/master/test/integration/scheduler_perf))，
但不巧的是，我们有时会忽视在不常见场景下的性能下降。即使是与性能无关的小改动也有难度，可能导致性能下降。

<!--
**AP:  What are some upcoming goals or initiatives for SIG Scheduling? How do you envision the SIG evolving in the future?**

**KN**: Our primary goal is always to build and maintain _extensible_ and _stable_ scheduling
runtime, and I bet this goal will remain unchanged forever.

As already mentioned, extensibility is key to solving the challenge of the diverse needs of
scheduling. Rather than trying to support every different use case directly in kube-scheduler, we
will continue to focus on enhancing extensibility so that it can accommodate various use
cases. [kube-scheduler-wasm-extention](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension)
that I mentioned is also part of this initiative.
-->
**AP: 接下来 SIG Scheduling 有哪些即将实现的目标或计划？你如何看待 SIG 的未来发展？**

**KN**: 我们的主要目标始终是构建和维护**可扩展的**和**稳定的**调度运行时，我敢打赌这个目标将永远不会改变。

正如之前所提到的，可扩展性是解决调度多样化需求挑战的关键。我们不会尝试直接在 kube-scheduler 中支持每种不同的使用场景，
而是将继续专注于增强可扩展性，以便能够适应各种用例。我提到的
[kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension)
也是这一计划的一部分。

<!--
Regarding stability, introducing new optimizations like QueueHint is one of our
strategies. Additionally, maintaining throughput is also a crucial goal towards the future. We’re
planning to enhance our throughput monitoring
([ref](https://github.com/kubernetes/kubernetes/issues/124774)), so that we can notice degradation
as much as possible on our own before releasing. But, realistically, we can't cover every possible
scenario. We highly appreciate any attention the community can give to scheduling throughput and
encourage feedback and alerts regarding performance issues!
-->
关于稳定性，引入 QueueHint 这类新的优化是我们的一项策略。
此外，保持吞吐量也是面向未来的关键目标。我们计划增强我们的吞吐量监控
([参考](https://github.com/kubernetes/kubernetes/issues/124774))，
以便在发布之前尽可能多地发现性能下降问题。但实际上，我们无法覆盖每个可能的场景。
我们非常感谢社区对调度吞吐量的关注，鼓励大家提出反馈，就性能问题提出警示！

<!--
## Closing Remarks

**AP: Finally, what message would you like to convey to those who are interested in learning more
about SIG Scheduling?**

**KN**: Scheduling is one of the most complicated areas in Kubernetes, and you may find it difficult
at first. But, as I shared earlier, you can find many opportunities for contributions, and many
maintainers are willing to help you understand things. We know your unique perspective and skills
are what makes our open source so powerful :)
-->
## 结束语

**AP: 最后，你想对那些有兴趣了解 SIG Scheduling 的人说些什么？**

**KN**: 调度是 Kubernetes 中最复杂的领域之一，你可能一开始会觉得很困难。但正如我之前分享的，
你可以找到许多贡献的机会，许多维护者愿意帮助你理解各事项。
我们知道你独特的视角和技能是我们的开源项目能够如此强大的源泉 :)

<!--
Feel free to reach out to us in Slack
([#sig-scheduling](https://kubernetes.slack.com/archives/C09TP78DV)) or
[meetings](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md#meetings).
I hope this article interests everyone and we can see new contributors!

**AP: Thank you so much for taking the time to do this! I'm confident that many will find this
information invaluable for understanding more about SIG Scheduling and for contributing to the SIG.**
-->
随时可以通过 Slack ([#sig-scheduling](https://kubernetes.slack.com/archives/C09TP78DV))
或[会议](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md#meetings)联系我们。
我希望这篇文章能引起大家的兴趣，希望能吸引到新的贡献者！

**AP: 非常感谢你抽出时间进行这次访谈！我相信很多人会发现这些信息对理解 SIG Scheduling 和参与 SIG 的贡献非常有价值。**
