---
title: 评阅人和批准人文档
linktitle: 评阅人和批准人
slug: for-approvers
content_type: concept
weight: 20
---
<!--
title: Reviewing for approvers and reviewers
linktitle: For approvers and reviewers
slug: for-approvers
content_type: concept
weight: 20
-->

<!-- overview -->
<!--
SIG Docs [Reviewers](/docs/contribute/participate/#reviewers) and
[Approvers](/docs/contribute/participate/#approvers) do a few extra things
when reviewing a change.

Every week a specific docs approver volunteers to triage and review pull requests.
This person is the "PR Wrangler" for the week. See the
[PR Wrangler scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers)
for more information. To become a PR Wrangler, attend the weekly SIG Docs meeting
and volunteer. Even if you are not on the schedule for the current week, you can
still review pull requests (PRs) that are not already under active review.

In addition to the rotation, a bot assigns reviewers and approvers
for the PR based on the owners for the affected files.
-->
SIG Docs
[评阅人（Reviewers）](/zh-cn/docs/contribute/participate/#reviewers)
和[批准人（Approvers）](/zh-cn/docs/contribute/participate/#approvers)
在对变更进行评审时需要做一些额外的事情。

每周都有一个特定的文档批准人自愿负责对 PR 进行分类和评阅。
此角色称作该周的“PR 管理者（PR Wrangler）”。
相关信息可参考 [PR Wrangler 排班表](https://github.com/kubernetes/website/wiki/PR-Wranglers)。
要成为 PR Wangler，需要参加每周的 SIG Docs 例会，并自愿报名。
即使当前这周排班没有轮到你，你仍可以评阅那些尚未被积极评阅的 PRs。

除了上述的轮值安排，后台机器人也会为基于所影响的文件来为 PR
指派评阅人和批准人。

<!-- body -->
<!--
## Reviewing a PR

Kubernetes documentation follows the
[Kubernetes code review process](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process).

Everything described in [Reviewing a pull request](/docs/contribute/review/reviewing-prs)
applies, but Reviewers and Approvers should also do the following:
-->
## 评阅 PR

Kubernetes 文档遵循 [Kubernetes 代码评阅流程](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process)。

[评阅 PR](/zh-cn/docs/contribute/review/reviewing-prs/) 文档中所描述的所有规程都适用，
不过评阅人和批准人还要做以下工作：

<!--
- Using the `/assign` Prow command to assign a specific reviewer to a PR as needed.
  This is extra important when it comes to requesting technical review from code contributors.

  {{< note >}}
  Look at the `reviewers` field in the front-matter at the top of a Markdown file to see who can
  provide technical review.
  {{< /note >}}

- Making sure the PR follows the [Content](/docs/contribute/style/content-guide/)
  and [Style](/docs/contribute/style/style-guide/) guides; link the author to the
  relevant part of the guide(s) if it doesn't.
- Using the GitHub **Request Changes** option when applicable to suggest changes to the PR author.
- Changing your review status in GitHub using the `/approve` or `/lgtm` Prow commands,
  if your suggestions are implemented.
-->
- 根据需要使用 Prow 命令 `/assign` 指派特定的评阅人。如果某个 PR
  需要来自代码贡献者的技术审核时，这一点非常重要。

  {{< note >}}
  你可以查看 Markdown 文件的文件头，其中的 `reviewers` 字段给出了哪些人可以为文档提供技术审核。
  {{< /note >}}

- 确保 PR 遵从[内容指南](/zh-cn/docs/contribute/style/content-guide/)和[样式指南](/zh-cn/docs/contribute/style/style-guide/)；
  如果 PR 没有达到要求，指引作者阅读指南中的相关部分。
- 适当的时候使用 GitHub **Request Changes** 选项，建议 PR 作者实施所建议的修改。
- 当你所提供的建议被采纳后，在 GitHub 中使用 `/approve` 或 `/lgtm` Prow 命令，改变评审状态。

<!--
## Commit into another person's PR

Leaving PR comments is helpful, but there might be times when you need to commit
into another person's PR instead.

Do not "take over" for another person unless they explicitly ask
you to, or you want to resurrect a long-abandoned PR. While it may be faster
in the short term, it deprives the person of the chance to contribute.

The process you use depends on whether you need to edit a file that is already
in the scope of the PR, or a file that the PR has not yet touched.
-->
## 提交到他人的 PR

为 PR 留下评语是很有用的，不过有时候你需要向他人的 PR 提交内容。

除非他人明确请求你的帮助或者你希望重启一个被放弃很久的 PR，不要“接手”他人的工作。
尽管短期看来这样做可以提高效率，但是也剥夺了他人提交贡献的机会。

你所要遵循的流程取决于你需要编辑已经在 PR 范畴的文件，还是 PR 尚未触碰的文件。

<!--
You can't commit into someone else's PR if either of the following things is
true:

- If the PR author pushed their branch directly to the
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  repository. Only a reviewer with push access can commit to another user's PR.
-->
如果处于下列情况之一，你不可以向别人的 PR 提交内容：

- 如果 PR 作者是直接将自己的分支提交到
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  仓库。只有具有推送权限的评阅人才可以向他人的 PR 提交内容。

  {{< note >}}
  <!--
  Encourage the author to push their branch to their fork before
  opening the PR next time.
  -->
  我们应鼓励作者下次将分支推送到自己的克隆副本之后再发起 PR。
  {{< /note >}}

<!--
- The PR author explicitly disallows edits from approvers.
-->
- PR 作者明确地禁止批准人编辑他/她的 PR。

<!--
## Prow commands for reviewing

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md) is
the Kubernetes-based CI/CD system that runs jobs against pull requests (PRs). Prow
enables chatbot-style commands to handle GitHub actions across the Kubernetes
organization, like [adding and removing labels](#adding-and-removing-issue-labels),
closing issues, and assigning an approver. Enter Prow commands as GitHub comments
using the `/<command-name>` format.

The most common prow commands reviewers and approvers use are:
-->
## 评阅用的 Prow 命令

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md)
是基于 Kubernetes 的 CI/CD 系统，基于拉取请求（PR）的触发运行不同任务。
Prow 使得我们可以使用会话机器人一样的命令跨整个 Kubernetes 组织处理 GitHub
动作，例如[添加和删除标签](#adding-and-removing-issue-labels)、关闭 Issues
以及指派批准人等等。你可以使用 `/<命令名称>` 的形式以 GitHub 评论的方式输入
Prow 命令。

评阅人和批准人最常用的 Prow 命令有：

<!--
{{< table caption="Prow commands for reviewing" >}}
Prow Command | Role Restrictions | Description
:------------|:------------------|:-----------
`/lgtm` | Organization members | Signals that you've finished reviewing a PR and are satisfied with the changes.
`/approve` | Approvers | Approves a PR for merging.
`/assign` | Anyone | Assigns a person to review or approve a PR
`/close` | Organization members | Closes an issue or PR.
`/hold` | Anyone | Adds the `do-not-merge/hold` label, indicating the PR cannot be automatically merged.
`/hold cancel` | Anyone | Removes the `do-not-merge/hold` label.
{{< /table >}}

To view the commands that you can use in a PR, see the
[Prow Command Reference](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite).
-->
{{< table caption="评阅用 Prow 命令" >}}
Prow 命令 | 角色限制 | 描述
:------------|:------------------|:-----------
`/lgtm` | 组织成员 | 用来表明你已经完成 PR 的评阅并对其所作变更表示满意
`/approve` | 批准人 | 批准某 PR 可以合并
`/assign` |任何人 | 指派某人来评阅或批准某 PR
`/close` | 组织成员 | 关闭 Issue 或 PR
`/hold` | 任何人 | 添加 `do-not-merge/hold` 标签，用来表明 PR 不应被自动合并
`/hold cancel` | 任何人 | 去掉 `do-not-merge/hold` 标签
{{< /table >}}

要查看可以在 PR 中使用的命令，请参阅
[Prow 命令指南](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite)。

<!--
## Triage and categorize issues

In general, SIG Docs follows the
[Kubernetes issue triage](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md)
process and uses the same labels.

This GitHub Issue [filter](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
finds issues that might need triage.
-->
## 对 Issue 进行诊断和分类

一般而言，SIG Docs 遵从 [Kubernetes issue 判定](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md) 流程并使用相同的标签。

此 GitHub Issue
[过滤器](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
可以用来查找需要评判的 Issues。

<!--
### Triaging an issue

1. Validate the issue

   - Make sure the issue is about website documentation. Some issues can be closed quickly by
     answering a question or pointing the reporter to a resource. See the
     [Support requests or code bug reports](#support-requests-or-code-bug-reports) section for details.
   - Assess whether the issue has merit.
   - Add the `triage/needs-information` label if the issue doesn't have enough
     detail to be actionable or the template is not filled out adequately.
   - Close the issue if it has both the `lifecycle/stale` and `triage/needs-information` labels.
-->

### 评判 Issue {#triaging-an-issue}

1. 验证 Issue 的合法性

  - 确保 Issue 是关于网站文档的。某些 Issue 可以通过回答问题或者为报告者提供
    资源链接来快速关闭。
    参考[请求支持或代码缺陷报告](#support-requests-or-code-bug-reports)
    节以了解详细信息。
  - 评估该 Issue 是否有价值。
  - 如果 Issue 缺少足够的细节以至于无法采取行动，或者报告者没有通过模版提供
    足够信息，可以添加 `triage/needs-information` 标签。
  - 如果 Issue 同时标注了 `lifecycle/stale` 和 `triage/needs-information`
    标签，可以直接关闭。

<!--
2. Add a priority label (the
   [Issue Triage Guidelines](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority)
   define priority labels in detail)

  {{< table caption="Issue labels" >}}
  Label | Description
  :------------|:------------------
  `priority/critical-urgent` | Do this right now.
  `priority/important-soon` | Do this within 3 months.
  `priority/important-longterm` | Do this within 6 months.
  `priority/backlog` | Deferrable indefinitely. Do when resources are available.
  `priority/awaiting-more-evidence` | Placeholder for a potentially good issue so it doesn't get lost.
  `help` or `good first issue` | Suitable for someone with very little Kubernetes or SIG Docs experience. See [Help Wanted and Good First Issue Labels](https://kubernetes.dev/docs/guide/help-wanted/) for more information.

  {{< /table >}}

  At your discretion, take ownership of an issue and submit a PR for it
  (especially if it's quick or relates to work you're already doing).

If you have questions about triaging an issue, ask in `#sig-docs` on Slack or
the [kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
-->
2. 添加优先级标签（
  [Issue 判定指南](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority)中有优先级标签的详细定义)

  {{< table caption="Issue 标签" >}}
  标签         | 描述
  :------------|:------------------
  `priority/critical-urgent` | 应马上处理
  `priority/important-soon` | 应在 3 个月内处理
  `priority/important-longterm` | 应在 6 个月内处理
  `priority/backlog` | 可无限期地推迟，可在人手充足时处理
  `priority/awaiting-more-evidence` | 占位符，标示 Issue 可能是一个不错的 Issue，避免该 Issue 被忽略或遗忘
  `help` or `good first issue` | 适合对 Kubernetes 或 SIG Docs 经验较少的贡献者来处理。更多信息可参考[需要帮助和入门候选 Issue 标签](https://kubernetes.dev/docs/guide/help-wanted/)。
  {{< /table >}}

   基于你自己的判断，你可以选择某 Issue 来处理，为之发起 PR
   （尤其是那些可以很快处理或与你已经在做的工作相关的 Issue）。

如果你对 Issue 评判有任何问题，可以在 `#sig-docs` Slack 频道或者
[kubernetes-sig-docs 邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
中提问。

<!--
## Adding and removing issue labels

To add a label, leave a comment in one of the following formats:

- `/<label-to-add>` (for example, `/good-first-issue`)
- `/<label-category> <label-to-add>` (for example, `/triage needs-information` or `/language ja`)

To remove a label, leave a comment in one of the following formats:

- `/remove-<label-to-remove>` (for example, `/remove-help`)
- `/remove-<label-category> <label-to-remove>` (for example, `/remove-triage needs-information`)
-->
## 添加和删除 Issue 标签 {#adding-and-removing-issue-labels}

要添加标签，可以用以下形式对 PR 进行评论：

- `/<要添加的标签>` （例如, `/good-first-issue`）
- `/<标签类别> <要添加的标签>` （例如，`/triage needs-information` 或 `/language ja`）

要移除某个标签，可以用以下形式对 PR 进行评论：

- `/remove-<要移除的标签>` （例如，`/remove-help`）
- `/remove-<标签类别> <要移除的标签>` （例如，`/remove-triage needs-information`）

<!--
In both cases, the label must already exist. If you try to add a label that does not exist, the command is
silently ignored.

For a list of all labels, see the [website repository's Labels section](https://github.com/kubernetes/website/labels).
Not all labels are used by SIG Docs.
-->
在以上两种情况下，标签都必须合法存在。如果你尝试添加一个尚不存在的标签，
对应的命令会被悄悄忽略。

关于所有标签的完整列表，可以参考
[Website 仓库的标签节](https://github.com/kubernetes/website/labels)。
实际上，SIG Docs 并没有使用全部标签。

<!--
### Issue lifecycle labels

Issues are generally opened and closed quickly.
However, sometimes an issue is inactive after its opened.
Other times, an issue may need to remain open for longer than 90 days.

{{< table caption="Issue lifecycle labels" >}}
Label | Description
:------------|:------------------
`lifecycle/stale` | After 90 days with no activity, an issue is automatically labeled as stale. The issue will be automatically closed if the lifecycle is not manually reverted using the `/remove-lifecycle stale` command.
`lifecycle/frozen` | An issue with this label will not become stale after 90 days of inactivity. A user manually adds this label to issues that need to remain open for much longer than 90 days, such as those with a `priority/important-longterm` label.
{{< /table >}}
-->
### Issue 生命周期标签

Issues 通常都可以快速创建并关闭。
不过也有些时候，某个 Issue 被创建之后会长期处于非活跃状态。
也有一些时候，即使超过 90 天，某个 Issue 仍应保持打开状态。

{{< table caption="Issue 生命周期标签" >}}
标签         | 描述
:------------|:------------------
`lifecycle/stale` | 过去 90 天内某 Issue 无人问津，会被自动标记为停滞状态。如果 Issue 没有被 `/remove-lifecycle stale` 命令重置生命期，就会被自动关闭。
`lifecycle/frozen` | 对应的 Issue 即使超过 90 天仍无人处理也不会进入停滞状态。用户手动添加此标签给一些需要保持打开状态超过 90 天的 Issue，例如那些带有 `priority/important-longterm` 标签的 Issue。
{{< /table >}}

<!--
## Handling special issue types

SIG Docs encounters the following types of issues often enough to document how
to handle them.

### Duplicate issues

If a single problem has one or more issues open for it, combine them into a single issue.
You should decide which issue to keep open (or
open a new issue), then move over all relevant information and link related issues.
Finally, label all other issues that describe the same problem with
`triage/duplicate` and close them. Only having a single issue to work on reduces confusion
and avoids duplicate work on the same problem.
-->
## 处理特殊的 Issue 类型 {#handling-special-issue-types}

SIG Docs 常常会遇到以下类型的 Issue，因此对其处理方式描述如下。

### 重复的 Issue {#duplicate-issues}

如果针对同一个问题有不止一个打开的 Issue，可以将其合并为一个 Issue。
你需要决定保留哪个 Issue 为打开状态（或者重新登记一个新的 Issue），
然后将所有相关的信息复制过去并提供对关联 Issues 的链接。
最后，将所有其他描述同一问题的 Issue 标记为 `triage/duplicate` 并关闭之。
保持只有一个 Issue 待处理有助于减少困惑，避免在同一问题上发生重复劳动。

<!--
### Dead link issues

If the dead link issue is in the API or `kubectl` documentation, assign them
`/priority critical-urgent` until the problem is fully understood. Assign all
other dead link issues `/priority important-longterm`, as they must be manually fixed.

### Blog issues

We expect [Kubernetes Blog](/blog/) entries to become
outdated over time. Therefore, we only maintain blog entries less than a year old.
If an issue is related to a blog entry that is more than one year old,
close the issue without fixing.
-->
### 失效链接 Issues {#dead-link-issues}

如果失效链接是关于 API 或者 `kubectl` 文档的，可以将其标记为
`/priority critical-urgent`，直到问题原因被弄清楚为止。
对于其他的链接失效问题，可以标记 `/priority important-longterm`，
因为这些问题都需要手动处理。

### 博客问题  {#blog-issues}

我们预期 [Kubernetes 博客](/zh-cn/blog/)条目随着时间推移都会过期。
因此，我们只维护一年内的博客条目。
如果某个 Issue 是与某个超过一年的博客条目有关的，可以直接关闭
Issue，不必修复。

<!--
### Support requests or code bug reports

Some docs issues are actually issues with the underlying code, or requests for
assistance when something, for example a tutorial, doesn't work.
For issues unrelated to docs, close the issue with the `kind/support` label and a comment
directing the requester to support venues (Slack, Stack Overflow) and, if
relevant, the repository to file an issue for bugs with features (`kubernetes/kubernetes`
is a great place to start).

Sample response to a request for support:
-->
### 请求支持或代码缺陷报告  {#support-requests-or-code-bug-reports}

某些文档 Issues 实际上是关于底层代码的 Issue 或者在某方面请求协助的问题，
例如某个教程无法正常工作。
对于与文档无关的 Issues，关闭它并打上标签 `kind/support`，可以通过评论
告知请求者其他支持渠道（Slack、Stack Overflow）。
如果有相关的其他仓库，可以告诉请求者应该在哪个仓库登记与功能特性相关的 Issues
（通常会是 `kubernetes/kubernetes`）。

下面是对支持请求的回复示例：

```none
This issue sounds more like a request for support and less
like an issue specifically for docs. I encourage you to bring
your question to the `#kubernetes-users` channel in
[Kubernetes slack](https://slack.k8s.io/). You can also search
resources like
[Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
for answers to similar questions.

You can also open issues for Kubernetes functionality in
https://github.com/kubernetes/kubernetes.

If this is a documentation issue, please re-open this issue.
```

<!--
Sample code bug report response:
-->
对代码缺陷 Issue 的回复示例：

```none
This sounds more like an issue with the code than an issue with
the documentation. Please open an issue at
https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```

<!--
### Squashing

As an approver, when you review pull requests (PRs), there are various cases
where you might do the following:

- Advise the contributor to squash their commits.
- Squash the commits for the contributor.
- Advise the contributor not to squash yet.
- Prevent squashing.
-->
### 压缩（Squashing）提交

作为一名 Approver，当你评审 PR 时，可能会遇到以下几种情况：

- 建议贡献者压缩他们的提交。
- 协助贡献者压缩提交。
- 建议贡献者先不要压缩提交。
- 阻止压缩提交。

<!--
**Advising contributors to squash**: A new contributor might not know that they
should squash commits in their pull requests (PRs). If this is the case, advise
them to do so, provide links to useful information, and offer to arrange help if
they need it. Some useful links:

- [Opening pull requests and squashing your commits](/docs/contribute/new-content/open-a-pr#squashing-commits)
  for documentation contributors.
- [GitHub Workflow](https://www.k8s.dev/docs/guide/github-workflow/), including diagrams, for developers.
-->
**建议贡献者压缩提交**：新贡献者可能不知道要压缩 PR 中的提交。
如果是这种情况，Approver 要给出压缩提交的建议，并贴附有用的链接，
并在贡献者需要帮助时伸出援手。这里有一些有用的链接：

- 协助文档贡献者[提 PR 和压缩提交](/zh-cn/docs/contribute/new-content/open-a-pr#squashing-commits)。
- 面向开发者包括插图在内的 [GitHub 工作流程](https://www.k8s.dev/docs/guide/github-workflow/)。

<!--
**Squashing commits for contributors**: If a contributor might have difficulty
squashing commits or there is time pressure to merge a PR, you can perform the
squash for them:
-->
**协助贡献者压缩提交**：如果贡献者压缩提交遇到难题或合并 PR 的时间紧迫，
你可以协助贡献者执行压缩提交的操作。

<!--
- The kubernetes/website repo is
  [configured to allow squashing for pull request merges](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests).
  Simply select the *Squash commits* button.
- In the PR, if the contributor enables maintainers to manage the PR, you can
  squash their commits and update their fork with the result. Before you squash,
  advise them to save and push their latest changes to the PR. After you squash,
  advise them to pull the squashed commit to their local clone.
- You can get GitHub to squash the commits by using a label so that Tide / GitHub
  performs the squash or by clicking the *Squash commits* button when you merge the PR.
-->
- kubernetes/website
  仓库[被配置为允许压缩提交后合并 PR](https://docs.github.com/zh/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests)。
  你只需选择 **Squash commits** 按钮。
- 在 PR 中，如果贡献者允许 Maintainer 们管理 PR，你就可以为他们压缩提交并将其 fork 更新为最新结果。
  在你执行压缩提交之后，请建议贡献者将压缩后的提交拉到他们本地的克隆副本。
- 你可以使用标签让 GitHub 压缩提交，这样 Tide / GitHub 就会对提交执行压缩；
  你还可以在合并 PR 时点选 **Squash commits** 按钮。

<!--
**Advise contributors to avoid squashing**

- If one commit does something broken or unwise, and the last commit reverts this
  error, don't squash the commits. Even though the "Files changed" tab in the PR
  on GitHub and the Netlify preview will both look OK, merging this PR might create
  rebase or merge conflicts for other folks. Intervene as you see fit to avoid that
  risk to other contributors.
-->
**建议贡献者避免压缩提交**

- 如果一个提交做了一些破坏性或不明智的修改，那最后一个提交可用于回滚错误，这种情况不要压缩提交。
  即使通过 GitHub 上 PR 中的 "Files changed" 页签以及 Netlify 预览看起来都正常，
  合并这种 PR 可能会在其他 fork 中造成 rebase 或合并冲突。
  你看到这种情况要进行合理的干预，避免对其他贡献者造成麻烦。

<!--
**Never squash**

- If you're launching a localization or releasing the docs for a new version,
  you are merging in a branch that's not from a user's fork, _never squash the commits_.
  Not squashing is essential because you must maintain the commit history for those files.
-->
**千万不要压缩提交**

- 如果你为新版本发起了一次本地化批量作业或为新版发布许多文档，那你要合并到的分支将与用户 fork 的分支不同，
  这种情况**千万不要压缩提交**。之所以不压缩提交，是因为你必须保持这些文件的提交历史记录。
