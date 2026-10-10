---
layout: blog
title: "AI 时代的开源维护"
date: 2026-06-26T10:00:00-08:00
canonicalUrl: https://www.kubernetes.dev/blog/2026/06/26/open-source-maintainership-in-the-age-of-ai
slug: open-source-maintainership-in-the-age-of-ai
author: >
  Kevin Hannon (Red Hat)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Open source maintainership in the age of AI"
date: 2026-06-26T10:00:00-08:00
canonicalUrl: https://www.kubernetes.dev/blog/2026/06/26/open-source-maintainership-in-the-age-of-ai
slug: open-source-maintainership-in-the-age-of-ai
author: >
  Kevin Hannon (Red Hat)
-->

<!--
AI has really changed the game around software development.
More people are leveraging AI than ever to contribute patches to projects they use.
To me, this is a good thing as more folks will contribute patches rather than fork or not fix them.
The main problem is that AI has made generating code fast but there has been very little improvement in maintaining code bases.
In this post, we will highlight the ways the Kubernetes community is adapting to the world of AI assisted coding.

The first step of this journey was to develop an AI policy. This seems mundane and bureaucratic but there were many PRs that derailed into discussions around AI usage.
The AI policy helps steer the conversation around the project's stance on AI and provides a clear signal to contributors on how to use these tools responsibly.
-->
AI 确实改变了软件开发的格局。
比以往任何时候都更多的人利用 AI 为他们使用的项目贡献补丁。
对我来说，这是一件好事，因为更多人会贡献补丁而不是分叉项目或不修复问题。
主要问题是，AI 使代码生成变得快速，但在维护代码库方面几乎没有改进。
在本文中，我们将重点介绍 Kubernetes 社区如何适应 AI 辅助编码的世界。

这一旅程的第一步是制定 AI 政策。这看似平凡且官僚，但有许多 PR 陷入了关于 AI 使用的讨论。
AI 政策有助于引导围绕项目对 AI 立场的讨论，并为贡献者提供明确的信号，指导他们如何负责任地使用这些工具。

<!--
## Kubernetes AI policy
-->
## Kubernetes AI 政策

<!--
The Kubernetes project has established [clear guidelines for AI-assisted contributions](https://www.kubernetes.dev/docs/guide/pull-requests/#ai-guidance) that balance innovation with accountability.
These policies are designed to maintain code quality and ensure human oversight while acknowledging that AI tools can be valuable aids in the development process.
-->
Kubernetes 项目已制定
[AI 辅助贡献的明确指南](https://www.kubernetes.dev/docs/guide/pull-requests/#ai-guidance)，
在创新与问责之间取得平衡。
这些政策旨在保持代码质量并确保人工监督，同时承认 AI 工具可以成为开发过程中有价值的辅助手段。

<!--
### Transparency first
-->
### 透明为先

<!--
Contributors must disclose when AI tools have been used to assist with a pull request. A simple statement in the PR description such as "This PR was written in part with the assistance of generative AI" is sufficient. This transparency helps reviewers understand the context and apply appropriate scrutiny.
-->
贡献者必须披露何时使用 AI 工具协助创建 Pull Request。
在 PR 描述中简单声明如 "This PR was written in part with the assistance of generative AI" 即足够。
这种透明度有助于审查者理解上下文并进行适当的审查。

<!--
### Human accountability
-->
### 人工问责

<!--
While AI tools can assist, the human contributor remains fully responsible for every change. The policy explicitly prohibits:

- Listing AI as a co-author on commits
- Using AI co-signing on commits
- Adding trailers like "assisted-by" or "co-developed" that attribute work to AI

This isn't about diminishing AI's role as a tool—it's about maintaining clear accountability. If something breaks, there needs to be a human who understands why and can fix it.
-->
虽然 AI 工具可以提供帮助，但人类贡献者仍然对每一项更改负全部责任。该政策明确禁止：

- 将 AI 列为提交的共同作者
- 在提交中使用 AI 共同签名
- 添加 "assisted-by" 或 "co-developed" 等尾部信息将工作归功于 AI

这不是为了削弱 AI 作为工具的作用——而是为了保持明确的问责制。
如果出现问题，需要有一个人理解原因并能够修复它。

<!--
### CLA enforcement for co-authors
-->
### 共同作者的 CLA 强制执行

<!--
The CNCF provides a [tool](https://github.com/cncf/cla) for verifying the contributor license agreements on each pull request.
AI agents are not able to solve these contributor license agreements so one enforcement the project made is to enable the CLA check for co-authors.
This provides a flag to reviewers that the PR is not ready to merge.
-->
CNCF 提供了一个[工具](https://github.com/cncf/cla) 来验证每个 Pull Request 上的贡献者许可协议。
AI 代理无法签署这些贡献者许可协议，因此项目采取的一项强制执行措施是为共同作者启用 CLA 检查。
这向审查者提供了一个标志，表明该 PR 尚未准备好合并。

<!--
### Human engagement required
-->
### 必须有人工参与

<!--
Perhaps the most critical aspect of the policy: reviewers expect to engage with humans, not with AI.
Contributors cannot rely on AI to respond to review comments.
If you cannot personally explain changes that AI helped generate, your PR will be closed.
This requirement ensures that knowledge transfer happens and that contributors genuinely understand the code they're submitting.
-->
这可能是该政策最关键的方面：审查者期望与人类互动，而不是与 AI。
贡献者不能依赖 AI 来回复审查评论。
如果你无法亲自解释 AI 帮助生成的更改，你的 PR 将被关闭。
这一要求确保知识转移发生，并确保贡献者真正理解他们提交的代码。

<!--
### Verification obligations
-->
### 验证义务

<!--
Contributors must verify AI-generated changes through code review, testing, and personal understanding.
It's not enough for the code to work—you need to know why it works and be able to maintain it.

These policies reflect a mature approach to AI: embrace it as a tool, but never let it replace human judgment, understanding, or responsibility.
-->
贡献者必须通过代码审查、测试和个人理解来验证 AI 生成的更改。
代码能够运行还不够——你需要知道它为什么能运行并能够维护它。

这些政策反映了对 AI 的成熟态度：将其作为工具拥抱，但永远不要让它取代人类的判断、理解或责任。

<!--
## Automated AI reviews
-->
## 自动化 AI 审查

<!--
There exist many tools to aid in reviewing code. AI pull request tools introduce governance challenges so one of the first tasks the community took on was to [document the process](https://github.com/kubernetes/community/blob/main/github-management/ai-code-review-tools.md) for what is needed to bring in new AI tools.
One of the major evaluation criteria for these tools is to find maintainers willing to test drive them in kubernetes-sigs repositories. Kueue, JobSet and Agent-Sandbox have been experimenting with these tools to provide more support for maintainers.
-->
有许多工具可以帮助审查代码。AI Pull Request 工具引入了治理挑战，
因此社区承担的首要任务之一是[记录流程](https://github.com/kubernetes/community/blob/main/github-management/ai-code-review-tools.md)，
说明引入新 AI 工具需要什么。
这些工具的主要评估标准之一是找到愿意在 kubernetes-sigs 仓库中试用它们的维护者。
Kueue、JobSet 和 Agent-Sandbox 一直在试验这些工具，以为维护者提供更多支持。

<!--
### Copilot
-->
### Copilot

<!--
One tool that many maintainers started using was GitHub Copilot.
The CNCF provides [access for maintainers](https://contribute.cncf.io/blog/2025/12/16/github-copilot-enterprise-for-maintainers/) so this ended up being the first tool many started using.
It provides some good experience on tuning reviews but there were some growing pains with this tool.
The biggest blocker for community adoption is relying on contributors to have a copilot license. Only maintainers were able to request copilot reviews and automated reviews of pull requests was out of reach for the community.
One of the goals of AI review tools is to provide an automated review tool that maintainers don't need to request.
This demonstrated the need for organization control rather than relying on contributors having access.
-->
许多维护者开始使用的一个工具是 GitHub Copilot。
CNCF 为维护者提供[访问权限](https://contribute.cncf.io/blog/2025/12/16/github-copilot-enterprise-for-maintainers/)，
因此这最终成为许多人开始使用的第一个工具。
它在调整审查方面提供了一些良好体验，但该工具也存在一些成长的烦恼。
社区采用的最大障碍是依赖贡献者拥有 Copilot 许可证。
只有维护者能够请求 Copilot 审查，社区无法实现 Pull Request 的自动化审查。
AI 审查工具的目标之一是提供一种维护者无需请求的自动化审查工具。
这表明需要组织控制，而不是依赖贡献者拥有访问权限。

<!--
### CodeRabbit
-->
### CodeRabbit

<!--
In mid 2026, the Kubernetes community has rolled out CodeRabbit to a few projects.
As with copilot, some tuning has been required to provide better reviews but the overall feedback has been positive.
There is a lot of configuration available for this tool and one of the most interesting uses of this tool comes from agent-sandbox.

AI pull request tools can be a quality gate. Contributors can at least get a quick spot check review without waiting for a maintainer.
Agent-sandbox has added a label on PRs to reflect that there is still a need to resolve some of the comments from AI tools.
-->
在 2026 年年中，Kubernetes 社区已向几个项目推出了 CodeRabbit。
与 Copilot 一样，需要进行一些调整以提供更好的审查，但总体反馈是积极的。
该工具有很多配置可用，其中最有趣的用途之一来自 agent-sandbox。

AI Pull Request 工具可以作为质量门控。贡献者至少可以获得快速抽查审查，而无需等待维护者。
agent-sandbox 已在 PR 上添加标签，以反映仍需要解决 AI 工具的一些评论。

<!--
## Next steps
-->
## 下一步

<!--
The reality is that leveraging AI in open source projects is an area of active exploration.
The community could use your help in tuning reviews tools, evaluating tools or evaluating emerging technologies in the AI space.

Some areas we are exploring more:

- The use of AI skills to reduce maintainer burnout.
- AI assisted triage of failing tests.
- Skills to aid the operational aspects of Kubernetes.
-->
现实情况是，在开源项目中利用 AI 是一个积极探索的领域。
社区可以使用你的帮助来调整审查工具、评估工具或评估 AI 领域的新兴技术。

我们正在更多探索的一些领域：

- 使用 AI 技能减少维护者倦怠。
- AI 辅助对失败测试进行分类。
- 有助于 Kubernetes 运营方面的技能。
