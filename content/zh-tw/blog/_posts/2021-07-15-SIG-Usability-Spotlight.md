---
layout: blog
title: "聚焦 SIG Usability"
date: 2021-07-15
slug: sig-usability-spotlight-2021
author: >
  Kunal Kushwaha (Civo)
---
<!--
layout: blog
title: "Spotlight on SIG Usability"
date: 2021-07-15
slug: sig-usability-spotlight-2021
author: >
  Kunal Kushwaha (Civo)
-->

{{< note >}}
<!--
SIG Usability, which is featured in this Spotlight blog, has been deprecated and is no longer active.
As a result, the links and information provided in this blog post may no longer be valid or relevant.
Should there be renewed interest and increased participation in the future, the SIG may be revived.
However, as of August 2023 the SIG is inactive per the Kubernetes community policy.
The Kubernetes project encourages you to explore other
[SIGs](https://github.com/kubernetes/community/blob/master/sig-list.md#special-interest-groups)
and resources available on the Kubernetes website to stay up-to-date with the latest developments
and enhancements in Kubernetes.
-->
本篇聚焦博客提到的 SIG Usability 已被棄用並且不再活躍。因此，
本文中提供的鏈接和資訊可能已失效或不再適用。
如果未來社區對該小組重新產生興趣並有更多成員參與，
它有可能會被重新啓用。但根據 Kubernetes 社區的政策，
截至 2023 年 8 月，該 SIG 已處於非活躍狀態。
Kubernetes 項目鼓勵你去探索其他
[SIG](https://github.com/kubernetes/community/blob/master/sig-list.md#special-interest-groups)
以及 Kubernetes 官網提供的各類資源，以便及時瞭解 Kubernetes
的最新進展和功能增強。
{{< /note >}}


<!--
## Introduction
-->
## 介紹

<!--
Are you interested in learning about what [SIG Usability](https://github.com/kubernetes/community/tree/master/sig-usability) does 
and how you can get involved? Well, you're at the right place.
SIG Usability is all about making Kubernetes more accessible to new folks, and its main activity is conducting user research for the community.
In this blog, we have summarized our conversation with [Gaby Moreno](https://twitter.com/morengab),
who walks us through the various aspects of being a part of the SIG and shares some insights about how others can get involved.
-->
你是否有興趣瞭解 [SIG Usability](https://github.com/kubernetes/community/tree/master/sig-usability) 做什麼？
你是否想知道如何參與？那你來對地方了。
SIG Usability 旨在讓 Kubernetes 更易於觸達新的夥伴，其主要活動是針對社區實施使用者調研。
在本博客中，我們總結了與 Gaby Moreno 的對話，
他向我們介紹了成爲 SIG 成員的各個方面，並分享了一些關於其他人如何參與的見解。

<!--
Gaby is a co-lead for SIG Usability.
She works as a Product Designer at IBM and enjoys working on the user experience of open, 
hybrid cloud technologies like Kubernetes, OpenShift, Terraform, and Cloud Foundry.
-->
Gaby 是 SIG Usability 的聯合負責人。
她在 IBM 擔任產品設計師，
喜歡研究 Kubernetes、OpenShift、Terraform 和 Cloud Foundry 等開放式混合雲技術的使用者體驗。

<!--
## A summary of our conversation
-->
## 我們談話的摘要

<!--
### Q. Could you tell us a little about what SIG Usability does?
-->
### 問：你能告訴我們一些關於 SIG Usability 的事情嗎？

<!--
A. SIG Usability at a high level started because there was no dedicated user experience team for Kubernetes. 
The extent of SIG Usability is focussed on the end-client ease of use of the Kubernetes project. 
The main activity is user research for the community, which includes speaking to Kubernetes users.
-->
答：簡單而言，啓動 SIG Usability 的原因是那時 Kubernetes 沒有專門的使用者體驗團隊。
SIG Usability 的關注領域集中在爲 Kubernetes 項目最終客戶提供的易用性上。
主要活動是社區的使用者調研，包括對 Kubernetes 使用者宣講。

<!--
This covers points like user experience and accessibility. 
The objectives of the SIG are to guarantee that the Kubernetes project is maximally usable by people of a wide range of foundations and capacities,
such as incorporating internationalization and ensuring the openness of documentation.
-->
所涉及的包括使用者體驗和可訪問性等方面。
SIG 的目標是確保 Kubernetes 項目能夠最大限度地被具有各類不同基礎和能力的人使用，
例如引入文檔的國際化並確保其開放性。

<!--
### Q. Why should new and existing contributors consider joining SIG Usability?
-->
### 問：爲什麼新的和現有的貢獻者應該考慮加入 SIG Usability？

<!--
A. There are plenty of territories where new contributors can begin. For example:
-->
答：新的貢獻者可以在很多領域着手。例如：
<!--
- User research projects, where people can help understand the usability of the end-user experiences, including error messages, end-to-end tasks, etc.
-->
- 使用者研究項目可以讓人們幫助瞭解最終使用者體驗的可用性，包括錯誤消息、端到端任務等。
<!--
- Accessibility guidelines for Kubernetes community artifacts, examples include: 
internationalization of documentation, color choices for people with color blindness, ensuring compatibility with screen reader technology,
 user interface design for core components with user interfaces, and more.
-->
- Kubernetes 社區組件的可訪問性指南，包括：文檔的國際化、色盲人羣的顏色選擇、
  確保與屏幕閱讀器技術的兼容性、核心 UI 組件的使用者界面設計等等。

<!--
### Q. What do you do to help new contributors get started?
-->
### 問：如何幫助新的貢獻者入門？

<!--
A. New contributors can get started by shadowing one of the user interviews, going through user interview transcripts, analyzing them, and designing surveys.
-->
答：新的貢獻者們剛開始可以旁觀參與其中一個使用者訪談，瀏覽使用者訪談記錄，分析這些記錄並設計調查過程。

<!--
SIG Usability is also open to new project ideas. 
If you have an idea, we’ll do what we can to support it. 
There are regular SIG Meetings where people can ask their questions live. 
These meetings are also recorded for those who may not be able to attend.
 As always, you can reach out to us on Slack as well.
-->
SIG Usability 也對新的項目想法持開放態度。
如果你有想法，我們將盡我們所能支持它。
我們有定期的 SIG 會議，人們可以現場提問。
這些會議也會錄製會議影片，方便那些可能無法參會的人。
與往常一樣，你也可以在 Slack 上與我們聯繫。

<!--
### Q. What does the survey include?
-->
### 問：調查包括什麼？

<!--
A. In simple terms, the survey gathers information about how people use Kubernetes, 
such as trends in learning to deploy a new system, error messages they receive, and workflows.
-->
答：簡單來說，調查會收集人們如何使用 Kubernetes 的資訊，
例如學習部署新系統的趨勢、他們收到的錯誤消息和工作流程。

<!--
One of our goals is to standardize the responses accordingly.
The ultimate goal is to analyze survey responses for important user stories whose needs aren't being met.
-->
我們的目標之一是根據需要對反饋進行標準化。
最終目標是分析那些需求沒有得到滿足的重要使用者故事的調查反饋。

<!--
### Q. Are there any particular skills you’d like to recruit for? What skills are contributors to SIG Usability likely to learn?
-->
### 問：招募貢獻者時你希望他們具備什麼特別的技能嗎？SIG Usability 的貢獻者可能要學習哪些技能？

<!--
A. Although contributing to SIG Usability does not have any pre-requisites as such, 
experience with user research, qualitative research, or prior experience with how to conduct an interview would be great plus points. 
Quantitative research, like survey design and screening, is also helpful and something that we expect contributors to learn.
-->
答：雖然爲 SIG Usability 做貢獻沒有任何先決條件，
但使用者研究、定性研究的經驗或之前如何進行訪談的經驗將是很好的加分項。
定量研究，如調查設計和篩選，也很有幫助，也是我們希望貢獻者學習的東西。

<!--
### Q. What are you getting positive feedback on, and what’s coming up next for SIG Usability?
-->
### 問：您在哪些方面獲得了積極的反饋，以及 SIG Usability 接下來會發生什麼？

<!--
A. We have had new members joining and coming to monthly meetings regularly and showing interests in becoming a contributor and helping the community. 
We have also had a lot of people reach out to us via Slack showcasing their interest in the SIG.
-->
答：我們一直有新成員加入並經常參加月度會議，並表現出對成爲貢獻者和幫助社區的興趣。
我們也有很多人通過 Slack 與我們聯繫，表達他們對 SIG 的興趣。

<!--
Currently, we are focused on finishing the study mentioned in our [talk](https://www.youtube.com/watch?v=Byn0N_ZstE0), 
also our project for this year. We are always happy to have new contributors join us.
-->
目前，我們正專注於完成我們[演講](https://www.youtube.com/watch?v=Byn0N_ZstE0)中提到的調研，
也是我們今年的項目。我們總是很高興有新的貢獻者加入我們。

<!--
### Q: Any closing thoughts/resources you’d like to share?
-->
### 問：在結束之前，你還有什麼想法/資源要分享嗎？

<!--
A. We love meeting new contributors and assisting them in investigating different Kubernetes project spaces. 
We will work with and team up with other SIGs to facilitate engaging with end-users, running studies, 
and help them integrate accessible design practices into their development practices.
-->
答：我們喜歡結識新的貢獻者並幫助他們研究不同的 Kubernetes 項目領域。
我們將與其他 SIG 合作，以促進與最終使用者的互動，開展調研，並幫助他們將可訪問的設計實踐整合到他們的開發實踐中。

<!--
Here are some resources for you to get started:
- [GitHub](https://github.com/kubernetes/community/tree/master/sig-usability)
- [Mailing list](https://groups.google.com/g/kubernetes-sig-usability)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fusability)
- [Slack](https://slack.k8s.io/)
- [Slack channel #sig-usability](https://kubernetes.slack.com/archives/CLC5EF63T)
-->
這裏有一些資源供你入門：
- [GitHub](https://github.com/kubernetes/community/tree/master/sig-usability)
- [郵件列表](https://groups.google.com/g/kubernetes-sig-usability)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fusability)
- [Slack](https://slack.k8s.io/)
- [Slack 頻道 #sig-usability](https://kubernetes.slack.com/archives/CLC5EF63T)

<!--
## Wrap Up
-->
## 總結

<!--
SIG Usability hosted a [KubeCon talk](https://www.youtube.com/watch?v=Byn0N_ZstE0) about studying Kubernetes users' experiences. 
The talk focuses on updates to the user study projects, understanding who is using Kubernetes, 
what they are trying to achieve, how the project is addressing their needs, and where we need to improve the project and the client experience. 
Join the SIG's update to find out about the most recent research results, 
what the plans are for the forthcoming year, and how to get involved in the upstream usability team as a contributor!
-->
SIG Usability 舉辦了一個關於調研 Kubernetes 使用者體驗的 [KubeCon 演講](https://www.youtube.com/watch?v=Byn0N_ZstE0)。
演講的重點是使用者調研項目的更新，瞭解誰在使用 Kubernetes、他們試圖實現什麼、項目如何滿足他們的需求、以及我們需要改進項目和客戶體驗的地方。
歡迎加入 SIG 的更新，瞭解最新的調研成果、來年的計劃以及如何作爲貢獻者參與上游可用性團隊！
