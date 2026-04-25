---
layout: blog
title: "Kubernetes v1.36: Moving Volume Group Snapshots to GA"
date: 2026-04-22T10:30:00-08:00
draft: true
slug: kubernetes-v1-36-volume-group-snapshot-ga
author: >
   Xing Yang (VMware by Broadcom)
---

Volume group snapshots were [introduced](/blog/2023/05/08/kubernetes-1-27-volume-group-snapshot-alpha/) as an Alpha feature with the Kubernetes v1.27 release, moved to [Beta](/blog/2024/12/18/kubernetes-1-32-volume-group-snapshot-beta/) in v1.32, and to a [second Beta](/blog/2025/09/16/kubernetes-v1-34-volume-group-snapshot-beta-2/) in v1.34. We are excited to announce that in the Kubernetes v1.36 release, support for volume group snapshots has reached **General Availability (GA)**.

The support for volume group snapshots relies on a set of [extension APIs for group snapshots](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis). These APIs allow users to take crash-consistent snapshots for a set of volumes. Behind the scenes, Kubernetes uses a label selector to group multiple `PersistentVolumeClaim` objects for snapshotting. A key aim is to allow you to restore that set of snapshots to new volumes and recover your workload based on a crash-consistent recovery point.

This feature is only supported for [CSI](https://kubernetes-csi.github.io/docs/) volume drivers.

## An overview of volume group snapshots

Some storage systems provide the ability to create a crash-consistent snapshot of multiple volumes. A group snapshot represents _copies_ made from multiple volumes that are taken at the same point-in-time. A group snapshot can be used either to rehydrate new volumes (pre-populated with the snapshot data) or to restore existing volumes to a previous state (represented by the snapshots).

### Why add volume group snapshots to Kubernetes?

The Kubernetes volume plugin system already provides a powerful abstraction that automates the provisioning, attaching, mounting, resizing, and snapshotting of block and file storage. Underpinning all these features is the Kubernetes goal of workload portability.

There was already a [VolumeSnapshot](/docs/concepts/storage/volume-snapshots/) API that provides the ability to take a snapshot of a persistent volume to protect against data loss or data corruption. However, some storage systems support consistent group snapshots that allow a snapshot to be taken from multiple volumes at the same point-in-time to achieve write order consistency. This is extremely useful for applications that contain multiple volumes. For example, an application may have data stored in one volume and logs stored in another. If snapshots for these volumes are taken at different times, the application will not be consistent and will not function properly if restored from those snapshots.

While you can quiesce the application first and take individual snapshots sequentially, this process can be time-consuming or sometimes impossible. Consistent group support provides crash consistency across all volumes in the group without the need for application quiescence.

### Kubernetes APIs for volume group snapshots

Kubernetes' support for volume group snapshots relies on three API kinds that are used for managing snapshots:

VolumeGroupSnapshot
: Created by a Kubernetes user (or automation) to request creation of a volume group snapshot for multiple persistent volume claims.

VolumeGroupSnapshotContent
: Created by the snapshot controller for a dynamically created VolumeGroupSnapshot. It contains information about the provisioned cluster resource (a group snapshot). The object binds to the VolumeGroupSnapshot for which it was created with a one-to-one mapping.

VolumeGroupSnapshotClass
: Created by cluster administrators to describe how volume group snapshots should be created, including the driver information, the deletion policy, etc.

These three API kinds are defined as CustomResourceDefinitions (CRDs). For the GA release, the API version has been promoted to `v1`.

## What's new in GA?

* The API version for `VolumeGroupSnapshot`, `VolumeGroupSnapshotContent`, and `VolumeGroupSnapshotClass` is promoted to `groupsnapshot.storage.k8s.io/v1`.
* Enhanced stability and bug fixes based on feedback from the beta releases, including the improvements introduced in v1beta2 for accurate `restoreSize` reporting.

## How do I use Kubernetes volume group snapshots

### Creating a new group snapshot with Kubernetes

Once a `VolumeGroupSnapshotClass` object is defined and you have volumes you want to snapshot together, you may request a new group snapshot by creating a `VolumeGroupSnapshot` object.

Label the PVCs you wish to group:
```console
% kubectl label pvc pvc-0 group=myGroup
persistentvolumeclaim/pvc-0 labeled

% kubectl label pvc pvc-1 group=myGroup
persistentvolumeclaim/pvc-1 labeled
```

For dynamic provisioning, a selector must be set so that the snapshot controller can find PVCs with the matching labels to be snapshotted together.

```yaml
apiVersion: groupsnapshot.storage.k8s.io/v1
kind: VolumeGroupSnapshot
metadata:
  name: snapshot-daily-20260422
  namespace: demo-namespace
spec:
  volumeGroupSnapshotClassName: csi-groupSnapclass
  source:
    selector:
      matchLabels:
        group: myGroup
```

The `VolumeGroupSnapshotClass` is required for dynamic provisioning:

```yaml
apiVersion: groupsnapshot.storage.k8s.io/v1
kind: VolumeGroupSnapshotClass
metadata:
  name: csi-groupSnapclass
driver: example.csi.k8s.io
deletionPolicy: Delete
```

### How to use group snapshot for restore

At restore time, request a new `PersistentVolumeClaim` to be created from a `VolumeSnapshot` object that is part of a `VolumeGroupSnapshot`. Repeat this for all volumes that are part of the group snapshot.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: examplepvc-restored-2026-04-22
  namespace: demo-namespace
spec:
  storageClassName: example-sc
  dataSource:
    name: snapshot-0962a745b2bf930bb385b7b50c9b08af471f1a16780726de19429dd9c94eaca0
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOncePod
  resources:
    requests:
      storage: 100Mi
```

## As a storage vendor, how do I add support for group snapshots?

To implement the volume group snapshot feature, a CSI driver **must**:

* Implement a new group controller service.
* Implement group controller RPCs: `CreateVolumeGroupSnapshot`, `DeleteVolumeGroupSnapshot`, and `GetVolumeGroupSnapshot`.
* Add group controller capability `CREATE_DELETE_GET_VOLUME_GROUP_SNAPSHOT`.

See the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md) and the [Kubernetes-CSI Driver Developer Guide](https://kubernetes-csi.github.io/docs/) for more details. 

## How can I learn more?

- The [design spec](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot) for the volume group snapshot feature.
- The [code repository](https://github.com/kubernetes-csi/external-snapshotter) for volume group snapshot APIs and controller.
- CSI [documentation](https://kubernetes-csi.github.io/docs/) on the group snapshot feature.

## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together. On behalf of SIG Storage, I would like to offer a huge thank you to all the contributors who stepped up over the years to help the project reach GA:

* Ben Swartzlander ([bswartz](https://github.com/bswartz))
* Cici Huang ([cici37](https://github.com/cici37))
* Darshan Murthy ([darshansreenivas](https://github.com/darshansreenivas))
* Hemant Kumar ([gnufied](https://github.com/gnufied))
* James Defelice ([jdef](https://github.com/jdef))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Madhu Rajanna ([Madhu-1](https://github.com/Madhu-1))
* Manish M Yathnalli ([manishym](https://github.com/manishym))
* Michelle Au ([msau42](https://github.com/msau42))
* Niels de Vos ([nixpanic](https://github.com/nixpanic))
* Leonardo Cecchi ([leonardoce](https://github.com/leonardoce))
* Rakshith R ([Rakshith-R](https://github.com/Rakshith-R))
* Raunak Shah ([RaunakShah](https://github.com/RaunakShah))
* Saad Ali ([saad-ali](https://github.com/saad-ali))
* Wei Duan ([duanwei33](https://github.com/duanwei33))
* Xing Yang ([xing-yang](https://github.com/xing-yang))
* Yati Padia ([yati1998](https://github.com/yati1998))

For those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We always welcome new contributors.

We also hold regular [Data Protection Working Group meetings](https://github.com/kubernetes/community/tree/master/wg-data-protection). New attendees are welcome to join our discussions.
