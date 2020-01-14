---
title: CSI Ephemeral Inline Volumes
date: 2020-01-21
---

**Author:** Patrick Ohly (Intel)

Typically, volumes provided by an external storage driver in
Kubernetes are *persistent*, with a lifecycle that is completely
independent of pods or (as a special case) loosely coupled to the
first pod which uses a volume ([late binding
mode](https://kubernetes.io/docs/concepts/storage/storage-classes/#volume-binding-mode)).
The mechanism for requesting and defining such volumes in Kubernetes
are [Persistent Volume Claim (PVC) and Persistent Volume
(PV)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
objects. Originally, volumes that are backed by a Container Storage Interface
(CSI) driver could only be used via this PVC/PV mechanism.

But there are also use cases for data volumes whose content and
lifecycle is tied to a pod. For example, a driver might populate a
volume with dynamically created secrets that are specific to the
application running in the pod. Such volumes need to be created
together with a pod and can be deleted as part of pod termination
(*ephemeral*). They get defined as part of the pod spec (*inline*).

Since Kubernetes 1.15, CSI drivers can also be used for such
*ephemeral inline* volumes. The [CSIInlineVolume feature
gate](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)
had to be set to enable it in 1.15 because support was still in alpha
state. In 1.16, the feature reached beta state, which typically means
that it is enabled in clusters by default.

CSI drivers have to be adapted to support this because although two
existing CSI gRPC calls are used (`NodePublishVolume` and `NodeUnpublishVolume`),
the way how they are
used is different and not covered by the CSI spec: for ephemeral
volumes, only `NodePublishVolume` is invoked by `kubelet` when asking
the CSI driver for a volume. All other calls
(like `CreateVolume`, `NodeStageVolume`, etc.) are skipped. The volume
parameters are provided in the pod spec and from there copied into the
`NodePublishVolumeRequest.volume_context` field. There are currently
no standardized parameters; even common ones like size must be
provided in a format that is defined by the CSI driver. Likewise, only
`NodeUnpublishVolume` gets called after the pod has terminated and the
volume needs to be removed.

Initially, the assumption was that CSI drivers would be specifically
written to provide either persistent or ephemeral volumes. But there
are also drivers which provide storage that is useful in both modes:
for example, [PMEM-CSI](https://github.com/intel/pmem-csi) manages
persistent memory (PMEM), a new kind of local storage that is provided
by [Intel® Optane™ DC Persistent
Memory](https://www.intel.com/content/www/us/en/architecture-and-technology/optane-dc-persistent-memory.html). Such
storage is useful as persistent data storage as well as ephemeral
scratch space.

Therefore the support in Kubernetes 1.16 was extended:
* Kubernetes and users can determine which kind of volumes a driver
  supports via the `volumeLifecycleModes` field in the [`CSIDriver`
  object](https://kubernetes-csi.github.io/docs/csi-driver-object.html#what-fields-does-the-csidriver-object-have).
* Drivers can get information about the volume mode by enabling the
  ["pod info on
  mount"](https://kubernetes-csi.github.io/docs/pod-info.html) feature
  which then will add the new `csi.storage.k8s.io/ephemeral` entry to
  the `NodePublishRequest.volume_context`.

For more information about implementing support of ephemeral inline
volumes in a CSI driver, see the [Kubernetes-CSI
documentation](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
and the [original design
document](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/20190122-csi-inline-volumes.md). What
follows in this blog post are usage examples based on real drivers
that support such volumes.

## [PMEM-CSI](https://github.com/intel/pmem-csi)

## [Image Populator](https://github.com/kubernetes-csi/csi-driver-image-populator)

## cert-manager
