---
title: " One million requests per second: Dependable and dynamic distributed systems at scale "
date: 2015-11-11
slug: one-million-requests-per-second-dependable-and-dynamic-distributed-systems-at-scale
url: /blog/2015/11/One-Million-Requests-Per-Second-Dependable-And-Dynamic-Distributed-Systems-At-Scale
author: >
  Brendan Burns (Google)
---

Recently, I’ve gotten in the habit of telling people that building a reliable service isn’t that hard. If you give me two Compute Engine virtual machines, a Cloud Load balancer, supervisord and nginx, I can create you a static web service that will serve a static web page, effectively forever.  

The real challenge is building agile AND reliable services. In the new world of software development it's trivial to spin up enormous numbers of machines and push software to them. Developing a successful product must _also_ include the ability to respond to changes in a predictable way, to handle upgrades elegantly and to minimize downtime for users. Missing on any one of these elements results in an _unsuccessful_ product that's flaky and unreliable. I remember a time, not that long ago, when it was common for websites to be unavailable for an hour around midnight each day as a safety window for software upgrades. My bank still does this. It’s really not cool.  

Fortunately, for developers, our infrastructure is evolving along with the requirements that we’re placing on it. Kubernetes has been designed from the ground up to make it easy to design, develop and deploy dependable, dynamic services that meet the demanding requirements of the cloud native world.  

To demonstrate exactly what we mean by this, I've developed a simple demo of a Container Engine cluster serving 1 million HTTP requests per second. In all honesty, serving 1 million requests per second isn’t really that exciting. In fact, it’s really so very [2013](http://googlecloudplatform.blogspot.com/2013/11/compute-engine-load-balancing-hits-1-million-requests-per-second.html).

[![](https://4.bp.blogspot.com/-eACCKAzuQFQ/VkO1rwW1DRI/AAAAAAAAAko/zKu-19QCCBU/s640/image01.gif)](https://4.bp.blogspot.com/-eACCKAzuQFQ/VkO1rwW1DRI/AAAAAAAAAko/zKu-19QCCBU/s1600/image01.gif)


What _is_ exciting is that while successfully handling 1 million HTTP requests per second with uninterrupted availability, we have Kubernetes perform a zero-downtime rolling upgrade of the service to a new version of the software _while we're&nbsp; **still** serving 1 million requests per second_.  


[![](https://2.bp.blogspot.com/-_96_QwNRHLo/VkO1oDAyLLI/AAAAAAAAAkk/B_y5Uh5ngPU/s640/image00.gif)](https://2.bp.blogspot.com/-_96_QwNRHLo/VkO1oDAyLLI/AAAAAAAAAkk/B_y5Uh5ngPU/s1600/image00.gif)


This is only possible due to a large number of performance tweaks and enhancements that have gone into the [Kubernetes 1.1 release](https://kubernetes.io/blog/2015/11/Kubernetes-1-1-Performance-upgrades-improved-tooling-and-a-growing-community). I’m incredibly proud of all of the features that our community has built into this release. Indeed in addition to making it possible to serve 1 million requests per second, we’ve also added an auto-scaler, so that you won’t even have to wake up in the middle of the night to scale your service in response to load or memory pressures.  

If you want to try this out on your own cluster (or use the load test framework to test your own service) the code for the [demo is available on github](https://github.com/kubernetes/contrib/pull/226). And the [full video](https://www.youtube.com/watch?v=7TOWLerX0Ps) is available.  

I hope I’ve shown you how Kubernetes can enable developers of distributed systems to achieve both reliability and agility at scale, and as always, if you’re interested in learning more, head over to [kubernetes.io](http://kubernetes.io/) or [github](https://github.com/kubernetes/kubernetes) and connect with the community on our [Slack](http://slack.kubernetes.io/) channel.&nbsp;  


 "https://www.youtube.com/embed/7TOWLerX0Ps"
