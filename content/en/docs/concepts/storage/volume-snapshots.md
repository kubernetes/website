---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Volume Snapshots
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

This document describes the current state of `VolumeSnapshots` in Kubernetes. Familiarity with [persistent volumes](/docs/concepts/storage/persistent-volumes/) is suggested.

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

## Introduction

Similar to how API resources `PersistentVolume` and `PersistentVolumeClaim` are used to provision volumes for users and administrators, `VolumeSnapshotContent` and `VolumeSnapshot` API resources are provided to create volume snapshots for users and administrators.

A `VolumeSnapshotContent` is a snapshot taken from a volume in the cluster that has been provisioned by an administrator. It is a resource in the cluster just like a PersistentVolume is a cluster resource. 

A `VolumeSnapshot` is a request for snapshot of a volume by a user. It is similar to a PersistentVolumeClaim.

While `VolumeSnapshots` allow a user to consume abstract storage resources, cluster administrators
need to be able to offer a variety of `VolumeSnapshotContents` without exposing
users to the details of how those volume snapshots should be provisioned. For these needs
there is the `VolumeSnapshotClass` resource.

Users need to be aware of the following when using this feature:

* API Objects `VolumeSnapshot`, `VolumeSnapshotContent`, and `VolumeSnapshotClass` are CRDs, not part of the core API.
* `VolumeSnapshot` support is only available for CSI drivers.
* As part of the deployment process, the Kubernetes team provides a sidecar helper container for the snapshot controller called `external-snapshotter`. It watches `VolumeSnapshot` objects and triggers `CreateSnapshot` and `DeleteSnapshot` operations against a CSI endpoint.
* CSI drivers may or may not have implemented the volume snapshot functionality. The CSI drivers that have provided support for volume snapshot will likely use `external-snapshotter`.
* The CSI drivers that support volume snapshot will automatically install CRDs defined for the volume snapshots.

## Lifecycle of a volume snapshot and volume snapshot content

`VolumeSnapshotContents` are resources in the cluster. `VolumeSnapshots` are requests for those resources. The interaction between `VolumeSnapshotContents` and `VolumeSnapshots` follow this lifecycle:

### Provisioning Volume Snapshot

There are two ways snapshots may be provisioned: statically or dynamically.

#### Static
A cluster administrator creates a number of `VolumeSnapshotContents`. They carry the details of the real storage which is available for use by cluster users. They exist in the Kubernetes API and are available for consumption.

#### Dynamic
When none of the static `VolumeSnapshotContents` the administrator created matches a user's `VolumeSnapshot`,
the cluster may try to dynamically provision a volume snapshot specially for the `VolumeSnapshot` object.
This provisioning is based on `VolumeSnapshotClasses`: the `VolumeSnapshot` must request a
[volume snapshot class](/docs/concepts/storage/volume-snapshot-classes/) and
the administrator must have created and configured that class in order for dynamic
provisioning to occur.

### Binding

A user creates, or has already created in the case of dynamic provisioning, a `VolumeSnapshot` with a specific amount of storage requested and with certain access modes. A control loop watches for new VolumeSnapshots, finds a matching VolumeSnapshotContent (if possible), and binds them together. If a VolumeSnapshotContent was dynamically provisioned for a new VolumeSnapshot, the loop will always bind that VolumeSnapshotContent to the VolumeSnapshot. Once bound, `VolumeSnapshot` binds are exclusive, regardless of how they were bound. A VolumeSnapshot to VolumeSnapshotContent binding is a one-to-one mapping.

VolumeSnapshots will remain unbound indefinitely if a matching VolumeSnapshotContent does not exist. VolumeSnapshots will be bound as matching VolumeSnapshotContents become available.

### Delete

Deletion removes both the `VolumeSnapshotContent` object from the Kubernetes API, as well as the associated storage asset in the external infrastructure.

## Volume Snapshot Contents

Each VolumeSnapshotContent contains a spec, which is the specification of the volume snapshot.

```yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
spec:
  snapshotClassName: csi-hostpath-snapclass
  source:
    name: pvc-test 
    kind: PersistentVolumeClaim
  volumeSnapshotSource:
    csiVolumeSnapshotSource:
      creationTime:    1535478900692119403
      driver:          csi-hostpath
      restoreSize:     10Gi
      snapshotHandle:  7bdd0de3-aaeb-11e8-9aae-0242ac110002
```

### Class

A VolumeSnapshotContent can have a class, which is specified by setting the
`snapshotClassName` attribute to the name of a
[VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/).
A VolumeSnapshotContent of a particular class can only be bound to VolumeSnapshots requesting
that class. A VolumeSnapshotContent with no `snapshotClassName` has no class and can only be bound
to VolumeSnapshots that request no particular class.

## VolumeSnapshots

Each VolumeSnapshot contains a spec and a status, which is the specification and status of the volume snapshot.

```yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshot
metadata:
  name: new-snapshot-test
spec:
  snapshotClassName: csi-hostpath-snapclass
  source:
    name: pvc-test
    kind: PersistentVolumeClaim
```

### Class

A volume snapshot can request a particular class by specifying the name of a
[VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/)
using the attribute `snapshotClassName`.
Only VolumeSnapshotContents of the requested class, ones with the same `snapshotClassName`
as the VolumeSnapshot, can be bound to the VolumeSnapshot.

{{% /capture %}}
