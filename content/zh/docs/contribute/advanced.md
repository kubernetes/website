---
title: 高级贡献
slug: advanced
content_type: concept
weight: 98
---
<!--
title: Advanced contributing
slug: advanced
content_type: concept
weight: 98
-->

<!-- overview -->

<!--
This page assumes that you understand how to
[contribute to new content](/docs/contribute/new-content/overview) and
[review others' work](/docs/contribute/review/reviewing-prs/), and are ready
to learn about more ways to contribute. You need to use the Git command line
client and other tools for some of these tasks.
-->

如果你已经了解如何[贡献新内容](/zh/docs/contribute/new-content/overview/)和
[评阅他人工作](/zh/docs/contribute/review/reviewing-prs/)，并准备了解更多贡献的途径，
请阅读此文。您需要使用 Git 命令行工具和其他工具做这些工作。

<!-- body -->

<!--
## Propose improvements

SIG Docs [members](/docs/contribute/participate/roles-and-responsibilities/#members) can propose improvements.
-->
## 提出改进建议

SIG Docs 的 [成员](/zh/docs/contribute/participate/roles-and-responsibilities/#members) 可以提出改进建议。

<!--
After you've been contributing to the Kubernetes documentation for a while, you
may have ideas for improving the [Style Guide](/docs/contribute/style/style-guide/)
, the [Content Guide](/docs/contribute/style/content-guide/), the toolchain used to build
the documentation, the website style, the processes for reviewing and merging
pull requests, or other aspects of the documentation. For maximum transparency,
these types of proposals need to be discussed in a SIG Docs meeting or on the
[kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
In addition, it can really help to have some context about the way things
currently work and why past decisions have been made before proposing sweeping
changes. The quickest way to get answers to questions about how the documentation
currently works is to ask in the `#sig-docs` Slack channel on
[kubernetes.slack.com](https://kubernetes.slack.com)
-->
在对 Kubernetes 文档贡献了一段时间后，你可能会对[样式指南](/zh/docs/contribute/style/style-guide/)、
[内容指南](/zh/docs/contribute/style/content-guide/)、用于构建文档的工具链、网站样式、
评审和合并 PR 的流程或者文档的其他方面产生改进的想法。
为了尽可能透明化，这些提议都需要在 SIG Docs 会议或
[kubernetes-sig-docs 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)上讨论。
此外，在提出全面的改进之前，这些讨论能真正帮助我们了解有关“当前工作如何运作”和“以往的决定是为何做出”的背景。
想了解文档的当前运作方式，最快的途径是咨询 [kubernetes.slack.com](https://kubernetes.slack.com)
中的 `#sig-docs` 聊天群组。

<!--
After the discussion has taken place and the SIG is in agreement about the desired
outcome, you can work on the proposed changes in the way that is the most
appropriate. For instance, an update to the style guide or the website's
functionality might involve opening a pull request, while a change related to
documentation testing might involve working with sig-testing.
-->
在进行了讨论并且 SIG 就期望的结果达成一致之后，你就能以最合理的方式处理改进建议了。例如，样式指南或网站功能的更新可能涉及 PR 的新增，而与文档测试相关的更改可能涉及 sig-testing。

<!--
## Coordinate docs for a Kubernetes release

SIG Docs [approvers](/docs/contribute/participating/#approvers) can coordinate
docs for a Kubernetes release.
-->
## 为 Kubernetes 版本发布协调文档工作

SIG Docs 的[批准者（approvers）](/zh/docs/contribute/participating/#approvers) 可以为
Kubernetes 版本发布协调文档工作。

<!--
Each Kubernetes release is coordinated by a team of people participating in the
sig-release Special Interest Group (SIG). Others on the release team for a given
release include an overall release lead, as well as representatives from
sig-testing and others. To find out more about Kubernetes release processes,
refer to
[https://github.com/kubernetes/sig-release](https://github.com/kubernetes/sig-release).
-->
每一个 Kubernetes 版本都是由参与 sig-release 的 SIG（特别兴趣小组）的一个团队协调的。
指定版本的发布团队中还包括总体发布牵头人，以及来自 sig-testing 的代表等。
要了解更多关于 Kubernetes 版本发布的流程，请参考
[https://github.com/kubernetes/sig-release](https://github.com/kubernetes/sig-release)。

<!--
The SIG Docs representative for a given release coordinates the following tasks:

- Monitor the feature-tracking spreadsheet for new or changed features with an
  impact on documentation. If documentation for a given feature won't be ready
  for the release, the feature may not be allowed to go into the release.
- Attend sig-release meetings regularly and give updates on the status of the
  docs for the release.
- Review and copyedit feature documentation drafted by the SIG responsible for
  implementing the feature.
- Merge release-related pull requests and maintain the Git feature branch for
  the release.
- Mentor other SIG Docs contributors who want to learn how to do this role in
  the future. This is known as "shadowing".
- Publish the documentation changes related to the release when the release
  artifacts are published.
-->

SIG Docs 团队的代表需要为一个指定的版本协调以下工作：

- 通过特性跟踪表来监视新功能特性或现有功能特性的修改。
  如果版本的某个功能特性的文档没有为发布做好准备，那么该功能特性不允许进入发布版本。
- 定期参加 sig-release 会议并汇报文档的发布状态。
- 评审和修改由负责实现某功能特性的 SIG 起草的功能特性文档。
- 合入版本发布相关的 PR，并为对应发布版本维护 Git 特性分支。
- 指导那些想学习并有意愿担当该角色的 SIG Docs 贡献者。这就是我们常说的“实习”。
- 发布版本的组件发布时，相关的文档更新也需要发布。

<!--
Coordinating a release is typically a 3-4 month commitment, and the duty is
rotated among SIG Docs approvers.
-->
协调一个版本发布通常需要 3-4 个月的时间投入，该任务由 SIG Docs 批准人轮流承担。

<!--
## Serve as a New Contributor Ambassador

SIG Docs [approvers](/docs/contribute/participating/#approvers) can serve as
New Contributor Ambassadors. 

New Contributor Ambassadors work together to welcome new contributors to SIG-Docs, 
suggest PRs to new contributors, and mentor new contributors through their first
few PR submissions.

Responsibilities for New Contributor Ambassadors include:
-->

## 担任新的贡献者大使

SIG Docs [批准人（Approvers）](/zh/docs/contribute/participating/#approvers) 
可以担任新的贡献者大使。

新的贡献者大使共同努力欢迎 SIG-Docs 的新贡献者，对新贡献者的 PR 提出建议，
以及在前几份 PR 提交中指导新贡献者。

新的贡献者大使的职责包括：

<!--
- Being available on the [Kubernetes #sig-docs channel](https://kubernetes.slack.com) to answer questions from new contributors.
- Working with PR wranglers to identify good first issues for new contributors. 
- Mentoring new contributors through their first few PRs to the docs repo. 
- Helping new contributors create the more complex PRs they need to become Kubernetes members.
- [Sponsoring contributors](/docs/contribute/advanced/#sponsor-a-new-contributor) on their path to becoming Kubernetes members.
-->
- 监听 [Kubernetes #sig-docs 频道](https://kubernetes.slack.com) 上新贡献者的 Issue。
- 与 PR 管理者合作为新参与者寻找合适的第一个 issues。 
- 通过前几个 PR 指导新贡献者为文档存储库作贡献。 
- 帮助新的贡献者创建成为 Kubernetes 成员所需的更复杂的 PR。
- [为贡献者提供保荐](#sponsor-a-new-contributor)，使其成为 Kubernetes 成员。

<!--
Current New Contributor Ambassadors are announced at each SIG-Docs meeting, and in the [Kubernetes #sig-docs channel](https://kubernetes.slack.com).
-->
当前新贡献者大使将在每次 SIG 文档会议上以及 [Kubernetes #sig-docs 频道](https://kubernetes.slack.com)中宣布。

<!--
## Sponsor a new contributor

SIG Docs [reviewers](/docs/contribute/participating/#reviewers) can sponsor
new contributors.
-->
## 为新的贡献者提供保荐 {#sponsor-a-new-contributor}

SIG Docs 的[评审人（Reviewers）](/zh/docs/contribute/participating/#reviewers) 可以为新的贡献者提供保荐。

<!--
After a new contributor has successfully submitted 5 substantive pull requests
to one or more Kubernetes repositories, they are eligible to apply for
[membership](/docs/contribute/participating#members) in the Kubernetes
organization. The contributor's membership needs to be backed by two sponsors
who are already reviewers.
-->
新的贡献者针对一个或多个 Kubernetes 项目仓库成功提交了 5 个实质性 PR 之后，
就有资格申请 Kubernetes 组织的[成员身份](/zh/docs/contribute/participate/roles-and-responsibilities/#members)。
贡献者的成员资格需要同时得到两位评审人的保荐。

<!--
New docs contributors can request sponsors by asking in the #sig-docs channel
on the [Kubernetes Slack instance](https://kubernetes.slack.com) or on the
[SIG Docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
If you feel confident about the applicant's work, you volunteer to sponsor them.
When they submit their membership application, reply to the application with a
"+1" and include details about why you think the applicant is a good fit for
membership in the Kubernetes organization.
-->
新的文档贡献者可以通过咨询 [Kubernetes Slack 实例](https://kubernetes.slack.com)
上的 #sig-docs 频道或者 [SIG Docs 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
来请求评审者保荐。如果你对申请人的工作充满信心，你自愿保荐他们。
当他们提交成员资格申请时，回复 “+1” 并详细说明为什么你认为申请人适合加入 Kubernetes 组织。

<!--
## Serve as a SIG Co-chair

SIG Docs [approvers](/docs/contribute/participating/#approvers) can serve a term as a co-chair of SIG Docs.

### Prerequisites
-->
## 担任 SIG 联合主席

SIG Docs [批准人（Approvers）](/zh/docs/contribute/participate/roles-and-responsibilities/#approvers)
可以担任 SIG Docs 的联合主席。

### 前提条件

<!--
Approvers must meet the following requirements to be a co-chair:

- Have been a SIG Docs approver for at least 6 months
- Have [led a Kubernetes docs release](/docs/contribute/advanced/#coordinate-docs-for-a-kubernetes-release) or shadowed two releases
- Understand SIG Docs workflows and tooling: git, Hugo, localization, blog subproject
- Understand how other Kubernetes SIGs and repositories affect the SIG Docs workflow, including: [teams in k/org](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml), [process in k/community](https://github.com/kubernetes/community/tree/master/sig-docs), plugins in [k/test-infra](https://github.com/kubernetes/test-infra/), and the role of [SIG Architecture](https://github.com/kubernetes/community/tree/master/sig-architecture). 
- Commit at least 5 hours per week (and often more) to the role for a minimum of 6 months
-->
Approvers 必须满足以下要求才能成为联合主席：

- 已维持 SIG Docs approver 身份至少 6 个月
- [曾领导 Kubernetes 文档发布](/zh/docs/contribute/advanced/#coordinate-docs-for-a-kubernetes-release)
  或者在两个版本发布中有实习经历
- 理解 SIG Docs 工作流程和工具：git、Hugo、本地化、博客子项目
- 理解其他 Kubernetes SIG 和仓库会如何影响 SIG Docs 工作流程，包括：
  [k/org 中的团队](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml)、
  [k/community 中的流程](https://github.com/kubernetes/community/tree/master/sig-docs)、
  [k/test-infra](https://github.com/kubernetes/test-infra/) 中的插件、
  [SIG Architecture](https://github.com/kubernetes/community/tree/master/sig-architecture) 中的角色。 
- 在至少 6 个月的时段内，确保每周至少投入 5 个小时（通常更多）

<!--
### Responsibilities

The role of co-chair is primarily one of service: co-chairs handle process and policy, schedule and run meetings, schedule PR wranglers, and generally do the things that no one else wants to do in order to build contributor capacity. 

Responsibilities include:
-->
### 职责范围

联合主席主要提供以下服务：
联合主席负责处理流程和政策、时间安排和召开会议、安排 PR 管理员、以及一些其他人不想做的事情，目的是增长贡献者团队。

职责范围包括：

<!--
- Keep SIG Docs focused on maximizing developer happiness through excellent documentation
- Exemplify the [community code of conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) and hold SIG members accountable to it
- Learn and set best practices for the SIG by updating contribution guidelines
- Schedule and run SIG meetings: weekly status updates, quarterly retro/planning sessions, and others as needed
- Schedule and run doc sprints at KubeCon events and other conferences
- Recruit for and advocate on behalf of SIG Docs with the {{< glossary_tooltip text="CNCF" term_id="cncf" >}} and its platinum partners, including Google, Oracle, Azure, IBM, and Huawei
- Keep the SIG running smoothly
-->
- 保持 SIG Docs 专注于通过出色的文档最大限度地提高开发人员的满意度
- 以身作则，践行[社区行为准则](https://github.com/cncf/foundation/blob/master/code-of-conduct.md)，
  并要求 SIG 成员对自身行为负责
- 通过更新贡献指南，为 SIG 学习并设置最佳实践
- 安排和举行 SIG 会议：每周状态更新，每季度回顾/计划会议以及其他需要的会议
- 在 KubeCon 活动和其他会议上安排和负责文档工作
- 与 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 及其尊贵合作伙伴
  （包括 Google、Oracle、Azure、IBM 和华为）一起以 SIG Docs 的身份招募和宣传
- 负责 SIG 正常运行

<!--
### Running effective meetings

To schedule and run effective meetings, these guidelines show what to do, how to do it, and why.

**Uphold the [community code of conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md)**:

- Hold respectful, inclusive discussions with respectful, inclusive language.
-->
### 召开高效的会议

为了安排和召开高效的会议，这些指南说明了如何做、怎样做以及原因。

**坚持[社区行为准则](https://github.com/cncf/foundation/blob/master/code-of-conduct.md)**：

- 相互尊重地、包容地进行讨论。

<!--
**Set a clear agenda**:

- Set a clear agenda of topics
- Publish the agenda in advance

For weekly meetings, copypaste the previous week's notes into the "Past meetings" section of the notes
-->
**设定明确的议程**：

- 设定清晰的主题议程
- 提前发布议程

对于每周一次的会议，请将前一周的笔记复制并粘贴到笔记的“过去的会议”部分中

<!--
**Collaborate on accurate notes**:

- Record the meeting's discussion
- Consider delegating the role of note-taker

**Assign action items clearly and accurately**:

- Record the action item, who is assigned to it, and the expected completion date
-->
**通过协作，完成准确的记录**：

- 记录会议讨论
- 考虑委派笔记记录员的角色

**清晰准确地分配执行项目**：

- 记录操作项，分配给它的人员以及预期的完成日期

<!--
**Moderate as needed**:

- If discussion strays from the agenda, refocus participants on the current topic
- Make room for different discussion styles while keeping the discussion focused and honoring folks' time

**Honor folks' time**:

- Begin and end meetings punctually
-->
**根据需要来进行协调**：

- 如果讨论偏离议程，请让参与者重新关注当前主题
- 为不同的讨论风格留出空间，同时保持讨论重点并尊重人们的时间

**尊重大家的时间**:

- 准时开始和结束会议

<!--
**Use Zoom effectively**:

- Familiarize yourself with [Zoom guidelines for Kubernetes](https://github.com/kubernetes/community/blob/master/communication/zoom-guidelines.md)
- Claim the host role when you log in by entering the host key

<img src="/images/docs/contribute/claim-host.png" width="75%" alt="Claiming the host role in Zoom" />
-->
**有效利用 Zoom**：

- 熟悉 [ Kubernetes Zoom 指南](https://github.com/kubernetes/community/blob/master/communication/zoom-guidelines.md)
- 输入主持人密钥登录时声明主持人角色

<img src="/images/docs/contribute/claim-host.png" width="75%" alt="声明 Zoom 角色" />

<!--
### Recording meetings on Zoom

When you're ready to start the recording, click Record to Cloud.
    
When you're ready to stop recording, click Stop.

The video uploads automatically to YouTube.
-->
### 录制 Zoom 会议

准备开始录制时，请单击“录制到云”。

准备停止录制时，请单击“停止”。

视频会自动上传到 YouTube。

