---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
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

Each `VolumeSnapshotClass` contains the fields `snapshotter` and `parameters`,
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
snapshotter: csi-hostpath
parameters:
```

### Snapshotter

Volume snapshot classes have a snapshotter that determines what CSI volume plugin is
used for provisioning VolumeSnapshots. This field must be specified.

## Parameters

Volume snapshot classes have parameters that describe volume snapshots belonging to
the volume snapshot class. Different parameters may be accepted depending on the
`snapshotter`.

{{% /capture %}}
