---
layout: blog
title: 'Kubernetes 1.13: Simplified Cluster Management with Kubeadm, Container Storage Interface (CSI), and CoreDNS as Default DNS are Now Generally Available'
date: 2018-12-03
slug: kubernetes-1-13-release-announcement
---

**Author**: The 1.13 [Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.13/release_team.md)

We’re pleased to announce the delivery of Kubernetes 1.13, our fourth and final release of 2018!

Kubernetes 1.13 has been one of the shortest releases to date at 10 weeks. This release continues to focus on stability and extensibility of Kubernetes with three major features graduating to general availability this cycle in the areas of Storage and Cluster Lifecycle. Notable features graduating in this release include: simplified cluster management with kubeadm, Container Storage Interface (CSI), and CoreDNS as the default DNS.

These stable graduations are an important milestone for users and operators in terms of setting support expectations. In addition, there’s a continual and steady stream of internal improvements and new alpha features that are made available to the community in this release. These features are discussed in the “additional notable features” section below.

Let’s dive into the key features of this release:

## Simplified Kubernetes Cluster Management with kubeadm in GA

Most people who have gotten hands-on with Kubernetes have at some point been hands-on with kubeadm. It's an essential tool for managing the cluster lifecycle, from creation to configuration to upgrade; and now kubeadm is officially GA. [kubeadm](/docs/reference/setup-tools/kubeadm/) handles the bootstrapping of production clusters on existing hardware and configuring the core Kubernetes components in a best-practice-manner to providing a secure yet easy joining flow for new nodes and supporting easy upgrades. What’s notable about this GA release are the now graduated advanced features, specifically around pluggability and configurability. The scope of kubeadm is to be a toolbox for both admins and automated, higher-level system and this release is a significant step in that direction.

## Container Storage Interface (CSI) Goes GA

The Container Storage Interface ([CSI](https://github.com/container-storage-interface)) is now GA after being introduced as alpha in v1.9 and beta in v1.10. With CSI, the Kubernetes volume layer becomes truly extensible. This provides an opportunity for third party storage providers to write plugins that interoperate with Kubernetes without having to touch the core code. The [specification itself](https://github.com/container-storage-interface/spec) has also reached a 1.0 status.

With CSI now stable, plugin authors are developing storage plugins out of core, at their own pace. You can find a list of sample and production drivers in the [CSI Documentation](https://kubernetes-csi.github.io/docs/drivers.html).

## CoreDNS is Now the Default DNS Server for Kubernetes

In 1.11, we announced CoreDNS had reached General Availability for DNS-based service discovery. In 1.13, [CoreDNS is now replacing kube-dns as the default DNS server](https://github.com/kubernetes/features/issues/566) for Kubernetes. CoreDNS is a general-purpose, authoritative DNS server that provides a backwards-compatible, but extensible, integration with Kubernetes. CoreDNS has fewer moving parts than the previous DNS server, since it’s a single executable and a single process, and supports flexible use cases by creating custom DNS entries. It’s also written in Go making it memory-safe.

CoreDNS is now the recommended DNS solution for Kubernetes 1.13+. The project has switched the common test infrastructure to use CoreDNS by default and we recommend users switching as well. KubeDNS will still be supported for at least one more release, but it's time to start planning your migration. Many OSS installer tools have already made the switch, including [Kubeadm in 1.11](https://kubernetes.io/blog/2018/07/10/coredns-ga-for-kubernetes-cluster-dns/). If you use a hosted solution, please work with your vendor to understand how this will impact you.

## Additional Notable Feature Updates

[Support for 3rd party device monitoring plugins](https://github.com/kubernetes/features/issues/606) has been introduced as an alpha feature. This removes current device-specific knowledge from the kubelet to enable future use-cases requiring device-specific knowledge to be out-of-tree.

[Kubelet Device Plugin Registration](https://github.com/kubernetes/features/issues/595) is graduating to stable. This creates a common Kubelet plugin discovery model that can be used by different types of node-level plugins, such as device plugins, CSI and CNI, to establish communication channels with Kubelet.

[Topology Aware Volume Scheduling](https://github.com/kubernetes/enhancements/issues/490) is now stable. This make the scheduler aware of a Pod's volume's topology constraints, such as zone or node.

[APIServer DryRun](https://github.com/kubernetes/features/issues/576) is graduating to beta. This moves "apply" and declarative object management from `kubectl` to the `apiserver` in order to fix many of the existing bugs that can't be fixed today.

[Kubectl Diff](https://github.com/kubernetes/features/issues/491) is graduating to beta. This allows users to run a `kubectl` command to view the difference between a locally declared object configuration and the current state of a live object.

[Raw block device using persistent volume source](https://github.com/kubernetes/features/issues/351) is graduating to beta. This makes raw block devices (non-networked) available for consumption via a Persistent Volume Source.

Each Special Interest Group (SIG) within the community continues to deliver the most-requested enhancements, fixes, and functionality for their respective specialty areas. For a complete list of inclusions by SIG, please visit the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.13.md#113-release-notes).

## Availability

Kubernetes 1.13 is available for [download on GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.13.0). To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/). You can also easily install 1.13 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/).

## Features Blog Series

If you’re interested in exploring these features more in depth, check back tomorrow for our 5 Days of Kubernetes series where we’ll highlight detailed walkthroughs of the following features:

- Day 1 - Simplified Kubernetes Cluster Creation with Kubeadm
- Day 2 - Out-of-tree CSI Volume Plugins
- Day 3 - Switch default DNS plugin to CoreDNS
- Day 4 - New CLI Tips and Tricks (Kubectl Diff and APIServer Dry run)
- Day 5 - Raw Block Volume

## Release team

This release is made possible through the effort of hundreds of individuals who contributed both technical and non-technical content. Special thanks to the [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.13/release_team.md) led by Aishwarya Sundar, Software Engineer at Google. The 39 individuals on the release team coordinate many aspects of the release, from documentation to testing, validation, and feature completeness.

As the Kubernetes community has grown, our release process represents an amazing demonstration of collaboration in open source software development. Kubernetes continues to gain new users at a rapid clip. This growth creates a positive feedback cycle where more contributors commit code creating a more vibrant ecosystem. Kubernetes has over 25,000 individual contributors to date and an active community of more than 51,000 people.

## Project Velocity

The CNCF has continued refining DevStats, an ambitious project to visualize the myriad contributions that go into the project. [K8s DevStats](https://devstats.k8s.io) illustrates the breakdown of contributions from major company contributors, as well as an impressive set of preconfigured reports on everything from individual contributors to pull request lifecycle times. On average over the past year, 347 different companies and over 2,372 individuals contribute to Kubernetes each month. [Check out DevStats](https://devstats.k8s.io) to learn more about the overall velocity of the Kubernetes project and community.

## User Highlights

Established, global organizations are using [Kubernetes in production](https://kubernetes.io/case-studies/) at massive scale. Recently published user stories from the community include:

- **IBM Cloud**, a leading provider of public, private, and hybrid cloud functionality, is using [cloud native technology for high-availability deployments](https://kubernetes.io/case-studies/ibm/) with three instances across two zones in each of the five regions, load balanced with failover support.
- **The National Association of Insurance Commissioners (NAIC)**, the U.S. standard-setting and regulatory support organization, leverages Kubernetes to [create rapid prototypes in two days](https://kubernetes.io/case-studies/naic/) that would have previously taken at least a month.
- **Ocado**, the world’s largest online-only grocery retailer, [use 15-25% less hardware resources](https://kubernetes.io/case-studies/ocado/) to host the same applications in Kubernetes in their test environments.
- **Adform**, a provider of advertising technology to enable digital ads across devices, [uses Kubernetes to reduce utilization of hardware resources](https://kubernetes.io/case-studies/adform/), with containers notching 2-3 times more efficiency over virtual machines.

Is Kubernetes helping your team? [Share your story](https://docs.google.com/a/google.com/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform) with the community.

## Ecosystem Updates

- CNCF recently released the findings of their [bi-annual CNCF survey](https://www.cncf.io/blog/2018/11/13/cncf-survey-china-november-2018/) in Mandarin, finding that cloud usage in Asia has grown 135% since March 2018.
- CNCF expanded its certification offerings to include a Certified Kubernetes Application Developer exam. The CKAD exam certifies an individual's ability to design, build, configure, and expose cloud native applications for Kubernetes. More information can be found [here](https://www.cncf.io/blog/2018/03/16/cncf-announces-ckad-exam/).
- CNCF added a new partner category, Kubernetes Training Partners (KTP). KTPs are a tier of vetted training providers who have deep experience in cloud native technology training. View partners and learn more [here](https://www.cncf.io/certification/training/).
- CNCF also offers [online training](https://www.cncf.io/certification/training/) that teaches the skills needed to create and configure a real-world Kubernetes cluster.
- Kubernetes documentation now features [user journeys](https://k8s.io/docs/home/): specific pathways for learning based on who readers are and what readers want to do. Learning Kubernetes is easier than ever for beginners, and more experienced users can find task journeys specific to cluster admins and application developers.  

## KubeCon

The world’s largest Kubernetes gathering, KubeCon + CloudNativeCon is coming to [Seattle](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/) from December 10-13, 2018 and [Barcelona](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2019/) from May 20-23, 2019. This conference will feature technical sessions, case studies, developer deep dives, salons, and more. [Registration ](https://www.cncf.io/community/kubecon-cloudnativecon-events/) will open up in early 2019.

## Webinar

Join members of the Kubernetes 1.13 release team on January 10th at 9am PDT to learn about the major features in this release. Register [here](https://zoom.us/webinar/register/WN_A2FZovz-TIWn_Xvrb5uERQ).

## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below.

Thank you for your continued feedback and support.

- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Join the community discussion on [Discuss Kubernetes](https://discuss.kubernetes.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Chat with the community on [Slack](http://slack.k8s.io/)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform).
