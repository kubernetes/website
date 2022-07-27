---
layout: blog
title: "Kubernetes Removals and Major Changes In 1.25"
date: 2022-08-04
slug: upcoming-changes-in-kubernetes-1-25
---

**Authors**: Kat Cosgrove, Frederico Muñoz

As Kubernetes grows and matures, features may be deprecated, removed, or replaced with improvements for the health of the project. Kubernetes v1.25 includes several major changes and one major removal.

## The Kubernetes API Removal and Deprecation process

The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API is one that has been marked for removal in a future Kubernetes release; it will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.

* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes. 
* Beta or pre-release API versions must be supported for 3 releases after deprecation. 
* Alpha or experimental API versions may be removed in any release without prior deprecation notice.

Whether an API is removed as a result of a feature graduating from beta to stable or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the documentation. 

## A Note About PodSecurityPolicy

In Kubernetes v1.25, we will be removing PodSecurityPolicy [after its deprecation in v1.21](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/). PodSecurityPolicy has served us honorably, but its complex and often confusing usage necessitated changes, which unfortunately would have been breaking changes. To address this, it is being removed in favor of a replacement, Pod Security Admission, which is graduating to stable in this release as well. If you are currently relying on PodSecurityPolicy, follow the instructions for [migration to Pod Security Admission](/docs/tasks/configure-pod-container/migrate-from-psp/).

## Major Changes for Kubernetes v1.25

Kubernetes v1.25 includes several major changes, in addition to the removal of PodSecurityPolicy.

### [CSI Migration](https://github.com/kubernetes/enhancements/issues/625)

The effort to  move the CSI in-tree volume plugins to out-of-tree CSI drivers continues, with the core CSI Migration feature going GA in v1.25. This is an important step towards removing the in-tree CSI volume plugins entirely.

### [Signing Release Artifacts](https://github.com/kubernetes/enhancements/issues/3031)

An additional step in the security posture of the release process, the signing of Kubernetes release artifacts will graduate to Beta in this release. This is in line with the proposed enhancement of targeting SLSA Level 3 compliance for the Kubernetes release process.

### [Support for cgroup v2 Graduating to Stable](https://github.com/kubernetes/enhancements/issues/2254)

The new kernel cgroups v2 API was declared stable more than two years ago, and in this release we're taking solid steps towards full adoption of it. While cgroup v1 will continue to be supported, this change makes us ready to deal with the eventual deprecation of cgroup v1 and its replacement by cgroup v2.
    
## Looking ahead

The official [list of API removals planned for Kubernetes 1.26](/docs/reference/using-api/deprecation-guide/#v1-26) is:

* The beta FlowSchema and PriorityLevelConfiguration APIs (flowcontrol.apiserver.k8s.io/v1beta1)
* The beta HorizontalPodAutoscaler API (autoscaling/v2beta2)

    
### Want to know more?
Deprecations are announced in the Kubernetes release notes. You can see the announcements of pending deprecations in the release notes for:
* [Kubernetes 1.21](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md#deprecation)
* [Kubernetes 1.22](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md#deprecation)
* [Kubernetes 1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)
* [Kubernetes 1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation)
* We will formally announce the deprecations that come with [Kubernetes 1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation) as part of the CHANGELOG for that release.

For information on the process of deprecation and removal, check out the official Kubernetes [deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) document.
