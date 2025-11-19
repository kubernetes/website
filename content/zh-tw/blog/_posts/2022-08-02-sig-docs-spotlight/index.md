---
layout: blog
title: "聚光燈下的 SIG Docs"
date: 2022-08-02
slug: sig-docs-spotlight-2022
---
<!--
layout: blog
title: "Spotlight on SIG Docs"
date: 2022-08-02
slug: sig-docs-spotlight-2022
canonicalUrl: https://kubernetes.dev/blog/2022/08/02/sig-docs-spotlight-2022/
-->

<!--
**Author:** Purneswar Prasad
-->
**作者：** Purneswar Prasad

<!--
## Introduction

The official documentation is the go-to source for any open source project. For Kubernetes, 
it's an ever-evolving Special Interest Group (SIG) with people constantly putting in their efforts
to make details about the project easier to consume for new contributors and users. SIG Docs publishes 
the official documentation on [kubernetes.io](https://kubernetes.io) which includes, 
but is not limited to, documentation of the core APIs, core architectural details, and CLI tools 
shipped with the Kubernetes release.

To learn more about the work of SIG Docs and its future ahead in shaping the community, I have summarised 
my conversation with the co-chairs, [Divya Mohan](https://twitter.com/Divya_Mohan02) (DM), 
[Rey Lejano](https://twitter.com/reylejano) (RL) and Natali Vlatko (NV), who ran through the
SIG's goals and how fellow contributors can help.
-->
## 簡介

官方文檔是所有開源項目的首選資料源。對於 Kubernetes，它是一個持續演進的特別興趣小組 (SIG)，
人們持續不斷努力製作詳實的項目資料，讓新貢獻者和用戶更容易取用這些文檔。
SIG Docs 在 [kubernetes.io](https://kubernetes.io) 上發佈官方文檔，
包括但不限於 Kubernetes 版本發佈時附帶的核心 API 文檔、核心架構細節和 CLI 工具文檔。

爲了瞭解 SIG Docs 的工作及其在塑造社區未來方面的更多信息，我總結了自己與聯合主席
[Divya Mohan](https://twitter.com/Divya_Mohan02)（下稱 DM）、
[Rey Lejano](https://twitter.com/reylejano)（下稱 RL）和 Natali Vlatko（下稱 NV）的談話，
他們講述了 SIG 的目標以及其他貢獻者們如何從旁協助。

<!--
## A summary of the conversation

### Could you tell us a little bit about what SIG Docs does?

SIG Docs is the special interest group for documentation for the Kubernetes project on kubernetes.io, 
generating reference guides for the Kubernetes API, kubeadm and kubectl as well as maintaining the official 
website’s infrastructure and analytics. The remit of their work also extends to docs releases, translation of docs, 
improvement and adding new features to existing documentation, pushing and reviewing content for the official 
Kubernetes blog and engaging with the Release Team for each cycle to get docs and blogs reviewed.
-->
## 談話彙總

### 你能告訴我們 SIG Docs 具體做什麼嗎？

SIG Docs 是 kubernetes.io 上針對 Kubernetes 項目文檔的特別興趣小組，
爲 Kubernetes API、kubeadm 和 kubectl 製作參考指南，並維護官方網站的基礎設施和數據分析。
他們的工作範圍還包括文檔發佈、文檔翻譯、改進並向現有文檔添加新功能特性、推送和審查官方 Kubernetes 博客的內容，
並在每個發佈週期與發佈團隊合作以審查文檔和博客。

<!--
### There are 2 subprojects under Docs: blogs and localization. How has the community benefited from it and are there some interesting contributions by those teams you want to highlight?

**Blogs**: This subproject highlights new or graduated Kubernetes enhancements, community reports, SIG updates 
or any relevant news to the Kubernetes community such as thought leadership, tutorials and project updates, 
such as the Dockershim removal and removal of PodSecurityPolicy, which is upcoming in the 1.25 release.
Tim Bannister, one of the SIG Docs tech leads, does awesome work and is a major force when pushing contributions 
through to the docs and blogs.
-->
### Docs 下有 2 個子項目：博客和本地化。社區如何從中受益？你想強調的這些團隊是否側重於某些貢獻？

**博客**：這個子項目側重於介紹新的或畢業的 Kubernetes 增強特性、社區報告、SIG 更新或任何與 Kubernetes
社區相關的新聞，例如思潮引領、教程和項目更新，例如即將在 1.25 版本中移除 Dockershim 和 PodSecurityPolicy。
Tim Bannister 是 SIG Docs 技術負責人之一，他做得工作非常出色，是推動文檔和博客貢獻的主力人物。

<!--
**Localization**: With this subproject, the Kubernetes community has been able to achieve greater inclusivity 
and diversity among both users and contributors. This has also helped the project gain more contributors, 
especially students, since a couple of years ago.
One of the major highlights and up-and-coming localizations are Hindi and Bengali. The efforts for Hindi 
localization are currently being spearheaded by students in India.

In addition to that, there are two other subprojects: [reference-docs](https://github.com/kubernetes-sigs/reference-docs) and the [website](https://github.com/kubernetes/website), which is built with Hugo and is an important ownership area.
-->
**本地化**：通過這個子項目，Kubernetes 社區能夠在用戶和貢獻者之間實現更大的包容性和多樣性。
自幾年前以來，這也幫助該項目獲得了更多的貢獻者，尤其是學生們。
主要亮點之一是即將到來的本地化版本：印地語和孟加拉語。印地語的本地化工作目前由印度的學生們牽頭。

除此之外，還有另外兩個子項目：[reference-docs](https://github.com/kubernetes-sigs/reference-docs) 和
[website](https://github.com/kubernetes/website)，後者採用 Hugo 構建，是 Kubernetes 擁有的一個重要陣地。

<!--
### Recently there has been a lot of buzz around the Kubernetes ecosystem as well as the industry regarding the removal of dockershim in the latest 1.24 release. How has SIG Docs helped the project to ensure a smooth change among the end-users? {#dockershim-removal}
-->
### 最近有很多關於 Kubernetes 生態系統以及業界對最新 1.24 版本中移除 Dockershim 的討論。SIG Docs 如何幫助該項目確保最終用戶們平滑變更？ {#dockershim-removal}

<!--
Documenting the removal of Dockershim was a mammoth task, requiring the revamping of existing documentation 
and communicating to the various stakeholders regarding the deprecation efforts. It needed a community effort, 
so ahead of the 1.24 release, SIG Docs partnered with Docs and Comms verticals, the Release Lead from the 
Release Team, and also the CNCF to help put the word out. Weekly meetings and a GitHub project board were 
set up to track progress, review issues and approve PRs and keep the Kubernetes website updated. This has 
also helped new contributors know about the depreciation, so that if any good-first-issue pops up, they could chip in. 
A dedicated Slack channel was used to communicate meeting updates, invite feedback or to solicit help on 
outstanding issues and PRs. The weekly meeting also continued for a month after the 1.24 release to review related issues and fix them.
A huge shoutout to [Celeste Horgan](https://twitter.com/celeste_horgan), who kept the ball rolling on this 
conversation throughout the deprecation process.
-->
與 Dockershim 移除有關的文檔工作是一項艱鉅的任務，需要修改現有文檔並就棄用工作與各種利益相關方進行溝通。
這需要社區的努力，因此在 1.24 版本發佈之前，SIG Docs 與 Docs and Comms 垂直行業、來自發布團隊的發佈負責人以及
CNCF 建立合作關係，幫助在全網宣傳。設立了每週例會和 GitHub 項目委員會，以跟蹤進度、審查問題和批准 PR，
並保持更新 Kubernetes 網站。這也有助於新的貢獻者們瞭解這次棄用，因此如果出現任何 good-first-issue，
新的貢獻者也可以參與進來。開通了專用的 Slack 頻道用於交流會議更新、邀請反饋或就懸而未決的問題和 PR 尋求幫助。
每週例會在 1.24 發佈後也持續了一個月，以審查並修複相關問題。
非常感謝 [Celeste Horgan](https://twitter.com/celeste_horgan)，與他的順暢交流貫穿了這個棄用過程的前前後後。

<!--
### Why should new and existing contributors consider joining this SIG?

Kubernetes is a vast project and can be intimidating at first for a lot of folks to find a place to start. 
Any open source project is defined by its quality of documentation and SIG Docs aims to be a welcoming, 
helpful place for new contributors to get onboard. One gets the perks of working with the project docs 
as well as learning by reading it. They can also bring their own, new perspective to create and improve 
the documentation. In the long run if they stick to SIG Docs, they can rise up the ladder to be maintainers. 
This will help make a big project like Kubernetes easier to parse and navigate.
-->
### 爲什麼新老貢獻者都應該考慮加入這個 SIG？

Kubernetes 是一個龐大的項目，起初可能會讓很多人難以找到切入點。
任何開源項目的優劣總能從文檔質量略窺一二，SIG Docs 的目標是建設一個歡迎新貢獻者加入並對其有幫助的地方。
希望所有人可以輕鬆參與該項目的文檔，並能從閱讀中受益。他們還可以帶來自己的新視角，以製作和改進文檔。
從長遠來看，如果他們堅持參與 SIG Docs，就可以拾階而上晉升成爲維護者。
這將有助於使 Kubernetes 這樣的大型項目更易於解析和導航。

<!--
### How do you help new contributors get started? Are there any prerequisites to join?

There are no such prerequisites to get started with contributing to Docs. But there is certainly a fantastic 
Contribution to Docs guide which is always kept as updated and relevant as possible and new contributors 
are urged to read it and keep it handy. Also, there are a lot of useful pins and bookmarks in the 
community Slack channel [#sig-docs](https://kubernetes.slack.com/archives/C1J0BPD2M). GitHub issues with 
the good-first-issue labels in the kubernetes/website repo is a great place to create your first PR.
Now, SIG Docs has a monthly New Contributor Meet and Greet on the first Tuesday of the month with the 
first occupant of the New Contributor Ambassador role, [Arsh Sharma](https://twitter.com/RinkiyaKeDad). 
This has helped in making a more accessible point of contact within the SIG for new contributors.
-->
### 你如何幫助新的貢獻者入門？加入有什麼前提條件嗎？

開始爲 Docs 做貢獻沒有這樣的前提條件。但肯定有一個很棒的對文檔做貢獻的指南，這個指南始終儘可能保持更新和貼合實際，
希望新手們多多閱讀並將其放在趁手的地方。此外，社區 Slack 頻道
[#sig-docs](https://kubernetes.slack.com/archives/C1J0BPD2M) 中有很多有用的便貼和書籤。
kubernetes/website 倉庫中帶有 good-first-issue 標籤的那些 GitHub 問題是創建你的第一個 PR 的好地方。
現在，SIG Docs 在每月的第一個星期二配合第一任 New Contributor Ambassador（新貢獻者大使）角色
[Arsh Sharma](https://twitter.com/RinkiyaKeDad) 召開月度 New Contributor Meet and Greet（新貢獻者見面會）。
這有助於在 SIG 內爲新的貢獻者建立一個更容易參與的聯絡形式。

<!--
### Any SIG related accomplishment that you’re really proud of?

**DM & RL** : The formalization of the localization subproject in the last few months has been a big win 
for SIG Docs, given all the great work put in by contributors from different countries. Earlier the 
localization efforts didn’t have any streamlined process and focus was given to provide a structure by 
drafting a KEP over the past couple of months for localization to be formalized as a subproject, which 
is planned to be pushed through by the end of third quarter.
-->
### 你是否有任何真正自豪的 SIG 相關成績？

**DM & RL** ：鑑於來自不同國家的貢獻者們做出的所有出色工作，
過去幾個月本地化子項目的正式推行對 SIG Docs 來說是一個巨大的勝利。
早些時候，本地化工作還沒有任何流水線的流程，過去幾個月的重點是通過起草一份 KEP 爲本地化正式成爲一個子項目提供一個框架，
這項工作計劃在第三個季度結束時完成。

<!--
**DM** : Another area where there has been a lot of success is the New Contributor Ambassador role, 
which has helped in making a more accessible point of contact for the onboarding of new contributors into the project.

**NV** : For each release cycle, SIG Docs have to review release docs and feature blogs highlighting 
release updates within a short window. This is always a big effort for the docs and blogs reviewers.
-->
**DM**：另一個取得很大成功的領域是 New Contributor Ambassador（新貢獻者大使）角色，
這個角色有助於爲新貢獻者參與項目提供更便捷的聯繫形式。

**NV**：對於每個發佈週期，SIG Docs 都必須在短時間內評審突出介紹發佈更新的發佈文檔和功能特性博客。
這對於文檔和博客審閱者來說，始終需要付出巨大的努力。

<!--
### Is there something exciting coming up for the future of SIG Docs that you want the community to know?

SIG Docs is now looking forward to establishing a roadmap, having a steady pipeline of folks being able 
to push improvements to the documentation and streamlining community involvement in triaging issues and 
reviewing PRs being filed. To build one such contributor and reviewership base, a mentorship program is 
being set up to help current contributors become reviewers. This definitely is a space to watch out for more!
-->
### 你是否有一些關於 SIG Docs 未來令人興奮的舉措想讓社區知道？

SIG Docs 現在期望設計一個路線圖，建立穩定的人員流轉機制以期推動對文檔的改進，
簡化社區參與 Issue 評判和已提交 PR 的評審工作。
爲了建立一個這樣由貢獻者和 Reviewer 組成的羣體，我們正在設立一項輔導計劃幫助當前的貢獻者們成爲 Reviewer。
這絕對是一項值得關注的舉措！

<!--
## Wrap Up

SIG Docs hosted a [deep dive talk](https://www.youtube.com/watch?v=GDfcBF5et3Q) 
during  on KubeCon + CloudNativeCon North America 2021, covering their awesome SIG. 
They are very welcoming and have been the starting ground into Kubernetes 
for a lot of new folks who want to contribute to the project. 
Join the [SIG's meetings](https://github.com/kubernetes/community/blob/master/sig-docs/README.md) to find out 
about the most recent research results, their plans for the forthcoming year, and how to get involved in the upstream Docs team as a contributor!
-->
## 結束語

SIG Docs 在 KubeCon + CloudNativeCon North America 2021
期間舉辦了一次[深度訪談](https://www.youtube.com/watch?v=GDfcBF5et3Q)，涵蓋了他們很棒的 SIG 主題。
他們非常歡迎想要爲 Kubernetes 項目做貢獻的新人，對這些新人而言 SIG Docs 已成爲加入 Kubernetes 的起跳板。
歡迎加入 [SIG 會議](https://github.com/kubernetes/community/blob/master/sig-docs/README.md)，
瞭解最新的研究成果、來年的計劃以及如何作爲貢獻者參與上游 Docs 團隊！
