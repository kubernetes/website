---
reviewers:
- saad-ali
- thockin
- msau42
- jingxu97
- xing-yang
- yuxiangqian
title: Volume Snapshot Classes
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

This document describes the concept of `VolumeSnapshotClass` in Kubernetes. Familiarity
with [volume snapshots](/docs/concepts/storage/volume-snapshots/) and
[storage classes](/docs/concepts/storage/storage-classes) is suggested.

{{% /capture %}}


{{% capture body %}}

## Introduction

Just like `StorageClass` provides a way for administrators to describe the "classes"
of storage they offer when provisioning a volume, `VolumeSnapshotClass` provides a
way to describe the "classes" of storage when provisioning a volume snapshot.

## The VolumeSnapshotClass Resource

Each `VolumeSnapshotClass` contains the fields `driver`, `deletionPolicy`, and `parameters`,
which are used when a `VolumeSnapshot` belonging to the class needs to be
dynamically provisioned.

The name of a `VolumeSnapshotClass` object is significant, and is how users can
request a particular class. Administrators set the name and other parameters
of a class when first creating `VolumeSnapshotClass` objects, and the objects cannot
be updated once they are created.

Administrators can specify a default `VolumeSnapshotClass` just for VolumeSnapshots
that don't request any particular class to bind to.

```yaml
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
driver: hostpath.csi.k8s.io 
deletionPolicy: Delete
parameters:
```

### Driver

Volume snapshot classes have a driver that determines what CSI volume plugin is
used for provisioning VolumeSnapshots. This field must be specified.

### DeletionPolicy

Volume snapshot classes have a deletionPolicy. It enables you to configure what happens to a `VolumeSnapshotContent` when the `VolumeSnapshot` object it is bound to is to be deleted. The deletionPolicy of a volume snapshot can either be `Retain` or `Delete`. This field must be specified.

If the deletionPolicy is `Delete`, then the underlying storage snapshot will be deleted along with the `VolumeSnapshotContent` object. If the deletionPolicy is `Retain`, then both the underlying snapshot and `VolumeSnapshotContent` remain.

## Parameters

Volume snapshot classes have parameters that describe volume snapshots belonging to
the volume snapshot class. Different parameters may be accepted depending on the
`driver`.

{{% /capture %}}
