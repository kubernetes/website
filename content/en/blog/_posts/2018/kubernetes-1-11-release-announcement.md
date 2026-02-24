---
layout: blog
title: 'Kubernetes 1.11: In-Cluster Load Balancing and CoreDNS Plugin Graduate to General Availability'
date:  2018-06-27
slug: kubernetes-1.11-release-announcement
evergreen: true
author: >
  [Kubernetes v1.11 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.11/release_team.md)
---

We’re pleased to announce the delivery of Kubernetes 1.11, our second release of 2018!

Today’s release continues to advance maturity, scalability, and flexibility of Kubernetes, marking significant progress on features that the team has been hard at work on over the last year. This newest version graduates key features in networking, opens up two major features from SIG-API Machinery and SIG-Node for beta testing, and continues to enhance storage features that have been a focal point of the past two releases. The features in this release make it increasingly possible to plug any infrastructure, cloud or on-premise, into the Kubernetes system.

Notable additions in this release include two highly-anticipated features graduating to general availability: IPVS-based In-Cluster Load Balancing and CoreDNS as a cluster DNS add-on option, which means increased scalability and flexibility for production applications.

Let’s dive into the key features of this release:

## IPVS-Based In-Cluster Service Load Balancing Graduates to General Availability

In this release, [IPVS-based in-cluster service load balancing](https://github.com/kubernetes/features/issues/265) has moved to stable. IPVS (IP Virtual Server) provides high-performance in-kernel load balancing, with a simpler programming interface than iptables. This change delivers better network throughput, better programming latency, and higher scalability limits for the cluster-wide distributed load-balancer that comprises the Kubernetes Service model. IPVS is not yet the default but clusters can begin to use it for production traffic.

## CoreDNS Promoted to General Availability

[CoreDNS](https://coredns.io) is now available as a [cluster DNS add-on option](https://github.com/kubernetes/features/issues/427), and is the default when using kubeadm. CoreDNS is a flexible, extensible authoritative DNS server and directly integrates with the Kubernetes API. CoreDNS has fewer moving parts than the previous DNS server, since it’s a single executable and a single process, and supports flexible use cases by creating custom DNS entries. It’s also written in Go making it memory-safe. You can learn more about CoreDNS [here](https://youtu.be/dz9S7R8r5gw).

## Dynamic Kubelet Configuration Moves to Beta

This feature makes it possible for new Kubelet configurations to be rolled out in a live cluster. Currently, Kubelets are configured via command-line flags, which makes it difficult to update Kubelet configurations in a running cluster. With this beta feature, users can configure Kubelets in a live cluster via the API server.

## Custom Resource Definitions Can Now Define Multiple Versions

Custom Resource Definitions are no longer restricted to defining a single version of the custom resource, a restriction that was difficult to work around. Now, with this beta [feature](https://github.com/kubernetes/features/issues/544), multiple versions of the resource can be defined. In the future, this will be expanded to support some automatic conversions; for now, this feature allows custom resource authors to “promote with safe changes, e.g. v1beta1 to v1,” and to create a migration path for resources which do have changes.

Custom Resource Definitions now also support ["status" and "scale" subresources](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/customresources-subresources.md), which integrate with monitoring and high-availability frameworks. These two changes advance the ability to run cloud-native applications in production using Custom Resource Definitions.

## Enhancements to CSI

Container Storage Interface (CSI) has been a major topic over the last few releases. After moving to [beta in 1.10](https://github.com/container-storage-interface/spec/blob/master/spec.md), the 1.11 release continues enhancing CSI with a number of features. The 1.11 release adds alpha support for raw block volumes to CSI, integrates CSI with the new kubelet plugin registration mechanism, and makes it easier to pass secrets to CSI plugins.

## New Storage Features

Support for [online resizing of Persistent Volumes](https://github.com/kubernetes/features/issues/284) has been introduced as an alpha feature. This enables users to increase the size of PVs without having to terminate pods and unmount volume first. The user will update the PVC to request a new size and kubelet will resize the file system for the PVC.

Support for [dynamic maximum volume count](https://github.com/kubernetes/features/issues/554) has been introduced as an alpha feature. This new feature enables in-tree volume plugins to specify the maximum number of volumes that can be attached to a node and allows the limit to vary depending on the type of node. Previously, these limits were hard coded or configured via an environment variable.

The StorageObjectInUseProtection feature is now stable and prevents the removal of both [Persistent Volumes](https://github.com/kubernetes/features/issues/499) that are bound to a Persistent Volume Claim, and [Persistent Volume Claims](https://github.com/kubernetes/features/issues/498) that are being used by a pod. This safeguard will help prevent issues from deleting a PV or a PVC that is currently tied to an active pod.

Each Special Interest Group (SIG) within the community continues to deliver the most-requested enhancements, fixes, and functionality for their respective specialty areas. For a complete list of inclusions by SIG, please visit the [release notes](https://github.com/kubernetes/kubernetes/blob/release-1.11/CHANGELOG-1.11.md#111-release-notes).

## Availability

Kubernetes 1.11 is available for [download on GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.11.0). To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/).

You can also install 1.11 using Kubeadm. Version 1.11.0 will be available as Deb and RPM packages, installable using the [Kubeadm cluster installer](/docs/setup/independent/create-cluster-kubeadm/) sometime on June 28th.

## 4 Day Features Blog Series

If you’re interested in exploring these features more in depth, check back in two weeks for our 4 Days of Kubernetes series where we’ll highlight detailed walkthroughs of the following features:

* Day 1: [IPVS-Based In-Cluster Service Load Balancing Graduates to General Availability](/blog/2018/07/09/ipvs-based-in-cluster-load-balancing-deep-dive/)
* Day 2: [CoreDNS Promoted to General Availability](/blog/2018/07/10/coredns-ga-for-kubernetes-cluster-dns/)
* Day 3: [Dynamic Kubelet Configuration Moves to Beta](/blog/2018/07/11/dynamic-kubelet-configuration/)
* Day 4: [Resizing Persistent Volumes using Kubernetes](/blog/2018/07/12/resizing-persistent-volumes-using-kubernetes/)

## Release team

This release is made possible through the effort of hundreds of individuals who contributed both technical and non-technical content. Special thanks to the [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.11/release_team.md) led by Josh Berkus, Kubernetes Community Manager at Red Hat. The 20 individuals on the release team coordinate many aspects of the release, from documentation to testing, validation, and feature completeness.

As the Kubernetes community has grown, our release process represents an amazing demonstration of collaboration in open source software development. Kubernetes continues to gain new users at a rapid clip. This growth creates a positive feedback cycle where more contributors commit code creating a more vibrant ecosystem. Kubernetes has over 20,000 individual contributors to date and an active community of more than 40,000 people.

## Project Velocity

The CNCF has continued refining DevStats, an ambitious project to visualize the myriad contributions that go into the project. [K8s DevStats](https://devstats.k8s.io) illustrates the breakdown of contributions from major company contributors, as well as an impressive set of preconfigured reports on everything from individual contributors to pull request lifecycle times. On average, 250 different companies and over 1,300 individuals contribute to Kubernetes each month. [Check out DevStats](https://devstats.k8s.io) to learn more about the overall velocity of the Kubernetes project and community.

## User Highlights

Established, global organizations are using [Kubernetes in production](https://kubernetes.io/case-studies/) at massive scale. Recently published user stories from the community include:

* **The New York Times**, known as the newspaper of record, [moved out of its data centers and into the public cloud](https://kubernetes.io/case-studies/newyorktimes/) with the help of Google Cloud Platform and Kubernetes. This move meant a significant increase in speed of delivery, from 45 minutes to just a few seconds with Kubernetes.
* **Nordstrom**, a leading fashion retailer based in the U.S., began their cloud native journey by [adopting Docker containers orchestrated with Kubernetes](https://kubernetes.io/case-studies/nordstrom/). The results included a major increase in Ops efficiency, improving CPU utilization from 5x to 12x depending on the workload.
* **Squarespace**, a SaaS solution for easily building and hosting websites, [moved their monolithic application to microservices with the help of Kubernetes](https://kubernetes.io/case-studies/squarespace/). This resulted in a deployment time reduction of almost 85%.
* **Crowdfire**, a leading social media management platform, moved from a monolithic application to a [custom Kubernetes-based setup](https://kubernetes.io/case-studies/crowdfire/). This move reduced deployment time from 15 minutes to less than a minute.

Is Kubernetes helping your team? Share your story with the community.

## Ecosystem Updates

* The CNCF recently expanded its certification offerings to include a Certified Kubernetes Application Developer exam. The CKAD exam certifies an individual's ability to design, build, configure, and expose cloud native applications for Kubernetes. More information can be found [here](https://www.cncf.io/blog/2018/03/16/cncf-announces-ckad-exam/).
* The CNCF recently added a new partner category, Kubernetes Training Partners (KTP). KTPs are a tier of vetted training providers who have deep experience in cloud native technology training. View partners and learn more [here](https://www.cncf.io/certification/training/).
* CNCF also offers [online training](https://www.cncf.io/certification/training/) that teaches the skills needed to create and configure a real-world Kubernetes cluster.
* Kubernetes documentation now features [user journeys](https://k8s.io/docs/home/): specific pathways for learning based on who readers are and what readers want to do. Learning Kubernetes is easier than ever for beginners, and more experienced users can find task journeys specific to cluster admins and application developers.

## KubeCon

The world’s largest Kubernetes gathering, KubeCon + CloudNativeCon is coming to [Shanghai](https://events.linuxfoundation.cn/events/kubecon-cloudnativecon-china-2018/ from November 14-15, 2018 and [Seattle](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/) from December 11-13, 2018. This conference will feature technical sessions, case studies, developer deep dives, salons and more! The CFP for both event is currently open. [Submit your talk](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/program/call-for-proposals-cfp/) and [register](https://www.regonline.com/registration/Checkin.aspx?EventID=2246960) today!

## Webinar

Join members of the Kubernetes 1.11 release team on July 31st at 10am PDT to learn about the major features in this release including In-Cluster Load Balancing and the CoreDNS Plugin. Register [here](https://www.cncf.io/event/webinar-kubernetes-1-11/).

## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/blob/master/communication.md#weekly-meeting), and through the channels below.

Thank you for your continued feedback and support.

* Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
* Join the community portal for advocates on [K8sPort](http://k8sport.org/)
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
* Chat with the community on [Slack](http://slack.k8s.io/)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
