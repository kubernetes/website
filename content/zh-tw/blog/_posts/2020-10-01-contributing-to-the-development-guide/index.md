---
title: "爲開發指南做貢獻"
linkTitle: "爲開發指南做貢獻"
Author: Erik L. Arneson
Description: "一位新的貢獻者描述了編寫和提交對 Kubernetes 開發指南的修改的經驗。"
date: 2020-10-01
canonicalUrl: https://www.kubernetes.dev/blog/2020/09/28/contributing-to-the-development-guide/
resources:
- src: "jorge-castro-code-of-conduct.jpg"
  title: "Jorge Castro 正在 SIG ContribEx 的周例會上宣佈 Kubernetes 的行爲準則。"
---

<!-- 
---
title: "Contributing to the Development Guide"
linkTitle: "Contributing to the Development Guide"
Author: Erik L. Arneson
Description: "A new contributor describes the experience of writing and submitting changes to the Kubernetes Development Guide."
date: 2020-10-01
canonicalUrl: https://www.kubernetes.dev/blog/2020/09/28/contributing-to-the-development-guide/
resources:
- src: "jorge-castro-code-of-conduct.jpg"
  title: "Jorge Castro announcing the Kubernetes Code of Conduct during a weekly SIG ContribEx meeting."
--- 
-->


<!-- 
When most people think of contributing to an open source project, I suspect they probably think of
contributing code changes, new features, and bug fixes. As a software engineer and a long-time open
source user and contributor, that's certainly what I thought. Although I have written a good quantity
of documentation in different workflows, the massive size of the Kubernetes community was a new kind 
of "client." I just didn't know what to expect when Google asked my compatriots and me at
[Lion's Way](https://lionswaycontent.com/) to make much-needed updates to the Kubernetes Development Guide.

*This article originally appeared on the [Kubernetes Contributor Community blog](https://www.kubernetes.dev/blog/2020/09/28/contributing-to-the-development-guide/).*
-->

當大多數人想到爲一個開源項目做貢獻時，我猜想他們可能想到的是貢獻代碼修改、新功能和錯誤修復。作爲一個軟體工程師和一個長期的開源使用者和貢獻者，這也正是我的想法。
雖然我已經在不同的工作流中寫了不少文檔，但規模龐大的 Kubernetes 社區是一種新型 "客戶"。我只是不知道當 Google 要求我和 [Lion's Way](https://lionswaycontent.com/) 的同胞們對 Kubernetes 開發指南進行必要更新時會發生什麼。

*本文最初出現在 [Kubernetes Contributor Community blog](https://www.kubernetes.dev/blog/2020/09/28/contributing-to-the-development-guide/)。*

<!--
 ## The Delights of Working With a Community

As professional writers, we are used to being hired to write very specific pieces. We specialize in
marketing, training, and documentation for technical services and products, which can range anywhere from relatively fluffy marketing emails to deeply technical white papers targeted at IT and developers. With 
this kind of professional service, every deliverable tends to have a measurable return on investment. 
I knew this metric wouldn't be present when working on open source documentation, but I couldn't
predict how it would change my relationship with the project. 
-->

## 與社區合作的樂趣

作爲專業的寫手，我們習慣了受僱於他人去書寫非常具體的項目。我們專注於技術服務，產品營銷，技術培訓以及文檔編制，範圍從相對寬鬆的營銷郵件到針對 IT 和開發人員的深層技術白皮書。
在這種專業服務下，每一個可交付的項目往往都有可衡量的投資回報。我知道在從事開源文檔工作時不會出現這個指標，但我不確定它將如何改變我與項目的關係。

<!--
 One of the primary traits of the relationship between our writing and our traditional clients is that we
always have one or two primary points of contact inside a company. These contacts are responsible
for reviewing our writing and making sure it matches the voice of the company and targets the
audience they're looking for. It can be stressful -- which is why I'm so glad that my writing
partner, eagle-eyed reviewer, and bloodthirsty editor [Joel](https://twitter.com/JoelByronBarker)
handles most of the client contact. 
-->

我們的寫作和傳統客戶之間的關係有一個主要的特點，就是我們在一個公司裏面總是有一兩個主要的對接人。他們負責審查我們的文稿，並確保文稿內容符合公司的聲明且對標於他們正在尋找的受衆。
這隨之而來的壓力--正好解釋了爲什麼我很高興我的寫作夥伴、鷹眼審稿人同時也是嗜血編輯的 [Joel](https://twitter.com/JoelByronBarker) 處理了大部分的客戶聯繫。


<!--
 I was surprised and delighted that all of the stress of client contact went out the window when
working with the Kubernetes community. 
-->

在與 Kubernetes 社區合作時，所有與客戶接觸的壓力都消失了，這讓我感到驚訝和高興。

<!--
 "How delicate do I have to be? What if I screw up? What if I make a developer angry? What if I make
enemies?" These were all questions that raced through my mind and made me feel like I was
approaching a field of eggshells when I first joined the `#sig-contribex` channel on the Kubernetes
Slack and announced that I would be working on the
[Development Guide](https://github.com/kubernetes/community/blob/master/contributors/devel/development.md). 
-->

"我必須得多仔細？如果我搞砸了怎麼辦？如果我讓開發商生氣了怎麼辦？如果我樹敵了怎麼辦？"。
當我第一次加入 Kubernetes Slack 上的  "#sig-contribex "  頻道並宣佈我將編寫 [開發指南](https://github.com/kubernetes/community/blob/master/contributors/devel/development.md) 時，這些問題都在我腦海中奔騰，讓我感覺如履薄冰。

<!--
 {{< imgproc jorge-castro-code-of-conduct Fit "800x450" >}}
"The Kubernetes Code of Conduct is in effect, so please be excellent to each other." &mdash; Jorge
Castro, SIG ContribEx co-chair
{{< /imgproc >}} 
-->

{{< imgproc jorge-castro-code-of-conduct Fit "800x450" >}}
"Kubernetes 編碼準則已經生效，讓我們共同勉勵。" &mdash; Jorge
Castro, SIG ContribEx co-chair
{{< /imgproc >}}

<!--
 My fears were unfounded. Immediately, I felt welcome. I like to think this isn't just because I was
working on a much needed task, but rather because the Kubernetes community is filled
with friendly, welcoming people. During the weekly SIG ContribEx meetings, our reports on progress
with the Development Guide were included immediately. In addition, the leader of the meeting would
always stress that the [Kubernetes Code of Conduct](https://www.kubernetes.dev/resources/code-of-conduct/) was in
effect, and that we should, like Bill and Ted, be excellent to each other. 
-->

事實上我的擔心是多慮的。很快，我就感覺到自己是被歡迎的。我傾向於認爲這不僅僅是因爲我正在從事一項急需的任務，而是因爲 Kubernetes 社區充滿了友好、熱情的人們。
在每週的 SIG ContribEx 會議上，我們關於開發指南進展情況的報告會被立即納入其中。此外，會議的領導會一直強調 [Kubernetes](https://www.kubernetes.dev/resources/code-of-conduct/) 編碼準則，我們應該像 Bill 和 Ted 一樣，相互進步。


<!--
 ## This Doesn't Mean It's All Easy

The Development Guide needed a pretty serious overhaul. When we got our hands on it, it was already
packed with information and lots of steps for new developers to go through, but it was getting dusty
with age and neglect. Documentation can really require a global look, not just point fixes.
As a result, I ended up submitting a gargantuan pull request to the
[Community repo](https://github.com/kubernetes/community): 267 additions and 88 deletions. 
-->

## 這並不意味着這一切都很簡單

開發指南需要一次全面檢查。當我們拿到它的時候，它已經捆綁了大量的資訊和很多新開發者需要經歷的步驟，但隨着時間的推移和被忽視，它變得相當陳舊。
文檔的確需要全局觀，而不僅僅是點與點的修復。結果，最終我向這個項目提交了一個巨大的 pull 請求。[社區倉庫](https://github.com/kubernetes/community)：新增 267 行，刪除 88 行。

<!--
 The life cycle of a pull request requires a certain number of Kubernetes organization members to review and approve changes
before they can be merged. This is a great practice, as it keeps both documentation and code in
pretty good shape, but it can be tough to cajole the right people into taking the time for such a hefty
review. As a result, that massive PR took 26 days from my first submission to final merge. But in
the end, [it was successful](https://github.com/kubernetes/community/pull/5003). 
-->

pull 請求的週期需要一定數量的 Kubernetes 組織成員審查和批准更改後才能合併。這是一個很好的做法，因爲它使文檔和代碼都保持在相當不錯的狀態，
但要哄騙合適的人花時間來做這樣一個赫赫有名的審查是很難的。
因此，那次大規模的 PR 從我第一次提交到最後合併，用了 26 天。 但最終，[它是成功的](https://github.com/kubernetes/community/pull/5003).

<!--
 Since Kubernetes is a pretty fast-moving project, and since developers typically aren't really
excited about writing documentation, I also ran into the problem that sometimes, the secret jewels
that describe the workings of a Kubernetes subsystem are buried deep within the [labyrinthine mind of
a brilliant engineer](https://github.com/amwat), and not in plain English in a Markdown file. I ran headlong into this issue
when it came time to update the getting started documentation for end-to-end (e2e) testing.  
-->

由於 Kubernetes 是一個發展相當迅速的項目，而且開發人員通常對編寫文檔並不十分感興趣，所以我也遇到了一個問題，那就是有時候，
描述 Kubernetes 子系統工作原理的祕密珍寶被深埋在 [天才工程師的迷宮式思維](https://github.com/amwat) 中，而不是用單純的英文寫在 Markdown 檔案中。
當我要更新端到端（e2e）測試的入門文檔時，就一頭撞上了這個問題。

<!--
 This portion of my journey took me out of documentation-writing territory and into the role of a
brand new user of some unfinished software. I ended up working with one of the developers of the new
[`kubetest2` framework](https://github.com/kubernetes-sigs/kubetest2) to document the latest process of
getting up-and-running for e2e testing, but it required a lot of head scratching on my part. You can
judge the results for yourself by checking out my
[completed pull request](https://github.com/kubernetes/community/pull/5045). 
-->

這段旅程將我帶出了編寫文檔的領域，進入到一些未完成軟體的全新使用者角色。最終我花了很多心思與新的 [kubetest2`框架](https://github.com/kubernetes-sigs/kubetest2) 的開發者之一合作，
記錄了最新 e2e 測試的啓動和運行過程。
你可以通過查看我的 [已完成的 pull request](https://github.com/kubernetes/community/pull/5045) 來自己判斷結果。

<!--
 ## Nobody Is the Boss, and Everybody Gives Feedback

But while I secretly expected chaos, the process of contributing to the Kubernetes Development Guide
and interacting with the amazing Kubernetes community went incredibly smoothly. There was no
contention. I made no enemies. Everybody was incredibly friendly and welcoming. It was *enjoyable*. 
-->

## 沒有人是老闆，每個人都給出反饋。

但當我暗自期待混亂的時候，爲 Kubernetes 開發指南做貢獻以及與神奇的 Kubernetes 社區互動的過程卻非常順利。
沒有爭執，我也沒有樹敵。每個人都非常友好和熱情。這是令人*愉快的*。

<!--
 With an open source project, there is no one boss. The Kubernetes project, which approaches being
gargantuan, is split into many different special interest groups (SIGs), working groups, and
communities. Each has its own regularly scheduled meetings, assigned duties, and elected
chairpersons. My work intersected with the efforts of both SIG ContribEx (who watch over and seek to
improve the contributor experience) and SIG Testing (who are in charge of testing). Both of these
SIGs proved easy to work with, eager for contributions, and populated with incredibly friendly and
welcoming people. 
-->

對於一個開源項目，沒人是老闆。Kubernetes 項目，一個近乎巨大的項目，被分割成許多不同的特殊興趣小組（SIG）、工作組和社區。
每個小組都有自己的定期會議、職責分配和主席推選。我的工作與 SIG ContribEx（負責監督並尋求改善貢獻者體驗）和 SIG Testing（負責測試）的工作有交集。
事實證明，這兩個 SIG 都很容易合作，他們渴望貢獻，而且都是非常友好和熱情的人。

<!--
 In an active, living project like Kubernetes, documentation continues to need maintenance, revision,
and testing alongside the code base. The Development Guide will continue to be crucial to onboarding
new contributors to the Kubernetes code base, and as our efforts have shown, it is important that
this guide keeps pace with the evolution of the Kubernetes project. 
-->

在 Kubernetes 這樣一個活躍的、有生命力的項目中，文檔仍然需要與代碼庫一起進行維護、修訂和測試。
開發指南將繼續對 Kubernetes 代碼庫的新貢獻者起到至關重要的作用，正如我們的努力所顯示的那樣，該指南必須與 Kubernetes 項目的發展保持同步。

<!--
 Joel and I really enjoy interacting with the Kubernetes community and contributing to
the Development Guide. I really look forward to continuing to not only contributing more, but to
continuing to build the new friendships I've made in this vast open source community over the past
few months. 
-->

Joel 和我非常喜歡與 Kubernetes 社區互動併爲開發指南做出貢獻。我真的很期待，不僅能繼續做出更多貢獻，還能繼續與過去幾個月在這個龐大的開源社區中結識的新朋友進行合作。
