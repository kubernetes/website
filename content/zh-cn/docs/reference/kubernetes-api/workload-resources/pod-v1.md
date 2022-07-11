---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Pod"
content_type: "api_reference"
description: "Pod 是可以在主机上运行的容器的集合。"
title: "Pod"
weight: 1
auto_generated: true
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

  标准的对象元数据。
  更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
  Specification of the desired behavior of the pod. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **spec** (<a href="{{< ref "../workload-resources/pod-v1#PodSpec" >}}">PodSpec</a>)

  Pod 所需行为的规范。
  更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
  Most recently observed status of the pod. This data may not be up to date. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
- **status** (<a href="{{< ref "../workload-resources/pod-v1#PodStatus" >}}">PodStatus</a>)

  
  最近观察到的 Pod 状态。这些数据可能不是最新的。由系统填充。只读。
  更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## PodSpec {#PodSpec}

<!--
PodSpec is a description of a pod.
-->
PodSpec 是对 Pod 的描述。

<hr>

### Containers

<!--
- **containers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>), required

  *Patch strategy: merge on key `name`*
  
  List of containers belonging to the pod. Containers cannot currently be added or removed. There must be at least one container in a Pod. Cannot be updated.
-->
- **containers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>)，必需

  *补丁策略：根据键 `name` 上合并*
  
  属于 Pod 的容器列表。当前无法添加或删除容器。
  Pod 中必须至少有一个容器。无法更新。
<!--
  *Patch strategy: merge on key `name`*
  
  List of initialization containers belonging to the pod. Init containers are executed in order prior to containers being started. If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy. The name for an init container or normal container must be unique among all containers. Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes. The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit for each resource type, and then using the max of of that value or the sum of the normal containers. Limits are applied to init containers in a similar fashion. Init containers cannot currently be added or removed. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/
-->
- **initContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#Container" >}}">Container</a>)

  *补丁策略：根据键 `name` 上合并*

  属于 Pod 的初始化容器列表。
  初始化容器在容器启动之前按顺序执行。
  如果任何一个初始化容器发生故障，则认为该 Pod 发生故障，并根据其 restartPolicy 进行处理。
  初始化容器或普通容器的名称在所有容器中必须是唯一的。
  初始化容器可能没有生命周期操作、Readiness 探针、Liveness 探针或 Startup 探针。
  在调度过程中会考虑初始化容器的资源需求，方法是查找每种资源类型的最高请求/限制，然后使用该值的最大值或正常容器的总和。
  限制以类似的方式应用于初始化容器。
  当前无法添加或删除初始化容器。无法更新。更多信息：https://kubernetes.io/docs/concepts/workloads/pods/init-containers/

<!--
  *Patch strategy: merge on key `name`*
  
  ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec. If specified, these secrets will be passed to individual puller implementations for them to use. More info: https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod
-->
- **imagePullSecrets** ([]<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

  *补丁策略：根据键 `name` 上合并*

  ImagePullSecrets 是对同一命名空间中秘密的可选引用列表，用于拉取此 PodSpec 使用的任何镜像。
  如果指定，这些秘密将被传递给各个 puller 实现供他们使用。更多信息：https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod

<!--
- **enableServiceLinks** (boolean)

  EnableServiceLinks indicates whether information about services should be injected into pod's environment variables, matching the syntax of Docker links. Optional: Defaults to true.
-->
- **enableServiceLinks**（boolean）

  EnableServiceLinks 指示是否应将有关服务的信息注入到 Pod 的环境变量中，与 Docker 链接的语法相匹配。可选：默认为 true。

  <!--
  - **os** (PodOS)

  Specifies the OS of the containers in the pod. Some pod and container fields are restricted if this is set.
  
  If the OS field is set to linux, the following fields must be unset: -securityContext.windowsOptions
  -->

- **os**（PodOS）

  指定 Pod 中容器的操作系统。如果设置了此项，则某些 Pod 和容器字段会受到限制。
  
  如果 OS 字段设置为 Linux，则必须取消设置以下字段： -securityContext.windowsOptions
<!--
  If the OS field is set to windows, following fields must be unset: - spec.hostPID - spec.hostIPC - spec.securityContext.seLinuxOptions - spec.securityContext.seccompProfile - spec.securityContext.fsGroup - spec.securityContext.fsGroupChangePolicy - spec.securityContext.sysctls - spec.shareProcessNamespace - spec.securityContext.runAsUser - spec.securityContext.runAsGroup - spec.securityContext.supplementalGroups - spec.containers[*].securityContext.seLinuxOptions - spec.containers[*].securityContext.seccompProfile - spec.containers[*].securityContext.capabilities - spec.containers[*].securityContext.readOnlyRootFilesystem - spec.containers[*].securityContext.privileged - spec.containers[*].securityContext.allowPrivilegeEscalation - spec.containers[*].securityContext.procMount - spec.containers[*].securityContext.runAsUser - spec.containers[*].securityContext.runAsGroup This is a beta field and requires the IdentifyPodOS feature

  <a name="PodOS"></a>
  *PodOS defines the OS parameters of a pod.*
-->
  如果 OS 字段设置为 windows，则必须取消设置以下字段：
  - spec.hostPID - spec.hostIPC - spec.securityContext.seLinuxOptions - spec.securityContext.seccompProfile - spec.securityContext.fsGroup - spec.securityContext.fsGroupChangePolicy - spec.securityContext.sysctls - spec.shareProcessNamespace - spec.securityContext.runAsUser - spec.securityContext.runAsGroup - spec.securityContext.supplementalGroups - spec.containers[*].securityContext.seLinuxOptions - spec.containers[*].securityContext.seccompProfile - spec.containers[*].securityContext.capabilities - spec.containers[*].securityContext.readOnlyRootFilesystem - spec.containers[*].securityContext.privileged - spec.containers[*].securityContext.allowPrivilegeEscalation - spec.containers[*].securityContext.procMount - spec.containers[*].securityContext.runAsUser - spec.containers[*].securityContext.runAsGroup This is a beta field and requires the IdentifyPodOS feature
  
  <a name="PodOS"></a>
  *PodOS 定义了一个 Pod 的操作系统参数。*

<!--
    Name is the name of the operating system. The currently supported values are linux and windows. Additional value may be defined in future and can be one of: https://github.com/opencontainers/runtime-spec/blob/master/config.md#platform-specific-configuration Clients should expect to handle additional values and treat unrecognized values in this field as os: null
-->
- **os.name**（string），必填

    Name 是操作系统的名称。当前支持的值是 Linux 和 Windows。
    将来可能会定义附加值，并且可以是以下之一： https://github.com/opencontainers/runtime-spec/blob/master/config.md#platform-specific-configuration 客户应该期望处理附加值并处理无法识别的此字段中的值为 os: null

### Volumes

<!--
- **volumes** ([]<a href="{{< ref "../config-and-storage-resources/volume#Volume" >}}">Volume</a>)

  *Patch strategies: retainKeys, merge on key `name`*
  
  List of volumes that can be mounted by containers belonging to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes
-->
- **volumes** ([]<a href="{{< ref "../config-and-storage-resources/volume#Volume" >}}">Volume</a>)

  *补丁策略：retainKeys，根据键 `name`上合并*
  
  可以由属于 Pod 的容器挂载的卷列表。更多信息：https://kubernetes.io/docs/concepts/storage/volumes


### Scheduling

<!--
- **nodeSelector** (map[string]string)

  NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node's labels for the pod to be scheduled on that node. More info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
-->
- **nodeSelector** (map[string]string)

  NodeSelector 是一个选择器，它必须为真才能使 Pod 适合节点。
  选择器必须与节点的标签匹配，以便在该节点上调度 Pod。更多信息：https://kubernetes.io/docs/concepts/configuration/assign-pod-node/

<!--
- **nodeName** (string)

  NodeName is a request to schedule this pod onto a specific node. If it is non-empty, the scheduler simply schedules this pod onto that node, assuming that it fits resource requirements.
-->
- **nodeName**（string）

  NodeName 是将此 Pod 调度到特定节点的请求。如果它不是空的，调度程序只是将这个 Pod 调度到那个节点上，假设它符合资源要求。

<!--
- **affinity** (Affinity)

  If specified, the pod's scheduling constraints

  <a name="Affinity"></a>
  *Affinity is a group of affinity scheduling rules.*
-->
- **affinity** (Affinity)

  如果指定，则 Pod 的调度约束

  <a name="Affinity"></a>
  *Affinity 是一组亲和性调度规则。*

  - **affinity.nodeAffinity** (<a href="{{< ref "../workload-resources/pod-v1#NodeAffinity" >}}">NodeAffinity</a>)
<!--
    Describes node affinity scheduling rules for the pod.
-->
    描述 Pod 的节点亲和性调度规则。

  - **affinity.podAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAffinity" >}}">PodAffinity</a>)
<!--
    Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).
-->
    描述 Pod 亲和性调度规则（例如，将此 Pod 与其他一些 Pod 放在同一节点、区域等中）。

  - **affinity.podAntiAffinity** (<a href="{{< ref "../workload-resources/pod-v1#PodAntiAffinity" >}}">PodAntiAffinity</a>)
<!--
    Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).
--> 
    描述 Pod 反关联调度规则（例如，避免将此 Pod 与其他一些 Pod 放在相同的节点、区域等）。

<!--
- **tolerations** ([]Toleration)

  If specified, the pod's tolerations.

  <a name="Toleration"></a>
  *The pod this Toleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.*
-->
- **tolerations** ([]Toleration)

  如果指定，则为 Pod 的容忍度。

  <a name="Toleration"></a>
  *这个 Toleration 附加到的 Pod 允许使用匹配运算符 <operator> 匹配三元组 <key,value,effect> 的任何 taint。*

<!--
  - **tolerations.key** (string)

    Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys.
-->

- **tolerations.key**（string）

    Key 是应用容忍的污点键。空意味着匹配所有的污点键。如果 key 为空，则 Operator 必须为 Exists；这种组合意味着匹配所有值和所有键。
    
<!--
  - **tolerations.operator** (string)

    Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a pod can tolerate all taints of a particular category.
-->

- **tolerations.operator**（string）

    Operator 表示键与值的关系。有效的运算符是 Exists 和 Equal。默认为相等。 Exists 相当于通配符的值，因此 pod 可以容忍特定类别的所有污点。

<!--
  - **tolerations.value** (string)

    Value is the taint value the toleration matches to. If the operator is Exists, the value should be empty, otherwise just a regular string.
-->

- **tolerations.value**（string）

    Value 是容忍度匹配的污點值。如果運算符為 Exists，則該值應為空，否則只是一個常規字符串。

<!--
  - **tolerations.effect** (string)

    Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.
-->
- **tolerations.effect**（string）

    Effect 指示要匹配的污點效果。空意味著匹配所有污點效果。指定時，允許的值為 NoSchedule、PreferNoSchedule 和 NoExecute。

<!--
  - **tolerations.tolerationSeconds** (int64)

    TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system.
-->
- **tolerations.tolerationSeconds** (int64)

    TolerationSeconds 表示容忍（必須是有效的 NoExecute，否則該字段被忽略）容忍污點的時間段。默認情況下，它沒有設置，這意味著永遠容忍污點（不要驅逐）。系統會將零值和負值視為 0（立即驅逐）。

<!--
- **schedulerName** (string)

  If specified, the pod will be dispatched by specified scheduler. If not specified, the pod will be dispatched by default scheduler.
-->
- **schedulerName**（string）

  如果指定，則 Pod 將由指定的調度程序調度。如果未指定，則默認調度程序會分派 Pod。

<!--
- **runtimeClassName** (string)

  RuntimeClassName refers to a RuntimeClass object in the node.k8s.io group, which should be used to run this pod.  If no RuntimeClass resource matches the named class, the pod will not be run. If unset or empty, the "legacy" RuntimeClass will be used, which is an implicit class with an empty definition that uses the default runtime handler. More info: https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class
-->
- **runtimeClassName**（string）

  RuntimeClassName 是指 node.k8s.io 組中的一個 RuntimeClass 對象，應該使用它來運行這個 Pod。如果沒有 RuntimeClass 資源與命名類匹配，則 Pod 將不會運行。如果未設置或為空，將使用“舊版”RuntimeClass，這是一個具有空定義的隱式類，使用默認運行時處理程序。更多信息：https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class

<!--
- **priorityClassName** (string)

  If specified, indicates the pod's priority. "system-node-critical" and "system-cluster-critical" are two special keywords which indicate the highest priorities with the former being the highest priority. Any other name must be defined by creating a PriorityClass object with that name. If not specified, the pod priority will be default or zero if there is no default.
-->
- **priorityClassName**（string）

  如果指定，則指示 Pod 的優先級。 “system-node-critical” 和 “system-cluster-critical” 是兩個特殊關鍵字，表示最高優先級，前者為最高優先級。任何其他名稱都必須通過創建具有該名稱的 PriorityClass 對象來定義。如果未指定，則 Pod 優先級將為默認值，如果沒有默認值，則為零。

<!--
- **priority** (int32)

  The priority value. Various system components use this field to find the priority of the pod. When Priority Admission Controller is enabled, it prevents users from setting this field. The admission controller populates this field from PriorityClassName. The higher the value, the higher the priority.
-->
- **priority** (int32)

  Priority。各種系統組件使用該字段來查找 Pod 的優先級。
  當啟用優先准入控制器時，它會阻止用戶設置此字段。
  准入控制器從 PriorityClassName 填充此字段。值越高，優先級越高。

<!--
- **topologySpreadConstraints** ([]TopologySpreadConstraint)

  *Patch strategy: merge on key `topologyKey`*
  
  *Map: unique values on keys `topologyKey, whenUnsatisfiable` will be kept during a merge*
  
  TopologySpreadConstraints describes how a group of pods ought to spread across topology domains. Scheduler will schedule pods in a way which abides by the constraints. All topologySpreadConstraints are ANDed.

  <a name="TopologySpreadConstraint"></a>
  *TopologySpreadConstraint specifies how to spread matching pods among the given topology.*
-->
- **topologySpreadConstraints** ([]TopologySpreadConstraint)

  *补丁策略：根据键 `topologyKey`上合并*
  
  *地圖：鍵的唯一值 `topologyKey, whenUnsatisfiable` 將在合併期間保留*
  
  TopologySpreadConstraints 描述了一組 Pod 應該如何跨拓撲域分佈。調度程序將以遵守約束的方式調度 Pod。所有 topologySpreadConstraints 都是 ANDed。

  <a name="TopologySpreadConstraint"></a>
  *TopologySpreadConstraint 指定如何在給定的拓撲中傳播匹配的 pod。*

<!--
  - **topologySpreadConstraints.maxSkew** (int32), required

    MaxSkew describes the degree to which pods may be unevenly distributed. When `whenUnsatisfiable=DoNotSchedule`, it is the maximum permitted difference between the number of matching pods in the target topology and the global minimum. The global minimum is the minimum number of matching pods in an eligible domain or zero if the number of eligible domains is less than MinDomains. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 2/2/1: In this case, the global minimum is 1. | zone1 | zone2 | zone3 | |  P P  |  P P  |   P   | - if MaxSkew is 1, incoming pod can only be scheduled to zone3 to become 2/2/2; scheduling it onto zone1(zone2) would make the ActualSkew(3-1) on zone1(zone2) violate MaxSkew(1). - if MaxSkew is 2, incoming pod can be scheduled onto any zone. When `whenUnsatisfiable=ScheduleAnyway`, it is used to give higher precedence to topologies that satisfy it. It's a required field. Default value is 1 and 0 is not allowed.
-->
- **topologySpreadConstraints.maxSkew** (int32)，必需

    MaxSkew 描述了 pod 可能分布不均的程度。当 `whenUnsatisfiable=DoNotSchedule` 时，是目标拓扑中匹配的 Pod 数量与全局最小值之间的最大允许差值。
    全局最小值是合格域中匹配 Pod 的最小数量，如果合格域的数量小于 MinDomains，则为零。
    例如，在一个 3-zone 集群中，MaxSkew 设置为 1，具有相同 labelSelector 的 Pod 分布为 2/2/1：在这种情况下，全局最小值为 1。区域1 |区域2 |区域3 | | PP | PP | P | - 如果 MaxSkew 为 1，传入的 pod 只能调度到 zone3 变成 2/2/2；
    将其调度到 zone1(zone2) 将使 zone1(zone2) 上的 ActualSkew(3-1) 违反 MaxSkew(1)。 
    - 如果 MaxSkew 为 2，则可以将传入的 Pod 调度到任何区域。
    当 `whenUnsatisfiable=ScheduleAnyway` 时，它被用来给满足它的拓扑更高的优先级。这是一个必填字段。默认值为 1，不允许为 0。

<!--
  - **topologySpreadConstraints.topologyKey** (string), required

    TopologyKey is the key of node labels. Nodes that have a label with this key and identical values are considered to be in the same topology. We consider each \<key, value> as a "bucket", and try to put balanced number of pods into each bucket. We define a domain as a particular instance of a topology. Also, we define an eligible domain as a domain whose nodes match the node selector. e.g. If TopologyKey is "kubernetes.io/hostname", each Node is a domain of that topology. And, if TopologyKey is "topology.kubernetes.io/zone", each zone is a domain of that topology. It's a required field.
-->
- **topologySpreadConstraints.topologyKey**（字符串），必需

    TopologyKey 是节点标签的键。具有带有此键的标签和相同值的节点被认为在相同的拓扑中。我们将每个 \<key, value> 视为一个 "bucket"，并尝试将平衡数量的 pod 放入每个桶中。我们将域定义为拓扑的特定实例。此外，我们将合格域定义为其节点与节点选择器匹配的域。例如如果 TopologyKey 是“kubernetes.io/hostname”，则每个节点都是该拓扑的域。而且，如果 TopologyKey 是“topology.kubernetes.io/zone”，则每个区域都是该拓扑的一个域。这是一个必填字段。

<!--
  - **topologySpreadConstraints.whenUnsatisfiable** (string), required

    WhenUnsatisfiable indicates how to deal with a pod if it doesn't satisfy the spread constraint. - DoNotSchedule (default) tells the scheduler not to schedule it. - ScheduleAnyway tells the scheduler to schedule the pod in any location,
      but giving higher precedence to topologies that would help reduce the
      skew.
    A constraint is considered "Unsatisfiable" for an incoming pod if and only if every possible node assignment for that pod would violate "MaxSkew" on some topology. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 3/1/1: | zone1 | zone2 | zone3 | | P P P |   P   |   P   | If WhenUnsatisfiable is set to DoNotSchedule, incoming pod can only be scheduled to zone2(zone3) to become 3/2/1(3/1/2) as ActualSkew(2-1) on zone2(zone3) satisfies MaxSkew(1). In other words, the cluster can still be imbalanced, but scheduler won't make it *more* imbalanced. It's a required field.
-->
- **topologySpreadConstraints.whenUnsatisfiable**（字符串），必需

    WhenUnsatisfiable 表示如果 Pod 不满足传播约束，如何处理它。 - DoNotSchedule（默认）告诉调度器不要调度它。 - ScheduleAnyway 告诉调度程序将 pod 安排在任何位置，
      但给予拓扑更高的优先级，这将有助于减少
      偏斜。
    当且仅当该 pod 的每个可能的节点分配都会违反某些拓扑上的“MaxSkew”时，才认为传入 pod 的约束是“不可满足的”。例如，在 3-zone 集群中，MaxSkew 设置为 1，具有相同 labelSelector 的 pod 分布为 3/1/1： |区域1 |区域2 |区域3 | | P P P |磷 |磷 |如果 WhenUnsatisfiable 设置为 DoNotSchedule，则传入的 pod 只能调度到 zone2(zone3) 成为 3/2/1(3/1/2)，因为 zone2(zone3) 上的 ActualSkew(2-1) 满足 MaxSkew(1)。换句话说，集群仍然可以不平衡，但调度程序不会使其*更多*不平衡。这是一个必填字段。

<!--
  - **topologySpreadConstraints.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    LabelSelector is used to find matching pods. Pods that match this label selector are counted to determine the number of pods in their corresponding topology domain.
-->
- **topologySpreadConstraints.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    LabelSelector 用于查找匹配的 Pod。对匹配此标签选择器的 Pod 进行计数，以确定其相应拓扑域中的 Pod 数量。

<!--
  - **topologySpreadConstraints.minDomains** (int32)

    MinDomains indicates a minimum number of eligible domains. When the number of eligible domains with matching topology keys is less than minDomains, Pod Topology Spread treats "global minimum" as 0, and then the calculation of Skew is performed. And when the number of eligible domains with matching topology keys equals or greater than minDomains, this value has no effect on scheduling. As a result, when the number of eligible domains is less than minDomains, scheduler won't schedule more than maxSkew Pods to those domains. If value is nil, the constraint behaves as if MinDomains is equal to 1. Valid values are integers greater than 0. When value is not nil, WhenUnsatisfiable must be DoNotSchedule.
    
    For example, in a 3-zone cluster, MaxSkew is set to 2, MinDomains is set to 5 and pods with the same labelSelector spread as 2/2/2: | zone1 | zone2 | zone3 | |  P P  |  P P  |  P P  | The number of domains is less than 5(MinDomains), so "global minimum" is treated as 0. In this situation, new pod with the same labelSelector cannot be scheduled, because computed skew will be 3(3 - 0) if new Pod is scheduled to any of the three zones, it will violate MaxSkew.
    
    This is an alpha field and requires enabling MinDomainsInPodTopologySpread feature gate.
-->
- **topologySpreadConstraints.minDomains** (int32)

    MinDomains 表示符合条件的域的最小数量。当符合拓扑键的符合条件的域个数小于 minDomains 时，Pod Topology Spread 将“全局最小值”视为 0，然后进行 Skew 的计算。并且当匹配拓扑键的合格域的数量等于或大于 minDomains 时，该值对调度没有影响。因此，当合格域的数量少于 minDomains 时，调度程序不会将超过 maxSkew Pods 调度到这些域。如果 value 为 nil，则约束表现为 MinDomains 等于 1。有效值为大于 0 的整数。当 value 不为 nil 时，WhenUnsatisfiable 必须为 DoNotSchedule。
    
    例如，在 3-zone 集群中，MaxSkew 设置为 2，MinDomains 设置为 5，具有相同 labelSelector 的 Pod 分布为 2/2/2： |区域 1 |区域 2 |区域 3 | | PP | PP | PP |域的数量小于 5(MinDomains)，因此“全局最小值”被视为 0。在这种情况下，无法调度具有相同 labelSelector 的新 Pod，因为如果新 Pod 计算的 skew 将为 3(3 - 0)被安排到三个区域中的任何一个，都会违反 MaxSkew。
    
    这是一个 alpha 字段，需要启用 MinDomainsInPodTopologySpread 功能门。

<!--
### Lifecycle
-->
### Lifecycle

<!--
- **restartPolicy** (string)

  Restart policy for all containers within the pod. One of Always, OnFailure, Never. Default to Always. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy
-->
- **restartPolicy**（string）

  pod 内所有容器的重启策略。Always、OnFailure、Never。默认为 Always。更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy

<!--
- **terminationGracePeriodSeconds** (int64)

  Optional duration in seconds the pod needs to terminate gracefully. May be decreased in delete request. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). If this value is nil, the default grace period will be used instead. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. Defaults to 30 seconds.
-->
- **terminationGracePeriodSeconds** (int64)

  Pod 需要优雅终止的可选持续时间（以秒为单位）。可以在删除请求中减少。值必须是非负整数。零值表示通过终止信号立即停止（没有机会关闭）。如果此值为 nil，则将使用默认宽限期。宽限期是 pod 中运行的进程收到终止信号后的持续时间（以秒为单位），以及进程被终止信号强制停止的时间。将此值设置为比您的进程的预期清理时间更长。默认为 30 秒。

<!--
- **activeDeadlineSeconds** (int64)

  Optional duration in seconds the pod may be active on the node relative to StartTime before the system will actively try to mark it failed and kill associated containers. Value must be a positive integer.
-->
- **activeDeadlineSeconds** (int64)

  在系统将主动尝试将其标记为失败并终止相关容器之前，Pod 可能在节点上相对于 StartTime 处于活动状态的可选持续时间（以秒为单位）。值必须是正整数。

<!--
- **readinessGates** ([]PodReadinessGate)

  If specified, all readiness gates will be evaluated for pod readiness. A pod is ready when all its containers are ready AND all conditions specified in the readiness gates have status equal to "True" More info: https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates

  <a name="PodReadinessGate"></a>
  *PodReadinessGate contains the reference to a pod condition*
-->
- **readinessGate** ([]PodReadinessGate)

  如果指定，将评估所有就绪门的 Pod 就绪情况。当所有容器都准备好并且准备就绪门中指定的所有条件都具有等于 “True” 的状态时，Pod 就准备好了更多信息：https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates

  <a name="PodReadinessGate"></a>
  *PodReadinessGate 包含对 pod 条件的引用*
<!--
  - **readinessGates.conditionType** (string), required

    ConditionType refers to a condition in the pod's condition list with matching type.
-->
- **readinessGates.conditionType**（string），必填

    ConditionType 是指 Pod 的条件列表中匹配类型的条件。

<!--
### Hostname and Name resolution
-->
### Hostname and Name resolution

<!--
- **hostname** (string)

  Specifies the hostname of the Pod If not specified, the pod's hostname will be set to a system-defined value.
-->
- **hostname** （string）

  指定 Pod 的主机名 如果未指定，则 Pod 的主机名将设置为系统定义的值。

<!--
- **setHostnameAsFQDN** (boolean)

  If true the pod's hostname will be configured as the pod's FQDN, rather than the leaf name (the default). In Linux containers, this means setting the FQDN in the hostname field of the kernel (the nodename field of struct utsname). In Windows containers, this means setting the registry value of hostname for the registry key HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters to FQDN. If a pod does not have FQDN, this has no effect. Default to false.
-->
- **setHostnameAsFQDN**（boolean）

  如果为 true，则 Pod 的主机名将配置为 Pod 的 FQDN，而不是叶名称（默认值）。在 Linux 容器中，这意味着在内核的主机名字段（struct utsname 的节点名字段）中设置 FQDN。在 Windows 容器中，这意味着将注册表项  HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters 的主机名的注册表值设置为 FQDN。如果 Pod 没有 FQDN，则这不起作用。默认为 false。

<!--
- **subdomain** (string)

  If specified, the fully qualified Pod hostname will be "\<hostname>.\<subdomain>.\<pod namespace>.svc.\<cluster domain>". If not specified, the pod will not have a domainname at all.
-->
- **subdomain**（string）

  如果指定，则完全限定的 Pod 主机名将是“\<hostname>.\<subdomain>.\<pod namespace>.svc.\<cluster domain>”。如果未指定，则该 Pod 将根本没有域名。

<!--
- **hostAliases** ([]HostAlias)

  *Patch strategy: merge on key `ip`*
  
  HostAliases is an optional list of hosts and IPs that will be injected into the pod's hosts file if specified. This is only valid for non-hostNetwork pods.

  <a name="HostAlias"></a>
  *HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.*

  - **hostAliases.hostnames** ([]string)

    Hostnames for the above IP address.

  - **hostAliases.ip** (string)

    IP address of the host file entry.

-->
- **hostAliases** ([]HostAlias)

  *补丁策略：在键 `ip` 上合并*
  
  HostAliases 是一个可选的主机和 IP 列表，如果指定，它们将被注入到 Pod 的 hosts 文件中。这仅对非 hostNetwork Pod 有效。

  <a name="HostAlias"></a>
  *HostAlias 保存 IP 和主机名之间的映射，这些映射将作为 Pod 的 hosts 文件中的条目注入。*

  - **hostAliases.hostnames** ([]string)

    上述 IP 地址的主机名。

  - **hostAliases.ip**（string）

    主机文件条目的 IP 地址。

<!--
- **dnsConfig** (PodDNSConfig)

  Specifies the DNS parameters of a pod. Parameters specified here will be merged to the generated DNS configuration based on DNSPolicy.

  <a name="PodDNSConfig"></a>
  *PodDNSConfig defines the DNS parameters of a pod in addition to those generated from DNSPolicy.*
-->
- **dnsConfig** (PodDNSConfig)

  指定 Pod 的 DNS 参数。此处指定的参数将合并到基于 DNSPolicy 生成的 DNS 配置中。

  <a name="PodDNSConfig"></a>
  *PodDNSConfig 定义了 Pod 的 DNS 参数以及从 DNSPolicy 生成的参数。*

<!--
  - **dnsConfig.nameservers** ([]string)

    A list of DNS name server IP addresses. This will be appended to the base nameservers generated from DNSPolicy. Duplicated nameservers will be removed.
-->
  - **dnsConfig.nameservers** ([]string)

    DNS 名称服务器 IP 地址列表。这将附加到从 DNSPolicy 生成的基本名称服务器中。重复的名称服务器将被删除。

<!--
  - **dnsConfig.options** ([]PodDNSConfigOption)

    A list of DNS resolver options. This will be merged with the base options generated from DNSPolicy. Duplicated entries will be removed. Resolution options given in Options will override those that appear in the base DNSPolicy.

    <a name="PodDNSConfigOption"></a>
    *PodDNSConfigOption defines DNS resolver options of a pod.*

    - **dnsConfig.options.name** (string)

      Required.

    - **dnsConfig.options.value** (string)
-->
- **dnsConfig.options** ([]PodDNSConfigOption)

    DNS 解析器选项列表。这将与从 DNSPolicy 生成的基本选项合并。重复的条目将被删除。 Options 中给出的解析选项将覆盖基本 DNSPolicy 中出现的那些。

    <a name="PodDNSConfigOption"></a>
    *PodDNSConfigOption 定义 pod 的 DNS 解析器选项。*

    - **dnsConfig.options.name**（string）

      必需的。

    - **dnsConfig.options.value**（string）

<!--
  - **dnsConfig.searches** ([]string)

    A list of DNS search domains for host-name lookup. This will be appended to the base search paths generated from DNSPolicy. Duplicated search paths will be removed.
-->
- **dnsConfig.searches** ([]string)

    用于主机名查找的 DNS 搜索域列表。这将附加到从 DNSPolicy 生成的基本搜索路径中。重复的搜索路径将被删除。

<!--
- **dnsPolicy** (string)

  Set DNS policy for the pod. Defaults to "ClusterFirst". Valid values are 'ClusterFirstWithHostNet', 'ClusterFirst', 'Default' or 'None'. DNS parameters given in DNSConfig will be merged with the policy selected with DNSPolicy. To have DNS options set along with hostNetwork, you have to specify DNS policy explicitly to 'ClusterFirstWithHostNet'.
-->
- **dnsPolicy**（string）

  为 pod 设置 DNS 策略。默认为“集群优先”。有效值为“ClusterFirstWithHostNet”、“ClusterFirst”、“Default”或“None”。 DNSConfig 中给出的 DNS 参数将与使用 DNSPolicy 选择的策略合并。要将 DNS 选项与 hostNetwork 一起设置，您必须将 DNS 策略明确指定为“ClusterFirstWithHostNet”。

<!--
### Hosts namespaces
-->
### Hosts namespaces

<!--
- **hostNetwork** (boolean)

  Host networking requested for this pod. Use the host's network namespace. If this option is set, the ports that will be used must be specified. Default to false.

- **hostPID** (boolean)

  Use the host's pid namespace. Optional: Default to false.

- **hostIPC** (boolean)

  Use the host's ipc namespace. Optional: Default to false.

- **shareProcessNamespace** (boolean)

  Share a single process namespace between all of the containers in a pod. When this is set containers will be able to view and signal processes from other containers in the same pod, and the first process in each container will not be assigned PID 1. HostPID and ShareProcessNamespace cannot both be set. Optional: Default to false.
-->
- **hostNetwork**（boolean）

  为此 Pod 请求的主机网络。使用主机的网络命名空间。如果设置了此选项，则必须指定将使用的端口。默认为 false。

- **hostPID**（boolean）

  使用主机的 pid 命名空间。可选：默认为 false。

- **hostIPC**（boolean）

  使用主机的 ipc 命名空间。可选：默认为 false。

- **shareProcessNamespace**（boolean）

  在 Pod 中的所有容器之间共享单个进程命名空间。设置后，容器将能够查看来自同一 Pod 中其他容器的进程并发出信号，并且每个容器中的第一个进程不会被分配 PID 1。HostPID 和 ShareProcessNamespace 不能同时设置。可选：默认为 false。

<!--
### Service account
-->
### Service account

<!--
- **serviceAccountName** (string)

  ServiceAccountName is the name of the ServiceAccount to use to run this pod. More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/

- **automountServiceAccountToken** (boolean)

  AutomountServiceAccountToken indicates whether a service account token should be automatically mounted.
-->
- **serviceAccountName**（string）

  ServiceAccountName 是用于运行此 Pod 的 ServiceAccount 的名称。更多信息：https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/

- **automountServiceAccountToken**（boolean）

  AutomountServiceAccountToken 指示是否应自动挂载服务帐户令牌。

<!--
### Security context
-->
### Security context

<!--
- **securityContext** (PodSecurityContext)

  SecurityContext holds pod-level security attributes and common container settings. Optional: Defaults to empty.  See type description for default values of each field.

  <a name="PodSecurityContext"></a>
  *PodSecurityContext holds pod-level security attributes and common container settings. Some fields are also present in container.securityContext.  Field values of container.securityContext take precedence over field values of PodSecurityContext.*
-->
- **securityContext** (PodSecurityContext)

  SecurityContext 包含 Pod 级别的安全属性和常见的容器设置。可选：默认为空。每个字段的默认值见类型描述。

  <a name="PodSecurityContext"></a>
  *PodSecurityContext 包含 Pod 级别的安全属性和常用容器设置。一些字段也存在于 container.securityContext 中。 container.securityContext 的字段值优先于 PodSecurityContext 的字段值。*

<!--
  - **securityContext.runAsUser** (int64)

    The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.
-->
  - **securityContext.runAsUser** (int64)

    运行容器进程入口点的 UID。如果未指定，则默认为镜像元数据中指定的用户。也可以在 SecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先于该容器。注意，spec.os.name 为 windows 时不能设置该字段。

<!--
  - **securityContext.runAsNonRoot** (boolean)

    Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
-->
  - **securityContext.runAsNonRoot**（boolean）

    指示容器必须以非 root 用户身份运行。如果为 true，Kubelet 将在运行时验证镜像，以确保它不会以 UID 0（root）身份运行，如果是，则无法启动容器。如果未设置或为 false，则不会执行此类验证。也可以在 SecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。

<!--
  - **securityContext.runAsGroup** (int64)

    The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.
-->
  - **securityContext.runAsGroup** (int64)

    运行容器进程入口点的 GID。如果未设置，则使用运行时默认值。也可以在 SecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先于该容器。注意，spec.os.name 为 windows 时不能设置该字段。

<!--
  - **securityContext.supplementalGroups** ([]int64)

    A list of groups applied to the first process run in each container, in addition to the container's primary GID.  If unspecified, no groups will be added to any container. Note that this field cannot be set when spec.os.name is windows.
-->
  - **securityContext.supplementalGroups** ([]int64)

    除了容器的主 GID 之外，应用于每个容器中运行的第一个进程的组列表。如果未指定，则不会将任何组添加到任何容器中。注意，spec.os.name 为 windows 时不能设置该字段。

<!--
  - **securityContext.fsGroup** (int64)

    A special supplemental group that applies to all containers in a pod. Some volume types allow the Kubelet to change the ownership of that volume to be owned by the pod:
    
    1. The owning GID will be the FSGroup 2. The setgid bit is set (new files created in the volume will be owned by FSGroup) 3. The permission bits are OR'd with rw-rw----
    
    If unset, the Kubelet will not modify the ownership and permissions of any volume. Note that this field cannot be set when spec.os.name is windows.
-->
  - **securityContext.fsGroup** (int64)

    适用于 Pod 中所有容器的特殊补充组。某些卷类型允许 Kubelet 将该卷的所有权更改为由 Pod 拥有：
    
    1. 拥有 GID 将是 FSGroup 2. setgid 位已设置（在卷中创建的新文件将归 FSGroup 所有） 3. 权限位元与为 OR'd rw-rw----
    
    如果未设置，Kubelet 不会修改任何卷的所有权和权限。注意，spec.os.name 为 windows 时不能设置该字段。

<!--
  - **securityContext.fsGroupChangePolicy** (string)

    fsGroupChangePolicy defines behavior of changing ownership and permission of the volume before being exposed inside Pod. This field will only apply to volume types which support fsGroup based ownership(and permissions). It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir. Valid values are "OnRootMismatch" and "Always". If not specified, "Always" is used. Note that this field cannot be set when spec.os.name is windows.
-->
  - **securityContext.fsGroupChangePolicy**（string）

    fsGroupChangePolicy 定义了在卷暴露在 Pod 之前更改所有权和权限的行为。此字段仅适用于支持基于 fsGroup 的所有权（和权限）的卷类型。它不会影响临时卷类型，例如：secret、configmaps 和 emptydir。有效值为 “OnRootMismatch” 和 “Always” 。如果未指定，则使用 “Always” 。注意，spec.os.name 为 windows 时不能设置该字段。

<!--
  - **securityContext.seccompProfile** (SeccompProfile)

    The seccomp options to use by the containers in this pod. Note that this field cannot be set when spec.os.name is windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.*
-->
  - **securityContext.seccompProfile** (SeccompProfile)

    此 Pod 中的容器使用的 seccomp 选项。注意，spec.os.name 为 windows 时不能设置该字段。

    <a name="SeccompProfile"></a>
    *SeccompProfile 定义 Pod/容器的 seccomp 配置文件设置。只能设置一个配置文件源。*

<!--
    - **securityContext.seccompProfile.type** (string), required

      type indicates which kind of seccomp profile will be applied. Valid options are:
      
      Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.
-->
  - **securityContext.seccompProfile.type**（string），必需

      type 指示将应用哪种 seccomp 配置文件。有效的选项是：
      
      Localhost - 应使用在节点上的文件中定义的配置文件。 RuntimeDefault - 应使用容器运行时默认配置文件。无限制 - 不应应用任何配置文件。

<!--
    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must only be set if type is "Localhost".
-->
  - **securityContext.seccompProfile.localhostProfile**（string）

      localhostProfile 指示应使用在节点上的文件中定义的配置文件。该配置文件必须在节点上预先配置才能工作。必须是相对于 kubelet 配置的 seccomp 配置文件位置的下降路径。仅当类型为 “Localhost” 时才必须设置。

<!--
  - **securityContext.seLinuxOptions** (SELinuxOptions)

    The SELinux context to be applied to all containers. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.
-->
  - **securityContext.seLinuxOptions** (SELinuxOptions)

    应用于所有容器的 SELinux 上下文。如果未指定，容器运行时将为每个容器分配一个随机 SELinux 上下文。也可以在 SecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先于该容器。注意，spec.os.name 为 windows 时不能设置该字段。

<!--
    <a name="SELinuxOptions"></a>
    *SELinuxOptions are the labels to be applied to the container*

    - **securityContext.seLinuxOptions.level** (string)

      Level is SELinux level label that applies to the container.

    - **securityContext.seLinuxOptions.role** (string)

      Role is a SELinux role label that applies to the container.

    - **securityContext.seLinuxOptions.type** (string)

      Type is a SELinux type label that applies to the container.

    - **securityContext.seLinuxOptions.user** (string)

      User is a SELinux user label that applies to the container.
-->

  <a name="SELinuxOptions"></a>
    *SELinuxOptions 是要应用于容器的标签*

  - **securityContext.seLinuxOptions.level**（string）

      Level 是应用于容器的 SELinux 级别标签。

  - **securityContext.seLinuxOptions.role**（string）

      Role 是应用于容器的 SELinux 角色标签。

  - **securityContext.seLinuxOptions.type**（string）

      Type 是适用于容器的 SELinux 类型标签。

  - **securityContext.seLinuxOptions.user**（string）

      User 是应用于容器的 SELinux 用户标签。

<!--
  - **securityContext.sysctls** ([]Sysctl)

    Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported sysctls (by the container runtime) might fail to launch. Note that this field cannot be set when spec.os.name is windows.

    <a name="Sysctl"></a>
    *Sysctl defines a kernel parameter to be set*

    - **securityContext.sysctls.name** (string), required

      Name of a property to set

    - **securityContext.sysctls.value** (string), required

      Value of a property to set
-->
  - **securityContext.sysctls** ([]Sysctl)

    Sysctls 包含用于 pod 的命名空间 sysctl 列表。具有不受支持的 sysctls（由容器运行时）的 Pod 可能无法启动。注意，spec.os.name 为 windows 时不能设置该字段。

    <a name="Sysctl"></a>
    *Sysctl 定义要设置的内核参数*

    - **securityContext.sysctls.name**（string），必需

      要设置的属性的名称

    - **securityContext.sysctls.value**（string），必需

      要设置的属性值

<!--
  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    The Windows specific settings applied to all containers. If unspecified, the options within a container's SecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions contain Windows-specific options and credentials.*
-->
  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    适用于所有容器的 Windows 特定设置。如果未指定，将使用容器的 SecurityContext 中的选项。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。注意，spec.os.name 为 linux 时不能设置该字段。

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions 包含特定于 Windows 的选项和凭据。*

<!--
    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName is the name of the GMSA credential spec to use.

    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess determines if a container should be run as a 'Host Process' container. This field is alpha-level and will only be honored by components that enable the WindowsHostProcessContainers feature flag. Setting this field without the feature flag will result in errors when validating the Pod. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers).  In addition, if HostProcess is true then HostNetwork must also be set to true.

    - **securityContext.windowsOptions.runAsUserName** (string)

      The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
-->
  - **securityContext.windowsOptions.gmsaCredentialSpec**（string）

      GMSACredentialSpec 是 GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) 内嵌由 GMSACredentialSpecName 字段命名的 GMSA 凭证规范内容的地方。

    - **securityContext.windowsOptions.gmsaCredentialSpecName**（string）

      GMSACredentialSpecName 是要使用的 GMSA 凭证规范的名称。

    - **securityContext.windowsOptions.hostProcess**（boolean）

      HostProcess 确定容器是否应作为“主机进程”容器运行。此字段是 alpha 级别的，只有启用 WindowsHostProcessContainers 功能标志的组件才会使用。在验证 Pod 时设置此字段而不使用功能标志将导致错误。一个 Pod 的所有容器必须具有相同的有效 HostProcess 值（不允许有 HostProcess 容器和非 HostProcess 容器的混合）。此外，如果 HostProcess 为 true，则 HostNetwork 也必须设置为 true。

    - **securityContext.windowsOptions.runAsUserName**（string）

      Windows 中运行容器进程入口点的用户名。如果未指定，则默认为镜像元数据中指定的用户。也可以在 PodSecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。
<!--
### Beta level
-->
### Beta level

<!--
- **ephemeralContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#EphemeralContainer" >}}">EphemeralContainer</a>)

  *Patch strategy: merge on key `name`*
  
  List of ephemeral containers run in this pod. Ephemeral containers may be run in an existing pod to perform user-initiated actions such as debugging. This list cannot be specified when creating a pod, and it cannot be modified by updating the pod spec. In order to add an ephemeral container to an existing pod, use the pod's ephemeralcontainers subresource. This field is beta-level and available on clusters that haven't disabled the EphemeralContainers feature gate.

- **preemptionPolicy** (string)

  PreemptionPolicy is the Policy for preempting pods with lower priority. One of Never, PreemptLowerPriority. Defaults to PreemptLowerPriority if unset.

- **overhead** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Overhead represents the resource overhead associated with running a pod for a given RuntimeClass. This field will be autopopulated at admission time by the RuntimeClass admission controller. If the RuntimeClass admission controller is enabled, overhead must not be set in Pod create requests. The RuntimeClass admission controller will reject Pod create requests which have the overhead already set. If RuntimeClass is configured and selected in the PodSpec, Overhead will be set to the value defined in the corresponding RuntimeClass, otherwise it will remain unset and treated as zero. More info: https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md
-->

- **ephemeralContainers** ([]<a href="{{< ref "../workload-resources/pod-v1#EphemeralContainer" >}}">EphemeralContainer</a>)

  *补丁策略：在键 `名` 上合并*
  
  在此 Pod 中运行的临时容器列表。临时容器可以在现有的 Pod 中运行，以执行用户启动的操作，例如调试。此列表在创建 Pod 时不能指定，也不能通过更新 Pod spec 来修改。要将临时容器添加到现有 Pod，请使用 Pod 的 ephemeralcontainers 子资源。此字段是 beta 级别的，可在尚未禁用 EphemeralContainers 功能门的集群上使用。

- **preemptionPolicy**（string）

  PreemptionPolicy 是抢占优先级较低的 Pod 的策略。从不，PreemptLowerPriority 之一。如果未设置，则默认为 PreemptLowerPriority。

- **overhead** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Overhead 表示与为给定 RuntimeClass 运行 pod 相关的资源开销。该字段将由 RuntimeClass 准入控制器在准入时自动填充。如果启用了 RuntimeClass 准入控制器，则不得在 Pod 创建请求中设置开销。 RuntimeClass 准入控制器将拒绝已设置开销的 Pod 创建请求。如果在 PodSpec 中配置并选择了 RuntimeClass，Overhead 将设置为对应 RuntimeClass 中定义的值，否则将保持未设置并视为零。更多信息：https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md

<!--
### Deprecated
-->
### Deprecated

<!--
- **serviceAccount** (string)

  DeprecatedServiceAccount is a depreciated alias for ServiceAccountName. Deprecated: Use serviceAccountName instead.
-->
- **serviceAccount**（string）

  DeprecatedServiceAccount 是 ServiceAccountName 的折旧别名。已弃用：改用 serviceAccountName。

<!--
## Container {#Container}

A single application container that you want to run within a pod.

<hr>

- **name** (string), required

  Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.
-->
## Container {#Container}

要在 pod 中运行的单个应用程序容器。

<hr>

- **name**（string），必填

  指定为 DNS_LABEL 的容器的名称。 pod 中的每个容器都必须有一个唯一的名称 (DNS_LABEL)。无法更新。

<!--
### Image
-->
### Image

<!--
- **image** (string)

  Container image name. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.

- **imagePullPolicy** (string)

  Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images
-->
- **image**（string）

  容器镜像名称。更多信息：https://kubernetes.io/docs/concepts/containers/images 此字段是可选的，以允许更高级别的配置管理默认或覆盖工作负载控制器（如部署和 StatefulSets）中的容器镜像。

- **imagePullPolicy**（string）

  镜像拉取策略。Always、Never、IfNotPresent。如果指定了 :latest 标签，则默认为 Always，否则默认为 IfNotPresent。无法更新。更多信息：https://kubernetes.io/docs/concepts/containers/images#updating-images

<!--
### Entrypoint
-->
### Entrypoint
<!--
- **command** ([]string)

  Entrypoint array. Not executed within a shell. The container image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
  -->
- **command**（[]string

  入口点数组。不在 shell 中执行。如果未提供，则使用容器镜像的 ENTRYPOINT。变量引用 $(VAR_NAME) 使用容器的环境进行扩展。如果无法解析变量，则输入字符串中的引用将保持不变。双 $$ 被简化为单 $，这允许转义 $(VAR_NAME) 语法：即 “$$(VAR_NAME)” 将产生字符串文字“$(VAR_NAME)”。无论变量是否存在，转义引用都不会被扩展。无法更新。更多信息：https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

<!--
- **args** ([]string)

  Arguments to the entrypoint. The container image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
  -->
- **args** ([]string)

  入口点的参数。如果未提供，则使用容器镜像的 CMD。变量引用 $(VAR_NAME) 使用容器的环境进行扩展。如果无法解析变量，则输入字符串中的引用将保持不变。双 $$ 被简化为单 $，这允许转义 $(VAR_NAME) 语法：即 “$$(VAR_NAME)” 将产生字符串文字“$(VAR_NAME)”。无论变量是否存在，转义引用都不会被扩展。无法更新。更多信息：https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

<!--
- **workingDir** (string)

  Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.
  -->
- **workingDir**（string）

  容器的工作目录。如果未指定，将使用容器运行时的默认值，这可能在容器映像中配置。无法更新。

<!--
### Ports
-->

<!--
- **ports** ([]ContainerPort)

  *Patch strategy: merge on key `containerPort`*
  
  *Map: unique values on keys `containerPort, protocol` will be kept during a merge*
  
  List of ports to expose from the container. Exposing a port here gives the system additional information about the network connections a container uses, but is primarily informational. Not specifying a port here DOES NOT prevent that port from being exposed. Any port which is listening on the default "0.0.0.0" address inside a container will be accessible from the network. Cannot be updated.

  <a name="ContainerPort"></a>
  *ContainerPort represents a network port in a single container.*
-->
- **prots**（[]ContainerPort）

  *补丁策略：在键 `containerPort`上合并*
  
  *映射：键 `containerPort, protocol` 的唯一值将在合并期间保留*
  
  要从容器公开的端口列表。在此处公开端口可为系统提供有关容器使用的网络连接的附加信息，但主要是信息性的。此处不指定端口不会阻止该端口被暴露。任何侦听容器内默认 "0.0.0.0" 地址的端口都可以从网络访问。无法更新。

  <a name="ContainerPort"></a>
  *ContainerPort 表示单个容器中的网络端口。*

<!--
  - **ports.containerPort** (int32), required

    Number of port to expose on the pod's IP address. This must be a valid port number, 0 \< x \< 65536.

  - **ports.hostIP** (string)

    What host IP to bind the external port to.

  - **ports.hostPort** (int32)

    Number of port to expose on the host. If specified, this must be a valid port number, 0 \< x \< 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.

  - **ports.name** (string)

    If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.

  - **ports.protocol** (string)

    Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".
-->
  - **ports.containerPort** (int32)，必需

    要在 pod 的 IP 地址上公开的端口数。这必须是有效的端口号，0 \< x \< 65536。

  - **ports.hostIP**（string）

    绑定外部端口的主机 IP。

  - **ports.hostPort** (int32)

    要在主机上公开的端口数。如果指定，这必须是一个有效的端口号，0 \< x \< 65536。如果指定了 HostNetwork，这必须与 ContainerPort 匹配。大多数容器不需要这个。

  - **ports.name**（string）

    如果指定，这必须是 IANA_SVC_NAME 并且在 Pod 中是唯一的。 Pod 中的每个命名端口都必须具有唯一的名称。服务可以引用的端口的名称。

  - **ports.protocol**（string）

    端口协议。必须是 UDP、TCP 或 SCTP。默认为 “TCP”。

<!--
### Environment variables
-->
### Environment variables

<!--
- **env** ([]EnvVar)

  *Patch strategy: merge on key `name`*
  
  List of environment variables to set in the container. Cannot be updated.

  <a name="EnvVar"></a>
  *EnvVar represents an environment variable present in a Container.*
-->
- **env**（[]EnvVar）

  *补丁策略：在键`名`上合并*
  
  要在容器中设置的环境变量列表。无法更新。

  <a name="EnvVar"></a>
  *EnvVar 表示容器中存在的环境变量。*

<!--
  - **env.name** (string), required

    Name of the environment variable. Must be a C_IDENTIFIER.

  - **env.value** (string)

    Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".
-->
- **env.name**（string），必填

    环境变量的名称。必须是 C_IDENTIFIER。

  - **env.value**（string）

    变量引用 $(VAR_NAME) 使用容器中先前定义的环境变量和任何服务环境变量进行扩展。如果无法解析变量，则输入字符串中的引用将保持不变。双 $$ 被简化为单 $，这允许转义 $(VAR_NAME) 语法：即"$$(VAR_NAME)" 将产生字符串文字 "$(VAR_NAME)"。无论变量是否存在，转义引用都不会被扩展。默认为 ""。

<!--
  - **env.valueFrom** (EnvVarSource)

    Source for the environment variable's value. Cannot be used if value is not empty.

    <a name="EnvVarSource"></a>
    *EnvVarSource represents a source for the value of an EnvVar.*
-->
- **env.valueFrom** (EnvVarSource)

    环境变量值的来源。如果值不为空，则不能使用。

    <a name="EnvVarSource"></a>
    *EnvVarSource 表示 EnvVar 值的来源。*

<!--
      - **env.valueFrom.configMapKeyRef.key** (string), required

        The key to select.

      - **env.valueFrom.configMapKeyRef.name** (string)

        Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.configMapKeyRef.optional** (boolean)

        Specify whether the ConfigMap or its key must be defined
-->

  - **env.valueFrom.configMapKeyRef.key**（string），必需

    选择的关键。

      - **env.valueFrom.configMapKeyRef.name**（string）

        引用者的名称。更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.configMapKeyRef.optional**（boolean）

        指定是否必须定义 ConfigMap 或其键
<!--
    - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['\<KEY>']`, `metadata.annotations['\<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.

    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported.

    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      Selects a key of a secret in the pod's namespace

      <a name="SecretKeySelector"></a>
      *SecretKeySelector selects a key of a Secret.*

      - **env.valueFrom.secretKeyRef.key** (string), required

        The key of the secret to select from.  Must be a valid secret key.

      - **env.valueFrom.secretKeyRef.name** (string)

        Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional** (boolean)

        Specify whether the Secret or its key must be defined
-->
  - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      选择 Pod 的一个字段：支持 metadata.name、metadata.namespace、`metadata.labels['\<KEY>']`、`metadata.annotations['\<KEY>']`、spec.nodeName、spec. serviceAccountName、status.hostIP、status.podIP、status.podIPs。

    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      选择容器的资源：目前仅支持资源限制和请求（limits.cpu、limits.memory、limits.ephemeral-storage、requests.cpu、requests.memory 和 requests.ephemeral-storage）。

    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      在 pod 的命名空间中选择密钥的密钥

      <a name="SecretKeySelector"></a>
      *SecretKeySelector 选择一个 Secret 的密钥。*

      - **env.valueFrom.secretKeyRef.key**（string），必需

        要从中选择的密钥的密钥。必须是有效的密钥。

      - **env.valueFrom.secretKeyRef.name**（string）

        引用者的名称。更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional**（boolean）

        指定是否必须定义 Secret 或其密钥

<!--
- **envFrom** ([]EnvFromSource)

  List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.

    <a name="EnvFromSource"></a>
  *EnvFromSource represents the source of a set of ConfigMaps*
-->
- **envFrom** ([]EnvFromSource)

  在容器中填充环境变量的源列表。在源中定义的键必须是 C_IDENTIFIER。容器启动时，所有无效键都将作为事件报告。当一个键存在于多个源中时，与最后一个源关联的值将优先。由具有重复键的 Env 定义的值将优先。无法更新。
  <a name="EnvFromSource"></a>
  *EnvFromSource 表示一组 ConfigMaps 的来源*

<!--
  - **envFrom.configMapRef** (ConfigMapEnvSource)

    The ConfigMap to select from

    <a name="ConfigMapEnvSource"></a>
    *ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.
    
    The contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables.*

    - **envFrom.configMapRef.name** (string)

      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional** (boolean)

      Specify whether the ConfigMap must be defined
-->

- **envFrom.configMapRef** (ConfigMapEnvSource)

    要从中选择的 ConfigMap

    <a name="ConfigMapEnvSource"></a>
    *ConfigMapEnvSource 选择一个 ConfigMap 来填充环境变量。
    
    目标 ConfigMap 的 Data 字段的内容将键值对表示为环境变量。*

    - **envFrom.configMapRef.name**（string）

      引用者的名称。更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional**（boolean）

      指定是否必须定义 ConfigMap
<!--
  - **envFrom.prefix** (string)

    An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.

  - **envFrom.secretRef** (SecretEnvSource)

    The Secret to select from

    <a name="SecretEnvSource"></a>
    *SecretEnvSource selects a Secret to populate the environment variables with.
    
    The contents of the target Secret's Data field will represent the key-value pairs as environment variables.*

    - **envFrom.secretRef.name** (string)

      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional** (boolean)

      Specify whether the Secret must be defined
-->
  - **envFrom.prefix**（string）

    附加到 ConfigMap 中每个键的可选标识符。必须是 C_IDENTIFIER。

  - **envFrom.secretRef** (SecretEnvSource)

    可供选择的秘密

    <a name="SecretEnvSource"></a>
    *SecretEnvSource 选择一个 Secret 来填充环境变量。
    
    目标 Secret 的 Data 字段的内容将键值对表示为环境变量。*

    - **envFrom.secretRef.name**（string）

      引用者的名称。更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional**（boolean）

      指定是否必须定义 Secret

<!--
### Volumes
-->
### Volumes

<!--
- **volumeMounts** ([]VolumeMount)

  *Patch strategy: merge on key `mountPath`*
  
  Pod volumes to mount into the container's filesystem. Cannot be updated.

  <a name="VolumeMount"></a>
  *VolumeMount describes a mounting of a Volume within a container.*
-->
- **volumeMounts** ([]VolumeMount)

  *补丁策略：在键`mountPath`上合并*
  
  要挂载到容器文件系统中的 Pod 卷。无法更新。

  <a name="VolumeMount"></a>
  *VolumeMount 描述了在容器中安装卷。*

<!--
  - **volumeMounts.mountPath** (string), required

    Path within the container at which the volume should be mounted.  Must not contain ':'.

  - **volumeMounts.name** (string), required

    This must match the Name of a Volume.

  - **volumeMounts.mountPropagation** (string)

    mountPropagation determines how mounts are propagated from the host to container and the other way around. When not set, MountPropagationNone is used. This field is beta in 1.10.

  - **volumeMounts.readOnly** (boolean)

    Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false.

  - **volumeMounts.subPath** (string)

    Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root).

  - **volumeMounts.subPathExpr** (string)

    Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to "" (volume's root). SubPathExpr and SubPath are mutually exclusive.
-->

- **volumeMounts.mountPath**（string），必需

    容器内应安装卷的路径。不得包含 ':'。

  - **volumeMounts.name**（string），必需

    这必须与卷的名称匹配。

  - **volumeMounts.mountPropagation**（string）

    mountPropagation 确定挂载如何从主机传播到容器，反之亦然。如果未设置，则使用 MountPropagationNone。该字段在 1.10 中是 beta 版。

  - **volumeMounts.readOnly**（boolean）

    如果为 true，则以只读方式挂载，否则以读写方式挂载（false 或unspecified）。默认为 false。

  - **volumeMounts.subPath**（boolean）

    应该从其安装容器的卷的卷中的路径。默认为 ""（卷的根）。

  - **volumeMounts.subPathExpr**（字符串）

    应安装容器卷的卷内的扩展路径。行为类似于 SubPath，但环境变量引用 $(VAR_NAME) 使用容器的环境进行扩展。默认为“”（卷的根）。 SubPathExpr 和 SubPath 是互斥的。
<!--
- **volumeDevices** ([]VolumeDevice)

  *Patch strategy: merge on key `devicePath`*
  
  volumeDevices is the list of block devices to be used by the container.

  <a name="VolumeDevice"></a>
  *volumeDevice describes a mapping of a raw block device within a container.*
-->
- **volumeDevices** ([]VolumeDevice)

  *补丁策略：在键`devicePath`上合并*
  
  volumeDevices 是容器要使用的块设备列表。

  <a name="VolumeDevice"></a>
  *volumeDevice 描述了容器内原始块设备的映射。*

<!--
  - **volumeDevices.devicePath** (string), required

    devicePath is the path inside of the container that the device will be mapped to.

  - **volumeDevices.name** (string), required

    name must match the name of a persistentVolumeClaim in the pod
-->
  - **volumeDevices.devicePath**（string），必需

    devicePath 是设备将被映射到的容器内的路径。

  - **volumeDevices.name**（string），必需

    name 必须与 Pod 中的 persistentVolumeClaim 的名称匹配


<!--
### Resources
-->
### Resources

<!--
- **resources** (ResourceRequirements)

  Compute Resources required by this container. Cannot be updated. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  <a name="ResourceRequirements"></a>
  *ResourceRequirements describes the compute resource requirements.*
-->
- **resources**（ResourceRequirements）

  计算此容器所需的资源。无法更新。更多信息：https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  <a name="ResourceRequirements"></a>
  *ResourceRequirements 描述了计算资源要求。*

<!--
  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
-->
  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">数量</a>)

    限制描述了允许的最大计算资源量。更多信息：https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">数量</a>)

    请求描述了所需的最小计算资源量。如果容器省略了 Requests，如果明确指定，则默认为 Limits，否则为实现定义的值。更多信息：https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

<!--
### Lifecycle
-->
### Lifecycle

<!--
- **lifecycle** (Lifecycle)

  Actions that the management system should take in response to container lifecycle events. Cannot be updated.

  <a name="Lifecycle"></a>
  *Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted.*
-->
- **lifecycle**（Lifecycle）

  管理系统应对容器生命周期事件采取的行动。无法更新。

  <a name="生命周期"></a>
  *生命周期描述了管理系统为响应容器生命周期事件应采取的行动。对于 PostStart 和 PreStop 生命周期处理程序，容器的管理会阻塞，直到操作完成，除非容器进程失败，在这种情况下处理程序被中止。*

<!--
  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
-->
  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    创建容器后立即调用 PostStart。如果处理程序失败，则容器将根据其重新启动策略终止并重新启动。容器的其他管理阻塞直到钩子完成。更多信息：https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

<!--
  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PreStop is called immediately before a container is terminated due to an API request or management event such as liveness/startup probe failure, preemption, resource contention, etc. The handler is not called if the container crashes or exits. The Pod's termination grace period countdown begins before the PreStop hook is executed. Regardless of the outcome of the handler, the container will eventually terminate within the Pod's termination grace period (unless delayed by finalizers). Other management of the container blocks until the hook completes or until the termination grace period is reached. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
-->
- **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PreStop 在容器因 API 请求或管理事件（如 liveness/startup probe failure、抢占、资源争用等）而终止之前立即调用。如果容器崩溃或退出，则不会调用处理程序。 Pod 的终止宽限期倒计时在 PreStop 钩子执行之前开始。无论处理程序的结果如何，容器最终都会在 Pod 的终止宽限期内终止（除非被终结器延迟）。容器的其他管理会阻塞，直到钩子完成或达到终止宽限期。更多信息：https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

<!--
- **terminationMessagePath** (string)

  Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.
-->
- **terminationMessagePath**（string）

  可选：将写入容器终止消息的文件挂载到容器文件系统的路径。写入的消息旨在成为简短的最终状态，例如断言失败消息。如果大于 4096 字节，将被节点截断。所有容器的总消息长度将限制为 12kb。默认为 /dev/termination-log。无法更新。

<!--
- **terminationMessagePolicy** (string)

  Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.
-->
- **terminationMessagePolicy**（string）

  指示应如何填充终止消息。 File 将使用 terminateMessagePath 的内容来填充成功和失败的容器状态消息。如果终止消息文件为空并且容器因错误退出，FallbackToLogsOnError 将使用容器日志输出的最后一块。日志输出限制为 2048 字节或 80 行，以较小者为准。默认为文件。无法更新。

<!--
- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Periodic probe of container liveness. Container will be restarted if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  StartupProbe indicates that the Pod has successfully initialized. If specified, no other probes are executed until this completes successfully. If this probe fails, the Pod will be restarted, just as if the livenessProbe failed. This can be used to provide different probe parameters at the beginning of a Pod's lifecycle, when it might take a long time to load data or warm a cache, than during steady-state operation. This cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
-->
- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  定期探测容器活跃度。如果探测失败，容器将重新启动。无法更新。更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  定期探测容器服务就绪情况。如果探测失败，容器将从服务端点中删除。无法更新。更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  StartupProbe 表示 Pod 已成功初始化。如果指定，则在成功完成之前不会执行其他探测。如果这个探测失败，Pod 会重新启动，就像 livenessProbe 失败一样。这可用于在 Pod 生命周期开始时提供不同的探测参数，此时加载数据或预热缓存可能需要比稳态操作期间更长的时间。这无法更新。更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

### Security Context
<!--
- **securityContext** (SecurityContext)

  SecurityContext defines the security options the container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext. More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/

  <a name="SecurityContext"></a>
  *SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence.*
-->
- **securityContext** (SecurityContext)

  SecurityContext 定义了容器应该运行的安全选项。如果设置，SecurityContext 的字段将覆盖 PodSecurityContext 的等效字段。更多信息：https://kubernetes.io/docs/tasks/configure-pod-container/security-context/

  <a name="SecurityContext"></a>
  *SecurityContext 保存将应用于容器的安全配置。 SecurityContext 和 PodSecurityContext 中都存在一些字段。当两者都设置时，SecurityContext 中的值优先。*

<!--
  - **securityContext.runAsUser** (int64)

    The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
-->
- **securityContext.runAsUser** (int64)

    运行容器进程入口点的 UID。如果未指定，则默认为图像元数据中指定的用户。也可以在 PodSecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。注意，spec.os.name 为 windows 时不能设置该字段。

<!--
  - **securityContext.runAsNonRoot** (boolean)

    Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
-->
- **securityContext.runAsNonRoot**（boolean）

    指示容器必须以非 root 用户身份运行。如果为 true，Kubelet 将在运行时验证镜像，以确保它不会以 UID 0（root）身份运行，如果是，则无法启动容器。如果未设置或为 false，则不会执行此类验证。也可以在 PodSecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。
<!--
  - **securityContext.runAsGroup** (int64)

    The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.
-->
- **securityContext.runAsGroup** (int64)

    运行容器进程入口点的 GID。如果未设置，则使用运行时默认值。也可以在 PodSecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。注意，spec.os.name 为 windows 时不能设置该字段。

<!--
  - **securityContext.readOnlyRootFilesystem** (boolean)

    Whether this container has a read-only root filesystem. Default is false. Note that this field cannot be set when spec.os.name is windows.
-->
- **securityContext.readOnlyRootFilesystem**（boolean）

    此容器是否具有只读根文件系统。默认为 false。注意，spec.os.name 为 windows 时不能设置该字段。

<!--
  - **securityContext.procMount** (string)

    procMount denotes the type of proc mount to use for the containers. The default is DefaultProcMount which uses the container runtime defaults for readonly paths and masked paths. This requires the ProcMountType feature flag to be enabled. Note that this field cannot be set when spec.os.name is windows.
-->
- **securityContext.procMount**（string）

    procMount 表示用于容器的 proc 挂载类型。默认值为 DefaultProcMount，它将容器运行时默认值用于只读路径和掩码路径。这需要启用 ProcMountType 功能标志。注意，spec.os.name 为 windows 时不能设置该字段。

<!--
  - **securityContext.privileged** (boolean)

    Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host. Defaults to false. Note that this field cannot be set when spec.os.name is windows.
-->
- **securityContext.privileged**（boolean）

    以特权模式运行容器。特权容器中的进程本质上等同于主机上的 root。默认为 false。注意，spec.os.name 为 windows 时不能设置该字段。

<!--
  - **securityContext.allowPrivilegeEscalation** (boolean)

    AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process. This bool directly controls if the no_new_privs flag will be set on the container process. AllowPrivilegeEscalation is true always when the container is: 1) run as Privileged 2) has CAP_SYS_ADMIN Note that this field cannot be set when spec.os.name is windows.
-->
- **securityContext.allowPrivilegeEscalation**（boolean）

    AllowPrivilegeEscalation 控制进程是否可以获得比其父进程更多的权限。此布尔值直接控制是否在容器进程上设置 no_new_privs 标志。 AllowPrivilegeEscalation 在容器处于以下状态时始终为真： 1) 以特权身份运行 2) 具有 CAP_SYS_ADMIN 请注意，当 spec.os.name 为 windows 时，无法设置此字段。

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
- **securityContext.capabilities**（Capabilities）

    運行容器時添加/刪除的功能。默認為容器運行時授予的默認功能集。注意，spec.os.name 為 windows 時不能設置該字段。

    <a name="Capabilities"></a>
    *在正在運行的容器中添加和刪除 POSIX 功能。*

    - **securityContext.capabilities.add** ([]string)

      新增功能

    - **securityContext.capabilities.drop** ([]string)

      刪除的功能
<!--
  - **securityContext.seccompProfile** (SeccompProfile)

    The seccomp options to use by this container. If seccomp options are provided at both the pod & container level, the container options override the pod options. Note that this field cannot be set when spec.os.name is windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.*

    - **securityContext.seccompProfile.type** (string), required

      type indicates which kind of seccomp profile will be applied. Valid options are:
      
      Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.
      
      

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must only be set if type is "Localhost".
-->
- **securityContext.seccompProfile** (SeccompProfile)

    此容器使用的 seccomp 選項。如果在 pod 和容器級別都提供了 seccomp 選項，則容器選項會覆蓋 pod 選項。注意，spec.os.name 為 windows 時不能設置該字段。

    <a name="SeccompProfile"></a>
    *SeccompProfile 定義 pod/容器的 seccomp 配置文件設置。只能設置一個配置文件源。*

    - **securityContext.seccompProfile.type**（字符串），必需

      type 指示將應用哪種 seccomp 配置文件。有效的選項是：
      
      本地主機 - 應使用在節點上的文件中定義的配置文件。 RuntimeDefault - 應使用容器運行時默認配置文件。無限制 - 不應應用任何配置文件。
      
      

    - **securityContext.seccompProfile.localhostProfile**（字符串）

      localhostProfile 指示應使用在節點上的文件中定義的配置文件。該配置文件必須在節點上預先配置才能工作。必須是相對於 kubelet 配置的 seccomp 配置文件位置的下降路徑。僅當類型為“本地主機”時才必須設置。

<!--
  - **securityContext.seLinuxOptions** (SELinuxOptions)

    The SELinux context to be applied to the container. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

    <a name="SELinuxOptions"></a>
    *SELinuxOptions are the labels to be applied to the container*

    - **securityContext.seLinuxOptions.level** (string)

      Level is SELinux level label that applies to the container.

    - **securityContext.seLinuxOptions.role** (string)

      Role is a SELinux role label that applies to the container.

    - **securityContext.seLinuxOptions.type** (string)

      Type is a SELinux type label that applies to the container.

    - **securityContext.seLinuxOptions.user** (string)

      User is a SELinux user label that applies to the container.
-->
- **securityContext.seLinuxOptions** (SELinuxOptions)

    要應用於容器的 SELinux 上下文。如果未指定，容器運行時將為每個容器分配一個隨機 SELinux 上下文。也可以在 PodSecurityContext 中設置。如果同時在 SecurityContext 和 PodSecurityContext 中設置，則在 SecurityContext 中指定的值優先。注意，spec.os.name 為 windows 時不能設置該字段。

    <a name="SELinuxOptions"></a>
    *SELinuxOptions 是要應用於容器的標籤*

    - **securityContext.seLinuxOptions.level**（string）

      Level 是應用於容器的 SELinux 級別標籤。

    - **securityContext.seLinuxOptions.role**（string）

      Role 是應用於容器的 SELinux 角色標籤。

    - **securityContext.seLinuxOptions.type**（string）

      Type 是適用於容器的 SELinux 類型標籤。

    - **securityContext.seLinuxOptions.user**（string）

      User 是應用於容器的 SELinux 用戶標籤。

<!--
  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    The Windows specific settings applied to all containers. If unspecified, the options from the PodSecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions contain Windows-specific options and credentials.*
-->
  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    适用于所有容器的 Windows 特定设置。如果未指定，将使用 PodSecurityContext 中的选项。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。注意，spec.os.name 为 linux 时不能设置该字段。

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions 包含特定于 Windows 的选项和凭据。*

<!--
    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName is the name of the GMSA credential spec to use.

    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess determines if a container should be run as a 'Host Process' container. This field is alpha-level and will only be honored by components that enable the WindowsHostProcessContainers feature flag. Setting this field without the feature flag will result in errors when validating the Pod. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers).  In addition, if HostProcess is true then HostNetwork must also be set to true.

    - **securityContext.windowsOptions.runAsUserName** (string)

      The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
-->
  - **securityContext.windowsOptions.gmsaCredentialSpec**（string）

      GMSACredentialSpec 是 GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) 内嵌由 GMSACredentialSpecName 字段命名的 GMSA 凭证规范内容的地方。

    - **securityContext.windowsOptions.gmsaCredentialSpecName**（string）

      GMSACredentialSpecName 是要使用的 GMSA 凭证规范的名称。

    - **securityContext.windowsOptions.hostProcess**（boolean）

      HostProcess 确定容器是否应作为“主机进程”容器运行。此字段是 alpha 级别的，只有启用 WindowsHostProcessContainers 功能标志的组件才会使用。在验证 Pod 时设置此字段而不使用功能标志将导致错误。一个 Pod 的所有容器必须具有相同的有效 HostProcess 值（不允许有 HostProcess 容器和非 HostProcess 容器的混合）。此外，如果 HostProcess 为 true，则 HostNetwork 也必须设置为 true。

    - **securityContext.windowsOptions.runAsUserName**（string）

      Windows 中运行容器进程入口点的用户名。如果未指定，则默认为图像元数据中指定的用户。也可以在 PodSecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。

### Debugging

<!--
- **stdin** (boolean)

  Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.

- **stdinOnce** (boolean)

  Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false

- **tty** (boolean)

  Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.
-->
- **stdin**（boolean）

  此容器是否应在容器运行时为 stdin 分配缓冲区。如果未设置，从容器中的 stdin 读取将始终导致 EOF。默认为 false。

- **stdinOnce**（boolean）

  容器运行时是否应在单个附加打开 stdin 通道后关闭它。当 stdin 为 true 时，stdin 流将在多个附加会话中保持打开状态。
  如果 stdinOnce 设置为 true，则 stdin 在容器启动时打开，在第一个客户端连接到 stdin 之前为空，然后保持打开并接受数据，直到客户端断开连接，此时 stdin 关闭并保持关闭直到容器重新启动。
  如果此标志为 false，则从 stdin 读取的容器进程将永远不会收到 EOF。默认为 false。

- **tty**（boolean）

  这个容器是否应该为自己分配一个 TTY，也需要 'stdin' 为 true。默认为 false。

## EphemeralContainer {#EphemeralContainer}

<!--
An EphemeralContainer is a temporary container that you may add to an existing Pod for user-initiated activities such as debugging. Ephemeral containers have no resource or scheduling guarantees, and they will not be restarted when they exit or when a Pod is removed or restarted. The kubelet may evict a Pod if an ephemeral container causes the Pod to exceed its resource allocation.

To add an ephemeral container, use the ephemeralcontainers subresource of an existing Pod. Ephemeral containers may not be removed or restarted.

This is a beta feature available on clusters that haven't disabled the EphemeralContainers feature gate.
-->
EphemeralContainer 是一个临时容器，您可以将其添加到现有 Pod 以用于用户启动的活动，例如调试。临时容器没有资源或调度保证，它们在退出或 Pod 被移除或重新启动时不会重新启动。如果临时容器导致 Pod 超出其资源分配，kubelet 可能会驱逐 Pod。

要添加临时容器，请使用现有 Pod 的 ephemeralcontainers 子资源。临时容器不能被删除或重新启动。

这是未禁用 EphemeralContainers 功能门的集群上可用的 beta 功能。

<hr>

<!--
- **name** (string), required

  Name of the ephemeral container specified as a DNS_LABEL. This name must be unique among all containers, init containers and ephemeral containers.

- **targetContainerName** (string)

  If set, the name of the container from PodSpec that this ephemeral container targets. The ephemeral container will be run in the namespaces (IPC, PID, etc) of this container. If not set then the ephemeral container uses the namespaces configured in the Pod spec.
  
  The container runtime must implement support for this feature. If the runtime does not support namespace targeting then the result of setting this field is undefined.
-->
- **name**（string），必填

  指定为 DNS_LABEL 的临时容器的名称。此名称在所有容器、初始化容器和临时容器中必须是唯一的。

- **targetContainerName**（string）

  如果设置，则为 PodSpec 中此临时容器所针对的容器的名称。临时容器将在该容器的命名空间（IPC、PID 等）中运行。如果未设置，则临时容器使用 Pod 规范中配置的命名空间。
  
  容器运行时必须实现对此功能的支持。如果运行时不支持命名空间定位，则设置此字段的结果是未定义的。

### Image

<!--
- **image** (string)

  Container image name. More info: https://kubernetes.io/docs/concepts/containers/images

- **imagePullPolicy** (string)

  Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images
  
-->
- **image**（string）

  容器镜像名称。更多信息：https://kubernetes.io/docs/concepts/containers/images

- **imagePullPolicy**（string）

  镜像拉取策略。Always、Never、IfNotPresent。如果指定了 :latest 标签，则默认为 Always，否则默认为 IfNotPresent。无法更新。更多信息：https://kubernetes.io/docs/concepts/containers/images#updating-images

### Entrypoint

<!--
- **command** ([]string)

  Entrypoint array. Not executed within a shell. The image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

- **args** ([]string)

  Arguments to the entrypoint. The image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

- **workingDir** (string)

  Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.
-->
- **command**（[]string）

  入口点数组。不在 shell 中执行。如果未提供，则使用图像的 ENTRYPOINT。变量引用 $(VAR_NAME) 使用容器的环境进行扩展。如果无法解析变量，则输入字符串中的引用将保持不变。双 $$ 被简化为单 $，这允许转义 $(VAR_NAME) 语法：即“$$(VAR_NAME)”将产生字符串文字“$(VAR_NAME)”。无论变量是否存在，转义引用都不会被扩展。无法更新。更多信息：https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

- **args** ([]string)

  入口点的参数。如果未提供，则使用图像的 CMD。变量引用 $(VAR_NAME) 使用容器的环境进行扩展。如果无法解析变量，则输入字符串中的引用将保持不变。双 $$ 被简化为单 $，这允许转义 $(VAR_NAME) 语法：即“$$(VAR_NAME)”将产生字符串文字“$(VAR_NAME)”。无论变量是否存在，转义引用都不会被扩展。无法更新。更多信息：https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell

- **workingDir**（string）

  容器的工作目录。如果未指定，将使用容器运行时的默认值，这可能在容器映像中配置。无法更新。

### Environment variables

<!--
- **env** ([]EnvVar)

  *Patch strategy: merge on key `name`*
  
  List of environment variables to set in the container. Cannot be updated.

  <a name="EnvVar"></a>
  *EnvVar represents an environment variable present in a Container.*
-->
- **env**（[]EnvVar）

  *补丁策略：根据键 `name` 上合并*
  
  要在容器中设置的环境变量列表。无法更新。

  <a name="EnvVar"></a>
  *EnvVar 表示容器中存在的环境变量。*

<!--
  - **env.name** (string), required

    Name of the environment variable. Must be a C_IDENTIFIER.

  - **env.value** (string)

    Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".
-->
  - **env.name**（string），必填

    环境变量的名称。必须是 C_IDENTIFIER。

  - **env.value**（string）

    变量引用 $(VAR_NAME) 使用容器中先前定义的环境变量和任何服务环境变量进行扩展。
    如果无法解析变量，则输入字符串中的引用将保持不变。
    双 $$ 被简化为单 $，这允许转义 $(VAR_NAME) 语法：即 "$$(VAR_NAME)" 将产生字符串文字 "$(VAR_NAME)"。
    无论变量是否存在，转义引用都不会被扩展。默认为 ""。

<!--
  - **env.valueFrom** (EnvVarSource)

    Source for the environment variable's value. Cannot be used if value is not empty.

    <a name="EnvVarSource"></a>
    *EnvVarSource represents a source for the value of an EnvVar.*

    - **env.valueFrom.configMapKeyRef** (ConfigMapKeySelector)

      Selects a key of a ConfigMap.

      <a name="ConfigMapKeySelector"></a>
      *Selects a key from a ConfigMap.*
-->
  - **env.valueFrom** (EnvVarSource)

    环境变量值的来源。如果值不为空，则不能使用。

    <a name="EnvVarSource"></a>
    *EnvVarSource 表示 EnvVar 值的来源。*

    - **env.valueFrom.configMapKeyRef** (ConfigMapKeySelector)

      选择 ConfigMap 的键。

      <a name="ConfigMapKeySelector"></a>
      *从 ConfigMap 中选择一个键。*

<!--

      - **env.valueFrom.configMapKeyRef.key** (string), required

        The key to select.

      - **env.valueFrom.configMapKeyRef.name** (string)

        Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.configMapKeyRef.optional** (boolean)

        Specify whether the ConfigMap or its key must be defined
-->

  - **env.valueFrom.configMapKeyRef.key**（string），必需

        选择的关键。

    - **env.valueFrom.configMapKeyRef.name**（string）

        引用者的名称。更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **env.valueFrom.configMapKeyRef.optional**（boolean）

        指定是否必须定义 ConfigMap 或其键
<!--
    - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['\<KEY>']`, `metadata.annotations['\<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.

    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported.

    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      Selects a key of a secret in the pod's namespace

      <a name="SecretKeySelector"></a>
      *SecretKeySelector selects a key of a Secret.*

      - **env.valueFrom.secretKeyRef.key** (string), required

        The key of the secret to select from.  Must be a valid secret key.

      - **env.valueFrom.secretKeyRef.name** (string)

        Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional** (boolean)

        Specify whether the Secret or its key must be defined
-->
  - **env.valueFrom.fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

      选择 Pod 的一个字段：支持 metadata.name、metadata.namespace、`metadata.labels['\<KEY>']`、`metadata.annotations['\<KEY>']`、spec.nodeName、spec. serviceAccountName、status.hostIP、status.podIP、status.podIPs。

    - **env.valueFrom.resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

      选择容器的资源：目前仅支持资源限制和请求（limits.cpu、limits.memory、limits.ephemeral-storage、requests.cpu、requests.memory 和 requests.ephemeral-storage）。

    - **env.valueFrom.secretKeyRef** (SecretKeySelector)

      在 pod 的命名空间中选择密钥的密钥

      <a name="SecretKeySelector"></a>
      *SecretKeySelector 选择一个 Secret 的密钥。*

      - **env.valueFrom.secretKeyRef.key**（string），必需

        要从中选择的密钥的密钥。必须是有效的密钥。

      - **env.valueFrom.secretKeyRef.name**（string）

        引用者的名称。更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **env.valueFrom.secretKeyRef.optional**（boolean）

        指定是否必须定义 Secret 或其密钥
<!--
- **envFrom** ([]EnvFromSource)

  List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.

  <a name="EnvFromSource"></a>
  *EnvFromSource represents the source of a set of ConfigMaps*
-->
- **envFrom** ([]EnvFromSource)

  在容器中填充环境变量的源列表。在源中定义的键必须是 C_IDENTIFIER。容器启动时，所有无效键都将作为事件报告。当一个键存在于多个源中时，与最后一个源关联的值将优先。由具有重复键的 Env 定义的值将优先。无法更新。

  <a name="EnvFromSource"></a>
  *EnvFromSource 表示一组 ConfigMaps 的来源*

<!--
  - **envFrom.configMapRef** (ConfigMapEnvSource)

    The ConfigMap to select from

    <a name="ConfigMapEnvSource"></a>
    *ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.
    
    The contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables.*

    - **envFrom.configMapRef.name** (string)

      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional** (boolean)

      Specify whether the ConfigMap must be defined
-->
  - **envFrom.configMapRef** (ConfigMapEnvSource)

    要从中选择的 ConfigMap

    <a name="ConfigMapEnvSource"></a>
    *ConfigMapEnvSource 选择一个 ConfigMap 来填充环境变量。
    
    目标 ConfigMap 的 Data 字段的内容将键值对表示为环境变量。*

    - **envFrom.configMapRef.name**（string）

      引用者的名称。更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.configMapRef.optional**（boolean）

      指定是否必须定义 ConfigMap

<!--
  - **envFrom.prefix** (string)

    An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.

  - **envFrom.secretRef** (SecretEnvSource)

    The Secret to select from

    <a name="SecretEnvSource"></a>
    *SecretEnvSource selects a Secret to populate the environment variables with.
    
    The contents of the target Secret's Data field will represent the key-value pairs as environment variables.*

    - **envFrom.secretRef.name** (string)

      Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional** (boolean)

      Specify whether the Secret must be defined
-->
  - **envFrom.prefix**（string）

    附加到 ConfigMap 中每个键的可选标识符。必须是 C_IDENTIFIER。

  - **envFrom.secretRef** (SecretEnvSource)

    可供选择的秘密

    <a name="SecretEnvSource"></a>
    *SecretEnvSource 选择一个 Secret 来填充环境变量。
    
    目标 Secret 的 Data 字段的内容将键值对表示为环境变量。*

    - **envFrom.secretRef.name**（string）

      引用者的名称。更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

    - **envFrom.secretRef.optional**（boolean）

      指定是否必须定义 Secret

### Volumes

<!--
- **volumeMounts** ([]VolumeMount)

  *Patch strategy: merge on key `mountPath`*
  
  Pod volumes to mount into the container's filesystem. Subpath mounts are not allowed for ephemeral containers. Cannot be updated.

  <a name="VolumeMount"></a>
  *VolumeMount describes a mounting of a Volume within a container.*
-->

- **volumeMounts** ([]VolumeMount)

  *补丁策略：根据键 `mountPath` 上合并*
  
  要挂载到容器文件系统中的 Pod 卷。临时容器不允许子路径挂载。无法更新。

  <a name="VolumeMount"></a>
  *VolumeMount 描述了在容器中安装卷。*

<!--
  - **volumeMounts.mountPath** (string), required

    Path within the container at which the volume should be mounted.  Must not contain ':'.

  - **volumeMounts.name** (string), required

    This must match the Name of a Volume.

  - **volumeMounts.mountPropagation** (string)

    mountPropagation determines how mounts are propagated from the host to container and the other way around. When not set, MountPropagationNone is used. This field is beta in 1.10.

  - **volumeMounts.readOnly** (boolean)

    Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false.

  - **volumeMounts.subPath** (string)

    Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root).

  - **volumeMounts.subPathExpr** (string)

    Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to "" (volume's root). SubPathExpr and SubPath are mutually exclusive.
-->
- **volumeMounts.mountPath**（string），必需

    容器内应安装卷的路径。不得包含“：”。

  - **volumeMounts.name**（string），必需

    这必须与卷的名称匹配。

  - **volumeMounts.mountPropagation**（string）

    mountPropagation 确定挂载如何从主机传播到容器，反之亦然。
    如果未设置，则使用 MountPropagationNone。
    该字段在 1.10 中是 beta 版。

  - **volumeMounts.readOnly**（string）

    如果为 true，则以只读方式挂载，否则以读写方式挂载（false 或 unspecified）。默认为 false。

  - **volumeMounts.subPath**（string）

    应该从其安装容器的卷的卷中的路径。默认为 "" （卷的根）。

  - **volumeMounts.subPathExpr**（string）

    应安装容器卷的卷内的扩展路径。
    行为类似于 SubPath，但环境变量引用 $(VAR_NAME) 使用容器的环境进行扩展。默认为 "" （卷的根）。 
    SubPathExpr 和 SubPath 是互斥的。

<!--
- **volumeDevices** ([]VolumeDevice)

  *Patch strategy: merge on key `devicePath`*
  
  volumeDevices is the list of block devices to be used by the container.

  <a name="VolumeDevice"></a>
  *volumeDevice describes a mapping of a raw block device within a container.*
-->
- **volumeDevices** ([]VolumeDevice)

  *补丁策略：根据键 `devicePath` 上合并*
  
  volumeDevices 是容器要使用的块设备列表。

  <a name="VolumeDevice"></a>
  *volumeDevice 描述了容器内原始块设备的映射。*

<!--
  - **volumeDevices.devicePath** (string), required

    devicePath is the path inside of the container that the device will be mapped to.

  - **volumeDevices.name** (string), required

    name must match the name of a persistentVolumeClaim in the pod
-->
  - **volumeDevices.devicePath**（string），必需

    devicePath 是设备将被映射到的容器内的路径。

  - **volumeDevices.name**（string），必需

    name 必须与 Pod 中的 persistentVolumeClaim 的名称匹配

### Lifecycle

<!--
- **terminationMessagePath** (string)

  Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.

- **terminationMessagePolicy** (string)

  Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.
-->
- **terminationMessagePath**（string）

  可选：将写入容器终止消息的文件挂载到容器文件系统的路径。写入的消息旨在成为简短的最终状态，例如断言失败消息。
  如果大于 4096 字节，将被节点截断。
  所有容器的总消息长度将限制为 12kb。默认为 /dev/termination-log。
  无法更新。

- **terminationMessagePolicy**（string）

  指示应如何填充终止消息。
  File 将使用 terminateMessagePath 的内容来填充成功和失败的容器状态消息。
  如果终止消息文件为空并且容器因错误退出，FallbackToLogsOnError 将使用容器日志输出的最后一块。
  日志输出限制为 2048 字节或 80 行，以较小者为准。默认为文件。无法更新。


### Debugging

<!--
- **stdin** (boolean)

  Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.

- **stdinOnce** (boolean)

  Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false

- **tty** (boolean)

  Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.
-->
- **stdin**（boolean）

  此容器是否应在容器运行时为 stdin 分配缓冲区。如果未设置，从容器中的 stdin 读取将始终导致 EOF。默认为 false。

- **stdinOnce**（boolean）

  容器运行时是否应在单个附加打开 stdin 通道后关闭它。当 stdin 为 true 时，stdin 流将在多个附加会话中保持打开状态。
  如果 stdinOnce 设置为 true，则 stdin 在容器启动时打开，在第一个客户端连接到 stdin 之前为空，然后保持打开并接受数据，直到客户端断开连接，此时 stdin 关闭并保持关闭直到容器重新启动。
  如果此标志为 false，则从 stdin 读取的容器进程将永远不会收到 EOF。默认为 false。

- **tty**（boolean）

  这个容器是否应该为自己分配一个 TTY，也需要 'stdin' 为 true。默认为 false。

### Security context

<!--
- **securityContext** (SecurityContext)

  Optional: SecurityContext defines the security options the ephemeral container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext.

  <a name="SecurityContext"></a>
  *SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence.*
-->
- **securityContext** (SecurityContext)

  可选：SecurityContext 定义了运行临时容器的安全选项。
  如果设置，SecurityContext 的字段将覆盖 PodSecurityContext 的等效字段。

  <a name="SecurityContext"></a>
  *SecurityContext 保存将应用于容器的安全配置。
  SecurityContext 和 PodSecurityContext 中都存在一些字段。
  当两者都设置时，SecurityContext 中的值优先。*

  <!--
  
  - **securityContext.runAsUser** (int64)

    The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.runAsNonRoot** (boolean)

    Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.

  - **securityContext.runAsGroup** (int64)

    The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.readOnlyRootFilesystem** (boolean)

    Whether this container has a read-only root filesystem. Default is false. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.procMount** (string)

    procMount denotes the type of proc mount to use for the containers. The default is DefaultProcMount which uses the container runtime defaults for readonly paths and masked paths. This requires the ProcMountType feature flag to be enabled. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.privileged** (boolean)

    Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host. Defaults to false. Note that this field cannot be set when spec.os.name is windows.

  - **securityContext.allowPrivilegeEscalation** (boolean)

    AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process. This bool directly controls if the no_new_privs flag will be set on the container process. AllowPrivilegeEscalation is true always when the container is: 1) run as Privileged 2) has CAP_SYS_ADMIN Note that this field cannot be set when spec.os.name is windows.
  -->
  - **securityContext.runAsUser** (int64)

    运行容器进程入口点的 UID。
    如果未指定，则默认为镜像元数据中指定的用户。
    也可以在 PodSecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。
    注意，spec.os.name 为 windows 时不能设置该字段。

  - **securityContext.runAsNonRoot**（boolean）

    指示容器必须以非 root 用户身份运行。
    如果为 true，Kubelet 将在运行时验证镜像，以确保它不会以 UID 0（root）身份运行，如果是，则无法启动容器。
    如果未设置或为 false，则不会执行此类验证。
    也可以在 PodSecurityContext 中设置。如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。

  - **securityContext.runAsGroup** (int64)

    运行容器进程入口点的 GID。
    如果未设置，则使用运行时默认值。
    也可以在 PodSecurityContext 中设置。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。
    注意，spec.os.name 为 windows 时不能设置该字段。

  - **securityContext.readOnlyRootFilesystem**（boolean）

    此容器是否具有只读根文件系统。
    默认为假。注意，spec.os.name 为 windows 时不能设置该字段。

  - **securityContext.procMount**（string）

    procMount 表示用于容器的 proc 挂载类型。默认值为 DefaultProcMount，它将容器运行时默认值用于只读路径和掩码路径。这需要启用 ProcMountType 功能标志。注意，spec.os.name 为 windows 时不能设置该字段。

  - **securityContext.privileged**（boolean）

    以特权模式运行容器。特权容器中的进程本质上等同于主机上的 root。默认为 false。
    注意，spec.os.name 为 windows 时不能设置该字段。

  - **securityContext.allowPrivilegeEscalation**（boolean）

    AllowPrivilegeEscalation 控制进程是否可以获得比其父进程更多的权限。
    此布尔值直接控制是否在容器进程上设置 no_new_privs 标志。 AllowPrivilegeEscalation 在容器处于以下状态时始终为 true： 1) 以特权身份运行 2) 具有 CAP_SYS_ADMIN 
    请注意，当 spec.os.name 为 windows 时，无法设置此字段。
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
   - **securityContext.capabilities**（Capabilities）

    运行容器时添加/删除的功能。
    默认为容器运行时授予的默认功能集。注意，spec.os.name 为 windows 时不能设置该字段。

    <a name="Capabilities"></a>
    *在正在运行的容器中添加和删除 POSIX 功能。*

    - **securityContext.capabilities.add** ([]string)

      新增功能

    - **securityContext.capabilities.drop** ([]string)

      删除的功能

<!--
  - **securityContext.seccompProfile** (SeccompProfile)

    The seccomp options to use by this container. If seccomp options are provided at both the pod & container level, the container options override the pod options. Note that this field cannot be set when spec.os.name is windows.

    <a name="SeccompProfile"></a>
    *SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.*

    - **securityContext.seccompProfile.type** (string), required

      type indicates which kind of seccomp profile will be applied. Valid options are:
      
      Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.
      
      

    - **securityContext.seccompProfile.localhostProfile** (string)

      localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must only be set if type is "Localhost".
-->
  - **securityContext.seccompProfile** (SeccompProfile)

    此容器使用的 seccomp 选项。如果在 Pod 和容器级别都提供了 seccomp 选项，则容器选项会覆盖 Pod 选项。
    注意，spec.os.name 为 windows 时不能设置该字段。

    <a name="SeccompProfile"></a>
    *SeccompProfile 定义 Pod/容器的 seccomp 配置文件设置。只能设置一个配置文件源。*

    - **securityContext.seccompProfile.type**（string），必需

      type 指示将应用哪种 seccomp 配置文件。有效的选项是：
      
      Localhost - 应使用在节点上的文件中定义的配置文件。 RuntimeDefault - 应使用容器运行时默认配置文件。
      Unconfined - 不应应用任何配置文件。
      
      

    - **securityContext.seccompProfile.localhostProfile**（string）

      localhostProfile 指示应使用在节点上的文件中定义的配置文件。该配置文件必须在节点上预先配置才能工作。
      必须是相对于 kubelet 配置的 seccomp 配置文件位置的下降路径。
      仅当类型为 "Localhost" 时才必须设置。

<!--
 - **securityContext.seLinuxOptions** (SELinuxOptions)

    The SELinux context to be applied to the container. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.

    <a name="SELinuxOptions"></a>
    *SELinuxOptions are the labels to be applied to the container*

    - **securityContext.seLinuxOptions.level** (string)

      Level is SELinux level label that applies to the container.

    - **securityContext.seLinuxOptions.role** (string)

      Role is a SELinux role label that applies to the container.

    - **securityContext.seLinuxOptions.type** (string)

      Type is a SELinux type label that applies to the container.

    - **securityContext.seLinuxOptions.user** (string)

      User is a SELinux user label that applies to the container.
-->
   - **securityContext.seLinuxOptions** (SELinuxOptions)

    要应用于容器的 SELinux 上下文。
    如果未指定，容器运行时将为每个容器分配一个随机 SELinux 上下文。也可以在 PodSecurityContext 中设置。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。
    注意，spec.os.name 为 windows 时不能设置该字段。

    <a name="SELinuxOptions"></a>
    *SELinuxOptions 是要应用于容器的标签*

    - **securityContext.seLinuxOptions.level**（string）

      Level 是应用于容器的 SELinux 级别标签。

    - **securityContext.seLinuxOptions.role**（string）

      Role 是应用于容器的 SELinux 角色标签。

    - **securityContext.seLinuxOptions.type**（string）

      Type 是适用于容器的 SELinux 类型标签。

    - **securityContext.seLinuxOptions.user**（string）

      User 是应用于容器的 SELinux 用户标签。
<!--

  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    The Windows specific settings applied to all containers. If unspecified, the options from the PodSecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions contain Windows-specific options and credentials.*

    - **securityContext.windowsOptions.gmsaCredentialSpec** (string)

      GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.

    - **securityContext.windowsOptions.gmsaCredentialSpecName** (string)

      GMSACredentialSpecName is the name of the GMSA credential spec to use.

    - **securityContext.windowsOptions.hostProcess** (boolean)

      HostProcess determines if a container should be run as a 'Host Process' container. This field is alpha-level and will only be honored by components that enable the WindowsHostProcessContainers feature flag. Setting this field without the feature flag will result in errors when validating the Pod. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers).  In addition, if HostProcess is true then HostNetwork must also be set to true.

    - **securityContext.windowsOptions.runAsUserName** (string)

      The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
-->
  - **securityContext.windowsOptions** (WindowsSecurityContextOptions)

    适用于所有容器的 Windows 特定设置。
    如果未指定，将使用 PodSecurityContext 中的选项。
    如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。
    注意，spec.os.name 为 linux 时不能设置该字段。

    <a name="WindowsSecurityContextOptions"></a>
    *WindowsSecurityContextOptions 包含特定于 Windows 的选项和凭据。*

    - **securityContext.windowsOptions.gmsaCredentialSpec**（string）

      GMSACredentialSpec 是 GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) 内嵌由 GMSACredentialSpecName 字段命名的 GMSA 凭证规范内容的地方。

    - **securityContext.windowsOptions.gmsaCredentialSpecName**（string）

      GMSACredentialSpecName 是要使用的 GMSA 凭证规范的名称。

    - **securityContext.windowsOptions.hostProcess**（boolean）

      HostProcess 确定容器是否应作为“主机进程”容器运行。此字段是 alpha 级别的，只有启用 WindowsHostProcessContainers 功能标志的组件才会使用。
      在验证 Pod 时设置此字段而不使用功能标志将导致错误。
      一个 Pod 的所有容器必须具有相同的有效 HostProcess 值（不允许有 HostProcess 容器和非 HostProcess 容器的混合）。
      此外，如果 HostProcess 为 true，则 HostNetwork 也必须设置为 true。

    - **securityContext.windowsOptions.runAsUserName**（string）

      Windows 中运行容器进程入口点的用户名。
      如果未指定，则默认为图像元数据中指定的用户。
      也可以在 PodSecurityContext 中设置。
      如果同时在 SecurityContext 和 PodSecurityContext 中设置，则在 SecurityContext 中指定的值优先。

### Not allowed

<!--
- **ports** ([]ContainerPort)

  *Patch strategy: merge on key `containerPort`*
  
  *Map: unique values on keys `containerPort, protocol` will be kept during a merge*
  
  Ports are not allowed for ephemeral containers.

  <a name="ContainerPort"></a>
  *ContainerPort represents a network port in a single container.*
-->
- **prot**（[]ContainerPort）

  *补丁策略：根据键 `containerPort`上合并*
  
  *映射：键 `containerPort, protocol` 的唯一值将在合并期间保留*
  
  临时容器不允许使用端口。

  <a name="ContainerPort"></a>
  *ContainerPort 表示单个容器中的网络端口。*

<!--

  - **ports.containerPort** (int32), required

    Number of port to expose on the pod's IP address. This must be a valid port number, 0 \< x \< 65536.

  - **ports.hostIP** (string)

    What host IP to bind the external port to.

  - **ports.hostPort** (int32)

    Number of port to expose on the host. If specified, this must be a valid port number, 0 \< x \< 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.

  - **ports.name** (string)

    If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.

  - **ports.protocol** (string)

    Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".
-->
  - **ports.containerPort** (int32)，必需

    要在 pod 的 IP 地址上公开的端口数。
    这必须是有效的端口号，0 \< x \< 65536。

  - **ports.hostIP**（string）

    绑定外部端口的主机 IP。

  - **ports.hostPort** (int32)

    要在主机上公开的端口数。
    如果指定，这必须是一个有效的端口号，0 \< x \< 65536。
    如果指定了 HostNetwork，这必须与 ContainerPort 匹配。
    大多数容器不需要这个。

  - **ports.name**（字符串）

    如果指定，这必须是 IANA_SVC_NAME 并且在 pod 中是唯一的。
    Pod 中的每个命名端口都必须具有唯一的名称。
    服务可以引用的端口的名称。

  - **ports.protocol**（字符串）

    端口协议。必须是 UDP、TCP 或 SCTP。默认为 "TCP"。
<!--
- **resources** (ResourceRequirements)

  Resources are not allowed for ephemeral containers. Ephemeral containers use spare resources already allocated to the pod.

  <a name="ResourceRequirements"></a>
  *ResourceRequirements describes the compute resource requirements.*

  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
-->
  - **resources**（ResourceRequirements）

   临时容器不允许使用资源。
   临时容器使用已分配给 Pod 的备用资源。

   <a name="ResourceRequirements"></a>
   *ResourceRequirements 描述了计算资源要求。*

   - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">数量</a>)

     限制描述了允许的最大计算资源量。
     更多信息：https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

   - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">数量</a>)

     请求描述了所需的最小计算资源量。
     如果容器省略了 Requests，如果明确指定，则默认为 Limits，否则为实现定义的值。
     更多信息：https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
<!--
- **lifecycle** (Lifecycle)

  Lifecycle is not allowed for ephemeral containers.

  <a name="Lifecycle"></a>
  *Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted.*

  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PreStop is called immediately before a container is terminated due to an API request or management event such as liveness/startup probe failure, preemption, resource contention, etc. The handler is not called if the container crashes or exits. The Pod's termination grace period countdown begins before the PreStop hook is executed. Regardless of the outcome of the handler, the container will eventually terminate within the Pod's termination grace period (unless delayed by finalizers). Other management of the container blocks until the hook completes or until the termination grace period is reached. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

-->

 - **lifecycle**（lifecycle）

  临时容器不允许使用生命周期。

  <a name="lifecycle"></a>
  *生命周期描述了管理系统为响应容器生命周期事件应采取的行动。对于 PostStart 和 PreStop 生命周期处理程序，容器的管理会阻塞，直到操作完成，除非容器进程失败，在这种情况下处理程序被中止。*

  - **lifecycle.postStart** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    创建容器后立即调用 PostStart。
    如果处理程序失败，则容器将根据其重新启动策略终止并重新启动。
    容器的其他管理阻塞直到钩子完成。
    更多信息：https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

  - **lifecycle.preStop** (<a href="{{< ref "../workload-resources/pod-v1#LifecycleHandler" >}}">LifecycleHandler</a>)

    PreStop 在容器因 API 请求或管理事件（例如：liveness/startup 探针失败、抢占、资源争用等）而终止之前立即调用。如果容器崩溃或退出，则不会调用处理程序。
    Pod 的终止宽限期倒计时在 PreStop 钩子执行之前开始。
    无论处理程序的结果如何，容器最终都会在 Pod 的终止宽限期内终止（除非被终结器延迟）。
    容器的其他管理会阻塞，直到钩子完成或达到终止宽限期。
    更多信息：https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

<!--
- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Probes are not allowed for ephemeral containers.

- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Probes are not allowed for ephemeral containers.

- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

  Probes are not allowed for ephemeral containers.
-->
- **livenessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

   临时容器不允许使用探针。

- **readinessProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

   临时容器不允许使用探针。

- **startupProbe** (<a href="{{< ref "../workload-resources/pod-v1#Probe" >}}">Probe</a>)

   临时容器不允许使用探针。

## LifecycleHandler {#LifecycleHandler}

<!--
LifecycleHandler defines a specific action that should be taken in a lifecycle hook. One and only one of the fields, except TCPSocket must be specified.
-->
LifecycleHandler 定义了应在生命周期挂钩中执行的特定操作。
必须指定一个且只有一个字段，TCPSocket 除外。

<hr>

<!--
- **exec** (ExecAction)

  Exec specifies the action to take.

  <a name="ExecAction"></a>
  *ExecAction describes a "run in container" action.*

  - **exec.command** ([]string)

    Command is the command line to execute inside the container, the working directory for the command  is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.
-->
- **exec**（ExecAction）

   Exec 指定要执行的操作。

   <a name="ExecAction"></a>
   *ExecAction 描述了 “在容器中运行” 操作。*

   - **exec.command** ([]string)

     命令是要在容器内执行的命令行，命令的工作目录是容器文件系统中的根目录（'/'）。
     该命令只是 exec'd，它不在 shell 内运行，因此传统的 shell 指令（'|'等）将不起作用。
     要使用 shell，您需要显式调用该 shell。
     退出状态 0 被视为活动/健康，非零表示不健康。

<!--
- **httpGet** (HTTPGetAction)

  HTTPGet specifies the http request to perform.

  <a name="HTTPGetAction"></a>
  *HTTPGetAction describes an action based on HTTP Get requests.*

  - **httpGet.port** (IntOrString), required

    Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*

  - **httpGet.host** (string)

    Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.

  - **httpGet.httpHeaders** ([]HTTPHeader)

    Custom headers to set in the request. HTTP allows repeated headers.

    <a name="HTTPHeader"></a>
    *HTTPHeader describes a custom header to be used in HTTP probes*

    - **httpGet.httpHeaders.name** (string), required

      The header field name

    - **httpGet.httpHeaders.value** (string), required

      The header field value

  - **httpGet.path** (string)

    Path to access on the HTTP server.

  - **httpGet.scheme** (string)

    Scheme to use for connecting to the host. Defaults to HTTP.
-->
- **httpGet** (HTTPGetAction)

  HTTPGet 指定要执行的 http 请求。

  <a name="HTTPGetAction"></a>
  *HTTPGetAction 描述基于 HTTP Get 请求的操作。*

  - **httpGet.port** (IntOrString)，必填

    容器上要访问的端口的名称或编号。编号必须在 1 到 65535 的范围内。名称必须是 IANA_SVC_NAME。

    <a name="IntOrString"></a>
    *IntOrString 是一种可以保存 int32 或 string 的类型。在 JSON 或 YAML 编组和解组中使用时，它会生成或使用内部类型。例如，这允许您拥有一个可以接受名称或数字的 JSON 字段。*

  - **httpGet.host**（string）

    要连接的主机名，默认为 Pod IP。您可能想在 httpHeaders 中设置 "Host"。

  - **httpGet.httpHeaders** ([]HTTPHeader)

    要在请求中设置的自定义标头。 HTTP 允许重复的标头。

    <a name="HTTPHeader"></a>
    *HTTPHeader 描述了在 HTTP 探测中使用的自定义标头*

    - **httpGet.httpHeaders.name**（string），必填

      头域名称

    - **httpGet.httpHeaders.value**（string），必填

      头域值

  - **httpGet.path**（string）

    HTTP 服务器上的访问路径。

  - **httpGet.scheme**（string）

    用于连接到主机的方案。默认为 HTTP。

<!--
- **tcpSocket** (TCPSocketAction)

  Deprecated. TCPSocket is NOT supported as a LifecycleHandler and kept for the backward compatibility. There are no validation of this field and lifecycle hooks will fail in runtime when tcp handler is specified.

  <a name="TCPSocketAction"></a>
  *TCPSocketAction describes an action based on opening a socket*

  - **tcpSocket.port** (IntOrString), required

    Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*

  - **tcpSocket.host** (string)

    Optional: Host name to connect to, defaults to the pod IP.
-->
- **tcpSocket** (TCPSocketAction)

   已弃用。TCPSocket 不支持作为 LifecycleHandler 并保留为向后兼容。
   当指定 tcp 处理程序时，此字段没有验证，并且生命周期挂钩将在运行时失败。

   <a name="TCPSocketAction"></a>
   *TCPSocketAction 描述基于打开套接字的动作*

   - **tcpSocket.port** (IntOrString)，必需

     容器上要访问的端口的编号或名称。 编号必须在 1 到 65535 的范围内。名称必须是 IANA_SVC_NAME。

     <a name="IntOrString"></a>
     *IntOrString 是一种可以保存 int32 或 string 的类型。
     在 JSON 或 YAML 编组和解组中使用时，它会生成或使用内部类型。
     例如，这允许您拥有一个可以接受名称或数字的 JSON 字段。*

   - **tcpSocket.host**（string）

     可选：要连接的主机名，默认为 Pod IP。

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

  - **preferredDuringSchedulingIgnoredDuringExecution.preference** (NodeSelectorTerm), required

    A node selector term, associated with the corresponding weight.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's labels.

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's fields.

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), required

    Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.
-->
- **preferredDuringSchedulingIgnoredDuringExecution** ([]PreferredSchedulingTerm)

  调度程序会更倾向于将 Pod 调度到满足该字段指定的亲和性表达式的节点，但它可能会选择违反一个或多个表达式的节点。
  最优选的节点是权重总和最大的节点，即对于满足所有调度要求（资源请求、requiredDuringScheduling 亲和表达式等）的每个节点，
  通过迭代该字段的元素来计算总和如果节点匹配相应的matchExpressions，则将 “权重” 添加到总和中；
  具有最高和的节点是最优选的。

  <a name="PreferredSchedulingTerm"></a>
  *一个空的首选调度项匹配所有具有隐式权重 0 的对象（即它是一个无操作）。一个空的首选调度项不匹配任何对象（即也是一个无操作）。*

  - **preferredDuringSchedulingIgnoredDuringExecution.preference** (NodeSelectorTerm)，必需

    与相应权重相关联的节点选择器项。

    <a name="NodeSelectorTerm"></a>
    *空或空节点选择器项不匹配任何对象。他们的要求是 ANDed。TopologySelectorTerm 类型实现了 NodeSelectorTerm 的一个子集。*

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      按节点标签列出的节点选择器要求列表。

    - **preferredDuringSchedulingIgnoredDuringExecution.preference.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      按节点字段列出的节点选择器要求列表。

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32)，必需

    与匹配相应的 nodeSelectorTerm 相关的权重，范围为 1-100。
<!--

- **requiredDuringSchedulingIgnoredDuringExecution** (NodeSelector)

  If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to an update), the system may or may not try to eventually evict the pod from its node.

  <a name="NodeSelector"></a>
  *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*

  - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms** ([]NodeSelectorTerm), required

    Required. A list of node selector terms. The terms are ORed.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's labels.

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      A list of node selector requirements by node's fields.
-->

- **requiredDuringSchedulingIgnoredDuringExecution** (NodeSelector)

  如果在调度时不满足该字段指定的亲和性要求，则不会将 Pod 调度到该节点上。
  如果在 Pod 执行期间的某个时间点不再满足此字段指定的亲和性要求（例如：由于更新），
  系统可能会或可能不会尝试最终将 Pod 从其节点中逐出。

  <a name="NodeSelector"></a>
  *一个节点选择器代表一个或多个标签查询结果在一组节点上的联合；也就是说，它表示由节点选择器项表示的选择器的 OR。*

  - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms** ([]NodeSelectorTerm)，必需

    必需的。节点选择器术语列表。这些条款是 ORed。

    <a name="NodeSelectorTerm"></a>
    *空或空节点选择器项不匹配任何对象。他们的要求是ANDed。 TopologySelectorTerm 类型实现了 NodeSelectorTerm 的一个子集。*

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      按节点标签列出的节点选择器要求列表。

    - **requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      按节点字段列出的节点选择器要求列表。

## PodAntiAffinity {#PodAntiAffinity}

<!--
Pod anti affinity is a group of inter pod anti affinity scheduling rules.
-->
Pod 反亲和性是一组 Pod 间反亲和性调度规则。

<hr>

- **preferredDuringSchedulingIgnoredDuringExecution** ([]WeightedPodAffinityTerm)
<!--
  The scheduler will prefer to schedule pods to nodes that satisfy the anti-affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling anti-affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.
-->
调度器更倾向于将 Pod 调度到满足该字段指定的反亲和性表达式的节点，但它可能会选择违反一个或多个表达式的节点。 
最优选的节点是权重总和最大的节点，即对于满足所有调度要求（资源请求、requiredDuringScheduling 反亲和表达式等）的每个节点，通过遍历元素来计算总和如果节点具有与相应 podAffinityTerm 匹配的 Pod，则此字段并在总和中添加 “权重”；
具有最高和的节点是最优选的。

  <a name="WeightedPodAffinityTerm"></a>

<!--
  *The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)*
-->
  *所有匹配的 WeightedPodAffinityTerm 字段的权重都是按节点添加的，以找到最喜欢的节点*

<!--

  - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm), required

    Required. A pod affinity term, associated with the corresponding weight.

    <a name="PodAffinityTerm"></a>
    *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey** (string), required

      This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over a set of resources, in this case pods.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** ([]string)

      namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32), required

    weight associated with matching the corresponding podAffinityTerm, in the range 1-100.
-->
- **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm** (PodAffinityTerm)，必填

    必需的。一个 Pod 亲和性术语，与相应的权重相关联。

    <a name="PodAffinityTerm"></a>
    *定义一组 Pod（即那些与给定命名空间相关的 labelSelector 匹配的那些），该 Pod 应该与该 Pod 位于同一位置（亲和）或不位于同一位置（反亲和），其中定义了 co-located 运行在一个节点上，其键 <topologyKey> 的标签值与运行一组 Pod 的 Pod 的任何节点的值匹配*

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.topologyKey**（字符串），必需

      此 Pod 应与指定命名空间中与 labelSelector 匹配的 Pod 位于同一位置（亲和）或不位于同一位置（反亲和），
      其中 co-located 定义为运行在其标签值为 key topologyKey 的节点上与运行任何选定 Pod 的任何节点匹配。
      不允许使用空的 topologyKey。

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      对一组资源的标签查询，在本例中为 Pod。

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      对术语适用的命名空间集的标签查询。
      该术语应用于此字段选择的名称空间和名称空间字段中列出的名称空间的联合。
      null 选择器和 null 或空命名空间列表表示 “此 Pod 的命名空间”。
      空选择器 ({}) 匹配所有命名空间。

    - **preferredDuringSchedulingIgnoredDuringExecution.podAffinityTerm.namespaces** ([]string)

      命名空间指定该术语适用的命名空间名称的静态列表。
      该术语适用于该字段中列出的名称空间和由 namespaceSelector 选择的名称空间的联合。
      null 或空命名空间列表和 null namespaceSelector 表示 “此 pod 的命名空间”。

  - **preferredDuringSchedulingIgnoredDuringExecution.weight** (int32)，必需

    与匹配相应 podAffinityTerm 关联的权重，范围为 1-100。
<!--
- **requiredDuringSchedulingIgnoredDuringExecution** ([]PodAffinityTerm)

  If the anti-affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the anti-affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.

  <a name="PodAffinityTerm"></a>
  *Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running*

  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey** (string), required

    This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.

  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over a set of resources, in this case pods.

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces.

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** ([]string)

    namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace".
-->
- **requiredDuringSchedulingIgnoredDuringExecution** ([]PodAffinityTerm)

  如果在调度时不满足该字段指定的反亲和要求，则该 Pod 不会被调度到该节点上。
  如果在 Pod 执行期间的某个时间点不再满足此字段指定的反关联性要求（例如：由于 Pod 标签更新），系统可能会或可能不会尝试最终将 Pod 从其节点中逐出。
  当有多个元素时，每个 podAffinityTerm 对应的节点列表是相交的，即必须满足所有条件。

  <a name="PodAffinityTerm"></a>
  *定义一组 Pod（即那些与给定命名空间相关的 labelSelector 匹配的那些），该 Pod 应该与该 Pod 位于同一位置（亲和）或不位于同一位置（反亲和），其中定义了 co-located运行在一个节点上，其键 <topologyKey> 的标签值与运行一组 Pod 的 Pod 的任何节点的值匹配*

  - **requiredDuringSchedulingIgnoredDuringExecution.topologyKey**（string），必需

    此 Pod 应与指定命名空间中与 labelSelector 匹配的 Pod 位于同一位置（亲和）或不位于同一位置（反亲和），其中 co-located 定义为运行在其标签值为 key topologyKey 的节点上与运行任何选定 Pod 的任何节点匹配。不允许使用空的 topologyKey。

  - **requiredDuringSchedulingIgnoredDuringExecution.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    对一组资源的标签查询，在本例中为 Pod。

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    对术语适用的命名空间集的标签查询。
    该术语应用于此字段选择的名称空间和名称空间字段中列出的名称空间的联合。 
    null 选择器和 null 或空命名空间列表表示“此 Pod 的命名空间”。空选择器 ({}) 匹配所有命名空间。

  - **requiredDuringSchedulingIgnoredDuringExecution.namespaces** ([]string)

    namespaces 指定该术语适用的命名空间名称的静态列表。
    该术语适用于该字段中列出的名称空间和由 namespaceSelector 选择的名称空间的联合。
    null 或空命名空间列表和 null namespaceSelector 表示“此 Pod 的命名空间”。

## Probe {#Probe}

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

  - **exec.command** ([]string)

    Command is the command line to execute inside the container, the working directory for the command  is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.

-->
- **exec**（ExecAction）

   Exec 指定要执行的操作。

   <a name="ExecAction"></a>
   *ExecAction 描述了 “在容器中运行” 操作。*

   - **exec.command** ([]string)

     命令是要在容器内执行的命令行，命令的工作目录是容器文件系统中的根目录（'/'）。
     该命令只是执行，它不在 shell 内运行，因此传统的 shell 指令（'|'等）将不起作用。
     要使用 shell，您需要显式调用该 shell。
     退出状态 0 被视为活动/健康，非零表示不健康。

<!--
- **httpGet** (HTTPGetAction)

  HTTPGet specifies the http request to perform.

  <a name="HTTPGetAction"></a>
  *HTTPGetAction describes an action based on HTTP Get requests.*

  - **httpGet.port** (IntOrString), required

    Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*

  - **httpGet.host** (string)

    Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.

  - **httpGet.httpHeaders** ([]HTTPHeader)

    Custom headers to set in the request. HTTP allows repeated headers.

    <a name="HTTPHeader"></a>
    *HTTPHeader describes a custom header to be used in HTTP probes*

    - **httpGet.httpHeaders.name** (string), required

      The header field name

    - **httpGet.httpHeaders.value** (string), required

      The header field value

  - **httpGet.path** (string)

    Path to access on the HTTP server.

  - **httpGet.scheme** (string)

    Scheme to use for connecting to the host. Defaults to HTTP.
-->
- **httpGet** (HTTPGetAction)

  HTTPGet 指定要执行的 http 请求。

  <a name="HTTPGetAction"></a>
  *HTTPGetAction 描述基于 HTTP Get 请求的操作。*

  - **httpGet.port** (IntOrString)，必填

    容器上要访问的端口的名称或编号。编号必须在 1 到 65535 的范围内。名称必须是 IANA_SVC_NAME。

    <a name="IntOrString"></a>
    *IntOrString 是一种可以保存 int32 或字符串的类型。在 JSON 或 YAML 编组和解组中使用时，它会生成或使用内部类型。例如，这允许您拥有一个可以接受名称或数字的 JSON 字段。*

  - **httpGet.host**（字符串）

    要连接的主机名，默认为 pod IP。您可能想在 httpHeaders 中设置“主机”。

  - **httpGet.httpHeaders** ([]HTTPHeader)

    要在请求中设置的自定义标头。 HTTP 允许重复的标头。

    <a name="HTTPHeader"></a>
    *HTTPHeader 描述了在 HTTP 探测中使用的自定义标头*

    - **httpGet.httpHeaders.name**（string），必填

      头域名称

    - **httpGet.httpHeaders.value**（string），必填

      头域值

  - **httpGet.path**（string）

    HTTP 服务器上的访问路径。

  - **httpGet.scheme**（string）

    用于连接到主机的方案。默认为 HTTP。

<!--
  

- **tcpSocket** (TCPSocketAction)

  TCPSocket specifies an action involving a TCP port.

  <a name="TCPSocketAction"></a>
  *TCPSocketAction describes an action based on opening a socket*

  - **tcpSocket.port** (IntOrString), required

    Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*

  - **tcpSocket.host** (string)

    Optional: Host name to connect to, defaults to the pod IP.
-->

- **tcpSocket** (TCPSocketAction)

   TCPSocket 指定涉及 TCP 端口的操作。

   <a name="TCPSocketAction"></a>
   *TCPSocketAction 描述基于打开套接字的动作*

   - **tcpSocket.port** (IntOrString)，必需

     容器上要访问的端口的编号或名称。 编号必须在 1 到 65535 的范围内。名称必须是 IANA_SVC_NAME。

     <a name="IntOrString"></a>
     *IntOrString 是一种可以保存 int32 或 string 的类型。 在 JSON 或 YAML 编组和解组中使用时，它会生成或使用内部类型。 例如，这允许您拥有一个可以接受名称或数字的 JSON 字段。*

   - **tcpSocket.host**（string）

     可选：要连接的主机名，默认为 Pod IP。
<!--

- **initialDelaySeconds** (int32)

  Number of seconds after the container has started before liveness probes are initiated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **terminationGracePeriodSeconds** (int64)

  Optional duration in seconds the pod needs to terminate gracefully upon probe failure. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. If this value is nil, the pod's terminationGracePeriodSeconds will be used. Otherwise, this value overrides the value provided by the pod spec. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). This is a beta field and requires enabling ProbeTerminationGracePeriod feature gate. Minimum value is 1. spec.terminationGracePeriodSeconds is used if unset.

- **periodSeconds** (int32)

  How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1.

- **timeoutSeconds** (int32)

  Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **failureThreshold** (int32)

  Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.

- **successThreshold** (int32)

  Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1.

-->

- **initialDelaySeconds** (int32)

  容器启动后启动活动探测之前的秒数。
  更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **terminationGracePeriodSeconds** (int64)

  Pod 需要在探测失败时正常终止的可选持续时间（以秒为单位）。
  宽限期是 Pod 中运行的进程收到终止信号后的持续时间（以秒为单位），以及进程被终止信号强制停止的时间。
  将此值设置为比您的进程的预期清理时间更长。
  如果此值为 nil，则将使用 Pod 的 terminateGracePeriodSeconds。
  否则，此值将覆盖 Pod 规范提供的值。值必须是非负整数。
  零值表示通过终止信号立即停止（没有机会关闭）。
  这是一个 beta 字段，需要启用 ProbeTerminationGracePeriod 功能门。最小值为 1。
  如果未设置，则使用 spec.terminationGracePeriodSeconds。

- **periodSeconds** (int32)

  执行探测的频率（以秒为单位）。默认为 10 秒。最小值为 1。

- **timeoutSeconds** (int32)

  探测超时的秒数。默认为 1 秒。最小值为 1。更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

- **failureThreshold** (int32)

  探测成功后被视为失败的最小连续失败次数。默认为 3。最小值为 1。

- **successThreshold** (int32)

  探测失败后被视为成功的最小连续成功次数。默认为 1。活性和启动必须为 1。最小值为 1。

<!--
- **grpc** (GRPCAction)

  GRPC specifies an action involving a GRPC port. This is a beta field and requires enabling GRPCContainerProbe feature gate.

  <a name="GRPCAction"></a>
  **

  - **grpc.port** (int32), required

    Port number of the gRPC service. Number must be in the range 1 to 65535.

  - **grpc.service** (string)

    Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).
    
    If this is not specified, the default behavior is defined by gRPC.

-->

- **grpc** (GRPCAction)

   GRPC 指定涉及 GRPC 端口的操作。
   这是一个 beta 字段，需要启用 GRPCContainerProbe 功能门。

   <a name="GRPCAction"></a>
   **

   - **grpc.port** (int32)，必需

     gRPC 服务的端口号。 数字必须在 1 到 65535 的范围内。

   - **grpc.service**（string）

     Service 是放置在 gRPC HealthCheckRequest 中的服务的名称（请参阅 https://github.com/grpc/grpc/blob/master/doc/health-checking.md）。
    
     如果未指定，则默认行为由 gRPC 定义。

## PodStatus {#PodStatus}
<!--
PodStatus represents information about the status of a pod. Status may trail the actual state of a system, especially if the node that hosts the pod cannot contact the control plane.
-->
PodStatus 表示有关 Pod 状态的信息。
状态可能会跟踪系统的实际状态，尤其是在托管 Pod 的节点无法联系控制平面的情况下。

<hr>

<!--
- **nominatedNodeName** (string)

  nominatedNodeName is set only when this pod preempts other pods on the node, but it cannot be scheduled right away as preemption victims receive their graceful termination periods. This field does not guarantee that the pod will be scheduled on this node. Scheduler may decide to place the pod elsewhere if other nodes become available sooner. Scheduler may also decide to give the resources on this node to a higher priority pod that is created after preemption. As a result, this field may be different than PodSpec.nodeName when the pod is scheduled.

- **hostIP** (string)

  IP address of the host to which the pod is assigned. Empty if not yet scheduled.

- **startTime** (Time)

  RFC 3339 date and time at which the object was acknowledged by the Kubelet. This is before the Kubelet pulled the container image(s) for the pod.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->
- **nominatedNodeName**（string）

  仅当此 Pod 抢占节点上的其他 Pod 时才设置指定 NodeName，但由于抢占受害者收到其优雅终止期，因此无法立即安排它。
  该字段不保证 Pod 会在该节点上调度。
  如果其他节点更快可用，调度程序可能会决定将 pod 放置在其他地方。调度程序也可能决定将此节点上的资源分配给优先级更高的 pod，该 pod 是在抢占后创建的。
  因此，当 Pod 被调度时，该字段可能与 PodSpec.nodeName 不同。

- **hostIP**（string）

  分配 pod 的主机的 IP 地址。如果尚未安排，则为空。

- **startTime**（Time）

  RFC 3339 对象被 Kubelet 确认的日期和时间。
  这是在 Kubelet 为 Pod 拉取容器镜像之前。

  <a name="Time"></a>
  *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

<!--
- **phase** (string)

  The phase of a Pod is a simple, high-level summary of where the Pod is in its lifecycle. The conditions array, the reason and message fields, and the individual container status arrays contain more detail about the pod's status. There are five possible phase values:
  
  Pending: The pod has been accepted by the Kubernetes system, but one or more of the container images has not been created. This includes time before being scheduled as well as time spent downloading images over the network, which could take a while. Running: The pod has been bound to a node, and all of the containers have been created. At least one container is still running, or is in the process of starting or restarting. Succeeded: All containers in the pod have terminated in success, and will not be restarted. Failed: All containers in the pod have terminated, and at least one container has terminated in failure. The container either exited with non-zero status or was terminated by the system. Unknown: For some reason the state of the pod could not be obtained, typically due to an error in communicating with the host of the pod.
  
  More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-phase
-->
- **phase** (string)

  Pod 的阶段是对 Pod 在其生命周期中所处位置的简单、高级摘要。条件数组、原因和消息字段以及各个容器状态数组包含有关 Pod 状态的更多详细信息。有五个可能的相位值：
  
  Pending：Pod 已被 Kubernetes 系统接受，但尚未创建一个或多个容器镜像。这包括计划之前的时间以及通过网络下载图像所花费的时间，这可能需要一段时间。
  Running：pod 已经绑定到一个节点，并且所有的容器都已经创建完毕。至少有一个容器仍在运行，或者正在启动或重新启动过程中。 Succeeded：pod 中的所有容器都已成功终止，不会重新启动。 Failed：Pod 中的所有容器都已终止，并且至少有一个容器因故障而终止。容器要么以非零状态退出，要么被系统终止。
  Unknown：由于某种原因无法获取 pod 的状态，通常是由于与 pod 的主机通信时出错。
  
  更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-phase

<!--
- **message** (string)

  A human readable message indicating details about why the pod is in this condition.

- **reason** (string)

  A brief CamelCase message indicating details about why the pod is in this state. e.g. 'Evicted'

- **podIP** (string)

  IP address allocated to the pod. Routable at least within the cluster. Empty if not yet allocated.
-->
- **message***（string）

   一条人类可读的消息，指示有关 Pod 为何处于这种情况的详细信息。

- **message***（string）

   一条简短的 CamelCase 消息，指示有关 Pod 为何处于此状态的详细信息。 例如 'Evicted'

- **podIP**（string）

   分配给 Pod 的 IP 地址。
   至少在集群内可路由。 如果尚未分配则为空。
<!--
- **podIPs** ([]PodIP)

  *Patch strategy: merge on key `ip`*
  
  podIPs holds the IP addresses allocated to the pod. If this field is specified, the 0th entry must match the podIP field. Pods may be allocated at most 1 value for each of IPv4 and IPv6. This list is empty if no IPs have been allocated yet.

  <a name="PodIP"></a>
  *IP address information for entries in the (plural) PodIPs field. Each entry includes:
     IP: An IP address allocated to the pod. Routable at least within the cluster.*

  - **podIPs.ip** (string)

    ip is an IP address (IPv4 or IPv6) assigned to the pod
-->
- **podIPs** ([]PodIP)

   *补丁策略：根据键 `ip`上合并*
  
   podIPs 保存分配给 pod 的 IP 地址。 如果指定了该字段，则第 0 个条目必须与 podIP 字段匹配。 Pod 最多可以为 IPv4 和 IPv6 分配 1 个值。 如果尚未分配 IP，则此列表为空。

   <a name="PodIP"></a>
   *（复数）PodIPs 字段中条目的 IP 地址信息。 每个条目包括：
      IP：分配给 Pod 的 IP 地址。 至少在集群内可路由。*

   - **podIPs.ip**（string）

     ip 是分配给 Pod 的 IP 地址（IPv4 或 IPv6）

<!--
- **conditions** ([]PodCondition)

  *Patch strategy: merge on key `type`*
  
  Current service state of pod. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  <a name="PodCondition"></a>
  *PodCondition contains details for the current condition of this pod.*
-->

- **conditions** ([]PodCondition)

   *补丁策略：根据键 `ip`上合并*
  
   Pod 的当前服务状态。 更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

   <a name="PodCondition"></a>
   *PodCondition 包含此 Pod 当前状况的详细信息。*

<!--
  - **conditions.status** (string), required

    Status is the status of the condition. Can be True, False, Unknown. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  - **conditions.type** (string), required

    Type is the type of the condition. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  - **conditions.lastProbeTime** (Time)

    Last time we probed the condition.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.lastTransitionTime** (Time)

    Last time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.message** (string)

    Human-readable message indicating details about last transition.

  - **conditions.reason** (string)

    Unique, one-word, CamelCase reason for the condition's last transition.
-->
   - **conditions.status**（string），必填

    状态是条件的状态。可以是 True、False、Unknown。更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  - **conditions.type**（string），必填

    类型是条件的类型。更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions

  - **conditions.lastProbeTime**（Time）

    上次我们调查了情况。

    <a name="Time"></a>
    *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

  - **conditions.lastTransitionTime**（Time）

    上次条件从一种状态转换到另一种状态的时间。

    <a name="Time"></a>
    *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

  - **conditions.message**（string）

    指示有关上次转换的详细信息的人类可读消息。

  - **conditions.reason**（string）

    条件最后一次转换的唯一、一个单词、CamelCase 原因。
<!--
- **qosClass** (string)

  The Quality of Service (QOS) classification assigned to the pod based on resource requirements See PodQOSClass type for available QOS classes More info: https://git.k8s.io/design-proposals-archive/node/resource-qos.md
-->
- **qosClass**（string）

   根据资源要求分配给 Pod 的服务质量 (QOS) 分类有关可用的 QOS 类，请参阅 PodQOSClass 类型。
   更多信息：https://git.k8s.io/design-proposals-archive/node/resource-qos.md
<!--
- **initContainerStatuses** ([]ContainerStatus)

  The list has one entry per init container in the manifest. The most recent successful init container will have ready = true, the most recently started container will have startTime set. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

  <a name="ContainerStatus"></a>
  *ContainerStatus contains details for the current status of this container.*
-->
- **initContainerStatus** ([]ContainerStatus)

   该列表在清单中的每个初始化容器中都有一个条目。
   最近成功的 init 容器将设置为 ready = true，最近启动的容器将设置 startTime。
   更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

   <a name="ContainerStatus"></a>
   *ContainerStatus 包含此容器当前状态的详细信息。*

<!--
  - **initContainerStatuses.name** (string), required

    This must be a DNS_LABEL. Each container in a pod must have a unique name. Cannot be updated.

  - **initContainerStatuses.image** (string), required

    The image the container is running. More info: https://kubernetes.io/docs/concepts/containers/images.

  - **initContainerStatuses.imageID** (string), required

    ImageID of the container's image.

  - **initContainerStatuses.containerID** (string)

    Container's ID in the format '\<type>://\<container_id>'.
-->
- **initContainerStatus** ([]ContainerStatus)

   该列表在清单中的每个初始化容器中都有一个条目。 最近成功的 init 容器将设置为 ready = true，最近启动的容器将设置 startTime。 更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

   <a name="ContainerStatus"></a>
   *ContainerStatus 包含此容器当前状态的详细信息。*

   - **initContainerStatuses.name**（string），必需

     这必须是 DNS_LABEL。
     Pod 中的每个容器都必须具有唯一的名称。无法更新。

   - **initContainerStatuses.image**（string），必需

     容器正在运行的图像。 更多信息：https://kubernetes.io/docs/concepts/containers/images。

   - **initContainerStatuses.imageID**（string），必需

     容器镜像的镜像 ID。

   - **initContainerStatuses.containerID**（string）

     格式为 '\<type>://\<container_id>' 的容器ID。
<!--

  - **initContainerStatuses.state** (ContainerState)

    Details about the container's current condition.

    <a name="ContainerState"></a>
    *ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.*

    - **initContainerStatuses.state.running** (ContainerStateRunning)

      Details about a running container

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning is a running state of a container.*

      - **initContainerStatuses.state.running.startedAt** (Time)

        Time at which the container was last (re-)started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->
  - **initContainerStatuses.state** (ContainerState)

     有关容器当前状况的详细信息。

     <a name="ContainerState"></a>
     *ContainerState 保存容器的可能状态。只能指定其成员之一。 如果没有指定，则默认为 ContainerStateWaiting。*

     - **initContainerStatuses.state.running** (ContainerStateRunning)

       有关正在运行的容器的详细信息

       <a name="ContainerStateRunning"></a>
       *ContainerStateRunning 是容器的运行状态。*

       - **initContainerStatuses.state.running.startedAt**（Time）

         容器上次（重新）启动的时间

         <a name="Time"></a>
         *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*
<!--
    - **initContainerStatuses.state.terminated** (ContainerStateTerminated)

      Details about a terminated container

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated is a terminated state of a container.*

      - **initContainerStatuses.state.terminated.containerID** (string)

        Container's ID in the format '\<type>://\<container_id>'

      - **initContainerStatuses.state.terminated.exitCode** (int32), required

        Exit status from the last termination of the container

      - **initContainerStatuses.state.terminated.startedAt** (Time)

        Time at which previous execution of the container started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **initContainerStatuses.state.terminated.finishedAt** (Time)

        Time at which the container last terminated

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **initContainerStatuses.state.terminated.message** (string)

        Message regarding the last termination of the container

      - **initContainerStatuses.state.terminated.reason** (string)

        (brief) reason from the last termination of the container

      - **initContainerStatuses.state.terminated.signal** (int32)

        Signal from the last termination of the container
-->
  - **initContainerStatuses.state.terminated** (ContainerStateTerminated)

      有关已终止容器的详细信息

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated 是容器的终止状态。*

      - **initContainerStatuses.state.terminated.containerID**（string）

        格式为 '\<type>://\<container_id>' 的容器 ID

      - **initContainerStatuses.state.terminated.exitCode** (int32)，必需

        容器最后终止的退出状态

      - **initContainerStatuses.state.terminated.startedAt**（Time）

        容器先前执行的开始时间

        <a name="Time"></a>
        *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

      - **initContainerStatuses.state.terminated.finishedAt**（Time）

        容器最后终止的时间

        <a name="Time"></a>
        *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

      - **initContainerStatuses.state.terminated.message**（string）

        关于容器最后终止的消息

      - **initContainerStatuses.state.terminated.reason**（string）

        （简要）容器最后终止的原因

      - **initContainerStatuses.state.terminated.signal** (int32)

        来自容器最后终止的信号
<!--
    - **initContainerStatuses.state.waiting** (ContainerStateWaiting)

      Details about a waiting container

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting is a waiting state of a container.*

      - **initContainerStatuses.state.waiting.message** (string)

        Message regarding why the container is not yet running.

      - **initContainerStatuses.state.waiting.reason** (string)

        (brief) reason the container is not yet running.
-->
  - **initContainerStatuses.state.waiting** (ContainerStateWaiting)

       有关等待容器的详细信息

    <a name="ContainerStateWaiting"></a>
    *ContainerStateWaiting 是容器的等待状态。*

    - **initContainerStatuses.state.waiting.message**（string）

      关于容器尚未运行的原因的消息。

    - **initContainerStatuses.state.waiting.reason**（string）

      （简要）容器尚未运行的原因。
<!--
  - **initContainerStatuses.lastState** (ContainerState)

    Details about the container's last termination condition.

    <a name="ContainerState"></a>
    *ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.*
-->
  - **initContainerStatuses.lastState** (ContainerState)

     有关容器的最后终止条件的详细信息。

     <a name="ContainerState"></a>
     *ContainerState 保存容器的可能状态。只能指定其成员之一。 如果没有指定，则默认为 ContainerStateWaiting。*

<!--
    - **initContainerStatuses.lastState.running** (ContainerStateRunning)

      Details about a running container

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning is a running state of a container.*

      - **initContainerStatuses.lastState.running.startedAt** (Time)

        Time at which the container was last (re-)started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->
  - **initContainerStatuses.lastState.running** (ContainerStateRunning)

       有关正在运行的容器的详细信息

       <a name="ContainerStateRunning"></a>
       *ContainerStateRunning 是容器的运行状态。*

       - **initContainerStatuses.lastState.running.startedAt**（Time）

         容器上次（重新）启动的时间

         <a name="Time"></a>
         *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。 为 time 包提供的许多工厂方法提供了包装器。*
<!--

    - **initContainerStatuses.lastState.terminated** (ContainerStateTerminated)

      Details about a terminated container

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated is a terminated state of a container.*

      - **initContainerStatuses.lastState.terminated.containerID** (string)

        Container's ID in the format '\<type>://\<container_id>'

      - **initContainerStatuses.lastState.terminated.exitCode** (int32), required

        Exit status from the last termination of the container

      - **initContainerStatuses.lastState.terminated.startedAt** (Time)

        Time at which previous execution of the container started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **initContainerStatuses.lastState.terminated.finishedAt** (Time)

        Time at which the container last terminated

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **initContainerStatuses.lastState.terminated.message** (string)

        Message regarding the last termination of the container

      - **initContainerStatuses.lastState.terminated.reason** (string)

        (brief) reason from the last termination of the container

      - **initContainerStatuses.lastState.terminated.signal** (int32)

        Signal from the last termination of the container
-->
  - **initContainerStatuses.lastState.terminated** (ContainerStateTerminated)

      有关已终止容器的详细信息

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated 是容器的终止状态。*

      - **initContainerStatuses.lastState.terminated.containerID**（string）

        格式为 '\<type>://\<container_id>' 的容器 ID

      - **initContainerStatuses.lastState.terminated.exitCode** (int32)，必需

        容器最后终止的退出状态

      - **initContainerStatuses.lastState.terminated.startedAt**（Time）

        容器先前执行的开始时间

        <a name="Time"></a>
        *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

      - **initContainerStatuses.lastState.terminated.finishedAt**（Time）

        容器最后终止的时间

        <a name="Time"></a>
        *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

      - **initContainerStatuses.lastState.terminated.message**（string）

        关于容器最后终止的消息

      - **initContainerStatuses.lastState.terminated.reason**（string）

        （简要）容器最后终止的原因

      - **initContainerStatuses.lastState.terminated.signal** (int32)

        来自容器最后终止的信号
<!--
    - **initContainerStatuses.lastState.waiting** (ContainerStateWaiting)

      Details about a waiting container

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting is a waiting state of a container.*

      - **initContainerStatuses.lastState.waiting.message** (string)

        Message regarding why the container is not yet running.

      - **initContainerStatuses.lastState.waiting.reason** (string)

        (brief) reason the container is not yet running.
-->
  - **initContainerStatuses.lastState.waiting** (ContainerStateWaiting)

       有关等待容器的详细信息

       <a name="ContainerStateWaiting"></a>
       *ContainerStateWaiting 是容器的等待状态。*

    - **initContainerStatuses.lastState.waiting.message**（string）

      关于容器尚未运行的原因的消息。

    - **initContainerStatuses.lastState.waiting.reason**（string）

      （简要）容器尚未运行的原因。
<!--
  - **initContainerStatuses.ready** (boolean), required

    Specifies whether the container has passed its readiness probe.

  - **initContainerStatuses.restartCount** (int32), required

    The number of times the container has been restarted.

  - **initContainerStatuses.started** (boolean)

    Specifies whether the container has passed its startup probe. Initialized as false, becomes true after startupProbe is considered successful. Resets to false when the container is restarted, or if kubelet loses state temporarily. Is always true when no startupProbe is defined.
-->
   - **initContainerStatuses.ready**（boolean），必需

     指定容器是否已通过其就绪探测。

   - **initContainerStatuses.restartCount** (int32)，必需

     容器重启的次数。

   - **initContainerStatuses.started**（boolean）

     指定容器是否已通过其启动探测。
     初始化为false，startupProbe被认为成功后变为 true。
     当容器重新启动或 kubelet 暂时丢失状态时重置为 false。
     未定义 startupProbe 时始终为 true。
<!--
- **containerStatuses** ([]ContainerStatus)

  The list has one entry per container in the manifest. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

  <a name="ContainerStatus"></a>
  *ContainerStatus contains details for the current status of this container.*
-->
- **containerStatus** ([]ContainerStatus)

   该列表在清单中的每个容器都有一个条目。
   更多信息：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status

   <a name="ContainerStatus"></a>
   *ContainerStatus 包含此容器当前状态的详细信息。*
<!--
  - **containerStatuses.name** (string), required

    This must be a DNS_LABEL. Each container in a pod must have a unique name. Cannot be updated.

  - **containerStatuses.image** (string), required

    The image the container is running. More info: https://kubernetes.io/docs/concepts/containers/images.

  - **containerStatuses.imageID** (string), required

    ImageID of the container's image.

  - **containerStatuses.containerID** (string)

    Container's ID in the format '\<type>://\<container_id>'.
-->
   - **containerStatuses.name**（string），必填

     这必须是 DNS_LABEL。
     Pod 中的每个容器都必须具有唯一的名称。
     无法更新。

   - **containerStatuses.image**（string），必需

     容器正在运行的镜像。
     更多信息：https://kubernetes.io/docs/concepts/containers/images。

   - **containerStatuses.imageID**（string），必填

     容器镜像的镜像 ID。

   - **containerStatuses.containerID**（string）

     格式为 '\<type>://\<container_id>' 的容器 ID。
<!--
  - **containerStatuses.state** (ContainerState)

    Details about the container's current condition.

    <a name="ContainerState"></a>
    *ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.*

    - **containerStatuses.state.running** (ContainerStateRunning)

      Details about a running container

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning is a running state of a container.*

      - **containerStatuses.state.running.startedAt** (Time)

        Time at which the container was last (re-)started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->
   - **containerStatuses.state** (ContainerState)

     有关容器当前状况的详细信息。

     <a name="ContainerState"></a>
     *ContainerState 保存容器的可能状态。只能指定其成员之一。 如果没有指定，则默认为 ContainerStateWaiting。*

     - **containerStatuses.state.running** (ContainerStateRunning)

       有关正在运行的容器的详细信息

       <a name="ContainerStateRunning"></a>
       *ContainerStateRunning 是容器的运行状态。*

       - **containerStatuses.state.running.startedAt**（Time）

         容器上次（重新）启动的时间

         <a name="Time"></a>
         *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。 为 time 包提供的许多工厂方法提供了包装器。*

<!--
    - **containerStatuses.state.terminated** (ContainerStateTerminated)

      Details about a terminated container

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated is a terminated state of a container.*

      - **containerStatuses.state.terminated.containerID** (string)

        Container's ID in the format '\<type>://\<container_id>'

      - **containerStatuses.state.terminated.exitCode** (int32), required

        Exit status from the last termination of the container

      - **containerStatuses.state.terminated.startedAt** (Time)

        Time at which previous execution of the container started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **containerStatuses.state.terminated.finishedAt** (Time)

        Time at which the container last terminated

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **containerStatuses.state.terminated.message** (string)

        Message regarding the last termination of the container

      - **containerStatuses.state.terminated.reason** (string)

        (brief) reason from the last termination of the container

      - **containerStatuses.state.terminated.signal** (int32)

        Signal from the last termination of the container
-->
  - **containerStatuses.state.terminated** (ContainerStateTerminated)

      有关已终止容器的详细信息

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated 是容器的终止状态。*

      - **containerStatuses.state.terminated.containerID**（string）

        格式为 '\<type>://\<container_id>' 的容器 ID

      - **containerStatuses.state.terminated.exitCode** (int32)，必需

        容器最后终止的退出状态

      - **containerStatuses.state.terminated.startedAt**（Time）

        容器先前执行的开始时间

        <a name="Time"></a>
        *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

      - **containerStatuses.state.terminated.finishedAt**（Time）

        容器最后终止的时间

        <a name="Time"></a>
        *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

      - **containerStatuses.state.terminated.message**（string）

        关于容器最后终止的消息

      - **containerStatuses.state.terminated.reason**（string）

        （简要）容器最后终止的原因

      - **containerStatuses.state.terminated.signal** (int32)

        来自容器最后终止的信号
<!--
    - **containerStatuses.state.waiting** (ContainerStateWaiting)

      Details about a waiting container

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting is a waiting state of a container.*

      - **containerStatuses.state.waiting.message** (string)

        Message regarding why the container is not yet running.

      - **containerStatuses.state.waiting.reason** (string)

        (brief) reason the container is not yet running.
-->
   - **containerStatuses.state.waiting** (ContainerStateWaiting)

       有关等待容器的详细信息

       <a name="ContainerStateWaiting"></a>
       *ContainerStateWaiting 是容器的等待状态。*

       - **containerStatuses.state.waiting.message**（string）

         关于容器尚未运行的原因的消息。

       - **containerStatuses.state.waiting.reason**（string）

         （简要）容器尚未运行的原因。
<!--
  - **containerStatuses.lastState** (ContainerState)

    Details about the container's last termination condition.

    <a name="ContainerState"></a>
    *ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.*
-->
- **containerStatuses.lastState** (ContainerState)

     有关容器的最后终止条件的详细信息。

     <a name="ContainerState"></a>
     *ContainerState 保存容器的可能状态。 只能指定其成员之一。 如果没有指定，则默认为 ContainerStateWaiting。*

<!--
    - **containerStatuses.lastState.running** (ContainerStateRunning)

      Details about a running container

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning is a running state of a container.*

      - **containerStatuses.lastState.running.startedAt** (Time)

        Time at which the container was last (re-)started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->
  - **containerStatuses.lastState.running** (ContainerStateRunning)

       有关正在运行的容器的详细信息

       <a name="ContainerStateRunning"></a>
       *ContainerStateRunning 是容器的运行状态。*

       - **containerStatuses.lastState.running.startedAt**（Time）

         容器上次（重新）启动的时间

         <a name="Time"></a>
         *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*
<!--
    - **containerStatuses.lastState.terminated** (ContainerStateTerminated)

      Details about a terminated container

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated is a terminated state of a container.*
-->
  - **containerStatuses.lastState.terminated** (ContainerStateTerminated)

       有关已终止容器的详细信息

       <a name="ContainerStateTerminated"></a>
       *ContainerStateTerminated 是容器的终止状态。*

<!--

      - **containerStatuses.lastState.terminated.containerID** (string)

        Container's ID in the format '\<type>://\<container_id>'

      - **containerStatuses.lastState.terminated.exitCode** (int32), required

        Exit status from the last termination of the container

      - **containerStatuses.lastState.terminated.startedAt** (Time)

        Time at which previous execution of the container started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **containerStatuses.lastState.terminated.finishedAt** (Time)

        Time at which the container last terminated

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **containerStatuses.lastState.terminated.message** (string)

        Message regarding the last termination of the container

      - **containerStatuses.lastState.terminated.reason** (string)

        (brief) reason from the last termination of the container

      - **containerStatuses.lastState.terminated.signal** (int32)

        Signal from the last termination of the container
-->
   - **containerStatuses.lastState.terminated.containerID**（string）

        格式为 '\<type>://\<container_id>' 的容器 ID

      - **containerStatuses.lastState.terminated.exitCode** (int32)，必需

        容器最后终止的退出状态

      - **containerStatuses.lastState.terminated.startedAt**（Time）

        容器先前执行的开始时间

        <a name="Time"></a>
        *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。 *

      - **containerStatuses.lastState.terminated.finishedAt**（Time）

        容器最后终止的时间

        <a name="Time"></a>
        *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

      - **containerStatuses.lastState.terminated.message**（string）

        关于容器最后终止的消息

      - **containerStatuses.lastState.terminated.reason**（string）

        （简要）容器最后终止的原因

      - **containerStatuses.lastState.terminated.signal** (int32)

        来自容器最后终止的信号

<!--
    - **containerStatuses.lastState.waiting** (ContainerStateWaiting)

      Details about a waiting container

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting is a waiting state of a container.*

      - **containerStatuses.lastState.waiting.message** (string)

        Message regarding why the container is not yet running.

      - **containerStatuses.lastState.waiting.reason** (string)

        (brief) reason the container is not yet running.
-->
  - **containerStatuses.lastState.waiting** (ContainerStateWaiting)

       有关等待容器的详细信息

       <a name="ContainerStateWaiting"></a>
       *ContainerStateWaiting 是容器的等待状态。*

       - **containerStatuses.lastState.waiting.message**（string）

         关于容器尚未运行的原因的消息。

       - **containerStatuses.lastState.waiting.reason**（string）

         （简要）容器尚未运行的原因

<!--
  - **containerStatuses.ready** (boolean), required

    Specifies whether the container has passed its readiness probe.

  - **containerStatuses.restartCount** (int32), required

    The number of times the container has been restarted.

  - **containerStatuses.started** (boolean)

    Specifies whether the container has passed its startup probe. Initialized as false, becomes true after startupProbe is considered successful. Resets to false when the container is restarted, or if kubelet loses state temporarily. Is always true when no startupProbe is defined.
-->
   - **containerStatuses.ready**（(boolean），必需

     指定容器是否已通过其就绪探测。

   - **containerStatuses.restartCount** (int32)，必需

     容器重启的次数。

   - **containerStatuses.started**（boolean）

     指定容器是否已通过其启动探测。
     初始化为false，startupProbe 被认为成功后变为 true。
     当容器重新启动或 kubelet 暂时丢失状态时重置为 false。
     未定义 startupProbe 时始终为 true。

<!--
- **ephemeralContainerStatuses** ([]ContainerStatus)

  Status for any ephemeral containers that have run in this pod. This field is beta-level and available on clusters that haven't disabled the EphemeralContainers feature gate.

  <a name="ContainerStatus"></a>
  *ContainerStatus contains details for the current status of this container.*
-->
- **ephemeralContainerStatuses** ([]ContainerStatus)

   已在此 pod 中运行的任何临时容器的状态。
   此字段是 beta 级别的，可在尚未禁用 EphemeralContainers 功能门的集群上使用。

   <a name="ContainerStatus"></a>
   *ContainerStatus 包含此容器当前状态的详细信息。*

<!--
  - **ephemeralContainerStatuses.name** (string), required

    This must be a DNS_LABEL. Each container in a pod must have a unique name. Cannot be updated.

  - **ephemeralContainerStatuses.image** (string), required

    The image the container is running. More info: https://kubernetes.io/docs/concepts/containers/images.

  - **ephemeralContainerStatuses.imageID** (string), required

    ImageID of the container's image.

  - **ephemeralContainerStatuses.containerID** (string)

    Container's ID in the format '\<type>://\<container_id>'.
-->
  - **ephemeralContainerStatuses.name**（string），必需

     这必须是 DNS_LABEL。
     Pod 中的每个容器都必须具有唯一的名称。无法更新。

   - **ephemeralContainerStatuses.image**（string），必需

     容器正在运行的镜像。
     更多信息：https://kubernetes.io/docs/concepts/containers/images。

   - **ephemeralContainerStatuses.imageID**（string），必需

     容器镜像的镜像 ID。

   - **ephemeralContainerStatuses.containerID**（string）

     格式为 '\<type>://\<container_id>' 的容器 ID。

<!--
  - **ephemeralContainerStatuses.state** (ContainerState)

    Details about the container's current condition.

    <a name="ContainerState"></a>
    *ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.*
-->
- **ephemeralContainerStatuses.state** (ContainerState)

     有关容器当前状况的详细信息。

     <a name="ContainerState"></a>
     *ContainerState 保存容器的可能状态。 只能指定其成员之一。 如果没有指定，则默认为 ContainerStateWaiting。*

<!--
    - **ephemeralContainerStatuses.state.running** (ContainerStateRunning)

      Details about a running container

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning is a running state of a container.*

      - **ephemeralContainerStatuses.state.running.startedAt** (Time)

        Time at which the container was last (re-)started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->
  - **ephemeralContainerStatuses.state.running** (ContainerStateRunning)

       有关正在运行的容器的详细信息

       <a name="ContainerStateRunning"></a>
       *ContainerStateRunning 是容器的运行状态。*

       - **ephemeralContainerStatuses.state.running.startedAt**（时间）

         容器上次（重新）启动的时间

         <a name="Time"></a>
         *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。 为 time 包提供的许多工厂方法提供了包装器。*

<!--

    - **ephemeralContainerStatuses.state.terminated** (ContainerStateTerminated)

      Details about a terminated container

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated is a terminated state of a container.*

      - **ephemeralContainerStatuses.state.terminated.containerID** (string)

        Container's ID in the format '\<type>://\<container_id>'

      - **ephemeralContainerStatuses.state.terminated.exitCode** (int32), required

        Exit status from the last termination of the container

      - **ephemeralContainerStatuses.state.terminated.startedAt** (Time)

        Time at which previous execution of the container started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **ephemeralContainerStatuses.state.terminated.finishedAt** (Time)

        Time at which the container last terminated

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **ephemeralContainerStatuses.state.terminated.message** (string)

        Message regarding the last termination of the container

      - **ephemeralContainerStatuses.state.terminated.reason** (string)

        (brief) reason from the last termination of the container

      - **ephemeralContainerStatuses.state.terminated.signal** (int32)

        Signal from the last termination of the container
-->
  - **ephemeralContainerStatuses.state.terminated** (ContainerStateTerminated)

      有关已终止容器的详细信息

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated 是容器的终止状态。*

      - **ephemeralContainerStatuses.state.terminated.containerID**（string）

        格式为 '\<type>://\<container_id>' 的容器 ID

      - **ephemeralContainerStatuses.state.terminated.exitCode** (int32)，必需

        容器最后终止的退出状态

      - **ephemeralContainerStatuses.state.terminated.startedAt**（Time）

        容器先前执行的开始时间

        <a name="Time"></a>
        *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。 *

      - **ephemeralContainerStatuses.state.terminated.finishedAt**（Time）

        容器最后终止的时间

        <a name="Time"></a>
        *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

      - **ephemeralContainerStatuses.state.terminated.message**（string）

        关于容器最后终止的消息

      - **ephemeralContainerStatuses.state.terminated.reason**（string）

        （简要）容器最后终止的原因

      - **ephemeralContainerStatuses.state.terminated.signal** (int32)

        来自容器最后终止的信号
<!--
    - **ephemeralContainerStatuses.state.waiting** (ContainerStateWaiting)

      Details about a waiting container

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting is a waiting state of a container.*

      - **ephemeralContainerStatuses.state.waiting.message** (string)

        Message regarding why the container is not yet running.

      - **ephemeralContainerStatuses.state.waiting.reason** (string)

        (brief) reason the container is not yet running.
-->
  - **ephemeralContainerStatuses.state.waiting** (ContainerStateWaiting)

       有关等待容器的详细信息

       <a name="ContainerStateWaiting"></a>
       *ContainerStateWaiting 是容器的等待状态。*

       - **ephemeralContainerStatuses.state.waiting.message**（string）

         关于容器尚未运行的原因的消息。

       - **ephemeralContainerStatuses.state.waiting.reason**（string）

         （简要）容器尚未运行的原因。
<!--
  - **ephemeralContainerStatuses.lastState** (ContainerState)

    Details about the container's last termination condition.

    <a name="ContainerState"></a>
    *ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.*
-->
- **ephemeralContainerStatuses.lastState** (ContainerState)

     有关容器的最后终止条件的详细信息。

     <a name="ContainerState"></a>
     *ContainerState 保存容器的可能状态。只能指定其成员之一。 如果没有指定，则默认为 ContainerStateWaiting。*
<!--
    - **ephemeralContainerStatuses.lastState.running** (ContainerStateRunning)

      Details about a running container

      <a name="ContainerStateRunning"></a>
      *ContainerStateRunning is a running state of a container.*

      - **ephemeralContainerStatuses.lastState.running.startedAt** (Time)

        Time at which the container was last (re-)started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->
  - **ephemeralContainerStatuses.lastState.running** (ContainerStateRunning)

       有关正在运行的容器的详细信息

       <a name="ContainerStateRunning"></a>
       *ContainerStateRunning 是容器的运行状态。*

       - **ephemeralContainerStatuses.lastState.running.startedAt**（Time）

         容器上次（重新）启动的时间

         <a name="Time"></a>
         *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。 为 time 包提供的许多工厂方法提供了包装器。*
<!--

    - **ephemeralContainerStatuses.lastState.terminated** (ContainerStateTerminated)

      Details about a terminated container

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated is a terminated state of a container.*

      - **ephemeralContainerStatuses.lastState.terminated.containerID** (string)

        Container's ID in the format '\<type>://\<container_id>'

      - **ephemeralContainerStatuses.lastState.terminated.exitCode** (int32), required

        Exit status from the last termination of the container

      - **ephemeralContainerStatuses.lastState.terminated.startedAt** (Time)

        Time at which previous execution of the container started

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **ephemeralContainerStatuses.lastState.terminated.finishedAt** (Time)

        Time at which the container last terminated

        <a name="Time"></a>
        *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

      - **ephemeralContainerStatuses.lastState.terminated.message** (string)

        Message regarding the last termination of the container

      - **ephemeralContainerStatuses.lastState.terminated.reason** (string)

        (brief) reason from the last termination of the container

      - **ephemeralContainerStatuses.lastState.terminated.signal** (int32)

        Signal from the last termination of the container
-->
  - **ephemeralContainerStatuses.lastState.terminated** (ContainerStateTerminated)

      有关已终止容器的详细信息

      <a name="ContainerStateTerminated"></a>
      *ContainerStateTerminated 是容器的终止状态。*

      - **ephemeralContainerStatuses.lastState.terminated.containerID**（string）

        格式为 '\<type>://\<container_id>' 的容器 ID

      - **ephemeralContainerStatuses.lastState.terminated.exitCode** (int32)，必需

        容器最后终止的退出状态

      - **ephemeralContainerStatuses.lastState.terminated.startedAt**（Time）

        容器先前执行的开始时间

        <a name="Time"></a>
        *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

      - **ephemeralContainerStatuses.lastState.terminated.finishedAt**（Time）

        容器最后终止的时间

        <a name="Time"></a>
        *Time 是 time.Time 的包装器，支持正确编组为 YAML 和 JSON。为 time 包提供的许多工厂方法提供了包装器。*

      - **ephemeralContainerStatuses.lastState.terminated.message**（string）

        关于容器最后终止的消息

      - **ephemeralContainerStatuses.lastState.terminated.reason**（string）

        （简要）容器最后终止的原因

      - **ephemeralContainerStatuses.lastState.terminated.signal** (int32)

        来自容器最后终止的信号
<!--
    - **ephemeralContainerStatuses.lastState.waiting** (ContainerStateWaiting)

      Details about a waiting container

      <a name="ContainerStateWaiting"></a>
      *ContainerStateWaiting is a waiting state of a container.*

      - **ephemeralContainerStatuses.lastState.waiting.message** (string)

        Message regarding why the container is not yet running.

      - **ephemeralContainerStatuses.lastState.waiting.reason** (string)

        (brief) reason the container is not yet running.
-->
  - **ephemeralContainerStatuses.lastState.waiting** (ContainerStateWaiting)

       有关等待容器的详细信息

       <a name="ContainerStateWaiting"></a>
       *ContainerStateWaiting 是容器的等待状态。*

       - **ephemeralContainerStatuses.lastState.waiting.message**（string）

         关于容器尚未运行的原因的消息。

       - **ephemeralContainerStatuses.lastState.waiting.reason**（string）

         （简要）容器尚未运行的原因。

<!--
  - **ephemeralContainerStatuses.ready** (boolean), required

    Specifies whether the container has passed its readiness probe.

  - **ephemeralContainerStatuses.restartCount** (int32), required

    The number of times the container has been restarted.

  - **ephemeralContainerStatuses.started** (boolean)

    Specifies whether the container has passed its startup probe. Initialized as false, becomes true after startupProbe is considered successful. Resets to false when the container is restarted, or if kubelet loses state temporarily. Is always true when no startupProbe is defined.
-->
  - **ephemeralContainerStatuses.ready**（boolean），必需

     指定容器是否已通过其就绪探测。

   - **ephemeralContainerStatuses.restartCount** (int32)，必需

     容器重启的次数。

   - **ephemeralContainerStatuses.started**（boolean）

     指定容器是否已通过其启动探测。
     初始化为 false，startupProbe 被认为成功后变为 true。
     当容器重新启动或 kubelet 暂时丢失状态时重置为 false。
     未定义 startupProbe 时始终为 true。

## PodList {#PodList}

<!--
PodList is a list of Pods.
-->

PodList 是 Pod 的列表。

<hr>

<!--
- **items** ([]<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>), required

  List of pods. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md

- **apiVersion** (string)

  APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (string)

  Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
-->
- **items** ([]<a href="{{< ref "../workload-resources/pod-v1#Pod" >}}">Pod</a>)，必需

  Pod 列表。更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md

- **apiVersion**（string）

  APIVersion 定义对象表示的版本化模式。服务器应将已识别的模式转换为最新的内部值，并可能拒绝无法识别的值。更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind**（string）

  Kind 是一个字符串值，表示此对象表示的 REST 资源。
  服务器可以从客户端提交请求的端点推断出这一点。
  无法更新。在骆驼情况下。
  更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准列表元数据。更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

## Operations {#Operations}



<hr>






### `get` read the specified Pod

#### HTTP Request

GET /api/v1/namespaces/{namespace}/pods/{name}

#### Parameters