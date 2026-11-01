---
layout: blog
title: "Frontiers, fsGroups and frogs: Kubernetes 1.23 发布采访"
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
举办每周一次的[来自 Google 的 Kubernetes 播客](https://kubernetespodcast.com/) 
的亮点之一是与每个新 Kubernetes 版本的发布经理交谈。发布团队不断刷新。许多人从小型文档修复开始，逐步晋升为影子角色，然后最终领导发布。

<!--
As we prepare for the 1.24 release next week, [in accordance with long-standing tradition](https://www.google.com/search?q=%22release+interview%22+site%3Akubernetes.io%2Fblog), I'm pleased to bring you a look back at the story of 1.23. The release was led by [Rey Lejano](https://twitter.com/reylejano), a Field Engineer at SUSE. [I spoke to Rey](https://kubernetespodcast.com/episode/167-kubernetes-1.23/) in December, as he was awaiting the birth of his first child.
-->
在我们为下周发布的 1.24 版本做准备时，[按照长期以来的传统](https://www.google.com/search?q=%22release+interview%22+site%3Akubernetes.io%2Fblog)，
很高兴带大家回顾一下 1.23 的故事。该版本由 SUSE 的现场工程师 [Rey Lejano](https://twitter.com/reylejano) 领导。
在 12 月[我与 Rey 交谈过](https://kubernetespodcast.com/episode/167-kubernetes-1.23/)，当时他正在等待他的第一个孩子的出生。

<!--
Make sure you [subscribe, wherever you get your podcasts](https://kubernetespodcast.com/subscribe/), so you hear all our stories from the Cloud Native community, including the story of 1.24 next week.
-->
请确保你[订阅，无论你在哪里获得你的播客](https://kubernetespodcast.com/subscribe/)，
以便你听到我们所有来自云原生社区的故事，包括下周 1.24 的故事。

<!--
*This transcript has been lightly edited and condensed for clarity.*
-->
**为清晰起见本稿件经过了简单的编辑和浓缩。**

---
<!--
**CRAIG BOX: I'd like to start with what is, of course, on top of everyone's mind at the moment. Let's talk African clawed frogs!**
-->
**CRAIG BOX：我想从现在每个人最关心的问题开始。让我们谈谈非洲爪蛙！**

<!--
REY LEJANO: [CHUCKLES] Oh, you mean [Xenopus lavis](https://en.wikipedia.org/wiki/African_clawed_frog), the scientific name for the African clawed frog?

**CRAIG BOX: Of course.**
-->
REY LEJANO：[笑]哦，你是说 [Xenopus lavis](https://en.wikipedia.org/wiki/African_clawed_frog)，非洲爪蛙的学名？

**CRAIG BOX：当然。**

<!--
REY LEJANO: Not many people know, but my background and my degree is actually in microbiology, from the University of California Davis. I did some research for about four years in biochemistry, in a biochemistry lab, and I [do have a research paper published](https://www.sciencedirect.com/science/article/pii/). It's actually on glycoproteins, particularly something called "cortical granule lectin". We used frogs, because they generate lots and lots of eggs, from which we can extract the protein. That protein prevents polyspermy. When the sperm goes into the egg, the egg releases a glycoprotein, cortical granule lectin, to the membrane, and prevents any other sperm from going inside the egg.
-->
REY LEJANO：知道的人不多，但我曾就读于戴維斯加利福尼亚大学的微生物学专业。
我在生物化学实验室做了大约四年的生物化学研究，并且我[确实发表了一篇研究论文](https://www.sciencedirect.com/science/article/pii/)。
它实际上是在糖蛋白上，特别是一种叫做“皮质颗粒凝集素”的东西。我们使用青蛙，因为它们会产生大量的蛋，我们可以从中提取蛋白质。
这种蛋白质可以防止多精症。当精子进入卵子时，卵子会向细胞膜释放一种糖蛋白，即皮质颗粒凝集素，并阻止任何其他精子进入卵子。

<!--
**CRAIG BOX: Were you able to take anything from the testing that we did on frogs and generalize that to higher-order mammals, perhaps?**

REY LEJANO: Yes. Since mammals also have cortical granule lectin, we were able to analyze both the convergence and the evolutionary pattern, not just from multiple species of frogs, but also into mammals as well.
-->
**CRAIG BOX：你是否能够从我们对青蛙进行的测试中汲取任何东西并将其推广到更高阶的哺乳动物？**

REY LEJANO：是的。由于哺乳动物也有皮质颗粒凝集素，我们能够分析收敛和进化模式，不仅来自多种青蛙，还包括哺乳动物。

<!--
**CRAIG BOX: Now, there's a couple of different threads to unravel here. When you were young, what led you into the fields of biology, and perhaps more the technical side of it?**

REY LEJANO: I think it was mostly from family, since I do have a family history in the medical field that goes back generations. So I kind of felt like that was the natural path going into college.
-->
**CRAIG BOX：现在，这里有几个不同的线索需要解开。当你年轻的时候，是什么引导你进入生物学领域，可以侧重介绍技术方面的内容吗？**

REY LEJANO：我认为这主要来自家庭，因为我在医学领域确实有可以追溯到几代人的家族史。所以我觉得那是进入大学的自然路径。

<!--
**CRAIG BOX: Now, of course, you're working in a more abstract tech field. What led you out of microbiology?**

REY LEJANO: [CHUCKLES] Well, I've always been interested in tech. Taught myself a little programming when I was younger, before high school, did some web dev stuff. Just kind of got burnt out being in a lab. I was literally in the basement. I had a great opportunity to join a consultancy that specialized in [ITIL](https://www.axelos.com/certifications/itil-service-management/what-is-itil). I actually started off with application performance management, went into monitoring, went into operation management and also ITIL, which is aligning your IT asset management and service managements with business services. Did that for a good number of years, actually.
-->
**CRAIG BOX：现在，你正在一个更抽象的技术领域工作。是什么让你离开了微生物学？**

REY LEJANO：[笑]嗯，我一直对科技很感兴趣。我年轻的时候自学了一点编程，在高中之前，做了一些网络开发的东西。
只是在实验室里有点焦头烂额了，实际上是在地下室。我有一个很好的机会加入了一家专门从事 [ITIL](https://www.axelos.com/certifications/itil-service-management/what-is-itil) 
的咨询公司。实际上，我从应用性能管理开始，进入监控，进入运营管理和 ITIL，也就是把你的 IT 资产管理和服务管理与商业服务结合起来。实际上，我在这方面做了很多年。

<!--
**CRAIG BOX: It's very interesting, as people describe the things that they went through and perhaps the technologies that they worked on, you can pretty much pinpoint how old they might be. There's a lot of people who come into tech these days that have never heard of ITIL. They have no idea what it is. It's basically just SRE with more process.**

REY LEJANO: Yes, absolutely. It's not very cloud native. [CHUCKLES]
-->
**CRAIG BOX：这很有趣，当人们描述他们所经历的事情以及他们所从事的技术时，你几乎可以确定他们的年龄。
现在有很多人进入科技行业，但从未听说过 ITIL。他们不知道那是什么。它基本上和 SRE 类似，只是过程更加复杂。**

REY LEJANO：是的，一点没错。它不是非常云原生的。[笑]

<!--
**CRAIG BOX: Not at all.**

REY LEJANO: You don't really hear about it in the cloud native landscape. Definitely, you can tell someone's been in the field for a little bit, if they specialize or have worked with ITIL before.
-->
**CRAIG BOX：一点也不。**

REY LEJANO：在云原生环境中，你并没有真正听说过它。毫无疑问，如果有人专门从事过 ITIL 工作或之前曾与 ITIL 合作过，你肯定可以看出他们已经在该领域工作了一段时间。

<!--
**CRAIG BOX: You mentioned that you wanted to get out of the basement. That is quite often where people put the programmers. Did they just give you a bit of light in the new basement?**

REY LEJANO: [LAUGHS] They did give us much better lighting. Able to get some vitamin D sometimes, as well.
-->
**CRAIG BOX：你提到你想离开地下室。这的确是程序员常待的地方。他们只是在新的地下室里给了你一点光吗？**

REY LEJANO：[笑]他们确实给了我们更好的照明。有时也能获得一些维生素 D。

<!--
**CRAIG BOX: To wrap up the discussion about your previous career — over the course of the last year, with all of the things that have happened in the world, I could imagine that microbiology skills may be more in demand than perhaps they were when you studied them?**

REY LEJANO: Oh, absolutely. I could definitely see a big increase of numbers of people going into the field. Also, reading what's going on with the world currently kind of brings back all the education I've learned in the past, as well.
-->
**CRAIG BOX：总结一下你的过往职业经历：在过去的一年里，随着全球各地的发展变化，我认为如今微生物学技能可能比你在校时更受欢迎？**

REY LEJANO：哦，当然。我肯定能看到进入这个领域的人数大增。此外，阅读当前世界正在发生的事情也会带回我过去所学的所有教育。

<!--
**CRAIG BOX: Do you keep in touch with people you went through school with?**

REY LEJANO: Just some close friends, but not in the microbiology field.
-->
**CRAIG BOX：你和当时的同学还在保持联系吗？**

REY LEJANO：只是一些亲密的朋友，但不是在微生物学领域。

<!--
**CRAIG BOX: One thing that I think will probably happen as a result of the pandemic is a renewed interest in some of these STEM fields. It will be interesting to see what impact that has on society at large.**

REY LEJANO: Yeah. I think that'll be great.
-->
**CRAIG BOX：我认为，这次的全球疫情可能让人们对科学、技术、工程和数学领域重新产生兴趣。
看看这对整个社会有什么影响，将是很有趣的。**

REY LEJANO：是的。我认为那会很棒。

<!--
**CRAIG BOX: You mentioned working at a consultancy doing IT management, application performance monitoring, and so on. When did Kubernetes come into your professional life?**

REY LEJANO: One of my good friends at the company I worked at, left in mid-2015. He went on to a company that was pretty heavily into Docker. He taught me a little bit. I did my first "docker run" around 2015, maybe 2016. Then, one of the applications we were using for the ITIL framework was containerized around 2018 or so, also in Kubernetes. At that time, it was pretty buggy. That was my initial introduction to Kubernetes and containerised applications.
-->
**CRAIG BOX：你提到在一家咨询公司工作，从事 IT 管理、应用程序性能监控等工作。Kubernetes 是什么时候进入你的职业生涯的？**

REY LEJANO：在我工作的公司，我的一位好朋友于 2015 年年中离职。他去了一家非常热衷于 Docker 的公司。
他教了我一点东西。我在 2015 年左右，也许是 2016 年，做了我的第一次 “docker run”。
然后，我们用于 ITIL 框架的一个应用程序在 2018 年左右被容器化了，也在 Kubernetes 中。
那个时候，它是有些问题的。那是我第一次接触 Kubernetes 和容器化应用程序。

<!--
Then I left that company, and I actually joined my friend over at [RX-M](https://rx-m.com/), which is a cloud native consultancy and training firm. They specialize in Docker and Kubernetes. I was able to get my feet wet. I got my CKD, got my CKA as well. And they were really, really great at encouraging us to learn more about Kubernetes and also to be involved in the community.

**CRAIG BOX: You will have seen, then, the life cycle of people adopting Kubernetes and containerization at large, through your own initial journey and then through helping customers. How would you characterize how that journey has changed from the early days to perhaps today?**
-->
然后我离开了那家公司，实际上我加入了我在 [RX-M](https://rx-m.com/) 的朋友，这是一家云原生咨询和培训公司。
他们专门从事 Docker 和 Kubernetes 的工作。我能够让我脚踏实地。我拿到了 CKD 和 CKA 证书。
他们在鼓励我们学习更多关于 Kubernetes 的知识和参与社区活动方面真的非常棒。

**CRAIG BOX：然后，你将看到人们采用 Kubernetes 和容器化的整个生命周期，通过你自己的初始旅程，然后通过帮助客户。你如何描述这段旅程从早期到今天的变化？**

<!--
REY LEJANO: I think the early days, there was a lot of questions of, why do I have to containerize? Why can't I just stay with virtual machines?

**CRAIG BOX: It's a line item on your CV.**
-->
REY LEJANO：我认为早期有很多问题，为什么我必须容器化？为什么我不能只使用虚拟机？

**CRAIG BOX：这是你的简历上的一个条目。**

<!--
REY LEJANO: [CHUCKLES] It is. And nowadays, I think people know the value of using containers, of orchestrating containers with Kubernetes. I don't want to say "jumping on the bandwagon", but it's become the de-facto standard to orchestrate containers.

**CRAIG BOX: It's not something that a consultancy needs to go out and pitch to customers that they should be doing. They're just taking it as, that will happen, and starting a bit further down the path, perhaps.**

REY LEJANO: Absolutely.
-->
REY LEJANO：[笑]是的。现在，我认为人们知道使用容器的价值，以及使用 Kubernetes 编排容器的价值。我不想说“赶上潮流”，但它已经成为编排容器的事实标准。

**CRAIG BOX：这不是咨询公司需要走出去向客户推销他们应该做的事情。他们只是把它当作会发生的事情，并开始在这条路上走得更远一些，也许。**

REY LEJANO：当然。

<!--
**CRAIG BOX: Working at a consultancy like that, how much time do you get to work on improving process, perhaps for multiple customers, and then looking at how you can upstream that work, versus paid work that you do for just an individual customer at a time?**
-->
**CRAIG BOX：在这样的咨询公司工作，你有多少时间致力于改善流程，也许是为多个客户，然后研究如何将这项工作推向上游，而不是每次只为单个客户做有偿工作？**


<!--
REY LEJANO: Back then, it would vary. They helped me introduce myself, and I learned a lot about the cloud native landscape and Kubernetes itself. They helped educate me as to how the cloud native landscape, and the tools around it, can be used together. My boss at that company, Randy, he actually encouraged us to start contributing upstream, and encouraged me to join the release team. He just said, this is a great opportunity. Definitely helped me with starting with the contributions early on.
-->
REY LEJANO：那时，情况会有所不同。他们帮我介绍了自己，我也了解了很多关于云原生环境和 Kubernetes 本身的情况。
他们帮助我了解如何将云原生环境及其周围的工具一起使用。我在那家公司的老板，Randy，实际上他鼓励我们开始向上游做贡献，
并鼓励我加入发布团队。他只是说，这是个很好的机会。这对我在早期就开始做贡献有很大的帮助。

<!--
**CRAIG BOX: Was the release team the way that you got involved with upstream Kubernetes contribution?**

REY LEJANO: Actually, no. My first contribution was  with SIG Docs. I met Taylor Dolezal — he was the release team lead for 1.19, but he is involved with SIG Docs as well. I met him at KubeCon 2019, I sat at his table during a luncheon. I remember Paris Pittman was hosting this luncheon at the Marriott. Taylor says he was involved with SIG Docs. He encouraged me to join. I started joining into meetings, started doing a few drive-by PRs. That's what we call them — drive-by — little typo fixes. Then did a little bit more, started to send better or higher quality pull requests, and also reviewing PRs.
-->
**CRAIG BOX：发布团队是你参与上游 Kubernetes 贡献的方式吗？**

REY LEJANO：实际上，没有。我的第一个贡献是 SIG Docs。我认识了 Taylor Dolezal——他是 1.19 的发布团队负责人，但他也参与了 SIG Docs。
我在 KubeCon 2019 遇到了他，在午餐时我坐在他的桌子旁。我记得 Paris Pittman 在万豪酒店主持了这次午餐会。
Taylor 说他参与了 SIG Docs。他鼓励我加入。我开始参加会议，开始做一些路过式的 PR。
这就是我们所说的 - 驱动式 - 小错字修复。然后做更多的事情，开始发送更好或更高质量的拉取请求，并审查 PR。

<!--
**CRAIG BOX: When did you first formally take your release team role?**

REY LEJANO: That was in [1.18](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.18/release_team.md), in December. My boss at the time encouraged me to apply. I did, was lucky enough to get accepted for the release notes shadow. Then from there, stayed in with release notes for a few cycles, then went into Docs, naturally then led Docs, then went to Enhancements, and now I'm the release lead for 1.23.
-->
**CRAIG BOX：你第一次正式担任发布团队的角色是什么时候？**

REY LEJANO：那是在 12月的 [1.18](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.18/release_team.md)。
当时我的老板鼓励我去申请。我申请了，很幸运地被录取了，成为发布说明的影子。然后从那里开始，我在发布说明中呆了几个周期，
然后去了文档，自然而然地领导了文档，然后去了增强版，现在我是 1.23 的发行负责人。

<!--
**CRAIG BOX: I don't know that a lot of people think about what goes into a good release note. What would you say does?**

REY LEJANO: [CHUCKLES] You have to tell the end user what has changed or what effect that they might see in the release notes. It doesn't have to be highly technical. It could just be a few lines, and just saying what has changed, what they have to do if they have to do anything as well.
-->
**CRAIG BOX：我不知道很多人都会考虑到一个好的发行说明需要什么。你说什么才是呢？**

REY LEJANO：[笑]你必须告诉最终用户发生了什么变化，或者他们在发行说明中可能看到什么效果。
它不必是高度技术性的。它可以只是几行字，只是说有什么变化，如果他们也必须做任何事情，他们必须做什么。

<!--
**CRAIG BOX: As you moved through the process of shadowing, how did you learn from the people who were leading those roles?**

REY LEJANO: I said this a few times when I was the release lead for this cycle. You get out of the release team as much as you put in, or it directly aligns to how much you put in. I learned a lot. I went into the release team having that mindset of learning from the role leads, learning from the other shadows, as well. That's actually a saying that my first role lead told me. I still carry it to heart, and that was back in 1.18. That was Eddie, in the very first meeting we had, and I still carry it to heart.
-->
**CRAIG BOX：我不知道很多人会考虑一个好的发布说明的内容。你会说什么？**

REY LEJANO：当我是这个周期的发布负责人时，我说过几次。你从发布团队得到的东西和你投入的东西一样多，或者说它直接与你投入的东西相一致。
我学到了很多东西。我在进入发布团队时就有这样的心态：向角色领导学习，也向其他影子学习。
这实际上是我的第一个角色负责人告诉我的一句话。我仍然铭记于心，那是在 1.18 中。那是 Eddie，在我们第一次见面时，我仍然牢记在心。

<!--
**CRAIG BOX: You, of course, were [the release lead for 1.23](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.23). First of all, congratulations on the release.**

REY LEJANO: Thank you very much.
-->
**CRAIG BOX：当然，你是 [1.23 的发布负责人](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.23)。首先，祝贺发布。**

REY LEJANO：非常感谢。

<!--
**CRAIG BOX: The theme for this release is [The Next Frontier](https://kubernetes.io/blog/2021/12/07/kubernetes-1-23-release-announcement/). Tell me the story of how we came to the theme and then the logo.**

REY LEJANO: The Next Frontier represents a few things. It not only represents the next enhancements in this release, but Kubernetes itself also has a history of Star Trek references. The original codename for Kubernetes was Project Seven, a reference to Seven of Nine, originally from Star Trek Voyager. Also the seven spokes in the helm in the logo of Kubernetes as well. And, of course, Borg, the predecessor to Kubernetes.
-->
**CRAIG BOX：这个版本的主题是[最后战线](https://kubernetes.io/blog/2021/12/07/kubernetes-1-23-release-announcement/)。
请告诉我我们是如何确定主题和标志的故事。**

REY LEJANO：最后战线代表了几件事。它不仅代表了此版本的下一个增强功能，而且 Kubernetes 本身也有《星际迷航》的参考历史。
Kubernetes 的原始代号是 Project Seven，指的是最初来自《星际迷航》中的 Seven of Nine。
在 Kubernetes 的 logo 中掌舵的七根辐条也是如此。当然，还有 Kubernetes 的前身 Borg。

<!--
The Next Frontier continues that Star Trek reference. It's a fusion of two titles in the Star Trek universe. One is [Star Trek V, the Final Frontier](https://en.wikipedia.org/wiki/Star_Trek_V:_The_Final_Frontier), and the Star Trek: The Next Generation.
-->
最后战线继续星际迷航参考。这是星际迷航宇宙中两个标题的融合。一个是[星际迷航 5：最后战线](https://en.wikipedia.org/wiki/Star_Trek_V:_The_Final_Frontier)，还有星际迷航：下一代。

<!--
**CRAIG BOX: Do you have any opinion on the fact that Star Trek V was an odd-numbered movie, and they are [canonically referred to as being lesser than the even-numbered ones](https://screenrant.com/star-trek-movies-odd-number-curse-explained/)?**

REY LEJANO: I can't say, because I am such a sci-fi nerd that I love all of them even though they're bad. Even the post-Next Generation movies, after the series, I still liked all of them, even though I know some weren't that great.
-->
**CRAIG BOX：你对《星际迷航 5》是一部奇数电影有什么看法，而且它们[通常被称为比偶数电影票房少](https://screenrant.com/star-trek-movies-odd-number-curse-explained/)？**

REY LEJANO：我不能说，因为我是一个科幻书呆子，我喜欢他们所有的人，尽管他们很糟糕。即使是《下一代》系列之后的电影，我仍然喜欢所有的电影，尽管我知道有些并不那么好。

<!--
**CRAIG BOX: Am I right in remembering that Star Trek V was the one directed by William Shatner?**

REY LEJANO: Yes, that is correct.
-->
**CRAIG BOX：我记得星际迷航 5 是由 William Shatner 执导对吗？**

REY LEJANO：是的，对的。

<!--
**CRAIG BOX: I think that says it all.**

REY LEJANO: [CHUCKLES] Yes.
-->
**CRAIG BOX：我认为这说明了一切。**

REY LEJANO：[笑]是的。

<!--
**CRAIG BOX: Now, I understand that the theme comes from a part of the [SIG Release charter](https://github.com/kubernetes/community/blob/master/sig-release/charter.md)?**

REY LEJANO: Yes. There's a line in the SIG Release charter, "ensure there is a consistent group of community members in place to support the release process across time." With the release team, we have new shadows that join every single release cycle. With this, we're growing with this community. We're growing the release team members. We're growing SIG Release. We're growing the Kubernetes community itself. For a lot of people, this is their first time contributing to open source, so that's why I say it's their new open source frontier.
-->
**CRAIG BOX：现在，我明白了，主题来自于 [SIG 发布章程](https://github.com/kubernetes/community/blob/master/sig-release/charter.md)？**

REY LEJANO：是的。SIG 发布章程中有一句话，“确保有一个一致的社区成员小组来支持不同时期的发布过程。”
在发布团队中，我们每一个发布周期都有新的影子加入。有了这个，我们与这个社区一起成长。我们正在壮大发布团队的成员。
我们正在增加 SIG 版本。我们正在发展 Kubernetes 社区本身。对于很多人来说，这是他们第一次为开源做出贡献，所以我说这是他们新的开源前沿。

<!--
**CRAIG BOX: And the logo is obviously very Star Trek-inspired. It sort of surprised me that it took that long for someone to go this route.**

REY LEJANO: I was very surprised as well. I had to relearn Adobe Illustrator to create the logo.
-->
**CRAIG BOX：而这个标志显然是受《星际迷航》的启发。让我感到惊讶的是，花了那么长时间才有人走这条路**

REY LEJANO：我也很惊讶。我不得不重新学习 Adobe Illustrator 来创建标志。

<!--
**CRAIG BOX: This your own work, is it?**

REY LEJANO: This is my own work.
-->
**CRAIG BOX：这是你自己的作品，是吗？**

REY LEJANO：这是我自己的作品。

<!--
**CRAIG BOX: It's very nice.**

REY LEJANO: Thank you very much. Funny, the galaxy actually took me the longest time versus the ship. Took me a few days to get that correct. I'm always fine-tuning it, so there might be a final change when this is actually released.
-->
**CRAIG BOX：非常好。**

REY LEJANO：谢谢。有趣的是，相对于飞船，银河系实际上花了我最长的时间。我花了几天时间才把它弄正确。
我一直在对它进行微调，所以在真正发布时可能会有最后的改变。

<!--
**CRAIG BOX: No frontier is ever truly final.**

REY LEJANO: True, very true.
-->
**CRAIG BOX：没有边界是真正的终结。**

REY LEJANO：是的，非常正确。

<!--
**CRAIG BOX: Moving now from the theme of the release to the substance, perhaps, what is new in 1.23?**

REY LEJANO: We have 47 enhancements. I'm going to run through most of the stable ones, if not all of them, some of the key Beta ones, and a few of the Alpha enhancements for 1.23.
-->
**CRAIG BOX：现在从发布的主题转到实质内容，也许，1.23 中有什么新内容？**

REY LEJANO：我们有 47 项增强功能。我将运行大部分稳定的，甚至全部的，一些关键的 Beta 版，以及一些 1.23 版的 Alpha 增强。

<!--
One of the key enhancements is [dual-stack IPv4/IPv6](https://github.com/kubernetes/enhancements/issues/563), which went GA in 1.23.

Some background info: dual-stack was introduced as Alpha in 1.15. You probably saw a keynote at KubeCon 2019. Back then, the way dual-stack worked was that you needed two services — you needed a service per IP family. You would need a service for IPv4 and a service for IPv6. It was refactored in 1.20. In 1.21, it was in Beta; clusters were enabled to be dual-stack by default.
-->
其中一个关键的改进是[双堆栈 IPv4/IPv6](https://github.com/kubernetes/enhancements/issues/563)，它在 1.23 版本中采用了 GA。

一些背景信息：双堆栈在 1.15 中作为 Alpha 引入。你可能在 KubeCon 2019 上看到了一个主题演讲。
那时，双栈的工作方式是，你需要两个服务--你需要每个IP家族的服务。你需要一个用于 IPv4 的服务和一个用于 IPv6 的服务。
它在 1.20 版本中被重构了。在 1.21 版本中，它处于测试阶段；默认情况下，集群被启用为双堆栈。

<!--
And then in 1.23 we did remove the IPv6 dual-stack feature flag. It's not mandatory to use dual-stack. It's actually not "default" still. The pods, the services still default to single-stack. There are some requirements to be able to use dual-stack. The nodes have to be routable on IPv4 and IPv6 network interfaces. You need a CNI plugin that supports dual-stack. The pods themselves have to be configured to be dual-stack. And the services need the ipFamilyPolicy field to specify prefer dual-stack, or require dual-stack.
-->
然后在 1.23 版本中，我们确实删除了 IPv6 双栈功能标志。这不是强制性的使用双栈。它实际上仍然不是 "默认"的。
Pod，服务仍然默认为单栈。要使用双栈，有一些要求。节点必须可以在 IPv4 和 IPv6 网络接口上进行路由。
你需要一个支持双栈的 CNI 插件。Pod 本身必须被配置为双栈。而服务需要 ipFamilyPolicy 字段来指定喜欢双栈或要求双栈。


<!--
**CRAIG BOX: This sounds like there's an implication in this that v4 is still required. Do you see a world where we can actually move to v6-only clusters?**

REY LEJANO: I think we'll be talking about IPv4 and IPv6 for many, many years to come. I remember a long time ago, they kept saying "it's going to be all IPv6", and that was decades ago.
-->
**CRAIG BOX：这听起来暗示仍然需要 v4。你是否看到了一个我们实际上可以转移到仅有 v6 的集群的世界？？**

REY LEJANO：我认为在未来很多很多年里，我们都会谈论 IPv4 和 IPv6。我记得很久以前，他们一直在说 "这将全部是 IPv6"，而那是几十年前的事了。

<!--
**CRAIG BOX: I think I may have mentioned on the show before, but there was [a meeting in London that Vint Cerf attended](https://www.youtube.com/watch?v=AEaJtZVimqs), and he gave a public presentation at the time to say, now is the time of v6. And that was 10 years ago at least. It's still not the time of v6, and my desktop still doesn't have Linux on it. One day.**

REY LEJANO: [LAUGHS] In my opinion, that's one of the big key features that went stable for 1.23.
-->
**CRAIG BOX：我想我之前可能在节目中提到过，Vint Cerf [在伦敦参加了一个会议](https://www.youtube.com/watch?v=AEaJtZVimqs)，
他当时做了一个公开演讲说，现在是v6的时代了。那是至少 10 年前的事了。现在还不是 v6 的时代，我的电脑桌面上还没有一天拥有 Linux。**

REY LEJANO：[笑]在我看来，这是 1.23 版稳定的一大关键功能。

<!--
One of the other highlights of 1.23 is [pod security admission going to Beta](/blog/2021/12/09/pod-security-admission-beta/). I know this feature is going to Beta, but I highlight this because as some people might know, PodSecurityPolicy, which was deprecated in 1.21, is targeted to be removed in 1.25. Pod security admission replaces pod security policy. It's an admission controller. It evaluates the pods against a predefined set of pod security standards to either admit or deny the pod for running.

There's three levels of pod security standards. Privileged, that's totally open. Baseline, known privileges escalations are minimized. Or Restricted, which is hardened. And you could set pod security standards either to run in three modes, which is enforce: reject any pods that are in violation; to audit: pods are allowed to be created, but the violations are recorded; or warn: it will send a warning message to the user, and the pod is allowed.
-->
1.23 版的另一个亮点是 [Pod 安全许可进入 Beta 版](/blog/2021/12/09/pod-security-admission-beta/)。
我知道这个功能将进入 Beta 版，但我强调这一点是因为有些人可能知道，PodSecurityPolicy 在 1.21 版本中被废弃，目标是在 1.25 版本中被移除。
Pod 安全接纳取代了 Pod 安全策略。它是一个准入控制器。它根据预定义的 Pod 安全标准集对 Pod 进行评估，以接纳或拒绝 Pod 的运行。

Pod 安全标准分为三个级别。特权，这是完全开放的。基线，已知的特权升级被最小化。或者 限制级，这是强化的。而且你可以将 Pod 安全标准设置为以三种模式运行，
即强制：拒绝任何违规的 Pod；审计：允许创建 Pod，但记录违规行为；或警告：它会向用户发送警告消息，并且允许该 Pod。

<!--
**CRAIG BOX: You mentioned there that PodSecurityPolicy is due to be deprecated in two releases' time. Are we lining up these features so that pod security admission will be GA at that time?**

REY LEJANO: Yes. Absolutely. I'll talk about that for another feature in a little bit as well. There's also another feature that went to GA. It was an API that went to GA, and therefore the Beta API is now deprecated. I'll talk about that a little bit.
-->
**CRAIG BOX：你提到 PodSecurityPolicy 将在两个版本的时间内被弃用。我们是否对这些功能进行了排列，以便届时 Pod 安全接纳将成为 GA？**

REY LEJANO：是的。当然可以。我稍后也会为另一个功能谈谈这个问题。还有另一个功能也进入了 GA。这是一个归入 GA 的 API，
因此 Beta 版的 API 现在被废弃了。我稍稍讲一下这个问题。

<!--
**CRAIG BOX: All right. Let's talk about what's next on the list.**

REY LEJANO: Let's move on to more stable enhancements. One is the [TTL controller](https://github.com/kubernetes/enhancements/issues/592). This cleans up jobs and pods after the jobs are finished. There is a TTL timer that starts when the job or pod is finished. This TTL controller watches all the jobs, and ttlSecondsAfterFinished needs to be set. The controller will see if the ttlSecondsAfterFinished, combined with the last transition time, if it's greater than now. If it is, then it will delete the job and the pods of that job.
-->
**CRAIG BOX：好吧。让我们来谈谈名单上的下一个问题。**

REY LEJANO：让我们继续讨论更稳定的增强功能。一种是 [TTL 控制器](https://github.com/kubernetes/enhancements/issues/592)。
它在作业完成后清理作业和 Pod。有一个 TTL 计时器在作业或 Pod 完成后开始计时。此 TTL 控制器监视所有作业，
并且需要设置 ttlSecondsAfterFinished。该控制器将查看 ttlSecondsAfterFinished，结合最后的过渡时间，如果它大于现在。
如果是，那么它将删除该作业和该作业的 Pod。

<!--
**CRAIG BOX: Loosely, it could be called a garbage collector?**

REY LEJANO: Yes. Garbage collector for pods and jobs, or jobs and pods.
-->
**CRAIG BOX：粗略地说，它可以称为垃圾收集器吗？**

REY LEJANO：是的。用于 Pod 和作业，或作业和 Pod 的垃圾收集器。

<!--
**CRAIG BOX: If Kubernetes is truly becoming a programming language, it of course has to have a garbage collector implemented.**

REY LEJANO: Yeah. There's another one, too, coming in Alpha. [CHUCKLES]
-->
**CRAIG BOX：如果 Kubernetes 真正成为一种编程语言，它当然必须实现垃圾收集器。**

REY LEJANO：是的。还有另一个，也将在 Alpha 中出现。[笑]

<!--
**CRAIG BOX: Tell me about that.**

REY LEJANO: That one is coming in in Alpha. It's actually one of my favorite features, because there's only a few that I'm going to highlight today. [PVCs for StafeulSet will be cleaned up](https://github.com/kubernetes/enhancements/issues/1847). It will auto-delete PVCs created by StatefulSets, when you delete that StatefulSet.
-->
**CRAIG BOX：告诉我。**

REY LEJANO： 那个是在 Alpha 中出现的。这实际上是我最喜欢的功能之一，今天我只想强调几个。
[StafeulSet 的 PVC 将被清理](https://github.com/kubernetes/enhancements/issues/1847)。
当你删除那个 StatefulSet 时，它将自动删除由 StatefulSets 创建的 PVC。


<!--
**CRAIG BOX: What's next on our tour of stable features?**

REY LEJANO: Next one is, [skip volume ownership change goes to stable](https://github.com/kubernetes/enhancements/issues/695). This is from SIG Storage. There are times when you're running a stateful application, like many databases, they're sensitive to permission bits changing underneath. Currently, when a volume is bind mounted inside the container, the permissions of that volume will change recursively. It might take a really long time.
-->
**CRAIG BOX：我们的稳定功能之旅的下一步是什么？**

REY LEJANO：下一个是，[跳过卷所有权更改进入稳定状态](https://github.com/kubernetes/enhancements/issues/695)。
这是来自 SIG 存储。有的时候，当你运行一个有状态的应用程序时，就像许多数据库一样，它们对下面的权限位变化很敏感。
目前，当一个卷被绑定安装在容器内时，该卷的权限将递归更改。这可能需要很长时间。
-->

<!--
Now, there's a field, the fsGroupChangePolicy, which allows you, as a user, to tell Kubernetes how you want the permission and ownership change for that volume to happen. You can set it to always, to always change permissions, or just on mismatch, to only do it when the permission ownership changes at the top level is different from what is expected.
-->
现在，有一个字段，即 fsGroupChangePolicy，它允许你作为用户告诉 Kubernetes 你希望如何更改该卷的权限和所有权。
你可以将其设置为总是、始终更改权限，或者只是在不匹配的情况下，只在顶层的权限所有权变化与预期不同的情况下进行。

<!--
**CRAIG BOX: It does feel like a lot of these enhancements came from a very particular use case where someone said, "hey, this didn't work for me and I've plumbed in a feature that works with exactly the thing I need to have".**

REY LEJANO: Absolutely. People create issues for these, then create Kubernetes enhancement proposals, and then get targeted for releases.
-->
**CRAIG BOX：确实感觉很多这些增强功能都来自一个非常特殊的用例，有人说，“嘿，这对我来说不起作用，我已经研究了一个功能，它可以完全满足我需要的东西”**

REY LEJANO：当然可以。人们为这些问题创建问题，然后创建 Kubernetes 增强提案，然后被列为发布目标。

<!--
**CRAIG BOX: Another GA feature in this release — ephemeral volumes.**

REY LEJANO: We've always been able to use empty dir for ephemeral volumes, but now we could actually have [ephemeral inline volumes](https://github.com/kubernetes/enhancements/issues/1698), meaning that you could take your standard CSI driver and be able to use ephemeral volumes with it.
-->
**CRAIG BOX：此版本中的另一个 GA 功能--临时卷。**

REY LEJANO：我们一直能够将空目录用于临时卷，但现在我们实际上可以拥有[临时内联卷] (https://github.com/kubernetes/enhancements/issues/1698)，
这意味着你可以使用标准 CSI 驱动程序并能够与它一起使用临时卷。

<!--
**CRAIG BOX: And, a long time coming, [CronJobs](https://github.com/kubernetes/enhancements/issues/19).**

REY LEJANO: CronJobs is a funny one, because it was stable before 1.23. For 1.23, it was still tracked,but it was just cleaning up some of the old controller. With CronJobs, there's a v2 controller. What was cleaned up in 1.23 is just the old v1 controller.
-->
**CRAIG BOX：而且，很长一段时间，[CronJobs](https://github.com/kubernetes/enhancements/issues/19)。**

REY LEJANO：CronJobs 很有趣，因为它在 1.23 之前是稳定的。对于 1.23，它仍然被跟踪，但它只是清理了一些旧控制器。
使用 CronJobs，有一个 v2 控制器。1.23 中清理的只是旧的 v1 控制器。

<!--
**CRAIG BOX: Were there any other duplications or major cleanups of note in this release?**

REY LEJANO: Yeah. There were a few you might see in the major themes. One's a little tricky, around FlexVolumes. This is one of the efforts from SIG Storage. They have an effort to migrate in-tree plugins to CSI drivers. This is a little tricky, because FlexVolumes were actually deprecated in November 2020. We're [formally announcing it in 1.23](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors).
-->
**CRAIG BOX：在这个版本中，是否有任何其他的重复或重大的清理工作值得注意？**

REY LEJANO：是的。有几个你可能会在主要的主题中看到。其中一个有点棘手，围绕 FlexVolumes。这是 SIG 存储公司的努力之一。
他们正在努力将树内插件迁移到 CSI 驱动。这有点棘手，因为 FlexVolumes 实际上是在 2020 年 11 月被废弃的。我们
[在 1.23 中正式宣布](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)。

<!--
**CRAIG BOX: FlexVolumes, in my mind, predate CSI as a concept. So it's about time to get rid of them.**

REY LEJANO: Yes, it is. There's another deprecation, just some [klog specific flags](https://kubernetes.io/docs/concepts/cluster-administration/system-logs/#klog), but other than that, there are no other big deprecations in 1.23.
-->
**CRAIG BOX：在我看来，FlexVolumes 比 CSI 这个概念还要早。所以现在是时候摆脱它们了。**

REY LEJANO：是的。还有另一个弃用，只是一些 [klog 特定标志](https://kubernetes.io/docs/concepts/cluster-administration/system-logs/#klog)，但除此之外，1.23 中没有其他大的弃用。

<!--
**CRAIG BOX: The buzzword of the last KubeCon, and in some ways the theme of the last 12 months, has been secure software supply chain. What work is Kubernetes doing to improve in this area?**

REY LEJANO: For 1.23, Kubernetes is now SLSA compliant at Level 1, which means that provenance attestation files that describe the staging and release phases of the release process are satisfactory for the SLSA framework.
-->
**CRAIG BOX：上一届 KubeCon 的流行语，在某种程度上也是过去 12 个月的主题，是安全的软件供应链。Kubernetes 在这一领域做了哪些改进工作？**

REY LEJANO：对于 1.23 版本，Kubernetes 现在符合 SLSA 的 1 级标准，这意味着描述发布过程中分期和发布阶段的证明文件对于 SLSA 框架来说是令人满意的。

<!--
**CRAIG BOX: What needs to happen to step up to further levels?**

REY LEJANO: Level 1 means a few things — that the build is scripted; that the provenance is available, meaning that the artifacts are verified and they're handed over from one phase to the next; and describes how the artifact is produced. Level 2 means that the source is version-controlled, which it is, provenance is authenticated, provenance is service-generated, and there is a build service. There are four levels of SLSA compliance.
-->
**CRAIG BOX：需要做什么才能提升到更高的水平？**

REY LEJANO：级别 1 意味着一些事情——构建是脚本化的；出处是可用的，这意味着工件是经过验证，并且已从一个阶段移交到下一个阶段；
并描述了工件是如何产生的。级别 2 意味着源是受版本控制的，也就是说，源是经过身份验证的，源是服务生成的，并且存在构建服务。SLSA 的合规性分为四个级别。

<!--
**CRAIG BOX: It does seem like the levels were largely influenced by what it takes to build a big, secure project like this. It doesn't seem like it will take a lot of extra work to move up to verifiable provenance, for example. There's probably just a few lines of script required to meet many of those requirements.**

REY LEJANO: Absolutely. I feel like we're almost there; we'll see what will come out of 1.24. And I do want to give a big shout-out to SIG Release and Release Engineering, primarily to Adolfo García Veytia, who is aka Puerco on GitHub and on Slack. He's been driving this forward.
-->
**CRAIG BOX：看起来这些水平在很大程度上受到了建立这样一个大型安全项目的影响。例如，似乎不需要很多额外的工作来提升到可验证的出处。
可能只需要几行脚本即可满足其中许多要求。**

REY LEJANO：当然。我觉得我们就快成功了；我们会看到 1.24 版本会出现什么。我确实想对 SIG 发布和发布工程部大加赞赏，
主要是 Adolfo García Veytia，他在 GitHub 和 Slack 上又名 Puerco。 他一直在推动这一进程。

<!--
**CRAIG BOX: You've mentioned some APIs that are being graduated in time to replace their deprecated version. Tell me about the new HPA API.**

REY LEJANO: The [horizontal pod autoscaler v2 API](https://github.com/kubernetes/enhancements/issues/2702), is now stable, which means that the v2beta2 API is deprecated. Just for everyone's knowledge, the v1 API is not being deprecated. The difference is that v2 adds support for multiple and custom metrics to be used for HPA.
-->
**CRAIG BOX：你提到了一些 API 正在及时升级以替换其已弃用的版本。告诉我有关新 HPA API 的信息。**

REY LEJANO：[horizontal pod autoscaler v2 API](https://github.com/kubernetes/enhancements/issues/2702)，
现已稳定，这意味着 v2beta2 API 已弃用。众所周知，v1 API 并未被弃用。不同之处在于 v2 添加了对用于 HPA 的多个和自定义指标的支持。

<!--
**CRAIG BOX: There's also now a facility to validate my CRDs with an expression language.**

REY LEJANO: Yeah. You can use the [Common Expression Language, or CEL](https://github.com/google/cel-spec), to validate your CRDs, so you no longer need to use webhooks. This also makes the CRDs more self-contained and declarative, because the rules are now kept within the CRD object definition.
-->
**CRAIG BOX：现在还可以使用表达式语言验证我的 CRD。**

REY LEJANO：是的。你可以使用 [通用表达式语言，或 CEL](https://github.com/google/cel-spec)
来验证你的 CRD，因此你不再需要使用 webhook。这也使 CRD 更加自包含和声明性，因为规则现在保存在 CRD 对象定义中。

<!--
**CRAIG BOX: What new features, perhaps coming in Alpha or Beta, have taken your interest?**

REY LEJANO: Aside from pod security policies, I really love [ephemeral containers](https://github.com/kubernetes/enhancements/issues/277) supporting kubectl debug. It launches an ephemeral container and a running pod, shares those pod namespaces, and you can do all your troubleshooting with just running kubectl debug.
-->
**CRAIG BOX：哪些新功能（可能是 Alpha 版或 Beta 版）引起了你的兴趣？**

REY LEJANO：除了 Pod 安全策略，我真的很喜欢支持 kubectl 调试的[临时容器](https://github.com/kubernetes/enhancements/issues/277)。
它启动一个临时容器和一个正在运行的 Pod，共享这些 Pod 命名空间，你只需运行 kubectl debug 即可完成所有故障排除。

<!--
**CRAIG BOX: There's also been some interesting changes in the way that events are handled with kubectl.**

REY LEJANO: Yeah. kubectl events has always had some issues, like how things weren't sorted. [kubectl events improved](https://github.com/kubernetes/enhancements/issues/1440) that so now you can do `--watch`, and it will also sort with the `--watch` option as well. That is something new. You can actually combine fields and custom columns. And also, you can list events in the timeline with doing the last N number of minutes. And you can also sort events using other criteria as well.
-->
**CRAIG BOX：使用 kubectl 处理事件的方式也发生了一些有趣的变化。**

REY LEJANO：是的。kubectl events 总是有一些问题，比如事情没有排序。
[kubectl 事件得到了改进](https://github.com/kubernetes/enhancements/issues/1440)，
所以现在你可以使用 `--watch`，它也可以使用 `--watch` 选项进行排序。那是新事物。
你实际上可以组合字段和自定义列。此外，你可以在时间线中列出最后 N 分钟的事件。你还可以使用其他标准对事件进行排序。

<!--
**CRAIG BOX: You are a field engineer at SUSE. Are there any things that are coming in that your individual customers that you deal with are looking out for?**

REY LEJANO: More of what I look out for to help the customers.
-->
**CRAIG BOX：你是 SUSE 的一名现场工程师。有什么事情是你所处理的个别客户所要注意的吗？**

REY LEJANO：更多我期待帮助客户的东西。

<!--
**CRAIG BOX: Right.**

REY LEJANO: I really love kubectl events. Really love the PVCs being cleaned up with StatefulSets. Most of it's for selfish reasons that it will improve troubleshooting efforts. [CHUCKLES]
-->
**CRAIG BOX：好吧。**

REY LEJANO：我真的很喜欢 kubectl 事件。真的很喜欢用 StatefulSets 清理的 PVC。其中大部分是出于自私的原因，它将改进故障排除工作。[笑]

<!--
**CRAIG BOX: I have always hoped that a release team lead would say to me, "yes, I have selfish reasons. And I finally got something I wanted in."**

REY LEJANO: [LAUGHS]
-->
**CRAIG BOX：我一直希望发布团队负责人对我说：“是的，我有自私的理由。我终于得到了我想要的东西。”**

REY LEJANO：[大笑]

<!--
**CRAIG BOX: Perhaps I should run to be release team lead, just so I can finally get init containers fixed once and for all.**

REY LEJANO: Oh, init containers, I've been looking for that for a while. I've actually created animated GIFs on how init containers will be run with that Kubernetes enhancement proposal, but it's halted currently.
-->
**CRAIG BOX：也许我应该竞选发布团队的负责人，这样我就可以最终让 Init 容器一劳永逸地得到修复。**

REY LEJANO：哦，Init 容器，我一直在寻找它。实际上，我已经制作了 GIF 动画，介绍了 Init 容器将如何与那个 Kubernetes 增强提案一起运行，但目前已经停止了。

<!--
**CRAIG BOX: One day.**

REY LEJANO: One day. Maybe I shouldn't stay halted.
-->
**CRAIG BOX：有一天。**

REY LEJANO：总有一天。也许我不应该停下来。

<!--
**CRAIG BOX: You mentioned there are obviously the things you look out for. Are there any things that are coming down the line, perhaps Alpha features or maybe even just proposals you've seen lately, that you're personally really looking forward to seeing which way they go?**

REY LEJANO: Yeah. Oone is a very interesting one, it affects the whole community, so it's not just for personal reasons. As you may have known, Dockershim is deprecated. And we did release a blog that it will be removed in 1.24.
-->
**CRAIG BOX：你提到的显然是你所关注的事情。是否有任何即将推出的东西，可能是 Alpha 功能，甚至可能只是你最近看到的建议，你个人真的很期待看到它们的发展方向？**

REY LEJANO：是的。Oone 是一个非常有趣的问题，它影响了整个社区，所以这不仅仅是出于个人原因。
正如你可能已经知道的，Dockershim 已经被废弃了。而且我们确实发布了一篇博客，说它将在 1.24 中被删除。

<!--
**CRAIG BOX: Scared a bunch of people.**

REY LEJANO: Scared a bunch of people. From a survey, we saw that a lot of people are still using Docker and Dockershim. One of the enhancements for 1.23 is, [kubelet CRI goes to Beta](https://github.com/kubernetes/enhancements/issues/2040). This promotes the CRI API, which is required. This had to be in Beta for Dockershim to be removed in 1.24.
-->
**CRAIG BOX：吓坏了一群人。**

REY LEJANO：吓坏了一群人。从一项调查中，我们看到很多人仍在使用 Docker 和 Dockershim。
1.23 的增强功能之一是 [kubelet CRI 进入 Beta 版](https://github.com/kubernetes/enhancements/issues/2040)。 
这促进了 CRI API 的发展，而这是必需的。 这必须是 Beta 版才能在 1.24 中删除 Dockershim。

<!--
**CRAIG BOX: Now, in the last release team lead interview, [we spoke with Savitha Raghunathan](https://kubernetespodcast.com/episode/157-kubernetes-1.22/), and she talked about what she would advise you as her successor. It was to look out for the mental health of the team members. How were you able to take that advice on board?**

REY LEJANO: That was great advice from Savitha. A few things I've made note of with each release team meeting. After each release team meeting, I stop the recording, because we do record all the meetings and post them on YouTube. And I open up the floor to anyone who wants to say anything that's not recorded, that's not going to be on the agenda. Also, I tell people not to work on weekends. I broke this rule once, but other than that, I told people it could wait. Just be mindful of your mental health.
-->
**CRAIG BOX：现在，在最后一次发布团队领导访谈中，[我们与 Savitha Raghunathan 进行了交谈](https://kubernetespodcast.com/episode/157-kubernetes-1.22/)，
她谈到了作为她的继任者她会给你什么建议。她说要关注团队成员的心理健康。你是如何采纳这个建议的？

REY LEJANO：Savitha 的建议很好。我在每次发布团队会议上都记录了一些事情。 
每次发布团队会议后，我都会停止录制，因为我们确实会录制所有会议并将其发布到 YouTube 上。
我向任何想要说任何未记录的内容的人开放发言，这不会出现在议程上。此外，我告诉人们不要在周末工作。
我曾经打破过这个规则，但除此之外，我告诉人们它可以等待。只要注意你的心理健康。

<!--
**CRAIG BOX: It's just been announced that [James Laverack from Jetstack](https://twitter.com/JamesLaverack/status/1466834312993644551) will be the release team lead for 1.24. James and I shared an interesting Mexican dinner at the last KubeCon in San Diego.**

REY LEJANO: Oh, nice. I didn't know you knew James.
-->
**CRAIG BOX：刚刚宣布[来自 Jetstack 的 James Laverack](https://twitter.com/JamesLaverack/status/1466834312993644551)
将成为 1.24 的发布团队负责人。James 和我在 San Diego 的最后一届 KubeCon 上分享了一顿有趣的墨西哥晚餐。**

REY LEJANO：哦，不错。我不知道你认识 James。

<!--
**CRAIG BOX: The British tech scene. We're a very small world. What will your advice to James be?**

REY LEJANO: What I would tell James for 1.24 is use teachable moments in the release team meetings. When you're a shadow for the first time, it's very daunting. It's very difficult, because you don't know the repos. You don't know the release process. Everyone around you seems like they know the release process, and very familiar with what the release process is. But as a first-time shadow, you don't know all the vernacular for the community. I just advise to use teachable moments. Take a few minutes in the release team meetings to make it a little easier for new shadows to ramp up and to be familiar with the release process.
-->
**CRAIG BOX：英国科技界。我们是一个非常小的世界。你对 James 的建议是什么？**

REY LEJANO：对于 1.24，我要告诉 James 的是在发布团队会议中使用教学时刻。当你第一次成为影子时，这是非常令人生畏的。
这非常困难，因为你不知道存储库。你不知道发布过程。周围的每个人似乎都知道发布过程，并且非常熟悉发布过程是什么。 
但作为第一次出现的影子，你并不了解社区的所有白话。我只是建议使用教学时刻。在发布团队会议上花几分钟时间，让新影子更容易上手并熟悉发布过程。

<!--
**CRAIG BOX: Has there been major evolution in the process in the time that you've been involved? Or do you think that it's effectively doing what it needs to do?**

REY LEJANO: It's always evolving. I remember my first time in release notes, 1.18, we said that our goal was to automate and program our way out so that we don't have a release notes team anymore. That's changed [CHUCKLES] quite a bit. Although there's been significant advancements in the release notes process by Adolfo and also James, they've created a subcommand in krel to generate release notes.
-->
**CRAIG BOX：在你参与的这段时间里，这个过程是否有重大演变？或者你认为它正在有效地做它需要做的事情？**

REY LEJANO：它总是在不断发展。我记得我第一次做发布说明时，1.18，我们说我们的目标是自动化和编程，这样我们就不再有发行说明团队了。
这改变了很多[笑]。尽管 Adolfo 和 James 在发布说明过程中取得了重大进展，但他们在 krel 中创建了一个子命令来生成发行说明。

<!--
But nowadays, all their release notes are richer. Still not there at the automation process yet. Every release cycle, there is something a little bit different. For this release cycle, we had a production readiness review deadline. It was a soft deadline. A production readiness review is a review by several people in the community. It's actually been required since 1.21, and it ensures that the enhancements are observable, scalable, supportable, and it's safe to operate in production, and could also be disabled or rolled back. In 1.23, we had a deadline to have the production readiness review completed by a specific date.
-->
但如今，他们所有的发行说明都更加丰富了。在自动化过程中，仍然没有达到。每个发布周期，都有一点不同的东西。
对于这个发布周期，我们有一个生产就绪审查截止日期。这是一个软期限。生产就绪审查是社区中几个人的审查。
实际上从 1.21 开始就需要它，它确保增强是可观察的、可扩展的、可支持的，并且在生产中运行是安全的，也可以被禁用或回滚。 
在 1.23 中，我们有一个截止日期，要求在特定日期之前完成生产就绪审查。

<!--
**CRAIG BOX: How have you found the change of schedule to three releases per year rather than four?**

REY LEJANO: Moving to three releases a year from four, in my opinion, has been an improvement, because we support the last three releases, and now we can actually support the last releases in a calendar year instead of having 9 months out of 12 months of the year.
-->
**CRAIG BOX：你如何发现每年发布三个版本，而不是四个版本？**

REY LEJANO：从一年四个版本转为三个版本，在我看来是一种进步，因为我们支持最后三个版本，
现在我们实际上可以支持在一个日历年内的最后一个版本，而不是在 12 个月中只有 9 个月。

<!--
**CRAIG BOX: The next event on the calendar is a [Kubernetes contributor celebration](https://www.kubernetes.dev/events/kcc2021/) starting next Monday. What can we expect from that event?**

REY LEJANO: This is our second time running this virtual event. It's a virtual celebration to recognize the whole community and all of our accomplishments of the year, and also contributors. There's a number of events during this week of celebration. It starts the week of December 13.
-->
**CRAIG BOX：日历上的下一个活动是下周一开始的 [Kubernetes 贡献者庆典](https://www.kubernetes.dev/events/kcc2021/)。我们可以从活动中期待什么？**

REY LEJANO：这是我们第二次举办这个虚拟活动。这是一个虚拟的庆祝活动，以表彰整个社区和我们今年的所有成就，以及贡献者。
在这周的庆典中有许多活动。它从 12 月 13 日的那一周开始。

<!--
There's events like the Kubernetes Contributor Awards, where SIGs honor and recognize the hard work of the community and contributors. There's also a DevOps party game as well. There is a cloud native bake-off. I do highly suggest people to go to [kubernetes.dev/celebration](https://www.kubernetes.dev/events/past-events/2021/kcc2021/) to learn more.
-->
有像 Kubernetes 贡献者奖这样的活动，SIG 对社区和贡献者的辛勤工作进行表彰和奖励。
也有一个 DevOps 聚会游戏。还有一个云原生的烘烤活动。我强烈建议人们去
[kubernetes.dev/celebration](https://www.kubernetes.dev/events/past-events/2021/kcc2021/)
了解更多。

<!--
**CRAIG BOX: How exactly does one judge a virtual bake-off?**

REY LEJANO: That I don't know. [CHUCKLES]
-->
**CRAIG BOX： 究竟如何评判一个虚拟的烘焙比赛呢？**

REY LEJANO：那我不知道。[笑]

<!--
**CRAIG BOX: I tasted my scones. I think they're the best. I rate them 10 out of 10.**

REY LEJANO: Yeah. That is very difficult to do virtually. I would have to say, probably what the dish is, how closely it is tied with Kubernetes or open source or to CNCF. There's a few judges. I know Josh Berkus and Rin Oliver are a few of the judges running the bake-off.
-->
**CRAIG BOX：我尝了尝我的烤饼。我认为他们是最好的。我给他们打了 10 分（满分 10 分）。**

REY LEJANO：是的。这是很难做到的。我不得不说，这道菜可能是什么，它与 Kubernetes 或开源或与 CNCF 的关系有多密切。
有几个评委。我知道 Josh Berkus 和 Rin Oliver 是主持烘焙比赛的几个评委。

<!--
**CRAIG BOX: Yes. We spoke with Josh about his love of the kitchen, and so he seems like a perfect fit for that role.**

REY LEJANO: He is.
-->
**CRAIG BOX：是的。我们与 Josh 谈到了他对厨房的热爱，因此他似乎非常适合这个角色。**

REY LEJANO：他是。

<!--
**CRAIG BOX: Finally, your wife and yourself are expecting your first child in January. Have you had a production readiness review for that?**

REY LEJANO: I think we failed that review. [CHUCKLES]
-->
**CRAIG BOX：最后，你的妻子和你自己将在一月份迎来你们的第一个孩子。你是否为此进行过生产准备审查？**

REY LEJANO：我认为我们没有通过审查。[笑]

<!--
**CRAIG BOX: There's still time.**

REY LEJANO: We are working on refactoring. We're going to refactor a little bit in December, and `--apply` again.
-->
**CRAIG BOX：还有时间。**

REY LEJANO：我们正在努力重构。我们将在 12 月进行一些重构，然后再次使用 `--apply`。

---

<!--
_[Rey Lejano](https://twitter.com/reylejano) is a field engineer at SUSE, by way of Rancher Labs, and was the release team lead for Kubernetes 1.23. He is now also a co-chair for SIG Docs. His son Liam is now 3 and a half months old._

_You can find the [Kubernetes Podcast from Google](http://www.kubernetespodcast.com/) at [@KubernetesPod](https://twitter.com/KubernetesPod) on Twitter, and you can [subscribe](https://kubernetespodcast.com/subscribe/) so you never miss an episode._
-->
**[Rey Lejano](https://twitter.com/reylejano) 是 SUSE 的一名现场工程师，来自 Rancher Labs，并且是 Kubernetes 1.23 的发布团队负责人。
他现在也是 SIG Docs 的联合主席。他的儿子 Liam 现在 3 个半月大。**

**你可以在 Twitter 上的 [@KubernetesPod](https://twitter.com/KubernetesPod)
找到[来自谷歌的 Kubernetes 播客](http://www.kubernetespodcast.com/)，
你也可以[订阅](https://kubernetespodcast.com/subscribe/)，这样你就不会错过任何一集。**
