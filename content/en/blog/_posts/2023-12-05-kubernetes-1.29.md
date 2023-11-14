---
layout: blog
title: 'Kubernetes 1.29: TBD'
date: 2023-12-05
slug: kubernetes-1-29-release-announcement
---

**Authors:** [Kubernetes 1.29 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.29/release_team.md)

Announcing the release of Kubernetes v1.29 "TBD", the last release of 2023!

Similar to previous releases, the upcoming release of 1.29 will bring about main features, deprecations and removals. The consistent delivery of top-notch releases underscores the strength of our development cycle and the vibrant support from our community. Key modifications are anticipated in areas such as sig-storage, sig-scheduling, sig-windows, sig-network, and various other sigs.

This release consists of <xx> enhancements. Of those enhancements, <xx> are entering Alpha, <xx> have graduated to Beta, and <xxx> have graduated to Stable.

## Release Theme And Logo
    
Kubernetes v1.29: xxxxxx

The theme for Kubernetes v1.29 is xxxx.

## What's New in [sig-storage](https://github.com/kubernetes/community/tree/master/sig-storage) 

### Generally Available: ReadWriteOncePod PersistentVolume AccessMode

In Kubernetes, [access modes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes) are the way you can define how durable storage is consumed. These access modes are a part of the spec for PersistentVolumes (PVs) and PersistentVolumeClaims (PVCs).

Before v1.22, Kubernetes offered three access modes for PVs and PVCs:
	•	ReadWriteOnce – the volume can be mounted as read-write by a single node
	•	ReadOnlyMany – the volume can be mounted read-only by many nodes
	•	ReadWriteMany – the volume can be mounted as read-write by many nodes

The ReadWriteOnce access mode restricts volume access to a single node, which means it is possible for multiple pods on the same node to read from and write to the same volume. This could potentially be a major problem for some applications, especially if they require at most one writer for data safety guarantees.
    
To address this problem, a fourth access mode ReadWriteOncePod was introduced as an Alpha feature in v1.22 for CSI volumes. If you create a pod with a PVC that uses the ReadWriteOncePod access mode, Kubernetes ensures that pod is the only pod across your whole cluster that can read that PVC or write to it. In v1.29, this feature became Generally Available.

### Generally Available: Node Expand Secret for CSI Driver
    
In Kubernetes, a volume expansion operation may include the expansion of the volume on the node side which involves filesystem resize. Some CSI drivers require secrets (for example: a credential for accessing a SAN fabric) during the node expansion for the following use cases:
	•	When a PersistentVolume represents encrypted block storage (for example using LUKS) you need to provide a passphrase in order to expand the device.
	•	For various validations at time of node expansion, the CSI driver needs to have credentials in order to communicate with the backend storage system. 

To meet this requirement, a CSI Node Expand Secret feature was introduced in Kubernetes v1.25 release. This allows an optional secret field to be sent as part of the NodeExpandVolumeRequest by the CSI drivers so that node side volume expansion operation can be performed with the underlying storage system. In Kubernetes 1.29 release, this feature became generally available.

## What's New in [sig-scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling)

### Beta: Per-plugin callback functions for accurate requeueing in kube-schedule

The throughput of the scheduler is our eternal challenge. This QueueingHint feature brings a new possibility to optimize the efficiency of requeueing, which could reduce useless scheduling retries significantly.
    
### Alpha: Introduce MatchLabelKeys to Pod Affinity and Pod Anti Affinity - alpha in v1.29

The throughput of the scheduler is our eternal challenge. This QueueingHint feature brings a new possibility to optimize the efficiency of requeueing, which could reduce useless scheduling retries significantly. We're actively working on this, and some stable in-tree plugins will have supported it in v1.29.
    
### Generally Available: ReadWriteOncePod access mode for PV

### Beta: Decouple TaintManager from NodeLifecycleController

As title describes, it's to decouple `TaintManager` that performs taint-based pod eviction from `NodeLifecycleController` and make them two separate controllers: `NodeLifecycleController` to add taints to unhealthy nodes and `TaintManager` to perform pod deletion on nodes tainted with NoExecute effect.

## What's New in [sig-network](https://github.com/kubernetes/community/tree/master/sig-network)

### Alpha: Add a new kube-proxy backend using nftables
    
This features adds a new backend to kube-proxy based on nftables, since kernel community is focused mainly in nftables and practically stopped the iptables development
    
### Alpha: Implement an API to manage Kubernetes Services IP Ranges  (Multiple Service CIDRs)

This features allow cluster administrators to dynamically resize the service IP ranges assigned to their clusters to deal with problems like IP exhaustion or IP renumbering.

## What's New in [sig-windows](https://github.com/kubernetes/community/tree/master/sig-windows)

### Alpha: Add support to containerd/kubelet/CRI to support image pull per runtime class

### Alpha: Implement In-place Update of Pod Resources

## Graduations, deprecations and removals for Kubernetes v1.29

### Graduated to stable

This release includes a total of xx enhancements promoted to Stable:
- 
- 
-
-

### Deprecations and removals

See the official list of [API removals](/docs/reference/using-api/deprecation-guide/#v1-29) for a full list of planned deprecations for Kubernetes v1.29.

#### Removal of in-tree integrations with cloud providers ([KEP-2395](https://kep.k8s.io/2395))

The [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) `DisableCloudProviders` and `DisableKubeletCloudCredentialProviders` will both be set to `true` by default for Kubernetes v1.29. This change will require that users who are currently using in-tree cloud provider integrations (Azure, GCE, or vSphere) enable external cloud controller managers, or opt in to the legacy integration by setting the associated feature gates to `false`.

Enabling external cloud controller managers means you must run a suitable cloud controller manager within your cluster's control plane; it also requires setting the command line argument `--cloud-provider=external` for the kubelet (on every relevant node), and across the control plane (kube-apiserver and kube-controller-manager).

For more information about how to enable and run external cloud controller managers, read [Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/) and [Migrate Replicated Control Plane To Use Cloud Controller Manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/).

For general information about cloud controller managers, please see
[Cloud Controller Manager](/docs/concepts/architecture/cloud-controller/) in the Kubernetes documentation.

#### Removal of the `v1beta2` flow control API group

The _flowcontrol.apiserver.k8s.io/v1beta2_ API version of FlowSchema and PriorityLevelConfiguration will [no longer be served](/docs/reference/using-api/deprecation-guide/#v1-29) in Kubernetes v1.29. 

To prepare for this, you can edit your existing manifests and rewrite client software to use the `flowcontrol.apiserver.k8s.io/v1beta3` API version, available since v1.26. All existing persisted objects are accessible via the new API. Notable changes in `flowcontrol.apiserver.k8s.io/v1beta3` include
that the PriorityLevelConfiguration `spec.limited.assuredConcurrencyShares` field was renamed to `spec.limited.nominalConcurrencyShares`.
 
#### Deprecation of the `status.nodeInfo.kubeProxyVersion` field for Node

The `.status.kubeProxyVersion` field for Node objects will be [marked as deprecated](https://github.com/kubernetes/enhancements/issues/4004) in v1.29 in preparation for its removal in a future release. This field is not accurate and is set by kubelet, which does not actually know the kube-proxy version, or even if kube-proxy is running.

### Release Notes

Check out the full details of the Kubernetes 1.29 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md).

### Availability

Kubernetes 1.29 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.XX.0). To get started with Kubernetes, check out these [interactive tutorials](https://kubernetes.io/docs/tutorials/) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). You can also easily install 1.29 using [kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/). 

### Release Team

<FIND AN INDIVIDUAL TEXT, EACH RELEASE TEAM HAS ITS OWN STORY, TELL IT!>

We would like to thank the entire release team for the hours spent hard at work to deliver Kubernetes v1.29 release for our community.

Special thanks to our release lead, [Priyanka Saggu](https://github.com/Priyankasaggu11929), for guiding us and challengue to improve the successful release cycle.

### Project Velocity

<CHECKOUT THE DEVSTATS AND HIGHLIGHT SOME INTRESTING NUMBERS https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m>

<AS EXAMPLE>
This past quarter, 641 different companies and over 6,409 individuals contributed to Kubernetes. [Check out DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) to learn more about the overall velocity of the Kubernetes project and community.

The CNCF K8s DevStats project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.29 release cycle, which ran for 14 weeks (September 6 to December 5), we saw contributions from 911 companies and 1440 individuals.


### Ecosystem Updates
- KubeCon Paris 2024 will take place in xxx, China, from 26 – 28 September 2023! You can find more information about the conference and registration on the event site.
- KubeCon India 2024 will take place in xxx, Illinois, The United States of America, from 6 – 9 November 2023! You can find more information about the conference and registration on the event site.

### Upcoming Release Webinar

<RELEASE WEBINARE WILL TAKE PLACE NORMALLY 30 DAYS AFTER RELEASE, ALIGN WITH CNCF TO HIGHLIGHT THE WEBINAR>

Join members of the Kubernetes v1.29 release team on Wednesday, September 6th, 2023, at 9 A.M. PDT to learn about the major features of this release, as well as deprecations and removals to help plan for upgrades. For more information and registration, visit the event page on the CNCF Online Programs site.

### Get Involved

<THIS COMMUNITY LIVES BY ITS GREAT COMMUNITY, GET THEM INVOLVED!>
The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)