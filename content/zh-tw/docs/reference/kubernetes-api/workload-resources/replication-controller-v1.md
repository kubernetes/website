---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ReplicationController"
content_type: "api_reference"
description: "ReplicationController 表示一個副本控制器的設定。"
title: "ReplicationController"
weight: 4
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ReplicationController"
content_type: "api_reference"
description: "ReplicationController represents the configuration of a replication controller."
title: "ReplicationController"
weight: 4
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## ReplicationController {#ReplicationController}

<!--
ReplicationController represents the configuration of a replication controller.
-->
ReplicationController 表示一個副本控制器的設定。

<hr>

- **apiVersion**: v1

- **kind**: ReplicationController

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  If the Labels of a ReplicationController are empty, they are defaulted to be the same as the Pod(s) that the replication controller manages. Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerSpec" >}}">ReplicationControllerSpec</a>)

  Spec defines the specification of the desired behavior of the replication controller. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  
  如果 ReplicationController 的標籤爲空，則這些標籤預設爲與副本控制器管理的 Pod 相同。
  標準的對象元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerSpec" >}}">ReplicationControllerSpec</a>)
  
  spec 定義副本控制器預期行爲的規約。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerStatus" >}}">ReplicationControllerStatus</a>)

  Status is the most recently observed status of the replication controller. This data may be out of date by some window of time. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerStatus" >}}">ReplicationControllerStatus</a>)
  
  status 是最近觀測到的副本控制器的狀態。此資料可能在某個時間窗之後過期。
  該值由系統填充，只讀。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## ReplicationControllerSpec {#ReplicationControllerSpec}

<!--
ReplicationControllerSpec is the specification of a replication controller.
-->
ReplicationControllerSpec 表示一個副本控制器的規約。

<hr>

<!--
- **selector** (map[string]string)

  Selector is a label query over pods that should match the Replicas count. If Selector is empty, it is defaulted to the labels present on the Pod template. Label keys and values that must match in order to be controlled by this replication controller, if empty defaulted to labels on Pod template. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)

  Template is the object that describes the pod that will be created if insufficient replicas are detected. This takes precedence over a TemplateRef. The only allowed template.spec.restartPolicy value is "Always". More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template
-->
- **selector** (map[string]string)
  
  selector 是針對 Pod 的標籤查詢，符合條件的 Pod 個數應與 replicas 匹配。
  如果 selector 爲空，則預設爲出現在 Pod 模板中的標籤。
  如果置空以表示預設使用 Pod 模板中的標籤，則標籤的主鍵和取值必須匹配，以便由這個副本控制器進行控制。
  `template.spec.restartPolicy` 唯一被允許的值是 `Always`。
  更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)
  
  template 是描述 Pod 的一個對象，將在檢測到副本不足時創建此對象。
  此字段優先於 templateRef。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicationcontroller#pod-template

<!--
- **replicas** (int32)

  Replicas is the number of desired replicas. This is a pointer to distinguish between explicit zero and unspecified. Defaults to 1. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller

- **minReadySeconds** (int32)

  Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)
-->
- **replicas** (int32)
  
  replicas 是預期副本的數量。這是一個指針，用於辨別顯式零和未指定的值。預設爲 1。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller

- **minReadySeconds** (int32)
  
  新建的 Pod 在沒有任何容器崩潰的情況下就緒並被系統視爲可用的最短秒數。
  預設爲 0（Pod 就緒後即被視爲可用）。

## ReplicationControllerStatus {#ReplicationControllerStatus}

<!--
ReplicationControllerStatus represents the current status of a replication controller.
-->
ReplicationControllerStatus 表示一個副本控制器的當前狀態。

<hr>

<!--
- **replicas** (int32), required

  Replicas is the most recently observed number of replicas. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller

- **availableReplicas** (int32)

  The number of available replicas (ready for at least minReadySeconds) for this replication controller.
-->
- **replicas** (int32)，必需
  
  replicas 是最近觀測到的副本數量。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller

- **availableReplicas** (int32)
  
  這個副本控制器可用副本（至少 minReadySeconds 才能就緒）的數量。

<!--
- **readyReplicas** (int32)

  The number of ready replicas for this replication controller.

- **fullyLabeledReplicas** (int32)

  The number of pods that have labels matching the labels of the pod template of the replication controller.
-->
- **readyReplicas** (int32)
  
  此副本控制器所用的就緒副本的數量。

- **fullyLabeledReplicas** (int32)
  
  標籤與副本控制器的 Pod 模板標籤匹配的 Pod 數量。

<!--
- **conditions** ([]ReplicationControllerCondition)

  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*

  Represents the latest available observations of a replication controller's current state.

  <a name="ReplicationControllerCondition"></a>
  *ReplicationControllerCondition describes the state of a replication controller at a certain point.*
-->
- **conditions** ([]ReplicationControllerCondition)
  
  **補丁策略：按照鍵 `type` 合併**

  **Map：鍵 `type` 的唯一值將在合併期間保留**
 
  表示副本控制器當前狀態的最新可用觀測值。
  
  <a name="ReplicationControllerCondition"></a>
  **ReplicationControllerCondition 描述某個點的副本控制器的狀態。**
  
  <!--
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of replication controller condition.
  -->

  - **conditions.status** (string)，必需

    狀況的狀態，取值爲 True、False 或 Unknown 之一。
  
  - **conditions.type** (string)，必需

    副本控制器狀況的類型。
  
  <!--
  - **conditions.lastTransitionTime** (Time)

    The last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)

    狀況上次從一個狀態轉換爲另一個狀態的時間。

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

  ObservedGeneration reflects the generation of the most recently observed replication controller.

## ReplicationControllerList {#ReplicationControllerList}

ReplicationControllerList is a collection of replication controllers.
-->
- **observedGeneration** (int64)
  
  observedGeneration 反映了最近觀測到的副本控制器的生成情況。

## ReplicationControllerList {#ReplicationControllerList}

ReplicationControllerList 是副本控制器的集合。

<hr>

- **apiVersion**: v1

- **kind**: ReplicationControllerList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>), required

  List of replication controllers. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  
  標準的列表元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>)，必需
  
  副本控制器的列表。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicationcontroller

<!--
## Operations {#Operations}
<hr>
### `get` read the specified ReplicationController
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 ReplicationController

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/replicationcontrollers/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicationController
- **namespace** (*in path*): string, required
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需
  
  ReplicationController 的名稱。

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified ReplicationController
#### HTTP Request
-->
### `get` 讀取指定的 ReplicationController 的狀態

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicationController
- **namespace** (*in path*): string, required
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需
  
  ReplicationController 的名稱。

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ReplicationController
#### HTTP Request
-->
### `list` 列舉或監視 ReplicationController 類別的對象

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/replicationcontrollers

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

- **sendInitialEvents** (*查詢參數*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerList" >}}">ReplicationControllerList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ReplicationController
#### HTTP Request
-->
### `list` 列舉或監視 ReplicationController 類別的對象

#### HTTP 請求

GET /api/v1/replicationcontrollers

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

- **sendInitialEvents** (*查詢參數*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerList" >}}">ReplicationControllerList</a>): OK

401: Unauthorized

<!--
### `create` create a ReplicationController
#### HTTP Request
-->
### `create` 創建 ReplicationController

#### HTTP 請求

POST /api/v1/namespaces/{namespace}/replicationcontrollers

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>，必需

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

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

202 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ReplicationController
#### HTTP Request
-->
### `update` 替換指定的 ReplicationController

#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/replicationcontrollers/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicationController
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需
  
  ReplicationController 的名稱。

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>，必需

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

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified ReplicationController
#### HTTP Request
-->
### `update` 替換指定的 ReplicationController 的狀態

#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicationController
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需
  
  ReplicationController 的名稱。

- **namespace** (**路徑參數**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>，必需

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

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ReplicationController
#### HTTP Request
-->
### `patch` 部分更新指定的 ReplicationController

#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/replicationcontrollers/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicationController
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
  
  ReplicationController 的名稱。

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

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified ReplicationController
#### HTTP Request
-->
### `patch` 部分更新指定的 ReplicationController 的狀態

#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicationController
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
  
  ReplicationController 的名稱。

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

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

401: Unauthorized

<!--
### `delete` delete a ReplicationController
#### HTTP Request
-->
### `delete` 刪除 ReplicationController

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/replicationcontrollers/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicationController
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
  
  ReplicationController 的名稱。

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
### `deletecollection` delete collection of ReplicationController
#### HTTP Request
-->
### `deletecollection` 刪除 ReplicationController 的集合

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/replicationcontrollers

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

- **sendInitialEvents** (*查詢參數*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
