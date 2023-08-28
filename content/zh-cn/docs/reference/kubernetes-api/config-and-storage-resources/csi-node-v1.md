---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSINode"
content_type: "api_reference"
description: "CSINode 包含节点上安装的所有 CSI 驱动有关的信息。"
title: "CSINode"
weight: 9
---
<!--
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSINode"
content_type: "api_reference"
description: "CSINode holds information about all CSI drivers installed on a node."
title: "CSINode"
weight: 9
-->

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## CSINode {#CSINode}
<!--
CSINode holds information about all CSI drivers installed on a node. CSI drivers do not need to create the CSINode object directly. As long as they use the node-driver-registrar sidecar container, the kubelet will automatically populate the CSINode object for the CSI driver as part of kubelet plugin registration. CSINode has the same name as a node. If the object is missing, it means either there are no CSI Drivers available on the node, or the Kubelet version is low enough that it doesn't create this object. CSINode has an OwnerReference that points to the corresponding node object.
-->
CSINode 包含节点上安装的所有 CSI 驱动有关的信息。CSI 驱动不需要直接创建 CSINode 对象。
只要这些驱动使用 node-driver-registrar 边车容器，kubelet 就会自动为 CSI 驱动填充 CSINode 对象，
作为 kubelet 插件注册操作的一部分。CSINode 的名称与节点名称相同。
如果不存在此对象，则说明该节点上没有可用的 CSI 驱动或 Kubelet 版本太低无法创建该对象。
CSINode 包含指向相应节点对象的 OwnerReference。

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

  标准的对象元数据。metadata.name 必须是 Kubernetes 节点的名称。

- **spec** (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINodeSpec" >}}">CSINodeSpec</a>)，必需

  spec 是 CSINode 的规约。

## CSINodeSpec {#CSINodeSpec}
<!--
CSINodeSpec holds information about the specification of all CSI drivers installed on a node
-->
CSINodeSpec 包含一个节点上安装的所有 CSI 驱动规约有关的信息。

<hr>

<!--
- **drivers** ([]CSINodeDriver), required

  *Patch strategy: merge on key `name`*

  drivers is a list of information of all CSI Drivers existing on a node. If all drivers in the list are uninstalled, this can become empty.

  <a name="CSINodeDriver"></a>
  *CSINodeDriver holds information about the specification of one CSI driver installed on a node*

  - **drivers.name** (string), required

    name represents the name of the CSI driver that this object refers to. This MUST be the same name returned by the CSI GetPluginName() call for that driver.
-->
- **drivers** ([]CSINodeDriver)，必需

  **补丁策略：按照键 `name` 合并**

  drivers 是节点上存在的所有 CSI 驱动的信息列表。如果列表中的所有驱动均被卸载，则此字段可以为空。

  <a name="CSINodeDriver"></a>
  **CSINodeDriver 包含一个节点上安装的一个 CSI 驱动规约有关的信息。**

  - **drivers.name** (string)，必需

    name 表示该对象引用的 CSI 驱动的名称。此字段值必须是针对该驱动由 CSI GetPluginName() 调用返回的相同名称。

  <!--
  - **drivers.nodeID** (string), required
    nodeID of the node from the driver point of view. This field enables Kubernetes to communicate with storage systems that do not share the same nomenclature for nodes. For example, Kubernetes may refer to a given node as "node1", but the storage system may refer to the same node as "nodeA". When Kubernetes issues a command to the storage system to attach a volume to a specific node, it can use this field to refer to the node name using the ID that the storage system will understand, e.g. "nodeA" instead of "node1". This field is required.
  -->

  - **drivers.nodeID** (string)，必需

    从驱动角度来看，这是节点的 nodeID。
    对于未与节点共享相同命名法的存储系统，此字段使得 Kubernetes 能够与之进行通信。
    例如，Kubernetes 可能将给定节点视为 "node1"，但存储系统可以将同一节点视为 "nodeA"。
    当 Kubernetes 向存储系统发出一条命令将一个卷挂接到特定的节点时，
    它可以藉此字段使用存储系统所理解的 ID 引用节点名称，例如使用 “nodeA” 而不是 “node1”。
    此字段是必需的。

  <!--
  - **drivers.allocatable** (VolumeNodeResources)

    allocatable represents the volume resources of a node that are available for scheduling. This field is beta.

    <a name="VolumeNodeResources"></a>
    *VolumeNodeResources is a set of resource limits for scheduling of volumes.*
  -->

  - **drivers.allocatable** (VolumeNodeResources)

    allocatable 表示一个节点上可供调度的卷资源。此字段处于 beta 阶段。

    <a name="VolumeNodeResources"></a>

    **VolumeNodeResources 是调度卷时所用的一组资源限制。**
    <!--
    - **drivers.allocatable.count** (int32)

      count indicates the maximum number of unique volumes managed by the CSI driver that can be used on a node. A volume that is both attached and mounted on a node is considered to be used once, not twice. The same rule applies for a unique volume that is shared among multiple pods on the same node. If this field is not specified, then the supported number of volumes on this node is unbounded.
    -->

    - **drivers.allocatable.count** (int32)

      这是一个节点上可使用的、由 CSI 驱动管理的独立卷个数的上限。
      挂接并挂载到一个节点上的卷被视为被使用一次，不是两次。
      相同的规则适用于同一个节点上多个 Pod 之间共享的同一个卷。
      如果未指定此字段，则该节点上支持的卷数量是无限的。

  <!--
  - **drivers.topologyKeys** ([]string)

    topologyKeys is the list of keys supported by the driver. When a driver is initialized on a cluster, it provides a set of topology keys that it understands (e.g. "company.com/zone", "company.com/region"). When a driver is initialized on a node, it provides the same topology keys along with values. Kubelet will expose these topology keys as labels on its own node object. When Kubernetes does topology aware provisioning, it can use this list to determine which labels it should retrieve from the node object and pass back to the driver. It is possible for different nodes to use different topology keys. This can be empty if driver does not support topology.
  -->

  - **drivers.topologyKeys** ([]string)

    topologyKeys 是驱动支持的键的列表。
    在集群上初始化一个驱动时，该驱动将提供一组自己理解的拓扑键
    （例如 “company.com/zone”、“company.com/region”）。
    在一个节点上初始化一个驱动时，该驱动将提供相同的拓扑键和值。
    Kubelet 将在其自己的节点对象上将这些拓扑键暴露为标签。
    当 Kubernetes 进行拓扑感知的制备时，可以使用此列表决定应从节点对象中检索哪些标签并传回驱动。
    不同的节点可以使用不同的拓扑键。
    如果驱动不支持拓扑，则此字段可以为空。

## CSINodeList {#CSINodeList}
<!--
CSINodeList is a collection of CSINode objects.
-->
CSINodeList 是 CSINode 对象的集合。

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

  标准的列表元数据。更多信息：
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

### `get` 读取指定的 CSINode

#### HTTP 请求

GET /apis/storage.k8s.io/v1/csinodes/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSINode
- **pretty** (*in query*): string
-->
#### 参数
- **name** (**路径参数**): string，必需

  CSINode 的名称

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应
200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind CSINode
#### HTTP Request
-->
### `list` 列出或观测类别为 CSINode 的对象
#### HTTP 请求

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
200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINodeList" >}}">CSINodeList</a>): OK

401: Unauthorized

<!--
### `create` create a CSINode
#### HTTP Request
-->
### `create` 创建 CSINode
#### HTTP 请求

POST /apis/storage.k8s.io/v1/csinodes

<!--
#### Parameters
- **body**: <a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>，必需

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
200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified CSINode
#### HTTP Request
-->
### `update` 替换指定的 CSINode

#### HTTP 请求

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
#### 参数

- **name** (**路径参数**): string，必需

  CSINode 的名称

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>，必需

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified CSINode
#### HTTP Request
-->
### `patch` 部分更新指定的 CSINode

#### HTTP 请求

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
#### 参数

- **name** (**路径参数**): string，必需

  CSINode 的名称

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Created

401: Unauthorized

<!--
### `delete` delete a CSINode
#### HTTP Request
-->
### `delete` 删除 CSINode

#### HTTP 请求

DELETE /apis/storage.k8s.io/v1/csinodes/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the CSINode
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 参数
- **name** (**路径参数**): string，必需

  CSINode 的名称

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of CSINode
#### HTTP Request
-->
### `deletecollection` 删除 CSINode 的集合

#### HTTP 请求

DELETE /apis/storage.k8s.io/v1/csinodes

<!--
#### Parameters
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
