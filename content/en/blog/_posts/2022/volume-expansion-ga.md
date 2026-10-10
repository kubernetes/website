---
layout: blog
title: "Kubernetes 1.24: Volume Expansion Now A Stable Feature"
date: 2022-05-05
slug: volume-expansion-ga
author: >
  Hemant Kumar (Red Hat)
---

Volume expansion was introduced as a alpha feature in Kubernetes 1.8 and it went beta in 1.11 and with Kubernetes 1.24 we are excited to announce general availability(GA)
of volume expansion.

This feature allows Kubernetes users to simply edit their `PersistentVolumeClaim` objects and specify new size in PVC Spec and Kubernetes will automatically expand the volume
using storage backend and also expand the underlying file system in-use by the Pod without requiring any downtime at all if possible.


### How to use volume expansion

You can trigger expansion for a PersistentVolume by editing the `spec` field of a PVC, specifying a different
(and larger) storage request. For example, given following PVC:

```
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi # specify new size here
```

You can request expansion of the underlying PersistentVolume by specifying a new value instead of old `1Gi` size.
Once you've changed the requested size, watch the `status.conditions` field of the PVC to see if the
resize has completed.

When Kubernetes starts expanding the volume - it will add `Resizing` condition to the PVC, which will be removed once expansion completes. More information about progress of
expansion operation can also be obtained by monitoring events associated with the PVC:

```
kubectl describe pvc <pvc>
```

### Storage driver support

Not every volume type however is expandable by default. Some volume types such as - intree hostpath volumes are not expandable at all. For CSI volumes - the CSI driver
must have capability `EXPAND_VOLUME` in controller or node service (or both if appropriate). Please refer to documentation of your CSI driver, to find out
if it supports volume expansion.

Please refer to volume expansion documentation for intree volume types which support volume expansion - [Expanding Persistent Volumes](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims).


In general to provide some degree of control over volumes that can be expanded, only dynamically provisioned PVCs whose storage class has `allowVolumeExpansion` parameter set to `true` are expandable.

A Kubernetes cluster administrator must edit the appropriate StorageClass object and set
the `allowVolumeExpansion` field to `true`. For example:

```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp2-default
provisioner: kubernetes.io/aws-ebs
parameters:
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

### Online expansion compared to offline expansion

By default, Kubernetes attempts to expand volumes immediately after user requests a resize.
If one or more Pods are using the volume, Kubernetes tries to expands the volume using an online resize;
as a result volume expansion usually requires no application downtime.
Filesystem expansion on the node is also performed online and hence does not require shutting
down any Pod that was using the PVC.

If you expand a PersistentVolume that is not in use, Kubernetes does an offline resize (and,
because the volume isn't in use, there is again no workload disruption).

In some cases though - if underlying Storage Driver can only support offline expansion, users of the PVC must take down their Pod before expansion can succeed. Please refer to documentation of your storage
provider to find out - what mode of volume expansion it supports.

When volume expansion was introduced as an alpha feature, Kubernetes only supported offline filesystem
expansion on the node and hence required users to restart their pods for file system resizing to finish. 
His behaviour has been changed and Kubernetes tries its best to fulfil any resize request regardless
of whether the underlying PersistentVolume volume is online or offline. If your storage provider supports
online expansion then no Pod restart should be necessary for volume expansion to finish.

## Next steps

Although volume expansion is now stable as part of the recent v1.24 release,
SIG Storage are working to make it even simpler for users of Kubernetes to expand their persistent storage.
Kubernetes 1.23 introduced features for triggering recovery from failed volume expansion, allowing users
to attempt self-service healing after a failed resize.
See [Recovering from volume expansion failure](/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes) for more details.

The Kubernetes contributor community is also discussing the potential for StatefulSet-driven storage expansion. This proposed
feature would let you trigger expansion for all underlying PVs that are providing storage to a StatefulSet,
by directly editing the StatefulSet object.
See the [Support Volume Expansion Through StatefulSets](https://github.com/kubernetes/enhancements/issues/661) enhancement proposal for more details.
