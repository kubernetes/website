---
layout: blog
title: "Kubernetes Removals and Major Changes In v1.27"
date: 2023-03-16
slug: upcoming-changes-in-kubernetes-v1-27
---

**Author**: Harshita Sao (Independent)

As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better ones for the project's overall health. Based on the information available at this mid-cycle point in the v1.27 release process, which is still ongoing and can introduce additional changes, this article identifies and describes some of the planned changes for the Kubernetes v1.27 release.

## A note about k8s.gcr.io Redirect to registry.k8s.io

To host its container images, the Kubernetes project uses a community-owned image registry called registry.k8s.io. **On March 20th, all traffic from the out-of-date [k8s.gcr.io](https://cloud.google.com/container-registry/) registry will be redirected to [registry.k8s.io](https://github.com/kubernetes/registry.k8s.io). On the 3rd of April 2023, the old registry k8s.gcr.io will be frozen, and no further images for Kubernetes and related subprojects will be pushed to the old registry**. The deprecated k8s.gcr.io registry will eventually be phased out.

### What does this change mean?

- If you are a subproject maintainer, you must update your manifests and Helm charts to use the new registry.

- The v1.27 Kubernetes release will not be published to the old registry.

- From April, patch releases for v1.24, v1.25, and v1.26 will no longer be published to the old registry.

We have a [blog post](https://kubernetes.io/blog/2023/03/10/image-registry-redirect/) with all the information about this change and what to do if it impacts you.

## The Kubernetes API Removal and Deprecation process

The Kubernetes project has a well-documented [deprecation policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API has been marked for removal in a future Kubernetes release, it will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.

- Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.

- Beta or pre-release API versions must be supported for 3 releases after the deprecation. 

- Alpha or experimental API versions may be removed in any release without prior deprecation notice. 

Whether an API is removed as a result of a feature graduating from beta to stable or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the documentation.

## API removals, and other changes for Kubernetes v1.27

In addition to the above, Kubernetes v1.27 is targeted to include several additional removals.

### Removal of storage.k8s.io/v1beta1 from [CSIStorageCapacity](https://kubernetes.io/docs/reference/kubernetes-api/config-and-storage-resources/csi-storage-capacity-v1/)

The CSIStorageCapacity API supports exposing currently available storage capacity via CSIStorageCapacity objects and enhances the scheduling of pods that use CSI volumes with late binding. The `storage.k8s.io/v1beta1` API version of CSIStorageCapacity was deprecated in v1.24, and it will no longer be served in v1.27. 

Migrate manifests and API clients to use the `storage.k8s.io/v1` API version, available since v1.24. All existing persisted objects are accessible via the new API.

Refer to the [Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1472-storage-capacity-tracking) for more information.

### Removal of seccomp annotations

In Kubernetes v1.19, the [seccomp](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/135-seccomp) (secure computing mode) support graduated to General Availability (GA). This feature can be used to increase the workload security by restricting the system calls for a Pod (applies to all containers) or single containers.

The support for the alpha seccomp annotations `seccomp.security.alpha.kubernetes.io/pod` and `container.seccomp.security.alpha.kubernetes.io` were deprecated since v1.19, now have been completely removed. The seccomp fields are no longer auto-populated when pods with seccomp annotations are created. Pods should use the corresponding pod or container `securityContext.seccompProfile` field instead.

### Removal of feature gates for [volume expansion](https://github.com/kubernetes/enhancements/issues/284)

The following feature gates for volume expansion GA features will be removed and must no longer be referenced in `--feature-gates` flags:

- `ExpandCSIVolumes`: Enable expanding of CSI volumes.

- `ExpandInUsePersistentVolumes`: Enable expanding in-use PVCs.

- `ExpandPersistentVolumes`: Enable expanding of persistent volumes.

### Removal of [masterServiceNamespace](https://github.com/kubernetes/kubernetes/pull/114446) flag

The namespace from which Kubernetes master services should be injected into pods is `masterServiceNamespace`. This release removes this flag, which has been deprecated since v1.6.

### Removal of [ControllerManagerLeaderMigration](https://github.com/kubernetes/kubernetes/pull/113534) feature gate

[Leader Migration](https://github.com/kubernetes/enhancements/issues/2436) provides a mechanism in which HA clusters can safely migrate "cloud-specific" controllers between the `kube-controller-manager` and the `cloud-controller-manager` via a shared resource lock between the two components while upgrading the replicated control plane. 

The `ControllerManagerLeaderMigration` feature, GA since v1.24, is unconditionally enabled hence the feature gate option will be removed.

### Removal of [enable-taint-manager](https://github.com/kubernetes/kubernetes/pull/111411)  and [pod-eviction-timeout](https://github.com/kubernetes/kubernetes/pull/113710) CLI flag

The command line flag `enable-taint-manager` for kube-controller-manager is deprecated and will be removed in v1.27. The feature that it supports, taint based eviction, is enabled by default and will continue to be implicitly enabled when the flag is removed. The CLI flag `pod-eviction-timeout` is deprecated and will also be removed together with enable-taint-manager.

### Removal of [CSI Migration](https://github.com/kubernetes/kubernetes/pull/110410) feature gate 

Moving the in-tree volume plugins to out-of-tree CSI drivers. As [CSIMigration](https://github.com/kubernetes/enhancements/issues/625) is GA now. The feature gate will be removed in v1.27.

### Removal of CSIInlineVolume feature gate

The [CSI Ephemeral Volume](https://github.com/kubernetes/kubernetes/pull/111258) feature allows CSI volumes to be specified directly in the pod specification for ephemeral use cases. They can be used to inject arbitrary states, such as configuration, secrets, identity, variables or similar information, directly inside pods using a mounted volume. This feature has graduated to GA in v1.25. Hence the feature gate `CSIInlineVolume` will be removed in this release.

### Removal of EphemeralContainers feature gate

[Emphemeral containers](https://github.com/kubernetes/kubernetes/pull/111402) graduated to GA in v1.25. These are containers with a temporary duration that executes within namespaces of an existing pod. Ephemeral Containers are initiated by a user and intended to observe the state of other pods and containers for troubleshooting and debugging purposes. Hence the `EphemeralContainers` feature gate is always enabled and will be removed from the `--feature-gates` flag on the kube-apiserver and the kubelet command lines.

### Removal of LocalStorageCapacityIsolation  feature gate

The [Local Ephemeral Storage Capacity Isolation](https://github.com/kubernetes/kubernetes/pull/111513) feature moved to GA in v1.25. It provides support for capacity isolation of local ephemeral storage between pods, such as EmptyDir, so that a pod can be hard limited in its consumption of shared resources by evicting Pods if its consumption of local ephemeral storage exceeds that limit. Hence the feature gate `LocalStorageCapacityIsolation` will be removed in this release.

### Removal of [NetworkPolicyEndPort](https://github.com/kubernetes/kubernetes/pull/110868) feature gate

`endPort` in Network Policy promoted to GA in v1.25. Network Policy providers that support `endPort` field that can be used to specify a range of ports to apply a Network Policy. Previously, each Network Policy could only target a single port. So the feature gate `NetworkPolicyEndPort` will be removed in this release.

Please be aware that `endPort` field must be supported by the Network Policy provider. If your provider does not support endPort, and this field is specified in a Network Policy, the Network Policy will be created covering only the port field (single port)

### Removal of StatefulSetMinReadySeconds feature gate

StatefulSet Controller honoring [minReadySeconds](https://github.com/kubernetes/kubernetes/pull/110896) and mark Pod ready only if Pod is available for the given time mentioned in minReadySeconds. With Promotion of StatefulSet minReadySeconds to GA in v1.25, means `--feature-gates=StatefulSetMinReadySeconds=true` are not needed on kube-apiserver and kube-controller-manager binaries so they'll be removed in this release.

### Removal of [IdentifyPodOS](https://github.com/kubernetes/kubernetes/pull/111229) feature gate

Addition of a new field to the pod spec called os to identify the OS of the containers specified in the pod. From v1.25, the IdentifyPodOS feature is in GA stage and defaults to be enabled hence the `IdentifyPodOS` feature gate will no longer be accepted as a `--feature-gates` parameter in v1.27.

### Removal of [DaemonSetUpdateSurge](https://github.com/kubernetes/kubernetes/pull/111194) feature gate

Surge support in order to minimize DaemonSet downtime on nodes. This will allow daemonset workloads to implement zero-downtime upgrades. As DaemonSet MaxSurge was graduated to GA in v1.25. This means `--feature-gates=DaemonSetUpdateSurge=true` are not needed on kube-apiserver and kube-controller-manager binaries so they'll be removed in v1.27.

## Looking ahead

The official list of [API removals](https://kubernetes.io/docs/reference/using-api/deprecation-guide/#v1-29) planned for Kubernetes v1.29 includes:

- The `flowcontrol.apiserver.k8s.io/v1beta2` API version of FlowSchema and PriorityLevelConfiguration will no longer be served in v1.29.

## Want to know more?

Deprecations are announced in the Kubernetes release notes. You can see the announcements of pending deprecations in the release notes for:

- [Kubernetes v1.21](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.21.md#deprecation)

- [Kubernetes v1.22](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.22.md#deprecation)

- [Kubernetes v1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)

- [Kubernetes v1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation)

- [Kubernetes v1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation)

- [Kubernetes v1.26](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.26.md#deprecation)

We will formally announce the deprecations that come with [Kubernetes v1.27](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md#deprecation) as part of the CHANGELOG for that release.

For information on the process of deprecation and removal, check out the official Kubernetes [deprecation policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) document.