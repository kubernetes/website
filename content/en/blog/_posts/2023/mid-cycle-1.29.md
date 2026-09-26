---
layout: blog
title: 'Kubernetes Removals, Deprecations, and Major Changes in Kubernetes 1.29'
date: 2023-11-16
slug: kubernetes-1-29-upcoming-changes
author: >
  Carol Valencia,
  Kristin Martin,
  Abigail McCarthy,
  James Quigley,
  Hosam Kamel
---

As with every release, Kubernetes v1.29 will introduce feature deprecations and removals. Our continued ability to produce high-quality releases is a testament to our robust development cycle and healthy community. The following are some of the deprecations and removals coming in the Kubernetes 1.29 release. 

## The Kubernetes API removal and deprecation process

The Kubernetes project has a well-documented deprecation policy for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API is one that has been marked for removal in a future Kubernetes release; it will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.

* Generally available (GA) or stable API versions may be marked as deprecated, but must not be removed within a major version of Kubernetes.
* Beta or pre-release API versions must be supported for 3 releases after deprecation.
* Alpha or experimental API versions may be removed in any release without prior deprecation notice.

Whether an API is removed as a result of a feature graduating from beta to stable or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the documentation.

## A note about the k8s.gcr.io redirect to registry.k8s.io

To host its container images, the Kubernetes project uses a community-owned image registry called registry.k8s.io. Starting last March traffic to the old k8s.gcr.io registry began being redirected to registry.k8s.io. The deprecated k8s.gcr.io registry will eventually be phased out. For more details on this change or to see if you are impacted, please read [k8s.gcr.io Redirect to registry.k8s.io - What You Need to Know](/blog/2023/03/10/image-registry-redirect/). 

## A note about the Kubernetes community-owned package repositories

Earlier in 2023, the Kubernetes project [introduced](/blog/2023/08/15/pkgs-k8s-io-introduction/) `pkgs.k8s.io`, community-owned software repositories for Debian and RPM packages. The community-owned repositories replaced the legacy Google-owned repositories (`apt.kubernetes.io` and `yum.kubernetes.io`).
On September 13, 2023, those legacy repositories were formally deprecated and their contents frozen.

For more information on this change or to see if you are impacted, please read the [deprecation announcement](/blog/2023/08/31/legacy-package-repository-deprecation/).

## Deprecations and removals for Kubernetes v1.29

See the official list of [API removals](/docs/reference/using-api/deprecation-guide/#v1-29) for a full list of planned deprecations for Kubernetes v1.29.

### Removal of in-tree integrations with cloud providers ([KEP-2395](https://kep.k8s.io/2395))

The [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) `DisableCloudProviders` and `DisableKubeletCloudCredentialProviders` will both be set to `true` by default for Kubernetes v1.29. This change will require that users who are currently using in-tree cloud provider integrations (Azure, GCE, or vSphere) enable external cloud controller managers, or opt in to the legacy integration by setting the associated feature gates to `false`.

Enabling external cloud controller managers means you must run a suitable cloud controller manager within your cluster's control plane; it also requires setting the command line argument `--cloud-provider=external` for the kubelet (on every relevant node), and across the control plane (kube-apiserver and kube-controller-manager).

For more information about how to enable and run external cloud controller managers, read [Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/) and [Migrate Replicated Control Plane To Use Cloud Controller Manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/).

For general information about cloud controller managers, please see
[Cloud Controller Manager](/docs/concepts/architecture/cloud-controller/) in the Kubernetes documentation.

### Removal of the `v1beta2` flow control API group

The _flowcontrol.apiserver.k8s.io/v1beta2_ API version of FlowSchema and PriorityLevelConfiguration will [no longer be served](/docs/reference/using-api/deprecation-guide/#v1-29) in Kubernetes v1.29. 

To prepare for this, you can edit your existing manifests and rewrite client software to use the `flowcontrol.apiserver.k8s.io/v1beta3` API version, available since v1.26. All existing persisted objects are accessible via the new API. Notable changes in `flowcontrol.apiserver.k8s.io/v1beta3` include
that the PriorityLevelConfiguration `spec.limited.assuredConcurrencyShares` field was renamed to `spec.limited.nominalConcurrencyShares`.
 

### Deprecation of the `status.nodeInfo.kubeProxyVersion` field for Node

The `.status.kubeProxyVersion` field for Node objects will be [marked as deprecated](https://github.com/kubernetes/enhancements/issues/4004) in v1.29 in preparation for its removal in a future release. This field is not accurate and is set by kubelet, which does not actually know the kube-proxy version, or even if kube-proxy is running.

## Want to know more?

Deprecations are announced in the Kubernetes release notes. You can see the announcements of pending deprecations in the release notes for:

* [Kubernetes v1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation)
* [Kubernetes v1.26](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.26.md#deprecation)
* [Kubernetes v1.27](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md#deprecation)
* [Kubernetes v1.28](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.28.md#deprecation)

We will formally announce the deprecations that come with [Kubernetes v1.29](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md#deprecation) as part of the CHANGELOG for that release.

For information on the deprecation and removal process, refer to the official Kubernetes [deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) document.