---
layout: blog
title: 'Kubernetes 1.27: StatefulSet PVC 自動刪除(beta)'
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

**譯者**：顧欣 (ICBC)

<!--
Kubernetes v1.27 graduated to beta a new policy mechanism for
[`StatefulSets`](/docs/concepts/workloads/controllers/statefulset/) that controls the lifetime of
their [`PersistentVolumeClaims`](/docs/concepts/storage/persistent-volumes/) (PVCs). The new PVC
retention policy lets users specify if the PVCs generated from the `StatefulSet` spec template should
be automatically deleted or retrained when the `StatefulSet` is deleted or replicas in the `StatefulSet`
are scaled down.
-->
Kubernetes v1.27 將一種新的策略機制升級到 Beta 階段，這一策略用於控制
[`StatefulSets`](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
的 [`PersistentVolumeClaims`](/zh-cn/docs/concepts/storage/persistent-volumes/)（PVCs）的生命週期。
這種新的 PVC 保留策略允許使用者指定當刪除 `StatefulSet` 或者縮減 `StatefulSet` 中的副本時，
是自動刪除還是保留從 `StatefulSet` 規約模板生成的 PVC。

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
## 所解決的問題

`StatefulSet` 規約可以包含 `Pod` 和 PVC 模板。
當首次創建副本時，Kubernetes 控制平面會爲該副本創建一個 PVC （如果不存在）。
在 PVC 保留策略出現之前，控制平面不會清理爲 `StatefulSets` 創建的 PVC，
該任務通常由叢集管理員負責，或者通過一些附加的自動化工具來處理。
你需要尋找這些工具，並檢查其適用性，然後進行部署。
通常管理 PVC 的常見模式，無論是手動管理還是通過諸如 Helm 等工具進行管理，
都是由負責管理它們的工具跟蹤，具有明確的生命週期。
使用 `StatefulSets` 的工作流必須自行確定由 `StatefulSet` 創建的 PVC，
並確定其生命週期。

<!--
Before this new feature, when a StatefulSet-managed replica disappears, either because the
`StatefulSet` is reducing its replica count, or because its `StatefulSet` is deleted, the PVC and its
backing volume remains and must be manually deleted. While this behavior is appropriate when the
data is critical, in many cases the persistent data in these PVCs is either temporary, or can be
reconstructed from another source. In those cases, PVCs and their backing volumes remaining after
their `StatefulSet` or replicas have been deleted are not necessary, incur cost, and require manual
cleanup.
-->
在引入這個新特性之前，當一個由 StatefulSet 管理的副本消失時，
無論是因爲 `StatefulSet` 正在減少其副本數量，還是因爲其 `StatefulSet` 被刪除，
PVC 及其支持卷仍然存在，必須手動刪除。儘管在資料至關重要時這種行爲是合適的，
但在許多情況下，這些 PVC 中的持久資料要麼是臨時的，要麼可以從其他來源重建。
在這些情況下，刪除 `StatefulSet` 或副本後仍保留 PVC 及其支持卷是不必要的，
這會產生成本，並且需要手動清理。

<!--
## The new `StatefulSet` PVC retention policy

The new `StatefulSet` PVC retention policy is used to control if and when PVCs created from a
`StatefulSet`’s `volumeClaimTemplate` are deleted.  There are two contexts when this may occur.
-->
## 新的 `StatefulSet` PVC 保留策略

新的 `StatefulSet` PVC 保留策略用於控制是否以及何時刪除從 `StatefulSet` 
的 `volumeClaimTemplate` 創建的 PVC。有兩種情況可能需要就此作出決定。

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
第一種是當刪除 `StatefulSet` 資源時（意味着所有副本也會被刪除）。
這時的行爲由 `whenDeleted` 策略控制。第二種場景由 `whenScaled` 控制，
即當 `StatefulSet` 縮減規模時，它會移除一部分而不是全部副本。在這兩種情況下，
策略可以是 `Retain`，表示相應的 PVC 不受影響，或者是 `Delete`，表示 PVC 將被刪除。
刪除操作是通過普通的[對象刪除](/zh-cn/docs/concepts/architecture/garbage-collection/)完成的，
這樣可以確保對底層 PV 的所有保留策略都得到遵守。

這個策略形成了一個矩陣，包括四種情況。接下來，我將逐一介紹每種情況並給出一個示例。

  <!--
  * **`whenDeleted` and `whenScaled` are both `Retain`.** 
  
    This matches the existing behavior for `StatefulSets`, where no PVCs are deleted. This is also
    the default retention policy. It’s appropriate to use when data on `StatefulSet` volumes may be
    irreplaceable and should only be deleted manually.
  -->
  * **`whenDeleted` 和 `whenScaled` 都是 `Retain`。**

    這與現有的 `StatefulSets` 行爲相匹配，所有 PVC 都不會被刪除。這也是預設的保留策略。
    當 `StatefulSet` 捲上的資料可能是不可替代的，並且應該僅在手動情況下刪除時，這種策略是適當的。

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
    
    在這種情況下，只有在整個 `StatefulSet` 被刪除時，PVC 纔會被刪除。
    如果 `StatefulSet` 進行縮減操作，PVC 將不會受到影響，這意味着如果縮減後再進行擴展，
    並且使用了來自之前副本的任何資料，PVC 可以被重新關聯。這種情況適用於臨時的 `StatefulSet`，
    例如在 CI 實例或 ETL 流水線中，`StatefulSet` 上的資料只在其生命週期內需要，
    但在任務運行時，資料不容易重建。對於先被縮容後被擴容的副本而言，所有已保留的狀態都是需要的。

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

    當副本不再需要時，PVC 會立即被刪除。需要注意的是，
    這不包括當刪除一個 Pod 並重新調度一個新版本時的情況，
    例如當一個節點被排空並且 Pods 需要遷移到其他地方時。只有在副本不再被需要時，
    即通過縮減規模或刪除 `StatefulSet` 時，PVC 纔會被刪除。
    這種情況適用於資料不需要在其副本的生命週期之外存在的情況。也許資料很容易重建，
    刪除未使用的 PVC 可以節省成本比快速擴展更重要，或者當創建一個新副本時，
    來自前一個副本的任何資料都無法使用，必須進行重建。

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

    這與前面的情況類似，保留 PVC 以便在擴容時進行快速重用的好處微乎其微。
    一個使用這種策略的例子是 Elasticsearch 叢集。通常，你會根據需求調整該工作負載的規模，
    同時確保有一定數量的副本（例如：3個）一直存在。在縮容時，資料會從被刪除的副本遷移走，
    保留這些 PVC 沒有好處。然而，如果需要臨時關閉整個 Elasticsearch 叢集進行維護，
    可以通過暫時刪除 `StatefulSet` 然後重建 `StatefulSet` 來恢復 Elasticsearch 叢集。
    持有 Elasticsearch 資料的 PVC 仍然存在，新的副本將自動使用它們。

<!--
Visit the
[documentation](/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-policies) to
see all the details.

## What’s next?

Try it out! The `StatefulSetAutoDeletePVC` feature gate is beta and enabled by default on
cluster running Kubernetes 1.27. Create a `StatefulSet` using the new policy, test it out and tell
us what you think!
-->
請訪問[文檔](/zh-cn/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-policies)
以查看所有詳細資訊。

## 下一步是什麼？

試一試吧！在 Kubernetes 1.27 的叢集中，`StatefulSetAutoDeletePVC` 特性門控是 Beta 階段，
使用新的策略創建一個 `StatefulSet`，進行測試並告訴我們你的想法！

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
我非常好奇這個所有者引用機制在實踐中是否運行良好。例如，
我意識到在 Kubernetes 中沒有機制可以知道是誰設置了引用，
因此 `StatefulSet` 控制器可能會與設置自己引用的自定義控制器產生衝突。
幸運的是，保持現有的保留行爲不涉及任何新的所有者引用，因此預設行爲將是兼容的。

請在你報告的任何 issue 上標記標籤 sig/apps，
並將它們指派給 Matthew Cary (@mattcary at GitHub)。

祝您使用愉快！
