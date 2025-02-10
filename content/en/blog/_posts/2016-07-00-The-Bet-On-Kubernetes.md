---
title: " The Bet on Kubernetes, a Red Hat Perspective "
date: 2016-07-21
slug: the-bet-on-kubernetes
url: /blog/2016/07/The-Bet-On-Kubernetes
author: >
  Clayton Coleman (Red Hat)
---

Two years ago, Red Hat made a big bet on Kubernetes. We bet on a simple idea: that an open source community is the best place to build the future of application orchestration, and that only an open source community could successfully integrate the diverse range of capabilities necessary to succeed. As a Red Hatter, that idea is not far-fetched - we’ve seen it successfully applied in many communities, but we’ve also seen it fail, especially when a broad reach is not supported by solid foundations. On the one year anniversary of Kubernetes 1.0, two years after the first open-source commit to the Kubernetes project, it’s worth asking the question:  

**Was Kubernetes the right bet?**  

The success of software is measured by the successes of its users - whether that software enables for them new opportunities or efficiencies. In that regard, Kubernetes has succeeded beyond our wildest dreams. We know of hundreds of real production deployments of Kubernetes, in the enterprise through Red Hat’s multi-tenant enabled [OpenShift](https://github.com/openshift/origin) distribution, on [Google Container Engine](https://cloud.google.com/container-engine/) (GKE), in heavily customized versions run by some of the world's largest software companies, and through the education, entertainment, startup, and do-it-yourself communities. Those deployers report improved time to delivery, standardized application lifecycles, improved resource utilization, and more resilient and robust applications. And that’s just from customers or contributors to the community - I would not be surprised if there were now thousands of installations of Kubernetes managing tens of thousands of real applications out in the wild.  

I believe that reach to be a validation of the vision underlying Kubernetes: to build a platform for all applications by providing tools for each of the core patterns in distributed computing. Those patterns:  


- simple replicated web software
- distributed load balancing and service discovery
- immutable images run in containers
- co-location of related software into pods
- simplified consumption of network attached storage
- flexible and powerful resource scheduling
- running batch and scheduled jobs alongside service workloads
- managing and maintaining clustered software like databases and message queues


Allow developers and operators to move to the next scale of abstraction, just like they have enabled Google and others in the tech ecosystem to scale to datacenter computers and beyond. From Kubernetes 1.0 to 1.3 we have continually improved the power and flexibility of the platform while ALSO improving performance, scalability, reliability, and usability. The explosion of integrations and tools that run on top of Kubernetes further validates core architectural decisions to be [composable](https://research.google.com/pubs/pub43438.html), to expose [open and flexible APIs](/docs/api/), and to [deliberately limit the core platform](/docs/whatisk8s/#kubernetes-is-not) and encourage extension.  

Today Kubernetes has one of the largest and most vibrant communities in the open source ecosystem, with almost a thousand contributors, one of the highest human-generated commit rates of any single-repository project on GitHub, over a thousand projects based around Kubernetes, and correspondingly active Stack Overflow and Slack channels. Red Hat is proud to be part of this ecosystem as the largest contributor to Kubernetes after Google, and every day more companies and individuals join us. The idea of Kubernetes found fertile ground, and you, the community, provided the excitement and commitment that made it grow.  

So, did we bet correctly? For all the reasons above, and hundreds more: **Yes**.  

**What’s next?**  

Happy as we are with the success of Kubernetes, this is no time to rest! While there are many more features and improvements we want to build into Kubernetes, I think there is a general consensus that we want to focus on the only long term goal that matters - a healthy, successful, and thriving technical community around Kubernetes. As John F. Kennedy probably said:&nbsp;  

\> _Ask not what your community can do for you, but what you can do for your community_  

In a recent post to the kubernetes-dev list, Brian Grant [laid out a great set of near term goals](https://groups.google.com/d/topic/kubernetes-dev/MoyWB66vAKY/discussion) - goals that help grow the community, refine how we execute, and enable future expansion. In each of the [Kubernetes Special Interest Groups](https://github.com/kubernetes/community/blob/master/README.md#special-interest-groups-sig) we are trying to build sustainable teams that can execute across companies and communities, and we are actively working to ensure each of these SIGs is able to contribute, coordinate, and deliver across a diverse range of interests under one vision for the project.  

Of special interest to us is the story of extension - how the core of Kubernetes can become the beating heart of the datacenter operating system, and enable even more patterns for application management to build on top of Kubernetes, not just into it. Work done in the 1.2 and 1.3 releases around third party APIs, API discovery, flexible scheduler policy, external authorization and authentication (beyond those built into Kubernetes) is just the start. When someone has a need, we want them to easily find a solution, and we also want it to be easy for others to consume and contribute to that solution. Likewise, the best way to prove ideas is to prototype them against real needs and to iterate against real problems, which should be easy and natural.  

By Kubernetes’ second birthday, I hope to reflect back on a long year of refinement, user success, and community participation. It has been a privilege and an honor to contribute to Kubernetes, and it still feels like we are just getting started. Thank you, and I hope you come along for the ride!
