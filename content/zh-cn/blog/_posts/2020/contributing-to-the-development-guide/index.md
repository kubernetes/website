---
title: "为开发指南做贡献"
linkTitle: "为开发指南做贡献"
Author: Erik L. Arneson
Description: "一位新的贡献者描述了编写和提交对 Kubernetes 开发指南的修改的经验。"
date: 2020-10-01
canonicalUrl: https://www.kubernetes.dev/blog/2020/09/28/contributing-to-the-development-guide/
resources:
- src: "jorge-castro-code-of-conduct.jpg"
  title: "Jorge Castro 正在 SIG ContribEx 的周例会上宣布 Kubernetes 的行为准则。"
---

<!-- 
---
title: "Contributing to the Development Guide"
linkTitle: "Contributing to the Development Guide"
Author: Erik L. Arneson
Description: "A new contributor describes the experience of writing and submitting changes to the Kubernetes Development Guide."
date: 2020-10-01
canonicalUrl: https://www.kubernetes.dev/blog/2020/09/28/contributing-to-the-development-guide/
resources:
- src: "jorge-castro-code-of-conduct.jpg"
  title: "Jorge Castro announcing the Kubernetes Code of Conduct during a weekly SIG ContribEx meeting."
--- 
-->


<!-- 
When most people think of contributing to an open source project, I suspect they probably think of
contributing code changes, new features, and bug fixes. As a software engineer and a long-time open
source user and contributor, that's certainly what I thought. Although I have written a good quantity
of documentation in different workflows, the massive size of the Kubernetes community was a new kind 
of "client." I just didn't know what to expect when Google asked my compatriots and me at
[Lion's Way](https://lionswaycontent.com/) to make much-needed updates to the Kubernetes Development Guide.

*This article originally appeared on the [Kubernetes Contributor Community blog](https://www.kubernetes.dev/blog/2020/09/28/contributing-to-the-development-guide/).*
-->

当大多数人想到为一个开源项目做贡献时，我猜想他们可能想到的是贡献代码修改、新功能和错误修复。作为一个软件工程师和一个长期的开源用户和贡献者，这也正是我的想法。
虽然我已经在不同的工作流中写了不少文档，但规模庞大的 Kubernetes 社区是一种新型 "客户"。我只是不知道当 Google 要求我和 [Lion's Way](https://lionswaycontent.com/) 的同胞们对 Kubernetes 开发指南进行必要更新时会发生什么。

*本文最初出现在 [Kubernetes Contributor Community blog](https://www.kubernetes.dev/blog/2020/09/28/contributing-to-the-development-guide/)。*

<!--
 ## The Delights of Working With a Community

As professional writers, we are used to being hired to write very specific pieces. We specialize in
marketing, training, and documentation for technical services and products, which can range anywhere from relatively fluffy marketing emails to deeply technical white papers targeted at IT and developers. With 
this kind of professional service, every deliverable tends to have a measurable return on investment. 
I knew this metric wouldn't be present when working on open source documentation, but I couldn't
predict how it would change my relationship with the project. 
-->

## 与社区合作的乐趣

作为专业的写手，我们习惯了受雇于他人去书写非常具体的项目。我们专注于技术服务，产品营销，技术培训以及文档编制，范围从相对宽松的营销邮件到针对 IT 和开发人员的深层技术白皮书。
在这种专业服务下，每一个可交付的项目往往都有可衡量的投资回报。我知道在从事开源文档工作时不会出现这个指标，但我不确定它将如何改变我与项目的关系。

<!--
 One of the primary traits of the relationship between our writing and our traditional clients is that we
always have one or two primary points of contact inside a company. These contacts are responsible
for reviewing our writing and making sure it matches the voice of the company and targets the
audience they're looking for. It can be stressful -- which is why I'm so glad that my writing
partner, eagle-eyed reviewer, and bloodthirsty editor [Joel](https://twitter.com/JoelByronBarker)
handles most of the client contact. 
-->

我们的写作和传统客户之间的关系有一个主要的特点，就是我们在一个公司里面总是有一两个主要的对接人。他们负责审查我们的文稿，并确保文稿内容符合公司的声明且对标于他们正在寻找的受众。
这随之而来的压力--正好解释了为什么我很高兴我的写作伙伴、鹰眼审稿人同时也是嗜血编辑的 [Joel](https://twitter.com/JoelByronBarker) 处理了大部分的客户联系。


<!--
 I was surprised and delighted that all of the stress of client contact went out the window when
working with the Kubernetes community. 
-->

在与 Kubernetes 社区合作时，所有与客户接触的压力都消失了，这让我感到惊讶和高兴。

<!--
 "How delicate do I have to be? What if I screw up? What if I make a developer angry? What if I make
enemies?" These were all questions that raced through my mind and made me feel like I was
approaching a field of eggshells when I first joined the `#sig-contribex` channel on the Kubernetes
Slack and announced that I would be working on the
[Development Guide](https://github.com/kubernetes/community/blob/master/contributors/devel/development.md). 
-->

"我必须得多仔细？如果我搞砸了怎么办？如果我让开发商生气了怎么办？如果我树敌了怎么办？"。
当我第一次加入 Kubernetes Slack 上的  "#sig-contribex "  频道并宣布我将编写 [开发指南](https://github.com/kubernetes/community/blob/master/contributors/devel/development.md) 时，这些问题都在我脑海中奔腾，让我感觉如履薄冰。

<!--
 {{< imgproc jorge-castro-code-of-conduct Fit "800x450" >}}
"The Kubernetes Code of Conduct is in effect, so please be excellent to each other." &mdash; Jorge
Castro, SIG ContribEx co-chair
{{< /imgproc >}} 
-->

{{< imgproc jorge-castro-code-of-conduct Fit "800x450" >}}
"Kubernetes 编码准则已经生效，让我们共同勉励。" &mdash; Jorge
Castro, SIG ContribEx co-chair
{{< /imgproc >}}

<!--
 My fears were unfounded. Immediately, I felt welcome. I like to think this isn't just because I was
working on a much needed task, but rather because the Kubernetes community is filled
with friendly, welcoming people. During the weekly SIG ContribEx meetings, our reports on progress
with the Development Guide were included immediately. In addition, the leader of the meeting would
always stress that the [Kubernetes Code of Conduct](https://www.kubernetes.dev/resources/code-of-conduct/) was in
effect, and that we should, like Bill and Ted, be excellent to each other. 
-->

事实上我的担心是多虑的。很快，我就感觉到自己是被欢迎的。我倾向于认为这不仅仅是因为我正在从事一项急需的任务，而是因为 Kubernetes 社区充满了友好、热情的人们。
在每周的 SIG ContribEx 会议上，我们关于开发指南进展情况的报告会被立即纳入其中。此外，会议的领导会一直强调 [Kubernetes](https://www.kubernetes.dev/resources/code-of-conduct/) 编码准则，我们应该像 Bill 和 Ted 一样，相互进步。


<!--
 ## This Doesn't Mean It's All Easy

The Development Guide needed a pretty serious overhaul. When we got our hands on it, it was already
packed with information and lots of steps for new developers to go through, but it was getting dusty
with age and neglect. Documentation can really require a global look, not just point fixes.
As a result, I ended up submitting a gargantuan pull request to the
[Community repo](https://github.com/kubernetes/community): 267 additions and 88 deletions. 
-->

## 这并不意味着这一切都很简单

开发指南需要一次全面检查。当我们拿到它的时候，它已经捆绑了大量的信息和很多新开发者需要经历的步骤，但随着时间的推移和被忽视，它变得相当陈旧。
文档的确需要全局观，而不仅仅是点与点的修复。结果，最终我向这个项目提交了一个巨大的 pull 请求。[社区仓库](https://github.com/kubernetes/community)：新增 267 行，删除 88 行。

<!--
 The life cycle of a pull request requires a certain number of Kubernetes organization members to review and approve changes
before they can be merged. This is a great practice, as it keeps both documentation and code in
pretty good shape, but it can be tough to cajole the right people into taking the time for such a hefty
review. As a result, that massive PR took 26 days from my first submission to final merge. But in
the end, [it was successful](https://github.com/kubernetes/community/pull/5003). 
-->

pull 请求的周期需要一定数量的 Kubernetes 组织成员审查和批准更改后才能合并。这是一个很好的做法，因为它使文档和代码都保持在相当不错的状态，
但要哄骗合适的人花时间来做这样一个赫赫有名的审查是很难的。
因此，那次大规模的 PR 从我第一次提交到最后合并，用了 26 天。 但最终，[它是成功的](https://github.com/kubernetes/community/pull/5003).

<!--
 Since Kubernetes is a pretty fast-moving project, and since developers typically aren't really
excited about writing documentation, I also ran into the problem that sometimes, the secret jewels
that describe the workings of a Kubernetes subsystem are buried deep within the [labyrinthine mind of
a brilliant engineer](https://github.com/amwat), and not in plain English in a Markdown file. I ran headlong into this issue
when it came time to update the getting started documentation for end-to-end (e2e) testing.  
-->

由于 Kubernetes 是一个发展相当迅速的项目，而且开发人员通常对编写文档并不十分感兴趣，所以我也遇到了一个问题，那就是有时候，
描述 Kubernetes 子系统工作原理的秘密珍宝被深埋在 [天才工程师的迷宫式思维](https://github.com/amwat) 中，而不是用单纯的英文写在 Markdown 文件中。
当我要更新端到端（e2e）测试的入门文档时，就一头撞上了这个问题。

<!--
 This portion of my journey took me out of documentation-writing territory and into the role of a
brand new user of some unfinished software. I ended up working with one of the developers of the new
[`kubetest2` framework](https://github.com/kubernetes-sigs/kubetest2) to document the latest process of
getting up-and-running for e2e testing, but it required a lot of head scratching on my part. You can
judge the results for yourself by checking out my
[completed pull request](https://github.com/kubernetes/community/pull/5045). 
-->

这段旅程将我带出了编写文档的领域，进入到一些未完成软件的全新用户角色。最终我花了很多心思与新的 [kubetest2`框架](https://github.com/kubernetes-sigs/kubetest2) 的开发者之一合作，
记录了最新 e2e 测试的启动和运行过程。
你可以通过查看我的 [已完成的 pull request](https://github.com/kubernetes/community/pull/5045) 来自己判断结果。

<!--
 ## Nobody Is the Boss, and Everybody Gives Feedback

But while I secretly expected chaos, the process of contributing to the Kubernetes Development Guide
and interacting with the amazing Kubernetes community went incredibly smoothly. There was no
contention. I made no enemies. Everybody was incredibly friendly and welcoming. It was *enjoyable*. 
-->

## 没有人是老板，每个人都给出反馈。

但当我暗自期待混乱的时候，为 Kubernetes 开发指南做贡献以及与神奇的 Kubernetes 社区互动的过程却非常顺利。
没有争执，我也没有树敌。每个人都非常友好和热情。这是令人*愉快的*。

<!--
 With an open source project, there is no one boss. The Kubernetes project, which approaches being
gargantuan, is split into many different special interest groups (SIGs), working groups, and
communities. Each has its own regularly scheduled meetings, assigned duties, and elected
chairpersons. My work intersected with the efforts of both SIG ContribEx (who watch over and seek to
improve the contributor experience) and SIG Testing (who are in charge of testing). Both of these
SIGs proved easy to work with, eager for contributions, and populated with incredibly friendly and
welcoming people. 
-->

对于一个开源项目，没人是老板。Kubernetes 项目，一个近乎巨大的项目，被分割成许多不同的特殊兴趣小组（SIG）、工作组和社区。
每个小组都有自己的定期会议、职责分配和主席推选。我的工作与 SIG ContribEx（负责监督并寻求改善贡献者体验）和 SIG Testing（负责测试）的工作有交集。
事实证明，这两个 SIG 都很容易合作，他们渴望贡献，而且都是非常友好和热情的人。

<!--
 In an active, living project like Kubernetes, documentation continues to need maintenance, revision,
and testing alongside the code base. The Development Guide will continue to be crucial to onboarding
new contributors to the Kubernetes code base, and as our efforts have shown, it is important that
this guide keeps pace with the evolution of the Kubernetes project. 
-->

在 Kubernetes 这样一个活跃的、有生命力的项目中，文档仍然需要与代码库一起进行维护、修订和测试。
开发指南将继续对 Kubernetes 代码库的新贡献者起到至关重要的作用，正如我们的努力所显示的那样，该指南必须与 Kubernetes 项目的发展保持同步。

<!--
 Joel and I really enjoy interacting with the Kubernetes community and contributing to
the Development Guide. I really look forward to continuing to not only contributing more, but to
continuing to build the new friendships I've made in this vast open source community over the past
few months. 
-->

Joel 和我非常喜欢与 Kubernetes 社区互动并为开发指南做出贡献。我真的很期待，不仅能继续做出更多贡献，还能继续与过去几个月在这个庞大的开源社区中结识的新朋友进行合作。
