---
layout: blog
title: "Kubernetes 1.31: VolumeAttributesClass for Volume Modification Beta"
date: 2024-08-15
slug: kubernetes-1-31-volume-attributes-class
author: >
  Sunny Song (Google)
  Matthew Cary (Google)
---

Volumes in Kubernetes have been described by two attributes: their storage class, and
their capacity. The storage class is an immutable property of the volume, while the
capacity can be changed dynamically with [volume
resize](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims).

This complicates vertical scaling of workloads with volumes. While cloud providers and
storage vendors often offer volumes which allow specifying IO quality of service
(Performance) parameters like IOPS or throughput and tuning them as workloads operate,
Kubernetes has no API which allows changing them.

We are pleased to announce that the [VolumeAttributesClass
KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md),
alpha since Kubernetes 1.29, will be beta in 1.31. This provides a generic,
Kubernetes-native API for modifying volume parameters like provisioned IO.

Like all new volume features in Kubernetes, this API is implemented via the [container
storage interface (CSI)](https://kubernetes-csi.github.io/docs/). In addition to the
VolumeAttributesClass feature gate, your provisioner-specific CSI driver must support the
new ModifyVolume API which is the CSI side of this feature.

See the [full
documentation](https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/)
for all details. Here we show the common workflow.

### Dynamically modifying volume attributes.

A `VolumeAttributesClass` is a cluster-scoped resource that specifies provisioner-specific
attributes. These are created by the cluster administrator in the same way as storage
classes. For example, a series of gold, silver and bronze volume attribute classes can be
created for volumes with greater or lessor amounts of provisioned IO.

```yaml
apiVersion: storage.k8s.io/v1alpha1
kind: VolumeAttributesClass
metadata:
  name: silver
driverName: your-csi-driver
parameters:
  provisioned-iops: "500"
  provisioned-throughput: "50MiB/s"
---
apiVersion: storage.k8s.io/v1alpha1
kind: VolumeAttributesClass
metadata:
  name: gold
driverName: your-csi-driver
parameters:
  provisioned-iops: "10000"
  provisioned-throughput: "500MiB/s"
```
  
An attribute class is added to a PVC in much the same way as a storage class.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pv-claim
spec:
  storageClassName: any-storage-class
  volumeAttributesClassName: silver
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 64Gi
```

Unlike a storage class, the volume attributes class can be changed:

```
kubectl patch pvc test-pv-claim -p '{"spec": "volumeAttributesClassName": "gold"}'
```

Kubernetes will work with the CSI driver to update the attributes of the
volume. The status of the PVC will track the current and desired attributes
class. The PV resource will also be updated with the new volume attributes class
which will be set to the currently active attributes of the PV.

### Limitations with the beta

As a beta feature, there are still some features which are planned for GA but not yet
present. The largest is quota support, see the
[KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/3751-volume-attributes-class/README.md)
and discussion in
[sig-storage](https://github.com/kubernetes/community/tree/master/sig-storage) for details.

See the [Kubernetes CSI driver
list](https://kubernetes-csi.github.io/docs/drivers.html) for up-to-date
information of support for this feature in CSI drivers.
