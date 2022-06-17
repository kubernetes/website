---
title: 釋出管理員
type: docs
---
<!-- 
title: Release Managers
type: docs
-->

<!-- 
"Release Managers" is an umbrella term that encompasses the set of Kubernetes
contributors responsible for maintaining release branches, tagging releases,
and building/packaging Kubernetes.

The responsibilities of each role are described below.
-->
“釋出管理員（Release Managers）”是一個總稱，包括一批負責維護髮布分支、標記發行版本以及構建/打包
Kubernetes 的 Kubernetes 貢獻者。

每個角色的職責如下所述。

<!-- 
- [Contact](#contact)
  - [Security Embargo Policy](#security-embargo-policy)
- [Handbooks](#handbooks)
- [Release Managers](#release-managers)
  - [Becoming a Release Manager](#becoming-a-release-manager)
- [Release Manager Associates](#release-manager-associates)
  - [Becoming a Release Manager Associate](#becoming-a-release-manager-associate)
- [Build Admins](#build-admins)
- [SIG Release Leads](#sig-release-leads)
  - [Chairs](#chairs)
  - [Technical Leads](#technical-leads)
-->
- [聯絡方式](#contact)
   - [安全禁運政策](#security-embargo-policy)
- [手冊](#handbooks)
- [釋出管理員](#release-managers)
   - [成為釋出管理員](#becoming-a-release-manager)
- [釋出管理員助理](#release-manager-associates)
   - [成為釋出管理員助理](#becoming-a-release-manager-associate)
- [構建管理員](#build-admins)
- [SIG 釋出負責人](#sig-release-leads)
   - [首席](#chairs)
   - [技術負責人](#technical-leads)

<!-- 
## Contact

| Mailing List | Slack | Visibility | Usage | Membership |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y) (channel) / @release-managers (user group) | Public | Public discussion for Release Managers | All Release Managers (including Associates, Build Admins, and SIG Chairs) |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | N/A | Private | Private discussion for privileged Release Managers | Release Managers, SIG Release leadership |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG) (channel) / @security-rel-team (user group) | Private | Security release coordination with the Security Response Committee | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |
-->
## 聯絡方式  #{contact}

| 郵件列表 | Slack | 可見 | 用法 | 會員資格 |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y)（頻道）/@release-managers（使用者組）| 公共 | 釋出管理員的公開討論 | 所有釋出管理員（包括助理、構建管理員和 SIG 主席）|
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | 不適用 | 私人 | 擁有特權的釋出管理員私人討論 | 釋出管理員，SIG Release 負責人 |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG)（頻道）/@security-rel-team（使用者組）| 私人 | 與安全響應委員會協調的安全釋出 | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |

<!-- 
### Security Embargo Policy

Some information about releases is subject to embargo and we have defined policy about how those embargoes are set. Please refer to the [Security Embargo Policy](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy) for more information.
-->
### 安全禁運政策  {#security-embargo-policy}

釋出的相關資訊受到禁運，我們已經定義了有關如何設定這些禁運的政策。
更多資訊請參考[安全禁運政策](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy)。

<!-- 
## Handbooks

**NOTE: The Patch Release Team and Branch Manager handbooks will be de-duplicated at a later date.**

- [Patch Release Team][handbook-patch-release]
- [Branch Managers][handbook-branch-mgmt]
- [Build Admins][handbook-packaging]
-->
## 手冊  {#handbooks}

**注意：補丁釋出團隊和分支管理員手冊以後將會刪除重複資料。**

- [補丁釋出團隊][handbook-patch-release]
- [分支管理員][handbook-branch-mgmt]
- [構建管理員][handbook-packaging]

<!-- 
## Release Managers

**Note:** The documentation might refer to the Patch Release Team and the
Branch Management role. Those two roles were consolidated into the
Release Managers role.

Minimum requirements for Release Managers and Release Manager Associates are:

- Familiarity with basic Unix commands and able to debug shell scripts.
- Familiarity with branched source code workflows via `git` and associated
  `git` command line invocations.
- General knowledge of Google Cloud (Cloud Build and Cloud Storage).
- Open to seeking help and communicating clearly.
- Kubernetes Community [membership][community-membership]
-->
## 釋出管理員  {#release-managers}

**注意：** 文件可能涉及補丁釋出團隊和分支管理角色。這兩個角色被合併到釋出管理員角色中。

釋出管理員和釋出管理員助理的最低要求是：

- 熟悉基本的 Unix 命令並能夠除錯 shell 指令碼。
- 熟悉透過 `git` 和 `git` 相關的命令列觸發的分支原始碼工作流。
- 谷歌雲的常識（雲構建和雲端儲存）。
- 樂於尋求幫助和清晰地溝通。
- Kubernetes 社群 [會員資格][community-membership]

<!-- 
Release Managers are responsible for:

- Coordinating and cutting Kubernetes releases:
  - Patch releases (`x.y.z`, where `z` > 0)
  - Minor releases (`x.y.z`, where `z` = 0)
  - Pre-releases (alpha, beta, and release candidates)
  - Working with the [Release Team][release-team] through each
  release cycle
  - Setting the [schedule and cadence for patch releases][patches]
- Maintaining the release branches:
  - Reviewing cherry picks
  - Ensuring the release branch stays healthy and that no unintended patch
    gets merged
- Mentoring the [Release Manager Associates](#associates) group
- Actively developing features and maintaining the code in k/release
- Supporting Release Manager Associates and contributors through actively
  participating in the Buddy program
  - Check in monthly with Associates and delegate tasks, empower them to cut
    releases, and mentor
  - Being available to support Associates in onboarding new contributors e.g.,
    answering questions and suggesting appropriate work for them to do
-->
釋出管理員負責：

- 協調和確定 Kubernetes 發行版本：
  - 補丁釋出（`x.y.z`，其中 `z` > 0）
  - 次要版本（`x.y.z`，其中 `z` = 0）
  - 預釋出（alpha、beta 和候選釋出）
  - 透過每個釋出週期與[釋出小組][release-team]合作
  - 設定[補丁釋出的時間表和節奏][patches]
- 維護髮布分支：
  - 審查 Cherry Pick
  - 確保釋出分支保持健康並且沒有合併意外的補丁
- 指導[釋出管理員助理](#associates)小組
- 積極開發功能並維護 k/release 中的程式碼
- 透過積極參與 Buddy 計劃來支援釋出管理員助理和貢獻者
  - 每月與助理核對並委派任務，授權他們生成發行版本並指導工作
  - 支援助理小組加入新的貢獻者，例如回答問題並建議他們做適當的工作

<!-- 
This team at times works in close conjunction with the
[Security Response Committee][src] and therefore should abide by the guidelines
set forth in the [Security Release Process][security-release-process].

GitHub Access Controls: [@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

GitHub Mentions: [@kubernetes/release-engineering](https://github.com/orgs/kubernetes/teams/release-engineering)
-->
該團隊有時與[安全響應委員會][src]密切合作，因此應遵守[安全釋出流程][security-release-process]中規定的指導方針。

GitHub 訪問控制：[@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

GitHub 提及：[@kubernetes/release-engineering](https://github.com/orgs/kubernetes/teams/release-engineering)

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Marko Mudrinić ([@xmudrii](https://github.com/xmudrii))
- Nabarun Pal ([@palnabarun](https://github.com/palnabarun))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))
- Verónica López ([@verolop](https://github.com/verolop))

<!--
### Becoming a Release Manager

To become a Release Manager, one must first serve as a Release Manager
Associate. Associates graduate to Release Manager by actively working on
releases over several cycles and:

- demonstrating the willingness to lead
- tag-teaming with Release Managers on patches, to eventually cut a release
  independently
  - because releases have a limiting function, we also consider substantial
    contributions to image promotion and other core Release Engineering tasks
- questioning how Associates work, suggesting improvements, gathering feedback,
  and driving change
- being reliable and responsive
- leaning into advanced work that requires Release Manager-level access and
  privileges to complete
-->
### 成為釋出管理員  {#becoming-a-release-manager}

要成為釋出管理員，首先必須擔任釋出管理員助理。助理透過在多個週期內積極處理釋出，從而畢業成為釋出管理員，並且：

- 表現出帶頭的意願
- 與釋出管理員合作，為補丁打標記，最終獨立製作發行版本
   - 因為釋出具有限制功能，我們還考慮對映象推廣和其他核心釋出工程任務的實質性貢獻
- 質疑助理的工作方式、提出改進建議、收集反饋並推動變革
- 可靠且反應迅速
- 專注於需要釋出管理員級別訪問和許可權才能完成的高階工作

<!-- 
## Release Manager Associates

Release Manager Associates are apprentices to the Release Managers, formerly
referred to as Release Manager shadows. They are responsible for:

- Patch release work, cherry pick review
- Contributing to k/release: updating dependencies and getting used to the
  source codebase
- Contributing to the documentation: maintaining the handbooks, ensuring that
  release processes are documented
- With help from a release manager: working with the Release Team during the
  release cycle and cutting Kubernetes releases
- Seeking opportunities to help with prioritization and communication
  - Sending out pre-announcements and updates about patch releases
  - Updating the calendar, helping with the release dates and milestones from
    the [release cycle timeline][k-sig-release-releases]
- Through the Buddy program, onboarding new contributors and pairing up with
  them on tasks

GitHub Mentions: @kubernetes/release-engineering
-->
## 釋出管理員助理  {#release-manager-associates}

釋出管理員助理是釋出管理員的學徒，以前稱為釋出管理員影子。他們負責：

- 補丁釋出工作，Cherry Pick 審查
- 為 k/release 做貢獻：更新依賴並習慣原始碼庫
- 為文件做貢獻：維護手冊，確保釋出過程記錄在案
- 在釋出管理員的幫助下：在釋出週期中與釋出團隊合作並減少 Kubernetes 髮型版本
- 尋求機會幫助確定優先順序和溝通
   - 傳送有關補丁釋出的預告和更新
   - 更新日曆，幫助確定[釋出週期時間線][k-sig-release-releases]中的釋出日期和里程碑
- 透過 Buddy 計劃，加入新的貢獻者並與他們合作完成任務

GitHub 提及：@kubernetes/release-engineering

- Arnaud Meukam ([@ameukam](https://github.com/ameukam))
- Jim Angel ([@jimangel](https://github.com/jimangel))
- Joyce Kung ([@thejoycekung](https://github.com/thejoycekung))
- Max Körbächer ([@mkorbi](https://github.com/mkorbi))
- Seth McCombs ([@sethmccombs](https://github.com/sethmccombs))
- Taylor Dolezal ([@onlydole](https://github.com/onlydole))
- Wilson Husin ([@wilsonehusin](https://github.com/wilsonehusin))

<!-- 
### Becoming a Release Manager Associate

Contributors can become Associates by demonstrating the following:

- consistent participation, including 6-12 months of active release
  engineering-related work
- experience fulfilling a technical lead role on the Release Team during a
  release cycle
  - this experience provides a solid baseline for understanding how SIG Release
    works overall—including our expectations regarding technical skills,
    communications/responsiveness, and reliability
- working on k/release items that improve our interactions with Testgrid,
  cleaning up libraries, etc.
  - these efforts require interacting and pairing with Release Managers and
    Associates
-->
### 成為釋出管理員助理  {#becoming-a-release-manager-associate}

貢獻者可以透過展示以下內容成為助理：

- 持續參與，包括 6-12 個月的釋出工程相關的積極工作
- 在釋出週期內擔任釋出團隊的技術負責人角色的經驗
   - 這種經驗為理解 SIG Release 如何整體運作提供了堅實的基礎——包括我們對技術技能、溝通、響應能力和可靠性的期望
- 致力於改進我們與 Testgrid 互動的 k/release 專案，清理倉庫等。
   - 這些工作需要與釋出管理員和助理進行互動和合作

<!-- 
## Build Admins

Build Admins are (currently) Google employees with the requisite access to
Google build systems/tooling to publish deb/rpm packages on behalf of the
Kubernetes project. They are responsible for:

- Building, signing, and publishing the deb/rpm packages
- Being the interlock with Release Managers (and Associates) on the final steps
of each minor (1.Y) and patch (1.Y.Z) release

GitHub team: [@kubernetes/build-admins](https://github.com/orgs/kubernetes/teams/build-admins)
-->
## 構建管理員  {#build-admins}

構建管理員（目前）是谷歌員工，他們擁有對谷歌構建系統/工具的必要訪問許可權，可以代表 Kubernetes 專案釋出 deb/rpm 包。他們負責：

- 構建、簽名和釋出 deb/rpm 包
- 在每個次要 (1.Y) 和補丁 (1.Y.Z) 版本的最後步驟中與釋出管理員（和助理）互鎖

GitHub 團隊：[@kubernetes/build-admins](https://github.com/orgs/kubernetes/teams/build-admins)

- Aaron Crickenberger ([@spiffxp](https://github.com/spiffxp))
- Benjamin Elder ([@BenTheElder](https://github.com/BenTheElder))
- Grant McCloskey ([@MushuEE](https://github.com/MushuEE))
- Juan Escobar ([@juanfescobar](https://github.com/juanfescobar))

<!-- 
## SIG Release Leads

SIG Release Chairs and Technical Leads are responsible for:

- The governance of SIG Release
- Leading knowledge exchange sessions for Release Managers and Associates
- Coaching on leadership and prioritization

They are mentioned explicitly here as they are owners of the various
communications channels and permissions groups (GitHub teams, GCP access) for
each role. As such, they are highly privileged community members and privy to
some private communications, which can at times relate to Kubernetes security
disclosures.

GitHub team: [@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)
-->
## SIG Release 負責人  {#sig-release-leads}

SIG Release 主席和技術負責人負責：

- SIG Release 的治理
- 領導釋出管理員和助理的知識交流會議
- 傳授領導力和優先排序方法

此處明確提及他們，因為他們是每個角色的各種溝通渠道和許可權組（GitHub 團隊、GCP 訪問）的所有者。
因此，他們是享有很高特權的社群成員，並參與了一些私人溝通，這些溝通有時可能與 Kubernetes 安全披露有關。

GitHub 團隊：[@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)

<!-- 
### Chairs
-->
### 主席  {#chairs}

- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))

<!-- 
### Technical Leads
-->
### 技術負責人  {#technical-leads}

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))

---

<!-- 
Past Branch Managers, can be found in the [releases directory][k-sig-release-releases]
of the kubernetes/sig-release repository within `release-x.y/release_team.md`.

Example: [1.15 Release Team](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)
-->
過去的分支管理員，可以在 `release-x.y/release_team.md`
中 kubernetes/sig-release 倉庫的[釋出目錄][k-sig-release-releases]中找到。

例如：[1.15 釋出團隊](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)

[community-membership]: https://git.k8s.io/community/community-membership.md#member
[handbook-branch-mgmt]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/branch-manager.md
[handbook-packaging]: https://git.k8s.io/sig-release/release-engineering/packaging.md
[handbook-patch-release]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/patch-release-team.md
[k-sig-release-releases]: https://git.k8s.io/sig-release/releases
[patches]: /patch-releases.md
[src]: https://git.k8s.io/community/committee-security-response/README.md
[release-team]: https://git.k8s.io/sig-release/release-team/README.md
[security-release-process]: https://git.k8s.io/security/security-release-process.md
