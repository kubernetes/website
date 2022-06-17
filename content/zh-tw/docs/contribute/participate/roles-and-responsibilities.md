---
title: 角色與責任
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
任何人都可以為 Kubernetes 作出貢獻。隨著你對 SIG Docs 的貢獻增多，你可以申請
社群內不同級別的成員資格。
這些角色使得你可以在社群中承擔更多的責任。
每個角色都需要更多的時間和投入。具體包括：

- 任何人（Anyone）：為 Kubernetes 文件作出貢獻的普通貢獻者。
- 成員（Members）：可以對 Issue 進行分派和判別，對 PR 提出無約束性的評審意見。
- 評審人（Reviewers）：可以領導對文件 PR 的評審，可以對變更的質量進行判別。
- 批准人（Approvers）：可以領導對文件的評審併合並變更。

<!-- body -->

<!--
## Anyone

Anyone with a GitHub account can contribute to Kubernetes. SIG Docs welcomes all new contributors!

Anyone can:

- Open an issue in any [Kubernetes](https://github.com/kubernetes/) repository, including [`kubernetes/website`](https://github.com/kubernetes/website)
- Give non-binding feedback on a pull request
- Contribute to a localization
- Suggest improvements on [Slack](http://slack.k8s.io/) or the [SIG docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

After [signing the CLA](/docs/contribute/new-content/overview/#sign-the-cla), anyone can also:

- Open a pull request to improve existing content, add new content, or write a blog post or case study
- Create diagrams, graphics assets, and embeddable screencasts and videos

For more information, see [contributing new content](/docs/contribute/new-content/).
-->
## 任何人（Anyone）  {#anyone}

任何擁有 GitHub 賬號的人都可以對 Kubernetes 作出貢獻。SIG Docs
歡迎所有新的貢獻者。

任何人都可以：

- 在任何 [Kubernetes](https://github.com/kubernetes/) 倉庫，包括
  [`kubernetes/website`](https://github.com/kubernetes/website) 上報告 Issue。
- 對某 PR 給出無約束力的反饋資訊
- 為本地化提供幫助
- 在 [Slack](https://slack.k8s.io/) 或
  [SIG Docs 郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
  上提出改進建議。

在[簽署了 CLA](/zh-cn/docs/contribute/new-content/overview/#sign-the-cla) 之後，任何人還可以：

- 發起拉取請求（PR），改進現有內容、新增新內容、撰寫部落格或者案例分析
- 建立示意圖、圖形資產或者嵌入式的截圖和影片內容

進一步的詳細資訊，可參見[貢獻新內容](/zh-cn/docs/contribute/new-content/)。

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
## 成員（Members）  {#members}

成員是指那些對 `kubernetes/website` 提交很多拉取請求（PR）的人。
成員都要加入 [Kubernetes GitHub 組織](https://github.com/kubernetes)。

成員可以：

- 執行[任何人](#anyone)節區所列舉操作
- 使用 `/lgtm` 評論新增 LGTM (looks good to me（我覺得可以）) 標籤到某個 PR

  {{< note >}}
  使用 `/lgtm` 會觸發自動化機制。如果你希望提供非約束性的批准意見，
  直接回復 "LGTM" 也是可以的。
  {{< /note >}}

- 利用 `/hold` 評論來阻止某個 PR 被合併
- 使用 `/assign` 評論為某個 PR 指定評審人
- 對 PR 提供非約束性的評審意見
- 使用自動化機制來對 Issue 進行判別和分類
- 為新功能特性撰寫文件

<!--
### Becoming a member

After submitting at least 5 substantial pull requests and meeting the other [requirements](https://github.com/kubernetes/community/blob/master/community-membership.md#member):
-->
### 成為一個成員 {#becoming-a-member}

在你成功地提交至少 5 個 PR 並滿足
[相關條件](https://github.com/kubernetes/community/blob/master/community-membership.md#member)
之後：

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
1. 找到兩個[評審人](#reviewers)或[批准人](#approvers)為你的成員身份提供
   [擔保](/zh-cn/docs/contribute/advanced#sponsor-a-new-contributor)。

   透過 [Kubernetes Slack 上的 #sig-docs 頻道](https://kubernetes.slack.com) 或者
   [SIG Docs 郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
   來尋找為你擔保的人。

   {{< note >}}
   不要單獨傳送郵件給某個 SIG Docs 成員或在 Slack 中與其私聊。
   在提交申請之前，一定要先確定擔保人。
   {{< /note >}}

2. 在 [`kubernetes/org`](https://github.com/kubernetes/org/) 倉庫
   使用 **Organization Membership Request** Issue 模板登記一個 Issue。

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
3. 告知你的擔保人你所建立的 Issue，你可以：

   - 在 Issue 中 `@<GitHub-username>` 提及他們的 GitHub 使用者名稱
   - 透過 Slack 或 email 直接傳送給他們 Issue 連結
 
   擔保人會透過 `+1` 投票來批准你的請求。一旦你的擔保人批准了該請求，
   某個 Kubernetes GitHub 管理員會將你新增為組織成員。恭喜！

   如果你的成員請求未被接受，你會收到一些反饋。
   當處理完反饋意見之後，可以再次發起申請。

4. 登入你的郵件賬戶，接受來自 Kubernetes GitHub 組織發出的成員邀請。

    {{< note >}}
    GitHub 會將邀請傳送到你的賬戶中所設定的預設郵件地址。
    {{< /note >}}

<!--
## Reviewers

Reviewers are responsible for reviewing open pull requests. Unlike member feedback, you must address reviewer feedback. Reviewers are members of the [@kubernetes/sig-docs-{language}-reviews](https://github.com/orgs/kubernetes/teams?query=sig-docs) GitHub team.

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
## 評審人（Reviewers）  {#reviewers}

評審人負責評審懸決的 PR。
與成員所給的反饋不同，你必須處理評審人的反饋。
評審人是 [@kubernetes/sig-docs-{language}-reviews](https://github.com/orgs/kubernetes/teams?query=sig-docs) GitHub 團隊的成員。

評審人可以：

- 執行[任何人](#anyone)和[成員](#members)節區所列舉的操作
- 評審 PR 並提供具約束性的反饋資訊

    {{< note >}}
    要提供非約束性的反饋，可以在你的評語之前新增 "Optionally: " 這樣的說法。
    {{< /note >}}

- 編輯程式碼中使用者可見的字串
- 改進程式碼註釋

你可以是 SIG Docs 的評審人，也可以是某個主題領域的文件的評審人。

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
### 為 PR 指派評審人  {#assigning-reviewers-to-pull-requests}

自動化引擎會為每個 PR 自動指派評審人。
你可以透過為 PR 新增評論 `/assign [@_github_handle]` 來請求某個特定評審人來評審。

如果所指派的評審人未能及時評審，其他的評審人也可以參與進來。
你可以根據需要指派技術評審人。

### 使用 `/lgtm`

LGTM 代表的是 “Looks Good To Me （我覺得可以）”，用來標示某個 PR
在技術上是準確的，可以被合併。
所有 PR 都需要來自某評審人的 `/lgtm` 評論和來自某批准人的 `/approve`
評論。

來自評審人的 `/lgtm` 評論是具有約束性的，會觸發自動化引擎新增 `lgtm` 標籤。

<!--
### Becoming a reviewer

When you meet the
[requirements](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer), you can become a SIG Docs reviewer. Reviewers in other SIGs must apply separately for reviewer status in SIG Docs.

To apply:
-->
### 成為評審人   {#becoming-a-reviewer}

當你滿足[相關條件](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer)時，
你可以成為一個 SIG Docs 評審人。
來自其他 SIG 的評審人必須為 SIG Docs 單獨申請評審人資格。

申請流程如下：

<!--
1. Open a pull request that adds your GitHub user name to a section of the
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES) file
in the `kubernetes/website` repository.

  {{< note >}}
  If you aren't sure where to add yourself, add yourself to `sig-docs-en-reviews`.
  {{< /note >}}

2. Assign the PR to one or more SIG-Docs approvers (user names listed under `sig-docs-{language}-owners`).

If approved, a SIG Docs lead adds you to the appropriate GitHub team. Once added,
[@k8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home) assigns and suggests you as a reviewer on new pull requests.
-->
1. 發起 PR，將你的 GitHub 使用者名稱新增到 `kubernetes/website` 倉庫中
   [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
   檔案的對應節區。

   {{< note >}}
   如果你不確定要新增到哪個位置，可以將自己新增到 `sig-docs-en-reviews`。
   {{< /note >}}

2. 將 PR 指派給一個或多個 SIG Docs 批准人（`sig-docs-{language}-owners`
   下列舉的使用者名稱）。

申請被批准之後，SIG Docs Leads 之一會將你新增到合適的 GitHub 團隊。
一旦新增完成， [@k8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
會在處理未來的 PR 時，將 PR 指派給你或者建議你來評審某 PR。

<!--
## Approvers

Approvers review and approve pull requests for merging. Approvers are members of the
[@kubernetes/sig-docs-{language}-owners](https://github.com/orgs/kubernetes/teams/?query=sig-docs) GitHub teams.

-->
## 批准人（Approvers）   {#approvers}

批准人負責評審和批准 PR 以將其合併。
批准人是 [@kubernetes/sig-docs-{language}-owners](https://github.com/orgs/kubernetes/teams/?query=sig-docs) GitHub 團隊的成員。

<!--
Approvers can do the following:

- Everything listed under [Anyone](#anyone), [Members](#members) and [Reviewers](#reviewers)
- Publish contributor content by approving and merging pull requests using the `/approve` comment
- Propose improvements to the style guide
- Propose improvements to docs tests
- Propose improvements to the Kubernetes website or other tooling

If the PR already has a `/lgtm`, or if the approver also comments with `/lgtm`, the PR merges automatically. A SIG Docs approver should only leave a `/lgtm` on a change that doesn't need additional technical review.
-->
批准人可以執行以下操作：

- 執行列舉在[任何人](#anyone)、[成員](#members)和[評審人](#reviewers)節區的操作
- 透過使用 `/approve` 評論來批准、合併 PR，釋出貢獻者所貢獻的內容。
- 就樣式指南給出改進建議
- 對文件測試給出改進建議
- 對 Kubernetes 網站或其他工具給出改進建議

如果某個 PR 已有 `/lgtm` 標籤，或者批准人再回復一個 `/lgtm` ，則這個 PR 會自動合併。
SIG Docs 批准人應該只在不需要額外的技術評審的情況下才可以標記 `/lgtm`。

<!--
### Approving pull requests

Approvers and SIG Docs leads are the only ones who can merge pull requests into the website repository. This comes with certain responsibilities.

- Approvers can use the `/approve` command, which merges PRs into the repo.

    {{< warning >}}
    A careless merge can break the site, so be sure that when you merge something, you mean it.
    {{< /warning >}}

- Make sure that proposed changes meet the [contribution guidelines](/docs/contribute/style/content-guide/#contributing-content).

    If you ever have a question, or you're not sure about something, feel free to call for additional review.
-->
### 批准 PR   {#approving-pull-requests}

只有批准人和 SIG Docs Leads 可以將 PR 合併到網站倉庫。
這意味著以下責任：

- 批准人可以使用 `/approve` 命令將 PR 合併到倉庫中。

    {{< warning >}}
    不小心的合併可能會破壞整個站點。在執行合併操作時，務必小心。
    {{< /warning >}}

- 確保所提議的變更滿足[貢獻指南](/zh-cn/docs/contribute/style/content-guide/#contributing-content)要求。

    如果有問題或者疑惑，可以根據需要請他人幫助評審。

- 在 `/approve` PR 之前，須驗證 Netlify 測試是否正常透過。

    <img src="/images/docs/contribute/netlify-pass.png" width="75%" alt="批准之前必須透過 Netlify 測試" />

- 在批准之前，請訪問 Netlify 的頁面預覽來確保變更內容可正常顯示。

- 參與 [PR 管理者輪值排班](https://github.com/kubernetes/website/wiki/PR-Wranglers)
  執行時長為一週的 PR 管理。SIG Docs 期望所有批准人都參與到此輪值工作中。
  更多細節可參見 [PR 管理者](/zh-cn/docs/contribute/participate/pr-wranglers/)。

<!--
### Becoming an approver

When you meet the [requirements](https://github.com/kubernetes/community/blob/master/community-membership.md#approver), you can become a SIG Docs approver. Approvers in other SIGs must apply separately for approver status in SIG Docs.
-->
### 成為批准人  {#becoming-an-approver}

當你滿足[一定條件](https://github.com/kubernetes/community/blob/master/community-membership.md#approver)時，可以成為一個 SIG Docs 批准人。
來自其他 SIG 的批准人也必須在 SIG Docs 獨立申請批准人資格。

<!--
To apply:

1. Open a pull request adding yourself to a section of the [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES) file in the `kubernetes/website` repository.

    {{< note >}}
    If you aren't sure where to add yourself, add yourself to `sig-docs-en-owners`.
    {{< /note >}}

2. Assign the PR to one or more current SIG Docs approvers.

If approved, a SIG Docs lead adds you to the appropriate GitHub team. Once added, [K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home) assigns and suggests you as a reviewer on new pull requests.
-->
申請流程如下：

1. 發起一個 PR，將自己新增到 `kubernetes/website` 倉庫中
   [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
   檔案的對應節區。

   {{< note >}}
   如果你不確定要新增到哪個位置，可以將自己新增到 `sig-docs-en-owners` 中。
   {{< /note >}}

2. 將 PR 指派給一個或多個 SIG Docs 批准人。

請求被批准之後，SIG Docs Leads 之一會將你新增到對應的 GitHub 團隊。
一旦新增完成， [K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
會在處理未來的 PR 時，將 PR 指派給你或者建議你來評審某 PR。

## {{% heading "whatsnext" %}}

<!--
- Read about [PR wrangling](/docs/contribute/participating/pr-wranglers), a role all approvers take on rotation.
-->
- 閱讀 [PR 管理者](/zh-cn/docs/contribute/participate/pr-wranglers/)，瞭解所有批准人輪值的角色。

