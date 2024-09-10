---
layout: blog
title: "Kubernetes 1.27: Introducing An API For Volume Group Snapshots"
date: 2023-05-08
slug: kubernetes-1-27-volume-group-snapshot-alpha
author: >
   Xing Yang (VMware)
---

Volume group snapshot is introduced as an Alpha feature in Kubernetes v1.27.
This feature introduces a Kubernetes API that allows users to take crash consistent
snapshots for multiple volumes together. It uses a label selector to group multiple
`PersistentVolumeClaims` for snapshotting.
This new feature is only supported for [CSI](https://kubernetes-csi.github.io/docs/) volume drivers.

## An overview of volume group snapshots

Some storage systems provide the ability to create a crash consistent snapshot of
multiple volumes. A group snapshot represents “copies” from multiple volumes that
are taken at the same point-in-time. A group snapshot can be used either to rehydrate
new volumes (pre-populated with the snapshot data) or to restore existing volumes to
a previous state (represented by the snapshots).

## Why add volume group snapshots to Kubernetes?

The Kubernetes volume plugin system already provides a powerful abstraction that
automates the provisioning, attaching, mounting, resizing, and snapshotting of block
and file storage.

Underpinning all these features is the Kubernetes goal of workload portability:
Kubernetes aims to create an abstraction layer between distributed applications and
underlying clusters so that applications can be agnostic to the specifics of the
cluster they run on and application deployment requires no cluster specific knowledge.

There is already a [VolumeSnapshot](/docs/concepts/storage/volume-snapshots/) API
that provides the ability to take a snapshot of a persistent volume to protect against
data loss or data corruption. However, there are other snapshotting functionalities
not covered by the VolumeSnapshot API.

Some storage systems support consistent group snapshots that allow a snapshot to be
taken from multiple volumes at the same point-in-time to achieve write order consistency.
This can be useful for applications that contain multiple volumes. For example,
an application may have data stored in one volume and logs stored in another volume.
If snapshots for the data volume and the logs volume are taken at different times,
the application will not be consistent and will not function properly if it is restored
from those snapshots when a disaster strikes.

It is true that you can quiesce the application first, take an individual snapshot from
each volume that is part of the application one after the other, and then unquiesce the
application after all the individual snapshots are taken. This way, you would get
application consistent snapshots.

However, sometimes it may not be possible to quiesce an application or the application
quiesce can be too expensive so you want to do it less frequently. Taking individual
snapshots one after another may also take longer time compared to taking a consistent
group snapshot. Some users may not want to do application quiesce very often for these
reasons. For example, a user may want to run weekly backups with application quiesce
and nightly backups without application quiesce but with consistent group support which
provides crash consistency across all volumes in the group.

## Kubernetes Volume Group Snapshots API

Kubernetes Volume Group Snapshots introduce [three new API
objects](https://github.com/kubernetes-csi/external-snapshotter/blob/master/client/apis/volumegroupsnapshot/v1alpha1/types.go)
for managing snapshots:

`VolumeGroupSnapshot`
: Created by a Kubernetes user (or perhaps by your own automation) to request
creation of a volume group snapshot for multiple persistent volume claims.
It contains information about the volume group snapshot operation such as the
timestamp when the volume group snapshot was taken and whether it is ready to use.
The creation and deletion of this object represents a desire to create or delete a
cluster resource (a group snapshot).

`VolumeGroupSnapshotContent`
: Created by the snapshot controller for a dynamically created VolumeGroupSnapshot.
It contains information about the volume group snapshot including the volume group
snapshot ID.
This object represents a provisioned resource on the cluster (a group snapshot).
The VolumeGroupSnapshotContent object binds to the VolumeGroupSnapshot for which it
was created with a one-to-one mapping.

`VolumeGroupSnapshotClass`
: Created by cluster administrators to describe how volume group snapshots should be
created. including the driver information, the deletion policy, etc.

These three API kinds are defined as CustomResourceDefinitions (CRDs).
These CRDs must be installed in a Kubernetes cluster for a CSI Driver to support
volume group snapshots.

## How do I use Kubernetes Volume Group Snapshots

Volume group snapshots are implemented in the
[external-snapshotter](https://github.com/kubernetes-csi/external-snapshotter) repository. Implementing volume
group snapshots meant adding or changing several components:

* Added new CustomResourceDefinitions for VolumeGroupSnapshot and two supporting APIs.
* Volume group snapshot controller logic is added to the common snapshot controller.
* Volume group snapshot validation webhook logic is added to the common snapshot validation webhook.
* Adding logic to make CSI calls into the snapshotter sidecar controller.

The volume snapshot controller, CRDs, and validation webhook are deployed once per
cluster, while the sidecar is bundled with each CSI driver.

Therefore, it makes sense to deploy the volume snapshot controller, CRDs, and validation
webhook as a cluster addon. I strongly recommend that Kubernetes distributors
bundle and deploy the volume snapshot controller, CRDs, and validation webhook as part
of their Kubernetes cluster management process (independent of any CSI Driver).

### Creating a new group snapshot with Kubernetes

Once a VolumeGroupSnapshotClass object is defined and you have volumes you want to
snapshot together, you may request a new group snapshot by creating a VolumeGroupSnapshot
object.

The source of the group snapshot specifies whether the underlying group snapshot
should be dynamically created or if a pre-existing VolumeGroupSnapshotContent
should be used.

A pre-existing VolumeGroupSnapshotContent is created by a cluster administrator.
It contains the details of the real volume group snapshot on the storage system which
is available for use by cluster users.

One of the following members in the source of the group snapshot must be set.

* `selector` - a label query over PersistentVolumeClaims that are to be grouped
  together for snapshotting. This labelSelector will be used to match the label
  added to a PVC.
* `volumeGroupSnapshotContentName` - specifies the name of a pre-existing
  VolumeGroupSnapshotContent object representing an existing volume group snapshot.

In the following example, there are two PVCs.

```yaml
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
pvc-0       Bound     pvc-a42d7ea2-e3df-11ed-b5ea-0242ac120002   1Gi        RWO           48s
pvc-1       Bound     pvc-a42d81b8-e3df-11ed-b5ea-0242ac120002   1Gi        RWO           48s
```

Label the PVCs.
```yaml
% kubectl label pvc pvc-0 group=myGroup
persistentvolumeclaim/pvc-0 labeled

% kubectl label pvc pvc-1 group=myGroup
persistentvolumeclaim/pvc-1 labeled
```

For dynamic provisioning, a selector must be set so that the snapshot controller can
find PVCs with the matching labels to be snapshotted together.

```yaml
apiVersion: groupsnapshot.storage.k8s.io/v1alpha1
kind: VolumeGroupSnapshot
metadata:
  name: new-group-snapshot-demo
  namespace: demo-namespace
spec:
  volumeGroupSnapshotClassName: csi-groupSnapclass
  source:
    selector:
      matchLabels:
        group: myGroup
```

In the VolumeGroupSnapshot spec, a user can specify the VolumeGroupSnapshotClass which
has the information about which CSI driver should be used for creating the group snapshot.

Two individual volume snapshots will be created as part of the volume group snapshot creation.

```yaml
snapshot-62abb5db7204ac6e4c1198629fec533f2a5d9d60ea1a25f594de0bf8866c7947-2023-04-26-2.20.4
snapshot-2026811eb9f0787466171fe189c805a22cdb61a326235cd067dc3a1ac0104900-2023-04-26-2.20.4
```

### How to use group snapshot for restore in Kubernetes

At restore time, the user can request a new PersistentVolumeClaim to be created from
a VolumeSnapshot object that is part of a VolumeGroupSnapshot. This will trigger
provisioning of a new volume that is pre-populated with data from the specified
snapshot. The user should repeat this until all volumes are created from all the
snapshots that are part of a group snapshot.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc0-restore
  namespace: demo-namespace
spec:
  storageClassName: csi-hostpath-sc
  dataSource:
    name: snapshot-62abb5db7204ac6e4c1198629fec533f2a5d9d60ea1a25f594de0bf8866c7947-2023-04-26-2.20.4
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

## As a storage vendor, how do I add support for group snapshots to my CSI driver?

To implement the volume group snapshot feature, a CSI driver **must**:

* Implement a new group controller service.
* Implement group controller RPCs: `CreateVolumeGroupSnapshot`, `DeleteVolumeGroupSnapshot`, and `GetVolumeGroupSnapshot`.
* Add group controller capability `CREATE_DELETE_GET_VOLUME_GROUP_SNAPSHOT`.

See the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md)
and the [Kubernetes-CSI Driver Developer Guide](https://kubernetes-csi.github.io/docs/)
for more details.

a CSI Volume Driver as possible, it provides a suggested mechanism to deploy a
containerized CSI driver to simplify the process.

As part of this recommended deployment process, the Kubernetes team provides a number of
sidecar (helper) containers, including the
[external-snapshotter sidecar container](https://kubernetes-csi.github.io/docs/external-snapshotter.html)
which has been updated to support volume group snapshot.

The external-snapshotter watches the Kubernetes API server for the
`VolumeGroupSnapshotContent` object and triggers `CreateVolumeGroupSnapshot` and
`DeleteVolumeGroupSnapshot` operations against a CSI endpoint.

## What are the limitations?

The alpha implementation of volume group snapshots for Kubernetes has the following
limitations:

* Does not support reverting an existing PVC to an earlier state represented by
  a snapshot (only supports provisioning a new volume from a snapshot).
* No application consistency guarantees beyond any guarantees provided by the storage system
  (e.g. crash consistency). See this [doc](https://github.com/kubernetes/community/blob/master/wg-data-protection/data-protection-workflows-white-paper.md#quiesce-and-unquiesce-hooks)
  for more discussions on application consistency.

## What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the CSI
Group Snapshot implementation to Beta in either 1.28 or 1.29.
Some of the features we are interested in supporting include volume replication,
replication group, volume placement, application quiescing, changed block tracking, and more.

## How can I learn more?

- The [design spec](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3476-volume-group-snapshot)
  for the volume group snapshot feature.
- The [code repository](https://github.com/kubernetes-csi/external-snapshotter) for volume group
  snapshot APIs and controller.
- CSI [documentation](https://kubernetes-csi.github.io/docs/) on the group snapshot feature.

## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors
from diverse backgrounds working together. On behalf of SIG Storage, I would like to
offer a huge thank you to the contributors who stepped up these last few quarters
to help the project reach alpha:

* Alex Meade ([ameade](https://github.com/ameade))
* Ben Swartzlander ([bswartz](https://github.com/bswartz))
* Humble Devassy Chirammal ([humblec](https://github.com/humblec))
* James Defelice ([jdef](https://github.com/jdef))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Jing Xu ([jingxu97](https://github.com/jingxu97))
* Michelle Au ([msau42](https://github.com/msau42))
* Niels de Vos ([nixpanic](https://github.com/nixpanic))
* Rakshith R ([Rakshith-R](https://github.com/Rakshith-R))
* Raunak Shah ([RaunakShah](https://github.com/RaunakShah))
* Saad Ali ([saad-ali](https://github.com/saad-ali))
* Thomas Watson ([rbo54](https://github.com/rbo54))
* Xing Yang ([xing-yang](https://github.com/xing-yang))
* Yati Padia ([yati1998](https://github.com/yati1998))

We also want to thank everyone else who has contributed to the project, including others 
who helped review the [KEP](https://github.com/kubernetes/enhancements/pull/1551)
and the [CSI spec PR](https://github.com/container-storage-interface/spec/pull/519).

For those interested in getting involved with the design and development of CSI or
any part of the Kubernetes Storage system, join the
[Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
We always welcome new contributors.

We also hold regular [Data Protection Working Group meetings](https://docs.google.com/document/d/15tLCV3csvjHbKb16DVk-mfUmFry_Rlwo-2uG6KNGsfw/edit#).
New attendees are welcome to join our discussions.
