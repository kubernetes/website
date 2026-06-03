---
layout: blog
title: "聚焦 SIG Apps"
slug: sig-apps-spotlight-2025
canonicalUrl: https://www.kubernetes.dev/blog/2025/03/12/sig-apps-spotlight-2025
date: 2025-03-12
author: "Sandipan Panda (DevZero)"
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Spotlight on SIG Apps"
slug: sig-apps-spotlight-2025
canonicalUrl: https://www.kubernetes.dev/blog/2025/03/12/sig-apps-spotlight-2025
date: 2025-03-12
author: "Sandipan Panda (DevZero)"
-->

<!--
In our ongoing SIG Spotlight series, we dive into the heart of the Kubernetes project by talking to
the leaders of its various Special Interest Groups (SIGs). This time, we focus on 
**[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps#apps-special-interest-group)**,
the group responsible for everything related to developing, deploying, and operating applications on
Kubernetes. [Sandipan Panda](https://www.linkedin.com/in/sandipanpanda)
([DevZero](https://www.devzero.io/)) had the opportunity to interview [Maciej
Szulik](https://github.com/soltysh) ([Defense Unicorns](https://defenseunicorns.com/)) and [Janet
Kuo](https://github.com/janetkuo) ([Google](https://about.google/)), the chairs and tech leads of
SIG Apps. They shared their experiences, challenges, and visions for the future of application
management within the Kubernetes ecosystem.
-->
在我们正在进行的 SIG 聚焦系列中，我们通过与 Kubernetes 项目各个特别兴趣小组（SIG）的领导者对话，
深入探讨 Kubernetes 项目的核心。这一次，我们聚焦于
**[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps#apps-special-interest-group)**，
这个小组负责 Kubernetes 上与应用程序开发、部署和操作相关的所有内容。
[Sandipan Panda](https://www.linkedin.com/in/sandipanpanda)（[DevZero](https://www.devzero.io/））
有机会采访了 SIG Apps 的主席和技术负责人
[Maciej Szulik](https://github.com/soltysh)（[Defense Unicorns](https://defenseunicorns.com/)）
以及 [Janet Kuo](https://github.com/janetkuo)（[Google](https://about.google/)）。
他们分享了在 Kubernetes 生态系统中关于应用管理的经验、挑战以及未来愿景。

<!--
## Introductions

**Sandipan: Hello, could you start by telling us a bit about yourself, your role, and your journey
within the Kubernetes community that led to your current roles in SIG Apps?**

**Maciej**: Hey, my name is Maciej, and I’m one of the leads for SIG Apps. Aside from this role, you
can also find me helping
[SIG CLI](https://github.com/kubernetes/community/tree/master/sig-cli#readme) and also being one of
the Steering Committee members. I’ve been contributing to Kubernetes since late 2014 in various
areas, including controllers, apiserver, and kubectl.
-->
## 自我介绍

**Sandipan**：你好，能否先简单介绍一下你自己、你的角色，以及你在
Kubernetes 社区中的经历，这些经历是如何引导你担任 SIG Apps 的当前角色的？

**Maciej**：嗨，我叫 Maciej，是 SIG Apps 的负责人之一。除了这个角色，
你还可以看到我在协助 [SIG CLI](https://github.com/kubernetes/community/tree/master/sig-cli#readme)
的工作，同时我也是指导委员会的成员之一。自 2014 年底以来，我一直为
Kubernetes 做出贡献，涉及的领域包括控制器、API 服务器以及 kubectl。

<!--
**Janet**: Certainly! I'm Janet, a Staff Software Engineer at Google, and I've been deeply involved
with the Kubernetes project since its early days, even before the 1.0 launch in 2015.  It's been an
amazing journey!

My current role within the Kubernetes community is one of the chairs and tech leads of SIG Apps. My
journey with SIG Apps started organically. I started with building the Deployment API and adding
rolling update functionalities. I naturally gravitated towards SIG Apps and became increasingly
involved. Over time, I took on more responsibilities, culminating in my current leadership roles.
-->
**Janet**：当然可以！我是 Janet，在 Google 担任资深软件工程师，
并且从 Kubernetes 项目早期（甚至在 2015 年 1.0 版本发布之前）就深度参与其中。
这是一段非常精彩的旅程！

我在 Kubernetes 社区中的当前角色是 SIG Apps 的主席之一和技术负责人之一。
我与 SIG Apps 的结缘始于自然而然的过程。最初，我从构建 Deployment API
并添加滚动更新功能开始，逐渐对 SIG Apps 产生了浓厚的兴趣，并且参与度越来越高。
随着时间推移，我承担了更多的责任，最终走到了目前的领导岗位。

<!--
## About SIG Apps

*All following answers were jointly provided by Maciej and Janet.*

**Sandipan: For those unfamiliar, could you provide an overview of SIG Apps' mission and objectives?
What key problems does it aim to solve within the Kubernetes ecosystem?**
-->
## 关于 SIG Apps

**以下所有回答均由 Maciej 和 Janet 共同提供。**

**Sandipan**：对于那些不熟悉的人，能否简要介绍一下 SIG Apps 的使命和目标？
它在 Kubernetes 生态系统中旨在解决哪些关键问题？

<!--
As described in our
[charter](https://github.com/kubernetes/community/blob/master/sig-apps/charter.md#scope), we cover a
broad area related to developing, deploying, and operating applications on Kubernetes. That, in
short, means we’re open to each and everyone showing up at our bi-weekly meetings and discussing the
ups and downs of writing and deploying various applications on Kubernetes.

**Sandipan: What are some of the most significant projects or initiatives currently being undertaken
by SIG Apps?**
-->
正如我们在[章程](https://github.com/kubernetes/community/blob/master/sig-apps/charter.md#scope)中所描述的那样，
我们涵盖了与在 Kubernetes 上开发、部署和操作应用程序相关的广泛领域。
简而言之，这意味着我们欢迎每个人参加我们的双周会议，讨论在 Kubernetes
上编写和部署各种应用程序的经验和挑战。

**Sandipan**：SIG Apps 目前正在进行的一些最重要项目或倡议有哪些？

<!--
At this point in time, the main factors driving the development of our controllers are the
challenges coming from running various AI-related workloads. It’s worth giving credit here to two
working groups we’ve sponsored over the past years:
-->
在当前阶段，推动我们控制器开发的主要因素是运行各种 AI 相关工作负载所带来的挑战。
在此值得一提的是，过去几年我们支持的两个工作组：

<!--
1. [The Batch Working Group](https://github.com/kubernetes/community/tree/master/wg-batch), which is
   looking at running HPC, AI/ML, and data analytics jobs on top of Kubernetes.
2. [The Serving Working Group](https://github.com/kubernetes/community/tree/master/wg-serving), which
   is focusing on hardware-accelerated AI/ML inference.
-->
1. [Batch 工作组](https://github.com/kubernetes/community/tree/master/wg-batch)，
   该工作组致力于在 Kubernetes 上运行 HPC、AI/ML 和数据分析作业。
2. [Serving 工作组](https://github.com/kubernetes/community/tree/master/wg-serving)，
   该工作组专注于硬件加速的 AI/ML 推理。

<!---
## Best practices and challenges

**Sandipan: SIG Apps plays a crucial role in developing application management best practices for
Kubernetes. Can you share some of these best practices and how they help improve application
lifecycle management?**
-->
## 最佳实践与挑战

**Sandipan**：SIG Apps 在为 Kubernetes 开发应用程序管理最佳实践方面发挥着关键作用。
你能分享一些这些最佳实践吗？以及它们如何帮助改进应用程序生命周期管理？

<!--
1. Implementing [health checks and readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
ensures that your applications are healthy and ready to serve traffic, leading to improved
reliability and uptime. The above, combined with comprehensive logging, monitoring, and tracing
solutions, will provide insights into your application's behavior, enabling you to identify and
resolve issues quickly.
-->
1. 实施[健康检查和就绪探针](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
   确保你的应用程序处于健康状态并准备好处理流量，从而提高可靠性和正常运行时间。
   结合全面的日志记录、监控和跟踪解决方案，上述措施将为您提供应用程序行为的洞察，
   使你能够快速识别并解决问题。

<!--
2. [Auto-scale your application](/docs/concepts/workloads/autoscaling/) based
   on resource utilization or custom metrics, optimizing resource usage and ensuring your
   application can handle varying loads.
-->
2. 根据资源利用率或自定义指标[自动扩缩你的应用](/zh-cn/docs/concepts/workloads/autoscaling/)，
   优化资源使用并确保您的应用程序能够处理不同的负载。

<!--
3. Use Deployment for stateless applications, StatefulSet for stateful applications, Job
   and CronJob for batch workloads, and DaemonSet for running a daemon on each node. Use
   Operators and CRDs to extend the Kubernetes API to automate the deployment, management, and
   lifecycle of complex applications, making them easier to operate and reducing manual
   intervention.
-->
3. 对于无状态应用程序使用 Deployment，对于有状态应用程序使用 StatefulSet，
   对于批处理工作负载使用 Job 和 CronJob，在每个节点上运行守护进程时使用
   DaemonSet。使用 Operator 和 CRD 扩展 Kubernetes API 以自动化复杂应用程序的部署、
   管理和生命周期，使其更易于操作并减少手动干预。

<!--
**Sandipan: What are some of the common challenges SIG Apps faces, and how do you address them?**

The biggest challenge we’re facing all the time is the need to reject a lot of features, ideas, and
improvements. This requires a lot of discipline and patience to be able to explain the reasons
behind those decisions.
-->
**Sandipan**：SIG Apps 面临的一些常见挑战是什么？你们是如何解决这些问题的？

我们一直面临的最大挑战是需要拒绝许多功能、想法和改进。这需要大量的纪律性和耐心，
以便能够解释做出这些决定背后的原因。

<!--
**Sandipan: How has the evolution of Kubernetes influenced the work of SIG Apps? Are there any
recent changes or upcoming features in Kubernetes that you find particularly relevant or beneficial
for SIG Apps?**

The main benefit for both us and the whole community around SIG Apps is the ability to extend
kubernetes with [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
and the fact that users can build their own custom controllers leveraging the built-in ones to
achieve whatever sophisticated use cases they might have and we, as the core maintainers, haven’t
considered or weren’t able to efficiently resolve inside Kubernetes.
-->
**Sandipan**：Kubernetes 的演进如何影响了 SIG Apps 的工作？
Kubernetes 最近是否有任何变化或即将推出的功能，你认为对
SIG Apps 特别相关或有益？

对我们以及围绕 SIG Apps 的整个社区而言，
最大的好处是能够通过[自定义资源定义（Custom Resource Definitions）](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)扩展
Kubernetes。用户可以利用内置控制器构建自己的自定义控制器，
以实现他们可能面对的各种复杂用例，而我们作为核心维护者，
可能没有考虑过这些用例，或者无法在 Kubernetes 内部高效解决。

<!--
## Contributing to SIG Apps

**Sandipan: What opportunities are available for new contributors who want to get involved with SIG
Apps, and what advice would you give them?**
-->
## 贡献于 SIG Apps

**Sandipan**：对于想要参与 SIG Apps 的新贡献者，有哪些机会？
你会给他们什么建议？

<!--
We get the question, "What good first issue might you recommend we start with?" a lot :-) But
unfortunately, there’s no easy answer to it. We always tell everyone that the best option to start
contributing to core controllers is to find one you are willing to spend some time with. Read
through the code, then try running unit tests and integration tests focusing on that
controller. Once you grasp the general idea, try breaking it and the tests again to verify your
breakage. Once you start feeling confident you understand that particular controller, you may want
to search through open issues affecting that controller and either provide suggestions, explaining
the problem users have, or maybe attempt your first fix.
-->
我们经常被问道：“你们建议我们从哪个好的初始问题开始？” :-)
但遗憾的是，这个问题没有简单的答案。我们总是告诉大家，
为核心控制器做贡献的最佳方式是找到一个你愿意花时间研究的控制器。
阅读代码，然后尝试运行针对该控制器的单元测试和集成测试。一旦你掌握了大致的概念，
试着破坏它并再次运行测试以验证你的改动。当你开始有信心理解了这个特定的控制器后，
你可以搜索影响该控制器的待处理问题，提供一些建议，解释用户遇到的问题，
或者尝试提交你的第一个修复。

<!--
Like we said, there are no shortcuts on that road; you need to spend the time with the codebase to
understand all the edge cases we’ve slowly built up to get to the point where we are. Once you’re
successful with one controller, you’ll need to repeat that same process with others all over again.

**Sandipan: How does SIG Apps gather feedback from the community, and how is this feedback
integrated into your work?**
-->
正如我们所说，在这条道路上没有捷径可走；你需要花时间研究代码库，
以理解我们逐步积累的所有边缘情况，从而达到我们现在的位置。
一旦你在一个控制器上取得了成功，你就需要在其他控制器上重复同样的过程。

**Sandipan**：SIG Apps 如何从社区收集反馈，以及这些反馈是如何整合到你们的工作中的？

<!--
We always encourage everyone to show up and present their problems and solutions during our
bi-weekly [meetings](https://github.com/kubernetes/community/tree/master/sig-apps#meetings). As long
as you’re solving an interesting problem on top of Kubernetes and you can provide valuable feedback
about any of the core controllers, we’re always happy to hear from everyone.
-->
我们总是鼓励每个人参加我们的双周[会议](https://github.com/kubernetes/community/tree/master/sig-apps#meetings)，
并在会上提出他们的问题和解决方案。只要你是在 Kubernetes 上解决一个有趣的问题，
并且能够对任何核心控制器提供有价值的反馈，我们都非常乐意听取每个人的意见。

<!--
## Looking ahead

**Sandipan: Looking ahead, what are the key focus areas or upcoming trends in application management
within Kubernetes that SIG Apps is excited about? How is the SIG adapting to these trends?**

Definitely the current AI hype is the major driving factor; as mentioned above, we have two working
groups, each covering a different aspect of it.
-->
## 展望未来

**Sandipan**：展望未来，Kubernetes 中应用程序管理的关键关注领域或即将到来的趋势有哪些是
SIG Apps 感到兴奋的？SIG 是如何适应这些趋势的？

当前的 AI 热潮无疑是主要的驱动因素；如上所述，我们有两个工作组，
每个工作组都涵盖了它的一个不同方面。

<!--
**Sandipan: What are some of your favorite things about this SIG?**

Without a doubt, the people that participate in our meetings and on
[Slack](https://kubernetes.slack.com/messages/sig-apps), who tirelessly help triage issues, pull
requests and invest a lot of their time (very frequently their private time) into making kubernetes
great!
-->
**Sandipan**：关于这个 SIG，你们最喜欢的事情有哪些？

毫无疑问，参与我们会议和
[Slack](https://kubernetes.slack.com/messages/sig-apps) 频道的人们是最让我们感到欣慰的。
他们不知疲倦地帮助处理问题、拉取请求，并投入大量的时间（很多时候是他们的私人时间）来让
Kubernetes 变得更好！

---

<!--
SIG Apps is an essential part of the Kubernetes community, helping to shape how applications are
deployed and managed at scale. From its work on improving Kubernetes' workload APIs to driving
innovation in AI/ML application management, SIG Apps is continually adapting to meet the needs of
modern application developers and operators. Whether you’re a new contributor or an experienced
developer, there’s always an opportunity to get involved and make an impact.
-->
SIG Apps 是 Kubernetes 社区的重要组成部分，
帮助塑造了应用程序如何在大规模下部署和管理的方式。从改进 Kubernetes
的工作负载 API 到推动 AI/ML 应用程序管理的创新，SIG Apps
不断适应以满足现代应用程序开发者和操作人员的需求。无论你是新贡献者还是有经验的开发者，
都有机会参与其中并产生影响。

<!--
If you’re interested in learning more or contributing to SIG Apps, be sure to check out their [SIG
README](https://github.com/kubernetes/community/tree/master/sig-apps) and join their bi-weekly [meetings](https://github.com/kubernetes/community/tree/master/sig-apps#meetings).

- [SIG Apps Mailing List](https://groups.google.com/a/kubernetes.io/g/sig-apps)
- [SIG Apps on Slack](https://kubernetes.slack.com/messages/sig-apps)
-->
如果你有兴趣了解更多关于 SIG Apps 的信息或为其做出贡献，务必查看他们的
[SIG README](https://github.com/kubernetes/community/tree/master/sig-apps)，
并加入他们的双周[会议](https://github.com/kubernetes/community/tree/master/sig-apps#meetings)。

- [SIG Apps 邮件列表](https://groups.google.com/a/kubernetes.io/g/sig-apps)
- [SIG Apps 在 Slack 上](https://kubernetes.slack.com/messages/sig-apps)
