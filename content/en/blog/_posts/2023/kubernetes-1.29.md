---
layout: blog
title: 'Kubernetes v1.29: Mandala'
date: 2023-12-13
slug: kubernetes-v1-29-release
author: >
 [Kubernetes v1.29 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.29/release-team.md)
---

**Editors:** Carol Valencia, Kristin Martin, Abigail McCarthy, James Quigley

Announcing the release of Kubernetes v1.29: Mandala (The Universe), the last release of 2023!

Similar to previous releases, the release of Kubernetes v1.29 introduces new stable, beta, and alpha features. The consistent delivery of top-notch releases underscores the strength of our development cycle and the vibrant support from our community.

This release consists of 49 enhancements. Of those enhancements, 11 have graduated to Stable, 19 are entering Beta and 19 have graduated to Alpha.

## Release theme and logo
    
Kubernetes v1.29: *Mandala (The Universe)* ✨🌌

{{< figure src="/images/blog/2023-12-13-kubernetes-1.29-release/k8s-1.29.png" alt="Kubernetes 1.29 Mandala logo" class="release-logo" >}}

Join us on a cosmic journey with Kubernetes v1.29!

This release is inspired by the beautiful art form that is Mandala—a symbol of the universe in its perfection. Our tight-knit universe of around 40 Release Team members, backed by hundreds of community contributors, has worked tirelessly to turn challenges into joy for millions worldwide.

The Mandala theme reflects our community’s interconnectedness—a vibrant tapestry woven by enthusiasts and experts alike. Each contributor is a crucial part, adding their unique energy, much like the diverse patterns in Mandala art. Kubernetes thrives on collaboration, echoing the harmony in Mandala creations.

The release logo, made by [Mario Jason Braganza](https://janusworx.com) (base Mandala art, courtesy - [Fibrel Ojalá](https://pixabay.com/users/fibrel-3502541/)), symbolizes the little universe that is the Kubernetes project and all its people.

In the spirit of Mandala’s transformative symbolism, Kubernetes v1.29 celebrates our project’s evolution. Like stars in the Kubernetes universe, each contributor, user, and supporter lights the way. Together, we create a universe of possibilities—one release at a time.

## Improvements that graduated to stable in Kubernetes v1.29 {#graduations-to-stable}

_This is a selection of some of the improvements that are now stable following the v1.29 release._

### ReadWriteOncePod PersistentVolume access mode ([SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)) {#readwriteoncepod-pv-access-mode}

In Kubernetes, volume [access modes](/docs/concepts/storage/persistent-volumes/#access-modes)
are the way you can define how durable storage is consumed. These access modes are a part of the spec for PersistentVolumes (PVs) and PersistentVolumeClaims (PVCs). When using storage, there are different ways to model how that storage is consumed. For example, a storage system like a network file share can have many users all reading and writing data simultaneously. In other cases maybe everyone is allowed to read data but not write it. For highly sensitive data, maybe only one user is allowed to read and write data but nobody else.

Before v1.22, Kubernetes offered three access modes for PVs and PVCs:
*	ReadWriteOnce – the volume can be mounted as read-write by a single node
*	ReadOnlyMany – the volume can be mounted read-only by many nodes
*	ReadWriteMany – the volume can be mounted as read-write by many nodes

The ReadWriteOnce access mode restricts volume access to a single node, which means it is possible for multiple pods on the same node to read from and write to the same volume. This could potentially be a major problem for some applications, especially if they require at most one writer for data safety guarantees.
    
To address this problem, a fourth access mode ReadWriteOncePod was introduced as an Alpha feature in v1.22 for CSI volumes. If you create a pod with a PVC that uses the ReadWriteOncePod access mode, Kubernetes ensures that pod is the only pod across your whole cluster that can read that PVC or write to it. In v1.29, this feature became Generally Available.

### Node volume expansion Secret support for CSI drivers ([SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)) {#csi-node-volume-expansion-secrets}
    
In Kubernetes, a volume expansion operation may include the expansion of the volume on the node, which involves filesystem resize. Some CSI drivers require secrets, for example a credential for accessing a SAN fabric, during the node expansion for the following use cases:
* When a PersistentVolume represents encrypted block storage, for example using LUKS, you may need to provide a passphrase in order to expand the device.
* For various validations, the CSI driver needs to have credentials to communicate with the backend storage system at time of node expansion.

To meet this requirement, the CSI Node Expand Secret feature was introduced in Kubernetes v1.25. This allows an optional secret field to be sent as part of the NodeExpandVolumeRequest by the CSI drivers so that node volume expansion operation can be performed with the underlying storage system. In Kubernetes v1.29, this feature became generally available.

### KMS v2 encryption at rest generally available ([SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth)) {#kms-v2-api-encryption}
 
One of the first things to consider when securing a Kubernetes cluster is encrypting persisted
API data at rest. KMS provides an interface for a provider to utilize a key stored in an external
key service to perform this encryption. With the Kubernetes v1.29, KMS v2 has become
a stable feature bringing numerous improvements in performance, key rotation,
health check & status, and observability.
These enhancements provide users with a reliable solution to encrypt all resources in their Kubernetes clusters. You can read more about this in [KEP-3299](https://kep.k8s.io/3299). 

It is recommended to use KMS v2. KMS v1 feature gate is disabled by default. You will have to opt in to continue to use it.



## Improvements that graduated to beta in Kubernetes v1.29 {#graduations-to-beta}

_This is a selection of some of the improvements that are now beta following the v1.29 release._


The throughput of the scheduler is our eternal challenge. This QueueingHint feature brings a new possibility to optimize the efficiency of requeueing, which could reduce useless scheduling retries significantly.

### Node lifecycle separated from taint management ([SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling))

As title describes, it's to decouple `TaintManager` that performs taint-based pod eviction from `NodeLifecycleController` and make them two separate controllers: `NodeLifecycleController` to add taints to unhealthy nodes and `TaintManager` to perform pod deletion on nodes tainted with NoExecute effect.

### Clean up for legacy Secret-based ServiceAccount tokens ([SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth)) {#serviceaccount-token-clean-up}

Kubernetes switched to using more secure service account tokens, which were time-limited and bound to specific pods by 1.22. Stopped auto-generating legacy secret-based service account tokens in 1.24. Then started labeling remaining auto-generated secret-based tokens still in use with their last-used date in 1.27.

In v1.29, to reduce potential attack surface, the LegacyServiceAccountTokenCleanUp feature labels legacy auto-generated secret-based tokens as invalid if they have not been used for a long time (1 year by default), and automatically removes them if use is not attempted for a long time after being marked as invalid (1 additional year by default). [KEP-2799](https://kep.k8s.io/2799)
## New alpha features

### Define Pod affinity or anti-affinity using `matchLabelKeys` ([SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling)) {#match-label-keys-pod-affinity}

One enhancement will be introduced in PodAffinity/PodAntiAffinity as alpha. It will increase the accuracy of calculation during rolling updates.

### nftables backend for kube-proxy ([SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)) {#kube-proxy-nftables}
    
The default kube-proxy implementation on Linux is currently based on iptables. This was the preferred packet filtering and processing system in the Linux kernel for many years (starting with the 2.4 kernel in 2001). However, unsolvable problems with iptables led to the development of a successor, nftables. Development on iptables has mostly stopped, with new features and performance improvements primarily going into nftables instead.

This feature adds a new backend to kube-proxy based on nftables, since some Linux distributions already started to deprecate and remove iptables, and nftables claims to solve the main performance problems of iptables.
    
### APIs to manage IP address ranges for Services ([SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)) {#ip-address-range-apis}

Services are an abstract way to expose an application running on a set of Pods. Services can have a cluster-scoped virtual IP address, that is allocated from a predefined CIDR defined in the kube-apiserver flags. However, users may want to add, remove, or resize existing IP ranges allocated for Services without having to restart the kube-apiserver.

This feature implements a new allocator logic that uses 2 new API Objects: ServiceCIDR and IPAddress, allowing users to dynamically increase the number of Services IPs available by creating new ServiceCIDRs. This helps to resolve problems like IP exhaustion or IP renumbering.

### Add support to containerd/kubelet/CRI to support image pull per runtime class ([SIG Windows](https://github.com/kubernetes/community/tree/master/sig-windows)) {#image-pull-per-runtimeclass}

Kubernetes v1.29 adds support to pull container images based on the RuntimeClass of the Pod that uses them.
This feature is off by default in v1.29 under a feature gate called `RuntimeClassInImageCriApi`.

Container images can either be a manifest or an index. When the image being pulled is an index (image index has a list of image manifests ordered by platform), platform matching logic in the container runtime is used to pull an appropriate image manifest from the index. By default, the platform matching logic picks a manifest that matches the host that the image pull is being executed from. This can be limiting for VM-based containers where a user could pull an image with the intention of running it as a VM-based container, for example, Windows Hyper-V containers.

The image pull per runtime class feature adds support to pull different images based the runtime class specified. This is achieved by referencing an image by a tuple of (`imageID`, `runtimeClass`), instead of just the `imageName` or `imageID`. Container runtimes could choose to add support for this feature if they'd like. If they do not, the default behavior of kubelet that existed prior to Kubernetes v1.29 will be retained.

### In-place updates for Pod resources, for Windows Pods ([SIG Windows](https://github.com/kubernetes/community/tree/master/sig-windows))

As an alpha feature, Kubernetes Pods can be mutable with respect to their `resources`, allowing users to change the _desired_ resource requests and limits for a Pod without the need to restart the Pod. With v1.29, this feature is now supported for Windows containers.

## Graduations, deprecations and removals for Kubernetes v1.29

### Graduated to stable

This lists all the features that graduated to stable (also known as _general availability_).
For a full list of updates including new features and graduations from alpha to beta, see the
[release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md).

This release includes a total of 11 enhancements promoted to Stable:

- [Remove transient node predicates from KCCM's service controller](https://kep.k8s.io/3458)
- [Reserve nodeport ranges for dynamic and static allocation](https://kep.k8s.io/3668)
- [Priority and Fairness for API Server Requests](https://kep.k8s.io/1040)
- [KMS v2 Improvements](https://kep.k8s.io/3299)
- [Support paged LIST queries from the Kubernetes API](https://kep.k8s.io/365)
- [ReadWriteOncePod PersistentVolume Access Mode](https://kep.k8s.io/2485)
- [Kubernetes Component Health SLIs](https://kep.k8s.io/3466)
- [CRD Validation Expression Language](https://kep.k8s.io/2876)
- [Introduce nodeExpandSecret in CSI PV source](https://kep.k8s.io/3107)
- [Track Ready Pods in Job status](https://kep.k8s.io/2879)
- [Kubelet Resource Metrics Endpoint](https://kep.k8s.io/727)

### Deprecations and removals

#### Removal of in-tree integrations with cloud providers ([SIG Cloud Provider](https://github.com/kubernetes/community/tree/master/sig-cloud-provider)) {#in-tree-cloud-provider-integration-removal}

Kubernetes v1.29 defaults to operating _without_ a built-in integration to any cloud provider.
If you have previously been relying on in-tree cloud provider integrations (with Azure, GCE, or vSphere) then you can either:
- enable an equivalent external [cloud controller manager](/docs/concepts/architecture/cloud-controller/)
  integration _(recommended)_
- opt back in to the legacy integration by setting the associated feature gates to `false`; the feature
  gates to change are `DisableCloudProviders` and `DisableKubeletCloudCredentialProviders`
  
Enabling external cloud controller managers means you must run a suitable cloud controller manager within your cluster's control plane; it also requires setting the command line argument `--cloud-provider=external` for the kubelet (on every relevant node), and across the control plane (kube-apiserver and kube-controller-manager).

For more information about how to enable and run external cloud controller managers, read [Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/) and [Migrate Replicated Control Plane To Use Cloud Controller Manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/).

If you need a cloud controller manager for one of the legacy in-tree providers, please see the following links: 
* [Cloud provider AWS](https://github.com/kubernetes/cloud-provider-aws)
* [Cloud provider Azure](https://github.com/kubernetes-sigs/cloud-provider-azure)
* [Cloud provider GCE](https://github.com/kubernetes/cloud-provider-gcp)
* [Cloud provider OpenStack](https://github.com/kubernetes/cloud-provider-openstack)
* [Cloud provider vSphere](https://github.com/kubernetes/cloud-provider-vsphere)

There are more details in [KEP-2395](https://kep.k8s.io/2395).

#### Removal of the `v1beta2` flow control API group

The deprecated _flowcontrol.apiserver.k8s.io/v1beta2_ API version of FlowSchema and
PriorityLevelConfiguration are no longer served in Kubernetes v1.29. 

If you have manifests or client software that uses the deprecated beta API group, you should change
these before you upgrade to v1.29.
See the [deprecated API migration guide](/docs/reference/using-api/deprecation-guide/#v1-29)
for details and advice.
 
#### Deprecation of the `status.nodeInfo.kubeProxyVersion` field for Node

The `.status.kubeProxyVersion` field for Node objects is now deprecated, and the Kubernetes project
is proposing to remove that field in a future release. The deprecated field is not accurate and has historically
been managed by kubelet - which does not actually know the kube-proxy version, or even whether kube-proxy
is running.

If you've been using this field in client software, stop - the information isn't reliable and the field is now
deprecated.


#### Legacy Linux package repositories

Please note that in August of 2023, the legacy package repositories (`apt.kubernetes.io` and
`yum.kubernetes.io`) were formally deprecated and the Kubernetes project announced the
general availability of the community-owned package repositories for Debian and RPM packages,
available at `https://pkgs.k8s.io`.

These legacy repositories were frozen in September of 2023, and
will go away entirely in January of 2024. If you are currently relying on them, you **must** migrate.

_This deprecation is not directly related to the v1.29 release._ For more details, including how these changes may affect you and what to do if you are affected, please read the [legacy package repository deprecation announcement](/blog/2023/08/31/legacy-package-repository-deprecation/).

## Release notes

Check out the full details of the Kubernetes v1.29 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md).

## Availability

Kubernetes v1.29 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.29.0). To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). You can also easily install v1.29 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm).

## Release team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is made up of dedicated community volunteers who work together to build the many pieces that make up the Kubernetes releases you rely on. This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.29/release-team.md) for the hours spent hard at work to deliver the Kubernetes v1.29 release for our community. A very special thanks is in order for our release lead, [Priyanka Saggu](https://github.com/Priyankasaggu11929), for supporting and guiding us through a successful release cycle, making sure that we could all contribute in the best way possible, and challenging us to improve the release process.

## Project velocity
The CNCF K8s DevStats project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.29 release cycle, which [ran for 14 weeks](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.29) (September 6 to December 13), we saw contributions from [888 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.28.0%20-%20now&var-metric=contributions) and [1422 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.28.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes&var-country_name=All&var-companies=All).


## Ecosystem updates
- KubeCon + CloudNativeCon Europe 2024 will take in Paris, France, from **19 – 22 March 2024**! You can find more information about the conference and registration on the [event site](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/).

## Upcoming release webinar {#release-webinar}

Join members of the Kubernetes v1.29 release team on Friday, December 15th, 2023, at 11am PT (2pm eastern) to learn about the major features of this release, as well as deprecations and removals to help plan for upgrades. For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-129-release/) on the CNCF Online Programs site.

### Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
