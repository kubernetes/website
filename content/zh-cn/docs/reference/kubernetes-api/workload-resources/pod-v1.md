---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Pod"
content_type: "api_reference"
description: "Pod 是可以在主机上运行的容器的集合。"
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
Pod 是可以在主机上运行的容器的集合。此资源由客户端创建并调度到主机上。

<hr>

- **apiVersion**: v1

- **kind**: Pod

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **spec** (<a href="{{< ref "../workload-resources/pod-v1#PodSpec" >}}">PodSpec</a>)

  Specification of the desired behavior of the pod. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **spec** (<a href="{{< ref "../workload-resources/pod-v1#PodSpec" >}}">PodSpec</a>)

  对 Pod 预期行为的规约。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../workload-resources/pod-v1#PodStatus" >}}">PodStatus</a>)

  Most recently observed status of the pod. This data may not be up to date. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../workload-resources/pod-v1#PodStatus" >}}">PodStatus</a>)
  
  最近观察到的 Pod 状态。这些数据可能不是最新的。由系统填充。只读。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## PodSpec {#PodSpec}

<!--
PodSpec is a description of a pod.
-->
PodSpec 是对 Pod 的描述。

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

  **补丁策略：基于 `name` 键合并**
  
  属于 Pod 的容器列表。当前无法添加或删除容器。Pod 中必须至少有一个容器。无法更新。

<!--
- **initContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>)

  *Patch strategy: merge on key `name`*
  
  List of initialization containers belonging to the pod. Init containers are executed in order prior to containers being started. If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy. The name for an init container or normal container must be unique among all containers. Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes. The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit for each resource type, and then using the max of of that value or the sum of the normal containers. Limits are applied to init containers in a similar fashion. Init containers cannot currently be added or removed. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/
-->
- **initContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>)

  **补丁策略：基于 `name` 键合并**

  属于 Pod 的 Init 容器列表。Init 容器在容器启动之前按顺序执行。
  如果任何一个 Init 容器发生故障，则认为该 Pod 失败，并根据其 restartPolicy 处理。
  Init 容器或普通容器的名称在所有容器中必须是唯一的。
  Init 容器不可以有生命周期操作、就绪态探针、存活态探针或启动探针。
  在调度过程中会考虑 Init 容器的资源需求，方法是查找每种资源类型的最高请求/限制，
  然后使用该值的最大值或正常容器的资源请求的总和。
  对资源限制以类似的方式应用于 Init 容器。当前无法添加或删除 Init 容器。无法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/init-containers/

<!--
- **ephemeralContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#EphemeralContainer" >}}">EphemeralContainer</a>)

  *Patch strategy: merge on key `name`*
  
  List of ephemeral containers run in this pod. Ephemeral containers may be run in an existing pod to perform user-initiated actions such as debugging. This list cannot be specified when creating a pod, and it cannot be modified by updating the pod spec. In order to add an ephemeral container to an existing pod, use the pod's ephemeralcontainers subresource.
-->
- **ephemeralContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#EphemeralContainer" >}}">EphemeralContainer</a>)

  **补丁策略：基于 `name` 键合并**
  
  在此 Pod 中运行的临时容器列表。临时容器可以在现有的 Pod 中运行，以执行用户发起的操作，例如调试。
  此列表在创建 Pod 时不能指定，也不能通过更新 Pod 规约来修改。
  要将临时容器添加到现有 Pod，请使用 Pod 的 `ephemeralcontainers` 子资源。

<!--
- **imagePullSecrets** ([]<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

  *Patch strategy: merge on key `name`*
  
  ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec. If specified, these secrets will be passed to individual puller implementations for them to use. More info: https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod
-->
- **imagePullSecrets** ([]<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

  **补丁策略：基于 `name` 键合并**

  imagePullSecrets 是对同一名字空间中 Secret 的引用的列表，用于拉取此 Pod 规约中使用的任何镜像，此字段可选。
  如果指定，这些 Secret 将被传递给各个镜像拉取组件（Puller）实现供其使用。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod

<!--
- **enableServiceLinks** (boolean)

  EnableServiceLinks indicates whether information about services should be injected into pod's environment variables, matching the syntax of Docker links. Optional: Defaults to true.
-->
- **enableServiceLinks** (boolean)

  enableServiceLinks 指示是否应将有关服务的信息注入到 Pod 的环境变量中，服务连接的语法与
  Docker links 的语法相匹配。可选。默认为 true。

<!--
- **os** (PodOS)

  Specifies the OS of the containers in the pod. Some pod and container fields are restricted if this is set.
  
  If the OS field is set to linux, the following fields must be unset: -securityContext.windowsOptions
-->
- **os** (PodOS)

  指定 Pod 中容器的操作系统。如果设置了此属性，则某些 Pod 和容器字段会受到限制。
  
  如果 os 字段设置为 `linux`，则必须不能设置以下字段：
  
  - `securityContext.windowsOptions`

  <!--
  If the OS field is set to windows, following fields must be unset: - spec.hostPID - spec.hostIPC - spec.hostUsers - spec.securityContext.seLinuxOptions - spec.securityContext.seccompProfile - spec.securityContext.fsGroup - spec.securityContext.fsGroupChangePolicy - spec.securityContext.sysctls - spec.shareProcessNamespace - spec.securityContext.runAsUser - spec.securityContext.runAsGroup - spec.securityContext.supplementalGroups - spec.containers[*].securityContext.seLinuxOptions - spec.containers[*].securityContext.seccompProfile - spec.containers[*].securityContext.capabilities - spec.containers[*].securityContext.readOnlyRootFilesystem - spec.containers[*].securityContext.privileged - spec.containers[*].securityContext.allowPrivilegeEscalation - spec.containers[*].securityContext.procMount - spec.containers[*].securityContext.runAsUser - spec.containers[*].securityContext.runAsGroup
  -->

  如果 os 字段设置为 `windows`，则必须不能设置以下字段：

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
  
  **PodOS 定义一个 Pod 的操作系统参数。**

  <!--
  - **os.name** (string), required

    Name is the name of the operating system. The currently supported values are linux and windows. Additional value may be defined in future and can be one of: https://github.com/opencontainers/runtime-spec/blob/master/config.md#platform-specific-configuration Clients should expect to handle additional values and treat unrecognized values in this field as os: null
  -->

  - **os.name** (string)，必需

    name 是操作系统的名称。当前支持的值是 `linux` 和 `windows`。
    将来可能会定义附加值，并且可以是以下之一：
    https://github.com/opencontainers/runtime-spec/blob/master/config.md#platform-specific-configuration
    客户端应该期望处理附加值并将此字段无法识别时视其为 `os: null`。

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

  **补丁策略：retainKeys，基于键 `name` 合并**
  
  可以由属于 Pod 的容器挂载的卷列表。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes

<!--
### Scheduling
-->
### 调度

<!--
- **nodeSelector** (map[string]string)

  NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node's labels for the pod to be scheduled on that node. More info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
-->
- **nodeSelector** (map[string]string)

  nodeSelector 是一个选择算符，这些算符必须取值为 true 才能认为 Pod 适合在节点上运行。
  选择算符必须与节点的标签匹配，以便在该节点上调度 Pod。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/configuration/assign-pod-node/

<!--
- **nodeName** (string)

  NodeName is a request to schedule this pod onto a specific node. If it is non-empty, the scheduler simply schedules this pod onto that node, assuming that it fits resource requirements.
-->
- **nodeName** (string)

  nodeName 是将此 Pod 调度到特定节点的请求。
  如果字段值不为空，调度器只是直接将这个 Pod 调度到所指定节点上，假设节点符合资源要求。

<!--
- **affinity** (Affinity)

  If specified, the pod's scheduling constraints

  *Affinity is a group of affinity scheduling rules.*
-->
- **affinity** (Affinity)

  如果指定了，则作为 Pod 的调度约束。

  <a name="Affinity"></a>
  **Affinity 是一组亲和性调度规则。**

  <!--
  - **affinity.nodeAffinity** (<a href="{{< ref "../workload-resources/pod-v1#NodeAffinity" >}}">NodeAffinity</a>)

    Describes node affinity scheduling rules for the pod.

  - **affinity.podAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAffinity" >}}">PodAffinity</a>)

    Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).

  - **affinity.podAntiAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAntiAffinity" >}}">PodAntiAffinity</a>)

    Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).
  -->

  - **affinity.nodeAffinity** (<a href="{{< ref "../workload-resources/pod-v1#NodeAffinity" >}}">NodeAffinity</a>)

    描述 Pod 的节点亲和性调度规则。

  - **affinity.podAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAffinity" >}}">PodAffinity</a>)

    描述 Pod 亲和性调度规则（例如，将此 Pod 与其他一些 Pod 放在同一节点、区域等）。

  - **affinity.podAntiAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAntiAffinity" >}}">PodAntiAffinity</a>)

    描述 Pod 反亲和性调度规则（例如，避免将此 Pod 与其他一些 Pod 放在相同的节点、区域等）。

<!--
- **tolerations** ([]Toleration)

  If specified, the pod's tolerations.

  *The pod this Toleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*
-->
- **tolerations** ([]Toleration)

  如果设置了此字段，则作为 Pod 的容忍度。

  <a name="Toleration"></a>
  **这个 Toleration 所附加到的 Pod 能够容忍任何使用匹配运算符 `<operator>` 匹配三元组 `<key,value,effect>` 所得到的污点。**

  <!--
  - **tolerations.key** (string)

    Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys.
  -->

  - **tolerations.key** (string)

    key 是容忍度所适用的污点的键名。此字段为空意味着匹配所有的污点键。
    如果 key 为空，则 operator 必须为 `Exists`；这种组合意味着匹配所有值和所有键。
    
  <!--
  - **tolerations.operator** (string)

    Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a pod can tolerate all taints of a particular category.
  -->

  - **tolerations.operator** (string)

    operator 表示 key 与 value 之间的关系。有效的 operator 取值是 `Exists` 和 `Equal`。默认为 `Equal`。
    `Exists` 相当于 value 为某种通配符，因此 Pod 可以容忍特定类别的所有污点。

  <!--
  - **tolerations.value** (string)

    Value is the taint value the toleration matches to. If the operator is Exists, the value should be empty, otherwise just a regular string.
  -->

  - **tolerations.value** (string)

    value 是容忍度所匹配的污点值。如果 operator 为 `Exists`，则此 value 值应该为空，
    否则 value 值应该是一个正常的字符串。

  <!--
  - **tolerations.effect** (string)

    Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.
  -->

  - **tolerations.effect** (string)

    effect 指示要匹配的污点效果。空值意味著匹配所有污点效果。如果要设置此字段，允许的值为
    `NoSchedule`、`PreferNoSchedule` 和 `NoExecute` 之一。

  <!--
  - **tolerations.tolerationSeconds** (int64)

    TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system.
  -->

  - **tolerations.tolerationSeconds** (int64)

    tolerationSeconds 表示容忍度（effect 必须是 `NoExecute`，否则此字段被忽略）容忍污点的时间长度。
    默认情况下，此字段未被设置，这意味着会一直能够容忍对应污点（不会发生驱逐操作）。
    零值和负值会被系统当做 0 值处理（立即触发驱逐）。

<!--
- **schedulerName** (string)

  If specified, the pod will be dispatched by specified scheduler. If not specified, the pod will be dispatched by default scheduler.
-->
- **schedulerName** (string)

  如果设置了此字段，则 Pod 将由指定的调度器调度。如果未指定，则使用默认调度器来调度 Pod。

<!--
- **runtimeClassName** (string)

  RuntimeClassName refers to a RuntimeClass object in the node.k8s.io group, which should be used to run this pod.  If no RuntimeClass resource matches the named class, the pod will not be run. If unset or empty, the "legacy" RuntimeClass will be used, which is an implicit class with an empty definition that uses the default runtime handler. More info: https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class
-->
- **runtimeClassName** (string)

  runtimeClassName 引用 `node.k8s.io` 组中的一个 RuntimeClass 对象，该 RuntimeClass 将被用来运行这个 Pod。
  如果没有 RuntimeClass 资源与所设置的类匹配，则 Pod 将不会运行。
  如果此字段未设置或为空，将使用 "旧版" RuntimeClass。
  "旧版" RuntimeClass 可以视作一个隐式的运行时类，其定义为空，会使用默认运行时处理程序。
  更多信息：
  https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class

<!--
- **priorityClassName** (string)

  If specified, indicates the pod's priority. "system-node-critical" and "system-cluster-critical" are two special keywords which indicate the highest priorities with the former being the highest priority. Any other name must be defined by creating a PriorityClass object with that name. If not specified, the pod priority will be default or zero if there is no default.
-->
- **priorityClassName** (string)

  如果设置了此字段，则用来标明 Pod 的优先级。
  `"system-node-critical"` 和 `"system-cluster-critical"` 是两个特殊关键字，
  分别用来表示两个最高优先级，前者优先级更高一些。
  任何其他名称都必须通过创建具有该名称的 PriorityClass 对象来定义。
  如果未指定此字段，则 Pod 优先级将为默认值。如果没有默认值，则为零。

<!--
- **priority** (int32)

  The priority value. Various system components use this field to find the priority of the pod. When Priority Admission Controller is enabled, it prevents users from setting this field. The admission controller populates this field from PriorityClassName. The higher the value, the higher the priority.
-->
- **priority** (int32)

  优先级值。各种系统组件使用该字段来确定 Pod 的优先级。当启用 Priority 准入控制器时，
  该控制器会阻止用户设置此字段。准入控制器基于 priorityClassName 设置来填充此字段。
  字段值越高，优先级越高。

<!--
- **preemptionPolicy** (string)

  PreemptionPolicy is the Policy for preempting pods with lower priority. One of Never, PreemptLowerPriority. Defaults to PreemptLowerPriority if unset.
-->
- **preemptionPolicy** (string)

  preemptionPolicy 是用来抢占优先级较低的 Pod 的策略。取值为 `"Never"`、`"PreemptLowerPriority"` 之一。
  如果未设置，则默认为 `"PreemptLowerPriority"`。

<!--
- **topologySpreadConstraints** ([]TopologySpreadConstraint)

  *Patch strategy: merge on key `topologyKey`*
  
  *Map: unique values on keys `topologyKey, whenUnsatisfiable` will be kept during a merge*
  
  TopologySpreadConstraints describes how a group of pods ought to spread across topology domains. Scheduler will schedule pods in a way which abides by the constraints. All topologySpreadConstraints are ANDed.

  *TopologySpreadConstraint specifies how to spread matching pods among the given topology.*
-->
- **topologySpreadConstraints** ([]TopologySpreadConstraint)

  **补丁策略：基于 `topologyKey` 键合并**
  
  **映射：`topologyKey, whenUnsatisfiable` 键组合的唯一值 將在合并期间保留**
  
  TopologySpreadConstraints 描述一组 Pod 应该如何跨拓扑域来分布。调度器将以遵从此约束的方式来调度 Pod。
  所有 topologySpreadConstraints 条目会通过逻辑与操作进行组合。

  <a name="TopologySpreadConstraint"></a>
  **TopologySpreadConstraint 指定如何在规定的拓扑下分布匹配的 Pod。**

  <!--
  - **topologySpreadConstraints.maxSkew** (int32), required

    MaxSkew describes the degree to which pods may be unevenly distributed. When `whenUnsatisfiable=DoNotSchedule`, it is the maximum permitted difference between the number of matching pods in the target topology and the global minimum. The global minimum is the minimum number of matching pods in an eligible domain or zero if the number of eligible domains is less than MinDomains. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 2/2/1: In this case, the global minimum is 1. | zone1 | zone2 | zone3 | |  P P  |  P P  |   P   | - if MaxSkew is 1, incoming pod can only be scheduled to zone3 to become 2/2/2; scheduling it onto zone1(zone2) would make the ActualSkew(3-1) on zone1(zone2) violate MaxSkew(1). - if MaxSkew is 2, incoming pod can be scheduled onto any zone. When `whenUnsatisfiable=ScheduleAnyway`, it is used to give higher precedence to topologies that satisfy it. It's a required field. Default value is 1 and 0 is not allowed.
  -->

  - **topologySpreadConstraints.maxSkew** (int32)，必需

    maxSkew 描述 Pod 可能分布不均衡的程度。当 `whenUnsatisfiable=DoNotSchedule` 时，
    此字段值是目标拓扑中匹配的 Pod 数量与全局最小值之间的最大允许差值。
    全局最小值是候选域中匹配 Pod 的最小数量，如果候选域的数量小于 `minDomains`，则为零。
    例如，在一个包含三个可用区的集群中，maxSkew 设置为 1，具有相同 `labelSelector` 的 Pod 分布为 2/2/1：
    在这种情况下，全局最小值为 1。

    ```
    | zone1 | zone2 | zone3 |
    | PP    | PP    |  P    |
    ```

    - 如果 maxSkew 为 1，传入的 Pod 只能调度到 "zone3"，变成 2/2/2；
      将其调度到 "zone1"（"zone2"）将使"zone1"（"zone2"）上的实际偏差（Actual Skew）为 3-1，进而违反
      maxSkew 限制（1）。
    - 如果 maxSkew 为 2，则可以将传入的 Pod 调度到任何区域。

    当 `whenUnsatisfiable=ScheduleAnyway` 时，此字段被用来给满足此约束的拓扑域更高的优先级。

    此字段是一个必填字段。默认值为 1，不允许为 0。

  <!--
  - **topologySpreadConstraints.topologyKey** (string), required

    TopologyKey is the key of node labels. Nodes that have a label with this key and identical values are considered to be in the same topology. We consider each \<key, value> as a "bucket", and try to put balanced number of pods into each bucket. We define a domain as a particular instance of a topology. Also, we define an eligible domain as a domain whose nodes meet the requirements of nodeAffinityPolicy and nodeTaintsPolicy. e.g. If TopologyKey is "kubernetes.io/hostname", each Node is a domain of that topology. And, if TopologyKey is "topology.kubernetes.io/zone", each zone is a domain of that topology. It's a required field.
  -->

  - **topologySpreadConstraints.topologyKey** (string)，必需

    topologyKey 是节点标签的键名。如果节点的标签中包含此键名且键值亦相同，则被认为在相同的拓扑域中。
    我们将每个 `<键, 值>` 视为一个 "桶（Bucket）"，并尝试将数量均衡的 Pod 放入每个桶中。
    我们定义域（Domain）为拓扑域的特定实例。
    此外，我们定义一个候选域（Eligible Domain）为其节点与 nodeAffinityPolicy 和 nodeTaintsPolicy 的要求匹配的域。
    例如，如果 topologyKey 是 `"kubernetes.io/hostname"`，则每个 Node 都是该拓扑的域。
    而如果 topologyKey 是 `"topology.kubernetes.io/zone"`，则每个区域都是该拓扑的一个域。
    这是一个必填字段。

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

    whenUnsatisfiable 表示如果 Pod 不满足分布约束，如何处理它。

    - `DoNotSchedule`（默认）：告诉调度器不要调度它。
    - `ScheduleAnyway`：告诉调度器将 Pod 调度到任何位置，但给予能够降低偏差的拓扑更高的优先级。

    当且仅当该 Pod 的每个可能的节点分配都会违反某些拓扑对应的 "maxSkew" 时，
    才认为传入 Pod 的约束是 "不可满足的"。

    例如，在一个包含三个区域的集群中，maxSkew 设置为 1，具有相同 labelSelector 的 Pod 分布为 3/1/1：

    ```
    | zone1 | zone2 | zone3 |
    | P P P | P     | P     |
    ```

    如果 whenUnsatisfiable 设置为 `DoNotSchedule`，则传入的 Pod 只能调度到 "zone2"（"zone3"），
    Pod 分布变成 3/2/1（3/1/2），因为 "zone2"（"zone3"）上的实际偏差（Actual Skew） 为 2-1，
    满足 maxSkew 约束（1）。
    换句话说，集群仍然可以不平衡，但调度器不会使其**更加地**不平衡。

    这是一个必填字段。

  <!--
  - **topologySpreadConstraints.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    LabelSelector is used to find matching pods. Pods that match this label selector are counted to determine the number of pods in their corresponding topology domain.
  -->

  - **topologySpreadConstraints.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    labelSelector 用于识别匹配的 Pod。对匹配此标签选择算符的 Pod 进行计数，
    以确定其相应拓扑域中的 Pod 数量。

  <!--
  - **topologySpreadConstraints.matchLabelKeys** ([]string)

    *Atomic: will be replaced during a merge*
    
    MatchLabelKeys is a set of pod label keys to select the pods over which spreading will be calculated. The keys are used to lookup values from the incoming pod labels, those key-value labels are ANDed with labelSelector to select the group of existing pods over which spreading will be calculated for the incoming pod.  The same key is forbidden to exist in both MatchLabelKeys and LabelSelector. MatchLabelKeys cannot be set when LabelSelector isn't set. Keys that don't exist in the incoming pod labels will be ignored. A null or empty list means only match against labelSelector.
    This is a beta field and requires the MatchLabelKeysInPodTopologySpread feature gate to be enabled (enabled by default).
  -->
  - **topologySpreadConstraints.matchLabelKeys** ([]string)

    **原子性：将在合并期间被替换**
    
    matchLabelKeys 是一组 Pod 标签键，用于通过计算 Pod 分布方式来选择 Pod。
    新 Pod 标签中不存在的键将被忽略。这些键用于从新来的 Pod 标签中查找值，这些键值标签与 labelSelector 进行逻辑与运算，
    通过计算 Pod 的分布方式来选择现有 Pod 的组。matchLabelKeys 和 labelSelector
    中禁止存在相同的键。未设置 labelSelector 时无法设置 matchLabelKeys。
    新来的 Pod 标签中不存在的键将被忽略。null 或空的列表意味着仅与 labelSelector 匹配。

    这是一个 Beta 字段，需要启用 MatchLabelKeysInPodTopologySpread 特性门控（默认启用）。
  <!--
  - **topologySpreadConstraints.minDomains** (int32)

    MinDomains indicates a minimum number of eligible domains. When the number of eligible domains with matching topology keys is less than minDomains, Pod Topology Spread treats "global minimum" as 0, and then the calculation of Skew is performed. And when the number of eligible domains with matching topology keys equals or greater than minDomains, this value has no effect on scheduling. As a result, when the number of eligible domains is less than minDomains, scheduler won't schedule more than maxSkew Pods to those domains. If value is nil, the constraint behaves as if MinDomains is equal to 1. Valid values are integers greater than 0. When value is not nil, WhenUnsatisfiable must be DoNotSchedule.
    
    For example, in a 3-zone cluster, MaxSkew is set to 2, MinDomains is set to 5 and pods with the same labelSelector spread as 2/2/2: | zone1 | zone2 | zone3 | |  P P  |  P P  |  P P  | The number of domains is less than 5(MinDomains), so "global minimum" is treated as 0. In this situation, new pod with the same labelSelector cannot be scheduled, because computed skew will be 3(3 - 0) if new Pod is scheduled to any of the three zones, it will violate MaxSkew.
    
    This is a beta field and requires the MinDomainsInPodTopologySpread feature gate to be enabled (enabled by default).
  -->

  - **topologySpreadConstraints.minDomains** (int32)

    minDomains 表示符合条件的域的最小数量。当符合拓扑键的候选域个数小于 minDomains 时，
    Pod 拓扑分布特性会将 "全局最小值" 视为 0，然后进行偏差的计算。
    当匹配拓扑键的候选域的数量等于或大于 minDomains 时，此字段的值对调度没有影响。
    因此，当候选域的数量少于 minDomains 时，调度程序不会将超过 maxSkew 个 Pods 调度到这些域。
    如果字段值为 nil，所表达的约束为 minDomains 等于 1。
    字段的有效值为大于 0 的整数。当字段值不为 nil 时，whenUnsatisfiable 必须为 `DoNotSchedule`。
    
    例如，在一个包含三个区域的集群中，maxSkew 设置为 2，minDomains 设置为 5，具有相同 labelSelector
    的 Pod 分布为 2/2/2：

    ```
    | zone1 | zone2 | zone3 |
    | PP    | PP    | PP    |
    ```

    域的数量小于 5（minDomains 取值），因此"全局最小值"被视为 0。
    在这种情况下，无法调度具有相同 labelSelector 的新 Pod，因为如果基于新 Pod 计算的偏差值将为
    3（3-0）。将这个 Pod 调度到三个区域中的任何一个，都会违反 maxSkew 约束。
    
    此字段是一个 Beta 字段，需要启用 MinDomainsInPodTopologySpread 特性门控（默认被启用）。

  <!--
  - **topologySpreadConstraints.nodeAffinityPolicy** (string)

    NodeAffinityPolicy indicates how we will treat Pod's nodeAffinity/nodeSelector when calculating pod topology spread skew. Options are: - Honor: only nodes matching nodeAffinity/nodeSelector are included in the calculations. - Ignore: nodeAffinity/nodeSelector are ignored. All nodes are included in the calculations.
    
    If this value is nil, the behavior is equivalent to the Honor policy. This is a beta-level feature default enabled by the NodeInclusionPolicyInPodTopologySpread feature flag.
  -->

  - **topologySpreadConstraints.nodeAffinityPolicy** (string)

    nodeAffinityPolicy 表示我们在计算 Pod 拓扑分布偏差时将如何处理 Pod 的 nodeAffinity/nodeSelector。
    选项为：
    - Honor：只有与 nodeAffinity/nodeSelector 匹配的节点才会包括到计算中。
    - Ignore：nodeAffinity/nodeSelector 被忽略。所有节点均包括到计算中。

    如果此值为 nil，此行为等同于 Honor 策略。
    这是通过 NodeInclusionPolicyInPodTopologySpread 特性标志默认启用的 Beta 级别特性。

  <!--
  - **topologySpreadConstraints.nodeTaintsPolicy** (string)

    NodeTaintsPolicy indicates how we will treat node taints when calculating pod topology spread skew. Options are: - Honor: nodes without taints, along with tainted nodes for which the incoming pod has a toleration, are included. - Ignore: node taints are ignored. All nodes are included.
    
    If this value is nil, the behavior is equivalent to the Ignore policy. This is a beta-level feature default enabled by the NodeInclusionPolicyInPodTopologySpread feature flag.
  -->
  - **topologySpreadConstraints.nodeTaintsPolicy** (string)

    nodeTaintsPolicy 表示我们在计算 Pod 拓扑分布偏差时将如何处理节点污点。选项为：
    - Honor：包括不带污点的节点以及新来 Pod 具有容忍度且带有污点的节点。
    - Ignore：节点污点被忽略。包括所有节点。
    
    如果此值为 nil，此行为等同于 Ignore 策略。
    这是通过 NodeInclusionPolicyInPodTopologySpread 特性标志默认启用的 Beta 级别特性。

<!--
- **overhead** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Overhead represents the resource overhead associated with running a pod for a given RuntimeClass. This field will be autopopulated at admission time by the RuntimeClass admission controller. If the RuntimeClass admission controller is enabled, overhead must not be set in Pod create requests. The RuntimeClass admission controller will reject Pod create requests which have the overhead already set. If RuntimeClass is configured and selected in the PodSpec, Overhead will be set to the value defined in the corresponding RuntimeClass, otherwise it will remain unset and treated as zero. More info: https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md
-->
- **overhead** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  overhead 表示与用指定 RuntimeClass 运行 Pod 相关的资源开销。
  该字段将由 RuntimeClass 准入控制器在准入时自动填充。
  如果启用了 RuntimeClass 准入控制器，则不得在 Pod 创建请求中设置 overhead 字段。
  RuntimeClass 准入控制器将拒绝已设置 overhead 字段的 Pod 创建请求。
  如果在 Pod 规约中配置并选择了 RuntimeClass，overhead 字段将被设置为对应 RuntimeClass 中定义的值，
  否则将保持不设置并视为零。更多信息：
  https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md

<!--
### Lifecycle
-->

### 生命周期

<!--
- **restartPolicy** (string)

  Restart policy for all containers within the pod. One of Always, OnFailure, Never. In some contexts, only a subset of those values may be permitted. Default to Always. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy
-->
- **restartPolicy** (string)

  Pod 内所有容器的重启策略。`Always`、`OnFailure`、`Never` 之一。
  在某些情况下，可能只允许这些值的一个子集。默认为 `Always`。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

<!--
- **terminationGracePeriodSeconds** (int64)

  Optional duration in seconds the pod needs to terminate gracefully. May be decreased in delete request. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). If this value is nil, the default grace period will be used instead. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. Defaults to 30 seconds.
-->
- **terminationGracePeriodSeconds** (int64)

  可选字段，表示 Pod 需要体面终止的所需的时长（以秒为单位）。字段值可以在删除请求中减少。
  字段值必须是非负整数。零值表示收到 kill 信号则立即停止（没有机会关闭）。
  如果此值为 nil，则将使用默认宽限期。
  宽限期是从 Pod 中运行的进程收到终止信号后，到进程被 kill 信号强制停止之前，Pod 可以继续存在的时间（以秒为单位）。
  应该将此值设置为比你的进程的预期清理时间更长。默认为 30 秒。

<!--
- **activeDeadlineSeconds** (int64)

  Optional duration in seconds the pod may be active on the node relative to StartTime before the system will actively try to mark it failed and kill associated containers. Value must be a positive integer.
-->
- **activeDeadlineSeconds** (int64)

  在系统将主动尝试将此 Pod 标记为已失败并杀死相关容器之前，Pod 可能在节点上活跃的时长；
  时长计算基于 startTime 计算（以秒为单位）。字段值必须是正整数。

<!--
- **readinessGates** ([]PodReadinessGate)

  If specified, all readiness gates will be evaluated for pod readiness. A pod is ready when all its containers are ready AND all conditions specified in the readiness gates have status equal to "True" More info: https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates

  *PodReadinessGate contains the reference to a pod condition*
-->
- **readinessGate** ([]PodReadinessGate)

  如果设置了此字段，则将评估所有就绪门控（Readiness Gate）以确定 Pod 就绪状况。
  当所有容器都已就绪，并且就绪门控中指定的所有状况的 status 都为 "true" 时，Pod 被视为就绪。
  更多信息： https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates

  <a name="PodReadinessGate"></a>
  **PodReadinessGate 包含对 Pod 状况的引用**

  <!--
  - **readinessGates.conditionType** (string), required

    ConditionType refers to a condition in the pod's condition list with matching type.
  -->

  - **readinessGates.conditionType** (string)，必需

    conditionType 是指 Pod 的状况列表中类型匹配的状况。

<!--
### Hostname and Name resolution
-->
### 主机名和名称解析

<!--
- **hostname** (string)

  Specifies the hostname of the Pod If not specified, the pod's hostname will be set to a system-defined value.
-->
- **hostname**  (string)

  指定 Pod 的主机名。如果此字段未指定，则 Pod 的主机名将设置为系统定义的值。

<!--
- **setHostnameAsFQDN** (boolean)

  If true the pod's hostname will be configured as the pod's FQDN, rather than the leaf name (the default). In Linux containers, this means setting the FQDN in the hostname field of the kernel (the nodename field of struct utsname). In Windows containers, this means setting the registry value of hostname for the registry key HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters to FQDN. If a pod does not have FQDN, this has no effect. Default to false.
-->
- **setHostnameAsFQDN** (boolean)

  如果为 true，则 Pod 的主机名将配置为 Pod 的 FQDN，而不是叶名称（默认值）。
  在 Linux 容器中，这意味着将内核的 hostname 字段（struct utsname 的 nodename 字段）设置为 FQDN。
  在 Windows 容器中，这意味着将注册表项 `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters`
  的 hostname 键设置为 FQDN。如果 Pod 没有 FQDN，则此字段不起作用。
  默认为 false。

<!--
- **subdomain** (string)

  If specified, the fully qualified Pod hostname will be "\<hostname>.\<subdomain>.\<pod namespace>.svc.\<cluster domain>". If not specified, the pod will not have a domainname at all.
-->
- **subdomain** (string)

  如果设置了此字段，则完全限定的 Pod 主机名将是 `<hostname>.<subdomain>.<Pod 名字空间>.svc.<集群域名>`。
  如果未设置此字段，则该 Pod 将没有域名。

<!--
- **hostAliases** ([]HostAlias)

  *Patch strategy: merge on key `ip`*
  
  HostAliases is an optional list of hosts and IPs that will be injected into the pod's hosts file if specified. This is only valid for non-hostNetwork pods.

  *HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.*
-->
- **hostAliases** ([]HostAlias)

  **补丁策略：基于 `ip` 键合并**
  
  hostAliases 是一个可选的列表属性，包含要被注入到 Pod 的 hosts 文件中的主机和 IP 地址。
  这仅对非 hostNetwork Pod 有效。

  <a name="HostAlias"></a>
  **HostAlias 结构保存 IP 和主机名之间的映射，这些映射将作为 Pod 的 hosts 文件中的条目注入。**

  <!--
  - **hostAliases.hostnames** ([]string)

    Hostnames for the above IP address.

  - **hostAliases.ip** (string)

    IP address of the host file entry.
  -->

  - **hostAliases.hostnames** ([]string)

    指定 IP 地址对应的主机名。

  - **hostAliases.ip** (string)

    主机文件条目的 IP 地址。

<!--
- **dnsConfig** (PodDNSConfig)

  Specifies the DNS parameters of a pod. Parameters specified here will be merged to the generated DNS configuration based on DNSPolicy.
-->
- **dnsConfig** (PodDNSConfig)

  指定 Pod 的 DNS 参数。此处指定的参数将被合并到基于 dnsPolicy 生成的 DNS 配置中。

  <a name="PodDNSConfig"></a>
  <!--
  *PodDNSConfig defines the DNS parameters of a pod in addition to those generated from DNSPolicy.*
  -->
  **PodDNSConfig 定义 Pod 的 DNS 参数，这些参数独立于基于 dnsPolicy 生成的参数。**

  <!--
  - **dnsConfig.nameservers** ([]string)

    A list of DNS name server IP addresses. This will be appended to the base nameservers generated from DNSPolicy. Duplicated nameservers will be removed.
  -->

  - **dnsConfig.nameservers** ([]string)

    DNS 名字服务器的 IP 地址列表。此列表将被追加到基于 dnsPolicy 生成的基本名字服务器列表。
    重复的名字服务器将被删除。

  <!--
  - **dnsConfig.options** ([]PodDNSConfigOption)

    A list of DNS resolver options. This will be merged with the base options generated from DNSPolicy. Duplicated entries will be removed. Resolution options given in Options will override those that appear in the base DNSPolicy.
  -->

  - **dnsConfig.options** ([]PodDNSConfigOption)

    DNS 解析器选项列表。此处的选项将与基于 dnsPolicy 所生成的基本选项合并。重复的条目将被删除。
    options 中所给出的解析选项将覆盖基本 dnsPolicy 中出现的对应选项。

    <a name="PodDNSConfigOption"></a>
    <!--
    *PodDNSConfigOption defines DNS resolver options of a pod.*
    -->

    **PodDNSConfigOption 定义 Pod 的 DNS 解析器选项。**

    <!--
    - **dnsConfig.options.name** (string)

      Required.

    - **dnsConfig.options.value** (string)
    -->

    - **dnsConfig.options.name** (string)

      必需字段。

    - **dnsConfig.options.value** (string)

      选项取值。

  <!--
  - **dnsConfig.searches** ([]string)

    A list of DNS search domains for host-name lookup. This will be appended to the base search paths generated from DNSPolicy. Duplicated search paths will be removed.
  -->

  - **dnsConfig.searches** ([]string)

    用于主机名查找的 DNS 搜索域列表。这一列表将被追加到基于 dnsPolicy 生成的基本搜索路径列表。
    重复的搜索路径将被删除。

<!--
- **dnsPolicy** (string)

  Set DNS policy for the pod. Defaults to "ClusterFirst". Valid values are 'ClusterFirstWithHostNet', 'ClusterFirst', 'Default' or 'None'. DNS parameters given in DNSConfig will be merged with the policy selected with DNSPolicy. To have DNS options set along with hostNetwork, you have to specify DNS policy explicitly to 'ClusterFirstWithHostNet'.
-->
- **dnsPolicy** (string)

  为 Pod 设置 DNS 策略。默认为 `"ClusterFirst"`。
  有效值为 `"ClusterFirstWithHostNet"`、`"ClusterFirst"`、`"Default"` 或 `"None"`。
  dnsConfig 字段中给出的 DNS 参数将与使用 dnsPolicy 字段所选择的策略合并。
  要针对 hostNetwork 的 Pod 设置 DNS 选项，你必须将 DNS 策略显式设置为 `"ClusterFirstWithHostNet"`。

<!--
### Hosts namespaces
-->
### 主机名字空间

<!--
- **hostNetwork** (boolean)

  Host networking requested for this pod. Use the host's network namespace. If this option is set, the ports that will be used must be specified. Default to false.

- **hostPID** (boolean)

  Use the host's pid namespace. Optional: Default to false.
-->
- **hostNetwork** (boolean)

  为此 Pod 请求主机层面联网支持。使用主机的网络名字空间。
  如果设置了此选项，则必须指定将使用的端口。默认为 false。

- **hostPID** (boolean)

  使用主机的 PID 名字空间。可选：默认为 false。

<!--
- **hostIPC** (boolean)

  Use the host's ipc namespace. Optional: Default to false.

- **shareProcessNamespace** (boolean)

  Share a single process namespace between all of the containers in a pod. When this is set containers will be able to view and signal processes from other containers in the same pod, and the first process in each container will not be assigned PID 1. HostPID and ShareProcessNamespace cannot both be set. Optional: Default to false.
-->
- **hostIPC** (boolean)

  使用主机的 IPC 名字空间。可选：默认为 false。

- **shareProcessNamespace** (boolean)

  在 Pod 中的所有容器之间共享单个进程名字空间。设置了此字段之后，容器将能够查看来自同一 Pod 中其他容器的进程并发出信号，
  并且每个容器中的第一个进程不会被分配 PID 1。`hostPID` 和 `shareProcessNamespace` 不能同时设置。
  可选：默认为 false。

<!--
### Service account
-->
### 服务账号

<!--
- **serviceAccountName** (string)

  ServiceAccountName is the name of the ServiceAccount to use to run this pod. More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/

- **automountServiceAccountToken** (boolean)

  AutomountServiceAccountToken indicates whether a service account token should be automatically mounted.
-->
- **serviceAccountName** (string)

  serviceAccountName 是用于运行此 Pod 的服务账号的名称。更多信息：
  https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/configure-service-account/

- **automountServiceAccountToken** (boolean)

  automountServiceAccountToken 指示是否应自动挂载服务帐户令牌。

<!--
### Security context
-->
### 安全上下文

<!--
- **securityContext** (PodSecurityContext)

  SecurityContext holds pod-level security attributes and common container settings. Optional: Defaults to empty.  See type description for default values of each field.
-->

- **securityContext** (PodSecurityContext)

  SecurityContext 包含 Pod 级别的安全属性和常见的容器设置。
  可选：默认为空。每个字段的默认值见类型描述。

  <!--
  *PodSecurityContext holds pod-level security attributes and common container settings. Some fields are also present in container.securityContext.  Field values of container.securityContext take precedence over field values of PodSecurityContext.*
  -->

  <a name="PodSecurityContext"></a>
  **PodSecurityContext 包含 Pod 级别的安全属性和常用容器设置。**
  **一些字段也存在于 `container.securityContext` 中。`container.securityContext`**
  **中的字段值优先于 PodSecurityContext 的字段值。**

  <!--
  - **securityContext.runAsUser** (int64)

    The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.runAsUser** (int64)

    运行容器进程入口点（Entrypoint）的 UID。如果未指定，则默认为镜像元数据中指定的用户。
    也可以在 SecurityContext 中设置。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在对应容器中所设置的 SecurityContext 值优先。
    注意，`spec.os.name` 为 "windows" 时不能设置此字段。

  <!--
  - **securityContext.runAsNonRoot** (boolean)

    Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
  -->

  - **securityContext.runAsNonRoot** (boolean)

    指示容器必须以非 root 用户身份运行。如果为 true，kubelet 将在运行时验证镜像，
    以确保它不会以 UID 0（root）身份运行。如果镜像中确实使用 root 账号启动，则容器无法被启动。
    如果此字段未设置或为 false，则不会执行此类验证。也可以在 SecurityContext 中设置。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。

  <!--
  - **securityContext.runAsGroup** (int64)

    The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.runAsGroup** (int64)

    运行容器进程入口点（Entrypoint）的 GID。如果未设置，则使用运行时的默认值。
    也可以在 SecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，
    则在对应容器中设置的 SecurityContext 值优先。
    注意，`spec.os.name` 为 "windows" 时不能设置该字段。

  <!--
  - **securityContext.supplementalGroups** ([]int64)

    A list of groups applied to the first process run in each container, in addition to the container's primary GID, the fsGroup (if specified), and group memberships defined in the container image for the uid of the container process. If unspecified, no additional groups are added to any container. Note that group memberships defined in the container image for the uid of the container process are still effective, even if they are not included in this list. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.supplementalGroups** ([]int64)
  
    此字段包含将应用到每个容器中运行的第一个进程的组列表。
    容器进程的组成员身份取决于容器的主 GID、fsGroup（如果指定了的话）
    和在容器镜像中为容器进程的 uid 定义的组成员身份，以及这里所给的列表。

    如果未指定，则不会向任何容器添加其他组。
    注意，在容器镜像中为容器进程的 uid 定义的组成员身份仍然有效，
    即使它们未包含在此列表中也是如此。
    注意，当 `spec.os.name` 为 `windows` 时，不能设置此字段。

  <!--
  - **securityContext.fsGroup** (int64)

    A special supplemental group that applies to all containers in a pod. Some volume types allow the Kubelet to change the ownership of that volume to be owned by the pod:
    
    1. The owning GID will be the FSGroup 2. The setgid bit is set (new files created in the volume will be owned by FSGroup) 3. The permission bits are OR'd with rw-rw----
    
    If unset, the Kubelet will not modify the ownership and permissions of any volume. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.fsGroup** (int64)

    应用到 Pod 中所有容器的特殊补充组。某些卷类型允许 kubelet 将该卷的所有权更改为由 Pod 拥有：
    
    1. 文件系统的属主 GID 将是 fsGroup 字段值
    2. `setgid` 位已设置（在卷中创建的新文件将归 fsGroup 所有）
    3. 权限位将与 `rw-rw----` 进行按位或操作
    
    如果未设置此字段，kubelet 不会修改任何卷的所有权和权限。
    注意，`spec.os.name` 为 "windows" 时不能设置此字段。

  <!--
  - **securityContext.fsGroupChangePolicy** (string)

    fsGroupChangePolicy defines behavior of changing ownership and permission of the volume before being exposed inside Pod. This field will only apply to volume types which support fsGroup based ownership(and permissions). It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir. Valid values are "OnRootMismatch" and "Always". If not specified, "Always" is used. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.fsGroupChangePolicy** (string)

    fsGroupChangePolicy 定义了在卷被在 Pod 中暴露之前更改其属主和权限的行为。
    此字段仅适用于支持基于 fsGroup 的属主权（和权限）的卷类型。它不会影响临时卷类型，
    例如：`secret`、`configmap` 和 `emptydir`。
    有效值为 `"OnRootMismatch"` 和 `"Always"`。如果未设置，则使用 `"Always"`。
    注意，`spec.os.name` 为 "windows" 时不能设置此字段。

  <!--
  - **securityContext.seccompProfile** (SeccompProfile)

    The seccomp options to use by the containers in this pod. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.seccompProfile** (SeccompProfile)

    此 Pod 中的容器使用的 seccomp 选项。注意，`spec.os.name` 为 "windows" 时不能设置此字段。

    <!--
    *SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.*
    -->

    **SeccompProfile 定义 Pod 或容器的 seccomp 配置文件设置。只能设置一个配置文件源。**

    <!--
    - **securityContext.seccompProfile.type** (string), required

      type indicates which kind of seccomp profile will be applied. Valid options are:
      
      Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.
    -->

    - **securityContext.seccompProfile.type** (string)，必需

      type 标明将应用哪种 seccomp 配置文件。有效的选项有：

      - `Localhost` - 应使用在节点上的文件中定义的配置文件。
      - `RuntimeDefault` - 应使用容器运行时默认配置文件。
      - `Unconfined` - 不应应用任何配置文件。

    <!--
    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must be set if type is "Localhost". Must NOT be set for any other type.
    -->

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile 指示应使用在节点上的文件中定义的配置文件。该配置文件必须在节点上预先配置才能工作。
      必须是相对于 kubelet 配置的 seccomp 配置文件位置的下降路径。
      仅当 type 为 `"Localhost"` 时才必须设置。不得为任何其他类别设置此字段。

  <!--
  - **securityContext.seLinuxOptions** (SELinuxOptions)

    The SELinux context to be applied to all containers. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.seLinuxOptions** (SELinuxOptions)

    应用于所有容器的 SELinux 上下文。如果未设置，容器运行时将为每个容器分配一个随机 SELinux 上下文。
    也可以在 SecurityContext 中设置。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在对应容器中设置的 SecurityContext 值优先。
    注意，`spec.os.name` 为 "windows" 时不能设置该字段。

    <!--
    *SELinuxOptions are the labels to be applied to the container*
    -->

    <a name="SELinuxOptions"></a>
    **SELinuxOptions 是要应用于容器的标签**

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

      level 是应用于容器的 SELinux 级别标签。

    - **securityContext.seLinuxOptions.role** (string)

      role 是应用于容器的 SELinux 角色标签。

    - **securityContext.seLinuxOptions.type** (string)

      type 是适用于容器的 SELinux 类型标签。

    - **securityContext.seLinuxOptions.user** (string)

      user 是应用于容器的 SELinux 用户标签。

  <!--
  - **securityContext.sysctls** ([]Sysctl)

    Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported sysctls (by the container runtime) might fail to launch. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.sysctls** ([]Sysctl)

    sysctls 包含用于 Pod 的名字空间 sysctl 列表。具有不受（容器运行时）支持的 sysctl 的 Pod 可能无法启动。
    注意，`spec.os.name` 为 "windows" 时不能设置此字段。

    <!--
    *Sysctl defines a kernel parameter to be set*
    -->

    <a name="Sysctl"></a>
    **Sysctl 定义要设置的内核参数**

    <!--
    - **securityContext.sysctls.name** (string), required

      Name of a property to set

    - **securityContext.sysctls.value** (string), required

      Value of a property to set
    -->

    - **securityContext.sysctls.name** (string)，必需

      要设置的属性的名称。

    - **securityContext.sysctls.value** (string)，必需

      要设置的属性值。

  <!--
  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    The Windows specific settings applied to all containers. If unspecified, the options within a container's SecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.
  -->

  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    要应用到所有容器上的、特定于 Windows 的设置。
    如果未设置此字段，将使用容器的 SecurityContext 中的选项。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。
    注意，`spec.os.name` 为 "linux" 时不能设置该字段。

    <!--
    *WindowsSecurityContextOptions contain Windows-specific options and credentials.*
    -->

    <a name="WindowsSecurityContextOptions"></a>
    **WindowsSecurityContextOptions 包含特定于 Windows 的选项和凭据。**

    <!--
    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName is the name of the GMSA credential spec to use.
    -->

    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      gmsaCredentialSpec 是 [GMSA 准入 Webhook](https://github.com/kubernetes-sigs/windows-gmsa)
      内嵌由 gmsaCredentialSpecName 字段所指定的 GMSA 凭证规约内容的地方。

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      gmsaCredentialSpecName 是要使用的 GMSA 凭证规约的名称。

    <!--
    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess determines if a container should be run as a 'Host Process' container. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers). In addition, if HostProcess is true then HostNetwork must also be set to true.
    -->

    - **securityContext.windowsOptions.hostProcess** (boolean)

      hostProcess 确定容器是否应作为"主机进程"容器运行。
      一个 Pod 的所有容器必须具有相同的有效 hostProcess 值（不允许混合设置了 hostProcess
      的容器和未设置 hostProcess 容器）。
      此外，如果 hostProcess 为 true，则 hostNetwork 也必须设置为 true。

    <!--
    - **securityContext.windowsOptions.runAsUserName** (string)

      The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
    -->

    - **securityContext.windowsOptions.runAsUserName** (string)

      Windows 中用来运行容器进程入口点的用户名。如果未设置，则默认为镜像元数据中指定的用户。
      也可以在 PodSecurityContext 中设置。
      如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。

<!--
### Alpha level
-->
### Alpha 级别

<!--
- **hostUsers** (boolean)

  Use the host's user namespace. Optional: Default to true. If set to true or not present, the pod will be run in the host user namespace, useful for when the pod needs a feature only available to the host user namespace, such as loading a kernel module with CAP_SYS_MODULE. When set to false, a new userns is created for the pod. Setting false is useful for mitigating container breakout vulnerabilities even allowing users to run their containers as root without actually having root privileges on the host. This field is alpha-level and is only honored by servers that enable the UserNamespacesSupport feature.
-->
- **hostUsers** (boolean)

  使用主机的用户名字空间。可选：默认为 true。如果设置为 true 或不存在，则 Pod 将运行在主机的用户名字空间中，
  当 Pod 需要仅对主机用户名字空间可用的一个特性时这会很有用，例如使用 CAP_SYS_MODULE 加载内核模块。
  当设置为 false 时，会为该 Pod 创建一个新的用户名字空间。
  设置为 false 对于缓解容器逃逸漏洞非常有用，可防止允许实际在主机上没有 root 特权的用户以 root 运行他们的容器。
  此字段是 Alpha 级别的字段，只有启用 UserNamespacesSupport 特性的服务器才能使用此字段。

<!--
- **resourceClaims** ([]PodResourceClaim)

  *Patch strategies: retainKeys, merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
-->
- **resourceClaims** ([]PodResourceClaim)

  **补丁策略：retainKeys，基于键 `name` 合并**

  **映射：键 `name` 的唯一值将在合并过程中保留**

<!--
  ResourceClaims defines which ResourceClaims must be allocated and reserved before the Pod is allowed to start. The resources will be made available to those containers which consume them by name.
  
  This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.
  
  This field is immutable.
-->
  resourceClaims 定义了在允许 Pod 启动之前必须分配和保留哪些 ResourceClaims。
  这些资源将可供那些按名称使用它们的容器使用。

  这是一个 Alpha 特性的字段，需要启用 DynamicResourceAllocation 特性门控来开启此功能。

  此字段不可变更。

  <a name="PodResourceClaim"></a>
  <!--
  *PodResourceClaim references exactly one ResourceClaim through a ClaimSource. It adds a name to it that uniquely identifies the ResourceClaim inside the Pod. Containers that need access to the ResourceClaim reference it with this name.*
  -->
  **PodResourceClaim 通过 ClaimSource 引用一个 ResourceClaim。
  它为 ClaimSource 添加一个名称，作为 Pod 内 ResourceClaim 的唯一标识。
  需要访问 ResourceClaim 的容器可使用此名称引用它。**

  <!--
  - **resourceClaims.name** (string), required

    Name uniquely identifies this resource claim inside the pod. This must be a DNS_LABEL.

  - **resourceClaims.source** (ClaimSource)

    Source describes where to find the ResourceClaim.
  -->
  - **resourceClaims.name** (string), 必需

    在 Pod 中，`name` 是此资源声明的唯一标识。此字段值必须是 DNS_LABEL。

  - **resourceClaims.source** (ClaimSource)

    `source` 描述了在哪里可以找到 `resourceClaim`。

    <a name="ClaimSource"></a>
    <!--
    *ClaimSource describes a reference to a ResourceClaim.
    
    Exactly one of these fields should be set.  Consumers of this type must treat an empty object as if it has an unknown value.*
    -->
    
    **ClaimSource 描述对 ResourceClaim 的引用。**

    **应该设置且仅设置如下字段之一。此类型的消费者必须将空对象视为具有未知值。**

    <!--
    - **resourceClaims.source.resourceClaimName** (string)

      ResourceClaimName is the name of a ResourceClaim object in the same namespace as this pod.

    - **resourceClaims.source.resourceClaimTemplateName** (string)

      ResourceClaimTemplateName is the name of a ResourceClaimTemplate object in the same namespace as this pod.
    -->
    
    - **resourceClaims.source.resourceClaimName** (string)

      resourceClaimName 是与此 Pod 位于同一命名空间中的 ResourceClaim 对象的名称。

    - **resourceClaims.source.resourceClaimTemplateName** (string)

      resourceClaimTemplateName 是与此 Pod 位于同一命名空间中的 `ResourceClaimTemplate` 对象的名称。

      <!--
      The template will be used to create a new ResourceClaim, which will be bound to this pod. When this pod is deleted, the ResourceClaim will also be deleted. The pod name and resource name, along with a generated component, will be used to form a unique name for the ResourceClaim, which will be recorded in pod.status.resourceClaimStatuses.
      -->
    
      该模板将用于创建一个新的 ResourceClaim，新的 ResourceClaim 将被绑定到此 Pod。
      删除此 Pod 时，ResourceClaim 也将被删除。
      Pod 名称和资源名称，连同生成的组件，将用于为 ResourceClaim 形成唯一名称，
      该名称将记录在 pod.status.resourceClaimStatuses 中。

      <!--
      An existing ResourceClaim with that name that is not owned by the pod will not be used for the pod to avoid using an unrelated resource by mistake. Scheduling and pod startup are then blocked until the unrelated ResourceClaim is removed.
      -->
      
      不属于此 Pod 但与此名称重名的现有 ResourceClaim 不会被用于此 Pod，
      以避免错误地使用不相关的资源。Pod 的调度和启动动作会因此而被阻塞，
      直到不相关的 ResourceClaim 被删除。

      <!--
      This field is immutable and no changes will be made to the corresponding ResourceClaim by the control plane after creating the ResourceClaim.
      -->
      
      此字段是不可变更的，创建 ResourceClaim 后控制平面不会对相应的 ResourceClaim 进行任何更改。
<!--
- **schedulingGates** ([]PodSchedulingGate)

  *Patch strategy: merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
-->
- **schedulingGates** ([]PodSchedulingGate)

  **补丁策略：基于 `name` 键合并**

  **映射：键 `name` 的唯一值将在合并过程中保留**
   
  <!--
  SchedulingGates is an opaque list of values that if specified will block scheduling the pod. If schedulingGates is not empty, the pod will stay in the SchedulingGated state and the scheduler will not attempt to schedule the pod.

  SchedulingGates can only be set at pod creation time, and be removed only afterwards.
  
  This is an alpha-level feature enabled by PodSchedulingReadiness feature gate.
  -->
  
  schedulingGates 是一个不透明的值列表，如果指定，将阻止调度 Pod。
  如果 schedulingGates 不为空，则 Pod 将保持 SchedulingGated 状态，调度程序将不会尝试调度 Pod。
 
  SchedulingGates 只能在 Pod 创建时设置，并且只能在创建之后删除。 

  此特性为 Beta 特性，需要通过 PodSchedulingReadiness 特性门控启用。

  <a name="PodSchedulingGate"></a>
  <!--
  *PodSchedulingGate is associated to a Pod to guard its scheduling.*

  - **schedulingGates.name** (string), required

    Name of the scheduling gate. Each scheduling gate must have a unique name field.
  -->
  
  **PodSchedulingGate 与 Pod 相关联以保护其调度。**

  - **schedulingGates.name** (string)，必需
  
    调度门控的名称，每个调度门控的 `name` 字段取值必须唯一。


<!--
### Deprecated

- **serviceAccount** (string)

  DeprecatedServiceAccount is a depreciated alias for ServiceAccountName. Deprecated: Use serviceAccountName instead.
-->

### 已弃用

- **serviceAccount** (string)

  deprecatedServiceAccount 是 serviceAccountName 的弃用别名。此字段已被弃用：应改用 serviceAccountName。

<!--
## Container {#Container}

A single application container that you want to run within a pod.

<hr>

- **name** (string), required

  Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.
-->
## 容器 {#Container}

要在 Pod 中运行的单个应用容器。

<hr>

- **name** (string)，必需

  指定为 DNS_LABEL 的容器的名称。Pod 中的每个容器都必须有一个唯一的名称 (DNS_LABEL)。无法更新。

<!--
### Image
-->
### 镜像 {#image}

<!--
- **image** (string)

  Container image name. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.

- **imagePullPolicy** (string)

  Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images
-->

- **image** (string)

  容器镜像名称。更多信息： https://kubernetes.io/zh-cn/docs/concepts/containers/images。
  此字段是可选的，以允许更高层的配置管理进行默认设置或覆盖工作负载控制器（如 Deployment 和 StatefulSets）
  中的容器镜像。

- **imagePullPolicy** (string)

  镜像拉取策略。`"Always"`、`"Never"`、`"IfNotPresent"` 之一。如果指定了 `:latest` 标签，则默认为 `"Always"`，
  否则默认为 `"IfNotPresent"`。无法更新。更多信息： 
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

  入口点数组。不在 Shell 中执行。如果未提供，则使用容器镜像的 `ENTRYPOINT`。
  变量引用 `$(VAR_NAME)` 使用容器的环境进行扩展。如果无法解析变量，则输入字符串中的引用将保持不变。
  `$$` 被简化为 `$`，这允许转义 `$(VAR_NAME)` 语法：即 `"$$(VAR_NAME)" ` 将产生字符串字面值 `"$(VAR_NAME)"`。
  无论变量是否存在，转义引用都不会被扩展。无法更新。更多信息： 
  https://kubernetes.io/zh-cn/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

<!--
- **args** ([]string)

  Arguments to the entrypoint. The container image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
-->

- **args** ([]string)

  entrypoint 的参数。如果未提供，则使用容器镜像的 `CMD` 设置。变量引用 `$(VAR_NAME)` 使用容器的环境进行扩展。
  如果无法解析变量，则输入字符串中的引用将保持不变。`$$` 被简化为 `$`，这允许转义 `$(VAR_NAME)` 语法：
  即 `"$$(VAR_NAME)"` 将产生字符串字面值 `"$(VAR_NAME)"`。无论变量是否存在，转义引用都不会被扩展。无法更新。
  更多信息： 
  https://kubernetes.io/zh-cn/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

<!--
- **workingDir** (string)

  Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.
-->

- **workingDir** (string)

  容器的工作目录。如果未指定，将使用容器运行时的默认值，默认值可能在容器镜像中配置。无法更新。

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

  **补丁策略：基于 `containerPort` 键合并**
  
  **映射：键 `containerPort, protocol` 组合的唯一值将在合并期间保留**
  
  要从容器暴露的端口列表。此处不指定端口不会阻止该端口被暴露。
  任何侦听容器内默认 `"0.0.0.0"` 地址的端口都可以从网络访问。使用策略合并补丁来修改此数组可能会破坏数据。
  更多细节请参阅 https://github.com/kubernetes/kubernetes/issues/108255。
  无法更新。

  <a name="ContainerPort"></a>
  **ContainerPort 表示单个容器中的网络端口。**

  <!--
  - **ports.containerPort** (int32), required

    Number of port to expose on the pod's IP address. This must be a valid port number, 0 \< x \< 65536.

  - **ports.hostIP** (string)

    What host IP to bind the external port to.
  -->

  - **ports.containerPort** (int32)，必需

    要在 Pod 的 IP 地址上公开的端口号。这必须是有效的端口号，0 \< x \< 65536。

  - **ports.hostIP** (string)

    绑定外部端口的主机 IP。

  <!--
  - **ports.hostPort** (int32)

    Number of port to expose on the host. If specified, this must be a valid port number, 0 \< x \< 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.

  - **ports.name** (string)

    If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.
  -->

  - **ports.hostPort** (int32)

    要在主机上公开的端口号。如果指定，此字段必须是一个有效的端口号，0 \< x \< 65536。
    如果设置了 hostNetwork，此字段值必须与 containerPort 匹配。大多数容器不需要设置此字段。

  - **ports.name** (string)

    如果设置此字段，这必须是 IANA_SVC_NAME 并且在 Pod 中唯一。
    Pod 中的每个命名端口都必须具有唯一的名称。服务可以引用的端口的名称。

  <!--
  - **ports.protocol** (string)

    Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".
  -->

  - **ports.protocol** (string)

    端口协议。必须是 `UDP`、`TCP` 或 `SCTP`。默认为 `TCP`。

<!--
### Environment variables
-->

### 环境变量

<!--
- **env** ([]EnvVar)

  *Patch strategy: merge on key `name`*
  
  List of environment variables to set in the container. Cannot be updated.
-->

- **env**（[]EnvVar）

  **补丁策略：基于 `name` 键合并**
  
  要在容器中设置的环境变量列表。无法更新。

  <!--
  *EnvVar represents an environment variable present in a Container.*
  -->
  <a name="EnvVar"></a>
  **EnvVar 表示容器中存在的环境变量。**

  <!--
  - **env.name** (string), required

    Name of the environment variable. Must be a C_IDENTIFIER.
  -->

  - **env.name** (string)，必需

    环境变量的名称。必须是 C_IDENTIFIER。

  <!--
  - **env.value** (string)

    Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".
  -->

  - **env.value** (string)

    变量引用 `$(VAR_NAME)` 使用容器中先前定义的环境变量和任何服务环境变量进行扩展。
    如果无法解析变量，则输入字符串中的引用将保持不变。
    `$$` 会被简化为 `$`，这允许转义 `$(VAR_NAME)` 语法：即 `"$$(VAR_NAME)"` 将产生字符串字面值 `"$(VAR_NAME)"`。
    无论变量是否存在，转义引用都不会被扩展。默认为 ""。

  <!--
  - **env.valueFrom** (EnvVarSource)

    Source for the environment variable's value. Cannot be used if value is not empty.
  -->

  - **env.valueFrom** (EnvVarSource)

    环境变量值的来源。如果 value 值不为空，则不能使用。

    <!--
    *EnvVarSource represents a source for the value of an EnvVar.*
    -->

    **EnvVarSource 表示 envVar 值的来源。**

    <!--
    - **env.valueFrom.configMapKeyRef** (ConfigMapKeySelector)

      Selects a key of a ConfigMap.
    -->

    - **env.valueFrom.configMapKeyRef** (ConfigMapKeySelector)

      选择某个 ConfigMap 的一个主键。

      <!--
      - **env.valueFrom.configMapKeyRef.key** (string), required

        The key to select.

      - **env.valueFrom.configMapKeyRef.name** (string)

        Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.configMapKeyRef.optional** (boolean)

        Specify whether the ConfigMap or its key must be defined
      -->

      - **env.valueFrom.configMapKeyRef.key** (string)，必需

        要选择的主键。

      - **env.valueFrom.configMapKeyRef.name** (string)

        被引用者的名称。更多信息：
        https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.configMapKeyRef.optional** (boolean)

        指定 ConfigMap 或其主键是否必须已经定义。

    <!--
    - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['\<KEY>']`, `metadata.annotations['\<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.
    -->

    - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      选择 Pod 的一个字段：支持 `metadata.name`、`metadata.namespace`、`metadata.labels['<KEY>']`、
      `metadata.annotations['<KEY>']`、`spec.nodeName`、`spec.serviceAccountName`、`status.hostIP`
      `status.podIP`、`status.podIPs`。

    <!--
    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported.
    -->

    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      选择容器的资源：目前仅支持资源限制和请求（`limits.cpu`、`limits.memory`、`limits.ephemeral-storage`、
      `requests.cpu`、`requests.memory` 和 `requests.ephemeral-storage`）。

    <!--
    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      Selects a key of a secret in the pod's namespace
    -->

    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      在 Pod 的名字空间中选择 Secret 的主键。

      <a name="SecretKeySelector"></a>
      <!--
      *SecretKeySelector selects a key of a Secret.*
      -->

      **SecretKeySelector 选择一个 Secret 的主键。**

      <!--
      - **env.valueFrom.secretKeyRef.key** (string), required

        The key of the secret to select from.  Must be a valid secret key.

      - **env.valueFrom.secretKeyRef.name** (string)

        Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional** (boolean)

        Specify whether the Secret or its key must be defined
      -->

      - **env.valueFrom.secretKeyRef.key** (string)，必需

        要选择的 Secret 的主键。必须是有效的主键。

      - **env.valueFrom.secretKeyRef.name** (string)

        被引用 Secret 的名称。更多信息：
        https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional** (boolean)

        指定 Secret 或其主键是否必须已经定义。

<!--
- **envFrom** ([]EnvFromSource)

  List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.

-->
- **envFrom** ([]EnvFromSource)

  用来在容器中填充环境变量的数据源列表。在源中定义的键必须是 C_IDENTIFIER。
  容器启动时，所有无效主键都将作为事件报告。
  当一个键存在于多个源中时，与最后一个来源关联的值将优先。
  由 env 定义的条目中，与此处键名重复者，以 env 中定义为准。无法更新。

  <!--
  *EnvFromSource represents the source of a set of ConfigMaps*
  -->
  <a name="EnvFromSource"></a>
  **EnvFromSource 表示一组 ConfigMaps 的来源**

  <!--
  - **envFrom.configMapRef** (ConfigMapEnvSource)

    The ConfigMap to select from

    <a name="ConfigMapEnvSource"></a>
    *ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.
    
    The contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables.*
  -->

  - **envFrom.configMapRef** (ConfigMapEnvSource)

    要从中选择主键的 ConfigMap。

    <a name="ConfigMapEnvSource"></a>
    ConfigMapEnvSource 选择一个 ConfigMap 来填充环境变量。目标 ConfigMap 的
    data 字段的内容将键值对表示为环境变量。

    <!--
    - **envFrom.configMapRef.name** (string)

      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional** (boolean)

      Specify whether the ConfigMap must be defined
    -->

    - **envFrom.configMapRef.name** (string)

      被引用的 ConfigMap 的名称。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional** (boolean)

      指定 ConfigMap 是否必须已经定义。

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

    附加到 ConfigMap 中每个键名之前的可选标识符。必须是 C_IDENTIFIER。

  - **envFrom.secretRef** (SecretEnvSource)

    要从中选择主键的 Secret。

    SecretEnvSource 选择一个 Secret 来填充环境变量。
    目标 Secret 的 data 字段的内容将键值对表示为环境变量。

    <!--
    - **envFrom.secretRef.name** (string)

      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional** (boolean)

      Specify whether the Secret must be defined
    -->

    - **envFrom.secretRef.name** (string)

      被引用 Secret 的名称。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional** (boolean)

      指定 Secret 是否必须已经定义。

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

  **补丁策略：基于 `mountPath` 键合并**
  
  要挂载到容器文件系统中的 Pod 卷。无法更新。

  VolumeMount 描述在容器中安装卷。

  <!--
  - **volumeMounts.mountPath** (string), required

    Path within the container at which the volume should be mounted.  Must not contain ':'.

  - **volumeMounts.name** (string), required

    This must match the Name of a Volume.

  - **volumeMounts.mountPropagation** (string)

    mountPropagation determines how mounts are propagated from the host to container and the other way around. When not set, MountPropagationNone is used. This field is beta in 1.10.
  -->

  - **volumeMounts.mountPath** (string)，必需

    容器内卷的挂载路径。不得包含 ':'。

  - **volumeMounts.name** (string)，必需

    此字段必须与卷的名称匹配。

  - **volumeMounts.mountPropagation** (string)

    mountPropagation 确定挂载如何从主机传播到容器，及如何反向传播。
    如果未设置，则使用 `MountPropagationNone`。该字段在 1.10 中是 Beta 版。

  <!--
  - **volumeMounts.readOnly** (boolean)

    Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false.

  - **volumeMounts.subPath** (string)

    Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root).

  - **volumeMounts.subPathExpr** (string)

    Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to "" (volume's root). SubPathExpr and SubPath are mutually exclusive.
  -->

  - **volumeMounts.readOnly** (boolean)

    如果为 true，则以只读方式挂载，否则（false 或未设置）以读写方式挂载。默认为 false。

  - **volumeMounts.subPath** (string)

    卷中的路径，容器中的卷应该这一路径安装。默认为 ""（卷的根）。

  - **volumeMounts.subPathExpr** (string)

    应安装容器卷的卷内的扩展路径。行为类似于 subPath，但环境变量引用 `$(VAR_NAME)`
    使用容器的环境进行扩展。默认为 ""（卷的根）。`subPathExpr` 和 `subPath` 是互斥的。

<!--
- **volumeDevices** ([]VolumeDevice)

  *Patch strategy: merge on key `devicePath`*
  
  volumeDevices is the list of block devices to be used by the container.

  <a name="VolumeDevice"></a>
  *volumeDevice describes a mapping of a raw block device within a container.*
-->

- **volumeDevices** ([]VolumeDevice)

  **补丁策略：基于 `devicePath` 键合并**
  
  volumeDevices 是容器要使用的块设备列表。

  <a name="VolumeDevice"></a>
  volumeDevice 描述了容器内原始块设备的映射。

  <!--
  - **volumeDevices.devicePath** (string), required

    devicePath is the path inside of the container that the device will be mapped to.

  - **volumeDevices.name** (string), required

    name must match the name of a persistentVolumeClaim in the pod
  -->

  - **volumeDevices.devicePath** (string)，必需

    devicePath 是设备将被映射到的容器内的路径。

  - **volumeDevices.name** (string)，必需

    name 必须与 Pod 中的 persistentVolumeClaim 的名称匹配

<!--
### Resources
-->

### 资源

<!--
- **resources** (ResourceRequirements)

  Compute Resources required by this container. Cannot be updated. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  <a name="ResourceRequirements"></a>
  *ResourceRequirements describes the compute resource requirements.*
-->

- **resources**（ResourceRequirements）

  此容器所需的计算资源。无法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

  ResourceRequirements 描述计算资源需求。

  <!--
  - **resources.claims** ([]ResourceClaim)

    *Map: unique values on key name will be kept during a merge*
    
    Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.
  -->
  
  - **resources.claims** ([]ResourceClaim)

    **映射：键 `name` 的唯一值将在合并过程中保留**

    claims 列出此容器使用的资源名称，资源名称在 `spec.resourceClaims` 中定义。

    <!--
    This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.
    
    This field is immutable. It can only be set for containers.
    -->
    
    这是一个 Alpha 特性字段，需要启用 DynamicResourceAllocation 功能门控开启此特性。

    此字段不可变更，只能在容器级别设置。

    <a name="ResourceClaim"></a>
    <!--
    *ResourceClaim references one entry in PodSpec.ResourceClaims.*

    - **resources.claims.name** (string), required

      Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.
    -->
    
      **ResourceClaim 引用 `PodSpec.resourceClaims` 中的一项。**

    - **resources.claims.name** (string)，必需
      
      `name` 必须与使用该字段 Pod 的 `pod.spec.resourceClaims`
      中的一个条目的名称相匹配。它使该资源在容器内可用。

  <!--
  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
  -->

  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    limits 描述所允许的最大计算资源用量。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    requests 描述所需的最小计算资源量。如果容器省略了 requests，但明确设定了 limits，
    则 requests 默认值为 limits 值，否则为实现定义的值。请求不能超过限制。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

<!--
- **resizePolicy** ([]ContainerResizePolicy)

  *Atomic: will be replaced during a merge*
  
  Resources resize policy for the container.
-->
- **resizePolicy** ([]ContainerResizePolicy)

  **原子性: 将在合并期间被替换**

  容器的资源调整策略。

  <!--
  <a name="ContainerResizePolicy"></a>
  *ContainerResizePolicy represents resource resize policy for the container.*

  - **resizePolicy.resourceName** (string), required

    Name of the resource to which this resource resize policy applies. Supported values: cpu, memory.
  -->
  <a name="ContainerResizePolicy"></a>
  **ContainerResizePolicy 表示容器的资源大小调整策略**

  - **resizePolicy.resourceName** (string), 必需

    该资源调整策略适用的资源名称。支持的值：cpu、memory。

  <!--
  - **resizePolicy.restartPolicy** (string), required

    Restart policy to apply when specified resource is resized. If not specified, it defaults to NotRequired.
  -->
  
  - **resizePolicy.restartPolicy** (string), 必需

    重启策略，会在调整指定资源大小时使用该策略。如果未指定，则默认为 NotRequired。

<!--
### Lifecycle
-->
### 生命周期

<!--
- **lifecycle** (Lifecycle)

  Actions that the management system should take in response to container lifecycle events. Cannot be updated.

  <a name="Lifecycle"></a>
  *Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted.*
-->

- **lifecycle** (Lifecycle)

  管理系统应对容器生命周期事件采取的行动。无法更新。

  Lifecycle 描述管理系统为响应容器生命周期事件应采取的行动。
  对于 postStart 和 preStop 生命周期处理程序，容器的管理会阻塞，直到操作完成，
  除非容器进程失败，在这种情况下处理程序被中止。

  <!--
  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
  -->

  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    创建容器后立即调用 postStart。如果处理程序失败，则容器将根据其重新启动策略终止并重新启动。
    容器的其他管理阻塞直到钩子完成。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

  <!--
  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PreStop is called immediately before a container is terminated due to an API request or management event such as liveness/startup probe failure, preemption, resource contention, etc. The handler is not called if the container crashes or exits. The Pod's termination grace period countdown begins before the PreStop hook is executed. Regardless of the outcome of the handler, the container will eventually terminate within the Pod's termination grace period (unless delayed by finalizers). Other management of the container blocks until the hook completes or until the termination grace period is reached. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
  -->

  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    preStop 在容器因 API 请求或管理事件（如存活态探针/启动探针失败、抢占、资源争用等）而终止之前立即调用。
    如果容器崩溃或退出，则不会调用处理程序。Pod 的终止宽限期倒计时在 preStop 钩子执行之前开始。
    无论处理程序的结果如何，容器最终都会在 Pod 的终止宽限期内终止（除非被终结器延迟）。
    容器的其他管理会阻塞，直到钩子完成或达到终止宽限期。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

<!--
- **terminationMessagePath** (string)

  Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.
-->

- **terminationMessagePath** (string)

  可选字段。挂载到容器文件系统的一个路径，容器终止消息写入到该路径下的文件中。
  写入的消息旨在成为简短的最终状态，例如断言失败消息。如果大于 4096 字节，将被节点截断。
  所有容器的总消息长度将限制为 12 KB。默认为 `/dev/termination-log`。无法更新。

<!--
- **terminationMessagePolicy** (string)

  Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.
-->
- **terminationMessagePolicy** (string)

  指示应如何填充终止消息。字段值 `File` 将使用 terminateMessagePath 的内容来填充成功和失败的容器状态消息。
  如果终止消息文件为空并且容器因错误退出，`FallbackToLogsOnError` 将使用容器日志输出的最后一块。
  日志输出限制为 2048 字节或 80 行，以较小者为准。默认为 `File`。无法更新。

<!--
- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Periodic probe of container liveness. Container will be restarted if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
-->
- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  定期探针容器活跃度。如果探针失败，容器将重新启动。无法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#container-probes

<!--
- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
-->
- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  定期探测容器服务就绪情况。如果探针失败，容器将被从服务端点中删除。无法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#container-probes

<!--
- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  StartupProbe indicates that the Pod has successfully initialized. If specified, no other probes are executed until this completes successfully. If this probe fails, the Pod will be restarted, just as if the livenessProbe failed. This can be used to provide different probe parameters at the beginning of a Pod's lifecycle, when it might take a long time to load data or warm a cache, than during steady-state operation. This cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
-->
- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  startupProbe 表示 Pod 已成功初始化。如果设置了此字段，则此探针成功完成之前不会执行其他探针。
  如果这个探针失败，Pod 会重新启动，就像存活态探针失败一样。
  这可用于在 Pod 生命周期开始时提供不同的探针参数，此时加载数据或预热缓存可能需要比稳态操作期间更长的时间。
  这无法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#container-probes

<!--
- **restartPolicy** (string)

  RestartPolicy defines the restart behavior of individual containers in a pod. This field may only be set for init containers, and the only allowed value is "Always". For non-init containers or when this field is not specified, the restart behavior is defined by the Pod's restart policy and the container type. Setting the RestartPolicy as "Always" for the init container will have the following effect: this init container will be continually restarted on exit until all regular containers have terminated. Once all regular containers have completed, all init containers with restartPolicy "Always" will be shut down. This lifecycle differs from normal init containers and is often referred to as a "sidecar" container. Although this init container still starts in the init container sequence, it does not wait for the container to complete before proceeding to the next init container. Instead, the next init container starts immediately after this init container is started, or after any startupProbe has successfully completed.
-->
- **restartPolicy** (string)

  restartPolicy 定义 Pod 中各个容器的重新启动行为。
  该字段仅适用于 Init 容器，唯一允许的值是 "Always"。
  对于非 Init 容器或未指定此字段的情况，重新启动行为由 Pod 的重启策略和容器类型来定义。
  将 restartPolicy 设置为 "Always" 会产生以下效果：该 Init 容器将在退出后持续重新启动，直到所有常规容器终止。
  一旦所有常规容器已完成，所有具有 restartPolicy 为 "Always" 的 Init 容器将被关闭。
  这种生命期与正常的 Init 容器不同，通常被称为 "sidecar" 容器。
  虽然此 Init 容器仍然在 Init 容器序列中启动，但它在进入下一个 Init 容器之前并不等待容器完成。
  相反，在此 Init 容器被启动后或在任意 startupProbe 已成功完成后下一个 Init 容器将立即启动。

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

  SecurityContext 定义了容器应该运行的安全选项。如果设置，SecurityContext 的字段将覆盖
  PodSecurityContext 的等效字段。更多信息：
  https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/security-context/

  SecurityContext 保存将应用于容器的安全配置。某些字段在 SecurityContext 和 PodSecurityContext 中都存在。
  当两者都设置时，SecurityContext 中的值优先。

  <!--
  - **securityContext.runAsUser** (int64)

    The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.runAsUser** (int64)

    运行容器进程入口点的 UID。如果未指定，则默认为镜像元数据中指定的用户。
    也可以在 PodSecurityContext 中设置。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。
    注意，`spec.os.name` 为 "windows" 时不能设置该字段。

  <!--
  - **securityContext.runAsNonRoot** (boolean)

    Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
  -->

  - **securityContext.runAsNonRoot** (boolean)

    指示容器必须以非 root 用户身份运行。
    如果为 true，kubelet 将在运行时验证镜像，以确保它不会以 UID 0（root）身份运行，如果是，则无法启动容器。
    如果未设置或为 false，则不会执行此类验证。也可以在 PodSecurityContext 中设置。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。

  <!--
  - **securityContext.runAsGroup** (int64)

    The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.runAsGroup** (int64)

    运行容器进程入口点的 GID。如果未设置，则使用运行时默认值。也可以在 PodSecurityContext 中设置。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。
    注意，`spec.os.name` 为 "windows" 时不能设置该字段。

  <!--
  - **securityContext.readOnlyRootFilesystem** (boolean)

    Whether this container has a read-only root filesystem. Default is false. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.readOnlyRootFilesystem** (boolean)

    此容器是否具有只读根文件系统。默认为 false。注意，`spec.os.name` 为 "windows" 时不能设置该字段。

  <!--
  - **securityContext.procMount** (string)

    procMount denotes the type of proc mount to use for the containers. The default is DefaultProcMount which uses the container runtime defaults for readonly paths and masked paths. This requires the ProcMountType feature flag to be enabled. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.procMount** (string)

    procMount 表示用于容器的 proc 挂载类型。默认值为 `DefaultProcMount`，
    它针对只读路径和掩码路径使用容器运行时的默认值。此字段需要启用 ProcMountType 特性门控。
    注意，`spec.os.name` 为 "windows" 时不能设置此字段。

  <!--
  - **securityContext.privileged** (boolean)

    Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host. Defaults to false. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.privileged** (boolean)

    以特权模式运行容器。特权容器中的进程本质上等同于主机上的 root。默认为 false。
    注意，`spec.os.name` 为 "windows" 时不能设置此字段。

  <!--
  - **securityContext.allowPrivilegeEscalation** (boolean)

    AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process. This bool directly controls if the no_new_privs flag will be set on the container process. AllowPrivilegeEscalation is true always when the container is: 1) run as Privileged 2) has CAP_SYS_ADMIN Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.allowPrivilegeEscalation** (boolean)

    allowPrivilegeEscalation 控制进程是否可以获得比其父进程更多的权限。此布尔值直接控制是否在容器进程上设置
    `no_new_privs` 标志。allowPrivilegeEscalation 在容器处于以下状态时始终为 true：

    1. 以特权身份运行
    2. 具有 `CAP_SYS_ADMIN`

    请注意，当 `spec.os.name` 为 "windows" 时，无法设置此字段。

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

    运行容器时添加或放弃的权能（Capabilities）。默认为容器运行时所授予的权能集合。
    注意，`spec.os.name` 为 "windows" 时不能设置此字段。

    **在运行中的容器中添加和放弃 POSIX 权能。**

    - **securityContext.capabilities.add** ([]string)

      新增权能。

    - **securityContext.capabilities.drop** ([]string)

      放弃权能。

  <!--
  - **securityContext.seccompProfile** (SeccompProfile)

    The seccomp options to use by this container. If seccomp options are provided at both the pod & container level, the container options override the pod options. Note that this field cannot be set when spec.os.name is windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.*
  -->

  - **securityContext.seccompProfile** (SeccompProfile)

    此容器使用的 seccomp 选项。如果在 Pod 和容器级别都提供了 seccomp 选项，则容器级别的选项会覆盖 Pod 级别的选项设置。
    注意，`spec.os.name` 为 "windows" 时不能设置此字段。

    **SeccompProfile 定义 Pod 或容器的 seccomp 配置文件设置。只能设置一个配置文件源。**

    <!--
    - **securityContext.seccompProfile.type** (string), required

      type indicates which kind of seccomp profile will be applied. Valid options are:
      
      Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.
    --> 

    - **securityContext.seccompProfile.type** (string)，必需

      type 指示应用哪种 seccomp 配置文件。有效的选项有：
      
      - `Localhost` - 应使用在节点上的文件中定义的配置文件。
      - `RuntimeDefault` - 应使用容器运行时的默认配置文件。
      - `Unconfined` - 不应用任何配置文件。
     
    <!--
    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must be set if type is "Localhost". Must NOT be set for any other type.
    -->

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile 指示应使用的在节点上的文件，文件中定义了配置文件。
      该配置文件必须在节点上先行配置才能使用。
      必须是相对于 kubelet 所配置的 seccomp 配置文件位置下的下级路径。
      仅当 type 为 "Localhost" 时才必须设置。不得为任何其他类别设置此字段。

  <!--
  - **securityContext.seLinuxOptions** (SELinuxOptions)

    The SELinux context to be applied to the container. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

    <a name="SELinuxOptions"></a>
    *SELinuxOptions are the labels to be applied to the container*
  -->

  - **securityContext.seLinuxOptions** (SELinuxOptions)

    要应用到容器上的 SELinux 上下文。如果未设置此字段，容器运行时将为每个容器分配一个随机的 SELinux 上下文。
    也可以在 PodSecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，
    则在 SecurityContext 中指定的值优先。注意，`spec.os.name` 为 "windows" 时不能设置此字段。

    <a name="SELinuxOptions"></a>
    **SELinuxOptions 是要应用到容器上的标签。**

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

      level 是应用于容器的 SELinux 级别标签。

    - **securityContext.seLinuxOptions.role** （string）

      role 是应用于容器的 SELinux 角色标签。

    - **securityContext.seLinuxOptions.type** （string）

      type 是适用于容器的 SELinux 类型标签。

    - **securityContext.seLinuxOptions.user** （string）

      user 是应用于容器的 SELinux 用户标签。

  <!--
  - **securityContext.windowsOptions** （WindowsSecurityContextOptions）

    The Windows specific settings applied to all containers. If unspecified, the options from the PodSecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions contain Windows-specific options and credentials.*
  -->

  - **securityContext.windowsOptions** （WindowsSecurityContextOptions）

    要应用于所有容器上的特定于 Windows 的设置。如果未指定，将使用 PodSecurityContext 中的选项。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。
    注意，`spec.os.name` 为 "linux" 时不能设置此字段。

    <a name="WindowsSecurityContextOptions"></a>
    **WindowsSecurityContextOptions 包含特定于 Windows 的选项和凭据。**

    <!--
    - **securityContext.windowsOptions.gmsaCredentialSpec** （string）

      GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** （string）

      GMSACredentialSpecName is the name of the GMSA credential spec to use.
    -->

    - **securityContext.windowsOptions.gmsaCredentialSpec** （string）

      gmsaCredentialSpec 是 [GMSA 准入 Webhook](https://github.com/kubernetes-sigs/windows-gmsa)
      内嵌由 gmsaCredentialSpecName 字段所指定的 GMSA 凭证规约的内容的地方。

    <!--
    - **securityContext.windowsOptions.hostProcess** （boolean）

      HostProcess determines if a container should be run as a 'Host Process' container. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers).  In addition, if HostProcess is true then HostNetwork must also be set to true.
    -->

    - **securityContext.windowsOptions.hostProcess** （boolean）

      hostProcess 确定容器是否应作为 "主机进程" 容器运行。
      一个 Pod 的所有容器必须具有相同的有效 hostProcess 值（不允许混合设置了 hostProcess 容器和未设置 hostProcess 的容器）。
      此外，如果 hostProcess 为 true，则 hostNetwork 也必须设置为 true。

    <!--
    - **securityContext.windowsOptions.runAsUserName** （string）

      The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
    -->

    - **securityContext.windowsOptions.runAsUserName** （string）

      Windows 中运行容器进程入口点的用户名。如果未指定，则默认为镜像元数据中指定的用户。
      也可以在 PodSecurityContext 中设置。
      如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。

<!--
### Debugging
-->
### 调试

<!--
- **stdin** (boolean)

  Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.
-->
- **stdin** （boolean）

  此容器是否应在容器运行时为 stdin 分配缓冲区。如果未设置，从容器中的 stdin 读取将始终导致 EOF。
  默认为 false。

<!--
- **stdinOnce** (boolean)

  Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false
-->
- **stdinOnce** （boolean）

  容器运行时是否应在某个 attach 打开 stdin 通道后关闭它。当 stdin 为 true 时，stdin 流将在多个 attach 会话中保持打开状态。
  如果 stdinOnce 设置为 true，则 stdin 在容器启动时打开，在第一个客户端连接到 stdin 之前为空，
  然后保持打开并接受数据，直到客户端断开连接，此时 stdin 关闭并保持关闭直到容器重新启动。
  如果此标志为 false，则从 stdin 读取的容器进程将永远不会收到 EOF。默认为 false。

<!--
- **tty** (boolean)

  Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.
-->
- **tty** （boolean）
  这个容器是否应该为自己分配一个 TTY，同时需要设置 `stdin` 为真。默认为 false。

## EphemeralContainer {#EphemeralContainer}

<!--
An EphemeralContainer is a temporary container that you may add to an existing Pod for user-initiated activities such as debugging. Ephemeral containers have no resource or scheduling guarantees, and they will not be restarted when they exit or when a Pod is removed or restarted. The kubelet may evict a Pod if an ephemeral container causes the Pod to exceed its resource allocation.

To add an ephemeral container, use the ephemeralcontainers subresource of an existing Pod. Ephemeral containers may not be removed or restarted.
-->
EphemeralContainer 是一个临时容器，你可以将其添加到现有 Pod 以用于用户发起的活动，例如调试。
临时容器没有资源或调度保证，它们在退出或 Pod 被移除或重新启动时不会重新启动。
如果临时容器导致 Pod 超出其资源分配，kubelet 可能会驱逐 Pod。

要添加临时容器，请使用现有 Pod 的 `ephemeralcontainers` 子资源。临时容器不能被删除或重新启动。

<hr>

<!--
- **name** (string), required

  Name of the ephemeral container specified as a DNS_LABEL. This name must be unique among all containers, init containers and ephemeral containers.
-->
- **name** (string)，必需

  以 DNS_LABEL 形式设置的临时容器的名称。此名称在所有容器、Init 容器和临时容器中必须是唯一的。

<!--
- **targetContainerName** (string)

  If set, the name of the container from PodSpec that this ephemeral container targets. The ephemeral container will be run in the namespaces (IPC, PID, etc) of this container. If not set then the ephemeral container uses the namespaces configured in the Pod spec.
  
  The container runtime must implement support for this feature. If the runtime does not support namespace targeting then the result of setting this field is undefined.
-->
- **targetContainerName** (string)

  如果设置，则为 Pod 规约中此临时容器所针对的容器的名称。临时容器将在该容器的名字空间（IPC、PID 等）中运行。
  如果未设置，则临时容器使用 Pod 规约中配置的名字空间。
  
  容器运行时必须实现对此功能的支持。如果运行时不支持名字空间定位，则设置此字段的结果是未定义的。

<!--
### Image
-->
### 镜像

<!--
- **image** (string)

  Container image name. More info: https://kubernetes.io/docs/concepts/containers/images
-->
- **image** (string)

  容器镜像名称。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/containers/images

<!--
- **imagePullPolicy** (string)

  Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images
-->
- **imagePullPolicy** (string)

  镜像拉取策略。取值为 `Always`、`Never`、`IfNotPresent` 之一。
  如果指定了 `:latest` 标签，则默认为 `Always`，否则默认为 `IfNotPresent`。
  无法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/containers/images#updating-images

<!--
### Entrypoint
-->
### 入口点

<!--
- **command** ([]string)

  Entrypoint array. Not executed within a shell. The image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
-->
- **command** ([]string)

  入口点数组。不在 Shell 中执行。如果未提供，则使用镜像的 `ENTRYPOINT`。
  变量引用 `$(VAR_NAME)` 使用容器的环境进行扩展。如果无法解析变量，则输入字符串中的引用将保持不变。
  `$$` 被简化为 `$`，这允许转义 `$(VAR_NAME)` 语法：即 `"$$(VAR_NAME)"` 将产生字符串字面值 `"$(VAR_NAME)"`。
  无论变量是否存在，转义引用都不会被扩展。无法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

<!--
- **args** ([]string)

  Arguments to the entrypoint. The image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
-->
- **args** （[]string）

  entrypoint 的参数。如果未提供，则使用镜像的 `CMD`。
  变量引用 `$(VAR_NAME)` 使用容器的环境进行扩展。如果无法解析变量，则输入字符串中的引用将保持不变。
  `$$` 被简化为 `$`，这允许转义 `$(VAR_NAME)` 语法：即 `"$$(VAR_NAME)"` 将产生字符串字面值 `"$(VAR_NAME)"`。
  无论变量是否存在，转义引用都不会被扩展。无法更新。更多信息：
  https://kubernetes.io/zh-cn/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

<!--
- **workingDir** (string)

  Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.
-->
- **workingDir** (string)

  容器的工作目录。如果未指定，将使用容器运行时的默认值，默认值可能在容器镜像中配置。无法更新。

<!--
### Environment variables
-->
### 环境变量

<!--
- **env** ([]EnvVar)

  *Patch strategy: merge on key `name`*
  
  List of environment variables to set in the container. Cannot be updated.

  <a name="EnvVar"></a>
  *EnvVar represents an environment variable present in a Container.*
-->
- **env**（[]EnvVar）

  **补丁策略：基于 `name` 键合并**
  
  要在容器中设置的环境变量列表。无法更新。

  <a name="EnvVar"></a>
  **EnvVar 表示容器中存在的环境变量。**

  <!--
  - **env.name** (string), required

    Name of the environment variable. Must be a C_IDENTIFIER.

  - **env.value** (string)

    Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".
  -->

  - **env.name** (string)，必需

    环境变量的名称。必须是 C_IDENTIFIER。

  - **env.value** (string)

    变量引用 `$(VAR_NAME)` 使用容器中先前定义的环境变量和任何服务环境变量进行扩展。
    如果无法解析变量，则输入字符串中的引用将保持不变。
    `$$` 被简化为 `$`，这允许转义 `$(VAR_NAME)` 语法：即 `"$$(VAR_NAME)"` 将产生字符串字面值 `"$(VAR_NAME)"`。
    无论变量是否存在，转义引用都不会被扩展。默认为 ""。

  <!--
  - **env.valueFrom** (EnvVarSource)

    Source for the environment variable's value. Cannot be used if value is not empty.

    <a name="EnvVarSource"></a>
    *EnvVarSource represents a source for the value of an EnvVar.*
  -->

  - **env.valueFrom** （EnvVarSource）

    环境变量值的来源。如果取值不为空，则不能使用。

    **EnvVarSource 表示 envVar 值的源。**

    <!--
    - **env.valueFrom.configMapKeyRef** (ConfigMapKeySelector)

      Selects a key of a ConfigMap.

      <a name="ConfigMapKeySelector"></a>
      *Selects a key from a ConfigMap.*
    -->

    - **env.valueFrom.configMapKeyRef** （ConfigMapKeySelector）

      选择 ConfigMap 的主键。

      <a name="ConfigMapKeySelector"></a>
      **选择 ConfigMap 的主键。**

      <!--
      - **env.valueFrom.configMapKeyRef.key** (string), required

        The key to select.

      - **env.valueFrom.configMapKeyRef.name** (string)

        Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
      -->

      - **env.valueFrom.configMapKeyRef.key** (string)，必需

        选择的主键。

      - **env.valueFrom.configMapKeyRef.name**（string）

        所引用 ConfigMap 的名称。更多信息：
        https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      <!--
      - **env.valueFrom.configMapKeyRef.optional** (boolean)

        Specify whether the ConfigMap or its key must be defined
      -->

      - **env.valueFrom.configMapKeyRef.optional** （boolean）

        指定是否 ConfigMap 或其键必须已经被定义。

    <!--
    - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['\<KEY>']`, `metadata.annotations['\<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.
    -->

    - **env.valueFrom.fieldRef** （<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>）

      选择 Pod 的一个字段：支持 `metadata.name`、`metadata.namespace`、`metadata.labels['<KEY>']`、
      `metadata.annotations['<KEY>']`、`spec.nodeName`、`spec.serviceAccountName`、`status.hostIP`、
      `status.podIP`、`status.podIPs`。

    <!--
    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported.
    -->

    - **env.valueFrom.resourceFieldRef** （<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>）

      选择容器的资源：当前仅支持资源限制和请求（`limits.cpu`、`limits.memory`、`limits.ephemeral-storage`、
      `requests.cpu`、`requests.memory` 和 `requests.ephemeral-storage`）。

    <!--
    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      Selects a key of a secret in the pod's namespace

      <a name="SecretKeySelector"></a>
      *SecretKeySelector selects a key of a Secret.*
    -->

    - **env.valueFrom.secretKeyRef** （SecretKeySelector）

      在 Pod 的名字空间中选择某 Secret 的主键。

      <a name="SecretKeySelector"></a>
      **SecretKeySelector 选择某 Secret 的主键。**

      <!--
      - **env.valueFrom.secretKeyRef.key** (string), required

        The key of the secret to select from.  Must be a valid secret key.

      - **env.valueFrom.secretKeyRef.name** (string)

        Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional** (boolean)

        Specify whether the Secret or its key must be defined
      -->

      - **env.valueFrom.secretKeyRef.key** (string)，必需

        要从 Secret 中选择的主键。必须是有效的主键。

      - **env.valueFrom.secretKeyRef.name**（string）

        被引用 Secret 名称。更多信息：
        https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional** （boolean）

        指定 Secret 或其主键是否必须已经定义。

<!--
- **envFrom** （[]EnvFromSource）

  List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.

  <a name="EnvFromSource"></a>
  *EnvFromSource represents the source of a set of ConfigMaps*
-->
- **envFrom** （[]EnvFromSource）

  在容器中填充环境变量的来源列表。在来源中定义的键名必须是 C_IDENTIFIER。
  容器启动时，所有无效键都将作为事件报告。当一个键存在于多个来源中时，与最后一个来源关联的值将优先。
  如果有重复主键，env 中定义的值将优先。无法更新。

  <a name="EnvFromSource"></a>
  **EnvFromSource 表示一组 ConfigMap 来源**

  <!--
  - **envFrom.configMapRef** (ConfigMapEnvSource)

    The ConfigMap to select from

    <a name="ConfigMapEnvSource"></a>
    *ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.
    
    The contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables.*
  -->

  - **envFrom.configMapRef** （ConfigMapEnvSource）

    要从中选择的 ConfigMap。

    <a name="ConfigMapEnvSource"></a>
    **ConfigMapEnvSource 选择一个 ConfigMap 来填充环境变量。目标 ConfigMap 的 data 字段的内容将键值对表示为环境变量。**

    <!--
    - **envFrom.configMapRef.name** (string)

      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional** (boolean)

      Specify whether the ConfigMap must be defined
    -->

    - **envFrom.configMapRef.name**（string）

      被引用的 ConfigMap 名称。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional** （boolean）

      指定所引用的 ConfigMap 是否必须已经定义。

  <!--
  - **envFrom.prefix** (string)

    An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.
  -->

  - **envFrom.prefix** （string）

    要在 ConfigMap 中的每个键前面附加的可选标识符。必须是C_IDENTIFIER。

  <!--
  - **envFrom.secretRef** (SecretEnvSource)

    The Secret to select from

    <a name="SecretEnvSource"></a>
    *SecretEnvSource selects a Secret to populate the environment variables with.
    
    The contents of the target Secret's Data field will represent the key-value pairs as environment variables.*
  -->

  - **envFrom.secretRef** （SecretEnvSource）

    可供选择的 Secret。

    <a name="SecretEnvSource"></a>
    **SecretEnvSource 选择一个 Secret 来填充环境变量。目标 Secret 的 data 字段的内容将键值对表示为环境变量。**

    <!--
    - **envFrom.secretRef.name** (string)

      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional** (boolean)

      Specify whether the Secret must be defined
    -->

    - **envFrom.secretRef.name**（string）

      被引用 ConfigMap 的名称。更多信息：
      https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional** （boolean）

      指定是否 Secret 必须已经被定义。

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

  **补丁策略：基于 `mountPath` 键合并**
  
  要挂载到容器文件系统中的 Pod 卷。临时容器不允许子路径挂载。无法更新。

  **VolumeMount 描述在容器中卷的挂载。**

  <!--
  - **volumeMounts.mountPath** (string), required

    Path within the container at which the volume should be mounted.  Must not contain ':'.

  - **volumeMounts.name** (string), required

    This must match the Name of a Volume.
  -->

  - **volumeMounts.mountPath** (string)，必需

    容器内应安装卷的路径。不得包含 ':'。

  - **volumeMounts.name** (string)，必需

    此字段必须与卷的名称匹配。

  <!--
  - **volumeMounts.mountPropagation** (string)

    mountPropagation determines how mounts are propagated from the host to container and the other way around. When not set, MountPropagationNone is used. This field is beta in 1.10.

  - **volumeMounts.readOnly** (boolean)

    Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false.
  -->

  - **volumeMounts.mountPropagation** （string）

    mountPropagation 确定装载如何从主机传播到容器，及反向传播选项。
    如果未设置，则使用 `None`。此字段在 1.10 中为 Beta 字段。

  - **volumeMounts.readOnly** （boolean）

    如果为 true，则挂载卷为只读，否则为读写（false 或未指定）。默认值为 false。

  <!--
  - **volumeMounts.subPath** (string)

    Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root).

  - **volumeMounts.subPathExpr** (string)

    Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to "" (volume's root). SubPathExpr and SubPath are mutually exclusive.
  -->

  - **volumeMounts.subPath** （string）

    卷中的路径名，应该从该路径挂在容器的卷。默认为 "" （卷的根）。

  - **volumeMounts.subPathExpr** （string）

    应安装容器卷的卷内的扩展路径。行为类似于 `subPath`，但环境变量引用 `$(VAR_NAME)`
    使用容器的环境进行扩展。默认为 ""（卷的根）。`subPathExpr` 和 `SubPath` 是互斥的。

<!--
- **volumeDevices** ([]VolumeDevice)

  *Patch strategy: merge on key `devicePath`*
  
  volumeDevices is the list of block devices to be used by the container.

  <a name="VolumeDevice"></a>
  *volumeDevice describes a mapping of a raw block device within a container.*
-->
- **volumeDevices** ([]VolumeDevice)

  **补丁策略：基于 `devicePath` 键合并**
  
  volumeDevices 是容器要使用的块设备列表。

  <a name="VolumeDevice"></a>
  **volumeDevice 描述容器内原始块设备的映射。**

  <!--
  - **volumeDevices.devicePath** (string), required

    devicePath is the path inside of the container that the device will be mapped to.

  - **volumeDevices.name** (string), required

    name must match the name of a persistentVolumeClaim in the pod
  -->

  - **volumeDevices.devicePath** (string)，必需

    devicePath 是设备将被映射到的容器内的路径。

  - **volumeDevices.name** (string)，必需

    name 必须与 Pod 中的 persistentVolumeClaim 的名称匹配。

<!--
- **resizePolicy** ([]ContainerResizePolicy)

  *Atomic: will be replaced during a merge*
  
  Resources resize policy for the container.
-->
- **resizePolicy** ([]ContainerResizePolicy)

  **原子性: 将在合并期间被替换**

  容器的资源调整策略。

  <!--
  <a name="ContainerResizePolicy"></a>
  *ContainerResizePolicy represents resource resize policy for the container.*

  - **resizePolicy.resourceName** (string), required

    Name of the resource to which this resource resize policy applies. Supported values: cpu, memory.
  -->
  <a name="ContainerResizePolicy"></a>
  **ContainerResizePolicy 表示容器的资源大小调整策略**

  - **resizePolicy.resourceName** (string), 必需

    该资源调整策略适用的资源名称。支持的值：cpu、memory。

  <!--
  - **resizePolicy.restartPolicy** (string), required

    Restart policy to apply when specified resource is resized. If not specified, it defaults to NotRequired.
  -->
  
  - **resizePolicy.restartPolicy** (string), 必需

    重启策略，会在调整指定资源大小时使用该策略。如果未指定，则默认为 NotRequired。

<!--
### Lifecycle
-->
### 生命周期

<!--
- **terminationMessagePath** (string)

  Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.
-->
- **terminationMessagePath** (string)

  可选字段。挂载到容器文件系统的路径，用于写入容器终止消息的文件。
  写入的消息旨在成为简短的最终状态，例如断言失败消息。如果超出 4096 字节，将被节点截断。
  所有容器的总消息长度将限制为 12 KB。默认为 `/dev/termination-log`。无法更新。

<!--
- **terminationMessagePolicy** (string)

  Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.
-->
- **terminationMessagePolicy** (string)

  指示应如何填充终止消息。字段值为 `File` 表示将使用 `terminateMessagePath`
  的内容来填充成功和失败的容器状态消息。
  如果终止消息文件为空并且容器因错误退出，字段值 `FallbackToLogsOnError`
  表示将使用容器日志输出的最后一块。日志输出限制为 2048 字节或 80 行，以较小者为准。
  默认为 `File`。无法更新。

<!--
- **restartPolicy** (string)

  Restart policy for the container to manage the restart behavior of each container within a pod. This may only be set for init containers. You cannot set this field on ephemeral containers.
-->
- **restartPolicy** (string)

  这是针对容器的重启策略，用于管理 Pod 内每个容器的重启行为。
  此字段仅适用于 Init 容器，在临时容器上无法设置此字段。

<!--
### Debugging
-->
### 调试

<!--
- **stdin** (boolean)

  Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.
-->
- **stdin** （boolean）

  是否应在容器运行时内为此容器 stdin 分配缓冲区。
  如果未设置，从容器中的 stdin 读数据将始终导致 EOF。默认为 false。

<!--
- **stdinOnce** (boolean)

  Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false
-->
- **stdinOnce** （boolean）

  容器运行时是否应在某个 attach 操作打开 stdin 通道后关闭它。
  当 stdin 为 true 时，stdin 流将在多个 attach 会话中保持打开状态。
  如果 stdinOnce 设置为 true，则 stdin 在容器启动时打开，在第一个客户端连接到 stdin 之前为空，
  然后保持打开并接受数据，直到客户端断开连接，此时 stdin 关闭并保持关闭直到容器重新启动。
  如果此标志为 false，则从 stdin 读取的容器进程将永远不会收到 EOF。默认为 false。

<!--
- **tty** (boolean)

  Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.
-->
- **tty** (boolean)

  这个容器是否应该为自己分配一个 TTY，也需要 stdin 为 true。默认为 false。

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

  可选字段。securityContext 定义了运行临时容器的安全选项。
  如果设置了此字段，SecurityContext 的字段将覆盖 PodSecurityContext 的等效字段。

  SecurityContext 保存将应用于容器的安全配置。
  一些字段在 SecurityContext 和 PodSecurityContext 中都存在。
  当两者都设置时，SecurityContext 中的值优先。

  <!--
  - **securityContext.runAsUser** (int64)

    The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.runAsUser** （int64）

    运行容器进程入口点的 UID。如果未指定，则默认为镜像元数据中指定的用户。
    也可以在 PodSecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext
    中设置，则在 SecurityContext 中指定的值优先。
    注意，`spec.os.name` 为 "windows" 时不能设置该字段。

  <!--
  - **securityContext.runAsNonRoot** (boolean)

    Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
  -->

  - **securityContext.runAsNonRoot** （boolean）

    指示容器必须以非 root 用户身份运行。如果为 true，Kubelet 将在运行时验证镜像，
    以确保它不会以 UID 0（root）身份运行，如果是，则无法启动容器。
    如果未设置或为 false，则不会执行此类验证。也可以在 PodSecurityContext 中设置。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext
    中指定的值优先。

  <!--
  - **securityContext.runAsGroup** (int64)

    The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.runAsGroup** （int64）

    运行容器进程入口点的 GID。如果未设置，则使用运行时默认值。也可以在 PodSecurityContext 中设置。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext
    中指定的值优先。注意，`spec.os.name` 为 "windows" 时不能设置该字段。

  <!--
  - **securityContext.readOnlyRootFilesystem** (boolean)

    Whether this container has a read-only root filesystem. Default is false. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.readOnlyRootFilesystem** （boolean）

    此容器是否具有只读根文件系统。
    默认为 false。注意，`spec.os.name` 为 "windows" 时不能设置该字段。

  <!--
  - **securityContext.procMount** (string)

    procMount denotes the type of proc mount to use for the containers. The default is DefaultProcMount which uses the container runtime defaults for readonly paths and masked paths. This requires the ProcMountType feature flag to be enabled. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.procMount** （string）

    procMount 表示用于容器的 proc 挂载类型。默认值为 DefaultProcMount，
    它将容器运行时默认值用于只读路径和掩码路径。这需要启用 ProcMountType 特性门控。
    注意，`spec.os.name` 为 "windows" 时不能设置该字段。

  <!--
  - **securityContext.privileged** (boolean)

    Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host. Defaults to false. Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.privileged** （boolean）

    以特权模式运行容器。特权容器中的进程本质上等同于主机上的 root。默认为 false。
    注意，`spec.os.name` 为 "windows" 时不能设置该字段。

  <!--
  - **securityContext.allowPrivilegeEscalation** (boolean)

    AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process. This bool directly controls if the no_new_privs flag will be set on the container process. AllowPrivilegeEscalation is true always when the container is: 1) run as Privileged 2) has CAP_SYS_ADMIN Note that this field cannot be set when spec.os.name is windows.
  -->

  - **securityContext.allowPrivilegeEscalation** （boolean）

    allowPrivilegeEscalation 控制进程是否可以获得比其父进程更多的权限。
    此布尔值直接控制是否在容器进程上设置 `no_new_privs` 标志。allowPrivilegeEscalation
    在容器处于以下状态时始终为 true：

    1. 以特权身份运行
    2. 具有 `CAP_SYS_ADMIN` 权能

    请注意，当 `spec.os.name` 为 "windows" 时，无法设置此字段。

  <!--
  - **securityContext.capabilities** (Capabilities)

    The capabilities to add/drop when running containers. Defaults to the default set of capabilities granted by the container runtime. Note that this field cannot be set when spec.os.name is windows.

    <a name="Capabilities"></a>
    *Adds and removes POSIX capabilities from running containers.*
  -->

  - **securityContext.capabilities** (Capabilities)

    运行容器时添加/放弃的权能。默认为容器运行时授予的默认权能集。
    注意，`spec.os.name` 为 "windows" 时不能设置此字段。

    **在运行中的容器中添加和放弃 POSIX 权能。**

    <!--
    - **securityContext.capabilities.add** ([]string)

      Added capabilities

    - **securityContext.capabilities.drop** ([]string)

      Removed capabilities
    -->

    - **securityContext.capabilities.add** （[]string）

      新增的权能。

    - **securityContext.capabilities.drop** （[]string）

      放弃的权能。

  <!--
  - **securityContext.seccompProfile** (SeccompProfile)

    The seccomp options to use by this container. If seccomp options are provided at both the pod & container level, the container options override the pod options. Note that this field cannot be set when spec.os.name is windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.*
  -->

  - **securityContext.seccompProfile** （SeccompProfile）

    此容器使用的 seccomp 选项。如果在 Pod 和容器级别都提供了 seccomp 选项，
    则容器选项会覆盖 Pod 选项。注意，`spec.os.name` 为 "windows" 时不能设置该字段。

    **SeccompProfile 定义 Pod 或容器的 seccomp 配置文件设置。只能设置一个配置文件源。**

    <!--
    - **securityContext.seccompProfile.type** (string), required

      type indicates which kind of seccomp profile will be applied. Valid options are:
      
      Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.
    --> 

    - **securityContext.seccompProfile.type** (string)，必需

      type 指示将应用哪种 seccomp 配置文件。有效的选项是：
      
      - `Localhost` - 应使用在节点上的文件中定义的配置文件。
      - `RuntimeDefault` - 应使用容器运行时默认配置文件。
      - `Unconfined` - 不应应用任何配置文件。

    <!--
    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must be set if type is "Localhost". Must NOT be set for any other type.
    -->
     
    - **securityContext.seccompProfile.localhostProfile** （string）

      localhostProfile 指示应使用在节点上的文件中定义的配置文件。
      该配置文件必须在节点上预先配置才能工作。
      必须是相对于 kubelet 配置的 seccomp 配置文件位置下的子路径。
      仅当 type 为 "Localhost" 时才必须设置。不得为任何其他类别设置此字段。

  <!--
  - **securityContext.seLinuxOptions** (SELinuxOptions)

    The SELinux context to be applied to the container. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

    <a name="SELinuxOptions"></a>
    *SELinuxOptions are the labels to be applied to the container*
  -->

  - **securityContext.seLinuxOptions** （SELinuxOptions）

    要应用于容器的 SELinux 上下文。如果未指定，容器运行时将为每个容器分配一个随机
    SELinux 上下文。也可以在 PodSecurityContext 中设置。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext
    中指定的值优先。注意，`spec.os.name` 为 "windows" 时不能设置此字段。

    <a name="SELinuxOptions"></a>
    **SELinuxOptions 是要应用于容器的标签**

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

      level 是应用于容器的 SELinux 级别标签。

    - **securityContext.seLinuxOptions.role** （string）

      role 是应用于容器的 SELinux 角色标签。

    - **securityContext.seLinuxOptions.type** （string）

      type 是适用于容器的 SELinux 类型标签。

    - **securityContext.seLinuxOptions.user** （string）

      user 是应用于容器的 SELinux 用户标签。

  <!--
  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    The Windows specific settings applied to all containers. If unspecified, the options from the PodSecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions contain Windows-specific options and credentials.*
  -->

  - **securityContext.windowsOptions** （WindowsSecurityContextOptions）

    要应用到所有容器上的特定于 Windows 的设置。如果未指定，将使用 PodSecurityContext 中的选项。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext
    中指定的值优先。注意，`spec.os.name` 为 "linux" 时不能设置此字段。

    <a name="WindowsSecurityContextOptions"></a>
    **WindowsSecurityContextOptions 包含特定于 Windows 的选项和凭据。**

    <!--
    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName is the name of the GMSA credential spec to use.
    -->

    - **securityContext.windowsOptions.gmsaCredentialSpec** （string）

      gmsaCredentialSpec 是 [GMSA 准入 Webhook](https://github.com/kubernetes-sigs/windows-gmsa)
      内嵌由 gmsaCredentialSpecName 字段所指定的 GMSA 凭证规约内容的地方。

    - **securityContext.windowsOptions.gmsaCredentialSpecName** （string）

      gmsaCredentialSpecName 是要使用的 GMSA 凭证规约的名称。

    <!--
    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess determines if a container should be run as a 'Host Process' container. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers).  In addition, if HostProcess is true then HostNetwork must also be set to true.
    -->

    - **securityContext.windowsOptions.hostProcess** （boolean）

      hostProcess 确定容器是否应作为 "主机进程" 容器运行。
      一个 Pod 的所有容器必须具有相同的有效 hostProcess 值
      （不允许混合设置了 hostProcess 的容器和未设置 hostProcess 的容器）。
      此外，如果 hostProcess 为 true，则 hostNetwork 也必须设置为 true。

    <!--
    - **securityContext.windowsOptions.runAsUserName** (string)

      The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
    -->

    - **securityContext.windowsOptions.runAsUserName** （string）

      Windows 中运行容器进程入口点的用户名。如果未指定，则默认为镜像元数据中指定的用户。
      也可以在 PodSecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext
      中设置，则在 SecurityContext 中指定的值优先。

<!--
### Not allowed
-->
### 不允许

<!--
- **ports** ([]ContainerPort)

  *Patch strategy: merge on key `containerPort`*
  
  *Map: unique values on keys `containerPort, protocol` will be kept during a merge*
  
  Ports are not allowed for ephemeral containers.

  <a name="ContainerPort"></a>
  *ContainerPort represents a network port in a single container.*
-->

- **ports**（[]ContainerPort）

  **补丁策略：基于 `containerPort` 键合并**
  
  **映射：键 `containerPort, protocol` 组合的唯一值将在合并期间保留**
  
  临时容器不允许使用端口。

  <a name="ContainerPort"></a>
  **ContainerPort 表示单个容器中的网络端口。**

  <!--
  - **ports.containerPort** (int32), required

    Number of port to expose on the pod's IP address. This must be a valid port number, 0 \< x \< 65536.

  - **ports.hostIP** (string)

    What host IP to bind the external port to.
  -->

  - **ports.containerPort** （int32），必需

    要在容器的 IP 地址上公开的端口号。这必须是有效的端口号 0 \< x \< 65536。

  - **ports.hostIP** （string）

    要将外部端口绑定到的主机 IP。

  <!--
  - **ports.hostPort** (int32)

    Number of port to expose on the host. If specified, this must be a valid port number, 0 \< x \< 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.
  -->

  - **ports.hostPort** （int32）

    要在主机上公开的端口号。如果设置了，则作为必须是一个有效的端口号，0 \< x \< 65536。
    如果指定了 hostNetwork，此值必须与 containerPort 匹配。大多数容器不需要这个配置。

  <!--
  - **ports.name** (string)

    If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.

  - **ports.protocol** (string)

    Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".
  -->
 
  - **ports.name**（string）

    如果指定了，则作为端口的名称。必须是 IANA_SVC_NAME 并且在 Pod 中是唯一的。
    Pod 中的每个命名端口都必须具有唯一的名称。服务可以引用的端口的名称。

  - **ports.protocol** （string）

    端口协议。必须是 `UDP`、`TCP` 或 `SCTP` 之一。默认为 `TCP`。

<!--
- **resources** (ResourceRequirements)

  Resources are not allowed for ephemeral containers. Ephemeral containers use spare resources already allocated to the pod.

  <a name="ResourceRequirements"></a>
  *ResourceRequirements describes the compute resource requirements.*
-->
- **resources** (ResourceRequirements)

  临时容器不允许使用资源。临时容器使用已分配给 Pod 的空闲资源。

  **ResourceRequirements 描述计算资源的需求。**

  <!--
  - **resources.claims** ([]ResourceClaim)

    *Map: unique values on key name will be kept during a merge*
    
    Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.
  -->
  
  - **resources.claims** ([]ResourceClaim)

    **映射：键 `name` 的唯一值将在合并过程中保留**

    claims 列出了此容器使用的资源名称，资源名称在 `spec.resourceClaims` 中定义。

    <!--
    This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.
    
    This field is immutable. It can only be set for containers.
    -->
    
    这是一个 Alpha 特性字段，需要启用 DynamicResourceAllocation 功能门控开启此特性。

    此字段不可变更，只能在容器级别设置。

    <a name="ResourceClaim"></a>
    <!--
    *ResourceClaim references one entry in PodSpec.ResourceClaims.*

    - **resources.claims.name** (string), required

      Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.
    -->
    
    **ResourceClaim 引用 `PodSpec.ResourceClaims` 中的一项。**

    - **resources.claims.name** (string)，必需
      
      `name` 必须与使用该字段 Pod 的 `pod.spec.resourceClaims`
      中的一个条目的名称相匹配。它使该资源在容器内可用。

  <!--
  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
  -->

  - **resources.limits** （map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>）

    limits 描述所允许的最大计算资源量。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

  <!--
  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
  -->

  - **resources.requests** （map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>）

    requests 描述所需的最小计算资源量。如果对容器省略了 requests，则默认其资源请求值为 limits
    （如果已显式指定）的值，否则为实现定义的值。请求不能超过限制。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

<!--
- **lifecycle** (Lifecycle)

  Lifecycle is not allowed for ephemeral containers.

  <a name="Lifecycle"></a>
  *Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted.*
-->
- **lifecycle** (Lifecycle)

  临时容器不允许使用生命周期。

  生命周期描述了管理系统为响应容器生命周期事件应采取的行动。
  对于 postStart 和 preStop 生命周期处理程序，容器的管理会阻塞，直到操作完成，
  除非容器进程失败，在这种情况下处理程序被中止。

  <!--
  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
  -->

  - **lifecycle.postStart** （<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>）

    创建容器后立即调用 postStart。如果处理程序失败，则容器将根据其重新启动策略终止并重新启动。
    容器的其他管理阻塞直到钩子完成。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

  <!--
  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PreStop is called immediately before a container is terminated due to an API request or management event such as liveness/startup probe failure, preemption, resource contention, etc. The handler is not called if the container crashes or exits. The Pod's termination grace period countdown begins before the PreStop hook is executed. Regardless of the outcome of the handler, the container will eventually terminate within the Pod's termination grace period (unless delayed by finalizers). Other management of the container blocks until the hook completes or until the termination grace period is reached. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
  -->

  - **lifecycle.preStop** （<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>）

    preStop 在容器因 API 请求或管理事件（例如：存活态探针/启动探针失败、抢占、资源争用等）
    而终止之前立即调用。如果容器崩溃或退出，则不会调用处理程序。
    Pod 的终止宽限期倒计时在 preStop 钩子执行之前开始。
    无论处理程序的结果如何，容器最终都会在 Pod 的终止宽限期内终止（除非被终结器延迟）。
    容器的其他管理会阻塞，直到钩子完成或达到终止宽限期。更多信息：
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

  临时容器不允许使用探针。

- **readyProbe** （<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>）

  临时容器不允许使用探针。

- **startupProbe** （<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>）

  临时容器不允许使用探针。


## LifecycleHandler {#LifecycleHandler}

<!--
LifecycleHandler defines a specific action that should be taken in a lifecycle hook. One and only one of the fields, except TCPSocket must be specified.
-->
LifecycleHandler 定义了应在生命周期挂钩中执行的特定操作。
必须指定一个且只能指定一个字段，tcpSocket 除外。

<hr>

<!--
- **exec** (ExecAction)

  Exec specifies the action to take.

  <a name="ExecAction"></a>
  *ExecAction describes a "run in container" action.*
-->
- **exec** （execAction）

  Exec 指定要执行的操作。

  <a name="ExecAction"></a>
  **ExecAction 描述了 "在容器中运行" 操作。**

  <!--
  - **exec.command** ([]string)

    Command is the command line to execute inside the container, the working directory for the command  is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.
  -->

  - **exec.command** （[]string）

    command 是要在容器内执行的命令行，命令的工作目录是容器文件系统中的根目录（'/'）。
    该命令只是被通过 `exec` 执行，而不会单独启动一个 Shell 来运行，因此传统的
    Shell 指令（'|' 等）将不起作用。要使用某 Shell，你需要显式调用该 Shell。
    退出状态 0 被视为活动/健康，非零表示不健康。

<!--
- **httpGet** (HTTPGetAction)

  HTTPGet specifies the http request to perform.

  <a name="HTTPGetAction"></a>
  *HTTPGetAction describes an action based on HTTP Get requests.*
-->

- **httpGet** （HTTPGetAction）

  HTTPGet 指定要执行的 HTTP 请求。

  <a name="HTTPGetAction"></a>
  **HTTPGetAction 描述基于 HTTP Get 请求的操作。**

  <!--
  - **httpGet.port** (IntOrString), required

    Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
  -->

  - **httpGet.port** （IntOrString），必需

    要在容器上访问的端口的名称或编号。数字必须在 1 到 65535 的范围内。名称必须是 IANA_SVC_NAME。

    <a name="IntOrString"></a>
    **IntOrString 是一种可以包含 int32 或字符串值的类型。在 JSON 或 YAML 封组和取消编组时，
    它会生成或使用内部类型。例如，这允许你拥有一个可以接受名称或数字的 JSON 字段。**

  <!--
  - **httpGet.host** (string)

    Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.

  - **httpGet.httpHeaders** ([]HTTPHeader)

    Custom headers to set in the request. HTTP allows repeated headers.

    <a name="HTTPHeader"></a>
    *HTTPHeader describes a custom header to be used in HTTP probes*
  -->

  - **httpGet.host** （string）

    要连接的主机名，默认为 Pod IP。你可能想在 `httpHeaders` 中设置 "Host"。

  - **httpGet.httpHeaders** （[]HTTPHeader）

    要在请求中设置的自定义标头。HTTP 允许重复的标头。

    <a name="HTTPHeader"></a>
    **HTTPHeader 描述了在 HTTP 探针中使用的自定义标头**

    <!--
    - **httpGet.httpHeaders.name** (string), required

      The header field name. This will be canonicalized upon output, so case-variant names will be understood as the same header.

    - **httpGet.httpHeaders.value** (string), required

      The header field value
    -->

    - **httpGet.httpHeaders.name** (string)，必需

      HTTP 头部字段名称。
      在输出时，它将被规范化处理，因此大小写变体的名称会被视为相同的头。

    - **httpGet.httpHeaders.value** (string)，必需

      HTTP 头部字段取值。

  <!--
  - **httpGet.path** (string)

    Path to access on the HTTP server.

  - **httpGet.scheme** (string)

    Scheme to use for connecting to the host. Defaults to HTTP.
  -->
 
  - **httpGet.path** （string）

    HTTP 服务器上的访问路径。

  - **httpGet.scheme** （string）

    用于连接到主机的方案。默认为 `HTTP`。

<!--
- **tcpSocket** （TCPSocketAction）

  Deprecated. TCPSocket is NOT supported as a LifecycleHandler and kept for the backward compatibility. There are no validation of this field and lifecycle hooks will fail in runtime when tcp handler is specified.

  <a name="TCPSocketAction"></a>
  *TCPSocketAction describes an action based on opening a socket*
-->
- **tcpSocket** （TCPSocketAction）

  已弃用。不再支持 `tcpSocket` 作为 LifecycleHandler，但为向后兼容保留之。
  当指定 `tcp` 处理程序时，此字段不会被验证，而生命周期回调将在运行时失败。

  <a name="TCPSocketAction"></a>
  **TCPSocketAction 描述基于打开套接字的动作。**

  <!--
  - **tcpSocket.port** (IntOrString), required

    Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.
  -->

  - **tcpSocket.port** (IntOrString)，必需

    容器上要访问的端口的编号或名称。端口号必须在 1 到 65535 的范围内。
    名称必须是 IANA_SVC_NAME。

    <a name="IntOrString"></a>
    <!--
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
    -->
    
    **IntOrString 是一种可以保存 int32 或字符串值的类型。在 JSON 或 YAML 编组和解组中使用时，
    会生成或使用内部类型。例如，这允许你拥有一个可以接受名称或数字的 JSON 字段。**

  <!--
  - **tcpSocket.host** (string)

    Optional: Host name to connect to, defaults to the pod IP.
  -->

  - **tcpSocket.host** （string）

    可选字段。要连接的主机名，默认为 Pod IP。

## NodeAffinity {#NodeAffinity}

<!--
Node affinity is a group of node affinity scheduling rules.
-->
节点亲和性是一组节点亲和性调度规则。

<hr>

<!--
- **preferredDuringSchedulingIgnoredDuringExecution** ([]PreferredSchedulingTerm)

  The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node matches the corresponding matchExpressions; the node(s) with the highest sum are the most preferred.

  <a name="PreferredSchedulingTerm"></a>
  *An empty preferred scheduling term matches all objects with implicit weight 0 (i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op).*

-->

- **preferredDuringSchedulingIgnoredDuringExecution** （[]PreferredSchedulingTerm）

  调度程序会更倾向于将 Pod 调度到满足该字段指定的亲和性表达式的节点，
  但它可能会选择违反一个或多个表达式的节点。最优选的节点是权重总和最大的节点，
  即对于满足所有调度要求（资源请求、requiredDuringScheduling 亲和表达式等）的每个节点，
  通过迭代该字段的元素来计算总和如果节点匹配相应的 matchExpressions，则将 "权重" 添加到总和中； 
  具有最高总和的节点是最优选的。

  空的首选调度条件匹配所有具有隐式权重 0 的对象（即它是一个 no-op 操作）。
  null 值的首选调度条件不匹配任何对象（即也是一个 no-op 操作）。

  <!--
  - **preferredDuringSchedulingIgnoredDuringExecution.preference** (NodeSelectorTerm), required

    A node selector term, associated with the corresponding weight.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*
  -->

  - **preferredDuringSchedulingIgnoredDuringExecution.preference** (NodeSelectorTerm)，必需

    与相应权重相关联的节点选择条件。

    null 值或空值的节点选择条件不会匹配任何对象。这些条件的请求按逻辑与操作组合。
    TopologySelectorTerm 类型实现了 NodeSelectorTerm 的一个子集。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's labels.

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's fields.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchExpressions** （[]<a href="{{< ref "../common-definitions/node-selector-requirement" >}}">NodeSelectorRequirement</a>）

      按节点标签列出的节点选择条件列表。

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchFields** （[]<a href="{{< ref "../common-definitions/node-selector-requirement" >}}">NodeSelectorRequirement</a>）

      按节点字段列出的节点选择要求列表。

  <!--
  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), required

    Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.
  -->

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32)，必需

    与匹配相应的 nodeSelectorTerm 相关的权重，范围为 1-100。

<!--
- **requiredDuringSchedulingIgnoredDuringExecution** (NodeSelector)

  If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to an update), the system may or may not try to eventually evict the pod from its node.

  <a name="NodeSelector"></a>
  *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*
-->

- **requiredDuringSchedulingIgnoredDuringExecution** （NodeSelector）

  如果在调度时不满足该字段指定的亲和性要求，则不会将 Pod 调度到该节点上。
  如果在 Pod 执行期间的某个时间点不再满足此字段指定的亲和性要求（例如：由于更新），
  系统可能会或可能不会尝试最终将 Pod 从其节点中逐出。

  <a name="NodeSelector"></a>
  **一个节点选择器代表一个或多个标签查询结果在一组节点上的联合；换言之，
  它表示由节点选择器项表示的选择器的逻辑或组合。**

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms** ([]NodeSelectorTerm), required

    Required. A list of node selector terms. The terms are ORed.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms** ([]NodeSelectorTerm)，必需

    必需的字段。节点选择条件列表。这些条件按逻辑或操作组合。

    null 值或空值的节点选择器条件不匹配任何对象。这里的条件是按逻辑与操作组合的。
    TopologySelectorTerm 类型实现了 NodeSelectorTerm 的一个子集。

    <!--
    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's labels.

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's fields.
    -->

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchExpressions** （[]<a href="{{< ref "../common-definitions/node-selector-requirement" >}}">NodeSelectorRequirement</a>）

      按节点标签列出的节点选择器需求列表。

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchFields** （[]<a href="{{< ref "../common-definitions/node-selector-requirement" >}}">NodeSelectorRequirement</a>）

      按节点字段列出的节点选择器要求列表。

## PodAffinity {#PodAffinity}

<!--
Pod affinity is a group of inter pod affinity scheduling rules.
-->
Pod 亲和性是一组 Pod 间亲和性调度规则。

<hr>

<!--
- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.

  <a name="WeightedPodAffinityTerm"></a>
  *The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)*
-->

- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  调度器会更倾向于将 Pod 调度到满足该字段指定的亲和性表达式的节点，
  但它可能会选择违反一个或多个表达式的节点。最优选择是权重总和最大的节点，
  即对于满足所有调度要求（资源请求、`requiredDuringScheduling` 亲和表达式等）的每个节点，
  通过迭代该字段的元素来计算总和，如果节点具有与相应 `podAffinityTerm`
  匹配的 Pod，则将“权重”添加到总和中； 
  具有最高总和的节点是最优选的。

  <a name="WeightedPodAffinityTerm"></a>
  **所有匹配的 WeightedPodAffinityTerm 字段的权重都是按节点累计的，以找到最优选的节点。**

  <!--
  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm), required

    Required. A pod affinity term, associated with the corresponding weight.

    <a name="PodAffinityTerm"></a>
    *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*
  -->

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm)，必需

    必需的字段。一个 Pod 亲和性条件，对应一个与相应的权重值。

    <a name="PodAffinityTerm"></a>
    定义一组 Pod（即那些与给定名字空间相关的标签选择算符匹配的 Pod 集合），
    当前 Pod 应该与所选 Pod 集合位于同一位置（亲和性）或位于不同位置（反亲和性），
    其中“在同一位置”意味着运行在一个节点上，其键 `topologyKey` 的标签值与运行所选 Pod
    集合中的某 Pod 的任何节点上的标签值匹配。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string), required

      This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string)，必需

      此 Pod 应与指定名字空间中与标签选择算符匹配的 Pod 集合位于同一位置（亲和性）
      或位于不同位置（反亲和性），这里的“在同一位置”意味着运行在一个节点上，其键名为
      `topologyKey` 的标签值与运行所选 Pod 集合中的某 Pod 的任何节点上的标签值匹配。
      不允许使用空的 `topologyKey`。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over a set of resources, in this case pods.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

      对一组资源的标签查询，在这里资源为 Pod。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

      对条件所适用的名字空间集合的标签查询。
      此条件会被应用到此字段所选择的名字空间和 namespaces 字段中列出的名字空间的组合之上。
      选择算符为 null 和 namespaces 列表为 null 值或空表示“此 Pod 的名字空间”。
      空的选择算符 ({}) 可用来匹配所有名字空间。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** ([]string)

      namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** （[]string）

      namespaces 指定此条件所适用的名字空间，是一个静态列表。
      此条件会被应用到 namespaces 字段中列出的名字空间和由 namespaceSelector 选中的名字空间上。
      namespaces 列表为 null 或空，以及 namespaceSelector 值为 null 均表示“此 Pod 的名字空间”。

  <!--
  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), required

    weight associated with matching the corresponding podAffinityTerm, in the range 1-100.
  -->

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32)，必需

    weight 是匹配相应 `podAffinityTerm` 条件的权重，范围为 1-100。

<!--
- **requiredDuringSchedulingIgnoredDuringExecution** ([]PodAffinityTerm)

  If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.

  <a name="PodAffinityTerm"></a>
  *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*
-->

- **requiredDuringSchedulingIgnoredDuringExecution** （[]PodAffinityTerm）

  如果在调度时不满足该字段指定的亲和性要求，则该 Pod 不会被调度到该节点上。
  如果在 Pod 执行期间的某个时间点不再满足此字段指定的亲和性要求（例如：由于 Pod 标签更新），
  系统可能会也可能不会尝试最终将 Pod 从其节点中逐出。
  当此列表中有多个元素时，每个 `podAffinityTerm` 对应的节点列表是取其交集的，即必须满足所有条件。

  <a name="PodAffinityTerm"></a>
  定义一组 Pod（即那些与给定名字空间相关的标签选择算符匹配的 Pod 集合），当前 Pod 应该与该
  Pod 集合位于同一位置（亲和性）或不位于同一位置（反亲和性）。
  这里的“位于同一位置”含义是运行在一个节点上。基于 `topologyKey` 字段所给的标签键名，
  检查所选 Pod 集合中各个 Pod 所在的节点上的标签值，标签值相同则认作“位于同一位置”。

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string), required

    This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string)，必需

    此 Pod 应与指定名字空间中与标签选择算符匹配的 Pod 集合位于同一位置（亲和性）
    或不位于同一位置（反亲和性），
    这里的“位于同一位置”含义是运行在一个节点上。基于 `topologyKey` 字段所给的标签键名，
    检查所选 Pod 集合中各个 Pod 所在的节点上的标签值，标签值相同则认作“位于同一位置”。
    不允许使用空的 `topologyKey`。

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over a set of resources, in this case pods.
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

    对一组资源的标签查询，在这里资源为 Pod。

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

    对条件所适用的名字空间集合的标签查询。
    当前条件将应用于此字段选择的名字空间和 namespaces 字段中列出的名字空间。
    选择算符为 null 和 namespaces 列表为 null 或空值表示“此 Pod 的名字空间”。
    空选择算符 ({}) 能够匹配所有名字空间。


  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** ([]string)

    namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** （[]string）

    namespaces 指定当前条件所适用的名字空间名称的静态列表。
    当前条件适用于此字段中列出的名字空间和由 namespaceSelector 选中的名字空间。
    namespaces 列表为 null 或空，以及 namespaceSelector 为 null 表示“此 Pod 的名字空间”。

## PodAntiAffinity {#PodAntiAffinity}

<!--
Pod anti affinity is a group of inter pod anti affinity scheduling rules.
-->
Pod 反亲和性是一组 Pod 间反亲和性调度规则。

<hr>

<!--
- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  The scheduler will prefer to schedule pods to nodes that satisfy the anti-affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling anti-affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.


  <a name="WeightedPodAffinityTerm"></a>
  *The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)*
-->
- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)

  调度器更倾向于将 Pod 调度到满足该字段指定的反亲和性表达式的节点，
  但它可能会选择违反一个或多个表达式的节点。
  最优选的节点是权重总和最大的节点，即对于满足所有调度要求（资源请求、`requiredDuringScheduling`
  反亲和性表达式等）的每个节点，通过遍历元素来计算总和如果节点具有与相应 `podAffinityTerm`
  匹配的 Pod，则此字段并在总和中添加"权重"；具有最高加和的节点是最优选的。

  <a name="WeightedPodAffinityTerm"></a>
  **所有匹配的 WeightedPodAffinityTerm 字段的权重都是按节点添加的，以找到最优选的节点。**

  <!--
  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm), required

    Required. A pod affinity term, associated with the corresponding weight.

    <a name="PodAffinityTerm"></a>
    *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*
  -->

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm)，必需

    必需的字段。一个 Pod 亲和性条件，与相应的权重相关联。

    <a name="PodAffinityTerm"></a>
    定义一组 Pod（即那些与给定名字空间相关的标签选择算符匹配的 Pod 集合），
    当前 Pod 应该与所选 Pod 集合位于同一位置（亲和性）或不位于同一位置（反亲和性），
    其中 "在同一位置" 意味着运行在一个节点上，其键 `topologyKey` 的标签值与运行所选 Pod
    集合中的某 Pod 的任何节点上的标签值匹配。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string), required

      This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string)，必需

      此 Pod 应与指定名字空间中与标签选择算符匹配的 Pod 集合位于同一位置（亲和性）
      或不位于同一位置（反亲和性），这里的 "在同一位置" 意味着运行在一个节点上，其键名为
      `topologyKey` 的标签值与运行所选 Pod 集合中的某 Pod 的任何节点上的标签值匹配。
      不允许使用空的 `topologyKey`。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over a set of resources, in this case pods.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

      对一组资源的标签查询，在这里资源为 Pod。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

      对条件所适用的名字空间集合的标签查询。
      此条件会被应用到此字段所选择的名字空间和 namespaces 字段中列出的名字空间的组合之上。
      选择算符为 null 和 namespaces 列表为 null 值或空表示 "此 Pod 的名字空间"。
      空的选择算符 ({}) 可用来匹配所有名字空间。

    <!--
    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** ([]string)

      namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".
    -->

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** （[]string）

      namespaces 指定此条件所适用的名字空间，是一个静态列表。
      此条件会被应用到 namespaces 字段中列出的名字空间和由 namespaceSelector 选中的名字空间上。
      namespaces 列表为 null 或空，以及 namespaceSelector 值为 null 均表示 "此 Pod 的名字空间"。

  <!--
  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), required

    weight associated with matching the corresponding podAffinityTerm, in the range 1-100.
  -->

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32)，必需

    weight 是匹配相应 `podAffinityTerm` 条件的权重，范围为 1-100。

<!--
- **requiredDuringSchedulingIgnoredDuringExecution** ([]PodAffinityTerm)

  If the anti-affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the anti-affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.

  <a name="PodAffinityTerm"></a>
  *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*
-->

- **requiredDuringSchedulingIgnoredDuringExecution** （[]PodAffinityTerm）

  如果在调度时不满足该字段指定的反亲和性要求，则该 Pod 不会被调度到该节点上。
  如果在 Pod 执行期间的某个时间点不再满足此字段指定的反亲和性要求（例如：由于 Pod 标签更新），
  系统可能会或可能不会尝试最终将 Pod 从其节点中逐出。
  当有多个元素时，每个 `podAffinityTerm` 对应的节点列表是取其交集的，即必须满足所有条件。

  <a name="PodAffinityTerm"></a>
  定义一组 Pod（即那些与给定名字空间相关的标签选择算符匹配的 Pod 集合），当前 Pod 应该与该
  Pod 集合位于同一位置（亲和性）或不位于同一位置（反亲和性）。
  这里的 "位于同一位置" 含义是运行在一个节点上。基于 `topologyKey` 字段所给的标签键名，
  检查所选 Pod 集合中各个 Pod 所在的节点上的标签值，标签值相同则认作 "位于同一位置"。

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string), required

    This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string)，必需

    此 Pod 应与指定名字空间中与标签选择算符匹配的 Pod 集合位于同一位置（亲和性）
    或不位于同一位置（反亲和性），
    这里的 "位于同一位置" 含义是运行在一个节点上。基于 `topologyKey` 字段所给的标签键名，
    检查所选 Pod 集合中各个 Pod 所在的节点上的标签值，标签值相同则认作 "位于同一位置"。
    不允许使用空的 `topologyKey`。

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over a set of resources, in this case pods.
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

    对一组资源的标签查询，在这里资源为 Pod。

  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** （<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

    对条件所适用的名字空间集合的标签查询。
    当前条件将应用于此字段选择的名字空间和 namespaces 字段中列出的名字空间。
    选择算符为 null 和 namespaces 列表为 null 或空值表示 “此 Pod 的名字空间”。
    空选择算符 ({}) 能够匹配所有名字空间。


  <!--
  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** ([]string)

    namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".
  -->

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** （[]string）

    namespaces 指定当前条件所适用的名字空间名称的静态列表。
    当前条件适用于此字段中列出的名字空间和由 namespaceSelector 选中的名字空间。
    namespaces 列表为 null 或空，以及 namespaceSelector 为 null 表示 “此 Pod 的名字空间”。


<!--
## Probe {#Probe}
-->
## 探针 {#Probe}

<!--
Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.
-->
探针描述了要对容器执行的健康检查，以确定它是否处于活动状态或准备好接收流量。

<hr>

<!--
- **exec** (ExecAction)

  Exec specifies the action to take.

  <a name="ExecAction"></a>
  *ExecAction describes a "run in container" action.*
-->
- **exec** （execAction）

  exec 指定要执行的操作。

  <a name="ExecAction"></a>
  **ExecAction 描述了 "在容器中运行" 操作。**

  <!--
  - **exec.command** ([]string)

    Command is the command line to execute inside the container, the working directory for the command  is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.
  -->

  - **exec.command** （[]string）

    command 是要在容器内执行的命令行，命令的工作目录是容器文件系统中的根目录（'/'）。
    该命令只是通过 `exec` 执行，而不会启动 Shell，因此传统的 Shell 指令（'|' 等）将不起作用。
    要使用某 Shell，你需要显式调用该 Shell。
    退出状态 0 被视为存活/健康，非零表示不健康。

<!--
- **httpGet** (HTTPGetAction)

  HTTPGet specifies the http request to perform.

  <a name="HTTPGetAction"></a>
  *HTTPGetAction describes an action based on HTTP Get requests.*
-->
- **httpGet** （HTTPGetAction）

  httpGet 指定要执行的 HTTP 请求。

  <a name="HTTPGetAction"></a>
  **HTTPGetAction 描述基于 HTTP Get 请求的操作。**

  <!--
  - **httpGet.port** (IntOrString), required

    Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
  -->

  - **httpGet.port** (IntOrString)，必需

    容器上要访问的端口的名称或端口号。端口号必须在 1 到 65535 内。名称必须是 IANA_SVC_NAME。

    <a name="IntOrString"></a>
    `IntOrString` 是一种可以保存 int32 或字符串值的类型。在 JSON 或 YAML 编组和解组时，
    它会生成或使用内部类型。例如，这允许你拥有一个可以接受名称或数字的 JSON 字段。

  <!--
  - **httpGet.host** (string)

    Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.
  -->

  - **httpGet.host** （string）

    要连接的主机名，默认为 Pod IP。你可能想在 `httpHeaders` 中设置 "Host"。

  <!--
  - **httpGet.httpHeaders** ([]HTTPHeader)

    Custom headers to set in the request. HTTP allows repeated headers.

    <a name="HTTPHeader"></a>
    *HTTPHeader describes a custom header to be used in HTTP probes*
  -->

  - **httpGet.httpHeaders** （[]HTTPHeader）

    要在请求中设置的自定义 HTTP 标头。HTTP 允许重复的标头。

    <a name="HTTPHeader"></a>
    **HTTPHeader 描述了在 HTTP 探针中使用的自定义标头。**

    <!--
    - **httpGet.httpHeaders.name** (string), required

      The header field name. This will be canonicalized upon output, so case-variant names will be understood as the same header.

    - **httpGet.httpHeaders.value** (string), required

      The header field value
    -->

    - **httpGet.httpHeaders.name** (string)，必需

      HTTP 头部域名称。
      在输出时，它将被规范化处理，因此大小写变体的名称会被视为相同的头。

    - **httpGet.httpHeaders.value** (string)，必需

      HTTP 头部域值。

  <!--
  - **httpGet.path** (string)

    Path to access on the HTTP server.

  - **httpGet.scheme** (string)

    Scheme to use for connecting to the host. Defaults to HTTP.
  -->
 
  - **httpGet.path** （string）

    HTTP 服务器上的访问路径。

  - **httpGet.scheme** （string）

    用于连接到主机的方案。默认为 HTTP。

<!--
- **tcpSocket** (TCPSocketAction)

  TCPSocket specifies an action involving a TCP port.

  <a name="TCPSocketAction"></a>
  *TCPSocketAction describes an action based on opening a socket*
-->

- **tcpSocket** （TCPSocketAction）

  tcpSocket 指定涉及 TCP 端口的操作。

  <a name="TCPSocketAction"></a>
  **`TCPSocketAction` 描述基于打开套接字的动作。**

  <!--
  - **tcpSocket.port** (IntOrString), required

    Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
  -->

  - **tcpSocket.port** (IntOrString)，必需

    容器上要访问的端口的端口号或名称。端口号必须在 1 到 65535 内。名称必须是 IANA_SVC_NAME。

    <a name="IntOrString"></a>
    IntOrString 是一种可以保存 int32 或字符串的类型。在 JSON 或 YAML 编组和解组时，
    它会生成或使用内部类型。例如，这允许你拥有一个可以接受名称或数字的 JSON 字段。

  <!--
  - **tcpSocket.host** (string)

    Optional: Host name to connect to, defaults to the pod IP.
  -->

  - **tcpSocket.host** （string）

    可选字段。要连接的主机名，默认为 Pod IP。

<!--
- **initialDelaySeconds** (int32)

  Number of seconds after the container has started before liveness probes are initiated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
-->
- **初始延迟秒** （int32）

  容器启动后启动存活态探针之前的秒数。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#container-probes

<!--
- **terminationGracePeriodSeconds** (int64)

  Optional duration in seconds the pod needs to terminate gracefully upon probe failure. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. If this value is nil, the pod's terminationGracePeriodSeconds will be used. Otherwise, this value overrides the value provided by the pod spec. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). This is a beta field and requires enabling ProbeTerminationGracePeriod feature gate. Minimum value is 1. spec.terminationGracePeriodSeconds is used if unset.
-->

- **terminationGracePeriodSeconds** （int64）

  Pod 需要在探针失败时体面终止所需的时间长度（以秒为单位），为可选字段。
  宽限期是 Pod 中运行的进程收到终止信号后，到进程被终止信号强制停止之前的时间长度（以秒为单位）。
  你应该将此值设置为比你的进程的预期清理时间更长。
  如果此值为 nil，则将使用 Pod 的 `terminateGracePeriodSeconds`。
  否则，此值将覆盖 Pod 规约中设置的值。字段值值必须是非负整数。
  零值表示收到终止信号立即停止（没有机会关闭）。
  这是一个 Beta 字段，需要启用 ProbeTerminationGracePeriod 特性门控。最小值为 1。
  如果未设置，则使用 `spec.terminationGracePeriodSeconds`。

<!--
- **periodSeconds** (int32)

  How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1.
-->
- **periodSeconds** (int32)

  探针的执行周期（以秒为单位）。默认为 10 秒。最小值为 1。

<!--
- **timeoutSeconds** (int32)

  Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
-->
- **timeoutSeconds** (int32)

  探针超时的秒数。默认为 1 秒。最小值为 1。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#container-probes

<!--
- **failureThreshold** (int32)

  Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.
-->
- **failureThreshold** (int32)

  探针成功后的最小连续失败次数，超出此阈值则认为探针失败。默认为 3。最小值为 1。

<!--
- **successThreshold** (int32)

  Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1.
-->
- **successThreshold** (int32)

  探针失败后最小连续成功次数，超过此阈值才会被视为探针成功。默认为 1。
  存活性探针和启动探针必须为 1。最小值为 1。

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

    gRPC 服务的端口号。数字必须在 1 到 65535 的范围内。

  - **grpc.service** （string）

    service 是要放置在 gRPC 运行状况检查请求中的服务的名称
    （请参见 https://github.com/grpc/grpc/blob/master/doc/health-checking.md）。
    
    如果未指定，则默认行为由 gRPC 定义。

## PodStatus {#PodStatus}

<!--
PodStatus represents information about the status of a pod. Status may trail the actual state of a system, especially if the node that hosts the pod cannot contact the control plane.
-->
PodStatus 表示有关 Pod 状态的信息。状态内容可能会滞后于系统的实际状态，
尤其是在托管 Pod 的节点无法联系控制平面的情况下。

<hr>

<!--
- **nominatedNodeName** (string)

  nominatedNodeName is set only when this pod preempts other pods on the node, but it cannot be scheduled right away as preemption victims receive their graceful termination periods. This field does not guarantee that the pod will be scheduled on this node. Scheduler may decide to place the pod elsewhere if other nodes become available sooner. Scheduler may also decide to give the resources on this node to a higher priority pod that is created after preemption. As a result, this field may be different than PodSpec.nodeName when the pod is scheduled.
-->
- **nominatedNodeName** (string)

  仅当此 Pod 抢占节点上的其他 Pod 时才设置 `nominatedNodeName`，
  但抢占操作的受害者会有体面终止期限，因此此 Pod 无法立即被调度。
  此字段不保证 Pod 会在该节点上调度。
  如果其他节点更早进入可用状态，调度器可能会决定将 Pod 放置在其他地方。
  调度器也可能决定将此节点上的资源分配给优先级更高的、在抢占操作之后创建的 Pod。
  因此，当 Pod 被调度时，该字段可能与 Pod 规约中的 nodeName 不同。

<!--
- **hostIP** (string)

  hostIP holds the IP address of the host to which the pod is assigned. Empty if the pod has not started yet. A pod can be assigned to a node that has a problem in kubelet which in turns mean that HostIP will not be updated even if there is a node is assigned to pod
-->
- **hostIP** (string)

  hostIP 存储分配给 Pod 的主机的 IP 地址。如果 Pod 尚未启动，则为空。
  Pod 可以被调度到 kubelet 有问题的节点上，这意味着即使有节点被分配给 Pod，hostIP 也不会被更新。

<!--
- **hostIPs** ([]HostIP)

  *Patch strategy: merge on key `ip`*
  
  *Atomic: will be replaced during a merge*
  
  hostIPs holds the IP addresses allocated to the host. If this field is specified, the first entry must match the hostIP field. This list is empty if the pod has not started yet. A pod can be assigned to a node that has a problem in kubelet which in turns means that HostIPs will not be updated even if there is a node is assigned to this pod.
-->
- **hostIPs** ([]HostIP)

  **补丁策略：基于 `ip` 键合并**

  **原子性：将在合并期间被替换**

  hostIPs 存储分配给主机的 IP 地址列表。如果此字段被指定，则第一个条目必须与 hostIP 字段匹配。
  如果 Pod 尚未启动，则此列表为空。Pod 可以被调度到 kubelet 有问题的节点上，
  这意味着即使有节点被分配给此 Pod，HostIPs 也不会被更新。

  <!--
  <a name="HostIP"></a>
  *HostIP represents a single IP address allocated to the host.*

  - **hostIPs.ip** (string)

    IP is the IP address assigned to the host
  -->

  <a name="HostIP"></a>
  **HostIP 表示分配给主机的单个 IP 地址。**

  - **hostIPs.ip** (string)

    ip 是分配给主机的 IP 地址。
  
<!--
- **startTime** (Time)

  RFC 3339 date and time at which the object was acknowledged by the Kubelet. This is before the Kubelet pulled the container image(s) for the pod.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->
- **startTime** (Time)

  kubelet 确认 Pod 对象的日期和时间，格式遵从 RFC 3339。
  此时间点处于 kubelet 为 Pod 拉取容器镜像之前。

  Time 是 `time.Time` 的包装器，支持正确编组为 YAML 和 JSON。
  time 包所提供的许多工厂方法都有包装器。

<!--
- **phase** (string)

  The phase of a Pod is a simple, high-level summary of where the Pod is in its lifecycle. The conditions array, the reason and message fields, and the individual container status arrays contain more detail about the pod's status. There are five possible phase values:
  
  Pending: The pod has been accepted by the Kubernetes system, but one or more of the container images has not been created. This includes time before being scheduled as well as time spent downloading images over the network, which could take a while. Running: The pod has been bound to a node, and all of the containers have been created. At least one container is still running, or is in the process of starting or restarting. Succeeded: All containers in the pod have terminated in success, and will not be restarted. Failed: All containers in the pod have terminated, and at least one container has terminated in failure. The container either exited with non-zero status or was terminated by the system. Unknown: For some reason the state of the pod could not be obtained, typically due to an error in communicating with the host of the pod.
-->  
- **phase** (string)

  Pod 的 phase 是对 Pod 在其生命周期中所处位置的简单、高级摘要。
  conditions 数组、reason 和 message 字段以及各个容器的 status 数组包含有关 Pod
  状态的进一步详细信息。phase 的取值有五种可能性：
  
  - `Pending`：Pod 已被 Kubernetes 系统接受，但尚未创建容器镜像。
   这包括 Pod 被调度之前的时间以及通过网络下载镜像所花费的时间。
  - `Running`：Pod 已经被绑定到某个节点，并且所有的容器都已经创建完毕。至少有一个容器仍在运行，或者正在启动或重新启动过程中。
  - `Succeeded`：Pod 中的所有容器都已成功终止，不会重新启动。
  - `Failed`：Pod 中的所有容器都已终止，并且至少有一个容器因故障而终止。
    容器要么以非零状态退出，要么被系统终止。
  - `Unknown`：由于某种原因无法获取 Pod 的状态，通常是由于与 Pod 的主机通信时出错。

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

   一条人类可读的消息，标示有关 Pod 为何处于这种情况的详细信息。

- **reason** (string)

   一条简短的驼峰式命名的消息，指示有关 Pod 为何处于此状态的详细信息。例如 'Evicted'。

- **podIP** （string）

   分配给 Pod 的 podIP 地址。至少在集群内可路由。如果尚未分配则为空。

<!--
- **podIPs** ([]PodIP)

  *Patch strategy: merge on key `ip`*
  
  podIPs holds the IP addresses allocated to the pod. If this field is specified, the 0th entry must match the podIP field. Pods may be allocated at most 1 value for each of IPv4 and IPv6. This list is empty if no IPs have been allocated yet.

  <a name="PodIP"></a>
  *PodIP represents a single IP address allocated to the pod.*
-->
- **podIPs** （[]PodIP）

  **补丁策略：基于 `ip` 键合并**
  
  podIPs 保存分配给 Pod 的 IP 地址。如果指定了该字段，则第 0 个条目必须与 podIP 字段值匹配。
  Pod 最多可以为 IPv4 和 IPv6 各分配 1 个值。如果尚未分配 IP，则此列表为空。

  <a name="PodIP"></a>
  **podIP 表示分配给 Pod 的单个 IP 地址。**

  <!--
  - **podIPs.ip** (string)

    IP is the IP address assigned to the pod
  -->

  - **podIP.ip** （string）

    ip 是分配给 Pod 的 IP 地址。

<!--
- **conditions** ([]PodCondition)

  *Patch strategy: merge on key `type`*
  
  Current service state of pod. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  <a name="PodCondition"></a>
  *PodCondition contains details for the current condition of this pod.*
-->
- **conditions** ([]PodCondition)

   **补丁策略：基于 `ip` 键合并**
  
   Pod 的当前服务状态。更多信息：
   https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  <a name="PodCondition"></a>
   **PodCondition 包含此 Pod 当前状况的详细信息。**

  <!--
  - **conditions.status** (string), required

    Status is the status of the condition. Can be True, False, Unknown. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  - **conditions.type** (string), required

    Type is the type of the condition. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions
  -->
   - **conditions.status** (string)，必需

    status 是 condition 的状态。可以是 `True`、`False`、`Unknown` 之一。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  - **conditions.type** (string)，必需

    type 是 condition 的类型。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  <!--
  - **conditions.lastProbeTime** (Time)

    Last time we probed the condition.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastProbeTime** (Time)

    上次探测 Pod 状况的时间。

    Time 是 `time.Time` 的包装器，支持正确编组为 YAML 和 JSON。
    time 包所提供的许多工厂方法都有包装器。

  <!--
  - **conditions.lastTransitionTime** (Time)

    Last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastTransitionTime** (Time)

    上次 Pod 状况从一种状态变为另一种状态的时间。

    Time 是 `time.Time` 的包装器，支持正确编组为 YAML 和 JSON。
    time 包所提供的许多工厂方法都有包装器。

  <!--
  - **conditions.message** (string)

    Human-readable message indicating details about last transition.

  - **conditions.reason** (string)

    Unique, one-word, CamelCase reason for the condition's last transition.
  -->

  - **conditions.message** (string)

    标示有关上次状况变化的详细信息的、人类可读的消息。

  - **conditions.reason** (string)

    condition 最近一次变化的唯一、一个单词、驼峰式命名原因。

<!--
- **qosClass** (string)

  The Quality of Service (QOS) classification assigned to the pod based on resource requirements See PodQOSClass type for available QOS classes More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes
-->
- **qosClass** （string）

   根据资源要求分配给 Pod 的服务质量 (QOS) 分类。有关可用的 QOS 类，请参阅 PodQOSClass 类型。
   更多信息： https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes

<!--
- **initContainerStatuses** ([]ContainerStatus)

  The list has one entry per init container in the manifest. The most recent successful init container will have ready = true, the most recently started container will have startTime set. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

  <a name="ContainerStatus"></a>
  *ContainerStatus contains details for the current status of this container.*
-->

- **initContainerStatuses** （[]ContainerStatus）

  该列表在清单中的每个 Init 容器中都有一个条目。最近成功的 Init 容器会将 ready 设置为 true，
  最近启动的容器将设置 startTime。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

  **ContainerStatus 包含此容器当前状态的详细信息。**

<!--
- **containerStatuses** ([]ContainerStatus)

  The list has one entry per container in the manifest. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

  <a name="ContainerStatus"></a>
  *ContainerStatus contains details for the current status of this container.*
-->
- **containerStatuses** （[]ContainerStatus）

  清单中的每个容器状态在该列表中都有一个条目。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

  **ContainerStatus 包含此容器当前状态的详细信息。**
    
<!--
- **ephemeralContainerStatuses** ([]ContainerStatus)

  Status for any ephemeral containers that have run in this pod.

  <a name="ContainerStatus"></a>
  *ContainerStatus contains details for the current status of this container.*
-->
- **ephemeralContainerStatuses** （[]ContainerStatus）

  已在此 Pod 中运行的任何临时容器的状态。

  <a name="ContainerStatus"></a>
  **ContainerStatus 包含此容器当前状态的详细信息。**

<!--
- **resourceClaimStatuses** ([]PodResourceClaimStatus)

  *Patch strategies: retainKeys, merge on key `name`*
  
  *Map: unique values on key name will be kept during a merge*
  
  Status of resource claims.
-->
- **resourceClaimStatuses** ([]PodResourceClaimStatus)

  **补丁策略：retainKeys，基于键 `name` 合并**

  **映射：键 `name` 的唯一值将在合并过程中保留**

  资源申领的状态。

  <!--
  <a name="PodResourceClaimStatus"></a>
  *PodResourceClaimStatus is stored in the PodStatus for each PodResourceClaim which references a ResourceClaimTemplate. It stores the generated name for the corresponding ResourceClaim.*
  -->

  <a name="PodResourceClaimStatus"></a>
  **对于每个引用 ResourceClaimTemplate 的 PodResourceClaim，PodResourceClaimStatus 被存储在
  PodStatus 中。它存储为对应 ResourceClaim 生成的名称。**

  <!--
  - **resourceClaimStatuses.name** (string), required

    Name uniquely identifies this resource claim inside the pod. This must match the name of an entry in pod.spec.resourceClaims, which implies that the string must be a DNS_LABEL.

  - **resourceClaimStatuses.resourceClaimName** (string)

    ResourceClaimName is the name of the ResourceClaim that was generated for the Pod in the namespace of the Pod. It this is unset, then generating a ResourceClaim was not necessary. The pod.spec.resourceClaims entry can be ignored in this case.
  -->

  - **resourceClaimStatuses.name** (string), required

    Name 在 Pod 中唯一地标识此资源申领。
    此名称必须与 pod.spec.resourceClaims 中的条目名称匹配，这意味着字符串必须是 DNS_LABEL。

  - **resourceClaimStatuses.resourceClaimName** (string)

    resourceClaimName 是为 Pod 在其名字空间中生成的 ResourceClaim 的名称。
    如果此项未被设置，则不需要生成 ResourceClaim。在这种情况下，可以忽略 pod.spec.resourceClaims 这个条目。

<!--
- **resize** (string)
 
  Status of resources resize desired for pod's containers. It is empty if no resources resize is pending. Any changes to container resources will automatically set this to "Proposed"
-->
- **resize** (string)

  Pod 容器所需的资源大小调整状态。如果没有待处理的资源调整大小，则它为空。
  对容器资源的任何更改都会自动将其设置为"建议"值。

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

  apiVersion 定义对象表示的版本化模式。服务器应将已识别的模式转换为最新的内部值，
  并可能拒绝无法识别的值。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

<!--
- **kind** (string)

  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
- **kind**（string）

  kind 是一个字符串值，表示此对象表示的 REST 资源。服务器可以从客户端提交请求的端点推断出资源类别。
  无法更新。采用驼峰式命名。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
- **metadata** （<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>）

  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified Pod
-->
### `get` 读取指定的 Pod

<!--
#### HTTP Request
-->
#### HTTP 请求

GET /api/v1/namespaces/{namespace}/pods/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (**路径参数**): string，必需

  Pod 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

<!--
### `get` read ephemeralcontainers of the specified Pod
-->
### `get` 读取指定 Pod 的 ephemeralcontainers

<!--
#### HTTP Request
-->
#### HTTP 请求

GET /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (**路径参数**): string，必需

  Pod 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

<!--
### `get` read log of the specified Pod
-->

### `get` 读取指定 Pod 的日志

<!--
#### HTTP Request
-->
#### HTTP 请求

GET /api/v1/namespaces/{namespace}/pods/{name}/log

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Pod


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **container** (*in query*): string

  The container for which to stream logs. Defaults to only container if there is one container in the pod.
-->
- **name** (**路径参数**): string，必需

  Pod 的名称。

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **container** (**查询参数**): string

  为其流式传输日志的容器。如果 Pod 中有一个容器，则默认为仅容器。

<!--
- **follow** (*in query*): boolean

  Follow the log stream of the pod. Defaults to false.


- **insecureSkipTLSVerifyBackend** (*in query*): boolean

  insecureSkipTLSVerifyBackend indicates that the apiserver should not confirm the validity of the serving certificate of the backend it is connecting to.  This will make the HTTPS connection between the apiserver and the backend insecure. This means the apiserver cannot verify the log data it is receiving came from the real kubelet.  If the kubelet is configured to verify the apiserver's TLS credentials, it does not mean the connection to the real kubelet is vulnerable to a man in the middle attack (e.g. an attacker could not intercept the actual log data coming from the real kubelet).
-->
- **follow** (**查询参数**)：boolean

  跟踪 Pod 的日志流。默认为 false。

- **insecureSkipTLSVerifyBackend** (**查询参数**)：boolean

  `insecureSkipTLSVerifyBackend` 表示 API 服务器不应确认它所连接的后端的服务证书的有效性。
  这将使 API 服务器和后端之间的 HTTPS 连接不安全。
  这意味着 API 服务器无法验证它接收到的日志数据是否来自真正的 kubelet。
  如果 kubelet 配置为验证 API 服务器的 TLS 凭据，这并不意味着与真实 kubelet
  的连接容易受到中间人攻击（例如，攻击者无法拦截来自真实 kubelet 的实际日志数据）。

<!--
- **limitBytes** (*in query*): integer

  If set, the number of bytes to read from the server before terminating the log output. This may not display a complete final line of logging, and may return slightly more or slightly less than the specified limit.


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **limitBytes** (**查询参数**): integer

  如果设置，则表示在终止日志输出之前从服务器读取的字节数。
  设置此参数可能导致无法显示完整的最后一行日志记录，并且可能返回略多于或略小于指定限制。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **previous** (*in query*): boolean

  Return previous terminated container logs. Defaults to false.

- **sinceSeconds** (*in query*): integer

  A relative time in seconds before the current time from which to show logs. If this value precedes the time a pod was started, only logs since the pod start will be returned. If this value is in the future, no logs will be returned. Only one of sinceSeconds or sinceTime may be specified.
-->
- **previous** (**查询参数**)：boolean

  返回之前终止了的容器的日志。默认为 false。

- **sinceSeconds** (**查询参数**): integer

  显示日志的当前时间之前的相对时间（以秒为单位）。如果此值早于 Pod 启动时间，
  则仅返回自 Pod 启动以来的日志。如果此值是将来的值，则不会返回任何日志。
  只能指定 `sinceSeconds` 或 `sinceTime` 之一。

<!--
- **tailLines** (*in query*): integer

  If set, the number of lines from the end of the logs to show. If not specified, logs are shown from the creation of the container or sinceSeconds or sinceTime

- **timestamps** (*in query*): boolean

  If true, add an RFC3339 or RFC3339Nano timestamp at the beginning of every line of log output. Defaults to false.
-->
- **tailLines** (**查询参数**): integer

  如果设置，则从日志末尾开始显示的行数。如果未指定，则从容器创建或 `sinceSeconds` 或
  `sinceTime` 时刻显示日志。

- **timestamps** (**查询参数**)：boolean

  如果为 true，则在每行日志输出的开头添加 RFC3339 或 RFC3339Nano 时间戳。默认为 false。

<!--
#### Response
-->
#### 响应

200 (string): OK

401: Unauthorized

<!--
### `get` read status of the specified Pod
-->
### `get` 读取指定 Pod 的状态

<!--
#### HTTP Request
-->
#### HTTP 请求

GET /api/v1/namespaces/{namespace}/pods/{name}/status

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **name** (**路径参数**): string，必需

  Pod 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Pod
-->
### `list` 列出或观察 Pod 种类的对象

<!--
#### HTTP Request
-->
#### HTTP 请求

GET /api/v1/namespaces/{namespace}/pods

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查询参数**): string

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
- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应


200 (<a href="{{< ref "../workload-resources/pod-v1#PodList" >}}">PodList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Pod
-->
### `list` 列出或观察 Pod 种类的对象

<!--
#### HTTP Request
-->
#### HTTP 请求

GET /api/v1/pods

<!--
#### Parameters
-->
#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **allowWatchBookmarks** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

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

- **timeoutSeconds** (**查询参数**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-v1#PodList" >}}">PodList</a>): OK

401: Unauthorized

<!--
### `create` create a Pod
-->
### `create` 创建一个 Pod
<!--
#### HTTP Request
-->
#### HTTP 请求

POST /api/v1/namespaces/{namespace}/pods

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>，必需

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

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

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

202 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified Pod
-->
### `update` 替换指定的 Pod

<!--
#### HTTP Request
-->
#### HTTP 请求

PUT /api/v1/namespaces/{namespace}/pods/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, required
-->
- **name** (**路径参数**): string，必需

  Pod 的名称。

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>，必需

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
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

<!--
### `update` replace ephemeralcontainers of the specified Pod
-->
### `update` 替换指定 Pod 的 ephemeralcontainers

<!--
#### HTTP Request
-->
#### HTTP 请求

PUT /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, required
-->
- **name** (**路径参数**): string，必需

  Pod 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>，必需

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
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified Pod
-->
### `update` 替换指定 Pod 的状态

<!--
#### HTTP Request
-->
#### HTTP 请求

PUT /api/v1/namespaces/{namespace}/pods/{name}/status

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>, required
-->
- **name** (**路径参数**): string，必需

  Pod 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>，必需

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
-->
#### 响应

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
#### HTTP 请求

PATCH /api/v1/namespaces/{namespace}/pods/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **name** (**路径参数**): string，必需

  Pod 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

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

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

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
#### HTTP 请求

PATCH /api/v1/namespaces/{namespace}/pods/{name}/ephemeralcontainers

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **name** (**路径参数**): string，必需

  Pod 的名称。

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

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

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified Pod
-->
### `patch` 部分更新指定 Pod 的状态

<!--
#### HTTP Request
-->
#### HTTP 请求

PATCH /api/v1/namespaces/{namespace}/pods/{name}/status

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **name** (**路径参数**): string，必需

  Pod 的名称。

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

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

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

201 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Created

401: Unauthorized

<!--
### `delete` delete a Pod
-->
### `delete` 删除一个 Pod

<!--
#### HTTP Request
-->
#### HTTP 请求

DELETE /api/v1/namespaces/{namespace}/pods/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the Pod

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **name** (**路径参数**): string，必需

  Pod 的名称。

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

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
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): OK

202 (<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>): Accepted

401: Unauthorize

<!--
### `deletecollection` delete collection of Pod
-->
### `deletecollection` 删除 Pod 的集合

<!--
#### HTTP Request
-->
#### HTTP 请求

DELETE /api/v1/namespaces/{namespace}/pods

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

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
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

