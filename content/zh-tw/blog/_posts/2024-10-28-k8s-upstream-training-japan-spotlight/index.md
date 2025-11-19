---
layout: blog
title: "關於日本的 Kubernetes 上游培訓的特別報道"
slug: k8s-upstream-training-japan-spotlight
date: 2024-10-28
author: >
  [Junya Okabe](https://github.com/Okabe-Junya)（筑波大學）/
  日本 Kubernetes 上游培訓組織團隊
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Spotlight on Kubernetes Upstream Training in Japan"
slug: k8s-upstream-training-japan-spotlight
date: 2024-10-28
canonicalUrl: https://www.k8s.dev/blog/2024/10/28/k8s-upstream-training-japan-spotlight/
author: >
  [Junya Okabe](https://github.com/Okabe-Junya) (University of Tsukuba) / 
  Organizing team of Kubernetes Upstream Training in Japan
-->

<!--
We are organizers of [Kubernetes Upstream Training in Japan](https://github.com/kubernetes-sigs/contributor-playground/tree/master/japan).
Our team is composed of members who actively contribute to Kubernetes, including individuals who hold roles such as member, reviewer, approver, and chair.
-->
我們是[日本 Kubernetes 上游培訓](https://github.com/kubernetes-sigs/contributor-playground/tree/master/japan)的組織者。
我們的團隊由積極向 Kubernetes 做貢獻的成員組成，他們在社區中擔任了 Member、Reviewer、Approver 和 Chair 等角色。

<!--
Our goal is to increase the number of Kubernetes contributors and foster the growth of the community.
While Kubernetes community is friendly and collaborative, newcomers may find the first step of contributing to be a bit challenging.
Our training program aims to lower that barrier and create an environment where even beginners can participate smoothly.
-->
我們的目標是增加 Kubernetes 貢獻者的數量，並促進社區的成長。
雖然 Kubernetes 社區友好協作，但新手可能會發現邁出貢獻的第一步有些困難。
我們的培訓項目旨在降低壁壘，創造一個即使是初學者也能順利參與的環境。

<!--
## What is Kubernetes upstream training in Japan?

![Upstream Training in 2022](ood-2022-01.png)

Our training started in 2019 and is held 1 to 2 times a year.
Initially, Kubernetes Upstream Training was conducted as a co-located event of KubeCon (Kubernetes Contributor Summit),
but we launched Kubernetes Upstream Training in Japan with the aim of increasing Japanese contributors by hosting a similar event in Japan.
-->
## 日本 Kubernetes 上游培訓是什麼？   {#what-is-kubernetes-upstream-training-in-japan}

![2022 年上游培訓](ood-2022-01.png)

我們的培訓始於 2019 年，每年舉辦 1 到 2 次。
最初，Kubernetes 上游培訓曾作爲 KubeCon（Kubernetes 貢獻者峯會）的同場地活動進行，
後來我們在日本推出了 Kubernetes 上游培訓，目的是通過在日本舉辦類似活動來增加日本的貢獻者。

<!--
Before the pandemic, the training was held in person, but since 2020, it has been conducted online.
The training offers the following content for those who have not yet contributed to Kubernetes:

* Introduction to Kubernetes community
* Overview of Kubernetes codebase and how to create your first PR
* Tips and encouragement to lower participation barriers, such as language
* How to set up the development environment
* Hands-on session using [kubernetes-sigs/contributor-playground](https://github.com/kubernetes-sigs/contributor-playground)
-->
在疫情之前，培訓是面對面進行的，但自 2020 年以來，我們已轉爲在線上進行。
培訓爲尚未參與過 Kubernetes 貢獻的學員提供以下內容：

* Kubernetes 社區簡介
* Kubernetes 代碼庫概述以及如何創建你的第一個 PR
* 各種降低參與壁壘（如語言）的提示和鼓勵
* 如何搭建開發環境
* 使用 [kubernetes-sigs/contributor-playground](https://github.com/kubernetes-sigs/contributor-playground)
  開展實踐課程

<!--
At the beginning of the program, we explain why contributing to Kubernetes is important and who can contribute.
We emphasize that contributing to Kubernetes allows you to make a global impact and that Kubernetes community is looking forward to your contributions!

We also explain Kubernetes community, SIGs, and Working Groups.
Next, we explain the roles and responsibilities of Member, Reviewer, Approver, Tech Lead, and Chair.
Additionally, we introduce the communication tools we primarily use, such as Slack, GitHub, and mailing lists.
Some Japanese speakers may feel that communicating in English is a barrier.
Additionally, those who are new to the community need to understand where and how communication takes place.
We emphasize the importance of taking that first step, which is the most important aspect we focus on in our training!
-->
在培訓開始時，我們講解爲什麼貢獻 Kubernetes 很重要以及誰可以做貢獻。
我們強調，貢獻 Kubernetes 可以讓你產生全球影響，而 Kubernetes 社區期待着你的貢獻！

我們還講解 Kubernetes 社區、SIG（特別興趣小組）和 WG（工作組）。
接下來，我們講解 Member、Reviewer、Approver、Tech Lead 和 Chair 的角色與職責。
此外，我們介紹大家所使用的主要溝通工具，如 Slack、GitHub 和郵件列表。
一些講日語的人可能會覺得用英語溝通是一個障礙。
此外，社區的新人需要理解在哪兒以及如何與人交流。
我們強調邁出第一步的重要性，這是我們培訓中最關注的方面！

<!--
We then go over the structure of Kubernetes codebase, the main repositories, how to create a PR, and the CI/CD process using [Prow](https://docs.prow.k8s.io/).
We explain in detail the process from creating a PR to getting it merged.

After several lectures, participants get to experience hands-on work using [kubernetes-sigs/contributor-playground](https://github.com/kubernetes-sigs/contributor-playground), where they can create a simple PR.
The goal is for participants to get a feel for the process of contributing to Kubernetes.

At the end of the program, we also provide a detailed explanation of setting up the development environment for contributing to the `kubernetes/kubernetes` repository,
including building code locally, running tests efficiently, and setting up clusters.
-->
然後，我們講解 Kubernetes 代碼庫的結構、主要的倉庫、如何創建 PR 以及使用
[Prow](https://docs.prow.k8s.io/) 的 CI/CD 流程。
我們詳細講解從創建 PR 到合併 PR 的過程。

經過幾節課後，參與者將體驗使用
[kubernetes-sigs/contributor-playground](https://github.com/kubernetes-sigs/contributor-playground)
開展實踐工作，在那裏他們可以創建一個簡單的 PR。
目標是讓參與者體驗貢獻 Kubernetes 的過程。

在項目結束時，我們還提供關於爲貢獻 `kubernetes/kubernetes` 倉庫搭建開發環境的詳細說明，
包括如何在本地構建代碼、如何高效運行測試以及如何搭建叢集。

<!--
## Interview with participants

We conducted interviews with those who participated in our training program.
We asked them about their reasons for joining, their impressions, and their future goals.
-->
## 與參與者的訪談   {#interview-with-participants}

我們對參與我們培訓項目的人進行了訪談。
我們詢問了他們參加的原因、印象和未來目標。

<!--
### [Keita Mochizuki](https://github.com/mochizuki875) ([NTT DATA Group Corporation](https://www.nttdata.com/global/en/about-us/profile))

Keita Mochizuki is a contributor who consistently contributes to Kubernetes and related projects.
Keita is also a professional in container security and has recently published a book.
Additionally, he has made available a [Roadmap for New Contributors](https://github.com/mochizuki875/KubernetesFirstContributionRoadMap), which is highly beneficial for those new to contributing.

**Junya:** Why did you decide to participate in Kubernetes Upstream Training?
-->
### [Keita Mochizuki](https://github.com/mochizuki875)（[NTT DATA 集團公司](https://www.nttdata.com/global/en/about-us/profile)）

Keita Mochizuki 是一位持續爲 Kubernetes 及相關項目做貢獻的貢獻者。
他還是容器安全領域的專業人士，他最近出版了一本書。此外，
他還發布了一份[新貢獻者路線圖](https://github.com/mochizuki875/KubernetesFirstContributionRoadMap)，
對新貢獻者非常有幫助。

**Junya：** 你爲什麼決定參加 Kubernetes 上游培訓？

<!--
**Keita:** Actually, I participated twice, in 2020 and 2022.
In 2020, I had just started learning about Kubernetes and wanted to try getting involved in activities outside of work, so I signed up after seeing the event on Twitter by chance.
However, I didn't have much knowledge at the time, and contributing to OSS felt like something beyond my reach.
As a result, my understanding after the training was shallow, and I left with more of a "hmm, okay" feeling.

In 2022, I participated again when I was at a stage where I was seriously considering starting contributions.
This time, I did prior research and was able to resolve my questions during the lectures, making it a very productive experience.
-->
**Keita：** 實際上，我分別在 2020 年和 2022 年參加過兩次培訓。
在 2020 年，我剛開始學習 Kubernetes，想嘗試參與工作以外的活動，
所以在 Twitter 上偶然看到活動後報了名參加了活動。
然而，那時我的知識積累還不多，貢獻 OSS 感覺超出了我的能力。
因此，在培訓後的理解比較膚淺，離開時更多是“嗯，好吧”的感覺。

在 2022 年，我再次參加，那時我認真考慮開始貢獻。
我事先進行了研究，並能夠在講座中解決我的問題，那次經歷非常有成效。

<!--
**Junya:** How did you feel after participating?

**Keita:** I felt that the significance of this training greatly depends on the participant's mindset.
The training itself consists of general explanations and simple hands-on exercises, but it doesn't mean that attending the training will immediately lead to contributions.

**Junya:** What is your purpose for contributing?

**Keita:** My initial motivation was to "gain a deep understanding of Kubernetes and build a track record," meaning "contributing itself was the goal."
Nowadays, I also contribute to address bugs or constraints I discover during my work.
Additionally, through contributing, I've become less hesitant to analyze undocumented features directly from the source code.
-->
**Junya：** 參加後你有什麼感受？

**Keita：** 我覺得培訓的意義很大程度上取決於參與者的心態。
培訓本身包括常規的講解和簡單的實踐練習，但這並不意味着參加培訓就會立即會去做貢獻。

**Junya：** 你貢獻的目的是什麼？

**Keita：** 我最初的動機是“深入理解 Kubernetes 並生成成績記錄”，也就是說“貢獻本身就是目標”。
如今，我還會通過貢獻來解決我在工作中發現的 Bug 或約束。
此外，通過貢獻，我變得不再那麼猶豫，會去直接基於源代碼分析瞭解沒有文檔記錄的特性。

<!--
**Junya:** What has been challenging about contributing?

**Keita:** The most difficult part was taking the first step. Contributing to OSS requires a certain level of knowledge, and leveraging resources like this training and support from others was essential.
One phrase that stuck with me was, "Once you take the first step, it becomes easier to move forward."
Also, in terms of continuing contributions as part of my job, the most challenging aspect is presenting the outcomes as achievements.
To keep contributing over time, it's important to align it with business goals and strategies, but upstream contributions don't always lead to immediate results that can be directly tied to performance.
Therefore, it's crucial to ensure mutual understanding with managers and gain their support.
-->
**Junya：** 貢獻中遇到的挑戰是什麼？

**Keita：** 最困難的部分是邁出第一步。貢獻 OSS 需要一定的知識水平，利用像這樣的培訓和他人的支持至關重要。
一句讓我印象深刻的話是，“一旦你邁出第一步，後續就會變得更容易。”  
此外，在作爲工作的一部分繼續貢獻時，最具挑戰性的是將輸出的結果變爲成就感。
要保持長期貢獻，將貢獻與業務目標和策略對齊非常重要，但上游貢獻並不總是能直接產生與表現相關的即時結果。
因此，確保與管理人員的相互理解並獲得他們的支持至關重要。

<!--
**Junya:** What are your future goals?

**Keita:** My goal is to contribute to areas with a larger impact.
So far, I've mainly contributed by fixing smaller bugs as my primary focus was building a track record,
but moving forward, I'd like to challenge myself with contributions that have a greater impact on Kubernetes users or that address issues related to my work.
Recently, I've also been working on reflecting the changes I've made to the codebase into the official documentation,
and I see this as a step toward achieving my goals.

**Junya:** Thank you very much!
-->
**Junya：** 你未來的目標是什麼？

**Keita：** 我的目標是對影響更大的領域做出貢獻。
到目前爲止，我主要通過修復較小的 Bug 來做貢獻，因爲我的主要關注是生成一份成績單，
但未來，我希望挑戰自己對 Kubernetes 使用者產生更大影響的貢獻，或解決與我工作相關的問題。
最近，我還在努力將我對代碼庫所做的更改反映到官方文檔中，
我將這視爲實現我目標的一步。

**Junya：** 非常感謝！

<!--
### [Yoshiki Fujikane](https://github.com/ffjlabo) ([CyberAgent, Inc.](https://www.cyberagent.co.jp/en/))

Yoshiki Fujikane is one of the maintainers of [PipeCD](https://pipecd.dev/), a CNCF Sandbox project.
In addition to developing new features for Kubernetes support in PipeCD,
Yoshiki actively participates in community management and speaks at various technical conferences.
-->
### [Yoshiki Fujikane](https://github.com/ffjlabo)（[CyberAgent, Inc.](https://www.cyberagent.co.jp/en/)）

Yoshiki Fujikane 是 CNCF 沙盒項目 [PipeCD](https://pipecd.dev/) 的維護者之一。
除了在 PipeCD 中開發對 Kubernetes 支持的新特性外，
Yoshiki 還積極參與社區管理，並在各種技術會議上發言。

<!--
**Junya:** Why did you decide to participate in the Kubernetes Upstream Training?

**Yoshiki:** At the time I participated, I was still a student.
I had only briefly worked with EKS, but I thought Kubernetes seemed complex yet cool, and I was casually interested in it.
Back then, OSS felt like something out of reach, and upstream development for Kubernetes seemed incredibly daunting.
While I had always been interested in OSS, I didn't know where to start.
It was during this time that I learned about the Kubernetes Upstream Training and decided to take the challenge of contributing to Kubernetes.
-->
**Junya：** 你爲什麼決定參加 Kubernetes 上游培訓？

**Yoshiki：** 當我參與培訓時，我還是一名學生。
我只簡短地接觸過 EKS，我覺得 Kubernetes 看起來複雜但很酷，我對此有一種隨意的興趣。
當時，OSS 對我來說感覺像是遙不可及，而 Kubernetes 的上游開發似乎非常令人生畏。
雖然我一直對 OSS 感興趣，但我不知道從哪裏開始。
也就在那個時候，我瞭解到 Kubernetes 上游培訓，並決定挑戰自己爲 Kubernetes 做貢獻。

<!--
**Junya:** What were your impressions after participating?

**Yoshiki:** I found it extremely valuable as a way to understand what it's like to be part of an OSS community.
At the time, my English skills weren't very strong, so accessing primary sources of information felt like a big hurdle for me.
Kubernetes is a very large project, and I didn't have a clear understanding of the overall structure, let alone what was necessary for contributing.
The upstream training provided a Japanese explanation of the community structure and allowed me to gain hands-on experience with actual contributions.
Thanks to the guidance I received, I was able to learn how to approach primary sources and use them as entry points for further investigation, which was incredibly helpful.
This experience made me realize the importance of organizing and reviewing primary sources, and now I often dive into GitHub issues and documentation when something piques my interest.
As a result, while I am no longer contributing to Kubernetes itself, the experience has been a great foundation for contributing to other projects.
-->
**Junya：** 參加後你的印象是什麼？

**Yoshiki：** 我發現對於瞭解如何成爲 OSS 社區的一部分，這種培訓是一種非常有價值的方式。
當時，我的英語水平不是很好，所以獲取主要信息源對我來說是一個很大的障礙。
Kubernetes 是一個非常大的項目，我對整體結構沒有清晰的理解，更不用說貢獻所需的內容了。
上游培訓提供了對社區結構的日文解釋，並讓我獲得了實際貢獻的實踐經驗。
得益於我所得到的指導，我學會了如何接觸主要信息源，並將其作爲進一步研究的切入點，這對我幫助很大。
這次經歷讓我意識到組織和評審主要信息源的重要性，現在我經常在 GitHub Issue 和文檔中深入研究我感興趣的內容。
因此，雖然我不再直接向 Kubernetes 做貢獻，但這次經歷爲我在其他項目中做貢獻奠定了很好的基礎。

<!--
**Junya:** What areas are you currently contributing to, and what are the other projects you're involved in?

**Yoshiki:** Right now, I'm no longer working with Kubernetes, but instead, I'm a maintainer of PipeCD, a CNCF Sandbox project.
PipeCD is a CD tool that supports GitOps-style deployments for various application platforms.
The tool originally started as an internal project at CyberAgent.
With different teams adopting different platforms, PipeCD was developed to provide a unified CD platform with a consistent user experience.
Currently, it supports Kubernetes, AWS ECS, Lambda, Cloud Run, and Terraform.
-->
**Junya：** 你目前在哪些領域做貢獻？你參與了哪些其他項目？

**Yoshiki：** 目前，我不再從事 Kubernetes 的工作，而是擔任 CNCF 沙盒項目 PipeCD 的維護者。
PipeCD 是一個支持各種應用平臺的 GitOps 式部署的 CD 工具。
此工具最初作爲 CyberAgent 的內部項目啓動。
隨着不同團隊採用不同的平臺，PipeCD 設計爲提供一個統一的 CD 平臺，確保使用者體驗一致。
目前，它支持 Kubernetes、AWS ECS、Lambda、Cloud Run 和 Terraform。

<!--
**Junya:** What role do you play within the PipeCD team?

**Yoshiki:** I work full-time on improving and developing Kubernetes-related features within the team.
Since we provide PipeCD as a SaaS internally, my main focus is on adding new features and improving existing ones as part of that support.
In addition to code contributions, I also contribute by giving talks at various events and managing community meetings to help grow the PipeCD community.
-->
**Junya：** 你在 PipeCD 團隊中扮演什麼角色？

**Yoshiki：** 我全職負責團隊中與 Kubernetes 相關特性的改進和開發。
由於我們將 PipeCD 作爲內部 SaaS 提供，我的主要關注點是添加新特性和改進現有特性，
確保 PipeCD 能夠持續良好支持 Kubernetes 等平臺。
除了代碼貢獻外，我還通過在各種活動上發言和管理社區會議來幫助發展 PipeCD 社區。

<!--
**Junya:** Could you explain what kind of improvements or developments you are working on with regards to Kubernetes?

**Yoshiki:** PipeCD supports GitOps and Progressive Delivery for Kubernetes, so I'm involved in the development of those features.
Recently, I've been working on features that streamline deployments across multiple clusters.
-->
**Junya：** 你能講解一下你對於 Kubernetes 正在進行哪些改進或開發嗎？

**Yoshiki：** PipeCD 支持 Kubernetes 的 GitOps 和漸進式交付，因此我參與這些特性的開發。
最近，我一直在開發簡化跨多個叢集部署的特性。

<!--
**Junya:** Have you encountered any challenges while contributing to OSS?

**Yoshiki:** One challenge is developing features that maintain generality while meeting user use cases.
When we receive feature requests while operating the internal SaaS, we first consider adding features to solve those issues.
At the same time, we want PipeCD to be used by a broader audience as an OSS tool.
So, I always think about whether a feature designed for one use case could be applied to another, ensuring the software remains flexible and widely usable.
-->
**Junya：** 在貢獻 OSS 的過程中，你遇到過哪些挑戰？

**Yoshiki：** 一個挑戰是開發在滿足使用者用例的同時保持通用性的特性。
當我們在運營內部 SaaS 期間收到特性請求時，我們首先考慮添加特性來解決這些問題。
與此同時，我們希望 PipeCD 作爲一個 OSS 工具被更廣泛的受衆使用。
因此，我總是思考爲一個用例設計的特性是否可以應用於其他用例，以確保 PipeCD 這個軟件保持靈活且廣泛可用。

<!--
**Junya:** What are your goals moving forward?

**Yoshiki:** I want to focus on expanding PipeCD's functionality.
Currently, we are developing PipeCD under the slogan "One CD for All."
As I mentioned earlier, it supports Kubernetes, AWS ECS, Lambda, Cloud Run, and Terraform, but there are many other platforms out there, and new platforms may emerge in the future.
For this reason, we are currently developing a plugin system that will allow users to extend PipeCD on their own, and I want to push this effort forward.
I'm also working on features for multi-cluster deployments in Kubernetes, and I aim to continue making impactful contributions.

**Junya:** Thank you very much!
-->
**Junya：** 你未來的目標是什麼？

**Yoshiki：** 我希望專注於擴展 PipeCD 的功能。
目前，我們正在以“普遍可用的持續交付”（One CD for All）的口號開發 PipeCD。
正如我之前提到的，它支持 Kubernetes、AWS ECS、Lambda、Cloud Run 和 Terraform，
但還有許多其他平臺，以及未來可能會出現的新平臺。
因此，我們目前正在開發一個插件系統，允許使用者自行擴展 PipeCD，我希望將這一努力向前推進。
我也在處理 Kubernetes 的多叢集部署特性，目標是繼續做出有影響力的貢獻。

**Junya：** 非常感謝！

<!--
## Future of Kubernetes upstream training

We plan to continue hosting Kubernetes Upstream Training in Japan and look forward to welcoming many new contributors.
Our next session is scheduled to take place at the end of November during [CloudNative Days Winter 2024](https://event.cloudnativedays.jp/cndw2024).
-->
## Kubernetes 上游培訓的未來   {#future-of-kubernetes-upstream-training}

我們計劃繼續在日本舉辦 Kubernetes 上游培訓，並期待歡迎更多的新貢獻者。
我們的下一次培訓定於 11 月底在
[CloudNative Days Winter 2024](https://event.cloudnativedays.jp/cndw2024) 期間舉行。

<!--
Moreover, our goal is to expand these training programs not only in Japan but also around the world.
[Kubernetes celebrated its 10th anniversary](https://kubernetes.io/blog/2024/06/06/10-years-of-kubernetes/) this year, and for the community to become even more active, it's crucial for people across the globe to continue contributing.
While Upstream Training is already held in several regions, we aim to bring it to even more places.

We hope that as more people join Kubernetes community and contribute, our community will become even more vibrant!
-->
此外，我們的目標不僅是在日本推廣這些培訓項目，還希望推廣到全球。
今年的 [Kubernetes 十週年慶](/zh-cn/blog/2024/06/06/10-years-of-kubernetes/)，
以及爲了使社區更加活躍，讓全球各地的人們持續貢獻至關重要。
雖然上游培訓已經在多個地區舉行，但我們希望將其帶到更多地方。

我們希望隨着越來越多的人加入 Kubernetes 社區並做出貢獻，我們的社區將變得更加生機勃勃！
