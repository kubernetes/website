---
api_metadata:
  apiVersion: "policy/v1"
  import: "k8s.io/api/policy/v1"
  kind: "PodDisruptionBudget"
content_type: "api_reference"
description: "PodDisruptionBudget 是一個對象，用於定義可能對一組 Pod 造成的最大幹擾。"
title: "PodDisruptionBudget"
weight: 5
---
<!--
api_metadata:
  apiVersion: "policy/v1"
  import: "k8s.io/api/policy/v1"
  kind: "PodDisruptionBudget"
content_type: "api_reference"
description: "PodDisruptionBudget is an object to define the max disruption that can be caused to a collection of pods."
title: "PodDisruptionBudget"
weight: 5
auto_generated: true
-->

`apiVersion: policy/v1`

`import "k8s.io/api/policy/v1"`

## PodDisruptionBudget {#PodDisruptionBudget}

<!--
PodDisruptionBudget is an object to define the max disruption that can be caused to a collection of pods
-->
PodDisruptionBudget 是一個對象，用於定義可能對一組 Pod 造成的最大幹擾。

<hr>

- **apiVersion**: policy/v1

- **kind**: PodDisruptionBudget

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元數據。
  更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata。

<!--
- **spec** (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudgetSpec" >}}">PodDisruptionBudgetSpec</a>)

  Specification of the desired behavior of the PodDisruptionBudget.
-->
- **spec** (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudgetSpec" >}}">PodDisruptionBudgetSpec</a>)

  PodDisruptionBudget 預期行爲的規約。

<!--
- **status** (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudgetStatus" >}}">PodDisruptionBudgetStatus</a>)

  Most recently observed status of the PodDisruptionBudget.
-->
- **status** (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudgetStatus" >}}">PodDisruptionBudgetStatus</a>)

  此 PodDisruptionBudget 的最近觀測狀態。

## PodDisruptionBudgetSpec {#PodDisruptionBudgetSpec}

<!--
PodDisruptionBudgetSpec is a description of a PodDisruptionBudget.
-->
PodDisruptionBudgetSpec 是對 PodDisruptionBudget 的描述。

<hr>

<!--
- **maxUnavailable** (IntOrString)

  An eviction is allowed if at most "maxUnavailable" pods selected by "selector" are unavailable after the eviction, i.e. even in absence of the evicted pod. For example, one can prevent all voluntary evictions by specifying 0. This is a mutually exclusive setting with "minAvailable".

  <a name="IntOrString"></a>
  *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
-->
- **maxUnavailable** (IntOrString)

  如果 “selector” 所選中的 Pod 中最多有 “maxUnavailable” Pod 在驅逐後不可用（即去掉被驅逐的 Pod 之後），則允許驅逐。
  例如，可以通過將此字段設置爲 0 來阻止所有自願驅逐。此字段是與 “minAvailable” 互斥的設置。

  <a name="IntOrString"></a>
  IntOrString 是一種可以包含 int32 或字符串數值的類型。在 JSON 或 YAML 編組和解組時，
  會生成或使用內部類型。例如，此類型允許你定義一個可以接受名稱或數字的 JSON 字段。

<!--
- **minAvailable** (IntOrString)

  An eviction is allowed if at least "minAvailable" pods selected by "selector" will still be available after the eviction, i.e. even in the absence of the evicted pod.  So for example you can prevent all voluntary evictions by specifying "100%".

  <a name="IntOrString"></a>
  *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
-->
- **minAvailable** (IntOrString)

  如果 “selector” 所選中的 Pod 中，至少 “minAvailable” 個 Pod 在驅逐後仍然可用（即去掉被驅逐的 Pod 之後），則允許驅逐。
  因此，你可以通過將此字段設置爲 “100%” 來禁止所有自願驅逐。

  <a name="IntOrString"></a>
  IntOrString 是一種可以包含 int32 或字符串數值的類型。在 JSON 或 YAML 編組和解組時，
  會生成或使用內部類型。例如，此類型允許你定義一個可以接受名稱或數字的 JSON 字段。

<!--
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  Label query over pods whose evictions are managed by the disruption budget. A null selector will match no pods, while an empty ({}) selector will select all pods within the namespace.
-->
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  標籤查詢，用來選擇其驅逐由干擾預算來管理的 Pod 集合。
  選擇算符爲 null 時將不會匹配任何 Pod，而空 ({}) 選擇算符將選中名字空間內的所有 Pod。

- **unhealthyPodEvictionPolicy** (string)

  <!--
  UnhealthyPodEvictionPolicy defines the criteria for when unhealthy pods should be considered for eviction. Current implementation considers healthy pods, as pods that have status.conditions item with type="Ready",status="True".

  Valid policies are IfHealthyBudget and AlwaysAllow. If no policy is specified, the default behavior will be used, which corresponds to the IfHealthyBudget policy.
  -->
  unhealthyPodEvictionPolicy 定義不健康的 Pod 應被考慮驅逐時的標準。
  當前的實現將健康的 Pod 視爲具有 status.conditions 項且 type="Ready"、status="True" 的 Pod。

  有效的策略是 IfHealthyBudget 和 AlwaysAllow。
  如果沒有策略被指定，則使用與 IfHealthyBudget 策略對應的默認行爲。

  <!--
  IfHealthyBudget policy means that running pods (status.phase="Running"), but not yet healthy can be evicted only if the guarded application is not disrupted (status.currentHealthy is at least equal to status.desiredHealthy). Healthy pods will be subject to the PDB for eviction.

  AlwaysAllow policy means that all running pods (status.phase="Running"), but not yet healthy are considered disrupted and can be evicted regardless of whether the criteria in a PDB is met. This means perspective running pods of a disrupted application might not get a chance to become healthy. Healthy pods will be subject to the PDB for eviction.
  -->
  IfHealthyBudget 策略意味着正在運行（status.phase="Running"）但還不健康的 Pod
  只有在被守護的應用未受干擾（status.currentHealthy 至少等於 status.desiredHealthy）
  時才能被驅逐。健康的 Pod 將受到 PDB 的驅逐。

  AlwaysAllow 策略意味着無論是否滿足 PDB 中的條件，所有正在運行（status.phase="Running"）但還不健康的
  Pod 都被視爲受干擾且可以被驅逐。這意味着受干擾應用的透視運行 Pod 可能沒有機會變得健康。
  健康的 Pod 將受到 PDB 的驅逐。

  <!--
  Additional policies may be added in the future. Clients making eviction decisions should disallow eviction of unhealthy pods if they encounter an unrecognized policy in this field.
  -->

  將來可能會添加其他策略。如果客戶端在該字段遇到未識別的策略，則做出驅逐決定的客戶端應禁止驅逐不健康的 Pod。 

## PodDisruptionBudgetStatus {#PodDisruptionBudgetStatus}

<!--
PodDisruptionBudgetStatus represents information about the status of a PodDisruptionBudget. Status may trail the actual state of a system.
-->
PodDisruptionBudgetStatus 表示有關此 PodDisruptionBudget 狀態的信息。狀態可能會反映系統的實際狀態。

<hr>

<!--
- **currentHealthy** (int32), required

  current number of healthy pods
-->
- **currentHealthy** (int32)，必需

  當前健康 Pod 的數量。

<!--
- **desiredHealthy** (int32), required

  minimum desired number of healthy pods
-->
- **desiredHealthy** (int32)，必需

  健康 Pod 的最小期望值。

<!--
- **disruptionsAllowed** (int32), required

  Number of pod disruptions that are currently allowed.
-->
- **disruptionsAllowed** (int32)，必需

  當前允許的 Pod 干擾計數。

<!--
- **expectedPods** (int32), required

  total number of pods counted by this disruption budget
-->
- **expectedPods** (int32)，必需

  此干擾預算計入的 Pod 總數

- **conditions** ([]Condition)

  <!--
  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*

  Conditions contain conditions for PDB. The disruption controller sets the DisruptionAllowed condition. The following are known values for the reason field (additional reasons could be added in the future):
  - SyncFailed: The controller encountered an error and wasn't able to compute
                the number of allowed disruptions. Therefore no disruptions are
                allowed and the status of the condition will be False.
  - InsufficientPods: The number of pods are either at or below the number
                      required by the PodDisruptionBudget. No disruptions are
                      allowed and the status of the condition will be False.
  - SufficientPods: There are more pods than required by the PodDisruptionBudget.
                    The condition will be True, and the number of allowed
                    disruptions are provided by the disruptionsAllowed property.
  -->

  **補丁策略：根據 `type` 鍵執行合併操作**

  **Map：鍵 type 的唯一值將在合併期間被保留**

  conditions 包含 PDB 的狀況。干擾控制器會設置 DisruptionAllowed 狀況。
  以下是 reason 字段的已知值（將來可能會添加其他原因）：

  - SyncFailed：控制器遇到錯誤並且無法計算允許的干擾計數。因此不允許任何干擾，且狀況的狀態將變爲 False。
  - InsufficientPods：Pod 的數量只能小於或等於 PodDisruptionBudget 要求的數量。
    不允許任何干擾，且狀況的狀態將是 False。
  - SufficientPods：Pod 個數超出 PodDisruptionBudget 所要求的閾值。
    此狀況爲 True 時，基於 disruptsAllowed 屬性確定所允許的干擾數目。

  <!--
  <a name="Condition"></a>
  *Condition contains details for one aspect of the current state of this API Resource.*
  -->

  <a name="Condition"></a>
  Condition 包含此 API 資源當前狀態的一個方面的詳細信息。

  <!--
  - **conditions.lastTransitionTime** (Time), required

    lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)，必需

    lastTransitionTime 是狀況最近一次從一種狀態轉換到另一種狀態的時間。
    這種變化通常出現在下層狀況發生變化的時候。如果無法瞭解下層狀況變化，使用 API 字段更改的時間也是可以接受的。

    <a name="Time"></a>
    Time 是 time.Time 的包裝器，它支持對 YAML 和 JSON 的正確編組。
    time 包的許多工廠方法提供了包裝器。

  <!--
  - **conditions.message** (string), required

    message is a human readable message indicating details about the transition. This may be an empty string.
  -->

  - **conditions.message** (string)，必需

    message 是一條人類可讀的消息，指示有關轉換的詳細信息。它可能是一個空字符串。

  <!--
  - **conditions.reason** (string), required

    reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.
  -->

  - **conditions.reason** (string)，必需

    reason 包含一個程序標識符，指示狀況最後一次轉換的原因。
    特定狀況類型的生產者可以定義該字段的預期值和含義，以及這些值是否可被視爲有保證的 API。
    該值應該是 CamelCase 字符串。此字段不能爲空。

  <!--
  - **conditions.status** (string), required

    status of the condition, one of True, False, Unknown.
  -->

  - **conditions.status** (string)，必需

    狀況的狀態爲 True、False、Unknown 之一。

  <!--
  - **conditions.type** (string), required

    type of condition in CamelCase or in foo.example.com/CamelCase.
  -->

  - **conditions.type** (string)，必需

    CamelCase 或 foo.example.com/CamelCase 形式的狀況類型。

  <!--
  - **conditions.observedGeneration** (int64)

    observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.
  -->

  - **conditions.observedGeneration** (int64)

    observedGeneration 表示設置狀況時所基於的 .metadata.generation。
    例如，如果 .metadata.generation 當前爲 12，但 .status.conditions[x].observedGeneration 爲 9，
    則狀況相對於實例的當前狀態已過期。

<!--
- **disruptedPods** (map[string]Time)

  DisruptedPods contains information about pods whose eviction was processed by the API server eviction subresource handler but has not yet been observed by the PodDisruptionBudget controller. A pod will be in this map from the time when the API server processed the eviction request to the time when the pod is seen by PDB controller as having been marked for deletion (or after a timeout). The key in the map is the name of the pod and the value is the time when the API server processed the eviction request. If the deletion didn't occur and a pod is still there it will be removed from the list automatically by PodDisruptionBudget controller after some time. If everything goes smooth this map should be empty for the most of the time. Large number of entries in the map may indicate problems with pod deletions.
-->
- **disruptedPods** (map[string]Time)

  disruptedPods 包含有關 Pod 的一些信息，這些 Pod 的驅逐操作已由 API 服務器上的 eviction 子資源處理程序處理,
  但尚未被 PodDisruptionBudget 控制器觀察到。
  從 API 服務器處理驅逐請求到 PDB 控制器看到該 Pod 已標記爲刪除（或超時後），Pod 將記錄在此映射中。
  映射中的鍵名是 Pod 的名稱，鍵值是 API 服務器處理驅逐請求的時間。
  如果刪除沒有發生並且 Pod 仍然存在，PodDisruptionBudget 控制器將在一段時間後自動將 Pod 從列表中刪除。
  如果一切順利，此映射大部分時間應該是空的。映射中的存在大量條目可能表明 Pod 刪除存在問題。

  <a name="Time"></a>
  <!--
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->
  Time 是 time.Time 的包裝器，它支持對 YAML 和 JSON 的正確編組。
  time 包的許多工廠方法提供了包裝器。

<!--
- **observedGeneration** (int64)

  Most recent generation observed when updating this PDB status. DisruptionsAllowed and other status information is valid only if observedGeneration equals to PDB's object generation.
-->
- **observedGeneration** (int64)

  更新此 PDB 狀態時觀察到的最新一代。
  DisruptionsAllowed 和其他狀態信息僅在 observedGeneration 等於 PDB 的對象的代數時纔有效。

## PodDisruptionBudgetList {#PodDisruptionBudgetList}

<!--
PodDisruptionBudgetList is a collection of PodDisruptionBudgets.
-->
PodDisruptionBudgetList 是 PodDisruptionBudget 的集合。

<hr>

- **apiVersion**: policy/v1

- **kind**: PodDisruptionBudgetList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的對象元數據。
  更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata。

<!--
- **items** ([]<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>), required

  Items is a list of PodDisruptionBudgets
-->
- **items** ([]<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>)，必需

  items 是 PodDisruptionBudgets 的列表。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified PodDisruptionBudget

#### HTTP Request
-->
### `get` 讀取指定的 PodDisruptionBudget

#### HTTP 請求

GET /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PodDisruptionBudget
-->
- **name** (**路徑參數**): string，必需

  PodDisruptionBudget 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified PodDisruptionBudget

#### HTTP Request
-->
### `get` 讀取指定 PodDisruptionBudget 的狀態

#### HTTP 請求

GET /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}/status

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PodDisruptionBudget
-->
- **name** (**路徑參數**): string，必需

  PodDisruptionBudget 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PodDisruptionBudget

#### HTTP Request
-->
### `list` 列出或監視 PodDisruptionBudget 類型的對象

#### HTTP 請求

GET /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudgetList" >}}">PodDisruptionBudgetList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PodDisruptionBudget

#### HTTP Request
-->
### `list` 列出或監視 PodDisruptionBudget 類型的對象

#### HTTP 請求

GET /apis/policy/v1/poddisruptionbudgets

<!--
#### Parameters
-->
#### 參數

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudgetList" >}}">PodDisruptionBudgetList</a>): OK

401: Unauthorized

<!--
### `create` create a PodDisruptionBudget

#### HTTP Request
-->
### `create` 創建一個 PodDisruptionBudget

#### HTTP 請求

POST /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>, required
-->
- **body**: <a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

202 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified PodDisruptionBudget

#### HTTP Request
-->
### `update` 替換指定的 PodDisruptionBudget

#### HTTP 請求

PUT /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PodDisruptionBudget
-->
- **name** (**路徑參數**): string，必需

  PodDisruptionBudget 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>, required
-->
- **body**: <a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified PodDisruptionBudget

#### HTTP Request
-->
### `update` 替換指定 PodDisruptionBudget 的狀態

#### HTTP 請求

PUT /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}/status

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PodDisruptionBudget
-->
- **name** (**路徑參數**): string，必需

  PodDisruptionBudget 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>, required
-->
- **body**: <a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified PodDisruptionBudget

#### HTTP Request
-->
### `patch` 部分更新指定的 PodDisruptionBudget

#### HTTP 請求

PATCH /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PodDisruptionBudget
-->
- **name** (**路徑參數**): string，必需

  PodDisruptionBudget 的名稱

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified PodDisruptionBudget

#### HTTP Request
-->
### `patch` 部分更新指定 PodDisruptionBudget 的狀態

#### HTTP 請求

PATCH /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}/status

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PodDisruptionBudget
-->
- **name** (**路徑參數**): string，必需

  PodDisruptionBudget 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **force** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-disruption-budget-v1#PodDisruptionBudget" >}}">PodDisruptionBudget</a>): Created

401: Unauthorized

<!--
### `delete` delete a PodDisruptionBudget

#### HTTP Request
-->
### `delete` 刪除 PodDisruptionBudget

#### HTTP 請求

DELETE /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the PodDisruptionBudget
-->
- **name** (**路徑參數**): string，必需

  PodDisruptionBudget 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of PodDisruptionBudget

#### HTTP Request
-->
### `deletecollection` 刪除 PodDisruptionBudget 的集合

#### HTTP Request

DELETE /apis/policy/v1/namespaces/{namespace}/poddisruptionbudgets

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
