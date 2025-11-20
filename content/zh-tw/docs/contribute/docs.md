---
content_type: concept
title: 爲 Kubernetes 文檔出一份力
weight: 09
card:
  name: contribute
  weight: 11
  title: 爲文檔做出貢獻
---

<!--
content_type: concept
title: Contribute to Kubernetes Documentation
weight: 09
card:
  name: contribute
  weight: 11
  title: Contribute to documentation
-->

<!--
This website is maintained by [Kubernetes SIG Docs](/docs/contribute/#get-involved-with-sig-docs).
The Kubernetes project welcomes help from all contributors, new or experienced!

Kubernetes documentation contributors:

- Improve existing content
- Create new content
- Translate the documentation
- Manage and publish the documentation parts of the Kubernetes release cycle

The blog team, part of SIG Docs, helps manage the official blogs. Read
[contributing to Kubernetes blogs](/docs/contribute/blog/) to learn more.
-->
本網站由 [Kubernetes SIG Docs](/zh-cn/docs/contribute/#get-involved-with-SIG-Docs)（文檔特別興趣小組）維護。
Kubernetes 項目歡迎所有貢獻者（無論是新手還是經驗豐富的貢獻者）提供幫助！

Kubernetes 文檔項目的貢獻者：

- 改進現有內容
- 創建新內容
- 翻譯文檔
- 管理併發布 Kubernetes 週期性發行版的文檔

博客團隊是 SIG Docs 的一部分，負責管理官方博客。
閱讀[參與 Kubernetes 博客貢獻](/zh-cn/docs/contribute/blog/)以瞭解更多資訊。
---

{{< note >}}
<!--
To learn more about contributing to Kubernetes in general, see the general
[contributor documentation](https://www.kubernetes.dev/docs/) site.
-->
要了解有關爲 Kubernetes 做出貢獻的更多資訊，
請參閱[貢獻者文檔](https://www.kubernetes.dev/docs/)。
{{< /note >}}

<!-- body -->

<!--
## Getting started

Anyone can open an issue about documentation, or contribute a change with a
pull request (PR) to the
[`kubernetes/website` GitHub repository](https://github.com/kubernetes/website).
You need to be comfortable with
[git](https://git-scm.com/) and
[GitHub](https://skills.github.com/)
to work effectively in the Kubernetes community.
-->
## 入門 {#getting-started}

任何人都可以提出文檔方面的問題（issue），或貢獻一個變更，用拉取請求（PR）的方式提交到
[GitHub 上的 `kubernetes/website` 倉庫](https://github.com/kubernetes/website)。
當然你需要熟練使用 [git](https://git-scm.com/) 和 [GitHub](https://lab.github.com/)
才能在 Kubernetes 社區中有效工作。

<!--
To get involved with documentation:

1. Sign the CNCF [Contributor License Agreement](https://github.com/kubernetes/community/blob/master/CLA.md).
2. Familiarize yourself with the [documentation repository](https://github.com/kubernetes/website)
   and the website's [static site generator](https://gohugo.io).
3. Make sure you understand the basic processes for
   [opening a pull request](/docs/contribute/new-content/open-a-pr/) and
   [reviewing changes](/docs/contribute/review/reviewing-prs/).
-->
如何參與文檔編制：

1. 簽署 CNCF 的[貢獻者許可協議](https://github.com/kubernetes/community/blob/master/CLA.md)。
2. 熟悉[文檔倉庫](https://github.com/kubernetes/website)和網站的[靜態站點生成器](https://gohugo.io)。
3. 確保理解[發起 PR](/zh-cn/docs/contribute/new-content/open-a-pr/)
   和[審查變更](/zh-cn/docs/contribute/review/reviewing-prs/)的基本流程。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart TB
subgraph third[發起 PR]
direction TB
U[ ] -.-
Q[改進現有內容] --- N[創建新內容]
N --- O[翻譯文檔]
O --- P[管理併發布 K8s<br>週期性發行版的文檔]

end

subgraph second[評審]
direction TB
   T[ ] -.-
   D[仔細查看<br>kubernetes/website<br>倉庫] --- E[下載安裝 Hugo<br>靜態站點<br>生成器]
   E --- F[瞭解基本的<br>GitHub 命令]
   F --- G[評審待處理的 PR<br>並遵從變更審查<br>流程]
end

subgraph first[註冊]
    direction TB
    S[ ] -.-
    B[簽署 CNCF<br>貢獻者<br>許可協議] --- C[加入 sig-docs<br>Slack 頻道] 
    C --- V[加入 kubernetes-sig-docs<br>郵件列表]
    V --- M[參加每週的<br>sig-docs 電話會議<br>或 slack 會議]
end

A([fa:fa-user 新的<br>貢獻者]) --> first
A --> second
A --> third
A --> H[提出問題!!!]


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H,M,Q,N,O,P,V grey
class S,T,U spacewhite
class first,second,third white
{{</ mermaid >}}

<!--
Figure 1. Getting started for a new contributor.

Figure 1 outlines a roadmap for new contributors. You can follow some or all of
the steps for `Sign up` and `Review`. Now you are ready to open PRs that achieve
your contribution objectives with some listed under `Open PR`. Again, questions
are always welcome!
-->
圖 1. 新手入門指示。

圖 1 概述了新貢獻者的路線圖。
你可以遵從“註冊”和“評審”所述的某些或全部步驟。
至此，你完成了發起 PR 的準備工作，
可以通過“發起 PR” 列出的事項實現你的貢獻目標。
再次重申，歡迎隨時提出問題！

<!-- 
Some tasks require more trust and more access in the Kubernetes organization.
See [Participating in SIG Docs](/docs/contribute/participate/) for more details about
roles and permissions.
-->
有些任務要求 Kubernetes 組織內更高的信任級別和訪問權限。
閱讀[參與 SIG Docs 工作](/zh-cn/docs/contribute/participate/)，獲取角色和權限的更多細節。

<!--
## Your first contribution

You can prepare for your first contribution by reviewing several steps beforehand.
Figure 2 outlines the steps and the details follow.
-->
## 第一次貢獻 {#your-first-contribution}

你可以提前查閱幾個步驟，來準備你的第一次貢獻。
圖 2 概述了後續的步驟和細節。

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[第一次貢獻]
    direction TB
    S[ ] -.-
    G[查閱其他 K8s<br>成員發起的 PR] -->
    A[檢索 kubernetes/website<br>問題列表是否有<br>good first 一類的 PR] --> B[發起一個 PR!!]
    end
    subgraph first[建議的準備工作]
    direction TB
       T[ ] -.-
       D[閱讀貢獻概述] -->E[閱讀 K8s 內容<br>和風格指南]
       E --> F[瞭解 Hugo 頁面<br>內容類型<br>和短代碼]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}

<!-- 
Figure 2. Preparation for your first contribution.
-->
圖 2. 第一次貢獻的準備工作。

<!--
- Read the [Contribution overview](/docs/contribute/new-content/) to
  learn about the different ways you can contribute.
- Check [`kubernetes/website` issues list](https://github.com/kubernetes/website/issues/)
  for issues that make good entry points.
- [Open a pull request using GitHub](/docs/contribute/new-content/open-a-pr/#changes-using-github)
  to existing documentation and learn more about filing issues in GitHub.
- [Review pull requests](/docs/contribute/review/reviewing-prs/) from other
  Kubernetes community members for accuracy and language.
- Read the Kubernetes [content](/docs/contribute/style/content-guide/) and
  [style guides](/docs/contribute/style/style-guide/) so you can leave informed comments.
- Learn about [page content types](/docs/contribute/style/page-content-types/)
  and [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/).
-->
- 通讀[貢獻概述](/zh-cn/docs/contribute/new-content/)，瞭解參與貢獻的不同方式。
- 查看 [`kubernetes/website` 問題列表](https://github.com/kubernetes/website/issues/)，
  檢索最適合作爲切入點的問題。
- 在現有文檔上，[使用 GitHub 提交 PR](/zh-cn/docs/contribute/new-content/open-a-pr/#changes-using-github)，
  掌握在 GitHub 上登記 Issue 的方法。
- Kubernetes 社區其他成員會[評審 PR](/zh-cn/docs/contribute/review/reviewing-prs/)，
  以確保文檔精準和語言流暢。
- 閱讀 kubernetes 的[內容指南](/zh-cn/docs/contribute/style/content-guide/)和
  [風格指南](/zh-cn/docs/contribute/style/style-guide/)，以發表有見地的評論。
- 瞭解[頁面內容類型](/zh-cn/docs/contribute/style/page-content-types/)和
  [Hugo 短代碼](/zh-cn/docs/contribute/style/hugo-shortcodes/)。

<!--
## Getting help when contributing

Making your first contribution can be overwhelming. The
[New Contributor Ambassadors](https://github.com/kubernetes/website#new-contributor-ambassadors)
are there to walk you through making your first few contributions. You can reach out to them in the
[Kubernetes Slack](https://slack.k8s.io/) preferably in the `#sig-docs` channel. There is also the
[New Contributors Meet and Greet call](https://www.kubernetes.dev/resources/calendar/)
that happens on the first Tuesday of every month. You can interact with the New Contributor Ambassadors
and get your queries resolved here.
-->
## 貢獻時獲取幫助

做出第一個貢獻可能會讓人感覺比較困難。
[新貢獻者大使](https://github.com/kubernetes/website#new-contributor-ambassadors)
將引導你完成最初的一些貢獻。你可以在 [Kubernetes Slack](https://slack.k8s.io/)
中聯繫他們，最好是在 `#sig-docs` 頻道中。還有每月第一個星期二舉行的
[新貢獻者見面會](https://www.kubernetes.dev/resources/calendar/)，
你可以在此處與新貢獻者大使互動並解決你的疑問。

<!--
## Next steps

- Learn to [work from a local clone](/docs/contribute/new-content/open-a-pr/#fork-the-repo)
  of the repository.
- Document [features in a release](/docs/contribute/new-content/new-features/).
- Participate in [SIG Docs](/docs/contribute/participate/), and become a
  [member or reviewer](/docs/contribute/participate/roles-and-responsibilities/).

- Start or help with a [localization](/docs/contribute/localization/).
-->
## 下一步 {#next-teps}

- 學習在倉庫的[本地克隆中工作](/zh-cn/docs/contribute/new-content/open-a-pr/#fork-the-repo)。
- 爲[發行版的特性](/zh-cn/docs/contribute/new-content/new-features/)編寫文檔。
- 加入 [SIG Docs](/zh-cn/docs/contribute/participate/)，
  併成爲[成員或評審者](/zh-cn/docs/contribute/participate/roles-and-responsibilities/)。
- 開始或幫助[本地化](/zh-cn/docs/contribute/localization/)工作。

<!-- 
## Get involved with SIG Docs

[SIG Docs](/docs/contribute/participate/) is the group of contributors who
publish and maintain Kubernetes documentation and the website. Getting
involved with SIG Docs is a great way for Kubernetes contributors (feature
development or otherwise) to have a large impact on the Kubernetes project.

SIG Docs communicates with different methods:
-->
## 參與 SIG Docs 工作 {#get-involved-with-SIG-Docs}

[SIG Docs](/zh-cn/docs/contribute/participate/) 是負責發佈、維護 Kubernetes 文檔的貢獻者團體。
參與 SIG Docs 是 Kubernetes 貢獻者（開發者和其他人員）對 Kubernetes 項目產生重大影響力的好方式。

SIG Docs 的幾種溝通方式：

<!--
- [Join `#sig-docs` on the Kubernetes Slack instance](https://slack.k8s.io/). Make sure to
  introduce yourself!
- [Join the `kubernetes-sig-docs` mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs),
  where broader discussions take place and official decisions are recorded.
- Join the [SIG Docs video meeting](https://github.com/kubernetes/community/tree/master/sig-docs)
  held every two weeks. Meetings are always announced on `#sig-docs` and added to the
  [Kubernetes community meetings calendar](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles).
  You'll need to download the [Zoom client](https://zoom.us/download) or dial in using a phone.
- Join the SIG Docs async Slack standup meeting on those weeks when the in-person Zoom
  video meeting does not take place. Meetings are always announced on `#sig-docs`.
  You can contribute to any one of the threads up to 24 hours after meeting announcement.
-->
- [加入 Kubernetes 在 Slack 上的 `#sig-docs` 頻道](https://slack.k8s.io/)。
  一定記得自我介紹!
- [加入 `kubernetes-sig-docs` 郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)，
  這裏有更廣泛的討論，和官方決策的記錄。
- 參加每兩週召開一次的 [SIG Docs 影片會議](https://github.com/kubernetes/community/tree/master/sig-docs)。
  會議總是在 `#sig-docs` 上發出公告，同時添加到
  [Kubernetes 社區會議日曆](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles)。
  你需要下載 [Zoom 客戶端軟體](https://zoom.us/download)，或電話撥號接入。
- 如果有幾周未召開實況 Zoom 影片會議，請參加 SIG Docs 異步 Slack 站會。
  會議總是在 `#sig-docs` 上發出公告。
  你可以在會議公告後 24 小時內爲其中任一議題做貢獻。

<!--
## Other ways to contribute

- Visit the [Kubernetes community site](/community/). Participate on Twitter or Stack Overflow,
  learn about local Kubernetes meetups and events, and more.
- Read the [contributor cheatsheet](https://www.kubernetes.dev/docs/contributor-cheatsheet/)
  to get involved with Kubernetes feature development.
- Visit the contributor site to learn more about [Kubernetes Contributors](https://www.kubernetes.dev/)
  and [additional contributor resources](https://www.kubernetes.dev/resources/).
- Learn how to [contribute to the official blogs](/docs/contribute/blog/)
- Submit a [case study](/docs/contribute/new-content/case-studies/)
-->
## 其他貢獻方式 {#other-ways-to-contribute}

- 訪問 [Kubernetes 社區網站](/zh-cn/community/)。
  參與 Twitter 或 Stack Overflow，瞭解當地的 Kubernetes 會議和活動等等。
- 閱讀[貢獻者備忘單](https://github.com/kubernetes/community/tree/master/contributors/guide/contributor-cheatsheet)，
  參與 Kubernetes 功能開發。
- 訪問貢獻者網站，進一步瞭解有關 [Kubernetes 貢獻者](https://www.kubernetes.dev/)
  和[更多貢獻者資源](https://www.kubernetes.dev/resources/)的資訊。
- 瞭解如何[參與官方博客的貢獻](/zh-cn/docs/contribute/blog/)
- 提交一份[案例研究](/zh-cn/docs/contribute/new-content/case-studies/)

