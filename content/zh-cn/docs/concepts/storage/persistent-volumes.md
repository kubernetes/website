---
title: 持久卷
api_metadata:
- apiVersion: "v1"
  kind: "PersistentVolume"
feature:
  title: 存储编排
  description: >
    自动挂载所选存储系统，包括本地存储、公有云提供商所提供的存储或者诸如 iSCSI 或 NFS 这类网络存储系统。
content_type: concept
weight: 20
---
<!--
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
- xing-yang
title: Persistent Volumes
api_metadata:
- apiVersion: "v1"
  kind: "PersistentVolume"
feature:
  title: Storage orchestration
  description: >
    Automatically mount the storage system of your choice, whether from local storage, a public cloud provider, or a network storage system such as iSCSI or NFS.
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
This document describes _persistent volumes_ in Kubernetes. Familiarity with
[volumes](/docs/concepts/storage/volumes/), [StorageClasses](/docs/concepts/storage/storage-classes/)
and [VolumeAttributesClasses](/docs/concepts/storage/volume-attributes-classes/) is suggested.
-->
本文描述 Kubernetes 中的**持久卷（Persistent Volumes）**。
建议先熟悉[卷（volume）](/zh-ch/docs/concepts/storage/volumes/)、
[存储类（StorageClass）](/zh-cn/docs/concepts/storage/storage-classes/)和
[卷属性类（VolumeAttributesClass）](/zh-cn/docs/concepts/storage/volume-attributes-classes/)。

<!-- body -->

<!--
## Introduction

Managing storage is a distinct problem from managing compute instances.
The PersistentVolume subsystem provides an API for users and administrators
that abstracts details of how storage is provided from how it is consumed.
To do this, we introduce two new API resources: PersistentVolume and PersistentVolumeClaim.
-->
## 介绍  {#introduction}

存储的管理是一个与计算实例的管理完全不同的问题。
PersistentVolume 子系统为用户和管理员提供了一组 API，
将存储如何制备的细节从其如何被使用中抽象出来。
为了实现这点，我们引入了两个新的 API 资源：PersistentVolume 和
PersistentVolumeClaim。

<!--
A _PersistentVolume_ (PV) is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using [Storage Classes](/docs/concepts/storage/storage-classes/). It is a resource in the cluster just like a node is a cluster resource. PVs are volume plugins like Volumes, but have a lifecycle independent of any individual Pod that uses the PV. This API object captures the details of the implementation of the storage, be that NFS, iSCSI, or a cloud-provider-specific storage system.
-->
**持久卷（PersistentVolume，PV）** 是集群中的一块存储，可以由管理员事先制备，
或者使用[存储类（Storage Class）](/zh-cn/docs/concepts/storage/storage-classes/)来动态制备。
持久卷是集群资源，就像节点也是集群资源一样。PV 持久卷和普通的 Volume 一样，
也是使用卷插件来实现的，只是它们拥有独立于任何使用 PV 的 Pod 的生命周期。
此 API 对象中记述了存储的实现细节，无论其背后是 NFS、iSCSI 还是特定于云平台的存储系统。

<!--
A _PersistentVolumeClaim_ (PVC) is a request for storage by a user. It is similar
to a Pod. Pods consume node resources and PVCs consume PV resources. Pods can
request specific levels of resources (CPU and Memory). Claims can request specific
size and access modes (e.g., they can be mounted ReadWriteOnce, ReadOnlyMany,
ReadWriteMany, or ReadWriteOncePod, see [AccessModes](#access-modes)).
-->
**持久卷申领（PersistentVolumeClaim，PVC）** 表达的是用户对存储的请求。概念上与 Pod 类似。
Pod 会耗用节点资源，而 PVC 申领会耗用 PV 资源。Pod 可以请求特定数量的资源（CPU
和内存）。同样 PVC 申领也可以请求特定的大小和访问模式
（例如，可以挂载为 ReadWriteOnce、ReadOnlyMany、ReadWriteMany 或 ReadWriteOncePod，
请参阅[访问模式](#access-modes)）。

<!--
While PersistentVolumeClaims allow a user to consume abstract storage resources,
it is common that users need PersistentVolumes with varying properties, such as
performance, for different problems. Cluster administrators need to be able to
offer a variety of PersistentVolumes that differ in more ways than size and access
modes, without exposing users to the details of how those volumes are implemented.
For these needs, there is the _StorageClass_ resource.

See the [detailed walkthrough with working examples](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).
-->
尽管 PersistentVolumeClaim 允许用户消耗抽象的存储资源，
常见的情况是针对不同的问题用户需要的是具有不同属性（如，性能）的 PersistentVolume 卷。
集群管理员需要能够提供不同性质的 PersistentVolume，
并且这些 PV 卷之间的差别不仅限于卷大小和访问模式，同时又不能将卷是如何实现的这些细节暴露给用户。
为了满足这类需求，就有了**存储类（StorageClass）** 资源。

参见[基于运行示例的详细演练](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)。

<!--
## Lifecycle of a volume and claim

PVs are resources in the cluster. PVCs are requests for those resources and also act
as claim checks to the resource. The interaction between PVs and PVCs follows this lifecycle:

### Provisioning

There are two ways PVs may be provisioned: statically or dynamically.
-->
## 卷和申领的生命周期   {#lifecycle-of-a-volume-and-claim}

PV 卷是集群中的资源。PVC 申领是对这些资源的请求，也被用来执行对资源的申领检查。
PV 卷和 PVC 申领之间的互动遵循如下生命周期：

### 制备   {#provisioning}

PV 卷的制备有两种方式：静态制备或动态制备。

<!--
#### Static

A cluster administrator creates a number of PVs. They carry the details of the
real storage, which is available for use by cluster users. They exist in the
Kubernetes API and are available for consumption.
-->
#### 静态制备  {#static}

集群管理员创建若干 PV 卷。这些卷对象带有真实存储的细节信息，
并且对集群用户可用（可见）。PV 卷对象存在于 Kubernetes API 中，可供用户消费（使用）。

<!--
#### Dynamic

When none of the static PVs the administrator created match a user's PersistentVolumeClaim,
the cluster may try to dynamically provision a volume specially for the PVC.
This provisioning is based on StorageClasses: the PVC must request a
[storage class](/docs/concepts/storage/storage-classes/) and
the administrator must have created and configured that class for dynamic
provisioning to occur. Claims that request the class `""` effectively disable
dynamic provisioning for themselves.
-->
#### 动态制备     {#dynamic}

如果管理员所创建的所有静态 PV 卷都无法与用户的 PersistentVolumeClaim 匹配，
集群可以尝试为该 PVC 申领动态制备一个存储卷。
这一制备操作是基于 StorageClass 来实现的：PVC 申领必须请求某个
[存储类](/zh-cn/docs/concepts/storage/storage-classes/)，
同时集群管理员必须已经创建并配置了该类，这样动态制备卷的动作才会发生。
如果 PVC 申领指定存储类为 `""`，则相当于为自身禁止使用动态制备的卷。

<!--
To enable dynamic storage provisioning based on storage class, the cluster administrator
needs to enable the `DefaultStorageClass`
[admission controller](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
on the API server. This can be done, for example, by ensuring that `DefaultStorageClass` is
among the comma-delimited, ordered list of values for the `--enable-admission-plugins` flag of
the API server component. For more information on API server command-line flags,
check [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) documentation.
-->
为了基于存储类完成动态的存储制备，集群管理员需要在 API 服务器上启用 `DefaultStorageClass`
[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)。
举例而言，可以通过保证 `DefaultStorageClass` 出现在 API 服务器组件的
`--enable-admission-plugins` 标志值中实现这点；该标志的值可以是逗号分隔的有序列表。
关于 API 服务器标志的更多信息，可以参考
[kube-apiserver](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)
文档。

<!--
### Binding

A user creates, or in the case of dynamic provisioning, has already created,
a PersistentVolumeClaim with a specific amount of storage requested and with
certain access modes. A control loop in the control plane watches for new PVCs, finds
a matching PV (if possible), and binds them together. If a PV was dynamically
provisioned for a new PVC, the loop will always bind that PV to the PVC. Otherwise,
the user will always get at least what they asked for, but the volume may be in
excess of what was requested. Once bound, PersistentVolumeClaim binds are exclusive,
regardless of how they were bound. A PVC to PV binding is a one-to-one mapping,
using a ClaimRef which is a bi-directional binding between the PersistentVolume
and the PersistentVolumeClaim.
-->
### 绑定     {#binding}

用户创建一个带有特定存储容量和特定访问模式需求的 PersistentVolumeClaim 对象；
在动态制备场景下，这个 PVC 对象可能已经创建完毕。
控制平面中的控制回路监测新的 PVC 对象，寻找与之匹配的 PV 卷（如果可能的话），
并将二者绑定到一起。
如果为了新的 PVC 申领动态制备了 PV 卷，则控制回路总是将该 PV 卷绑定到这一 PVC 申领。
否则，用户总是能够获得他们所请求的资源，只是所获得的 PV 卷可能会超出所请求的配置。
一旦绑定关系建立，则 PersistentVolumeClaim 绑定就是排他性的，
无论该 PVC 申领是如何与 PV 卷建立的绑定关系。
PVC 申领与 PV 卷之间的绑定是一种一对一的映射，实现上使用 ClaimRef 来记述
PV 卷与 PVC 申领间的双向绑定关系。

<!--
Claims will remain unbound indefinitely if a matching volume does not exist.
Claims will be bound as matching volumes become available. For example, a
cluster provisioned with many 50Gi PVs would not match a PVC requesting 100Gi.
The PVC can be bound when a 100Gi PV is added to the cluster.
-->
如果找不到匹配的 PV 卷，PVC 申领会无限期地处于未绑定状态。
当与之匹配的 PV 卷可用时，PVC 申领会被绑定。
例如，即使某集群上制备了很多 50 Gi 大小的 PV 卷，也无法与请求
100 Gi 大小的存储的 PVC 匹配。当新的 100 Gi PV 卷被加入到集群时，
该 PVC 才有可能被绑定。

<!--
### Using

Pods use claims as volumes. The cluster inspects the claim to find the bound
volume and mounts that volume for a Pod. For volumes that support multiple
access modes, the user specifies which mode is desired when using their claim
as a volume in a Pod.
-->
### 使用    {#using}

Pod 将 PVC 申领当做存储卷来使用。集群会检视 PVC 申领，找到所绑定的卷，
并为 Pod 挂载该卷。对于支持多种访问模式的卷，
用户要在 Pod 中以卷的形式使用申领时指定期望的访问模式。

<!--
Once a user has a claim and that claim is bound, the bound PV belongs to the
user for as long as they need it. Users schedule Pods and access their claimed
PVs by including a `persistentVolumeClaim` section in a Pod's `volumes` block.
See [Claims As Volumes](#claims-as-volumes) for more details on this.
-->
一旦用户有了申领对象并且该申领已经被绑定，
则所绑定的 PV 卷在用户仍然需要它期间一直属于该用户。
用户通过在 Pod 的 `volumes` 块中包含 `persistentVolumeClaim`
节区来调度 Pod，访问所申领的 PV 卷。
相关细节可参阅[使用申领作为卷](#claims-as-volumes)。

<!--
### Storage Object in Use Protection

The purpose of the Storage Object in Use Protection feature is to ensure that
PersistentVolumeClaims (PVCs) in active use by a Pod and PersistentVolume (PVs)
that are bound to PVCs are not removed from the system, as this may result in data loss.
-->
### 保护使用中的存储对象   {#storage-object-in-use-protection}

保护使用中的存储对象（Storage Object in Use Protection）
这一功能特性的目的是确保仍被 Pod 使用的 PersistentVolumeClaim（PVC）
对象及其所绑定的 PersistentVolume（PV）对象在系统中不会被删除，因为这样做可能会引起数据丢失。

{{< note >}}
<!--
PVC is in active use by a Pod when a Pod object exists that is using the PVC.
-->
当使用某 PVC 的 Pod 对象仍然存在时，认为该 PVC 仍被此 Pod 使用。
{{< /note >}}

<!--
If a user deletes a PVC in active use by a Pod, the PVC is not removed immediately.
PVC removal is postponed until the PVC is no longer actively used by any Pods. Also,
if an admin deletes a PV that is bound to a PVC, the PV is not removed immediately.
PV removal is postponed until the PV is no longer bound to a PVC.

You can see that a PVC is protected when the PVC's status is `Terminating` and the
`Finalizers` list includes `kubernetes.io/pvc-protection`:
-->
如果用户删除被某 Pod 使用的 PVC 对象，该 PVC 申领不会被立即移除。
PVC 对象的移除会被推迟，直至其不再被任何 Pod 使用。
此外，如果管理员删除已绑定到某 PVC 申领的 PV 卷，该 PV 卷也不会被立即移除。
PV 对象的移除也要推迟到该 PV 不再绑定到 PVC。

你可以看到当 PVC 的状态为 `Terminating` 且其 `Finalizers` 列表中包含
`kubernetes.io/pvc-protection` 时，PVC 对象是处于被保护状态的。

```shell
kubectl describe pvc hostpath
```

```
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
You can see that a PV is protected when the PV's status is `Terminating` and
the `Finalizers` list includes `kubernetes.io/pv-protection` too:
-->
你也可以看到当 PV 对象的状态为 `Terminating` 且其 `Finalizers` 列表中包含
`kubernetes.io/pv-protection` 时，PV 对象是处于被保护状态的。

```shell
kubectl describe pv task-pv-volume
```

```
Name:            task-pv-volume
Labels:          type=local
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    standard
Status:          Terminating
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

<!--
### Reclaiming

When a user is done with their volume, they can delete the PVC objects from the
API that allows reclamation of the resource. The reclaim policy for a PersistentVolume
tells the cluster what to do with the volume after it has been released of its claim.
Currently, volumes can either be Retained, Recycled, or Deleted.
-->
### 回收（Reclaiming）   {#reclaiming}

当用户不再使用其存储卷时，他们可以从 API 中将 PVC 对象删除，
从而允许该资源被回收再利用。PersistentVolume 对象的回收策略告诉集群，
当其被从申领中释放时如何处理该数据卷。
目前，数据卷可以被 Retained（保留）、Recycled（回收）或 Deleted（删除）。

<!--
#### Retain

The `Retain` reclaim policy allows for manual reclamation of the resource.
When the PersistentVolumeClaim is deleted, the PersistentVolume still exists
and the volume is considered "released". But it is not yet available for
another claim because the previous claimant's data remains on the volume.
An administrator can manually reclaim the volume with the following steps.
-->
#### 保留（Retain）    {#retain}

回收策略 `Retain` 使得用户可以手动回收资源。当 PersistentVolumeClaim
对象被删除时，PersistentVolume 卷仍然存在，对应的数据卷被视为"已释放（released）"。
由于卷上仍然存在这前一申领人的数据，该卷还不能用于其他申领。
管理员可以通过下面的步骤来手动回收该卷：

<!--
1. Delete the PersistentVolume. The associated storage asset in external infrastructure
   still exists after the PV is deleted.
1. Manually clean up the data on the associated storage asset accordingly.
1. Manually delete the associated storage asset.

If you want to reuse the same storage asset, create a new PersistentVolume with
the same storage asset definition.
-->
1. 删除 PersistentVolume 对象。与之相关的、位于外部基础设施中的存储资产在
   PV 删除之后仍然存在。
1. 根据情况，手动清除所关联的存储资产上的数据。
1. 手动删除所关联的存储资产。

如果你希望重用该存储资产，可以基于存储资产的定义创建新的 PersistentVolume 卷对象。

<!--
#### Delete

For volume plugins that support the `Delete` reclaim policy, deletion removes
both the PersistentVolume object from Kubernetes, as well as the associated
storage asset in the external infrastructure. Volumes that were dynamically provisioned
inherit the [reclaim policy of their StorageClass](#reclaim-policy), which
defaults to `Delete`. The administrator should configure the StorageClass
according to users' expectations; otherwise, the PV must be edited or
patched after it is created. See
[Change the Reclaim Policy of a PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).
-->
#### 删除（Delete）    {#delete}

对于支持 `Delete` 回收策略的卷插件，删除动作会将 PersistentVolume 对象从
Kubernetes 中移除，同时也会从外部基础设施中移除所关联的存储资产。
动态制备的卷会继承[其 StorageClass 中设置的回收策略](#reclaim-policy)，
该策略默认为 `Delete`。管理员需要根据用户的期望来配置 StorageClass；
否则 PV 卷被创建之后必须要被编辑或者修补。
参阅[更改 PV 卷的回收策略](/zh-cn/docs/tasks/administer-cluster/change-pv-reclaim-policy/)。

<!--
#### Recycle
-->
#### 回收（Recycle）     {#recycle}

{{< warning >}}
<!--
The `Recycle` reclaim policy is deprecated. Instead, the recommended approach
is to use dynamic provisioning.
-->
回收策略 `Recycle` 已被废弃。取而代之的建议方案是使用动态制备。
{{< /warning >}}

<!--
If supported by the underlying volume plugin, the `Recycle` reclaim policy performs
a basic scrub (`rm -rf /thevolume/*`) on the volume and makes it available again for a new claim.
-->
如果下层的卷插件支持，回收策略 `Recycle` 会在卷上执行一些基本的擦除
（`rm -rf /thevolume/*`）操作，之后允许该卷用于新的 PVC 申领。

<!--
However, an administrator can configure a custom recycler Pod template using
the Kubernetes controller manager command line arguments as described in the
[reference](/docs/reference/command-line-tools-reference/kube-controller-manager/).
The custom recycler Pod template must contain a `volumes` specification, as
shown in the example below:
-->
不过，管理员可以按[参考资料](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)中所述，
使用 Kubernetes 控制器管理器命令行参数来配置一个定制的回收器（Recycler）
Pod 模板。此定制的回收器 Pod 模板必须包含一个 `volumes` 规约，如下例所示：

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
    image: "registry.k8s.io/busybox"
    command: ["/bin/sh", "-c", "test -e /scrub && rm -rf /scrub/..?* /scrub/.[!.]* /scrub/*  && test -z \"$(ls -A /scrub)\" || exit 1"]
    volumeMounts:
    - name: vol
      mountPath: /scrub
```

<!--
However, the particular path specified in the custom recycler Pod template in the
`volumes` part is replaced with the particular path of the volume that is being recycled.
-->
定制回收器 Pod 模板中在 `volumes` 部分所指定的特定路径要替换为正被回收的卷的路径。

<!--
### PersistentVolume deletion protection finalizer
-->
### PersistentVolume 删除保护 finalizer  {#persistentvolume-deletion-protection-finalizer}

{{< feature-state feature_gate_name="HonorPVReclaimPolicy" >}}

<!--
Finalizers can be added on a PersistentVolume to ensure that PersistentVolumes
having `Delete` reclaim policy are deleted only after the backing storage are deleted.
-->
可以在 PersistentVolume 上添加终结器（Finalizer），
以确保只有在删除对应的存储后才删除具有 `Delete` 回收策略的 PersistentVolume。

<!--
The finalizer `external-provisioner.volume.kubernetes.io/finalizer`(introduced
in  v1.31) is added to both dynamically provisioned and statically provisioned
CSI volumes.

The finalizer `kubernetes.io/pv-controller`(introduced in v1.31) is added to 
dynamically provisioned in-tree plugin volumes and skipped for statically 
provisioned in-tree plugin volumes.

The following is an example of dynamically provisioned in-tree plugin volume:
-->
（在 v1.31 中引入的）终结器 `external-provisioner.volume.kubernetes.io/finalizer`
被同时添加到动态制备和静态制备的 CSI 卷上。

（在 v1.31 中引入的）终结器 `kubernetes.io/pv-controller`
被添加到动态制备的树内插件卷上，而对于静态制备的树内插件卷，此终结器将被忽略。

以下是动态制备的树内插件卷的示例：

```shell
kubectl describe pv pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
```

```none
Name:            pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
Labels:          <none>
Annotations:     kubernetes.io/createdby: vsphere-volume-dynamic-provisioner
                 pv.kubernetes.io/bound-by-controller: yes
                 pv.kubernetes.io/provisioned-by: kubernetes.io/vsphere-volume
Finalizers:      [kubernetes.io/pv-protection kubernetes.io/pv-controller]
StorageClass:    vcp-sc
Status:          Bound
Claim:           default/vcp-pvc-1
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        1Gi
Node Affinity:   <none>
Message:
Source:
    Type:               vSphereVolume (a Persistent Disk resource in vSphere)
    VolumePath:         [vsanDatastore] d49c4a62-166f-ce12-c464-020077ba5d46/kubernetes-dynamic-pvc-74a498d6-3929-47e8-8c02-078c1ece4d78.vmdk
    FSType:             ext4
    StoragePolicyName:  vSAN Default Storage Policy
Events:                 <none>
```

<!--
The finalizer `external-provisioner.volume.kubernetes.io/finalizer` is added for CSI volumes.
The following is an example:
-->
终结器 `external-provisioner.volume.kubernetes.io/finalizer` 会被添加到 CSI 卷上。下面是一个例子：

```none
Name:            pvc-2f0bab97-85a8-4552-8044-eb8be45cf48d
Labels:          <none>
Annotations:     pv.kubernetes.io/provisioned-by: csi.vsphere.vmware.com
Finalizers:      [kubernetes.io/pv-protection external-provisioner.volume.kubernetes.io/finalizer]
StorageClass:    fast
Status:          Bound
Claim:           demo-app/nginx-logs
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        200Mi
Node Affinity:   <none>
Message:
Source:
    Type:              CSI (a Container Storage Interface (CSI) volume source)
    Driver:            csi.vsphere.vmware.com
    FSType:            ext4
    VolumeHandle:      44830fa8-79b4-406b-8b58-621ba25353fd
    ReadOnly:          false
    VolumeAttributes:      storage.kubernetes.io/csiProvisionerIdentity=1648442357185-8081-csi.vsphere.vmware.com
                           type=vSphere CNS Block Volume
Events:                <none>
```

<!--
When the `CSIMigration{provider}` feature flag is enabled for a specific in-tree volume plugin,
the `kubernetes.io/pv-controller` finalizer is replaced by the
`external-provisioner.volume.kubernetes.io/finalizer` finalizer.
-->
当为特定的树内卷插件启用了 `CSIMigration{provider}` 特性标志时，`kubernetes.io/pv-controller`
终结器将被替换为 `external-provisioner.volume.kubernetes.io/finalizer` 终结器。

<!--
The finalizers ensure that the PV object is removed only after the volume is deleted
from the storage backend provided the reclaim policy of the PV is `Delete`. This
also ensures that the volume is deleted from storage backend irrespective of the
order of deletion of PV and PVC.
-->
这些终结器确保只有在从存储后端删除卷后，PV 对象才会被移除，
前提是 PV 的回收策略为 `Delete`。
这也确保了无论 PV 和 PVC 的删除顺序如何，此卷都会从存储后端被删除。

<!--
### Reserving a PersistentVolume

The control plane can [bind PersistentVolumeClaims to matching PersistentVolumes](#binding)
in the cluster. However, if you want a PVC to bind to a specific PV, you need to pre-bind them.
-->
### 预留 PersistentVolume  {#reserving-a-persistentvolume}

控制平面可以在集群中[将 PersistentVolumeClaims 绑定到匹配的 PersistentVolumes](#binding)。
但是，如果你希望 PVC 绑定到特定 PV，则需要预先绑定它们。

<!--
By specifying a PersistentVolume in a PersistentVolumeClaim, you declare a binding
between that specific PV and PVC. If the PersistentVolume exists and has not reserved
PersistentVolumeClaims through its `claimRef` field, then the PersistentVolume and
PersistentVolumeClaim will be bound.
-->
通过在 PersistentVolumeClaim 中指定 PersistentVolume，你可以声明该特定
PV 与 PVC 之间的绑定关系。如果该 PersistentVolume 存在且未被通过其
`claimRef` 字段预留给 PersistentVolumeClaim，则该 PersistentVolume
会和该 PersistentVolumeClaim 绑定到一起。

<!--
The binding happens regardless of some volume matching criteria, including node affinity.
The control plane still checks that [storage class](/docs/concepts/storage/storage-classes/),
access modes, and requested storage size are valid.
-->
绑定操作不会考虑某些卷匹配条件是否满足，包括节点亲和性等等。
控制面仍然会检查[存储类](/zh-cn/docs/concepts/storage/storage-classes/)、
访问模式和所请求的存储尺寸都是合法的。

<!--
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: foo
spec:
  storageClassName: "" # Empty string must be explicitly set otherwise default StorageClass will be set
  volumeName: foo-pv
  ...
```
-->
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: foo
spec:
  storageClassName: "" # 此处须显式设置空字符串，否则会被设置为默认的 StorageClass
  volumeName: foo-pv
  ...
```

<!--
This method does not guarantee any binding privileges to the PersistentVolume.
If other PersistentVolumeClaims could use the PV that you specify, you first
need to reserve that storage volume. Specify the relevant PersistentVolumeClaim
in the `claimRef` field of the PV so that other PVCs can not bind to it.
-->
此方法无法对 PersistentVolume 的绑定特权做出任何形式的保证。
如果有其他 PersistentVolumeClaim 可以使用你所指定的 PV，
则你应该首先预留该存储卷。你可以将 PV 的 `claimRef` 字段设置为相关的
PersistentVolumeClaim 以确保其他 PVC 不会绑定到该 PV 卷。

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: foo-pv
spec:
  storageClassName: ""
  claimRef:
    name: foo-pvc
    namespace: foo
  ...
```

<!--
This is useful if you want to consume PersistentVolumes that have their `persistentVolumeReclaimPolicy` set
to `Retain`, including cases where you are reusing an existing PV.
-->
如果你想要使用 `persistentVolumeReclaimPolicy` 属性设置为 `Retain` 的 PersistentVolume 卷时，
包括你希望复用现有的 PV 卷时，这点是很有用的

<!--
### Expanding Persistent Volumes Claims
-->
### 扩充 PVC 申领   {#expanding-persistent-volumes-claims}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
Support for expanding PersistentVolumeClaims (PVCs) is enabled by default. You can expand
the following types of volumes:
-->
现在，对扩充 PVC 申领的支持默认处于被启用状态。你可以扩充以下类型的卷：

<!--
* azureFile (deprecated)
* {{< glossary_tooltip text="csi" term_id="csi" >}}
* flexVolume (deprecated)
* rbd (deprecated)
* portworxVolume (deprecated)
-->
* azureFile（已弃用）
* {{< glossary_tooltip text="csi" term_id="csi" >}}
* flexVolume（已弃用）
* rbd（已弃用）
* portworxVolume（已弃用）

<!--
You can only expand a PVC if its storage class's `allowVolumeExpansion` field is set to true.
-->
只有当 PVC 的存储类中将 `allowVolumeExpansion` 设置为 true 时，你才可以扩充该 PVC 申领。

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: example-vol-default
provisioner: vendor-name.example/magicstorage
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

<!--
To request a larger volume for a PVC, edit the PVC object and specify a larger
size. This triggers expansion of the volume that backs the underlying PersistentVolume. A
new PersistentVolume is never created to satisfy the claim. Instead, an existing volume is resized.
-->
如果要为某 PVC 请求较大的存储卷，可以编辑 PVC 对象，设置一个更大的尺寸值。
这一编辑操作会触发为下层 PersistentVolume 提供存储的卷的扩充。
Kubernetes 不会创建新的 PV 卷来满足此申领的请求。
与之相反，现有的卷会被调整大小。

{{< warning >}}
<!--
Directly editing the size of a PersistentVolume can prevent an automatic resize of that volume.
If you edit the capacity of a PersistentVolume, and then edit the `.spec` of a matching
PersistentVolumeClaim to make the size of the PersistentVolumeClaim match the PersistentVolume,
then no storage resize happens.
The Kubernetes control plane will see that the desired state of both resources matches,
conclude that the backing volume size has been manually
increased and that no resize is necessary.
-->
直接编辑 PersistentVolume 的大小可以阻止该卷自动调整大小。
如果对 PersistentVolume 的容量进行编辑，然后又将其所对应的
PersistentVolumeClaim 的 `.spec` 进行编辑，使该 PersistentVolumeClaim
的大小匹配 PersistentVolume 的话，则不会发生存储大小的调整。
Kubernetes 控制平面将看到两个资源的所需状态匹配，
并认为其后备卷的大小已被手动增加，无需调整。
{{< /warning >}}

<!--
#### CSI Volume expansion
-->
#### CSI 卷的扩充     {#csi-volume-expansion}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
Support for expanding CSI volumes is enabled by default but it also requires a
specific CSI driver to support volume expansion. Refer to documentation of the
specific CSI driver for more information.
-->
对 CSI 卷的扩充能力默认是被启用的，不过扩充 CSI 卷要求 CSI
驱动支持卷扩充操作。可参阅特定 CSI 驱动的文档了解更多信息。

<!--
#### Resizing a volume containing a file system

You can only resize volumes containing a file system if the file system is XFS, Ext3, or Ext4.
-->
#### 重设包含文件系统的卷的大小 {#resizing-a-volume-containing-a-file-system}

只有卷中包含的文件系统是 XFS、Ext3 或者 Ext4 时，你才可以重设卷的大小。

<!--
When a volume contains a file system, the file system is only resized when a new Pod is using
the PersistentVolumeClaim in `ReadWrite` mode. File system expansion is either done when a Pod is starting up
or when a Pod is running and the underlying file system supports online expansion.

FlexVolumes (deprecated since Kubernetes v1.23) allow resize if the driver is configured with the
`RequiresFSResize` capability to `true`. The FlexVolume can be resized on Pod restart.
-->
当卷中包含文件系统时，只有在 Pod 使用 `ReadWrite` 模式来使用 PVC
申领的情况下才能重设其文件系统的大小。文件系统扩充的操作或者是在 Pod
启动期间完成，或者在下层文件系统支持在线扩充的前提下在 Pod 运行期间完成。

如果 FlexVolumes 的驱动将 `RequiresFSResize` 能力设置为 `true`，
则该 FlexVolume 卷（于 Kubernetes v1.23 弃用）可以在 Pod 重启期间调整大小。

<!--
#### Resizing an in-use PersistentVolumeClaim
-->
#### 重设使用中 PVC 申领的大小    {#resizing-an-in-use-persistentvolumevlaim}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
In this case, you don't need to delete and recreate a Pod or deployment that is using an existing PVC.
Any in-use PVC automatically becomes available to its Pod as soon as its file system has been expanded.
This feature has no effect on PVCs that are not in use by a Pod or deployment. You must create a Pod that
uses the PVC before the expansion can complete.
-->
在这种情况下，你不需要删除和重建正在使用某现有 PVC 的 Pod 或 Deployment。
所有使用中的 PVC 在其文件系统被扩充之后，立即可供其 Pod 使用。
此功能特性对于没有被 Pod 或 Deployment 使用的 PVC 而言没有效果。
你必须在执行扩展操作之前创建一个使用该 PVC 的 Pod。

<!--
Similar to other volume types - FlexVolume volumes can also be expanded when in-use by a Pod.
-->
与其他卷类型类似，FlexVolume 卷也可以在被 Pod 使用期间执行扩充操作。

{{< note >}}
<!--
FlexVolume resize is possible only when the underlying driver supports resize.
-->
FlexVolume 卷的重设大小只能在下层驱动支持重设大小的时候才可进行。
{{< /note >}}

<!--
#### Recovering from Failure when Expanding Volumes

If a user specifies a new size that is too big to be satisfied by underlying
storage system, expansion of PVC will be continuously retried until user or
cluster administrator takes some action. This can be undesirable and hence
Kubernetes provides following methods of recovering from such failures.
-->
#### 处理扩充卷过程中的失败      {#recovering-from-failure-when-expanding-volumes}

如果用户指定的新大小过大，底层存储系统无法满足，PVC 的扩展将不断重试，
直到用户或集群管理员采取一些措施。这种情况是不希望发生的，因此 Kubernetes
提供了以下从此类故障中恢复的方法。

{{< tabs name="recovery_methods" >}}
{{% tab name="集群管理员手动处理" %}}

<!--
If expanding underlying storage fails, the cluster administrator can manually
recover the Persistent Volume Claim (PVC) state and cancel the resize requests.
Otherwise, the resize requests are continuously retried by the controller without
administrator intervention.
-->
如果扩充下层存储的操作失败，集群管理员可以手动地恢复 PVC
申领的状态并取消重设大小的请求。否则，在没有管理员干预的情况下，
控制器会反复重试重设大小的操作。

<!--
1. Mark the PersistentVolume(PV) that is bound to the PersistentVolumeClaim(PVC)
   with `Retain` reclaim policy.
2. Delete the PVC. Since PV has `Retain` reclaim policy - we will not lose any data
   when we recreate the PVC.
3. Delete the `claimRef` entry from PV specs, so as new PVC can bind to it.
   This should make the PV `Available`.
4. Re-create the PVC with smaller size than PV and set `volumeName` field of the
   PVC to the name of the PV. This should bind new PVC to existing PV.
5. Don't forget to restore the reclaim policy of the PV.
-->
1. 将绑定到 PVC 申领的 PV 卷标记为 `Retain` 回收策略。
2. 删除 PVC 对象。由于 PV 的回收策略为 `Retain`，我们不会在重建 PVC 时丢失数据。
3. 删除 PV 规约中的 `claimRef` 项，这样新的 PVC 可以绑定到该卷。
   这一操作会使得 PV 卷变为 "可用（Available）"。
4. 使用小于 PV 卷大小的尺寸重建 PVC，设置 PVC 的 `volumeName` 字段为 PV 卷的名称。
   这一操作将把新的 PVC 对象绑定到现有的 PV 卷。
5. 不要忘记恢复 PV 卷上设置的回收策略。

{{% /tab %}}
{{% tab name="通过请求扩展为更小尺寸" %}}
{{% feature-state for_k8s_version="v1.23" state="alpha" %}}

{{< note >}}
<!--
Recovery from failing PVC expansion by users is available as an alpha feature
since Kubernetes 1.23. The `RecoverVolumeExpansionFailure` feature must be
enabled for this feature to work. Refer to the
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
documentation for more information.
-->
Kubernetes 从 1.23 版本开始将允许用户恢复失败的 PVC 扩展这一能力作为
Alpha 特性支持。`RecoverVolumeExpansionFailure` 必须被启用以允许使用此特性。
可参考[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
文档了解更多信息。
{{< /note >}}

<!--
If the feature gates `RecoverVolumeExpansionFailure` is
enabled in your cluster, and expansion has failed for a PVC, you can retry expansion with a
smaller size than the previously requested value. To request a new expansion attempt with a
smaller proposed size, edit `.spec.resources` for that PVC and choose a value that is less than the
value you previously tried.
This is useful if expansion to a higher value did not succeed because of capacity constraint.
If that has happened, or you suspect that it might have, you can retry expansion by specifying a
size that is within the capacity limits of underlying storage provider. You can monitor status of
resize operation by watching `.status.allocatedResourceStatuses` and events on the PVC.
-->
如果集群中的特性门控 `RecoverVolumeExpansionFailure`
已启用，在 PVC 的扩展发生失败时，你可以使用比先前请求的值更小的尺寸来重试扩展。
要使用一个更小的尺寸尝试请求新的扩展，请编辑该 PVC 的 `.spec.resources`
并选择一个比你之前所尝试的值更小的值。
如果由于容量限制而无法成功扩展至更高的值，这将很有用。
如果发生了这种情况，或者你怀疑可能发生了这种情况，
你可以通过指定一个在底层存储制备容量限制内的尺寸来重试扩展。
你可以通过查看 `.status.allocatedResourceStatuses` 以及 PVC 上的事件来监控调整大小操作的状态。

<!--
Note that,
although you can specify a lower amount of storage than what was requested previously,
the new value must still be higher than `.status.capacity`.
Kubernetes does not support shrinking a PVC to less than its current size.
-->
请注意，
尽管你可以指定比之前的请求更低的存储量，新值必须仍然高于 `.status.capacity`。
Kubernetes 不支持将 PVC 缩小到小于其当前的尺寸。

{{% /tab %}}
{{% /tabs %}}

<!--
## Types of Persistent Volumes

PersistentVolume types are implemented as plugins. Kubernetes currently supports the following plugins:
-->

## 持久卷的类型     {#types-of-persistent-volumes}

PV 持久卷是用插件的形式来实现的。Kubernetes 目前支持以下插件：

<!--
* [`csi`](/docs/concepts/storage/volumes/#csi) - Container Storage Interface (CSI)
* [`fc`](/docs/concepts/storage/volumes/#fc) - Fibre Channel (FC) storage
* [`hostPath`](/docs/concepts/storage/volumes/#hostpath) - HostPath volume
  (for single node testing only; WILL NOT WORK in a multi-node cluster;
  consider using `local` volume instead)
* [`iscsi`](/docs/concepts/storage/volumes/#iscsi) - iSCSI (SCSI over IP) storage
* [`local`](/docs/concepts/storage/volumes/#local) - local storage devices
  mounted on nodes.
* [`nfs`](/docs/concepts/storage/volumes/#nfs) - Network File System (NFS) storage
-->
* [`csi`](/zh-cn/docs/concepts/storage/volumes/#csi) - 容器存储接口（CSI）
* [`fc`](/zh-cn/docs/concepts/storage/volumes/#fc) - Fibre Channel（FC）存储
* [`hostPath`](/zh-cn/docs/concepts/storage/volumes/#hostpath) - HostPath 卷
  （仅供单节点测试使用；不适用于多节点集群；请尝试使用 `local` 卷作为替代）
* [`iscsi`](/zh-cn/docs/concepts/storage/volumes/#iscsi) - iSCSI（IP 上的 SCSI）存储
* [`local`](/zh-cn/docs/concepts/storage/volumes/#local) - 节点上挂载的本地存储设备
* [`nfs`](/zh-cn/docs/concepts/storage/volumes/#nfs) - 网络文件系统（NFS）存储

<!-- 
The following types of PersistentVolume are deprecated but still available.
If you are using these volume types except for `flexVolume`, `cephfs` and `rbd`,
please install corresponding CSI drivers.
-->
以下的持久卷已被弃用但仍然可用。
如果你使用除 `flexVolume`、`cephfs` 和 `rbd` 之外的卷类型，请安装相应的 CSI 驱动程序。

<!--
* [`awsElasticBlockStore`](/docs/concepts/storage/volumes/#awselasticblockstore) - AWS Elastic Block Store (EBS)
  (**migration on by default** starting v1.23)
* [`azureDisk`](/docs/concepts/storage/volumes/#azuredisk) - Azure Disk
  (**migration on by default** starting v1.23)
* [`azureFile`](/docs/concepts/storage/volumes/#azurefile) - Azure File
  (**migration on by default** starting v1.24)
* [`cinder`](/docs/concepts/storage/volumes/#cinder) - Cinder (OpenStack block storage)
  (**migration on by default** starting v1.21)
* [`flexVolume`](/docs/concepts/storage/volumes/#flexvolume) - FlexVolume
  (**deprecated** starting v1.23, no migration plan and no plan to remove support)
* [`gcePersistentDisk`](/docs/concepts/storage/volumes/#gcePersistentDisk) - GCE Persistent Disk
  (**migration on by default** starting v1.23)
* [`portworxVolume`](/docs/concepts/storage/volumes/#portworxvolume) - Portworx volume
  (**migration on by default** starting v1.31)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume) - vSphere VMDK volume
  (**migration on by default** starting v1.25)
-->
* [`awsElasticBlockStore`](/zh-cn/docs/concepts/storage/volumes/#awselasticblockstore) - AWS Elastic 块存储（EBS）
  （从 v1.23 开始**默认启用迁移**）
* [`azureDisk`](/zh-cn/docs/concepts/storage/volumes/#azuredisk) - Azure 磁盘
  （从 v1.23 开始**默认启用迁移**）
* [`azureFile`](/zh-cn/docs/concepts/storage/volumes/#azurefile) - Azure 文件
  （从 v1.24 开始**默认启用迁移**）
* [`cinder`](/zh-cn/docs/concepts/storage/volumes/#cinder) - Cinder（OpenStack 块存储）
  （从 v1.21 开始**默认启用迁移**）
* [`flexVolume`](/zh-cn/docs/concepts/storage/volumes/#flexVolume) - FlexVolume
  （从 v1.23 开始**弃用**，没有迁移计划，没有移除支持的计划）
* [`gcePersistentDisk`](/zh-cn/docs/concepts/storage/volumes/#gcePersistentDisk) - GCE 持久磁盘
  （从 v1.23 开始**默认启用迁移**）
* [`portworxVolume`](/zh-cn/docs/concepts/storage/volumes/#portworxvolume) - Portworx 卷
  （从 v1.31 开始**默认启用迁移**）
* [`vsphereVolume`](/zh-cn/docs/concepts/storage/volumes/#vspherevolume) - vSphere VMDK 卷
 （从 v1.25 开始**默认启用迁移**）

<!-- 
Older versions of Kubernetes also supported the following in-tree PersistentVolume types:

* [`cephfs`](/docs/concepts/storage/volumes/#cephfs)
  (**not available** starting v1.31)
* `flocker` - Flocker storage.
  (**not available** starting v1.25)
* `photonPersistentDisk` - Photon controller persistent disk.
  (**not available** starting v1.15)
* `quobyte` - Quobyte volume.
  (**not available** starting v1.25)
* [`rbd`](/docs/concepts/storage/volumes/#rbd) - Rados Block Device (RBD) volume 
  (**not available** starting v1.31)
* `scaleIO` - ScaleIO volume.
  (**not available** starting v1.21)
* `storageos` - StorageOS volume.
  (**not available** starting v1.25)
-->
旧版本的 Kubernetes 仍支持这些“树内（In-Tree）”持久卷类型：

* [`cephfs`](/zh-cn/docs/concepts/storage/volumes/#cephfs)
  （v1.31 之后**不可用**）
* `flocker` - Flocker 存储。
  （v1.25 之后**不可用**）
* `photonPersistentDisk` - Photon 控制器持久化盘
  （v1.15 之后**不可用**）
* `quobyte` - Quobyte 卷。
  （v1.25 之后**不可用**）
* [`rbd`](/zh-cn/docs/concepts/storage/volumes/#rbd) - Rados 块设备 (RBD) 卷
  （v1.31 之后**不可用**）
* `scaleIO` - ScaleIO 卷
  （v1.21 之后**不可用**）
* `storageos` - StorageOS 卷
  （v1.25 之后**不可用**）

<!--
## Persistent Volumes

Each PV contains a spec and status, which is the specification and status of the volume.
The name of a PersistentVolume object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
## 持久卷    {#persistent-volumes}

每个 PV 对象都包含 `spec` 部分和 `status` 部分，分别对应卷的规约和状态。
PersistentVolume 对象的名称必须是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

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

{{< note >}}
<!--
Helper programs relating to the volume type may be required for consumption of
a PersistentVolume within a cluster.  In this example, the PersistentVolume is
of type NFS and the helper program /sbin/mount.nfs is required to support the
mounting of NFS filesystems.
-->
在集群中使用持久卷存储通常需要一些特定于具体卷类型的辅助程序。
在这个例子中，PersistentVolume 是 NFS 类型的，因此需要辅助程序 `/sbin/mount.nfs`
来支持挂载 NFS 文件系统。
{{< /note >}}

<!--
### Capacity

Generally, a PV will have a specific storage capacity. This is set using the PV's
`capacity` attribute which is a {{< glossary_tooltip term_id="quantity" >}} value.

Currently, storage size is the only resource that can be set or requested.
Future attributes may include IOPS, throughput, etc.
-->
### 容量    {#capacity}

一般而言，每个 PV 卷都有确定的存储容量。
这是通过 PV 的 `capacity` 属性设置的，
该属性是一个{{< glossary_tooltip text="量纲（Quantity）" term_id="quantity" >}}。

目前存储大小是可以设置和请求的唯一资源，
未来可能会包含 IOPS、吞吐量等属性。

<!--
### Volume Mode
-->
### 卷模式     {#volume-mode}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
Kubernetes supports two `volumeModes` of PersistentVolumes: `Filesystem` and `Block`.

`volumeMode` is an optional API parameter.
`Filesystem` is the default mode used when `volumeMode` parameter is omitted.

A volume with `volumeMode: Filesystem` is *mounted* into Pods into a directory. If the volume
is backed by a block device and the device is empty, Kubernetes creates a filesystem
on the device before mounting it for the first time.
-->
针对 PV 持久卷，Kubernetes
支持两种卷模式（`volumeModes`）：`Filesystem（文件系统）` 和 `Block（块）`。
`volumeMode` 是一个可选的 API 参数。
如果该参数被省略，默认的卷模式是 `Filesystem`。

`volumeMode` 属性设置为 `Filesystem` 的卷会被 Pod **挂载（Mount）** 到某个目录。
如果卷的存储来自某块设备而该设备目前为空，Kuberneretes 会在第一次挂载卷之前在设备上创建文件系统。

<!--
You can set the value of `volumeMode` to `Block` to use a volume as a raw block device.
Such volume is presented into a Pod as a block device, without any filesystem on it.
This mode is useful to provide a Pod the fastest possible way to access a volume, without
any filesystem layer between the Pod and the volume. On the other hand, the application
running in the Pod must know how to handle a raw block device.
See [Raw Block Volume Support](#raw-block-volume-support)
for an example on how to use a volume with `volumeMode: Block` in a Pod.
-->
你可以将 `volumeMode` 设置为 `Block`，以便将卷作为原始块设备来使用。
这类卷以块设备的方式交给 Pod 使用，其上没有任何文件系统。
这种模式对于为 Pod 提供一种使用最快可能方式来访问卷而言很有帮助，
Pod 和卷之间不存在文件系统层。另外，Pod 中运行的应用必须知道如何处理原始块设备。
关于如何在 Pod 中使用 `volumeMode: Block` 的卷，
可参阅[原始块卷支持](#raw-block-volume-support)。

<!--
### Access Modes

A PersistentVolume can be mounted on a host in any way supported by the resource
provider. As shown in the table below, providers will have different capabilities
and each PV's access modes are set to the specific modes supported by that particular
volume. For example, NFS can support multiple read/write clients, but a specific
NFS PV might be exported on the server as read-only. Each PV gets its own set of
access modes describing that specific PV's capabilities.
-->
### 访问模式   {#access-modes}

PersistentVolume 卷可以用资源提供者所支持的任何方式挂载到宿主系统上。
如下表所示，提供者（驱动）的能力不同，每个 PV 卷的访问模式都会设置为对应卷所支持的模式值。
例如，NFS 可以支持多个读写客户，但是某个特定的 NFS PV 卷可能在服务器上以只读的方式导出。
每个 PV 卷都会获得自身的访问模式集合，描述的是特定 PV 卷的能力。

<!--
The access modes are:

`ReadWriteOnce`
: the volume can be mounted as read-write by a single node. ReadWriteOnce access
  mode still can allow multiple pods to access the volume when the pods are
  running on the same node. For single pod access, please see ReadWriteOncePod.

`ReadOnlyMany`
: the volume can be mounted as read-only by many nodes.

`ReadWriteMany`
: the volume can be mounted as read-write by many nodes.

 `ReadWriteOncePod`
: {{< feature-state for_k8s_version="v1.29" state="stable" >}}
  the volume can be mounted as read-write by a single Pod. Use ReadWriteOncePod
  access mode if you want to ensure that only one pod across the whole cluster can
  read that PVC or write to it.
-->
访问模式有：

`ReadWriteOnce`
: 卷可以被一个节点以读写方式挂载。
  ReadWriteOnce 访问模式仍然可以在同一节点上运行的多个 Pod 访问该卷。
  对于单个 Pod 的访问，请参考 ReadWriteOncePod 访问模式。

`ReadOnlyMany`
: 卷可以被多个节点以只读方式挂载。

`ReadWriteMany`
: 卷可以被多个节点以读写方式挂载。

`ReadWriteOncePod`
: {{< feature-state for_k8s_version="v1.29" state="stable" >}}
  卷可以被单个 Pod 以读写方式挂载。
  如果你想确保整个集群中只有一个 Pod 可以读取或写入该 PVC，
  请使用 ReadWriteOncePod 访问模式。

{{< note >}}
<!--
The `ReadWriteOncePod` access mode is only supported for
{{< glossary_tooltip text="CSI" term_id="csi" >}} volumes and Kubernetes version
1.22+. To use this feature you will need to update the following
[CSI sidecars](https://kubernetes-csi.github.io/docs/sidecar-containers.html)
to these versions or greater:

* [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
* [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
* [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
-->
`ReadWriteOncePod` 访问模式仅适用于 {{< glossary_tooltip text="CSI" term_id="csi" >}} 卷和 Kubernetes v1.22+。
要使用此特性，你需要将以下
[CSI 边车](https://kubernetes-csi.github.io/docs/sidecar-containers.html)更新为下列或更高版本：

- [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
- [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
- [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
{{< /note >}}

<!--
In the CLI, the access modes are abbreviated to:

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany
* RWOP - ReadWriteOncePod
-->
在命令行接口（CLI）中，访问模式也使用以下缩写形式：

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany
* RWOP - ReadWriteOncePod

{{< note >}}
<!--
Kubernetes uses volume access modes to match PersistentVolumeClaims and PersistentVolumes.
In some cases, the volume access modes also constrain where the PersistentVolume can be mounted.
Volume access modes do **not** enforce write protection once the storage has been mounted.
Even if the access modes are specified as ReadWriteOnce, ReadOnlyMany, or ReadWriteMany,
they don't set any constraints on the volume. For example, even if a PersistentVolume is
created as ReadOnlyMany, it is no guarantee that it will be read-only. If the access modes
are specified as ReadWriteOncePod, the volume is constrained and can be mounted on only a single Pod.
-->
Kubernetes 使用卷访问模式来匹配 PersistentVolumeClaim 和 PersistentVolume。
在某些场合下，卷访问模式也会限制 PersistentVolume 可以挂载的位置。
卷访问模式并**不会**在存储已经被挂载的情况下为其实施写保护。
即使访问模式设置为 ReadWriteOnce、ReadOnlyMany 或 ReadWriteMany，它们也不会对卷形成限制。
例如，即使某个卷创建时设置为 ReadOnlyMany，也无法保证该卷是只读的。
如果访问模式设置为 ReadWriteOncePod，则卷会被限制起来并且只能挂载到一个 Pod 上。
{{< /note >}}

<!--
> __Important!__ A volume can only be mounted using one access mode at a time,
> even if it supports many.
-->
> **重要提醒！** 每个卷同一时刻只能以一种访问模式挂载，即使该卷能够支持多种访问模式。

<!--
| Volume Plugin        | ReadWriteOnce          | ReadOnlyMany          | ReadWriteMany | ReadWriteOncePod       |
| :---                 | :---:                  | :---:                 | :---:         | -                      |
| AzureFile            | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CephFS               | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CSI                  | depends on the driver  | depends on the driver | depends on the driver | depends on the driver |
| FC                   | &#x2713;               | &#x2713;              | -             | -                      |
| FlexVolume           | &#x2713;               | &#x2713;              | depends on the driver | -              |
| HostPath             | &#x2713;               | -                     | -             | -                      |
| iSCSI                | &#x2713;               | &#x2713;              | -             | -                      |
| NFS                  | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| RBD                  | &#x2713;               | &#x2713;              | -             | -                      |
| VsphereVolume        | &#x2713;               | -                     | - (works when Pods are collocated) | - |
| PortworxVolume       | &#x2713;               | -                     | &#x2713;      | -                  | - |
-->
| 卷插件               | ReadWriteOnce          | ReadOnlyMany          | ReadWriteMany | ReadWriteOncePod       |
| :---                 | :---:                  | :---:                 | :---:         | -                      |
| AzureFile            | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CephFS               | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CSI                  | 取决于驱动              | 取决于驱动            | 取决于驱动      | 取决于驱动    |
| FC                   | &#x2713;               | &#x2713;              | -             | -                      |
| FlexVolume           | &#x2713;               | &#x2713;              | 取决于驱动   | -              |
| GCEPersistentDisk    | &#x2713;               | &#x2713;              | -             | -                      |
| Glusterfs            | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| HostPath             | &#x2713;               | -                     | -             | -                      |
| iSCSI                | &#x2713;               | &#x2713;              | -             | -                      |
| NFS                  | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| RBD                  | &#x2713;               | &#x2713;              | -             | -                      |
| VsphereVolume        | &#x2713;               | -                     | -（Pod 运行于同一节点上时可行） | - |
| PortworxVolume       | &#x2713;               | -                     | &#x2713;      | -                  | - |

<!--
### Class

A PV can have a class, which is specified by setting the
`storageClassName` attribute to the name of a
[StorageClass](/docs/concepts/storage/storage-classes/).
A PV of a particular class can only be bound to PVCs requesting
that class. A PV with no `storageClassName` has no class and can only be bound
to PVCs that request no particular class.
-->
### 类    {#class}

每个 PV 可以属于某个类（Class），通过将其 `storageClassName` 属性设置为某个
[StorageClass](/zh-cn/docs/concepts/storage/storage-classes/) 的名称来指定。
特定类的 PV 卷只能绑定到请求该类存储卷的 PVC 申领。
未设置 `storageClassName` 的 PV 卷没有类设定，只能绑定到那些没有指定特定存储类的 PVC 申领。

<!--
In the past, the annotation `volume.beta.kubernetes.io/storage-class` was used instead
of the `storageClassName` attribute. This annotation is still working; however,
it will become fully deprecated in a future Kubernetes release.
-->
早前，Kubernetes 使用注解 `volume.beta.kubernetes.io/storage-class` 而不是
`storageClassName` 属性。这一注解目前仍然起作用，不过在将来的 Kubernetes
发布版本中该注解会被彻底废弃。

<!--
### Reclaim Policy

Current reclaim policies are:

* Retain -- manual reclamation
* Recycle -- basic scrub (`rm -rf /thevolume/*`)
* Delete -- delete the volume

For Kubernetes {{< skew currentVersion >}}, only `nfs` and `hostPath` volume types support recycling.
-->
### 回收策略   {#reclaim-policy}

目前的回收策略有：

* Retain -- 手动回收
* Recycle -- 简单擦除（`rm -rf /thevolume/*`）
* Delete -- 删除存储卷

对于 Kubernetes {{< skew currentVersion >}} 来说，只有
`nfs` 和 `hostPath` 卷类型支持回收（Recycle）。

<!--
### Mount Options

A Kubernetes administrator can specify additional mount options for when a
Persistent Volume is mounted on a node.
-->
### 挂载选项    {#mount-options}

Kubernetes 管理员可以指定持久卷被挂载到节点上时使用的附加挂载选项。

{{< note >}}
<!--
Not all Persistent Volume types support mount options.
-->
并非所有持久卷类型都支持挂载选项。
{{< /note >}}

<!--
The following volume types support mount options:

* `azureFile`
* `cephfs` (**deprecated** in v1.28)
* `cinder` (**deprecated** in v1.18)
* `iscsi`
* `nfs`
* `rbd` (**deprecated** in v1.28)
* `vsphereVolume`
-->
以下卷类型支持挂载选项：

* `azureFile`
* `cephfs`（于 v1.28 中**弃用**）
* `cinder`（于 v1.18 中**弃用**）
* `iscsi`
* `nfs`
* `rbd`（于 v1.28 中**弃用**）
* `vsphereVolume`

<!--
Mount options are not validated. If a mount option is invalid, the mount fails.
-->
Kubernetes 不对挂载选项执行合法性检查。如果挂载选项是非法的，挂载就会失败。

<!--
In the past, the annotation `volume.beta.kubernetes.io/mount-options` was used instead
of the `mountOptions` attribute. This annotation is still working; however,
it will become fully deprecated in a future Kubernetes release.
-->
早前，Kubernetes 使用注解 `volume.beta.kubernetes.io/mount-options` 而不是
`mountOptions` 属性。这一注解目前仍然起作用，不过在将来的 Kubernetes
发布版本中该注解会被彻底废弃。

<!--
### Node Affinity
-->
### 节点亲和性   {#node-affinity}

{{< note >}}
<!--
For most volume types, you do not need to set this field.
You need to explicitly set this for [local](/docs/concepts/storage/volumes/#local) volumes.
-->
对大多数卷类型而言，你不需要设置节点亲和性字段。
你需要为 [local](/zh-cn/docs/concepts/storage/volumes/#local)
卷显式地设置此属性。
{{< /note >}}

<!--
A PV can specify node affinity to define constraints that limit what nodes this
volume can be accessed from. Pods that use a PV will only be scheduled to nodes
that are selected by the node affinity. To specify node affinity, set
`nodeAffinity` in the `.spec` of a PV. The
[PersistentVolume](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)
API reference has more details on this field.
-->
每个 PV 卷可以通过设置节点亲和性来定义一些约束，进而限制从哪些节点上可以访问此卷。
使用这些卷的 Pod 只会被调度到节点亲和性规则所选择的节点上执行。
要设置节点亲和性，配置 PV 卷 `.spec` 中的 `nodeAffinity`。
[持久卷](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)
API 参考关于该字段的更多细节。

<!--
### Phase

A PersistentVolume will be in one of the following phases:

`Available`
: a free resource that is not yet bound to a claim

`Bound`
: the volume is bound to a claim

`Released`
: the claim has been deleted, but the associated storage resource is not yet reclaimed by the cluster

`Failed`
: the volume has failed its (automated) reclamation
-->
### 阶段   {#phase}

每个持久卷会处于以下阶段（Phase）之一：

`Available`
: 卷是一个空闲资源，尚未绑定到任何申领

`Bound`
: 该卷已经绑定到某申领

`Released`
: 所绑定的申领已被删除，但是关联存储资源尚未被集群回收

`Failed`
: 卷的自动回收操作失败

<!--
You can see the name of the PVC bound to the PV using `kubectl describe persistentvolume <name>`.
-->
你可以使用 `kubectl describe persistentvolume <name>` 查看已绑定到 PV 的 PVC 的名称。

<!--
#### Phase transition timestamp
-->
#### 阶段转换时间戳

{{< feature-state feature_gate_name="PersistentVolumeLastPhaseTransitionTime" >}}

<!--
The `.status` field for a PersistentVolume can include an alpha `lastPhaseTransitionTime` field. This field records
the timestamp of when the volume last transitioned its phase. For newly created
volumes the phase is set to `Pending` and `lastPhaseTransitionTime` is set to
the current time.
-->
持久卷的 `.status` 字段可以包含 Alpha 状态的 `lastPhaseTransitionTime` 字段。
该字段保存的是卷上次转换阶段的时间戳。
对于新创建的卷，阶段被设置为 `Pending`，`lastPhaseTransitionTime` 被设置为当前时间。

## PersistentVolumeClaims

<!--
Each PVC contains a spec and status, which is the specification and status of the claim.
The name of a PersistentVolumeClaim object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
每个 PVC 对象都有 `spec` 和 `status` 部分，分别对应申领的规约和状态。
PersistentVolumeClaim 对象的名称必须是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

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

<!--
### Access Modes

Claims use [the same conventions as volumes](#access-modes) when requesting
storage with specific access modes.
-->
### 访问模式 {#access-modes}

申领在请求具有特定访问模式的存储时，使用与卷相同的[访问模式约定](#access-modes)。

<!--
### Volume Modes

Claims use [the same convention as volumes](#volume-mode) to indicate the
consumption of the volume as either a filesystem or block device.
-->
### 卷模式 {#volume-modes}

申领使用[与卷相同的约定](#volume-mode)来表明是将卷作为文件系统还是块设备来使用。

<!--
### Resources

Claims, like Pods, can request specific quantities of a resource. In this case,
the request is for storage. The same
[resource model](https://git.k8s.io/design-proposals-archive/scheduling/resources.md)
applies to both volumes and claims.
-->
### 资源    {#resources}

申领和 Pod 一样，也可以请求特定数量的资源。在这个上下文中，请求的资源是存储。
卷和申领都使用相同的[资源模型](https://git.k8s.io/design-proposals-archive/scheduling/resources.md)。

<!--
### Selector

Claims can specify a
[label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
to further filter the set of volumes. Only the volumes whose labels match the selector
can be bound to the claim. The selector can consist of two fields:
-->
### 选择算符    {#selector}

申领可以设置[标签选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)
来进一步过滤卷集合。只有标签与选择算符相匹配的卷能够绑定到申领上。
选择算符包含两个字段：

<!--
* `matchLabels` - the volume must have a label with this value
* `matchExpressions` - a list of requirements made by specifying key, list of values,
  and operator that relates the key and values. Valid operators include In, NotIn,
  Exists, and DoesNotExist.

All of the requirements, from both `matchLabels` and `matchExpressions`, are
ANDed together – they must all be satisfied in order to match.
-->
* `matchLabels` - 卷必须包含带有此值的标签
* `matchExpressions` - 通过设定键（key）、值列表和操作符（operator）
  来构造的需求。合法的操作符有 In、NotIn、Exists 和 DoesNotExist。

来自 `matchLabels` 和 `matchExpressions` 的所有需求都按逻辑与的方式组合在一起。
这些需求都必须被满足才被视为匹配。

<!--
### Class

A claim can request a particular class by specifying the name of a
[StorageClass](/docs/concepts/storage/storage-classes/)
using the attribute `storageClassName`.
Only PVs of the requested class, ones with the same `storageClassName` as the PVC, can
be bound to the PVC.
-->
### 类      {#class}

申领可以通过为 `storageClassName` 属性设置
[StorageClass](/zh-cn/docs/concepts/storage/storage-classes/) 的名称来请求特定的存储类。
只有所请求的类的 PV 卷，即 `storageClassName` 值与 PVC 设置相同的 PV 卷，
才能绑定到 PVC 申领。

<!--
PVCs don't necessarily have to request a class. A PVC with its `storageClassName` set
equal to `""` is always interpreted to be requesting a PV with no class, so it
can only be bound to PVs with no class (no annotation or one set equal to
`""`). A PVC with no `storageClassName` is not quite the same and is treated differently
by the cluster, depending on whether the
[`DefaultStorageClass` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
is turned on.
-->
PVC 申领不必一定要请求某个类。如果 PVC 的 `storageClassName` 属性值设置为 `""`，
则被视为要请求的是没有设置存储类的 PV 卷，因此这一 PVC 申领只能绑定到未设置存储类的
PV 卷（未设置注解或者注解值为 `""` 的 PersistentVolume（PV）对象在系统中不会被删除，
因为这样做可能会引起数据丢失）。未设置 `storageClassName` 的 PVC 与此大不相同，
也会被集群作不同处理。具体筛查方式取决于
[`DefaultStorageClass` 准入控制器插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
是否被启用。

<!--
* If the admission plugin is turned on, the administrator may specify a
  default StorageClass. All PVCs that have no `storageClassName` can be bound only to
  PVs of that default. Specifying a default StorageClass is done by setting the
  annotation `storageclass.kubernetes.io/is-default-class` equal to `true` in
  a StorageClass object. If the administrator does not specify a default, the
  cluster responds to PVC creation as if the admission plugin were turned off. If more than one
  default StorageClass is specified, the newest default is used when the
  PVC is dynamically provisioned.
* If the admission plugin is turned off, there is no notion of a default
  StorageClass. All PVCs that have `storageClassName` set to `""` can be
  bound only to PVs that have `storageClassName` also set to `""`.
  However, PVCs with missing `storageClassName` can be updated later once
  default StorageClass becomes available. If the PVC gets updated it will no
  longer bind to PVs that have `storageClassName` also set to `""`.
-->
* 如果准入控制器插件被启用，则管理员可以设置一个默认的 StorageClass。
  所有未设置 `storageClassName` 的 PVC 都只能绑定到隶属于默认存储类的 PV 卷。
  设置默认 StorageClass 的工作是通过将对应 StorageClass 对象的注解
  `storageclass.kubernetes.io/is-default-class` 赋值为 `true` 来完成的。
  如果管理员未设置默认存储类，集群对 PVC 创建的处理方式与未启用准入控制器插件时相同。
  如果设定的默认存储类不止一个，当 PVC 被动态制备时将使用最新的默认存储类。
* 如果准入控制器插件被关闭，则不存在默认 StorageClass 的说法。
  所有将 `storageClassName` 设为 `""` 的 PVC 只能被绑定到也将 `storageClassName` 设为 `""` 的 PV。
  不过，只要默认的 StorageClass 可用，就可以稍后更新缺少 `storageClassName` 的 PVC。
  如果这个 PVC 更新了，它将不再绑定到也将 `storageClassName` 设为 `""` 的 PV。

<!--
See [retroactive default StorageClass assignment](#retroactive-default-storageclass-assignment) for more details.
-->
参阅[可追溯的默认 StorageClass 赋值](#retroactive-default-storageclass-assignment)了解更多详细信息。

<!--
Depending on installation method, a default StorageClass may be deployed
to a Kubernetes cluster by addon manager during installation.

When a PVC specifies a `selector` in addition to requesting a StorageClass,
the requirements are ANDed together: only a PV of the requested class and with
the requested labels may be bound to the PVC.
-->
取决于安装方法，默认的 StorageClass 可能在集群安装期间由插件管理器（Addon
Manager）部署到集群中。

当某 PVC 除了请求 StorageClass 之外还设置了 `selector`，则这两种需求会按逻辑与关系处理：
只有隶属于所请求类且带有所请求标签的 PV 才能绑定到 PVC。

{{< note >}}
<!--
Currently, a PVC with a non-empty `selector` can't have a PV dynamically provisioned for it.
-->
目前，设置了非空 `selector` 的 PVC 对象无法让集群为其动态制备 PV 卷。
{{< /note >}}

<!--
In the past, the annotation `volume.beta.kubernetes.io/storage-class` was used instead
of `storageClassName` attribute. This annotation is still working; however,
it won't be supported in a future Kubernetes release.
-->
早前，Kubernetes 使用注解 `volume.beta.kubernetes.io/storage-class` 而不是
`storageClassName` 属性。这一注解目前仍然起作用，不过在将来的 Kubernetes
发布版本中该注解会被彻底废弃。

<!--
#### Retroactive default StorageClass assignment
-->
#### 可追溯的默认 StorageClass 赋值   {#retroactive-default-storageclass-assignment}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

<!--
You can create a PersistentVolumeClaim without specifying a `storageClassName`
for the new PVC, and you can do so even when no default StorageClass exists
in your cluster. In this case, the new PVC creates as you defined it, and the
`storageClassName` of that PVC remains unset until default becomes available.
-->
你可以创建 PersistentVolumeClaim，而无需为新 PVC 指定 `storageClassName`。
即使你的集群中不存在默认 StorageClass，你也可以这样做。
在这种情况下，新的 PVC 会按照你的定义进行创建，并且在默认值可用之前，该 PVC 的 `storageClassName` 保持不设置。

<!--
When a default StorageClass becomes available, the control plane identifies any
existing PVCs without `storageClassName`. For the PVCs that either have an empty
value for `storageClassName` or do not have this key, the control plane then
updates those PVCs to set `storageClassName` to match the new default StorageClass.
If you have an existing PVC where the `storageClassName` is `""`, and you configure
a default StorageClass, then this PVC will not get updated.
-->
当一个默认的 StorageClass 变得可用时，控制平面会识别所有未设置 `storageClassName` 的现有 PVC。
对于 `storageClassName` 为空值或没有此主键的 PVC，
控制平面会更新这些 PVC 以设置其 `storageClassName` 与新的默认 StorageClass 匹配。
如果你有一个现有的 PVC，其中 `storageClassName` 是 `""`，
并且你配置了默认 StorageClass，则此 PVC 将不会得到更新。

<!--
In order to keep binding to PVs with `storageClassName` set to `""`
(while a default StorageClass is present), you need to set the `storageClassName`
of the associated PVC to `""`.

This behavior helps administrators change default StorageClass by removing the
old one first and then creating or setting another one. This brief window while
there is no default causes PVCs without `storageClassName` created at that time
to not have any default, but due to the retroactive default StorageClass
assignment this way of changing defaults is safe.
-->
为了保持绑定到 `storageClassName` 设为 `""` 的 PV（当存在默认 StorageClass 时），
你需要将关联 PVC 的 `storageClassName` 设置为 `""`。

此行为可帮助管理员更改默认 StorageClass，方法是先移除旧的 PVC，然后再创建或设置另一个 PVC。
这一时间窗口内因为没有指定默认值，会导致所创建的未设置 `storageClassName` 的 PVC 也没有默认值设置，
但由于默认 StorageClass 赋值是可追溯的，这种更改默认值的方式是安全的。

<!--
## Claims As Volumes

Pods access storage by using the claim as a volume. Claims must exist in the
same namespace as the Pod using the claim. The cluster finds the claim in the
Pod's namespace and uses it to get the PersistentVolume backing the claim.
The volume is then mounted to the host and into the Pod.
-->
## 使用申领作为卷     {#claims-as-volumes}

Pod 将申领作为卷来使用，并藉此访问存储资源。
申领必须位于使用它的 Pod 所在的同一名字空间内。
集群在 Pod 的名字空间中查找申领，并使用它来获得申领所使用的 PV 卷。
之后，卷会被挂载到宿主上并挂载到 Pod 中。

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

<!--
### A Note on Namespaces

PersistentVolumes binds are exclusive, and since PersistentVolumeClaims are
namespaced objects, mounting claims with "Many" modes (`ROX`, `RWX`) is only
possible within one namespace.
-->
### 关于名字空间的说明    {#a-note-on-namespaces}

PersistentVolume 卷的绑定是排他性的。
由于 PersistentVolumeClaim 是名字空间作用域的对象，使用
"Many" 模式（`ROX`、`RWX`）来挂载申领的操作只能在同一名字空间内进行。

<!--
### PersistentVolumes typed `hostPath`

A `hostPath` PersistentVolume uses a file or directory on the Node to emulate
network-attached storage. See
[an example of `hostPath` typed volume](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume).
-->
### 类型为 `hostpath` 的 PersistentVolume  {#persistentvolumes-typed-hostpath}

`hostPath` PersistentVolume 使用节点上的文件或目录来模拟网络附加（network-attached）存储。
相关细节可参阅 [`hostPath` 卷示例](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume)。

<!--
## Raw Block Volume Support
-->
## 原始块卷支持   {#raw-block-volume-support}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
The following volume plugins support raw block volumes, including dynamic provisioning where
applicable:
-->
以下卷插件支持原始块卷，包括其动态制备（如果支持的话）的卷：

<!--
* CSI
* FC (Fibre Channel)
* iSCSI
* Local volume
* OpenStack Cinder
* RBD (deprecated)
* RBD (Ceph Block Device; deprecated)
* VsphereVolume
-->
* CSI
* FC（光纤通道）
* iSCSI
* Local 卷
* OpenStack Cinder
* RBD（已弃用）
* RBD（Ceph 块设备，已弃用）
* VsphereVolume

<!--
### PersistentVolume using a Raw Block Volume {#persistent-volume-using-a-raw-block-volume}
-->
### 使用原始块卷的持久卷      {#persistent-volume-using-a-raw-block-volume}

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

<!--
### PersistentVolumeClaim requesting a Raw Block Volume {#persistent-volume-claim-requesting-a-raw-block-volume}
-->
### 申请原始块卷的 PVC 申领      {#persistent-volume-claim-requesting-a-raw-block-volume}

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
<!--
### Pod specification adding Raw Block Device path in container
-->
### 在容器中添加原始块设备路径的 Pod 规约  {#pod-spec-adding-raw-block-device-path-in-container}

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
<!--
When adding a raw block device for a Pod, you specify the device path in the
container instead of a mount path.
-->
向 Pod 中添加原始块设备时，你要在容器内设置设备路径而不是挂载路径。
{{< /note >}}

<!--
### Binding Block Volumes

If a user requests a raw block volume by indicating this using the `volumeMode`
field in the PersistentVolumeClaim spec, the binding rules differ slightly from
previous releases that didn't consider this mode as part of the spec.
Listed is a table of possible combinations the user and admin might specify for
requesting a raw block device. The table indicates if the volume will be bound or
not given the combinations: Volume binding matrix for statically provisioned volumes:
-->
### 绑定块卷     {#binding-block-volumes}

如果用户通过 PersistentVolumeClaim 规约的 `volumeMode` 字段来表明对原始块设备的请求，
绑定规则与之前版本中未在规约中考虑此模式的实现略有不同。
下面列举的表格是用户和管理员可以为请求原始块设备所作设置的组合。
此表格表明在不同的组合下卷是否会被绑定。

静态制备卷的卷绑定矩阵：

<!--
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
-->
| PV volumeMode | PVC volumeMode  | Result           |
| --------------|:---------------:| ----------------:|
|   未指定      | 未指定          | 绑定             |
|   未指定      | Block           | 不绑定           |
|   未指定      | Filesystem      | 绑定             |
|   Block       | 未指定          | 不绑定           |
|   Block       | Block           | 绑定             |
|   Block       | Filesystem      | 不绑定           |
|   Filesystem  | Filesystem      | 绑定             |
|   Filesystem  | Block           | 不绑定           |
|   Filesystem  | 未指定          | 绑定             |

{{< note >}}
<!--
Only statically provisioned volumes are supported for alpha release. Administrators
should take care to consider these values when working with raw block devices.
-->
Alpha 发行版本中仅支持静态制备的卷。
管理员需要在处理原始块设备时小心处理这些值。
{{< /note >}}

<!--
## Volume Snapshot and Restore Volume from Snapshot Support
-->
## 对卷快照及从卷快照中恢复卷的支持   {#volume-snapshot-and-restore-volume-from-snapshot-support}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

<!--
Volume snapshots only support the out-of-tree CSI volume plugins.
For details, see [Volume Snapshots](/docs/concepts/storage/volume-snapshots/).
In-tree volume plugins are deprecated. You can read about the deprecated volume
plugins in the
[Volume Plugin FAQ](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).
-->
卷快照（Volume Snapshot）仅支持树外 CSI 卷插件。
有关细节可参阅[卷快照](/zh-cn/docs/concepts/storage/volume-snapshots/)文档。
树内卷插件被弃用。你可以查阅[卷插件 FAQ](https://git.k8s.io/community/sig-storage/volume-plugin-faq.md)
了解已弃用的卷插件。

<!--
### Create a PersistentVolumeClaim from a Volume Snapshot {#create-persistent-volume-claim-from-volume-snapshot}
-->
### 基于卷快照创建 PVC 申领     {#create-persistent-volume-claim-from-volume-snapshot}

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

<!--
## Volume Cloning

[Volume Cloning](/docs/concepts/storage/volume-pvc-datasource/)
only available for CSI volume plugins.
-->
## 卷克隆     {#volume-cloning}

[卷克隆](/zh-cn/docs/concepts/storage/volume-pvc-datasource/)功能特性仅适用于 CSI 卷插件。

<!--
### Create PersistentVolumeClaim from an existing PVC {#create-persistent-volume-claim-from-an-existing-pvc}
-->
### 基于现有 PVC 创建新的 PVC 申领    {#create-persistent-volume-claim-from-an-existing-pvc}

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

<!--
## Volume populators and data sources
-->
## 卷填充器（Populator）与数据源      {#volume-populators-and-data-sources}

{{< feature-state for_k8s_version="v1.24" state="beta" >}}

<!--
Kubernetes supports custom volume populators.
To use custom volume populators, you must enable the `AnyVolumeDataSource`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for
the kube-apiserver and kube-controller-manager.

Volume populators take advantage of a PVC spec field called `dataSourceRef`. Unlike the
`dataSource` field, which can only contain either a reference to another PersistentVolumeClaim
or to a VolumeSnapshot, the `dataSourceRef` field can contain a reference to any object in the
same namespace, except for core objects other than PVCs. For clusters that have the feature
gate enabled, use of the `dataSourceRef` is preferred over `dataSource`.
-->
Kubernetes 支持自定义的卷填充器。要使用自定义的卷填充器，你必须为
kube-apiserver 和 kube-controller-manager 启用 `AnyVolumeDataSource`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

卷填充器利用了 PVC 规约字段 `dataSourceRef`。
不像 `dataSource` 字段只能包含对另一个持久卷申领或卷快照的引用，
`dataSourceRef` 字段可以包含对同一命名空间中任何对象的引用（不包含除 PVC 以外的核心资源）。
对于启用了特性门控的集群，使用 `dataSourceRef` 比 `dataSource` 更好。

<!--
## Cross namespace data sources
-->
## 跨名字空间数据源   {#cross-namespace-data-sources}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

<!--
Kubernetes supports cross namespace volume data sources.
To use cross namespace volume data sources, you must enable the `AnyVolumeDataSource`
and `CrossNamespaceVolumeDataSource`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) for
the kube-apiserver, kube-controller-manager.
Also, you must enable the `CrossNamespaceVolumeDataSource` feature gate for the csi-provisioner.

Enabling the `CrossNamespaceVolumeDataSource` feature gate allows you to specify
a namespace in the dataSourceRef field.
-->
Kubernetes 支持跨名字空间卷数据源。
要使用跨名字空间卷数据源，你必须为 kube-apiserver、kube-controller 管理器启用
`AnyVolumeDataSource` 和 `CrossNamespaceVolumeDataSource`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
此外，你必须为 csi-provisioner 启用 `CrossNamespaceVolumeDataSource` 特性门控。

启用 `CrossNamespaceVolumeDataSource` 特性门控允许你在 dataSourceRef 字段中指定名字空间。

{{< note >}}
<!--
When you specify a namespace for a volume data source, Kubernetes checks for a
ReferenceGrant in the other namespace before accepting the reference.
ReferenceGrant is part of the `gateway.networking.k8s.io` extension APIs.
See [ReferenceGrant](https://gateway-api.sigs.k8s.io/api-types/referencegrant/)
in the Gateway API documentation for details.
This means that you must extend your Kubernetes cluster with at least ReferenceGrant from the
Gateway API before you can use this mechanism.
-->
当你为卷数据源指定名字空间时，Kubernetes 在接受此引用之前在另一个名字空间中检查 ReferenceGrant。
ReferenceGrant 是 `gateway.networking.k8s.io` 扩展 API 的一部分。更多细节请参见 Gateway API 文档中的
[ReferenceGrant](https://gateway-api.sigs.k8s.io/api-types/referencegrant/)。
这意味着你必须在使用此机制之前至少使用 Gateway API 的 ReferenceGrant 来扩展 Kubernetes 集群。
{{< /note >}}

<!--
## Data source references

The `dataSourceRef` field behaves almost the same as the `dataSource` field. If one is
specified while the other is not, the API server will give both fields the same value. Neither
field can be changed after creation, and attempting to specify different values for the two
fields will result in a validation error. Therefore the two fields will always have the same
contents.
-->
## 数据源引用   {#data-source-references}

`dataSourceRef` 字段的行为与 `dataSource` 字段几乎相同。
如果其中一个字段被指定而另一个字段没有被指定，API 服务器将给两个字段相同的值。
这两个字段都不能在创建后改变，如果试图为这两个字段指定不同的值，将导致验证错误。
因此，这两个字段将总是有相同的内容。

<!--
There are two differences between the `dataSourceRef` field and the `dataSource` field that
users should be aware of:

* The `dataSource` field ignores invalid values (as if the field was blank) while the
  `dataSourceRef` field never ignores values and will cause an error if an invalid value is
  used. Invalid values are any core object (objects with no apiGroup) except for PVCs.
* The `dataSourceRef` field may contain different types of objects, while the `dataSource` field
  only allows PVCs and VolumeSnapshots.
-->
在 `dataSourceRef` 字段和 `dataSource` 字段之间有两个用户应该注意的区别：

* `dataSource` 字段会忽略无效的值（如同是空值），
   而 `dataSourceRef` 字段永远不会忽略值，并且若填入一个无效的值，会导致错误。
   无效值指的是 PVC 之外的核心对象（没有 apiGroup 的对象）。
* `dataSourceRef` 字段可以包含不同类型的对象，而 `dataSource` 字段只允许 PVC 和卷快照。

<!--
When the `CrossNamespaceVolumeDataSource` feature is enabled, there are additional differences:

* The `dataSource` field only allows local objects, while the `dataSourceRef` field allows
  objects in any namespaces.  
* When namespace is specified, `dataSource` and `dataSourceRef` are not synced.
-->
当 `CrossNamespaceVolumeDataSource` 特性被启用时，存在其他区别：

* `dataSource` 字段仅允许本地对象，而 `dataSourceRef` 字段允许任何名字空间中的对象。
* 若指定了 namespace，则 `dataSource` 和 `dataSourceRef` 不会被同步。

<!--
Users should always use `dataSourceRef` on clusters that have the feature gate enabled, and
fall back to `dataSource` on clusters that do not. It is not necessary to look at both fields
under any circumstance. The duplicated values with slightly different semantics exist only for
backwards compatibility. In particular, a mixture of older and newer controllers are able to
interoperate because the fields are the same.
-->
用户始终应该在启用了此特性门控的集群上使用 `dataSourceRef`，
在没有启用该特性门控的集群上使用 `dataSource`。
在任何情况下都没有必要查看这两个字段。
这两个字段的值看似相同但是语义稍微不一样，是为了向后兼容。
特别是混用旧版本和新版本的控制器时，它们能够互通。

<!--
### Using volume populators

Volume populators are {{< glossary_tooltip text="controllers" term_id="controller" >}} that can
create non-empty volumes, where the contents of the volume are determined by a Custom Resource.
Users create a populated volume by referring to a Custom Resource using the `dataSourceRef` field:
-->
## 使用卷填充器   {#using-volume-populators}

卷填充器是能创建非空卷的{{< glossary_tooltip text="控制器" term_id="controller" >}}，
其卷的内容通过一个自定义资源决定。
用户通过使用 `dataSourceRef` 字段引用自定义资源来创建一个被填充的卷：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: populated-pvc
spec:
  dataSourceRef:
    name: example-name
    kind: ExampleDataSource
    apiGroup: example.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

<!--
Because volume populators are external components, attempts to create a PVC that uses one
can fail if not all the correct components are installed. External controllers should generate
events on the PVC to provide feedback on the status of the creation, including warnings if
the PVC cannot be created due to some missing component.

You can install the alpha [volume data source validator](https://github.com/kubernetes-csi/volume-data-source-validator)
controller into your cluster. That controller generates warning Events on a PVC in the case that no populator
is registered to handle that kind of data source. When a suitable populator is installed for a PVC, it's the
responsibility of that populator controller to report Events that relate to volume creation and issues during
the process.
-->
因为卷填充器是外部组件，如果没有安装所有正确的组件，试图创建一个使用卷填充器的 PVC 就会失败。
外部控制器应该在 PVC 上产生事件，以提供创建状态的反馈，包括在由于缺少某些组件而无法创建 PVC 的情况下发出警告。

你可以把 alpha 版本的[卷数据源验证器](https://github.com/kubernetes-csi/volume-data-source-validator)
控制器安装到你的集群中。
如果没有填充器处理该数据源的情况下，该控制器会在 PVC 上产生警告事件。
当一个合适的填充器被安装到 PVC 上时，该控制器的职责是上报与卷创建有关的事件，以及在该过程中发生的问题。

<!--
### Using a cross-namespace volume data source
-->
### 使用跨名字空间的卷数据源   {#using-a-cross-namespace-volume-data-source}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

<!--
Create a ReferenceGrant to allow the namespace owner to accept the reference.
You define a populated volume by specifying a cross namespace volume data source
using the `dataSourceRef` field. You must already have a valid ReferenceGrant
in the source namespace:
-->
创建 ReferenceGrant 以允许名字空间属主接受引用。
你通过使用 `dataSourceRef` 字段指定跨名字空间卷数据源，定义填充的卷。
你必须在源名字空间中已经有一个有效的 ReferenceGrant：

```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: allow-ns1-pvc
  namespace: default
spec:
  from:
  - group: ""
    kind: PersistentVolumeClaim
    namespace: ns1
  to:
  - group: snapshot.storage.k8s.io
    kind: VolumeSnapshot
    name: new-snapshot-demo
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: ns1
spec:
  storageClassName: example
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  dataSourceRef:
    apiGroup: snapshot.storage.k8s.io
    kind: VolumeSnapshot
    name: new-snapshot-demo
    namespace: default
  volumeMode: Filesystem
```

<!--
## Writing Portable Configuration

If you're writing configuration templates or examples that run on a wide range of clusters
and need persistent storage, it is recommended that you use the following pattern:
-->
## 编写可移植的配置   {#writing-portable-configuration}

如果你要编写配置模板和示例用来在很多集群上运行并且需要持久性存储，建议你使用以下模式：

<!--
- Include PersistentVolumeClaim objects in your bundle of config (alongside
  Deployments, ConfigMaps, etc).
- Do not include PersistentVolume objects in the config, since the user instantiating
  the config may not have permission to create PersistentVolumes.
-->
- 将 PersistentVolumeClaim 对象包含到你的配置包（Bundle）中，和 Deployment
  以及 ConfigMap 等放在一起。
- 不要在配置中包含 PersistentVolume 对象，因为对配置进行实例化的用户很可能
  没有创建 PersistentVolume 的权限。

<!--
- Give the user the option of providing a storage class name when instantiating
  the template.
  - If the user provides a storage class name, put that value into the
    `persistentVolumeClaim.storageClassName` field.
    This will cause the PVC to match the right storage
    class if the cluster has StorageClasses enabled by the admin.
  - If the user does not provide a storage class name, leave the
    `persistentVolumeClaim.storageClassName` field as nil. This will cause a
    PV to be automatically provisioned for the user with the default StorageClass
    in the cluster. Many cluster environments have a default StorageClass installed,
    or administrators can create their own default StorageClass.
-->
- 为用户提供在实例化模板时指定存储类名称的能力。
  - 仍按用户提供存储类名称，将该名称放到 `persistentVolumeClaim.storageClassName` 字段中。
    这样会使得 PVC 在集群被管理员启用了存储类支持时能够匹配到正确的存储类，
  - 如果用户未指定存储类名称，将 `persistentVolumeClaim.storageClassName` 留空（nil）。
    这样，集群会使用默认 `StorageClass` 为用户自动制备一个存储卷。
    很多集群环境都配置了默认的 `StorageClass`，或者管理员也可以自行创建默认的
    `StorageClass`。

<!--
- In your tooling, watch for PVCs that are not getting bound after some time
  and surface this to the user, as this may indicate that the cluster has no
  dynamic storage support (in which case the user should create a matching PV)
  or the cluster has no storage system (in which case the user cannot deploy
  config requiring PVCs).
-->
- 在你的工具链中，监测经过一段时间后仍未被绑定的 PVC 对象，要让用户知道这些对象，
  因为这可能意味着集群不支持动态存储（因而用户必须先创建一个匹配的 PV），或者
  集群没有配置存储系统（因而用户无法配置需要 PVC 的工作负载配置）。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Creating a PersistentVolume](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume).
* Learn more about [Creating a PersistentVolumeClaim](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolumeclaim).
* Read the [Persistent Storage design document](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).
-->
* 进一步了解[创建持久卷](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolume)。
* 进一步学习[创建 PVC 申领](/zh-cn/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolumeclaim)。
* 阅读[持久存储的设计文档](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md)。

<!--
### API references {#reference}

Read about the APIs described in this page:

* [`PersistentVolume`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/)
* [`PersistentVolumeClaim`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/)
-->
### API 参考    {#reference}

阅读以下页面中描述的 API：

* [`PersistentVolume`](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/)
* [`PersistentVolumeClaim`](/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/)
