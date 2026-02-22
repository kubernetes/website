---
layout: blog
title: 'Kubernetes  1.19: Accentuate the Paw-sitive'
date: 2020-08-26
slug: kubernetes-release-1.19-accentuate-the-paw-sitive
evergreen: true
author: >
  [Kubernetes 1.19 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.19/release_team.md)
---

Finally, we have arrived with Kubernetes 1.19, the second release for 2020, and by far the longest release cycle lasting 20 weeks in total. It consists of 34 enhancements: 10 enhancements are moving to stable, 15 enhancements in beta, and 9 enhancements in alpha.

The 1.19 release was quite different from a regular release due to COVID-19, the George Floyd protests, and several other global events that we experienced as a release team. Due to these events, we made the decision to adjust our timeline and allow the SIGs, Working Groups, and contributors more time to get things done. The extra time also allowed for people to take time to focus on their lives outside of the Kubernetes project, and ensure their mental wellbeing was in a good place.

Contributors are the heart of Kubernetes, not the other way around. The Kubernetes code of conduct asks that people be excellent to one another and despite the unrest in our world, we saw nothing but greatness and humility from the community.

## Major Themes
### Increase Kubernetes support window to one year

A survey conducted in early 2019 by the [Long Term Support (LTS) working group](https://github.com/kubernetes/community/tree/master/wg-lts#readme) showed that a significant subset of Kubernetes end-users fail to upgrade within the current 9-month support period.
This, and other responses from the survey, suggest that 30% of users would be able to keep their deployments on supported versions if the patch support period were extended to 12-14 months. This appears to be true regardless of whether the users are on self build or commercially vendored distributions. An extension would thus lead to more than 80% of users being on supported versions, instead of the 50-60% we have now.
A yearly support period provides the cushion end-users appear to desire, and is more in harmony with familiar annual planning cycles.
From Kubernetes version 1.19 on, the support window will be extended to one year.

### Storage capacity tracking

Traditionally, the Kubernetes scheduler was based on the assumptions that additional persistent storage is available everywhere in the cluster and has infinite capacity. Topology constraints addressed the first point, but up to now pod scheduling was still done without considering that the remaining storage capacity may not be enough to start a new pod. [Storage capacity tracking](/docs/concepts/storage/storage-capacity/), a new alpha feature, addresses that by adding an API for a CSI driver to report storage capacity and uses that information in the Kubernetes scheduler when choosing a node for a pod. This feature serves as a stepping stone for supporting dynamic provisioning for local volumes and other volume types that are more capacity constrained.

#### Generic ephemeral volumes
Kubernetes provides volume plugins whose lifecycle is tied to a pod and can be used as scratch space (e.g. the builtin `emptydir` volume type) or to load some data in to a pod (e.g. the builtin `configmap` and `secret` volume types, or “CSI inline volumes”). The new [generic ephemeral volumes](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes) alpha feature allows any existing storage driver that supports dynamic provisioning to be used as an ephemeral volume with the volume’s lifecycle bound to the Pod.
It can be used to provide scratch storage that is different from the root disk, for example persistent memory, or a separate local disk on that node.
All StorageClass parameters for volume provisioning are supported.
All features supported with PersistentVolumeClaims are supported, such as storage capacity tracking, snapshots and restore, and volume resizing.

#### CSI Volume Health Monitoring
The alpha version of CSI health monitoring is being released with Kubernetes 1.19. This feature enables CSI Drivers to share abnormal volume conditions from the underlying storage systems with Kubernetes so that they can be reported as events on PVCs or Pods. This feature serves as a stepping stone towards programmatic detection and resolution of individual volume health issues by Kubernetes.

### Ingress graduates to General Availability
In terms of moving the Ingress API towards GA, the API itself has been available in beta for so long that it has attained de facto GA status through usage and adoption (both by users and by load balancer / ingress controller providers). Abandoning it without a full replacement is not a viable approach. It is clearly a useful API and captures a non-trivial set of use cases. At this point, it seems more prudent to declare the current API as something the community will support as a V1, codifying its status, while working on either a V2 Ingress API or an entirely different API with a superset of features.

### Structured logging
Before v1.19, logging in the Kubernetes control plane couldn't guarantee any uniform structure for log messages and references to Kubernetes objects in those logs. This makes parsing, processing, storing, querying and analyzing logs hard and forces administrators and developers to rely on ad-hoc solutions in most cases based on some regular expressions. Due to those problems any analytical solution based on those logs is hard to implement and maintain.

#### New klog methods
This Kubernetes release introduces new methods to the _klog_ library that provide a more structured interface for formatting log messages. Each existing formatted log method (`Infof`, `Errorf`) is now matched by a structured method (`InfoS`, `ErrorS`). The new logging methods accept log messages as a first argument and a list of key-values pairs as a variadic second argument. This approach allows incremental adoption of structured logging without converting **all** of Kubernetes to a new API at one time.

### Client TLS certificate rotation for kubelet

A kubelet authenticates the kubelet to the kube-apiserver using a private key and certificate. The certificate is supplied to the kubelet when it is first booted, via an out-of-cluster mechanism. Since Kubernetes v1.8, clusters have included a (beta) process for obtaining the initial cert/key pair and rotating it as expiration of the certificate approaches. In Kubernetes v1.19 this graduates to stable.

During the kubelet start-up sequence, the filesystem is scanned for an existing cert/key pair, which is managed by the certificate manager. In the case that a cert/key is available it will be loaded. If not, the kubelet checks its config file for an encoded certificate value or a file reference in the kubeconfig. If the certificate is a bootstrap certificate, this will be used to generate a key, create a certificate signing request and request a signed certificate from the API server.

When an expiration approaches the cert manager takes care of providing the correct certificate, generating new private keys and requesting new certificates. With the kubelet requesting certificates be signed as part of its boot sequence, and on an ongoing basis, certificate signing requests from the kubelet need to be auto approved to make cluster administration manageable.

## Other Updates
### Graduated to Stable
* [Seccomp](https://github.com/kubernetes/enhancements/issues/135)
* [Kubelet client TLS certificate rotation](https://github.com/kubernetes/enhancements/issues/266)
* [Limit node access to API](https://github.com/kubernetes/enhancements/issues/279)
* [Redesign Event API](https://github.com/kubernetes/enhancements/issues/383)
* [Graduate Ingress to V1](https://github.com/kubernetes/enhancements/issues/1453)
* [CertificateSigningRequest API](https://github.com/kubernetes/enhancements/issues/1513)
* [Building Kubelet without Docker](https://github.com/kubernetes/enhancements/issues/1547)

### Major Changes
* [Node Topology Manager](https://github.com/kubernetes/enhancements/issues/693)
* [New Endpoint API](https://github.com/kubernetes/enhancements/issues/752)
* [Increase Kubernetes support window to one year](https://github.com/kubernetes/enhancements/issues/1498)

### Other Notable Features
* [Run multiple Scheduling Profiles](https://github.com/kubernetes/enhancements/issues/1451)
* [CertificateSigningRequest API](https://github.com/kubernetes/enhancements/issues/1513)
* [Immutable Secrets and ConfigMaps](https://github.com/kubernetes/enhancements/issues/1412)

## Release Notes
Check out the full details of the Kubernetes 1.19 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.19.md).

## Availability

Kubernetes 1.19 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.19.0). To get started with Kubernetes, check out these [interactive tutorials](https://kubernetes.io/docs/tutorials/) or run local Kubernetes clusters using Docker container “nodes” with [kind](https://kind.sigs.k8s.io/) (Kubernetes in Docker). You can also easily install 1.19 using [kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/).

## Release Team
This release is made possible through the efforts of hundreds of individuals who contributed both technical and non-technical content. Special thanks to the [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.19/release_team.md) led by Taylor Dolezal, Senior Developer Advocate at HashiCorp. The 34 release team members coordinated many aspects of the release, from documentation to testing, validation, and feature completeness.

As the Kubernetes community has grown, our release process represents an amazing demonstration of collaboration in open source software development. Kubernetes continues to gain new users at a rapid pace. This growth creates a positive feedback cycle where more contributors commit code creating a more vibrant ecosystem. Kubernetes has had over [49,000 individual contributors](https://k8s.devstats.cncf.io/d/24/overall-project-statistics?orgId=1) to date and an active community of more than 3,000 people.

## Release Logo
All of you inspired this Kubernetes 1.19 release logo! This release was a bit more of a marathon and a testament to when the world is a wild place, we can come together and do unbelievable things.

![Kubernetes 1.19 Release Logo](/images/blog/2020-08-26-kubernetes-1.19-release-announcement/accentuate.png)


"Accentuate the Paw-sitive" was chosen as the release theme because it captures the positive outlook that the release team had, despite the state of the world. The characters pictured in the 1.19 logo represent everyone's personalities on our release team, from emo to peppy, and beyond!

About the designer: Hannabeth Lagerlof is a Visual Designer based in Los Angeles, California, and she has an extensive background in Environments and Graphic Design. Hannabeth creates art and user experiences that inspire connection. You can find Hannabeth on Twitter as @emanate_design.

## The Long Run
The release was also different from the enhancements side of things. Traditionally, we have had 3-4 weeks between the call for enhancements and Enhancements Freeze, which ends the phase in which contributors can acknowledge whether a particular feature will be part of the cycle. This release cycle, being unique, we had five weeks for the same milestone. The extended duration gave the contributors more time to plan and decide about the graduation of their respective features.

The milestone until which contributors implement the features was extended from the usual five weeks to 7 weeks. Contributors were provided with 40% more time to work on their features, resulting in reduced fatigue and more to think through about the implementation. We also noticed a considerable reduction in last-minute hustles. There were also a lesser number of exception requests this cycle - 6 compared to 14 the previous release cycle.

## User Highlights
* The CNCF grants Zalando, Europe’s leading online platform for fashion and lifestyle, the [Top End User Award](https://www.cncf.io/announcement/2020/08/20/cloud-native-computing-foundation-grants-zalando-the-top-end-user-award/). Zalando leverages numerous CNCF projects and open sourced multiple of their own development.

## Ecosystem Updates
* The CNCF just concluded its very first Virtual KubeCon. All talks are [on-demand]( https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/) for anyone registered, it's not too late!
* The [Certified Kubernetes Security Specialist](https://www.cncf.io/blog/2020/07/15/certified-kubernetes-security-specialist-cks-coming-in-november/) (CKS) coming in November! CKS focuses on cluster & system hardening, minimizing microservice vulnerabilities and the security of the supply chain.
* CNCF published the second [State of Cloud Native Development](https://www.cncf.io/blog/2020/08/14/state-of-cloud-native-development/), showing the massively growing number of cloud native developer using container and serverless technology.
* [Kubernetes.dev](https://www.kubernetes.dev), a Kubernetes contributor focused website has been launched. It brings the  contributor documentation, resources and project event information into one central location.

## Project Velocity
The [Kubernetes DevStats dashboard](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1) illustrates the breakdown of contributions from major company contributors, as well as an impressive set of preconfigured reports on everything from individual contributors to pull request lifecycle times. If you want to gather numbers, facts and figures from Kubernetes and the CNCF community it is the best place to start.

During this release cycle from April till August, 382 different companies and over 2,464 individuals contributed to Kubernetes. [Check out DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All&from=1585692000000&to=1598392799000) to learn more about the overall velocity of the Kubernetes project and community.

## Upcoming release webinar
Join the members of the Kubernetes 1.19 release team on September 25th, 2020 to learn about the major features in this release including storage capacity tracking, structured logging, Ingress V1 GA, and many more. Register here: https://www.cncf.io/webinars/kubernetes-1-19/.

## Get Involved
The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our monthly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

* Find out more about contributing to Kubernetes at the new [Kubernetes Contributor website](https://www.kubernetes.dev/)
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
