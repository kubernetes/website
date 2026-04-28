---
layout: blog
title: 'Kubernetes v1.33：防止无序删除时 PersistentVolume 泄漏特性进阶到 GA'
date: 2025-05-05T10:30:00-08:00
slug: kubernetes-v1-33-prevent-persistentvolume-leaks-when-deleting-out-of-order-graduate-to-ga
author: >
  Deepak Kinni (Broadcom)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.33: Prevent PersistentVolume Leaks When Deleting out of Order graduates to GA'
date: 2025-05-05T10:30:00-08:00
slug: kubernetes-v1-33-prevent-persistentvolume-leaks-when-deleting-out-of-order-graduate-to-ga
author: >
  Deepak Kinni (Broadcom)
-->

<!--
I am thrilled to announce that the feature to prevent
[PersistentVolume](/docs/concepts/storage/persistent-volumes/) (or PVs for short)
leaks when deleting out of order has graduated to General Availability (GA) in
Kubernetes v1.33! This improvement, initially introduced as a beta
feature in Kubernetes v1.31, ensures that your storage resources are properly
reclaimed, preventing unwanted leaks.
-->
我很高兴地宣布，当无序删除时防止
[PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)（简称 PV）
泄漏的特性已经在 Kubernetes v1.33 中进阶为正式版（GA）！这项改进最初在
Kubernetes v1.31 中作为 Beta 特性引入，
确保你的存储资源能够被正确回收，防止不必要的泄漏。

<!--
## How did reclaim work in previous Kubernetes releases?

[PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#Introduction) (or PVC for short) is
a user's request for storage. A PV and PVC are considered [Bound](/docs/concepts/storage/persistent-volumes/#Binding)
if a newly created PV or a matching PV is found. The PVs themselves are
backed by volumes allocated by the storage backend.
-->
## 以前的 Kubernetes 版本中 reclaim 是如何工作的？

[PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#Introduction)（简称 PVC）
是用户对存储的请求。如果创建了新的 PV 或找到了匹配的 PV，则认为 PV 和 PVC
是[绑定](/zh-cn/docs/concepts/storage/persistent-volumes/#Binding)的。
PV 本身由存储后端分配的卷支持。

<!--
Normally, if the volume is to be deleted, then the expectation is to delete the
PVC for a bound PV-PVC pair. However, there are no restrictions on deleting a PV
before deleting a PVC.
-->
通常，如果卷需要被删除，则预期是删除绑定的 PV-PVC 对的 PVC。但是，
删除 PVC 之前并没有限制不能删除 PV。

<!--
For a `Bound` PV-PVC pair, the ordering of PV-PVC deletion determines whether
the PV reclaim policy is honored. The reclaim policy is honored if the PVC is
deleted first; however, if the PV is deleted prior to deleting the PVC, then the
reclaim policy is not exercised. As a result of this behavior, the associated
storage asset in the external infrastructure is not removed.
-->
对于一个“已绑定”的 PV-PVC 对，PV 和 PVC 的删除顺序决定了是否遵守 PV 回收策略。
如果先删除 PVC，则会遵守回收策略；然而，如果在删除 PVC 之前删除了 PV，
则不会执行回收策略。因此，外部基础设施中相关的存储资源不会被移除。

<!--
## PV reclaim policy with Kubernetes v1.33

With the graduation to GA in Kubernetes v1.33, this issue is now resolved. Kubernetes
now reliably honors the configured `Delete` reclaim policy, even when PVs are deleted
before their bound PVCs. This is achieved through the use of finalizers,
ensuring that the storage backend releases the allocated storage resource as intended.
-->
## 在 Kubernetes v1.33 中的 PV 回收策略

随着在 Kubernetes v1.33 中升级为 GA，这个问题现在得到了解决。
Kubernetes 现在可靠地遵循配置的 `Delete` 回收策略（即使在删除 PV
时，其绑定的 PVC 尚未被删除）。这是通过使用 Finalizer 来实现的，
确保存储后端如预期释放分配的存储资源。

<!--
### How does it work?

For CSI volumes, the new behavior is achieved by adding a [finalizer](/docs/concepts/overview/working-with-objects/finalizers/) `external-provisioner.volume.kubernetes.io/finalizer`
on new and existing PVs. The finalizer is only removed after the storage from the backend is deleted. Addition or removal of finalizer is handled by `external-provisioner`

An example of a PV with the finalizer, notice the new finalizer in the finalizers list
-->
### 它是如何工作的？

对于 CSI 卷，新的行为是通过在新创建和现有的 PV 上添加
[Finalizer](/zh-cn/docs/concepts/overview/working-with-objects/finalizers/)
`external-provisioner.volume.kubernetes.io/finalizer` 来实现的。
只有在后端存储被删除后，Finalizer 才会被移除。

下面是一个带 Finalizer 的 PV 示例，请注意 Finalizer 列表中的新 Finalizer：

```
kubectl get pv pvc-a7b7e3ba-f837-45ba-b243-dec7d8aaed53 -o yaml
```

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  annotations:
    pv.kubernetes.io/provisioned-by: csi.example.driver.com
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
    driver: csi.example.driver.com
    fsType: ext4
    volumeAttributes:
      storage.kubernetes.io/csiProvisionerIdentity: 1637110610497-8081-csi.example.driver.com
      type: CNS Block Volume
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
### Important note

The fix does not apply to statically provisioned in-tree plugin volumes.
-->
### 重要提示

此修复不适用于静态制备的内置插件卷。

<!--
## How to enable new behavior?

To take advantage of the new behavior, you must have upgraded your cluster to the v1.33 release of Kubernetes
and run the CSI [`external-provisioner`](https://github.com/kubernetes-csi/external-provisioner) version `5.0.1` or later.
The feature was released as beta in v1.31 release of Kubernetes, where it was enabled by default.
-->
## 如何启用新行为？

要利用新行为，你必须将集群升级到 Kubernetes 的 v1.33 版本，
并运行 CSI [`external-provisioner`](https://github.com/kubernetes-csi/external-provisioner)
5.0.1 或更新版本。
此特性在 Kubernetes 的 v1.31 版本中作为 Beta 版发布，并且默认启用。

<!--
## References

* [KEP-2644](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2644-honor-pv-reclaim-policy)
* [Volume leak issue](https://github.com/kubernetes-csi/external-provisioner/issues/546)
* [Beta Release Blog](/blog/2024/08/16/kubernetes-1-31-prevent-persistentvolume-leaks-when-deleting-out-of-order/)
-->
## 参考

* [KEP-2644](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2644-honor-pv-reclaim-policy)
* [卷泄漏问题](https://github.com/kubernetes-csi/external-provisioner/issues/546)
* [Beta 版发布博客](/zh-cn/blog/2024/08/16/kubernetes-1-31-prevent-persistentvolume-leaks-when-deleting-out-of-order/)

<!--
## How do I get involved?

The Kubernetes Slack channel [SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and migration working group teams.

Special thanks to the following people for the insightful reviews, thorough consideration and valuable contribution:
-->
## 如何参与？

Kubernetes Slack 频道
[SIG Storage 交流渠道](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact)是接触
SIG Storage 和迁移工作组团队的绝佳方式。

特别感谢以下人员的深入审查、细致考虑和宝贵贡献：

* Fan Baofa (carlory)
* Jan Šafránek (jsafrane)
* Xing Yang (xing-yang)
* Matthew Wong (wongma7)

<!--
Join the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage) if you're interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system. We’re rapidly growing and always welcome new contributors.
-->
如果你对 CSI 或 Kubernetes 存储系统的任何部分的设计和开发感兴趣，
可以加入 [Kubernetes 存储特别兴趣小组（SIG）](https://github.com/kubernetes/community/tree/master/sig-storage)。
我们正在迅速成长，并且总是欢迎新的贡献者。
