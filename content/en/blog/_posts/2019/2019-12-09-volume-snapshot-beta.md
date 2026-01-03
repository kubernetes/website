---
layout: blog
title: "Kubernetes 1.17 Feature: Kubernetes Volume Snapshot Moves to Beta"
date: 2019-12-09T10:00:00-08:00
slug: kubernetes-1-17-feature-cis-volume-snapshot-beta
author: >
  Xing Yang (VMware),
  Xiangqian Yu (Google)
---

The Kubernetes Volume Snapshot feature is now beta in Kubernetes v1.17. It was introduced [as alpha](https://kubernetes.io/blog/2018/10/09/introducing-volume-snapshot-alpha-for-kubernetes/) in Kubernetes v1.12, with a [second alpha](https://kubernetes.io/blog/2019/01/17/update-on-volume-snapshot-alpha-for-kubernetes/) with breaking changes in Kubernetes v1.13.  This post summarizes the changes in the beta release.

## What is a Volume Snapshot?

Many storage systems (like Google Cloud Persistent Disks, Amazon Elastic Block Storage, and many on-premise storage systems) provide the ability to create a “snapshot” of a persistent volume. A snapshot represents a point-in-time copy of a volume. A snapshot can be used either to provision a new volume (pre-populated with the snapshot data) or to restore an existing volume to a previous state (represented by the snapshot).

## Why add Volume Snapshots to Kubernetes?

The Kubernetes volume plugin system already provides a powerful abstraction that automates the provisioning, attaching, and mounting of block and file storage.

Underpinning all these features is the Kubernetes goal of workload portability: Kubernetes aims to create an abstraction layer between distributed applications and underlying clusters so that applications can be agnostic to the specifics of the cluster they run on and application deployment requires no “cluster specific” knowledge.

The Kubernetes Storage SIG identified snapshot operations as critical functionality for many stateful workloads. For example, a database administrator may want to snapshot a database volume before starting a database operation.

By providing a standard way to trigger snapshot operations in the Kubernetes API, Kubernetes users can now handle use cases like this without having to go around the Kubernetes API (and manually executing storage system specific operations).

Instead, Kubernetes users are now empowered to incorporate snapshot operations in a cluster agnostic way into their tooling and policy with the comfort of knowing that it will work against arbitrary Kubernetes clusters regardless of the underlying storage.

Additionally these Kubernetes snapshot primitives act as basic building blocks that unlock the ability to develop advanced, enterprise grade, storage administration features for Kubernetes: including application or cluster level backup solutions.

## What’s new in Beta?

With the promotion of Volume Snapshot to beta, the feature is now enabled by default on standard Kubernetes deployments instead of being opt-in.

The move of the Kubernetes Volume Snapshot feature to beta also means:

- A revamp of volume snapshot APIs.
- The CSI external-snapshotter sidecar is split into two controllers, a common snapshot controller and a CSI external-snapshotter sidecar.
- Deletion secret is added as an annotation to the volume snapshot content.
- A new finalizer is added to the volume snapshot API object to prevent it from being deleted when it is bound to a volume snapshot content API object.

## Kubernetes Volume Snapshots Requirements

As mentioned above, with the promotion of Volume Snapshot to beta, the feature is now enabled by default on standard Kubernetes deployments instead of being opt-in.

In order to use the Kubernetes Volume Snapshot feature, you must ensure the following components have been deployed on your Kubernetes cluster:

- [Kubernetes Volume Snapshot CRDs](https://github.com/kubernetes-csi/external-snapshotter/tree/53469c21962339229dd150cbba50c34359acec73/config/crd)
- [Volume snapshot controller](https://github.com/kubernetes-csi/external-snapshotter/tree/master/pkg/common-controller)
- CSI Driver supporting Kubernetes volume snapshot beta

See the deployment section below for details.

## Which drivers support Kubernetes Volume Snapshots?

Kubernetes supports three types of volume plugins: in-tree, Flex, and CSI. See [Kubernetes Volume Plugin FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md) for details.

Snapshots are only supported for CSI drivers (not for in-tree or Flex). To use the Kubernetes snapshots feature, ensure that a CSI Driver that implements snapshots is deployed on your cluster.

Read the “[Container Storage Interface (CSI) for Kubernetes GA](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/)” blog post to learn more about CSI and how to deploy CSI drivers.

As of the publishing of this blog, the following CSI drivers have been updated to support volume snapshots beta:

- [GCE Persistent Disk CSI Driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
- [Portworx CSI Driver](https://github.com/libopenstorage/openstorage/tree/master/csi)
- [NetApp Trident CSI Driver](https://github.com/NetApp/trident)

Beta level Volume Snapshot support for other [CSI drivers](https://kubernetes-csi.github.io/docs/drivers.html) is pending, and should be available soon.

## Kubernetes Volume Snapshot Beta API

A number of changes were made to the Kubernetes volume snapshot API between alpha to beta. These changes are not backward compatible. The purpose of these changes was to make API definitions clear and easier to use.

The following changes are made:

- `DeletionPolicy` is now a required field rather than optional in both `VolumeSnapshotClass` and `VolumeSnapshotContent`. This way the user has to explicitly specify it, leaving no room for confusion.
- `VolumeSnapshotSpec` has a new required `Source` field. `Source` may be either a `PersistentVolumeClaimName` (if dynamically provisioning a snapshot) or `VolumeSnapshotContentName` (if pre-provisioning a snapshot).
- `VolumeSnapshotContentSpec` also has a new required `Source` field. This `Source` may be either a `VolumeHandle` (if dynamically provisioning a snapshot) or a `SnapshotHandle` (if pre-provisioning volume snapshots).
- `VolumeSnapshotStatus` now contains a `BoundVolumeSnapshotContentName` to indicate the `VolumeSnapshot` object is bound to a `VolumeSnapshotContent`.
- `VolumeSnapshotContent`now contains a `Status` to indicate the current state of the content. It has a field `SnapshotHandle` to indicate that the `VolumeSnapshotContent` represents a snapshot on the storage system.

The beta Kubernetes VolumeSnapshot API object:

```go
type VolumeSnapshot struct {
        metav1.TypeMeta
        metav1.ObjectMeta

        Spec VolumeSnapshotSpec
        Status *VolumeSnapshotStatus
}
```

```go
type VolumeSnapshotSpec struct {
	Source VolumeSnapshotSource
	VolumeSnapshotClassName *string
}
// Exactly one of its members MUST be specified
type VolumeSnapshotSource struct {
	// +optional
	PersistentVolumeClaimName *string
	// +optional
	VolumeSnapshotContentName *string
}
```

```go
type VolumeSnapshotStatus struct {
	BoundVolumeSnapshotContentName *string
	CreationTime *metav1.Time
	ReadyToUse *bool
	RestoreSize *resource.Quantity
	Error *VolumeSnapshotError
}
```


The beta Kubernetes VolumeSnapshotContent API object:

```go
type VolumeSnapshotContent struct {
        metav1.TypeMeta
        metav1.ObjectMeta

        Spec VolumeSnapshotContentSpec
        Status *VolumeSnapshotContentStatus
}
```

```go
type VolumeSnapshotContentSpec struct {
         VolumeSnapshotRef core_v1.ObjectReference
         Source VolumeSnapshotContentSource
         DeletionPolicy DeletionPolicy
         Driver string
         VolumeSnapshotClassName *string
}
```

```go
type VolumeSnapshotContentSource struct {
	// +optional
	VolumeHandle *string
	// +optional
	SnapshotHandle *string
}
```

```go
type VolumeSnapshotContentStatus struct {
  CreationTime *int64
  ReadyToUse *bool
  RestoreSize *int64
  Error *VolumeSnapshotError
  SnapshotHandle *string
}
```

The beta Kubernetes VolumeSnapshotClass API object:

```go
type VolumeSnapshotClass struct {
        metav1.TypeMeta
        metav1.ObjectMeta

        Driver string
        Parameters map[string]string
        DeletionPolicy DeletionPolicy
}
```

### How do I deploy support for Volume Snapshots on my Kubernetes Cluster?

Please note that the Volume Snapshot feature now depends on a new, common [volume snapshot controller](https://github.com/kubernetes-csi/external-snapshotter/tree/master/pkg/common-controller) in addition to the volume snapshot CRDs. Both the volume snapshot controller and the CRDs are independent of any CSI driver. Regardless of the number of CSI drivers deployed on the cluster, there must be only one instance of the volume snapshot controller running and one set of volume snapshot CRDs installed per cluster.

Therefore, it is strongly recommended that Kubernetes distributors bundle and deploy the controller and CRDs as part of their Kubernetes cluster management process (independent of any CSI Driver).

If your cluster does not come pre-installed with the correct components, you may manually install these components by executing the following steps.

#### Install Snapshot Beta CRDs

- `kubectl create -f config/crd`
- [https://github.com/kubernetes-csi/external-snapshotter/tree/53469c21962339229dd150cbba50c34359acec73/config/crd](https://github.com/kubernetes-csi/external-snapshotter/tree/53469c21962339229dd150cbba50c34359acec73/config/crd)
- Do this once per cluster


#### Install Common Snapshot Controller

- `kubectl create -f deploy/kubernetes/snapshot-controller`
- [https://github.com/kubernetes-csi/external-snapshotter/tree/master/deploy/kubernetes/snapshot-controller](https://github.com/kubernetes-csi/external-snapshotter/tree/master/deploy/kubernetes/snapshot-controller)
- Do this once per cluster

#### Install CSI Driver

Follow instructions provided by your CSI Driver vendor.

### How do I use Kubernetes Volume Snapshots?

Assuming all the required components (including CSI driver) are already deployed and running on your cluster, you can create volume snapshots using the VolumeSnapshot API object, and restore them by specifying a VolumeSnapshot data source on a PVC.

#### Creating a New Volume Snapshot with Kubernetes

You can enable creation/deletion of volume snapshots in a Kubernetes cluster, by creating a VolumeSnapshotClass API object pointing to a CSI Driver that support volume snapshots.

The following VolumeSnapshotClass, for example, tells the Kubernetes cluster that a CSI driver, `testdriver.csi.k8s.io`, can handle volume snapshots, and that when these snapshots are created, their deletion policy should be to delete.

```yaml
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshotClass
metadata:
  name: test-snapclass
driver: testdriver.csi.k8s.io
deletionPolicy: Delete
parameters:
  csi.storage.k8s.io/snapshotter-secret-name: mysecret
  csi.storage.k8s.io/snapshotter-secret-namespace: mysecretnamespace
```

The common snapshot controller reserves the parameter keys `csi.storage.k8s.io/snapshotter-secret-name` and `csi.storage.k8s.io/snapshotter-secret-namespace`. If specified, it fetches the referenced Kubernetes secret and sets it as an annotation on the volume snapshot content object.  The CSI external-snapshotter sidecar retrieves it from the content annotation and passes it to the CSI driver during snapshot creation.

Creation of a volume snapshot is triggered by the creation of a VolumeSnapshot API object.

The VolumeSnapshot object must specify the following source type:
`persistentVolumeClaimName` - The name of the PVC to snapshot. Please note that the source PVC, PV, and VolumeSnapshotClass for a VolumeSnapshot object must point to the same CSI driver.

The following VolumeSnapshot, for example, triggers the creation of a snapshot for a PVC called `test-pvc` using the VolumeSnapshotClass above.

```yaml
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshot
metadata:
  name: test-snapshot
spec:
  volumeSnapshotClassName: test-snapclass
  source:
    persistentVolumeClaimName: test-pvc
```

When volume snapshot creation is invoked, the common snapshot controller first creates a VolumeSnapshotContent object with the `volumeSnapshotRef`, source `volumeHandle`, `volumeSnapshotClassName` if specified, `driver`, and `deletionPolicy`.

The CSI external-snapshotter sidecar then passes the VolumeSnapshotClass parameters, the source volume ID, and any referenced secret(s) to the CSI driver (in this case `testdriver.csi.k8s.io`) via a CSI `CreateSnapshot` call. In response, the CSI driver creates a new snapshot for the specified volume, and returns the ID for that snapshot. The CSI external-snapshotter sidecar then updates the `snapshotHandle`, `creationTime`, `restoreSize`, and `readyToUse` in the status field of the VolumeSnapshotContent object that represents the new snapshot. For a storage system that needs to upload the snapshot after it has been cut, the CSI external-snapshotter sidecar will keep calling the CSI `CreateSnapshot` to check the status until upload is complete and set `readyToUse` to true.

The common snapshot controller binds the VolumeSnapshotContent object to the VolumeSnapshot (sets `BoundVolumeSnapshotContentName`), and updates the `creationTime`, `restoreSize`, and `readyToUse` in the status field of the VolumeSnapshot object based on the status field of the VolumeSnapshotContent object.

If no `volumeSnapshotClassName` is specified, one is automatically selected as follows:

The `StorageClass` from PVC or PV of the source volume is fetched. The default VolumeSnapshotClass is fetched, if available. A default VolumeSnapshotClass is a snapshot class created by the admin with the `snapshot.storage.kubernetes.io/is-default-class` annotation. If the `Driver` field of the default VolumeSnapshotClass is the same as the `Provisioner` field in the StorageClass, the default VolumeSnapshotClass is used. If there is no default VolumeSnapshotClass or more than one default VolumeSnapshotClass for a snapshot, an error will be returned.

Please note that the Kubernetes Snapshot API does not provide any consistency guarantees. You have to prepare your application (pause application, freeze filesystem etc.) before taking the snapshot for data consistency either manually or using some other higher level APIs/controllers.

You can verify that the VolumeSnapshot object is created and bound with VolumeSnapshotContent by running `kubectl describe volumesnapshot`:

`Bound Volume Snapshot Content Name` - field in the `Status` indicates the volume is bound to the specified VolumeSnapshotContent.
`Ready To Use` - field in the `Status` indicates this volume snapshot is ready for use.
`Creation Time` - field in the `Status` indicates when the snapshot was actually created (cut).
`Restore Size` - field in the `Status` indicates the minimum volume size required when restoring a volume from this snapshot.

```
Name:         test-snapshot
Namespace:    default
Labels:       <none>
Annotations:  <none>
API Version:  snapshot.storage.k8s.io/v1beta1
Kind:         VolumeSnapshot
Metadata:
  Creation Timestamp:  2019-11-16T00:36:04Z
  Finalizers:
    snapshot.storage.kubernetes.io/volumesnapshot-as-source-protection
    snapshot.storage.kubernetes.io/volumesnapshot-bound-protection
  Generation:        1
  Resource Version:  1294
  Self Link:         /apis/snapshot.storage.k8s.io/v1beta1/namespaces/default/volumesnapshots/new-snapshot-demo
  UID:               32ceaa2a-3802-4edd-a808-58c4f1bd7869
Spec:
  Source:
    Persistent Volume Claim Name:  test-pvc
  Volume Snapshot Class Name:      test-snapclass
Status:
  Bound Volume Snapshot Content Name:  snapcontent-32ceaa2a-3802-4edd-a808-58c4f1bd7869
  Creation Time:                       2019-11-16T00:36:04Z
  Ready To Use:                        true
  Restore Size:                        1Gi
```

As a reminder to any developers building controllers using volume snapshot APIs: before using a VolumeSnapshot API object, validate the bi-directional binding between the VolumeSnpashot and the VolumeSnapshotContent it is bound to, to ensure the binding is complete and correct (not doing so may result in security issues).

```shell
kubectl describe volumesnapshotcontent
```

```
Name:         snapcontent-32ceaa2a-3802-4edd-a808-58c4f1bd7869
Namespace:
Labels:       <none>
Annotations:  <none>
API Version:  snapshot.storage.k8s.io/v1beta1
Kind:         VolumeSnapshotContent
Metadata:
  Creation Timestamp:  2019-11-16T00:36:04Z
  Finalizers:
    snapshot.storage.kubernetes.io/volumesnapshotcontent-bound-protection
  Generation:        1
  Resource Version:  1292
  Self Link:         /apis/snapshot.storage.k8s.io/v1beta1/volumesnapshotcontents/snapcontent-32ceaa2a-3802-4edd-a808-58c4f1bd7869
  UID:               7dfdf22e-0b0c-4b71-9ddf-2f1612ca2aed
Spec:
  Deletion Policy:  Delete
  Driver:           testdriver.csi.k8s.io
  Source:
    Volume Handle:             d1b34a5f-0808-11ea-808a-0242ac110003
  Volume Snapshot Class Name:  test-snapclass
  Volume Snapshot Ref:
    API Version:       snapshot.storage.k8s.io/v1beta1
    Kind:              VolumeSnapshot
    Name:              test-snapshot
    Namespace:         default
    Resource Version:  1286
    UID:               32ceaa2a-3802-4edd-a808-58c4f1bd7869
Status:
  Creation Time:    1573864564608810101
  Ready To Use:     true
  Restore Size:     1073741824
  Snapshot Handle:  127c5798-0809-11ea-808a-0242ac110003
Events:             <none>
```

#### Importing an existing volume snapshot with Kubernetes

You can always expose a pre-existing volume snapshot in Kubernetes by manually creating a VolumeSnapshotContent object to represent the existing volume snapshot. Because VolumeSnapshotContent is a non-namespace API object, only a cluster admin may have the permission to create it. By specifying the `volumeSnapshotRef` the cluster admin specifies exactly which user can use the snapshot.

The following VolumeSnapshotContent, for example exposes a volume snapshot with the name `7bdd0de3-aaeb-11e8-9aae-0242ac110002` belonging to a CSI driver called `testdriver.csi.k8s.io`.

A VolumeSnapshotContent object should be created by a cluster admin with the following fields to represent an existing snapshot:

- `driver` - CSI driver used to handle this volume. This field is required.
- `source` - Snapshot identifying information
- `snapshotHandle` - name/identifier of the snapshot. This field is required.
- `volumeSnapshotRef` - Pointer to the VolumeSnapshot object this content should bind to.
- `name` and `namespace` - Specifies the name and namespace of the VolumeSnapshot object which the content is bound to.
- `deletionPolicy` - Valid values are `Delete` and `Retain`. If the `deletionPolicy` is `Delete`, then the underlying storage snapshot will be deleted along with the VolumeSnapshotContent object. If the - `deletionPolicy` is `Retain`, then both the underlying snapshot and VolumeSnapshotContent remain.

```yaml
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshotContent
metadata:
  name: manually-created-snapshot-content
spec:
  deletionPolicy: Delete
  driver: testdriver.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  volumeSnapshotRef:
    name: test-snapshot
    namespace: default
```

Once a VolumeSnapshotContent object is created, a user can create a VolumeSnapshot object pointing to the VolumeSnapshotContent object. The name and namespace of the VolumeSnapshot object must match the name/namespace specified in the volumeSnapshotRef of the VolumeSnapshotContent. It specifies the following fields:
`volumeSnapshotContentName` - name of the volume snapshot content specified above. This field is required.
`volumeSnapshotClassName` - name of the volume snapshot class. This field is optional.

```yaml
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshot
metadata:
  name: manually-created-snapshot
spec:
  source:
        volumeSnapshotContentName: test-content
```

Once both objects are created, the common snapshot controller verifies the binding between VolumeSnapshot and VolumeSnapshotContent objects is correct and marks the VolumeSnapshot as ready (if the CSI driver supports the `ListSnapshots` call, the controller also validates that the referenced snapshot exists). The CSI external-snapshotter sidecar checks if the snapshot exists if ListSnapshots CSI method is implemented, otherwise it assumes the snapshot exists. The external-snapshotter sidecar sets `readyToUse` to true in the status field of VolumeSnapshotContent. The common snapshot controller marks the snapshot as ready accordingly.

## Create Volume From Snapshot

Once you have a bound and ready VolumeSnapshot object, you can use that object to provision a new volume that is pre-populated with data from the snapshot.

To provision a new volume pre-populated with data from a snapshot, use the `dataSource` field in the `PersistentVolumeClaim`. It has three parameters:
`name` - name of the VolumeSnapshot object representing the snapshot to use as source
`kind` - must be VolumeSnapshot
`apiGroup` - must be snapshot.storage.k8s.io

The namespace of the source VolumeSnapshot object is assumed to be the same as the namespace of the `PersistentVolumeClaim` object.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-restore
  namespace: demo-namespace
spec:
  storageClassName: testdriver.csi.k8s.io
  dataSource:
    name: manually-created-snapshot
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

When the `PersistentVolumeClaim` object is created, it will trigger provisioning of a new volume that is pre-populated with data from the specified snapshot.
As a storage vendor, how do I add support for snapshots to my CSI driver?
To implement the snapshot feature, a CSI driver MUST add support for additional controller capabilities `CREATE_DELETE_SNAPSHOT` and `LIST_SNAPSHOTS`, and implement additional controller RPCs: `CreateSnapshot`, `DeleteSnapshot`, and `ListSnapshots`. For details, see the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md) and the [Kubernetes-CSI Driver Developer Guide](https://kubernetes-csi.github.io/docs/snapshot-restore-feature.html).

Although Kubernetes is as minimally prescriptive on the packaging and deployment of a CSI Volume Driver as possible, it provides a suggested mechanism for deploying an arbitrary containerized CSI driver on Kubernetes to simplify deployment of containerized CSI compatible volume drivers.

As part of this recommended deployment process, the Kubernetes team provides a number of sidecar (helper) containers, including the [external-snapshotter sidecar](https://kubernetes-csi.github.io/docs/external-snapshotter.html) container.

The external-snapshotter watches the Kubernetes API server for VolumeSnapshotContent object and triggers `CreateSnapshot` and `DeleteSnapshot` operations against a CSI endpoint. The CSI [external-provisioner sidecar container](https://kubernetes-csi.github.io/docs/external-provisioner.html) has also been updated to support restoring volume from snapshot using the dataSource PVC field.

In order to support snapshot feature, it is recommended that storage vendors deploy the external-snapshotter sidecar containers in addition to the external provisioner, along with their CSI driver.

## What are the limitations of beta?

The beta implementation of volume snapshots for Kubernetes has the following limitations:

- Does not support reverting an existing volume to an earlier state represented by a snapshot (beta only supports provisioning a new volume from a snapshot).
- No snapshot consistency guarantees beyond any guarantees provided by storage system (e.g. crash consistency). These are the responsibility of higher level APIs/controllers

##  What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the CSI Snapshot implementation to GA in either 1.18 or 1.19. Some of the features we are interested in supporting include consistency groups, application consistent snapshots, workload quiescing, in-place restores, volume backups, and more.

## How can I learn more?

You can also have a look at the [external-snapshotter source code repository](https://github.com/kubernetes-csi/external-snapshotter).

Check out additional documentation on the snapshot feature [here](http://k8s.io/docs/concepts/storage/volume-snapshots) and [here](https://kubernetes-csi.github.io/docs/).

## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together.

We offer a huge thank you to the contributors who stepped up these last few quarters to help the project reach Beta:

- Xing Yang (xing-yang)
- Xiangqian Yu (yuxiangqian)
- Jing Xu (jingxu97)
- Grant Griffiths (ggriffiths)
- Can Zhu (zhucan)

With special thanks to the following people for their insightful reviews and thorough consideration with the design:

- Michelle Au (msau42)
- Saad Ali (saadali)
- Patrick Ohly (pohly)
- Tim Hockin (thockin)
- Jordan Liggitt (liggitt).

Those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage). We’re rapidly growing and always welcome new contributors.

We also hold regular [SIG-Storage Snapshot Working Group meetings](https://docs.google.com/document/d/1qdfvAj5O-tTAZzqJyz3B-yczLLxOiQd-XKpJmTEMazs/edit?usp=sharing). New attendees are welcome to join for design and development discussions.
