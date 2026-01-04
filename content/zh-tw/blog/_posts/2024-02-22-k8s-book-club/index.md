---
layout: blog
title: "走進 Kubernetes 讀書會（Book Club）"
slug: k8s-book-club
date: 2024-02-22
canonicalUrl: https://www.k8s.dev/blog/2024/02/22/k8s-book-club/
author: >
  Frederico Muñoz (SAS Institute)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "A look into the Kubernetes Book Club"
slug: k8s-book-club
date: 2024-02-22
canonicalUrl: https://www.k8s.dev/blog/2024/02/22/k8s-book-club/
author: >
  Frederico Muñoz (SAS Institute)
-->

<!--
Learning Kubernetes and the entire ecosystem of technologies around it is not without its
challenges. In this interview, we will talk with [Carlos Santana
(AWS)](https://www.linkedin.com/in/csantanapr/) to learn a bit more about how he created the
[Kubernetes Book Club](https://community.cncf.io/kubernetes-virtual-book-club/), how it works, and
how anyone can join in to take advantage of a community-based learning experience.
-->
學習 Kubernetes 及其整個生態的技術並非易事。在本次採訪中，我們的訪談對象是
[Carlos Santana (AWS)](https://www.linkedin.com/in/csantanapr/)，
瞭解他是如何創辦 [Kubernetes 讀書會（Book Club）](https://community.cncf.io/kubernetes-virtual-book-club/)的，
整個讀書會是如何運作的，以及大家如何加入其中，進而更好地利用社區學習體驗。

<!--
![Carlos Santana speaking at KubeCon NA 2023](csantana_k8s_book_club.jpg)

**Frederico Muñoz (FSM)**: Hello Carlos, thank you so much for your availability. To start with,
could you tell us a bit about yourself?
-->
![Carlos Santana 在 KubeCon NA 2023 上演講](csantana_k8s_book_club.jpg)

**Frederico Muñoz (FSM)**：你好 Carlos，非常感謝你能接受我們的採訪。首先，你能介紹一下自己嗎？

<!--
**Carlos Santana (CS)**: Of course. My experience in deploying Kubernetes in production six
years ago opened the door for me to join [Knative](https://knative.dev/) and then contribute to
Kubernetes through the Release Team. Working on upstream Kubernetes has been one of the best
experiences I've had in open-source. Over the past two years, in my role as a Senior Specialist
Solutions Architect at AWS, I have been assisting large enterprises build their internal developer
platforms (IDP) on top of Kubernetes. Going forward, my open source contributions are directed
towards [CNOE](https://cnoe.io/) and CNCF projects like [Argo](https://github.com/argoproj),
[Crossplane](https://www.crossplane.io/), and [Backstage](https://www.cncf.io/projects/backstage/).
-->
**Carlos Santana (CS)**：當然可以。六年前，我在生產環境中部署 Kubernetes 的經驗爲我加入
[Knative](https://knative.dev/) 並通過 Release Team 爲 Kubernetes 貢獻代碼打開了大門。
爲上游 Kubernetes 工作是我在開源領域最好的經歷之一。在過去的兩年裏，作爲 AWS 的高級專業解決方案架構師，
我一直在幫助大型企業在 Kubernetes 之上構建他們的內部開發平臺（IDP）。
未來我的開源貢獻將主要集中在 [CNOE](https://cnoe.io/) 和 CNCF 項目，如
[Argo](https://github.com/argoproj)、[Crossplane](https://www.crossplane.io/) 和
[Backstage](https://www.cncf.io/projects/backstage/)。

<!--
## Creating the Book Club

**FSM**: So your path led you to Kubernetes, and at that point what was the motivating factor for
starting the Book Club?
-->
## 創辦讀書會

**FSM**：所以你的職業道路把你引向了 Kubernetes，那麼是什麼動機促使你開始創辦讀書會呢？

<!--
**CS**: The idea for the Kubernetes Book Club sprang from a casual suggestion during a
[TGIK](https://github.com/vmware-archive/tgik) livestream. For me, it was more than just about
reading a book; it was about creating a learning community. This platform has not only been a source
of knowledge but also a support system, especially during the challenging times of the
pandemic. It's gratifying to see how this initiative has helped members cope and grow. The first
book [Production
Kubernetes](https://www.oreilly.com/library/view/production-kubernetes/9781492092292/) took 36
weeks, when we started on March 5th 2021. Currently don't take that long to cover a book, one or two
chapters per week.
-->
**CS**：Kubernetes 讀書會的想法源於一次 [TGIK](https://github.com/vmware-archive/tgik) 直播中的一個臨時建議。
對我來說，這不僅僅是讀一本書，更是創辦一個學習社區。這個社區平臺不僅是知識的來源，也是一個支持系統，
特別是在疫情期間陪我度過了艱難時刻。讀書會的這項倡議後來幫助許多成員學會了應對和成長，這讓我感到很欣慰。
我們在 2021 年 3 月 5 日開始第一本書
[Production Kubernetes](https://www.oreilly.com/library/view/production-kubernetes/9781492092292/)，
花了 36 周時間。目前，一本書不會再花那麼長時間了，如今每週會完成一到兩章。

<!--
**FSM**: Could you describe the way the Kubernetes Book Club works? How do you select the books and how
do you go through them?

**CS**: We collectively choose books based on the interests and needs of the group. This practical
approach helps members, especially beginners, grasp complex concepts more easily. We have two weekly
series, one for the EMEA timezone, and I organize the US one. Each organizer works with their co-host
and picks a book on Slack, then sets up a lineup of hosts for a couple of weeks to discuss each
chapter.
-->
**FSM**：你能介紹一下 Kubernetes 讀書會是如何運作的嗎？你們如何選書以及如何閱讀它們？

**CS**：我們根據小組的興趣和需求以集體的方式選書。這種實用的方法有助於成員們（特別是初學者）更容易地掌握複雜的概念。
我們每週有兩次讀書會應對不同的時區，一個針對 EMEA（歐洲、中東及非洲）時區，另一個是由我自己負責的美國時區。
每位組織者與他們的聯合主持人在 Slack 上甄選一本書，然後安排幾個主持人用幾周時間討論每一章。

<!--
**FSM**: If I’m not mistaken, the Kubernetes Book Club is in its 17th book, which is significant: is
there any secret recipe for keeping things active?

**CS**: The secret to keeping the club active and engaging lies in a couple of key factors.
-->
**FSM**：如果我沒記錯的話，Kubernetes 讀書會如今已經進行到了第 17 本書。這很了不起：有什麼祕訣可以讓讀書這件事保持活躍嗎？

**CS**：保持俱樂部活躍和吸引人蔘與的祕訣在於幾個關鍵因素。

<!--
Firstly, consistency has been crucial. We strive to maintain a regular schedule, only cancelling
meetups for major events like holidays or KubeCon. This regularity helps members stay engaged and
builds a reliable community.

Secondly, making the sessions interesting and interactive has been vital. For instance, I often
introduce pop-up quizzes during the meetups, which not only tests members' understanding but also
adds an element of fun. This approach keeps the content relatable and helps members understand how
theoretical concepts are applied in real-world scenarios.
-->
首先，一貫性至關重要。我們努力保持定期聚會，只有在重大事件如節假日或 KubeCon 時纔會取消聚會。
這種規律性有助於成員保持慣性參與，有助於建立一個可靠的社區。

其次，讓聚會有趣生動也非常重要。例如，我經常在聚會期間引入提問測驗，不僅檢測成員們的理解程度，還增加了一些樂趣。
這種方法使讀書內容更加貼近實際，並幫助成員們理解理論概念在現實世界中的運用方式。

<!--
## Topics covered in the Book Club

**FSM**: The main topics of the books have been Kubernetes, GitOps, Security, SRE, and
Observability: is this a reflection of the cloud native landscape, especially in terms of
popularity?
-->
## 讀書會涵蓋的話題

**FSM**：書籍的主要話題包括 Kubernetes、GitOps、安全、SRE 和可觀測性：
這是否也反映了雲原生領域的現狀，特別是在受歡迎程度方面？

<!--
**CS**: Our journey began with 'Production Kubernetes', setting the tone for our focus on practical,
production-ready solutions. Since then, we've delved into various aspects of the CNCF landscape,
aligning our books with a different theme.  Each theme, whether it be Security, Observability, or
Service Mesh, is chosen based on its relevance and demand within the community. For instance, in our
recent themes on Kubernetes Certifications, we brought the book authors into our fold as active
hosts, enriching our discussions with their expertise.
-->
**CS**：我們的旅程始於《Production Kubernetes》，爲我們專注於實用、生產就緒的解決方案定下了基調。
從那時起，我們深入探討了 CNCF 領域的各個方面，根據不同的主題去選書。
每個主題，無論是安全性、可觀測性還是服務網格，都是根據其相關性和社區需求來選擇的。
例如，在我們最近關於 Kubernetes 考試認證的主題中，我們邀請了書籍的作者作爲活躍現場的主持人，用他們的專業知識豐富了我們的討論。

<!--
**FSM**: I know that the project had recent changes, namely being integrated into the CNCF as a
[Cloud Native Community Group](https://community.cncf.io/). Could you talk a bit about this change?

**CS**: The CNCF graciously accepted the book club as a Cloud Native Community Group. This is a
significant development that has streamlined our operations and expanded our reach. This alignment
has been instrumental in enhancing our administrative capabilities, similar to those used by
Kubernetes Community Days (KCD) meetups. Now, we have a more robust structure for memberships, event
scheduling, mailing lists, hosting web conferences, and recording sessions.
-->
**FSM**：我瞭解到此項目最近有一些變化，即被整合到了 CNCF
作爲[雲原生社區組（Cloud Native Community Group）](https://community.cncf.io/)的一部分。你能談談這個變化嗎？

**CS**：CNCF 慷慨地接受了讀書會作爲雲原生社區組的一部分。
這是讀書會發展過程中的重要一步，優化了讀書會的運作並擴大了讀書會的影響力。
這種拉齊對於增強讀書會的管理能力至關重要，這點很像 Kubernetes Community Days (KCD) 聚會。
現在，讀書會有了更穩健的會員結構、活動安排、郵件列表、託管的網路會議和錄播系統。

<!--
**FSM**: How has your involvement with the CNCF impacted the growth and engagement of the Kubernetes
Book Club over the past six months?

**CS**: Since becoming part of the CNCF community six months ago, we've witnessed significant
quantitative changes within the Kubernetes Book Club. Our membership has surged to over 600 members,
and we've successfully organized and conducted more than 40 events during this period. What's even
more promising is the consistent turnout, with an average of 30 attendees per event. This growth and
engagement are clear indicators of the positive influence of our CNCF affiliation on the Kubernetes
Book Club's reach and impact in the community.
-->
**FSM**：在過去的六個月裏，你參與 CNCF 這件事對 Kubernetes 讀書會的成長和參與度產生了什麼影響？

**CS**：自從六個月前成爲 CNCF 社區的一部分以來，我們在 Kubernetes 讀書會中看到了一些顯著的變化。
我們的會員人數激增至 600 多人，並在此期間成功組織並舉辦了超過 40 場活動。
更令人鼓舞的是，每場活動的出席人數都很穩定，平均約有 30 人蔘加。
這種增長和參與度清楚地表明瞭我們與 CNCF 的合作讓 Kubernetes 讀書會在社區中增強了影響力。

<!--
## Joining the Book Club

**FSM**: For anyone wanting to join, what should they do?

**CS**: There are three steps to join:
-->
## 加入讀書會

**FSM**：若有人想加入讀書會，他們應該怎麼做？

**CS**：加入讀書會只需三步：

<!--
- First, join the [Kubernetes Book Club Community](https://community.cncf.io/kubernetes-virtual-book-club/)
- Then RSVP to the
  [events](https://community.cncf.io/kubernetes-virtual-book-club/)
  on the community page
- Lastly, join the CNCF Slack channel
  [#kubernetes-book-club](https://cloud-native.slack.com/archives/C05EYA14P37).
-->
- 首先加入 [Kubernetes 讀書會社區](https://community.cncf.io/kubernetes-virtual-book-club/)
- 然後註冊參與在社區頁面上列出的[活動](https://community.cncf.io/kubernetes-virtual-book-club/)
- 最後加入 CNCF Slack 頻道 [#kubernetes-book-club](https://cloud-native.slack.com/archives/C05EYA14P37)。

<!--
**FSM**: Excellent, thank you! Any final comments you would like to share?

**CS**: The Kubernetes Book Club is more than just a group of professionals discussing books; it's a
vibrant community and amazing volunteers that help organize and host
[Neependra Khare](https://www.linkedin.com/in/neependra/),
[Eric Smalling](https://www.linkedin.com/in/ericsmalling/),
[Sevi Karakulak](https://www.linkedin.com/in/sevikarakulak/),
[Chad M. Crowell](https://www.linkedin.com/in/chadmcrowell/),
and [Walid (CNJ) Shaari](https://www.linkedin.com/in/walidshaari/).
Look us up at KubeCon and get your Kubernetes Book Club sticker!
-->
**FSM**：太好了，謝謝你！最後你還有什麼想法要跟大家分享嗎？

**CS**：Kubernetes 讀書會不僅僅是一個討論書籍的專業小組，它是一個充滿活力的社區，
有許多令人敬佩的志願者幫助組織和主持聚會。我想借這次機會感謝幾位志願者：
[Neependra Khare](https://www.linkedin.com/in/neependra/)、
[Eric Smalling](https://www.linkedin.com/in/ericsmalling/)、
[Sevi Karakulak](https://www.linkedin.com/in/sevikarakulak/)、
[Chad M. Crowell](https://www.linkedin.com/in/chadmcrowell/)
和 [Walid (CNJ) Shaari](https://www.linkedin.com/in/walidshaari/)。
歡迎來 KubeCon 與我們相聚，還能領取你的 Kubernetes 讀書會貼紙！
