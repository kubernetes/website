---
layout: blog
title: 'Kubernetes v1.33: Prevent PersistentVolume Leaks When Deleting out of Order graduates to GA'
date: 2025-05-05T10:30:00-08:00
slug: kubernetes-v1-33-prevent-persistentvolume-leaks-when-deleting-out-of-order-graduate-to-ga
author: >
  Deepak Kinni (Broadcom)
---

I am thrilled to announce that the feature to prevent
[PersistentVolume](/docs/concepts/storage/persistent-volumes/) (or PVs for short)
leaks when deleting out of order has graduated to General Availability (GA) in
Kubernetes v1.33! This improvement, initially introduced as a beta
feature in Kubernetes v1.31, ensures that your storage resources are properly
reclaimed, preventing unwanted leaks.

## How did reclaim work in previous Kubernetes releases?

[PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#Introduction) (or PVC for short) is
a user's request for storage. A PV and PVC are considered [Bound](/docs/concepts/storage/persistent-volumes/#Binding)
if a newly created PV or a matching PV is found. The PVs themselves are
backed by volumes allocated by the storage backend.

Normally, if the volume is to be deleted, then the expectation is to delete the
PVC for a bound PV-PVC pair. However, there are no restrictions on deleting a PV
before deleting a PVC.

For a `Bound` PV-PVC pair, the ordering of PV-PVC deletion determines whether
the PV reclaim policy is honored. The reclaim policy is honored if the PVC is
deleted first; however, if the PV is deleted prior to deleting the PVC, then the
reclaim policy is not exercised. As a result of this behavior, the associated
storage asset in the external infrastructure is not removed.

## PV reclaim policy with Kubernetes v1.33

With the graduation to GA in Kubernetes v1.33, this issue is now resolved. Kubernetes
now reliably honors the configured `Delete` reclaim policy, even when PVs are deleted
before their bound PVCs. This is achieved through the use of finalizers,
ensuring that the storage backend releases the allocated storage resource as intended.

### How does it work?

For CSI volumes, the new behavior is achieved by adding a [finalizer](/docs/concepts/overview/working-with-objects/finalizers/) `external-provisioner.volume.kubernetes.io/finalizer`
on new and existing PVs. The finalizer is only removed after the storage from the backend is deleted. Addition or removal of finalizer is handled by `external-provisioner`
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
    pv.kubernetes.io/provisioned-by: csi.example.driver.com
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
    driver: csi.example.driver.com
    fsType: ext4
    volumeAttributes:
      storage.kubernetes.io/csiProvisionerIdentity: 1637110610497-8081-csi.example.driver.com
      type: CNS Block Volume
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

### Important note

The fix does not apply to statically provisioned in-tree plugin volumes.

## How to enable new behavior?

To take advantage of the new behavior, you must have upgraded your cluster to the v1.33 release of Kubernetes
and run the CSI [`external-provisioner`](https://github.com/kubernetes-csi/external-provisioner) version `5.0.1` or later.
The feature was released as beta in v1.31 release of Kubernetes, where it was enabled by default.

## References

* [KEP-2644](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2644-honor-pv-reclaim-policy)
* [Volume leak issue](https://github.com/kubernetes-csi/external-provisioner/issues/546)
* [Beta Release Blog](/blog/2024/08/16/kubernetes-1-31-prevent-persistentvolume-leaks-when-deleting-out-of-order/)

## How do I get involved?

The Kubernetes Slack channel [SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and migration working group teams.

Special thanks to the following people for the insightful reviews, thorough consideration and valuable contribution:

* Fan Baofa (carlory)
* Jan Šafránek (jsafrane)
* Xing Yang (xing-yang)
* Matthew Wong (wongma7)

Join the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage) if you're interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system. We’re rapidly growing and always welcome new contributors.