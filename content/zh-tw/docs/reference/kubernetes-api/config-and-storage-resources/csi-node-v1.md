---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSINode"
content_type: "api_reference"
description: "CSINode 包含節點上安裝的所有 CSI 驅動有關的信息。"
title: "CSINode"
weight: 4
---
<!--
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSINode"
content_type: "api_reference"
description: "CSINode holds information about all CSI drivers installed on a node."
title: "CSINode"
weight: 4
-->

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## CSINode {#CSINode}

<!--
CSINode holds information about all CSI drivers installed on a node. CSI drivers do not need to create the CSINode object directly. As long as they use the node-driver-registrar sidecar container, the kubelet will automatically populate the CSINode object for the CSI driver as part of kubelet plugin registration. CSINode has the same name as a node. If the object is missing, it means either there are no CSI Drivers available on the node, or the Kubelet version is low enough that it doesn't create this object. CSINode has an OwnerReference that points to the corresponding node object.
-->
CSINode 包含節點上安裝的所有 CSI 驅動有關的信息。CSI 驅動不需要直接創建 CSINode 對象。
只要這些驅動使用 node-driver-registrar 邊車容器，kubelet 就會自動爲 CSI 驅動填充 CSINode 對象，
作爲 kubelet 插件註冊操作的一部分。CSINode 的名稱與節點名稱相同。
如果不存在此對象，則說明該節點上沒有可用的 CSI 驅動或 Kubelet 版本太低無法創建該對象。
CSINode 包含指向相應節點對象的 OwnerReference。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSINode

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. metadata.name must be the Kubernetes node name.

- **spec** (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINodeSpec" >}}">CSINodeSpec</a>), required
  spec is the specification of CSINode
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  標準的對象元數據。metadata.name 必須是 Kubernetes 節點的名稱。

- **spec** (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINodeSpec" >}}">CSINodeSpec</a>)，必需

  spec 是 CSINode 的規約。

## CSINodeSpec {#CSINodeSpec}

<!--
CSINodeSpec holds information about the specification of all CSI drivers installed on a node
-->
CSINodeSpec 包含一個節點上安裝的所有 CSI 驅動規約有關的信息。

<hr>

<!--
- **drivers** ([]CSINodeDriver), required

  *Patch strategy: merge on key `name`*

  *Map: unique values on key name will be kept during a merge*

  drivers is a list of information of all CSI Drivers existing on a node. If all drivers in the list are uninstalled, this can become empty.

  <a name="CSINodeDriver"></a>
  *CSINodeDriver holds information about the specification of one CSI driver installed on a node*

  - **drivers.name** (string), required

    name represents the name of the CSI driver that this object refers to. This MUST be the same name returned by the CSI GetPluginName() call for that driver.
-->
- **drivers** ([]CSINodeDriver)，必需

  **補丁策略：按照鍵 `name` 合併**

  **映射：鍵 `name` 的唯一值將在合併過程中保留**

  drivers 是節點上存在的所有 CSI 驅動的信息列表。如果列表中的所有驅動均被卸載，則此字段可以爲空。

  <a name="CSINodeDriver"></a>
  **CSINodeDriver 包含一個節點上安裝的一個 CSI 驅動規約有關的信息。**

  - **drivers.name** (string)，必需

    name 表示該對象引用的 CSI 驅動的名稱。此字段值必須是針對該驅動由 CSI GetPluginName() 調用返回的相同名稱。

  <!--
  - **drivers.nodeID** (string), required
    nodeID of the node from the driver point of view. This field enables Kubernetes to communicate with storage systems that do not share the same nomenclature for nodes. For example, Kubernetes may refer to a given node as "node1", but the storage system may refer to the same node as "nodeA". When Kubernetes issues a command to the storage system to attach a volume to a specific node, it can use this field to refer to the node name using the ID that the storage system will understand, e.g. "nodeA" instead of "node1". This field is required.
  -->

  - **drivers.nodeID** (string)，必需

    從驅動角度來看，這是節點的 nodeID。
    對於未與節點共享相同命名法的存儲系統，此字段使得 Kubernetes 能夠與之進行通信。
    例如，Kubernetes 可能將給定節點視爲 "node1"，但存儲系統可以將同一節點視爲 "nodeA"。
    當 Kubernetes 向存儲系統發出一條命令將一個卷掛接到特定的節點時，
    它可以藉此字段使用存儲系統所理解的 ID 引用節點名稱，例如使用 “nodeA” 而不是 “node1”。
    此字段是必需的。

  <!--
  - **drivers.allocatable** (VolumeNodeResources)

    allocatable represents the volume resources of a node that are available for scheduling. This field is beta.

    <a name="VolumeNodeResources"></a>
    *VolumeNodeResources is a set of resource limits for scheduling of volumes.*
  -->

  - **drivers.allocatable** (VolumeNodeResources)

    allocatable 表示一個節點上可供調度的卷資源。此字段處於 Beta 階段。

    <a name="VolumeNodeResources"></a>
    **VolumeNodeResources 是調度卷時所用的一組資源限制。**

    <!--
    - **drivers.allocatable.count** (int32)

      count indicates the maximum number of unique volumes managed by the CSI driver that can be used on a node. A volume that is both attached and mounted on a node is considered to be used once, not twice. The same rule applies for a unique volume that is shared among multiple pods on the same node. If this field is not specified, then the supported number of volumes on this node is unbounded.
    -->

    - **drivers.allocatable.count** (int32)

      這是一個節點上可使用的、由 CSI 驅動管理的獨立卷個數的上限。
      掛接並掛載到一個節點上的卷被視爲被使用一次，不是兩次。
      相同的規則適用於同一個節點上多個 Pod 之間共享的同一個卷。
      如果未指定此字段，則該節點上支持的卷數量是無限的。

  <!--
  - **drivers.topologyKeys** ([]string)

    *Atomic: will be replaced during a merge*
  
    topologyKeys is the list of keys supported by the driver. When a driver is initialized on a cluster, it provides a set of topology keys that it understands (e.g. "company.com/zone", "company.com/region"). When a driver is initialized on a node, it provides the same topology keys along with values. Kubelet will expose these topology keys as labels on its own node object. When Kubernetes does topology aware provisioning, it can use this list to determine which labels it should retrieve from the node object and pass back to the driver. It is possible for different nodes to use different topology keys. This can be empty if driver does not support topology.
  -->

  - **drivers.topologyKeys** ([]string)

    **原子性：合併期間將被替換**

    topologyKeys 是驅動支持的鍵的列表。
    在集羣上初始化一個驅動時，該驅動將提供一組自己理解的拓撲鍵
    （例如 “company.com/zone”、“company.com/region”）。
    在一個節點上初始化一個驅動時，該驅動將提供相同的拓撲鍵和值。
    Kubelet 將在其自己的節點對象上將這些拓撲鍵暴露爲標籤。
    當 Kubernetes 進行拓撲感知的製備時，可以使用此列表決定應從節點對象中檢索哪些標籤並傳回驅動。
    不同的節點可以使用不同的拓撲鍵。
    如果驅動不支持拓撲，則此字段可以爲空。

## CSINodeList {#CSINodeList}

<!--
CSINodeList is a collection of CSINode objects.
-->
CSINodeList 是 CSINode 對象的集合。

<hr>

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSINodeList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>), required
  items is the list of CSINode
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的列表元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>)，必需

  items 是 CSINode 的列表。

<!--
## Operations {#Operations}
<hr>
### `get` read the specified CSINode
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 讀取指定的 CSINode

#### HTTP 請求

GET /apis/storage.k8s.io/v1/csinodes/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSINode
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CSINode 的名稱。

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind CSINode
#### HTTP Request
-->
### `list` 列舉或觀測類別爲 CSINode 的對象

#### HTTP 請求

GET /apis/storage.k8s.io/v1/csinodes

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINodeList" >}}">CSINodeList</a>): OK

401: Unauthorized

<!--
### `create` create a CSINode
#### HTTP Request
-->
### `create` 創建 CSINode

#### HTTP 請求

POST /apis/storage.k8s.io/v1/csinodes

<!--
#### Parameters
- **body**: <a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified CSINode
#### HTTP Request
-->
### `update` 替換指定的 CSINode

#### HTTP 請求

PUT /apis/storage.k8s.io/v1/csinodes/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSINode
- **body**: <a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CSINode 的名稱。

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified CSINode
#### HTTP Request
-->
### `patch` 部分更新指定的 CSINode

#### HTTP 請求

PATCH /apis/storage.k8s.io/v1/csinodes/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSINode
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CSINode 的名稱。

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Created

401: Unauthorized

<!--
### `delete` delete a CSINode
#### HTTP Request
-->
### `delete` 刪除 CSINode

#### HTTP 請求

DELETE /apis/storage.k8s.io/v1/csinodes/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSINode
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 參數

- **name** (**路徑參數**): string，必需

  CSINode 的名稱。

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of CSINode
#### HTTP Request
-->
### `deletecollection` 刪除 CSINode 的集合

#### HTTP 請求

DELETE /apis/storage.k8s.io/v1/csinodes

<!--
#### Parameters
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
-->
#### 參數

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
