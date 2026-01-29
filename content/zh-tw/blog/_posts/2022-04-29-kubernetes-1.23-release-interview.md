---
layout: blog
title: "Frontiers, fsGroups and frogs: Kubernetes 1.23 發佈採訪"
date: 2022-04-29
---

<!--
layout: blog
title: "Frontiers, fsGroups and frogs: the Kubernetes 1.23 release interview"
date: 2022-04-29
-->
<!--
**Author**: Craig Box (Google)
-->
**作者**: Craig Box (Google)

<!--
One of the highlights of hosting the weekly [Kubernetes Podcast from Google](https://kubernetespodcast.com/) is talking to the release managers for each new Kubernetes version. The release team is constantly refreshing. Many working their way from small documentation fixes, step up to shadow roles, and then eventually lead a release.
-->
舉辦每週一次的[來自 Google 的 Kubernetes 播客](https://kubernetespodcast.com/) 
的亮點之一是與每個新 Kubernetes 版本的發佈經理交談。發佈團隊不斷刷新。許多人從小型文檔修復開始，逐步晉升爲影子角色，然後最終領導發佈。

<!--
As we prepare for the 1.24 release next week, [in accordance with long-standing tradition](https://www.google.com/search?q=%22release+interview%22+site%3Akubernetes.io%2Fblog), I'm pleased to bring you a look back at the story of 1.23. The release was led by [Rey Lejano](https://twitter.com/reylejano), a Field Engineer at SUSE. [I spoke to Rey](https://kubernetespodcast.com/episode/167-kubernetes-1.23/) in December, as he was awaiting the birth of his first child.
-->
在我們爲下週發佈的 1.24 版本做準備時，[按照長期以來的傳統](https://www.google.com/search?q=%22release+interview%22+site%3Akubernetes.io%2Fblog)，
很高興帶大家回顧一下 1.23 的故事。該版本由 SUSE 的現場工程師 [Rey Lejano](https://twitter.com/reylejano) 領導。
在 12 月[我與 Rey 交談過](https://kubernetespodcast.com/episode/167-kubernetes-1.23/)，當時他正在等待他的第一個孩子的出生。

<!--
Make sure you [subscribe, wherever you get your podcasts](https://kubernetespodcast.com/subscribe/), so you hear all our stories from the Cloud Native community, including the story of 1.24 next week.
-->
請確保你[訂閱，無論你在哪裏獲得你的播客](https://kubernetespodcast.com/subscribe/)，
以便你聽到我們所有來自雲原生社區的故事，包括下週 1.24 的故事。

<!--
*This transcript has been lightly edited and condensed for clarity.*
-->
**爲清晰起見本稿件經過了簡單的編輯和濃縮。**

---
<!--
**CRAIG BOX: I'd like to start with what is, of course, on top of everyone's mind at the moment. Let's talk African clawed frogs!**
-->
**CRAIG BOX：我想從現在每個人最關心的問題開始。讓我們談談非洲爪蛙！**

<!--
REY LEJANO: [CHUCKLES] Oh, you mean [Xenopus lavis](https://en.wikipedia.org/wiki/African_clawed_frog), the scientific name for the African clawed frog?

**CRAIG BOX: Of course.**
-->
REY LEJANO：[笑]哦，你是說 [Xenopus lavis](https://en.wikipedia.org/wiki/African_clawed_frog)，非洲爪蛙的學名？

**CRAIG BOX：當然。**

<!--
REY LEJANO: Not many people know, but my background and my degree is actually in microbiology, from the University of California Davis. I did some research for about four years in biochemistry, in a biochemistry lab, and I [do have a research paper published](https://www.sciencedirect.com/science/article/pii/). It's actually on glycoproteins, particularly something called "cortical granule lectin". We used frogs, because they generate lots and lots of eggs, from which we can extract the protein. That protein prevents polyspermy. When the sperm goes into the egg, the egg releases a glycoprotein, cortical granule lectin, to the membrane, and prevents any other sperm from going inside the egg.
-->
REY LEJANO：知道的人不多，但我曾就讀於戴維斯加利福尼亞大學的微生物學專業。
我在生物化學實驗室做了大約四年的生物化學研究，並且我[確實發表了一篇研究論文](https://www.sciencedirect.com/science/article/pii/)。
它實際上是在糖蛋白上，特別是一種叫做“皮質顆粒凝集素”的東西。我們使用青蛙，因爲它們會產生大量的蛋，我們可以從中提取蛋白質。
這種蛋白質可以防止多精症。當精子進入卵子時，卵子會向細胞膜釋放一種糖蛋白，即皮質顆粒凝集素，並阻止任何其他精子進入卵子。

<!--
**CRAIG BOX: Were you able to take anything from the testing that we did on frogs and generalize that to higher-order mammals, perhaps?**

REY LEJANO: Yes. Since mammals also have cortical granule lectin, we were able to analyze both the convergence and the evolutionary pattern, not just from multiple species of frogs, but also into mammals as well.
-->
**CRAIG BOX：你是否能夠從我們對青蛙進行的測試中汲取任何東西並將其推廣到更高階的哺乳動物？**

REY LEJANO：是的。由於哺乳動物也有皮質顆粒凝集素，我們能夠分析收斂和進化模式，不僅來自多種青蛙，還包括哺乳動物。

<!--
**CRAIG BOX: Now, there's a couple of different threads to unravel here. When you were young, what led you into the fields of biology, and perhaps more the technical side of it?**

REY LEJANO: I think it was mostly from family, since I do have a family history in the medical field that goes back generations. So I kind of felt like that was the natural path going into college.
-->
**CRAIG BOX：現在，這裏有幾個不同的線索需要解開。當你年輕的時候，是什麼引導你進入生物學領域，可以側重介紹技術方面的內容嗎？**

REY LEJANO：我認爲這主要來自家庭，因爲我在醫學領域確實有可以追溯到幾代人的家族史。所以我覺得那是進入大學的自然路徑。

<!--
**CRAIG BOX: Now, of course, you're working in a more abstract tech field. What led you out of microbiology?**

REY LEJANO: [CHUCKLES] Well, I've always been interested in tech. Taught myself a little programming when I was younger, before high school, did some web dev stuff. Just kind of got burnt out being in a lab. I was literally in the basement. I had a great opportunity to join a consultancy that specialized in [ITIL](https://www.axelos.com/certifications/itil-service-management/what-is-itil). I actually started off with application performance management, went into monitoring, went into operation management and also ITIL, which is aligning your IT asset management and service managements with business services. Did that for a good number of years, actually.
-->
**CRAIG BOX：現在，你正在一個更抽象的技術領域工作。是什麼讓你離開了微生物學？**

REY LEJANO：[笑]嗯，我一直對科技很感興趣。我年輕的時候自學了一點編程，在高中之前，做了一些網路開發的東西。
只是在實驗室裏有點焦頭爛額了，實際上是在地下室。我有一個很好的機會加入了一家專門從事 [ITIL](https://www.axelos.com/certifications/itil-service-management/what-is-itil) 
的諮詢公司。實際上，我從應用性能管理開始，進入監控，進入運營管理和 ITIL，也就是把你的 IT 資產管理和服務管理與商業服務結合起來。實際上，我在這方面做了很多年。

<!--
**CRAIG BOX: It's very interesting, as people describe the things that they went through and perhaps the technologies that they worked on, you can pretty much pinpoint how old they might be. There's a lot of people who come into tech these days that have never heard of ITIL. They have no idea what it is. It's basically just SRE with more process.**

REY LEJANO: Yes, absolutely. It's not very cloud native. [CHUCKLES]
-->
**CRAIG BOX：這很有趣，當人們描述他們所經歷的事情以及他們所從事的技術時，你幾乎可以確定他們的年齡。
現在有很多人進入科技行業，但從未聽說過 ITIL。他們不知道那是什麼。它基本上和 SRE 類似，只是過程更加複雜。**

REY LEJANO：是的，一點沒錯。它不是非常雲原生的。[笑]

<!--
**CRAIG BOX: Not at all.**

REY LEJANO: You don't really hear about it in the cloud native landscape. Definitely, you can tell someone's been in the field for a little bit, if they specialize or have worked with ITIL before.
-->
**CRAIG BOX：一點也不。**

REY LEJANO：在雲原生環境中，你並沒有真正聽說過它。毫無疑問，如果有人專門從事過 ITIL 工作或之前曾與 ITIL 合作過，你肯定可以看出他們已經在該領域工作了一段時間。

<!--
**CRAIG BOX: You mentioned that you wanted to get out of the basement. That is quite often where people put the programmers. Did they just give you a bit of light in the new basement?**

REY LEJANO: [LAUGHS] They did give us much better lighting. Able to get some vitamin D sometimes, as well.
-->
**CRAIG BOX：你提到你想離開地下室。這的確是程式員常待的地方。他們只是在新的地下室裏給了你一點光嗎？**

REY LEJANO：[笑]他們確實給了我們更好的照明。有時也能獲得一些維生素 D。

<!--
**CRAIG BOX: To wrap up the discussion about your previous career — over the course of the last year, with all of the things that have happened in the world, I could imagine that microbiology skills may be more in demand than perhaps they were when you studied them?**

REY LEJANO: Oh, absolutely. I could definitely see a big increase of numbers of people going into the field. Also, reading what's going on with the world currently kind of brings back all the education I've learned in the past, as well.
-->
**CRAIG BOX：總結一下你的過往職業經歷：在過去的一年裏，隨着全球各地的發展變化，我認爲如今微生物學技能可能比你在校時更受歡迎？**

REY LEJANO：哦，當然。我肯定能看到進入這個領域的人數大增。此外，閱讀當前世界正在發生的事情也會帶回我過去所學的所有教育。

<!--
**CRAIG BOX: Do you keep in touch with people you went through school with?**

REY LEJANO: Just some close friends, but not in the microbiology field.
-->
**CRAIG BOX：你和當時的同學還在保持聯繫嗎？**

REY LEJANO：只是一些親密的朋友，但不是在微生物學領域。

<!--
**CRAIG BOX: One thing that I think will probably happen as a result of the pandemic is a renewed interest in some of these STEM fields. It will be interesting to see what impact that has on society at large.**

REY LEJANO: Yeah. I think that'll be great.
-->
**CRAIG BOX：我認爲，這次的全球疫情可能讓人們對科學、技術、工程和數學領域重新產生興趣。
看看這對整個社會有什麼影響，將是很有趣的。**

REY LEJANO：是的。我認爲那會很棒。

<!--
**CRAIG BOX: You mentioned working at a consultancy doing IT management, application performance monitoring, and so on. When did Kubernetes come into your professional life?**

REY LEJANO: One of my good friends at the company I worked at, left in mid-2015. He went on to a company that was pretty heavily into Docker. He taught me a little bit. I did my first "docker run" around 2015, maybe 2016. Then, one of the applications we were using for the ITIL framework was containerized around 2018 or so, also in Kubernetes. At that time, it was pretty buggy. That was my initial introduction to Kubernetes and containerised applications.
-->
**CRAIG BOX：你提到在一家諮詢公司工作，從事 IT 管理、應用程式性能監控等工作。Kubernetes 是什麼時候進入你的職業生涯的？**

REY LEJANO：在我工作的公司，我的一位好朋友于 2015 年年中離職。他去了一家非常熱衷於 Docker 的公司。
他教了我一點東西。我在 2015 年左右，也許是 2016 年，做了我的第一次 “docker run”。
然後，我們用於 ITIL 框架的一個應用程式在 2018 年左右被容器化了，也在 Kubernetes 中。
那個時候，它是有些問題的。那是我第一次接觸 Kubernetes 和容器化應用程式。

<!--
Then I left that company, and I actually joined my friend over at [RX-M](https://rx-m.com/), which is a cloud native consultancy and training firm. They specialize in Docker and Kubernetes. I was able to get my feet wet. I got my CKD, got my CKA as well. And they were really, really great at encouraging us to learn more about Kubernetes and also to be involved in the community.

**CRAIG BOX: You will have seen, then, the life cycle of people adopting Kubernetes and containerization at large, through your own initial journey and then through helping customers. How would you characterize how that journey has changed from the early days to perhaps today?**
-->
然後我離開了那家公司，實際上我加入了我在 [RX-M](https://rx-m.com/) 的朋友，這是一家雲原生諮詢和培訓公司。
他們專門從事 Docker 和 Kubernetes 的工作。我能夠讓我腳踏實地。我拿到了 CKD 和 CKA 證書。
他們在鼓勵我們學習更多關於 Kubernetes 的知識和參與社區活動方面真的非常棒。

**CRAIG BOX：然後，你將看到人們採用 Kubernetes 和容器化的整個生命週期，通過你自己的初始旅程，然後通過幫助客戶。你如何描述這段旅程從早期到今天的變化？**

<!--
REY LEJANO: I think the early days, there was a lot of questions of, why do I have to containerize? Why can't I just stay with virtual machines?

**CRAIG BOX: It's a line item on your CV.**
-->
REY LEJANO：我認爲早期有很多問題，爲什麼我必須容器化？爲什麼我不能只使用虛擬機？

**CRAIG BOX：這是你的簡歷上的一個條目。**

<!--
REY LEJANO: [CHUCKLES] It is. And nowadays, I think people know the value of using containers, of orchestrating containers with Kubernetes. I don't want to say "jumping on the bandwagon", but it's become the de-facto standard to orchestrate containers.

**CRAIG BOX: It's not something that a consultancy needs to go out and pitch to customers that they should be doing. They're just taking it as, that will happen, and starting a bit further down the path, perhaps.**

REY LEJANO: Absolutely.
-->
REY LEJANO：[笑]是的。現在，我認爲人們知道使用容器的價值，以及使用 Kubernetes 編排容器的價值。我不想說“趕上潮流”，但它已經成爲編排容器的事實標準。

**CRAIG BOX：這不是諮詢公司需要走出去向客戶推銷他們應該做的事情。他們只是把它當作會發生的事情，並開始在這條路上走得更遠一些，也許。**

REY LEJANO：當然。

<!--
**CRAIG BOX: Working at a consultancy like that, how much time do you get to work on improving process, perhaps for multiple customers, and then looking at how you can upstream that work, versus paid work that you do for just an individual customer at a time?**
-->
**CRAIG BOX：在這樣的諮詢公司工作，你有多少時間致力於改善流程，也許是爲多個客戶，然後研究如何將這項工作推向上游，而不是每次只爲單個客戶做有償工作？**


<!--
REY LEJANO: Back then, it would vary. They helped me introduce myself, and I learned a lot about the cloud native landscape and Kubernetes itself. They helped educate me as to how the cloud native landscape, and the tools around it, can be used together. My boss at that company, Randy, he actually encouraged us to start contributing upstream, and encouraged me to join the release team. He just said, this is a great opportunity. Definitely helped me with starting with the contributions early on.
-->
REY LEJANO：那時，情況會有所不同。他們幫我介紹了自己，我也瞭解了很多關於雲原生環境和 Kubernetes 本身的情況。
他們幫助我瞭解如何將雲原生環境及其周圍的工具一起使用。我在那家公司的老闆，Randy，實際上他鼓勵我們開始向上遊做貢獻，
並鼓勵我加入發佈團隊。他只是說，這是個很好的機會。這對我在早期就開始做貢獻有很大的幫助。

<!--
**CRAIG BOX: Was the release team the way that you got involved with upstream Kubernetes contribution?**

REY LEJANO: Actually, no. My first contribution was  with SIG Docs. I met Taylor Dolezal — he was the release team lead for 1.19, but he is involved with SIG Docs as well. I met him at KubeCon 2019, I sat at his table during a luncheon. I remember Paris Pittman was hosting this luncheon at the Marriott. Taylor says he was involved with SIG Docs. He encouraged me to join. I started joining into meetings, started doing a few drive-by PRs. That's what we call them — drive-by — little typo fixes. Then did a little bit more, started to send better or higher quality pull requests, and also reviewing PRs.
-->
**CRAIG BOX：發佈團隊是你參與上游 Kubernetes 貢獻的方式嗎？**

REY LEJANO：實際上，沒有。我的第一個貢獻是 SIG Docs。我認識了 Taylor Dolezal——他是 1.19 的發佈團隊負責人，但他也參與了 SIG Docs。
我在 KubeCon 2019 遇到了他，在午餐時我坐在他的桌子旁。我記得 Paris Pittman 在萬豪酒店主持了這次午餐會。
Taylor 說他參與了 SIG Docs。他鼓勵我加入。我開始參加會議，開始做一些路過式的 PR。
這就是我們所說的 - 驅動式 - 小錯字修復。然後做更多的事情，開始發送更好或更高質量的拉取請求，並審查 PR。

<!--
**CRAIG BOX: When did you first formally take your release team role?**

REY LEJANO: That was in [1.18](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.18/release_team.md), in December. My boss at the time encouraged me to apply. I did, was lucky enough to get accepted for the release notes shadow. Then from there, stayed in with release notes for a few cycles, then went into Docs, naturally then led Docs, then went to Enhancements, and now I'm the release lead for 1.23.
-->
**CRAIG BOX：你第一次正式擔任發佈團隊的角色是什麼時候？**

REY LEJANO：那是在 12月的 [1.18](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.18/release_team.md)。
當時我的老闆鼓勵我去申請。我申請了，很幸運地被錄取了，成爲發佈說明的影子。然後從那裏開始，我在發佈說明中呆了幾個週期，
然後去了文檔，自然而然地領導了文檔，然後去了增強版，現在我是 1.23 的發行負責人。

<!--
**CRAIG BOX: I don't know that a lot of people think about what goes into a good release note. What would you say does?**

REY LEJANO: [CHUCKLES] You have to tell the end user what has changed or what effect that they might see in the release notes. It doesn't have to be highly technical. It could just be a few lines, and just saying what has changed, what they have to do if they have to do anything as well.
-->
**CRAIG BOX：我不知道很多人都會考慮到一個好的發行說明需要什麼。你說什麼纔是呢？**

REY LEJANO：[笑]你必須告訴最終使用者發生了什麼變化，或者他們在發行說明中可能看到什麼效果。
它不必是高度技術性的。它可以只是幾行字，只是說有什麼變化，如果他們也必須做任何事情，他們必須做什麼。

<!--
**CRAIG BOX: As you moved through the process of shadowing, how did you learn from the people who were leading those roles?**

REY LEJANO: I said this a few times when I was the release lead for this cycle. You get out of the release team as much as you put in, or it directly aligns to how much you put in. I learned a lot. I went into the release team having that mindset of learning from the role leads, learning from the other shadows, as well. That's actually a saying that my first role lead told me. I still carry it to heart, and that was back in 1.18. That was Eddie, in the very first meeting we had, and I still carry it to heart.
-->
**CRAIG BOX：我不知道很多人會考慮一個好的發佈說明的內容。你會說什麼？**

REY LEJANO：當我是這個週期的發佈負責人時，我說過幾次。你從發佈團隊得到的東西和你投入的東西一樣多，或者說它直接與你投入的東西相一致。
我學到了很多東西。我在進入發佈團隊時就有這樣的心態：向角色領導學習，也向其他影子學習。
這實際上是我的第一個角色負責人告訴我的一句話。我仍然銘記於心，那是在 1.18 中。那是 Eddie，在我們第一次見面時，我仍然牢記在心。

<!--
**CRAIG BOX: You, of course, were [the release lead for 1.23](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.23). First of all, congratulations on the release.**

REY LEJANO: Thank you very much.
-->
**CRAIG BOX：當然，你是 [1.23 的發佈負責人](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.23)。首先，祝賀發佈。**

REY LEJANO：非常感謝。

<!--
**CRAIG BOX: The theme for this release is [The Next Frontier](https://kubernetes.io/blog/2021/12/07/kubernetes-1-23-release-announcement/). Tell me the story of how we came to the theme and then the logo.**

REY LEJANO: The Next Frontier represents a few things. It not only represents the next enhancements in this release, but Kubernetes itself also has a history of Star Trek references. The original codename for Kubernetes was Project Seven, a reference to Seven of Nine, originally from Star Trek Voyager. Also the seven spokes in the helm in the logo of Kubernetes as well. And, of course, Borg, the predecessor to Kubernetes.
-->
**CRAIG BOX：這個版本的主題是[最後戰線](https://kubernetes.io/blog/2021/12/07/kubernetes-1-23-release-announcement/)。
請告訴我我們是如何確定主題和標誌的故事。**

REY LEJANO：最後戰線代表了幾件事。它不僅代表了此版本的下一個增強功能，而且 Kubernetes 本身也有《星際迷航》的參考歷史。
Kubernetes 的原始代號是 Project Seven，指的是最初來自《星際迷航》中的 Seven of Nine。
在 Kubernetes 的 logo 中掌舵的七根輻條也是如此。當然，還有 Kubernetes 的前身 Borg。

<!--
The Next Frontier continues that Star Trek reference. It's a fusion of two titles in the Star Trek universe. One is [Star Trek V, the Final Frontier](https://en.wikipedia.org/wiki/Star_Trek_V:_The_Final_Frontier), and the Star Trek: The Next Generation.
-->
最後戰線繼續星際迷航參考。這是星際迷航宇宙中兩個標題的融合。一個是[星際迷航 5：最後戰線](https://en.wikipedia.org/wiki/Star_Trek_V:_The_Final_Frontier)，還有星際迷航：下一代。

<!--
**CRAIG BOX: Do you have any opinion on the fact that Star Trek V was an odd-numbered movie, and they are [canonically referred to as being lesser than the even-numbered ones](https://screenrant.com/star-trek-movies-odd-number-curse-explained/)?**

REY LEJANO: I can't say, because I am such a sci-fi nerd that I love all of them even though they're bad. Even the post-Next Generation movies, after the series, I still liked all of them, even though I know some weren't that great.
-->
**CRAIG BOX：你對《星際迷航 5》是一部奇數電影有什麼看法，而且它們[通常被稱爲比偶數電影票房少](https://screenrant.com/star-trek-movies-odd-number-curse-explained/)？**

REY LEJANO：我不能說，因爲我是一個科幻書呆子，我喜歡他們所有的人，儘管他們很糟糕。即使是《下一代》系列之後的電影，我仍然喜歡所有的電影，儘管我知道有些並不那麼好。

<!--
**CRAIG BOX: Am I right in remembering that Star Trek V was the one directed by William Shatner?**

REY LEJANO: Yes, that is correct.
-->
**CRAIG BOX：我記得星際迷航 5 是由 William Shatner 執導對嗎？**

REY LEJANO：是的，對的。

<!--
**CRAIG BOX: I think that says it all.**

REY LEJANO: [CHUCKLES] Yes.
-->
**CRAIG BOX：我認爲這說明了一切。**

REY LEJANO：[笑]是的。

<!--
**CRAIG BOX: Now, I understand that the theme comes from a part of the [SIG Release charter](https://github.com/kubernetes/community/blob/master/sig-release/charter.md)?**

REY LEJANO: Yes. There's a line in the SIG Release charter, "ensure there is a consistent group of community members in place to support the release process across time." With the release team, we have new shadows that join every single release cycle. With this, we're growing with this community. We're growing the release team members. We're growing SIG Release. We're growing the Kubernetes community itself. For a lot of people, this is their first time contributing to open source, so that's why I say it's their new open source frontier.
-->
**CRAIG BOX：現在，我明白了，主題來自於 [SIG 發佈章程](https://github.com/kubernetes/community/blob/master/sig-release/charter.md)？**

REY LEJANO：是的。SIG 發佈章程中有一句話，“確保有一個一致的社區成員小組來支持不同時期的發佈過程。”
在發佈團隊中，我們每一個發佈週期都有新的影子加入。有了這個，我們與這個社區一起成長。我們正在壯大發布團隊的成員。
我們正在增加 SIG 版本。我們正在發展 Kubernetes 社區本身。對於很多人來說，這是他們第一次爲開源做出貢獻，所以我說這是他們新的開源前沿。

<!--
**CRAIG BOX: And the logo is obviously very Star Trek-inspired. It sort of surprised me that it took that long for someone to go this route.**

REY LEJANO: I was very surprised as well. I had to relearn Adobe Illustrator to create the logo.
-->
**CRAIG BOX：而這個標誌顯然是受《星際迷航》的啓發。讓我感到驚訝的是，花了那麼長時間纔有人走這條路**

REY LEJANO：我也很驚訝。我不得不重新學習 Adobe Illustrator 來創建標誌。

<!--
**CRAIG BOX: This your own work, is it?**

REY LEJANO: This is my own work.
-->
**CRAIG BOX：這是你自己的作品，是嗎？**

REY LEJANO：這是我自己的作品。

<!--
**CRAIG BOX: It's very nice.**

REY LEJANO: Thank you very much. Funny, the galaxy actually took me the longest time versus the ship. Took me a few days to get that correct. I'm always fine-tuning it, so there might be a final change when this is actually released.
-->
**CRAIG BOX：非常好。**

REY LEJANO：謝謝。有趣的是，相對於飛船，銀河系實際上花了我最長的時間。我花了幾天時間才把它弄正確。
我一直在對它進行微調，所以在真正發佈時可能會有最後的改變。

<!--
**CRAIG BOX: No frontier is ever truly final.**

REY LEJANO: True, very true.
-->
**CRAIG BOX：沒有邊界是真正的終結。**

REY LEJANO：是的，非常正確。

<!--
**CRAIG BOX: Moving now from the theme of the release to the substance, perhaps, what is new in 1.23?**

REY LEJANO: We have 47 enhancements. I'm going to run through most of the stable ones, if not all of them, some of the key Beta ones, and a few of the Alpha enhancements for 1.23.
-->
**CRAIG BOX：現在從發佈的主題轉到實質內容，也許，1.23 中有什麼新內容？**

REY LEJANO：我們有 47 項增強功能。我將運行大部分穩定的，甚至全部的，一些關鍵的 Beta 版，以及一些 1.23 版的 Alpha 增強。

<!--
One of the key enhancements is [dual-stack IPv4/IPv6](https://github.com/kubernetes/enhancements/issues/563), which went GA in 1.23.

Some background info: dual-stack was introduced as Alpha in 1.15. You probably saw a keynote at KubeCon 2019. Back then, the way dual-stack worked was that you needed two services — you needed a service per IP family. You would need a service for IPv4 and a service for IPv6. It was refactored in 1.20. In 1.21, it was in Beta; clusters were enabled to be dual-stack by default.
-->
其中一個關鍵的改進是[雙堆棧 IPv4/IPv6](https://github.com/kubernetes/enhancements/issues/563)，它在 1.23 版本中採用了 GA。

一些背景資訊：雙堆棧在 1.15 中作爲 Alpha 引入。你可能在 KubeCon 2019 上看到了一個主題演講。
那時，雙棧的工作方式是，你需要兩個服務--你需要每個IP家族的服務。你需要一個用於 IPv4 的服務和一個用於 IPv6 的服務。
它在 1.20 版本中被重構了。在 1.21 版本中，它處於測試階段；預設情況下，叢集被啓用爲雙堆棧。

<!--
And then in 1.23 we did remove the IPv6 dual-stack feature flag. It's not mandatory to use dual-stack. It's actually not "default" still. The pods, the services still default to single-stack. There are some requirements to be able to use dual-stack. The nodes have to be routable on IPv4 and IPv6 network interfaces. You need a CNI plugin that supports dual-stack. The pods themselves have to be configured to be dual-stack. And the services need the ipFamilyPolicy field to specify prefer dual-stack, or require dual-stack.
-->
然後在 1.23 版本中，我們確實刪除了 IPv6 雙棧功能標誌。這不是強制性的使用雙棧。它實際上仍然不是 "預設"的。
Pod，服務仍然預設爲單棧。要使用雙棧，有一些要求。節點必須可以在 IPv4 和 IPv6 網路介面上進行路由。
你需要一個支持雙棧的 CNI 插件。Pod 本身必須被設定爲雙棧。而服務需要 ipFamilyPolicy 字段來指定喜歡雙棧或要求雙棧。


<!--
**CRAIG BOX: This sounds like there's an implication in this that v4 is still required. Do you see a world where we can actually move to v6-only clusters?**

REY LEJANO: I think we'll be talking about IPv4 and IPv6 for many, many years to come. I remember a long time ago, they kept saying "it's going to be all IPv6", and that was decades ago.
-->
**CRAIG BOX：這聽起來暗示仍然需要 v4。你是否看到了一個我們實際上可以轉移到僅有 v6 的叢集的世界？？**

REY LEJANO：我認爲在未來很多很多年裏，我們都會談論 IPv4 和 IPv6。我記得很久以前，他們一直在說 "這將全部是 IPv6"，而那是幾十年前的事了。

<!--
**CRAIG BOX: I think I may have mentioned on the show before, but there was [a meeting in London that Vint Cerf attended](https://www.youtube.com/watch?v=AEaJtZVimqs), and he gave a public presentation at the time to say, now is the time of v6. And that was 10 years ago at least. It's still not the time of v6, and my desktop still doesn't have Linux on it. One day.**

REY LEJANO: [LAUGHS] In my opinion, that's one of the big key features that went stable for 1.23.
-->
**CRAIG BOX：我想我之前可能在節目中提到過，Vint Cerf [在倫敦參加了一個會議](https://www.youtube.com/watch?v=AEaJtZVimqs)，
他當時做了一個公開演講說，現在是v6的時代了。那是至少 10 年前的事了。現在還不是 v6 的時代，我的電腦桌面上還沒有一天擁有 Linux。**

REY LEJANO：[笑]在我看來，這是 1.23 版穩定的一大關鍵功能。

<!--
One of the other highlights of 1.23 is [pod security admission going to Beta](/blog/2021/12/09/pod-security-admission-beta/). I know this feature is going to Beta, but I highlight this because as some people might know, PodSecurityPolicy, which was deprecated in 1.21, is targeted to be removed in 1.25. Pod security admission replaces pod security policy. It's an admission controller. It evaluates the pods against a predefined set of pod security standards to either admit or deny the pod for running.

There's three levels of pod security standards. Privileged, that's totally open. Baseline, known privileges escalations are minimized. Or Restricted, which is hardened. And you could set pod security standards either to run in three modes, which is enforce: reject any pods that are in violation; to audit: pods are allowed to be created, but the violations are recorded; or warn: it will send a warning message to the user, and the pod is allowed.
-->
1.23 版的另一個亮點是 [Pod 安全許可進入 Beta 版](/blog/2021/12/09/pod-security-admission-beta/)。
我知道這個功能將進入 Beta 版，但我強調這一點是因爲有些人可能知道，PodSecurityPolicy 在 1.21 版本中被廢棄，目標是在 1.25 版本中被移除。
Pod 安全接納取代了 Pod 安全策略。它是一個准入控制器。它根據預定義的 Pod 安全標準集對 Pod 進行評估，以接納或拒絕 Pod 的運行。

Pod 安全標準分爲三個級別。特權，這是完全開放的。基線，已知的特權升級被最小化。或者 限制級，這是強化的。而且你可以將 Pod 安全標準設置爲以三種模式運行，
即強制：拒絕任何違規的 Pod；審計：允許創建 Pod，但記錄違規行爲；或警告：它會向使用者發送警告消息，並且允許該 Pod。

<!--
**CRAIG BOX: You mentioned there that PodSecurityPolicy is due to be deprecated in two releases' time. Are we lining up these features so that pod security admission will be GA at that time?**

REY LEJANO: Yes. Absolutely. I'll talk about that for another feature in a little bit as well. There's also another feature that went to GA. It was an API that went to GA, and therefore the Beta API is now deprecated. I'll talk about that a little bit.
-->
**CRAIG BOX：你提到 PodSecurityPolicy 將在兩個版本的時間內被棄用。我們是否對這些功能進行了排列，以便屆時 Pod 安全接納將成爲 GA？**

REY LEJANO：是的。當然可以。我稍後也會爲另一個功能談談這個問題。還有另一個功能也進入了 GA。這是一個歸入 GA 的 API，
因此 Beta 版的 API 現在被廢棄了。我稍稍講一下這個問題。

<!--
**CRAIG BOX: All right. Let's talk about what's next on the list.**

REY LEJANO: Let's move on to more stable enhancements. One is the [TTL controller](https://github.com/kubernetes/enhancements/issues/592). This cleans up jobs and pods after the jobs are finished. There is a TTL timer that starts when the job or pod is finished. This TTL controller watches all the jobs, and ttlSecondsAfterFinished needs to be set. The controller will see if the ttlSecondsAfterFinished, combined with the last transition time, if it's greater than now. If it is, then it will delete the job and the pods of that job.
-->
**CRAIG BOX：好吧。讓我們來談談名單上的下一個問題。**

REY LEJANO：讓我們繼續討論更穩定的增強功能。一種是 [TTL 控制器](https://github.com/kubernetes/enhancements/issues/592)。
它在作業完成後清理作業和 Pod。有一個 TTL 計時器在作業或 Pod 完成後開始計時。此 TTL 控制器監視所有作業，
並且需要設置 ttlSecondsAfterFinished。該控制器將查看 ttlSecondsAfterFinished，結合最後的過渡時間，如果它大於現在。
如果是，那麼它將刪除該作業和該作業的 Pod。

<!--
**CRAIG BOX: Loosely, it could be called a garbage collector?**

REY LEJANO: Yes. Garbage collector for pods and jobs, or jobs and pods.
-->
**CRAIG BOX：粗略地說，它可以稱爲垃圾收集器嗎？**

REY LEJANO：是的。用於 Pod 和作業，或作業和 Pod 的垃圾收集器。

<!--
**CRAIG BOX: If Kubernetes is truly becoming a programming language, it of course has to have a garbage collector implemented.**

REY LEJANO: Yeah. There's another one, too, coming in Alpha. [CHUCKLES]
-->
**CRAIG BOX：如果 Kubernetes 真正成爲一種編程語言，它當然必須實現垃圾收集器。**

REY LEJANO：是的。還有另一個，也將在 Alpha 中出現。[笑]

<!--
**CRAIG BOX: Tell me about that.**

REY LEJANO: That one is coming in in Alpha. It's actually one of my favorite features, because there's only a few that I'm going to highlight today. [PVCs for StafeulSet will be cleaned up](https://github.com/kubernetes/enhancements/issues/1847). It will auto-delete PVCs created by StatefulSets, when you delete that StatefulSet.
-->
**CRAIG BOX：告訴我。**

REY LEJANO： 那個是在 Alpha 中出現的。這實際上是我最喜歡的功能之一，今天我只想強調幾個。
[StafeulSet 的 PVC 將被清理](https://github.com/kubernetes/enhancements/issues/1847)。
當你刪除那個 StatefulSet 時，它將自動刪除由 StatefulSets 創建的 PVC。


<!--
**CRAIG BOX: What's next on our tour of stable features?**

REY LEJANO: Next one is, [skip volume ownership change goes to stable](https://github.com/kubernetes/enhancements/issues/695). This is from SIG Storage. There are times when you're running a stateful application, like many databases, they're sensitive to permission bits changing underneath. Currently, when a volume is bind mounted inside the container, the permissions of that volume will change recursively. It might take a really long time.
-->
**CRAIG BOX：我們的穩定功能之旅的下一步是什麼？**

REY LEJANO：下一個是，[跳過卷所有權更改進入穩定狀態](https://github.com/kubernetes/enhancements/issues/695)。
這是來自 SIG 儲存。有的時候，當你運行一個有狀態的應用程式時，就像許多資料庫一樣，它們對下面的權限位變化很敏感。
目前，當一個卷被綁定安裝在容器內時，該卷的權限將遞歸更改。這可能需要很長時間。
-->

<!--
Now, there's a field, the fsGroupChangePolicy, which allows you, as a user, to tell Kubernetes how you want the permission and ownership change for that volume to happen. You can set it to always, to always change permissions, or just on mismatch, to only do it when the permission ownership changes at the top level is different from what is expected.
-->
現在，有一個字段，即 fsGroupChangePolicy，它允許你作爲使用者告訴 Kubernetes 你希望如何更改該卷的權限和所有權。
你可以將其設置爲總是、始終更改權限，或者只是在不匹配的情況下，只在頂層的權限所有權變化與預期不同的情況下進行。

<!--
**CRAIG BOX: It does feel like a lot of these enhancements came from a very particular use case where someone said, "hey, this didn't work for me and I've plumbed in a feature that works with exactly the thing I need to have".**

REY LEJANO: Absolutely. People create issues for these, then create Kubernetes enhancement proposals, and then get targeted for releases.
-->
**CRAIG BOX：確實感覺很多這些增強功能都來自一個非常特殊的用例，有人說，“嘿，這對我來說不起作用，我已經研究了一個功能，它可以完全滿足我需要的東西”**

REY LEJANO：當然可以。人們爲這些問題創建問題，然後創建 Kubernetes 增強提案，然後被列爲發佈目標。

<!--
**CRAIG BOX: Another GA feature in this release — ephemeral volumes.**

REY LEJANO: We've always been able to use empty dir for ephemeral volumes, but now we could actually have [ephemeral inline volumes](https://github.com/kubernetes/enhancements/issues/1698), meaning that you could take your standard CSI driver and be able to use ephemeral volumes with it.
-->
**CRAIG BOX：此版本中的另一個 GA 功能--臨時卷。**

REY LEJANO：我們一直能夠將空目錄用於臨時卷，但現在我們實際上可以擁有[臨時內聯卷] (https://github.com/kubernetes/enhancements/issues/1698)，
這意味着你可以使用標準 CSI 驅動程式並能夠與它一起使用臨時卷。

<!--
**CRAIG BOX: And, a long time coming, [CronJobs](https://github.com/kubernetes/enhancements/issues/19).**

REY LEJANO: CronJobs is a funny one, because it was stable before 1.23. For 1.23, it was still tracked,but it was just cleaning up some of the old controller. With CronJobs, there's a v2 controller. What was cleaned up in 1.23 is just the old v1 controller.
-->
**CRAIG BOX：而且，很長一段時間，[CronJobs](https://github.com/kubernetes/enhancements/issues/19)。**

REY LEJANO：CronJobs 很有趣，因爲它在 1.23 之前是穩定的。對於 1.23，它仍然被跟蹤，但它只是清理了一些舊控制器。
使用 CronJobs，有一個 v2 控制器。1.23 中清理的只是舊的 v1 控制器。

<!--
**CRAIG BOX: Were there any other duplications or major cleanups of note in this release?**

REY LEJANO: Yeah. There were a few you might see in the major themes. One's a little tricky, around FlexVolumes. This is one of the efforts from SIG Storage. They have an effort to migrate in-tree plugins to CSI drivers. This is a little tricky, because FlexVolumes were actually deprecated in November 2020. We're [formally announcing it in 1.23](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors).
-->
**CRAIG BOX：在這個版本中，是否有任何其他的重複或重大的清理工作值得注意？**

REY LEJANO：是的。有幾個你可能會在主要的主題中看到。其中一個有點棘手，圍繞 FlexVolumes。這是 SIG 儲存公司的努力之一。
他們正在努力將樹內插件遷移到 CSI 驅動。這有點棘手，因爲 FlexVolumes 實際上是在 2020 年 11 月被廢棄的。我們
[在 1.23 中正式宣佈](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)。

<!--
**CRAIG BOX: FlexVolumes, in my mind, predate CSI as a concept. So it's about time to get rid of them.**

REY LEJANO: Yes, it is. There's another deprecation, just some [klog specific flags](https://kubernetes.io/docs/concepts/cluster-administration/system-logs/#klog), but other than that, there are no other big deprecations in 1.23.
-->
**CRAIG BOX：在我看來，FlexVolumes 比 CSI 這個概念還要早。所以現在是時候擺脫它們了。**

REY LEJANO：是的。還有另一個棄用，只是一些 [klog 特定標誌](https://kubernetes.io/docs/concepts/cluster-administration/system-logs/#klog)，但除此之外，1.23 中沒有其他大的棄用。

<!--
**CRAIG BOX: The buzzword of the last KubeCon, and in some ways the theme of the last 12 months, has been secure software supply chain. What work is Kubernetes doing to improve in this area?**

REY LEJANO: For 1.23, Kubernetes is now SLSA compliant at Level 1, which means that provenance attestation files that describe the staging and release phases of the release process are satisfactory for the SLSA framework.
-->
**CRAIG BOX：上一屆 KubeCon 的流行語，在某種程度上也是過去 12 個月的主題，是安全的軟體供應鏈。Kubernetes 在這一領域做了哪些改進工作？**

REY LEJANO：對於 1.23 版本，Kubernetes 現在符合 SLSA 的 1 級標準，這意味着描述發佈過程中分期和發佈階段的證明檔案對於 SLSA 框架來說是令人滿意的。

<!--
**CRAIG BOX: What needs to happen to step up to further levels?**

REY LEJANO: Level 1 means a few things — that the build is scripted; that the provenance is available, meaning that the artifacts are verified and they're handed over from one phase to the next; and describes how the artifact is produced. Level 2 means that the source is version-controlled, which it is, provenance is authenticated, provenance is service-generated, and there is a build service. There are four levels of SLSA compliance.
-->
**CRAIG BOX：需要做什麼才能提升到更高的水平？**

REY LEJANO：級別 1 意味着一些事情——構建是腳本化的；出處是可用的，這意味着工件是經過驗證，並且已從一個階段移交到下一個階段；
並描述了工件是如何產生的。級別 2 意味着源是受版本控制的，也就是說，源是經過身份驗證的，源是服務生成的，並且存在構建服務。SLSA 的合規性分爲四個級別。

<!--
**CRAIG BOX: It does seem like the levels were largely influenced by what it takes to build a big, secure project like this. It doesn't seem like it will take a lot of extra work to move up to verifiable provenance, for example. There's probably just a few lines of script required to meet many of those requirements.**

REY LEJANO: Absolutely. I feel like we're almost there; we'll see what will come out of 1.24. And I do want to give a big shout-out to SIG Release and Release Engineering, primarily to Adolfo García Veytia, who is aka Puerco on GitHub and on Slack. He's been driving this forward.
-->
**CRAIG BOX：看起來這些水平在很大程度上受到了建立這樣一個大型安全項目的影響。例如，似乎不需要很多額外的工作來提升到可驗證的出處。
可能只需要幾行腳本即可滿足其中許多要求。**

REY LEJANO：當然。我覺得我們就快成功了；我們會看到 1.24 版本會出現什麼。我確實想對 SIG 發佈和發佈工程部大加讚賞，
主要是 Adolfo García Veytia，他在 GitHub 和 Slack 上又名 Puerco。 他一直在推動這一進程。

<!--
**CRAIG BOX: You've mentioned some APIs that are being graduated in time to replace their deprecated version. Tell me about the new HPA API.**

REY LEJANO: The [horizontal pod autoscaler v2 API](https://github.com/kubernetes/enhancements/issues/2702), is now stable, which means that the v2beta2 API is deprecated. Just for everyone's knowledge, the v1 API is not being deprecated. The difference is that v2 adds support for multiple and custom metrics to be used for HPA.
-->
**CRAIG BOX：你提到了一些 API 正在及時升級以替換其已棄用的版本。告訴我有關新 HPA API 的資訊。**

REY LEJANO：[horizontal pod autoscaler v2 API](https://github.com/kubernetes/enhancements/issues/2702)，
現已穩定，這意味着 v2beta2 API 已棄用。衆所周知，v1 API 並未被棄用。不同之處在於 v2 添加了對用於 HPA 的多個和自定義指標的支持。

<!--
**CRAIG BOX: There's also now a facility to validate my CRDs with an expression language.**

REY LEJANO: Yeah. You can use the [Common Expression Language, or CEL](https://github.com/google/cel-spec), to validate your CRDs, so you no longer need to use webhooks. This also makes the CRDs more self-contained and declarative, because the rules are now kept within the CRD object definition.
-->
**CRAIG BOX：現在還可以使用表達式語言驗證我的 CRD。**

REY LEJANO：是的。你可以使用 [通用表達式語言，或 CEL](https://github.com/google/cel-spec)
來驗證你的 CRD，因此你不再需要使用 webhook。這也使 CRD 更加自包含和聲明性，因爲規則現在保存在 CRD 對象定義中。

<!--
**CRAIG BOX: What new features, perhaps coming in Alpha or Beta, have taken your interest?**

REY LEJANO: Aside from pod security policies, I really love [ephemeral containers](https://github.com/kubernetes/enhancements/issues/277) supporting kubectl debug. It launches an ephemeral container and a running pod, shares those pod namespaces, and you can do all your troubleshooting with just running kubectl debug.
-->
**CRAIG BOX：哪些新功能（可能是 Alpha 版或 Beta 版）引起了你的興趣？**

REY LEJANO：除了 Pod 安全策略，我真的很喜歡支持 kubectl 調試的[臨時容器](https://github.com/kubernetes/enhancements/issues/277)。
它啓動一個臨時容器和一個正在運行的 Pod，共享這些 Pod 命名空間，你只需運行 kubectl debug 即可完成所有故障排除。

<!--
**CRAIG BOX: There's also been some interesting changes in the way that events are handled with kubectl.**

REY LEJANO: Yeah. kubectl events has always had some issues, like how things weren't sorted. [kubectl events improved](https://github.com/kubernetes/enhancements/issues/1440) that so now you can do `--watch`, and it will also sort with the `--watch` option as well. That is something new. You can actually combine fields and custom columns. And also, you can list events in the timeline with doing the last N number of minutes. And you can also sort events using other criteria as well.
-->
**CRAIG BOX：使用 kubectl 處理事件的方式也發生了一些有趣的變化。**

REY LEJANO：是的。kubectl events 總是有一些問題，比如事情沒有排序。
[kubectl 事件得到了改進](https://github.com/kubernetes/enhancements/issues/1440)，
所以現在你可以使用 `--watch`，它也可以使用 `--watch` 選項進行排序。那是新事物。
你實際上可以組合字段和自定義列。此外，你可以在時間線中列出最後 N 分鐘的事件。你還可以使用其他標準對事件進行排序。

<!--
**CRAIG BOX: You are a field engineer at SUSE. Are there any things that are coming in that your individual customers that you deal with are looking out for?**

REY LEJANO: More of what I look out for to help the customers.
-->
**CRAIG BOX：你是 SUSE 的一名現場工程師。有什麼事情是你所處理的個別客戶所要注意的嗎？**

REY LEJANO：更多我期待幫助客戶的東西。

<!--
**CRAIG BOX: Right.**

REY LEJANO: I really love kubectl events. Really love the PVCs being cleaned up with StatefulSets. Most of it's for selfish reasons that it will improve troubleshooting efforts. [CHUCKLES]
-->
**CRAIG BOX：好吧。**

REY LEJANO：我真的很喜歡 kubectl 事件。真的很喜歡用 StatefulSets 清理的 PVC。其中大部分是出於自私的原因，它將改進故障排除工作。[笑]

<!--
**CRAIG BOX: I have always hoped that a release team lead would say to me, "yes, I have selfish reasons. And I finally got something I wanted in."**

REY LEJANO: [LAUGHS]
-->
**CRAIG BOX：我一直希望發佈團隊負責人對我說：“是的，我有自私的理由。我終於得到了我想要的東西。”**

REY LEJANO：[大笑]

<!--
**CRAIG BOX: Perhaps I should run to be release team lead, just so I can finally get init containers fixed once and for all.**

REY LEJANO: Oh, init containers, I've been looking for that for a while. I've actually created animated GIFs on how init containers will be run with that Kubernetes enhancement proposal, but it's halted currently.
-->
**CRAIG BOX：也許我應該競選發佈團隊的負責人，這樣我就可以最終讓 Init 容器一勞永逸地得到修復。**

REY LEJANO：哦，Init 容器，我一直在尋找它。實際上，我已經制作了 GIF 動畫，介紹了 Init 容器將如何與那個 Kubernetes 增強提案一起運行，但目前已經停止了。

<!--
**CRAIG BOX: One day.**

REY LEJANO: One day. Maybe I shouldn't stay halted.
-->
**CRAIG BOX：有一天。**

REY LEJANO：總有一天。也許我不應該停下來。

<!--
**CRAIG BOX: You mentioned there are obviously the things you look out for. Are there any things that are coming down the line, perhaps Alpha features or maybe even just proposals you've seen lately, that you're personally really looking forward to seeing which way they go?**

REY LEJANO: Yeah. Oone is a very interesting one, it affects the whole community, so it's not just for personal reasons. As you may have known, Dockershim is deprecated. And we did release a blog that it will be removed in 1.24.
-->
**CRAIG BOX：你提到的顯然是你所關注的事情。是否有任何即將推出的東西，可能是 Alpha 功能，甚至可能只是你最近看到的建議，你個人真的很期待看到它們的發展方向？**

REY LEJANO：是的。Oone 是一個非常有趣的問題，它影響了整個社區，所以這不僅僅是出於個人原因。
正如你可能已經知道的，Dockershim 已經被廢棄了。而且我們確實發佈了一篇博客，說它將在 1.24 中被刪除。

<!--
**CRAIG BOX: Scared a bunch of people.**

REY LEJANO: Scared a bunch of people. From a survey, we saw that a lot of people are still using Docker and Dockershim. One of the enhancements for 1.23 is, [kubelet CRI goes to Beta](https://github.com/kubernetes/enhancements/issues/2040). This promotes the CRI API, which is required. This had to be in Beta for Dockershim to be removed in 1.24.
-->
**CRAIG BOX：嚇壞了一羣人。**

REY LEJANO：嚇壞了一羣人。從一項調查中，我們看到很多人仍在使用 Docker 和 Dockershim。
1.23 的增強功能之一是 [kubelet CRI 進入 Beta 版](https://github.com/kubernetes/enhancements/issues/2040)。 
這促進了 CRI API 的發展，而這是必需的。 這必須是 Beta 版才能在 1.24 中刪除 Dockershim。

<!--
**CRAIG BOX: Now, in the last release team lead interview, [we spoke with Savitha Raghunathan](https://kubernetespodcast.com/episode/157-kubernetes-1.22/), and she talked about what she would advise you as her successor. It was to look out for the mental health of the team members. How were you able to take that advice on board?**

REY LEJANO: That was great advice from Savitha. A few things I've made note of with each release team meeting. After each release team meeting, I stop the recording, because we do record all the meetings and post them on YouTube. And I open up the floor to anyone who wants to say anything that's not recorded, that's not going to be on the agenda. Also, I tell people not to work on weekends. I broke this rule once, but other than that, I told people it could wait. Just be mindful of your mental health.
-->
**CRAIG BOX：現在，在最後一次發佈團隊領導訪談中，[我們與 Savitha Raghunathan 進行了交談](https://kubernetespodcast.com/episode/157-kubernetes-1.22/)，
她談到了作爲她的繼任者她會給你什麼建議。她說要關注團隊成員的心理健康。你是如何採納這個建議的？

REY LEJANO：Savitha 的建議很好。我在每次發佈團隊會議上都記錄了一些事情。 
每次發佈團隊會議後，我都會停止錄製，因爲我們確實會錄製所有會議並將其發佈到 YouTube 上。
我向任何想要說任何未記錄的內容的人開放發言，這不會出現在議程上。此外，我告訴人們不要在週末工作。
我曾經打破過這個規則，但除此之外，我告訴人們它可以等待。只要注意你的心理健康。

<!--
**CRAIG BOX: It's just been announced that [James Laverack from Jetstack](https://twitter.com/JamesLaverack/status/1466834312993644551) will be the release team lead for 1.24. James and I shared an interesting Mexican dinner at the last KubeCon in San Diego.**

REY LEJANO: Oh, nice. I didn't know you knew James.
-->
**CRAIG BOX：剛剛宣佈[來自 Jetstack 的 James Laverack](https://twitter.com/JamesLaverack/status/1466834312993644551)
將成爲 1.24 的發佈團隊負責人。James 和我在 San Diego 的最後一屆 KubeCon 上分享了一頓有趣的墨西哥晚餐。**

REY LEJANO：哦，不錯。我不知道你認識 James。

<!--
**CRAIG BOX: The British tech scene. We're a very small world. What will your advice to James be?**

REY LEJANO: What I would tell James for 1.24 is use teachable moments in the release team meetings. When you're a shadow for the first time, it's very daunting. It's very difficult, because you don't know the repos. You don't know the release process. Everyone around you seems like they know the release process, and very familiar with what the release process is. But as a first-time shadow, you don't know all the vernacular for the community. I just advise to use teachable moments. Take a few minutes in the release team meetings to make it a little easier for new shadows to ramp up and to be familiar with the release process.
-->
**CRAIG BOX：英國科技界。我們是一個非常小的世界。你對 James 的建議是什麼？**

REY LEJANO：對於 1.24，我要告訴 James 的是在發佈團隊會議中使用教學時刻。當你第一次成爲影子時，這是非常令人生畏的。
這非常困難，因爲你不知道儲存庫。你不知道發佈過程。周圍的每個人似乎都知道發佈過程，並且非常熟悉發佈過程是什麼。 
但作爲第一次出現的影子，你並不瞭解社區的所有白話。我只是建議使用教學時刻。在發佈團隊會議上花幾分鐘時間，讓新影子更容易上手並熟悉發佈過程。

<!--
**CRAIG BOX: Has there been major evolution in the process in the time that you've been involved? Or do you think that it's effectively doing what it needs to do?**

REY LEJANO: It's always evolving. I remember my first time in release notes, 1.18, we said that our goal was to automate and program our way out so that we don't have a release notes team anymore. That's changed [CHUCKLES] quite a bit. Although there's been significant advancements in the release notes process by Adolfo and also James, they've created a subcommand in krel to generate release notes.
-->
**CRAIG BOX：在你參與的這段時間裏，這個過程是否有重大演變？或者你認爲它正在有效地做它需要做的事情？**

REY LEJANO：它總是在不斷發展。我記得我第一次做發佈說明時，1.18，我們說我們的目標是自動化和編程，這樣我們就不再有發行說明團隊了。
這改變了很多[笑]。儘管 Adolfo 和 James 在發佈說明過程中取得了重大進展，但他們在 krel 中創建了一個子命令來生成發行說明。

<!--
But nowadays, all their release notes are richer. Still not there at the automation process yet. Every release cycle, there is something a little bit different. For this release cycle, we had a production readiness review deadline. It was a soft deadline. A production readiness review is a review by several people in the community. It's actually been required since 1.21, and it ensures that the enhancements are observable, scalable, supportable, and it's safe to operate in production, and could also be disabled or rolled back. In 1.23, we had a deadline to have the production readiness review completed by a specific date.
-->
但如今，他們所有的發行說明都更加豐富了。在自動化過程中，仍然沒有達到。每個發佈週期，都有一點不同的東西。
對於這個發佈週期，我們有一個生產就緒審查截止日期。這是一個軟期限。生產就緒審查是社區中幾個人的審查。
實際上從 1.21 開始就需要它，它確保增強是可觀察的、可擴展的、可支持的，並且在生產中運行是安全的，也可以被禁用或回滾。 
在 1.23 中，我們有一個截止日期，要求在特定日期之前完成生產就緒審查。

<!--
**CRAIG BOX: How have you found the change of schedule to three releases per year rather than four?**

REY LEJANO: Moving to three releases a year from four, in my opinion, has been an improvement, because we support the last three releases, and now we can actually support the last releases in a calendar year instead of having 9 months out of 12 months of the year.
-->
**CRAIG BOX：你如何發現每年發佈三個版本，而不是四個版本？**

REY LEJANO：從一年四個版本轉爲三個版本，在我看來是一種進步，因爲我們支持最後三個版本，
現在我們實際上可以支持在一個日曆年內的最後一個版本，而不是在 12 個月中只有 9 個月。

<!--
**CRAIG BOX: The next event on the calendar is a [Kubernetes contributor celebration](https://www.kubernetes.dev/events/kcc2021/) starting next Monday. What can we expect from that event?**

REY LEJANO: This is our second time running this virtual event. It's a virtual celebration to recognize the whole community and all of our accomplishments of the year, and also contributors. There's a number of events during this week of celebration. It starts the week of December 13.
-->
**CRAIG BOX：日曆上的下一個活動是下週一開始的 [Kubernetes 貢獻者慶典](https://www.kubernetes.dev/events/kcc2021/)。我們可以從活動中期待什麼？**

REY LEJANO：這是我們第二次舉辦這個虛擬活動。這是一個虛擬的慶祝活動，以表彰整個社區和我們今年的所有成就，以及貢獻者。
在這周的慶典中有許多活動。它從 12 月 13 日的那一週開始。

<!--
There's events like the Kubernetes Contributor Awards, where SIGs honor and recognize the hard work of the community and contributors. There's also a DevOps party game as well. There is a cloud native bake-off. I do highly suggest people to go to [kubernetes.dev/celebration](https://www.kubernetes.dev/events/past-events/2021/kcc2021/) to learn more.
-->
有像 Kubernetes 貢獻者獎這樣的活動，SIG 對社區和貢獻者的辛勤工作進行表彰和獎勵。
也有一個 DevOps 聚會遊戲。還有一個雲原生的烘烤活動。我強烈建議人們去
[kubernetes.dev/celebration](https://www.kubernetes.dev/events/past-events/2021/kcc2021/)
瞭解更多。

<!--
**CRAIG BOX: How exactly does one judge a virtual bake-off?**

REY LEJANO: That I don't know. [CHUCKLES]
-->
**CRAIG BOX： 究竟如何評判一個虛擬的烘焙比賽呢？**

REY LEJANO：那我不知道。[笑]

<!--
**CRAIG BOX: I tasted my scones. I think they're the best. I rate them 10 out of 10.**

REY LEJANO: Yeah. That is very difficult to do virtually. I would have to say, probably what the dish is, how closely it is tied with Kubernetes or open source or to CNCF. There's a few judges. I know Josh Berkus and Rin Oliver are a few of the judges running the bake-off.
-->
**CRAIG BOX：我嚐了嚐我的烤餅。我認爲他們是最好的。我給他們打了 10 分（滿分 10 分）。**

REY LEJANO：是的。這是很難做到的。我不得不說，這道菜可能是什麼，它與 Kubernetes 或開源或與 CNCF 的關係有多密切。
有幾個評委。我知道 Josh Berkus 和 Rin Oliver 是主持烘焙比賽的幾個評委。

<!--
**CRAIG BOX: Yes. We spoke with Josh about his love of the kitchen, and so he seems like a perfect fit for that role.**

REY LEJANO: He is.
-->
**CRAIG BOX：是的。我們與 Josh 談到了他對廚房的熱愛，因此他似乎非常適合這個角色。**

REY LEJANO：他是。

<!--
**CRAIG BOX: Finally, your wife and yourself are expecting your first child in January. Have you had a production readiness review for that?**

REY LEJANO: I think we failed that review. [CHUCKLES]
-->
**CRAIG BOX：最後，你的妻子和你自己將在一月份迎來你們的第一個孩子。你是否爲此進行過生產準備審查？**

REY LEJANO：我認爲我們沒有通過審查。[笑]

<!--
**CRAIG BOX: There's still time.**

REY LEJANO: We are working on refactoring. We're going to refactor a little bit in December, and `--apply` again.
-->
**CRAIG BOX：還有時間。**

REY LEJANO：我們正在努力重構。我們將在 12 月進行一些重構，然後再次使用 `--apply`。

---

<!--
_[Rey Lejano](https://twitter.com/reylejano) is a field engineer at SUSE, by way of Rancher Labs, and was the release team lead for Kubernetes 1.23. He is now also a co-chair for SIG Docs. His son Liam is now 3 and a half months old._

_You can find the [Kubernetes Podcast from Google](http://www.kubernetespodcast.com/) at [@KubernetesPod](https://twitter.com/KubernetesPod) on Twitter, and you can [subscribe](https://kubernetespodcast.com/subscribe/) so you never miss an episode._
-->
**[Rey Lejano](https://twitter.com/reylejano) 是 SUSE 的一名現場工程師，來自 Rancher Labs，並且是 Kubernetes 1.23 的發佈團隊負責人。
他現在也是 SIG Docs 的聯合主席。他的兒子 Liam 現在 3 個半月大。**

**你可以在 Twitter 上的 [@KubernetesPod](https://twitter.com/KubernetesPod)
找到[來自谷歌的 Kubernetes 播客](http://www.kubernetespodcast.com/)，
你也可以[訂閱](https://kubernetespodcast.com/subscribe/)，這樣你就不會錯過任何一集。**
