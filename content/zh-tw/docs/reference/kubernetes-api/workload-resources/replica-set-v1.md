---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "ReplicaSet"
content_type: "api_reference"
description: "ReplicaSet 確保在任何給定的時刻都在運行指定數量的 Pod 副本。"
title: "ReplicaSet"
weight: 4
---
<!--
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "ReplicaSet"
content_type: "api_reference"
description: "ReplicaSet ensures that a specified number of pod replicas are running at any given time."
title: "ReplicaSet"
weight: 4
auto_generated: true
-->

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`

## ReplicaSet {#ReplicaSet}

<!--
ReplicaSet ensures that a specified number of pod replicas are running at any given time.
-->
ReplicaSet 確保在任何給定的時刻都在運行指定數量的 Pod 副本。

<hr>

- **apiVersion**: apps/v1

- **kind**: ReplicaSet

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  If the Labels of a ReplicaSet are empty, they are defaulted to be the same as the Pod(s) that the ReplicaSet manages. Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetSpec" >}}">ReplicaSetSpec</a>)

  Spec defines the specification of the desired behavior of the ReplicaSet. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  如果 ReplicaSet 的標籤爲空，則這些標籤預設爲與 ReplicaSet 管理的 Pod 相同。
  標準的對象元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetSpec" >}}">ReplicaSetSpec</a>)

  spec 定義 ReplicaSet 預期行爲的規約。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetStatus" >}}">ReplicaSetStatus</a>)

  Status is the most recently observed status of the ReplicaSet. This data may be out of date by some window of time. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetStatus" >}}">ReplicaSetStatus</a>)

  status 是最近觀測到的 ReplicaSet 狀態。此資料可能在某個時間窗之後過期。
  該值由系統填充，只讀。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## ReplicaSetSpec {#ReplicaSetSpec}

<!--
ReplicaSetSpec is the specification of a ReplicaSet.
-->
ReplicaSetSpec 是 ReplicaSet 的規約。

<hr>

<!--
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), required

  Selector is a label query over pods that should match the replica count. Label keys and values that must match in order to be controlled by this replica set. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)

  Template is the object that describes the pod that will be created if insufficient replicas are detected. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/#pod-template
-->
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)，必需

  selector 是針對 Pod 的標籤查詢，應與副本計數匹配。標籤的主鍵和取值必須匹配，
  以便由這個 ReplicaSet 進行控制。它必須與 Pod 模板的標籤匹配。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicaset/#pod-template

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)

  template 是描述 Pod 的一個對象，將在檢測到副本不足時創建此對象。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicationcontroller#pod-template

<!--
- **replicas** (int32)

  Replicas is the number of desired pods. This is a pointer to distinguish between explicit zero and unspecified. Defaults to 1. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicaset

- **minReadySeconds** (int32)

  Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)
-->
- **replicas** (int32)

  replicas 是預期 Pod 的數量。這是一個指針，用於辨別顯式零和未指定的值。預設爲 1。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicaset

- **minReadySeconds** (int32)

  新建的 Pod 在沒有任何容器崩潰的情況下就緒並被系統視爲可用的最短秒數。
  預設爲 0（Pod 就緒後即被視爲可用）。

## ReplicaSetStatus {#ReplicaSetStatus}

<!--
ReplicaSetStatus represents the current status of a ReplicaSet.
-->
ReplicaSetStatus 表示 ReplicaSet 的當前狀態。

<hr>

<!--
- **replicas** (int32), required

  Replicas is the most recently observed number of non-terminating pods. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicaset

- **availableReplicas** (int32)

  The number of available non-terminating pods (ready for at least minReadySeconds) for this replica set.
-->
- **replicas** (int32)，必需

  replicas 是最近觀測到的非終止狀態 Pod 的數量。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicaset

- **availableReplicas** (int32)

  此副本集可用的非終止狀態 Pod（至少 minReadySeconds 才能就緒）的數量。

<!--
- **readyReplicas** (int32)

  The number of non-terminating pods targeted by this ReplicaSet with a Ready Condition.
-->
- **readyReplicas** (int32)

  此 ReplicaSet 所針對是的處於 Ready 狀況的非終止 Pod 的數量。

<!--
- **terminatingReplicas** (int32)

  The number of terminating pods for this replica set. Terminating pods have a non-null .metadata.deletionTimestamp and have not yet reached the Failed or Succeeded .status.phase.
  
  This is an alpha field. Enable DeploymentReplicaSetTerminatingReplicas to be able to use this field.
-->
- **terminatingReplicas** (int32)

  此副本集正在終止的 Pod 的數量。正在終止的 Pod 是具有非空
  .metadata.deletionTimestamp 的 Pod，並且尚未達到 Failed 或
  Succeeded 的 .status.phase 狀態。

  這是一個 Alpha 階段的字段。需要啓用 DeploymentReplicaSetTerminatingReplicas
  特性門控才能使用此字段。

<!--
- **fullyLabeledReplicas** (int32)

  The number of non-terminating pods that have labels matching the labels of the pod template of the replicaset.
-->
- **fullyLabeledReplicas** (int32)

  標籤與 ReplicaSet 的 Pod 模板標籤匹配的非終止狀態 Pod 的數量。

<!--
- **conditions** ([]ReplicaSetCondition)

  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*
  
  Represents the latest available observations of a replica set's current state.

  <a name="ReplicaSetCondition"></a>
  *ReplicaSetCondition describes the state of a replica set at a certain point.*
-->
- **conditions** ([]ReplicaSetCondition)

  **補丁策略：按照鍵 `type` 合併**

  **Map：鍵類型的唯一值將在合併期間保留**
  
  表示副本集當前狀態的最新可用觀測值。
  
  <a name="ReplicaSetCondition"></a> 
  **ReplicaSetCondition 描述某個點的副本集狀態。**
  
  <!--
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of replica set condition.
  -->

  - **conditions.status** (string)，必需
    
    狀況的狀態，取值爲 True、False 或 Unknown 之一。
  
  - **conditions.type** (string)，必需
    
    副本集狀況的類型。
  
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

  ObservedGeneration reflects the generation of the most recently observed ReplicaSet.
-->
- **observedGeneration** (int64)

  observedGeneration 反映了最近觀測到的 ReplicaSet 生成情況。

## ReplicaSetList {#ReplicaSetList}

<!--
ReplicaSetList is a collection of ReplicaSets.
-->
ReplicaSetList 是多個 ReplicaSet 的集合。

<hr>

- **apiVersion**: apps/v1

- **kind**: ReplicaSetList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>), required

  List of ReplicaSets. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicaset
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  
  標準的列表元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>)，必需

  ReplicaSet 的列表。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicaset

<!--
## Operations {#Operations}

<hr>

### `get` read the specified ReplicaSet

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 ReplicaSet

#### HTTP 請求

GET /apis/apps/v1/namespaces/{namespace}/replicasets/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicaSet
- **namespace** (*in path*): string, required
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ReplicaSet 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified ReplicaSet

#### HTTP Request
-->
### `get` 讀取指定的 ReplicaSet 的狀態

#### HTTP 請求

GET /apis/apps/v1/namespaces/{namespace}/replicasets/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicaSet
- **namespace** (*in path*): string, required
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ReplicaSet 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ReplicaSet

#### HTTP Request
-->
### `list` 列出或監視 ReplicaSet 類別的對象

#### HTTP 請求

GET /apis/apps/v1/namespaces/{namespace}/replicasets

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

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetList" >}}">ReplicaSetList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ReplicaSet

#### HTTP Request
-->
### `list` 列出或監視 ReplicaSet 類別的對象

#### HTTP 請求

GET /apis/apps/v1/replicasets

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

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSetList" >}}">ReplicaSetList</a>): OK

401: Unauthorized

<!--
### `create` create a ReplicaSet

#### HTTP Request
-->
### `create` 創建 ReplicaSet

#### HTTP 請求

POST /apis/apps/v1/namespaces/{namespace}/replicasets

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>，必需

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

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

202 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ReplicaSet

#### HTTP Request
-->
### `update` 替換指定的 ReplicaSet

#### HTTP 請求

PUT /apis/apps/v1/namespaces/{namespace}/replicasets/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicaSet
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ReplicaSet 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>，必需

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

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified ReplicaSet

#### HTTP Request
-->
### `update` 替換指定的 ReplicaSet 的狀態

#### HTTP 請求

PUT /apis/apps/v1/namespaces/{namespace}/replicasets/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicaSet
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  ReplicaSet 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>，必需

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

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ReplicaSet

#### HTTP Request
-->
### `patch` 部分更新指定的 ReplicaSet

#### HTTP 請求

PATCH /apis/apps/v1/namespaces/{namespace}/replicasets/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicaSet
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

  ReplicaSet 的名稱

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

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified ReplicaSet

#### HTTP Request
-->
### `patch` 部分更新指定的 ReplicaSet 的狀態

#### HTTP 請求

PATCH /apis/apps/v1/namespaces/{namespace}/replicasets/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicaSet
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

  ReplicaSet 的名稱

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

200 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): OK

201 (<a href="{{< ref "../workload-resources/replica-set-v1#ReplicaSet" >}}">ReplicaSet</a>): Created

401: Unauthorized

<!--
### `delete` delete a ReplicaSet

#### HTTP Request
-->
### `delete` 刪除 ReplicaSet

#### HTTP 請求

DELETE /apis/apps/v1/namespaces/{namespace}/replicasets/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicaSet
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

  ReplicaSet 的名稱

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
### `deletecollection` delete collection of ReplicaSet

#### HTTP Request
-->
### `deletecollection` 刪除 ReplicaSet 的集合

#### HTTP 請求

DELETE /apis/apps/v1/namespaces/{namespace}/replicasets

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
