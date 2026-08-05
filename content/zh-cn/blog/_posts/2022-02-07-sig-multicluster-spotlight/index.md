---
layout: blog
title: "关注 SIG Multicluster"
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
## 简介

[SIG Multicluster](https://github.com/kubernetes/community/tree/master/sig-multicluster)
是专注于如何拓展 Kubernetes 的概念并将其用于集群边界之外的 SIG。
以往 Kubernetes 资源仅在 Kubernetes Resource Universe (KRU) 这个边界内进行交互，其中 KRU 不是一个实际的 Kubernetes 概念。
即使是现在，Kubernetes 集群对自身或其他集群并不真正了解。集群标识符的缺失就是一个例子。
随着多云和多集群部署日益普及，SIG Multicluster 所做的工作越来越受到关注。
在这篇博客中，[来自 Google 的 Jeremy Olmsted-Thompson](https://twitter.com/jeremyot) 和
[来自 AWS 的 Chris Short](https://twitter.com/ChrisShort) 讨论了 SIG Multicluster
正在解决的一些有趣的问题和以及大家如何参与其中。
为简洁起见，下文将使用他们两位的首字母 **JOT** 和 **CS**。

<!-- 
## A summary of their conversation

**CS**: How long has the SIG Multicluster existed and how was the SIG in its infancy? How long have you been with this SIG?

**JOT**: I've been around for almost two years in the SIG Multicluster. All I know about the infancy years is from the lore but even in the early days, it was always about solving this same problem. Early efforts have been things like [KubeFed](https://github.com/kubernetes-sigs/kubefed). I think there are still folks using KubeFed but it's a smaller slice. Back then, I think people out there deploying large numbers of Kubernetes clusters were really not at a point where we had a ton of real concrete use cases. Projects like KubeFed and [Cluster Registry](https://github.com/kubernetes-retired/cluster-registry) were developed around that time and the need back then can be associated to these projects. The motivation for these projects were how do we solve the problems that we think people are **going to have**, when they start expanding to multiple clusters. Honestly, in some ways, it was trying to do too much at that time. 
-->
## 谈话总结

**CS**：SIG Multicluster 存在多久了？SIG 在起步阶段情况如何？你参与这个 SIG 多长时间了？

**JOT**：我在 SIG Multicluster 工作了将近两年。我所知道的关于初创时期的情况都来自传说，但即使在早期，也一直是为了解决相同的问题。
早期工作的例子之一是 [KubeFed](https://github.com/kubernetes-sigs/kubefed)。
我认为仍然有一些人在使用 KubeFed，但它只是一小部分。
那时，我认为人们在部署大量 Kubernetes 集群时，还没有达到我们拥有大量实际具体用例的地步。
像 KubeFed 和 [Cluster Registry](https://github.com/kubernetes-retired/cluster-registry)
这样的项目就是在那个时候开发的，当时的需求可以与这些项目相关联。
这些项目的动机是如何解决我们认为在开始扩展到多个集群时 **会遇到的问题**。
老实说，在某些方面，当时它试图做得太多了。

<!-- 
**CS**: How does KubeFed differ from the current state of SIG Multicluster? How does the **lore** differ from the **now**?

**JOT**: Yeah, it was like trying to get ahead of potential problems instead of addressing specific problems. I think towards the end of 2019, there was a slow down in SIG multicluster work and we kind of picked it back up with one of the most active recent projects that is the [SIG Multicluster services (MCS)](https://github.com/kubernetes-sigs/mcs-api). 

Now this is the shift to solving real specific problems. For example, 

> I've got workloads that are spread across multiple clusters and I need them to talk to each other.  
-->
**CS**：KubeFed 与 SIG Multicluster 的现状有何不同？**初创期** 与 **现在** 有何不同？

**JOT**：嗯嗯，这就像总是要预防潜在问题而不是解决眼前具体的问题。我认为在 2019 年底，
SIG Multicluster 工作有所放缓，我们通过最近最活跃的项目之一
[SIG Multicluster services (MCS)](https://github.com/kubernetes-sigs/mcs-api) 将其重新拾起。

现在我们向解决实际的具体问题开始转变。比如说。

> 我的工作负载分布在多个集群中，我需要它们相互通信。

<!-- 
Okay, that's very straightforward and we know that we need to solve that. To get started, let's make sure that these projects can work together on a common API so you get the same kind of portability that you get with Kubernetes.

There's a few implementations of the MCS API out there and more are being developed. But, we didn't build an implementation because depending on how you're deploying things there could be hundreds of implementations. As long as you only need the basic Multicluster service functionality, it'll just work on whatever background you want, whether it's Submariner, GKE, or a service mesh. 
-->
好吧，这是非常直接的，我们也知道需要解决这个问题。
首先，让我们确保这些项目可以在一个通用的 API 上协同工作，这样你就可以获得与 Kubernetes 相同的可移植性。

目前有一些 MCS API 的实现，并且更多的实现正在开发中。但是，我们没有建立一个实现，
因为取决于你的部署方式不同，可能会有数百种实现。
只要你所需要的基本的多集群服务功能，它就可以在你想要的任何背景下工作，无论是 Submariner、GKE 还是服务网格。

<!-- 
My favorite example of "then vs. now" is cluster ID. A few years ago, there was an effort to define a cluster ID. A lot of really good thought went into this concept, for example, how do we make a cluster ID is unique across multiple clusters. How do we make this ID globally unique so it'll work in every contact? Let's say, there's an acquisition or merger of teams - does the cluster IDs still remain unique for those teams? 

With Multicluster services, we found the need for an actual cluster ID, and it has a very specific need. To address this specific need, we're no longer considering every single Kubernetes cluster out there rather the ClusterSets - a grouping of clusters that work together in some kind of bounds. That's a much narrower scope than considering clusters everywhere in time and space. It also leaves flexibility for an implementer to define the boundary (a ClusterSet) beyond which this cluster ID will no longer be unique.  -->
我最喜欢的“过去与现在“的例子是集群 ID。几年前曾经有过定义集群 ID 的尝试。
针对这个概念，有很多非常好的想法。例如，我们如何使集群 ID 在多个集群中是唯一的。
我们如何使这个 ID 全球范围内唯一，以便它在各个通讯中发挥作用？
假设有团队被收购或合并 - 集群 ID 对于这些团队仍然是唯一的吗？

在 Multicluster 服务的相关工作中，我们发现需要一个实际的集群 ID，并且这一需求非常具体。
为了满足这一特定需求，我们不再考虑一个个 Kubernetes 集群，而是考虑 ClusterSets — 在某种范围内协同工作的集群分组。
与考虑所有时间点和所有空间位置上存在的集群相比，这一范畴要窄得多。
这一概念还让实现者具备了定义边界（ClusterSet）的灵活性，在该边界之外，该集群 ID 将不再是唯一的。

<!-- 
**CS**: How do you feel about the current state of SIG Multicluster versus where you're hoping to be in future?

**JOT**: There's a few projects that are kind of getting started, for example, Work API. In the future, I think that some common practices around how do we deploy things across clusters are going to develop. 
> If I have clusters deployed in a bunch of different regions; what's the best way to actually do that? 
-->
**CS**：你对 SIG Multicluster 的现状有何看法，你希望未来达到什么样的目标？

**JOT**：有一些项目正在起步，例如 Work API。 在未来，我认为围绕着如何跨集群部署应用的一些共同做法将会发展起来。
> 如果我的集群部署在不同的地区，那么最好的方式是什么？

<!-- 
The answer is, almost always, "it depends". Why are you doing this? Is it because there's some kind of compliance that makes you care about locality? Is it performance? Is it availability? 

I think revisiting registry patterns will probably be a natural step after we have cluster IDs, that is, how do you actually associate these clusters together? Maybe you've got a distributed deployment that you run in your own data centers all over the world. I imagine that expanding the API in that space is going to be important as more multi cluster features develop. It really depends on what the community starts doing with these tools. 
-->
答案几乎总是“视情况而定”。你为什么要这样做？是因为某种合规性使你关注位置吗？是性能问题吗？是可用性吗？

我认为，在我们有了集群 ID 之后，重新审视注册表模式可能是很自然的一步，也就是说，
你如何将这些集群真正关联在一起？也许你有一个分布式部署，你在世界各地的数据中心运行。
我想随着多集群特性的进一步开发，扩展该领域的 API 将变得很重要。
这实际上取决于社区开始使用这些工具做什么。

<!-- 
**CS**: In the early days of Kubernetes, we used to have a few large Kubernetes clusters and now we're dealing with many small Kubernetes clusters - even multiple clusters for our own dev environments. How has this shift from a few large clusters to many small clusters affected the SIG? Has it accelerated the work or make it challenging in any way? 
-->
**CS**：在 Kubernetes 的早期，我们只有寥寥几个大型的 Kubernetes 集群，而现在我们面对的是大量的小型 Kubernetes 集群，就像我自己所在的开发环境中就使用了多个集群。
这种从几个大集群到许多小集群的转变对 SIG 有何影响？它是否加快了工作进度或在某种程度上使得问题变得更困难？

<!-- 
**JOT**: I think that it has created a lot of ambiguity that needs solving. Originally, you'd have a dev cluster, a staging cluster, and a prod cluster. When the multi region thing came in, we started needing  dev/staging/prod clusters, per region. And then, sometimes clusters really need more isolation due to compliance or some regulations issues. Thus, we're ending up with a lot of clusters. I think figuring out the right balance on how many clusters should you actually have is important. The power of Kubernetes is being able to deploy a lot of things managed by a single control plane. So, it's not like every single workload that gets deployed should be in its own cluster. But I think it's pretty clear that we can't put every single workload in a single cluster. 
-->
**JOT**：我认为它带来了很多需要解决的歧义。最初，你可能拥有一个 dev 集群、一个 staging 集群和一个 prod 集群。
当引入了多区域的考量时，我们开始在每个区域部署 dev/staging/prod 集群。
再后来，有时由于合规性或某些法规问题，集群确实需要更多的隔离。
因此，我们最终会有很多集群。我认为在你究竟应该有多少个集群上找到平衡是很重要的。Kubernetes 的强大之处在于能够部署由单个控制平面管理的大量事物。
因此，并不是每个被部署的工作负载都应该在自己的集群中。
但是，我认为同样很明显的是，我们不能将所有工作负载都放在一个集群中。

<!-- 
**CS**: What are some of your favorite things about this SIG?

**JOT**: The complexity of the problems, the people and the newness of the space. We don't have right answers and we have to figure this out. At the beginning, we couldn't even think about multi clusters because there was no way to connect services across clusters. Now there is and we're starting to go tackle those problems, I think that this is a really fun place to be in because I expect that the SIG is going to get a lot busier the next couple of years. It's a very collaborative group and we definitely would like more people to come join us, get involved, raise their problems and bring their ideas.  
-->
**CS**：你最喜欢 SIG 的哪些方面？

**JOT**：问题的复杂性、人的因素和领域的新颖性。我们还没有正确的答案，我们必须找到正确的答案。
一开始，我们甚至无法考虑多集群，因为无法跨集群连接服务。
现在我们开始着手解决这些问题，我认为这是一个非常有趣的地方，因为我预计 SIG 在未来几年会变得更加繁忙。
这是一个协作很密切的团体，我们绝对希望更多的人参与、加入我们，提出他们的问题和想法。

<!-- 
**CS**: What do you think keeps people in this group? How has the pandemic affected you? 
-->
**CS**：你认为是什么让人们留在这个群体中？疫情对你有何影响？

<!-- 
**JOT**: I think it definitely got a little bit quieter during the pandemic. But for the most part; it's a very distributed group so whether you're calling in to our weekly meetings from a conference room or from your home, it doesn't make that huge of a difference. During the pandemic, a lot of people had time to focus on what's next for their scale and growth. I think that's what keeps people in the group - we have real problems that need to be solved which are very new in this space. And it's fun :) 
-->
**JOT**：我认为在疫情期间这个群体肯定会变得安静一些。但在大多数情况下，这是一个非常分散的小组，
因此无论你在会议室或者在家中参加我们的每周会议，都不会产生太大的影响。在疫情期间，很多人有时间专注于他们接下来的规模和增长。
我认为这就是让人们留在团队中的原因 - 我们有真正的问题需要解决，这些问题在这个领域是非常新颖的、有趣的。

<!-- 
## Wrap up

**CS**: That's all we have for today. Thanks Jeremy for your time.

**JOT**: Thanks Chris. Everybody is welcome at our [bi-weekly meetings](https://github.com/kubernetes/community/tree/master/sig-multicluster#meetings). We love as many people to come as possible and welcome all questions and all ideas. It's a new space and it'd be great to grow the community. 
-->
## 结束语

**CS**：这就是我们今天的全部内容，感谢 Jeremy 的时间。

**JOT**：谢谢 Chris。我们的[双周会议](https://github.com/kubernetes/community/tree/master/sig-multicluster#meetings)
欢迎所有人参加。我们希望尽可能多的人前来，并欢迎所有问题与想法。
这是一个新的领域，如果能让社区发展起来，那就太好了。
