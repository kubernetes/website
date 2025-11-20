---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Node"
content_type: "api_reference"
description: "Node 是 Kubernetes 中的工作節點。"
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
Node 是 Kubernetes 中的工作節點。
每個節點在緩存中（即在 etcd 中）都有一個唯一的標識符。

<hr>

- **apiVersion**: v1

- **kind**: Node

<!-- 
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata 
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!-- 
- **spec** (<a href="{{< ref "../cluster-resources/node-v1#NodeSpec" >}}">NodeSpec</a>)

  Spec defines the behavior of a node. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status 
-->
- **spec** (<a href="{{< ref "../cluster-resources/node-v1#NodeSpec" >}}">NodeSpec</a>)

  spec 定義節點的行爲。
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!-- 
- **status** (<a href="{{< ref "../cluster-resources/node-v1#NodeStatus" >}}">NodeStatus</a>)

  Most recently observed status of the node. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status 
-->
- **status** (<a href="{{< ref "../cluster-resources/node-v1#NodeStatus" >}}">NodeStatus</a>)

  此節點的最近觀測狀態。由系統填充。只讀。
  更多資訊：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## NodeSpec {#NodeSpec}

<!-- 
NodeSpec describes the attributes that a node is created with. 
-->
NodeSpec 描述了創建節點時使用的屬性。

<hr>

- **configSource** (NodeConfigSource)

  <!-- 
  Deprecated: Previously used to specify the source of the node's configuration for the DynamicKubeletConfig feature. This feature is removed.
  -->
  已棄用：以前用於爲 DynamicKubeletConfig 功能指定節點設定的來源。此功能已刪除。

  <a name="NodeConfigSource"></a>
  <!-- 
  *NodeConfigSource specifies a source of node configuration. Exactly one subfield (excluding metadata) must be non-nil. This API is deprecated since 1.22* 
  -->
  **NodeConfigSource 指定節點設定的來源。指定一個子字段（不包括元資料）必須爲非空。
  此 API 自 1.22的版本起已被棄用**

  - **configSource.configMap** (ConfigMapNodeConfigSource)

    <!--
    ConfigMap is a reference to a Node's ConfigMap
    -->

    ConfigMap 是對 Node 的 ConfigMap 的引用。

    <a name="ConfigMapNodeConfigSource"></a>
    <!--
    *ConfigMapNodeConfigSource contains the information to reference a ConfigMap as a config source for the Node. This API is deprecated since 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration*
    -->

    ConfigMapNodeConfigSource 包含引用某 ConfigMap 作爲節點設定源的資訊。
    此 API 自 1.22 版本起已被棄用：https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration

    <!--
    - **configSource.configMap.kubeletConfigKey** (string), required

      KubeletConfigKey declares which key of the referenced ConfigMap corresponds to the KubeletConfiguration structure This field is required in all cases.
    -->

    - **configSource.configMap.kubeletConfigKey** (string)，必需

      kubeletConfigKey 聲明所引用的 ConfigMap 的哪個鍵對應於 KubeletConfiguration 結構體，
      該字段在所有情況下都是必需的。

    <!--
    - **configSource.configMap.name** (string), required

      Name is the metadata.name of the referenced ConfigMap. This field is required in all cases.
    -->

    - **configSource.configMap.name** (string)，必需

      name 是被引用的 ConfigMap 的 metadata.name。
      此字段在所有情況下都是必需的。

    <!--
    - **configSource.configMap.namespace** (string), required

      Namespace is the metadata.namespace of the referenced ConfigMap. This field is required in all cases.
    -->

    - **configSource.configMap.namespace** (string)，必需

      namespace 是所引用的 ConfigMap 的 metadata.namespace。
      此字段在所有情況下都是必需的。

    - **configSource.configMap.resourceVersion** (string)

      <!--
      ResourceVersion is the metadata.ResourceVersion of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.
      -->

      resourceVersion 是所引用的 ConfigMap 的 metadata.resourceVersion。
      該字段在 Node.spec 中是禁止的，在 Node.status 中是必需的。

    - **configSource.configMap.uid** (string)

      <!--
      UID is the metadata.UID of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.
      -->

      uid 是所引用的 ConfigMap 的 metadata.uid。
      該字段在 Node.spec 中是禁止的，在 Node.status 中是必需的。

- **externalID** (string)

  <!--
  Deprecated. Not all kubelets will set this field. Remove field after 1.13. see: https://issues.k8s.io/61966 
  -->
  已棄用。並非所有 kubelet 都會設置此字段。
  1.13 的版本之後會刪除該字段。參見：https://issues.k8s.io/61966

- **podCIDR** (string)

  <!-- 
  PodCIDR represents the pod IP range assigned to the node. 
  -->
  podCIDR 表示分配給節點的 Pod IP 範圍。

- **podCIDRs** ([]string)

  <!--
  *Set: unique values will be kept during a merge*

  podCIDRs represents the IP ranges assigned to the node for usage by Pods on that node. If this field is specified, the 0th entry must match the podCIDR field. It may contain at most 1 value for each of IPv4 and IPv6. 
  -->
  **集合：唯一值將在合併期間被保留**

  podCIDRs 表示分配給節點以供該節點上的 Pod 使用的 IP 範圍。
  如果指定了該字段，則第 0 個條目必須與 podCIDR 字段匹配。
  對於 IPv4 和 IPv6，它最多可以包含 1 個值。

- **providerID** (string)

  <!-- 
  ID of the node assigned by the cloud provider in the format: \<ProviderName>://\<ProviderSpecificNodeID> 
  -->
  雲提供商分配的節點ID，格式爲：\<ProviderName>://\<ProviderSpecificNodeID>

- **taints** ([]Taint)

  <!--
  *Atomic: will be replaced during a merge*

  If specified, the node's taints. 
  -->
  **原子：將在合併期間被替換**

  如果設置了，則爲節點的污點。

  <a name="Taint"></a>
  <!-- 
  *The node this Taint is attached to has the "effect" on any pod that does not tolerate the Taint.* 
  -->
  **此污點附加到的節點對任何不容忍污點的 Pod 都有“影響”。**

  <!-- 
  - **taints.effect** (string), required

    Required. The effect of the taint on pods that do not tolerate the taint. Valid effects are NoSchedule, PreferNoSchedule and NoExecute. 

    Possible enum values:
     - `"NoExecute"` Evict any already-running pods that do not tolerate the taint. Currently enforced by NodeController.
     - `"NoSchedule"` Do not allow new pods to schedule onto the node unless they tolerate the taint, but allow all pods submitted to Kubelet without going through the scheduler to start, and allow all already-running pods to continue running. Enforced by the scheduler.
     - `"PreferNoSchedule"` Like TaintEffectNoSchedule, but the scheduler tries not to schedule new pods onto the node, rather than prohibiting new pods from scheduling onto the node entirely. Enforced by the scheduler.
  -->

  - **taints.effect** (string)，必需

    必需的。污點對不容忍污點的 Pod 的影響。合法的 effect 值有 `NoSchedule`、`PreferNoSchedule` 和 `NoExecute`。

    可能的枚舉值：
      - `"NoExecute"` 驅逐已經在運行且不容忍污點的所有 Pod。
        當前由 NodeController 執行。
      - `"NoSchedule"` 不允許新的 Pod 調度到該節點上，除非它們容忍此污點，
        但允許所有直接提交給 kubelet 而不經過調度器的 Pod 啓動，
        並允許所有已經在運行的 Pod 繼續運行。由調度器執行。
      - `"PreferNoSchedule"` 類似於 NoSchedule，但是調度器嘗試避免將新 Pod 
        調度到該節點上，而不是完全禁止新 Pod 調度到節點。由調度器執行。
 
  <!-- 
  - **taints.key** (string), required

    Required. The taint key to be applied to a node.
  -->

  - **taints.key** (string)，必需

    必需的。被應用到節點上的污點的鍵。

  - **taints.timeAdded** (Time)

    <!--
    TimeAdded represents the time at which the taint was added.
    -->

    timeAdded 表示添加污點的時間。

    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    **Time 是 `time.Time` 的包裝器，它支持對 YAML 和 JSON 的正確編組。
    time 包的許多工廠方法提供了包裝器。**

  - **taints.value** (string)

    <!--
    The taint value corresponding to the taint key.
    -->

    與污點鍵對應的污點值。

- **unschedulable** (boolean)

  <!--
  Unschedulable controls node schedulability of new pods. By default, node is schedulable. More info: https://kubernetes.io/docs/concepts/nodes/node/#manual-node-administration 
  -->

  unschedulable 控制新 Pod 的節點可調度性。
  預設情況下，節點是可調度的。
  更多資訊：https://kubernetes.io/zh-cn/docs/concepts/architecture/nodes/#manual-node-administration

## NodeStatus {#NodeStatus}

<!-- 
NodeStatus is information about the current status of a node. 
-->
NodeStatus 是有關節點當前狀態的資訊。

<hr>

- **addresses** ([]NodeAddress)

  <!--
  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*

  List of addresses reachable to the node. Queried from cloud provider, if available. More info:  https://kubernetes.io/docs/reference/node/node-status/#addresses Note: This field is declared as mergeable, but the merge key is not sufficiently unique, which can cause data corruption when it is merged. Callers should instead use a full-replacement patch. See https://pr.k8s.io/79391 for an example. Consumers should assume that addresses can change during the lifetime of a Node. However, there are some exceptions where this may not be possible, such as Pods that inherit a Node's address in its own status or consumers of the downward API (status.hostIP).
  -->
  **補丁策略：根據 `type` 鍵執行合併操作**

  **Map：鍵 `type` 的唯一值將在合併期間保留**

  節點可到達的地址列表。從雲提供商處查詢（如果有）。
  更多資訊：https://kubernetes.io/zh-cn/docs/reference/node/node-status/#addresses

  注意：該字段聲明爲可合併，但合併鍵不夠唯一，合併時可能導致資料損壞。
  調用者應改爲使用完全替換性質的補丁操作。
  有關示例，請參見 https://pr.k8s.io/79391。

  消費者應假設地址可以在節點的生命期內發生變化。
  然而在一些例外情況下這是不可能的，例如在自身狀態中繼承 Node 地址的 Pod
  或 downward API (`status.hostIP`) 的消費者。

  <a name="NodeAddress"></a>
  <!--
  *NodeAddress contains information for the node's address.* 
  -->
  
  **NodeAddress 包含節點地址的資訊。**

  <!--
  - **addresses.address** (string), required

    The node address. 
  -->

  - **addresses.address** (string)，必需

    節點地址。

  <!--
  - **addresses.type** (string), required

    Node address type, one of Hostname, ExternalIP or InternalIP. 
  -->

  - **addresses.type** (string)，必需

    節點地址類型，Hostname、ExternalIP 或 InternalIP 之一。

- **allocatable** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  <!--
  Allocatable represents the resources of a node that are available for scheduling. Defaults to Capacity. 
  -->
  allocatable 表示節點的可用於調度的資源。預設爲容量。

- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  <!--
  Capacity represents the total resources of a node. More info: https://kubernetes.io/docs/reference/node/node-status/#capacity
  -->
  capacity 代表一個節點的總資源。更多資訊：
  https://kubernetes.io/zh-cn/docs/reference/node/node-status/#capacity

- **conditions** ([]NodeCondition)

  <!-- 
  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*
  
  Conditions is an array of current observed node conditions. More info: https://kubernetes.io/docs/reference/node/node-status/#condition
  -->
  
  **補丁策略：根據 `type` 鍵執行合併操作**

  **Map：鍵 `type` 的唯一值將在合併期間保留**

  conditions 是當前觀測到的節點狀況的數組。
  更多資訊：https://kubernetes.io/zh-cn/docs/reference/node/node-status/#condition

  <a name="NodeCondition"></a>
  <!--
  *NodeCondition contains condition information for a node.* 
  -->
  **NodeCondition 包含節點狀況的資訊。**

  <!--
  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.
  -->

  - **conditions.status** (string)，必需

    狀況的狀態爲 True、False、Unknown 之一。

  <!--
  - **conditions.type** (string), required

    Type of node condition. 
  -->

  - **conditions.type** (string)，必需

    節點狀況的類型。

  - **conditions.lastHeartbeatTime** (Time)

    <!--
    Last time we got an update on a given condition.
    -->

    給定狀況最近一次更新的時間。

    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    Time 是 `time.Time` 的包裝器，它支持對 YAML 和 JSON 的正確編組。
    time 包的許多工廠方法提供了包裝器。

  - **conditions.lastTransitionTime** (Time)

    <!--
    Last time the condition transit from one status to another.
    -->

    狀況最近一次從一種狀態轉換到另一種狀態的時間。

    <a name="Time"></a>
    <!--
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
    -->

    **Time 是 `time.Time` 的包裝器，它支持對 YAML 和 JSON 的正確編組。
    time 包的許多工廠方法提供了包裝器。**

  - **conditions.message** (string)

    <!--
    Human readable message indicating details about last transition.
    -->

    指示有關上次轉換詳細資訊的人類可讀消息。

  - **conditions.reason** (string)

    <!--
    (brief) reason for the condition's last transition.
    -->

    （簡要）狀況最後一次轉換的原因。

- **config** (NodeConfigStatus)

  <!--
  Status of the config assigned to the node via the dynamic Kubelet config feature. 
  -->
  
  通過動態 kubelet 設定功能分配給節點的設定狀態。

  <a name="NodeConfigStatus"></a>
  <!-- 
  *NodeConfigStatus describes the status of the config assigned by Node.Spec.ConfigSource.* 
  -->
  **NodeConfigStatus 描述了由 Node.spec.configSource 分配的設定的狀態。**

  - **config.active** (NodeConfigSource)

    <!--
    Active reports the checkpointed config the node is actively using. Active will represent either the current version of the Assigned config, or the current LastKnownGood config, depending on whether attempting to use the Assigned config results in an error.
    -->

    active 報告節點正在使用的檢查點設定。
    active 將代表已分配設定的當前版本或當前 LastKnownGood 設定，具體取決於嘗試使用已分配設定是否會導致錯誤。

    <a name="NodeConfigSource"></a>
    <!--
    *NodeConfigSource specifies a source of node configuration. Exactly one subfield (excluding metadata) must be non-nil. This API is deprecated since 1.22*
    -->

    **NodeConfigSource 指定節點設定的來源。指定一個子字段（不包括元資料）必須爲非空。此 API 自 1.22 版本起已棄用**

    - **config.active.configMap** (ConfigMapNodeConfigSource)

      <!--
      ConfigMap is a reference to a Node's ConfigMap
      -->

      configMap 是對 Node 的 ConfigMap 的引用。

      <a name="ConfigMapNodeConfigSource"></a>
      <!--
      *ConfigMapNodeConfigSource contains the information to reference a ConfigMap as a config source for the Node. This API is deprecated since 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration*
      -->

      **ConfigMapNodeConfigSource 包含引用某 ConfigMap 作爲節點設定源的資訊。
      此 API 自 1.22 版本起已被棄用：https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration**

      <!--
      - **config.active.configMap.kubeletConfigKey** (string), required

        KubeletConfigKey declares which key of the referenced ConfigMap corresponds to the KubeletConfiguration structure This field is required in all cases.
      -->

      - **config.active.configMap.kubeletConfigKey** (string)，必需

        kubeletConfigKey 聲明所引用的 ConfigMap 的哪個鍵對應於 KubeletConfiguration 結構體，
        該字段在所有情況下都是必需的。

      <!--
      - **config.active.configMap.name** (string), required

        Name is the metadata.name of the referenced ConfigMap. This field is required in all cases.
      -->

      - **config.active.configMap.name** (string)，必需

        name 是所引用的 ConfigMap 的 `metadata.name`。
        此字段在所有情況下都是必需的。

      <!--
      - **config.active.configMap.namespace** (string), required

        Namespace is the metadata.namespace of the referenced ConfigMap. This field is required in all cases.
      -->

      - **config.active.configMap.namespace** (string)，必需

        namespace 是所引用的 ConfigMap 的 `metadata.namespace`。
        此字段在所有情況下都是必需的。

      - **config.active.configMap.resourceVersion** (string)

        <!--
        ResourceVersion is the metadata.ResourceVersion of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.
        -->

        resourceVersion 是所引用的 ConfigMap 的 `metadata.resourceVersion`。
        該字段在 `Node.spec` 中是禁止的，在 `Node.status` 中是必需的。

      - **config.active.configMap.uid** (string)

        <!--
        UID is the metadata.UID of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status. -->

        uid 是所引用的 ConfigMap 的 metadata.uid。
        該字段在 Node.spec 中是禁止的，在 Node.status 中是必需的。

  - **config.assigned** (NodeConfigSource)

    <!--
    Assigned reports the checkpointed config the node will try to use. When Node.Spec.ConfigSource is updated, the node checkpoints the associated config payload to local disk, along with a record indicating intended config. The node refers to this record to choose its config checkpoint, and reports this record in Assigned. Assigned only updates in the status after the record has been checkpointed to disk. When the Kubelet is restarted, it tries to make the Assigned config the Active config by loading and validating the checkpointed payload identified by Assigned.
    -->

    `assigned` 字段報告節點將嘗試使用的檢查點設定。
    當 `Node.spec.configSource` 被更新時，節點將所關聯的設定負載及指示預期設定的記錄通過檢查點操作加載到本地磁盤。
    節點參考這條記錄來選擇它的設定檢查點，並在 assigned 中報告這條記錄。
    僅在記錄被保存到磁盤後纔會更新 `status` 中的 assigned。
    當 kubelet 重新啓動時，它會嘗試通過加載和驗證由 assigned 標識的檢查點有效負載來使 `assigned` 設定成爲 `active` 設定。

    <a name="NodeConfigSource"></a>
    <!--
    *NodeConfigSource specifies a source of node configuration. Exactly one subfield (excluding metadata) must be non-nil. This API is deprecated since 1.22*
    -->

    **NodeConfigSource 指定節點設定的來源。指定一個子字段（不包括元資料）必須爲非空。
    此 API 自 1.22 版本起已棄用**

    - **config.assigned.configMap** (ConfigMapNodeConfigSource)

      <!--
      ConfigMap is a reference to a Node's ConfigMap
      -->

      `configMap` 是對 Node 的 ConfigMap 的引用。

      <a name="ConfigMapNodeConfigSource"></a>
      <!--
      *ConfigMapNodeConfigSource contains the information to reference a ConfigMap as a config source for the Node. This API is deprecated since 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration*
      -->

      **ConfigMapNodeConfigSource 包含引用某 ConfigMap 爲節點設定源的資訊。
      此 API 自 1.22 版本起已被棄用：https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration**

      <!--
      - **config.assigned.configMap.kubeletConfigKey** (string), required

        KubeletConfigKey declares which key of the referenced ConfigMap corresponds to the KubeletConfiguration structure This field is required in all cases.
      -->

      - **config.assigned.configMap.kubeletConfigKey** (string)，必需

        `kubeletConfigKey` 聲明所引用的 ConfigMap 的哪個鍵對應於 KubeletConfiguration 結構體，
        該字段在所有情況下都是必需的。

      <!--
      - **config.assigned.configMap.name** (string), required

        Name is the metadata.name of the referenced ConfigMap. This field is required in all cases.
      -->

      - **config.assigned.configMap.name** (string)，必需

        `name` 是所引用的 ConfigMap 的 `metadata.name`。
        此字段在所有情況下都是必需的。

      <!--
      - **config.assigned.configMap.namespace** (string), required

        Namespace is the metadata.namespace of the referenced ConfigMap. This field is required in all cases.
      -->

      - **config.assigned.configMap.namespace** (string)，必需

        `namespace` 是所引用的 ConfigMap 的 `metadata.namespace`。
        此字段在所有情況下都是必需的。

      - **config.assigned.configMap.resourceVersion** (string)

        <!--
        ResourceVersion is the metadata.ResourceVersion of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.
        -->

        `resourceVersion` 是所引用的 ConfigMap 的 `metadata.resourceVersion`。
        該字段在 `Node.spec` 中是禁止的，在 `Node.status` 中是必需的。

      - **config.assigned.configMap.uid** (string)

        <!--
        UID is the metadata.UID of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status. -->

        `uid` 是所引用的 ConfigMap 的 `metadata.uid`。
        該字段在 `Node.spec` 中是禁止的，在 `Node.status` 中是必需的。

  - **config.error** (string)

    <!--
    Error describes any problems reconciling the Spec.ConfigSource to the Active config. Errors may occur, for example, attempting to checkpoint Spec.ConfigSource to the local Assigned record, attempting to checkpoint the payload associated with Spec.ConfigSource, attempting to load or validate the Assigned config, etc. Errors may occur at different points while syncing config. Earlier errors (e.g. download or checkpointing errors) will not result in a rollback to LastKnownGood, and may resolve across Kubelet retries. Later errors (e.g. loading or validating a checkpointed config) will result in a rollback to LastKnownGood. In the latter case, it is usually possible to resolve the error by fixing the config assigned in Spec.ConfigSource. You can find additional information for debugging by searching the error message in the Kubelet log. Error is a human-readable description of the error state; machines can check whether or not Error is empty, but should not rely on the stability of the Error text across Kubelet versions.
    -->

    `error` 描述了在 `spec.configSource` 與活動設定間協調時發生的所有問題。
    可能會發生的情況，例如，嘗試將 `spec.configSource` 通過檢查點操作複製到到本地 assigned 記錄時，
    嘗試對與 `spec.configSource` 關聯的有效負載執行檢查點操作，嘗試加​​載或驗證 assigned 的設定時。
    同步設定時可能會在不同位置發生錯誤，較早的錯誤（例如下載或檢查點錯誤）不會導致回滾到 `LastKnownGood`，
    並且可能會在 kubelet 重試後解決。
    後期發生的錯誤（例如加載或驗證檢查點設定）將導致回滾到 `LastKnownGood`。
    在後一種情況下，通常可以通過修復 `spec.sonfigSource` 中 assigned 設定來解決錯誤。
    你可以通過在 kubelet 日誌中搜索錯誤消息來找到更多的調試資訊。
    error 是錯誤狀態的人類可讀描述；機器可以檢查 error 是否爲空，但不應依賴跨 kubelet 版本的 error 文本的穩定性。

  - **config.lastKnownGood** (NodeConfigSource)
    
    <!--
    LastKnownGood reports the checkpointed config the node will fall back to when it encounters an error attempting to use the Assigned config. The Assigned config becomes the LastKnownGood config when the node determines that the Assigned config is stable and correct. This is currently implemented as a 10-minute soak period starting when the local record of Assigned config is updated. If the Assigned config is Active at the end of this period, it becomes the LastKnownGood. Note that if Spec.ConfigSource is reset to nil (use local defaults), the LastKnownGood is also immediately reset to nil, because the local default config is always assumed good. You should not make assumptions about the node's method of determining config stability and correctness, as this may change or become configurable in the future.
    -->

    `lastKnownGood` 報告節點在嘗試使用 `assigned` 設定時遇到錯誤時將回退到的檢查點設定。
    當節點確定 `assigned` 設定穩定且正確時，`assigned` 設定會成爲 `lastKnownGood` 設定。
    這當前實施爲從更新分配設定的本地記錄開始的 10 分鐘浸泡期。
    如果在此期間結束時分配的設定依舊處於活動狀態，則它將成爲 `lastKnownGood`。
    請注意，如果 `spec.configSource` 重置爲 nil（使用本地預設值），
    `lastKnownGood` 也會立即重置爲 nil，因爲始終假定本地預設設定是好的。
    你不應該對節點確定設定穩定性和正確性的方法做出假設，因爲這可能會在將來發生變化或變得可設定。

    <a name="NodeConfigSource"></a>
    <!--
    *NodeConfigSource specifies a source of node configuration. Exactly one subfield (excluding metadata) must be non-nil. This API is deprecated since 1.22*
    -->

    **NodeConfigSource 指定節點設定的來源。指定一個子字段（不包括元資料）必須爲非空。
    此 API 自 1.22 版本起已棄用**

    - **config.lastKnownGood.configMap** (ConfigMapNodeConfigSource)

      <!--
      ConfigMap is a reference to a Node's ConfigMap
      -->

      `configMap` 是對 Node 的 ConfigMap 的引用。

      <a name="ConfigMapNodeConfigSource"></a>
      <!--
      *ConfigMapNodeConfigSource contains the information to reference a ConfigMap as a config source for the Node. This API is deprecated since 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration*
      -->

      ConfigMapNodeConfigSource 包含引用某 ConfigMap 作爲節點設定源的資訊。
      此 API 自 1.22 版本起已被棄用：https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration

      <!--
      - **config.lastKnownGood.configMap.kubeletConfigKey** (string), required

        KubeletConfigKey declares which key of the referenced ConfigMap corresponds to the KubeletConfiguration structure This field is required in all cases.
      -->

      - **config.lastKnownGood.configMap.kubeletConfigKey** (string)，必需

        `kubeletConfigKey` 聲明所引用的 ConfigMap 的哪個鍵對應於 KubeletConfiguration 結構體，
        該字段在所有情況下都是必需的。

      <!--
      - **config.lastKnownGood.configMap.name** (string), required

        Name is the metadata.name of the referenced ConfigMap. This field is required in all cases.
      -->

      - **config.lastKnownGood.configMap.name** (string)，必需

        `name` 是所引用的 ConfigMap 的 `metadata.name`。
        此字段在所有情況下都是必需的。

      <!--
      - **config.lastKnownGood.configMap.namespace** (string), required

        Namespace is the metadata.namespace of the referenced ConfigMap. This field is required in all cases.
      -->

      - **config.lastKnownGood.configMap.namespace** (string)，必需

        `namespace` 是所引用的 ConfigMap 的 `metadata.namespace`。
        此字段在所有情況下都是必需的。

      - **config.lastKnownGood.configMap.resourceVersion** (string)

        <!--
        ResourceVersion is the metadata.ResourceVersion of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.
        -->

        `resourceVersion` 是所引用的 ConfigMap 的 `metadata.resourceVersion`。
        該字段在 `Node.spec` 中是禁止的，在 `Node.status` 中是必需的。

      - **config.lastKnownGood.configMap.uid** (string)

        <!--
        UID is the metadata.UID of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.
        -->

        `uid` 是所引用的 ConfigMap 的 `metadata.uid`。
        該字段在 `Node.spec` 中是禁止的，在 `Node.status` 中是必需的。

- **daemonEndpoints** (NodeDaemonEndpoints)

  <!--
  Endpoints of daemons running on the Node. 
  -->
  在節點上運行的守護進程的端點。

  <a name="NodeDaemonEndpoints"></a>
  <!--
  *NodeDaemonEndpoints lists ports opened by daemons running on the Node.* 
  -->
  **NodeDaemonEndpoints 列出了節點上運行的守護進程打開的端口。**

  - **daemonEndpoints.kubeletEndpoint** (DaemonEndpoint)

    <!--
    Endpoint on which Kubelet is listening.
    -->

    kubelet 正在偵聽的端點。

    <a name="DaemonEndpoint"></a>
    <!--
    *DaemonEndpoint contains information about a single Daemon endpoint.*
    -->

    **`DaemonEndpoint` 包含有關單個 Daemon 端點的資訊。**

    <!--
    - **daemonEndpoints.kubeletEndpoint.Port** (int32), required

      Port number of the given endpoint.
    -->

    - **daemonEndpoints.kubeletEndpoint.Port** (int32)，必需

      給定端點的端口號。

<!--
- **features** (NodeFeatures)

  Features describes the set of features implemented by the CRI implementation.

  <a name="NodeFeatures"></a>
  *NodeFeatures describes the set of features implemented by the CRI implementation. The features contained in the NodeFeatures should depend only on the cri implementation independent of runtime handlers.*
-->
- **features** (NodeFeatures)

  `features` 描述由 CRI 實現所實現的一組特性。

  <a name="NodeFeatures"></a>
  **NodeFeatures 描述由 CRI 實現所實現的一組特性。
  NodeFeatures 中包含的特性應僅依賴於 CRI 實現，而與運行時處理程式無關。**

  - **features.supplementalGroupsPolicy** (boolean)

    <!--
    SupplementalGroupsPolicy is set to true if the runtime supports SupplementalGroupsPolicy and ContainerUser.
    -->

    如果運行時支持 SupplementalGroupsPolicy 和 ContainerUser，則將 supplementalGroupsPolicy 設置爲 true。

- **images** ([]ContainerImage)

  <!--
  *Atomic: will be replaced during a merge*

  List of container images on this node 
  -->

  **原子：將在合併期間被替換**

  該節點上的容器映像檔列表。

  <a name="ContainerImage"></a>
  <!--
  *Describe a container image* 
  -->
  **描述一個容器映像檔**

  - **images.names** ([]string)

    <!--
    *Atomic: will be replaced during a merge*

    Names by which this image is known. e.g. ["kubernetes.example/hyperkube:v1.0.7", "cloud-vendor.registry.example/cloud-vendor/hyperkube:v1.0.7"]
    -->

    **原子：將在合併期間被替換**

    已知此映像檔的名稱。
    例如 ["kubernetes.example/hyperkube:v1.0.7", "cloud-vendor.registry.example/cloud-vendor/hyperkube:v1.0.7"]

  - **images.sizeBytes** (int64)

    <!--
    The size of the image in bytes.
    -->

    映像檔的大小（以字節爲單位）。

- **nodeInfo** (NodeSystemInfo)

  <!--
  Set of ids/uuids to uniquely identify the node. More info: https://kubernetes.io/docs/reference/node/node-status/#info
  -->
  用於唯一標識節點的 `ids/uuids` 集。
  更多資訊：https://kubernetes.io/zh-cn/docs/reference/node/node-status/#info

  <a name="NodeSystemInfo"></a>
  <!--
  *NodeSystemInfo is a set of ids/uuids to uniquely identify the node.* 
  -->
  **NodeSystemInfo 是一組用於唯一標識節點的 `ids/uuids`。**

  <!--
  - **nodeInfo.architecture** (string), required

    The Architecture reported by the node 
  -->

  - **nodeInfo.architecture** (string)，必需

    節點報告的體系結構。

  <!--
  - **nodeInfo.bootID** (string), required

    Boot ID reported by the node. 
  -->

  - **nodeInfo.bootID** (string)，必需

    節點報告的 `bootID`。

  <!--
  - **nodeInfo.containerRuntimeVersion** (string), required

    ContainerRuntime Version reported by the node through runtime remote API (e.g. containerd://1.4.2). 
  -->

  - **nodeInfo.containerRuntimeVersion** (string)，必需

    節點通過運行時遠程 API 報告的 ContainerRuntime 版本（例如 `containerd://1.4.2`）。

  <!--
  - **nodeInfo.kernelVersion** (string), required

    Kernel Version reported by the node from 'uname -r' (e.g. 3.16.0-0.bpo.4-amd64). 
  -->

  - **nodeInfo.kernelVersion** (string)，必需

    節點來自 “uname -r” 報告的內核版本（例如 3.16.0-0.bpo.4-amd64）。

  <!--
  - **nodeInfo.kubeProxyVersion** (string), required

    Deprecated: KubeProxy Version reported by the node.
  -->

  - **nodeInfo.kubeProxyVersion** (string)，必需

    已棄用：節點報告的 KubeProxy 版本。

  <!--
  - **nodeInfo.kubeletVersion** (string), required

    Kubelet Version reported by the node. 
  -->

  - **nodeInfo.kubeletVersion** (string)，必需

    節點報告的 kubelet 版本。

  <!--
  - **nodeInfo.machineID** (string), required

    MachineID reported by the node. For unique machine identification in the cluster this field is preferred. Learn more from man(5) machine-id: http://man7.org/linux/man-pages/man5/machine-id.5.html 
  -->

  - **nodeInfo.machineID** (string)，必需

    節點上報的 `machineID`。
    對於叢集中的唯一機器標識，此字段是首選。
    從 man(5) machine-id 瞭解更多資訊：http://man7.org/linux/man-pages/man5/machine-id.5.html

  <!--
  - **nodeInfo.operatingSystem** (string), required

    The Operating System reported by the node 
  -->

  - **nodeInfo.operatingSystem** (string)，必需

    節點上報的操作系統。

  <!--
  - **nodeInfo.osImage** (string), required

    OS Image reported by the node from /etc/os-release (e.g. Debian GNU/Linux 7 (wheezy)). 
  -->

  - **nodeInfo.osImage** (string)，必需

    節點從 `/etc/os-release` 報告的操作系統映像（例如 Debian GNU/Linux 7 (wheezy)）。

  <!--
  - **nodeInfo.systemUUID** (string), required

    SystemUUID reported by the node. For unique machine identification MachineID is preferred. This field is specific to Red Hat hosts https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/rhsm/uuid 
  -->

  - **nodeInfo.systemUUID** (string)，必需

    節點報告的 `systemUUID`。
    對於唯一的機器標識 MachineID 是首選。
    此字段特定於 Red Hat 主機 https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/rhsm/uuid

  <!--
  - **nodeInfo.swap** (NodeSwapStatus)

    Swap Info reported by the node.

    <a name="NodeSwapStatus"></a>
    *NodeSwapStatus represents swap memory information.*

    - **nodeInfo.swap.capacity** (int64)

      Total amount of swap memory in bytes.
  -->

  - **nodeInfo.swap** (NodeSwapStatus)

    節點報告的交換內存資訊。

    <a name="NodeSwapStatus"></a>
    *NodeSwapStatus 表示交換內存資訊。*

    - **nodeInfo.swap.capacity** (int64)

      交換內存總量（以字節爲單位）。

- **phase** (string)

  <!--
  NodePhase is the recently observed lifecycle phase of the node. More info: https://kubernetes.io/docs/concepts/nodes/node/#phase The field is never populated, and now is deprecated. 

  Possible enum values:
   - `"Pending"` means the node has been created/added by the system, but not configured.
   - `"Running"` means the node has been configured and has Kubernetes components running.
   - `"Terminated"` means the node has been removed from the cluster.
  -->
  `NodePhase` 是最近觀測到的節點的生命週期階段。
  更多資訊：https://kubernetes.io/zh-cn/docs/concepts/architecture/nodes/#phase

  該字段從未填充，現在已被棄用。

  可能的枚舉值：
    - `"Pending"` 表示節點已被系統創建/添加，但尚未設定。
    - `"Running"` 表示節點已設定並且 Kubernetes 組件正在運行。
    - `"Terminated"` 表示節點已從叢集中移除。

<!--
- **runtimeHandlers** ([]NodeRuntimeHandler)

  *Atomic: will be replaced during a merge*
  
  The available runtime handlers.

  <a name="NodeRuntimeHandler"></a>
  *NodeRuntimeHandler is a set of runtime handler information.*
-->
- **runtimeHandlers** ([]NodeRuntimeHandler)

  **原子：將在合併期間被替換**

  可用的運行時處理程式。

  <a name="NodeRuntimeHandler"></a>
  **NodeRuntimeHandler 是一組運行時處理程式資訊。**

  <!--
  - **runtimeHandlers.features** (NodeRuntimeHandlerFeatures)

    Supported features.

    <a name="NodeRuntimeHandlerFeatures"></a>
    *NodeRuntimeHandlerFeatures is a set of features implemented by the runtime handler.*
  -->

  - **runtimeHandlers.features** (NodeRuntimeHandlerFeatures)

    支持的特性。

    <a name="NodeRuntimeHandlerFeatures"></a>
    **NodeRuntimeHandlerFeatures 是由運行時處理程式所實現的一組特性。**

    <!--
    - **runtimeHandlers.features.recursiveReadOnlyMounts** (boolean)

      RecursiveReadOnlyMounts is set to true if the runtime handler supports RecursiveReadOnlyMounts.

    - **runtimeHandlers.features.userNamespaces** (boolean)

      UserNamespaces is set to true if the runtime handler supports UserNamespaces, including for volumes.
    -->

    - **runtimeHandlers.features.recursiveReadOnlyMounts** (boolean)

      如果運行時處理程式支持 RecursiveReadOnlyMounts，則將 recursiveReadOnlyMounts 設置爲 true。

    - **runtimeHandlers.features.userNamespaces** (boolean)

      如果運行時處理程式支持包括資料卷所用的 UserNamespaces，則將 userNamespaces 設置爲 true。

  <!--
  - **runtimeHandlers.name** (string)

    Runtime handler name. Empty for the default runtime handler.
  -->

  - **runtimeHandlers.name** (string)

    運行時處理程式名稱。預設運行時處理程式爲空。

- **volumesAttached** ([]AttachedVolume)

  <!--
  *Atomic: will be replaced during a merge*

  List of volumes that are attached to the node. 
  -->
  **原子：將在合併期間被替換**

  附加到節點的卷的列表。

  <a name="AttachedVolume"></a>
  <!--
  *AttachedVolume describes a volume attached to a node* 
  -->
  **AttachedVolume 描述附加到節點的卷**

  <!--
  - **volumesAttached.devicePath** (string), required

    DevicePath represents the device path where the volume should be available 
  -->

   - **volumesAttached.devicePath** (string)，必需

     devicePath 表示卷應該可用的設備路徑。

  <!--
  - **volumesAttached.name** (string), required

    Name of the attached volume 
  -->

  - **volumesAttached.name** (string)，必需

    附加捲的名稱。

- **volumesInUse** ([]string)

  <!--
  List of attachable volumes in use (mounted) by the node. 
  -->
  節點正在使用（安裝）的可附加捲的列表。

## NodeList {#NodeList}

<!--
NodeList is the whole list of all Nodes which have been registered with master. 
-->
NodeList 是已註冊到 master 的所有節點的完整列表。

<hr>

- **apiVersion**: v1

- **kind**: NodeList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds 
  -->
  標準的列表元資料。
  更多資訊：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **items** ([]<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>), required

  List of nodes
-->
- **items** ([]<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>)，必需

  節點的列表。

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

### `get` 讀取指定節點

#### HTTP 請求

GET /api/v1/nodes/{name}

#### 參數

<!--
- **name** (*in path*): string, required
  name of the Node 
- **pretty** (*in query*): string
#### Response 
-->
- **name** (**路徑參數**): string，必需

  節點的名稱。

- **pretty** (**路徑參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 響應

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

401: Unauthorized

<!-- 
### `get` read status of the specified Node
#### HTTP Request
GET /api/v1/nodes/{name}/status
#### Parameters 
-->
### `get` 讀取指定節點的狀態

#### HTTP 請求

GET /api/v1/nodes/{name}/status

#### 參數

<!--
- **name** (*in path*): string, required
  name of the Node
- **pretty** (*in query*): string
#### Response 
-->
- **name** (**路徑參數**): string，必需

  節點的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 響應

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Node
#### HTTP Request
GET /api/v1/nodes
#### Parameters
-->
### `list` 列出或監視節點類型的對象

#### HTTP 請求

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

200 (<a href="{{< ref "../cluster-resources/node-v1#NodeList" >}}">NodeList</a>): OK

401: Unauthorized

<!--
### `create` create a Node
#### HTTP Request
POST /api/v1/nodes
#### Parameters 
-->
### `create` 創建一個節點

#### HTTP 請求

POST /api/v1/nodes

#### 參數

<!--
- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
#### Response 
-->
- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 響應

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
### `update` 替換指定節點

#### HTTP 請求

PUT /api/v1/nodes/{name}

#### 參數

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
- **name** (**路徑參數**): string，必需

  節點的名稱。

- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 響應

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified Node

#### HTTP Request

PUT /api/v1/nodes/{name}/status

#### Parameters 
-->
### `update` 替換指定節點的狀態

#### HTTP 請求

PUT /api/v1/nodes/{name}/status

#### 參數

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
- **name** (**路徑參數**): string，必需

  節點的名稱。

- **body**: <a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### 響應

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified Node
#### HTTP Request
PATCH /api/v1/nodes/{name}
#### Parameters 
-->
### `patch` 部分更新指定節點

#### HTTP 請求

PATCH /api/v1/nodes/{name}

#### 參數

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
- **name** (**路徑參數**): string，必需

  節點的名稱。

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

#### 響應

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified Node
#### HTTP Request
PATCH /api/v1/nodes/{name}/status
#### Parameters 
-->
### `patch` 部分更新指定節點的狀態

#### HTTP 請求

PATCH /api/v1/nodes/{name}/status

#### 參數

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
- **name** (**路徑參數**): string，必需

  節點的名稱。

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

#### 響應

200 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): OK

201 (<a href="{{< ref "../cluster-resources/node-v1#Node" >}}">Node</a>): Created

401: Unauthorized

<!--
### `delete` delete a Node
#### HTTP Request
DELETE /api/v1/nodes/{name}
#### Parameters 
-->
### `delete` 刪除一個節點

#### HTTP 請求

DELETE /api/v1/nodes/{name}

#### 參數

<!--
- **name** (*in path*): string, required
  name of the Node
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
#### Response
-->
- **name** (**路徑參數**): string，必需

  節點的名稱。

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

#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of Node

#### HTTP Request
-->
### `deletecollection` 刪除節點的集合

#### HTTP 請求

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

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

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
