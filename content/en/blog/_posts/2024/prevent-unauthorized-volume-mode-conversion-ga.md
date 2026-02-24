---
layout: blog
title: "Kubernetes 1.30: Preventing unauthorized volume mode conversion moves to GA"
date: 2024-04-30
slug: prevent-unauthorized-volume-mode-conversion-ga
author: >
  Raunak Pradip Shah (Mirantis)
---

With the release of Kubernetes 1.30, the feature to prevent the modification of the volume mode
of a [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/) that was created from
an existing VolumeSnapshot in a Kubernetes cluster, has moved to GA!


## The problem

The [Volume Mode](/docs/concepts/storage/persistent-volumes/#volume-mode) of a PersistentVolumeClaim 
refers to whether the underlying volume on the storage device is formatted into a filesystem or
presented as a raw block device to the Pod that uses it.

Users can leverage the VolumeSnapshot feature, which has been stable since Kubernetes v1.20,
to create a PersistentVolumeClaim (shortened as PVC) from an existing VolumeSnapshot in
the Kubernetes cluster. The PVC spec includes a dataSource field, which can point to an
existing VolumeSnapshot instance.
Visit [Create a PersistentVolumeClaim from a Volume Snapshot](/docs/concepts/storage/persistent-volumes/#create-persistent-volume-claim-from-volume-snapshot) 
for more details on how to create a PVC from an existing VolumeSnapshot in a Kubernetes cluster.

When leveraging the above capability, there is no logic that validates whether the mode of the
original volume, whose snapshot was taken, matches the mode of the newly created volume.

This presents a security gap that allows malicious users to potentially exploit an
as-yet-unknown vulnerability in the host operating system.

There is a valid use case to allow some users to perform such conversions. Typically, storage backup
vendors convert the volume mode during the course of a backup operation, to retrieve changed blocks 
for greater efficiency of operations. This prevents Kubernetes from blocking the operation completely
and presents a challenge in distinguishing trusted users from malicious ones.

## Preventing unauthorized users from converting the volume mode

In this context, an authorized user is one who has access rights to perform **update**
or **patch** operations on VolumeSnapshotContents, which is a cluster-level resource.  
It is up to the cluster administrator to provide these rights only to trusted users
or applications, like backup vendors.
Users apart from such authorized ones will never be allowed to modify the volume mode
of a PVC when it is being created from a VolumeSnapshot.

To convert the volume mode, an authorized user must do the following:

1. Identify the VolumeSnapshot that is to be used as the data source for a newly
   created PVC in the given namespace.
2. Identify the VolumeSnapshotContent bound to the above VolumeSnapshot.

  ```shell
  kubectl describe volumesnapshot -n <namespace> <name>
  ```

3. Add the annotation [`snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`](/docs/reference/labels-annotations-taints/#snapshot-storage-kubernetes-io-allowvolumemodechange)
   to the above VolumeSnapshotContent. The VolumeSnapshotContent annotations must include one similar to the following manifest fragment:

  ```yaml
  kind: VolumeSnapshotContent
  metadata:
    annotations:
      - snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"
  ...
  ```

**Note**: For pre-provisioned VolumeSnapshotContents, you must take an extra
step of setting `spec.sourceVolumeMode` field to either `Filesystem` or `Block`,
depending on the mode of the volume from which this snapshot was taken.

An example is shown below:

   ```yaml
   apiVersion: snapshot.storage.k8s.io/v1
   kind: VolumeSnapshotContent
   metadata:
     annotations:
     - snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"
     name: <volume-snapshot-content-name>
   spec:
     deletionPolicy: Delete
     driver: hostpath.csi.k8s.io
     source:
       snapshotHandle: <snapshot-handle>
     sourceVolumeMode: Filesystem
     volumeSnapshotRef:
       name: <volume-snapshot-name>
       namespace: <namespace>
   ```

Repeat steps 1 to 3 for all VolumeSnapshotContents whose volume mode needs to be
converted during a backup or restore operation. This can be done either via software
with credentials of an authorized user or manually by the authorized user(s).

If the annotation shown above is present on a VolumeSnapshotContent object,
Kubernetes will not prevent the volume mode from being converted.
Users should keep this in mind before they attempt to add the annotation
to any VolumeSnapshotContent.

## Action required

The `prevent-volume-mode-conversion` feature flag is enabled by default in the 
external-provisioner `v4.0.0` and external-snapshotter `v7.0.0`. Volume mode change
will be rejected when creating a PVC from a VolumeSnapshot unless the steps
described above have been performed.

## What's next

To determine which CSI external sidecar versions support this feature, please head
over to the [CSI docs page](https://kubernetes-csi.github.io/docs/).
For any queries or issues, join [Kubernetes on Slack](https://slack.k8s.io/) and
create a thread in the #csi or #sig-storage channel. Alternately, create an issue in the
CSI external-snapshotter [repository](https://github.com/kubernetes-csi/external-snapshotter).