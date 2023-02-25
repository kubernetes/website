---
title: 角色与责任
content_type: concept
weight: 10
---

<!-- overview -->

<!--
Anyone can contribute to Kubernetes. As your contributions to SIG Docs grow, you can apply for different levels of membership in the community.
These roles allow you to take on more responsibility within the community.
Each role requires more time and commitment. The roles are:

- Anyone: regular contributors to the Kubernetes documentation
- Members: can assign and triage issues and provide non-binding review on pull requests
- Reviewers: can lead reviews on documentation pull requests and can vouch for a change's quality
- Approvers: can lead reviews on documentation and  merge changes
-->
任何人都可以为 Kubernetes 作出贡献。随着你对 SIG Docs 的贡献增多，你可以申请
社区内不同级别的成员资格。
这些角色使得你可以在社区中承担更多的责任。
每个角色都需要更多的时间和投入。具体包括：

- 任何人（Anyone）：为 Kubernetes 文档作出贡献的普通贡献者。
- 成员（Members）：可以对 Issue 进行分派和判别，对 PR 提出无约束性的评审意见。
- 评审人（Reviewers）：可以领导对文档 PR 的评审，可以对变更的质量进行判别。
- 批准人（Approvers）：可以领导对文档的评审并合并变更。

<!-- body -->

<!--
## Anyone

Anyone with a GitHub account can contribute to Kubernetes. SIG Docs welcomes all new contributors!

Anyone can:

- Open an issue in any [Kubernetes](https://github.com/kubernetes/) repository, including [`kubernetes/website`](https://github.com/kubernetes/website)
- Give non-binding feedback on a pull request
- Contribute to a localization
- Suggest improvements on [Slack](http://slack.k8s.io/) or the [SIG docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

After [signing the CLA](https://github.com/kubernetes/community/blob/master/CLA.md), anyone can also:

- Open a pull request to improve existing content, add new content, or write a blog post or case study
- Create diagrams, graphics assets, and embeddable screencasts and videos

For more information, see [contributing new content](/docs/contribute/new-content/).
-->
## 任何人（Anyone）  {#anyone}

任何拥有 GitHub 账号的人都可以对 Kubernetes 作出贡献。SIG Docs
欢迎所有新的贡献者。

任何人都可以：

- 在任何 [Kubernetes](https://github.com/kubernetes/) 仓库，包括
  [`kubernetes/website`](https://github.com/kubernetes/website) 上报告 Issue。
- 对某 PR 给出无约束力的反馈信息
- 为本地化提供帮助
- 在 [Slack](https://slack.k8s.io/) 或
  [SIG Docs 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
  上提出改进建议。

在[签署了 CLA](https://github.com/kubernetes/community/blob/master/CLA.md) 之后，任何人还可以：

- 发起拉取请求（PR），改进现有内容、添加新内容、撰写博客或者案例分析
- 创建示意图、图形资产或者嵌入式的截屏和视频内容

进一步的详细信息，可参见[贡献新内容](/zh-cn/docs/contribute/new-content/)。

<!--
## Members

A member is someone who has submitted multiple pull requests to `kubernetes/website`. Members are a part of the [Kubernetes GitHub organization](https://github.com/kubernetes).

Members can:

- Do everything listed under [Anyone](#anyone)
- Use the `/lgtm` comment to add the LGTM (looks good to me) label to a pull request

    {{< note >}}
    Using `/lgtm` triggers automation. If you want to provide non-binding approval, commenting "LGTM" works too!
    {{< /note >}}
- Use the `/hold` comment to block merging for a pull request
- Use the `/assign` comment to assign a reviewer to a pull request
- Provide non-binding review on pull requests
- Use automation to triage and categorize issues
- Document new features
-->
## 成员（Members）  {#members}

成员是指那些对 `kubernetes/website` 提交很多拉取请求（PR）的人。
成员都要加入 [Kubernetes GitHub 组织](https://github.com/kubernetes)。

成员可以：

- 执行[任何人](#anyone)节区所列举操作
- 使用 `/lgtm` 评论添加 LGTM (looks good to me（我觉得可以）) 标签到某个 PR

  {{< note >}}
  使用 `/lgtm` 会触发自动化机制。如果你希望提供非约束性的批准意见，
  直接回复 "LGTM" 也是可以的。
  {{< /note >}}

- 利用 `/hold` 评论来阻止某个 PR 被合并
- 使用 `/assign` 评论为某个 PR 指定评审人
- 对 PR 提供非约束性的评审意见
- 使用自动化机制来对 Issue 进行判别和分类
- 为新功能特性撰写文档

<!--
### Becoming a member

After submitting at least 5 substantial pull requests and meeting the other [requirements](https://github.com/kubernetes/community/blob/master/community-membership.md#member):
-->
### 成为一个成员 {#becoming-a-member}

在你成功地提交至少 5 个 PR 并满足
[相关条件](https://github.com/kubernetes/community/blob/master/community-membership.md#member)
之后：

<!--
1.  Find two [reviewers](#reviewers) or [approvers](#approvers) to [sponsor](/docs/contribute/advanced#sponsor-a-new-contributor) your membership.

    Ask for sponsorship in the [#sig-docs channel on Slack](https://kubernetes.slack.com) or on the
    [SIG Docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

    {{< note >}}
    Don't send a direct email or Slack direct message to an individual
    SIG Docs member. You must request sponsorship before submitting your application.
    {{< /note >}}

2.  Open a GitHub issue in the [`kubernetes/org`](https://github.com/kubernetes/org/) repository. Use the **Organization Membership Request** issue template.
-->
1. 找到两个[评审人](#reviewers)或[批准人](#approvers)为你的成员身份提供
   [担保](/zh-cn/docs/contribute/advanced#sponsor-a-new-contributor)。

   通过 [Kubernetes Slack 上的 #sig-docs 频道](https://kubernetes.slack.com) 或者
   [SIG Docs 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
   来寻找为你担保的人。

   {{< note >}}
   不要单独发送邮件给某个 SIG Docs 成员或在 Slack 中与其私聊。
   在提交申请之前，一定要先确定担保人。
   {{< /note >}}

2. 在 [`kubernetes/org`](https://github.com/kubernetes/org/) 仓库
   使用 **Organization Membership Request** Issue 模板登记一个 Issue。

<!--
3.  Let your sponsors know about the GitHub issue. You can either:
  - Mention their GitHub username in an issue (`@<GitHub-username>`)
  - Send them the issue link using Slack or email.

    Sponsors will approve your request with a `+1` vote. Once your sponsors approve the request, a Kubernetes GitHub admin adds you as a member. Congratulations!

    If your membership request is not accepted you will receive feedback. After addressing the feedback, apply again.

4. Accept the invitation to the Kubernetes GitHub organization in your email account.

    {{< note >}}
    GitHub sends the invitation to the default email address in your account.
    {{< /note >}}
-->
3. 告知你的担保人你所创建的 Issue，你可以：

   - 在 Issue 中 `@<GitHub-username>` 提及他们的 GitHub 用户名
   - 通过 Slack 或 email 直接发送给他们 Issue 链接
 
   担保人会通过 `+1` 投票来批准你的请求。一旦你的担保人批准了该请求，
   某个 Kubernetes GitHub 管理员会将你添加为组织成员。恭喜！

   如果你的成员请求未被接受，你会收到一些反馈。
   当处理完反馈意见之后，可以再次发起申请。

4. 登录你的邮件账户，接受来自 Kubernetes GitHub 组织发出的成员邀请。

    {{< note >}}
    GitHub 会将邀请发送到你的账户中所设置的默认邮件地址。
    {{< /note >}}

<!--
## Reviewers

Reviewers are responsible for reviewing open pull requests. Unlike member 
feedback, the PR author must address reviewer feedback. Reviewers are members of the 
[@kubernetes/sig-docs-{language}-reviews](https://github.com/orgs/kubernetes/teams?query=sig-docs) 
GitHub team.

Reviewers can:

- Do everything listed under [Anyone](#anyone) and [Members](#members)
- Review pull requests and provide binding feedback

    {{< note >}}
    To provide non-binding feedback, prefix your comments with a phrase like "Optionally: ".
    {{< /note >}}

- Edit user-facing strings in code
- Improve code comments

You can be a SIG Docs reviewer, or a reviewer for docs in a specific subject area.
-->
## 评审人（Reviewers）  {#reviewers}

评审人负责评审悬决的 PR。
与成员所给的反馈不同，身为 PR 作者必须处理评审人的反馈。
评审人是 [@kubernetes/sig-docs-{language}-reviews](https://github.com/orgs/kubernetes/teams?query=sig-docs) GitHub 团队的成员。

评审人可以：

- 执行[任何人](#anyone)和[成员](#members)节区所列举的操作
- 评审 PR 并提供具约束性的反馈信息

    {{< note >}}
    要提供非约束性的反馈，可以在你的评语之前添加 "Optionally: " 这样的说法。
    {{< /note >}}

- 编辑代码中用户可见的字符串
- 改进代码注释

你可以是 SIG Docs 的评审人，也可以是某个主题领域的文档的评审人。

<!--
### Assigning reviewers to pull requests

Automation assigns reviewers to all pull requests. You can request a
review from a specific person by commenting: `/assign
[@_github_handle]`.

If the assigned reviewer has not commented on the PR, another reviewer can step in. You can also assign technical reviewers as needed.

### Using `/lgtm`

LGTM stands for "Looks good to me" and indicates that a pull request is technically accurate and ready to merge. All PRs need a `/lgtm` comment from a reviewer and a `/approve` comment from an approver to merge.

A `/lgtm` comment from reviewer is binding and triggers automation that adds the `lgtm` label.
-->
### 为 PR 指派评审人  {#assigning-reviewers-to-pull-requests}

自动化引擎会为每个 PR 自动指派评审人。
你可以通过为 PR 添加评论 `/assign [@_github_handle]` 来请求某个特定评审人来评审。

如果所指派的评审人未能及时评审，其他的评审人也可以参与进来。
你可以根据需要指派技术评审人。

### 使用 `/lgtm`   {#using-lgtm}

LGTM 代表的是 “Looks Good To Me （我觉得可以）”，用来标示某个 PR
在技术上是准确的，可以被合并。
所有 PR 都需要来自某评审人的 `/lgtm` 评论和来自某批准人的 `/approve`
评论。

来自评审人的 `/lgtm` 评论是具有约束性的，会触发自动化引擎添加 `lgtm` 标签。

<!--
### Becoming a reviewer

When you meet the
[requirements](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer), you can become a SIG Docs reviewer. Reviewers in other SIGs must apply separately for reviewer status in SIG Docs.

To apply:
-->
### 成为评审人   {#becoming-a-reviewer}

当你满足[相关条件](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer)时，
你可以成为一个 SIG Docs 评审人。
来自其他 SIG 的评审人必须为 SIG Docs 单独申请评审人资格。

申请流程如下：

<!--
1. Open a pull request that adds your GitHub username to a section of the
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES) file
in the `kubernetes/website` repository.

  {{< note >}}
  If you aren't sure where to add yourself, add yourself to `sig-docs-en-reviews`.
  {{< /note >}}

2. Assign the PR to one or more SIG-Docs approvers (usernames listed under `sig-docs-{language}-owners`).

If approved, a SIG Docs lead adds you to the appropriate GitHub team. Once added,
[@k8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home) assigns and suggests you as a reviewer on new pull requests.
-->
1. 发起 PR，将你的 GitHub 用户名添加到 `kubernetes/website` 仓库中
   [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
   文件的对应节区。

   {{< note >}}
   如果你不确定要添加到哪个位置，可以将自己添加到 `sig-docs-en-reviews`。
   {{< /note >}}

2. 将 PR 指派给一个或多个 SIG Docs 批准人（`sig-docs-{language}-owners`
   下列举的用户名）。

申请被批准之后，SIG Docs Leads 之一会将你添加到合适的 GitHub 团队。
一旦添加完成，[@k8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
会在处理未来的 PR 时，将 PR 指派给你或者建议你来评审某 PR。

<!--
## Approvers

Approvers review and approve pull requests for merging. Approvers are members of the
[@kubernetes/sig-docs-{language}-owners](https://github.com/orgs/kubernetes/teams/?query=sig-docs) GitHub teams.

-->
## 批准人（Approvers）   {#approvers}

批准人负责评审和批准 PR 以将其合并。
批准人是 [@kubernetes/sig-docs-{language}-owners](https://github.com/orgs/kubernetes/teams/?query=sig-docs) GitHub 团队的成员。

<!--
Approvers can do the following:

- Everything listed under [Anyone](#anyone), [Members](#members) and [Reviewers](#reviewers)
- Publish contributor content by approving and merging pull requests using the `/approve` comment
- Propose improvements to the style guide
- Propose improvements to docs tests
- Propose improvements to the Kubernetes website or other tooling

If the PR already has a `/lgtm`, or if the approver also comments with `/lgtm`, the PR merges automatically. A SIG Docs approver should only leave a `/lgtm` on a change that doesn't need additional technical review.
-->
批准人可以执行以下操作：

- 执行列举在[任何人](#anyone)、[成员](#members)和[评审人](#reviewers)节区的操作
- 通过使用 `/approve` 评论来批准、合并 PR，发布贡献者所贡献的内容。
- 就样式指南给出改进建议
- 对文档测试给出改进建议
- 对 Kubernetes 网站或其他工具给出改进建议

如果某个 PR 已有 `/lgtm` 标签，或者批准人再回复一个 `/lgtm`，则这个 PR 会自动合并。
SIG Docs 批准人应该只在不需要额外的技术评审的情况下才可以标记 `/lgtm`。

<!--
### Approving pull requests

Approvers and SIG Docs leads are the only ones who can merge pull requests into the website repository. This comes with certain responsibilities.

- Approvers can use the `/approve` command, which merges PRs into the repo.

    {{< warning >}}
    A careless merge can break the site, so be sure that when you merge something, you mean it.
    {{< /warning >}}

- Make sure that proposed changes meet the 
[documentation content guide](/docs/contribute/style/content-guide/).

    If you ever have a question, or you're not sure about something, feel free to call for additional review.
-->
### 批准 PR   {#approving-pull-requests}

只有批准人和 SIG Docs Leads 可以将 PR 合并到网站仓库。
这意味着以下责任：

- 批准人可以使用 `/approve` 命令将 PR 合并到仓库中。

    {{< warning >}}
    不小心的合并可能会破坏整个站点。在执行合并操作时，务必小心。
    {{< /warning >}}

- 确保所提议的变更满足[文档内容指南](/zh-cn/docs/contribute/style/content-guide/)要求。

    如果有问题或者疑惑，可以根据需要请他人帮助评审。

- 在 `/approve` PR 之前，须验证 Netlify 测试是否正常通过。

    <img src="/images/docs/contribute/netlify-pass.png" width="75%" alt="批准之前必须通过 Netlify 测试" />

- 在批准之前，请访问 Netlify 的页面预览来确保变更内容可正常显示。

- 参与 [PR 管理者轮值排班](https://github.com/kubernetes/website/wiki/PR-Wranglers)
  执行时长为一周的 PR 管理。SIG Docs 期望所有批准人都参与到此轮值工作中。
  更多细节可参见 [PR 管理者](/zh-cn/docs/contribute/participate/pr-wranglers/)。

<!--
### Becoming an approver

When you meet the [requirements](https://github.com/kubernetes/community/blob/master/community-membership.md#approver), you can become a SIG Docs approver. Approvers in other SIGs must apply separately for approver status in SIG Docs.
-->
### 成为批准人  {#becoming-an-approver}

当你满足[一定条件](https://github.com/kubernetes/community/blob/master/community-membership.md#approver)时，可以成为一个 SIG Docs 批准人。
来自其他 SIG 的批准人也必须在 SIG Docs 独立申请批准人资格。

<!--
To apply:

1. Open a pull request adding yourself to a section of the [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES) file in the `kubernetes/website` repository.

    {{< note >}}
    If you aren't sure where to add yourself, add yourself to `sig-docs-en-owners`.
    {{< /note >}}

2. Assign the PR to one or more current SIG Docs approvers.

If approved, a SIG Docs lead adds you to the appropriate GitHub team. Once added, [K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home) assigns and suggests you as a reviewer on new pull requests.
-->
申请流程如下：

1. 发起一个 PR，将自己添加到 `kubernetes/website` 仓库中
   [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
   文件的对应节区。

   {{< note >}}
   如果你不确定要添加到哪个位置，可以将自己添加到 `sig-docs-en-owners` 中。
   {{< /note >}}

2. 将 PR 指派给一个或多个 SIG Docs 批准人。

请求被批准之后，SIG Docs Leads 之一会将你添加到对应的 GitHub 团队。
一旦添加完成，[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
会在处理未来的 PR 时，将 PR 指派给你或者建议你来评审某 PR。

## {{% heading "whatsnext" %}}

<!--
- Read about [PR wrangling](/docs/contribute/participate/pr-wranglers), a role all approvers take on rotation.
-->
- 阅读 [PR 管理者](/zh-cn/docs/contribute/participate/pr-wranglers/)，了解所有批准人轮值的角色。

