---
title: 進階貢獻
slug: advanced
content_type: concept
weight: 100
---
<!--
title: Advanced contributing
slug: advanced
content_type: concept
weight: 100
-->

<!-- overview -->

<!--
This page assumes that you understand how to
[contribute to new content](/docs/contribute/new-content/) and
[review others' work](/docs/contribute/review/reviewing-prs/), and are ready
to learn about more ways to contribute. You need to use the Git command line
client and other tools for some of these tasks.
-->
如果你已經瞭解如何[貢獻新內容](/zh-cn/docs/contribute/new-content/)和
[評閱他人工作](/zh-cn/docs/contribute/review/reviewing-prs/)，並準備瞭解更多貢獻的途徑，
請閱讀此文。你需要使用 Git 命令行工具和其他工具做這些工作。

<!-- body -->

<!--
## Propose improvements

SIG Docs [members](/docs/contribute/participate/roles-and-responsibilities/#members)
can propose improvements.
-->
## 提出改進建議   {#propose-improvements}

SIG Docs 的[成員](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#members)可以提出改進建議。

<!--
After you've been contributing to the Kubernetes documentation for a while, you
may have ideas for improving the [Style Guide](/docs/contribute/style/style-guide/)
, the [Content Guide](/docs/contribute/style/content-guide/), the toolchain used to build
the documentation, the website style, the processes for reviewing and merging
pull requests, or other aspects of the documentation. For maximum transparency,
these types of proposals need to be discussed in a SIG Docs meeting or on the
[kubernetes-sig-docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
In addition, it can help to have some context about the way things
currently work and why past decisions have been made before proposing sweeping
changes. The quickest way to get answers to questions about how the documentation
currently works is to ask in the `#sig-docs` Slack channel on
[kubernetes.slack.com](https://kubernetes.slack.com)
-->
在對 Kubernetes 文檔貢獻了一段時間後，你可能會對[樣式指南](/zh-cn/docs/contribute/style/style-guide/)、
[內容指南](/zh-cn/docs/contribute/style/content-guide/)、用於構建文檔的工具鏈、網站樣式、
評審和合並 PR 的流程或者文檔的其他方面產生改進的想法。
爲了儘可能透明化，這些提議都需要在 SIG Docs 會議或
[kubernetes-sig-docs 郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)上討論。
此外，在提出全面的改進之前，這些討論能幫助我們瞭解有關“當前工作如何運作”和“以往的決定是爲何做出”的背景。
想了解文檔的當前運作方式，最快的途徑是諮詢 [kubernetes.slack.com](https://kubernetes.slack.com)
中的 `#sig-docs` 聊天羣組。

<!--
After the discussion has taken place and the SIG is in agreement about the desired
outcome, you can work on the proposed changes in the way that is the most
appropriate. For instance, an update to the style guide or the website's
functionality might involve opening a pull request, while a change related to
documentation testing might involve working with sig-testing.
-->
在進行了討論並且 SIG 就期望的結果達成一致之後，你就能以最合理的方式處理改進建議了。
例如，樣式指南或網站功能的更新可能涉及 PR 的新增，而與文檔測試相關的更改可能涉及 sig-testing。

<!--
## Coordinate docs for a Kubernetes release

SIG Docs [approvers](/docs/contribute/participate/roles-and-responsibilities/#approvers)
can coordinate docs for a Kubernetes release.
-->
## 爲 Kubernetes 版本發佈協調文檔工作   {#coordinate-docs-for-a-kubernetes-release}

SIG Docs 的[批准人（Approver）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#approvers)
可以爲 Kubernetes 版本發佈協調文檔工作。

<!--
Each Kubernetes release is coordinated by a team of people participating in the
sig-release Special Interest Group (SIG). Others on the release team for a given
release include an overall release lead, as well as representatives from
sig-testing and others. To find out more about Kubernetes release processes,
refer to
[https://github.com/kubernetes/sig-release](https://github.com/kubernetes/sig-release).
-->
每一個 Kubernetes 版本都是由參與 sig-release 的 SIG（特別興趣小組）的一個團隊協調的。
指定版本的發佈團隊中還包括總體發佈牽頭人，以及來自 sig-testing 的代表等。
要了解更多關於 Kubernetes 版本發佈的流程，請參考
[https://github.com/kubernetes/sig-release](https://github.com/kubernetes/sig-release)。

<!--
The SIG Docs representative for a given release coordinates the following tasks:

- Monitor the feature-tracking spreadsheet for new or changed features with an
  impact on documentation. If the documentation for a given feature won't be ready
  for the release, the feature may not be allowed to go into the release.
- Attend sig-release meetings regularly and give updates on the status of the
  docs for the release.
- Review and copyedit feature documentation drafted by the SIG responsible for
  implementing the feature.
- Merge release-related pull requests and maintain the Git feature branch for
  the release.
- Mentor other SIG Docs contributors who want to learn how to do this role in
  the future. This is known as "shadowing".
- Publish the documentation changes related to the release when the release
  artifacts are published.
-->
SIG Docs 團隊的代表需要爲一個指定的版本協調以下工作：

- 通過特性跟蹤表來監視新功能特性或現有功能特性的修改。
  如果版本的某個功能特性的文檔沒有爲發佈做好準備，那麼該功能特性不允許進入發佈版本。
- 定期參加 sig-release 會議並彙報文檔的發佈狀態。
- 評審和修改由負責實現某功能特性的 SIG 起草的功能特性文檔。
- 合入版本發佈相關的 PR，併爲對應發佈版本維護 Git 特性分支。
- 指導那些想學習並有意願擔當該角色的 SIG Docs 貢獻者。這就是我們常說的“實習”。
- 發佈版本的組件發佈時，相關的文檔更新也需要發佈。

<!--
Coordinating a release is typically a 3-4 month commitment, and the duty is
rotated among SIG Docs approvers.
-->
協調一個版本發佈通常需要 3-4 個月的時間投入，該任務由 SIG Docs 批准人輪流承擔。

<!--
## Serve as a New Contributor Ambassador

SIG Docs [approvers](/docs/contribute/participate/roles-and-responsibilities/#approvers)
can serve as New Contributor Ambassadors.

New Contributor Ambassadors welcome new contributors to SIG-Docs,
suggest PRs to new contributors, and mentor new contributors through their first
few PR submissions.

Responsibilities for New Contributor Ambassadors include:
-->
## 擔任新的貢獻者大使   {#serve-as-a-new-contributor-ambassador}

SIG Docs [批准人（Approver）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#approvers)
可以擔任新的貢獻者大使。

新的貢獻者大使歡迎 SIG-Docs 的新貢獻者，對新貢獻者的 PR 提出建議，
以及在前幾份 PR 提交中指導新貢獻者。

新的貢獻者大使的職責包括：

<!--
- Monitoring the [#sig-docs Slack channel](https://kubernetes.slack.com) for questions from new contributors.
- Working with PR wranglers to identify [good first issues](https://kubernetes.dev/docs/guide/help-wanted/#good-first-issue) for new contributors.
- Mentoring new contributors through their first few PRs to the docs repo.
- Helping new contributors create the more complex PRs they need to become Kubernetes members.
- [Sponsoring contributors](/docs/contribute/advanced/#sponsor-a-new-contributor) on their path to becoming Kubernetes members.
- Hosting a monthly meeting to help and mentor new contributors.
-->
- 監聽 [Kubernetes #sig-docs 頻道](https://kubernetes.slack.com) 上新貢獻者的 Issue。
- 與 PR 管理者合作爲新參與者尋找[合適的第一個 issue](https://kubernetes.dev/docs/guide/help-wanted/#good-first-issue)。
- 通過前幾個 PR 指導新貢獻者爲文檔存儲庫作貢獻。
- 幫助新的貢獻者創建成爲 Kubernetes 成員所需的更復雜的 PR。
- [爲貢獻者提供保薦](#sponsor-a-new-contributor)，使其成爲 Kubernetes 成員。
- 每月召開一次會議，幫助和指導新的貢獻者。

<!--
Current New Contributor Ambassadors are announced at each SIG-Docs meeting and in the [Kubernetes #sig-docs channel](https://kubernetes.slack.com).
-->
當前新貢獻者大使將在每次 SIG 文檔會議上以及 [Kubernetes #sig-docs 頻道](https://kubernetes.slack.com)中宣佈。

<!--
## Sponsor a new contributor

SIG Docs [reviewers](/docs/contribute/participate/roles-and-responsibilities/#reviewers)
can sponsor new contributors.
-->
## 爲新的貢獻者提供保薦 {#sponsor-a-new-contributor}

SIG Docs 的[評審人（Reviewer）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#reviewers)
可以爲新的貢獻者提供保薦。

<!--
After a new contributor has successfully submitted 5 substantive pull requests
to one or more Kubernetes repositories, they are eligible to apply for
[membership](/docs/contribute/participate/roles-and-responsibilities/#members)
in the Kubernetes organization. The contributor's membership needs to be
backed by two sponsors who are already reviewers.
-->
新的貢獻者針對一個或多個 Kubernetes 項目倉庫成功提交了 5 個實質性 PR 之後，
就有資格申請 Kubernetes 組織的[成員身份](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#members)。
貢獻者的成員資格需要同時得到兩位評審人的保薦。

<!--
New docs contributors can request sponsors by asking in the #sig-docs channel
on the [Kubernetes Slack instance](https://kubernetes.slack.com) or on the
[SIG Docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
If you feel confident about the applicant's work, you volunteer to sponsor them.
When they submit their membership application, reply to the application with a
"+1" and include details about why you think the applicant is a good fit for
membership in the Kubernetes organization.
-->
新的文檔貢獻者可以通過諮詢 [Kubernetes Slack 實例](https://kubernetes.slack.com)
上的 #sig-docs 頻道或者 [SIG Docs 郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)
來請求評審者保薦。如果你對申請人的工作充滿信心，你自願保薦他們。
當他們提交成員資格申請時，回覆 “+1” 並詳細說明爲什麼你認爲申請人適合加入 Kubernetes 組織。

<!--
## Serve as a SIG Co-chair

SIG Docs [members](/docs/contribute/participate/roles-and-responsibilities/#members)
can serve a term as a co-chair of SIG Docs.

### Prerequisites
-->
## 擔任 SIG 聯合主席   {#sponsor-a-new-contributor}

SIG Docs [成員（Member）](/zh-cn/docs/contribute/participate/roles-and-responsibilities/#members)
可以擔任 SIG Docs 的聯合主席。

### 前提條件   {#prerequisites}

<!--
A Kubernetes member must meet the following requirements to be a co-chair:

- Understand SIG Docs workflows and tooling: git, Hugo, localization, blog subproject
- Understand how other Kubernetes SIGs and repositories affect the SIG Docs
  workflow, including:
  [teams in k/org](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml), the
  [process in k/community](https://github.com/kubernetes/community/tree/master/sig-docs),
  plugins in [k/test-infra](https://github.com/kubernetes/test-infra/), and the role of
  [SIG Architecture](https://github.com/kubernetes/community/tree/master/sig-architecture).
  In addition, understand how the [Kubernetes docs release process](/docs/contribute/advanced/#coordinate-docs-for-a-kubernetes-release) works.
- Approved by the SIG Docs community either directly or via lazy consensus.
- Commit at least 5 hours per week (and often more) to the role for a minimum of 6 months
-->
Kubernetes 成員必須滿足以下要求才能成爲聯合主席：

- 理解 SIG Docs 工作流程和工具：git、Hugo、本地化、博客子項目
- 理解其他 Kubernetes SIG 和倉庫會如何影響 SIG Docs 工作流程，包括：
  [k/org 中的團隊](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml)、
  [k/community 中的流程](https://github.com/kubernetes/community/tree/master/sig-docs)、
  [k/test-infra](https://github.com/kubernetes/test-infra/) 中的插件、
  [SIG Architecture](https://github.com/kubernetes/community/tree/main/sig-architecture) 中的角色。
  此外，瞭解 [Kubernetes 文檔發佈流程](/zh-cn/docs/contribute/advanced/#coordinate-docs-for-a-kubernetes-release)的工作原理。
- 由 SIG Docs 社區直接或通過惰性共識批准。
- 在至少 6 個月的時段內，確保每週至少投入 5 個小時（通常更多）

<!--
### Responsibilities

The role of co-chair is one of service: co-chairs build contributor capacity, handle process and policy, schedule and run meetings, schedule PR wranglers, advocate for docs in the Kubernetes community, make sure that docs succeed in Kubernetes release cycles, and keep SIG Docs focused on effective priorities.

Responsibilities include:
-->
### 職責範圍   {#responsibilities}

聯合主席的角色提供以下服務：

- 拓展貢獻者規模
- 處理流程和政策
- 安排時間和召開會議
- 安排 PR 管理員
- 在 Kubernetes 社區中提出文檔倡議
- 確保文檔在 Kubernetes 發佈週期中符合預期
- 讓 SIG Docs 專注於有效的優先事項

職責範圍包括：

<!--
- Keep SIG Docs focused on maximizing developer happiness through excellent documentation
- Exemplify the [community code of conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md) and hold SIG members accountable to it
- Learn and set best practices for the SIG by updating contribution guidelines
- Schedule and run SIG meetings: weekly status updates, quarterly retro/planning sessions, and others as needed
- Schedule and run doc sprints at KubeCon events and other conferences
- Recruit for and advocate on behalf of SIG Docs with the {{< glossary_tooltip text="CNCF" term_id="cncf" >}} and its platinum partners, including Google, Oracle, Azure, IBM, and Huawei
- Keep the SIG running smoothly
-->
- 保持 SIG Docs 專注於通過出色的文檔最大限度地提高開發人員的滿意度
- 以身作則，踐行[社區行爲準則](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)，
  並要求 SIG 成員對自身行爲負責
- 通過更新貢獻指南，爲 SIG 學習並設置最佳實踐
- 安排和舉行 SIG 會議：每週狀態更新，每季度回顧/計劃會議以及其他需要的會議
- 在 KubeCon 活動和其他會議上安排和負責文檔工作
- 與 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 及其尊貴合作伙伴
  （包括 Google、Oracle、Azure、IBM 和華爲）一起以 SIG Docs 的身份招募和宣傳
- 負責 SIG 正常運行

<!--
### Running effective meetings

To schedule and run effective meetings, these guidelines show what to do, how to do it, and why.

**Uphold the [community code of conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)**:

- Hold respectful, inclusive discussions with respectful, inclusive language.
-->
### 召開高效的會議   {#running-effective-meetings}

爲了安排和召開高效的會議，這些指南說明了如何做、怎樣做以及原因。

**堅持[社區行爲準則](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)**：

- 相互尊重地、包容地進行討論。

<!--
**Set a clear agenda**:

- Set a clear agenda of topics
- Publish the agenda in advance

For weekly meetings, copypaste the previous week's notes into the "Past meetings" section of the notes
-->
**設定明確的議程**：

- 設定清晰的主題議程
- 提前發佈議程

對於每週一次的會議，請將前一週的筆記複製並粘貼到筆記的“過去的會議”部分中

<!--
**Collaborate on accurate notes**:

- Record the meeting's discussion
- Consider delegating the role of note-taker

**Assign action items clearly and accurately**:

- Record the action item, who is assigned to it, and the expected completion date
-->
**通過協作，完成準確的記錄**：

- 記錄會議討論
- 考慮委派筆記記錄員的角色

**清晰準確地分配執行項目**：

- 記錄操作項，分配給它的人員以及預期的完成日期

<!--
**Moderate as needed**:

- If discussion strays from the agenda, refocus participants on the current topic
- Make room for different discussion styles while keeping the discussion focused and honoring folks' time

**Honor folks' time**:

Begin and end meetings on time.
-->
**根據需要來進行協調**：

- 如果討論偏離議程，請讓參與者重新關注當前主題
- 爲不同的討論風格留出空間，同時保持討論重點並尊重人們的時間

**尊重大家的時間**:

按時開始和結束會議

<!--
**Use Zoom effectively**:

- Familiarize yourself with [Zoom guidelines for Kubernetes](https://github.com/kubernetes/community/blob/master/communication/zoom-guidelines.md)
- Claim the host role when you log in by entering the host key

<img src="/images/docs/contribute/claim-host.png" width="75%" alt="Claiming the host role in Zoom" />
-->
**有效利用 Zoom**：

- 熟悉 [Kubernetes Zoom 指南](https://github.com/kubernetes/community/blob/master/communication/zoom-guidelines.md)
- 輸入主持人密鑰登錄時聲明主持人角色

<img src="/images/docs/contribute/claim-host.png" width="75%" alt="聲明 Zoom 主持人角色" />

<!--
### Recording meetings on Zoom

When you're ready to start the recording, click Record to Cloud.

When you're ready to stop recording, click Stop.

The video uploads automatically to YouTube.
-->
### 錄製 Zoom 會議   {#recording-meetings-on-zoom}

準備開始錄製時，請單擊“錄製到雲”。

準備停止錄製時，請單擊“停止”。

視頻會自動上傳到 YouTube。

<!--
### Offboarding a SIG Co-chair (Emeritus)

See: [k/community/sig-docs/offboarding.md](https://github.com/kubernetes/community/blob/master/sig-docs/offboarding.md)
-->
### SIG 聯合主席 (Emeritus) 離職  {#offboarding-a-sig-cochair}

參見 [k/community/sig-docs/offboarding.md](https://github.com/kubernetes/community/blob/master/sig-docs/offboarding.md)
