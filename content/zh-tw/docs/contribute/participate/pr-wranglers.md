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
SIG Docs 的[批准人（Approver）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#approvers)
們每週輪流負責[管理倉庫的 PR](https://github.com/kubernetes/website/wiki/PR-Wranglers)。

本節介紹 PR 管理者的職責。關於如何提供較好的評審意見，
可參閱[評審變更](/zh-cn/docs/contribute/review/)。

<!-- body -->
<!--
## Duties

Each day in a week-long shift as PR Wrangler:

- Review [open pull requests](https://github.com/kubernetes/website/pulls) for quality
  and adherence to the [Style](/docs/contribute/style/style-guide/) and
  [Content](/docs/contribute/style/content-guide/) guides.
  - Start with the smallest PRs (`size/XS`) first, and end with the largest (`size/XXL`).
    Review as many PRs as you can.
-->
## 職責 {#duties}

在爲期一週的輪值期內，PR 管理者要：

- 檢查[懸決的 PR](https://github.com/kubernetes/website/pulls)
  的質量並確保它們符合[樣式指南](/zh-cn/docs/contribute/style/style-guide/)和
  [內容指南](/zh-cn/docs/contribute/style/content-guide/)要求。

  - 首先查看最小的 PR（`size/XS`），然後逐漸擴展到最大的
    PR（`size/XXL`），儘可能多地評審 PR。
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
- 確保貢獻者簽署 [CLA](https://github.com/kubernetes/community/blob/master/CLA.md)。
  - 使用[此腳本](https://github.com/zparnold/k8s-docs-pr-botherer)自動提醒尚未簽署
    CLA 的貢獻者簽署 CLA。
- 針對變更提供反饋，請求其他 SIG 的成員進行技術審覈。
  - 爲 PR 所建議的內容更改提供就地反饋。
  - 如果你需要驗證內容，請在 PR 上發表評論並要求貢獻者提供更多細節。
  - 設置相關的 `sig/` 標籤。
  - 如果需要，根據文件開頭的 `reviewers:` 塊來指派評審人。
  - 你也可以通過在 PR 上作出 `@kubernetes/<sig>-pr-reviews` 的評論以標記需要某個
    [SIG](https://github.com/kubernetes/community/blob/master/sig-list.md) 來評審。
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
- 使用 `/approve` 評論來批准可以合併的 PR，在 PR 就緒時將其合併。
  - PR 在被合併之前，應該有來自其他成員的 `/lgtm` 評論。
  - 可以考慮接受那些技術上準確、
    但文風上不滿足[風格指南](/zh-cn/docs/contribute/style/style-guide/)要求的 PR。
    批准變更時，可以登記一個新的 Issue 來解決文檔風格問題。
    你通常可以將這些風格修復問題標記爲 `good first issue`。
  - 將風格修復事項標記爲 `good first issue` 可以很好地確保向新加入的貢獻者分派一些比較簡單的任務，
    這有助於接納新的貢獻者。

<!--
- Also check for pull requests against the [reference docs generator](https://github.com/kubernetes-sigs/reference-docs)
  code, and review those (or bring in help).
- Support the [issue wrangler](/docs/contribute/participate/issue-wrangler/) to
  triage and tag incoming issues daily.
  See [Triage and categorize issues](/docs/contribute/review/for-approvers/#triage-and-categorize-issues)
  for guidelines on how SIG Docs uses metadata.
-->
- 同時檢查針對[參考文檔生成器](https://github.com/kubernetes-sigs/reference-docs)的代碼拉取請求，
  並對其進行審查（或尋求幫助）。
- 支持[問題管理者](/zh-cn/docs/contribute/participate/issue-wrangler/)每日對新問題進行分類和標記。
  參見[分類和組織問題](/zh-cn/docs/contribute/review/for-approvers/#triage-and-categorize-issues)
  瞭解 SIG Docs 如何使用元數據。

{{< note >}}
<!--
PR wrangler duties do not apply to localization PRs (non-English PRs).
Localization teams have their own processes and teams for reviewing their language PRs.
However, it's often helpful to ensure language PRs are labeled correctly,
review small non-language dependent PRs (like a link update),
or tag reviewers or contributors in long-running PRs
(ones opened more than 6 months ago and have not been updated in a month or more).
-->
PR 管理者的職責不適用於本地化 PR（非英語 PR）。
本地化團隊有自己的流程和團隊來審查其語言 PR。
但是，其對於確保被語言 PR 被正確標記，審查與語言無關的小型 PR（如鏈接更新），或爲長期擱置的
PR（已打開超過 6 個月且一個月或更長時間未更新的）添加審閱者或貢獻者標籤通常很有幫助。
{{< /note >}}

<!--
### Helpful GitHub queries for wranglers

The following queries are helpful when wrangling.
After working through these queries, the remaining list of PRs to review is usually small.
These queries exclude localization PRs. All queries are against the main branch except the last one.
-->
### 對管理者有用的 GitHub 查詢   {#helpful-github-queries-for-wranglers}

執行管理操作時，以下查詢很有用。完成以下這些查詢後，剩餘的要評審的 PR 列表通常很小。
這些查詢都不包含本地化的 PR，並僅包含主分支上的 PR（除了最後一個查詢）。

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
- [未簽署 CLA，不可合併的 PR](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3Alanguage%2Fen)：
  提醒貢獻者簽署 CLA。如果機器人和評審者都已經提醒他們，請關閉 PR，並提醒他們在簽署 CLA 後可以重新提交。

  **在作者沒有簽署 CLA 之前，不要評審他們的 PR！**

- [需要 LGTM](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+-label%3Algtm)：
  列舉需要來自成員的 LGTM 評論的 PR。
  如果需要技術審查，請告知機器人所建議的評審者。
  如果 PR 繼續改進，就地提供更改建議或反饋。

- [已有 LGTM標籤，需要 Docs 團隊批准](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+label%3Algtm+)：
  列舉需要 `/approve` 評論來合併的 PR。

- [快速批閱](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amain+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3A%22cncf-cla%3A+yes%22+label%3A%22size%2FXS%22+label%3A%22language%2Fen%22)：
  列舉針對主分支的、沒有明確合併障礙的 PR。
  在瀏覽 PR 時，可以將 "XS" 尺寸標籤更改爲 "S"、"M"、"L"、"XL"、"XXL"。

- [非主分支的 PR](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3Alanguage%2Fen+-base%3Amain): 
  如果 PR 針對 `dev-` 分支，則表示它適用於即將發佈的版本。
  請添加帶有 `/assign @<負責人的 github 賬號>`，
  將其指派給[發行版本負責人](https://github.com/kubernetes/sig-release/tree/master/release-team#kubernetes-release-team-roles)。
  如果 PR 是針對舊分支，請幫助 PR 作者確定是否所針對的是最合適的分支。

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
### 對管理者有用的 Prow 命令  {#helpful-prow-commands-for-wranglers}

```
# 添加 English 標籤
/language en

# 如果 PR 包含多個提交（commits），添加 squash 標籤
/label tide/merge-method-squash

# 使用 Prow 來爲 PR 重設標題（例如一個正在處理 [WIP] 的 PR 或爲 PR 提供更好的細節信息）
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
### 何時關閉 PR     {#when-to-close-pull-requests}

審查和批准是縮短和更新我們的 PR 隊列的一種方式；另一種方式是關閉 PR。

當以下條件滿足時，可以關閉 PR：

- 作者兩週內未簽署 CLA。
  PR 作者可以在簽署 CLA 後重新打開 PR，因此這是確保未簽署 CLA 的 PR 不會被合併的一種風險較低的方法。

- 作者在兩週或更長時間內未回覆評論或反饋。

不要害怕關閉 PR。貢獻者可以輕鬆地重新打開並繼續工作。
通常，關閉通知會激勵作者繼續完成其貢獻。

要關閉 PR，請在 PR 上輸入 `/close` 評論。

{{< note >}}
<!--
The [`k8s-triage-robot`](https://github.com/k8s-triage-robot) bot marks issues
as stale after 90 days of inactivity. After 30 more days it marks issues as rotten
and closes them. PR wranglers should close issues after 14-30 days of inactivity.
-->
一個名爲 [`k8s-ci-robot`](https://github.com/k8s-ci-robot) 的自動服務會在 Issue 停滯 90
天后自動將其標記爲過期；然後再等 30 天，如果仍然無人過問，則將其關閉。
PR 管理者應該在 Issue 處於無人過問狀態 14-30 天后關閉它們。
{{< /note >}}

<!--
## PR Wrangler shadow program

In late 2021, SIG Docs introduced the PR Wrangler Shadow Program.
The program was introduced to help new contributors understand the PR wrangling process.
-->
## PR 管理者影子計劃   {#pr-wrangler-shadow-program}

2021 下半年，SIG Docs 推出了 PR 管理者影子計劃（PR Wrangler Shadow Program）。
該計劃旨在幫助新的貢獻者們瞭解 PR 管理流程。

<!-- 
### Become a shadow

- If you are interested in shadowing as a PR wrangler, please visit the
  [PR Wranglers Wiki page](https://github.com/kubernetes/website/wiki/PR-Wranglers)
  to see the PR wrangling schedule for this year and sign up.

- Others can reach out on the [#sig-docs Slack channel](https://kubernetes.slack.com/messages/sig-docs)
  for requesting to shadow an assigned PR Wrangler for a specific week. Feel free to reach out to one of
  the [SIG Docs co-chairs/leads](https://github.com/kubernetes/community/tree/master/sig-docs#leadership).

- Once you've signed up to shadow a PR Wrangler, introduce yourself to the PR Wrangler on the
  [Kubernetes Slack](https://slack.k8s.io).
-->
### 成爲一名影子   {#become-a-shadow}

- 如果你有興趣成爲一名 PR 管理者的影子，請訪問
  [PR 管理者維基頁面](https://github.com/kubernetes/website/wiki/PR-Wranglers)查看今年的
  PR 管理輪值表，然後註冊報名。

- 其他人可以通過 [#sig-docs Slack 頻道](https://kubernetes.slack.com/messages/sig-docs)申請成爲指定
  PR 管理者某一週的影子。可以隨時諮詢某一位
  [SIG Docs 聯席主席/主管](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)。

- 註冊成爲一名 PR 管理者的影子時，
  請你在 [Kubernetes Slack](https://slack.k8s.io) 向這名 PR 管理者做一次自我介紹。
