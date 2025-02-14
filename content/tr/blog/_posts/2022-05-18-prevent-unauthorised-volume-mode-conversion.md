---
layout: blog
title: 'Kubernetes 1.24: Prevent unauthorised volume mode conversion'
date: 2022-05-18
slug: prevent-unauthorised-volume-mode-conversion-alpha
author: >
  Raunak Pradip Shah (Mirantis)
---

Kubernetes v1.24 introduces a new alpha-level feature that prevents unauthorised users 
from modifying the volume mode of a [`PersistentVolumeClaim`](/docs/concepts/storage/persistent-volumes/) created from an 
existing [`VolumeSnapshot`](/docs/concepts/storage/volume-snapshots/) in the Kubernetes cluster.  



### The problem

The [Volume Mode](/docs/concepts/storage/persistent-volumes/#volume-mode) determines whether a volume 
is formatted into a filesystem or presented as a raw block device.   

Users can leverage the `VolumeSnapshot` feature, which has been stable since Kubernetes v1.20, 
to create a `PersistentVolumeClaim` (shortened as PVC) from an existing `VolumeSnapshot` in
the Kubernetes cluster. The PVC spec includes a `dataSource` field, which can point to an 
existing `VolumeSnapshot` instance.
Visit [Create a PersistentVolumeClaim from a Volume Snapshot](/docs/concepts/storage/persistent-volumes/#create-persistent-volume-claim-from-volume-snapshot) for more details.

When leveraging the above capability, there is no logic that validates whether the mode of the
original volume, whose snapshot was taken, matches the mode of the newly created volume.

This presents a security gap that allows malicious users to potentially exploit an 
as-yet-unknown vulnerability in the host operating system.

Many popular storage backup vendors convert the volume mode during the course of a 
backup operation, for efficiency purposes, which prevents Kubernetes from blocking
the operation completely and presents a challenge in distinguishing trusted
users from malicious ones.

### Preventing unauthorised users from converting the volume mode

In this context, an authorised user is one who has access rights to perform `Update` 
or `Patch` operations on `VolumeSnapshotContents`, which is a cluster-level resource.  
It is upto the cluster administrator to provide these rights only to trusted users
or applications, like backup vendors.

If the alpha feature is [enabled](https://kubernetes-csi.github.io/docs/) in 
`snapshot-controller`, `snapshot-validation-webhook` and `external-provisioner`,
then unauthorised users will not be allowed to modify the volume mode of a PVC
when it is being created from a `VolumeSnapshot`.

To convert the volume mode, an authorised user must do the following:

1. Identify the `VolumeSnapshot` that is to be used as the data source for a newly 
created PVC in the given namespace. 
2. Identify the `VolumeSnapshotContent` bound to the above `VolumeSnapshot`.

  ```shell
  kubectl get volumesnapshot -n <namespace>
  ```

3. Add the annotation [`snapshot.storage.kubernetes.io/allowVolumeModeChange`](/docs/reference/labels-annotations-taints/#snapshot-storage-kubernetes-io-allowvolumemodechange)
to the `VolumeSnapshotContent`. 

4. This annotation can be added either via software or manually by the authorised 
user. The `VolumeSnapshotContent` annotation must look like following manifest fragment:

  ```yaml
  kind: VolumeSnapshotContent
  metadata:
    annotations:
      - snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"
  ...
  ```

**Note**: For pre-provisioned `VolumeSnapshotContents`, you must take an extra
step of setting `spec.sourceVolumeMode` field to either `Filesystem` or `Block`,
depending on the mode of the volume from which this snapshot was taken.

An example is shown below:

   ```yaml
   apiVersion: snapshot.storage.k8s.io/v1
   kind: VolumeSnapshotContent
   metadata:
     annotations:
     - snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"
     name: new-snapshot-content-test
   spec:
     deletionPolicy: Delete
     driver: hostpath.csi.k8s.io
     source:
       snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
     sourceVolumeMode: Filesystem
     volumeSnapshotRef:
       name: new-snapshot-test
       namespace: default
   ```

Repeat steps 1 to 3 for all `VolumeSnapshotContents` whose volume mode needs to be 
converted during a backup or restore operation.

If the annotation shown in step 4 above is present on a `VolumeSnapshotContent`
object, Kubernetes will not prevent the volume mode from being converted.
Users should keep this in mind before they attempt to add the annotation 
to any `VolumeSnapshotContent`. 


### What's next

[Enable this feature](https://kubernetes-csi.github.io/docs/) and let us know 
what you think!

We hope this feature causes no disruption to existing workflows while preventing
malicious users from exploiting security vulnerabilities in their clusters. 

For any queries or issues, join [Kubernetes on Slack](https://slack.k8s.io/) and
create a thread in the #sig-storage channel. Alternately, create an issue in the
CSI external-snapshotter [repository](https://github.com/kubernetes-csi/external-snapshotter).