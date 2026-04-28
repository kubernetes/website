---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PersistentVolumeClaim"
content_type: "api_reference"
description: "PersistentVolumeClaim 是用户针对一个持久卷的请求和申领。"
title: "PersistentVolumeClaim"
weight: 6
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PersistentVolumeClaim"
content_type: "api_reference"
description: "PersistentVolumeClaim is a user's request for and claim to a persistent volume."
title: "PersistentVolumeClaim"
weight: 6
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

  `spec` 定义 Pod 作者所请求的卷的预期特征。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

<!--
- **status** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimStatus" >}}">PersistentVolumeClaimStatus</a>)

  status represents the current information/status of a persistent volume claim. Read-only. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims
-->
- **status** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimStatus" >}}">PersistentVolumeClaimStatus</a>)

  `status` 表示一个持久卷申领的当前信息/状态。只读。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

## PersistentVolumeClaimSpec {#PersistentVolumeClaimSpec}

<!--
PersistentVolumeClaimSpec describes the common attributes of storage devices and allows a Source for provider-specific attributes
<hr>
- **accessModes** ([]string)

  *Atomic: will be replaced during a merge*

  accessModes contains the desired access modes the volume should have. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  selector is a label query over volumes to consider for binding.
-->
PersistentVolumeClaimSpec 描述存储设备的常用参数，并支持通过 source 来设置特定于提供商的属性。

<hr>

- **accessModes** ([]string)

  **原子性：将在合并期间被替换**

  `accessModes` 包含卷应具备的预期访问模式。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#access-modes-1

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  `selector` 是在绑定时对卷进行选择所执行的标签查询。

<!--
-  **resources** (VolumeResourceRequirements)

  resources represents the minimum resources the volume should have. Users are allowed to specify resource requirements that are lower than previous value but must still be higher than capacity recorded in the status field of the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources
-->
-  **resources** (VolumeResourceRequirements)

  `resources` 表示卷应拥有的最小资源。用户指定这些资源要求，此值必须低于之前的值，
  但必须高于申领的状态字段中记录的容量。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#resources

  <!--
  <a name="VolumeResourceRequirements"></a>
  *VolumeResourceRequirements describes the storage resource requirements for a volume.*
  -->

  <a name="VolumeResourceRequirements"></a>
  **VolumeResourceRequirements 描述了卷的存储资源要求。**

  <!--
  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)
    Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
  -->

  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    `limits` 描述允许的最大计算资源量。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    `requests` 描述所需的最小计算资源量。
    如果针对容器省略 `requests`，则在显式指定的情况下默认为 `limits`，
    否则为具体实现所定义的值。请求不能超过限制。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

<!--
- **volumeName** (string)
  volumeName is the binding reference to the PersistentVolume backing this claim.

- **storageClassName** (string)
  storageClassName is the name of the StorageClass required by the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1
-->
- **volumeName** (string)

  `volumeName` 是对此申领所对应的 PersistentVolume 的绑定引用。

- **storageClassName** (string)

  `storageClassName` 是此申领所要求的 StorageClass 名称。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#class-1

<!--
- **volumeMode** (string)
  volumeMode defines what type of volume is required by the claim. Value of Filesystem is implied when not included in claim spec.

  Possible enum values:
   - `"Block"` means the volume will not be formatted with a filesystem and will remain a raw block device.
   - `"Filesystem"` means the volume will be or is formatted with a filesystem.
-->

- **volumeMode** (string)

  volumeMode 定义申领需要哪种类别的卷。当申领规约中未包含此字段时，意味着取值为 Filesystem。

  可能的枚举值：
  - `"Block"` 表示卷不会被格式化为某个文件系统，将保持为原始块设备。
  - `"Filesystem"` 表示卷将会或已经被格式化为文件系统。

<!--
### Beta level

- **dataSource** (<a href="{{< ref "../common-definitions/typed-local-object-reference#TypedLocalObjectReference" >}}">TypedLocalObjectReference</a>)

  dataSource field can be used to specify either: * An existing VolumeSnapshot object (snapshot.storage.k8s.io/VolumeSnapshot) * An existing PVC (PersistentVolumeClaim) If the provisioner or an external controller can support the specified data source, it will create a new volume based on the contents of the specified data source. When the AnyVolumeDataSource feature gate is enabled, dataSource contents will be copied to dataSourceRef, and dataSourceRef contents will be copied to dataSource when dataSourceRef.namespace is not specified. If the namespace is specified, then dataSourceRef will not be copied to dataSource.
-->
### Beta 级别

- **dataSource** (<a href="{{< ref "../common-definitions/typed-local-object-reference#TypedLocalObjectReference" >}}">TypedLocalObjectReference</a>)

  `dataSource` 字段可用于二选一：

  - 现有的 VolumeSnapshot 对象（`snapshot.storage.k8s.io/VolumeSnapshot`）

  - 现有的 PVC (PersistentVolumeClaim)

  如果制备器或外部控制器可以支持指定的数据源，则它将根据指定数据源的内容创建新的卷。
  当 AnyVolumeDataSource 特性门控被启用时，`dataSource` 内容将被复制到 `dataSourceRef`，
  当 `dataSourceRef.namespace` 未被指定时，`dataSourceRef` 内容将被复制到 `dataSource`。
  如果名字空间被指定，则 `dataSourceRef` 不会被复制到 `dataSource`。

<!--
- **dataSourceRef** (TypedObjectReference)

dataSourceRef specifies the object from which to populate the volume with data, if a non-empty volume is desired. This may be any object from a non-empty API group (non core object) or a PersistentVolumeClaim object. When this field is specified, volume binding will only succeed if the type of the specified object matches some installed volume populator or dynamic provisioner. This field will replace the functionality of the dataSource field and as such if both fields are non-empty, they must have the same value. For backwards compatibility, when namespace isn't specified in dataSourceRef, both fields (dataSource and dataSourceRef) will be set to the same value automatically if one of them is empty and the other is non-empty. When namespace is specified in dataSourceRef, dataSource isn't set to the same value and must be empty. There are three important differences between dataSource and dataSourceRef:
-->
- **dataSourceRef** (TypedObjectReference)

  `dataSourceRef` 指定一个对象，当需要非空卷时，可以使用它来为卷填充数据。
  此字段值可以是来自非空 API 组（非核心对象）的任意对象，或一个 PersistentVolumeClaim 对象。
  如果设置了此字段，则仅当所指定对象的类型与所安装的某些卷填充器或动态制备器匹配时，卷绑定才会成功。
  此字段将替换 `dataSource` 字段的功能，因此如果两个字段非空，其取值必须相同。
  为了向后兼容，当未在 `dataSourceRef` 中指定名字空间时，
  如果（`dataSource` 和 `dataSourceRef`）其中一个字段为空且另一个字段非空，则两个字段将被自动设为相同的值。
  在 `dataSourceRef` 中指定名字空间时，`dataSource` 未被设置为相同的值且必须为空。
  `dataSource` 和 `dataSourceRef` 之间有三个重要的区别：

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

  * `dataSource` 仅允许两个特定类型的对象，而 `dataSourceRef` 允许任何非核心对象以及
    PersistentVolumeClaim 对象。
  * `dataSource` 忽略不允许的值（这类值会被丢弃），而 `dataSourceRef`
    保留所有值并在指定不允许的值时产生错误。
  * `dataSource` 仅允许本地对象，而 `dataSourceRef` 允许任意名字空间中的对象。

  （Beta）使用此字段需要启用 AnyVolumeDataSource 特性门控。
  （Alpha）使用 `dataSourceRef` 的名字空间字段需要启用 CrossNamespaceVolumeDataSource 特性门控。

  <!--
  <a name="TypedObjectReference"></a>
  *TypedObjectReference contains enough information to let you locate the typed referenced object*
  -->

  <a name="TypedObjectReference"></a>
  **`TypedObjectReference` 包含足够的信息，可以让你定位特定类型的引用对象。**

  <!--
  - **dataSourceRef.kind** (string), required

    Kind is the type of resource being referenced

  - **dataSourceRef.name** (string), required

    Name is the name of resource being referenced
  -->

  - **dataSourceRef.kind** (string)，必需

    `kind` 是正被引用的资源的类型。

  - **dataSourceRef.name** (string)，必需

    `name` 是正被引用的资源的名称。

  <!--
  - **dataSourceRef.apiGroup** (string)

    APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.

  - **dataSourceRef.namespace** (string)

    Namespace is the namespace of resource being referenced Note that when a namespace is specified, a gateway.networking.k8s.io/ReferenceGrant object is required in the referent namespace to allow that namespace's owner to accept the reference. See the ReferenceGrant documentation for details. (Alpha) This field requires the CrossNamespaceVolumeDataSource feature gate to be enabled.
  -->

  - **dataSourceRef.apiGroup** (string)

    `apiGroup` 是正被引用的资源的组。如果 `apiGroup` 未被指定，则指定的 `kind` 必须在核心 API 组中。
    对于任何第三方类型，`apiGroup` 是必需的。

  - **dataSourceRef.namespace** (string)

    `namespace` 是正被引用的资源的名字空间。请注意，当指定一个名字空间时，
    在引用的名字空间中 `gateway.networking.k8s.io/ReferenceGrant` 对象是必需的，
    以允许该名字空间的所有者接受引用。有关详细信息，请参阅 ReferenceGrant 文档。
    （Alpha）此字段需要启用 CrossNamespaceVolumeDataSource 特性门控。

- **volumeAttributesClassName** (string)

  <!--
  volumeAttributesClassName may be used to set the VolumeAttributesClass used by this claim. If specified, the CSI driver will create or update the volume with the attributes defined in the corresponding VolumeAttributesClass. This has a different purpose than storageClassName, it can be changed after the claim is created. An empty string or nil value indicates that no VolumeAttributesClass will be applied to the claim. If the claim enters an Infeasible error state, this field can be reset to its previous value (including nil) to cancel the modification. If the resource referred to by volumeAttributesClass does not exist, this PersistentVolumeClaim will be set to a Pending state, as reflected by the modifyVolumeStatus field, until such as a resource exists. More info: https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/
  -->

  `volumeAttributesClassName` 可用于设置此申领所使用的 VolumeAttributesClass。
  如果设置了此字段，CSI 驱动程序将使用相应 VolumeAttributesClass 中定义的属性创建或更新卷。
  与 `storageClassName` 的用途不同，此属性可以在创建申领之后更改。空字符串或 `nil` 值表示不会将 VolumeAttributesClass
  应用于申领。如果声明进入不可行错误状态，此字段可以重置为其之前的值（包括 `nil`）以取消修改。
  如果 VolumeAttributesClass 所引用的资源不存在，则此 PersistentVolumeClaim 将被设置为 Pending 状态，
  如 `modifyVolumeStatus` 字段所示，直到存在此类资源。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volume-attributes-classes/

  （Beta）使用此字段需要启用 VolumeAttributesClass 特性门控（默认情况下关闭）。

## PersistentVolumeClaimStatus {#PersistentVolumeClaimStatus}

<!--
PersistentVolumeClaimStatus is the current status of a persistent volume claim.
-->
PersistentVolumeClaimStatus 是持久卷申领的当前状态。

<hr>

<!--
- **accessModes** ([]string)

  *Atomic: will be replaced during a merge*

  accessModes contains the actual access modes the volume backing the PVC has. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1
-->
- **accessModes** ([]string)

  **原子性：将在合并期间被替换**

  `accessModes` 包含支持 PVC 的卷所具有的实际访问模式。更多信息：
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

  `allocatedResourceStatuses` 存储为给定 PVC 而调整大小的资源的状态。键名遵循标准的
  Kubernetes 标签语法。有效值为：

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

  `ClaimResourceStatus` 可以处于以下任一状态：

  - `ControllerResizeInProgress`：大小调整控制器开始在控制平面中调整卷大小时所设置的状态。
  - `ControllerResizeFailed`：大小调整控制器出现致命错误导致大小调整失败时所设置的状态。
  - `NodeResizePending`：大小调整控制器已完成对卷大小的调整但需要在节点上进一步调整卷大小时的状态。
  - `NodeResizeInProgress`：kubelet 开始调整卷大小时所设置的状态。
  - `NodeResizeFailed`：kubelet 在出现致命错误而导致大小调整失败时所设置的状态。
    临时错误不会设置 `NodeResizeFailed`。

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
  -->

  如果控制器收到具有先前未知的 `resourceName` 或 `ClaimResourceStatus` 的 PVC 更新，
  则该控制器应忽略此项更新才能按预期工作。例如，仅负责调整卷容量大小的控制器应忽略更改与
  PVC 关联的其他合法资源的 PVC 更新。

- **allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  <!--
  allocatedResources tracks the resources allocated to a PVC including its capacity. Key names follow standard Kubernetes label syntax. Valid values are either:
    * Un-prefixed keys:
      - storage - the capacity of the volume.
    * Custom resources must use implementation-defined prefixed names such as "example.com/my-custom-resource"
  Apart from above values - keys that are unprefixed or have kubernetes.io prefix are considered reserved and hence may not be used.
  -->

  `allocatedResources` 跟踪分配给 PVC 的资源，包括其容量。键名遵循标准的 Kubernetes 标签语法。
  有效值为：

  * 未加前缀的键：
    - storage - 卷的容量。
  * 自定义资源必须使用实现定义的带前缀的名称，如 "example.com/my-custom-resource"。

  除上述值之外，未加前缀或具有 `kubernetes.io` 前缀的键被视为保留键，因此不能使用。

  <!--
  Capacity reported here may be larger than the actual capacity when a volume expansion operation is requested. For storage quota, the larger value from allocatedResources and PVC.spec.resources is used. If allocatedResources is not set, PVC.spec.resources alone is used for quota calculation. If a volume expansion capacity request is lowered, allocatedResources is only lowered if there are no expansion operations in progress and if the actual volume capacity is equal or lower than the requested capacity.
  -->

  当出现卷扩充操作请求时，此字段可能大于实际的容量。
  就存储配额而言，将使用 `allocatedResources` 和 `PVC.spec.resources` 二者中的更大值。
  如果未设置 `allocatedResources`，则 `PVC.spec.resources` 单独用于配额计算。
  如果减小一个卷扩充容量请求，则仅当没有正在进行的扩充操作且实际卷容量等于或小于请求的容量时，
  才会减小 `allocatedResources`。

  <!--
  A controller that receives PVC update with previously unknown resourceName should ignore the update for the purpose it was designed. For example - a controller that only is responsible for resizing capacity of the volume, should ignore PVC updates that change other valid resources associated with PVC.
  -->

  如果控制器收到具有先前未知的 resourceName 的 PVC 更新，则该控制器应忽略此项更新才能按预期工作。
  例如，仅负责调整卷容量大小的控制器应忽略更改与 PVC 关联的其他合法资源的 PVC 更新。

<!--
- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity represents the actual resources of the underlying volume.
-->
- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  `capacity` 表示底层卷的实际资源。

<!--
- **conditions** ([]PersistentVolumeClaimCondition)
  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*

  conditions is the current Condition of persistent volume claim. If underlying persistent volume is being resized then the Condition will be set to 'Resizing'.

  <a name="PersistentVolumeClaimCondition"></a>
  *PersistentVolumeClaimCondition contains details about state of pvc*
-->
- **conditions** ([]PersistentVolumeClaimCondition)

  **补丁策略：按照键 `type` 合并**

  **映射：基于 `name` 键的唯一值将在合并期间被保留**

  `conditions` 是持久卷声明的当前的状况。
  如果正在调整底层持久卷的大小，则状况将被设为 “Resizing”。

  <a name="PersistentVolumeClaimCondition"></a>
  **PersistentVolumeClaimCondition 包含有关 PVC 状态的详细信息。**

  <!--
  - **conditions.status** (string), required

    Status is the status of the condition. Can be True, False, Unknown. More info: https://kubernetes.io/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/#:~:text=state%20of%20pvc-,conditions.status,-(string)%2C%20required
  -->

  - **conditions.status** (string)，必需

    `status` 是状况的状态。可选值为 `True`、`False`、`Unknown`。更多信息：
    https://kubernetes.io/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/#:~:text=state%20of%20pvc-,conditions.status,-(string)%2C%20required

  <!--
  - **conditions.type** (string), required

    Type is the type of the condition. More info: https://kubernetes.io/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/#:~:text=set%20to%20%27ResizeStarted%27.-,PersistentVolumeClaimCondition,-contains%20details%20about
  -->

  - **conditions.type** (string)，必需

    `type` 是状况的类型。更多信息：
    https://kubernetes.io/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/#:~:text=set%20to%20%27ResizeStarted%27.-,PersistentVolumeClaimCondition,-contains%20details%20about

  <!--
  - **conditions.lastProbeTime** (Time)
    lastProbeTime is the time we probed the condition.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastProbeTime** (Time)

    `lastProbeTime` 是我们探测 PVC 状况的时间。

    <a name="Time"></a>
    **`Time` 是 `time.Time` 的包装类，支持正确地序列化为 YAML 和 JSON。
    为 `time` 包提供的许多工厂方法提供了包装类。**

  <!--
  - **conditions.lastTransitionTime** (Time)
    lastTransitionTime is the time the condition transitioned from one status to another.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.message** (string)
    message is the human-readable message indicating details about last transition.

  - **conditions.reason** (string)
    reason is a unique, this should be a short, machine understandable string that gives the reason for condition's last transition. If it reports "Resizing" that means the underlying persistent volume is being resized.
  -->

  - **conditions.lastTransitionTime** (Time)

    `lastTransitionTime` 是状况从一个状态转换为另一个状态的时间。

    <a name="Time"></a>
    **`Time` 是 `time.Time` 的包装类，支持正确地序列化为 YAML 和 JSON。
    为 `time` 包提供的许多工厂方法提供了包装类。**

  - **conditions.message** (string)

    `message` 是人类可读的消息，指示有关上一次转换的详细信息。

  - **conditions.reason** (string)

    `reason` 是唯一的，它应该是一个机器可理解的简短字符串，指明上次状况转换的原因。
    如果它报告 “Resizing”，则意味着正在调整底层持久卷的大小。

  - **currentVolumeAttributesClassName** (string)

    <!--
    currentVolumeAttributesClassName is the current name of the VolumeAttributesClass the PVC is using. When unset, there is no VolumeAttributeClass applied to this PersistentVolumeClaim
    -->

    `currentVolumeAttributesClassName` 是 PVC 所使用的 VolumeAttributesClass 的当前名称。

  - **modifyVolumeStatus** (ModifyVolumeStatus)

    <!--
    ModifyVolumeStatus represents the status object of ControllerModifyVolume operation. When this is unset, there is no ModifyVolume operation being attempted.
    -->

    `modifyVolumeStatus` 表示 ControllerModifyVolume 操作的状态对象。
    如果未设置，则表示没有尝试执行任何修改卷操作。

    <!--
    <a name="ModifyVolumeStatus"></a>
    *ModifyVolumeStatus represents the status object of ControllerModifyVolume operation*
    -->

    <a name="ModifyVolumeStatus"></a>
    **ModifyVolumeStatus 表示 ControllerModifyVolume 操作的状态对象**

  <!--
  - **modifyVolumeStatus.status** (string), required

    status is the status of the ControllerModifyVolume operation. It can be in any of following states:
     - Pending
       Pending indicates that the PersistentVolumeClaim cannot be modified due to unmet requirements, such as
       the specified VolumeAttributesClass not existing.
     - InProgress
       InProgress indicates that the volume is being modified.
     - Infeasible
      Infeasible indicates that the request has been rejected as invalid by the CSI driver. To
         resolve the error, a valid VolumeAttributesClass needs to be specified.
    Note: New statuses can be added in the future. Consumers should check for unknown statuses and fail appropriately.
  -->

  - **modifyVolumeStatus.status** (string)，必需

    `status` 是 ControllerModifyVolume 操作的状态。它可以是以下任一状态：

    - Pending

      `Pending` 表示由于未满足要求（例如指定的 VolumeAttributesClass 不存在）而无法修改 PersistentVolumeClaim。

    - InProgress

      `InProgress` 表示卷正在被修改。

    - Infeasible

      `Infeasible` 表示请求已被 CSI 驱动程序拒绝，因为请求无效。要解决此错误，
      需要指定有效的 VolumeAttributesClass。

    注意：将来可能会添加新状态。消费者应当检查未知状态，并适当地处理失败情况。

    <!--
    Possible enum values:
     - `"InProgress"` InProgress indicates that the volume is being modified
     - `"Infeasible"` Infeasible indicates that the request has been rejected as invalid by the CSI driver. To resolve the error, a valid VolumeAttributesClass needs to be specified
     - `"Pending"` Pending indicates that the PersistentVolumeClaim cannot be modified due to unmet requirements, such as the specified VolumeAttributesClass not existing
    -->

    可能的枚举值：
      - `"InProgress"` 表示卷正在被修改
      - `"Infeasible"` 表示请求被 CSI 驱动认定为无效而被拒绝。要解决此错误，
        需要指定一个有效的 VolumeAttributesClass
      - `"Pending"` 表示由于未满足的要求（例如指定的 VolumeAttributesClass 不存在），
        PersistentVolumeClaim 无法被修改

  - **modifyVolumeStatus.targetVolumeAttributesClassName** (string)

  <!--
  targetVolumeAttributesClassName is the name of the VolumeAttributesClass the PVC currently being reconciled
  -->

  `targetVolumeAttributesClassName` 是当前正在协调的 PVC 的 VolumeAttributesClass 的名称。

<!--
- **phase** (string)
  phase represents the current phase of PersistentVolumeClaim.
-->
- **phase** (string)

  `phase` 表示 PersistentVolumeClaim 的当前阶段。

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

  `items` 是持久卷申领的列表。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

<!--
## Operations {#Operations}
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified PersistentVolumeClaim
#### HTTP Request
-->
### `get` 读取指定的 PersistentVolumeClaim

#### HTTP 请求

GET /api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the PersistentVolumeClaim

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  PersistentVolumeClaim 的名称。

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

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  PersistentVolumeClaim 的名称。

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

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
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

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
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

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  PersistentVolumeClaim 的名称。

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

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  PersistentVolumeClaim 的名称。

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
-->
#### 参数
- **name** (**路径参数**): string，必需

  PersistentVolumeClaim 的名称。

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
-->
#### 参数

- **name** (**路径参数**): string，必需

  PersistentVolumeClaim 的名称。

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

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
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

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

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

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

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
