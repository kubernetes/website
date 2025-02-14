---
layout: blog
title: 'Resizing Persistent Volumes using Kubernetes'
date: 2018-07-12
author: >
  Hemant Kumar (Red Hat)
---

**Editor’s note: this post is part of a [series of in-depth articles](https://kubernetes.io/blog/2018/06/27/kubernetes-1.11-release-announcement/) on what’s new in Kubernetes 1.11**

In Kubernetes v1.11 the persistent volume expansion feature is being promoted to beta. This feature allows users to easily resize an existing volume by editing the `PersistentVolumeClaim` (PVC) object. Users no longer have to manually interact with the storage backend or delete and recreate PV and PVC objects to increase the size of a volume. Shrinking persistent volumes is not supported.

Volume expansion was introduced in v1.8 as an Alpha feature, and versions prior to v1.11 required enabling the feature gate, `ExpandPersistentVolumes`, as well as the admission controller, `PersistentVolumeClaimResize` (which prevents expansion of PVCs whose underlying storage provider does not support resizing). In Kubernetes v1.11+, both the feature gate and admission controller are enabled by default.

Although the feature is enabled by default, a cluster admin must opt-in to allow users to resize their volumes. Kubernetes v1.11 ships with volume expansion support for the following in-tree volume plugins: AWS-EBS, GCE-PD, Azure Disk, Azure File, Glusterfs, Cinder, Portworx, and Ceph RBD. Once the admin has determined that volume expansion is supported for the underlying provider, they can make the feature available to users by setting the `allowVolumeExpansion` field to `true` in their `StorageClass` object(s). Only PVCs created from that `StorageClass` will be allowed to trigger volume expansion.

```
~> cat standard.yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
parameters:
  type: pd-standard
provisioner: kubernetes.io/gce-pd
allowVolumeExpansion: true
reclaimPolicy: Delete
```

Any PVC created from this `StorageClass` can be edited (as illustrated below) to request more space. Kubernetes will interpret a change to the storage field as a request for more space, and will trigger automatic volume resizing.

![PVC StorageClass](/images/blog/2018-07-12-resizing-persistent-volumes-using-kubernetes/pvc-storageclass.png)

## File System Expansion

Block storage volume types such as GCE-PD, AWS-EBS, Azure Disk, Cinder, and Ceph RBD typically require a file system expansion before the additional space of an expanded volume is usable by pods. Kubernetes takes care of this automatically whenever the pod(s) referencing your volume are restarted.

Network attached file systems (like Glusterfs and Azure File) can be expanded without having to restart the referencing Pod, because these systems do not require special file system expansion.

File system expansion must be triggered by terminating the pod using the volume. More specifically:

* Edit the PVC to request more space.
* Once underlying volume has been expanded by the storage provider, then the PersistentVolume object will reflect the updated size and the PVC will have the `FileSystemResizePending` condition.

You can verify this by running `kubectl get pvc <pvc_name> -o yaml`

```
~> kubectl get pvc myclaim -o yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
  namespace: default
  uid: 02d4aa83-83cd-11e8-909d-42010af00004
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 14Gi
  storageClassName: standard
  volumeName: pvc-xxx
status:
  capacity:
    storage: 9G
  conditions:
  - lastProbeTime: null
    lastTransitionTime: 2018-07-11T14:51:10Z
    message: Waiting for user to (re-)start a pod to finish file system resize of
      volume on node.
    status: "True"
    type: FileSystemResizePending
  phase: Bound
```
* Once the PVC has the condition `FileSystemResizePending` then pod that uses the PVC can be restarted to finish file system resizing on the node. Restart can be achieved by deleting and recreating the pod or by scaling down the deployment and then scaling it up again.
* Once file system resizing is done, the PVC will automatically be updated to reflect new size.

Any errors encountered while expanding file system should be available as events on pod.

## Online File System Expansion

Kubernetes v1.11 also introduces an alpha feature called online file system expansion. This feature enables file system expansion while a volume is still in-use by a pod. Because this feature is alpha, it requires enabling the feature gate, `ExpandInUsePersistentVolumes`. It is supported by the in-tree volume plugins GCE-PD, AWS-EBS, Cinder, and Ceph RBD. When this feature is enabled, pod referencing the resized volume do not need to be restarted. Instead, the file system will automatically be resized while in use as part of volume expansion. File system expansion does not happen until a pod references the resized volume, so if no pods referencing the volume are running file system expansion will not happen.

## How can I learn more?

Check out additional documentation on this feature here: http://k8s.io/docs/concepts/storage/persistent-volumes.
