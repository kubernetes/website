---
layout: blog
title: "Spotlight on SIG Multicluster"
date: 2022-02-07
slug: sig-multicluster-spotlight-2022
canonicalUrl: https://www.kubernetes.dev/blog/2022/02/04/sig-multicluster-spotlight-2022/
author: >
   Dewan Ahmed (Aiven),
   Chris Short (AWS)
---

## Introduction

[SIG Multicluster](https://github.com/kubernetes/community/tree/master/sig-multicluster) is the SIG focused on how Kubernetes concepts are expanded and used beyond the cluster boundary. Historically, Kubernetes resources only interacted within that boundary - KRU or Kubernetes Resource Universe (not an actual Kubernetes concept). Kubernetes clusters, even now, don't really know anything about themselves or, about other clusters. Absence of cluster identifiers is a case in point. With the growing adoption of multicloud and multicluster deployments, the work SIG Multicluster doing is gaining a lot of attention. In this blog, [Jeremy Olmsted-Thompson, Google](https://twitter.com/jeremyot) and [Chris Short, AWS](https://twitter.com/ChrisShort) discuss the interesting problems SIG Multicluster is solving and how you can get involved. Their initials **JOT** and **CS** will be used for brevity.

## A summary of their conversation

**CS**: How long has the SIG Multicluster existed and how was the SIG in its infancy? How long have you been with this SIG?

**JOT**: I've been around for almost two years in the SIG Multicluster. All I know about the infancy years is from the lore but even in the early days, it was always about solving this same problem. Early efforts have been things like [KubeFed](https://github.com/kubernetes-sigs/kubefed). I think there are still folks using KubeFed but it's a smaller slice. Back then, I think people out there deploying large numbers of Kubernetes clusters were really not at a point where we had a ton of real concrete use cases. Projects like KubeFed and [Cluster Registry](https://github.com/kubernetes-retired/cluster-registry) were developed around that time and the need back then can be associated to these projects. The motivation for these projects were how do we solve the problems that we think people are **going to have**, when they start expanding to multiple clusters. Honestly, in some ways, it was trying to do too much at that time.

**CS**: How does KubeFed differ from the current state of SIG Multicluster? How does the **lore** differ from the **now**?

**JOT**: Yeah, it was like trying to get ahead of potential problems instead of addressing specific problems. I think towards the end of 2019, there was a slow down in SIG multicluster work and we kind of picked it back up with one of the most active recent projects that is the [SIG Multicluster services (MCS)](https://github.com/kubernetes-sigs/mcs-api). 

Now this is the shift to solving real specific problems. For example, 

> I've got workloads that are spread across multiple clusters and I need them to talk to each other. 
 
Okay, that's very straightforward and we know that we need to solve that. To get started, let's make sure that these projects can work together on a common API so you get the same kind of portability that you get with Kubernetes.

There's a few implementations of the MCS API out there and more are being developed. But, we didn't build an implementation because depending on how you're deploying things there could be hundreds of implementations. As long as you only need the basic Multicluster service functionality, it'll just work on whatever background you want, whether it's Submariner, GKE, or a service mesh.

My favorite example of "then vs. now" is cluster ID. A few years ago, there was an effort to define a cluster ID. A lot of really good thought went into this concept, for example, how do we make a cluster ID is unique across multiple clusters. How do we make this ID globally unique so it'll work in every contact? Let's say, there's an acquisition or merger of teams - does the cluster IDs still remain unique for those teams? 

With Multicluster services, we found the need for an actual cluster ID, and it has a very specific need. To address this specific need, we're no longer considering every single Kubernetes cluster out there rather the ClusterSets - a grouping of clusters that work together in some kind of bounds. That's a much narrower scope than considering clusters everywhere in time and space. It also leaves flexibility for an implementer to define the boundary (a ClusterSet) beyond which this cluster ID will no longer be unique. 


**CS**: How do you feel about the current state of SIG Multicluster versus where you're hoping to be in future?

**JOT**: There's a few projects that are kind of getting started, for example, Work API. In the future, I think that some common practices around how do we deploy things across clusters are going to develop. 
> If I have clusters deployed in a bunch of different regions; what's the best way to actually do that?

The answer is, almost always, "it depends". Why are you doing this? Is it because there's some kind of compliance that makes you care about locality? Is it performance? Is it availability? 

I think revisiting registry patterns will probably be a natural step after we have cluster IDs, that is, how do you actually associate these clusters together? Maybe you've got a distributed deployment that you run in your own data centers all over the world. I imagine that expanding the API in that space is going to be important as more multi cluster features develop. It really depends on what the community starts doing with these tools.

**CS**: In the early days of Kubernetes, we used to have a few large Kubernetes clusters and now we're dealing with many small Kubernetes clusters - even multiple clusters for our own dev environments. How has this shift from a few large clusters to many small clusters affected the SIG? Has it accelerated the work or make it challenging in any way?

**JOT**: I think that it has created a lot of ambiguity that needs solving. Originally, you'd have a dev cluster, a staging cluster, and a prod cluster. When the multi region thing came in, we started needing  dev/staging/prod clusters, per region. And then, sometimes clusters really need more isolation due to compliance or some regulations issues. Thus, we're ending up with a lot of clusters. I think figuring out the right balance on how many clusters should you actually have is important. The power of Kubernetes is being able to deploy a lot of things managed by a single control plane. So, it's not like every single workload that gets deployed should be in its own cluster. But I think it's pretty clear that we can't put every single workload in a single cluster.

**CS**: What are some of your favorite things about this SIG?

**JOT**: The complexity of the problems, the people and the newness of the space. We don't have right answers and we have to figure this out. At the beginning, we couldn't even think about multi clusters because there was no way to connect services across clusters. Now there is and we're starting to go tackle those problems, I think that this is a really fun place to be in because I expect that the SIG is going to get a lot busier the next couple of years. It's a very collaborative group and we definitely would like more people to come join us, get involved, raise their problems and bring their ideas. 

**CS**: What do you think keeps people in this group? How has the pandemic affected you?

**JOT**: I think it definitely got a little bit quieter during the pandemic. But for the most part; it's a very distributed group so whether you're calling in to our weekly meetings from a conference room or from your home, it doesn't make that huge of a difference. During the pandemic, a lot of people had time to focus on what's next for their scale and growth. I think that's what keeps people in the group - we have real problems that need to be solved which are very new in this space. And it's fun :)

## Wrap up

**CS**: That's all we have for today. Thanks Jeremy for your time.

**JOT**: Thanks Chris. Everybody is welcome at our [bi-weekly meetings](https://github.com/kubernetes/community/tree/master/sig-multicluster#meetings). We love as many people to come as possible and welcome all questions and all ideas. It's a new space and it'd be great to grow the community.