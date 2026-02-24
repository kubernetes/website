---
layout: blog
title: Join SIG Scalability and Learn Kubernetes the Hard Way
date: 2020-03-19
slug: join-sig-scalability
author: >
  Alex Handy
---

Contributing to SIG Scalability is a great way to learn Kubernetes in all its depth and breadth, and the team would love to have you [join as a contributor](https://github.com/kubernetes/community/tree/master/sig-scalability#scalability-special-interest-group). I took a look at the value of learning the hard way and interviewed the current SIG chairs to give you an idea of what contribution feels like.

## The value of Learning The Hard Way

There is a belief in the software development community that pushes for the most challenging and rigorous possible method of learning a new language or system. These tend to go by the moniker of "Learn \_\_ the Hard Way." Examples abound: Learn Code the Hard Way, Learn Python the Hard Way, and many others originating with Zed Shaw's courses in the topic.

While there are folks out there who offer you a "Learn Kubernetes the Hard Way" type experience (most notably [Kelsey Hightower's](https://github.com/kelseyhightower/kubernetes-the-hard-way)), any "Hard Way" project should attempt to cover every aspect of the core topic's principles.

Therefore, the real way to "Learn Kubernetes the Hard Way," is to join the CNCF and get involved in the project itself. And there is only one SIG that could genuinely offer a full-stack learning experience for Kubernetes: SIG Scalability.

The team behind SIG Scalability is responsible for detecting and dealing with issues that arise when Kubernetes clusters are working with upwards of a thousand nodes. Said [Wojiciech Tyczynski](https://github.com/wojtek-t), a staff software engineer at Google and a member of SIG Scalability, the standard size for a test cluster for this SIG is over 5,000 nodes.

And yet, this SIG is not composed of Ph.D.'s in highly scalable systems designs. Many of the folks working with Tyczynski, for example, joined the SIG knowing very little about these types of issues, and often, very little about Kubernetes.

Working on SIG Scalability is like jumping into the deep end of the pool to learn to swim, and the SIG is inherently concerned with the entire Kubernetes project. SIG Scalability focuses on how Kubernetes functions as a whole and at scale. The SIG Scalability team members have an impetus to learn about every system and to understand how all systems interact with one another.

## A complex and rewarding contributor experience

While that may sound complicated (and it is!), that doesn't mean it's outside the reach of an average developer, tester, or administrator. Google software developer Matt Matejczyk has only been on the team since the beginning of 2019, and he's been a valued member of the team since then, ferreting out bugs.

"I am new here," said Matejczyk. "I joined the team in January [2019]. Before that, I worked on AdWords at Google in New York. Why did I join? I knew some people there, so that was one of the decisions for me to move. I thought at that time that Kubernetes is a unique, cutting edge technology. I thought it'd be cool to work on that."

Matejczyk was correct about the coolness. "It's cool," he said. "So actually, ramping up on scalability is not easy. There are many things you need to understand. You need to understand Kubernetes very well. It can use every part of Kubernetes. I am still ramping up after these 8 months. I think it took me maybe 3 months to get up to decent speed."

When Matejczyk spoke to what he had worked on during those 8 months, he answered, "An interesting example is a regression I have been working on recently. We noticed the overall slowness of Kubernetes control plane in specific scenarios, and we couldn't attribute it to any particular component. In the end, we realized that everything boiled down to the memory allocation on the golang level. It was very counterintuitive to have two completely separate pieces of code (running as a part of the same binary) affecting the performance of each other only because one of them was allocating memory too fast. But connecting all the dots and getting to the bottom of regression like this gives great satisfaction."

Tyczynski said that "It's not only debugging regressions, but it's also debugging and finding bottlenecks. In general, those can be regressions, but those can be things we can improve. The other significant area is extending what we want to guarantee to users. Extending SLA and SLO coverage of the system so users can rely on what they can expect from the system in terms of performance and scalability. Matt is doing much work in extending our tests to be more representative and cover more Kubernetes concepts."

## Give SIG Scalability a try

The SIG Scalability team is always in need of new members, and if you're the sort of developer or tester who loves taking on new complex challenges, and perhaps loves learning things the hard way, consider joining this SIG. As the team points out, adding Kubernetes expertise to your resume is never a bad idea, and this is the one SIG where you can learn it all from top to bottom.

See [the SIG's documentation](https://github.com/kubernetes/community/tree/master/sig-scalability#scalability-special-interest-group) to learn about upcoming meetings, its charter, and more. You can also join the [#sig-scalability Slack channel](https://kubernetes.slack.com/archives/C09QZTRH7) to see what it's like. We hope to see you join in to take advantage of this great opportunity to learn Kubernetes and contribute back at the same time.
