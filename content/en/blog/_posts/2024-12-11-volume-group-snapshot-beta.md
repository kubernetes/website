---
layout: blog
title: "Kubernetes 1.32: Moving Volume Group Snapshots to Beta"
date: 2024-12-11
slug: kubernetes-1-32-volume-group-snapshot-beta
draft: true
author: >
   Xing Yang (VMware by Broadcom)
---

Volume group snapshots were [introduced](/blog/2023/05/08/kubernetes-1-27-volume-group-snapshot-alpha/)
as an Alpha feature with the Kubernetes 1.27 release.
The recent release of Kubernetes v1.32 moved that support to **beta**.
The support for volume group snapshots relies on a set of
[extension APIs for group snapshots](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis).
These APIs allow users to take crash consistent snapshots for a set of volumes.
Behind the scenes, Kubernetes uses a label selector to group multiple PersistentVolumeClaims
for snapshotting.
A key aim is to allow you restore that set of snapshots to new volumes and
recover your workload based on a crash consistent recovery point.

This new feature is only supported for [CSI](https://kubernetes-csi.github.io/docs/) volume drivers.

## An overview of volume group snapshots

Some storage systems provide the ability to create a crash consistent snapshot of
multiple volumes. A group snapshot represents _copies_ made from multiple volumes, that
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

There was already a [VolumeSnapshot](/docs/concepts/storage/volume-snapshots/) API
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

However, sometimes the application quiesce can be so time consuming that you want to do it less frequently,
or it may not be possible to quiesce an application at all.
For example, a user may want to run weekly backups with application quiesce
and nightly backups without application quiesce but with consistent group support which
provides crash consistency across all volumes in the group.

## Kubernetes APIs for volume group snapshots

Kubernetes' support for _volume group snapshots_ relies on three API kinds that
are used
for managing snapshots:

VolumeGroupSnapshot
: Created by a Kubernetes user (or perhaps by your own automation) to request
creation of a volume group snapshot for multiple persistent volume claims.
It contains information about the volume group snapshot operation such as the
timestamp when the volume group snapshot was taken and whether it is ready to use.
The creation and deletion of this object represents a desire to create or delete a
cluster resource (a group snapshot).

VolumeGroupSnapshotContent
: Created by the snapshot controller for a dynamically created VolumeGroupSnapshot.
It contains information about the volume group snapshot including the volume group
snapshot ID.
This object represents a provisioned resource on the cluster (a group snapshot).
The VolumeGroupSnapshotContent object binds to the VolumeGroupSnapshot for which it
was created with a one-to-one mapping.

VolumeGroupSnapshotClass
: Created by cluster administrators to describe how volume group snapshots should be
created, including the driver information, the deletion policy, etc.

These three API kinds are defined as
[CustomResourceDefinitions](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
(CRDs).
These CRDs must be installed in a Kubernetes cluster for a CSI Driver to support
volume group snapshots.

## What components are needed to support volume group snapshots

Volume group snapshots are implemented in the
[external-snapshotter](https://github.com/kubernetes-csi/external-snapshotter) repository.
Implementing volume group snapshots meant adding or changing several components:

* Added new CustomResourceDefinitions for VolumeGroupSnapshot and two supporting APIs.
* Volume group snapshot controller logic is added to the common snapshot controller.
* Adding logic to make CSI calls into the snapshotter sidecar controller.

The volume snapshot controller and CRDs are deployed once per
cluster, while the sidecar is bundled with each CSI driver.

Therefore, it makes sense to deploy the volume snapshot controller and CRDs as a cluster addon.

The Kubernetes project recommends that Kubernetes distributors
bundle and deploy the volume snapshot controller and CRDs as part
of their Kubernetes cluster management process (independent of any CSI Driver).

## What's new in Beta?

* The VolumeGroupSnapshot feature in CSI spec moved to GA in the [v1.11.0 release](https://github.com/container-storage-interface/spec/releases/tag/v1.11.0).

* The snapshot validation webhook was deprecated in external-snapshotter v8.0.0 and it is now removed.
  Most of the validation webhook logic was added as validation rules into the CRDs.
  Minimum required Kubernetes version is 1.25 for these validation rules.
  One thing in the validation webhook not moved to CRDs is the prevention of creating
  multiple default volume snapshot classes and multiple default volume group snapshot classes
  for the same CSI driver.
  With the removal of the validation webhook, an error will still be raised when dynamically
  provisioning a VolumeSnapshot or VolumeGroupSnapshot when multiple default volume snapshot
  classes or multiple default volume group snapshot classes for the same CSI driver exist.

* The `enable-volumegroup-snapshot` flag in the snapshot-controller and the CSI snapshotter
  sidecar has been replaced by a feature gate.
  Since VolumeGroupSnapshot is a new API, the feature moves to Beta but the feature gate is
  disabled by default.
  To use this feature, enable the feature gate by adding the flag `--feature-gates=CSIVolumeGroupSnapshot=true`
  when starting the snapshot-controller and the CSI snapshotter sidecar.

* The logic to dynamically create the VolumeGroupSnapshot and its corresponding individual
  VolumeSnapshot and VolumeSnapshotContent objects are moved from the CSI snapshotter to the common
  snapshot-controller.
  New RBAC rules are added to the common snapshot-controller and some RBAC rules are removed from
  the CSI snapshotter sidecar accordingly.

## How do I use Kubernetes volume group snapshots

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
  together for snapshotting. This selector will be used to match the label
  added to a PVC.
* `volumeGroupSnapshotContentName` - specifies the name of a pre-existing
  VolumeGroupSnapshotContent object representing an existing volume group snapshot.

#### Dynamically provision a group snapshot

In the following example, there are two PVCs.

```console
NAME    STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS      VOLUMEATTRIBUTESCLASS   AGE
pvc-0   Bound    pvc-6e1f7d34-a5c5-4548-b104-01e72c72b9f2   100Mi      RWO            csi-hostpath-sc   <unset>                 2m15s
pvc-1   Bound    pvc-abc640b3-2cc1-4c56-ad0c-4f0f0e636efa   100Mi      RWO            csi-hostpath-sc   <unset>                 2m7s
```

Label the PVCs.
```console
% kubectl label pvc pvc-0 group=myGroup
persistentvolumeclaim/pvc-0 labeled

% kubectl label pvc pvc-1 group=myGroup
persistentvolumeclaim/pvc-1 labeled
```

For dynamic provisioning, a selector must be set so that the snapshot controller can find PVCs
with the matching labels to be snapshotted together.

```yaml
apiVersion: groupsnapshot.storage.k8s.io/v1beta1
kind: VolumeGroupSnapshot
metadata:
  name: snapshot-daily-20241217
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
A VolumGroupSnapshotClass is required for dynamic provisioning.

```yaml
apiVersion: groupsnapshot.storage.k8s.io/v1beta1
kind: VolumeGroupSnapshotClass
metadata:
  name: csi-groupSnapclass
  annotations:
    kubernetes.io/description: "Example group snapshot class"
driver: example.csi.k8s.io
deletionPolicy: Delete
```

As a result of the volume group snapshot creation, a corresponding VolumeGroupSnapshotContent
object will be created with a volumeGroupSnapshotHandle pointing to a resource on the storage
system.

Two individual volume snapshots will be created as part of the volume group snapshot creation.

```console
NAME                                                                        READYTOUSE   SOURCEPVC   RESTORESIZE   SNAPSHOTCONTENT                                                                AGE
snapshot-0962a745b2bf930bb385b7b50c9b08af471f1a16780726de19429dd9c94eaca0   true         pvc-0       100Mi         snapcontent-0962a745b2bf930bb385b7b50c9b08af471f1a16780726de19429dd9c94eaca0   16m
snapshot-da577d76bd2106c410616b346b2e72440f6ec7b12a75156263b989192b78caff   true         pvc-1       100Mi         snapcontent-da577d76bd2106c410616b346b2e72440f6ec7b12a75156263b989192b78caff   16m
```

#### Importing an existing group snapshot with Kubernetes

To import a pre-existing volume group snapshot into Kubernetes, you must also import
the corresponding individual volume snapshots.

Identify the individual volume snapshot handles, manually construct a
VolumeSnapshotContent object first, then create a VolumeSnapshot object pointing to
the VolumeSnapshotContent object. Repeat this for every individual volume snapshot.

Then manually create a VolumeGroupSnapshotContent object, specifying the
volumeGroupSnapshotHandle and individual volumeSnapshotHandles already existing
on the storage system.

```yaml
apiVersion: groupsnapshot.storage.k8s.io/v1beta1
kind: VolumeGroupSnapshotContent
metadata:
  name: static-group-content
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    groupSnapshotHandles:
      volumeGroupSnapshotHandle: e8779136-a93e-11ef-9549-66940726f2fd
      volumeSnapshotHandles:
      - e8779147-a93e-11ef-9549-66940726f2fd
      - e8783cd0-a93e-11ef-9549-66940726f2fd
  volumeGroupSnapshotRef:
    name: static-group-snapshot
    namespace: demo-namespace
```

After that create a VolumeGroupSnapshot object pointing to the VolumeGroupSnapshotContent
object.

```yaml
apiVersion: groupsnapshot.storage.k8s.io/v1beta1
kind: VolumeGroupSnapshot
metadata:
  name: static-group-snapshot
  namespace: demo-namespace
spec:
  source:
    volumeGroupSnapshotContentName: static-group-content
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
  name: examplepvc-restored-2024-12-17
  namespace: demo-namespace
spec:
  storageClassName: example-foo-nearline
  dataSource:
    name: snapshot-0962a745b2bf930bb385b7b50c9b08af471f1a16780726de19429dd9c94eaca0
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOncePod
  resources:
    requests:
      storage: 100Mi # must be enough storage to fit the existing snapshot
```

## As a storage vendor, how do I add support for group snapshots to my CSI driver?

To implement the volume group snapshot feature, a CSI driver **must**:

* Implement a new group controller service.
* Implement group controller RPCs: `CreateVolumeGroupSnapshot`, `DeleteVolumeGroupSnapshot`, and `GetVolumeGroupSnapshot`.
* Add group controller capability `CREATE_DELETE_GET_VOLUME_GROUP_SNAPSHOT`.

See the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md)
and the [Kubernetes-CSI Driver Developer Guide](https://kubernetes-csi.github.io/docs/)
for more details.

As mentioned earlier, it is strongly recommended that Kubernetes distributors
bundle and deploy the volume snapshot controller and CRDs as part
of their Kubernetes cluster management process (independent of any CSI Driver).

As part of this recommended deployment process, the Kubernetes team provides a number of
sidecar (helper) containers, including the
[external-snapshotter sidecar container](https://kubernetes-csi.github.io/docs/external-snapshotter.html)
which has been updated to support volume group snapshot.

The external-snapshotter watches the Kubernetes API server for
VolumeGroupSnapshotContent objects, and triggers `CreateVolumeGroupSnapshot` and
`DeleteVolumeGroupSnapshot` operations against a CSI endpoint.

## What are the limitations?

The beta implementation of volume group snapshots for Kubernetes has the following limitations:

* Does not support reverting an existing PVC to an earlier state represented by
  a snapshot (only supports provisioning a new volume from a snapshot).
* No application consistency guarantees beyond any guarantees provided by the storage system
  (e.g. crash consistency). See this [doc](https://github.com/kubernetes/community/blob/30d06f49fba22273f31b3c616b74cf8745c19b3d/wg-data-protection/data-protection-workflows-white-paper.md#quiesce-and-unquiesce-hooks)
  for more discussions on application consistency.

## What’s next?

Depending on feedback and adoption, the Kubernetes project plans to push the volume
group snapshot implementation to general availability (GA) in a future release.

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
to help the project reach beta:

* Ben Swartzlander ([bswartz](https://github.com/bswartz))
* Cici Huang ([cici37](https://github.com/cici37))
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
* Xing Yang ([xing-yang](https://github.com/xing-yang))
* Yati Padia ([yati1998](https://github.com/yati1998))

For those interested in getting involved with the design and development of CSI or
any part of the Kubernetes Storage system, join the
[Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).
We always welcome new contributors.

We also hold regular [Data Protection Working Group meetings](https://github.com/kubernetes/community/tree/master/wg-data-protection).
New attendees are welcome to join our discussions.
