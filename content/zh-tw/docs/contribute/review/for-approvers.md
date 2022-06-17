---
title: 評閱人和批准人文件
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
SIG Docs [Reviewers](/docs/contribute/participate/roles-and-responsibilities/#reviewers) and [Approvers](/docs/contribute/participate/roles-and-responsibilities/#approvers) do a few extra things when reviewing a change.

Every week a specific docs approver volunteers to triage
and review pull requests. This
person is the "PR Wrangler" for the week. See the
[PR Wrangler scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers) for more information. To become a PR Wrangler, attend the weekly SIG Docs meeting and volunteer. Even if you are not on the schedule for the current week, you can still review pull
requests (PRs) that are not already under active review.

In addition to the rotation, a bot assigns reviewers and approvers
for the PR based on the owners for the affected files.
-->
SIG Docs
[評閱人（Reviewers）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#reviewers)
和[批准人（Approvers）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#approvers)
在對變更進行評審時需要做一些額外的事情。

每週都有一個特定的文件批准人自願負責對 PR 進行分類和評閱。
此角色稱作該周的“PR 管理者（PR Wrangler）”。
相關資訊可參考 [PR Wrangler 排班表](https://github.com/kubernetes/website/wiki/PR-Wranglers)。
要成為 PR Wangler，需要參加每週的 SIG Docs 例會，並自願報名。
即使當前這周排班沒有輪到你，你仍可以評閱那些尚未被積極評閱的 PRs。

除了上述的輪值安排，後臺機器人也會為基於所影響的檔案來為 PR
指派評閱人和批准人。

<!-- body -->
<!--
## Reviewing a PR
Kubernetes documentation follows the [Kubernetes code review process](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process).

Everything described in [Reviewing a pull request](/docs/contribute/review/reviewing-prs) applies, but Reviewers and Approvers should also do the following:
-->
## 評閱 PR

Kubernetes 文件遵循 [Kubernetes 程式碼評閱流程](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process)。

[評閱 PR](/zh-cn/docs/contribute/review/reviewing-prs/) 文件中所描述的所有規程都適用，
不過評閱人和批准人還要做以下工作：

<!--
- Using the `/assign` Prow command to assign a specific reviewer to a PR as needed. This is extra important
when it comes to requesting technical review from code contributors.

  {{< note >}}
  Look at the `reviewers` field in the front-matter at the top of a Markdown file to see who can
  provide technical review.
  {{< /note >}}

- Making sure the PR follows the [Content](/docs/contribute/style/content-guide/) and [Style](/docs/contribute/style/style-guide/) guides; link the author to the relevant part of the guide(s) if it doesn't.
- Using the GitHub **Request Changes** option when applicable to suggest changes to the PR author.
- Changing your review status in GitHub using the `/approve` or `/lgtm` Prow commands, if your suggestions are implemented.
-->
- 根據需要使用 Prow 命令 `/assign` 指派特定的評閱人。如果某個 PR
  需要來自程式碼貢獻者的技術稽核時，這一點非常重要。

  {{< note >}}
  你可以檢視 Markdown 檔案的檔案頭，其中的 `reviewers` 欄位給出了哪些人可以為文件提供技術稽核。
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

為 PR 留下評語是很有用的，不過有時候你需要向他人的 PR 提交內容。

除非他人明確請求你的幫助或者你希望重啟一個被放棄很久的 PR，不要“接手”他人的工作。
儘管短期看來這樣做可以提高效率，但是也剝奪了他人提交貢獻的機會。

你所要遵循的流程取決於你需要編輯已經在 PR 範疇的檔案，還是 PR 尚未觸碰的檔案。

<!--
You can't commit into someone else's PR if either of the following things is
true:

- If the PR author pushed their branch directly to the
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  repository. Only a reviewer with push access can commit to another user's PR.

  {{< note >}}
  Encourage the author to push their branch to their fork before
  opening the PR next time.
  {{< /note >}}

- The PR author explicitly disallows edits from approvers.
-->
如果處於下列情況之一，你不可以向別人的 PR 提交內容：

- 如果 PR 作者是直接將自己的分支提交到
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  倉庫。只有具有推送許可權的評閱人才可以向他人的 PR 提交內容。

  {{< note >}}
  我們應鼓勵作者下次將分支推送到自己的克隆副本之後再發起 PR。
  {{< /note >}}

- PR 作者明確地禁止批准人編輯他/她的 PR。

<!--
## Prow commands for reviewing

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md) is
the Kubernetes-based CI/CD system that runs jobs against pull requests (PRs). Prow
enables chatbot-style commands to handle GitHub actions across the Kubernetes
organization, like [adding and removing labels](#adding-and-removing-issue-labels), closing issues, and assigning an approver. Enter Prow commands as GitHub comments using the `/<command-name>` format.

The most common prow commands reviewers and approvers use are:
-->
## 評閱用的 Prow 命令

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md)
是基於 Kubernetes 的 CI/CD 系統，基於拉取請求（PR）的觸發執行不同任務。
Prow 使得我們可以使用會話機器人一樣的命令跨整個 Kubernetes 組織處理 GitHub
動作，例如[新增和刪除標籤](#adding-and-removing-issue-labels)、關閉 Issues
以及指派批准人等等。你可以使用 `/<命令名稱>` 的形式以 GitHub 評論的方式輸入
Prow 命令。

評閱人和批准人最常用的 Prow 命令有：

<!--
{{< table caption="Prow commands for reviewing" >}}
Prow Command | Role Restrictions | Description
:------------|:------------------|:-----------
`/lgtm` | Organization members | Signals that you've finished reviewing a PR and are satisfied with the changes.
`/approve` | Approvers | Approves a PR for merging.
`/assign` | Reviewers or Approvers | Assigns a person to review or approve a PR
`/close` | Reviewers or Approvers | Closes an issue or PR.
`/hold` | Anyone | Adds the `do-not-merge/hold` label, indicating the PR cannot be automatically merged.
`/hold cancel` | Anyone | Removes the `do-not-merge/hold` label.
{{< /table >}}

See [the Prow command reference](https://prow.k8s.io/command-help) to see the full list
of commands you can use in a PR.
-->
{{< table caption="評閱用 Prow 命令" >}}
Prow 命令 | 角色限制 | 描述
:------------|:------------------|:-----------
`/lgtm` | 組織成員 | 用來表明你已經完成 PR 的評閱並對其所作變更表示滿意
`/approve` | 批准人 | 批准某 PR 可以合併
`/assign` |評閱人或批准人 | 指派某人來評閱或批准某 PR
`/close` | 評閱人或批准人 | 關閉 Issue 或 PR
`/hold` | 任何人 | 新增 `do-not-merge/hold` 標籤，用來表明 PR 不應被自動合併
`/hold cancel` | 任何人 | 去掉 `do-not-merge/hold` 標籤
{{< /table >}}

請參考 [Prow 命令指南](https://prow.k8s.io/command-help)，瞭解你可以在 PR
中使用的命令的完整列表。

<!--
## Triage and categorize issues

In general, SIG Docs follows the [Kubernetes issue triage](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md) process and uses the same labels.

This GitHub Issue [filter](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
finds issues that might need triage.
-->
## 對 Issue 進行診斷和分類

一般而言，SIG Docs 遵從 [Kubernetes issue 判定](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md) 流程並使用相同的標籤。

此 GitHub Issue
[過濾器](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
可以用來查詢需要評判的 Issues。

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

  - 確保 Issue 是關於網站文件的。某些 Issue 可以透過回答問題或者為報告者提供
    資源連結來快速關閉。
    參考[請求支援或程式碼缺陷報告](#support-requests-or-code-bug-reports)
    節以瞭解詳細資訊。
  - 評估該 Issue 是否有價值。
  - 如果 Issue 缺少足夠的細節以至於無法採取行動，或者報告者沒有透過模版提供
    足夠資訊，可以新增 `triage/needs-information` 標籤。
  - 如果 Issue 同時標註了 `lifecycle/stale` 和 `triage/needs-information`
    標籤，可以直接關閉。

<!--
2. Add a priority label (the
  [Issue Triage Guidelines](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority) define priority labels in detail)

  < table caption="Issue labels" >
  Label | Description
  :------------|:------------------
  `priority/critical-urgent` | Do this right now.
  `priority/important-soon` | Do this within 3 months.
  `priority/important-longterm` | Do this within 6 months.
  `priority/backlog` | Deferrable indefinitely. Do when resources are available.
  `priority/awaiting-more-evidence` | Placeholder for a potentially good issue so it doesn't get lost.
  `help` or `good first issue` | Suitable for someone with very little Kubernetes or SIG Docs experience. See [Help Wanted and Good First Issue Labels](https://kubernetes.dev/docs/guide/help-wanted/) for more information.

  At your discretion, take ownership of an issue and submit a PR for it
  (especially if it's quick or relates to work you're already doing).

If you have questions about triaging an issue, ask in `#sig-docs` on Slack or
the [kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
-->
2. 新增優先順序標籤（
  [Issue 判定指南](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority)中有優先順序標籤的詳細定義)

  {{< table caption="Issue 標籤" >}}
  標籤         | 描述
  :------------|:------------------
  `priority/critical-urgent` | 應馬上處理
  `priority/important-soon` | 應在 3 個月內處理
  `priority/important-longterm` | 應在 6 個月內處理
  `priority/backlog` | 可無限期地推遲，可在人手充足時處理
  `priority/awaiting-more-evidence` | 佔位符，標示 Issue 可能是一個不錯的 Issue，避免該 Issue 被忽略或遺忘
  `help` or `good first issue` | 適合對 Kubernetes 或 SIG Docs 經驗較少的貢獻者來處理。更多資訊可參考[需要幫助和入門候選 Issue 標籤](https://kubernetes.dev/docs/guide/help-wanted/)。
  {{< /table >}}

   基於你自己的判斷，你可以選擇某 Issue 來處理，為之發起 PR
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
- `/remove-<label-category> <label-to-remove>` (for example, `/remove-triage needs-information`)`
-->
## 新增和刪除 Issue 標籤 {#adding-and-removing-issue-labels}

要新增標籤，可以用以下形式對 PR 進行評論：

- `/<要新增的標籤>` （例如, `/good-first-issue`）
- `/<標籤類別> <要新增的標籤>` （例如，`/triage needs-information` 或 `/language ja`）

要移除某個標籤，可以用以下形式對 PR 進行評論：

- `/remove-<要移除的標籤>` （例如，`/remove-help`）
- `/remove-<標籤類別> <要移除的標籤>` （例如，`/remove-triage needs-information`）

<!--
In both cases, the label must already exist. If you try to add a label that does not exist, the command is
silently ignored.

For a list of all labels, see the [website repository's Labels section](https://github.com/kubernetes/website/labels). Not all labels are used by SIG Docs.
-->
在以上兩種情況下，標籤都必須合法存在。如果你嘗試新增一個尚不存在的標籤，
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

Issues 通常都可以快速建立並關閉。
不過也有些時候，某個 Issue 被建立之後會長期處於非活躍狀態。
也有一些時候，即使超過 90 天，某個 Issue 仍應保持開啟狀態。

{{< table caption="Issue 生命週期標籤" >}}
標籤         | 描述
:------------|:------------------
`lifecycle/stale` | 過去 90 天內某 Issue 無人問津，會被自動標記為停滯狀態。如果 Issue 沒有被 `/remove-lifecycle stale` 命令重置生命期，就會被自動關閉。
`lifecycle/frozen` | 對應的 Issue 即使超過 90 天仍無人處理也不會進入停滯狀態。使用者手動新增此標籤給一些需要保持開啟狀態超過 90 天的 Issue，例如那些帶有 `priority/important-longterm` 標籤的 Issue。
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
## 處理特殊的 Issue 型別 {#handling-special-issue-types}

SIG Docs 常常會遇到以下型別的 Issue，因此對其處理方式描述如下。

### 重複的 Issue {#duplicate-issues}

如果針對同一個問題有不止一個開啟的 Issue，可以將其合併為一個 Issue。
你需要決定保留哪個 Issue 為開啟狀態（或者重新登記一個新的 Issue），
然後將所有相關的資訊複製過去並提供對關聯 Issues 的連結。
最後，將所有其他描述同一問題的 Issue 標記為 `triage/duplicate` 並關閉之。
保持只有一個 Issue 待處理有助於減少困惑，避免在同一問題上發生重複勞動。

<!--
### Dead link issues

If the dead link issue is in the API or `kubectl` documentation, assign them `/priority critical-urgent` until the problem is fully understood. Assign all other dead link issues `/priority important-longterm`, as they must be manually fixed.

### Blog issues

We expect [Kubernetes Blog](https://kubernetes.io/blog/) entries to become
outdated over time. Therefore, we only maintain blog entries less than a year old.
If an issue is related to a blog entry that is more than one year old,
close the issue without fixing.
-->
### 失效連結 Issues {#dead-link-issues}

如果失效連結是關於 API 或者 `kubectl` 文件的，可以將其標記為
`/priority critical-urgent`，直到問題原因被弄清楚為止。
對於其他的連結失效問題，可以標記 `/priority important-longterm`，
因為這些問題都需要手動處理。

### 部落格問題  {#blog-issues}

我們預期 [Kubernetes 部落格](https://kubernetes.io/blog/)條目隨著時間推移都會過期。
因此，我們只維護一年內的部落格條目。
如果某個 Issue 是與某個超過一年的部落格條目有關的，可以直接關閉
Issue，不必修復。

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
### 請求支援或程式碼缺陷報告  {#support-requests-or-code-bug-reports}

某些文件 Issues 實際上是關於底層程式碼的 Issue 或者在某方面請求協助的問題，
例如某個教程無法正常工作。
對於與文件無關的 Issues，關閉它並打上標籤 `kind/support`，可以透過評論
告知請求者其他支援渠道（Slack、Stack Overflow）。
如果有相關的其他倉庫，可以告訴請求者應該在哪個倉庫登記與功能特性相關的 Issues
（通常會是 `kubernetes/kubernetes`）。

下面是對支援請求的回覆示例：

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
對程式碼缺陷 Issue 的回覆示例：

```none
This sounds more like an issue with the code than an issue with
the documentation. Please open an issue at
https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```
