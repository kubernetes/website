---
layout: blog
title:  'Kubernetes 1.12: Kubelet TLS Bootstrap and Azure Virtual Machine Scale Sets (VMSS) Move to General Availability'
date:   2018-09-27
evergreen: true
author: >
  [Kubernetes v1.12 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.12/release_team.md)
---

We’re pleased to announce the delivery of Kubernetes 1.12, our third release of 2018!

Today’s release continues to focus on internal improvements and graduating features to stable in Kubernetes. This newest version graduates key features such as security and Azure. Notable additions in this release include two highly-anticipated features graduating to general availability: Kubelet TLS Bootstrap and Support for Azure Virtual Machine Scale Sets (VMSS).

These new features mean increased security, availability, resiliency, and ease of use to get production applications to market faster. The release also signifies the increasing maturation and sophistication of Kubernetes on the developer side.

Let’s dive into the key features of this release:

## Introducing General Availability of Kubelet TLS Bootstrap

We’re excited to announce General Availability (GA) of [Kubelet TLS Bootstrap](https://github.com/kubernetes/features/issues/43). In Kubernetes 1.4, we introduced an API for requesting certificates from a cluster-level Certificate Authority (CA). The original intent of this API is to enable provisioning of TLS client certificates for kubelets. This feature allows for a kubelet to bootstrap itself into a TLS-secured cluster. Most importantly, it automates the provision and distribution of signed certificates.

Before, when a kubelet ran for the first time, it had to be given client credentials in an out-of-band process during cluster startup. The burden was on the operator to provision these credentials. Because this task was so onerous to manually execute and complex to automate, many operators deployed clusters with a single credential and single identity for all kubelets. These setups prevented deployment of node lockdown features like the Node authorizer and the NodeRestriction admission controller.

To alleviate this, [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth) introduced a way for kubelet to generate a private key and a CSR for submission to a cluster-level certificate signing process. The v1 (GA) designation indicates production hardening and readiness, and comes with the guarantee of long-term backwards compatibility.

Alongside this, [Kubelet server certificate bootstrap and rotation](https://github.com/kubernetes/features/issues/267) is moving to beta. Currently, when a kubelet first starts, it generates a self-signed certificate/key pair that is used for accepting incoming TLS connections. This feature introduces a process for generating a key locally and then issuing a Certificate Signing Request to the cluster API server to get an associated certificate signed by the cluster’s root certificate authority. Also, as certificates approach expiration, the same mechanism will be used to request an updated certificate.

## Support for Azure Virtual Machine Scale Sets (VMSS) and Cluster-Autoscaler is Now Stable

Azure Virtual Machine Scale Sets (VMSS) allow you to create and manage a homogenous VM pool that can automatically increase or decrease based on demand or a set schedule. This enables you to easily manage, scale, and load balance multiple VMs to provide high availability and application resiliency, ideal for large-scale applications that can run as Kubernetes workloads.

With this new stable feature, Kubernetes supports the [scaling of containerized applications with Azure VMSS](https://github.com/kubernetes/features/issues/514), including the ability to [integrate it with cluster-autoscaler](https://github.com/kubernetes/features/issues/513) to automatically adjust the size of the Kubernetes clusters based on the same conditions.

## Additional Notable Feature Updates

[`RuntimeClass`](https://github.com/kubernetes/features/issues/585) is a new cluster-scoped resource that surfaces container runtime properties to the control plane being released as an alpha feature.

[Snapshot / restore functionality for Kubernetes and CSI](https://github.com/kubernetes/features/issues/177) is being introduced as an alpha feature. This provides standardized APIs design (CRDs) and adds PV snapshot/restore support for CSI volume drivers.

[Topology aware dynamic provisioning](https://github.com/kubernetes/features/issues/561) is now in beta, meaning storage resources can now understand where they live. This also includes beta support to [AWS EBS](https://github.com/kubernetes/features/issues/567) and [GCE PD](https://github.com/kubernetes/features/issues/558).

[Configurable pod process namespace sharing](https://github.com/kubernetes/features/issues/495) is moving to beta, meaning users can configure containers within a pod to share a common PID namespace by setting an option in the PodSpec.

[Taint node by condition](https://github.com/kubernetes/features/issues/382) is now in beta, meaning users have the ability to represent node conditions that block scheduling by using taints.

[Arbitrary / Custom Metrics](https://github.com/kubernetes/features/issues/117) in the Horizontal Pod Autoscaler is moving to a second beta to test some additional feature enhancements. This reworked Horizontal Pod Autoscaler functionality includes support for custom metrics and status conditions.

Improvements that will allow the [Horizontal Pod Autoscaler to reach proper size faster](https://github.com/kubernetes/features/issues/591) are moving to beta.

[Vertical Scaling of Pods](https://github.com/kubernetes/features/issues/21) is now in beta, which makes it possible to vary the resource limits on a pod over its lifetime. In particular, this is valuable for pets (i.e., pods that are very costly to destroy and re-create).

[Encryption at rest via KMS](https://github.com/kubernetes/features/issues/460) is now in beta. This adds multiple encryption providers, including Google Cloud KMS, Azure Key Vault, AWS KMS, and Hashicorp Vault, that will encrypt data as it is stored to etcd.

## Availability

Kubernetes 1.12 is available for [download on GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.12.0). To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/). You can also install 1.12 using [Kubeadm](/docs/setup/independent/create-cluster-kubeadm/).

## 5 Day Features Blog Series

If you’re interested in exploring these features more in depth, check back next week for our 5 Days of Kubernetes series where we’ll highlight detailed walkthroughs of the following features:

* Day 1 - Kubelet TLS Bootstrap
* Day 2 - Support for Azure Virtual Machine Scale Sets (VMSS) and Cluster-Autoscaler
* Day 3 - Snapshots Functionality
* Day 4 - RuntimeClass
* Day 5 - Topology Resources

## Release team

This release is made possible through the effort of hundreds of individuals who contributed both technical and non-technical content. Special thanks to the [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.12/release_team.md) led by Tim Pepper, Orchestration & Containers Lead, at VMware Open Source Technology Center. The 36 individuals on the release team coordinate many aspects of the release, from documentation to testing, validation, and feature completeness.

As the Kubernetes community has grown, our release process represents an amazing demonstration of collaboration in open source software development. Kubernetes continues to gain new users at a rapid clip. This growth creates a positive feedback cycle where more contributors commit code creating a more vibrant ecosystem. Kubernetes has over 22,000 individual contributors to date and an active community of more than 45,000 people.

## Project Velocity

The CNCF has continued refining DevStats, an ambitious project to visualize the myriad contributions that go into the project. [K8s DevStats](https://devstats.k8s.io) illustrates the breakdown of contributions from major company contributors, as well as an impressive set of preconfigured reports on everything from individual contributors to pull request lifecycle times. On average, 259 different companies and over 1,400 individuals contribute to Kubernetes each month. [Check out DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) to learn more about the overall velocity of the Kubernetes project and community.

## User Highlights

Established, global organizations are using [Kubernetes in production](https://kubernetes.io/case-studies/) at massive scale. Recently published user stories from the community include:

* **Ygrene**, a PACE (Property Assessed Clean Energy) financing company, is using cloud native to [bring security and scalability to the finance industry](https://kubernetes.io/case-studies/ygrene/), cutting deployment times down to five minutes with Kubernetes.
* **Sling TV**, a live TV streaming service, uses Kubernetes to [enable their hybrid cloud strategy](https://kubernetes.io/case-studies/slingtv/) and deliver a high-quality service for their customers.
* **ING**, a Dutch multinational banking and financial services corporation, moved to Kubernetes with the intent to eventually be able to go from [idea to production within 48 hours](https://kubernetes.io/case-studies/ing/).
* **Pinterest**, a web and mobile application company that is running on 1,000 microservices and hundreds of thousands of data jobs, moved to Kubernetes to [build on-demand scaling and simply the deployment process](https://kubernetes.io/case-studies/pinterest/).
* **Pearson**, a global education company serving 75 million learners, is using Kubernetes to [transform the way that educational content is delivered online](https://kubernetes.io/case-studies/pearson/) and has saved 15-20% in developer productivity.

Is Kubernetes helping your team? [Share your story](https://docs.google.com/a/google.com/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform) with the community.

## Ecosystem Updates

* CNCF recently released the findings of their [bi-annual CNCF survey](https://www.cncf.io/blog/2018/08/29/cncf-survey-use-of-cloud-native-technologies-in-production-has-grown-over-200-percent/), finding that the use of cloud native technologies in production has grown over 200% within the last six months.
* CNCF expanded its certification offerings to include a Certified Kubernetes Application Developer exam. The CKAD exam certifies an individual's ability to design, build, configure, and expose cloud native applications for Kubernetes. More information can be found [here](https://www.cncf.io/blog/2018/03/16/cncf-announces-ckad-exam/).
* CNCF added a new partner category, Kubernetes Training Partners (KTP). KTPs are a tier of vetted training providers who have deep experience in cloud native technology training. View partners and learn more [here](https://www.cncf.io/certification/training/).
* CNCF also offers [online training](https://www.cncf.io/certification/training/) that teaches the skills needed to create and configure a real-world Kubernetes cluster.
* Kubernetes documentation now features [user journeys](https://k8s.io/docs/home/): specific pathways for learning based on who readers are and what readers want to do. Learning Kubernetes is easier than ever for beginners, and more experienced users can find task journeys specific to cluster admins and application developers.  

## KubeCon

The world’s largest Kubernetes gathering, KubeCon + CloudNativeCon is coming to [Shanghai](https://events.linuxfoundation.cn/events/kubecon-cloudnativecon-china-2018/) from November 13-15, 2018 and [Seattle](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2018/) from December 10-13, 2018. This conference will feature technical sessions, case studies, developer deep dives, salons and more! [Register today](https://www.cncf.io/community/kubecon-cloudnativecon-events/)!

## Webinar

Join members of the Kubernetes 1.12 release team on November 6th at 10am PDT to learn about the major features in this release. Register [here](https://zoom.us/webinar/register/WN_DYMejau3TMaTbk91oC3YkA).

## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/blob/master/communication.md#weekly-meeting), and through the channels below.

Thank you for your continued feedback and support.

* Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
* Join the community portal for advocates on [K8sPort](http://k8sport.org/)
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
* Chat with the community on [Slack](http://slack.k8s.io/)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
