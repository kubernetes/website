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

### Snapshot Object in Use Protection

The purpose of the Snapshot Object in Use Protection feature is to ensure that in-use snapshot API objects are not removed from the system (as this may result in data loss). There are two cases that require “in-use” protection:

* If a volume snapshot is in active use by a persistent volume claim as a source to create a volume.
* If a `VolumeSnapshotContent` API object is bound to a `VolumeSnapshot` API object, the content object is considered in use.

If a user deletes a `VolumeSnapshot` API object in active use by a PVC, the `VolumeSnapshot` object is not removed immediately. Instead, removal of the `VolumeSnapshot` object is postponed until the `VolumeSnapshot` is no longer actively used by any PVCs. Similarly, if an admin deletes a `VolumeSnapshotContent` that is bound to a `VolumeSnapshot`, the `VolumeSnapshotContent` is not removed immediately. Instead, the `VolumeSnapshotContent` removal is postponed until the `VolumeSnapshotContent` is not bound to the `VolumeSnapshot` object.

### VolumeSnapshotContent Deletion/Retain Policy

The Kubernetes snapshot APIs are similar to the PV/PVC APIs: just like a volume is represented by a bound PVC and PV pair, a snapshot is represented by a bound `VolumeSnapshot` and `VolumeSnapshotContent` pair.

With PV/PVC pairs, when a user is done with a volume, they can delete the PVC. And the reclaim policy on the PV determines what happens to the PV (whether it is also deleted or retained).

In the initial alpha release, snapshots did not support the ability to specify a reclaim policy. Instead when a snapshot object was deleted it always resulted in the snapshot being deleted. In Kubernetes v1.13, a snapshot content `DeletionPolicy` was added. It enables an admin to configure what happens to a `VolumeSnapshotContent` after the `VolumeSnapshot` object it is bound to is deleted. The `DeletionPolicy` of a volume snapshot can either be `Retain` or `Delete`. If the value is not specified, the default depends on whether the `VolumeSnapshotContent` object was created via static binding or dynamic provisioning.

#### Retain

The `Retain` policy allows for manual reclamation of the resource. If a `VolumeSnapshotContent` is statically created and bound, the default `DeletionPolicy` is `Retain`. When the `VolumeSnapshot` is deleted, the `VolumeSnapshotContent` continues to exist and the `VolumeSnapshotContent` is considered “released”. But it is not available for binding to other `VolumeSnapshot` objects because it contains data. It is up to an administrator to decide how to handle the remaining API object and resource cleanup.

#### Delete

A `Delete` policy enables automatic deletion of the bound `VolumeSnapshotContent` object from Kubernetes and the associated storage asset in the external infrastructure (such as an AWS EBS snapshot or GCE PD snapshot, etc.). Snapshots that are dynamically provisioned inherit the deletion policy of their `VolumeSnapshotClass`, which defaults to `Delete`. The administrator should configure the `VolumeSnapshotClass` with the desired retention policy. The policy may be changed for individual `VolumeSnapshotContent` after it is created by patching the object.

The following example demonstrates how to check the deletion policy of a dynamically provisioned `VolumeSnapshotContent`.

```
$ kubectl create -f ./examples/kubernetes/demo-defaultsnapshotclass.yaml
$ kubectl create -f ./examples/kubernetes/demo-snapshot.yaml
$ kubectl get volumesnapshots demo-snapshot-podpvc -o yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshot
metadata:
  creationTimestamp: "2018-11-27T23:57:09Z"
...
spec:
  snapshotClassName: default-snapshot-class
  snapshotContentName: snapcontent-26cd0db3-f2a0-11e8-8be6-42010a800002
  source:
    apiGroup: null
    kind: PersistentVolumeClaim
    name: podpvc
status:
…
$ kubectl get volumesnapshotcontent snapcontent-26cd0db3-f2a0-11e8-8be6-42010a800002 -o yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshotContent
…
spec:
  csiVolumeSnapshotSource:
    creationTime: 1546469777852000000
    driver: pd.csi.storage.gke.io
    restoreSize: 6442450944
    snapshotHandle: projects/jing-k8s-dev/global/snapshots/snapshot-26cd0db3-f2a0-11e8-8be6-42010a800002
  deletionPolicy: Delete
  persistentVolumeRef:
    apiVersion: v1
    kind: PersistentVolume
    name: pvc-853622a4-f28b-11e8-8be6-42010a800002
    resourceVersion: "21117"
    uid: ae400e9f-f28b-11e8-8be6-42010a800002
  snapshotClassName: default-snapshot-class
  volumeSnapshotRef:
    apiVersion: snapshot.storage.k8s.io/v1alpha1
    kind: VolumeSnapshot
    name: demo-snapshot-podpvc
    namespace: default
    resourceVersion: "6948065"
    uid: 26cd0db3-f2a0-11e8-8be6-42010a800002
```

User can change the deletion policy by using patch:

```
$ kubectl patch volumesnapshotcontent snapcontent-26cd0db3-f2a0-11e8-8be6-42010a800002 -p '{"spec":{"deletionPolicy":"Retain"}}' --type=merge

$ kubectl get volumesnapshotcontent snapcontent-26cd0db3-f2a0-11e8-8be6-42010a800002 -o yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshotContent
...
spec:
  csiVolumeSnapshotSource:
...
  deletionPolicy: Retain
  persistentVolumeRef:
    apiVersion: v1
    kind: PersistentVolume
    name: pvc-853622a4-f28b-11e8-8be6-42010a800002
...
```

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
