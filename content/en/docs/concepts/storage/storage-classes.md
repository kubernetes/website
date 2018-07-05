---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Storage Classes
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

This document describes the concept of `StorageClass` in Kubernetes. Familiarity
with [volumes](/docs/concepts/storage/volumes/) and
[persistent volumes](/docs/concepts/storage/persistent-volumes) is suggested.

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

## Introduction

A `StorageClass` provides a way for administrators to describe the "classes" of
storage they offer. Different classes might map to quality-of-service levels,
or to backup policies, or to arbitrary policies determined by the cluster
administrators. Kubernetes itself is unopinionated about what classes
represent. This concept is sometimes called "profiles" in other storage
systems.

## The StorageClass Resource

Each `StorageClass` contains the fields `provisioner`, `parameters`, and
`reclaimPolicy`, which are used when a `PersistentVolume` belonging to the
class needs to be dynamically provisioned.

The name of a `StorageClass` object is significant, and is how users can
request a particular class. Administrators set the name and other parameters
of a class when first creating `StorageClass` objects, and the objects cannot
be updated once they are created.

Administrators can specify a default `StorageClass` just for PVCs that don't
request any particular class to bind to: see the
[`PersistentVolumeClaim` section](/docs/concepts/storage/persistent-volumes/#class-1)
for details.

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
reclaimPolicy: Retain
mountOptions:
  - debug
```

### Provisioner

Storage classes have a provisioner that determines what volume plugin is used
for provisioning PVs. This field must be specified.

| Volume Plugin        | Internal Provisioner| Config Example                       |
| :---                 |     :---:           |    :---:                             |
| AWSElasticBlockStore | &#x2713;            | [AWS](#aws)                          |
| AzureFile            | &#x2713;            | [Azure File](#azure-file)            |
| AzureDisk            | &#x2713;            | [Azure Disk](#azure-disk)            |
| CephFS               | -                   | -                                    |
| Cinder               | &#x2713;            | [OpenStack Cinder](#openstack-cinder)|
| FC                   | -                   | -                                    |
| FlexVolume           | -                   | -                                    |
| Flocker              | &#x2713;            | -                                    |
| GCEPersistentDisk    | &#x2713;            | [GCE](#gce)                          |
| Glusterfs            | &#x2713;            | [Glusterfs](#glusterfs)              |
| iSCSI                | -                   | -                                    |
| Quobyte              | &#x2713;            | [Quobyte](#quobyte)                  |
| NFS                  | -                   | -                                    |
| RBD                  | &#x2713;            | [Ceph RBD](#ceph-rbd)                |
| VsphereVolume        | &#x2713;            | [vSphere](#vsphere)                  |
| PortworxVolume       | &#x2713;            | [Portworx Volume](#portworx-volume)  |
| ScaleIO              | &#x2713;            | [ScaleIO](#scaleio)                  |
| StorageOS            | &#x2713;            | [StorageOS](#storageos)              |
| Local                | -                   | [Local](#local)              |

You are not restricted to specifying the "internal" provisioners
listed here (whose names are prefixed with "kubernetes.io" and shipped
alongside Kubernetes). You can also run and specify external provisioners,
which are independent programs that follow a [specification](https://git.k8s.io/community/contributors/design-proposals/storage/volume-provisioning.md)
defined by Kubernetes. Authors of external provisioners have full discretion
over where their code lives, how the provisioner is shipped, how it needs to be
run, what volume plugin it uses (including Flex), etc. The repository [kubernetes-incubator/external-storage](https://github.com/kubernetes-incubator/external-storage)
houses a library for writing external provisioners that implements the bulk of
the specification plus various community-maintained external provisioners.

For example, NFS doesn't provide an internal provisioner, but an external provisioner
can be used. Some external provisioners are listed under the repository [kubernetes-incubator/external-storage](https://github.com/kubernetes-incubator/external-storage).
There are also cases when 3rd party storage vendors provide their own external
provisioner.

### Reclaim Policy

Persistent Volumes that are dynamically created by a storage class will have the
reclaim policy specified in the `reclaimPolicy` field of the class, which can be
either `Delete` or `Retain`. If no `reclaimPolicy` is specified when a
`StorageClass` object is created, it will default to `Delete`.

Persistent Volumes that are created manually and managed via a storage class will have
whatever reclaim policy they were assigned at creation.

### Mount Options

Persistent Volumes that are dynamically created by a storage class will have the
mount options specified in the `mountOptions` field of the class.

If the volume plugin does not support mount options but mount options are
specified, provisioning will fail. Mount options are not validated on either
the class or PV, so mount of the PV will simply fail if one is invalid.

## Parameters

Storage classes have parameters that describe volumes belonging to the storage
class. Different parameters may be accepted depending on the `provisioner`. For
 example, the value `io1`, for the parameter `type`, and the parameter
`iopsPerGB` are specific to EBS. When a parameter is omitted, some default is
used.

### AWS

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: slow
provisioner: kubernetes.io/aws-ebs
parameters:
  type: io1
  zones: us-east-1d, us-east-1c
  iopsPerGB: "10"
```

* `type`: `io1`, `gp2`, `sc1`, `st1`. See
  [AWS docs](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)
  for details. Default: `gp2`.
* `zone`: AWS zone. If neither `zone` nor `zones` is specified, volumes are
  generally round-robin-ed across all active zones where Kubernetes cluster
  has a node. `zone` and `zones` parameters must not be used at the same time.
* `zones`: A comma separated list of AWS zone(s). If neither `zone` nor `zones`
  is specified, volumes are generally round-robin-ed across all active zones
  where Kubernetes cluster has a node. `zone` and `zones` parameters must not
  be used at the same time.
* `iopsPerGB`: only for `io1` volumes. I/O operations per second per GiB. AWS
  volume plugin multiplies this with size of requested volume to compute IOPS
  of the volume and caps it at 20 000 IOPS (maximum supported by AWS, see
  [AWS docs](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html).
  A string is expected here, i.e. `"10"`, not `10`.
* `encrypted`: denotes whether the EBS volume should be encrypted or not.
  Valid values are `"true"` or `"false"`. A string is expected here,
  i.e. `"true"`, not `true`.
* `kmsKeyId`: optional. The full Amazon Resource Name of the key to use when
  encrypting the volume. If none is supplied but `encrypted` is true, a key is
  generated by AWS. See AWS docs for valid ARN value.

### GCE

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
  zones: us-central1-a, us-central1-b
  replication-type: none
```

* `type`: `pd-standard` or `pd-ssd`. Default: `pd-standard`
* `zone`: GCE zone. If neither `zone` nor `zones` is specified, volumes are
  generally round-robin-ed across all active zones where Kubernetes cluster has
  a node. `zone` and `zones` parameters must not be used at the same time.
* `zones`: A comma separated list of GCE zone(s). If neither `zone` nor `zones`
  is specified, volumes are generally round-robin-ed across all active zones
  where Kubernetes cluster has a node. `zone` and `zones` parameters must not
  be used at the same time.
* `replication-type`: `none` or `regional-pd`. Default: `none`.

If `replication-type` is set to `none`, a regular (zonal) PD will be provisioned.

If `replication-type` is set to `regional-pd`, a
[Regional Persistent Disk](https://cloud.google.com/compute/docs/disks/#repds)
will be provisioned. In this case, users must use `zones` instead of `zone` to
specify the desired replication zones. If exactly two zones are specified, the
Regional PD will be provisioned in those zones. If more than two zones are
specified, Kubernetes will arbitrarily choose among the specified zones. If the
`zones` parameter is omitted, Kubernetes will arbitrarily choose among zones
managed by the cluster.

### Glusterfs

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://127.0.0.1:8081"
  clusterid: "630372ccdc720a92c681fb928f27b53f"
  restauthenabled: "true"
  restuser: "admin"
  secretNamespace: "default"
  secretName: "heketi-secret"
  gidMin: "40000"
  gidMax: "50000"
  volumetype: "replicate:3"
```

* `resturl`: Gluster REST service/Heketi service url which provision gluster
  volumes on demand. The general format should be `IPaddress:Port` and this is
  a mandatory parameter for GlusterFS dynamic provisioner. If Heketi service is
  exposed as a routable service in openshift/kubernetes setup, this can have a
  format similar to `http://heketi-storage-project.cloudapps.mystorage.com`
  where the fqdn is a resolvable Heketi service url.
* `restauthenabled` : Gluster REST service authentication boolean that enables
  authentication to the REST server. If this value is `"true"`, `restuser` and
  `restuserkey` or `secretNamespace` + `secretName` have to be filled. This
  option is deprecated, authentication is enabled when any of `restuser`,
  `restuserkey`, `secretName` or `secretNamespace` is specified.
* `restuser` : Gluster REST service/Heketi user who has access to create volumes
  in the Gluster Trusted Pool.
* `restuserkey` : Gluster REST service/Heketi user's password which will be used
  for authentication to the REST server. This parameter is deprecated in favor
  of `secretNamespace` + `secretName`.
* `secretNamespace`, `secretName` : Identification of Secret instance that
  contains user password to use when talking to Gluster REST service. These
  parameters are optional, empty password will be used when both
  `secretNamespace` and `secretName` are omitted. The provided secret must have
  type `"kubernetes.io/glusterfs"`, e.g. created in this way:
  ```
  kubectl create secret generic heketi-secret \
    --type="kubernetes.io/glusterfs" --from-literal=key='opensesame' \
    --namespace=default
  ```
  Example of a secret can be found in
  [glusterfs-provisioning-secret.yaml](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/glusterfs/glusterfs-secret.yaml).
* `clusterid`: `630372ccdc720a92c681fb928f27b53f` is the ID of the cluster
  which will be used by Heketi when provisioning the volume. It can also be a
  list of clusterids, for example:
  `"8452344e2becec931ece4e33c4674e4e,42982310de6c63381718ccfa6d8cf397"`. This
  is an optional parameter.
* `gidMin`, `gidMax` : The minimum and maximum value of GID range for the
  storage class. A unique value (GID) in this range ( gidMin-gidMax ) will be
  used for dynamically provisioned volumes. These are optional values. If not
  specified, the volume will be provisioned with a value between 2000-2147483647
  which are defaults for gidMin and gidMax respectively.
* `volumetype` : The volume type and its parameters can be configured with this
  optional value. If the volume type is not mentioned, it's up to the provisioner
  to decide the volume type.
  For example:
    'Replica volume':
      `volumetype: replicate:3` where '3' is replica count.
    'Disperse/EC volume':
      `volumetype: disperse:4:2` where '4' is data and '2' is the redundancy count.
    'Distribute volume':
      `volumetype: none`

  For available volume types and administration options, refer to the
[Administration Guide](https://access.redhat.com/documentation/en-US/Red_Hat_Storage/3.1/html/Administration_Guide/part-Overview.html).

  For further reference information, see
[How to configure Heketi](https://github.com/heketi/heketi/wiki/Setting-up-the-topology).

  When persistent volumes are dynamically provisioned, the Gluster plugin
automatically creates an endpoint and a headless service in the name
`gluster-dynamic-<claimname>`. The dynamic endpoint and service are automatically
deleted when the persistent volume claim is deleted.

### OpenStack Cinder

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: gold
provisioner: kubernetes.io/cinder
parameters:
  type: fast
  availability: nova
```

* `type`: [VolumeType](https://docs.openstack.org/user-guide/dashboard-manage-volumes.html)
  created in Cinder. Default is empty.
* `availability`: Availability Zone. If not specified, volumes are generally
  round-robin-ed across all active zones where Kubernetes cluster has a node.

### vSphere

1. Create a StorageClass with a user specified disk format.

        kind: StorageClass
        apiVersion: storage.k8s.io/v1
        metadata:
          name: fast
        provisioner: kubernetes.io/vsphere-volume
        parameters:
          diskformat: zeroedthick

    `diskformat`: `thin`, `zeroedthick` and `eagerzeroedthick`. Default: `"thin"`.

2. Create a StorageClass with a disk format on a user specified datastore.

        kind: StorageClass
        apiVersion: storage.k8s.io/v1
        metadata:
          name: fast
        provisioner: kubernetes.io/vsphere-volume
        parameters:
            diskformat: zeroedthick
            datastore: VSANDatastore

    `datastore`: The user can also specify the datastore in the StorageClass.
    The volume will be created on the datastore specified in the storage class,
    which in this case is `VSANDatastore`. This field is optional. If the
    datastore is not specified, then the volume will be created on the datastore
    specified in the vSphere config file used to initialize the vSphere Cloud
    Provider.

3. Storage Policy Management inside kubernetes

    * Using existing vCenter SPBM policy

      One of the most important features of vSphere for Storage Management is
      policy based Management. Storage Policy Based Management (SPBM) is a
      storage policy framework that provides a single unified control plane
      across a broad range of data services and storage solutions. SPBM enables
      vSphere administrators to overcome upfront storage provisioning challenges,
      such as capacity planning, differentiated service levels and managing
      capacity headroom.

      The SPBM policies can be specified in the StorageClass using the
      `storagePolicyName` parameter.

    * Virtual SAN policy support inside Kubernetes

      Vsphere Infrastructure (VI) Admins will have the ability to specify custom
      Virtual SAN Storage Capabilities during dynamic volume provisioning. You
      can now define storage requirements, such as performance and availability,
      in the form of storage capabilities during dynamic volume provisioning.
      The storage capability requirements are converted into a Virtual SAN
      policy which are then pushed down to the Virtual SAN layer when a
      persistent volume (virtual disk) is being created. The virtual disk is
      distributed across the Virtual SAN datastore to meet the requirements.

      You can see [Storage Policy Based Management for dynamic provisioning of volumes](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/policy-based-mgmt.html)
      for more details on how to use storage policies for persistent volumes
      management.

There are few
[vSphere examples](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)
which you try out for persistent volume management inside Kubernetes for vSphere.

### Ceph RBD

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
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
  fsType: ext4
  imageFormat: "2"
  imageFeatures: "layering"
```

* `monitors`: Ceph monitors, comma delimited. This parameter is required.
* `adminId`: Ceph client ID that is capable of creating images in the pool.
  Default is "admin".
* `adminSecretNamespace`: The namespace for `adminSecret`. Default is "default".
* `adminSecret`: Secret Name for `adminId`. This parameter is required.
  The provided secret must have type "kubernetes.io/rbd".
* `pool`: Ceph RBD pool. Default is "rbd".
* `userId`: Ceph client ID that is used to map the RBD image. Default is the
  same as `adminId`.
* `userSecretName`: The name of Ceph Secret for `userId` to map RBD image. It
  must exist in the same namespace as PVCs. This parameter is required.
  The provided secret must have type "kubernetes.io/rbd", e.g. created in this
  way:
  ```
  kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" \
    --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' \
    --namespace=kube-system
  ```
* `fsType`: fsType that is supported by kubernetes. Default: `"ext4"`.
* `imageFormat`: Ceph RBD image format, "1" or "2". Default is "1".
* `imageFeatures`: This parameter is optional and should only be used if you
  set `imageFormat` to "2". Currently supported features are `layering` only.
  Default is "", and no features are turned on.

### Quobyte

```yaml
apiVersion: storage.k8s.io/v1
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

* `quobyteAPIServer`: API Server of Quobyte in the format
  `"http(s)://api-server:7860"`
* `registry`: Quobyte registry to use to mount the volume. You can specify the
  registry as ``<host>:<port>`` pair or if you want to specify multiple
  registries you just have to put a comma between them e.q.
  ``<host1>:<port>,<host2>:<port>,<host3>:<port>``.
  The host can be an IP address or if you have a working DNS you can also
  provide the DNS names.
* `adminSecretNamespace`: The namespace for `adminSecretName`.
  Default is "default".
* `adminSecretName`: secret that holds information about the Quobyte user and
  the password to authenticate against the API server. The provided secret
  must have type "kubernetes.io/quobyte", e.g. created in this way:
  ```
  kubectl create secret generic quobyte-admin-secret \
    --type="kubernetes.io/quobyte" --from-literal=key='opensesame' \
    --namespace=kube-system
  ```
* `user`: maps all access to this user. Default is "root".
* `group`: maps all access to this group. Default is "nfsnobody".
* `quobyteConfig`: use the specified configuration to create the volume. You
  can create a new configuration or modify an existing one with the Web
  console or the quobyte CLI. Default is "BASE".
* `quobyteTenant`: use the specified tenant ID to create/delete the volume.
  This Quobyte tenant has to be already present in Quobyte.
  Default is "DEFAULT".

### Azure Disk

#### Azure Unmanaged Disk Storage Class

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
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
* `storageAccount`: Azure storage account name. If a storage account is provided,
  it must reside in the same resource group as the cluster, and `location` is
  ignored. If a storage account is not provided, a new storage account will be
  created in the same resource group as the cluster.

#### New Azure Disk Storage Class (starting from v1.7.2)

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: slow
provisioner: kubernetes.io/azure-disk
parameters:
  storageaccounttype: Standard_LRS
  kind: Shared
```

* `storageaccounttype`: Azure storage account Sku tier. Default is empty.
* `kind`: Possible values are `shared` (default), `dedicated`, and `managed`.
  When `kind` is `shared`, all unmanaged disks are created in a few shared
  storage accounts in the same resource group as the cluster. When `kind` is
  `dedicated`, a new dedicated storage account will be created for the new
  unmanaged disk in the same resource group as the cluster. When `kind` is 
  `managed`, all managed disks are created in the same resource group as 
  the cluster.

- Premium VM can attach both Standard_LRS and Premium_LRS disks, while Standard
  VM can only attach Standard_LRS disks.
- Managed VM can only attach managed disks and unmanaged VM can only attach
  unmanaged disks.

### Azure File

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: azurefile
provisioner: kubernetes.io/azure-file
parameters:
  skuName: Standard_LRS
  location: eastus
  storageAccount: azure_storage_account_name
```

* `skuName`: Azure storage account Sku tier. Default is empty.
* `location`: Azure storage account location. Default is empty.
* `storageAccount`: Azure storage account name.  Default is empty. If a storage
  account is not provided, all storage accounts associated with the resource
  group are searched to find one that matches `skuName` and `location`. If a
  storage account is provided, it must reside in the same resource group as the
  cluster, and `skuName` and `location` are ignored.

During provision, a secret is created for mounting credentials. If the cluster
has enabled both [RBAC](/docs/admin/authorization/rbac/) and
[Controller Roles](/docs/admin/authorization/rbac/#controller-roles), add the
`create` permission of resource `secret` for clusterrole
`system:controller:persistent-volume-binder`.

### Portworx Volume

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: portworx-io-priority-high
provisioner: kubernetes.io/portworx-volume
parameters:
  repl: "1"
  snap_interval:   "70"
  io_priority:  "high"

```

* `fs`: filesystem to be laid out: [none/xfs/ext4] (default: `ext4`).
* `block_size`: block size in Kbytes (default: `32`).
* `repl`: number of synchronous replicas to be provided in the form of
  replication factor [1..3] (default: `1`) A string is expected here i.e.
  `"1"` and not `1`.
* `io_priority`: determines whether the volume will be created from higher
  performance or a lower priority storage [high/medium/low] (default: `low`).
* `snap_interval`: clock/time interval in minutes for when to trigger snapshots.
  Snapshots are incremental based on difference with the prior snapshot, 0
  disables snaps (default: `0`). A string is expected here i.e.
  `"70"` and not `70`.
* `aggregation_level`: specifies the number of chunks the volume would be
  distributed into, 0 indicates a non-aggregated volume (default: `0`). A string
  is expected here i.e. `"0"` and not `0`
* `ephemeral`: specifies whether the volume should be cleaned-up after unmount
  or should be persistent. `emptyDir` use case can set this value to true and
  `persistent volumes` use case such as for databases like Cassandra should set
  to false, [true/false] (default `false`). A string is expected here i.e.
  `"true"` and not `true`.

### ScaleIO

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: slow
provisioner: kubernetes.io/scaleio
parameters:
  gateway: https://192.168.99.200:443/api
  system: scaleio
  protectionDomain: pd0
  storagePool: sp1
  storageMode: ThinProvisioned
  secretRef: sio-secret
  readOnly: false
  fsType: xfs
```

* `provisioner`: attribute is set to `kubernetes.io/scaleio`
* `gateway`: address to a ScaleIO API gateway (required)
* `system`: the name of the ScaleIO system (required)
* `protectionDomain`: the name of the ScaleIO protection domain (required)
* `storagePool`: the name of the volume storage pool (required)
* `storageMode`: the storage provision mode: `ThinProvisioned` (default) or
  `ThickProvisioned`
* `secretRef`: reference to a configured Secret object (required)
* `readOnly`: specifies the access mode to the mounted volume (default false)
* `fsType`: the file system to use for the volume (default ext4)

The ScaleIO Kubernetes volume plugin requires a configured Secret object.
The secret must be created with type `kubernetes.io/scaleio` and use the same
namespace value as that of the PVC where it is referenced
as shown in the following command:

```shell
kubectl create secret generic sio-secret --type="kubernetes.io/scaleio" \
--from-literal=username=sioadmin --from-literal=password=d2NABDNjMA== \
--namespace=default
```

### StorageOS

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: fast
provisioner: kubernetes.io/storageos
parameters:
  pool: default
  description: Kubernetes volume
  fsType: ext4
  adminSecretNamespace: default
  adminSecretName: storageos-secret
```

* `pool`: The name of the StorageOS distributed capacity pool to provision the
  volume from.  Uses the `default` pool which is normally present if not specified.
* `description`: The description to assign to volumes that were created dynamically.
  All volume descriptions will be the same for the storage class, but different
  storage classes can be used to allow descriptions for different use cases.
  Defaults to `Kubernetes volume`.
* `fsType`: The default filesystem type to request. Note that user-defined rules
  within StorageOS may override this value.  Defaults to `ext4`.
* `adminSecretNamespace`: The namespace where the API configuration secret is
  located. Required if adminSecretName set.
* `adminSecretName`: The name of the secret to use for obtaining the StorageOS
  API credentials. If not specified, default values will be attempted.

The StorageOS Kubernetes volume plugin can use a Secret object to specify an
endpoint and credentials to access the StorageOS API. This is only required when
the defaults have been changed.
The secret must be created with type `kubernetes.io/storageos` as shown in the
following command:

```shell
kubectl create secret generic storageos-secret \
--type="kubernetes.io/storageos" \
--from-literal=apiAddress=tcp://localhost:5705 \
--from-literal=apiUsername=storageos \
--from-literal=apiPassword=storageos \
--namespace=default
```

Secrets used for dynamically provisioned volumes may be created in any namespace
and referenced with the `adminSecretNamespace` parameter. Secrets used by
pre-provisioned volumes must be created in the same namespace as the PVC that
references it.

### Local

{{< feature-state for_k8s_version="v1.10" state="beta" >}}

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

Local volumes do not support dynamic provisioning yet, however a StorageClass
should still be created to delay volume binding until pod scheduling. This is
specified by the `WaitForFirstConsumer` volume binding mode.

Delaying volume binding allows the scheduler to consider all of a pod's
scheduling constraints when choosing an appropriate PersistentVolume for a
PersistentVolumeClaim.

{{% /capture %}}