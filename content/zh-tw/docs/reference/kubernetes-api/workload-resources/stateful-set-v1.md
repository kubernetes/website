---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "StatefulSet"
content_type: "api_reference"
description: "StatefulSet 表示一組具有一致身份的 Pod"
title: "StatefulSet"
weight: 7
auto_generated: true
---

<!-- 
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "StatefulSet"
content_type: "api_reference"
description: "StatefulSet represents a set of pods with consistent identities."
title: "StatefulSet"
weight: 7
auto_generated: true
-->

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`

## StatefulSet {#StatefulSet}
<!-- 
StatefulSet represents a set of pods with consistent identities. Identities are defined as:
 - Network: A single stable DNS and hostname.
 - Storage: As many VolumeClaims as requested.

The StatefulSet guarantees that a given network identity will always map to the same storage identity. 
-->
StatefulSet 表示一組具有一致身份的 Pod。身份定義爲：

- 網絡：一個穩定的 DNS 和主機名。
- 存儲：根據要求提供儘可能多的 VolumeClaim。

StatefulSet 保證給定的網絡身份將始終映射到相同的存儲身份。
<hr>

- **apiVersion**: apps/v1

- **kind**: StatefulSet

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!-- 
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata 
  -->
  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata。

- **spec** (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetSpec" >}}">StatefulSetSpec</a>)

  <!-- 
  Spec defines the desired identities of pods in this set. 
  -->
  `spec` 定義集合中 Pod 的預期身份。

- **status** (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetStatus" >}}">StatefulSetStatus</a>)

  <!-- 
  Status is the current status of Pods in this StatefulSet. This data may be out of date by some window of time. 
  -->
  `status` 是 StatefulSet 中 Pod 的當前狀態，此數據可能會在某個時間窗口內過時。

## StatefulSetSpec {#StatefulSetSpec}

<!--
A StatefulSetSpec is the specification of a StatefulSet. 
-->
StatefulSetSpec 是 StatefulSet 的規約。

<hr>

<!-- 
- **serviceName** (string)

  serviceName is the name of the service that governs this StatefulSet. This service must exist before the StatefulSet, and is responsible for the network identity of the set. Pods get DNS/hostnames that follow the pattern: pod-specific-string.serviceName.default.svc.cluster.local where "pod-specific-string" is managed by the StatefulSet controller.  
-->
- **serviceName** (string)

  `serviceName` 是管理此 StatefulSet 服務的名稱。
  該服務必須在 StatefulSet 之前即已存在，並負責該集合的網絡標識。
  Pod 會獲得符合以下模式的 DNS/主機名：pod-specific-string.serviceName.default.svc.cluster.local。
  其中 “pod-specific-string” 由 StatefulSet 控制器管理。

<!-- 
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), required

  selector is a label query over pods that should match the replica count. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors
-->
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)，必需

  `selector` 是對 Pod 的標籤查詢，查詢結果應該匹配副本個數。
  此選擇算符必須與 Pod 模板中的 label 匹配。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors

<!-- 
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), required

  template is the object that describes the pod that will be created if insufficient replicas are detected. Each pod stamped out by the StatefulSet will fulfill this Template, but have a unique identity from the rest of the StatefulSet. Each pod will be named with the format \<statefulsetname>-\<podindex>. For example, a pod in a StatefulSet named "web" with index number "3" would be named "web-3". The only allowed template.spec.restartPolicy value is "Always".
-->
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)，必需

  `template` 是用來描述 Pod 的對象，檢測到副本不足時將創建所描述的 Pod。
  經由 StatefulSet 創建的每個 Pod 都將滿足這個模板，但與 StatefulSet 的其餘 Pod 相比，每個 Pod 具有唯一的標識。
  每個 Pod 將以 \<statefulsetname>-\<podindex> 格式命名。
  例如，名爲 "web" 且索引號爲 "3" 的 StatefulSet 中的 Pod 將被命名爲 "web-3"。
  `template.spec.restartPolicy` 唯一被允許的值是 `Always`。

<!-- 
- **replicas** (int32)

  replicas is the desired number of replicas of the given Template. These are replicas in the sense that they are instantiations of the same Template, but individual replicas also have a consistent identity. 
  If unspecified, defaults to 1.
-->
- **replicas** (int32)

  `replicas` 是給定模板的所需的副本數。之所以稱作副本，是因爲它們是相同模板的實例，
  不過各個副本也具有一致的身份。如果未指定，則默認爲 1。

<!-- 
- **updateStrategy** (StatefulSetUpdateStrategy)

  updateStrategy indicates the StatefulSetUpdateStrategy that will be employed to update Pods in the StatefulSet when a revision is made to Template. 
-->
- **updateStrategy** (StatefulSetUpdateStrategy)

  `updateStrategy` 是一個 StatefulSetUpdateStrategy，表示當對
  `template` 進行修訂時，用何種策略更新 StatefulSet 中的 Pod 集合。

  <!-- 
  <a name="StatefulSetUpdateStrategy"></a>
  *StatefulSetUpdateStrategy indicates the strategy that the StatefulSet controller will use to perform updates. It includes any additional parameters necessary to perform the update for the indicated strategy.*
  -->

  <a name="StatefulSetUpdateStrategy"></a>
  **StatefulSetUpdateStrategy 表示 StatefulSet 控制器將用於執行更新的策略。其中包括爲指定策略執行更新所需的額外參數。**

  - **updateStrategy.type** (string)

    <!--
    Type indicates the type of the StatefulSetUpdateStrategy. Default is RollingUpdate.
    -->

    `type` 表示 StatefulSetUpdateStrategy 的類型，默認爲 RollingUpdate。

    <!--
    Possible enum values:
     - `"OnDelete"` triggers the legacy behavior. Version tracking and ordered rolling restarts are disabled. Pods are recreated from the StatefulSetSpec when they are manually deleted. When a scale operation is performed with this strategy,specification version indicated by the StatefulSet's currentRevision.
     - `"RollingUpdate"` indicates that update will be applied to all Pods in the StatefulSet with respect to the StatefulSet ordering constraints. When a scale operation is performed with this strategy, new Pods will be created from the specification version indicated by the StatefulSet's updateRevision.
    -->

    可能的枚舉值：

      - `"OnDelete"` 觸發傳統行爲。版本跟蹤和有序滾動重啓被禁用。
        當 Pod 被手動刪除時，它們會根據 StatefulSetSpec 重新創建。
        使用此策略執行擴縮操作時，將依據 StatefulSet 的 currentRevision 指示的版本。
      - `"RollingUpdate"` 表示更新將應用於 StatefulSet 中的所有 Pod，
        並遵循 StatefulSet 的排序約束。使用此策略執行擴縮操作時，新 Pod
        將根據 StatefulSet 的 updateRevision 指示的版本創建。

  - **updateStrategy.rollingUpdate** (RollingUpdateStatefulSetStrategy)

    <!-- 
    RollingUpdate is used to communicate parameters when Type is RollingUpdateStatefulSetStrategyType. 
    -->

    當 type 爲 RollingUpdate 時，使用 rollingUpdate 來傳遞參數。

    <!--
    <a name="RollingUpdateStatefulSetStrategy"></a>
    *RollingUpdateStatefulSetStrategy is used to communicate parameter for RollingUpdateStatefulSetStrategyType.*
    -->

    <a name="RollingUpdateStatefulSetStrategy"></a>
    **RollingUpdateStatefulSetStrategy 用於爲 rollingUpdate 類型的更新傳遞參數。**

    - **updateStrategy.rollingUpdate.maxUnavailable** (IntOrString)

      <!-- 
      The maximum number of pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). Absolute number is calculated from percentage by rounding up. This can not be 0. Defaults to 1. This field is alpha-level and is only honored by servers that enable the MaxUnavailableStatefulSet feature. The field applies to all pods in the range 0 to Replicas-1. That means if there is any unavailable pod in the range 0 to Replicas-1, it will be counted towards MaxUnavailable. 
      -->

      更新期間不可用的 Pod 個數上限。取值可以是絕對數量（例如：5）或所需 Pod 的百分比（例如：10%）。
      絕對數是通過四捨五入的百分比計算得出的。不能爲 0，默認爲 1。
      此字段爲 Alpha 級別，僅被啓用 MaxUnavailableStatefulSet 特性的服務器支持。
      此字段適用於 0 到 replicas-1 範圍內的所有 Pod。這意味着如果在 0 到 replicas-1 範圍內有任何不可用的 Pod，
      這些 Pod 將被計入 maxUnavailable 中。

      <!-- 
      <a name="IntOrString"></a>
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
      -->

      <a name="IntOrString"></a>
      **`IntOrString` 是一種可以包含 int32 或字符串數值的類型。在 JSON 或 YAML 編組和解組時，**
      **會生成或使用內部類型。例如，此類型允許你定義一個可以接受名稱或數字的 JSON 字段。**

    - **updateStrategy.rollingUpdate.partition** (int32)

      <!-- 
      Partition indicates the ordinal at which the StatefulSet should be partitioned for updates. During a rolling update, all pods from ordinal Replicas-1 to Partition are updated. All pods from ordinal Partition-1 to 0 remain untouched. This is helpful in being able to do a canary based deployment. The default value is 0.
      -->

      `partition` 表示 StatefulSet 應該被分區進行更新時的序數。
      在滾動更新期間，序數在 replicas-1 和 partition 之間的所有 Pod 都會被更新。
      序數在 partition-1 和 0 之間的所有 Pod 保持不變。
      這一屬性有助於進行金絲雀部署。默認值爲 0。

- **podManagementPolicy** (string)

  <!-- 
  podManagementPolicy controls how pods are created during initial scale up, when replacing pods on nodes, or when scaling down. The default policy is `OrderedReady`, where pods are created in increasing order (pod-0, then pod-1, etc) and the controller will wait until each pod is ready before continuing. When scaling down, the pods are removed in the opposite order. The alternative policy is `Parallel` which will create pods in parallel to match the desired scale without waiting, and on scale down will delete all pods at once. 
  -->

  `podManagementPolicy` 控制在初始規模擴展期間、替換節點上的 Pod 或縮減集合規模時如何創建 Pod。
  默認策略是 “OrderedReady”，各個 Pod 按升序創建的（pod-0，然後是pod-1 等），
  控制器將等到每個 Pod 都準備就緒後再繼續。縮小集合規模時，Pod 會以相反的順序移除。
  另一種策略是 “Parallel”，意味着並行創建 Pod 以達到預期的規模而無需等待，並且在縮小規模時將立即刪除所有 Pod。
  
- **revisionHistoryLimit** (int32)

  <!-- 
  revisionHistoryLimit is the maximum number of revisions that will be maintained in the StatefulSet's revision history. The revision history consists of all revisions not represented by a currently applied StatefulSetSpec version. The default value is 10. 

  *Atomic: will be replaced during a merge*
  -->

  `revisionHistoryLimit` 是在 StatefulSet 的修訂歷史中維護的修訂個數上限。
  修訂歷史中包含並非由當前所應用的 StatefulSetSpec 版本未表示的所有修訂版本。默認值爲 10。

- **volumeClaimTemplates** ([]<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>)

  **原子：將在合併期間被替換**

  <!-- 
  volumeClaimTemplates is a list of claims that pods are allowed to reference. The StatefulSet controller is responsible for mapping network identities to claims in a way that maintains the identity of a pod. Every claim in this list must have at least one matching (by name) volumeMount in one container in the template. A claim in this list takes precedence over any volumes in the template, with the same name.
  -->

  `volumeClaimTemplates` 是允許 Pod 引用的申領列表。
  StatefulSet controller 負責以維持 Pod 身份不變的方式將網絡身份映射到申領之上。
  此列表中的每個申領至少必須在模板的某個容器中存在匹配的（按 `name` 匹配）volumeMount。
  此列表中的申領優先於模板中具有相同名稱的所有卷。

- **minReadySeconds** (int32)

  <!-- 
  Minimum number of seconds for which a newly created pod should be ready without any of its container crashing for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)
  -->

  新創建的 Pod 應準備就緒（其任何容器都未崩潰）的最小秒數，以使其被視爲可用。
  默認爲 0（Pod 準備就緒後將被視爲可用）。

- **persistentVolumeClaimRetentionPolicy** (StatefulSetPersistentVolumeClaimRetentionPolicy)

  <!--
  persistentVolumeClaimRetentionPolicy describes the lifecycle of persistent volume claims created from volumeClaimTemplates. By default, all persistent volume claims are created as needed and retained until manually deleted. This policy allows the lifecycle to be altered, for example by deleting persistent volume claims when their stateful set is deleted, or when their pod is scaled down. This requires the StatefulSetAutoDeletePVC feature gate to be enabled, which is beta.
  -->

  `persistentVolumeClaimRetentionPolicy` 描述從 VolumeClaimTemplates 創建的持久卷申領的生命週期。
  默認情況下，所有持久卷申領都根據需要創建並被保留到手動刪除。
  此策略允許更改申領的生命週期，例如在 StatefulSet 被刪除或其中 Pod 集合被縮容時刪除持久卷申領。
  此屬性需要啓用 StatefulSetAutoDeletePVC 特性門控。特性處於 Beta 階段。

  <!-- 
  <a name="StatefulSetPersistentVolumeClaimRetentionPolicy"></a>
  *StatefulSetPersistentVolumeClaimRetentionPolicy describes the policy used for PVCs created from the StatefulSet VolumeClaimTemplates.*
  -->

  <a name="StatefulSetPersistentVolumeClaimRetentionPolicy"></a>
  **StatefulSetPersistentVolumeClaimRetentionPolicy 描述了用於從 StatefulSet VolumeClaimTemplate 創建的 PVC 的策略**

  - **persistentVolumeClaimRetentionPolicy.whenDeleted** (string)

    <!-- 
    WhenDeleted specifies what happens to PVCs created from StatefulSet VolumeClaimTemplates when the StatefulSet is deleted. The default policy of `Retain` causes PVCs to not be affected by StatefulSet deletion. The `Delete` policy causes those PVCs to be deleted. 
    -->

    `whenDeleted` 指定當 StatefulSet 被刪除時，基於 StatefulSet VolumeClaimTemplates 所創建的 PVC 會發生什麼。
    默認策略 `Retain` 使 PVC 不受 StatefulSet 被刪除的影響。`Delete` 策略會導致這些 PVC 也被刪除。

  - **persistentVolumeClaimRetentionPolicy.whenScaled** (string)

    <!--
    WhenScaled specifies what happens to PVCs created from StatefulSet VolumeClaimTemplates when the StatefulSet is scaled down. The default policy of `Retain` causes PVCs to not be affected by a scaledown. The `Delete` policy causes the associated PVCs for any excess pods above the replica count to be deleted. 
    -->

    `whenScaled` 指定當 StatefulSet 縮容時，基於 StatefulSet volumeClaimTemplates 創建的 PVC 會發生什麼。
    默認策略 `Retain` 使 PVC 不受縮容影響。 `Delete` 策略會導致超出副本個數的所有的多餘 Pod 所關聯的 PVC 被刪除。

- **ordinals** (StatefulSetOrdinals)

  <!--
  ordinals controls the numbering of replica indices in a StatefulSet. The default ordinals behavior assigns a "0" index to the first replica and increments the index by one for each additional replica requested.
  -->
  `ordinals` 控制 StatefulSet 中副本索引的編號。
  默認序數行爲是將索引 "0" 設置給第一個副本，對於每個額外請求的副本，該索引加一。

  <!--
  <a name="StatefulSetOrdinals"></a>
  *StatefulSetOrdinals describes the policy used for replica ordinal assignment in this StatefulSet.*
  -->
  <a name="StatefulSetOrdinals"></a>
  **`StatefulSetOrdinals` 描述此 StatefulSet 中用於副本序數賦值的策略。**

  - **ordinals.start** (int32)

    <!--
    start is the number representing the first replica's index. It may be used to number replicas from an alternate index (eg: 1-indexed) over the default 0-indexed names, or to orchestrate progressive movement of replicas from one StatefulSet to another. If set, replica indices will be in the range:
      [.spec.ordinals.start, .spec.ordinals.start + .spec.replicas).
    If unset, defaults to 0. Replica indices will be in the range:
      [0, .spec.replicas).
    -->
  
    `start` 是代表第一個副本索引的數字。它可用於從替代索引（例如：從 1 開始索引）而非默認的從 0 索引來爲副本設置編號，
    還可用於編排從一個 StatefulSet 到另一個 StatefulSet 的漸進式副本遷移動作。如果設置了此值，副本索引範圍爲
    [.spec.ordinals.start, .spec.ordinals.start + .spec.replicas)。如果不設置，則默認爲 0。
    副本索引範圍爲 [0, .spec.replicas)。

## StatefulSetStatus {#StatefulSetStatus}

<!-- 
StatefulSetStatus represents the current state of a StatefulSet. 
-->
StatefulSetStatus 表示 StatefulSet 的當前狀態。

<hr>

<!-- 
- **replicas** (int32), required

  replicas is the number of Pods created by the StatefulSet controller.  
-->
- **replicas** (int32)，必需

  `replicas` 是 StatefulSet 控制器創建的 Pod 個數。

- **readyReplicas** (int32)

  <!-- 
  readyReplicas is the number of pods created for this StatefulSet with a Ready Condition. 
  -->
  `readyReplicas` 是爲此 StatefulSet 創建的、狀況爲 Ready 的 Pod 個數。

- **currentReplicas** (int32)

  <!-- 
  currentReplicas is the number of Pods created by the StatefulSet controller from the StatefulSet version indicated by currentRevision. 
  -->
  `currentReplicas` 是 StatefulSet 控制器根據 `currentReplicas` 所指的 StatefulSet 版本創建的 Pod 個數。

- **updatedReplicas** (int32)

  <!-- 
  updatedReplicas is the number of Pods created by the StatefulSet controller from the StatefulSet version indicated by updateRevision.
  -->
  `updatedReplicas` 是 StatefulSet 控制器根據 `updateRevision` 所指的 StatefulSet 版本創建的 Pod 個數。

- **availableReplicas** (int32)

  <!-- 
  Total number of available pods (ready for at least minReadySeconds) targeted by this statefulset.
  -->
  此 StatefulSet 所對應的可用 Pod 總數（就緒時長至少爲 `minReadySeconds`）。

- **collisionCount** (int32)

  <!-- 
  collisionCount is the count of hash collisions for the StatefulSet. The StatefulSet controller uses this field as a collision avoidance mechanism when it needs to create the name for the newest ControllerRevision. 
  -->
  `collisionCount` 是 StatefulSet 的哈希衝突計數。
  StatefulSet controller 在需要爲最新的 `controllerRevision` 創建名稱時使用此字段作爲避免衝突的機制。

- **conditions** ([]StatefulSetCondition)

  <!-- 
  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  -->
  **補丁策略：根據 `type` 鍵執行合併操作**

  **Map：鍵 `type` 的唯一值將在合併期間保留**

  <!-- 
  Represents the latest available observations of a statefulset's current state. 
  -->
  表示 StatefulSet 當前狀態的最新可用觀察結果。

  <!-- 
  <a name="StatefulSetCondition"></a>
  *StatefulSetCondition describes the state of a statefulset at a certain point.*
  -->

  <a name="StatefulSetCondition"></a>
  **StatefulSetCondition 描述了 StatefulSet 在某個點的狀態。**

  <!-- 
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.  
  -->

  - **conditions.status** (string)，必需

    狀況的狀態爲 True、False、Unknown 之一。

  <!-- 
  - **conditions.type** (string), required

    Type of statefulset condition.   
  -->

  - **conditions.type** (string)，必需

    StatefulSet 狀況的類型。

  - **conditions.lastTransitionTime** (Time)

    <!-- 
    Last time the condition transitioned from one status to another. 
    -->

    最近一次狀況從一種狀態轉換到另一種狀態的時間。

    <!-- 
    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    <a name="Time"></a>
    **`Time` 是 `time.Time` 的包裝器，它支持對 YAML 和 JSON 的正確編組。**
    **`time` 包的許多工廠方法提供了包裝器。**

  - **conditions.message** (string)

    <!-- 
    A human readable message indicating details about the transition. 
    -->

    一條人類可讀的消息，指示有關轉換的詳細信息。

  - **conditions.reason** (string)

    <!-- 
    The reason for the condition's last transition. 
    -->

    狀況最後一次轉換的原因。

- **currentRevision** (string)

  <!-- 
  currentRevision, if not empty, indicates the version of the StatefulSet used to generate Pods in the sequence [0,currentReplicas). 
  -->

  `currentRevision`，如果不爲空，表示用於在序列 [0,currentReplicas) 之間生成 Pod 的 StatefulSet 的版本。

- **updateRevision** (string)

  <!-- 
  updateRevision, if not empty, indicates the version of the StatefulSet used to generate Pods in the sequence [replicas-updatedReplicas,replicas) 
  -->

  `updateRevision`，如果不爲空，表示用於在序列 [replicas-updatedReplicas,replicas)
  之間生成 Pod 的 StatefulSet 的版本。

- **observedGeneration** (int64)

  <!-- 
  observedGeneration is the most recent generation observed for this StatefulSet. It corresponds to the StatefulSet's generation, which is updated on mutation by the API Server. 
  -->

  `observedGeneration` 是 StatefulSet 的最新一代。它對應於 StatefulSet
  的代數，由 API 服務器在變更時更新。

## StatefulSetList {#StatefulSetList}

<!-- 
StatefulSetList is a collection of StatefulSets. 
-->

StatefulSetList 是 StatefulSet 的集合。

<hr>

- **apiVersion**: apps/v1

- **kind**: StatefulSetList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!-- 
  Standard list's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata 
  -->

  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!-- 
- **items** ([]<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>), required

  Items is the list of stateful sets.  
-->

- **items** ([]<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>)，必需

  `items` 是 StatefulSet 的列表。

<!-- 
## Operations {#Operations} 
-->
## 操作   {#operations}

<hr>

<!-- 
### `get` read the specified StatefulSet 
#### HTTP Request
-->
### `get` 讀取指定的 StatefulSet

#### HTTP 請求

GET /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}

<!-- 
#### Parameters 
-->
#### 參數

<!-- 
- **name** (*in path*): string, required

  name of the StatefulSet
-->
- **name** (**路徑參數**): string，必需

  StatefulSet 的名稱。

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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

401: Unauthorized

<!-- 
### `get` read status of the specified StatefulSet 
#### HTTP Request 
-->
### `get` 讀取指定 StatefulSet 的狀態

#### HTTP 請求

GET /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}/status

<!-- 
#### Parameters 
-->
#### 參數

<!-- 
- **name** (*in path*): string, required

  name of the StatefulSet
-->
- **name** (**路徑參數**): string，必需

  StatefulSet 的名稱。

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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

401: Unauthorized

<!-- 
### `list` list or watch objects of kind StatefulSet 
#### HTTP Request 
-->
### `list` 列出或監視 StatefulSet 類型的對象

#### HTTP 請求

GET /apis/apps/v1/namespaces/{namespace}/statefulsets

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

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetList" >}}">StatefulSetList</a>): OK

401: Unauthorized

<!-- 
### `list` list or watch objects of kind StatefulSet
#### HTTP Request
-->
### `list` 列出或監視 StatefulSet 類型的對象

#### HTTP 請求

GET /apis/apps/v1/statefulsets

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

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetList" >}}">StatefulSetList</a>): OK

401: Unauthorized

<!-- 
### `create` create a StatefulSet
#### HTTP Request 
-->
### `create` 創建一個 StatefulSet

#### HTTP 請求

POST /apis/apps/v1/namespaces/{namespace}/statefulsets

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
- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, required 
-->
- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>，必需

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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

202 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Accepted

401: Unauthorized

<!-- 
### `update` replace the specified StatefulSet
#### HTTP Request 
-->
### `update` 替換指定的 StatefulSet

#### HTTP 請求

PUT /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}

<!-- 
#### Parameters 
-->
#### 參數

<!-- 
- **name** (*in path*): string, required

  name of the StatefulSet 
-->
- **name** (**路徑參數**): string，必需

  StatefulSet 的名稱。

<!-- 
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a> 
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!-- 
- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, required 
-->
- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>，必需

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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

401: Unauthorized

<!-- 
### `update` replace status of the specified StatefulSet
#### HTTP Request 
-->
### `update` 替換指定 StatefulSet 的狀態
#### HTTP 請求

PUT /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}/status

<!-- 
#### Parameters
-->
#### 參數

<!-- 
- **name** (*in path*): string, required

  name of the StatefulSet 
-->
- **name** (**路徑參數**): string，必需

  StatefulSet 的名稱。

<!-- 
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a> 
-->
- **namespace** (**路徑參數**): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a> 

<!-- 
- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, required 
-->
- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>，必需

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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

401: Unauthorized

<!-- 
### `patch` partially update the specified StatefulSet
#### HTTP Request 
-->
### `patch` 部分更新指定的 StatefulSet

#### HTTP 請求

PATCH /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}

<!-- 
#### Parameters
-->
#### 參數

<!-- 
- **name** (*in path*): string, required

  name of the StatefulSet
-->
- **name** (**路徑參數**): string，必需

  StatefulSet 的名稱。

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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

401: Unauthorized

<!-- 
### `patch` partially update status of the specified StatefulSet
#### HTTP Request 
-->
### `patch` 部分更新指定 StatefulSet 的狀態

#### HTTP 請求

PATCH /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}/status

<!-- 
#### Parameters 
-->
#### 參數

<!-- 
- **name** (*in path*): string, required
 
  name of the StatefulSet
-->
- **name** (**路徑參數**): string，必需

  StatefulSet 的名稱。

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

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

401: Unauthorized

<!-- 
### `delete` delete a StatefulSet
#### HTTP Request 
-->
### `delete` 刪除一個 StatefulSet

#### HTTP 請求

DELETE /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}

<!-- 
#### Parameters 
-->
#### 參數

<!-- 
- **name** (*in path*): string, required

  name of the StatefulSet 
-->
- **name** (**路徑參數**): string，必需

  StatefulSet 的名稱。

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
### `deletecollection` delete collection of StatefulSet
#### HTTP Request 
-->
### `deletecollection` 刪除 StatefulSet 的集合

#### HTTP 請求

DELETE /apis/apps/v1/namespaces/{namespace}/statefulsets

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

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
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
