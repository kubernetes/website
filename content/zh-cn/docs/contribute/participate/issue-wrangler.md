---
title: Issue 管理者
content_type: concept
weight: 20
---
<!--
title: Issue Wranglers
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
Alongside the [PR Wrangler](/docs/contribute/participate/pr-wranglers),formal approvers,
and reviewers, members of SIG Docs take week long shifts
[triaging and categorising issues](/docs/contribute/review/for-approvers/#triage-and-categorize-issues)
for the repository.
-->
除了承担 [PR 管理者](/zh-cn/docs/contribute/participate/pr-wranglers)的职责外，
SIG Docs 正式的批准人（Approver）、评审人（Reviewer）和成员（Member）
按周轮流[归类仓库的 Issue](/zh-cn/docs/contribute/review/for-approvers/#triage-and-categorize-issues)。

<!-- body -->

<!--
## Duties

Each day in a week-long shift the Issue Wrangler will be responsible for:

- Triaging and tagging incoming issues daily. See
  [Triage and categorize issues](/docs/contribute/review/for-approvers/#triage-and-categorize-issues)
  for guidelines on how SIG Docs uses metadata.
- Keeping an eye on stale & rotten issues within the kubernetes/website repository.
- Maintenance of the [Issues board](https://github.com/orgs/kubernetes/projects/72/views/1).
-->
## 职责   {#duties}

在为期一周的轮值期内，Issue 管理者每天负责：

- 对收到的 Issue 进行日常分类和标记。有关 SIG Docs 如何使用元数据的指导说明，
  参阅[归类 Issue](/zh-cn/docs/contribute/review/for-approvers/#triage-and-categorize-issues)。
- 密切关注 kubernetes/website 代码仓库中陈旧和过期的 Issue。
- 维护 [Issues 看板](https://github.com/orgs/kubernetes/projects/72/views/1)。

<!--
## Requirements

- Must be an active member of the Kubernetes organization.
- A minimum of 15 [non-trivial](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits)
  contributions to Kubernetes (of which a certain amount should be directed towards kubernetes/website).
- Performing the role in an informal capacity already.
-->
## 要求   {#requirements}

- 必须是 Kubernetes 组织的活跃成员。
- 至少为 Kubernetes 做了 15
  个[非小微](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits)的贡献
  （其中某些应是直接针对 kubernetes/website 的贡献）。
- 已经以非正式身份履行该职责。

<!--
## Helpful Prow commands for wranglers

Below are some commonly used commands for Issue Wranglers:
-->
## 对管理者有帮助的 Prow 命令

以下是 Issue 管理者的一些常用命令：

<!--
```bash
# reopen an issue
/reopen

# transfer issues that don't fit in k/website to another repository
/transfer[-issue]

# change the state of rotten issues
/remove-lifecycle rotten

# change the state of stale issues
/remove-lifecycle stale

# assign sig to an issue
/sig <sig_name>

# add specific area
/area <area_name>

# for beginner friendly issues
/good-first-issue

# issues that needs help
/help wanted

# tagging issue as support specific
/kind support

# to accept triaging for an issue
/triage accepted

# closing an issue we won't be working on and haven't fixed yet
/close not-planned
```
-->
```bash
# 重新打开 Issue
/reopen

# 将不切合 k/website 的 Issue 转移到其他代码仓库
/transfer[-issue]

# 更改陈旧 Issue 的状态
/remove-lifecycle rotten

# 更改过期 Issue 的状态
/remove-lifecycle stale

# 为 Issue 指派 SIG
/sig <sig_name>

# 添加具体领域
/area <area_name>

# 对新手友好的 Issue
/good-first-issue

# 需要帮助的 Issue
/help wanted

# 将 Issue 标记为某种支持
/kind support

# 接受某个 Issue 的归类
/triage accepted

# 关闭还未处理且未修复的 Issue
/close not-planned
```

<!--
To find more Prow commands, refer to the [Command Help](https://prow.k8s.io/command-help) documentation.
-->
要查找更多 Prow 命令，请参阅[命令帮助](https://prow.k8s.io/command-help)文档。

<!--
## When to close Issues

For an open source project to succeed, good issue management is crucial.
But it is also critical to resolve issues in order to maintain the repository
and communicate clearly with contributors and users.
-->
## 何时关闭 Issue   {#when-to-close-issues}

一个开源项目想要成功，良好的 Issue 管理非常关键。
但解决 Issue 也很重要，这样才能维护代码仓库，并与贡献者和用户进行清晰明确的交流。

<!--
Close issues when:

- A similar issue is reported more than once.You will first need to tag it as `/triage duplicate`;
  link it to the main issue & then close it. It is also advisable to direct the users to the original issue.
- It is very difficult to understand and address the issue presented by the author with the information provided.
  However, encourage the user to provide more details or reopen the issue if they can reproduce it later.
- The same functionality is implemented elsewhere. One can close this issue and direct user to the appropriate place.
- The reported issue is not currently planned or aligned with the project's goals.
- If the issue appears to be spam and is clearly unrelated.
- If the issue is related to an external limitation or dependency and is beyond the control of the project.
-->
关闭 Issue 的时机包括：

- 类似的 Issue 被多次报告。你首先需要将其标记为 `/triage duplicate`；
  将其链接到主要 Issue 然后关闭它。还建议将用户引导至最初的 Issue。
- 通过所提供的信息很难理解和解决作者提出的 Issue。
  但要鼓励用户提供更多细节，或者在以后可以重现 Issue 时重新打开此 Issue 。
- 相同的功能在其他地方已实现。管理者可以关闭此 Issue 并将用户引导至适当的位置。
- 报告的 Issue 当前未被计划或不符合项目的目标。
- 如果 Issue 看起来是垃圾信息并且明显不相关。
- 如果 Issue 与外部限制或依赖项有关并且超出了本项目的控制范围。

<!--
To close an issue, leave a `/close` comment on the issue.
-->
要关闭 Issue，可以在 Issue 中留下一条 `/close` 的评论。
