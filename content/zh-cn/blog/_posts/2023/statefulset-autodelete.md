---
layout: blog
title: 'Kubernetes 1.27: StatefulSet PVC 自动删除(beta)'
date: 2023-05-04
slug: kubernetes-1-27-statefulset-pvc-auto-deletion-beta
---
<!--
layout: blog
title: 'Kubernetes 1.27: StatefulSet PVC Auto-Deletion (beta)'
date: 2023-05-04
slug: kubernetes-1-27-statefulset-pvc-auto-deletion-beta
-->

<!--
**Author:** Matthew Cary (Google)
-->
**作者**：Matthew Cary (Google)

**译者**：顾欣 (ICBC)

<!--
Kubernetes v1.27 graduated to beta a new policy mechanism for
[`StatefulSets`](/docs/concepts/workloads/controllers/statefulset/) that controls the lifetime of
their [`PersistentVolumeClaims`](/docs/concepts/storage/persistent-volumes/) (PVCs). The new PVC
retention policy lets users specify if the PVCs generated from the `StatefulSet` spec template should
be automatically deleted or retrained when the `StatefulSet` is deleted or replicas in the `StatefulSet`
are scaled down.
-->
Kubernetes v1.27 将一种新的策略机制升级到 Beta 阶段，这一策略用于控制
[`StatefulSets`](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
的 [`PersistentVolumeClaims`](/zh-cn/docs/concepts/storage/persistent-volumes/)（PVCs）的生命周期。
这种新的 PVC 保留策略允许用户指定当删除 `StatefulSet` 或者缩减 `StatefulSet` 中的副本时，
是自动删除还是保留从 `StatefulSet` 规约模板生成的 PVC。

<!--
## What problem does this solve?

A `StatefulSet` spec can include `Pod` and PVC templates. When a replica is first created, the
Kubernetes control plane creates a PVC for that replica if one does not already exist. The behavior
before the PVC retention policy was that the control plane never cleaned up the PVCs created for
`StatefulSets` - this was left up to the cluster administrator, or to some add-on automation that
you’d have to find, check suitability, and deploy. The common pattern for managing PVCs, either
manually or through tools such as Helm, is that the PVCs are tracked by the tool that manages them,
with explicit lifecycle. Workflows that use `StatefulSets` must determine on their own what PVCs are
created by a `StatefulSet` and what their lifecycle should be.
-->
## 所解决的问题

`StatefulSet` 规约可以包含 `Pod` 和 PVC 模板。
当首次创建副本时，Kubernetes 控制平面会为该副本创建一个 PVC （如果不存在）。
在 PVC 保留策略出现之前，控制平面不会清理为 `StatefulSets` 创建的 PVC，
该任务通常由集群管理员负责，或者通过一些附加的自动化工具来处理。
你需要寻找这些工具，并检查其适用性，然后进行部署。
通常管理 PVC 的常见模式，无论是手动管理还是通过诸如 Helm 等工具进行管理，
都是由负责管理它们的工具跟踪，具有明确的生命周期。
使用 `StatefulSets` 的工作流必须自行确定由 `StatefulSet` 创建的 PVC，
并确定其生命周期。

<!--
Before this new feature, when a StatefulSet-managed replica disappears, either because the
`StatefulSet` is reducing its replica count, or because its `StatefulSet` is deleted, the PVC and its
backing volume remains and must be manually deleted. While this behavior is appropriate when the
data is critical, in many cases the persistent data in these PVCs is either temporary, or can be
reconstructed from another source. In those cases, PVCs and their backing volumes remaining after
their `StatefulSet` or replicas have been deleted are not necessary, incur cost, and require manual
cleanup.
-->
在引入这个新特性之前，当一个由 StatefulSet 管理的副本消失时，
无论是因为 `StatefulSet` 正在减少其副本数量，还是因为其 `StatefulSet` 被删除，
PVC 及其支持卷仍然存在，必须手动删除。尽管在数据至关重要时这种行为是合适的，
但在许多情况下，这些 PVC 中的持久数据要么是临时的，要么可以从其他来源重建。
在这些情况下，删除 `StatefulSet` 或副本后仍保留 PVC 及其支持卷是不必要的，
这会产生成本，并且需要手动清理。

<!--
## The new `StatefulSet` PVC retention policy

The new `StatefulSet` PVC retention policy is used to control if and when PVCs created from a
`StatefulSet`’s `volumeClaimTemplate` are deleted.  There are two contexts when this may occur.
-->
## 新的 `StatefulSet` PVC 保留策略

新的 `StatefulSet` PVC 保留策略用于控制是否以及何时删除从 `StatefulSet` 
的 `volumeClaimTemplate` 创建的 PVC。有两种情况可能需要就此作出决定。

<!--
The first context is when the `StatefulSet` resource is deleted (which implies that all replicas are
also deleted). This is controlled by the `whenDeleted` policy. The second context, controlled by
`whenScaled` is when the `StatefulSet` is scaled down, which removes some but not all of the replicas
in a `StatefulSet`. In both cases the policy can either be `Retain`, where the corresponding PVCs are
not touched, or `Delete`, which means that PVCs are deleted. The deletion is done with a normal
[object deletion](/docs/concepts/architecture/garbage-collection/), so that, for example, all
retention policies for the underlying PV are respected.

This policy forms a matrix with four cases. I’ll walk through and give an example for each one.
-->
第一种是当删除 `StatefulSet` 资源时（意味着所有副本也会被删除）。
这时的行为由 `whenDeleted` 策略控制。第二种场景由 `whenScaled` 控制，
即当 `StatefulSet` 缩减规模时，它会移除一部分而不是全部副本。在这两种情况下，
策略可以是 `Retain`，表示相应的 PVC 不受影响，或者是 `Delete`，表示 PVC 将被删除。
删除操作是通过普通的[对象删除](/zh-cn/docs/concepts/architecture/garbage-collection/)完成的，
这样可以确保对底层 PV 的所有保留策略都得到遵守。

这个策略形成了一个矩阵，包括四种情况。接下来，我将逐一介绍每种情况并给出一个示例。

  <!--
  * **`whenDeleted` and `whenScaled` are both `Retain`.** 
  
    This matches the existing behavior for `StatefulSets`, where no PVCs are deleted. This is also
    the default retention policy. It’s appropriate to use when data on `StatefulSet` volumes may be
    irreplaceable and should only be deleted manually.
  -->
  * **`whenDeleted` 和 `whenScaled` 都是 `Retain`。**

    这与现有的 `StatefulSets` 行为相匹配，所有 PVC 都不会被删除。这也是默认的保留策略。
    当 `StatefulSet` 卷上的数据可能是不可替代的，并且应该仅在手动情况下删除时，这种策略是适当的。

  <!--
  * **`whenDeleted` is `Delete` and `whenScaled` is `Retain`.** 
  
    In this case, PVCs are deleted only when the entire `StatefulSet` is deleted. If the
    `StatefulSet` is scaled down, PVCs are not touched, meaning they are available to be reattached
    if a scale-up occurs with any data from the previous replica. This might be used for a temporary
    `StatefulSet`, such as in a CI instance or ETL pipeline, where the data on the `StatefulSet` is
    needed only during the lifetime of the `StatefulSet` lifetime, but while the task is running the
    data is not easily reconstructible. Any retained state is needed for any replicas that scale
    down and then up.
  -->
  * **`whenDeleted` 是 `Delete`，`whenScaled` 是 `Retain`。**
    
    在这种情况下，只有在整个 `StatefulSet` 被删除时，PVC 才会被删除。
    如果 `StatefulSet` 进行缩减操作，PVC 将不会受到影响，这意味着如果缩减后再进行扩展，
    并且使用了来自之前副本的任何数据，PVC 可以被重新关联。这种情况适用于临时的 `StatefulSet`，
    例如在 CI 实例或 ETL 流水线中，`StatefulSet` 上的数据只在其生命周期内需要，
    但在任务运行时，数据不容易重建。对于先被缩容后被扩容的副本而言，所有已保留的状态都是需要的。

  <!--
  * **`whenDeleted` and `whenScaled` are both `Delete`.** 
  
    PVCs are deleted immediately when their replica is no longer needed. Note this does not include
    when a `Pod` is deleted and a new version rescheduled, for example when a node is drained and
    `Pods` need to migrate elsewhere. The PVC is deleted only when the replica is no longer needed
    as signified by a scale-down or `StatefulSet` deletion. This use case is for when data does not
    need to live beyond the life of its replica. Perhaps the data is easily reconstructable and the
    cost savings of deleting unused PVCs is more important than quick scale-up, or perhaps that when
    a new replica is created, any data from a previous replica is not usable and must be
    reconstructed anyway.
  -->

  * **`whenDeleted` 和 `whenScaled` 都是 `Delete`。**

    当副本不再需要时，PVC 会立即被删除。需要注意的是，
    这不包括当删除一个 Pod 并重新调度一个新版本时的情况，
    例如当一个节点被排空并且 Pods 需要迁移到其他地方时。只有在副本不再被需要时，
    即通过缩减规模或删除 `StatefulSet` 时，PVC 才会被删除。
    这种情况适用于数据不需要在其副本的生命周期之外存在的情况。也许数据很容易重建，
    删除未使用的 PVC 可以节省成本比快速扩展更重要，或者当创建一个新副本时，
    来自前一个副本的任何数据都无法使用，必须进行重建。

  <!--
  * **`whenDeleted` is `Retain` and `whenScaled` is `Delete`.** 
  
    This is similar to the previous case, when there is little benefit to keeping PVCs for fast
    reuse during scale-up. An example of a situation where you might use this is an Elasticsearch
    cluster. Typically you would scale that workload up and down to match demand, whilst ensuring a
    minimum number of replicas (for example: 3). When scaling down, data is migrated away from
    removed replicas and there is no benefit to retaining those PVCs. However, it can be useful to
    bring the entire Elasticsearch cluster down temporarily for maintenance. If you need to take the
    Elasticsearch system offline, you can do this by temporarily deleting the `StatefulSet`, and
    then bringing the Elasticsearch cluster back by recreating the `StatefulSet`. The PVCs holding
    the Elasticsearch data will still exist and the new replicas will automatically use them.
  -->
  * **`whenDeleted` 是 `Retain`，`whenScaled` 是 `Delete`。**

    这与前面的情况类似，保留 PVC 以便在扩容时进行快速重用的好处微乎其微。
    一个使用这种策略的例子是 Elasticsearch 集群。通常，你会根据需求调整该工作负载的规模，
    同时确保有一定数量的副本（例如：3个）一直存在。在缩容时，数据会从被删除的副本迁移走，
    保留这些 PVC 没有好处。然而，如果需要临时关闭整个 Elasticsearch 集群进行维护，
    可以通过暂时删除 `StatefulSet` 然后重建 `StatefulSet` 来恢复 Elasticsearch 集群。
    持有 Elasticsearch 数据的 PVC 仍然存在，新的副本将自动使用它们。

<!--
Visit the
[documentation](/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-policies) to
see all the details.

## What’s next?

Try it out! The `StatefulSetAutoDeletePVC` feature gate is beta and enabled by default on
cluster running Kubernetes 1.27. Create a `StatefulSet` using the new policy, test it out and tell
us what you think!
-->
请访问[文档](/zh-cn/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-policies)
以查看所有详细信息。

## 下一步是什么？

试一试吧！在 Kubernetes 1.27 的集群中，`StatefulSetAutoDeletePVC` 特性门控是 Beta 阶段，
使用新的策略创建一个 `StatefulSet`，进行测试并告诉我们你的想法！

<!--
I'm very curious to see if this owner reference mechanism works well in practice. For example, I
realized there is no mechanism in Kubernetes for knowing who set a reference, so it’s possible that
the `StatefulSet` controller may fight with custom controllers that set their own
references. Fortunately, maintaining the existing retention behavior does not involve any new owner
references, so default behavior will be compatible.

Please tag any issues you report with the label `sig/apps` and assign them to Matthew Cary
([@mattcary](https://github.com/mattcary) at GitHub).

Enjoy!
-->
我非常好奇这个所有者引用机制在实践中是否运行良好。例如，
我意识到在 Kubernetes 中没有机制可以知道是谁设置了引用，
因此 `StatefulSet` 控制器可能会与设置自己引用的自定义控制器产生冲突。
幸运的是，保持现有的保留行为不涉及任何新的所有者引用，因此默认行为将是兼容的。

请在你报告的任何 issue 上标记标签 sig/apps，
并将它们指派给 Matthew Cary (@mattcary at GitHub)。

祝您使用愉快！
