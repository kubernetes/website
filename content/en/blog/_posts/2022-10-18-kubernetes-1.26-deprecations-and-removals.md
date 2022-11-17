---
layout: blog
title: "Kubernetes Removals, Deprecations, and Major Changes in 1.26"
date: 2022-11-18
slug: upcoming-changes-in-kubernetes-1-26
---

**Authors**: Frederico Muñoz

Change is an integral part of the Kubernetes life-cycle: as Kubernetes grows and matures, features may be deprecated, removed, or replaced with improvements for the health of the project. For Kubernetes v1.26 there are several planned: this article identifies and describes some of them, based on the information available at this mid-cycle point in the v1.26 release process, which is still ongoing and can introduce additional changes.

## The Kubernetes API Removal and Deprecation process {#k8s-api-deprecation-process}

The Kubernetes project has a [well-documented deprecation policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API is one that has been marked for removal in a future Kubernetes release; it will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.

* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.
* Beta or pre-release API versions must be supported for 3 releases after deprecation.
* Alpha or experimental API versions may be removed in any release without prior deprecation notice.

Whether an API is removed as a result of a feature graduating from beta to stable or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the documentation.

## A note about the removal of the CRI `v1alpha2` API and containerd 1.5 support {#cri-api-removal}

Following the adoption of the [Container Runtime Interface](https://kubernetes.io/docs/concepts/architecture/cri/) (CRI) and the [removal of dockershim] in v1.24 , the CRI is the supported and documented way through which Kubernetes interacts withdifferent container runtimes. Each kubelet negotiates which version of CRI to use with the container runtime on that node.

The Kubernetes project recommends using CRI version `v1`; in Kubernetes v1.25 the kubelet can also negotiate the use of CRI `v1alpha2` (which was deprecated along at the same time as adding support for the stable `v1` interface).

Kubernetes v1.26 will not support CRI `v1alpha2`. That [removal](https://github.com/kubernetes/kubernetes/pull/110618) will result in the kubelet not registering the node if the container runtime doesn't support CRI `v1`. This means that containerd minor version 1.5 and older will not be supported in Kubernetes 1.26; if you use containerd, you will need to upgrade to containerd version 1.6.0 or later **before** you upgrade that node to Kubernetes v1.26. Other container runtimes that only support the `v1alpha2` are equally affected: if that affects you, you should contact the container runtime vendor for advice or check their website for additional instructions in how to move forward.

If you want to benefit from v1.26 features and still use an older container runtime, you can run an older kubelet. The [supported skew](/releases/version-skew-policy/#kubelet) for the kubelet allows you to run a v1.25 kubelet, which still is still compatible with `v1alpha2` CRI support, even if you upgrade the control plane to the 1.26 minor release of Kubernetes.

As well as container runtimes themselves, that there are tools like [stargz-snapshotter](https://github.com/containerd/stargz-snapshotter) that act as a proxy between kubelet and container runtime and those also might be affected.

## Deprecations and removals in Kubernetes v1.26 {#deprecations-removals}

In addition to the above, Kubernetes v1.26 is targeted to include several additional removals and deprecations.

### Removal of the `v1beta1` flow control resources API

The `flowcontrol.apiserver.k8s.io/v1beta1` API version of FlowSchema and PriorityLevelConfiguration [will no longer be served in v1.26](https://kubernetes.io/docs/reference/using-api/deprecation-guide/#flowcontrol-resources-v126). Users should migrate manifests and API clients to use the `flowcontrol.apiserver.k8s.io/v1beta2` API version, available since v1.23.

### Removal of the `v2beta2` HorizontalPodAutoscaler API

The `autoscaling/v2beta2` API version of HorizontalPodAutoscaler [will no longer be served in v1.26](https://kubernetes.io/docs/reference/using-api/deprecation-guide/#horizontalpodautoscaler-v126). Users should migrate manifests and API clients to use the `autoscaling/v2` API version, available since v1.23.

### Removal of in-tree credential management code

In this upcoming release, legacy vendor-specific authentication code that is part of Kubernetes
will be [removed](https://github.com/kubernetes/kubernetes/pull/112341) from both
`client-go` and `kubectl`.
The existing mechanism supports authentication for two specific cloud providers:
Azure and Google Cloud.
In its place, Kubernetes already offers a vendor-neutral
[authentication plugin mechanism](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins) -
you can switch over right now, before the v1.26 release happens.
If you're affected, you can find additional guidance on how to proceed for
[Azure](https://github.com/Azure/kubelogin#readme) and for
[Google Cloud](https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke).

### Removal of `kube-proxy` userspace modes

The `userspace` proxy mode, deprecated for over a year, is [no longer supported on either Linux or Windows](https://github.com/kubernetes/kubernetes/pull/112133) and will be removed in this release. Users should use `iptables` or `ipvs` on Linux, or `kernelspace` on Windows: using `--mode userspace` will now fail.

### Removal of in-tree OpenStack cloud provider

Kubernetes is switching from in-tree code for storage integrations, in favor of the Container Storage Interface (CSI).
As part of this, Kubernetes v1.26 will remove the the deprecated in-tree storage integration for OpenStack
(the `cinder` volume type). You should migrate to external cloud provider and CSI driver from
https://github.com/kubernetes/cloud-provider-openstack instead.
For more information, visit [Cinder in-tree to CSI driver migration](https://github.com/kubernetes/enhancements/issues/1489).

### Deprecation of non-inclusive `kubectl` flag

As part of the implementation effort of the [Inclusive Naming Initiative](https://www.cncf.io/announcements/2021/10/13/inclusive-naming-initiative-announces-new-community-resources-for-a-more-inclusive-future/),
the `--prune-whitelist` flag will be [deprecated](https://github.com/kubernetes/kubernetes/pull/113116), and replaced with `--prune-allowlist`.
Users that use this flag are strongly advised to make the necessary changes prior to the final removal of the flag, in a future release.

### Removal of dynamic kubelet configuration

_Dynamic kubelet configuration_ allowed [new kubelet configurations to be rolled out via the Kubernetes API](https://github.com/kubernetes/enhancements/tree/2cd758cc6ab617a93f578b40e97728261ab886ed/keps/sig-node/281-dynamic-kubelet-configuration), even in a live cluster.
A cluster operator could reconfigure the kubelet on a Node by specifying a ConfigMap
that contained the configuration data that the kubelet should use.
Dynamic kubelet configuration was removed from the kubelet in v1.24, and will be
[removed from the API server](https://github.com/kubernetes/kubernetes/pull/112643) in the v1.26 release.

### Deprecations of `kube-apiserver` flag

The `--master-service-namespace` command line argument to the kube-apiserver doesn't have
any effect, and was already informally [deprecated](https://github.com/kubernetes/kubernetes/pull/38186).
That command line argument wil be formally marked as deprecated in v1.26, preparing for its
removal in a future release.
The Kubernetes project does not expect any impact from this deprecation and removal.

### Deprecation of several unused `kubectl run` flags

Several unused flags will be [marked as deprecated](https://github.com/kubernetes/kubernetes/pull/112261), including:

* `--cascade`
* `--filename`
* `--force`
* `--grace-period`
* `--kustomize`
* `--recursive`
* `--timeout`
* `--wait`

These flags are already ignored so no impact is expected: the explicit deprecation sets a warning message and prepares the removal of the flags in a future release.

### Removal of deprecated klog flags

This change completes the [deprecations of `klogs` flags](https://github.com/kubernetes/kubernetes/pull/112120) which are no longer supported, and have been removed from Kubernetes components.

## Additional changes for Kubernetes v1.26 {#additional-changes}

On top of the described removals, this release will also include some additional changes to take into consideration: while not deprecations or removals, they introduce new features (or a new default behavior) through the graduating in this release; some of those changes are highlighted here.

### Support for Windows privileged containers

Privileged container support allows containers to run with similar access to the host as processes that run on the host directly. Support for this feature in Windows nodes [will now graduate to stable](https://github.com/kubernetes/enhancements/issues/1981).

### CSI drivers migration

Following the GA of the [core CSI Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration) feature in the previous release, the effort continues and both the [vSphere](https://github.com/kubernetes/enhancements/issues/1491) and [Azure](https://github.com/kubernetes/enhancements/issues/1885) in-tree driver migration to CSI will be graduating to Stable.

### Support of mixed protocols in Services

Currently, the API validation in Kubernetes that currently rejects Service definitions with different protocols if their type is LoadBalancer. In this release [support will be added that relaxes this validation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/1435-mixed-protocol-lb). This feature depends on a strong interaction with the different cloud providers and for anyone planning to use it, a closer reading of the implications and risks is advised.

## Looking ahead {#looking-ahead}

The official list of [API removals](https://kubernetes.io/docs/reference/using-api/deprecation-guide/#v1-27)) planned for Kubernetes 1.27 includes:

* The beta CSIStorageCapacity (`storage.k8s.io/v1beta1`)

### Want to know more?

Deprecations are announced in the Kubernetes release notes. You can see the announcements of pending deprecations in the release notes for:
* [Kubernetes 1.21](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md#deprecation)
* [Kubernetes 1.22](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md#deprecation)
* [Kubernetes 1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)
* [Kubernetes 1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation)
* [Kubernetes 1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation)
* We will formally announce the deprecations that come with [Kubernetes 1.26](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.26.md#deprecation) as part of the CHANGELOG for that release.

