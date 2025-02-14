---
title: " Introducing Container Storage Interface (CSI) Alpha for Kubernetes "
date: 2018-01-10
slug: introducing-container-storage-interface
url: /blog/2018/01/Introducing-Container-Storage-Interface
---

One of the key differentiators for Kubernetes has been a powerful [volume plugin system](/docs/concepts/storage/volumes/) that enables many different types of storage systems to:  

1. Automatically create storage when required.
2. Make storage available to containers wherever they’re scheduled.
3. Automatically delete the storage when no longer needed.
Adding support for new storage systems to Kubernetes, however, has been challenging.   

Kubernetes 1.9 introduces an [alpha implementation of the Container Storage Interface (CSI)](https://github.com/kubernetes/features/issues/178) which makes installing new volume plugins as easy as deploying a pod. It also enables third-party storage providers to develop solutions without the need to add to the core Kubernetes codebase.  

Because the feature is alpha in 1.9, it must be explicitly enabled. Alpha features are not recommended for production usage, but are a good indication of the direction the project is headed (in this case, towards a more extensible and standards based Kubernetes storage ecosystem).  


### Why Kubernetes CSI?
Kubernetes volume plugins are currently “in-tree”, meaning they’re linked, compiled, built, and shipped with the core kubernetes binaries. Adding support for a new storage system to Kubernetes (a volume plugin) requires checking code into the core Kubernetes repository. But aligning with the Kubernetes release process is painful for many plugin developers.  

The existing [Flex Volume plugin](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md) attempted to address this pain by exposing an exec based API for external volume plugins. Although it enables third party storage vendors to write drivers out-of-tree, in order to deploy the third party driver files it requires access to the root filesystem of node and master machines.  

In addition to being difficult to deploy, Flex did not address the pain of plugin dependencies: Volume plugins tend to have many external requirements (on mount and filesystem tools, for example). These dependencies are assumed to be available on the underlying host OS which is often not the case (and installing them requires access to the root filesystem of node machine).  

CSI addresses all of these issues by enabling storage plugins to be developed out-of-tree, containerized, deployed via standard Kubernetes primitives, and consumed through the Kubernetes storage primitives users know and love (PersistentVolumeClaims, PersistentVolumes, StorageClasses).  


### What is CSI?
The goal of CSI is to establish a standardized mechanism for Container Orchestration Systems (COs) to expose arbitrary storage systems to their containerized workloads. The CSI specification emerged from cooperation between community members from various Container Orchestration Systems (COs)--including Kubernetes, Mesos, Docker, and Cloud Foundry. The specification is developed, independent of Kubernetes, and maintained at [https://github.com/container-storage-interface/spec/blob/master/spec.md](https://github.com/container-storage-interface/spec/blob/master/spec.md).  

Kubernetes v1.9 exposes an alpha implementation of the CSI specification enabling CSI compatible volume drivers to be deployed on Kubernetes and consumed by Kubernetes workloads.  


### How do I deploy a CSI driver on a Kubernetes Cluster?
CSI plugin authors will provide their own instructions for deploying their plugin on Kubernetes.  


### How do I use a CSI Volume?
Assuming a CSI storage plugin is already deployed on your cluster, you can use it through the familiar Kubernetes storage primitives: PersistentVolumeClaims, PersistentVolumes, and StorageClasses.  

CSI is an alpha feature in Kubernetes v1.9. To enable it, set the following flags:


```
CSI is an alpha feature in Kubernetes v1.9. To enable it, set the following flags:

API server binary:
--feature-gates=CSIPersistentVolume=true
--runtime-config=storage.k8s.io/v1alpha1=true
API server binary and kubelet binaries:
--feature-gates=MountPropagation=true
--allow-privileged=true
```

### Dynamic Provisioning
You can enable automatic creation/deletion of volumes for CSI Storage plugins that support dynamic provisioning by creating a StorageClass pointing to the CSI plugin.  

The following StorageClass, for example, enables dynamic creation of “fast-storage” volumes by a CSI volume plugin called “com.example.team/csi-driver”.   


```
kind: StorageClass

apiVersion: storage.k8s.io/v1

metadata:

  name: fast-storage

provisioner: com.example.team/csi-driver

parameters:

  type: pd-ssd
 ```


To trigger dynamic provisioning, create a PersistentVolumeClaim object. The following PersistentVolumeClaim, for example, triggers dynamic provisioning using the StorageClass above.  


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


When volume provisioning is invoked, the parameter “type: pd-ssd” is passed to the CSI plugin “com.example.team/csi-driver” via a “CreateVolume” call. In response, the external volume plugin provisions a new volume and then automatically create a PersistentVolume object to represent the new volume. Kubernetes then binds the new PersistentVolume object to the PersistentVolumeClaim, making it ready to use.  

If the “fast-storage” StorageClass is marked default, there is no need to include the storageClassName in the PersistentVolumeClaim, it will be used by default.  


### Pre-Provisioned Volumes
You can always expose a pre-existing volume in Kubernetes by manually creating a PersistentVolume object to represent the existing volume. The following PersistentVolume, for example, exposes a volume with the name “existingVolumeName” belonging to a CSI storage plugin called “com.example.team/csi-driver”.  


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

    driver: com.example.team/csi-driver

    volumeHandle: existingVolumeName

    readOnly: false
 ```



### Attaching and Mounting
You can reference a PersistentVolumeClaim that is bound to a CSI volume in any pod or pod template.  


```
kind: Pod

apiVersion: v1

metadata:

  name: my-pod

spec:

  containers:

    - name: my-frontend

      image: dockerfile/nginx

      volumeMounts:

      - mountPath: "/var/www/html"

        name: my-csi-volume

  volumes:

    - name: my-csi-volume

      persistentVolumeClaim:

        claimName: my-request-for-storage
 ```


When the pod referencing a CSI volume is scheduled, Kubernetes will trigger the appropriate operations against the external CSI plugin (ControllerPublishVolume, NodePublishVolume, etc.) to ensure the specified volume is attached, mounted, and ready to use by the containers in the pod.  

For more details please see the CSI implementation [design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md) and [documentation](https://github.com/kubernetes-csi/docs/wiki/Setup).  


### How do I create a CSI driver?
Kubernetes is as minimally prescriptive on the packaging and deployment of a CSI Volume Driver as possible. The minimum requirements for deploying a CSI Volume Driver on Kubernetes are documented [here](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md#third-party-csi-volume-drivers).  

The minimum requirements document also contains a [section](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md#recommended-mechanism-for-deploying-csi-drivers-on-kubernetes) outlining the suggested mechanism for deploying an arbitrary containerized CSI driver on Kubernetes. This mechanism can be used by a Storage Provider to simplify deployment of containerized CSI compatible volume drivers on Kubernetes.   

As part of this recommended deployment process, the Kubernetes team provides the following sidecar (helper) containers:  


- [external-attacher](https://github.com/kubernetes-csi/external-attacher)

  - Sidecar container that watches Kubernetes VolumeAttachment objects and triggers ControllerPublish and ControllerUnpublish operations against a CSI endpoint.
- [external-provisioner](https://github.com/kubernetes-csi/external-provisioner)

  - Sidecar container that watches Kubernetes PersistentVolumeClaim objects and triggers CreateVolume and DeleteVolume operations against a CSI endpoint.
- [driver-registrar](https://github.com/kubernetes-csi/driver-registrar)

  - Sidecar container that registers the CSI driver with kubelet (in the future), and adds the drivers custom NodeId (retrieved via GetNodeID call against the CSI endpoint) to an annotation on the Kubernetes Node API Object

Storage vendors can build Kubernetes deployments for their plugins using these components, while leaving their CSI driver completely unaware of Kubernetes.  


### Where can I find CSI drivers?
CSI drivers are developed and maintained by third-parties. You can find example CSI drivers [here](https://github.com/kubernetes-csi/drivers), but these are provided purely for illustrative purposes, and are not intended to be used for production workloads.



### What about Flex?
The [Flex Volume plugin](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md) exists as an exec based mechanism to create “out-of-tree” volume plugins. Although it has some drawbacks (mentioned above), the Flex volume plugin coexists with the new CSI Volume plugin. SIG Storage will continue to maintain the Flex API so that existing third-party Flex drivers (already deployed in production clusters) continue to work. In the future, new volume features will only be added to CSI, not Flex.  


### What will happen to the in-tree volume plugins?
Once CSI reaches stability, we plan to migrate most of the in-tree volume plugins to CSI. Stay tuned for more details as the Kubernetes CSI implementation approaches stable.



### What are the limitations of alpha?
The alpha implementation of CSI has the following limitations:  

- The credential fields in CreateVolume, NodePublishVolume, and ControllerPublishVolume calls are not supported.
- Block volumes are not supported; only file.
- Specifying filesystems is not supported, and defaults to ext4.
- CSI drivers must be deployed with the provided “external-attacher,” even if they don’t implement “ControllerPublishVolume”.
- Kubernetes scheduler topology awareness is not supported for CSI volumes: in short, sharing information about where a volume is provisioned (zone, regions, etc.) to allow k8s scheduler to make smarter scheduling decisions.



### What’s next?
Depending on feedback and adoption, the Kubernetes team plans to push the CSI implementation to beta in either 1.10 or 1.11.  


### How Do I Get Involved?
This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together. A huge thank you to Vladimir Vivien ([vladimirvivien](https://github.com/vladimirvivien)), Jan Šafránek ([jsafrane](https://github.com/jsafrane)), Chakravarthy Nelluri ([chakri-nelluri](https://github.com/chakri-nelluri)), Bradley Childs ([childsb](https://github.com/childsb)), Luis Pabón ([lpabon](https://github.com/lpabon)), and Saad Ali ([saad-ali](https://github.com/saad-ali)) for their tireless efforts in bringing CSI to life in Kubernetes.  

If you’re interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.
