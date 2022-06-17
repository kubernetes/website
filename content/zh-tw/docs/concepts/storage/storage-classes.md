---
title: 儲存類
content_type: concept
weight: 30
---

<!--
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Storage Classes
content_type: concept
weight: 30
-->

<!-- overview -->

<!--
This document describes the concept of a StorageClass in Kubernetes. Familiarity
with [volumes](/docs/concepts/storage/volumes/) and
[persistent volumes](/docs/concepts/storage/persistent-volumes) is suggested.
-->
本文描述了 Kubernetes 中 StorageClass 的概念。建議先熟悉
[卷](/zh-cn/docs/concepts/storage/volumes/)和
[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes)的概念。

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
## 介紹

StorageClass 為管理員提供了描述儲存 "類" 的方法。
不同的型別可能會對映到不同的服務質量等級或備份策略，或是由叢集管理員制定的任意策略。
Kubernetes 本身並不清楚各種類代表的什麼。這個類的概念在其他儲存系統中有時被稱為 "配置檔案"。

<!--
## The StorageClass Resource

Each StorageClass contains the fields `provisioner`, `parameters`, and
`reclaimPolicy`, which are used when a PersistentVolume belonging to the
class needs to be dynamically provisioned.

-->
## StorageClass 資源

每個 StorageClass 都包含 `provisioner`、`parameters` 和 `reclaimPolicy` 欄位，
這些欄位會在 StorageClass 需要動態分配 PersistentVolume 時會使用到。

<!--
The name of a StorageClass object is significant, and is how users can
request a particular class. Administrators set the name and other parameters
of a class when first creating StorageClass objects, and the objects cannot
be updated once they are created.
 -->
StorageClass 物件的命名很重要，使用者使用這個命名來請求生成一個特定的類。
當建立 StorageClass 物件時，管理員設定 StorageClass 物件的命名和其他引數，一旦建立了物件就不能再對其更新。

<!--
Administrators can specify a default StorageClass only for PVCs that don't
request any particular class to bind to: see the
[PersistentVolumeClaim section](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
for details.
 -->
管理員可以為沒有申請繫結到特定 StorageClass 的 PVC 指定一個預設的儲存類：
更多詳情請參閱
[PersistentVolumeClaim 章節](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。

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
### Provisioner

Each StorageClass has a provisioner that determines what volume plugin is used
for provisioning PVs. This field must be specified.
 -->
### 儲存製備器  {#provisioner}

每個 StorageClass 都有一個製備器（Provisioner），用來決定使用哪個卷外掛製備 PV。
該欄位必須指定。

<!--
| Volume Plugin        | Internal Provisioner| Config Example                       |
-->

| 卷外掛               | 內建製備器 |               配置例子                |
|:---------------------|:----------:|:-------------------------------------:|
| AWSElasticBlockStore |  &#x2713;  |          [AWS EBS](#aws-ebs)          |
| AzureFile            |  &#x2713;  |       [Azure File](#azure-檔案)       |
| AzureDisk            |  &#x2713;  |       [Azure Disk](#azure-磁碟)       |
| CephFS               |     -      |                   -                   |
| Cinder               |  &#x2713;  | [OpenStack Cinder](#openstack-cinder) |
| FC                   |     -      |                   -                   |
| FlexVolume           |     -      |                   -                   |
| Flocker              |  &#x2713;  |                   -                   |
| GCEPersistentDisk    |  &#x2713;  |           [GCE PD](#gce-pd)           |
| Glusterfs            |  &#x2713;  |        [Glusterfs](#glusterfs)        |
| iSCSI                |     -      |                   -                   |
| Quobyte              |  &#x2713;  |          [Quobyte](#quobyte)          |
| NFS                  |     -      |              [NFS](#nfs)              |
| RBD                  |  &#x2713;  |         [Ceph RBD](#ceph-rbd)         |
| VsphereVolume        |  &#x2713;  |          [vSphere](#vsphere)          |
| PortworxVolume       |  &#x2713;  |  [Portworx Volume](#portworx-卷)  |
| ScaleIO              |  &#x2713;  |          [ScaleIO](#scaleio)          |
| StorageOS            |  &#x2713;  |        [StorageOS](#storageos)        |
| Local                |     -      |            [Local](#本地)            |

<!--
You are not restricted to specifying the "internal" provisioners
listed here (whose names are prefixed with "kubernetes.io" and shipped
alongside Kubernetes). You can also run and specify external provisioners,
which are independent programs that follow a [specification](https://github.com/kubernetes/design-proposals-archive/blob/main/storage/volume-provisioning.md))
defined by Kubernetes. Authors of external provisioners have full discretion
over where their code lives, how the provisioner is shipped, how it needs to be
run, what volume plugin it uses (including Flex), etc. The repository
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)
houses a library for writing external provisioners that implements the bulk of
the specification. Some external provisioners are listed under the repository
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner).
 -->
你不限於指定此處列出的 "內建" 製備器（其名稱字首為 "kubernetes.io" 並打包在 Kubernetes 中）。
你還可以執行和指定外部製備器，這些獨立的程式遵循由 Kubernetes 定義的
[規範](https://github.com/kubernetes/design-proposals-archive/blob/main/storage/volume-provisioning.md)。
外部供應商的作者完全可以自由決定他們的程式碼保存於何處、打包方式、執行方式、使用的外掛（包括 Flex）等。
程式碼倉庫 [kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)
包含一個用於為外部製備器編寫功能實現的類庫。你可以訪問程式碼倉庫
[kubernetes-sigs/sig-storage-lib-external-provisioner](https://github.com/kubernetes-sigs/sig-storage-lib-external-provisioner)
瞭解外部驅動列表。


<!--
For example, NFS doesn't provide an internal provisioner, but an external
provisioner can be used. There are also cases when 3rd party storage
vendors provide their own external provisioner.
 -->
例如，NFS 沒有內部製備器，但可以使用外部製備器。
也有第三方儲存供應商提供自己的外部製備器。

<!--
### Reclaim Policy

PersistentVolumes that are dynamically created by a StorageClass will have the
reclaim policy specified in the `reclaimPolicy` field of the class, which can be
either `Delete` or `Retain`. If no `reclaimPolicy` is specified when a
StorageClass object is created, it will default to `Delete`.

PersistentVolumes that are created manually and managed via a StorageClass will have
whatever reclaim policy they were assigned at creation.
 -->
### 回收策略

由 StorageClass 動態建立的 PersistentVolume 會在類的 `reclaimPolicy` 欄位中指定回收策略，可以是
`Delete` 或者 `Retain`。如果 StorageClass 物件被建立時沒有指定 `reclaimPolicy`，它將預設為 `Delete`。

透過 StorageClass 手動建立並管理的 PersistentVolume 會使用它們被建立時指定的回收政策。

<!--
### Allow Volume Expansion
-->

### 允許卷擴充套件

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

<!--
PersistentVolumes can be configured to be expandable. This feature when set to `true`,
allows the users to resize the volume by editing the corresponding PVC object.

The following types of volumes support volume expansion, when the underlying
StorageClass has the field `allowVolumeExpansion` set to true.
-->
PersistentVolume 可以配置為可擴充套件。將此功能設定為 `true` 時，允許使用者透過編輯相應的 PVC 物件來調整卷大小。

當下層 StorageClass 的 `allowVolumeExpansion` 欄位設定為 true 時，以下型別的卷支援卷擴充套件。

{{< table caption = "Table of Volume types and the version of Kubernetes they require"  >}}

<!-- 
Volume type | Required Kubernetes version
-->
| 卷型別               | Kubernetes 版本要求        |
|:---------------------|:--------------------------|
| gcePersistentDisk    | 1.11                      |
| awsElasticBlockStore | 1.11                      |
| Cinder               | 1.11                      |
| glusterfs            | 1.11                      |
| rbd                  | 1.11                      |
| Azure File           | 1.11                      |
| Azure Disk           | 1.11                      |
| Portworx             | 1.11                      |
| FlexVolume           | 1.13                      |
| CSI                  | 1.14 (alpha), 1.16 (beta) |

{{< /table >}}

<!--
You can only use the volume expansion feature to grow a Volume, not to shrink it.
-->
{{< note >}}
此功能僅可用於擴容卷，不能用於縮小卷。
{{< /note >}}

<!--
### Mount Options

PersistentVolumes that are dynamically created by a StorageClass will have the
mount options specified in the `mountOptions` field of the class.

If the volume plugin does not support mount options but mount options are
specified, provisioning will fail. Mount options are not validated on either
the class or PV, If a mount option is invalid, the PV mount fails.
 -->
### 掛載選項

由 StorageClass 動態建立的 PersistentVolume 將使用類中 `mountOptions` 欄位指定的掛載選項。

如果卷外掛不支援掛載選項，卻指定了掛載選項，則製備操作會失敗。
掛載選項在 StorageClass 和 PV 上都不會做驗證，如果其中一個掛載選項無效，那麼這個 PV 掛載操作就會失敗。

<!--
### Volume Binding Mode
 -->
### 卷繫結模式

<!--
The `volumeBindingMode` field controls when [volume binding and dynamic
provisioning](/docs/concepts/storage/persistent-volumes/#provisioning) should occur.
 -->
`volumeBindingMode` 欄位控制了[卷繫結和動態製備](/zh-cn/docs/concepts/storage/persistent-volumes/#provisioning)
應該發生在什麼時候。

<!--
By default, the `Immediate` mode indicates that volume binding and dynamic
provisioning occurs once the PersistentVolumeClaim is created. For storage
backends that are topology-constrained and not globally accessible from all Nodes
in the cluster, PersistentVolumes will be bound or provisioned without knowledge of the Pod's scheduling
requirements. This may result in unschedulable Pods.
 -->
預設情況下，`Immediate` 模式表示一旦建立了 PersistentVolumeClaim 也就完成了卷繫結和動態製備。
對於由於拓撲限制而非叢集所有節點可達的儲存後端，PersistentVolume
會在不知道 Pod 排程要求的情況下繫結或者製備。

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
叢集管理員可以透過指定 `WaitForFirstConsumer` 模式來解決此問題。
該模式將延遲 PersistentVolume 的繫結和製備，直到使用該 PersistentVolumeClaim 的 Pod 被建立。
PersistentVolume 會根據 Pod 排程約束指定的拓撲來選擇或製備。這些包括但不限於
[資源需求](/zh-cn/docs/concepts/configuration/manage-resources-containers/)、
[節點篩選器](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)、
[pod 親和性和互斥性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity/)、
以及[汙點和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration)。

<!--
The following plugins support `WaitForFirstConsumer` with dynamic provisioning:

* [AWSElasticBlockStore](#aws-ebs)
* [GCEPersistentDisk](#gce-pd)
* [AzureDisk](#azure-disk)
-->
以下外掛支援動態供應的 `WaitForFirstConsumer` 模式:

* [AWSElasticBlockStore](#aws-ebs)
* [GCEPersistentDisk](#gce-pd)
* [AzureDisk](#azure-disk)

<!--
The following plugins support `WaitForFirstConsumer` with pre-created PersistentVolume binding:

* All of the above
* [Local](#local)
-->
以下外掛支援預建立繫結 PersistentVolume 的 `WaitForFirstConsumer` 模式：

* 上述全部
* [Local](#local)

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

<!--
[CSI volumes](/docs/concepts/storage/volumes/#csi) are also supported with dynamic provisioning
and pre-created PVs, but you'll need to look at the documentation for a specific CSI driver
to see its supported topology keys and examples.
-->
動態配置和預先建立的 PV 也支援 [CSI卷](/zh-cn/docs/concepts/storage/volumes/#csi)，
但是你需要檢視特定 CSI 驅動程式的文件以檢視其支援的拓撲鍵名和例子。

{{< note >}}
<!-- 
   If you choose to use `WaitForFirstConsumer`, do not use `nodeName` in the Pod spec
   to specify node affinity. If `nodeName` is used in this case, the scheduler will be bypassed and PVC will remain in `pending` state.

   Instead, you can use node selector for hostname in this case as shown below.
-->
   如果你選擇使用 `WaitForFirstConsumer`，請不要在 Pod 規約中使用 `nodeName` 來指定節點親和性。
   如果在這種情況下使用 `nodeName`，Pod 將會繞過排程程式，PVC 將停留在 `pending` 狀態。
   
   相反，在這種情況下，你可以使用節點選擇器作為主機名，如下所示

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
### 允許的拓撲結構  {#allowed-topologies}
{{< feature-state for_k8s_version="v1.12" state="beta" >}}

<!--
When a cluster operator specifies the `WaitForFirstConsumer` volume binding mode, it is no longer necessary
to restrict provisioning to specific topologies in most situations. However,
if still required, `allowedTopologies` can be specified.
-->
當叢集操作人員使用了 `WaitForFirstConsumer` 的卷繫結模式，
在大部分情況下就沒有必要將製備限制為特定的拓撲結構。
然而，如果還有需要的話，可以使用 `allowedTopologies`。

<!--
This example demonstrates how to restrict the topology of provisioned volumes to specific
zones and should be used as a replacement for the `zone` and `zones` parameters for the
supported plugins.
-->
這個例子描述瞭如何將供應卷的拓撲限制在特定的區域，在使用時應該根據外掛
支援情況替換 `zone` 和 `zones` 引數。

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
  - key: failure-domain.beta.kubernetes.io/zone
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
## 引數

Storage Classes 的引數描述了儲存類的卷。取決於製備器，可以接受不同的引數。
例如，引數 type 的值 io1 和引數 iopsPerGB 特定於 EBS PV。
當引數被省略時，會使用預設值。

一個 StorageClass 最多可以定義 512 個引數。這些引數物件的總長度不能
超過 256 KiB, 包括引數的鍵和值。

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
* `type`: `io1`, `gp2`, `gp2`, `sc1`, `st1`. See
* `type`: `io1`, `gp2`, `sc1`, `st1`. See
  [AWS docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)
  for details. Default: `gp2`.
* `zone` (Deprecated): AWS zone. If neither `zone` nor `zones` is specified, volumes are
  generally round-robin-ed across all active zones where Kubernetes cluster
  has a node. `zone` and `zones` parameters must not be used at the same time.
* `zones` (Deprecated): A comma separated list of AWS zone(s). If neither `zone` nor `zones`
  is specified, volumes are generally round-robin-ed across all active zones
  where Kubernetes cluster has a node. `zone` and `zones` parameters must not
  be used at the same time.
* `iopsPerGB`: only for `io1` volumes. I/O operations per second per GiB. AWS
  volume plugin multiplies this with size of requested volume to compute IOPS
  of the volume and caps it at 20 000 IOPS (maximum supported by AWS, see
  [AWS docs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html).
  A string is expected here, i.e. `"10"`, not `10`.
* `fsType`: fsType that is supported by kubernetes. Default: `"ext4"`.
* `encrypted`: denotes whether the EBS volume should be encrypted or not.
  Valid values are `"true"` or `"false"`. A string is expected here,
  i.e. `"true"`, not `true`.
* `kmsKeyId`: optional. The full Amazon Resource Name of the key to use when
  encrypting the volume. If none is supplied but `encrypted` is true, a key is
  generated by AWS. See AWS docs for valid ARN value.
-->
* `type`：`io1`，`gp2`，`sc1`，`st1`。詳細資訊參見
  [AWS 文件](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)。預設值：`gp2`。
* `zone`(棄用)：AWS 區域。如果沒有指定 `zone` 和 `zones`，
  通常卷會在 Kubernetes 叢集節點所在的活動區域中輪詢排程分配。
  `zone` 和 `zones` 引數不能同時使用。
* `zones`(棄用)：以逗號分隔的 AWS 區域列表。
  如果沒有指定 `zone` 和 `zones`，通常卷會在 Kubernetes 叢集節點所在的
  活動區域中輪詢排程分配。`zone`和`zones`引數不能同時使用。
* `iopsPerGB`：只適用於 `io1` 卷。每 GiB 每秒 I/O 操作。
  AWS 卷外掛將其與請求卷的大小相乘以計算 IOPS 的容量，
  並將其限制在 20000 IOPS（AWS 支援的最高值，請參閱
  [AWS 文件](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)。
  這裡需要輸入一個字串，即 `"10"`，而不是 `10`。
* `fsType`：受 Kubernetes 支援的檔案型別。預設值：`"ext4"`。
* `encrypted`：指定 EBS 卷是否應該被加密。合法值為 `"true"` 或者 `"false"`。
  這裡需要輸入字串，即 `"true"`, 而非 `true`。
* `kmsKeyId`：可選。加密卷時使用金鑰的完整 Amazon 資源名稱。
  如果沒有提供，但 `encrypted` 值為 true，AWS 生成一個金鑰。關於有效的 ARN 值，請參閱 AWS 文件。

{{< note >}}
<!--
`zone` and `zones` parameters are deprecated and replaced with
[allowedTopologies](#allowed-topologies)
 -->
`zone` 和 `zones` 已被棄用並被 [允許的拓撲結構](#allowed-topologies) 取代。
{{< /note >}}

### GCE PD

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
* `type`: `pd-standard` or `pd-ssd`. Default: `pd-standard`
* `zone` (Deprecated): GCE zone. If neither `zone` nor `zones` is specified, volumes are
  generally round-robin-ed across all active zones where Kubernetes cluster has
  a node. `zone` and `zones` parameters must not be used at the same time.
* `zones` (Deprecated): A comma separated list of GCE zone(s). If neither `zone` nor `zones`
  is specified, volumes are generally round-robin-ed across all active zones
  where Kubernetes cluster has a node. `zone` and `zones` parameters must not
  be used at the same time.
* `fstype`: `ext4` or `xfs`. Default: `ext4`. The defined filesystem type must be supported by the host operating system.
* `replication-type`: `none` or `regional-pd`. Default: `none`.
-->
* `type`：`pd-standard` 或者 `pd-ssd`。預設：`pd-standard`
* `zone`(棄用)：GCE 區域。如果沒有指定 `zone` 和 `zones`，通常
  卷會在 Kubernetes 叢集節點所在的活動區域中輪詢排程分配。
  `zone` 和 `zones` 引數不能同時使用。
* `zones`(棄用)：逗號分隔的 GCE 區域列表。如果沒有指定 `zone` 和 `zones`，
  通常卷會在 Kubernetes 叢集節點所在的活動區域中輪詢排程（round-robin）分配。
  `zone` 和 `zones` 引數不能同時使用。
* `fstype`: `ext4` 或 `xfs`。 預設: `ext4`。宿主機作業系統必須支援所定義的檔案系統型別。
* `replication-type`：`none` 或者 `regional-pd`。預設值：`none`。

<!--
If `replication-type` is set to `none`, a regular (zonal) PD will be provisioned.
-->
如果 `replication-type` 設定為 `none`，會製備一個常規（當前區域內的）持久化磁碟。

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
如果 `replication-type` 設定為 `regional-pd`，會製備一個
[區域性持久化磁碟（Regional Persistent Disk）](https://cloud.google.com/compute/docs/disks/#repds)。

強烈建議設定 `volumeBindingMode: WaitForFirstConsumer`，這樣設定後，
當你建立一個 Pod，它使用的 PersistentVolumeClaim 使用了這個 StorageClass，
區域性持久化磁碟會在兩個區域裡製備。 其中一個區域是 Pod 所在區域。
另一個區域是會在叢集管理的區域中任意選擇。磁碟區域可以透過 `allowedTopologies` 加以限制。

<!--
`zone` and `zones` parameters are deprecated and replaced with
[allowedTopologies](#allowed-topologies)
-->
{{< note >}}
`zone` 和 `zones` 已被棄用並被 [allowedTopologies](#allowed-topologies) 取代。
{{< /note >}}

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
-->
* `resturl`：製備 gluster 卷的需求的 Gluster REST 服務/Heketi 服務 url。
  通用格式應該是 `IPaddress:Port`，這是 GlusterFS 動態製備器的必需引數。
  如果 Heketi 服務在 OpenShift/kubernetes 中安裝並暴露為可路由服務，則可以使用類似於
  `http://heketi-storage-project.cloudapps.mystorage.com` 的格式，其中 fqdn 是可解析的 heketi 服務網址。
* `restauthenabled`：Gluster REST 服務身份驗證布林值，用於啟用對 REST 伺服器的身份驗證。
  如果此值為 'true'，則必須填寫 `restuser` 和 `restuserkey` 或 `secretNamespace` + `secretName`。
  此選項已棄用，當在指定 `restuser`、`restuserkey`、`secretName` 或  `secretNamespace` 時，身份驗證被啟用。
* `restuser`：在 Gluster 可信池中有權建立卷的 Gluster REST服務/Heketi 使用者。
* `restuserkey`：Gluster REST 服務/Heketi 使用者的密碼將被用於對 REST 伺服器進行身份驗證。
  此引數已棄用，取而代之的是 `secretNamespace` + `secretName`。

<!--
* `secretNamespace`, `secretName` : Identification of Secret instance that
  contains user password to use when talking to Gluster REST service. These
  parameters are optional, empty password will be used when both
  `secretNamespace` and `secretName` are omitted. The provided secret must have
  type `"kubernetes.io/glusterfs"`, for example created in this way:

    ```
    kubectl create secret generic heketi-secret \
      --type="kubernetes.io/glusterfs" --from-literal=key='opensesame' \
      --namespace=default
    ```

    Example of a secret can be found in
    [glusterfs-provisioning-secret.yaml](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/glusterfs/glusterfs-secret.yaml).
-->
* `secretNamespace`，`secretName`：Secret 例項的標識，包含與 Gluster
  REST 服務互動時使用的使用者密碼。
  這些引數是可選的，`secretNamespace` 和 `secretName` 都省略時使用空密碼。
  所提供的 Secret 必須將型別設定為 "kubernetes.io/glusterfs"，例如以這種方式建立：

    ```
    kubectl create secret generic heketi-secret \
      --type="kubernetes.io/glusterfs" --from-literal=key='opensesame' \
      --namespace=default
    ```

  Secret 的例子可以在 [glusterfs-provisioning-secret.yaml](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/glusterfs/glusterfs-secret.yaml) 中找到。

<!--
* `clusterid`: `630372ccdc720a92c681fb928f27b53f` is the ID of the cluster
  which will be used by Heketi when provisioning the volume. It can also be a
  list of clusterids, for example:
  `"8452344e2becec931ece4e33c4674e4e,42982310de6c63381718ccfa6d8cf397"`. This
  is an optional parameter.
* `gidMin`, `gidMax` : The minimum and maximum value of GID range for the
  StorageClass. A unique value (GID) in this range ( gidMin-gidMax ) will be
  used for dynamically provisioned volumes. These are optional values. If not
  specified, the volume will be provisioned with a value between 2000-2147483647
  which are defaults for gidMin and gidMax respectively.
-->
* `clusterid`：`630372ccdc720a92c681fb928f27b53f` 是叢集的 ID，當製備卷時，
  Heketi 將會使用這個檔案。它也可以是一個 clusterid 列表，例如：
  `"8452344e2becec931ece4e33c4674e4e,42982310de6c63381718ccfa6d8cf397"`。這個是可選引數。
* `gidMin`，`gidMax`：StorageClass GID 範圍的最小值和最大值。
  在此範圍（gidMin-gidMax）內的唯一值（GID）將用於動態製備卷。這些是可選的值。
  如果不指定，所製備的卷為一個 2000-2147483647 之間的值，這是 gidMin 和
  gidMax 的預設值。

<!--
* `volumetype` : The volume type and its parameters can be configured with this
  optional value. If the volume type is not mentioned, it's up to the provisioner
  to decide the volume type.

    For example:
    * Replica volume: `volumetype: replicate:3` where '3' is replica count.
    * Disperse/EC volume: `volumetype: disperse:4:2` where '4' is data and '2' is the redundancy count.
    * Distribute volume: `volumetype: none`

    For available volume types and administration options, refer to the
    [Administration Guide](https://access.redhat.com/documentation/en-US/Red_Hat_Storage/3.1/html/Administration_Guide/part-Overview.html).

    For further reference information, see
    [How to configure Heketi](https://github.com/heketi/heketi/wiki/Setting-up-the-topology).

    When persistent volumes are dynamically provisioned, the Gluster plugin
    automatically creates an endpoint and a headless service in the name
    `gluster-dynamic-<claimname>`. The dynamic endpoint and service are automatically
    deleted when the persistent volume claim is deleted.
-->
* `volumetype`：卷的型別及其引數可以用這個可選值進行配置。如果未宣告卷型別，則
  由製備器決定卷的型別。
  例如：

  * 'Replica volume': `volumetype: replicate:3` 其中 '3' 是 replica 數量.
  * 'Disperse/EC volume': `volumetype: disperse:4:2` 其中 '4' 是資料，'2' 是冗餘數量.
  * 'Distribute volume': `volumetype: none`

  有關可用的卷型別和管理選項，請參閱
  [管理指南](https://access.redhat.com/documentation/en-US/Red_Hat_Storage/3.1/html/Administration_Guide/part-Overview.html)。

  更多相關的參考資訊，請參閱
  [如何配置 Heketi](https://github.com/heketi/heketi/wiki/Setting-up-the-topology)。

  當動態製備持久卷時，Gluster 外掛自動建立名為 `gluster-dynamic-<claimname>`
  的端點和無頭服務。在 PVC 被刪除時動態端點和無頭服務會自動被刪除。

### NFS

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
* `server`: Server is the hostname or IP address of the NFS server.
* `path`: Path that is exported by the NFS server.
* `readOnly`: A flag indicating whether the storage will be mounted as read only (default false).
-->
* `server`：NFS 伺服器的主機名或 IP 地址。
* `path`：NFS 伺服器匯出的路徑。
* `readOnly`：是否將儲存掛載為只讀的標誌（預設為 false）。

<!-- 
Kubernetes doesn't include an internal NFS provisioner. You need to use an external provisioner to create a StorageClass for NFS.
Here are some examples:
* [NFS Ganesha server and external provisioner](https://github.com/kubernetes-sigs/nfs-ganesha-server-and-external-provisioner)
* [NFS subdir external provisioner](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)
-->
Kubernetes 不包含內部 NFS 驅動。你需要使用外部驅動為 NFS 建立 StorageClass。
這裡有些例子：
* [NFS Ganesha 伺服器和外部驅動](https://github.com/kubernetes-sigs/nfs-ganesha-server-and-external-provisioner)
* [NFS subdir 外部驅動](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)


### OpenStack Cinder

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gold
provisioner: kubernetes.io/cinder
parameters:
  availability: nova
```

<!--
* `availability`: Availability Zone. If not specified, volumes are generally
  round-robin-ed across all active zones where Kubernetes cluster has a node.
-->
* `availability`：可用區域。如果沒有指定，通常卷會在 Kubernetes 叢集節點
  所在的活動區域中輪轉排程。

<!--
{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="v1.11" >}}
This internal provisioner of OpenStack is deprecated. Please use [the external cloud provider for OpenStack](https://github.com/kubernetes/cloud-provider-openstack).
{{< /note >}}
 -->
{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="1.11" >}}
OpenStack 的內部驅動已經被棄用。請使用
[OpenStack 的外部雲驅動](https://github.com/kubernetes/cloud-provider-openstack)。
{{< /note >}}

### vSphere

<!--
There are two types of provisioners for vSphere storage classes: 

- [CSI provisioner](#vsphere-provisioner-csi): `csi.vsphere.vmware.com`
- [vCP provisioner](#vcp-provisioner): `kubernetes.io/vsphere-volume`

In-tree provisioners are [deprecated](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/#why-are-we-migrating-in-tree-plugins-to-csi). For more information on the CSI provisioner, see [Kubernetes vSphere CSI Driver](https://vsphere-csi-driver.sigs.k8s.io/) and [vSphereVolume CSI migration](/docs/concepts/storage/volumes/#csi-migration-5).
-->
vSphere 儲存類有兩種製備器

- [CSI 製備器](#vsphere-provisioner-csi): `csi.vsphere.vmware.com`
- [vCP 製備器](#vcp-provisioner): `kubernetes.io/vsphere-volume`

樹內製備器已經被
[棄用](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/#why-are-we-migrating-in-tree-plugins-to-csi)。
更多關於 CSI 製備器的詳情，請參閱 
[Kubernetes vSphere CSI 驅動](https://vsphere-csi-driver.sigs.k8s.io/)
和 [vSphereVolume CSI 遷移](/zh-cn/docs/concepts/storage/volumes/#csi-migration-5)。

<!--
#### CSI Provisioner {#vsphere-provisioner-csi}

The vSphere CSI StorageClass provisioner works with Tanzu Kubernetes clusters. For an example, refer to the [vSphere CSI repository](https://github.com/kubernetes-sigs/vsphere-csi-driver/blob/master/example/vanilla-k8s-RWM-filesystem-volumes/example-sc.yaml).
-->
#### CSI 製備器 {#vsphere-provisioner-csi}

vSphere CSI StorageClass 製備器在 Tanzu Kubernetes 叢集下執行。示例請參
[vSphere CSI 倉庫](https://github.com/kubernetes-sigs/vsphere-csi-driver/blob/master/example/vanilla-k8s-RWM-filesystem-volumes/example-sc.yaml)。

<!--
#### vCP Provisioner 

The following examples use the VMware Cloud Provider (vCP) StorageClass provisioner.  
-->
#### vCP 製備器 {#vcp-provisioner}

以下示例使用 VMware Cloud Provider (vCP) StorageClass 排程器

<!--
1. Create a StorageClass with a user specified disk format.
 -->
1. 使用使用者指定的磁碟格式建立一個 StorageClass。

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
   `diskformat`: `thin`, `zeroedthick` 和 `eagerzeroedthick`。預設值: `"thin"`。

<!--
2. Create a StorageClass with a disk format on a user specified datastore.
-->
2. 在使用者指定的資料儲存上建立磁碟格式的 StorageClass。

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
   The volume will be created on the datastore specified in the storage class,
   which in this case is `VSANDatastore`. This field is optional. If the
   datastore is not specified, then the volume will be created on the datastore
   specified in the vSphere config file used to initialize the vSphere Cloud
   Provider.
   -->

   `datastore`：使用者也可以在 StorageClass 中指定資料儲存。
   卷將在 storage class 中指定的資料儲存上建立，在這種情況下是 `VSANDatastore`。
   該欄位是可選的。
   如果未指定資料儲存，則將在用於初始化 vSphere Cloud Provider 的 vSphere 
   配置檔案中指定的資料儲存上建立該卷。

<!--
3. Storage Policy Management inside kubernetes
-->
3. Kubernetes 中的儲存策略管理

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

    * 使用現有的 vCenter SPBM 策略

      vSphere 用於儲存管理的最重要特性之一是基於策略的管理。
      基於儲存策略的管理（SPBM）是一個儲存策略框架，提供單一的統一控制平面的
      跨越廣泛的資料服務和儲存解決方案。
      SPBM 使能 vSphere 管理員克服先期的儲存配置挑戰，如容量規劃，差異化服務等級和管理容量空間。

      SPBM 策略可以在 StorageClass 中使用 `storagePolicyName` 引數宣告。

    <!--
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
    -->

    * Kubernetes 內的 Virtual SAN 策略支援

      Vsphere Infrastructure（VI）管理員將能夠在動態卷配置期間指定自定義 Virtual SAN
      儲存功能。你現在可以在動態製備卷期間以儲存能力的形式定義儲存需求，例如效能和可用性。
      儲存能力需求會轉換為 Virtual SAN 策略，之後當持久卷（虛擬磁碟）被建立時，
      會將其推送到 Virtual SAN 層。虛擬磁碟分佈在 Virtual SAN 資料儲存中以滿足要求。

      你可以參考[基於儲存策略的動態製備卷管理](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/policy-based-mgmt.html)，
      進一步瞭解有關持久卷管理的儲存策略的詳細資訊。

<!--
There are few
[vSphere examples](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)
which you try out for persistent volume management inside Kubernetes for vSphere.
-->
有幾個 [vSphere 例子](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)
供你在 Kubernetes for vSphere 中嘗試進行持久卷管理。

### Ceph RBD

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
* `monitors`: Ceph monitors, comma delimited. This parameter is required.
* `adminId`: Ceph client ID that is capable of creating images in the pool.
  Default is "admin".
* `adminSecretName`: Secret Name for `adminId`. This parameter is required.
  The provided secret must have type "kubernetes.io/rbd".
* `adminSecretNamespace`: The namespace for `adminSecretName`. Default is "default".
* `pool`: Ceph RBD pool. Default is "rbd".
* `userId`: Ceph client ID that is used to map the RBD image. Default is the
  same as `adminId`.
-->
* `monitors`：Ceph monitor，逗號分隔。該引數是必需的。
* `adminId`：Ceph 客戶端 ID，用於在池 ceph 池中建立映像。預設是 "admin"。
* `adminSecret`：`adminId` 的 Secret 名稱。該引數是必需的。
  提供的 secret 必須有值為 "kubernetes.io/rbd" 的 type 引數。
* `adminSecretNamespace`：`adminSecret` 的名稱空間。預設是 "default"。
* `pool`: Ceph RBD 池. 預設是 "rbd"。
* `userId`：Ceph 客戶端 ID，用於對映 RBD 映象。預設與 `adminId` 相同。

<!--
* `userSecretName`: The name of Ceph Secret for `userId` to map RBD image. It
  must exist in the same namespace as PVCs. This parameter is required.
  The provided secret must have type "kubernetes.io/rbd", e.g. created in this
  way:

    ```shell
    kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" \
      --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' \
      --namespace=kube-system
    ```
-->
* `userSecretName`：用於對映 RBD 映象的 `userId` 的 Ceph Secret 的名字。
  它必須與 PVC 存在於相同的 namespace 中。該引數是必需的。
  提供的 secret 必須具有值為 "kubernetes.io/rbd" 的 type 引數，例如以這樣的方式建立：

    ```shell
    kubectl create secret generic ceph-secret --type="kubernetes.io/rbd" \
      --from-literal=key='QVFEQ1pMdFhPUnQrSmhBQUFYaERWNHJsZ3BsMmNjcDR6RFZST0E9PQ==' \
      --namespace=kube-system
    ```

<!--
* `userSecretNamespace`: The namespace for `userSecretName`.
* `fsType`: fsType that is supported by kubernetes. Default: `"ext4"`.
* `imageFormat`: Ceph RBD image format, "1" or "2". Default is "2".
* `imageFeatures`: This parameter is optional and should only be used if you
  set `imageFormat` to "2". Currently supported features are `layering` only.
  Default is "", and no features are turned on.
-->
* `userSecretNamespace`：`userSecretName` 的名稱空間。
* `fsType`：Kubernetes 支援的 fsType。預設：`"ext4"`。
* `imageFormat`：Ceph RBD 映象格式，"1" 或者 "2"。預設值是 "1"。
* `imageFeatures`：這個引數是可選的，只能在你將 `imageFormat` 設定為 "2" 才使用。
  目前支援的功能只是 `layering`。預設是 ""，沒有功能開啟。

### Quobyte

{{< feature-state for_k8s_version="v1.22" state="deprecated" >}}

<!-- 
The Quobyte in-tree storage plugin is deprecated, an 
[example](https://github.com/quobyte/quobyte-csi/blob/master/example/StorageClass.yaml)
`StorageClass` for the out-of-tree Quobyte plugin can be found at the Quobyte CSI repository.
-->
Quobyte 樹內（in-tree）儲存外掛已棄用，
你可以在 Quobyte CSI 倉庫中找到用於樹外（out-of-tree）Quobyte 外掛的 `StorageClass`
[示例](https://github.com/quobyte/quobyte-csi/blob/master/example/StorageClass.yaml)。

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
* `registry`: Quobyte registry to use to mount the volume. You can specify the
  registry as ``<host>:<port>`` pair or if you want to specify multiple
  registries, put a comma between them.
  ``<host1>:<port>,<host2>:<port>,<host3>:<port>``.
  The host can be an IP address or if you have a working DNS you can also
  provide the DNS names.
* `adminSecretNamespace`: The namespace for `adminSecretName`.
  Default is "default".
-->
* `quobyteAPIServer`：Quobyte API 伺服器的格式是 `"http(s)://api-server:7860"`
* `registry`：用於掛載卷的 Quobyte 倉庫。你可以指定倉庫為 `<host>:<port>`
  或者如果你想指定多個 registry，在它們之間新增逗號，例如
  `<host1>:<port>,<host2>:<port>,<host3>:<port>`。
  主機可以是一個 IP 地址，或者如果你有正在執行的 DNS，你也可以提供 DNS 名稱。
* `adminSecretNamespace`：`adminSecretName` 的名字空間。
  預設值是 "default"。

<!--
* `adminSecretName`: secret that holds information about the Quobyte user and
  the password to authenticate against the API server. The provided secret
  must have type "kubernetes.io/quobyte" and the keys `user` and `password`,
  e.g. created in this way:

    ```shell
    kubectl create secret generic quobyte-admin-secret \
      --type="kubernetes.io/quobyte" --from-literal=user='admin' --from-literal=password='opensesame' \
      --namespace=kube-system
    ```
-->

* `adminSecretName`：儲存關於 Quobyte 使用者和密碼的 Secret，用於對 API 伺服器進行身份驗證。
  提供的 secret 必須有值為 "kubernetes.io/quobyte" 的 type 引數和 `user`
  與 `password` 的鍵值，
  例如以這種方式建立：

  ```shell
  kubectl create secret generic quobyte-admin-secret \
    --type="kubernetes.io/quobyte" --from-literal=key='opensesame' \
    --namespace=kube-system
  ```
<!--
* `user`: maps all access to this user. Default is "root".
* `group`: maps all access to this group. Default is "nfsnobody".
* `quobyteConfig`: use the specified configuration to create the volume. You
  can create a new configuration or modify an existing one with the Web
  console or the quobyte CLI. Default is "BASE".
* `quobyteTenant`: use the specified tenant ID to create/delete the volume.
  This Quobyte tenant has to be already present in Quobyte.
  Default is "DEFAULT".
-->
* `user`：對這個使用者對映的所有訪問許可權。預設是 "root"。
* `group`：對這個組對映的所有訪問許可權。預設是 "nfsnobody"。
* `quobyteConfig`：使用指定的配置來建立卷。你可以建立一個新的配置，
  或者，可以修改 Web 控制檯或 quobyte CLI 中現有的配置。預設是 "BASE"。
* `quobyteTenant`：使用指定的租戶 ID 建立/刪除卷。這個 Quobyte 租戶必須
  已經於 Quobyte 中存在。預設是 "DEFAULT"。

<!--
### Azure Disk
-->
### Azure 磁碟

<!--
#### Azure Unmanaged Disk Storage Class {#azure-disk-storage-class}
-->
#### Azure Unmanaged Disk Storage Class（非託管磁碟儲存類）{#azure-unmanaged-disk-storage-class}

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
* `skuName`：Azure 儲存帳戶 Sku 層。預設為空。
* `location`：Azure 儲存帳戶位置。預設為空。
* `storageAccount`：Azure 儲存帳戶名稱。
  如果提供儲存帳戶，它必須位於與叢集相同的資源組中，並且 `location`
  是被忽略的。如果未提供儲存帳戶，則會在與叢集相同的資源組中建立新的儲存帳戶。

<!--
#### Azure Disk Storage Class (starting from v1.7.2) {#azure-disk-storage-class}
-->
#### Azure 磁碟 Storage Class（從 v1.7.2 開始）{#azure-disk-storage-class}

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: slow
provisioner: kubernetes.io/azure-disk
parameters:
  storageaccounttype: Standard_LRS
  kind: managed
```

<!--
* `storageaccounttype`: Azure storage account Sku tier. Default is empty.
* `kind`: Possible values are `shared`, `dedicated`, and `managed` (default).
  When `kind` is `shared`, all unmanaged disks are created in a few shared
  storage accounts in the same resource group as the cluster. When `kind` is
  `dedicated`, a new dedicated storage account will be created for the new
  unmanaged disk in the same resource group as the cluster. When `kind` is
  `managed`, all managed disks are created in the same resource group as
  the cluster.
* `resourceGroup`: Specify the resource group in which the Azure disk will be created. 
   It must be an existing resource group name. If it is unspecified, the disk will be 
   placed in the same resource group as the current Kubernetes cluster.
-->
* `storageaccounttype`：Azure 儲存帳戶 Sku 層。預設為空。
* `kind`：可能的值是 `shared`、`dedicated` 和 `managed`（預設）。
  當 `kind` 的值是 `shared` 時，所有非託管磁碟都在叢集的同一個資源組中的幾個共享儲存帳戶中建立。
  當 `kind` 的值是 `dedicated` 時，將為在叢集的同一個資源組中新的非託管磁碟建立新的專用儲存帳戶。
* `resourceGroup`: 指定要建立 Azure 磁碟所屬的資源組。必須是已存在的資源組名稱。
  若未指定資源組，磁碟會預設放入與當前 Kubernetes 叢集相同的資源組中。
<!--
- Premium VM can attach both Standard_LRS and Premium_LRS disks, while Standard
  VM can only attach Standard_LRS disks.
- Managed VM can only attach managed disks and unmanaged VM can only attach
  unmanaged disks.
-->
- Premium VM 可以同時新增 Standard_LRS 和 Premium_LRS 磁碟，而 Standard
  虛擬機器只能新增 Standard_LRS 磁碟。
- 託管虛擬機器只能連線託管磁碟，非託管虛擬機器只能連線非託管磁碟。

<!--
### Azure File
-->
### Azure 檔案

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
* `location`: Azure storage account location. Default is empty.
* `storageAccount`: Azure storage account name.  Default is empty. If a storage
  account is not provided, all storage accounts associated with the resource
  group are searched to find one that matches `skuName` and `location`. If a
  storage account is provided, it must reside in the same resource group as the
  cluster, and `skuName` and `location` are ignored.
* `secretNamespace`: the namespace of the secret that contains the Azure Storage
  Account Name and Key. Default is the same as the Pod.
* `secretName`: the name of the secret that contains the Azure Storage Account Name and
  Key. Default is `azure-storage-account-<accountName>-secret`
* `readOnly`: a flag indicating whether the storage will be mounted as read only.
  Defaults to false which means a read/write mount. This setting will impact the
  `ReadOnly` setting in VolumeMounts as well.
-->
* `skuName`：Azure 儲存帳戶 Sku 層。預設為空。
* `location`：Azure 儲存帳戶位置。預設為空。
* `storageAccount`：Azure 儲存帳戶名稱。預設為空。
  如果不提供儲存帳戶，會搜尋所有與資源相關的儲存帳戶，以找到一個匹配
  `skuName` 和 `location` 的賬號。
  如果提供儲存帳戶，它必須存在於與叢集相同的資源組中，`skuName` 和 `location` 會被忽略。
* `secretNamespace`：包含 Azure 儲存帳戶名稱和金鑰的金鑰的名稱空間。
  預設值與 Pod 相同。
* `secretName`：包含 Azure 儲存帳戶名稱和金鑰的金鑰的名稱。
  預設值為 `azure-storage-account-<accountName>-secret`
* `readOnly`：指示是否將儲存安裝為只讀的標誌。預設為 false，表示"讀/寫"掛載。
  該設定也會影響VolumeMounts中的 `ReadOnly` 設定。

<!--
During storage provisioning, a secret named by `secretName` is created for the
mounting credentials. If the cluster has enabled both
[RBAC](/docs/reference/access-authn-authz/rbac/) and
[Controller Roles](/docs/reference/access-authn-authz/rbac/#controller-roles),
add the `create` permission of resource `secret` for clusterrole
`system:controller:persistent-volume-binder`.
-->
在儲存製備期間，為掛載憑證建立一個名為 `secretName` 的 Secret。如果叢集同時啟用了
[RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 和
[控制器角色](/zh-cn/docs/reference/access-authn-authz/rbac/#controller-roles)，
為 `system:controller:persistent-volume-binder` 的 clusterrole 新增
`Secret` 資源的 `create` 許可權。

<!--
In a multi-tenancy context, it is strongly recommended to set the value for
`secretNamespace` explicitly, otherwise the storage account credentials may
be read by other users.
-->
在多租戶上下文中，強烈建議顯式設定 `secretNamespace` 的值，否則
其他使用者可能會讀取儲存帳戶憑據。

<!--
### Portworx Volume
 -->
### Portworx 卷

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: portworx-io-priority-high
provisioner: kubernetes.io/portworx-volume
parameters:
  repl: "1"
  snap_interval:   "70"
  priority_io:  "high"

```

<!--
* `fs`: filesystem to be laid out: `none/xfs/ext4` (default: `ext4`).
* `block_size`: block size in Kbytes (default: `32`).
* `repl`: number of synchronous replicas to be provided in the form of
  replication factor `1..3` (default: `1`) A string is expected here i.e.
  `"1"` and not `1`.
* `priority_io`: determines whether the volume will be created from higher
  performance or a lower priority storage `high/medium/low` (default: `low`).
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
  to false, `true/false` (default `false`). A string is expected here i.e.
  `"true"` and not `true`.
-->
* `fs`：選擇的檔案系統：`none/xfs/ext4`（預設：`ext4`）。
* `block_size`：以 Kbytes 為單位的塊大小（預設值：`32`）。
* `repl`：同步副本數量，以複製因子 `1..3`（預設值：`1`）的形式提供。
  這裡需要填寫字串，即，`"1"` 而不是 `1`。
* `io_priority`：決定是否從更高效能或者較低優先順序儲存建立卷
  `high/medium/low`（預設值：`low`）。
* `snap_interval`：觸發快照的時鐘/時間間隔（分鐘）。
  快照是基於與先前快照的增量變化，0 是禁用快照（預設：`0`）。
  這裡需要填寫字串，即，是 `"70"` 而不是 `70`。
* `aggregation_level`：指定卷分配到的塊數量，0 表示一個非聚合卷（預設：`0`）。
  這裡需要填寫字串，即，是 `"0"` 而不是 `0`。
* `ephemeral`：指定卷在解除安裝後進行清理還是持久化。
  `emptyDir` 的使用場景可以將這個值設定為 true ，
  `persistent volumes` 的使用場景可以將這個值設定為 false
  （例如 Cassandra 這樣的資料庫）
  `true/false`（預設為 `false`）。這裡需要填寫字串，即，
  是 `"true"` 而不是 `true`。

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
  readOnly: "false"
  fsType: xfs
```

<!--
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
-->
* `provisioner`：屬性設定為 `kubernetes.io/scaleio`
* `gateway` 到 ScaleIO API 閘道器的地址（必需）
* `system`：ScaleIO 系統的名稱（必需）
* `protectionDomain`：ScaleIO 保護域的名稱（必需）
* `storagePool`：卷儲存池的名稱（必需）
* `storageMode`：儲存提供模式：`ThinProvisioned`（預設）或 `ThickProvisioned`
* `secretRef`：對已配置的 Secret 物件的引用（必需）
* `readOnly`：指定掛載卷的訪問模式（預設為 false）
* `fsType`：卷的檔案系統（預設是 ext4）

<!--
The ScaleIO Kubernetes volume plugin requires a configured Secret object.
The secret must be created with type `kubernetes.io/scaleio` and use the same
namespace value as that of the PVC where it is referenced
as shown in the following command:

```shell
kubectl create secret generic sio-secret --type="kubernetes.io/scaleio" \
--from-literal=username=sioadmin --from-literal=password=d2NABDNjMA== \
--namespace=default
```
-->
ScaleIO Kubernetes 卷外掛需要配置一個 Secret 物件。
Secret 必須用 `kubernetes.io/scaleio` 型別建立，並與引用它的
PVC 所屬的名稱空間使用相同的值。如下面的命令所示：

```shell
kubectl create secret generic sio-secret --type="kubernetes.io/scaleio" \
  --from-literal=username=sioadmin --from-literal=password=d2NABDNjMA== \
  --namespace=default
```

### StorageOS

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
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
-->
* `pool`：製備卷的 StorageOS 分散式容量池的名稱。如果未指定，則使用
  通常存在的 `default` 池。
* `description`：指定給動態建立的卷的描述。所有卷描述對於儲存類而言都是相同的，
  但不同的 storage class 可以使用不同的描述，以區分不同的使用場景。
  預設為 `Kubernetes volume`。
* `fsType`：請求的預設檔案系統型別。
  請注意，在 StorageOS 中使用者定義的規則可以覆蓋此值。預設為 `ext4`
* `adminSecretNamespace`：API 配置 secret 所在的名稱空間。
  如果設定了 adminSecretName，則是必需的。
* `adminSecretName`：用於獲取 StorageOS API 憑證的 secret 名稱。
  如果未指定，則將嘗試預設值。

<!--
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
-->
StorageOS Kubernetes 卷外掛可以使 Secret 物件來指定用於訪問 StorageOS API 的端點和憑據。
只有當預設值已被更改時，這才是必須的。
Secret 必須使用 `kubernetes.io/storageos` 型別建立，如以下命令：

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
用於動態製備卷的 Secret 可以在任何名稱空間中建立，並透過
`adminSecretNamespace` 引數引用。
預先配置的卷使用的 Secret 必須在與引用它的 PVC 在相同的名稱空間中。

<!--
### Local
-->
### 本地

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

<!--
Local volumes do not currently support dynamic provisioning, however a StorageClass
should still be created to delay volume binding until pod scheduling. This is
specified by the `WaitForFirstConsumer` volume binding mode.
-->
本地卷還不支援動態製備，然而還是需要建立 StorageClass 以延遲卷繫結，
直到完成 Pod 的排程。這是由 `WaitForFirstConsumer` 卷繫結模式指定的。

<!--
Delaying volume binding allows the scheduler to consider all of a pod's
scheduling constraints when choosing an appropriate PersistentVolume for a
PersistentVolumeClaim.
-->
延遲卷繫結使得排程器在為 PersistentVolumeClaim 選擇一個合適的
PersistentVolume 時能考慮到所有 Pod 的排程限制。
