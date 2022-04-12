---
layout: blog
title: 'Prevent unauthorised volume mode conversion'
date: 2022-04-12
slug: prevent-unauthorised-volume-mode-conversion-alpha
---

**Author:** Raunak Shah (Mirantis)

Kubernetes v1.24 introduces a new alpha-level feature that prevents unauthorised users from modifying the volume mode of a [`PeristentVolumeClaim`](/docs/concepts/storage/persistent-volumes.md). This feature requires [`VolumeSnapshot`](/docs/concepts/storage/volume-snapshots.md) APIs with version `v6.0.0` onwards and `external-provisioner` version `v3.2.0` onwards.  

### The problem

As of Kubernetes 1.23, users can leverage the `VolumeSnapshot` feature, which GA'd in Kubernetes 1.20, to create a `PersistentVolumeClaim` (or `PVC`) from a previously taken `VolumeSnapshot`. This is done by pointing the `Spec.dataSource` parameter of the `PVC` to an existing `VolumeSnapshot` instance. 
There is no logic that validates whether the original volume mode of the `PVC`, whose snapshot was taken, matches the volume mode of the newly created `PVC`, that is being created from the existing `VolumeSnapshot`.

There is logic in allowing this, as many popular storage backup vendors convert the volume mode, during the course of a backup operation, for efficiency purposes.

However this also presents a security gap that allows malicious users to potentially exploit an as-yet-unknown CVE in the kernel.

### Preventing unauthorised users from converting the volume mode

If the alpha feature is enabled in `snapshot-controller` and `external-provisioner`, then unauthorised users will not be allowed to modify the volume mode of a `PVC` when it is being created from a `VolumeSnapshot`.
An unauthorised user is defined as one who does not have existing permissions to alter the cluster-scoped `VolumeSnapshotContent` resource.
Backup vendors normally have this permission on clusters where a backup is to be performed. 

To convert the volume mode, an authorised user must do the following:

1. Identify the `VolumeSnapshot` that is to be used as the data source for a newly created `PVC`. 
2. Identify the `VolumeSnapshotContent` bound to the above `VolumeSnapshot`.
3. Add a new annotation `snapshot.storage.kubernetes.io/allowVolumeModeChange` to the `VolumeSnapshotContent`. 
This annotation can be added either via software or manually by the backup vendor. The VolumeSnapshotContent must look like below after this change:

```yaml
kind: VolumeSnapshotContent 
metadata: 
	annotations: 
		- snapshot.storage.kubernetes.io/allowVolumeModeChange: "true"
...
```
NOTE: For pre-provisioned `VolumeSnapshotContents`, the user has an additional step of setting `Spec.SourceVolumeMode` field to either `Filesystem` or `Block`, depending on the volume from which this snapshot was taken.
An example is shown below:

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
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

Repeat (1)-(3) for all `VolumeSnapshotContent`s whose volume mode needs to be converted during a backup or restore operation.

If the above annotation is present on a `VolumeSnapshotContent` object, Kubernetes will not prevent the volume mode from being converted.
Users should keep this in mind before they attempt to add the annotation to any `VolumeSnapshotContent`. 


### How to enable the feature

This feature can be enabled by setting `prevent-volume-mode-conversion` flag to `true` in the `snapshot-controller` and `external-provisioner` spec, as shown below:

```yaml
apiVersion: apps/v1
kind: Deployment
...
spec:
      containers:
      - args:
        - --leader-election=true
        - --prevent-volume-mode-conversion=true
        image: snapshot-controller:v6.0.0
...
```


