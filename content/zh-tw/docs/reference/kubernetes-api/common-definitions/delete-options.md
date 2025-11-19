---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "DeleteOptions"
content_type: "api_reference"
description: "刪除 API 對象時可以提供 DeleteOptions。"
title: "DeleteOptions"
weight: 1
---
<!--
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "DeleteOptions"
content_type: "api_reference"
description: "DeleteOptions may be provided when deleting an API object."
title: "DeleteOptions"
weight: 1
auto_generated: true
-->

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

<!--
DeleteOptions may be provided when deleting an API object.
-->
刪除 API 對象時可以提供 DeleteOptions。

<hr>

<!--
- **apiVersion** (string)

  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
-->
- **apiVersion** (string)

  `APIVersion` 定義對象表示的版本化模式。
  伺服器應將已識別的模式轉換爲最新的內部值，並可能拒絕無法識別的值。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

<!--
- **dryRun** ([]string)

  *Atomic: will be replaced during a merge*

  When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
-->
- **dryRun** ([]string)

  **原子性：將在合併期間被替換**

  該值如果存在，則表示不應保留修改。
  無效或無法識別的 `dryRun` 指令將導致錯誤響應並且不會進一步處理請求。有效值爲：

  - `All`：處理所有試運行階段（Dry Run Stages）

<!--
- **gracePeriodSeconds** (int64)

  The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
-->
- **gracePeriodSeconds** (int64)

  表示對象被刪除之前的持續時間（以秒爲單位）。
  值必須是非負整數。零值表示立即刪除。如果此值爲 `nil`，則將使用指定類型的默認寬限期。如果未指定，則爲每個對象的默認值。

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (boolean)

  if set to true, it will trigger an unsafe deletion of the resource in case the normal deletion flow fails with a corrupt object error. A resource is considered corrupt if it can not be retrieved from the underlying storage successfully because of a) its data can not be transformed e.g. decryption failure, or b) it fails to decode into an object. NOTE: unsafe deletion ignores finalizer constraints, skips precondition checks, and removes the object from the storage. WARNING: This may potentially break the cluster if the workload associated with the resource being unsafe-deleted relies on normal deletion flow. Use only if you REALLY know what you are doing. The default value is false, and the user must opt in to enable it
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (boolean)

  如果設置爲 true，那麼在正常刪除流程因對象損壞錯誤而失敗時，將觸發資源的不安全刪除。
  當由於以下原因無法成功從底層存儲檢索資源時，該資源被視爲損壞：

  1. 其數據無法轉換，例如解密失敗；或 
  2. 它無法解碼爲一個對象。

  注意：不安全刪除忽略終結器約束，跳過前提條件檢查，並從存儲中移除對象。

  警告：如果與正在被不安全刪除的資源相關聯的工作負載依賴於正常的刪除流程，
  這可能會破壞叢集。僅在你真的知道自己在做什麼的情況下使用。
  默認值是 false，使用者必須選擇啓用它。

<!--
- **kind** (string)

  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
- **kind** (string)

  `kind` 是一個字符串值，表示此對象代表的 REST 資源。
  伺服器可以從客戶端提交請求的端點推斷出此值。此值無法更新，是駝峯的格式。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **orphanDependents** (boolean)

  Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list. Either this field or PropagationPolicy may be set, but not both.
-->
- **orphanDependents** (boolean)

  已棄用：該字段將在 1.7 中棄用，請使用 `propagationPolicy` 字段。
  該字段表示依賴對象是否應該是孤兒。如果爲 true/false，對象的 finalizers 列表中會被添加上或者移除掉 “orphan” 終結器（Finalizer）。
  可以設置此字段或者設置 `propagationPolicy` 字段，但不能同時設置以上兩個字段。

<!--
- **preconditions** (Preconditions)

  Must be fulfilled before a deletion is carried out. If not possible, a 409 Conflict status will be returned.

  <a name="Preconditions"></a>
  *Preconditions must be fulfilled before an operation (update, delete, etc.) is carried out.*

  - **preconditions.resourceVersion** (string)

    Specifies the target ResourceVersion

  - **preconditions.uid** (string)

    Specifies the target UID.
-->
- **preconditions** (Preconditions)

  先決條件必須在執行刪除之前完成。如果無法滿足這些條件，將返回 409（衝突）狀態。

  <a name="Preconditions"></a>
  **執行操作（更新、刪除等）之前必須滿足先決條件。**

  - **preconditions.resourceVersion** (string)

    指定目標資源版本（resourceVersion）。

  - **preconditions.uid** (string)

    指定目標 UID。

<!--
- **propagationPolicy** (string)

  Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.
-->
- **propagationPolicy** (string)

  表示是否以及如何執行垃圾收集。可以設置此字段或 `orphanDependents` 字段，但不能同時設置二者。
  默認策略由 `metadata.finalizers` 中現有終結器（Finalizer）集合和特定資源的默認策略決定。
  可選值爲：
  
  - `Orphan` 令依賴對象成爲孤兒對象；
  - `Background` 允許垃圾收集器在後臺刪除依賴項；
  - `Foreground` 一個級聯策略，前臺刪除所有依賴項。
