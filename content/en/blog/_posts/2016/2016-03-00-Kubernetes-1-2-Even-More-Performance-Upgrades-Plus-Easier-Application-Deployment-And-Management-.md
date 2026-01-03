---
title: "Kubernetes 1.2: Even more performance upgrades, plus easier application deployment and management"
date: 2016-03-17
slug: kubernetes-1.2-even-more-performance-upgrades-plus-easier-application-deployment-and-management
url: /blog/2016/03/Kubernetes-1-2-Even-More-Performance-Upgrades-Plus-Easier-Application-Deployment-And-Management
evergreen: true
author: >
  David Aronchick (Google)
---

Today the Kubernetes project released Kubernetes 1.2. This release represents significant improvements for large organizations building distributed systems. Now with over 680 unique contributors to the project, this release represents our largest yet.  

From the beginning, our mission has been to make building distributed systems easy and accessible for all. With the Kubernetes 1.2 release we’ve made strides towards our goal by increasing scale, decreasing latency and overall simplifying the way applications are deployed and managed. Now, developers at organizations of all sizes can build production scale apps more easily than ever before.&nbsp;

## What’s new

- **Significant scale improvements**. Increased cluster scale by 400% to 1,000 nodes and 30,000 containers per cluster.
- **Simplified application deployment and management**.

  - Dynamic Configuration (via the ConfigMap API) enables applications to pull their configuration when they run rather than packaging it in at build time.&nbsp;
  - Turnkey Deployments (via the Beta Deployment API) let you declare your application and Kubernetes will do the rest. It handles versioning, multiple simultaneous rollouts, aggregating status across all pods, maintaining application availability and rollback.&nbsp;
- **Automated cluster management** :

  - Improved reliability through cross-zone failover and multi-zone scheduling
  - Simplified One-Pod-Per-Node Applications (via the Beta DaemonSet API) allows you to schedule a service (such as a logging agent) that runs one, and only one, pod per node.&nbsp;
  - TLS and L7 support (via the Beta Ingress API) provides a straightforward way to integrate into custom networking environments by supporting TLS for secure communication and L7 for http-based traffic routing.&nbsp;
  - Graceful Node Shutdown (aka Node Drain) takes care of transitioning pods off a node and allowing it to be shut down cleanly.&nbsp;
  - Custom Metrics for Autoscaling now supports custom metrics, allowing you to specify a set of signals to indicate autoscaling pods.&nbsp;
- **New GUI** allows you to get started quickly and enables the same functionality found in the CLI for a more approachable and discoverable interface.

[![](https://1.bp.blogspot.com/-_xwIlw1gJo4/VusiOuHRzCI/AAAAAAAAA3s/NDN91tgdypQE7iBjzTCWlO7vzfDNt_guw/s640/k8-1.2-release.png)](https://1.bp.blogspot.com/-_xwIlw1gJo4/VusiOuHRzCI/AAAAAAAAA3s/NDN91tgdypQE7iBjzTCWlO7vzfDNt_guw/s1600/k8-1.2-release.png)

- **And many more**. For a complete list of updates, see the [release notes on github](https://github.com/kubernetes/kubernetes/releases/tag/v1.2.0).&nbsp;

## Community

All these improvements would not be possible without our enthusiastic and global community. The momentum is astounding. We’re seeing over 400 pull requests per week, a 50% increase since the previous 1.1 release. There are meetups and conferences discussing Kubernetes nearly every day, on top of the 85 Kubernetes related [meetup groups](http://www.meetup.com/topics/kubernetes/) around the world. We’ve also seen significant participation in the community in the form of Special Interest Groups, with 18 active SIGs that cover topics from AWS and OpenStack to big data and scalability, to get involved [join or start a new SIG](https://github.com/kubernetes/kubernetes/wiki/Special-Interest-Groups-(SIGs)). Lastly, we’re proud that Kubernetes is the first project to be accepted to the Cloud Native Computing Foundation (CNCF), read more about the announcement [here](https://cncf.io/news/announcement/2016/03/cloud-native-computing-foundation-accepts-kubernetes-first-hosted-projec-0).



## Documentation

With Kubernetes 1.2 comes a relaunch of our website at [kubernetes.io](http://kubernetes.io/). We’ve slimmed down the docs contribution process so that all you have to do is fork/clone and send a PR. And the site works the same whether you’re staging it on your laptop, on github.io, or viewing it in production. It’s a pure GitHub Pages project; no scripts, no plugins.



From now on, our docs are at a new repo: [https://github.com/kubernetes/kubernetes.github.io](https://github.com/kubernetes/kubernetes.github.io)



To entice you even further to contribute, we’re also announcing our new bounty program. For every “bounty bug” you address with a merged pull request, we offer the listed amount in credit for Google Cloud Platform services. Just look for [bugs labeled “Bounty” in the new repo](https://github.com/kubernetes/kubernetes.github.io/issues?q=is%3Aissue+is%3Aopen+label%3ABounty) for more details.&nbsp;



## Roadmap

All of our work is done in the open, to learn the latest about the project j[oin the weekly community meeting](https://groups.google.com/forum/#!forum/kubernetes-community-video-chat) or [watch a recorded hangout](https://www.youtube.com/playlist?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ). In keeping with our major release schedule of every three to four months, here are just a few items that are in development for [next release and beyond](https://github.com/kubernetes/kubernetes/wiki/Release-1.3):&nbsp;

- Improved stateful application support (aka Pet Set)&nbsp;
- Cluster Federation (aka Ubernetes)&nbsp;
- Even more (more!) performance improvements&nbsp;
- In-cluster IAM&nbsp;
- Cluster autoscaling&nbsp;
- Scheduled job&nbsp;
- Public dashboard that allows for nightly test runs across multiple cloud providers&nbsp;
- Lots, lots more!&nbsp;
Kubernetes 1.2 is available for download at [get.k8s.io](http://get.k8s.io/) and via the open source repository hosted on [GitHub](https://github.com/kubernetes/kubernetes). To get started with Kubernetes try our new [Hello World app](/docs/hellonode/).&nbsp;



## Connect

We’d love to hear from you and see you participate in this growing community:&nbsp;

- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)&nbsp;
- Post questions (or answer questions) on [Stackoverflow](https://stackoverflow.com/questions/tagged/kubernetes)&nbsp;
- &nbsp;Connect with the community on [Slack](http://slack.kubernetes.io/)&nbsp;
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates&nbsp;

Thank you for your support!



