---
layout: blog
title: "Kubernetes Removals and Deprecations In 1.24"
date: 2022-04-07
slug: upcoming-changes-in-kubernetes-1-24
author: >
   Mickey Boxell (Oracle)
---

As Kubernetes evolves, features and APIs are regularly revisited and removed. New features may offer
an alternative or improved approach to solving existing problems, motivating the team to remove the
old approach. 

We want to make sure you are aware of the changes coming in the Kubernetes 1.24 release. The release will 
**deprecate** several (beta) APIs in favor of stable versions of the same APIs. The major change coming 
in the Kubernetes 1.24 release is the 
[removal of Dockershim](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2221-remove-dockershim). 
This is discussed below and will be explored in more depth at release time. For an early look at the 
changes coming in Kubernetes 1.24, take a look at the in-progress 
[CHANGELOG](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md).

## A note about Dockershim

It's safe to say that the removal receiving the most attention with the release of Kubernetes 1.24 
is Dockershim. Dockershim was deprecated in v1.20. As noted in the [Kubernetes 1.20 changelog](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md#deprecation): 
"Docker support in the kubelet is now deprecated and will be removed in a future release. The kubelet 
uses a module called "dockershim" which implements CRI support for Docker and it has seen maintenance 
issues in the Kubernetes community." With the upcoming release of Kubernetes 1.24, the Dockershim will 
finally be removed. 

In the article [Don't Panic: Kubernetes and Docker](/blog/2020/12/02/dont-panic-kubernetes-and-docker/),
the authors succinctly captured the change's impact and encouraged users to remain calm: 
> Docker as an underlying runtime is being deprecated in favor of runtimes that use the
> Container Runtime Interface (CRI) created for Kubernetes. Docker-produced images
> will continue to work in your cluster with all runtimes, as they always have.

Several guides have been created with helpful information about migrating from dockershim
to container runtimes that are directly compatible with Kubernetes. You can find them on the
[Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/)
page in the Kubernetes documentation.

For more information about why Kubernetes is moving away from dockershim, check out the aptly 
named: [Kubernetes is Moving on From Dockershim](/blog/2022/01/07/kubernetes-is-moving-on-from-dockershim/) 
and the [updated dockershim removal FAQ](/blog/2022/02/17/dockershim-faq/).

Take a look at the [Is Your Cluster Ready for v1.24?](/blog/2022/03/31/ready-for-dockershim-removal/) post to learn about how to ensure your cluster continues to work after upgrading from v1.23 to v1.24. 

## The Kubernetes API removal and deprecation process

Kubernetes contains a large number of components that evolve over time. In some cases, this 
evolution results in APIs, flags, or entire features, being removed. To prevent users from facing 
breaking changes, Kubernetes contributors adopted a feature [deprecation policy](/docs/reference/using-api/deprecation-policy/). 
This policy ensures that stable APIs may only be deprecated when a newer stable version of that 
same API is available and that APIs have a minimum lifetime as indicated by the following stability levels: 

* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes. 
* Beta or pre-release API versions must be supported for 3 releases after deprecation. 
* Alpha or experimental API versions may be removed in any release without prior deprecation notice. 

Removals follow the same deprecation policy regardless of whether an API is removed due to a beta feature 
graduating to stable or because that API was not proven to be successful. Kubernetes will continue to make 
sure migration options are documented whenever APIs are removed. 

**Deprecated** APIs are those that have been marked for removal in a future Kubernetes release. **Removed** 
APIs are those that are no longer available for use in current, supported Kubernetes versions after having 
been deprecated. These removals have been superseded by newer, stable/generally available (GA) APIs. 

## API removals, deprecations, and other changes for Kubernetes 1.24

* [Dynamic kubelet configuration](https://github.com/kubernetes/enhancements/issues/281): `DynamicKubeletConfig` is used to enable the dynamic configuration of the kubelet. The `DynamicKubeletConfig` flag was deprecated in Kubernetes 1.22. In v1.24, this feature gate will be removed from the kubelet. Refer to the ["Dynamic kubelet config is removed" KEP](https://github.com/kubernetes/enhancements/issues/281) for more information.
* [Dynamic log sanitization](https://github.com/kubernetes/kubernetes/pull/107207): The experimental dynamic log sanitization feature is deprecated and will be removed in v1.24. This feature introduced a logging filter that could be applied to all Kubernetes system components logs to prevent various types of sensitive information from leaking via logs. Refer to [KEP-1753: Kubernetes system components logs sanitization](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1753-logs-sanitization#deprecation) for more information and an [alternative approach](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1753-logs-sanitization#alternatives=). 
* [Removing Dockershim from kubelet](https://github.com/kubernetes/enhancements/issues/2221): the Container Runtime Interface (CRI) for Docker (i.e. Dockershim) is currently a built-in container runtime in the kubelet code base. It was deprecated in v1.20. As of v1.24, the kubelet will no longer have dockershim. Check out this blog on [what you need to do be ready for v1.24](/blog/2022/03/31/ready-for-dockershim-removal/). 
* [Storage capacity tracking for pod scheduling](https://github.com/kubernetes/enhancements/issues/1472): The CSIStorageCapacity API supports exposing currently available storage capacity via CSIStorageCapacity objects and enhances scheduling of pods that use CSI volumes with late binding. In v1.24, the CSIStorageCapacity API will be stable. The API graduating to stable initates the deprecation of the v1beta1 CSIStorageCapacity API. Refer to the [Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1472-storage-capacity-tracking) for more information. 
* [The `master` label is no longer present on kubeadm control plane nodes](https://github.com/kubernetes/kubernetes/pull/107533). For new clusters, the label 'node-role.kubernetes.io/master' will no longer be added to control plane nodes, only the label 'node-role.kubernetes.io/control-plane' will be added. For more information, refer to [KEP-2067: Rename the kubeadm "master" label and taint](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cluster-lifecycle/kubeadm/2067-rename-master-label-taint).
* [VolumeSnapshot v1beta1 CRD will be removed](https://github.com/kubernetes/enhancements/issues/177). Volume snapshot and restore functionality for Kubernetes and the [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI), which provides standardized APIs design (CRDs) and adds PV snapshot/restore support for CSI volume drivers, moved to GA in v1.20. VolumeSnapshot v1beta1 was deprecated in v1.20 and will become unsupported with the v1.24 release. Refer to [KEP-177: CSI Snapshot](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/177-volume-snapshot#kep-177-csi-snapshot) and the [Volume Snapshot GA blog](/blog/2020/12/10/kubernetes-1.20-volume-snapshot-moves-to-ga/) blog article for more information. 

## What to do

### Dockershim removal

As stated earlier, there are several guides about 
[Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/). 
You can start with [Finding what container runtime are on your nodes](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).
If your nodes are using dockershim, there are other possible Docker Engine dependencies such as 
Pods or third-party tools executing Docker commands or private registries in the Docker configuration file. You can follow the 
[Check whether Dockershim removal affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/) guide to review possible 
Docker Engine dependencies. Before upgrading to v1.24, you decide to either remain using Docker Engine and 
[Migrate Docker Engine nodes from dockershim to cri-dockerd](/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/) or migrate to a CRI-compatible runtime. Here's a guide to 
[change the container runtime on a node from Docker Engine to containerd](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/).

### `kubectl convert`

The [`kubectl convert`](/docs/tasks/tools/included/kubectl-convert-overview/) plugin for `kubectl` 
can be helpful to address migrating off deprecated APIs. The plugin facilitates the conversion of 
manifests between different API versions, for example, from a deprecated to a non-deprecated API 
version. More general information about the API migration process can be found in the [Deprecated API Migration Guide](/docs/reference/using-api/deprecation-guide/). 
Follow the [install `kubectl convert` plugin](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-kubectl-convert-plugin) 
documentation to download and install the `kubectl-convert` binary. 
    
### Looking ahead

The Kubernetes 1.25 and 1.26 releases planned for later this year will stop serving beta versions 
of several currently stable Kubernetes APIs. The v1.25 release will also remove PodSecurityPolicy, 
which was deprecated with Kubernetes 1.21 and will not graduate to stable. See [PodSecurityPolicy 
Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/) for more information. 

The official [list of API removals planned for Kubernetes 1.25](/docs/reference/using-api/deprecation-guide/#v1-25) is:

* The beta CronJob API (batch/v1beta1)
* The beta EndpointSlice API (discovery.k8s.io/v1beta1)
* The beta Event API (events.k8s.io/v1beta1)
* The beta HorizontalPodAutoscaler API (autoscaling/v2beta1)
* The beta PodDisruptionBudget API (policy/v1beta1)
* The beta PodSecurityPolicy API (policy/v1beta1)
* The beta RuntimeClass API (node.k8s.io/v1beta1)


The official [list of API removals planned for Kubernetes 1.26](/docs/reference/using-api/deprecation-guide/#v1-26) is:

* The beta FlowSchema and PriorityLevelConfiguration APIs (flowcontrol.apiserver.k8s.io/v1beta1)
* The beta HorizontalPodAutoscaler API (autoscaling/v2beta2)

    
### Want to know more?
Deprecations are announced in the Kubernetes release notes. You can see the announcements of pending deprecations in the release notes for:
* [Kubernetes 1.21](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md#deprecation)
* [Kubernetes 1.22](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md#deprecation)
* [Kubernetes 1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)
* We will formally announce the deprecations that come with [Kubernetes 1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation) as part of the CHANGELOG for that release.

For information on the process of deprecation and removal, check out the official Kubernetes [deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) document.

