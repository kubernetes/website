---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Node"
content_type: "api_reference"
description: "Node 是 Kubernetes 中的工作节点。"
title: "Node"
weight: 8
---
<!-- 
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Node"
content_type: "api_reference"
description: "Node is a worker node in Kubernetes."
title: "Node"
weight: 8
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Node {#Node}

<!-- 
Node is a worker node in Kubernetes. Each node will have a unique identifier in the cache (i.e. in etcd). 
-->
Node 是 Kubernetes 中的工作节点。
每个节点在缓存中（即在 etcd 中）都有一个唯一的标识符。

<hr>

- **apiVersion**: v1

- **kind**: Node

<!-- 
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata 
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。
  更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!-- 
- **spec** (<a href="{{< ref "../cluster-resources/node-v1#NodeSpec" >}}">NodeSpec</a>)

  Spec defines the behavior of a node. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status 
-->
- **spec** (<a href="{{< ref "../cluster-resources/node-v1#NodeSpec" >}}">NodeSpec</a>)

  spec 定义节点的行为。
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!-- 
- **status** (<a href="{{< ref "../cluster-resources/node-v1#NodeStatus" >}}">NodeStatus</a>)

  Most recently observed status of the node. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status 
-->
- **status** (<a href="{{< ref "../cluster-resources/node-v1#NodeStatus" >}}">NodeStatus</a>)

  此节点的最近观测状态。由系统填充。只读。
  更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## NodeSpec {#NodeSpec}

<!-- 
NodeSpec describes the attributes that a node is created with. 
-->
NodeSpec 描述了创建节点时使用的属性。

<hr>

- **configSource** (NodeConfigSource)

  <!-- 
  Deprecated: Previously used to specify the source of the node's configuration for the DynamicKubeletConfig feature. This feature is removed.
  -->
  已弃用：以前用于为 DynamicKubeletConfig 功能指定节点配置的来源。此功能已删除。

  <a name="NodeConfigSource"></a>
  <!-- 
  *NodeConfigSource specifies a source of node configuration. Exactly one subfield (excluding metadata) must be non-nil. This API is deprecated since 1.22* 
  -->
  **NodeConfigSource 指定节点配置的来源。指定一个子字段（不包括元数据）必须为非空。此 API 自 1.22的版本起已被弃用**

  - **configSource.configMap** (ConfigMapNodeConfigSource)

    <!--
    ConfigMap is a reference to a Node's ConfigMap
    -->

    configMap 是对 Node 的 ConfigMap 的引用。

    <a name="ConfigMapNodeConfigSource"></a>
    <!--
    *ConfigMapNodeConfigSource contains the information to reference a ConfigMap as a config source for the Node. This API is deprecated since 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration*
    -->

    ConfigMapNodeConfigSource 包含引用某 ConfigMap 作为节点配置源的信息。
    此 API 自 1.22 版本起已被弃用： https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration

    <!--
    - **configSource.configMap.kubeletConfigKey** (string), required

      KubeletConfigKey declares which key of the referenced ConfigMap corresponds to the KubeletConfiguration structure This field is required in all cases.
    -->

    - **configSource.configMap.kubeletConfigKey** (string), 必需

      kubeletConfigKey 声明所引用的 ConfigMap 的哪个键对应于 KubeletConfiguration 结构体，
      该字段在所有情况下都是必需的。

    <!--
    - **configSource.configMap.name** (string), required

      Name is the metadata.name of the referenced ConfigMap. This field is required in all cases.
    -->

    - **configSource.configMap.name** (string), 必需

      name 是被引用的 ConfigMap 的 metadata.name。
      此字段在所有情况下都是必需的。

    <!--
    - **configSource.configMap.namespace** (string), required

      Namespace is the metadata.namespace of the referenced ConfigMap. This field is required in all cases.
    -->

    - **configSource.configMap.namespace** (string), 必需

      namespace 是所引用的 ConfigMap 的 metadata.namespace。
      此字段在所有情况下都是必需的。

    - **configSource.configMap.resourceVersion** (string)

      <!--
      ResourceVersion is the metadata.ResourceVersion of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.
      -->

      resourceVersion 是所引用的 ConfigMap 的 metadata.resourceVersion。
      该字段在 Node.spec 中是禁止的，在 Node.status 中是必需的。

    - **configSource.configMap.uid** (string)

      <!--
      UID is the metadata.UID of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.
      -->

      uid 是所引用的 ConfigMap 的 metadata.uid。
      该字段在 Node.spec 中是禁止的，在 Node.status 中是必需的。

- **externalID** (string)

  <!--
  Deprecated. Not all kubelets will set this field. Remove field after 1.13. see: https://issues.k8s.io/61966 
  -->
  已弃用。并非所有 kubelet 都会设置此字段。
  1.13 的版本之后会删除该字段。参见： https://issues.k8s.io/61966

- **podCIDR** (string)

  <!-- 
  PodCIDR represents the pod IP range assigned to the node. 
  -->
  podCIDR 表示分配给节点的 Pod IP 范围。

- **podCIDRs** ([]string)

  <!--
  *Set: unique values will be kept during a merge*

  podCIDRs represents the IP ranges assigned to the node for usage by Pods on that node. If this field is specified, the 0th entry must match the podCIDR field. It may contain at most 1 value for each of IPv4 and IPv6. 
  -->
  **集合：唯一值将在合并期间被保留**

  podCIDRs 表示分配给节点以供该节点上的 Pod 使用的 IP 范围。
  如果指定了该字段，则第 0 个条目必须与 podCIDR 字段匹配。
  对于 IPv4 和 IPv6，它最多可以包含 1 个值。

- **providerID** (string)

  <!-- 
  ID of the node assigned by the cloud provider in the format: \<ProviderName>://\<ProviderSpecificNodeID> 
  -->
  云提供商分配的节点ID，格式为：\<ProviderName>://\<ProviderSpecificNodeID>

- **taints** ([]Taint)

  <!--
  *Atomic: will be replaced during a merge*

  If specified, the node's taints. 
  -->
  **原子：将在合并期间被替换**

  如果设置了，则为节点的污点。

  <a name="Taint"></a>
  <!-- 
  *The node this Taint is attached to has the "effect" on any pod that does not tolerate the Taint.* 
  -->
  **此污点附加到的节点对任何不容忍污点的 Pod 都有 “影响”。**

  <!-- 
  - **taints.effect** (string), required

    Required. The effect of the taint on pods that do not tolerate the taint. Valid effects are NoSchedule, PreferNoSchedule and NoExecute. 
  -->

  - **taints.effect** (string), 必需

    必需的。污点对不容忍污点的 Pod 的影响。合法的 effect 值有 NoSchedule、PreferNoSchedule 和 NoExecute。

  <!-- 
  - **taints.key** (string), required

    Required. The taint key to be applied to a node.
  -->

  - **taints.key** (string), 必需

    必需的。被应用到节点上的污点的键。

  - **taints.timeAdded** (Time)

    <!--
    TimeAdded represents the time at which the taint was added. It is only written for NoExecute taints.
    -->

    timeAdded 表示添加污点的时间。它仅适用于 NoExecute 的污点。

    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    **Time 是 time.Time 的包装器，它支持对 YAML 和 JSON 的正确编组。
    time 包的许多工厂方法提供了包装器。**

  - **taints.value** (string)

    <!--
    The taint value corresponding to the taint key.
    -->

    与污点键对应的污点值。

- **unschedulable** (boolean)

  <!--
  Unschedulable controls node schedulability of new pods. By default, node is schedulable. More info: https://kubernetes.io/docs/concepts/nodes/node/#manual-node-administration 
  -->

  unschedulable 控制新 Pod 的节点可调度性。
  默认情况下，节点是可调度的。
  更多信息： https://kubernetes.io/zh-cn/docs/concepts/architecture/nodes/#manual-node-administration

## NodeStatus {#NodeStatus}

<!-- 
NodeStatus is information about the current status of a node. 
-->
NodeStatus 是有关节点当前状态的信息。

<hr>

- **addresses** ([]NodeAddress)

  <!--
  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*

  List of addresses reachable to the node. Queried from cloud provider, if available. More info: https://kubernetes.io/docs/concepts/nodes/node/#addresses Note: This field is declared as mergeable, but the merge key is not sufficiently unique, which can cause data corruption when it is merged. Callers should instead use a full-replacement patch. See https://pr.k8s.io/79391 for an example. Consumers should assume that addresses can change during the lifetime of a Node. However, there are some exceptions where this may not be possible, such as Pods that inherit a Node's address in its own status or consumers of the downward API (status.hostIP).
  -->
  **补丁策略：根据 `type` 键执行合并操作**

  **Map：键 `type` 的唯一值将在合并期间保留**

  节点可到达的地址列表。从云提供商处查询（如果有）。
  更多信息： https://kubernetes.io/zh-cn/docs/concepts/architecture/nodes/#addresses
  
  注意：该字段声明为可合并，但合并键不够唯一，合并时可能导致数据损坏。
  调用者应改为使用完全替换性质的补丁操作。
  有关示例，请参见 https://pr.k8s.io/79391。

  消费者应假设地址可以在节点的生命期内发生变化。
  然而在一些例外情况下这是不可能的，例如在自身状态中继承 Node 地址的 Pod
  或 downward API (status.hostIP) 的消费者。

  <a name="NodeAddress"></a>
  <!--
  *NodeAddress contains information for the node's address.* 
  -->
  **NodeAddress 包含节点地址的信息。**

  <!--
  - **addresses.address** (string), required

    The node address. 
  -->

  - **addresses.address** (string), 必需

    节点地址。

  <!--
  - **addresses.type** (string), required

    Node address type, one of Hostname, ExternalIP or InternalIP. 
  -->

  - **addresses.type** (string), 必需

    节点地址类型，Hostname、ExternalIP 或 InternalIP 之一。
   
- **allocatable** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  <!--
  Allocatable represents the resources of a node that are available for scheduling. Defaults to Capacity. 
  -->
  allocatable 表示节点的可用于调度的资源。默认为容量。

- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  <!--
  Capacity represents the total resources of a node. More info: https://kubernetes.io/docs/reference/node/node-status/#capacity
  -->
  capacity 代表一个节点的总资源。更多信息：
  https://kubernetes.io/zh-cn/docs/reference/node/node-status/#capacity

- **conditions** ([]NodeCondition)

  <!-- 
  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*
  
  Conditions is an array of current observed node conditions. More info: https://kubernetes.io/docs/concepts/nodes/node/#condition 
  -->
  **补丁策略：根据 `type` 键执行合并操作**

  **Map：键 `type` 的唯一值将在合并期间保留**

  conditions 是当前观测到的节点状况的数组。
  更多信息： https://kubernetes.io/zh-cn/docs/concepts/architecture/nodes/#condition

  <a name="NodeCondition"></a>
  <!--
  *NodeCondition contains condition information for a node.* 
  -->
  **NodeCondition 包含节点状况的信息。**

  <!--
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.
  -->

  - **conditions.status** (string), 必需

    状况的状态为 True、False、Unknown 之一。
  
  <!--
  - **conditions.type** (string), required

    Type of node condition. 
  -->

  - **conditions.type** (string), 必需

    节点状况的类型。

  - **conditions.lastHeartbeatTime** (Time)

    <!--
    Last time we got an update on a given condition.
    -->

    给定状况最近一次更新的时间。

    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    Time 是 time.Time 的包装器，它支持对 YAML 和 JSON 的正确编组。
    time 包的许多工厂方法提供了包装器。

  - **conditions.lastTransitionTime** (Time)

    <!--
    Last time the condition transit from one status to another.
    -->

    状况最近一次从一种状态转换到另一种状态的时间。

    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    Time 是 time.Time 的包装器，它支持对 YAML 和 JSON 的正确编组。
    time 包的许多工厂方法提供了包装器。

  - **conditions.message** (string)

    <!--
    Human readable message indicating details about last transition.
    -->

    指示有关上次转换详细信息的人类可读消息。

  - **conditions.reason** (string)

    <!--
    (brief) reason for the condition's last transition.
    -->

    （简要）状况最后一次转换的原因。

- **config** (NodeConfigStatus)

  <!--
  Status of the config assigned to the node via the dynamic Kubelet config feature. 
  -->
  通过动态 Kubelet 配置功能分配给节点的配置状态。

  <a name="NodeConfigStatus"></a>
  <!-- 
  *NodeConfigStatus describes the status of the config assigned by Node.Spec.ConfigSource.* 
  -->
  **NodeConfigStatus 描述了由 Node.spec.configSource 分配的配置的状态。**

  - **config.active** (NodeConfigSource)

    <!--
    Active reports the checkpointed config the node is actively using. Active will represent either the current version of the Assigned config, or the current LastKnownGood config, depending on whether attempting to use the Assigned config results in an error.
    -->

    active 报告节点正在使用的检查点配置。
    active 将代表已分配配置的当前版本或当前 LastKnownGood 配置，具体取决于尝试使用已分配配置是否会导致错误。

    <a name="NodeConfigSource"></a>
    <!--
    *NodeConfigSource specifies a source of node configuration. Exactly one subfield (excluding metadata) must be non-nil. This API is deprecated since 1.22*
    -->

    **NodeConfigSource 指定节点配置的来源。指定一个子字段（不包括元数据）必须为非空。此 API 自 1.22 版本起已弃用**

    - **config.active.configMap** (ConfigMapNodeConfigSource)

      <!--
      ConfigMap is a reference to a Node's ConfigMap
      -->

      configMap 是对 Node 的 ConfigMap 的引用。

      <a name="ConfigMapNodeConfigSource"></a>
      <!--
      *ConfigMapNodeConfigSource contains the information to reference a ConfigMap as a config source for the Node. This API is deprecated since 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration*
      -->

      ConfigMapNodeConfigSource 包含引用某 ConfigMap 作为节点配置源的信息。
      此 API 自 1.22 版本起已被弃用： https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration

      <!--
      - **config.active.configMap.kubeletConfigKey** (string), required

        KubeletConfigKey declares which key of the referenced ConfigMap corresponds to the KubeletConfiguration structure This field is required in all cases.
      -->

      - **config.active.configMap.kubeletConfigKey** (string), 必需

        kubeletConfigKey 声明所引用的 ConfigMap 的哪个键对应于 KubeletConfiguration 结构体，
        该字段在所有情况下都是必需的。

      <!--
      - **config.active.configMap.name** (string), required

        Name is the metadata.name of the referenced ConfigMap. This field is required in all cases.
      -->

      - **config.active.configMap.name** (string), 必需

        name 是所引用的 ConfigMap 的 metadata.name。
        此字段在所有情况下都是必需的。

      <!--
      - **config.active.configMap.namespace** (string), required

        Namespace is the metadata.namespace of the referenced ConfigMap. This field is required in all cases.
      -->

      - **config.active.configMap.namespace** (string), 必需

        namespace 是所引用的 ConfigMap 的 metadata.namespace。
        此字段在所有情况下都是必需的。

      - **config.active.configMap.resourceVersion** (string)

        <!--
        ResourceVersion is the metadata.ResourceVersion of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.
        -->

        resourceVersion 是所引用的 ConfigMap 的 metadata.resourceVersion。
        该字段在 Node.spec 中是禁止的，在 Node.status 中是必需的。

      - **config.active.configMap.uid** (string)

        <!--
        UID is the metadata.UID of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status. -->

        uid 是所引用的 ConfigMap 的 metadata.uid。
        该字段在 Node.spec 中是禁止的，在 Node.status 中是必需的。

  - **config.assigned** (NodeConfigSource)

    <!--
    Assigned reports the checkpointed config the node will try to use. When Node.Spec.ConfigSource is updated, the node checkpoints the associated config payload to local disk, along with a record indicating intended config. The node refers to this record to choose its config checkpoint, and reports this record in Assigned. Assigned only updates in the status after the record has been checkpointed to disk. When the Kubelet is restarted, it tries to make the Assigned config the Active config by loading and validating the checkpointed payload identified by Assigned.
    -->

    assigned 字段报告节点将尝试使用的检查点配置。
    当 Node.spec.configSource 被更新时，节点将所关联的配置负载及指示预期配置的记录通过检查点操作加载到本地磁盘。
    节点参考这条记录来选择它的配置检查点，并在 assigned 中报告这条记录。
    仅在记录被保存到磁盘后才会更新 status 中的 assigned。
    当 kubelet 重新启动时，它会尝试通过加载和验证由 assigned 标识的检查点有效负载来使 assigned 配置成为 active 配置。

    <a name="NodeConfigSource"></a>
    <!--
    *NodeConfigSource specifies a source of node configuration. Exactly one subfield (excluding metadata) must be non-nil. This API is deprecated since 1.22*
    -->

    **NodeConfigSource 指定节点配置的来源。指定一个子字段（不包括元数据）必须为非空。此 API 自 1.22 版本起已弃用**

    - **config.assigned.configMap** (ConfigMapNodeConfigSource)

      <!--
      ConfigMap is a reference to a Node's ConfigMap
      -->

      configMap 是对 Node 的 ConfigMap 的引用。

      <a name="ConfigMapNodeConfigSource"></a>
      <!--
      *ConfigMapNodeConfigSource contains the information to reference a ConfigMap as a config source for the Node. This API is deprecated since 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration*
      -->

      ConfigMapNodeConfigSource 包含引用某 ConfigMap 为节点配置源的信息。
      此 API 自 1.22 版本起已被弃用： https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration

      <!--
      - **config.assigned.configMap.kubeletConfigKey** (string), required

        KubeletConfigKey declares which key of the referenced ConfigMap corresponds to the KubeletConfiguration structure This field is required in all cases.
      -->

      - **config.assigned.configMap.kubeletConfigKey** (string), 必需

        kubeletConfigKey 声明所引用的 ConfigMap 的哪个键对应于 KubeletConfiguration 结构体，
        该字段在所有情况下都是必需的。

      <!--
      - **config.assigned.configMap.name** (string), required

        Name is the metadata.name of the referenced ConfigMap. This field is required in all cases.
      -->

      - **config.assigned.configMap.name** (string), 必需

        name 是所引用的 ConfigMap 的 metadata.name。
        此字段在所有情况下都是必需的。

      <!--
      - **config.assigned.configMap.namespace** (string), required

        Namespace is the metadata.namespace of the referenced ConfigMap. This field is required in all cases.
      -->

      - **config.assigned.configMap.namespace** (string), 必需

        namespace 是所引用的 ConfigMap 的 metadata.namespace。
        此字段在所有情况下都是必需的。

      - **config.assigned.configMap.resourceVersion** (string)

        <!--
        ResourceVersion is the metadata.ResourceVersion of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.
        -->

        resourceVersion 是所引用的 ConfigMap 的 metadata.resourceVersion。
        该字段在 Node.spec 中是禁止的，在 Node.status 中是必需的。

      - **config.assigned.configMap.uid** (string)

        <!--
        UID is the metadata.UID of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status. -->

        uid 是所引用的 ConfigMap 的 metadata.uid。
        该字段在 Node.spec 中是禁止的，在 Node.status 中是必需的。

  - **config.error** (string)

    <!--
    Error describes any problems reconciling the Spec.ConfigSource to the Active config. Errors may occur, for example, attempting to checkpoint Spec.ConfigSource to the local Assigned record, attempting to checkpoint the payload associated with Spec.ConfigSource, attempting to load or validate the Assigned config, etc. Errors may occur at different points while syncing config. Earlier errors (e.g. download or checkpointing errors) will not result in a rollback to LastKnownGood, and may resolve across Kubelet retries. Later errors (e.g. loading or validating a checkpointed config) will result in a rollback to LastKnownGood. In the latter case, it is usually possible to resolve the error by fixing the config assigned in Spec.ConfigSource. You can find additional information for debugging by searching the error message in the Kubelet log. Error is a human-readable description of the error state; machines can check whether or not Error is empty, but should not rely on the stability of the Error text across Kubelet versions.
    -->

    error 描述了在 spec.configSource 与活动配置间协调时发生的所有问题。
    可能会发生的情况，例如，尝试将 spec.configSource 通过检查点操作复制到到本地 assigned 记录时，
    尝试对与 spec.configSource 关联的有效负载执行检查点操作，尝试加​​载或验证 assigned 的配置时。
    同步配置时可能会在不同位置发生错误，较早的错误（例如下载或检查点错误）不会导致回滚到 LastKnownGood，
    并且可能会在 Kubelet 重试后解决。
    后期发生的错误（例如加载或验证检查点配置）将导致回滚到 LastKnownGood。
    在后一种情况下，通常可以通过修复 spec.sonfigSource 中 assigned 配置来解决错误。
    你可以通过在 Kubelet 日志中搜索错误消息来找到更多的调试信息。
    error 是错误状态的人类可读描述；机器可以检查 error 是否为空，但不应依赖跨 kubelet 版本的 error 文本的稳定性。

  - **config.lastKnownGood** (NodeConfigSource)
    
    <!--
    LastKnownGood reports the checkpointed config the node will fall back to when it encounters an error attempting to use the Assigned config. The Assigned config becomes the LastKnownGood config when the node determines that the Assigned config is stable and correct. This is currently implemented as a 10-minute soak period starting when the local record of Assigned config is updated. If the Assigned config is Active at the end of this period, it becomes the LastKnownGood. Note that if Spec.ConfigSource is reset to nil (use local defaults), the LastKnownGood is also immediately reset to nil, because the local default config is always assumed good. You should not make assumptions about the node's method of determining config stability and correctness, as this may change or become configurable in the future.
    -->

    lastKnownGood 报告节点在尝试使用 assigned 配置时遇到错误时将回退到的检查点配置。
    当节点确定 assigned 配置稳定且正确时，assigned 配置会成为 lastKnownGood 配置。
    这当前实施为从更新分配配置的本地记录开始的 10 分钟浸泡期。
    如果在此期间结束时分配的配置依旧处于活动状态，则它将成为 lastKnownGood。
    请注意，如果 spec.configSource 重置为 nil（使用本地默认值），
    LastKnownGood 也会立即重置为 nil，因为始终假定本地默认配置是好的。
    你不应该对节点确定配置稳定性和正确性的方法做出假设，因为这可能会在将来发生变化或变得可配置。

    <a name="NodeConfigSource"></a>
    <!--
    *NodeConfigSource specifies a source of node configuration. Exactly one subfield (excluding metadata) must be non-nil. This API is deprecated since 1.22*
    -->

    **NodeConfigSource 指定节点配置的来源。指定一个子字段（不包括元数据）必须为非空。此 API 自 1.22 版本起已弃用**

    - **config.lastKnownGood.configMap** (ConfigMapNodeConfigSource)

      <!--
      ConfigMap is a reference to a Node's ConfigMap
      -->

      configMap 是对 Node 的 ConfigMap 的引用。

      <a name="ConfigMapNodeConfigSource"></a>
      <!--
      *ConfigMapNodeConfigSource contains the information to reference a ConfigMap as a config source for the Node. This API is deprecated since 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration*
      -->

      ConfigMapNodeConfigSource 包含引用某 ConfigMap 作为节点配置源的信息。
      此 API 自 1.22 版本起已被弃用： https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration
      <!--
      - **config.lastKnownGood.configMap.kubeletConfigKey** (string), required

        KubeletConfigKey declares which key of the referenced ConfigMap corresponds to the KubeletConfiguration structure This field is required in all cases.
      -->

      - **config.lastKnownGood.configMap.kubeletConfigKey** (string), 必需

        kubeletConfigKey 声明所引用的 ConfigMap 的哪个键对应于 KubeletConfiguration 结构体，
        该字段在所有情况下都是必需的。

      <!--
      - **config.lastKnownGood.configMap.name** (string), required

        Name is the metadata.name of the referenced ConfigMap. This field is required in all cases.
      -->

      - **config.lastKnownGood.configMap.name** (string), 必需

        name 是所引用的 ConfigMap 的 metadata.name。
        此字段在所有情况下都是必需的。

      <!--
      - **config.lastKnownGood.configMap.namespace** (string), required

        Namespace is the metadata.namespace of the referenced ConfigMap. This field is required in all cases.
      -->

      - **config.lastKnownGood.configMap.namespace** (string), 必需

        namespace 是所引用的 ConfigMap 的 metadata.namespace。
        此字段在所有情况下都是必需的。

      - **config.lastKnownGood.configMap.resourceVersion** (string)

        <!--
        ResourceVersion is the metadata.ResourceVersion of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.
        -->

        resourceVersion 是所引用的 ConfigMap 的 metadata.resourceVersion。
        该字段在 Node.spec 中是禁止的，在 Node.status 中是必需的。

      - **config.lastKnownGood.configMap.uid** (string)

        <!--
        UID is the metadata.UID of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.
        -->

        uid 是所引用的 ConfigMap 的 metadata.uid。
        该字段在 Node.spec 中是禁止的，在 Node.status 中是必需的。

- **daemonEndpoints** (NodeDaemonEndpoints)

  <!--
  Endpoints of daemons running on the Node. 
  -->
  在节点上运行的守护进程的端点。

  <a name="NodeDaemonEndpoints"></a>
  <!--
  *NodeDaemonEndpoints lists ports opened by daemons running on the Node.* 
  -->
  **NodeDaemonEndpoints 列出了节点上运行的守护进程打开的端口。**

  - **daemonEndpoints.kubeletEndpoint** (DaemonEndpoint)

    <!--
    Endpoint on which Kubelet is listening.
    -->

    Kubelet 正在侦听的端点。

    <a name="DaemonEndpoint"></a>
    <!--
    *DaemonEndpoint contains information about a single Daemon endpoint.*
    -->

    **DaemonEndpoint 包含有关单个 Daemon 端点的信息。**

    <!--
    - **daemonEndpoints.kubeletEndpoint.Port** (int32), required

      Port number of the given endpoint.
    -->

    - **daemonEndpoints.kubeletEndpoint.Port** (int32), 必需

      给定端点的端口号。

<!--
- **features** (NodeFeatures)

  Features describes the set of features implemented by the CRI implementation.

  <a name="NodeFeatures"></a>
  *NodeFeatures describes the set of features implemented by the CRI implementation. The features contained in the NodeFeatures should depend only on the cri implementation independent of runtime handlers.*
-->
- **features** (NodeFeatures)

  features 描述由 CRI 实现所实现的一组特性。

  <a name="NodeFeatures"></a>
  **NodeFeatures 描述由 CRI 实现所实现的一组特性。
  NodeFeatures 中包含的特性应仅依赖于 CRI 实现，而与运行时处理程序无关。**

  - **features.supplementalGroupsPolicy** (boolean)

    <!--
    SupplementalGroupsPolicy is set to true if the runtime supports SupplementalGroupsPolicy and ContainerUser.
    -->

    如果运行时支持 SupplementalGroupsPolicy 和 ContainerUser，则将 supplementalGroupsPolicy 设置为 true。

- **images** ([]ContainerImage)

  <!--
  *Atomic: will be replaced during a merge*

  List of container images on this node 
  -->

  **原子：将在合并期间被替换**

  该节点上的容器镜像列表。

  <a name="ContainerImage"></a>
  <!--
  *Describe a container image* 
  -->
  **描述一个容器镜像**

  - **images.names** ([]string)

    <!--
    *Atomic: will be replaced during a merge*

    Names by which this image is known. e.g. ["kubernetes.example/hyperkube:v1.0.7", "cloud-vendor.registry.example/cloud-vendor/hyperkube:v1.0.7"]
    -->

    **原子：将在合并期间被替换**

    已知此镜像的名称。
    例如 ["kubernetes.example/hyperkube:v1.0.7", "cloud-vendor.registry.example/cloud-vendor/hyperkube:v1.0.7"]

  - **images.sizeBytes** (int64)

    <!--
    The size of the image in bytes.
    -->

    镜像的大小（以字节为单位）。

- **nodeInfo** (NodeSystemInfo)

  <!--
  Set of ids/uuids to uniquely identify the node. More info: https://kubernetes.io/docs/concepts/nodes/node/#info 
  -->
  用于唯一标识节点的 ids/uuids 集。
  更多信息： https://kubernetes.io/zh-cn/docs/concepts/architecture/nodes/#info

  <a name="NodeSystemInfo"></a>
  <!--
  *NodeSystemInfo is a set of ids/uuids to uniquely identify the node.* 
  -->
  **NodeSystemInfo 是一组用于唯一标识节点的 ids/uuids。**

  <!--
  - **nodeInfo.architecture** (string), required

    The Architecture reported by the node 
  -->

  - **nodeInfo.architecture** (string), 必需

    节点报告的 architecture。

  <!--
  - **nodeInfo.bootID** (string), required

    Boot ID reported by the node. 
  -->

  - **nodeInfo.bootID** (string), 必需

    节点报告的 bootID。

  <!--
  - **nodeInfo.containerRuntimeVersion** (string), required

    ContainerRuntime Version reported by the node through runtime remote API (e.g. containerd://1.4.2). 
  -->

  - **nodeInfo.containerRuntimeVersion** (string), 必需

    节点通过运行时远程 API 报告的 ContainerRuntime 版本（例如 containerd://1.4.2）。

  <!--
  - **nodeInfo.kernelVersion** (string), required

    Kernel Version reported by the node from 'uname -r' (e.g. 3.16.0-0.bpo.4-amd64). 
  -->

  - **nodeInfo.kernelVersion** (string), 必需

    节点来自 “uname -r” 报告的内核版本（例如 3.16.0-0.bpo.4-amd64）。

  <!--
  - **nodeInfo.kubeProxyVersion** (string), required

    Deprecated: KubeProxy Version reported by the node.
  -->

  - **nodeInfo.kubeProxyVersion** (string), 必需

    已弃用：节点报告的 KubeProxy 版本。

  <!--
  - **nodeInfo.kubeletVersion** (string), required

    Kubelet Version reported by the node. 
  -->

  - **nodeInfo.kubeletVersion** (string), 必需

    节点报告的 kubelet 版本。

  <!--
  - **nodeInfo.machineID** (string), required

    MachineID reported by the node. For unique machine identification in the cluster this field is preferred. Learn more from man(5) machine-id: http://man7.org/linux/man-pages/man5/machine-id.5.html 
  -->

  - **nodeInfo.machineID** (string), 必需

    节点上报的 machineID。
    对于集群中的唯一机器标识，此字段是首选。
    从 man(5) machine-id 了解更多信息： http://man7.org/linux/man-pages/man5/machine-id.5.html

  <!--
  - **nodeInfo.operatingSystem** (string), required

    The Operating System reported by the node 
  -->

  - **nodeInfo.operatingSystem** (string), 必需

    节点上报的操作系统。

  <!--
  - **nodeInfo.osImage** (string), required

    OS Image reported by the node from /etc/os-release (e.g. Debian GNU/Linux 7 (wheezy)). 
  -->

  - **nodeInfo.osImage** (string), 必需

    节点从 /etc/os-release 报告的操作系统映像（例如 Debian GNU/Linux 7 (wheezy)）。

  <!--
  - **nodeInfo.systemUUID** (string), required

    SystemUUID reported by the node. For unique machine identification MachineID is preferred. This field is specific to Red Hat hosts https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/rhsm/uuid 
  -->

  - **nodeInfo.systemUUID** (string), 必需

    节点报告的 systemUUID。
    对于唯一的机器标识 MachineID 是首选。
    此字段特定于 Red Hat 主机 https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/rhsm/uuid

- **phase** (string)

  <!--
  NodePhase is the recently observed lifecycle phase of the node. More info: https://kubernetes.io/docs/concepts/nodes/node/#phase The field is never populated, and now is deprecated. 
  -->
  NodePhase 是最近观测到的节点的生命周期阶段。
  更多信息： https://kubernetes.io/zh-cn/docs/concepts/architecture/nodes/#phase
  
  该字段从未填充，现在已被弃用。

<!--
- **runtimeHandlers** ([]NodeRuntimeHandler)

  *Atomic: will be replaced during a merge*
  
  The available runtime handlers.

  <a name="NodeRuntimeHandler"></a>
  *NodeRuntimeHandler is a set of runtime handler information.*
-->
- **runtimeHandlers** ([]NodeRuntimeHandler)

  **原子：将在合并期间被替换**

  可用的运行时处理程序。

  <a name="NodeRuntimeHandler"></a>
  **NodeRuntimeHandler 是一组运行时处理程序信息。**

  <!--
  - **runtimeHandlers.features** (NodeRuntimeHandlerFeatures)

    Supported features.

    <a name="NodeRuntimeHandlerFeatures"></a>
    *NodeRuntimeHandlerFeatures is a set of features implemented by the runtime handler.*
  -->

  - **runtimeHandlers.features** (NodeRuntimeHandlerFeatures)

    支持的特性。

    <a name="NodeRuntimeHandlerFeatures"></a>
    **NodeRuntimeHandlerFeatures 是由运行时处理程序所实现的一组特性。**

    <!--
    - **runtimeHandlers.features.recursiveReadOnlyMounts** (boolean)

      RecursiveReadOnlyMounts is set to true if the runtime handler supports RecursiveReadOnlyMounts.

    - **runtimeHandlers.features.userNamespaces** (boolean)

      UserNamespaces is set to true if the runtime handler supports UserNamespaces, including for volumes.
    -->
  
    - **runtimeHandlers.features.recursiveReadOnlyMounts** (boolean)

      如果运行时处理程序支持 RecursiveReadOnlyMounts，则将 recursiveReadOnlyMounts 设置为 true。

    - **runtimeHandlers.features.userNamespaces** (boolean)

      如果运行时处理程序支持包括数据卷所用的 UserNamespaces，则将 userNamespaces 设置为 true。

  <!--
  - **runtimeHandlers.name** (string)

    Runtime handler name. Empty for the default runtime handler.
  -->

  - **runtimeHandlers.name** (string)

    运行时处理程序名称。默认运行时处理程序为空。

- **volumesAttached** ([]AttachedVolume)

  <!--
  *Atomic: will be replaced during a merge*

  List of volumes that are attached to the node. 
  -->
  **原子：将在合并期间被替换**

  附加到节点的卷的列表。

  <a name="AttachedVolume"></a>
  <!--
  *AttachedVolume describes a volume attached to a node* 
  -->
  **AttachedVolume 描述附加到节点的卷**

  <!--
  - **volumesAttached.devicePath** (string), required

    DevicePath represents the device path where the volume should be available 
  -->

   - **volumesAttached.devicePath** (string), 必需

     devicePath 表示卷应该可用的设备路径。

  <!--
  - **volumesAttached.name** (string), required

    Name of the attached volume 
  -->

  - **volumesAttached.name** (string), 必需

    附加卷的名称。

- **volumesInUse** ([]string)

  <!--
  List of attachable volumes in use (mounted) by the node. 
  -->
  节点正在使用（安装）的可附加卷的列表。

## NodeList {#NodeList}

<!--
NodeList is the whole list of all Nodes which have been registered with master. 
-->
NodeList 是已注册到 master 的所有节点的完整列表。

<hr>

- **apiVersion**: v1

- **kind**: NodeList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds 
  -->
  标准的列表元数据。
  更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **items** ([]<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>), required

  List of nodes
-->
- **items** ([]<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>), 必需

  节点的列表。

<!--
## Operations {#Operations}
<hr>
### `get` read the specified Node
#### HTTP Request
GET /api/v1/nodes/{name}
#### Parameters 
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定节点

#### HTTP 请求

GET /api/v1/nodes/{name}

#### 参数

<!--
- **name** (*in path*): string, required
  name of the Node 
- **pretty** (*in query*): string
#### Response 
-->
- **name** (**路径参数**): string, 必需

  节点的名称。

- **pretty** (**路径参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 响应

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

401: Unauthorized

<!-- 
### `get` read status of the specified Node
#### HTTP Request
GET /api/v1/nodes/{name}/status
#### Parameters 
-->
### `get` 读取指定节点的状态

#### HTTP 请求

GET /api/v1/nodes/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required
  name of the Node
- **pretty** (*in query*): string
#### Response 
-->
- **name** (**路径参数**): string, 必需

  节点的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 响应

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Node
#### HTTP Request
GET /api/v1/nodes
#### Parameters
-->
### `list` 列出或监视节点类型的对象

#### HTTP 请求

GET /api/v1/nodes

<!--
#### Parameters

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

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
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

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../cluster-resources/node-v1#NodeList" >}}">NodeList</a>): OK

401: Unauthorized

<!--
### `create` create a Node
#### HTTP Request
POST /api/v1/nodes
#### Parameters 
-->
### `create` 创建一个节点

#### HTTP 请求

POST /api/v1/nodes

#### 参数

<!--
- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
#### Response 
-->
- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>, 必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 响应

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

202 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified Node
#### HTTP Request
PUT /api/v1/nodes/{name}
#### Parameters 
-->
### `update` 替换指定节点

#### HTTP 请求

PUT /api/v1/nodes/{name}

#### 参数

<!--
- **name** (*in path*): string, required
  name of the Node
- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
#### Response 
-->
- **name** (**路径参数**): string, 必需

  节点的名称。

- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>, 必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 响应

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified Node

#### HTTP Request

PUT /api/v1/nodes/{name}/status

#### Parameters 
-->
### `update` 替换指定节点的状态

#### HTTP 请求

PUT /api/v1/nodes/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required
  name of the Node
- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
#### Response 
-->
- **name** (**路径参数**): string, 必需

  节点的名称。

- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>, 必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 响应

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified Node
#### HTTP Request
PATCH /api/v1/nodes/{name}
#### Parameters 
-->
### `patch` 部分更新指定节点

#### HTTP 请求

PATCH /api/v1/nodes/{name}

#### 参数

<!--
- **name** (*in path*): string, required
  name of the Node
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
#### Response 
-->
- **name** (**路径参数**): string, 必需

  节点的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必需

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

#### 响应

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified Node
#### HTTP Request
PATCH /api/v1/nodes/{name}/status
#### Parameters 
-->
### `patch` 部分更新指定节点的状态

#### HTTP 请求

PATCH /api/v1/nodes/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required
  name of the Node
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
#### Response 
-->
- **name** (**路径参数**): string, 必需

  节点的名称。

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, 必需

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

#### 响应

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

401: Unauthorized

<!--
### `delete` delete a Node
#### HTTP Request
DELETE /api/v1/nodes/{name}
#### Parameters 
-->
### `delete` 删除一个节点

#### HTTP 请求

DELETE /api/v1/nodes/{name}

#### 参数

<!--
- **name** (*in path*): string, required
  name of the Node
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
#### Response
-->
- **name** (**路径参数**): string, 必需

  节点的名称。

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of Node

#### HTTP Request
-->
### `deletecollection` 删除节点的集合

#### HTTP 请求

DELETE /api/v1/nodes

<!--
#### Parameters

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

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
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

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
