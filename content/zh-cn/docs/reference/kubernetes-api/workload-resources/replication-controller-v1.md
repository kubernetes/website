---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ReplicationController"
content_type: "api_reference"
description: "ReplicationController 表示一个副本控制器的配置。"
title: "ReplicationController"
weight: 3
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "ReplicationController"
content_type: "api_reference"
description: "ReplicationController represents the configuration of a replication controller."
title: "ReplicationController"
weight: 3
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## ReplicationController {#ReplicationController}

<!--
ReplicationController represents the configuration of a replication controller.
-->
ReplicationController 表示一个副本控制器的配置。

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
  
  如果 ReplicationController 的标签为空，则这些标签默认为与副本控制器管理的 Pod 相同。
  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerSpec" >}}">ReplicationControllerSpec</a>)
  
  spec 定义副本控制器预期行为的规约。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerStatus" >}}">ReplicationControllerStatus</a>)

  Status is the most recently observed status of the replication controller. This data may be out of date by some window of time. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerStatus" >}}">ReplicationControllerStatus</a>)
  
  status 是最近观测到的副本控制器的状态。此数据可能在某个时间窗之后过期。
  该值由系统填充，只读。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## ReplicationControllerSpec {#ReplicationControllerSpec}

<!--
ReplicationControllerSpec is the specification of a replication controller.
-->
ReplicationControllerSpec 表示一个副本控制器的规约。

<hr>

<!--
- **selector** (map[string]string)

  Selector is a label query over pods that should match the Replicas count. If Selector is empty, it is defaulted to the labels present on the Pod template. Label keys and values that must match in order to be controlled by this replication controller, if empty defaulted to labels on Pod template. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)

  Template is the object that describes the pod that will be created if insufficient replicas are detected. This takes precedence over a TemplateRef. The only allowed template.spec.restartPolicy value is "Always". More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template
-->
- **selector** (map[string]string)
  
  selector 是针对 Pod 的标签查询，符合条件的 Pod 个数应与 replicas 匹配。
  如果 selector 为空，则默认为出现在 Pod 模板中的标签。
  如果置空以表示默认使用 Pod 模板中的标签，则标签的主键和取值必须匹配，以便由这个副本控制器进行控制。
  `template.spec.restartPolicy` 唯一被允许的值是 `Always`。
  更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>)
  
  template 是描述 Pod 的一个对象，将在检测到副本不足时创建此对象。
  此字段优先于 templateRef。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicationcontroller#pod-template

<!--
- **replicas** (int32)

  Replicas is the number of desired replicas. This is a pointer to distinguish between explicit zero and unspecified. Defaults to 1. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller

- **minReadySeconds** (int32)

  Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)
-->
- **replicas** (int32)
  
  replicas 是预期副本的数量。这是一个指针，用于辨别显式零和未指定的值。默认为 1。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller

- **minReadySeconds** (int32)
  
  新建的 Pod 在没有任何容器崩溃的情况下就绪并被系统视为可用的最短秒数。
  默认为 0（Pod 就绪后即被视为可用）。

## ReplicationControllerStatus {#ReplicationControllerStatus}

<!--
ReplicationControllerStatus represents the current status of a replication controller.
-->
ReplicationControllerStatus 表示一个副本控制器的当前状态。

<hr>

<!--
- **replicas** (int32), required

  Replicas is the most recently observed number of replicas. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller

- **availableReplicas** (int32)

  The number of available replicas (ready for at least minReadySeconds) for this replication controller.
-->
- **replicas** (int32)，必需
  
  replicas 是最近观测到的副本数量。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller

- **availableReplicas** (int32)
  
  这个副本控制器可用副本（至少 minReadySeconds 才能就绪）的数量。

<!--
- **readyReplicas** (int32)

  The number of ready replicas for this replication controller.

- **fullyLabeledReplicas** (int32)

  The number of pods that have labels matching the labels of the pod template of the replication controller.
-->
- **readyReplicas** (int32)
  
  此副本控制器所用的就绪副本的数量。

- **fullyLabeledReplicas** (int32)
  
  标签与副本控制器的 Pod 模板标签匹配的 Pod 数量。

<!--
- **conditions** ([]ReplicationControllerCondition)

  *Patch strategy: merge on key `type`*
  
  Represents the latest available observations of a replication controller's current state.

  <a name="ReplicationControllerCondition"></a>
  *ReplicationControllerCondition describes the state of a replication controller at a certain point.*
-->
- **conditions** ([]ReplicationControllerCondition)
  
  **补丁策略：按照键 `type` 合并**
  
  表示副本控制器当前状态的最新可用观测值。
  
  <a name="ReplicationControllerCondition"></a>
  **ReplicationControllerCondition 描述某个点的副本控制器的状态。**
  
  <!--
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of replication controller condition.
  -->

  - **conditions.status** (string)，必需
    
    状况的状态，取值为 True、False 或 Unknown 之一。
  
  - **conditions.type** (string)，必需
    
    副本控制器状况的类型。
  
  <!--
  - **conditions.lastTransitionTime** (Time)

    The last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)
    
    状况上次从一个状态转换为另一个状态的时间。
    
    <a name="Time"></a>
    **Time 是对 time.Time 的封装。Time 支持对 YAML 和 JSON 进行正确封包。
    为 time 包的许多函数方法提供了封装器。**
  
  <!--
  - **conditions.message** (string)

    A human readable message indicating details about the transition.

  - **conditions.reason** (string)

    The reason for the condition's last transition.
  -->
  - **conditions.message** (string)
    
    这是一条人类可读的消息，指示有关上次转换的详细信息。
  
  - **conditions.reason** (string)
    
    状况上次转换的原因。

<!--
- **observedGeneration** (int64)

  ObservedGeneration reflects the generation of the most recently observed replication controller.

## ReplicationControllerList {#ReplicationControllerList}

ReplicationControllerList is a collection of replication controllers.
-->
- **observedGeneration** (int64)
  
  observedGeneration 反映了最近观测到的副本控制器的生成情况。

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
  
  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>)，必需
  
  副本控制器的列表。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicationcontroller

<!--
## Operations {#Operations}
<hr>
### `get` read the specified ReplicationController
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 ReplicationController

#### HTTP 请求

GET /api/v1/namespaces/{namespace}/replicationcontrollers/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicationController
- **namespace** (*in path*): string, required
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需
  
  ReplicationController 的名称

- **namespace** (**路径参数**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified ReplicationController
#### HTTP Request
-->
### `get` 读取指定的 ReplicationController 的状态

#### HTTP 请求

GET /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicationController
- **namespace** (*in path*): string, required
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需
  
  ReplicationController 的名称

- **namespace** (**路径参数**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ReplicationController
#### HTTP Request
-->
### `list` 列出或监视 ReplicationController 类别的对象

#### HTTP 请求

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
#### 参数

- **namespace** (**路径参数**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (**查询参数**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*查询参数*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerList" >}}">ReplicationControllerList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ReplicationController
#### HTTP Request
-->
### `list` 列出或监视 ReplicationController 类别的对象

#### HTTP 请求

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
#### 参数

- **allowWatchBookmarks** (**查询参数**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*查询参数*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationControllerList" >}}">ReplicationControllerList</a>): OK

401: Unauthorized

<!--
### `create` create a ReplicationController
#### HTTP Request
-->
### `create` 创建 ReplicationController

#### HTTP 请求

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
#### 参数

- **namespace** (**路径参数**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>，必需

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

202 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ReplicationController
#### HTTP Request
-->
### `update` 替换指定的 ReplicationController

#### HTTP 请求

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
#### 参数

- **name** (**路径参数**): string，必需
  
  ReplicationController 的名称

- **namespace** (**路径参数**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>，必需

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified ReplicationController
#### HTTP Request
-->
### `update` 替换指定的 ReplicationController 的状态

#### HTTP 请求

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
#### 参数

- **name** (**路径参数**): string，必需
  
  ReplicationController 的名称

- **namespace** (**路径参数**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>，必需

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ReplicationController
#### HTTP Request
-->
### `patch` 部分更新指定的 ReplicationController

#### HTTP 请求

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
#### 参数

- **name** (**路径参数**): string，必需
  
  ReplicationController 的名称

- **namespace** (**路径参数**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified ReplicationController
#### HTTP Request
-->
### `patch` 部分更新指定的 ReplicationController 的状态

#### HTTP 请求

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
#### 参数

- **name** (**路径参数**): string，必需
  
  ReplicationController 的名称

- **namespace** (**路径参数**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): OK

201 (<a href="{{< ref "../workload-resources/replication-controller-v1#ReplicationController" >}}">ReplicationController</a>): Created

401: Unauthorized

<!--
### `delete` delete a ReplicationController
#### HTTP Request
-->
### `delete` 删除 ReplicationController

#### HTTP 请求

DELETE /api/v1/namespaces/{namespace}/replicationcontrollers/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the ReplicationController
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需
  
  ReplicationController 的名称

- **namespace** (**路径参数**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ReplicationController
#### HTTP Request
-->
### `deletecollection` 删除 ReplicationController 的集合

#### HTTP 请求

DELETE /api/v1/namespaces/{namespace}/replicationcontrollers

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
-->
#### 参数

- **namespace** (**路径参数**): string，必需
  
  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*查询参数*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
