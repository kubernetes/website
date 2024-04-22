---
layout: blog
title: "Kubernetes v1.26: Electrifying"
date: 2022-12-09
slug: kubernetes-v1-26-release
author: >
  [Kubernetes 1.26 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.26/release-team.md)
---

It's with immense joy that we announce the release of Kubernetes v1.26!

This release includes a total of 37 enhancements: eleven of them are graduating to Stable, ten are
graduating to Beta, and sixteen of them are entering Alpha. We also have twelve features being
deprecated or removed, three of which we better detail in this announcement.

## Release theme and logo 

**Kubernetes 1.26: Electrifying**

{{< figure src="/images/blog/2022-12-08-kubernetes-1.26-release/kubernetes-1.26.png" alt="Kubernetes 1.26 Electrifying logo" class="release-logo" >}}

The theme for Kubernetes v1.26 is _Electrifying_.

Each Kubernetes release is the result of the coordinated effort of dedicated volunteers, and only
made possible due to the use of a diverse and complex set of computing resources, spread out through
multiple datacenters and regions worldwide. The end result of a release - the binaries, the image
containers, the documentation - are then deployed on a growing number of personal, on-premises, and
cloud computing resources.

In this release we want to recognise the importance of all these building blocks on which Kubernetes
is developed and used, while at the same time raising awareness on the importance of taking the
energy consumption footprint into account: environmental sustainability is an inescapable concern of
creators and users of any software solution, and the environmental footprint of software, like
Kubernetes, an area which we believe will play a significant role in future releases.

As a community, we always work to make each new release process better than before (in this release,
we have [started to use Projects for tracking
enhancements](https://github.com/orgs/kubernetes/projects/98/views/1), for example). If [v1.24
"Stargazer"](/blog/2022/05/03/kubernetes-1-24-release-announcement/) _had us looking upwards, to
what is possible when our community comes together_, and [v1.25
"Combiner"](/blog/2022/08/23/kubernetes-v1-25-release/) _what the combined efforts of our community
are capable of_, this v1.26 "Electrifying" is also dedicated to all of those whose individual
motion, integrated into the release flow, made all of this possible.

## Major themes
    
Kubernetes v1.26 is composed of many changes, brought to you by a worldwide team of volunteers. For
this release, we have identified several major themes.

### Change in container image registry

In the previous release, [Kubernetes changed the container
registry](https://github.com/kubernetes/kubernetes/pull/109938), allowing the spread of the load
across multiple Cloud Providers and Regions, a change that reduced the reliance on a single entity
and provided a faster download experience for a large number of users.

This release of Kubernetes is the first that is exclusively published in the new `registry.k8s.io`
container image registry. In the (now legacy) `k8s.gcr.io` image registry, no container images tags
for v1.26 will be published, and only tags from releases before v1.26 will continue to be
updated. Refer to [registry.k8s.io: faster, cheaper and Generally
Available](/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/) for more information on the
motivation, advantages, and implications of this significant change.

### CRI v1alpha2 removed

With the adoption of the [Container Runtime Interface](/docs/concepts/architecture/cri/) (CRI) and
the [removal of dockershim](/blog/2022/02/17/dockershim-faq/) in v1.24, the CRI is the only
supported and documented way through which Kubernetes interacts with different container
runtimes. Each kubelet negotiates which version of CRI to use with the container runtime on that
node.

In the previous release, the Kubernetes project recommended using CRI version `v1`, but kubelet
could still negotiate the use of CRI `v1alpha2`, which was deprecated.

Kubernetes v1.26 drops support for CRI `v1alpha2`.  That
[removal](https://github.com/kubernetes/kubernetes/pull/110618) will result in the kubelet not
registering the node if the container runtime doesn't support CRI `v1`. This means that containerd
minor version 1.5 and older are not supported in Kubernetes 1.26; if you use containerd, you will
need to upgrade to containerd version 1.6.0 or later **before** you upgrade that node to Kubernetes
v1.26. This applies equally to any other container runtimes that only support the `v1alpha2`: if
that affects you, you should contact the container runtime vendor for advice or check their website
for additional instructions in how to move forward.

### Storage improvements

Following the GA of the [core Container Storage Interface (CSI)
Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration)
feature in the previous release, CSI migration is an on-going effort that we've been working on for
a few releases now, and this release continues to add (and remove) features aligned with the
migration's goals, as well as other improvements to Kubernetes storage.

#### CSI migration for Azure File and vSphere graduated to stable

Both the [vSphere](https://github.com/kubernetes/enhancements/issues/1491) and
[Azure](https://github.com/kubernetes/enhancements/issues/1885) in-tree driver migration to CSI have
graduated to Stable. You can find more information about them in the [vSphere CSI
driver](https://github.com/kubernetes-sigs/vsphere-csi-driver) and [Azure File CSI
driver](https://github.com/kubernetes-sigs/azurefile-csi-driver) repositories.

#### _Delegate FSGroup to CSI Driver_ graduated to stable

This feature allows Kubernetes to [supply the pod's `fsGroup` to the CSI driver when a volume is
mounted](https://github.com/kubernetes/enhancements/issues/2317) so that the driver can utilize
mount options to control volume permissions.  Previously, the kubelet would always apply the
`fsGroup`ownership and permission change to files in the volume according to the policy specified in
the Pod's `.spec.securityContext.fsGroupChangePolicy` field.  Starting with this release, CSI
drivers have the option to apply the `fsGroup` settings during attach or mount time of the volumes.

#### In-tree GlusterFS driver removal

Already deprecated in the v1.25 release, the in-tree GlusterFS driver was
[removed](https://github.com/kubernetes/enhancements/issues/3446) in this release.

#### In-tree OpenStack Cinder driver removal

This release removed the deprecated in-tree storage integration for OpenStack (the `cinder` volume
type). You should migrate to external cloud provider and CSI driver from
https://github.com/kubernetes/cloud-provider-openstack instead. For more information, visit [Cinder
in-tree to CSI driver migration](https://github.com/kubernetes/enhancements/issues/1489).

### Signing Kubernetes release artifacts graduates to beta

Introduced in Kubernetes v1.24, [this
feature](https://github.com/kubernetes/enhancements/issues/3031) constitutes a significant milestone
in improving the security of the Kubernetes release process. All release artifacts are signed
keyless using [cosign](https://github.com/sigstore/cosign/), and both binary artifacts and images
[can be verified](/docs/tasks/administer-cluster/verify-signed-artifacts/).

### Support for Windows privileged containers graduates to stable

Privileged container support allows containers to run with similar access to the host as processes
that run on the host directly. Support for this feature in Windows nodes, called [HostProcess
containers](/docs/tasks/configure-pod-container/create-hostprocess-pod/), will now [graduate to Stable](https://github.com/kubernetes/enhancements/issues/1981),
enabling access to host resources (including network resources) from privileged containers.

### Improvements to Kubernetes metrics

This release has several noteworthy improvements on metrics.

#### Metrics framework extension graduates to alpha

The metrics framework extension [graduates to
Alpha](https://github.com/kubernetes/enhancements/issues/3498), and
[documentation is now published for every metric in the
Kubernetes codebase](/docs/reference/instrumentation/metrics/).This enhancement adds two additional metadata
fields to Kubernetes metrics: `Internal` and `Beta`, representing different stages of metric maturity.

#### Component Health Service Level Indicators graduates to alpha

Also improving on the ability to consume Kubernetes metrics, [component health Service Level
Indicators (SLIs)](/docs/reference/instrumentation/slis/) have [graduated to
Alpha](https://github.com/kubernetes/kubernetes/pull/112884): by enabling the `ComponentSLIs`
feature flag there will be an additional metrics endpoint which allows the calculation of Service
Level Objectives (SLOs) from raw healthcheck data converted into metric format.

#### Feature metrics are now available

Feature metrics are now available for each Kubernetes component, making it possible to [track
whether each active feature gate is enabled](https://github.com/kubernetes/kubernetes/pull/112690)
by checking the component's metric endpoint for `kubernetes_feature_enabled`.

### Dynamic Resource Allocation graduates to alpha

[Dynamic Resource
Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
is a [new feature](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md) 
that puts resource scheduling in the hands of third-party developers: it offers an
alternative to the limited "countable" interface for requesting access to resources
(e.g. `nvidia.com/gpu: 2`), providing an API more akin to that of persistent volumes. Under the
hood, it uses the [Container Device
Interface](https://github.com/container-orchestrated-devices/container-device-interface) (CDI) to do
its device injection. This feature is blocked by the `DynamicResourceAllocation` feature gate.

### CEL in Admission Control graduates to alpha

[This feature](https://github.com/kubernetes/enhancements/issues/3488) introduces a `v1alpha1` API for [validating admission
policies](/docs/reference/access-authn-authz/validating-admission-policy/), enabling extensible admission
control via [Common Expression Language](https://github.com/google/cel-spec) expressions. Currently,
custom policies are enforced via [admission
webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/),
which, while flexible, have a few drawbacks when compared to in-process policy enforcement. To use,
enable the `ValidatingAdmissionPolicy` feature gate and the `admissionregistration.k8s.io/v1alpha1`
API via `--runtime-config`.

### Pod scheduling improvements

Kubernetes v1.26 introduces some relevant enhancements to the ability to better control scheduling
behavior.

#### `PodSchedulingReadiness` graduates to alpha

[This feature](https://github.com/kubernetes/enhancements/issues/3521) introduces a `.spec.schedulingGates` 
field to Pod's API, to [indicate whether the Pod is allowed to be scheduled or not](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/). External users/controllers can use this field to hold a Pod from scheduling based on their policies and
needs.

#### `NodeInclusionPolicyInPodTopologySpread` graduates to beta

By specifying a `nodeInclusionPolicy` in `topologySpreadConstraints`, you can control whether to
[take taints/tolerations into consideration](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
when calculating Pod Topology Spread skew.

## Other Updates

### Graduations to stable

This release includes a total of eleven enhancements promoted to Stable: 

* [Support for Windows privileged containers](https://github.com/kubernetes/enhancements/issues/1981)
* [vSphere in-tree to CSI driver migration](https://github.com/kubernetes/enhancements/issues/1491)
* [Allow Kubernetes to supply pod's fsgroup to CSI driver on mount](https://github.com/kubernetes/enhancements/issues/2317)
* [Azure file in-tree to CSI driver migration](https://github.com/kubernetes/enhancements/issues/1885)
* [Job tracking without lingering Pods](https://github.com/kubernetes/enhancements/issues/2307)
* [Service Internal Traffic Policy](https://github.com/kubernetes/enhancements/issues/2086)
* [Kubelet Credential Provider](https://github.com/kubernetes/enhancements/issues/2133)
* [Support of mixed protocols in Services with type=LoadBalancer](https://github.com/kubernetes/enhancements/issues/1435)
* [Reserve Service IP Ranges For Dynamic and Static IP Allocation](https://github.com/kubernetes/enhancements/issues/3070)
* [CPUManager](https://github.com/kubernetes/enhancements/issues/3570)
* [DeviceManager](https://github.com/kubernetes/enhancements/issues/3573)

### Deprecations and removals

12 features were [deprecated or removed](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/) from
Kubernetes with this release.
    
* [CRI `v1alpha2` API is removed](https://github.com/kubernetes/kubernetes/pull/110618)
* [Removal of the `v1beta1` flow control API group](/docs/reference/using-api/deprecation-guide/#flowcontrol-resources-v126)
* [Removal of the `v2beta2` HorizontalPodAutoscaler API](/docs/reference/using-api/deprecation-guide/#horizontalpodautoscaler-v126)
* [GlusterFS plugin removed from available in-tree drivers](https://github.com/kubernetes/enhancements/issues/3446)
* [Removal of legacy command line arguments relating to logging](https://github.com/kubernetes/kubernetes/pull/112120)
* [Removal of `kube-proxy` userspace modes](https://github.com/kubernetes/kubernetes/pull/112133)
* [Removal of in-tree credential management code](https://github.com/kubernetes/kubernetes/pull/112341)
* [The in-tree OpenStack cloud provider is removed](https://github.com/kubernetes/enhancements/issues/1489)
* [Removal of dynamic kubelet configuration](https://github.com/kubernetes/kubernetes/pull/112643)
* [Deprecation of non-inclusive `kubectl` flag](https://github.com/kubernetes/kubernetes/pull/113116)
* [Deprecations for `kube-apiserver` command line arguments](https://github.com/kubernetes/kubernetes/pull/38186)
* [Deprecations for `kubectl run` command line arguments](https://github.com/kubernetes/kubernetes/pull/112261)

### Release notes

The complete details of the Kubernetes v1.26 release are available in our [release
notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.26.md).

### Availability

Kubernetes v1.26 is available for download on [the Kubernetes site](https://k8s.io/releases/download/). 
To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local 
Kubernetes clusters using containers as "nodes", with [kind](https://kind.sigs.k8s.io/). You can also 
easily install v1.26 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/).

### Release team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each
release team is made up of dedicated community volunteers who work together to build the many pieces
that make up the Kubernetes releases you rely on. This requires the specialized skills of people
from all corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.26/release-team.md)
for the hours spent hard at work to ensure we deliver a solid Kubernetes v1.26 release for our community.

A very special thanks is in order for our Release Lead, Leonard Pahlke, for successfully steering
the entire release team throughout the entire release cycle, by making sure that we could all
contribute in the best way possible to this release through his constant support and attention to
the many and diverse details that make up the path to a successful release.

### User highlights
    
* Wortell faced increasingly higher ammounts of developer expertise and time for daily
  infrastructure management. [They used Dapr to reduce the complexity and amount of required
  infrastructure-related code, allowing them to focus more time on new
  features](https://www.cncf.io/case-studies/wortell/).
* Utmost handles sensitive personal data and needed SOC 2 Type II attestation, ISO 27001
  certification, and zero trust networking. [Using Cilium, they created automated pipelines that
  allowed developers to create new policies, supporting over 4,000 flows per
  second](https://www.cncf.io/case-studies/utmost/).
* Global cybersecurity company Ericom’s solutions depend on hyper-low latency and data
  security. [With Ridge's managed Kubernetes service they were able to deploy, through a single API,
  to a network of service providers worldwide](https://www.cncf.io/case-studies/ericom/).
* Lunar, a Scandinavian online bank, wanted to implement quarterly production cluster failover
  testing to prepare for disaster recovery, and needed a better way to managed their platform
  services.[They started by centralizing their log management system, and followed-up with the
  centralization of all platform services, using Linkerd to connect the
  clusters](https://www.cncf.io/case-studies/lunar/).
* Datadog runs 10s of clusters with 10,000+ of nodes and 100,000+ pods across multiple cloud
  providers.[They turned to Cilium as their CNI and kube-proxy replacement to take advantage of the
  power of eBPF and provide a consistent networking experience for their users across any
  cloud](https://www.cncf.io/case-studies/datadog/).
* Insiel wanted to update their software production methods and introduce a cloud native paradigm in
  their software production. [Their digital transformation project with Kiratech and Microsoft Azure
  allowed them to develop a cloud-first culture](https://www.cncf.io/case-studies/insiel/).
    

### Ecosystem updates

* KubeCon + CloudNativeCon Europe 2023 will take place in Amsterdam, The Netherlands, from 17 – 21
  April 2023! You can find more information about the conference and registration on the [event
  site](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/).
* CloudNativeSecurityCon North America, a two-day event designed to foster collaboration, discussion
  and knowledge sharing of cloud native security projects and how to best use these to address
  security challenges and opportunities, will take place in Seattle, Washington (USA), from 1-2
  February 2023. See the [event
  page](https://events.linuxfoundation.org/cloudnativesecuritycon-north-america/) for more
  information.
* The CNCF announced [the 2022 Community Awards
  Winners](https://www.cncf.io/announcements/2022/10/28/cloud-native-computing-foundation-reveals-2022-community-awards-winners/):
  the Community Awards recognize CNCF community members that are going above and beyond to advance
  cloud native technology.

### Project velocity

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) project
aggregates a number of interesting data points related to the velocity of Kubernetes and various
sub-projects. This includes everything from individual contributions to the number of companies that
are contributing, and is an illustration of the depth and breadth of effort that goes into evolving
this ecosystem.

In the v1.26 release cycle, which [ran for 14 weeks](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.26)
(September 5 to December 9), we saw contributions from [976 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.25.0%20-%20v1.26.0&var-metric=contributions) and [6877 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.25.0%20-%20v1.26.0&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes).

## Upcoming Release Webinar

Join members of the Kubernetes v1.26 release team on Tuesday January 17, 2023 10am - 11am EST (3pm - 4pm UTC) to learn about the major features
of this release, as well as deprecations and removals to help plan for upgrades.  For more information and registration, visit the [event
page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-v126-release/).

## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest
Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your
interests.

Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly
[community meeting](https://github.com/kubernetes/community/tree/master/communication), and through
the channels below:

* Find out more about contributing to Kubernetes at the [Kubernetes
  Contributors](https://www.kubernetes.dev/) website
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Server
  Fault](https://serverfault.com/questions/tagged/kubernetes)
*  [Share](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform) your Kubernetes story
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release
  Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
