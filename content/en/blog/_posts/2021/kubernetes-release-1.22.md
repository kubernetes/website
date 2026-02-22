---
layout: blog
title: 'Kubernetes 1.22: Reaching New Peaks'
date: 2021-08-04
slug: kubernetes-1-22-release-announcement
evergreen: true
author: >
  [Kubernetes 1.22 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.22/release-team.md)
---

We’re pleased to announce the release of Kubernetes 1.22, the second release of 2021!

This release consists of 53 enhancements: 13 enhancements have graduated to stable, 24 enhancements are moving to beta, and 16 enhancements are entering alpha. Also, three features have been deprecated.

In April of this year, the Kubernetes release cadence was officially changed from four to three releases yearly. This is the first longer-cycle release related to that change. As the Kubernetes project matures, the number of enhancements per cycle grows. This means more work, from version to version, for the contributor community and Release Engineering team, and it can put pressure on the end-user community to stay up-to-date with releases containing increasingly more features.

Changing the release cadence from four to three releases yearly balances many aspects of the project, both in how contributions and releases are managed, and also in the community's ability to plan for upgrades and stay up to date.

You can read more in the official blog post [Kubernetes Release Cadence Change: Here’s What You Need To Know](https://kubernetes.io/blog/2021/07/20/new-kubernetes-release-cadence/).


## Major Themes

### Server-side Apply graduates to GA

[Server-side Apply](https://kubernetes.io/docs/reference/using-api/server-side-apply/) is a new field ownership and object merge algorithm running on the Kubernetes API server. Server-side Apply helps users and controllers manage their resources via declarative configurations. It allows them to create and/or modify their objects declaratively, simply by sending their fully specified intent. After being in beta for a couple releases, Server-side Apply is now generally available.

### External credential providers now stable

Support for Kubernetes client [credential plugins](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins) has been in beta since 1.11, and with the release of Kubernetes 1.22 now graduates to stable. The GA feature set includes improved support for plugins that provide interactive login flows, as well as a number of bug fixes. Aspiring plugin authors can look at [sample-exec-plugin](https://github.com/ankeesler/sample-exec-plugin) to get started.

### etcd moves to 3.5.0

Kubernetes' default backend storage, etcd, has a new release: 3.5.0. The new release comes with improvements to the security, performance, monitoring, and developer experience. There are numerous bug fixes and some critical new features like the migration to structured logging and built-in log rotation. The release comes with a detailed future roadmap to implement a solution to traffic overload. You can read a full and detailed list of changes in the [3.5.0 release announcement](https://etcd.io/blog/2021/announcing-etcd-3.5/).

### Quality of Service for memory resources

Originally, Kubernetes used the v1 cgroups API. With that design, the QoS class for a `Pod` only applied to CPU resources (such as `cpu_shares`). As an alpha feature, Kubernetes v1.22 can now use the cgroups v2 API to control memory allocation and isolation. This feature is designed to improve workload and node availability when there is contention for memory resources, and to improve the predictability of container lifecycle.

### Node system swap support

Every system administrator or Kubernetes user has been in the same boat regarding setting up and using Kubernetes: disable swap space. With the release of Kubernetes 1.22, alpha support is available to run nodes with swap memory. This change lets administrators opt in to configuring swap on Linux nodes, treating a portion of block storage as additional virtual memory.

### Windows enhancements and capabilities

Continuing to support the growing developer community, SIG Windows has released their [Development Environment](https://github.com/kubernetes-sigs/sig-windows-dev-tools/). These new tools support multiple CNI providers and can run on multiple platforms. There is also a new way to run bleeding-edge Windows features from scratch by compiling the Windows kubelet and kube-proxy, then using them along with daily builds of other Kubernetes components.

CSI support for Windows nodes moves to GA in the 1.22 release. In Kubernetes v1.22, Windows privileged containers are an alpha feature. To allow using CSI storage on Windows nodes, [CSIProxy](https://github.com/kubernetes-csi/csi-proxy) enables CSI node plugins to be deployed as unprivileged pods, using the proxy to perform privileged storage operations on the node.

### Default profiles for seccomp

An alpha feature for default seccomp profiles has been added to the kubelet, along with a new command line flag and configuration. When in use, this new feature provides cluster-wide seccomp defaults, using the `RuntimeDefault` seccomp profile rather than `Unconfined` by default. This enhances the default security of the Kubernetes Deployment. Security administrators will now sleep better knowing that workloads are more secure by default. To learn more about the feature, please refer to the official [seccomp tutorial](https://kubernetes.io/docs/tutorials/clusters/seccomp/#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads).

### More secure control plane with kubeadm

A new alpha feature allows running the `kubeadm` control plane components as non-root users. This is a long requested security measure in `kubeadm`. To try it you must enable the `kubeadm` specific RootlessControlPlane feature gate. When you deploy a cluster using this alpha feature, your control plane runs with lower privileges.

For `kubeadm`, Kubernetes 1.22 also brings a new [v1beta3 configuration API](/docs/reference/config-api/kubeadm-config.v1beta3/). This iteration adds some long requested features and deprecates some existing ones. The v1beta3 version is now the preferred API version; the v1beta2 API also remains available and is not yet deprecated.

## Major Changes

### Removal of several deprecated beta APIs

A number of deprecated beta APIs have been removed in 1.22 in favor of the GA version of those same APIs. All existing objects can be interacted with via stable APIs. This removal includes beta versions of the `Ingress`, `IngressClass`, `Lease`, `APIService`, `ValidatingWebhookConfiguration`, `MutatingWebhookConfiguration`, `CustomResourceDefinition`, `TokenReview`, `SubjectAccessReview`, and `CertificateSigningRequest` APIs.

For the full list, check out the [Deprecated API Migration Guide](https://kubernetes.io/docs/reference/using-api/deprecation-guide/#v1-22) as well as the blog post [Kubernetes API and Feature Removals In 1.22: Here’s What You Need To Know](https://blog.k8s.io/2021/07/14/upcoming-changes-in-kubernetes-1-22/). 

###  API changes and improvements for ephemeral containers

The API used to create [Ephemeral Containers](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/) changes in 1.22. The Ephemeral Containers feature is alpha and disabled by default, and the new API does not work with clients that attempt to use the old API.

For stable features, the kubectl tool follows the Kubernetes [version skew policy](https://kubernetes.io/releases/version-skew-policy/); however, kubectl v1.21 and older do not support the new API for ephemeral containers. If you plan to use `kubectl debug` to create ephemeral containers, and your cluster is running Kubernetes v1.22, you cannot do so with kubectl v1.21 or earlier. Please update kubectl to 1.22 if you wish to use `kubectl debug` with a mix of cluster versions.

## Other Updates

### Graduated to Stable

* [Bound Service Account Token Volumes](https://github.com/kubernetes/enhancements/issues/542)
* [CSI Service Account Token](https://github.com/kubernetes/enhancements/issues/2047)
* [Windows Support for CSI Plugins](https://github.com/kubernetes/enhancements/issues/1122)
* [Warning mechanism for deprecated API use](https://github.com/kubernetes/enhancements/issues/1693)
* [PodDisruptionBudget Eviction](https://github.com/kubernetes/enhancements/issues/85)

### Notable Feature Updates

* A new [PodSecurity admission](https://github.com/kubernetes/enhancements/issues/2579) alpha feature is introduced, intended as a replacement for PodSecurityPolicy
* [The Memory Manager](https://github.com/kubernetes/enhancements/issues/1769) moves to beta
* A new alpha feature to enable [API Server Tracing](https://github.com/kubernetes/enhancements/issues/647)
* A new v1beta3 version of the [kubeadm configuration](https://github.com/kubernetes/enhancements/issues/970) format
* [Generic data populators](https://github.com/kubernetes/enhancements/issues/1495) for PersistentVolumes are now available in alpha
* The Kubernetes control plane will now always use the [CronJobs v2 controller](https://github.com/kubernetes/enhancements/issues/19)
* As an alpha feature, all Kubernetes node components (including the kubelet, kube-proxy, and container runtime) can be [run as a non-root user](https://github.com/kubernetes/enhancements/issues/2033)

# Release notes

You can check out the full details of the 1.22 release in the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md).

# Availability of release

Kubernetes 1.22 is [available for download](https://kubernetes.io/releases/download/) and also [on the GitHub project](https://github.com/kubernetes/kubernetes/releases/tag/v1.22.0). 

There are some great resources out there for getting started with Kubernetes. You can check out some [interactive tutorials](https://kubernetes.io/docs/tutorials/) on the main Kubernetes site, or run a local cluster on your machine using Docker containers with [kind](https://kind.sigs.k8s.io). If you’d like to try building a cluster from scratch, check out the [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) tutorial by Kelsey Hightower.

# Release Team

This release was made possible by a very dedicated group of individuals, who came together as a team to deliver technical content, documentation, code, and a host of other components that go into every Kubernetes release.

A huge thank you to the release lead Savitha Raghunathan for leading us through a successful release cycle, and to everyone else on the release team for supporting each other, and working so hard to deliver the 1.22 release for the community.

We would also like to take this opportunity to remember Peeyush Gupta, a member of our team that we lost earlier this year. Peeyush was actively involved in SIG ContribEx and the Kubernetes Release Team, most recently serving as the 1.22 Communications lead. His contributions and efforts will continue to reflect in the community he helped build. A [CNCF memorial](https://github.com/cncf/memorials/blob/main/peeyush-gupta.md) page has been created where thoughts and memories can be shared by the community.

# Release Logo

![Kubernetes 1.22 Release Logo](/images/blog/2021-08-04-kubernetes-release-1.22/kubernetes-1.22.png)

Amidst the ongoing pandemic, natural disasters, and ever-present shadow of burnout, the 1.22 release of Kubernetes includes 53 enhancements. This makes it the largest release to date. This accomplishment was only made possible due to the hard-working and passionate Release Team members and the amazing contributors of the Kubernetes ecosystem. The release logo is our reminder to keep reaching for new milestones and setting new records. And it is dedicated to all the Release Team members, hikers, and stargazers!

The logo is designed by [Boris Zotkin](https://www.instagram.com/boris.z.man/). Boris is a Mac/Linux Administrator at the MathWorks. He enjoys simple things in life and loves spending time with his family. This tech-savvy individual is always up for a challenge and happy to help a friend!

# User Highlights

- In May, the CNCF welcomed 27 new organizations across the globe as members of the diverse cloud native ecosystem. These new [members](https://www.cncf.io/announcements/2021/05/05/27-new-members-join-the-cloud-native-computing-foundation/) will participate in CNCF events, including the upcoming [KubeCon + CloudNativeCon NA in Los Angeles](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/) from October 12 – 15, 2021.
- The CNCF granted Spotify the [Top End User Award](https://www.cncf.io/announcements/2021/05/05/cloud-native-computing-foundation-grants-spotify-the-top-end-user-award/) during [KubeCon + CloudNativeCon EU – Virtual 2021](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/).

# Project Velocity

The [CNCF K8s DevStats project](https://k8s.devstats.cncf.io/) aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing, and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.22 release cycle, which ran for 15 weeks (April 26 to August 4), we saw contributions from [1063 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.21.0%20-%20now&var-metric=contributions) and [2054 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.21.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All).

# Ecosystem Updates

- [KubeCon + CloudNativeCon Europe 2021](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/) was held in May, the third such event to be virtual. All talks are [now available on-demand](https://www.youtube.com/playlist?list=PLj6h78yzYM2MqBm19mRz9SYLsw4kfQBrC) for anyone that would like to catch up!
- [Spring Term LFX Program](https://www.cncf.io/blog/2021/07/13/spring-term-lfx-program-largest-graduating-class-with-28-successful-cncf-interns) had the largest graduating class with 28 successful CNCF interns!
- CNCF launched [livestreaming on Twitch](https://www.cncf.io/blog/2021/06/03/cloud-native-community-goes-live-with-10-shows-on-twitch/) at the beginning of the year targeting definitive interactive media experience for anyone wanting to learn, grow, and collaborate with others in the Cloud Native community from anywhere in the world.

# Event Updates

- [KubeCon + CloudNativeCon North America 2021](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/) will take place in Los Angeles, October 12 – 15, 2021! You can find more information about the conference and registration on the event site.
- [Kubernetes Community Days](https://community.cncf.io/kubernetes-community-days/about-kcd/) has upcoming events scheduled in Italy, the UK, and in Washington DC.

# Upcoming release webinar

Join members of the Kubernetes 1.22 release team on October 5, 2021 to learn about the major features of this release, as well as deprecations and removals to help plan for upgrades. For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-122-release/) on the CNCF Online Programs site.

# Get Involved

If you’re interested in contributing to the Kubernetes community, Special Interest Groups (SIGs) are a great starting point. Many of them may align with your interests! If there are things you’d like to share with the community, you can join the weekly community meeting, or use any of the following channels:

* Find out more about contributing to Kubernetes at the [Kubernetes Contributors](https://www.kubernetes.dev/) website.
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)


