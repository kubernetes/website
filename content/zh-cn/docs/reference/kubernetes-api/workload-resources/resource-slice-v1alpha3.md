---
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "ResourceSlice"
content_type: "api_reference"
description: "ResourceSlice 表示一个或多个资源，这些资源位于同一个驱动所管理的、彼此相似的资源构成的资源池。"
title: "ResourceSlice v1alpha3"
weight: 18
---
<!--
api_metadata:
  apiVersion: "resource.k8s.io/v1alpha3"
  import: "k8s.io/api/resource/v1alpha3"
  kind: "ResourceSlice"
content_type: "api_reference"
description: "ResourceSlice represents one or more resources in a pool of similar resources, managed by a common driver."
title: "ResourceSlice v1alpha3"
weight: 18
auto_generated: true
-->

`apiVersion: resource.k8s.io/v1alpha3`

`import "k8s.io/api/resource/v1alpha3"`

<!--
## ResourceSlice {#ResourceSlice}

ResourceSlice represents one or more resources in a pool of similar resources, managed by a common driver. A pool may span more than one ResourceSlice, and exactly how many ResourceSlices comprise a pool is determined by the driver.

At the moment, the only supported resources are devices with attributes and capacities. Each device in a given pool, regardless of how many ResourceSlices, must have a unique name. The ResourceSlice in which a device gets published may change over time. The unique identifier for a device is the tuple \<driver name>, \<pool name>, \<device name>.
-->
## ResourceSlice {#ResourceSlice}

ResourceSlice 表示一个或多个资源，这些资源位于同一个驱动所管理的、彼此相似的资源构成的资源池。
一个池可以包含多个 ResourceSlice，一个池包含多少个 ResourceSlice 由驱动确定。

目前，所支持的资源只能是具有属性和容量的设备。
给定池中的每个设备，无论有多少个 ResourceSlice，必须具有唯一名称。
发布设备的 ResourceSlice 可能会随着时间的推移而变化。
设备的唯一标识符是元组 \<驱动名称\>、\<池名称\>、\<设备名称\>。

<!--
Whenever a driver needs to update a pool, it increments the pool.Spec.Pool.Generation number and updates all ResourceSlices with that new number and new resource definitions. A consumer must only use ResourceSlices with the highest generation number and ignore all others.

When allocating all resources in a pool matching certain criteria or when looking for the best solution among several different alternatives, a consumer should check the number of ResourceSlices in a pool (included in each ResourceSlice) to determine whether its view of a pool is complete and if not, should wait until the driver has completed updating the pool.
-->
每当驱动需要更新池时，pool.spec.pool.generation 编号加一，
并用新的编号和新的资源定义来更新所有 ResourceSlice。
资源用户必须仅使用 generation 编号最大的 ResourceSlice，并忽略所有其他 ResourceSlice。

从池中分配符合某些条件的所有资源或在多个不同分配方案间寻找最佳方案时，
资源用户应检查池中的 ResourceSlice 数量（包含在每个 ResourceSlice 中），
以确定其对池的视图是否完整，如果不完整，则应等到驱动完成对池的更新。

<!--
For resources that are not local to a node, the node name is not set. Instead, the driver may use a node selector to specify where the devices are available.

This is an alpha type and requires enabling the DynamicResourceAllocation feature gate.
-->
对于非某节点本地的资源，节点名称不会被设置。
驱动可以使用节点选择算符来给出设备的可用位置。

此特性为 Alpha 级别，需要启用 DynamicResourceAllocation 特性门控。

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: ResourceSlice

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata

- **spec** (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSliceSpec" >}}">ResourceSliceSpec</a>), required

  Contains the information published by the driver.
  
  Changing the spec automatically increments the metadata.generation number.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。

- **spec** (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSliceSpec" >}}">ResourceSliceSpec</a>)，必需

  包含驱动所发布的信息。
  
  更改 spec 会自动让 metadata.generation 编号加一。

## ResourceSliceSpec {#ResourceSliceSpec}

<!--
ResourceSliceSpec contains the information published by the driver in one ResourceSlice.
-->
ResourceSliceSpec 包含驱动在一个 ResourceSlice 中所发布的信息。

<hr>

<!--
- **driver** (string), required

  Driver identifies the DRA driver providing the capacity information. A field selector can be used to list only ResourceSlice objects with a certain driver name.
  
  Must be a DNS subdomain and should end with a DNS domain owned by the vendor of the driver. This field is immutable.
-->
- **driver** (string)，必需

  driver 标明提供容量信息的 DRA 驱动。可以使用字段选择算符仅列举具有特定驱动名称的 ResourceSlice 对象。
  
  字段值必须是 DNS 子域名并且应以驱动供应商所拥有的 DNS 域结尾。此字段是不可变更的。

<!--
- **pool** (ResourcePool), required

  Pool describes the pool that this ResourceSlice belongs to.

  <a name="ResourcePool"></a>
  *ResourcePool describes the pool that ResourceSlices belong to.*
-->
- **pool** (ResourcePool)，必需

  pool 描述 ResourceSlice 所属的池。

  <a name="ResourcePool"></a>
  **ResourcePool 描述 ResourceSlice 所属的池。**

  <!--
  - **pool.generation** (int64), required

    Generation tracks the change in a pool over time. Whenever a driver changes something about one or more of the resources in a pool, it must change the generation in all ResourceSlices which are part of that pool. Consumers of ResourceSlices should only consider resources from the pool with the highest generation number. The generation may be reset by drivers, which should be fine for consumers, assuming that all ResourceSlices in a pool are updated to match or deleted.
    
    Combined with ResourceSliceCount, this mechanism enables consumers to detect pools which are comprised of multiple ResourceSlices and are in an incomplete state.
  -->

  - **pool.generation** (int64)，必需

    generation 跟踪池中随时间发生的变化。每当驱动更改池中一个或多个资源的某些内容时，
    它必须为所有属于该池的 ResourceSlice 更改 generation。
    ResourceSlice 的使用者应仅考虑池中 generation 编号最大的资源。
    generation 可以被驱动重置，这对于使用者来说应该没问题，
    前提是池中的所有 ResourceSlice 都已被更新以匹配，或都已被删除。
    
    结合 resourceSliceCount，此机制让使用者能够检测资源池包含多个
    ResourceSlice 且处于不完整状态的情况。

  <!--
  - **pool.name** (string), required

    Name is used to identify the pool. For node-local devices, this is often the node name, but this is not required.
    
    It must not be longer than 253 characters and must consist of one or more DNS sub-domains separated by slashes. This field is immutable.
  -->

  - **pool.name** (string)，必需

    name 用作池的标识符。对于节点本地设备，字段值通常是节点名称，但这不是必须的。
    
    此字段不得超过 253 个字符，并且必须由一个或多个用斜杠分隔的 DNS 子域组成。此字段是不可变更的。

  <!--
  - **pool.resourceSliceCount** (int64), required

    ResourceSliceCount is the total number of ResourceSlices in the pool at this generation number. Must be greater than zero.
    
    Consumers can use this to check whether they have seen all ResourceSlices belonging to the same pool.
  -->

  - **pool.resourceSliceCount** (int64)，必需

    resourceSliceCount 是池中带有对应 generation 编号的 ResourceSlice 的总数。必须大于零。
    
    资源用户可以使用此字段检查他们是否能看到属于同一池的所有 ResourceSlice。

<!--
- **allNodes** (boolean)

  AllNodes indicates that all nodes have access to the resources in the pool.
  
  Exactly one of NodeName, NodeSelector and AllNodes must be set.
-->
- **allNodes** (boolean)

  allNodes 表示所有节点都可以访问池中的资源。
  
  nodeName、nodeSelector 和 allNodes 之一必须被设置。

<!--
- **devices** ([]Device)

  *Atomic: will be replaced during a merge*
  
  Devices lists some or all of the devices in this pool.
  
  Must not have more than 128 entries.

  <a name="Device"></a>
  *Device represents one individual hardware instance that can be selected based on its attributes. Besides the name, exactly one field must be set.*
-->
- **devices** ([]Device)

  **原子性：将在合并期间被替换**
  
  devices 列举池中的部分或全部设备。
  
  列表大小不得超过 128 个条目。

  <a name="Device"></a>
  **Device 表示可以基于其属性进行选择的一个单独硬件实例。name 之外，必须且只能设置一个字段。**

  <!--
  - **devices.name** (string), required

    Name is unique identifier among all devices managed by the driver in the pool. It must be a DNS label.

  - **devices.basic** (BasicDevice)

    Basic defines one device instance.

    <a name="BasicDevice"></a>
    *BasicDevice defines one device instance.*
  -->

  - **devices.name** (string)，必需

    name 是池中由驱动所管理的设备的标识符，在所有设备中唯一。此字段值必须是 DNS 标签。

  - **devices.basic** (BasicDevice)

    basic 定义一个设备实例。

    <a name="BasicDevice"></a>
    **BasicDevice 定义一个设备实例。**

    <!--
    - **devices.basic.attributes** (map[string]DeviceAttribute)

      Attributes defines the set of attributes for this device. The name of each attribute must be unique in that set.
      
      The maximum number of attributes and capacities combined is 32.

      <a name="DeviceAttribute"></a>
      *DeviceAttribute must have exactly one field set.*
    -->

    - **devices.basic.attributes** (map[string]DeviceAttribute)

      attributes 定义设备的属性集。在该集合中每个属性的名称必须唯一。
      
      attributes 和 capacities 两个映射合起来，最多包含 32 个属性。

      <a name="DeviceAttribute"></a>
      **DeviceAttribute 必须设置一个字段。**

      <!--
      - **devices.basic.attributes.bool** (boolean)

        BoolValue is a true/false value.

      - **devices.basic.attributes.int** (int64)

        IntValue is a number.

      - **devices.basic.attributes.string** (string)

        StringValue is a string. Must not be longer than 64 characters.

      - **devices.basic.attributes.version** (string)

        VersionValue is a semantic version according to semver.org spec 2.0.0. Must not be longer than 64 characters.
      -->

      - **devices.basic.attributes.bool** (boolean)

        bool 字段值是 true/false。

      - **devices.basic.attributes.int** (int64)

        int 字段值是一个整数。

      - **devices.basic.attributes.string** (string)

        string 字段值是一个字符串。不得超过 64 个字符。

      - **devices.basic.attributes.version** (string)

        version 字段值是符合 semver.org 2.0.0 规范的语义版本。不得超过 64 个字符。

    <!--
    - **devices.basic.capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      Capacity defines the set of capacities for this device. The name of each capacity must be unique in that set.
      
      The maximum number of attributes and capacities combined is 32.
    -->

    - **devices.basic.capacity** (map[string]<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

      capacity 定义设备的容量集。在该集合中每个容量的名称必须唯一。
      
      attributes 和 capacities 两个映射合起来，最多包含 32 个属性。

<!--
- **nodeName** (string)

  NodeName identifies the node which provides the resources in this pool. A field selector can be used to list only ResourceSlice objects belonging to a certain node.
  
  This field can be used to limit access from nodes to ResourceSlices with the same node name. It also indicates to autoscalers that adding new nodes of the same type as some old node might also make new resources available.
  
  Exactly one of NodeName, NodeSelector and AllNodes must be set. This field is immutable.
-->
- **nodeName** (string)

  nodeName 标明提供池中资源的某个节点。可以使用字段选择算符仅列举属于特定节点的 ResourceSlice 对象。
  
  此字段可用于限制节点只能访问具有相同节点名称的 ResourceSlice。
  此字段还向负责添加相同类型节点的自动扩缩容程序指明，某些旧节点也能够提供新资源供访问。
  
  nodeName、nodeSelector 和 allNodes 三个字段必须设置其一。此字段是不可变更的。

<!--
- **nodeSelector** (NodeSelector)

  NodeSelector defines which nodes have access to the resources in the pool, when that pool is not limited to a single node.
  
  Must use exactly one term.
  
  Exactly one of NodeName, NodeSelector and AllNodes must be set.

  <a name="NodeSelector"></a>
  *A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.*
-->
- **nodeSelector** (NodeSelector)

  nodeSelector 定义当池所涉及的节点不止一个时，在哪些节点上可以访问到资源。
  
  此字段中只能设置一个判定条件。
  
  nodeName、nodeSelector 和 allNodes 三个字段必须设置其一。

  <a name="NodeSelector"></a>
  **NodeSelector 表示在一组节点上一个或多个标签查询结果的并集；
  也就是说，它表示由节点选择算符条件所表示的选择算符的逻辑或计算结果。**

  <!--
  - **nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), required

    *Atomic: will be replaced during a merge*
    
    Required. A list of node selector terms. The terms are ORed.

    <a name="NodeSelectorTerm"></a>
    *A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.*
  -->

  - **nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm)，必需

    **原子性：将在合并期间被替换**

    必需。节点选择算符条件的列表。这些条件最终会被按照逻辑或操作组合起来。

    <a name="NodeSelectorTerm"></a>
    **未指定或空的节点选择算符条件不会匹配任何对象。各个条件最少是按逻辑与运算组合到一起的。
    TopologySelectorTerm 类型实现了 NodeSelectorTerm 的一个子集。**

    <!--
    - **nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's labels.

    - **nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      *Atomic: will be replaced during a merge*
      
      A list of node selector requirements by node's fields.
    -->

    - **nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      **原子性：将在合并期间被替换**
      
      基于节点标签的节点选择算符要求的列表。

    - **nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

      **原子性：将在合并期间被替换**
      
      基于节点字段的节点选择算符要求的列表。

## ResourceSliceList {#ResourceSliceList}

<!--
ResourceSliceList is a collection of ResourceSlices.
-->
ResourceSliceList 是 ResourceSlice 的集合。

<hr>

- **apiVersion**: resource.k8s.io/v1alpha3

- **kind**: ResourceSliceList

<!--
- **items** ([]<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>), required

  Items is the list of resource ResourceSlices.

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata
-->
- **items** ([]<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>)，必需

  items 是 ResourceSlice 资源的列表。

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准的列表元数据。

<!--
## Operations {#Operations}

<hr>

### `get` read the specified ResourceSlice

#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 ResourceSlice

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/resourceslices/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceSlice

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  ResourceSlice 的名称。

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ResourceSlice

#### HTTP Request
-->
### `list` 列举或监视类别为 ResourceSlice 的对象

#### HTTP 请求

GET /apis/resource.k8s.io/v1alpha3/resourceslices

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

200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSliceList" >}}">ResourceSliceList</a>): OK

401: Unauthorized

<!--
### `create` create a ResourceSlice

#### HTTP Request
-->
### `create` 创建 ResourceSlice

#### HTTP 请求

POST /apis/resource.k8s.io/v1alpha3/resourceslices

<!--
#### Parameters

- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>, required

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

- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>，必需

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

200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ResourceSlice

#### HTTP Request
-->
### `update` 替换指定的 ResourceSlice

#### HTTP 请求

PUT /apis/resource.k8s.io/v1alpha3/resourceslices/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceSlice

- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>, required

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

  ResourceSlice 的名称。

- **body**: <a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>，必需

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

200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ResourceSlice

#### HTTP Request
-->
### `patch` 部分更新指定的 ResourceSlice

#### HTTP 请求

PATCH /apis/resource.k8s.io/v1alpha3/resourceslices/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceSlice

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

  ResourceSlice 的名称。

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

200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Created

401: Unauthorized

<!--
### `delete` delete a ResourceSlice

#### HTTP Request
-->
### `delete` 删除 ResourceSlice

#### HTTP 请求

DELETE /apis/resource.k8s.io/v1alpha3/resourceslices/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the ResourceSlice

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
#### 参数

- **name** (**路径参数**): string，必需

  ResourceSlice 的名称。

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

200 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-slice-v1alpha3#ResourceSlice" >}}">ResourceSlice</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ResourceSlice

#### HTTP Request
-->
### `deletecollection` 删除 ResourceSlice 的集合

#### HTTP 请求

DELETE /apis/resource.k8s.io/v1alpha3/resourceslices

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
