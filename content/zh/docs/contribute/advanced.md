---
title: 高级贡献
slug: advanced
content_template: templates/concept
weight: 30
---

<!--
---
title: Advanced contributing
slug: advanced
content_template: templates/concept
weight: 30
---
-->

{{% capture overview %}}

<!--
This page assumes that you've read and mastered the
[Start contributing](/docs/contribute/start/) and
[Intermediate contributing](/docs/contribute/intermediate/) topics and are ready
to learn about more ways to contribute. You need to use the Git command line
client and other tools for some of these tasks.
-->

如果你已经阅读并掌握[开始贡献](/docs/contribute/start/)和[中级贡献](/docs/contribute/intermediate/)，并准备了解更多贡献的途径，请阅读此文。
您需要使用 Git 命令行工具和其他工具做这些工作。

{{% /capture %}}

{{% capture body %}}

<!--
## Be the PR Wrangler for a week
-->

## 做一周的 PR 管理者

<!--
SIG Docs [approvers](/docs/contribute/participating/#approvers) can be PR
wranglers.
-->

SIG Docs 的[审批者](/docs/contribute/participating/#approvers)可以成为 PR 管理者。

<!--
SIG Docs approvers are added to the
[PR Wrangler rotation scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers)
for weekly rotations. The PR wrangler's duties include:
-->

SIG Docs 的审批者会每周轮换地加入到 [PR 管理者轮换日程](https://github.com/kubernetes/website/wiki/PR-Wranglers)中。
PR 管理者的工作职责包括：

<!--
- Review incoming pull requests daily.
  - Help new contributors sign the CLA, and close any PR where the CLA hasn't
    been signed for two weeks. PR authors can reopen the PR after signing the
    CLA, so this is a low-risk way to make sure nothing gets merged without a
    signed CLA.
  - Provide feedback on proposed changes, including helping facilitate technical
    review from members of other SIGs.
  - Merge PRs when they are ready, or close PRs that shouldn't be accepted.
- Triage and tag incoming issues daily. See
  [Intermediate contributing](/docs/contribute/intermediate/) for guidelines
  about how SIG Docs uses metadata.
-->

- 每天评审新增的 PR
  - 指导新的贡献者签署 CLA，关闭两周都没有签署 CLA 的提交人的 PR。
    PR 提交人在签署 CLA 之后可以重启 PR，所以 PR 管理者需要保证这段时间内相关文件没有合入。
  - 对改进建议的更新提供反馈信息，包括促成其他 SIG 成员的技术性评审。
  - 合入符合要求的 PR，关闭不符合要求的 PR。
- 每天筛选和标记新增的 issue。参见[中级贡献](/docs/contribute/intermediate/)中有关 SIG Docs 成员使用 metadata 的指南。

<!--
## Propose improvements
-->

## 提出改进建议

<!--
SIG Docs
[members](/docs/contribute/participating/#members) can propose improvements.
-->

SIG Docs 的[成员](/docs/contribute/participating/#members)可以提出改进建议。

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

SIG Docs 的[审批者](/docs/contribute/participating/#approvers)可以为 Kubernetes 版本发布协调文档。

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
-->

- 通过特性跟踪表来监视新功能特性或现有功能特性的修改。如果版本的某个功能特性的文档没有为发布做好准备，那么该功能特性不允许进入发布版本。

<!--
- Attend sig-release meetings regularly and give updates on the status of the
  docs for the release.
-->

- 定期参加 sig-release 会议并对文档状态进行更新。

<!--
- Review and copyedit feature documentation drafted by the SIG responsible for
  implementing the feature.
-->

- 评审和修改由负责实现某功能特性的 SIG 起草的功能特性文档。

<!--
- Merge release-related pull requests and maintain the Git feature branch for
  the release.
-->

- 合入版本发布相关的 PR，并为对应发布版本维护 Git 特性分支。

<!--
- Mentor other SIG Docs contributors who want to learn how to do this role in
  the future. This is known as "shadowing".
-->

- 指导那些想学习并有意愿担当该角色的 SIG Docs 贡献者。这就是我们常说的“实习”。

<!--
- Publish the documentation changes related to the release when the release
  artifacts are published.
-->

- 发布版本的制品发布时，相关的文档更新也需要发布。

<!--
Coordinating a release is typically a 3-4 month commitment, and the duty is
rotated among SIG Docs approvers.
-->

协调一个版本发布通常需要 3-4 个月的时间投入，该任务由 SIG Docs 审批者轮流承担。

<!--
## Sponsor a new contributor
-->

## 保荐新的贡献者

<!--
SIG Docs [reviewers](/docs/contribute/participating/#reviewers) can sponsor
new contributors.
-->

SIG Docs 的[评审者](/docs/contribute/participating/#reviewers)可以保荐新的贡献者。

<!--
After a new contributor has successfully submitted 5 substantive pull requests
to one or more Kubernetes repositiries, they are eligible to apply for
[membership](/docs/contribute/participating#members) in the Kubernetes
organization. The contributor's membership needs to be backed by two sponsors
who are already reviewers.
-->

新的贡献者针对一个或多个 Kubernetes 项目仓库成功提交了 5 个实质性 PR 之后，就有资格申请 Kubernetes 组织[成员](/docs/contribute/participating#members)。贡献者的成员资格需要同时得到两位评审者的保荐。

<!--
New docs contributors can request sponsors by asking in the #sig-docs channel
on the [Kubernetes Slack instance](https://kubernetes.slack.com) or on the
[SIG Docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
If you feel confident about the applicant's work, you volunteer to sponsor them.
When they submit their membership application, reply to the application with a
"+1" and include details about why you think the applicant is a good fit for
membership in the Kubernetes organization.
-->

新的文档贡献者可以通过咨询 [Kubernetes Slack instance](https://kubernetes.slack.com) 上的 #sig-docs 或 [SIG Docs 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs) 来请求评审者保荐。如果你对申请人的工作充满信心，你自愿保荐他们。当他们提交成员资格申请时，回复“+1”并详细说明为什么你认为申请人适合加入 Kubernetes 组织。

{{% /capture %}}

