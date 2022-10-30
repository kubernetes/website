---
layout: blog
title: "关注 SIG Node"
date: 2021-09-27
slug: sig-node-spotlight-2021
---
<!--
---
layout: blog
title: "Spotlight on SIG Node"
date: 2021-09-27
slug: sig-node-spotlight-2021
--- 
-->
**Author:** Dewan Ahmed, Red Hat
<!--
**Author:** Dewan Ahmed, Red Hat
-->

<!--
## Introduction

In Kubernetes, a _Node_ is a representation of a single machine in your cluster. [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) owns that very important Node component and supports various subprojects such as Kubelet, Container Runtime Interface (CRI) and more to support how the pods and host resources interact. In this blog, we have summarized our conversation with [Elana Hashman (EH)](https://twitter.com/ehashdn) & [Sergey Kanzhelev (SK)](https://twitter.com/SergeyKanzhelev), who walk us through the various aspects of being a part of the SIG and share some insights about how others can get involved.
-->

## 介绍

在 Kubernetes 中，一个 _Node_ 是你集群中的某台机器。
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 负责这一非常重要的 Node 组件并支持各种子项目，
如 Kubelet, Container Runtime Interface (CRI) 以及其他支持 Pod 和主机资源间交互的子项目。
在这篇文章中，我们总结了和 [Elana Hashman (EH)](https://twitter.com/ehashdn) & [Sergey Kanzhelev (SK)](https://twitter.com/SergeyKanzhelev) 的对话，是他们带领我们了解作为此 SIG 一份子的各个方面，并分享一些关于其他人如何参与的见解。

<!--
## A summary of our conversation

### Could you tell us a little about what SIG Node does?

SK: SIG Node is a vertical SIG responsible for the components that support the controlled interactions between the pods and host resources. We manage the lifecycle of pods that are scheduled to a node. This SIG's focus is to enable a broad set of workload types, including workloads with hardware specific or performance sensitive requirements. All while maintaining isolation boundaries between pods on a node, as well as the pod and the host. This SIG maintains quite a few components and has many external dependencies (like container runtimes or operating system features), which makes the complexity we deal with huge. We tame the complexity and aim to continuously improve node reliability.
-->
## 我们的对话总结

### 你能告诉我们一些关于 SIG Node 的工作吗？

SK：SIG Node 是一个垂直 SIG，负责支持 Pod 和主机资源之间受控互动的组件。我们管理被调度到节点上的 Pod 的生命周期。
这个 SIG 的重点是支持广泛的工作负载类型，包括具有硬件特性或性能敏感要求的工作负载。同时保持节点上 Pod 之间的隔离边界，以及 Pod 和主机的隔离边界。
这个 SIG 维护了相当多的组件，并有许多外部依赖（如容器运行时间或操作系统功能），这使得我们处理起来十分复杂。但我们战胜了这种复杂度，旨在不断提高节点的可靠性。

<!--
### "SIG Node is a vertical SIG" could you explain a bit more?

EH: There are two kinds of SIGs: horizontal and vertical. Horizontal SIGs are concerned with a particular function of every component in Kubernetes: for example, SIG Security considers security aspects of every component in Kubernetes, or SIG Instrumentation looks at the logs, metrics, traces and events of every component in Kubernetes. Such SIGs don't tend to own a lot of code.

Vertical SIGs, on the other hand, own a single component, and are responsible for approving and merging patches to that code base. SIG Node owns the "Node" vertical, pertaining to the kubelet and its lifecycle. This includes the code for the kubelet itself, as well as the node controller, the container runtime interface, and related subprojects like the node problem detector. 
-->
### 你能再解释一下 “SIG Node 是一种垂直 SIG” 的含义吗？

EH：有两种 SIG：横向和垂直。横向 SIG 关注 Kubernetes 中每个组件的特定功能：例如，SIG Security 考虑 Kubernetes 中每个组件的安全方面，或者 SIG Instrumentation 关注 Kubernetes 中每个组件的日志、度量、跟踪和事件。
这样的 SIG 并不太会拥有大量的代码。

相反，垂直 SIG 拥有一个单一的组件，并负责批准和合并该代码库的补丁。
SIG Node 拥有 "Node" 的垂直性，与 kubelet 和它的生命周期有关。这包括 kubelet 本身的代码，以及节点控制器、容器运行时接口和相关的子项目，比如节点问题检测器。

<!--
### How did the CI subproject start? Is this specific to SIG Node and how does it help the SIG?

SK: The subproject started as a follow up after one of the releases was blocked by numerous test failures of critical tests. These tests haven’t started falling all at once, rather continuous lack of attention led to slow degradation of tests quality. SIG Node was always prioritizing quality and reliability, and forming of the subproject was a way to highlight this priority.
-->
### CI 子项目是如何开始的？这是专门针对 SIG Node 的吗？它对 SIG 有什么帮助？

SK：该子项目是在其中一个版本因关键测试的大量测试失败而受阻后开始跟进的。
这些测试并不是一下子就开始下降的，而是持续的缺乏关注导致了测试质量的缓慢下降。
SIG Node 一直将质量和可靠性放在首位，组建这个子项目是强调这一优先事项的一种方式。

<!--
### As the 3rd largest SIG in terms of number of issues and PRs, how does your SIG juggle so much work?

EH: It helps to be organized. When I increased my contributions to the SIG in January of 2021, I found myself overwhelmed by the volume of pull requests and issues and wasn't sure where to start. We were already tracking test-related issues and pull requests on the CI subproject board, but that was missing a lot of our bugfixes and feature work. So I began putting together a triage board for the rest of our pull requests, which allowed me to sort each one by status and what actions to take, and documented its use for other contributors. We closed or merged over 500 issues and pull requests tracked by our two boards in each of the past two releases. The Kubernetes devstats showed that we have significantly increased our velocity as a result.

In June, we ran our first bug scrub event to work through the backlog of issues filed against SIG Node, ensuring they were properly categorized. We closed over 130 issues over the course of this 48 hour global event, but as of writing we still have 333 open issues. 
-->
### 作为 issue 和 PR 数量第三大的 SIG，你们 SIG 是如何兼顾这么多工作的？

EH：这归功于有组织性。当我在 2021 年 1 月增加对 SIG 的贡献时，我发现自己被大量的 PR 和 issue 淹没了，不知道该从哪里开始。
我们已经在 CI 子项目板上跟踪与测试有关的 issue 和 PR 请求，但这缺少了很多 bug 修复和功能工作。
因此，我开始为我们剩余的 PR 建立一个分流板，这使我能够根据状态和采取的行动对其进行分类，并为其他贡献者记录它的用途。
在过去的两个版本中，我们关闭或合并了超过 500 个 issue 和 PR。Kubernetes devstats 显示，我们的速度因此而大大提升。

6月，我们进行了第一次 bug 清除活动，以解决针对 SIG Node 的积压问题，确保它们被正确归类。
在这次 48 小时的全球活动中，我们关闭了 130 多个问题，但截至发稿时，我们仍有 333 个问题没有解决。
<!--
### Why should new and existing contributors consider joining SIG Node?

SK: Being a SIG Node contributor gives you skills and recognition that are rewarding and useful. Understanding under the hood of a kubelet helps architecting better apps, tune and optimize those apps, and gives leg up in issues troubleshooting. If you are a new contributor, SIG Node gives you the foundational knowledge that is key to understanding why other Kubernetes components are designed the way they are. Existing contributors may benefit as many features will require SIG Node changes one way or another. So being a SIG Node contributor helps building features in other SIGs faster.

SIG Node maintains numerous components, many of which have dependency on external projects or OS features. This makes the onboarding process quite lengthy and demanding. But if you are up for a challenge, there is always a place for you, and a group of people to support. 
-->
### 为什么新的和现有的贡献者应该考虑加入 Node 兴趣小组呢？

SK：作为 SIG Node 的贡献者会带给你有意义且有用的技能和认可度。
了解 Kubelet 的内部结构有助于构建更好的应用程序，调整和优化这些应用程序，并在 issue 排查上获得优势。
如果你是一个新手贡献者，SIG Node 为你提供了基础知识，这是理解其他 Kubernetes 组件的设计方式的关键。
现在的贡献者可能会受益于许多功能都需要 SIG Node 的这种或那种变化。所以成为 SIG Node 的贡献者有助于更快地建立其他 SIG 的功能。

SIG Node 维护着许多组件，其中许多组件都依赖于外部项目或操作系统功能。这使得入职过程相当冗长和苛刻。
但如果你愿意接受挑战，总有一个地方适合你，也有一群人支持你。
<!--
### What do you do to help new contributors get started?

EH: Getting started in SIG Node can be intimidating, since there is so much work to be done, our SIG meetings are very large, and it can be hard to find a place to start.

I always encourage new contributors to work on things that they have some investment in already. In SIG Node, that might mean volunteering to help fix a bug that you have personally been affected by, or helping to triage bugs you care about by priority.

To come up to speed on any open source code base, there are two strategies you can take: start by exploring a particular issue deeply, and follow that to expand the edges of your knowledge as needed, or briefly review as many issues and change requests as you possibly can to get a higher level picture of how the component works. Ultimately, you will need to do both if you want to become a Node reviewer or approver.

[Davanum Srinivas](https://twitter.com/dims) and I each ran a cohort of group mentoring to help teach new contributors the skills to become Node reviewers, and if there's interest we can work to find a mentor to run another session. I also encourage new contributors to attend our Node CI Subproject meeting: it's a smaller audience and we don't record the triage sessions, so it can be a less intimidating way to get started with the SIG. 
-->
###  你是如何帮助新手贡献者开始工作的？

EH：在 SIG Node 的起步工作可能是令人生畏的，因为有太多的工作要做，我们的 SIG 会议非常大，而且很难找到一个开始的地方。

我总是鼓励新手贡献者在他们已经有一些投入的方向上更进一步。
在 SIG Node 中，这可能意味着自愿帮助修复一个只影响到你个人的 bug，或者按优先级去分流你关心的 bug。

为了尽快了解任何开源代码库，你可以采取两种策略：从深入探索一个特定的问题开始，然后根据需要扩展你的知识边缘，或者单纯地尽可能多的审查 issues 和变更请求，以了解更高层次的组件工作方式。
最终，如果你想成为一名 Node reviewer 或 approver，两件事是不可避免的。

[Davanum Srinivas](https://twitter.com/dims) 和我各自举办了一次小组辅导，以帮助教导新手贡献者成为 Node reviewer 的技能，如果有兴趣，我们可以努力寻找一个导师来举办另一次会议。
我也鼓励新手贡献者参加我们的 Node CI 子项目会议：它的听众较少，而且我们不记录分流会议，所以它可以是一个比较温和的方式来开始 SIG 之旅。
<!--
### Are there any particular skills you’d like to recruit for? What skills are contributors to SIG Usability likely to learn?

SK: SIG Node works on many workstreams in very different areas. All of these areas are on system level. For the typical code contributions you need to have a passion for building and utilizing low level APIs and writing performant and reliable components. Being a contributor you will learn how to debug and troubleshoot, profile, and monitor these components, as well as user workload that is run by these components. Often, with the limited to no access to Nodes, as they are running production workloads.

The other way of contribution is to help document SIG node features. This type of contribution requires a deep understanding of features, and ability to explain them in simple terms.

Finally, we are always looking for feedback on how best to run your workload. Come and  explain specifics of it, and what features in SIG Node components may help to run it better. 
-->
### 有什么特别的技能者是你想招募的吗？对 SIG 可用性的贡献者可能会学到什么技能？

SK：SIG Node 在大相径庭的领域从事许多工作流。所有这些领域都是系统级的。
对于典型的代码贡献，你需要对建立和善用低级别的 API 以及编写高性能和可靠的组件有热情。
作为一个贡献者，你将学习如何调试和排除故障，剖析和监控这些组件，以及由这些组件运行的用户工作负载。
通常情况下，由于节点正在运行生产工作负载，所以对节点的访问是有限的，甚至是没有的。

另一种贡献方式是帮助记录 SIG Node 的功能。这种类型的贡献需要对功能有深刻的理解，并有能力用简单的术语解释它们。

最后，我们一直在寻找关于如何最好地运行你的工作负载的反馈。来解释一下它的具体情况，以及 SIG Node 组件中的哪些功能可能有助于更好地运行它。
<!--
### What are you getting positive feedback on, and what’s coming up next for SIG Node?

EH: Over the past year SIG Node has adopted some new processes to help manage our feature development and Kubernetes enhancement proposals, and other SIGs have looked to us for inspiration in managing large workloads. I hope that this is an area we can continue to provide leadership in and further iterate on.

We have a great balance of new features and deprecations in flight right now. Deprecations of unused or difficult to maintain features help us keep technical debt and maintenance load under control, and examples include the dockershim and DynamicKubeletConfiguration deprecations. New features will unlock additional functionality in end users' clusters, and include exciting features like support for cgroups v2, swap memory, graceful node shutdowns, and device management policies.
-->
### 你在哪些方面得到了积极的反馈，以及 SIG Node 的下一步计划是什么？

EH：在过去的一年里，SIG Node 采用了一些新的流程来帮助管理我们的功能开发和 Kubernetes 增强提议，其他 SIG 也向我们寻求在管理大型工作负载方面的灵感。
我希望这是一个我们可以继续领导并进一步迭代的领域。

现在，我们在新功能和废弃功能之间保持了很好的平衡。
废弃未使用或难以维护的功能有助于我们控制技术债务和维护负荷，例子包括 dockershim 和 DynamicKubeletConfiguration 的废弃。
新功能将在终端用户的集群中释放更多的功能，包括令人兴奋的功能，如支持 cgroups v2、交换内存、优雅的节点关闭和设备管理策略。
<!--
### Any closing thoughts/resources you’d like to share?

SK/EH: It takes time and effort to get to any open source community. SIG Node may overwhelm you at first with the number of participants, volume of work, and project scope. But it is totally worth it. Join our welcoming community! [SIG Node GitHub Repo](https://github.com/kubernetes/community/tree/master/sig-node) contains many useful resources including Slack, mailing list and other contact info. 
-->
### 最后你有什么想法/资源要分享吗？

SK/EH：进入任何开源社区都需要时间和努力。一开始 SIG Node 可能会因为参与者的数量、工作量和项目范围而让你不知所措。但这是完全值得的。
请加入我们这个热情的社区! [SIG Node GitHub Repo](https://github.com/kubernetes/community/tree/master/sig-node)
包含许多有用的资源，包括 Slack、邮件列表和其他联系信息。
<!--
## Wrap Up

SIG Node hosted a [KubeCon + CloudNativeCon Europe 2021 talk](https://www.youtube.com/watch?v=z5aY4e2RENA) with an intro and deep dive to their awesome SIG. Join the SIG's meetings to find out about the most recent research results, what the plans are for the forthcoming year, and how to get involved in the upstream Node team as a contributor!
-->
## 总结

SIG Node 举办了一场 [KubeCon + CloudNativeCon Europe 2021 talk](https://www.youtube.com/watch?v=z5aY4e2RENA)，对他们强大的 SIG 进行了介绍和深入探讨。
加入 SIG 的会议，了解最新的研究成果，未来一年的计划是什么，以及如何作为贡献者参与到上游的 Node 团队中!