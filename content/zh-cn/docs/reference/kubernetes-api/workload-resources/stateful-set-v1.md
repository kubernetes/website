---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "StatefulSet"
content_type: "api_reference"
description: "StatefulSet 表示一组具有一致身份的 pod"
title: "StatefulSet"
weight: 6
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
weight: 6
auto_generated: true
-->



## StatefulSet {#StatefulSet}
<!-- 
StatefulSet represents a set of pods with consistent identities. Identities are defined as:
 - Network: A single stable DNS and hostname.
 - Storage: As many VolumeClaims as requested.
The StatefulSet guarantees that a given network identity will always map to the same storage identity. 
-->

StatefulSet 表示一组具有一致身份的 pod。身份定义为：
 - 网络：一个稳定的 DNS 和主机名。
 - 存储：根据要求提供尽可能多的 VolumeClaims。
StatefulSet 保证给定的网络身份将始终映射到相同的存储身份。
<hr>


- **apiVersion**: apps/v1


- **kind**: StatefulSet


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!-- 
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata 
  -->
  标准对象的元数据。更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetSpec" >}}">StatefulSetSpec</a>)

  <!-- 
  Spec defines the desired identities of pods in this set. 
  -->
  Spec 定义了集合中所需的 pod 身份

- **status** (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetStatus" >}}">StatefulSetStatus</a>)

  <!-- 
  Status is the current status of Pods in this StatefulSet. This data may be out of date by some window of time. 
  -->
  Status 是 StatefulSet 中 Pod 的当前状态， 此数据可能会在某个时间窗口内过时。



## StatefulSetSpec {#StatefulSetSpec}

<!--
A StatefulSetSpec is the specification of a StatefulSet. 
-->
StatefulSetSpec 是 StatefulSet 的规范

<hr>

- **serviceName** (string), required

  <!-- 
  serviceName is the name of the service that governs this StatefulSet. This service must exist before the StatefulSet, and is responsible for the network identity of the set. Pods get DNS/hostnames that follow the pattern: pod-specific-string.serviceName.default.svc.cluster.local where "pod-specific-string" is managed by the StatefulSet controller. 
  -->
  serviceName 是管理 StatefulSet 服务的名称。 该服务必须存在于 StatefulSet 之前，并负责该集合的网络标识。 Pod 获取遵循以下模式DNS/主机名： pod-specific-string.serviceName.default.svc.cluster.local 其中“pod-specific-string”由 StatefulSet 控制器管理。

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), required

  <!-- 
  selector is a label query over pods that should match the replica count. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors
  -->
  选择器是对pod的标签查询，它应该匹配副本计数。 它必须与 pod 模板的标签匹配。 更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), required

  <!-- 
  template is the object that describes the pod that will be created if insufficient replicas are detected. Each pod stamped out by the StatefulSet will fulfill this Template, but have a unique identity from the rest of the StatefulSet. 
  -->
  template 是检测到副本不足时将创建的 pod 的对象。 StatefulSet 标记的每个 pod 都将满足这个模板，但与 StatefulSet 的其余部分相比，它具有唯一的标识

- **replicas** (int32)

  <!-- 
  replicas is the desired number of replicas of the given Template. These are replicas in the sense that they are instantiations of the same Template, but individual replicas also have a consistent identity. If unspecified, defaults to 1. -->
  replicas 是给定模板的所需副本数。 这些是副本，因为它们是相同模板的实例化，但各个副本也具有一致的身份。 如果未指定，则默认为 1

- **updateStrategy** (StatefulSetUpdateStrategy)

  <!-- 
  updateStrategy indicates the StatefulSetUpdateStrategy that will be employed to update Pods in the StatefulSet when a revision is made to Template.
   -->
  updateStrategy 表示当对 Template 进行修订时将用于更新 StatefulSet 中的 Pod 的 StatefulSetUpdateStrategy。

  <a name="StatefulSetUpdateStrategy"></a>
  <!-- 
  *StatefulSetUpdateStrategy indicates the strategy that the StatefulSet controller will use to perform updates. It includes any additional parameters necessary to perform the update for the indicated strategy.*
   -->
  StatefulSetUpdateStrategy 表示 StatefulSet 控制器将用于执行更新的策略。 它包括为指定策略执行更新所需的任何其他参数

  - **updateStrategy.type** (string)

    <!-- 
    Type indicates the type of the StatefulSetUpdateStrategy. Default is RollingUpdate. 
    -->
    
    Type表示StatefulSetUpdateStrategy的类型，默认为滚动更新

  - **updateStrategy.rollingUpdate** (RollingUpdateStatefulSetStrategy)

    <!-- 
    RollingUpdate is used to communicate parameters when Type is RollingUpdateStatefulSetStrategyType. 
    -->
    当 Type 为 RollingUpdateStatefulSetStrategyType 时，RollingUpdate 用于传递参数

    <a name="RollingUpdateStatefulSetStrategy"></a>
    <!--
    *RollingUpdateStatefulSetStrategy is used to communicate parameter for RollingUpdateStatefulSetStrategyType.* 
    -->
    RollingUpdateStatefulSetStrategy 用于传递 RollingUpdateStatefulSetStrategyType 的参数

    - **updateStrategy.rollingUpdate.maxUnavailable** (IntOrString)

      <!-- 
      The maximum number of pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). Absolute number is calculated from percentage by rounding up. This can not be 0. Defaults to 1. This field is alpha-level and is only honored by servers that enable the MaxUnavailableStatefulSet feature. The field applies to all pods in the range 0 to Replicas-1. That means if there is any unavailable pod in the range 0 to Replicas-1, it will be counted towards MaxUnavailable. 
      -->
      更新期间不可用的最大pod数，值可以是绝对数量（例如：5）或所需 pod 的百分比（例如：10%）。 绝对数是通过四舍五入的百分比计算得出的。 不能为 0。默认为 1。此字段为 alpha 级别，仅由启用 MaxUnavailableStatefulSet 功能的服务器支持。 该字段适用于 0 到 Replicas-1 范围内的所有 pod。 这意味着如果在 0 到 Replicas-1 范围内有任何不可用的 pod，它将计入 MaxUnavailable。

      <a name="IntOrString"></a>
      <!-- 
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.* 
      -->
      IntOrString 是一种可以容纳 int32 或字符串的类型。 在 JSON 或 YAML 编组和解组中使用时，它会生成或使用内部类型。 例如，这允许您拥有一个可以接受名称或数字的 JSON 字段

    - **updateStrategy.rollingUpdate.partition** (int32)

      <!-- 
      Partition indicates the ordinal at which the StatefulSet should be partitioned for updates. During a rolling update, all pods from ordinal Replicas-1 to Partition are updated. All pods from ordinal Partition-1 to 0 remain untouched. This is helpful in being able to do a canary based deployment. The default value is 0.
      -->
      Partition 表示 StatefulSet 应该被分区进行更新的序数。 在滚动更新期间，从序数 -1 到 Partition 的所有 pod 都会被更新。 从序数-1 到 0 的所有 pod 保持不变。 这有助于进行基于金丝雀的部署。 默认值为 0

- **podManagementPolicy** (string)

  <!-- 
  podManagementPolicy controls how pods are created during initial scale up, when replacing pods on nodes, or when scaling down. The default policy is `OrderedReady`, where pods are created in increasing order (pod-0, then pod-1, etc) and the controller will wait until each pod is ready before continuing. When scaling down, the pods are removed in the opposite order. The alternative policy is `Parallel` which will create pods in parallel to match the desired scale without waiting, and on scale down will delete all pods at once. 
  -->
  podManagementPolicy 控制在初始扩展期间、替换节点上的 pod 或缩减时如何创建 pod。 默认策略是“OrderedReady”，其中 pod 是按升序创建的（pod-0，然后是 pod-1 等），控制器将等到每个 pod 准备就绪后再继续。 缩小时，pod 会以相反的顺序移除。 替代策略是“并行”，它将并行创建 pod 以匹配所需的规模而无需等待，并且在缩减规模时将立即删除所有 pod。
  
  
- **revisionHistoryLimit** (int32)

  <!-- 
  revisionHistoryLimit is the maximum number of revisions that will be maintained in the StatefulSet's revision history. The revision history consists of all revisions not represented by a currently applied StatefulSetSpec version. The default value is 10. 
  -->
  revisionHistoryLimit 是将在 StatefulSet 的修订历史中维护的最大修订数。 修订历史由当前应用的 StatefulSetSpec 版本未表示的所有修订组成。 默认值为 10

- **volumeClaimTemplates** ([]<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>)

  <!-- 
  volumeClaimTemplates is a list of claims that pods are allowed to reference. The StatefulSet controller is responsible for mapping network identities to claims in a way that maintains the identity of a pod. Every claim in this list must have at least one matching (by name) volumeMount in one container in the template. A claim in this list takes precedence over any volumes in the template, with the same name.
  -->
  volumeClaimTemplates 是允许 pod 引用的声明列表。 StatefulSet 控制器负责以维护 pod 身份的方式将网络身份映射到声明。 此列表中的每个声明必须在模板的一个容器中至少有一个匹配的（按名称）volumeMount。 此列表中的声明优先于模板中具有相同名称的任何卷。

- **minReadySeconds** (int32)

  <!-- 
  Minimum number of seconds for which a newly created pod should be ready without any of its container crashing for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready) This is an alpha field and requires enabling StatefulSetMinReadySeconds feature gate. 
  -->
  新创建的pod没有容器崩溃的情况下，其被视为可用的最短时间。 默认为 0（pod 准备就绪后将被视为可用）这是一个 alpha 字段，需要启用 StatefulSetMinReadySeconds 功能门

- **persistentVolumeClaimRetentionPolicy** (StatefulSetPersistentVolumeClaimRetentionPolicy)

  <!--
  persistentVolumeClaimRetentionPolicy describes the lifecycle of persistent volume claims created from volumeClaimTemplates. By default, all persistent volume claims are created as needed and retained until manually deleted. This policy allows the lifecycle to be altered, for example by deleting persistent volume claims when their stateful set is deleted, or when their pod is scaled down. This requires the StatefulSetAutoDeletePVC feature gate to be enabled, which is alpha.  +optional 
  -->
  persistentVolumeClaimRetentionPolicy 描述了从 volumeClaimTemplates 创建的持久卷声明的生命周期。 默认情况下，所有持久卷声明都根据需要创建并保留，直到手动删除。 此策略允许更改生命周期，例如通过在删除其有状态集或缩小其 pod 时删除持久卷声明。 这需要启用 StatefulSetAutoDeletePVC 功能门，这是 alpha。 +可选

  <a name="StatefulSetPersistentVolumeClaimRetentionPolicy"></a>
  <!-- 
  *StatefulSetPersistentVolumeClaimRetentionPolicy describes the policy used for PVCs created from the StatefulSet VolumeClaimTemplates.* 
  -->
  StatefulSetPersistentVolumeClaimRetentionPolicy 描述了用于从 StatefulSet VolumeClaimTemplate 创建的 PVC 的策略

  - **persistentVolumeClaimRetentionPolicy.whenDeleted** (string)

    <!-- 
    WhenDeleted specifies what happens to PVCs created from StatefulSet VolumeClaimTemplates when the StatefulSet is deleted. The default policy of `Retain` causes PVCs to not be affected by StatefulSet deletion. The `Delete` policy causes those PVCs to be deleted. 
    -->
    WhenDeleted 指定当 StatefulSet 被删除时，从 StatefulSet VolumeClaimTemplates 创建的 PVC 会发生什么。 `Retain` 的默认策略使 PVC 不受 StatefulSet 删除的影响。 `Delete` 策略会导致这些 PVC 被删除。

  - **persistentVolumeClaimRetentionPolicy.whenScaled** (string)

    <!--
    WhenScaled specifies what happens to PVCs created from StatefulSet VolumeClaimTemplates when the StatefulSet is scaled down. The default policy of `Retain` causes PVCs to not be affected by a scaledown. The `Delete` policy causes the associated PVCs for any excess pods above the replica count to be deleted. 
    -->
    WhenScaled 指定当 StatefulSet 缩小时，从 StatefulSet VolumeClaimTemplates 创建的 PVC 会发生什么。 `Retain` 的默认策略使 PVC 不受缩减影响。 `Delete` 策略会导致删除超过副本计数的任何多余 pod 的关联 PVC。



## StatefulSetStatus {#StatefulSetStatus}

<!-- 
StatefulSetStatus represents the current state of a StatefulSet. 
-->
StatefulSetStatus 表示 StatefulSet 的当前状态

<hr>

- **replicas** (int32), required

  <!-- 
  replicas is the number of Pods created by the StatefulSet controller. 
  -->
  replicas 是 StatefulSet 控制器创建的 Pod 数量

- **readyReplicas** (int32)

  <!-- 
  readyReplicas is the number of pods created for this StatefulSet with a Ready Condition. 
  -->
  readyReplicas 是为此 StatefulSet 创建的具有就绪条件的 pod 数量。

- **currentReplicas** (int32)

  <!-- 
  currentReplicas is the number of Pods created by the StatefulSet controller from the StatefulSet version indicated by currentRevision. 
  -->
  currentReplicas 是 StatefulSet 控制器根据 currentRevision 指示的 StatefulSet 版本创建的 Pod 数量。

- **updatedReplicas** (int32)

  <!-- 
  updatedReplicas is the number of Pods created by the StatefulSet controller from the StatefulSet version indicated by updateRevision.
  -->
  updatedReplicas 是 StatefulSet 控制器根据 updateRevision 指示的 StatefulSet 版本创建的 Pod 数量。

- **availableReplicas** (int32)

  <!-- 
  Total number of available pods (ready for at least minReadySeconds) targeted by this statefulset. This is a beta field and enabled/disabled by StatefulSetMinReadySeconds feature gate. 
  -->
  此 statefulset 所针对的可用 pod 总数（至少准备好 minReadySeconds）。 这是一个 beta 字段，由 StatefulSetMinReadySeconds 功能门启用/禁用。

- **collisionCount** (int32)

  <!-- 
  collisionCount is the count of hash collisions for the StatefulSet. The StatefulSet controller uses this field as a collision avoidance mechanism when it needs to create the name for the newest ControllerRevision. 
  -->
  collisionCount 是 StatefulSet 的哈希冲突计数。 StatefulSet 控制器在需要为最新的 ControllerRevision 创建名称时使用此字段作为避免冲突的机制。

- **conditions** ([]StatefulSetCondition)

  <!-- 
  *Patch strategy: merge on key `type`* 
  -->
  补丁策略：在键 `type` 上合并

  <!-- 
  Represents the latest available observations of a statefulset's current state. 
  -->
  表示 statefulset 当前状态的最新可用观察结果。

  <a name="StatefulSetCondition"></a>
  <!-- 
  *StatefulSetCondition describes the state of a statefulset at a certain point.* 
  -->
  StatefulSet Condition 描述了 statefulset 在某个点的状态

  - **conditions.status** (string), required

    <!-- 
    Status of the condition, one of True, False, Unknown. 
    -->
    条件的状态为True、False、Unknown 之一。

  - **conditions.type** (string), required

    <!-- 
    Type of statefulset condition.  
    -->
    statefulset 条件的类型

  - **conditions.lastTransitionTime** (Time)

    <!-- 
    Last time the condition transitioned from one status to another. 
    -->
    上次条件从一种状态过渡到另一种状态。

    <a name="Time"></a>
    <!-- 
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.* 
    -->
    Time 是 time.Time 的包装器，它支持对 YAML 和 JSON 的正确编组。 为 time 包的许多工厂方法提供了包装器

  - **conditions.message** (string)

    <!-- 
    A human readable message indicating details about the transition. 
    -->
    一条人类可读的消息，指示有关转换的详细信息。

  - **conditions.reason** (string)

    <!-- 
    The reason for the condition's last transition. 
    -->
    条件最后一次转换的原因

- **currentRevision** (string)

  <!-- 
  currentRevision, if not empty, indicates the version of the StatefulSet used to generate Pods in the sequence [0,currentReplicas). 
  -->
  currentRevision，如果不为空，则表示用于生成序列 [0,currentReplicas) 中的 Pod 的 StatefulSet 的版本

- **updateRevision** (string)

  <!-- 
  updateRevision, if not empty, indicates the version of the StatefulSet used to generate Pods in the sequence [replicas-updatedReplicas,replicas) 
  -->
  updateRevision，如果不为空，表示StatefulSet的版本，用于生成序列中的Pods [replicas-updatedReplicas,replicas)

- **observedGeneration** (int64)

  <!-- 
  observedGeneration is the most recent generation observed for this StatefulSet. It corresponds to the StatefulSet's generation, which is updated on mutation by the API Server. 
  -->
  observedGeneration 是 StatefulSet 的最新一代。 它对应于 StatefulSet 的生成，由 API 服务器在突变时更新



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
  标准列表的元数据。 更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>), required

  <!-- 
  Items is the list of stateful sets. 
  -->
  Items 是有状态集的列表。


<!-- 
## Operations {#Operations} 
-->
## 操作

<hr>


<!-- 
### `get` read the specified StatefulSet 
#### HTTP Request
-->
### `get` 读取指定的 StatefulSet
#### HTTP 请求

GET /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}

<!-- 
#### Parameters 
-->
#### 参数


- **name** (*in path*): string, required

  <!-- 
  name of the StatefulSet 
  -->
  StatefulSet 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



<!-- 
#### Response
-->
#### 响应


200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

401: Unauthorized


<!-- 
### `get` read status of the specified StatefulSet 
#### HTTP Request 
-->
### get`读取指定StatefulSet的状态
#### HTTP 请求

GET /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}/status

<!-- 
#### Parameters 
-->
#### 参数


- **name** (*in path*): string, required

  <!-- 
  name of the StatefulSet 
  -->
  StatefulSet 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



<!-- 
#### Response 
-->
#### 响应


200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

401: Unauthorized


<!-- 
### `list` list or watch objects of kind StatefulSet 
#### HTTP Request 
-->
### `list`列出或监视 StatefulSet 类型的对象
#### HTTP 请求

GET /apis/apps/v1/namespaces/{namespace}/statefulsets

<!-- 
#### Parameters
-->
#### 参数


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



<!-- 
#### Response
-->
#### 响应


200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetList" >}}">StatefulSetList</a>): OK

401: Unauthorized


<!-- 
### `list` list or watch objects of kind StatefulSet
#### HTTP Request
-->
### `list` 列出或监视 StatefulSet 类型的对象
#### HTTP 请求

GET /apis/apps/v1/statefulsets

<!-- 
#### Parameters
 -->
#### 参数


- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



<!-- 
#### Response 
-->
#### 响应


200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetList" >}}">StatefulSetList</a>): OK

401: Unauthorized


<!-- 
### `create` create a StatefulSet
#### HTTP Request 
-->
### `create` 创建一个 StatefulSet
#### HTTP 请求

POST /apis/apps/v1/namespaces/{namespace}/statefulsets

<!-- 
#### Parameters 
-->
#### 参数


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



<!-- 
#### Response
-->
#### 响应


200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

202 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Accepted

401: Unauthorized


<!-- 
### `update` replace the specified StatefulSet
#### HTTP Request 
-->
### `update` 替换指定的 StatefulSet
#### HTTP 请求

PUT /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}

<!-- 
#### Parameters 
-->
#### 参数

- **name** (*in path*): string, required

  name of the StatefulSet

  StatefulSet 的名称 

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



<!-- 
#### Response 
-->
#### 响应


200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

401: Unauthorized


<!-- 
### `update` replace status of the specified StatefulSet
#### HTTP Request 
-->
### `update` 替换指定 StatefulSet 的状态
#### HTTP 请求

PUT /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}/status

<!-- 
#### Parameters
-->
#### 参数


- **name** (*in path*): string, required

  name of the StatefulSet


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



<!-- 
#### Response 
-->
#### 响应


200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

401: Unauthorized


<!-- 
### `patch` partially update the specified StatefulSet
#### HTTP Request 
-->
### `patch` 部分更新指定的 StatefulSet
#### HTTP 请求

PATCH /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}

<!-- 
#### Parameters
-->
#### 参数


- **name** (*in path*): string, required

  <!-- 
  name of the StatefulSet 
  -->
  StatefulSet 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



<!-- 
#### Response 
-->
#### 响应


200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

401: Unauthorized


<!-- 
### `patch` partially update status of the specified StatefulSet
#### HTTP Request 
-->
### `patch` 部分更新指定 StatefulSet 的状态
#### HTTP 请求

PATCH /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}/status

<!-- 
#### Parameters 
-->
#### 参数


- **name** (*in path*): string, required

  <!-- 
  name of the StatefulSet 
  -->
  StatefulSet 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



<!-- 
#### Response 
-->
#### 响应


200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

201 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): Created

401: Unauthorized


<!-- 
### `delete` delete a StatefulSet
#### HTTP Request 
-->
### `delete` 删除一个 StatefulSet
#### HTTP 请求

DELETE /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}

<!-- 
#### Parameters 
-->
#### 参数


- **name** (*in path*): string, required

  name of the StatefulSet
  StatefulSet 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>



<!-- 
#### Response 
-->
#### 响应


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized


<!-- 
### `deletecollection` delete collection of StatefulSet
#### HTTP Request 
-->
### `deletecollection` 删除 StatefulSet 的集合
#### HTTP 请求

DELETE /apis/apps/v1/namespaces/{namespace}/statefulsets

<!-- 
#### Parameters 
-->
#### 参数


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>



<!-- 
#### Response 
-->
#### 响应


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

