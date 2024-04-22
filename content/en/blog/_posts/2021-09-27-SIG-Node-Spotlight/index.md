---
layout: blog
title: "Spotlight on SIG Node"
date: 2021-09-27
slug: sig-node-spotlight-2021
author: >
   Dewan Ahmed (Red Hat)
---

## Introduction

In Kubernetes, a _Node_ is a representation of a single machine in your cluster. [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) owns that very important Node component and supports various subprojects such as Kubelet, Container Runtime Interface (CRI) and more to support how the pods and host resources interact. In this blog, we have summarized our conversation with [Elana Hashman (EH)](https://twitter.com/ehashdn) & [Sergey Kanzhelev (SK)](https://twitter.com/SergeyKanzhelev), who walk us through the various aspects of being a part of the SIG and share some insights about how others can get involved.

## A summary of our conversation

### Could you tell us a little about what SIG Node does?

SK: SIG Node is a vertical SIG responsible for the components that support the controlled interactions between the pods and host resources. We manage the lifecycle of pods that are scheduled to a node. This SIG's focus is to enable a broad set of workload types, including workloads with hardware specific or performance sensitive requirements. All while maintaining isolation boundaries between pods on a node, as well as the pod and the host. This SIG maintains quite a few components and has many external dependencies (like container runtimes or operating system features), which makes the complexity we deal with huge. We tame the complexity and aim to continuously improve node reliability.

### "SIG Node is a vertical SIG" could you explain a bit more?

EH: There are two kinds of SIGs: horizontal and vertical. Horizontal SIGs are concerned with a particular function of every component in Kubernetes: for example, SIG Security considers security aspects of every component in Kubernetes, or SIG Instrumentation looks at the logs, metrics, traces and events of every component in Kubernetes. Such SIGs don't tend to own a lot of code.

Vertical SIGs, on the other hand, own a single component, and are responsible for approving and merging patches to that code base. SIG Node owns the "Node" vertical, pertaining to the kubelet and its lifecycle. This includes the code for the kubelet itself, as well as the node controller, the container runtime interface, and related subprojects like the node problem detector. 

### How did the CI subproject start? Is this specific to SIG Node and how does it help the SIG?

SK: The subproject started as a follow up after one of the releases was blocked by numerous test failures of critical tests. These tests haven’t started falling all at once, rather continuous lack of attention led to slow degradation of tests quality. SIG Node was always prioritizing quality and reliability, and forming of the subproject was a way to highlight this priority.

### As the 3rd largest SIG in terms of number of issues and PRs, how does your SIG juggle so much work?

EH: It helps to be organized. When I increased my contributions to the SIG in January of 2021, I found myself overwhelmed by the volume of pull requests and issues and wasn't sure where to start. We were already tracking test-related issues and pull requests on the CI subproject board, but that was missing a lot of our bugfixes and feature work. So I began putting together a triage board for the rest of our pull requests, which allowed me to sort each one by status and what actions to take, and documented its use for other contributors. We closed or merged over 500 issues and pull requests tracked by our two boards in each of the past two releases. The Kubernetes devstats showed that we have significantly increased our velocity as a result.

In June, we ran our first bug scrub event to work through the backlog of issues filed against SIG Node, ensuring they were properly categorized. We closed over 130 issues over the course of this 48 hour global event, but as of writing we still have 333 open issues. 

### Why should new and existing contributors consider joining SIG Node?

SK: Being a SIG Node contributor gives you skills and recognition that are rewarding and useful. Understanding under the hood of a kubelet helps architecting better apps, tune and optimize those apps, and gives leg up in issues troubleshooting. If you are a new contributor, SIG Node gives you the foundational knowledge that is key to understanding why other Kubernetes components are designed the way they are. Existing contributors may benefit as many features will require SIG Node changes one way or another. So being a SIG Node contributor helps building features in other SIGs faster.

SIG Node maintains numerous components, many of which have dependency on external projects or OS features. This makes the onboarding process quite lengthy and demanding. But if you are up for a challenge, there is always a place for you, and a group of people to support. 

### What do you do to help new contributors get started?

EH: Getting started in SIG Node can be intimidating, since there is so much work to be done, our SIG meetings are very large, and it can be hard to find a place to start.

I always encourage new contributors to work on things that they have some investment in already. In SIG Node, that might mean volunteering to help fix a bug that you have personally been affected by, or helping to triage bugs you care about by priority.

To come up to speed on any open source code base, there are two strategies you can take: start by exploring a particular issue deeply, and follow that to expand the edges of your knowledge as needed, or briefly review as many issues and change requests as you possibly can to get a higher level picture of how the component works. Ultimately, you will need to do both if you want to become a Node reviewer or approver.

[Davanum Srinivas](https://twitter.com/dims) and I each ran a cohort of group mentoring to help teach new contributors the skills to become Node reviewers, and if there's interest we can work to find a mentor to run another session. I also encourage new contributors to attend our Node CI Subproject meeting: it's a smaller audience and we don't record the triage sessions, so it can be a less intimidating way to get started with the SIG. 

### Are there any particular skills you’d like to recruit for? What skills are contributors to SIG Usability likely to learn?

SK: SIG Node works on many workstreams in very different areas. All of these areas are on system level. For the typical code contributions you need to have a passion for building and utilizing low level APIs and writing performant and reliable components. Being a contributor you will learn how to debug and troubleshoot, profile, and monitor these components, as well as user workload that is run by these components. Often, with the limited to no access to Nodes, as they are running production workloads.

The other way of contribution is to help document SIG node features. This type of contribution requires a deep understanding of features, and ability to explain them in simple terms.

Finally, we are always looking for feedback on how best to run your workload. Come and  explain specifics of it, and what features in SIG Node components may help to run it better. 

### What are you getting positive feedback on, and what’s coming up next for SIG Node?

EH: Over the past year SIG Node has adopted some new processes to help manage our feature development and Kubernetes enhancement proposals, and other SIGs have looked to us for inspiration in managing large workloads. I hope that this is an area we can continue to provide leadership in and further iterate on.

We have a great balance of new features and deprecations in flight right now. Deprecations of unused or difficult to maintain features help us keep technical debt and maintenance load under control, and examples include the dockershim and DynamicKubeletConfiguration deprecations. New features will unlock additional functionality in end users' clusters, and include exciting features like support for cgroups v2, swap memory, graceful node shutdowns, and device management policies.

### Any closing thoughts/resources you’d like to share?

SK/EH: It takes time and effort to get to any open source community. SIG Node may overwhelm you at first with the number of participants, volume of work, and project scope. But it is totally worth it. Join our welcoming community! [SIG Node GitHub Repo](https://github.com/kubernetes/community/tree/master/sig-node) contains many useful resources including Slack, mailing list and other contact info. 

## Wrap Up

SIG Node hosted a [KubeCon + CloudNativeCon Europe 2021 talk](https://www.youtube.com/watch?v=z5aY4e2RENA) with an intro and deep dive to their awesome SIG. Join the SIG's meetings to find out about the most recent research results, what the plans are for the forthcoming year, and how to get involved in the upstream Node team as a contributor!