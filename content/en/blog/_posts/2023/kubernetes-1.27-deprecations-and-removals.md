---
layout: blog
title: "Kubernetes Removals and Major Changes In v1.27"
date: 2023-03-17T14:00:00+0000
slug: upcoming-changes-in-kubernetes-v1-27
author: >
   Harshita Sao
---

As Kubernetes develops and matures, features may be deprecated, removed, or replaced
with better ones for the project's overall health. Based on the information available
at this point in the v1.27 release process, which is still ongoing and can introduce
additional changes, this article identifies and describes some of the planned changes
for the Kubernetes v1.27 release.

## A note about the k8s.gcr.io redirect to registry.k8s.io

To host its container images, the Kubernetes project uses a community-owned image
registry called registry.k8s.io. **On March 20th, all traffic from the out-of-date
[k8s.gcr.io](https://cloud.google.com/container-registry/) registry will be redirected
to [registry.k8s.io](https://github.com/kubernetes/registry.k8s.io)**. The deprecated
k8s.gcr.io registry will eventually be phased out.

### What does this change mean?

- If you are a subproject maintainer, you must update your manifests and Helm
  charts to use the new registry.

- The v1.27 Kubernetes release will not be published to the old registry.

- From April, patch releases for v1.24, v1.25, and v1.26 will no longer be
  published to the old registry.

We have a [blog post](/blog/2023/03/10/image-registry-redirect/) with all
the information about this change and what to do if it impacts you.

## The Kubernetes API Removal and Deprecation process

The Kubernetes project has a well-documented
[deprecation policy](/docs/reference/using-api/deprecation-policy/)
for features. This policy states that stable APIs may only be deprecated when
a newer, stable version of that same API is available and that APIs have a
minimum lifetime for each stability level. A deprecated API has been marked
for removal in a future Kubernetes release, it will continue to function until
removal (at least one year from the deprecation), but usage will result in a
warning being displayed. Removed APIs are no longer available in the current
version, at which point you must migrate to using the replacement.

- Generally available (GA) or stable API versions may be marked as deprecated
  but must not be removed within a major version of Kubernetes.

- Beta or pre-release API versions must be supported for 3 releases after the deprecation.

- Alpha or experimental API versions may be removed in any release without prior deprecation notice.

Whether an API is removed as a result of a feature graduating from beta to stable
or because that API simply did not succeed, all removals comply with this
deprecation policy. Whenever an API is removed, migration options are communicated
in the documentation.

## API removals, and other changes for Kubernetes v1.27

### Removal of `storage.k8s.io/v1beta1` from `CSIStorageCapacity`

The [CSIStorageCapacity](/docs/reference/kubernetes-api/config-and-storage-resources/csi-storage-capacity-v1/)
API supports exposing currently available storage capacity via CSIStorageCapacity
objects and enhances the scheduling of pods that use CSI volumes with late binding.
The `storage.k8s.io/v1beta1` API version of CSIStorageCapacity was deprecated in v1.24,
and it will no longer be served in v1.27.

Migrate manifests and API clients to use the `storage.k8s.io/v1` API version,
available since v1.24. All existing persisted objects are accessible via the new API.

Refer to the
[Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1472-storage-capacity-tracking)
for more information.

Kubernetes v1.27 is not removing any other APIs; however several other aspects are going
to be removed. Read on for details.

### Support for deprecated seccomp annotations

In Kubernetes v1.19, the
[seccomp](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/135-seccomp)
(secure computing mode) support graduated to General Availability (GA).
This feature can be used to increase the workload security by restricting
the system calls for a Pod (applies to all containers) or single containers.

The support for the alpha seccomp annotations `seccomp.security.alpha.kubernetes.io/pod`
and `container.seccomp.security.alpha.kubernetes.io` were deprecated since v1.19, now
have been completely removed. The seccomp fields are no longer auto-populated when pods
with seccomp annotations are created. Pods should use the corresponding pod or container
`securityContext.seccompProfile` field instead.

### Removal of several feature gates for volume expansion

The following feature gates for
[volume expansion](https://github.com/kubernetes/enhancements/issues/284) GA features
will be removed and must no longer be referenced in `--feature-gates` flags:

`ExpandCSIVolumes`
: Enable expanding of CSI volumes.

`ExpandInUsePersistentVolumes`
: Enable expanding in-use PVCs.

`ExpandPersistentVolumes`
: Enable expanding of persistent volumes.

### Removal of `--master-service-namespace` command line argument

The kube-apiserver accepts a deprecated command line argument, `--master-service-namespace`,
that specified where to create the Service named `kubernetes` to represent the API server.
Kubernetes v1.27 will remove that argument, which has been deprecated since the v1.26 release.

### Removal of the `ControllerManagerLeaderMigration` feature gate

[Leader Migration](https://github.com/kubernetes/enhancements/issues/2436) provides
a mechanism in which HA clusters can safely migrate "cloud-specific" controllers
between the `kube-controller-manager` and the `cloud-controller-manager` via a shared
resource lock between the two components while upgrading the replicated control plane.

The `ControllerManagerLeaderMigration` feature, GA since v1.24, is unconditionally
enabled and for the v1.27 release the feature gate option will be removed. If you're
setting this feature gate explicitly, you'll need to remove that from command line
arguments or configuration files.

### Removal of `--enable-taint-manager` command line argument

The kube-controller-manager command line argument `--enable-taint-manager` is
deprecated, and will be removed in Kubernetes v1.27. The feature that it supports,
[taint based eviction](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions),
is already enabled by default and will continue to be implicitly enabled when the flag is removed.

### Removal of `--pod-eviction-timeout` command line argument

The deprecated command line argument `--pod-eviction-timeout` will be removed from the
kube-controller-manager.

### Removal of the `CSI Migration` feature gate

The [CSI migration](https://github.com/kubernetes/enhancements/issues/625)
programme allows moving from in-tree volume plugins to out-of-tree CSI drivers.
CSI migration is generally available since Kubernetes v1.16, and the associated
`CSIMigration` feature gate will be removed in v1.27.

### Removal of `CSIInlineVolume` feature gate

The [CSI Ephemeral Volume](https://github.com/kubernetes/kubernetes/pull/111258)
feature allows CSI volumes to be specified directly in the pod specification for
ephemeral use cases. They can be used to inject arbitrary states, such as
configuration, secrets, identity, variables or similar information, directly
inside pods using a mounted volume. This feature graduated to GA in v1.25.
Hence, the feature gate `CSIInlineVolume` will be removed in the v1.27 release.

### Removal of `EphemeralContainers` feature gate

[Ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/)
graduated to GA in v1.25. These are containers with a temporary duration that
executes within namespaces of an existing pod. Ephemeral containers are
typically initiated by a user in order to observe the state of other pods
and containers for troubleshooting and debugging purposes. For Kubernetes v1.27,
API support for ephemeral containers is unconditionally enabled; the
`EphemeralContainers` feature gate will be removed.

### Removal of `LocalStorageCapacityIsolation` feature gate

The [Local Ephemeral Storage Capacity Isolation](https://github.com/kubernetes/kubernetes/pull/111513)
feature moved to GA in v1.25. The feature provides support for capacity isolation
of local ephemeral storage between pods, such as `emptyDir` volumes, so that a pod
can be hard limited in its consumption of shared resources. The kubelet will
evicting Pods if consumption of local ephemeral storage exceeds the configured limit.
The feature gate, `LocalStorageCapacityIsolation`, will be removed in the v1.27 release.

### Removal of `NetworkPolicyEndPort` feature gate

The v1.25 release of Kubernetes promoted `endPort` in NetworkPolicy to GA.
NetworkPolicy providers that support the `endPort` field that can be used to
specify a range of ports to apply a NetworkPolicy. Previously, each NetworkPolicy
could only target a single port. So the feature gate `NetworkPolicyEndPort`
will be removed in this release.

Please be aware that `endPort` field must be supported by the Network Policy
provider. If your provider does not support `endPort`, and this field is
specified in a Network Policy, the Network Policy will be created covering
only the port field (single port).

### Removal of `StatefulSetMinReadySeconds` feature gate

For a pod that is part of a StatefulSet, Kubernetes can mark the Pod ready only
if Pod is available (and passing checks) for at least the period you specify in
[`minReadySeconds`](/docs/concepts/workloads/controllers/statefulset/#minimum-ready-seconds).
The feature became generally available in Kubernetes v1.25, and the `StatefulSetMinReadySeconds`
feature gate will be locked to true and removed in the v1.27 release.

### Removal of `IdentifyPodOS` feature gate

You can specify the operating system for a Pod, and the feature support for that
is stable since the v1.25 release. The `IdentifyPodOS` feature gate will be
removed for Kubernetes v1.27.

### Removal of `DaemonSetUpdateSurge` feature gate

The v1.25 release of Kubernetes also stabilised surge support for DaemonSet pods,
implemented in order to minimize DaemonSet downtime during rollouts.
The `DaemonSetUpdateSurge` feature gate will be removed in Kubernetes v1.27.

### Removal of `--container-runtime` command line argument

The kubelet accepts a deprecated command line argument, `--container-runtime`, and the only
valid value would be `remote` after dockershim code is removed. Kubernetes v1.27 will remove
that argument, which has been deprecated since the v1.24 release.

## Looking ahead

The official list of
[API removals](/docs/reference/using-api/deprecation-guide/#v1-29)
planned for Kubernetes v1.29 includes:

- The `flowcontrol.apiserver.k8s.io/v1beta2` API version of FlowSchema and
  PriorityLevelConfiguration will no longer be served in v1.29.

## Want to know more?

Deprecations are announced in the Kubernetes release notes. You can see the
announcements of pending deprecations in the release notes for:

- [Kubernetes v1.23](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md#deprecation)

- [Kubernetes v1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#deprecation)

- [Kubernetes v1.25](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md#deprecation)

- [Kubernetes v1.26](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.26.md#deprecation)

We will formally announce the deprecations that come with
[Kubernetes v1.27](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md#deprecation)
as part of the CHANGELOG for that release.

For information on the process of deprecation and removal, check out the official Kubernetes
[deprecation policy](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) document.
