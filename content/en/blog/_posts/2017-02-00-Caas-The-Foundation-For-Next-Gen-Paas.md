---
title: " Containers as a Service, the foundation for next generation PaaS "
date: 2017-02-21
slug: caas-the-foundation-for-next-gen-paas
url: /blog/2017/02/Caas-The-Foundation-For-Next-Gen-Paas
author: >
  [Brendan Burns](https://twitter.com/brendandburns) (Microsoft)
---
Containers are revolutionizing the way that people build, package and deploy software. But what is often overlooked is how they are revolutionizing the way that people build the software that builds, packages and deploys software. (it’s ok if you have to read that sentence twice…) Today, and in a talk at [Container World](https://tmt.knect365.com/container-world/) tomorrow, I’m taking a look at how container orchestrators like Kubernetes form the foundation for next generation platform as a service (PaaS). In particular, I’m interested in how cloud container as a service (CaaS) platforms like [Azure Container Service](https://azure.microsoft.com/en-us/services/container-service/), [Google Container Engine](https://cloud.google.com/container-engine/) and [others](/docs/getting-started-guides/#hosted-solutions) are becoming the new infrastructure layer that PaaS is built upon.  

To see this, it’s important to consider the set of services that have traditionally been provided by PaaS platforms:  


- Source code and executable packaging and distribution
- Reliable, zero-downtime rollout of software versions
- Healing, auto-scaling, load balancing

When you look at this list, it’s clear that most of these traditional “PaaS” roles have now been taken over by containers. The container image and container image build tooling has become the way to package up your application. [Container registries](/docs/user-guide/images/#using-a-private-registry) have become the way to distribute your application across the world. Reliable software rollout is achieved using orchestrator concepts like [Deployment](/docs/user-guide/deployments/#what-is-a-deployment) in Kubernetes, and service healing, auto-scaling and load-balancing are all properties of an application deployed in Kubernetes using [ReplicaSets](/docs/user-guide/replicasets/#what-is-a-replicaset) and [Services](/docs/user-guide/services/).  

What then is left for PaaS? Is PaaS going to be replaced by container as a service? I think the answer is “no.” The piece that is left for PaaS is the part that was always the most important part of PaaS in the first place, and that’s the opinionated developer experience. In addition to all of the generic parts of PaaS that I listed above, the most important part of a PaaS has always been the way in which the developer experience and application framework made developers more productive within the boundaries of the platform. PaaS enables developers to go from source code on their laptop to a world-wide scalable service in less than an hour. That’s hugely powerful.&nbsp;  

However, in the world of traditional PaaS, the skills needed to build PaaS infrastructure itself, the software on which the user’s software ran, required very strong skills and experience with distributed systems. Consequently, PaaS tended to be built by distributed system engineers rather than experts in a particular vertical developer experience. This means that PaaS platforms tended towards general purpose infrastructure rather than targeting specific verticals. Recently, we have seen this start to change, first with PaaS targeted at mobile API backends, and later with PaaS targeting “function as a service”. However, these products were still built from the ground up on top of raw infrastructure.  

More recently, we are starting to see these platforms build on top of container infrastructure. Taking for example “function as a service” there are at least two (and likely more) open source implementations of functions as a service that run on top of Kubernetes ([fission](https://github.com/fission/fission) and [funktion](https://github.com/funktionio/funktion/)). This trend will only continue. Building a platform as a service, on top of container as a service is easy enough that you could imagine giving it out as an undergraduate computer science assignment. This ease of development means that individual developers with specific expertise in a vertical (say software for running three-dimensional simulations) can and will build PaaS platforms targeted at that specific vertical experience. In turn, by targeting such a narrow experience, they will build an experience that fits that narrow vertical perfectly, making their solution a compelling one in that target market.  

This then points to the other benefit of next generation PaaS being built on top of container as a service. It frees the developer from having to make an “all-in” choice on a particular PaaS platform. When layered on top of container as a service, the basic functionality (naming, discovery, packaging, etc) are all provided by the CaaS and thus common across multiple PaaS that happened to be deployed on top of that CaaS. This means that developers can mix and match, deploying multiple PaaS to the same container infrastructure, and choosing for each application the PaaS platform that best suits that particular platform. Also, importantly, they can choose to “drop down” to raw CaaS infrastructure if that is a better fit for their application. Freeing PaaS from providing the infrastructure layer, enables PaaS to diversify and target specific experiences without fear of being too narrow. The experiences become more targeted, more powerful, and yet by building on top of container as a service, more flexible as well.  

Kubernetes is infrastructure for next generation applications, PaaS and more. Given this, I’m really excited by our [announcement](https://azure.microsoft.com/en-us/blog/kubernetes-now-generally-available-on-azure-container-service/) today that Kubernetes on Azure Container Service has reached general availability. When you deploy your next generation application to Azure, whether on a PaaS or deployed directly onto Kubernetes itself (or both) you can deploy it onto a managed, supported Kubernetes cluster.  

Furthermore, because we know that the world of PaaS and software development in general is a hybrid one, we’re excited to announce the preview availability of [Windows clusters in Azure Container Service](https://learn.microsoft.com/en-us/azure/container-service/container-service-kubernetes-walkthrough). We’re also working on [hybrid clusters](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes/windows.md) in [ACS-Engine](https://github.com/Azure/acs-engine) and expect to roll those out to general availability in the coming months.  

I’m thrilled to see how containers and container as a service is changing the world of compute, I’m confident that we’re only scratching the surface of the transformation we’ll see in the coming months and years.  



- Get involved with the Kubernetes project on&nbsp;[GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on&nbsp;[Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- [Download](http://get.k8s.io/) Kubernetes
- Connect with the community on&nbsp;[Slack](http://slack.k8s.io/)
- Follow us on Twitter&nbsp;[@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
