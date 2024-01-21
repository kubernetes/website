---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "DaemonSet"
content_type: "api_reference"
description: "DaemonSet 表示守护进程集的配置。"
title: "DaemonSet"
weight: 8
---

<!--
api_metadata:
apiVersion: "apps/v1"
import: "k8s.io/api/apps/v1"
kind: "DaemonSet"
content_type: "api_reference"
description: "DaemonSet represents the configuration of a daemon set."
title: "DaemonSet"
weight: 8
auto_generated: true
-->

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`

<!--
## DaemonSet {#DaemonSet}

DaemonSet represents the configuration of a daemon set.
-->
## DaemonSet {#DaemonSet}

DaemonSet 表示守护进程集的配置。

<hr>

- **apiVersion**: apps/v1

- **kind**: DaemonSet

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetSpec" >}}">DaemonSetSpec</a>)

  The desired behavior of this daemon set. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **spec** (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetSpec" >}}">DaemonSetSpec</a>)

  此守护进程集的预期行为。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetStatus" >}}">DaemonSetStatus</a>)

  The current status of this daemon set. This data may be out of date by some window of time. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetStatus" >}}">DaemonSetStatus</a>)

  此守护进程集的当前状态。此数据可能已经过时一段时间。由系统填充。
  只读。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
## DaemonSetSpec {#DaemonSetSpec}

DaemonSetSpec is the specification of a daemon set.
-->
## DaemonSetSpec {#DaemonSetSpec}

DaemonSetSpec 是守护进程集的规约。

<hr>

<!--
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), required

  A label query over pods that are managed by the daemon set. Must match in order to be controlled. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors
-->
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), 必需

  对由守护进程集管理的 Pod 的标签查询。Pod 必须匹配此查询才能被此 DaemonSet 控制。
  查询条件必须与 Pod 模板的标签匹配。
  更多信息： https://kubernetes.io/zh-cn/concepts/overview/working-with-objects/labels/#label-selectors

<!--
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), required

  An object that describes the pod that will be created. The DaemonSet will create exactly one copy of this pod on every node that matches the template's node selector (or on every node if no node selector is specified). The only allowed template.spec.restartPolicy value is "Always". More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template
-->
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), 必需

  描述将要创建的 Pod 的对象。DaemonSet 将在与模板的节点选择器匹配的每个节点上
 （如果未指定节点选择器，则在每个节点上）准确创建此 Pod 的副本。`template.spec.restartPolicy`
  唯一被允许配置的值是 "Always"。更多信息：
  https://kubernetes.io/zh-cn/concepts/workloads/controllers/replicationcontroller#pod-template

<!--
- **minReadySeconds** (int32)

  The minimum number of seconds for which a newly created DaemonSet pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready).
-->
- **minReadySeconds** (int32)

  新建的 DaemonSet Pod 应该在没有任何容器崩溃的情况下处于就绪状态的最小秒数，这样它才会被认为是可用的。
  默认为 0（Pod 准备就绪后将被视为可用）。

<!--
- **updateStrategy** (DaemonSetUpdateStrategy)

  An update strategy to replace existing DaemonSet pods with new pods.
-->
- **updateStrategy** (DaemonSetUpdateStrategy)

  用新 Pod 替换现有 DaemonSet Pod 的更新策略。

  <!--
  <a name="DaemonSetUpdateStrategy"></a>
  *DaemonSetUpdateStrategy is a struct used to control the update strategy for a DaemonSet.*
  -->

  <a name="DaemonSetUpdateStrategy"></a>
  **DaemonSetUpdateStrategy 是一个结构体，用于控制 DaemonSet 的更新策略。**

  <!--
  - **updateStrategy.type** (string)

    Type of daemon set update. Can be "RollingUpdate" or "OnDelete". Default is RollingUpdate.
  -->
  
  - **updateStrategy.type** (string)

    守护进程集更新的类型。可以是 "RollingUpdate" 或 "OnDelete"。默认为 RollingUpdate。

  <!--
  - **updateStrategy.rollingUpdate** (RollingUpdateDaemonSet)

    Rolling update config params. Present only if type = "RollingUpdate".
  -->
  
  - **updateStrategy.rollingUpdate** (RollingUpdateDaemonSet)

    滚动更新配置参数。仅在 type 值为 "RollingUpdate" 时出现。
    
    <!--
    <a name="RollingUpdateDaemonSet"></a>
    *Spec to control the desired behavior of daemon set rolling update.*
    -->
  
    **用于控制守护进程集滚动更新的预期行为的规约。**
    
    <!--
    - **updateStrategy.rollingUpdate.maxSurge** (IntOrString)

      The maximum number of nodes with an existing available DaemonSet pod that can have an updated DaemonSet pod during during an update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). This can not be 0 if MaxUnavailable is 0. Absolute number is calculated from percentage by rounding up to a minimum of 1. Default value is 0. Example: when this is set to 30%, at most 30% of the total number of nodes that should be running the daemon pod (i.e. status.desiredNumberScheduled) can have their a new pod created before the old pod is marked as deleted. The update starts by launching new pods on 30% of nodes. Once an updated pod is available (Ready for at least minReadySeconds) the old DaemonSet pod on that node is marked deleted. If the old pod becomes unavailable for any reason (Ready transitions to false, is evicted, or is drained) an updated pod is immediatedly created on that node without considering surge limits. Allowing surge implies the possibility that the resources consumed by the daemonset on any given node can double if the readiness check fails, and so resource intensive daemonsets should take into account that they may cause evictions during disruption.
    -->
    
    - **updateStrategy.rollingUpdate.maxSurge** (IntOrString)

      对于拥有可用 DaemonSet Pod 的节点而言，在更新期间可以拥有更新后的 DaemonSet Pod 的最大节点数。
      属性值可以是绝对数量（例如：5）或所需 Pod 的百分比（例如：10%）。
      如果 maxUnavailable 为 0，则该值不能为 0。绝对数是通过四舍五入从百分比计算得出的，最小值为 1。
      默认值为 0。示例：当设置为 30% 时，最多为节点总数的 30% 节点上应该运行守护进程 Pod
      （即 status.desiredNumberScheduled）
      可以在旧 Pod 标记为已删除之前创建一个新 Pod。更新首先在 30% 的节点上启动新的 Pod。
      一旦更新的 Pod 可用（就绪时长至少 minReadySeconds 秒），该节点上的旧 DaemonSet pod 就会被标记为已删除。
      如果旧 Pod 因任何原因变得不可用（Ready 转换为 false、被驱逐或节点被腾空），
      则会立即在该节点上创建更新的 Pod，而不考虑激增限制。
      允许激增意味着如果就绪检查失败，任何给定节点上的守护进程集消耗的资源可能会翻倍，
      因此资源密集型守护进程集应该考虑到它们可能会在中断期间导致驱逐。
  
      <!--
      <a name="IntOrString"></a>
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
      -->
      
      **IntOrString 是一种可以容纳 int32 或字符串的类型。在 JSON 或 YAML 编组和解组中使用时，它会生成或使用内部类型。
      例如，这允许你拥有一个可以接受名称或数字的 JSON 字段。**

    <!--
    - **updateStrategy.rollingUpdate.maxUnavailable** (IntOrString)

      The maximum number of DaemonSet pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of total number of DaemonSet pods at the start of the update (ex: 10%). Absolute number is calculated from percentage by rounding up. This cannot be 0 if MaxSurge is 0 Default value is 1. Example: when this is set to 30%, at most 30% of the total number of nodes that should be running the daemon pod (i.e. status.desiredNumberScheduled) can have their pods stopped for an update at any given time. The update starts by stopping at most 30% of those DaemonSet pods and then brings up new DaemonSet pods in their place. Once the new pods are available, it then proceeds onto other DaemonSet pods, thus ensuring that at least 70% of original number of DaemonSet pods are available at all times during the update.
    -->
    
    - **updateStrategy.rollingUpdate.maxUnavailable** (IntOrString)

      更新期间不可用的 DaemonSet Pod 的最大数量。值可以是绝对数（例如：5）或更新开始时 DaemonSet Pod 总数的百分比（例如：10%）。
      绝对数是通过四舍五入的百分比计算得出的。如果 maxSurge 为 0，则此值不能为 0 默认值为 1。
      例如：当设置为 30% 时，最多节点总数 30% 的、应该运行守护进程的节点总数（即 status.desiredNumberScheduled）
      可以在任何给定时间停止更新。更新首先停止最多 30% 的 DaemonSet Pod，
      然后在它们的位置启动新的 DaemonSet Pod。
      一旦新的 Pod 可用，它就会继续处理其他 DaemonSet Pod，从而确保在更新期间至少 70% 的原始 DaemonSet Pod 数量始终可用。
      
      <!--
      <a name="IntOrString"></a>
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
      -->
     
      **IntOrString 是一种可以保存 int32 或字符串的类型。在 JSON 或 YAML 编组和解组中使用时，它会生成或使用内部类型。例如，这允许你拥有一个可以接受名称或数字的 JSON 字段。**

<!--
- **revisionHistoryLimit** (int32)

  The number of old history to retain to allow rollback. This is a pointer to distinguish between explicit zero and not specified. Defaults to 10.
-->
- **revisionHistoryLimit** (int32)

  用来允许回滚而保留的旧历史记录的数量。此字段是个指针，用来区分明确的零值和未指定的指针。默认值是 10。

<!--
## DaemonSetStatus {#DaemonSetStatus}

DaemonSetStatus represents the current status of a daemon set.
-->
## DaemonSetStatus {#DaemonSetStatus}

DaemonSetStatus 表示守护进程集的当前状态。

<hr>

<!--
- **numberReady** (int32), required

  numberReady is the number of nodes that should be running the daemon pod and have one or more of the daemon pod running with a Ready Condition.
-->
- **numberReady** (int32)，必需

  numberReady 是应该运行守护进程 Pod 并且有一个或多个 DaemonSet Pod 以就绪条件运行的节点数。

<!--
- **numberAvailable** (int32)

  The number of nodes that should be running the daemon pod and have one or more of the daemon pod running and available (ready for at least spec.minReadySeconds)
-->
- **numberAvailable** (int32)

  应该运行守护进程 Pod 并有一个或多个守护进程 Pod 正在运行和可用（就绪时长超过 spec.minReadySeconds）的节点数量。

<!--
- **numberUnavailable** (int32)

  The number of nodes that should be running the daemon pod and have none of the daemon pod running and available (ready for at least spec.minReadySeconds)
-->
- **numberUnavailable** (int32)

  应该运行守护进程 Pod 并且没有任何守护进程 Pod 正在运行且可用（至少已就绪 spec.minReadySeconds 秒）的节点数。  

<!--
- **numberMisscheduled** (int32), required

  The number of nodes that are running the daemon pod, but are not supposed to run the daemon pod. More info: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/
-->
- **numberMisscheduled** (int32)，必需

  正在运行守护进程 Pod，但不应该运行守护进程 Pod 的节点数量。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/daemonset/

<!--
- **desiredNumberScheduled** (int32), required

  The total number of nodes that should be running the daemon pod (including nodes correctly running the daemon pod). More info: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/
-->
- **desiredNumberScheduled** (int32)，必需

  应该运行守护进程 Pod 的节点总数（包括正确运行守护进程 Pod 的节点）。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/daemonset/

<!--
- **currentNumberScheduled** (int32), required

  The number of nodes that are running at least 1 daemon pod and are supposed to run the daemon pod. More info: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/
-->
- **currentNumberScheduled** (int32)，必需

  运行至少 1 个守护进程 Pod 并且应该运行守护进程 Pod 的节点数。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/daemonset/

<!--
- **updatedNumberScheduled** (int32)

  The total number of nodes that are running updated daemon pod
-->
- **updatedNumberScheduled** (int32)

  正在运行更新后的守护进程 Pod 的节点总数。

<!--
- **collisionCount** (int32)

  Count of hash collisions for the DaemonSet. The DaemonSet controller uses this field as a collision avoidance mechanism when it needs to create the name for the newest ControllerRevision.
-->
- **collisionCount** (int32)

  DaemonSet 的哈希冲突计数。DaemonSet 控制器在需要为最新的 ControllerRevision 创建名称时使用此字段作为避免冲突的机制。

<!--
- **conditions** ([]DaemonSetCondition)

  *Patch strategy: merge on key `type`*
-->
- **conditions** ([]DaemonSetCondition)

  **补丁策略：根据 `type` 键合并**

  <!-- 
  Represents the latest available observations of a DaemonSet's current state.

  <a name="DaemonSetCondition"></a>
  *DaemonSetCondition describes the state of a DaemonSet at a certain point.*
  -->
  表示 DaemonSet 当前状态的最新可用观测信息。

  <a name="DaemonSetCondition"></a>
  **DaemonSet Condition 描述了 DaemonSet 在某一时刻的状态。**

  <!--
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of DaemonSet condition.
  -->
  
  - **conditions.status** (string)，必需

    状况的状态，True、False、Unknown 之一。

  - **conditions.type** (string)，必需

    DaemonSet 状况的类型。

  <!--
  - **conditions.lastTransitionTime** (Time)

    Last time the condition transitioned from one status to another. 
  -->
  
  - **conditions.lastTransitionTime** (Time)

    状况上次从一种状态转换到另一种状态的时间。

    <!--
    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->
    
    **Time 是对 time.Time 的封装，支持正确编码为 YAML 和 JSON。time 包为许多工厂方法提供了封装器。**
  
  <!--
  - **conditions.message** (string)

    A human readable message indicating details about the transition.
  -->
  
  - **conditions.message** (string)
  
    一条人类可读的消息，指示有关转换的详细信息。
  
  <!--
  - **conditions.reason** (string)

    The reason for the condition's last transition.
  -->
  
  - **conditions.reason** (string)

    状况最后一次转换的原因。
  
<!--
- **observedGeneration** (int64)

  The most recent generation observed by the daemon set controller.
-->

- **observedGeneration** (int64)

  守护进程集控制器观察到的最新一代。

<!--
## DaemonSetList {#DaemonSetList}

DaemonSetList is a collection of daemon sets.
-->

## DaemonSetList {#DaemonSetList}

DaemonSetList 是守护进程集的集合。

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

  标准列表元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>), 必需

  DaemonSet 的列表。

## Operations {#Operations}

<hr>

<!--
### `get` read the specified DaemonSet

#### HTTP Request

GET /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### Parameters
-->
### `get` 读取指定的 DaemonSet

#### HTTP 请求

GET /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the DaemonSet
-->
- **name** (**路径参数**): string, 必需

  DaemonSet 的名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

401: 未授权

<!--
### `get` read status of the specified DaemonSet

#### HTTP Request

GET /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### Parameters
-->
### `get` 读取指定的 DaemonSet 的状态

#### HTTP 请求

GET /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the DaemonSet
-->
- **name** (**路径参数**): string, 必需

  DaemonSet 的名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

401: 未授权

<!--
### `list` list or watch objects of kind DaemonSet

#### HTTP Request

GET /apis/apps/v1/namespaces/{namespace}/daemonsets

#### Parameters
-->
### `list` 列表或查看 DaemonSet 类型的对象

#### HTTP 请求

GET /apis/apps/v1/namespaces/{namespace}/daemonsets

#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (**路径参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->

- **allowWatchBookmarks** (**路径参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetList" >}}">DaemonSetList</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetList" >}}">DaemonSetList</a>): OK

401: 未授权

<!--
### `list` list or watch objects of kind DaemonSet

#### HTTP Request

GET /apis/apps/v1/daemonsets

#### Parameters
-->
### `list` 列表或查看 DaemonSet 类型的对象

#### HTTP 请求

GET /apis/apps/v1/daemonsets

#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->

- **allowWatchBookmarks** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetList" >}}">DaemonSetList</a>): OK

401: Unauthorized
-->

#### 响应

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSetList" >}}">DaemonSetList</a>): OK

401: 未授权

<!--
### `create` create a DaemonSet

#### HTTP Request

POST /apis/apps/v1/namespaces/{namespace}/daemonsets

#### Parameters
-->
### `create` 创建一个 DaemonSet

#### HTTP 请求

POST /apis/apps/v1/namespaces/{namespace}/daemonsets

#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>, required
-->
- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>, 必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

202 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Accepted

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): 创建完成

202 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): 已接受

401: 未授权

<!--
### `update` replace the specified DaemonSet

#### HTTP Request

PUT /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### Parameters
-->
### `update` 替换指定的 DaemonSet

#### HTTP 请求

PUT /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the DaemonSet

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>, required
-->
- **name** (**路径参数**): string,必需

  DaemonSet 的名称

- **namespace** (**路径参数**): string,必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>,必需  

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): 已创建

401: 未授权

<!--
### `update` replace status of the specified DaemonSet

#### HTTP Request

PUT /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### Parameters
-->
### `update` 替换指定 DaemonSet 的状态

#### HTTP 请求

PUT /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the DaemonSet

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>, required
-->
- **name** (**路径参数**): string, 必需

  DaemonSet 的名称

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>, 必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): 已创建

401: 未授权

<!--
### `patch` partially update the specified DaemonSet

#### HTTP Request

PATCH /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### Parameters
-->
### `patch` 部分更新指定的 DaemonSet

#### HTTP 请求

PATCH /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the DaemonSet

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->

- **name** (**路径参数**): string, 必需

  DaemonSet 的名称

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必需
  
<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** **查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): 已创建

401: 未授权

<!--
### `patch` partially update status of the specified DaemonSet

#### HTTP Request

PATCH /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### Parameters
-->
### `patch` 部分更新指定 DaemonSet 的状态

#### HTTP 请求

PATCH /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the DaemonSet

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **name** (**路径参数**): string, 必需

  DaemonSet 的名称

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必需 

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): Created

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): OK

201 (<a href="{{< ref "../workload-resources/daemon-set-v1#DaemonSet" >}}">DaemonSet</a>): 已创建

401: 未授权

<!--
### `delete` delete a DaemonSet

#### HTTP Request

DELETE /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### Parameters
-->
### `delete` 删除一个 DaemonSet

#### HTTP 请求

DELETE /apis/apps/v1/namespaces/{namespace}/daemonsets/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the DaemonSet

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **name** (**路径参数**): string,必需

  DaemonSet 的名称

- **namespace** (**路径参数**): string,必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized
-->

#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): 已接受

401: 未授权

<!--
### `deletecollection` delete collection of DaemonSet

#### HTTP Request

DELETE /apis/apps/v1/namespaces/{namespace}/daemonsets

#### Parameters
-->
### `deletecollection` 删除 DaemonSet 的集合

#### HTTP 请求

DELETE /apis/apps/v1/namespaces/{namespace}/daemonsets

#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->

- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: 未授权