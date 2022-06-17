---
title: 為發行版本撰寫功能特性文件
linktitle: 為發行版本撰寫文件
content_type: concept
main_menu: true
weight: 20
card:
  name: contribute
  weight: 45
  title: 為發行版本撰寫功能特性文件 
---
<!--
title:  Documenting a feature for a release
linktitle: Documenting for a release
content_type: concept
main_menu: true
weight: 20
card:
  name: contribute
  weight: 45
  title:  Documenting a feature for a release
-->

<!-- overview -->

<!--
Each major Kubernetes release introduces new features that require documentation.
New releases also bring updates to existing features and documentation (such as upgrading a feature from alpha to beta).

Generally, the SIG responsible for a feature submits draft documentation of the
feature as a pull request to the appropriate development branch of the
`kubernetes/website` repository, and someone on the SIG Docs team provides
editorial feedback or edits the draft directly. This section covers the branching
conventions and process used during a release by both groups.
-->
Kubernetes 的每個主要版本釋出都會包含一些需要文件說明的新功能。
新的發行版本也會對已有功能特性和文件（例如將某功能特性從 alpha 升級為
beta）進行更新。

通常，負責某功能特性的 SIG 要為功能特性的文件草擬文件，並針對 `kubernetes/website`
倉庫的合適的開發分支發起拉取請求。
SIG Docs 團隊會提供文字方面的反饋意見，或者直接編輯文件草稿。
本節討論兩個小組在分支方面和發行期間所遵從的流程方面的約定。

<!-- body -->
<!--
## For documentation contributors

In general, documentation contributors don't write content from scratch for a release.
Instead, they work with the SIG creating a new feature to refine the draft documentation and make it release ready.

After you've chosen a feature to document or assist, ask about it in the `#sig-docs`
Slack channel, in a weekly SIG Docs meeting, or directly on the PR filed by the
feature SIG. If you're given the go-ahead, you can edit into the PR using one of
the techniques described in
[Commit into another person's PR](/docs/contribute/review/for-approvers/#commit-into-another-persons-pr).
-->
## 對於文件貢獻者

一般而言，文件貢獻者不會為某個發行版本從頭撰寫文件。
相反，他們會與開發該功能特性的 SIG 團隊一起，對文件草稿進行潤色，
使之符合釋出條件。

在你選定了某個功能特性，為其撰寫文件（主筆或輔助），請在 `#sig-docs` Slack 頻道、SIG Docs 的每週例會上，
或者在功能特性對應的 PR 上提出諮詢。
如果繼續工作是沒有問題的，你可以使用
[向他人的 PR 中提交](/zh-cn/docs/contribute/review/for-approvers/#commit-into-another-persons-pr)
中描述的技術之一，參與 PR 的編輯工作。

<!--
### Find out about upcoming features

To find out about upcoming features, attend the weekly SIG Release meeting (see
the [community](https://kubernetes.io/community/) page for upcoming meetings)
and monitor the release-specific documentation
in the [kubernetes/sig-release](https://github.com/kubernetes/sig-release/)
repository. Each release has a sub-directory in the [/sig-release/tree/master/releases/](https://github.com/kubernetes/sig-release/tree/master/releases)
directory. The sub-directory contains a release schedule, a draft of the release
notes, and a document listing each person on the release team.
-->
### 瞭解即將釋出的功能特性

要了解即將釋出的功能特性，可以參加每週的 SIG Release 例會
（參考[社群](https://kubernetes.io/community/)頁面，瞭解即將召開的會議），
監視 [kubernetes/sig-release](https://github.com/kubernetes/sig-release/)
中與發行相關的文件。
每個發行版本在
[/sig-release/tree/master/releases/](https://github.com/kubernetes/sig-release/tree/master/releases)
下都有一個對應的子目錄。
該子目錄包含了發行版本的時間計劃、發行公告的草稿以及列舉發行團隊名單的文件。

<!--
The release schedule contains links to all other documents, meetings,
meeting minutes, and milestones relating to the release. It also contains
information about the goals and timeline of the release, and any special
processes in place for this release. Near the bottom of the document, several
release-related terms are defined.

This document also contains a link to the **Feature tracking sheet**, which is
the official way to find out about all new features scheduled to go into the
release.
-->
發行時間計劃檔案中包含到所有其他文件、會議、會議記錄及發行相關的里程碑的連結。
其中也包含關於發行版本的目標列表、時間線，以及當前發行版本中就緒的特殊流程的資訊。
文件末尾附近定義了若干與該發行版本有關的術語。

此文件也包含到 **功能特性跟蹤清單** 的連結。
這一清單是瞭解哪些功能特性計劃進入某發行版本的正式途徑。

<!--
The release team document lists who is responsible for each release role. If
it's not clear who to talk to about a specific feature or question you have,
either attend the release meeting to ask your question, or contact the release
lead so that they can redirect you.

The release notes draft is a good place to find out about
specific features, changes, deprecations, and more about the release. The
content is not finalized until late in the release cycle, so use caution.
-->
發行團隊文件列舉了哪些人扮演著各個發行版本的不同角色。
如果不清楚要聯絡誰來討論特定的功能特性或者回答你的問題，
你可以參加發行團隊的會議，提出你的問題，或者聯絡發行團隊的牽頭人，
這樣他們就可以幫你找到正確的聯絡人。

發行說明草稿是用來發現與特定發行版本相關的功能特性、變更、廢棄以及其他資訊的好來源。
由於在發行週期的後段該文件的內容才會最終定稿，參考其中的資訊時請謹慎。

<!--
### Feature tracking sheet

The feature tracking sheet [for a given Kubernetes release](https://github.com/kubernetes/sig-release/tree/master/releases)
lists each feature that is planned for a release.
Each line item includes the name of the feature, a link to the feature's main
GitHub issue, its stability level (Alpha, Beta, or Stable), the SIG and
individual responsible for implementing it, whether it
needs docs, a draft release note for the feature, and whether it has been
merged. Keep the following in mind:
-->
### 特性跟蹤清單 {#feature-tracking-sheet}

針對[給定 Kubernetes 發行版本](https://github.com/kubernetes/sig-release/tree/master/releases)
特性跟蹤清單中列舉的是計劃包含於該版本中的每個功能特性。
每一行中都包含特性的名稱、特性對應的主要 GitHub Issue，其穩定性級別（ALpha、
Beta 或 Stable）、負責實現該特性的 SIG 和個人、是否該特性需要文件、該特性的
發行說明草稿以及該特性是否已經被合併等等。閱讀此清單時請注意：

<!--
- Beta and Stable features are generally a higher documentation priority than
  Alpha features.
- It's hard to test (and therefore to document) a feature that hasn't been merged,
  or is at least considered feature-complete in its PR.
- Determining whether a feature needs documentation is a manual process. Even if
  a feature is not marked as needing docs, you may need to document the feature.
-->
- Beta 和 Stable 功能特性通常比 Alpha 特性更為需要文件支援。
- 如果某功能特性尚未被合併，就很難測試或者為其撰寫文件。
  對於對應的 PR 而言，也很難講特性是否完全實現。
- 確定某個功能特性是否需要文件的過程是一個手動的過程。
  即使某個功能特性沒有標記需要文件，你仍可能需要為其提供文件。

<!--
## For developers or other SIG members

This section is information for members of other Kubernetes SIGs documenting new features
for a release.

If you are a member of a SIG developing a new feature for Kubernetes, you need
to work with SIG Docs to be sure your feature is documented in time for the
release. Check the
[feature tracking spreadsheet](https://github.com/kubernetes/sig-release/tree/master/releases)
or check in the `#sig-release` Kubernetes Slack channel to verify scheduling details and
deadlines.
-->
## 針對開發人員或其他 SIG 成員

本節中的資訊是針對為發行版本中新功能特性撰寫文件的來自其他 Kubernetes SIGs
的成員。

如果你是某個 SIG 的成員，負責為 Kubernetes 開發某一項新的功能特性，你需要與
SIG Docs 一起工作，確保這一新功能在發行之前已經為之撰寫文件。
請參考[特性跟蹤清單](https://github.com/kubernetes/sig-release/tree/master/releases)
或者 Kubernetes Slack 上的 `#sig-release` 頻道，檢查時間安排的細節以及截止日期。

<!--
### Open a placeholder PR

1. Open a **draft** pull request against the
`dev-{{< skew nextMinorVersion >}}` branch in the `kubernetes/website` repository, with a small
commit that you will amend later. To create a draft pull request, use the
Create Pull Request drop-down and select **Create Draft Pull Request**,
then click **Draft Pull Request**.
2. Edit the pull request description to include links to [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes)
PR(s) and [kubernetes/enhancements](https://github.com/kubernetes/enhancements) issue(s).
3. Leave a comment on the related [kubernetes/enhancements](https://github.com/kubernetes/enhancements)
issue with a link to the PR to notify the docs person managing this release that
the feature docs are coming and should be tracked for the release.
-->
### 提交佔位 PR {#open-a-placeholder-pr}

1. 在 `kubernetes/website` 倉庫上針對 `dev-{{< skew nextMinorVersion >}}`
   分支提交一個**draft** PR，其中包含較少的、待以後慢慢補齊的提交內容。
   要建立一個草案（draft）狀態的 PR，可以在 Create Pull Request 下拉選單中
   選擇 **Create Draft Pull Request**，然後點選 **Draft Pull Request**。
1. 編輯拉取請求描述以包括指向 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) PR
   和 [kubernetes/enhancements](https://github.com/kubernetes/enhancements) 問題的連結。  
1. 在對應的 [kubernetes/enhancements](https://github.com/kubernetes/enhancements)
   issue 上新增評論，附上新 PR 的連結以便管理此發行版本的人員能夠得到通知，
   瞭解特性的文件正在被撰寫，在新的發行版本中要跟蹤其進展。

<!--
If your feature does not need
any documentation changes, make sure the sig-release team knows this, by
mentioning it in the `#sig-release` Slack channel. If the feature does need
documentation but the PR is not created, the feature may be removed from the
milestone.
-->
如果對應的功能特性不需要任何型別的文件變更，請透過在 `#sig-release` Slack
頻道宣告這一點以確保 sig-release 團隊瞭解。
如果功能特性確實需要文件，而沒有對應的 PR
提交，該功能特性可能會被從里程碑中移除。

<!--
### PR ready for review

When ready, populate your placeholder PR with feature documentation and change
the state of the PR from draft to **ready for review**. To mark a pull request
as ready for review, navigate to the merge box and click **Ready for review**.

Do your best to describe your feature and how to use it. If you need help
structuring your documentation, ask in the `#sig-docs` slack channel.

When you complete your content, the documentation person assigned to your
feature reviews it. 
To ensure technical accuracy, the content may also require a technical review from corresponding SIG(s).
Use their suggestions to get the content to a release ready state.
-->
### PR 準備好評閱  {#pr-ready-for-review}

時機成熟時，你可以在你的佔位 PR 中完成功能特性文件，並將 PR 的狀態
從草案狀態更改為 **Ready for Review**。要將一個拉取請求標記為預備
評閱，轉到頁面的 merge 框，點選 **Ready for review**。

儘可能為功能特性提供詳盡文件以及使用說明。如果你需要文件組織方面的幫助，請
在 `#sig-docs` Slack 頻道中提問。

當你已經完成內容撰寫，指派給你的功能特性的文件貢獻者會去評閱文件。
為了確保技術準確性，內容可能還需要相應 SIG 的技術稽核。
儘量利用他們所給出的建議，改進文件內容以達到釋出就緒狀態。

<!--
If your feature is an Alpha or Beta feature and is behind a feature gate,
make sure you add it to [Alpha/Beta Feature gates](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)
table as part of your pull request. With new feature gates, a description of
the feature gate is also required. If your feature is GA'ed or deprecated,
make sure to move it from that table to [Feature gates for graduated or deprecated features](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features)
table with Alpha and Beta history intact.
-->
如果你在處理的功能特性處於 Alpha 或 Beta 階段並由某特性門控控制，
請確保在你的 PR 中，該特性門控被新增到 
[Alpha/Beta 特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)
表格中。對於新的特性門控選項，需要為該特性門控提供一段描述。
如果所處理的功能特性已經進入正式釋出（GA）狀態或者被廢棄，
請確保將其從上述表格中遷移到
[已畢業或廢棄的特性](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features)
表格中，並確保遷移後保留其 Alpha、Beta 版本變遷歷史。

<!--
### All PRs reviewed and ready to merge

If your PR has not yet been merged into the `dev-{{< skew nextMinorVersion >}}` branch by the release deadline, work with the
docs person managing the release to get it in by the deadline. If your feature needs
documentation and the docs are not ready, the feature may be removed from the
milestone.
-->
### 所有 PR 均經過評審且合併就緒   {#all-prs-reviewd-and-ready-to-merge}

如果你的 PR 在發行截止日期之前尚未合併到 `dev-{{< skew nextMinorVersion >}}` 分支，
請與負責管理該發行版本的文件團隊成員一起合作，在截止期限之前將其合併。
如果功能特性需要文件，而文件並未就緒，該特性可能會被從里程碑中去除。

