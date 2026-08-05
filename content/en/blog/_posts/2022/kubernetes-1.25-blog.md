---
layout: blog
title: "Kubernetes v1.25: Combiner"
date: 2022-08-23
slug: kubernetes-v1-25-release
author: >
  [Kubernetes 1.25 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.25/release-team.md)
---

Announcing the release of Kubernetes v1.25!

This release includes a total of 40 enhancements. Fifteen of those enhancements are entering Alpha, ten are graduating to Beta, and thirteen are graduating to Stable. We also have two features being deprecated or removed.

## Release theme and logo

**Kubernetes 1.25: Combiner**

{{< figure src="/images/blog/2022-08-23-kubernetes-1.25-release/kubernetes-1.25.png" alt="Combiner logo" class="release-logo" >}}

The theme for Kubernetes v1.25 is _Combiner_.

The Kubernetes project itself is made up of many, many individual components that, when combined, take the form of the project you see today. It is also built and maintained by many individuals, all of them with different skills, experiences, histories, and interests, who join forces not just as the release team but as the many SIGs that support the project and the community year-round.

With this release, we wish to honor the collaborative, open spirit that takes us from isolated developers, writers, and users spread around the globe to a combined force capable of changing the world. Kubernetes v1.25 includes a staggering 40 enhancements, none of which would exist without the incredible power we have when we work together.

Inspired by our release lead's son, Albert Song, Kubernetes v1.25 is named for each and every one of you, no matter how you choose to contribute your unique power to the combined force that becomes Kubernetes.

## What's New (Major Themes)

### PodSecurityPolicy is removed; Pod Security Admission graduates to Stable {#pod-security-changes}

PodSecurityPolicy was initially [deprecated in v1.21](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/), and with the release of v1.25, it has been removed. The updates required to improve its usability would have introduced breaking changes, so it became necessary to remove it in favor of a more friendly replacement. That replacement is [Pod Security Admission](/docs/concepts/security/pod-security-admission/), which graduates to Stable with this release. If you are currently relying on PodSecurityPolicy, please follow the instructions for [migration to Pod Security Admission](/docs/tasks/configure-pod-container/migrate-from-psp/).

### Ephemeral Containers Graduate to Stable

[Ephemeral Containers](/docs/concepts/workloads/pods/ephemeral-containers/) are containers that exist for only a limited time within an existing pod. This is particularly useful for troubleshooting when you need to examine another container but cannot use `kubectl exec` because that container has crashed or its image lacks debugging utilities. Ephemeral containers graduated to Beta in Kubernetes v1.23, and with this release, the feature graduates to Stable.

### Support for cgroups v2 Graduates to Stable

It has been more than two years since the Linux kernel cgroups v2 API was declared stable. With some distributions now defaulting to this API, Kubernetes must support it to continue operating on those distributions. cgroups v2 offers several improvements over cgroups v1, for more information see the [cgroups v2](/docs/concepts/architecture/cgroups/) documentation. While cgroups v1 will continue to be supported, this enhancement puts us in a position to be ready for its eventual deprecation and replacement.


### Improved Windows support

- [Performance dashboards](http://perf-dash.k8s.io/#/?jobname=soak-tests-capz-windows-2019) added support for Windows
- [Unit tests](https://github.com/kubernetes/kubernetes/issues/51540) added support for Windows
- [Conformance tests](https://github.com/kubernetes/kubernetes/pull/108592) added support for Windows
- New GitHub repository created for [Windows Operational Readiness](https://github.com/kubernetes-sigs/windows-operational-readiness)

### Moved container registry service from k8s.gcr.io to registry.k8s.io

[Moving container registry from k8s.gcr.io to registry.k8s.io](https://github.com/kubernetes/kubernetes/pull/109938) got merged. For more details, see the [wiki page](https://github.com/kubernetes/k8s.io/wiki/New-Registry-url-for-Kubernetes-\(registry.k8s.io\)), [announcement](https://groups.google.com/a/kubernetes.io/g/dev/c/DYZYNQ_A6_c/m/oD9_Q8Q9AAAJ) was sent to the kubernetes development mailing list.

### Promoted SeccompDefault to Beta

SeccompDefault promoted to beta, see the tutorial [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads) for more details.

### Promoted endPort in Network Policy to Stable

Promoted `endPort` in [Network Policy](/docs/concepts/services-networking/network-policies/#targeting-a-range-of-ports) to GA. Network Policy providers that support `endPort` field now can use it to specify a range of ports to apply a Network Policy. Previously, each Network Policy could only target a single port.

Please be aware that `endPort` field **must be supported** by the Network Policy provider. If your provider does not support `endPort`, and this field is specified in a Network Policy, the Network Policy will be created covering only the port field (single port).

### Promoted Local Ephemeral Storage Capacity Isolation to Stable
The [Local Ephemeral Storage Capacity Isolation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/361-local-ephemeral-storage-isolation) feature moved to GA. This was introduced as alpha in 1.8, moved to beta in 1.10, and it is now a stable feature. It provides support for capacity isolation of local ephemeral storage between pods, such as `EmptyDir`, so that a pod can be hard limited in its consumption of shared resources by evicting Pods if its consumption of local ephemeral storage exceeds that limit.

### Promoted core CSI Migration to Stable

[CSI Migration](https://kubernetes.io/blog/2021/12/10/storage-in-tree-to-csi-migration-status-update/#quick-recap-what-is-csi-migration-and-why-migrate) is an ongoing effort that SIG Storage has been working on for a few releases. The goal is to move in-tree volume plugins to out-of-tree CSI drivers and eventually remove the in-tree volume plugins. The [core CSI Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration) feature moved to GA. CSI Migration for GCE PD and AWS EBS also moved to GA. CSI Migration for vSphere remains in beta (but is on by default). CSI Migration for Portworx moved to Beta (but is off-by-default).


### Promoted CSI Ephemeral Volume to Stable

The [CSI Ephemeral Volume](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/596-csi-inline-volumes) feature allows CSI volumes to be specified directly in the pod specification for ephemeral use cases. They can be used to inject arbitrary states, such as configuration, secrets, identity, variables or similar information, directly inside pods using a mounted volume. This was initially introduced in 1.15 as an alpha feature, and it moved to GA. This feature is used by some CSI drivers such as the [secret-store CSI driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver).

### Promoted CRD Validation Expression Language to Beta

[CRD Validation Expression Language](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/2876-crd-validation-expression-language/README.md) is promoted to beta, which makes it possible to declare how custom resources are validated using the [Common Expression Language (CEL)](https://github.com/google/cel-spec). Please see the [validation rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules) guide.

### Promoted Server Side Unknown Field Validation to Beta

Promoted the `ServerSideFieldValidation` feature gate to beta (on by default). This allows optionally triggering schema validation on the API server that errors when unknown fields are detected. This allows the removal of client-side validation from kubectl while maintaining the same core functionality of erroring out on requests that contain unknown or invalid fields.

###  Introduced KMS v2 API

Introduce KMS v2alpha1 API to add performance, rotation, and observability improvements. Encrypt data at rest (ie Kubernetes `Secrets`) with DEK using AES-GCM instead of AES-CBC for kms data encryption. No user action is required. Reads with AES-GCM and AES-CBC will continue to be allowed. See the guide [Using a KMS provider for data encryption](/docs/tasks/administer-cluster/kms-provider/) for more information.

### Kube-proxy images are now based on distroless images

In previous releases, kube-proxy container images were built using Debian as the base image. Starting with this release, the images are now built using [distroless](https://github.com/GoogleContainerTools/distroless). This change reduced image size by almost 50% and decreased the number of installed packages and files to only those strictly required for kube-proxy to do its job.

## Other Updates

### Graduations to Stable

This release includes a total of thirteen enhancements promoted to stable:

* [Ephemeral Containers](https://github.com/kubernetes/enhancements/issues/277)
* [Local Ephemeral Storage Resource Management](https://github.com/kubernetes/enhancements/issues/361)
* [CSI Ephemeral Volumes](https://github.com/kubernetes/enhancements/issues/596)
* [CSI Migration - Core](https://github.com/kubernetes/enhancements/issues/625)
* [Graduate the kube-scheduler ComponentConfig to GA](https://github.com/kubernetes/enhancements/issues/785)
* [CSI Migration - AWS](https://github.com/kubernetes/enhancements/issues/1487)
* [CSI Migration - GCE](https://github.com/kubernetes/enhancements/issues/1488)
* [DaemonSets Support MaxSurge](https://github.com/kubernetes/enhancements/issues/1591)
* [NetworkPolicy Port Range](https://github.com/kubernetes/enhancements/issues/2079)
* [cgroups v2](https://github.com/kubernetes/enhancements/issues/2254)
* [Pod Security Admission](https://github.com/kubernetes/enhancements/issues/2579)
* [Add `minReadySeconds` to Statefulsets](https://github.com/kubernetes/enhancements/issues/2599)
* [Identify Windows pods at API admission level authoritatively](https://github.com/kubernetes/enhancements/issues/2802)

### Deprecations and Removals

Two features were [deprecated or removed](/blog/2022/08/04/upcoming-changes-in-kubernetes-1-25/) from Kubernetes with this release.

* [PodSecurityPolicy is removed](https://github.com/kubernetes/enhancements/issues/5)
* [GlusterFS plugin deprecated from available in-tree drivers](https://github.com/kubernetes/enhancements/issues/3446)

### Release Notes

The complete details of the Kubernetes v1.25 release are available in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md).

### Availability

Kubernetes v1.25 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.25.0).
To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local
Kubernetes clusters using containers as “nodes”, with [kind](https://kind.sigs.k8s.io/).
You can also easily install 1.25 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/).

### Release Team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is made up of dedicated community volunteers who work together to build the many pieces that, when combined, make up the Kubernetes releases you rely on. This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire release team for the hours spent hard at work to ensure we deliver a solid Kubernetes v1.25 release for our community. Every one of you had a part to play in building this, and you all executed beautifully. We would like to extend special thanks to our fearless release lead, Cici Huang, for all she did to guarantee we had what we needed to succeed.

### User Highlights

* Finleap Connect operates in a highly regulated environment. [In 2019, they had five months to implement mutual TLS (mTLS) across all services in their clusters for their business code to comply with the new European PSD2 payment directive](https://www.cncf.io/case-studies/finleap-connect/).
* PNC sought to develop a way to ensure new code would meet security standards and audit compliance requirements automatically—replacing the cumbersome 30-day manual process they had in place. Using Knative, [PNC developed internal tools to automatically check new code and changes to existing code](https://www.cncf.io/case-studies/pnc-bank/).
* Nexxiot needed highly-reliable, secure, performant, and cost efficient Kubernetes clusters. [They turned to Cilium as the CNI to lock down their clusters and enable resilient networking with reliable day two operations](https://www.cncf.io/case-studies/nexxiot/).
* Because the process of creating cyber insurance policies is a complicated multi-step process, At-Bay sought to improve operations by using asynchronous message-based communication patterns/facilities. [They determined that Dapr fulfilled its desired list of requirements and much more](https://www.cncf.io/case-studies/at-bay/).

### Ecosystem Updates

* KubeCon + CloudNativeCon North America 2022 will take place in Detroit, Michigan from 24 – 28 October 2022! You can find more information about the conference and registration on the [event site](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/).
* KubeDay event series kicks off with KubeDay Japan on December 7! Register or submit a proposal on the [event site](https://events.linuxfoundation.org/kubeday-japan/)
* In the [2021 Cloud Native Survey](https://www.cncf.io/announcements/2022/02/10/cncf-sees-record-kubernetes-and-container-adoption-in-2021-cloud-native-survey/), the CNCF saw record Kubernetes and container adoption. Take a look at the [results of the survey](https://www.cncf.io/reports/cncf-annual-survey-2021/).

### Project Velocity

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) project
aggregates a number of interesting data points related to the velocity of Kubernetes and various
sub-projects. This includes everything from individual contributions to the number of companies that
are contributing, and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.25 release cycle, which [ran for 14 weeks](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.25) (May 23 to August 23), we saw contributions from [1065 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.24.0%20-%20v1.25.0&var-metric=contributions) and [1620 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.24.0%20-%20v1.25.0&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes).

## Upcoming Release Webinar

Join members of the Kubernetes v1.25 release team on Thursday September 22, 2022 10am – 11am PT to learn about
the major features of this release, as well as deprecations and removals to help plan for upgrades.
For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-v125-release/).

## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests.
Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below:

* Find out more about contributing to Kubernetes at the [Kubernetes Contributors](https://www.kubernetes.dev/) website
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes).
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
