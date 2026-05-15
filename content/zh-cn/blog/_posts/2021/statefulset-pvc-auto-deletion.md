---
layout: blog
title: 'Kubernetes 1.23: StatefulSet PVC 自动删除 (alpha)'
date: 2021-12-16
slug: kubernetes-1-23-statefulset-pvc-auto-deletion
---
<!--
layout: blog
title: 'Kubernetes 1.23: StatefulSet PVC Auto-Deletion (alpha)'
date: 2021-12-16
slug: kubernetes-1-23-statefulset-pvc-auto-deletion
-->

<!--
**Author:** Matthew Cary (Google)
-->
**作者:** Matthew Cary (谷歌)

<!--
Kubernetes v1.23 introduced a new, alpha-level policy for
[StatefulSets](/docs/concepts/workloads/controllers/statefulset/) that controls the lifetime of
[PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/) (PVCs) generated from the
StatefulSet spec template for cases when they should be deleted automatically when the StatefulSet
is deleted or pods in the StatefulSet are scaled down.
-->
Kubernetes v1.23 为 [StatefulSets](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
引入了一个新的 alpha 级策略，用来控制由 StatefulSet 规约模板生成的
[PersistentVolumeClaims](/zh-cn/docs/concepts/storage/persistent-volumes/) (PVCs) 的生命周期，
用于当删除 StatefulSet 或减少 StatefulSet 中的 Pods 数量时 PVCs 应该被自动删除的场景。

<!--
## What problem does this solve?
-->
## 它解决了什么问题？

<!--
A StatefulSet spec can include Pod and PVC templates. When a replica is first created, the
Kubernetes control plane creates a PVC for that replica if one does not already exist. The behavior
before Kubernetes v1.23 was that the control plane never cleaned up the PVCs created for
StatefulSets - this was left up to the cluster administrator, or to some add-on automation that
you’d have to find, check suitability, and deploy. The common pattern for managing PVCs, either
manually or through tools such as Helm, is that the PVCs are tracked by the tool that manages them,
with explicit lifecycle. Workflows that use StatefulSets must determine on their own what PVCs are
created by a StatefulSet and what their lifecycle should be.
-->
StatefulSet 规约中可以包含 Pod 和 PVC 的模板。当副本先被创建时，如果 PVC 还不存在，
Kubernetes 控制面会为该副本自动创建一个 PVC。在 Kubernetes 1.23 版本之前，
控制面不会删除 StatefulSet 创建的 PVCs——这依赖集群管理员或你需要部署一些额外的适用的自动化工具来处理。
管理 PVC 的常见模式是通过手动或使用 Helm 等工具，PVC 的具体生命周期由管理它的工具跟踪。
使用 StatefulSet 时必须自行确定 StatefulSet 创建哪些 PVC，以及它们的生命周期应该是什么。

<!--
Before this new feature, when a StatefulSet-managed replica disappears, either because the
StatefulSet is reducing its replica count, or because its StatefulSet is deleted, the PVC and its
backing volume remains and must be manually deleted. While this behavior is appropriate when the
data is critical, in many cases the persistent data in these PVCs is either temporary, or can be
reconstructed from another source. In those cases, PVCs and their backing volumes remaining after
their StatefulSet or replicas have been deleted are not necessary, incur cost, and require manual
cleanup.
-->
在这个新特性之前，当一个 StatefulSet 管理的副本消失时，无论是因为 StatefulSet 减少了它的副本数，
还是因为它的 StatefulSet 被删除了，PVC 及其下层的卷仍然存在，需要手动删除。
当存储数据比较重要时，这样做是合理的，但在许多情况下，这些 PVC 中的持久化数据要么是临时的，
要么可以从另一个源端重建。在这些情况下，删除 StatefulSet 或减少副本后留下的 PVC 及其下层的卷是不必要的，
还会产生成本，需要手动清理。

<!--
## The new StatefulSet PVC retention policy
-->
## 新的 StatefulSet PVC 保留策略

<!--
If you enable the alpha feature, a StatefulSet spec includes a PersistentVolumeClaim retention
policy.  This is used to control if and when PVCs created from a StatefulSet’s `volumeClaimTemplate`
are deleted.  This first iteration of the retention policy contains two situations where PVCs may be
deleted.
-->
如果你启用这个新 alpha 特性，StatefulSet 规约中就可以包含 PersistentVolumeClaim 的保留策略。
该策略用于控制是否以及何时删除基于 StatefulSet 的 `volumeClaimTemplate` 属性所创建的 PVCs。
保留策略的首次迭代包含两种可能删除 PVC 的情况。

<!--
The first situation is when the StatefulSet resource is deleted (which implies that all replicas are
also deleted). This is controlled by the `whenDeleted` policy. The second situation, controlled by
`whenScaled` is when the StatefulSet is scaled down, which removes some but not all of the replicas
in a StatefulSet. In both cases the policy can either be `Retain`, where the corresponding PVCs are
not touched, or `Delete`, which means that PVCs are deleted. The deletion is done with a normal
[object deletion](/docs/concepts/architecture/garbage-collection/), so that, for example, all
retention policies for the underlying PV are respected.
-->
第一种情况是 StatefulSet 资源被删除时（这意味着所有副本也被删除），这由 `whenDeleted` 策略控制的。
第二种情况是 StatefulSet 缩小时，即删除 StatefulSet 部分副本，这由 `whenScaled` 策略控制。
在这两种情况下，策略即可以是 `Retain` 不涉及相应 PVCs 的改变，也可以是 `Delete` 即删除对应的 PVCs。
删除是通过普通的[对象删除](/zh-cn/docs/concepts/architecture/garbage-collection/)完成的，
因此，的所有保留策略都会被遵照执行。

<!--
This policy forms a matrix with four cases. I’ll walk through and give an example for each one.
-->
该策略形成包含四种情况的矩阵。我将逐一介绍，并为每一种情况给出一个例子。

<!--
  * **`whenDeleted` and `whenScaled` are both `Retain`.** This matches the existing behavior for
    StatefulSets, where no PVCs are deleted. This is also the default retention policy. It’s
    appropriate to use when data on StatefulSet volumes may be irreplaceable and should only be
    deleted manually.
-->
  * **`whenDeleted` 和 `whenScaled` 都是 `Retain`。** 这与 StatefulSets 的现有行为一致，
    即不删除 PVCs。 这也是默认的保留策略。它适用于 StatefulSet
    卷上的数据是不可替代的且只能手动删除的情况。
 
<!--
  * **`whenDeleted` is `Delete` and `whenScaled` is `Retain`.** In this case, PVCs are deleted only when
    the entire StatefulSet is deleted. If the StatefulSet is scaled down, PVCs are not touched,
    meaning they are available to be reattached if a scale-up occurs with any data from the previous
    replica. This might be used for a temporary StatefulSet, such as in a CI instance or ETL
    pipeline, where the data on the StatefulSet is needed only during the lifetime of the
    StatefulSet lifetime, but while the task is running the data is not easily reconstructible. Any
    retained state is needed for any replicas that scale down and then up.
-->
  * **`whenDeleted` 是 `Delete` 但 `whenScaled` 是 `Retain`。** 在这种情况下，
    只有当整个 StatefulSet 被删除时，PVCs 才会被删除。
    如果减少 StatefulSet 副本，PVCs 不会删除，这意味着如果增加副本时，可以从前一个副本重新连接所有数据。
    这可能用于临时的 StatefulSet，例如在 CI 实例或 ETL 管道中，
    StatefulSet 上的数据仅在 StatefulSet 生命周期内才需要，但在任务运行时数据不易重构。
    任何保留状态对于所有先缩小后扩大的副本都是必需的。

<!--
  * **`whenDeleted` and `whenScaled` are both `Delete`.** PVCs are deleted immediately when their
    replica is no longer needed. Note this does not include when a Pod is deleted and a new version
    rescheduled, for example when a node is drained and Pods need to migrate elsewhere. The PVC is
    deleted only when the replica is no longer needed as signified by a scale-down or StatefulSet
    deletion. This use case is for when data does not need to live beyond the life of its
    replica. Perhaps the data is easily reconstructable and the cost savings of deleting unused PVCs
    is more important than quick scale-up, or perhaps that when a new replica is created, any data
    from a previous replica is not usable and must be reconstructed anyway.
-->
  * **`whenDeleted` 和 `whenScaled` 都是 `Delete`。** 当其副本不再被需要时，PVCs 会立即被删除。
    注意，这并不包括 Pod 被删除且有新版本被调度的情况，例如当节点被腾空而 Pod 需要迁移到别处时。
    只有当副本不再被需要时，如按比例缩小或删除 StatefulSet 时，才会删除 PVC。
    此策略适用于数据生命周期短于副本生命周期的情况。即数据很容易重构，
    且删除未使用的 PVC 所节省的成本比快速增加副本更重要，或者当创建一个新的副本时，
    来自以前副本的任何数据都不可用，必须重新构建。

<!--
  * **`whenDeleted` is `Retain` and `whenScaled` is `Delete`.** This is similar to the previous case,
    when there is little benefit to keeping PVCs for fast reuse during scale-up. An example of a
    situation where you might use this is an Elasticsearch cluster. Typically you would scale that
    workload up and down to match demand, whilst ensuring a minimum number of replicas (for example:
    3). When scaling down, data is migrated away from removed replicas and there is no benefit to
    retaining those PVCs. However, it can be useful to bring the entire Elasticsearch cluster down
    temporarily for maintenance. If you need to take the Elasticsearch system offline, you can do
    this by temporarily deleting the StatefulSet, and then bringing the Elasticsearch cluster back
    by recreating the StatefulSet. The PVCs holding the Elasticsearch data will still exist and the
    new replicas will automatically use them.
-->
  * **`whenDeleted` 是 `Retain` 但 `whenScaled` 是 `Delete`。** 这与前一种情况类似，
    在增加副本时用保留的 PVCs 快速重构几乎没有什么益处。例如 Elasticsearch 集群就是使用的这种方式。
    通常，你需要增大或缩小工作负载来满足业务诉求，同时确保最小数量的副本（例如：3）。
    当减少副本时，数据将从已删除的副本迁移出去，保留这些 PVCs 没有任何用处。
    但是，这对临时关闭整个 Elasticsearch 集群进行维护时是很有用的。
    如果需要使 Elasticsearch 系统脱机，可以通过临时删除 StatefulSet 来实现，
    然后通过重新创建 StatefulSet 来恢复 Elasticsearch 集群。
    保存 Elasticsearch 数据的 PVCs 不会被删除，新的副本将自动使用它们。
  
<!--
  Visit the
[documentation](/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-policies) to
see all the details.
-->
查阅[文档](/zh-cn/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-policies)
获取更多详细信息。

<!--
## What’s next?
-->
## 下一步是什么？

<!--
Enable the feature and try it out! Enable the `StatefulSetAutoDeletePVC` feature gate on a cluster,
then create a StatefulSet using the new policy. Test it out and tell us what you think!
-->
启用该功能并尝试一下！在集群上启用 `StatefulSetAutoDeletePVC` 功能，然后使用新策略创建 StatefulSet。
测试一下，告诉我们你的体验！

<!--
I'm very curious to see if this owner reference mechanism works well in practice. For example, we
realized there is no mechanism in Kubernetes for knowing who set a reference, so it’s possible that
the StatefulSet controller may fight with custom controllers that set their own
references. Fortunately, maintaining the existing retention behavior does not involve any new owner
references, so default behavior will be compatible.
-->
我很好奇这个属主引用机制在实践中是否有效。例如，我们意识到 Kubernetes 中没有可以知道谁设置了引用的机制，
因此 StatefulSet 控制器可能会与设置自己的引用的自定义控制器发生冲突。
幸运的是，维护现有的保留行为不涉及任何新属主引用，因此默认行为是兼容的。

<!--
Please tag any issues you report with the label `sig/apps` and assign them to Matthew Cary
([@mattcary](https://github.com/mattcary) at GitHub).
-->
请用标签 `sig/apps` 标记你报告的任何问题，并将它们分配给 Matthew Cary
(在 GitHub上 [@mattcary](https://github.com/mattcary))。

<!--
Enjoy!
-->
尽情体验吧！

