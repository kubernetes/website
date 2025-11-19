---
title: 評閱人和批准人文檔
linktitle: 評閱人和批准人
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
[評閱人（Reviewers）](/zh-cn/docs/contribute/participate/#reviewers)
和[批准人（Approvers）](/zh-cn/docs/contribute/participate/#approvers)
在對變更進行評審時需要做一些額外的事情。

每週都有一個特定的文檔批准人自願負責對 PR 進行分類和評閱。
此角色稱作該周的“PR 管理者（PR Wrangler）”。
相關信息可參考 [PR Wrangler 排班表](https://github.com/kubernetes/website/wiki/PR-Wranglers)。
要成爲 PR Wangler，需要參加每週的 SIG Docs 例會，並自願報名。
即使當前這周排班沒有輪到你，你仍可以評閱那些尚未被積極評閱的 PRs。

除了上述的輪值安排，後臺機器人也會爲基於所影響的文件來爲 PR
指派評閱人和批准人。

<!-- body -->
<!--
## Reviewing a PR

Kubernetes documentation follows the
[Kubernetes code review process](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process).

Everything described in [Reviewing a pull request](/docs/contribute/review/reviewing-prs)
applies, but Reviewers and Approvers should also do the following:
-->
## 評閱 PR

Kubernetes 文檔遵循 [Kubernetes 代碼評閱流程](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process)。

[評閱 PR](/zh-cn/docs/contribute/review/reviewing-prs/) 文檔中所描述的所有規程都適用，
不過評閱人和批准人還要做以下工作：

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
- 根據需要使用 Prow 命令 `/assign` 指派特定的評閱人。如果某個 PR
  需要來自代碼貢獻者的技術審覈時，這一點非常重要。

  {{< note >}}
  你可以查看 Markdown 文件的文件頭，其中的 `reviewers` 字段給出了哪些人可以爲文檔提供技術審覈。
  {{< /note >}}

- 確保 PR 遵從[內容指南](/zh-cn/docs/contribute/style/content-guide/)和[樣式指南](/zh-cn/docs/contribute/style/style-guide/)；
  如果 PR 沒有達到要求，指引作者閱讀指南中的相關部分。
- 適當的時候使用 GitHub **Request Changes** 選項，建議 PR 作者實施所建議的修改。
- 當你所提供的建議被採納後，在 GitHub 中使用 `/approve` 或 `/lgtm` Prow 命令，改變評審狀態。

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

爲 PR 留下評語是很有用的，不過有時候你需要向他人的 PR 提交內容。

除非他人明確請求你的幫助或者你希望重啓一個被放棄很久的 PR，不要“接手”他人的工作。
儘管短期看來這樣做可以提高效率，但是也剝奪了他人提交貢獻的機會。

你所要遵循的流程取決於你需要編輯已經在 PR 範疇的文件，還是 PR 尚未觸碰的文件。

<!--
You can't commit into someone else's PR if either of the following things is
true:

- If the PR author pushed their branch directly to the
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  repository. Only a reviewer with push access can commit to another user's PR.
-->
如果處於下列情況之一，你不可以向別人的 PR 提交內容：

- 如果 PR 作者是直接將自己的分支提交到
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  倉庫。只有具有推送權限的評閱人纔可以向他人的 PR 提交內容。

  {{< note >}}
  <!--
  Encourage the author to push their branch to their fork before
  opening the PR next time.
  -->
  我們應鼓勵作者下次將分支推送到自己的克隆副本之後再發起 PR。
  {{< /note >}}

<!--
- The PR author explicitly disallows edits from approvers.
-->
- PR 作者明確地禁止批准人編輯他/她的 PR。

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
## 評閱用的 Prow 命令

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md)
是基於 Kubernetes 的 CI/CD 系統，基於拉取請求（PR）的觸發運行不同任務。
Prow 使得我們可以使用會話機器人一樣的命令跨整個 Kubernetes 組織處理 GitHub
動作，例如[添加和刪除標籤](#adding-and-removing-issue-labels)、關閉 Issues
以及指派批准人等等。你可以使用 `/<命令名稱>` 的形式以 GitHub 評論的方式輸入
Prow 命令。

評閱人和批准人最常用的 Prow 命令有：

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
{{< table caption="評閱用 Prow 命令" >}}
Prow 命令 | 角色限制 | 描述
:------------|:------------------|:-----------
`/lgtm` | 組織成員 | 用來表明你已經完成 PR 的評閱並對其所作變更表示滿意
`/approve` | 批准人 | 批准某 PR 可以合併
`/assign` |任何人 | 指派某人來評閱或批准某 PR
`/close` | 組織成員 | 關閉 Issue 或 PR
`/hold` | 任何人 | 添加 `do-not-merge/hold` 標籤，用來表明 PR 不應被自動合併
`/hold cancel` | 任何人 | 去掉 `do-not-merge/hold` 標籤
{{< /table >}}

要查看可以在 PR 中使用的命令，請參閱
[Prow 命令指南](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite)。

<!--
## Triage and categorize issues

In general, SIG Docs follows the
[Kubernetes issue triage](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md)
process and uses the same labels.

This GitHub Issue [filter](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
finds issues that might need triage.
-->
## 對 Issue 進行診斷和分類

一般而言，SIG Docs 遵從 [Kubernetes issue 判定](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md) 流程並使用相同的標籤。

此 GitHub Issue
[過濾器](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
可以用來查找需要評判的 Issues。

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

### 評判 Issue {#triaging-an-issue}

1. 驗證 Issue 的合法性

  - 確保 Issue 是關於網站文檔的。某些 Issue 可以通過回答問題或者爲報告者提供
    資源鏈接來快速關閉。
    參考[請求支持或代碼缺陷報告](#support-requests-or-code-bug-reports)
    節以瞭解詳細信息。
  - 評估該 Issue 是否有價值。
  - 如果 Issue 缺少足夠的細節以至於無法採取行動，或者報告者沒有通過模版提供
    足夠信息，可以添加 `triage/needs-information` 標籤。
  - 如果 Issue 同時標註了 `lifecycle/stale` 和 `triage/needs-information`
    標籤，可以直接關閉。

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
2. 添加優先級標籤（
  [Issue 判定指南](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority)中有優先級標籤的詳細定義)

  {{< table caption="Issue 標籤" >}}
  標籤         | 描述
  :------------|:------------------
  `priority/critical-urgent` | 應馬上處理
  `priority/important-soon` | 應在 3 個月內處理
  `priority/important-longterm` | 應在 6 個月內處理
  `priority/backlog` | 可無限期地推遲，可在人手充足時處理
  `priority/awaiting-more-evidence` | 佔位符，標示 Issue 可能是一個不錯的 Issue，避免該 Issue 被忽略或遺忘
  `help` or `good first issue` | 適合對 Kubernetes 或 SIG Docs 經驗較少的貢獻者來處理。更多信息可參考[需要幫助和入門候選 Issue 標籤](https://kubernetes.dev/docs/guide/help-wanted/)。
  {{< /table >}}

   基於你自己的判斷，你可以選擇某 Issue 來處理，爲之發起 PR
   （尤其是那些可以很快處理或與你已經在做的工作相關的 Issue）。

如果你對 Issue 評判有任何問題，可以在 `#sig-docs` Slack 頻道或者
[kubernetes-sig-docs 郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
中提問。

<!--
## Adding and removing issue labels

To add a label, leave a comment in one of the following formats:

- `/<label-to-add>` (for example, `/good-first-issue`)
- `/<label-category> <label-to-add>` (for example, `/triage needs-information` or `/language ja`)

To remove a label, leave a comment in one of the following formats:

- `/remove-<label-to-remove>` (for example, `/remove-help`)
- `/remove-<label-category> <label-to-remove>` (for example, `/remove-triage needs-information`)
-->
## 添加和刪除 Issue 標籤 {#adding-and-removing-issue-labels}

要添加標籤，可以用以下形式對 PR 進行評論：

- `/<要添加的標籤>` （例如, `/good-first-issue`）
- `/<標籤類別> <要添加的標籤>` （例如，`/triage needs-information` 或 `/language ja`）

要移除某個標籤，可以用以下形式對 PR 進行評論：

- `/remove-<要移除的標籤>` （例如，`/remove-help`）
- `/remove-<標籤類別> <要移除的標籤>` （例如，`/remove-triage needs-information`）

<!--
In both cases, the label must already exist. If you try to add a label that does not exist, the command is
silently ignored.

For a list of all labels, see the [website repository's Labels section](https://github.com/kubernetes/website/labels).
Not all labels are used by SIG Docs.
-->
在以上兩種情況下，標籤都必須合法存在。如果你嘗試添加一個尚不存在的標籤，
對應的命令會被悄悄忽略。

關於所有標籤的完整列表，可以參考
[Website 倉庫的標籤節](https://github.com/kubernetes/website/labels)。
實際上，SIG Docs 並沒有使用全部標籤。

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
### Issue 生命週期標籤

Issues 通常都可以快速創建並關閉。
不過也有些時候，某個 Issue 被創建之後會長期處於非活躍狀態。
也有一些時候，即使超過 90 天，某個 Issue 仍應保持打開狀態。

{{< table caption="Issue 生命週期標籤" >}}
標籤         | 描述
:------------|:------------------
`lifecycle/stale` | 過去 90 天內某 Issue 無人問津，會被自動標記爲停滯狀態。如果 Issue 沒有被 `/remove-lifecycle stale` 命令重置生命期，就會被自動關閉。
`lifecycle/frozen` | 對應的 Issue 即使超過 90 天仍無人處理也不會進入停滯狀態。使用者手動添加此標籤給一些需要保持打開狀態超過 90 天的 Issue，例如那些帶有 `priority/important-longterm` 標籤的 Issue。
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
## 處理特殊的 Issue 類型 {#handling-special-issue-types}

SIG Docs 常常會遇到以下類型的 Issue，因此對其處理方式描述如下。

### 重複的 Issue {#duplicate-issues}

如果針對同一個問題有不止一個打開的 Issue，可以將其合併爲一個 Issue。
你需要決定保留哪個 Issue 爲打開狀態（或者重新登記一個新的 Issue），
然後將所有相關的信息複製過去並提供對關聯 Issues 的鏈接。
最後，將所有其他描述同一問題的 Issue 標記爲 `triage/duplicate` 並關閉之。
保持只有一個 Issue 待處理有助於減少困惑，避免在同一問題上發生重複勞動。

<!--
### Dead link issues

If the dead link issue is in the API or `kubectl` documentation, assign them
`/priority critical-urgent` until the problem is fully understood. Assign all
other dead link issues `/priority important-longterm`, as they must be manually fixed.

### Blog issues

We expect [Kubernetes Blog](/blog/) entries to become
outdated over time. Therefore, we only maintain blog entries less than a year old.
If an issue is related to a blog entry that is more than one year old,
you should typically close the issue without fixing.

You can send a link to [article updates and maintenance](/docs/contribute/blog/#maintenance)
as part of the message you send when you close the PR.

It is OK to make an exception where a relevant justification applies.
-->
### 失效鏈接 Issues {#dead-link-issues}

如果失效鏈接是關於 API 或者 `kubectl` 文檔的，可以將其標記爲
`/priority critical-urgent`，直到問題原因被弄清楚爲止。
對於其他的鏈接失效問題，可以標記 `/priority important-longterm`，
因爲這些問題都需要手動處理。

### 博客問題  {#blog-issues}

我們預期 [Kubernetes 博客](/zh-cn/blog/)中的文章隨着時間推移都會過時。
因此，我們只維護髮布時間在一年內的博客文章。
如果某個 Issue 是與發佈時間超過一年的博客文章相關的，
可以直接關閉此 Issue，不必修復。

你可以在關閉 PR 時，附上[文章更新與維護](/zh-cn/docs/contribute/blog/#maintenance)鏈接，
作爲回覆的一部分。

如果有合理的解釋或特殊情況，也可以作爲例外酌情處理。

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
### 請求支持或代碼缺陷報告  {#support-requests-or-code-bug-reports}

某些文檔 Issues 實際上是關於底層代碼的 Issue 或者在某方面請求協助的問題，
例如某個教程無法正常工作。
對於與文檔無關的 Issues，關閉它並打上標籤 `kind/support`，可以通過評論
告知請求者其他支持渠道（Slack、Stack Overflow）。
如果有相關的其他倉庫，可以告訴請求者應該在哪個倉庫登記與功能特性相關的 Issues
（通常會是 `kubernetes/kubernetes`）。

下面是對支持請求的回覆示例：

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
對代碼缺陷 Issue 的回覆示例：

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
### 壓縮（Squashing）提交

作爲一名 Approver，當你評審 PR 時，可能會遇到以下幾種情況：

- 建議貢獻者壓縮他們的提交。
- 協助貢獻者壓縮提交。
- 建議貢獻者先不要壓縮提交。
- 阻止壓縮提交。

<!--
**Advising contributors to squash**: A new contributor might not know that they
should squash commits in their pull requests (PRs). If this is the case, advise
them to do so, provide links to useful information, and offer to arrange help if
they need it. Some useful links:

- [Opening pull requests and squashing your commits](/docs/contribute/new-content/open-a-pr#squashing-commits)
  for documentation contributors.
- [GitHub Workflow](https://www.k8s.dev/docs/guide/github-workflow/), including diagrams, for developers.
-->
**建議貢獻者壓縮提交**：新貢獻者可能不知道要壓縮 PR 中的提交。
如果是這種情況，Approver 要給出壓縮提交的建議，並貼附有用的鏈接，
並在貢獻者需要幫助時伸出援手。這裏有一些有用的鏈接：

- 協助文檔貢獻者[提 PR 和壓縮提交](/zh-cn/docs/contribute/new-content/open-a-pr#squashing-commits)。
- 面向開發者包括插圖在內的 [GitHub 工作流程](https://www.k8s.dev/docs/guide/github-workflow/)。

<!--
**Squashing commits for contributors**: If a contributor might have difficulty
squashing commits or there is time pressure to merge a PR, you can perform the
squash for them:
-->
**協助貢獻者壓縮提交**：如果貢獻者壓縮提交遇到難題或合併 PR 的時間緊迫，
你可以協助貢獻者執行壓縮提交的操作。

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
  倉庫[被設定爲允許壓縮提交後合併 PR](https://docs.github.com/zh/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests)。
  你只需選擇 **Squash commits** 按鈕。
- 在 PR 中，如果貢獻者允許 Maintainer 們管理 PR，你就可以爲他們壓縮提交併將其 fork 更新爲最新結果。
  在你執行壓縮提交之後，請建議貢獻者將壓縮後的提交拉到他們本地的克隆副本。
- 你可以使用標籤讓 GitHub 壓縮提交，這樣 Tide / GitHub 就會對提交執行壓縮；
  你還可以在合併 PR 時點選 **Squash commits** 按鈕。

<!--
**Advise contributors to avoid squashing**

- If one commit does something broken or unwise, and the last commit reverts this
  error, don't squash the commits. Even though the "Files changed" tab in the PR
  on GitHub and the Netlify preview will both look OK, merging this PR might create
  rebase or merge conflicts for other folks. Intervene as you see fit to avoid that
  risk to other contributors.
-->
**建議貢獻者避免壓縮提交**

- 如果一個提交做了一些破壞性或不明智的修改，那最後一個提交可用於回滾錯誤，這種情況不要壓縮提交。
  即使通過 GitHub 上 PR 中的 "Files changed" 頁籤以及 Netlify 預覽看起來都正常，
  合併這種 PR 可能會在其他 fork 中造成 rebase 或合併衝突。
  你看到這種情況要進行合理的干預，避免對其他貢獻者造成麻煩。

<!--
**Never squash**

- If you're launching a localization or releasing the docs for a new version,
  you are merging in a branch that's not from a user's fork, _never squash the commits_.
  Not squashing is essential because you must maintain the commit history for those files.
-->
**千萬不要壓縮提交**

- 如果你爲新版本發起了一次本地化批量作業或爲新版發佈許多文檔，那你要合併到的分支將與使用者 fork 的分支不同，
  這種情況**千萬不要壓縮提交**。之所以不壓縮提交，是因爲你必須保持這些文件的提交歷史記錄。
