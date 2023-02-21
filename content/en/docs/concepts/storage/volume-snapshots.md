---
reviewers:
- saad-ali
- thockin
- msau42
- jingxu97
- xing-yang
- yuxiangqian
title: Volume Snapshots
content_type: concept
weight: 60
---

<!-- overview -->

In Kubernetes, a _VolumeSnapshot_ represents a snapshot of a volume on a storage
system. This document assumes that you are already familiar with Kubernetes
[persistent volumes](/docs/concepts/storage/persistent-volumes/).

<!-- body -->

## Introduction

Similar to how API resources `PersistentVolume` and `PersistentVolumeClaim` are
used to provision volumes for users and administrators, `VolumeSnapshotContent`
and `VolumeSnapshot` API resources are provided to create volume snapshots for
users and administrators.

A `VolumeSnapshotContent` is a snapshot taken from a volume in the cluster that
has been provisioned by an administrator. It is a resource in the cluster just
like a PersistentVolume is a cluster resource.

A `VolumeSnapshot` is a request for snapshot of a volume by a user. It is similar
to a PersistentVolumeClaim.

`VolumeSnapshotClass` allows you to specify different attributes belonging to a
`VolumeSnapshot`. These attributes may differ among snapshots taken from the same
volume on the storage system and therefore cannot be expressed by using the same
`StorageClass` of a `PersistentVolumeClaim`.

Volume snapshots provide Kubernetes users with a standardized way to copy a volume's
contents at a particular point in time without creating an entirely new volume. This
functionality enables, for example, database administrators to backup databases before
performing edit or delete modifications.

Users need to be aware of the following when using this feature:

- API Objects `VolumeSnapshot`, `VolumeSnapshotContent`, and `VolumeSnapshotClass`
  are {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}}, not
  part of the core API.
- `VolumeSnapshot` support is only available for CSI drivers.
- As part of the deployment process of `VolumeSnapshot`, the Kubernetes team provides
  a snapshot controller to be deployed into the control plane, and a sidecar helper
  container called csi-snapshotter to be deployed together with the CSI driver.
  The snapshot controller watches `VolumeSnapshot` and `VolumeSnapshotContent` objects
  and is responsible for the creation and deletion of `VolumeSnapshotContent` object.
  The sidecar csi-snapshotter watches `VolumeSnapshotContent` objects and triggers
  `CreateSnapshot` and `DeleteSnapshot` operations against a CSI endpoint.
- There is also a validating webhook server which provides tightened validation on
  snapshot objects. This should be installed by the Kubernetes distros along with
  the snapshot controller and CRDs, not CSI drivers. It should be installed in all
  Kubernetes clusters that has the snapshot feature enabled.
- CSI drivers may or may not have implemented the volume snapshot functionality.
  The CSI drivers that have provided support for volume snapshot will likely use
  the csi-snapshotter. See [CSI Driver documentation](https://kubernetes-csi.github.io/docs/) for details.
- The CRDs and snapshot controller installations are the responsibility of the Kubernetes distribution.

## Lifecycle of a volume snapshot and volume snapshot content

`VolumeSnapshotContents` are resources in the cluster. `VolumeSnapshots` are requests
for those resources. The interaction between `VolumeSnapshotContents` and `VolumeSnapshots`
follow this lifecycle:

### Provisioning Volume Snapshot

There are two ways snapshots may be provisioned: pre-provisioned or dynamically provisioned.

#### Pre-provisioned {#static}

A cluster administrator creates a number of `VolumeSnapshotContents`. They carry the details
of the real volume snapshot on the storage system which is available for use by cluster users.
They exist in the Kubernetes API and are available for consumption.

#### Dynamic

Instead of using a pre-existing snapshot, you can request that a snapshot to be dynamically
taken from a PersistentVolumeClaim. The [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/)
specifies storage provider-specific parameters to use when taking a snapshot.

### Binding

The snapshot controller handles the binding of a `VolumeSnapshot` object with an appropriate
`VolumeSnapshotContent` object, in both pre-provisioned and dynamically provisioned scenarios.
The binding is a one-to-one mapping.

In the case of pre-provisioned binding, the VolumeSnapshot will remain unbound until the
requested VolumeSnapshotContent object is created.

### Persistent Volume Claim as Snapshot Source Protection

The purpose of this protection is to ensure that in-use
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
API objects are not removed from the system while a snapshot is being taken from it
(as this may result in data loss).

While a snapshot is being taken of a PersistentVolumeClaim, that PersistentVolumeClaim
is in-use. If you delete a PersistentVolumeClaim API object in active use as a snapshot
source, the PersistentVolumeClaim object is not removed immediately. Instead, removal of
the PersistentVolumeClaim object is postponed until the snapshot is readyToUse or aborted.

### Delete

Deletion is triggered by deleting the `VolumeSnapshot` object, and the `DeletionPolicy`
will be followed. If the `DeletionPolicy` is `Delete`, then the underlying storage snapshot
will be deleted along with the `VolumeSnapshotContent` object. If the `DeletionPolicy` is
`Retain`, then both the underlying snapshot and `VolumeSnapshotContent` remain.

## VolumeSnapshots

Each VolumeSnapshot contains a spec and a status.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: new-snapshot-test
spec:
  volumeSnapshotClassName: csi-hostpath-snapclass
  source:
    persistentVolumeClaimName: pvc-test
```

`persistentVolumeClaimName` is the name of the PersistentVolumeClaim data source
for the snapshot. This field is required for dynamically provisioning a snapshot.

A volume snapshot can request a particular class by specifying the name of a
[VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/)
using the attribute `volumeSnapshotClassName`. If nothing is set, then the
default class is used if available.

For pre-provisioned snapshots, you need to specify a `volumeSnapshotContentName`
as the source for the snapshot as shown in the following example. The
`volumeSnapshotContentName` source field is required for pre-provisioned snapshots.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: test-snapshot
spec:
  source:
    volumeSnapshotContentName: test-content
```

## Volume Snapshot Contents

Each VolumeSnapshotContent contains a spec and status. In dynamic provisioning,
the snapshot common controller creates `VolumeSnapshotContent` objects. Here is an example:

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: snapcontent-72d9a349-aacd-42d2-a240-d775650d2455
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    volumeHandle: ee0cfb94-f8d4-11e9-b2d8-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotClassName: csi-hostpath-snapclass
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
    uid: 72d9a349-aacd-42d2-a240-d775650d2455
```

`volumeHandle` is the unique identifier of the volume created on the storage
backend and returned by the CSI driver during the volume creation. This field
is required for dynamically provisioning a snapshot.
It specifies the volume source of the snapshot.

For pre-provisioned snapshots, you (as cluster administrator) are responsible
for creating the `VolumeSnapshotContent` object as follows.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```

`snapshotHandle` is the unique identifier of the volume snapshot created on
the storage backend. This field is required for the pre-provisioned snapshots.
It specifies the CSI snapshot id on the storage system that this
`VolumeSnapshotContent` represents.

`sourceVolumeMode` is the mode of the volume whose snapshot is taken. The value
of the `sourceVolumeMode` field can be either `Filesystem` or `Block`. If the
source volume mode is not specified, Kubernetes treats the snapshot as if the
source volume's mode is unknown.

`volumeSnapshotRef` is the reference of the corresponding `VolumeSnapshot`. Note that
when the `VolumeSnapshotContent` is being created as a pre-provisioned snapshot, the
`VolumeSnapshot` referenced in `volumeSnapshotRef` might not exist yet.

## Converting the volume mode of a Snapshot {#convert-volume-mode}

If the `VolumeSnapshots` API installed on your cluster supports the `sourceVolumeMode`
field, then the API has the capability to prevent unauthorized users from converting
the mode of a volume.

To check if your cluster has capability for this feature, run the following command:

```yaml
$ kubectl get crd volumesnapshotcontent -o yaml
```

If you want to allow users to create a `PersistentVolumeClaim` from an existing
`VolumeSnapshot`, but with a different volume mode than the source, the annotation
`snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`needs to be added to
the `VolumeSnapshotContent` that corresponds to the `VolumeSnapshot`.

For pre-provisioned snapshots, `spec.sourceVolumeMode` needs to be populated
by the cluster administrator.

An example `VolumeSnapshotContent` resource with this feature enabled would look like:

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
  annotations:
    - snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  sourceVolumeMode: Filesystem
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```

## Provisioning Volumes from Snapshots

You can provision a new volume, pre-populated with data from a snapshot, by using
the _dataSource_ field in the `PersistentVolumeClaim` object.

For more details, see
[Volume Snapshot and Restore Volume from Snapshot](/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support).
