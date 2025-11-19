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
除了承擔 [PR 管理者](/zh-cn/docs/contribute/participate/pr-wranglers)的職責外，
SIG Docs 正式的批准人（Approver）、評審人（Reviewer）和成員（Member）
按周輪流[歸類倉庫的 Issue](/zh-cn/docs/contribute/review/for-approvers/#triage-and-categorize-issues)。

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
## 職責   {#duties}

在爲期一週的輪值期內，Issue 管理者每天負責：

- 對收到的 Issue 進行日常分類和標記。有關 SIG Docs 如何使用元數據的指導說明，
  參閱[歸類 Issue](/zh-cn/docs/contribute/review/for-approvers/#triage-and-categorize-issues)。
- 密切關注 kubernetes/website 代碼倉庫中陳舊和過期的 Issue。
- 維護 [Issues 看板](https://github.com/orgs/kubernetes/projects/72/views/1)。

<!--
## Requirements

- Must be an active member of the Kubernetes organization.
- A minimum of 15 [non-trivial](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits)
  contributions to Kubernetes (of which a certain amount should be directed towards kubernetes/website).
- Performing the role in an informal capacity already.
-->
## 要求   {#requirements}

- 必須是 Kubernetes 組織的活躍成員。
- 至少爲 Kubernetes 做了 15
  個[非小微](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits)的貢獻
  （其中某些應是直接針對 kubernetes/website 的貢獻）。
- 已經以非正式身份履行該職責。

<!--
## Helpful Prow commands for wranglers

Below are some commonly used commands for Issue Wranglers:
-->
## 對管理者有幫助的 Prow 命令  {#helpful-prow-commands-for-wranglers}

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
# 重新打開 Issue
/reopen

# 將不切合 k/website 的 Issue 轉移到其他代碼倉庫
/transfer[-issue]

# 更改陳舊 Issue 的狀態
/remove-lifecycle rotten

# 更改過期 Issue 的狀態
/remove-lifecycle stale

# 爲 Issue 指派 SIG
/sig <sig_name>

# 添加具體領域
/area <area_name>

# 對新手友好的 Issue
/good-first-issue

# 需要幫助的 Issue
/help wanted

# 將 Issue 標記爲某種支持
/kind support

# 接受某個 Issue 的歸類
/triage accepted

# 關閉將不會處理且尚未修復的 Issue
/close not-planned
```

<!--
To find more Prow commands, refer to the [Command Help](https://prow.k8s.io/command-help) documentation.
-->
要查找更多 Prow 命令，請參閱[命令幫助](https://prow.k8s.io/command-help)文檔。

<!--
## When to close Issues

For an open source project to succeed, good issue management is crucial.
But it is also critical to resolve issues in order to maintain the repository
and communicate clearly with contributors and users.
-->
## 何時關閉 Issue   {#when-to-close-issues}

一個開源項目想要成功，良好的 Issue 管理非常關鍵。
但解決 Issue 也很重要，這樣才能維護代碼倉庫，並與貢獻者和使用者進行清晰明確的交流。

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
關閉 Issue 的時機包括：

- 類似的 Issue 被多次報告。你首先需要將其標記爲 `/triage duplicate`；
  將其鏈接到主要 Issue 然後關閉它。還建議將使用者引導至最初的 Issue。
- 通過所提供的信息很難理解和解決作者提出的 Issue。
  但要鼓勵使用者提供更多細節，或者在以後可以重現 Issue 時重新打開此 Issue 。
- 相同的功能在其他地方已實現。管理者可以關閉此 Issue 並將使用者引導至適當的位置。
- 報告的 Issue 當前未被計劃或不符合項目的目標。
- 如果 Issue 看起來是垃圾信息並且明顯不相關。
- 如果 Issue 與外部限制或依賴項有關並且超出了本項目的控制範圍。

<!--
To close an issue, leave a `/close` comment on the issue.
-->
要關閉 Issue，可以在 Issue 中留下一條 `/close` 的評論。
