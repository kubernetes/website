---
approvers:
- jsafrane
- mikedanese
- saad-ali
- thockin
title: 持久化卷
---

<!--

This document describes the current state of `PersistentVolumes` in Kubernetes. Familiarity with [volumes](/docs/concepts/storage/volumes/) is suggested.

-->

本文档介绍了 Kubernetes 中 `PersistentVolume` 的当前状态。建议您在阅读本文档前先熟悉 [volume](/docs/concepts/storage/volumes/)。

* TOC
{:toc}
<!--

## Introduction

Managing storage is a distinct problem from managing compute. The `PersistentVolume` subsystem provides an API for users and administrators that abstracts details of how storage is provided from how it is consumed. To do this we introduce two new API resources:  `PersistentVolume` and `PersistentVolumeClaim`.

-->

## 介绍

对于管理计算资源来说，管理存储资源明显是另一个问题。`PersistentVolume` 子系统为用户和管理员提供了一个 API，该 API 将如何提供存储的细节抽象了出来。为此，我们引入两个新的 API 资源：`PersistentVolume` 和 `PersistentVolumeClaim`。

<!--

A `PersistentVolume` (PV) is a piece of storage in the cluster that has been provisioned by an administrator. It is a resource in the cluster just like a node is a cluster resource. PVs are volume plugins like Volumes, but have a lifecycle independent of any individual pod that uses the PV. This API object captures the details of the implementation of the storage, be that NFS, iSCSI, or a cloud-provider-specific storage system.

-->

`PersistentVolume`（PV）是由管理员设置的存储，它是群集的一部分。就像节点是集群中的资源一样，PV 也是集群中的资源。 PV 是 Volume 之类的卷插件，但具有独立于使用 PV 的 Pod 的生命周期。此 API 对象包含存储实现的细节，即 NFS、iSCSI 或特定于云供应商的存储系统。

<!--

A `PersistentVolumeClaim` (PVC) is a request for storage by a user. It is similar to a pod. Pods consume node resources and PVCs consume PV resources. Pods can request specific levels of resources (CPU and Memory).  Claims can request specific size and access modes (e.g., can be mounted once read/write or many times read-only).

-->

`PersistentVolumeClaim`（PVC）是用户存储的请求。它与 Pod 相似。Pod 消耗节点资源，PVC 消耗 PV 资源。Pod 可以请求特定级别的资源（CPU 和内存）。声明可以请求特定的大小和访问模式（例如，可以以读/写一次或 只读多次模式挂载）。

<!--

While `PersistentVolumeClaims` allow a user to consume abstract storage
resources, it is common that users need `PersistentVolumes` with varying
properties, such as performance, for different problems. Cluster administrators
need to be able to offer a variety of `PersistentVolumes` that differ in more
ways than just size and access modes, without exposing users to the details of
how those volumes are implemented. For these needs there is the `StorageClass`
resource.

Please see the [detailed walkthrough with working examples](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).

-->

虽然 `PersistentVolumeClaims` 允许用户使用抽象存储资源，但用户需要具有不同性质（例如性能）的 `PersistentVolume` 来解决不同的问题。集群管理员需要能够提供各种各样的 `PersistentVolume`，这些`PersistentVolume` 的大小和访问模式可以各有不同，但不需要向用户公开实现这些卷的细节。对于这些需求，`StorageClass` 资源可以实现。

请参阅[工作示例的详细过程](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)。

<!--


## Lifecycle of a volume and claim

PVs are resources in the cluster. PVCs are requests for those resources and also act as claim checks to the resource. The interaction between PVs and PVCs follows this lifecycle:

### Provisioning

There are two ways PVs may be provisioned: statically or dynamically.

#### Static
A cluster administrator creates a number of PVs. They carry the details of the real storage which is available for use by cluster users. They exist in the Kubernetes API and are available for consumption.

-->

## 卷和声明的生命周期

PV 属于集群中的资源。PVC 是对这些资源的请求，也作为对资源的请求的检查。 PV 和 PVC 之间的相互作用遵循这样的生命周期：

### 配置（Provision）

有两种方式来配置 PV：静态或动态。

#### 静态

集群管理员创建一些 PV。它们带有可供群集用户使用的实际存储的细节。它们存在于 Kubernetes API 中，可用于消费。

<!--

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

-->

#### 动态

当管理员创建的静态 PV 都不匹配用户的 `PersistentVolumeClaim` 时，集群可能会尝试动态地为 PVC 创建卷。此配置基于 `StorageClasses`：PVC 必须请求[存储类](/docs/concepts/storage/storage-classes/)，并且管理员必须创建并配置该类才能进行动态创建。声明该类为 `""` 可以有效地禁用其动态配置。

要启用基于存储级别的动态存储配置，集群管理员需要启用 API server 上的 `DefaultStorageClass` [准入控制器](/docs/admin/admission-controllers/#defaultstorageclass)。例如，通过确保 `DefaultStorageClass` 位于 API server 组件的 `--admission-control` 标志，使用逗号分隔的有序值列表中，可以完成此操作。有关 API  server 命令行标志的更多信息，请检查 [kube-apiserver](/docs/admin/kube-apiserver/) 文档。

<!--

### Binding

A user creates, or has already created in the case of dynamic provisioning, a `PersistentVolumeClaim` with a specific amount of storage requested and with certain access modes. A control loop in the master watches for new PVCs, finds a matching PV (if possible), and binds them together. If a PV was dynamically provisioned for a new PVC, the loop will always bind that PV to the PVC. Otherwise, the user will always get at least what they asked for, but the volume may be in excess of what was requested. Once bound, `PersistentVolumeClaim` binds are exclusive, regardless of how they were bound. A PVC to PV binding is a one-to-one mapping.

Claims will remain unbound indefinitely if a matching volume does not exist. Claims will be bound as matching volumes become available. For example, a cluster provisioned with many 50Gi PVs would not match a PVC requesting 100Gi. The PVC can be bound when a 100Gi PV is added to the cluster.

-->

### 绑定

再动态配置的情况下，用户创建或已经创建了具有特定存储量的 `PersistentVolumeClaim` 以及某些访问模式。master 中的控制环路监视新的 PVC，寻找匹配的 PV（如果可能），并将它们绑定在一起。如果为新的 PVC 动态调配 PV，则该环路将始终将该 PV 绑定到 PVC。否则，用户总会得到他们所请求的存储，但是容量可能超出要求的数量。一旦 PV 和 PVC 绑定后，`PersistentVolumeClaim` 绑定是排他性的，不管它们是如何绑定的。 PVC 跟 PV 绑定是一对一的映射。

如果没有匹配的卷，声明将无限期地保持未绑定状态。随着匹配卷的可用，声明将被绑定。例如，配置了许多 50Gi PV的集群将不会匹配请求 100Gi 的PVC。将100Gi PV 添加到群集时，可以绑定 PVC。

<!--

### Using

Pods use claims as volumes. The cluster inspects the claim to find the bound volume and mounts that volume for a pod. For volumes which support multiple access modes, the user specifies which mode desired when using their claim as a volume in a pod.

Once a user has a claim and that claim is bound, the bound PV belongs to the user for as long as they need it. Users schedule Pods and access their claimed PVs by including a persistentVolumeClaim in their Pod's volumes block. [See below for syntax details](#claims-as-volumes).

-->

### 使用

Pod 使用声明作为卷。集群检查声明以查找绑定的卷并为集群挂载该卷。对于支持多种访问模式的卷，用户指定在使用声明作为容器中的卷时所需的模式。

用户进行了声明，并且该声明是绑定的，则只要用户需要，绑定的 PV 就属于该用户。用户通过在 Pod 的 volume 配置中包含 `persistentVolumeClaim` 来调度 Pod 并访问用户声明的 PV。[请参阅下面的语法细节](#claims-as-volumes)。

<!--

### Persistent Volume Claim Protection

{% assign for_k8s_version="v1.9" %}{% include feature-state-alpha.md %}
The purpose of the PVC protection is to ensure that PVCs in active use by a pod are not removed from the system as this may result in data loss.

Note: PVC is in active use by a pod when the the pod status is `Pending` and the pod is assigned to a node or the pod status is `Running`.

When the [PVC protection alpha feature](/docs/tasks/administer-cluster/pvc-protection/) is enabled, if a user deletes a PVC in active use by a pod, the PVC is not removed immediately. PVC removal is postponed until the PVC is no longer actively used by any pods.

You can see that a PVC is protected when the PVC's status is `Terminating` and the `Finalizers` list includes `kubernetes.io/pvc-protection`:

-->

### 持久化卷声明的保护

{% assign for_k8s_version="v1.9" %}{% include feature-state-alpha.md %}

PVC 保护的目的是确保由 pod 正在使用的 PVC 不会从系统中移除，因为如果被移除的话可能会导致数据丢失。

注意：当 pod 状态为 `Pending` 并且 pod 已经分配给节点或 pod 为 `Running` 状态时，PVC 处于活动状态。

当启用[PVC 保护 alpha 功能](/docs/tasks/administer-cluster/pvc-protection/)时，如果用户删除了一个 pod 正在使用的 PVC，则该 PVC 不会被立即删除。PVC 的删除将被推迟，直到 PVC 不再被任何 pod 使用。

您可以看到，当 PVC 的状态为 `Teminatiing` 时，PVC 受到保护，`Finalizers` 列表中包含 `kubernetes.io/pvc-protection`：

```shell
kubectl described pvc hostpath
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

<!--

### Reclaiming

When a user is done with their volume, they can delete the PVC objects from the API which allows reclamation of the resource. The reclaim policy for a `PersistentVolume` tells the cluster what to do with the volume after it has been released of its claim. Currently, volumes can either be Retained, Recycled or Deleted.

-->

### 回收

用户用完 volume 后，可以从允许回收资源的 API 中删除 PVC 对象。`PersistentVolume` 的回收策略告诉集群在存储卷声明释放后应如何处理该卷。目前，volume 的处理策略有保留、回收或删除。

<!--

#### Retaining

The Retain reclaim policy allows for manual reclamation of the resource. When the `PersistentVolumeClaim` is deleted, the `PersistentVolume` still exists and the volume is considered "released". But it is not yet available for another claim because the previous claimant's data remains on the volume. An administrator can manually reclaim the volume with the following steps.

1. Delete the `PersistentVolume`. The associated storage asset in external infrastructure (such as an AWS EBS, GCE PD, Azure Disk, or Cinder volume) still exists after the PV is deleted.
2. Manually clean up the data on the associated storage asset accordingly.
3. Manually delete the associated storage asset, or if you want to reuse the same storage asset, create a new `PersistentVolume` with the storage asset definition.

-->

#### 保留

保留回收策略允许手动回收资源。当 `PersistentVolumeClaim` 被删除时，`PersistentVolume` 仍然存在，volume 被视为“已释放”。但是由于前一个声明人的数据仍然存在，所以还不能马上进行其他声明。管理员可以通过以下步骤手动回收卷。

1. 删除 `PersistentVolume`。在删除 PV 后，外部基础架构中的关联存储资产（如 AWS EBS、GCE PD、Azure Disk 或 Cinder 卷）仍然存在。
2. 手动清理相关存储资产上的数据。
3. 手动删除关联的存储资产，或者如果要重新使用相同的存储资产，请使用存储资产定义创建新的 `PersistentVolume`。

<!--

#### Recycling

If supported by appropriate volume plugin, recycling performs a basic scrub (`rm -rf /thevolume/*`) on the volume and makes it available again for a new claim.

However, an administrator can configure a custom recycler pod template using the Kubernetes controller manager command line arguments as described [here](/docs/admin/kube-controller-manager/). The custom recycler pod template must contain a `volumes` specification, as shown in the example below:

-->

#### 回收

如果存储卷插件支持，回收策略会在 volume上执行基本擦除（`rm -rf / thevolume / *`），可被再次声明使用。

但是，管理员可以使用如[此处](/docs/admin/kube-controller-manager/)所述的 Kubernetes controller manager 命令行参数来配置自定义回收站 pod 模板。自定义回收站 pod 模板必须包含 `volumes` 规范，如下面的示例所示：

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

<!--

However, the particular path specified in the custom recycler pod template in the `volumes` part is replaced with the particular path of the volume that is being recycled.

-->

但是，`volumes` 部分的自定义回收站模块中指定的特定路径将被替换为正在回收的卷的特定路径。

<!--

#### Deleting

For volume plugins that support the Delete reclaim policy, deletion removes both the `PersistentVolume` object from Kubernetes, as well as deleting the associated storage asset in the external infrastructure, such as an AWS EBS, GCE PD, Azure Disk, or Cinder volume. Volumes that were dynamically provisioned inherit the [reclaim policy of their `StorageClass`](#reclaim-policy), which defaults to Delete. The administrator should configure the `StorageClass` according to users' expectations, otherwise the PV must be edited or patched after it is created. See [Change the Reclaim Policy of a PersistentVolume](https://kubernetes.io/docs/tasks/administer-cluster/change-pv-reclaim-policy/).

-->

#### 删除

对于支持删除回收策略的卷插件，删除操作将从 Kubernetes 中删除 `PersistentVolume` 对象，并删除外部基础架构（如 AWS EBS、GCE PD、Azure Disk 或 Cinder 卷）中的关联存储资产。动态配置的卷继承其 [`StorageClass` 的回收策略](#reclaim-policy)，默认为 Delete。管理员应该根据用户的期望来配置 `StorageClass`，否则就必须要在 PV 创建后进行编辑或修补。请参阅[更改 PersistentVolume 的回收策略](https://kubernetes.io/docs/tasks/administer-cluster/change-pv-reclaim-policy/)。

<!--


### Expanding Persistent Volumes Claims

Kubernetes 1.8 added Alpha support for expanding persistent volumes. In v1.9, the following volume types support expanding Persistent volume claims:

* gcePersistentDisk
* awsElasticBlockStore
* Cinder
* glusterfs
* rbd

Administrator can allow expanding persistent volume claims by setting `ExpandPersistentVolumes` feature gate to true. Administrator
should also enable [`PersistentVolumeClaimResize` admission plugin](/docs/admin/admission-controllers/#persistentvolumeclaimresize)
to perform additional validations of volumes that can be resized.

Once `PersistentVolumeClaimResize` admission plug-in has been turned on, resizing will only be allowed for storage classes
whose `allowVolumeExpansion` field is set to true.

-->

### 扩展持久化卷声明

Kubernetes 1.8 增加了对扩展持久化存储卷的 Alpha 支持。在 v1.9 中，以下持久化卷支持扩展持久化卷声明：

- gcePersistentDisk
- awsElasticBlockStore
- Cinder
- glusterfs
- rbd

管理员可以通过将 `ExpandPersistentVolumes` 特性门设置为true来允许扩展持久卷声明。管理员还应该启用[`PersistentVolumeClaimResize` 准入控制插件](/docs/admin/admission-controllers/#persistentvolumeclaimresize)来执行对可调整大小的卷的其他验证。

一旦 `PersistentVolumeClaimResize` 准入插件已打开，将只允许其 `allowVolumeExpansion` 字段设置为 true 的存储类进行大小调整。

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

<!--

Once both feature gate and aforementioned admission plug-in are turned on, an user can request larger volume for their `PersistentVolumeClaim`
by simply editing the claim and requesting bigger size.  This in turn will trigger expansion of volume that is backing underlying `PersistentVolume`.

Under no circumstances a new `PersistentVolume` gets created to satisfy the claim. Kubernetes will attempt to resize existing volume to satisfy the claim.

For expanding volumes containing a file system, file system resizing is only performed when a new Pod is started using the `PersistentVolumeClaim` in
ReadWrite mode. In other words, if a volume being expanded is used in a pod or deployment, you will need to delete and recreate the pod for file system
resizing to take place. Also, file system resizing is only supported for following file system types:

* XFS
* Ext3, Ext4

**Note:** Expanding EBS volumes is a time consuming operation. Also, there is a per-volume quota of one modification every 6 hours.
{: .note}

-->

一旦功能门和前述准入插件打开后，用户就可以通过简单地编辑声明以请求更大的 `PersistentVolumeClaim` 卷。这反过来将触发 `PersistentVolume` 后端的卷扩展。

在任何情况下都不会创建新的 `PersistentVolume` 来满足声明。 Kubernetes 将尝试调整现有 volume 来满足声明的要求。

对于扩展包含文件系统的卷，只有在 ReadWrite 模式下使用 `PersistentVolumeClaim` 启动新的 Pod 时，才会执行文件系统调整大小。换句话说，如果正在扩展的卷在 pod 或部署中使用，则需要删除并重新创建要进行文件系统调整大小的pod。此外，文件系统调整大小仅适用于以下文件系统类型：

- XFS
- Ext3、Ext4

**注意**：扩展 EBS 卷是一个耗时的操作。另外，每6个小时有一个修改卷的配额。

{: .note}

<!--


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

** Raw Block Support exists for these plugins only.

-->

## 持久化卷类型

`PersistentVolume` 类型以插件形式实现。Kubernetes 目前支持以下插件类型：

- GCEPersistentDisk
- AWSElasticBlockStore
- AzureFile
- AzureDisk
- FC (Fibre Channel)
- FlexVolume
- Flocker
- NFS
- iSCSI
- RBD (Ceph Block Device)
- CephFS
- Cinder (OpenStack block storage)
- Glusterfs
- VsphereVolume
- Quobyte Volumes
- HostPath （仅限于但节点测试—— 不会以任何方式支持本地存储，也无法在多节点集群中工作）
- VMware Photon
- Portworx Volumes
- ScaleIO Volumes
- StorageOS

原始块支持仅适用于以上这些插件。

<!--

## Persistent Volumes

Each PV contains a spec and status, which is the specification and status of the volume.

-->

## 持久化卷

每个 PV 配置中都包含一个 sepc 规格字段和一个 status 卷状态字段。

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

<!--

### Capacity

Generally, a PV will have a specific storage capacity.  This is set using the PV's `capacity` attribute.  See the Kubernetes [Resource Model](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) to understand the units expected by `capacity`.

Currently, storage size is the only resource that can be set or requested.  Future attributes may include IOPS, throughput, etc.

-->

### 容量

通常，PV 将具有特定的存储容量。这是使用 PV 的容量属性设置的。查看 Kubernetes [资源模型](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) 以了解 `capacity` 预期。

目前，存储大小是可以设置或请求的唯一资源。未来的属性可能包括 IOPS、吞吐量等。

<!--

### Volume Mode

Prior to v1.9, the default behavior for all volume plugins was to create a filesystem on the persistent volume. With v1.9, the user can specify a volumeMode which will now support raw block devices in addition to file systems. Valid values for volumeMode are "Filesystem" or "Block". If left unspecified, volumeMode defaults to "Filesystem" internally. This is an optional API parameter. 

**Note:** This feature is alpha in v1.9 and may change in the future. 
{: .note}

-->

### 卷模式

在 v1.9 之前，所有卷插件的默认行为是在持久卷上创建一个文件系统。在 v1.9 中，用户可以指定一个 volumeMode，除了文件系统之外，它现在将支持原始块设备。 volumeMode 的有效值可以是“Filesystem”或“Block”。如果未指定，volumeMode 将默认为“Filesystem”。这是一个可选的 API 参数。

**注意**：该功能在 V1.9 中是 alpha的，未来可能会更改。

{: .note}

<!--

### Access Modes

A `PersistentVolume` can be mounted on a host in any way supported by the resource provider.  As shown in the table below, providers will have different capabilities and each PV's access modes are set to the specific modes supported by that particular volume.  For example, NFS can support multiple read/write clients, but a specific NFS PV might be exported on the server as read-only.  Each PV gets its own set of access modes describing that specific PV's capabilities.

-->

### 访问模式

`PersistentVolume` 可以以资源提供者支持的任何方式挂载到主机上。如下表所示，供应商具有不同的功能，每个 PV 的访问模式都将被设置为该卷支持的特定模式。例如，NFS 可以支持多个读/写客户端，但特定的 NFS PV 可能以只读方式导出到服务器上。每个 PV 都有一套自己的用来描述特定功能的访问模式。

<!--

The access modes are:

* ReadWriteOnce -- the volume can be mounted as read-write by a single node
* ReadOnlyMany -- the volume can be mounted read-only by many nodes
* ReadWriteMany -- the volume can be mounted as read-write by many nodes

In the CLI, the access modes are abbreviated to:

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany

> __Important!__ A volume can only be mounted using one access mode at a time, even if it supports many.  For example, a GCEPersistentDisk can be mounted as ReadWriteOnce by a single node or ReadOnlyMany by many nodes, but not at the same time.

-->

存储模式包括：

- ReadWriteOnce——该卷可以被单个节点以读/写模式挂载
- ReadOnlyMany——该卷可以被多个节点以只读模式挂载
- ReadWriteMany——该卷可以被多个节点以读/写模式挂载

在命令行中，访问模式缩写为：

- RWO - ReadWriteOnce
- ROX - ReadOnlyMany
- RWX - ReadWriteMany

> **重要**！一个卷一次只能使用一种访问模式挂载，即使它支持很多访问模式。例如，GCEPersistentDisk 可以由单个节点作为 ReadWriteOnce 模式挂载，或由多个节点以 ReadOnlyMany 模式挂载，但不能同时挂载。

<!--


| Volume Plugin        | ReadWriteOnce | ReadOnlyMany |           ReadWriteMany            |
| :------------------- | :-----------: | :----------: | :--------------------------------: |
| AWSElasticBlockStore |   &#x2713;    |      -       |                 -                  |
| AzureFile            |   &#x2713;    |   &#x2713;   |              &#x2713;              |
| AzureDisk            |   &#x2713;    |      -       |                 -                  |
| CephFS               |   &#x2713;    |   &#x2713;   |              &#x2713;              |
| Cinder               |   &#x2713;    |      -       |                 -                  |
| FC                   |   &#x2713;    |   &#x2713;   |                 -                  |
| FlexVolume           |   &#x2713;    |   &#x2713;   |                 -                  |
| Flocker              |   &#x2713;    |      -       |                 -                  |
| GCEPersistentDisk    |   &#x2713;    |   &#x2713;   |                 -                  |
| Glusterfs            |   &#x2713;    |   &#x2713;   |              &#x2713;              |
| HostPath             |   &#x2713;    |      -       |                 -                  |
| iSCSI                |   &#x2713;    |   &#x2713;   |                 -                  |
| PhotonPersistentDisk |   &#x2713;    |      -       |                 -                  |
| Quobyte              |   &#x2713;    |   &#x2713;   |              &#x2713;              |
| NFS                  |   &#x2713;    |   &#x2713;   |              &#x2713;              |
| RBD                  |   &#x2713;    |   &#x2713;   |                 -                  |
| VsphereVolume        |   &#x2713;    |      -       | - (works when pods are collocated) |
| PortworxVolume       |   &#x2713;    |      -       |              &#x2713;              |
| ScaleIO              |   &#x2713;    |   &#x2713;   |                 -                  |
| StorageOS            |   &#x2713;    |      -       |                 -                  |

-->

| Volume 插件            | ReadWriteOnce | ReadOnlyMany |  ReadWriteMany  |
| :------------------- | :-----------: | :----------: | :-------------: |
| AWSElasticBlockStore |   &#x2713;    |      -       |        -        |
| AzureFile            |   &#x2713;    |   &#x2713;   |    &#x2713;     |
| AzureDisk            |   &#x2713;    |      -       |        -        |
| CephFS               |   &#x2713;    |   &#x2713;   |    &#x2713;     |
| Cinder               |   &#x2713;    |      -       |        -        |
| FC                   |   &#x2713;    |   &#x2713;   |        -        |
| FlexVolume           |   &#x2713;    |   &#x2713;   |        -        |
| Flocker              |   &#x2713;    |      -       |        -        |
| GCEPersistentDisk    |   &#x2713;    |   &#x2713;   |        -        |
| Glusterfs            |   &#x2713;    |   &#x2713;   |    &#x2713;     |
| HostPath             |   &#x2713;    |      -       |        -        |
| iSCSI                |   &#x2713;    |   &#x2713;   |        -        |
| PhotonPersistentDisk |   &#x2713;    |      -       |        -        |
| Quobyte              |   &#x2713;    |   &#x2713;   |    &#x2713;     |
| NFS                  |   &#x2713;    |   &#x2713;   |    &#x2713;     |
| RBD                  |   &#x2713;    |   &#x2713;   |        -        |
| VsphereVolume        |   &#x2713;    |      -       | - （当 pod 并列时有效） |
| PortworxVolume       |   &#x2713;    |      -       |    &#x2713;     |
| ScaleIO              |   &#x2713;    |   &#x2713;   |        -        |
| StorageOS            |   &#x2713;    |      -       |        -        |

<!--

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

-->

### 类

PV 可以具有一个类，通过将 `storageClassName` 属性设置为 [StorageClass](/docs/concepts/storage/storage-classes/) 的名称来指定该类。一个特定类别的 PV 只能绑定到请求该类别的 PVC。没有 `storageClassName` 的 PV 就没有类，它只能绑定到不需要特定类的 PVC。

过去，使用的是 `volume.beta.kubernetes.io/storage-class` 注解而不是 `storageClassName` 属性。这个注解仍然有效，但是将来的 Kubernetes 版本中将会完全弃用它。

<!--

### Reclaim Policy

Current reclaim policies are:

* Retain -- manual reclamation
* Recycle -- basic scrub (`rm -rf /thevolume/*`)
* Delete -- associated storage asset such as AWS EBS, GCE PD, Azure Disk, or OpenStack Cinder volume is deleted

Currently, only NFS and HostPath support recycling. AWS EBS, GCE PD, Azure Disk, and Cinder volumes support deletion.

-->

### 回收策略

当前的回收策略包括：

- Retain（保留）——手动回收
- Recycle（回收）——基本擦除（`rm -rf /thevolume/*`）
- Delete（删除）——关联的存储资产（例如 AWS EBS、GCE PD、Azure Disk 和 OpenStack Cinder 卷）将被删除

当前，只有 NFS 和 HostPath 支持回收策略。AWS EBS、GCE PD、Azure Disk 和 Cinder 卷支持删除策略。

<!--

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

-->

### 挂载选项

Kubernetes 管理员可以指定在节点上为挂载持久卷指定挂载选项。

**注意**：不是所有的持久化卷类型都支持挂载选项。

{: .note}

以下卷类型支持挂载选项：

- GCEPersistentDisk
- AWSElasticBlockStore
- AzureFile
- AzureDisk
- NFS
- iSCSI
- RBD （Ceph Block Device）
- CephFS
- Cinder （OpenStack 卷存储）
- Glusterfs
- VsphereVolume
- Quobyte Volumes
- VMware Photon

挂载选项没有校验，如果挂载选项无效则挂载失败。

过去，使用 `volume.beta.kubernetes.io/mount-options` 注解而不是 `mountOptions` 属性。这个注解仍然有效，但在将来的 Kubernetes 版本中它将会被完全弃用。

<!--

### Phase

A volume will be in one of the following phases:

* Available -- a free resource that is not yet bound to a claim
* Bound -- the volume is bound to a claim
* Released -- the claim has been deleted, but the resource is not yet reclaimed by the cluster
* Failed -- the volume has failed its automatic reclamation

The CLI will show the name of the PVC bound to the PV.

-->

### 状态

卷可以处于以下的某种状态：

- Available（可用）——一块空闲资源还没有被任何声明绑定
- Bound（已绑定）——卷已经被声明绑定
- Released（已释放）——声明被删除，但是资源还未被集群重新声明
- Failed（失败）——该卷的自动回收失败

命令行会显示绑定到 PV 的 PVC 的名称。

<!--

## PersistentVolumeClaims

Each PVC contains a spec and status, which is the specification and status of the claim.

-->

## PersistentVolumeClaim

每个 PVC 中都包含一个 spec 规格字段和一个 status 声明状态字段。

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
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

<!--

### Access Modes

Claims use the same conventions as volumes when requesting storage with specific access modes.

-->

### 访问模式

在请求具有特定访问模式的存储时，声明使用与卷相同的约定。

<!--

### Volume Modes

Claims use the same convention as volumes to indicates the consumption of the volume as either a filesystem or block device.

-->

### 卷模式

声明使用与卷相同的约定，指示将卷作为文件系统或块设备使用。

<!--

### Resources

Claims, like pods, can request specific quantities of a resource.  In this case, the request is for storage.  The same [resource model](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) applies to both volumes and claims.

-->

### 资源

像 pod 一样，声明可以请求特定数量的资源。在这种情况下，请求是用于存储的。相同的[资源模型](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md)适用于卷和声明。

<!--

### Selector

Claims can specify a [label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors) to further filter the set of volumes. Only the volumes whose labels match the selector can be bound to the claim. The selector can consist of two fields:

* matchLabels - the volume must have a label with this value
* matchExpressions - a list of requirements made by specifying key, list of values, and operator that relates the key and values. Valid operators include In, NotIn, Exists, and DoesNotExist.

All of the requirements, from both `matchLabels` and `matchExpressions` are ANDed together – they must all be satisfied in order to match.

-->

### 选择器

声明可以指定一个[标签选择器](/docs/concepts/overview/working-with-objects/labels/#label-selectors)来进一步过滤该组卷。只有标签与选择器匹配的卷可以绑定到声明。选择器由两个字段组成：

- matchLabels：volume 必须有具有该值的标签
- matchExpressions：这是一个要求列表，通过指定关键字，值列表以及与关键字和值相关的运算符组成。有效的运算符包括 In、NotIn、Exists 和 DoesNotExist。

所有来自 `matchLabels` 和 `matchExpressions` 的要求都被“与”在一起——它们必须全部满足才能匹配。

<!--

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

-->

### 类

声明可以通过使用属性 `storageClassName` 指定 [StorageClass](/docs/concepts/storage/storage-classes/) 的名称来请求特定的类。只有所请求的类与 PVC 具有相同 `storageClassName` 的 PV 才能绑定到 PVC。

PVC 不一定要请求类。其 `storageClassName` 设置为 `""` 的 PVC 始终被解释为没有请求类的 PV，因此只能绑定到没有类的 PV（没有注解或 `""`）。没有 `storageClassName` 的 PVC 根据是否打开[`DefaultStorageClass` 准入控制插件](/docs/admin/admission-controllers/#defaultstorageclass)，集群对其进行不同处理。

<!--

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

-->

- 如果打开了准入控制插件，管理员可以指定一个默认的 `StorageClass`。所有没有 `StorageClassName` 的 PVC 将被绑定到该默认的 PV。通过在 `StorageClass` 对象中将注解 `storageclassclass.ubernetes.io/is-default-class` 设置为 “true” 来指定默认的 `StorageClass`。如果管理员没有指定缺省值，那么集群会响应 PVC 创建，就好像关闭了准入控制插件一样。如果指定了多个默认值，则准入控制插件将禁止所有 PVC 创建。
- 如果准入控制插件被关闭，则没有默认 `StorageClass` 的概念。所有没有 `storageClassName` 的 PVC 只能绑定到没有类的 PV。在这种情况下，没有 `storageClassName` 的 PVC 的处理方式与 `storageClassName` 设置为 `""` 的 PVC 的处理方式相同。

<!--

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

-->

根据安装方法的不同，默认的 `StorageClass` 可以在安装过程中通过插件管理器部署到 Kubernetes 集群。

当 PVC 指定了 `selector`，除了请求一个 `StorageClass` 之外，这些需求被“与”在一起：只有被请求的类的 PV 具有和被请求的标签才可以被绑定到 PVC。

**注意**：目前，具有非空 `selector` 的 PVC 不能为其动态配置 PV。

{: .note}

过去，使用注解 `volume.beta.kubernetes.io/storage-class` 而不是 `storageClassName` 属性。这个注解仍然有效，但是在未来的 Kubernetes 版本中不会支持。

<!--

## Claims As Volumes

Pods access storage by using the claim as a volume.  Claims must exist in the same namespace as the pod using the claim.  The cluster finds the claim in the pod's namespace and uses it to get the `PersistentVolume` backing the claim.  The volume is then mounted to the host and into the pod.

-->

## 声明作为卷

通过将声明用作卷来访问存储。声明必须与使用声明的 pod 存在于相同的命名空间中。集群在 pod 的命名空间中查找声明，并使用它来获取支持声明的 `PersistentVolume`。该卷然后被挂载到主机的 pod 上。

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

<!--

### A Note on Namespaces

`PersistentVolumes` binds are exclusive, and since `PersistentVolumeClaims` are namespaced objects, mounting claims with "Many" modes (`ROX`, `RWX`) is only possible within one namespace.

-->

### 命名空间注意点

`PersistentVolumes` 绑定是唯一的，并且由于 `PersistentVolumeClaims` 是命名空间对象，因此只能在一个命名空间内挂载具有“多个”模式（`ROX`、`RWX`）的声明。

<!--

## Raw Block Volume Support

Static provisioning support for Raw Block Volumes is included as an alpha feature for v1.9. With this change are some new API fields that need to be used to facilitate this functionality. Currently, Fibre Channel is the only supported plugin for this feature.

-->

## 原始块卷支持

原始块卷的静态配置在 v1.9 中作为 alpha 功能引入。由于这个改变，需要一些新的 API 字段来使用该功能。目前，Fibre Channel 是支持该功能的唯一插件。

<!--

### Persistent Volumes using a Raw Block Volume

-->

### 使用原始块卷作为持久化卷

```
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
<!--

### Persistent Volume Claim requesting a Raw Block Volume

-->

### 持久化卷声明请求原始块卷

```
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
<!--

### Pod specification adding Raw Block Device path in container

-->

### 在 Pod 规格配置中为容器添加原始块设备

```
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

<!--

**Note:** When adding a raw block device for a Pod, we specify the device path in the container instead of a mount path.
{: .note}

-->

**注意**：当为 Pod 增加原始块设备时，我们在容器中指定设备路径而不是挂载路径。

{: .note}

<!--

### Binding Block Volumes

If a user requests a raw block volume by indicating this using the volumeMode field in the PersistentVolumeClaim spec, the binding rules differ slighty from previous releases that didn't consider this mode as part of the spec.
Listed is a table of possible combinations the user and admin might specify for requesting a raw block device. The table indicates if the volume will be bound or not given the combinations:
Volume binding matrix for statically provisioned volumes:

-->

### 绑定块卷

如果用户通过使用 `PersistentVolumeClaim` 规范中的 `volumeMode` 字段指示此请求来请求原始块卷，则绑定规则与以前不认为该模式为规范一部分的版本略有不同。

下面是用户和管理员指定请求原始块设备的可能组合的表格。该表指示卷是否将被绑定或未给定组合。静态设置的卷的卷绑定矩阵：

<!--

| PV volumeMode | PVC volumeMode |  Result |
| ------------- | :------------: | ------: |
| unspecified   |  unspecified   |    BIND |
| unspecified   |     Block      | NO BIND |
| unspecified   |   Filesystem   |    BIND |
| Block         |  unspecified   | NO BIND |
| Block         |     Block      |    BIND |
| Block         |   Filesystem   | NO BIND |
| Filesystem    |   Filesystem   |    BIND |
| Filesystem    |     Block      | NO BIND |
| Filesystem    |  unspecified   |    BIND |

-->

| PV volumeMode | PVC volumeMode |   结果 |
| ------------- | :------------: | ---: |
| unspecified   |  unspecified   |   绑定 |
| unspecified   |     Block      |  不绑定 |
| unspecified   |   Filesystem   |   绑定 |
| Block         |  unspecified   |  不绑定 |
| Block         |     Block      |   绑定 |
| Block         |   Filesystem   |  不绑定 |
| Filesystem    |   Filesystem   |   绑定 |
| Filesystem    |     Block      |  不绑定 |
| Filesystem    |  unspecified   |   绑定 |

<!--

**Note:** Only statically provisioned volumes are supported for alpha release. Administrators should take care to consider these values when working with raw block devices.
{: .note}

-->

**注意**：alpha 版本只支持静态配置卷。使用原始块设备时，管理员应该注意考虑这些值。

{: .note}

<!--

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

-->

## 编写可移植配置

如果您正在编写在多种群集上运行并需要持久存储的配置模板或示例，我们建议您使用以下模式：

- 不要在您的在配置组合中包含 `PersistentVolumeClaim` 对象（与 Deployment、ConfigMap等一起）。
- 不要在配置中包含 `PersistentVolume` 对象，因为用户实例化配置可能没有创建 `PersistentVolume` 的权限。
- 给用户在实例化模板时提供存储类名称的选项。
  - 如果用户提供存储类名称，则将该值放入 `persistentVolumeClaim.storageClassName` 字段中。如果集群具有由管理员启用的 StorageClass，这将导致 PVC 匹配正确的存储类别。
  - 如果用户未提供存储类名称，则将 `persistentVolumeClaim.storageClassName` 字段保留为 nil。
    - 这将导致使用集群中默认的 StorageClass 为用户自动配置 PV。许多集群环境都有默认的 StorageClass，或者管理员可以创建自己的默认 StorageClass。
- 在您的工具中，请注意一段时间之后仍未绑定的 PVC，并向用户展示它们，因为这表示集群可能没有动态存储支持（在这种情况下用户应创建匹配的 PV），或集群没有存储系统（在这种情况下用户不能部署需要 PVC 的配置）。
