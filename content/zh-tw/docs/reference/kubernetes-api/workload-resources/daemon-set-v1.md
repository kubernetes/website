---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "DaemonSet"
content_type: "api_reference"
description: "DaemonSet 表示守護進程集的設定。"
title: "DaemonSet"
weight: 9
---
<!--
api_metadata:
apiVersion: "apps/v1"
import: "k8s.io/api/apps/v1"
kind: "DaemonSet"
content_type: "api_reference"
description: "DaemonSet represents the configuration of a daemon set."
title: "DaemonSet"
weight: 9
auto_generated: true
-->

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`

<!--
## DaemonSet {#DaemonSet}

DaemonSet represents the configuration of a daemon set.
-->
## DaemonSet {#DaemonSet}

DaemonSet 表示守護進程集的設定。

<hr>

- **apiVersion**: apps/v1

- **kind**: DaemonSet

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetSpec" >}}">DaemonSetSpec</a>)

  The desired behavior of this daemon set. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **spec** (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetSpec" >}}">DaemonSetSpec</a>)

  此守護進程集的預期行爲。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetStatus" >}}">DaemonSetStatus</a>)

  The current status of this daemon set. This data may be out of date by some window of time. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetStatus" >}}">DaemonSetStatus</a>)

  此守護進程集的當前狀態。此數據可能已經過時一段時間。由系統填充。
  只讀。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
## DaemonSetSpec {#DaemonSetSpec}

DaemonSetSpec is the specification of a daemon set.
-->
## DaemonSetSpec {#DaemonSetSpec}

DaemonSetSpec 是守護進程集的規約。

<hr>

<!--
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), required

  A label query over pods that are managed by the daemon set. Must match in order to be controlled. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors
-->
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)，必需

  對由守護進程集管理的 Pod 的標籤查詢。Pod 必須匹配此查詢才能被此 DaemonSet 控制。
  查詢條件必須與 Pod 模板的標籤匹配。更多信息：
  https://kubernetes.io/zh-cn/concepts/overview/working-with-objects/labels/#label-selectors

<!--
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), required

  An object that describes the pod that will be created. The DaemonSet will create exactly one copy of this pod on every node that matches the template's node selector (or on every node if no node selector is specified). The only allowed template.spec.restartPolicy value is "Always". More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template
-->
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)，必需

  描述將要創建的 Pod 的對象。DaemonSet 將在與模板的節點選擇器匹配的每個節點上
  （如果未指定節點選擇器，則在每個節點上）準確創建此 Pod 的副本。`template.spec.restartPolicy`
  唯一被允許設定的值是 "Always"。更多信息：
  https://kubernetes.io/zh-cn/concepts/workloads/controllers/replicationcontroller#pod-template

<!--
- **minReadySeconds** (int32)

  The minimum number of seconds for which a newly created DaemonSet pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready).
-->
- **minReadySeconds** (int32)

  新建的 DaemonSet Pod 應該在沒有任何容器崩潰的情況下處於就緒狀態的最小秒數，這樣它纔會被認爲是可用的。
  默認爲 0（Pod 準備就緒後將被視爲可用）。

<!--
- **updateStrategy** (DaemonSetUpdateStrategy)

  An update strategy to replace existing DaemonSet pods with new pods.
-->
- **updateStrategy** (DaemonSetUpdateStrategy)

  用新 Pod 替換現有 DaemonSet Pod 的更新策略。

  <!--
  <a name="DaemonSetUpdateStrategy"></a>
  *DaemonSetUpdateStrategy is a struct used to control the update strategy for a DaemonSet.*
  -->

  <a name="DaemonSetUpdateStrategy"></a>
  **DaemonSetUpdateStrategy 是一個結構體，用於控制 DaemonSet 的更新策略。**

  <!--
  - **updateStrategy.type** (string)

    Type of daemon set update. Can be "RollingUpdate" or "OnDelete". Default is RollingUpdate.
  -->

  - **updateStrategy.type** (string)

    守護進程集更新的類型。可以是 "RollingUpdate" 或 "OnDelete"。默認爲 RollingUpdate。

    <!--
    Possible enum values:
     - `"OnDelete"` Replace the old daemons only when it's killed
     - `"RollingUpdate"` Replace the old daemons by new ones using rolling update i.e replace them on each node one after the other.
    -->
    
    可能的枚舉值：

     - `"OnDelete"` 僅當舊的守護進程被殺死時才替換它
     - `"RollingUpdate"` 使用滾動更新替換舊的守護進程，即在每個節點上一個接一個地替換它們。
  
  <!--
  - **updateStrategy.rollingUpdate** (RollingUpdateDaemonSet)

    Rolling update config params. Present only if type = "RollingUpdate".
  -->

  - **updateStrategy.rollingUpdate** (RollingUpdateDaemonSet)

    滾動更新設定參數。僅在 type 值爲 "RollingUpdate" 時出現。

    <!--
    <a name="RollingUpdateDaemonSet"></a>
    *Spec to control the desired behavior of daemon set rolling update.*
    -->

    **用於控制守護進程集滾動更新的預期行爲的規約。**

    <!--
    - **updateStrategy.rollingUpdate.maxSurge** (IntOrString)

      The maximum number of nodes with an existing available DaemonSet pod that can have an updated DaemonSet pod during during an update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). This can not be 0 if MaxUnavailable is 0. Absolute number is calculated from percentage by rounding up to a minimum of 1. Default value is 0. Example: when this is set to 30%, at most 30% of the total number of nodes that should be running the daemon pod (i.e. status.desiredNumberScheduled) can have their a new pod created before the old pod is marked as deleted. The update starts by launching new pods on 30% of nodes. Once an updated pod is available (Ready for at least minReadySeconds) the old DaemonSet pod on that node is marked deleted. If the old pod becomes unavailable for any reason (Ready transitions to false, is evicted, or is drained) an updated pod is immediately created on that node without considering surge limits. Allowing surge implies the possibility that the resources consumed by the daemonset on any given node can double if the readiness check fails, and so resource intensive daemonsets should take into account that they may cause evictions during disruption.
    -->

    - **updateStrategy.rollingUpdate.maxSurge** (IntOrString)

      對於擁有可用 DaemonSet Pod 的節點而言，在更新期間可以擁有更新後的 DaemonSet Pod 的最大節點數。
      屬性值可以是絕對數量（例如：5）或所需 Pod 的百分比（例如：10%）。
      如果 maxUnavailable 爲 0，則該值不能爲 0。絕對數是通過四捨五入從百分比計算得出的，最小值爲 1。
      默認值爲 0。示例：當設置爲 30% 時，最多爲節點總數的 30% 節點上應該運行守護進程 Pod
      （即 status.desiredNumberScheduled）
      可以在舊 Pod 標記爲已刪除之前創建一個新 Pod。更新首先在 30% 的節點上啓動新的 Pod。
      一旦更新的 Pod 可用（就緒時長至少 minReadySeconds 秒），該節點上的舊 DaemonSet pod 就會被標記爲已刪除。
      如果舊 Pod 因任何原因變得不可用（Ready 轉換爲 false、被驅逐或節點被騰空），
      則會立即在該節點上創建更新的 Pod，而不考慮激增限制。
      允許激增意味着如果就緒檢查失敗，任何給定節點上的守護進程集消耗的資源可能會翻倍，
      因此資源密集型守護進程集應該考慮到它們可能會在中斷期間導致驅逐。

      <!--
      <a name="IntOrString"></a>
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
      -->

      **IntOrString 是一種可以容納 int32 或字符串的類型。在 JSON 或 YAML
      編組和解組中使用時，它會生成或使用內部類型。
      例如，這允許你擁有一個可以接受名稱或數字的 JSON 字段。**

    <!--
    - **updateStrategy.rollingUpdate.maxUnavailable** (IntOrString)

      The maximum number of DaemonSet pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of total number of DaemonSet pods at the start of the update (ex: 10%). Absolute number is calculated from percentage by rounding up. This cannot be 0 if MaxSurge is 0 Default value is 1. Example: when this is set to 30%, at most 30% of the total number of nodes that should be running the daemon pod (i.e. status.desiredNumberScheduled) can have their pods stopped for an update at any given time. The update starts by stopping at most 30% of those DaemonSet pods and then brings up new DaemonSet pods in their place. Once the new pods are available, it then proceeds onto other DaemonSet pods, thus ensuring that at least 70% of original number of DaemonSet pods are available at all times during the update.
    -->

    - **updateStrategy.rollingUpdate.maxUnavailable** (IntOrString)

      更新期間不可用的 DaemonSet Pod 的最大數量。值可以是絕對數（例如：5）或更新開始時 DaemonSet Pod 總數的百分比（例如：10%）。
      絕對數是通過四捨五入的百分比計算得出的。如果 maxSurge 爲 0，則此值不能爲 0 默認值爲 1。
      例如：當設置爲 30% 時，最多節點總數 30% 的、應該運行守護進程的節點總數（即 status.desiredNumberScheduled）
      可以在任何給定時間停止更新。更新首先停止最多 30% 的 DaemonSet Pod，
      然後在它們的位置啓動新的 DaemonSet Pod。
      一旦新的 Pod 可用，它就會繼續處理其他 DaemonSet Pod，從而確保在更新期間至少 70% 的原始
      DaemonSet Pod 數量始終可用。

      <!--
      <a name="IntOrString"></a>
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
      -->

      **IntOrString 是一種可以保存 int32 或字符串的類型。在 JSON 或 YAML 編組和解組中使用時，
      它會生成或使用內部類型。例如，這允許你擁有一個可以接受名稱或數字的 JSON 字段。**

<!--
- **revisionHistoryLimit** (int32)

  The number of old history to retain to allow rollback. This is a pointer to distinguish between explicit zero and not specified. Defaults to 10.
-->
- **revisionHistoryLimit** (int32)

  用來允許回滾而保留的舊歷史記錄的數量。此字段是個指針，用來區分明確的零值和未指定的指針。默認值是 10。

<!--
## DaemonSetStatus {#DaemonSetStatus}

DaemonSetStatus represents the current status of a daemon set.
-->
## DaemonSetStatus {#DaemonSetStatus}

DaemonSetStatus 表示守護進程集的當前狀態。

<hr>

<!--
- **numberReady** (int32), required

  numberReady is the number of nodes that should be running the daemon pod and have one or more of the daemon pod running with a Ready Condition.
-->
- **numberReady** (int32)，必需

  numberReady 是應該運行守護進程 Pod 並且有一個或多個 DaemonSet Pod 以就緒條件運行的節點數。

<!--
- **numberAvailable** (int32)

  The number of nodes that should be running the daemon pod and have one or more of the daemon pod running and available (ready for at least spec.minReadySeconds)
-->
- **numberAvailable** (int32)

  應該運行守護進程 Pod 並有一個或多個守護進程 Pod 正在運行和可用（就緒時長超過
  `spec.minReadySeconds`）的節點數量。

<!--
- **numberUnavailable** (int32)

  The number of nodes that should be running the daemon pod and have none of the daemon pod running and available (ready for at least spec.minReadySeconds)
-->
- **numberUnavailable** (int32)

  應該運行守護進程 Pod 並且沒有任何守護進程 Pod 正在運行且可用（至少已就緒
  `spec.minReadySeconds` 秒）的節點數。

<!--
- **numberMisscheduled** (int32), required

  The number of nodes that are running the daemon pod, but are not supposed to run the daemon pod. More info: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/
-->
- **numberMisscheduled** (int32)，必需

  正在運行守護進程 Pod，但不應該運行守護進程 Pod 的節點數量。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/daemonset/

<!--
- **desiredNumberScheduled** (int32), required

  The total number of nodes that should be running the daemon pod (including nodes correctly running the daemon pod). More info: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/
-->
- **desiredNumberScheduled** (int32)，必需

  應該運行守護進程 Pod 的節點總數（包括正確運行守護進程 Pod 的節點）。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/daemonset/

<!--
- **currentNumberScheduled** (int32), required

  The number of nodes that are running at least 1 daemon pod and are supposed to run the daemon pod. More info: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/
-->
- **currentNumberScheduled** (int32)，必需

  運行至少 1 個守護進程 Pod 並且應該運行守護進程 Pod 的節點數。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/daemonset/

<!--
- **updatedNumberScheduled** (int32)

  The total number of nodes that are running updated daemon pod
-->
- **updatedNumberScheduled** (int32)

  正在運行更新後的守護進程 Pod 的節點總數。

<!--
- **collisionCount** (int32)

  Count of hash collisions for the DaemonSet. The DaemonSet controller uses this field as a collision avoidance mechanism when it needs to create the name for the newest ControllerRevision.
-->
- **collisionCount** (int32)

  DaemonSet 的哈希衝突計數。DaemonSet 控制器在需要爲最新的 ControllerRevision 創建名稱時使用此字段作爲避免衝突的機制。

<!--
- **conditions** ([]DaemonSetCondition)

  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*
-->
- **conditions** ([]DaemonSetCondition)

  **補丁策略：根據 `type` 鍵合併**

  **Map：鍵 `type` 的唯一值將在合併期間保留**

  <!-- 
  Represents the latest available observations of a DaemonSet's current state.

  <a name="DaemonSetCondition"></a>
  *DaemonSetCondition describes the state of a DaemonSet at a certain point.*
  -->
  表示 DaemonSet 當前狀態的最新可用觀測信息。

  <a name="DaemonSetCondition"></a>
  **DaemonSet Condition 描述了 DaemonSet 在某一時刻的狀態。**

  <!--
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of DaemonSet condition.
  -->

  - **conditions.status** (string)，必需

    狀況的狀態，True、False、Unknown 之一。

  - **conditions.type** (string)，必需

    DaemonSet 狀況的類型。

  <!--
  - **conditions.lastTransitionTime** (Time)

    Last time the condition transitioned from one status to another. 
  -->

  - **conditions.lastTransitionTime** (Time)

    狀況上次從一種狀態轉換到另一種狀態的時間。

    <!--
    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    **Time 是對 time.Time 的封裝，支持正確編碼爲 YAML 和 JSON。time 包爲許多工廠方法提供了封裝器。**
  
  <!--
  - **conditions.message** (string)

    A human readable message indicating details about the transition.
  -->

  - **conditions.message** (string)

    一條人類可讀的消息，指示有關轉換的詳細信息。

  <!--
  - **conditions.reason** (string)

    The reason for the condition's last transition.
  -->

  - **conditions.reason** (string)

    狀況最後一次轉換的原因。

<!--
- **observedGeneration** (int64)

  The most recent generation observed by the daemon set controller.
-->

- **observedGeneration** (int64)

  守護進程集控制器觀察到的最新一代。

<!--
## DaemonSetList {#DaemonSetList}

DaemonSetList is a collection of daemon sets.
-->

## DaemonSetList {#DaemonSetList}

DaemonSetList 是守護進程集的集合。

<hr>

- **apiVersion**: apps/v1

- **kind**: DaemonSetList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>), required

  A list of daemon sets.
-->

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>)，必需

  DaemonSet 的列表。

## Operations {#Operations}

<hr>

<!--
### `get` read the specified DaemonSet

#### HTTP Request

GET /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### Parameters
-->
### `get` 讀取指定的 DaemonSet

#### HTTP 請求

GET /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the DaemonSet
-->
- **name** (**路徑參數**): string，必需

  DaemonSet 的名稱

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

401: 未授權

<!--
### `get` read status of the specified DaemonSet

#### HTTP Request

GET /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### Parameters
-->
### `get` 讀取指定的 DaemonSet 的狀態

#### HTTP 請求

GET /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### 參數

<!--
- **name** (*in path*): string, required

  name of the DaemonSet
-->
- **name** (**路徑參數**): string，必需

  DaemonSet 的名稱

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

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

401: 未授權

<!--
### `list` list or watch objects of kind DaemonSet

#### HTTP Request

GET /apis/apps/v1/namespaces/{namespace}/daemonsets

#### Parameters
-->
### `list` 列表或查看 DaemonSet 類型的對象

#### HTTP 請求

GET /apis/apps/v1/namespaces/{namespace}/daemonsets

#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetList" >}}">DaemonSetList</a>): OK

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetList" >}}">DaemonSetList</a>): OK

401: 未授權

<!--
### `list` list or watch objects of kind DaemonSet

#### HTTP Request

GET /apis/apps/v1/daemonsets

#### Parameters
-->
### `list` 列表或查看 DaemonSet 類型的對象

#### HTTP 請求

GET /apis/apps/v1/daemonsets

#### 參數

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->

- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetList" >}}">DaemonSetList</a>): OK

401: Unauthorized
-->

#### 響應

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetList" >}}">DaemonSetList</a>): OK

401: 未授權

<!--
### `create` create a DaemonSet

#### HTTP Request

POST /apis/apps/v1/namespaces/{namespace}/daemonsets

#### Parameters
-->
### `create` 創建一個 DaemonSet

#### HTTP 請求

POST /apis/apps/v1/namespaces/{namespace}/daemonsets

#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>, required
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

202 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Accepted

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): 已創建

202 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): 已接受

401: 未授權

<!--
### `update` replace the specified DaemonSet

#### HTTP Request

PUT /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### Parameters
-->
### `update` 替換指定的 DaemonSet

#### HTTP 請求

PUT /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### 參數

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the DaemonSet

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>, required
-->
- **name** (**路徑參數**): string，必需

  DaemonSet 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): 已創建

401: 未授權

<!--
### `update` replace status of the specified DaemonSet

#### HTTP Request

PUT /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### Parameters
-->
### `update` 替換指定 DaemonSet 的狀態

#### HTTP 請求

PUT /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### 參數

<!--
- **name** (*in path*): string, required

  name of the DaemonSet

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>, required
-->
- **name** (**路徑參數**): string，必需

  DaemonSet 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): 已創建

401: 未授權

<!--
### `patch` partially update the specified DaemonSet

#### HTTP Request

PATCH /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### Parameters
-->
### `patch` 部分更新指定的 DaemonSet

#### HTTP 請求

PATCH /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the DaemonSet

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->

- **name** (**路徑參數**): string，必需

  DaemonSet 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** **查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): 已創建

401: 未授權

<!--
### `patch` partially update status of the specified DaemonSet

#### HTTP Request

PATCH /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### Parameters
-->
### `patch` 部分更新指定 DaemonSet 的狀態

#### HTTP 請求

PATCH /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### 參數

<!--
- **name** (*in path*): string, required

  name of the DaemonSet

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **name** (**路徑參數**): string，必需

  DaemonSet 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需 

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

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

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): 已創建

401: 未授權

<!--
### `delete` delete a DaemonSet

#### HTTP Request

DELETE /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### Parameters
-->
### `delete` 刪除一個 DaemonSet

#### HTTP 請求

DELETE /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the DaemonSet

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **name** (**路徑參數**): string，必需

  DaemonSet 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized
-->

#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): 已接受

401: 未授權

<!--
### `deletecollection` delete collection of DaemonSet

#### HTTP Request
-->
### `deletecollection` 刪除 DaemonSet 的集合

#### HTTP 請求

DELETE /apis/apps/v1/namespaces/{namespace}/daemonsets

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

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

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: 未授權
