---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PersistentVolumeClaim"
content_type: "api_reference"
description: "PersistentVolumeClaim 是用户针对一个持久卷的请求和申领。"
title: "PersistentVolumeClaim"
weight: 4
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PersistentVolumeClaim"
content_type: "api_reference"
description: "PersistentVolumeClaim is a user's request for and claim to a persistent volume."
title: "PersistentVolumeClaim"
weight: 4
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## PersistentVolumeClaim {#PersistentVolumeClaim}

<!--
PersistentVolumeClaim is a user's request for and claim to a persistent volume
-->
PersistentVolumeClaim 是用户针对一个持久卷的请求和申领。

<hr>

- **apiVersion**: v1

- **kind**: PersistentVolumeClaim

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimSpec" >}}">PersistentVolumeClaimSpec</a>)

  spec defines the desired characteristics of a volume requested by a pod author. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimSpec" >}}">PersistentVolumeClaimSpec</a>)

  spec 定义 Pod 作者所请求的卷的预期特征。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

<!--
- **status** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimStatus" >}}">PersistentVolumeClaimStatus</a>)

  status represents the current information/status of a persistent volume claim. Read-only. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims
-->
- **status** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimStatus" >}}">PersistentVolumeClaimStatus</a>)

  status 表示一个持久卷申领的当前信息/状态。只读。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

## PersistentVolumeClaimSpec {#PersistentVolumeClaimSpec}
<!--
PersistentVolumeClaimSpec describes the common attributes of storage devices and allows a Source for provider-specific attributes
<hr>
- **accessModes** ([]string)

  accessModes contains the desired access modes the volume should have. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  selector is a label query over volumes to consider for binding.
-->
PersistentVolumeClaimSpec 描述存储设备的常用参数，并支持通过 source 来设置特定于提供商的属性。

<hr>

- **accessModes** ([]string)

  accessModes 包含卷应具备的预期访问模式。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#access-modes-1

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  selector 是在绑定时对卷进行选择所执行的标签查询。

<!--
- **resources** (ResourceRequirements)

  resources represents the minimum resources the volume should have. If RecoverVolumeExpansionFailure feature is enabled users are allowed to specify resource requirements that are lower than previous value but must still be higher than capacity recorded in the status field of the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources

  <a name="ResourceRequirements"></a>
  *ResourceRequirements describes the compute resource requirements.*
-->
- **resources** (ResourceRequirements)

  resources 表示卷应拥有的最小资源。
  如果启用了 RecoverVolumeExpansionFailure 功能特性，则允许用户指定这些资源要求，
  此值必须低于之前的值，但必须高于申领的状态字段中记录的容量。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#resources

  <a name="ResourceRequirements"></a>
  **ResourceRequirements 描述计算资源要求。**

  - **resources.claims** ([]ResourceClaim)

    <!--
    *Map: unique values on key name will be kept during a merge*

    Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.

    This is an alpha field and requires enabling the DynamicResourceAllocation feature gate.

    This field is immutable. It can only be set for containers.
    -->

    **集合：键 name 的唯一值将在合并期间被保留**

    claims 列出了此容器使用的、在 spec.resourceClaims 中定义的资源的名称。

    这是一个 Alpha 字段，需要启用 DynamicResourceAllocation 特性门控。

    此字段是不可变的。

    <!--
    <a name="ResourceClaim"></a>
    *ResourceClaim references one entry in PodSpec.ResourceClaims.*

    - **resources.claims.name** (string), required

      Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.
    -->
    <a name="ResourceClaim"></a>
    **ResourceClaim 引用 PodSpec.ResourceClaims 中的一个条目。**

    - **resources.claims.name** (string)，必需

      对于使用此字段的 Pod，name 必须与 pod.spec.resourceClaims 中的一个条目的名称匹配。

  <!--
  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)
    Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
  -->
  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    limits 描述允许的最大计算资源量。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    requests 描述所需的最小计算资源量。
    如果针对容器省略 requests，则在显式指定的情况下默认为 limits，否则为具体实现所定义的值。请求不能超过限制。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

<!--
- **volumeName** (string)
  volumeName is the binding reference to the PersistentVolume backing this claim.

- **storageClassName** (string)
  storageClassName is the name of the StorageClass required by the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1

- **volumeMode** (string)
  volumeMode defines what type of volume is required by the claim. Value of Filesystem is implied when not included in claim spec.
-->
- **volumeName** (string)

  volumeName 是对此申领所对应的 PersistentVolume 的绑定引用。

- **storageClassName** (string)

  storageClassName 是此申领所要求的 StorageClass 名称。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#class-1

- **volumeMode** (string)

  volumeMode 定义申领需要哪种类别的卷。当申领规约中未包含此字段时，意味着取值为 Filesystem。

<!--
### Beta level

- **dataSource** (<a href="{{< ref "../common-definitions/typed-local-object-reference#TypedLocalObjectReference" >}}">TypedLocalObjectReference</a>)

  dataSource field can be used to specify either: * An existing VolumeSnapshot object (snapshot.storage.k8s.io/VolumeSnapshot) * An existing PVC (PersistentVolumeClaim) If the provisioner or an external controller can support the specified data source, it will create a new volume based on the contents of the specified data source. When the AnyVolumeDataSource feature gate is enabled, dataSource contents will be copied to dataSourceRef, and dataSourceRef contents will be copied to dataSource when dataSourceRef.namespace is not specified. If the namespace is specified, then dataSourceRef will not be copied to dataSource.
-->
### Beta 级别

- **dataSource** (<a href="{{< ref "../common-definitions/typed-local-object-reference#TypedLocalObjectReference" >}}">TypedLocalObjectReference</a>)

  dataSource 字段可用于二选一：

  - 现有的 VolumeSnapshot 对象（snapshot.storage.k8s.io/VolumeSnapshot）

  - 现有的 PVC (PersistentVolumeClaim)

  如果制备器或外部控制器可以支持指定的数据源，则它将根据指定数据源的内容创建新的卷。
  当 AnyVolumeDataSource 特性门控被启用时，dataSource 内容将被复制到 dataSourceRef，
  当 dataSourceRef.namespace 未被指定时，dataSourceRef 内容将被复制到 dataSource。
  如果名字空间被指定，则 dataSourceRef 不会被复制到 dataSource。

<!--
- **dataSourceRef** (TypedObjectReference)

dataSourceRef specifies the object from which to populate the volume with data, if a non-empty volume is desired. This may be any object from a non-empty API group (non core object) or a PersistentVolumeClaim object. When this field is specified, volume binding will only succeed if the type of the specified object matches some installed volume populator or dynamic provisioner. This field will replace the functionality of the dataSource field and as such if both fields are non-empty, they must have the same value. For backwards compatibility, when namespace isn't specified in dataSourceRef, both fields (dataSource and dataSourceRef) will be set to the same value automatically if one of them is empty and the other is non-empty. When namespace is specified in dataSourceRef, dataSource isn't set to the same value and must be empty. There are three important differences between dataSource and dataSourceRef:
-->
- **dataSourceRef** (TypedObjectReference)

  dataSourceRef 指定一个对象，当需要非空卷时，可以使用它来为卷填充数据。
  此字段值可以是来自非空 API 组（非核心对象）的任意对象，或一个 PersistentVolumeClaim 对象。
  如果设置了此字段，则仅当所指定对象的类型与所安装的某些卷填充器或动态制备器匹配时，卷绑定才会成功。
  此字段将替换 dataSource 字段的功能，因此如果两个字段非空，其取值必须相同。
  为了向后兼容，当未在 dataSourceRef 中指定名字空间时，
  如果（dataSource 和 dataSourceRef）其中一个字段为空且另一个字段非空，则两个字段将被自动设为相同的值。
  在 dataSourceRef 中指定名字空间时，dataSource 未被设置为相同的值且必须为空。
  dataSource 和 dataSourceRef 之间有三个重要的区别：

  <!--
  * While dataSource only allows two specific types of objects, dataSourceRef
    allows any non-core object, as well as PersistentVolumeClaim objects.
  * While dataSource ignores disallowed values (dropping them), dataSourceRef
    preserves all values, and generates an error if a disallowed value is
    specified.
  * While dataSource only allows local objects, dataSourceRef allows objects
    in any namespaces.
  (Beta) Using this field requires the AnyVolumeDataSource feature gate to be enabled. (Alpha) Using the namespace field of dataSourceRef requires the CrossNamespaceVolumeDataSource feature gate to be enabled.
  -->
  * dataSource 仅允许两个特定类型的对象，而 dataSourceRef 允许任何非核心对象以及 PersistentVolumeClaim 对象。
  * dataSource 忽略不允许的值（这类值会被丢弃），而 dataSourceRef 保留所有值并在指定不允许的值时产生错误。
  * dataSource 仅允许本地对象，而 dataSourceRef 允许任意名字空间中的对象。

  (Beta) 使用此字段需要启用 AnyVolumeDataSource 特性门控。
  (Alpha) 使用 dataSourceRef 的名字空间字段需要启用 CrossNamespaceVolumeDataSource 特性门控。

  <a name="TypedObjectReference"></a>

  <!--
  - **dataSourceRef.kind** (string), required

    Kind is the type of resource being referenced

  - **dataSourceRef.name** (string), required

    Name is the name of resource being referenced
  -->
  - **dataSourceRef.kind** (string)，必需

    kind 是正被引用的资源的类型。

  - **dataSourceRef.name** (string)，必需

    name 是正被引用的资源的名称。

  <!--
  - **dataSourceRef.apiGroup** (string)

    APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.

  - **dataSourceRef.namespace** (string)

    Namespace is the namespace of resource being referenced Note that when a namespace is specified, a gateway.networking.k8s.io/ReferenceGrant object is required in the referent namespace to allow that namespace's owner to accept the reference. See the ReferenceGrant documentation for details. (Alpha) This field requires the CrossNamespaceVolumeDataSource feature gate to be enabled.
  -->
  - **dataSourceRef.apiGroup** (string)

    apiGroup 是正被引用的资源的组。如果 apiGroup 未被指定，则指定的 kind 必须在核心 API 组中。
    对于任何第三方类型，apiGroup 是必需的。

  - **dataSourceRef.namespace** (string)

    namespace 是正被引用的资源的名字空间。请注意，当指定一个名字空间时，
    在引用的名字空间中 gateway.networking.k8s.io/ReferenceGrant 对象是必需的，
    以允许该名字空间的所有者接受引用。有关详细信息，请参阅 ReferenceGrant 文档。
    (Alpha) 此字段需要启用 CrossNamespaceVolumeDataSource 特性门控。

## PersistentVolumeClaimStatus {#PersistentVolumeClaimStatus}
<!--
PersistentVolumeClaimStatus is the current status of a persistent volume claim.

<hr>

- **accessModes** ([]string)
  accessModes contains the actual access modes the volume backing the PVC has. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1
-->
PersistentVolumeClaimStatus 是持久卷申领的当前状态。

<hr>

- **accessModes** ([]string)

  accessModes 包含支持 PVC 的卷所具有的实际访问模式。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#access-modes-1

<!--
- **allocatedResourceStatuses** (map[string]string)

  allocatedResourceStatuses stores status of resource being resized for the given PVC. Key names follow standard Kubernetes label syntax. Valid values are either:
  	* Un-prefixed keys:
  		- storage - the capacity of the volume.
  	* Custom resources must use implementation-defined prefixed names such as "example.com/my-custom-resource"
  Apart from above values - keys that are unprefixed or have kubernetes.io prefix are considered reserved and hence may not be used.
-->
- **allocatedResourceStatuses** (map[string]string)

  allocatedResourceStatuses 存储为给定 PVC 而调整大小的资源的状态。键名遵循标准的 Kubernetes 标签语法。
  有效值为：
  * 未加前缀的键：
    - storage - 卷的容量。
  * 自定义资源必须使用实现定义的带前缀的名称，如 "example.com/my-custom-resource"。
  除上述值之外，未加前缀或具有 `kubernetes.io` 前缀的键被视为保留键，因此不能使用。

  <!--
  ClaimResourceStatus can be in any of following states:
  	- ControllerResizeInProgress:
  		State set when resize controller starts resizing the volume in control-plane.
  	- ControllerResizeFailed:
  		State set when resize has failed in resize controller with a terminal error.
  	- NodeResizePending:
  		State set when resize controller has finished resizing the volume but further resizing of
  		volume is needed on the node.
  	- NodeResizeInProgress:
  		State set when kubelet starts resizing the volume.
  	- NodeResizeFailed:
  		State set when resizing has failed in kubelet with a terminal error. Transient errors don't set
  		NodeResizeFailed.
  -->
  ClaimResourceStatus 可以处于以下任一状态：
  - ControllerResizeInProgress：大小调整控制器开始在控制平面中调整卷大小时所设置的状态。
  - ControllerResizeFailed：大小调整控制器出现致命错误导致大小调整失败时所设置的状态。
  - NodeResizePending：大小调整控制器已完成对卷大小的调整但需要在节点上进一步调整卷大小时的状态。
  - NodeResizeInProgress：kubelet 开始调整卷大小时所设置的状态。
  - NodeResizeFailed：kubelet 在出现致命错误而导致大小调整失败时所设置的状态。
    临时错误不会设置 NodeResizeFailed。

  <!--
  For example: if expanding a PVC for more capacity - this field can be one of the following states:
  	- pvc.status.allocatedResourceStatus['storage'] = "ControllerResizeInProgress"
       - pvc.status.allocatedResourceStatus['storage'] = "ControllerResizeFailed"
       - pvc.status.allocatedResourceStatus['storage'] = "NodeResizePending"
       - pvc.status.allocatedResourceStatus['storage'] = "NodeResizeInProgress"
       - pvc.status.allocatedResourceStatus['storage'] = "NodeResizeFailed"
  When this field is not set, it means that no resize operation is in progress for the given PVC.
  -->
  例如：如果扩展 PVC 以获取更多的容量，则此字段可以是以下状态之一：
  - pvc.status.allocatedResourceStatus['storage'] = "ControllerResizeInProgress"
    - pvc.status.allocatedResourceStatus['storage'] = "ControllerResizeFailed"
    - pvc.status.allocatedResourceStatus['storage'] = "NodeResizePending"
    - pvc.status.allocatedResourceStatus['storage'] = "NodeResizeInProgress"
    - pvc.status.allocatedResourceStatus['storage'] = "NodeResizeFailed"
  当未设置此字段时，表示没有针对给定 PVC 执行大小调整操作。

  <!--
  A controller that receives PVC update with previously unknown resourceName or ClaimResourceStatus should ignore the update for the purpose it was designed. For example - a controller that only is responsible for resizing capacity of the volume, should ignore PVC updates that change other valid resources associated with PVC.
  
  This is an alpha field and requires enabling RecoverVolumeExpansionFailure feature.
  -->
  如果控制器收到具有先前未知的 resourceName 或 ClaimResourceStatus 的 PVC 更新，
  则该控制器应忽略此项更新才能按预期工作。例如，仅负责调整卷容量大小的控制器应忽略更改与
  PVC 关联的其他合法资源的 PVC 更新。

  这是一个 Alpha 字段，需要启用 RecoverVolumeExpansionFailure 功能特性。

- **allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  <!--
  allocatedResources tracks the resources allocated to a PVC including its capacity. Key names follow standard Kubernetes label syntax. Valid values are either:
  	* Un-prefixed keys:
  		- storage - the capacity of the volume.
  	* Custom resources must use implementation-defined prefixed names such as "example.com/my-custom-resource"
  Apart from above values - keys that are unprefixed or have kubernetes.io prefix are considered reserved and hence may not be used.
  -->
  allocatedResources 跟踪分配给 PVC 的资源，包括其容量。键名遵循标准的 Kubernetes 标签语法。
  有效值为：
  * 未加前缀的键：
    - storage - 卷的容量。
  * 自定义资源必须使用实现定义的带前缀的名称，如 "example.com/my-custom-resource"。
  除上述值之外，未加前缀或具有 `kubernetes.io` 前缀的键被视为保留键，因此不能使用。
  
  <!--
  Capacity reported here may be larger than the actual capacity when a volume expansion operation is requested. For storage quota, the larger value from allocatedResources and PVC.spec.resources is used. If allocatedResources is not set, PVC.spec.resources alone is used for quota calculation. If a volume expansion capacity request is lowered, allocatedResources is only lowered if there are no expansion operations in progress and if the actual volume capacity is equal or lower than the requested capacity.
  -->
  当出现卷扩充操作请求时，此字段可能大于实际的容量。
  就存储配额而言，将使用 allocatedResources 和 PVC.spec.resources 二者中的更大值。
  如果未设置 allocatedResources，则 PVC.spec.resources 单独用于配额计算。
  如果减小一个卷扩充容量请求，则仅当没有正在进行的扩充操作且实际卷容量等于或小于请求的容量时，
  才会减小 allocatedResources。
  
  <!--
  A controller that receives PVC update with previously unknown resourceName should ignore the update for the purpose it was designed. For example - a controller that only is responsible for resizing capacity of the volume, should ignore PVC updates that change other valid resources associated with PVC.

  This is an alpha field and requires enabling RecoverVolumeExpansionFailure feature.
  -->
  如果控制器收到具有先前未知的 resourceName 的 PVC 更新，则该控制器应忽略此项更新才能按预期工作。
  例如，仅负责调整卷容量大小的控制器应忽略更改与 PVC 关联的其他合法资源的 PVC 更新。

  这是一个 Alpha 字段，需要启用 RecoverVolumeExpansionFailure 功能特性。

<!--
- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity represents the actual resources of the underlying volume.
-->
- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity 表示底层卷的实际资源。

<!--
- **conditions** ([]PersistentVolumeClaimCondition)
  *Patch strategy: merge on key `type`*

  conditions is the current Condition of persistent volume claim. If underlying persistent volume is being resized then the Condition will be set to 'ResizeStarted'.

  <a name="PersistentVolumeClaimCondition"></a>
  *PersistentVolumeClaimCondition contains details about state of pvc*
-->
- **conditions** ([]PersistentVolumeClaimCondition)

  **补丁策略：按照键 `type` 合并**

  conditions 是持久卷声明的当前的状况。
  如果正在调整底层持久卷的大小，则状况将被设为 “ResizeStarted”。

  <a name="PersistentVolumeClaimCondition"></a>
  **PersistentVolumeClaimCondition 包含有关 PVC 状态的详细信息。**

<!--
  - **conditions.status** (string), required

  - **conditions.type** (string), required

  - **conditions.lastProbeTime** (Time)
    lastProbeTime is the time we probed the condition.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->  
  - **conditions.status** (string)，必需
  
  - **conditions.type** (string)，必需
  
  - **conditions.lastProbeTime** (Time)
    
    lastProbeTime 是我们探测 PVC 状况的时间。
    
    <a name="Time"></a> 
    **Time 是 time.Time 的包装类，支持正确地序列化为 YAML 和 JSON。
    为 time 包提供的许多工厂方法提供了包装类。**

<!--
  - **conditions.lastTransitionTime** (Time)
    lastTransitionTime is the time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.message** (string)
    message is the human-readable message indicating details about last transition.

  - **conditions.reason** (string)
    reason is a unique, this should be a short, machine understandable string that gives the reason for condition's last transition. If it reports "ResizeStarted" that means the underlying persistent volume is being resized.
-->
  - **conditions.lastTransitionTime** (Time)

    lastTransitionTime 是状况从一个状态转换为另一个状态的时间。

    <a name="Time"></a> 
    **Time 是 time.Time 的包装类，支持正确地序列化为 YAML 和 JSON。
    为 time 包提供的许多工厂方法提供了包装类。**
  
  - **conditions.message** (string)

    message 是人类可读的消息，指示有关上一次转换的详细信息。
  
  - **conditions.reason** (string)

    reason 是唯一的，它应该是一个机器可理解的简短字符串，指明上次状况转换的原因。
    如果它报告 “ResizeStarted”，则意味着正在调整底层持久卷的大小。

<!--
- **phase** (string)
  phase represents the current phase of PersistentVolumeClaim.
-->
- **phase** (string)

  phase 表示 PersistentVolumeClaim 的当前阶段。

## PersistentVolumeClaimList {#PersistentVolumeClaimList}
<!--
PersistentVolumeClaimList is a list of PersistentVolumeClaim items.
-->
PersistentVolumeClaimList 是 PersistentVolumeClaim 各项的列表。

<hr>

- **apiVersion**: v1

- **kind**: PersistentVolumeClaimList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>), required
  items is a list of persistent volume claims. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>)，必需

  items 是持久卷申领的列表。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

<!--
## Operations {#Operations}
<hr>
### `get` read the specified PersistentVolumeClaim
#### HTTP Request
-->
## 操作 {#Operations}
<hr>

### `get` 读取指定的 PersistentVolumeClaim
#### HTTP 请求
GET /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolumeClaim
- **namespace** (*in path*): string, required

- **pretty** (*in query*): string
-->
#### 参数
- **name** (**路径参数**): string，必需

  PersistentVolumeClaim 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应
200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified PersistentVolumeClaim
#### HTTP Request
-->
### `get` 读取指定的 PersistentVolumeClaim 的状态
#### HTTP 请求

GET /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolumeClaim
- **namespace** (*in path*): string, required

- **pretty** (*in query*): string
-->
#### 参数
- **name** (**路径参数**): string，必需

  PersistentVolumeClaim 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应
200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PersistentVolumeClaim
#### HTTP Request
-->
### `list` 列出或观测类别为 PersistentVolumeClaim 的对象
#### HTTP 请求
GET /api/v1/namespaces/{namespace}/persistentvolumeclaims

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
200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimList" >}}">PersistentVolumeClaimList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PersistentVolumeClaim
#### HTTP Request
-->
### `list` 列出或观测类别为 PersistentVolumeClaim 的对象
#### HTTP 请求
GET /api/v1/persistentvolumeclaims

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
200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimList" >}}">PersistentVolumeClaimList</a>): OK

401: Unauthorized

<!--
### `create` create a PersistentVolumeClaim
#### HTTP Request
-->
### `create` 创建 PersistentVolumeClaim
#### HTTP 请求
POST /api/v1/namespaces/{namespace}/persistentvolumeclaims

<!--
#### Parameters
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数
- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>，必需

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
200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified PersistentVolumeClaim
#### HTTP Request
-->
### `update` 替换指定的 PersistentVolumeClaim
#### HTTP 请求
PUT /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolumeClaim
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数
- **name** (**路径参数**): string，必需

  PersistentVolumeClaim 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>，必需

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
200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified PersistentVolumeClaim
#### HTTP Request
-->
### `update` 替换指定的 PersistentVolumeClaim 的状态
#### HTTP 请求
PUT /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolumeClaim
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数
- **name** (**路径参数**): string，必需

  PersistentVolumeClaim 的名称

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>，必需

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
200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified PersistentVolumeClaim
#### HTTP Request
-->
### `patch` 部分更新指定的 PersistentVolumeClaim
#### HTTP 请求
PATCH /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolumeClaim
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

  PersistentVolumeClaim 的名称

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
200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified PersistentVolumeClaim
#### HTTP Request
-->
### `patch` 部分更新指定的 PersistentVolumeClaim 的状态
#### HTTP 请求
PATCH /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}/status

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolumeClaim
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

  PersistentVolumeClaim 的名称

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
200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

401: Unauthorized

<!--
### `delete` delete a PersistentVolumeClaim
#### HTTP Request
-->
### `delete` 删除 PersistentVolumeClaim
#### HTTP 请求
DELETE /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PersistentVolumeClaim
- **namespace** (*in path*): string, required
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 参数
- **name** (**路径参数**): string，必需

  PersistentVolumeClaim 的名称

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
200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of PersistentVolumeClaim
#### HTTP Request
-->
### `deletecollection` 删除 PersistentVolumeClaim 的集合
#### HTTP 请求
DELETE /api/v1/namespaces/{namespace}/persistentvolumeclaims

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
