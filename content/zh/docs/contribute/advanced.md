---
title: 高级贡献
slug: advanced
content_type: concept
weight: 30
---
<!--
---
title: Advanced contributing
slug: advanced
content_type: concept
weight: 30
---
-->

<!-- overview -->

<!--
This page assumes that you've read and mastered the
[Start contributing](/docs/contribute/start/) and
[Intermediate contributing](/docs/contribute/intermediate/) topics and are ready
to learn about more ways to contribute. You need to use the Git command line
client and other tools for some of these tasks.
-->
如果你已经阅读并掌握[开始贡献](/docs/contribute/start/)和[中级贡献](/docs/contribute/intermediate/)，并准备了解更多贡献的途径，请阅读此文。您需要使用 Git 命令行工具和其他工具做这些工作。



<!-- body -->

<!--
## Be the PR Wrangler for a week
-->
## 做一周的 PR 管理者

<!--
SIG Docs [approvers](/docs/contribute/participating/#approvers) take regular turns as the PR wrangler for the repository and are added to the [PR Wrangler rotation scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers#2019-schedule-q1q2) for weekly rotations.
-->
SIG Docs 的 [approvers](/docs/contribute/participating/#approvers) 可以成为 PR 管理者。SIG Docs approvers 会每周轮换地加入到 [PR 管理者轮换日程](https://github.com/kubernetes/website/wiki/PR-Wranglers#2019-schedule-q1q2)中。

<!--
The PR wrangler’s duties include:
-->
PR 管理者的工作职责包括：

<!--
- Review [open pull requests](https://github.com/kubernetes/website/pulls) daily for quality and adherence to the [style guide](/docs/contribute/style/style-guide/).
    - Review the smallest PRs (`size/XS`) first, then iterate towards the largest (`size/XXL`).
    - Review as many PRs as you can.
- Ensure that the CLA is signed by each contributor.
    - Help new contributors sign the [CLA](https://github.com/kubernetes/community/blob/master/CLA.md).
    - Use [this](https://github.com/zparnold/k8s-docs-pr-botherer) script to automatically remind contributors that haven’t signed the CLA to sign the CLA.
- Provide feedback on proposed changes and help facilitate technical reviews from members of other SIGs.
    - Provide inline suggestions on the PR for the proposed content changes.
    - If you need to verify content, comment on the PR and request more details.
    - Assign relevant `sig/` label(s).
    - If needed, assign reviewers from the `reviewers:` block in the file's front matter.
    - Assign `Docs Review` and `Tech Review` labels to indicate the PR's review status.
    - Assign `Needs Doc Review` or `Needs Tech Review` for PRs that haven't yet been reviewed.
    - Assign `Doc Review: Open Issues` or `Tech Review: Open Issues` for PRs that have been reviewed and require further input or action before merging.
    - Assign `/lgtm` and `/approve` labels to PRs that can be merged. 
- Merge PRs when they are ready, or close PRs that shouldn’t be accepted.
- Triage and tag incoming issues daily. See [Intermediate contributing](/docs/contribute/intermediate/) for guidelines on how SIG Docs uses metadata.
-->
- 每天检查[悬决的 PR](https://github.com/kubernetes/website/pulls) 的质量并确保它们遵守[风格指南]](/docs/contribute/style/style-guide/)。
    - 首先查看最小的 PR（`size/XS`），然后逐渐扩展到最大的 PR（`size/XXL`）。
    - 尽可能多地审阅 PR。
- 确保每个贡献者完成 CLA 签署。
    - 指导新的贡献者签署 [CLA](https://github.com/kubernetes/community/blob/master/CLA.md)。
    - 使用[此脚本](https://github.com/zparnold/k8s-docs-pr-botherer)自动提醒尚未签署 CLA 的贡献者签署 CLA。
- 针对所建议的更改提供反馈，并帮助协调其他 SIG 成员进行技术审核。
    - 为 PR 所建议的内容更改提供在线反馈。
    - 如果您需要验证内容，请在 PR 上发表评论并要求贡献者提供更多细节。
    - 设置相关的 `sig/` 标签。
    - 如果需要，请从文件开头的 `reviewers:` 块中指定审阅者。
    - 设置 `Docs Review` 和 `Tech Review` 标签以标示 PR 的审阅状态。
    - 为尚未审阅的 PR 设置 `Needs Doc Review` 或者 `Needs Tech Review` 标签。
    - 为已审阅的但在合并前需要更多信息的或采取措施的 PR 设置 `Doc Review: Open Issues` 或者 `Tech Review: Open Issues` 标签。
    - 为可以合并的 PR 添加 `/lgtm` 和 `/approve` 标签。
- 合并已经就绪的，或关闭不应该接受的 PR。
- 每天对新增的 issues 进行分类和标记。有关 SIG 文档如何使用 metadata 的准则，请参见[中级贡献](/docs/contribute/intermediate/)。

<!--
### Helpful GitHub queries for wranglers

The following queries are helpful when wrangling. After working through these three queries, the remaining list of PRs to be
reviewed is usually small. These queries specifically exclude localization PRs, and only include the `master` branch (except for the last one).
-->
### 对于负责人有用的 GitHub 查询

执行管理操作时，以下查询很有用。完成以下三个查询后，剩余的要审阅的 PR 列表通常很小。

<!--
- [No CLA, not eligible to merge](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge+label%3Alanguage%2Fen):
  Remind the contributor to sign the CLA. If they have already been reminded by both the bot and a human, close
  the PR and remind them that they can open it after signing the CLA.
  **Do not review PRs whose authors have not signed the CLA!**
- [Needs LGTM](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+-label%3Algtm+):
  If it needs technical review, loop in one of the reviewers suggested by the bot. If it needs docs review
  or copy-editing, either suggest changes or add a copyedit commit to the PR to move it along.
- [Has LGTM, needs docs approval](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+label%3Algtm):
  Determine whether any additional changes or updates need to be made for the PR to be merged. If you think the PR is ready to be merged, comment `/approve`.
- [Not against master](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+-base%3Amaster): If it's against a `dev-` branch, it's for an upcoming release. Make sure the [release meister](https://github.com/kubernetes/sig-release/tree/master/release-team) knows about it by adding a comment with `/assign @<meister's_github-username>`. If it's against an old branch, help the PR author figure out whether it's targeted against the best branch.
-->
- [没有签署 CLA, 不能 merge](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge+label%3Alanguage%2Fen):
  提醒贡献者签署 CLA。如果机器人和审阅者都已经提醒他们，请关闭 PR，并提醒他们在签署 CLA 后可以重新提交。
  **在作者没有签署 CLA 之前，不要审阅他们的 PR！**
- [需要 LGTM](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+-label%3Algtm+):
  如果需要技术审查，请告知机器人所建议的审阅者。如果 PR 需要文档审查或复制编辑，提交更改建议或向 PR 提交一个 copyedit 以使之进入下一步。
- [有 LGTM ，需要批准](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+label%3Algtm):
  确定 PR 是否需要进行其他更改或更新才能合并。如果您认为 PR 已准备好合并，请输入 `/approve`。
- [非 master 分支的 PR](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+-base%3Amaster)：
  如果 PR 针对 `dev-` 分支，则表示它适用于即将发布的版本。请添加带有 `/assign @<负责人的 github 账号>` 的注释，确保[发行版本负责人](https://github.com/kubernetes/sig-release/tree/master/release-team)注意到该 PR。如果 PR 是针对旧分支，请帮助 PR 作者确定是否所针对的是最合适的分支。

<!--
### When to close Pull Requests

Reviews and approvals are one tool to keep our PR queue short and current. Another tool is closure.
-->
### 什么时候关闭 PR

审查和批准是缩短和更新我们的 PR 队列的一种方式；另一种方式是关闭 PR。

<!--
- Close any PR where the CLA hasn’t been signed for two weeks. 
PR authors can reopen the PR after signing the CLA, so this is a low-risk way to make sure nothing gets merged without a signed CLA.

- Close any PR where the author has not responded to comments or feedback in 2 or more weeks.

Don't be afraid to close pull requests. Contributors can easily reopen and resume works in progress. Oftentimes a closure notice is what spurs an author to resume and finish their contribution.

To close a pull request, leave a `/close` comment on the PR.
-->
- 关闭两个星期未签署 CLA 的 PR。
PR 作者可以在签署 CLA 后重新打开 PR，因此这是确保未签署 CLA 的 PR 不会被合并的一种风险较低的方法。

- 如果作者在两周或更长时间内未回复评论或反馈，请关闭 PR。

不要害怕关闭 PR。贡献者可以轻松地重新打开并继续工作。通常，关闭通知会激励作者继续完成其贡献。

要关闭 PR，请在 PR 上输入 `/close`。

{{< note >}}

<!--
An automated service, [`fejta-bot`](https://github.com/fejta-bot) automatically marks issues as stale after 90 days of inactivity, then closes them after an additional 30 days of inactivity when they become rotten. PR wranglers should close issues after 14-30 days of inactivity.
-->
一项名为 [`fejta-bot`](https://github.com/fejta-bot) 的自动服务会在 issues 停滞 90 天后会自动将其标记为过期；然后再等 30 天，如果仍然无人过问，则将其关闭。PR 管理者应该在 issues 处于无人过问状态 14-30 天后关闭它们。

{{< /note >}}

<!--
## Propose improvements

SIG Docs
[members](/docs/contribute/participating/#members) can propose improvements.
-->
## 提出改进建议

SIG Docs 的 [成员](/docs/contribute/participating/#members) 可以提出改进建议。

<!--
After you've been contributing to the Kubernetes documentation for a while, you
may have ideas for improvement to the style guide, the toolchain used to build
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
在对 Kubernetes 文档贡献了一段时间后，你可能会对样式指南、用于构建文档的工具链、网页样式、评审和合入 PR 的流程，或者文档的其他方面产生改进的想法。为了尽可能透明化，这些提议都需要在 SIG Docs 会议或 [kubernetes-sig-docs 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)上讨论。此外，在提出全面的改进之前，它能真正帮助我们了解有关“当前工作如何运作”和“以往的决定是为何做出”的背景。想了解文档的当前运作方式，最快的途径是咨询 [kubernetes.slack.com](https://kubernetes.slack.com) 中的 `#sig-docs` 聊天群组。

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
-->
## 为 Kubernetes 版本发布协调文档

<!--
SIG Docs [approvers](/docs/contribute/participating/#approvers) can coordinate
docs for a Kubernetes release.
-->
SIG Docs 的[批准者（approvers）](/docs/contribute/participating/#approvers) 可以为 Kubernetes 版本发布协调文档。

<!--
Each Kubernetes release is coordinated by a team of people participating in the
sig-release Special Interest Group (SIG). Others on the release team for a given
release include an overall release lead, as well as representatives from sig-pm,
sig-testing, and others. To find out more about Kubernetes release processes,
refer to
[https://github.com/kubernetes/sig-release](https://github.com/kubernetes/sig-release).
-->
每一个 Kubernetes 版本都是由参与 sig-release 的 SIG（特别兴趣小组）的一个团队协调的。指定版本的发布团队中还包括总体发布牵头人，以及来自 sig-pm、sig-testing 的代表等。了解更多关于 Kubernetes 版本发布的流程，请参考 [https://github.com/kubernetes/sig-release](https://github.com/kubernetes/sig-release)。

<!--
The SIG Docs representative for a given release coordinates the following tasks:
-->
SIG Docs 团队的代表需要为一个指定的版本协调以下工作：

<!--
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
- 通过特性跟踪表来监视新功能特性或现有功能特性的修改。如果版本的某个功能特性的文档没有为发布做好准备，那么该功能特性不允许进入发布版本。
- 定期参加 sig-release 会议并汇报文档的发布状态。
- 评审和修改由负责实现某功能特性的 SIG 起草的功能特性文档。
- 合入版本发布相关的 PR，并为对应发布版本维护 Git 特性分支。
- 指导那些想学习并有意愿担当该角色的 SIG Docs 贡献者。这就是我们常说的“实习”。
- 发布版本的组件发布时，相关的文档更新也需要发布。

<!--
Coordinating a release is typically a 3-4 month commitment, and the duty is
rotated among SIG Docs approvers.
-->
协调一个版本发布通常需要 3-4 个月的时间投入，该任务由 SIG Docs approvers 轮流承担。

<!--
## Serve as a New Contributor Ambassador
-->
## 担任新的贡献者大使

<!--
SIG Docs [approvers](/docs/contribute/participating/#approvers) can serve as
New Contributor Ambassadors. 

New Contributor Ambassadors work together to welcome new contributors to SIG-Docs, 
suggest PRs to new contributors, and mentor new contributors through their first
few PR submissions.

Responsibilities for New Contributor Ambassadors include:
-->
SIG Docs [approvers](/docs/contribute/participating/#approvers) 可以担任新的贡献者大使。

新的贡献者大使共同努力欢迎 SIG-Docs 的新贡献者，对新贡献者的 PR 提出建议，以及在前几份 PR 提交中指导新贡献者。

新的贡献者大使的职责包括：

<!--
- Being available on the [Kubernetes #sig-docs channel](https://kubernetes.slack.com) to answer questions from new contributors.
- Working with PR wranglers to identify good first issues for new contributors. 
- Mentoring new contributors through their first few PRs to the docs repo. 
- Helping new contributors create the more complex PRs they need to become Kubernetes members.
- [Sponsoring contributors](/docs/contribute/advanced/#sponsor-a-new-contributor) on their path to becoming Kubernetes members.
-->
- 可在 [Kubernetes #sig-docs 频道](https://kubernetes.slack.com) 上回答新贡献者的问题。
- 与 PR 管理者合作为新参与者寻找合适的第一个 issues。 
- 通过前几个 PR 指导新贡献者到文档存储库。 
- 帮助新的贡献者创建成为 Kubernetes 成员所需的更复杂的 PR。
- [为贡献者提供担保](/docs/contribute/advanced/#sponsor-a-new-contributor)，使其成为 Kubernetes 成员。

<!--
Current New Contributor Ambassadors are announced at each SIG-Docs meeting, and in the [Kubernetes #sig-docs channel](https://kubernetes.slack.com).
-->
当前新贡献者大使将在每次 SIG 文档会议上以及 [Kubernetes #sig-docs 频道](https://kubernetes.slack.com)中宣布。

<!--
## Sponsor a new contributor
-->
## 为新的贡献者提供担保

<!--
SIG Docs [reviewers](/docs/contribute/participating/#reviewers) can sponsor
new contributors.
-->
SIG Docs 的 [reviewers](/docs/contribute/participating/#reviewers) 可以为新的贡献者提供担保。

<!--
After a new contributor has successfully submitted 5 substantive pull requests
to one or more Kubernetes repositories, they are eligible to apply for
[membership](/docs/contribute/participating#members) in the Kubernetes
organization. The contributor's membership needs to be backed by two sponsors
who are already reviewers.
-->
新的贡献者针对一个或多个 Kubernetes 项目仓库成功提交了 5 个实质性 PR 之后，就有资格申请 Kubernetes 组织 [成员身份](/docs/contribute/participating#members)。贡献者的成员资格需要同时得到两位 reviewers 的保荐。

<!--
New docs contributors can request sponsors by asking in the #sig-docs channel
on the [Kubernetes Slack instance](https://kubernetes.slack.com) or on the
[SIG Docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
If you feel confident about the applicant's work, you volunteer to sponsor them.
When they submit their membership application, reply to the application with a
"+1" and include details about why you think the applicant is a good fit for
membership in the Kubernetes organization.
-->
新的文档贡献者可以通过咨询 [Kubernetes Slack 实例](https://kubernetes.slack.com) 上的 #sig-docs 频道或者 [SIG Docs 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)来请求评审者保荐。如果你对申请人的工作充满信心，你自愿保荐他们。当他们提交成员资格申请时，回复 “+1” 并详细说明为什么你认为申请人适合加入 Kubernetes 组织。

<!--
## Serve as a SIG Co-chair

SIG Docs [approvers](/docs/contribute/participating/#approvers) can serve a term as a co-chair of SIG Docs.

### Prerequisites
-->
## 担任 SIG 联合主席

SIG Docs [approvers](/docs/contribute/participating/#approvers) 可以担任 SIG Docs 的联合主席。

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
- [曾领导 Kubernetes 文档发布](/docs/contribute/advanced/#coordinate-docs-for-a-kubernetes-release) 或者在两个版本发布中有实习经历
- 理解 SIG Docs 工作流程和工具：git、Hugo、本地化、博客子项目
- 理解其他 Kubernetes SIG 和仓库会如何影响 SIG Docs 工作流程，包括：[k/org 中的团队](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml)、[k/community 中的流程](https://github.com/kubernetes/community/tree/master/sig-docs)、[k/test-infra](https://github.com/kubernetes/test-infra/) 中的插件、[SIG Architecture](https://github.com/kubernetes/community/tree/master/sig-architecture) 中的角色。 
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
- 以身作则，践行[社区行为准则](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) 并要求 SIG 成员对自身行为负责
- 通过更新贡献准则，为 SIG 学习并设置最佳实践
- 安排和举行 SIG 会议：每周状态更新，每季度回顾/计划会议以及其他需要的会议
- 在 KubeCon 活动和其他会议上安排和负责文档工作
- 与 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 及其尊贵合作伙伴（包括 Google、Oracle、Azure、IBM 和华为）一起以 SIG Docs 的身份招募和宣传
- 负责 SIG 正常运行

<!--
### Running effective meetings

To schedule and run effective meetings, these guidelines show what to do, how to do it, and why.

**Uphold the [community code of conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md)**:

- Hold respectful, inclusive discussions with respectful, inclusive language.
-->
### 召开高效的会议

为了安排和召开高效的会议，这些准则说明了如何做、怎样做以及原因。

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

When you’re ready to start the recording, click Record to Cloud.
    
When you’re ready to stop recording, click Stop.

The video uploads automatically to YouTube.
-->
### 录制 Zoom 会议

准备开始录制时，请单击“录制到云”。

准备停止录制时，请单击“停止”。

视频会自动上传到 YouTube。


