---
api_metadata:
  apiVersion: "autoscaling/v1"
  import: "k8s.io/api/autoscaling/v1"
  kind: "HorizontalPodAutoscaler"
content_type: "api_reference"
description: "水平 Pod 自動縮放器的設定。"
title: "HorizontalPodAutoscaler"
weight: 12
---

<!--
api_metadata:
  apiVersion: "autoscaling/v1"
  import: "k8s.io/api/autoscaling/v1"
  kind: "HorizontalPodAutoscaler"
content_type: "api_reference"
description: "configuration of a horizontal pod autoscaler."
title: "HorizontalPodAutoscaler"
weight: 12
auto_generated: true
-->

`apiVersion: autoscaling/v1`

`import "k8s.io/api/autoscaling/v1"`

<!--
## HorizontalPodAutoscaler {#HorizontalPodAutoscaler}

configuration of a horizontal pod autoscaler.
-->
## HorizontalPodAutoscaler {#HorizontalPodAutoscaler}

水平 Pod 自動縮放器的設定。

<hr>

<!--
- **apiVersion**: autoscaling/v1

- **kind**: HorizontalPodAutoscaler
-->
- **apiVersion**: autoscaling/v1

- **kind**: HorizontalPodAutoscaler

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元資料。
  更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerSpec" >}}">HorizontalPodAutoscalerSpec</a>)

  spec defines the behaviour of autoscaler. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.
-->
- **spec** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerSpec" >}}">HorizontalPodAutoscalerSpec</a>)

  `spec` 定義自動縮放器的規約。
  更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.

<!--
- **status** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerStatus" >}}">HorizontalPodAutoscalerStatus</a>)

  status is the current information about the autoscaler.
-->
- **status** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerStatus" >}}">HorizontalPodAutoscalerStatus</a>)

  `status` 是自動縮放器的當前資訊。

<!--
## HorizontalPodAutoscalerSpec {#HorizontalPodAutoscalerSpec}

specification of a horizontal pod autoscaler.
-->
## HorizontalPodAutoscalerSpec {#HorizontalPodAutoscalerSpec}

水平 Pod 自動縮放器的規約。

<hr>

<!--
- **maxReplicas** (int32), required

  maxReplicas is the upper limit for the number of pods that can be set by the autoscaler; cannot be smaller than MinReplicas.
-->
- **maxReplicas** (int32)，必填

  `maxReplicas` 是自動擴縮器可以設置的 Pod 數量上限；
  不能小於 minReplicas。

<!--
- **scaleTargetRef** (CrossVersionObjectReference), required

  reference to scaled resource; horizontal pod autoscaler will learn the current resource consumption and will set the desired number of pods by using its Scale subresource.
-->
- **scaleTargetRef** (CrossVersionObjectReference)，必填

  對被擴縮資源的引用；
  水平 Pod 自動縮放器將瞭解當前的資源消耗，並使用其 scale 子資源設置所需的 Pod 數量。

  <!--
  <a name="CrossVersionObjectReference"></a>
  *CrossVersionObjectReference contains enough information to let you identify the referred resource.*
  -->
  <a name="CrossVersionObjectReference"></a>
  **CrossVersionObjectReference 包含足夠的資訊來讓你識別出所引用的資源。**

  <!--
  - **scaleTargetRef.kind** (string), required

    kind is the kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->

  - **scaleTargetRef.kind** (string)，必填

    `kind` 是被引用對象的類別；
    更多資訊： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

  <!--
  - **scaleTargetRef.name** (string), required

    name is the name of the referent; More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
  -->

  - **scaleTargetRef.name** (string)，必填

    `name` 是被引用對象的名稱；
    更多資訊： https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

  <!--
  - **scaleTargetRef.apiVersion** (string)

    apiVersion is the API version of the referent
  -->

  - **scaleTargetRef.apiVersion** (string)

    `apiVersion` 是被引用對象的 API 版本。

<!--
- **minReplicas** (int32)

  minReplicas is the lower limit for the number of replicas to which the autoscaler can scale down.  It defaults to 1 pod.  minReplicas is allowed to be 0 if the alpha feature gate HPAScaleToZero is enabled and at least one Object or External metric is configured.  Scaling is active as long as at least one metric value is available.
-->
- **minReplicas** (int32)

  minReplicas 是自動縮放器可以縮減的副本數的下限。
  它預設爲 1 個 Pod。
  如果啓用了 alpha 特性門禁 HPAScaleToZero 並且設定了至少一個 Object 或 External 度量標準，
  則 minReplicas 允許爲 0。
  只要至少有一個度量值可用，縮放就處於活動狀態。

<!--
- **targetCPUUtilizationPercentage** (int32)

  targetCPUUtilizationPercentage is the target average CPU utilization (represented as a percentage of requested CPU) over all the pods; if not specified the default autoscaling policy will be used.
-->
- **targetCPUUtilizationPercentage** (int32)

  `targetCPUUtilizationPercentage` 是所有 Pod 的目標平均 CPU 利用率（以請求 CPU 的百分比表示）；
  如果未指定，將使用預設的自動縮放策略。

<!--
## HorizontalPodAutoscalerStatus {#HorizontalPodAutoscalerStatus}

current status of a horizontal pod autoscaler
-->
## HorizontalPodAutoscalerStatus {#HorizontalPodAutoscalerStatus}

水平 Pod 自動縮放器的當前狀態

<hr>

<!--
- **currentReplicas** (int32), required

  currentReplicas is the current number of replicas of pods managed by this autoscaler.
-->
- **currentReplicas** (int32)，必填

  `currentReplicas` 是此自動縮放器管理的 Pod 的當前副本數。

<!--
- **desiredReplicas** (int32), required

  desiredReplicas is the  desired number of replicas of pods managed by this autoscaler.
-->
- **desiredReplicas** (int32)，必填

  `desiredReplicas` 是此自動縮放器管理的 Pod 副本的所需數量。

<!--
- **currentCPUUtilizationPercentage** (int32)

  currentCPUUtilizationPercentage is the current average CPU utilization over all pods, represented as a percentage of requested CPU, e.g. 70 means that an average pod is using now 70% of its requested CPU.
-->
- **currentCPUUtilizationPercentage** (int32)

  `currentCPUUtilizationPercentage` 是當前所有 Pod 的平均 CPU 利用率，
  以請求 CPU 的百分比表示，
  例如：70 表示平均 Pod 現在正在使用其請求 CPU 的 70%。

<!--
- **lastScaleTime** (Time)

  lastScaleTime is the last time the HorizontalPodAutoscaler scaled the number of pods; used by the autoscaler to control how often the number of pods is changed.
-->
- **lastScaleTime** (Time)

  `lastScaleTime` 是上次 HorizontalPodAutoscaler 縮放 Pod 的數量；
  自動縮放器用它來控制 Pod 數量的更改頻率。

  <!--
  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->
  <a name="Time"></a>
  **Time 是 time.Time 的包裝類，支持正確地序列化爲 YAML 和 JSON。
    爲 time 包提供的許多工廠方法提供了包裝類。**

<!--
- **observedGeneration** (int64)

  observedGeneration is the most recent generation observed by this autoscaler.
-->
- **observedGeneration** (int64)

  `observedGeneration` 是此自動縮放器觀察到的最新一代。

<!--
## HorizontalPodAutoscalerList {#HorizontalPodAutoscalerList}

list of horizontal pod autoscaler objects.
-->
## HorizontalPodAutoscalerList {#HorizontalPodAutoscalerList}

水平 Pod 自動縮放器對象列表。

<hr>

<!--
- **apiVersion**: autoscaling/v1

- **kind**: HorizontalPodAutoscalerList
-->
- **apiVersion**: autoscaling/v1

- **kind**: HorizontalPodAutoscalerList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元資料。

<!--
- **items** ([]<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>), required

  items is the list of horizontal pod autoscaler objects.
-->
- **items** ([]<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>), required

  `items` 是水平 Pod 自動縮放器對象的列表。

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified HorizontalPodAutoscaler
-->
### `get` 讀取特定的 HorizontalPodAutoscaler

<!--
#### HTTP Request

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}
-->
#### HTTP 請求

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路徑參數**）: string，必填

  HorizontalPodAutoscaler 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified HorizontalPodAutoscaler

#### HTTP Request

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status
-->
### `get` 讀取特定 HorizontalPodAutoscaler 的狀態

#### HTTP 請求

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路徑參數**）: string，必填

  HorizontalPodAutoscaler 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind HorizontalPodAutoscaler
-->
### `list` 列出或監視 HorizontalPodAutoscaler 類別的對象

<!--
#### HTTP Request

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers
-->
#### HTTP 參數

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** （**查詢參數**）： boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** (*查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind HorizontalPodAutoscaler

#### HTTP Request

GET /apis/autoscaling/v1/horizontalpodautoscalers
-->
### `list` 列出或監視 HorizontalPodAutoscaler 類別的對象

#### HTTP 請求

GET /apis/autoscaling/v1/horizontalpodautoscalers

<!--
#### Parameters
-->
#### 參數

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** (*查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** （**查詢參數**）： boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a>): OK

401: Unauthorized

<!--
### `create` create a HorizontalPodAutoscaler

#### HTTP Request

POST /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers
-->
### `create` 創建一個 HorizontalPodAutoscaler

#### HTTP 請求

POST /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>，必填

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->  
- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

202 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `update` 替換特定的 HorizontalPodAutoscaler

#### HTTP 請求

PUT /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路徑參數**）: string，必填

  HorizontalPodAutoscaler 的名稱

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>，必填

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified HorizontalPodAutoscaler

#### HTTP Request

PUT /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status
-->
### `update` 替換特定 HorizontalPodAutoscaler 的狀態

#### HTTP 請求

PUT /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路徑參數**）: string，必填

  HorizontalPodAutoscaler 的名稱

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>，必填

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified HorizontalPodAutoscaler

#### HTTP Request

PATCH /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}
-->
### `patch` 部分更新特定的 HorizontalPodAutoscaler

#### HTTP 請求

PATCH /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路徑參數**）: string，必填

  HorizontalPodAutoscaler 的名稱

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必填

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->  
- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **force** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified HorizontalPodAutoscaler

#### HTTP Request

PATCH /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status
-->
### `patch` 部分更新特定 HorizontalPodAutoscaler 的狀態

#### HTTP 請求

PATCH /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路徑參數**）: string，必填

  HorizontalPodAutoscaler 的名稱

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必填

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->  
- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **force** （**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `delete` delete a HorizontalPodAutoscaler

#### HTTP Request

DELETE /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}
-->
### `delete` 刪除一個 HorizontalPodAutoscaler

#### HTTP 請求

DELETE /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路徑參數**）: string，必填

  HorizontalPodAutoscaler 的名稱

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of HorizontalPodAutoscaler

#### HTTP Request

DELETE /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers
-->
### `deletecollection` 刪除 HorizontalPodAutoscaler 的集合

#### HTTP 請求

DELETE /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路徑參數**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->  
- **continue** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** （**查詢參數**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** （**查詢參數**）： boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** （**查詢參數**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
