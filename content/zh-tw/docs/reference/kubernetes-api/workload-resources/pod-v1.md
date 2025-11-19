---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Pod"
content_type: "api_reference"
description: "Pod 是可以在主機上運行的容器的集合。"
title: "Pod"
weight: 1
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Pod"
content_type: "api_reference"
description: "Pod is a collection of containers that can run on a host."
title: "Pod"
weight: 1
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Pod {#Pod}

<!--
Pod is a collection of containers that can run on a host. This resource is created by clients and scheduled onto hosts.
-->
Pod 是可以在主機上運行的容器的集合。此資源由客戶端創建並調度到主機上。

<hr>

- **apiVersion**: v1

- **kind**: Pod

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../workload-resources/pod-v1#PodSpec" >}}">PodSpec</a>)

  Specification of the desired behavior of the pod. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **spec** (<a href="{{< ref "../workload-resources/pod-v1#PodSpec" >}}">PodSpec</a>)

  對 Pod 預期行爲的規約。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../workload-resources/pod-v1#PodStatus" >}}">PodStatus</a>)

  Most recently observed status of the pod. This data may not be up to date. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../workload-resources/pod-v1#PodStatus" >}}">PodStatus</a>)
  
  最近觀察到的 Pod 狀態。這些數據可能不是最新的。由系統填充。只讀。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## PodSpec {#PodSpec}

<!--
PodSpec is a description of a pod.
-->
PodSpec 是對 Pod 的描述。

<hr>

<!--
### Containers
-->
### 容器  {#containers}

<!--
- **containers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>), required

  *Patch strategy: merge on key `name`*
  
  List of containers belonging to the pod. Containers cannot currently be added or removed. There must be at least one container in a Pod. Cannot be updated.
-->
- **containers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>)，必需

  **補丁策略：基於 `name` 鍵合併**
  
  屬於 Pod 的容器列表。當前無法添加或刪除容器。Pod 中必須至少有一個容器。無法更新。

<!--
- **initContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>)

  *Patch strategy: merge on key `name`*
  
  List of initialization containers belonging to the pod. Init containers are executed in order prior to containers being started. If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy. The name for an init container or normal container must be unique among all containers. Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes. The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit for each resource type, and then using the max of of that value or the sum of the normal containers. Limits are applied to init containers in a similar fashion. Init containers cannot currently be added or removed. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/
-->
- **initContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>)

  **補丁策略：基於 `name` 鍵合併**

  屬於 Pod 的 Init 容器列表。Init 容器在容器啓動之前按順序執行。
  如果任何一個 Init 容器發生故障，則認爲該 Pod 失敗，並根據其 restartPolicy 處理。
  Init 容器或普通容器的名稱在所有容器中必須是唯一的。
  Init 容器不可以有生命週期操作、就緒態探針、存活態探針或啓動探針。
  在調度過程中會考慮 Init 容器的資源需求，方法是查找每種資源類型的最高請求/限制，
  然後使用該值的最大值或正常容器的資源請求的總和。
  對資源限制以類似的方式應用於 Init 容器。當前無法添加或刪除 Init 容器。無法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/init-containers/

<!--
- **ephemeralContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#EphemeralContainer" >}}">EphemeralContainer</a>)

  *Patch strategy: merge on key `name`*
  
  List of ephemeral containers run in this pod. Ephemeral containers may be run in an existing pod to perform user-initiated actions such as debugging. This list cannot be specified when creating a pod, and it cannot be modified by updating the pod spec. In order to add an ephemeral container to an existing pod, use the pod's ephemeralcontainers subresource.
-->
- **ephemeralContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#EphemeralContainer" >}}">EphemeralContainer</a>)

  **補丁策略：基於 `name` 鍵合併**
  
  在此 Pod 中運行的臨時容器列表。臨時容器可以在現有的 Pod 中運行，以執行用戶發起的操作，例如調試。
  此列表在創建 Pod 時不能指定，也不能通過更新 Pod 規約來修改。
  要將臨時容器添加到現有 Pod，請使用 Pod 的 `ephemeralcontainers` 子資源。

<!--
- **imagePullSecrets** ([]<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

  *Patch strategy: merge on key `name`*
  
  ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec. If specified, these secrets will be passed to individual puller implementations for them to use. More info: https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod
-->
- **imagePullSecrets** ([]<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

  **補丁策略：基於 `name` 鍵合併**

  imagePullSecrets 是對同一名字空間中 Secret 的引用的列表，用於拉取此 Pod 規約中使用的任何鏡像，此字段可選。
  如果指定，這些 Secret 將被傳遞給各個鏡像拉取組件（Puller）實現供其使用。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod

<!--
- **enableServiceLinks** (boolean)

  EnableServiceLinks indicates whether information about services should be injected into pod's environment variables, matching the syntax of Docker links. Optional: Defaults to true.
-->
- **enableServiceLinks** (boolean)

  enableServiceLinks 指示是否應將有關服務的信息注入到 Pod 的環境變量中，服務連接的語法與
  Docker links 的語法相匹配。可選。默認爲 true。

<!--
- **os** (PodOS)

  Specifies the OS of the containers in the pod. Some pod and container fields are restricted if this is set.
  
  If the OS field is set to linux, the following fields must be unset: -securityContext.windowsOptions
-->
- **os** (PodOS)

  指定 Pod 中容器的操作系統。如果設置了此屬性，則某些 Pod 和容器字段會受到限制。
  
  如果 os 字段設置爲 `linux`，則必須不能設置以下字段：
  
  - `securityContext.windowsOptions`

  <!--
  If the OS field is set to windows, following fields must be unset: - spec.hostPID - spec.hostIPC - spec.hostUsers - spec.securityContext.seLinuxOptions - spec.securityContext.seccompProfile - spec.securityContext.fsGroup - spec.securityContext.fsGroupChangePolicy - spec.securityContext.sysctls - spec.shareProcessNamespace - spec.securityContext.runAsUser - spec.securityContext.runAsGroup - spec.securityContext.supplementalGroups - spec.containers[*].securityContext.seLinuxOptions - spec.containers[*].securityContext.seccompProfile - spec.containers[*].securityContext.capabilities - spec.containers[*].securityContext.readOnlyRootFilesystem - spec.containers[*].securityContext.privileged - spec.containers[*].securityContext.allowPrivilegeEscalation - spec.containers[*].securityContext.procMount - spec.containers[*].securityContext.runAsUser - spec.containers[*].securityContext.runAsGroup
  -->

  如果 os 字段設置爲 `windows`，則必須不能設置以下字段：

  - `spec.hostPID`
  - `spec.hostIPC`
  - `spec.hostUsers`
  - `spec.securityContext.seLinuxOptions`
  - `spec.securityContext.seccompProfile`
  - `spec.securityContext.fsGroup`
  - `spec.securityContext.fsGroupChangePolicy`
  - `spec.securityContext.sysctls`
  - `spec.shareProcessNamespace`
  - `spec.securityContext.runAsUser`
  - `spec.securityContext.runAsGroup`
  - `spec.securityContext.supplementalGroups`
  - `spec.containers[*].securityContext.seLinuxOptions`
  - `spec.containers[*].securityContext.seccompProfile`
  - `spec.containers[*].securityContext.capabilities`
  - `spec.containers[*].securityContext.readOnlyRootFilesystem`
  - `spec.containers[*].securityContext.privileged`
  - `spec.containers[*].securityContext.allowPrivilegeEscalation`
  - `spec.containers[*].securityContext.procMount`
  - `spec.containers[*].securityContext.runAsUser`
  - `spec.containers[*].securityContext.runAsGroup`
  
  <a name="PodOS"></a>
  <!--
  *PodOS defines the OS parameters of a pod.*
  -->
  
  **PodOS 定義一個 Pod 的操作系統參數。**

  <!--
  - **os.name** (string), required

    Name is the name of the operating system. The currently supported values are linux and windows. Additional value may be defined in future and can be one of: https://github.com/opencontainers/runtime-spec/blob/master/config.md#platform-specific-configuration Clients should expect to handle additional values and treat unrecognized values in this field as os: null
  -->

  - **os.name** (string)，必需

    name 是操作系統的名稱。當前支持的值是 `linux` 和 `windows`。
    將來可能會定義附加值，並且可以是以下之一：
    https://github.com/opencontainers/runtime-spec/blob/master/config.md#platform-specific-configuration
    客戶端應該期望處理附加值並將此字段無法識別時視其爲 `os: null`。

<!--
### Volumes
-->
### 卷

<!--
- **volumes** ([]<a href="{{< ref "../config-and-storage-resources/volume#Volume" >}}">Volume</a>)

  *Patch strategies: retainKeys, merge on key `name`*
  
  List of volumes that can be mounted by containers belonging to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes
-->
- **volumes** ([]<a href="{{< ref "../config-and-storage-resources/volume#Volume" >}}">Volume</a>)

  **補丁策略：retainKeys，基於鍵 `name` 合併**
  
  可以由屬於 Pod 的容器掛載的卷列表。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes

<!--
### Scheduling
-->
### 調度

<!--
- **nodeSelector** (map[string]string)

  NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node's labels for the pod to be scheduled on that node. More info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
-->
- **nodeSelector** (map[string]string)

  nodeSelector 是一個選擇算符，這些算符必須取值爲 true 才能認爲 Pod 適合在節點上運行。
  選擇算符必須與節點的標籤匹配，以便在該節點上調度 Pod。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/configuration/assign-pod-node/

<!--
- **nodeName** (string)

  NodeName is a request to schedule this pod onto a specific node. If it is non-empty, the scheduler simply schedules this pod onto that node, assuming that it fits resource requirements.
-->
- **nodeName** (string)

  nodeName 是將此 Pod 調度到特定節點的請求。
  如果字段值不爲空，調度器只是直接將這個 Pod 調度到所指定節點上，假設節點符合資源要求。

<!--
- **affinity** (Affinity)

  If specified, the pod's scheduling constraints

  *Affinity is a group of affinity scheduling rules.*
-->
- **affinity** (Affinity)

  如果指定了，則作爲 Pod 的調度約束。

  <a name="Affinity"></a>
  **Affinity 是一組親和性調度規則。**

  <!--
  - **affinity.nodeAffinity** (<a href="{{< ref "../workload-resources/pod-v1#NodeAffinity" >}}">NodeAffinity</a>)

    Describes node affinity scheduling rules for the pod.

  - **affinity.podAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAffinity" >}}">PodAffinity</a>)

    Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).

  - **affinity.podAntiAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAntiAffinity" >}}">PodAntiAffinity</a>)

    Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).
  -->

  - **affinity.nodeAffinity** (<a href="{{< ref "../workload-resources/pod-v1#NodeAffinity" >}}">NodeAffinity</a>)

    描述 Pod 的節點親和性調度規則。

  - **affinity.podAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAffinity" >}}">PodAffinity</a>)

    描述 Pod 親和性調度規則（例如，將此 Pod 與其他一些 Pod 放在同一節點、區域等）。

  - **affinity.podAntiAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAntiAffinity" >}}">PodAntiAffinity</a>)

    描述 Pod 反親和性調度規則（例如，避免將此 Pod 與其他一些 Pod 放在相同的節點、區域等）。

<!--
- **tolerations** ([]Toleration)

  If specified, the pod's tolerations.

  *The pod this Toleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*
-->
- **tolerations** ([]Toleration)

  如果設置了此字段，則作爲 Pod 的容忍度。

  <a name="Toleration"></a>
  **這個 Toleration 所附加到的 Pod 能夠容忍任何使用匹配運算符 `<operator>` 匹配三元組 `<key,value,effect>` 所得到的污點。**

  <!--
  - **tolerations.key** (string)

    Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys.
  -->

  - **tolerations.key** (string)

    key 是容忍度所適用的污點的鍵名。此字段爲空意味着匹配所有的污點鍵。
    如果 key 爲空，則 operator 必須爲 `Exists`；這種組合意味着匹配所有值和所有鍵。
    
  <!--
  - **tolerations.operator** (string)

    Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a pod can tolerate all taints of a particular category.
  -->

  - **tolerations.operator** (string)

    operator 表示 key 與 value 之間的關係。有效的 operator 取值是 `Exists` 和 `Equal`。默認爲 `Equal`。
    `Exists` 相當於 value 爲某種通配符，因此 Pod 可以容忍特定類別的所有污點。

  <!--
  - **tolerations.value** (string)

    Value is the taint value the toleration matches to. If the operator is Exists, the value should be empty, otherwise just a regular string.
  -->

  - **tolerations.value** (string)

    value 是容忍度所匹配的污點值。如果 operator 爲 `Exists`，則此 value 值應該爲空，
    否則 value 值應該是一個正常的字符串。

  <!--
  - **tolerations.effect** (string)

    Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.
  -->

  - **tolerations.effect** (string)

    effect 指示要匹配的污點效果。空值意味著匹配所有污點效果。如果要設置此字段，允許的值爲
    `NoSchedule`、`PreferNoSchedule` 和 `NoExecute` 之一。

  <!--
  - **tolerations.tolerationSeconds** (int64)

    TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system.
  -->

  - **tolerations.tolerationSeconds** (int64)

    tolerationSeconds 表示容忍度（effect 必須是 `NoExecute`，否則此字段被忽略）容忍污點的時間長度。
    默認情況下，此字段未被設置，這意味着會一直能夠容忍對應污點（不會發生驅逐操作）。
    零值和負值會被系統當做 0 值處理（立即觸發驅逐）。

<!--
- **schedulerName** (string)

  If specified, the pod will be dispatched by specified scheduler. If not specified, the pod will be dispatched by default scheduler.
-->
- **schedulerName** (string)

  如果設置了此字段，則 Pod 將由指定的調度器調度。如果未指定，則使用默認調度器來調度 Pod。

<!--
- **runtimeClassName** (string)

  RuntimeClassName refers to a RuntimeClass object in the node.k8s.io group, which should be used to run this pod.  If no RuntimeClass resource matches the named class, the pod will not be run. If unset or empty, the "legacy" RuntimeClass will be used, which is an implicit class with an empty definition that uses the default runtime handler. More info: https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class
-->
- **runtimeClassName** (string)

  runtimeClassName 引用 `node.k8s.io` 組中的一個 RuntimeClass 對象，該 RuntimeClass 將被用來運行這個 Pod。
  如果沒有 RuntimeClass 資源與所設置的類匹配，則 Pod 將不會運行。
  如果此字段未設置或爲空，將使用 "舊版" RuntimeClass。
  "舊版" RuntimeClass 可以視作一個隱式的運行時類，其定義爲空，會使用默認運行時處理程序。
  更多信息：
  https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class

<!--
- **priorityClassName** (string)

  If specified, indicates the pod's priority. "system-node-critical" and "system-cluster-critical" are two special keywords which indicate the highest priorities with the former being the highest priority. Any other name must be defined by creating a PriorityClass object with that name. If not specified, the pod priority will be default or zero if there is no default.
-->
- **priorityClassName** (string)

  如果設置了此字段，則用來標明 Pod 的優先級。
  `"system-node-critical"` 和 `"system-cluster-critical"` 是兩個特殊關鍵字，
  分別用來表示兩個最高優先級，前者優先級更高一些。
  任何其他名稱都必須通過創建具有該名稱的 PriorityClass 對象來定義。
  如果未指定此字段，則 Pod 優先級將爲默認值。如果沒有默認值，則爲零。

<!--
- **priority** (int32)

  The priority value. Various system components use this field to find the priority of the pod. When Priority Admission Controller is enabled, it prevents users from setting this field. The admission controller populates this field from PriorityClassName. The higher the value, the higher the priority.
-->
- **priority** (int32)

  優先級值。各種系統組件使用該字段來確定 Pod 的優先級。當啓用 Priority 准入控制器時，
  該控制器會阻止用戶設置此字段。准入控制器基於 priorityClassName 設置來填充此字段。
  字段值越高，優先級越高。

<!--
- **preemptionPolicy** (string)

  PreemptionPolicy is the Policy for preempting pods with lower priority. One of Never, PreemptLowerPriority. Defaults to PreemptLowerPriority if unset.
-->
- **preemptionPolicy** (string)

  preemptionPolicy 是用來搶佔優先級較低的 Pod 的策略。取值爲 `"Never"`、`"PreemptLowerPriority"` 之一。
  如果未設置，則默認爲 `"PreemptLowerPriority"`。

<!--
- **topologySpreadConstraints** ([]TopologySpreadConstraint)

  *Patch strategy: merge on key `topologyKey`*
  
  *Map: unique values on keys `topologyKey, whenUnsatisfiable` will be kept during a merge*
  
  TopologySpreadConstraints describes how a group of pods ought to spread across topology domains. Scheduler will schedule pods in a way which abides by the constraints. All topologySpreadConstraints are ANDed.

  *TopologySpreadConstraint specifies how to spread matching pods among the given topology.*
-->
- **topologySpreadConstraints** ([]TopologySpreadConstraint)

  **補丁策略：基於 `topologyKey` 鍵合併**
  
  **映射：`topologyKey, whenUnsatisfiable` 鍵組合的唯一值 將在合併期間保留**
  
  TopologySpreadConstraints 描述一組 Pod 應該如何跨拓撲域來分佈。調度器將以遵從此約束的方式來調度 Pod。
  所有 topologySpreadConstraints 條目會通過邏輯與操作進行組合。

  <a name="TopologySpreadConstraint"></a>
  **TopologySpreadConstraint 指定如何在規定的拓撲下分佈匹配的 Pod。**

  <!--
  - **topologySpreadConstraints.maxSkew** (int32), required

    MaxSkew describes the degree to which pods may be unevenly distributed. When `whenUnsatisfiable=DoNotSchedule`, it is the maximum permitted difference between the number of matching pods in the target topology and the global minimum. The global minimum is the minimum number of matching pods in an eligible domain or zero if the number of eligible domains is less than MinDomains. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 2/2/1: In this case, the global minimum is 1. | zone1 | zone2 | zone3 | |  P P  |  P P  |   P   | - if MaxSkew is 1, incoming pod can only be scheduled to zone3 to become 2/2/2; scheduling it onto zone1(zone2) would make the ActualSkew(3-1) on zone1(zone2) violate MaxSkew(1). - if MaxSkew is 2, incoming pod can be scheduled onto any zone. When `whenUnsatisfiable=ScheduleAnyway`, it is used to give higher precedence to topologies that satisfy it. It's a required field. Default value is 1 and 0 is not allowed.
  -->

  - **topologySpreadConstraints.maxSkew** (int32)，必需

    maxSkew 描述 Pod 可能分佈不均衡的程度。當 `whenUnsatisfiable=DoNotSchedule` 時，
    此字段值是目標拓撲中匹配的 Pod 數量與全局最小值之間的最大允許差值。
    全局最小值是候選域中匹配 Pod 的最小數量，如果候選域的數量小於 `minDomains`，則爲零。
    例如，在一個包含三個可用區的集羣中，maxSkew 設置爲 1，具有相同 `labelSelector` 的 Pod 分佈爲 2/2/1：
    在這種情況下，全局最小值爲 1。

    ```
    | zone1 | zone2 | zone3 |
    | PP    | PP    |  P    |
    ```

    - 如果 maxSkew 爲 1，傳入的 Pod 只能調度到 "zone3"，變成 2/2/2；
      將其調度到 "zone1"（"zone2"）將使"zone1"（"zone2"）上的實際偏差（Actual Skew）爲 3-1，進而違反
      maxSkew 限制（1）。
    - 如果 maxSkew 爲 2，則可以將傳入的 Pod 調度到任何區域。

    當 `whenUnsatisfiable=ScheduleAnyway` 時，此字段被用來給滿足此約束的拓撲域更高的優先級。

    此字段是一個必填字段。默認值爲 1，不允許爲 0。

  <!--
  - **topologySpreadConstraints.topologyKey** (string), required

    TopologyKey is the key of node labels. Nodes that have a label with this key and identical values are considered to be in the same topology. We consider each \<key, value> as a "bucket", and try to put balanced number of pods into each bucket. We define a domain as a particular instance of a topology. Also, we define an eligible domain as a domain whose nodes meet the requirements of nodeAffinityPolicy and nodeTaintsPolicy. e.g. If TopologyKey is "kubernetes.io/hostname", each Node is a domain of that topology. And, if TopologyKey is "topology.kubernetes.io/zone", each zone is a domain of that topology. It's a required field.
  -->

  - **topologySpreadConstraints.topologyKey** (string)，必需

    topologyKey 是節點標籤的鍵名。如果節點的標籤中包含此鍵名且鍵值亦相同，則被認爲在相同的拓撲域中。
    我們將每個 `<鍵, 值>` 視爲一個 "桶（Bucket）"，並嘗試將數量均衡的 Pod 放入每個桶中。
    我們定義域（Domain）爲拓撲域的特定實例。
    此外，我們定義一個候選域（Eligible Domain）爲其節點與 nodeAffinityPolicy 和 nodeTaintsPolicy 的要求匹配的域。
    例如，如果 topologyKey 是 `"kubernetes.io/hostname"`，則每個 Node 都是該拓撲的域。
    而如果 topologyKey 是 `"topology.kubernetes.io/zone"`，則每個區域都是該拓撲的一個域。
    這是一個必填字段。

  <!--
  - **topologySpreadConstraints.whenUnsatisfiable** (string), required

    WhenUnsatisfiable indicates how to deal with a pod if it doesn't satisfy the spread constraint.
    - DoNotSchedule (default) tells the scheduler not to schedule it.
    - ScheduleAnyway tells the scheduler to schedule the pod in any location,
      but giving higher precedence to topologies that would help reduce the
      skew.
    A constraint is considered "Unsatisfiable" for an incoming pod if and only if every possible node assignment for that pod would violate "MaxSkew" on some topology. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 3/1/1: | zone1 | zone2 | zone3 | | P P P |   P   |   P   | If WhenUnsatisfiable is set to DoNotSchedule, incoming pod can only be scheduled to zone2(zone3) to become 3/2/1(3/1/2) as ActualSkew(2-1) on zone2(zone3) satisfies MaxSkew(1). In other words, the cluster can still be imbalanced, but scheduler won't make it *more* imbalanced. It's a required field.
  -->

  - **topologySpreadConstraints.whenUnsatisfiable** (string)，必需

    whenUnsatisfiable 表示如果 Pod 不滿足分佈約束，如何處理它。

    - `DoNotSchedule`（默認）：告訴調度器不要調度它。
    - `ScheduleAnyway`：告訴調度器將 Pod 調度到任何位置，但給予能夠降低偏差的拓撲更高的優先級。

    當且僅當該 Pod 的每個可能的節點分配都會違反某些拓撲對應的 "maxSkew" 時，
    才認爲傳入 Pod 的約束是 "不可滿足的"。

    例如，在一個包含三個區域的集羣中，maxSkew 設置爲 1，具有相同 labelSelector 的 Pod 分佈爲 3/1/1：

    ```
    | zone1 | zone2 | zone3 |
    | P P P | P     | P     |
    ```

    如果 whenUnsatisfiable 設置爲 `DoNotSchedule`，則傳入的 Pod 只能調度到 "zone2"（"zone3"），
    Pod 分佈變成 3/2/1（3/1/2），因爲 "zone2"（"zone3"）上的實際偏差（Actual Skew） 爲 2-1，
    滿足 maxSkew 約束（1）。
    換句話說，集羣仍然可以不平衡，但調度器不會使其**更加地**不平衡。

    這是一個必填字段。

  <!--
  - **topologySpreadConstraints.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    LabelSelector is used to find matching pods. Pods that match this label selector are counted to determine the number of pods in their corresponding topology domain.
  -->

  - **topologySpreadConstraints.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    labelSelector 用於識別匹配的 Pod。對匹配此標籤選擇算符的 Pod 進行計數，
    以確定其相應拓撲域中的 Pod 數量。

  <!--
  - **topologySpreadConstraints.matchLabelKeys** ([]string)

    *Atomic: will be replaced during a merge*
    
    MatchLabelKeys is a set of pod label keys to select the pods over which spreading will be calculated. The keys are used to lookup values from the incoming pod labels, those key-value labels are ANDed with labelSelector to select the group of existing pods over which spreading will be calculated for the incoming pod.  The same key is forbidden to exist in both MatchLabelKeys and LabelSelector. MatchLabelKeys cannot be set when LabelSelector isn't set. Keys that don't exist in the incoming pod labels will be ignored. A null or empty list means only match against labelSelector.
    This is a beta field and requires the MatchLabelKeysInPodTopologySpread feature gate to be enabled (enabled by default).
  -->
  - **topologySpreadConstraints.matchLabelKeys** ([]string)

    **原子性：將在合併期間被替換**
    
    matchLabelKeys 是一組 Pod 標籤鍵，用於通過計算 Pod 分佈方式來選擇 Pod。
    新 Pod 標籤中不存在的鍵將被忽略。這些鍵用於從新來的 Pod 標籤中查找值，這些鍵值標籤與 labelSelector 進行邏輯與運算，
    通過計算 Pod 的分佈方式來選擇現有 Pod 的組。matchLabelKeys 和 labelSelector
    中禁止存在相同的鍵。未設置 labelSelector 時無法設置 matchLabelKeys。
    新來的 Pod 標籤中不存在的鍵將被忽略。null 或空的列表意味着僅與 labelSelector 匹配。

    這是一個 Beta 字段，需要啓用 MatchLabelKeysInPodTopologySpread 特性門控（默認啓用）。
  <!--
  - **topologySpreadConstraints.minDomains** (int32)

    MinDomains indicates a minimum number of eligible domains. When the number of eligible domains with matching topology keys is less than minDomains, Pod Topology Spread treats "global minimum" as 0, and then the calculation of Skew is performed. And when the number of eligible domains with matching topology keys equals or greater than minDomains, this value has no effect on scheduling. As a result, when the number of eligible domains is less than minDomains, scheduler won't schedule more than maxSkew Pods to those domains. If value is nil, the constraint behaves as if MinDomains is equal to 1. Valid values are integers greater than 0. When value is not nil, WhenUnsatisfiable must be DoNotSchedule.
    
    For example, in a 3-zone cluster, MaxSkew is set to 2, MinDomains is set to 5 and pods with the same labelSelector spread as 2/2/2: | zone1 | zone2 | zone3 | |  P P  |  P P  |  P P  | The number of domains is less than 5(MinDomains), so "global minimum" is treated as 0. In this situation, new pod with the same labelSelector cannot be scheduled, because computed skew will be 3(3 - 0) if new Pod is scheduled to any of the three zones, it will violate MaxSkew.
    
    This is a beta field and requires the MinDomainsInPodTopologySpread feature gate to be enabled (enabled by default).
  -->

  - **topologySpreadConstraints.minDomains** (int32)

    minDomains 表示符合條件的域的最小數量。當符合拓撲鍵的候選域個數小於 minDomains 時，
    Pod 拓撲分佈特性會將 "全局最小值" 視爲 0，然後進行偏差的計算。
    當匹配拓撲鍵的候選域的數量等於或大於 minDomains 時，此字段的值對調度沒有影響。
    因此，當候選域的數量少於 minDomains 時，調度程序不會將超過 maxSkew 個 Pods 調度到這些域。
    如果字段值爲 nil，所表達的約束爲 minDomains 等於 1。
    字段的有效值爲大於 0 的整數。當字段值不爲 nil 時，whenUnsatisfiable 必須爲 `DoNotSchedule`。
    
    例如，在一個包含三個區域的集羣中，maxSkew 設置爲 2，minDomains 設置爲 5，具有相同 labelSelector
    的 Pod 分佈爲 2/2/2：

    ```
    | zone1 | zone2 | zone3 |
    | PP    | PP    | PP    |
    ```

    域的數量小於 5（minDomains 取值），因此"全局最小值"被視爲 0。
    在這種情況下，無法調度具有相同 labelSelector 的新 Pod，因爲如果基於新 Pod 計算的偏差值將爲
    3（3-0）。將這個 Pod 調度到三個區域中的任何一個，都會違反 maxSkew 約束。
    
    此字段是一個 Beta 字段，需要啓用 MinDomainsInPodTopologySpread 特性門控（默認被啓用）。

  <!--
  - **topologySpreadConstraints.nodeAffinityPolicy** (string)

    NodeAffinityPolicy indicates how we will treat Pod's nodeAffinity/nodeSelector when calculating pod topology spread skew. Options are: - Honor: only nodes matching nodeAffinity/nodeSelector are included in the calculations. - Ignore: nodeAffinity/nodeSelector are ignored. All nodes are included in the calculations.
    
    If this value is nil, the behavior is equivalent to the Honor policy. This is a beta-level feature default enabled by the NodeInclusionPolicyInPodTopologySpread feature flag.
  -->

  - **topologySpreadConstraints.nodeAffinityPolicy** (string)

    nodeAffinityPolicy 表示我們在計算 Pod 拓撲分佈偏差時將如何處理 Pod 的 nodeAffinity/nodeSelector。
    選項爲：
    - Honor：只有與 nodeAffinity/nodeSelector 匹配的節點纔會包括到計算中。
    - Ignore：nodeAffinity/nodeSelector 被忽略。所有節點均包括到計算中。

    如果此值爲 nil，此行爲等同於 Honor 策略。
    這是通過 NodeInclusionPolicyInPodTopologySpread 特性標誌默認啓用的 Beta 級別特性。

  <!--
  - **topologySpreadConstraints.nodeTaintsPolicy** (string)

    NodeTaintsPolicy indicates how we will treat node taints when calculating pod topology spread skew. Options are: - Honor: nodes without taints, along with tainted nodes for which the incoming pod has a toleration, are included. - Ignore: node taints are ignored. All nodes are included.
    
    If this value is nil, the behavior is equivalent to the Ignore policy. This is a beta-level feature default enabled by the NodeInclusionPolicyInPodTopologySpread feature flag.
  -->
  - **topologySpreadConstraints.nodeTaintsPolicy** (string)

    nodeTaintsPolicy 表示我們在計算 Pod 拓撲分佈偏差時將如何處理節點污點。選項爲：
    - Honor：包括不帶污點的節點以及新來 Pod 具有容忍度且帶有污點的節點。
    - Ignore：節點污點被忽略。包括所有節點。
    
    如果此值爲 nil，此行爲等同於 Ignore 策略。
    這是通過 NodeInclusionPolicyInPodTopologySpread 特性標誌默認啓用的 Beta 級別特性。

<!--
- **overhead** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Overhead represents the resource overhead associated with running a pod for a given RuntimeClass. This field will be autopopulated at admission time by the RuntimeClass admission controller. If the RuntimeClass admission controller is enabled, overhead must not be set in Pod create requests. The RuntimeClass admission controller will reject Pod create requests which have the overhead already set. If RuntimeClass is configured and selected in the PodSpec, Overhead will be set to the value defined in the corresponding RuntimeClass, otherwise it will remain unset and treated as zero. More info: https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md
-->
- **overhead** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  overhead 表示與用指定 RuntimeClass 運行 Pod 相關的資源開銷。
  該字段將由 RuntimeClass 准入控制器在准入時自動填充。
  如果啓用了 RuntimeClass 准入控制器，則不得在 Pod 創建請求中設置 overhead 字段。
  RuntimeClass 准入控制器將拒絕已設置 overhead 字段的 Pod 創建請求。
  如果在 Pod 規約中配置並選擇了 RuntimeClass，overhead 字段將被設置爲對應 RuntimeClass 中定義的值，
  否則將保持不設置並視爲零。更多信息：
  https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md

<!--
### Lifecycle
-->

### 生命週期

<!--
- **restartPolicy** (string)

  Restart policy for all containers within the pod. One of Always, OnFailure, Never. In some contexts, only a subset of those values may be permitted. Default to Always. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy
-->
- **restartPolicy** (string)

  Pod 內所有容器的重啓策略。`Always`、`OnFailure`、`Never` 之一。
  在某些情況下，可能只允許這些值的一個子集。默認爲 `Always`。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

<!--
- **terminationGracePeriodSeconds** (int64)

  Optional duration in seconds the pod needs to terminate gracefully. May be decreased in delete request. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). If this value is nil, the default grace period will be used instead. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. Defaults to 30 seconds.
-->
- **terminationGracePeriodSeconds** (int64)

  可選字段，表示 Pod 需要體面終止的所需的時長（以秒爲單位）。字段值可以在刪除請求中減少。
  字段值必須是非負整數。零值表示收到 kill 信號則立即停止（沒有機會關閉）。
  如果此值爲 nil，則將使用默認寬限期。
  寬限期是從 Pod 中運行的進程收到終止信號後，到進程被 kill 信號強制停止之前，Pod 可以繼續存在的時間（以秒爲單位）。
  應該將此值設置爲比你的進程的預期清理時間更長。默認爲 30 秒。

<!--
- **activeDeadlineSeconds** (int64)

  Optional duration in seconds the pod may be active on the node relative to StartTime before the system will actively try to mark it failed and kill associated containers. Value must be a positive integer.
-->
- **activeDeadlineSeconds** (int64)

  在系統將主動嘗試將此 Pod 標記爲已失敗並殺死相關容器之前，Pod 可能在節點上活躍的時長；
  時長計算基於 startTime 計算（以秒爲單位）。字段值必須是正整數。

<!--
- **readinessGates** ([]PodReadinessGate)

  If specified, all readiness gates will be evaluated for pod readiness. A pod is ready when all its containers are ready AND all conditions specified in the readiness gates have status equal to "True" More info: https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates

  *PodReadinessGate contains the reference to a pod condition*
-->
- **readinessGate** ([]PodReadinessGate)

  如果設置了此字段，則將評估所有就緒門控（Readiness Gate）以確定 Pod 就緒狀況。
  當所有容器都已就緒，並且就緒門控中指定的所有狀況的 status 都爲 "true" 時，Pod 被視爲就緒。
  更多信息： https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates

  <a name="PodReadinessGate"></a>
  **PodReadinessGate 包含對 Pod 狀況的引用**

  <!--
  - **readinessGates.conditionType** (string), required

    ConditionType refers to a condition in the pod's condition list with matching type.
  -->

  - **readinessGates.conditionType** (string)，必需

    conditionType 是指 Pod 的狀況列表中類型匹配的狀況。

<!--
### Hostname and Name resolution
-->
### 主機名和名稱解析

<!--
- **hostname** (string)

  Specifies the hostname of the Pod If not specified, the pod's hostname will be set to a system-defined value.
-->
- **hostname**  (string)

  指定 Pod 的主機名。如果此字段未指定，則 Pod 的主機名將設置爲系統定義的值。

<!--
- **setHostnameAsFQDN** (boolean)

  If true the pod's hostname will be configured as the pod's FQDN, rather than the leaf name (the default). In Linux containers, this means setting the FQDN in the hostname field of the kernel (the nodename field of struct utsname). In Windows containers, this means setting the registry value of hostname for the registry key HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters to FQDN. If a pod does not have FQDN, this has no effect. Default to false.
-->
- **setHostnameAsFQDN** (boolean)

  如果爲 true，則 Pod 的主機名將配置爲 Pod 的 FQDN，而不是葉名稱（默認值）。
  在 Linux 容器中，這意味着將內核的 hostname 字段（struct utsname 的 nodename 字段）設置爲 FQDN。
  在 Windows 容器中，這意味着將註冊表項 `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters`
  的 hostname 鍵設置爲 FQDN。如果 Pod 沒有 FQDN，則此字段不起作用。
  默認爲 false。

<!--
- **subdomain** (string)

  If specified, the fully qualified Pod hostname will be "\<hostname>.\<subdomain>.\<pod namespace>.svc.\<cluster domain>". If not specified, the pod will not have a domainname at all.
-->
- **subdomain** (string)

  如果設置了此字段，則完全限定的 Pod 主機名將是 `<hostname>.<subdomain>.<Pod 名字空間>.svc.<集羣域名>`。
  如果未設置此字段，則該 Pod 將沒有域名。

<!--
- **hostAliases** ([]HostAlias)

  *Patch strategy: merge on key `ip`*
  
  HostAliases is an optional list of hosts and IPs that will be injected into the pod's hosts file if specified. This is only valid for non-hostNetwork pods.

  *HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.*
-->
- **hostAliases** ([]HostAlias)

  **補丁策略：基於 `ip` 鍵合併**
  
  hostAliases 是一個可選的列表屬性，包含要被注入到 Pod 的 hosts 文件中的主機和 IP 地址。
  這僅對非 hostNetwork Pod 有效。

  <a name="HostAlias"></a>
  **HostAlias 結構保存 IP 和主機名之間的映射，這些映射將作爲 Pod 的 hosts 文件中的條目注入。**

  <!--
  - **hostAliases.hostnames** ([]string)

    Hostnames for the above IP address.

  - **hostAliases.ip** (string)

    IP address of the host file entry.
  -->

  - **hostAliases.hostnames** ([]string)

    指定 IP 地址對應的主機名。

  - **hostAliases.ip** (string)

    主機文件條目的 IP 地址。

<!--
- **dnsConfig** (PodDNSConfig)

  Specifies the DNS parameters of a pod. Parameters specified here will be merged to the generated DNS configuration based on DNSPolicy.
-->
- **dnsConfig** (PodDNSConfig)

  指定 Pod 的 DNS 參數。此處指定的參數將被合併到基於 dnsPolicy 生成的 DNS 配置中。

  <a name="PodDNSConfig"></a>
  <!--
  *PodDNSConfig defines the DNS parameters of a pod in addition to those generated from DNSPolicy.*
  -->
  **PodDNSConfig 定義 Pod 的 DNS 參數，這些參數獨立於基於 dnsPolicy 生成的參數。**

  <!--
  - **dnsConfig.nameservers** ([]string)

    A list of DNS name server IP addresses. This will be appended to the base nameservers generated from DNSPolicy. Duplicated nameservers will be removed.
  -->

  - **dnsConfig.nameservers** ([]string)

    DNS 名字服務器的 IP 地址列表。此列表將被追加到基於 dnsPolicy 生成的基本名字服務器列表。
    重複的名字服務器將被刪除。

  <!--
  - **dnsConfig.options** ([]PodDNSConfigOption)

    A list of DNS resolver options. This will be merged with the base options generated from DNSPolicy. Duplicated entries will be removed. Resolution options given in Options will override those that appear in the base DNSPolicy.
  -->

  - **dnsConfig.options** ([]PodDNSConfigOption)

    DNS 解析器選項列表。此處的選項將與基於 dnsPolicy 所生成的基本選項合併。重複的條目將被刪除。
    options 中所給出的解析選項將覆蓋基本 dnsPolicy 中出現的對應選項。

    <a name="PodDNSConfigOption"></a>
    <!--
    *PodDNSConfigOption defines DNS resolver options of a pod.*
    -->

    **PodDNSConfigOption 定義 Pod 的 DNS 解析器選項。**

    <!--
    - **dnsConfig.options.name** (string)

      Required.

    - **dnsConfig.options.value** (string)
    -->

    - **dnsConfig.options.name** (string)

      必需字段。

    - **dnsConfig.options.value** (string)

      選項取值。

  <!--
  - **dnsConfig.searches** ([]string)

    A list of DNS search domains for host-name lookup. This will be appended to the base search paths generated from DNSPolicy. Duplicated search paths will be removed.
  -->

  - **dnsConfig.searches** ([]string)

    用於主機名查找的 DNS 搜索域列表。這一列表將被追加到基於 dnsPolicy 生成的基本搜索路徑列表。
    重複的搜索路徑將被刪除。

<!--
- **dnsPolicy** (string)

  Set DNS policy for the pod. Defaults to "ClusterFirst". Valid values are 'ClusterFirstWithHostNet', 'ClusterFirst', 'Default' or 'None'. DNS parameters given in DNSConfig will be merged with the policy selected with DNSPolicy. To have DNS options set along with hostNetwork, you have to specify DNS policy explicitly to 'ClusterFirstWithHostNet'.
-->
- **dnsPolicy** (string)

  爲 Pod 設置 DNS 策略。默認爲 `"ClusterFirst"`。
  有效值爲 `"ClusterFirstWithHostNet"`、`"ClusterFirst"`、`"Default"` 或 `"None"`。
  dnsConfig 字段中給出的 DNS 參數將與使用 dnsPolicy 字段所選擇的策略合併。
  要針對 hostNetwork 的 Pod 設置 DNS 選項，你必須將 DNS 策略顯式設置爲 `"ClusterFirstWithHostNet"`。

<!--
### Hosts namespaces
-->
### 主機名字空間

<!--
- **hostNetwork** (boolean)

  Host networking requested for this pod. Use the host's network namespace. If this option is set, the ports that will be used must be specified. Default to false.

- **hostPID** (boolean)

  Use the host's pid namespace. Optional: Default to false.
-->
- **hostNetwork** (boolean)

  爲此 Pod 請求主機層面聯網支持。使用主機的網絡名字空間。
  如果設置了此選項，則必須指定將使用的端口。默認爲 false。

- **hostPID** (boolean)

  使用主機的 PID 名字空間。可選：默認爲 false。

<!--
- **hostIPC** (boolean)

  Use the host's ipc namespace. Optional: Default to false.

- **shareProcessNamespace** (boolean)

  Share a single process namespace between all of the containers in a pod. When this is set containers will be able to view and signal processes from other containers in the same pod, and the first process in each container will not be assigned PID 1. HostPID and ShareProcessNamespace cannot both be set. Optional: Default to false.
-->
- **hostIPC** (boolean)

  使用主機的 IPC 名字空間。可選：默認爲 false。

- **shareProcessNamespace** (boolean)

  在 Pod 中的所有容器之間共享單個進程名字空間。設置了此字段之後，容器將能夠查看來自同一 Pod 中其他容器的進程併發出信號，
  並且每個容器中的第一個進程不會被分配 PID 1。`hostPID` 和 `shareProcessNamespace` 不能同時設置。
  可選：默認爲 false。

<!--
### Service account
-->
### 服務賬號

<!--
- **serviceAccountName** (string)

  ServiceAccountName is the name of the ServiceAccount to use to run this pod. More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/

- **automountServiceAccountToken** (boolean)

  AutomountServiceAccountToken indicates whether a service account token should be automatically mounted.
-->
- **serviceAccountName** (string)

  serviceAccountName 是用於運行此 Pod 的服務賬號的名稱。更多信息：
  https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/configure-service-account/

- **automountServiceAccountToken** (boolean)

  automountServiceAccountToken 指示是否應自動掛載服務帳戶令牌。

<!--
### Security context
-->
### 安全上下文

<!--
- **securityContext** (PodSecurityContext)

  SecurityContext holds pod-level security attributes and common container settings. Optional: Defaults to empty.  See type description for default values of each field.
-->

- **securityContext** (PodSecurityContext)

  SecurityContext 包含 Pod 級別的安全屬性和常見的容器設置。
  可選：默認爲空。每個字段的默認值見類型描述。

  <!--
  *PodSecurityContext holds pod-level security attributes and common container settings. Some fields are also present in container.securityContext.  Field values of container.securityContext take precedence over field values of PodSecurityContext.*
  -->

  <a name="PodSecurityContext"></a>
  **PodSecurityContext 包含 Pod 級別的安全屬性和常用容器設置。**
  **一些字段也存在於 `container.securityContext` 中。`container.securityContext`**
  **中的字段值優先於 PodSecurityContext 的字段值。**

  <!--
  - **securityContext.runAsUser** (int64)

    The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.runAsUser** (int64)

    運行容器進程入口點（Entrypoint）的 UID。如果未指定，則默認爲鏡像元數據中指定的用戶。
    也可以在 SecurityContext 中設置。
    如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在對應容器中所設置的 SecurityContext 值優先。
    注意，`spec.os.name` 爲 "windows" 時不能設置此字段。

  <!--
  - **securityContext.runAsNonRoot** (boolean)

    Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
  -->

  - **securityContext.runAsNonRoot** (boolean)

    指示容器必須以非 root 用戶身份運行。如果爲 true，kubelet 將在運行時驗證鏡像，
    以確保它不會以 UID 0（root）身份運行。如果鏡像中確實使用 root 賬號啓動，則容器無法被啓動。
    如果此字段未設置或爲 false，則不會執行此類驗證。也可以在 SecurityContext 中設置。
    如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext 中指定的值優先。

  <!--
  - **securityContext.runAsGroup** (int64)

    The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.runAsGroup** (int64)

    運行容器進程入口點（Entrypoint）的 GID。如果未設置，則使用運行時的默認值。
    也可以在 SecurityContext 中設置。如果同時在 SecurityContext 和 PodSecurityContext 中設置，
    則在對應容器中設置的 SecurityContext 值優先。
    注意，`spec.os.name` 爲 "windows" 時不能設置該字段。

  <!--
  - **securityContext.supplementalGroups** ([]int64)

    A list of groups applied to the first process run in each container, in addition to the container's primary GID, the fsGroup (if specified), and group memberships defined in the container image for the uid of the container process. If unspecified, no additional groups are added to any container. Note that group memberships defined in the container image for the uid of the container process are still effective, even if they are not included in this list. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.supplementalGroups** ([]int64)
  
    此字段包含將應用到每個容器中運行的第一個進程的組列表。
    容器進程的組成員身份取決於容器的主 GID、fsGroup（如果指定了的話）
    和在容器鏡像中爲容器進程的 uid 定義的組成員身份，以及這裏所給的列表。

    如果未指定，則不會向任何容器添加其他組。
    注意，在容器鏡像中爲容器進程的 uid 定義的組成員身份仍然有效，
    即使它們未包含在此列表中也是如此。
    注意，當 `spec.os.name` 爲 `windows` 時，不能設置此字段。

  <!--
  - **securityContext.fsGroup** (int64)

    A special supplemental group that applies to all containers in a pod. Some volume types allow the Kubelet to change the ownership of that volume to be owned by the pod:
    
    1. The owning GID will be the FSGroup 2. The setgid bit is set (new files created in the volume will be owned by FSGroup) 3. The permission bits are OR'd with rw-rw----
    
    If unset, the Kubelet will not modify the ownership and permissions of any volume. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.fsGroup** (int64)

    應用到 Pod 中所有容器的特殊補充組。某些卷類型允許 kubelet 將該卷的所有權更改爲由 Pod 擁有：
    
    1. 文件系統的屬主 GID 將是 fsGroup 字段值
    2. `setgid` 位已設置（在卷中創建的新文件將歸 fsGroup 所有）
    3. 權限位將與 `rw-rw----` 進行按位或操作
    
    如果未設置此字段，kubelet 不會修改任何卷的所有權和權限。
    注意，`spec.os.name` 爲 "windows" 時不能設置此字段。

  <!--
  - **securityContext.fsGroupChangePolicy** (string)

    fsGroupChangePolicy defines behavior of changing ownership and permission of the volume before being exposed inside Pod. This field will only apply to volume types which support fsGroup based ownership(and permissions). It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir. Valid values are "OnRootMismatch" and "Always". If not specified, "Always" is used. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.fsGroupChangePolicy** (string)

    fsGroupChangePolicy 定義了在卷被在 Pod 中暴露之前更改其屬主和權限的行爲。
    此字段僅適用於支持基於 fsGroup 的屬主權（和權限）的卷類型。它不會影響臨時卷類型，
    例如：`secret`、`configmap` 和 `emptydir`。
    有效值爲 `"OnRootMismatch"` 和 `"Always"`。如果未設置，則使用 `"Always"`。
    注意，`spec.os.name` 爲 "windows" 時不能設置此字段。

  <!--
  - **securityContext.seccompProfile** (SeccompProfile)

    The seccomp options to use by the containers in this pod. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.seccompProfile** (SeccompProfile)

    此 Pod 中的容器使用的 seccomp 選項。注意，`spec.os.name` 爲 "windows" 時不能設置此字段。

    <!--
    *SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.*
    -->

    **SeccompProfile 定義 Pod 或容器的 seccomp 配置文件設置。只能設置一個配置文件源。**

    <!--
    - **securityContext.seccompProfile.type** (string), required

      type indicates which kind of seccomp profile will be applied. Valid options are:
      
      Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.
    -->

    - **securityContext.seccompProfile.type** (string)，必需

      type 標明將應用哪種 seccomp 配置文件。有效的選項有：

      - `Localhost` - 應使用在節點上的文件中定義的配置文件。
      - `RuntimeDefault` - 應使用容器運行時默認配置文件。
      - `Unconfined` - 不應應用任何配置文件。

    <!--
    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must be set if type is "Localhost". Must NOT be set for any other type.
    -->

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile 指示應使用在節點上的文件中定義的配置文件。該配置文件必須在節點上預先配置才能工作。
      必須是相對於 kubelet 配置的 seccomp 配置文件位置的下降路徑。
      僅當 type 爲 `"Localhost"` 時才必須設置。不得爲任何其他類別設置此字段。

  <!--
  - **securityContext.seLinuxOptions** (SELinuxOptions)

    The SELinux context to be applied to all containers. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.seLinuxOptions** (SELinuxOptions)

    應用於所有容器的 SELinux 上下文。如果未設置，容器運行時將爲每個容器分配一個隨機 SELinux 上下文。
    也可以在 SecurityContext 中設置。
    如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在對應容器中設置的 SecurityContext 值優先。
    注意，`spec.os.name` 爲 "windows" 時不能設置該字段。

    <!--
    *SELinuxOptions are the labels to be applied to the container*
    -->

    <a name="SELinuxOptions"></a>
    **SELinuxOptions 是要應用於容器的標籤**

    <!--
    - **securityContext.seLinuxOptions.level** (string)

      Level is SELinux level label that applies to the container.

    - **securityContext.seLinuxOptions.role** (string)

      Role is a SELinux role label that applies to the container.

    - **securityContext.seLinuxOptions.type** (string)

      Type is a SELinux type label that applies to the container.

    - **securityContext.seLinuxOptions.user** (string)

      User is a SELinux user label that applies to the container.
    -->

    - **securityContext.seLinuxOptions.level** (string)

      level 是應用於容器的 SELinux 級別標籤。

    - **securityContext.seLinuxOptions.role** (string)

      role 是應用於容器的 SELinux 角色標籤。

    - **securityContext.seLinuxOptions.type** (string)

      type 是適用於容器的 SELinux 類型標籤。

    - **securityContext.seLinuxOptions.user** (string)

      user 是應用於容器的 SELinux 用戶標籤。

  <!--
  - **securityContext.sysctls** ([]Sysctl)

    Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported sysctls (by the container runtime) might fail to launch. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.sysctls** ([]Sysctl)

    sysctls 包含用於 Pod 的名字空間 sysctl 列表。具有不受（容器運行時）支持的 sysctl 的 Pod 可能無法啓動。
    注意，`spec.os.name` 爲 "windows" 時不能設置此字段。

    <!--
    *Sysctl defines a kernel parameter to be set*
    -->

    <a name="Sysctl"></a>
    **Sysctl 定義要設置的內核參數**

    <!--
    - **securityContext.sysctls.name** (string), required

      Name of a property to set

    - **securityContext.sysctls.value** (string), required

      Value of a property to set
    -->

    - **securityContext.sysctls.name** (string)，必需

      要設置的屬性的名稱。

    - **securityContext.sysctls.value** (string)，必需

      要設置的屬性值。

  <!--
  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    The Windows specific settings applied to all containers. If unspecified, the options within a container's SecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.
  -->

  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    要應用到所有容器上的、特定於 Windows 的設置。
    如果未設置此字段，將使用容器的 SecurityContext 中的選項。
    如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext 中指定的值優先。
    注意，`spec.os.name` 爲 "linux" 時不能設置該字段。

    <!--
    *WindowsSecurityContextOptions contain Windows-specific options and credentials.*
    -->

    <a name="WindowsSecurityContextOptions"></a>
    **WindowsSecurityContextOptions 包含特定於 Windows 的選項和憑據。**

    <!--
    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName is the name of the GMSA credential spec to use.
    -->

    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      gmsaCredentialSpec 是 [GMSA 准入 Webhook](https://github.com/kubernetes-sigs/windows-gmsa)
      內嵌由 gmsaCredentialSpecName 字段所指定的 GMSA 憑證規約內容的地方。

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      gmsaCredentialSpecName 是要使用的 GMSA 憑證規約的名稱。

    <!--
    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess determines if a container should be run as a 'Host Process' container. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers). In addition, if HostProcess is true then HostNetwork must also be set to true.
    -->

    - **securityContext.windowsOptions.hostProcess** (boolean)

      hostProcess 確定容器是否應作爲"主機進程"容器運行。
      一個 Pod 的所有容器必須具有相同的有效 hostProcess 值（不允許混合設置了 hostProcess
      的容器和未設置 hostProcess 容器）。
      此外，如果 hostProcess 爲 true，則 hostNetwork 也必須設置爲 true。

    <!--
    - **securityContext.windowsOptions.runAsUserName** (string)

      The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
    -->

    - **securityContext.windowsOptions.runAsUserName** (string)

      Windows 中用來運行容器進程入口點的用戶名。如果未設置，則默認爲鏡像元數據中指定的用戶。
      也可以在 PodSecurityContext 中設置。
      如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext 中指定的值優先。

<!--
### Alpha level
-->
### Alpha 級別

<!--
- **hostUsers** (boolean)

  Use the host's user namespace. Optional: Default to true. If set to true or not present, the pod will be run in the host user namespace, useful for when the pod needs a feature only available to the host user namespace, such as loading a kernel module with CAP_SYS_MODULE. When set to false, a new userns is created for the pod. Setting false is useful for mitigating container breakout vulnerabilities even allowing users to run their containers as root without actually having root privileges on the host. This field is alpha-level and is only honored by servers that enable the UserNamespacesSupport feature.
-->
- **hostUsers** (boolean)

  使用主機的用戶名字空間。可選：默認爲 true。如果設置爲 true 或不存在，則 Pod 將運行在主機的用戶名字空間中，
  當 Pod 需要僅對主機用戶名字空間可用的一個特性時這會很有用，例如使用 CAP_SYS_MODULE 加載內核模塊。
  當設置爲 false 時，會爲該 Pod 創建一個新的用戶名字空間。
  設置爲 false 對於緩解容器逃逸漏洞非常有用，可防止允許實際在主機上沒有 root 特權的用戶以 root 運行他們的容器。
  此字段是 Alpha 級別的字段，只有啓用 UserNamespacesSupport 特性的服務器才能使用此字段。

<!--
- **resourceClaims** ([]PodResourceClaim)

  *Patch strategies: retainKeys, merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
-->
- **resourceClaims** ([]PodResourceClaim)

  **補丁策略：retainKeys，基於鍵 `name` 合併**

  **映射：鍵 `name` 的唯一值將在合併過程中保留**

<!--
  ResourceClaims defines which ResourceClaims must be allocated and reserved before the Pod is allowed to start. The resources will be made available to those containers which consume them by name.
  
  This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.
  
  This field is immutable.
-->
  resourceClaims 定義了在允許 Pod 啓動之前必須分配和保留哪些 ResourceClaims。
  這些資源將可供那些按名稱使用它們的容器使用。

  這是一個 Alpha 特性的字段，需要啓用 DynamicResourceAllocation 特性門控來開啓此功能。

  此字段不可變更。

  <a name="PodResourceClaim"></a>
  <!--
  *PodResourceClaim references exactly one ResourceClaim through a ClaimSource. It adds a name to it that uniquely identifies the ResourceClaim inside the Pod. Containers that need access to the ResourceClaim reference it with this name.*
  -->
  **PodResourceClaim 通過 ClaimSource 引用一個 ResourceClaim。
  它爲 ClaimSource 添加一個名稱，作爲 Pod 內 ResourceClaim 的唯一標識。
  需要訪問 ResourceClaim 的容器可使用此名稱引用它。**

  <!--
  - **resourceClaims.name** (string), required

    Name uniquely identifies this resource claim inside the pod. This must be a DNS_LABEL.

  - **resourceClaims.source** (ClaimSource)

    Source describes where to find the ResourceClaim.
  -->
  - **resourceClaims.name** (string), 必需

    在 Pod 中，`name` 是此資源聲明的唯一標識。此字段值必須是 DNS_LABEL。

  - **resourceClaims.source** (ClaimSource)

    `source` 描述了在哪裏可以找到 `resourceClaim`。

    <a name="ClaimSource"></a>
    <!--
    *ClaimSource describes a reference to a ResourceClaim.
    
    Exactly one of these fields should be set.  Consumers of this type must treat an empty object as if it has an unknown value.*
    -->
    
    **ClaimSource 描述對 ResourceClaim 的引用。**

    **應該設置且僅設置如下字段之一。此類型的消費者必須將空對象視爲具有未知值。**

    <!--
    - **resourceClaims.source.resourceClaimName** (string)

      ResourceClaimName is the name of a ResourceClaim object in the same namespace as this pod.

    - **resourceClaims.source.resourceClaimTemplateName** (string)

      ResourceClaimTemplateName is the name of a ResourceClaimTemplate object in the same namespace as this pod.
    -->
    
    - **resourceClaims.source.resourceClaimName** (string)

      resourceClaimName 是與此 Pod 位於同一命名空間中的 ResourceClaim 對象的名稱。

    - **resourceClaims.source.resourceClaimTemplateName** (string)

      resourceClaimTemplateName 是與此 Pod 位於同一命名空間中的 `ResourceClaimTemplate` 對象的名稱。

      <!--
      The template will be used to create a new ResourceClaim, which will be bound to this pod. When this pod is deleted, the ResourceClaim will also be deleted. The pod name and resource name, along with a generated component, will be used to form a unique name for the ResourceClaim, which will be recorded in pod.status.resourceClaimStatuses.
      -->
    
      該模板將用於創建一個新的 ResourceClaim，新的 ResourceClaim 將被綁定到此 Pod。
      刪除此 Pod 時，ResourceClaim 也將被刪除。
      Pod 名稱和資源名稱，連同生成的組件，將用於爲 ResourceClaim 形成唯一名稱，
      該名稱將記錄在 pod.status.resourceClaimStatuses 中。

      <!--
      An existing ResourceClaim with that name that is not owned by the pod will not be used for the pod to avoid using an unrelated resource by mistake. Scheduling and pod startup are then blocked until the unrelated ResourceClaim is removed.
      -->
      
      不屬於此 Pod 但與此名稱重名的現有 ResourceClaim 不會被用於此 Pod，
      以避免錯誤地使用不相關的資源。Pod 的調度和啓動動作會因此而被阻塞，
      直到不相關的 ResourceClaim 被刪除。

      <!--
      This field is immutable and no changes will be made to the corresponding ResourceClaim by the control plane after creating the ResourceClaim.
      -->
      
      此字段是不可變更的，創建 ResourceClaim 後控制平面不會對相應的 ResourceClaim 進行任何更改。
<!--
- **schedulingGates** ([]PodSchedulingGate)

  *Patch strategy: merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
-->
- **schedulingGates** ([]PodSchedulingGate)

  **補丁策略：基於 `name` 鍵合併**

  **映射：鍵 `name` 的唯一值將在合併過程中保留**
   
  <!--
  SchedulingGates is an opaque list of values that if specified will block scheduling the pod. If schedulingGates is not empty, the pod will stay in the SchedulingGated state and the scheduler will not attempt to schedule the pod.

  SchedulingGates can only be set at pod creation time, and be removed only afterwards.
  
  This is an alpha-level feature enabled by PodSchedulingReadiness feature gate.
  -->
  
  schedulingGates 是一個不透明的值列表，如果指定，將阻止調度 Pod。
  如果 schedulingGates 不爲空，則 Pod 將保持 SchedulingGated 狀態，調度程序將不會嘗試調度 Pod。
 
  SchedulingGates 只能在 Pod 創建時設置，並且只能在創建之後刪除。 

  此特性爲 Beta 特性，需要通過 PodSchedulingReadiness 特性門控啓用。

  <a name="PodSchedulingGate"></a>
  <!--
  *PodSchedulingGate is associated to a Pod to guard its scheduling.*

  - **schedulingGates.name** (string), required

    Name of the scheduling gate. Each scheduling gate must have a unique name field.
  -->
  
  **PodSchedulingGate 與 Pod 相關聯以保護其調度。**

  - **schedulingGates.name** (string)，必需
  
    調度門控的名稱，每個調度門控的 `name` 字段取值必須唯一。


<!--
### Deprecated

- **serviceAccount** (string)

  DeprecatedServiceAccount is a depreciated alias for ServiceAccountName. Deprecated: Use serviceAccountName instead.
-->

### 已棄用

- **serviceAccount** (string)

  deprecatedServiceAccount 是 serviceAccountName 的棄用別名。此字段已被棄用：應改用 serviceAccountName。

<!--
## Container {#Container}

A single application container that you want to run within a pod.

<hr>

- **name** (string), required

  Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.
-->
## 容器 {#Container}

要在 Pod 中運行的單個應用容器。

<hr>

- **name** (string)，必需

  指定爲 DNS_LABEL 的容器的名稱。Pod 中的每個容器都必須有一個唯一的名稱 (DNS_LABEL)。無法更新。

<!--
### Image
-->
### 鏡像 {#image}

<!--
- **image** (string)

  Container image name. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.

- **imagePullPolicy** (string)

  Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images
-->

- **image** (string)

  容器鏡像名稱。更多信息： https://kubernetes.io/zh-cn/docs/concepts/containers/images。
  此字段是可選的，以允許更高層的配置管理進行默認設置或覆蓋工作負載控制器（如 Deployment 和 StatefulSets）
  中的容器鏡像。

- **imagePullPolicy** (string)

  鏡像拉取策略。`"Always"`、`"Never"`、`"IfNotPresent"` 之一。如果指定了 `:latest` 標籤，則默認爲 `"Always"`，
  否則默認爲 `"IfNotPresent"`。無法更新。更多信息： 
  https://kubernetes.io/zh-cn/docs/concepts/containers/images#updating-images

<!--
### Entrypoint
-->

### Entrypoint

<!--
- **command** ([]string)

  Entrypoint array. Not executed within a shell. The container image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
-->

- **command** ([]string)

  入口點數組。不在 Shell 中執行。如果未提供，則使用容器鏡像的 `ENTRYPOINT`。
  變量引用 `$(VAR_NAME)` 使用容器的環境進行擴展。如果無法解析變量，則輸入字符串中的引用將保持不變。
  `$$` 被簡化爲 `$`，這允許轉義 `$(VAR_NAME)` 語法：即 `"$$(VAR_NAME)" ` 將產生字符串字面值 `"$(VAR_NAME)"`。
  無論變量是否存在，轉義引用都不會被擴展。無法更新。更多信息： 
  https://kubernetes.io/zh-cn/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

<!--
- **args** ([]string)

  Arguments to the entrypoint. The container image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
-->

- **args** ([]string)

  entrypoint 的參數。如果未提供，則使用容器鏡像的 `CMD` 設置。變量引用 `$(VAR_NAME)` 使用容器的環境進行擴展。
  如果無法解析變量，則輸入字符串中的引用將保持不變。`$$` 被簡化爲 `$`，這允許轉義 `$(VAR_NAME)` 語法：
  即 `"$$(VAR_NAME)"` 將產生字符串字面值 `"$(VAR_NAME)"`。無論變量是否存在，轉義引用都不會被擴展。無法更新。
  更多信息： 
  https://kubernetes.io/zh-cn/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

<!--
- **workingDir** (string)

  Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.
-->

- **workingDir** (string)

  容器的工作目錄。如果未指定，將使用容器運行時的默認值，默認值可能在容器鏡像中配置。無法更新。

<!---
### Ports
-->

### 端口

<!--
- **ports** ([]ContainerPort)

  *Patch strategy: merge on key `containerPort`*
  
  *Map: unique values on keys `containerPort, protocol` will be kept during a merge*
  
  List of ports to expose from the container. Not specifying a port here DOES NOT prevent that port from being exposed. Any port which is listening on the default "0.0.0.0" address inside a container will be accessible from the network. Modifying this array with strategic merge patch may corrupt the data. For more information See https://github.com/kubernetes/kubernetes/issues/108255. Cannot be updated.

  *ContainerPort represents a network port in a single container.*
-->

- **ports**（[]ContainerPort）

  **補丁策略：基於 `containerPort` 鍵合併**
  
  **映射：鍵 `containerPort, protocol` 組合的唯一值將在合併期間保留**
  
  要從容器暴露的端口列表。此處不指定端口不會阻止該端口被暴露。
  任何偵聽容器內默認 `"0.0.0.0"` 地址的端口都可以從網絡訪問。使用策略合併補丁來修改此數組可能會破壞數據。
  更多細節請參閱 https://github.com/kubernetes/kubernetes/issues/108255。
  無法更新。

  <a name="ContainerPort"></a>
  **ContainerPort 表示單個容器中的網絡端口。**

  <!--
  - **ports.containerPort** (int32), required

    Number of port to expose on the pod's IP address. This must be a valid port number, 0 \< x \< 65536.

  - **ports.hostIP** (string)

    What host IP to bind the external port to.
  -->

  - **ports.containerPort** (int32)，必需

    要在 Pod 的 IP 地址上公開的端口號。這必須是有效的端口號，0 \< x \< 65536。

  - **ports.hostIP** (string)

    綁定外部端口的主機 IP。

  <!--
  - **ports.hostPort** (int32)

    Number of port to expose on the host. If specified, this must be a valid port number, 0 \< x \< 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.

  - **ports.name** (string)

    If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.
  -->

  - **ports.hostPort** (int32)

    要在主機上公開的端口號。如果指定，此字段必須是一個有效的端口號，0 \< x \< 65536。
    如果設置了 hostNetwork，此字段值必須與 containerPort 匹配。大多數容器不需要設置此字段。

  - **ports.name** (string)

    如果設置此字段，這必須是 IANA_SVC_NAME 並且在 Pod 中唯一。
    Pod 中的每個命名端口都必須具有唯一的名稱。服務可以引用的端口的名稱。

  <!--
  - **ports.protocol** (string)

    Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".
  -->

  - **ports.protocol** (string)

    端口協議。必須是 `UDP`、`TCP` 或 `SCTP`。默認爲 `TCP`。

<!--
### Environment variables
-->

### 環境變量

<!--
- **env** ([]EnvVar)

  *Patch strategy: merge on key `name`*
  
  List of environment variables to set in the container. Cannot be updated.
-->

- **env**（[]EnvVar）

  **補丁策略：基於 `name` 鍵合併**
  
  要在容器中設置的環境變量列表。無法更新。

  <!--
  *EnvVar represents an environment variable present in a Container.*
  -->
  <a name="EnvVar"></a>
  **EnvVar 表示容器中存在的環境變量。**

  <!--
  - **env.name** (string), required

    Name of the environment variable. Must be a C_IDENTIFIER.
  -->

  - **env.name** (string)，必需

    環境變量的名稱。必須是 C_IDENTIFIER。

  <!--
  - **env.value** (string)

    Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".
  -->

  - **env.value** (string)

    變量引用 `$(VAR_NAME)` 使用容器中先前定義的環境變量和任何服務環境變量進行擴展。
    如果無法解析變量，則輸入字符串中的引用將保持不變。
    `$$` 會被簡化爲 `$`，這允許轉義 `$(VAR_NAME)` 語法：即 `"$$(VAR_NAME)"` 將產生字符串字面值 `"$(VAR_NAME)"`。
    無論變量是否存在，轉義引用都不會被擴展。默認爲 ""。

  <!--
  - **env.valueFrom** (EnvVarSource)

    Source for the environment variable's value. Cannot be used if value is not empty.
  -->

  - **env.valueFrom** (EnvVarSource)

    環境變量值的來源。如果 value 值不爲空，則不能使用。

    <!--
    *EnvVarSource represents a source for the value of an EnvVar.*
    -->

    **EnvVarSource 表示 envVar 值的來源。**

    <!--
    - **env.valueFrom.configMapKeyRef** (ConfigMapKeySelector)

      Selects a key of a ConfigMap.
    -->

    - **env.valueFrom.configMapKeyRef** (ConfigMapKeySelector)

      選擇某個 ConfigMap 的一個主鍵。

      <!--
      - **env.valueFrom.configMapKeyRef.key** (string), required

        The key to select.

      - **env.valueFrom.configMapKeyRef.name** (string)

        Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.configMapKeyRef.optional** (boolean)

        Specify whether the ConfigMap or its key must be defined
      -->

      - **env.valueFrom.configMapKeyRef.key** (string)，必需

        要選擇的主鍵。

      - **env.valueFrom.configMapKeyRef.name** (string)

        被引用者的名稱。更多信息：
        https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.configMapKeyRef.optional** (boolean)

        指定 ConfigMap 或其主鍵是否必須已經定義。

    <!--
    - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['\<KEY>']`, `metadata.annotations['\<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.
    -->

    - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      選擇 Pod 的一個字段：支持 `metadata.name`、`metadata.namespace`、`metadata.labels['<KEY>']`、
      `metadata.annotations['<KEY>']`、`spec.nodeName`、`spec.serviceAccountName`、`status.hostIP`
      `status.podIP`、`status.podIPs`。

    <!--
    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported.
    -->

    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      選擇容器的資源：目前僅支持資源限制和請求（`limits.cpu`、`limits.memory`、`limits.ephemeral-storage`、
      `requests.cpu`、`requests.memory` 和 `requests.ephemeral-storage`）。

    <!--
    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      Selects a key of a secret in the pod's namespace
    -->

    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      在 Pod 的名字空間中選擇 Secret 的主鍵。

      <a name="SecretKeySelector"></a>
      <!--
      *SecretKeySelector selects a key of a Secret.*
      -->

      **SecretKeySelector 選擇一個 Secret 的主鍵。**

      <!--
      - **env.valueFrom.secretKeyRef.key** (string), required

        The key of the secret to select from.  Must be a valid secret key.

      - **env.valueFrom.secretKeyRef.name** (string)

        Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional** (boolean)

        Specify whether the Secret or its key must be defined
      -->

      - **env.valueFrom.secretKeyRef.key** (string)，必需

        要選擇的 Secret 的主鍵。必須是有效的主鍵。

      - **env.valueFrom.secretKeyRef.name** (string)

        被引用 Secret 的名稱。更多信息：
        https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional** (boolean)

        指定 Secret 或其主鍵是否必須已經定義。

<!--
- **envFrom** ([]EnvFromSource)

  List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.

-->
- **envFrom** ([]EnvFromSource)

  用來在容器中填充環境變量的數據源列表。在源中定義的鍵必須是 C_IDENTIFIER。
  容器啓動時，所有無效主鍵都將作爲事件報告。
  當一個鍵存在於多個源中時，與最後一個來源關聯的值將優先。
  由 env 定義的條目中，與此處鍵名重複者，以 env 中定義爲準。無法更新。

  <!--
  *EnvFromSource represents the source of a set of ConfigMaps*
  -->
  <a name="EnvFromSource"></a>
  **EnvFromSource 表示一組 ConfigMaps 的來源**

  <!--
  - **envFrom.configMapRef** (ConfigMapEnvSource)

    The ConfigMap to select from

    <a name="ConfigMapEnvSource"></a>
    *ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.
    
    The contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables.*
  -->

  - **envFrom.configMapRef** (ConfigMapEnvSource)

    要從中選擇主鍵的 ConfigMap。

    <a name="ConfigMapEnvSource"></a>
    ConfigMapEnvSource 選擇一個 ConfigMap 來填充環境變量。目標 ConfigMap 的
    data 字段的內容將鍵值對錶示爲環境變量。

    <!--
    - **envFrom.configMapRef.name** (string)

      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional** (boolean)

      Specify whether the ConfigMap must be defined
    -->

    - **envFrom.configMapRef.name** (string)

      被引用的 ConfigMap 的名稱。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional** (boolean)

      指定 ConfigMap 是否必須已經定義。

  <!--
  - **envFrom.prefix** (string)

    An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.

  - **envFrom.secretRef** (SecretEnvSource)

    The Secret to select from

    <a name="SecretEnvSource"></a>
    *SecretEnvSource selects a Secret to populate the environment variables with.
    
    The contents of the target Secret's Data field will represent the key-value pairs as environment variables.*
  -->

  - **envFrom.prefix** (string)

    附加到 ConfigMap 中每個鍵名之前的可選標識符。必須是 C_IDENTIFIER。

  - **envFrom.secretRef** (SecretEnvSource)

    要從中選擇主鍵的 Secret。

    SecretEnvSource 選擇一個 Secret 來填充環境變量。
    目標 Secret 的 data 字段的內容將鍵值對錶示爲環境變量。

    <!--
    - **envFrom.secretRef.name** (string)

      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional** (boolean)

      Specify whether the Secret must be defined
    -->

    - **envFrom.secretRef.name** (string)

      被引用 Secret 的名稱。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional** (boolean)

      指定 Secret 是否必須已經定義。

<!--
### Volumes
-->

### 卷

<!--
- **volumeMounts** ([]VolumeMount)

  *Patch strategy: merge on key `mountPath`*
  
  Pod volumes to mount into the container's filesystem. Cannot be updated.

  <a name="VolumeMount"></a>
  *VolumeMount describes a mounting of a Volume within a container.*
-->

- **volumeMounts** ([]VolumeMount)

  **補丁策略：基於 `mountPath` 鍵合併**
  
  要掛載到容器文件系統中的 Pod 卷。無法更新。

  VolumeMount 描述在容器中安裝卷。

  <!--
  - **volumeMounts.mountPath** (string), required

    Path within the container at which the volume should be mounted.  Must not contain ':'.

  - **volumeMounts.name** (string), required

    This must match the Name of a Volume.

  - **volumeMounts.mountPropagation** (string)

    mountPropagation determines how mounts are propagated from the host to container and the other way around. When not set, MountPropagationNone is used. This field is beta in 1.10.
  -->

  - **volumeMounts.mountPath** (string)，必需

    容器內卷的掛載路徑。不得包含 ':'。

  - **volumeMounts.name** (string)，必需

    此字段必須與卷的名稱匹配。

  - **volumeMounts.mountPropagation** (string)

    mountPropagation 確定掛載如何從主機傳播到容器，及如何反向傳播。
    如果未設置，則使用 `MountPropagationNone`。該字段在 1.10 中是 Beta 版。

  <!--
  - **volumeMounts.readOnly** (boolean)

    Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false.

  - **volumeMounts.subPath** (string)

    Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root).

  - **volumeMounts.subPathExpr** (string)

    Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to "" (volume's root). SubPathExpr and SubPath are mutually exclusive.
  -->

  - **volumeMounts.readOnly** (boolean)

    如果爲 true，則以只讀方式掛載，否則（false 或未設置）以讀寫方式掛載。默認爲 false。

  - **volumeMounts.subPath** (string)

    卷中的路徑，容器中的卷應該這一路徑安裝。默認爲 ""（卷的根）。

  - **volumeMounts.subPathExpr** (string)

    應安裝容器卷的卷內的擴展路徑。行爲類似於 subPath，但環境變量引用 `$(VAR_NAME)`
    使用容器的環境進行擴展。默認爲 ""（卷的根）。`subPathExpr` 和 `subPath` 是互斥的。

<!--
- **volumeDevices** ([]VolumeDevice)

  *Patch strategy: merge on key `devicePath`*
  
  volumeDevices is the list of block devices to be used by the container.

  <a name="VolumeDevice"></a>
  *volumeDevice describes a mapping of a raw block device within a container.*
-->

- **volumeDevices** ([]VolumeDevice)

  **補丁策略：基於 `devicePath` 鍵合併**
  
  volumeDevices 是容器要使用的塊設備列表。

  <a name="VolumeDevice"></a>
  volumeDevice 描述了容器內原始塊設備的映射。

  <!--
  - **volumeDevices.devicePath** (string), required

    devicePath is the path inside of the container that the device will be mapped to.

  - **volumeDevices.name** (string), required

    name must match the name of a persistentVolumeClaim in the pod
  -->

  - **volumeDevices.devicePath** (string)，必需

    devicePath 是設備將被映射到的容器內的路徑。

  - **volumeDevices.name** (string)，必需

    name 必須與 Pod 中的 persistentVolumeClaim 的名稱匹配

<!--
### Resources
-->

### 資源

<!--
- **resources** (ResourceRequirements)

  Compute Resources required by this container. Cannot be updated. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  <a name="ResourceRequirements"></a>
  *ResourceRequirements describes the compute resource requirements.*
-->

- **resources**（ResourceRequirements）

  此容器所需的計算資源。無法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

  ResourceRequirements 描述計算資源需求。

  <!--
  - **resources.claims** ([]ResourceClaim)

    *Map: unique values on key name will be kept during a merge*
    
    Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.
  -->
  
  - **resources.claims** ([]ResourceClaim)

    **映射：鍵 `name` 的唯一值將在合併過程中保留**

    claims 列出此容器使用的資源名稱，資源名稱在 `spec.resourceClaims` 中定義。

    <!--
    This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.
    
    This field is immutable. It can only be set for containers.
    -->
    
    這是一個 Alpha 特性字段，需要啓用 DynamicResourceAllocation 功能門控開啓此特性。

    此字段不可變更，只能在容器級別設置。

    <a name="ResourceClaim"></a>
    <!--
    *ResourceClaim references one entry in PodSpec.ResourceClaims.*

    - **resources.claims.name** (string), required

      Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.
    -->
    
      **ResourceClaim 引用 `PodSpec.resourceClaims` 中的一項。**

    - **resources.claims.name** (string)，必需
      
      `name` 必須與使用該字段 Pod 的 `pod.spec.resourceClaims`
      中的一個條目的名稱相匹配。它使該資源在容器內可用。

  <!--
  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
  -->

  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    limits 描述所允許的最大計算資源用量。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    requests 描述所需的最小計算資源量。如果容器省略了 requests，但明確設定了 limits，
    則 requests 默認值爲 limits 值，否則爲實現定義的值。請求不能超過限制。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

<!--
- **resizePolicy** ([]ContainerResizePolicy)

  *Atomic: will be replaced during a merge*
  
  Resources resize policy for the container.
-->
- **resizePolicy** ([]ContainerResizePolicy)

  **原子性: 將在合併期間被替換**

  容器的資源調整策略。

  <!--
  <a name="ContainerResizePolicy"></a>
  *ContainerResizePolicy represents resource resize policy for the container.*

  - **resizePolicy.resourceName** (string), required

    Name of the resource to which this resource resize policy applies. Supported values: cpu, memory.
  -->
  <a name="ContainerResizePolicy"></a>
  **ContainerResizePolicy 表示容器的資源大小調整策略**

  - **resizePolicy.resourceName** (string), 必需

    該資源調整策略適用的資源名稱。支持的值：cpu、memory。

  <!--
  - **resizePolicy.restartPolicy** (string), required

    Restart policy to apply when specified resource is resized. If not specified, it defaults to NotRequired.
  -->
  
  - **resizePolicy.restartPolicy** (string), 必需

    重啓策略，會在調整指定資源大小時使用該策略。如果未指定，則默認爲 NotRequired。

<!--
### Lifecycle
-->
### 生命週期

<!--
- **lifecycle** (Lifecycle)

  Actions that the management system should take in response to container lifecycle events. Cannot be updated.

  <a name="Lifecycle"></a>
  *Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted.*
-->

- **lifecycle** (Lifecycle)

  管理系統應對容器生命週期事件採取的行動。無法更新。

  Lifecycle 描述管理系統爲響應容器生命週期事件應採取的行動。
  對於 postStart 和 preStop 生命週期處理程序，容器的管理會阻塞，直到操作完成，
  除非容器進程失敗，在這種情況下處理程序被中止。

  <!--
  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
  -->

  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    創建容器後立即調用 postStart。如果處理程序失敗，則容器將根據其重新啓動策略終止並重新啓動。
    容器的其他管理阻塞直到鉤子完成。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

  <!--
  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PreStop is called immediately before a container is terminated due to an API request or management event such as liveness/startup probe failure, preemption, resource contention, etc. The handler is not called if the container crashes or exits. The Pod's termination grace period countdown begins before the PreStop hook is executed. Regardless of the outcome of the handler, the container will eventually terminate within the Pod's termination grace period (unless delayed by finalizers). Other management of the container blocks until the hook completes or until the termination grace period is reached. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
  -->

  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    preStop 在容器因 API 請求或管理事件（如存活態探針/啓動探針失敗、搶佔、資源爭用等）而終止之前立即調用。
    如果容器崩潰或退出，則不會調用處理程序。Pod 的終止寬限期倒計時在 preStop 鉤子執行之前開始。
    無論處理程序的結果如何，容器最終都會在 Pod 的終止寬限期內終止（除非被終結器延遲）。
    容器的其他管理會阻塞，直到鉤子完成或達到終止寬限期。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

<!--
- **terminationMessagePath** (string)

  Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.
-->

- **terminationMessagePath** (string)

  可選字段。掛載到容器文件系統的一個路徑，容器終止消息寫入到該路徑下的文件中。
  寫入的消息旨在成爲簡短的最終狀態，例如斷言失敗消息。如果大於 4096 字節，將被節點截斷。
  所有容器的總消息長度將限制爲 12 KB。默認爲 `/dev/termination-log`。無法更新。

<!--
- **terminationMessagePolicy** (string)

  Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.
-->
- **terminationMessagePolicy** (string)

  指示應如何填充終止消息。字段值 `File` 將使用 terminateMessagePath 的內容來填充成功和失敗的容器狀態消息。
  如果終止消息文件爲空並且容器因錯誤退出，`FallbackToLogsOnError` 將使用容器日誌輸出的最後一塊。
  日誌輸出限制爲 2048 字節或 80 行，以較小者爲準。默認爲 `File`。無法更新。

<!--
- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Periodic probe of container liveness. Container will be restarted if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
-->
- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  定期探針容器活躍度。如果探針失敗，容器將重新啓動。無法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#container-probes

<!--
- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
-->
- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  定期探測容器服務就緒情況。如果探針失敗，容器將被從服務端點中刪除。無法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#container-probes

<!--
- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  StartupProbe indicates that the Pod has successfully initialized. If specified, no other probes are executed until this completes successfully. If this probe fails, the Pod will be restarted, just as if the livenessProbe failed. This can be used to provide different probe parameters at the beginning of a Pod's lifecycle, when it might take a long time to load data or warm a cache, than during steady-state operation. This cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
-->
- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  startupProbe 表示 Pod 已成功初始化。如果設置了此字段，則此探針成功完成之前不會執行其他探針。
  如果這個探針失敗，Pod 會重新啓動，就像存活態探針失敗一樣。
  這可用於在 Pod 生命週期開始時提供不同的探針參數，此時加載數據或預熱緩存可能需要比穩態操作期間更長的時間。
  這無法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#container-probes

<!--
- **restartPolicy** (string)

  RestartPolicy defines the restart behavior of individual containers in a pod. This field may only be set for init containers, and the only allowed value is "Always". For non-init containers or when this field is not specified, the restart behavior is defined by the Pod's restart policy and the container type. Setting the RestartPolicy as "Always" for the init container will have the following effect: this init container will be continually restarted on exit until all regular containers have terminated. Once all regular containers have completed, all init containers with restartPolicy "Always" will be shut down. This lifecycle differs from normal init containers and is often referred to as a "sidecar" container. Although this init container still starts in the init container sequence, it does not wait for the container to complete before proceeding to the next init container. Instead, the next init container starts immediately after this init container is started, or after any startupProbe has successfully completed.
-->
- **restartPolicy** (string)

  restartPolicy 定義 Pod 中各個容器的重新啓動行爲。
  該字段僅適用於 Init 容器，唯一允許的值是 "Always"。
  對於非 Init 容器或未指定此字段的情況，重新啓動行爲由 Pod 的重啓策略和容器類型來定義。
  將 restartPolicy 設置爲 "Always" 會產生以下效果：該 Init 容器將在退出後持續重新啓動，直到所有常規容器終止。
  一旦所有常規容器已完成，所有具有 restartPolicy 爲 "Always" 的 Init 容器將被關閉。
  這種生命期與正常的 Init 容器不同，通常被稱爲 "sidecar" 容器。
  雖然此 Init 容器仍然在 Init 容器序列中啓動，但它在進入下一個 Init 容器之前並不等待容器完成。
  相反，在此 Init 容器被啓動後或在任意 startupProbe 已成功完成後下一個 Init 容器將立即啓動。

<!--
### Security Context
-->
### 安全上下文

<!--
- **securityContext** (SecurityContext)

  SecurityContext defines the security options the container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext. More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/

  <a name="SecurityContext"></a>
  *SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence.*
-->
- **securityContext** (SecurityContext)

  SecurityContext 定義了容器應該運行的安全選項。如果設置，SecurityContext 的字段將覆蓋
  PodSecurityContext 的等效字段。更多信息：
  https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/security-context/

  SecurityContext 保存將應用於容器的安全配置。某些字段在 SecurityContext 和 PodSecurityContext 中都存在。
  當兩者都設置時，SecurityContext 中的值優先。

  <!--
  - **securityContext.runAsUser** (int64)

    The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.runAsUser** (int64)

    運行容器進程入口點的 UID。如果未指定，則默認爲鏡像元數據中指定的用戶。
    也可以在 PodSecurityContext 中設置。
    如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext 中指定的值優先。
    注意，`spec.os.name` 爲 "windows" 時不能設置該字段。

  <!--
  - **securityContext.runAsNonRoot** (boolean)

    Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
  -->

  - **securityContext.runAsNonRoot** (boolean)

    指示容器必須以非 root 用戶身份運行。
    如果爲 true，kubelet 將在運行時驗證鏡像，以確保它不會以 UID 0（root）身份運行，如果是，則無法啓動容器。
    如果未設置或爲 false，則不會執行此類驗證。也可以在 PodSecurityContext 中設置。
    如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext 中指定的值優先。

  <!--
  - **securityContext.runAsGroup** (int64)

    The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.runAsGroup** (int64)

    運行容器進程入口點的 GID。如果未設置，則使用運行時默認值。也可以在 PodSecurityContext 中設置。
    如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext 中指定的值優先。
    注意，`spec.os.name` 爲 "windows" 時不能設置該字段。

  <!--
  - **securityContext.readOnlyRootFilesystem** (boolean)

    Whether this container has a read-only root filesystem. Default is false. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.readOnlyRootFilesystem** (boolean)

    此容器是否具有隻讀根文件系統。默認爲 false。注意，`spec.os.name` 爲 "windows" 時不能設置該字段。

  <!--
  - **securityContext.procMount** (string)

    procMount denotes the type of proc mount to use for the containers. The default is DefaultProcMount which uses the container runtime defaults for readonly paths and masked paths. This requires the ProcMountType feature flag to be enabled. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.procMount** (string)

    procMount 表示用於容器的 proc 掛載類型。默認值爲 `DefaultProcMount`，
    它針對只讀路徑和掩碼路徑使用容器運行時的默認值。此字段需要啓用 ProcMountType 特性門控。
    注意，`spec.os.name` 爲 "windows" 時不能設置此字段。

  <!--
  - **securityContext.privileged** (boolean)

    Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host. Defaults to false. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.privileged** (boolean)

    以特權模式運行容器。特權容器中的進程本質上等同於主機上的 root。默認爲 false。
    注意，`spec.os.name` 爲 "windows" 時不能設置此字段。

  <!--
  - **securityContext.allowPrivilegeEscalation** (boolean)

    AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process. This bool directly controls if the no_new_privs flag will be set on the container process. AllowPrivilegeEscalation is true always when the container is: 1) run as Privileged 2) has CAP_SYS_ADMIN Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.allowPrivilegeEscalation** (boolean)

    allowPrivilegeEscalation 控制進程是否可以獲得比其父進程更多的權限。此布爾值直接控制是否在容器進程上設置
    `no_new_privs` 標誌。allowPrivilegeEscalation 在容器處於以下狀態時始終爲 true：

    1. 以特權身份運行
    2. 具有 `CAP_SYS_ADMIN`

    請注意，當 `spec.os.name` 爲 "windows" 時，無法設置此字段。

  <!--
  - **securityContext.capabilities** (Capabilities)

    The capabilities to add/drop when running containers. Defaults to the default set of capabilities granted by the container runtime. Note that this field cannot be set when spec.os.name is windows.

    <a name="Capabilities"></a>

    *Adds and removes POSIX capabilities from running containers.*

    - **securityContext.capabilities.add** ([]string)

      Added capabilities

    - **securityContext.capabilities.drop** ([]string)

      Removed capabilities
  -->

  - **securityContext.capabilities** (Capabilities)

    運行容器時添加或放棄的權能（Capabilities）。默認爲容器運行時所授予的權能集合。
    注意，`spec.os.name` 爲 "windows" 時不能設置此字段。

    **在運行中的容器中添加和放棄 POSIX 權能。**

    - **securityContext.capabilities.add** ([]string)

      新增權能。

    - **securityContext.capabilities.drop** ([]string)

      放棄權能。

  <!--
  - **securityContext.seccompProfile** (SeccompProfile)

    The seccomp options to use by this container. If seccomp options are provided at both the pod & container level, the container options override the pod options. Note that this field cannot be set when spec.os.name is windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.*
  -->

  - **securityContext.seccompProfile** (SeccompProfile)

    此容器使用的 seccomp 選項。如果在 Pod 和容器級別都提供了 seccomp 選項，則容器級別的選項會覆蓋 Pod 級別的選項設置。
    注意，`spec.os.name` 爲 "windows" 時不能設置此字段。

    **SeccompProfile 定義 Pod 或容器的 seccomp 配置文件設置。只能設置一個配置文件源。**

    <!--
    - **securityContext.seccompProfile.type** (string), required

      type indicates which kind of seccomp profile will be applied. Valid options are:
      
      Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.
    --> 

    - **securityContext.seccompProfile.type** (string)，必需

      type 指示應用哪種 seccomp 配置文件。有效的選項有：
      
      - `Localhost` - 應使用在節點上的文件中定義的配置文件。
      - `RuntimeDefault` - 應使用容器運行時的默認配置文件。
      - `Unconfined` - 不應用任何配置文件。
     
    <!--
    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must be set if type is "Localhost". Must NOT be set for any other type.
    -->

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile 指示應使用的在節點上的文件，文件中定義了配置文件。
      該配置文件必須在節點上先行配置才能使用。
      必須是相對於 kubelet 所配置的 seccomp 配置文件位置下的下級路徑。
      僅當 type 爲 "Localhost" 時才必須設置。不得爲任何其他類別設置此字段。

  <!--
  - **securityContext.seLinuxOptions** (SELinuxOptions)

    The SELinux context to be applied to the container. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

    <a name="SELinuxOptions"></a>
    *SELinuxOptions are the labels to be applied to the container*
  -->

  - **securityContext.seLinuxOptions** (SELinuxOptions)

    要應用到容器上的 SELinux 上下文。如果未設置此字段，容器運行時將爲每個容器分配一個隨機的 SELinux 上下文。
    也可以在 PodSecurityContext 中設置。如果同時在 SecurityContext 和 PodSecurityContext 中設置，
    則在 SecurityContext 中指定的值優先。注意，`spec.os.name` 爲 "windows" 時不能設置此字段。

    <a name="SELinuxOptions"></a>
    **SELinuxOptions 是要應用到容器上的標籤。**

    <!--
    - **securityContext.seLinuxOptions.level** (string)

      Level is SELinux level label that applies to the container.

    - **securityContext.seLinuxOptions.role** (string)

      Role is a SELinux role label that applies to the container.

    - **securityContext.seLinuxOptions.type** (string)

      Type is a SELinux type label that applies to the container.

    - **securityContext.seLinuxOptions.user** (string)

      User is a SELinux user label that applies to the container.
    -->

    - **securityContext.seLinuxOptions.level** （string）

      level 是應用於容器的 SELinux 級別標籤。

    - **securityContext.seLinuxOptions.role** （string）

      role 是應用於容器的 SELinux 角色標籤。

    - **securityContext.seLinuxOptions.type** （string）

      type 是適用於容器的 SELinux 類型標籤。

    - **securityContext.seLinuxOptions.user** （string）

      user 是應用於容器的 SELinux 用戶標籤。

  <!--
  - **securityContext.windowsOptions** （WindowsSecurityContextOptions）

    The Windows specific settings applied to all containers. If unspecified, the options from the PodSecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions contain Windows-specific options and credentials.*
  -->

  - **securityContext.windowsOptions** （WindowsSecurityContextOptions）

    要應用於所有容器上的特定於 Windows 的設置。如果未指定，將使用 PodSecurityContext 中的選項。
    如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext 中指定的值優先。
    注意，`spec.os.name` 爲 "linux" 時不能設置此字段。

    <a name="WindowsSecurityContextOptions"></a>
    **WindowsSecurityContextOptions 包含特定於 Windows 的選項和憑據。**

    <!--
    - **securityContext.windowsOptions.gmsaCredentialSpec** （string）

      GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** （string）

      GMSACredentialSpecName is the name of the GMSA credential spec to use.
    -->

    - **securityContext.windowsOptions.gmsaCredentialSpec** （string）

      gmsaCredentialSpec 是 [GMSA 准入 Webhook](https://github.com/kubernetes-sigs/windows-gmsa)
      內嵌由 gmsaCredentialSpecName 字段所指定的 GMSA 憑證規約的內容的地方。

    <!--
    - **securityContext.windowsOptions.hostProcess** （boolean）

      HostProcess determines if a container should be run as a 'Host Process' container. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers).  In addition, if HostProcess is true then HostNetwork must also be set to true.
    -->

    - **securityContext.windowsOptions.hostProcess** （boolean）

      hostProcess 確定容器是否應作爲 "主機進程" 容器運行。
      一個 Pod 的所有容器必須具有相同的有效 hostProcess 值（不允許混合設置了 hostProcess 容器和未設置 hostProcess 的容器）。
      此外，如果 hostProcess 爲 true，則 hostNetwork 也必須設置爲 true。

    <!--
    - **securityContext.windowsOptions.runAsUserName** （string）

      The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
    -->

    - **securityContext.windowsOptions.runAsUserName** （string）

      Windows 中運行容器進程入口點的用戶名。如果未指定，則默認爲鏡像元數據中指定的用戶。
      也可以在 PodSecurityContext 中設置。
      如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext 中指定的值優先。

<!--
### Debugging
-->
### 調試

<!--
- **stdin** (boolean)

  Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.
-->
- **stdin** （boolean）

  此容器是否應在容器運行時爲 stdin 分配緩衝區。如果未設置，從容器中的 stdin 讀取將始終導致 EOF。
  默認爲 false。

<!--
- **stdinOnce** (boolean)

  Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false
-->
- **stdinOnce** （boolean）

  容器運行時是否應在某個 attach 打開 stdin 通道後關閉它。當 stdin 爲 true 時，stdin 流將在多個 attach 會話中保持打開狀態。
  如果 stdinOnce 設置爲 true，則 stdin 在容器啓動時打開，在第一個客戶端連接到 stdin 之前爲空，
  然後保持打開並接受數據，直到客戶端斷開連接，此時 stdin 關閉並保持關閉直到容器重新啓動。
  如果此標誌爲 false，則從 stdin 讀取的容器進程將永遠不會收到 EOF。默認爲 false。

<!--
- **tty** (boolean)

  Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.
-->
- **tty** （boolean）
  這個容器是否應該爲自己分配一個 TTY，同時需要設置 `stdin` 爲真。默認爲 false。

## EphemeralContainer {#EphemeralContainer}

<!--
An EphemeralContainer is a temporary container that you may add to an existing Pod for user-initiated activities such as debugging. Ephemeral containers have no resource or scheduling guarantees, and they will not be restarted when they exit or when a Pod is removed or restarted. The kubelet may evict a Pod if an ephemeral container causes the Pod to exceed its resource allocation.

To add an ephemeral container, use the ephemeralcontainers subresource of an existing Pod. Ephemeral containers may not be removed or restarted.
-->
EphemeralContainer 是一個臨時容器，你可以將其添加到現有 Pod 以用於用戶發起的活動，例如調試。
臨時容器沒有資源或調度保證，它們在退出或 Pod 被移除或重新啓動時不會重新啓動。
如果臨時容器導致 Pod 超出其資源分配，kubelet 可能會驅逐 Pod。

要添加臨時容器，請使用現有 Pod 的 `ephemeralcontainers` 子資源。臨時容器不能被刪除或重新啓動。

<hr>

<!--
- **name** (string), required

  Name of the ephemeral container specified as a DNS_LABEL. This name must be unique among all containers, init containers and ephemeral containers.
-->
- **name** (string)，必需

  以 DNS_LABEL 形式設置的臨時容器的名稱。此名稱在所有容器、Init 容器和臨時容器中必須是唯一的。

<!--
- **targetContainerName** (string)

  If set, the name of the container from PodSpec that this ephemeral container targets. The ephemeral container will be run in the namespaces (IPC, PID, etc) of this container. If not set then the ephemeral container uses the namespaces configured in the Pod spec.
  
  The container runtime must implement support for this feature. If the runtime does not support namespace targeting then the result of setting this field is undefined.
-->
- **targetContainerName** (string)

  如果設置，則爲 Pod 規約中此臨時容器所針對的容器的名稱。臨時容器將在該容器的名字空間（IPC、PID 等）中運行。
  如果未設置，則臨時容器使用 Pod 規約中配置的名字空間。
  
  容器運行時必須實現對此功能的支持。如果運行時不支持名字空間定位，則設置此字段的結果是未定義的。

<!--
### Image
-->
### 鏡像

<!--
- **image** (string)

  Container image name. More info: https://kubernetes.io/docs/concepts/containers/images
-->
- **image** (string)

  容器鏡像名稱。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/containers/images

<!--
- **imagePullPolicy** (string)

  Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images
-->
- **imagePullPolicy** (string)

  鏡像拉取策略。取值爲 `Always`、`Never`、`IfNotPresent` 之一。
  如果指定了 `:latest` 標籤，則默認爲 `Always`，否則默認爲 `IfNotPresent`。
  無法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/containers/images#updating-images

<!--
### Entrypoint
-->
### 入口點

<!--
- **command** ([]string)

  Entrypoint array. Not executed within a shell. The image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
-->
- **command** ([]string)

  入口點數組。不在 Shell 中執行。如果未提供，則使用鏡像的 `ENTRYPOINT`。
  變量引用 `$(VAR_NAME)` 使用容器的環境進行擴展。如果無法解析變量，則輸入字符串中的引用將保持不變。
  `$$` 被簡化爲 `$`，這允許轉義 `$(VAR_NAME)` 語法：即 `"$$(VAR_NAME)"` 將產生字符串字面值 `"$(VAR_NAME)"`。
  無論變量是否存在，轉義引用都不會被擴展。無法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

<!--
- **args** ([]string)

  Arguments to the entrypoint. The image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
-->
- **args** （[]string）

  entrypoint 的參數。如果未提供，則使用鏡像的 `CMD`。
  變量引用 `$(VAR_NAME)` 使用容器的環境進行擴展。如果無法解析變量，則輸入字符串中的引用將保持不變。
  `$$` 被簡化爲 `$`，這允許轉義 `$(VAR_NAME)` 語法：即 `"$$(VAR_NAME)"` 將產生字符串字面值 `"$(VAR_NAME)"`。
  無論變量是否存在，轉義引用都不會被擴展。無法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

<!--
- **workingDir** (string)

  Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.
-->
- **workingDir** (string)

  容器的工作目錄。如果未指定，將使用容器運行時的默認值，默認值可能在容器鏡像中配置。無法更新。

<!--
### Environment variables
-->
### 環境變量

<!--
- **env** ([]EnvVar)

  *Patch strategy: merge on key `name`*
  
  List of environment variables to set in the container. Cannot be updated.

  <a name="EnvVar"></a>
  *EnvVar represents an environment variable present in a Container.*
-->
- **env**（[]EnvVar）

  **補丁策略：基於 `name` 鍵合併**
  
  要在容器中設置的環境變量列表。無法更新。

  <a name="EnvVar"></a>
  **EnvVar 表示容器中存在的環境變量。**

  <!--
  - **env.name** (string), required

    Name of the environment variable. Must be a C_IDENTIFIER.

  - **env.value** (string)

    Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".
  -->

  - **env.name** (string)，必需

    環境變量的名稱。必須是 C_IDENTIFIER。

  - **env.value** (string)

    變量引用 `$(VAR_NAME)` 使用容器中先前定義的環境變量和任何服務環境變量進行擴展。
    如果無法解析變量，則輸入字符串中的引用將保持不變。
    `$$` 被簡化爲 `$`，這允許轉義 `$(VAR_NAME)` 語法：即 `"$$(VAR_NAME)"` 將產生字符串字面值 `"$(VAR_NAME)"`。
    無論變量是否存在，轉義引用都不會被擴展。默認爲 ""。

  <!--
  - **env.valueFrom** (EnvVarSource)

    Source for the environment variable's value. Cannot be used if value is not empty.

    <a name="EnvVarSource"></a>
    *EnvVarSource represents a source for the value of an EnvVar.*
  -->

  - **env.valueFrom** （EnvVarSource）

    環境變量值的來源。如果取值不爲空，則不能使用。

    **EnvVarSource 表示 envVar 值的源。**

    <!--
    - **env.valueFrom.configMapKeyRef** (ConfigMapKeySelector)

      Selects a key of a ConfigMap.

      <a name="ConfigMapKeySelector"></a>
      *Selects a key from a ConfigMap.*
    -->

    - **env.valueFrom.configMapKeyRef** （ConfigMapKeySelector）

      選擇 ConfigMap 的主鍵。

      <a name="ConfigMapKeySelector"></a>
      **選擇 ConfigMap 的主鍵。**

      <!--
      - **env.valueFrom.configMapKeyRef.key** (string), required

        The key to select.

      - **env.valueFrom.configMapKeyRef.name** (string)

        Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
      -->

      - **env.valueFrom.configMapKeyRef.key** (string)，必需

        選擇的主鍵。

      - **env.valueFrom.configMapKeyRef.name**（string）

        所引用 ConfigMap 的名稱。更多信息：
        https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      <!--
      - **env.valueFrom.configMapKeyRef.optional** (boolean)

        Specify whether the ConfigMap or its key must be defined
      -->

      - **env.valueFrom.configMapKeyRef.optional** （boolean）

        指定是否 ConfigMap 或其鍵必須已經被定義。

    <!--
    - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['\<KEY>']`, `metadata.annotations['\<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.
    -->

    - **env.valueFrom.fieldRef** （<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>）

      選擇 Pod 的一個字段：支持 `metadata.name`、`metadata.namespace`、`metadata.labels['<KEY>']`、
      `metadata.annotations['<KEY>']`、`spec.nodeName`、`spec.serviceAccountName`、`status.hostIP`、
      `status.podIP`、`status.podIPs`。

    <!--
    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported.
    -->

    - **env.valueFrom.resourceFieldRef** （<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>）

      選擇容器的資源：當前僅支持資源限制和請求（`limits.cpu`、`limits.memory`、`limits.ephemeral-storage`、
      `requests.cpu`、`requests.memory` 和 `requests.ephemeral-storage`）。

    <!--
    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      Selects a key of a secret in the pod's namespace

      <a name="SecretKeySelector"></a>
      *SecretKeySelector selects a key of a Secret.*
    -->

    - **env.valueFrom.secretKeyRef** （SecretKeySelector）

      在 Pod 的名字空間中選擇某 Secret 的主鍵。

      <a name="SecretKeySelector"></a>
      **SecretKeySelector 選擇某 Secret 的主鍵。**

      <!--
      - **env.valueFrom.secretKeyRef.key** (string), required

        The key of the secret to select from.  Must be a valid secret key.

      - **env.valueFrom.secretKeyRef.name** (string)

        Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional** (boolean)

        Specify whether the Secret or its key must be defined
      -->

      - **env.valueFrom.secretKeyRef.key** (string)，必需

        要從 Secret 中選擇的主鍵。必須是有效的主鍵。

      - **env.valueFrom.secretKeyRef.name**（string）

        被引用 Secret 名稱。更多信息：
        https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional** （boolean）

        指定 Secret 或其主鍵是否必須已經定義。

<!--
- **envFrom** （[]EnvFromSource）

  List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.

  <a name="EnvFromSource"></a>
  *EnvFromSource represents the source of a set of ConfigMaps*
-->
- **envFrom** （[]EnvFromSource）

  在容器中填充環境變量的來源列表。在來源中定義的鍵名必須是 C_IDENTIFIER。
  容器啓動時，所有無效鍵都將作爲事件報告。當一個鍵存在於多個來源中時，與最後一個來源關聯的值將優先。
  如果有重複主鍵，env 中定義的值將優先。無法更新。

  <a name="EnvFromSource"></a>
  **EnvFromSource 表示一組 ConfigMap 來源**

  <!--
  - **envFrom.configMapRef** (ConfigMapEnvSource)

    The ConfigMap to select from

    <a name="ConfigMapEnvSource"></a>
    *ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.
    
    The contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables.*
  -->

  - **envFrom.configMapRef** （ConfigMapEnvSource）

    要從中選擇的 ConfigMap。

    <a name="ConfigMapEnvSource"></a>
    **ConfigMapEnvSource 選擇一個 ConfigMap 來填充環境變量。目標 ConfigMap 的 data 字段的內容將鍵值對錶示爲環境變量。**

    <!--
    - **envFrom.configMapRef.name** (string)

      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional** (boolean)

      Specify whether the ConfigMap must be defined
    -->

    - **envFrom.configMapRef.name**（string）

      被引用的 ConfigMap 名稱。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional** （boolean）

      指定所引用的 ConfigMap 是否必須已經定義。

  <!--
  - **envFrom.prefix** (string)

    An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.
  -->

  - **envFrom.prefix** （string）

    要在 ConfigMap 中的每個鍵前面附加的可選標識符。必須是C_IDENTIFIER。

  <!--
  - **envFrom.secretRef** (SecretEnvSource)

    The Secret to select from

    <a name="SecretEnvSource"></a>
    *SecretEnvSource selects a Secret to populate the environment variables with.
    
    The contents of the target Secret's Data field will represent the key-value pairs as environment variables.*
  -->

  - **envFrom.secretRef** （SecretEnvSource）

    可供選擇的 Secret。

    <a name="SecretEnvSource"></a>
    **SecretEnvSource 選擇一個 Secret 來填充環境變量。目標 Secret 的 data 字段的內容將鍵值對錶示爲環境變量。**

    <!--
    - **envFrom.secretRef.name** (string)

      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional** (boolean)

      Specify whether the Secret must be defined
    -->

    - **envFrom.secretRef.name**（string）

      被引用 ConfigMap 的名稱。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional** （boolean）

      指定是否 Secret 必須已經被定義。

<!--
### Volumes
-->
### 卷

<!--
- **volumeMounts** ([]VolumeMount)

  *Patch strategy: merge on key `mountPath`*
  
  Pod volumes to mount into the container's filesystem. Subpath mounts are not allowed for ephemeral containers. Cannot be updated.

  <a name="VolumeMount"></a>
  *VolumeMount describes a mounting of a Volume within a container.*
-->

- **volumeMounts** ([]VolumeMount)

  **補丁策略：基於 `mountPath` 鍵合併**
  
  要掛載到容器文件系統中的 Pod 卷。臨時容器不允許子路徑掛載。無法更新。

  **VolumeMount 描述在容器中卷的掛載。**

  <!--
  - **volumeMounts.mountPath** (string), required

    Path within the container at which the volume should be mounted.  Must not contain ':'.

  - **volumeMounts.name** (string), required

    This must match the Name of a Volume.
  -->

  - **volumeMounts.mountPath** (string)，必需

    容器內應安裝卷的路徑。不得包含 ':'。

  - **volumeMounts.name** (string)，必需

    此字段必須與卷的名稱匹配。

  <!--
  - **volumeMounts.mountPropagation** (string)

    mountPropagation determines how mounts are propagated from the host to container and the other way around. When not set, MountPropagationNone is used. This field is beta in 1.10.

  - **volumeMounts.readOnly** (boolean)

    Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false.
  -->

  - **volumeMounts.mountPropagation** （string）

    mountPropagation 確定裝載如何從主機傳播到容器，及反向傳播選項。
    如果未設置，則使用 `None`。此字段在 1.10 中爲 Beta 字段。

  - **volumeMounts.readOnly** （boolean）

    如果爲 true，則掛載卷爲只讀，否則爲讀寫（false 或未指定）。默認值爲 false。

  <!--
  - **volumeMounts.subPath** (string)

    Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root).

  - **volumeMounts.subPathExpr** (string)

    Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to "" (volume's root). SubPathExpr and SubPath are mutually exclusive.
  -->

  - **volumeMounts.subPath** （string）

    卷中的路徑名，應該從該路徑掛在容器的卷。默認爲 "" （卷的根）。

  - **volumeMounts.subPathExpr** （string）

    應安裝容器卷的卷內的擴展路徑。行爲類似於 `subPath`，但環境變量引用 `$(VAR_NAME)`
    使用容器的環境進行擴展。默認爲 ""（卷的根）。`subPathExpr` 和 `SubPath` 是互斥的。

<!--
- **volumeDevices** ([]VolumeDevice)

  *Patch strategy: merge on key `devicePath`*
  
  volumeDevices is the list of block devices to be used by the container.

  <a name="VolumeDevice"></a>
  *volumeDevice describes a mapping of a raw block device within a container.*
-->
- **volumeDevices** ([]VolumeDevice)

  **補丁策略：基於 `devicePath` 鍵合併**
  
  volumeDevices 是容器要使用的塊設備列表。

  <a name="VolumeDevice"></a>
  **volumeDevice 描述容器內原始塊設備的映射。**

  <!--
  - **volumeDevices.devicePath** (string), required

    devicePath is the path inside of the container that the device will be mapped to.

  - **volumeDevices.name** (string), required

    name must match the name of a persistentVolumeClaim in the pod
  -->

  - **volumeDevices.devicePath** (string)，必需

    devicePath 是設備將被映射到的容器內的路徑。

  - **volumeDevices.name** (string)，必需

    name 必須與 Pod 中的 persistentVolumeClaim 的名稱匹配。

<!--
- **resizePolicy** ([]ContainerResizePolicy)

  *Atomic: will be replaced during a merge*
  
  Resources resize policy for the container.
-->
- **resizePolicy** ([]ContainerResizePolicy)

  **原子性: 將在合併期間被替換**

  容器的資源調整策略。

  <!--
  <a name="ContainerResizePolicy"></a>
  *ContainerResizePolicy represents resource resize policy for the container.*

  - **resizePolicy.resourceName** (string), required

    Name of the resource to which this resource resize policy applies. Supported values: cpu, memory.
  -->
  <a name="ContainerResizePolicy"></a>
  **ContainerResizePolicy 表示容器的資源大小調整策略**

  - **resizePolicy.resourceName** (string), 必需

    該資源調整策略適用的資源名稱。支持的值：cpu、memory。

  <!--
  - **resizePolicy.restartPolicy** (string), required

    Restart policy to apply when specified resource is resized. If not specified, it defaults to NotRequired.
  -->
  
  - **resizePolicy.restartPolicy** (string), 必需

    重啓策略，會在調整指定資源大小時使用該策略。如果未指定，則默認爲 NotRequired。

<!--
### Lifecycle
-->
### 生命週期

<!--
- **terminationMessagePath** (string)

  Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.
-->
- **terminationMessagePath** (string)

  可選字段。掛載到容器文件系統的路徑，用於寫入容器終止消息的文件。
  寫入的消息旨在成爲簡短的最終狀態，例如斷言失敗消息。如果超出 4096 字節，將被節點截斷。
  所有容器的總消息長度將限制爲 12 KB。默認爲 `/dev/termination-log`。無法更新。

<!--
- **terminationMessagePolicy** (string)

  Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.
-->
- **terminationMessagePolicy** (string)

  指示應如何填充終止消息。字段值爲 `File` 表示將使用 `terminateMessagePath`
  的內容來填充成功和失敗的容器狀態消息。
  如果終止消息文件爲空並且容器因錯誤退出，字段值 `FallbackToLogsOnError`
  表示將使用容器日誌輸出的最後一塊。日誌輸出限制爲 2048 字節或 80 行，以較小者爲準。
  默認爲 `File`。無法更新。

<!--
- **restartPolicy** (string)

  Restart policy for the container to manage the restart behavior of each container within a pod. This may only be set for init containers. You cannot set this field on ephemeral containers.
-->
- **restartPolicy** (string)

  這是針對容器的重啓策略，用於管理 Pod 內每個容器的重啓行爲。
  此字段僅適用於 Init 容器，在臨時容器上無法設置此字段。

<!--
### Debugging
-->
### 調試

<!--
- **stdin** (boolean)

  Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.
-->
- **stdin** （boolean）

  是否應在容器運行時內爲此容器 stdin 分配緩衝區。
  如果未設置，從容器中的 stdin 讀數據將始終導致 EOF。默認爲 false。

<!--
- **stdinOnce** (boolean)

  Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false
-->
- **stdinOnce** （boolean）

  容器運行時是否應在某個 attach 操作打開 stdin 通道後關閉它。
  當 stdin 爲 true 時，stdin 流將在多個 attach 會話中保持打開狀態。
  如果 stdinOnce 設置爲 true，則 stdin 在容器啓動時打開，在第一個客戶端連接到 stdin 之前爲空，
  然後保持打開並接受數據，直到客戶端斷開連接，此時 stdin 關閉並保持關閉直到容器重新啓動。
  如果此標誌爲 false，則從 stdin 讀取的容器進程將永遠不會收到 EOF。默認爲 false。

<!--
- **tty** (boolean)

  Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.
-->
- **tty** (boolean)

  這個容器是否應該爲自己分配一個 TTY，也需要 stdin 爲 true。默認爲 false。

<!--
### 安全上下文
-->
### 安全上下文

<!--
- **securityContext** (SecurityContext)

  Optional: SecurityContext defines the security options the ephemeral container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext.

  <a name="SecurityContext"></a>
  *SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence.*
-->
- **securityContext** (SecurityContext)

  可選字段。securityContext 定義了運行臨時容器的安全選項。
  如果設置了此字段，SecurityContext 的字段將覆蓋 PodSecurityContext 的等效字段。

  SecurityContext 保存將應用於容器的安全配置。
  一些字段在 SecurityContext 和 PodSecurityContext 中都存在。
  當兩者都設置時，SecurityContext 中的值優先。

  <!--
  - **securityContext.runAsUser** (int64)

    The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.runAsUser** （int64）

    運行容器進程入口點的 UID。如果未指定，則默認爲鏡像元數據中指定的用戶。
    也可以在 PodSecurityContext 中設置。如果同時在 SecurityContext 和 PodSecurityContext
    中設置，則在 SecurityContext 中指定的值優先。
    注意，`spec.os.name` 爲 "windows" 時不能設置該字段。

  <!--
  - **securityContext.runAsNonRoot** (boolean)

    Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
  -->

  - **securityContext.runAsNonRoot** （boolean）

    指示容器必須以非 root 用戶身份運行。如果爲 true，Kubelet 將在運行時驗證鏡像，
    以確保它不會以 UID 0（root）身份運行，如果是，則無法啓動容器。
    如果未設置或爲 false，則不會執行此類驗證。也可以在 PodSecurityContext 中設置。
    如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext
    中指定的值優先。

  <!--
  - **securityContext.runAsGroup** (int64)

    The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.runAsGroup** （int64）

    運行容器進程入口點的 GID。如果未設置，則使用運行時默認值。也可以在 PodSecurityContext 中設置。
    如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext
    中指定的值優先。注意，`spec.os.name` 爲 "windows" 時不能設置該字段。

  <!--
  - **securityContext.readOnlyRootFilesystem** (boolean)

    Whether this container has a read-only root filesystem. Default is false. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.readOnlyRootFilesystem** （boolean）

    此容器是否具有隻讀根文件系統。
    默認爲 false。注意，`spec.os.name` 爲 "windows" 時不能設置該字段。

  <!--
  - **securityContext.procMount** (string)

    procMount denotes the type of proc mount to use for the containers. The default is DefaultProcMount which uses the container runtime defaults for readonly paths and masked paths. This requires the ProcMountType feature flag to be enabled. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.procMount** （string）

    procMount 表示用於容器的 proc 掛載類型。默認值爲 DefaultProcMount，
    它將容器運行時默認值用於只讀路徑和掩碼路徑。這需要啓用 ProcMountType 特性門控。
    注意，`spec.os.name` 爲 "windows" 時不能設置該字段。

  <!--
  - **securityContext.privileged** (boolean)

    Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host. Defaults to false. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.privileged** （boolean）

    以特權模式運行容器。特權容器中的進程本質上等同於主機上的 root。默認爲 false。
    注意，`spec.os.name` 爲 "windows" 時不能設置該字段。

  <!--
  - **securityContext.allowPrivilegeEscalation** (boolean)

    AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process. This bool directly controls if the no_new_privs flag will be set on the container process. AllowPrivilegeEscalation is true always when the container is: 1) run as Privileged 2) has CAP_SYS_ADMIN Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.allowPrivilegeEscalation** （boolean）

    allowPrivilegeEscalation 控制進程是否可以獲得比其父進程更多的權限。
    此布爾值直接控制是否在容器進程上設置 `no_new_privs` 標誌。allowPrivilegeEscalation
    在容器處於以下狀態時始終爲 true：

    1. 以特權身份運行
    2. 具有 `CAP_SYS_ADMIN` 權能

    請注意，當 `spec.os.name` 爲 "windows" 時，無法設置此字段。

  <!--
  - **securityContext.capabilities** (Capabilities)

    The capabilities to add/drop when running containers. Defaults to the default set of capabilities granted by the container runtime. Note that this field cannot be set when spec.os.name is windows.

    <a name="Capabilities"></a>
    *Adds and removes POSIX capabilities from running containers.*
  -->

  - **securityContext.capabilities** (Capabilities)

    運行容器時添加/放棄的權能。默認爲容器運行時授予的默認權能集。
    注意，`spec.os.name` 爲 "windows" 時不能設置此字段。

    **在運行中的容器中添加和放棄 POSIX 權能。**

    <!--
    - **securityContext.capabilities.add** ([]string)

      Added capabilities

    - **securityContext.capabilities.drop** ([]string)

      Removed capabilities
    -->

    - **securityContext.capabilities.add** （[]string）

      新增的權能。

    - **securityContext.capabilities.drop** （[]string）

      放棄的權能。

  <!--
  - **securityContext.seccompProfile** (SeccompProfile)

    The seccomp options to use by this container. If seccomp options are provided at both the pod & container level, the container options override the pod options. Note that this field cannot be set when spec.os.name is windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.*
  -->

  - **securityContext.seccompProfile** （SeccompProfile）

    此容器使用的 seccomp 選項。如果在 Pod 和容器級別都提供了 seccomp 選項，
    則容器選項會覆蓋 Pod 選項。注意，`spec.os.name` 爲 "windows" 時不能設置該字段。

    **SeccompProfile 定義 Pod 或容器的 seccomp 配置文件設置。只能設置一個配置文件源。**

    <!--
    - **securityContext.seccompProfile.type** (string), required

      type indicates which kind of seccomp profile will be applied. Valid options are:
      
      Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.
    --> 

    - **securityContext.seccompProfile.type** (string)，必需

      type 指示將應用哪種 seccomp 配置文件。有效的選項是：
      
      - `Localhost` - 應使用在節點上的文件中定義的配置文件。
      - `RuntimeDefault` - 應使用容器運行時默認配置文件。
      - `Unconfined` - 不應應用任何配置文件。

    <!--
    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must be set if type is "Localhost". Must NOT be set for any other type.
    -->
     
    - **securityContext.seccompProfile.localhostProfile** （string）

      localhostProfile 指示應使用在節點上的文件中定義的配置文件。
      該配置文件必須在節點上預先配置才能工作。
      必須是相對於 kubelet 配置的 seccomp 配置文件位置下的子路徑。
      僅當 type 爲 "Localhost" 時才必須設置。不得爲任何其他類別設置此字段。

  <!--
  - **securityContext.seLinuxOptions** (SELinuxOptions)

    The SELinux context to be applied to the container. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

    <a name="SELinuxOptions"></a>
    *SELinuxOptions are the labels to be applied to the container*
  -->

  - **securityContext.seLinuxOptions** （SELinuxOptions）

    要應用於容器的 SELinux 上下文。如果未指定，容器運行時將爲每個容器分配一個隨機
    SELinux 上下文。也可以在 PodSecurityContext 中設置。
    如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext
    中指定的值優先。注意，`spec.os.name` 爲 "windows" 時不能設置此字段。

    <a name="SELinuxOptions"></a>
    **SELinuxOptions 是要應用於容器的標籤**

    <!--
    - **securityContext.seLinuxOptions.level** (string)

      Level is SELinux level label that applies to the container.

    - **securityContext.seLinuxOptions.role** (string)

      Role is a SELinux role label that applies to the container.

    - **securityContext.seLinuxOptions.type** (string)

      Type is a SELinux type label that applies to the container.

    - **securityContext.seLinuxOptions.user** (string)

      User is a SELinux user label that applies to the container.
    -->

    - **securityContext.seLinuxOptions.level** （string）

      level 是應用於容器的 SELinux 級別標籤。

    - **securityContext.seLinuxOptions.role** （string）

      role 是應用於容器的 SELinux 角色標籤。

    - **securityContext.seLinuxOptions.type** （string）

      type 是適用於容器的 SELinux 類型標籤。

    - **securityContext.seLinuxOptions.user** （string）

      user 是應用於容器的 SELinux 用戶標籤。

  <!--
  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    The Windows specific settings applied to all containers. If unspecified, the options from the PodSecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions contain Windows-specific options and credentials.*
  -->

  - **securityContext.windowsOptions** （WindowsSecurityContextOptions）

    要應用到所有容器上的特定於 Windows 的設置。如果未指定，將使用 PodSecurityContext 中的選項。
    如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext
    中指定的值優先。注意，`spec.os.name` 爲 "linux" 時不能設置此字段。

    <a name="WindowsSecurityContextOptions"></a>
    **WindowsSecurityContextOptions 包含特定於 Windows 的選項和憑據。**

    <!--
    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName is the name of the GMSA credential spec to use.
    -->

    - **securityContext.windowsOptions.gmsaCredentialSpec** （string）

      gmsaCredentialSpec 是 [GMSA 准入 Webhook](https://github.com/kubernetes-sigs/windows-gmsa)
      內嵌由 gmsaCredentialSpecName 字段所指定的 GMSA 憑證規約內容的地方。

    - **securityContext.windowsOptions.gmsaCredentialSpecName** （string）

      gmsaCredentialSpecName 是要使用的 GMSA 憑證規約的名稱。

    <!--
    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess determines if a container should be run as a 'Host Process' container. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers).  In addition, if HostProcess is true then HostNetwork must also be set to true.
    -->

    - **securityContext.windowsOptions.hostProcess** （boolean）

      hostProcess 確定容器是否應作爲 "主機進程" 容器運行。
      一個 Pod 的所有容器必須具有相同的有效 hostProcess 值
      （不允許混合設置了 hostProcess 的容器和未設置 hostProcess 的容器）。
      此外，如果 hostProcess 爲 true，則 hostNetwork 也必須設置爲 true。

    <!--
    - **securityContext.windowsOptions.runAsUserName** (string)

      The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
    -->

    - **securityContext.windowsOptions.runAsUserName** （string）

      Windows 中運行容器進程入口點的用戶名。如果未指定，則默認爲鏡像元數據中指定的用戶。
      也可以在 PodSecurityContext 中設置。如果同時在 SecurityContext 和 PodSecurityContext
      中設置，則在 SecurityContext 中指定的值優先。

<!--
### Not allowed
-->
### 不允許

<!--
- **ports** ([]ContainerPort)

  *Patch strategy: merge on key `containerPort`*
  
  *Map: unique values on keys `containerPort, protocol` will be kept during a merge*
  
  Ports are not allowed for ephemeral containers.

  <a name="ContainerPort"></a>
  *ContainerPort represents a network port in a single container.*
-->

- **ports**（[]ContainerPort）

  **補丁策略：基於 `containerPort` 鍵合併**
  
  **映射：鍵 `containerPort, protocol` 組合的唯一值將在合併期間保留**
  
  臨時容器不允許使用端口。

  <a name="ContainerPort"></a>
  **ContainerPort 表示單個容器中的網絡端口。**

  <!--
  - **ports.containerPort** (int32), required

    Number of port to expose on the pod's IP address. This must be a valid port number, 0 \< x \< 65536.

  - **ports.hostIP** (string)

    What host IP to bind the external port to.
  -->

  - **ports.containerPort** （int32），必需

    要在容器的 IP 地址上公開的端口號。這必須是有效的端口號 0 \< x \< 65536。

  - **ports.hostIP** （string）

    要將外部端口綁定到的主機 IP。

  <!--
  - **ports.hostPort** (int32)

    Number of port to expose on the host. If specified, this must be a valid port number, 0 \< x \< 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.
  -->

  - **ports.hostPort** （int32）

    要在主機上公開的端口號。如果設置了，則作爲必須是一個有效的端口號，0 \< x \< 65536。
    如果指定了 hostNetwork，此值必須與 containerPort 匹配。大多數容器不需要這個配置。

  <!--
  - **ports.name** (string)

    If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.

  - **ports.protocol** (string)

    Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".
  -->
 
  - **ports.name**（string）

    如果指定了，則作爲端口的名稱。必須是 IANA_SVC_NAME 並且在 Pod 中是唯一的。
    Pod 中的每個命名端口都必須具有唯一的名稱。服務可以引用的端口的名稱。

  - **ports.protocol** （string）

    端口協議。必須是 `UDP`、`TCP` 或 `SCTP` 之一。默認爲 `TCP`。

<!--
- **resources** (ResourceRequirements)

  Resources are not allowed for ephemeral containers. Ephemeral containers use spare resources already allocated to the pod.

  <a name="ResourceRequirements"></a>
  *ResourceRequirements describes the compute resource requirements.*
-->
- **resources** (ResourceRequirements)

  臨時容器不允許使用資源。臨時容器使用已分配給 Pod 的空閒資源。

  **ResourceRequirements 描述計算資源的需求。**

  <!--
  - **resources.claims** ([]ResourceClaim)

    *Map: unique values on key name will be kept during a merge*
    
    Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.
  -->
  
  - **resources.claims** ([]ResourceClaim)

    **映射：鍵 `name` 的唯一值將在合併過程中保留**

    claims 列出了此容器使用的資源名稱，資源名稱在 `spec.resourceClaims` 中定義。

    <!--
    This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.
    
    This field is immutable. It can only be set for containers.
    -->
    
    這是一個 Alpha 特性字段，需要啓用 DynamicResourceAllocation 功能門控開啓此特性。

    此字段不可變更，只能在容器級別設置。

    <a name="ResourceClaim"></a>
    <!--
    *ResourceClaim references one entry in PodSpec.ResourceClaims.*

    - **resources.claims.name** (string), required

      Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.
    -->
    
    **ResourceClaim 引用 `PodSpec.ResourceClaims` 中的一項。**

    - **resources.claims.name** (string)，必需
      
      `name` 必須與使用該字段 Pod 的 `pod.spec.resourceClaims`
      中的一個條目的名稱相匹配。它使該資源在容器內可用。

  <!--
  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
  -->

  - **resources.limits** （map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>）

    limits 描述所允許的最大計算資源量。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

  <!--
  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
  -->

  - **resources.requests** （map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>）

    requests 描述所需的最小計算資源量。如果對容器省略了 requests，則默認其資源請求值爲 limits
    （如果已顯式指定）的值，否則爲實現定義的值。請求不能超過限制。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

<!--
- **lifecycle** (Lifecycle)

  Lifecycle is not allowed for ephemeral containers.

  <a name="Lifecycle"></a>
  *Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted.*
-->
- **lifecycle** (Lifecycle)

  臨時容器不允許使用生命週期。

  生命週期描述了管理系統爲響應容器生命週期事件應採取的行動。
  對於 postStart 和 preStop 生命週期處理程序，容器的管理會阻塞，直到操作完成，
  除非容器進程失敗，在這種情況下處理程序被中止。

  <!--
  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
  -->

  - **lifecycle.postStart** （<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>）

    創建容器後立即調用 postStart。如果處理程序失敗，則容器將根據其重新啓動策略終止並重新啓動。
    容器的其他管理阻塞直到鉤子完成。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

  <!--
  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PreStop is called immediately before a container is terminated due to an API request or management event such as liveness/startup probe failure, preemption, resource contention, etc. The handler is not called if the container crashes or exits. The Pod's termination grace period countdown begins before the PreStop hook is executed. Regardless of the outcome of the handler, the container will eventually terminate within the Pod's termination grace period (unless delayed by finalizers). Other management of the container blocks until the hook completes or until the termination grace period is reached. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
  -->

  - **lifecycle.preStop** （<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>）

    preStop 在容器因 API 請求或管理事件（例如：存活態探針/啓動探針失敗、搶佔、資源爭用等）
    而終止之前立即調用。如果容器崩潰或退出，則不會調用處理程序。
    Pod 的終止寬限期倒計時在 preStop 鉤子執行之前開始。
    無論處理程序的結果如何，容器最終都會在 Pod 的終止寬限期內終止（除非被終結器延遲）。
    容器的其他管理會阻塞，直到鉤子完成或達到終止寬限期。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

<!--
- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Probes are not allowed for ephemeral containers.

- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Probes are not allowed for ephemeral containers.

- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Probes are not allowed for ephemeral containers.
-->

- **livenessProbe** （<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>）

  臨時容器不允許使用探針。

- **readyProbe** （<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>）

  臨時容器不允許使用探針。

- **startupProbe** （<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>）

  臨時容器不允許使用探針。


## LifecycleHandler {#LifecycleHandler}

<!--
LifecycleHandler defines a specific action that should be taken in a lifecycle hook. One and only one of the fields, except TCPSocket must be specified.
-->
LifecycleHandler 定義了應在生命週期掛鉤中執行的特定操作。
必須指定一個且只能指定一個字段，tcpSocket 除外。

<hr>

<!--
- **exec** (ExecAction)

  Exec specifies the action to take.

  <a name="ExecAction"></a>
  *ExecAction describes a "run in container" action.*
-->
- **exec** （execAction）

  Exec 指定要執行的操作。

  <a name="ExecAction"></a>
  **ExecAction 描述了 "在容器中運行" 操作。**

  <!--
  - **exec.command** ([]string)

    Command is the command line to execute inside the container, the working directory for the command  is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.
  -->

  - **exec.command** （[]string）

    command 是要在容器內執行的命令行，命令的工作目錄是容器文件系統中的根目錄（'/'）。
    該命令只是被通過 `exec` 執行，而不會單獨啓動一個 Shell 來運行，因此傳統的
    Shell 指令（'|' 等）將不起作用。要使用某 Shell，你需要顯式調用該 Shell。
    退出狀態 0 被視爲活動/健康，非零表示不健康。

<!--
- **httpGet** (HTTPGetAction)

  HTTPGet specifies the http request to perform.

  <a name="HTTPGetAction"></a>
  *HTTPGetAction describes an action based on HTTP Get requests.*
-->

- **httpGet** （HTTPGetAction）

  HTTPGet 指定要執行的 HTTP 請求。

  <a name="HTTPGetAction"></a>
  **HTTPGetAction 描述基於 HTTP Get 請求的操作。**

  <!--
  - **httpGet.port** (IntOrString), required

    Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
  -->

  - **httpGet.port** （IntOrString），必需

    要在容器上訪問的端口的名稱或編號。數字必須在 1 到 65535 的範圍內。名稱必須是 IANA_SVC_NAME。

    <a name="IntOrString"></a>
    **IntOrString 是一種可以包含 int32 或字符串值的類型。在 JSON 或 YAML 封組和取消編組時，
    它會生成或使用內部類型。例如，這允許你擁有一個可以接受名稱或數字的 JSON 字段。**

  <!--
  - **httpGet.host** (string)

    Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.

  - **httpGet.httpHeaders** ([]HTTPHeader)

    Custom headers to set in the request. HTTP allows repeated headers.

    <a name="HTTPHeader"></a>
    *HTTPHeader describes a custom header to be used in HTTP probes*
  -->

  - **httpGet.host** （string）

    要連接的主機名，默認爲 Pod IP。你可能想在 `httpHeaders` 中設置 "Host"。

  - **httpGet.httpHeaders** （[]HTTPHeader）

    要在請求中設置的自定義標頭。HTTP 允許重複的標頭。

    <a name="HTTPHeader"></a>
    **HTTPHeader 描述了在 HTTP 探針中使用的自定義標頭**

    <!--
    - **httpGet.httpHeaders.name** (string), required

      The header field name. This will be canonicalized upon output, so case-variant names will be understood as the same header.

    - **httpGet.httpHeaders.value** (string), required

      The header field value
    -->

    - **httpGet.httpHeaders.name** (string)，必需

      HTTP 頭部字段名稱。
      在輸出時，它將被規範化處理，因此大小寫變體的名稱會被視爲相同的頭。

    - **httpGet.httpHeaders.value** (string)，必需

      HTTP 頭部字段取值。

  <!--
  - **httpGet.path** (string)

    Path to access on the HTTP server.

  - **httpGet.scheme** (string)

    Scheme to use for connecting to the host. Defaults to HTTP.
  -->
 
  - **httpGet.path** （string）

    HTTP 服務器上的訪問路徑。

  - **httpGet.scheme** （string）

    用於連接到主機的方案。默認爲 `HTTP`。

<!--
- **tcpSocket** （TCPSocketAction）

  Deprecated. TCPSocket is NOT supported as a LifecycleHandler and kept for the backward compatibility. There are no validation of this field and lifecycle hooks will fail in runtime when tcp handler is specified.

  <a name="TCPSocketAction"></a>
  *TCPSocketAction describes an action based on opening a socket*
-->
- **tcpSocket** （TCPSocketAction）

  已棄用。不再支持 `tcpSocket` 作爲 LifecycleHandler，但爲向後兼容保留之。
  當指定 `tcp` 處理程序時，此字段不會被驗證，而生命週期回調將在運行時失敗。

  <a name="TCPSocketAction"></a>
  **TCPSocketAction 描述基於打開套接字的動作。**

  <!--
  - **tcpSocket.port** (IntOrString), required

    Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.
  -->

  - **tcpSocket.port** (IntOrString)，必需

    容器上要訪問的端口的編號或名稱。端口號必須在 1 到 65535 的範圍內。
    名稱必須是 IANA_SVC_NAME。

    <a name="IntOrString"></a>
    <!--
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
    -->
    
    **IntOrString 是一種可以保存 int32 或字符串值的類型。在 JSON 或 YAML 編組和解組中使用時，
    會生成或使用內部類型。例如，這允許你擁有一個可以接受名稱或數字的 JSON 字段。**

  <!--
  - **tcpSocket.host** (string)

    Optional: Host name to connect to, defaults to the pod IP.
  -->

  - **tcpSocket.host** （string）

    可選字段。要連接的主機名，默認爲 Pod IP。

## NodeAffinity {#NodeAffinity}

<!--
Node affinity is a group of node affinity scheduling rules.
-->
節點親和性是一組節點親和性調度規則。

<hr>

<!--
- **preferredDuringSchedulingIgnoredDuringExecution** ([]PreferredSchedulingTerm)

  The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node matches the corresponding matchExpressions; the node(s) with the highest sum are the most preferred.

  <a name="PreferredSchedulingTerm"></a>
  *An empty preferred scheduling term matches all objects with implicit weight 0 (i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op).*

-->

- **preferredDuringSchedulingIgnoredDuringExecution** （[]PreferredSchedulingTerm）

  調度程序會更傾向於將 Pod 調度到滿足該字段指定的親和性表達式的節點，
  但它可能會選擇違反一個或多個表達式的節點。最優選的節點是權重總和最大的節點，
  即對於滿足所有調度要求（資源請求、requiredDuringScheduling 親和表達式等）的每個節點，
  通過迭代該字段的元素來計算總和如果節點匹配相應的 matchExpressions，則將 "權重" 添加到總和中； 
  具有最高總和的節點是最優選的。

  空的首選調度條件匹配所有具有隱式權重 0 的對象（即它是一個 no-op 操作）。
  null 值的首選調度條件不匹配任何對象（即也是一個 no-op 操作）。

  <!--
  - **preferredDuringSchedulingIgnoredDuringExecution.preference** (NodeSelectorTerm), required

    A node selector term, associated with the corresponding weight.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*
  -->

  - **preferredDuringSchedulingIgnoredDuringExecution.preference** (NodeSelectorTerm)，必需

    與相應權重相關聯的節點選擇條件。

    null 值或空值的節點選擇條件不會匹配任何對象。這些條件的請求按邏輯與操作組合。
    TopologySelectorTerm 類型實現了 NodeSelectorTerm 的一個子集。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's labels.

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's fields.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchExpressions** （[]<a href="{{< ref "../common-definitions/node-selector-requirement" >}}">NodeSelectorRequirement</a>）

      按節點標籤列出的節點選擇條件列表。

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchFields** （[]<a href="{{< ref "../common-definitions/node-selector-requirement" >}}">NodeSelectorRequirement</a>）

      按節點字段列出的節點選擇要求列表。

  <!--
  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), required

    Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.
  -->

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32)，必需

    與匹配相應的 nodeSelectorTerm 相關的權重，範圍爲 1-100。

<!--
- **requiredDuringSchedulingIgnoredDuringExecution** (NodeSelector)

  If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to an update), the system may or may not try to eventually evict the pod from its node.

  <a name="NodeSelector"></a>
  *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*
-->

- **requiredDuringSchedulingIgnoredDuringExecution** （NodeSelector）

  如果在調度時不滿足該字段指定的親和性要求，則不會將 Pod 調度到該節點上。
  如果在 Pod 執行期間的某個時間點不再滿足此字段指定的親和性要求（例如：由於更新），
  系統可能會或可能不會嘗試最終將 Pod 從其節點中逐出。

  <a name="NodeSelector"></a>
  **一個節點選擇器代表一個或多個標籤查詢結果在一組節點上的聯合；換言之，
  它表示由節點選擇器項表示的選擇器的邏輯或組合。**

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms** ([]NodeSelectorTerm), required

    Required. A list of node selector terms. The terms are ORed.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms** ([]NodeSelectorTerm)，必需

    必需的字段。節點選擇條件列表。這些條件按邏輯或操作組合。

    null 值或空值的節點選擇器條件不匹配任何對象。這裏的條件是按邏輯與操作組合的。
    TopologySelectorTerm 類型實現了 NodeSelectorTerm 的一個子集。

    <!--
    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's labels.

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's fields.
    -->

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchExpressions** （[]<a href="{{< ref "../common-definitions/node-selector-requirement" >}}">NodeSelectorRequirement</a>）

      按節點標籤列出的節點選擇器需求列表。

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchFields** （[]<a href="{{< ref "../common-definitions/node-selector-requirement" >}}">NodeSelectorRequirement</a>）

      按節點字段列出的節點選擇器要求列表。

## PodAffinity {#PodAffinity}

<!--
Pod affinity is a group of inter pod affinity scheduling rules.
-->
Pod 親和性是一組 Pod 間親和性調度規則。

<hr>

<!--
- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.

  <a name="WeightedPodAffinityTerm"></a>
  *The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)*
-->

- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  調度器會更傾向於將 Pod 調度到滿足該字段指定的親和性表達式的節點，
  但它可能會選擇違反一個或多個表達式的節點。最優選擇是權重總和最大的節點，
  即對於滿足所有調度要求（資源請求、`requiredDuringScheduling` 親和表達式等）的每個節點，
  通過迭代該字段的元素來計算總和，如果節點具有與相應 `podAffinityTerm`
  匹配的 Pod，則將“權重”添加到總和中； 
  具有最高總和的節點是最優選的。

  <a name="WeightedPodAffinityTerm"></a>
  **所有匹配的 WeightedPodAffinityTerm 字段的權重都是按節點累計的，以找到最優選的節點。**

  <!--
  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm), required

    Required. A pod affinity term, associated with the corresponding weight.

    <a name="PodAffinityTerm"></a>
    *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*
  -->

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm)，必需

    必需的字段。一個 Pod 親和性條件，對應一個與相應的權重值。

    <a name="PodAffinityTerm"></a>
    定義一組 Pod（即那些與給定名字空間相關的標籤選擇算符匹配的 Pod 集合），
    當前 Pod 應該與所選 Pod 集合位於同一位置（親和性）或位於不同位置（反親和性），
    其中“在同一位置”意味着運行在一個節點上，其鍵 `topologyKey` 的標籤值與運行所選 Pod
    集合中的某 Pod 的任何節點上的標籤值匹配。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string), required

      This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string)，必需

      此 Pod 應與指定名字空間中與標籤選擇算符匹配的 Pod 集合位於同一位置（親和性）
      或位於不同位置（反親和性），這裏的“在同一位置”意味着運行在一個節點上，其鍵名爲
      `topologyKey` 的標籤值與運行所選 Pod 集合中的某 Pod 的任何節點上的標籤值匹配。
      不允許使用空的 `topologyKey`。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over a set of resources, in this case pods.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

      對一組資源的標籤查詢，在這裏資源爲 Pod。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

      對條件所適用的名字空間集合的標籤查詢。
      此條件會被應用到此字段所選擇的名字空間和 namespaces 字段中列出的名字空間的組合之上。
      選擇算符爲 null 和 namespaces 列表爲 null 值或空表示“此 Pod 的名字空間”。
      空的選擇算符 ({}) 可用來匹配所有名字空間。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** ([]string)

      namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** （[]string）

      namespaces 指定此條件所適用的名字空間，是一個靜態列表。
      此條件會被應用到 namespaces 字段中列出的名字空間和由 namespaceSelector 選中的名字空間上。
      namespaces 列表爲 null 或空，以及 namespaceSelector 值爲 null 均表示“此 Pod 的名字空間”。

  <!--
  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), required

    weight associated with matching the corresponding podAffinityTerm, in the range 1-100.
  -->

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32)，必需

    weight 是匹配相應 `podAffinityTerm` 條件的權重，範圍爲 1-100。

<!--
- **requiredDuringSchedulingIgnoredDuringExecution** ([]PodAffinityTerm)

  If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.

  <a name="PodAffinityTerm"></a>
  *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*
-->

- **requiredDuringSchedulingIgnoredDuringExecution** （[]PodAffinityTerm）

  如果在調度時不滿足該字段指定的親和性要求，則該 Pod 不會被調度到該節點上。
  如果在 Pod 執行期間的某個時間點不再滿足此字段指定的親和性要求（例如：由於 Pod 標籤更新），
  系統可能會也可能不會嘗試最終將 Pod 從其節點中逐出。
  當此列表中有多個元素時，每個 `podAffinityTerm` 對應的節點列表是取其交集的，即必須滿足所有條件。

  <a name="PodAffinityTerm"></a>
  定義一組 Pod（即那些與給定名字空間相關的標籤選擇算符匹配的 Pod 集合），當前 Pod 應該與該
  Pod 集合位於同一位置（親和性）或不位於同一位置（反親和性）。
  這裏的“位於同一位置”含義是運行在一個節點上。基於 `topologyKey` 字段所給的標籤鍵名，
  檢查所選 Pod 集合中各個 Pod 所在的節點上的標籤值，標籤值相同則認作“位於同一位置”。

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string), required

    This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string)，必需

    此 Pod 應與指定名字空間中與標籤選擇算符匹配的 Pod 集合位於同一位置（親和性）
    或不位於同一位置（反親和性），
    這裏的“位於同一位置”含義是運行在一個節點上。基於 `topologyKey` 字段所給的標籤鍵名，
    檢查所選 Pod 集合中各個 Pod 所在的節點上的標籤值，標籤值相同則認作“位於同一位置”。
    不允許使用空的 `topologyKey`。

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over a set of resources, in this case pods.
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

    對一組資源的標籤查詢，在這裏資源爲 Pod。

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

    對條件所適用的名字空間集合的標籤查詢。
    當前條件將應用於此字段選擇的名字空間和 namespaces 字段中列出的名字空間。
    選擇算符爲 null 和 namespaces 列表爲 null 或空值表示“此 Pod 的名字空間”。
    空選擇算符 ({}) 能夠匹配所有名字空間。


  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** ([]string)

    namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** （[]string）

    namespaces 指定當前條件所適用的名字空間名稱的靜態列表。
    當前條件適用於此字段中列出的名字空間和由 namespaceSelector 選中的名字空間。
    namespaces 列表爲 null 或空，以及 namespaceSelector 爲 null 表示“此 Pod 的名字空間”。

## PodAntiAffinity {#PodAntiAffinity}

<!--
Pod anti affinity is a group of inter pod anti affinity scheduling rules.
-->
Pod 反親和性是一組 Pod 間反親和性調度規則。

<hr>

<!--
- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  The scheduler will prefer to schedule pods to nodes that satisfy the anti-affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling anti-affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.


  <a name="WeightedPodAffinityTerm"></a>
  *The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)*
-->
- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  調度器更傾向於將 Pod 調度到滿足該字段指定的反親和性表達式的節點，
  但它可能會選擇違反一個或多個表達式的節點。
  最優選的節點是權重總和最大的節點，即對於滿足所有調度要求（資源請求、`requiredDuringScheduling`
  反親和性表達式等）的每個節點，通過遍歷元素來計算總和如果節點具有與相應 `podAffinityTerm`
  匹配的 Pod，則此字段並在總和中添加"權重"；具有最高加和的節點是最優選的。

  <a name="WeightedPodAffinityTerm"></a>
  **所有匹配的 WeightedPodAffinityTerm 字段的權重都是按節點添加的，以找到最優選的節點。**

  <!--
  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm), required

    Required. A pod affinity term, associated with the corresponding weight.

    <a name="PodAffinityTerm"></a>
    *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*
  -->

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm)，必需

    必需的字段。一個 Pod 親和性條件，與相應的權重相關聯。

    <a name="PodAffinityTerm"></a>
    定義一組 Pod（即那些與給定名字空間相關的標籤選擇算符匹配的 Pod 集合），
    當前 Pod 應該與所選 Pod 集合位於同一位置（親和性）或不位於同一位置（反親和性），
    其中 "在同一位置" 意味着運行在一個節點上，其鍵 `topologyKey` 的標籤值與運行所選 Pod
    集合中的某 Pod 的任何節點上的標籤值匹配。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string), required

      This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string)，必需

      此 Pod 應與指定名字空間中與標籤選擇算符匹配的 Pod 集合位於同一位置（親和性）
      或不位於同一位置（反親和性），這裏的 "在同一位置" 意味着運行在一個節點上，其鍵名爲
      `topologyKey` 的標籤值與運行所選 Pod 集合中的某 Pod 的任何節點上的標籤值匹配。
      不允許使用空的 `topologyKey`。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over a set of resources, in this case pods.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

      對一組資源的標籤查詢，在這裏資源爲 Pod。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

      對條件所適用的名字空間集合的標籤查詢。
      此條件會被應用到此字段所選擇的名字空間和 namespaces 字段中列出的名字空間的組合之上。
      選擇算符爲 null 和 namespaces 列表爲 null 值或空表示 "此 Pod 的名字空間"。
      空的選擇算符 ({}) 可用來匹配所有名字空間。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** ([]string)

      namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** （[]string）

      namespaces 指定此條件所適用的名字空間，是一個靜態列表。
      此條件會被應用到 namespaces 字段中列出的名字空間和由 namespaceSelector 選中的名字空間上。
      namespaces 列表爲 null 或空，以及 namespaceSelector 值爲 null 均表示 "此 Pod 的名字空間"。

  <!--
  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), required

    weight associated with matching the corresponding podAffinityTerm, in the range 1-100.
  -->

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32)，必需

    weight 是匹配相應 `podAffinityTerm` 條件的權重，範圍爲 1-100。

<!--
- **requiredDuringSchedulingIgnoredDuringExecution** ([]PodAffinityTerm)

  If the anti-affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the anti-affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.

  <a name="PodAffinityTerm"></a>
  *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*
-->

- **requiredDuringSchedulingIgnoredDuringExecution** （[]PodAffinityTerm）

  如果在調度時不滿足該字段指定的反親和性要求，則該 Pod 不會被調度到該節點上。
  如果在 Pod 執行期間的某個時間點不再滿足此字段指定的反親和性要求（例如：由於 Pod 標籤更新），
  系統可能會或可能不會嘗試最終將 Pod 從其節點中逐出。
  當有多個元素時，每個 `podAffinityTerm` 對應的節點列表是取其交集的，即必須滿足所有條件。

  <a name="PodAffinityTerm"></a>
  定義一組 Pod（即那些與給定名字空間相關的標籤選擇算符匹配的 Pod 集合），當前 Pod 應該與該
  Pod 集合位於同一位置（親和性）或不位於同一位置（反親和性）。
  這裏的 "位於同一位置" 含義是運行在一個節點上。基於 `topologyKey` 字段所給的標籤鍵名，
  檢查所選 Pod 集合中各個 Pod 所在的節點上的標籤值，標籤值相同則認作 "位於同一位置"。

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string), required

    This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string)，必需

    此 Pod 應與指定名字空間中與標籤選擇算符匹配的 Pod 集合位於同一位置（親和性）
    或不位於同一位置（反親和性），
    這裏的 "位於同一位置" 含義是運行在一個節點上。基於 `topologyKey` 字段所給的標籤鍵名，
    檢查所選 Pod 集合中各個 Pod 所在的節點上的標籤值，標籤值相同則認作 "位於同一位置"。
    不允許使用空的 `topologyKey`。

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over a set of resources, in this case pods.
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

    對一組資源的標籤查詢，在這裏資源爲 Pod。

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

    對條件所適用的名字空間集合的標籤查詢。
    當前條件將應用於此字段選擇的名字空間和 namespaces 字段中列出的名字空間。
    選擇算符爲 null 和 namespaces 列表爲 null 或空值表示 “此 Pod 的名字空間”。
    空選擇算符 ({}) 能夠匹配所有名字空間。


  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** ([]string)

    namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** （[]string）

    namespaces 指定當前條件所適用的名字空間名稱的靜態列表。
    當前條件適用於此字段中列出的名字空間和由 namespaceSelector 選中的名字空間。
    namespaces 列表爲 null 或空，以及 namespaceSelector 爲 null 表示 “此 Pod 的名字空間”。


<!--
## Probe {#Probe}
-->
## 探針 {#Probe}

<!--
Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.
-->
探針描述了要對容器執行的健康檢查，以確定它是否處於活動狀態或準備好接收流量。

<hr>

<!--
- **exec** (ExecAction)

  Exec specifies the action to take.

  <a name="ExecAction"></a>
  *ExecAction describes a "run in container" action.*
-->
- **exec** （execAction）

  exec 指定要執行的操作。

  <a name="ExecAction"></a>
  **ExecAction 描述了 "在容器中運行" 操作。**

  <!--
  - **exec.command** ([]string)

    Command is the command line to execute inside the container, the working directory for the command  is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.
  -->

  - **exec.command** （[]string）

    command 是要在容器內執行的命令行，命令的工作目錄是容器文件系統中的根目錄（'/'）。
    該命令只是通過 `exec` 執行，而不會啓動 Shell，因此傳統的 Shell 指令（'|' 等）將不起作用。
    要使用某 Shell，你需要顯式調用該 Shell。
    退出狀態 0 被視爲存活/健康，非零表示不健康。

<!--
- **httpGet** (HTTPGetAction)

  HTTPGet specifies the http request to perform.

  <a name="HTTPGetAction"></a>
  *HTTPGetAction describes an action based on HTTP Get requests.*
-->
- **httpGet** （HTTPGetAction）

  httpGet 指定要執行的 HTTP 請求。

  <a name="HTTPGetAction"></a>
  **HTTPGetAction 描述基於 HTTP Get 請求的操作。**

  <!--
  - **httpGet.port** (IntOrString), required

    Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
  -->

  - **httpGet.port** (IntOrString)，必需

    容器上要訪問的端口的名稱或端口號。端口號必須在 1 到 65535 內。名稱必須是 IANA_SVC_NAME。

    <a name="IntOrString"></a>
    `IntOrString` 是一種可以保存 int32 或字符串值的類型。在 JSON 或 YAML 編組和解組時，
    它會生成或使用內部類型。例如，這允許你擁有一個可以接受名稱或數字的 JSON 字段。

  <!--
  - **httpGet.host** (string)

    Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.
  -->

  - **httpGet.host** （string）

    要連接的主機名，默認爲 Pod IP。你可能想在 `httpHeaders` 中設置 "Host"。

  <!--
  - **httpGet.httpHeaders** ([]HTTPHeader)

    Custom headers to set in the request. HTTP allows repeated headers.

    <a name="HTTPHeader"></a>
    *HTTPHeader describes a custom header to be used in HTTP probes*
  -->

  - **httpGet.httpHeaders** （[]HTTPHeader）

    要在請求中設置的自定義 HTTP 標頭。HTTP 允許重複的標頭。

    <a name="HTTPHeader"></a>
    **HTTPHeader 描述了在 HTTP 探針中使用的自定義標頭。**

    <!--
    - **httpGet.httpHeaders.name** (string), required

      The header field name. This will be canonicalized upon output, so case-variant names will be understood as the same header.

    - **httpGet.httpHeaders.value** (string), required

      The header field value
    -->

    - **httpGet.httpHeaders.name** (string)，必需

      HTTP 頭部域名稱。
      在輸出時，它將被規範化處理，因此大小寫變體的名稱會被視爲相同的頭。

    - **httpGet.httpHeaders.value** (string)，必需

      HTTP 頭部域值。

  <!--
  - **httpGet.path** (string)

    Path to access on the HTTP server.

  - **httpGet.scheme** (string)

    Scheme to use for connecting to the host. Defaults to HTTP.
  -->
 
  - **httpGet.path** （string）

    HTTP 服務器上的訪問路徑。

  - **httpGet.scheme** （string）

    用於連接到主機的方案。默認爲 HTTP。

<!--
- **tcpSocket** (TCPSocketAction)

  TCPSocket specifies an action involving a TCP port.

  <a name="TCPSocketAction"></a>
  *TCPSocketAction describes an action based on opening a socket*
-->

- **tcpSocket** （TCPSocketAction）

  tcpSocket 指定涉及 TCP 端口的操作。

  <a name="TCPSocketAction"></a>
  **`TCPSocketAction` 描述基於打開套接字的動作。**

  <!--
  - **tcpSocket.port** (IntOrString), required

    Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
  -->

  - **tcpSocket.port** (IntOrString)，必需

    容器上要訪問的端口的端口號或名稱。端口號必須在 1 到 65535 內。名稱必須是 IANA_SVC_NAME。

    <a name="IntOrString"></a>
    IntOrString 是一種可以保存 int32 或字符串的類型。在 JSON 或 YAML 編組和解組時，
    它會生成或使用內部類型。例如，這允許你擁有一個可以接受名稱或數字的 JSON 字段。

  <!--
  - **tcpSocket.host** (string)

    Optional: Host name to connect to, defaults to the pod IP.
  -->

  - **tcpSocket.host** （string）

    可選字段。要連接的主機名，默認爲 Pod IP。

<!--
- **initialDelaySeconds** (int32)

  Number of seconds after the container has started before liveness probes are initiated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
-->
- **初始延遲秒** （int32）

  容器啓動後啓動存活態探針之前的秒數。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#container-probes

<!--
- **terminationGracePeriodSeconds** (int64)

  Optional duration in seconds the pod needs to terminate gracefully upon probe failure. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. If this value is nil, the pod's terminationGracePeriodSeconds will be used. Otherwise, this value overrides the value provided by the pod spec. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). This is a beta field and requires enabling ProbeTerminationGracePeriod feature gate. Minimum value is 1. spec.terminationGracePeriodSeconds is used if unset.
-->

- **terminationGracePeriodSeconds** （int64）

  Pod 需要在探針失敗時體面終止所需的時間長度（以秒爲單位），爲可選字段。
  寬限期是 Pod 中運行的進程收到終止信號後，到進程被終止信號強制停止之前的時間長度（以秒爲單位）。
  你應該將此值設置爲比你的進程的預期清理時間更長。
  如果此值爲 nil，則將使用 Pod 的 `terminateGracePeriodSeconds`。
  否則，此值將覆蓋 Pod 規約中設置的值。字段值值必須是非負整數。
  零值表示收到終止信號立即停止（沒有機會關閉）。
  這是一個 Beta 字段，需要啓用 ProbeTerminationGracePeriod 特性門控。最小值爲 1。
  如果未設置，則使用 `spec.terminationGracePeriodSeconds`。

<!--
- **periodSeconds** (int32)

  How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1.
-->
- **periodSeconds** (int32)

  探針的執行週期（以秒爲單位）。默認爲 10 秒。最小值爲 1。

<!--
- **timeoutSeconds** (int32)

  Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
-->
- **timeoutSeconds** (int32)

  探針超時的秒數。默認爲 1 秒。最小值爲 1。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#container-probes

<!--
- **failureThreshold** (int32)

  Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.
-->
- **failureThreshold** (int32)

  探針成功後的最小連續失敗次數，超出此閾值則認爲探針失敗。默認爲 3。最小值爲 1。

<!--
- **successThreshold** (int32)

  Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1.
-->
- **successThreshold** (int32)

  探針失敗後最小連續成功次數，超過此閾值纔會被視爲探針成功。默認爲 1。
  存活性探針和啓動探針必須爲 1。最小值爲 1。

<!--
- **grpc** (GRPCAction)

  GRPC specifies an action involving a GRPC port.
-->
- **grpc** （GRPCAction）

  GRPC 指定涉及 GRPC 端口的操作。

  <a name="GRPCAction"></a>

  <!--
  - **grpc.port** (int32), required

    Port number of the gRPC service. Number must be in the range 1 to 65535.

  - **grpc.service** (string)

    Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).
    
    If this is not specified, the default behavior is defined by gRPC.
  -->

  - **grpc.port** （int32），必需

    gRPC 服務的端口號。數字必須在 1 到 65535 的範圍內。

  - **grpc.service** （string）

    service 是要放置在 gRPC 運行狀況檢查請求中的服務的名稱
    （請參見 https://github.com/grpc/grpc/blob/master/doc/health-checking.md）。
    
    如果未指定，則默認行爲由 gRPC 定義。

## PodStatus {#PodStatus}

<!--
PodStatus represents information about the status of a pod. Status may trail the actual state of a system, especially if the node that hosts the pod cannot contact the control plane.
-->
PodStatus 表示有關 Pod 狀態的信息。狀態內容可能會滯後於系統的實際狀態，
尤其是在託管 Pod 的節點無法聯繫控制平面的情況下。

<hr>

<!--
- **nominatedNodeName** (string)

  nominatedNodeName is set only when this pod preempts other pods on the node, but it cannot be scheduled right away as preemption victims receive their graceful termination periods. This field does not guarantee that the pod will be scheduled on this node. Scheduler may decide to place the pod elsewhere if other nodes become available sooner. Scheduler may also decide to give the resources on this node to a higher priority pod that is created after preemption. As a result, this field may be different than PodSpec.nodeName when the pod is scheduled.
-->
- **nominatedNodeName** (string)

  僅當此 Pod 搶佔節點上的其他 Pod 時才設置 `nominatedNodeName`，
  但搶佔操作的受害者會有體面終止期限，因此此 Pod 無法立即被調度。
  此字段不保證 Pod 會在該節點上調度。
  如果其他節點更早進入可用狀態，調度器可能會決定將 Pod 放置在其他地方。
  調度器也可能決定將此節點上的資源分配給優先級更高的、在搶佔操作之後創建的 Pod。
  因此，當 Pod 被調度時，該字段可能與 Pod 規約中的 nodeName 不同。

<!--
- **hostIP** (string)

  hostIP holds the IP address of the host to which the pod is assigned. Empty if the pod has not started yet. A pod can be assigned to a node that has a problem in kubelet which in turns mean that HostIP will not be updated even if there is a node is assigned to pod
-->
- **hostIP** (string)

  hostIP 存儲分配給 Pod 的主機的 IP 地址。如果 Pod 尚未啓動，則爲空。
  Pod 可以被調度到 kubelet 有問題的節點上，這意味着即使有節點被分配給 Pod，hostIP 也不會被更新。

<!--
- **hostIPs** ([]HostIP)

  *Patch strategy: merge on key `ip`*
  
  *Atomic: will be replaced during a merge*
  
  hostIPs holds the IP addresses allocated to the host. If this field is specified, the first entry must match the hostIP field. This list is empty if the pod has not started yet. A pod can be assigned to a node that has a problem in kubelet which in turns means that HostIPs will not be updated even if there is a node is assigned to this pod.
-->
- **hostIPs** ([]HostIP)

  **補丁策略：基於 `ip` 鍵合併**

  **原子性：將在合併期間被替換**

  hostIPs 存儲分配給主機的 IP 地址列表。如果此字段被指定，則第一個條目必須與 hostIP 字段匹配。
  如果 Pod 尚未啓動，則此列表爲空。Pod 可以被調度到 kubelet 有問題的節點上，
  這意味着即使有節點被分配給此 Pod，HostIPs 也不會被更新。

  <!--
  <a name="HostIP"></a>
  *HostIP represents a single IP address allocated to the host.*

  - **hostIPs.ip** (string)

    IP is the IP address assigned to the host
  -->

  <a name="HostIP"></a>
  **HostIP 表示分配給主機的單個 IP 地址。**

  - **hostIPs.ip** (string)

    ip 是分配給主機的 IP 地址。
  
<!--
- **startTime** (Time)

  RFC 3339 date and time at which the object was acknowledged by the Kubelet. This is before the Kubelet pulled the container image(s) for the pod.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->
- **startTime** (Time)

  kubelet 確認 Pod 對象的日期和時間，格式遵從 RFC 3339。
  此時間點處於 kubelet 爲 Pod 拉取容器鏡像之前。

  Time 是 `time.Time` 的包裝器，支持正確編組爲 YAML 和 JSON。
  time 包所提供的許多工廠方法都有包裝器。

<!--
- **phase** (string)

  The phase of a Pod is a simple, high-level summary of where the Pod is in its lifecycle. The conditions array, the reason and message fields, and the individual container status arrays contain more detail about the pod's status. There are five possible phase values:
  
  Pending: The pod has been accepted by the Kubernetes system, but one or more of the container images has not been created. This includes time before being scheduled as well as time spent downloading images over the network, which could take a while. Running: The pod has been bound to a node, and all of the containers have been created. At least one container is still running, or is in the process of starting or restarting. Succeeded: All containers in the pod have terminated in success, and will not be restarted. Failed: All containers in the pod have terminated, and at least one container has terminated in failure. The container either exited with non-zero status or was terminated by the system. Unknown: For some reason the state of the pod could not be obtained, typically due to an error in communicating with the host of the pod.
-->  
- **phase** (string)

  Pod 的 phase 是對 Pod 在其生命週期中所處位置的簡單、高級摘要。
  conditions 數組、reason 和 message 字段以及各個容器的 status 數組包含有關 Pod
  狀態的進一步詳細信息。phase 的取值有五種可能性：
  
  - `Pending`：Pod 已被 Kubernetes 系統接受，但尚未創建容器鏡像。
   這包括 Pod 被調度之前的時間以及通過網絡下載鏡像所花費的時間。
  - `Running`：Pod 已經被綁定到某個節點，並且所有的容器都已經創建完畢。至少有一個容器仍在運行，或者正在啓動或重新啓動過程中。
  - `Succeeded`：Pod 中的所有容器都已成功終止，不會重新啓動。
  - `Failed`：Pod 中的所有容器都已終止，並且至少有一個容器因故障而終止。
    容器要麼以非零狀態退出，要麼被系統終止。
  - `Unknown`：由於某種原因無法獲取 Pod 的狀態，通常是由於與 Pod 的主機通信時出錯。

  <!--
  More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-phase
  -->
  
  更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-phase

<!--
- **message** (string)

  A human readable message indicating details about why the pod is in this condition.

- **reason** (string)

  A brief CamelCase message indicating details about why the pod is in this state. e.g. 'Evicted'

- **podIP** (string)

  podIP address allocated to the pod. Routable at least within the cluster. Empty if not yet allocated.
-->
- **message** (string)

   一條人類可讀的消息，標示有關 Pod 爲何處於這種情況的詳細信息。

- **reason** (string)

   一條簡短的駝峯式命名的消息，指示有關 Pod 爲何處於此狀態的詳細信息。例如 'Evicted'。

- **podIP** （string）

   分配給 Pod 的 podIP 地址。至少在集羣內可路由。如果尚未分配則爲空。

<!--
- **podIPs** ([]PodIP)

  *Patch strategy: merge on key `ip`*
  
  podIPs holds the IP addresses allocated to the pod. If this field is specified, the 0th entry must match the podIP field. Pods may be allocated at most 1 value for each of IPv4 and IPv6. This list is empty if no IPs have been allocated yet.

  <a name="PodIP"></a>
  *PodIP represents a single IP address allocated to the pod.*
-->
- **podIPs** （[]PodIP）

  **補丁策略：基於 `ip` 鍵合併**
  
  podIPs 保存分配給 Pod 的 IP 地址。如果指定了該字段，則第 0 個條目必須與 podIP 字段值匹配。
  Pod 最多可以爲 IPv4 和 IPv6 各分配 1 個值。如果尚未分配 IP，則此列表爲空。

  <a name="PodIP"></a>
  **podIP 表示分配給 Pod 的單個 IP 地址。**

  <!--
  - **podIPs.ip** (string)

    IP is the IP address assigned to the pod
  -->

  - **podIP.ip** （string）

    ip 是分配給 Pod 的 IP 地址。

<!--
- **conditions** ([]PodCondition)

  *Patch strategy: merge on key `type`*
  
  Current service state of pod. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  <a name="PodCondition"></a>
  *PodCondition contains details for the current condition of this pod.*
-->
- **conditions** ([]PodCondition)

   **補丁策略：基於 `ip` 鍵合併**
  
   Pod 的當前服務狀態。更多信息：
   https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  <a name="PodCondition"></a>
   **PodCondition 包含此 Pod 當前狀況的詳細信息。**

  <!--
  - **conditions.status** (string), required

    Status is the status of the condition. Can be True, False, Unknown. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  - **conditions.type** (string), required

    Type is the type of the condition. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions
  -->
   - **conditions.status** (string)，必需

    status 是 condition 的狀態。可以是 `True`、`False`、`Unknown` 之一。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  - **conditions.type** (string)，必需

    type 是 condition 的類型。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  <!--
  - **conditions.lastProbeTime** (Time)

    Last time we probed the condition.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastProbeTime** (Time)

    上次探測 Pod 狀況的時間。

    Time 是 `time.Time` 的包裝器，支持正確編組爲 YAML 和 JSON。
    time 包所提供的許多工廠方法都有包裝器。

  <!--
  - **conditions.lastTransitionTime** (Time)

    Last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)

    上次 Pod 狀況從一種狀態變爲另一種狀態的時間。

    Time 是 `time.Time` 的包裝器，支持正確編組爲 YAML 和 JSON。
    time 包所提供的許多工廠方法都有包裝器。

  <!--
  - **conditions.message** (string)

    Human-readable message indicating details about last transition.

  - **conditions.reason** (string)

    Unique, one-word, CamelCase reason for the condition's last transition.
  -->

  - **conditions.message** (string)

    標示有關上次狀況變化的詳細信息的、人類可讀的消息。

  - **conditions.reason** (string)

    condition 最近一次變化的唯一、一個單詞、駝峯式命名原因。

<!--
- **qosClass** (string)

  The Quality of Service (QOS) classification assigned to the pod based on resource requirements See PodQOSClass type for available QOS classes More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes
-->
- **qosClass** （string）

   根據資源要求分配給 Pod 的服務質量 (QOS) 分類。有關可用的 QOS 類，請參閱 PodQOSClass 類型。
   更多信息： https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes

<!--
- **initContainerStatuses** ([]ContainerStatus)

  The list has one entry per init container in the manifest. The most recent successful init container will have ready = true, the most recently started container will have startTime set. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

  <a name="ContainerStatus"></a>
  *ContainerStatus contains details for the current status of this container.*
-->

- **initContainerStatuses** （[]ContainerStatus）

  該列表在清單中的每個 Init 容器中都有一個條目。最近成功的 Init 容器會將 ready 設置爲 true，
  最近啓動的容器將設置 startTime。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

  **ContainerStatus 包含此容器當前狀態的詳細信息。**

<!--
- **containerStatuses** ([]ContainerStatus)

  The list has one entry per container in the manifest. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

  <a name="ContainerStatus"></a>
  *ContainerStatus contains details for the current status of this container.*
-->
- **containerStatuses** （[]ContainerStatus）

  清單中的每個容器狀態在該列表中都有一個條目。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

  **ContainerStatus 包含此容器當前狀態的詳細信息。**
    
<!--
- **ephemeralContainerStatuses** ([]ContainerStatus)

  Status for any ephemeral containers that have run in this pod.

  <a name="ContainerStatus"></a>
  *ContainerStatus contains details for the current status of this container.*
-->
- **ephemeralContainerStatuses** （[]ContainerStatus）

  已在此 Pod 中運行的任何臨時容器的狀態。

  <a name="ContainerStatus"></a>
  **ContainerStatus 包含此容器當前狀態的詳細信息。**

<!--
- **resourceClaimStatuses** ([]PodResourceClaimStatus)

  *Patch strategies: retainKeys, merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  Status of resource claims.
-->
- **resourceClaimStatuses** ([]PodResourceClaimStatus)

  **補丁策略：retainKeys，基於鍵 `name` 合併**

  **映射：鍵 `name` 的唯一值將在合併過程中保留**

  資源申領的狀態。

  <!--
  <a name="PodResourceClaimStatus"></a>
  *PodResourceClaimStatus is stored in the PodStatus for each PodResourceClaim which references a ResourceClaimTemplate. It stores the generated name for the corresponding ResourceClaim.*
  -->

  <a name="PodResourceClaimStatus"></a>
  **對於每個引用 ResourceClaimTemplate 的 PodResourceClaim，PodResourceClaimStatus 被存儲在
  PodStatus 中。它存儲爲對應 ResourceClaim 生成的名稱。**

  <!--
  - **resourceClaimStatuses.name** (string), required

    Name uniquely identifies this resource claim inside the pod. This must match the name of an entry in pod.spec.resourceClaims, which implies that the string must be a DNS_LABEL.

  - **resourceClaimStatuses.resourceClaimName** (string)

    ResourceClaimName is the name of the ResourceClaim that was generated for the Pod in the namespace of the Pod. It this is unset, then generating a ResourceClaim was not necessary. The pod.spec.resourceClaims entry can be ignored in this case.
  -->

  - **resourceClaimStatuses.name** (string), required

    Name 在 Pod 中唯一地標識此資源申領。
    此名稱必須與 pod.spec.resourceClaims 中的條目名稱匹配，這意味着字符串必須是 DNS_LABEL。

  - **resourceClaimStatuses.resourceClaimName** (string)

    resourceClaimName 是爲 Pod 在其名字空間中生成的 ResourceClaim 的名稱。
    如果此項未被設置，則不需要生成 ResourceClaim。在這種情況下，可以忽略 pod.spec.resourceClaims 這個條目。

<!--
- **resize** (string)
 
  Status of resources resize desired for pod's containers. It is empty if no resources resize is pending. Any changes to container resources will automatically set this to "Proposed"
-->
- **resize** (string)

  Pod 容器所需的資源大小調整狀態。如果沒有待處理的資源調整大小，則它爲空。
  對容器資源的任何更改都會自動將其設置爲"建議"值。

## PodList {#PodList}

<!--
PodList is a list of Pods.
-->
PodList 是 Pod 的列表。

<hr>

<!--
- **items** ([]<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>), required

  List of pods. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md
-->
- **items** （[]<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>），必需

  Pod 列表。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md

<!--
- **apiVersion** (string)

  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
-->
- **apiVersion** （string）

  apiVersion 定義對象表示的版本化模式。服務器應將已識別的模式轉換爲最新的內部值，
  並可能拒絕無法識別的值。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

<!--
- **kind** (string)

  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
- **kind**（string）

  kind 是一個字符串值，表示此對象表示的 REST 資源。服務器可以從客戶端提交請求的端點推斷出資源類別。
  無法更新。採用駝峯式命名。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
- **metadata** （<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>）

  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified Pod
-->
### `get` 讀取指定的 Pod

<!--
#### HTTP Request
-->
#### HTTP 請求

GET /api/v1/namespaces/{namespace}/pods/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (**路徑參數**): string，必需

  Pod 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

<!--
### `get` read ephemeralcontainers of the specified Pod
-->
### `get` 讀取指定 Pod 的 ephemeralcontainers

<!--
#### HTTP Request
-->
#### HTTP 請求

GET /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (**路徑參數**): string，必需

  Pod 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

<!--
### `get` read log of the specified Pod
-->

### `get` 讀取指定 Pod 的日誌

<!--
#### HTTP Request
-->
#### HTTP 請求

GET /api/v1/namespaces/{namespace}/pods/{name}/log

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **container** (*in query*): string

  The container for which to stream logs. Defaults to only container if there is one container in the pod.
-->
- **name** (**路徑參數**): string，必需

  Pod 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **container** (**查詢參數**): string

  爲其流式傳輸日誌的容器。如果 Pod 中有一個容器，則默認爲僅容器。

<!--
- **follow** (*in query*): boolean

  Follow the log stream of the pod. Defaults to false.


- **insecureSkipTLSVerifyBackend** (*in query*): boolean

  insecureSkipTLSVerifyBackend indicates that the apiserver should not confirm the validity of the serving certificate of the backend it is connecting to.  This will make the HTTPS connection between the apiserver and the backend insecure. This means the apiserver cannot verify the log data it is receiving came from the real kubelet.  If the kubelet is configured to verify the apiserver's TLS credentials, it does not mean the connection to the real kubelet is vulnerable to a man in the middle attack (e.g. an attacker could not intercept the actual log data coming from the real kubelet).
-->
- **follow** (**查詢參數**)：boolean

  跟蹤 Pod 的日誌流。默認爲 false。

- **insecureSkipTLSVerifyBackend** (**查詢參數**)：boolean

  `insecureSkipTLSVerifyBackend` 表示 API 服務器不應確認它所連接的後端的服務證書的有效性。
  這將使 API 服務器和後端之間的 HTTPS 連接不安全。
  這意味着 API 服務器無法驗證它接收到的日誌數據是否來自真正的 kubelet。
  如果 kubelet 配置爲驗證 API 服務器的 TLS 憑據，這並不意味着與真實 kubelet
  的連接容易受到中間人攻擊（例如，攻擊者無法攔截來自真實 kubelet 的實際日誌數據）。

<!--
- **limitBytes** (*in query*): integer

  If set, the number of bytes to read from the server before terminating the log output. This may not display a complete final line of logging, and may return slightly more or slightly less than the specified limit.


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **limitBytes** (**查詢參數**): integer

  如果設置，則表示在終止日誌輸出之前從服務器讀取的字節數。
  設置此參數可能導致無法顯示完整的最後一行日誌記錄，並且可能返回略多於或略小於指定限制。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **previous** (*in query*): boolean

  Return previous terminated container logs. Defaults to false.

- **sinceSeconds** (*in query*): integer

  A relative time in seconds before the current time from which to show logs. If this value precedes the time a pod was started, only logs since the pod start will be returned. If this value is in the future, no logs will be returned. Only one of sinceSeconds or sinceTime may be specified.
-->
- **previous** (**查詢參數**)：boolean

  返回之前終止了的容器的日誌。默認爲 false。

- **sinceSeconds** (**查詢參數**): integer

  顯示日誌的當前時間之前的相對時間（以秒爲單位）。如果此值早於 Pod 啓動時間，
  則僅返回自 Pod 啓動以來的日誌。如果此值是將來的值，則不會返回任何日誌。
  只能指定 `sinceSeconds` 或 `sinceTime` 之一。

<!--
- **tailLines** (*in query*): integer

  If set, the number of lines from the end of the logs to show. If not specified, logs are shown from the creation of the container or sinceSeconds or sinceTime

- **timestamps** (*in query*): boolean

  If true, add an RFC3339 or RFC3339Nano timestamp at the beginning of every line of log output. Defaults to false.
-->
- **tailLines** (**查詢參數**): integer

  如果設置，則從日誌末尾開始顯示的行數。如果未指定，則從容器創建或 `sinceSeconds` 或
  `sinceTime` 時刻顯示日誌。

- **timestamps** (**查詢參數**)：boolean

  如果爲 true，則在每行日誌輸出的開頭添加 RFC3339 或 RFC3339Nano 時間戳。默認爲 false。

<!--
#### Response
-->
#### 響應

200 (string): OK

401: Unauthorized

<!--
### `get` read status of the specified Pod
-->
### `get` 讀取指定 Pod 的狀態

<!--
#### HTTP Request
-->
#### HTTP 請求

GET /api/v1/namespaces/{namespace}/pods/{name}/status

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (**路徑參數**): string，必需

  Pod 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Pod
-->
### `list` 列出或觀察 Pod 種類的對象

<!--
#### HTTP Request
-->
#### HTTP 請求

GET /api/v1/namespaces/{namespace}/pods

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應


200 (<a href="{{< ref "../workload-resources/pod-v1#PodList" >}}">PodList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Pod
-->
### `list` 列出或觀察 Pod 種類的對象

<!--
#### HTTP Request
-->
#### HTTP 請求

GET /api/v1/pods

<!--
#### Parameters
-->
#### 參數

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **allowWatchBookmarks** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->

- **timeoutSeconds** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-v1#PodList" >}}">PodList</a>): OK

401: Unauthorized

<!--
### `create` create a Pod
-->
### `create` 創建一個 Pod
<!--
#### HTTP Request
-->
#### HTTP 請求

POST /api/v1/namespaces/{namespace}/pods

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

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

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified Pod
-->
### `update` 替換指定的 Pod

<!--
#### HTTP Request
-->
#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/pods/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, required
-->
- **name** (**路徑參數**): string，必需

  Pod 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

<!--
### `update` replace ephemeralcontainers of the specified Pod
-->
### `update` 替換指定 Pod 的 ephemeralcontainers

<!--
#### HTTP Request
-->
#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, required
-->
- **name** (**路徑參數**): string，必需

  Pod 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified Pod
-->
### `update` 替換指定 Pod 的狀態

<!--
#### HTTP Request
-->
#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/pods/{name}/status

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, required
-->
- **name** (**路徑參數**): string，必需

  Pod 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>，必需

<!--  
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified Pod
-->
### `patch` 部分更新指定 Pod

<!--
#### HTTP Request
-->
#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/pods/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **name** (**路徑參數**): string，必需

  Pod 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

<!--
### `patch` partially update ephemeralcontainers of the specified Pod
-->
### `patch` 部分更新指定 Pod 的 ephemeralcontainers

<!--
#### HTTP Request
-->
#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **name** (**路徑參數**): string，必需

  Pod 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**): string

   <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified Pod
-->
### `patch` 部分更新指定 Pod 的狀態

<!--
#### HTTP Request
-->
#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/pods/{name}/status

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **name** (**路徑參數**): string，必需

  Pod 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

<!--
### `delete` delete a Pod
-->
### `delete` 刪除一個 Pod

<!--
#### HTTP Request
-->
#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/pods/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **name** (**路徑參數**): string，必需

  Pod 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!-- 
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

202 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Accepted

401: Unauthorize

<!--
### `deletecollection` delete collection of Pod
-->
### `deletecollection` 刪除 Pod 的集合

<!--
#### HTTP Request
-->
#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/pods

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

