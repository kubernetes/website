---
layout: blog
title: "聚焦 SIG Architecture: Enhancements"
slug: sig-architecture-enhancements
date: 2025-01-21
author: "Frederico Muñoz (SAS Institute)"
translator: "Michael Yao (DaoCloud)"
---
<!--
layout: blog
title: "Spotlight on SIG Architecture: Enhancements"
slug: sig-architecture-enhancements
canonicalUrl: https://www.kubernetes.dev/blog/2025/01/21/sig-architecture-enhancements
date: 2025-01-21
author: "Frederico Muñoz (SAS Institute)"
-->

<!--
_This is the fourth interview of a SIG Architecture Spotlight series that will cover the different
subprojects, and we will be covering [SIG Architecture:
Enhancements](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#enhancements)._

In this SIG Architecture spotlight we talked with [Kirsten
Garrison](https://github.com/kikisdeliveryservice), lead of the Enhancements subproject.
-->
**這是 SIG Architecture 聚光燈系列的第四次採訪，我們將介紹
[SIG Architecture: Enhancements](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#enhancements)。**

在本次 SIG Architecture 專題採訪中，我們訪談了 Enhancements
子項目的負責人 [Kirsten Garrison](https://github.com/kikisdeliveryservice)。

<!--
## The Enhancements subproject

**Frederico (FSM): Hi Kirsten, very happy to have the opportunity to talk about the Enhancements
subproject. Let's start with some quick information about yourself and your role.**
-->
## Enhancements 子項目

**Frederico (FSM)：你好 Kirsten，很高興有機會討論 Enhancements
子項目。開始請先介紹一下你自己和所承擔的職責。**

<!--
**Kirsten Garrison (KG)**: I’m a lead of the Enhancements subproject of SIG-Architecture and
currently work at Google. I first got involved by contributing to the service-catalog project with
the help of [Carolyn Van Slyck](https://github.com/carolynvs). With time, [I joined the Release
team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.17/release_team.md),
eventually becoming the Enhancements Lead and a Release Lead shadow. While on the release team, I
worked on some ideas to make the process better for the SIGs and Enhancements team (the opt-in
process) based on my team’s experiences. Eventually, I started attending Subproject meetings and
contributing to the Subproject’s work.
-->
**Kirsten Garrison (KG)**：我是 SIG-Architecture 的 Enhancements 子項目的負責人，目前就職於 Google。
我最初在 [Carolyn Van Slyck](https://github.com/carolynvs) 的幫助下，爲 service-catalog 項目貢獻代碼，
後來[加入了 Release 團隊](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.17/release_team.md)，
最終成爲 Enhancements Lead 和 Release Lead 影子。
在發佈團隊工作期間，我根據團隊的經驗爲 SIG 和 Enhancements 團隊提出了一些改進流程的想法（如參與其中的流程）。
之後，我開始參加子項目會議，併爲這個子項目的工作做貢獻。

<!--
**FSM: You mentioned the Enhancements subproject: how would you describe its main goals and areas of
intervention?**

**KG**: The [Enhancements
Subproject](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#enhancements)
primarily concerns itself with the [Kubernetes Enhancement
Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/0000-kep-process/README.md)
(_KEP_ for short)—the "design" documents required for all features and significant changes
to the Kubernetes project.
-->
**FSM：你提到了 Enhancements 子項目，你如何描述它的主要目標和干預範圍？**

**KG**：[Enhancements 子項目](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#enhancements)的核心是管理
[Kubernetes 增強提案（KEP）](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/0000-kep-process/README.md)，
這是 Kubernetes 項目所有特性和重大變更的“設計”文檔。

<!--
## The KEP and its impact

**FSM: The improvement of the KEP process was (and is) one in which SIG Architecture was heavily
involved. Could you explain the process to those that aren’t aware of it?**
-->
## KEP 及其影響    {#the-kep-and-its-impact}

**FSM：KEP 流程的改進一直是 SIG Architecture 深度參與的工作之一。你能爲不瞭解的人介紹一下這個流程嗎？**

<!--
**KG**: [Every release](https://kubernetes.io/releases/release/#the-release-cycle), the SIGs let the
Release Team know which features they intend to work on to be put into the release. As mentioned
above, the prerequisite for these changes is a KEP - a standardized design document that all authors
must fill out and approve in the first weeks of the release cycle. Most features [will move
through 3
phases](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/#feature-stages):
alpha, beta and finally GA so approving a feature represents a significant commitment for the SIG.
-->
**KG**：在[每次發佈版本](/zh-cn/releases/release/#the-release-cycle)時，各個
SIG 需要告知 Release Team 各自計劃將哪些特性放到當前的版本發佈中。
正如前面提到的，所有變更的前提是有一個 KEP，這是一種標準化的設計文檔，
所有 KEP 的作者必須在發佈週期的最初幾周內填寫完並獲得批准。
大多數特性[會經歷三個階段](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)：
Alpha、Beta，最終進入 GA，因此批准一個特性對 SIG 來說是一項重大承諾。

<!--
The KEP serves as the full source of truth of a feature. The [KEP
template](https://github.com/kubernetes/enhancements/blob/master/keps/NNNN-kep-template/README.md)
has different requirements based on what stage a feature is in, but it generally requires a detailed
discussion of the design and the impact as well as providing artifacts of stability and
performance. The KEP takes quite a bit of iterative work between authors, SIG reviewers, api review
team and the Production Readiness Review team[^1] before it is approved. Each set of reviewers is
looking to make sure that the proposal meets their standards in order to have a stable and
performant Kubernetes release. Only after all approvals are secured, can an author go forth and
merge their feature in the Kubernetes code base.
-->
KEP 作爲某個特性真實、完整的資訊來源。
[KEP 模板](https://github.com/kubernetes/enhancements/blob/master/keps/NNNN-kep-template/README.md)
對處於不同階段的特性具有不同的要求，但通常需要詳細討論其設計、影響，並提供穩定性和性能的證明材料。
KEP 通常會在作者、SIG 審查人員、API 審查團隊和 Production Readiness Review 團隊[^1]之間進行多輪迭代後才能獲批。
每組審查者都會確保提案符合其標準，以保證 Kubernetes 版本的穩定性和性能。
只有在所有審批完成後，作者才能將其特性合併到 Kubernetes 代碼庫。

<!--
**FSM: I see, quite a bit of additional structure was added. Looking back, what were the most
significant improvements of that approach?**

**KG**: In general, I think that the improvements with the most impact had to do with focusing on
the core intent of the KEP. KEPs exist not just to memorialize designs, but provide a structured way
to discuss and come to an agreement about different facets of the change. At the core of the KEP
process is communication and consideration.
-->
**FSM：我懂了，新增了一些結構。回顧來看，你認爲這種流程方法最重要的改進是什麼？**

**KG**：總體而言，我認爲最有影響力的改進在於聚焦 KEP 的核心意圖。
KEP 不僅僅是設計的存檔檔案，更是提供了一種結構化的方式來討論和達成共識。
KEP 流程的核心是溝通和審慎考慮。

<!--
To that end, some of the significant changes revolve around a more detailed and accessible KEP
template. A significant amount of work was put in over time to get the
[k/enhancements](https://github.com/kubernetes/enhancements) repo into its current form -- a
directory structure organized by SIG with the contours of the modern KEP template (with
Proposal/Motivation/Design Details subsections). We might take that basic structure for granted
today, but it really represents the work of many people trying to get the foundation of this process
in place over time.
-->
爲此，一些重要的改進圍繞着更詳細且更易於訪問的 KEP 模板展開。
我們投入了大量時間，使 [k/enhancements](https://github.com/kubernetes/enhancements)
倉庫發展成當前的形式：目錄結構按 SIG 小組劃分，附帶現代 KEP 模板檔案，
其中包含 Proposal/Motivation/Design Details（提案/動機/設計細節）等小節。
我們今天可能認爲這種基本結構是理所當然的，但它實際上代表付出了許多人力和時間努力工作才奠定了這一流程基礎。

<!--
As Kubernetes matures, we’ve needed to think about more than just the end goal of getting a single
feature merged. We need to think about things like: stability, performance, setting and meeting user
expectations. And as we’ve thought about those things the template has grown more detailed. The
addition of the Production Readiness Review was major as well as the enhanced testing requirements
(varying at different stages of a KEP’s lifecycle).
-->
隨着 Kubernetes 的發展和成熟，我們需要考慮的不僅僅是如何合併單個特性，還需要關注穩定性、性能、設置和使用者期望等問題。
因此隨着我們的思考深入，KEP 模板變得更詳細。例如增加了 Production Readiness Review 機制，同時對測試要求進行了強化
（這些要求會隨着 KEP 生命週期的不同階段動態調整）。

<!--
## Current areas of focus

**FSM: Speaking of maturing, we’ve [recently released Kubernetes
v1.31](https://kubernetes.io/blog/2024/08/13/kubernetes-v1-31-release/), and work on v1.32 [has
started](https://github.com/fsmunoz/sig-release/tree/release-1.32/releases/release-1.32). Are there
any areas that the Enhancements sub-project is currently addressing that might change the way things
are done?**
-->
## 當前關注領域   {#current-areas-of-focus}

**FSM：說到發展，我們[最近發佈了 Kubernetes v1.31](/zh-cn/blog/2024/08/13/kubernetes-v1-31-release/)，
而 v1.32 版本的開發工作[已經開始](https://github.com/fsmunoz/sig-release/tree/release-1.32/releases/release-1.32)。
Enhancements 子項目目前有哪些領域正在推進以改進這個流程？**

<!--
**KG**: We’re currently working on two things:

  1) _Creating a Process KEP template._ Sometimes people want to harness the KEP process for
  significant changes that are more process oriented rather than feature oriented. We want to
  support this because memorializing changes is important and giving people a better tool to do so
  will only encourage more discussion and transparency.
  2) _KEP versioning._ While our template changes aim to be as non-disruptive as possible, we
  believe that it will be easier to track and communicate those changes to the community better with
  a versioned KEP template and the policies that go alongside such versioning.
-->
**KG**：我們目前正在進行兩項工作：

1. **創建一個 Process KEP 模板**。有時，人們希望使用 KEP 流程來記錄重要的流程變更，而不是特性變更。
   我們希望支持這一點，因爲記錄變更很重要，爲此提供更好的工具將鼓勵更多的討論和更透明。
2. **KEP 版本化**。雖然我們的模板變更旨在儘量減少破壞性影響，但我們認爲引入 KEP 版本化及相應的策略，
   可以讓變更更易於追蹤並更好地與社區溝通。

<!--
Both features will take some time to get right and fully roll out (just like a KEP feature) but we
believe that they will both provide improvements that will benefit the community at large.

**FSM: You mentioned improvements: I remember when project boards for Enhancement tracking were
introduced in recent releases, to great effect and unanimous applause from release team members. Was
this a particular area of focus for the subproject?**
-->
這兩項改進都需要時間來完善和推廣（就像 KEP 特性本身一樣），但我們相信它們最終會給社區帶來很大的好處。

**FSM：你提到了改進：我記得最近的發佈引入了用於 Enhancement 追蹤的項目看板（Project Board），
發佈團隊成員對此表示一致好評。這是 Enhancements 子項目的一個重點方向嗎？**

<!--
**KG**: The Subproject provided support to the Release Team’s Enhancement team in the migration away
from using the spreadsheet to a project board. The collection and tracking of enhancements has
always been a logistical challenge. During my time on the Release Team, I helped with the transition
to an opt-in system of enhancements, whereby the SIG leads "opt-in" KEPs for release tracking. This
helped to enhance communication between authors and SIGs before any significant work was undertaken
on a KEP and removed toil from the Enhancements team. This change used the existing tools to avoid
introducing too many changes at once to the community. Later, the Release Team approached the
Subproject with an idea of leveraging GitHub Project Boards to further improve the collection
process. This was to be a move away from the use of complicated spreadsheets to using repo-native
labels on [k/enhancement](https://github.com/kubernetes/enhancements) issues and project boards.
-->
**KG**：Enhancements 子項目爲 Release Team 的 Enhancement 團隊提供支持，從使用電子表格遷移到一個項目看板。
增強提案的收集和跟蹤一直是後勤支持的一項挑戰。在我擔任 Release Team 成員期間，我幫助推動了增強的“選擇加入”機制，
即 SIG 負責人需要主動“選擇加入” KEP 進行發佈追蹤。
這有助於在對 KEP 實施重大工作之前，加強作者與 SIG 之間的溝通，並減少 Enhancements 團隊的重複工作。
這一變更利用了現有工具，以避免一次性向社區引入過多變化。
後來，Release Team 向子項目提出了利用 GitHub 項目看板進一步改進收集流程的想法。
這一舉措旨在從使用複雜的電子表格轉爲使用 [k/enhancement](https://github.com/kubernetes/enhancements)
Issues 和項目看板上的原生倉庫標籤。

<!--
**FSM: That surely adds an impact on simplifying the workflow...**

**KG**: Removing sources of friction and promoting clear communication is very important to the
Enhancements Subproject.  At the same time, it’s important to give careful consideration to
decisions that impact the community as a whole. We want to make sure that changes are balanced to
give an upside and while not causing any regressions and pain in the rollout. We supported the
Release Team in ideation as well as through the actual migration to the project boards. It was a
great success and exciting to see the team make high impact changes that helped everyone involved in
the KEP process!
-->
**FSM：這無疑簡化了工作流程...**

**KG**：減少摩擦來源、促進清晰溝通對 Enhancements 子項目至關重要。同時，我們也需要謹慎考慮影響整個社區的決策。
我們希望確保變更既帶來好處，又不會在推廣過程中造成迴歸或額外負擔。
我們支持 Release Team 進行頭腦風暴，並協助完成遷移到項目看板的工作。
這次變更取得了巨大成功，很高興看到團隊做出了高影響力的改進，使所有參與 KEP 流程的每個人受益！

<!--
## Getting involved

**FSM: For those reading that might be curious and interested in helping, how would you describe the
required skills for participating in the sub-project?**

**KG**: Familiarity with KEPs either via experience or taking time to look through the
kubernetes/enhancements repo is helpful. All are welcome to participate if interested - we can take
it from there.
-->
## 如何參與   {#getting-involved}

**FSM：如果有人想要參與 Enhancements 子項目，你認爲需要具備哪些技能？**

**KG**：熟悉 KEP 機制，無論是通過體驗，還是花時間閱讀
[kubernetes/enhancements](https://github.com/kubernetes/enhancements) 倉庫都會有所幫助。
我們歡迎所有感興趣的人蔘與，我們可以一步步引導他們。

<!--
**FSM: Excellent! Many thanks for your time and insight -- any final comments you would like to
share with our readers?**

**KG**: The Enhancements process is one of the most important parts of Kubernetes and requires
enormous amounts of coordination and collaboration of people and teams across the project to make it
successful. I’m thankful and inspired by everyone’s continued hard work and dedication to making the
project great. This is truly a wonderful community.
-->
**FSM：太棒了！非常感謝你的時間和分享——最後你有什麼想對讀者們說的嗎？**

**KG**：Enhancements 流程是 Kubernetes 生態中最重要組成部分之一，需要各個團隊的密切協作才能成功。
我很感激並敬佩大家持續不斷的努力工作和奉獻，讓這個項目越來越好。這真是一個很棒的社區。

<!--
[^1]: For more information, check the [Production Readiness Review spotlight
    interview](https://kubernetes.io/blog/2023/11/02/sig-architecture-production-readiness-spotlight-2023/)
    in this series.
-->
[^1]: 更多資訊參考 [Production Readiness Review 專題採訪](/blog/2023/11/02/sig-architecture-production-readiness-spotlight-2023/)。
