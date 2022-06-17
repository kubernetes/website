---
title: Kubernetes 釋出週期
type: docs
---
<!-- 
title: Kubernetes Release Cycle
type: docs
auto_generated: true
-->

<!-- THIS CONTENT IS AUTO-GENERATED via ./scripts/releng/update-release-info.sh in k/website -->

{{< warning >}}
<!-- 
This content is auto-generated and links may not function. The source of the document is located [here](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/release.md).
-->
此內容原文是自動生成的，連結可能無法正常訪問。
文件的來源在[這裡](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/release.md)。
{{< /warning >}}

<!-- 
# Targeting enhancements, Issues and PRs to Release Milestones

This document is focused on Kubernetes developers and contributors who need to
create an enhancement, issue, or pull request which targets a specific release
milestone.
-->
# 針對釋出里程碑的特性增強、Issue 和 PR  {#targeting-enhancements-issues-and-prs-to-release-milestones}

本文件重點是面向於那些需要建立針對特定釋出里程碑的特性增強、問題或拉取請求的 Kubernetes 開發人員和貢獻者。

<!-- 
- [TL;DR](#tldr)
  - [Normal Dev (Weeks 1-11)](#normal-dev-weeks-1-11)
  - [Code Freeze (Weeks 12-14)](#code-freeze-weeks-12-14)
  - [Post-Release (Weeks 14+)](#post-release-weeks-14+)
- [Definitions](#definitions)
- [The Release Cycle](#the-release-cycle)
- [Removal Of Items From The Milestone](#removal-of-items-from-the-milestone)
- [Adding An Item To The Milestone](#adding-an-item-to-the-milestone)
  - [Milestone Maintainers](#milestone-maintainers)
  - [Feature additions](#feature-additions)
  - [Issue additions](#issue-additions)
  - [PR Additions](#pr-additions)
- [Other Required Labels](#other-required-labels)
  - [SIG Owner Label](#sig-owner-label)
  - [Priority Label](#priority-label)
  - [Issue/PR Kind Label](#issuepr-kind-label)
-->
- [TL;DR](#tldr)
   - [正常開發（第 1-11周）](#normal-dev-weeks-1-11)
   - [程式碼凍結（第 12-14 周）](#code-freeze-weeks-12-14)
   - [釋出後（第 14 周以上）](#post-release-weeks-14)
- [定義](#definitions)
- [釋出週期](#the-release-cycle)
- [從里程碑中刪除專案](#removal-of-items-from-the-milestone)
- [向里程碑新增專案](#adding-an-item-to-the-milestone)
   - [里程碑維護者](#milestone-maintainers)
   - [新增特性](#feature-additions)
   - [問題補充](#issue-additions)
   - [新增 PR](#pr-additions)
- [其他必需標籤](#other-required-labels)
   - [SIG 所有者標籤](#sig-owner-label)
   - [優先順序標籤](#priority-label)
   - [Issue/PR 分類標籤](#issuepr-kind-label)

<!-- 
The process for shepherding enhancements, issues, and pull requests into a
Kubernetes release spans multiple stakeholders:

- the enhancement, issue, and pull request owner(s)
- SIG leadership
- the [Release Team][release-team]

Information on workflows and interactions are described below.
-->
將特性增強、問題和拉取請求引入 Kubernetes 版本的過程涉及多個利益相關者：

- 特性增強、問題和拉取請求的所有者
- SIG 負責人
- [釋出團隊][release-team]

關於工作流程和互動的資訊如下所述。

<!-- 
As the owner of an enhancement, issue, or pull request (PR), it is your
responsibility to ensure release milestone requirements are met. Automation and
the Release Team will be in contact with you if updates are required, but
inaction can result in your work being removed from the milestone. Additional
requirements exist when the target milestone is a prior release (see
[cherry pick process][cherry-picks] for more information).
-->
作為特性增強、問題或拉取請求 (PR) 的所有者，你有責任確保滿足里程碑釋出要求。
如果需要更新，自動化和釋出團隊將與你聯絡，但無響應可能會導致你的工作從里程碑中刪除。
當目標里程碑是先前版本時，還存在其他要求（請參閱 [Cherry Pick 流程][cherry-picks]瞭解更多資訊）。

## TL;DR

<!-- 
If you want your PR to get merged, it needs the following required labels and
milestones, represented here by the Prow /commands it would take to add them:
-->
如果你希望你的 PR 被合併，它需要以下必備的標籤和里程碑，它們由 Prow /commands 所新增表示：

<!-- 
### Normal Dev (Weeks 1-8)
-->
### 正常開發（第 1-11 周）  {#normal-dev-weeks-1-11}

- /sig {name}
- /kind {type}
- /lgtm
- /approved

<!-- 
### [Code Freeze][code-freeze] (Weeks 12-14)
-->
### [程式碼凍結][code-freeze]（第 12-14 周）  {#code-freeze-code-freeze-weeks-12-14}

- /milestone {v1.y}
- /sig {name}
- /kind {bug, failing-test}
- /lgtm
- /approved

<!-- 
### Post-Release (Weeks 14+)
-->
### 釋出後（第 14 周以上）  {#post-release-weeks-14}

<!-- 
Return to 'Normal Dev' phase requirements:
-->
回到“正常開發”階段要求：

- /sig {name}
- /kind {type}
- /lgtm
- /approved

<!-- 
Merges into the 1.y branch are now [via cherry picks][cherry-picks], approved
by [Release Managers][release-managers].

In the past, there was a requirement for a milestone-targeted pull requests to
have an associated GitHub issue opened, but this is no longer the case.
Features or enhancements are effectively GitHub issues or [KEPs][keps] which
lead to subsequent PRs.

The general labeling process should be consistent across artifact types.
-->
合併到 1.y 分支現在是[透過 Cherry Pick][cherry-picks]，由[釋出管理員][release-managers]批准。

過去，針對里程碑的拉取請求需要開啟相關的 GitHub 問題，但現在情況不再如此。
特性或特性增強實際上是 GitHub 問題或導致後續 PR 的 [KEPs][keps]。

一般的打標籤過程應該在不同工件型別之間保持一致。

<!-- 
## Definitions

- *issue owners*: Creator, assignees, and user who moved the issue into a
  release milestone

- *Release Team*: Each Kubernetes release has a team doing project management
  tasks described [here][release-team].

  The contact info for the team associated with any given release can be found
  [here](https://git.k8s.io/sig-release/releases/).

- *Y days*: Refers to business days

- *enhancement*: see "[Is My Thing an Enhancement?](https://git.k8s.io/enhancements/README.md#is-my-thing-an-enhancement)"
-->
## 定義  {#definitions}

- **問題所有者**：將問題移至釋出里程碑的建立者、委託人和使用者

- **釋出小組**：每個 Kubernetes 版本都有一個團隊來執行[這裡][release-team]所描述的專案管理任務。

  可以在[此處](https://git.k8s.io/sig-release/releases/)找到與任何給定版本相關聯的團隊的聯絡資訊。

- **Y 天**：指工作日

- **增強**：參見“[我的改進是特性增強嗎？](https://git.k8s.io/enhancements/README.md#is-my-thing-an-enhancement)”

<!-- 
- *[Enhancements Freeze][enhancements-freeze]*:
  the deadline by which [KEPs][keps] have to be completed in order for
  enhancements to be part of the current release

- *[Exception Request][exceptions]*:
  The process of requesting an extension on the deadline for a particular
  Enhancement

- *[Code Freeze][code-freeze]*:
  The period of ~4 weeks before the final release date, during which only
  critical bug fixes are merged into the release.

- *[Pruning](https://git.k8s.io/sig-release/releases/release*phases.md#pruning)*:
  The process of removing an Enhancement from a release milestone if it is not
  fully implemented or is otherwise considered not stable.
-->
- **[特性增強凍結][enhancements-freeze]**：
  為了使特性增強成為當前版本的一部分，必須在 [KEPs][keps] 的截止日期前完成

- **[異常請求][exceptions]**：
  請求延長特性增強的截止日期的過程

- **[程式碼凍結][code-freeze]**：
  最終釋出日期前約 4 周的時間，在此期間，僅將關鍵錯誤修復合併到釋出中。

- **[修剪](https://git.k8s.io/sig-release/releases/release*phases.md#pruning)**：
  如果特性增強未完全實現或被認為不穩定，則在此過程中從釋出里程碑中刪除它。

<!-- 
- *release milestone*: semantic version string or
  [GitHub milestone](https://help.github.com/en/github/managing-your-work-on-github/associating-milestones-with-issues-and-pull-requests)
  referring to a release MAJOR.MINOR `vX.Y` version.

  See also
  [release versioning](/contributors/design-proposals/release/versioning.md).

- *release branch*: Git branch `release-X.Y` created for the `vX.Y` milestone.

  Created at the time of the `vX.Y-rc.0` release and maintained after the
  release for approximately 12 months with `vX.Y.Z` patch releases.

  Note: releases 1.19 and newer receive 1 year of patch release support, and
  releases 1.18 and earlier received 9 months of patch release support.
-->
- **釋出里程碑**：語義版本字串或
  [GitHub 里程碑](https://help.github.com/en/github/managing-your-work-on-github/associating-milestones-with-issues-and-pull-requests)
  指的是釋出 主.次 `vX.Y` 版本。

  另請參閱[釋出版本控制](/contributors/design-proposals/release/versioning.md)。

- **釋出分支**：為 `vX.Y` 里程碑建立的 Git 分支 `release-X.Y`。

  在 `vX.Y-rc.0` 釋出時建立，並在釋出後使用 `vX.Y.Z` 補丁版本，維護大約 12 個月。

  注意：1.19 及更高版本獲得 1 年的補丁版本支援，1.18 及更早版本獲得 9 個月的補丁版本支援。

<!-- 
## The Release Cycle
-->
## 釋出週期  {#the-release-cycle}

![Image of one Kubernetes release cycle](release-cycle.jpg)

<!-- 
Kubernetes releases currently happen approximately three times per year.

The release process can be thought of as having three main phases:

- Enhancement Definition
- Implementation
- Stabilization
-->
Kubernetes 目前大約每年釋出三次。

釋出過程可被認為具有三個主要階段：

- 特性增強定義
- 實現
- 穩定

<!-- 
But in reality, this is an open source and agile project, with feature planning
and implementation happening at all times. Given the project scale and globally
distributed developer base, it is critical to project velocity to not rely on a
trailing stabilization phase and rather have continuous integration testing
which ensures the project is always stable so that individual commits can be
flagged as having broken something.
-->
但實際上，這是一個靈活的開源專案，功能規劃和實施始終在進行。
鑑於專案規模和全球分佈的開發人員基礎，對專案速度至關重要的是不依賴於後續的穩定階段，
而是進行持續整合測試，以確保專案始終穩定，以便可以將單個提交標記為有問題。

<!-- 
With ongoing feature definition through the year, some set of items will bubble
up as targeting a given release. **[Enhancements Freeze][enhancements-freeze]**
starts ~4 weeks into release cycle. By this point all intended feature work for
the given release has been defined in suitable planning artifacts in
conjunction with the Release Team's [Enhancements Lead](https://git.k8s.io/sig-release/release-team/role-handbooks/enhancements/README.md).
-->
隨著全年功能定義的不斷進行，某些專案將冒泡作為給定版本的目標。
在釋出週期約 4 周後開始 **[凍結特性增強][enhancements-freeze]**。
至此，針對給定版本的所有預期功能工作都已與釋出團隊的
[特性增強負責人](https://git.k8s.io/sig-release/release-team/role-handbooks/enhancements/README.md)
一起在合適的規劃工件中定義。


<!-- 
After Enhancements Freeze, tracking milestones on PRs and issues is important.
Items within the milestone are used as a punchdown list to complete the
release. *On issues*, milestones must be applied correctly, via triage by the
SIG, so that [Release Team][release-team] can track bugs and enhancements (any
enhancement-related issue needs a milestone).
-->
特性增強凍結後，跟蹤 PR 和問題的里程碑很重要。里程碑中的專案作為完成釋出的下達列表。
**關於問題**，里程碑必須透過 SIG 的分類正確應用，
以便[釋出團隊][release-team]可以跟蹤錯誤和特性增強（任何與特性增強相關的問題都需要里程碑）。

<!-- 
There is some automation in place to help automatically assign milestones to
PRs.

This automation currently applies to the following repos:
-->
自動化可以自動將里程碑分配給 PR。

此自動化當前適用於以下儲存庫：

- `kubernetes/enhancements`
- `kubernetes/kubernetes`
- `kubernetes/release`
- `kubernetes/sig-release`
- `kubernetes/test-infra`

<!--
At creation time, PRs against the `master` branch need humans to hint at which
milestone they might want the PR to target. Once merged, PRs against the
`master` branch have milestones auto-applied so from that time onward human
management of that PR's milestone is less necessary. On PRs against release
branches, milestones are auto-applied when the PR is created so no human
management of the milestone is ever necessary.
-->
在建立時，針對 `master` 分支的 PR 需要人工提示他們可能希望 PR 指向哪個里程碑。
一旦合併，針對 `master` 分支的 PR 會自動應用里程碑，因此從那時起，不再需要人工管理該 PR 的里程碑。
在指向釋出分支的 PR 上，會在建立 PR 時自動應用里程碑，因此不需要對里程碑進行人工管理。

<!-- 
Any other effort that should be tracked by the Release Team that doesn't fall
under that automation umbrella should be have a milestone applied.

Implementation and bug fixing is ongoing across the cycle, but culminates in a
code freeze period.

**[Code Freeze][code-freeze]** starts in week ~12 and continues for ~2 weeks.
Only critical bug fixes are accepted into the release codebase during this
time.
-->
任何其他應該由釋出團隊跟蹤的不屬於該自動化保護傘的工作都應該應用一個里程碑。

整個週期都在進行實施和錯誤修復，但最終會出現程式碼凍結期。

**[程式碼凍結][code-freeze]** 大約從第 12 周開始，持續約 2 周。
在此期間，只有關鍵的錯誤修復才會被接受到釋出程式碼庫中。

<!-- 
There are approximately two weeks following Code Freeze, and preceding release,
during which all remaining critical issues must be resolved before release.
This also gives time for documentation finalization.

When the code base is sufficiently stable, the master branch re-opens for
general development and work begins there for the next release milestone. Any
remaining modifications for the current release are cherry picked from master
back to the release branch. The release is built from the release branch.

Each release is part of a broader Kubernetes lifecycle:
-->
在程式碼凍結之後和之前的釋出之間大約有兩週時間，在此期間，必須在釋出版本前解決所有剩餘的嚴重問題。
這也為文件定稿提供了時間。

當代碼庫足夠穩定時，主分支將重新開啟以進行一般開發，並從那裡開始下一個釋出里程碑的工作。
當前版本的任何剩餘修改都是從 master 挑選回釋出分支。釋出版本是從釋出分支構建的。

每個版本都是更廣泛的 Kubernetes 生命週期的一部分：

![Image of Kubernetes release lifecycle spanning three releases](release-lifecycle.jpg)

<!-- 
## Removal Of Items From The Milestone

Before getting too far into the process for adding an item to the milestone,
please note:

Members of the [Release Team][release-team] may remove issues from the
milestone if they or the responsible SIG determine that the issue is not
actually blocking the release and is unlikely to be resolved in a timely
fashion.

Members of the Release Team may remove PRs from the milestone for any of the
following, or similar, reasons:
-->
## 從里程碑中刪除專案  {#removal-of-items-from-the-milestone}

在深入瞭解將專案新增到里程碑的過程之前，請注意：

如果[釋出小組][release-team]的成員或負責的 SIG
確定問題實際上並未阻止釋出並且不太可能及時解決，則可以從里程碑中刪除問題。

釋出團隊的成員可以出於以下任何原因或類似原因從里程碑中刪除 PR：

<!-- 
- PR is potentially de-stabilizing and is not needed to resolve a blocking
  issue
- PR is a new, late feature PR and has not gone through the enhancements
  process or the [exception process][exceptions]
- There is no responsible SIG willing to take ownership of the PR and resolve
  any follow-up issues with it
- PR is not correctly labelled
- Work has visibly halted on the PR and delivery dates are uncertain or late
-->
- PR 可能會破壞穩定，並且不需要去解決阻塞問題
- PR 是一個新的、較晚的特性 PR 並且沒有經過增強過程或[異常過程][exceptions]
- 沒有負責任的 SIG 願意接管 PR 並解決任何後續問題
- PR 未正確標記
- PR 工作明顯停止，交付日期不確定或延遲

<!-- 
While members of the Release Team will help with labelling and contacting
SIG(s), it is the responsibility of the submitter to categorize PRs, and to
secure support from the relevant SIG to guarantee that any breakage caused by
the PR will be rapidly resolved.

Where additional action is required, an attempt at human to human escalation
will be made by the Release Team through the following channels:
-->
雖然釋出團隊的成員將幫助標記和聯絡 SIG，但提交者有責任對 PR 進行分類，
並獲得相關 SIG 的支援，以保證由 PR 引起的任何破壞都會得到迅速解決。

如果需要採取其他措施，釋出團隊將透過以下渠道嘗試進行人與人之間的對話：

<!-- 
- Comment in GitHub mentioning the SIG team and SIG members as appropriate for
  the issue type
- Emailing the SIG mailing list
  - bootstrapped with group email addresses from the
    [community sig list][sig-list]
  - optionally also directly addressing SIG leadership or other SIG members
- Messaging the SIG's Slack channel
  - bootstrapped with the slackchannel and SIG leadership from the
    [community sig list][sig-list]
  - optionally directly "@" mentioning SIG leadership or others by handle
-->
- 在 GitHub 中發表評論，根據問題型別提及 SIG 團隊和 SIG 成員
- 給 SIG 郵件列表發郵件
   - 使用來自[社群 SIG 列表][sig-list]的群組電子郵件地址進行引導
   - 也可選擇直接與 SIG 負責人或 SIG 其他成員聯絡
- 向 SIG 的 Slack 頻道傳送訊息
   - 在 Slack 頻道 和 SIG 負責人的引導下
     [社群簽名列表][簽名列表]
   - 可選地直接 “@” 來提及 SIG 負責人或其他人

<!-- 
## Adding An Item To The Milestone

### Milestone Maintainers

The members of the [`milestone-maintainers`](https://github.com/orgs/kubernetes/teams/milestone-maintainers/members)
GitHub team are entrusted with the responsibility of specifying the release
milestone on GitHub artifacts.

This group is [maintained](https://git.k8s.io/sig-release/release-team/README.md#milestone-maintainers)
by SIG Release and has representation from the various SIGs' leadership.
-->
## 向里程碑新增專案  {#adding-an-item-to-the-milestone}

### 里程碑維護者  {#milestone-maintainers}

[`milestone-maintainers`](https://github.com/orgs/kubernetes/teams/milestone-maintainers/members)
GitHub 團隊的成員負責在 GitHub 工件上指定釋出里程碑。

該小組由 SIG Release
[維護](https://git.k8s.io/sig-release/release-team/README.md#milestone-maintainers)，並有來自各個 SIG 負責人的代表。

<!-- 
### Feature additions

Feature planning and definition takes many forms today, but a typical example
might be a large piece of work described in a [KEP][keps], with associated task
issues in GitHub. When the plan has reached an implementable state and work is
underway, the enhancement or parts thereof are targeted for an upcoming milestone
by creating GitHub issues and marking them with the Prow "/milestone" command.
-->
### 特性新增  {#feature-additions}

如今，功能規劃和定義有多種形式，但一個典型的例子可能是
[KEP][keps] 中描述的大量工作，以及 GitHub 中的相關任務問題。
當計劃達到可實施狀態並且工作正在進行中時，透過建立 GitHub 問題並使用
Prow "/milestone" 命令對其進行標記，特性增強或其部分指向未來的里程碑。

<!-- 
For the first ~4 weeks into the release cycle, the Release Team's Enhancements
Lead will interact with SIGs and feature owners via GitHub, Slack, and SIG
meetings to capture all required planning artifacts.

If you have an enhancement to target for an upcoming release milestone, begin a
conversation with your SIG leadership and with that release's Enhancements
Lead.
-->
在釋出週期的前 4 周左右內，釋出團隊的特性增強負責人將透過
GitHub、Slack 和 SIG 會議與 SIG 和特性所有者互動，以獲取所有需要的計劃工件。

如果你有針對即將釋出的里程碑的特性增強，請與你的 SIG 領導以及該版本的特性增強負責人開始對話。

<!-- 
### Issue additions

Issues are marked as targeting a milestone via the Prow "/milestone" command.

The Release Team's [Bug Triage Lead](https://git.k8s.io/sig-release/release-team/role-handbooks/bug-triage/README.md)
and overall community watch incoming issues and triage them, as described in
the contributor guide section on
[issue triage](/contributors/guide/issue-triage.md).
-->
### 問題補充  {#issue-additions}

透過 Prow “/milestone” 命令標記問題並指向里程碑。

釋出團隊的[錯誤分類負責人](https://git.k8s.io/sig-release/release-team/role-handbooks/bug-triage/README.md)和整個社群觀察新出現的問題並對其進行分類，
在貢獻者指南部分中描述[問題分類](/contributors/guide/issue-triage.md)。

<!-- 
Marking issues with the milestone provides the community better visibility
regarding when an issue was observed and by when the community feels it must be
resolved. During [Code Freeze][code-freeze], a milestone must be set to merge
a PR.

An open issue is no longer required for a PR, but open issues and associated
PRs should have synchronized labels. For example a high priority bug issue
might not have its associated PR merged if the PR is only marked as lower
priority.
-->
用里程碑標記問題可以讓社群更好地瞭解何時觀察到問題以及社群認為何時必須解決問題。
[程式碼凍結][code-freeze]期間，必須設定里程碑以合併 PR。

一個 PR 不再需要一個已開啟的問題，但已開啟的問題和相關的 PR 應該有同步的標籤。
例如，如果 PR 僅標記為較低優先順序，則高優先順序錯誤問題可能不會合並其關聯的 PR。

<!-- 
### PR Additions

PRs are marked as targeting a milestone via the Prow "/milestone" command.

This is a blocking requirement during Code Freeze as described above.
-->
### PR 補充  {#pr-additions}

PR 透過 Prow “/milestone” 命令標記並指向里程碑。

如上所述，這是程式碼凍結期間的阻塞要求。

<!-- 
## Other Required Labels

[Here is the list of labels and their use and purpose.](https://git.k8s.io/test-infra/label*sync/labels.md#labels-that-apply-to-all-repos-for-both-issues-and-prs)
-->
## 其他必需的標籤  {#other-required-labels}

[這裡是標籤列表及其用途和目的](https://git.k8s.io/test-infra/label*sync/labels.md#labels-that-apply-to-all-repos-for-both-issues-and-prs)。

<!-- 
### SIG Owner Label

The SIG owner label defines the SIG to which we escalate if a milestone issue
is languishing or needs additional attention. If there are no updates after
escalation, the issue may be automatically removed from the milestone.

These are added with the Prow "/sig" command. For example to add the label
indicating SIG Storage is responsible, comment with `/sig storage`.
-->
### SIG 所有者標籤  {#sig-owner-label}

SIG 所有者標籤定義了當里程碑問題未取得進展或需要額外關注時，我們應該逐步升級的 SIG。
如果升級後沒有更新，該問題可能會自動從里程碑中刪除。

這些是透過 Prow "/sig" 命令新增的。
例如要新增指示 SIG Storage 負責的標籤，請使用 `/sig storage` 進行評論。

<!-- 
### Priority Label

Priority labels are used to determine an escalation path before moving issues
out of the release milestone. They are also used to determine whether or not a
release should be blocked on the resolution of the issue.
-->
### 優先順序標籤  {#priority-label}

優先順序標籤用於在將問題移出釋出里程碑之前確定升級路徑。
它們還用於確定在解決問題時是否應阻止釋出。

<!-- 
- `priority/critical-urgent`: Never automatically move out of a release
  milestone; continually escalate to contributor and SIG through all available
  channels.
  - considered a release blocking issue
  - requires daily updates from issue owners during [Code Freeze][code-freeze]
  - would require a patch release if left undiscovered until after the minor
    release
- `priority/important-soon`: Escalate to the issue owners and SIG owner; move
  out of milestone after several unsuccessful escalation attempts.
  - not considered a release blocking issue
  - would not require a patch release
  - will automatically be moved out of the release milestone at Code Freeze
    after a 4 day grace period
- `priority/important-longterm`: Escalate to the issue owners; move out of the
  milestone after 1 attempt.
  - even less urgent / critical than `priority/important-soon`
  - moved out of milestone more aggressively than `priority/important-soon`
-->
- `priority/critical-urgent`：永遠不會自動移出釋出里程碑；透過所有可用渠道不斷上報給貢獻者和 SIG。
   - 考慮釋出阻塞問題
   - 在[程式碼凍結][code-freeze]期間需要問題所有者的每日更新
   - 如果在次要版本之後才被發現，則需要補丁版本
- `priority/important-soon`：上報給問題所有者和 SIG 所有者；在幾次不成功的升級嘗試後退出里程碑。
   - 不考慮釋出阻止問題
   - 不需要補丁版本
   - 將在 4 天的寬限期後自動移出程式碼凍結的釋出里程碑
- `priority/important-longterm`：上報給問題所有者；1 次嘗試後移出里程碑
   - 比 `priority/important-soon` 更不緊急/不關鍵
   - 比 `priority/important-soon` 更積極地移出里程碑

<!-- 
### Issue/PR Kind Label

The issue kind is used to help identify the types of changes going into the
release over time. This may allow the Release Team to develop a better
understanding of what sorts of issues we would miss with a faster release
cadence.

For release targeted issues, including pull requests, one of the following
issue kind labels must be set:
-->
### Issue/PR 分類標籤  {#issue-pr-kind-label}

Issue 型別用於幫助識別隨著時間的推移進入版本的更改型別。
這可以讓釋出團隊更好地瞭解我們會在更快的釋出節奏下錯過哪些型別的 Issue。

對於釋出版本的目標問題，包括拉取請求，必須設定以下問題型別標籤之一：

<!-- 
- `kind/api-change`: Adds, removes, or changes an API
- `kind/bug`: Fixes a newly discovered bug.
- `kind/cleanup`: Adding tests, refactoring, fixing old bugs.
- `kind/design`: Related to design
- `kind/documentation`: Adds documentation
- `kind/failing-test`: CI test case is failing consistently.
- `kind/feature`: New functionality.
- `kind/flake`: CI test case is showing intermittent failures.
-->
- `kind/api-change`：新增、刪除或更改 API
- `kind/bug`：修復了一個新發現的錯誤
- `kind/cleanup`：新增測試、重構、修復舊錯誤
- `kind/design`：與設計相關
- `kind/documentation`：新增文件
- `kind/failing-test`：CI 測試用例一直失敗
- `kind/feature`：新功能
- `kind/flake`：CI 測試用例顯示間歇性故障

[cherry-picks]: /contributors/devel/sig-release/cherry-picks.md
[code-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#code-freeze
[enhancements-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#enhancements-freeze
[exceptions]: https://git.k8s.io/sig-release/releases/release_phases.md#exceptions
[keps]: https://git.k8s.io/enhancements/keps
[release-managers]: https://kubernetes.io/releases/release-managers/
[release-team]: https://git.k8s.io/sig-release/release-team
[sig-list]: /sig-list.md
