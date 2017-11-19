---
approvers:
- jsafrane
- mikedanese
- saad-ali
- thockin
title: Persistent Volumes
---

This document describes the current state of `PersistentVolumes` in Kubernetes.  Familiarity with [volumes](/docs/concepts/storage/volumes/) is suggested.

* TOC
{:toc}

## Introduction

Managing storage is a distinct problem from managing compute. The `PersistentVolume` subsystem provides an API for users and administrators that abstracts details of how storage is provided from how it is consumed.  To do this we introduce two new API resources:  `PersistentVolume` and `PersistentVolumeClaim`.

A `PersistentVolume` (PV) is a piece of storage in the cluster that has been provisioned by an administrator.  It is a resource in the cluster just like a node is a cluster resource.   PVs are volume plugins like Volumes, but have a lifecycle independent of any individual pod that uses the PV.  This API object captures the details of the implementation of the storage, be that NFS, iSCSI, or a cloud-provider-specific storage system.

A `PersistentVolumeClaim` (PVC) is a request for storage by a user.  It is similar to a pod.  Pods consume node resources and PVCs consume PV resources.  Pods can request specific levels of resources (CPU and Memory).  Claims can request specific size and access modes (e.g., can be mounted once read/write or many times read-only).

While `PersistentVolumeClaims` allow a user to consume abstract storage
resources, it is common that users need `PersistentVolumes` with varying
properties, such as performance, for different problems. Cluster administrators
need to be able to offer a variety of `PersistentVolumes` that differ in more
ways than just size and access modes, without exposing users to the details of
how those volumes are implemented. For these needs there is the `StorageClass`
resource.

Please see the [detailed walkthrough with working examples](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).


## Lifecycle of a volume and claim

PVs are resources in the cluster.  PVCs are requests for those resources and also act as claim checks to the resource.  The interaction between PVs and PVCs follows this lifecycle:

### Provisioning

There are two ways PVs may be provisioned: statically or dynamically.

#### Static
A cluster administrator creates a number of PVs. They carry the details of the real storage which is available for use by cluster users.  They exist in the Kubernetes API and are available for consumption.

#### Dynamic
When none of the static PVs the administrator created matches a user's `PersistentVolumeClaim`,
the cluster may try to dynamically provision a volume specially for the PVC.
This provisioning is based on `StorageClasses`: the PVC must request a
[storage class](/docs/concepts/storage/storage-classes/) and
the administrator must have created and configured that class in order for dynamic
provisioning to occur. Claims that request the class `""` effectively disable
dynamic provisioning for themselves.

To enable dynamic storage provisioning based on storage class, the cluster administrator
needs to enable the `DefaultStorageClass` [admission controller](/docs/admin/admission-controllers/#defaultstorageclass)
on the API server. This can be done, for example, by ensuring that `DefaultStorageClass` is
among the comma-delimited, ordered list of values for the `--admission-control` flag of 
the API server component. For more information on API server command line flags,
please check [kube-apiserver](/docs/admin/kube-apiserver/) documentation.

### Binding

A user creates, or has already created in the case of dynamic provisioning, a `PersistentVolumeClaim` with a specific amount of storage requested and with certain access modes.  A control loop in the master watches for new PVCs, finds a matching PV (if possible), and binds them together.  If a PV was dynamically provisioned for a new PVC, the loop will always bind that PV to the PVC. Otherwise, the user will always get at least what they asked for, but the volume may be in excess of what was requested.  Once bound, `PersistentVolumeClaim` binds are exclusive, regardless of the mode used to bind them.

Claims will remain unbound indefinitely if a matching volume does not exist.  Claims will be bound as matching volumes become available.  For example, a cluster provisioned with many 50Gi PVs would not match a PVC requesting 100Gi.  The PVC can be bound when a 100Gi PV is added to the cluster.

### Using

Pods use claims as volumes. The cluster inspects the claim to find the bound volume and mounts that volume for a pod.  For volumes which support multiple access modes, the user specifies which mode desired when using their claim as a volume in a pod.

Once a user has a claim and that claim is bound, the bound PV belongs to the user for as long as they need it. Users schedule Pods and access their claimed PVs by including a persistentVolumeClaim in their Pod's volumes block. [See below for syntax details](#claims-as-volumes).

### Reclaiming

When a user is done with their volume, they can delete the PVC objects from the API which allows reclamation of the resource. The reclaim policy for a `PersistentVolume` tells the cluster what to do with the volume after it has been released of its claim. Currently, volumes can either be Retained, Recycled or Deleted.

#### Retaining

The Retain reclaim policy allows for manual reclamation of the resource. When the `PersistentVolumeClaim` is deleted, the `PersistentVolume` still exists and the volume is considered "released". But it is not yet available for another claim because the previous claimant's data remains on the volume. An administrator can manually reclaim the volume with the following steps.

1. Delete the `PersistentVolume`. The associated storage asset in external infrastructure (such as an AWS EBS, GCE PD, Azure Disk, or Cinder volume) still exists after the PV is deleted.
1. Manually clean up the data on the associated storage asset accordingly.
1. Manually delete the associated storage asset, or if you want to reuse the same storage asset, create a new `PersistentVolume` with the storage asset definition.

#### Recycling

If supported by appropriate volume plugin, recycling performs a basic scrub (`rm -rf /thevolume/*`) on the volume and makes it available again for a new claim.

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
    image: "gcr.io/google_containers/busybox"
    command: ["/bin/sh", "-c", "test -e /scrub && rm -rf /scrub/..?* /scrub/.[!.]* /scrub/*  && test -z \"$(ls -A /scrub)\" || exit 1"]
    volumeMounts:
    - name: vol
      mountPath: /scrub
```

However, the particular path specified in the custom recycler pod template in the `volumes` part is replaced with the particular path of the volume that is being recycled.

#### Deleting

For volume plugins that support the Delete reclaim policy, deletion removes both the `PersistentVolume` object from Kubernetes, as well as deleting the associated storage asset in the external infrastructure, such as an AWS EBS, GCE PD, Azure Disk, or Cinder volume. Volumes that were dynamically provisioned inherit the [reclaim policy of their `StorageClass`](#reclaim-policy), which defaults to Delete. The administrator should configure the `StorageClass` according to users' expectations, otherwise the PV must be edited or patched after it is created. See [Change the Reclaim Policy of a PersistentVolume](https://kubernetes.io/docs/tasks/administer-cluster/change-pv-reclaim-policy/).


### Expanding Persistent Volumes Claims

With Kubernetes 1.8, we have added Alpha support for expanding persistent volumes. The current Alpha support was designed to only support volume types
that don't need file system resizing (Currently only glusterfs).

Administrator can allow expanding persistent volume claims by setting `ExpandPersistentVolumes` feature gate to true. Administrator
should also enable [`PersistentVolumeClaimResize` admission plugin](/docs/admin/admission-controllers/#persistentvolumeclaimresize)
to perform additional validations of volumes that can be resized.

Once `PersistentVolumeClaimResize` admission plug-in has been turned on, resizing will only be allowed for storage classes
whose `allowVolumeExpansion` field is set to true.

``` yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
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

Once both feature gate and aforementioned admission plug-in are turned on, an user can request larger volume for their `PersistentVolumeClaim`
by simply editing the claim and requesting bigger size.  This in turn will trigger expansion of volume that is backing underlying `PersistentVolume`.

Under no circumstances a new `PersistentVolume` gets created to satisfy the claim. Kubernetes will attempt to resize existing volume to satisfy the claim.


## Types of Persistent Volumes

`PersistentVolume` types are implemented as plugins.  Kubernetes currently supports the following plugins:

* GCEPersistentDisk
* AWSElasticBlockStore
* AzureFile
* AzureDisk
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
* VMware Photon
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


| Volume Plugin        | ReadWriteOnce| ReadOnlyMany| ReadWriteMany|
| :---                 |     :---:    |    :---:    |    :---:     |
| AWSElasticBlockStore | &#x2713;     | -           | -            |
| AzureFile            | &#x2713;     | &#x2713;    | &#x2713;     |
| AzureDisk            | &#x2713;     | -           | -            |
| CephFS               | &#x2713;     | &#x2713;    | &#x2713;     |
| Cinder               | &#x2713;     | -           | -            |
| FC                   | &#x2713;     | &#x2713;    | -            |
| FlexVolume           | &#x2713;     | &#x2713;    | -            |
| Flocker              | &#x2713;     | -           | -            |
| GCEPersistentDisk    | &#x2713;     | &#x2713;    | -            |
| Glusterfs            | &#x2713;     | &#x2713;    | &#x2713;     |
| HostPath             | &#x2713;     | -           | -            |
| iSCSI                | &#x2713;     | &#x2713;    | -            |
| PhotonPersistentDisk | &#x2713;     | -           | -            |
| Quobyte              | &#x2713;     | &#x2713;    | &#x2713;     |
| NFS                  | &#x2713;     | &#x2713;    | &#x2713;     |
| RBD                  | &#x2713;     | &#x2713;    | -            |
| VsphereVolume        | &#x2713;     | -           | - (works when pods are collocated)  |
| PortworxVolume       | &#x2713;     | -           | &#x2713;     |
| ScaleIO              | &#x2713;     | &#x2713;    | -            |
| StorageOS            | &#x2713;     | -           | -            |

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

**Note:** Not all Persistent volume types support mount options.
{: .note}

The following volume types support mount options:

* GCEPersistentDisk
* AWSElasticBlockStore
* AzureFile
* AzureDisk
* NFS
* iSCSI
* RBD (Ceph Block Device)
* CephFS
* Cinder (OpenStack block storage)
* Glusterfs
* VsphereVolume
* Quobyte Volumes
* VMware Photon

Mount options are not validated, so mount will simply fail if one is invalid.

In the past, the annotation `volume.beta.kubernetes.io/mount-options` was used instead
of the `mountOptions` attribute. This annotation is still working, however
it will become fully deprecated in a future Kubernetes release.

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
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
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

### Resources

Claims, like pods, can request specific quantities of a resource.  In this case, the request is for storage.  The same [resource model](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) applies to both volumes and claims.

### Selector

Claims can specify a [label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors) to further filter the set of volumes. Only the volumes whose labels match the selector can be bound to the claim. The selector can consist of two fields:

* matchLabels - the volume must have a label with this value
* matchExpressions - a list of requirements made by specifying key, list of values, and operator that relates the key and values. Valid operators include In, NotIn, Exists, and DoesNotExist.

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
[`DefaultStorageClass` admission plugin](/docs/admin/admission-controllers/#defaultstorageclass)
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

**Note:** Currently, a PVC with a non-empty `selector` can't have a PV dynamically provisioned for it.
{: .note}

In the past, the annotation `volume.beta.kubernetes.io/storage-class` was used instead
of `storageClassName` attribute. This annotation is still working, however
it won't be supported in a future Kubernetes release.

## Claims As Volumes

Pods access storage by using the claim as a volume.  Claims must exist in the same namespace as the pod using the claim.  The cluster finds the claim in the pod's namespace and uses it to get the `PersistentVolume` backing the claim.  The volume is then mounted to the host and into the pod.

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: dockerfile/nginx
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

``

## Writing Portable Configuration

If you're writing configuration templates or examples that run on a wide range of clusters
and need persistent storage, we recommend that you use the following pattern:

- Do include PersistentVolumeClaim objects in your bundle of config (alongside
  Deployments, ConfigMaps, etc).
- Do not include PersistentVolume objects in the config, since the user instantiating
  the config may not have permission to create PersistentVolumes.
- Give the user the option of providing a storage class name when instantiating
  the template.
  - If the user provides a storage class name, and the cluster is version 1.4
    or newer, put that value into the `volume.beta.kubernetes.io/storage-class`
    annotation of the PVC. This will cause the PVC to match the right storage
    class if the cluster has StorageClasses enabled by the admin.
  - If the user does not provide a storage class name or the cluster is version
    1.3, then instead put a `volume.alpha.kubernetes.io/storage-class: default`
    annotation on the PVC.
    - This will cause a PV to be automatically provisioned for the user with
      sane default characteristics on some clusters.
    - Despite the word `alpha` in the name, the code behind this annotation has
      `beta` level support.
    - Do not use `volume.beta.kubernetes.io/storage-class:` with any value
      including the empty string since it will prevent `DefaultStorageClass`
      admission controller from running if enabled.
- In your tooling, do watch for PVCs that are not getting bound after some time
  and surface this to the user, as this may indicate that the cluster has no
  dynamic storage support (in which case the user should create a matching PV)
  or the cluster has no storage system (in which case the user cannot deploy
  config requiring PVCs).
- In the future, we expect most clusters to have `DefaultStorageClass` enabled,
  and to have some form of storage available.  However, there may not be any
  storage class names which work on all clusters, so continue to not set one by
  default.
  At some point, the alpha annotation will cease to have meaning, but the unset
  `storageClass` field on the PVC will have the desired effect.

