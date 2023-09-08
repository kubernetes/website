---
title: 存储类
content_type: concept
weight: 40
---
<!--
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Storage Classes
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
This document describes the concept of a StorageClass in Kubernetes. Familiarity
with [volumes](/docs/concepts/storage/volumes/) and
[persistent volumes](/docs/concepts/storage/persistent-volumes) is suggested.
-->
本文描述了 Kubernetes 中 StorageClass 的概念。
建议先熟悉[卷](/zh-cn/docs/concepts/storage/volumes/)和[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes)的概念。

<!-- body -->

<!--
## Introduction

A StorageClass provides a way for administrators to describe the "classes" of
storage they offer. Different classes might map to quality-of-service levels,
or to backup policies, or to arbitrary policies determined by the cluster
administrators. Kubernetes itself is unopinionated about what classes
represent. This concept is sometimes called "profiles" in other storage
systems.
-->
## 介绍 {#introduction}

StorageClass 为管理员提供了描述存储"类"的方法。
不同的类型可能会映射到不同的服务质量等级或备份策略，或是由集群管理员制定的任意策略。
Kubernetes 本身并不清楚各种类代表的什么。这个类的概念在其他存储系统中有时被称为"配置文件"。

<!--
## The StorageClass Resource

Each StorageClass contains the fields `provisioner`, `parameters`, and
`reclaimPolicy`, which are used when a PersistentVolume belonging to the
class needs to be dynamically provisioned.
-->
## StorageClass 资源 {#the-storageclass-resource}

每个 StorageClass 都包含 `provisioner`、`parameters` 和 `reclaimPolicy` 字段，
这些字段会在 StorageClass 需要动态制备 PersistentVolume 时会使用到。

<!--
The name of a StorageClass object is significant, and is how users can
request a particular class. Administrators set the name and other parameters
of a class when first creating StorageClass objects, and the objects cannot
be updated once they are created.
-->
StorageClass 对象的命名很重要，用户使用这个命名来请求生成一个特定的类。
当创建 StorageClass 对象时，管理员设置 StorageClass 对象的命名和其他参数，
一旦创建了对象就不能再对其更新。

<!--
Administrators can specify a default StorageClass only for PVCs that don't
request any particular class to bind to: see the
[PersistentVolumeClaim section](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
for details.
-->
管理员可以为没有申请绑定到特定 StorageClass 的 PVC 指定一个默认的存储类：
更多详情请参阅
[PersistentVolumeClaim 章节](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
reclaimPolicy: Retain
allowVolumeExpansion: true
mountOptions:
  - debug
volumeBindingMode: Immediate
```

<!--
### Default StorageClass

When a PVC does not specify a `storageClassName`, the default StorageClass is
used. The cluster can only have one default StorageClass. If more than one
default StorageClass is accidentally set, the newest default is used when the
PVC is dynamically provisioned.

For instructions on setting the default StorageClass, see
[Change the default StorageClass](/docs/tasks/administer-cluster/change-default-storage-class/).
Note that certain cloud providers may already define a default StorageClass.
-->
### 默认 StorageClass  {#default-storageclass} 

当一个 PVC 没有指定 `storageClassName` 时，会使用默认的 StorageClass。
集群中只能有一个默认的 StorageClass。如果不小心设置了多个默认的 StorageClass，
当 PVC 动态配置时，将使用最新设置的默认 StorageClass。

关于如何设置默认的 StorageClass，
请参见[更改默认 StorageClass](/zh-cn/docs/tasks/administer-cluster/change-default-storage-class/)。
请注意，某些云服务提供商可能已经定义了一个默认的 StorageClass。

<!--
### Provisioner

Each StorageClass has a provisioner that determines what volume plugin is used
for provisioning PVs. This field must be specified.
-->
### 存储制备器  {#provisioner}

每个 StorageClass 都有一个制备器（Provisioner），用来决定使用哪个卷插件制备 PV。
该字段必须指定。

<!--
| Volume Plugin        | Internal Provisioner |            Config Example             |
-->

| 卷插件               | 内置制备器 |               配置示例                |
| :------------------- | :--------: | :-----------------------------------: |
| AzureFile            |  &#x2713;  |       [Azure File](#azure-file)       |
| CephFS               |     -      |                   -                   |
| FC                   |     -      |                   -                   |
| FlexVolume           |     -      |                   -                   |
| GCEPersistentDisk    |  &#x2713;  |           [GCE PD](#gce-pd)           |
| iSCSI                |     -      |                   -                   |
| NFS                  |     -      |              [NFS](#nfs)              |
| RBD                  |  &#x2713;  |         [Ceph RBD](#ceph-rbd)         |
| VsphereVolume        |  &#x2713;  |          [vSphere](#vsphere)          |
| PortworxVolume       |  &#x2713;  |  [Portworx Volume](#portworx-volume)  |
| Local                |     -      |            [Local](#local)            |

<!--
You are not restricted to specifying the "internal" provisioners
You are not restricted to specifying the "internal" provisioners
listed here (whose names are prefixed with "kubernetes.io" and shipped
alongside Kubernetes). You can also run and specify external provisioners,
which are independent programs that follow a [specification](https://git.k8s.io/design-proposals-archive/storage/volume-provisioning.md)
defined by Kubernetes. Authors of external provisioners have full discretion
over where their code lives, how the provisioner is shipped, how it needs to be
run, what volume plugin it uses (including Flex), etc. The repository
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)
houses a library for writing external provisioners that implements the bulk of
the specification. Some external provisioners are listed under the repository
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner).
-->
你不限于指定此处列出的 "内置" 制备器（其名称前缀为 "kubernetes.io" 并打包在 Kubernetes 中）。
你还可以运行和指定外部制备器，这些独立的程序遵循由 Kubernetes
定义的[规范](https://git.k8s.io/design-proposals-archive/storage/volume-provisioning.md)。
外部供应商的作者完全可以自由决定他们的代码保存于何处、打包方式、运行方式、使用的插件（包括 Flex）等。
代码仓库 [kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)
包含一个用于为外部制备器编写功能实现的类库。你可以访问代码仓库
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)
了解外部驱动列表。

<!--
For example, NFS doesn't provide an internal provisioner, but an external
provisioner can be used. There are also cases when 3rd party storage
vendors provide their own external provisioner.
-->
例如，NFS 没有内部制备器，但可以使用外部制备器。
也有第三方存储供应商提供自己的外部制备器。

<!--
### Reclaim Policy

PersistentVolumes that are dynamically created by a StorageClass will have the
[reclaim policy](/docs/concepts/storage/persistent-volumes/#reclaiming)
specified in the `reclaimPolicy` field of the class, which can be
either `Delete` or `Retain`. If no `reclaimPolicy` is specified when a
StorageClass object is created, it will default to `Delete`.

PersistentVolumes that are created manually and managed via a StorageClass will have
whatever reclaim policy they were assigned at creation.
-->
### 回收策略 {#reclaim-policy}

由 StorageClass 动态创建的 PersistentVolume 会在类的
[reclaimPolicy](/zh-cn/docs/concepts/storage/persistent-volumes/#reclaiming)
字段中指定回收策略，可以是 `Delete` 或者 `Retain`。
如果 StorageClass 对象被创建时没有指定 `reclaimPolicy`，它将默认为 `Delete`。

通过 StorageClass 手动创建并管理的 PersistentVolume 会使用它们被创建时指定的回收策略。

<!--
### Allow Volume Expansion
-->
### 允许卷扩展 {#allow-volume-expansion}

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

<!--
PersistentVolumes can be configured to be expandable. This feature when set to `true`,
allows the users to resize the volume by editing the corresponding PVC object.

The following types of volumes support volume expansion, when the underlying
StorageClass has the field `allowVolumeExpansion` set to true.
-->
PersistentVolume 可以配置为可扩展。将此功能设置为 `true` 时，允许用户通过编辑相应的 PVC 对象来调整卷大小。

当下层 StorageClass 的 `allowVolumeExpansion` 字段设置为 true 时，以下类型的卷支持卷扩展。

{{< table caption = "Table of Volume types and the version of Kubernetes they require"  >}}

<!--
Volume type | Required Kubernetes version
-->
| 卷类型               | Kubernetes 版本要求       |
| :------------------- | :------------------------ |
| gcePersistentDisk    | 1.11                      |
| rbd                  | 1.11                      |
| Azure File           | 1.11                      |
| Portworx             | 1.11                      |
| FlexVolume           | 1.13                      |
| CSI                  | 1.14 (alpha), 1.16 (beta) |

{{< /table >}}

{{< note >}}
<!--
You can only use the volume expansion feature to grow a Volume, not to shrink it.
-->
此功能仅可用于扩容卷，不能用于缩小卷。
{{< /note >}}

<!--
### Mount Options

PersistentVolumes that are dynamically created by a StorageClass will have the
mount options specified in the `mountOptions` field of the class.

If the volume plugin does not support mount options but mount options are
specified, provisioning will fail. Mount options are not validated on either
the class or PV. If a mount option is invalid, the PV mount fails.
-->
### 挂载选项 {#mount-options}

由 StorageClass 动态创建的 PersistentVolume 将使用类中 `mountOptions` 字段指定的挂载选项。

如果卷插件不支持挂载选项，却指定了挂载选项，则制备操作会失败。
挂载选项在 StorageClass 和 PV 上都不会做验证。如果其中一个挂载选项无效，那么这个 PV 挂载操作就会失败。

<!--
### Volume Binding Mode
-->
### 卷绑定模式 {#volume-binding-mode}

<!--
The `volumeBindingMode` field controls when
[volume binding and dynamic provisioning](/docs/concepts/storage/persistent-volumes/#provisioning)
should occur. When unset, "Immediate" mode is used by default.
-->
`volumeBindingMode`
字段控制了[卷绑定和动态制备](/zh-cn/docs/concepts/storage/persistent-volumes/#provisioning)应该发生在什么时候。
当未设置时，默认使用 `Immediate` 模式。

<!--
The `Immediate` mode indicates that volume binding and dynamic
provisioning occurs once the PersistentVolumeClaim is created. For storage
backends that are topology-constrained and not globally accessible from all Nodes
in the cluster, PersistentVolumes will be bound or provisioned without knowledge of the Pod's scheduling
requirements. This may result in unschedulable Pods.
-->
`Immediate` 模式表示一旦创建了 PersistentVolumeClaim 也就完成了卷绑定和动态制备。
对于由于拓扑限制而非集群所有节点可达的存储后端，PersistentVolume
会在不知道 Pod 调度要求的情况下绑定或者制备。

<!--
A cluster administrator can address this issue by specifying the `WaitForFirstConsumer` mode which
will delay the binding and provisioning of a PersistentVolume until a Pod using the PersistentVolumeClaim is created.
PersistentVolumes will be selected or provisioned conforming to the topology that is
specified by the Pod's scheduling constraints. These include, but are not limited to, [resource
requirements](/docs/concepts/configuration/manage-resources-containers/),
[node selectors](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector),
[pod affinity and
anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity),
and [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration).
-->
集群管理员可以通过指定 `WaitForFirstConsumer` 模式来解决此问题。
该模式将延迟 PersistentVolume 的绑定和制备，直到使用该 PersistentVolumeClaim 的 Pod 被创建。
PersistentVolume 会根据 Pod 调度约束指定的拓扑来选择或制备。
这些包括但不限于[资源需求](/zh-cn/docs/concepts/configuration/manage-resources-containers/)、
[节点筛选器](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)、
[Pod 亲和性和互斥性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity/)、
以及[污点和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration)。

<!--
The following plugins support `WaitForFirstConsumer` with dynamic provisioning:

- [GCEPersistentDisk](#gce-pd)
-->
以下插件支持动态制备的 `WaitForFirstConsumer` 模式：

- [GCEPersistentDisk](#gce-pd)

<!--
The following plugins support `WaitForFirstConsumer` with pre-created PersistentVolume binding:

- All of the above
- [Local](#local)
-->
以下插件支持预创建绑定 PersistentVolume 的 `WaitForFirstConsumer` 模式：

- 上述全部
- [Local](#local)

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

<!--
[CSI volumes](/docs/concepts/storage/volumes/#csi) are also supported with dynamic provisioning
and pre-created PVs, but you'll need to look at the documentation for a specific CSI driver
to see its supported topology keys and examples.
-->
动态制备和预先创建的 PV 也支持 [CSI 卷](/zh-cn/docs/concepts/storage/volumes/#csi)，
但是你需要查看特定 CSI 驱动的文档以查看其支持的拓扑键名和例子。

{{< note >}}
<!--
If you choose to use `WaitForFirstConsumer`, do not use `nodeName` in the Pod spec
to specify node affinity.
If `nodeName` is used in this case, the scheduler will be bypassed and PVC will remain in `pending` state.

Instead, you can use node selector for hostname in this case as shown below.
-->
如果你选择使用 `WaitForFirstConsumer`，请不要在 Pod 规约中使用 `nodeName` 来指定节点亲和性。
如果在这种情况下使用 `nodeName`，Pod 将会绕过调度程序，PVC 将停留在 `pending` 状态。

相反，在这种情况下，你可以使用节点选择器作为主机名，如下所示。

{{< /note >}}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: task-pv-pod
spec:
  nodeSelector:
    kubernetes.io/hostname: kube-01
  volumes:
    - name: task-pv-storage
      persistentVolumeClaim:
        claimName: task-pv-claim
  containers:
    - name: task-pv-container
      image: nginx
      ports:
        - containerPort: 80
          name: "http-server"
      volumeMounts:
        - mountPath: "/usr/share/nginx/html"
          name: task-pv-storage
```

<!--
### Allowed Topologies
-->
### 允许的拓扑结构  {#allowed-topologies}

<!--
When a cluster operator specifies the `WaitForFirstConsumer` volume binding mode, it is no longer necessary
to restrict provisioning to specific topologies in most situations. However,
if still required, `allowedTopologies` can be specified.
-->
当集群操作人员使用了 `WaitForFirstConsumer` 的卷绑定模式，
在大部分情况下就没有必要将制备限制为特定的拓扑结构。
然而，如果还有需要的话，可以使用 `allowedTopologies`。

<!--
This example demonstrates how to restrict the topology of provisioned volumes to specific
zones and should be used as a replacement for the `zone` and `zones` parameters for the
supported plugins.
-->
这个例子描述了如何将制备卷的拓扑限制在特定的区域，
在使用时应该根据插件支持情况替换 `zone` 和 `zones` 参数。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
volumeBindingMode: WaitForFirstConsumer
allowedTopologies:
- matchLabelExpressions:
  - key: topology.kubernetes.io/zone
    values:
    - us-central-1a
    - us-central-1b
```

<!--
## Parameters

Storage Classes have parameters that describe volumes belonging to the storage
class. Different parameters may be accepted depending on the `provisioner`. For
example, the value `io1`, for the parameter `type`, and the parameter
`iopsPerGB` are specific to EBS. When a parameter is omitted, some default is
used.

There can be at most 512 parameters defined for a StorageClass.
The total length of the parameters object including its keys and values cannot
exceed 256 KiB.
-->
## 参数 {#parameters}

Storage Classes 的参数描述了存储类的卷。取决于制备器，可以接受不同的参数。
例如，参数 type 的值 io1 和参数 iopsPerGB 特定于 EBS PV。
当参数被省略时，会使用默认值。

一个 StorageClass 最多可以定义 512 个参数。这些参数对象的总长度不能超过 256 KiB，包括参数的键和值。

### AWS EBS

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/aws-ebs
parameters:
  type: io1
  iopsPerGB: "10"
  fsType: ext4
```

<!--
- `type`: `io1`, `gp2`, `sc1`, `st1`. See
  [AWS docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)
  for details. Default: `gp2`.
- `zone` (Deprecated): AWS zone. If neither `zone` nor `zones` is specified, volumes are
  generally round-robin-ed across all active zones where Kubernetes cluster
  has a node. `zone` and `zones` parameters must not be used at the same time.
- `zones` (Deprecated): A comma separated list of AWS zone(s). If neither `zone` nor `zones`
  is specified, volumes are generally round-robin-ed across all active zones
  where Kubernetes cluster has a node. `zone` and `zones` parameters must not
  be used at the same time.
- `iopsPerGB`: only for `io1` volumes. I/O operations per second per GiB. AWS
  volume plugin multiplies this with size of requested volume to compute IOPS
  of the volume and caps it at 20 000 IOPS (maximum supported by AWS, see
  [AWS docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)).
  A string is expected here, i.e. `"10"`, not `10`.
- `fsType`: fsType that is supported by kubernetes. Default: `"ext4"`.
- `encrypted`: denotes whether the EBS volume should be encrypted or not.
  Valid values are `"true"` or `"false"`. A string is expected here,
  i.e. `"true"`, not `true`.
- `kmsKeyId`: optional. The full Amazon Resource Name of the key to use when
  encrypting the volume. If none is supplied but `encrypted` is true, a key is
  generated by AWS. See AWS docs for valid ARN value.
-->
- `type`：`io1`、`gp2`、`sc1`、`st1`。详细信息参见
  [AWS 文档](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)。默认值：`gp2`。
- `zone`（已弃用）：AWS 区域。如果没有指定 `zone` 和 `zones`，
  通常卷会在 Kubernetes 集群节点所在的活动区域中轮询调度分配。
  `zone` 和 `zones` 参数不能同时使用。
- `zones`（已弃用）：以逗号分隔的 AWS 区域列表。
  如果没有指定 `zone` 和 `zones`，通常卷会在 Kubernetes 集群节点所在的活动区域中轮询调度分配。
  `zone`和`zones`参数不能同时使用。
- `iopsPerGB`：只适用于 `io1` 卷。每 GiB 每秒 I/O 操作。
  AWS 卷插件将其与请求卷的大小相乘以计算 IOPS 的容量，
  并将其限制在 20000 IOPS（AWS 支持的最高值，请参阅
  [AWS 文档](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)）。
  这里需要输入一个字符串，即 `"10"`，而不是 `10`。
- `fsType`：受 Kubernetes 支持的文件类型。默认值：`"ext4"`。
- `encrypted`：指定 EBS 卷是否应该被加密。合法值为 `"true"` 或者 `"false"`。
  这里需要输入字符串，即 `"true"`，而非 `true`。
- `kmsKeyId`：可选。加密卷时使用密钥的完整 Amazon 资源名称。
  如果没有提供，但 `encrypted` 值为 true，AWS 生成一个密钥。关于有效的 ARN 值，请参阅 AWS 文档。

{{< note >}}
<!--
`zone` and `zones` parameters are deprecated and replaced with
[allowedTopologies](#allowed-topologies)
-->
`zone` 和 `zones` 已被弃用并被[允许的拓扑结构](#allowed-topologies)取代。
{{< /note >}}

### GCE PD  {#gce-pd}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
  fstype: ext4
  replication-type: none
```

<!--
- `type`: `pd-standard` or `pd-ssd`. Default: `pd-standard`
- `zone` (Deprecated): GCE zone. If neither `zone` nor `zones` is specified, volumes are
  generally round-robin-ed across all active zones where Kubernetes cluster has
  a node. `zone` and `zones` parameters must not be used at the same time.
- `zones` (Deprecated): A comma separated list of GCE zone(s). If neither `zone` nor `zones`
  is specified, volumes are generally round-robin-ed across all active zones
  where Kubernetes cluster has a node. `zone` and `zones` parameters must not
  be used at the same time.
- `fstype`: `ext4` or `xfs`. Default: `ext4`. The defined filesystem type must be supported by the host operating system.

- `replication-type`: `none` or `regional-pd`. Default: `none`.
-->
- `type`：`pd-standard` 或者 `pd-ssd`。默认：`pd-standard`
- `zone`（已弃用）：GCE 区域。如果没有指定 `zone` 和 `zones`，
  通常卷会在 Kubernetes 集群节点所在的活动区域中轮询调度分配。
  `zone` 和 `zones` 参数不能同时使用。
- `zones`（已弃用）：逗号分隔的 GCE 区域列表。如果没有指定 `zone` 和 `zones`，
  通常卷会在 Kubernetes 集群节点所在的活动区域中轮询调度（round-robin）分配。
  `zone` 和 `zones` 参数不能同时使用。
- `fstype`：`ext4` 或 `xfs`。默认：`ext4`。宿主机操作系统必须支持所定义的文件系统类型。
- `replication-type`：`none` 或者 `regional-pd`。默认值：`none`。

<!--
If `replication-type` is set to `none`, a regular (zonal) PD will be provisioned.
-->
如果 `replication-type` 设置为 `none`，会制备一个常规（当前区域内的）持久化磁盘。

<!--
If `replication-type` is set to `regional-pd`, a
[Regional Persistent Disk](https://cloud.google.com/compute/docs/disks/#repds)
will be provisioned. It's highly recommended to have
`volumeBindingMode: WaitForFirstConsumer` set, in which case when you create
a Pod that consumes a PersistentVolumeClaim which uses this StorageClass, a
Regional Persistent Disk is provisioned with two zones. One zone is the same
as the zone that the Pod is scheduled in. The other zone is randomly picked
from the zones available to the cluster. Disk zones can be further constrained
using `allowedTopologies`.
-->
如果 `replication-type` 设置为 `regional-pd`，
会制备一个[区域性持久化磁盘（Regional Persistent Disk）](https://cloud.google.com/compute/docs/disks/#repds)。

强烈建议设置 `volumeBindingMode: WaitForFirstConsumer`，这样设置后，
当你创建一个 Pod，它使用的 PersistentVolumeClaim 使用了这个 StorageClass，
区域性持久化磁盘会在两个区域里制备。其中一个区域是 Pod 所在区域，
另一个区域是会在集群管理的区域中任意选择，磁盘区域可以通过 `allowedTopologies` 加以限制。

{{< note >}}
<!--
`zone` and `zones` parameters are deprecated and replaced with
[allowedTopologies](#allowed-topologies). When
[GCE CSI Migration](/docs/concepts/storage/volumes/#gce-csi-migration) is
enabled, a GCE PD volume can be provisioned in a topology that does not match
any nodes, but any pod trying to use that volume will fail to schedule. With
legacy pre-migration GCE PD, in this case an error will be produced
instead at provisioning time. GCE CSI Migration is enabled by default beginning
from the Kubernetes 1.23 release.
-->
`zone` 和 `zones` 已被弃用并被 [allowedTopologies](#allowed-topologies) 取代。
当启用 [GCE CSI 迁移](/zh-cn/docs/concepts/storage/volumes/#gce-csi-migration)时，
GCE PD 卷可能被制备在某个与所有节点都不匹配的拓扑域中，但任何尝试使用该卷的 Pod 都无法被调度。
对于传统的迁移前 GCE PD，这种情况下将在制备卷的时候产生错误。
从 Kubernetes 1.23 版本开始，GCE CSI 迁移默认启用。
{{< /note >}}

### NFS  {#nfs}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: example-nfs
provisioner: example.com/external-nfs
parameters:
  server: nfs-server.example.com
  path: /share
  readOnly: "false"
```

<!--
- `server`: Server is the hostname or IP address of the NFS server.
- `path`: Path that is exported by the NFS server.
- `readOnly`: A flag indicating whether the storage will be mounted as read only (default false).
-->
- `server`：NFS 服务器的主机名或 IP 地址。
- `path`：NFS 服务器导出的路径。
- `readOnly`：是否将存储挂载为只读的标志（默认为 false）。

<!--
Kubernetes doesn't include an internal NFS provisioner.
You need to use an external provisioner to create a StorageClass for NFS.
Here are some examples:

- [NFS Ganesha server and external provisioner](https://github.com/kubernetes-sigs/nfs-ganesha-server-and-external-provisioner)
- [NFS subdir external provisioner](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)
-->
Kubernetes 不包含内部 NFS 驱动。你需要使用外部驱动为 NFS 创建 StorageClass。
这里有些例子：
- [NFS Ganesha 服务器和外部驱动](https://github.com/kubernetes-sigs/nfs-ganesha-server-and-external-provisioner)
- [NFS subdir 外部驱动](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)

### vSphere {#vsphere}

<!--
There are two types of provisioners for vSphere storage classes:

- [CSI provisioner](#vsphere-provisioner-csi): `csi.vsphere.vmware.com`
- [vCP provisioner](#vcp-provisioner): `kubernetes.io/vsphere-volume`

In-tree provisioners are [deprecated](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/#why-are-we-migrating-in-tree-plugins-to-csi).
For more information on the CSI provisioner, see
[Kubernetes vSphere CSI Driver](https://vsphere-csi-driver.sigs.k8s.io/) and
[vSphereVolume CSI migration](/docs/concepts/storage/volumes/#vsphere-csi-migration).
-->
vSphere 存储类有两种制备器：

- [CSI 制备器](#vsphere-provisioner-csi)：`csi.vsphere.vmware.com`
- [vCP 制备器](#vcp-provisioner)：`kubernetes.io/vsphere-volume`

树内制备器已经被
[弃用](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/#why-are-we-migrating-in-tree-plugins-to-csi)。
更多关于 CSI 制备器的详情，请参阅
[Kubernetes vSphere CSI 驱动](https://vsphere-csi-driver.sigs.k8s.io/)
和 [vSphereVolume CSI 迁移](/zh-cn/docs/concepts/storage/volumes/#vsphere-csi-migration)。

<!--
#### CSI Provisioner {#vsphere-provisioner-csi}

The vSphere CSI StorageClass provisioner works with Tanzu Kubernetes clusters.
For an example, refer to the [vSphere CSI repository](https://github.com/kubernetes-sigs/vsphere-csi-driver/blob/master/example/vanilla-k8s-RWM-filesystem-volumes/example-sc.yaml).
-->
#### CSI 制备器 {#vsphere-provisioner-csi}

vSphere CSI StorageClass 制备器在 Tanzu Kubernetes 集群下运行。示例请参阅
[vSphere CSI 仓库](https://github.com/kubernetes-sigs/vsphere-csi-driver/blob/master/example/vanilla-k8s-RWM-filesystem-volumes/example-sc.yaml)。

<!--
#### vCP Provisioner

The following examples use the VMware Cloud Provider (vCP) StorageClass provisioner.
-->
#### vCP 制备器 {#vcp-provisioner}

以下示例使用 VMware Cloud Provider（vCP）StorageClass 制备器。

<!--
1. Create a StorageClass with a user specified disk format.
-->
1. 使用用户指定的磁盘格式创建一个 StorageClass。

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: fast
   provisioner: kubernetes.io/vsphere-volume
   parameters:
     diskformat: zeroedthick
   ```

   <!--
   `diskformat`: `thin`, `zeroedthick` and `eagerzeroedthick`. Default: `"thin"`.
   -->
   `diskformat`：`thin`、`zeroedthick` 和 `eagerzeroedthick`。默认值：`"thin"`。

<!--
2. Create a StorageClass with a disk format on a user specified datastore.
-->
2. 在用户指定的数据存储上创建磁盘格式的 StorageClass。

   ```yaml
   apiVersion: storage.k8s.io/v1
   kind: StorageClass
   metadata:
     name: fast
   provisioner: kubernetes.io/vsphere-volume
   parameters:
     diskformat: zeroedthick
     datastore: VSANDatastore
   ```

   <!--
   `datastore`: The user can also specify the datastore in the StorageClass.
   The volume will be created on the datastore specified in the StorageClass,
   which in this case is `VSANDatastore`. This field is optional. If the
   datastore is not specified, then the volume will be created on the datastore
   specified in the vSphere config file used to initialize the vSphere Cloud
   Provider.
   -->

   `datastore`：用户也可以在 StorageClass 中指定数据存储。
   卷将在 StorageClass 中指定的数据存储上创建，在这种情况下是 `VSANDatastore`。
   该字段是可选的。
   如果未指定数据存储，则将在用于初始化 vSphere Cloud Provider 的 vSphere
   配置文件中指定的数据存储上创建该卷。

<!--
3. Storage Policy Management inside kubernetes
-->
3. Kubernetes 中的存储策略管理

   <!--
   - Using existing vCenter SPBM policy

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

   - 使用现有的 vCenter SPBM 策略

     vSphere 用于存储管理的最重要特性之一是基于策略的管理。
     基于存储策略的管理（SPBM）是一个存储策略框架，提供单一的统一控制平面的跨越广泛的数据服务和存储解决方案。
     SPBM 使得 vSphere 管理员能够克服先期的存储配置挑战，如容量规划、差异化服务等级和管理容量空间。

     SPBM 策略可以在 StorageClass 中使用 `storagePolicyName` 参数声明。

    <!--
   - Virtual SAN policy support inside Kubernetes

     Vsphere Infrastructure (VI) Admins will have the ability to specify custom
     Virtual SAN Storage Capabilities during dynamic volume provisioning. You
     can now define storage requirements, such as performance and availability,
     in the form of storage capabilities during dynamic volume provisioning.
     The storage capability requirements are converted into a Virtual SAN
     policy which are then pushed down to the Virtual SAN layer when a
     persistent volume (virtual disk) is being created. The virtual disk is
     distributed across the Virtual SAN datastore to meet the requirements.

     You can see [Storage Policy Based Management for dynamic provisioning of volumes](https://github.com/vmware-archive/vsphere-storage-for-kubernetes/blob/fa4c8b8ad46a85b6555d715dd9d27ff69839df53/documentation/policy-based-mgmt.md)
     for more details on how to use storage policies for persistent volumes
     management.
    -->

   - Kubernetes 内的 Virtual SAN 策略支持

     Vsphere Infrastructure（VI）管理员将能够在动态卷配置期间指定自定义 Virtual SAN
     存储功能。你现在可以在动态制备卷期间以存储能力的形式定义存储需求，例如性能和可用性。
     存储能力需求会转换为 Virtual SAN 策略，之后当持久卷（虚拟磁盘）被创建时，
     会将其推送到 Virtual SAN 层。虚拟磁盘分布在 Virtual SAN 数据存储中以满足要求。

     你可以参考[基于存储策略的动态制备卷管理](https://github.com/vmware-archive/vsphere-storage-for-kubernetes/blob/fa4c8b8ad46a85b6555d715dd9d27ff69839df53/documentation/policy-based-mgmt.md)，
     进一步了解有关持久卷管理的存储策略的详细信息。

<!--
There are few
[vSphere examples](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)
which you try out for persistent volume management inside Kubernetes for vSphere.
-->
有几个 [vSphere 例子](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)供你在
Kubernetes for vSphere 中尝试进行持久卷管理。

### Ceph RBD  {#ceph-rbd}

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="v1.28" >}}
<!--
This internal provisioner of Ceph RBD is deprecated. Please use
[CephFS RBD CSI driver](https://github.com/ceph/ceph-csi).
-->
Ceph RBD 的内部驱动程序已被弃用。请使用 [CephFS RBD CSI驱动程序](https://github.com/ceph/ceph-csi)。
{{< /note >}}

```yaml
apiVersion: storage.k8s.io/v1
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
  userSecretNamespace: default
  fsType: ext4
  imageFormat: "2"
  imageFeatures: "layering"
```

<!--
- `monitors`: Ceph monitors, comma delimited. This parameter is required.
- `adminId`: Ceph client ID that is capable of creating images in the pool.
  Default is "admin".
- `adminSecretName`: Secret Name for `adminId`. This parameter is required.
  The provided secret must have type "kubernetes.io/rbd".
- `adminSecretNamespace`: The namespace for `adminSecretName`. Default is "default".
- `pool`: Ceph RBD pool. Default is "rbd".
- `userId`: Ceph client ID that is used to map the RBD image. Default is the
  same as `adminId`.
-->
- `monitors`：Ceph monitor，逗号分隔。该参数是必需的。
- `adminId`：Ceph 客户端 ID，用于在池 ceph 池中创建映像。默认是 "admin"。
- `adminSecret`：`adminId` 的 Secret 名称。该参数是必需的。
  提供的 secret 必须有值为 "kubernetes.io/rbd" 的 type 参数。
- `adminSecretNamespace`：`adminSecret` 的命名空间。默认是 "default"。
- `pool`：Ceph RBD 池。默认是 "rbd"。
- `userId`：Ceph 客户端 ID，用于映射 RBD 镜像。默认与 `adminId` 相同。

<!--
- `userSecretName`: The name of Ceph Secret for `userId` to map RBD image. It
  must exist in the same namespace as PVCs. This parameter is required.
  The provided secret must have type "kubernetes.io/rbd", for example created in this
  way:
-->
- `userSecretName`：用于映射 RBD 镜像的 `userId` 的 Ceph Secret 的名字。
  它必须与 PVC 存在于相同的 namespace 中。该参数是必需的。
  提供的 secret 必须具有值为 "kubernetes.io/rbd" 的 type 参数，例如以这样的方式创建：

  ```shell
  kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" \
    --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' \
    --namespace=kube-system
  ```

<!--
- `userSecretNamespace`: The namespace for `userSecretName`.
- `fsType`: fsType that is supported by kubernetes. Default: `"ext4"`.
- `imageFormat`: Ceph RBD image format, "1" or "2". Default is "2".
- `imageFeatures`: This parameter is optional and should only be used if you
  set `imageFormat` to "2". Currently supported features are `layering` only.
  Default is "", and no features are turned on.
-->
- `userSecretNamespace`：`userSecretName` 的命名空间。
- `fsType`：Kubernetes 支持的 fsType。默认：`"ext4"`。
- `imageFormat`：Ceph RBD 镜像格式，"1" 或者 "2"。默认值是 "1"。
- `imageFeatures`：这个参数是可选的，只能在你将 `imageFormat` 设置为 "2" 才使用。
  目前支持的功能只是 `layering`。默认是 ""，没有功能打开。

<!--
### Azure Disk
-->
### Azure 磁盘 {#azure-disk}

<!--
#### Azure Unmanaged Disk storage class {#azure-unmanaged-disk-storage-class}
-->
#### Azure Unmanaged Disk Storage Class（非托管磁盘存储类）{#azure-unmanaged-disk-storage-class}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/azure-disk
parameters:
  skuName: Standard_LRS
  location: eastus
  storageAccount: azure_storage_account_name
```

<!--
- `skuName`: Azure storage account Sku tier. Default is empty.
- `location`: Azure storage account location. Default is empty.
- `storageAccount`: Azure storage account name. If a storage account is provided,
  it must reside in the same resource group as the cluster, and `location` is
  ignored. If a storage account is not provided, a new storage account will be
  created in the same resource group as the cluster.
-->
- `skuName`：Azure 存储帐户 Sku 层。默认为空。
- `location`：Azure 存储帐户位置。默认为空。
- `storageAccount`：Azure 存储帐户名称。
  如果提供存储帐户，它必须位于与集群相同的资源组中，并且 `location`
  是被忽略的。如果未提供存储帐户，则会在与集群相同的资源组中创建新的存储帐户。

<!--
#### Azure Disk storage class (starting from v1.7.2) {#azure-disk-storage-class}
-->
#### Azure 磁盘 Storage Class（从 v1.7.2 开始）{#azure-disk-storage-class}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/azure-disk
parameters:
  storageaccounttype: Standard_LRS
  kind: managed
```

<!--
- `storageaccounttype`: Azure storage account Sku tier. Default is empty.
- `kind`: Possible values are `shared`, `dedicated`, and `managed` (default).
  When `kind` is `shared`, all unmanaged disks are created in a few shared
  storage accounts in the same resource group as the cluster. When `kind` is
  `dedicated`, a new dedicated storage account will be created for the new
  unmanaged disk in the same resource group as the cluster. When `kind` is
  `managed`, all managed disks are created in the same resource group as
  the cluster.
- `resourceGroup`: Specify the resource group in which the Azure disk will be created.
  It must be an existing resource group name. If it is unspecified, the disk will be
  placed in the same resource group as the current Kubernetes cluster.
-->

- `storageaccounttype`：Azure 存储帐户 Sku 层。默认为空。
- `kind`：可能的值是 `shared`、`dedicated` 和 `managed`（默认）。
  当 `kind` 的值是 `shared` 时，所有非托管磁盘都在集群的同一个资源组中的几个共享存储帐户中创建。
  当 `kind` 的值是 `dedicated` 时，将为在集群的同一个资源组中新的非托管磁盘创建新的专用存储帐户。
- `resourceGroup`：指定要创建 Azure 磁盘所属的资源组。必须是已存在的资源组名称。
  若未指定资源组，磁盘会默认放入与当前 Kubernetes 集群相同的资源组中。
<!--
* Premium VM can attach both Standard_LRS and Premium_LRS disks, while Standard
  VM can only attach Standard_LRS disks.
* Managed VM can only attach managed disks and unmanaged VM can only attach
  unmanaged disks.
  -->
* Premium VM 可以同时添加 Standard_LRS 和 Premium_LRS 磁盘，而 Standard
  虚拟机只能添加 Standard_LRS 磁盘。
* 托管虚拟机只能连接托管磁盘，非托管虚拟机只能连接非托管磁盘。

<!--
### Azure File
-->
### Azure 文件 {#azure-file}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azurefile
provisioner: kubernetes.io/azure-file
parameters:
  skuName: Standard_LRS
  location: eastus
  storageAccount: azure_storage_account_name
```

<!--
- `skuName`: Azure storage account Sku tier. Default is empty.
- `location`: Azure storage account location. Default is empty.
- `storageAccount`: Azure storage account name. Default is empty. If a storage
  account is not provided, all storage accounts associated with the resource
  group are searched to find one that matches `skuName` and `location`. If a
  storage account is provided, it must reside in the same resource group as the
  cluster, and `skuName` and `location` are ignored.
- `secretNamespace`: the namespace of the secret that contains the Azure Storage
  Account Name and Key. Default is the same as the Pod.
- `secretName`: the name of the secret that contains the Azure Storage Account Name and
  Key. Default is `azure-storage-account-<accountName>-secret`
- `readOnly`: a flag indicating whether the storage will be mounted as read only.
  Defaults to false which means a read/write mount. This setting will impact the
  `ReadOnly` setting in VolumeMounts as well.
-->
- `skuName`：Azure 存储帐户 Sku 层。默认为空。
- `location`：Azure 存储帐户位置。默认为空。
- `storageAccount`：Azure 存储帐户名称。默认为空。
  如果不提供存储帐户，会搜索所有与资源相关的存储帐户，以找到一个匹配
  `skuName` 和 `location` 的账号。
  如果提供存储帐户，它必须存在于与集群相同的资源组中，`skuName` 和 `location` 会被忽略。
- `secretNamespace`：包含 Azure 存储帐户名称和密钥的密钥的名字空间。
  默认值与 Pod 相同。
- `secretName`：包含 Azure 存储帐户名称和密钥的密钥的名称。
  默认值为 `azure-storage-account-<accountName>-secret`
- `readOnly`：指示是否将存储安装为只读的标志。默认为 false，表示"读/写"挂载。
  该设置也会影响 VolumeMounts 中的 `ReadOnly` 设置。

<!--
During storage provisioning, a secret named by `secretName` is created for the
mounting credentials. If the cluster has enabled both
[RBAC](/docs/reference/access-authn-authz/rbac/) and
[Controller Roles](/docs/reference/access-authn-authz/rbac/#controller-roles),
add the `create` permission of resource `secret` for clusterrole
`system:controller:persistent-volume-binder`.
-->
在存储制备期间，为挂载凭证创建一个名为 `secretName` 的 Secret。如果集群同时启用了
[RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)
和[控制器角色](/zh-cn/docs/reference/access-authn-authz/rbac/#controller-roles)，
为 `system:controller:persistent-volume-binder` 的 clusterrole 添加
`Secret` 资源的 `create` 权限。

<!--
In a multi-tenancy context, it is strongly recommended to set the value for
`secretNamespace` explicitly, otherwise the storage account credentials may
be read by other users.
-->
在多租户上下文中，强烈建议显式设置 `secretNamespace` 的值，否则其他用户可能会读取存储帐户凭据。

<!--
### Portworx Volume
-->
### Portworx 卷 {#portworx-volume}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: portworx-io-priority-high
provisioner: kubernetes.io/portworx-volume
parameters:
  repl: "1"
  snap_interval: "70"
  priority_io: "high"
```

<!--
- `fs`: filesystem to be laid out: `none/xfs/ext4` (default: `ext4`).
- `block_size`: block size in Kbytes (default: `32`).
- `repl`: number of synchronous replicas to be provided in the form of
  replication factor `1..3` (default: `1`) A string is expected here i.e.
  `"1"` and not `1`.
- `priority_io`: determines whether the volume will be created from higher
  performance or a lower priority storage `high/medium/low` (default: `low`).
- `snap_interval`: clock/time interval in minutes for when to trigger snapshots.
  Snapshots are incremental based on difference with the prior snapshot, 0
  disables snaps (default: `0`). A string is expected here i.e.
  `"70"` and not `70`.
- `aggregation_level`: specifies the number of chunks the volume would be
  distributed into, 0 indicates a non-aggregated volume (default: `0`). A string
  is expected here i.e. `"0"` and not `0`
- `ephemeral`: specifies whether the volume should be cleaned-up after unmount
  or should be persistent. `emptyDir` use case can set this value to true and
  `persistent volumes` use case such as for databases like Cassandra should set
  to false, `true/false` (default `false`). A string is expected here i.e.
  `"true"` and not `true`.
-->
- `fs`：选择的文件系统：`none/xfs/ext4`（默认：`ext4`）。
- `block_size`：以 Kbytes 为单位的块大小（默认值：`32`）。
- `repl`：同步副本数量，以复制因子 `1..3`（默认值：`1`）的形式提供。
  这里需要填写字符串，即，`"1"` 而不是 `1`。
- `io_priority`：决定是否从更高性能或者较低优先级存储创建卷
  `high/medium/low`（默认值：`low`）。
- `snap_interval`：触发快照的时钟/时间间隔（分钟）。
  快照是基于与先前快照的增量变化，0 是禁用快照（默认：`0`）。
  这里需要填写字符串，即，是 `"70"` 而不是 `70`。
- `aggregation_level`：指定卷分配到的块数量，0 表示一个非聚合卷（默认：`0`）。
  这里需要填写字符串，即，是 `"0"` 而不是 `0`。
- `ephemeral`：指定卷在卸载后进行清理还是持久化。
  `emptyDir` 的使用场景可以将这个值设置为 true，
  `persistent volumes` 的使用场景可以将这个值设置为 false
  （例如 Cassandra 这样的数据库）
  `true/false`（默认为 `false`）。这里需要填写字符串，即，
  是 `"true"` 而不是 `true`。

<!--
### Local
-->
### 本地 {#local}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

<!--
Local volumes do not currently support dynamic provisioning, however a StorageClass
should still be created to delay volume binding until Pod scheduling. This is
specified by the `WaitForFirstConsumer` volume binding mode.
-->
本地卷还不支持动态制备，然而还是需要创建 StorageClass 以延迟卷绑定，
直到完成 Pod 的调度。这是由 `WaitForFirstConsumer` 卷绑定模式指定的。

<!--
Delaying volume binding allows the scheduler to consider all of a Pod's
scheduling constraints when choosing an appropriate PersistentVolume for a
PersistentVolumeClaim.
-->
延迟卷绑定使得调度器在为 PersistentVolumeClaim 选择一个合适的
PersistentVolume 时能考虑到所有 Pod 的调度限制。
