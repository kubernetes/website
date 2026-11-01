---
layout: blog
title: "聚焦 SIG Architecture: Conformance"
slug: sig-architecture-conformance-spotlight-2023
date: 2023-10-05
---
<!--
layout: blog
title: "Spotlight on SIG Architecture: Conformance"
slug: sig-architecture-conformance-spotlight-2023
date: 2023-10-05
canonicalUrl: https://www.k8s.dev/blog/2023/10/05/sig-architecture-conformance-spotlight-2023/
-->

<!--
**Author**: Frederico Muñoz (SAS Institute)
-->
**作者**：Frederico Muñoz (SAS Institute)

**译者**：[Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
_This is the first interview of a SIG Architecture Spotlight series
that will cover the different subprojects. We start with the SIG
Architecture: Conformance subproject_

In this [SIG
Architecture](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md)
spotlight, we talked with [Riaan
Kleinhans](https://github.com/Riaankl) (ii.nz), Lead for the
[Conformance
sub-project](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#conformance-definition-1).
-->
**这是 SIG Architecture 焦点访谈系列的首次采访，这一系列访谈将涵盖多个子项目。
我们从 SIG Architecture：Conformance 子项目开始。**

在本次 [SIG Architecture](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md)
访谈中，我们与 [Riaan Kleinhans](https://github.com/Riaankl) (ii.nz) 进行了对话，他是
[Conformance 子项目](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#conformance-definition-1)的负责人。

<!--
## About SIG Architecture and the Conformance subproject

**Frederico (FSM)**: Hello Riaan, and welcome! For starters, tell us a
bit about yourself, your role and how you got involved in Kubernetes.

**Riaan Kleinhans (RK)**: Hi! My name is Riaan Kleinhans and I live in
South Africa. I am the Project manager for the [ii.nz](https://ii.nz) in New
Zealand. When I joined ii the plan was to move to New Zealand in April
2020 and then Covid happened. Fortunately, being a flexible and
dynamic team we were able to make it work remotely and in very
different time zones.
-->
## 关于 SIG Architecture 和 Conformance 子项目

**Frederico (FSM)**：你好 Riaan，欢迎！首先，请介绍一下你自己，你的角色以及你是如何参与 Kubernetes 的。

**Riaan Kleinhans (RK)**：嗨！我叫 Riaan Kleinhans，我住在南非。
我是新西兰 [ii.nz](https://ii.nz) 的项目经理。在我加入 ii 时，本来计划在 2020 年 4 月搬到新西兰，
然后新冠疫情爆发了。幸运的是，作为一个灵活和富有活力的团队，我们能够在各个不同的时区以远程方式协作。

<!--
The ii team have been tasked with managing the Kubernetes Conformance
testing technical debt and writing tests to clear the technical
debt. I stepped into the role of project manager to be the link
between monitoring, test writing and the community. Through that work
I had the privilege of meeting [Dan Kohn](https://github.com/dankohn)
in those first months, his enthusiasm about the work we were doing was
a great inspiration.
-->
ii 团队负责管理 Kubernetes Conformance 测试的技术债务，并编写测试内容来消除这些技术债务。
我担任项目经理的角色，成为监控、测试内容编写和社区之间的桥梁。通过这项工作，我有幸在最初的几个月里结识了
[Dan Kohn](https://github.com/dankohn)，他对我们的工作充满热情，给了我很大的启发。

<!--
**FSM**: Thank you - so, your involvement in SIG Architecture started
because of the conformance work?

**RK**: SIG Architecture is the home for the Kubernetes Conformance
subproject. Initially, most of my interactions were directly with SIG
Architecture through the Conformance sub-project. However, as we
began organizing the work by SIG, we started engaging directly with
each individual SIG. These engagements with the SIGs that own the
untested APIs have helped us accelerate our work.
-->
**FSM**：谢谢！所以，你参与 SIG Architecture 是因为合规性的工作？

**RK**：SIG Architecture 负责管理 Kubernetes Conformance 子项目。
最初，我大部分时间直接与 SIG Architecture 交流 Conformance 子项目。
然而，随着我们开始按 SIG 来组织工作任务，我们开始直接与各个 SIG 进行协作。
与拥有未被测试的 API 的这些 SIG 的协作帮助我们加快了工作进度。

<!--
**FSM**: How would you describe the main goals and
areas of intervention of the Conformance sub-project?

**RM**: The Kubernetes Conformance sub-project focuses on guaranteeing
compatibility and adherence to the Kubernetes specification by
developing and maintaining a comprehensive conformance test suite. Its
main goals include assuring compatibility across different Kubernetes
implementations, verifying adherence to the API specification,
supporting the ecosystem by encouraging conformance certification, and
fostering collaboration within the Kubernetes community. By providing
standardised tests and promoting consistent behaviour and
functionality, the Conformance subproject ensures a reliable and
compatible Kubernetes ecosystem for developers and users alike.
-->
**FSM**：你如何描述 Conformance 子项目的主要目标和介入的领域？

**RM**: Kubernetes Conformance 子项目专注于通过开发和维护全面的合规性测试套件来确保兼容性并遵守
Kubernetes 规范。其主要目标包括确保不同 Kubernetes 实现之间的兼容性，验证 API 规范的遵守情况，
通过鼓励合规性认证来支持生态体系，并促进 Kubernetes 社区内的合作。
通过提供标准化的测试并促进一致的行为和功能，
Conformance 子项目为开发人员和用户提供了一个可靠且兼容的 Kubernetes 生态体系。

<!--
## More on the Conformance Test Suite

**FSM**: A part of providing those standardised tests is, I believe,
the [Conformance Test
Suite](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/conformance-tests.md). Could
you explain what it is and its importance?

**RK**: The Kubernetes Conformance Test Suite checks if Kubernetes
distributions meet the project's specifications, ensuring
compatibility across different implementations. It covers various
features like APIs, networking, storage, scheduling, and
security. Passing the tests confirms proper implementation and
promotes a consistent and portable container orchestration platform.
-->
## 关于 Conformance Test Suite 的更多内容

**FSM**：我认为，提供这些标准化测试的一部分工作在于
[Conformance Test Suite](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/conformance-tests.md)。
你能解释一下它是什么以及其重要性吗？

**RK**：Kubernetes Conformance Test Suite 检查 Kubernetes 发行版是否符合项目的规范，
确保在不同的实现之间的兼容性。它涵盖了诸如 API、联网、存储、调度和安全等各个特性。
能够通过测试，则表示实现合理，便于推动构建一致且可移植的容器编排平台。

<!--
**FSM**: Right, the tests are important in the way they define the
minimum features that any Kubernetes cluster must support. Could you
describe the process around determining which features are considered
for inclusion? Is there any tension between a more minimal approach,
and proposals from the other SIGs?

**RK**: The requirements for each endpoint that undergoes conformance
testing are clearly defined by SIG Architecture. Only API endpoints
that are generally available and non-optional features are eligible
for conformance. Over the years, there have been several discussions
regarding conformance profiles, exploring the possibility of including
optional endpoints like RBAC, which are widely used by most end users,
in specific profiles. However, this aspect is still a work in
progress.
-->
**FSM**：是的，这些测试很重要，因为它们定义了所有 Kubernetes 集群必须支持的最小特性集合。
你能描述一下决定将哪些特性包含在内的过程吗？在最小特性集的思路与其他 SIG 提案之间是否有所冲突？

**RK**：SIG Architecture 针对经受合规性测试的每个端点的要求，都有明确的定义。
API 端点只有正式发布且不是可选的特性，才会被（进一步）考虑是否合规。
多年来，关于合规性配置文件已经进行了若干讨论，
探讨将被大多数终端用户广泛使用的可选端点（例如 RBAC）纳入特定配置文件中的可能性。
然而，这一方面仍在不断改进中。

<!--
Endpoints that do not meet the conformance criteria are listed in
[ineligible_endpoints.yaml](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/testdata/ineligible_endpoints.yaml),
which is publicly accessible in the Kubernetes repo. This file can be
updated to add or remove endpoints as their status or requirements
change. These ineligible endpoints are also visible on
[APISnoop](https://apisnoop.cncf.io/).

Ensuring transparency and incorporating community input regarding the
eligibility or ineligibility of endpoints is of utmost importance to
SIG Architecture.
-->
不满足合规性标准的端点被列在
[ineligible_endpoints.yaml](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/testdata/ineligible_endpoints.yaml) 中，
该文件放在 Kubernetes 代码仓库中，是被公开访问的。
随着这些端点的状态或要求发生变化，此文件可能会被更新以添加或删除端点。
不合格的端点也可以在 [APISnoop](https://apisnoop.cncf.io/) 上看到。

对于 SIG Architecture 来说，确保透明度并纳入社区意见以确定端点的合格或不合格状态是至关重要的。

<!--
**FSM**: Writing tests for new features is something generally
requires some kind of enforcement. How do you see the evolution of
this in Kubernetes? Was there a specific effort to improve the process
in a way that required tests would be a first-class citizen, or was
that never an issue?

**RK**: When discussions surrounding the Kubernetes conformance
programme began in 2018, only approximately 11% of endpoints were
covered by tests. At that time, the CNCF's governing board requested
that if funding were to be provided for the work to cover missing
conformance tests, the Kubernetes Community should adopt a policy of
not allowing new features to be added unless they include conformance
tests for their stable APIs.
-->
**FSM**：为新特性编写测试内容通常需要某种强制执行方式。
你如何看待 Kubernetes 中这方面的演变？是否有人在努力改进这个流程，
使得必须具备测试成为头等要务，或许这从来都不是一个问题？

**RK**：在 2018 年开始围绕 Kubernetes 合规性计划进行讨论时，只有大约 11% 的端点被测试所覆盖。
那时，CNCF 的管理委员会提出一个要求，如果要提供资金覆盖缺失的合规性测试，Kubernetes 社区应采取一个策略，
即如果新特性没有包含稳定 API 的合规性测试，则不允许添加此特性。

<!--
SIG Architecture is responsible for stewarding this requirement, and
[APISnoop](https://apisnoop.cncf.io/) has proven to be an invaluable
tool in this regard. Through automation, APISnoop generates a pull
request every weekend to highlight any discrepancies in Conformance
coverage. If any endpoints are promoted to General Availability
without a conformance test, it will be promptly identified. This
approach helps prevent the accumulation of new technical debt.

Additionally, there are plans in the near future to create a release
informing job, which will add an additional layer to prevent any new
technical debt.
-->
SIG Architecture 负责监督这一要求，[APISnoop](https://apisnoop.cncf.io/)
在此方面被证明是一个非常有价值的工具。通过自动化流程，APISnoop 在每个周末生成一个 PR，
以突出 Conformance 覆盖范围的变化。如果有端点在没有进行合规性测试的情况下进阶至正式发布，
将会被迅速识别发现。这种方法有助于防止积累新的技术债务。

此外，我们计划在不久的将来创建一个发布通知任务，作用是添加额外一层防护，以防止产生新的技术债务。

<!--
**FSM**: I see, tooling and automation play an important role
there. What are, in your opinion, the areas that, conformance-wise,
still require some work to be done? In other words, what are the
current priority areas marked for improvement?

**RK**: We have reached the “100% Conformance Tested” milestone in
release 1.27!
-->
**FSM**：我明白了，工具化和自动化在其中起着重要的作用。
在你看来，就合规性而言，还有哪些领域需要做一些工作？
换句话说，目前标记为优先改进的领域有哪些？

**RK**：在 1.27 版本中，我们已完成了 “100% 合规性测试” 的里程碑！

<!--
At that point, the community took another look at all the endpoints
that were listed as ineligible for conformance. The list was populated
through community input over several years.  Several endpoints
that were previously deemed ineligible for conformance have been
identified and relocated to a new dedicated list, which is currently
receiving focused attention for conformance test development. Again,
that list can also be checked on apisnoop.cncf.io.
-->
当时，社区重新审视了所有被列为不合规的端点。这个列表是收集多年的社区意见后填充的。
之前被认为不合规的几个端点已被挑选出来并迁移到一个新的专用列表中，
该列表中包含目前合规性测试开发的焦点。同样，可以在 apisnoop.cncf.io 上查阅此列表。

<!--
To ensure the avoidance of new technical debt in the conformance
project, there are upcoming plans to establish a release informing job
as an additional preventive measure.

While APISnoop is currently hosted on CNCF infrastructure, the project
has been generously donated to the Kubernetes community. Consequently,
it will be transferred to community-owned infrastructure before the
end of 2023.
-->
为了确保在合规性项目中避免产生新的技术债务，我们计划建立一个发布通知任务作为额外的预防措施。

虽然 APISnoop 目前被托管在 CNCF 基础设施上，但此项目已慷慨地捐赠给了 Kubernetes 社区。
因此，它将在 2023 年底之前转移到社区自治的基础设施上。

<!--
**FSM**: That's great news! For anyone wanting to help, what are the
venues for collaboration that you would highlight? Do all of them
require solid knowledge of Kubernetes as a whole, or are there ways
someone newer to the project can contribute?

**RK**: Contributing to conformance testing is akin to the task of
"washing the dishes" – it may not be highly visible, but it remains
incredibly important. It necessitates a strong understanding of
Kubernetes, particularly in the areas where the endpoints need to be
tested. This is why working with each SIG that owns the API endpoint
being tested is so important.
-->
**FSM**：这是个好消息！对于想要提供帮助的人们，你能否重点说明一下协作的价值所在？
参与贡献是否需要对 Kubernetes 有很扎实的知识，或否有办法让一些新人也能为此项目做出贡献？

**RK**：参与合规性测试就像 "洗碗" 一样，它可能不太显眼，但仍然非常重要。
这需要对 Kubernetes 有深入的理解，特别是在需要对端点进行测试的领域。
这就是为什么与负责测试 API 端点的每个 SIG 进行协作会如此重要。

<!--
As part of our commitment to making test writing accessible to
everyone, the ii team is currently engaged in the development of a
"click and deploy" solution. This solution aims to enable anyone to
swiftly create a working environment on real hardware within
minutes. We will share updates regarding this development as soon as
we are ready.
-->
我们的承诺是让所有人都能参与测试内容编写，作为这一承诺的一部分，
ii 团队目前正在开发一个 “点击即部署（click and deploy）” 的解决方案。
此解决方案旨在使所有人都能在几分钟内快速创建一个在真实硬件上工作的环境。
我们将在准备好后分享有关此项开发的更新。

<!--
**FSM**: That's very helpful, thank you. Any final comments you would
like to share with our readers?

**RK**: Conformance testing is a collaborative community endeavour that
involves extensive cooperation among SIGs. SIG Architecture has
spearheaded the initiative and provided guidance. However, the
progress of the work relies heavily on the support of all SIGs in
reviewing, enhancing, and endorsing the tests.
-->
**FSM**：那会非常有帮助，谢谢。最后你还想与我们的读者分享些什么见解吗？

**RK**：合规性测试是一个协作性的社区工作，涉及各个 SIG 之间的广泛合作。
SIG Architecture 在推动倡议并提供指导方面起到了领头作用。然而，
工作的进展在很大程度上依赖于所有 SIG 在审查、增强和认可测试方面的支持。

<!--
I would like to extend my sincere appreciation to the ii team for
their unwavering commitment to resolving technical debt over the
years. In particular, [Hippie Hacker](https://github.com/hh)'s
guidance and stewardship of the vision has been
invaluable. Additionally, I want to give special recognition to
Stephen Heywood for shouldering the majority of the test writing
workload in recent releases, as well as to Zach Mandeville for his
contributions to APISnoop.
-->
我要衷心感谢 ii 团队多年来对解决技术债务的坚定承诺。
特别要感谢 [Hippie Hacker](https://github.com/hh) 的指导和对愿景的引领作用，这是非常宝贵的。
此外，我还要特别表扬 Stephen Heywood 在最近几个版本中承担了大部分测试内容编写工作而做出的贡献，
还有 Zach Mandeville 对 APISnoop 也做了很好的贡献。

<!--
**FSM**: Many thanks for your availability and insightful comments,
I've personally learned quite a bit with it and I'm sure our readers
will as well.
-->
**FSM**：非常感谢你参加本次访谈并分享你的深刻见解，我本人从中获益良多，我相信读者们也会同样受益。
