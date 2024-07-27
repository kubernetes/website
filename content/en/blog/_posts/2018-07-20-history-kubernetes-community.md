---
layout: blog
title: "The History of Kubernetes & the Community Behind It"
date:  2018-07-20
author: >
  Brendan Burns (Microsoft) 
---

![oscon award](/images/blog/2018-07-20-history-kubernetes-community.png)

It is remarkable to me to return to Portland and OSCON to stand on stage with members of the Kubernetes community and accept this award for Most Impactful Open Source Project. It was scarcely three years ago, that on this very same stage we declared Kubernetes 1.0 and the project was added to the newly formed Cloud Native Computing Foundation.

To think about how far we have come in that short period of time and to see the ways in which this project has shaped the cloud computing landscape is nothing short of amazing. The success is a testament to the power and contributions of this amazing open source community. And the daily passion and quality contributions of our endlessly engaged, world-wide community is nothing short of humbling.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Congratulations <a href="https://twitter.com/kubernetesio?ref_src=twsrc%5Etfw">@kubernetesio</a> for winning the &quot;most impact&quot; award at <a href="https://twitter.com/hashtag/OSCON?src=hash&amp;ref_src=twsrc%5Etfw">#OSCON</a> I&#39;m so proud to be a part of this amazing community! <a href="https://twitter.com/CloudNativeFdn?ref_src=twsrc%5Etfw">@CloudNativeFdn</a> <a href="https://t.co/5sRUYyefAK">pic.twitter.com/5sRUYyefAK</a></p>&mdash; Jaice Singer DuMars (@jaydumars) <a href="https://twitter.com/jaydumars/status/1019993233487613952?ref_src=twsrc%5Etfw">July 19, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">👏 congrats <a href="https://twitter.com/kubernetesio?ref_src=twsrc%5Etfw">@kubernetesio</a> community on winning the <a href="https://twitter.com/hashtag/oscon?src=hash&amp;ref_src=twsrc%5Etfw">#oscon</a> Most Impact Award, we are proud of you! <a href="https://t.co/5ezDphi6J6">pic.twitter.com/5ezDphi6J6</a></p>&mdash; CNCF (@CloudNativeFdn) <a href="https://twitter.com/CloudNativeFdn/status/1019996928296095744?ref_src=twsrc%5Etfw">July 19, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


At a meetup in Portland this week, I had a chance to tell the story of Kubernetes’ past, its present and some thoughts about its future, so I thought I would write down some pieces of what I said for those of you who couldn’t be there in person.

It all began in the fall of 2013, with three of us: Craig McLuckie, Joe Beda and I were working on public cloud infrastructure. If you cast your mind back to the world of cloud in 2013, it was a vastly different place than it is today. Imperative bash scripts were only just starting to give way to declarative configuration of IaaS with systems. Netflix was popularizing the idea of immutable infrastructure but doing it with heavy-weight full VM images. The notion of orchestration, and certainly container orchestration existed in a few internet scale companies, but not in cloud and certainly not in the enterprise.

Docker changed all of that. By popularizing a lightweight container runtime and providing a simple way to package, distributed and deploy applications onto a machine, the Docker tooling and experience popularized a brand-new cloud native approach to application packaging and maintenance. Were it not for Docker’s shifting of the cloud developer’s perspective, Kubernetes simply would not exist.

I think that it was Joe who first suggested that we look at Docker in the summer of 2013, when Craig, Joe and I were all thinking about how we could bring a cloud native application experience to a broader audience. And for all three of us, the implications of this new tool were immediately obvious. We knew it was a critical component in the development of cloud native infrastructure.

But as we thought about it, it was equally obvious that Docker, with its focus on a single machine, was not the complete solution. While Docker was great at building and packaging individual containers and running them on individual machines, there was a clear need for an orchestrator that could deploy and manage large numbers of containers across a fleet of machines.

As we thought about it some more, it became increasingly obvious to Joe, Craig and I, that not only was such an orchestrator necessary, it was also inevitable, and it was equally inevitable that this orchestrator would be open source. This realization crystallized for us in the late fall of 2013, and thus began the rapid development of first a prototype, and then the system that would eventually become known as Kubernetes. As 2013 turned into 2014 we were lucky to be joined by some incredibly talented developers including Ville Aikas, Tim Hockin, Dawn Chen, Brian Grant and Daniel Smith.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Happy to see k8s team members winning the “most impact” award. <a href="https://twitter.com/hashtag/oscon?src=hash&amp;ref_src=twsrc%5Etfw">#oscon</a> <a href="https://t.co/D6mSIiDvsU">pic.twitter.com/D6mSIiDvsU</a></p>&mdash; Bridget Kromhout (@bridgetkromhout) <a href="https://twitter.com/bridgetkromhout/status/1019992441825341440?ref_src=twsrc%5Etfw">July 19, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Kubernetes won the O&#39;Reilly Most Impact Award. Thanks to our contributors and users! <a href="https://t.co/T6Co1wpsAh">pic.twitter.com/T6Co1wpsAh</a></p>&mdash; Brian Grant (@bgrant0607) <a href="https://twitter.com/bgrant0607/status/1019995276235325440?ref_src=twsrc%5Etfw">July 19, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


The initial goal of this small team was to develop a “minimally viable orchestrator.” From experience we knew that the basic feature set for such an orchestrator was:

  * Replication to deploy multiple instances of an application
  * Load balancing and service discovery to route traffic to these replicated containers
  * Basic health checking and repair to ensure a self-healing system
  * Scheduling to group many machines into a single pool and distribute work to them

Along the way, we also spent a significant chunk of our time convincing executive leadership that open sourcing this project was a good idea. I’m endlessly grateful to Craig for writing numerous whitepapers and to Eric Brewer, for the early and vocal support that he lent us to ensure that Kubernetes could see the light of day.

In June of 2014 when Kubernetes was released to the world, the list above was the sum total of its basic feature set. As an early stage open source community, we then spent a year building, expanding, polishing and fixing this initial minimally viable orchestrator into the product that we released as a 1.0 in OSCON in 2015. We were very lucky to be joined early on by the very capable OpenShift team which lent significant engineering and real world enterprise expertise to the project. Without their perspective and contributions, I don’t think we would be standing here today.

Three years later, the Kubernetes community has grown exponentially, and Kubernetes has become synonymous with cloud native container orchestration. There are more than 1700 people who have contributed to Kubernetes, there are more than 500 Kubernetes meetups worldwide and more than 42000 users have joined the #kubernetes-dev channel. What’s more, the community that we have built works successfully across geographic, language and corporate boundaries. It is a truly open, engaged and collaborative community, and in-and-of-itself and amazing achievement. Many thanks to everyone who has helped make it what it is today. Kubernetes is a commodity in the public cloud because of you.

But if Kubernetes is a commodity, then what is the future? Certainly, there are an endless array of tweaks, adjustments and improvements to the core codebase that will occupy us for years to come, but the true future of Kubernetes are the applications and experiences that are being built on top of this new, ubiquitous platform.  

Kubernetes has dramatically reduced the complexity to build new developer experiences, and a myriad of new experiences have been developed or are in the works that provide simplified or targeted developer experiences like Functions-as-a-Service, on top of core Kubernetes-as-a-Service.  

The Kubernetes cluster itself is being extended with custom resource definitions (which I first described to Kelsey Hightower on a walk from OSCON to a nearby restaurant in 2015), these new resources allow cluster operators to enable new plugin functionality that extend and enhance the APIs that their users have access to.

By embedding core functionality like logging and monitoring in the cluster itself and enabling developers to take advantage of such services simply by deploying their application into the cluster, Kubernetes has reduced the learning necessary for developers to build scalable reliable applications.

Finally, Kubernetes has provided a new, common vocabulary for expressing the patterns and paradigms of distributed system development. This common vocabulary means that we can more easily describe and discuss the common ways in which our distributed systems are built, and furthermore we can build standardized, re-usable implementations of such systems. The net effect of this is the development of higher quality, reliable distributed systems, more quickly.

It’s truly amazing to see how far Kubernetes has come, from a rough idea in the minds of three people in Seattle to a phenomenon that has redirected the way we think about cloud native development across the world. It has been an amazing journey, but what’s truly amazing to me, is that I think we’re only just now scratching the surface of the impact that Kubernetes will have. Thank you to everyone who has enabled us to get this far, and thanks to everyone who will take us further.

Brendan
