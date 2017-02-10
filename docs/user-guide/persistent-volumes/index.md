---
assignees:
- jsafrane
- mikedanese
- saad-ali
- thockin
title: Persistent Volumes
---

This document describes the current state of `PersistentVolumes` in Kubernetes.  Familiarity with [volumes](/docs/user-guide/volumes/) is suggested.

* TOC
{:toc}

## Introduction

Managing storage is a distinct problem from managing compute. The `PersistentVolume` subsystem provides an API for users and administrators that abstracts details of how storage is provided from how it is consumed.  To do this we introduce two new API resources:  `PersistentVolume` and `PersistentVolumeClaim`.

A `PersistentVolume` (PV) is a piece of networked storage in the cluster that has been provisioned by an administrator.  It is a resource in the cluster just like a node is a cluster resource.   PVs are volume plugins like Volumes, but have a lifecycle independent of any individual pod that uses the PV.  This API object captures the details of the implementation of the storage, be that NFS, iSCSI, or a cloud-provider-specific storage system.

A `PersistentVolumeClaim` (PVC) is a request for storage by a user.  It is similar to a pod.  Pods consume node resources and PVCs consume PV resources.  Pods can request specific levels of resources (CPU and Memory).  Claims can request specific size and access modes (e.g., can be mounted once read/write or many times read-only).

While `PersistentVolumeClaims` allow a user to consume abstract storage
resources, it is common that users need `PersistentVolumes` with varying
properties, such as performance, for different problems. Cluster administrators
need to be able to offer a variety of `PersistentVolumes` that differ in more
ways than just size and access modes, without exposing users to the details of
how those volumes are implemented. For these needs there is the `StorageClass`
resource.

A `StorageClass` provides a way for administrators to describe the "classes" of
storage they offer. Different classes might map to quality-of-service levels,
or to backup policies, or to arbitrary policies determined by the cluster
administrators. Kubernetes itself is unopinionated about what classes
represent. This concept is sometimes called "profiles" in other storage
systems.

Please see the [detailed walkthrough with working examples](/docs/user-guide/persistent-volumes/walkthrough/).


## Lifecycle of a volume and claim

PVs are resources in the cluster.  PVCs are requests for those resources and also act as claim checks to the resource.  The interaction between PVs and PVCs follows this lifecycle:

### Provisioning

There are two ways PVs may be provisioned: statically or dynamically.

#### Static
A cluster administrator creates a number of PVs. They carry the details of the real storage which is available for use by cluster users.  They exist in the Kubernetes API and are available for consumption.

#### Dynamic
When none of the static PVs the administrator created matches a user's `PersistentVolumeClaim`, the cluster may try to dynamically provision a volume specially for the PVC. This provisioning is based on `StorageClasses`: the PVC must request a class and the administrator must have created and configured that class in order for dynamic provisioning to occur. Claims that request the class `""` effectively disable dynamic provisioning for themselves.

### Binding

A user creates, or has already created in the case of dynamic provisioning, a `PersistentVolumeClaim` with a specific amount of storage requested and with certain access modes.  A control loop in the master watches for new PVCs, finds a matching PV (if possible), and binds them together.  If a PV was dynamically provisioned for a new PVC, the loop will always bind that PV to the PVC. Otherwise, the user will always get at least what they asked for, but the volume may be in excess of what was requested.  Once bound, `PersistentVolumeClaim` binds are exclusive, regardless of the mode used to bind them.

Claims will remain unbound indefinitely if a matching volume does not exist.  Claims will be bound as matching volumes become available.  For example, a cluster provisioned with many 50Gi PVs would not match a PVC requesting 100Gi.  The PVC can be bound when a 100Gi PV is added to the cluster.

### Using

Pods use claims as volumes. The cluster inspects the claim to find the bound volume and mounts that volume for a pod.  For volumes which support multiple access modes, the user specifies which mode desired when using their claim as a volume in a pod.

Once a user has a claim and that claim is bound, the bound PV belongs to the user for as long as they need it. Users schedule Pods and access their claimed PVs by including a persistentVolumeClaim in their Pod's volumes block. [See below for syntax details](#claims-as-volumes).

### Releasing

When a user is done with their volume, they can delete the PVC objects from the API which allows reclamation of the resource.  The volume is considered "released" when the claim is deleted, but it is not yet available for another claim.  The previous claimant's data remains on the volume which must be handled according to policy.

### Reclaiming

The reclaim policy for a `PersistentVolume` tells the cluster what to do with the volume after it has been released of its claim.  Currently, volumes can either be Retained, Recycled or Deleted.  Retention allows for manual reclamation of the resource.  For those volume plugins that support it, deletion removes both the `PersistentVolume` object from Kubernetes, as well as deleting the associated storage asset in external infrastructure (such as an AWS EBS, GCE PD, Azure Disk, or Cinder volume).  Volumes that were dynamically provisioned are always deleted.

#### Recycling

If supported by appropriate volume plugin, recycling performs a basic scrub (`rm -rf /thevolume/*`) on the volume and makes it available again for a new claim.

However, an administrator can configure a custom recycler pod templates using the Kubernetes controller manager command line arguments as described [here](/docs/admin/kube-controller-manager/). The custom recycler pod template must contain a `volumes` specification, as shown in the example below:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pv-recycler-
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

## Types of Persistent Volumes

`PersistentVolume` types are implemented as plugins.  Kubernetes currently supports the following plugins:

* GCEPersistentDisk
* AWSElasticBlockStore
* AzureFile
* AzureDisk
* FC (Fibre Channel)
* Flocker
* NFS
* iSCSI
* RBD (Ceph Block Device)
* CephFS
* Cinder (OpenStack block storage)
* Glusterfs
* VsphereVolume
* Quobyte Volumes
* HostPath (single node testing only -- local storage is not supported in any way and WILL NOT WORK in a multi-node cluster)
* VMware Photon


## Persistent Volumes

Each PV contains a spec and status, which is the specification and status of the volume.

```yaml
  apiVersion: v1
  kind: PersistentVolume
  metadata:
    name: pv0003
    annotations:
      volume.beta.kubernetes.io/storage-class: "slow"
  spec:
    capacity:
      storage: 5Gi
    accessModes:
      - ReadWriteOnce
    persistentVolumeReclaimPolicy: Recycle
    nfs:
      path: /tmp
      server: 172.17.0.2
```

### Capacity

Generally, a PV will have a specific storage capacity.  This is set using the PV's `capacity` attribute.  See the Kubernetes [Resource Model](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/resources.md) to understand the units expected by `capacity`.

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
| AWSElasticBlockStore | x            | -           | -            |
| AzureFile            | x            | x           | x            |
| AzureDisk            | x            | -           | -            |
| CephFS               | x            | x           | x            |
| Cinder               | x            | -           | -            |
| FC                   | x            | x           | -            |
| FlexVolume           | x            | x           | -            |
| Flocker              | x            | -           | -            |
| GCEPersistentDisk    | x            | x           | -            |
| Glusterfs            | x            | x           | x            |
| HostPath             | x            | -           | -            |
| iSCSI                | x            | x           | -            |
| PhotonPersistentDisk | x            | -           | -            |
| Quobyte              | x            | x           | x            |
| NFS                  | x            | x           | x            |
| RBD                  | x            | x           | -            |
| VsphereVolume        | x            | -           | -            |

### Class

A PV can have a class, which is specified by setting the
`volume.beta.kubernetes.io/storage-class` annotation to the name of a
`StorageClass`. A PV of a particular class can only be bound to PVCs requesting
that class. A PV with no annotation or its class annotation set to `""` has no
class and can only be bound to PVCs that request no particular class.

In the future after beta, the `volume.beta.kubernetes.io/storage-class`
annotation will become an attribute.

### Reclaim Policy

Current reclaim policies are:

* Retain -- manual reclamation
* Recycle -- basic scrub ("rm -rf /thevolume/*")
* Delete -- associated storage asset such as AWS EBS, GCE PD, Azure Disk, or OpenStack Cinder volume is deleted

Currently, only NFS and HostPath support recycling. AWS EBS, GCE PD, Azure Disk, and Cinder volumes support deletion.

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
  annotations:
    volume.beta.kubernetes.io/storage-class: "slow"
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 8Gi
  selector:
    matchLabels:
      release: "stable"
    matchExpressions:
      - {key: environment, operator: In, values: [dev]}
```

### Access Modes

Claims use the same conventions as volumes when requesting storage with specific access modes.

### Resources

Claims, like pods, can request specific quantities of a resource.  In this case, the request is for storage.  The same [resource model](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/resources.md) applies to both volumes and claims.

### Selector

Claims can specify a [label selector](/docs/user-guide/labels/#label-selectors) to further filter the set of volumes. Only the volumes whose labels match the selector can be bound to the claim. The selector can consist of two fields:

* matchLabels - the volume must have a label with this value
* matchExpressions - a list of requirements made by specifying key, list of values, and operator that relates the key and values. Valid operators include In, NotIn, Exists, and DoesNotExist.

All of the requirements, from both `matchLabels` and `matchExpressions` are ANDed together – they must all be satisfied in order to match.

### Class

A claim can request a particular class by specifying the name of a
`StorageClass`using the annotation `volume.beta.kubernetes.io/storage-class`.
Only PVs of the requested class, ones with the same annotation as the PVC, can
be bound to the PVC.

PVCs don't necessarily have to request a class. A PVC with its annotation set
equal to `""` is always interpreted to be requesting a PV with no class, so it
can only be bound to PVs with no class (no annotation or one set equal to
`""`). A PVC with no annotation is not quite the same and is treated differently
by the cluster depending on whether the
[`DefaultStorageClass` admission plugin](/docs/admin/admission-controllers/#defaultstorageclass)
is turned on.

* If the admission plugin is turned on, the administrator may specify a
default `StorageClass`. All PVCs that have no annotation can be bound only to
PVs of that default. Specifying a default `StorageClass` is done by setting the
annotation `storageclass.beta.kubernetes.io/is-default-class` equal to "true" in
a `StorageClass` object. If the administrator does not specify a default, the
cluster responds to PVC creation as if the admission plugin were turned off. If
more than one default is specified, the admission plugin forbids the creation of
all PVCs.
* If the admission plugin is turned off, there is no notion of a default
`StorageClass`. All PVCs that have no annotation can be bound only to PVs that
have no class. In this case the PVCs that have no annotation are treated the
same way as PVCs that have their annotation set to `""`.

When a PVC specifies a `selector` in addition to requesting a `StorageClass`,
the requirements are ANDed together: only a PV of the requested class and with
the requested labels may be bound to the PVC. Note that currently, a PVC with a
non-empty `selector` can't have a PV dynamically provisioned for it.

In the future after beta, the `volume.beta.kubernetes.io/storage-class`
annotation will become an attribute.

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

## StorageClasses

Each `StorageClass` contains the fields `provisioner` and `parameters`, which
are used when a `PersistentVolume` belonging to the class needs to be
dynamically provisioned.

The name of a `StorageClass` object is significant, and is how users can
request a particular class. Administrators set the name and other parameters
of a class when first creating `StorageClass` objects, and the objects cannot
be updated once they are created.

Administrators can specify a default `StorageClass` just for PVCs that don't
request any particular class to bind to: see the
[`PersistentVolumeClaim` section](#persistentvolumeclaims)
for details.

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1beta1
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
```

### Provisioner
Storage classes have a provisioner that determines what volume plugin is used
for provisioning PVs. This field must be specified. During beta, the available
provisioner types are `kubernetes.io/aws-ebs` and `kubernetes.io/gce-pd`.

### Parameters
Storage classes have parameters that describe volumes belonging to the storage
class. Different parameters may be accepted depending on the `provisioner`. For
 example, the value `io1`, for the parameter `type`, and the parameter
`iopsPerGB` are specific to EBS. When a parameter is omitted, some default is
used.

#### AWS

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1beta1
metadata:
  name: slow
provisioner: kubernetes.io/aws-ebs
parameters:
  type: io1
  zone: us-east-1d
  iopsPerGB: "10"
```

* `type`: `io1`, `gp2`, `sc1`, `st1`. See [AWS docs](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html) for details. Default: `gp2`.
* `zone`: AWS zone. If not specified, a random zone from those where Kubernetes cluster has a node is chosen.
* `iopsPerGB`: only for `io1` volumes. I/O operations per second per GiB. AWS volume plugin multiplies this with size of requested volume to compute IOPS of the volume and caps it at 20 000 IOPS (maximum supported by AWS, see [AWS docs](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html). A string is expected here, i.e. `"10"`, not `10`.
* `encrypted`: denotes whether the EBS volume should be encrypted or not. Valid values are `"true"` or `"false"`. A string is expected here, i.e. `"true"`, not `true`.
* `kmsKeyId`: optional. The full Amazon Resource Name of the key to use when encrypting the volume. If none is supplied but `encrypted` is true, a key is generated by AWS. See AWS docs for valid ARN value.

#### GCE

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1beta1
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
  zone: us-central1-a
```

* `type`: `pd-standard` or `pd-ssd`. Default: `pd-ssd`
* `zone`: GCE zone. If not specified, a random zone in the same region as controller-manager will be chosen.

#### Glusterfs

```yaml
apiVersion: storage.k8s.io/v1beta1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://127.0.0.1:8081"
  restauthenabled: "true"
  restuser: "admin"
  secretNamespace: "default"
  secretName: "heketi-secret"

```

* `resturl`: Gluster REST service/Heketi service url which provision gluster volumes on demand. The general format should be `IPaddress:Port` and this is a mandatory parameter for GlusterFS dynamic provisioner. If Heketi service is exposed as a routable service in openshift/kubernetes setup, this can have a format similar to
`http://heketi-storage-project.cloudapps.mystorage.com` where the fqdn is a resolvable heketi service url.
* `restauthenabled` : Gluster REST service authentication boolean that enables authentication to the REST server. If this value is 'true', `restuser` and `restuserkey` or `secretNamespace` + `secretName` have to be filled. This option is deprecated, authentication is enabled when any of `restuser`, `restuserkey`, `secretName` or `secretNamespace` is specified.
* `restuser` : Gluster REST service/Heketi user who has access to create volumes in the Gluster Trusted Pool.
* `restuserkey` : Gluster REST service/Heketi user's password which will be used for authentication to the REST server. This parameter is deprecated in favor of `secretNamespace` + `secretName`.
* `secretNamespace` + `secretName` : Identification of Secret instance that containes user password to use when talking to Gluster REST service. These parameters are optional, empty password will be used when both `secretNamespace` and `secretName` are omitted. The provided secret must have type "kubernetes.io/glusterfs", e.g. created in this way:
  ```
  $ kubectl create secret generic heketi-secret --type="kubernetes.io/glusterfs" --from-literal=key='opensesame' --namespace=default
  ```

#### OpenStack Cinder

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1beta1
metadata:
  name: gold
provisioner: kubernetes.io/cinder
parameters:
  type: fast
  availability: nova
```

* `type`: [VolumeType](http://docs.openstack.org/admin-guide/dashboard-manage-volumes.html) created in Cinder. Default is empty.
* `availability`: Availability Zone. Default is empty.

#### vSphere

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1beta1
metadata:
  name: fast
provisioner: kubernetes.io/vsphere-volume
parameters:
  diskformat: zeroedthick
```

* `diskformat`: `thin`, `zeroedthick` and `eagerzeroedthick`. Default: `"thin"`.

#### Ceph RBD

```yaml
  apiVersion: storage.k8s.io/v1beta1
  kind: StorageClass
  metadata:
    name: fast
  provisioner: kubernetes.io/rbd
  parameters:
    monitors: 10.16.153.105:6789
    adminId: kube
    adminSecretName: ceph-secret
    adminSecretNamespace: kube-system
    pool: kube
    userId: kube
    userSecretName: ceph-secret-user
```

* `monitors`: Ceph monitors, comma delimited. This parameter is required.
* `adminId`: Ceph client ID that is capable of creating images in the pool. Default is "admin".
* `adminSecretNamespace`: The namespace for `adminSecret`. Default is "default".
* `adminSecret`: Secret Name for `adminId`. This parameter is required. The provided secret must have type "kubernetes.io/rbd".
* `pool`: Ceph RBD pool. Default is "rbd".
* `userId`: Ceph client ID that is used to map the RBD image. Default is the same as `adminId`.
* `userSecretName`: The name of Ceph Secret for `userId` to map RBD image. It must exist in the same namespace as PVCs. This parameter is required. The provided secret must have type "kubernetes.io/rbd", e.g. created in this way:
  ```
  $ kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' --namespace=kube-system
  ```

#### Quobyte

```yaml
apiVersion: storage.k8s.io/v1beta1
kind: StorageClass
metadata:
   name: slow
provisioner: kubernetes.io/quobyte
parameters:
    quobyteAPIServer: "http://138.68.74.142:7860"
    registry: "138.68.74.142:7861"
    adminSecretName: "quobyte-admin-secret"
    adminSecretNamespace: "kube-system"
    user: "root"
    group: "root"
    quobyteConfig: "BASE"
    quobyteTenant: "DEFAULT"
```

* `quobyteAPIServer`: API Server of Quobyte in the format `http(s)://api-server:7860`
* `registry`: Quobyte registry to use to mount the volume. You can specify the registry as ``<host>:<port>`` pair or if you want to specify multiple registries you just have to put a comma between them e.q. ``<host1>:<port>,<host2>:<port>,<host3>:<port>``. The host can be an IP address or if you have a working DNS you can also provide the DNS names.
* `adminSecretNamespace`: The namespace for `adminSecretName`. Default is "default".
* `adminSecretName`: secret that holds information about the Quobyte user and the password to authenticate agains the API server. The provided secret must have type "kubernetes.io/quobyte", e.g. created in this way:
  ```
  $ kubectl create secret generic quobyte-admin-secret --type="kubernetes.io/quobyte" --from-literal=key='opensesame' --namespace=kube-system
  ```
* `user`: maps all access to this user. Default is "root".
* `group`: maps all access to this group. Default is "nfsnobody".
* `quobyteConfig`: use the specified configuration to create the volume. You can create a new configuration or modify an existing one with the Web console or the quobyte CLI. Default is "BASE".
* `quobyteTenant`: use the specified tenant ID to create/delete the volume. This Quobyte tenant has to be already present in Quobyte. Default is "DEFAULT".

#### Azure Disk

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1beta1
metadata:
  name: slow
provisioner: kubernetes.io/azure-disk
parameters:
  skuName: Standard_LRS
  location: eastus
  storageAccount: azure_storage_account_name
```

* `skuName`: Azure storage account Sku tier. Default is empty.
* `location`: Azure storage account location. Default is empty.
* `storageAccount`: Azure storage account name. If storage account is not provided, all storage accounts associated with the resource group are searched to find one that matches `skuName` and `location`. If storage account is provided, it must reside in the same resource group as the cluster, and `skuName` and `location` are ignored.


## Writing Portable Configuration

If you're writing configuration templates or examples that run on a wide range of clusters
and need persistent storage, we recommend that you use the following pattern:

- Do include PersistentVolumeClaim objects in your bundle of config (alongside Deployments, ConfigMaps, etc).
- Do not include PersistentVolume objects in the config, since the user instantiating the config may not have
  permission to create PersistentVolumes.
- Give the user the option of providing a storage class name when instantiating the template.
  - If the user provides a storage class name, and the cluster is version 1.4 or newer, put that value into the `volume.beta.kubernetes.io/storage-class` annotation of the PVC.
    This will cause the PVC to match the right storage class if the cluster has StorageClasses enabled by the admin.
  - If the user does not provide a storage class name or the cluster is version 1.3, then instead put a `volume.alpha.kubernetes.io/storage-class: default` annotation on the PVC.
    - This will cause a PV to be automatically provisioned for the user with sane default characteristics on some clusters.  
    - Despite the word `alpha` in the name, the code behind this annotation has `beta` level support.
    - Do not use `volume.beta.kubernetes.io/storage-class:` with any value including the empty string since it will prevent DefaultStorageClass admission controller
      from running if enabled.
- In your tooling, do watch for PVCs that are not getting bound after some time and surface this to the user, as this may indicate that the cluster has no dynamic
  storage support (in which case the user should create a matching PV) or the cluster has no storage system (in which case the user cannot deploy config requiring
  PVCs).
- In the future, we expect most clusters to have `DefaultStorageClass` enabled, and to have some form of storage available.  However, there may not be any
  storage class names which work on all clusters, so continue to not set one by default.
  At some point, the alpha annotation will cease to have meaning, but the unset `storageClass` field on the PVC
  will have the desired effect.
