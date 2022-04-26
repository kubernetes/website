---
layout: blog
title: "Kubernetes 1.24: <release name>"
date: 2022-05-03
slug: kubernetes-1-24-release-announcement
---

# Kubernetes 1.24

**Authors**: [Kubernetes 1.24 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.24/release-team.md): Mickey Boxell (Oracle), Kat Cosgrove (Pulumi), Debabrata Panigrahi, Parthvi Vala (Red Hat)

We are excited to announce the release of Kubernetes 1.24, the first release of 2022!

This release consists of 46 enhancements: fifteen enhancements have graduated to stable, fifteen enhancements are moving to beta, and thirteen enhancements are entering alpha. Also, two features have been deprecated, and the [dockershim has been removed](https://kubernetes.io/blog/2022/02/17/dockershim-faq/).     


## Major Themes

### Dockershim Removed from kubelet
After an initial deprecation in v1.20, the dockershim has been removed from the kubelet in favor of runtimes that comply with the Container Runtime Interface (CRI) designed for Kubernetes. From v1.24 and up, if you are currently relying on Docker Engine as your container runtime, you will need to either use one of the other supported runtimes (such as containerd or CRI-O) or use cri-dockerd. For more information about ensuring your cluster is ready for this removal, please see [this guide](/blog/2022/03/31/ready-for-dockershim-removal/). 

### Graduations to Stable
This release saw fifteen enhancements promoted to stable. 

* [CSI Volume Expansion](https://github.com/kubernetes/enhancements/issues/284)
* [PodOverhead](https://github.com/kubernetes/enhancements/issues/688)
* [Non-preempting Priority to GA](https://github.com/kubernetes/enhancements/issues/596)
* [Storage Capacity Tracking](https://github.com/kubernetes/enhancements/issues/1472)
* [Azure disk in-tree to CSI driver migration](https://github.com/kubernetes/enhancements/issues/1489)
* [OpenStack in-tree to CSI driver migration](https://github.com/kubernetes/enhancements/issues/1490)
* [Efficient Watch Resumption](https://github.com/kubernetes/enhancements/issues/1904)
* [Service Type=LoadBalancer class](https://github.com/kubernetes/enhancements/issues/1959)
* [Indexed Job Semantics in Jobs ABI](https://github.com/kubernetes/enhancements/issues/2232)
* [batch/v1: add suspend field to Jobs API](https://github.com/kubernetes/enhancements/issues/2232)
* [Pod affinity NamespaceSelector to GA](https://github.com/kubernetes/enhancements/issues/2249)
* [Leader Migration to GA](https://github.com/kubernetes/enhancements/issues/2436)
* [CSR Duration](https://github.com/kubernetes/enhancements/issues/2784)
* [Beta APIs are off by Default](https://github.com/kubernetes/enhancements/issues/3136)
* [Dockershim Removal](https://github.com/kubernetes/enhancements/issues/2221)



### gRPC Probes Graduates to Beta
With Kubernetes 1.24, the gRPC probes functionality has entered beta and is available by default.

You can now configure startup, liveness, and readiness probes for your gRPC app without exposing an HTTP endpoint or using an extra executable, natively within Kubernetes.

### Kubelet Credential Provider graduates to Beta
Released as Alpha in Kubernetes v1.20, the Kubelet Credential Provider has now graduated to Beta. This allows the kubelet to dynamically retrieve credentials for a container image registry using exec plugins, communicating through stdio using Kubernetes versioned APIs, rather than storing them statically on disk.

### Contextual Logging in Alpha
Kubernetes v1.24 has introduced Contextual logging that enables the caller of a function to control all aspects of logging (output formatting, verbosity, additional values and names).

### Avoiding collisions in IP allocation to Services
A Service `ClusterIP` can be assigned:

* dynamically, the cluster will automatically pick a free one within the configured Service IP range.
* statically, the user will set one IP within the configured Service IP range.

Service `ClusterIP` are unique, hence, trying to create a Service with a `ClusterIP` that has already been allocated will return an error.

Kubernetes 1.24 introduces a new Feature Gate `ServiceIPStaticSubrange` that allows to use a different IP allocation strategy for Services, reducing the risk of collision.


## Other Updates
### Graduated to Stable
* To do: Add all enhancements that graduated to stable

### Major Changes
* To do: Add information about Dockershim

### Release Notes
Check out the full details of the Kubernetes 1.24 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md).
    
### Availability

Kubernetes 1.24 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.24.0). To get started with Kubernetes, check out these [interactive tutorials](https://kubernetes.io/docs/tutorials/) or run local Kubernetes clusters using Docker container “nodes” with [kind](https://kind.sigs.k8s.io/). You can also easily install 1.24 using [kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/). 

### Release Team

This release was made possible by a very dedicated group of individuals, who came together as a team to deliver technical content, documentation, code, and a host of other components that go into every Kubernetes release.

A huge thank you to the release lead James Laverack for leading us through a successful release cycle, and to everyone else on the release team for supporting each other, and working so hard to deliver the 1.24 release for the community. 

### Release Theme and Logo 

**Kubernetes 1.24:**
    
    
### User Highlights
* As the Netherlands emerged from the first pandemic lockdown in Spring 2021, people needed a way of proving their COVID-19 test result status to enter events. Using Kubernetes, the Dutch organization [Stichting Open Nederland](http://www.stichtingopennederland.nl/) created a testing portal in just one-and-a-half months to help safely reopen events in the Netherlands. The [Testing for Entry (Testen voor Toegang)](https://www.testenvoortoegang.org/) platform leverged the performance and scalability of Kubernetes to help individuals book COVID-19 test appointments, enabling them to once again attend cultural, social, and sports events. 
* 

### Ecosystem Updates

* KubeCon + CloudNativeCon Europe 2022 will take place in Valencia, Spain, from 16 – 20 May 2022! You can find more information about the conference and registration on the [event site](https://events.linuxfoundation.org/archive/2021/kubecon-cloudnativecon-europe/).
* In the [2021 Cloud Native Survey](https://www.cncf.io/announcements/2022/02/10/cncf-sees-record-kubernetes-and-container-adoption-in-2021-cloud-native-survey/), the CNCF saw record Kubernetes and container adoption. Take a look at the [results of the survey](https://www.cncf.io/reports/cncf-annual-survey-2021/). 
* The [Linux Foundation](https://www.linuxfoundation.org/) and [The Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) announced the availability of a new [Cloud Native Developer Bootcamp](https://training.linuxfoundation.org/training/cloudnativedev-bootcamp/?utm_source=lftraining&utm_medium=pr&utm_campaign=clouddevbc0322) to provide participants with the knowledge and skills to design, build, and deploy cloud native applications. Check out the [announcement](https://www.cncf.io/announcements/2022/03/15/new-cloud-native-developer-bootcamp-provides-a-clear-path-to-cloud-native-careers/) to learn more.

### Project Velocity

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing, and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.24 release cycle, which [ran for 18 weeks](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.24) (January 10 to May 17), we saw contributions from [1029 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.23.0%20-%20now&var-metric=contributions) and [1179 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.23.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes).


## Upcoming Release Webinar
Join members of the Kubernetes 1.24 release team on <date> to learn about the major features of this release, as well as deprecations and removals to help plan for upgrades. For more information and registration, visit the [event page](#) on the CNCF Online Programs site.

## Get Involved
The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below:

* Find out more about contributing to Kubernetes at the [Kubernetes Contributors](https://www.kubernetes.dev/) website
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
