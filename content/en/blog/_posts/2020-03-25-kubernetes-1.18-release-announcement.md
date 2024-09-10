---
layout: blog
title: 'Kubernetes 1.18: Fit & Finish'
date: 2020-03-25
slug: kubernetes-1-18-release-announcement
evergreen: true
author: >
  [Kubernetes 1.18 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.18/release_team.md) 
---

We're pleased to announce the delivery of Kubernetes 1.18, our first release of 2020! Kubernetes 1.18 consists of 38 enhancements: 15 enhancements are moving to stable, 11 enhancements in beta, and 12 enhancements in alpha.

Kubernetes 1.18 is a "fit and finish" release. Significant work has gone into improving beta and stable features to ensure users have a better experience. An equal effort has gone into adding new developments and exciting new features that promise to enhance the user experience even more.
Having almost as many enhancements in alpha, beta, and stable is a great achievement. It shows the tremendous effort made by the community on improving the reliability of Kubernetes as well as continuing to expand its existing functionality.


## Major Themes

### Kubernetes Topology Manager Moves to Beta - Align Up!

A beta feature of Kubernetes in release 1.18,  the [Topology Manager feature](https://github.com/nolancon/website/blob/f4200307260ea3234540ef13ed80de325e1a7267/content/en/docs/tasks/administer-cluster/topology-manager.md) enables NUMA alignment of CPU and devices (such as SR-IOV VFs) that will allow your workload to run in an environment optimized for low-latency. Prior to the introduction of the Topology Manager, the CPU and Device Manager would make resource allocation decisions independent of each other. This could result in undesirable allocations on multi-socket systems, causing degraded performance on latency critical applications.

### Serverside Apply Introduces Beta 2

Server-side Apply was promoted to Beta in 1.16, but is now introducing a second Beta in 1.18. This new version will track and manage changes to fields of all new Kubernetes objects, allowing you to know what changed your resources and when.


### Extending Ingress with and replacing a deprecated annotation with IngressClass

In Kubernetes 1.18, there are two significant additions to Ingress: A new `pathType` field and a new `IngressClass` resource. The `pathType` field allows specifying how paths should be matched. In addition to the default `ImplementationSpecific` type, there are new `Exact` and `Prefix` path types. 

The `IngressClass` resource is used to describe a type of Ingress within a Kubernetes cluster. Ingresses can specify the class they are associated with by using a new `ingressClassName` field on Ingresses. This new resource and field replace the deprecated `kubernetes.io/ingress.class` annotation.

### SIG-CLI introduces kubectl alpha debug

SIG-CLI was debating the need for a debug utility for quite some time already. With the development of [ephemeral containers](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/), it became more obvious how we can support developers with tooling built on top of `kubectl exec`. The addition of the [`kubectl alpha debug` command](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/20190805-kubectl-debug.md) (it is alpha but your feedback is more than welcome), allows developers to easily debug their Pods inside the cluster. We think this addition is invaluable.  This command allows one to create a temporary container which runs next to the Pod one is trying to examine, but also attaches to the console for interactive troubleshooting.


### Introducing Windows CSI support alpha for Kubernetes

The alpha version of CSI Proxy for Windows is being released with Kubernetes 1.18. CSI proxy enables CSI Drivers on Windows by allowing containers in Windows to perform privileged storage operations.

## Other Updates

### Graduated to Stable 💯

- [Taint Based Eviction](https://github.com/kubernetes/enhancements/issues/166)
- [`kubectl diff`](https://github.com/kubernetes/enhancements/issues/491)
- [CSI Block storage support](https://github.com/kubernetes/enhancements/issues/565)
- [API Server dry run](https://github.com/kubernetes/enhancements/issues/576)
- [Pass Pod information in CSI calls](https://github.com/kubernetes/enhancements/issues/603)
- [Support Out-of-Tree vSphere Cloud Provider](https://github.com/kubernetes/enhancements/issues/670)
- [Support GMSA for Windows workloads](https://github.com/kubernetes/enhancements/issues/689)
- [Skip attach for non-attachable CSI volumes](https://github.com/kubernetes/enhancements/issues/770)
- [PVC cloning](https://github.com/kubernetes/enhancements/issues/989)
- [Moving kubectl package code to staging](https://github.com/kubernetes/enhancements/issues/1020)
- [RunAsUserName for Windows](https://github.com/kubernetes/enhancements/issues/1043)
- [AppProtocol for Services and Endpoints](https://github.com/kubernetes/enhancements/issues/1507)
- [Extending Hugepage Feature](https://github.com/kubernetes/enhancements/issues/1539)
- [client-go signature refactor to standardize options and context handling](https://github.com/kubernetes/enhancements/issues/1601)
- [Node-local DNS cache](https://github.com/kubernetes/enhancements/issues/1024)


### Major Changes

- [EndpointSlice API](https://github.com/kubernetes/enhancements/issues/752)
- [Moving kubectl package code to staging](https://github.com/kubernetes/enhancements/issues/1020)
- [CertificateSigningRequest API](https://github.com/kubernetes/enhancements/issues/1513)
- [Extending Hugepage Feature](https://github.com/kubernetes/enhancements/issues/1539)
- [client-go signature refactor to standardize options and context handling](https://github.com/kubernetes/enhancements/issues/1601)


### Release Notes

Check out the full details of the Kubernetes 1.18 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md).


### Availability

Kubernetes 1.18 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.18.0). To get started with Kubernetes, check out these [interactive tutorials](https://kubernetes.io/docs/tutorials/) or run local Kubernetes clusters using Docker container “nodes” with [kind](https://kind.sigs.k8s.io/). You can also easily install 1.18 using [kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/). 

### Release Team

This release is made possible through the efforts of hundreds of individuals who contributed both technical and non-technical content. Special thanks to the [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.18/release_team.md) led by Jorge Alarcon Ochoa, Site Reliability Engineer at Searchable AI. The 34 release team members coordinated many aspects of the release, from documentation to testing, validation, and feature completeness. 

As the Kubernetes community has grown, our release process represents an amazing demonstration of collaboration in open source software development. Kubernetes continues to gain new users at a rapid pace. This growth creates a positive feedback cycle where more contributors commit code creating a more vibrant ecosystem. Kubernetes has had over [40,000 individual contributors](https://k8s.devstats.cncf.io/d/24/overall-project-statistics?orgId=1) to date and an active community of more than 3,000 people.

### Release Logo

![Kubernetes 1.18 Release Logo](/images/blog/2020-03-25-kubernetes-1.18-release-announcement/release-logo.png)

#### Why the LHC?

The LHC is the world’s largest and most powerful particle accelerator.  It is the result of the collaboration of thousands of scientists from around the world, all for the advancement of science. In a similar manner, Kubernetes has been a project that has united thousands of contributors from hundreds of organizations – all to work towards the same goal of improving cloud computing in all aspects! "A Bit Quarky" as the release name is meant to remind us that unconventional ideas can bring about great change and keeping an open mind to diversity will lead help us innovate.


#### About the designer

Maru Lango is a designer currently based in Mexico City. While her area of expertise is Product Design, she also enjoys branding, illustration and visual experiments using CSS + JS and contributing to diversity efforts within the tech and design communities. You may find her in most social media as @marulango or check her website: https://marulango.com

### User Highlights

- Ericsson is using Kubernetes and other cloud native technology to deliver a [highly demanding 5G network](https://www.cncf.io/case-study/ericsson/) that resulted in up to 90 percent CI/CD savings.
- Zendesk is using Kubernetes to [run around 70% of its existing applications](https://www.cncf.io/case-study/zendesk/). It’s also building all new applications to also run on Kubernetes, which has brought time savings, greater flexibility, and increased velocity  to its application development.
- LifeMiles has [reduced infrastructure spending by 50%](https://www.cncf.io/case-study/lifemiles/) because of its move to Kubernetes. It has also allowed them to double its available resource capacity.

### Ecosystem Updates

- The CNCF published the results of its [annual survey](https://www.cncf.io/blog/2020/03/04/2019-cncf-survey-results-are-here-deployments-are-growing-in-size-and-speed-as-cloud-native-adoption-becomes-mainstream/) showing that Kubernetes usage in production is skyrocketing. The survey found that 78% of respondents are using Kubernetes in production compared to 58% last year.
- The “Introduction to Kubernetes” course hosted by the CNCF [surpassed 100,000 registrations](https://www.cncf.io/announcement/2020/01/28/cloud-native-computing-foundation-announces-introduction-to-kubernetes-course-surpasses-100000-registrations/).

### Project Velocity

The CNCF has continued refining DevStats, an ambitious project to visualize the myriad contributions that go into the project. [K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1) illustrates the breakdown of contributions from major company contributors, as well as an impressive set of preconfigured reports on everything from individual contributors to pull request lifecycle times. 

This past quarter, 641 different companies and over 6,409 individuals contributed to Kubernetes. [Check out DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) to learn more about the overall velocity of the Kubernetes project and community.

### Event Update

Kubecon + CloudNativeCon EU 2020 is being pushed back –  for the more most up-to-date information, please check the [Novel Coronavirus Update page](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/attend/novel-coronavirus-update/).

### Upcoming Release Webinar

Join members of the Kubernetes 1.18 release team on April 23rd, 2020 to learn about the major features in this release including kubectl debug, Topography Manager, Ingress to V1 graduation, and client-go. Register here: https://www.cncf.io/webinars/kubernetes-1-18/.

### Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
