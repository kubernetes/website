---
title: "Kubernetes 1.1 Performance upgrades, improved tooling and a growing community"
date: 2015-11-09
slug: kubernetes-1-1-performance-upgrades-improved-tooling-and-a-growing-community
url: /blog/2015/11/Kubernetes-1-1-Performance-Upgrades-Improved-Tooling-And-A-Growing-Community
evergreen: true
author: >
  David Aronchick (Google)
---

Since the Kubernetes 1.0 release in July, we’ve seen tremendous adoption by companies building distributed systems to manage their container clusters. We’re also been humbled by the rapid growth of the community who help make Kubernetes better everyday. We have seen commercial offerings such as Tectonic by CoreOS and RedHat Atomic Host emerge to deliver deployment and support of Kubernetes. And a growing ecosystem has added Kubernetes support including tool vendors such as Sysdig and Project Calico.  

With the help of hundreds of contributors, we’re proud to announce the availability of Kubernetes 1.1, which offers major performance upgrades, improved tooling, and new features that make applications even easier to build and deploy.

Some of the work we’d like to highlight includes:

- **Substantial performance improvements** : We have architected Kubernetes from day one to handle Google-scale workloads, and our customers have put it through their paces. In Kubernetes 1.1, we have made further investments to ensure that you can run in extremely high-scale environments; later this week, we will be sharing examples of running thousand node clusters, and running over a million QPS against a single cluster.&nbsp;

- **Significant improvement in network throughput** : Running Google-scale workloads also requires Google-scale networking. In Kubernetes 1.1, we have included an option to use native IP tables offering an 80% reduction in tail latency, an almost complete elimination of CPU overhead and improvements in reliability and system architecture ensuring Kubernetes can handle high-scale throughput well into the future.&nbsp;

- **Horizontal pod autoscaling (Beta)**: Many workloads can go through spiky periods of utilization, resulting in uneven experiences for your users. Kubernetes now has support for horizontal pod autoscaling, meaning your pods can scale up and down based on CPU usage. Read more about [Horizontal pod autoscaling](http://kubernetes.io/v1.1/docs/user-guide/horizontal-pod-autoscaler.html).&nbsp;

- **HTTP load balancer (Beta)**: Kubernetes now has the built-in ability to route HTTP traffic based on the packets introspection. This means you can have ‘http://foo.com/bar’ go to one service, and ‘http://foo.com/meep’ go to a completely independent service. Read more about the [Ingress object](http://kubernetes.io/v1.1/docs/user-guide/ingress.html).&nbsp;

- **Job objects (Beta)**: We’ve also had frequent request for integrated batch jobs, such as processing a batch of images to create thumbnails or a particularly large data file that has been broken down into many chunks. [Job objects](https://github.com/kubernetes/kubernetes/blob/master/docs/user-guide/jobs.md#writing-a-job-spec) introduces a new API object that runs a workload, restarts it if it fails, and keeps trying until it’s successfully completed. Read more about the[Job object](http://kubernetes.io/v1.1/docs/user-guide/jobs.html).&nbsp;

- **New features to shorten the test cycle for developers** : We continue to work on making developing for applications for Kubernetes quick and easy. Two new features that speeds developer’s workflows include the ability to run containers interactively, and improved schema validation to let you know if there are any issues with your configuration files before you deploy them.&nbsp;

- **Rolling update improvements** : Core to the DevOps movement is being able to release new updates without any affect on a running service. Rolling updates now ensure that updated pods are healthy before continuing the update.&nbsp;

- And many more. For a complete list of updates, see the [1.1. release](https://github.com/kubernetes/kubernetes/releases) notes on GitHub&nbsp;



Today, we’re also proud to mark the inaugural Kubernetes conference, [KubeCon](https://kubecon.io/), where some 400 community members along with dozens of vendors are in attendance supporting the Kubernetes project.

We’d love to highlight just a few of the many partners making Kubernetes better:

> “We are betting our major product, Tectonic – which enables any company to deploy, manage and secure its containers anywhere – on Kubernetes because we believe it is the future of the data center. The release of Kubernetes 1.1 is another major milestone that will create more widespread adoption of distributed systems and containers, and puts us on a path that will inevitably lead to a whole new generation of products and services.” – Alex Polvi, CEO, CoreOS.

> “Univa’s customers are looking for scalable, enterprise-caliber solutions to simplify managing container and non-container workloads in the enterprise. We selected Kubernetes as a foundational element of our new Navops suite which will help IT and DevOps rapidly integrate containerized workloads into their production systems and extend these workloads into cloud services.” – Gary Tyreman, CEO, Univa.

> “The tremendous customer demand we’re seeing to run containers at scale with Kubernetes is a critical element driving growth in our professional services business at Redapt. As a trusted advisor, it’s great to have a tool like Kubernetes in our tool belt to help our customers achieve their objectives.” – Paul Welch, SR VP Cloud Solutions, Redapt

As we mentioned above, we would love your help:

- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)&nbsp;
- Connect with the community on [Slack](http://slack.kubernetes.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates&nbsp;
- Post questions (or answer questions) on StackOverflow
- Get started running, deploying, and using Kubernetes [guides](/docs/tutorials/kubernetes-basics/);

But, most of all, just let us know how you are transforming your business using Kubernetes, and how we can help you do it even faster. Thank you for your support!
