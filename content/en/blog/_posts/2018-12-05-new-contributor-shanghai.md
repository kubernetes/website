---
layout: blog
title: 'New Contributor Workshop Shanghai'
date: 2018-12-05
author: >
  Josh Berkus (Red Hat),
  Yang Li (The Plant),
  Puja Abbassi (Giant Swarm),
  XiangPeng Zhao (ZTE)
---

{{< figure src="/images/blog/2018-12-05-new-contributor-shanghai/attendees.png" caption="Kubecon Shanghai New Contributor Summit attendees. Photo by Jerry Zhang" >}}

We recently completed our first New Contributor Summit in China, at the first KubeCon in China. It was very exciting to see all of the Chinese and Asian developers (plus a few folks from around the world) interested in becoming contributors. Over the course of a long day, they learned how, why, and where to contribute to Kubernetes, created pull requests, attended a panel of current contributors, and got their CLAs signed.

This was our second New Contributor Workshop (NCW), building on the one created and led by SIG Contributor Experience members in Copenhagen. Because of the audience, it was held in both Chinese and English, taking advantage of the superb simultaneous interpretation services the CNCF sponsored. Likewise, the NCW team included both English and Chinese-speaking members of the community: Yang Li, XiangPeng Zhao, Puja Abbassi, Noah Abrahams, Tim Pepper, Zach Corleissen, Sen Lu, and Josh Berkus. In addition to presenting and helping students, the bilingual members of the team translated all of the slides into Chinese. Fifty-one students attended.

{{< figure src="/images/blog/2018-12-05-new-contributor-shanghai/noahabrahams.png" caption="Noah Abrahams explains Kubernetes communications channels. Photo by Jerry Zhang" >}}

The NCW takes participants through the stages of contributing to Kubernetes, starting from deciding where to contribute, followed by an introduction to the SIG system and our repository structure. We also have "guest speakers" from Docs and Test Infrastructure who cover contributing in those areas. We finally wind up with some hands-on exercises in filing issues and creating and approving PRs.

Those hands-on exercises use a repository known as [the contributor playground](https://github.com/kubernetes-sigs/contributor-playground), created by SIG Contributor Experience as a place for new contributors to try out performing various actions on a Kubernetes repo. It has modified Prow and Tide automation, uses Owners files like in the real repositories. This lets students learn how the mechanics of contributing to our repositories work without disrupting normal development.

{{< figure src="/images/blog/2018-12-05-new-contributor-shanghai/yangli.png" caption="Yang Li talks about getting your PRs reviewed. Photo by Josh Berkus" >}}

Both the "Great Firewall" and the language barrier prevent contributing Kubernetes from China from being straightforward. What's more, because open source business models are not mature in China, the time for employees work on open source projects is limited.

Chinese engineers are eager to participate in the development of Kubernetes, but many of them don't know where to start since Kubernetes is such a large project. With this workshop, we hope to help those who want to contribute, whether they wish to fix some bugs they encountered, improve or localize documentation, or they need to work with Kubernetes at their work. We are glad to see more and more Chinese contributors joining the community in the past few years, and we hope to see more of them in the future.

"I have been participating in the Kubernetes community for about three years," said XiangPeng Zhao. "In the community, I notice that more and more Chinese developers are showing their interest in contributing to Kubernetes. However, it's not easy to start contributing to such a project. I tried my best to help those who I met in the community, but I think there might still be some new contributors leaving the community due to not knowing where to get help when in trouble. Fortunately, the community initiated NCW at KubeCon Copenhagen and held a second one at KubeCon Shanghai. I was so excited to be invited by Josh Berkus to help organize this workshop. During the workshop, I met community friends in person, mentored attendees in the exercises, and so on. All of this was a memorable experience for me. I also learned a lot as a contributor who already has years of contributing experience. I wish I had attended such a workshop when I started contributing to Kubernetes years ago."

{{< figure src="/images/blog/2018-12-05-new-contributor-shanghai/panel.png" caption="Panel of contributors. Photo by Jerry Zhang" >}}

The workshop ended with a panel of current contributors, featuring Lucas Käldström, Janet Kuo, Da Ma, Pengfei Ni, Zefeng Wang, and Chao Xu. The panel aimed to give both new and current contributors a look behind the scenes on the day-to-day of some of the most active contributors and maintainers, both from China and around the world. Panelists talked about where to begin your contributor's journey, but also how to interact with reviewers and maintainers. They further touched upon the main issues of contributing from China and gave attendees an outlook into exciting features they can look forward to in upcoming releases of Kubernetes.

After the workshop, Xiang Peng Zhao chatted with some attendees on WeChat and Twitter about their experiences. They were very glad to have attended the NCW and had some suggestions on improving the workshop. One attendee, Mohammad, said, "I had a great time at the workshop and learned a lot about the entire process of k8s for a contributor." Another attendee, Jie Jia, said, "The workshop was wonderful. It systematically explained how to contribute to Kubernetes. The attendee could understand the process even if s/he knew nothing about that before. For those who were already contributors, they could also learn something new. Furthermore, I could make new friends from inside or outside of China in the workshop. It was awesome!"

SIG Contributor Experience will continue to run New Contributor Workshops at each upcoming Kubecon, including Seattle, Barcelona, and the return to Shanghai in June 2019. If you failed to get into one this year, register for one at a future Kubecon. And, when you meet an NCW attendee, make sure to welcome them to the community.

Links:

* English versions of the slides: [PDF](https://gist.github.com/jberkus/889be25c234b01761ce44eccff816380#file-kubernetes-shanghai-english-pdf) or [Google Docs with speaker notes](https://docs.google.com/presentation/d/1l5f_iAFsKg50LFq3N80KbZKUIEL_tyCaUoWPzSxColo/edit?usp=sharing)
* Chinese version of the slides: [PDF](https://gist.github.com/jberkus/889be25c234b01761ce44eccff816380#file-kubernetes-shanghai-cihinese-pdf)
* [Contributor playground](https://github.com/kubernetes-sigs/contributor-playground)
