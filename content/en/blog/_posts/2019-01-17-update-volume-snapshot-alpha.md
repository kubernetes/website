---
title: Update on Volume Snapshot Alpha for Kubernetes
date: 2019-01-17
---

**Authors:** Jing Xu (Google), Xing Yang (Huawei), Saad Ali (Google)

Volume snapshotting support was introduced in Kubernetes v1.12 as an alpha feature. In Kubernetes v1.13, it remains an alpha feature, but a few enhancements were added and some breaking changes were made. This post summarizes the changes.

## Breaking Changes

[CSI spec v1.0](https://github.com/container-storage-interface/spec/releases/tag/v1.0.0) introduced a few breaking changes to the volume snapshot feature. CSI driver maintainers should be aware of these changes as they upgrade their drivers to support v1.0.

## SnapshotStatus replaced with Boolean ReadyToUse

CSI v0.3.0, defined a `SnapshotStatus` enum in `CreateSnapshotResponse` which indicates whether the snapshot is `READY`, `UPLOADING`, or `ERROR_UPLOADING`. In CSI v1.0, `SnapshotStatus` has been removed from `CreateSnapshotResponse` and replaced with a `boolean ReadyToUse`. A `ReadyToUse` value of `true` indicates that post snapshot processing (such as uploading) is complete and the snapshot is ready to be used as a source to create a volume.

Storage systems that need to do post snapshot processing (such as uploading after the snapshot is cut) should return a successful `CreateSnapshotResponse` with the `ReadyToUse` field set to `false` as soon as the snapshot has been taken.  This indicates that the Container Orchestration System (CO) can resume any workload that was quiesced for the snapshot to be taken. The CO can then repeatedly call `CreateSnapshot` until the `ReadyToUse` field is set to `true` or the call returns an error indicating a problem in processing. The CSI `ListSnapshot` call could be used along with `snapshot_id` filtering to determine if the snapshot is ready to use, but is not recommended because it provides no way to detect errors during processing (the `ReadyToUse` field simply remains `false` indefinitely).

The [v1.x.x releases](https://github.com/kubernetes-csi/external-snapshotter/releases/tag/v1.0.1) of the CSI external-snapshotter sidecar container already handle this change by calling `CreateSnapshot` instead of `ListSnapshots` to check if a snapshot is ready to use. When upgrading their drivers to CSI 1.0, driver maintainers should use the appropriate 1.0 compatible sidecar container.

To be consistent with the change in the CSI spec, the `Ready` field in the `VolumeSnapshot` API object has been renamed to `ReadyToUse`. This change is visible to the user when running `kubectl describe volumesnapshot` to view the details of a snapshot.

## Timestamp Data Type

The creation time of a snapshot is available to Kubernetes admins as part of the `VolumeSnapshotContent` API object. This field is populated using the `creation_time` field in the CSI `CreateSnapshotResponse`. In CSI v1.0, this `creation_time` field type was changed to [`.google.protobuf.Timestamp`](https://godoc.org/github.com/golang/protobuf/ptypes/timestamp) instead of `int64`. When upgrading drivers to CSI 1.0, driver maintainers must make changes accordingly. The [v1.x.x releases](https://github.com/kubernetes-csi/external-snapshotter/releases/tag/v1.0.1) of the CSI external-snapshotter sidecar container has been updated to handle this change.

## Deprecations

The following `VolumeSnapshotClass` parameters are deprecated and will be removed in a future release.  They will be replaced with parameters listed in the `Replacement` section below.

Deprecated
Replacement
csiSnapshotterSecretName
csi.storage.k8s.io/snapshotter-secret-name
csiSnapshotterSecretNameSpace
csi.storage.k8s.io/snapshotter-secret-namespace

## New Features

### SnapshotContent Deletion/Retain Policy

As described in the [initial blog post announcing the snapshot alpha](https://kubernetes.io/blog/2018/10/09/introducing-volume-snapshot-alpha-for-kubernetes/), the Kubernetes snapshot APIs are similar to the PV/PVC APIs: just like a volume is represented by a bound PVC and PV pair, a snapshot is represented by a bound `VolumeSnapshot` and `VolumeSnapshotContent` pair.

With PV/PVC pairs, when a user is done with a volume, they can delete the PVC. And the reclaim policy on the PV determines what happens to the PV (whether it is also deleted or retained).

In the initial alpha release, snapshots did not support the ability to specify a reclaim policy. Instead when a snapshot object was deleted it always resulted in the snapshot being deleted.  In Kubernetes v1.13, a snapshot content `DeletionPolicy` was added. It enables an admin to configure what what happens to a `VolumeSnapshotContent` after the `VolumeSnapshot` object it is bound to is deleted. The `DeletionPolicy` of a volume snapshot can either be `Retain` or `Delete`. If the value is not specified, the default depends on whether the `SnapshotContent` object was created via static binding or dynamic provisioning.

### Retain

The `Retain` policy allows for manual reclamation of the resource. If a `VolumeSnapshotContent` is statically created and bound, the default `DeletionPolicy` is `Retain`. When the `VolumeSnapshot` is deleted, the `VolumeSnapshotContent` continues to exist and the `VolumeSnapshotContent` is considered “released”. But it is not available for binding to other `VolumeSnapshot` objects because it contains data. It is up to an administrator to decide how to handle the remaining API object and resource cleanup.

### Delete

A `Delete` policy enables automatic deletion of the bound `VolumeSnapshotContent` object from Kubernetes and the associated storage asset in the external infrastructure (such as an AWS EBS snapshot or GCE PD snapshot, etc.). Snapshots that are dynamically provisioned inherit the deletion policy of their [`VolumeSnapshotClass`](/docs/concepts/storage/volume-snapshot-classes/), which defaults to `Delete`. The administrator should configure the `VolumeSnapshotClass` with the desired retention policy. The policy may be changed for individual `VolumeSnapshotContent` after it is created by patching the object.

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

## Snapshot Object in Use Protection

The purpose of the Snapshot Object in Use Protection feature is to ensure that in-use snapshot API objects are not removed from the system (as this may result in data loss). There are two cases that require “in-use” protection:

1. If a volume snapshot is in active use by a persistent volume claim as a source to create a volume.
2. If a `VolumeSnapshotContent` API object is bound to a VolumeSnapshot API object, the content object is considered in use.

If a user deletes a `VolumeSnapshot` API object in active use by a PVC, the `VolumeSnapshot` object is not removed immediately. Instead, removal of the `VolumeSnapshot` object is postponed until the `VolumeSnapshot` is no longer actively used by any PVCs. Similarly, if an admin deletes a `VolumeSnapshotContent` that is bound to a `VolumeSnapshot`, the `VolumeSnapshotContent` is not removed immediately. Instead, the `VolumeSnapshotContent` removal is postponed until the `VolumeSnapshotContent` is not bound to the `VolumeSnapshot` object.

## Which volume plugins support Kubernetes Snapshots?

Snapshots are only supported for CSI drivers (not for in-tree or FlexVolume). To use the Kubernetes snapshots feature, ensure that a CSI Driver that implements snapshots is deployed on your cluster.

As of the publishing of this blog post, the following CSI drivers support snapshots:

- [GCE Persistent Disk CSI Driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
- [OpenSDS CSI Driver](https://github.com/opensds/nbp/tree/master/csi/server)
- [Ceph RBD CSI Driver](https://github.com/ceph/ceph-csi/tree/master/pkg/rbd)
- [Portworx CSI Driver](https://github.com/libopenstorage/openstorage/tree/master/csi)
- [GlusterFS CSI Driver](https://github.com/gluster/gluster-csi-driver)
- [Digital Ocean CSI Driver](https://github.com/digitalocean/csi-digitalocean)
- [Ember CSI Driver](https://github.com/embercsi/ember-csi)
- [Cinder CSI Driver](https://github.com/kubernetes/cloud-provider-openstack/tree/master/pkg/csi/cinder)
- [Datera CSI Driver](https://github.com/Datera/datera-csi)
- [NexentaStor CSI Driver](https://github.com/Nexenta/nexentastor-csi-driver)

Snapshot support for other [drivers](https://kubernetes-csi.github.io/docs/Drivers.html) is pending, and should be available soon. Read the “Container Storage Interface (CSI) for Kubernetes GA” blog post to learn more about CSI and how to deploy CSI drivers.

## What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the CSI Snapshot implementation to beta in either 1.15 or 1.16. Some of the features we are interested in supporting include consistency groups, application consistent snapshots, workload quiescing, in-place restores, and more.

## How can I learn more?

The code repository for snapshot APIs and controller is here: https://github.com/kubernetes-csi/external-snapshotter

Check out additional documentation on the snapshot feature here: http://k8s.io/docs/concepts/storage/volume-snapshots and https://kubernetes-csi.github.io/docs/

## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together.

Special thanks to all the contributors that helped add CSI v1.0 support and improve the snapshot feature in this release, including Saad Ali ([saadali](https://github.com/saadali)), Michelle Au ([msau42](https://github.com/msau42)), Deep Debroy ([ddebroy](https://github.com/ddebroy)), James DeFelice ([jdef](https://github.com/jdef)), John Griffith ([j-griffith](https://github.com/j-griffith)), Julian Hjortshoj ([julian-hj](https://github.com/julian-hj)), Tim Hockin ([thockin](https://github.com/thockin)), Patrick Ohly ([pohly](https://github.com/pohly)), Luis Pabon ([lpabon](https://github.com/lpabon)), Cheng Xing ([verult](https://github.com/verult)), Jing Xu ([jingxu97](https://github.com/jingxu97)), Shiwei Xu ([wackxu](https://github.com/wackxu)), Xing Yang ([xing-yang](https://github.com/xing-yang)), Jie Yu ([jieyu](https://github.com/jieyu)), David Zhu ([davidz627](https://github.com/davidz627)).

Those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.

We also hold regular [SIG-Storage Snapshot Working Group meetings](https://docs.google.com/document/d/1qdfvAj5O-tTAZzqJyz3B-yczLLxOiQd-XKpJmTEMazs/edit?usp=sharing). New attendees are welcome to join for design and development discussions.
