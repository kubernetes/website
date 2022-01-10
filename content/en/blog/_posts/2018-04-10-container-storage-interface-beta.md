---
title: Container Storage Interface (CSI) for Kubernetes Goes Beta
date: 2018-04-10
slug: container-storage-interface-beta
---

![Kubernetes Logo](/images/blog-logging/2018-04-10-container-storage-interface-beta/csi-kubernetes.png)
![CSI Logo](/images/blog-logging/2018-04-10-container-storage-interface-beta/csi-logo.png)

The Kubernetes implementation of the Container Storage Interface (CSI) is now beta in Kubernetes v1.10. CSI was [introduced as alpha](https://kubernetes.io/blog/2018/01/introducing-container-storage-interface) in Kubernetes v1.9.

Kubernetes features are generally introduced as alpha and moved to beta (and eventually to stable/GA) over subsequent Kubernetes releases. This process allows Kubernetes developers to get feedback, discover and fix issues, iterate on the designs, and deliver high quality, production grade features.

## Why introduce Container Storage Interface in Kubernetes?

Although Kubernetes already provides a powerful volume plugin system that makes it easy to consume different types of block and file storage, adding support for new volume plugins has been challenging. Because volume plugins are currently “in-tree”—volume plugins are part of the core Kubernetes code and shipped with the core Kubernetes binaries—vendors wanting to add support for their storage system to Kubernetes (or even fix a bug in an existing volume plugin) must align themselves with the Kubernetes release process.

With the adoption of the Container Storage Interface, the Kubernetes volume layer becomes truly extensible. Third party storage developers can now write and deploy volume plugins exposing new storage systems in Kubernetes without ever having to touch the core Kubernetes code. This will result in even more options for the storage that backs Kubernetes users’ stateful containerized workloads.

## What’s new in Beta?

With the promotion to beta CSI is now enabled by default on standard Kubernetes deployments instead of being opt-in.

The move of the Kubernetes implementation of CSI to beta also means:
* Kubernetes is compatible with [v0.2](https://github.com/container-storage-interface/spec/releases/tag/v0.2.0) of the CSI spec (instead of [v0.1](https://github.com/container-storage-interface/spec/releases/tag/v0.1.0))
  * There were breaking changes between the CSI spec v0.1 and v0.2, so existing CSI drivers must be updated to be 0.2 compatible before use with Kubernetes 1.10.0+.
* [Mount propagation](/docs/concepts/storage/volumes/#mount-propagation), a feature that allows bidirectional mounts between containers and host (a requirement for containerized CSI drivers), has also moved to beta.
* The Kubernetes `VolumeAttachment` object, introduced in v1.9 in the storage v1alpha1 group, has been added to the storage v1beta1 group.
* The Kubernetes `CSIPersistentVolumeSource` object has been promoted to beta.
A `VolumeAttributes` field was added to Kubernetes `CSIPersistentVolumeSource` object (in alpha this was passed around via annotations).
* Node authorizer has been updated to limit access to `VolumeAttachment` objects from kubelet.
* The Kubernetes `CSIPersistentVolumeSource` object and the CSI external-provisioner have been modified to allow passing of secrets to the CSI volume plugin.
* The Kubernetes `CSIPersistentVolumeSource` has been modified to allow passing in filesystem type (previously always assumed to be `ext4`).
* A new optional call, `NodeStageVolume`, has been added to the CSI spec, and the Kubernetes CSI volume plugin has been modified to call `NodeStageVolume` during `MountDevice` (in alpha this step was a no-op).

## How do I deploy a CSI driver on a Kubernetes Cluster?

CSI plugin authors must provide their own instructions for deploying their plugin on Kubernetes.

The Kubernetes-CSI implementation team created a [sample hostpath CSI driver](https://kubernetes-csi.github.io/docs/example.html). The sample provides a rough idea of what the deployment process for a CSI driver looks like. Production drivers, however, would deploy node components via a DaemonSet and controller components via a StatefulSet rather than a single pod (for example, see the deployment files for the [GCE PD driver](https://github.com/GoogleCloudPlatform/compute-persistent-disk-csi-driver/blob/master/deploy/kubernetes/README.md)).

## How do I use a CSI Volume in my Kubernetes pod?

Assuming a CSI storage plugin is already deployed on your cluster, you can use it through the familiar Kubernetes storage primitives: `PersistentVolumeClaims`, `PersistentVolumes`, and `StorageClasses`.

CSI is a beta feature in Kubernetes v1.10. Although it is enabled by default, it may require the following flag:
* API server binary and kubelet binaries:
  * `--allow-privileged=true`
    * Most CSI plugins will require bidirectional mount propagation, which can only be enabled for privileged pods. Privileged pods are only permitted on clusters where this flag has been set to true (this is the default in some environments like GCE, GKE, and kubeadm).

### Dynamic Provisioning

You can enable automatic creation/deletion of volumes for CSI Storage plugins that support dynamic provisioning by creating a `StorageClass` pointing to the CSI plugin.

The following `StorageClass`, for example, enables dynamic creation of “`fast-storage`” volumes by a CSI volume plugin called “`com.example.csi-driver`”.

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: fast-storage
provisioner: com.example.csi-driver
parameters:
  type: pd-ssd
  csiProvisionerSecretName: mysecret
  csiProvisionerSecretNamespace: mynamespace
```  

New for beta, the [default CSI external-provisioner](https://github.com/kubernetes-csi/external-provisioner) reserves the parameter keys `csiProvisionerSecretName` and `csiProvisionerSecretNamespace`. If specified, it fetches the secret and passes it to the CSI driver during provisioning.

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

When volume provisioning is invoked, the parameter type: `pd-ssd` and the secret any referenced secret(s) are passed to the CSI plugin `com.example.csi-driver` via a `CreateVolume call`. In response, the external volume plugin provisions a new volume and then automatically create a `PersistentVolume` object to represent the new volume. Kubernetes then binds the new `PersistentVolume` object to the `PersistentVolumeClaim`, making it ready to use.

If the fast-storage  StorageClass is marked as “default”, there is no need to include the storageClassName in the PersistentVolumeClaim, it will be used by default.

### Pre-Provisioned Volumes

You can always expose a pre-existing volume in Kubernetes by manually creating a `PersistentVolume` object to represent the existing volume. The following `PersistentVolume`, for example, exposes a volume with the name “`existingVolumeName`” belonging to a CSI storage plugin called “`com.example.csi-driver`”.

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
    driver: com.example.csi-driver
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

For more details please see the CSI implementation [design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md) and [documentation](https://kubernetes-csi.github.io/).

## How do I write a CSI driver?

CSI Volume Driver deployments on Kubernetes must meet some [minimum requirements](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md#third-party-csi-volume-drivers).

The minimum requirements document also outlines the [suggested mechanism](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md#recommended-mechanism-for-deploying-csi-drivers-on-kubernetes) for deploying an arbitrary containerized CSI driver on Kubernetes. This mechanism can be used by a Storage Provider to simplify deployment of containerized CSI compatible volume drivers on Kubernetes.

As part of the suggested deployment process, the Kubernetes team provides the following sidecar (helper) containers:
* [external-attacher](https://github.com/kubernetes-csi/external-attacher)
  * watches Kubernetes `VolumeAttachment` objects and triggers `ControllerPublish` and `ControllerUnpublish` operations against a CSI endpoint
* [external-provisioner](https://github.com/kubernetes-csi/external-provisioner)
  * watches Kubernetes `PersistentVolumeClaim` objects and triggers `CreateVolume` and `DeleteVolume` operations against a CSI endpoint
* [driver-registrar](https://github.com/kubernetes-csi/driver-registrar)
  * registers the CSI driver with kubelet (in the future) and adds the drivers custom `NodeId` (retrieved via `GetNodeID` call against the CSI endpoint) to an annotation on the Kubernetes Node API Object
* [livenessprobe](https://github.com/kubernetes-csi/livenessprobe)
  * can be included in a CSI plugin pod to enable the [Kubernetes Liveness Probe](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) mechanism

Storage vendors can build Kubernetes deployments for their plugins using these components, while leaving their CSI driver completely unaware of Kubernetes.

## Where can I find CSI drivers?

CSI drivers are developed and maintained by third parties. You can find a non-definitive list of some [sample and production CSI drivers](https://kubernetes-csi.github.io/docs/drivers.html).

## What about FlexVolumes?

As mentioned in the [alpha release blog post](https://kubernetes.io/blog/2018/01/introducing-container-storage-interface), [FlexVolume plugin](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md) was an earlier attempt to make the Kubernetes volume plugin system extensible. Although it enables third party storage vendors to write drivers “out-of-tree”, because it is an exec based API, FlexVolumes requires files for third party driver binaries (or scripts) to be copied to a special plugin directory on the root filesystem of every node (and, in some cases, master) machine. This requires a cluster admin to have write access to the host filesystem for each node and some external mechanism to ensure that the driver file is recreated if deleted, just to deploy a volume plugin.

In addition to being difficult to deploy, Flex did not address the pain of plugin dependencies: Volume plugins tend to have many external requirements (on mount and filesystem tools, for example). These dependencies are assumed to be available on the underlying host OS, which is often not the case.

CSI addresses these issues by not only enabling storage plugins to be developed out-of-tree, but also containerized and deployed via standard Kubernetes primitives.

If you still have questions about in-tree volumes vs CSI vs Flex, please see the [Volume Plugin FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).

## What will happen to the in-tree volume plugins?

Once CSI reaches stability, we plan to migrate most of the in-tree volume plugins to CSI. Stay tuned for more details as the Kubernetes CSI implementation approaches stable.

## What are the limitations of beta?

The beta implementation of CSI has the following limitations:
* Block volumes are not supported; only file.
* CSI drivers must be deployed with the provided external-attacher sidecar plugin, even if they don’t implement `ControllerPublishVolume`.
* Topology awareness is not supported for CSI volumes, including the ability to share information about where a volume is provisioned (zone, regions, etc.) with the Kubernetes scheduler to allow it to make smarter scheduling decisions, and the ability for the Kubernetes scheduler or a cluster administrator or an application developer to specify where a volume should be provisioned.
* `driver-registrar` requires permissions to modify all Kubernetes node API objects which could result in a compromised node gaining the ability to do the same.

## What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the CSI implementation to GA in 1.12.

The team would like to encourage storage vendors to start developing CSI drivers, deploying them on Kubernetes, and sharing feedback with the team via the Kubernetes Slack channel [wg-csi](https://kubernetes.slack.com/messages/C8EJ01Z46/details/), the Google group [kubernetes-sig-storage-wg-csi](https://groups.google.com/forum/#!forum/kubernetes-sig-storage-wg-csi), or any of the standard [SIG storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact).

## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together.

In addition to the contributors who have been working on the Kubernetes implementation of CSI since alpha:
* Bradley Childs ([childsb](https://github.com/childsb))
* Chakravarthy Nelluri ([chakri-nelluri](https://github.com/chakri-nelluri))
* Jan Šafránek ([jsafrane](https://github.com/jsafrane))
* Luis Pabón ([lpabon](https://github.com/lpabon))
* Saad Ali ([saad-ali](https://github.com/saad-ali))
* Vladimir Vivien ([vladimirvivien](https://github.com/vladimirvivien))

We offer a huge thank you to the new contributors who stepped up this quarter to help the project reach beta:
* David Zhu ([davidz627](https://github.com/davidz627))
* Edison Xiang ([edisonxiang](https://github.com/edisonxiang))
* Felipe Musse ([musse](https://github.com/musse))
* Lin Ml ([mlmhl](https://github.com/mlmhl))
* Lin Youchong ([linyouchong](https://github.com/linyouchong))
* Pietro Menna ([pietromenna](https://github.com/pietromenna))
* Serguei Bezverkhi ([sbezverk](https://github.com/sbezverk))
* Xing Yang ([xing-yang](https://github.com/xing-yang))
* Yuquan Ren ([NickrenREN](https://github.com/NickrenREN))

If you’re interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.
