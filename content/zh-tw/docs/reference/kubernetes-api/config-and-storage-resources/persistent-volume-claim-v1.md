---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "PersistentVolumeClaim"
content_type: "api_reference"
description: "PersistentVolumeClaim 是使用者針對一個持久卷的請求和申領。"
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
PersistentVolumeClaim 是使用者針對一個持久卷的請求和申領。

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

  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimSpec" >}}">PersistentVolumeClaimSpec</a>)

  `spec` 定義 Pod 作者所請求的卷的預期特徵。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

<!--
- **status** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimStatus" >}}">PersistentVolumeClaimStatus</a>)

  status represents the current information/status of a persistent volume claim. Read-only. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims
-->
- **status** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimStatus" >}}">PersistentVolumeClaimStatus</a>)

  `status` 表示一個持久卷申領的當前信息/狀態。只讀。更多信息：
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
PersistentVolumeClaimSpec 描述存儲設備的常用參數，並支持通過 source 來設置特定於提供商的屬性。

<hr>

- **accessModes** ([]string)

  **原子性：將在合併期間被替換**

  `accessModes` 包含卷應具備的預期訪問模式。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#access-modes-1

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  `selector` 是在綁定時對捲進行選擇所執行的標籤查詢。

<!--
-  **resources** (VolumeResourceRequirements)

  resources represents the minimum resources the volume should have. If RecoverVolumeExpansionFailure feature is enabled users are allowed to specify resource requirements that are lower than previous value but must still be higher than capacity recorded in the status field of the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources
-->
-  **resources** (VolumeResourceRequirements)

  `resources` 表示卷應擁有的最小資源。
  如果啓用了 RecoverVolumeExpansionFailure 功能特性，則允許使用者指定這些資源要求，
  此值必須低於之前的值，但必須高於申領的狀態字段中記錄的容量。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#resources

  <!--
  <a name="VolumeResourceRequirements"></a>
  *VolumeResourceRequirements describes the storage resource requirements for a volume.*
  -->

  <a name="VolumeResourceRequirements"></a>
  **VolumeResourceRequirements 描述了卷的存儲資源要求。**

  <!--
  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)
    Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
  -->

  - **resources.limits** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    limits 描述允許的最大計算資源量。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

  - **resources.requests** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    requests 描述所需的最小計算資源量。
    如果針對容器省略 requests，則在顯式指定的情況下默認爲 limits，否則爲具體實現所定義的值。請求不能超過限制。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/configuration/manage-resources-containers/

<!--
- **volumeName** (string)
  volumeName is the binding reference to the PersistentVolume backing this claim.

- **storageClassName** (string)
  storageClassName is the name of the StorageClass required by the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1
-->
- **volumeName** (string)

  `volumeName` 是對此申領所對應的 PersistentVolume 的綁定引用。

- **storageClassName** (string)

  `storageClassName` 是此申領所要求的 StorageClass 名稱。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#class-1

<!--
- **volumeMode** (string)
  volumeMode defines what type of volume is required by the claim. Value of Filesystem is implied when not included in claim spec.

  Possible enum values:
   - `"Block"` means the volume will not be formatted with a filesystem and will remain a raw block device.
   - `"Filesystem"` means the volume will be or is formatted with a filesystem.
-->

- **volumeMode** (string)

  volumeMode 定義申領需要哪種類別的卷。當申領規約中未包含此字段時，意味着取值爲 Filesystem。
  
  可能的枚舉值：
  - `"Block"` 表示卷不會被格式化爲某個文件系統，將保持爲原始塊設備。
  - `"Filesystem"` 表示卷將會或已經被格式化爲文件系統。

<!--
### Beta level

- **dataSource** (<a href="{{< ref "../common-definitions/typed-local-object-reference#TypedLocalObjectReference" >}}">TypedLocalObjectReference</a>)

  dataSource field can be used to specify either: * An existing VolumeSnapshot object (snapshot.storage.k8s.io/VolumeSnapshot) * An existing PVC (PersistentVolumeClaim) If the provisioner or an external controller can support the specified data source, it will create a new volume based on the contents of the specified data source. When the AnyVolumeDataSource feature gate is enabled, dataSource contents will be copied to dataSourceRef, and dataSourceRef contents will be copied to dataSource when dataSourceRef.namespace is not specified. If the namespace is specified, then dataSourceRef will not be copied to dataSource.
-->
### Beta 級別

- **dataSource** (<a href="{{< ref "../common-definitions/typed-local-object-reference#TypedLocalObjectReference" >}}">TypedLocalObjectReference</a>)

  `dataSource` 字段可用於二選一：

  - 現有的 VolumeSnapshot 對象（`snapshot.storage.k8s.io/VolumeSnapshot`）

  - 現有的 PVC (PersistentVolumeClaim)

  如果製備器或外部控制器可以支持指定的數據源，則它將根據指定數據源的內容創建新的卷。
  當 AnyVolumeDataSource 特性門控被啓用時，`dataSource` 內容將被複制到 `dataSourceRef`，
  當 `dataSourceRef.namespace` 未被指定時，`dataSourceRef` 內容將被複制到 `dataSource`。
  如果名字空間被指定，則 `dataSourceRef` 不會被複制到 `dataSource`。

<!--
- **dataSourceRef** (TypedObjectReference)

dataSourceRef specifies the object from which to populate the volume with data, if a non-empty volume is desired. This may be any object from a non-empty API group (non core object) or a PersistentVolumeClaim object. When this field is specified, volume binding will only succeed if the type of the specified object matches some installed volume populator or dynamic provisioner. This field will replace the functionality of the dataSource field and as such if both fields are non-empty, they must have the same value. For backwards compatibility, when namespace isn't specified in dataSourceRef, both fields (dataSource and dataSourceRef) will be set to the same value automatically if one of them is empty and the other is non-empty. When namespace is specified in dataSourceRef, dataSource isn't set to the same value and must be empty. There are three important differences between dataSource and dataSourceRef:
-->
- **dataSourceRef** (TypedObjectReference)

  `dataSourceRef` 指定一個對象，當需要非空卷時，可以使用它來爲卷填充數據。
  此字段值可以是來自非空 API 組（非核心對象）的任意對象，或一個 PersistentVolumeClaim 對象。
  如果設置了此字段，則僅當所指定對象的類型與所安裝的某些卷填充器或動態製備器匹配時，卷綁定纔會成功。
  此字段將替換 `dataSource` 字段的功能，因此如果兩個字段非空，其取值必須相同。
  爲了向後兼容，當未在 `dataSourceRef` 中指定名字空間時，
  如果（`dataSource` 和 `dataSourceRef`）其中一個字段爲空且另一個字段非空，則兩個字段將被自動設爲相同的值。
  在 `dataSourceRef` 中指定名字空間時，`dataSource` 未被設置爲相同的值且必須爲空。
  `dataSource` 和 `dataSourceRef` 之間有三個重要的區別：

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

  * `dataSource` 僅允許兩個特定類型的對象，而 `dataSourceRef` 允許任何非核心對象以及 PersistentVolumeClaim 對象。
  * `dataSource` 忽略不允許的值（這類值會被丟棄），而 `dataSourceRef` 保留所有值並在指定不允許的值時產生錯誤。
  * `dataSource` 僅允許本地對象，而 `dataSourceRef` 允許任意名字空間中的對象。

  (Beta) 使用此字段需要啓用 AnyVolumeDataSource 特性門控。
  (Alpha) 使用 `dataSourceRef` 的名字空間字段需要啓用 CrossNamespaceVolumeDataSource 特性門控。

  <!--
  <a name="TypedObjectReference"></a>
  *TypedObjectReference contains enough information to let you locate the typed referenced object*
  -->

  <a name="TypedObjectReference"></a>
  **`TypedObjectReference` 包含足夠的信息，可以讓你定位特定類型的引用對象。**

  <!--
  - **dataSourceRef.kind** (string), required

    Kind is the type of resource being referenced

  - **dataSourceRef.name** (string), required

    Name is the name of resource being referenced
  -->

  - **dataSourceRef.kind** (string)，必需

    `kind` 是正被引用的資源的類型。

  - **dataSourceRef.name** (string)，必需

    `name` 是正被引用的資源的名稱。

  <!--
  - **dataSourceRef.apiGroup** (string)

    APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.

  - **dataSourceRef.namespace** (string)

    Namespace is the namespace of resource being referenced Note that when a namespace is specified, a gateway.networking.k8s.io/ReferenceGrant object is required in the referent namespace to allow that namespace's owner to accept the reference. See the ReferenceGrant documentation for details. (Alpha) This field requires the CrossNamespaceVolumeDataSource feature gate to be enabled.
  -->

  - **dataSourceRef.apiGroup** (string)

    `apiGroup` 是正被引用的資源的組。如果 `apiGroup` 未被指定，則指定的 kind 必須在覈心 API 組中。
    對於任何第三方類型，`apiGroup` 是必需的。

  - **dataSourceRef.namespace** (string)

    `namespace` 是正被引用的資源的名字空間。請注意，當指定一個名字空間時，
    在引用的名字空間中 `gateway.networking.k8s.io/ReferenceGrant` 對象是必需的，
    以允許該名字空間的所有者接受引用。有關詳細信息，請參閱 ReferenceGrant 文檔。
    (Alpha) 此字段需要啓用 CrossNamespaceVolumeDataSource 特性門控。

- **volumeAttributesClassName** (string)

  <!--
  volumeAttributesClassName may be used to set the VolumeAttributesClass used by this claim. If specified, the CSI driver will create or update the volume with the attributes defined in the corresponding VolumeAttributesClass. This has a different purpose than storageClassName, it can be changed after the claim is created. An empty string or nil value indicates that no VolumeAttributesClass will be applied to the claim. If the claim enters an Infeasible error state, this field can be reset to its previous value (including nil) to cancel the modification. If the resource referred to by volumeAttributesClass does not exist, this PersistentVolumeClaim will be set to a Pending state, as reflected by the modifyVolumeStatus field, until such as a resource exists. More info: https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/
  -->

  `volumeAttributesClassName` 可用於設置此申領所使用的 VolumeAttributesClass。
  如果設置了此字段，CSI 驅動程序將使用相應 VolumeAttributesClass 中定義的屬性創建或更新卷。
  與 `storageClassName` 的用途不同，此屬性可以在創建申領之後更改。空字符串或 `nil` 值表示不會將 VolumeAttributesClass
  應用於申領。如果聲明進入不可行錯誤狀態，此字段可以重置爲其之前的值（包括 `nil`）以取消修改。
  如果 VolumeAttributesClass 所引用的資源不存在，則此 PersistentVolumeClaim 將被設置爲 Pending 狀態，
  如 `modifyVolumeStatus` 字段所示，直到存在此類資源。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volume-attributes-classes/

  （Beta）使用此字段需要啓用 VolumeAttributesClass 特性門控（默認情況下關閉）。

## PersistentVolumeClaimStatus {#PersistentVolumeClaimStatus}

<!--
PersistentVolumeClaimStatus is the current status of a persistent volume claim.

<hr>

- **accessModes** ([]string)

  *Atomic: will be replaced during a merge*

  accessModes contains the actual access modes the volume backing the PVC has. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1
-->
PersistentVolumeClaimStatus 是持久卷申領的當前狀態。

<hr>

- **accessModes** ([]string)

  **原子性：將在合併期間被替換**

  `accessModes` 包含支持 PVC 的卷所具有的實際訪問模式。更多信息：
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

  `allocatedResourceStatuses` 存儲爲給定 PVC 而調整大小的資源的狀態。鍵名遵循標準的 Kubernetes 標籤語法。
  有效值爲：

  * 未加前綴的鍵：
    - storage - 卷的容量。
  * 自定義資源必須使用實現定義的帶前綴的名稱，如 "example.com/my-custom-resource"。

  除上述值之外，未加前綴或具有 `kubernetes.io` 前綴的鍵被視爲保留鍵，因此不能使用。

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

  `ClaimResourceStatus` 可以處於以下任一狀態：

  - `ControllerResizeInProgress`：大小調整控制器開始在控制平面中調整卷大小時所設置的狀態。
  - `ControllerResizeFailed`：大小調整控制器出現致命錯誤導致大小調整失敗時所設置的狀態。
  - `NodeResizePending`：大小調整控制器已完成對卷大小的調整但需要在節點上進一步調整卷大小時的狀態。
  - `NodeResizeInProgress`：kubelet 開始調整卷大小時所設置的狀態。
  - `NodeResizeFailed`：kubelet 在出現致命錯誤而導致大小調整失敗時所設置的狀態。
    臨時錯誤不會設置 `NodeResizeFailed`。

  <!--
  For example: if expanding a PVC for more capacity - this field can be one of the following states:
  	- pvc.status.allocatedResourceStatus['storage'] = "ControllerResizeInProgress"
       - pvc.status.allocatedResourceStatus['storage'] = "ControllerResizeFailed"
       - pvc.status.allocatedResourceStatus['storage'] = "NodeResizePending"
       - pvc.status.allocatedResourceStatus['storage'] = "NodeResizeInProgress"
       - pvc.status.allocatedResourceStatus['storage'] = "NodeResizeFailed"
  When this field is not set, it means that no resize operation is in progress for the given PVC.
  -->

  例如：如果擴展 PVC 以獲取更多的容量，則此字段可以是以下狀態之一：

  - pvc.status.allocatedResourceStatus['storage'] = "ControllerResizeInProgress"
    - pvc.status.allocatedResourceStatus['storage'] = "ControllerResizeFailed"
    - pvc.status.allocatedResourceStatus['storage'] = "NodeResizePending"
    - pvc.status.allocatedResourceStatus['storage'] = "NodeResizeInProgress"
    - pvc.status.allocatedResourceStatus['storage'] = "NodeResizeFailed"

  當未設置此字段時，表示沒有針對給定 PVC 執行大小調整操作。

  <!--
  A controller that receives PVC update with previously unknown resourceName or ClaimResourceStatus should ignore the update for the purpose it was designed. For example - a controller that only is responsible for resizing capacity of the volume, should ignore PVC updates that change other valid resources associated with PVC.
  
  This is an alpha field and requires enabling RecoverVolumeExpansionFailure feature.
  -->

  如果控制器收到具有先前未知的 `resourceName` 或 `ClaimResourceStatus` 的 PVC 更新，
  則該控制器應忽略此項更新才能按預期工作。例如，僅負責調整卷容量大小的控制器應忽略更改與
  PVC 關聯的其他合法資源的 PVC 更新。

  這是一個 Alpha 字段，需要啓用 RecoverVolumeExpansionFailure 功能特性。

- **allocatedResources** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  <!--
  allocatedResources tracks the resources allocated to a PVC including its capacity. Key names follow standard Kubernetes label syntax. Valid values are either:
  	* Un-prefixed keys:
  		- storage - the capacity of the volume.
  	* Custom resources must use implementation-defined prefixed names such as "example.com/my-custom-resource"
  Apart from above values - keys that are unprefixed or have kubernetes.io prefix are considered reserved and hence may not be used.
  -->

  `allocatedResources` 跟蹤分配給 PVC 的資源，包括其容量。鍵名遵循標準的 Kubernetes 標籤語法。
  有效值爲：

  * 未加前綴的鍵：
    - storage - 卷的容量。
  * 自定義資源必須使用實現定義的帶前綴的名稱，如 "example.com/my-custom-resource"。

  除上述值之外，未加前綴或具有 `kubernetes.io` 前綴的鍵被視爲保留鍵，因此不能使用。

  <!--
  Capacity reported here may be larger than the actual capacity when a volume expansion operation is requested. For storage quota, the larger value from allocatedResources and PVC.spec.resources is used. If allocatedResources is not set, PVC.spec.resources alone is used for quota calculation. If a volume expansion capacity request is lowered, allocatedResources is only lowered if there are no expansion operations in progress and if the actual volume capacity is equal or lower than the requested capacity.
  -->

  當出現卷擴充操作請求時，此字段可能大於實際的容量。
  就存儲配額而言，將使用 `allocatedResources` 和 `PVC.spec.resources` 二者中的更大值。
  如果未設置 `allocatedResources`，則 `PVC.spec.resources` 單獨用於配額計算。
  如果減小一個卷擴充容量請求，則僅當沒有正在進行的擴充操作且實際卷容量等於或小於請求的容量時，
  纔會減小 `allocatedResources`。

  <!--
  A controller that receives PVC update with previously unknown resourceName should ignore the update for the purpose it was designed. For example - a controller that only is responsible for resizing capacity of the volume, should ignore PVC updates that change other valid resources associated with PVC.

  This is an alpha field and requires enabling RecoverVolumeExpansionFailure feature.
  -->

  如果控制器收到具有先前未知的 resourceName 的 PVC 更新，則該控制器應忽略此項更新才能按預期工作。
  例如，僅負責調整卷容量大小的控制器應忽略更改與 PVC 關聯的其他合法資源的 PVC 更新。

  這是一個 Alpha 字段，需要啓用 RecoverVolumeExpansionFailure 功能特性。

<!--
- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  capacity represents the actual resources of the underlying volume.
-->
- **capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  `capacity` 表示底層卷的實際資源。

<!--
- **conditions** ([]PersistentVolumeClaimCondition)
  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*

  conditions is the current Condition of persistent volume claim. If underlying persistent volume is being resized then the Condition will be set to 'Resizing'.

  <a name="PersistentVolumeClaimCondition"></a>
  *PersistentVolumeClaimCondition contains details about state of pvc*
-->
- **conditions** ([]PersistentVolumeClaimCondition)

  **補丁策略：按照鍵 `type` 合併**

  **映射：基於 `name` 鍵的唯一值將在合併期間被保留**

  `conditions` 是持久卷聲明的當前的狀況。
  如果正在調整底層持久卷的大小，則狀況將被設爲 “Resizing”。

  <a name="PersistentVolumeClaimCondition"></a>
  **PersistentVolumeClaimCondition 包含有關 PVC 狀態的詳細信息。**

  <!--
  - **conditions.status** (string), required

    Status is the status of the condition. Can be True, False, Unknown. More info: https://kubernetes.io/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/#:~:text=state%20of%20pvc-,conditions.status,-(string)%2C%20required
  -->

  - **conditions.status** (string)，必需

    `status` 是狀況的狀態。可選值爲 True、False、Unknown。更多信息：
    https://kubernetes.io/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/#:~:text=state%20of%20pvc-,conditions.status,-(string)%2C%20required

  <!--
  - **conditions.type** (string), required

    Type is the type of the condition. More info: https://kubernetes.io/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/#:~:text=set%20to%20%27ResizeStarted%27.-,PersistentVolumeClaimCondition,-contains%20details%20about
  -->

  - **conditions.type** (string)，必需

    `type` 是狀況的類型。更多信息：
    https://kubernetes.io/zh-cn/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/#:~:text=set%20to%20%27ResizeStarted%27.-,PersistentVolumeClaimCondition,-contains%20details%20about

  <!--
  - **conditions.lastProbeTime** (Time)
    lastProbeTime is the time we probed the condition.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->

  - **conditions.lastProbeTime** (Time)
    
    `lastProbeTime` 是我們探測 PVC 狀況的時間。
    
    <a name="Time"></a>
    **`Time` 是 `time.Time` 的包裝類，支持正確地序列化爲 YAML 和 JSON。
    爲 `time` 包提供的許多工廠方法提供了包裝類。**

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

    `lastTransitionTime` 是狀況從一個狀態轉換爲另一個狀態的時間。

    <a name="Time"></a>
    **`Time` 是 `time.Time` 的包裝類，支持正確地序列化爲 YAML 和 JSON。
    爲 `time` 包提供的許多工廠方法提供了包裝類。**

  - **conditions.message** (string)

    `message` 是人類可讀的消息，指示有關上一次轉換的詳細信息。

  - **conditions.reason** (string)

    `reason` 是唯一的，它應該是一個機器可理解的簡短字符串，指明上次狀況轉換的原因。
    如果它報告 “Resizing”，則意味着正在調整底層持久卷的大小。

  - **currentVolumeAttributesClassName** (string)

    <!--
    currentVolumeAttributesClassName is the current name of the VolumeAttributesClass the PVC is using. When unset, there is no VolumeAttributeClass applied to this PersistentVolumeClaim
    -->

    `currentVolumeAttributesClassName` 是 PVC 所使用的 VolumeAttributesClass 的當前名稱。

  - **modifyVolumeStatus** (ModifyVolumeStatus)

    <!--
    ModifyVolumeStatus represents the status object of ControllerModifyVolume operation. When this is unset, there is no ModifyVolume operation being attempted.
    -->

    `modifyVolumeStatus` 表示 ControllerModifyVolume 操作的狀態對象。
    如果未設置，則表示沒有嘗試執行任何修改卷操作。

    <!--
    <a name="ModifyVolumeStatus"></a>
    *ModifyVolumeStatus represents the status object of ControllerModifyVolume operation*
    -->

    <a name="ModifyVolumeStatus"></a>
    **ModifyVolumeStatus 表示 ControllerModifyVolume 操作的狀態對象**

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

    `status` 是 ControllerModifyVolume 操作的狀態。它可以是以下任一狀態：

    - Pending

      `Pending` 表示由於未滿足要求（例如指定的 VolumeAttributesClass 不存在）而無法修改 PersistentVolumeClaim。

    - InProgress

      `InProgress` 表示卷正在被修改。

    - Infeasible

      `Infeasible` 表示請求已被 CSI 驅動程序拒絕，因爲請求無效。要解決此錯誤，需要指定有效的 VolumeAttributesClass。

    注意：將來可能會添加新狀態。消費者應當檢查未知狀態，並適當地處理失敗情況。

    <!--
    Possible enum values:
     - `"InProgress"` InProgress indicates that the volume is being modified
     - `"Infeasible"` Infeasible indicates that the request has been rejected as invalid by the CSI driver. To resolve the error, a valid VolumeAttributesClass needs to be specified
     - `"Pending"` Pending indicates that the PersistentVolumeClaim cannot be modified due to unmet requirements, such as the specified VolumeAttributesClass not existing
    -->
  
    可能的枚舉值：
      - `"InProgress"` 表示卷正在被修改
      - `"Infeasible"` 表示請求被 CSI 驅動認定爲無效而被拒絕。要解決此錯誤，
        需要指定一個有效的 VolumeAttributesClass
      - `"Pending"` 表示由於未滿足的要求（例如指定的 VolumeAttributesClass 不存在），
        PersistentVolumeClaim 無法被修改  

  - **modifyVolumeStatus.targetVolumeAttributesClassName** (string)

  <!--
  targetVolumeAttributesClassName is the name of the VolumeAttributesClass the PVC currently being reconciled
  -->

  `targetVolumeAttributesClassName` 是當前正在協調的 PVC 的 VolumeAttributesClass 的名稱。

<!--
- **phase** (string)
  phase represents the current phase of PersistentVolumeClaim.
-->
- **phase** (string)

  `phase` 表示 PersistentVolumeClaim 的當前階段。

## PersistentVolumeClaimList {#PersistentVolumeClaimList}

<!--
PersistentVolumeClaimList is a list of PersistentVolumeClaim items.
-->
PersistentVolumeClaimList 是 PersistentVolumeClaim 各項的列表。

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

  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>)，必需

  `items` 是持久卷申領的列表。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

<!--
## Operations {#Operations}
<hr>
### `get` read the specified PersistentVolumeClaim
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 PersistentVolumeClaim

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolumeClaim 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

401: Unauthorized

<!--
### `get` read status of the specified PersistentVolumeClaim
#### HTTP Request
-->
### `get` 讀取指定的 PersistentVolumeClaim 的狀態

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolumeClaim 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PersistentVolumeClaim
#### HTTP Request
-->
### `list` 列出或觀測類別爲 PersistentVolumeClaim 的對象

#### HTTP 請求

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
#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimList" >}}">PersistentVolumeClaimList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PersistentVolumeClaim
#### HTTP Request
-->
### `list` 列出或觀測類別爲 PersistentVolumeClaim 的對象

#### HTTP 請求

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

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimList" >}}">PersistentVolumeClaimList</a>): OK

401: Unauthorized

<!--
### `create` create a PersistentVolumeClaim
#### HTTP Request
-->
### `create` 創建 PersistentVolumeClaim

#### HTTP 請求

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
#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

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

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified PersistentVolumeClaim
#### HTTP Request
-->
### `update` 替換指定的 PersistentVolumeClaim

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolumeClaim 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

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

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

401: Unauthorized

<!--
### `update` replace status of the specified PersistentVolumeClaim
#### HTTP Request
-->
### `update` 替換指定的 PersistentVolumeClaim 的狀態

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolumeClaim 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

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

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified PersistentVolumeClaim
#### HTTP Request
-->
### `patch` 部分更新指定的 PersistentVolumeClaim

#### HTTP 請求

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
#### 參數
- **name** (**路徑參數**): string，必需

  PersistentVolumeClaim 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

401: Unauthorized

<!--
### `patch` partially update status of the specified PersistentVolumeClaim
#### HTTP Request
-->
### `patch` 部分更新指定的 PersistentVolumeClaim 的狀態

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolumeClaim 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Created

401: Unauthorized

<!--
### `delete` delete a PersistentVolumeClaim
#### HTTP Request
-->
### `delete` 刪除 PersistentVolumeClaim

#### HTTP 請求

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
#### 參數

- **name** (**路徑參數**): string，必需

  PersistentVolumeClaim 的名稱

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

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

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaim" >}}">PersistentVolumeClaim</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of PersistentVolumeClaim
#### HTTP Request
-->
### `deletecollection` 刪除 PersistentVolumeClaim 的集合

#### HTTP 請求

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
#### 參數

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

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
