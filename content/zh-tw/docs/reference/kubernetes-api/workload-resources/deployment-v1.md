---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "Deployment"
content_type: "api_reference"
description: "Deployment 使得 Pod 和 ReplicaSet 能夠進行聲明式更新。"
title: "Deployment"
weight: 6
---
<!--
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "Deployment"
content_type: "api_reference"
description: "Deployment enables declarative updates for Pods and ReplicaSets."
title: "Deployment"
weight: 6
auto_generated: true
-->

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`

## Deployment {#Deployment}

<!--
Deployment enables declarative updates for Pods and ReplicaSets.
-->
Deployment 使得 Pod 和 ReplicaSet 能夠進行聲明式更新。

<hr>

- **apiVersion**: apps/v1

- **kind**: Deployment

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/deployment-v1#DeploymentSpec" >}}">DeploymentSpec</a>)

  Specification of the desired behavior of the Deployment.

- **status** (<a href="{{< ref "../workload-resources/deployment-v1#DeploymentStatus" >}}">DeploymentStatus</a>)

  Most recently observed status of the Deployment.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/deployment-v1#DeploymentSpec" >}}">DeploymentSpec</a>)

  Deployment 預期行爲的規約。

- **status** (<a href="{{< ref "../workload-resources/deployment-v1#DeploymentStatus" >}}">DeploymentStatus</a>)

  最近觀測到的 Deployment 狀態。

## DeploymentSpec {#DeploymentSpec}

<!--
DeploymentSpec is the specification of the desired behavior of the Deployment.
-->
DeploymentSpec 定義 Deployment 預期行爲的規約。

<hr>

<!--
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), required

  Label selector for pods. Existing ReplicaSets whose pods are selected by this will be the ones affected by this deployment. It must match the pod template's labels.

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), required

  Template describes the pods that will be created. The only allowed template.spec.restartPolicy value is "Always".
-->
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)，必需

  供 Pod 所用的標籤選擇算符。通過此字段選擇現有 ReplicaSet 的 Pod 集合，
  被選中的 ReplicaSet 將受到這個 Deployment 的影響。此字段必須與 Pod 模板的標籤匹配。

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)，必需

  template 描述將要創建的 Pod。`template.spec.restartPolicy`
  唯一被允許的值是 `Always`。

<!--
- **replicas** (int32)

  Number of desired pods. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1.

- **minReadySeconds** (int32)

  Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)
-->
- **replicas** (int32)

  預期 Pod 的數量。這是一個指針，用於辨別顯式零和未指定的值。預設爲 1。

- **minReadySeconds** (int32)

  新建的 Pod 在沒有任何容器崩潰的情況下就緒並被系統視爲可用的最短秒數。
  預設爲 0（Pod 就緒後即被視爲可用）。

<!--
- **strategy** (DeploymentStrategy)

  *Patch strategy: retainKeys*

  The deployment strategy to use to replace existing pods with new ones.

  <a name="DeploymentStrategy"></a>
  *DeploymentStrategy describes how to replace existing pods with new ones.*
-->
- **strategy** (DeploymentStrategy)

  **補丁策略：retainKeys**

  將現有 Pod 替換爲新 Pod 時所用的部署策略。

  <a name="DeploymentStrategy"></a>
  **DeploymentStrategy 描述如何將現有 Pod 替換爲新 Pod。**

  <!--
  - **strategy.type** (string)

    Type of deployment. Can be "Recreate" or "RollingUpdate". Default is RollingUpdate.

    Possible enum values:
     - `"Recreate"` Kill all existing pods before creating new ones.
     - `"RollingUpdate"` Replace the old ReplicaSets by new one using rolling update i.e gradually scale down the old ReplicaSets and scale up the new one.
  -->
  - **strategy.type** (string)

    部署的類型。取值可以是 “Recreate” 或 “RollingUpdate”。預設爲 RollingUpdate。

    可能的枚舉值：
     - `"Recreate"`：在創建新實例之前殺死所有現有的 Pod。
     - `"RollingUpdate"`：使用滾動更新替換舊的 ReplicaSet，即逐漸縮小舊的 ReplicaSet 並擴大新的 ReplicaSet。

  <!--
  - **strategy.rollingUpdate** (RollingUpdateDeployment)

    Rolling update config params. Present only if DeploymentStrategyType = RollingUpdate.

    <a name="RollingUpdateDeployment"></a>
    *Spec to control the desired behavior of rolling update.*
  -->
  
  - **strategy.rollingUpdate** (RollingUpdateDeployment)

    滾動更新這些設定參數。僅當 DeploymentStrategyType = RollingUpdate 時纔出現。
    
    <a name="RollingUpdateDeployment"></a>
    **控制滾動更新預期行爲的規約。**

    <!--
    - **strategy.rollingUpdate.maxSurge** (IntOrString)

      The maximum number of pods that can be scheduled above the desired number of pods. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). This can not be 0 if MaxUnavailable is 0. Absolute number is calculated from percentage by rounding up. Defaults to 25%. Example: when this is set to 30%, the new ReplicaSet can be scaled up immediately when the rolling update starts, such that the total number of old and new pods do not exceed 130% of desired pods. Once old pods have been killed, new ReplicaSet can be scaled up further, ensuring that total number of pods running at any time during the update is at most 130% of desired pods.

      <a name="IntOrString"></a>
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
    -->

    - **strategy.rollingUpdate.maxSurge** (IntOrString)

      超出預期的 Pod 數量之後可以調度的最大 Pod 數量。該值可以是一個絕對數（例如：
      5）或一個預期 Pod 的百分比（例如：10%）。如果 MaxUnavailable 爲 0，則此字段不能爲 0。
      通過向上取整計算得出一個百分比絕對數。預設爲 25%。例如：當此值設爲 30% 時，
      如果滾動更新啓動，則可以立即對 ReplicaSet 擴容，從而使得新舊 Pod 總數不超過預期 Pod 數量的 130%。
      一旦舊 Pod 被殺死，則可以再次對新的 ReplicaSet 擴容，
      確保更新期間任何時間運行的 Pod 總數最多爲預期 Pod 數量的 130%。

      <a name="IntOrString"></a>
      **IntOrString 是可以保存 int32 或字符串的一個類型。
      當用於 JSON 或 YAML 編組和取消編組時，它會產生或消費內部類型。
      例如，這允許你擁有一個可以接受名稱或數值的 JSON 字段。**

    <!--
    - **strategy.rollingUpdate.maxUnavailable** (IntOrString)

      The maximum number of pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). Absolute number is calculated from percentage by rounding down. This can not be 0 if MaxSurge is 0. Defaults to 25%. Example: when this is set to 30%, the old ReplicaSet can be scaled down to 70% of desired pods immediately when the rolling update starts. Once new pods are ready, old ReplicaSet can be scaled down further, followed by scaling up the new ReplicaSet, ensuring that the total number of pods available at all times during the update is at least 70% of desired pods.

      <a name="IntOrString"></a>
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
    -->

    - **strategy.rollingUpdate.maxUnavailable** (IntOrString)

      更新期間可能不可用的最大 Pod 數量。該值可以是一個絕對數（例如：
      5）或一個預期 Pod 的百分比（例如：10%）。通過向下取整計算得出一個百分比絕對數。
      如果 MaxSurge 爲 0，則此字段不能爲 0。預設爲 25%。
      例如：當此字段設爲 30%，則在滾動更新啓動時 ReplicaSet 可以立即縮容爲預期 Pod 數量的 70%。
      一旦新的 Pod 就緒，ReplicaSet 可以再次縮容，接下來對新的 ReplicaSet 擴容，
      確保更新期間任何時間可用的 Pod 總數至少是預期 Pod 數量的 70%。

      <a name="IntOrString"></a>
      **IntOrString 是可以保存 int32 或字符串的一個類型。
      當用於 JSON 或 YAML 編組和取消編組時，它會產生或消費內部類型。
      例如，這允許你擁有一個可以接受名稱或數值的 JSON 字段。**

<!--
- **revisionHistoryLimit** (int32)

  The number of old ReplicaSets to retain to allow rollback. This is a pointer to distinguish between explicit zero and not specified. Defaults to 10.

- **progressDeadlineSeconds** (int32)

  The maximum time in seconds for a deployment to make progress before it is considered to be failed. The deployment controller will continue to process failed deployments and a condition with a ProgressDeadlineExceeded reason will be surfaced in the deployment status. Note that progress will not be estimated during the time a deployment is paused. Defaults to 600s.

- **paused** (boolean)

  Indicates that the deployment is paused.
-->
- **revisionHistoryLimit** (int32)
  
  保留允許回滾的舊 ReplicaSet 的數量。這是一個指針，用於辨別顯式零和未指定的值。預設爲 10。

- **progressDeadlineSeconds** (int32)

  Deployment 在被視爲失敗之前取得進展的最大秒數。Deployment 控制器將繼續處理失敗的 Deployment，
  原因爲 ProgressDeadlineExceeded 的狀況將被顯示在 Deployment 狀態中。
  請注意，在 Deployment 暫停期間將不會估算進度。預設爲 600s。

- **paused** (boolean)

  指示 Deployment 被暫停。

## DeploymentStatus {#DeploymentStatus}

<!--
DeploymentStatus is the most recently observed status of the Deployment.
-->
DeploymentStatus 是最近觀測到的 Deployment 狀態。

<hr>

<!--
- **replicas** (int32)

  Total number of non-terminating pods targeted by this deployment (their labels match the selector).

- **availableReplicas** (int32)

  Total number of available non-terminating pods (ready for at least minReadySeconds) targeted by this deployment.

- **readyReplicas** (int32)

  Total number of non-terminating pods targeted by this Deployment with a Ready Condition.
-->
- **replicas** (int32)

  此 Deployment 所針對的（其標籤與選擇算符匹配）未終止 Pod 的總數。

- **availableReplicas** (int32)

  此 Deployment 針對的可用（至少 minReadySeconds 才能就緒）非終止的 Pod 總數。

- **readyReplicas** (int32)

  該 Deployment 所管理的、具有 Ready 狀況的非終止 Pod 的總數。

<!--
- **unavailableReplicas** (int32)

  Total number of unavailable pods targeted by this deployment. This is the total number of pods that are still required for the deployment to have 100% available capacity. They may either be pods that are running but not yet available or pods that still have not been created.
-->
- **unavailableReplicas** (int32)

  此 Deployment 針對的不可用 Pod 總數。這是 Deployment 具有 100% 可用容量時仍然必需的 Pod 總數。
  它們可能是正在運行但還不可用的 Pod，也可能是尚未創建的 Pod。

<!--
- **updatedReplicas** (int32)

  Total number of non-terminating pods targeted by this deployment that have the desired template spec.

- **terminatingReplicas** (int32)

  Total number of terminating pods targeted by this deployment. Terminating pods have a non-null .metadata.deletionTimestamp and have not yet reached the Failed or Succeeded .status.phase.

  This is an alpha field. Enable DeploymentReplicaSetTerminatingReplicas to be able to use this field.

- **collisionCount** (int32)

  Count of hash collisions for the Deployment. The Deployment controller uses this field as a collision avoidance mechanism when it needs to create the name for the newest ReplicaSet.
-->
- **updatedReplicas** (int32)

  此 Deployment 所針對的未終止 Pod 的總數，這些 Pod 採用了預期的模板規約。

- **terminatingReplicas** (int32)

  此 Deployment 所管理的處於終止狀態的 Pod 總數。
  終止中的 Pod 指的是其 .metadata.deletionTimestamp 不爲空，
  且其 .status.phase 尚未變爲 Failed 或 Succeeded 的 Pod。

  這是一個 Alpha 字段。要使用該字段，需要啓用 DeploymentReplicaSetTerminatingReplicas 特性門控。

- **collisionCount** (int32)

  供 Deployment 所用的哈希衝突計數。
  Deployment 控制器在需要爲最新的 ReplicaSet 創建名稱時將此字段用作衝突預防機制。

<!--
- **conditions** ([]DeploymentCondition)

  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*

  Represents the latest available observations of a deployment's current state.

  <a name="DeploymentCondition"></a>
  *DeploymentCondition describes the state of a deployment at a certain point.*
-->
- **conditions** ([]DeploymentCondition)

  **補丁策略：按照鍵 `type` 合併**

  **Map：鍵 `type` 的唯一值將在合併期間保留**

  表示 Deployment 當前狀態的最新可用觀測值。

  <a name="DeploymentCondition"></a>
  **DeploymentCondition 描述某個點的 Deployment 狀態。**

  <!--
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of deployment condition.
  -->

  - **conditions.status** (string)，必需
    
    狀況的狀態，取值爲 True、False 或 Unknown 之一。
  
  - **conditions.type** (string)，必需

    Deployment 狀況的類型。

  <!--
  - **conditions.lastTransitionTime** (Time)

    Last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)

    狀況上次從一個狀態轉換爲另一個狀態的時間。

    <a name="Time"></a>
    **Time 是對 time.Time 的封裝。Time 支持對 YAML 和 JSON 進行正確封包。
    爲 time 包的許多函數方法提供了封裝器。**

  <!--
  - **conditions.lastUpdateTime** (Time)

    The last time this condition was updated.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastUpdateTime** (Time)

    上次更新此狀況的時間。

    <a name="Time"></a> 
    **Time 是對 time.Time 的封裝。Time 支持對 YAML 和 JSON 進行正確封包。
    爲 time 包的許多函數方法提供了封裝器。**

  <!--
  - **conditions.message** (string)

    A human readable message indicating details about the transition.

  - **conditions.reason** (string)

    The reason for the condition's last transition.
  -->

  - **conditions.message** (string)

    這是一條人類可讀的消息，指示有關上次轉換的詳細資訊。

  - **conditions.reason** (string)

    狀況上次轉換的原因。

<!--
- **observedGeneration** (int64)

  The generation observed by the deployment controller.
-->
- **observedGeneration** (int64)

  Deployment 控制器觀測到的代數（Generation）。

## DeploymentList {#DeploymentList}

<!--
DeploymentList is a list of Deployments.
-->
DeploymentList 是 Deployment 的列表。

<hr>

- **apiVersion**: apps/v1

- **kind**: DeploymentList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata.

- **items** ([]<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>), required

  Items is the list of Deployments.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元資料。

- **items** ([]<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>)，必需

  items 是 Deployment 的列表。

<!--
## Operations {#Operations}
<hr>
### `get` read the specified Deployment
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 Deployment

#### HTTP 請求

GET /apis/apps/v1/namespaces/{namespace}/deployments/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Deployment
- **namespace** (*in path*): string, required
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  Deployment 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified Deployment
#### HTTP Request
-->
### `get` 讀取指定的 Deployment 的狀態

#### HTTP 請求

GET /apis/apps/v1/namespaces/{namespace}/deployments/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Deployment
- **namespace** (*in path*): string, required
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  Deployment 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Deployment
#### HTTP Request
-->
### `list` 列出或監視 Deployment 類別的對象

#### HTTP 請求

GET /apis/apps/v1/namespaces/{namespace}/deployments

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/deployment-v1#DeploymentList" >}}">DeploymentList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Deployment
#### HTTP Request
-->
### `list` 列出或監視 Deployment 類別的對象

#### HTTP 請求

GET /apis/apps/v1/deployments

<!--
#### Parameters
- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
#### 參數

- **allowWatchBookmarks** (**查詢參數**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/deployment-v1#DeploymentList" >}}">DeploymentList</a>): OK

401: Unauthorized

<!--
### `create` create a Deployment
#### HTTP Request
-->
### `create` 創建 Deployment

#### HTTP 請求

POST /apis/apps/v1/namespaces/{namespace}/deployments

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>，必需

- **dryRun** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): OK

201 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): Created

202 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified Deployment
#### HTTP Request
-->
### `update` 替換指定的 Deployment

#### HTTP 請求

PUT /apis/apps/v1/namespaces/{namespace}/deployments/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Deployment
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需
  
  Deployment 的名稱。

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>，必需

- **dryRun** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): OK

201 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified Deployment
#### HTTP Request
-->
### `update` 替換指定的 Deployment 的狀態

#### HTTP 請求

PUT /apis/apps/v1/namespaces/{namespace}/deployments/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Deployment
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需
  
  Deployment 的名稱。

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>，必需

- **dryRun** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): OK

201 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified Deployment
#### HTTP Request
-->
### `patch` 部分更新指定的 Deployment

#### HTTP 請求

PATCH /apis/apps/v1/namespaces/{namespace}/deployments/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Deployment
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需
  
  Deployment 的名稱。

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): OK

201 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified Deployment
#### HTTP Request
-->
### `patch` 部分更新指定的 Deployment 的狀態

#### HTTP 請求

PATCH /apis/apps/v1/namespaces/{namespace}/deployments/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Deployment
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需
  
  Deployment 的名稱。

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): OK

201 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): Created

401: Unauthorized

<!--
### `delete` delete a Deployment
#### HTTP Request
-->
### `delete` 刪除 Deployment

#### HTTP 請求

DELETE /apis/apps/v1/namespaces/{namespace}/deployments/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the Deployment
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需
  
  Deployment 的名稱。

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢參數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

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
### `deletecollection` delete collection of Deployment
#### HTTP Request
-->
### `deletecollection` 刪除 Deployment 的集合

#### HTTP 請求

DELETE /apis/apps/v1/namespaces/{namespace}/deployments

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **sendInitialEvents** (*in query*): boolean
- **timeoutSeconds** (*in query*): integer
-->
#### 參數

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢參數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
