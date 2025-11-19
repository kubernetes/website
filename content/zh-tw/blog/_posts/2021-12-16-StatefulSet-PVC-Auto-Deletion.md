---
layout: blog
title: 'Kubernetes 1.23: StatefulSet PVC 自動刪除 (alpha)'
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
Kubernetes v1.23 爲 [StatefulSets](/zh-cn/docs/concepts/workloads/controllers/statefulset/)
引入了一個新的 alpha 級策略，用來控制由 StatefulSet 規約模板生成的
[PersistentVolumeClaims](/zh-cn/docs/concepts/storage/persistent-volumes/) (PVCs) 的生命週期，
用於當刪除 StatefulSet 或減少 StatefulSet 中的 Pods 數量時 PVCs 應該被自動刪除的場景。

<!--
## What problem does this solve?
-->
## 它解決了什麼問題？

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
StatefulSet 規約中可以包含 Pod 和 PVC 的模板。當副本先被創建時，如果 PVC 還不存在，
Kubernetes 控制面會爲該副本自動創建一個 PVC。在 Kubernetes 1.23 版本之前，
控制面不會刪除 StatefulSet 創建的 PVCs——這依賴集羣管理員或你需要部署一些額外的適用的自動化工具來處理。
管理 PVC 的常見模式是通過手動或使用 Helm 等工具，PVC 的具體生命週期由管理它的工具跟蹤。
使用 StatefulSet 時必須自行確定 StatefulSet 創建哪些 PVC，以及它們的生命週期應該是什麼。

<!--
Before this new feature, when a StatefulSet-managed replica disappears, either because the
StatefulSet is reducing its replica count, or because its StatefulSet is deleted, the PVC and its
backing volume remains and must be manually deleted. While this behavior is appropriate when the
data is critical, in many cases the persistent data in these PVCs is either temporary, or can be
reconstructed from another source. In those cases, PVCs and their backing volumes remaining after
their StatefulSet or replicas have been deleted are not necessary, incur cost, and require manual
cleanup.
-->
在這個新特性之前，當一個 StatefulSet 管理的副本消失時，無論是因爲 StatefulSet 減少了它的副本數，
還是因爲它的 StatefulSet 被刪除了，PVC 及其下層的卷仍然存在，需要手動刪除。
當存儲數據比較重要時，這樣做是合理的，但在許多情況下，這些 PVC 中的持久化數據要麼是臨時的，
要麼可以從另一個源端重建。在這些情況下，刪除 StatefulSet 或減少副本後留下的 PVC 及其下層的卷是不必要的，
還會產生成本，需要手動清理。

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
如果你啓用這個新 alpha 特性，StatefulSet 規約中就可以包含 PersistentVolumeClaim 的保留策略。
該策略用於控制是否以及何時刪除基於 StatefulSet 的 `volumeClaimTemplate` 屬性所創建的 PVCs。
保留策略的首次迭代包含兩種可能刪除 PVC 的情況。

<!--
The first situation is when the StatefulSet resource is deleted (which implies that all replicas are
also deleted). This is controlled by the `whenDeleted` policy. The second situation, controlled by
`whenScaled` is when the StatefulSet is scaled down, which removes some but not all of the replicas
in a StatefulSet. In both cases the policy can either be `Retain`, where the corresponding PVCs are
not touched, or `Delete`, which means that PVCs are deleted. The deletion is done with a normal
[object deletion](/docs/concepts/architecture/garbage-collection/), so that, for example, all
retention policies for the underlying PV are respected.
-->
第一種情況是 StatefulSet 資源被刪除時（這意味着所有副本也被刪除），這由 `whenDeleted` 策略控制的。
第二種情況是 StatefulSet 縮小時，即刪除 StatefulSet 部分副本，這由 `whenScaled` 策略控制。
在這兩種情況下，策略即可以是 `Retain` 不涉及相應 PVCs 的改變，也可以是 `Delete` 即刪除對應的 PVCs。
刪除是通過普通的[對象刪除](/zh-cn/docs/concepts/architecture/garbage-collection/)完成的，
因此，的所有保留策略都會被遵照執行。

<!--
This policy forms a matrix with four cases. I’ll walk through and give an example for each one.
-->
該策略形成包含四種情況的矩陣。我將逐一介紹，併爲每一種情況給出一個例子。

<!--
  * **`whenDeleted` and `whenScaled` are both `Retain`.** This matches the existing behavior for
    StatefulSets, where no PVCs are deleted. This is also the default retention policy. It’s
    appropriate to use when data on StatefulSet volumes may be irreplaceable and should only be
    deleted manually.
-->
  * **`whenDeleted` 和 `whenScaled` 都是 `Retain`。** 這與 StatefulSets 的現有行爲一致，
    即不刪除 PVCs。 這也是默認的保留策略。它適用於 StatefulSet
    捲上的數據是不可替代的且只能手動刪除的情況。
 
<!--
  * **`whenDeleted` is `Delete` and `whenScaled` is `Retain`.** In this case, PVCs are deleted only when
    the entire StatefulSet is deleted. If the StatefulSet is scaled down, PVCs are not touched,
    meaning they are available to be reattached if a scale-up occurs with any data from the previous
    replica. This might be used for a temporary StatefulSet, such as in a CI instance or ETL
    pipeline, where the data on the StatefulSet is needed only during the lifetime of the
    StatefulSet lifetime, but while the task is running the data is not easily reconstructible. Any
    retained state is needed for any replicas that scale down and then up.
-->
  * **`whenDeleted` 是 `Delete` 但 `whenScaled` 是 `Retain`。** 在這種情況下，
    只有當整個 StatefulSet 被刪除時，PVCs 纔會被刪除。
    如果減少 StatefulSet 副本，PVCs 不會刪除，這意味着如果增加副本時，可以從前一個副本重新連接所有數據。
    這可能用於臨時的 StatefulSet，例如在 CI 實例或 ETL 管道中，
    StatefulSet 上的數據僅在 StatefulSet 生命週期內才需要，但在任務運行時數據不易重構。
    任何保留狀態對於所有先縮小後擴大的副本都是必需的。

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
  * **`whenDeleted` 和 `whenScaled` 都是 `Delete`。** 當其副本不再被需要時，PVCs 會立即被刪除。
    注意，這並不包括 Pod 被刪除且有新版本被調度的情況，例如當節點被騰空而 Pod 需要遷移到別處時。
    只有當副本不再被需要時，如按比例縮小或刪除 StatefulSet 時，纔會刪除 PVC。
    此策略適用於數據生命週期短於副本生命週期的情況。即數據很容易重構，
    且刪除未使用的 PVC 所節省的成本比快速增加副本更重要，或者當創建一個新的副本時，
    來自以前副本的任何數據都不可用，必須重新構建。

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
  * **`whenDeleted` 是 `Retain` 但 `whenScaled` 是 `Delete`。** 這與前一種情況類似，
    在增加副本時用保留的 PVCs 快速重構幾乎沒有什麼益處。例如 Elasticsearch 集羣就是使用的這種方式。
    通常，你需要增大或縮小工作負載來滿足業務訴求，同時確保最小數量的副本（例如：3）。
    當減少副本時，數據將從已刪除的副本遷移出去，保留這些 PVCs 沒有任何用處。
    但是，這對臨時關閉整個 Elasticsearch 集羣進行維護時是很有用的。
    如果需要使 Elasticsearch 系統脫機，可以通過臨時刪除 StatefulSet 來實現，
    然後通過重新創建 StatefulSet 來恢復 Elasticsearch 集羣。
    保存 Elasticsearch 數據的 PVCs 不會被刪除，新的副本將自動使用它們。
  
<!--
  Visit the
[documentation](/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-policies) to
see all the details.
-->
查閱[文檔](/zh-cn/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-policies)
獲取更多詳細信息。

<!--
## What’s next?
-->
## 下一步是什麼？

<!--
Enable the feature and try it out! Enable the `StatefulSetAutoDeletePVC` feature gate on a cluster,
then create a StatefulSet using the new policy. Test it out and tell us what you think!
-->
啓用該功能並嘗試一下！在集羣上啓用 `StatefulSetAutoDeletePVC` 功能，然後使用新策略創建 StatefulSet。
測試一下，告訴我們你的體驗！

<!--
I'm very curious to see if this owner reference mechanism works well in practice. For example, we
realized there is no mechanism in Kubernetes for knowing who set a reference, so it’s possible that
the StatefulSet controller may fight with custom controllers that set their own
references. Fortunately, maintaining the existing retention behavior does not involve any new owner
references, so default behavior will be compatible.
-->
我很好奇這個屬主引用機制在實踐中是否有效。例如，我們意識到 Kubernetes 中沒有可以知道誰設置了引用的機制，
因此 StatefulSet 控制器可能會與設置自己的引用的自定義控制器發生衝突。
幸運的是，維護現有的保留行爲不涉及任何新屬主引用，因此默認行爲是兼容的。

<!--
Please tag any issues you report with the label `sig/apps` and assign them to Matthew Cary
([@mattcary](https://github.com/mattcary) at GitHub).
-->
請用標籤 `sig/apps` 標記你報告的任何問題，並將它們分配給 Matthew Cary
(在 GitHub上 [@mattcary](https://github.com/mattcary))。

<!--
Enjoy!
-->
盡情體驗吧！

