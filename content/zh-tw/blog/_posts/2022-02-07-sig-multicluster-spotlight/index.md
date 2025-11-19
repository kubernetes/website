---
layout: blog
title: "關注 SIG Multicluster"
date: 2022-02-07
slug: sig-multicluster-spotlight-2022
---
<!--
layout: blog
title: "Spotlight on SIG Multicluster"
date: 2022-02-07
slug: sig-multicluster-spotlight-2022
canonicalUrl: https://www.kubernetes.dev/blog/2022/02/04/sig-multicluster-spotlight-2022/
-->

<!--
**Authors:** Dewan Ahmed (Aiven) and Chris Short (AWS) 
-->
**作者：** Dewan Ahmed (Aiven) 和 Chris Short (AWS)

<!-- 
## Introduction

[SIG Multicluster](https://github.com/kubernetes/community/tree/master/sig-multicluster) is the SIG focused on how Kubernetes concepts are expanded and used beyond the cluster boundary. Historically, Kubernetes resources only interacted within that boundary - KRU or Kubernetes Resource Universe (not an actual Kubernetes concept). Kubernetes clusters, even now, don't really know anything about themselves or, about other clusters. Absence of cluster identifiers is a case in point. With the growing adoption of multicloud and multicluster deployments, the work SIG Multicluster doing is gaining a lot of attention. In this blog, [Jeremy Olmsted-Thompson, Google](https://twitter.com/jeremyot) and [Chris Short, AWS](https://twitter.com/ChrisShort) discuss the interesting problems SIG Multicluster is solving and how you can get involved. Their initials **JOT** and **CS** will be used for brevity. 
-->
## 簡介

[SIG Multicluster](https://github.com/kubernetes/community/tree/master/sig-multicluster)
是專注於如何拓展 Kubernetes 的概念並將其用於集羣邊界之外的 SIG。
以往 Kubernetes 資源僅在 Kubernetes Resource Universe (KRU) 這個邊界內進行交互，其中 KRU 不是一個實際的 Kubernetes 概念。
即使是現在，Kubernetes 集羣對自身或其他集羣並不真正瞭解。集羣標識符的缺失就是一個例子。
隨着多雲和多集羣部署日益普及，SIG Multicluster 所做的工作越來越受到關注。
在這篇博客中，[來自 Google 的 Jeremy Olmsted-Thompson](https://twitter.com/jeremyot) 和
[來自 AWS 的 Chris Short](https://twitter.com/ChrisShort) 討論了 SIG Multicluster
正在解決的一些有趣的問題和以及大家如何參與其中。
爲簡潔起見，下文將使用他們兩位的首字母 **JOT** 和 **CS**。

<!-- 
## A summary of their conversation

**CS**: How long has the SIG Multicluster existed and how was the SIG in its infancy? How long have you been with this SIG?

**JOT**: I've been around for almost two years in the SIG Multicluster. All I know about the infancy years is from the lore but even in the early days, it was always about solving this same problem. Early efforts have been things like [KubeFed](https://github.com/kubernetes-sigs/kubefed). I think there are still folks using KubeFed but it's a smaller slice. Back then, I think people out there deploying large numbers of Kubernetes clusters were really not at a point where we had a ton of real concrete use cases. Projects like KubeFed and [Cluster Registry](https://github.com/kubernetes-retired/cluster-registry) were developed around that time and the need back then can be associated to these projects. The motivation for these projects were how do we solve the problems that we think people are **going to have**, when they start expanding to multiple clusters. Honestly, in some ways, it was trying to do too much at that time. 
-->
## 談話總結

**CS**：SIG Multicluster 存在多久了？SIG 在起步階段情況如何？你參與這個 SIG 多長時間了？

**JOT**：我在 SIG Multicluster 工作了將近兩年。我所知道的關於初創時期的情況都來自傳說，但即使在早期，也一直是爲了解決相同的問題。
早期工作的例子之一是 [KubeFed](https://github.com/kubernetes-sigs/kubefed)。
我認爲仍然有一些人在使用 KubeFed，但它只是一小部分。
那時，我認爲人們在部署大量 Kubernetes 集羣時，還沒有達到我們擁有大量實際具體用例的地步。
像 KubeFed 和 [Cluster Registry](https://github.com/kubernetes-retired/cluster-registry)
這樣的項目就是在那個時候開發的，當時的需求可以與這些項目相關聯。
這些項目的動機是如何解決我們認爲在開始擴展到多個集羣時 **會遇到的問題**。
老實說，在某些方面，當時它試圖做得太多了。

<!-- 
**CS**: How does KubeFed differ from the current state of SIG Multicluster? How does the **lore** differ from the **now**?

**JOT**: Yeah, it was like trying to get ahead of potential problems instead of addressing specific problems. I think towards the end of 2019, there was a slow down in SIG multicluster work and we kind of picked it back up with one of the most active recent projects that is the [SIG Multicluster services (MCS)](https://github.com/kubernetes-sigs/mcs-api). 

Now this is the shift to solving real specific problems. For example, 

> I've got workloads that are spread across multiple clusters and I need them to talk to each other.  
-->
**CS**：KubeFed 與 SIG Multicluster 的現狀有何不同？**初創期** 與 **現在** 有何不同？

**JOT**：嗯嗯，這就像總是要預防潛在問題而不是解決眼前具體的問題。我認爲在 2019 年底，
SIG Multicluster 工作有所放緩，我們通過最近最活躍的項目之一
[SIG Multicluster services (MCS)](https://github.com/kubernetes-sigs/mcs-api) 將其重新拾起。

現在我們向解決實際的具體問題開始轉變。比如說。

> 我的工作負載分佈在多個集羣中，我需要它們相互通信。

<!-- 
Okay, that's very straightforward and we know that we need to solve that. To get started, let's make sure that these projects can work together on a common API so you get the same kind of portability that you get with Kubernetes.

There's a few implementations of the MCS API out there and more are being developed. But, we didn't build an implementation because depending on how you're deploying things there could be hundreds of implementations. As long as you only need the basic Multicluster service functionality, it'll just work on whatever background you want, whether it's Submariner, GKE, or a service mesh. 
-->
好吧，這是非常直接的，我們也知道需要解決這個問題。
首先，讓我們確保這些項目可以在一個通用的 API 上協同工作，這樣你就可以獲得與 Kubernetes 相同的可移植性。

目前有一些 MCS API 的實現，並且更多的實現正在開發中。但是，我們沒有建立一個實現，
因爲取決於你的部署方式不同，可能會有數百種實現。
只要你所需要的基本的多集羣服務功能，它就可以在你想要的任何背景下工作，無論是 Submariner、GKE 還是服務網格。

<!-- 
My favorite example of "then vs. now" is cluster ID. A few years ago, there was an effort to define a cluster ID. A lot of really good thought went into this concept, for example, how do we make a cluster ID is unique across multiple clusters. How do we make this ID globally unique so it'll work in every contact? Let's say, there's an acquisition or merger of teams - does the cluster IDs still remain unique for those teams? 

With Multicluster services, we found the need for an actual cluster ID, and it has a very specific need. To address this specific need, we're no longer considering every single Kubernetes cluster out there rather the ClusterSets - a grouping of clusters that work together in some kind of bounds. That's a much narrower scope than considering clusters everywhere in time and space. It also leaves flexibility for an implementer to define the boundary (a ClusterSet) beyond which this cluster ID will no longer be unique.  -->
我最喜歡的“過去與現在“的例子是集羣 ID。幾年前曾經有過定義集羣 ID 的嘗試。
針對這個概念，有很多非常好的想法。例如，我們如何使集羣 ID 在多個集羣中是唯一的。
我們如何使這個 ID 全球範圍內唯一，以便它在各個通訊中發揮作用？
假設有團隊被收購或合併 - 集羣 ID 對於這些團隊仍然是唯一的嗎？

在 Multicluster 服務的相關工作中，我們發現需要一個實際的集羣 ID，並且這一需求非常具體。
爲了滿足這一特定需求，我們不再考慮一個個 Kubernetes 集羣，而是考慮 ClusterSets — 在某種範圍內協同工作的集羣分組。
與考慮所有時間點和所有空間位置上存在的集羣相比，這一範疇要窄得多。
這一概念還讓實現者具備了定義邊界（ClusterSet）的靈活性，在該邊界之外，該集羣 ID 將不再是唯一的。

<!-- 
**CS**: How do you feel about the current state of SIG Multicluster versus where you're hoping to be in future?

**JOT**: There's a few projects that are kind of getting started, for example, Work API. In the future, I think that some common practices around how do we deploy things across clusters are going to develop. 
> If I have clusters deployed in a bunch of different regions; what's the best way to actually do that? 
-->
**CS**：你對 SIG Multicluster 的現狀有何看法，你希望未來達到什麼樣的目標？

**JOT**：有一些項目正在起步，例如 Work API。 在未來，我認爲圍繞着如何跨集羣部署應用的一些共同做法將會發展起來。
> 如果我的集羣部署在不同的地區，那麼最好的方式是什麼？

<!-- 
The answer is, almost always, "it depends". Why are you doing this? Is it because there's some kind of compliance that makes you care about locality? Is it performance? Is it availability? 

I think revisiting registry patterns will probably be a natural step after we have cluster IDs, that is, how do you actually associate these clusters together? Maybe you've got a distributed deployment that you run in your own data centers all over the world. I imagine that expanding the API in that space is going to be important as more multi cluster features develop. It really depends on what the community starts doing with these tools. 
-->
答案几乎總是“視情況而定”。你爲什麼要這樣做？是因爲某種合規性使你關注位置嗎？是性能問題嗎？是可用性嗎？

我認爲，在我們有了集羣 ID 之後，重新審視註冊表模式可能是很自然的一步，也就是說，
你如何將這些集羣真正關聯在一起？也許你有一個分佈式部署，你在世界各地的數據中心運行。
我想隨着多集羣特性的進一步開發，擴展該領域的 API 將變得很重要。
這實際上取決於社區開始使用這些工具做什麼。

<!-- 
**CS**: In the early days of Kubernetes, we used to have a few large Kubernetes clusters and now we're dealing with many small Kubernetes clusters - even multiple clusters for our own dev environments. How has this shift from a few large clusters to many small clusters affected the SIG? Has it accelerated the work or make it challenging in any way? 
-->
**CS**：在 Kubernetes 的早期，我們只有寥寥幾個大型的 Kubernetes 集羣，而現在我們面對的是大量的小型 Kubernetes 集羣，就像我自己所在的開發環境中就使用了多個集羣。
這種從幾個大集羣到許多小集羣的轉變對 SIG 有何影響？它是否加快了工作進度或在某種程度上使得問題變得更困難？

<!-- 
**JOT**: I think that it has created a lot of ambiguity that needs solving. Originally, you'd have a dev cluster, a staging cluster, and a prod cluster. When the multi region thing came in, we started needing  dev/staging/prod clusters, per region. And then, sometimes clusters really need more isolation due to compliance or some regulations issues. Thus, we're ending up with a lot of clusters. I think figuring out the right balance on how many clusters should you actually have is important. The power of Kubernetes is being able to deploy a lot of things managed by a single control plane. So, it's not like every single workload that gets deployed should be in its own cluster. But I think it's pretty clear that we can't put every single workload in a single cluster. 
-->
**JOT**：我認爲它帶來了很多需要解決的歧義。最初，你可能擁有一個 dev 集羣、一個 staging 集羣和一個 prod 集羣。
當引入了多區域的考量時，我們開始在每個區域部署 dev/staging/prod 集羣。
再後來，有時由於合規性或某些法規問題，集羣確實需要更多的隔離。
因此，我們最終會有很多集羣。我認爲在你究竟應該有多少個集羣上找到平衡是很重要的。Kubernetes 的強大之處在於能夠部署由單個控制平面管理的大量事物。
因此，並不是每個被部署的工作負載都應該在自己的集羣中。
但是，我認爲同樣很明顯的是，我們不能將所有工作負載都放在一個集羣中。

<!-- 
**CS**: What are some of your favorite things about this SIG?

**JOT**: The complexity of the problems, the people and the newness of the space. We don't have right answers and we have to figure this out. At the beginning, we couldn't even think about multi clusters because there was no way to connect services across clusters. Now there is and we're starting to go tackle those problems, I think that this is a really fun place to be in because I expect that the SIG is going to get a lot busier the next couple of years. It's a very collaborative group and we definitely would like more people to come join us, get involved, raise their problems and bring their ideas.  
-->
**CS**：你最喜歡 SIG 的哪些方面？

**JOT**：問題的複雜性、人的因素和領域的新穎性。我們還沒有正確的答案，我們必須找到正確的答案。
一開始，我們甚至無法考慮多集羣，因爲無法跨集羣連接服務。
現在我們開始着手解決這些問題，我認爲這是一個非常有趣的地方，因爲我預計 SIG 在未來幾年會變得更加繁忙。
這是一個協作很密切的團體，我們絕對希望更多的人蔘與、加入我們，提出他們的問題和想法。

<!-- 
**CS**: What do you think keeps people in this group? How has the pandemic affected you? 
-->
**CS**：你認爲是什麼讓人們留在這個羣體中？疫情對你有何影響？

<!-- 
**JOT**: I think it definitely got a little bit quieter during the pandemic. But for the most part; it's a very distributed group so whether you're calling in to our weekly meetings from a conference room or from your home, it doesn't make that huge of a difference. During the pandemic, a lot of people had time to focus on what's next for their scale and growth. I think that's what keeps people in the group - we have real problems that need to be solved which are very new in this space. And it's fun :) 
-->
**JOT**：我認爲在疫情期間這個羣體肯定會變得安靜一些。但在大多數情況下，這是一個非常分散的小組，
因此無論你在會議室或者在家中參加我們的每週會議，都不會產生太大的影響。在疫情期間，很多人有時間專注於他們接下來的規模和增長。
我認爲這就是讓人們留在團隊中的原因 - 我們有真正的問題需要解決，這些問題在這個領域是非常新穎的、有趣的。

<!-- 
## Wrap up

**CS**: That's all we have for today. Thanks Jeremy for your time.

**JOT**: Thanks Chris. Everybody is welcome at our [bi-weekly meetings](https://github.com/kubernetes/community/tree/master/sig-multicluster#meetings). We love as many people to come as possible and welcome all questions and all ideas. It's a new space and it'd be great to grow the community. 
-->
## 結束語

**CS**：這就是我們今天的全部內容，感謝 Jeremy 的時間。

**JOT**：謝謝 Chris。我們的[雙週會議](https://github.com/kubernetes/community/tree/master/sig-multicluster#meetings)
歡迎所有人蔘加。我們希望儘可能多的人前來，並歡迎所有問題與想法。
這是一個新的領域，如果能讓社區發展起來，那就太好了。
