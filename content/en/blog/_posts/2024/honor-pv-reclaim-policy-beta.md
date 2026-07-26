---
layout: blog
title: 'Kubernetes 1.31: Prevent PersistentVolume Leaks When Deleting out of Order'
date: 2024-08-16
slug: kubernetes-1-31-prevent-persistentvolume-leaks-when-deleting-out-of-order
author: >
  Deepak Kinni (Broadcom)
---

[PersistentVolume](/docs/concepts/storage/persistent-volumes/) (or PVs for short) are
associated with [Reclaim Policy](/docs/concepts/storage/persistent-volumes/#reclaim-policy).
The reclaim policy is used to determine the actions that need to be taken by the storage
backend on deletion of the PVC Bound to a PV.
When the reclaim policy is `Delete`, the expectation is that the storage backend
releases the storage resource allocated for the PV. In essence, the reclaim
policy needs to be honored on PV deletion.

With the recent Kubernetes v1.31 release, a beta feature lets you configure your
cluster to behave that way and honor the configured reclaim policy.


## How did reclaim work in previous Kubernetes releases?

[PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#Introduction) (or PVC for short) is
a user's request for storage. A PV and PVC are considered [Bound](/docs/concepts/storage/persistent-volumes/#Binding)
if a newly created PV or a matching PV is found. The PVs themselves are
backed by volumes allocated by the storage backend.

Normally, if the volume is to be deleted, then the expectation is to delete the
PVC for a bound PV-PVC pair. However, there are no restrictions on deleting a PV
before deleting a PVC.

First, I'll demonstrate the behavior for clusters running an older version of Kubernetes.

#### Retrieve a PVC that is bound to a PV

Retrieve an existing PVC `example-vanilla-block-pvc`
```
kubectl get pvc example-vanilla-block-pvc
```
The following output shows the PVC and its bound PV; the PV is shown under the `VOLUME` column:
```
NAME                        STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS               AGE
example-vanilla-block-pvc   Bound    pvc-6791fdd4-5fad-438e-a7fb-16410363e3da   5Gi        RWO            example-vanilla-block-sc   19s
```

#### Delete PV

When I try to delete a bound PV, the kubectl session blocks and the `kubectl` 
tool does not return back control to the shell; for example:

```
kubectl delete pv pvc-6791fdd4-5fad-438e-a7fb-16410363e3da
```

```
persistentvolume "pvc-6791fdd4-5fad-438e-a7fb-16410363e3da" deleted
^C
```

#### Retrieving the PV
```
kubectl get pv pvc-6791fdd4-5fad-438e-a7fb-16410363e3da
```

It can be observed that the PV is in a `Terminating` state
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

Although the PV is deleted, the underlying storage resource is not deleted and
needs to be removed manually.

To sum up, the reclaim policy associated with the PersistentVolume is currently
ignored under certain circumstances. For a `Bound` PV-PVC pair, the ordering of PV-PVC
deletion determines whether the PV reclaim policy is honored. The reclaim policy
is honored if the PVC is deleted first; however, if the PV is deleted prior to
deleting the PVC, then the reclaim policy is not exercised. As a result of this behavior,
the associated storage asset in the external infrastructure is not removed.

## PV reclaim policy with Kubernetes v1.31

The new behavior ensures that the underlying storage object is deleted from the backend when users attempt to delete a PV manually.

#### How to enable new behavior?

To take advantage of the new behavior, you must have upgraded your cluster to the v1.31 release of Kubernetes
and run the CSI [`external-provisioner`](https://github.com/kubernetes-csi/external-provisioner) version `5.0.1` or later.

#### How does it work?

For CSI volumes, the new behavior is achieved by adding a [finalizer](/docs/concepts/overview/working-with-objects/finalizers/) `external-provisioner.volume.kubernetes.io/finalizer`
on new and existing PVs. The finalizer is only removed after the storage from the backend is deleted.
`

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

The [finalizer](/docs/concepts/overview/working-with-objects/finalizers/) prevents this
PersistentVolume from being removed from the
cluster. As stated previously, the finalizer is only removed from the PV object
after it is successfully deleted from the storage backend. To learn more about
finalizers, please refer to [Using Finalizers to Control Deletion](/blog/2021/05/14/using-finalizers-to-control-deletion/).

Similarly, the finalizer `kubernetes.io/pv-controller` is added to dynamically provisioned in-tree plugin volumes.

#### What about CSI migrated volumes?

The fix applies to CSI migrated volumes as well. 

### Some caveats

The fix does not apply to statically provisioned in-tree plugin volumes.

### References

* [KEP-2644](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2644-honor-pv-reclaim-policy)
* [Volume leak issue](https://github.com/kubernetes-csi/external-provisioner/issues/546)

### How do I get involved?

The Kubernetes Slack channel [SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and migration working group teams.

Special thanks to the following people for the insightful reviews, thorough consideration and valuable contribution:

* Fan Baofa (carlory)
* Jan Šafránek (jsafrane)
* Xing Yang (xing-yang)
* Matthew Wong (wongma7)

Join the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage) if you're interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system. We’re rapidly growing and always welcome new contributors.