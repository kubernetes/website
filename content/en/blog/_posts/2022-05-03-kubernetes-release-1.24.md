---
layout: blog
title: "Kubernetes 1.24: Stargazer"
date: 2022-05-03
slug: kubernetes-1-24-release-announcement
author: >
  [Kubernetes 1.24 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.24/release-team.md)
---

We are excited to announce the release of Kubernetes 1.24, the first release of 2022!

This release consists of 46 enhancements: fourteen enhancements have graduated to stable, 
fifteen enhancements are moving to beta, and thirteen enhancements are entering alpha. 
Also, two features have been deprecated, and two features have been removed.     

## Major Themes

### Dockershim Removed from kubelet

After its deprecation in v1.20, the dockershim component has been removed from the kubelet in Kubernetes v1.24.
From v1.24 onwards, you will need to either use one of the other [supported runtimes](/docs/setup/production-environment/container-runtimes/) (such as containerd or CRI-O) 
or use cri-dockerd if you are relying on Docker Engine as your container runtime. 
For more information about ensuring your cluster is ready for this removal, please 
see [this guide](/blog/2022/03/31/ready-for-dockershim-removal/). 

### Beta APIs Off by Default 

[New beta APIs will not be enabled in clusters by default](https://github.com/kubernetes/enhancements/issues/3136). 
Existing beta APIs and new versions of existing beta APIs will continue to be enabled by default.
  
### Signing Release Artifacts

Release artifacts are [signed](https://github.com/kubernetes/enhancements/issues/3031) using [cosign](https://github.com/sigstore/cosign) 
signatures,
and there is experimental support for [verifying image signatures](/docs/tasks/administer-cluster/verify-signed-artifacts/). 
Signing and verification of release artifacts is part of [increasing software supply chain security for the Kubernetes release process](https://github.com/kubernetes/enhancements/issues/3027). 

### OpenAPI v3

Kubernetes 1.24 offers beta support for publishing its APIs in the [OpenAPI v3 format](https://github.com/kubernetes/enhancements/issues/2896). 
  
### Storage Capacity and Volume Expansion Are Generally Available

[Storage capacity tracking](https://github.com/kubernetes/enhancements/issues/1472) 
supports exposing currently available storage capacity via [CSIStorageCapacity objects](/docs/concepts/storage/storage-capacity/#api) 
and enhances scheduling of pods that use CSI volumes with late binding.

[Volume expansion](https://github.com/kubernetes/enhancements/issues/284) adds support 
for resizing existing persistent volumes. 

### NonPreemptingPriority to Stable

This feature adds [a new option to PriorityClasses](https://github.com/kubernetes/enhancements/issues/902), 
which can enable or disable pod preemption. 

### Storage Plugin Migration

Work is underway to [migrate the internals of in-tree storage plugins](https://github.com/kubernetes/enhancements/issues/625) to call out to CSI Plugins
while maintaining the original API.
The [Azure Disk](https://github.com/kubernetes/enhancements/issues/1490)
and [OpenStack Cinder](https://github.com/kubernetes/enhancements/issues/1489) plugins
have both been migrated.

### gRPC Probes Graduate to Beta

With Kubernetes 1.24, the [gRPC probes functionality](https://github.com/kubernetes/enhancements/issues/2727) 
has entered beta and is available by default. You can now [configure startup, liveness, and readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes) for your gRPC app 
natively within Kubernetes without exposing an HTTP endpoint or
using an extra executable.

### Kubelet Credential Provider Graduates to Beta

Originally released as Alpha in Kubernetes 1.20, the kubelet's support for
[image credential providers](/docs/tasks/kubelet-credential-provider/kubelet-credential-provider/)
has now graduated to Beta.
This allows the kubelet to dynamically retrieve credentials for a container image registry
using exec plugins rather than storing credentials on the node's filesystem.

### Contextual Logging in Alpha

Kubernetes 1.24 has introduced [contextual logging](https://github.com/kubernetes/enhancements/issues/3077) 
that enables the caller of a function to control all aspects of logging (output formatting, verbosity, additional values, and names).

### Avoiding Collisions in IP allocation to Services

Kubernetes 1.24 introduces a new opt-in feature that allows you to
soft-reserve a range for static IP address assignments to Services.
With the manual enablement of this feature, the cluster will prefer automatic assignment from 
the pool of Service IP addresses, thereby reducing the risk of collision. 

A Service `ClusterIP` can be assigned:

* dynamically, which means the cluster will automatically pick a free IP within the configured Service IP range.
* statically, which means the user will set one IP within the configured Service IP range.

Service `ClusterIP` are unique; hence, trying to create a Service with a `ClusterIP` that has already been allocated will return an error.

### Dynamic Kubelet Configuration is Removed from the Kubelet

After being deprecated in Kubernetes 1.22, Dynamic Kubelet Configuration has been removed from the kubelet. The feature will be removed from the API server in Kubernetes 1.26.

## CNI Version-Related Breaking Change

Before you upgrade to Kubernetes 1.24, please verify that you are using/upgrading to a container 
runtime that has been tested to work correctly with this release.

For example, the following container runtimes are being prepared, or have already been prepared, for Kubernetes:

* containerd v1.6.4 and later, v1.5.11 and later
* CRI-O 1.24 and later

Service issues exist for pod CNI network setup and tear down in containerd
v1.6.0–v1.6.3 when the CNI plugins have not been upgraded and/or the CNI config
version is not declared in the CNI config files. The containerd team reports, "these issues are resolved in containerd v1.6.4."

With containerd v1.6.0–v1.6.3, if you do not upgrade the CNI plugins and/or
declare the CNI config version, you might encounter the following "Incompatible
CNI versions" or "Failed to destroy network for sandbox" error conditions.

## CSI Snapshot

_This information was added after initial publication._

[VolumeSnapshot v1beta1 CRD has been removed](https://github.com/kubernetes/enhancements/issues/177). 
Volume snapshot and restore functionality for Kubernetes and the Container Storage Interface (CSI), which provides standardized APIs design (CRDs) and adds PV snapshot/restore support for CSI volume drivers, moved to GA in v1.20. VolumeSnapshot v1beta1 was deprecated in v1.20 and is now unsupported. Refer to [KEP-177: CSI Snapshot](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/177-volume-snapshot#kep-177-csi-snapshot) and [Volume Snapshot GA blog](https://kubernetes.io/blog/2020/12/10/kubernetes-1.20-volume-snapshot-moves-to-ga/) for more information.

## Other Updates

### Graduations to Stable

This release saw fourteen enhancements promoted to stable: 

* [Container Storage Interface (CSI) Volume Expansion](https://github.com/kubernetes/enhancements/issues/284)
* [Pod Overhead](https://github.com/kubernetes/enhancements/issues/688): Account for resources tied to the pod sandbox but not specific containers.
* [Add non-preempting option to PriorityClasses](https://github.com/kubernetes/enhancements/issues/902)
* [Storage Capacity Tracking](https://github.com/kubernetes/enhancements/issues/1472) 
* [OpenStack Cinder In-Tree to CSI Driver Migration](https://github.com/kubernetes/enhancements/issues/1489)
* [Azure Disk In-Tree to CSI Driver Migration](https://github.com/kubernetes/enhancements/issues/1490)
* [Efficient Watch Resumption](https://github.com/kubernetes/enhancements/issues/1904): Watch can be efficiently resumed after kube-apiserver reboot. 
* [Service Type=LoadBalancer Class Field](https://github.com/kubernetes/enhancements/issues/1959): Introduce a new Service annotation `service.kubernetes.io/load-balancer-class` that allows multiple implementations of `type: LoadBalancer` Services in the same cluster.
* [Indexed Job](https://github.com/kubernetes/enhancements/issues/2214): Add a completion index to Pods of Jobs with a fixed completion count.
* [Add Suspend Field to Jobs API](https://github.com/kubernetes/enhancements/issues/2232): Add a suspend field to the Jobs API to allow orchestrators to create jobs with more control over when pods are created.
* [Pod Affinity NamespaceSelector](https://github.com/kubernetes/enhancements/issues/2249): Add a `namespaceSelector` field for to pod affinity/anti-affinity spec.
* [Leader Migration for Controller Managers](https://github.com/kubernetes/enhancements/issues/2436): kube-controller-manager and cloud-controller-manager can apply new controller-to-controller-manager assignment in HA control plane without downtime.
* [CSR Duration](https://github.com/kubernetes/enhancements/issues/2784): Extend the CertificateSigningRequest API with a mechanism to allow clients to request a specific duration for the issued certificate.

### Major Changes

This release saw two major changes: 

* [Dockershim Removal](https://github.com/kubernetes/enhancements/issues/2221)
* [Beta APIs are off by Default](https://github.com/kubernetes/enhancements/issues/3136)

### Release Notes

Check out the full details of the Kubernetes 1.24 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md).
    
### Availability

Kubernetes 1.24 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.24.0).
To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local 
Kubernetes clusters using containers as “nodes”, with [kind](https://kind.sigs.k8s.io/).
You can also easily install 1.24 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/).

### Release Team

This release would not have been possible without the combined efforts of committed individuals 
comprising the Kubernetes 1.24 release team. This team came together to deliver all of the components 
that go into each Kubernetes release, including code, documentation, release notes, and more. 

Special thanks to James Laverack, our release lead, for guiding us through a successful release cycle, 
and to all of the release team members for the time and effort they put in to deliver the v1.24 
release for the Kubernetes community. 

### Release Theme and Logo 

**Kubernetes 1.24: Stargazer**

{{< figure src="/images/blog/2022-05-03-kubernetes-release-1.24/kubernetes-1.24.png" alt="" class="release-logo" >}}

The theme for Kubernetes 1.24 is _Stargazer_.

Generations of people have looked to the stars in awe and wonder, from ancient astronomers to the 
scientists who built the James Webb Space Telescope. The stars have inspired us, set our imagination 
alight, and guided us through long nights on difficult seas.

With this release we gaze upwards, to what is possible when our community comes together. Kubernetes 
is the work of hundreds of contributors across the globe and thousands of end-users supporting 
applications that serve millions. Every one is a star in our sky, helping us chart our course.

The release logo is made by [Britnee Laverack](https://www.instagram.com/artsyfie/), and depicts a telescope set upon starry skies and the 
[Pleiades](https://en.wikipedia.org/wiki/Pleiades), often known in mythology as the “Seven Sisters”. The number seven is especially auspicious 
for the Kubernetes project, and is a reference back to our original “Project Seven” name.

This release of Kubernetes is named for those that would look towards the night sky and wonder — for 
all the stargazers out there. ✨
   
### User Highlights

* Check out how leading retail e-commerce company [La Redoute used Kubernetes, alongside other CNCF projects, to transform and streamline its software delivery lifecycle](https://www.cncf.io/case-studies/la-redoute/) - from development to operations. 
* Trying to ensure no change to an API call would cause any breaks, [Salt Security built its microservices entirely on Kubernetes, and it communicates via gRPC while Linkerd ensures messages are encrypted](https://www.cncf.io/case-studies/salt-security/).
* In their effort to migrate from private to public cloud, [Allainz Direct engineers redesigned its CI/CD pipeline in just three months while managing to condense 200 workflows down to 10-15](https://www.cncf.io/case-studies/allianz/).
* Check out how [Bink, a UK based fintech company, updated its in-house Kubernetes distribution with Linkerd to build a cloud-agnostic platform that scales as needed whilst allowing them to keep a close eye on performance and stability](https://www.cncf.io/case-studies/bink/).
* Using Kubernetes, the Dutch organization [Stichting Open Nederland](http://www.stichtingopennederland.nl/) created a testing portal in just one-and-a-half months to help safely reopen events in the Netherlands. The [Testing for Entry (Testen voor Toegang)](https://www.testenvoortoegang.org/) platform [leveraged the performance and scalability of Kubernetes to help individuals book over 400,000 COVID-19 testing appointments per day. ](https://www.cncf.io/case-studies/true/)
* Working alongside SparkFabrik and utilizing Backstage, [Santagostino created the developer platform Samaritan to centralize services and documentation, manage the entire lifecycle of services, and simplify the work of Santagostino developers](https://www.cncf.io/case-studies/santagostino/).

### Ecosystem Updates

* KubeCon + CloudNativeCon Europe 2022 will take place in Valencia, Spain, from 16 – 20 May 2022! You can find more information about the conference and registration on the [event site](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/).
* In the [2021 Cloud Native Survey](https://www.cncf.io/announcements/2022/02/10/cncf-sees-record-kubernetes-and-container-adoption-in-2021-cloud-native-survey/), the CNCF saw record Kubernetes and container adoption. Take a look at the [results of the survey](https://www.cncf.io/reports/cncf-annual-survey-2021/). 
* The [Linux Foundation](https://www.linuxfoundation.org/) and [The Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) announced the availability of a new [Cloud Native Developer Bootcamp](https://training.linuxfoundation.org/training/cloudnativedev-bootcamp/?utm_source=lftraining&utm_medium=pr&utm_campaign=clouddevbc0322) to provide participants with the knowledge and skills to design, build, and deploy cloud native applications. Check out the [announcement](https://www.cncf.io/announcements/2022/03/15/new-cloud-native-developer-bootcamp-provides-a-clear-path-to-cloud-native-careers/) to learn more.

### Project Velocity

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) project 
aggregates a number of interesting data points related to the velocity of Kubernetes and various 
sub-projects. This includes everything from individual contributions to the number of companies that 
are contributing, and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.24 release cycle, which [ran for 17 weeks](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.24) (January 10 to May 3), we saw contributions from [1029 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.23.0%20-%20v1.24.0&var-metric=contributions) and [1179 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.23.0%20-%20v1.24.0&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes).

## Upcoming Release Webinar

Join members of the Kubernetes 1.24 release team on Tue May 24, 2022 9:45am – 11am PT to learn about 
the major features of this release, as well as deprecations and removals to help plan for upgrades. 
For more information and registration, visit the [event page](https://community.cncf.io/e/mck3kd/) 
on the CNCF Online Programs site.

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
