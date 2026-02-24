---
layout: blog
title: "Kubernetes 1.23: Prevent PersistentVolume leaks when deleting out of order"
date: 2021-12-15T10:00:00-08:00
slug: kubernetes-1-23-prevent-persistentvolume-leaks-when-deleting-out-of-order
author: >
  Deepak Kinni (VMware)
---

[PersistentVolume](/docs/concepts/storage/persistent-volumes/) (or PVs for short) are
associated with [Reclaim Policy](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaim-policy).
The Reclaim Policy is used to determine the actions that need to be taken by the storage
backend on deletion of the PV.
Where the reclaim policy is `Delete`, the expectation is that the storage backend
releases the storage resource that was allocated for the PV. In essence, the reclaim
policy needs to honored on PV deletion.

With the recent Kubernetes v1.23 release, an alpha feature lets you configure your
cluster to behave that way and honor the configured reclaim policy.


## How did reclaim work in previous Kubernetes releases?

[PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#Introduction) (or PVC for short) is
a request for storage by a user. A PV and PVC are considered [Bound](/docs/concepts/storage/persistent-volumes/#Binding)
if there is a newly created PV or a matching PV is found. The PVs themselves are
backed by a volume allocated by the storage backend. 

Normally, if the volume is to be deleted, then the expectation is to delete the
PVC for a bound PV-PVC pair. However, there are no restrictions to delete a PV
prior to deleting a PVC.

First, I'll demonstrate the behavior for clusters that are running an older version of Kubernetes.

#### Retrieve an PVC that is bound to a PV

Retrieve an existing PVC `example-vanilla-block-pvc`
```
kubectl get pvc example-vanilla-block-pvc
```
The following output shows the PVC and it's `Bound` PV, the PV is shown under the `VOLUME` column:
```
NAME                        STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS               AGE
example-vanilla-block-pvc   Bound    pvc-6791fdd4-5fad-438e-a7fb-16410363e3da   5Gi        RWO            example-vanilla-block-sc   19s
```

#### Delete PV

When I try to delete a bound PV, the cluster blocks and the `kubectl` tool does
not return back control to the shell; for example:

```
kubectl delete pv pvc-6791fdd4-5fad-438e-a7fb-16410363e3da
```

```
persistentvolume "pvc-6791fdd4-5fad-438e-a7fb-16410363e3da" deleted
^C
```

Retrieving the PV:
```
kubectl get pv pvc-6791fdd4-5fad-438e-a7fb-16410363e3da
```

It can be observed that the PV is in `Terminating` state
```
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS        CLAIM                               STORAGECLASS               REASON   AGE
pvc-6791fdd4-5fad-438e-a7fb-16410363e3da   5Gi        RWO            Delete           Terminating   default/example-vanilla-block-pvc   example-vanilla-block-sc            2m23s
```

#### Delete PVC

```
kubectl delete pvc example-vanilla-block-pvc
```

The following output is seen if the PVC gets successfully deleted:
```
persistentvolumeclaim "example-vanilla-block-pvc" deleted
```

The PV object from the cluster also gets deleted. When attempting to retrieve the PV
it will be observed that the PV is no longer found:

```
kubectl get pv pvc-6791fdd4-5fad-438e-a7fb-16410363e3da
```

```
Error from server (NotFound): persistentvolumes "pvc-6791fdd4-5fad-438e-a7fb-16410363e3da" not found
```

Although the PV is deleted the underlying storage resource is not deleted, and
needs to be removed manually.

To sum it up, the reclaim policy associated with the Persistent Volume is currently
ignored under certain circumstance. For a `Bound` PV-PVC pair the ordering of PV-PVC
deletion determines whether the PV reclaim policy is honored. The reclaim policy 
is honored if the PVC is deleted first, however, if the PV is deleted prior to 
deleting the PVC then the reclaim policy is not exercised. As a result of this behavior,
the associated storage asset in the external infrastructure is not removed.

## PV reclaim policy with Kubernetes v1.23

The new behavior ensures that the underlying storage object is deleted from the backend when users attempt to delete a PV manually.

#### How to enable new behavior?

To make use of the new behavior, you must have upgraded your cluster to the v1.23 release of Kubernetes.
You need to make sure that you are running the CSI [`external-provisioner`](https://github.com/kubernetes-csi/external-provisioner) version `4.0.0`, or later.
You must also enable the `HonorPVReclaimPolicy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for the
`external-provisioner` and for the `kube-controller-manager`.

If you're not using a CSI driver to integrate with your storage backend, the fix isn't
available. The Kubernetes project doesn't have a current plan to fix the bug for in-tree
storage drivers: the future of those in-tree drivers is deprecation and migration to CSI.

#### How does it work?

The new behavior is achieved by adding a finalizer `external-provisioner.volume.kubernetes.io/finalizer` on new and existing PVs, the finalizer is only removed after the storage from backend is deleted.

An example of a PV with the finalizer, notice the new finalizer in the finalizers list

```
kubectl get pv pvc-a7b7e3ba-f837-45ba-b243-dec7d8aaed53 -o yaml
```

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  annotations:
    pv.kubernetes.io/provisioned-by: csi.vsphere.vmware.com
  creationTimestamp: "2021-11-17T19:28:56Z"
  finalizers:
  - kubernetes.io/pv-protection
  - external-provisioner.volume.kubernetes.io/finalizer
  name: pvc-a7b7e3ba-f837-45ba-b243-dec7d8aaed53
  resourceVersion: "194711"
  uid: 087f14f2-4157-4e95-8a70-8294b039d30e
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 1Gi
  claimRef:
    apiVersion: v1
    kind: PersistentVolumeClaim
    name: example-vanilla-block-pvc
    namespace: default
    resourceVersion: "194677"
    uid: a7b7e3ba-f837-45ba-b243-dec7d8aaed53
  csi:
    driver: csi.vsphere.vmware.com
    fsType: ext4
    volumeAttributes:
      storage.kubernetes.io/csiProvisionerIdentity: 1637110610497-8081-csi.vsphere.vmware.com
      type: vSphere CNS Block Volume
    volumeHandle: 2dacf297-803f-4ccc-afc7-3d3c3f02051e
  persistentVolumeReclaimPolicy: Delete
  storageClassName: example-vanilla-block-sc
  volumeMode: Filesystem
status:
  phase: Bound
```

The presence of the finalizer prevents the PV object from being removed from the
cluster. As stated previously, the finalizer is only removed from the PV object
after it is successfully deleted from the storage backend. To learn more about
finalizers, please refer to [Using Finalizers to Control Deletion](/blog/2021/05/14/using-finalizers-to-control-deletion/).

#### What about CSI migrated volumes?

The fix is applicable to CSI migrated volumes as well. However, when the feature
`HonorPVReclaimPolicy` is enabled on 1.23, and CSI Migration is disabled, the finalizer
is removed from the PV object if it exists.

### Some caveats

1. The fix is applicable only to CSI volumes and migrated volumes. In-tree volumes will exhibit older behavior.
2. The fix is introduced as an alpha feature in the [external-provisioner](https://github.com/kubernetes-csi/external-provisioner) under the feature gate `HonorPVReclaimPolicy`. The feature is disabled by default, and needs to be enabled explicitly.

### References

* [KEP-2644](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2644-honor-pv-reclaim-policy)
* [Volume leak issue](https://github.com/kubernetes-csi/external-provisioner/issues/546)

### How do I get involved?

The Kubernetes Slack channel [SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and migration working group teams.

Special thanks to the following people for the insightful reviews, thorough consideration and valuable contribution:

* Jan Šafránek (jsafrane)
* Xing Yang (xing-yang)
* Matthew Wong (wongma7)

Those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage). We’re rapidly growing and always welcome new contributors.