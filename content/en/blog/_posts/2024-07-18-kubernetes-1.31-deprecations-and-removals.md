---
layout: blog
title: 'Kubernetes Removals and Major Changes In v1.31'
date: 2024-07-18
slug: kubernetes-1-31-upcoming-changes
author: >
  Abigail McCarthy,
  Edith Puclla,
  Matteo Bianchi,
  Rashan Smith,
  Yigit Demirbas 
---

As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better ones for the project's overall health. This article outlines some planned changes for the Kubernetes v1.31 release that the release team feels you should be aware of for the continued maintenance of your Kubernetes environment. The Information listed below is based on the current status of the v1.31 release. It may change before the actual release date. 

### The Kubernetes API Removal and Deprecation process
The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that API is available and that APIs have a minimum lifetime for each stability level. A deprecated API has been marked for removal in a future Kubernetes release. It will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, so you must migrate to using the replacement.

* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.

* Beta or pre-release API versions must be supported for 3 releases after the deprecation.

* Alpha or experimental API versions may be removed in any release without prior deprecation notice.

Whether an API is removed because a feature graduated from beta to stable or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the [documentation](/docs/reference/using-api/deprecation-guide/).

## A note about SHA-1 signature support fully going away in go1.24

In [go1.18](https://go.dev/doc/go1.18#sha1) (released in March 2022), the crypto/x509 library started to reject certificates that were signed with a SHA-1 hash function. While SHA-1 is established to be unsafe and publicly trusted Certificate Authorities have not issued SHA-1 certificates since 2015, there might still be cases in the context of Kubernetes where user-provided certificates are signed using a SHA-1 hash function through private authorities with them being used for Aggregated API Servers of webhooks. If you have relied on SHA-1 based certificates, you must explicitly opt back into its support by setting `GODEBUG=x509sha1=1` in your environment.

Given Go's [compatibility policy for GODEBUGs](https://go.dev/blog/compat), the `x509sha1` GODEBUG and the support for SHA-1 certificates will [fully go away in go1.24](https://tip.golang.org/doc/go1.23) which will be released in the first half of 2025. If you rely on SHA-1 certificates, please start moving off them.

Please see [Kubernetes issue #125689](https://github.com/kubernetes/kubernetes/issues/125689) to get a better idea of timelines around the support for SHA-1 going away, when Kubernetes releases plans to adopt go1.24, and for more details on how to detect usage of SHA-1 certificates via metrics and audit logging. 

## Deprecations and Removals in Kubernetes 1.31

### Deprecate kustomize from kubectl [KEP 4706](https://github.com/kubernetes/enhancements/issues/4706)
In the early days of Kubernetes, when not that many tools in the field of declarative configurations existed, [kustomize](https://github.com/kubernetes-sigs/kustomize) was introduced, and to make life easier for kubectl users, it was included in kubectl by default.

Over the past several years, the ecosystem around Kubernetes has grown significantly, resulting in a wider spread of tooling, including declarative configuration. With these new options, it's best left to the user to match their use cases with the best tool capable of resolving the problem at hand. Using [kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/), users can choose the best tool to match their needs.

With Kubernetes v1.31, kustomize will be deprecated from kubectl. It will be removed in a future release. This will allow both tools to be developed and maintained separately.

### Deprecate Kubelet RunOnce mode [KEP 4580](https://github.com/kubernetes/enhancements/issues/4580)
The kubelet support for RunOnce mode is being deprecated and will be removed in a future release. Users are advised to deprecate RunOnce mode by disabling the `LegacyNodeRunOnceMode` feature gate. Starting in Kubernetes v1.31, kubelet will refuse to start if this feature gate is disabled. 

If you still rely on this feature, migrate to using the `podman kube` subcommand. Refer to the [podman documentation](https://docs.podman.io/en/latest/markdown/podman-kube.1.html.) for more information.

### Deprecate status.nodeInfo.kubeProxyVersion field [KEP 4004](https://github.com/kubernetes/enhancements/issues/4004)
The `status.nodeInfo.kubeProxyVersionv1.Node` field is being deprecated due to inaccuracies and will be removed in a future release. This field is set by the kubelet, which does not have reliable information about the kube-proxy version or whether kube-proxy is running. 

After deprecation, users can no longer retrieve the kube-proxy version from the Node object.

### Removal of in-tree cloud providers - sig-cloudprovider

As highlighted in our [previous blog](/blog/2024/05/20/completing-cloud-provider-migration/), the last bits of in-tree cloud provider code have been removed.
This milestone marks the completion of the externalization process for all cloud providers' integrations from the Kubernetes core ([KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)), a process started with Kubernetes v1.26. This change helps Kubernetes to get closer to being a truly vendor-neutral platform.

For further details on the cloud provider integrations, read our [v1.29 Cloud Provider Integrations feature blog](https://kubernetes.io/blog/2023/12/14/cloud-provider-integration-changes/). For additional context about the in-tree code removal, we invite you to check the ([v1.29 deprecation blog](https://kubernetes.io/blog/2023/11/16/kubernetes-1-29-upcoming-changes/#removal-of-in-tree-integrations-with-cloud-providers-kep-2395-https-kep-k8s-io-2395)).

The latter blog also contains useful information for users who need to migrate to version v1.29 and later.


### Removal of Kubelet Flag `--keep-terminated-pod-volumes`
The Kubelet flag `--keep-terminated-pod-volumes`, which was deprecated in 2017, has now been removed.

You can find more details in the pull request [#122082](https://github.com/kubernetes/kubernetes/pull/122082).

### Removal of CephFS volume plugin 
[CephFS volume plugin](/docs/concepts/storage/volumes/#cephfs) was removed in this release and the `cephfs` volume type became non-functional. 

It is recommended that you use the [CephFS CSI driver](https://github.com/ceph/ceph-csi/) as a third-party storage driver instead. If you were using the CephFS volume plugin before upgrading the cluster version to v1.31, you must re-deploy your application to use the new driver.

CephFS volume plugin was formally marked as deprecated in v1.28.

### Removal of Ceph RBD volume plugin
This release removed the [Ceph RBD volume plugin](/docs/concepts/storage/volumes/#rbd) and its CSI migration support, making the `rbd` volume type non-functional.

It's recommended that you use the [RBD CSI driver](https://github.com/ceph/ceph-csi/) in your clusters instead. If you were using Ceph RBD volume plugin before upgrading the cluster version to v1.31, you must re-deploy your application to use the new driver.

The CephRBD volume plugin was formally marked as deprecated in v1.28.

### Deprecation of Non-CSI Volume Limit Plugins in Kube-scheduler 

The `kube-scheduler` has deprecated all non-CSI volume limit plugins and removed them from the [default plugins](/docs/reference/scheduling/config/), including:

- AzureDiskLimits
- CinderLimits
- EBSLimits
- GCEPDLimits

Its recommended that you use `NodeVolumeLimits` plugin instead because it can handle the same functionality as the removed plugins since those volume types have been migrated to CSI. Please replace the deprecated plugins with the `NodeVolumeLimits` plugin if you explicitly use them in the [scheduler config](/docs/reference/scheduling/config/). The `AzureDiskLimits`, `CinderLimits`, `EBSLimits`, and `GCEPDLimits` plugins will be removed in Kubernetes v1.32.

These plugins have been removed from the default plugins as they have been marked as deprecated since Kubernetes v1.14.

## Looking ahead
The official list of API removals planned for [Kubernetes v1.32](/docs/reference/using-api/deprecation-guide/#v1-32) include:

* The `flowcontrol.apiserver.k8s.io/v1beta3` API version of FlowSchema and PriorityLevelConfiguration will be removed. To prepare for this, you can edit your existing manifests and rewrite client software to use the `flowcontrol.apiserver.k8s.io/v1 API` version, available since v1.29. All existing persisted objects are accessible via the new API. Notable changes in flowcontrol.apiserver.k8s.io/v1beta3 include that the PriorityLevelConfiguration `spec.limited.nominalConcurrencyShares` field only defaults to 30 when unspecified, and an explicit value of 0 is not changed to 30.

For more information please refer to [these docs](/docs/reference/using-api/deprecation-guide/#v1-32).

## Want to know more?
The Kubernetes release notes announce deprecations. We will formally announce the deprecations in [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md#deprecation) as part of the CHANGELOG for that release.

You can see the announcements of pending deprecations in the release notes for:

* [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md#deprecation)

* [Kubernetes v1.29](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md#deprecation)

* [Kubernetes v1.28](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.28.md#deprecation)

* [Kubernetes v1.27](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md#deprecation)


