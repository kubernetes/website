---
layout: blog
title: "Kubernetes v1.35：可变的 PersistentVolume 节点亲和性（Alpha）"
date: 2026-01-08T10:30:00-08:00
slug: kubernetes-v1-35-mutable-pv-nodeaffinity
author: >
  Weiwen Hu (Alibaba Cloud),
  YuanHui Qiu (Alibaba Cloud)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.35: Mutable PersistentVolume Node Affinity (alpha)"
date: 2026-01-08T10:30:00-08:00
slug: kubernetes-v1-35-mutable-pv-nodeaffinity
author: >
  Weiwen Hu (Alibaba Cloud),
  YuanHui Qiu (Alibaba Cloud)
-->

<!--
The PersistentVolume [node affinity](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#node-affinity) API
dates back to Kubernetes v1.10.
It is widely used to express that volumes may not be equally accessible by all nodes in the cluster.
This field was previously immutable,
and it is now mutable in Kubernetes v1.35 (alpha). This change opens a door to more flexible online volume management.
-->
PersistentVolume 的[节点亲和性](https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes/#node-affinity) API
可以追溯到 Kubernetes v1.10。
它被广泛用于表示卷可能无法被集群中的所有节点平等访问。
该字段以前是不可变的，
现在在 Kubernetes v1.35（Alpha）中变为可变的。此更改为更灵活的在线卷管理打开了大门。

<!--
## Why make node affinity mutable?
-->
## 为什么要使节点亲和性可变？

<!--
This raises an obvious question: why make node affinity mutable now?
While stateless workloads like Deployments can be changed freely
and the changes will be rolled out automatically by re-creating every Pod,
PersistentVolumes (PVs) are stateful and cannot be re-created easily without losing data.
-->
这就提出了一个明显的问题：为什么现在要使节点亲和性可变？
虽然像 Deployments 这样的无状态工作负载可以自由更改，
并且更改会通过重新创建每个 Pod 自动推出，
但 PersistentVolumes（PV）是有状态的，不能在不丢失数据的情况下轻松重新创建。

<!--
However, Storage providers evolve and storage requirements change.
Most notably, multiple providers are offering regional disks now.
Some of them even support live migration from zonal to regional disks, without disrupting the workloads.
This change can be expressed through the
[VolumeAttributesClass](https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/) API,
which recently graduated to GA in 1.34.
However, even if the volume is migrated to regional storage,
Kubernetes still prevents scheduling Pods to other zones because of the node affinity recorded in the PV object.
In this case, you may want to change the PV node affinity from:
-->
然而，存储提供商在发展，存储需求在变化。
最值得注意的是，现在有多个提供商提供区域磁盘。
其中一些甚至支持从区域磁盘到区域存储的实时迁移，而不会中断工作负载。
这种更改可以通过 [VolumeAttributesClass](https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/) API 来表达，
该 API 最近在 1.34 中升级到 GA。
然而，即使卷被迁移到区域存储，
由于 PV 对象中记录的节点亲和性，Kubernetes 仍然阻止将 Pod 调度到其他区域。
在这种情况下，你可能希望将 PV 节点亲和性从：

```yaml
spec:
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: topology.kubernetes.io/zone
          operator: In
          values:
          - us-east1-b
```

<!--
to:
-->
更改为：

```yaml
spec:
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: topology.kubernetes.io/region
          operator: In
          values:
          - us-east1
```

<!--
As another example, providers sometimes offer new generations of disks.
New disks cannot always be attached to older nodes in the cluster.
This accessibility can also be expressed through PV node affinity and ensures the Pods can be scheduled to the right nodes.
But when the disk is upgraded, new Pods using this disk can still be scheduled to older nodes.
To prevent this, you may want to change the PV node affinity from:
-->
另一个例子是，提供商有时会推出新一代磁盘。
新磁盘并不总是能够附加到集群中的旧节点。
这种可访问性也可以通过 PV 节点亲和性来表达，并确保 Pod 可以被调度到正确的节点。
但是当磁盘升级时，使用此磁盘的新 Pod 仍然可以被调度到旧节点。
为了防止这种情况，你可能希望将 PV 节点亲和性从：

```yaml
spec:
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: provider.com/disktype.gen1
          operator: In
          values:
          - available
```

<!--
to:
-->
更改为：

```yaml
spec:
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: provider.com/disktype.gen2
          operator: In
          values:
          - available
```

<!--
So, it is mutable now, a first step towards a more flexible online volume management.
While it is a simple change that removes one validation from the API server,
we still have a long way to go to integrate well with the Kubernetes ecosystem.
-->
所以，它现在是可变的，这是朝着更灵活的在线卷管理迈出的第一步。
虽然这只是从 API 服务器中移除一个验证的简单更改，
但要与 Kubernetes 生态系统良好集成，我们还有很长的路要走。

<!--
## Try it out
-->
## 尝试一下

<!--
This feature is for you if you are a Kubernetes cluster administrator,
and your storage provider allows online update that you want to utilize,
but those updates can affect the accessibility of the volume.
-->
如果你是 Kubernetes 集群管理员，并且你的存储提供商允许你想要利用的在线更新，
但这些更新会影响卷的可访问性，那么此特性适合你。

<!--
Note that changing PV node affinity alone will not actually change the accessibility of the underlying volume.
Before using this feature,
you must first update the underlying volume in the storage provider,
and understand which nodes can access the volume after the update.
You can then enable this feature and keep the PV node affinity in sync.
-->
请注意，仅更改 PV 节点亲和性实际上不会更改底层卷的可访问性。
在使用此特性之前，
你必须首先在存储提供商中更新底层卷，
并了解更新后哪些节点可以访问该卷。
然后你可以启用此特性并保持 PV 节点亲和性同步。

<!--
Currently, this feature is in alpha state.
It is disabled by default, and may subject to change.
To try it out, enable the `MutablePVNodeAffinity` feature gate on APIServer, then you can edit the PV `spec.nodeAffinity` field.
Typically only administrators can edit PVs, please make sure you have the right RBAC permissions.
-->
目前，此特性处于 Alpha 状态。
默认情况下它是禁用的，并且可能会发生变化。
要尝试此特性，请在 APIServer 上启用 `MutablePVNodeAffinity` 特性门控，然后你可以编辑 PV 的 `spec.nodeAffinity` 字段。
通常只有管理员可以编辑 PV，请确保你有正确的 RBAC 权限。

<!--
### Race condition between updating and scheduling
-->
### 更新和调度之间的竞争条件

<!--
There are only a few factors outside of a Pod that can affect the scheduling decision, and PV node affinity is one of them.
It is fine to allow more nodes to access the volume by relaxing node affinity,
but there is a race condition when you try to tighten node affinity:
it is unclear how the Scheduler will see the modified PV in its cache,
so there is a small window where the scheduler may place a Pod on an old node that can no longer access the volume.
In this case, the Pod will stuck at `ContainerCreating` state.
-->
Pod 外部只有少数几个因素可以影响调度决策，PV 节点亲和性就是其中之一。
通过放宽节点亲和性允许更多节点访问卷是没问题的，
但是当你尝试收紧节点亲和性时，存在竞争条件：
尚不清楚调度器将如何在其缓存中看到修改后的 PV，
因此存在一个小窗口，调度器可能会将 Pod 放置在无法再访问该卷的旧节点上。
在这种情况下，Pod 将卡在 `ContainerCreating` 状态。

<!--
One mitigation currently under discussion is for the kubelet to fail Pod startup if the PersistentVolume's node affinity is violated.
This has not landed yet.
So if you are trying this out now, please watch subsequent Pods that use the updated PV,
and make sure they are scheduled onto nodes that can access the volume.
If you update PV and immediately start new Pods in a script, it may not work as intended.
-->
目前正在讨论的一种缓解措施是，如果 PersistentVolume 的节点亲和性被违反，kubelet 将使 Pod 启动失败。
这尚未实现。
因此，如果你现在尝试此特性，请关注使用更新后 PV 的后续 Pod，
并确保它们被调度到可以访问该卷的节点上。
如果你在脚本中更新 PV 并立即启动新 Pod，它可能无法按预期工作。

<!--
## Future integration with CSI (Container Storage Interface)
-->
## 未来与 CSI（容器存储接口）的集成

<!--
Currently, it is up to the cluster administrator to modify both PV's node affinity and the underlying volume in the storage provider.
But manual operations are error-prone and time-consuming.
It is preferred to eventually integrate this with VolumeAttributesClass,
so that an unprivileged user can modify their PersistentVolumeClaim (PVC) to trigger storage-side updates,
and PV node affinity is updated automatically when appropriate, without the need for cluster admin's intervention.
-->
目前，修改 PV 的节点亲和性和存储提供商中的底层卷取决于集群管理员。
但手动操作容易出错且耗时。
最终希望将其与 VolumeAttributesClass 集成，
这样非特权用户可以修改他们的 PersistentVolumeClaim（PVC）来触发存储端更新，
并且 PV 节点亲和性会在适当的时候自动更新，无需集群管理员干预。

<!--
## We welcome your feedback from users and storage driver developers
-->
## 欢迎用户和存储驱动开发者提供反馈

<!--
As noted earlier, this is only a first step.

If you are a Kubernetes user,
we would like to learn how you use (or will use) PV node affinity.
Is it beneficial to update it online in your case?

If you are a CSI driver developer,
would you be willing to implement this feature? How would you like the API to look?
-->
如前所述，这只是第一步。

如果你是 Kubernetes 用户，
我们想了解你如何使用（或将使用）PV 节点亲和性。
在你的情况下，在线更新它是否有益？

如果你是 CSI 驱动开发者，
你愿意实现此特性吗？你希望 API 是什么样子的？

<!--
Please provide your feedback via:
- Slack channel [#sig-storage](https://kubernetes.slack.com/messages/sig-storage).
- Mailing list [kubernetes-sig-storage](https://groups.google.com/a/kubernetes.io/g/sig-storage).
- The KEP issue [Mutable PersistentVolume Node Affinity](https://kep.k8s.io/5381).

For any inquiries or specific questions related to this feature, please reach out to the [SIG Storage community](https://github.com/kubernetes/community/tree/master/sig-storage).
-->
请通过以下方式提供反馈：
- Slack 频道 [#sig-storage](https://kubernetes.slack.com/messages/sig-storage)。
- 邮件列表 [kubernetes-sig-storage](https://groups.google.com/a/kubernetes.io/g/sig-storage)。
- KEP Issue [Mutable PersistentVolume Node Affinity](https://kep.k8s.io/5381)。

有关此特性的任何询问或具体问题，请联系
[SIG Storage 社区](https://github.com/kubernetes/community/tree/master/sig-storage)。
