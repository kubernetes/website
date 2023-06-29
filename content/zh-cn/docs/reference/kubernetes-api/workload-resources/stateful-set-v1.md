---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "StatefulSet"
content_type: "api_reference"
description: "StatefulSet 表示一组具有一致身份的 Pod"
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

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`

## StatefulSet {#StatefulSet}
<!-- 
StatefulSet represents a set of pods with consistent identities. Identities are defined as:
 - Network: A single stable DNS and hostname.
 - Storage: As many VolumeClaims as requested.
  
The StatefulSet guarantees that a given network identity will always map to the same storage identity. 
-->
StatefulSet 表示一组具有一致身份的 Pod。身份定义为：
 - 网络：一个稳定的 DNS 和主机名。
 - 存储：根据要求提供尽可能多的 VolumeClaim。

StatefulSet 保证给定的网络身份将始终映射到相同的存储身份。
<hr>

- **apiVersion**: apps/v1

- **kind**: StatefulSet

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!-- 
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata 
  -->
  标准的对象元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata。

- **spec** (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetSpec" >}}">StatefulSetSpec</a>)

  <!-- 
  Spec defines the desired identities of pods in this set. 
  -->
  spec 定义集合中 Pod 的预期身份。

- **status** (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSetStatus" >}}">StatefulSetStatus</a>)

  <!-- 
  Status is the current status of Pods in this StatefulSet. This data may be out of date by some window of time. 
  -->
  status 是 StatefulSet 中 Pod 的当前状态，此数据可能会在某个时间窗口内过时。

## StatefulSetSpec {#StatefulSetSpec}

<!--
A StatefulSetSpec is the specification of a StatefulSet. 
-->
StatefulSetSpec 是 StatefulSet 的规约。

<hr>

<!-- 
- **serviceName** (string), required

  serviceName is the name of the service that governs this StatefulSet. This service must exist before the StatefulSet, and is responsible for the network identity of the set. Pods get DNS/hostnames that follow the pattern: pod-specific-string.serviceName.default.svc.cluster.local where "pod-specific-string" is managed by the StatefulSet controller.  
-->
- **serviceName** (string), 必需

  serviceName 是管理此 StatefulSet 服务的名称。
  该服务必须在 StatefulSet 之前即已存在，并负责该集合的网络标识。
  Pod 会获得符合以下模式的 DNS/主机名： pod-specific-string.serviceName.default.svc.cluster.local。
  其中 “pod-specific-string” 由 StatefulSet 控制器管理。

<!-- 
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), required

  selector is a label query over pods that should match the replica count. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors
-->
- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), 必需

  selector 是对 Pod 的标签查询，查询结果应该匹配副本个数。
  此选择算符必须与 Pod 模板中的 label 匹配。
  更多信息： https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors

<!-- 
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), required

  template is the object that describes the pod that will be created if insufficient replicas are detected. Each pod stamped out by the StatefulSet will fulfill this Template, but have a unique identity from the rest of the StatefulSet. Each pod will be named with the format \<statefulsetname>-\<podindex>. For example, a pod in a StatefulSet named "web" with index number "3" would be named "web-3". The only allowed template.spec.restartPolicy value is "Always".
-->
- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), 必需

  template 是用来描述 Pod 的对象，检测到副本不足时将创建所描述的 Pod。
  经由 StatefulSet 创建的每个 Pod 都将满足这个模板，但与 StatefulSet 的其余 Pod 相比，每个 Pod 具有唯一的标识。
  每个 Pod 将以 \<statefulsetname>-\<podindex> 格式命名。
  例如，名为 "web" 且索引号为 "3" 的 StatefulSet 中的 Pod 将被命名为 "web-3"。
  `template.spec.restartPolicy` 唯一被允许的值是 `Always`。

<!-- 
- **replicas** (int32)

  replicas is the desired number of replicas of the given Template. These are replicas in the sense that they are instantiations of the same Template, but individual replicas also have a consistent identity. 
  If unspecified, defaults to 1.  
-->
- **replicas** (int32)
 
  replicas 是给定模板的所需的副本数。之所以称作副本，是因为它们是相同模板的实例，
  不过各个副本也具有一致的身份。如果未指定，则默认为 1。

<!-- 
- **updateStrategy** (StatefulSetUpdateStrategy)

  updateStrategy indicates the StatefulSetUpdateStrategy that will be employed to update Pods in the StatefulSet when a revision is made to Template. 
-->
- **updateStrategy** (StatefulSetUpdateStrategy)

  updateStrategy 是一个 StatefulSetUpdateStrategy，表示当对 template 进行修订时，用何种策略更新 StatefulSet 中的 Pod 集合。

  <a name="StatefulSetUpdateStrategy"></a>

  <!-- 
  *StatefulSetUpdateStrategy indicates the strategy that the StatefulSet controller will use to perform updates. It includes any additional parameters necessary to perform the update for the indicated strategy.*
  -->

  **StatefulSetUpdateStrategy 表示 StatefulSet 控制器将用于执行更新的策略。其中包括为指定策略执行更新所需的额外参数。**

  - **updateStrategy.type** (string)

  <!--
  Type indicates the type of the StatefulSetUpdateStrategy. Default is RollingUpdate.
  -->
  type 表示 StatefulSetUpdateStrategy 的类型，默认为 RollingUpdate。

  - **updateStrategy.rollingUpdate** (RollingUpdateStatefulSetStrategy)

    <!-- 
    RollingUpdate is used to communicate parameters when Type is RollingUpdateStatefulSetStrategyType. 
    -->

    当 type 为 RollingUpdate 时，使用 rollingUpdate 来传递参数。

    <a name="RollingUpdateStatefulSetStrategy"></a>

    <!--
    *RollingUpdateStatefulSetStrategy is used to communicate parameter for RollingUpdateStatefulSetStrategyType.* 
    -->

    **RollingUpdateStatefulSetStrategy 用于为 rollingUpdate 类型的更新传递参数。**

    - **updateStrategy.rollingUpdate.maxUnavailable** (IntOrString)

      <!-- 
      The maximum number of pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). Absolute number is calculated from percentage by rounding up. This can not be 0. Defaults to 1. This field is alpha-level and is only honored by servers that enable the MaxUnavailableStatefulSet feature. The field applies to all pods in the range 0 to Replicas-1. That means if there is any unavailable pod in the range 0 to Replicas-1, it will be counted towards MaxUnavailable. 
      -->

      更新期间不可用的 Pod 个数上限。取值可以是绝对数量（例如：5）或所需 Pod 的百分比（例如：10%）。
      绝对数是通过四舍五入的百分比计算得出的。不能为 0，默认为 1。
      此字段为 Alpha 级别，仅被启用 MaxUnavailableStatefulSet 特性的服务器支持。
      此字段适用于 0 到 replicas-1 范围内的所有 Pod。这意味着如果在 0 到 replicas-1 范围内有任何不可用的 Pod，
      这些 Pod 将被计入 maxUnavailable 中。

      <a name="IntOrString"></a>

      <!-- 
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.* 
      -->

      **IntOrString 是一种可以包含 int32 或字符串数值的类型。在 JSON 或 YAML 编组和解组时，**
      **会生成或使用内部类型。例如，此类型允许你定义一个可以接受名称或数字的 JSON 字段。**

    - **updateStrategy.rollingUpdate.partition** (int32)

      <!-- 
      Partition indicates the ordinal at which the StatefulSet should be partitioned for updates. During a rolling update, all pods from ordinal Replicas-1 to Partition are updated. All pods from ordinal Partition-1 to 0 remain untouched. This is helpful in being able to do a canary based deployment. The default value is 0.
      -->

      partition 表示 StatefulSet 应该被分区进行更新时的序数。
      在滚动更新期间，序数在 replicas-1 和 partition 之间的所有 Pod 都会被更新。
      序数在 partition-1 和 0 之间的所有 Pod 保持不变。
      这一属性有助于进行金丝雀部署。默认值为 0。

- **podManagementPolicy** (string)

  <!-- 
  podManagementPolicy controls how pods are created during initial scale up, when replacing pods on nodes, or when scaling down. The default policy is `OrderedReady`, where pods are created in increasing order (pod-0, then pod-1, etc) and the controller will wait until each pod is ready before continuing. When scaling down, the pods are removed in the opposite order. The alternative policy is `Parallel` which will create pods in parallel to match the desired scale without waiting, and on scale down will delete all pods at once. 
  -->

  podManagementPolicy 控制在初始规模扩展期间、替换节点上的 Pod 或缩减集合规模时如何创建 Pod。
  默认策略是 “OrderedReady”，各个 Pod 按升序创建的（pod-0，然后是pod-1 等），
  控制器将等到每个 Pod 都准备就绪后再继续。缩小集合规模时，Pod 会以相反的顺序移除。
  另一种策略是 “Parallel”，意味着并行创建 Pod 以达到预期的规模而无需等待，并且在缩小规模时将立即删除所有 Pod。
  
- **revisionHistoryLimit** (int32)

  <!-- 
  revisionHistoryLimit is the maximum number of revisions that will be maintained in the StatefulSet's revision history. The revision history consists of all revisions not represented by a currently applied StatefulSetSpec version. The default value is 10. 
  -->

  revisionHistoryLimit 是在 StatefulSet 的修订历史中维护的修订个数上限。
  修订历史中包含并非由当前所应用的 StatefulSetSpec 版本未表示的所有修订版本。默认值为 10。

- **volumeClaimTemplates** ([]<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>)

  <!-- 
  volumeClaimTemplates is a list of claims that pods are allowed to reference. The StatefulSet controller is responsible for mapping network identities to claims in a way that maintains the identity of a pod. Every claim in this list must have at least one matching (by name) volumeMount in one container in the template. A claim in this list takes precedence over any volumes in the template, with the same name.
  -->

  volumeClaimTemplates 是允许 Pod 引用的申领列表。
  StatefulSet controller 负责以维持 Pod 身份不变的方式将网络身份映射到申领之上。
  此列表中的每个申领至少必须在模板的某个容器中存在匹配的（按 name 匹配）volumeMount。
  此列表中的申领优先于模板中具有相同名称的所有卷。

- **minReadySeconds** (int32)

  <!-- 
  Minimum number of seconds for which a newly created pod should be ready without any of its container crashing for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)
  -->

  新创建的 Pod 应准备就绪（其任何容器都未崩溃）的最小秒数，以使其被视为可用。
  默认为 0（Pod 准备就绪后将被视为可用）。

- **persistentVolumeClaimRetentionPolicy** (StatefulSetPersistentVolumeClaimRetentionPolicy)

  <!--
  persistentVolumeClaimRetentionPolicy describes the lifecycle of persistent volume claims created from volumeClaimTemplates. By default, all persistent volume claims are created as needed and retained until manually deleted. This policy allows the lifecycle to be altered, for example by deleting persistent volume claims when their stateful set is deleted, or when their pod is scaled down. This requires the StatefulSetAutoDeletePVC feature gate to be enabled, which is alpha.  +optional 
  -->

  persistentVolumeClaimRetentionPolicy 描述从 VolumeClaimTemplates 创建的持久卷申领的生命周期。
  默认情况下，所有持久卷申领都根据需要创建并被保留到手动删除。
  此策略允许更改申领的生命周期，例如在 StatefulSet 被删除或其中 Pod 集合被缩容时删除持久卷申领。
  此属性需要启用 StatefulSetAutoDeletePVC 特性门控。特性处于 Alpha 阶段。可选。

  <a name="StatefulSetPersistentVolumeClaimRetentionPolicy"></a>

  <!-- 
  *StatefulSetPersistentVolumeClaimRetentionPolicy describes the policy used for PVCs created from the StatefulSet VolumeClaimTemplates.* 
  -->

  **StatefulSetPersistentVolumeClaimRetentionPolicy 描述了用于从 StatefulSet VolumeClaimTemplate 创建的 PVC 的策略**

  - **persistentVolumeClaimRetentionPolicy.whenDeleted** (string)

    <!-- 
    WhenDeleted specifies what happens to PVCs created from StatefulSet VolumeClaimTemplates when the StatefulSet is deleted. The default policy of `Retain` causes PVCs to not be affected by StatefulSet deletion. The `Delete` policy causes those PVCs to be deleted. 
    -->

    whenDeleted 指定当 StatefulSet 被删除时，基于 StatefulSet VolumeClaimTemplates 所创建的 PVC 会发生什么。
    默认策略 `Retain` 使 PVC 不受 StatefulSet 被删除的影响。`Delete` 策略会导致这些 PVC 也被删除。

  - **persistentVolumeClaimRetentionPolicy.whenScaled** (string)

    <!--
    WhenScaled specifies what happens to PVCs created from StatefulSet VolumeClaimTemplates when the StatefulSet is scaled down. The default policy of `Retain` causes PVCs to not be affected by a scaledown. The `Delete` policy causes the associated PVCs for any excess pods above the replica count to be deleted. 
    -->

    whenScaled 指定当 StatefulSet 缩容时，基于 StatefulSet volumeClaimTemplates 创建的 PVC 会发生什么。
    默认策略 `Retain` 使 PVC 不受缩容影响。 `Delete` 策略会导致超出副本个数的所有的多余 Pod 所关联的 PVC 被删除。

- **ordinals** (StatefulSetOrdinals)

  <!--
  ordinals controls the numbering of replica indices in a StatefulSet. The default ordinals behavior assigns a "0" index to the first replica and increments the index by one for each additional replica requested. Using the ordinals field requires the StatefulSetStartOrdinal feature gate to be enabled, which is beta.
  -->
  ordinals 控制 StatefulSet 中副本索引的编号。
  默认序数行为是将索引 "0" 设置给第一个副本，对于每个额外请求的副本，该索引加一。
  使用 ordinals 字段需要启用 Beta 级别的 StatefulSetStartOrdinal 特性门控。

  <!--
  <a name="StatefulSetOrdinals"></a>
  *StatefulSetOrdinals describes the policy used for replica ordinal assignment in this StatefulSet.*
  -->
  <a name="StatefulSetOrdinals"></a>
  **StatefulSetOrdinals 描述此 StatefulSet 中用于副本序数赋值的策略。**

  - **ordinals.start** (int32)

    <!--
    start is the number representing the first replica's index. It may be used to number replicas from an alternate index (eg: 1-indexed) over the default 0-indexed names, or to orchestrate progressive movement of replicas from one StatefulSet to another. If set, replica indices will be in the range:
      [.spec.ordinals.start, .spec.ordinals.start + .spec.replicas).
    If unset, defaults to 0. Replica indices will be in the range:
      [0, .spec.replicas).
    -->
    start 是代表第一个副本索引的数字。它可用于从替代索引（例如：从 1 开始索引）而非默认的从 0 索引来为副本设置编号，
    还可用于编排从一个 StatefulSet 到另一个 StatefulSet 的渐进式副本迁移动作。如果设置了此值，副本索引范围为
    [.spec.ordinals.start, .spec.ordinals.start + .spec.replicas)。如果不设置，则默认为 0。
    副本索引范围为 [0, .spec.replicas)。

## StatefulSetStatus {#StatefulSetStatus}

<!-- 
StatefulSetStatus represents the current state of a StatefulSet. 
-->
StatefulSetStatus 表示 StatefulSet 的当前状态。

<hr>

<!-- 
- **replicas** (int32), required

  replicas is the number of Pods created by the StatefulSet controller.  
-->
- **replicas** (int32), 必需

  replicas 是 StatefulSet 控制器创建的 Pod 个数。

- **readyReplicas** (int32)

  <!-- 
  readyReplicas is the number of pods created for this StatefulSet with a Ready Condition. 
  -->
  readyReplicas 是为此 StatefulSet 创建的、状况为 Ready 的 Pod 个数。

- **currentReplicas** (int32)

  <!-- 
  currentReplicas is the number of Pods created by the StatefulSet controller from the StatefulSet version indicated by currentRevision. 
  -->
  currentReplicas 是 StatefulSet 控制器根据 currentReplicas 所指的 StatefulSet 版本创建的 Pod 个数。

- **updatedReplicas** (int32)

  <!-- 
  updatedReplicas is the number of Pods created by the StatefulSet controller from the StatefulSet version indicated by updateRevision.
  -->
  updatedReplicas 是 StatefulSet 控制器根据 updateRevision 所指的 StatefulSet 版本创建的 Pod 个数。

- **availableReplicas** (int32)

  <!-- 
  Total number of available pods (ready for at least minReadySeconds) targeted by this statefulset.
  -->
  此 StatefulSet 所对应的可用 Pod 总数（就绪时长至少为 minReadySeconds）。

- **collisionCount** (int32)

  <!-- 
  collisionCount is the count of hash collisions for the StatefulSet. The StatefulSet controller uses this field as a collision avoidance mechanism when it needs to create the name for the newest ControllerRevision. 
  -->
  collisionCount 是 StatefulSet 的哈希冲突计数。
  StatefulSet controller 在需要为最新的 controllerRevision 创建名称时使用此字段作为避免冲突的机制。

- **conditions** ([]StatefulSetCondition)

  <!-- 
  *Patch strategy: merge on key `type`* 
  -->
  **补丁策略：根据 `type` 键执行合并操作**

  <!-- 
  Represents the latest available observations of a statefulset's current state. 
  -->
  表示 StatefulSet 当前状态的最新可用观察结果。

  <a name="StatefulSetCondition"></a>
  <!-- 
  *StatefulSetCondition describes the state of a statefulset at a certain point.* 
  -->
  **StatefulSetCondition 描述了 StatefulSet 在某个点的状态。**

  <!-- 
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.  
  -->

  - **conditions.status** (string), 必需

    状况的状态为 True、False、Unknown 之一。

  <!-- 
  - **conditions.type** (string), required

    Type of statefulset condition.   
  -->

  - **conditions.type** (string), 必需

    StatefulSet 状况的类型。

  - **conditions.lastTransitionTime** (Time)

    <!-- 
    Last time the condition transitioned from one status to another. 
    -->

    最近一次状况从一种状态转换到另一种状态的时间。

    <a name="Time"></a>
    <!-- 
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.* 
    -->

    **Time 是 time.Time 的包装器，它支持对 YAML 和 JSON 的正确编组。**
    **time 包的许多工厂方法提供了包装器。**

  - **conditions.message** (string)

    <!-- 
    A human readable message indicating details about the transition. 
    -->

    一条人类可读的消息，指示有关转换的详细信息。

  - **conditions.reason** (string)

    <!-- 
    The reason for the condition's last transition. 
    -->

    状况最后一次转换的原因。

- **currentRevision** (string)

  <!-- 
  currentRevision, if not empty, indicates the version of the StatefulSet used to generate Pods in the sequence [0,currentReplicas). 
  -->

  currentRevision，如果不为空，表示用于在序列 [0,currentReplicas) 之间生成 Pod 的 StatefulSet 的版本。

- **updateRevision** (string)

  <!-- 
  updateRevision, if not empty, indicates the version of the StatefulSet used to generate Pods in the sequence [replicas-updatedReplicas,replicas) 
  -->

  updateRevision，如果不为空，表示用于在序列 [replicas-updatedReplicas,replicas) 之间生成 Pod 的 StatefulSet 的版本。

- **observedGeneration** (int64)

  <!-- 
  observedGeneration is the most recent generation observed for this StatefulSet. It corresponds to the StatefulSet's generation, which is updated on mutation by the API Server. 
  -->

  observedGeneration 是 StatefulSet 的最新一代。它对应于 StatefulSet 的代数，由 API 服务器在变更时更新。

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

  标准的对象元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!-- 
- **items** ([]<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>), required

  Items is the list of stateful sets.  
-->

- **items** ([]<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>), 必需

  items 是 StatefulSet 的列表。

<!-- 
## Operations {#Operations} 
-->
## 操作   {#operations}

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

<!-- 
- **name** (*in path*): string, required

  name of the StatefulSet  
-->
- **name** (**路径参数**): string, 必需

  StatefulSet 的名称。

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
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

401: Unauthorized

<!-- 
### `get` read status of the specified StatefulSet 
#### HTTP Request 
-->
### `get` 读取指定 StatefulSet 的状态
#### HTTP 请求

GET /apis/apps/v1/namespaces/{namespace}/statefulsets/{name}/status

<!-- 
#### Parameters 
-->
#### 参数

<!-- 
- **name** (*in path*): string, required

  name of the StatefulSet  
-->
- **name** (**路径参数**): string, 必需

  StatefulSet 的名称。

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
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>): OK

401: Unauthorized

<!-- 
### `list` list or watch objects of kind StatefulSet 
#### HTTP Request 
-->
### `list` 列出或监视 StatefulSet 类型的对象
#### HTTP 请求

GET /apis/apps/v1/namespaces/{namespace}/statefulsets

<!-- 
#### Parameters
-->
#### 参数

<!-- 
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a> 
-->
- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a> 

<!-- 
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a> 
-->
- **allowWatchBookmarks** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a> 

<!-- 
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a> 
-->
- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a> 

<!-- 
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a> 
-->
- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!-- 
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a> 
-->
- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a> 

<!-- 
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a> 
-->
- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a> 

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!-- 
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a> 
-->
- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a> 

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!-- 
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a> 
-->
- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a> 

<!-- 
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a> 
-->
- **watch** (**查询参数**): boolean

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

<!-- 
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a> 
-->
- **allowWatchBookmarks** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!-- 
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a> 
-->
- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!-- 
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a> 
-->
- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!-- 
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a> 
-->
- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a> 

<!-- 
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a> 
-->
- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 

<!-- 
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a> 
-->
- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!-- 
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a> 
-->
- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a> 

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!-- 
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a> 
-->
- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a> 

<!-- 
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a> 
-->
- **watch** (**查询参数**): boolean

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

<!-- 
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a> 
-->
- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!-- 
- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, required 
-->
- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, 必需

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a> 
-->
- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!-- 
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a> 
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->
  - **pretty** (**查询参数**): string

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

<!-- 
- **name** (*in path*): string, required

  name of the StatefulSet 
-->
- **name** (**路径参数**): string, 必需

  StatefulSet 的名称 。

<!-- 
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a> 
-->
- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!-- 
- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, required 
-->
- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, 必需

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!-- 
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a> 
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a> 

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->
- **pretty** (**查询参数**): string

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

<!-- 
- **name** (*in path*): string, required

  name of the StatefulSet 
-->
- **name** (**路径参数**): string, 必需

  StatefulSet 的名称。

<!-- 
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a> 
-->
- **namespace** (**路径参数**): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a> 

<!-- 
- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, required 
-->
- **body**: <a href="{{< ref "../workload-resources/stateful-set-v1#StatefulSet" >}}">StatefulSet</a>, 必需

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a> 
-->
- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a> 

<!-- 
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a> 
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->
- **pretty** (**查询参数**): string

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

<!-- 
- **name** (*in path*): string, required

  name of the StatefulSet  
-->
- **name** (**路径参数**): string, 必需

  StatefulSet 的名称。

<!-- 
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a> 
  -->
- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!-- 
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required 
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必需

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a> 
-->
- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a> 

<!-- 
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a> 
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!-- 
- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a> 
-->
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

<!-- 
- **name** (*in path*): string, required
 
  name of the StatefulSet  
-->
- **name** (**路径参数**): string, 必需

  StatefulSet 的名称。

<!-- 
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a> 
-->
- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!-- 
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required 
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必需

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a> 
-->
- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!-- 
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a> 
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!-- 
- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a> 
-->
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

<!-- 
- **name** (*in path*): string, required

  name of the StatefulSet 
-->
- **name** (**路径参数**): string, 必需

  StatefulSet 的名称。

<!-- 
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a> 
-->
- **namespace** (**路径参数**): string, 必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a> 
-->
- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a> 
-->
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
-->
- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a> 

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a> 
-->
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!-- 
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!-- 
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a> 
-->
- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!-- 
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a> 
-->
- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!-- 
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a> 
-->
- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!-- 
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a> 
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!-- 
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a> 
-->
- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!-- 
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a> 
-->
- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!-- 
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a> 
-->
- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
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
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

