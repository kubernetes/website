---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "DeleteOptions"
content_type: "api_reference"
description: "刪除 API 物件時可以提供 DeleteOptions。"
title: "DeleteOptions"
weight: 1
auto_generated: true
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

<!--DeleteOptions may be provided when deleting an API object.-->
刪除 API 物件時可以提供 DeleteOptions。

<hr>

<!--
- **apiVersion** (string)

  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
-->

- **apiVersion** (string)

  `APIVersion` 定義物件表示的版本化模式。
  伺服器應將已識別的模式轉換為最新的內部值，並可能拒絕無法識別的值。
  更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

<!--
- **dryRun** ([]string)

  When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed
-->

- **dryRun** ([]string)

  該值如果存在，則表示不應保留修改。
  無效或無法識別的 `dryRun` 指令將導致錯誤響應並且不會進一步處理請求。有效值為：

   - `All`：處理所有試執行階段（Dry Run Stages）

<!--
- **gracePeriodSeconds** (int64)

  The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
-->

- **gracePeriodSeconds** (int64)

  表示物件被刪除之前的持續時間（以秒為單位）。
  值必須是非負整數。零值表示立即刪除。如果此值為 `nil`，則將使用指定型別的預設寬限期。如果未指定，則為每個物件的預設值。

<!--
- **kind** (string)

  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->

- **kind** (string)

  `kind` 是一個字串值，表示此物件代表的 REST 資源。
  伺服器可以從客戶端提交請求的端點推斷出此值。此值無法更新，是駝峰的格式。
  更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds 。

<!--
- **orphanDependents** (boolean)

  Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list. Either this field or PropagationPolicy may be set, but not both.
-->

- **orphanDependents** (boolean)

  已棄用：該欄位將在 1.7 中棄用，請使用 `propagationPolicy` 欄位。
  該欄位表示依賴物件是否應該是孤兒。如果為 true/false，物件的 finalizers 列表中會被新增上或者移除掉 “orphan” 終結器（Finalizer）。
  可以設定此欄位或者設定 `propagationPolicy` 欄位，但不能同時設定以上兩個欄位。

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
  *執行操作（更新、刪除等）之前必須滿足先決條件。*

  - **preconditions.resourceVersion** (string)

    指定目標資源版本（resourceVersion）。

  - **preconditions.uid** (string)

    指定目標 UID。

<!--
- **propagationPolicy** (string)

  Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.
-->

- **propagationPolicy** (string)

  表示是否以及如何執行垃圾收集。可以設定此欄位或 `orphanDependents` 欄位，但不能同時設定二者。
  預設策略由 `metadata.finalizers` 中現有終結器（Finalizer）集合和特定資源的預設策略決定。
  可接受的值為：`Orphan` - 令依賴物件成為孤兒物件；`Background` - 允許垃圾收集器在後臺刪除依賴項；`Foreground` - 一個級聯策略，前臺刪除所有依賴項。





