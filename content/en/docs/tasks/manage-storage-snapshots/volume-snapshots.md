---
title: Work with Volume Snapshots
content_type: task
weight: 5
---

<!-- overview -->

This page shows how to create, restore, and delete volume snapshots in Kubernetes. 
A volume snapshot is a point-in-time copy of a Persistent Volume (PV). 
Snapshots are useful for backup and disaster recovery.

## {{% heading "objective" %}}

- Create a [`VolumeSnapshotClass`](/docs/concepts/storage/volume-snapshot-classes/) to define [`VolumeSnapshot`](/docs/concepts/storage/volume-snapshots/) behavior.
- Create a [`VolumeSnapshot`](/docs/concepts/storage/volume-snapshots/) of an existing [`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/) (PVC).
- Restore a [`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/) (PVC) from a [`VolumeSnapshot`](/docs/concepts/storage/volume-snapshots/).
- Delete a [`VolumeSnapshot`](/docs/concepts/storage/volume-snapshots/) and related resources.

## {{% heading "prerequisites" %}}

- {{< include "task-tutorial-prereqs.md" >}}
- Kubernetes cluster with a [CSI-compatible storage provider](/docs/concepts/storage/volumes/#csi).
- Volume snapshots only support the out-of-tree CSI volume plugins.
  For details, see [Volume Snapshots](/docs/concepts/storage/volume-snapshots/).

## Create a VolumeSnapshotClass

[`VolumeSnapshotClass`](/docs/concepts/storage/volume-snapshot-classes/) provides a way to describe the "classes" of storage when provisioning a volume snapshot.

{{% code_sample file="application/volume-snapshot-class.yaml" %}}

1. Apply the `VolumeSnapshotClass` YAML file:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/volume-snapshot-class.yaml
   ```

1. Verify that the `VolumeSnapshotClass` is created:

   ```shell
   kubectl get volumesnapshotclass
   ```
   
   Expected output:
   
   ```
   NAME                     DRIVER             DELETIONPOLICY
   example-snapshot-class   csi.example.com    Delete
   ```

## Create a VolumeSnapshot

[`VolumeSnapshot`](/docs/concepts/storage/volume-snapshots/) represents a snapshot of a volume on a storage system.
create a snapshot of an existing Persistent Volume Claim (PVC):

{{% code_sample file="application/volume-snaphot.yaml" %}}


1. Apply the `VolumeSnapshot` YAML file:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/volume-snaphot.yaml
   ```

1. Verify that the snapshot was created:

   ```shell
   kubectl get volumesnapshots
   ```

   Expected output:

   ```
   NAME               READYTOUSE   SOURCEPVC     CREATIONTIME   AGE
   example-snapshot  true         example-pvc   10s            10s
   ```

## Restore from a VolumeSnapshot

Create a [`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/) (PVC) that uses the snapshot as a data source for restore.

{{% code_sample file="application/restore-pvc.yaml" %}}

1. Apply the `PVC` YAML file:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/restore-pvc.yaml
   ```

1. Verify that the restored PVC is ready:

   ```shell
   kubectl get pvc restored-pvc
   ```

   Expected output:

   ```
   NAME          STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
   restored-pvc  Bound    pvc-12345678-abcdef12-3456-abcdef123456    5Gi        RWO            standard       10s
   ```

## Delete a VolumeSnapshot

To delete the snapshot and its associated resources:

   ```shell
   kubectl delete volumesnapshot example-snapshot
   ```
   
   ```shell
   kubectl delete pvc restored-pvc
   ```

   ```shell
   kubectl delete volumesnapshotclass example-snapshot-class
   ```

## {{% heading "whatsnext" %}}

- Learn more about [`Persistent Volumes`](/docs/concepts/storage/persistent-volumes/).
- Read about the [`VolumeSnapshot`](/docs/concepts/storage/volume-snapshots/).
- Read about the[`VolumeSnapshotClass`](/docs/concepts/storage/volume-snapshot-classes/).


