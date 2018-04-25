---
approvers:
- jsafrane
- mikedanese
- saad-ali
- thockin
cn-approvers:
- zhangqx2010
title: Storage Classes
---
<!--
---
approvers:
- jsafrane
- mikedanese
- saad-ali
- thockin
  title: Storage Classes
---
-->

<!--
This document describes the concept of `StorageClass` in Kubernetes. Familiarity
with [volumes](/docs/concepts/storage/volumes/) and
[persistent volumes](/docs/concepts/storage/persistent-volumes) is suggested.
 -->
本文档介绍了 Kubernetes 中 `StorageClass` 的概念。建议熟悉 [卷](/docs/concepts/storage/volumes/) 和
[Persistent Volume（持久卷）](/docs/concepts/storage/persistent-volumes)。

* TOC
{:toc}

<!--
## Introduction
 -->
## 介绍

<!--
A `StorageClass` provides a way for administrators to describe the "classes" of
storage they offer. Different classes might map to quality-of-service levels,
or to backup policies, or to arbitrary policies determined by the cluster
administrators. Kubernetes itself is unopinionated about what classes
represent. This concept is sometimes called "profiles" in other storage
systems.
 -->
`StorageClass` 为管理员提供了描述存储 "class（类）" 的方法。
不同的 class 可能会映射到不同的服务质量等级或备份策略，或由群集管理员确定的任意策略。
Kubernetes 本身不清楚各种 class 代表的什么。这个概念在其他存储系统中有时被称为“配置文件”。

<!--
## The StorageClass Resource
 -->
## StorageClass 资源

<!--
Each `StorageClass` contains the fields `provisioner`, `parameters`, and
`reclaimPolicy`, which are used when a `PersistentVolume` belonging to the
class needs to be dynamically provisioned.
 -->
`StorageClass` 中包含 `provisioner`、`parameters` 和 `reclaimPolicy` 字段，当 class 需要动态分配 `PersistentVolume` 时会使用到。

<!--
The name of a `StorageClass` object is significant, and is how users can
request a particular class. Administrators set the name and other parameters
of a class when first creating `StorageClass` objects, and the objects cannot
be updated once they are created.
 -->
`StorageClass` 对象的名称很重要，用户使用这个名称来请求一个特定的类。
当创建 `StorageClass` 对象时，管理员设置名称和其他参数，一旦创建了对象就不能再对其更新。

<!-- Administrators can specify a default `StorageClass` just for PVCs that don't
request any particular class to bind to: see the
[`PersistentVolumeClaim` section](#persistentvolumeclaims)
for details. -->
管理员可以为没有申请绑定到特定 class 的 PVC 指定一个默认的 `StorageClass` ：
更多详情请参阅 [`PersistentVolumeClaim` 章节](#persistentvolumeclaims)。

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

<!--
### Provisioner
 -->
### Provisioner（存储分配器）

<!--
Storage classes have a provisioner that determines what volume plugin is used
for provisioning PVs. This field must be specified.
 -->
Storage class 有一个分配器，用来决定使用哪个卷插件分配 PV。该字段必须指定。

| Internal Provisioner | Volume Plugin        | Config Example                        |
| :------------------- | :------------------- | :------------------------------------ |
| &#x2713;             | AWSElasticBlockStore | [AWS](#aws)                           |
| &#x2713;             | AzureFile            | [Azure File](#azure-file)             |
| &#x2713;             | AzureDisk            | [Azure Disk](#azure-disk)             |
| -                    | CephFS               | -                                     |
| &#x2713;             | Cinder               | [OpenStack Cinder](#openstack-cinder) |
| -                    | FC                   | -                                     |
| -                    | FlexVolume           | -                                     |
| &#x2713;             | Flocker              | -                                     |
| &#x2713;             | GCEPersistentDisk    | [GCE](#gce)                           |
| &#x2713;             | Glusterfs            | [Glusterfs](#glusterfs)               |
| -                    | iSCSI                | -                                     |
| &#x2713;             | PhotonPersistentDisk | -                                     |
| &#x2713;             | Quobyte              | [Quobyte](#quobyte)                   |
| -                    | NFS                  | -                                     |
| &#x2713;             | RBD                  | [Ceph RBD](#ceph-rbd)                 |
| &#x2713;             | VsphereVolume        | [vSphere](#vsphere)                   |
| &#x2713;             | PortworxVolume       | [Portworx Volume](#portworx-volume)   |
| &#x2713;             | ScaleIO              | [ScaleIO](#scaleio)                   |
| &#x2713;             | StorageOS            | [StorageOS](#storageos)               |

<!--
You are not restricted to specifying the "internal" provisioners
listed here (whose names are prefixed with "kubernetes.io" and shipped
alongside Kubernetes). You can also run and specify external provisioners,
which are independent programs that follow a [specification](https://git.k8s.io/community/contributors/design-proposals/storage/volume-provisioning.md)
defined by Kubernetes. Authors of external provisioners have full discretion
over where their code lives, how the provisioner is shipped, how it needs to be
run, what volume plugin it uses (including Flex), etc. The repository [kubernetes-incubator/external-storage](https://github.com/kubernetes-incubator/external-storage)
houses a library for writing external provisioners that implements the bulk of
the specification plus various community-maintained external provisioners.
 -->
您不限于指定此处列出的"内置"分配器（其名称前缀为 kubernetes.io 并打包在 Kubernetes 中）。
您还可以运行和指定外部分配器，这些独立的程序遵循由 Kubernetes 定义的 [规范](https://git.k8s.io/community/contributors/design-proposals/storage/volume-provisioning.md)。
外部供应商的作者完全可以自由决定他们的代码保存于何处、打包方式、运行方式、使用的插件（包括Flex）等。
代码仓库 [kubernetes-incubator/external-storage](https://github.com/kubernetes-incubator/external-storage)
包含一个用于为外部分配器编写功能实现的类库，以及各种社区维护的外部分配器。

<!--
For example, NFS doesn't provide an internal provisioner, but an external provisioner
can be used. Some external provisioners are listed under the repository [kubernetes-incubator/external-storage](https://github.com/kubernetes-incubator/external-storage).
There are also cases when 3rd party storage vendors provide their own external
provisioner.
 -->
例如，NFS 没有内部分配器，但可以使用外部分配器。一些外部分配器在代码仓库 [kubernetes-incubator/external-storage](https://github.com/kubernetes-incubator/external-storage) 中。
也有第三方存储供应商提供自己的外部分配器。

<!--
### Reclaim Policy
 -->
### 回收策略

<!--
Persistent Volumes that are dynamically created by a storage class will have the
reclaim policy specified in the `reclaimPolicy` field of the class, which can be
either `Delete` or `Retain`. If no `reclaimPolicy` is specified when a
`StorageClass` object is created, it will default to `Delete`.
 -->
由 storage class 动态创建的 Persistent Volume 会在的 `reclaimPolicy` 字段中指定回收策略，可以是
`Delete` 或者 `Retain`。如果 `StorageClass` 对象被创建时没有指定 `reclaimPolicy` ，它将默认为 `Delete`。

<!--
Persistent Volumes that are created manually and managed via a storage class will have
whatever reclaim policy they were assigned at creation.
 -->
通过 storage class 手动创建并管理的 Persistent Volume 会使用它们被创建时指定的回收政策。

<!--
### Mount Options
 -->
### 挂载选项

<!--
Persistent Volumes that are dynamically created by a storage class will have the
mount options specified in the `mountOptions` field of the class.
 -->
由 storage class 动态创建的 Persistent Volume 将使用 class 中 `mountOptions` 字段指定的挂载选项。

<!--
If the volume plugin does not support mount options but mount options are
specified, provisioning will fail. Mount options are not validated on neither
the class nor PV, so mount of the PV will simply fail if one is invalid.
 -->
如果卷插件不支持挂载选项，却指定了该选项，则分配操作失败。
安装选项在 class 和 PV 上都不会做验证，所以如果挂载选项无效，那么这个 PV 就会失败。

<!--
## Parameters
 -->
## 参数

<!--
Storage classes have parameters that describe volumes belonging to the storage
class. Different parameters may be accepted depending on the `provisioner`. For
 example, the value `io1`, for the parameter `type`, and the parameter
`iopsPerGB` are specific to EBS. When a parameter is omitted, some default is
used.
 -->
Storage class 具有描述属于 storage class 卷的参数。取决于`分配器`，可以接受不同的参数。
例如，参数 `type` 的值 `io1` 和参数 `iopsPerGB` 特定于 EBS PV。当参数被省略时，会使用默认值。

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

<!--
* `type`: `io1`, `gp2`, `sc1`, `st1`. See
  [AWS docs](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)
  for details. Default: `gp2`.
  -->
* `type`：`io1`，`gp2`，`sc1`，`st1`。详细信息参见 [AWS 文档](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)。默认值：`gp2`。
  <!--
* `zone`: AWS zone. If neither `zone` nor `zones` is specified, volumes are
  generally round-robin-ed across all active zones where Kubernetes cluster
  has a node. `zone` and `zones` parameters must not be used at the same time.
  -->
* `zone`：AWS 区域。如果没有指定 `zone` 和 `zones`，通常卷会在 Kubernetes 集群节点所在的活动区域中轮询调度（round-robin）分配。
  `zone` 和 `zones` 参数不能同时使用。
  <!--
* `zones`: A comma separated list of AWS zone(s). If neither `zone` nor `zones`
  is specified, volumes are generally round-robin-ed across all active zones
  where Kubernetes cluster has a node. `zone` and `zones` parameters must not
  be used at the same time.
  -->
* `zones`：以逗号分隔的 AWS 区域列表。如果没有指定 `zone` 和 `zones`，通常卷会在 Kubernetes 集群节点所在的活动区域中轮询调度（round-robin）分配。
  `zone`和`zones`参数不能同时使用。
  <!--
* `iopsPerGB`: only for `io1` volumes. I/O operations per second per GiB. AWS
  volume plugin multiplies this with size of requested volume to compute IOPS
  of the volume and caps it at 20 000 IOPS (maximum supported by AWS, see
  [AWS docs](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html).
  A string is expected here, i.e. `"10"`, not `10`.
  -->
* `iopsPerGB`：只适用于 `io1` 卷。每 GiB 每秒 I/O 操作。AWS 卷插件将其与请求卷的大小相乘以计算 IOPS 的容量，
  并将其限制在 20000 IOPS（AWS 支持的最高值，请参阅 [AWS 文档](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)。
  这里需要输入一个字符串，即 `"10"`，而不是 `10`。
  <!--
* `encrypted`: denotes whether the EBS volume should be encrypted or not.
  Valid values are `"true"` or `"false"`. A string is expected here,
  i.e. `"true"`, not `true`.
  -->
* `encrypted`：表示 EBS 卷是否应该被加密。有效值是 `"true"` 或 `"false"`。预计需要输入一个字符串，`"true"`，而不是 `true`。
  <!--
* `kmsKeyId`: optional. The full Amazon Resource Name of the key to use when
  encrypting the volume. If none is supplied but `encrypted` is true, a key is
  generated by AWS. See AWS docs for valid ARN value.
  -->
* `kmsKeyId`：可选。加密卷时使用的密钥的完整 Amazon 资源名称。如果没有提供，但 `encrypted` 值为 true，AWS 生成一个密钥。关于有效的 ARN 值，请参阅 AWS 文档。

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
```

<!--
* `type`: `pd-standard` or `pd-ssd`. Default: `pd-standard`
  -->
* `type`：`pd-standard` 或者 `pd-ssd`。默认：`pd-standard`
  <!--
* `zone`: GCE zone. If neither `zone` nor `zones` is specified, volumes are
  generally round-robin-ed across all active zones where Kubernetes cluster has
  a node. `zone` and `zones` parameters must not be used at the same time.
  -->
* `zone`：GCE 区域。如果没有指定 `zone` 和 `zones`，通常卷会在 Kubernetes 集群节点所在的活动区域中轮询调度（round-robin）分配。
  `zone` 和 `zones` 参数不能同时使用。
  <!--
* `zones`: A comma separated list of GCE zone(s). If neither `zone` nor `zones`
  is specified, volumes are generally round-robin-ed across all active zones
  where Kubernetes cluster has a node. `zone` and `zones` parameters must not
  be used at the same time.
  -->
* `zones`：逗号分隔的 GCE 区域列表。如果没有指定 `zone` 和 `zones`，通常卷会在 Kubernetes 集群节点所在的活动区域中轮询调度（round-robin）分配。
  `zone` 和 `zones` 参数不能同时使用。

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

<!--
* `resturl`: Gluster REST service/Heketi service url which provision gluster
  volumes on demand. The general format should be `IPaddress:Port` and this is
  a mandatory parameter for GlusterFS dynamic provisioner. If Heketi service is
  exposed as a routable service in openshift/kubernetes setup, this can have a
  format similar to `http://heketi-storage-project.cloudapps.mystorage.com`
  where the fqdn is a resolvable heketi service url.
  -->
* `resturl`：分配 gluster 卷的需求的 Gluster REST 服务/Heketi 服务 url。
  通用格式应该是 `IPaddress:Port`，这是 GlusterFS 动态分配器的必需参数。
  如果 Heketi 服务在 openshift/kubernetes 中安装并暴露为可路由服务，则可以使用类似于
  `http://heketi-storage-project.cloudapps.mystorage.com` 的格式，其中 fqdn 是可解析的 heketi 服务 url。
  <!--
* `restauthenabled` : Gluster REST service authentication boolean that enables
  authentication to the REST server. If this value is 'true', `restuser` and
  `restuserkey` or `secretNamespace` + `secretName` have to be filled. This
  option is deprecated, authentication is enabled when any of `restuser`,
  `restuserkey`, `secretName` or `secretNamespace` is specified.
  -->
* `restauthenabled`：Gluster REST 服务身份验证布尔值，用于启用对 REST 服务器的身份验证。
  如果此值为 'true'，则必须填写 `restuser` 和 `restuserkey` 或 `secretNamespace` + `secretName`。
  此选项已弃用，当在指定 `restuser`，`restuserkey`，`secretName` 或  `secretNamespace` 时，身份验证被启用。
  <!--
* `restuser` : Gluster REST service/Heketi user who has access to create volumes
  in the Gluster Trusted Pool.
  -->
* `restuser`：在 Gluster 可信池中有权创建卷的 Gluster REST服务/Heketi 用户。
  <!--
* `restuserkey` : Gluster REST service/Heketi user's password which will be used
  for authentication to the REST server. This parameter is deprecated in favor
  of `secretNamespace` + `secretName`.
  -->
* `restuserkey`：Gluster REST 服务/Heketi 用户的密码将被用于对 REST 服务器进行身份验证。此参数已弃用，取而代之的是 `secretNamespace` + `secretName`。
  <!--
* `secretNamespace`, `secretName` : Identification of Secret instance that
  contains user password to use when talking to Gluster REST service. These
  parameters are optional, empty password will be used when both
  `secretNamespace` and `secretName` are omitted. The provided secret must have
  type "kubernetes.io/glusterfs", e.g. created in this way:
  ```
  kubectl create secret generic heketi-secret \
    --type="kubernetes.io/glusterfs" --from-literal=key='opensesame' \
    --namespace=default
  ```
  Example of a secret can be found in
  [glusterfs-provisioning-secret.yaml](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/glusterfs/glusterfs-secret.yaml).
  -->
* `secretNamespace`，`secretName`：Secret 实例的标识，包含与 Gluster REST 服务交互时使用的用户密码。
  这些参数是可选的，`secretNamespace` 和 `secretName` 都省略是使用空密码。提供的密码必须有 "kubernetes.io/glusterfs" type，例如以这种方式创建：
  ```
  kubectl create secret generic heketi-secret \
    --type="kubernetes.io/glusterfs" --from-literal=key='opensesame' \
    --namespace=default
  ```
  secret 都例子可以在 [glusterfs-provisioning-secret.yaml](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/glusterfs/glusterfs-secret.yaml) 中找到。
  <!--
* `clusterid`: `630372ccdc720a92c681fb928f27b53f` is the ID of the cluster
  which will be used by Heketi when provisioning the volume. It can also be a
  list of clusterids, for example:
  `"8452344e2becec931ece4e33c4674e4e,42982310de6c63381718ccfa6d8cf397"`. This
  is an optional parameter.
  -->
* `clusterid`：`630372ccdc720a92c681fb928f27b53f` 是集群的 ID，当分配卷时，Heketi 将会使用这个文件。
  它也可以是一个 clusterid 列表，例如：
  `"8452344e2becec931ece4e33c4674e4e,42982310de6c63381718ccfa6d8cf397"`。这个是可选参数。
  <!--
* `gidMin`, `gidMax` : The minimum and maximum value of GID range for the
  storage class. A unique value (GID) in this range ( gidMin-gidMax ) will be
  used for dynamically provisioned volumes. These are optional values. If not
  specified, the volume will be provisioned with a value between 2000-2147483647
  which are defaults for gidMin and gidMax respectively.
  -->
* `gidMin`，`gidMax`：storage class GID 范围的最小值和最大值。在此范围（gidMin-gidMax）内的唯一值（GID）将用于动态分配卷。
  这些是可选的值。如果不指定，卷将被分配一个 2000-2147483647 之间的值，这是 gidMin 和 gidMax 的默认值。
  <!--
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
  -->
* `volumetype`：卷的类型及其参数可以用这个可选值进行配置。如果未声明卷类型，则由分配器决定卷的类型。
  例如：
    'Replica volume':
      `volumetype: replicate:3` 其中 '3' 是 replica 数量.
    'Disperse/EC volume':
      `volumetype: disperse:4:2` 其中 '4' 是数据，'2' 是冗余数量.
    'Distribute volume':
      `volumetype: none`

<!--
  For available volume types and administration options, refer to the
[Administration Guide](https://access.redhat.com/documentation/en-US/Red_Hat_Storage/3.1/html/Administration_Guide/part-Overview.html).
 -->
  有关可用的卷类型和管理选项，请参阅 [管理指南](https://access.redhat.com/documentation/en-US/Red_Hat_Storage/3.1/html/Administration_Guide/part-Overview.html)。

<!--
  For further reference information, see
[How to configure Heketi](https://github.com/heketi/heketi/wiki/Setting-up-the-topology).
 -->
  更多相关的参考信息，请参阅 [如何配置 Heketi](https://github.com/heketi/heketi/wiki/Setting-up-the-topology)。

<!--
  When persistent volumes are dynamically provisioned, the Gluster plugin
automatically creates an endpoint and a headless service in the name
`gluster-dynamic-<claimname>`. The dynamic endpoint and service are automatically
deleted when the persistent volume claim is deleted.
-->
  当动态分配 persistent volume 时，Gluster 插件自动创建一个端点和一个 以 `gluster-dynamic- <claimname>` 命名的 headless 服务。当 persistent volume claim 删除时，动态端点和服务是自动删除的。

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

<!--
* `type`: [VolumeType](https://docs.openstack.org/user-guide/dashboard-manage-volumes.html)
  created in Cinder. Default is empty.
* `availability`: Availability Zone. If not specified, volumes are generally
  round-robin-ed across all active zones where Kubernetes cluster has a node.
  -->
* `type`：在 Cinder 中创建的 [VolumeType](https://docs.openstack.org/user-guide/dashboard-manage-volumes.html)。默认为空。
* `availability`：可用区域。如果没有指定，通常卷会在 Kubernetes 集群节点所在的活动区域中轮询调度（round-robin）分配。

### vSphere

<!--
1. Create a StorageClass with a user specified disk format.

-->

1. 使用用户指定的磁盘格式创建一个 StorageClass。

   ```
    kind: StorageClass
    apiVersion: storage.k8s.io/v1
    metadata:
      name: fast
    provisioner: kubernetes.io/vsphere-volume
    parameters:
      diskformat: zeroedthick
   ```

<!--
    `diskformat`: `thin`, `zeroedthick` and `eagerzeroedthick`. Default: `"thin"`.
 -->
    `diskformat`: `thin`, `zeroedthick` 和 `eagerzeroedthick`。默认值: `"thin"`。

<!--
2. Create a StorageClass with a disk format on a user specified datastore.

-->

2. 在用户指定的数据存储上创建磁盘格式的 StorageClass。

```
 kind: StorageClass
 apiVersion: storage.k8s.io/v1
 metadata:
   name: fast
 provisioner: kubernetes.io/vsphere-volume
 parameters:
     diskformat: zeroedthick
     datastore: VSANDatastore
```
<!--
    `datastore`: The user can also specify the datastore in the StorageClass.
    The volume will be created on the datastore specified in the storage class,
    which in this case is `VSANDatastore`. This field is optional. If the
    datastore is not specified, then the volume will be created on the datastore
    specified in the vSphere config file used to initialize the vSphere Cloud
    Provider.
 -->
    `datastore`：用户也可以在 StorageClass 中指定数据存储。卷将在 storage class 中指定的数据存储上创建，在这种情况下是 `VSANDatastore`。
    该字段是可选的。如果未指定数据存储，则将在用于初始化 vSphere Cloud Provider 的 vSphere 配置文件中指定的数据存储上创建该卷。

<!--
3. Storage Policy Management inside kubernetes

-->

3. Kubernetes 中的 Storage Policy Management（存储策略管理）

<!--
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
 -->
    * 使用现有的 vCenter SPBM 策略

      vSphere 用于存储管理的最重要特性之一是基于策略的管理。基于存储策略的管理（SPBM）是一个存储策略框架，提供单一的统一控制平面的
      跨越广泛的数据服务和存储解决方案。 SPBM 使能 vSphere 管理员克服先期的存储配置挑战，如容量规划，差异化服务等级和管理容量空间。
    
      SPBM 策略可以在 StorageClass 中使用 `storagePolicyName` 参数声明。

<!--
    * Virtual SAN policy support inside Kubernetes
 -->
    * Kubernetes 内的 Virtual SAN 策略支持

<!--
      Vsphere Infrastructure (VI) Admins will have the ability to specify custom
      Virtual SAN Storage Capabilities during dynamic volume provisioning. You
      can now define storage requirements, such as performance and availability,
      in the form of storage capabilities during dynamic volume provisioning.
      The storage capability requirements are converted into a Virtual SAN
      policy which are then pushed down to the Virtual SAN layer when a
      persistent volume (virtual disk) is being created. The virtual disk is
      distributed across the Virtual SAN datastore to meet the requirements.
 -->
      Vsphere Infrastructure（VI）管理员将能够在动态卷配置期间指定自定义 Virtual SAN 存储功能。
      您现在可以定义存储需求，例如性能和可用性，当动态卷供分配时会以存储功能的形式提供。存储功能需求
      会转换为 Virtual SAN 策略，然后当 persistent volume（虚拟磁盘）在创建时，会将其推送
      到 Virtual SAN 层。虚拟磁盘分布在 Virtual SAN 数据存储中以满足要求。

<!--
      You can see [Storage Policy Based Management for dynamic provisioning of volumes](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/policy-based-mgmt.html)
      for more details on how to use storage policies for persistent volumes
      management.
 -->
      更多有关 persistent volume 管理的存储策略的详细信息，
      您可以参考 [Storage Policy Based Management for dynamic provisioning of volumes](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/policy-based-mgmt.html)。

<!--
There are few
[vSphere examples](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)
which you try out for persistent volume management inside Kubernetes for vSphere.
-->
有几个 [vSphere 例子](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)
供您在 Kubernetes for vSphere 中尝试进行 persistent volume 管理。

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

<!--
* `monitors`: Ceph monitors, comma delimited. This parameter is required.
  -->
* `monitors`：Ceph monitor，逗号分隔。该参数是必需的。
  <!--
* `adminId`: Ceph client ID that is capable of creating images in the pool.
  Default is "admin".
  -->
* `adminId`：Ceph 客户端 ID，用于在池（ceph pool）中创建映像。
  默认是 "admin"。
  <!--
* `adminSecretNamespace`: The namespace for `adminSecret`. Default is "default".
  -->
* `adminSecretNamespace`：`adminSecret` 的 namespace。默认是 "default"。
  <!--
* `adminSecret`: Secret Name for `adminId`. This parameter is required.
  The provided secret must have type "kubernetes.io/rbd".
  -->
* `adminSecret`：`adminId` 的 Secret 名称。该参数是必需的。
  提供的 secret 必须有值为 "kubernetes.io/rbd" 的 type 参数。
  <!--
* `pool`: Ceph RBD pool. Default is "rbd".
  -->
* `pool`: Ceph RBD 池. 默认是 "rbd"。
  <!--
* `userId`: Ceph client ID that is used to map the RBD image. Default is the
  same as `adminId`.
  -->
* `userId`：Ceph 客户端 ID，用于映射 RBD 镜像（RBD image）。默认与 `adminId` 相同。
  <!--
* `userSecretName`: The name of Ceph Secret for `userId` to map RBD image. It
  must exist in the same namespace as PVCs. This parameter is required.
  The provided secret must have type "kubernetes.io/rbd", e.g. created in this
  way:
  ```
  kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" \
    --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' \
    --namespace=kube-system
  ```
  -->
* `userSecretName`：用于映射 RBD 镜像的 `userId` 的 Ceph Secret 的名字。
  它必须与 PVC 存在于相同的 namespace 中。该参数是必需的。
  提供的 secret 必须具有值为 "kubernetes.io/rbd" 的 type 参数，例如以这样的方式创建：
  ```
  kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" \
    --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' \
    --namespace=kube-system
  ```
  <!--
* `fsType`: fsType that is supported by kubernetes. Default: `"ext4"`.
  -->
* `fsType`：Kubernetes 支持的 fsType。默认：`"ext4"`。
  <!--
* `imageFormat`: Ceph RBD image format, "1" or "2". Default is "1".
  -->
* `imageFormat`：Ceph RBD 镜像格式，"1" 或者 "2"。默认值是 "1"。
  <!--
* `imageFeatures`: This parameter is optional and should only be used if you
  set `imageFormat` to "2". Currently supported features are `layering` only.
  Default is "", and no features are turned on.
  -->
* `imageFeatures`：这个参数是可选的，只能在你将 `imageFormat` 设置为 "2" 才使用。
  目前支持的功能只是 `layering`。  默认是 ""，没有功能打开。

#### Quobyte

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

<!--
* `quobyteAPIServer`: API Server of Quobyte in the format
  `"http(s)://api-server:7860"`
  -->
* `quobyteAPIServer`：Quobyte API 服务器的格式是
  `"http(s)://api-server:7860"`
  <!--
* `registry`: Quobyte registry to use to mount the volume. You can specify the
  registry as ``<host>:<port>`` pair or if you want to specify multiple
  registries you just have to put a comma between them e.q.
  ``<host1>:<port>,<host2>:<port>,<host3>:<port>``.
  The host can be an IP address or if you have a working DNS you can also
  provide the DNS names.
  -->
* `registry`：用于挂载卷的 Quobyte registry。你可以指定 registry 为 ``<host>:<port>``
  或者如果你想指定多个 registry，你只需要在他们之间添加逗号，例如
  ``<host1>:<port>,<host2>:<port>,<host3>:<port>``。
  主机可以是一个 IP 地址，或者如果您有正在运行的DNS，您也可以提供 DNS 名称。
  <!--
* `adminSecretNamespace`: The namespace for `adminSecretName`.
  Default is "default".
  -->
* `adminSecretNamespace`：`adminSecretName`的 namespace。
  默认值是 "default"。
  <!--
* `adminSecretName`: secret that holds information about the Quobyte user and
  the password to authenticate against the API server. The provided secret
  must have type "kubernetes.io/quobyte", e.g. created in this way:
  ```
  kubectl create secret generic quobyte-admin-secret \
    --type="kubernetes.io/quobyte" --from-literal=key='opensesame' \
    --namespace=kube-system
  ```
  -->
* `adminSecretName`：保存关于 Quobyte 用户和密码的 secret，用于对 API 服务器进行身份验证。
  提供的 secret 必须有值为 "kubernetes.io/quobyte" 的 type 参数，例如以这种方式创建：
  ```
  kubectl create secret generic quobyte-admin-secret \
    --type="kubernetes.io/quobyte" --from-literal=key='opensesame' \
    --namespace=kube-system
  ```
  <!--
* `user`: maps all access to this user. Default is "root".
  -->
* `user`：对这个用户映射的所有访问权限。默认是 "root"。
  <!--
* `group`: maps all access to this group. Default is "nfsnobody".
  -->
* `group`：对这个组映射的所有访问权限。默认是 "nfsnobody"。
  <!--
* `quobyteConfig`: use the specified configuration to create the volume. You
  can create a new configuration or modify an existing one with the Web
  console or the quobyte CLI. Default is "BASE".
  -->
* `quobyteConfig`：使用指定的配置来创建卷。您可以创建一个新的配置，或者，可以修改 Web console 或
  quobyte CLI 中现有的配置。默认是 "BASE"。
  <!--
* `quobyteTenant`: use the specified tenant ID to create/delete the volume.
  This Quobyte tenant has to be already present in Quobyte.
  Default is "DEFAULT".
  -->
* `quobyteTenant`：使用指定的租户 ID 创建/删除卷。这个 Quobyte 租户必须已经于 Quobyte。
  默认是 "DEFAULT"。

<!--
### Azure Disk
 -->
### Azure 磁盘

<!--
#### Azure Unmanaged Disk Storage Class
-->
#### Azure Unmanaged Disk Storage Class（非托管磁盘存储类）

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

<!--
* `skuName`: Azure storage account Sku tier. Default is empty.
* `location`: Azure storage account location. Default is empty.
* `storageAccount`: Azure storage account name. If a storage account is provided,
  it must reside in the same resource group as the cluster, and `location` is
  ignored. If a storage account is not provided, a new storage account will be
  created in the same resource group as the cluster.
   -->
* `skuName`：Azure 存储帐户 Sku 层。默认为空。
* `location`：Azure 存储帐户位置。默认为空。
* `storageAccount`：Azure 存储帐户名称。如果提供存储帐户，它必须位于与集群相同的资源组中，并且 `location` 是被忽略的。
  如果未提供存储帐户，则会在与群集相同的资源组中创建新的存储帐户。

<!--
#### New Azure Disk Storage Class (starting from v1.7.2)
-->
#### 新的 Azure 磁盘 Storage Class（从 v1.7.2 开始）

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

<!--
* `storageaccounttype`: Azure storage account Sku tier. Default is empty.
  -->
* `storageaccounttype`：Azure 存储帐户 Sku 层。默认为空。
  <!--
* `kind`: Possible values are `shared` (default), `dedicated`, and `managed`.
  When `kind` is `shared`, all unmanaged disks are created in a few shared
  storage accounts in the same resource group as the cluster. When `kind` is
  `dedicated`, a new dedicated storage account will be created for the new
  unmanaged disk in the same resource group as the cluster.
  -->
* `kind`：可能的值是 `shared`（默认），`dedicated` 和 `managed`。
  当 `kind` 的值是 `shared` 时，所有非托管磁盘都在集群的同一个资源组中的几个共享存储帐户中创建。
  当 `kind` 的值是 `dedicated` 时，将为在集群的同一个资源组中新的非托管磁盘创建新的专用存储帐户。

<!--
- Premium VM can attach both Standard_LRS and Premium_LRS disks, while Standard
  VM can only attach Standard_LRS disks.
- Managed VM can only attach managed disks and unmanaged VM can only attach
  unmanaged disks.
  -->
- Premium VM 可以同时添加 Standard_LRS 和 Premium_LRS 磁盘，而 Standard 虚拟机只能添加 Standard_LRS 磁盘。
- 托管虚拟机只能连接托管磁盘，非托管虚拟机只能连接非托管磁盘。

<!--
### Azure File
-->
### Azure 文件

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

<!--
* `skuName`: Azure storage account Sku tier. Default is empty.
  -->
* `skuName`：Azure 存储帐户 Sku 层。默认为空。
  <!--
* `location`: Azure storage account location. Default is empty.
  -->
* `location`：Azure 存储帐户位置。默认为空。
  <!--
* `storageAccount`: Azure storage account name.  Default is empty. If a storage
  account is not provided, all storage accounts associated with the resource
  group are searched to find one that matches `skuName` and `location`. If a
  storage account is provided, it must reside in the same resource group as the
  cluster, and `skuName` and `location` are ignored.
  -->
* `storageAccount`：Azure 存储帐户名称。默认为空。
  如果不提供存储帐户，会搜索所有与资源相关的存储帐户，以找到一个匹配 `skuName` 和 `location` 的账号。
  如果提供存储帐户，它必须存在于与集群相同的资源组中，`skuName` 和 `location` 会被忽略。

During provision, a secret is created for mounting credentials. If the cluster
has enabled both [RBAC](/docs/admin/authorization/rbac/) and
[Controller Roles](/docs/admin/authorization/rbac/#controller-roles), add the
`create` permission of resource `secret` for clusterrole
`system:controller:persistent-volume-binder`.
在分配期间，为挂载凭证创建一个 secret。如果集群同时启用了 [RBAC](/docs/admin/authorization/rbac/) 和 [Controller Roles](/docs/admin/authorization/rbac/#controller-roles)，
为 `system:controller:persistent-volume-binder` 的 clusterrole 添加 `secret` 资源的 `create` 权限。

<!--
### Portworx Volume
 -->
### Portworx 卷

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

<!--
* `fs`: filesystem to be laid out: [none/xfs/ext4] (default: `ext4`).
  -->
* `fs`：选择的文件系统：[none/xfs/ext4]（默认：`ext4`）。
  <!--
* `block_size`: block size in Kbytes (default: `32`).
  -->
* `block_size`：以 Kbytes 为单位的块大小（默认值：`32`）。
  <!--
* `repl`: number of synchronous replicas to be provided in the form of
  replication factor [1..3] (default: `1`) A string is expected here i.e.
  `"1"` and not `1`.
  -->
* `repl`：同步副本数量，以复制因子 [1..3]（默认值：`1`）的形式提供。
  这里需要填写字符串，即，`"1"` 而不是 `1`。
  <!--
* `io_priority`: determines whether the volume will be created from higher
  performance or a lower priority storage [high/medium/low] (default: `low`).
  -->
* `io_priority`：决定是否从更高性能或者较低优先级存储创建卷 [high/medium/low]（默认值：`low`）。
  <!--
* `snap_interval`: clock/time interval in minutes for when to trigger snapshots.
  Snapshots are incremental based on difference with the prior snapshot, 0
  disables snaps (default: `0`). A string is expected here i.e.
  `"70"` and not `70`.
  -->
* `snap_interval`：触发快照的时钟/时间间隔（分钟）。快照是基于与先前快照的增量变化，0 是禁用快照（默认：`0`）。
  这里需要填写字符串，即，是 `"70"` 而不是 `70`。
  <!--
* `aggregation_level`: specifies the number of chunks the volume would be
  distributed into, 0 indicates a non-aggregated volume (default: `0`). A string
  is expected here i.e. `"0"` and not `0`
  -->
* `aggregation_level`：指定卷分配到的块数量，0 表示一个非聚合卷（默认：`0`）。
  这里需要填写字符串，即，是 `"0"` 而不是 `0`。
  <!--
* `ephemeral`: specifies whether the volume should be cleaned-up after unmount
  or should be persistent. `emptyDir` use case can set this value to true and
  `persistent volumes` use case such as for databases like Cassandra should set
  to false, [true/false] (default `false`). A string is expected here i.e.
  `"true"` and not `true`.
  -->
* `ephemeral`：指定卷在卸载后进行清理还是持久化。 `emptyDir` 的使用场景可以将这个值设置为 true ，
  `persistent volumes` 的使用场景可以将这个值设置为 false（例如 Cassandra 这样的数据库）[true/false]（默认为 `false`）。
  这里需要填写字符串，即，是 `"true"` 而不是 `true`。

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

<!--
* `provisioner`: attribute is set to `kubernetes.io/scaleio`
   -->
* `provisioner`：属性设置为 `kubernetes.io/scaleio`
  <!--
* `gateway`: address to a ScaleIO API gateway (required)
   -->
* `gateway` 到 ScaleIO API 网关的地址（必需）
  <!--
* `system`: the name of the ScaleIO system (required)
   -->
* `system`：ScaleIO 系统的名称（必需）
  <!--
* `protectionDomain`: the name of the ScaleIO protection domain (required)
   -->
* `protectionDomain`：ScaleIO 保护域的名称（必需）
  <!--
* `storagePool`: the name of the volume storage pool (required)
   -->
* `storagePool`：卷存储池的名称（必需）
  <!--
* `storageMode`: the storage provision mode: `ThinProvisioned` (default) or
  `ThickProvisioned`
   -->
* `storageMode`：存储提供模式：`ThinProvisioned`（默认）或 `ThickProvisioned`
  <!--
* `secretRef`: reference to a configured Secret object (required)
   -->
* `secretRef`：对已配置的 Secret 对象的引用（必需）
  <!--
* `readOnly`: specifies the access mode to the mounted volume (default false)
   -->
* `readOnly`：指定挂载卷的访问模式（默认为 false）
  <!--
* `fsType`: the file system to use for the volume (default ext4)
   -->
* `fsType`：卷的文件系统（默认是 ext4）

<!--
The ScaleIO Kubernetes volume plugin requires a configured Secret object.
The secret must be created with type `kubernetes.io/scaleio` and use the same
namespace value as that of the PVC where it is referenced
as shown in the following command:
 -->
ScaleIO Kubernetes 卷插件需要配置一个 Secret 对象。
secret 必须用 `kubernetes.io/scaleio` 类型创建，并与引用它的 PVC 所属的名称空间使用相同的值
如下面的命令所示：

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

<!--
* `pool`: The name of the StorageOS distributed capacity pool to provision the
  volume from.  Uses the `default` pool which is normally present if not specified.
   -->
* `pool`：分配卷的 StorageOS 分布式容量池的名称。如果未指定，则使用通常存在的 `default` 池。
  <!--
* `description`: The description to assign to volumes that were created dynamically.
  All volume descriptions will be the same for the storage class, but different
  storage classes can be used to allow descriptions for different use cases.
  Defaults to `Kubernetes volume`.
   -->
* `description`：分配给动态创建的卷的描述。所有卷描述对于 storage class 都是相同的，
  但不同的 storage class 可以使用不同的描述，以区分不同的使用场景。
  默认为 `Kubernetas volume`。
  <!--
* `fsType`: The default filesystem type to request. Note that user-defined rules
  within StorageOS may override this value.  Defaults to `ext4`.
   -->
* `fsType`：请求的默认文件系统类型。请注意，在 StorageOS 中用户定义的规则可以覆盖此值。默认为 `ext4`
  <!--
* `adminSecretNamespace`: The namespace where the API configuration secret is
  located. Required if adminSecretName set.
   -->
* `adminSecretNamespace`：API 配置 secret 所在的命名空间。如果设置了 adminSecretName，则是必需的。
  <!--
* `adminSecretName`: The name of the secret to use for obtaining the StorageOS
  API credentials. If not specified, default values will be attempted.
   -->
* `adminSecretName`：用于获取 StorageOS API 凭证的 secret 名称。如果未指定，则将尝试默认值。

<!--
The StorageOS Kubernetes volume plugin can use a Secret object to specify an
endpoint and credentials to access the StorageOS API. This is only required when
the defaults have been changed.
The secret must be created with type `kubernetes.io/storageos` as shown in the
following command:
 -->
StorageOS Kubernetes 卷插件可以使 Secret 对象来指定用于访问 StorageOS API 的端点和凭据。
只有当默认值已被更改时，这才是必须的。
secret 必须使用 `kubernetes.io/storageos` 类型创建，如以下命令：

```shell
kubectl create secret generic storageos-secret \
--type="kubernetes.io/storageos" \
--from-literal=apiAddress=tcp://localhost:5705 \
--from-literal=apiUsername=storageos \
--from-literal=apiPassword=storageos \
--namespace=default
```

<!-- 
Secrets used for dynamically provisioned volumes may be created in any namespace
and referenced with the `adminSecretNamespace` parameter. Secrets used by
pre-provisioned volumes must be created in the same namespace as the PVC that
references it.
 -->
用于动态分配卷的 Secret 可以在任何名称空间中创建，并通过 `adminSecretNamespace` 参数引用。
预先配置的卷使用的 Secret 必须在与引用它的 PVC 在相同的名称空间中。
