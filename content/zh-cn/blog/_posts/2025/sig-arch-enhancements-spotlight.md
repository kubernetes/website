---
layout: blog
title: "聚焦 SIG Architecture: Enhancements"
slug: sig-architecture-enhancements
date: 2025-01-21
author: "Frederico Muñoz (SAS Institute)"
translator: "Michael Yao (DaoCloud)"
---
<!--
layout: blog
title: "Spotlight on SIG Architecture: Enhancements"
slug: sig-architecture-enhancements
canonicalUrl: https://www.kubernetes.dev/blog/2025/01/21/sig-architecture-enhancements
date: 2025-01-21
author: "Frederico Muñoz (SAS Institute)"
-->

<!--
_This is the fourth interview of a SIG Architecture Spotlight series that will cover the different
subprojects, and we will be covering [SIG Architecture:
Enhancements](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#enhancements)._

In this SIG Architecture spotlight we talked with [Kirsten
Garrison](https://github.com/kikisdeliveryservice), lead of the Enhancements subproject.
-->
**这是 SIG Architecture 聚光灯系列的第四次采访，我们将介绍
[SIG Architecture: Enhancements](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#enhancements)。**

在本次 SIG Architecture 专题采访中，我们访谈了 Enhancements
子项目的负责人 [Kirsten Garrison](https://github.com/kikisdeliveryservice)。

<!--
## The Enhancements subproject

**Frederico (FSM): Hi Kirsten, very happy to have the opportunity to talk about the Enhancements
subproject. Let's start with some quick information about yourself and your role.**
-->
## Enhancements 子项目

**Frederico (FSM)：你好 Kirsten，很高兴有机会讨论 Enhancements
子项目。开始请先介绍一下你自己和所承担的职责。**

<!--
**Kirsten Garrison (KG)**: I’m a lead of the Enhancements subproject of SIG-Architecture and
currently work at Google. I first got involved by contributing to the service-catalog project with
the help of [Carolyn Van Slyck](https://github.com/carolynvs). With time, [I joined the Release
team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.17/release_team.md),
eventually becoming the Enhancements Lead and a Release Lead shadow. While on the release team, I
worked on some ideas to make the process better for the SIGs and Enhancements team (the opt-in
process) based on my team’s experiences. Eventually, I started attending Subproject meetings and
contributing to the Subproject’s work.
-->
**Kirsten Garrison (KG)**：我是 SIG-Architecture 的 Enhancements 子项目的负责人，目前就职于 Google。
我最初在 [Carolyn Van Slyck](https://github.com/carolynvs) 的帮助下，为 service-catalog 项目贡献代码，
后来[加入了 Release 团队](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.17/release_team.md)，
最终成为 Enhancements Lead 和 Release Lead 影子。
在发布团队工作期间，我根据团队的经验为 SIG 和 Enhancements 团队提出了一些改进流程的想法（如参与其中的流程）。
之后，我开始参加子项目会议，并为这个子项目的工作做贡献。

<!--
**FSM: You mentioned the Enhancements subproject: how would you describe its main goals and areas of
intervention?**

**KG**: The [Enhancements
Subproject](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#enhancements)
primarily concerns itself with the [Kubernetes Enhancement
Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/0000-kep-process/README.md)
(_KEP_ for short)—the "design" documents required for all features and significant changes
to the Kubernetes project.
-->
**FSM：你提到了 Enhancements 子项目，你如何描述它的主要目标和干预范围？**

**KG**：[Enhancements 子项目](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#enhancements)的核心是管理
[Kubernetes 增强提案（KEP）](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/0000-kep-process/README.md)，
这是 Kubernetes 项目所有特性和重大变更的“设计”文档。

<!--
## The KEP and its impact

**FSM: The improvement of the KEP process was (and is) one in which SIG Architecture was heavily
involved. Could you explain the process to those that aren’t aware of it?**
-->
## KEP 及其影响    {#the-kep-and-its-impact}

**FSM：KEP 流程的改进一直是 SIG Architecture 深度参与的工作之一。你能为不了解的人介绍一下这个流程吗？**

<!--
**KG**: [Every release](https://kubernetes.io/releases/release/#the-release-cycle), the SIGs let the
Release Team know which features they intend to work on to be put into the release. As mentioned
above, the prerequisite for these changes is a KEP - a standardized design document that all authors
must fill out and approve in the first weeks of the release cycle. Most features [will move
through 3
phases](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/#feature-stages):
alpha, beta and finally GA so approving a feature represents a significant commitment for the SIG.
-->
**KG**：在[每次发布版本](/zh-cn/releases/release/#the-release-cycle)时，各个
SIG 需要告知 Release Team 各自计划将哪些特性放到当前的版本发布中。
正如前面提到的，所有变更的前提是有一个 KEP，这是一种标准化的设计文档，
所有 KEP 的作者必须在发布周期的最初几周内填写完并获得批准。
大多数特性[会经历三个阶段](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)：
Alpha、Beta，最终进入 GA，因此批准一个特性对 SIG 来说是一项重大承诺。

<!--
The KEP serves as the full source of truth of a feature. The [KEP
template](https://github.com/kubernetes/enhancements/blob/master/keps/NNNN-kep-template/README.md)
has different requirements based on what stage a feature is in, but it generally requires a detailed
discussion of the design and the impact as well as providing artifacts of stability and
performance. The KEP takes quite a bit of iterative work between authors, SIG reviewers, api review
team and the Production Readiness Review team[^1] before it is approved. Each set of reviewers is
looking to make sure that the proposal meets their standards in order to have a stable and
performant Kubernetes release. Only after all approvals are secured, can an author go forth and
merge their feature in the Kubernetes code base.
-->
KEP 作为某个特性真实、完整的信息来源。
[KEP 模板](https://github.com/kubernetes/enhancements/blob/master/keps/NNNN-kep-template/README.md)
对处于不同阶段的特性具有不同的要求，但通常需要详细讨论其设计、影响，并提供稳定性和性能的证明材料。
KEP 通常会在作者、SIG 审查人员、API 审查团队和 Production Readiness Review 团队[^1]之间进行多轮迭代后才能获批。
每组审查者都会确保提案符合其标准，以保证 Kubernetes 版本的稳定性和性能。
只有在所有审批完成后，作者才能将其特性合并到 Kubernetes 代码库。

<!--
**FSM: I see, quite a bit of additional structure was added. Looking back, what were the most
significant improvements of that approach?**

**KG**: In general, I think that the improvements with the most impact had to do with focusing on
the core intent of the KEP. KEPs exist not just to memorialize designs, but provide a structured way
to discuss and come to an agreement about different facets of the change. At the core of the KEP
process is communication and consideration.
-->
**FSM：我懂了，新增了一些结构。回顾来看，你认为这种流程方法最重要的改进是什么？**

**KG**：总体而言，我认为最有影响力的改进在于聚焦 KEP 的核心意图。
KEP 不仅仅是设计的存档文件，更是提供了一种结构化的方式来讨论和达成共识。
KEP 流程的核心是沟通和审慎考虑。

<!--
To that end, some of the significant changes revolve around a more detailed and accessible KEP
template. A significant amount of work was put in over time to get the
[k/enhancements](https://github.com/kubernetes/enhancements) repo into its current form -- a
directory structure organized by SIG with the contours of the modern KEP template (with
Proposal/Motivation/Design Details subsections). We might take that basic structure for granted
today, but it really represents the work of many people trying to get the foundation of this process
in place over time.
-->
为此，一些重要的改进围绕着更详细且更易于访问的 KEP 模板展开。
我们投入了大量时间，使 [k/enhancements](https://github.com/kubernetes/enhancements)
仓库发展成当前的形式：目录结构按 SIG 小组划分，附带现代 KEP 模板文件，
其中包含 Proposal/Motivation/Design Details（提案/动机/设计细节）等小节。
我们今天可能认为这种基本结构是理所当然的，但它实际上代表付出了许多人力和时间努力工作才奠定了这一流程基础。

<!--
As Kubernetes matures, we’ve needed to think about more than just the end goal of getting a single
feature merged. We need to think about things like: stability, performance, setting and meeting user
expectations. And as we’ve thought about those things the template has grown more detailed. The
addition of the Production Readiness Review was major as well as the enhanced testing requirements
(varying at different stages of a KEP’s lifecycle).
-->
随着 Kubernetes 的发展和成熟，我们需要考虑的不仅仅是如何合并单个特性，还需要关注稳定性、性能、设置和用户期望等问题。
因此随着我们的思考深入，KEP 模板变得更详细。例如增加了 Production Readiness Review 机制，同时对测试要求进行了强化
（这些要求会随着 KEP 生命周期的不同阶段动态调整）。

<!--
## Current areas of focus

**FSM: Speaking of maturing, we’ve [recently released Kubernetes
v1.31](https://kubernetes.io/blog/2024/08/13/kubernetes-v1-31-release/), and work on v1.32 [has
started](https://github.com/fsmunoz/sig-release/tree/release-1.32/releases/release-1.32). Are there
any areas that the Enhancements sub-project is currently addressing that might change the way things
are done?**
-->
## 当前关注领域   {#current-areas-of-focus}

**FSM：说到发展，我们[最近发布了 Kubernetes v1.31](/zh-cn/blog/2024/08/13/kubernetes-v1-31-release/)，
而 v1.32 版本的开发工作[已经开始](https://github.com/fsmunoz/sig-release/tree/release-1.32/releases/release-1.32)。
Enhancements 子项目目前有哪些领域正在推进以改进这个流程？**

<!--
**KG**: We’re currently working on two things:

  1) _Creating a Process KEP template._ Sometimes people want to harness the KEP process for
  significant changes that are more process oriented rather than feature oriented. We want to
  support this because memorializing changes is important and giving people a better tool to do so
  will only encourage more discussion and transparency.
  2) _KEP versioning._ While our template changes aim to be as non-disruptive as possible, we
  believe that it will be easier to track and communicate those changes to the community better with
  a versioned KEP template and the policies that go alongside such versioning.
-->
**KG**：我们目前正在进行两项工作：

1. **创建一个 Process KEP 模板**。有时，人们希望使用 KEP 流程来记录重要的流程变更，而不是特性变更。
   我们希望支持这一点，因为记录变更很重要，为此提供更好的工具将鼓励更多的讨论和更透明。
2. **KEP 版本化**。虽然我们的模板变更旨在尽量减少破坏性影响，但我们认为引入 KEP 版本化及相应的策略，
   可以让变更更易于追踪并更好地与社区沟通。

<!--
Both features will take some time to get right and fully roll out (just like a KEP feature) but we
believe that they will both provide improvements that will benefit the community at large.

**FSM: You mentioned improvements: I remember when project boards for Enhancement tracking were
introduced in recent releases, to great effect and unanimous applause from release team members. Was
this a particular area of focus for the subproject?**
-->
这两项改进都需要时间来完善和推广（就像 KEP 特性本身一样），但我们相信它们最终会给社区带来很大的好处。

**FSM：你提到了改进：我记得最近的发布引入了用于 Enhancement 追踪的项目看板（Project Board），
发布团队成员对此表示一致好评。这是 Enhancements 子项目的一个重点方向吗？**

<!--
**KG**: The Subproject provided support to the Release Team’s Enhancement team in the migration away
from using the spreadsheet to a project board. The collection and tracking of enhancements has
always been a logistical challenge. During my time on the Release Team, I helped with the transition
to an opt-in system of enhancements, whereby the SIG leads "opt-in" KEPs for release tracking. This
helped to enhance communication between authors and SIGs before any significant work was undertaken
on a KEP and removed toil from the Enhancements team. This change used the existing tools to avoid
introducing too many changes at once to the community. Later, the Release Team approached the
Subproject with an idea of leveraging GitHub Project Boards to further improve the collection
process. This was to be a move away from the use of complicated spreadsheets to using repo-native
labels on [k/enhancement](https://github.com/kubernetes/enhancements) issues and project boards.
-->
**KG**：Enhancements 子项目为 Release Team 的 Enhancement 团队提供支持，从使用电子表格迁移到一个项目看板。
增强提案的收集和跟踪一直是后勤支持的一项挑战。在我担任 Release Team 成员期间，我帮助推动了增强的“选择加入”机制，
即 SIG 负责人需要主动“选择加入” KEP 进行发布追踪。
这有助于在对 KEP 实施重大工作之前，加强作者与 SIG 之间的沟通，并减少 Enhancements 团队的重复工作。
这一变更利用了现有工具，以避免一次性向社区引入过多变化。
后来，Release Team 向子项目提出了利用 GitHub 项目看板进一步改进收集流程的想法。
这一举措旨在从使用复杂的电子表格转为使用 [k/enhancement](https://github.com/kubernetes/enhancements)
Issues 和项目看板上的原生仓库标签。

<!--
**FSM: That surely adds an impact on simplifying the workflow...**

**KG**: Removing sources of friction and promoting clear communication is very important to the
Enhancements Subproject.  At the same time, it’s important to give careful consideration to
decisions that impact the community as a whole. We want to make sure that changes are balanced to
give an upside and while not causing any regressions and pain in the rollout. We supported the
Release Team in ideation as well as through the actual migration to the project boards. It was a
great success and exciting to see the team make high impact changes that helped everyone involved in
the KEP process!
-->
**FSM：这无疑简化了工作流程...**

**KG**：减少摩擦来源、促进清晰沟通对 Enhancements 子项目至关重要。同时，我们也需要谨慎考虑影响整个社区的决策。
我们希望确保变更既带来好处，又不会在推广过程中造成回归或额外负担。
我们支持 Release Team 进行头脑风暴，并协助完成迁移到项目看板的工作。
这次变更取得了巨大成功，很高兴看到团队做出了高影响力的改进，使所有参与 KEP 流程的每个人受益！

<!--
## Getting involved

**FSM: For those reading that might be curious and interested in helping, how would you describe the
required skills for participating in the sub-project?**

**KG**: Familiarity with KEPs either via experience or taking time to look through the
kubernetes/enhancements repo is helpful. All are welcome to participate if interested - we can take
it from there.
-->
## 如何参与   {#getting-involved}

**FSM：如果有人想要参与 Enhancements 子项目，你认为需要具备哪些技能？**

**KG**：熟悉 KEP 机制，无论是通过体验，还是花时间阅读
[kubernetes/enhancements](https://github.com/kubernetes/enhancements) 仓库都会有所帮助。
我们欢迎所有感兴趣的人参与，我们可以一步步引导他们。

<!--
**FSM: Excellent! Many thanks for your time and insight -- any final comments you would like to
share with our readers?**

**KG**: The Enhancements process is one of the most important parts of Kubernetes and requires
enormous amounts of coordination and collaboration of people and teams across the project to make it
successful. I’m thankful and inspired by everyone’s continued hard work and dedication to making the
project great. This is truly a wonderful community.
-->
**FSM：太棒了！非常感谢你的时间和分享——最后你有什么想对读者们说的吗？**

**KG**：Enhancements 流程是 Kubernetes 生态中最重要组成部分之一，需要各个团队的密切协作才能成功。
我很感激并敬佩大家持续不断的努力工作和奉献，让这个项目越来越好。这真是一个很棒的社区。

<!--
[^1]: For more information, check the [Production Readiness Review spotlight
    interview](https://kubernetes.io/blog/2023/11/02/sig-architecture-production-readiness-spotlight-2023/)
    in this series.
-->
[^1]: 更多信息参考 [Production Readiness Review 专题采访](/blog/2023/11/02/sig-architecture-production-readiness-spotlight-2023/)。
