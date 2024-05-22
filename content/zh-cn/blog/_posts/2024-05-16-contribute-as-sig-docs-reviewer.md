---
layout: blog
title: "从敲代码到抒发文笔：与 SIG Docs 一起踏上传奇的 Kubernetes 探险之旅"
date: 2024-05-16
slug: contribute-as-sig-docs-reviewer
canonicalUrl: https://www.kubernetes.dev/blog/2024/05/16/contribute-as-sig-docs-reviewer/
author: "Ricardo Amaro (Acquia)"
translator: "Michael Yao (DaoCloud)"
---
<!--
layout: blog
title: "From Code to Quill: Embark on a Legendary Kubernetes Quest with SIG Docs"
date: 2024-05-16
slug: contribute-as-sig-docs-reviewer
canonicalUrl: https://www.kubernetes.dev/blog/2024/05/16/contribute-as-sig-docs-reviewer/
author: "Ricardo Amaro (Acquia)"
-->

<!--
You've likely heard the adage, "Contributing isn't just about writing code",
whispered in forums or seen etched into the digital walls of open source communities.
But what depth of truth lies within this ancient wisdom, especially in the vast,
evolving world of Kubernetes?

Today, contributing to open source extends far beyond the realm of coding.
It's an inclusive journey that welcomes the diverse skills of all who wish
to be a part of it. Whether you're a seasoned developer or someone whose strengths
lie outside traditional programming, your contributions hold immense value.
-->
你可能在论坛中听过或在开源社区的数字墙上见过这么一句格言：“做贡献不仅仅是写代码”。
特别是在这个广阔、不断发展的 Kubernetes 社区中，这句古老的智慧格言真正意味着什么呢？

如今，为开源做贡献远远超出了敲代码的范畴。
做贡献是一段内涵丰富的旅程，我们欢迎所有有志之士展露自己的各类技能。
不论你是经验丰富的开发者，还是在传统编程之外拥有特长的人，你的贡献都有很大价值。

<!--
Imagine yourself embarking on a journey that leverages your expertise and love
for free software to enhance your capabilities and strengthen the very foundation
of the Kubernetes ecosystem. This is a real opportunity for you to shine, to make
an indelible mark on a project that powers some of the most critical infrastructure
in the world today.
-->
想象一下，踏上一段这样的旅程，既能充分发挥你的专业知识，又能尽情抒展你对自由软件的热爱，
在这个贡献过程中既增强了你的能力，又巩固了 Kubernetes 生态体系的基础。
这是一个让你闪耀光芒的真正机遇，能够让你在支撑当今世界某些最关键基础设施的项目上留下不可磨灭的印记。

<!--
Your journey begins with a single step: joining the Special Interest Group (SIG) Docs. 
Here, your talent for articulating complex concepts, your keen eye for detail,
and your unwavering commitment to clarity become your most powerful tools. As a contributor,
you can transform dense technical landscapes into navigable pathways, making Kubernetes
accessible to all.
-->
你的旅程始于简单的一步：加入特别兴趣小组 (SIG) Docs。
在这个小组，你对复杂概念的表达能力、对细节的敏锐眼光以及对清晰易懂的不懈追求将成为你最强大的工具。
作为一名贡献者，你将从密集复杂的技术内容中找出一条易于上手的路径，让大众都能使用 Kubernetes。

<!--
This is your call to adventure, an invitation to expand beyond the familiar territories
of code and into the rich, uncharted domains of documentation and collaboration,
empowering a global community of users and contributors.
-->
这是一次有关冒险的召唤，一份超越代码领域的邀请，指引你踏入文档创作与社区协作的未知境地。
在这里，你将为全球用户和贡献者组成的社区赋能，点亮他们前行的道路。

<!--
## Why become a SIG Docs reviewer?

The Kubernetes project depends substantially on the SIG Docs to ensure that documentation
is accurate, up to date, and easily accessible. By becoming a reviewer, you can help users
and contributors navigate and understand Kubernetes more effectively. In addition, reviewing
documentation provides unique opportunities for:
-->
## 为什么要成为 SIG Docs Reviewer？   {#why-become-a-sig-docs-reviewer}

Kubernetes 项目在很大程度上依赖于 SIG Docs 小组成员们确保文档准确无误、与时俱进、好用易懂。
你成为 Reviewer 后，就可以帮助用户和贡献者们更有效地探索和学习 Kubernetes。
此外，你在评审文档时还将收获一些独特的机会：

<!--
- **Expanding your Kubernetes knowledge**: Engage deeply with new features and functionalities
  by reviewing their documentation.
- **Improving your technical writing skills**: Develop an eye for detail and clarity in technical
  writing.
- **Strengthening the Kubernetes community**: Help maintain the high quality of Kubernetes
  documentation, supporting both new and experienced users.
- **Building your network**: Expanding your professional network, and getting together with
  contributors from around the globe.
-->
- **拓展你的 Kubernetes 知识**：通过评审文档深入了解新的功能特性。
- **提高你的技术写作技巧**：培养技术写作中注重细节和清晰阐述的能力。
- **巩固 Kubernetes 社区**：帮助维护优质的 Kubernetes 文档，方便新老用户查阅。
- **建立你的人脉**：拓展你的专业人际网络，认识来自全球的贡献者。

<!--
## Who are we looking for?

We're seeking open source enthusiasts with:
-->
## 我们在寻找什么样的人？   {#who-are-we-looking-for}

我们正在寻找对开源充满热情且具备以下能力的人士：

<!--
- Experience of Git and GitHub, comfortable with the process of reviewing pull requests
  and providing constructive feedback.
- Familiarity with Markdown and documentation frameworks (Hugo experience is a plus but
  not required).
- A passion for making complex technical concepts understandable and accessible.
-->
- 拥有 Git 和 GitHub 的经验，熟悉评审 PR 的流程，并能提供建设性的反馈。
- 熟悉 Markdown 和文档框架（有 Hugo 经验是加分项，但不是必需的）。
- 热衷于让复杂的技术概念变得易懂好用。

<!--
Experience in technical writing or documentation review in open source projects is beneficial, 
but not mandatory. Kubernetes experience is welcome at all levels. Those less familiar 
with Kubernetes or containers can provide valuable fresh perspectives for beginners accessibility. 
We value diversity of experiences and the fresh eyes you can provide to make sure our content 
is clear and understandable for everyone.
-->
在开源项目中有技术写作或文档评审经验是加分项，但并非必需。我们欢迎对 Kubernetes 有各种经验的贡献者。
那些对 Kubernetes 或容器不太熟悉的新人，可以为初学者提供宝贵的全新视角。
我们重视多样化的经验和新视角，以确保我们的文档内容对每个人都清晰易懂。

<!--
## How to get started

Becoming a SIG Docs reviewer is a journey that starts with familiarizing yourself with the
Kubernetes documentation contribution process. Here are the steps to get you started:
-->
## 如何开始   {#how-to-get-started}

成为 SIG Docs Reviewer 是一段从熟悉 Kubernetes 文档贡献流程开始的旅程。以下是入门步骤：

<!--
1. **Familiarize Yourself with SIG Docs**: Start by reading the
   [SIG Docs contributor guide](/docs/contribute/) to understand
   how documentation contributions are made.

1. **Join the Kubernetes Slack**: Connect with the SIG Docs community on the
   [#sig-docs channel](https://kubernetes.slack.com/messages/sig-docs). It's a great place
   to ask questions, find mentorship, and get to know the community.
-->
1. **熟悉 SIG Docs**：首先阅读 [SIG Docs 贡献者指南](/zh-cn/docs/contribute/)，了解如何做文档贡献。

2. **加入 Kubernetes Slack**：在 [#sig-docs 频道](https://kubernetes.slack.com/messages/sig-docs)与
   SIG Docs 社区建立联系。Slack 是一个提问、寻求指教和了解社区的好地方。

<!--
1. **Start Reviewing Pull Requests**: Look for open pull requests labeled with
   `good first issue` or `help wanted`. These are great for beginners. Leave constructive
   feedback and suggestions. Familiarize yourself with the
   [content guide](/docs/contribute/style/content-guide/) and the 
   [style guide](/docs/contribute/style/style-guide/) to provide more effectively 
   [reviewing Pull Requests](/docs/contribute/review/reviewing-prs/).
-->
3. **开始评审 PR**：查找打了 `good first issue` 或 `help wanted` 标签的开放 PR。
   这些 PR 对 Reviewer 新手来说是很好的选择。你可以在其中留下建设性的反馈和建议。
   你还要熟悉[内容指南](/zh-cn/docs/contribute/style/content-guide/)和[样式指南](/zh-cn/docs/contribute/style/style-guide/)，
   以便更有效地[评审 PR](/zh-cn/docs/contribute/review/reviewing-prs/)。

<!--
1. **Attend SIG Docs Meetings**: Participate in the 
   [SIG Docs meetings](https://github.com/kubernetes/community/tree/master/sig-docs). These
   meetings are an excellent opportunity to meet fellow contributors, discuss documentation
   improvements, and volunteer for reviewing tasks.
-->
4. **参加 SIG Docs 会议**：参与 [SIG Docs 会议](https://github.com/kubernetes/community/tree/master/sig-docs)。
   这些会议是结识其他贡献者、讨论文档改进和志愿评审任务的绝佳机会。

<!--
1. **Shadow an Experienced Reviewer**: To better understand the review process, sign up for our official
   [PR Wrangling shadow program](/docs/contribute/participate/pr-wranglers/#pr-wrangler-shadow-program)
   where you will be able to shadow an [experienced reviewer](/docs/contribute/participate/roles-and-responsibilities/) 
   and learn best practices and tips for reviewing efficiently and effectively.
-->
5. **成为资深 Reviewer 的影子**：若想更好地理解评审过程，请报名参加我们的
   [PR 管理影子计划](/zh-cn/docs/contribute/participate/pr-wranglers/#pr-wrangler-shadow-program)，
   你将能够成为[资深 Reviewer](/zh-cn/docs/contribute/participate/roles-and-responsibilities/)的影子，
   学习高效和有效评审的良好实践和技巧。

<!--
1. **Contributor Ladder**: Familiarize yourself with the
   [CNCF contributor ladder](https://github.com/cncf/project-template/blob/main/CONTRIBUTOR_LADDER.md),
   which guides your progression from newcomer to advanced contributor roles in the Kubernetes community.
-->
6. **贡献者阶梯**：熟悉 [CNCF 贡献者阶梯](https://github.com/cncf/project-template/blob/main/CONTRIBUTOR_LADDER.md)，
   这能帮助你从新手进阶为 Kubernetes 社区中高级贡献者角色。

<!--
## What's next?

After consistently contributing to documentation reviews and demonstrating your understanding
of Kubernetes documentation standards, you can express your interest in becoming an official
SIG Docs reviewer. Engage with the SIG Docs chairs or leads on the
[public Slack channel](https://kubernetes.slack.com/channels/C1J0BPD2M)
or during SIG Docs meetings to discuss the next steps.
-->
## 接下来   {#whats-next}

在文档评审方面持续贡献并展示你对 Kubernetes 文档标准的理解后，你可以表达成为正式 SIG Docs Reviewer 的兴趣。
你可以在[公共 Slack 频道](https://kubernetes.slack.com/channels/C1J0BPD2M)或 SIG Docs 会议期间与
SIG Docs Chair 或 Lead 讨论后续步骤。

<!--
## See _you_ in the docs!

Becoming a SIG Docs reviewer is more than contributing; it's embracing the heart of the
Kubernetes community 🚀. Enhance your knowledge and writing skills while contributing
to our valuable documentation. This is your opportunity to guide others with your expertise
and make a lasting impact. Welcome aboard—see you there! 🌟
-->
## 希望在文档中看到**你的名字**！   {#see-you-in-the-docs}

成为 SIG Docs Reviewer 不仅仅是做贡献；这说明你已进入 Kubernetes 社区的核心 🚀。
你在为宝贵文档做贡献的同时也能提升自己的理论知识和写作技巧。
这是你用自己的专业知识指导他人并产生持久影响的机会。
欢迎你加入团队，我们在 SIG Docs 不见不散！🌟
