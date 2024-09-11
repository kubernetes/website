---
layout: blog
title: "走进 Kubernetes 读书会（Book Club）"
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
学习 Kubernetes 及其整个生态的技术并非易事。在本次采访中，我们的访谈对象是
[Carlos Santana (AWS)](https://www.linkedin.com/in/csantanapr/)，
了解他是如何创办 [Kubernetes 读书会（Book Club）](https://community.cncf.io/kubernetes-virtual-book-club/)的，
整个读书会是如何运作的，以及大家如何加入其中，进而更好地利用社区学习体验。

<!--
![Carlos Santana speaking at KubeCon NA 2023](csantana_k8s_book_club.jpg)

**Frederico Muñoz (FSM)**: Hello Carlos, thank you so much for your availability. To start with,
could you tell us a bit about yourself?
-->
![Carlos Santana 在 KubeCon NA 2023 上演讲](csantana_k8s_book_club.jpg)

**Frederico Muñoz (FSM)**：你好 Carlos，非常感谢你能接受我们的采访。首先，你能介绍一下自己吗？

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
**Carlos Santana (CS)**：当然可以。六年前，我在生产环境中部署 Kubernetes 的经验为我加入
[Knative](https://knative.dev/) 并通过 Release Team 为 Kubernetes 贡献代码打开了大门。
为上游 Kubernetes 工作是我在开源领域最好的经历之一。在过去的两年里，作为 AWS 的高级专业解决方案架构师，
我一直在帮助大型企业在 Kubernetes 之上构建他们的内部开发平台（IDP）。
未来我的开源贡献将主要集中在 [CNOE](https://cnoe.io/) 和 CNCF 项目，如
[Argo](https://github.com/argoproj)、[Crossplane](https://www.crossplane.io/) 和
[Backstage](https://www.cncf.io/projects/backstage/)。

<!--
## Creating the Book Club

**FSM**: So your path led you to Kubernetes, and at that point what was the motivating factor for
starting the Book Club?
-->
## 创办读书会

**FSM**：所以你的职业道路把你引向了 Kubernetes，那么是什么动机促使你开始创办读书会呢？

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
**CS**：Kubernetes 读书会的想法源于一次 [TGIK](https://github.com/vmware-archive/tgik) 直播中的一个临时建议。
对我来说，这不仅仅是读一本书，更是创办一个学习社区。这个社区平台不仅是知识的来源，也是一个支持系统，
特别是在疫情期间陪我度过了艰难时刻。读书会的这项倡议后来帮助许多成员学会了应对和成长，这让我感到很欣慰。
我们在 2021 年 3 月 5 日开始第一本书
[Production Kubernetes](https://www.oreilly.com/library/view/production-kubernetes/9781492092292/)，
花了 36 周时间。目前，一本书不会再花那么长时间了，如今每周会完成一到两章。

<!--
**FSM**: Could you describe the way the Kubernetes Book Club works? How do you select the books and how
do you go through them?

**CS**: We collectively choose books based on the interests and needs of the group. This practical
approach helps members, especially beginners, grasp complex concepts more easily. We have two weekly
series, one for the EMEA timezone, and I organize the US one. Each organizer works with their co-host
and picks a book on Slack, then sets up a lineup of hosts for a couple of weeks to discuss each
chapter.
-->
**FSM**：你能介绍一下 Kubernetes 读书会是如何运作的吗？你们如何选书以及如何阅读它们？

**CS**：我们根据小组的兴趣和需求以集体的方式选书。这种实用的方法有助于成员们（特别是初学者）更容易地掌握复杂的概念。
我们每周有两次读书会应对不同的时区，一个针对 EMEA（欧洲、中东及非洲）时区，另一个是由我自己负责的美国时区。
每位组织者与他们的联合主持人在 Slack 上甄选一本书，然后安排几个主持人用几周时间讨论每一章。

<!--
**FSM**: If I’m not mistaken, the Kubernetes Book Club is in its 17th book, which is significant: is
there any secret recipe for keeping things active?

**CS**: The secret to keeping the club active and engaging lies in a couple of key factors.
-->
**FSM**：如果我没记错的话，Kubernetes 读书会如今已经进行到了第 17 本书。这很了不起：有什么秘诀可以让读书这件事保持活跃吗？

**CS**：保持俱乐部活跃和吸引人参与的秘诀在于几个关键因素。

<!--
Firstly, consistency has been crucial. We strive to maintain a regular schedule, only cancelling
meetups for major events like holidays or KubeCon. This regularity helps members stay engaged and
builds a reliable community.

Secondly, making the sessions interesting and interactive has been vital. For instance, I often
introduce pop-up quizzes during the meetups, which not only tests members' understanding but also
adds an element of fun. This approach keeps the content relatable and helps members understand how
theoretical concepts are applied in real-world scenarios.
-->
首先，一贯性至关重要。我们努力保持定期聚会，只有在重大事件如节假日或 KubeCon 时才会取消聚会。
这种规律性有助于成员保持惯性参与，有助于建立一个可靠的社区。

其次，让聚会有趣生动也非常重要。例如，我经常在聚会期间引入提问测验，不仅检测成员们的理解程度，还增加了一些乐趣。
这种方法使读书内容更加贴近实际，并帮助成员们理解理论概念在现实世界中的运用方式。

<!--
## Topics covered in the Book Club

**FSM**: The main topics of the books have been Kubernetes, GitOps, Security, SRE, and
Observability: is this a reflection of the cloud native landscape, especially in terms of
popularity?
-->
## 读书会涵盖的话题

**FSM**：书籍的主要话题包括 Kubernetes、GitOps、安全、SRE 和可观测性：
这是否也反映了云原生领域的现状，特别是在受欢迎程度方面？

<!--
**CS**: Our journey began with 'Production Kubernetes', setting the tone for our focus on practical,
production-ready solutions. Since then, we've delved into various aspects of the CNCF landscape,
aligning our books with a different theme.  Each theme, whether it be Security, Observability, or
Service Mesh, is chosen based on its relevance and demand within the community. For instance, in our
recent themes on Kubernetes Certifications, we brought the book authors into our fold as active
hosts, enriching our discussions with their expertise.
-->
**CS**：我们的旅程始于《Production Kubernetes》，为我们专注于实用、生产就绪的解决方案定下了基调。
从那时起，我们深入探讨了 CNCF 领域的各个方面，根据不同的主题去选书。
每个主题，无论是安全性、可观测性还是服务网格，都是根据其相关性和社区需求来选择的。
例如，在我们最近关于 Kubernetes 考试认证的主题中，我们邀请了书籍的作者作为活跃现场的主持人，用他们的专业知识丰富了我们的讨论。

<!--
**FSM**: I know that the project had recent changes, namely being integrated into the CNCF as a
[Cloud Native Community Group](https://community.cncf.io/). Could you talk a bit about this change?

**CS**: The CNCF graciously accepted the book club as a Cloud Native Community Group. This is a
significant development that has streamlined our operations and expanded our reach. This alignment
has been instrumental in enhancing our administrative capabilities, similar to those used by
Kubernetes Community Days (KCD) meetups. Now, we have a more robust structure for memberships, event
scheduling, mailing lists, hosting web conferences, and recording sessions.
-->
**FSM**：我了解到此项目最近有一些变化，即被整合到了 CNCF
作为[云原生社区组（Cloud Native Community Group）](https://community.cncf.io/)的一部分。你能谈谈这个变化吗？

**CS**：CNCF 慷慨地接受了读书会作为云原生社区组的一部分。
这是读书会发展过程中的重要一步，优化了读书会的运作并扩大了读书会的影响力。
这种拉齐对于增强读书会的管理能力至关重要，这点很像 Kubernetes Community Days (KCD) 聚会。
现在，读书会有了更稳健的会员结构、活动安排、邮件列表、托管的网络会议和录播系统。

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
**FSM**：在过去的六个月里，你参与 CNCF 这件事对 Kubernetes 读书会的成长和参与度产生了什么影响？

**CS**：自从六个月前成为 CNCF 社区的一部分以来，我们在 Kubernetes 读书会中看到了一些显著的变化。
我们的会员人数激增至 600 多人，并在此期间成功组织并举办了超过 40 场活动。
更令人鼓舞的是，每场活动的出席人数都很稳定，平均约有 30 人参加。
这种增长和参与度清楚地表明了我们与 CNCF 的合作让 Kubernetes 读书会在社区中增强了影响力。

<!--
## Joining the Book Club

**FSM**: For anyone wanting to join, what should they do?

**CS**: There are three steps to join:
-->
## 加入读书会

**FSM**：若有人想加入读书会，他们应该怎么做？

**CS**：加入读书会只需三步：

<!--
- First, join the [Kubernetes Book Club Community](https://community.cncf.io/kubernetes-virtual-book-club/)
- Then RSVP to the
  [events](https://community.cncf.io/kubernetes-virtual-book-club/)
  on the community page
- Lastly, join the CNCF Slack channel
  [#kubernetes-book-club](https://cloud-native.slack.com/archives/C05EYA14P37).
-->
- 首先加入 [Kubernetes 读书会社区](https://community.cncf.io/kubernetes-virtual-book-club/)
- 然后注册参与在社区页面上列出的[活动](https://community.cncf.io/kubernetes-virtual-book-club/)
- 最后加入 CNCF Slack 频道 [#kubernetes-book-club](https://cloud-native.slack.com/archives/C05EYA14P37)。

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
**FSM**：太好了，谢谢你！最后你还有什么想法要跟大家分享吗？

**CS**：Kubernetes 读书会不仅仅是一个讨论书籍的专业小组，它是一个充满活力的社区，
有许多令人敬佩的志愿者帮助组织和主持聚会。我想借这次机会感谢几位志愿者：
[Neependra Khare](https://www.linkedin.com/in/neependra/)、
[Eric Smalling](https://www.linkedin.com/in/ericsmalling/)、
[Sevi Karakulak](https://www.linkedin.com/in/sevikarakulak/)、
[Chad M. Crowell](https://www.linkedin.com/in/chadmcrowell/)
和 [Walid (CNJ) Shaari](https://www.linkedin.com/in/walidshaari/)。
欢迎来 KubeCon 与我们相聚，还能领取你的 Kubernetes 读书会贴纸！
