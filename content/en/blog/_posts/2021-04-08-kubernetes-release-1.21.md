---
layout: blog
title: 'Kubernetes 1.21: Power to the Community'
date: 2021-04-08
slug: kubernetes-1-21-release-announcement
---

**Authors:** [Kubernetes 1.21 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.21/release-team.md)

We’re pleased to announce the release of Kubernetes 1.21, our first release of 2021! This release consists of 51 enhancements: 13 enhancements have graduated to stable, 16 enhancements are moving to beta, 20 enhancements are entering alpha, and 2 features have been deprecated.

This release cycle, we saw a major shift in ownership of processes around the release team. We moved from a synchronous mode of communication, where we periodically asked the community for inputs, to a mode where the community opts-in to contribute features and/or blogs to the release. These changes have resulted in an increase in collaboration and teamwork across the community. The result of all that is reflected in Kubernetes 1.21 having the most number of features in the recent times.

## Major Themes

### CronJobs Graduate to Stable!
[CronJobs](/docs/concepts/workloads/controllers/cron-jobs/) (previously ScheduledJobs) has been a beta feature since Kubernetes 1.8! With 1.21 we get to finally see this widely used API graduate to stable.

CronJobs are meant for performing regular scheduled actions such as backups, report generation, and so on. Each of those tasks should be configured to recur indefinitely (for example: once a day / week / month); you can define the point in time within that interval when the job should start.

### Immutable Secrets and ConfigMaps
[Immutable Secrets](/docs/concepts/configuration/secret/#secret-immutable) and [ConfigMaps](/docs/concepts/configuration/configmap/#configmap-immutable) add a new field to those resource types that will reject changes to those objects if set. Secrets and ConfigMaps by default are mutable which is beneficial for pods that are able to consume changes. Mutating Secrets and ConfigMaps can also cause problems if a bad configuration is pushed for pods that use them.

By marking Secrets and ConfigMaps as immutable you can be sure your application configuration won't change. If you want to make changes you'll need to create a new, uniquly named Secret or ConfigMap and deploy a new pod to consume that resource. Immutable resources also have scaling benefits because controllers do not need to poll the API server to watch for changes.

This feature has graduated to stable in Kubernetes 1.21.

### IPv4/IPv6 dual-stack support
IP addresses are a consumable resource that cluster operators and administrators need to make sure are not exhausted. In particular, public IPv4 addresses are now scarce. Having dual-stack support enables native IPv6 routing to pods and services, whilst still allowing your cluster to talk IPv4 where needed. Dual-stack cluster networking also improves a possible scaling limitation for workloads.

Dual-stack support in Kubernetes means that pods, services, and nodes can get IPv4 addresses and IPv6 addresses. In Kubernetes 1.21 [dual-stack networking](/docs/concepts/services-networking/dual-stack/) has graduated from alpha to beta, and is now enabled by default.

### Graceful Node Shutdown
[Graceful Node shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown) also graduated to beta with this release (and will now be available to a much larger group of users)! This is a hugely beneficial feature that allows the kubelet to be aware of node shutdown, and gracefully terminate pods that are scheduled to that node.

Currently, when a node shuts down, pods do not follow the expected termination lifecycle and are not shut down gracefully. This can introduce problems with a lot of different workloads. Going forward, the kubelet will be able to detect imminent system shutdown through systemd, then inform running pods so they can terminate as gracefully as possible.

### PersistentVolume Health Monitor
Persistent Volumes (PV) are commonly used in applications to get local, file-based storage. They can be used in many different ways and help users migrate applications without needing to re-write storage backends.

Kubernetes 1.21 has a new alpha feature which allows PVs to be monitored for health of the volume and marked accordingly if the volume becomes unhealthy. Workloads will be able to react to the health state to protect data from being written or read from a volume that is unhealthy.

### Reducing Kubernetes Build Maintenance
Previously Kubernetes has maintained multiple build systems. This has often been a source of friction and complexity for new and current contributors.

Over the last release cycle, a lot of work has been put in to simplify the build process, and standardize on the native Golang build tools. This should empower broader community maintenance, and lower the barrier to entry for new contributors.

## Major Changes

### PodSecurityPolicy Deprecation
In Kubernetes 1.21, PodSecurityPolicy is deprecated. As with all Kubernetes feature deprecations, PodSecurityPolicy will continue to be available and fully-functional for several more releases. PodSecurityPolicy, previously in the beta stage, is planned for removal in Kubernetes 1.25.

What's next? We're developing a new built-in mechanism to help limit Pod privileges, with a working title of “PSP Replacement Policy.” Our plan is for this new mechanism to cover the key PodSecurityPolicy use cases, with greatly improved ergonomics and maintainability. To learn more, read [PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future).

### TopologyKeys Deprecation
The Service field `topologyKeys` is now deprecated; all the component features that used this field were previously alpha, and are now also deprecated.
We've replaced `topologyKeys` with a way to implement topology-aware routing, called topology-aware hints.  Topology-aware hints are an alpha feature in Kubernetes 1.21. You can read more details about the replacement feature in [Topology Aware Hints](/docs/concepts/services-networking/service-topology/); the related [KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/2433-topology-aware-hints/README.md) explains the context for why we switched.

## Other Updates

### Graduated to Stable

* [EndpointSlice](https://github.com/kubernetes/enhancements/issues/752)
* [Add sysctl support](https://github.com/kubernetes/enhancements/issues/34)
* [PodDisruptionBudgets](https://github.com/kubernetes/enhancements/issues/85)

### Notable Feature Updates

* [External client-go credential providers](https://github.com/kubernetes/enhancements/issues/541) - beta in 1.21
* [Structured logging](https://github.com/kubernetes/enhancements/issues/1602) - graduating to beta in 1.22
* [TTL after finish cleanup for Jobs and Pods](https://github.com/kubernetes/enhancements/issues/592) - graduated to beta

# Release notes

You can check out the full details of the 1.21 release in the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md).

# Availability of release

Kubernetes 1.21 is available for [download on GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.21.0). There are some great resources out there for getting started with Kubernetes. You can check out some [interactive tutorials](https://kubernetes.io/docs/tutorials/) on the main Kubernetes site, or run a local cluster on your machine using Docker containers with [kind](https://kind.sigs.k8s.io). If you’d like to try building a cluster from scratch, check out the [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) tutorial by Kelsey Hightower.

# Release Team

This release was made possible by a very dedicated group of individuals, who came together as a team in the midst of a lot of things happening out in the world. A huge thank you to the release lead Nabarun Pal, and to everyone else on the release team for supporting each other, and working so hard to deliver the 1.21 release for the community.

# Release Logo

![Kubernetes 1.21 Release Logo](/images/blog/2021-04-08-kubernetes-release-1.21/globe_250px.png)

The Kubernetes 1.21 Release Logo portrays the global nature of the Release Team, with release team members residing in timezones from UTC+8 all the way to UTC-8. The diversity of the release team brought in a lot of challenges, but the team tackled them all by adopting more asynchronous communication practices. The heptagonal globe in the release logo signifies the sheer determination of the community to overcome the challenges as they come. It celebrates the amazing teamwork of the release team over the last 3 months to bring in a fun packed Kubernetes release!

The logo is designed by [Aravind Sekar](https://www.behance.net/noblebatman), an independent designer based out of India. Aravind helps open source communities like PyCon India in their design efforts.

# User Highlights

- CNCF welcomes 47 new organizations across the globe as members to advance Cloud Native technology further at the start of 2021! These [new members](https://www.cncf.io/announcements/2021/02/24/cloud-native-computing-foundation-welcomes-47-new-members-at-the-start-of-2021/) will join CNCF at the upcoming 2021 KubeCon + CloudNativeCon events, including [KubeCon + CloudNativeCom EU – Virtual](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/) from May 4 – 7, 2021, and [KubeCon + CloudNativeCon NA in Los Angeles](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/) from October 12 – 15, 2021.

# Project Velocity

The [CNCF K8s DevStats project](https://k8s.devstats.cncf.io/) aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing, and is a neat illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.21 release cycle, which ran for 12 weeks (January 11 to April 8), we saw contributions from [999 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.20.0%20-%20now&var-metric=contributions) and [1279 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.20.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All).

# Ecosystem Updates

- In the wake of rising racism & attacks on global Asian communities, read the statement from CNCF General Priyanka Sharma on the [CNCF blog](https://www.cncf.io/blog/2021/03/18/statement-from-cncf-general-manager-priyanka-sharma-on-the-unacceptable-attacks-against-aapi-and-asian-communities/) reinstating the community's commitment towards inclusive values & diversity-powered resilience.
- We now have a process in place for migration of the default branch from master → main. Learn more about the guidelines [here](k8s.dev/rename)
- CNCF and the Linux Foundation have announced the availability of their new training course, [LFS260 – Kubernetes Security Essentials](https://training.linuxfoundation.org/training/kubernetes-security-essentials-lfs260/). In addition to providing skills and knowledge on a broad range of best practices for securing container-based applications and Kubernetes platforms, the course is also a great way to prepare for the recently launched [Certified Kubernetes Security Specialist](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/) certification exam.

# Event Updates

- KubeCon + CloudNativeCon Europe 2021 will take place May 4 - 7, 2021! You can find more information about the conference [here](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/).
- [Kubernetes Community Days](https://kubernetescommunitydays.org/) are being relaunched! Q2 2021 will start with Africa and Bengaluru.

# Upcoming release webinar

Join the members of the Kubernetes 1.21 release team on May 13th, 2021 to learn about the major features in this release including IPv4/IPv6 dual-stack support, PersistentVolume Health Monitor, Immutable Secrets and ConfigMaps, and many more. Register here: [https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-121-release/](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-121-release/)

# Get Involved

If you’re interested in contributing to the Kubernetes community, Special Interest Groups (SIGs) are a great starting point. Many of them may align with your interests! If there are things you’d like to share with the community, you can join the weekly community meeting, or use any of the following channels:

* Find out more about contributing to Kubernetes at the [Kubernetes Contributor website](https://www.kubernetes.dev/)
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Share your Kubernetes [story](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
