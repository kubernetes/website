---
title: Container Storage Interface (CSI) for Kubernetes GA
date: 2019-01-15
slug: container-storage-interface-ga
author: >
  Saad Ali (Google)
---

![Kubernetes Logo](/images/blog-logging/2018-04-10-container-storage-interface-beta/csi-kubernetes.png)
![CSI Logo](/images/blog-logging/2018-04-10-container-storage-interface-beta/csi-logo.png)

The Kubernetes implementation of the [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI) has been promoted to GA in the Kubernetes v1.13 release. Support for CSI was [introduced as alpha](http://blog.kubernetes.io/2018/01/introducing-container-storage-interface.html) in Kubernetes v1.9 release, and [promoted to beta](https://kubernetes.io/blog/2018/04/10/container-storage-interface-beta/) in the Kubernetes v1.10 release.

The GA milestone indicates that Kubernetes users may depend on the feature and its API without fear of backwards incompatible changes in future causing regressions. GA features are protected by the [Kubernetes deprecation policy](/docs/reference/using-api/deprecation-policy/).

## Why CSI?

Although prior to CSI Kubernetes provided a powerful volume plugin system, it was challenging to add support for new volume plugins to Kubernetes: volume plugins were “in-tree” meaning their code was part of the core Kubernetes code and shipped with the core Kubernetes binaries—vendors wanting to add support for their storage system to Kubernetes (or even fix a bug in an existing volume plugin) were forced to align with the Kubernetes release process. In addition, third-party storage code caused reliability and security issues in core Kubernetes binaries and the code was often difficult (and in some cases impossible) for Kubernetes maintainers to test and maintain.

CSI was developed as a standard for exposing arbitrary block and file storage storage systems to containerized workloads on Container Orchestration Systems (COs) like Kubernetes. With the adoption of the Container Storage Interface, the Kubernetes volume layer becomes truly extensible. Using CSI, third-party storage providers can write and deploy plugins exposing new storage systems in Kubernetes without ever having to touch the core Kubernetes code. This gives Kubernetes users more options for storage and makes the system more secure and reliable.

## What’s new?

With the promotion to GA, the Kubernetes implementation of CSI introduces the following changes:

- Kubernetes is now compatible with CSI spec [v1.0](https://github.com/container-storage-interface/spec/releases/tag/v1.0.0) and [v0.3](https://github.com/container-storage-interface/spec/releases/tag/v0.3.0) (instead of CSI spec [v0.2](https://github.com/container-storage-interface/spec/releases/tag/v0.2.0)).
  - There were breaking changes between CSI spec v0.3.0 and v1.0.0, but Kubernetes v1.13 supports both versions so either version will work with Kubernetes v1.13.
  - Please note that with the release of the CSI 1.0 API, support for CSI drivers using 0.3 and older releases of the CSI API is deprecated, and is planned to be removed in Kubernetes v1.15.
  - There were no breaking changes between CSI spec v0.2 and v0.3, so v0.2 drivers should also work with Kubernetes v1.10.0+.
  - There were breaking changes between the CSI spec v0.1 and v0.2, so very old drivers implementing CSI 0.1 must be updated to be at least 0.2 compatible before use with Kubernetes v1.10.0+.
- The Kubernetes `VolumeAttachment` object (introduced in v1.9 in the storage v1alpha1 group, and added to the v1beta1 group in v1.10) has been added to the storage v1 group in v1.13.
- The Kubernetes `CSIPersistentVolumeSource` volume type has been promoted to GA.
- The [Kubelet device plugin registration mechanism](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-registration), which is the means by which kubelet discovers new CSI drivers, has been promoted to GA in Kubernetes v1.13.

## How to deploy a CSI driver?

Kubernetes users interested in how to deploy or manage an existing CSI driver on Kubernetes should look at the documentation provided by the author of the CSI driver.

## How to use a CSI volume?

Assuming a CSI storage plugin is already deployed on a Kubernetes cluster, users can use CSI volumes through the familiar Kubernetes storage API objects: `PersistentVolumeClaims`, `PersistentVolumes`, and `StorageClasses`. Documented [here](/docs/concepts/storage/volumes/#csi).

Although the Kubernetes implementation of CSI is a GA feature in Kubernetes v1.13, it may require the following flag:

- API server binary and kubelet binaries:
  - `--allow-privileged=true`
    - Most CSI plugins will require bidirectional mount propagation, which can only be enabled for privileged pods. Privileged pods are only permitted on clusters where this flag has been set to true (this is the default in some environments like GCE, GKE, and kubeadm).

### Dynamic Provisioning

You can enable automatic creation/deletion of volumes for CSI Storage plugins that support dynamic provisioning by creating a `StorageClass` pointing to the CSI plugin.

The following StorageClass, for example, enables dynamic creation of “`fast-storage`” volumes by a CSI volume plugin called “`csi-driver.example.com`”.

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: fast-storage
provisioner: csi-driver.example.com
parameters:
  type: pd-ssd
  csi.storage.k8s.io/provisioner-secret-name: mysecret
  csi.storage.k8s.io/provisioner-secret-namespace: mynamespace
```

New for GA, the [CSI external-provisioner](https://github.com/kubernetes-csi/external-provisioner) (v1.0.1+) reserves the parameter keys prefixed with `csi.storage.k8s.io/`. If the keys do not correspond to a set of known keys the values are simply ignored (and not passed to the CSI driver). The older secret parameter keys (`csiProvisionerSecretName`, `csiProvisionerSecretNamespace`, etc.) are also supported by CSI external-provisioner v1.0.1 but are deprecated and may be removed in future releases of the CSI external-provisioner.

Dynamic provisioning is triggered by the creation of a `PersistentVolumeClaim` object. The following `PersistentVolumeClaim`, for example, triggers dynamic provisioning using the `StorageClass` above.

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-request-for-storage
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: fast-storage
```

When volume provisioning is invoked, the parameter type: `pd-ssd` and the secret any referenced secret(s) are passed to the CSI plugin `csi-driver.example.com` via a `CreateVolume` call. In response, the external volume plugin provisions a new volume and then automatically create a `PersistentVolume` object to represent the new volume. Kubernetes then binds the new `PersistentVolume` object to the `PersistentVolumeClaim`, making it ready to use.

If the `fast-storage  StorageClass` is marked as “default”, there is no need to include the `storageClassName` in the `PersistentVolumeClaim`, it will be used by default.

### Pre-Provisioned Volumes

You can always expose a pre-existing volume in Kubernetes by manually creating a PersistentVolume object to represent the existing volume. The following `PersistentVolume`, for example, exposes a volume with the name “`existingVolumeName`” belonging to a CSI storage plugin called “`csi-driver.example.com`”.

```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-manually-created-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  csi:
    driver: csi-driver.example.com
    volumeHandle: existingVolumeName
    readOnly: false
    fsType: ext4
    volumeAttributes:
      foo: bar
    controllerPublishSecretRef:
      name: mysecret1
      namespace: mynamespace
    nodeStageSecretRef:
      name: mysecret2
      namespace: mynamespace
    nodePublishSecretRef
      name: mysecret3
      namespace: mynamespace
```

### Attaching and Mounting

You can reference a `PersistentVolumeClaim` that is bound to a CSI volume in any pod or pod template.

```
kind: Pod
apiVersion: v1
metadata:
  name: my-pod
spec:
  containers:
    - name: my-frontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: my-csi-volume
  volumes:
    - name: my-csi-volume
      persistentVolumeClaim:
        claimName: my-request-for-storage
```

When the pod referencing a CSI volume is scheduled, Kubernetes will trigger the appropriate operations against the external CSI plugin (`ControllerPublishVolume`, `NodeStageVolume`, `NodePublishVolume`, etc.) to ensure the specified volume is attached, mounted, and ready to use by the containers in the pod.

For more details please see the CSI implementation [design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md) and [documentation](/docs/concepts/storage/volumes/#csi).

## How to write a CSI Driver?

The [kubernetes-csi](https://kubernetes-csi.github.io/) site details how to develop, deploy, and test a CSI driver on Kubernetes. In general, CSI Drivers should be deployed on Kubernetes along with the following sidecar (helper) containers:

- [external-attacher](https://github.com/kubernetes-csi/external-attacher)
  - Watches Kubernetes `VolumeAttachment` objects and triggers `ControllerPublish` and `ControllerUnpublish` operations against a CSI endpoint.
- [external-provisioner](https://github.com/kubernetes-csi/external-provisioner)
  - Watches Kubernetes `PersistentVolumeClaim` objects and triggers `CreateVolume` and `DeleteVolume` operations against a CSI endpoint.
- [node-driver-registrar](https://github.com/kubernetes-csi/node-driver-registrar)
  - Registers the CSI driver with kubelet using the [Kubelet device plugin mechanism](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-registration).
- [cluster-driver-registrar](https://github.com/kubernetes-csi/cluster-driver-registrar) (Alpha)
  - Registers a CSI Driver with the Kubernetes cluster by creating a `CSIDriver` object which enables the driver to customize how Kubernetes interacts with it.
- [external-snapshotter](https://github.com/kubernetes-csi/external-snapshotter) (Alpha)
  - Watches Kubernetes `VolumeSnapshot` CRD objects and triggers `CreateSnapshot` and `DeleteSnapshot` operations against a CSI endpoint.
- [livenessprobe](https://github.com/kubernetes-csi/livenessprobe)
  - May be included in a CSI plugin pod to enable the [Kubernetes Liveness Probe](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) mechanism.

Storage vendors can build Kubernetes deployments for their plugins using these components, while leaving their CSI driver completely unaware of Kubernetes.

## List of CSI Drivers

CSI drivers are developed and maintained by third parties. You can find a non-definitive list of CSI drivers [here](https://kubernetes-csi.github.io/docs/drivers.html).

## What about in-tree volume plugins?

There is a plan to migrate most of the persistent, remote in-tree volume plugins to CSI. For more details see [design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/csi-migration.md).

## Limitations of GA

The GA implementation of CSI has the following limitations:

- Ephemeral local volumes must create a PVC (pod inline referencing of CSI volumes is not supported).

## What’s next?

- Work on moving Kubernetes CSI features that are still alpha to beta:
  - Raw block volumes
  - Topology awareness (the ability for Kubernetes to understand and influence where a CSI volume is provisioned (zone, regions, etc.).
  - Features depending on CSI CRDs (e.g. “Skip attach” and “Pod info on mount”).
  - Volume Snapshots
- Work on completing support for local ephemeral volumes.
- Work on migrating remote persistent in-tree volume plugins to CSI.

## How to get involved?
The Kubernetes Slack channel [wg-csi](https://kubernetes.slack.com/messages/C8EJ01Z46/details/) and the Google group [kubernetes-sig-storage-wg-csi](https://groups.google.com/forum/#!forum/kubernetes-sig-storage-wg-csi) along with any of the standard [SIG storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are all great mediums to reach out to the SIG Storage team.

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together. We offer a huge thank you to the new contributors who stepped up this quarter to help the project reach GA:

- Saad Ali ([saad-ali](https://github.com/saad-ali))
- Michelle Au ([msau42](https://github.com/msau42))
- Serguei Bezverkhi ([sbezverk](https://github.com/sbezverk))
- Masaki Kimura ([mkimuram](https://github.com/mkimuram))
- Patrick Ohly ([pohly](https://github.com/pohly))
- Luis Pabón ([lpabon](https://github.com/lpabon))
- Jan Šafránek ([jsafrane](https://github.com/jsafrane))
- Vladimir Vivien ([vladimirvivien](https://github.com/vladimirvivien))
- Cheng Xing ([verult](https://github.com/verult))
- Xing Yang ([xing-yang](https://github.com/xing-yang))
- David Zhu ([davidz627](https://github.com/davidz627))

If you’re interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.
