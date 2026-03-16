---
layout: blog
title: 'Kubernetes 1.31：防止无序删除时 PersistentVolume 泄漏'
date: 2024-08-16
slug: kubernetes-1-31-prevent-persistentvolume-leaks-when-deleting-out-of-order
author: >
  Deepak Kinni (Broadcom)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes 1.31: Prevent PersistentVolume Leaks When Deleting out of Order'
date: 2024-08-16
slug: kubernetes-1-31-prevent-persistentvolume-leaks-when-deleting-out-of-order
author: >
  Deepak Kinni (Broadcom)
-->

<!--
[PersistentVolume](/docs/concepts/storage/persistent-volumes/) (or PVs for short) are
associated with [Reclaim Policy](/docs/concepts/storage/persistent-volumes/#reclaim-policy).
The reclaim policy is used to determine the actions that need to be taken by the storage
backend on deletion of the PVC Bound to a PV.
When the reclaim policy is `Delete`, the expectation is that the storage backend
releases the storage resource allocated for the PV. In essence, the reclaim
policy needs to be honored on PV deletion.

With the recent Kubernetes v1.31 release, a beta feature lets you configure your
cluster to behave that way and honor the configured reclaim policy.
-->
[PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)（简称 PV）
具有与之关联的[回收策略](/zh-cn/docs/concepts/storage/persistent-volumes/#reclaim-policy)。
回收策略用于确定在删除绑定到 PV 的 PVC 时存储后端需要采取的操作。当回收策略为 `Delete` 时，
期望存储后端释放为 PV 所分配的存储资源。实际上，在 PV 被删除时就需要执行此回收策略。

在最近发布的 Kubernetes v1.31 版本中，一个 Beta 特性允许你配置集群以这种方式运行并执行你配置的回收策略。

<!--
## How did reclaim work in previous Kubernetes releases?

[PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#Introduction) (or PVC for short) is
a user's request for storage. A PV and PVC are considered [Bound](/docs/concepts/storage/persistent-volumes/#Binding)
if a newly created PV or a matching PV is found. The PVs themselves are
backed by volumes allocated by the storage backend.
-->
## 在以前的 Kubernetes 版本中回收是如何工作的？

[PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#Introduction)
（简称 PVC）是用户对存储的请求。如果新创建了 PV 或找到了匹配的 PV，那么此 PV 和此 PVC
被视为[已绑定](/zh-cn/docs/concepts/storage/persistent-volumes/#Binding)。
PV 本身是由存储后端所分配的卷支持的。

<!--
Normally, if the volume is to be deleted, then the expectation is to delete the
PVC for a bound PV-PVC pair. However, there are no restrictions on deleting a PV
before deleting a PVC.

First, I'll demonstrate the behavior for clusters running an older version of Kubernetes.

#### Retrieve a PVC that is bound to a PV

Retrieve an existing PVC `example-vanilla-block-pvc`
-->
通常，如果卷要被删除，对应的预期是为一个已绑定的 PV-PVC 对删除其中的 PVC。
不过，对于在删除 PVC 之前可否删除 PV 并没有限制。

首先，我将演示运行旧版本 Kubernetes 的集群的行为。

#### 检索绑定到 PV 的 PVC

检索现有的 PVC `example-vanilla-block-pvc`：

```shell
kubectl get pvc example-vanilla-block-pvc
```

<!--
The following output shows the PVC and its bound PV; the PV is shown under the `VOLUME` column:
-->
以下输出显示了 PVC 及其绑定的 PV；此 PV 显示在 `VOLUME` 列下：

```
NAME                        STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS               AGE
example-vanilla-block-pvc   Bound    pvc-6791fdd4-5fad-438e-a7fb-16410363e3da   5Gi        RWO            example-vanilla-block-sc   19s
```

<!--
#### Delete PV

When I try to delete a bound PV, the kubectl session blocks and the `kubectl` 
tool does not return back control to the shell; for example:
-->
#### 删除 PV

当我尝试删除已绑定的 PV 时，kubectl 会话被阻塞，
且 `kubectl` 工具不会将控制权返回给 Shell；例如：

```shell
kubectl delete pv pvc-6791fdd4-5fad-438e-a7fb-16410363e3da
```

```
persistentvolume "pvc-6791fdd4-5fad-438e-a7fb-16410363e3da" deleted
^C
```

<!--
#### Retrieving the PV
-->
#### 检索 PV

```shell
kubectl get pv pvc-6791fdd4-5fad-438e-a7fb-16410363e3da
```

<!--
It can be observed that the PV is in a `Terminating` state
-->
你可以观察到 PV 处于 `Terminating` 状态：

```
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS        CLAIM                               STORAGECLASS               REASON   AGE
pvc-6791fdd4-5fad-438e-a7fb-16410363e3da   5Gi        RWO            Delete           Terminating   default/example-vanilla-block-pvc   example-vanilla-block-sc            2m23s
```

<!--
#### Delete PVC
-->
#### 删除 PVC

```shell
kubectl delete pvc example-vanilla-block-pvc
```

<!--
The following output is seen if the PVC gets successfully deleted:
-->
如果 PVC 被成功删除，则会看到以下输出：

```
persistentvolumeclaim "example-vanilla-block-pvc" deleted
```

<!--
The PV object from the cluster also gets deleted. When attempting to retrieve the PV
it will be observed that the PV is no longer found:
-->
集群中的 PV 对象也被删除。当尝试检索 PV 时，你会观察到该 PV 已不再存在：

```shell
kubectl get pv pvc-6791fdd4-5fad-438e-a7fb-16410363e3da
```

```
Error from server (NotFound): persistentvolumes "pvc-6791fdd4-5fad-438e-a7fb-16410363e3da" not found
```

<!--
Although the PV is deleted, the underlying storage resource is not deleted and
needs to be removed manually.

To sum up, the reclaim policy associated with the PersistentVolume is currently
ignored under certain circumstances. For a `Bound` PV-PVC pair, the ordering of PV-PVC
deletion determines whether the PV reclaim policy is honored. The reclaim policy
is honored if the PVC is deleted first; however, if the PV is deleted prior to
deleting the PVC, then the reclaim policy is not exercised. As a result of this behavior,
the associated storage asset in the external infrastructure is not removed.
-->
尽管 PV 被删除，但下层存储资源并未被删除，需要手动移除。

总结一下，与 PersistentVolume 关联的回收策略在某些情况下会被忽略。
对于 `Bound` 的 PV-PVC 对，PV-PVC 删除的顺序决定了回收策略是否被执行。
如果 PVC 先被删除，则回收策略被执行；但如果在删除 PVC 之前 PV 被删除，
则回收策略不会被执行。因此，外部基础设施中关联的存储资产未被移除。

<!--
## PV reclaim policy with Kubernetes v1.31

The new behavior ensures that the underlying storage object is deleted from the backend when users attempt to delete a PV manually.

#### How to enable new behavior?

To take advantage of the new behavior, you must have upgraded your cluster to the v1.31 release of Kubernetes
and run the CSI [`external-provisioner`](https://github.com/kubernetes-csi/external-provisioner) version `5.0.1` or later.
-->
## Kubernetes v1.31 的 PV 回收策略

新的行为确保当用户尝试手动删除 PV 时，下层存储对象会从后端被删除。

#### 如何启用新的行为？

要利用新的行为，你必须将集群升级到 Kubernetes v1.31 版本，并运行
CSI [`external-provisioner`](https://github.com/kubernetes-csi/external-provisioner)
v5.0.1 或更高版本。

<!--
#### How does it work?

For CSI volumes, the new behavior is achieved by adding a [finalizer](/docs/concepts/overview/working-with-objects/finalizers/) `external-provisioner.volume.kubernetes.io/finalizer`
on new and existing PVs. The finalizer is only removed after the storage from the backend is deleted.
`

An example of a PV with the finalizer, notice the new finalizer in the finalizers list
-->
#### 工作方式

对于 CSI 卷，新的行为是通过在新创建和现有的 PV 上添加
[Finalizer](/zh-cn/docs/concepts/overview/working-with-objects/finalizers/)
`external-provisioner.volume.kubernetes.io/finalizer` 来实现的。
只有在后端存储被删除后，Finalizer 才会被移除。

下面是一个带 Finalizer 的 PV 示例，请注意 Finalizer 列表中的新 Finalizer：

```shell
kubectl get pv pvc-a7b7e3ba-f837-45ba-b243-dec7d8aaed53 -o yaml
```

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  annotations:
    pv.kubernetes.io/provisioned-by: csi.vsphere.vmware.com
  creationTimestamp: "2021-11-17T19:28:56Z"
  finalizers:
  - kubernetes.io/pv-protection
  - external-provisioner.volume.kubernetes.io/finalizer
  name: pvc-a7b7e3ba-f837-45ba-b243-dec7d8aaed53
  resourceVersion: "194711"
  uid: 087f14f2-4157-4e95-8a70-8294b039d30e
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 1Gi
  claimRef:
    apiVersion: v1
    kind: PersistentVolumeClaim
    name: example-vanilla-block-pvc
    namespace: default
    resourceVersion: "194677"
    uid: a7b7e3ba-f837-45ba-b243-dec7d8aaed53
  csi:
    driver: csi.vsphere.vmware.com
    fsType: ext4
    volumeAttributes:
      storage.kubernetes.io/csiProvisionerIdentity: 1637110610497-8081-csi.vsphere.vmware.com
      type: vSphere CNS Block Volume
    volumeHandle: 2dacf297-803f-4ccc-afc7-3d3c3f02051e
  persistentVolumeReclaimPolicy: Delete
  storageClassName: example-vanilla-block-sc
  volumeMode: Filesystem
status:
  phase: Bound
```

<!--
The [finalizer](/docs/concepts/overview/working-with-objects/finalizers/) prevents this
PersistentVolume from being removed from the
cluster. As stated previously, the finalizer is only removed from the PV object
after it is successfully deleted from the storage backend. To learn more about
finalizers, please refer to [Using Finalizers to Control Deletion](/blog/2021/05/14/using-finalizers-to-control-deletion/).

Similarly, the finalizer `kubernetes.io/pv-controller` is added to dynamically provisioned in-tree plugin volumes.
-->
[Finalizer](/zh-cn/docs/concepts/overview/working-with-objects/finalizers/)
防止此 PersistentVolume 从集群中被移除。如前文所述，Finalizer 仅在从存储后端被成功删除后才会从
PV 对象中被移除。进一步了解 Finalizer，
请参阅[使用 Finalizer 控制删除](/blog/2021/05/14/using-finalizers-to-control-deletion/)。

同样，Finalizer `kubernetes.io/pv-controller` 也被添加到动态制备的树内插件卷中。

<!--
#### What about CSI migrated volumes?

The fix applies to CSI migrated volumes as well. 

### Some caveats

The fix does not apply to statically provisioned in-tree plugin volumes.
-->
#### 有关 CSI 迁移的卷

本次修复同样适用于 CSI 迁移的卷。

### 一些注意事项

本次修复不适用于静态制备的树内插件卷。

<!--
### References
-->
### 参考

* [KEP-2644](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2644-honor-pv-reclaim-policy)
* [Volume leak issue](https://github.com/kubernetes-csi/external-provisioner/issues/546)

<!--
### How do I get involved?

The Kubernetes Slack channel [SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and migration working group teams.

Special thanks to the following people for the insightful reviews, thorough consideration and valuable contribution:
-->
### 我该如何参与？

Kubernetes Slack
[SIG Storage 交流频道](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact)是与
SIG Storage 和迁移工作组团队联系的良好媒介。

特别感谢以下人员的用心评审、周全考虑和宝贵贡献：

* Fan Baofa (carlory)
* Jan Šafránek (jsafrane)
* Xing Yang (xing-yang)
* Matthew Wong (wongma7)

<!--
Join the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage) if you're interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system. We’re rapidly growing and always welcome new contributors.
-->
如果你有兴趣参与 CSI 或 Kubernetes Storage 系统任何部分的设计和开发，请加入
[Kubernetes Storage SIG](https://github.com/kubernetes/community/tree/master/sig-storage)。
我们正在快速成长，始终欢迎新的贡献者。
