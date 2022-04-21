---
layout: blog
title: "Volume expansion going GA in v1.24"
date: 2022-04-18
slug: volume-expansion-ga
---

**Author:** Hemant Kumar

## Introduction

Volume expansion was introduced as a alpha feature in Kubernetes 1.8 and it went beta in 1.11 and with Kubernetes 1.24 we are excited to announce general availability(GA)
of volume expansion.

This feature allows Kubernetes users to simply edit their `PersistentVolumeClaim` objects and specify new size in PVC Spec and Kubernetes will automatically expand the volume
using storage backend and also expand the underlying file system in-use by the Pod without requiring any downtime at all if possible.


### How to use volume expansion

Using volume expansion is as simple as editing `storage` field of pvc spec and specifying new size. For example - given following PVC:

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
      storage: 1Gi --> specify new size here
```

Users can request expansion of the underlying volume by specifying a new value instead of old `1Gi` size. Once expansion is initiated - pvc's conditions can be monitored
for completion of volume expansion operation.

When Kubernetes starts expanding the volume - it will add `Resizing` condition to the PVC, which will be removed once expansion completes. More information about progress of
expansion operation can also be obtained by monitoring events associated with pvc:

```
~> kubectl describe pvc <pvc>
```

### Storage driver support

Not every volume type however is expandable by default. Some volume types such as - intree hostpath volumes are not expandable at all. For CSI volumes - the CSI driver
must have capability `EXPAND_VOLUME` in controller or node service (or both if appropriate). For CSI volumes - please refer to documentation of your CSI driver, to find out
if it supports volume expansion.

Please refer to volume expansion documentation for intree volume types which support volume expansion - [Expanding Persistent Volumes](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)


In general to provide some degree of control over volumes that can be expanded, only dynamically provisioned PVCs whose storage class has `allowVolumeExpansion` parameter set to `true` are expandable.

A Kubernetes admin must edit storage class object and set `allowVolumeExpansion` field to true. For example:

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

### Online vs offline expansion

By default Kubernetes attempts to expand volumes immediately after user requests new size. Expansion happens online if one or more Pods are using the volume and as a result volume expansion requires no application downtime. File System expansion on the node is also performed online and hence does not require shutting down the Pod that was using the PVC.

In some cases though - if underlying Storage Driver can only support offline expansion, users of the PVC must take down their Pod before expansion can succeed. Please refer to documentation of your storage
provider to find out - what mode of volume expansion it supports.

When volume expansion was introduced as an alpha feature, it only supported offline file system expansion on the node and hence required users to restart their pods for file system resizing to finish. This behaviour has been changed and Kubernetes tries its best to full-fill user's request regardless of the fact that if volume is online or offline. If Storage Provider supports online expansion - no Pod restart should be necessary for volume expansion to finish.

### ## What’s next?

Although Volume expansion is going GA with 1.24 - we are continously working to make it simpler for users of Kubernetes to expand their persistent volumes. Kubernetes 1.23 introduced feature `RecoverVolumeExpansionFailure` - so as users can themselves recover from volume expansion failures (usually recovering from volume expansion requires admin intervention) whenever possible. See - [Rcovering from volume expansion failure](/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes) for more details.

Kubernetes community is also working on statefulset expansion - so as all underlying PVCs created by a statefulset can be expanded by directly editing statefulset template. See - [Statefulset volume resize](https://github.com/kubernetes/enhancements/pull/2842) feature for more details.
