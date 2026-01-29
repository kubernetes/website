---
title: 提出內容改進建議
content_type: concept
weight: 20
card:
  name: contribute
  weight: 15
  anchors:
  - anchor: "#opening-an-issue"
    title: 提出內容改進建議
---
<!--
title: Suggesting content improvements
content_type: concept
weight: 20
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
如果你發現 Kubernetes 文檔中存在問題或者你有一個關於新內容的想法，
可以考慮提出一個問題（issue）。你只需要具有 [GitHub 賬號](https://github.com/join)和 Web
瀏覽器就可以完成這件事。

在大多數情況下，Kubernetes 文檔的新工作都是開始於 GitHub 上的某個問題。
Kubernetes 貢獻者會審閱這些問題並根據需要對其分類、打標籤。
接下來，你或者別的 Kubernetes 社區成員就可以發起一個帶有變更的拉取請求，
以解決這一問題。

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
## 創建問題 {#opening-an-issue}

如果你希望就改進已有內容提出建議或者在文檔中發現了錯誤，請創建一個問題（issue）。

1. 點擊右側邊欄的 **提交文檔問題** 按鈕。瀏覽器會重定向到一個 GitHub 問題頁面，
   其中包含了一些預先填充的內容。
1. 請描述遇到的問題或關於改進的建議。儘可能提供細節資訊。
1. 點擊 **Submit new issue**。

提交之後，偶爾查看一下你所提交的問題，或者開啓 GitHub 通知。
評審人（reviewers）和其他社區成員可能在針對所提問題採取行動之前，問一些問題。

<!--
## Suggesting new content

If you have an idea for new content, but you aren't sure where it should go, you can
still file an issue. Either:

- Choose an existing page in the section you think the content belongs in and click **Create an issue**.
- Go to [GitHub](https://github.com/kubernetes/website/issues/new/) and file the issue directly.
-->
## 關於新內容的建議 {#suggesting-new-content}

如果你對新內容有想法，但是你不確定這些內容應該放在哪裏，你仍可以提出問題。

- 在預期的節區中選擇一個現有頁面，點擊 **提交文檔問題**。
- 前往 [GitHub Issues 頁面](https://github.com/kubernetes/website/issues/new/)，
  直接記錄問題。

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

## 如何更好地記錄問題 {#how-to-file-great-issues}

在記錄問題時，請注意以下事項：

- 提供問題的清晰描述，描述具體缺失的內容、過期的內容、錯誤的內容或者需要改進的文字。
- 解釋該問題對使用者的特定影響。
- 將給定問題的範圍限定在一個工作單位範圍內。如果問題牽涉的領域較大，可以將其分解爲多個小一點的問題。
  例如："Fix the security docs" 是一個過於寬泛的問題，而
  "Add details to the 'Restricting network access' topic"
  就是一個足夠具體的、可操作的問題。
- 搜索現有問題的列表，查看是否已經有相關的或者類似的問題已被記錄。
- 如果新問題與某其他問題或 PR 有關聯，可以使用其完整 URL 或帶 `#` 字符的 PR 編號來引用之。
  例如：`Introduced by #987654`。
- 遵從[行爲準則](/zh-cn/community/code-of-conduct/)。尊重同行貢獻者。
  例如，"The docs are terrible" 就是無用且無禮的反饋。
