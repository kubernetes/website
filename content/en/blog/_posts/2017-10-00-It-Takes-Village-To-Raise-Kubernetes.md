---
title: " It Takes a Village to Raise a Kubernetes "
date: 2017-10-26
slug: it-takes-village-to-raise-kubernetes
url: /blog/2017/10/It-Takes-Village-To-Raise-Kubernetes
---
**_Editor’s note: this post is part of a [series of in-depth articles](https://kubernetes.io/blog/2017/10/five-days-of-kubernetes-18) on what's new in Kubernetes 1.8, written by Jaice Singer DuMars from Microsoft._**


Each time we release a new version of Kubernetes, it’s enthralling to see how the community responds to all of the hard work that went into it. Blogs on new or enhanced capabilities crop up all over the web like wildflowers in the spring. Talks, videos, webinars, and demos are not far behind. As soon as the community seems to take this all in, we turn around and add more to the mix. It’s a thrilling time to be a part of this project, and even more so, the movement. It’s not just software anymore.  

When circumstances opened the door for me to lead the 1.8 release, I signed on despite a minor case of the butterflies. In a private conversation with another community member, they assured me that “being organized, following up, and knowing when to ask for help” were the keys to being a successful lead. That’s when I knew I could do it — and so I did.  

From that point forward, I was wrapped in a patchwork quilt of community that magically appeared at just the right moments. The community’s commitment and earnest passion for quality, consistency, and accountability formed a bedrock from which the release itself was chiseled.  

The 1.8 release team proved incredibly cohesive despite a late start. We approached even the most difficult situations with humor, diligence, and sincere curiosity. My experience leading large teams served me well, and underscored another difference about this release: it was more valuable for me to focus on leadership than diving into the technical weeds to solve every problem.  


Also, the uplifting power of [emoji in Slack](https://kubernetes.slack.com/archives/C2C40FMNF/p1506659664000090) cannot be overestimated.  

An important inflection point is underway in the Kubernetes project. If you’ve taken a ride on a “startup rollercoaster,” this is a familiar story. You come up with an idea so crazy that it might work. You build it, get traction, and slowly clickity-clack up that first big hill. The view from the top is dizzying, as you’ve poured countless hours of life into something completely unknown. Once you go over the top of that hill, everything changes. Breakneck acceleration defines or destroys what has been built.  

In my experience, that zero gravity point is where everyone in the company (or in this case, project) has to get serious about not only building something, but also maintaining it. Without a commitment to maintenance, things go awry really quickly. From codebases that resemble the Winchester Mystery House to epidemics of crashing production implementations, a fiery descent into chaos can happen quickly despite the outward appearance of success. Thankfully, the Kubernetes community seems to be riding our growth rollercoaster with increasing success at each release.  

As software startups mature, there is a natural evolution reflected in the increasing distribution of labor. Explosive adoption means that full-time security, operations, quality, documentation, and project management staff become necessary to deliver stability, reliability, and extensibility. Also, you know things are getting serious when intentional architecture becomes necessary to ensure consistency over time.  

Kubernetes has followed a similar path. In the absence of company departments or skill-specific teams, Special Interest Groups (SIGs) have organically formed around core project needs like storage, networking, API machinery, applications, and the operational lifecycle. As SIGs have proliferated, the Kubernetes governance model has crystallized around them, providing a framework for code ownership and shared responsibility. SIGs also help ensure the community is sustainable because success is often more about people than code.  

At the Kubernetes [leadership summit](https://github.com/kubernetes/community/tree/master/community/2017-events/05-leadership-summit) in June, a proposed SIG architecture was ratified with a unanimous vote, underscoring a stability theme that seemed to permeate every conversation in one way or another. The days of filling in major functionality gaps appear to be over, and a new era of feature depth has emerged in its place.  

Another change is the move away from project-level release “feature themes” to SIG-level initiatives delivered in increments over the course of several releases. That’s an important shift: SIGs have a mission, and everything they deliver should ultimately serve that. As a community, we need to provide facilitation and support so SIGs are empowered to do their best work with minimal overhead and maximum transparency.  

Wisely, the community also spotted the opportunity to provide safe mechanisms for innovation that are increasingly less dependent on the code in kubernetes/kubernetes. This in turn creates a flourishing habitat for experimentation without hampering overall velocity. The project can also address technical debt created during the initial ride up the rollercoaster. However, new mechanisms for innovation present an architectural challenge in defining what is and is not Kubernetes. SIG Architecture addresses the challenge of defining Kubernetes’ boundaries. It’s a work in progress that trends toward continuous improvement.  

This can be a little overwhelming at the individual level. In reality, it’s not that much different from any other successful startup, save for the fact that authority does not come from a traditional org chart. It comes from SIGs, community technical leaders, the newly-formed steering committee, and ultimately you.  

The Kubernetes release process provides a special opportunity to see everything that makes this project tick. I’ll tell you what I saw: people, working together, to do the best they can, in service to everyone who sets out on the cloud native journey.
