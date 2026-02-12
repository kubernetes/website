---
layout: blog
title: 'Kubernetes v1.31: Elli'
date: 2024-08-13
slug: kubernetes-v1-31-release
author: >
  [Kubernetes v1.31 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md)
---

**Editors:** Matteo Bianchi, Yigit Demirbas, Abigail McCarthy, Edith Puclla, Rashan Smith

Announcing the release of Kubernetes v1.31: Elli!

Similar to previous releases, the release of Kubernetes v1.31 introduces new
stable, beta, and alpha features. 
The consistent delivery of high-quality releases underscores the strength of our development cycle and the vibrant support from our community.
This release consists of 45 enhancements.
Of those enhancements, 11 have graduated to Stable, 22 are entering Beta, 
and 12 have graduated to Alpha.

## Release theme and logo
{{< figure src="/images/blog/2024-08-13-kubernetes-1.31-release/k8s-1.31.png" alt="Kubernetes v1.31 Elli logo" class="release-logo" >}}

The Kubernetes v1.31 Release Theme is "Elli".

Kubernetes v1.31's Elli is a cute and joyful dog, with a heart of gold and a nice sailor's cap, as a playful wink to the huge and diverse family of Kubernetes contributors.

Kubernetes v1.31 marks the first release after the project has successfully celebrated [its first 10 years](/blog/2024/06/06/10-years-of-kubernetes/). 
Kubernetes has come a very long way since its inception, and it's still moving towards exciting new directions with each release. 
After 10 years, it is awe-inspiring to reflect on the effort, dedication, skill, wit and tiring work of the countless Kubernetes contributors who have made this a reality.

And yet, despite the herculean effort needed to run the project, there is no shortage of people who show up, time and again, with enthusiasm, smiles and a sense of pride for contributing and being part of the community. 
This "spirit" that we see from new and old contributors alike is the sign of a vibrant community, a "joyful" community, if we might call it that.

Kubernetes v1.31's Elli is all about celebrating this wonderful spirit! Here's to the next decade of Kubernetes!

## Highlights of features graduating to Stable

_This is a selection of some of the improvements that are now stable following the v1.31 release._

### AppArmor support is now stable

Kubernetes support for AppArmor is now GA. Protect your containers using AppArmor by setting the `appArmorProfile.type` field in the container's `securityContext`. 
Note that before Kubernetes v1.30, AppArmor was controlled via annotations; starting in v1.30 it is controlled using fields. 
It is recommended that you should migrate away from using annotations and start using the `appArmorProfile.type` field.

To learn more read the [AppArmor tutorial](/docs/tutorials/security/apparmor/). 
This work was done as a part of [KEP #24](https://github.com/kubernetes/enhancements/issues/24), by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).

### Improved ingress connectivity reliability for kube-proxy

Kube-proxy improved ingress connectivity reliability is stable in v1.31. 
One of the common problems with load balancers in Kubernetes is the synchronization between the different components involved to avoid traffic drop. 
This feature implements a mechanism in kube-proxy for load balancers to do connection draining for terminating Nodes exposed by services of `type: LoadBalancer` and `externalTrafficPolicy: Cluster` and establish some best practices for cloud providers and Kubernetes load balancers implementations.

To use this feature, kube-proxy needs to run as default service proxy on the cluster and the load balancer needs to support connection draining. 
There are no specific changes required for using this feature, it has been enabled by default in kube-proxy since v1.30 and been promoted to stable in v1.31.

For more details about this feature please visit the [Virtual IPs and Service Proxies documentation page](/docs/reference/networking/virtual-ips/#external-traffic-policy).

This work was done as part of [KEP #3836](https://github.com/kubernetes/enhancements/issues/3836) by [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).
    

### Persistent Volume last phase transition time

Persistent Volume last phase transition time feature moved to GA in v1.31. 
This feature adds a `PersistentVolumeStatus` field which holds a timestamp of when a PersistentVolume last transitioned to a different phase.
With this feature enabled, every PersistentVolume object will have a new field `.status.lastTransitionTime`, that holds a timestamp of
when the volume last transitioned its phase. 
This change is not immediate; the new field will be populated whenever a PersistentVolume is updated and first transitions between phases (`Pending`, `Bound`, or `Released`) after upgrading to Kubernetes v1.31.
This allows you to measure time between when a PersistentVolume moves from `Pending` to `Bound`. This can be also useful for providing metrics and SLOs.

For more details about this feature please visit the [PersistentVolume documentation page](/docs/concepts/storage/persistent-volumes/).

This work was done as a part of [KEP #3762](https://github.com/kubernetes/enhancements/issues/3762) by [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).

## Highlights of features graduating to Beta

_This is a selection of some of the improvements that are now beta following the v1.31 release._
    
### nftables backend for kube-proxy

The nftables backend moves to beta in v1.31, behind the `NFTablesProxyMode` feature gate which is now enabled by default.

The nftables API is the successor to the iptables API and is designed to provide better performance and scalability than iptables. 
The `nftables` proxy mode is able to process changes to service endpoints faster and more efficiently than the `iptables` mode, and is also able to more efficiently process packets in the kernel (though this only
becomes noticeable in clusters with tens of thousands of services).

As of Kubernetes v1.31, the `nftables` mode is still relatively new, and may not be compatible with all network plugins; consult the documentation for your network plugin. 
This proxy mode is only available on Linux nodes, and requires kernel 5.13 or later.
Before migrating, note that some features, especially around NodePort services, are not implemented exactly the same in nftables mode as they are in iptables mode. 
Check the [migration guide](/docs/reference/networking/virtual-ips/#migrating-from-iptables-mode-to-nftables) to see if you need to override the default configuration.

This work was done as part of [KEP #3866](https://github.com/kubernetes/enhancements/issues/3866) by [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).

### Changes to reclaim policy for PersistentVolumes

The Always Honor PersistentVolume Reclaim Policy feature has advanced to beta in Kubernetes v1.31. 
This enhancement ensures that the PersistentVolume (PV) reclaim policy is respected even after the associated PersistentVolumeClaim (PVC) is deleted, thereby preventing the leakage of volumes.

Prior to this feature, the reclaim policy linked to a PV could be disregarded under specific conditions, depending on whether the PV or PVC was deleted first. 
Consequently, the corresponding storage resource in the external infrastructure might not be removed, even if the reclaim policy was set to "Delete". 
This led to potential inconsistencies and resource leaks.

With the introduction of this feature, Kubernetes now guarantees that the "Delete" reclaim policy will be enforced, ensuring the deletion of the underlying storage object from the backend infrastructure, regardless of the deletion sequence of the PV and PVC.

This work was done as a part of [KEP #2644](https://github.com/kubernetes/enhancements/issues/2644) and by [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).
    
### Bound service account token improvements

The `ServiceAccountTokenNodeBinding` feature is promoted to beta in v1.31. 
This feature allows requesting a token bound only to a node, not to a pod, which includes node information in claims in the token and validates the existence of the node when the token is used. 
For more information, read the [bound service account tokens documentation](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-tokens).


This work was done as part of [KEP #4193](https://github.com/kubernetes/enhancements/issues/4193) by [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).


### Multiple Service CIDRs

Support for clusters with multiple Service CIDRs moves to beta in v1.31 (disabled by default).

There are multiple components in a Kubernetes cluster that consume IP addresses: Nodes, Pods and Services. 
Nodes and Pods IP ranges can be dynamically changed because depend on the infrastructure or the network plugin respectively. 
However, Services IP ranges are defined during the cluster creation as a hardcoded flag in the kube-apiserver. 
IP exhaustion has been a problem for long lived or large clusters, as admins needed to expand, shrink or even replace entirely the assigned Service CIDR range. 
These operations were never supported natively and were performed via complex and delicate maintenance operations, often causing downtime on their clusters. This new feature allows users and cluster admins to dynamically modify Service CIDR ranges with zero downtime.

For more details about this feature please visit the
[Virtual IPs and Service Proxies](/docs/reference/networking/virtual-ips/#ip-address-objects) documentation page.

This work was done as part of [KEP #1880](https://github.com/kubernetes/enhancements/issues/1880) by [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).


### Traffic distribution for Services

Traffic distribution for Services moves to beta in v1.31 and is enabled by default. 

After several iterations on finding the best user experience and traffic engineering capabilities for Services networking, SIG Networking implemented the `trafficDistribution` field in the Service specification, which serves as a guideline for the underlying implementation to consider while making routing decisions.

For more details about this feature please read the
[1.30 Release Blog](/blog/2024/04/17/kubernetes-v1-30-release/#traffic-distribution-for-services-sig-network-https-github-com-kubernetes-community-tree-master-sig-network)
or visit the [Service](/docs/concepts/services-networking/service/#traffic-distribution) documentation page.

This work was done as part of [KEP #4444](https://github.com/kubernetes/enhancements/issues/4444) by [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).


### Kubernetes VolumeAttributesClass ModifyVolume

[VolumeAttributesClass](/docs/concepts/storage/volume-attributes-classes/) API is moving to beta in v1.31.
The VolumeAttributesClass provides a generic,
Kubernetes-native API for modifying dynamically volume parameters like provisioned IO.
This allows workloads to vertically scale their volumes on-line to balance cost and performance, if supported by their provider.
This feature had been alpha since Kubernetes 1.29.

This work was done as a part of [KEP #3751](https://github.com/kubernetes/enhancements/issues/3751) and lead by [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).

## New features in Alpha

_This is a selection of some of the improvements that are now alpha following the v1.31 release._
    
### New DRA APIs for better accelerators and other hardware management

Kubernetes v1.31 brings an updated dynamic resource allocation (DRA) API and design. 
The main focus in the update is on structured parameters because they make resource information and requests transparent to Kubernetes and clients and enable implementing features like cluster autoscaling. 
DRA support in the kubelet was updated such that version skew between kubelet and the control plane is possible. With structured parameters, the scheduler allocates ResourceClaims while scheduling a pod. 
Allocation by a DRA driver controller is still supported through what is now called "classic DRA".

With Kubernetes v1.31, classic DRA has a separate feature gate named `DRAControlPlaneController`, which you need to enable explicitly. 
With such a control plane controller, a DRA driver can implement allocation policies that are not supported yet through structured parameters.

This work was done as part of [KEP #3063](https://github.com/kubernetes/enhancements/issues/3063) by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).
    
### Support for image volumes

The Kubernetes community is moving towards fulfilling more Artificial Intelligence (AI) and Machine Learning (ML) use cases in the future. 

One of the requirements to fulfill these use cases is to support Open Container Initiative (OCI) compatible images and artifacts (referred as OCI objects) directly as a native volume source. 
This allows users to focus on OCI standards as well as enables them to store and distribute any content using OCI registries.

Given that, v1.31 adds a new alpha feature to allow using an OCI image as a volume in a Pod.
This feature allows users to specify an image reference as volume in a pod while reusing it as volume
mount within containers. You need to enable the `ImageVolume` feature gate to try this out.

This work was done as part of [KEP #4639](https://github.com/kubernetes/enhancements/issues/4639) by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) and [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).

### Exposing device health information through Pod status

Expose device health information through the Pod Status is added as a new alpha feature in v1.31, disabled by default.

Before Kubernetes v1.31, the way to know whether or not a Pod is associated with the failed device is to use the [PodResources API](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources). 

By enabling this feature, the field `allocatedResourcesStatus` will be added to each container status, within the `.status` for each Pod. The `allocatedResourcesStatus` field reports health information for each device assigned to the container.

This work was done as part of [KEP #4680](https://github.com/kubernetes/enhancements/issues/4680) by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).


### Finer-grained authorization based on selectors

This feature allows webhook authorizers and future (but not currently designed) in-tree authorizers to
allow **list** and **watch** requests, provided those requests use label and/or field selectors.
For example, it is now possible for an authorizer to express: this user cannot list all pods, but can list all pods where `.spec.nodeName` matches some specific value. Or to allow a user to watch all Secrets in a namespace
that are _not_ labelled as `confidential: true`.
Combined with CRD field selectors (also moving to beta in v1.31), it is possible to write more secure
per-node extensions.
    
This work was done as part of [KEP #4601](https://github.com/kubernetes/enhancements/issues/4601) by [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).
    

### Restrictions on anonymous API access

By enabling the feature gate `AnonymousAuthConfigurableEndpoints` users can now use the authentication configuration file to configure the endpoints that can be accessed by anonymous requests. 
This allows users to protect themselves against RBAC misconfigurations that can give anonymous users broad access to the cluster.
    

This work was done as a part of [KEP #4633](https://github.com/kubernetes/enhancements/issues/4633) and by [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).
    
## Graduations, deprecations, and removals in 1.31
    

### Graduations to Stable

This lists all the features that graduated to stable (also known as _general availability_). For a full list of updates including new features and graduations from alpha to beta, see the release notes.

This release includes a total of 11 enhancements promoted to Stable:

* [PersistentVolume last phase transition time](https://github.com/kubernetes/enhancements/issues/3762)
* [Metric cardinality enforcement](https://github.com/kubernetes/enhancements/issues/2305)
* [Kube-proxy improved ingress connectivity reliability](https://github.com/kubernetes/enhancements/issues/3836)
* [Add CDI devices to device plugin API](https://github.com/kubernetes/enhancements/issues/4009)
* [Move cgroup v1 support into maintenance mode](https://github.com/kubernetes/enhancements/issues/4569)
* [AppArmor support](https://github.com/kubernetes/enhancements/issues/24)
* [PodHealthyPolicy for PodDisruptionBudget](https://github.com/kubernetes/enhancements/issues/3017)
* [Retriable and non-retriable Pod failures for Jobs](https://github.com/kubernetes/enhancements/issues/3329)
* [Elastic Indexed Jobs](https://github.com/kubernetes/enhancements/issues/3715)
* [Allow StatefulSet to control start replica ordinal numbering](https://github.com/kubernetes/enhancements/issues/3335)
* [Random Pod selection on ReplicaSet downscaling](https://github.com/kubernetes/enhancements/issues/2185)
    
    
### Deprecations and Removals 

As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better ones for the project's overall health. 
See the Kubernetes [deprecation and removal policy](/docs/reference/using-api/deprecation-policy/) for more details on this process.
    
#### Cgroup v1 enters the maintenance mode

As Kubernetes continues to evolve and adapt to the changing landscape of container orchestration, the community has decided to move cgroup v1 support into maintenance mode in v1.31.
This shift aligns with the broader industry's move towards [cgroup v2](/docs/concepts/architecture/cgroups/), offering improved functionality, scalability, and a more consistent interface. 
Kubernetes maintance mode means that no new features will be added to cgroup v1 support. 
Critical security fixes will still be provided, however, bug-fixing is now best-effort, meaning major bugs may be fixed if feasible, but some issues might remain unresolved.

It is recommended that you start switching to use cgroup v2 as soon as possible. 
This transition depends on your architecture, including ensuring the underlying operating systems and container runtimes support cgroup v2 and testing workloads to verify that workloads and applications function correctly with cgroup v2.

Please report any problems you encounter by filing an [issue](https://github.com/kubernetes/kubernetes/issues/new/choose).

This work was done as part of [KEP #4569](https://github.com/kubernetes/enhancements/issues/4569) by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).

#### A note about SHA-1 signature support

In [go1.18](https://go.dev/doc/go1.18#sha1) (released in March 2022), the crypto/x509 library started to reject certificates signed with a SHA-1 hash function. 
While SHA-1 is established to be unsafe and publicly trusted Certificate Authorities have not issued SHA-1 certificates since 2015, there might still be cases in the context of Kubernetes where user-provided certificates are signed using a SHA-1 hash function through private authorities with them being used for Aggregated API Servers or webhooks. 
If you have relied on SHA-1 based certificates, you must explicitly opt back into its support by setting `GODEBUG=x509sha1=1` in your environment.

Given Go's [compatibility policy for GODEBUGs](https://go.dev/blog/compat), the `x509sha1` GODEBUG and the support for SHA-1 certificates will [fully go away in go1.24](https://tip.golang.org/doc/go1.23) which will be released in the first half of 2025. 
If you rely on SHA-1 certificates, please start moving off them.

Please see [Kubernetes issue #125689](https://github.com/kubernetes/kubernetes/issues/125689) to get a better idea of timelines around the support for SHA-1 going away, when Kubernetes releases plans to adopt go1.24, and for more details on how to detect usage of SHA-1 certificates via metrics and audit logging. 

#### Deprecation of `status.nodeInfo.kubeProxyVersion` field for Nodes ([KEP 4004](https://github.com/kubernetes/enhancements/issues/4004))

The `.status.nodeInfo.kubeProxyVersion` field of Nodes has been deprecated in Kubernetes v1.31,
and will be removed in a later release.
It's being deprecated because the value of this field wasn't (and isn't) accurate.
This field is set by the kubelet, which does not have reliable information about the kube-proxy version or whether kube-proxy is running. 

The `DisableNodeKubeProxyVersion` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) will be set to `true` in by default in v1.31 and the kubelet will no longer attempt to set the `.status.kubeProxyVersion` field for its associated Node.

#### Removal of all in-tree integrations with cloud providers

As highlighted in a [previous article](/blog/2024/05/20/completing-cloud-provider-migration/), the last remaining in-tree support for cloud provider integration has been removed as part of the v1.31 release.
This doesn't mean you can't integrate with a cloud provider, however you now **must** use the
recommended approach using an external integration. Some integrations are part of the Kubernetes
project and others are third party software.

This milestone marks the completion of the externalization process for all cloud providers' integrations from the Kubernetes core ([KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)), a process started with Kubernetes v1.26. 
This change helps Kubernetes to get closer to being a truly vendor-neutral platform.

For further details on the cloud provider integrations, read our [v1.29 Cloud Provider Integrations feature blog](/blog/2023/12/14/cloud-provider-integration-changes/). 
For additional context about the in-tree code removal, we invite you to check the ([v1.29 deprecation blog](/blog/2023/11/16/kubernetes-1-29-upcoming-changes/#removal-of-in-tree-integrations-with-cloud-providers-kep-2395-https-kep-k8s-io-2395)).

The latter blog also contains useful information for users who need to migrate to version v1.29 and later.

#### Removal of in-tree provider feature gates

In Kubernetes v1.31, the following alpha feature gates `InTreePluginAWSUnregister`, `InTreePluginAzureDiskUnregister`, `InTreePluginAzureFileUnregister`, `InTreePluginGCEUnregister`, `InTreePluginOpenStackUnregister`, and `InTreePluginvSphereUnregister` have been removed. These feature gates were introduced to facilitate the testing of scenarios where in-tree volume plugins were removed from the codebase, without actually removing them. Since Kubernetes 1.30 had deprecated these in-tree volume plugins, these feature gates were redundant and no longer served a purpose. The only CSI migration gate still standing is `InTreePluginPortworxUnregister`, which will remain in alpha until the CSI migration for Portworx is completed and its in-tree volume plugin will be ready for removal.


#### Removal of kubelet `--keep-terminated-pod-volumes` command line flag

The kubelet flag `--keep-terminated-pod-volumes`, which was deprecated in 2017, has been removed as
part of the v1.31 release.

You can find more details in the pull request [#122082](https://github.com/kubernetes/kubernetes/pull/122082).

#### Removal of CephFS volume plugin 

[CephFS volume plugin](/docs/concepts/storage/volumes/#cephfs) was removed in this release and the `cephfs` volume type became non-functional. 

It is recommended that you use the [CephFS CSI driver](https://github.com/ceph/ceph-csi/) as a third-party storage driver instead. If you were using the CephFS volume plugin before upgrading the cluster version to v1.31, you must re-deploy your application to use the new driver.

CephFS volume plugin was formally marked as deprecated in v1.28.

#### Removal of Ceph RBD volume plugin

The v1.31 release removes the [Ceph RBD volume plugin](/docs/concepts/storage/volumes/#rbd) and its CSI migration support, making the `rbd` volume type non-functional.

It's recommended that you use the [RBD CSI driver](https://github.com/ceph/ceph-csi/) in your clusters instead. 
If you were using Ceph RBD volume plugin before upgrading the cluster version to v1.31, you must re-deploy your application to use the new driver.

The Ceph RBD volume plugin was formally marked as deprecated in v1.28.

#### Deprecation of non-CSI volume limit plugins in kube-scheduler

The v1.31 release will deprecate all non-CSI volume limit scheduler plugins, and will remove some
already deprected plugins from the [default plugins](/docs/reference/scheduling/config/), including:

- `AzureDiskLimits`
- `CinderLimits`
- `EBSLimits`
- `GCEPDLimits`

It's recommended that you use the `NodeVolumeLimits` plugin instead because it can handle the same functionality as the removed plugins since those volume types have been migrated to CSI. 
Please replace the deprecated plugins with the `NodeVolumeLimits` plugin if you explicitly use them in the [scheduler config](/docs/reference/scheduling/config/). 
The `AzureDiskLimits`, `CinderLimits`, `EBSLimits`, and `GCEPDLimits` plugins will be removed in a future release.

These plugins will be removed from the default scheduler plugins list as they have been deprecated since Kubernetes v1.14.

### Release notes and upgrade actions required

Check out the full details of the Kubernetes v1.31 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md).

#### Scheduler now uses QueueingHint when `SchedulerQueueingHints` is enabled
Added support to the scheduler to start using a QueueingHint registered for Pod/Updated events,
to determine whether updates to  previously unschedulable Pods have made them schedulable.
The new support is active when the feature gate `SchedulerQueueingHints` is enabled.

Previously, when unschedulable Pods were updated, the scheduler always put Pods back to into a queue
(`activeQ` / `backoffQ`). However not all updates to Pods make Pods schedulable, especially considering
many scheduling constraints nowadays are immutable. Under the new behaviour, once unschedulable Pods
are updated, the scheduling queue checks with QueueingHint(s) whether the update may make the
pod(s) schedulable, and requeues them to `activeQ` or `backoffQ` only when at least one
QueueingHint returns `Queue`.

**Action required for custom scheduler plugin developers**: 
Plugins have to implement a QueueingHint for Pod/Update event if the rejection from them could be resolved by updating unscheduled Pods themselves. Example: suppose you develop a custom plugin that denies Pods that have a `schedulable=false` label. Given Pods with a `schedulable=false` label will be schedulable if the `schedulable=false` label is removed, this plugin would implement QueueingHint for Pod/Update event that returns Queue when such label changes are made in unscheduled Pods. You can find more details in the pull request [#122234](https://github.com/kubernetes/kubernetes/pull/122234).

#### Removal of kubelet --keep-terminated-pod-volumes command line flag
The kubelet flag `--keep-terminated-pod-volumes`, which was deprecated in 2017, was removed as part of the v1.31 release.

You can find more details in the pull request [#122082](https://github.com/kubernetes/kubernetes/pull/122082).


## Availability

Kubernetes v1.31 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.31.0) or on the [Kubernetes download page](/releases/download/). 

To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). You can also easily install v1.31 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/). 

## Release team

Kubernetes is only possible with the support, commitment, and hard work of its community. 
Each release team is made up of dedicated community volunteers who work together to build the many pieces that make up the Kubernetes releases you rely on. 
This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md) for the hours spent hard at work to deliver the Kubernetes v1.31 release to our community. 
The Release Team's membership ranges from first-time shadows to returning team leads with experience forged over several release cycles. 
A very special thanks goes out our release lead, Angelos Kolaitis, for supporting us through a successful release cycle, advocating for us, making sure that we could all contribute in the best way possible, and challenging us to improve the release process.


## Project velocity

The CNCF K8s DevStats project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.31 release cycle, which ran for 14 weeks (May 7th to August 13th), we saw contributions to Kubernetes from 113 different companies and 528 individuals.

In the whole Cloud Native ecosystem we have 379 companies counting 2268 total contributors - which means that respect to the previous release cycle we experienced an astounding 63% increase on individuals contributing! 

Source for this data: 
- [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1715032800000&to=1723586399000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1715032800000&to=1723586399000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

By contribution we mean when someone makes a commit, code review, comment, creates an issue or PR, reviews a PR (including blogs and documentation) or comments on issues and PRs.

If you are interested in contributing visit [this page](https://www.kubernetes.dev/docs/guide/#getting-started) to get started. 

[Check out DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) to learn more about the overall velocity of the Kubernetes project and community.

## Event update

Explore the upcoming Kubernetes and cloud-native events from August to November 2024, featuring KubeCon, KCD, and other notable conferences worldwide. Stay informed and engage with the Kubernetes community.

**August 2024**
- [**KubeCon + CloudNativeCon + Open Source Summit China 2024**](https://events.linuxfoundation.org/kubecon-cloudnativecon-open-source-summit-ai-dev-china/): August 21-23, 2024 | Hong Kong
- [**KubeDay Japan**](https://events.linuxfoundation.org/kubeday-japan/): August 27, 2024 | Tokyo, Japan


**September 2024**
- [**KCD Lahore - Pakistan 2024**](https://community.cncf.io/events/details/cncf-kcd-lahore-presents-kcd-lahore-pakistan-2024/): September 1, 2024 | Lahore, Pakistan
- [**KuberTENes Birthday Bash Stockholm**](https://community.cncf.io/events/details/cncf-stockholm-presents-kubertenes-birthday-bash-stockholm-a-couple-of-months-late/): September 5, 2024 | Stockholm, Sweden
- [**KCD Sydney ’24**](https://community.cncf.io/events/details/cncf-kcd-australia-presents-kcd-sydney-24/): September 5-6, 2024 | Sydney, Australia
- [**KCD Washington DC 2024**](https://community.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2024/): September 24, 2024 | Washington, DC, United States
- [**KCD Porto 2024**](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2024/): September 27-28, 2024 | Porto, Portugal

**October 2024**
- [**KCD Austria 2024**](https://community.cncf.io/events/details/cncf-kcd-austria-presents-kcd-austria-2024/): October 8-10, 2024 | Wien, Austria 
- [**KubeDay Australia**](https://events.linuxfoundation.org/kubeday-australia/): October 15, 2024 | Melbourne, Australia
- [**KCD UK - London 2024**](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-london-2024/): October 22-23, 2024 | Greater London, United Kingdom

**November 2024**
- [**KubeCon + CloudNativeCon North America 2024**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): November 12-15, 2024 | Salt Lake City, United States
- [**Kubernetes on EDGE Day North America**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/co-located-events/kubernetes-on-edge-day/): November 12, 2024 | Salt Lake City, United States

## Upcoming release webinar

Join members of the Kubernetes v1.31 release team on Thursday, Thu Sep 12, 2024 10am PT to learn about the major features of this release, as well as deprecations and removals to help plan for upgrades. 
For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-131-release/) on the CNCF Online Programs site.


## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. 
Have something you’d like to broadcast to the Kubernetes community? 
Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. 
Thank you for your continued feedback and support.

- Follow us on X [@Kubernetesio](https://x.com/kubernetesio) for latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
