---
layout: blog
title: 'Introducing Volume Snapshot Alpha for Kubernetes'
date: 2018-10-09
author: >
  Jing Xu (Google),
  Xing Yang (Huawei),
  Saad Ali (Google) 
---

Kubernetes v1.12 introduces alpha support for volume snapshotting. This feature allows creating/deleting volume snapshots, and the ability to create new volumes from a snapshot natively using the Kubernetes API.

## What is a Snapshot?

Many storage systems (like Google Cloud Persistent Disks, Amazon Elastic Block Storage, and many on-premise storage systems) provide the ability to create a "snapshot" of a persistent volume. A snapshot represents a point-in-time copy of a volume. A snapshot can be used either to provision a new volume (pre-populated with the snapshot data) or to restore the existing volume to a previous state (represented by the snapshot).

## Why add Snapshots to Kubernetes?

The Kubernetes volume plugin system already provides a powerful abstraction that automates the provisioning, attaching, and mounting of block and file storage.

Underpinning all these features is the Kubernetes goal of workload portability: Kubernetes aims to create an abstraction layer between distributed systems applications and underlying clusters so that applications can be agnostic to the specifics of the cluster they run on and application deployment requires no “cluster specific” knowledge.

The [Kubernetes Storage SIG](https://github.com/kubernetes/community/tree/master/sig-storage) identified snapshot operations as critical functionality for many stateful workloads. For example, a database administrator may want to snapshot a database volume before starting a database operation.

By providing a standard way to trigger snapshot operations in the Kubernetes API, Kubernetes users can now handle use cases like this without having to go around the Kubernetes API (and manually executing storage system specific operations).

Instead, Kubernetes users are now empowered to incorporate snapshot operations in a cluster agnostic way into their tooling and policy with the comfort of knowing that it will work against arbitrary Kubernetes clusters regardless of the underlying storage.

Additionally these Kubernetes snapshot primitives act as basic building blocks that unlock the ability to develop advanced, enterprise grade, storage administration features for Kubernetes: such as data protection, data replication, and data migration.

## Which volume plugins support Kubernetes Snapshots?

Kubernetes supports three types of volume plugins: in-tree, Flex, and CSI. See [Kubernetes Volume Plugin FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md) for details.

Snapshots are only supported for CSI drivers (not for in-tree or Flex). To use the Kubernetes snapshots feature, ensure that a CSI Driver that implements snapshots is deployed on your cluster.

As of the publishing of this blog, the following CSI drivers support snapshots:

* [GCE Persistent Disk CSI Driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
* [OpenSDS CSI Driver](https://github.com/opensds/nbp/tree/master/csi/server)
* [Ceph RBD CSI Driver](https://github.com/ceph/ceph-csi/tree/master/pkg/rbd)
* [Portworx CSI Driver](https://github.com/libopenstorage/openstorage/tree/master/csi)

Snapshot support for other [drivers](https://kubernetes-csi.github.io/docs/drivers.html) is pending, and should be available soon. Read the “[Container Storage Interface (CSI) for Kubernetes Goes Beta](https://kubernetes.io/blog/2018/04/10/container-storage-interface-beta/)” blog post to learn more about CSI and how to deploy CSI drivers.

## Kubernetes Snapshots API

Similar to the API for managing Kubernetes Persistent Volumes, Kubernetes Volume Snapshots introduce three new API objects for managing snapshots:

* `VolumeSnapshot`
  * Created by a Kubernetes user to request creation of a snapshot for a specified volume. It contains information about the snapshot operation such as the timestamp when the snapshot was taken and whether the snapshot is ready to use.
  * Similar to the `PersistentVolumeClaim` object, the creation and deletion of this object represents a user desire to create or delete a cluster resource (a snapshot).
* `VolumeSnapshotContent`
  * Created by the CSI volume driver once a snapshot has been successfully created. It contains information about the snapshot including snapshot ID.
  * Similar to the `PersistentVolume` object, this object represents a provisioned resource on the cluster (a snapshot).
  * Like `PersistentVolumeClaim` and `PersistentVolume` objects, once a snapshot is created, the `VolumeSnapshotContent` object binds to the VolumeSnapshot for which it was created (with a one-to-one mapping).
* `VolumeSnapshotClass`
  * Created by cluster administrators to describe how snapshots should be created. including the driver information, the secrets to access the snapshot, etc.

It is important to note that unlike the core Kubernetes Persistent Volume objects, these Snapshot objects are defined as [CustomResourceDefinitions (CRDs)](/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions). The Kubernetes project is moving away from having resource types pre-defined in the API server, and is moving towards a model where the API server is independent of the API objects. This allows the API server to be reused for projects other than Kubernetes, and consumers (like Kubernetes) can simply install the resource types they require as CRDs.

[CSI Drivers](https://kubernetes-csi.github.io/docs/drivers.html) that support snapshots will automatically install the required CRDs. Kubernetes end users only need to verify that a CSI driver that supports snapshots is deployed on their Kubernetes cluster.

In addition to these new objects, a new, DataSource field has been added to the `PersistentVolumeClaim` object:

```
type PersistentVolumeClaimSpec struct {
	AccessModes []PersistentVolumeAccessMode
	Selector *metav1.LabelSelector
	Resources ResourceRequirements
	VolumeName string
	StorageClassName *string
	VolumeMode *PersistentVolumeMode
	DataSource *TypedLocalObjectReference
}
```

This new alpha field enables a new volume to be created and automatically pre-populated with data from an existing snapshot.

## Kubernetes Snapshots Requirements

Before using Kubernetes Volume Snapshotting, you must:

* Ensure a CSI driver implementing snapshots is deployed and running on your Kubernetes cluster.
* Enable the Kubernetes Volume Snapshotting feature via new Kubernetes feature gate (disabled by default for alpha):
  * Set the following flag on the API server binary: `--feature-gates=VolumeSnapshotDataSource=true`

Before creating a snapshot, you also need to specify CSI driver information for snapshots by creating a `VolumeSnapshotClass` object and setting the `snapshotter` field to point to your CSI driver. In the example of `VolumeSnapshotClass` below, the CSI driver is `com.example.csi-driver`. You need at least one `VolumeSnapshotClass` object per snapshot provisioner. You can also set a default `VolumeSnapshotClass` for each individual CSI driver by putting an annotation `snapshot.storage.kubernetes.io/is-default-class: "true"` in the class definition.

```
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshotClass
metadata:
  name: default-snapclass
  annotations:
    snapshot.storage.kubernetes.io/is-default-class: "true"
snapshotter: com.example.csi-driver


apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshotClass
metadata:
  name: csi-snapclass
snapshotter: com.example.csi-driver
parameters:
  fakeSnapshotOption: foo
  csiSnapshotterSecretName: csi-secret
  csiSnapshotterSecretNamespace: csi-namespace
```

You must set any required opaque parameters based on the documentation for your CSI driver. As the example above shows,  the parameter `fakeSnapshotOption: foo` and any referenced secret(s) will be passed to CSI driver during snapshot creation and deletion. The [default CSI external-snapshotter](https://github.com/kubernetes-csi/external-snapshotter) reserves the parameter keys `csiSnapshotterSecretName` and `csiSnapshotterSecretNamespace`. If specified, it fetches the secret and passes it to the CSI driver when creating and deleting a snapshot.

And finally, before creating a snapshot, you must provision a volume using your CSI driver and populate it with some data that you want to snapshot (see the [CSI blog post](https://kubernetes.io/blog/2018/04/10/container-storage-interface-beta/) on how to create and use CSI volumes).

## Creating a new Snapshot with Kubernetes

Once a `VolumeSnapshotClass` object is defined and you have a volume you want to snapshot, you may create a new snapshot by creating a `VolumeSnapshot` object.

The source of the snapshot specifies the volume to create a snapshot from. It has two parameters:

* `kind` - must be `PersistentVolumeClaim`
* `name` - the PVC API object name

The namespace of the volume to snapshot is assumed to be the same as the namespace of the `VolumeSnapshot` object.

```
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshot
metadata:
  name: new-snapshot-demo
  namespace: demo-namespace
spec:
  snapshotClassName: csi-snapclass
  source:
    name: mypvc
    kind: PersistentVolumeClaim
```

In the `VolumeSnapshot` spec, user can specify the `VolumeSnapshotClass` which has the information about which CSI driver should be used for creating the snapshot . When the `VolumeSnapshot` object is created, the parameter `fakeSnapshotOption: foo` and any referenced secret(s) from the `VolumeSnapshotClass` are passed to the CSI plugin `com.example.csi-driver` via a `CreateSnapshot` call.

In response, the CSI driver triggers a snapshot of the volume and then automatically creates a `VolumeSnapshotContent` object to represent the new snapshot, and binds the new `VolumeSnapshotContent` object to the `VolumeSnapshot`, making it ready to use. If the  CSI driver fails to create the snapshot and returns error, the snapshot controller reports the error in the status of `VolumeSnapshot` object and does not retry (this is different from other controllers in Kubernetes, and is to prevent snapshots from being taken at an unexpected time).

If a snapshot class is not specified, the external snapshotter will try to find and set a default snapshot class for the snapshot. The `CSI driver` specified by `snapshotter` in the default snapshot class must match the `CSI driver` specified by the `provisioner` in the storage class of the PVC.

Please note that the alpha release of Kubernetes Snapshot does not provide any consistency guarantees. You have to prepare your application (pause application, freeze filesystem etc.) before taking the snapshot for data consistency.

You can verify that the `VolumeSnapshot` object is created and bound with `VolumeSnapshotContent` by running `kubectl describe volumesnapshot`:

* `Ready` should be set to true under `Status` to indicate this volume snapshot is ready for use.
* `Creation Time` field indicates when the snapshot is actually created (cut).
* `Restore Size` field indicates the minimum volume size when restoring a volume from the snapshot.
* `Snapshot Content Name` field in the `spec` points to the `VolumeSnapshotContent` object created for this snapshot.

## Importing an existing snapshot with Kubernetes

You can always import an existing snapshot to Kubernetes by manually creating a `VolumeSnapshotContent` object to represent the existing snapshot. Because `VolumeSnapshotContent` is a non-namespace API object, only a system admin may have the permission to create it. Once a `VolumeSnapshotContent` object is created, the user can create a `VolumeSnapshot` object pointing to the `VolumeSnapshotContent` object. The external-snapshotter controller will mark snapshot as ready after verifying the snapshot exists and the binding between `VolumeSnapshot` and `VolumeSnapshotContent` objects is correct. Once bound, the snapshot is ready to use in Kubernetes.

A `VolumeSnapshotContent` object should be created with the following fields to represent a pre-provisioned snapshot:

* `csiVolumeSnapshotSource` - Snapshot identifying information.
  * `snapshotHandle` - name/identifier of the snapshot. This field is required.
  * `driver` - CSI driver used to handle this volume. This field is required. It must match the snapshotter name in the snapshot controller.
  * `creationTime` and `restoreSize` - these fields are not required for pre-provisioned volumes. The external-snapshotter controller will automatically update them after creation.
* `volumeSnapshotRef` - Pointer to the `VolumeSnapshot` object this object should bind to.
  * `name` and `namespace` -  It specifies the name and namespace of the `VolumeSnapshot` object which the content is bound to.  
  * `UID` - these fields are not required for pre-provisioned volumes.The external-snapshotter controller will update the field automatically after binding. If user specifies UID field, he/she must make sure that it matches with the binding snapshot’s UID.  If the specified UID does not match the binding snapshot’s UID, the content is considered an orphan object and the controller will delete it and its associated snapshot.
* `snapshotClassName` - This field is optional. The external-snapshotter controller will update the field automatically after binding.

```
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshotContent
metadata:
  name: static-snapshot-content
spec:
  csiVolumeSnapshotSource:
    driver: com.example.csi-driver
    snapshotHandle: snapshotcontent-example-id
  volumeSnapshotRef:
    kind: VolumeSnapshot
    name: static-snapshot-demo
    namespace: demo-namespace
```

A `VolumeSnapshot` object should be created to allow a user to use the snapshot:

* `snapshotClassName` - name of the volume snapshot class. This field is optional. If set, the snapshotter field in the snapshot class must match the snapshotter name of the snapshot controller. If not set, the snapshot controller will try to find a default snapshot class.
* `snapshotContentName` - name of the volume snapshot content. This field is required for pre-provisioned volumes.

```
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshot
metadata:
  name: static-snapshot-demo
  namespace: demo-namespace
spec:
  snapshotClassName: csi-snapclass
  snapshotContentName: static-snapshot-content
```

Once these objects are created, the snapshot controller will bind them together, and set the field Ready (under `Status`) to True to indicate the snapshot is ready to use.

## Provision a new volume from a snapshot with Kubernetes

To provision a new volume pre-populated with data from a snapshot object, use the new dataSource field in the `PersistentVolumeClaim`. It has three parameters:

* name - name of the `VolumeSnapshot` object representing the snapshot to use as source
* kind - must be `VolumeSnapshot`
* apiGroup - must be `snapshot.storage.k8s.io`

The namespace of the source `VolumeSnapshot` object is assumed to be the same as the namespace of the `PersistentVolumeClaim` object.

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-restore
  Namespace: demo-namespace
spec:
  storageClassName: csi-storageclass
  dataSource:
    name: new-snapshot-demo
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

When the `PersistentVolumeClaim` object is created, it will trigger provisioning of a new volume that is pre-populated with data from the specified snapshot.

## As a storage vendor, how do I add support for snapshots to my CSI driver?

To implement the snapshot feature, a CSI driver MUST add support for additional controller capabilities `CREATE_DELETE_SNAPSHOT` and `LIST_SNAPSHOTS`, and implement additional controller RPCs: `CreateSnapshot`, `DeleteSnapshot`, and `ListSnapshots`. For details, see [the CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md).

Although Kubernetes is as [minimally prescriptive](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md#third-party-csi-volume-drivers) on the packaging and deployment of a CSI Volume Driver as possible, it provides a [suggested mechanism](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md#recommended-mechanism-for-deploying-csi-drivers-on-kubernetes) for deploying an arbitrary containerized CSI driver on Kubernetes to simplify deployment of containerized CSI compatible volume drivers.

As part of this recommended deployment process, the Kubernetes team provides a number of sidecar (helper) containers, including a new [external-snapshotter](https://github.com/kubernetes-csi/external-snapshotter) sidecar container.

The external-snapshotter watches the Kubernetes API server for `VolumeSnapshot` and `VolumeSnapshotContent` objects and triggers CreateSnapshot and DeleteSnapshot operations against a CSI endpoint. The CSI [external-provisioner](https://github.com/kubernetes-csi/external-provisioner) sidecar container has also been updated to support restoring volume from snapshot using the new `dataSource` PVC field.

In order to support snapshot feature, it is recommended that storage vendors deploy the external-snapshotter sidecar containers in addition to the external provisioner the external attacher, along with their CSI driver in a statefulset as shown in the following diagram.

![](/images/blog/2018-10-09-volume-snapshot-alpha/snapshot.png)

In this [example deployment yaml](https://github.com/kubernetes-csi/external-snapshotter/blob/e011fe31df548813d2eb6dacb278c0ca58533b34/deploy/kubernetes/setup-csi-snapshotter.yaml) file, two sidecar containers, the external provisioner and the external snapshotter, and CSI drivers are deployed together with the hostpath CSI plugin in the statefulset pod. Hostpath CSI plugin is a sample plugin, not for production.

## What are the limitations of alpha?

The alpha implementation of snapshots for Kubernetes has the following limitations:

* Does not support reverting an existing volume to an earlier state represented by a snapshot (alpha only supports provisioning a new volume from a snapshot).
* Does not support “in-place restore” of an existing PersistentVolumeClaim from a snapshot: i.e. provisioning a new volume from a snapshot, but updating an existing PersistentVolumeClaim to point to the new volume and effectively making the PVC appear to revert to an earlier state (alpha only supports using a new volume provisioned from a snapshot via a new PV/PVC).
* No snapshot consistency guarantees beyond any guarantees provided by storage system (e.g. crash consistency).

## What’s next?
Depending on feedback and adoption, the Kubernetes team plans to push the CSI Snapshot implementation to beta in either 1.13 or 1.14.

## How can I learn more?

Check out additional documentation on the snapshot feature here: http://k8s.io/docs/concepts/storage/volume-snapshots and https://kubernetes-csi.github.io/docs/

## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together.

In addition to the contributors who have been working on the Snapshot feature:

* Xing Yang ([xing-yang](https://github.com/xing-yang))
* Jing Xu ([jingxu97](https://github.com/jingxu97))
* Huamin Chen ([rootfs](https://github.com/rootfs))
* Tomas Smetana ([tsmetana](https://github.com/tsmetana))
* Shiwei Xu ([wackxu](https://github.com/wackxu))

We offer a huge thank you to all the contributors in Kubernetes Storage SIG and CSI community who helped review the design and implementation of the project, including but not limited to the following:

* Saad Ali ([saadali](https://github.com/saadali))
* Tim Hockin ([thockin](https://github.com/thockin))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Luis Pabon ([lpabon](https://github.com/lpabon))
* Jordan Liggitt ([liggitt](https://github.com/liggitt))
* David Zhu ([davidz627](https://github.com/davidz627))
* Garth Bushell ([garthy](https://github.com/garthy))
* Ardalan Kangarlou ([kangarlou](https://github.com/kangarlou))
* Seungcheol Ko ([sngchlko](https://github.com/sngchlko))
* Michelle Au ([msau42](https://github.com/msau42))
* Humble Devassy Chirammal ([humblec](https://github.com/humblec))
* Vladimir Vivien ([vladimirvivien](https://github.com/vladimirvivien))
* John Griffith ([j-griffith](https://github.com/j-griffith))
* Bradley Childs ([childsb](https://github.com/childsb))
* Ben Swartzlander ([bswartz](https://github.com/bswartz))

If you’re interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.
