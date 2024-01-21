---
title: 提出内容改进建议
content_type: concept
weight: 10
card:
  name: contribute
  weight: 15
  anchors:
  - anchor: "#opening-an-issue"
    title: 提出内容改进建议
---
<!--
title: Suggesting content improvements
content_type: concept
weight: 10
card:
  name: contribute
  weight: 15
  anchors:
  - anchor: "#opening-an-issue"
    title: Suggest content improvements
-->

<!-- overview -->

<!--
If you notice an issue with Kubernetes documentation or have an idea for new content,
then open an issue. All you need is a [GitHub account](https://github.com/join) and
a web browser.

In most cases, new work on Kubernetes documentation begins with an issue in GitHub. Kubernetes contributors
then review, categorize and tag issues as needed. Next, you or another member
of the Kubernetes community open a pull request with changes to resolve the issue.
-->
如果你发现 Kubernetes 文档中存在问题或者你有一个关于新内容的想法，
可以考虑提出一个问题（issue）。你只需要具有 [GitHub 账号](https://github.com/join)和 Web
浏览器就可以完成这件事。

在大多数情况下，Kubernetes 文档的新工作都是开始于 GitHub 上的某个问题。
Kubernetes 贡献者会审阅这些问题并根据需要对其分类、打标签。
接下来，你或者别的 Kubernetes 社区成员就可以发起一个带有变更的拉取请求，
以解决这一问题。

<!-- body -->

<!--
## Opening an issue

If you want to suggest improvements to existing content or notice an error, then open an issue.

1. Click the **Create an issue** link on the right sidebar. This redirects you
 to a GitHub issue page pre-populated with some headers.
2. Describe the issue or suggestion for improvement. Provide as many details as you can.
3. Click **Submit new issue**.

After submitting, check in on your issue occasionally or turn on GitHub notifications.
Reviewers and other community members might ask questions before
they can take action on your issue.
-->
## 创建问题 {#opening-an-issue}

如果你希望就改进已有内容提出建议或者在文档中发现了错误，请创建一个问题（issue）。

1. 点击右侧边栏的 **提交文档问题** 按钮。浏览器会重定向到一个 GitHub 问题页面，
   其中包含了一些预先填充的内容。
1. 请描述遇到的问题或关于改进的建议。尽可能提供细节信息。
1. 点击 **Submit new issue**。

提交之后，偶尔查看一下你所提交的问题，或者开启 GitHub 通知。
评审人（reviewers）和其他社区成员可能在针对所提问题采取行动之前，问一些问题。

<!--
## Suggesting new content

If you have an idea for new content, but you aren't sure where it should go, you can
still file an issue. Either:

- Choose an existing page in the section you think the content belongs in and click **Create an issue**.
- Go to [GitHub](https://github.com/kubernetes/website/issues/new/) and file the issue directly.
-->
## 关于新内容的建议 {#suggesting-new-content}

如果你对新内容有想法，但是你不确定这些内容应该放在哪里，你仍可以提出问题。

- 在预期的节区中选择一个现有页面，点击 **提交文档问题**。
- 前往 [GitHub Issues 页面](https://github.com/kubernetes/website/issues/new/)，
  直接记录问题。

<!--
## How to file great issues

Keep the following in mind when filing an issue:

- Provide a clear issue description. Describe what specifically is missing, out of date,
  wrong, or needs improvement.
- Explain the specific impact the issue has on users.
- Limit the scope of a given issue to a reasonable unit of work. For problems
  with a large scope, break them down into smaller issues. For example, "Fix the security docs"
  is too broad, but "Add details to the 'Restricting network access' topic" is specific enough
  to be actionable.
- Search the existing issues to see if there's anything related or similar to the
  new issue.
- If the new issue relates to another issue or pull request, refer to it
  either by its full URL or by the issue or pull request number prefixed
  with a `#` character. For example, `Introduced by #987654`.
- Follow the [Code of Conduct](/community/code-of-conduct/). Respect your
fellow contributors. For example, "The docs are terrible" is not
  helpful or polite feedback.
-->

## 如何更好地记录问题 {#how-to-file-great-issues}

在记录问题时，请注意以下事项：

- 提供问题的清晰描述，描述具体缺失的内容、过期的内容、错误的内容或者需要改进的文字。
- 解释该问题对用户的特定影响。
- 将给定问题的范围限定在一个工作单位范围内。如果问题牵涉的领域较大，可以将其分解为多个小一点的问题。
  例如："Fix the security docs" 是一个过于宽泛的问题，而
  "Add details to the 'Restricting network access' topic"
  就是一个足够具体的、可操作的问题。
- 搜索现有问题的列表，查看是否已经有相关的或者类似的问题已被记录。
- 如果新问题与某其他问题或 PR 有关联，可以使用其完整 URL 或带 `#` 字符的 PR 编号来引用之。
  例如：`Introduced by #987654`。
- 遵从[行为准则](/zh-cn/community/code-of-conduct/)。尊重同行贡献者。
  例如，"The docs are terrible" 就是无用且无礼的反馈。
