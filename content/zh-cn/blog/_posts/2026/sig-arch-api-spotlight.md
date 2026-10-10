---
title: "SIG Architecture 聚焦：API 治理"
date: 2026-02-12
slug: sig-architecture-api-spotlight
author: >
  [Frederico Muñoz](https://github.com/fsmunoz) (SAS Institute)
translator: >
  [Paco Xu](https://github.com/pacoxu)(DaoCloud)
---

<!--
layout: blog
title: "Spotlight on SIG Architecture: API Governance"
slug: sig-architecture-api-spotlight
canonicalUrl: https://www.kubernetes.dev/blog/2026/02/12/sig-architecture-api
date: 2026-02-12
draft: false
author: >
  [Frederico Muñoz](https://github.com/fsmunoz) (SAS Institute)
-->

<!--
_This is the fifth interview of a SIG Architecture Spotlight series that covers the different
subprojects, and we will be covering [SIG Architecture: API
Governance](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#architecture-and-api-governance-1)._
-->
**这是 SIG Architecture 聚焦系列的第五篇访谈，将介绍不同的子项目。本篇聚焦
[SIG Architecture：API 治理](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#architecture-and-api-governance-1)。**

<!--
In this SIG Architecture spotlight we talked with [Jordan Liggitt](https://github.com/liggitt), lead
of the API Governance sub-project.
-->
在这篇 SIG Architecture 聚焦访谈中，我们采访了 API 治理子项目负责人
[Jordan Liggitt](https://github.com/liggitt)。

<!--
## Introduction
-->
## 介绍

<!--
**FM: Hello Jordan, thank you for your availability. Tell us a bit about yourself, your role and how
you got involved in Kubernetes.**
-->
**FM：Jordan 你好，感谢你接受采访。请先简单介绍一下你自己、你的职责，以及你是如何参与 Kubernetes 的。**

<!--
**JL**: My name is Jordan Liggitt. I'm a Christian, husband, father of four, software engineer at
[Google](https://about.google/) by day, and [amateur musician](https://www.youtube.com/watch?v=UDdr-VIWQwo) by stealth. I was born in Texas (and still
like to claim it as my point of origin), but I've lived in North Carolina for most of my life.
-->
**JL**：我叫 Jordan Liggitt。我是一名基督徒、丈夫、四个孩子的父亲，白天在
[Google](https://about.google/) 做软件工程师，私下还是个[业余音乐人](https://www.youtube.com/watch?v=UDdr-VIWQwo)。
我出生在德克萨斯州（现在也仍然喜欢把那里称作自己的起点），但我人生大部分时间都生活在北卡罗来纳州。

<!--
I've been working on Kubernetes since 2014. At that time, I was working on authentication and
authorization at Red Hat, and my very first pull request to Kubernetes attempted to [add an OAuth
server](https://github.com/kubernetes/kubernetes/pull/2328) to the Kubernetes API server. It never
exited work-in-progress status. I ended up going with a different approach that layered on top of
the core Kubernetes API server in a different project (spoiler alert: this is foreshadowing), and I
closed it without merging six months later.
-->
我从 2014 年开始参与 Kubernetes。当时我在 Red Hat 负责认证和授权，
提交给 Kubernetes 的第一个 PR 是尝试给 Kubernetes API 服务器
[增加一个 OAuth 服务器](https://github.com/kubernetes/kubernetes/pull/2328)。
那个 PR 最终一直停留在 WIP 状态，没有合并。
后来我换了一种方式，在另一个项目里以“叠加在核心 Kubernetes API 服务器之上”的思路来实现（这也可以看作后文的一个伏笔），
六个月后我关闭了那个 PR。

<!--
Undeterred by that start, I stayed involved, helped build Kubernetes authentication and
authorization capabilities, and got involved in the definition and evolution of the core Kubernetes
APIs from early beta APIs, like `v1beta3` to `v1`. I got tagged as an API reviewer in 2016 based on
those contributions, and was added as an API approver in 2017.
-->
尽管开局如此，我还是持续参与了进来，帮助构建 Kubernetes 的认证与授权能力，
并从早期的 Beta API（例如 `v1beta3`）到 `v1` 的过程中参与核心 Kubernetes API 的定义与演进。
基于这些贡献，我在 2016 年被标记为 API reviewer，并在 2017 年成为 API approver。

<!--
Today, I help lead the API Governance and code organization subprojects for SIG Architecture, and I
am a tech lead for SIG Auth.
-->
现在，我在 SIG Architecture 里共同负责 API 治理和代码组织两个子项目，同时也是 SIG Auth 的技术负责人。

<!--
**FM: And when did you get specifically involved in the API Governance project?**
-->
**FM：那你是什么时候开始具体参与 API 治理项目的？**

<!--
**JL**: Around 2019.
-->
**JL**：大约在 2019 年。

<!--
## Goals and scope of API Governance
-->
## API 治理的目标与范围

<!--
**FM:  How would you describe the main goals and areas of intervention of the subproject?**
-->
**FM：你会如何描述这个子项目的主要目标，以及它介入的领域？**

<!--
The surface area includes all the various APIs Kubernetes has, and there are APIs that people do not
always realize are APIs: command-line flags, configuration files, how binaries are run, how they
talk to back-end components like the container runtime, and how they persist data. People often
think of "the API" as only the [REST API](https://kubernetes.io/docs/reference/using-api/)... that
is the biggest and most obvious one, and the one with the largest audience, but all of these other
surfaces are also APIs. Their audiences are narrower, so there is more flexibility there, but they
still require consideration.
-->
这个领域覆盖 Kubernetes 的各种 API，而且有一些“大家未必意识到它是 API”的接口：
命令行参数、配置文件、二进制如何运行、它们如何与容器运行时这类后端组件通信，以及如何持久化数据。
很多人提到“API”时只想到 [REST API](https://kubernetes.io/docs/reference/using-api/)。
它当然是最大、最显眼、受众最多的一类，但这些其他表面同样也是 API。
它们的受众更窄，因此灵活性更高一些，但依然需要认真对待。

<!--
The goals are to be stable while still enabling innovation. Stability is easy if you never change
anything, but that contradicts the goal of evolution and growth. So we balance "be stable" with
"allow change".
-->
我们的目标是在保持稳定的同时继续推动创新。
如果你什么都不改，稳定当然最容易做到，但那也和演进、增长的目标相冲突。
所以我们要在“保持稳定”和“允许变化”之间取得平衡。

<!--
**FM: Speaking of changes, in terms of ensuring consistency and quality (which is clearly one of the
reasons this project exists), what are the specific quality gates in the lifecycle of a Kubernetes
change? Does API Governance get involved during the release cycle, prior to it through guidelines,
or somewhere in between? At what points do you ensure the intended role is fulfilled?**
-->
**FM：说到变化。为了确保一致性和质量（这显然也是这个项目存在的原因之一），
Kubernetes 变更生命周期里有哪些具体的质量门禁？
API 治理是在发布周期中介入，还是通过前置指南介入，或者是在两者之间？
你们在哪些时间点来确保这个职责真正落地？**

<!--
**JL**: We have [guidelines and
conventions](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md),
both for APIs in general and for how to change an API. These are living documents that we update as
we encounter new scenarios. They are long and dense, so we also support them with involvement at
either the design stage or the implementation stage.
-->
**JL**：我们有[指南和约定](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md)，
既包含 API 通用规范，也包含 API 变更规范。
这些都是“活文档”，会随着新场景不断更新。
它们内容很多、也比较密集，所以我们还会在设计阶段或实现阶段实际参与来配合。

<!--
Sometimes, due to bandwidth constraints, teams move ahead with design work without feedback from [API Review](https://github.com/kubernetes/community/blob/master/sig-architecture/api-review-process.md). That's fine, but it means that when implementation begins, the API review will happen then,
and there may be substantial feedback. So we get involved when a new API is created or an existing
API is changed, either at design or implementation.
-->
有时候受限于带宽，团队会在没有得到
[API Review](https://github.com/kubernetes/community/blob/master/sig-architecture/api-review-process.md)
反馈的情况下先推进设计。这没问题，但这也意味着实现开始时才会进行 API 评审，
届时可能会出现比较大范围的反馈。
因此，无论是创建新 API，还是修改既有 API，我们都会在设计阶段或实现阶段介入。

<!--
**FM: Is this during the Kubernetes Enhancement Proposal (KEP) process? Since KEPs are mandatory for
enhancements, I assume part of the work intersects with API Governance?**
-->
**FM：这是发生在 Kubernetes Enhancement Proposal（KEP）流程里吗？
既然增强功能必须走 KEP，我理解其中一部分会和 API 治理交叉。**

<!--
**JL**: It can. [KEPs](https://github.com/kubernetes/enhancements/blob/master/keps/README.md) vary
in how detailed they are. Some include literal API definitions. When they do, we can perform an API
review at the design stage. Then implementation becomes a matter of checking fidelity to the design.
-->
**JL**：[KEP](https://github.com/kubernetes/enhancements/blob/master/keps/README.md) 的详细程度差异很大。
有些 KEP 会直接给出 API 定义。遇到这种情况，我们就可以在设计阶段做 API 评审，
随后实现阶段主要就是核对是否忠实于设计。

<!--
Getting involved early is ideal. But some KEPs are conceptual and leave details to the
implementation. That's not wrong; it just means the implementation will be more exploratory. Then
API Review gets involved later, possibly recommending structural changes.
-->
尽早介入是理想状态。但有些 KEP 更偏概念，把细节留给实现阶段。
这并不错误，只是意味着实现会更偏探索式。这样 API Review 的介入就会更晚，
并且可能会建议结构性调整。

<!--
There's a trade-off regardless: detailed design upfront versus iterative discovery during
implementation. People and teams work differently, and we're flexible and happy to consult early or
at implementation time.
-->
无论哪种方式都有取舍：前期做更详细的设计，还是在实现中迭代发现。
不同人和团队有不同工作方式，我们保持灵活，也乐于在前期或实现阶段提供咨询。

<!--
**FM: This reminds me of what Fred Brooks wrote in "The Mythical Man-Month" about conceptual
integrity being central to product quality... No matter how you structure the process, there must be
a point where someone looks at what is coming and ensures conceptual integrity. Kubernetes uses APIs
everywhere - externally and internally - so API Governance is critical to maintaining that
integrity. How is this captured?**
-->
**FM：这让我想到 Fred Brooks 在《人月神话》中提到的观点：
概念完整性是产品质量的核心。无论流程怎么组织，总得有一个环节去审视即将落地的内容，
确保概念完整性。Kubernetes 到处都在使用 API（对外和对内都有），
所以 API 治理对维护这种完整性至关重要。这个是如何被固化下来的？**

<!--
**JL**: Yes, the conventions document captures patterns we've learned over time: what to do in
various situations. We also have automated linters and checks to ensure correctness around patterns
like spec/status semantics. These automated tools help catch issues even when humans miss them.
-->
**JL**：是的，约定文档沉淀了我们长期积累的模式：不同场景下该怎么做。
我们还有自动化 lint 和检查项，来保障例如 spec/status 语义这类模式的正确性。
这些自动化工具能在人工遗漏时帮助我们发现问题。

<!--
As new scenarios arise - and they do constantly - we think through how to approach them and fold
the results back into our documentation and tools. Sometimes it takes a few attempts before we
settle on an approach that works well.
-->
当新场景出现时（而且一直在出现），我们会思考应对方式，并把结论回灌到文档和工具里。
有时需要尝试几轮，才能收敛到一个真正好用的方案。

<!--
**FM: Exactly. Each new interaction improves the guidelines.**
-->
**FM：确实。每次新的互动都会让指南更好。**

<!--
**JL**: Right. And sometimes the first approach turns out to be wrong. It may take two or three
iterations before we land on something robust.
-->
**JL**：没错。有时候第一种做法最后会被证明不够好，
可能要经历两三次迭代才能得到稳健的结果。

<!--
## The impact of Custom Resource Definitions
-->
## Custom Resource Definition 带来的影响

<!--
**FM: Is there any particular change, episode, or domain that stands out as especially noteworthy,
complex, or interesting in your experience?**
-->
**FM：在你的经验里，有没有某个变化、事件或领域特别值得一提，或者特别复杂、特别有意思？**

<!--
**JL**: The watershed moment was [Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
Prior to that, every API was handcrafted by us and fully reviewed. There were inconsistencies, but
we understood and controlled every type and field.
-->
**JL**：真正的分水岭是
[Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。
在那之前，每个 API 都是我们手工定义并完整评审的。
虽然也有不一致之处，但每个类型和字段我们都清楚、也都能控制。

<!--
When Custom Resources arrived, anyone could define anything. The first version did not even require
a schema. That made it extremely powerful - it enabled change immediately - but it left us playing
catch-up on stability and consistency.
-->
Custom Resources 出现之后，任何人都可以定义任何内容。
第一个版本甚至不要求 schema。
这让它功能极其强大，立即释放了创新空间，但也让我们在稳定性和一致性方面开始追赶。

<!--
When Custom Resources graduated to General Availability (GA), schemas became required, but escape
hatches still existed for backward compatibility. Since then, we've been working on giving CRD
authors validation capabilities comparable to built-ins. Built-in validation rules for CRDs have
only just reached GA in the last few releases.
-->
当 Custom Resources 晋升到 GA 后，schema 成为必需，
但出于向后兼容仍保留了一些“逃生口”。
从那时起，我们一直在努力让 CRD 作者获得与内置资源接近的校验能力。
而 CRD 的内置校验规则也只是最近几个版本才达到 GA。

<!--
So CRDs opened the "anything is possible" era. Built-in validation rules are the second major
milestone: bringing consistency back.
-->
所以，CRD 开启了“几乎任何内容都可以定义”的阶段。
而内置校验规则是第二个重要里程碑：把一致性重新带回来。

<!--
The three major themes have been defining schemas, validating data, and handling pre-existing
invalid data. With ratcheting validation (allowing data to improve without breaking existing
objects), we can now guide CRD authors toward conventions without breaking the world.
-->
这一路上的三个核心主题是：定义 schema、校验数据，以及处理既有的无效数据。
借助渐进式收紧校验（在不破坏现有对象的前提下允许数据逐步改进），
我们现在可以在不破坏既有对象的情况下，引导 CRD 作者遵循约定。

<!--
## API Governance in context
-->
## API 治理在整体中的位置

<!--
**FM: How does API Governance relate to SIG Architecture and API Machinery?**
-->
**FM：API 治理和 SIG Architecture、API Machinery 分别是什么关系？**

<!--
**JL**: [API Machinery](https://github.com/kubernetes/apimachinery) provides the actual code and
tools that people build APIs on. They don't review APIs for storage, networking, scheduling, etc.
-->
**JL**：[API Machinery](https://github.com/kubernetes/apimachinery) 提供的是构建 API 的实际代码和工具。
他们不会去评审存储、网络、调度等领域的 API 本身。

<!--
SIG Architecture sets the overall system direction and works with API Machinery to ensure the system
supports that direction. API Governance works with other SIGs building on that foundation to define
conventions and patterns, ensuring consistent use of what API Machinery provides.
-->
SIG Architecture 负责系统整体方向，并与 API Machinery 协作，
确保系统能力能支撑这个方向。
API 治理则和其他基于这套基础设施构建能力的 SIG 协作，定义约定与模式，
确保大家以一致方式使用 API Machinery 提供的能力。

<!--
**FM: Thank you. That clarifies the flow. Going back to [release cycles](https://kubernetes.io/releases/release/): do release phases - enhancements freeze, code
freeze - change your workload? Or is API Governance mostly continuous?**
-->
**FM：谢谢，这样流程就很清晰了。再回到[发布周期](https://kubernetes.io/releases/release/)：
增强冻结、代码冻结这些阶段会改变你们的工作负载吗？还是说 API 治理更多是持续性的工作？**

<!--
**JL**: We get involved in two places: design and implementation. Design involvement increases
before enhancements freeze; implementation involvement increases before code freeze. However, many
efforts span multiple releases, so there is always some design and implementation happening, even
for work targeting future releases. Between those intense periods, we often have time to work on
long-term design work.
-->
**JL**：我们主要在两个地方介入：设计和实现。
增强冻结前，设计相关介入会增加；代码冻结前，实现相关介入会增加。
不过很多工作会跨多个发布周期，所以即便是在相对平缓的阶段，
也始终会有一些面向未来版本的设计与实现在推进。
在这些高强度时段之间，我们通常会有时间投入长期设计工作。

<!--
An anti-pattern we see is teams thinking about a large feature for months and then presenting it
three weeks before enhancements freeze, saying, "Here is the design, please review." For big changes
with API impact, it's much better to involve API Governance early.
-->
我们看到的一个反模式是：团队构思一个大特性几个月，
然后在增强冻结前三周才拿出来说“这是设计，请评审”。
对这类有 API 影响的大变更，更好的做法是尽早让 API 治理参与进来。

<!--
And there are good times in the cycle for this - between freezes - when people have bandwidth.
That's when long-term review work fits best.
-->
而且发布周期里确实有适合做这件事的窗口期，
比如两个冻结阶段之间，大家带宽相对更充足。
这是做长期评审工作的最佳时机。

<!--
## Getting involved
-->
## 如何参与

<!--
**FM: Clearly. Now, regarding team dynamics and new contributors: how can someone get involved in
API Governance? What should they focus on?**
-->
**FM：很明确。那从团队协作和新贡献者角度看，大家可以如何参与 API 治理？
应该从什么入手？**

<!--
**JL**: It's usually best to follow a specific change rather than trying to learn everything at
once. Pick a small API change, perhaps one someone else is making or one you want to make, and
observe the full process: design, implementation, review.
-->
**JL**：通常最好的办法是跟一个具体变更，而不是试图一次性学完所有东西。
挑一个小 API 变更，可以是别人正在做的，也可以是你自己想做的，
然后完整观察它的全流程：设计、实现、评审。

<!--
High-bandwidth review - live discussion over video - is often very effective. If you're making or
following a change, ask whether there's a time to go over the design or PR together. Observing those
discussions is extremely instructive.
-->
高带宽评审（例如视频实时讨论）通常非常有效。
如果你正在做或跟踪某个变更，可以问问是否能约个时间一起过设计或 PR。
旁听这类讨论会非常有帮助。

<!--
Start with a small change. Then move to a bigger one. Then maybe a new API. That builds
understanding of conventions as they are applied in practice.
-->
先从小变更开始，再做更大的，再到一个全新的 API。
这样你会逐步理解这些约定在实践中是如何应用的。

<!--
**FM: Excellent. Any final comments, or anything we missed?**
-->
**FM：非常好。最后还有什么想补充的吗？**

<!--
**JL**: Yes... the reason we care so much about compatibility and stability is for our users. It's
easy for contributors to see those requirements as painful obstacles preventing cleanup or requiring
tedious work... but users integrated with our system, and we made a promise to them: we want them to
trust that we won't break that contract. So even when it requires more work, moves slower, or
involves duplication, we choose stability.
-->
**JL**：有。我们之所以如此重视兼容性和稳定性，是为了用户。
对贡献者来说，这些要求有时像痛苦的阻碍，妨碍重构或带来繁琐工作；
但用户已经把自己的系统和我们集成在一起，而我们对他们有承诺：
我们希望他们相信，我们不会打破这份契约。
所以即使这意味着更多工作、更慢节奏，甚至需要重复实现，我们依然选择稳定性。

<!--
We are not trying to be obstructive; we are trying to make life good for users.
-->
我们并不是想设置障碍，而是希望让用户有更好的使用体验。

<!--
A lot of our questions focus on the future: you want to do something now... how will you evolve it
later without breaking it? We assume we will know more in the future, and we want the design to
leave room for that.
-->
我们很多问题都在关注未来：你现在想做的这个东西，
以后如何演进而不破坏兼容性？
我们假设未来会知道得更多，因此希望设计能为未来变化留出空间。

<!--
We also assume we will make mistakes. The question then is: how do we leave ourselves avenues to
improve while keeping compatibility promises?
-->
我们也假设自己会犯错。那关键问题就是：如何给自己留下改进通道，
同时继续履行兼容性承诺？

<!--
**FM: Exactly. Jordan, thank you, I think we've covered everything. This has been an insightful view
into the API Governance project and its role in the wider Kubernetes project.**
-->
**FM：完全同意。Jordan，谢谢你，我想我们已经覆盖了所有关键点。
这次访谈让大家对 API 治理项目及其在 Kubernetes 全局中的作用有了非常清晰的认识。**

<!--
**JL**: Thank you.
-->
**JL**：谢谢。
