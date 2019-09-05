---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Persistent Volumes
feature:
  title: Storage orchestration
  description: >
    Automatically mount the storage system of your choice, whether from local storage, a public cloud provider such as <a href="https://cloud.google.com/storage/">GCP</a> or <a href="https://aws.amazon.com/products/storage/">AWS</a>, or a network storage system such as NFS, iSCSI, Gluster, Ceph, Cinder, or Flocker.

content_template: templates/concept
weight: 20
---

{{% capture overview %}}

This document describes the current state of `PersistentVolumes` in Kubernetes. Familiarity with [volumes](/docs/concepts/storage/volumes/) is suggested.

{{% /capture %}}


{{% capture body %}}

## Introduction

Managing storage is a distinct problem from managing compute. The `PersistentVolume` subsystem provides an API for users and administrators that abstracts details of how storage is provided from how it is consumed. To do this we introduce two new API resources:  `PersistentVolume` and `PersistentVolumeClaim`.

A `PersistentVolume` (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using [Storage Classes](/docs/concepts/storage/storage-classes/). It is a resource in the cluster just like a node is a cluster resource. PVs are volume plugins like Volumes, but have a lifecycle independent of any individual pod that uses the PV. This API object captures the details of the implementation of the storage, be that NFS, iSCSI, or a cloud-provider-specific storage system.

A `PersistentVolumeClaim` (PVC) is a request for storage by a user. It is similar to a pod. Pods consume node resources and PVCs consume PV resources. Pods can request specific levels of resources (CPU and Memory).  Claims can request specific size and access modes (e.g., can be mounted once read/write or many times read-only).

While `PersistentVolumeClaims` allow a user to consume abstract storage
resources, it is common that users need `PersistentVolumes` with varying
properties, such as performance, for different problems. Cluster administrators
need to be able to offer a variety of `PersistentVolumes` that differ in more
ways than just size and access modes, without exposing users to the details of
how those volumes are implemented. For these needs there is the `StorageClass`
resource.

Please see the [detailed walkthrough with working examples](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).


## Lifecycle of a volume and claim

PVs are resources in the cluster. PVCs are requests for those resources and also act as claim checks to the resource. The interaction between PVs and PVCs follows this lifecycle:

### Provisioning

There are two ways PVs may be provisioned: statically or dynamically.

#### Static
A cluster administrator creates a number of PVs. They carry the details of the real storage which is available for use by cluster users. They exist in the Kubernetes API and are available for consumption.

#### Dynamic
When none of the static PVs the administrator created matches a user's `PersistentVolumeClaim`,
the cluster may try to dynamically provision a volume specially for the PVC.
This provisioning is based on `StorageClasses`: the PVC must request a
[storage class](/docs/concepts/storage/storage-classes/) and
the administrator must have created and configured that class in order for dynamic
provisioning to occur. Claims that request the class `""` effectively disable
dynamic provisioning for themselves.

To enable dynamic storage provisioning based on storage class, the cluster administrator
needs to enable the `DefaultStorageClass` [admission controller](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
on the API server. This can be done, for example, by ensuring that `DefaultStorageClass` is
among the comma-delimited, ordered list of values for the `--enable-admission-plugins` flag of
the API server component. For more information on API server command line flags,
please check [kube-apiserver](/docs/admin/kube-apiserver/) documentation.

### Binding

A user creates, or has already created in the case of dynamic provisioning, a `PersistentVolumeClaim` with a specific amount of storage requested and with certain access modes. A control loop in the master watches for new PVCs, finds a matching PV (if possible), and binds them together. If a PV was dynamically provisioned for a new PVC, the loop will always bind that PV to the PVC. Otherwise, the user will always get at least what they asked for, but the volume may be in excess of what was requested. Once bound, `PersistentVolumeClaim` binds are exclusive, regardless of how they were bound. A PVC to PV binding is a one-to-one mapping.

Claims will remain unbound indefinitely if a matching volume does not exist. Claims will be bound as matching volumes become available. For example, a cluster provisioned with many 50Gi PVs would not match a PVC requesting 100Gi. The PVC can be bound when a 100Gi PV is added to the cluster.

### Using

Pods use claims as volumes. The cluster inspects the claim to find the bound volume and mounts that volume for a pod. For volumes which support multiple access modes, the user specifies which mode is desired when using their claim as a volume in a pod.

Once a user has a claim and that claim is bound, the bound PV belongs to the user for as long as they need it. Users schedule Pods and access their claimed PVs by including a `persistentVolumeClaim` in their Pod's volumes block. [See below for syntax details](#claims-as-volumes).

### Storage Object in Use Protection
The purpose of the Storage Object in Use Protection feature is to ensure that Persistent Volume Claims (PVCs) in active use by a pod and Persistent Volume (PVs) that are bound to PVCs are not removed from the system as this may result in data loss.

{{< note >}}
PVC is in active use by a pod when a pod object exists that is using the PVC.
{{< /note >}}

If a user deletes a PVC in active use by a pod, the PVC is not removed immediately. PVC removal is postponed until the PVC is no longer actively used by any pods, and also if admin deletes a PV that is bound to a PVC, the PV is not removed immediately. PV removal is postponed until the PV is no longer bound to a PVC.

You can see that a PVC is protected when the PVC's status is `Terminating` and the `Finalizers` list includes `kubernetes.io/pvc-protection`:

```shell
kubectl describe pvc hostpath
Name:          hostpath
Namespace:     default
StorageClass:  example-hostpath
Status:        Terminating
Volume:        
Labels:        <none>
Annotations:   volume.beta.kubernetes.io/storage-class=example-hostpath
               volume.beta.kubernetes.io/storage-provisioner=example.com/hostpath
Finalizers:    [kubernetes.io/pvc-protection]
...
```

You can see that a PV is protected when the PV's status is `Terminating` and the `Finalizers` list includes `kubernetes.io/pv-protection` too:

```shell
kubectl describe pv task-pv-volume
Name:            task-pv-volume
Labels:          type=local
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    standard
Status:          Available
Claim:           
Reclaim Policy:  Delete
Access Modes:    RWO
Capacity:        1Gi
Message:         
Source:
    Type:          HostPath (bare host directory volume)
    Path:          /tmp/data
    HostPathType:  
Events:            <none>
```

### Reclaiming

When a user is done with their volume, they can delete the PVC objects from the API which allows reclamation of the resource. The reclaim policy for a `PersistentVolume` tells the cluster what to do with the volume after it has been released of its claim. Currently, volumes can either be Retained, Recycled or Deleted.

#### Retain

The `Retain` reclaim policy allows for manual reclamation of the resource. When the `PersistentVolumeClaim` is deleted, the `PersistentVolume` still exists and the volume is considered "released". But it is not yet available for another claim because the previous claimant's data remains on the volume. An administrator can manually reclaim the volume with the following steps.

1. Delete the `PersistentVolume`. The associated storage asset in external infrastructure (such as an AWS EBS, GCE PD, Azure Disk, or Cinder volume) still exists after the PV is deleted.
1. Manually clean up the data on the associated storage asset accordingly.
1. Manually delete the associated storage asset, or if you want to reuse the same storage asset, create a new `PersistentVolume` with the storage asset definition.

#### Delete

For volume plugins that support the `Delete` reclaim policy, deletion removes both the `PersistentVolume` object from Kubernetes, as well as the associated storage asset in the external infrastructure, such as an AWS EBS, GCE PD, Azure Disk, or Cinder volume. Volumes that were dynamically provisioned inherit the [reclaim policy of their `StorageClass`](#reclaim-policy), which defaults to `Delete`. The administrator should configure the `StorageClass` according to users' expectations, otherwise the PV must be edited or patched after it is created. See [Change the Reclaim Policy of a PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).

#### Recycle

{{< warning >}}
The `Recycle` reclaim policy is deprecated. Instead, the recommended approach is to use dynamic provisioning.
{{< /warning >}}

If supported by the underlying volume plugin, the `Recycle` reclaim policy performs a basic scrub (`rm -rf /thevolume/*`) on the volume and makes it available again for a new claim.

However, an administrator can configure a custom recycler pod template using the Kubernetes controller manager command line arguments as described [here](/docs/admin/kube-controller-manager/). The custom recycler pod template must contain a `volumes` specification, as shown in the example below:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pv-recycler
  namespace: default
spec:
  restartPolicy: Never
  volumes:
  - name: vol
    hostPath:
      path: /any/path/it/will/be/replaced
  containers:
  - name: pv-recycler
    image: "k8s.gcr.io/busybox"
    command: ["/bin/sh", "-c", "test -e /scrub && rm -rf /scrub/..?* /scrub/.[!.]* /scrub/*  && test -z \"$(ls -A /scrub)\" || exit 1"]
    volumeMounts:
    - name: vol
      mountPath: /scrub
```

However, the particular path specified in the custom recycler pod template in the `volumes` part is replaced with the particular path of the volume that is being recycled.

### Expanding Persistent Volumes Claims

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

Support for expanding PersistentVolumeClaims (PVCs) is now enabled by default. You can expand
the following types of volumes:

* gcePersistentDisk
* awsElasticBlockStore
* Cinder
* glusterfs
* rbd
* Azure File
* Azure Disk
* Portworx
* FlexVolumes
* CSI

You can only expand a PVC if its storage class's `allowVolumeExpansion` field is set to true.

``` yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gluster-vol-default
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

To request a larger volume for a PVC, edit the PVC object and specify a larger
size. This triggers expansion of the volume that backs the underlying `PersistentVolume`. A
new `PersistentVolume` is never created to satisfy the claim. Instead, an existing volume is resized.

#### CSI Volume expansion

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

CSI volume expansion requires enabling `ExpandCSIVolumes` feature gate and also requires specific CSI driver to support volume expansion. Please refer to documentation of specific CSI driver for more information.


#### Resizing a volume containing a file system

You can only resize volumes containing a file system if the file system is XFS, Ext3, or Ext4.

When a volume contains a file system, the file system is only resized when a new Pod is using
the `PersistentVolumeClaim` in ReadWrite mode. File system expansion is either done when Pod is starting up
or is done when Pod is running and underlying file system supports online expansion. 

FlexVolumes allow resize if the driver is set with the `RequiresFSResize` capability to true. 
The FlexVolume can be resized on pod restart. 

#### Resizing an in-use PersistentVolumeClaim

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

{{< note >}}
Expanding in-use PVCs is available as beta since 1.15, and as alpha since Kubernetes 1.11. The `ExpandInUsePersistentVolumes` feature must be enabled, which is the case automatically for many clusters for beta features. Please refer to the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) documentation for more information.
{{< /note >}}

In this case, you don't need to delete and recreate a Pod or deployment that is using an existing PVC.
Any in-use PVC automatically becomes available to its Pod as soon as its file system has been expanded.
This feature has no effect on PVCs that are not in use by a Pod or deployment. You must create a Pod which
uses the PVC before the expansion can complete.


Similar to other volume types - FlexVolume volumes can also be expanded when in-use by a pod.

{{< note >}}
FlexVolume resize is possible only when the underlying driver supports resize.
{{< /note >}}

{{< note >}}
Expanding EBS volumes is a time consuming operation. Also, there is a per-volume quota of one modification every 6 hours.
{{< /note >}}


## Types of Persistent Volumes

`PersistentVolume` types are implemented as plugins.  Kubernetes currently supports the following plugins:

* GCEPersistentDisk
* AWSElasticBlockStore
* AzureFile
* AzureDisk
* CSI
* FC (Fibre Channel)
* FlexVolume
* Flocker
* NFS
* iSCSI
* RBD (Ceph Block Device)
* CephFS
* Cinder (OpenStack block storage)
* Glusterfs
* VsphereVolume
* Quobyte Volumes
* HostPath (Single node testing only -- local storage is not supported in any way and WILL NOT WORK in a multi-node cluster)
* Portworx Volumes
* ScaleIO Volumes
* StorageOS

## Persistent Volumes

Each PV contains a spec and status, which is the specification and status of the volume.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 172.17.0.2
```

### Capacity

Generally, a PV will have a specific storage capacity.  This is set using the PV's `capacity` attribute.  See the Kubernetes [Resource Model](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) to understand the units expected by `capacity`.

Currently, storage size is the only resource that can be set or requested.  Future attributes may include IOPS, throughput, etc.

### Volume Mode

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

Prior to Kubernetes 1.9, all volume plugins created a filesystem on the persistent volume.
Now, you can set the value of `volumeMode` to `block` to use a raw block device, or `filesystem`
to use a filesystem. `filesystem` is the default if the value is omitted. This is an optional API
parameter.

### Access Modes

A `PersistentVolume` can be mounted on a host in any way supported by the resource provider.  As shown in the table below, providers will have different capabilities and each PV's access modes are set to the specific modes supported by that particular volume.  For example, NFS can support multiple read/write clients, but a specific NFS PV might be exported on the server as read-only.  Each PV gets its own set of access modes describing that specific PV's capabilities.

The access modes are:

* ReadWriteOnce -- the volume can be mounted as read-write by a single node
* ReadOnlyMany -- the volume can be mounted read-only by many nodes
* ReadWriteMany -- the volume can be mounted as read-write by many nodes

In the CLI, the access modes are abbreviated to:

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany

> __Important!__ A volume can only be mounted using one access mode at a time, even if it supports many.  For example, a GCEPersistentDisk can be mounted as ReadWriteOnce by a single node or ReadOnlyMany by many nodes, but not at the same time.


| Volume Plugin        | ReadWriteOnce          | ReadOnlyMany          | ReadWriteMany|
| :---                 | :---:                  | :---:                 | :---:        |
| AWSElasticBlockStore | &#x2713;               | -                     | -            |
| AzureFile            | &#x2713;               | &#x2713;              | &#x2713;     |
| AzureDisk            | &#x2713;               | -                     | -            |
| CephFS               | &#x2713;               | &#x2713;              | &#x2713;     |
| Cinder               | &#x2713;               | -                     | -            |
| CSI                  | depends on the driver  | depends on the driver | depends on the driver |
| FC                   | &#x2713;               | &#x2713;              | -            |
| Flexvolume           | &#x2713;               | &#x2713;              | depends on the driver |
| Flocker              | &#x2713;               | -                     | -            |
| GCEPersistentDisk    | &#x2713;               | &#x2713;              | -            |
| Glusterfs            | &#x2713;               | &#x2713;              | &#x2713;     |
| HostPath             | &#x2713;               | -                     | -            |
| iSCSI                | &#x2713;               | &#x2713;              | -            |
| Quobyte              | &#x2713;               | &#x2713;              | &#x2713;     |
| NFS                  | &#x2713;               | &#x2713;              | &#x2713;     |
| RBD                  | &#x2713;               | &#x2713;              | -            |
| VsphereVolume        | &#x2713;               | -                     | - (works when pods are collocated)  |
| PortworxVolume       | &#x2713;               | -                     | &#x2713;     |
| ScaleIO              | &#x2713;               | &#x2713;              | -            |
| StorageOS            | &#x2713;               | -                     | -            |

### Class

A PV can have a class, which is specified by setting the
`storageClassName` attribute to the name of a
[StorageClass](/docs/concepts/storage/storage-classes/).
A PV of a particular class can only be bound to PVCs requesting
that class. A PV with no `storageClassName` has no class and can only be bound
to PVCs that request no particular class.

In the past, the annotation `volume.beta.kubernetes.io/storage-class` was used instead
of the `storageClassName` attribute. This annotation is still working, however
it will become fully deprecated in a future Kubernetes release.

### Reclaim Policy

Current reclaim policies are:

* Retain -- manual reclamation
* Recycle -- basic scrub (`rm -rf /thevolume/*`)
* Delete -- associated storage asset such as AWS EBS, GCE PD, Azure Disk, or OpenStack Cinder volume is deleted

Currently, only NFS and HostPath support recycling. AWS EBS, GCE PD, Azure Disk, and Cinder volumes support deletion.

### Mount Options

A Kubernetes administrator can specify additional mount options for when a Persistent Volume is mounted on a node.

{{< note >}}
Not all Persistent volume types support mount options.
{{< /note >}}

The following volume types support mount options:

* AWSElasticBlockStore
* AzureDisk
* AzureFile
* CephFS
* Cinder (OpenStack block storage)
* GCEPersistentDisk
* Glusterfs
* NFS
* Quobyte Volumes
* RBD (Ceph Block Device)
* StorageOS
* VsphereVolume
* iSCSI

Mount options are not validated, so mount will simply fail if one is invalid.

In the past, the annotation `volume.beta.kubernetes.io/mount-options` was used instead
of the `mountOptions` attribute. This annotation is still working, however
it will become fully deprecated in a future Kubernetes release.

### Node Affinity

{{< note >}}
For most volume types, you do not need to set this field. It is automatically populated for [AWS EBS](/docs/concepts/storage/volumes/#awselasticblockstore), [GCE PD](/docs/concepts/storage/volumes/#gcepersistentdisk) and [Azure Disk](/docs/concepts/storage/volumes/#azuredisk) volume block types. You need to explicitly set this for [local](/docs/concepts/storage/volumes/#local) volumes.
{{< /note >}}

A PV can specify [node affinity](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volumenodeaffinity-v1-core) to define constraints that limit what nodes this volume can be accessed from. Pods that use a PV will only be scheduled to nodes that are selected by the node affinity.

### Phase

A volume will be in one of the following phases:

* Available -- a free resource that is not yet bound to a claim
* Bound -- the volume is bound to a claim
* Released -- the claim has been deleted, but the resource is not yet reclaimed by the cluster
* Failed -- the volume has failed its automatic reclamation

The CLI will show the name of the PVC bound to the PV.

## PersistentVolumeClaims

Each PVC contains a spec and status, which is the specification and status of the claim.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 8Gi
  storageClassName: slow
  selector:
    matchLabels:
      release: "stable"
    matchExpressions:
      - {key: environment, operator: In, values: [dev]}
```

### Access Modes

Claims use the same conventions as volumes when requesting storage with specific access modes.

### Volume Modes

Claims use the same convention as volumes to indicate the consumption of the volume as either a filesystem or block device.

### Resources

Claims, like pods, can request specific quantities of a resource.  In this case, the request is for storage.  The same [resource model](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) applies to both volumes and claims.

### Selector

Claims can specify a [label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors) to further filter the set of volumes. Only the volumes whose labels match the selector can be bound to the claim. The selector can consist of two fields:

* `matchLabels` - the volume must have a label with this value
* `matchExpressions` - a list of requirements made by specifying key, list of values, and operator that relates the key and values. Valid operators include In, NotIn, Exists, and DoesNotExist.

All of the requirements, from both `matchLabels` and `matchExpressions` are ANDed together – they must all be satisfied in order to match.

### Class

A claim can request a particular class by specifying the name of a
[StorageClass](/docs/concepts/storage/storage-classes/)
using the attribute `storageClassName`.
Only PVs of the requested class, ones with the same `storageClassName` as the PVC, can
be bound to the PVC.

PVCs don't necessarily have to request a class. A PVC with its `storageClassName` set
equal to `""` is always interpreted to be requesting a PV with no class, so it
can only be bound to PVs with no class (no annotation or one set equal to
`""`). A PVC with no `storageClassName` is not quite the same and is treated differently
by the cluster depending on whether the
[`DefaultStorageClass` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
is turned on.

* If the admission plugin is turned on, the administrator may specify a
  default `StorageClass`. All PVCs that have no `storageClassName` can be bound only to
  PVs of that default. Specifying a default `StorageClass` is done by setting the
  annotation `storageclass.kubernetes.io/is-default-class` equal to "true" in
  a `StorageClass` object. If the administrator does not specify a default, the
  cluster responds to PVC creation as if the admission plugin were turned off. If
  more than one default is specified, the admission plugin forbids the creation of
  all PVCs.
* If the admission plugin is turned off, there is no notion of a default
  `StorageClass`. All PVCs that have no `storageClassName` can be bound only to PVs that
  have no class. In this case, the PVCs that have no `storageClassName` are treated the
  same way as PVCs that have their `storageClassName` set to `""`.

Depending on installation method, a default StorageClass may be deployed
to Kubernetes cluster by addon manager during installation.

When a PVC specifies a `selector` in addition to requesting a `StorageClass`,
the requirements are ANDed together: only a PV of the requested class and with
the requested labels may be bound to the PVC.

{{< note >}}
Currently, a PVC with a non-empty `selector` can't have a PV dynamically provisioned for it.
{{< /note >}}

In the past, the annotation `volume.beta.kubernetes.io/storage-class` was used instead
of `storageClassName` attribute. This annotation is still working, however
it won't be supported in a future Kubernetes release.

## Claims As Volumes

Pods access storage by using the claim as a volume.  Claims must exist in the same namespace as the pod using the claim.  The cluster finds the claim in the pod's namespace and uses it to get the `PersistentVolume` backing the claim.  The volume is then mounted to the host and into the pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myclaim
```

### A Note on Namespaces

`PersistentVolumes` binds are exclusive, and since `PersistentVolumeClaims` are namespaced objects, mounting claims with "Many" modes (`ROX`, `RWX`) is only possible within one namespace.

## Raw Block Volume Support

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

The following volume plugins support raw block volumes, including dynamic provisioning where
applicable.

* AWSElasticBlockStore
* AzureDisk
* FC (Fibre Channel)
* GCEPersistentDisk
* iSCSI
* Local volume
* RBD (Ceph Block Device)
* VsphereVolume (alpha)

{{< note >}}
Only FC and iSCSI volumes supported raw block volumes in Kubernetes 1.9.
Support for the additional plugins was added in 1.10.
{{< /note >}}

### Persistent Volumes using a Raw Block Volume
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: block-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  persistentVolumeReclaimPolicy: Retain
  fc:
    targetWWNs: ["50060e801049cfd1"]
    lun: 0
    readOnly: false
```
### Persistent Volume Claim requesting a Raw Block Volume
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: block-pvc
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  resources:
    requests:
      storage: 10Gi
```
### Pod specification adding Raw Block Device path in container
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-block-volume
spec:
  containers:
    - name: fc-container
      image: fedora:26
      command: ["/bin/sh", "-c"]
      args: [ "tail -f /dev/null" ]
      volumeDevices:
        - name: data
          devicePath: /dev/xvda
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: block-pvc
```

{{< note >}}
When adding a raw block device for a Pod, we specify the device path in the container instead of a mount path.
{{< /note >}}

### Binding Block Volumes

If a user requests a raw block volume by indicating this using the `volumeMode` field in the `PersistentVolumeClaim` spec, the binding rules differ slightly from previous releases that didn't consider this mode as part of the spec.
Listed is a table of possible combinations the user and admin might specify for requesting a raw block device. The table indicates if the volume will be bound or not given the combinations:
Volume binding matrix for statically provisioned volumes:

| PV volumeMode | PVC volumeMode  | Result           |
| --------------|:---------------:| ----------------:|
|   unspecified | unspecified     | BIND             |
|   unspecified | Block           | NO BIND          |
|   unspecified | Filesystem      | BIND             |
|   Block       | unspecified     | NO BIND          |
|   Block       | Block           | BIND             |
|   Block       | Filesystem      | NO BIND          |
|   Filesystem  | Filesystem      | BIND             |
|   Filesystem  | Block           | NO BIND          |
|   Filesystem  | unspecified     | BIND             |

{{< note >}}
Only statically provisioned volumes are supported for alpha release. Administrators should take care to consider these values when working with raw block devices.
{{< /note >}}

## Volume Snapshot and Restore Volume from Snapshot Support

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

Volume snapshot feature was added to support CSI Volume Plugins only. For details, see [volume snapshots](/docs/concepts/storage/volume-snapshots/).

To enable support for restoring a volume from a volume snapshot data source, enable the
`VolumeSnapshotDataSource` feature gate on the apiserver and controller-manager.

### Create Persistent Volume Claim from Volume Snapshot
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restore-pvc
spec:
  storageClassName: csi-hostpath-sc
  dataSource:
    name: new-snapshot-test
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Volume Cloning

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

Volume clone feature was added to support CSI Volume Plugins only. For details, see [volume cloning](/docs/concepts/storage/volume-pvc-datasource/).

To enable support for cloning a volume from a pvc data source, enable the
`VolumePVCDataSource` feature gate on the apiserver and controller-manager.

### Create Persistent Volume Claim from an existing pvc
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cloned-pvc
spec:
  storageClassName: my-csi-plugin
  dataSource:
    name: existing-src-pvc-name
    kind: PersistentVolumeClaim
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Writing Portable Configuration

If you're writing configuration templates or examples that run on a wide range of clusters
and need persistent storage, we recommend that you use the following pattern:

- Do include PersistentVolumeClaim objects in your bundle of config (alongside
  Deployments, ConfigMaps, etc).
- Do not include PersistentVolume objects in the config, since the user instantiating
  the config may not have permission to create PersistentVolumes.
- Give the user the option of providing a storage class name when instantiating
  the template.
  - If the user provides a storage class name, put that value into the
    `persistentVolumeClaim.storageClassName` field.
    This will cause the PVC to match the right storage
    class if the cluster has StorageClasses enabled by the admin.
  - If the user does not provide a storage class name, leave the
    `persistentVolumeClaim.storageClassName` field as nil.
    - This will cause a PV to be automatically provisioned for the user with
      the default StorageClass in the cluster.  Many cluster environments have
      a default StorageClass installed, or administrators can create their own
      default StorageClass.
- In your tooling, do watch for PVCs that are not getting bound after some time
  and surface this to the user, as this may indicate that the cluster has no
  dynamic storage support (in which case the user should create a matching PV)
  or the cluster has no storage system (in which case the user cannot deploy
  config requiring PVCs).

{{% /capture %}}
