---
api_metadata:
  apiVersion: "autoscaling/v1"
  import: "k8s.io/api/autoscaling/v1"
  kind: "HorizontalPodAutoscaler"
content_type: "api_reference"
description: "水平 Pod 自动缩放器的配置。"
title: "HorizontalPodAutoscaler"
weight: 11
---

<!--
api_metadata:
  apiVersion: "autoscaling/v1"
  import: "k8s.io/api/autoscaling/v1"
  kind: "HorizontalPodAutoscaler"
content_type: "api_reference"
description: "configuration of a horizontal pod autoscaler."
title: "HorizontalPodAutoscaler"
weight: 11
auto_generated: true
-->

`apiVersion: autoscaling/v1`

`import "k8s.io/api/autoscaling/v1"`

<!--
## HorizontalPodAutoscaler {#HorizontalPodAutoscaler}

configuration of a horizontal pod autoscaler.

<hr>
-->
## HorizontalPodAutoscaler {#HorizontalPodAutoscaler}

水平 Pod 自动缩放器的配置。

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

  标准的对象元数据。
  更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerSpec" >}}">HorizontalPodAutoscalerSpec</a>)

  spec defines the behaviour of autoscaler. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.
-->
- **spec** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerSpec" >}}">HorizontalPodAutoscalerSpec</a>)

  `spec` 定义自动缩放器的规约。
  更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.

<!--
- **status** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerStatus" >}}">HorizontalPodAutoscalerStatus</a>)

  status is the current information about the autoscaler.
-->
- **status** (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerStatus" >}}">HorizontalPodAutoscalerStatus</a>)

  `status` 是自动缩放器的当前信息。

<!--
## HorizontalPodAutoscalerSpec {#HorizontalPodAutoscalerSpec}

specification of a horizontal pod autoscaler.

<hr>
-->
## HorizontalPodAutoscalerSpec {#HorizontalPodAutoscalerSpec}

水平 Pod 自动缩放器的规约。

<hr>

<!--
- **maxReplicas** (int32), required

  maxReplicas is the upper limit for the number of pods that can be set by the autoscaler; cannot be smaller than MinReplicas.
-->
- **maxReplicas** (int32)，必填

  `maxReplicas` 是自动扩缩器可以设置的 Pod 数量上限；
  不能小于 minReplicas。

<!--
- **scaleTargetRef** (CrossVersionObjectReference), required

  reference to scaled resource; horizontal pod autoscaler will learn the current resource consumption and will set the desired number of pods by using its Scale subresource.
-->
- **scaleTargetRef** (CrossVersionObjectReference)，必填

  对被扩缩资源的引用；
  水平 Pod 自动缩放器将了解当前的资源消耗，并使用其 scale 子资源设置所需的 Pod 数量。

  <!--
  <a name="CrossVersionObjectReference"></a>
  *CrossVersionObjectReference contains enough information to let you identify the referred resource.*
  -->
  <a name="CrossVersionObjectReference"></a>
  **CrossVersionObjectReference 包含足够的信息来让你识别出所引用的资源。**

  <!--
  - **scaleTargetRef.kind** (string), required

    kind is the kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->

  - **scaleTargetRef.kind** (string)，必填

    `kind` 是被引用对象的类别；
    更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

  <!--
  - **scaleTargetRef.name** (string), required

    name is the name of the referent; More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
  -->

  - **scaleTargetRef.name** (string)，必填

    `name` 是被引用对象的名称；
    更多信息： https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

  <!--
  - **scaleTargetRef.apiVersion** (string)

    apiVersion is the API version of the referent
  -->

  - **scaleTargetRef.apiVersion** (string)

    `apiVersion` 是被引用对象的 API 版本。

<!--
- **minReplicas** (int32)

  minReplicas is the lower limit for the number of replicas to which the autoscaler can scale down.  It defaults to 1 pod.  minReplicas is allowed to be 0 if the alpha feature gate HPAScaleToZero is enabled and at least one Object or External metric is configured.  Scaling is active as long as at least one metric value is available.
-->
- **minReplicas** (int32)

  minReplicas 是自动缩放器可以缩减的副本数的下限。
  它默认为 1 个 Pod。
  如果启用了 alpha 特性门禁 HPAScaleToZero 并且配置了至少一个 Object 或 External 度量标准，
  则 minReplicas 允许为 0。
  只要至少有一个度量值可用，缩放就处于活动状态。

<!--
- **targetCPUUtilizationPercentage** (int32)

  targetCPUUtilizationPercentage is the target average CPU utilization (represented as a percentage of requested CPU) over all the pods; if not specified the default autoscaling policy will be used.
-->
- **targetCPUUtilizationPercentage** (int32)

  `targetCPUUtilizationPercentage` 是所有 Pod 的目标平均 CPU 利用率（以请求 CPU 的百分比表示）；
  如果未指定，将使用默认的自动缩放策略。

<!--
## HorizontalPodAutoscalerStatus {#HorizontalPodAutoscalerStatus}

current status of a horizontal pod autoscaler

<hr>
-->
## HorizontalPodAutoscalerStatus {#HorizontalPodAutoscalerStatus}

水平 Pod 自动缩放器的当前状态

<hr>

<!--
- **currentReplicas** (int32), required

  currentReplicas is the current number of replicas of pods managed by this autoscaler.
-->
- **currentReplicas** (int32)，必填

  `currentReplicas` 是此自动缩放器管理的 Pod 的当前副本数。

<!--
- **desiredReplicas** (int32), required

  desiredReplicas is the  desired number of replicas of pods managed by this autoscaler.
-->
- **desiredReplicas** (int32)，必填

  `desiredReplicas` 是此自动缩放器管理的 Pod 副本的所需数量。

<!--
- **currentCPUUtilizationPercentage** (int32)

  currentCPUUtilizationPercentage is the current average CPU utilization over all pods, represented as a percentage of requested CPU, e.g. 70 means that an average pod is using now 70% of its requested CPU.
-->
- **currentCPUUtilizationPercentage** (int32)

  `currentCPUUtilizationPercentage` 是当前所有 Pod 的平均 CPU 利用率，
  以请求 CPU 的百分比表示，
  例如：70 表示平均 Pod 现在正在使用其请求 CPU 的 70%。

<!--
- **lastScaleTime** (Time)

  lastScaleTime is the last time the HorizontalPodAutoscaler scaled the number of pods; used by the autoscaler to control how often the number of pods is changed.
-->
- **lastScaleTime** (Time)

  `lastScaleTime` 是上次 HorizontalPodAutoscaler 缩放 Pod 的数量；
  自动缩放器用它来控制 Pod 数量的更改频率。

  <!--
  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->
  <a name="Time"></a>
  **Time 是 time.Time 的包装类，支持正确地序列化为 YAML 和 JSON。
    为 time 包提供的许多工厂方法提供了包装类。**

<!--
- **observedGeneration** (int64)

  observedGeneration is the most recent generation observed by this autoscaler.
-->
- **observedGeneration** (int64)

  `observedGeneration` 是此自动缩放器观察到的最新一代。

<!--
## HorizontalPodAutoscalerList {#HorizontalPodAutoscalerList}

list of horizontal pod autoscaler objects.

<hr>
-->
## HorizontalPodAutoscalerList {#HorizontalPodAutoscalerList}

水平 Pod 自动缩放器对象列表。

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

  标准的列表元数据。

<!--
- **items** ([]<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>), required

  items is the list of horizontal pod autoscaler objects.
-->
- **items** ([]<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>), required

  `items` 是水平 Pod 自动缩放器对象的列表。

<!--
## Operations {#Operations}

<hr>
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified HorizontalPodAutoscaler
-->
### `get` 读取特定的 HorizontalPodAutoscaler

<!--
#### HTTP Request

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}
-->
#### HTTP 请求

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路径参数**）: string，必填

  HorizontalPodAutoscaler 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified HorizontalPodAutoscaler

#### HTTP Request

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status
-->
### `get` 读取特定 HorizontalPodAutoscaler 的状态

#### HTTP 请求

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路径参数**）: string，必填

  HorizontalPodAutoscaler 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind HorizontalPodAutoscaler
-->
### `list` 列出或监视 HorizontalPodAutoscaler 类别的对象

<!--
#### HTTP Request

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers
-->
#### HTTP 参数

GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** （**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** （**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** （**查询参数**）： boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** (*查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** （**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind HorizontalPodAutoscaler

#### HTTP Request

GET /apis/autoscaling/v1/horizontalpodautoscalers
-->
### `list` 列出或监视 HorizontalPodAutoscaler 类别的对象

#### HTTP 请求

GET /apis/autoscaling/v1/horizontalpodautoscalers

<!--
#### Parameters
-->
#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** （**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** (*查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** （**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** （**查询参数**）： boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** （**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** （**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscalerList" >}}">HorizontalPodAutoscalerList</a>): OK

401: Unauthorized

<!--
### `create` create a HorizontalPodAutoscaler

#### HTTP Request

POST /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers
-->
### `create` 创建一个 HorizontalPodAutoscaler

#### HTTP 请求

POST /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>，必填

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->  
- **dryRun** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

202 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified HorizontalPodAutoscaler

#### HTTP Request
-->
### `update` 替换特定的 HorizontalPodAutoscaler

#### HTTP 请求

PUT /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路径参数**）: string，必填

  HorizontalPodAutoscaler 的名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>，必填

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified HorizontalPodAutoscaler

#### HTTP Request

PUT /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status
-->
### `update` 替换特定 HorizontalPodAutoscaler 的状态

#### HTTP 请求

PUT /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路径参数**）: string，必填

  HorizontalPodAutoscaler 的名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>，必填

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified HorizontalPodAutoscaler

#### HTTP Request

PATCH /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}
-->
### `patch` 部分更新特定的 HorizontalPodAutoscaler

#### HTTP 请求

PATCH /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路径参数**）: string，必填

  HorizontalPodAutoscaler 的名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必填

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->  
- **dryRun** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **force** （**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified HorizontalPodAutoscaler

#### HTTP Request

PATCH /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status
-->
### `patch` 部分更新特定 HorizontalPodAutoscaler 的状态

#### HTTP 请求

PATCH /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路径参数**）: string，必填

  HorizontalPodAutoscaler 的名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必填

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->  
- **dryRun** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **force** （**查询参数**）: boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): OK

201 (<a href="{{< ref "../workload-resources/horizontal-pod-autoscaler-v1#HorizontalPodAutoscaler" >}}">HorizontalPodAutoscaler</a>): Created

401: Unauthorized

<!--
### `delete` delete a HorizontalPodAutoscaler

#### HTTP Request

DELETE /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}
-->
### `delete` 删除一个 HorizontalPodAutoscaler

#### HTTP 请求

DELETE /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the HorizontalPodAutoscaler
-->
- **name** （**路径参数**）: string，必填

  HorizontalPodAutoscaler 的名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** （**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of HorizontalPodAutoscaler

#### HTTP Request

DELETE /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers
-->
### `deletecollection` 删除 HorizontalPodAutoscaler 的集合

#### HTTP 请求

DELETE /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）: string，必填

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->  
- **continue** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** （**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** （**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** （**查询参数**）: string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** （**查询参数**）： boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** （**查询参数**）: integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
