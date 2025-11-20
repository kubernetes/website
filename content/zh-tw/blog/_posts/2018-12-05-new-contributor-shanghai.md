---
layout: blog
title: '新貢獻者工作坊上海站'
date: 2018-12-05
slug: new-contributor-workshop-shanghai
---
<!-- 
layout: blog
title: 'New Contributor Workshop Shanghai'
date: 2018-12-05
 -->

<!--
**Authors**: Josh Berkus (Red Hat), Yang Li (The Plant), Puja Abbassi (Giant Swarm), XiangPeng Zhao (ZTE)
 -->

**作者**: Josh Berkus (紅帽), Yang Li (The Plant), Puja Abbassi (Giant Swarm), XiangPeng Zhao (中興通訊)

<!--
{{< figure src="/images/blog/2018-12-05-new-contributor-shanghai/attendees.png" caption="KubeCon Shanghai New Contributor Summit attendees. Photo by Jerry Zhang" >}}
 -->

{{< figure src="/images/blog/2018-12-05-new-contributor-shanghai/attendees.png" caption="KubeCon 上海站新貢獻者峯會與會者，攝影：Jerry Zhang" >}}

<!--
We recently completed our first New Contributor Summit in China, at the first KubeCon in China. It was very exciting to see all of the Chinese and Asian developers (plus a few folks from around the world) interested in becoming contributors. Over the course of a long day, they learned how, why, and where to contribute to Kubernetes, created pull requests, attended a panel of current contributors, and got their CLAs signed.
 -->

最近，在中國的首次 KubeCon 上，我們完成了在中國的首次新貢獻者峯會。看到所有中國和亞洲的開發者（以及來自世界各地的一些人）有興趣成爲貢獻者，這令人非常興奮。在長達一天的課程中，他們瞭解瞭如何、爲什麼以及在何處爲 Kubernetes 作出貢獻，創建了 PR，參加了貢獻者圓桌討論，並簽署了他們的 CLA。

<!--
This was our second New Contributor Workshop (NCW), building on the one created and led by SIG Contributor Experience members in Copenhagen. Because of the audience, it was held in both Chinese and English, taking advantage of the superb simultaneous interpretation services the CNCF sponsored. Likewise, the NCW team included both English and Chinese-speaking members of the community: Yang Li, XiangPeng Zhao, Puja Abbassi, Noah Abrahams, Tim Pepper, Zach Corleissen, Sen Lu, and Josh Berkus. In addition to presenting and helping students, the bilingual members of the team translated all of the slides into Chinese. Fifty-one students attended.
 -->

這是我們的第二屆新貢獻者工作坊（NCW），它由前一次貢獻者體驗 SIG 成員創建和領導的哥本哈根研討會延伸而來。根據受衆情況，本次活動採用了中英文兩種語言，充分利用了 CNCF 贊助的一流的同聲傳譯服務。同樣，NCW 團隊由社區成員組成，既有說英語的，也有說漢語的：Yang Li、XiangPeng Zhao、Puja Abbassi、Noah Abrahams、Tim Pepper、Zach Corleissen、Sen Lu 和 Josh Berkus。除了演講和幫助學員外，團隊的雙語成員還將所有幻燈片翻譯成了中文。共有五十一名學員參加。

<!--
{{< figure src="/images/blog/2018-12-05-new-contributor-shanghai/noahabrahams.png" caption="Noah Abrahams explains Kubernetes communications channels. Photo by Jerry Zhang" >}}
 -->

{{< figure src="/images/blog/2018-12-05-new-contributor-shanghai/noahabrahams.png" caption="Noah Abrahams 講解 Kubernetes 溝通渠道。攝影：Jerry Zhang" >}}

<!--
The NCW takes participants through the stages of contributing to Kubernetes, starting from deciding where to contribute, followed by an introduction to the SIG system and our repository structure. We also have "guest speakers" from Docs and Test Infrastructure who cover contributing in those areas. We finally wind up with some hands-on exercises in filing issues and creating and approving PRs.
 -->

NCW 讓參與者完成了爲 Kubernetes 作出貢獻的各個階段，從決定在哪裏作出貢獻開始，接着介紹了 SIG 系統和我們的代碼倉庫結構。我們還有來自文檔和測試基礎設施領域的「客座講者」，他們負責講解有關的貢獻。最後，我們在創建 issue、提交併批准 PR 的實踐練習後，結束了工作坊。

<!--
Those hands-on exercises use a repository known as [the contributor playground](https://github.com/kubernetes-sigs/contributor-playground), created by SIG Contributor Experience as a place for new contributors to try out performing various actions on a Kubernetes repo. It has modified Prow and Tide automation, uses Owners files like in the real repositories. This lets students learn how the mechanics of contributing to our repositories work without disrupting normal development.
 -->

這些實踐練習使用一個名爲[貢獻者遊樂場](https://github.com/kubernetes-sigs/contributor-playground)的代碼倉庫，由貢獻者體驗 SIG 創建，讓新貢獻者嘗試在一個 Kubernetes 倉庫中執行各種操作。它修改了 Prow 和 Tide 自動化，使用與真實代碼倉庫類似的 Owners 檔案。這可以讓學員瞭解爲我們的倉庫做出貢獻的有關機制，同時又不妨礙正常的開發流程。

<!--
{{< figure src="/images/blog/2018-12-05-new-contributor-shanghai/yangli.png" caption="Yang Li talks about getting your PRs reviewed. Photo by Josh Berkus" >}}
 -->

{{< figure src="/images/blog/2018-12-05-new-contributor-shanghai/yangli.png" caption="Yang Li 講到如何讓你的 PR 通過評審。攝影：Josh Berkus" >}}

<!--
Both the "Great Firewall" and the language barrier prevent contributing Kubernetes from China from being straightforward. What's more, because open source business models are not mature in China, the time for employees work on open source projects is limited.
 -->

「防火長城」和語言障礙都使得在中國爲 Kubernetes 作出貢獻變得困難。而且，中國的開源商業模式並不成熟，員工在開源項目上工作的時間有限。

<!--
Chinese engineers are eager to participate in the development of Kubernetes, but many of them don't know where to start since Kubernetes is such a large project. With this workshop, we hope to help those who want to contribute, whether they wish to fix some bugs they encountered, improve or localize documentation, or they need to work with Kubernetes at their work. We are glad to see more and more Chinese contributors joining the community in the past few years, and we hope to see more of them in the future.
 -->

中國工程師渴望參與 Kubernetes 的研發，但他們中的許多人不知道從何處開始，因爲 Kubernetes 是一個如此龐大的項目。通過本次工作坊，我們希望幫助那些想要參與貢獻的人，不論他們希望修復他們遇到的一些錯誤、改進或本地化文檔，或者他們需要在工作中用到 Kubernetes。我們很高興看到越來越多的中國貢獻者在過去幾年里加入社區，我們也希望將來可以看到更多。

<!--
"I have been participating in the Kubernetes community for about three years," said XiangPeng Zhao. "In the community, I notice that more and more Chinese developers are showing their interest in contributing to Kubernetes. However, it's not easy to start contributing to such a project. I tried my best to help those who I met in the community, but I think there might still be some new contributors leaving the community due to not knowing where to get help when in trouble. Fortunately, the community initiated NCW at KubeCon Copenhagen and held a second one at KubeCon Shanghai. I was so excited to be invited by Josh Berkus to help organize this workshop. During the workshop, I met community friends in person, mentored attendees in the exercises, and so on. All of this was a memorable experience for me. I also learned a lot as a contributor who already has years of contributing experience. I wish I had attended such a workshop when I started contributing to Kubernetes years ago."
 -->

「我已經參與了 Kubernetes 社區大約三年」，XiangPeng Zhao 說，「在社區，我注意到越來越多的中國開發者表現出對 Kubernetes 貢獻的興趣。但是，開始爲這樣一個項目做貢獻並不容易。我盡力幫助那些我在社區遇到的人，但是，我認爲可能仍有一些新的貢獻者離開社區，因爲他們在遇到麻煩時不知道從哪裏獲得幫助。幸運的是，社區在 KubeCon 哥本哈根站發起了 NCW，並在 KubeCon 上海站舉辦了第二屆。我很高興受到 Josh Berkus 的邀請，幫助組織這個工作坊。在工作坊期間，我當面見到了社區裏的朋友，在練習中指導了與會者，等等。所有這些對我來說都是難忘的經歷。作爲有着多年貢獻者經驗的我，也學習到了很多。我希望幾年前我開始爲 Kubernetes 做貢獻時參加過這樣的工作坊」。

<!--
{{< figure src="/images/blog/2018-12-05-new-contributor-shanghai/panel.png" caption="Panel of contributors. Photo by Jerry Zhang" >}}
 -->

{{< figure src="/images/blog/2018-12-05-new-contributor-shanghai/panel.png" caption="貢獻者圓桌討論。攝影：Jerry Zhang" >}}

<!--
The workshop ended with a panel of current contributors, featuring Lucas Käldström, Janet Kuo, Da Ma, Pengfei Ni, Zefeng Wang, and Chao Xu. The panel aimed to give both new and current contributors a look behind the scenes on the day-to-day of some of the most active contributors and maintainers, both from China and around the world. Panelists talked about where to begin your contributor's journey, but also how to interact with reviewers and maintainers. They further touched upon the main issues of contributing from China and gave attendees an outlook into exciting features they can look forward to in upcoming releases of Kubernetes.
 -->

工作坊以現有貢獻者圓桌討論結束，嘉賓包括 Lucas Käldström、Janet Kuo、Da Ma、Pengfei Ni、Zefeng Wang 和 Chao Xu。這場圓桌討論旨在讓新的和現有的貢獻者瞭解一些最活躍的貢獻者和維護者的幕後日常工作，不論他們來自中國還是世界各地。嘉賓們討論了從哪裏開始貢獻者的旅程，以及如何與評審者和維護者進行互動。他們進一步探討了在中國參與貢獻的主要問題，並向與會者預告了在 Kubernetes 的未來版本中可以期待的令人興奮的功能。

<!--
After the workshop, XiangPeng Zhao chatted with some attendees on WeChat and Twitter about their experiences. They were very glad to have attended the NCW and had some suggestions on improving the workshop. One attendee, Mohammad, said, "I had a great time at the workshop and learned a lot about the entire process of k8s for a contributor." Another attendee, Jie Jia, said, "The workshop was wonderful. It systematically explained how to contribute to Kubernetes. The attendee could understand the process even if s/he knew nothing about that before. For those who were already contributors, they could also learn something new. Furthermore, I could make new friends from inside or outside of China in the workshop. It was awesome!"
 -->

工作坊結束後，XiangPeng Zhao 和一些與會者就他們的經歷在微信和 Twitter 上進行了交談。他們很高興參加了 NCW，並就改進工作坊提出了一些建議。一位名叫 Mohammad 的與會者說：「我在工作坊上玩得很開心，學習了參與 k8s 貢獻的整個過程。」另一位與會者 Jie Jia 說：「工作坊非常精彩。它系統地解釋瞭如何爲 Kubernetes 做出貢獻。即使參與者之前對此一無所知，他（她）也可以理解這個過程。對於那些已經是貢獻者的人，他們也可以學習到新東西。此外，我還可以在工作坊上結識來自國內外的新朋友。真是棒極了！」

<!--
SIG Contributor Experience will continue to run New Contributor Workshops at each upcoming KubeCon, including Seattle, Barcelona, and the return to Shanghai in June 2019. If you failed to get into one this year, register for one at a future KubeCon. And, when you meet an NCW attendee, make sure to welcome them to the community.
 -->

貢獻者體驗 SIG 將繼續在未來的 KubeCon 上舉辦新貢獻者工作坊，包括西雅圖站、巴塞羅那站，然後在 2019 年六月回到上海。如果你今年未能參加，請在未來的 KubeCon 上註冊。並且，如果你遇到工作坊的與會者，請務必歡迎他們加入社區。

<!--
Links:
 -->

鏈接：

<!--
* English versions of the slides: [PDF](https://gist.github.com/jberkus/889be25c234b01761ce44eccff816380#file-kubernetes-shanghai-english-pdf) or [Google Docs with speaker notes](https://docs.google.com/presentation/d/1l5f_iAFsKg50LFq3N80KbZKUIEL_tyCaUoWPzSxColo/edit?usp=sharing)
* Chinese version of the slides: [PDF](https://gist.github.com/jberkus/889be25c234b01761ce44eccff816380#file-kubernetes-shanghai-cihinese-pdf)
* [Contributor playground](https://github.com/kubernetes-sigs/contributor-playground)
 -->

* 中文版幻燈片：[PDF](https://gist.github.com/jberkus/889be25c234b01761ce44eccff816380#file-kubernetes-shanghai-cihinese-pdf)
* 英文版幻燈片：[PDF](https://gist.github.com/jberkus/889be25c234b01761ce44eccff816380#file-kubernetes-shanghai-english-pdf) 或 [帶有演講者筆記的 Google Docs](https://docs.google.com/presentation/d/1l5f_iAFsKg50LFq3N80KbZKUIEL_tyCaUoWPzSxColo/edit?usp=sharing)
* [貢獻者遊樂場](https://github.com/kubernetes-sigs/contributor-playground)
