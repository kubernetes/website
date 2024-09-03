---
title: PR 管理者
content_type: concept
weight: 20
---
<!--
title: PR wranglers
content_type: concept
weight: 20
-->

<!-- overview -->
<!--
SIG Docs [approvers](/docs/contribute/participate/roles-and-responsibilities/#approvers)
take week-long shifts [managing pull requests](https://github.com/kubernetes/website/wiki/PR-Wranglers)
for the repository.

This section covers the duties of a PR wrangler. For more information on giving good reviews,
see [Reviewing changes](/docs/contribute/review/).
-->
SIG Docs 的[批准人（Approver）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#approvers)们每周轮流负责
[管理仓库的 PR](https://github.com/kubernetes/website/wiki/PR-Wranglers)。

本节介绍 PR 管理者的职责。关于如何提供较好的评审意见，
可参阅[评审变更](/zh-cn/docs/contribute/review/)。

<!-- body -->
<!--
## Duties

Each day in a week-long shift as PR Wrangler:

- Review [open pull requests](https://github.com/kubernetes/website/pulls) for quality
  and adherence to the [Style](/docs/contribute/style/style-guide/) and
  [Content](/docs/contribute/style/content-guide/) guides.
    - Start with the smallest PRs (`size/XS`) first, and end with the largest (`size/XXL`). Review as many PRs as you can.
-->
## 职责 {#duties}

在为期一周的轮值期内，PR 管理者要：

- 检查[悬决的 PR](https://github.com/kubernetes/website/pulls)
  的质量并确保它们符合[样式指南](/zh-cn/docs/contribute/style/style-guide/)和
  [内容指南](/zh-cn/docs/contribute/style/content-guide/)要求。

  - 首先查看最小的 PR（`size/XS`），然后逐渐扩展到最大的
    PR（`size/XXL`），尽可能多地评审 PR。
<!-- 
- Make sure PR contributors sign the [CLA](https://github.com/kubernetes/community/blob/master/CLA.md).
    - Use [this](https://github.com/zparnold/k8s-docs-pr-botherer) script to remind contributors
      that haven't signed the CLA to do so.
- Provide feedback on changes and ask for technical reviews from members of other SIGs.
    - Provide inline suggestions on the PR for the proposed content changes.
    - If you need to verify content, comment on the PR and request more details.
    - Assign relevant `sig/` label(s).
    - If needed, assign reviewers from the `reviewers:` block in the file's front matter.
    - You can also tag a [SIG](https://github.com/kubernetes/community/blob/master/sig-list.md)
      for a review by commenting `@kubernetes/<sig>-pr-reviews` on the PR.
-->
- 确保贡献者签署 [CLA](https://github.com/kubernetes/community/blob/master/CLA.md)。
  - 使用[此脚本](https://github.com/zparnold/k8s-docs-pr-botherer)自动提醒尚未签署
    CLA 的贡献者签署 CLA。
- 针对变更提供反馈，请求其他 SIG 的成员进行技术审核。
  - 为 PR 所建议的内容更改提供就地反馈。
  - 如果你需要验证内容，请在 PR 上发表评论并要求贡献者提供更多细节。
  - 设置相关的 `sig/` 标签。
  - 如果需要，根据文件开头的 `reviewers:` 块来指派评审人。
  - 你也可以通过在 PR 上作出 `@kubernetes/<sig>-pr-reviews` 的评论以标记需要某个
    [SIG](https://github.com/kubernetes/community/blob/master/sig-list.md) 来评审。
<!-- 
- Use the `/approve` comment to approve a PR for merging. Merge the PR when ready.
    - PRs should have a `/lgtm` comment from another member before merging.
    - Consider accepting technically accurate content that doesn't meet the
      [style guidelines](/docs/contribute/style/style-guide/). As you approve the change,
      open a new issue to address the style concern. You can usually write these style fix
      issues as [good first issues](https://kubernetes.dev/docs/guide/help-wanted/#good-first-issue).
    - Using style fixups as good first issues is a good way to ensure a supply of easier tasks
      to help onboard new contributors.
-->
- 使用 `/approve` 评论来批准可以合并的 PR，在 PR 就绪时将其合并。
  - PR 在被合并之前，应该有来自其他成员的 `/lgtm` 评论。
  - 可以考虑接受那些技术上准确、
    但文风上不满足[风格指南](/zh-cn/docs/contribute/style/style-guide/)要求的 PR。
    批准变更时，可以登记一个新的 Issue 来解决文档风格问题。
    你通常可以将这些风格修复问题标记为 `good first issue`。
  - 将风格修复事项标记为 `good first issue` 可以很好地确保向新加入的贡献者分派一些比较简单的任务，
    这有助于接纳新的贡献者。

<!--
- Also check for pull requests against the [reference docs generator](https://github.com/kubernetes-sigs/reference-docs) code, and review those (or bring in help).
- Support the [issue wrangler](/docs/contribute/participate/issue-wrangler/) to
  triage and tag incoming issues daily.
  See [Triage and categorize issues](/docs/contribute/review/for-approvers/#triage-and-categorize-issues)
  for guidelines on how SIG Docs uses metadata.
-->
- 同时检查针对[参考文档生成器](https://github.com/kubernetes-sigs/reference-docs)的代码拉取请求，
  并对其进行审查（或寻求帮助）。
- 支持[问题管理者](/zh-cn/docs/contribute/participate/issue-wrangler/)每日对新问题进行分类和标记。
  参见[分类和组织问题](/zh-cn/docs/contribute/review/for-approvers/#triage-and-categorize-issues)
  了解 SIG Docs 如何使用元数据。

{{< note >}}
<!--
PR wrangler duties do not apply to localization PRs (non-English PRs). 
Localization teams have their own processes and teams for reviewing their language PRs. 
However, it's often helpful to ensure language PRs are labeled correctly, 
review small non-language dependent PRs (like a link update), 
or tag reviewers or contributors in long-running PRs (ones opened more than 6 months ago and have not been updated in a month or more).
-->
PR 管理者的职责不适用于本地化 PR（非英语 PR）。
本地化团队有自己的流程和团队来审查其语言 PR。
但是，其对于确保被语言 PR 被正确标记，审查与语言无关的小型 PR（如链接更新），或为长期搁置的
PR（已打开超过 6 个月且一个月或更长时间未更新的）添加审阅者或贡献者标签通常很有帮助。
{{< /note >}}

<!--
### Helpful GitHub queries for wranglers

The following queries are helpful when wrangling.
After working through these queries, the remaining list of PRs to review is usually small.
These queries exclude localization PRs. All queries are against the main branch except the last one.
-->
### 对管理者有用的 GitHub 查询   {#helpful-github-queries-for-wranglers}

执行管理操作时，以下查询很有用。完成以下这些查询后，剩余的要评审的 PR 列表通常很小。
这些查询都不包含本地化的 PR，并仅包含主分支上的 PR（除了最后一个查询）。

<!--
- [No CLA, not eligible to merge](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3Alanguage%2Fen):
  Remind the contributor to sign the CLA. If both the bot and a human have reminded them, close
  the PR and remind them that they can open it after signing the CLA.
  **Do not review PRs whose authors have not signed the CLA!**
- [Needs LGTM](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+-label%3Algtm):
  Lists PRs that need an LGTM from a member. If the PR needs technical review,
  loop in one of the reviewers suggested by the bot. If the content needs work,
  add suggestions and feedback in-line.
- [Has LGTM, needs docs approval](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+label%3Algtm+):
  Lists PRs that need an `/approve` comment to merge.
- [Quick Wins](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amain+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3A%22cncf-cla%3A+yes%22+label%3A%22size%2FXS%22+label%3A%22language%2Fen%22):
  Lists PRs against the main branch with no clear blockers.
  (change "XS" in the size label as you work through the PRs [XS, S, M, L, XL, XXL]).
- [Not against the primary branch](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3Alanguage%2Fen+-base%3Amain):
  If the PR is against a `dev-` branch, it's for an upcoming release. Assign the
  [docs release manager](https://github.com/kubernetes/sig-release/tree/master/release-team#kubernetes-release-team-roles)
  using: `/assign @<manager's_github-username>`. If the PR is against an old branch,
  help the author figure out whether it's targeted against the best branch.
-->
- [未签署 CLA，不可合并的 PR](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3Alanguage%2Fen)：
  提醒贡献者签署 CLA。如果机器人和评审者都已经提醒他们，请关闭 PR，并提醒他们在签署 CLA 后可以重新提交。

  **在作者没有签署 CLA 之前，不要评审他们的 PR！**

- [需要 LGTM](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+-label%3Algtm)：
  列举需要来自成员的 LGTM 评论的 PR。
  如果需要技术审查，请告知机器人所建议的评审者。
  如果 PR 继续改进，就地提供更改建议或反馈。

- [已有 LGTM标签，需要 Docs 团队批准](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+label%3Algtm+)：
  列举需要 `/approve` 评论来合并的 PR。

- [快速批阅](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amain+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3A%22cncf-cla%3A+yes%22+label%3A%22size%2FXS%22+label%3A%22language%2Fen%22)：
  列举针对主分支的、没有明确合并障碍的 PR。
  在浏览 PR 时，可以将 "XS" 尺寸标签更改为 "S"、"M"、"L"、"XL"、"XXL"。

- [非主分支的 PR](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3Alanguage%2Fen+-base%3Amain): 
  如果 PR 针对 `dev-` 分支，则表示它适用于即将发布的版本。
  请添加带有 `/assign @<负责人的 github 账号>`，
  将其指派给[发行版本负责人](https://github.com/kubernetes/sig-release/tree/master/release-team#kubernetes-release-team-roles)。
  如果 PR 是针对旧分支，请帮助 PR 作者确定是否所针对的是最合适的分支。

<!--
### Helpful Prow commands for wranglers

```
# add English label
/language en

# add squash label to PR if more than one commit
/label tide/merge-method-squash

# retitle a PR via Prow (such as a work-in-progress [WIP] or better detail of PR)
/retitle [WIP] <TITLE>
```
-->
### 对管理者有用的 Prow 命令  {#helpful-prow-commands-for-wranglers}

```
# 添加 English 标签
/language en

# 如果 PR 包含多个提交（commits），添加 squash 标签
/label tide/merge-method-squash

# 使用 Prow 来为 PR 重设标题（例如一个正在处理 [WIP] 的 PR 或为 PR 提供更好的细节信息）
/retitle [WIP] <TITLE>
```

<!--
### When to close Pull Requests

Reviews and approvals are one tool to keep our PR queue short and current. Another tool is closure.

Close PRs where:
- The author hasn't signed the CLA for two weeks.

    Authors can reopen the PR after signing the CLA. This is a low-risk way to make
    sure nothing gets merged without a signed CLA.

- The author has not responded to comments or feedback in 2 or more weeks.

Don't be afraid to close pull requests. Contributors can easily reopen and resume works in progress.
Often a closure notice is what spurs an author to resume and finish their contribution.

To close a pull request, leave a `/close` comment on the PR.
-->
### 何时关闭 PR     {#when-to-close-pull-requests}

审查和批准是缩短和更新我们的 PR 队列的一种方式；另一种方式是关闭 PR。

当以下条件满足时，可以关闭 PR：

- 作者两周内未签署 CLA。
  PR 作者可以在签署 CLA 后重新打开 PR，因此这是确保未签署 CLA 的 PR 不会被合并的一种风险较低的方法。

- 作者在两周或更长时间内未回复评论或反馈。

不要害怕关闭 PR。贡献者可以轻松地重新打开并继续工作。
通常，关闭通知会激励作者继续完成其贡献。

要关闭 PR，请在 PR 上输入 `/close` 评论。

{{< note >}}
<!--
The [`k8s-triage-robot`](https://github.com/k8s-triage-robot) bot marks issues
as stale after 90 days of inactivity. After 30 more days it marks issues as rotten
and closes them. PR wranglers should close issues after 14-30 days of inactivity.
-->
一个名为 [`k8s-ci-robot`](https://github.com/k8s-ci-robot) 的自动服务会在 Issue 停滞 90
天后自动将其标记为过期；然后再等 30 天，如果仍然无人过问，则将其关闭。
PR 管理者应该在 issues 处于无人过问状态 14-30 天后关闭它们。
{{< /note >}}

<!--
## PR Wrangler shadow program

In late 2021, SIG Docs introduced the PR Wrangler Shadow Program.
The program was introduced to help new contributors understand the PR wrangling process.
-->
## PR 管理者影子计划   {#pr-wrangler-shadow-program}

2021 下半年，SIG Docs 推出了 PR 管理者影子计划（PR Wrangler Shadow Program）。
该计划旨在帮助新的贡献者们了解 PR 管理流程。

<!-- 
### Become a shadow

- If you are interested in shadowing as a PR wrangler, please visit the
  [PR Wranglers Wiki page](https://github.com/kubernetes/website/wiki/PR-Wranglers)
  to see the PR wrangling schedule for this year and sign up.

- Others can reach out on the [#sig-docs Slack channel](https://kubernetes.slack.com/messages/sig-docs)
  for requesting to shadow an assigned PR Wrangler for a specific week. Feel free to reach out to
  Brad Topol (`@bradtopol`) or one of the
  [SIG Docs co-chairs/leads](https://github.com/kubernetes/community/tree/master/sig-docs#leadership).

- Once you've signed up to shadow a PR Wrangler, introduce yourself to the PR Wrangler on the
  [Kubernetes Slack](https://slack.k8s.io).
-->
### 成为一名影子   {#become-a-shadow}

- 如果你有兴趣成为一名 PR 管理者的影子，请访问
  [PR 管理者维基页面](https://github.com/kubernetes/website/wiki/PR-Wranglers)查看今年的
  PR 管理轮值表，然后注册报名。

- 其他人可以通过 [#sig-docs Slack 频道](https://kubernetes.slack.com/messages/sig-docs)申请成为指定
  PR 管理者某一周的影子。可以随时咨询 (`@bradtopol`) 或某一位
  [SIG Docs 联席主席/主管](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)。

- 注册成为一名 PR 管理者的影子时，
  请你在 [Kubernetes Slack](https://slack.k8s.io) 向这名 PR 管理者做一次自我介绍。
